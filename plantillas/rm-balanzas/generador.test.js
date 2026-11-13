// Pruebas del generador de balanzas: casos.json (para verificar aparte, a ciegas), papel.json y un recálculo
// independiente en cada uno de 600 problemas, sin la eliminación ni la programación dinámica del generador:
//   desigualdad y sustitución: se recorren pesos enteros figura por figura y se revisan todas las balanzas;
//   mínimo de pesas: tres lazos sobre las cantidades de cada pesa;
//   una pesada: búsqueda en anchura sobre lo que marca la balanza (base 10) o los 3^6 acomodos (base 3).
const test = require('node:test');
const assert = require('node:assert/strict');
const gen = require('./generador.js');
const casos = require('./casos.json');
const papel = require('./papel.json');
const { probarGenerador } = require('../../nucleo/probar-generador.js');

const peso = (lado, w) => Object.entries(lado).reduce((s, [k, n]) => s + (k === 'pesa' ? n : n * w[k]), 0);
const cumple = (b, w) => { const I = peso(b.izq, w), D = peso(b.der, w); return b.estado === 'equilibrio' ? I === D : b.estado === 'izq-baja' ? I > D : D > I; };
const figurasDe = bs => [...new Set(bs.flatMap(b => Object.keys(b.izq).concat(Object.keys(b.der))).filter(k => k !== 'pesa'))];

// Recorre pesos enteros de 1 a tope para todas las figuras menos una; la última sale de una balanza en equilibrio donde
// aparece (si no es entera positiva, se descarta). Llama a fn con cada asignación que cumple todas las balanzas.
// Cada balanza se lleva a una fila: Σ (izq − der)·peso + (pesa izq − pesa der), que debe ser 0, > 0 o < 0.
function recorrer(bs, tope, fn) {
  const figs = figurasDe(bs), n = figs.length;
  const filas = bs.map(b => ({ c: figs.map(k => (b.izq[k] || 0) - (b.der[k] || 0)), k: (b.izq.pesa || 0) - (b.der.pesa || 0), e: b.estado }));
  const eq = filas.find(r => r.e === 'equilibrio' && r.c[n - 1] !== 0);
  const w = new Array(n).fill(0);
  (function rec(i) {
    if (i === n - 1) {
      let resto = eq.k; for (let j = 0; j < n - 1; j++) resto += eq.c[j] * w[j];
      const u = -resto / eq.c[n - 1];
      if (!Number.isInteger(u) || u < 1) return;
      w[n - 1] = u;
      for (const r of filas) {
        let s = r.k; for (let j = 0; j < n; j++) s += r.c[j] * w[j];
        if (r.e === 'equilibrio' ? s !== 0 : r.e === 'izq-baja' ? s <= 0 : s >= 0) return;
      }
      const o = {}; figs.forEach((k, j) => { o[k] = w[j]; }); fn(o);
      return;
    }
    for (let x = 1; x <= tope; x++) { w[i] = x; rec(i + 1); }
  })(0);
}

function recalcular(p) {
  const d = p._datos;
  if (d.tipo === 'combinado') {
    const r = new Set(), n = [];
    recorrer(d.balanzas, 40, w => { n.push(w); r.add(Object.entries(d.pide).reduce((s, [k, c]) => s + c * w[k], 0)); });
    assert.equal(n.length, 1, 'las balanzas deben fijar los tres pesos');
    return [...r][0];
  }
  if (d.tipo === 'desigualdad') {
    const vals = [];
    recorrer(d.balanzas, 200, w => vals.push(w[d.figura]));
    assert.ok(vals.length, 'sin soluciones');
    return d.pide === 'max' ? Math.max(...vals) : Math.min(...vals);
  }
  if (d.tipo === 'sustitucion') {
    const r = new Set();
    recorrer(d.balanzas, 40, w => r.add(peso(d.pregunta.izq, w) / w[d.pregunta.figura]));
    assert.equal(r.size, 1, 'las balanzas no fijan la respuesta');
    return [...r][0];
  }
  if (d.tipo === 'minimo-pesas') {
    const [a, b, c] = d.valores; let mejor = Infinity;
    for (let z = 0; z * c <= d.carga; z++) for (let y = 0; y * b + z * c <= d.carga; y++) {
      const resto = d.carga - y * b - z * c; if (resto % a === 0) mejor = Math.min(mejor, resto / a + y + z);
    }
    return mejor;
  }
  if (d.base === 3) {
    const pesas = [1, 3, 9, 27, 81, 243]; let mejor = Infinity, formas = 0;
    for (let m = 0; m < 729; m++) {
      let r = m, neto = 0, usadas = 0;
      for (const q of pesas) { const lugar = r % 3; r = Math.floor(r / 3); if (lugar === 1) { neto += q; usadas++; } if (lugar === 2) { neto -= q; usadas++; } }
      if (neto === d.cantidad) { formas++; mejor = Math.min(mejor, usadas); }
    }
    assert.equal(formas, 1, 'con una pesa de cada valor la forma es única');
    return mejor;
  }
  // base 10: cada pesa suma o resta 1, 10, 100, 1000 o 10 000; menor número de pasos de 0 a la cantidad
  const tope = 21000, dist = new Int16Array(2 * tope + 1).fill(-1); dist[tope] = 0; let frente = [0];
  while (dist[d.cantidad + tope] < 0) {
    const sig = [];
    for (const z of frente) for (const q of [1, 10, 100, 1000, 10000]) for (const y of [z + q, z - q]) {
      if (Math.abs(y) > tope || dist[y + tope] >= 0) continue; dist[y + tope] = dist[z + tope] + 1; sig.push(y);
    }
    frente = sig;
  }
  return dist[d.cantidad + tope];
}

