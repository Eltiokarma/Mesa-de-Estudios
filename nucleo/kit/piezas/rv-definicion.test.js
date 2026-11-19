// Pruebas de la pieza «rv-definicion»: la ficha y la tabla quedan debajo del soporte y dentro del lienzo con 4 de
// margen; ningún rótulo pisa a otro ni se sale de su casilla o de su columna; el alto no cambia con el estado; es pura,
// sin colores fijos ni texto chico; cada papel (entra, se cuela, justa) lleva su color y su trazo; las zonas de toque
// miden 40 o más; la ficha es un dibujo de prueba, y el texto alternativo trae la ficha y la tabla.
const test = require('node:test');
const assert = require('node:assert/strict');
const S = require('./rv-soporte.js');
const P = require('./rv-definicion.js');
const T = require('../trazo.js');

const soporte = { soporte: 'cartel', lugar: 'Cartel en un paradero de Juliaca', hojas: [{ id: 'c', titulo: 'Comunicado', de: 'la Municipalidad', para: 'conductores del paradero',
  oraciones: [{ id: 'c1', t: 'Desde el 1 de diciembre, todo mototaxi llevará su número pintado atrás.' }] }] };
const entrada = { termino: 'mototaxi', rotulo: 'Ficha del cartel', partes: [{ id: 'g', papel: 'Clase' }, { id: 'm', papel: 'Rasgo', casilla: true, hueco: 'con motor' }, { id: 'p', papel: 'Rasgo', casilla: true, hueco: 'que lleva pasajeros' }] };
const casos = { titulo: 'Vehículos del paradero', cols: ['Vehículo', 'Ruedas', 'Motor', 'Lleva'], anchos: [120, 58, 50, 66], filas: [
  ['v3', 'tricitaxi a pedal', '3', 'no', 'pasajeros'], ['v1', 'mototaxi abierto', '3', 'sí', 'pasajeros'], ['v5', 'combi', '4', 'sí', 'pasajeros'],
  ['v4', 'motocarga', '3', 'sí', 'carga'], ['v2', 'mototaxi cerrado', '3', 'sí', 'pasajeros'], ['v7', 'triciclo de carga', '3', 'no', 'carga'], ['v6', 'camioneta', '4', 'sí', 'carga']].map(([id, ...celdas]) => ({ id, celdas })) };
const datos = { soporte, entrada, casos, toques: { g: 'g', m: 'm', p: 'p' } };
const ESTADOS = [
  {},
  { partes: { g: 'vehículo' }, color: 'o', filas: { v1: 'i', v2: 'i', v3: 'o', v4: 'o', v5: 'o', v6: 'o', v7: 'o' }, sello: { t: 'Se cuelan 5', c: 'o' } },
  { partes: { g: 'vehículo de tres ruedas', m: 'con motor', p: 'que lleva pasajeros' }, color: 'f', filas: { v1: 'i', v2: 'i' }, tenue: ['v3', 'v4', 'v5', 'v6', 'v7'], sello: { t: 'Justa: entran solo los 2 mototaxis', c: 'f' }, nuevo: ['g', 'v1'] },
  { partes: { g: 'vehículo de tres ruedas', m: '', p: 'que lleva pasajeros' }, filas: { v1: 'i', v2: 'i', v3: 'o' }, tenue: ['v4', 'v5', 'v6', 'v7'], soporte: { marcas: { c1: 'i' } } },
];

// La caja de cada cosa escrita, con el texto más largo que puede llevar cada casilla.
function cajas(L, textos = {}) {
  const out = [];
  if (L.ficha) {
    const c = L.ficha.cab;
    out.push({ x: c.termino.x, y: c.termino.y - 17, w: T.ancho(c.termino.texto, 18, 700), h: 21, q: c.termino.texto });
    if (c.rotulo) { const w = T.ancho(c.rotulo.texto, 14); out.push({ x: c.rotulo.x - w, y: c.rotulo.y - 13, w, h: 17, q: c.rotulo.texto }); }
    for (const f of L.ficha.filas) {
      out.push({ x: f.rot.x, y: f.rot.y - 13, w: T.ancho(f.papel, 14, 700), h: 17, q: `${f.papel} (${f.id})` });
      const t = textos[f.id] || f.hueco;
      out.push({ x: f.tx, y: f.ty - 14, w: T.ancho(t, 15, 700), h: 18, q: t });
    }
  }
  if (L.tabla) {
    const B = L.tabla;
    if (B.titulo) out.push({ x: B.titulo.x, y: B.titulo.y - 13, w: T.ancho(B.titulo.texto, 14, 700), h: 17, q: B.titulo.texto });
    for (const k of B.cab.cols) out.push({ x: k.x, y: k.y - 13, w: T.ancho(k.texto, 14, 700), h: 17, q: k.texto });
    for (const f of B.filas) for (const k of f.celdas) out.push({ x: k.x, y: k.y - 13, w: T.ancho(k.texto, 14), h: 17, q: k.texto });
    out.push({ x: B.sello.x, y: B.sello.y - 13, w: T.ancho(textos.sello || 'Se cuelan 5', 14, 700), h: 17, q: 'sello' });
  }
  return out;
}

