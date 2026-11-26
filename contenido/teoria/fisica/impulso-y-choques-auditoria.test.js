'use strict';
// Correcciones de la auditoría y del lector en frío (26 nov 2026; rutinas/auditoria/fisica.impulso-y-choques.md).
// Cada prueba falla con la versión que entregó la etapa 9.
const test = require('node:test');
const assert = require('node:assert/strict');
const def = require('./impulso-y-choques.js');
for (const ruta of def.requiere) require('../../..' + ruta);
const Pieza = require('../../../nucleo/kit/piezas/fis-estatica.js');

const plano = x => Array.isArray(x) ? x.map(plano).join('') : x && typeof x === 'object'
  ? (x.t !== undefined ? x.t : x.negrita !== undefined ? plano(x.negrita) : x.sub ? plano(x.sub[0]) + plano(x.sub[1])
    : x.vec ? plano(x.vec) : x.frac ? plano(x.frac[0]) + '/' + plano(x.frac[1]) : x.sup ? plano(x.sup[0]) + plano(x.sup[1]) : '')
  : String(x == null ? '' : x);
const idea = id => def.ideas.find(i => i.id === id);
const FIG = new Set(['dibujo', 'figura', 'revelar', 'verificacion', 'controles', 'testigo']);
function textos(x, out = []) {
  if (typeof x === 'string') out.push(x);
  else if (Array.isArray(x)) x.forEach(y => textos(y, out));
  else if (x && typeof x === 'object') for (const [k, y] of Object.entries(x)) if (!FIG.has(k) && !(x.pieza && k === 'datos') && typeof y !== 'function') textos(y, out);
  return out;
}
function figuras(x, out = []) {
  if (!x || typeof x !== 'object') return out;
  if (Array.isArray(x)) { x.forEach(y => figuras(y, out)); return out; }
  if (x.pieza && x.datos) out.push(x.datos);
  for (const y of Object.values(x)) if (y && typeof y === 'object') figuras(y, out);
  return out;
}
const casos = i => Array.from({ length: 60 }, (_, s) => [i.resuelve.generar(s), i.ahoraTu.generar(s)]).flat();

test('auditoría: ningún «_» crudo en lo que se lee fuera de las figuras (Datos, ecuaciones, pasos)', () => {
  for (const i of def.ideas) {
    const malos = textos([i, casos(i)]).filter(t => t.includes('_'));
    assert.deepEqual(malos.slice(0, 3), [], `${i.id}: ${malos.length} textos con «_» sin subíndice`);
    for (let k = 0; k < 4; k++) assert.ok(!plano(i.juega.lectura(Object.fromEntries(i.juega.controles.map(c => [c.id, c.inicio])))).includes('_'));
  }
});

test('auditoría: en las figuras, cada subíndice compuesto se dibuja entero y los ejes no llevan «_»', () => {
  const SUB = /([A-Za-zμτθ])_([A-Za-z0-9]{1,14}(?:,[A-Za-z0-9]{1,14})*(?:\([A-Za-z0-9]{1,3}\))?)/g;
  for (const i of def.ideas) for (const d of figuras([i, casos(i)])) {
    for (const t of [...(d.textos || []), ...(d.cortes || []).flatMap(c => c.textos || [])]) assert.ok(!t.texto.replace(SUB, '').includes('_'), `${i.id}: «${t.texto}»`);
    for (const eje of [d.x, d.y]) if (eje && eje.nombre) assert.ok(!eje.nombre.includes('_'), `${i.id}: eje «${eje.nombre}»`);
  }
  const s = Pieza.dibujar({ alto: 60, textos: [{ x: 12, y: 30, texto: 'P_total,x = 6 kg·m/s' }] }, {});
  assert.match(s, />total,x<\/tspan>/);
});

test('auditoría: ninguna flecha de velocidad queda reducida a su cabeza (16 px o más)', () => {
  for (const i of def.ideas) for (const d of figuras([i, casos(i)])) for (const f of [...(d.flechas || []), ...(d.cortes || []).flatMap(c => c.flechas || [])]) {
    if (f.color === 'o') assert.ok(f.largo >= 16, `${i.id}: flecha de ${f.largo} px`);
  }
});

test('auditoría: la flecha de p⃗ no pisa al carrito (idea 1)', () => {
  const d = idea('cantidad-movimiento').juega.dibujo({ mB: 3, vB: 2, t: 0 }).datos;
  for (const o of d.objetos) for (const f of d.flechas.filter(f => f.de[1] > o.y - 140 && f.de[1] < o.y)) {
    assert.ok(f.de[1] < o.y - 14 - o.h - 6, `flecha en y = ${f.de[1]} sobre el carrito que empieza en ${o.y - 14 - o.h}`);
  }
});

