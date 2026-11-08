// Pruebas del generador de ángulos verticales: casos.json (los verifica otro, a ciegas), papel.json
// contra calc, y un recálculo independiente en cada uno de 600 problemas.
const test = require('node:test');
const assert = require('node:assert/strict');
const gen = require('./generador.js');
const casos = require('./casos.json');
const papel = require('./papel.json');
const { probarGenerador } = require('../../nucleo/probar-generador.js');

// Camino independiente: ángulos de verdad (Math.atan de las tangentes de academia) y ley de senos en el
// triángulo que forman los dos puntos de observación con la punta; las cuadráticas se resuelven con una
// búsqueda numérica de raíces sobre la función «ángulo bajo el que se ve».
const at = Math.atan, S = Math.sin, C = Math.cos;
const cerca = (a, b) => Math.abs(a - b) < 1e-7 * Math.max(1, Math.abs(b));
// Dos puntos del mismo lado, separados d, con elevaciones a < b (radianes): altura por ley de senos.
function alturaMismoLado(d, a, b) { const QT = d * S(a) / S(b - a); return { H: QT * S(b), x: QT * C(b) }; }
function alturaAmbosLados(d, a, b) { const AT = d * S(b) / S(a + b); return { H: AT * S(a), xA: AT * C(a) }; }
const visto = (h1, h2, D) => Math.atan2(h2, D) - Math.atan2(h1, D);
function raices(f, x0, x1, paso) {
  const r = [];
  for (let x = x0; x < x1; x += paso) {
    const fa = f(x), fb = f(x + paso);
    if (fa === 0) r.push(x);
    else if (fa * fb < 0) { let lo = x, hi = x + paso; for (let k = 0; k < 80; k++) { const m = (lo + hi) / 2; if (f(lo) * f(m) <= 0) hi = m; else lo = m; } r.push((lo + hi) / 2); }
  }
  return r;
}
function biseccion(f, lo, hi) { for (let k = 0; k < 200; k++) { const m = (lo + hi) / 2; if (f(lo) * f(m) <= 0) hi = m; else lo = m; } return (lo + hi) / 2; }

// Simbólico: con h = 1 y una elevación de 50° se miden BP y PT por coordenadas; luego se evalúa el texto de cada
// alternativa («h·cot(α/2)», «h·tan 2θ»…) y se devuelve la única que da ese número.
const FN = { sen: Math.sin, cos: Math.cos, tan: Math.tan, cot: x => 1 / Math.tan(x), sec: x => 1 / Math.cos(x), csc: x => 1 / Math.sin(x) };
function evaluarPuente(texto, angulo) {
  const m = texto.match(/^h·(sen|cos|tan|cot|sec|csc)(?: (\S+)|\((\S+)\))$/);
  assert.ok(m, `no se entiende «${texto}»`);
  const arg = m[2] || m[3];               // α = 50°, o θ = 25° (2θ = 50°)
  const valor = { 'α/2': 25, 'α': 50, '2α': 100, 'θ': 25, '2θ': 50, '4θ': 100 }[arg];
  assert.ok(valor !== undefined && (angulo === 'α') === arg.includes('α'), `argumento ${arg}`);
  return FN[m[1]](valor * Math.PI / 180);
}
function recalcular(p) {
  const d = p._datos;
  if (d.tipo === 'puente-simbolico') {
    const B = [0, 0], T = [0, 1], P = [1 / Math.tan(50 * Math.PI / 180), 0];
    const BP = Math.hypot(P[0] - B[0], P[1] - B[1]), PT = Math.hypot(T[0] - P[0], T[1] - P[1]);
    const objetivo = d.sub === 'suma' ? BP + PT : PT - BP;
    const buenas = p.alternativas.filter(a => cerca(evaluarPuente(a.texto, d.angulo), objetivo));
    assert.equal(buenas.length, 1, 'una sola alternativa vale lo pedido');
    return buenas[0].valor;
  }
  if (d.tipo === 'mismo-lado') {
    const { H, x } = alturaMismoLado(d.d, at(d.tA), at(d.tB));
    return d.pide === 'altura' ? H + d.h0 : x;
  }
  if (d.tipo === 'ambos-lados') {
    const { H, xA } = alturaAmbosLados(d.d, at(d.tA), at(d.tB));
    return d.pide === 'altura' ? H : xA;
  }
  if (d.tipo === 'movimiento') {
    const ms = x => (d.unidadV === 'km/h' ? x * 1000 / 3600 : x);
    const rel = d.sub === 'avioneta' ? (d.sentido === 'opuesto' ? ms(d.v) + ms(d.v2) : ms(d.v) - ms(d.v2)) : ms(d.v);
    const b = d.complementarios ? Math.PI / 2 - at(d.tA) : at(d.tB);
    return alturaMismoLado(rel * d.t, at(d.tA), b).H;
  }
  if (d.tipo === 'entre-edificios') {
    const a = at(d.tA), b = at(d.tB);
    if (d.sub === 'muro') { const ON = d.H / S(b); return ON * S(b - a) / S(a); }
    const D = d.H / S(b) * C(b), s = D / C(a);              // visual hasta la vertical del otro edificio
    return d.H - s * S(a);
  }
  if (d.tipo === 'mitad-cima') return Math.tan(visto(d.h1, d.h2, d.D));
  if (d.tipo === 'objeto-elevado') {
    if (d.sub === 'tan') return Math.tan(visto(d.b, d.b + d.a, d.D));
    if (d.sub === 'altura' || d.sub === 'pura') return biseccion(a => Math.tan(visto(d.b, d.b + a, d.D)) - d.t, 1e-6, 5000);
    const r = raices(D => Math.tan(visto(d.b, d.b + d.a, D)) - d.t, 0.01, 3000, 0.05);
    assert.equal(r.length, 2, 'deben salir dos posiciones');
    return d.pide === 'menor' ? r[0] : d.pide === 'mayor' ? r[1] : d.D0 - r[1];
  }
  if (d.tipo === 'dron-camino') {
    const r = raices(h => Math.tan(visto(d.p, d.p + d.L, h)) - d.t, 0.01, 3000, 0.05); // visto desde la vertical
    const sobre = r.filter(h => h > d.X);
    assert.equal(sobre.length, 1, 'una sola altura sobre el edificio');
    return sobre[0];
  }
  if (d.tipo === 'condicion-angulo') {
    const val = d.valor[0] / d.valor[1];
    const f = { suma: t => S(t) + C(t), producto: t => S(t) * C(t), tancot: t => Math.tan(t) + 1 / Math.tan(t), doble: t => S(2 * t) }[d.cond];
    const th = d.mayor45 ? biseccion(t => f(t) - val, Math.PI / 4 + 1e-9, Math.PI / 2 - 1e-9) : biseccion(t => f(t) - val, 1e-9, Math.PI / 4 - 1e-9);
    return d.pide === 'visual' ? d.d / C(th) : d.d * Math.tan(th);
  }
  throw new Error('tipo desconocido ' + d.tipo);
}
probarGenerador(gen, { semillas: 600, recalcular, igual: (a, b) => (typeof b === 'string' ? a === b : cerca(a, b)) });

