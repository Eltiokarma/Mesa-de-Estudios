// Pruebas del generador «poleas-giros»: casos.json (verificados aparte, a ciegas) y un recálculo
// independiente en cada uno de 600 problemas.
const test = require('node:test');
const assert = require('node:assert/strict');
const gen = require('./generador.js');
const casos = require('./casos.json');
const { probarGenerador } = require('../../nucleo/probar-generador.js');

const plano = segs => segs.map(x => (typeof x === 'string' ? x : x.t)).join('');

// sentido: se lee el ENUNCIADO (no _datos) y se cuentan las inversiones con la paridad.
function recalcSentido(p) {
  const txt = plano(p.enunciado), preg = plano(p.pregunta);
  const letras = txt.match(/en fila: ([A-H, y]+)\./)[1].split(/, | y /);
  const sA = /La polea A gira en sentido antihorario/.test(txt) ? -1 : 1; // +1 horario
  const s = { A: sA };
  for (const L of letras.slice(1)) {
    const frase = txt.match(new RegExp(`${L} (está [^.]*)\\.`))[1];
    const prev = frase.match(/ ([A-H])( |$)/)[1];
    const invierte = /faja cruzada|en contacto/.test(frase);
    assert.ok(/faja abierta|faja cruzada|en contacto|mismo eje/.test(frase), frase);
    s[L] = invierte ? -s[prev] : s[prev];
  }
  if (/¿Qué poleas/.test(preg)) return 'set:' + letras.filter(L => s[L] === -1).join(',');
  const quiere = /sentido horario\?/.test(preg) ? 1 : -1;
  return letras.filter(L => s[L] === quiere).length;
}

// bloques: velocidades con producto vectorial. Eje z hacia afuera; horario = ωz < 0.
// Punto (x, y) de una polea con ωz: v = (−ωz·y, ωz·x). Cuerda que cuelga en (∓r, 0): el bloque
// sube con la componente vertical de v en ese punto.
function recalcBloques(d) {
  const vy = (wz, r, ladoIzq) => wz * (ladoIzq ? -r : r);
  const dt = 1e-3;
  const vX = (d.xSube ? 1 : -1) * d.d;                 // cm por unidad de tiempo
  const izqX = d.ladoX === 'izq', izqY = d.ladoY === 'izq';
  const wP = vX / vy(1, d.rx, izqX);                    // ωz de P que da esa subida
  let wQ, rY = d.ry;
  if (d.modo === 'eje') wQ = wP;
  else {
    const vTopP = -wP * d.pf;                           // v_x del punto más alto de P
    // Faja abierta: el punto más alto de Q va igual. Cruzada: va igual el punto más bajo de Q (v_x = ωz·r).
    wQ = d.cruzada ? vTopP / d.qf : -vTopP / d.qf;
  }
  return Math.round(vy(wQ, rY, izqY) * dt / dt * 1e6) / 1e6;
}

// coincidencias: se avanza el arco de a una unidad (diente o cm de radio) y se cuentan los encuentros.
function recalcCoinc(d) {
  let k = 0, veces = 0;
  while (veces < d.n) { k++; if (k % d.a === 0 && k % d.b === 0) veces++; }
  return k / d.a;
}

function recalcular(p) {
  const d = p._datos;
  if (d.tipo === 'sentido') return recalcSentido(p);
  if (d.tipo === 'bloques') return recalcBloques(d);
  return recalcCoinc(d);
}
const igual = (a, b) => (typeof a === 'string' || typeof b === 'string' ? a === b : Math.abs(a - b) < 1e-6);
probarGenerador(gen, { semillas: 600, recalcular, igual });

for (const c of casos.casos) {
  test(`casos.json: semilla ${c.semilla}`, () => {
    const p = gen.generar(c.semilla);
    assert.deepEqual(p._datos, c.entrada, 'el generador cambió: recalcula casos.json');
    if (typeof c.esperado.respuesta === 'string') assert.equal(p.respuesta.valor, c.esperado.respuesta);
    else assert.ok(Math.abs(p.respuesta.valor - c.esperado.respuesta) <= casos.tolerancia, `da ${p.respuesta.valor}`);
    assert.equal(p.alternativas.find(a => a.correcta).texto, c.esperado.exacta);
  });
}

test('salen todos los tipos y modos; las alternativas tienen la misma forma', () => {
  const vistos = new Set();
  for (let s = 0; s < 600; s++) {
    const p = gen.generar(s); const d = p._datos; vistos.add(d.tipo + '/' + d.modo);
    const alt = p.alternativas;
    if (d.tipo === 'bloques') {
      assert.ok(alt.every(a => /^(sube|baja) \d+(,\d{1,2})? cm$/.test(a.texto)), alt.map(a => a.texto).join(' | '));
      assert.ok(alt.some(a => Math.sign(a.valor) !== Math.sign(p.respuesta.valor)), `semilla ${s}: todas en el mismo sentido`);
    }
    if (d.tipo === 'coincidencias') {
      assert.ok(alt.every(a => /^\d[\d ]* vueltas?$/.test(a.texto)), alt.map(a => a.texto).join(' | '));
      assert.ok(alt.every(a => Number.isInteger(a.valor) && a.valor > 0));
    }
    if (d.tipo === 'sentido' && d.modo === 'cuantas') assert.ok(alt.every(a => Number.isInteger(a.valor) && a.valor >= 0 && a.valor <= d.n));
    // La respuesta no se escribe en la pregunta ni en el encabezado del enunciado.
    const correcta = alt.find(a => a.correcta).texto;
    assert.ok(!plano(p.pregunta).includes(correcta), `semilla ${s}: la pregunta trae la respuesta`);
  }
  assert.deepEqual([...vistos].sort(), ['bloques/eje', 'bloques/faja', 'coincidencias/engranajes', 'coincidencias/faja', 'coincidencias/tangentes', 'sentido/cuales', 'sentido/cuantas']);
});

test('un ejemplo a mano por tipo', () => {
  // Polea doble de 10 y 30 cm: X baja 6 del lado izquierdo de la de 10; Y en el izquierdo de la de 30 baja 18.
  assert.equal(recalcBloques({ modo: 'eje', d: 6, xSube: false, ladoX: 'izq', ladoY: 'izq', rx: 10, ry: 30 }), -18);
  // Lados opuestos: sube.
  assert.equal(recalcBloques({ modo: 'eje', d: 6, xSube: false, ladoX: 'izq', ladoY: 'der', rx: 10, ry: 30 }), 18);
  // Faja cruzada invierte respecto de la abierta.
  const base = { modo: 'faja', d: 4, xSube: true, ladoX: 'der', ladoY: 'der', rx: 10, pf: 20, qf: 8, ry: 12 };
  assert.equal(recalcBloques({ ...base, cruzada: false }), -recalcBloques({ ...base, cruzada: true }));
  assert.equal(Math.abs(recalcBloques({ ...base, cruzada: false })), 4 * 20 / 10 * 12 / 8);
  // Ruedas de 6 y 9: la chica da 3 vueltas hasta el primer encuentro (RME28 diría 9).
  assert.equal(recalcCoinc({ a: 6, b: 9, n: 1 }), 3);
});
