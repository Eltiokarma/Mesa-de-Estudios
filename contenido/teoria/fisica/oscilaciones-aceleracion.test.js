/* Comprobación independiente de aceleracion-al-centro. La fuerza se obtiene
 * de diferencias exactas de energía elástica; no se importa el calculador de la unidad. */
'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const repo = path.resolve(__dirname, '../../..');
const def = require('./oscilaciones.js');
const idea = def.ideas.find(i => i.id === 'aceleracion-al-centro');
const pieza = require('../../../nucleo/kit/piezas/fis-estatica.js');
const cerca = (a, b, msg = '', tol = 1e-9) => assert.ok(Math.abs(a - b) <= tol * Math.max(1e-20, Math.abs(a), Math.abs(b)), `${msg}: ${a} ≠ ${b}`);
function gcd(a, b) { a = a < 0n ? -a : a; b = b < 0n ? -b : b; while (b) [a, b] = [b, a % b]; return a || 1n; }
class R {
  constructor(n, d = 1n) { n = BigInt(n); d = BigInt(d); assert.notEqual(d, 0n); if (d < 0n) { n = -n; d = -d; } const g = gcd(n, d); this.n = n / g; this.d = d / g; }
  static de(x) { if (x instanceof R) return x; const [b, e = '0'] = String(x).toLowerCase().split('e'), [a, z = ''] = b.split('.'); let n = BigInt(a + z), d = 10n ** BigInt(z.length), ex = Number(e); if (ex > 0) n *= 10n ** BigInt(ex); if (ex < 0) d *= 10n ** BigInt(-ex); return new R(n, d); }
  add(x) { x = R.de(x); return new R(this.n * x.d + x.n * this.d, this.d * x.d); }
  neg() { return new R(-this.n, this.d); }
  sub(x) { return this.add(R.de(x).neg()); }
  mul(x) { x = R.de(x); return new R(this.n * x.n, this.d * x.d); }
  div(x) { x = R.de(x); return new R(this.n * x.d, this.d * x.n); }
  val() { return Number(this.n) / Number(this.d); }
}
const q = R.de, cm = n => q(n).div(100), energia = (k, x) => q(k).mul(x).mul(x).div(2);
function fuerza(k, x) { const h = q(0.1); return energia(k, q(x).add(h)).sub(energia(k, q(x).sub(h))).div(h.mul(2)).neg(); }
const rigidez = (F, x) => q(F).div(fuerza(1, x));
const posicion = (F, k) => q(F).div(fuerza(k, 1));
function independiente(c) {
  let valor, unidad, k, m, x, F, a, x_1, x_2, a_1, a_2, m_1, m_2;
  if (c.k != null) k = q(c.k); if (c.m != null) m = q(c.m); if (c.x != null) x = q(c.x);
  if (c.xcm != null) x = cm(c.xcm); if (c.x1cm != null) x_1 = cm(c.x1cm); if (c.x2cm != null) x_2 = cm(c.x2cm);
  if (c.a1 != null) a_1 = q(c.a1); if (c.a != null) a = q(c.a); if (c.F != null) F = q(c.F);
  switch (c.tipo) {
    case 'fuerza': F = fuerza(k, x); valor = F; unidad = 'N'; break;
    case 'aceleracion': a = F.div(m); valor = a; unidad = 'm/s²'; break;
    case 'rigidez': k = rigidez(F, x); valor = k; unidad = 'N/m'; break;
    case 'posicion': x = posicion(F, k); valor = x; unidad = 'm'; break;
    case 'aceleracion-cm': F = fuerza(k, x); a = F.div(m); valor = a; unidad = 'm/s²'; break;
    case 'aceleracion-gramos': m = q(c.gramos).div(1000); F = fuerza(k, x); a = F.div(m); valor = a; unidad = 'm/s²'; break;
    case 'masa': F = fuerza(k, x); m = F.div(a); valor = m; unidad = 'kg'; break;
    case 'comparacion': m = q(1); k = rigidez(a_1, x_1); a_2 = fuerza(k, x_2); a = a_2; x = x_2; valor = a_2; unidad = 'm/s²'; break;
    case 'posicion-cm': F = m.mul(a); x = posicion(F, k); valor = x.mul(100); unidad = 'cm'; break;
    case 'calibrada': k = rigidez(c.F1, x_1); F = fuerza(k, x_2); a_2 = F.div(m); a = a_2; x = x_2; valor = a_2; unidad = 'm/s²'; break;
    case 'masa-calibrada': m = q(c.F1).div(a_1); F = fuerza(k, x_2); a_2 = F.div(m); a = a_2; x = x_2; valor = a_2; unidad = 'm/s²'; break;
    case 'masa-nueva': m_1 = fuerza(k, x_1).div(a_1); m_2 = m_1.mul(c.factorM); m = m_2; F = fuerza(k, x_2); a_2 = F.div(m_2); a = a_2; x = x_2; valor = a_2; unidad = 'm/s²'; break;
    case 'rigidez-nueva': k = q(c.k1).mul(c.factorK); F = m.mul(a_1); x_1 = posicion(F, c.k1); x_2 = posicion(F, k); x = x_2; a = a_1; valor = x.mul(100); unidad = 'cm'; break;
    case 'dos-masas': m_1 = q(c.m1); m_2 = q(c.m2); m = m_2; k = rigidez(m_1.mul(a_1), x_1); F = fuerza(k, x_2); a_2 = F.div(m); a = a_2; x = x_2; valor = a_2; unidad = 'm/s²'; break;
    default: throw Error('Tipo sin oráculo: ' + c.tipo);
  }
  // Se completa una realización física compatible solo para verificar relaciones generales.
  if (!m) m = q(1); if (!k && F && x) k = rigidez(F, x); if (!F && k && x) F = fuerza(k, x);
  if (!a && F) a = F.div(m); if (!F && a) F = m.mul(a); if (!k) k = q(1); if (!x && F) x = posicion(F, k);
  const env = { k, m, x, F, a, x_1, x_2, a_1, a_2, m_1, m_2, F_1: c.F1 == null ? undefined : q(c.F1), k_1: c.k1 == null ? undefined : q(c.k1), k_2: k };
  for (const key of Object.keys(env)) if (env[key] instanceof R) env[key] = env[key].val(); else delete env[key];
  assert.ok(env.m > 0 && env.k > 0, 'Masas y rigideces positivas');
  if (env.F != null && env.x != null) assert.ok(env.F * env.x <= 0, 'Fuerza restauradora');
  return { valor: valor.val(), unidad, env };
}
function errores(c, e) {
  const v = e.valor, b = { signo: -v, doble: 2 * v, mitad: v / 2, media: v / 2 }, m = c.m ?? c.gramos / 1000;
  if (c.tipo === 'aceleracion') Object.assign(b, { producto: c.F * c.m, 'sin-masa': c.F });
  if (/^aceleracion-/.test(c.tipo)) Object.assign(b, { 'sin-masa': fuerza(c.k, cm(c.xcm)).val(), producto: fuerza(c.k, cm(c.xcm)).mul(m).val(), 'cm-diez': 10 * v });
  if (c.tipo === 'comparacion') Object.assign(b, { 'sin-cambio': c.a1, inversa: c.a1 * c.x1cm / c.x2cm, cuadrado: c.a1 * (c.x2cm / c.x1cm) ** 2 });
  if (c.tipo === 'calibrada') Object.assign(b, { 'sin-posicion': c.F1 / c.m, 'posicion-inversa': c.F1 * c.x1cm / (c.m * c.x2cm), 'sin-masa': c.F1 * c.x2cm / c.x1cm, 'producto-masa': c.F1 * c.x2cm * c.m / c.x1cm });
  if (c.tipo === 'masa-calibrada') Object.assign(b, { 'sin-cambio': c.a1, 'masa-inversa': fuerza(c.k, cm(c.x2cm)).mul(c.F1).div(c.a1).val(), 'sin-masa': fuerza(c.k, cm(c.x2cm)).val() });
  if (c.tipo === 'masa-nueva') Object.assign(b, { 'sin-masa-nueva': c.a1 * c.x2cm / c.x1cm, 'masa-directa': c.a1 * c.x2cm * c.factorM / c.x1cm, 'sin-posicion': c.a1 / c.factorM, 'posicion-inversa': c.a1 * c.x1cm / (c.x2cm * c.factorM) });
  if (c.tipo === 'rigidez-nueva') Object.assign(b, { 'sin-rigidez': e.env.x_1 * 100, 'rigidez-directa': e.env.x_1 * 100 * c.factorK, 'masa-inversa': -100 * c.a1 / (c.m * c.k1 * c.factorK) });
  if (c.tipo === 'dos-masas') Object.assign(b, { 'sin-masas': c.a1 * c.x2cm / c.x1cm, 'masas-inversas': c.a1 * c.m2 * c.x2cm / (c.m1 * c.x1cm), 'sin-posicion': c.a1 * c.m1 / c.m2, 'posicion-inversa': c.a1 * c.m1 * c.x1cm / (c.m2 * c.x2cm) });
  return Object.fromEntries(Object.entries(b).map(([k, v]) => [`OS-ACEL-${c.tipo}-${k}`, v]));
}
function plano(n) {
  if (n == null) return ''; if (typeof n !== 'object') return String(n); if (Array.isArray(n)) return n.map(plano).join('');
  if ('t' in n) return plano(n.t); if (n.negrita) return plano(n.negrita);
  if (n.frac) return '(' + plano(n.frac[0]) + ')/(' + plano(n.frac[1]) + ')';
  if (n.sub) return plano(n.sub[0]) + '_' + plano(n.sub[1]);
  if (n.sup) return '(' + plano(n.sup[0]) + ')^(' + plano(n.sup[1]) + ')';
  return '';
}
function textoCompleto(n) {
  if (typeof n === 'function') return ''; if (n == null || typeof n !== 'object') return n == null ? '' : String(n);
  if (Array.isArray(n)) return n.map(textoCompleto).join(' ');
  if (n.t || n.frac || n.sub || n.sup || n.negrita) return plano(n);
  return Object.values(n).map(textoCompleto).join(' ');
}
function cantidad(t) { const z = plano(t).replace(/−/g, '-').replace(/m\/s²|N\/m|cm|kg|m|N/g, '').match(/[+-]?\d+(?:[,.]\d+)?/g); assert.equal(z?.length, 1, 'Una cantidad: ' + plano(t)); return Number(z[0].replace(',', '.')); }
function visible(t, valor, unidad) {
  assert.ok(plano(t).includes(unidad), 'Unidad visible: ' + plano(t)); const v = cantidad(t), diferencia = Math.abs(v - valor);
  if (diferencia > 1e-9 * Math.max(1, Math.abs(valor))) assert.ok(plano(t).includes('≈'), 'Falta ≈: ' + plano(t));
  assert.ok(diferencia <= 0.000500001, 'Redondeo visible incorrecto: ' + plano(t) + ' / ' + valor);
}
const estadistica = { ejemplos: 0, resuelve: 0, ahoraTu: 0, ecuaciones: 0, opciones: 0, figuras: 0, controles: 0 };
function evaluar(s, env, factorSalida = 1) {
  let unidad = 1; s = s.trim();
  for (const [u, f] of [['m/s²', 1], ['N/m', 1], ['cm', 0.01], ['kg', 1], ['N', 1], ['m', 1]]) if (s.endsWith(' ' + u)) { s = s.slice(0, -u.length).trim(); unidad = f; break; }
  const solo = /^[A-Za-z]+(?:_\d+)?$/.test(s);
  s = s.replace(/−/g, '-').replace(/[·×]/g, '*').replace(/,/g, '.');
  s = s.replace(/\b[A-Za-z]+(?:_\d+)?\b/g, k => { assert.ok(k in env, 'Símbolo sin dato: ' + k); return '(' + env[k] + ')'; });
  assert.match(s, /^[\d\s()+*/.\-]+$/, 'Expresión cerrada: ' + s);
  // El alfabeto se verifica antes de evaluar: no puede ejecutar nombres ni código.
  const n = Function('"use strict";return (' + s + ')')(); assert.ok(Number.isFinite(n));
  return solo ? n / factorSalida : n; // las sustituciones usan explícitamente la unidad de salida
}
function ecuaciones(filas, e) {
  for (const fila of filas) if (fila?.ecuacion) for (const tramo of plano(fila.ecuacion).split(';')) {
    const p = tramo.split(/(=|≈)/).map(s => s.trim()); if (p.length < 3) continue;
    const salida = /\scm$/.test(p.at(-1)) ? 0.01 : 1;
    const valores = p.filter((_, i) => i % 2 === 0).map(s => evaluar(s, e.env, salida));
    for (let i = 1; i < valores.length; i++) {
      if (p[2 * i - 1] === '=') cerca(valores[i - 1], valores[i], 'Igualdad: ' + tramo, 2e-9);
      else assert.ok(Math.abs(valores[i - 1] - valores[i]) <= 0.000500001, 'Aproximación: ' + tramo);
      estadistica.ecuaciones++;
    }
  }
}
function nodosNumericos(x, lista = []) {
  if (Array.isArray(x)) x.forEach(n => nodosNumericos(n, lista));
  else if (x && typeof x === 'object') {
    if (x.v && /^[+−-]?\d/.test(x.t)) lista.push(x);
    else for (const v of Object.values(x)) if (typeof v === 'object') nodosNumericos(v, lista);
  }
  return lista;
}
function geometria(dibujo, contexto) {
  for (const rotulo of dibujo.datos.textos || []) {
    assert.equal(typeof rotulo.texto, 'string', contexto + ': rótulo de texto válido');
    assert.doesNotMatch(rotulo.texto, /\b(?:true|false)\b/, contexto + ': un booleano no es un rótulo');
  }
  const d = dibujo.datos, g = pieza.geometria(d, dibujo.estado || {}), pisa = (a, b) => a.x0 < b.x1 && b.x0 < a.x1 && a.y0 < b.y1 && b.y0 < a.y1;
  for (const box of [...g.rotulos, ...g.objetos]) assert.ok(box.x0 >= 4 && box.x1 <= 316 && box.y0 >= 4 && box.y1 <= g.H - 4, contexto + ': margen ' + JSON.stringify(box));
  for (let i = 0; i < g.rotulos.length; i++) {
    for (let j = i + 1; j < g.rotulos.length; j++) assert.ok(!pisa(g.rotulos[i], g.rotulos[j]), contexto + ': rótulos ' + g.rotulos[i].texto + ' / ' + g.rotulos[j].texto);
    for (const o of g.objetos) assert.ok(!pisa(g.rotulos[i], o), contexto + ': objeto bajo ' + g.rotulos[i].texto);
    for (const l of d.lineas || []) if (l.de[0] === l.a[0]) {
      const r = g.rotulos[i]; assert.ok(!(l.de[0] > r.x0 && l.de[0] < r.x1 && Math.min(l.de[1], l.a[1]) < r.y1 && Math.max(l.de[1], l.a[1]) > r.y0), contexto + ': guía sobre ' + r.texto);
    }
  }
  estadistica.figuras++;
}
function comprobar(p, nombre) {
  const c = p.caso, e = independiente(c); cerca(c.valor, e.valor, nombre); assert.equal(c.unidad, e.unidad);
  const entradas = Object.entries(c).filter(([k]) => !['tipo', 'valor', 'unidad', 'errores'].includes(k));
  const nodos = nodosNumericos(p.enunciado || p.pregunta); assert.equal(nodos.length, entradas.length, nombre + ': todas las entradas están visibles');
  const disponibles = nodos.slice();
  for (const [k, v] of entradas) { const i = disponibles.findIndex(n => Math.abs(cantidad(n) - v) < 1e-8); assert.ok(i >= 0, nombre + ': entrada ' + k); const n = disponibles.splice(i, 1)[0]; assert.equal(n.m, k === 'gramos' || k === 'factorM' ? 'm' : k === 'factorK' ? 'k' : k[0]); }
  for (const d of p.datos) if (!/^1 (?:m|kg) = /u.test(plano(d))) assert.doesNotMatch(plano(d), /\b(?:F|a|x|k|m)\s*=|fuerza.*entre|proporcional/i, 'Datos da el procedimiento');
  const convierteLongitud = ['aceleracion-cm', 'aceleracion-gramos', 'masa', 'posicion-cm', 'calibrada', 'masa-calibrada', 'masa-nueva', 'rigidez-nueva', 'dos-masas'].includes(c.tipo);
  assert.equal(p.datos.some(d => plano(d) === '1 m = 100 cm.'), convierteLongitud, nombre + ': equivalencia de longitud solo cuando la solución convierte');
  assert.equal(p.datos.some(d => plano(d) === '1 kg = 1000 g.'), c.tipo === 'aceleracion-gramos', nombre + ': equivalencia de masa cuando se convierte de gramos');
  if (p.respuesta) visible(p.respuesta, e.valor, e.unidad);
  const filas = p.pasos || (Array.isArray(p.solucion) ? p.solucion : [p.solucion]); ecuaciones(filas, e);
  const er = errores(c, e);
  for (const traza of c.errores) { assert.ok(traza.id in er); cerca(traza.valor, er[traza.id], 'Error independiente'); }
  if (p.opciones) {
    const equivalentes = p.opciones.filter(o => Math.abs(o.valor - e.valor) < 1e-9); assert.equal(equivalentes.length, 1); assert.equal(equivalentes[0].correcta, true);
    assert.equal(new Set(p.opciones.map(o => cantidad(o.texto))).size, p.opciones.length);
    for (const o of p.opciones) {
      const v = o.correcta ? e.valor : er[o.error]; assert.ok(Number.isFinite(v)); cerca(o.valor, v, 'Opción'); visible(o.texto, v, e.unidad);
      if (!o.correcta) { const salida = o.siFuera.match(/\bsale ([^.]+)\./i); assert.ok(salida, 'La explicación identifica el resultado de su error'); visible(salida[1], v, e.unidad); assert.ok(o.siFuera.split(/\s+/).length <= 40); }
      estadistica.opciones++;
    }
  }
  if (p.alternativas) {
    const esperados = [e.valor, ...c.errores.map(x => er[x.id])]; assert.equal(p.alternativas.length, 5);
    assert.equal(p.alternativas.filter(t => Math.abs(cantidad(t) - e.valor) <= 0.000500001).length, 1);
    for (const alt of p.alternativas) { const v = esperados.find(n => Math.abs(cantidad(alt) - n) <= 0.000500001); assert.ok(Number.isFinite(v)); visible(alt, v, e.unidad); }
    for (const traza of c.errores) assert.ok(plano(p.solucion.at(-1).texto).includes(p.alternativas.find(t => Math.abs(cantidad(t) - traza.valor) <= 0.000500001)), 'Se explica cada distractor de examen');
  }
  const dibujo = p.dibujo || p.figura; geometria(dibujo, nombre);
  const xx = c.xcm ?? c.x2cm ?? (c.x != null ? 100 * c.x : null);
  if (xx != null && c.tipo !== 'comparacion') {
    const obj = dibujo.datos.objetos.find(o => o.tipo === 'caja'); cerca(obj.x, 178 + 4 * xx, 'Escala común de posición');
    const rotulosX = dibujo.datos.textos.filter(t => /^x = /.test(t.texto));
    assert.equal(rotulosX.length, 1, nombre + ': una elongación conocida se rotula');
    visible(rotulosX[0].texto, xx, 'cm'); assert.equal(rotulosX[0].color, 'i', nombre + ': color de elongación');
  }
  return e;
}


