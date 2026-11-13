// Pruebas de la pieza «flechas»: el final dibuja la respuesta, ida y vuelta da el mismo SVG, nada de NaN,
// colores solo de variable, alto fijo, la marca convierte bien valor y posición, y todo está a escala
// (el largo y el ángulo dibujados se miden en el SVG).
const test = require('node:test');
const assert = require('node:assert/strict');
const Kit = require('../kit.js');
const F = require('./flechas.js');
const LT = require('../linea-tiempo.js');

const c60 = [4, 4 * Math.sqrt(3)]; // B = 8 a 60°
const R = [6 + c60[0], c60[1]];
const SUMA = {
  unidad: 'N',
  flechas: [
    { de: [0, 0], a: [6, 0], color: 'o', rotulo: 'A', valor: '6 N' },
    { de: [0, 0], a: c60, color: 'i', rotulo: 'B', valor: '8 N' },
  ],
  guias: [{ de: [6, 0], a: R, color: 'i', paso: 1 }, { de: c60, a: R, color: 'o', paso: 1 }],
  angulos: [{ en: [0, 0], de: 0, a: 60, texto: '60°', color: 'h' }],
  resultante: { de: [0, 0], a: R, color: 'd', rotulo: 'R', valor: '2√37 N', paso: 2 },
  regla: { max: 16, respuesta: Math.hypot(...R), texto: '2√37 N', decimales: 1 },
};
const POLI = {
  unidad: 'cm',
  contorno: [[0, 0], [4, 0], [4, 4], [0, 4]],
  puntos: [{ x: 0, y: 0, rotulo: 'A' }, { x: 4, y: 0, rotulo: 'B' }, { x: 4, y: 4, rotulo: 'C' }, { x: 0, y: 4, rotulo: 'D' }],
  flechas: [{ de: [0, 0], a: [4, 0], color: 'o', rotulo: 'AB' }, { de: [4, 0], a: [4, 4], color: 'o', rotulo: 'BC', paso: 1 }],
  resultante: { de: [0, 0], a: [4, 4], color: 'd', rotulo: 'R', valor: '4√2 cm' },
  ejes: true,
};
const NULA = { unidad: 'u', flechas: [{ de: [0, 0], a: [3, 0], color: 'o', rotulo: 'A' }, { de: [3, 0], a: [0, 0], color: 'i', rotulo: 'B', paso: 1 }],
  resultante: { de: [0, 0], a: [0, 0], color: 'd', rotulo: 'R', valor: '0 u' } };
const PASOS = [{ estado: { paso: 1 } }, { estado: { paso: 2 } }, { estado: { paso: 2, final: true } }];

// Lee del SVG las líneas de las flechas con su color: [x1, y1, x2, y2].
const lineas = (s, c) => [...s.matchAll(new RegExp(`<line x1="([\\d.-]+)" y1="([\\d.-]+)" x2="([\\d.-]+)" y2="([\\d.-]+)" stroke="var\\(--c-${c}\\)" stroke-width="3"`, 'g'))].map(m => m.slice(1, 5).map(Number));
const puntas = (s, c) => [...s.matchAll(new RegExp(`<path d="M([\\d.-]+) ([\\d.-]+)L[^"]*Z" fill="var\\(--c-${c}\\)"`, 'g'))].map(m => [+m[1], +m[2]]);

test('se registra en el catálogo del kit', () => {
  assert.equal(Kit.piezas.flechas, F);
});

test('el final dibuja la resultante con su valor, la copia en la regla y la marca con ✓', () => {
  const s = F.dibujar(SUMA, LT.estado(PASOS, 3));
  assert.match(s, /R = 2√37 N/);
  assert.match(s, /2√37 N ✓/);
  const g = F.geometria(SUMA);
  const copia = lineas(s, "d").find(l => Math.abs(l[1] - g.copiaY) < 0.01);
  assert.ok(copia, 'la copia de R está acostada sobre la regla');
  const pf = puntas(s, 'd').find(q => Math.abs(q[1] - g.copiaY) < 0.01);
  assert.ok(Math.abs(pf[0] - 14 - SUMA.regla.respuesta * g.s) < 0.02, 'la copia mide R en la escala de la regla');
  assert.match(F.dibujar(POLI, { final: true }), /R = 4√2 cm/);
  assert.match(F.dibujar(NULA, { final: true }), /R = 0 u/);
});

test('a escala: cada flecha mide su módulo por la escala y el ángulo dibujado es el de sus componentes', () => {
  const s = F.dibujar(SUMA, { final: true }), g = F.geometria(SUMA);
  const pb = puntas(s, 'i')[0], pa = puntas(s, 'o')[0], o = [g.X(0), g.Y(0)];
  assert.ok(Math.abs(Math.hypot(pa[0] - o[0], pa[1] - o[1]) / g.s - 6) < 0.01, 'A mide 6 por la escala');
  assert.ok(Math.abs(Math.hypot(pb[0] - o[0], pb[1] - o[1]) / g.s - 8) < 0.01, 'B mide 8 por la escala');
  const ang = Math.atan2(o[1] - pb[1], pb[0] - o[0]) * 180 / Math.PI;
  assert.ok(Math.abs(ang - 60) < 0.2, `B se dibuja a 60° (sale ${ang})`);
  const pr = puntas(s, 'd').find(q => q[1] < g.copiaY - 1);
  assert.ok(Math.abs(Math.hypot(pr[0] - o[0], pr[1] - o[1]) / g.s - SUMA.regla.respuesta) < 0.01, 'la diagonal mide R');
  // El arco del ángulo termina sobre la dirección de B.
  const arco = s.match(/<path d="M([\d.]+) ([\d.]+)A26 26 0 0 0 ([\d.]+) ([\d.]+)"/);
  const fin = Math.atan2(o[1] - arco[4], arco[3] - o[0]) * 180 / Math.PI;
  assert.ok(Math.abs(fin - 60) < 0.2);
});

