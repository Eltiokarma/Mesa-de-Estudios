// Pruebas propias de «Movimiento parabólico» (además del validador común de contenido/teoria/teoria.test.js). El 19 nov
// la unidad «Movimiento parabólico y circular» se partió en dos (docs/etapa5/propuesta-fisica.md) y sus cinco ideas se
// rehicieron contra el contrato (A1 en la fase 2; A2 a A5 en la fase 3). La unidad todavía no declara calidad: 2 (la
// marca la sesión después del lector en frío y el auditor), pero la última prueba la simula.
//   - la partición: esta unidad conserva el id y `un-reloj-dos-ejes`; el giro vive en fisica.movimiento-circular, y lo
//     que Avance.migrar manda allá existe allá; el catálogo, las plantillas y los requisitos lo dicen igual;
//   - A1 «Tiro horizontal: dos movimientos»: un color fijo por magnitud (los de MRU y MRUV), sin verde ni flechas de
//     vector; la misión se cumple solo con 10 m/s; nada de lo que se ve antes de predecir adelanta la respuesta;
//   - ninguna figura de un ejemplo delata la respuesta, y los rótulos y los objetos caben y no se pisan (fis-tiro);
//   - «Ahora tú», «Así se resuelve» y los 15 ejemplos cuadran con un cálculo aparte, que no usa el código de la unidad
//     ni las fórmulas: integra la caída paso a paso.
const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const Kit = require('../../../nucleo/kit/kit.js');
const Teoria = require('../../../nucleo/teoria.js');
const Glosario = require('../../../nucleo/glosario.js');
const Avance = require('../../../nucleo/avance.js');
const E = require('../../../nucleo/ecuacion.js');
const def = require('./movimiento-parabolico-y-circular.js');
const circular = require('./movimiento-circular.js');
for (const r of [...def.requiere, ...circular.requiere]) require(path.join(__dirname, '..', '..', '..', r));
const A1 = def.ideas.find(i => i.id === 'un-reloj-dos-ejes');
const limpio = x => (Array.isArray(x) ? x.filter(y => y !== undefined && y !== null).map(limpio) : x);
const plano = x => E.texto(x === undefined || x === null ? '' : limpio(x)).replace(/⁠/g, '');
const P = Kit.piezas['fis-tiro'];
const num = s => Number(String(s).replace(/\s/g, '').replace(',', '.').replace('−', '-'));
const numAlt = s => num(String(s).match(/[\d,]+/)[0]);   // el número de una alternativa («200 m», «0 m: justo encima…»)
const cerca = (a, b, que) => assert.ok(Math.abs(a - b) <= 2e-3 * Math.max(1, Math.abs(b)), `${que}: ${a} contra ${b}`);

// ---------- Cálculo aparte: la caída integrada paso a paso (sin h = ½·g·t² ni raíces) ----------
// Cae desde el reposo con g = 10 m/s². Devuelve cuánto ha caído al cabo de t, o cuánto tarda en caer h.
const DT = 1e-5;
function caidaEn(t) { let vy = 0, y = 0; const n = Math.round(t / DT); for (let i = 0; i < n; i++) { y += vy * DT + 5 * DT * DT; vy += 10 * DT; } return y; }
function tiempoDe(h) { let vy = 0, y = 0, t = 0; while (y < h) { const y1 = y + vy * DT + 5 * DT * DT; if (y1 >= h) return t + DT * (h - y) / (y1 - y); y = y1; vy += 10 * DT; t += DT; } return t; }

// ---------- La partición ----------
test('la unidad conserva su id con el movimiento parabólico; el giro vive en fisica.movimiento-circular', () => {
  assert.equal(def.unidad, 'fisica.movimiento-parabolico-y-circular');
  assert.equal(circular.unidad, 'fisica.movimiento-circular');
  assert.deepEqual(def.ideas.map(i => i.id), ['un-reloj-dos-ejes', 'velocidad-en-vuelo', 'tiro-oblicuo', 'altura-y-alcance', 'ecuaciones-en-el-plano']);
  assert.deepEqual(def.ideas.map(i => i.titulo), ['Tiro horizontal: dos movimientos', 'La velocidad en cada instante', 'Lanzar con ángulo', 'Altura máxima y alcance', 'Ecuaciones del movimiento en el plano']);
  assert.deepEqual(def.laboratorioIdeas, { 'dos-sombras-3d': ['tiro-oblicuo'], 'tiro-libre': ['altura-y-alcance'] });
  assert.deepEqual(def.laboratorio.map(m => m.id), ['dos-sombras-3d', 'tiro-libre']);
  assert.equal(def.calidad, 2, 'cerrada el 19 nov tras el lector en frío y el auditor');
  // Ninguna palabra se define en las dos; «altura máxima» sigue siendo de MRUV y caída libre.
  const aqui = new Set(def.glosario.map(g => Glosario.clave(g.termino)));
  for (const g of circular.glosario) assert.ok(!aqui.has(Glosario.clave(g.termino)), `«${g.termino}» en las dos unidades`);
  assert.ok(!aqui.has('altura maxima'));
});

test('lo que Avance.migrar manda a Movimiento circular existe allá, y lo que se queda existe aquí', () => {
  const V = def.unidad, N = circular.unidad;
  const est = { avanceV: 1, vistas: { [V]: '2026-11-15' },
    teoria: { [V]: { ideas: { 'un-reloj-dos-ejes': { hecha: true, prediccion: 'lanzada' }, 'arco-y-radian': { hecha: true }, 'rapidez-constante-acelera': { casos: 1 }, 'dos-aceleraciones': { prediccion: 'c' } } } },
    coleccion: ['dos-sombras-3d', 'tiro-libre', 'rueda', 'giro'].map((m, k) => ({ id: `c${k}`, unidad: V, mesa: m })),
    glosario: { [V]: Object.fromEntries([...def.glosario, ...circular.glosario].map(g => [Glosario.clave(g.termino), 'sabe'])) } };
  assert.equal(Avance.migrar(est), true);
  const ids = d => new Set(d.ideas.map(i => i.id)), mesas = d => new Set(d.laboratorio.map(m => m.id)), palabras = d => new Set(d.glosario.map(g => Glosario.clave(g.termino)));
  // Lo que llega a Movimiento circular lo comprueba la unidad B (otra sesión la está rehaciendo): aquí, lo que se queda.
  for (const [u, d] of [[V, def]]) {
    for (const id of Object.keys(est.teoria[u].ideas)) assert.ok(ids(d).has(id), `${u}: idea «${id}» que no existe`);
    for (const c of est.coleccion.filter(x => x.unidad === u)) assert.ok(mesas(d).has(c.mesa), `${u}: mesa «${c.mesa}»`);
    for (const k of Object.keys(est.glosario[u])) assert.ok(palabras(d).has(k), `${u}: palabra «${k}»`);
  }
  if (circular.glosario.length) assert.ok(Object.keys(est.glosario[N] || {}).length >= 1, 'las palabras del giro se fueron');
  assert.equal(est.teoria[V].ideas['un-reloj-dos-ejes'].prediccion, 'lanzada', 'la predicción de A1 se conserva');
  // La predicción de A1 es la de antes, con los mismos ids de opción: lo guardado sigue valiendo.
  assert.deepEqual(A1.predice.opciones.map(o => o.id).sort(), ['c', 'lanzada', 'pesada', 'soltada']);
});

test('el catálogo: dos unidades, sus temas, sus plantillas y quién las pide', () => {
  const cat = require('../../../catalogo/cursos/fisica.json'), u = id => cat.unidades.find(x => x.id === id);
  const a = u(def.unidad), b = u(circular.unidad);
  assert.equal(a.nombre, 'Movimiento parabólico'); assert.equal(b.nombre, 'Movimiento circular');
  assert.deepEqual(a.temas, ['Movimiento en dos dimensiones', 'Tiro parabólico']);
  assert.deepEqual(b.temas, ['Magnitudes angulares', 'MCU', 'MCUV', 'Aceleración tangencial y centrípeta']);
  assert.deepEqual(a.requiere, ['fisica.mruv-y-caida-libre']); assert.deepEqual(b.requiere, ['fisica.mruv-y-caida-libre']);
  const rama = cat.ramas.find(r => r.nombre === 'Mecánica').unidades;
  assert.equal(rama.indexOf(b.id), rama.indexOf(a.id) + 1, 'Movimiento circular va después de Movimiento parabólico');
  for (const id of ['fisica.gravitacion', 'fisica.oscilaciones', 'fisica.magnetismo']) {
    assert.ok(u(id).requiere.includes(b.id) && !u(id).requiere.includes(a.id), `${id} pide el movimiento circular`);
  }
  // Cada plantilla que una unidad lista dice esa unidad en su ficha, y al revés.
  for (const x of [a, b]) for (const p of x.plantillas) assert.ok(require(`../../../plantillas/${p}/plantilla.json`).unidades.includes(x.id), `${p} no dice ${x.id}`);
  assert.ok(!a.plantillas.some(p => /^circular-|^movimiento-circular$/.test(p)), 'la práctica del giro ya no sale en Movimiento parabólico');
  assert.deepEqual(require('../../../plantillas/cinematica-medias/generador.js').tiposPorUnidad[a.id], ['xy']);
  assert.deepEqual(require('../../../plantillas/cinematica-medias/generador.js').tiposPorUnidad[b.id], ['latitud']);
});

// ---------- A1: colores, notación y lo que se ve antes de predecir ----------
const fichas = x => (x === null || x === undefined || typeof x !== 'object' ? [] : Array.isArray(x) ? x.flatMap(fichas)
  : typeof x.v === 'string' && /^c-/.test(x.v) ? [x] : Object.values(x).flatMap(fichas));
