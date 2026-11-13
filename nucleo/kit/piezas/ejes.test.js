// Pruebas de la pieza «ejes»: el final dibuja la respuesta, ida y vuelta da el mismo SVG, nada de NaN ni
// undefined, colores solo de variable, texto de 14 o más, alto fijo y la marca se convierte bien entre valor y posición.
const test = require('node:test');
const assert = require('node:assert/strict');
const Kit = require('../kit.js');
const E = require('./ejes.js');
const LT = require('../linea-tiempo.js');

// F-t con un tramo positivo y otro negativo; el impulso (área con signo) se arrastra en una regla aparte.
const IMPULSO = {
  x: { min: 0, max: 6, paso: 1, nombre: 't', unidad: 's' },
  y: { min: -20, max: 40, paso: 10, nombre: 'F', unidad: 'N', color: 'o' },
  curvas: [{ puntos: [[0, 0], [2, 40], [4, 0], [5, -20], [6, 0]], color: 'o', rotulo: 'F', desde: 0 }],
  areas: [{ puntos: [[0, 0], [2, 40], [4, 0]], color: 'i', rotulo: '+80 N·s', desde: 1 },
          { puntos: [[4, 0], [5, -20], [6, 0]], color: 'h', rotulo: '−20 N·s', desde: 2 }],
  marca: { eje: 'regla', min: 0, max: 120, inicio: 0, paso: 10, cada: 2, nombre: 'J', unidad: 'N·s', color: 'd' },
  respuesta: 60, sufijo: ' N·s', decimales: 2,
};
// v-t de dos móviles; el instante se arrastra sobre el eje t.
const ENCUENTRO = {
  x: { min: 0, max: 10, paso: 1, nombre: 't', unidad: 's' },
  y: { min: 0, max: 20, paso: 5, nombre: 'v', unidad: 'm/s' },
  curvas: [{ puntos: [[0, 4], [10, 14]], color: 'i', rotulo: 'A', desde: 0 },
           { puntos: [[0, 16], [10, 6]], color: 'h', rotulo: 'B', desde: 0 }],
  puntos: [{ x: 6, y: 10, color: 'o', rotulo: '(6; 10)', guias: true, desde: 1 }],
  marca: { eje: 'x', min: 0, max: 10, inicio: 0 }, respuesta: 6, sufijo: ' s', decimales: 2,
};
// Una función con un salto (null corta la línea) y sin marca: se responde con alternativas.
const SALTO = {
  x: { min: -3, max: 3, paso: 1, nombre: 'x' }, y: { min: -2, max: 4, paso: 1, nombre: 'y' },
  curvas: [{ puntos: [[-3, 3], [0, 0], null, [0, 2], [3, 4]], color: 'o', rotulo: 'f', desde: 0 }],
  puntos: [{ x: 0, y: 0, color: 'o', abierto: true, desde: 1 }, { x: 0, y: 2, color: 'o', desde: 1 }],
};
const PASOS = [{ estado: { corte: 1 } }, { estado: { corte: 2 } }, { estado: { corte: 2, final: true } }];

test('se registra en el catálogo del kit', () => assert.equal(Kit.piezas.ejes, E));

test('el estado final dibuja la respuesta con su ✓', () => {
  assert.match(E.dibujar(IMPULSO, LT.estado(PASOS, 3)), />60 N·s ✓</);
  assert.match(E.dibujar(ENCUENTRO, LT.estado(PASOS, 3)), />6 s ✓</);
  assert.ok(!/✓/.test(E.dibujar(SALTO, LT.estado(PASOS, 3))));
});

test('cada paso deja su rastro; el área negativa se distingue (más tenue y discontinua)', () => {
  const s1 = E.dibujar(IMPULSO, LT.estado(PASOS, 1)), s2 = E.dibujar(IMPULSO, LT.estado(PASOS, 2));
  assert.match(s1, />\+80 N·s</); assert.ok(!/>−20 N·s</.test(s1));
  assert.match(s2, />\+80 N·s</); assert.match(s2, />−20 N·s</);
  assert.match(s2, /fill="var\(--c-h\)" fill-opacity="0.12"[^>]*stroke-dasharray/);
  assert.match(s2, /fill="var\(--c-i\)" fill-opacity="0.24"/);
});

