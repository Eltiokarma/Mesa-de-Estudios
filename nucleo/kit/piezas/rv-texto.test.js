// Pruebas de la pieza «rv-texto»: cada trozo cabe en el ancho, la marca cae bajo su trozo, el alto no cambia con el
// estado, sin NaN ni colores fijos, texto de 14 o más, y el texto alternativo trae el texto entero.
const test = require('node:test');
const assert = require('node:assert/strict');
const P = require('./rv-texto.js');

const datos = {
  secciones: [
    { id: 's1', titulo: 'Texto', modo: 'parrafo', fragmentos: [
      { id: 'a', t: 'La biblioteca del barrio amplió su horario hasta las ocho de la noche.' },
      { id: 'b', t: 'Además, ahora presta libros por dos semanas en lugar de una.' },
      { id: 'c', hueco: true, reserva: 'sin embargo,' },
      { id: 'd', t: 'pocos vecinos conocen estos cambios.' },
    ] },
    { id: 's2', modo: 'lista', fragmentos: [{ id: 'e', t: 'Primera oración de una lista numerada.' }, { id: 'f', t: 'Segunda oración.' }] },
    { id: 's3', titulo: 'Opción', modo: 'tarjeta', fragmentos: [{ id: 'g', t: 'Todos los vecinos usan la biblioteca.' }] },
  ],
};
const estados = [
  {}, { marcas: { a: 'i', b: 'o', d: 'd', g: 'h' } }, { tachar: ['b'], tapar: ['a'] },
  { huecos: { c: 'sin embargo,' }, sellos: { s3: { t: 'No se sabe', c: 'o' } }, nuevo: ['c', 's3'] },
];

test('cada trozo cabe en el lienzo y las marcas caen bajo su trozo', () => {
  const L = P.disponer(datos);
  for (const s of L.secciones) for (const t of s.trozos) {
    assert.ok(t.x >= P.constantes.PAD - 0.01, `${t.texto} empieza fuera`);
    assert.ok(t.x + t.w <= P.constantes.W - P.constantes.PAD + 0.01, `${t.texto} se sale por la derecha`);
  }
  const svg = P.dibujar(datos, { marcas: { a: 'i' } });
  const trozosA = L.secciones[0].trozos.filter(t => t.id === 'a');
  const subs = [...svg.matchAll(/class="rv-sub" x1="([\d.]+)" y1="[\d.]+" x2="([\d.]+)"/g)].map(m => [+m[1], +m[2]]);
  assert.equal(subs.length, trozosA.length, 'un subrayado por renglón del fragmento');
  subs.forEach(([x1, x2], k) => { assert.ok(Math.abs(x1 - trozosA[k].x) < 0.01); assert.ok(Math.abs(x2 - trozosA[k].x - trozosA[k].w) < 0.01); });
});

test('la lista numera y el párrafo corre: las oraciones de la lista empiezan en renglón propio', () => {
  const L = P.disponer(datos);
  const lista = L.secciones[1].trozos;
  assert.deepEqual(lista.filter(t => t.num).map(t => t.texto), ['1', '2']);
  const ys = lista.filter(t => !t.num).map(t => t.y);
  assert.ok(ys[1] > ys[0]);
});

test('el alto no cambia con el estado; sin NaN, colores fijos ni texto chico; puro', () => {
  const altos = new Set();
  for (const e of estados) {
    const s = P.dibujar(datos, e);
    assert.equal(s, P.dibujar(datos, e));
    assert.ok(!/NaN|undefined|null|Infinity/.test(s));
    assert.ok(!/#[0-9a-f]{3,6}\b/i.test(s));
    assert.ok(!/<script|\son[a-z]+\s*=|\sid=/i.test(s));
    for (const [, t] of s.matchAll(/font-size="([\d.]+)"/g)) assert.ok(+t >= 14);
    for (const [, c] of s.matchAll(/var\(--c-([a-z])\)/g)) assert.ok(['i', 'o', 'h', 'd'].includes(c));
    altos.add(s.match(/viewBox="0 0 320 ([\d.]+)"/)[1]);
  }
  assert.equal(altos.size, 1);
});

test('el color no es la única señal: cada color de marca tiene su propio trazo', () => {
  const s = P.dibujar(datos, { marcas: { a: 'i', b: 'o', d: 'd' } });
  const raya = c => (s.match(new RegExp(`class="rv-sub"[^>]*var\\(--c-${c}\\)[^>]*>`)) || [''])[0].match(/stroke-dasharray="([^"]+)"/);
  assert.equal(raya('i'), null);
  assert.equal(raya('o')[1], '7 4');
  assert.equal(raya('d')[1], '1 5');
});

