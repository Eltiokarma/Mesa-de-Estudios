// Pruebas de la pieza «fis-fuerzas»: las flechas van a escala y con el ángulo de los datos, todo queda dentro del
// lienzo (con 4 px de margen para flechas y rótulos), los rótulos no se enciman, nada de NaN ni colores fijos, alto
// fijo, pureza, objetos de prueba y texto alternativo.
const test = require('node:test');
const assert = require('node:assert/strict');
const Kit = require('../kit.js');
const T = require('../trazo.js');
const P = require('./fis-fuerzas.js');

const { W, H } = P.constantes;
const rad = g => g * Math.PI / 180;
const MUESTRAS = {
  caja: { texto: '50 kg', flechas: [{ ang: 37, mod: 50, color: 'o', rotulo: 'A', valor: '50 N' }, { ang: -30, mod: 40, color: 'i', rotulo: 'B', valor: '40 N' }], angulos: [{ de: 0, a: 37, texto: '37°' }] },
  rampa: { objeto: 'caja', rampa: 37, flechas: [{ ang: -90, mod: 100, color: 'o', rotulo: 'W', valor: '100 N' }, { ang: 217, mod: 60, color: 'i', rotulo: 'Wₓ', valor: '60 N', discontinua: true }, { ang: -53, mod: 80, color: 'd', rotulo: 'Wᵧ', valor: '80 N', discontinua: true }] },
  nudo: { flechas: [{ ang: 37, mod: 50, color: 'o', rotulo: 'A', valor: '50 N' }, { ang: 135, mod: 28.3, color: 'i', rotulo: 'B', valor: '20√2 N' }, { ang: -90, mod: 30, color: 'd', rotulo: 'C', valor: '30 N' }] },
  bote: { orillas: true, ancho: 'Río de 80 m de ancho', flechas: [{ ang: 90, mod: 4, color: 'o', rotulo: 'A', valor: '4 m/s' }, { de: [0, 4], ang: 0, mod: 3, color: 'i', rotulo: 'B', valor: '3 m/s' }, { a: [3, 4], color: 'f', rotulo: 'R', valor: '5 m/s' }] },
  avion: { flechas: [{ ang: 106, mod: 250, color: 'o', rotulo: 'A', valor: '250 km/h' }, { de: [250 * Math.cos(rad(106)), 250 * Math.sin(rad(106))], ang: 0, mod: 70, color: 'i', rotulo: 'B', valor: '70 km/h' }, { ang: 90, mod: 240, color: 'f', rotulo: 'R', valor: '240 km/h' }], angulos: [{ de: 90, a: 106, texto: '16°', radio: 40 }] },
  llave: { cota: 'r = 0,3 m', flechas: [{ desde: 'punta', ang: 53, mod: 50, color: 'o', rotulo: 'F', valor: '50 N' }], angulos: [{ en: 'punta', de: 0, a: 53, texto: '53°' }], fuera: [{ en: 'tuerca', sentido: 'sale', rotulo: 'τ', color: 'f' }] },
  carretilla: { texto: '30 kg', flechas: [{ hasta: 'manijas', ang: -30, mod: 40, color: 'o', rotulo: 'F', valor: '40 N' }, { desde: 'piso', ang: 0, mod: 30, color: 'i', rotulo: 'd', valor: '15 m' }] },
  cuadras: { tramos: [{ dir: 'E', n: 6, rotulo: '6 cuadras' }, { dir: 'N', n: 5, rotulo: '5' }, { dir: 'O', n: 2, rotulo: '2' }, { dir: 'S', n: 2, rotulo: '2' }], resultante: { rotulo: 'R', valor: '500 m' } },
  calle: { objeto: 'cuadras', rejilla: false, tramos: [{ dir: 'E', n: 60, rotulo: 'A', valor: '60 m' }, { dir: 'O', n: 25, rotulo: 'B', valor: '25 m' }, { dir: 'E', n: 15, rotulo: 'C', valor: '15 m' }], resultante: { rotulo: 'R', valor: '50 m' } },
  plaza: { objeto: 'cuadras', plaza: [0, 0], tramos: [{ dir: 'E', n: 1 }, { dir: 'N', n: 1 }, { dir: 'O', n: 1 }, { dir: 'S', n: 1 }], resultante: { rotulo: 'R' } },
  lago: { objeto: 'bote', rumbo: 0, flechas: [{ ang: 0, mod: 600, color: 'o', rotulo: 'ida', valor: '600 m' }, { desde: [0, 14], de: [600, 0], a: [0, 0], color: 'i', rotulo: 'vuelta', valor: '600 m' }], marcas: [{ en: [600, 0], texto: 'Isla' }] },
};
const datosDe = (k, d) => Object.assign({ objeto: d.objeto || k }, d);