probarGenerador(gen, { semillas: 600, recalcular });

test('salen los cuatro tipos en 200 semillas', () => {
  const tipos = new Set(); for (let s = 0; s < 200; s++) tipos.add(gen.generar(s)._datos.tipo);
  assert.equal(tipos.size, 4);
});

test('combinado: sale con semillas de práctica, se recalcula y la tercera balanza hace falta', () => {
  let vistos = 0;
  for (let s = 1; s <= 600; s++) {
    const p = gen.generar(`ana-${s}`); if (p._datos.tipo !== 'combinado') continue;
    vistos++;
    assert.equal(recalcular(p), p.respuesta.valor, `ana-${s}`);
    const [b1, b2] = p._datos.balanzas;
    assert.ok(gen.calc.combinado({ balanzas: [b1, b2], pide: p._datos.pide }).valores.length > 1, `ana-${s}: la balanza 3 no hace falta`);
    assert.ok(p.figura && p.figura.svg);
  }
  assert.ok(vistos > 50, `solo ${vistos}`);
  for (const pre of ['entrada', 'salida']) for (let s = 1; s <= 60; s++) assert.notEqual(gen.generar(`${pre}-${s}`)._datos.tipo, 'combinado');
});

test('desigualdad: hay al menos dos pesos posibles (la desigualdad importa) y la respuesta es múltiplo de su medida', () => {
  for (let s = 0; s < 600; s++) {
    const p = gen.generar(s); if (p._datos.tipo !== 'desigualdad') continue;
    const R = gen.calc.desigualdad(p._datos);
    assert.ok(R.t[1] > R.t[0], `semilla ${s}`);
    assert.equal(p.respuesta.valor % R.coef[p._datos.figura], 0);
  }
});

test('una pesada (base 10): el plan del generador da la cantidad', () => {
  for (let s = 0; s < 600; s++) {
    const p = gen.generar(s); if (p._datos.tipo !== 'una-pesada') continue;
    const R = gen.calc.unaPesada(p._datos);
    assert.equal(R.otro.reduce((a, b) => a + b, 0) - R.junto.reduce((a, b) => a + b, 0), p._datos.cantidad);
    assert.equal(R.otro.length + R.junto.length, R.respuesta);
  }
});

for (const c of casos.casos) {
  test(`casos.json: semilla ${c.semilla}`, () => {
    const p = gen.generar(c.semilla);
    assert.deepEqual(p._datos, c.entrada, 'el generador cambió: recalcula casos.json');
    assert.equal(p.respuesta.valor, c.esperado.respuesta);
  });
}

test('papel.json: formato', () => {
  assert.ok(papel.titulo && papel.indicacion && papel.problemas.length >= 5 && papel.problemas.length <= 10);
  for (const q of papel.problemas) assert.ok(q.id && q.nivel && q.enunciado && q.respuesta && q.pasos.length && q.verificar.length, q.id);
});
for (const q of papel.problemas) {
  test(`papel ${q.id}`, () => {
    for (const vf of q.verificar) {
      const r = gen.calc[vf.fn](...vf.args);
      for (const [k, e] of Object.entries(vf.espera)) assert.deepEqual(r[k], e, `${q.id}: ${vf.fn}.${k}`);
    }
  });
}

