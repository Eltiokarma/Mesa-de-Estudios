// Pruebas propias de «Trabajo, energía y potencia» (además del validador común de contenido/teoria/teoria.test.js). La
// unidad se rehizo el 19 nov 2026 (etapa 8, docs/etapa8/propuesta-fisica.md); con calidad: 2 desde el cierre (lector en
// frío y auditor); la prueba corre las reglas de calidad 2 en 400 semillas.
//   - la forma: seis ideas en el orden de la propuesta, los cinco ids publicados más el nuevo, las tres mesas;
//   - un color fijo por clase de fuerza (peso carmín, normal violeta, mano y cuerda naranja, rozamiento turquesa), y cada
//     trabajo y cada energía potencial con el de su fuerza; E_C y E_M en tinta; sin verde;
//   - los 90 ejemplos contra los valores calculados aparte (ESPERADO, rehechos por scratchpad e8-fisica/cuentas.js con el
//     trabajo como suma por pasos y el movimiento integrado); en los de examen, la letra de la respuesta es la de su valor
//     y A–E salen 6 veces cada una;
//   - «Ahora tú» en 400 semillas por idea: 4 opciones distintas, una sola correcta, ningún error que dé la correcta, y su
//     valor es el que se calcula aparte con los números que se leen en la pregunta (o en su gráfica), por pasos o con el
//     motor de la escena `energia`, no con las fórmulas de la unidad;
//   - cada misión con un solo caso de la grilla (sin contar el avance), y no cumplida al abrir;
//   - ningún «_» en un texto que la app muestra tal cual; las figuras caben y sus rótulos no se pisan;
//   - el avance: las predicciones viejas sin huella se borran una vez y quien terminó las cinco ideas de antes conserva
//     «Ya la estudié» (nucleo/avance.js, REHECHAS_E6).
const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
require('../../../nucleo/kit/kit.js');
const Teoria = require('../../../nucleo/teoria.js');
const E = require('../../../nucleo/ecuacion.js');
const def = require('./trabajo-y-energia.js');
for (const r of def.requiere) require(path.join(__dirname, '..', '..', '..', r));
const P = require('../../../nucleo/kit/piezas/fis-estatica.js');
const M = require('../../../plantillas/energia/motor.js');
const plano = x => E.texto(x === undefined || x === null ? '' : x).replace(/⁠/g, '');
const nums = s => (String(s).replace(/−/g, '-').match(/-?\d{1,3}(?:[   ]\d{3})+(?:,\d+)?|-?\d+(?:,\d+)?/g) || []).map(x => Number(x.replace(/[   ]/g, '').replace(',', '.')));
const cerca = (a, b, tol = 0.006) => Math.abs(a - b) <= tol * Math.max(1, Math.abs(b));
const G = 10;

// ---------- La forma ----------
test('seis ideas en el orden de la propuesta; los cinco ids publicados se conservan; tres mesas', () => {
  assert.equal(def.unidad, 'fisica.trabajo-y-energia');
  assert.deepEqual(def.ideas.map(i => i.id), ['trabajo-y-angulo', 'trabajo-energia-cinetica', 'energia-potencial', 'conservacion-energia', 'energia-y-rozamiento', 'potencia-y-eficiencia']);
  assert.deepEqual(def.laboratorio.map(m => m.id), ['cuerda-libre', 'rampa', 'empujon']);
  for (const i of def.ideas) {
    for (const k of ['aprendizaje', 'actividad', 'pregunta', 'lee', 'resuelve']) assert.ok(i[k], `${i.id}: ${k}`);
    assert.ok(i.juega.mision && i.juega.leyenda && i.juega.resumen, i.id);
    assert.deepEqual(Teoria.momentosDe(i), ['lee', 'juega', 'predice', 'mira', 'regla', 'resuelve', 'ahora-tu']);
    for (const t of [i.regla.texto, i.regla.condicion, i.juega.mision.texto, i.titulo, i.pregunta, i.actividad]) assert.equal(typeof t, 'string', i.id);
    assert.match(i.regla.condicion, /^[a-záéíóúñμθ]/, `${i.id}: «Vale si» en minúscula`);
  }
});

// ---------- Colores ----------
const fichas = x => (x === null || x === undefined || typeof x !== 'object' ? [] : Array.isArray(x) ? x.flatMap(fichas)
  : typeof x.v === 'string' && /^c-/.test(x.v) ? [x] : Object.values(x).flatMap(fichas));