test('registrada en el kit', () => assert.equal(Kit.piezas['fis-fuerzas'], P));

test('las muestras cubren todos los objetos', () => {
  const usados = new Set(Object.entries(MUESTRAS).map(([k, d]) => d.objeto || k));
  assert.deepEqual([...usados].sort(), [...P.OBJETOS].sort());
});

test('polares: 30° y largo 100 px dan +86,6 en x y −50 en y (y del lienzo hacia abajo)', () => {
  const g = P.geometria({ objeto: 'nudo', largo: 100, flechas: [{ ang: 30, mod: 10, color: 'o' }] });
  const f = g.fl[0], dx = f.p1[0] - f.p0[0], dy = f.p1[1] - f.p0[1];
  assert.ok(Math.abs(g.s - 10) < 1e-9, `escala ${g.s}`);
  assert.ok(Math.abs(dx - 86.6025) < 1e-3 && Math.abs(dy + 50) < 1e-9, `${dx}, ${dy}`);
});

test('a escala: el largo dibujado de cada flecha es su módulo por una sola escala', () => {
  for (const [k, d] of Object.entries(MUESTRAS)) {
    if (k === 'cuadras' || k === 'calle' || k === 'plaza') continue;
    const g = P.geometria(datosDe(k, d));
    g.fl.forEach((x, i) => {
      const f = x.f, de = f.de || [0, 0], a = f.a || [de[0] + f.mod * Math.cos(rad(f.ang)), de[1] + f.mod * Math.sin(rad(f.ang))];
      const L = Math.hypot(x.p1[0] - x.p0[0], x.p1[1] - x.p0[1]);
      assert.ok(Math.abs(L - Math.hypot(a[0] - de[0], a[1] - de[1]) * g.s) < 1e-6, `${k} flecha ${i}`);
    });
  }
  // Cuadras: cada tramo mide n cuadras con la misma escala, y la resultante va de la salida a la llegada.
  const g = P.geometria(datosDe('cuadras', MUESTRAS.cuadras));
  const L = g.fl.map(x => Math.hypot(x.p1[0] - x.p0[0], x.p1[1] - x.p0[1]) / g.s);
  assert.deepEqual(L.map(x => Math.round(x * 1e9) / 1e9), [6, 5, 2, 2, 5]);
});

test('dentro del lienzo: flechas, arcos y rótulos con 4 px de margen; ninguna coordenada afuera', () => {
  for (const [k, d] of Object.entries(MUESTRAS)) {
    const datos = datosDe(k, d), g = P.geometria(datos), s = P.dibujar(datos);
    const dentro = (x, y, m, que) => assert.ok(x >= m - 1e-9 && x <= W - m + 1e-9 && y >= m - 1e-9 && y <= H - m + 1e-9, `${k}: ${que} en (${x}, ${y})`);
    for (const x of g.fl) { dentro(...x.p0, 4, 'cola'); dentro(...x.p1, 4 + 8, 'punta con su cabeza'); }
    for (const a of g.ang) { dentro(a.c[0] - a.r, a.c[1] - a.r, 4, 'arco'); dentro(a.c[0] + a.r, a.c[1] + a.r, 4, 'arco'); }
    for (const b of [...g.rot, ...g.ang.map(a => a.bx), ...g.marcas.map(m => m.b), ...g.fuera.map(q => q.b)]) if (b) { dentro(b.x0, b.y0, 4, `rótulo «${b.texto}»`); dentro(b.x1, b.y1, 4, `rótulo «${b.texto}»`); }
    // Cada número de coordenada del SVG (x, y, cx, cy, x1…, y los de los trazados) cae dentro del lienzo.
    for (const m of s.matchAll(/ (x|y|cx|cy|x1|x2|y1|y2)="(-?[\d.]+)"/g)) {
      const v = +m[2], tope = m[1].startsWith('x') || m[1] === 'cx' ? W : H;
      assert.ok(v >= 0 && v <= tope, `${k}: ${m[1]}=${v}`);
    }
    for (const m of s.matchAll(/ d="([^"]+)"/g)) {
      const nums = m[1].replace(/A[\d.\s-]+?(?=[ML]|$)/g, '').match(/-?[\d.]+/g) || [];
      if (/[aqt]/.test(m[1])) continue;   // olitas con coordenadas relativas
      for (let i = 0; i + 1 < nums.length; i += 2) assert.ok(+nums[i] >= 0 && +nums[i] <= W && +nums[i + 1] >= 0 && +nums[i + 1] <= H, `${k}: trazado ${nums[i]}, ${nums[i + 1]}`);
    }
    // Los textos, medidos con el ancho del kit, también quedan adentro.
    const textos = [...s.matchAll(/<text([^>]*)>([^<]*)</g)];
    assert.ok(textos.length >= 1, k);
    for (const [, at, txt] of textos) {
      const v = c => (at.match(new RegExp(` ${c}="([^"]+)"`)) || [])[1];
      const w = T.ancho(txt, +v('font-size'), 700), x = +v('x'), y = +v('y'), an = v('text-anchor');
      const x0 = an === 'middle' ? x - w / 2 : an === 'end' ? x - w : x;
      assert.ok(x0 >= 2 && x0 + w <= W - 2 && y - 11 >= 0 && y + 3 <= H, `${k}: texto «${txt}» de ${x0} a ${x0 + w}`);
    }
  }
});