test('una curva con null se corta (dos tramos) y el punto hueco se ve hueco', () => {
  const s = E.dibujar(SALTO, { corte: 1 });
  const d = s.match(/<path class="kit-crece[^"]*" d="([^"]+)" fill="none"/)[1];
  assert.equal((d.match(/M/g) || []).length, 2);
  assert.match(s, /fill="var\(--card\)" stroke="var\(--c-o\)"/);
});

test('ida y vuelta: el mismo paso da el mismo SVG, venga de donde venga', () => {
  const fantasmas = [{ marca: 100, rotulo: 'sin signo' }, { curvas: [{ puntos: [[0, 10], [6, 10]] }], areas: [{ puntos: [[0, 10], [6, 10]] }], rotulo: 'leyendo F' }];
  for (const d of [IMPULSO, ENCUENTRO, SALTO]) for (const fantasma of fantasmas) {
    const ida = [1, 2, 3].map(i => E.dibujar(d, LT.estado(PASOS, i, { fantasma })));
    const vuelta = [3, 2, 1].map(i => E.dibujar(d, LT.estado(PASOS, i, { fantasma }))).reverse();
    assert.deepEqual(ida, vuelta);
  }
});

test('sin NaN, undefined ni colores fijos; texto de 14 o más; el alto no cambia entre estados', () => {
  const estados = [{}, { corte: 0, marca: 0 }, { corte: 0, marca: 1e9 }, { corte: 0, marca: -50 }, { corte: 1 }, { corte: 2 },
    { corte: 2, final: true, fantasma: { marca: 100, rotulo: 'sin signo' } }, { corte: 9 }, { fantasma: { marca: NaN } },
    { corte: 2, fantasma: { puntos: [{ x: 1, y: 1 }], rotulo: 'otro punto' } }];
  for (const d of [IMPULSO, ENCUENTRO, SALTO]) {
    const altos = new Set();
    for (const e of estados) {
      const s = E.dibujar(d, e);
      assert.ok(!/NaN|undefined|null|Infinity/.test(s), `${JSON.stringify(e)}: ${s.match(/.{20}(NaN|undefined|null|Infinity).{20}/)}`);
      assert.ok(!/#[0-9a-f]{3,6}\b/i.test(s), 'colores solo con var(--c-*) o currentColor');
      assert.ok(!/<script|\son[a-z]+\s*=|javascript:|<foreignObject|\sid=/i.test(s), 'sin código ni ids');
      for (const [, t] of s.matchAll(/font-size="([\d.]+)"/g)) assert.ok(+t >= 14);
      for (const [, c] of s.matchAll(/var\(--c-([a-z])\)/g)) assert.ok(['o', 'i', 'h', 'd'].includes(c));
      altos.add(s.match(/viewBox="0 0 320 ([\d.]+)"/)[1]);
    }
    assert.equal(altos.size, 1, 'la figura mide lo mismo en todos los estados (nada salta)');
  }
});

test('la marca se dibuja donde dice su valor, y deX deshace aX (en el eje y en la regla)', () => {
  for (const d of [IMPULSO, ENCUENTRO]) {
    const c = E.controles(d).marca;
    for (const v of [c.min, (c.min + c.max) / 3, c.max]) assert.ok(Math.abs(c.deX(c.aX(v)) - v) < 1e-9);
    const v = (c.min + c.max) / 2, s = E.dibujar(d, { corte: 0, marca: v });
    assert.ok(s.includes(`x1="${Math.round(c.aX(v) * 100) / 100}"`), 'la línea de la marca pasa por aX(valor)');
    assert.ok(s.includes(c.texto(v)));
  }
  assert.equal(E.controles(SALTO).marca, undefined);
  // En el eje x, la marca cae sobre la abscisa del punto de encuentro.
  const c = E.controles(ENCUENTRO).marca, g = E.geometria(ENCUENTRO);
  assert.ok(Math.abs(c.aX(6) - g.X(6)) < 1e-9);
});

test('alt cuenta la relación', () => {
  assert.equal(E.alt(IMPULSO), 'Gráfica de F (N) contra t (s): F; +80 N·s; −20 N·s');
});

test('«hasta»: un elemento se ve desde su corte hasta el suyo y luego deja su lugar', () => {
  const d = { ...SALTO, puntos: [{ x: 1, y: 1, rotulo: 'vmax', desde: 0, hasta: 1 }, { x: 1, y: 1, rotulo: '3 m/s', desde: 2 }] };
  assert.match(E.dibujar(d, { corte: 0 }), />vmax</);
  assert.match(E.dibujar(d, { corte: 1 }), />vmax</);
  const fin = E.dibujar(d, { corte: 2 });
  assert.doesNotMatch(fin, />vmax</);
  assert.match(fin, />3 m\/s</);
});

test('«cerrada»: la región entre dos gráficas se cierra sola, sin bajar al eje y sin borde de signo', () => {
  const d = { ...SALTO, areas: [{ puntos: [[-2, 2], [-1, 1], [-1, -2], [-2, -2]], color: 'h', rotulo: '3,5', cerrada: true }] };
  const svg = E.dibujar(d, { corte: 0 });
  const g = E.geometria(d), X = v => 48 + 254 * (v + 3) / 6;
  const path = svg.match(/<path class="kit-crece" d="([^"]+)" fill="var\(--c-h\)"[^>]*>/);
  assert.ok(path, 'dibuja la región');
  assert.equal((path[1].match(/[ML]/g) || []).length, 4, 'cuatro vértices, sin cerrar al eje');
  assert.doesNotMatch(path[0], /stroke-dasharray/);
  assert.ok(g && X(-2) > 0);
  assert.match(svg, />3,5</);
});

test('compacto: sin marca, el plano es más bajo y la figura no reserva lugar para fantasmas', () => {
  const XT = { x: { min: 0, max: 5, paso: 1, nombre: 't', unidad: 's' }, y: { min: 0, max: 30, paso: 10, nombre: 'x', unidad: 'm', color: 'i' },
    curvas: [{ puntos: [[0, 0], [5, 20]], color: 'i' }] };
  const alto = d => +E.dibujar(d).match(/viewBox="0 0 320 ([\d.]+)"/)[1];
  assert.ok(alto({ ...XT, compacto: true }) < alto(XT) - 60);
  assert.equal(alto({ ...ENCUENTRO, compacto: true }), alto(ENCUENTRO), 'con marca, compacto no cambia nada');
  assert.ok(!/NaN|undefined/.test(E.dibujar({ ...XT, compacto: true })));
});
