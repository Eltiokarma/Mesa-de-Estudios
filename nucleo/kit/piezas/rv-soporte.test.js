// Pruebas de la pieza «rv-soporte»: cada soporte encuadra todo dentro del lienzo con 4 de margen, ningún renglón pisa
// a otro, la marca cae bajo su renglón, el alto no cambia con el estado, es pura, sin colores fijos ni texto chico, el
// marco es un dibujo de prueba marcado y el texto alternativo trae el texto entero.
const test = require('node:test');
const assert = require('node:assert/strict');
const P = require('./rv-soporte.js');
const T = require('../trazo.js');

const ors = (pre, n) => Array.from({ length: n }, (_, k) => ({ id: `${pre}${k + 1}`, t: `Oración número ${k + 1} de un texto corto, con palabras suficientes para partirse en dos renglones.` }));
const tabla = { titulo: 'Agua juntada', cols: ['Mes', 'Litros'], filas: [{ id: 'f1', celdas: ['Enero', '2400'] }, { id: 'f2', celdas: ['Febrero', '3100'] }], nota: 'Datos inventados para el ejercicio.' };
const barras = { titulo: 'Libros leídos', max: 160, items: [{ id: 'b1', t: 'Antes', v: 40 }, { id: 'b2', t: 'Después', v: 160 }], nota: 'Datos inventados para el ejercicio.' };
const CASOS = {
  mural: { soporte: 'mural', lugar: 'Mural del colegio', hojas: [{ id: 'a', titulo: 'Comunicado de la Dirección', para: 'estudiantes y familias', oraciones: ors('o', 4) }, { id: 'b', chica: true, titulo: 'Aviso del quiosco', de: 'el quiosco', para: 'estudiantes', oraciones: ors('q', 2) }] },
  puerta: { soporte: 'puerta', lugar: 'Puerta del puesto de salud', hojas: [{ id: 'a', titulo: 'Aviso', de: 'el puesto de salud', para: 'vecinos', oraciones: ors('o', 4) }] },
  cartel: { soporte: 'cartel', lugar: 'Cartel de la feria', hojas: [{ id: 'a', titulo: 'Comunicado de la junta de la feria', de: 'la junta', para: 'vendedores', oraciones: ors('o', 3) }] },
  folleto: { soporte: 'folleto', lugar: 'Folleto del muelle', hojas: [{ id: 'a', titulo: 'Información', oraciones: ors('o', 3), tabla }] },
  cuaderno: { soporte: 'cuaderno', lugar: 'Cuaderno de Rosa', hojas: [{ id: 'a', titulo: 'Útiles', oraciones: ors('o', 3) }], frase: { etiqueta: 'Frase', t: 'Los útiles para dibujar y para pintar en la clase de arte' } },
  mensaje: { soporte: 'mensaje', lugar: 'Familias de 5.º B', hojas: [{ id: 'a', de: 'la tutora', para: 'familias', oraciones: ors('o', 3) }] },
  simulacro: { soporte: 'simulacro', numero: 12, hojas: [{ id: 'a', titulo: 'Texto A', oraciones: ors('o', 3), barras }, { id: 'b', titulo: 'Texto B', oraciones: ors('p', 2), tabla }],
    pregunta: 'El texto y el gráfico giran, principalmente, en torno a', alternativas: ['A', 'B', 'C', 'D', 'E'].map(id => ({ id, t: `alternativa ${id}, larga como en el examen de admisión de San Marcos` })) },
};
const ESTADOS = d => {
  const ids = P.disponer(d).items.filter(i => i.id).map(i => i.id);
  return [{}, { marcas: Object.fromEntries(ids.map((i, k) => [i, ['i', 'o', 'f'][k % 3]])), tenue: ids.slice(0, 2), tachar: ids.slice(-1), nuevo: ids.slice(0, 1) },
    { marcas: { frase: 'f' }, tenue: ids }];
};

// Caja de cada cosa escrita: renglones, números, letras, celdas y barras.
function cajas(L) {
  const out = [];
  for (const it of L.items.concat(L.frase ? L.frase.lineas : [])) {
    if (it.tipo === 'tabla-cab' || it.tipo === 'tabla-fila' || it.tipo === 'barra') out.push({ x: it.x, y: it.y, w: it.w, h: it.h, q: it.tipo });
    else if (it.tipo === 'letra') out.push({ x: it.x - 10, y: it.y - 10, w: 20, h: 20, q: 'letra' });
    else if (it.tipo === 'banda') out.push({ x: it.x - it.w / 2, y: it.y - 16, w: it.w, h: 20, q: it.texto });
    else out.push({ x: it.x, y: it.y - (it.tam || 15) + 1, w: it.w, h: (it.tam || 15) + 3, q: it.texto });
  }
  return out;
}

