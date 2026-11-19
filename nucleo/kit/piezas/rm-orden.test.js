// Pruebas de la pieza «rm-orden» (fase 3: también las escenas edificio, talla, sobres, mesa y las barras): las comunes de las piezas de la rama Lógica (rm-pruebas.js: limpia, pura, de alto fijo,
// marcada como dibujo de prueba, todo dentro del lienzo con 4 de margen y ningún rótulo encima de otro ni de un trazo,
// con números y no a ojo; docs/molde-unidad.md §6), en las muestras de abajo y en todas las figuras de la idea 1 de
// «Ordenamiento de información» que usan la pieza (Lee, el juego en toda su grilla, la predicción, «Mira» paso a paso,
// la regla, los 15 ejemplos y «Así se resuelve» y «Ahora tú» en 200 semillas). Además: los papeles de color (violeta solo
// en lo seguro; lo tachado, en gris con su raya), los órdenes alineados con los puestos y los nombres dentro de su casilla.
const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const T = require('../trazo.js');
const Teoria = require('../../teoria.js');
const P = require('./rm-orden.js');
const R = require('./rm-pruebas.js');

const N4 = ['Ana', 'Beto', 'Ciro', 'Dina'];
const SEIS = [['Ana', 'Beto', 'Ciro', 'Dina'], ['Ana', 'Ciro', 'Beto', 'Dina'], ['Beto', 'Ana', 'Ciro', 'Dina'], ['Beto', 'Ciro', 'Ana', 'Dina'], ['Ciro', 'Ana', 'Beto', 'Dina'], ['Ciro', 'Beto', 'Ana', 'Dina']];
const MUESTRAS = [
  { escena: 'banca', panel: false, puestos: 4, nombres: N4, sentados: [{ p: 3, t: 'Dina' }] },
  { escena: 'banca', puestos: 4, nombres: N4, sentados: [{ p: 3, t: 'Dina' }], ordenes: SEIS.map(a => ({ a })), pistas: [], lineas: 3 },
  { escena: 'banca', puestos: 4, nombres: N4, sentados: [{ p: 3, t: 'Dina' }, { p: 2, t: 'Beto', seguro: true, desde: 2 }],
    ordenes: SEIS.map((a, i) => ({ a, fuera: [1, 4].includes(i) ? false : i % 2 ? 1 : 2 })), fijos: [{ c: 2, desde: 2 }],
    pistas: [{ t: 'Ana está a la izquierda de Beto.' }, { t: 'Ciro no está junto a Dina.', nueva: true, desde: 2 }], lineas: 3, nota: [{ t: 'Quedan 2 órdenes', desde: 2 }] },
  { escena: 'banca', puestos: 4, nombres: N4, sentados: [], pistas: [{ t: 'Ciro está junto a Ana.' }, { t: 'Ciro está junto a Beto.' }], lineas: 2 },
  { escena: 'banca', puestos: 4, nombres: N4, sentados: [0, 1, 2, 3].map(p => ({ p, t: ['Ana', 'Ciro', 'Beto', 'Dina'][p], seguro: p < 3 })),
    ordenes: [{ a: ['Ana', { t: 'Ciro', seguro: 3 }, 'Beto', { t: 'Dina', seguro: 4 }], desde: 1 }, { a: ['Dina', 'Beto', { t: 'Ciro', seguro: true }, 'Ana'], desde: 2 }] },
  { escena: 'banca', puestos: 3, nombres: ['Ana', 'Beto', 'Ciro'], sentados: [{ p: 2, t: 'Beto' }] },
  { escena: 'banca', puestos: 5, nombres: ['Ana', 'Beto', 'Ciro', 'Dina', 'Eva'], sentados: [{ p: 4, t: 'Eva' }, { p: 3, t: 'Ana', seguro: true }, { p: 0, t: 'Dina', seguro: true }] },
  { puestos: 4, nombres: ['Lucho', 'Maru', 'Teo', 'Vilma'], fila: [null, 'Lucho', null, null] },
  { puestos: 5, nombres: ['Rosa', 'Iván', 'Nora', 'Leo', 'Maru'], fila: [null, { t: 'Rosa', posible: true }, { t: 'Rosa', posible: true }, { t: 'Rosa', posible: true }, null],
    ordenes: [{ a: ['Maru', 'Rosa', 'Iván', 'Nora', 'Leo'] }, { a: ['Maru', 'Rosa', 'Leo', 'Iván', 'Nora'] }, { a: ['Leo', 'Rosa', 'Maru', 'Iván', 'Nora'], fuera: true }], fijos: [{ c: 0 }, { c: 1 }],
    pistas: [{ t: 'Una pista larga que tiene que partirse en dos renglones para caber en el ancho de la figura.' }], lineas: 2 },
  { puestos: 6, nombres: ['Ana', 'Beto', 'Ciro', 'Dina', 'Eva', 'Fito'], fila: [{ t: 'Dina', posible: true }, null, null, null, null, { t: 'Dina', posible: true }],
    ordenes: [{ a: ['Beto', 'Ana', 'Fito', 'Eva', 'Ciro', 'Dina'] }], fijos: [0, 1, 2, 3, 4, 5].map(c => ({ c })) },
  { puestos: 3, nombres: ['Ana', 'Beto', 'Ciro'], fila: [null, null, null], ordenes: [['Ana', 'Beto', 'Ciro'], ['Ana', 'Ciro', 'Beto'], ['Beto', 'Ana', 'Ciro'], ['Beto', 'Ciro', 'Ana'], ['Ciro', 'Ana', 'Beto'], ['Ciro', 'Beto', 'Ana']].map(a => ({ a })) },
  { titulo: 'Ana, en el puesto 2, está…', tiras: [
    { rotulo: '… a la izquierda de Beto', celdas: [null, 'Ana', { t: 'Beto', posible: true }, { t: 'Beto', posible: true }] },
    { rotulo: '… junto a Beto', celdas: [{ t: 'Beto', posible: true }, 'Ana', { t: 'Beto', posible: true }, null] },
    { rotulo: '… inmediatamente a la izquierda de Beto', celdas: [null, 'Ana', { t: 'Beto', seguro: true }, null] }] },
];

