#!/usr/bin/env node
// Genera los .riv de la prueba de estrés (app/mascotas/estres/): chica.riv, grande.riv y dedo.riv.
// Son archivos propios, hechos con herramientas/estres-rive/riv.js; no son arte final, solo carga para medir.
// Uso: node herramientas/estres-rive/generar.js   (escribe en app/mascotas/estres/)
'use strict';
const fs = require('fs');
const path = require('path');
const { escribir, color, ANIMABLE } = require('./riv.js');

const RAD = Math.PI / 180;

// Arma un artboard y lleva la cuenta de los índices (el artboard es el 0; los padres se nombran por índice).
function nuevoArtboard(nombre, ancho, alto) {
  const objs = [{ tipo: 'Artboard', props: { name: nombre, width: ancho, height: alto, x: 0, y: 0, clip: 1 } }];
  let n = 0;   // índice del último componente
  const ab = {
    objs, ids: {},
    agregar(tipo, props) { objs.push({ tipo, props }); return ++n; },
    // Rive dibuja encima lo que va primero en el archivo: formas() recibe la lista de atrás hacia adelante
    // y la agrega al revés.
    formas(lista) { for (const f of lista.slice().reverse()) this.forma(f.id, f); },
    // Una forma: Shape + trazado + relleno (+ contorno).
    forma(id, { x, y, trazado, relleno, contorno, grosor = 3, padre = 0 }) {
      const s = this.agregar('Shape', { name: id, parentId: padre, x, y });
      this.ids[id] = s;
      if (trazado.tipo === 'elipse') this.agregar('Ellipse', { parentId: s, width: trazado.ancho, height: trazado.alto });
      else if (trazado.tipo === 'rect') this.agregar('Rectangle', { parentId: s, width: trazado.ancho, height: trazado.alto, linkCornerRadius: 1, cornerRadiusTL: trazado.radio || 0 });
      else {
        const p = this.agregar('PointsPath', { parentId: s, isClosed: 1 });
        for (const v of trazado.puntos) this.agregar('StraightVertex', { parentId: p, x: v.x, y: v.y, radius: v.r || 0 });
      }
      if (contorno) { const st = this.agregar('Stroke', { parentId: s, thickness: grosor, cap: 1, join: 1 }); this.agregar('SolidColor', { parentId: st, colorValue: color(contorno) }); }
      const f = this.agregar('Fill', { parentId: s });
      this.agregar('SolidColor', { parentId: f, colorValue: color(relleno) });
      return s;
    },
  };
  return ab;
}

// Animación lineal: pistas [{ id, prop, claves: [[cuadro, valor], ...] }]. rotation va en grados y se pasa a radianes.
function animacion(ab, nombre, duracion, bucle, pistas) {
  ab.objs.push({ tipo: 'LinearAnimation', props: { name: nombre, fps: 60, duration: duracion, loopValue: bucle ? 1 : 0 } });
  const porObjeto = new Map();
  for (const p of pistas) { const k = ab.ids[p.id]; if (k === undefined) throw new Error('sin forma ' + p.id); if (!porObjeto.has(k)) porObjeto.set(k, []); porObjeto.get(k).push(p); }
  for (const [k, ps] of porObjeto) {
    ab.objs.push({ tipo: 'KeyedObject', props: { objectId: k } });
    for (const p of ps) {
      ab.objs.push({ tipo: 'KeyedProperty', props: { propertyKey: ANIMABLE[p.prop] } });
      for (const [f, v] of p.claves) ab.objs.push({ tipo: 'KeyFrameDouble', props: { frame: f, interpolationType: 1, value: p.prop === 'rotation' ? v * RAD : v } });
    }
  }
}

// Máquina de estados. capas: [{ nombre, estado: { animacion } | { mezcla: { entrada, puntos: [[animacion, valor]] } } }].
function maquina(ab, nombre, entradas, capas, animaciones) {
  ab.objs.push({ tipo: 'StateMachine', props: { name: nombre } });
  for (const e of entradas) ab.objs.push({ tipo: 'StateMachineNumber', props: { name: e.nombre, value: e.valor } });
  for (const c of capas) {
    ab.objs.push({ tipo: 'StateMachineLayer', props: { name: c.nombre } });
    ab.objs.push({ tipo: 'EntryState', props: {} });
    ab.objs.push({ tipo: 'StateTransition', props: { stateToId: 3 } });
    ab.objs.push({ tipo: 'AnyState', props: {} });
    ab.objs.push({ tipo: 'ExitState', props: {} });
    if (c.estado.animacion) ab.objs.push({ tipo: 'AnimationState', props: { animationId: animaciones.indexOf(c.estado.animacion) } });
    else {
      const m = c.estado.mezcla;
      ab.objs.push({ tipo: 'BlendState1DInput', props: { inputId: entradas.findIndex(e => e.nombre === m.entrada) } });
      for (const [a, v] of m.puntos) ab.objs.push({ tipo: 'BlendAnimation1D', props: { animationId: animaciones.indexOf(a), value: v } });
    }
  }
}