// ---------- Escena viva (docs/escena-viva.md): pieza balanza, línea de tiempo, fantasmas y arrastre ----------
const Kit = require('../../nucleo/kit/kit.js');
const pieza = require('../../nucleo/kit/piezas/balanza.js');
const LT = require('../../nucleo/kit/linea-tiempo.js');
const palabras = x => Kit.plano(x).split(/\s+/).filter(w => /\p{L}/u.test(w)).length; // como herramientas/validar-ejercicios.js

test('escena viva: todos los tipos traen la pieza balanza, y lo que sale cabe y se dibuja sin NaN', () => {
  for (let s = 0; s < 600; s++) {
    const p = gen.generar(s);
    assert.equal(p.escena && p.escena.pieza, 'balanza', `semilla ${s} (${p._datos.tipo}) sin escena`);
    assert.ok(pieza.cabe(p.escena.datos), `semilla ${s}: no cabe en la pieza`);
    assert.ok(typeof p.escena.alt === 'string' && p.escena.alt.length > 20);
    for (let i = 1; i <= p.pasos.length; i++) {
      const svg = pieza.dibujar(p.escena.datos, LT.estado(p.pasos, i));
      assert.ok(!/NaN|undefined|null|Infinity/.test(svg), `semilla ${s}, paso ${i}`);
    }
    assert.ok(p.pasos[p.pasos.length - 1].estado.final, 'el último paso es el resultado');
  }
});

test('escena viva: con los pesos reales, las balanzas del enunciado se inclinan como dice su estado', () => {
  for (let s = 0; s < 600; s++) {
    const p = gen.generar(s), d = p.escena.datos;
    for (const b of d.balanzas) {
      const a = pieza.inclinacion(d, b);
      assert.equal(Math.sign(a), b.estado === 'izq-baja' ? 1 : b.estado === 'der-baja' ? -1 : 0, `semilla ${s}`);
    }
    // Lo que se ve al final queda en equilibrio.
    const fin = d.trabajo[LT.estado(p.pasos, p.pasos.length).vista || 0];
    assert.equal(pieza.inclinacion(d, fin), 0, `semilla ${s}: el final no está en equilibrio`);
  }
});

test('escena viva: presupuesto de texto (enunciado ≤ 40, paso ≤ 14, error ≤ 20)', () => {
  for (let s = 0; s < 600; s++) {
    const p = gen.generar(s);
    assert.ok(palabras(p.enunciado) + palabras(p.pregunta) <= 40, `semilla ${s}: enunciado largo`);
    for (const q of p.pasos) {
      assert.ok(palabras(q.texto) <= 14, `semilla ${s}: «${Kit.plano(q.texto)}»`);
      assert.ok(Array.isArray(q.ecuacion) && q.ecuacion.length && !/NaN|undefined|null/.test(Kit.plano(q.texto) + Kit.plano(q.ecuacion)));
    }
    for (const a of p.alternativas.filter(x => x.error)) assert.ok(palabras(a.error.explicacion) <= 20, `semilla ${s}: «${a.error.explicacion}»`);
  }
});

test('escena viva: cada error tiene fantasma; en sustitución se arrastra y la marca en cada valor da esa alternativa', () => {
  let arrastres = 0;
  for (let s = 0; s < 600; s++) {
    const p = gen.generar(s);
    for (const a of p.alternativas) if (a.error) assert.ok(p.fantasmas[a.error.id], `semilla ${s}: ${a.error.id} sin fantasma`);
    if (p.respuesta.tipo !== 'arrastrar') { assert.ok(!p.escena.datos.marca); continue; }
    arrastres++;
    assert.equal(p._datos.tipo, 'sustitucion');
    const c = pieza.controles(p.escena.datos);
    assert.equal(c.respuesta, p.respuesta.valor, `semilla ${s}: la balanza no se equilibra con la respuesta`);
    for (const a of p.alternativas) {
      const puesto = Kit.respuesta.ajustar(a.valor, p.respuesta.paso, c.marca.min, c.marca.max);
      assert.equal(Kit.respuesta.clasificar(puesto, p.alternativas, p.respuesta.tolerancia), a, `semilla ${s}`);
      if (a.error) assert.equal(p.fantasmas[a.error.id].marca, a.valor);
    }
    assert.match(pieza.dibujar(p.escena.datos, LT.estado(p.pasos, p.pasos.length)), new RegExp(`${p.respuesta.valor} \\S+ ✓`));
  }
  assert.ok(arrastres > 30, `pocas sustituciones con arrastre: ${arrastres}`);
});