test('auditoría: «Así se resuelve» y «Ahora tú» no abren con el mismo tipo de problema', () => {
  for (const i of def.ideas) for (let s = 0; s < 6; s++) {
    const firma = c => `${c.tipo}/${(c.masas || []).length}`;
    assert.notEqual(firma(i.resuelve.generar(s).verificacion), firma(i.ahoraTu.generar(s).verificacion), `${i.id}, semilla ${s}`);
  }
});

test('auditoría: las alternativas no llevan «≈» (delataba la correcta o descartaba una)', () => {
  for (const i of def.ideas) {
    for (const [, a] of casos(i).entries()) if (a.opciones) for (const o of a.opciones) assert.ok(!plano(o.texto).includes('≈'), `${i.id}: «${plano(o.texto)}»`);
    for (const e of i.ejemplos) for (const t of e.alternativas || []) assert.ok(!t.includes('≈'), `${i.id} ${e.titulo}: «${t}»`);
    for (const o of i.predice.opciones) assert.ok(!plano(o.texto).includes('≈'), `${i.id} Predice: «${plano(o.texto)}»`);
  }
});

test('auditoría: restitución define e antes de predecir, y la predicción no repite el 0,5 de Lee', () => {
  const r = idea('restitucion');
  assert.match(plano(r.lee.tarjetas[1].texto), /separan[\s\S]*acercaban/);
  const c = r.predice.opciones.find(o => o.correcta);
  assert.equal(plano(c.texto), '0,8');
  assert.ok(!textos(r.lee.tarjetas[0].dibujo.datos).some(t => t.includes('0,8')));
  for (const p of r.mira.pasos) for (const t of textos(p)) assert.ok(!/= 0,5$/.test(t));
});

test('auditoría: los choques se dibujan en una sola pista y la pelota con sus cotas H y h', () => {
  const choque = idea('elastico-inelastico');
  for (const d of figuras([choque.lee, choque.predice, choque.ejemplos])) {
    const carros = (d.objetos || []).filter(o => o.tipo === 'carrito');
    if (carros.length === 2) assert.equal(carros[0].y, carros[1].y, 'A y B en la misma pista');
  }
  const pelota = idea('restitucion').lee.tarjetas[0].dibujo.datos;
  assert.ok(pelota.textos.some(t => t.texto === 'H') && pelota.textos.some(t => t.texto === 'h'));
  assert.ok(pelota.lineas.length >= 5);
});

test('auditoría: en el centro de masa, el orden de los carritos sigue sus posiciones', () => {
  for (const e of idea('centro-masa').ejemplos) {
    const p = e.verificacion.posiciones; if (!p || p.includes(null)) continue;
    const xs = e.figura.datos.objetos.filter(o => o.tipo === 'carrito').map(o => o.x);
    for (let a = 0; a < p.length; a++) for (let b = 0; b < p.length; b++) if (p[a] < p[b]) assert.ok(xs[a] < xs[b], e.titulo);
  }
});

test('auditoría: textos de centro de masa y sistema que ya no dicen algo falso', () => {
  for (const e of idea('centro-masa').ejemplos) {
    const n = e.verificacion.masas.length, t = textos([e.datos, e.solucion]).join(' ');
    if (n === 2) assert.ok(!t.includes('A, B y C'), e.titulo);
    if (!(e.verificacion.posiciones || []).includes(0)) assert.ok(!t.includes('situada en el origen'), e.titulo);
  }
  for (const e of idea('conservacion').ejemplos.filter(x => x.verificacion.tipo === 'tres')) {
    assert.ok(plano(e.datos).includes('A, B y C'), e.titulo);
    assert.match(plano(e.solucion.map(s => s.ecuacion)), /Pf,x = Pi,x = 1 · 5|Pf,x = Pi,x = 2 · 3/);
  }
});

test('auditoría: los choques con restitución muestran el total y el despeje, sin «1·» en los elásticos', () => {
  const choque = idea('elastico-inelastico'), rebote = idea('restitucion');
  for (const e of [...choque.ejemplos, ...rebote.ejemplos].filter(x => /elastico|restitucion-/.test(x.verificacion.tipo))) {
    const t = plano(e.solucion.map(s => [s.texto, s.ecuacion]));
    assert.match(t, /Reemplazamos/, e.titulo);
    assert.match(t, /Ptotal,x = /, e.titulo);
    if (e.verificacion.tipo.startsWith('elastico')) assert.ok(!/= 1·\(/.test(t), e.titulo);
  }
});

test('auditoría: los Datos del impulso dan el área con signo y las dos áreas, no la fórmula del caso', () => {
  for (const e of idea('impulso').ejemplos) {
    const d = plano(e.datos);
    assert.ok(!/\(pulso triangular\)|\(triángulo\)|\(rectángulo\)|\(fuerza constante\)/.test(d), e.titulo);
    if (['rect', 'tri', 'final', 'tiempo', 'tiempo-tri'].includes(e.verificacion.tipo)) assert.match(d, /área con signo/, e.titulo);
  }
});
