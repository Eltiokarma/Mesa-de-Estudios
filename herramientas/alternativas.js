// ¿Las alternativas delatan la correcta? Mide, por fuente, cuatro pistas de forma que no dependen
// de saber el tema:
//   1. largo: la correcta es la más larga, sola (al azar, más o menos 1 de cada n opciones).
//   2. justifica: la correcta es la única que explica su porqué («porque», «ya que», «: …»).
//   3. marcas: la correcta es la única con negrita, cursiva o marcas (**, <b>, ✓, …).
//   4. letra (generadores): la correcta cae casi siempre en la misma letra.
// Fuentes: el banco de pruebas por curso (catalogo/pruebas/*.json), los textos de lectura
// (contenido/razonamiento-verbal/textos/*.json) y cada generador del formato "predicciones"
// (plantillas/*/generador.js) con muchas semillas.
//   node herramientas/alternativas.js        → tabla en Markdown
// La prueba automática (herramientas/alternativas.test.js) usa los mismos números y los umbrales de UMBRAL.
const fs = require('node:fs');
const path = require('node:path');

const RAIZ = path.join(__dirname, '..');
// Una alternativa "justifica" si explica su porqué. «: » cuenta solo si sigue texto (no «Razón: 2»).
// «Un puesto que merecía» no es «puesto que». También los conectores de consecuencia («por eso», «de modo que»): dan la razón igual que «porque».
const JUSTIFICA = /(?<!\p{L})(porque|ya que|(?<!\b(?:un|el|su|del|al|mi|tu|ese|este) )puesto que|dado que|debido a que|pues|por eso|por ello|por lo que|así que|de modo que|de manera que)(?!\p{L})|:\s+\p{L}/iu;
const MARCAS = /\*\*|__|<\/?(b|strong|em|i|mark|u)\b|[✓✔★☆]|\*[^*\s][^*]*\*/i;
// justifica: al azar casi nunca pasa que una sola opción explique su porqué, así que el umbral es bajo.
const UMBRAL = { largo: 0.35, minLargo: 20, justifica: 0.1, letra: 0.5, semillas: 300 };

// items: [{ id, opciones: [texto], correcta: índice, letra? }]
function medir(items) {
  let largo = 0, corto = 0, justifica = 0, marcas = 0, azar = 0;
  const letras = {}, casosMarcas = [], casosJustifica = [];
  for (const it of items) {
    const t = it.opciones.map(x => String(x).trim()), c = it.correcta, n = t.length;
    azar += 1 / n;
    const L = t.map(x => [...x].length);
    if (L.every((l, i) => i === c || l < L[c])) largo++;
    if (L.every((l, i) => i === c || l > L[c])) corto++; // la pista al revés: solo informa, sin umbral
    const j = t.map(x => JUSTIFICA.test(x));
    if (j[c] && j.filter(Boolean).length === 1) { justifica++; casosJustifica.push(it.id); }
    const m = t.map(x => MARCAS.test(x));
    if (m[c] && m.filter(Boolean).length === 1) { marcas++; casosMarcas.push(it.id); }
    if (it.letra) letras[it.letra] = (letras[it.letra] || 0) + 1;
  }
  const n = items.length;
  const letraMax = Object.entries(letras).sort((a, b) => b[1] - a[1])[0];
  return {
    n, largo: n ? largo / n : 0, corto: n ? corto / n : 0, largoAzar: n ? azar / n : 0, justifica, marcas, casosMarcas, casosJustifica,
    letras, letraMax: letraMax ? { letra: letraMax[0], tasa: letraMax[1] / n } : null,
  };
}

const leer = f => JSON.parse(fs.readFileSync(f, 'utf8'));

// Banco de pruebas: cada forma (A y B) de cada par, también los de reserva.
function itemsBanco(archivo) {
  const b = leer(archivo), out = [];
  for (const p of [...(b.pares || []), ...(b.reserva || [])]) for (const f of ['A', 'B']) {
    const it = p[f]; if (!it) continue;
    out.push({ id: `${b.curso}:${p.par}${f}`, opciones: it.opciones.map(o => o.texto), correcta: it.opciones.findIndex(o => o.correcta) });
  }
  return out;
}
function fuentesBanco() {
  const dir = path.join(RAIZ, 'catalogo', 'pruebas');
  return fs.readdirSync(dir).filter(f => f.endsWith('.json')).sort()
    .map(f => ({ fuente: `banco ${f.replace(/\.json$/, '')}`, tipo: 'banco', items: itemsBanco(path.join(dir, f)) }));
}

