// Pruebas de «El temblor y el trueno»: casos.json (calculados aparte), un recálculo independiente en
// cada uno de 600 problemas, todos los tipos, unidades, textos y el papel.
const test = require('node:test');
const assert = require('node:assert/strict');
const gen = require('./generador.js');
const casos = require('./casos.json');
const papel = require('./papel.json');
const { probarGenerador } = require('../../nucleo/probar-generador.js');

// ---- Camino independiente ----
// Llegadas: se busca por bisección la distancia d con la que d/vlenta − d/vrápida da el Δt medido
// (la luz del relámpago a 3·10⁸ m/s, no «al instante»). Función de onda: se sigue una cresta
// resolviendo la fase constante por bisección, y λ y T se miden barriendo los ceros de y(x, 0) e
// y(0, t). Medio: la razón de rapideces es la inversa de la razón de tiempos. Proposiciones: una
// tabla de verdad escrita aparte.
function biseccion(g, a, b) {
  let ga = g(a);
  for (let i = 0; i < 300; i++) { const m = (a + b) / 2, gm = g(m); if ((gm > 0) === (ga > 0)) { a = m; ga = gm; } else b = m; }
  return (a + b) / 2;
}
const fase = (d, x, t) => {
  if (d.forma === 'kx-wt') return d.k * x - d.w * t;
  if (d.forma === 'kx+wt') return d.k * x + d.w * t;
  if (d.forma === 'wt-kx') return d.w * t - d.k * x;
  return d.w * t + d.k * x;
};
// Primer cero de sen(fase) después del 0, barriendo y afinando por bisección.
function primerCero(F, paso, max) {
  let a = paso, fa = Math.sin(F(a));
  for (let x = 2 * paso; x < max; x += paso) {
    const fx = Math.sin(F(x));
    if ((fx > 0) !== (fa > 0)) return biseccion(z => Math.sin(F(z)), x - paso, x);
    a = x; fa = fx;
  }
  throw new Error('sin cero');
}
// Desplazamiento de la cresta en un tiempo t: la fase en (x, t) igual a la fase en (0, 0).
const corrimiento = (d, t) => biseccion(x => fase(d, x, t) - fase(d, 0, 0), -1e5, 1e5);
const VERDAD = { L1: true, L2: false, L3: true, S1: false, S2: true, S3: false, V1: false, V2: true, V3: true, R1: false, R2: true,
  L4: false, S4: true, S5: false, V4: false, V5: false, R3: false };

function recalcular(p) {
  const d = p._datos;
  if (d.tipo === 'llegadas') {
    const rapida = d.v1 === null ? 3e8 : d.v1;
    // trueno: distancia en m y respuesta en km
    const dist = biseccion(x => x / d.v2 - x / rapida - d.dt, 0, 1e7);
    if (d.sub === 'trueno') return dist / 1000;
    if (d.sub === 'sismo-tp') return dist / rapida;
    return dist;
  }
  if (d.tipo === 'medio') {
    const ta = d.L / d.va, tm = ta - d.dt;
    return (d.va / d.f) * (ta / tm);
  }
  if (d.tipo === 'funcion') {
    if (d.sub === 'distancia') return Math.abs(corrimiento(d, d.t));
    if (d.sub === 'lambda') return 2 * primerCero(x => fase(d, x, 0) - fase(d, 0, 0), 1e-4, 200);
    if (d.sub === 'frecuencia') return 1 / (2 * primerCero(t => fase(d, 0, t) - fase(d, 0, 0), 1e-5, 10));
    const dx = corrimiento(d, 1e-3), vel = Math.abs(dx) / 1e-3;
    return `sent:${dx > 0 ? '+' : '-'}|${Math.round(vel * 1e6)}`;
  }
  return 'vf:' + d.props.map(id => (VERDAD[id] ? 'V' : 'F')).join('');
}
const cerca = (a, b) => Math.abs(a - b) <= 1e-5 * Math.max(1, Math.abs(a));
probarGenerador(gen, { semillas: 600, recalcular, igual: (a, b) => {
  if (typeof b !== 'string') return cerca(a, b);
  if (b.startsWith('sent:')) { // la rapidez medida con la cresta: unos micrómetros por segundo de margen
    const [sa, va] = a.split('|'), [sb, vb] = b.split('|');
    return sa === sb && Math.abs(+va - +vb) <= 5;
  }
  return a === b;
} });

for (const c of casos.casos) {
  test(`casos.json: semilla ${c.semilla}`, () => {
    const p = gen.generar(c.semilla);
    assert.deepEqual(p._datos, c.entrada, 'el generador cambió: recalcula casos.json');
    if (typeof c.esperado.respuesta === 'number') assert.ok(Math.abs(p.respuesta.valor - c.esperado.respuesta) <= casos.tolerancia, `da ${p.respuesta.valor}`);
    else assert.equal(p.respuesta.valor, c.esperado.respuesta);
    assert.equal(p.alternativas.find(a => a.correcta).texto, c.esperado.exacta);
  });
}