function lecturas(i) {
  const out = [], add = (donde, x) => out.push({ donde, x });
  const j = i.juega;
  for (const [k, t] of i.lee.tarjetas.entries()) add(`lee ${k + 1}`, [t.titulo, t.texto, t.ecuacion]);
  add('consigna', j.consigna); add('misión', [j.mision.texto, j.mision.bien]); add('leyenda', j.leyenda.map(x => [x.s, x.t]));
  for (const v of Teoria.grilla(j.controles).filter((_, k) => k % 7 === 0)) add(`lectura ${JSON.stringify(v)}`, j.lectura(v));
  add('predice', [i.predice.pregunta, i.predice.datos, i.predice.opciones.map(o => [o.texto, o.siFuera])]);
  for (const [k, p] of i.mira.pasos.entries()) add(`mira ${k + 1}`, [p.texto, p.ecuacion]);
  add('regla', [i.regla.texto, i.regla.ecuacion, i.regla.condicion]);
  for (const [k, e] of i.ejemplos.entries()) add(`ejemplo ${k + 1}`, [e.titulo, e.enunciado, e.datos, e.alternativas || [], e.solucion, e.respuesta]);
  for (let s = 0; s < 80; s++) {
    const a = i.ahoraTu.generar(s), r = i.resuelve.generar(s);
    add(`ahora tú ${s}`, [a.pregunta, a.datos, a.opciones.map(o => [o.texto, o.siFuera]), a.solucion]);
    add(`resuelve ${s}`, [r.enunciado, r.datos, r.pasos.map(x => [x.texto, x.ecuacion]), r.respuesta]);
  }
  return out;
}

test('la tabla de colores, igual a la de MRU y MRUV: velocidad naranja, tiempo turquesa, posición y altura violeta, aceleración carmín', () => {
  assert.deepEqual(def.colores, { velocidad: 'o', tiempo: 'i', posición: 'f', altura: 'f', aceleración: 'h' });
  for (const otra of ['./mruv-y-caida-libre.js', './movimiento-rectilineo.js']) {
    const c = require(otra).colores;
    for (const [m, col] of Object.entries(def.colores)) if (m in c) assert.equal(col, c[m], `${otra}: ${m}`);
  }
});

test('A1, un color por magnitud: cada ficha dice su magnitud y lleva su color; cada letra, el suyo; sin verde', () => {
  const LETRA = { v: 'c-o', t: 'c-i', x: 'c-f', h: 'c-f', g: 'c-h' };
  let n = 0;
  for (const { donde, x } of lecturas(A1)) for (const f of fichas(x)) {
    n++;
    assert.ok(f.m in def.colores, `${donde}: «${f.t}» sin magnitud (m = ${f.m})`);
    assert.equal(f.v, `c-${def.colores[f.m]}`, `${donde}: «${f.t}» (${f.m}) en ${f.v}`);
    if (f.t in LETRA) assert.equal(f.v, LETRA[f.t], `${donde}: la letra ${f.t}`);
    assert.notEqual(f.v, 'c-d', `${donde}: verde`);
  }
  assert.ok(n > 1500, `${n} fichas`);
  assert.deepEqual(A1.juega.controles.map(c => c.color), ['c-o', 'c-i']);
  // Lo que se pide en una figura va con «?» en tinta: ninguna cota ni flecha con «?» lleva color.
  for (const e of A1.ejemplos) for (const r of P.geometria(e.figura.datos).rotulos.filter(x => x.texto === '?')) assert.equal(r.color, undefined, e.titulo);
});

test('A1 no escribe flechas de vector: v₀ es la rapidez de salida, un número', () => {
  assert.equal(def.notacion.vectores, true);
  assert.ok(/vector/.test(def.notacion.motivo) && /rapidez de salida/.test(def.notacion.motivo));
  for (const { donde, x } of lecturas(A1)) {
    assert.ok(!/⃗/.test(plano(x)), `${donde}: «⃗»`);
    assert.ok(!JSON.stringify(x === undefined ? null : x).includes('"vec"'), `${donde}: { vec }`);
    assert.ok(!/[ᵧᵪ]/.test(plano(x)), `${donde}: subíndice con letra griega`);
  }
});

test('A1: la misión se cumple solo saliendo a 10 m/s, y no está cumplida al abrir', () => {
  const j = A1.juega, casos = Teoria.grilla(j.controles);
  const logran = new Set(casos.filter(v => j.mision.logrado(v)).map(v => v.v0));
  assert.deepEqual([...logran], [10]);
  assert.equal(j.mision.logrado(Teoria.inicio(j)), false);
  // Con 10 m/s la piedra del dibujo termina sobre la balsa; con otra rapidez, no.
  const fin = v0 => { const g = P.geometria(j.dibujo({ v0, t: 3.6 }).datos), p = g.objetos.find(o => o.nombre === 'piedra'), b = g.objetos.find(o => o.nombre === 'balsa'); return Math.abs((p.x0 + p.x1) / 2 - (b.x0 + b.x1) / 2); };
  assert.ok(fin(10) < 1e-9); assert.ok(fin(9) > 5 && fin(11) > 5);
  // El alcance que dice la lectura es el del cálculo aparte: 45 m de caída, y v₀ metros por segundo de lado.
  const T = tiempoDe(45);
  for (const v0 of [5, 8, 10, 15]) cerca(num(plano(j.lectura({ v0, t: 0 })).match(/a ([\d,]+) m$/)[1]), v0 * T, `lectura con ${v0} m/s`);
});

test('A1: nada de lo que se ve antes de predecir dice quién llega primero ni cuánto tarda en caer', () => {
  const j = A1.juega, antes = [];
  for (const t of A1.lee.tarjetas) antes.push(plano([t.titulo, t.texto, t.ecuacion]));
  antes.push(plano(j.consigna), plano(j.mision.texto), plano(j.mision.bien), plano(j.voz), plano(j.leyenda.map(x => [x.s, ' ', x.t, ' '])));
  for (const v of Teoria.grilla(j.controles).filter((_, k) => k % 5 === 0)) antes.push(plano(j.lectura(v)));
  for (const txt of antes) {
    assert.ok(!/suelt|soltar|a la vez|llegan|al mismo tiempo|juntas/i.test(txt), `adelanta la predicción: «${txt}»`);
    assert.ok(!/tarda|en 3 s|3 s\b/.test(txt), `dice cuánto tarda en caer: «${txt}»`);
  }
  // El juego tiene una sola piedra; la que se suelta aparece recién en Predice y en Mira.
  for (const v of Teoria.grilla(j.controles).filter((_, k) => k % 11 === 0)) assert.ok(!/data-objeto="soltada"/.test(P.dibujar(j.dibujo(v).datos)));
  assert.match(P.dibujar(A1.predice.dibujo.datos), /data-objeto="soltada"/);
  // La figura de Predice no muestra ni el camino ni las marcas; la de revelar, sí, con las dos a la misma altura.
  assert.ok(!/fis-camino|fis-tenue|fis-nivel/.test(P.dibujar(A1.predice.dibujo.datos)));
  assert.match(P.dibujar(A1.predice.revelar.datos, A1.predice.revelar.estado), /fis-nivel/);
  // Los datos de Predice no traen fórmulas, y el glosario no dice la respuesta (auditoría de MRUV, A2).
  for (const d of A1.predice.datos) assert.ok(!/=/.test(plano(d)), `dato con fórmula: ${plano(d)}`);
  for (const g of def.glosario) assert.ok(!/a la vez|llegan|primero|juntas|se suelta|soltad/i.test([g.def, g.simple, ...(g.ejemplos || [g.ejemplo])].join(' ')), `el glosario adelanta la predicción: ${g.termino}`);
});

test('A1: lo que nombra la leyenda se dibuja en el juego', () => {
  const s = P.dibujar(A1.juega.dibujo({ v0: 12, t: 2.6 }).datos);
  assert.match(s, /class="fis-tenue"/); assert.match(s, /class="fis-sombra"/); assert.match(s, /data-objeto="balsa"/);
  assert.match(s, /class="fis-salida"/); assert.match(s, />x \(m\)</); assert.match(s, />h \(m\)</);
  // Lo que se ve en el juego está en la leyenda: v₀, x, h, t, la piedra tenue, el punto violeta y la balsa.
  assert.deepEqual(A1.juega.leyenda.map(x => plano([x.s])), ['v0', 'x', 'h', 't', 'piedra tenue', 'punto violeta', 'balsa']);
});

// ---------- El validador y la forma de la idea A1 ----------
test('la unidad pasa el validador común, y A1 trae todo lo del contrato', () => {
  const cat = require('../../../catalogo/cursos/fisica.json');
  for (const d of [def]) {
    const p = Teoria.problemas(d, { temas: cat.unidades.find(x => x.id === d.unidad).temas, semillas: 60 });
    assert.deepEqual(p, [], p.join('\n'));
  }
  for (const k of ['aprendizaje', 'actividad', 'pregunta', 'lee', 'resuelve']) assert.ok(A1[k], k);
  assert.ok(A1.juega.mision && A1.juega.leyenda && A1.juega.resumen);
  assert.deepEqual(Teoria.momentosDe(A1), ['lee', 'juega', 'predice', 'mira', 'regla', 'resuelve', 'ahora-tu']);
  // Las palabras que A1 estrena, cada una con su aproximación de todos los días y 3 ejemplos.
  const mias = Glosario.porIdea(def)[0];
  assert.deepEqual(mias.map(g => g.termino).sort(), ['alcance horizontal', 'tiempo de vuelo', 'tiro horizontal', 'trayectoria']);
  for (const g of mias) assert.ok(g.simple && g.ejemplos.length >= 3, g.termino);
});

