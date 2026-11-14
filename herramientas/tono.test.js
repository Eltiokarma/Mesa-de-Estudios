'use strict';
// Tono de la retroalimentación (13 nov 2026, pedido de Gerson; docs/escena-viva.md, reglas 8 y 10):
// el error se explica sin retar al alumno y sin investigación a la vista. Si esta prueba falla,
// corre `python3 -I herramientas/pasada-tono.py` y revisa a mano lo que quede.
const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');

const RAIZ = path.join(__dirname, '..');
const escenas = fs.readdirSync(path.join(RAIZ, 'plantillas'))
  .map(d => path.join(RAIZ, 'plantillas', d, 'index.html')).filter(f => fs.existsSync(f));
const VEREDICTOS = ['app/practica.js', 'app/lectura.js'].map(f => path.join(RAIZ, f));

test('ninguna escena arranca el error con «Elegiste la X» ni cierra con «La correcta está marcada»', () => {
  const malas = escenas.filter(f => /Elegiste la (?:opción )?(?:[A-E1-9]|\$\{)|correcta está marcada/i
    .test(fs.readFileSync(f, 'utf8').replace(/\.replace\(\/\^Elegiste[^)]*\)/g, '')));
  assert.deepStrictEqual(malas.map(f => path.relative(RAIZ, f)), []);
});