function figurasDe(i) {
  const out = [];
  const add = fg => { if (fg && (fg.pieza || i.pieza) === 'fis-estatica') out.push(fg); };
  for (const t of i.lee.tarjetas) add(t.dibujo);
  for (const v of Teoria.grilla(i.juega.controles).slice(0, 120)) add(i.juega.dibujo(v));
  add(i.predice.dibujo); add(i.predice.revelar); add(i.regla.dibujo);
  if ((i.mira.pieza || i.pieza) === 'fis-estatica') for (const p of i.mira.pasos) add({ pieza: 'fis-estatica', datos: i.mira.datos, estado: p.estado });
  for (const e of i.ejemplos) add(e.figura);
  for (let s = 0; s < 24; s++) { add(i.ahoraTu.generar(s).dibujo); add(i.resuelve.generar(s).dibujo); }
  return out;
}
test('un color fijo por clase de fuerza, el de Estática; cada trabajo y energía potencial con el de su fuerza; sin verde', () => {
  assert.deepEqual(def.colores, { peso: 'h', normal: 'f', jalón: 'o', rozamiento: 'i' });
  const todo = [];
  for (const i of def.ideas) {
    todo.push(i.lee, i.juega.leyenda, i.predice, i.mira.pasos, i.regla, i.ejemplos);
    for (const s of [0, 1, 2, 3, 4, 5, 6, 7]) todo.push(i.ahoraTu.generar(s), i.resuelve.generar(s));
    for (const v of Teoria.grilla(i.juega.controles).slice(0, 60)) todo.push(i.juega.lectura(v));
  }
  const fs = fichas(todo);
  assert.ok(fs.length > 500);
  for (const x of fs) {
    assert.notEqual(x.v, 'c-d', `verde en «${x.t}»`);
    if (x.m) assert.equal(x.v, `c-${def.colores[x.m]}`, `«${x.t}» es ${x.m} y va en ${x.v}`);
  }
  // E_C y E_M en tinta: ninguna ficha de color las escribe
  for (const x of fs) assert.ok(!/^E$/.test(x.t) || ['c-h', 'c-o'].includes(x.v), 'E_PG en carmín y E_PE en naranja; E_C y E_M sin ficha de color');
  // en las figuras: la flecha del peso carmín, la normal violeta, la mano o la cuerda naranja, el rozamiento turquesa
  const color = { m: 'h', N: 'f', F: 'o', f: 'i' };
  for (const i of def.ideas) for (const fg of figurasDe(i)) for (const fl of fg.datos.flechas || []) {
    const l = String(fl.texto || '').replace(/[⃗\s]/g, '')[0];
    if (/^(mg|N|F|f)\b|^(mg|N|F|f)[ =⃗_]/.test(String(fl.texto || '')) && color[l]) assert.equal(fl.color, color[l], `${i.id}: «${fl.texto}» en ${fl.color}`);
  }
});

// ---------- Los 90 ejemplos, contra la tabla calculada aparte ----------
const ESPERADO = [
  [120, 240, 0, -60, 6, 60, 50, 60, -300, -120, 140, 20, 18000, 100, 'VVF'],
  [100000, 80, 50, 6, 50, 6, 25, 3000, 40, 10, 0.2, 72, 40, 7, 4],
  [30, -4, 10, 1, 24000, 4500, -300, 600, 4, 0.2, 15, 4.5, 40, -200, 2.5],
  [4, 3.2, 116, 50, 8, 20, 5, 3, 8, 0.2, 15, 0.2, 5, 8, 2],
  [30, 450, -120, 1.5, 37500, 6, 6, 3, 3.2, -360, 6.56, 0.6, 0.3, 8, 3.2],
  [36000, 1000, 800, 75, 600, 300, 30000, 500, 30, 300, 2.5, 125, 2000, 800, 'VVF'],
];
const LETRAS_EXAMEN = ['BDEAC', 'CEABD', 'DABCE', 'EBCDA', 'ACDEB', 'BEACD'];
test('los 90 ejemplos dan lo calculado aparte; en los de examen, la letra es la de su valor y A–E se reparten', () => {
  const cuenta = {};
  def.ideas.forEach((i, k) => {
    assert.equal(i.ejemplos.length, 15, i.id);
    i.ejemplos.forEach((e, j) => {
      const resp = plano(e.respuesta), esp = ESPERADO[k][j];
      if (typeof esp === 'number') assert.ok(nums(resp).some(x => cerca(x, esp)), `${i.id} ejemplo ${j + 1}: «${resp}» no da ${esp}`);
      else assert.ok(resp.includes(esp), `${i.id} ejemplo ${j + 1}: «${resp}»`);
      if (e.nivel === 3) {
        const letra = (resp.match(/^([A-E])\b/) || [])[1];
        assert.equal(letra, LETRAS_EXAMEN[k][j - 10], `${i.id} ejemplo ${j + 1}: letra`);
        cuenta[letra] = (cuenta[letra] || 0) + 1;
        const alt = e.alternativas['ABCDE'.indexOf(letra)];
        if (typeof esp === 'number') assert.ok(nums(alt).some(x => cerca(x, esp) || cerca(x, Math.abs(esp))), `${i.id} ejemplo ${j + 1}: la alternativa ${letra} («${alt}») no es ${esp}`);
        else assert.equal(alt, esp);
        assert.equal(new Set(e.alternativas).size, 5, `${i.id} ejemplo ${j + 1}: alternativas repetidas`);
      }
    });
  });
  assert.deepEqual(cuenta, { A: 6, B: 6, C: 6, D: 6, E: 6 });
});