test('Oscilaciones: aceleración, quince ejemplos, 800 casos y estados físicos', () => {
// Casos de calibración con resultados independientes escritos fuera del constructor.
assert.throws(() => independiente({ tipo: 'rigidez', F: 2, x: 0.1 }), /positivas/);
assert.throws(() => visible('1,333 m/s²', 4 / 3, 'm/s²'), /Falta ≈/);
assert.throws(() => ecuaciones([{ ecuacion: ['F = −20 · 0,04 = +0,8 N'] }], { env: { F: -0.8 } }), /Igualdad/);
const tabla = [3, -3, 30, -0.09, -3, -6, 2, 0.75, 5, -5, 4.8, 4.8, 4, 4, 6];
const informes = [];
for (const [i, p] of idea.ejemplos.entries()) { const e = comprobar(p, 'ejemplo ' + (i + 1)); cerca(e.valor, tabla[i], 'Tabla separada'); informes.push({ ejemplo: i + 1, nivel: p.nivel, tipo: p.caso.tipo, esperado: e.valor, unidad: e.unidad }); estadistica.ejemplos++; }
assert.deepEqual(idea.ejemplos.map(p => p.nivel).reduce((a, n) => (a[n - 1]++, a), [0, 0, 0]), [5, 5, 5]);
assert.equal(new Set(idea.ejemplos.slice(10).map(p => p.alternativas.findIndex(t => Math.abs(cantidad(t) - p.caso.valor) <= 0.000500001))).size, 5);
for (const momento of ['resuelve', 'ahoraTu']) for (let s = 0; s < 400; s++) { comprobar(idea[momento].generar(s), momento + '/' + s); estadistica[momento]++; }
const resueltos = Array.from({ length: 4 }, (_, s) => plano(idea.resuelve.generar(s).enunciado));
for (let s = 0; s < 12; s++) assert.ok(!resueltos.includes(plano(idea.ahoraTu.generar(s).pregunta)));

// Predicción por una realización física: k=150 N/m y m=1 kg reprodujeron el primer estado.
const valorPred = fuerza(150, -0.06).val(); cerca(valorPred, 9);
const opcionesPred = idea.predice.opciones; assert.equal(opcionesPred.filter(o => Math.abs(o.valor - valorPred) < 1e-10).length, 1);
const incognitaPred = idea.predice.dibujo.datos.textos.find(t => t.texto === 'a = ?');
assert.equal(incognitaPred?.color, 'd', 'La aceleración conserva su color cuando es desconocida');
const predMalos = [-valorPred, fuerza(150, -0.02).val(), 3 * valorPred];
opcionesPred.forEach((o, i) => { cerca(o.valor, i ? predMalos[i - 1] : valorPred); visible(o.texto, o.valor, 'm/s²'); });
assert.ok(!textoCompleto([idea.lee, idea.juega.consigna, idea.juega.mision, def.glosario]).includes('+9 m/s²'));
const ePred = independiente({ tipo: 'comparacion', a1: -3, x1cm: 2, x2cm: -6 });
ecuaciones(idea.mira.pasos.slice(0, 5), ePred); ecuaciones([idea.regla], ePred);
const centro = idea.mira.pasos[5].ecuacion, textoCentro = plano(centro).replace(':', ';');
ecuaciones([{ ecuacion: textoCentro }], { env: { x: 0, F: 0, a: 0 } });
for (const extremo of [-1, 1]) {
  const A = 0.08, x = extremo * A, F = fuerza(40, x).val();
  const textoExtremo = plano(idea.mira.pasos[6].ecuacion).replace('±', extremo < 0 ? '-' : '+').replace(':', ';').replace('|F|', 'Fmod');
  ecuaciones([{ ecuacion: textoExtremo }], { env: { x, A, v: 0, Fmod: Math.abs(F), k: 40 } });
  for (let i = -8; i <= 8; i++) assert.ok(Math.abs(fuerza(40, i / 100).val()) <= Math.abs(F) + 1e-12);
}
geometria(idea.predice.dibujo, 'predice antes'); geometria(idea.predice.revelar, 'predice después'); geometria(idea.regla.dibujo, 'regla');
for (let i = 0; i <= 80; i++) {
  const val = { x: i / 10 }, F = fuerza(20, i / 1000).val(), a = q(F).div(0.5).val(), dibujo = idea.juega.dibujo(val);
  assert.equal(idea.juega.mision.logrado(val), i === 60);
  const caja = dibujo.datos.objetos.find(o => o.tipo === 'caja'); cerca(caja.x, 178 + 4 * val.x, 'Posición del control');
  const flechas = dibujo.datos.flechas || [];
  for (const [yy, valor, escala] of [[88, F, 8], [171, a, 7]]) { const flecha = flechas.find(q => q.de[1] === yy); if (i === 0) assert.equal(flecha, undefined); else { cerca(flecha.largo, Math.abs(valor) * escala, 'Escala de flecha'); assert.equal(flecha.ang, 180); } }
  if (i) { const lectura = plano(idea.juega.lectura(val)); assert.match(lectura, /hacia el equilibrio/); assert.ok(lectura.includes(String(Math.round(a * 1000) / 1000).replace('-', '−').replace('.', ',')) || lectura.includes(String(Math.round(a * 1000) / 1000).replace('.', ','))); }
  geometria(dibujo, 'control ' + val.x); estadistica.controles++;
}
assert.equal(idea.juega.mision.logrado({ x: idea.juega.controles[0].inicio }), false);
assert.doesNotMatch(textoCompleto(idea), /ω|frecuencia angular/, 'No se anticipa la idea3');
const T = require(path.join(repo, 'nucleo/teoria.js')); const problemas = T.problemas({ ...def, ideas: [idea], laboratorio: undefined, laboratorioIdeas: undefined, glosario: def.glosario.filter(t => ['movimiento armónico simple', 'fuerza recuperadora', 'elongación'].includes(t.termino)), calidad: 2 }, { semillas: 400 }); assert.deepEqual(problemas, []);
});