for (const c of casos.casos) {
  test(`casos.json: semilla ${c.semilla}`, () => {
    const p = gen.generar(c.semilla);
    assert.deepEqual(p._datos, c.entrada, 'el generador cambió: recalcula casos.json');
    if (typeof c.esperado.respuesta === 'string') assert.equal(p.respuesta.valor, c.esperado.respuesta);
    else assert.ok(Math.abs(p.respuesta.valor - c.esperado.respuesta) <= casos.tolerancia, `da ${p.respuesta.valor}`);
    assert.equal(p.alternativas.find(a => a.correcta).texto, c.esperado.exacta);
  });
}

test('salen los ocho tipos y sus subtipos', () => {
  const vistos = new Set();
  for (let s = 0; s < 600; s++) { const d = gen.generar(s)._datos; vistos.add(d.tipo); if (d.sub) vistos.add(`${d.tipo}/${d.sub}`); }
  for (const t of ['puente-simbolico', 'puente-simbolico/suma', 'puente-simbolico/resta', 'mismo-lado', 'ambos-lados', 'movimiento', 'entre-edificios', 'mitad-cima', 'objeto-elevado', 'dron-camino', 'condicion-angulo',
    'movimiento/auto', 'movimiento/dron', 'movimiento/camara', 'movimiento/avioneta', 'entre-edificios/muro', 'entre-edificios/otro',
    'objeto-elevado/tan', 'objeto-elevado/altura', 'objeto-elevado/pura', 'objeto-elevado/distancia']) assert.ok(vistos.has(t), `no sale ${t}`);
});

test('alternativas sin decimales y con la misma unidad', () => {
  for (let s = 0; s < 600; s++) {
    const p = gen.generar(s);
    for (const a of p.alternativas) assert.ok(!/,\d/.test(a.texto), `semilla ${s}: decimal en ${a.texto}`);
    if (typeof p.respuesta.valor === 'string') {   // simbólico: todas con la forma h·razón(ángulo)
      assert.ok(p.alternativas.every(a => /^h·(sen|cos|tan|cot|sec|csc)[ (]/.test(a.texto)), `semilla ${s}: forma`);
      continue;
    }
    const unidades = new Set(p.alternativas.map(a => a.texto.split(' ').pop().replace(/[\d/√]/g, '')));
    assert.equal(unidades.size, 1, `semilla ${s}: mezcla unidades`);
    // Colores: como mucho 4 variables, cada una con un color distinto de la app.
    const colores = Object.values(p.variables).map(x => x.color);
    assert.ok(colores.length <= 4 && new Set(colores).size === colores.length && colores.every(c => 'oihd'.includes(c)), `semilla ${s}: colores`);
  }
});

// papel.json: cada verificación llama a una función de calc.
function campo(o, k) { return k.split('.').reduce((x, c) => (x == null ? undefined : x[c]), o); }
test('papel.json: entre 6 y 8 problemas con respuesta, pasos y verificación', () => {
  assert.ok(papel.titulo && papel.indicacion);
  assert.ok(papel.problemas.length >= 6 && papel.problemas.length <= 8);
  for (const q of papel.problemas) {
    assert.ok(q.id && q.enunciado && q.respuesta && q.pasos.length && q.verificar.length, q.id);
    assert.ok(['básico', 'intermedio', 'avanzado'].includes(q.nivel), q.id);
    assert.ok(!/\d\.\d/.test(q.enunciado + q.respuesta + q.pasos.join('')), `${q.id}: coma decimal`);
  }
});
for (const q of papel.problemas) test(`papel ${q.id}`, () => {
  for (const vf of q.verificar) {
    const r = gen.calc[vf.fn](...vf.args);
    if (typeof vf.espera === 'number') assert.ok(cerca(r, vf.espera), `${q.id}: ${vf.fn} da ${r}`);
    else for (const [k, x] of Object.entries(vf.espera)) assert.ok(cerca(campo(r, k), x), `${q.id}: ${vf.fn}.${k} da ${campo(r, k)}`);
  }
});
