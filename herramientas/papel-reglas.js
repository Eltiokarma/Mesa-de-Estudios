// Reglas del lápiz y papel de las unidades con calidad 2 (Etapa 5, 19 nov 2026). Lo que las auditorías de 11 de las 15
// primeras unidades pidieron para el papel (rutinas/auditoria/: «el papel y la práctica, bajo el punto 13»), como reglas
// que comprueba una máquina sobre plantillas/<id>/papel.json. Lista en lenguaje claro: docs/metodo/unidad/reglas-validador.md.
//
//   const { revisar, aplicar, EXCEPCIONES, REGLAS } = require('./papel-reglas.js');
//   revisar({ id, ficha, papel }, calidad2)  → [{ regla, plantilla, problema, que }]   (calidad2: Set de unidades con calidad 2)
//   node herramientas/papel-reglas.js         lista los hallazgos de todas las plantillas (con y sin excepción)
//
// Solo se miran las plantillas que sirven a una unidad con `calidad: 2`, y de ellas los problemas de esa unidad (si el
// problema dice sus `unidades`). El papel de lectura (formato «lectura») no entra: su clave son letras y su dato es el texto.
'use strict';
const fs = require('node:fs');
const path = require('node:path');
const RAIZ = path.join(__dirname, '..');

const REGLAS = {
  'papel-unidad': 'La respuesta de un problema de papel lleva su unidad cuando la magnitud la tiene (si la solución escribe «25 m/s», la respuesta no dice «25»).',
  'papel-datos': 'Todo problema de papel de una unidad con calidad 2 da sus datos y fórmulas: el campo `datos` (lista) o «Datos:» al final del enunciado.',
  'papel-unidades': 'Si la plantilla sirve a dos unidades o más, cada problema de su papel dice de cuáles es (`unidades`).',
};

// Faltas reales encontradas al escribir las reglas (19 nov 2026). No son permiso: son la lista de pendientes.
//   { regla, plantilla, problema ('*' = todos los del archivo), unidad, motivo, fecha }
const EXCEPCIONES = [
  // papel-datos
  { regla: 'papel-datos', plantilla: 'cinematica-medias', problema: '*', unidad: 'fisica.movimiento-rectilineo y fisica.mruv-y-caida-libre', motivo: 'p1 a p6 (los de MRU y MRUV) sin Datos', fecha: '2026-11-19' },
  { regla: 'papel-datos', plantilla: 'numeros-sucesiones', problema: '*', unidad: 'aritmetica.numeracion', motivo: 'sus 10 problemas sin Datos; además no dice de qué unidad es cada uno', fecha: '2026-11-19' },
  { regla: 'papel-datos', plantilla: 'orden-informacion', problema: '*', unidad: 'razonamiento-matematico.razonamiento-deductivo', motivo: 'papel de la escena, sus 10 problemas sin Datos; además no dice de qué unidad es cada uno', fecha: '2026-11-19' },
  { regla: 'papel-datos', plantilla: 'quimica-conceptos', problema: 'p2', unidad: 'quimica.materia-y-energia', motivo: 'p2 (V/F de materia) sin Datos; los demás de la unidad ya los traen', fecha: '2026-11-19' },
  // papel-unidades
  { regla: 'papel-unidades', plantilla: 'cuadrado-crece', problema: '*', unidad: 'algebra.productos-notables y algebra.exponentes-y-productos-notables', motivo: 'sirve a 3 unidades y ningún problema dice de cuál es (escena con rehacer)', fecha: '2026-11-19' },
  { regla: 'papel-unidades', plantilla: 'mruv', problema: '*', unidad: 'fisica.movimiento-rectilineo y fisica.mruv-y-caida-libre', motivo: 'sirve a 2 unidades y ningún problema dice de cuál es (escena con rehacer)', fecha: '2026-11-19' },
  { regla: 'papel-unidades', plantilla: 'numeros-sucesiones', problema: '*', unidad: 'aritmetica.numeracion', motivo: 'sirve a 6 unidades y ningún problema dice de cuál es', fecha: '2026-11-19' },
  { regla: 'papel-unidades', plantilla: 'triangulo-estira', problema: '*', unidad: 'geometria.triangulos', motivo: 'sirve a 4 unidades y ningún problema dice de cuál es (escena con rehacer)', fecha: '2026-11-19' },
];