// Todas las figuras de la unidad que usan la pieza: { donde, datos, estado, antes }. antes: la ve el alumno antes de
// responder (Lee, el planteamiento de Predice, los ejemplos y los enunciados de los ejercicios).
function deLaTeoria(semillas = 200) {
  const def = require('../../../contenido/teoria/razonamiento-matematico/ordenamiento-de-informacion.js');
  for (const r of def.requiere) require(path.join(__dirname, '..', '..', '..', r));
  const out = [], add = (donde, pieza, dib, antes) => { if (dib && dib.datos && pieza === P.id) out.push({ donde, datos: dib.datos, estado: dib.estado || {}, antes: !!antes }); };
  for (const idea of def.ideas) {
    const p = idea.pieza;
    for (const [i, t] of ((idea.lee && idea.lee.tarjetas) || []).entries()) add(`${idea.id} lee ${i + 1}`, t.pieza || p, t.dibujo, true);
    const j = idea.juega, base = Teoria.inicio(j);
    for (const v of Teoria.grilla(j.controles || [])) add(`${idea.id} juega ${JSON.stringify(v)}`, j.pieza || p, j.dibujo(Object.assign({}, base, v)));
    add(`${idea.id} predice`, idea.predice.pieza || p, idea.predice.dibujo, true);
    add(`${idea.id} revelar`, idea.predice.pieza || p, idea.predice.revelar);
    for (const [i, paso] of idea.mira.pasos.entries()) add(`${idea.id} mira ${i + 1}`, idea.mira.pieza || p, { datos: idea.mira.datos, estado: Object.assign({}, idea.mira.base || {}, paso.estado) });
    const fr = Teoria.figuraRegla(idea);
    add(`${idea.id} regla`, fr.pieza, fr);
    for (const [i, e] of (idea.ejemplos || []).entries()) if (e.figura) add(`${idea.id} ejemplo ${i + 1}`, e.figura.pieza, e.figura, true);
    if ((idea.ahoraTu.pieza || p) !== P.id) continue;
    for (let s = 0; s < semillas; s++) {
      const a = idea.ahoraTu.generar(s);
      add(`${idea.id} ahora tú ${s}`, idea.ahoraTu.pieza || p, a.dibujo, true);
      if (a.solucion) add(`${idea.id} ahora tú ${s} solución`, idea.ahoraTu.pieza || p, a.solucion.dibujo);
      if (idea.resuelve) {
        const r = idea.resuelve.generar(s);
        add(`${idea.id} resuelve ${s}`, idea.resuelve.pieza || p, r.dibujo, true);
        for (const [k, x] of r.pasos.entries()) add(`${idea.id} resuelve ${s} paso ${k + 1}`, idea.resuelve.pieza || p, x.dibujo);
      }
    }
  }
  for (const m of def.laboratorio || []) {
    if (m.pieza !== P.id) continue;
    const base = Teoria.inicio(m), casos = Teoria.grilla(m.controles || []);
    for (let i = 0; i < casos.length; i += Math.max(1, Math.floor(casos.length / 150))) add(`mesa ${m.id} ${JSON.stringify(casos[i])}`, m.pieza, m.dibujo(Object.assign({}, base, casos[i])));
  }
  return out;
}
const TEORIA = deLaTeoria(60);
const TODAS = MUESTRAS.map((d, k) => ({ donde: `muestra ${k + 1}`, datos: d, estado: {} })).concat(TEORIA);
const CORTES = [0, 1, 2, 3, 4, 5];

