// Pruebas de «El viaje en tramos»: casos.json, un recálculo independiente en 600 problemas
// (simulación, bisección o la definición, nunca la fórmula corta del generador) y papel.json.
const test = require('node:test');
const assert = require('node:assert/strict');
const gen = require('./generador.js');
const casos = require('./casos.json');
const papel = require('./papel.json');
const { probarGenerador, topeEscala } = require('../../nucleo/probar-generador.js');

function biseccion(g, a, b) {
  let ga = g(a);
  for (let i = 0; i < 200; i++) { const m = (a + b) / 2, gm = g(m); if ((gm > 0) === (ga > 0)) { a = m; ga = gm; } else b = m; }
  return (a + b) / 2;
}
const derivada = (F, t, hh = 1e-4) => (F(t + hh) - F(t - hh)) / (2 * hh);
const segunda = (F, t, hh = 1e-2) => (F(t + hh) - 2 * F(t) + F(t - hh)) / (hh * hh);
// Distancia de un viaje v-t en trapecio (acelera con a hasta vt, sigue, frena con b) que dura T:
// se integra v(t) en pasos, así no se usa ninguna fórmula de tiempos.
function areaTrapecio(a, b, vt, T, n = 20000) {
  const ta = vt / a, tb = vt / b; if (ta + tb > T) return NaN;
  const vel = t => (t < ta ? a * t : t > T - tb ? b * (T - t) : vt);
  let s = 0; const dt = T / n;
  for (let i = 0; i < n; i++) s += (vel(i * dt) + vel((i + 1) * dt)) / 2 * dt; // exacta por tramos lineales salvo en los quiebres
  return s;
}
const COS = { 0: 1, 12: 0.98, 14: 0.97, 16: 0.96, 18: 0.95, 37: 0.8, 53: 0.6, 60: 0.5 };

function recalcular(p) {
  const d = p._datos;
  if (d.tipo === 'media') {
    if (d.sub === 'distancia') return d.D / (d.D / 2 / d.v1 + d.D / 2 / d.v2);
    if (d.sub === 'tiempo') return (d.v1 * d.T / 2 + d.v2 * d.T / 2) / d.T;
    if (d.sub === 'duraciones') { // minuto a minuto: lo avanzado y el reloj
      let x = 0, t = 0;
      for (let m = 0; m < d.t1; m++) { x += d.v1 / 60; t++; }
      t += d.tp;
      for (let m = 0; m < d.t2; m++) { x += d.v2 / 60; t++; }
      return x / (t / 60);
    }
    // mixta: cada mitad mide 1 km; en la segunda, dos ratos iguales τ con v2·τ + v3·τ = 1
    const tau = biseccion(s => (d.v2 + d.v3) * s - 1, 0, 10);
    return 2 / (1 / d.v1 + 2 * tau);
  }
  if (d.tipo === 'idavuelta') {
    const fin = d.t[d.t.length - 1];
    let recorrido = 0; for (let i = 1; i < d.x.length; i++) recorrido += Math.abs(d.x[i] - d.x[i - 1]);
    return d.sub === 'rapidez' ? recorrido / fin : Math.abs(d.x[d.x.length - 1] - d.x[0]) / fin;
  }
  if (d.tipo === 'vt') {
    if (d.sub === 'vmax') { // triángulo simétrico de duración t: se busca la cima cuya área da d
      return biseccion(vm => areaTrapecio(vm / (d.t / 2), vm / (d.t / 2), vm, d.t + 1e-12) - d.d, 0.01, 500);
    }
    if (d.sub === 'tmin') { // cima por bisección con x = v²/(2a) en cada tramo; luego los tiempos
      const vm = biseccion(w => w * w / (2 * d.a) + w * w / (2 * d.b) - d.d, 0, 1000);
      return vm / d.a + vm / d.b;
    }
    const T = biseccion(T => areaTrapecio(d.a, d.b, d.vt, T) - d.d, d.vt / d.a + d.vt / d.b + 1e-9, 2000);
    return T;
  }
  if (d.tipo === 'ecuacion') {
    const [a, b, c] = d.coef, F = t => a + b * t + c * t * t;
    if (d.sub === 'velocidad') return derivada(F, d.t);
    if (d.sub === 'aceleracion') return segunda(F, 1);
    if (d.sub === 'desplazamiento') return F(d.t2) - F(d.t1);
    if (d.sub === 'parada') return biseccion(t => derivada(F, t), 0, 100);
    return biseccion(F, 0, 100); // origen: la raíz positiva
  }
  if (d.tipo === 'xy') {
    const X = t => d.x0 + d.vx * t, Y = t => d.y0 + d.vy * t - 5 * t * t;
    if (d.sub === 'distancia') return Math.hypot(X(d.t), Y(d.t));
    if (d.sub === 'rapidez') return Math.hypot(derivada(X, d.t), derivada(Y, d.t));
    if (d.sub === 'altura') return Y(biseccion(t => derivada(Y, t), 0, 100));
    const tv = biseccion(t => Y(t) - d.y0, 1e-3, 100);
    return X(tv) - X(0);
  }
  // latitud: posición de un punto en la esfera que gira (π = 3, T = 24 h); rapidez por diferencias
  const R = 6400, c = COS[d.lat], s = Math.sqrt(1 - c * c), w = 2 * 3 / 24;
  const pos = t => [R * c * Math.cos(w * t), R * c * Math.sin(w * t), R * s];
  if (d.sub === 'radio') return Math.hypot(pos(0)[0], pos(0)[1]);
  const hh = 1e-4, A = pos(-hh), B = pos(hh);
  return Math.hypot(B[0] - A[0], B[1] - A[1], B[2] - A[2]) / (2 * hh);
}