test('el texto alternativo es el texto entero, con el hueco nombrado', () => {
  const a = P.alt(datos);
  assert.match(a, /amplió su horario hasta las ocho/);
  assert.match(a, /espacio en blanco/);
  assert.match(a, /1\. Primera oración/);
});

test('en una lista, «junto» sigue en el mismo renglón y no lleva número', () => {
  const L = P.disponer({ secciones: [{ id: 'm', modo: 'lista', fragmentos: [{ id: 'a', t: 'plantas → usan → luz' }, { id: 'b', t: 'plantas →' }, { id: 'c', hueco: true, junto: true, reserva: 'liberan' }, { id: 'd', junto: true, t: '→ oxígeno' }] }] });
  const tr = L.secciones[0].trozos;
  assert.deepEqual(tr.filter(t => t.num).map(t => t.texto), ['1', '2']);
  const y = id => tr.find(t => t.id === id).y;
  assert.equal(y('c'), y('b')); assert.equal(y('d'), y('b')); assert.ok(y('b') > y('a'));
});

test('ancla y cercana: la manija de cada fragmento cae en el lienzo y la frase más cercana a su manija es ella misma', () => {
  const L = P.disponer(datos);
  const ids = ['a', 'b', 'd', 'e', 'f', 'g'];
  for (const id of ids) {
    const p = P.ancla(datos, id);
    assert.ok(p && p.x >= 0 && p.x <= P.constantes.W && p.y >= 0 && p.y <= L.alto, `${id} fuera`);
    assert.equal(P.cercana(datos, p, ids), id);
  }
  // En una lista, la manija va sobre el número de la oración (no tapa sus palabras).
  const num = L.secciones[1].trozos.find(t => t.num && t.texto === '1');
  assert.ok(Math.abs(P.ancla(datos, 'e').x - num.x - 5) < 0.01);
  assert.equal(P.ancla(datos, 'nada'), null);
  // Lejos de todo, igual elige una de las pedidas.
  assert.ok(['e', 'f'].includes(P.cercana(datos, { x: 0, y: 1000 }, ['e', 'f'])));
});

test('esquinaLibre: la primera sección lleva su sello en renglón propio, lejos de la esquina; sin el dato, nada cambia', () => {
  const sin = P.dibujar(datos, { sellos: { s1: { t: 'Lo dice', c: 'i' } } });
  const con = Object.assign({ esquinaLibre: true }, datos);
  const svg = P.dibujar(con, { sellos: { s1: { t: 'Lo dice', c: 'i' } } });
  const alto = s => +s.match(/viewBox="0 0 320 ([\d.]+)"/)[1];
  assert.equal(alto(svg), alto(sin) + P.constantes.LH);
  assert.equal(alto(svg), alto(P.dibujar(con, {})), 'el alto no depende del sello');
  const r = svg.match(/class="rv-sello"><rect x="([\d.]+)" y="([\d.]+)" width="([\d.]+)"/);
  assert.ok(+r[1] + +r[3] < 320 - 56, 'el sello deja libre la esquina de la lupa');
  assert.ok(+r[2] > 20, 'el sello va bajo la cabecera');
  // Ancla y cercana siguen coincidiendo con el texto desplazado.
  for (const id of ['a', 'e', 'g']) assert.equal(P.cercana(con, P.ancla(con, id), ['a', 'e', 'g']), id);
  const L0 = P.disponer(datos), L1 = P.disponer(con);
  assert.equal(L1.secciones[0].trozos[0].y, L0.secciones[0].trozos[0].y + P.constantes.LH);
});
