'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const P = require('./fis-ondas-e19.js');

// Este oráculo compara proporciones físicas con distancias en pantalla. No usa las
// funciones X/Y de la pieza para obtener los resultados esperados ni calcula respuestas.
const cerca = (a, b, caso) => assert.ok(Math.abs(a - b) < 1e-9, `${caso}: ${a} frente a ${b}`);
function congelar(x) {
  if (x && typeof x === 'object' && !Object.isFrozen(x)) {
    for (const v of Object.values(x)) congelar(v);
    Object.freeze(x);
  }
  return x;
}
function dentro(b, caso) {
  assert.ok(b.x0 >= 4 - 1e-9 && b.x1 <= 316 + 1e-9 && b.y0 >= 4 && b.y1 <= 256, caso);
}
const seCruzan = (a, b) => a.x0 < b.x1 && b.x0 < a.x1 && a.y0 < b.y1 && b.y0 < a.y1;
function rotulosLibres(g) {
  for (const r of g.rotulos) {
    dentro(r, `rótulo ${r.id}`);
    assert.equal(typeof r.texto, 'string');
    assert.ok(r.tam >= 14);
    assert.doesNotMatch(r.texto, /_|\b(?:true|false|undefined|NaN)\b/);
    for (const p of [...g.particulas, ...g.sensores, ...(g.mano ? [g.mano] : [])]) {
      assert.ok(!seCruzan(r, p.caja), `${r.id} no debe tapar un objeto`);
    }
  }
  for (let i = 0; i < g.rotulos.length; i++) for (let j = i + 1; j < g.rotulos.length; j++) {
    assert.ok(!seCruzan(g.rotulos[i], g.rotulos[j]), `${g.rotulos[i].id} y ${g.rotulos[j].id}`);
  }
}
function casoTransversal(semilla) {
  const xMin = -(semilla % 3), largo = 4 + 2 * (semilla % 5), xMax = xMin + largo;
  const yMax = 0.04 + 0.01 * (semilla % 3), amplitud = yMax * (0.2 + (semilla % 7) / 20);
  const centro = xMin + largo * (0.125 + 0.75 * semilla / 401), ancho = largo / 16;
  const x = xMin + largo / 2, y = amplitud * Math.max(0, 1 - Math.abs(x - centro) / ancho);
  return {
    modo: 'transversal', vista: { xMin, xMax, yMax },
    alt: 'Una soga lleva un pulso. Una marca material y dos sensores muestran posiciones distintas.',
    perfiles: [{ id: 'soga', puntos: [[xMin, 0], [centro - ancho, 0], [centro, amplitud], [centro + ancho, 0], [xMax, 0]], color: 'i' }],
    particulas: [{ id: 'lazo', xEquilibrio: x, x, y, destacada: true, color: 'i' }],
    sensores: [
      { id: 'primero', x: xMin + largo / 4, activo: centro + ancho >= xMin + largo / 4, color: 'd' },
      { id: 'segundo', x: xMin + 3 * largo / 4, activo: centro + ancho >= xMin + 3 * largo / 4, color: 'd' }
    ],
    frente: { x: centro + ancho, color: 'o' },
    mano: { lado: semilla % 2 ? 'izquierda' : 'derecha', y: 0 },
    regla: { marcas: [{ x: xMin, texto: String(xMin) }, { x: x, texto: String(x) }, { x: xMax, texto: `${xMax} m` }], color: 'd' },
    cotas: [{ id: 'separacion', desdeX: xMin + largo / 4, hastaX: xMin + 3 * largo / 4, texto: `${largo / 2} m`, color: 'd' }],
    flechas: [{ id: 'avance', de: [xMin + largo / 8, 0.8 * yMax], a: [xMin + largo / 4, 0.8 * yMax], color: 'o' }],
    rotulos: [
      { id: 'objeto', x: 8, y: 24, texto: 'Cuerda', color: 'i' },
      { id: 'tiempo', x: 312, y: 24, texto: `t = ${semilla % 5} s`, color: 'h', ancla: 'end' },
      { id: 'marca', x: 160, y: 48, texto: 'Marca material', color: 'i', ancla: 'middle' }
    ]
  };
}
function casoLongitudinal(semilla) {
  const xMin = -(semilla % 4), largo = 2 + semilla % 6, xMax = xMin + largo;
  const particulas = Array.from({ length: 15 }, (_, i) => {
    const xEquilibrio = xMin + largo * (i + 1) / 16;
    const desplazamiento = largo * 0.008 * Math.sin(2 * Math.PI * (i / 8 - semilla / 37));
    return { id: `anillo-${i}`, xEquilibrio, x: xEquilibrio + desplazamiento, y: 0, destacada: i === 7, color: i === 7 ? 'i' : undefined };
  });
  return {
    modo: 'longitudinal', vista: { xMin, xMax, yMax: 0.04 }, particulas,
    alt: 'Los anillos se desplazan a lo largo del resorte, cerca de sus posiciones de equilibrio.',
    regla: { marcas: [{ x: xMin, texto: String(xMin) }, { x: (xMin + xMax) / 2, texto: String((xMin + xMax) / 2) }, { x: xMax, texto: `${xMax} m` }] },
    rotulos: [{ id: 'objeto', x: 160, y: 24, texto: 'Anillos de un resorte', ancla: 'middle' }, { id: 'marca', x: 160, y: 48, texto: 'Anillo marcado', color: 'i', ancla: 'middle' }],
    nota: 'Los anillos se mueven de lado a lado.'
  };
}

