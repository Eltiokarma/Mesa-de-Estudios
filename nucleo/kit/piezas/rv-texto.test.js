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
