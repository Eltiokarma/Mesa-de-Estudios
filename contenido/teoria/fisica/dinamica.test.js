// Pruebas propias de «Dinámica» (además del validador común de contenido/teoria/teoria.test.js). La unidad se rehizo el
// 19 nov 2026 (etapa 7, docs/etapa7/propuesta-fisica.md); con calidad: 2 desde el cierre (lector en frío y auditor);
// la prueba corre además las reglas de calidad 2 en 400 semillas.
//   - la forma: seis ideas en el orden de la propuesta, los ids publicados, las tres mesas con sus controles;
//   - un color fijo por clase de fuerza (peso carmín, normal violeta, tensión y mano naranja, rozamiento turquesa), sin verde;
//   - los 90 ejemplos contra los valores calculados aparte, a mano (la tabla ESPERADO); en los de examen, la letra de la
//     respuesta es la de su valor y A–E salen 6 veces cada una;
//   - «Ahora tú» en 400 semillas por idea: 4 opciones distintas, una sola correcta, ningún error que dé la correcta, y su
//     valor es el que da el motor de la escena `dinamica` (plantillas/dinamica/motor.js) con los números que se leen en la
//     pregunta, o un paso a paso del movimiento (no las fórmulas despejadas de la unidad);
//   - las reglas de calidad 2 (igualdades, letras, glosario, leyenda…) en 400 semillas;
//   - todas las figuras caben con 4 de margen y ningún rótulo pisa a otro.
const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
require('../../../nucleo/kit/kit.js');
const Teoria = require('../../../nucleo/teoria.js');
const E = require('../../../nucleo/ecuacion.js');
const def = require('./dinamica.js');
for (const r of def.requiere) require(path.join(__dirname, '..', '..', '..', r));
const P = require('../../../nucleo/kit/piezas/fis-estatica.js');
const M = require('../../../plantillas/dinamica/motor.js');
const plano = x => E.texto(x === undefined || x === null ? '' : x).replace(/⁠/g, '');
const nums = s => (String(s).match(/\d{1,3}(?:[   ]\d{3})+(?:,\d+)?|\d+(?:,\d+)?/g) || []).map(x => Number(x.replace(/[   ]/g, '').replace(',', '.')));
const cerca = (a, b, tol = 0.006) => Math.abs(a - b) <= tol * Math.max(1, Math.abs(b));
const G = 10;

// ---------- La forma ----------
test('seis ideas en el orden de la propuesta; los ids publicados se conservan; tres mesas', () => {
  assert.equal(def.unidad, 'fisica.dinamica');
  assert.deepEqual(def.ideas.map(i => i.id), ['fuerza-neta-acelera', 'masa-y-peso', 'rozamiento-en-movimiento', 'plano-y-polea', 'ascensor-y-marcos', 'centripeta-es-resultante']);
  assert.deepEqual(def.laboratorio.map(m => m.id), ['bloque-libre', 'ascensor-libre', 'loma']);
  assert.deepEqual(def.laboratorio[0].controles.map(c => c.id), ['F', 'm', 'mu', 't']);
  assert.deepEqual(def.laboratorio[1].controles.map(c => c.id), ['a', 't']);
  assert.deepEqual(def.laboratorio[2].controles.map(c => c.id), ['v']);
  for (const i of def.ideas) {
    for (const k of ['aprendizaje', 'actividad', 'pregunta', 'lee', 'resuelve']) assert.ok(i[k], `${i.id}: ${k}`);
    assert.ok(i.juega.mision && i.juega.leyenda && i.juega.resumen, i.id);
    assert.deepEqual(Teoria.momentosDe(i), ['lee', 'juega', 'predice', 'mira', 'regla', 'resuelve', 'ahora-tu']);
    // los campos que la app escribe como texto plano son cadenas (auditoría de Estática, A1)
    for (const t of [i.regla.texto, i.regla.condicion, i.juega.mision.texto, i.titulo, i.pregunta, i.actividad]) assert.equal(typeof t, 'string', i.id);
    assert.match(i.regla.condicion, /^[a-záéíóúñμ]/, `${i.id}: «Vale si» en minúscula`);
  }
});