test('400 estados transversales conservan la escala, la marca material y los sensores', () => {
  for (let semilla = 1; semilla <= 400; semilla++) {
    const d = congelar(casoTransversal(semilla)), antes = JSON.stringify(d), g = P.geometria(d);
    const largo = d.vista.xMax - d.vista.xMin;
    assert.equal(g.W, 320); assert.equal(g.H, 260);
    assert.equal(g.particulas[0].x, 160);
    assert.equal(g.particulas[0].xEquilibrioPx, 160);
    const perfil = g.perfiles[0];
    assert.deepEqual(perfil.puntos[0], [24, 122]);
    assert.deepEqual(perfil.puntos.at(-1), [296, 122]);
    for (let i = 0; i < perfil.puntos.length; i++) {
      const fisico = d.perfiles[0].puntos[i], pantalla = perfil.puntos[i];
      cerca((pantalla[0] - 24) / 272, (fisico[0] - d.vista.xMin) / largo, 'fracción horizontal');
      cerca((122 - pantalla[1]) / 46, fisico[1] / d.vista.yMax, 'fracción vertical');
      cerca(g.Xi(pantalla[0]), fisico[0], 'inversa horizontal');
      cerca(g.Yi(pantalla[1]), fisico[1], 'inversa vertical');
    }
    cerca(g.particulas[0].y, 122 - 46 * d.particulas[0].y / d.vista.yMax, 'altura de la marca');
    assert.deepEqual(g.sensores.map(s => s.x), [92, 228]);
    assert.deepEqual(g.sensores.map(s => s.activo), d.sensores.map(s => s.activo));
    cerca(g.frente.x, perfil.puntos[3][0], 'el frente coincide con el extremo del pulso');
    cerca(g.cotas[0].longitudPx, 136, 'separación de los sensores');
    assert.deepEqual(g.mano.contacto, [semilla % 2 ? 24 : 296, 122]);
    dentro(g.mano.caja, 'mano dentro del lienzo');
    for (const p of [...g.particulas, ...g.sensores]) dentro(p.caja, 'objeto dentro del lienzo');
    rotulosLibres(g);
    const svg = P.dibujar(d);
    assert.equal(svg, P.dibujar(d));
    assert.equal(JSON.stringify(d), antes);
    assert.match(svg, /viewBox="0 0 320 260"/);
    assert.match(svg, /data-objeto="soga"/);
    assert.match(svg, /data-objeto="mano"/);
    assert.match(svg, /data-objeto="marca-material"/);
    assert.equal((svg.match(/data-objeto="sensor"/g) || []).length, 2);
    assert.match(svg, /var\(--c-i\)/); assert.match(svg, /var\(--c-d\)/); assert.match(svg, /var\(--c-o\)/);
    assert.doesNotMatch(svg, /NaN|Infinity|undefined|<foreignObject|font-size="(?:[0-9]|1[0-3])"/);
    assert.equal(P.alt(d), d.alt);
  }
});

