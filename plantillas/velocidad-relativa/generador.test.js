// Pruebas de «La combi y el río»: casos.json, un recálculo independiente en 600 problemas
// (posiciones en el marco de tierra, bisección sobre el rumbo o sobre la cantidad de movimiento,
// nunca la fórmula corta del generador) y papel.json.
const test = require('node:test');
const assert = require('node:assert/strict');
const gen = require('./generador.js');
const casos = require('./casos.json');
const papel = require('./papel.json');
const { probarGenerador } = require('../../nucleo/probar-generador.js');

function biseccion(g, a, b) {
  let ga = g(a);
  for (let i = 0; i < 200; i++) { const m = (a + b) / 2, gm = g(m); if ((gm > 0) === (ga > 0)) { a = m; ga = gm; } else b = m; }
  return (a + b) / 2;
}
const RAD = Math.PI / 180;
// Ida y vuelta vista desde tierra: el que va sale de la cola (x = 0) con rapidez de ida `ida` respecto
// a tierra; la cabeza está en L + V·t. Luego vuelve con rapidez `vuelta` (hacia atrás) y la cola está en V·t.
function idaVueltaTierra(L, V, ida, vuelta) {
  const t1 = biseccion(t => ida * t - (L + V * t), 0, 1e5), x1 = ida * t1;
  const t2 = biseccion(t => (x1 - vuelta * (t - t1)) - V * t, t1, 1e5);
  return t2;
}
// Rumbo de la proa (θ desde la perpendicular, positivo río arriba) para que la velocidad respecto a tierra
// avance k metros río abajo por metro de cruce.
const rumbo = (u, c, k) => biseccion(th => c - u * Math.sin(th) - k * u * Math.cos(th), -89.9 * RAD, 89.9 * RAD);
const claveRumbo = th => { const g = Math.round(Math.abs(th) / RAD); return g === 0 ? 'proa:0' : `proa:${g}:${th > 0 ? 'arriba' : 'abajo'}`; };

function recalcular(p) {
  const d = p._datos;
  if (d.tipo === 'marco') {
    if (d.sub === 'combis') { const xA = t => d.vA / 3.6 * t, xB = t => d.vB / 3.6 * t; return Math.abs((xA(10) - xB(10)) - (xA(0) - xB(0))) / 10; }
    let sep = 0; for (let k = 0; k < d.N; k++) sep += d.vA - d.vB; return Math.abs(sep) / 100;
  }
  if (d.tipo === 'idavuelta') {
    if (d.sub === 'columna') return idaVueltaTierra(d.L, d.V, d.u, d.u);
    if (d.sub === 'tren') return idaVueltaTierra(d.L, d.V, d.V + d.u, d.u - d.V);
    // nadador: se busca la rapidez cuyo viaje (simulado en tierra) dura T
    return biseccion(u => idaVueltaTierra(d.L, d.V, u, u) - d.T, d.V + 1e-6, 100);
  }
  if (d.tipo === 'cruce') {
    if (d.sub === 'trenes') return biseccion(t => (d.v1 * t - d.L1) - (d.v2 * t + d.L2), 0, 1e5);
    return biseccion(t => d.v1 * t - (d.D + d.v2 * t), 0, 1e5);
  }
  if (d.tipo === 'bote') {
    const { u, c, W } = d;
    if (d.sub === 'recto') { const th = rumbo(u, c, 0); return W / (u * Math.cos(th)); }
    if (d.sub === 'angulo') return claveRumbo(rumbo(u, c, 0));
    if (d.sub === 'linea') return claveRumbo(rumbo(u, c, d.d / W));
    if (d.sub === 'tmin') { let mejor = Infinity; for (let g = -80; g <= 80; g += 0.5) mejor = Math.min(mejor, W / (u * Math.cos(g * RAD))); return mejor; }
    if (d.sub === 'deriva') { const t = biseccion(t => u * t - W, 0, 1e5); return c * t; }
    return Math.hypot(c, u);
  }
  // botes: cantidad de movimiento hacia el este, despejada por bisección
  if (d.sub === 'tres') { // paso a paso, todo respecto al agua y con el este positivo
    const { MA, MB, MC, m, u } = d;
    const V1 = biseccion(V => (MB + m) * V + m * (V - u), -u, u);          // saco 1 sale a V1 − u
    const V2 = biseccion(V => MB * V + m * (V + u) - (MB + m) * V1, -u, u); // saco 2 sale a V2 + u
    const pA = m * (V1 - u), pC = m * (V2 + u);
    const VA = biseccion(V => (MA + m) * V - pA, -u, u), VC = biseccion(V => (MC + m) * V - pC, -u, u);
    return Math.abs(d.cual === 'A' ? VA : VC);
  }
  const { M, m, u } = d;
  const VA = biseccion(V => M * (-V) + m * (u - V), 0, u); // el bote va al oeste con V
  if (d.sub === 'lanza') return VA;
  if (d.sub === 'objeto') return u - VA;
  if (d.sub === 'recibe') return biseccion(V2 => m * (u - VA) - (d.M2 + m) * V2, 0, u);
  const V1 = biseccion(V => (M + m) * V - m * (u - V), 0, u); // primer saco al oeste: el bote va al este
  const V2 = biseccion(V => (M + m) * V1 - (M * V + m * (V + u)), -u, u);
  return Math.abs(V2);
}

