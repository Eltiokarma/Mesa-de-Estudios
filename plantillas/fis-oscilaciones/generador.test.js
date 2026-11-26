'use strict';
const test = require('node:test'), assert = require('node:assert/strict');
const fs = require('node:fs'), path = require('node:path'), vm = require('node:vm');
const G = require('./generador.js');
const { probarGenerador, probarFugas, dentroDeEscala } = require('../../nucleo/probar-generador.js');
const UNIDAD = 'fisica.oscilaciones', FUENTE = 'docs/etapa11/errores-fisica.md';
const raiz = path.resolve(__dirname, '../..');
const fuenteErrores = fs.readFileSync(path.join(raiz, FUENTE), 'utf8');
const plano = x => Array.isArray(x) ? x.map(plano).join('') : x && typeof x === 'object' ? String(x.t) : String(x ?? '');
const palabras = x => plano(x).trim().split(/\s+/).filter(Boolean).length;
const COLOR = { x: 'i', A: 'i', L: 'i', d: 'i', v: 'o', F: 'd', a: 'd', m: 'f', k: 'f', N: 'f', t: 'h', T: 'h', f: 'h', omega: 'h', phi: 'h', g: 'h', EC: 'o', EPE: 'i', EM: 'f' };
const recorrer = (x, f) => { if (Array.isArray(x)) x.forEach(y => recorrer(y, f)); else f(x); };

// Las pruebas físicas, de cada operación y de cada igualdad están en
// oraculo.test.js. Estas pruebas comprueban el contrato completo del producto.
probarGenerador(G, { semillas: 400 });

test('las seis ideas conservan tres niveles y los filtros no mezclan familias', () => {
  const ideas = require('../../contenido/teoria/fisica/oscilaciones.js').ideas.map(i => i.id);
  assert.deepEqual(Object.keys(G.TIPOS_POR_IDEA), ideas);
  assert.equal(G.TIPOS.length, 18);
  for (const [idea, tipos] of Object.entries(G.TIPOS_POR_IDEA)) {
    assert.deepEqual(tipos.map(t => G.NIVEL[t]), [1, 2, 3]);
    const vistos = new Set();
    for (let semilla = 0; semilla < 400; semilla++) {
      const p = G.generar(semilla, { unidad: UNIDAD, idea }); assert.equal(p._datos.idea, idea); vistos.add(p._datos.tipo);
    }
    assert.deepEqual([...vistos].sort(), [...tipos].sort());
    for (const tipo of tipos) assert.equal(G.generar(0, { unidad: UNIDAD, idea, tipo })._datos.tipo, tipo);
  }
  assert.throws(() => G.generar(0, { unidad: 'fisica.gravitacion' }), /unidad ajena/);
  assert.throws(() => G.generar(0, { idea: 'desconocida' }), /idea desconocida/);
  assert.throws(() => G.generar(0, { tipo: 'desconocido' }), /tipo desconocido/);
  assert.throws(() => G.generar(0, { tipo: 'energia-total', idea: 'pendulo' }), /ajeno/);
});

