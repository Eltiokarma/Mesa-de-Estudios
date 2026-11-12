// Arma el papel.json (lápiz y papel, regla 6) de cada módulo de lectura a partir de su banco
// (docs/formato-lectura.md, sección 7.6). Un problema es un texto con todas sus preguntas, o un ejercicio suelto.
//
//   node herramientas/papel-lectura.js            escribe plantillas/<módulo>/papel.json de todos los módulos de lectura
//   node herramientas/papel-lectura.js --revisar  solo dice si algún papel.json no está al día (sale con 1)
//
// Lo que se conserva de la práctica:
// - Regla 3: el paso previo va en el papel como una consigna antes de las alternativas ("Antes de mirar las
//   alternativas, escribe…"), y su respuesta va con la clave.
// - Las alternativas se barajan con la semilla fija 'papel' (Lectura.preparar): en el banco la correcta suele ir
//   primera y la clave saldría siempre A. La misma semilla da siempre la misma hoja.
// - La entrada y la salida (t000a y t000b) no van al papel: son las pruebas del curso.
// - Las oraciones llevan su número, porque las explicaciones las citan así.
//
// Cuántos problemas: un módulo de verbal B tiene 4 o 5 textos (de 13 a 20 preguntas); van todos. lectura-verbal
// tiene 30 textos y 15 ejercicios: se eligen 10 que cubran sus unidades (ver elegir()), para quedar en 5 a 10
// problemas como las escenas.
const fs = require('node:fs');
const path = require('node:path');
const Lectura = require('../nucleo/lectura.js');

const RAIZ = path.join(__dirname, '..');
const MAX = 10;
const NIVEL = { 1: 'básico', 2: 'intermedio', 3: 'avanzado (tipo UNI)' };
const leer = p => JSON.parse(fs.readFileSync(p, 'utf8'));

function modulos() {
  const dir = path.join(RAIZ, 'plantillas');
  return fs.readdirSync(dir).sort()
    .map(d => ({ d, f: path.join(dir, d, 'plantilla.json') }))
    .filter(x => fs.existsSync(x.f))
    .map(x => ({ dir: path.join(dir, x.d), ficha: leer(x.f) }))
    .filter(x => x.ficha.formato === 'lectura');
}

// Ítems del banco de un módulo, en el orden del índice, sin la entrada ni la salida.
function items(ficha, dir) {
  const ruta = path.resolve(dir, ficha.banco);
  const base = path.dirname(ruta), indice = leer(ruta);
  const t = (indice.textos || []).map(id => leer(path.join(base, 'textos', id + '.json')));
  const e = (indice.ejercicios || []).map(id => leer(path.join(base, 'ejercicios', id + '.json')));
  return { textos: t, ejercicios: e };
}

// Con más de 10 ítems se eligen 10, uno por uno: el que suma más unidades nuevas; a igual cantidad, el que suma
// más tipos de pregunta nuevos; luego el de mayor dificultad y, al final, el primero del índice (textos antes que
// ejercicios). Así la hoja cubre todas las unidades del módulo que se puedan. Después se ordenan como en el índice.
function elegir({ textos, ejercicios }) {
  const todos = [...textos, ...ejercicios];
  if (todos.length <= MAX) return todos;
  const qs = it => it.preguntas || [it];
  const unidades = it => new Set(qs(it).map(q => q.unidad)), tipos = it => new Set(qs(it).map(q => q.tipo));
  const vistoU = new Set(), vistoT = new Set(), elegidos = [];
  while (elegidos.length < MAX) {
    let mejor = null, valor = -1;
    for (const it of todos) {
      if (elegidos.includes(it)) continue;
      const v = [...unidades(it)].filter(u => !vistoU.has(u)).length * 1000 + [...tipos(it)].filter(t => !vistoT.has(t)).length * 10 + (it.dificultad || 1);
      if (v > valor) { mejor = it; valor = v; }
    }
    elegidos.push(mejor);
    unidades(mejor).forEach(u => vistoU.add(u)); tipos(mejor).forEach(t => vistoT.add(t));
  }
  return elegidos.sort((a, b) => todos.indexOf(a) - todos.indexOf(b));
}

// Consigna del paso previo en papel: lo mismo que pide la app, con los verbos del papel y las opciones a la vista.
function consigna(p, it) {
  let pide = String(p.pide)
    .replace(/toca la oración( \(en inglés\))?/, 'escribe el número de la oración$1')
    .replace('arrastra las tarjetas al orden que tendría el texto', 'escribe el orden que tendría el texto')
    .replace('Antes de ver las alternativas', 'Antes de mirar las alternativas');
  const ops = l => l.map(x => `«${x}»`).join(', ');
  switch (p.tipo) {
    case 'marcar-oracion': return p.ninguna ? `${pide} Si ninguna lo dice completo, escribe «ninguna».` : pide;
    case 'clasificar': return `${pide} «${p.sonda}» Elige: ${ops(Lectura.CLASES.map(c => c.t))}.`;
    case 'proposito': return `${pide} Elige: ${ops(Lectura.PROPOSITOS.map(c => c.t))}.`;
    case 'atribuir': return `${pide} «${p.sonda}» Elige: ${ops(Lectura.ATRIBUCIONES.map(c => c.t))}.`;
    case 'relacion': return `${pide} Elige: ${ops(Lectura.RELACIONES.map(c => `${c.t} (${c.d})`))}.`;
    case 'relacion-analogia': return `${pide} Escríbela con tus palabras, por ejemplo «${Lectura.textoAnalogia('a-usa-b', (it.cuerpo || {}).base)}».`;
    default: return pide;
  }
}
const aceptadaPrevio = (p, it) => p.tipo === 'marcar-oracion' ? p.aceptadas.map(x => Lectura.etiquetaPrevio(p, x, it)).join(' o ')
  : p.tipo === 'clasificar' ? Lectura.etiquetaPrevio(p, p.clase, it) : Lectura.etiquetaPrevio(p, p.aceptada, it);