probarGenerador(gen, { semillas: 600, recalcular: p => {
  const r = recalcular(p);
  return Math.abs(r - p.respuesta.valor) < 1e-6 * Math.max(1, Math.abs(r)) ? p.respuesta.valor : r;
} });

for (const c of casos.casos) {
  test(`casos.json: semilla ${c.semilla}`, () => {
    const p = gen.generar(c.semilla);
    assert.deepEqual(p._datos, c.entrada, 'el generador cambió: recalcula casos.json');
    assert.ok(Math.abs(p.respuesta.valor - c.esperado.respuesta) <= casos.tolerancia, `da ${p.respuesta.valor}`);
    assert.equal(p.alternativas.find(a => a.correcta).texto, c.esperado.exacta);
  });
}

const TODOS = ['ecuacion/aceleracion', 'ecuacion/desplazamiento', 'ecuacion/origen', 'ecuacion/parada', 'ecuacion/velocidad', 'idavuelta/rapidez', 'idavuelta/velocidad',
  'latitud/radio', 'latitud/rapidez', 'media/distancia', 'media/duraciones', 'media/mixta', 'media/tiempo', 'vt/tmin', 'vt/tope', 'vt/vmax',
  'xy/alcance', 'xy/altura', 'xy/distancia', 'xy/rapidez'];

test('salen todos los tipos y subtipos; alternativas con la misma unidad y pocos decimales', () => {
  const vistos = new Set();
  let ceros = 0, paradas = 0;
  for (let s = 0; s < 1500; s++) {
    const p = gen.generar(s), d = p._datos;
    vistos.add(d.tipo + '/' + d.sub);
    if (p.respuesta.valor === 0) ceros++;
    if (d.tipo === 'media' && d.sub === 'duraciones' && d.tp) paradas++;
    const unidad = a => a.texto.replace(/^[−\d ,]+/, '');
    assert.equal(new Set(p.alternativas.map(unidad)).size, 1, `semilla ${s}: unidades distintas (${p.alternativas.map(a => a.texto)})`);
    for (const a of p.alternativas) assert.ok(!/\d,\d{3}/.test(a.texto), `semilla ${s}: más de dos decimales (${a.texto})`);
  }
  assert.deepEqual([...vistos].sort(), TODOS);
  assert.ok(ceros > 5, `la velocidad media 0 de ida y vuelta casi no sale (${ceros})`);
  assert.ok(paradas > 20, `casi no salen paradas (${paradas})`);
});