// ---------- Unidades de medida ----------
const ATOMO = '(?:km|hm|dm|cm|mm|nm|μm|kg|mg|ms|min|kJ|kW|kPa|Pa|atm|mmHg|mol|mL|Hz|kcal|cal|eV|rad|m|g|s|h|N|J|W|K|L|V|A|C|Ω|u)';
const PALABRA = '(?:metros?|kil[oó]metros?|cent[ií]metros?|segundos?|minutos?|horas?|d[ií]as?|años?|gramos?|kilogramos?|litros?|mililitros?|newtons?|joules?|soles|grados)';
const LETRAS = `(?:${ATOMO}[²³]?(?:\\s?[/·]\\s?\\(?(?:°C|${ATOMO})[²³]?\\)?)*|${PALABRA})`;
const NUM = '[+−-]?\\d+(?:[\\u00a0\\u202f\\u2009 ]\\d{3})*(?:[.,]\\d+)?(?:\\s*\\/\\s*\\d+)?(?:\\s*[×·]\\s*10[⁰¹²³⁴⁵⁶⁷⁸⁹⁻]+)?';
const norma = x => String(x).replace(/[\s\u00a0\u202f\u2009]/g, '').replace(/^[+]/, '').replace('-', '−');
// Los números de un texto, cada uno con la unidad que lo sigue ('' si no lleva): [{ n, unidad }].
function valores(txt) {
  const out = [];
  // La unidad va tras un espacio («25 m/s»; «4s» es un orbital y «2x», un coeficiente); «°», «°C» y «%» van pegados.
  const re = new RegExp(`(?<![\\p{L}\\p{N}_.,⁰¹²³⁴⁵⁶⁷⁸⁹₀-₉^])(${NUM})(?:\\s?(°C|°F|°|%)|[ \\u00a0\\u202f](${LETRAS})(?![\\p{L}\\p{N}_]))?`, 'gu');
  for (const m of String(txt).matchAll(re)) {
    const sigue = String(txt)[m.index + m[0].length] || '';
    // Un número pegado a una letra o a una raíz («2√2 m», «3k», «4s») es un coeficiente o un nombre, no una medida suelta.
    if (!m[2] && !m[3] && /[\p{L}√∛(]/u.test(sigue)) continue;
    out.push({ n: norma(m[1]), unidad: m[2] || m[3] || '' });
  }
  return out;
}

const plano = x => (Array.isArray(x) ? x.map(plano).join(' ') : x && typeof x === 'object' ? String(x.t ?? '') : String(x ?? ''));

function revisar({ id, ficha, papel }, calidad2) {
  const out = [];
  const unidades = (ficha && ficha.unidades) || [];
  if (!papel || !Array.isArray(papel.problemas) || (ficha && ficha.formato === 'lectura')) return out;
  const deC2 = unidades.filter(u => calidad2.has(u));
  if (!deC2.length) return out;
  // Una escena que espera rehacerse ("rehacer": true o la lista de unidades; va a «Más mesas del tema») no entra en
  // papel-datos ni papel-unidad para esas unidades: su papel se rehace con ella.
  const rehacer = u => ficha.rehacer === true || (Array.isArray(ficha.rehacer) && ficha.rehacer.includes(u));
  for (const p of papel.problemas) {
    const mal = (regla, que) => out.push({ regla, plantilla: id, problema: p.id, que });
    // papel-unidades
    const propias = Array.isArray(p.unidades) ? p.unidades : null;
    if (unidades.length >= 2) {
      if (!propias || !propias.length) mal('papel-unidades', `la plantilla sirve a ${unidades.length} unidades y el problema no dice de cuáles es (unidades: [...])`);
      else for (const u of propias) if (!unidades.includes(u)) mal('papel-unidades', `«${u}» no es una unidad de la plantilla`);
    }
    // Lo demás, solo en los problemas de una unidad con calidad 2.
    if (!(propias && propias.length ? propias : unidades).some(u => calidad2.has(u) && !rehacer(u))) continue;
    // papel-datos
    const tieneDatos = (Array.isArray(p.datos) && p.datos.length > 0 && p.datos.every(x => plano(x).trim())) || /\bDatos:\s*\S/.test(plano(p.enunciado));
    if (!tieneDatos) mal('papel-datos', 'sin datos: el problema da sus equivalencias, valores y fórmulas en `datos` (lista) o tras «Datos:» en el enunciado');
    // papel-unidad: un número de la respuesta va solo y la solución lo escribe, la última vez, con su unidad.
    const resp = plano(p.respuesta).replace(/^\s*[A-E]\)\s*/, '');
    const pasos = valores(plano(p.pasos || []));
    const vistos = new Set();
    for (const v of valores(resp)) {
      if (v.unidad || vistos.has(v.n)) continue;
      vistos.add(v.n);
      const enPasos = pasos.filter(x => x.n === v.n);
      const ultimo = enPasos[enPasos.length - 1];
      if (ultimo && ultimo.unidad) mal('papel-unidad', `la respuesta dice «${v.n}» sin unidad y la solución termina en «${v.n} ${ultimo.unidad}»: la respuesta lleva su unidad`);
    }
  }
  return out;
}