probarGenerador(gen, { semillas: 600, recalcular: p => {
  const r = recalcular(p);
  if (typeof r === 'string') return r;
  return Math.abs(r - p.respuesta.valor) < 1e-6 * Math.max(1, Math.abs(r)) ? p.respuesta.valor : r;
}, igual: (a, b) => (typeof a === 'string' ? a === b : Math.abs(a - b) < 1e-9) });

for (const c of casos.casos) {
  test(`casos.json: semilla ${c.semilla}`, () => {
    const p = gen.generar(c.semilla);
    assert.deepEqual(p._datos, c.entrada, 'el generador cambió: recalcula casos.json');
    if (typeof c.esperado.respuesta === 'string') assert.equal(p.respuesta.valor, c.esperado.respuesta);
    else assert.ok(Math.abs(p.respuesta.valor - c.esperado.respuesta) <= casos.tolerancia, `da ${p.respuesta.valor}`);
    assert.equal(p.alternativas.find(a => a.correcta).texto, c.esperado.exacta);
  });
}

const TODOS = ['bote/angulo', 'bote/deriva', 'bote/linea', 'bote/recto', 'bote/resultante', 'bote/tmin', 'botes/dos', 'botes/lanza', 'botes/objeto', 'botes/recibe', 'botes/tres',
  'cruce/alcance', 'cruce/encuentro', 'cruce/trenes', 'idavuelta/columna', 'idavuelta/nadador', 'idavuelta/tren', 'marco/combis', 'marco/placas'];

test('salen todos los tipos y subtipos; unidades iguales y pocos decimales; en «linea» el destino queda arriba y abajo', () => {
  const vistos = new Set(), lados = new Set(), proas = new Set();
  for (let s = 0; s < 1500; s++) {
    const p = gen.generar(s), d = p._datos;
    vistos.add(d.tipo + '/' + d.sub);
    if (d.sub === 'linea') { lados.add(Math.sign(d.d)); proas.add(p.respuesta.valor.split(':').slice(2).join('') || '0'); }
    if (typeof p.respuesta.valor === 'string') continue;
    const unidad = a => a.texto.replace(/^[−\d ,]+/, '');
    assert.equal(new Set(p.alternativas.map(unidad)).size, 1, `semilla ${s}: unidades distintas (${p.alternativas.map(a => a.texto)})`);
    for (const a of p.alternativas) assert.ok(!/\d,\d{3}/.test(a.texto), `semilla ${s}: más de dos decimales (${a.texto})`);
  }
  assert.deepEqual([...vistos].sort(), TODOS);
  assert.ok(lados.has(1), 'en «linea» falta el embarcadero río abajo');
  assert.ok(proas.has('arriba') && proas.has('abajo'), `en «linea» las proas solo van hacia ${[...proas]}`);
});

test('en «linea» la proa es única (corriente no mayor que el bote) y nunca apunta al embarcadero', () => {
  for (let s = 0; s < 1500; s++) {
    const p = gen.generar(s), d = p._datos;
    if (d.sub !== 'linea') continue;
    assert.ok(d.c <= d.u, `semilla ${s}`);
    const destino = claveRumbo(-Math.atan(d.d / d.W));
    assert.notEqual(p.respuesta.valor, destino, `semilla ${s}: apuntar al embarcadero sería correcto`);
  }
});

