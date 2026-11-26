// Pruebas de «Estática» (fis-estatica): casos.json (calculados aparte, con un script que no usa el generador ni el
// motor), un recálculo independiente en 600 problemas (cada equilibrio resuelto por eliminación de Gauss sobre la suma de
// fuerzas y de torques, sin las fórmulas despejadas ni plantillas/estatica/motor.js), fugas, los tipos por idea, los
// colores de la unidad, los códigos de error y su respaldo, el recuadro «Datos» en 400 semillas y que la práctica no
// repite ninguna Predice.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const gen = require('./generador.js');
const casos = require('./casos.json');
const { probarGenerador, probarFugas } = require('../../nucleo/probar-generador.js');
const EST = 'docs/investigacion/estatica-energia-ideas-erroneas.md';

// ---- Camino independiente ----
const SN = { 0: 0, 30: 1 / 2, 37: 3 / 5, 45: Math.SQRT2 / 2, 53: 4 / 5, 60: Math.sqrt(3) / 2, 90: 1 };
const sn = a => { a = ((a % 360) + 360) % 360; if (a <= 90) return SN[a]; if (a <= 180) return SN[180 - a]; if (a <= 270) return -SN[a - 180]; return -SN[360 - a]; };
const cs = a => sn(a + 90);
function resolver(fz, ecs = ['x', 'y']) {
  const inc = fz.map((q, i) => (q[0] === null ? i : -1)).filter(i => i >= 0);
  const c = (q, e) => (e === 'x' ? cs(q[1]) : e === 'y' ? sn(q[1]) : (q[2] || 0) * sn(q[1]) - (q[3] || 0) * cs(q[1]));
  const A = ecs.map(e => [...inc.map(i => c(fz[i], e)), -fz.filter(q => q[0] !== null).reduce((t, q) => t + q[0] * c(q, e), 0)]), n = inc.length;
  for (let k = 0; k < n; k++) {
    let p = k; for (let r = k; r < A.length; r++) if (Math.abs(A[r][k]) > Math.abs(A[p][k])) p = r;
    [A[k], A[p]] = [A[p], A[k]];
    for (let r = 0; r < A.length; r++) if (r !== k) { const m = A[r][k] / A[k][k]; for (let j = k; j <= n; j++) A[r][j] -= m * A[k][j]; }
  }
  return inc.map((_, k) => A[k][n] / A[k][k]);
}
const estirar = (Fz, k) => { let x = 0; while (k * x < Fz - 1e-9) x += 1e-4; return x; };
function recalcular(p) {
  const d = p._datos;
  switch (d.tipo) {
    case 'balanza': return resolver([[10 * d.m, 270], [d.F, d.abajo ? 270 : 90], [null, 90]], ['y'])[0];
    case 'apiladas': return d.entre ? 10 * d.a : 10 * (d.a + d.b);
    case 'pesa': return resolver([[10 * d.M, 270], [10 * d.mp, 270], [null, 90]], ['y'])[0];
    case 'simetrico': return resolver([[null, 180 - d.a], [null, d.a], [d.P, 270]])[0];
    case 'asimetrico': { const r = resolver([[null, 143], [null, 53], [d.P, 270]]); return d.cual === 37 ? r[0] : r[1]; }
    case 'pared': return resolver([[null, 90 - d.a], [null, 180], [10 * d.m, 270]])[1];
    case 'quieto': return d.F <= d.mus * 10 * d.m + 1e-9 ? d.F : NaN;
    case 'rampa': { const r = resolver([[10 * d.m, 270], [null, 90 + d.a], [null, d.a]]); return d.pideN ? r[0] : r[1]; }
    case 'oblicua': return resolver([[d.F, d.a], [10 * d.m, 270], [null, 90]], ['y'])[0];
    case 'estira': return estirar(10 * d.m, d.k) * 100;
    case 'largo': return d.L0 + estirar(10 * d.m, d.k) * 100;
    case 'polea': return estirar(d.P / 2, d.k) * 100;
    case 'torque': return d.F * d.d / 100;
    case 'balancin': return resolver([[10 * d.ma, 270, -d.da], [null, 270, 1]], ['t'])[0] / (10 * d.mb);
    case 'inclinada': return d.F * d.L * sn(d.a);
    case 'apoyos': { const r = resolver([[null, 90, 0], [null, 90, 4], [d.Pb, 270, 2], [d.P, 270, d.x]], ['y', 't']); return d.pideB ? r[1] : r[0]; }
    case 'caballete': return resolver([[null, 270, -d.a], [10 * d.m, 270, d.L / 2 - d.a]], ['t'])[0];
    case 'escalera': return resolver([[null, 180, d.L * cs(d.a), d.L * sn(d.a)], [d.Pe, 270, d.L / 2 * cs(d.a)], [d.P, 270, d.s * cs(d.a)]], ['t'])[0];
    default: throw new Error(`tipo sin recálculo: ${d.tipo}`);
  }
}
const cerca = (a, b) => Math.abs(a - b) <= Math.max(2e-3, 1e-3 * Math.abs(b));

