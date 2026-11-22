'use strict';

// El oráculo numérico separado está en oraculo.test.js: 400 semillas por tipo.
// Aquí se verifica el contrato público, selección por idea, texto, fuentes, escala y papel.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const gen = require('./generador.js');
const P = require('../../nucleo/predicciones.js');
const { probarGenerador, probarFugas } = require('../../nucleo/probar-generador.js');
const { armar, texto } = require('../../herramientas/papel-generador.js');
const plano = x => Array.isArray(x) ? x.map(plano).join('') : x && typeof x === 'object' ? x.t : String(x);
const raiz = path.resolve(__dirname, '../..');

for (const tipo of gen.TIPOS) {
  probarGenerador({ id: gen.id + '/' + tipo, generar: s => gen.generar(s, { tipo }) }, { semillas: 400 });
}
probarFugas(gen, { semillas: 7200 });

test('las seis ideas tienen tres familias y niveles 1, 2 y 3, seleccionables sin mezclarse', () => {
  const unidad = require('../../contenido/teoria/fisica/impulso-y-choques.js');
  assert.deepEqual(Object.keys(gen.TIPOS_POR_IDEA), unidad.ideas.map(i => i.id));
  assert.equal(new Set(gen.TIPOS).size, 18);
  for (const [idea, tipos] of Object.entries(gen.TIPOS_POR_IDEA)) {
    assert.deepEqual(tipos.map(t => gen.NIVEL[t]), [1, 2, 3]);
    const vistos = new Set();
    for (let s = 0; s < 400; s++) {
      const p = gen.generar(s, { idea });
      assert.equal(p._datos.idea, idea); assert.ok(tipos.includes(p._datos.tipo));
      vistos.add(p._datos.tipo);
    }
    assert.deepEqual([...vistos].sort(), [...tipos].sort());
  }
  assert.throws(() => gen.generar(0, { tipo: 'no-existe' }), /desconocido/);
  assert.throws(() => gen.generar(0, { idea: 'no-existe' }), /desconocida/);
  assert.throws(() => gen.generar(0, { idea: 'impulso', tipo: 'alturas' }), /no pertenece/);
});

test('400 semillas por familia: Datos breves, símbolos, unidades, colores y respaldo de cada operación', () => {
  const codigos = new Set(), fuente = 'docs/etapa9/errores-fisica.md';
  const documento = fs.readFileSync(path.join(raiz, fuente), 'utf8');
  for (const tipo of gen.TIPOS) for (let s = 0; s < 400; s++) {
    const p = gen.generar(s, { tipo }), ctx = `${tipo}, ${s}`;
    assert.ok(Array.isArray(p.datos) && p.datos.length >= 1 && p.datos.length <= 6, ctx);
    for (const l of p.datos) {
      assert.ok(typeof l === 'string' && l.length > 0, ctx);
      assert.ok(l.split(/\s+/).filter(w => /\p{L}/u.test(w)).length <= 22, `${ctx}: ${l}`);
      assert.ok(!/\b(recuerda|fíjate|ojo|debes)\b/i.test(l), `${ctx}: consejo en Datos`);
    }
    const t = plano([p.enunciado, p.pregunta, p.solucion]);
    assert.ok(!/\bJ_x\b|\bK\s*=|\bU\s*=|NaN|undefined|null/.test(t), ctx);
    if (tipo === 'adhesion-rampa' || tipo === 'rebote-tiempo') assert.ok(p.datos.some(l => /g = 10 m\/s²/.test(l)), ctx);
    if (tipo === 'adhesion-rampa' && p._datos.pide === 'distancia') assert.match(plano(p.enunciado), /ruedas se bloquean.*desliza.*horizontal/, ctx);
    for (const linea of [p.enunciado, p.pregunta, ...p.solucion]) for (const token of linea) {
      if (token && typeof token === 'object') assert.ok(p.variables[token.v], `${ctx}: ${JSON.stringify(token)}`);
    }
    assert.deepEqual(Object.fromEntries(Object.entries(p.variables).map(([k, x]) => [k, x.color])), { m: 'f', v: 'o', p: 'i', I: 'i', F: 'h', t: 'd' });
    for (const a of p.alternativas) {
      const mostrado = Number(a.texto.match(/^[−-]?[\d\s,]+/)[0].replace(/\s/g, '').replace(/−/g, '-').replace(',', '.'));
      assert.ok(Math.abs(mostrado - a.valor) < 1e-9, `${ctx}: valor visible redondeado`);
      if (a.correcta) continue;
      codigos.add(a.error.id);
      assert.ok(P.enEscala(a.valor, p.respuesta.valor, a.error.id), `${ctx}: fuera de escala`);
      assert.equal(a.error.respaldo, 'hipotesis', ctx);
      assert.equal(a.error.fuente, fuente, ctx);
      assert.match(a.error.explicacion, /^Bien /, ctx);
      assert.ok(a.error.explicacion.includes(a.texto), `${ctx}: no muestra la consecuencia del error`);
      assert.ok(!/\b(alternativa|opción|letra) [A-E]\b/.test(a.error.explicacion), ctx);
      assert.ok(documento.includes('`' + a.error.id + '`'), `${ctx}: código sin ficha ${a.error.id}`);
    }
  }
  assert.ok(codigos.size >= 70, `Solo salieron ${codigos.size} operaciones diferentes`);
});

test('la práctica reparte ideas y mantiene alternativas en todas las letras', () => {
  const ideas = Object.fromEntries(Object.keys(gen.TIPOS_POR_IDEA).map(k => [k, 0]));
  const letras = Object.fromEntries('ABCDE'.split('').map(k => [k, 0]));
  const esperado = Object.fromEntries('ABCDE'.split('').map(k => [k, 0]));
  for (let s = 0; s < 7200; s++) {
    const p = gen.generar(s); ideas[p._datos.idea]++; letras[p.alternativas.find(a => a.correcta).letra]++;
    for (const a of p.alternativas) esperado[a.letra] += 1 / p.alternativas.length;
  }
  for (const n of Object.values(ideas)) assert.ok(n > 1000 && n < 1400, JSON.stringify(ideas));
  // E existe solo en problemas con cinco alternativas; compara cada letra con su exposición real.
  for (const k of Object.keys(letras)) assert.ok(Math.abs(letras[k] - esperado[k]) < 6 * Math.sqrt(esperado[k]), JSON.stringify({ letras, esperado }));
});

test('los ocho problemas de papel conservan Datos y reproducen sus semillas', () => {
  const actual = fs.readFileSync(path.join(__dirname, 'papel.json'), 'utf8');
  assert.equal(actual, texto(armar(gen.id)), 'Regenera solo el papel de esta plantilla');
  const papel = JSON.parse(actual);
  assert.equal(papel.problemas.length, 8);
  assert.equal(Object.keys(gen.PAPEL).length, 8);
  for (const [k, p] of papel.problemas.entries()) {
    assert.ok(p.enunciado.includes(' Datos: '));
    const ensayo = gen.generar(`papel-${k + 1}`), correcta = ensayo.alternativas.find(a => a.correcta);
    assert.equal(p.respuesta, `${correcta.letra}) ${correcta.texto}`);
    assert.deepEqual(p.pasos, ensayo.solucion.map(plano));
  }
});