// ---------- Colores ----------
const fichas = x => (x === null || x === undefined || typeof x !== 'object' ? [] : Array.isArray(x) ? x.flatMap(fichas)
  : typeof x.v === 'string' && /^c-/.test(x.v) ? [x] : Object.values(x).flatMap(fichas));
test('un color fijo por clase de fuerza, el de Estática, y sin verde', () => {
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
  // en las figuras: el peso en carmín, la normal en violeta, la tensión y la mano en naranja, el rozamiento en turquesa
  const color = { P: 'h', N: 'f', T: 'o', F: 'o', f: 'i' };
  for (const i of def.ideas) for (const fg of figurasDe(i)) for (const fl of fg.datos.flechas || []) {
    const l = String(fl.texto || '').replace(/[⃗\s]/g, '')[0];
    if (/^[PNTFf]/.test(l) && !/^ΣF|^Σ/.test(String(fl.texto))) assert.equal(fl.color, color[l], `${i.id}: «${fl.texto}» en ${fl.color}`);
  }
});

// ---------- Los 90 ejemplos, contra la tabla calculada aparte ----------
// Calculados a mano, con el DCL de cada caso, antes de escribir la unidad (scratchpad e7-fisica/cuentas.js los rehace).
const ESPERADO = [
  [3, 50, 30, 0, 2, 4, 6, 16, 2400, 10, 10, 'caja 4', 20, 10, 800],
  [500, 70, 112, 3, 74, 19.2, 2, 100, 2, 9, 0.9, 'FVV', 2, 900, 60],
  [60, 2, 100, 3, 0.2, 2, 6, 70, 6, 2, 5, 6, 'adelante', 0.2, 0.75],
  [2.5, 12, 5, 15, 0, 16, 24, 20, 2.5, 5, 24, 2, 48, 2, 30],
  [600, 720, 600, 400, 0, 910, 1, 2100, 70, 72, 'Sube frenando', 840, 960, 26, 'hacia abajo'],
  [2000, 'rozamiento', 3.6, 7500, 8000, 540, 20, 0.2, 2400, 12, 2000, 1.25, 5, 10, 5],
];
const LETRAS_EXAMEN = ['BDEAC', 'CEABD', 'DABCE', 'EBCDA', 'ACDEB', 'BEACD'];
test('los 90 ejemplos dan lo calculado aparte; en los de examen, la letra es la de su valor y A–E se reparten', () => {
  const cuenta = {};
  def.ideas.forEach((i, k) => {
    assert.equal(i.ejemplos.length, 15, i.id);
    i.ejemplos.forEach((e, j) => {
      const resp = plano(e.respuesta), esp = ESPERADO[k][j];
      if (typeof esp === 'number') assert.ok(nums(resp).some(x => cerca(x, esp)), `${i.id} ejemplo ${j + 1}: «${resp}» no da ${esp}`);
      if (e.nivel === 3) {
        const letra = (resp.match(/^([A-E])\b/) || [])[1];
        assert.equal(letra, LETRAS_EXAMEN[k][j - 10], `${i.id} ejemplo ${j + 1}: letra`);
        cuenta[letra] = (cuenta[letra] || 0) + 1;
        const alt = e.alternativas['ABCDE'.indexOf(letra)];
        if (typeof esp === 'number') assert.ok(nums(alt).some(x => cerca(x, esp)), `${i.id} ejemplo ${j + 1}: la alternativa ${letra} («${alt}») no es ${esp}`);
        else assert.ok(alt.includes(esp) || resp.includes(esp), `${i.id} ejemplo ${j + 1}: «${alt}» y ${esp}`);
        assert.equal(new Set(e.alternativas).size, 5, `${i.id} ejemplo ${j + 1}: alternativas repetidas`);
      } else if (typeof esp === 'string') assert.ok(resp.includes(esp) || plano(e.solucion.map(s => s.texto)).includes(esp), `${i.id} ejemplo ${j + 1}: ${esp}`);
    });
  });
  assert.deepEqual(cuenta, { A: 6, B: 6, C: 6, D: 6, E: 6 });
});