// Textos de lectura: cada pregunta, con sus alternativas en el orden del banco.
function itemsLectura() {
  const dir = path.join(RAIZ, 'contenido', 'razonamiento-verbal', 'textos'), out = [];
  for (const f of fs.readdirSync(dir).filter(x => x.endsWith('.json')).sort()) {
    const t = leer(path.join(dir, f));
    for (const q of t.preguntas || []) {
      if (!q.alternativas) continue;
      out.push({ id: `${t.id}.${q.id}`, opciones: q.alternativas.map(a => a.t), correcta: q.alternativas.findIndex(a => a.correcta === true) });
    }
  }
  return out;
}

// Generadores: muchas semillas de cada uno, con la letra en que cayó la correcta.
function fuentesGeneradores(semillas = UMBRAL.semillas) {
  const dir = path.join(RAIZ, 'plantillas');
  return fs.readdirSync(dir).filter(d => fs.existsSync(path.join(dir, d, 'generador.js'))).sort().map(d => {
    const g = require(path.join(dir, d, 'generador.js')), items = [];
    for (let s = 0; s < semillas; s++) {
      const p = g.generar(`alternativas-${s}`), c = p.alternativas.findIndex(a => a.correcta);
      items.push({ id: p.id, opciones: p.alternativas.map(a => a.texto), correcta: c, letra: p.alternativas[c].letra });
    }
    return { fuente: `generador ${d}`, tipo: 'generador', items };
  });
}

function fuentes(opciones = {}) {
  const banco = fuentesBanco();
  return [
    ...banco,
    { fuente: 'banco (todos los cursos)', tipo: 'banco-total', items: banco.flatMap(b => b.items) },
    { fuente: 'lectura (textos)', tipo: 'lectura', items: itemsLectura() },
    ...fuentesGeneradores(opciones.semillas),
  ];
}

// Problemas de una fuente según los umbrales. Lista vacía si pasa.
function problemas(f, m) {
  const mal = [];
  const pct = x => `${Math.round(x * 100)} %`;
  if (m.n >= UMBRAL.minLargo && m.largo > UMBRAL.largo) mal.push(`${f.fuente}: la correcta es la más larga, sola, en el ${pct(m.largo)} de ${m.n} ítems (umbral ${pct(UMBRAL.largo)})`);
  if (m.marcas) mal.push(`${f.fuente}: la correcta es la única con marcas en ${m.marcas} ítem(s): ${m.casosMarcas.slice(0, 5).join(', ')}`);
  if (m.n >= UMBRAL.minLargo && m.justifica / m.n > UMBRAL.justifica) mal.push(`${f.fuente}: la correcta es la única que justifica en el ${pct(m.justifica / m.n)} de los ítems (umbral ${pct(UMBRAL.justifica)}): ${m.casosJustifica.slice(0, 5).join(', ')}`);
  if (f.tipo === 'generador' && m.letraMax && m.letraMax.tasa > UMBRAL.letra) mal.push(`${f.fuente}: la correcta cae en la ${m.letraMax.letra} el ${pct(m.letraMax.tasa)} de las veces`);
  return mal;
}

function tabla(lista) {
  const pct = x => `${Math.round(x * 100)} %`;
  let md = '| Fuente | Ítems | 1. Más larga, sola (azar) | Más corta, sola | 2. Única que justifica | 3. Única con marcas | 4. Letra más frecuente |\n| --- | --- | --- | --- | --- | --- | --- |\n';
  for (const f of lista) {
    const m = medir(f.items);
    md += `| ${f.fuente} | ${m.n} | ${pct(m.largo)} (${pct(m.largoAzar)}) | ${pct(m.corto)} | ${m.justifica} | ${m.marcas} | ${m.letraMax ? `${m.letraMax.letra} ${pct(m.letraMax.tasa)}` : '—'} |\n`;
  }
  return md;
}

module.exports = { JUSTIFICA, MARCAS, UMBRAL, medir, problemas, fuentes, fuentesBanco, itemsLectura, fuentesGeneradores, tabla };

if (require.main === module) {
  const lista = fuentes();
  process.stdout.write(tabla(lista));
  const mal = lista.flatMap(f => problemas(f, medir(f.items)));
  if (mal.length) process.stdout.write('\n' + mal.map(x => `- ${x}`).join('\n') + '\n');
}