test('A1: 15 ejemplos que suben de nivel; los de examen, con cinco alternativas y la letra en negrita', () => {
  const EJ = A1.ejemplos;
  assert.equal(EJ.length, 15);
  assert.deepEqual(EJ.map(e => e.nivel), [1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3]);
  for (const e of EJ) {
    assert.ok(Array.isArray(e.datos) && e.datos.length >= 1, `${e.titulo}: sin datos`);
    assert.ok(e.figura && e.figura.pieza === 'fis-tiro', `${e.titulo}: sin figura`);
    // Nivel 1: un paso de cuentas. Nivel 2: dos o tres. Nivel 3: de examen.
    const cuentas = e.solucion.filter(l => l.ecuacion).length;
    if (e.nivel === 1) assert.equal(cuentas, 1, `${e.titulo}: un paso`);
    if (e.nivel === 2) assert.ok(cuentas >= 2, `${e.titulo}: dos pasos o más`);
    if (e.nivel === 3) {
      assert.equal(e.alternativas.length, 5, e.titulo);
      assert.equal(new Set(e.alternativas).size, 5, `${e.titulo}: alternativas repetidas`);
      assert.ok(e.respuesta[0] && e.respuesta[0].negrita, `${e.titulo}: la letra en negrita`);
    } else assert.equal(e.alternativas, undefined, `${e.titulo}: alternativas fuera del nivel 3`);
    for (const l of e.solucion) for (const m of plano(l.texto).matchAll(/\b(?:La|la) ([A-E])\b/g)) assert.ok(JSON.stringify(l.texto).includes(`{"negrita":["${m[1]}"]}`), `${e.titulo}: la ${m[1]} sin negrita`);
  }
  assert.deepEqual(EJ.filter(e => e.nivel === 3).map(e => plano(e.respuesta)[0]).sort(), ['A', 'B', 'C', 'D', 'E'], 'cada letra es la respuesta una vez');
  // La respuesta lleva el color de su magnitud.
  for (const e of EJ) assert.ok(fichas(e.respuesta).length >= 1, `${e.titulo}: respuesta sin color`);
});

// ---------- Figuras: caben, no se pisan y no delatan la respuesta ----------
function figuras(i) {
  const out = [];
  for (const v of Teoria.grilla(i.juega.controles).filter((_, k) => k % 3 === 0)) out.push([`juego ${JSON.stringify(v)}`, i.juega.dibujo(v)]);
  for (const [k, t] of i.lee.tarjetas.entries()) if (t.dibujo) out.push([`lee ${k + 1}`, t.dibujo]);
  out.push(['predice', i.predice.dibujo], ['revelar', i.predice.revelar]);
  for (const [k, p] of i.mira.pasos.entries()) out.push([`mira ${k + 1}`, { datos: i.mira.datos, estado: p.estado }]);
  for (const e of i.ejemplos) out.push([`ejemplo «${e.titulo}»`, e.figura]);
  for (let s = 0; s < 120; s++) {
    const a = i.ahoraTu.generar(s), r = i.resuelve.generar(s);
    if (a.dibujo) out.push([`ahora tú ${s}`, a.dibujo]);
    if (r.dibujo) out.push([`resuelve ${s}`, r.dibujo]);
  }
  return out;
}
const pisa = (a, b) => a.x0 < b.x1 && b.x0 < a.x1 && a.y0 < b.y1 && b.y0 < a.y1;

test('A1: todas sus figuras caben con 4 de margen y ningún rótulo pisa a otro ni al objeto', () => {
  const todas = figuras(A1);
  assert.ok(todas.length > 250, `${todas.length} figuras`);
  for (const [nombre, f] of todas) {
    const g = P.geometria(f.datos, f.estado || {}), s = P.dibujar(f.datos, f.estado || {});
    assert.ok(!/NaN|undefined|Infinity/.test(s), nombre);
    for (const r of g.rotulos) assert.ok(r.x0 >= 4 - 1e-9 && r.x1 <= 316 + 1e-9 && r.y0 >= 4 && r.y1 <= g.H - 4, `${nombre}: «${r.texto}» se sale`);
    for (let a = 0; a < g.rotulos.length; a++) for (let b = a + 1; b < g.rotulos.length; b++) assert.ok(!pisa(g.rotulos[a], g.rotulos[b]), `${nombre}: «${g.rotulos[a].texto}» pisa «${g.rotulos[b].texto}»`);
    for (const o of g.objetos) assert.ok(o.x0 >= 4 && o.x1 <= 316 + 1e-9 && o.y0 >= 2 && o.y1 <= g.H - 2, `${nombre}: ${o.nombre} se sale`);
    for (const r of g.rotulos.filter(x => ['flecha', 'cota', 'otra', 'blanco'].includes(x.tipo))) for (const o of g.objetos.filter(x => !['pena', 'mesa', 'azotea', 'muro'].includes(x.nombre))) {
      assert.ok(!pisa(r, o), `${nombre}: «${r.texto}» pisa ${o.nombre}`);
    }
  }
});

test('A1: ninguna figura de un ejemplo, de «Ahora tú» ni de «Así se resuelve» muestra un número de la respuesta que el enunciado no dio', () => {
  const nums = x => Teoria.numerosDe(plano(x));
  const revisar = (donde, fig, enun, resp) => {
    const dados = nums(enun), enFig = Teoria.numerosDe(Teoria.textoSVG(P.dibujar(fig.datos, fig.estado || {})));
    for (const n of nums(resp)) if (!dados.has(n)) assert.ok(!enFig.has(n), `${donde}: la figura muestra ${n}, que es de la respuesta`);
    // Tampoco el camino recorrido ni las marcas: la figura es el planteamiento (t = 0).
    assert.ok(!/fis-tenue|fis-sombra/.test(P.dibujar(fig.datos, fig.estado || {})), `${donde}: la figura trae marcas del vuelo`);
  };
  for (const e of A1.ejemplos) revisar(e.titulo, e.figura, [e.enunciado, e.alternativas || []], e.respuesta);
  for (let s = 0; s < 120; s++) {
    const a = A1.ahoraTu.generar(s), r = A1.resuelve.generar(s);
    revisar(`ahora tú ${s}`, a.dibujo, a.pregunta, a.opciones.find(o => o.correcta).texto);
    revisar(`resuelve ${s}`, r.dibujo, r.enunciado, r.respuesta);
  }
});

// ---------- Cuentas: todo cuadra con la caída integrada paso a paso ----------
test('A1: el juego, Predice y «Mira» cuadran con el cálculo aparte', () => {
  const T = tiempoDe(45);
  cerca(T, 3, 'desde 45 m');
  cerca(caidaEn(1), 5, 'lo que cae en 1 s'); cerca(caidaEn(2), 20, 'lo que cae en 2 s'); cerca(caidaEn(3), 45, 'lo que cae en 3 s');
  const eq = k => plano(A1.mira.pasos[k].ecuacion);
  assert.match(eq(1), /= 5 m$/); assert.match(eq(2), /= 20 m$/); assert.match(eq(3), /= 45 m$/); assert.match(eq(5), /10 · 3 = 30 m$/);
  cerca(10 * T, 30, 'el alcance de «Mira»');
  // La piedra que se suelta y la lanzada, en el dibujo de cada paso, a la misma altura.
  for (const p of A1.mira.pasos) {
    const g = P.geometria(A1.mira.datos, p.estado), a = g.objetos.find(o => o.nombre === 'piedra'), b = g.objetos.find(o => o.nombre === 'soltada');
    assert.ok(Math.abs((a.y0 + a.y1) - (b.y0 + b.y1)) < 1e-9);
  }
  assert.equal(A1.predice.opciones.find(o => o.correcta).id, 'c');
});

test('A1: los 15 ejemplos cuadran con el cálculo aparte (también el valor de cada alternativa equivocada)', () => {
  const R = A1.ejemplos.map(e => plano(e.respuesta)), ej = k => A1.ejemplos[k - 1];
  const dice = (k, re, valor, que) => { const m = R[k - 1].match(re); assert.ok(m, `ejemplo ${k}: «${R[k - 1]}»`); cerca(num(m[1]), valor, `ejemplo ${k} (${que})`); };
  dice(1, /a ([\d,]+) m/, 12 * 2, '12 m/s durante 2 s');
  dice(2, /caído ([\d,]+) m/, caidaEn(3), 'cae 3 s');
  dice(3, /Tarda ([\d,]+) s/, tiempoDe(20), 'cae 20 m');
  dice(4, /a ([\d,]+) m\/s/, 0.6 / 0.4, '0,6 m en 0,4 s');
  cerca(tiempoDe(0.8), 0.4, 'la mesa de 0,8 m da los 0,4 s del enunciado');
  dice(5, /^([\d,]+) m/, 1 * 0.4, 'la lenta'); dice(5, /y ([\d,]+) m/, 3 * 0.4, 'la rápida');
  dice(6, /a ([\d,]+) m/, 14 * tiempoDe(45), 'desde 45 m a 14 m/s');
  dice(7, /a ([\d,]+) m/, caidaEn(12 / 6), '12 m a 6 m/s');
  dice(8, /a ([\d,]+) cm/, 100 * 2 * tiempoDe(0.8), 'la canica, en cm');
  dice(9, /a ([\d,]+) m\/s/, 2 / tiempoDe(1.25), 'el caño');
  dice(10, /a ([\d,]+) m/, (18 * 1000 / 3600) * tiempoDe(20), '18 km/h desde 20 m');
  // Nivel 3: la alternativa de la respuesta es la del cálculo aparte, y las otras son las de su error.
  const alt = (k, letra) => ej(k).alternativas['ABCDE'.indexOf(letra)];
  const t11 = tiempoDe(1.25);
  assert.equal(R[10][0], 'D'); assert.equal(alt(11, 'D'), `Las dos: ${Kit.formatear(t11, 2)} s. Caen a ${Kit.formatear(2 * t11, 2)} m y a ${Kit.formatear(4 * t11, 2)} m`);
  assert.match(alt(11, 'C'), new RegExp(`^Las dos: ${Kit.formatear(t11 * t11, 2)} s`), 'la C toma t² como t');
  const v12 = 144 * 1000 / 3600, t12 = tiempoDe(125);
  assert.equal(R[11][0], 'C'); cerca(numAlt(alt(12, 'C')), v12 * t12, 'ejemplo 12');
  cerca(numAlt(alt(12, 'A')), 144 * t12, '12 A: deja los km/h'); cerca(numAlt(alt(12, 'E')), v12 * t12 * t12, '12 E: t² como tiempo'); cerca(numAlt(alt(12, 'B')), 125, '12 B: la altura');
  const t13 = 40 / 20, c13 = caidaEn(t13);
  assert.ok(t13 < tiempoDe(45), 'llega a la pared antes que al piso'); cerca(tiempoDe(45), 3, 'hasta el piso tardaría 3 s');
  assert.equal(R[12][0], 'B'); cerca(numAlt(alt(13, 'B')), 45 - c13, 'ejemplo 13'); cerca(numAlt(alt(13, 'A')), c13, '13 A: lo que cayó');
  cerca(numAlt(alt(13, 'C')), 45 - 40, '13 C: resta la distancia a la pared');
  // Cuatro veces más alto: el tiempo se duplica (cualquier altura sirve para comprobarlo).
  cerca(tiempoDe(80) / tiempoDe(20), 2, 'cuatro veces la altura, el doble de tiempo');
  assert.equal(R[13][0], 'E'); cerca(numAlt(alt(14, 'E')), 12 * tiempoDe(80) / tiempoDe(20), 'ejemplo 14'); cerca(numAlt(alt(14, 'A')), 4 * 12, '14 A: proporción directa');
  const t15 = tiempoDe(80);
  assert.equal(R[14][0], 'A'); cerca(numAlt(alt(15, 'A')), 25 * t15 - 10 * t15, 'ejemplo 15');
  cerca(numAlt(alt(15, 'B')), 25 * t15 + 10 * t15, '15 B: suma'); cerca(numAlt(alt(15, 'E')), 15 * t15 * t15, '15 E: t² como tiempo'); cerca(numAlt(alt(15, 'C')), 25 - 10, '15 C: sin el tiempo');
  cerca(numAlt(alt(15, 'D')), 25 * t15, '15 D: solo la rápida');
});