// ---------- «Ahora tú»: el valor correcto, calculado aparte ----------
const sube = (H, D) => Math.hypot(H, D) - H;
// área bajo una gráfica F–x por trapecios (los null cortan un salto)
function area(puntos) { let W = 0; for (let k = 1; k < puntos.length; k++) { const a = puntos[k - 1], b = puntos[k]; if (a && b) W += (b[0] - a[0]) * (a[1] + b[1]) / 2; } return W; }
// rapidez al pie de una rampa de 37° con rozamiento, integrando a lo largo de la rampa
function rampa37(h, mu) { const L = h / 0.6, a = G * 0.6 - mu * G * 0.8; let v = 0, x = 0; const dt = 1e-5; while (x < L) { v += a * dt; x += v * dt; } return v; }
const CALC = [
  (t, c) => { const n = nums(t);
    if (/collarín/.test(t)) return n[1] * sube(n[0], n[2]);
    if (/μ/.test(t)) { const [m, d, F, ang, mu] = n, s = ang === 37 ? 0.6 : 0.8; return -mu * (m * G - F * s) * d; }
    if (/hace un trabajo de/.test(t)) { const [ang, d, Wv] = n; return Wv / (d * M.notable(ang).cos); }
    if (/sobre la horizontal/.test(t)) { const [ang, F, d] = n; return M.trabajos({ m: 1, d, F: F * M.notable(ang).cos, mu: 0 }).WF; }
    return /ascensor/.test(t) ? 'Negativo' : /normal/.test(t) ? 'Cero' : /tobogán/.test(t) ? 'Positivo' : /rozamiento/.test(t) ? 'Negativo' : /gira/.test(t) ? 'Cero' : 'Positivo'; },
  (t, c) => { const n = nums(t);
    if (/gráfica/.test(t)) { const W = area(c.dibujo.datos.curvas[0].puntos); return Math.sqrt(2 * W / n[0]); }
    if (/pasa de/.test(t)) return M.energias({ m: n[0], v: n[2] }).Ec - M.energias({ m: n[0], v: n[1] }).Ec;
    if (/Empujas/.test(t)) return Math.sqrt(2 * n[1] * n[2] / n[0]);
    if (/desliza a/.test(t)) return n[1] * n[1] / (2 * n[2] * G);
    const [m, d, tt] = n, a = 2 * d / (tt * tt); return M.energias({ m, v: a * tt }).Ec; },
  (t, c) => { const n = nums(t);
    if (/techo/.test(t)) return n[0] * G * (n[1] - 3);
    if (/mesa de/.test(t)) return n[0] * G * (n[1] - n[2]);
    if (/se comprime/.test(t)) return M.trabajoResorte(n[0], 0, n[1] / 100);
    if (/rampa/.test(t)) return (/ baja /.test(t) ? 1 : -1) * n[0] * G * n[2];
    if (/se estira/.test(t)) return M.trabajoResorte(n[0] / (n[1] / 100), 0, n[1] / 100);
    const [k, L0, L1, L2] = n; return M.trabajoResorte(k, (L1 - L0) / 100, (L2 - L0) / 100); },
  (t, c) => { const n = nums(t);
    if (/más abajo/.test(t)) return M.rapidez(n[1], 0, n[0], G);
    if (/Lanzas/.test(t)) return n[0] * n[0] / (2 * G);
    if (/llega a un resorte/.test(t)) return n[1] * Math.sqrt(n[0] / n[2]);
    if (/Cuelgas/.test(t)) return 2 * n[0] * G / n[1];
    return M.rapidez(n[0], 0, 0, G); },
  (t, c) => { const n = nums(t);
    if (/calor/.test(t)) return n[0] * G * n[1] - n[2];
    if (/bote/.test(t)) { const veces = /primer/.test(t) ? 1 : /segundo/.test(t) ? 2 : 3; return n[0] * (1 - n[1] / 100) ** veces; }
    if (/tramos/.test(t)) { const [v0, d1, mu1, d2] = n; return (v0 * v0 / (2 * G) - mu1 * d1) / d2; }
    if (/hacia arriba/.test(t)) { const [v0, , mu] = n; return v0 * v0 / (2 * G * (1 + mu * 0.8 / 0.6)); }
    return rampa37(n[1], n[2]); },
  (t, c) => { const n = nums(t);
    if (/eficiencia del/.test(t)) return n[1] / (n[0] / 100);
    if (/km\/h/.test(t)) return n[1] * n[0] / 3.6;
    if (/tractor/.test(t)) { const [m, Pk, , mu] = n; return Pk * 1000 / (m * G * (0.6 + mu * 0.8)); }
    if (/litros/.test(t)) return n[0] / 60 * G * n[1];
    if (/auto/.test(t)) return n[1] / 100 * n[0] * 1000 / n[2];
    const [m, h, tt] = n; return M.potencia({ m, h, t: /minuto/.test(t) ? 60 * tt : tt }).Putil; },
];
test('«Ahora tú» en 400 semillas por idea: cuatro opciones distintas, una sola correcta, con el valor calculado aparte', () => {
  def.ideas.forEach((i, k) => {
    for (let s = 0; s < 400; s++) {
      const c = i.ahoraTu.generar(s), t = plano(c.pregunta), ops = c.opciones;
      assert.equal(ops.length, 4, `${i.id} semilla ${s}: ${ops.length} opciones («${t}»)`);
      assert.equal(new Set(ops.map(o => o.texto)).size, 4, `${i.id} semilla ${s}: opciones repetidas`);
      assert.equal(ops.filter(o => o.correcta).length, 1);
      assert.ok(!ops.repiteCorrecta, `${i.id} semilla ${s}: un error da la correcta`);
      for (const o of ops.filter(x => !x.correcta)) assert.ok(o.error && o.siFuera, `${i.id} semilla ${s}`);
      const bien = ops.find(o => o.correcta).texto, esp = CALC[k](t, c);
      if (typeof esp === 'string') assert.equal(bien, esp, `${i.id} semilla ${s}: «${t}»`);
      else assert.ok(cerca(nums(bien)[0], esp, 0.006), `${i.id} semilla ${s}: «${t}» → «${bien}», calculado ${esp}`);
    }
  });
});