test('cada paso deja su rastro y no adelanta lo que viene', () => {
  const s0 = F.dibujar(SUMA, {}), s1 = F.dibujar(SUMA, LT.estado(PASOS, 1)), s2 = F.dibujar(SUMA, LT.estado(PASOS, 2));
  assert.ok(!/stroke-dasharray="4 5"/.test(s0), 'sin guías antes del paso 1');
  assert.match(s1, /stroke-dasharray="4 5"/);
  assert.ok(!/>R</.test(s1), 'la resultante no aparece en el paso 1');
  assert.match(s2, />R</); assert.match(s2, /stroke-dasharray="4 5"/);
  assert.ok(!/✓/.test(s2));
  assert.ok(!/>BC</.test(F.dibujar(POLI, {})) && />BC</.test(F.dibujar(POLI, { paso: 1 })));
});

test('ida y vuelta: el mismo paso da el mismo SVG, venga de donde venga', () => {
  for (const d of [SUMA, POLI, NULA]) {
    const base = { fantasma: { marca: 14, rotulo: 'sumando' } };
    const ida = [1, 2, 3].map(i => F.dibujar(d, LT.estado(PASOS, i, base)));
    const vuelta = [3, 2, 1].map(i => F.dibujar(d, LT.estado(PASOS, i, base))).reverse();
    assert.deepEqual(ida, vuelta);
  }
});

test('sin NaN, undefined ni colores fijos; texto de 14 o más; el alto no cambia entre estados', () => {
  const estados = [{}, { corte: 0 }, { corte: 0, marca: 0 }, { marca: 1e9 }, { marca: -5 }, { paso: 1 }, { paso: 2 },
    { paso: 2, final: true, fantasma: { marca: 14, rotulo: 'sumando', texto: '14 N' } }, { paso: 9 }, { fantasma: { marca: NaN } }, { fantasma: { rotulo: 'x' } }];
  for (const d of [SUMA, POLI, NULA]) {
    const altos = new Set();
    for (const e of estados) {
      const s = F.dibujar(d, e);
      assert.ok(!/NaN|undefined|null|Infinity/.test(s), `${JSON.stringify(e)}: ${s.match(/.{30}(NaN|undefined|null|Infinity).{10}/)}`);
      assert.ok(!/#[0-9a-f]{3,6}\b/i.test(s), 'colores solo con var(--c-*) o currentColor');
      assert.ok(!/<script|\son[a-z]+\s*=|javascript:|<foreignObject|\sid=/i.test(s), 'sin código ni ids');
      for (const [, t] of s.matchAll(/font-size="([\d.]+)"/g)) assert.ok(+t >= 14);
      for (const [, x] of s.matchAll(/<text[^>]* x="([\d.-]+)"/g)) assert.ok(+x >= 0 && +x <= 320, 'el texto no se sale del lienzo');
      altos.add(s.match(/viewBox="0 0 320 ([\d.]+)"/)[1]);
    }
    assert.equal(altos.size, 1, 'la figura mide lo mismo en todos los estados (nada salta)');
  }
});

test('la marca se dibuja donde dice su valor, y deX deshace aX; sin regla no hay marca', () => {
  const c = F.controles(SUMA).marca;
  for (const v of [0, 3.3, 8, 16]) assert.ok(Math.abs(c.deX(c.aX(v)) - v) < 1e-9);
  assert.ok(c.inicio >= c.min && c.inicio <= c.max);
  const s = F.dibujar(SUMA, { marca: 8 });
  assert.ok(s.includes(`x1="${Math.round(c.aX(8) * 100) / 100}"`), 'la línea de la marca pasa por aX(valor)');
  assert.ok(s.includes(c.texto(8)), 'la lectura en vivo está junto a la marca');
  assert.equal(c.texto(7.25), '7,3 N');
  assert.ok(c.aX(SUMA.regla.max) <= 320);
  assert.equal(F.controles(POLI).marca, undefined);
  assert.ok(Math.abs(F.controles(POLI).respuesta - 4 * Math.SQRT2) < 1e-9);
});

test('con ejes, los unitarios î y ĵ miden 1 en la escala de la figura', () => {
  const s = F.dibujar(POLI, {}), g = F.geometria(POLI);
  assert.match(s, />î</); assert.match(s, />ĵ</);
  const u = s.match(/<g class="kit-unitarios">.*?<\/text><\/g>/)[0];
  const tips = [...u.matchAll(/<path d="M([\d.-]+) ([\d.-]+)L/g)].map(m => [+m[1], +m[2]]);
  assert.ok(Math.abs(tips[0][0] - g.X(0) - g.s) < 0.02 && Math.abs(tips[0][1] - g.Y(0)) < 0.02, 'î llega a x = 1');
  assert.ok(Math.abs(g.Y(0) - tips[1][1] - g.s) < 0.02 && Math.abs(tips[1][0] - g.X(0)) < 0.02, 'ĵ llega a y = 1');
});

test('sin regla, el fantasma va en su fila con su rótulo', () => {
  assert.match(F.dibujar(POLI, { final: true, fantasma: { rotulo: 'sumando módulos', texto: '8 cm' } }), /sumando módulos: 8 cm/);
});

test('alt cuenta la relación y dice que está a escala', () => {
  assert.equal(F.alt(SUMA), 'Flechas a escala, con el largo proporcional al módulo: A de 6 N y B de 8 N; ángulos de 60°. Debajo, una regla con la misma escala para medir R');
  assert.match(F.dibujar(SUMA, {}), /role="img" aria-label="Flechas a escala/);
});