R.comunes(P, TODAS, { minTeoria: 800, cortes: CORTES });

test('papeles de color fijos: violeta solo en lo seguro; lo tachado, en gris (tinta al 55 %) con su raya', () => {
  assert.deepEqual(P.PAPELES, { seguro: 'f', descartado: 'tenue', amarra: 'tinta', posible: 'tinta' });
  for (const { donde, datos } of TODAS) for (const c of [0, 5]) {
    const s = P.dibujar(datos, { corte: c });
    // Naranja (desde quién) y turquesa (hacia dónde) solo en la mesa; verde y carmín, nunca.
    assert.ok(!(datos.escena === 'mesa' ? /var\(--c-[dh]\)/ : /var\(--c-[oidh]\)/).test(s), `${donde}: un color que no es de la paleta`);
    // Cada violeta es el marco de una casilla segura, su nombre o el nombre de quien se sentó por deducción.
    const violetas = (s.match(/var\(--c-f\)/g) || []).length, marcos = (s.match(/data-marca="seguro"/g) || []).length, nombres = (s.match(/data-sentado="seguro"/g) || []).length;
    assert.equal(violetas, 2 * marcos + nombres, `${donde}: violeta fuera de lo seguro`);
    // Un orden tachado va atenuado, lleva su raya y ninguna casilla suya es segura.
    for (const [m] of s.matchAll(/<g class="kit-aparece" data-orden="fuera"[^>]*>.*?<\/g>/g)) {
      assert.match(m, /opacity="0.55"/, donde);
      assert.match(m, /data-tacha="si"/, donde);
      assert.ok(!/var\(--c-f\)/.test(m), `${donde}: violeta en un orden tachado`);
    }
    for (const [m] of s.matchAll(/<g class="kit-aparece" data-orden="queda"[^>]*>.*?<\/g>/g)) assert.ok(!/data-tacha/.test(m), `${donde}: raya en un orden que queda`);
  }
});

test('lo que el alumno ve antes de responder no trae violeta ni órdenes tachados (ninguna figura delata la respuesta)', () => {
  const antes = TEORIA.filter(f => f.antes);
  assert.ok(antes.length > 400, `${antes.length} figuras`);
  for (const { donde, datos, estado } of antes) {
    const s = P.dibujar(datos, estado);
    assert.ok(!/var\(--c-f\)/.test(s), `${donde}: violeta antes de responder`);
    assert.ok(!/data-orden="fuera"/.test(s), `${donde}: un orden tachado antes de responder`);
  }
});

test('cada orden va alineado con los puestos y cada nombre cabe en su casilla', () => {
  for (const { donde, datos } of TODAS) {
    if (datos.tiras || datos.panel === false || datos.barras || ['edificio', 'talla', 'mesa', 'sobres'].includes(datos.escena)) continue;
    const g = P.geometria(datos), s = P.dibujar(datos, { corte: 5 });
    // Los números de los puestos están centrados sobre (o bajo) su columna.
    for (let k = 0; k < g.N; k++) {
      const m = s.match(new RegExp(`<text[^>]* x="([\\d.]+)" y="${T.n(g.yNum)}"[^>]*>${k + 1}</text>`));
      assert.ok(m && Math.abs(+m[1] - g.centro(k)) < 0.01, `${donde}: el número del puesto ${k + 1} no está sobre su columna`);
    }
    for (const o of datos.ordenes || []) o.a.forEach(x => {
      const t = typeof x === 'object' && x ? x.t : x;
      assert.ok(T.ancho(t, 14, 700) <= g.sw - 2, `${donde}: «${t}» no cabe en una casilla de ${g.sw.toFixed(1)}`);
    });
    for (const x of datos.fila || []) if (x) assert.ok(T.ancho(typeof x === 'object' ? x.t : x, 14, 700) <= g.sw - 2, `${donde}: «${typeof x === 'object' ? x.t : x}» no cabe`);
    assert.ok(g.x0 >= 4 && g.x1 <= 316, `${donde}: la fila se sale del lienzo`);
  }
});