const cubre = (x, h) => x.regla === h.regla && x.plantilla === h.plantilla && (x.problema === '*' || x.problema === h.problema);
function aplicar(entrada, calidad2) {
  const fallan = [], pendientes = [];
  for (const h of revisar(entrada, calidad2)) (EXCEPCIONES.some(x => cubre(x, h)) ? pendientes : fallan).push(h);
  return { fallan, pendientes };
}

// Las unidades con calidad 2 (se lee el archivo de la teoría sin cargarlo: una unidad a medias no rompe esta lista).
function unidadesCalidad2() {
  const dir = path.join(RAIZ, 'contenido', 'teoria'), out = new Set();
  for (const c of fs.readdirSync(dir, { withFileTypes: true }).filter(d => d.isDirectory())) {
    for (const f of fs.readdirSync(path.join(dir, c.name)).filter(f => f.endsWith('.js') && !f.endsWith('.test.js'))) {
      if (/^\s*calidad:\s*2\b/m.test(fs.readFileSync(path.join(dir, c.name, f), 'utf8'))) out.add(`${c.name}.${f.replace(/\.js$/, '')}`);
    }
  }
  return out;
}
// Todas las plantillas con papel: [{ id, ficha, papel }].
function plantillasConPapel() {
  const dir = path.join(RAIZ, 'plantillas'), out = [];
  for (const id of fs.readdirSync(dir).sort()) {
    const ff = path.join(dir, id, 'plantilla.json'), fp = path.join(dir, id, 'papel.json');
    if (!fs.existsSync(ff) || !fs.existsSync(fp)) continue;
    try { out.push({ id, ficha: JSON.parse(fs.readFileSync(ff, 'utf8')), papel: JSON.parse(fs.readFileSync(fp, 'utf8')) }); } catch (e) { /* un archivo a medias: lo dice su propia prueba */ }
  }
  return out;
}

if (require.main === module) {
  const c2 = unidadesCalidad2();
  for (const x of plantillasConPapel()) {
    const { fallan, pendientes } = aplicar(x, c2);
    for (const h of fallan) console.log(`FALLA     ${h.plantilla} ${h.problema} [${h.regla}] ${h.que}`);
    for (const h of pendientes) console.log(`pendiente ${h.plantilla} ${h.problema} [${h.regla}] ${h.que}`);
  }
}

module.exports = { REGLAS, EXCEPCIONES, revisar, aplicar, valores, unidadesCalidad2, plantillasConPapel };