test('A1: «Ahora tú» en 400 semillas: la correcta es la del cálculo aparte y ninguna otra opción vale lo mismo', () => {
  const tipos = new Set();
  for (let s = 0; s < 400; s++) {
    const c = A1.ahoraTu.generar(s), q = plano(c.pregunta), bien = c.opciones.filter(o => o.correcta);
    assert.equal(bien.length, 1); assert.ok(c.opciones.length >= 3, `semilla ${s}: ${c.opciones.length} opciones`);
    const valor = num(bien[0].texto.replace(/ (m\/s|m|s)$/, ''));
    const h = num(q.match(/de ([\d,]+) m(?: de (?:altura|alto))?/)[1]);
    let espera;
    if (/¿Cuánto tarda/.test(q)) { espera = tiempoDe(h); tipos.add('tiempo'); assert.match(bien[0].texto, / s$/); }
    else if (/¿A qué distancia/.test(q)) { espera = num(q.match(/a ([\d,]+) m\/s/)[1]) * tiempoDe(h); tipos.add('alcance'); assert.match(bien[0].texto, / m$/); }
    else if (/¿Con qué rapidez/.test(q)) { espera = num(q.match(/a ([\d,]+) m del pie/)[1]) / tiempoDe(h); tipos.add('rapidez'); assert.match(bien[0].texto, / m\/s$/); }
    else {
      assert.match(q, /golpea la pared/); tipos.add('pared');
      const v0 = num(q.match(/a ([\d,]+) m\/s/)[1]), d = num(q.match(/está a ([\d,]+) m/)[1]);
      assert.ok(d / v0 < tiempoDe(h) - 1e-6, `semilla ${s}: llega al piso antes que a la pared`);
      espera = h - caidaEn(d / v0);
    }
    cerca(valor, espera, `semilla ${s}: ${q}`);
    for (const o of c.opciones.filter(x => !x.correcta)) {
      assert.ok(o.error && o.siFuera, `semilla ${s}: opción sin código o sin siFuera`);
      assert.ok(Math.abs(num(o.texto.replace(/ (m\/s|m|s)$/, '')) - valor) > 1e-9, `semilla ${s}: «${o.texto}» vale lo mismo que la correcta`);
    }
    assert.ok(Array.isArray(c.datos) && c.datos.length === 3, `semilla ${s}: datos`);
  }
  assert.deepEqual([...tipos].sort(), ['alcance', 'pared', 'rapidez', 'tiempo']);
});

test('A1: «Así se resuelve» en 200 semillas cuadra con el cálculo aparte y no hace las preguntas de «Ahora tú»', () => {
  for (let s = 0; s < 200; s++) {
    const c = A1.resuelve.generar(s), q = plano(c.enunciado), r = plano(c.respuesta);
    if (/¿Qué altura tiene la azotea\?/.test(q)) {
      const v0 = num(q.match(/a ([\d,]+) m\/s/)[1]), x = num(q.match(/a ([\d,]+) m del pie/)[1]);
      cerca(num(r.match(/a ([\d,]+) m del piso/)[1]), caidaEn(x / v0), `semilla ${s}: ${q}`);
    } else {
      assert.match(q, /¿A cuántos centímetros/);
      const v0 = num(q.match(/a ([\d,]+) m\/s/)[1]), cm = num(q.match(/de ([\d,]+) cm/)[1]);
      cerca(num(r.match(/a ([\d,]+) cm/)[1]), 100 * v0 * tiempoDe(cm / 100), `semilla ${s}: ${q}`);
    }
    assert.deepEqual(c.pasos.map(p => p.tipo), ['pide', 'datos', 'regla', 'cuentas', 'sentido']);
  }
});

// =====================================================================================================================
// Ideas A2 a A5 (fase 3, 19 nov). El cálculo aparte simula el vuelo con pasos de tiempo, en los dos ejes (eje y hacia
// arriba), sin las fórmulas del tiro; los senos y cosenos de 37° y 53° son los del examen (3/5 y 4/5).
// =====================================================================================================================
const IDEAS = { A2: 'velocidad-en-vuelo', A3: 'tiro-oblicuo', A4: 'altura-y-alcance', A5: 'ecuaciones-en-el-plano' };
const I = k => def.ideas.find(i => i.id === IDEAS[k]);
const SEN = { 30: 1 / 2, 37: 3 / 5, 45: Math.SQRT1_2, 53: 4 / 5, 60: Math.sqrt(3) / 2 }, COS = { 30: Math.sqrt(3) / 2, 37: 4 / 5, 45: Math.SQRT1_2, 53: 3 / 5, 60: 1 / 2 };
const sen = a => (a in SEN ? SEN[a] : Math.sin(a * Math.PI / 180)), cos = a => (a in COS ? COS[a] : Math.cos(a * Math.PI / 180));
const DV = 1e-4;
function vuelo(vx, vy0, y0, hasta) {
  let x = 0, y = y0, vy = vy0, t = 0;
  for (let i = 0; i < 3e6; i++) {
    const vy1 = vy - 10 * DV, y1 = y + (vy + vy1) / 2 * DV, x1 = x + vx * DV;
    const corta = (a, a1, m) => { const f = (m - a) / (a1 - a); return { t: t + f * DV, x: x + f * (x1 - x), y: y + f * (y1 - y), vx, vy: vy + f * (vy1 - vy) }; };
    if (hasta.t !== undefined && t + DV >= hasta.t) return corta(t, t + DV, hasta.t);
    if (hasta.x !== undefined && x1 >= hasta.x) return corta(x, x1, hasta.x);
    if (hasta.piso && y1 <= 0 && vy1 < 0) return corta(y, y1, 0);
    if (hasta.cima && vy1 <= 0) return corta(vy, vy1, 0);
    if (hasta.pend !== undefined && -vy1 >= hasta.pend * vx) return corta(-vy, -vy1, hasta.pend * vx);
    x = x1; y = y1; vy = vy1; t += DV;
  }
  throw new Error('el vuelo no terminó');
}
const rapidez = p => Math.hypot(p.vx, p.vy);
const cerca2 = (a, b, que) => assert.ok(Math.abs(a - b) <= Math.max(0.0051, 2e-3 * Math.abs(b)), `${que}: ${a} contra ${b}`);
const n1 = s => num(String(s).match(/−?\d[\d  ]*(?:,\d+)?/)[0].replace(/[  ]/g, ''));
const TAN = { 37: 3 / 4, 45: 1, 53: 4 / 3 };

test('A2 a A5: un color por magnitud, cada letra con el suyo, sin verde ni «ᵧ»; la velocidad entera con flecha desde A2', () => {
  const LETRA = { v: 'c-o', t: 'c-i', x: 'c-f', y: 'c-f', h: 'c-f', H: 'c-f', R: 'c-f', d: 'c-f', g: 'c-h', a: 'c-h' };
  for (const k of Object.keys(IDEAS)) {
    let n = 0;
    for (const { donde, x } of lecturas(I(k))) {
      for (const f of fichas(x)) {
        n++;
        assert.ok(f.m in def.colores, `${k} ${donde}: «${f.t}» sin magnitud (m = ${f.m})`);
        assert.equal(f.v, `c-${def.colores[f.m]}`, `${k} ${donde}: «${f.t}» (${f.m}) en ${f.v}`);
        if (f.t in LETRA) assert.equal(f.v, LETRA[f.t], `${k} ${donde}: la letra ${f.t}`);
      }
      assert.ok(!/[ᵧᵪ]/.test(plano(x)), `${k} ${donde}: subíndice con letra griega`);
    }
    assert.ok(n > 300, `${k}: ${n} fichas`);
  }
  // v⃗ aparece en A2 (Lee) como vector; las componentes y la rapidez van sin flecha.
  assert.ok(JSON.stringify(I('A2').lee).includes('"vec"'));
});