test('los rótulos de las flechas no se enciman entre sí ni con los de los ángulos', () => {
  for (const [k, d] of Object.entries(MUESTRAS)) {
    const g = P.geometria(datosDe(k, d));
    const cajas = [...g.rot, ...g.ang.map(a => a.bx), ...g.marcas.map(m => m.b), ...g.fuera.map(q => q.b)].filter(Boolean);
    for (let i = 0; i < cajas.length; i++) for (let j = i + 1; j < cajas.length; j++) {
      const a = cajas[i], b = cajas[j];
      assert.ok(!(a.x0 < b.x1 && b.x0 < a.x1 && a.y0 < b.y1 && b.y0 < a.y1), `${k}: «${a.texto}» y «${b.texto}»`);
    }
  }
});

test('arcos: 90° es un cuadradito; 180° se parte en dos arcos (la bandera de arco largo no distingue)', () => {
  const s90 = P.dibujar({ objeto: 'nudo', flechas: [{ ang: 0, mod: 4 }, { ang: 90, mod: 3 }], angulos: [{ de: 0, a: 90 }] });
  assert.ok(!/<g class="kit-angulo"><path d="[^"]*A/.test(s90));
  const s180 = P.dibujar({ objeto: 'nudo', flechas: [{ ang: 0, mod: 4 }, { ang: 180, mod: 3 }], angulos: [{ de: 0, a: 180, texto: '180°' }] });
  const arcos = s180.match(/<g class="kit-angulo">(.*?)<\/g>/)[1].match(/A24 24 0 0 0/g);
  assert.equal(arcos.length, 2);
});

test('el objeto se dibuja como dibujo de prueba; la resultante nula de una vuelta se escribe', () => {
  for (const [k, d] of Object.entries(MUESTRAS)) {
    const s = P.dibujar(datosDe(k, d));
    assert.match(s, /data-objeto="[a-z]+" data-prueba="si"/, k);
    if (k !== 'plaza') assert.match(s, /kit-vector/, k);
  }
  assert.match(P.dibujar(datosDe('plaza', MUESTRAS.plaza)), />R = 0</);
  assert.match(P.dibujar(datosDe('llave', MUESTRAS.llave)), /kit-fuera/);
});

