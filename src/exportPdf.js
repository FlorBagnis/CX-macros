// Exporta las plantillas a un PDF de texto real (se puede seleccionar y copiar).
// Usa los colores que la app está mostrando en ese momento (modo claro u oscuro).

const JSPDF_URL = "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js";

function loadJsPDF() {
  if (window.jspdf?.jsPDF) return Promise.resolve(window.jspdf.jsPDF);
  return new Promise((resolve, reject) => {
    const s = document.createElement("script");
    s.src = JSPDF_URL;
    s.onload = () =>
      window.jspdf?.jsPDF ? resolve(window.jspdf.jsPDF) : reject(new Error("jsPDF no disponible"));
    s.onerror = () => reject(new Error("No se pudo cargar jsPDF"));
    document.head.appendChild(s);
  });
}

// Convierte cualquier color CSS a [r, g, b, a]
function toRGBA(css) {
  const cv = document.createElement("canvas");
  cv.width = cv.height = 1;
  const ctx = cv.getContext("2d", { willReadFrequently: true });
  ctx.clearRect(0, 0, 1, 1);
  ctx.fillStyle = css;
  ctx.fillRect(0, 0, 1, 1);
  const d = ctx.getImageData(0, 0, 1, 1).data;
  return [d[0], d[1], d[2], d[3] / 255];
}
const solid = (css) => {
  if (!css) return null;
  const [r, g, b, a] = toRGBA(css);
  return a > 0.05 ? [r, g, b] : null;
};
const mix = (a, b, t) => a.map((v, i) => Math.round(v * t + b[i] * (1 - t)));

function findBackground(el) {
  while (el) {
    const c = solid(getComputedStyle(el).backgroundColor);
    if (c) return c;
    el = el.parentElement;
  }
  return null;
}

function readPalette() {
  const dark = document.documentElement.dataset.theme === "dark";
  const app = document.querySelector(".app") || document.body;
  const bg = findBackground(app) || (dark ? [24, 16, 22] : [255, 255, 255]);
  const text = solid(getComputedStyle(app).color) || (dark ? [245, 235, 240] : [51, 51, 51]);
  const cardEl = document.querySelector(".preview") || document.querySelector(".detail");
  const card = (cardEl && solid(getComputedStyle(cardEl).backgroundColor)) || mix(text, bg, 0.06);
 const accentEl = document.querySelector(".primary");
const titleEl = document.querySelector("header h1");
const accent = !dark && titleEl
  ? solid(getComputedStyle(titleEl).color) || [190, 24, 93]
  : (accentEl && solid(getComputedStyle(accentEl).backgroundColor)) ||
    (dark ? [244, 114, 182] : [230, 100, 140]);
  
  return {
    bg, text, card, accent,
    muted: mix(text, bg, 0.62),
    border: mix(text, bg, 0.16),
  };
}

// El PDF estándar no soporta emojis: se quitan (tildes, ñ, ¡ y ¿ sí funcionan)
const clean = (s) =>
  String(s ?? "")
    .replace(/\r/g, "")
    .replace(/[^\n\u0020-\u007E\u00A1-\u00FF\u2013\u2014\u2018\u2019\u201C\u201D\u2022\u2026\u20AC]/g, "")
    .replace(/[ \t]+\n/g, "\n")
    .trim();

export async function exportTemplatesPdf(templates) {
  const jsPDF = await loadJsPDF();
  const P = readPalette();
  const pdf = new jsPDF({ unit: "mm", format: "a4" });
  pdf.setProperties({ title: "CX-Macros - Reporte de Plantillas" });

  const W = 210, H = 297, M = 16, CW = W - 2 * M, PAD = 4, LH = 5.2;
  let y;

  const paint = () => {
    pdf.setFillColor(...P.bg);
    pdf.rect(0, 0, W, H, "F");
  };
  const newPage = () => {
    pdf.addPage();
    paint();
    y = M;
  };

  // Encabezado
  paint();
  y = M + 4;
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(20);
  pdf.setTextColor(...P.accent);
  pdf.text("CX-Macros - Reporte de Plantillas", M, y);
  y += 3;
  pdf.setDrawColor(...P.accent);
  pdf.setLineWidth(0.6);
  pdf.line(M, y, W - M, y);
  y += 6;
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(10);
  pdf.setTextColor(...P.muted);
  pdf.text(`Generado el ${new Date().toLocaleDateString("es-AR")} \u00B7 ${templates.length} plantillas`, M, y);
  y += 10;

  // Plantillas
  templates.forEach((t, idx) => {
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(12);
    const titleLines = pdf.splitTextToSize(`${idx + 1}. ${clean(t.title)}`, CW);
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(10.5);
    const lines = pdf.splitTextToSize(clean(t.body), CW - PAD * 2);

    const head = titleLines.length * 5.5 + 6;
    const minBody = Math.min(lines.length, 3) * LH + PAD * 2;
    if (y + head + minBody > H - M) newPage();

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(12);
    pdf.setTextColor(...P.text);
    titleLines.forEach((ln) => { pdf.text(ln, M, y + 4); y += 5.5; });

    pdf.setFontSize(8.5);
    pdf.setTextColor(...P.accent);
    pdf.text(`CATEGOR\u00CDA: ${clean(t.category).toUpperCase()}`, M, y + 3);
    y += 6;

    let i = 0;
    while (i < lines.length) {
      const n = Math.floor((H - M - y - PAD * 2) / LH);
      if (n < 1) { newPage(); continue; }
      const chunk = lines.slice(i, i + n);
      const h = chunk.length * LH + PAD * 2;
      pdf.setFillColor(...P.card);
      pdf.setDrawColor(...P.border);
      pdf.setLineWidth(0.3);
      pdf.roundedRect(M, y, CW, h, 2, 2, "FD");
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(10.5);
      pdf.setTextColor(...P.text);
      chunk.forEach((ln, k) => pdf.text(ln, M + PAD, y + PAD + LH * (k + 0.75)));
      y += h;
      i += n;
      if (i < lines.length) newPage();
    }
    y += 8;
  });

  // Firma con corazoncito dibujado
  if (y + 14 > H - M) newPage();
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(10);
  pdf.setTextColor(...P.accent);
  pdf.text("Creado by Flor Bagnis", W - M - 6, y + 4, { align: "right" });
  const r = 0.9, cx = W - M - 2.6, cy = y + 3;
  pdf.setFillColor(...P.accent);
  pdf.circle(cx - r, cy, r, "F");
  pdf.circle(cx + r, cy, r, "F");
  pdf.triangle(cx - 2 * r * 0.97, cy + r * 0.2, cx + 2 * r * 0.97, cy + r * 0.2, cx, cy + r * 3.1, "F");

  // Numeración
  const total = pdf.getNumberOfPages();
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(8.5);
  pdf.setTextColor(...P.muted);
  for (let p = 1; p <= total; p++) {
    pdf.setPage(p);
    pdf.text(`${p} / ${total}`, W / 2, H - 8, { align: "center" });
  }

  pdf.save("CX-Macros-Reporte-Plantillas.pdf");
}