test('A2 a A5: cada misión se cumple solo con lo que dice la propuesta, y no al abrir', () => {
  const logran = k => Teoria.grilla(I(k).juega.controles).filter(v => I(k).juega.mision.logrado(v));
  assert.deepEqual([...new Set(logran('A2').map(v => v.v0))], [20]);
  assert.deepEqual([...new Set(logran('A3').map(v => `${v.v0}@${v.ang}`))], ['25@53']);
  assert.deepEqual([...new Set(logran('A4').map(v => v.ang))], [60]);
  assert.deepEqual([...new Set(logran('A5').map(v => `${v.vx},${v.vy}`))].sort(), ['3,4', '6,8']);
  for (const k of Object.keys(IDEAS)) assert.equal(I(k).juega.mision.logrado(Teoria.inicio(I(k).juega)), false, `${k}: cumplida al abrir`);
  // Con lo que logra la misión, el cálculo aparte da lo que pide: 45° a los 2 s, 4 s de vuelo, la misma planta, la antena.
  const p2 = vuelo(20, 0, 45, { t: 2 }); cerca2(-p2.vy, p2.vx, 'A2: 45° a los 2 s');
  cerca2(vuelo(25 * cos(53), 25 * sen(53), 0, { piso: true }).t, 4, 'A3: 4 s de vuelo');
  cerca2(vuelo(10 * cos(60), 10 * sen(60), 0, { piso: true }).x, vuelo(10 * cos(30), 10 * sen(30), 0, { piso: true }).x, 'A4: 30° y 60°');
  for (const [vx, vy] of [[3, 4], [6, 8]]) {
    const g = P.geometria(I('A5').juega.dibujo({ vx, vy, t: 30 / vx }).datos), dron = g.objetos.find(o => o.nombre === 'dron'), ant = g.objetos.find(o => o.nombre === 'antena');
    assert.ok(Math.abs((dron.x0 + dron.x1) / 2 - (ant.x0 + ant.x1) / 2) < 1e-6, `A5: el dron pasa sobre la antena con ${vx} y ${vy}`);
  }
});

test('A2 a A5: nada de lo que se ve antes de predecir dice la respuesta de Predice', () => {
  const PROHIBIDO = { A2: /25 m\/s/, A3: /(más alto|cima|arriba)[^.]*\d+ m\/s|15 m\/s/, A4: /cuatro|doble|20 m\/s/, A5: /50 m|distancia/ };
  for (const k of Object.keys(IDEAS)) {
    const i = I(k), j = i.juega, antes = [];
    for (const t of i.lee.tarjetas) antes.push(plano([t.titulo, t.texto, t.ecuacion]));
    antes.push(plano(j.consigna), plano(j.mision.texto), plano(j.mision.bien), plano(j.voz), plano(j.leyenda.map(x => [x.s, ' ', x.t, ' '])));
    for (const txt of antes) assert.ok(!PROHIBIDO[k].test(txt), `${k} adelanta la predicción: «${txt}»`);
    // La lectura no da la respuesta en ningún caso del juego.
    const nunca = { A2: /25 m\/s/, A3: /arriba|cima/, A4: /veces/, A5: /distancia|de la plaza/ }[k];
    for (const v of Teoria.grilla(j.controles).filter((_, q) => q % 3 === 0)) assert.ok(!nunca.test(plano(j.lectura(v))), `${k} lectura: ${plano(j.lectura(v))}`);
  }
  // A3: el juego no dibuja flechas en vuelo; A5: la figura de Predice no escribe la distancia.
  for (const v of Teoria.grilla(I('A3').juega.controles).filter((_, q) => q % 7 === 0)) assert.ok(!/fis-vel|fis-comp/.test(P.dibujar(I('A3').juega.dibujo(v).datos)));
  assert.ok(!/50/.test(Teoria.textoSVG(P.dibujar(I('A5').predice.dibujo.datos))));
});

test('A2 a A5: lo que nombra la leyenda se dibuja en el juego', () => {
  const s2 = P.dibujar(I('A2').juega.dibujo({ v0: 12, t: 2.2 }).datos);
  assert.match(s2, /class="fis-vel"/); assert.match(s2, /class="fis-comp"/); assert.match(s2, />x \(m\)</); assert.match(s2, />h \(m\)</);
  const s3 = P.dibujar(I('A3').juega.dibujo({ v0: 20, ang: 37, t: 1.5 }).datos);
  assert.match(s3, /class="fis-tenue"/); assert.match(s3, /class="fis-angulo"/); assert.match(s3, />y \(m\)</); assert.match(s3, />t = 1,5 s</);
  const s4 = P.dibujar(I('A4').juega.dibujo({ ang: 45 }).datos);
  assert.match(s4, /data-objeto="planta"/); assert.match(s4, />H</); assert.match(s4, />R</); assert.match(s4, /data-objeto="manguera"/);
  const s5 = P.dibujar(I('A5').juega.dibujo({ vx: 3, vy: 5, t: 4 }).datos);
  assert.match(s5, /data-objeto="plaza"/); assert.match(s5, /data-objeto="antena"/); assert.match(s5, /class="fis-tenue"/); assert.match(s5, /class="fis-sombra"/);
});

test('A2 a A5: el contrato de cada idea, sus palabras y sus 15 ejemplos', () => {
  const PALABRAS = { A2: ['tangente', 'velocidad horizontal', 'velocidad vertical'], A3: ['proyectil', 'tiro parabólico', 'ángulo de lanzamiento'],
    A4: ['alcance máximo', 'tiempo de subida', 'ángulos complementarios'], A5: ['coordenada', 'ecuación de la trayectoria'] };
  const por = Glosario.porIdea(def);
  for (const k of Object.keys(IDEAS)) {
    const i = I(k);
    for (const c of ['aprendizaje', 'actividad', 'pregunta', 'lee', 'resuelve']) assert.ok(i[c], `${k}: ${c}`);
    assert.ok(i.juega.mision && i.juega.leyenda && i.juega.resumen && i.juega.pieza === 'fis-tiro', k);
    assert.deepEqual(Teoria.momentosDe(i), ['lee', 'juega', 'predice', 'mira', 'regla', 'resuelve', 'ahora-tu'], k);
    const mias = por[def.ideas.indexOf(i)];
    assert.deepEqual(mias.map(g => g.termino).sort(), PALABRAS[k].sort(), `${k}: palabras`);
    for (const g of mias) assert.ok(g.simple && g.ejemplos.length >= 3, g.termino);
    const EJ = i.ejemplos;
    assert.equal(EJ.length, 15, k); assert.deepEqual(EJ.map(e => e.nivel), [1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3], k);
    for (const e of EJ) {
      const cuentas = e.solucion.filter(l => l.ecuacion).length;
      if (e.nivel === 1) assert.equal(cuentas, 1, `${k} «${e.titulo}»: un paso`);
      if (e.nivel === 2) assert.ok(cuentas >= 2, `${k} «${e.titulo}»: dos pasos`);
      if (e.nivel === 3) { assert.equal(new Set(e.alternativas).size, 5, e.titulo); assert.ok(e.respuesta[0].negrita, e.titulo); } else assert.equal(e.alternativas, undefined, e.titulo);
      assert.ok(e.figura && e.figura.pieza === 'fis-tiro' && e.datos.length >= 1, e.titulo);
      assert.ok(fichas(e.respuesta).length >= 1, `${k} «${e.titulo}»: respuesta sin color`);
    }
    assert.deepEqual(EJ.filter(e => e.nivel === 3).map(e => plano(e.respuesta)[0]).sort(), ['A', 'B', 'C', 'D', 'E'], `${k}: cada letra una vez`);
  }
});

test('A2 a A5: todas sus figuras caben con 4 de margen, ningún rótulo pisa a otro, y las de los ejercicios no delatan la respuesta', () => {
  for (const k of Object.keys(IDEAS)) {
    const i = I(k), todas = figuras(i);
    for (const [nombre, f] of todas) {
      const g = P.geometria(f.datos, f.estado || {}), s = P.dibujar(f.datos, f.estado || {});
      assert.ok(!/NaN|undefined|Infinity/.test(s), `${k} ${nombre}`);
      for (const r of g.rotulos) assert.ok(r.x0 >= 4 - 1e-9 && r.x1 <= 316 + 1e-9 && r.y0 >= 4 && r.y1 <= g.H - 4, `${k} ${nombre}: «${r.texto}» se sale`);
      for (let a = 0; a < g.rotulos.length; a++) for (let b = a + 1; b < g.rotulos.length; b++) assert.ok(!pisa(g.rotulos[a], g.rotulos[b]), `${k} ${nombre}: «${g.rotulos[a].texto}» pisa «${g.rotulos[b].texto}»`);
      for (const o of g.objetos) assert.ok(o.x0 >= 4 - 1e-9 && o.x1 <= 316 + 1e-9 && o.y0 >= 2 && o.y1 <= g.H - 2, `${k} ${nombre}: ${o.nombre} se sale`);
    }
    const nums = x => Teoria.numerosDe(plano(x));
    const revisar = (donde, fig, enun, resp) => {
      const dados = nums(enun), enFig = Teoria.numerosDe(Teoria.textoSVG(P.dibujar(fig.datos, fig.estado || {})));
      for (const n of nums(resp)) if (!dados.has(n) && n.replace(/\D/g, '').length >= 2) assert.ok(!enFig.has(n), `${k} ${donde}: la figura muestra ${n}, que es de la respuesta`);
    };
    for (const e of i.ejemplos) revisar(e.titulo, e.figura, [e.enunciado, e.datos, e.alternativas || []], e.respuesta);
    for (let s = 0; s < 120; s++) {
      const a = i.ahoraTu.generar(s), r = i.resuelve.generar(s);
      revisar(`ahora tú ${s}`, a.dibujo, [a.pregunta, a.datos], a.opciones.find(o => o.correcta).texto);
      revisar(`resuelve ${s}`, r.dibujo, [r.enunciado, r.datos], r.respuesta);
    }
  }
});