test('lleva calidad 2 y sus reglas no encuentran nada en 400 semillas', () => {
  assert.equal(def.calidad, 2, 'cerrada el 20 nov tras el lector en frío y el auditor');
  const p = Teoria.problemas(Object.assign({}, def, { calidad: 2 }), { semillas: 400 });
  assert.deepEqual(p, [], p.join('\n'));
});

test('cada misión se cumple con un solo caso de la grilla (sin contar el avance) y no al abrir', () => {
  for (const i of def.ideas) {
    const ctl = i.juega.controles.filter(c => c.id !== 'u'), g = Teoria.grilla(ctl);
    const ini = Object.fromEntries(i.juega.controles.map(c => [c.id, c.inicio]));
    assert.ok(!i.juega.mision.logrado(ini), `${i.id}: cumplida al abrir`);
    assert.equal(g.filter(v => i.juega.mision.logrado(Object.assign({ u: 0 }, v))).length, 1, `${i.id}: más de un caso`);
  }
});

test('ningún subíndice escrito con «_» en el texto que la app muestra tal cual', () => {
  const malos = [];
  const mira = (x, donde) => {
    if (x === null || x === undefined) return;
    if (typeof x === 'string') { if (/[A-Za-zμ]_[a-zA-Z0-9]/.test(x)) malos.push(`${donde}: ${x}`); return; }
    if (Array.isArray(x)) { x.forEach(y => mira(y, donde)); return; }
    if (typeof x === 'object' && !x.v && !x.sub) for (const [k, v] of Object.entries(x)) if (!['figura', 'dibujo', 'revelar', 'datos', 'error', 'id'].includes(k) || k === 'datos' && Array.isArray(v)) mira(v, donde);
  };
  for (const i of def.ideas) {
    mira([i.aprendizaje, i.actividad, i.pregunta, i.lee.tarjetas.map(t => [t.titulo, t.texto]), i.juega.consigna, i.juega.voz, i.juega.mision, i.predice.pregunta, i.predice.datos,
      i.predice.opciones, i.mira.pasos.map(p => p.texto), i.regla.texto, i.regla.condicion, i.regla.voz], i.id);
    i.ejemplos.forEach((e, j) => mira([e.enunciado, e.datos, e.solucion, e.respuesta, e.alternativas], `${i.id} ej ${j + 1}`));
    for (let s = 0; s < 40; s++) { const c = i.ahoraTu.generar(s); mira([c.pregunta, c.datos, c.opciones.map(o => [o.texto, o.siFuera]), c.solucion.texto], `${i.id} at ${s}`);
      const r = i.resuelve.generar(s); mira([r.enunciado, r.datos, r.pasos.map(p => p.texto), r.respuesta], `${i.id} rs ${s}`); }
  }
  for (const m of def.laboratorio) mira([m.consigna, m.controles.map(c => c.etiqueta), m.invitaciones.map(x => [x.texto, x.bien])], m.id);
  assert.deepEqual(malos, []);
});