test('salen todos los tipos y subtipos; las alternativas numéricas llevan la misma unidad', () => {
  const vistos = new Set();
  for (let s = 0; s < 600; s++) {
    const p = gen.generar(s), d = p._datos;
    vistos.add(d.tipo + '/' + d.sub);
    if (typeof p.respuesta.valor === 'number') {
      const unidad = a => a.texto.replace(/^[−\d ,]+/, '');
      assert.equal(new Set(p.alternativas.map(unidad)).size, 1, `semilla ${s}: unidades distintas (${p.alternativas.map(a => a.texto)})`);
    }
  }
  assert.deepEqual([...vistos].sort(), ['funcion/distancia', 'funcion/frecuencia', 'funcion/lambda', 'funcion/sentido', 'llegadas/riel', 'llegadas/sismo',
    'llegadas/sismo-tp', 'llegadas/trueno', 'medio/lambda', 'particulas/vf']);
});

test('la trampa de cada fila del lote sale como alternativa', () => {
  const ids = new Set();
  for (let s = 0; s < 600; s++) for (const a of gen.generar(s).alternativas) if (a.error) ids.add(a.error.id);
  for (const id of ['LL-diferencia-rapideces', 'ON2-lambda-fija', 'ON-k-como-rapidez', 'ON-cociente-invertido', 'ON5-se-va', 'ON5-sube-y-baja', 'PR7-periodo'])
    assert.ok(ids.has(id), `no sale ${id}`);
});

test('las proposiciones: en «sentido» salen las cuatro formas de la fase y las dos direcciones', () => {
  const formas = new Set(), dir = new Set();
  for (let s = 0; s < 600; s++) {
    const d = gen.generar(s)._datos;
    if (d.sub === 'sentido') { formas.add(d.forma); dir.add(gen.generar(s).respuesta.valor.slice(5, 6)); }
  }
  assert.equal(formas.size, 4); assert.equal(dir.size, 2);
});

test('los textos no dicen «de el» ni «a el»', () => {
  const plano = seg => seg.map(x => (typeof x === 'string' ? x : x.t)).join('');
  for (let s = 0; s < 1000; s++) {
    const p = gen.generar(s);
    const todo = [plano(p.enunciado), plano(p.pregunta), ...p.solucion.map(plano), ...p.alternativas.filter(a => a.error).map(a => a.error.explicacion)].join(' ');
    assert.ok(!/\b[Dd]e el\b|\b[Aa] el\b/.test(todo), `semilla ${s}`);
  }
});

test('600 semillas: la correcta no es la única redonda y ningún distractor sale de 1/20 a 20 veces la correcta', () => {
  const dec = t => { const m = t.match(/,(\d+)/); return m ? m[1].length : 0; };
  for (let s = 0; s < 600; s++) {
    const p = gen.generar(s);
    if (typeof p.respuesta.valor !== 'number') continue;
    const c = p.alternativas.find(a => a.correcta), otras = p.alternativas.filter(a => !a.correcta);
    assert.ok(dec(c.texto) >= Math.min(...otras.map(a => dec(a.texto))), `semilla ${s}: solo la correcta es redonda (${p.alternativas.map(a => a.texto)})`);
    for (const a of otras) assert.ok(a.valor / c.valor <= 20 && a.valor / c.valor >= 1 / 20, `semilla ${s}: ${a.texto} es absurdo frente a ${c.texto}`);
  }
});

test('nunca se queda sin cuatro alternativas (semillas 0 a 2000 y de texto)', () => {
  for (let s = 0; s <= 2000; s++) gen.generar(s);
  for (const s of ['entrada-1', 'entrada-2', 'salida-1', 'salida-3', 'alternativas-7']) gen.generar(s);
});

// ---- Papel: estructura y cada «verificar» recalculado con funciones propias del test ----
const PAPEL = {
  // Dos ondas desde un foco: la distancia con la diferencia de tiempos (bisección).
  'dos-ondas': ([rapida, lenta, dt]) => biseccion(x => x / lenta - x / rapida - dt, 0, 1e7),
  // λ en el otro medio con la frecuencia fija.
  'lambda-medio': ([L, dt, va, fr]) => (L / (L / va - dt)) / fr,
  // y = A sen(kx − ωt): rapidez, λ y f.
  'rapidez-onda': ([k, w]) => w / k,
  'lambda-onda': ([k]) => 2 * Math.PI / k,
  'frecuencia-onda': ([w]) => w / (2 * Math.PI),
  'distancia-mru': ([vel, t]) => vel * t,
  'lambda-v-f': ([vel, fr]) => vel / fr,
};
test('papel.json: estructura y respuestas recalculadas', () => {
  assert.ok(papel.titulo && papel.indicacion);
  assert.ok(papel.problemas.length >= 5 && papel.problemas.length <= 10);
  assert.equal(new Set(papel.problemas.map(p => p.id)).size, papel.problemas.length);
  for (const p of papel.problemas) {
    for (const campo of ['enunciado', 'respuesta']) assert.ok(typeof p[campo] === 'string' && p[campo].length, `${p.id}: falta ${campo}`);
    assert.ok(Array.isArray(p.pasos) && p.pasos.length, `${p.id}: faltan pasos`);
    assert.ok(Array.isArray(p.verificar) && p.verificar.length, `${p.id}: falta verificar`);
    assert.ok(!/<[a-z\/]/i.test(JSON.stringify(p)), `${p.id}: tiene HTML`);
    for (const v of p.verificar) {
      assert.ok(PAPEL[v.tipo], `${p.id}: tipo desconocido ${v.tipo}`);
      const r = PAPEL[v.tipo](v.args);
      assert.ok(Math.abs(r - v.espera) <= 0.01 * Math.max(1, Math.abs(v.espera)) / 10, `${p.id}: ${v.tipo} da ${r}, espera ${v.espera}`);
    }
  }
});