// ---------- «Ahora tú»: el valor correcto, por el motor de la escena o paso a paso ----------
// Frenada paso a paso (sin v² = 2ad): desde v0, con aceleración a < 0, hasta que v llega a 0.
const frenada = (v0, a) => { let v = v0, x = 0; const dt = 1e-5; while (v > 0) { x += v * dt + a * dt * dt / 2; v += a * dt; } return x; };
const raiz = (fn, lo, hi) => { for (let k = 0; k < 200; k++) { const m = (lo + hi) / 2; if (fn(m)) hi = m; else lo = m; } return (lo + hi) / 2; };
const G_DE = t => (/Luna/.test(t) ? 1.6 : /Marte/.test(t) ? 3.7 : 10);
const CALC = [
  t => { const n = nums(t);
    if (/tu amigo/.test(t)) return M.resultante([{ F: n[1], angulo: 0 }, { F: n[2], angulo: 180 }], n[0]).a;
    if (/hace falta/.test(t)) return M.resultante([{ F: n[0] * n[1], angulo: 0 }]).x; // la fuerza que da esa a: m · a
    if (/acelera juntos/.test(t)) return raiz(m2 => M.resultante([{ F: n[0], angulo: 0 }], n[2] + m2).a < n[1], 0, 1e3);
    if (/recorrer/.test(t)) return raiz(Fv => M.empujon({ m: n[0], F: Fv, dur: n[2], muk: 0 }).x(n[2]) > n[1], 0, 1e5);
    if (/durante/.test(t)) return M.empujon({ m: n[0], F: n[1], dur: n[2], muk: 0 }).v(n[2]);
    return /pelota/.test(t) ? 'abajo' : /combi/.test(t) ? 'sur' : /trineo/.test(t) ? 'izquierda' : 'No tiene'; },
  t => { const n = nums(t);
    if (/en la Tierra\. ¿Cuánto pesa/.test(t)) return n[0] / G * G_DE(t.split('¿')[1]);
    if (/balanza de resorte marca/.test(t)) return n[0] / G_DE(t);
    if (/empuja de lado/.test(t)) return M.piso({ m: n[0], F: n[1], g: G_DE(t), mus: 0, muk: 0 }).a;
    if (/levantas/.test(t)) return M.ascensor({ m: n[0], g: 1.6 }) && (n[1] - n[0] * 1.6) / n[0];
    const m = n[0], I = /masa es menor/.test(t) ? 'F' : 'V', II = cerca(n[n.length - 1], m * 1.6) ? 'V' : 'F';
    return `${I}${II}V`; },
  t => { const n = nums(t), mu = n.find(x => x < 1 && x > 0);
    if (/misma rapidez/.test(t)) return M.piso({ m: n[0], F: 0, mus: mu, muk: mu, v0: 1 }).fk;
    if (/37° sobre/.test(t)) return M.piso({ m: n[0], F: n[1], angulo: 37, mus: mu, muk: mu, v0: 1 }).a;
    if (/ya desliza/.test(t)) return M.piso({ m: n[0], F: n[1], mus: mu, muk: mu, v0: 1 }).a;
    if (/sale deslizando/.test(t)) return frenada(n[1], M.piso({ m: n[0], F: 0, mus: mu, muk: mu, v0: n[1] }).a);
    if (/hacia arriba por una rampa/.test(t)) return frenada(n[1], -Math.abs(M.plano({ m: 1, angulo: 37, mus: mu, muk: mu, v0: -n[1] }).a));
    return M.plano({ m: 1, angulo: 37, mus: mu, muk: mu, v0: 1 }).a; },
  t => { const n = nums(t);
    if (/mesa lisa/.test(t)) { const r = M.mesaPolea({ m1: n[0], m2: n[1] }); return /aceleran/.test(t) ? r.a : r.T; }
    if (/carrito de/.test(t)) return M.tren({ masas: [n[1], n[2]], F: n[0], muk: 0 }).tensiones[0];
    if (/piso\?/.test(t)) { const a = M.atwood({ m1: n[0], m2: n[1] }).aModulo; let v = 0, x = 0; const dt = 1e-5; while (x < n[3]) { x += v * dt + a * dt * dt / 2; v += a * dt; } return v; }
    if (/Atwood/.test(t)) { const r = M.atwood({ m1: n[0], m2: n[1] }); return /aceleran/.test(t) ? r.aModulo : r.T; }
    const mu = n[1]; return M.mesaPolea({ m1: n[0], m2: n[2], mus: mu, muk: mu, v0: 1 }).T; },
  t => { const n = nums(t);
    if (/grúa/.test(t)) return M.ascensor({ m: n[0], a: n[1] }).N;
    if (/ué puede estar/.test(t)) { const a = n[0] / n[1] - G; return `${a > 0 ? 'Sube acelerando o baja frenando' : 'Sube frenando o baja acelerando'}, con ${Math.abs(a)}`.replace('.', ','); }
    const arriba = /sube y acelera|baja y frena/.test(t); return M.ascensor({ m: n[0], a: arriba ? n[1] : -n[1] }).N; },
  t => { const n = nums(t);
    if (/cima/.test(t)) return M.loma({ m: n[0], r: n[1], phi: 0, v: n[2] }).N;
    if (/hondonada/.test(t)) return M.vertical({ m: n[0], v: n[2], r: n[1], theta: 0 }).N;
    if (/distancia máxima/.test(t)) return raiz(r => M.curva({ m: 1, v: n[0] * r, r, mus: n[1] }).derrapa, 1e-6, 100);
    if (/menor μ|menor $/.test(t) || /menor\s*μ/.test(t) || /permite girar/.test(t)) return raiz(mu => !M.curva({ m: 1, v: n[0] * n[1], r: n[1], mus: mu }).derrapa, 0, 5);
    if (/menor rapidez/.test(t)) return M.vertical({ m: 1, v: 1, r: n[0], theta: 180 }).vMinArriba;
    return M.vertical({ m: n[0], v: n[2], r: n[1], theta: 180 }).N; },
];
test('«Ahora tú» en 400 semillas por idea: cuatro opciones, una sola correcta y su valor es el del motor', () => {
  def.ideas.forEach((i, k) => {
    for (let s = 0; s < 400; s++) {
      const c = i.ahoraTu.generar(s), t = plano(c.pregunta), ops = c.opciones;
      assert.equal(ops.length, 4, `${i.id} semilla ${s}: ${ops.length} opciones`);
      assert.equal(ops.filter(o => o.correcta).length, 1, `${i.id} semilla ${s}`);
      assert.equal(new Set(ops.map(o => o.texto)).size, 4, `${i.id} semilla ${s}: opciones repetidas`);
      assert.ok(!ops.repiteCorrecta, `${i.id} semilla ${s}: un error da la correcta (${ops.repiteCorrecta})`);
      for (const o of ops.filter(x => !x.correcta)) assert.ok(o.error && o.siFuera, `${i.id} semilla ${s}`);
      const bien = ops.find(o => o.correcta).texto, esp = CALC[k](t);
      if (typeof esp === 'number') assert.ok(nums(bien).some(x => cerca(x, esp)), `${i.id} semilla ${s}: «${bien}» contra ${esp} en «${t}»`);
      else assert.ok(bien.includes(esp), `${i.id} semilla ${s}: «${bien}» contra «${esp}»`);
    }
  });
});

