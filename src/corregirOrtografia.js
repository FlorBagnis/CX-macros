// src/corregirOrtografia.js
// Corrector local (rápido, sin internet). Después PulirTexto.jsx le suma LanguageTool.
// Requiere mover tu diccionario a src/data/diccionario.js con:
//   export const DICCIONARIO_TILDES = { ... };
// (y sacarle "esta" y "tomas", que son ambiguas: "esta semana" / "tomas agua")
import { DICCIONARIO_TILDES } from "./data/diccionario";

const ABREVIATURAS = { q: "que", tb: "también", tmb: "también" };
const SALUDOS = "Hola|Buen día|Buenos días|Buenas tardes|Buenas noches|Buenas";
const NO_ES_NOMBRE = new Set([
  "gracias", "bienvenido", "bienvenida", "soy", "te", "le", "me", "nos", "mi",
  "por", "para", "como", "en", "es", "un", "una", "el", "la", "queria", "quería",
]);

// Cosas que nunca se tocan: {{campos}}, links y mails
const PROTEGIDOS =
  /\{\{\w+\}\}|https?:\/\/\S*[^\s.,;:!?)]|www\.\S*[^\s.,;:!?)]|[\w.+-]+@[\w-]+(?:\.[\w-]+)+/g;
const INI = "\uE000";
const FIN = "\uE001";

const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
const esMayus = (s) => s[0] !== s[0].toLowerCase();

export function corregirOrtografia(texto) {
  if (!texto) return "";

  // 0) Guardar lo protegido
  const guardados = [];
  let t = texto.replace(PROTEGIDOS, (m) => {
    guardados.push(m);
    return `${INI}${guardados.length - 1}${FIN}`;
  });

  // 1) Espacios (sin romper los saltos de línea)
  t = t
    .replace(/[ \t]+/g, " ")
    .replace(/ *\n */g, "\n")
    .replace(/\n{3,}/g, "\n\n");

  // 2) Palabra por palabra: tildes y abreviaturas
  t = t.replace(/\p{L}+/gu, (palabra) => {
    const lower = palabra.toLowerCase();
    const abrev = ABREVIATURAS[lower];
    if (abrev) return esMayus(palabra) ? cap(abrev) : abrev;

    const destino = DICCIONARIO_TILDES[lower];
    if (!destino || destino === lower) return palabra;

    if (palabra.length > 1 && palabra === palabra.toUpperCase()) return destino.toUpperCase();
    // Nombres y apellidos: solo si ya los escribiste con mayúscula
    // (así "tomas" verbo o "angel" común no se convierten en nombres)
    if (esMayus(destino)) return esMayus(palabra) ? destino : palabra;
    return esMayus(palabra) ? cap(destino) : destino;
  });

  // 3) Saludo + nombre  ->  ¡Hola, María!
  const reSaludo = new RegExp(
    `(^|[.!?\\n]\\s*)¡?(${SALUDOS})[,!]?[ \\t]+(${INI}\\d+${FIN}|\\p{L}+)[,!]?`,
    "giu"
  );
  t = t.replace(reSaludo, (m, pre, saludo, nombre) => {
    const placeholder = nombre.startsWith(INI);
    const dic = DICCIONARIO_TILDES[nombre.toLowerCase()];
    const nombreEnDic = dic && esMayus(dic);
    const parece =
      placeholder ||
      nombreEnDic ||
      (esMayus(nombre) && !NO_ES_NOMBRE.has(nombre.toLowerCase()));
    if (!parece) return m;
    const n = placeholder ? nombre : nombreEnDic ? dic : cap(nombre);
    return `${pre}¡${cap(saludo.toLowerCase())}, ${n}!`;
  });

  // 4) Signos de apertura que faltan: ¿...?  ¡...!
  t = t.replace(/(^|[.!?\n]\s*)([^.!?¿¡\n]+\?)/g, (m, pre, q) => `${pre}¿${q}`);
  t = t.replace(/(^|[.!?\n]\s*)([^.!?¿¡\n]+!)/g, (m, pre, q) => `${pre}¡${q}`);

  // 5) Espacios alrededor de la puntuación
  t = t.replace(/[ \t]+([.,;!?])/g, "$1"); // "hola ," -> "hola,"
  t = t.replace(/([.,;:!?])(?=[\p{L}¿¡\uE000])/gu, (p, _g, offset, str) => {
    const resto = str.slice(offset + 1);
    if (p === ".") {
      if (/^(?:com|net|org|ar|io|app|me|co|es)\b/i.test(resto)) return p; // tienda.com
      if (/\b\p{L}$/u.test(str.slice(0, offset))) return p; // S.A. / a.m.
    }
    if (p === ":" && /^[DPpOoSsVv]\b/.test(resto)) return p; // :D :P
    return p + " ";
  });

  // 6) Mayúscula al empezar oración (sin romper los puntos suspensivos)
  t = t.replace(/(^|(?<!\.\.)[.!?]\s+|\n\s*|[¡¿])(\p{Ll})/gu, (m, pre, c) => pre + c.toUpperCase());

  // 7) Devolver lo protegido
  return t.replace(/\uE000(\d+)\uE001/g, (_, i) => guardados[Number(i)]).trim();
}