probarGenerador(gen, { semillas: 600, recalcular, igual: cerca });
probarFugas(gen);

for (const c of casos.casos) {
  test(`casos.json: semilla ${c.semilla} (${c.entrada.tipo})`, () => {
    const p = gen.generar(c.semilla);
    assert.deepEqual(p._datos, c.entrada, 'el generador cambió: recalcula casos.json');
    assert.ok(cerca(p.respuesta.valor, c.esperado.respuesta), `${p.respuesta.valor} contra ${c.esperado.respuesta}`);
    assert.equal(p.alternativas.find(a => a.correcta).texto.replace(/[  ]/g, ' '), c.esperado.texto.replace(/[  ]/g, ' '));
  });
}

test('tipos por idea: las seis ideas de la unidad, cada tipo con su nivel y todos salen', () => {
  const ideas = require('../../contenido/teoria/fisica/estatica.js').ideas.map(i => i.id);
  assert.deepEqual(Object.keys(gen.TIPOS_POR_IDEA), ideas);
  for (const [idea, tipos] of Object.entries(gen.TIPOS_POR_IDEA)) {
    const vistos = new Set();
    for (let s = 0; s < 300; s++) { const p = gen.generar(s, { idea }); assert.equal(p._datos.idea, idea); vistos.add(p._datos.tipo); }
    assert.deepEqual([...vistos].sort(), [...tipos].sort(), idea);
    assert.ok(tipos.some(t => gen.NIVEL[t] === 3), `${idea}: llega al de examen`);
  }
});

test('cada error trae su código, su respaldo y su fuente; la explicación empieza por lo bien hecho y muestra su valor', () => {
  const ids = new Set();
  for (let s = 0; s < 1500; s++) {
    const p = gen.generar(s);
    for (const a of p.alternativas.filter(x => x.error)) {
      const e = a.error;
      ids.add(e.id);
      assert.equal(e.respaldo, ['E1', 'E8', 'E10'].includes(e.id) ? 'documentado' : 'hipotesis', `semilla ${s}: ${e.id}`);
      assert.equal(e.fuente, EST);
      assert.match(e.explicacion, /^Bien/, `semilla ${s}: ${e.explicacion}`);
      assert.ok(e.explicacion.includes(a.texto), `semilla ${s}: «${e.explicacion}» no muestra ${a.texto}`);
      assert.ok(!/\b(alternativa|opción|letra) [A-E]\b|\bla [A-E]\b/.test(e.explicacion), `semilla ${s}: nombra una letra`);
    }
  }
  const informe = fs.readFileSync(path.join(__dirname, '..', '..', EST), 'utf8');
  for (const id of ids) assert.ok(informe.includes(id), `${id} no está en ${EST}`);
});

test('un color por clase de fuerza: peso carmín, normal violeta, tensión y mano naranja, rozamiento turquesa; sin verde', () => {
  const COLOR = { P: 'h', N: 'f', T: 'o', f: 'i' };
  for (let s = 0; s < 1000; s++) {
    const p = gen.generar(s);
    for (const [k, x] of Object.entries(p.variables)) assert.equal(x.color, COLOR[k], `semilla ${s}: ${k}`);
  }
});