// ---------- Reglas de calidad 2, en 400 semillas ----------
test('lleva calidad 2 y el validador no encuentra nada en 400 semillas', () => {
  assert.equal(def.calidad, 2, 'cerrada el 19 nov tras el lector en frío y el auditor');
  const cat = require('../../../catalogo/cursos/fisica.json'), u = cat.unidades.find(x => x.id === 'fisica.dinamica');
  const p = Teoria.problemas(Object.assign({}, def, { calidad: 2 }), { temas: u.temas, semillas: 400 });
  assert.deepEqual(p, [], p.join('\n'));
});

// ---------- Figuras ----------
function figurasDe(i) {
  const out = [], add = f => f && f.datos && out.push(f), j = i.juega, ini = Teoria.inicio(j);
  for (const v of Teoria.grilla(j.controles)) add(j.dibujo(v));
  add(j.dibujo(Object.assign({}, ini, j.resumen || {})));
  add(i.predice.dibujo); add(i.predice.revelar); add(i.regla.dibujo);
  (i.mira.datos.cortes || [null]).forEach((_, c) => add({ datos: i.mira.datos, estado: { corte: c, paso: 9 } }));
  for (const t of i.lee.tarjetas) add(t.dibujo);
  for (const e of i.ejemplos) add(e.figura);
  for (let s = 0; s < 24; s++) { add(i.ahoraTu.generar(s).dibujo); add(i.resuelve.generar(s).dibujo); }
  return out;
}
const pisa = (a, b) => a.x0 < b.x1 - 0.5 && b.x0 < a.x1 - 0.5 && a.y0 < b.y1 - 0.5 && b.y0 < a.y1 - 0.5;
test('todas las figuras caben con 4 de margen y ningún rótulo pisa a otro', () => {
  const figs = [...def.ideas.flatMap(figurasDe), ...def.laboratorio.flatMap(m => Teoria.grilla(m.controles).slice(0, 80).map(v => m.dibujo(v)))];
  assert.ok(figs.length > 300);
  for (const fg of figs) {
    const g = P.geometria(fg.datos, fg.estado || {}), s = P.dibujar(fg.datos, fg.estado || {}), nom = P.alt(fg.datos);
    assert.ok(!/NaN|undefined|Infinity/.test(s), `${nom}: NaN en el SVG`);
    for (const r of g.rotulos) assert.ok(r.x0 >= 4 - 1e-9 && r.x1 <= 316 + 1e-9 && r.y0 >= 4 - 1e-9 && r.y1 <= g.H - 4 + 1e-9, `${nom}: «${r.texto}» se sale`);
    for (let a = 0; a < g.rotulos.length; a++) for (let b = a + 1; b < g.rotulos.length; b++) assert.ok(!pisa(g.rotulos[a], g.rotulos[b]), `${nom}: «${g.rotulos[a].texto}» pisa «${g.rotulos[b].texto}»`);
  }
});