test('la ficha y la tabla van debajo del soporte; todo cabe con 4 de margen y ningún rótulo pisa a otro', () => {
  const L = P.disponer(datos), W = P.constantes.W;
  const finSoporte = S.disponer(soporte).alto - S.constantes.PIE - 4;
  assert.ok(L.ficha.y >= finSoporte, 'la ficha empieza debajo del soporte');
  assert.ok(L.tabla.y >= L.ficha.y + L.ficha.h, 'la tabla empieza debajo de la ficha');
  assert.ok(L.ficha.x - 10 >= 4 && L.ficha.x + L.ficha.w <= W - 4, 'el lomo y la página caben');
  assert.ok(L.tabla.x >= 4 && L.tabla.x + L.tabla.w <= W - 4 && L.tabla.y + L.tabla.h <= L.alto - 4, 'la tabla cabe');
  const cs = cajas(L, { g: 'vehículo de tres ruedas', m: 'con motor', p: 'que lleva pasajeros', sello: 'Justa: entran solo los 2 mototaxis' });
  for (const c of cs) {
    assert.ok(c.x >= 4 && c.x + c.w <= W - 4, `«${c.q}» se sale por el costado (${c.x} + ${c.w})`);
    assert.ok(c.y >= 4 && c.y + c.h <= L.alto - 4, `«${c.q}» se sale por arriba o por abajo`);
  }
  for (let i = 0; i < cs.length; i++) for (let j = i + 1; j < cs.length; j++) {
    const a = cs[i], b = cs[j];
    assert.ok(!(a.x < b.x + b.w - 0.5 && b.x < a.x + a.w - 0.5 && a.y < b.y + b.h - 0.5 && b.y < a.y + a.h - 0.5), `«${a.q}» pisa a «${b.q}»`);
  }
});

test('cada texto cabe en su casilla de la ficha y en su columna de la tabla', () => {
  const L = P.disponer(datos);
  const TEXTOS = { g: ['vehículo de tres ruedas', 'vehículo'], m: ['con motor'], p: ['que lleva pasajeros', 'que lleva carga'] };
  for (const f of L.ficha.filas) for (const t of [...TEXTOS[f.id], f.hueco]) {
    assert.ok(T.ancho(t, 15, 700) <= f.tw, `«${t}» no cabe en la casilla de ${f.id} (${T.ancho(t, 15, 700)} > ${f.tw})`);
  }
  for (const f of L.tabla.filas) f.celdas.forEach((k, i) => {
    // La medida del kit sobrestima un poco las letras (medido en Chromium, 19 nov: «mototaxi cerrado» mide 115 y el kit da 119).
    if (i < f.celdas.length - 1) assert.ok(T.ancho(k.texto, 14) <= k.w, `«${k.texto}» se sale de su columna`);
    else assert.ok(k.x + T.ancho(k.texto, 14) <= L.tabla.x + L.tabla.w - 4, `«${k.texto}» se sale de la tabla`);
  });
  // Entre una cabecera y la siguiente quedan 4 o más con la medida del kit (en Chromium, «Ruedas» en negrita mide 51 y deja 7).
  L.tabla.cab.cols.forEach((k, i) => { if (i < L.tabla.cab.cols.length - 1) assert.ok(k.x + T.ancho(k.texto, 14, 700) <= L.tabla.cab.cols[i + 1].x - 4, `la cabecera «${k.texto}» pisa a la siguiente`); });
  // Las casillas quedan dentro de la página de la ficha, y las filas marcadas, dentro de la tarjeta de la tabla.
  for (const f of L.ficha.filas) assert.ok(f.caja.x + f.caja.w <= L.ficha.x + L.ficha.w - 8);
  assert.ok(L.tabla.x1 + 4 <= L.tabla.x + L.tabla.w - 2 && 12 - 4 >= L.tabla.x + 2, 'la marca de una fila queda dentro de la tarjeta');
});

