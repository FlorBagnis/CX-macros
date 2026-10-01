import { useEffect, useState } from "react";
import { TEMPLATES } from "./data/templates";

const VARIABLE = /\{\{(\w+)\}\}/g;
const FAV_LABEL = "★ Favoritas";

// localStorage protegido: si el navegador lo bloquea, la app sigue funcionando
const load = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};
const save = (key, value) => {
  try { localStorage.setItem(key, JSON.stringify(value)); return true; } catch { return false; }
};
const initialTheme = () => {
  const stored = load("tema", null);
  if (stored === "dark" || stored === "light") return stored;
  return window.matchMedia?.("(prefers-color-scheme: dark)").matches ? "dark" : "light";
};

export default function App() {
  const [templates, setTemplates] = useState(() => {
    const t = load("plantillas", null);
    return Array.isArray(t) ? t : TEMPLATES;
  });
  const [favs, setFavs] = useState(() => {
    const f = load("favoritas", []);
    return Array.isArray(f) ? f : [];
  });
  const [theme, setTheme] = useState(initialTheme);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("Todas");
  const [selectedId, setSelectedId] = useState(templates[0]?.id ?? null);
  const [values, setValues] = useState({});
  const [copied, setCopied] = useState(false);
  const [draft, setDraft] = useState(null); // plantilla que se está creando o editando
  const [error, setError] = useState("");
  const [saveFailed, setSaveFailed] = useState(false);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    save("tema", theme);
  }, [theme]);

  const persistTemplates = (next) => {
    setTemplates(next);
    setSaveFailed(!save("plantillas", next));
  };
  const persistFavs = (next) => {
    setFavs(next);
    save("favoritas", next);
  };

  const categories = [...new Set(templates.map((t) => t.category))];
  const filters = ["Todas", FAV_LABEL, ...categories];
  const activeFilter = filters.includes(filter) ? filter : "Todas";

  const visible = templates.filter((t) => {
    const inFilter =
      activeFilter === "Todas" ||
      (activeFilter === FAV_LABEL ? favs.includes(t.id) : t.category === activeFilter);
    return inFilter && `${t.title} ${t.body}`.toLowerCase().includes(query.toLowerCase());
  });

  const current = templates.find((t) => t.id === selectedId) ?? null;
  const variables = current
    ? [...new Set([...current.body.matchAll(VARIABLE)].map((m) => m[1]))]
    : [];
  const pending = variables.filter((v) => !values[v]?.trim());
  const preview = current
    ? current.body.replace(VARIABLE, (match, name) => values[name]?.trim() || match)
    : "";

  const select = (id) => { setSelectedId(id); setDraft(null); setError(""); };
  const startNew = () => { setDraft({ id: null, title: "", category: "", body: "" }); setError(""); };
  const startEdit = () => { setDraft({ ...current }); setError(""); };

  const saveDraft = () => {
    const title = draft.title.trim();
    const body = draft.body.trim();
    const category = draft.category.trim() || "General";
    if (!title || !body) {
      setError("Completá el título y el texto de la plantilla.");
      return;
    }
    if (draft.id === null) {
      const created = { id: Date.now(), title, category, body };
      persistTemplates([...templates, created]);
      setSelectedId(created.id);
    } else {
      persistTemplates(templates.map((t) => (t.id === draft.id ? { ...t, title, category, body } : t)));
    }
    setDraft(null);
    setError("");
  };

  const remove = () => {
    if (!window.confirm(`¿Eliminar la plantilla "${current.title}"?`)) return;
    const next = templates.filter((t) => t.id !== current.id);
    persistTemplates(next);
    persistFavs(favs.filter((f) => f !== current.id));
    setSelectedId(next[0]?.id ?? null);
  };

  const restore = () => {
    if (!window.confirm("Se borran tus cambios y vuelven las plantillas de ejemplo. ¿Seguir?")) return;
    persistTemplates(TEMPLATES);
    persistFavs([]);
    setFilter("Todas");
    setSelectedId(TEMPLATES[0].id);
    setDraft(null);
  };

  const toggleFav = (id) =>
    persistFavs(favs.includes(id) ? favs.filter((f) => f !== id) : [...favs, id]);

  const copy = () => {
    navigator.clipboard.writeText(preview).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }).catch(() => {});
  };

  return (
    <div className="app">
      <header>
        <h1>Respuestas de soporte 🌸</h1>
        <p>Elegí una plantilla, completá los datos y copiá la respuesta lista.</p>
        <button
          className="theme-toggle"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          aria-label={theme === "dark" ? "Activar modo claro" : "Activar modo oscuro"}
        >
          {theme === "dark" ? "☀️" : "🌙"}
        </button>
      </header>

      {saveFailed && (
        <p className="note">No se pudo guardar en este navegador: tus cambios se pierden al cerrar la página.</p>
      )}

      <div className="layout">
        <aside>
          <input
            type="search"
            placeholder="Buscar plantilla"
            aria-label="Buscar plantilla"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <div className="filters">
            {filters.map((f) => (
              <button key={f} className={`chip ${activeFilter === f ? "active" : ""}`} onClick={() => setFilter(f)}>
                {f}
              </button>
            ))}
          </div>
          <button className="primary wide" onClick={startNew}>Nueva plantilla</button>
          <ul className="list">
            {visible.length === 0 && <li className="empty">No hay plantillas con ese filtro. Probá otra búsqueda.</li>}
            {visible.map((t) => (
              <li key={t.id}>
                <button className={`item ${t.id === selectedId && !draft ? "selected" : ""}`} onClick={() => select(t.id)}>
                  <span className="item-title">{t.title}</span>
                  <span className="item-cat">{t.category}</span>
                </button>
                <button
                  className={`star ${favs.includes(t.id) ? "on" : ""}`}
                  onClick={() => toggleFav(t.id)}
                  aria-label={favs.includes(t.id) ? "Quitar de favoritas" : "Marcar como favorita"}
                >
                  ★
                </button>
              </li>
            ))}
          </ul>
          <button className="ghost small" onClick={restore}>Restaurar plantillas de ejemplo</button>
        </aside>

        <main className="detail">
          {draft ? (
            <>
              <h2>{draft.id === null ? "Nueva plantilla" : "Editar plantilla"}</h2>
              <div className="form">
                <label>
                  Título
                  <input value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} />
                </label>
                <label>
                  Categoría
                  <input
                    list="categorias"
                    placeholder="Ej: Envíos"
                    value={draft.category}
                    onChange={(e) => setDraft({ ...draft, category: e.target.value })}
                  />
                  <datalist id="categorias">
                    {categories.map((c) => <option key={c} value={c} />)}
                  </datalist>
                </label>
                <label>
                  Texto
                  <textarea
                    rows={8}
                    value={draft.body}
                    onChange={(e) => setDraft({ ...draft, body: e.target.value })}
                  />
                </label>
                <p className="hint">Escribí {"{{nombre}}"} o {"{{pedido}}"} para crear un campo que se completa al usar la plantilla.</p>
              </div>
              {error && <p className="note">{error}</p>}
              <div className="actions">
                <button className="primary" onClick={saveDraft}>Guardar plantilla</button>
                <button className="ghost" onClick={() => { setDraft(null); setError(""); }}>Cancelar</button>
              </div>
            </>
          ) : current ? (
            <>
              <h2>{current.title}</h2>
              {variables.length > 0 && (
                <div className="fields">
                  {variables.map((v) => (
                    <label key={v}>
                      {v}
                      <input value={values[v] || ""} onChange={(e) => setValues({ ...values, [v]: e.target.value })} />
                    </label>
                  ))}
                </div>
              )}
              <div className="preview">{preview}</div>
              {pending.length > 0 && <p className="note">Falta completar: {pending.join(", ")}</p>}
              <div className="actions">
                <button className="primary" onClick={copy}>{copied ? "¡Copiado! ✨" : "Copiar respuesta"}</button>
                <button className="ghost" onClick={startEdit}>Editar</button>
                <button className="ghost danger" onClick={remove}>Eliminar</button>
              </div>
            </>
          ) : (
            <p className="empty">No hay plantillas. Creá una con "Nueva plantilla".</p>
          )}
        </main>
      </div>
    </div>
  );
}