test('los textos no dicen «de el» ni «a el»', () => {
  const plano = seg => seg.map(x => (typeof x === 'string' ? x : x.t)).join('');
  for (let s = 0; s < 1500; s++) {
    const p = gen.generar(s);
    const todo = [plano(p.enunciado), plano(p.pregunta), ...p.solucion.map(plano), ...p.alternativas.filter(a => a.error).map(a => a.error.explicacion)].join(' ');
    assert.ok(!/\b[Dd]e el\b|\b[Aa] el\b/.test(todo), `semilla ${s}`);
  }
});

// ---------- papel.json ----------
const CALC = {
  relativa: ([va, vb]) => Math.abs(va - vb),
  idaVueltaTierra: ([L, V, ida, vuelta]) => idaVueltaTierra(L, V, ida, vuelta),
  encuentro: ([D, v1, v2]) => biseccion(t => v1 * t - (D + v2 * t), 0, 1e5),
  rumboGrados: ([u, c, k]) => rumbo(u, c, k) / RAD,
  cruceRecto: ([W, u, c]) => W / (u * Math.cos(rumbo(u, c, 0))),
  deriva: ([W, u, c]) => c * W / u,
  lanzaBote: ([M, m, u]) => biseccion(V => -M * V + m * (u - V), 0, u),
  recibe: ([M, m, u, M2]) => { const VA = biseccion(V => -M * V + m * (u - V), 0, u); return m * (u - VA) / (M2 + m); },
};
test('papel.json: de 5 a 10 problemas bien armados, sin HTML, y cada respuesta se recalcula', () => {
  assert.ok(papel.titulo && papel.indicacion);
  const ps = papel.problemas;
  assert.ok(ps.length >= 5 && ps.length <= 10, `${ps.length} problemas`);
  assert.equal(new Set(ps.map(p => p.id)).size, ps.length, 'ids repetidos');
  for (const p of ps) {
    for (const k of ['id', 'nivel', 'enunciado', 'respuesta']) assert.ok(typeof p[k] === 'string' && p[k].length, `${p.id}: falta ${k}`);
    assert.ok(Array.isArray(p.pasos) && p.pasos.length >= 2, `${p.id}: pasos`);
    assert.ok(Array.isArray(p.verificar) && p.verificar.length, `${p.id}: verificar`);
    for (const t of [p.enunciado, p.respuesta, ...p.pasos]) assert.ok(!/<[a-z/][^>]*>/i.test(t), `${p.id}: tiene HTML`);
    for (const ver of p.verificar) {
      assert.ok(CALC[ver.tipo], `${p.id}: tipo ${ver.tipo} desconocido`);
      const r = CALC[ver.tipo](ver.args);
      assert.ok(Math.abs(r - ver.espera) < 1e-6 * Math.max(1, Math.abs(ver.espera)), `${p.id}: da ${r}, espera ${ver.espera}`);
    }
  }
});

// La correcta no se reconoce por redonda y ninguna incorrecta es absurda (entre 1/20 y 20 veces la correcta).
test('incorrectas tan limpias como la correcta y de tamaño razonable (600 semillas); nunca lanza', () => {
  const dec = t => ((t.match(/^[−\d ]+(?:,(\d+))?/) || [])[1] || '').length;
  let sola = 0, n = 0;
  for (let s = 0; s < 600; s++) {
    const p = gen.generar(s);
    if (typeof p.respuesta.valor !== 'number') continue;
    n++;
    const c = p.alternativas.find(a => a.correcta), dc = dec(c.texto);
    const otras = p.alternativas.filter(a => !a.correcta);
    if (otras.every(a => dec(a.texto) > dc)) sola++;
    for (const a of otras) {
      assert.ok(dec(a.texto) <= Math.max(dc, 1), `semilla ${s}: «${a.texto}» es menos limpia que «${c.texto}»`);
      if (c.valor !== 0) {
        const r = Math.abs(a.valor / c.valor);
        assert.ok(r >= 1 / 20 && r <= 20, `semilla ${s}: «${a.texto}» frente a «${c.texto}» (${a.error.id})`);
      }
    }
  }
  assert.ok(sola / n < 0.05, `la correcta es la única redonda en ${sola} de ${n}`);
  for (const s of [...Array(2001).keys(), 'entrada-1', 'entrada-2', 'salida-1', 'salida-3']) assert.doesNotThrow(() => gen.generar(s), `semilla ${s}`);
});