test('la escena de la banca: quien tiene puesto está sentado; quien no, espera de pie (o no se dibuja, si no cabe)', () => {
  const d = MUESTRAS[2];
  const s0 = P.dibujar(d, { corte: 0 }), s2 = P.dibujar(d, { corte: 2 });
  assert.equal((s0.match(/data-sentado=/g) || []).length, 1);          // solo Dina, el dato
  assert.equal((s2.match(/data-sentado="seguro"/g) || []).length, 1);  // Beto se sienta cuando su puesto es seguro
  assert.match(P.alt(d), /Banca de 4 puestos.*Dina en el puesto 4.*esperan de pie Ana y Ciro/);
  assert.match(P.alt(MUESTRAS[7]), /Fila de 4 puestos.*Lucho en el puesto 2/);
  assert.match(P.alt(MUESTRAS[11]), /junto a Beto: puesto 1, Beto \(posible\); puesto 2, Ana; puesto 3, Beto \(posible\)/);
});

// ---------- Auditoría del 19 nov (rutinas/auditoria/razonamiento-matematico.ordenamiento-de-informacion.md) ----------
test('auditoría A1: cada línea «frente a» va de su silla a la de enfrente y cruza la mesa', () => {
  let n = 0;
  for (const f of deLaTeoria(40)) {
    if (f.datos.escena !== 'mesa' || !(f.datos.frente || []).length) continue;
    const g = P.geometria(f.datos), svg = P.dibujar(f.datos, f.estado);
    const lineas = [...svg.matchAll(/<line[^>]*data-frente="si"[^>]*x1="([-\d.]+)" y1="([-\d.]+)" x2="([-\d.]+)" y2="([-\d.]+)"/g)].map(m => m.slice(1).map(Number));
    const vistas = f.datos.frente.filter(x => (x.desde || 0) <= (f.estado.corte === undefined ? Infinity : f.estado.corte));
    assert.equal(lineas.length, vistas.length, f.donde);
    const cerca = (x, y) => [...Array(g.N).keys()].sort((a, b) => Math.hypot(g.silla(a).x - x, g.silla(a).y - y) - Math.hypot(g.silla(b).x - x, g.silla(b).y - y))[0];
    lineas.forEach(([x1, y1, x2, y2], i) => {
      const fr = vistas[i];
      assert.deepEqual([cerca(x1, y1), cerca(x2, y2)].sort(), [fr.de, fr.a].sort(), `${f.donde}: la línea ${i + 1} no llega a sus sillas`);
      if (g.cuad) assert.ok(Math.hypot(x2 - x1, y2 - y1) > 2 * g.L, `${f.donde}: la línea ${i + 1} no cruza la mesa`);
      n++;
    });
  }
  assert.ok(n >= 10, `${n}`);
});

test('auditoría M6: quien espera de pie va centrado sobre la mesa, no a un lado', () => {
  const d = { escena: 'mesa', forma: 'redonda', sillas: 6, sentados: [{ s: 3, t: 'Dina', ref: true }], espera: ['Eva'] };
  const m = P.dibujar(d, {}).match(/<text[^>]*x="([\d.]+)"[^>]*>De pie: Eva</);
  assert.ok(m);
  assert.ok(Math.abs(+m[1] - 160) < 1);
});

test('auditoría M9: los dados muestran sus puntos y las tarjetas no llevan solapa de sobre; sin tallímetro si se pide', () => {
  const dado = P.dibujar({ escena: 'sobres', forma: 'dado', sobres: ['2', '4', '6'], columnas: ['Rosa', 'Iván', 'Nora'] }, {});
  assert.equal((dado.match(/<circle[^>]*r="4"/g) || []).length, 12);
  assert.match(dado, /data-objeto="dados"/);
  const tarj = P.dibujar({ escena: 'sobres', forma: 'tarjeta', sobres: ['14 años', '17 años'], columnas: ['Sara', 'Gino'] }, {});
  assert.ok(!/<path d="M[^"]*L[^"]*L[^"]*" fill="none"/.test(tarj), 'sin la solapa');
  assert.match(tarj, /data-objeto="tarjetas"/);
  const con = P.dibujar({ escena: 'talla', nombres: ['Ana', 'Beto'], casos: [] }, {}), sin = P.dibujar({ escena: 'talla', tallimetro: false, nombres: ['Ana', 'Beto'], casos: [] }, {});
  assert.ok(sin.length < con.length);
  assert.match(P.alt({ escena: 'talla', tallimetro: false, nombres: ['Ana', 'Beto'], casos: [] }), /^Personas que se comparan/);
});