// Azar con semilla: el archivo sale igual cada vez.
function azarCon(semilla) { let s = semilla; return () => ((s = (s * 1103515245 + 12345) % 2147483648) / 2147483648); }
const PAL = ['#ff9fbf', '#cdb9ff', '#ffd36e', '#9fe3c9', '#8fc7ff', '#ffb38a'];
const TINTA = '#3b2a52';
function estrella(n, r1, r2) {
  const pts = [];
  for (let i = 0; i < 2 * n; i++) { const a = Math.PI * i / n, r = i % 2 ? r2 : r1; pts.push({ x: +(r * Math.cos(a)).toFixed(1), y: +(r * Math.sin(a)).toFixed(1) }); }
  return pts;
}

// 1) Chica: un gatito de 10 formas, del tamaño de la mascota, en bucle de 1 s (peor caso: nunca descansa).
function chica() {
  const ab = nuevoArtboard('Chica', 240, 240);
  const F = [
    ['cola', 168, 176, { puntos: [{ x: 0, y: 0 }, { x: 34, y: -26 }, { x: 40, y: -58, r: 6 }, { x: 26, y: -62, r: 6 }, { x: 24, y: -34 }, { x: -6, y: -12 }] }, '#ffc7da'],
    ['cuerpo', 120, 176, { tipo: 'elipse', ancho: 110, alto: 90 }, '#fff6ee'],
    ['orejaI', 86, 74, { puntos: [{ x: -22, y: 22 }, { x: -12, y: -30, r: 4 }, { x: 20, y: 12 }] }, '#ffc7da'],
    ['orejaD', 154, 74, { puntos: [{ x: 22, y: 22 }, { x: 12, y: -30, r: 4 }, { x: -20, y: 12 }] }, '#ffc7da'],
    ['cabeza', 120, 108, { tipo: 'elipse', ancho: 124, alto: 100 }, '#fff6ee'],
    ['collar', 120, 154, { tipo: 'rect', ancho: 64, alto: 10, radio: 5 }, '#cdb9ff'],
  ];
  const ys = {}, lista = [];
  for (const [id, x, y, tr, rell] of F) { lista.push({ id, x, y, trazado: tr.tipo ? tr : { puntos: tr.puntos }, relleno: rell, contorno: TINTA, grosor: 4 }); ys[id] = y; }
  for (const [id, x, y, w, h, c] of [['ojoI', 98, 104, 12, 16, TINTA], ['ojoD', 142, 104, 12, 16, TINTA], ['mejI', 84, 124, 18, 10, '#ff9fbf'], ['mejD', 156, 124, 18, 10, '#ff9fbf']]) {
    lista.push({ id, x, y, trazado: { tipo: 'elipse', ancho: w, alto: h }, relleno: c }); ys[id] = y;
  }
  ab.formas(lista);
  const pistas = Object.keys(ys).map(id => ({ id, prop: 'y', claves: [[0, ys[id]], [30, ys[id] - 14], [60, ys[id]]] }));
  pistas.push({ id: 'cola', prop: 'rotation', claves: [[0, 0], [30, -18], [60, 0]] });
  pistas.push({ id: 'orejaI', prop: 'rotation', claves: [[0, 0], [20, -12], [60, 0]] });
  for (const id of ['ojoI', 'ojoD']) pistas.push({ id, prop: 'scaleY', claves: [[0, 1], [50, 1], [54, 0.1], [58, 1], [60, 1]] });
  animacion(ab, 'vida', 60, true, pistas);
  maquina(ab, 'Estres', [], [{ nombre: 'vida', estado: { animacion: 'vida' } }], ['vida']);
  return ab.objs;
}