// ---------- Misiones (nota de la sesión, 19 nov: desde la Etapa 6, un solo caso de la grilla) ----------
test('cada misión se cumple con un solo caso de la grilla (sin contar el reloj t) y no al abrir', () => {
  for (const i of def.ideas) {
    const j = i.juega, ctr = j.controles.filter(c => c.id !== 't');
    const casos = new Set(Teoria.grilla(ctr).filter(v => j.mision.logrado(Object.assign({ t: 0 }, v))).map(v => JSON.stringify(v)));
    assert.equal(casos.size, 1, `${i.id}: ${casos.size} casos cumplen la misión`);
    assert.ok(!j.mision.logrado(Teoria.inicio(j)), `${i.id}: cumplida al abrir`);
  }
});

// ---------- Auditoría del 19 nov (rutinas/auditoria/fisica.dinamica.md) y lectores en frío (rutinas/frio/fisica.dinamica.md) ----------
const flechasDe = fg => (fg && fg.datos && fg.datos.flechas) || [];
const ejemplo = (k, j) => def.ideas[k].ejemplos[j - 1];
test('auditoría A1: en una curva vertical, cada fuerza del DCL apunta hacia donde actúa', () => {
  const de = (fg, color) => flechasDe(fg).filter(f => f.color === color && f.de[0] > 200).map(f => f.ang);
  // el columpio abajo: las cadenas jalan hacia arriba; el balde arriba: la cuerda jala hacia abajo; el carrito de cabeza
  // arriba del rizo: la pista empuja hacia abajo; con N = 0 no hay flecha de la normal
  for (const j of [6, 15]) assert.deepEqual(de(ejemplo(5, j).figura, 'o'), [90], `6.${j}: las cadenas`);
  assert.deepEqual(de(ejemplo(5, 10).figura, 'o'), [270], '6.10: la cuerda del balde');
  assert.deepEqual(de(ejemplo(5, 11).figura, 'f'), [270], '6.11: la pista arriba del rizo');
  for (const j of [7, 14]) assert.deepEqual(de(ejemplo(5, j).figura, 'f'), [], `6.${j}: N = 0 sin flecha`);
  for (let s = 0; s < 400; s++) {
    const r = def.ideas[5].resuelve.generar(s), t = def.ideas[5].ahoraTu.generar(s), tr = plano(r.enunciado), tt = plano(t.pregunta);
    if (/columpio/.test(tr)) assert.deepEqual(de(r.dibujo, 'o'), [90], `resuelve ${s}`);
    if (/rizo/.test(tt) && t.dibujo) assert.deepEqual(de(t.dibujo, 'f'), [270], `Ahora tú ${s}`);
  }
});
test('auditoría M1: «Ahora tú» y «Así se resuelve» no repiten un ejemplo ni la misión', () => {
  const VISTOS = [
    [0, /de 10 kg.*70 N.*30 N/], [1, /^En la Luna, una balanza de resorte marca 8 N/], [2, /baja deslizando.*= 0,5\./],
    [3, /de 6 kg está sobre una mesa lisa.*balde de [24] kg/], [3, /de 5 kg desliza sobre una mesa con μk = 0,2.*de 3 kg/],
    [4, /de 70 kg.*baja y frena con 3 m\/s²/], [4, /de 60 kg.*sube y acelera con 2 m\/s²/], [4, /marca 480 N bajo una persona de 60 kg/],
  ];
  for (let s = 0; s < 400; s++) for (const [k, re] of VISTOS) for (const m of ['ahoraTu', 'resuelve']) {
    const c = def.ideas[k][m].generar(s), t = plano(c.pregunta || c.enunciado);
    assert.ok(!re.test(t), `${def.ideas[k].id} ${m} semilla ${s}: «${t}»`);
  }
});
test('auditoría M2: si una figura de bloques dibuja alguna fuerza, dibuja todas las de cada cuerpo', () => {
  const figs = [def.ideas[3].predice.dibujo, def.ideas[3].regla.dibujo, ...def.ideas[3].ejemplos.map(e => e.figura)];
  for (let s = 0; s < 40; s++) figs.push(def.ideas[3].ahoraTu.generar(s).dibujo, def.ideas[3].resuelve.generar(s).dibujo);
  for (const fg of figs.filter(Boolean)) {
    const fl = flechasDe(fg).filter(f => f.color !== 'tinta');
    if (!fl.length) continue;
    const cols = fl.map(f => f.color).sort().join('');
    const atwood = fg.datos.techo !== undefined;
    // mesa: el costal con P, N y T (y f si hay rozamiento); el balde con T y P. Atwood: T y P en cada bloque.
    if (atwood) assert.equal(cols, 'hhoo', P.alt(fg.datos));
    else if (fl.some(f => f.color === 'i')) assert.equal(cols, 'fhhioo', P.alt(fg.datos));
    else if (fg.datos.objetos.some(o => o.tipo === 'balde')) assert.equal(cols, 'fhhoo', P.alt(fg.datos));
  }
});
test('auditoría M3: ningún subíndice escrito con «_» en el texto que la app muestra tal cual', () => {
  const malos = [];
  const mira = (x, donde) => { if (x === null || x === undefined) return; if (typeof x === 'string') { if (/[A-Za-zμ]_[a-z0-9]/.test(x)) malos.push(`${donde}: ${x}`); return; }
    if (typeof x !== 'object') return; if (Array.isArray(x)) return x.forEach(y => mira(y, donde));
    for (const [k, v] of Object.entries(x)) if (!['figura', 'dibujo', 'revelar', 'pieza'].includes(k) && !(k === 't' && x.v) && !(k === 'datos' && v && v.flechas)) mira(v, `${donde}.${k}`); };
  for (const i of def.ideas) {
    mira({ aprendizaje: i.aprendizaje, lee: i.lee, consigna: i.juega.consigna, predice: i.predice, mira: i.mira.pasos, regla: i.regla, ejemplos: i.ejemplos }, i.id);
    for (let s = 0; s < 40; s++) { mira(i.ahoraTu.generar(s), `${i.id} at ${s}`); mira(i.resuelve.generar(s), `${i.id} rs ${s}`); }
  }
  assert.deepEqual(malos, []);
});
test('auditoría M4: con la rapidez en marcha, la lectura de la loma dice la normal de la rapidez que muestra', () => {
  for (const [lectura, R] of [[def.ideas[5].juega.lectura, 20], [def.laboratorio[2].lectura, 10]]) for (let v = 0.01; v <= 10; v += 0.137) {
    const t = plano(lectura({ v })), [vv, Nv] = nums(t);
    if (/Quieto/.test(t)) continue;
    assert.ok(cerca(Nv, Math.max(0, 1000 * (G - vv * vv / R)), 1e-9), `«${t}»`);
  }
});
test('auditoría M5 y M6: los errores dicen su valor; nada se mueve más rápido de lo creíble', () => {
  const e = ejemplo(0, 14), s = plano(e.solucion.map(x => x.texto));
  assert.ok(e.alternativas[4].startsWith('50') && /5 · 10/.test(s), '1.14 E');
  assert.match(plano(ejemplo(3, 12).solucion.map(x => x.texto)), /velocidad media/, '4.12 C');
  assert.match(plano(ejemplo(5, 11).solucion.map(x => x.texto)), /cuadrado de v y, además, el peso/, '6.11 E');
  for (let k = 0; k < 400; k++) { const c = def.ideas[0].ahoraTu.generar(k), t = plano(c.pregunta);
    if (/durante/.test(t)) assert.ok(nums(c.opciones.find(o => o.correcta).texto)[0] <= 12, `semilla ${k}: «${t}»`); }
  assert.ok(nums(plano(ejemplo(0, 7).respuesta))[0] <= 12, '1.7');
});
test('auditoría M7: en la caja que va a velocidad constante, ninguna explicación dice que su velocidad cambia', () => {
  for (let s = 2; s < 400; s += 4) { const c = def.ideas[0].ahoraTu.generar(s);
    if (/velocidad constante/.test(plano(c.pregunta))) for (const o of c.opciones) assert.ok(!/velocidad cambia/.test(o.siFuera || ''), `semilla ${s}: ${o.siFuera}`); }
});
test('lector en frío: el texto dice lo que el dibujo muestra y lo previo no adelanta la respuesta', () => {
  // Así se resuelve de la idea 1: sin «dos amigos» que no se dibujan
  for (let s = 0; s < 40; s++) assert.ok(!/amigos|trineo/.test(plano(def.ideas[0].resuelve.generar(s).enunciado)), `semilla ${s}`);
  // Predice de masa y peso: los Datos no dicen cuánto acelera en la Tierra
  assert.ok(!/acelera/.test(plano(def.ideas[1].predice.datos)));
  // la barra «t» dice qué es en los juegos que la tienen
  for (const i of def.ideas) if (i.juega.controles.some(c => c.id === 't')) assert.ok(i.juega.leyenda.some(l => l.s === 't'), i.id);
  // 3.8 no dibuja un rozamiento que el problema no da
  assert.ok(!flechasDe(ejemplo(2, 8).figura).some(f => f.color === 'i'), '3.8');
  // «Ahora tú» de masa y peso trae su dibujo
  for (let s = 0; s < 400; s++) { const c = def.ideas[1].ahoraTu.generar(s); if (!/astronauta/.test(plano(c.pregunta))) assert.ok(c.dibujo, `semilla ${s}`); }
});
test('verificación 26 nov: si un texto dice que g da los newtons de cada kilogramo, no le pone m/s² a esa cuenta sin decir que 1 m/s² es 1 N/kg', () => {
  for (const i of def.ideas) for (const t of i.lee.tarjetas) {
    const x = plano(t.texto);
    if (/newtons pesa.*cada kilogramo/.test(x)) assert.match(x, /1 m\/s² es lo mismo que 1 N\/kg/, `${i.id} «${t.titulo}»: ${x}`);
  }
  // la D del astronauta (VVF) dice que I es verdadera: la masa baja
  const ast = def.ideas[1].ejemplos.find(e => /astronauta/.test(e.titulo));
  assert.match(plano(ast.solucion[ast.solucion.length - 1].texto), /D, si crees que la masa baja/);
});