// Las formas fijas que ya limpió la pasada no vuelven. Las escritas a mano las vigila la prueba que sigue.
test('no vuelven las frases fijas de investigación en la retroalimentación', () => {
  const RE = /Esta opción es una hipótesis nuestra|Hipótesis nuestra: |Es una idea documentada|Son errores que suponemos|El objetivo más difícil del test|Según [A-ZÁÉÍÓÚÇ][^.'`<]{0,80}\((?:19|20)\d{2}\)/;
  const malas = [];
  for (const f of escenas) fs.readFileSync(f, 'utf8').split('\n').forEach((l, i) => {
    if (!l.includes('fuente') && RE.test(l)) malas.push(`${path.relative(RAIZ, f)}:${i + 1}`);
  });
  assert.deepStrictEqual(malas, []);
});

// Las citas escritas a mano («En un estudio con 979 escolares…», «Quílez (2017) describe…», «está descrito en la
// investigación, sin porcentaje», «(AR17 del informe…)») tampoco llegan al alumno (regla 8). Se mira lo que ve el
// alumno: fuera de comentarios, de los párrafos .fuente y de los campos de respaldo (RES(…), 'documentado').
// Los datos del problema («de los 200 alumnos de la encuesta, el 40 %…») no son investigación y no se marcan.
const CITA = new RegExp([
  String.raw`\b(?:[Uu]n|[Oo]tro|[Ee]se|[Ee]ste|[Dd]el|[Ee]l) estudio\b`,
  String.raw`\b(?:está|están|es una idea|son ideas|es un error|es la dificultad)(?: [a-z]+)? (?:documentad|descrit)`,
  String.raw`descrit[oa]s? (?:en|por) (?:la investigación|escolares|universitarios|futuros profesores)`,
  String.raw`lo que leímos|sin porcentaje|que suponemos|hipótesis nuestra|extensión nuestra|variante nuestra|por su resumen|según resúmenes|un resumen de|por (?:verificar|confirmar)\b|no pudimos revisar|solo vimos fragmentos`,
  String.raw`\bde \d+ (?:escolares|universitarios|estudiantes)\b|\bestudiantes de (?:ingeniería|posgrado|pedagogía)`,
  String.raw`\b[A-ZÁÉÍÓÚŞÇ][a-záéíóúñüşç-]+ y otros,? \(?(?:19|20)\d{2}`,
  String.raw`\((?:[A-ZÁÉÍÓÚŞÇ][^()'\x60<>]{0,60}, )(?:19|20)\d{2}[),;]`,
  String.raw`\b[A-ZÁÉÍÓÚŞÇ][a-záéíóúñüşç]+ \((?:19|20)\d{2}(?:\)|, ítems?)`,
  String.raw`\b(?:del|nuestro) informe\b|\bel informe (?:describe|recoge|pide|no)`,
].join('|'));

// Una línea que abre o arma un párrafo .fuente queda oculta (pegatina.css); «una fuente de energía» no cuenta.
const FUENTE = /class="fuente"|\bfuente\w*\s*\(|\$\{fuente\w*|const fuente\w* =/;

function lineasVisibles(texto) {
  // Quita los bloques /* … */ (conservando las líneas) y los comentarios de línea.
  const sinBloques = texto.replace(/\/\*[\s\S]*?\*\//g, m => m.replace(/[^\n]/g, ''));
  return sinBloques.split('\n').map(l => l.replace(/(^|\s)\/\/\s.*$/, '').replace(/RES\('[^']*'(?:,\s*'[^']*')?\)/g, ''));
}

test('ninguna cita de investigación escrita a mano queda a la vista del alumno', () => {
  const malas = [];
  for (const f of escenas) {
    const lineas = lineasVisibles(fs.readFileSync(f, 'utf8'));
    // Constantes con una cita: solo pueden usarse dentro de un párrafo .fuente.
    // Las que ya abren un párrafo .fuente (const HIP = `<p class="fuente">…`) esconden también lo que sigue en su línea.
    const citas = new Set(), ocultas = new Set();
    lineas.forEach(l => {
      const m = l.match(/^\s*const (\w+) = ['\x60](.*)/);
      const abre = m && (m[2].includes('class="fuente"') || [...ocultas].some(o => m[2].startsWith(`${'$'}{${o}}`)));
      if (abre) ocultas.add(m[1]); else if (m && CITA.test(m[2])) citas.add(m[1]);
    });
    const RE_OCULTA = ocultas.size ? new RegExp(String.raw`\$\{(?:${[...ocultas].join('|')})\b`) : /$^/;
    lineas.forEach((l, i) => {
      if (FUENTE.test(l) || RE_OCULTA.test(l)) return;
      const def = l.match(/^\s*const (\w+) = /);
      if (def && citas.has(def[1])) return;
      const usa = [...citas].some(c => new RegExp(String.raw`\$\{${c}\}|\b${c}\b\s*\+|\+\s*${c}\b`).test(l));
      if (usa || CITA.test(l)) malas.push(`${path.relative(RAIZ, f)}:${i + 1}`);
    });
  }
  assert.deepStrictEqual(malas, []);
});

test('el texto del error va en tinta, no en rojo', () => {
  const rojas = escenas.filter(f => /\.(fb|msg)\.mal\{color:var\(--warn\)\}/.test(fs.readFileSync(f, 'utf8')));
  assert.deepStrictEqual(rojas.map(f => path.relative(RAIZ, f)), []);
});

test('los veredictos de la práctica y la lectura no dicen «Elegiste la X»', () => {
  for (const f of VEREDICTOS) assert.doesNotMatch(fs.readFileSync(f, 'utf8'), /`Elegiste la \$\{/);
});

test('las escenas ocultan al alumno los párrafos de fuentes (nucleo/pegatina.css)', () => {
  assert.match(fs.readFileSync(path.join(RAIZ, 'nucleo/pegatina.css'), 'utf8'), /\.fuente\{display:none/);
});

test('ninguna retroalimentación empieza con «; mira…» (resto de la pasada de tono, 14 nov 2026)', () => {
  // Al quitar «Elegiste la X» quedaba solo «; mira la escena para ver por qué.» en el error de «¿Qué pasa si…?».
  for (const f of fs.readdirSync(path.join(RAIZ, 'plantillas'))) {
    const html = path.join(RAIZ, 'plantillas', f, 'index.html');
    if (!fs.existsSync(html)) continue;
    assert.ok(!/[`'"];\s*mira /.test(fs.readFileSync(html, 'utf8')), `${f}: hay un mensaje que empieza con «; mira…»`);
  }
});
