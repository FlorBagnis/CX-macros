import { useEffect, useState } from "react";
import { TEMPLATES } from "./data/templates";

const VARIABLE = /\{\{(\w+)\}\}/g;
const FAV_LABEL = "★ Favoritas";

// Diccionario robusto de tildes para CX, Soporte, Apellidos y Nombres
const DICCIONARIO_TILDES = {
  // Comunicación y atención general
  "comunicacion": "comunicación",
  "atencion": "atención",
  "informacion": "información",
  "gestion": "gestión",
  "reclamacion": "reclamación",
  "reclamaciones": "reclamaciones",
  "solucion": "solución",
  "soluciones": "soluciones",
  "verificacion": "verificación",
  "configuracion": "configuración",
  "notificacion": "notificación",
  "notificaciones": "notificaciones",
  "instruccion": "instrucción",
  "instrucciones": "instrucciones",
  "operacion": "operación",
  "operaciones": "operaciones",
  "facturacion": "facturación",
  "devolucion": "devolución",
  "devoluciones": "devoluciones",
  "autorizacion": "autorización",
  "autorizaciones": "autorizaciones",
  "confirmacion": "confirmación",
  "cancelacion": "cancelación",
  "condicion": "condición",
  "condiciones": "condiciones",
  "opcion": "opción",
  "opciones": "opciones",
  "seccion": "sección",
  "situacion": "situación",
  "version": "versión",
  "sesion": "sesión",
  "transaccion": "transacción",
  "transacciones": "transacciones",
  "interaccion": "interacción",
  "interacciones": "interacciones",

  // Datos, métricas y tecnología
  "codigo": "código",
  "codigos": "códigos",
  "numero": "número",
  "numeros": "números",
  "metodo": "método",
  "metodos": "métodos",
  "estandar": "estándar",
  "estandares": "estándares",
  "parametro": "parámetro",
  "parametros": "parámetros",
  "sistema": "sistema",
  "sistemas": "sistemas",
  "electronico": "electrónico",
  "electronica": "electrónica",
  "telefonica": "telefónica",
  "telefonico": "telefónico",
  "movil": "móvil",
  "moviles": "móviles",
  "portatil": "portátil",
  "caracteristicas": "características",
  "especifico": "específico",
  "especificos": "específicos",
  "automatico": "automático",
  "automaticos": "automáticos",
  "critico": "crítico",
  "criticos": "críticos",

  // Tiempos y frecuencia
  "dia": "día",
  "dias": "días",
  "proximo": "próximo",
  "proximos": "próximos",
  "ultima": "última",
  "ultimas": "últimas",
  "ultimo": "último",
  "ultimos": "últimos",
  "rapido": "rápido",
  "rapidos": "rápidos",
  "minimo": "mínimo",
  "maximo": "máximo",
  "periodo": "período",

  // Finanzas y logística
  "envio": "envío",
  "envios": "envíos",
  "credito": "crédito",
  "creditos": "créditos",
  "debito": "débito",
  "debitos": "débitos",
  "deposito": "depósito",
  "depositos": "depósitos",
  "saldo": "saldo",
  "articulo": "artículo",
  "articulos": "artículos",
  "logistica": "logística",
  "exito": "éxito",
  "exitoso": "exitoso",

  // Verbos y otras frecuentes en soporte
  "tambien": "también",
  "mas": "más",
  "podra": "podrá",
  "podran": "podrán",
  "debera": "deberá",
  "deberan": "deberán",
  "tendra": "tendrá",
  "habra": "habrá",
  "esta": "está",
  "estan": "están",
  "sera": "será",
  "facil": "fácil",
  "dificil": "difícil",
  "util": "útil",
  "rapidamente": "rápidamente",

  // Apellidos comunes
  "gomez": "Gómez",
  "lopez": "López",
  "perez": "Pérez",
  "gonzalez": "González",
  "rodriguez": "Rodríguez",
  "fernandez": "Fernández",
  "martinez": "Martínez",
  "sanchez": "Sánchez",
  "martin": "Martín",
  "gutierrez": "Gutiérrez",
  "dominguez": "Domínguez",
  "alvarez": "Álvarez",
  "vazquez": "Vázquez",
  "ramirez": "Ramírez",
  "suarez": "Suárez",
  "benitez": "Benítez",
  "baez": "Báez",
  "nuñez": "Núñez",
  "ibañez": "Ibáñez",
  "cortes": "Cortés",
  "sainz": "Sáinz",
  "saez": "Sáez",

  // Nombres de mujer comunes con tilde
  "maria": "María",
  "josefa": "Josefa",
  "ana": "Ana",
  "belen": "Belén",
  "micaela": "Micaela",
  "sofia": "Sofía",
  "lucia": "Lucía",
  "valeria": "Valeria",
  "victoria": "Victoria",
  "agustina": "Agustina",
  "camila": "Camila",
  "florencia": "Florencia",
  "rocio": "Rocío",
  "julieta": "Julieta",
  "martina": "Martina",
  "catalina": "Catalina",
  "paula": "Paula",
  "daniela": "Daniela",
  "monica": "Mónica",
  "veronica": "Verónica",
  "patricia": "Patricia",
  "andrea": "Andrea",
  "claudia": "Claudia",
  "silvia": "Silvia",
  "natalia": "Natalia",
  "vanesa": "Vanesa",
  "daiana": "Daiana",
  "gimena": "Gimena",
  "yanina": "Yanina",
  "gisel": "Gisel",
  "gisela": "Gisela",

  // Nombres de hombre comunes con tilde
  "jose": "José",
  "angel": "Ángel",
  "tomas": "Tomás",
  "nicolas": "Nicolás",
  "lucas": "Lucas",
  "matias": "Matías",
  "joaquin": "Joaquín",
  "gaston": "Gastón",
  "damian": "Damián",
  "emiliano": "Emiliano",
  "ezequiel": "Ezequiel",
  "gonzalo": "Gonzalo",
  "ignacio": "Ignacio",
  "lautaro": "Lautaro",
  "nahuel": "Nahuel",
  "facundo": "Facundo",
  "franco": "Franco",
  "agustin": "Agustín",
  "hernan": "Hernán",
  "german": "Germán",
  "adrian": "Adrián",
  "cristian": "Cristian",
  "sebastian": "Sebastián",
  "julian": "Julián",
  "santiago": "Santiago",
  "alejandro": "Alejandro",
  "gabriel": "Gabriel",
  "daniel": "Daniel",
  "david": "David",
  "carlos": "Carlos",
  "juan": "Juan",
  "pedro": "Pedro",
  "pablo": "Pablo",
  "diego": "Diego",
  "javier": "Javier",
  "fernando": "Fernando",
  "mariano": "Mariano",
  "maximiliano": "Maximiliano",
  "nestor": "Néstor",
  "victor": "Víctor",
  "oscar": "Óscar",
  "hugo": "Hugo",
  "raul": "Raúl",
  "ruben": "Rubén",
  "ivan": "Iván",
  "israel": "Israel",
  "anibal": "Aníbal",
  "cesar": "César",
  "omar": "Omar",
  "walter": "Walter",
  "esteban": "Esteban",
  "ramon": "Ramón"
};