test('A2 a A5: el juego, Predice y «Mira» cuadran con el vuelo simulado', () => {
  const v2 = vuelo(15, 0, 45, { t: 2 });
  cerca2(rapidez(v2), 25, 'A2 Predice'); assert.equal(I('A2').predice.opciones.find(o => o.correcta).texto, '25 m/s');
  const c3 = vuelo(15, 20, 0, { cima: true }); cerca2(rapidez(c3), 15, 'A3 Predice'); assert.equal(I('A3').predice.opciones.find(o => o.correcta).texto, '15 m/s');
  const R = (v, a) => vuelo(v * cos(a), v * sen(a), 0, { piso: true }).x;
  cerca2(R(20, 30) / R(10, 30), 4, 'A4 Predice'); assert.equal(I('A4').predice.opciones.find(o => o.correcta).texto, 'Cuatro veces más lejos');
  cerca2(n1(I('A4').predice.datos[0].match(/llegó a ([\d,]+)/)[1]), R(10, 30), 'A4: el dato de Predice');
  assert.equal(I('A5').predice.opciones.find(o => o.correcta).texto, '50 m'); cerca2(Math.hypot(6 * 5, 8 * 5), 50, 'A5 Predice');
  // Las lecturas del juego.
  for (const v0 of [5, 12, 20]) cerca2(n1(plano(I('A2').juega.lectura({ v0, t: 0 })).match(/de lado, ([\d,]+) m\/s abajo/)[1]), -vuelo(v0, 0, 45, { t: 2 }).vy, `A2 lectura ${v0}`);
  for (const [v0, a] of [[10, 30], [25, 53], [20, 45]]) cerca2(n1(plano(I('A3').juega.lectura({ v0, ang: a, t: 0 })).match(/Sube con ([\d,]+)/)[1]), v0 * sen(a), `A3 lectura ${v0} ${a}`);
  for (const a of [15, 30, 45, 60, 75]) cerca2(n1(plano(I('A4').juega.lectura({ ang: a })).match(/cae a ([\d,]+)/)[1]), R(10, a), `A4 lectura ${a}`);
  for (const [vx, vy, t] of [[3, 4, 2], [8, 8, 9]]) { const l = plano(I('A5').juega.lectura({ vx, vy, t })), tt = Math.min(t, 80 / Math.max(vx, vy)); cerca2(n1(l.match(/: ([\d,]+) m al este/)[1]), vx * tt, `A5 lectura ${vx} ${vy} ${t}`); }
  // Mira: los números de cada paso.
  const ult = (k, p) => n1(plano(I(k).mira.pasos[p].ecuacion).match(/([\d,]+) m\/s$|([\d,]+) m$|([\d,]+) s$/)[0]);
  cerca2(ult('A2', 3), 25, 'A2 Mira'); cerca2(ult('A3', 5), vuelo(15, 20, 0, { piso: true }).x, 'A3 Mira alcance'); cerca2(ult('A3', 4), vuelo(15, 20, 0, { piso: true }).t, 'A3 Mira vuelo');
  cerca2(ult('A4', 1), vuelo(1, 5, 0, { cima: true }).y, 'A4 Mira H'); cerca2(ult('A4', 4), R(20, 30), 'A4 Mira R'); cerca2(ult('A5', 4), 50, 'A5 Mira');
});

test('A2 a A5: los 15 ejemplos de cada idea cuadran con el vuelo simulado', () => {
  const r = (k, j) => plano(I(k).ejemplos[j - 1].respuesta), alt = (k, j) => { const e = I(k).ejemplos[j - 1]; return e.alternativas['ABCDE'.indexOf(plano(e.respuesta)[0])]; };
  const p = (v, a, h = 0) => [v * cos(a), v * sen(a), h];
  const ESPERA = {
    A2: [-vuelo(6, 0, 999, { t: 3 }).vy, 12, -vuelo(4, 0, 999, { t: 1.5 }).vy, 10, vuelo(1, 0, 999, { pend: 25 }).t, rapidez(vuelo(15, 0, 20, { piso: true })), 37,
      rapidez(vuelo(40, 0, 45, { piso: true })), vuelo(12, 0, 999, { pend: 3 / 4 }).t, rapidez(vuelo(30, 0, 125, { t: 4 })),
      999 - vuelo(15, 0, 999, { pend: 4 / 3 }).y, rapidez(vuelo(30, 0, 80, { piso: true })), Math.sqrt(625 - vuelo(0, 0, 20, { piso: true }).vy ** 2), null, vuelo(24, 0, 999, { pend: 1 }).t],
    A3: [16, 12, vuelo(12, 16, 0, { t: 2 }).x, vuelo(10, 25, 0, { t: 1.5 }).vy, 5, vuelo(...p(25, 37), { piso: true }).t, vuelo(...p(20, 53), { t: 1 }).y, vuelo(10, 10, 0, { t: 1 }).x,
      rapidez(vuelo(...p(25, 53), { t: 3 })), vuelo(...p(25, 37), { x: 30 }).y, vuelo(...p(25, 37), { piso: true }).t, vuelo(...p(25, 37, 20), { piso: true }).x,
      vuelo(...p(15, 53), { x: 19.8 }).y, rapidez(vuelo(...p(20, 37), { t: 2 })), vuelo(...p(25, 53), { piso: true }).t],
    A4: [vuelo(8, 15, 0, { cima: true }).t, rapidez(vuelo(16, 12, 0, { cima: true })), vuelo(12, 20, 0, { cima: true }).y, 36, 2 * vuelo(1, 20, 0, { cima: true }).t,
      vuelo(...p(25, 53), { cima: true }).y, vuelo(...p(25, 37), { piso: true }).x, vuelo(...p(20, 45), { piso: true }).x, vuelo(...p(25, 53), { piso: true }).x, 30, 20, 72,
      vuelo(...p(20, 53), { cima: true }).y - vuelo(...p(20, 37), { cima: true }).y, vuelo(...p(Math.sqrt(250), 53), { cima: true }).y, null],
    A5: [8, 15, 7, vuelo(1, 20, 0, { t: 2 }).y, 7, 20, 20, vuelo(8, 30, 0, { piso: true }).x, vuelo(10, 0, 45, { piso: true }).t, vuelo(10, 10, 0, { x: 10 }).y,
      20, vuelo(6, 8, 0, { cima: true }).y, null, 25, rapidez(vuelo(15, 20, 0, { t: 1 }))],
  };
  // Comprobaciones de los datos: 30 m/s desde 45 m y a 90 m con 45° (A4, 10), y 2√2 s de vuelo a 20 m/s (A4, 11).
  cerca2(vuelo(...p(30, 45), { piso: true }).x, 90, 'A4 ej10: 30 m/s llega a 90 m'); cerca2(vuelo(...p(20, 45), { piso: true }).t, 2 * Math.SQRT2, 'A4 ej11');
  for (const k of Object.keys(ESPERA)) ESPERA[k].forEach((v, j) => {
    if (v === null) return;
    const e = I(k).ejemplos[j], r0 = r(k, j + 1), txt = e.nivel === 3 ? alt(k, j + 1) : r0.includes(' = ') ? r0.split(' = ').pop() : r0;
    cerca2(n1(txt), v, `${k} ejemplo ${j + 1} «${e.titulo}»: ${txt}`);
  });
  // Los dos de texto: A2, 14 (la velocidad es tangente) y A5, 13 (y = 4x − x²/5, en tres puntos del vuelo).
  assert.match(alt('A2', 14), /tangente/);
  cerca2(n1(r('A4', 15).split('llega a')[1]), vuelo(...p(10, 45), { piso: true }).x, 'A4 ej15: a 45° llega a 10 m');
  assert.equal(alt('A5', 13), 'y = 4x − x²/5'); for (const t of [0.5, 2, 3.5]) { const q = vuelo(5, 20, 0, { t }); cerca2(4 * q.x - q.x * q.x / 5, q.y, 'A5 ej13'); }
});

