import { useEffect, useRef, useState } from "react";

// ---------- Corrector online (LanguageTool) ----------
const LT_URL = "https://api.languagetool.org/v2/check";
const MAX_CHARS = 18000;
// Categorías de "estilo" que no queremos aplicar solas
const BLOQUEADAS = new Set([
  "STYLE", "REDUNDANCY", "COLLOQUIALISMS", "REPETITIONS_STYLE",
  "PLAIN_ENGLISH", "WIKIPEDIA", "GENDER_NEUTRALITY",
]);

const sinTildes = (s) => s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
const acentos = (s) => (s.match(/[áéíóúÁÉÍÓÚ]/g) || []).length;

function lev(a, b) {
  const dp = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array(b.length).fill(0)]);
  for (let j = 1; j <= b.length; j++) dp[0][j] = j;
  for (let i = 1; i <= a.length; i++)
    for (let j = 1; j <= b.length; j++)
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,
        dp[i][j - 1] + 1,
        dp[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)
      );
  return dp[a.length][b.length];
}

export async function corregirConLanguageTool(texto) {
  if (!texto || !texto.trim() || texto.length > MAX_CHARS) return { texto, cambios: 0 };

  const res = await fetch(LT_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded", Accept: "application/json" },
    body: new URLSearchParams({ text: texto, language: "es" }),
  });
  if (!res.ok) throw new Error("LanguageTool HTTP " + res.status);
  const data = await res.json();

  // Los {{campos}} no se tocan nunca
  const protegidos = [...texto.matchAll(/\{\{\w+\}\}/g)].map((m) => [m.index, m.index + m[0].length]);
  const toca = (a, b) => protegidos.some(([s, e]) => a < e && b > s);

  const fixes = (data.matches || []).filter((m) => {
    if (!m.replacements?.length) return false;
    if (BLOQUEADAS.has(m.rule?.category?.id)) return false;
    if (toca(m.offset, m.offset + m.length)) return false;
    const orig = texto.slice(m.offset, m.offset + m.length);
    const sug = m.replacements[0].value;
    if (acentos(sug) < acentos(orig)) return false; // nunca sacar tildes (ej: voseo "completá")
    if (m.rule?.category?.id === "TYPOS") {
      // Errores de tipeo: solo tildes/mayúsculas, o palabras en minúscula con 1-2 letras de diferencia.
      // Así no se rompen nombres propios o marcas (Tiendanube, etc.)
      if (sinTildes(orig) === sinTildes(sug)) return true;
      return /^[a-záéíóúñü]/.test(orig) && lev(orig.toLowerCase(), sug.toLowerCase()) <= 2;
    }
    return true;
  });

  // Aplicar de atrás para adelante para no desfasar posiciones
  fixes.sort((a, b) => b.offset - a.offset);
  let out = texto, limite = Infinity, cambios = 0;
  for (const m of fixes) {
    if (m.offset + m.length > limite) continue; // se superpone con otra corrección
    out = out.slice(0, m.offset) + m.replacements[0].value + out.slice(m.offset + m.length);
    limite = m.offset;
    cambios++;
  }
  return { texto: out, cambios };
}

// ---------- Botón "Pulir texto" ----------
export default function PulirTexto({ draft, setDraft, corregirLocal }) {
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");
  const [previo, setPrevio] = useState(null);
  const timer = useRef(null);

  useEffect(() => () => clearTimeout(timer.current), []);

  const pulir = async () => {
    if (busy) return;
    setPrevio({ id: draft.id, title: draft.title, body: draft.body });
    setBusy(true);
    setMsg("");

    // 1) tu diccionario local (tildes, nombres, saludos)
    const local = { title: corregirLocal(draft.title), body: corregirLocal(draft.body) };
    setDraft((d) => d && { ...d, ...local });

    // 2) corrector online (tildes, comas, mayúsculas, gramática)
    try {
      const [t, b] = await Promise.all([
        corregirConLanguageTool(local.title),
        corregirConLanguageTool(local.body),
      ]);
      setDraft((d) => d && { ...d, title: t.texto, body: b.texto });
      const n = t.cambios + b.cambios;
      setMsg(n ? `✨ Listo: ${n} corrección${n === 1 ? "" : "es"} extra` : "✨ Listo, no encontré más errores");
    } catch {
      setMsg("Apliqué tu diccionario, pero no pude conectar con el corrector online. Probá de nuevo en un rato.");
    }
    setBusy(false);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setMsg(""), 6000);
  };

  const deshacer = () => {
    setDraft((d) => d && { ...d, title: previo.title, body: previo.body });
    setPrevio(null);
    setMsg("");
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6 }}>
      <div style={{ display: "flex", gap: 8 }}>
        {previo && previo.id === draft.id && !busy && (
          <button type="button" className="ghost small" onClick={deshacer} title="Volver al texto anterior">
            ↩ Deshacer
          </button>
        )}
        <button
          type="button"
          className="ghost small"
          onClick={pulir}
          disabled={busy}
          title="Corrige tildes, comas, mayúsculas y gramática"
        >
          {busy ? "Corrigiendo…" : "✨ Pulir texto"}
        </button>
      </div>
      {msg && <span role="status" style={{ fontSize: 12, opacity: 0.85, textAlign: "right" }}>{msg}</span>}
      <a href="https://languagetool.org" target="_blank" rel="noopener noreferrer" style={{ fontSize: 11, opacity: 0.6 }}>
        Corrector online: LanguageTool
      </a>
    </div>
  );
}