test('el alto no cambia con el estado; puro, sin NaN, colores fijos ni texto chico; solo la paleta de lectura', () => {
  const altos = new Set();
  for (const e of ESTADOS) {
    const s = P.dibujar(datos, e);
    assert.equal(s, P.dibujar(datos, e));
    assert.ok(!/NaN|undefined|null|Infinity/.test(s));
    assert.ok(!/#[0-9a-f]{3,6}\b/i.test(s), 'sin colores fijos');
    assert.ok(!/<script|\son[a-z]+\s*=|\sid=/i.test(s));
    for (const [tag] of s.matchAll(/<[a-z]+ [^>]+>/g)) {
      const at = [...tag.matchAll(/\s([a-z-]+)="/g)].map(m => m[1]);
      assert.equal(new Set(at).size, at.length, `atributo repetido en ${tag.slice(0, 70)}`);
    }
    for (const [, t] of s.matchAll(/font-size="([\d.]+)"/g)) assert.ok(+t >= 14);
    for (const [, c] of s.matchAll(/var\(--c-([a-z])\)/g)) assert.ok(['i', 'o', 'f'].includes(c), `color ${c} fuera de la paleta de lectura`);
    altos.add(s.match(/viewBox="0 0 320 ([\d.]+)"/)[1]);
  }
  assert.equal(altos.size, 1);
});

test('cada papel tiene su color y su trazo: entra (turquesa, continuo), se cuela (naranja, a trazos), justa (violeta, punteado)', () => {
  const s = P.dibujar(datos, ESTADOS[1]);
  const marcas = [...s.matchAll(/<rect class="rv-marca[^"]*"[^>]*stroke="var\(--c-([a-z])\)"[^>]*\/>/g)].map(m => `${m[1]}:${(/stroke-dasharray="([^"]+)"/.exec(m[0]) || [])[1] || ''}`);
  assert.deepEqual(marcas.sort(), ['i:', 'i:', 'o:7 4', 'o:7 4', 'o:7 4', 'o:7 4', 'o:7 4']);
  assert.match(s, /class="rv-pieza"[^>]*var\(--c-o\)[^>]*stroke-dasharray="7 4"/);
  assert.equal((s.match(/class="rv-hueco"/g) || []).length, 2, 'las dos piezas sin poner son huecos de tinta');
  const j = P.dibujar(datos, ESTADOS[2]);
  assert.equal((j.match(/class="rv-pieza[^"]*"[^>]*var\(--c-f\)[^>]*stroke-dasharray="0.1 6"/g) || []).length, 3);
  assert.ok(!/class="rv-hueco"/.test(j));
  // Lo que queda fuera va en gris (la tinta al 65 %), sin marca; el sello dice el resultado en palabras.
  assert.equal((j.match(new RegExp(`opacity="${S.constantes.TENUE}"`, 'g')) || []).length, 5 * 4);
  assert.match(j, />Justa: entran solo los 2 mototaxis</);
  // Una pieza vacía ('') es un hueco, y su casilla queda sin marcar.
  assert.equal((P.dibujar(datos, ESTADOS[3]).match(/class="rv-hueco"/g) || []).length, 1);
});

test('toques: una zona por pieza de la ficha, de 40 de alto, dentro del lienzo y sin pisarse', () => {
  const s = P.dibujar(datos, {});
  const zonas = [...s.matchAll(/<rect class="rv-toque" data-toque="(\w+)" x="([\d.]+)" y="([\d.]+)" width="([\d.]+)" height="([\d.]+)"/g)].map(m => ({ c: m[1], x: +m[2], y: +m[3], w: +m[4], h: +m[5] }));
  assert.deepEqual(zonas.map(z => z.c), ['g', 'm', 'p']);
  const alto = +/viewBox="0 0 \d+ ([\d.]+)"/.exec(s)[1];
  for (const z of zonas) assert.ok(z.h >= 40 && z.x >= 4 && z.x + z.w <= 316 && z.y + z.h <= alto - 4, `zona ${z.c}`);
  for (let k = 1; k < zonas.length; k++) assert.ok(zonas[k].y >= zonas[k - 1].y + zonas[k - 1].h - 0.01);
  assert.equal(P.dibujar(Object.assign({}, datos, { toques: undefined }), {}).includes('data-toque'), false);
});

test('la ficha es un dibujo de prueba; sin ficha ni tabla, solo el soporte; el alt trae la ficha y la tabla', () => {
  assert.match(P.dibujar(datos, {}), /data-objeto="ficha-diccionario" data-prueba="si"/);
  const solo = P.dibujar({ soporte }, {});
  assert.ok(!/ficha-diccionario/.test(solo));
  assert.match(P.alt(datos), /Cartel \(Cartel en un paradero de Juliaca\)/);
  assert.match(P.alt(datos), /Ficha de «mototaxi», para completar: Clase, Rasgo \(con motor\), Rasgo \(que lleva pasajeros\)\./);
  assert.match(P.alt(datos), /Vehículos del paradero: Vehículo, Ruedas, Motor, Lleva; tricitaxi a pedal, 3, no, pasajeros;/);
  // Sin soporte, la ficha empieza arriba y todo sigue dentro del lienzo.
  const L = P.disponer({ entrada, casos });
  assert.ok(L.ficha.y >= 4 && L.tabla.y + L.tabla.h <= L.alto - 4);
  // Aire bajo la tabla para la lupa de la app (como rv-soporte).
  assert.ok(P.disponer(datos).alto - (P.disponer(datos).tabla.y + P.disponer(datos).tabla.h) >= 12);
});