const corregirOrtografia = (texto) => {
  if (!texto) return "";

  // 1. Proteger variables entre llaves como {{nombre}} o {{pedido}}
  const partes = texto.split(/(\{\{\w+\}\})/g);

  const partesCorregidas = partes.map((parte) => {
    if (parte.startsWith("{{") && parte.endsWith("}}")) {
      return parte;
    }

    // Corregir palabras usando el diccionario
    let palabras = parte.split(/\b/);
    palabras = palabras.map((palabra) => {
      let lower = palabra.toLowerCase();
      if (DICCIONARIO_TILDES[lower]) {
        let corregida = DICCIONARIO_TILDES[lower];
        if (palabra[0] === palabra[0].toUpperCase()) {
          corregida = corregida.charAt(0).toUpperCase() + corregida.slice(1);
        }
        return corregida;
      }
      return palabra;
    });

    return palabras.join("");
  });

  let corregido = partesCorregidas.join("");

  // 2. Formateo inteligente de signos de exclamación en saludos (ej: "Hola Maria" -> "¡Hola, María!")
  corregido = corregido.replace(/\b(Hola|Buenas|Buenos días|Buenas tardes|Buenas noches)\s+([A-ZÁÉÍÓÚÑ][a-záéíóúñ]+)/gi, (match, saludo, nombre) => {
    const saludoFormateado = saludo.charAt(0).toUpperCase() + saludo.slice(1).toLowerCase();
    const nombreFormateado = DICCIONARIO_TILDES[nombre.toLowerCase()] || (nombre.charAt(0).toUpperCase() + nombre.slice(1).toLowerCase());
    return `¡${saludoFormateado}, ${nombreFormateado}!`;
  });

  // 3. Agregar signos de exclamación a saludos sueltos comunes si no los tienen
  corregido = corregido.replace(/^(Hola|Bienvenido|Muchas gracias|Gracias por escribirnos)(?!\s*[!¡])/gim, "¡$1!");

  // 4. Inserción de comas y limpieza general
  corregido = corregido
    .replace(/([.,!?;:])([^\s\d])/g, "$1 $2")
    .replace(/\s+/g, " ")
    .replace(/(^\s*|[.!?]\s+)([a-z])/g, (match) => match.toUpperCase())
    .trim();

  return corregido.charAt(0).toUpperCase() + corregido.slice(1);
};

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
  const isMobile = () => window.matchMedia?.("(max-width: 800px)").matches;
  const [listOpen, setListOpen] = useState(() => !isMobile());

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

  const select = (id) => { setSelectedId(id); setDraft(null); setError(""); if (isMobile()) setListOpen(false); };
  const startNew = () => { setDraft({ id: null, title: "", category: "", body: "" }); setError(""); if (isMobile()) setListOpen(false); };
  const startEdit = () => { setDraft({ ...current }); setError(""); };

  // Ejecuta la corrección avanzada en el borrador
  const handlePulirTexto = () => {
    if (!draft) return;
    setDraft({
      ...draft,
      title: corregirOrtografia(draft.title),
      body: corregirOrtografia(draft.body)
    });
  };

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

  // Función para exportar a CSV
  const exportCSV = () => {
    const headers = ["Título", "Categoría", "Texto"];
    const rows = templates.map((t) => [
      `"${t.title.replace(/"/g, '""')}"`,
      `"${t.category.replace(/"/g, '""')}"`,
      `"${t.body.replace(/"/g, '""')}"`
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "cx_macros_respuestas.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Función para exportar a PDF respetando el tema (claro/oscuro) activo
  const exportPDF = () => {
    const element = document.querySelector(".app");
    const options = {
      margin:       10,
      filename:     'cx_macros_respuestas.pdf',
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2, useCORS: true },
      jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    
    // Cargar dinámicamente html2pdf si está instalado
    import('html2pdf.js').then((html2pdf) => {
      html2pdf.default().from(element).set(options).save();
    }).catch(() => {
      window.print(); // Fallback si no está instalado el paquete
    });
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
          <button
            className="panel-toggle"
            onClick={() => setListOpen(!listOpen)}
            aria-expanded={listOpen}
            aria-controls="panel-plantillas"
          >
            <span>Plantillas ({templates.length})</span>
            <span className={`chevron ${listOpen ? "open" : ""}`} aria-hidden="true">▾</span>
          </button>
          {listOpen && (
          <div id="panel-plantillas">
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
          
          {/* Botones de Exportar */}
          <div className="export-actions" style={{ display: "flex", gap: "8px", marginTop: "12px" }}>
            <button className="ghost small" onClick={exportCSV} title="Exportar a Excel / CSV" style={{ flex: 1 }}>
              📥 CSV
            </button>
            <button className="ghost small" onClick={exportPDF} title="Exportar a PDF" style={{ flex: 1 }}>
              📄 PDF
            </button>
          </div>

          </div>
          )}
        </aside>

        <main className="detail">
          {draft ? (
            <>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h2>{draft.id === null ? "Nueva plantilla" : "Editar plantilla"}</h2>
                <button 
                  type="button" 
                  className="ghost small" 
                  onClick={handlePulirTexto}
                  title="Corrige tildes, comas, signos de exclamación y espacios"
                >
                  ✨ Pulir texto
                </button>
              </div>
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

      <footer className="credit">Creado By Flo Bagnis 💗</footer>
    </div>
  );
}
