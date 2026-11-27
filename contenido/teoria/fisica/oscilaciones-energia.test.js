'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const def = require('./oscilaciones.js');
const pieza = require('../../../nucleo/kit/piezas/fis-estatica.js');
const Teoria = require('../../../nucleo/teoria.js');
const idea = def.ideas.find(i => i.id === 'energia-mas');

// Oráculo independiente: trabajo por trapecios de una fuerza lineal y raíces por bisección.
// No importa EP/EC/caso ni resultados de la teoría para construir los esperados.
function integrar(fn, a, b) {
  const h = (b - a) / 64;
  let sum = (fn(a) + fn(b)) / 2;
  for (let i = 1; i < 64; i++) sum += fn(a + i * h);
  return sum * h;
}
const elastica = (k, x) => integrar(q => k * q, 0, x);
const cinetica = (m, v) => integrar(u => m * u, 0, v);
function raiz(z) {
  assert.ok(z >= -1e-10, 'Un dato no debe pedir una raíz negativa.');
  let lo = 0, hi = Math.max(1, z);
  for (let i = 0; i < 100; i++) { const mid = (lo + hi) / 2; if (mid * mid > z) hi = mid; else lo = mid; }
  return (lo + hi) / 2;
}
function esperado(c) {
  const A = c.Acm / 100, x = c.xcm / 100;
  switch (c.tipo) {
    case 'total': return elastica(c.k, A);
    case 'potencial': return elastica(c.k, x);
    case 'cinetica-directa': return cinetica(c.m, c.v);
    case 'cinetica-datos': return c.EM - c.EPE;
    case 'mecanica-datos': return c.EC + c.EPE;
    case 'cinetica-balance': return integrar(q => -c.k * q, A, x);
    case 'rapidez-datos': return raiz(2 * (c.EM - c.EPE) / c.m);
    case 'amplitud': return raiz(2 * c.EM / c.k) * 100;
    case 'posicion': return raiz(2 * c.EPE / c.k) * 100;
    case 'velocidad': return c.sentido * raiz(2 * c.EC / c.m);
    case 'rapidez-balance': return raiz(2 * integrar(q => -c.k * q, A, x) / c.m);
    case 'amplitud-estado': return 100 * raiz(2 * (cinetica(c.m, c.v) + elastica(c.k, x)) / c.k);
    case 'posicion-cinetica': return 100 * raiz(2 * (elastica(c.k, A) - c.EC) / c.k);
    case 'rigidez': return 2 * cinetica(c.m, c.v) / (A * A);
    case 'rapidez-estados': return raiz(2 * (cinetica(c.m, c.v1) + integrar(q => -c.k * q, c.x1cm / 100, c.x2cm / 100)) / c.m);
    default: assert.fail('Familia sin oráculo: ' + c.tipo);
  }
}
function error(c, id) {
  const z = esperado(c), A = c.Acm / 100, x = c.xcm / 100;
  if (id === 'sin-medio') return z * 2;
  if (id === 'doble-medio' || id === 'medio') return z / 2;
  if (id === 'signo' || id === 'resta-inversa') return -z;
  if (id === 'metros') return z / 100;
  if (id === 'extremos') return z * 2;
  if (id === 'sin-dos') {
    if (c.tipo === 'amplitud-estado') return 100 * raiz(x * x + cinetica(c.m, c.v) / c.k);
    if (c.tipo === 'posicion-cinetica') return 100 * raiz(A * A - c.EC / c.k);
    return z / raiz(2);
  }
  if (id === 'sin-raiz') {
    if (['amplitud', 'posicion', 'amplitud-estado', 'posicion-cinetica'].includes(c.tipo)) return (z / 100) ** 2 * 100;
    if (c.tipo === 'velocidad') return c.sentido * z * z;
    return z * z;
  }
  if (id === 'sin-cuadrado') return c.tipo === 'total' ? c.k * A / 2 : c.tipo === 'potencial' ? c.k * Math.abs(x) / 2 : c.m * c.v / 2;
  if (id === 'centimetros') return c.tipo === 'rigidez' ? z / 10000 : z * 10000;
  if (id === 'sin-masa') return z / c.m;
  if (id === 'suma') return c.tipo === 'cinetica-datos' ? c.EM + c.EPE : elastica(c.k, A) + elastica(c.k, x);
  if (id === 'total') return c.tipo === 'cinetica-datos' ? c.EM : c.tipo === 'cinetica-balance' ? elastica(c.k, A) : c.tipo === 'rapidez-datos' ? raiz(2 * c.EM / c.m) : raiz(2 * elastica(c.k, A) / c.m);
  if (id === 'potencial') return c.tipo === 'cinetica-datos' ? c.EPE : c.tipo === 'cinetica-balance' ? elastica(c.k, x) : c.tipo === 'rapidez-datos' ? raiz(2 * c.EPE / c.m) : raiz(2 * elastica(c.k, x) / c.m);
  if (id === 'resta') return c.EC - c.EPE;
  if (id === 'solo-cinetica') return c.EC;
  if (id === 'solo-potencial') return c.EPE;
  if (id === 'promedio') return (c.EC + c.EPE) / 2;
  if (id === 'equilibrio') return 0;
  if (id === 'sin-posicion') return 100 * raiz(2 * cinetica(c.m, c.v) / c.k);
  if (id === 'posicion') return Math.abs(c.xcm);
  if (id === 'cinetica-por-elastica') return 100 * raiz(2 * c.EC / c.k);
  if (id === 'amplitud') return c.Acm;
  if (id === 'sin-cuadrado-A') return c.m * c.v * c.v / A;
  if (id === 'sin-cuadrado-v') return c.m * c.v / (A * A);
  if (id === 'sin-cambio') return c.v1;
  if (id === 'sin-inicial') return raiz(2 * integrar(q => -c.k * q, c.x1cm / 100, c.x2cm / 100) / c.m);
  if (id === 'suma-posiciones') return raiz(2 * (cinetica(c.m, c.v1) + elastica(c.k, c.x1cm / 100) + elastica(c.k, c.x2cm / 100)) / c.m);
  assert.fail('Distractor sin operación independiente: ' + id);
}
function cerca(a, b, contexto, tol = 1e-8) { assert.ok(Number.isFinite(a) && Math.abs(a - b) <= tol * Math.max(1, Math.abs(b)), `${contexto}: ${a} frente a ${b}`); }
function texto(x) {
  if (x == null) return '';
  if (typeof x !== 'object') return String(x);
  if (Array.isArray(x)) return x.map(texto).join('');
  if (x.sub) return texto(x.sub[0]) + '_' + texto(x.sub[1]);
  if (x.sup) return '(' + texto(x.sup[0]) + ')**(' + texto(x.sup[1]) + ')';
  if (x.frac) return '((' + texto(x.frac[0]) + ')/(' + texto(x.frac[1]) + '))';
  if (x.raiz) return 'sqrt(' + texto(x.raiz) + ')';
  if (x.par) return '(' + texto(x.par) + ')';
  if (x.t !== undefined) return String(x.t);
  if (x.negrita) return texto(x.negrita);
  return '';
}
function numero(x) { const s = texto(x).replace(/−/g, '-').replace(/(?<=\d)[\s\u00a0\u202f](?=\d{3}(?:\D|$))/g, '').replace(',', '.'); const m = s.match(/[-+]?\d+(?:\.\d+)?/); assert.ok(m, s); return Number(m[0]); }
function visible(x, esperado, contexto) {
  const s = texto(x), n = numero(x), dec = (s.replace(',', '.').match(/\d+\.(\d+)/) || ['', ''])[1].length;
  const tol = s.includes('≈') ? 0.50001 * 10 ** -dec : 1e-7;
  assert.ok(Math.abs(n - esperado) <= tol + 1e-9, `${contexto}: ${s}; esperado ${esperado}`);
}
function variables(c) {
  const z = esperado(c), vars = { k: c.k, m: c.m, x: c.xcm / 100, A: c.Acm / 100, v: c.v, E_C: c.EC, E_PE: c.EPE, E_M: c.EM,
    x_1: c.x1cm / 100, x_2: c.x2cm / 100, v_1: c.v1, v_2: z };
  if (c.tipo === 'total') Object.assign(vars, { x: vars.A, E_M: z, E_PE: z, E_C: 0 });
  if (c.tipo === 'potencial') vars.E_PE = z;
  if (c.tipo === 'cinetica-directa') Object.assign(vars, { E_C: z, x: 0 });
  if (c.tipo === 'cinetica-datos') vars.E_C = z;
  if (c.tipo === 'mecanica-datos') vars.E_M = z;
  if (['cinetica-balance', 'rapidez-balance', 'posicion-cinetica'].includes(c.tipo)) {
    if (c.tipo === 'posicion-cinetica') vars.x = z / 100;
    vars.E_M = elastica(c.k, vars.A); vars.E_PE = elastica(c.k, vars.x); vars.E_C = vars.E_M - vars.E_PE;
    if (c.tipo === 'rapidez-balance') vars.v = z;
  }
  if (c.tipo === 'rapidez-datos') Object.assign(vars, { E_C: c.EM - c.EPE, v: z });
  if (c.tipo === 'amplitud') Object.assign(vars, { A: z / 100, x: z / 100, E_PE: c.EM, E_C: 0 });
  if (c.tipo === 'posicion') vars.x = z / 100;
  if (c.tipo === 'velocidad') vars.v = z;
  if (c.tipo === 'amplitud-estado') Object.assign(vars, { A: z / 100, E_C: cinetica(c.m, c.v), E_PE: elastica(c.k, vars.x), E_M: cinetica(c.m, c.v) + elastica(c.k, vars.x) });
  if (c.tipo === 'rigidez') Object.assign(vars, { k: z, x: 0, E_C: cinetica(c.m, c.v), E_M: cinetica(c.m, c.v), E_PE: 0 });
  return vars;
}
function evaluar(s, vars) {
  s = s.replace(/\|([^|]+)\|/g, 'abs($1)').replace(/,/g, '.').replace(/−/g, '-').replace(/[·×]/g, '*').replace(/÷/g, '/');
  s = s.replace(/(\d)\s*(?:m\/s²|m\/s|N\/m|kg|cm|J|m|s)(?=\s|\)|$)/g, '$1');
  for (const k of Object.keys(vars).sort((a, b) => b.length - a.length)) s = s.replace(new RegExp('(?<![A-Za-z_])' + k + '(?![A-Za-z_0-9])', 'g'), '(' + vars[k] + ')');
  assert.ok(/^[\d\s.()+\-*/sqrtabseENaInfiy]+$/.test(s), 'Expresión desconocida: ' + s);
  let n;
  try { n = Function('sqrt', 'abs', 'return (' + s + ');')(raiz, Math.abs); }
  catch (e) { throw new Error('No se pudo evaluar: ' + s + '; ' + e.message); }
  assert.ok(Number.isFinite(n), 'Expresión no finita: ' + s);
  return n;
}
function ecuaciones(c, pasos) {
  for (const p of pasos || []) {
    if (!p || !p.ecuacion) continue;
    for (const ecuacion of texto(p.ecuacion).split(';')) {
      const lados = ecuacion.split(/(=|≈)/).map(s => s.trim());
      if (lados.length < 3) continue;
      const vars = variables(c), enCm = /\bcm\b/.test(ecuacion);
      if (enCm) { vars.A *= 100; vars.x *= 100; }
      const base = evaluar(lados[0], vars);
      for (let i = 2; i < lados.length; i += 2) {
        const actual = evaluar(lados[i], vars);
        const tol = lados[i - 1] === '≈' ? 0.000501 : 1e-7 * Math.max(1, Math.abs(base));
        assert.ok(Math.abs(actual - base) <= tol, `${c.tipo}: ${ecuacion}; ${actual} frente a ${base}`);
      }
    }
  }
}
const CAUSAS = { 'sin-medio': /dos/, 'doble-medio': /dos/, 'sin-cuadrado': /cuadrado/, centimetros: /centímetros/, signo: /signo/, 'sin-masa': /masa/,
  suma: /sum/, total: /total|mecánica|restar|elástica/, potencial: /resorte|elástica/, 'resta-inversa': /orden|invert/, resta: /rest/, 'solo-cinetica': /resorte/, 'solo-potencial': /movimiento/, promedio: /promedio/,
  'sin-dos': /dos|medio/, 'sin-raiz': /raíz/, metros: /metros/, extremos: /extremos/, equilibrio: /reposo/, 'sin-posicion': /elástica/, posicion: /posición/, 'cinetica-por-elastica': /cinética.*elástica/, amplitud: /toda.*elástica/,
  medio: /medio/, 'sin-cuadrado-A': /amplitud.*cuadrado/, 'sin-cuadrado-v': /rapidez.*cuadrado/, 'sin-cambio': /cambio/, 'sin-inicial': /inicial/, 'suma-posiciones': /sum/ };