// 2) Grande: 128 estrellas de 12 puntas con contorno; cada una gira, se infla y sube y baja (512 pistas). Pesa cerca del tope de 100 KB de la sección 6.3.
function grande(n = 128) {
  const azar = azarCon(12345);
  const ab = nuevoArtboard('Grande', 480, 480);
  const lista = [{ id: 'fondo', x: 240, y: 240, trazado: { tipo: 'rect', ancho: 480, alto: 480 }, relleno: '#fffaf5' }];
  const pistas = [];
  for (let i = 0; i < n; i++) {
    const id = 'e' + i, x = +(20 + azar() * 440).toFixed(1), y = +(20 + azar() * 440).toFixed(1), r = 10 + azar() * 22;
    lista.push({ id, x, y, trazado: { puntos: estrella(12, r, r * 0.55) }, relleno: PAL[i % PAL.length], contorno: TINTA, grosor: 2 });
    const d = [60, 80, 120, 240][i % 4];   // todas cierran en 240 cuadros
    const esc = []; for (let f = 0; f <= 240; f += d) esc.push([f, 1], [Math.min(240, f + d / 2), 1.3]);
    esc.length = esc.length - 1; esc.push([240, 1]);
    pistas.push({ id, prop: 'rotation', claves: [[0, 0], [240, i % 2 ? 360 : -360]] });
    pistas.push({ id, prop: 'scaleX', claves: esc });
    pistas.push({ id, prop: 'scaleY', claves: esc });
    pistas.push({ id, prop: 'y', claves: [[0, y], [120, y + 12], [240, y]] });
  }
  ab.formas(lista);
  animacion(ab, 'vida', 240, true, pistas);
  maquina(ab, 'Estres', [], [{ nombre: 'vida', estado: { animacion: 'vida' } }], ['vida']);
  return ab.objs;
}

// 3) Dedo: una pelota que la página mueve con las entradas «x» e «y» (0 a 100) y 40 estrellas que giran.
function dedo() {
  const azar = azarCon(777);
  const ab = nuevoArtboard('Dedo', 360, 360);
  // La pelota va primero (encima): un grupo (Node) con el cuerpo y el brillo; las entradas mueven el grupo.
  const g = ab.agregar('Node', { name: 'pelota', parentId: 0, x: 180, y: 180 });
  ab.ids.pelota = g;
  ab.formas([
    { id: 'cuerpo', x: 0, y: 0, padre: g, trazado: { tipo: 'elipse', ancho: 64, alto: 64 }, relleno: '#7f5ae0', contorno: TINTA, grosor: 4 },
    { id: 'brillo', x: -12, y: -12, padre: g, trazado: { tipo: 'elipse', ancho: 16, alto: 12 }, relleno: '#efe7ff' },
  ]);
  const lista = [{ id: 'fondo', x: 180, y: 180, trazado: { tipo: 'rect', ancho: 360, alto: 360 }, relleno: '#fffaf5' }];
  const pistas = [];
  for (let i = 0; i < 40; i++) {
    const id = 'e' + i, x = +(15 + azar() * 330).toFixed(1), y = +(15 + azar() * 330).toFixed(1), r = 8 + azar() * 14;
    lista.push({ id, x, y, trazado: { puntos: estrella(8, r, r * 0.5) }, relleno: PAL[i % PAL.length], contorno: TINTA, grosor: 2 });
    pistas.push({ id, prop: 'rotation', claves: [[0, 0], [120, i % 2 ? 360 : -360]] });
  }
  ab.formas(lista);
  animacion(ab, 'vida', 120, true, pistas);
  animacion(ab, 'x0', 1, false, [{ id: 'pelota', prop: 'x', claves: [[0, 32]] }]);
  animacion(ab, 'x100', 1, false, [{ id: 'pelota', prop: 'x', claves: [[0, 328]] }]);
  animacion(ab, 'y0', 1, false, [{ id: 'pelota', prop: 'y', claves: [[0, 32]] }]);
  animacion(ab, 'y100', 1, false, [{ id: 'pelota', prop: 'y', claves: [[0, 328]] }]);
  maquina(ab, 'Estres', [{ nombre: 'x', valor: 50 }, { nombre: 'y', valor: 50 }], [
    { nombre: 'vida', estado: { animacion: 'vida' } },
    { nombre: 'x', estado: { mezcla: { entrada: 'x', puntos: [['x0', 0], ['x100', 100]] } } },
    { nombre: 'y', estado: { mezcla: { entrada: 'y', puntos: [['y0', 0], ['y100', 100]] } } },
  ], ['vida', 'x0', 'x100', 'y0', 'y100']);
  return ab.objs;
}

const ARCHIVOS = { chica, grande, dedo };

function generar(nombre) { return escribir([{ tipo: 'Backboard', props: {} }, ...ARCHIVOS[nombre]()]); }

if (require.main === module) {
  const dest = path.join(__dirname, '..', '..', 'app', 'mascotas', 'estres');
  fs.mkdirSync(dest, { recursive: true });
  for (const n of Object.keys(ARCHIVOS)) {
    const b = generar(n);
    fs.writeFileSync(path.join(dest, n + '.riv'), b);
    console.log(`${n}.riv: ${(b.length / 1024).toFixed(1)} KB`);
  }
}

module.exports = { generar, ARCHIVOS };