const pisa = (a, b) => a.x0 < b.x1 - 0.5 && b.x0 < a.x1 - 0.5 && a.y0 < b.y1 - 0.5 && b.y0 < a.y1 - 0.5;
test('todas las figuras caben con 4 de margen y ningún rótulo pisa a otro', () => {
  const figs = [...def.ideas.flatMap(figurasDe), ...def.laboratorio.flatMap(m => Teoria.grilla(m.controles).slice(0, 60).map(v => m.dibujo(v)))];
  assert.ok(figs.length > 300);
  for (const fg of figs) {
    const g = P.geometria(fg.datos, fg.estado || {}), s = P.dibujar(fg.datos, fg.estado || {}), nom = P.alt(fg.datos, fg.estado || {});
    assert.ok(!/NaN|undefined|Infinity/.test(s), `${nom}: NaN en el SVG`);
    for (const r of g.rotulos) assert.ok(r.x0 >= 4 - 1e-9 && r.x1 <= 316 + 1e-9 && r.y0 >= 4 - 1e-9 && r.y1 <= g.H - 4 + 1e-9, `${nom}: «${r.texto}» se sale`);
    for (let a = 0; a < g.rotulos.length; a++) for (let b = a + 1; b < g.rotulos.length; b++) assert.ok(!pisa(g.rotulos[a], g.rotulos[b]), `${nom}: «${g.rotulos[a].texto}» pisa «${g.rotulos[b].texto}»`);
  }
});

test('«Ahora tú» y «Así se resuelve» no repiten la misión, la predicción ni un ejemplo', () => {
  const prohibidos = [
    [/a 37° sobre la horizontal, con 40 N, mientras avanza 5 m/, /37° del piso arrastra .* de 10 m y hace un trabajo de 400 J/, /con 50 N, a 37°.*avanza 6 m/],
    [/de 20 kg pasa de 0/, /de 4 kg pasa de 0 m\/s a 5/],
    [/está a 1,5 m del piso.*mesa de 0,8|libro/],
    [/de 1,8 m de alto/, /a 8 m\/s\. Sin aire/, /de 4 m de alto/],
    [/de 2 kg baja desde 4 m.*30 J/, /desde 5 m y en cada bote pierde el 20 % .*segundo/],
    [/sube 50 kg a 10 m/, /entrega 500 W/],
  ];
  def.ideas.forEach((i, k) => { for (let s = 0; s < 400; s++) for (const m of ['ahoraTu', 'resuelve']) {
    const c = i[m].generar(s), t = plano(c.pregunta || c.enunciado);
    for (const re of prohibidos[k]) assert.ok(!re.test(t), `${i.id} ${m} semilla ${s}: «${t}»`);
  } });
});