test('400 estados longitudinales mantienen la misma escala de posición y desplazamiento', () => {
  for (let semilla = 1; semilla <= 400; semilla++) {
    const d = congelar(casoLongitudinal(semilla)), antes = JSON.stringify(d), g = P.geometria(d);
    const largo = d.vista.xMax - d.vista.xMin;
    for (let i = 0; i < g.particulas.length; i++) {
      const p = g.particulas[i], fisico = d.particulas[i];
      cerca(p.xEquilibrioPx, 24 + 17 * (i + 1), 'equilibrios equidistantes');
      cerca((p.x - p.xEquilibrioPx) / 272, (fisico.x - fisico.xEquilibrio) / largo, 'desplazamiento sin ampliar');
      assert.equal(p.y, 122);
      dentro(p.caja, 'anillo dentro del lienzo');
      if (i) assert.ok(g.particulas[i - 1].caja.x1 < p.caja.x0, 'los anillos permanecen ordenados y visibles');
    }
    const svg = P.dibujar(d);
    assert.equal((svg.match(/data-objeto="anillo"/g) || []).length, 15);
    assert.equal(JSON.stringify(d), antes);
    rotulosLibres(g);
    assert.ok(g.rotulos.find(r => r.id === 'nota').y1 < 256, 'la nota no sale por el margen inferior');
  }
});

test('las curvas auxiliares no crean otra cuerda resultante ni cambian su escala', () => {
  const d = casoTransversal(200);
  d.perfiles.unshift({ id: 'aporte', rol: 'aporte', puntos: [[d.vista.xMin, 0], [d.vista.xMax, 0.01]], color: 'h' });
  d.perfiles.push({ id: 'envolvente', rol: 'envolvente', puntos: [[d.vista.xMin, 0.02], [d.vista.xMax, 0.02]], color: 'i' });
  const g = P.geometria(d), svg = P.dibujar(d);
  assert.deepEqual(g.perfiles.map(p => p.discontinua), [true, false, true]);
  assert.equal((svg.match(/data-objeto="soga"/g) || []).length, 1);
  assert.equal((svg.match(/data-objeto="perfil-auxiliar"/g) || []).length, 2);
  assert.ok(svg.lastIndexOf('data-objeto="soga"') > svg.lastIndexOf('data-objeto="perfil-auxiliar"'), 'la cuerda principal se dibuja encima');
  d.perfiles.push({ ...d.perfiles[1], id: 'otra-cuerda' });
  assert.throws(() => P.geometria(d), /una sola cuerda/);
});

test('el corte solo controla qué se ve y no anticipa los rótulos del paso siguiente', () => {
  const d = casoTransversal(100);
  // La pieza no redacta el alt: en esta secuencia la descripción se limita a la
  // referencia, visible en todos los cortes. La unidad amplía el alt de cada paso.
  d.alt = 'Una línea horizontal señala la posición de equilibrio.';
  for (const k of ['perfiles', 'particulas', 'sensores', 'cotas', 'flechas', 'rotulos']) {
    for (const e of d[k]) { e.desde = 1; e.hasta = 1; }
  }
  for (const k of ['frente', 'mano', 'regla']) { d[k].desde = 1; d[k].hasta = 1; }
  for (const corte of [0, 2]) {
    const g = P.geometria(d, { corte }), svg = P.dibujar(d, { corte });
    for (const k of ['perfiles', 'particulas', 'sensores', 'cotas', 'flechas', 'rotulos']) assert.equal(g[k].length, 0);
    for (const k of ['frente', 'mano', 'regla']) assert.equal(g[k], null);
    assert.doesNotMatch(svg, /<text|data-objeto/);
    assert.match(svg, /aria-label="Una línea horizontal señala la posición de equilibrio\."/);
  }
  const g = P.geometria(d, { corte: 1 });
  assert.equal(g.perfiles.length, 1); assert.equal(g.sensores.length, 2);
  assert.match(P.dibujar(d, { corte: 1 }), />Marca material<\/text>/);
});