for (const tipo of G.TIPOS) {
  const gen = { id: G.id + '/' + tipo, generar: semilla => G.generar(semilla, { tipo }) };
  probarFugas(gen, { semillas: 400, grupo: p => [p._datos.tipo, p._datos.pide || p._datos.conexion || ''].join('/') });
  test(`${tipo}: 400 casos con Datos, colores, alternativas y procedencia válidos`, () => {
    const respuestas = new Set();
    for (let semilla = 0; semilla < 400; semilla++) {
      const p = gen.generar(semilla), d = p._datos; respuestas.add(p.respuesta.valor);
      assert.equal(d.tipo, tipo); assert.equal(d.nivel, G.NIVEL[tipo]);
      for (const k of ['valor', 'respuesta', 'correcta', 'resultado']) assert.ok(!(k in d), `No hay resultado oculto en _datos.${k}`);
      assert.ok(Array.isArray(p.datos) && p.datos.length >= 1 && p.datos.length <= 6);
      for (const linea of p.datos) {
        assert.equal(typeof linea, 'string'); assert.ok(palabras(linea) <= 22, linea);
        assert.doesNotMatch(linea, /\b(recuerda|primero halla|debes|conviene|no olvides)\b/i);
        assert.doesNotMatch(linea, /(?:\b[TFaEmvA]\s*[=≈]\s*[A-Za-zωφ]|energía\s*[=≈]|\b[km]\s*·\s*[xg])/);
      }
      assert.ok(palabras(p.enunciado) <= 40, plano(p.enunciado));
      assert.ok(palabras(p.pregunta) <= 40, plano(p.pregunta));
      assert.ok(p.solucion.length >= 2 && p.solucion.length <= 5);
      const usadas = new Set();
      recorrer([p.enunciado, p.pregunta, p.solucion], tramo => {
        if (typeof tramo === 'string') return;
        assert.ok(tramo && typeof tramo === 'object'); assert.deepEqual(Object.keys(tramo).sort(), ['t', 'v']);
        assert.equal(typeof tramo.t, 'string'); assert.ok(tramo.t.length); usadas.add(tramo.v);
        assert.ok(p.variables[tramo.v], 'Toda ficha de color está declarada');
      });
      assert.deepEqual(Object.keys(p.variables).sort(), [...usadas].sort());
      for (const [clave, v] of Object.entries(p.variables)) { assert.equal(v.color, COLOR[clave]); assert.ok(v.nombre); }
      const visible = plano([p.enunciado, p.pregunta, p.solucion]) + p.datos.join(' ') + p.alternativas.map(a => a.texto).join(' ');
      assert.doesNotMatch(visible, /\[object Object\]|\bundefined\b|\bNaN\b|\bnull\b|[₀₁₂₃₄₅₆₇₈₉]|[A-Za-z]_[A-Za-z0-9]/);
      assert.equal(p.alternativas.length, 4); assert.equal(new Set(p.alternativas.map(a => a.texto)).size, 4);
      assert.equal(new Set(p.alternativas.map(a => a.valor)).size, 4);
      const correcta = p.alternativas.find(a => a.correcta); assert.ok(correcta); assert.equal(correcta.valor, p.respuesta.valor);
      assert.equal(p._verificacion.errores.length, 3);
      for (const a of p.alternativas.filter(a => !a.correcta)) {
        assert.ok(a.error); assert.equal(a.error.respaldo, 'hipotesis'); assert.equal(a.error.fuente, FUENTE);
        assert.ok(fuenteErrores.includes(a.error.id), a.error.id);
        assert.ok(a.error.explicacion.includes(a.texto), a.error.explicacion);
        const observado = p._verificacion.errores.find(e => e.id === a.error.id); assert.ok(observado); assert.equal(observado.valor, a.valor);
        if (typeof a.valor === 'number') assert.ok(dentroDeEscala(a, correcta.valor), `${semilla}: ${a.valor} frente a ${correcta.valor}`);
      }
    }
    assert.ok(respuestas.size >= (tipo === 'resortes-conectados' ? 3 : 4), `${tipo}: variedad de resultados`);
  });
}

test('el módulo UMD funciona sin red, teoría ni otra plantilla', () => {
  const src = fs.readFileSync(path.join(__dirname, 'generador.js'), 'utf8');
  assert.doesNotMatch(src, /XMLHttpRequest|\bfetch\s*\(|require\([^)]*(?:teoria|motor\.js)/);
  const entorno = { Azar: require('../../nucleo/azar.js'), Predicciones: require('../../nucleo/predicciones.js') };
  vm.runInNewContext(src, entorno);
  const web = entorno.Generadores[G.id]; assert.ok(web);
  for (const tipo of G.TIPOS) assert.equal(JSON.stringify(web.generar(7, { tipo })), JSON.stringify(G.generar(7, { tipo })));
});

test('el renderer real de práctica recibe solo strings y fichas compatibles, sin perder colores', () => {
  const src = fs.readFileSync(path.join(raiz, 'app/practica.js'), 'utf8');
  const desde = src.indexOf('const conSub = '), hasta = src.indexOf('// Figura opcional del problema', desde);
  assert.ok(desde > 0 && hasta > desde);
  const entorno = {}; vm.runInNewContext(src.slice(desde, hasta) + '\nthis.pintar = texto;', entorno);
  const esc = require('../../nucleo/predicciones.js').xml;
  for (const tipo of G.TIPOS) for (let semilla = 0; semilla < 8; semilla++) {
    const p = G.generar(semilla, { tipo });
    const html = [p.enunciado, p.pregunta, ...p.solucion].map(fila => entorno.pintar(fila, p, esc)).join('');
    assert.doesNotMatch(html, /\[object Object\]|undefined|NaN|<sub>|class="formula"/);
    for (const v of Object.values(p.variables)) assert.ok(html.includes(`c-${v.color}`), v.nombre);
    for (const nombre of ['energía cinética', 'energía del resorte', 'energía mecánica']) if (plano(p.solucion).includes(nombre)) assert.ok(html.includes(nombre));
  }
});

test('las ocho reservas de papel cubren todas las ideas y conservan resultados adecuados al cuaderno', () => {
  const porIdea = new Set();
  for (let n = 1; n <= 8; n++) { const p = G.generar('papel-' + n); porIdea.add(p._datos.idea); assert.ok(p.datos.length); }
  assert.deepEqual([...porIdea].sort(), Object.keys(G.TIPOS_POR_IDEA).sort());
  assert.equal(G.generar('papel-6').respuesta.valor, 0.4);
  assert.equal(G.generar('papel-8').respuesta.valor, 13);
});