test('datos en líneas cortas, sin la respuesta ni consejos; la práctica no repite las predicciones', () => {
  const plano = x => (Array.isArray(x) ? x.map(plano).join('') : x && typeof x === 'object' ? String(x.t) : String(x));
  for (let s = 0; s < 400; s++) {
    const p = gen.generar(s), ok = p.alternativas.find(a => a.correcta).texto;
    assert.ok(Array.isArray(p.datos) && p.datos.length >= 2, `semilla ${s}`);
    for (const l of p.datos) {
      assert.ok(l.split(/\s+/).filter(w => /\p{L}/u.test(w)).length <= 22, `semilla ${s}: «${l}»`);
      assert.ok(!/\b(recuerda|fíjate|ojo|conviene|debes)\b/i.test(l), `semilla ${s}: consejo «${l}»`);
      assert.ok(!new RegExp(`(?<![\\d,])${ok.replace(/[/()·]/g, '\\$&')}(?![\\d])`).test(l), `semilla ${s}: los datos traen ${ok}`);
    }
    const t = plano([p.enunciado, p.pregunta]);
    assert.ok(!/de 40 kg\..*con 100 N/.test(t), `semilla ${s}: la Predice de la idea 1`);
  }
});

// Auditoría del 19 nov (rutinas/auditoria/fisica.estatica.md, M4 y M6): un error que da la correcta descarta el caso
// (antes se borraba en silencio y quien se equivocaba así acertaba), y el sube y baja no pasa de 2,5 m del apoyo.
// Con la versión de antes falla: el ropero a la mitad del tope (RZ-RESTA), los cables a 30° (ST-P), el tablón con
// L = 4a (TQ-IGUAL), las cajas con b = 2a (N-SIGNO), k ÷ P = x (RS-INV) y el niño a 2,88 m.
test('auditoría: ningún error da la correcta, y las distancias del sube y baja son posibles', () => {
  const ig = (a, b) => Math.abs(a - b) < 1e-9;
  for (const idea of Object.keys(gen.TIPOS_POR_IDEA)) for (let s = 0; s < 400; s++) {
    const d = gen.generar(s, { idea })._datos, que = `${d.tipo} ${s}: ${JSON.stringify(d)}`;
    if (d.tipo === 'quieto') assert.ok(!ig(d.F, d.mus * d.m * 10 / 2), que);
    if (d.tipo === 'simetrico') assert.notEqual(d.a, 30, que);
    if (d.tipo === 'caballete') assert.notEqual(d.L, 4 * d.a, que);
    if (d.tipo === 'apiladas' && d.entre) assert.notEqual(d.b, 2 * d.a, que);
    if (d.tipo === 'estira') assert.ok(!ig(d.k / (d.m * 10), d.m * 10 / d.k * 100), que);
    if (d.tipo === 'balancin') { const db = d.ma * d.da / d.mb; assert.ok(db <= 2.5 && !ig(d.da + (d.ma - d.mb) / 10, db), que); }
  }
  for (let s = 0; s < 400; s++) {
    const p = gen.generar(s, { idea: 'torque-y-brazo' });
    for (const a of p.alternativas) assert.ok(!/revisa la cuenta/.test(a.explicacion || ''), `semilla ${s}: «${a.explicacion}» no es un error con nombre`);
  }
});

test('verificación 26 nov: en el caballete, TQ-INV dice bien cuál pesa más (con L = 3 m y a = 1 m la carga pesa menos)', () => {
  let vistos = 0;
  for (let s = 0; s < 1500; s++) {
    const p = gen.generar(s, { idea: 'cuerpo-rigido' }), d = p._datos;
    if (d.tipo !== 'caballete') continue;
    const a = p.alternativas.find(x => x.error && x.error.id === 'TQ-INV');
    if (!a) continue;
    vistos++;
    const Pb = 10 * d.m, Pc = Pb * (d.L / 2 - d.a) / d.a;
    assert.match(a.error.explicacion, Pc > Pb ? /la carga pesa más que el tablón/ : /la carga pesa menos que el tablón/, `semilla ${s}: ${JSON.stringify(d)}`);
  }
  assert.ok(vistos > 10, `${vistos} casos`);
});

test('verificación 26 nov: en la caja quieta en la rampa, si piden lo que empuja la rampa, E10 habla de la normal', () => {
  let vistos = 0;
  for (let s = 0; s < 1500; s++) {
    const p = gen.generar(s, { idea: 'rozamiento-se-ajusta' }), d = p._datos;
    if (d.tipo !== 'rampa' || !d.pideN) continue;
    const a = p.alternativas.find(x => x.error && x.error.id === 'E10');
    if (!a) continue;
    vistos++;
    assert.match(a.error.explicacion, /normal/, `semilla ${s}: ${a.error.explicacion}`);
    assert.doesNotMatch(a.error.explicacion, /vale lo justo/, `semilla ${s}: habla del rozamiento cuando piden la normal`);
  }
  assert.ok(vistos > 10, `${vistos} casos`);
});