test('condiciones físicas: tope por debajo de la cima sin tope, una sola raíz positiva, no se detiene en el desplazamiento', () => {
  for (let s = 0; s < 1500; s++) {
    const d = gen.generar(s)._datos;
    if (d.tipo === 'vt' && d.sub === 'tope') assert.ok(d.vt * d.vt * (1 / d.a + 1 / d.b) / 2 < d.d, `semilla ${s}: el tope no se alcanza`);
    if (d.tipo === 'ecuacion' && d.sub === 'origen') { const [a, , c] = d.coef; assert.ok(a / c < 0, `semilla ${s}: dos raíces del mismo signo`); }
    if (d.tipo === 'ecuacion' && d.sub === 'desplazamiento') { const [, b, c] = d.coef, tp = -b / (2 * c); assert.ok(!(tp > d.t1 && tp < d.t2), `semilla ${s}`); }
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

// ---------- papel.json: estructura y recálculo de cada respuesta con funciones propias ----------
const CALC = {
  armonica: ([v1, v2]) => 2 / (1 / v1 + 1 / v2),
  tramos: ([v1, t1, tp, v2, t2]) => (v1 * t1 + v2 * t2) / (t1 + tp + t2),
  idavuelta: ([xs, ts, que]) => { let r = 0; for (let i = 1; i < xs.length; i++) r += Math.abs(xs[i] - xs[i - 1]); return que === 'rapidez' ? r / ts[ts.length - 1] : Math.abs(xs[xs.length - 1] - xs[0]) / ts[ts.length - 1]; },
  tmin: ([dist, a, b]) => { const vm = biseccion(w => w * w / (2 * a) + w * w / (2 * b) - dist, 0, 1e4); return vm / a + vm / b; },
  tope: ([dist, a, b, vt]) => biseccion(T => areaTrapecio(a, b, vt, T) - dist, vt / a + vt / b + 1e-9, 1e4),
  velocidadX: ([a, b, c, t]) => derivada(x => a + b * x + c * x * x, t),
  origenX: ([a, b, c]) => biseccion(x => a + b * x + c * x * x, 0, 1000),
  alturaXY: ([y0, vy]) => { const Y = t => y0 + vy * t - 5 * t * t; return Y(biseccion(t => derivada(Y, t), 0, 100)); },
  distanciaXY: ([x0, vx, y0, vy, t]) => Math.hypot(x0 + vx * t, y0 + vy * t - 5 * t * t),
  latitud: ([R, cos, horas]) => 2 * 3 * R * cos / horas,
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
        assert.ok(r >= 1 / topeEscala(a) && r <= topeEscala(a), `semilla ${s}: «${a.texto}» frente a «${c.texto}» (${a.error.id})`);
      }
    }
  }
  assert.ok(sola / n < 0.05, `la correcta es la única redonda en ${sola} de ${n}`);
  for (const s of [...Array(2001).keys(), 'entrada-1', 'entrada-2', 'salida-1', 'salida-3']) assert.doesNotThrow(() => gen.generar(s), `semilla ${s}`);
});

// ---------- Escena viva (docs/escena-viva.md): la gráfica v-t del kit en el tipo «vt» ----------
const { probarViva } = require('../../nucleo/kit/piezas/probar-viva.js');
const KitV = require('../../nucleo/kit/kit.js');
probarViva(gen, {
  semillas: 300, pieza: 'ejes', presupuestoSoloEscena: true,
  conEscena: p => p._datos.tipo === 'vt',
  final: (p, fin, s) => {
    // El final dibuja la respuesta con su ✓, y lo que se lee en la gráfica es lo que vale.
    assert.ok(fin.includes(`>${KitV.formatear(p.respuesta.valor)}${p.escena.datos.sufijo} ✓<`), `semilla ${s}: el final no dibuja la respuesta`);
    const d = p._datos;
    // En vmax la gráfica carga d (el área) y t (el último número del eje t).
    if (d.sub === 'vmax') assert.ok(fin.includes(`>${d.d} m<`) && fin.includes(`>${KitV.formatear(d.t)}<`), `semilla ${s}: la gráfica no carga d y t`);
  },
});