test('A2 a A5: «Ahora tú» en 400 semillas y «Así se resuelve» en 200 cuadran con el vuelo simulado', () => {
  const v = (q, re) => n1(q.match(re)[1]);
  const COMPRUEBA = {
    A2(q) {
      const v0 = v(q, /a ([\d,]+) m\/s/);
      if (/velocidad hacia abajo va/.test(q)) return -vuelo(v0, 0, 999, { t: v(q, /va ([\d,]+) s después/) }).vy;
      if (/se mueve/.test(q)) return rapidez(vuelo(v0, 0, 999, { t: v(q, /mueve ([\d,]+) s/) }));
      if (/llega al piso/.test(q)) return rapidez(vuelo(v0, 0, v(q, /torre de ([\d,]+) m/), { piso: true }));
      return vuelo(v0, 0, 999, { pend: TAN[v(q, /forma ([\d,]+)°/)] }).t;
    },
    A3(q) {
      if (/cae a ([\d,]+) m de donde/.test(q)) return v(q, /cae a ([\d,]+) m/) / (v(q, /a ([\d,]+) m\/s/) * cos(v(q, /con ([\d,]+)°/)));
      const v0 = v(q, /a ([\d,]+) m\/s/), a = v(q, /con ([\d,]+)°/), c = [v0 * cos(a), v0 * sen(a), 0];
      if (/horizontal al salir/.test(q)) return c[0];
      if (/velocidad vertical sale/.test(q)) return c[1];
      if (/en el aire/.test(q)) return vuelo(...c, { piso: true }).t;
      return vuelo(...c, { t: v(q, /está ([\d,]+) s/) }).y;
    },
    A4(q) {
      if (/mayor alcance/.test(q)) { const T = /está √2/.test(q) ? Math.SQRT2 : v(q, /está ([\d,]+)√2/) * Math.SQRT2; let lo = 1, hi = 60; for (let i = 0; i < 40; i++) { const m = (lo + hi) / 2; if (vuelo(m * cos(45), m * sen(45), 0, { piso: true }).t < T) lo = m; else hi = m; } return lo; }
      const v0 = v(q, /a ([\d,]+) m\/s/), a = v(q, /con ([\d,]+)°/), c = [v0 * cos(a), v0 * sen(a), 0];
      if (/otro ángulo/.test(q)) { const R0 = vuelo(...c, { piso: true }).x; cerca2(v(q, /cae a ([\d,]+) m/), R0, 'el alcance del enunciado'); return 90 - a; }
      if (/altura máxima/.test(q)) return vuelo(...c, { cima: true }).y;
      return vuelo(...c, { piso: true }).x;
    },
    A5(q) {
      if (/partícula/.test(q)) { const m = q.match(/x = ([\d,]+) \+ ([\d,]+)t e y = ([\d,]+)t²/); return Math.hypot(n1(m[1]) + 2 * n1(m[2]), 4 * n1(m[3])); }
      if (/vuelve al piso/.test(q)) { const m = q.match(/x = ([\d,]+)t e y = ([\d,]+)t − 5t²/); return vuelo(n1(m[1]), n1(m[2]), 0, { piso: true }).x; }
      const m = q.match(/x = ([\d,]+)t e y = ([\d,]+)t /), t = v(q, /a los ([\d,]+) s/);
      return /al norte está/.test(q) ? n1(m[2]) * t : Math.hypot(n1(m[1]) * t, n1(m[2]) * t);
    },
  };
  for (const k of Object.keys(COMPRUEBA)) {
    const tipos = new Set();
    for (let s = 0; s < 400; s++) {
      const c = I(k).ahoraTu.generar(s), q = plano(c.pregunta), bien = c.opciones.filter(o => o.correcta);
      assert.equal(bien.length, 1); assert.ok(c.opciones.length >= 3, `${k} semilla ${s}: ${c.opciones.length} opciones`);
      cerca2(n1(bien[0].texto), COMPRUEBA[k](q), `${k} semilla ${s}: ${q}`);
      for (const o of c.opciones.filter(x => !x.correcta)) { assert.ok(o.error && o.siFuera, `${k} ${s}`); assert.notEqual(o.texto, bien[0].texto); }
      assert.ok(c.datos.length >= 1, `${k} ${s}: datos`); tipos.add(s % 4);
    }
    assert.equal(tipos.size, 4);
  }
  // Así se resuelve.
  for (let s = 0; s < 200; s++) {
    const r2 = I('A2').resuelve.generar(s), q2 = plano(r2.enunciado), a2 = plano(r2.respuesta);
    if (/qué ángulo/.test(q2)) { const p0 = vuelo(n1(q2.match(/a ([\d,]+) m\/s/)[1]), 0, n1(q2.match(/azotea de ([\d,]+) m/)[1]), { piso: true }); cerca2(-p0.vy / p0.vx, TAN[n1(a2.match(/Llega a ([\d,]+)°/)[1])], `A2 resuelve ${s}`); }
    else cerca2(n1(a2), vuelo(n1(q2.match(/a ([\d,]+) m\/s/)[1]), 0, 999, { pend: 1 }).t, `A2 resuelve ${s}`);
    const r3 = I('A3').resuelve.generar(s), q3 = plano(r3.enunciado), a3 = plano(r3.respuesta);
    const v3 = n1(q3.match(/a ([\d,]+) m\/s/)[1]), g3 = n1(q3.match(/con ([\d,]+)°/)[1]);
    if (/azotea/.test(q3)) cerca2(n1(a3), vuelo(v3 * cos(g3), v3 * sen(g3), n1(q3.match(/azotea de ([\d,]+) m/)[1]), { piso: true }).t, `A3 resuelve ${s}`);
    else cerca2(n1(a3), rapidez(vuelo(v3 * cos(g3), v3 * sen(g3), 0, { t: n1(q3.match(/mueve ([\d,]+) s/)[1]) })), `A3 resuelve ${s}`);
    const r4 = I('A4').resuelve.generar(s), q4 = plano(r4.enunciado), a4 = plano(r4.respuesta);
    if (/otro ángulo/.test(q4)) { const v0 = n1(a4); cerca2(vuelo(v0 * cos(37), v0 * sen(37), 0, { piso: true }).x, n1(q4.match(/cae a ([\d,]+) m/)[1]), `A4 resuelve ${s}`); }
    else {
      const v0 = n1(q4.match(/A ([\d,]+) m\/s/)[1]), g4 = n1(q4.match(/con ([\d,]+)°/)[1]), kk = /triple/.test(q4) ? 3 : /mitad/.test(q4) ? 0.5 : 1.5;
      cerca2(n1(a4), vuelo(kk * v0 * cos(g4), kk * v0 * sen(g4), 0, { piso: true }).x, `A4 resuelve ${s}`);
    }
    const r5 = I('A5').resuelve.generar(s), q5 = plano(r5.enunciado), a5 = plano(r5.respuesta), m5 = q5.match(/x = ([\d,]+)t e y = ([\d,]+)t − 5t²/);
    if (/qué altura/.test(q5)) cerca2(n1(a5), vuelo(n1(m5[1]), n1(m5[2]), 0, { x: n1(q5.match(/x = ([\d,]+) m\?/)[1]) }).y, `A5 resuelve ${s}`);
    else cerca2(n1(a5), rapidez(vuelo(n1(m5[1]), n1(m5[2]), 0, { t: 0 })), `A5 resuelve ${s}`);
    for (const r of [r2, r3, r4, r5]) assert.deepEqual(r.pasos.map(x => x.tipo), ['pide', 'datos', 'regla', 'cuentas', 'sentido']);
  }
});

test('con calidad: 2 simulada, la unidad pasa todas las reglas del validador', () => {
  const cat = require('../../../catalogo/cursos/fisica.json');
  const p = Teoria.problemas(Object.assign({}, def, { calidad: 2 }), { temas: cat.unidades.find(x => x.id === def.unidad).temas, semillas: 60 });
  assert.deepEqual(p, [], p.join('\n'));
});

// ---------- Auditoría y lectores en frío (19 nov): cada prueba falla con la versión de antes ----------
const ideaN = k => def.ideas[k - 1];
const textoDe = d => (d || []).map(plano).join(' | ');

test('auditoría: cada condición dice hacia dónde mide lo vertical (A1 y A2 hacia abajo; desde A3, hacia arriba) y A3 traduce el «±»', () => {
  assert.match(ideaN(1).regla.condicion, /h se mide hacia abajo/);
  assert.match(ideaN(2).regla.condicion, /se mide hacia abajo/);
  for (const k of [3, 4]) assert.match(ideaN(k).regla.condicion, /eje vertical hacia arriba/, `idea ${k}`);
  assert.match(ideaN(5).regla.condicion, /altura/);
  assert.match(ideaN(3).regla.condicion, /academia usa ± ½ · g · t²/);
  // y los datos con la velocidad vertical que baja con g lo dicen también
  for (const k of [3, 4, 5]) for (let s = 0; s < 120; s++) for (const d of [...(ideaN(k).ahoraTu.generar(s).datos || []), ...(ideaN(k).resuelve.generar(s).datos || [])]) {
    const t = plano(d); if (/v_y = v_0y −|\(v_y\)|v_y² =|vᵧ² =/.test(t) || /^Velocidad vertical/.test(t)) assert.match(t, /hacia arriba/, `idea ${k}: ${t}`);
  }
});

test('auditoría: los ejemplos de examen explican cada alternativa con las herramientas que se dan', () => {
  const e414 = ideaN(4).ejemplos[13], e512 = ideaN(5).ejemplos[11], e513 = ideaN(5).ejemplos[12];
  // 4.14: «24 · 4/3 y no divide entre 4» usaba H = R·tan θ/4, que la unidad no presenta; ahora A sale de tomar solo la subida
  assert.ok(!/divide entre 4/.test(plano(e414.solucion.map(x => x.texto))));
  { let lo = 1, hi = 80; for (let i = 0; i < 60; i++) { const m = (lo + hi) / 2; if (0.6 * m * (0.8 * m / 10) < 24) lo = m; else hi = m; } cerca(numAlt(e414.alternativas[0]), 0.64 * lo * lo / 20, '4.14 A'); }
  assert.ok(e414.datos.includes(e414.datos.find(d => /altura sobre la salida|eje hacia arriba: y =|y = v_0y/.test(plano(d)))), '4.14: la ecuación de y para el tiempo de vuelo');
  // 5.12: «lee g = 5» no daba 12,8; ahora D no eleva el tiempo al cuadrado
  assert.ok(!/lee g = 5/.test(plano(e512.solucion.map(x => x.texto))));
  cerca(numAlt(e512.alternativas[3]), 8 * 0.8 - 5 * 0.8, '5.12 D');
  assert.match(plano(e513.solucion.map(x => x.texto)), /no el 5/);
});

test('auditoría: el chorro dibujado cae donde dice su cota (4.12), y la figura de 2.7 abarca el vuelo', () => {
  for (const idea of def.ideas) for (const e of idea.ejemplos) {
    const d = e.figura && e.figura.datos; if (!d || d.plataforma !== 'manguera' || !d.cotaAlcance) continue;
    cerca(2 * d.vx * d.vy / 10, d.cotaAlcance.hasta, `«${e.titulo}»`);
  }
  const d27 = ideaN(2).ejemplos[6].figura.datos; assert.ok(d27.ancho >= d27.v0 * 4, '2.7: cae a 160 m');
});

test('auditoría: una figura que pide una longitud con «?» y trae otra con número no se dibuja a escala', () => {
  let vistas = 0;
  const mira = (fig, donde) => {
    if (!fig || fig.pieza !== 'fis-tiro' || fig.datos.vista === 'plano') return;
    const d = fig.datos, q = [d.cotaAlto, d.cotaAlcance, d.cotaH].some(c => c && c.texto === '?'), n = [d.cotaAlto, d.cotaAlcance, d.cotaH].some(c => c && c.texto && c.texto !== '?' && /\d/.test(c.texto));
    if (!(q && n)) return;
    vistas++;
    const g = P.geometria(d, fig.estado || {});
    assert.ok(g.sinEscala && g.rotulos.some(r => r.texto === 'Dibujo sin escala'), `${donde}: se mediría la respuesta`);
  };
  def.ideas.forEach((idea, i) => { idea.ejemplos.forEach(e => mira(e.figura, `idea ${i + 1} «${e.titulo}»`)); for (let s = 0; s < 60; s++) { mira(idea.ahoraTu.generar(s).dibujo, `idea ${i + 1} ahora ${s}`); mira(idea.resuelve.generar(s).dibujo, `idea ${i + 1} resuelve ${s}`); } });
  assert.ok(vistas >= 20, `hay figuras así: ${vistas}`);
});

test('lectores en frío: la lectura de A2 dice que es la misión, y la de A5 usa el mismo instante que muestra', () => {
  assert.match(plano(ideaN(2).juega.lectura({ v0: 8, t: 0.21 })), /^Misión \(2 s\)/);
  const n1 = x => num(x);
  for (const t of [0.625, 1.0125, 3.3375, 7.4875]) {
    const l = plano(ideaN(5).juega.lectura({ vx: 2, vy: 3, t })), m = l.match(/En ([\d,]+) s: ([\d,]+) m al este, ([\d,]+) m al norte/);
    const tt = n1(m[1]); assert.equal(m[2], Kit.formatear(2 * tt, 2)); assert.equal(m[3], Kit.formatear(3 * tt, 2), l);
  }
});