test('sin NaN ni colores fijos, alto fijo, puro y con texto alternativo', () => {
  const altos = new Set();
  for (const [k, d] of Object.entries(MUESTRAS)) {
    const datos = datosDe(k, d), s = P.dibujar(datos);
    assert.ok(!/NaN|undefined|Infinity/.test(s), k);
    assert.ok(!/#[0-9a-f]{3,6}\b/i.test(s), k);
    assert.equal(s, P.dibujar(datos), `${k}: no es pura`);
    altos.add(s.match(/viewBox="0 0 ([\d.]+) ([\d.]+)"/)[2]);
    const a = P.alt(datos);
    assert.ok(a.length > 20 && !/undefined|NaN/.test(a), k);
  }
  assert.deepEqual([...altos], [String(H)]);
  assert.ok(!/NaN/.test(P.dibujar({ objeto: 'nada' })));
  assert.ok(!/NaN/.test(P.dibujar({})));
});

// Notación (17 nov, auditoría de Vectores): flecha de vector solo en el nombre, subíndices de verdad.
test('el rótulo «A⃗» pierde la flecha cuando lleva su valor (el valor es el módulo)', () => {
  const s = P.dibujar({ objeto: 'nudo', flechas: [{ ang: 0, mod: 5, color: 'o', rotulo: 'A⃗', valor: '5 N' }, { ang: 90, mod: 3, color: 'i', rotulo: 'B⃗' }] });
  assert.match(s, />A = 5 N</);
  assert.ok(!/A⃗ = /.test(s), 'un módulo no lleva flecha');
  assert.match(s, />B⃗</, 'sin valor, el nombre del vector conserva su flecha');
});

test('«A_x», «Aₓ» y «Aᵧ» se dibujan con un <tspan> de subíndice, iguales para x e y', () => {
  const s = P.dibujar({ objeto: 'caja', flechas: [{ ang: 37, mod: 50, color: 'o', rotulo: 'A⃗' }, { ang: 0, mod: 40, color: 'o', rotulo: 'A_x', valor: '?', discontinua: true }, { de: [40, 0], ang: 90, mod: 30, color: 'o', rotulo: 'Aᵧ', discontinua: true }] });
  assert.ok(!/ᵧ|ₓ|_[xy]/.test(s), 'no queda ni gamma ni guion bajo');
  assert.match(s, /A<tspan font-size="72%" dy=".35em">x<\/tspan><tspan dy="-.252em"> = \?<\/tspan>/);
  assert.match(s, /A<tspan font-size="72%" dy=".35em">y<\/tspan>/);
});

test('cola con punta: si dos flechas terminan en el mismo punto, la de después acorta su punta y no se enciman', () => {
  const d = { objeto: 'bote', orillas: true, flechas: [{ ang: 90, mod: 4, color: 'o', rotulo: 'A⃗' }, { de: [0, 4], ang: 0, mod: 3, color: 'i', rotulo: 'B⃗' }, { a: [3, 4], color: 'f', rotulo: 'R⃗', valor: '?' }] };
  const s = P.dibujar(d), g = P.geometria(d);
  const punta = c => [...s.matchAll(new RegExp(`<path d="M([\\d.-]+) ([\\d.-]+)L[^"]*Z" fill="var\\(--c-${c}\\)"`, 'g'))].map(m => [+m[1], +m[2]])[0];
  const pb = punta('i'), pr = punta('f');
  assert.ok(Math.hypot(pb[0] - g.fl[1].p1[0], pb[1] - g.fl[1].p1[1]) < 0.05, 'B termina en su punto');
  assert.ok(Math.abs(Math.hypot(pr[0] - pb[0], pr[1] - pb[1]) - 14) < 0.1, 'la punta de R queda 14 px antes');
});

test('el rótulo de un ángulo no cae sobre una flecha que sale de su vértice (dos toros: R va por la bisectriz)', () => {
  const d = { objeto: 'nudo', largo: 190, flechas: [{ ang: 30, mod: 400, color: 'o', rotulo: 'A⃗' }, { ang: -30, mod: 400, color: 'i', rotulo: 'B⃗' }, { ang: 0, mod: 693, color: 'f', rotulo: 'R⃗', valor: '?', cuerda: false, discontinua: true }], angulos: [{ de: -30, a: 30, texto: '60°', radio: 30 }] };
  const g = P.geometria(d), b = g.ang[0].bx, r = g.fl[2];
  const yR = r.p0[1];   // R es horizontal: su línea va a la altura del nudo
  assert.ok(b.y1 < yR - 2 || b.y0 > yR + 2, `«60°» pisa la línea de R (${b.y0}..${b.y1} contra ${yR})`);
});

// Un color por papel (docs/molde-unidad.md §5b, 17 nov): en las cuadras, la resultante es lo que se pide (violeta) y el
// tercer tramo va en verde; el verde nunca hace de resultante. ⊙ y ⊗ sin color van en violeta.
test('cuadras: tramos naranja, turquesa y verde; la resultante, violeta; ⊙ por omisión, violeta', () => {
  const tramos = [{ dir: 'E', n: 6 }, { dir: 'N', n: 5 }, { dir: 'O', n: 2 }, { dir: 'S', n: 2 }];
  const g = P.geometria({ objeto: 'cuadras', tramos, resultante: { rotulo: 'd⃗' } });
  assert.deepEqual(g.fl.map(x => x.f.color), ['o', 'i', 'd', 't', 'f']);
  assert.ok(g.fl[4].f.resultante);
  const s = P.dibujar({ objeto: 'llave', flechas: [{ desde: 'punta', ang: 53, mod: 50, color: 'o', rotulo: 'F' }], fuera: [{ en: 'tuerca', sentido: 'sale', rotulo: 'τ' }] });
  assert.match(s.match(/<g class="kit-fuera">[\s\S]*?<\/g>/)[0], /stroke="var\(--c-f\)"/);
});