for (const [nombre, d] of Object.entries(CASOS)) {
  test(`${nombre}: todo cabe en el lienzo con 4 de margen y ningún renglón pisa a otro`, () => {
    const L = P.disponer(d), cs = cajas(L), W = P.constantes.W;
    for (const c of cs) {
      assert.ok(c.x >= 4 - 0.01 && c.x + c.w <= W - 4 + 0.01, `${nombre}: «${c.q}» se sale por el costado (${c.x}, ${c.w})`);
      assert.ok(c.y >= 4 - 0.01 && c.y + c.h <= L.alto - 4 + 0.01, `${nombre}: «${c.q}» se sale por arriba o por abajo`);
    }
    for (let i = 0; i < cs.length; i++) for (let j = i + 1; j < cs.length; j++) {
      const a = cs[i], b = cs[j];
      const pisa = a.x < b.x + b.w - 0.5 && b.x < a.x + a.w - 0.5 && a.y < b.y + b.h - 0.5 && b.y < a.y + a.h - 0.5;
      assert.ok(!pisa, `${nombre}: «${a.q}» pisa a «${b.q}»`);
    }
    // Cada papel guarda su contenido.
    for (const p of L.papeles.filter(x => x.w)) assert.ok(p.x >= 4 && p.x + p.w <= W - 4, `${nombre}: el papel se sale`);
  });
  test(`${nombre}: el alto no cambia con el estado; puro, sin NaN, colores fijos ni texto chico`, () => {
    const altos = new Set();
    for (const e of ESTADOS(d)) {
      const s = P.dibujar(d, e);
      assert.equal(s, P.dibujar(d, e));
      assert.ok(!/NaN|undefined|null|Infinity/.test(s));
      assert.ok(!/#[0-9a-f]{3,6}\b/i.test(s), 'sin colores fijos');
      assert.ok(!/<script|\son[a-z]+\s*=|\sid=/i.test(s));
      for (const [, t] of s.matchAll(/font-size="([\d.]+)"/g)) assert.ok(+t >= 14);
      for (const [, c] of s.matchAll(/var\(--c-([a-z])\)/g)) assert.ok(['i', 'o', 'f'].includes(c), `color ${c} fuera de la paleta de lectura`);
      altos.add(s.match(/viewBox="0 0 320 ([\d.]+)"/)[1]);
    }
    assert.equal(altos.size, 1);
  });
}

test('la marca cae bajo su renglón y cada color tiene su trazo (el color no es la única señal)', () => {
  const d = CASOS.mural, L = P.disponer(d);
  const lineas = L.items.filter(i => i.tipo === 'linea' && i.id === 'o2');
  for (const [c, raya] of [['i', null], ['o', '7 4'], ['f', '0.1 6']]) {
    const s = P.dibujar(d, { marcas: { o2: c } });
    const subs = [...s.matchAll(/class="rv-sub" x1="([\d.]+)" y1="([\d.]+)" x2="([\d.]+)"[^>]*?(?:stroke-dasharray="([^"]+)")?\/>/g)];
    assert.equal(subs.length, lineas.length, 'un subrayado por renglón');
    subs.forEach((m, k) => {
      assert.ok(Math.abs(+m[1] - lineas[k].x) < 0.01 && Math.abs(+m[3] - lineas[k].x - lineas[k].w) < 0.01);
      assert.ok(Math.abs(+m[2] - lineas[k].y - 4) < 0.01);
      assert.equal(m[4] || null, raya);
    });
  }
});

test('lo que queda fuera se lee: la tinta al 65 % pasa 4,5:1 en claro y en oscuro', () => {
  const dec = c => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
  const h = x => [1, 3, 5].map(i => parseInt(x.slice(i, i + 2), 16));
  const Y = rgb => { const [r, g, b] = rgb.map(v => dec(v / 255)); return 0.2126 * r + 0.7152 * g + 0.0722 * b; };
  const mezcla = (a, b, t) => h(a).map((x, i) => Math.round(x * t + h(b)[i] * (1 - t)));
  const contraste = (a, b) => { const [x, y] = [Y(a), Y(b)].sort((m, n) => m - n); return (y + 0.05) / (x + 0.05); };
  for (const [tinta, tarjeta] of [['#2d2340', '#fffaf6'], ['#f1ebf7', '#2a2135']]) {
    assert.ok(contraste(mezcla(tinta, tarjeta, P.constantes.TENUE), h(tarjeta)) >= 4.5, `${tinta} sobre ${tarjeta}`);
  }
});

test('los marcos son dibujos de prueba y el texto alternativo trae el texto, el soporte y quién escribe', () => {
  for (const [nombre, d] of Object.entries(CASOS)) {
    const s = P.dibujar(d, {});
    if (nombre !== 'simulacro') assert.match(s, /data-prueba="si"/, nombre);
    const a = P.alt(d);
    for (const h of d.hojas) for (const o of h.oraciones) assert.ok(a.includes(o.t), `${nombre}: falta una oración en el alt`);
    if (d.alternativas) for (const x of d.alternativas) assert.ok(a.includes(x.t));
  }
  assert.match(P.alt(CASOS.mural), /para estudiantes y familias/);
  assert.match(P.alt(CASOS.simulacro), /Tabla.*Enero, 2400/);
  assert.match(P.alt(CASOS.simulacro), /barras.*Después, 160/);
});

test('las barras son proporcionales al dato desde cero', () => {
  const L = P.disponer(CASOS.simulacro);
  const [a, b] = L.items.filter(i => i.tipo === 'barra');
  assert.ok(Math.abs(a.largo / b.largo - 40 / 160) < 1e-9);
  assert.ok(T.ancho('160', 15, 700) + b.x0 + b.largo + 6 <= 320 - 4);
});