function entradasVisibles(obj) {
  const encontrados = [];
  function walk(x) { if (!x || typeof x !== 'object') return; if (x.m && typeof x.t === 'string' && /\d/.test(x.t)) encontrados.push({ clave: x.m, valor: numero(x.t) }); if (Array.isArray(x)) x.forEach(walk); else Object.values(x).forEach(walk); }
  walk([obj.enunciado || obj.pregunta, obj.datos]);
  const map = { m: 'm', k: 'k', Acm: 'A', xcm: 'x', x1cm: 'x', x2cm: 'x', v: 'v', v1: 'v', EC: 'EC', EM: 'EM', EPE: 'EPE' };
  for (const [k, clave] of Object.entries(map)) if (obj.caso[k] !== undefined) {
    const valor = obj.caso[k] / (obj.caso.metros && ['Acm', 'xcm'].includes(k) ? 100 : 1);
    assert.ok(encontrados.some(e => e.clave === clave && Math.abs(e.valor - valor) < 1e-8), `${obj.caso.tipo}: falta entrada visible ${k}`);
  }
  for (const d of obj.datos) assert.ok(!/E_C|E_PE|E_M|k\s*[·*]|v\s*\*\*|x\s*\*\*/.test(texto(d)), 'Datos sin fórmulas: ' + texto(d));
}
function casoCompleto(obj) {
  const c = obj.caso, z = esperado(c); cerca(c.valor, z, c.tipo);
  entradasVisibles(obj);
  if (obj.respuesta) visible(obj.respuesta, z, c.tipo + ' respuesta');
  ecuaciones(c, Array.isArray(obj.solucion) ? obj.solucion : obj.pasos || [obj.solucion]);
  for (const e of c.errores || []) cerca(e.valor, error(c, e.id), c.tipo + '/' + e.id);
  if (obj.opciones) {
    assert.equal(obj.opciones.filter(o => o.correcta).length, 1);
    assert.equal(obj.opciones.filter(o => Math.abs(o.valor - z) < 1e-8).length, 1);
    assert.equal(new Set(obj.opciones.map(o => o.texto)).size, obj.opciones.length);
    for (const op of obj.opciones) {
      const id = op.error && op.error.replace('OS-ENE-', ''), esperadoOp = op.correcta ? z : error(c, id);
      cerca(op.valor, esperadoOp, 'opción'); visible(op.texto, esperadoOp, 'opción visible');
      if (!op.correcta) { assert.match(op.siFuera, CAUSAS[id], c.tipo + ' causa de ' + id); assert.ok(op.siFuera.startsWith('Bien ')); }
    }
  }
  if (c.Acm !== undefined && c.xcm !== undefined) assert.ok(Math.abs(c.xcm) <= c.Acm);
  if (c.tipo === 'amplitud-estado') assert.ok(z > Math.abs(c.xcm));
  if (c.tipo === 'posicion-cinetica') assert.ok(z < c.Acm && z > 0);
  if (c.tipo === 'rapidez-estados') assert.ok(Math.abs(c.x2cm) < Math.abs(c.x1cm) && z > c.v1);
  return z;
}
test('energía MAS: quince ejemplos, progresión y cinco alternativas equilibradas por nivel', () => {
  assert.equal(idea.ejemplos.length, 15);
  const esperados = [0.5, 1, 1.8, 1.8, 2.6, 1.2, 2, 15, 6, -2, 2.1908902300206643, 18.027756377319946, 8, 240, 1.668532289169137];
  const letras = [];
  for (let i = 0; i < 15; i++) {
    const e = idea.ejemplos[i], z = casoCompleto(e); cerca(z, esperados[i], 'tabla independiente ' + i);
    assert.equal(e.nivel, 1 + Math.floor(i / 5));
    if (e.alternativas) {
      assert.equal(e.alternativas.length, 5);
      letras.push(e.alternativas.findIndex(o => Math.abs(numero(o) - z) < 0.00051));
      const explicacion = texto(e.solucion.at(-1).texto);
      for (const mal of e.caso.errores) assert.ok(explicacion.includes(String(Math.round(mal.valor * 1000) / 1000).replace('.', ',')), 'Se explica cada valor incorrecto.');
    }
  }
  assert.deepEqual(letras, [0, 1, 2, 3, 4]);
});
test('energía MAS: 400 semillas por banco, balances, alternativas y ninguna precisión oculta', () => {
  const familias = new Set(), resueltos = new Set(), preguntas = new Set();
  for (let s = 0; s < 400; s++) {
    for (const [nombre, gen] of [['resuelve', idea.resuelve], ['ahora', idea.ahoraTu]]) {
      const obj = gen.generar(s); casoCompleto(obj); familias.add(obj.caso.tipo);
      (nombre === 'resuelve' ? resueltos : preguntas).add(JSON.stringify(obj.caso));
    }
  }
  assert.equal(familias.size, 10);
  for (const key of resueltos) assert.ok(!preguntas.has(key));
  for (const e of idea.ejemplos) { assert.ok(!resueltos.has(JSON.stringify(e.caso))); assert.ok(!preguntas.has(JSON.stringify(e.caso))); }
  const primerasR = new Set(Array.from({ length: 4 }, (_, s) => idea.resuelve.generar(s).caso.tipo));
  for (let s = 0; s < 12; s++) assert.ok(!primerasR.has(idea.ahoraTu.generar(s).caso.tipo));
});
test('energía MAS: predicción calculada y pasos de Mira sin anticipar su reparto', () => {
  const p = idea.predice, z = esperado(p.caso); cerca(z, 3, 'Predice'); casoCompleto(p);
  const em = elastica(200, 0.2), epe = elastica(200, 0.1); cerca(em - epe, z, 'trabajo y balance');
  ecuaciones(p.caso, idea.mira.pasos.slice(0, 3));
  const previo = JSON.stringify([idea.lee, idea.juega.consigna, idea.juega.mision, idea.juega.leyenda]);
  assert.ok(!previo.includes('3 J') && !previo.includes('200 N/m'));
  assert.equal(p.dibujo.datos.objetos.filter(o => o.tipo === 'barra-e').length, 0);
  const cuerpo = p.dibujo.datos.objetos.find(o => o.tipo === 'caja'); cerca(cuerpo.x, 178 + 4 * p.caso.Acm, 'figura muestra el extremo inicial');
  const barras = p.revelar.datos.objetos.filter(o => o.tipo === 'barra-e');
  [z, epe, em].forEach((e, i) => cerca(barras[i].h, e * 36, 'escala del reparto'));
  cerca(barras[0].h + barras[1].h, barras[2].h, 'partes y total');
  for (let s = 0; s < 400; s++) {
    const c = { tipo: 'rapidez-balance', k: 60 + s, m: 0.4 + (s % 4) / 10, Acm: 16, xcm: s % 2 ? -5 : 7 };
    ecuaciones(c, [...idea.mira.pasos.slice(3), idea.regla]);
  }
});
test('energía MAS: misión, escala común y tiempo del control idéntico al usado por el dibujo', () => {
  assert.equal(idea.juega.mision.logrado({ A: 10, t: 0 }), false);
  assert.deepEqual([5, 10, 15, 20].filter(A => idea.juega.mision.logrado({ A, t: 0 })), [15]);
  for (const A of [5, 10, 15, 20]) for (let s = 0; s < 400; s++) {
    const t = (s * 0.0075143) % 3, canon = Number(t.toFixed(2)), val = { A, t }, d = idea.juega.dibujo(val).datos;
    const cuerpo = d.objetos.find(o => o.tipo === 'caja'), barras = d.objetos.filter(o => o.tipo === 'barra-e');
    // La ecuación temporal se comprueba contra una fase calculada desde el período, no desde el helper de la escena.
    const periodo = 2 * Math.PI * raiz(0.4 / 80), xcm = A * Math.cos(2 * Math.PI * canon / periodo);
    cerca(cuerpo.x, 178 + 4 * xcm, 'posición física y escala4px/cm');
    cerca(barras[0].h, elastica(80, 0.1) * 60, 'referencia');
    cerca(barras[1].h, elastica(80, A / 100) * 60, 'ensayo');
    assert.equal(barras.length, 2, 'Antes de Predice solo se muestran energías totales.');
    const lectura = texto(idea.juega.lectura(val));
    assert.ok(lectura.includes(String(Math.round(elastica(80, A / 100) * 1000) / 1000).replace('.', ',')));
  }
});
function geometria(fig) {
  const g = pieza.geometria(fig.datos, fig.estado || {});
  for (const r of g.rotulos) for (const [n, v, lim] of [['x0', r.x0, 4], ['y0', r.y0, 4]]) assert.ok(v >= lim - 1e-7, n + ' ' + JSON.stringify(r));
  for (const r of g.rotulos) { assert.ok(r.x1 <= 316 + 1e-7, JSON.stringify(r)); assert.ok(r.y1 <= (fig.datos.alto || 240) - 4 + 1e-7, JSON.stringify(r)); }
  for (let i = 0; i < g.rotulos.length; i++) for (let j = i + 1; j < g.rotulos.length; j++) {
    const a = g.rotulos[i], b = g.rotulos[j];
    assert.ok(!(a.x0 < b.x1 - 0.2 && b.x0 < a.x1 - 0.2 && a.y0 < b.y1 - 0.2 && b.y0 < a.y1 - 0.2), 'Rótulos cruzados: ' + JSON.stringify([a, b]));
  }
  const pisa = (a, b) => a.x0 < b.x1 - 0.5 && b.x0 < a.x1 - 0.5 && a.y0 < b.y1 - 0.5 && b.y0 < a.y1 - 0.5;
  for (const r of g.rotulos) for (const o of g.objetos) assert.ok(!pisa(r, o), 'Rótulo sobre objeto: ' + JSON.stringify([r, o]));
  for (const o of g.objetos) assert.ok(o.x0 >= 3 && o.x1 <= 317 && o.y0 >= 3 && o.y1 <= fig.datos.alto - 3, 'Objeto fuera del lienzo: ' + JSON.stringify(o));
  const lineas = [...(fig.datos.lineas || [])];
  if (fig.datos.piso) lineas.push({ de: [fig.datos.piso.x0, fig.datos.piso.y], a: [fig.datos.piso.x1, fig.datos.piso.y] });
  for (const r of g.rotulos) for (const l of lineas) {
    const [x1, y1] = l.de, [x2, y2] = l.a;
    let entra = false;
    for (let q = 0; q <= 500; q++) { const x = x1 + (x2 - x1) * q / 500, y = y1 + (y2 - y1) * q / 500; if (x > r.x0 + 1 && x < r.x1 - 1 && y > r.y0 + 1 && y < r.y1 - 1) entra = true; }
    assert.ok(!entra, 'Rótulo cruzado por guía o piso: ' + JSON.stringify([r, l]));
  }
}
test('energía MAS: figuras estáticas y generadas con rótulos legibles dentro del lienzo', () => {
  const figs = [idea.lee.tarjetas[0].dibujo, idea.predice.dibujo, idea.predice.revelar, idea.regla.dibujo, ...idea.ejemplos.map(e => e.figura)];
  for (let s = 0; s < 400; s++) figs.push(idea.resuelve.generar(s).dibujo, idea.ahoraTu.generar(s).dibujo, idea.juega.dibujo({ A: [5, 10, 15, 20][s % 4], t: s * 0.00751 }));
  for (const fig of figs) geometria(fig);
});
test('energía MAS: calidad 2 simulada en400 semillas, sin marcar la unidad', () => {
  const { laboratorio, laboratorioIdeas, ...base } = def;
  const d = { ...base, calidad: 2, ideas: [idea], glosario: def.glosario.filter(g => ['oscilación libre', 'punto de retorno'].includes(g.termino)) };
  assert.deepEqual(Teoria.problemas(d, { semillas: 400 }), []);
});