// El cuerpo de un ejercicio suelto, en líneas.
function lineasEjercicio(it) {
  const c = it.cuerpo || {}, tipo = it.preguntas[0].tipo;
  if (tipo === 'analogia' && c.base) return [`${c.base[0]} : ${c.base[1]}`];
  if (c.terminos) return [c.terminos.join(' · ')];
  if (c.oracion) return [c.oracion];
  if (c.oraciones) return c.oraciones.map(o => `${o.n || o.id}. ${o.t}`);
  return [];
}

function problema(item, k) {
  const it = Lectura.preparar(item, 'papel');
  const texto = { titulo: it.titulo };
  if (it.idioma) texto.idioma = it.idioma;
  if (it.ejercicio) texto.lineas = lineasEjercicio(it);
  else {
    let n = 0;
    texto.parrafos = it.parrafos.map(par => par.map(o => ({ n: ++n, t: o.t })));
    const figs = Lectura.figuras(it).map(({ id, ...f }) => {
      const limpia = l => (l || []).map(({ id: _, ...x }) => x);
      return f.tipo === 'tabla' ? { ...f, filas: limpia(f.filas) } : f.tipo === 'barras' ? { ...f, barras: limpia(f.barras) } : f.tipo === 'imagen' ? { ...f, partes: limpia(f.partes) } : { ...f, recuadros: limpia(f.recuadros) };
    });
    if (figs.length) texto.figuras = figs;
    // Par A/B: el rótulo de cada texto va antes de su primer párrafo ("desde", contado desde 0).
    const as = Lectura.autores(it).map(a => ({ titulo: a.titulo, ...(a.firma ? { firma: a.firma } : {}), desde: a.desde }));
    if (as.length) texto.autores = as;
  }
  const varias = it.preguntas.length > 1;
  const preguntas = it.preguntas.map((q, j) => ({
    n: j + 1,
    ...(q.previo ? { previo: consigna(q.previo, it) } : {}),
    enunciado: q.enunciado,
    alternativas: q.alternativas.map(a => ({ letra: a.letra, t: a.t })),
  }));
  const clave = it.preguntas.map((q, j) => `${varias ? `${j + 1}: ` : ''}${q.alternativas.find(a => a.correcta).letra}`).join(' · ');
  const pasos = [];
  it.preguntas.forEach((q, j) => {
    const pre = varias ? `Pregunta ${j + 1}. ` : '';
    if (q.previo) pasos.push(`${pre}Antes de las alternativas: ${aceptadaPrevio(q.previo, it)}. ${q.previo.explicacion}`);
    const c = q.alternativas.find(a => a.correcta);
    pasos.push(`${pre}Clave ${c.letra}. ${c.explicacion}`);
  });
  return {
    id: it.id,
    nivel: it.ejercicio ? (Lectura.NOMBRE_EJERCICIO[it.preguntas[0].tipo] || 'ejercicio').toLowerCase() : NIVEL[it.dificultad] || 'básico',
    enunciado: it.ejercicio ? 'Resuelve el ejercicio.'
      : `Lee el texto «${it.titulo}» y responde ${varias ? `las ${it.preguntas.length} preguntas` : 'la pregunta'}.`,
    texto, preguntas,
    respuesta: `Clave: ${clave}.`,
    pasos,
  };
}

function construir(ficha, dir) {
  const elegidos = elegir(items(ficha, dir));
  return {
    titulo: `${ficha.titulo}: lectura para lápiz y papel`,
    indicacion: 'Lee cada texto con calma y resuelve en tu hoja, sin la app. Haz lo que te pide «Antes de mirar las alternativas» tapando las alternativas con una hoja: así ves qué pensabas tú y no lo que te sugieren. Las oraciones llevan número para que puedas citarlas al revisar.',
    origen: 'Generado por herramientas/papel-lectura.js desde el banco; no se edita a mano.',
    problemas: elegidos.map(problema),
  };
}

const texto = (ficha, dir) => JSON.stringify(construir(ficha, dir), null, 2) + '\n';

module.exports = { construir, texto, elegir, consigna, modulos };

if (require.main === module) {
  const revisar = process.argv.includes('--revisar');
  let mal = 0;
  for (const { ficha, dir } of modulos()) {
    const destino = path.join(dir, 'papel.json'), nuevo = texto(ficha, dir);
    const viejo = fs.existsSync(destino) ? fs.readFileSync(destino, 'utf8') : null;
    if (revisar) { if (viejo !== nuevo) { mal++; console.log(`${ficha.id}: papel.json no está al día`); } continue; }
    if (viejo !== nuevo) fs.writeFileSync(destino, nuevo);
    console.log(`${path.relative(RAIZ, destino)}: ${JSON.parse(nuevo).problemas.length} problemas`);
  }
  if (mal) process.exit(1);
}
