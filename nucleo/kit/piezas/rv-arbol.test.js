// Pruebas de la pieza «rv-arbol»: el árbol va debajo del soporte, todo cabe en el lienzo con 4 de margen y ningún
// renglón pisa a otro; el alto no cambia con lo que se ve; la principal lleva violeta punteado y las ramas turquesa
// continuo; la rama tachada no cuelga del riel; pura, sin colores fijos ni texto chico.
const test = require('node:test');
const assert = require('node:assert/strict');
const S = require('./rv-soporte.js');
const P = require('./rv-arbol.js');

const soporte = { soporte: 'cuaderno', lugar: 'Cuaderno de Rosa', hojas: [{ id: 'h', titulo: 'Ciencias Sociales', oraciones: [
  { id: 'o1', t: 'Mucha gente piensa que el cuy se cría solo para la fiesta.' },
  { id: 'o2', t: 'Sin embargo, en muchas familias de Puno el cuy es una forma de ahorro.' },
  { id: 'o3', t: 'Cuando hace falta plata para útiles o una medicina, se venden algunos en la feria.' }] }] };
const datos = { soporte, titulo: 'Quién manda en el texto', raiz: { n: 2, t: 'En muchas familias de Puno, el cuy es una forma de ahorro' },
  ramas: [{ id: 'r1', n: 1, rel: 'Lo que corrige', t: 'Lo que mucha gente piensa del cuy, una creencia bastante larga' },
    { id: 'r3', n: 3, rel: '¿Cómo?', t: 'Se venden en la feria cuando falta plata' },
    { id: 'r4', n: 4, rel: '¿Por qué conviene?', t: 'Se reproducen rápido y comen hierba y cáscaras' }] };
const ESTADOS = [{}, { ver: ['raiz'] }, { ver: ['raiz', 'r1', 'r3', 'r4'], tachar: ['r1'], nuevo: ['r4'], soporte: { marcas: { o2: 'f' } } }];

test('todo cabe en el lienzo con 4 de margen y ningún renglón pisa a otro', () => {
  const L = P.disponer(datos);
  assert.ok(L.marco.y >= S.disponer(soporte).alto, 'el árbol va debajo del soporte');
  const cajas = [L.raiz, ...L.ramas];
  const renglones = cajas.flatMap(c => [...c.rot.map(r => ({ x: r.x, y: r.y - 13, w: r.w, h: 17, q: r.texto })), ...c.lineas.map(r => ({ x: r.x, y: r.y - 14, w: r.w, h: 18, q: r.texto }))]);
  renglones.push({ x: L.titulo.x, y: L.titulo.y - 15, w: 200, h: 19, q: 'título' });
  for (const c of cajas) {
    assert.ok(c.x >= 4 && c.x + c.w <= 316 && c.y + c.h <= L.alto - 4, 'la caja cabe');
    for (const r of [...c.rot, ...c.lineas]) assert.ok(r.x + r.w <= c.x + c.w - 4 && r.y <= c.y + c.h, `«${r.texto}» se sale de su caja`);
  }
  for (let i = 0; i < renglones.length; i++) for (let j = i + 1; j < renglones.length; j++) {
    const a = renglones[i], b = renglones[j];
    assert.ok(!(a.x < b.x + b.w && b.x < a.x + a.w && a.y < b.y + b.h && b.y < a.y + a.h), `«${a.q}» pisa a «${b.q}»`);
  }
  cajas.forEach((c, k) => { if (k) assert.ok(c.y >= cajas[k - 1].y + cajas[k - 1].h, 'las cajas no se enciman'); });
});

test('el alto no cambia con el estado; puro, sin NaN, colores fijos ni texto chico', () => {
  const altos = new Set();
  for (const e of ESTADOS) {
    const s = P.dibujar(datos, e);
    assert.equal(s, P.dibujar(datos, e));
    assert.ok(!/NaN|undefined|null|Infinity/.test(s));
    assert.ok(!/#[0-9a-f]{3,6}\b/i.test(s));
    assert.ok(!/\sid=/.test(s));
    for (const [, t] of s.matchAll(/font-size="([\d.]+)"/g)) assert.ok(+t >= 14);
    altos.add(s.match(/viewBox="0 0 320 ([\d.]+)"/)[1]);
  }
  assert.equal(altos.size, 1);
});

test('la principal en violeta punteado, las ramas en turquesa; la tachada no cuelga del riel', () => {
  const s = P.dibujar(datos, ESTADOS[2]);
  assert.match(s, /class="rv-nodo" [^>]*stroke="var\(--c-f\)" stroke-dasharray="0.1 6"/);
  assert.match(s, /class="rv-nodo" [^>]*stroke="var\(--c-i\)"/);
  const L = P.disponer(datos), riel = s.match(/class="rv-riel" d="([^"]+)"/)[1];
  assert.ok(!riel.includes(`M28 ${L.ramas[0].cy}H`), 'la rama tachada no cuelga');
  assert.ok(riel.includes(`M28 ${L.ramas[2].cy}H`));
  assert.match(s, /class="rv-tacha/);
  assert.equal((P.dibujar(datos, {}).match(/rv-nodo/g) || []).length, 0, 'sin ver, no se dibuja ninguna caja');
  const conVacio = Object.assign({}, datos, { vacio: 'Arriba irá la oración que manda; debajo, las que le responden.' });
  assert.match(P.dibujar(conVacio, {}), /Arriba irá/);
  assert.ok(!P.dibujar(conVacio, { ver: ['raiz'] }).includes('Arriba irá'), 'el aviso se va cuando aparece la principal');
  const LV = P.disponer(conVacio), filas = S.partir(conVacio.vacio, LV.raiz.w - 20, 14).length;
  assert.ok(LV.raiz.y + 10 + 14 + (filas - 1) * 19 + 4 < LV.ramas[0].y, 'el aviso cabe en el lugar de la principal y no pisa las ramas');
  assert.match(P.alt(datos), /principal, oración 2/);
});