test('avance: predicciones viejas sin huella borradas una vez; «Ya la estudié» a quien terminó las cinco de antes', () => {
  const A = require('../../../nucleo/avance.js'), U = 'fisica.trabajo-y-energia';
  const est = { avanceV: 1, vistas: { [U]: '2026-11-12' }, teoria: { [U]: { ideas: {
    'trabajo-y-angulo': { hecha: true, prediccion: 'c' }, 'trabajo-energia-cinetica': { hecha: true, prediccion: 'doble', prediccionDe: 'h1' },
    'energia-potencial': { hecha: true, prediccion: 'c' }, 'conservacion-energia': { hecha: true, prediccion: 'larga' }, 'potencia-y-eficiencia': { hecha: true, prediccion: 'c' } } } } };
  A.migrar(est);
  assert.equal(est.prediccionTE, 1); assert.equal(est.estudiadaTE, 1);
  assert.equal(est.teoria[U].ideas['trabajo-y-angulo'].prediccion, undefined, 'otra Predice: se vuelve a preguntar');
  assert.equal(est.teoria[U].ideas['trabajo-y-angulo'].hecha, true, 'la idea sigue hecha');
  assert.equal(est.teoria[U].ideas['trabajo-energia-cinetica'].prediccion, 'doble', 'con huella: la revisa la app');
  assert.equal(est.marcadas[U], '2026-11-12', 'terminó las cinco de antes: conserva «Ya la estudié»');
  assert.equal(A.migrar(est), false, 'una sola vez');
  const nuevo = { avanceV: 1, teoria: { [U]: { ideas: { 'trabajo-y-angulo': { hecha: true } } } } };
  A.migrar(nuevo);
  assert.ok(!(nuevo.marcadas || {})[U], 'sin terminar las de antes no gana «Ya la estudié»');
});

// ---------- Auditoría y lectores en frío (20 nov, rutinas/auditoria/fisica.trabajo-y-energia.md) ----------
const ejemplo = (i, j) => def.ideas[i - 1].ejemplos[j - 1];
const casos = (idea, n = 400) => { const out = []; for (let s = 0; s < n; s++) for (const m of ['ahoraTu', 'resuelve']) out.push(Object.assign({ m, s }, idea[m].generar(s))); return out; };

test('auditoría A1: todo ejercicio que usa el peso trae g = 10 m/s²; la cuesta trae la parte del peso a lo largo', () => {
  const revisa = (datos, quien) => { const t = (datos || []).map(plano); if (t.some(l => /m · g|peso/.test(l))) assert.ok(t.some(l => /g = 10 m\/s²/.test(l)), `${quien}: sin g en Datos`); };
  def.ideas.forEach((i, k) => { i.ejemplos.forEach((e, j) => revisa(e.datos, `${k + 1}.${j + 1}`)); for (const c of casos(i)) revisa(c.datos, `${i.id} ${c.m} ${c.s}`); });
  for (const [i, j] of [[4, 3], [4, 8], [4, 14], [5, 8], [5, 12], [5, 14], [5, 15], [6, 8], [6, 14]]) assert.ok(ejemplo(i, j).datos.map(plano).some(l => /g = 10 m\/s²/.test(l)), `${i}.${j}`);
  const cuesta = d => d.map(plano).some(l => /m · g · sen θ rampa abajo/.test(l)) && d.map(plano).some(l => /fuerza neta es cero/.test(l));
  assert.ok(cuesta(ejemplo(6, 11).datos) && cuesta(ejemplo(6, 14).datos), 'el tractor y el motor de la rampa');
  for (let s = 0; s < 400; s++) { const c = def.ideas[5].ahoraTu.generar(s); if (/cuesta/.test(plano(c.pregunta))) assert.ok(cuesta(c.datos), `tractor ${s}`); }
});