test('lectores en frío: la leyenda dice cuándo aparece lo tenue; A2 nombra v_x y v_y y las rotula en el juego', () => {
  for (const k of [1, 5]) for (const x of ideaN(k).juega.leyenda.filter(x => /tenue|punto violeta/.test(String(x.s)))) assert.match(x.t, /reloj/, `idea ${k}: ${x.s}`);
  const ley = ideaN(2).juega.leyenda.map(x => plano(x.s)).join(' ');
  assert.match(ley, /\bvx\b/); assert.match(ley, /\bvy\b/);
  const g = P.geometria(ideaN(2).juega.dibujo({ v0: 12, t: 2.2 }).datos);
  assert.deepEqual(['v_x', 'v_y'].map(t => g.rotulos.some(r => r.texto === t)), [true, true]);
});

test('lectores en frío: la regla de A5 es la misma en los dos ejes y dice que d es al origen; «Dos drones» no habla del origen', () => {
  const ec = plano(ideaN(5).regla.ecuacion);
  assert.match(ec, /½ · ax/); assert.match(ec, /½ · ay/); assert.match(plano(ideaN(5).regla.ecuacion.find(x => x && x.llave)), /d/);
  assert.match(ideaN(5).regla.condicion, /distancia al origen/);
  const drones = ideaN(5).ejemplos.find(e => e.titulo === 'Dos drones');
  assert.ok(!/origen/.test(textoDe(drones.datos)), textoDe(drones.datos));
  // «Así se resuelve» avisa que la vista cambia (de arriba, en el dron; de costado, en la pelota)
  for (let s = 0; s < 6; s++) assert.match(plano(ideaN(5).resuelve.generar(s).pasos[1].texto), /de costado/);
});

test('lectores en frío: los Datos no responden la conceptual (2.14), traen vₓ = v₀ cuando el resuelto la usa (2.12) y presentan p, q y r', () => {
  const e214 = ideaN(2).ejemplos[13], e212 = ideaN(2).ejemplos[11];
  assert.ok(!/Aceleración en todo el vuelo/.test(textoDe(e214.datos)));
  assert.match(textoDe(e212.datos), /vx = v0/);
  for (const idea of def.ideas) for (const e of idea.ejemplos) for (const d of e.datos || []) if (/p · t²/.test(plano(d))) assert.match(plano(d), /p, q, r/);
});

test('auditoría: el glosario de A4 no trae la pareja de la misión (30° y 60°) ni el paso de «Mira» (5 m/s en 0,5 s)', () => {
  const g4 = def.glosario.filter(g => ['tiempo de subida', 'alcance máximo', 'ángulos complementarios'].includes(g.termino));
  const t = g4.map(g => [g.def, g.simple, ...g.ejemplos].join(' ')).join(' ');
  assert.ok(!/30° y 60°|30° o a 60°/.test(t), t); assert.ok(!/5 m\/s, llega arriba en medio segundo/.test(t));
});

test('auditoría: nada se patea a más de 25 m/s (decisión 14) y ninguna altura de «Ahora tú» sale negativa', () => {
  for (const k of [3, 4]) for (let s = 0; s < 400; s++) for (const c of [ideaN(k).ahoraTu.generar(s), ideaN(k).resuelve.generar(s)]) {
    const t = plano(c.pregunta || c.enunciado), m = t.match(/(?:patea|pateada|pelota sale del piso|pelota sale)[^.?]*? a ([\d,]+) m\/s/);
    if (m) assert.ok(num(m[1]) <= 25, `idea ${k}: ${t}`);
    if (c.opciones && /qué altura/.test(t)) for (const o of c.opciones) assert.ok(!/−/.test(o.texto), `idea ${k} ${s}: ${o.texto}`);
  }
  for (const idea of def.ideas) for (const e of idea.ejemplos) { const t = plano(e.enunciado), m = t.match(/(?:patea|pelota)[^.?]*? a ([\d,]+) m\/s/); if (m) assert.ok(num(m[1]) <= 25, `«${e.titulo}»`); }
});

test('lectores en frío: en las reglas, cada relación va en su renglón (no se parte «v =» ni «sen θ»)', () => {
  for (const idea of def.ideas) {
    const ec = idea.regla.ecuacion; if (ec.filter(x => typeof x === 'string' && /^\s{2,}·\s{2,}$/.test(x)).length === 0) assert.fail(`${idea.id}: sin separador de relaciones`);
    assert.ok(!ec.some(x => typeof x === 'string' && /;\s{2,}/.test(x)), `${idea.id}: «;» en lugar del separador`);
  }
  assert.ok(!/sen θ|cos θ/.test(JSON.stringify(ideaN(3).regla.ecuacion)), 'sen y θ con espacio duro');
});

// ---------- igualdad-falsa (Etapa 6, 19 nov) ----------
// Falla con la versión de antes: «R = 5 · 1,73 = 8,66 m» (5 · 1,73 da 8,65) en el ejemplo 15 y en «Ahora tú» (semillas
// 61 y 77: «10 · 3,46 = 34,64 m»), y «R = 3 · 3 · 12,47 = 112,24 m» en «Así se resuelve» (semilla 151). La cuenta que se
// escribe da el resultado con los números que se ven: el factor que no es exacto con dos decimales va con tres (√3 ≈
// 1,732) y el dato redondeado del enunciado entra tal como se ve.
test('igualdad-falsa: en «Altura máxima y alcance», cada producto escrito da su resultado con los números que se ven', () => {
  const i = I('A4');
  const productos = t => [...t.matchAll(/(\d[\d,]*(?: · \d[\d,]*)+) = (\d[\d,]*) m\b/g)];
  const revisar = (t, que) => {
    const ps = productos(t);
    for (const [, cuenta, res] of ps) {
      const d = (res.split(',')[1] || '').length, v = cuenta.split(' · ').reduce((a, x) => a * num(x), 1);
      assert.ok(Math.abs(v - num(res)) <= 0.5 * 10 ** -d + 1e-9, `${que}: «${cuenta} = ${res} m» (la cuenta da ${v})`);
    }
    return ps.length;
  };
  assert.ok(revisar(plano(i.ejemplos[14].solucion.map(p => p.ecuacion)), 'ejemplo 15') >= 3, 'ejemplo 15: los tres alcances');
  let vistos = 0, con3 = 0;
  for (let s = 0; s < 400; s++) {
    const a = i.ahoraTu.generar(s), r = i.resuelve.generar(s);
    if (s % 4 === 1) { const t = plano(a.solucion.ecuacion); vistos += revisar(t, `ahoraTu ${s}`); if (/,\d{3} =/.test(t)) con3++; }
    if (s % 2 === 1) vistos += revisar(plano(r.pasos.map(p => p.ecuacion)), `resuelve ${s}`);
  }
  assert.ok(vistos >= 250 && con3 > 0, `${vistos} cuentas, ${con3} con tres decimales`);
  assert.match(plano(i.resuelve.generar(151).respuesta), /112,23 m/, 'semilla 151: 3 · 3 · 12,47, con el 12,47 del enunciado');
  const falsas = Teoria.pendientes(def, { semillas: 200 }).concat(Teoria.problemas(def, { semillas: 200 })).filter(x => /\[igualdad-falsa\]/.test(x));
  assert.deepEqual(falsas, []);
});

// Verificación de la pasada de redacción (26 nov 2026). En «Ahora tú» del ángulo complementario, la explicación de
// «mitad» decía «a la mitad cae más cerca» (falso con 75°: a 37,5° cae más lejos) y la de «doble», «sube más y avanza
// menos» (falso con 15° y 30°). Lo que vale en todas las semillas es que no completan 90° con el ángulo dado.
test('redacción: «mitad» y «doble» del ángulo complementario dicen algo cierto en todas las semillas', () => {
  const plano = x => (x == null ? '' : typeof x === 'string' ? x : Array.isArray(x) ? x.map(plano).join('') : typeof x === 'object' ? plano(x.t ?? x.texto ?? '') : String(x));
  const alcance = g => Math.sin(2 * g * Math.PI / 180);
  let vistos = 0;
  for (const i of def.ideas) for (let s = 0; s < 400; s++) {
    const a = i.ahoraTu.generar(s), q = plano(a.pregunta), m = q.match(/con (\d+(?:,\d+)?)° y cae a .*otro ángulo/);
    if (!m) continue;
    const b = Number(m[1].replace(',', '.'));
    for (const o of a.opciones || []) {
      if (!['mitad', 'doble'].includes(o.id)) continue;
      vistos++;
      const g = Number(plano(o.texto).replace('°', '').replace(',', '.'));
      assert.notEqual(g + b, 90, `semilla ${s}: ${g}° sí completa 90° con ${b}°`);
      assert.doesNotMatch(o.siFuera, /más cerca|más lejos|avanza menos/, `semilla ${s}: ${o.siFuera}`);
      // y es cierto que cae en otro sitio
      assert.ok(Math.abs(alcance(g) - alcance(b)) > 1e-6, `semilla ${s}: ${g}° y ${b}° caen en el mismo sitio`);
    }
  }
  assert.ok(vistos > 10, `solo ${vistos}`);
});

// Verificación (26 nov): la regla 2 decía que la rapidez es tangente a la trayectoria; tangente es la velocidad (la
// rapidez es solo un número). Y en A3, «subida» (la mitad del vuelo) decía «Bien el camino», y ese valor no sale del
// camino de la pregunta.
test('redacción: la tangente es de la velocidad y «subida» no elogia un camino que no da su valor', () => {
  const r2 = def.ideas[1].regla.texto;
  assert.doesNotMatch(r2, /rapidez[^.]*es tangente/);
  assert.match(r2, /velocidad, tangente a la trayectoria/);
  for (const i of def.ideas) for (let s = 0; s < 200; s++)
    for (const o of i.ahoraTu.generar(s).opciones || []) if (o.siFuera) assert.doesNotMatch(o.siFuera, /^Bien el camino/, `${i.id} ${s}`);
});