test('se rechazan geometrías fuera de escala en lugar de recortarlas', () => {
  const casos = [
    d => { d.perfiles[0].puntos[1][0] = d.vista.xMin - 1; },
    d => { d.perfiles[0].puntos[2][1] = d.vista.yMax * 1.01; },
    d => { d.particulas[0].x = d.vista.xMax + 0.1; },
    d => { d.particulas[0].xEquilibrio = NaN; },
    d => { d.frente.x = Infinity; },
    d => { d.vista.xMax = d.vista.xMin; },
    d => { d.vista.yMax = 0; },
    d => { d.perfiles[0].puntos.reverse(); },
    d => { d.cotas[0].hastaX = d.cotas[0].desdeX; }
  ];
  for (const cambiar of casos) {
    const d = casoTransversal(100); cambiar(d);
    assert.throws(() => P.geometria(d), /fis-ondas-e19:/);
  }
});

test('los textos usan rótulos completos del Kit, con color y escape de caracteres', () => {
  const d = casoTransversal(100);
  d.rotulos = [{ id: 'nombre', x: 2, y: 24, texto: 'Marca < 2 & 3 > 1', color: 'i', tam: 14 }];
  const g = P.geometria(d), r = g.rotulos.find(q => q.id === 'nombre'), svg = P.dibujar(d);
  assert.equal(r.x0, 4);
  assert.match(svg, /class="kit-txt"[^>]*fill="var\(--c-i\)"[^>]*>Marca &lt; 2 &amp; 3 &gt; 1<\/text>/);
  for (const incorrecto of [true, undefined, 'true', 'undefined', 'v_local', 'NaN']) {
    d.rotulos[0].texto = incorrecto;
    assert.throws(() => P.geometria(d), /texto visible válido/);
  }
  d.rotulos[0].texto = 'Marca'; d.rotulos[0].color = '#000000';
  assert.throws(() => P.geometria(d), /color fuera del kit/);
  d.rotulos[0].color = 'i'; d.rotulos[0].y = 258;
  assert.throws(() => P.geometria(d), /fuera del alto/);
  d.rotulos[0].y = 24; d.rotulos[0].texto = 'W'.repeat(60);
  assert.throws(() => P.geometria(d), /demasiado ancho/);
});

test('las cotas y las notas no se amontonan en el pie de la figura', () => {
  const d = casoTransversal(50);
  d.cotas.push({ ...d.cotas[0], id: 'segunda' });
  assert.throws(() => P.geometria(d), /una sola cota/);
  d.cotas.pop(); d.nota = 'Las alturas están ampliadas.';
  assert.throws(() => P.geometria(d), /leyenda externa/);
  d.cotas = [];
  const g = P.geometria(d);
  rotulosLibres(g);
  assert.equal(g.rotulos.find(r => r.id === 'nota').texto, d.nota);
});

test('las cajas de los objetos incluyen el contorno visible y la mano toca la cuerda', () => {
  for (const lado of ['izquierda', 'derecha']) {
    const d = casoTransversal(1); d.mano.lado = lado;
    const g = P.geometria(d), p = g.particulas[0], s = g.sensores[0];
    cerca(p.x - p.caja.x0, p.radio + 1.25, 'contorno de la marca destacada');
    cerca(s.x - s.caja.x0, 5, 'contorno del sensor');
    assert.equal(g.mano.contacto[0], lado === 'izquierda' ? g.perfiles[0].puntos[0][0] : g.perfiles[0].puntos.at(-1)[0]);
    assert.equal(g.mano.contacto[1], 122);
    dentro(g.mano.caja, 'la mano incluye el trazo sin salir del lienzo');
  }
});