test('auditoría M1: el μ_k que se lee es el que da la respuesta (sin 0,375 escrito 0,38)', () => {
  let vistos = 0;
  for (let s = 0; s < 400; s++) {
    const c = def.ideas[4].ahoraTu.generar(s), t = plano(c.pregunta), m = t.match(/Lanzas una caja a (\d+) m\/s .*μ_?k = (\d+(?:,\d+)?)/);
    if (!m) continue;
    vistos++;
    const v0 = Number(m[1]), mu = Number(m[2].replace(',', '.')), h = v0 * v0 / (2 * G * (1 + mu * 0.8 / 0.6));
    assert.ok(cerca(nums(c.opciones.find(o => o.correcta).texto)[0], h, 0.001), `semilla ${s}: ${t}`);
  }
  assert.ok(vistos > 30, `casos de la rampa áspera: ${vistos}`);
});

test('auditoría M2: cada alternativa de examen da el valor del error que nombra su resuelto', () => {
  assert.equal(ejemplo(5, 13).alternativas[0], '0,5', '5.13 A: μ_k · 8 · 3 = 12 (la altura en vez del largo)');
  assert.equal(ejemplo(6, 14).alternativas[1], '1200 W', '6.14 B: (500 + 100) · 2, el peso entero');
});

test('auditoría M3: los botes no se dibujan a escala cuando su altura se pide', () => {
  for (const [i, j] of [[5, 4], [5, 9]]) { const fg = ejemplo(i, j).figura.datos; assert.equal((fg.lineas || []).length, 1, `${i}.${j}: solo la altura dada`); }
});

test('auditoría M4: «Así se resuelve» no repite «Ahora tú» ni un ejemplo', () => {
  const at = new Set(), rs = [];
  for (let s = 0; s < 400; s++) { at.add(plano(def.ideas[3].ahoraTu.generar(s).pregunta).match(/de (\d+(?:,\d+)?) m de alto/)?.[1]); rs.push(plano(def.ideas[3].resuelve.generar(s).enunciado).match(/de (\d+(?:,\d+)?) m de alto/)?.[1]); }
  for (const h of rs.filter(Boolean)) assert.ok(!at.has(h), `conservación: la rampa de ${h} m está en «Ahora tú»`);
  for (let s = 0; s < 400; s++) assert.ok(!/de 0,4 kg pasa de 5 m\/s a 15 m\/s/.test(plano(def.ideas[1].ahoraTu.generar(s).pregunta)), `semilla ${s}: el ejemplo 2.13`);
});

test('lector en frío: niveles sin «1.er piso» ambiguo, cada h = 0 con su nombre, el coseno en una sola forma y la convención dicha', () => {
  const i3 = def.ideas[2], txt = x => JSON.stringify(x);
  assert.ok(!/1\.er piso|3\.er piso/.test(txt([i3.juega.controles, i3.predice, i3.lee])), 'el balcón se nombra por su altura');
  const refs = i3.predice.dibujo.datos.textos.map(t => t.texto).filter(t => /h = 0/.test(t));
  assert.deepEqual(refs.sort(), ['h = 0: azotea', 'h = 0: vereda']);
  assert.ok(!/3\/5|4\/5|1\/2 \(/.test(txt(def.ideas.map(i => [i.ejemplos.map(e => e.datos), casos(i, 8).map(c => c.datos)]))), 'cos en decimales, como en Juega');
  assert.ok(def.ideas[4].mira.pasos[0].texto.includes('convención del examen'), 'Mira 5: el 0,8 es cos 37°');
  assert.ok(/coeficiente/.test(def.ideas[4].predice.datos.join(' ')), 'las dos rampas: el mismo μ_k, dicho');
  assert.ok(/sin rozamiento|No hay rozamiento/i.test(def.ideas[3].predice.pregunta + def.ideas[3].predice.datos.join(' ')), 'los toboganes: sin rozamiento');
  for (const i of [def.ideas[3], def.ideas[4], def.ideas[5]]) assert.ok(!i.juega.controles.some(c => c.etiqueta === 'Avance'), `${i.id}: el avance dice qué es`);
  const j4 = Teoria.plano(def.ideas[3].juega.lectura({ h: 3.2, u: 0.17 }));
  assert.ok(/796,8 J \+ 163,2 J = 960 J/.test(j4.replace(/⁠/g, '')), `el dibujo y la lectura usan el avance que se ve: ${j4}`);
  const col = def.ideas[3].lee.tarjetas[0].dibujo.datos.textos.map(t => t.texto);
  assert.ok(col.includes('aquí, a 2,4 m') && !col.some(t => /^h = /.test(t)), 'la columna dice la altura de ahora');
});
