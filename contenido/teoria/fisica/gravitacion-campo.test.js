'use strict';

// Oráculo independiente de la segunda idea de gravitación. Recalcula desde
// verificacion, con fracciones y escalas SI. No importa el calculador del contenido.
// Para validar el fragmento antes del ensamblado: GR_CAMPO_MODULE=<wrapper completo>.
const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const cargado = require(process.env.GR_CAMPO_MODULE ? path.resolve(process.env.GR_CAMPO_MODULE) : './gravitacion.js');
const idea = cargado.ideas ? cargado.ideas.find(i => i.id === 'campo-gravitatorio') : (cargado.idea || cargado);

function gcd(a, b) { a = a < 0n ? -a : a; b = b < 0n ? -b : b; while (b) [a, b] = [b, a % b]; return a || 1n; }
class Q {
  constructor(a, b = 1n) {
    if (a instanceof Q) { this.a = a.a; this.b = a.b; return; }
    if (typeof a !== 'bigint') {
      const s = String(a), m = s.match(/^(-?)(\d+)(?:\.(\d+))?(?:e([+-]?\d+))?$/i);
      assert.ok(m, 'Entrada racional inválida: ' + s);
      const fraccion = m[3] || '', potencia = Number(m[4] || 0) - fraccion.length;
      a = BigInt((m[1] || '') + m[2] + fraccion); b = 1n;
      if (potencia >= 0) a *= 10n ** BigInt(potencia); else b = 10n ** BigInt(-potencia);
    }
    assert.notEqual(b, 0n, 'Divisor nulo'); if (b < 0n) { a = -a; b = -b; }
    const g = gcd(a, b); this.a = a / g; this.b = b / g;
  }
  add(x) { x = q(x); return new Q(this.a * x.b + x.a * this.b, this.b * x.b); }
  sub(x) { return this.add(q(x).neg()); }
  mul(x) { x = q(x); return new Q(this.a * x.a, this.b * x.b); }
  div(x) { x = q(x); return new Q(this.a * x.b, this.b * x.a); }
  neg() { return new Q(-this.a, this.b); }
  abs() { return this.a < 0n ? this.neg() : this; }
  pow(n) { assert.ok(Number.isInteger(n) && Math.abs(n) <= 40); return n < 0 ? new Q(this.b ** BigInt(-n), this.a ** BigInt(-n)) : new Q(this.a ** BigInt(n), this.b ** BigInt(n)); }
  n() { return Number(this.a) / Number(this.b); }
}
const q = n => new Q(n);
const suma = xs => xs.reduce((a, x) => a.add(x), q(0));
function cerca(actual, esperado, contexto = '') {
  esperado = esperado instanceof Q ? esperado.n() : esperado;
  assert.ok(Number.isFinite(actual) && Number.isFinite(esperado));
  const tolerancia = 1e-9 * Math.max(1e-30, Math.abs(esperado));
  assert.ok(Math.abs(actual - esperado) <= tolerancia, `${contexto}: ${actual}; independiente ${esperado}`);
}

function plano(x) {
  if (x == null) return '';
  if (typeof x !== 'object') return String(x);
  if (Array.isArray(x)) return x.map(plano).join('');
  if (x.t != null) return plano(x.t);
  if (x.negrita != null) return plano(x.negrita);
  if (x.vec != null) return plano(x.vec);
  if (x.raiz) return '√(' + plano(x.raiz) + ')';
  if (x.par) return '(' + plano(x.par) + ')';
  if (x.sub) return plano(x.sub[0]) + '_' + plano(x.sub[1]);
  if (x.sup) return '(' + plano(x.sup[0]) + ')^(' + plano(x.sup[1]) + ')';
  if (x.frac) return '(' + plano(x.frac[0]) + ')/(' + plano(x.frac[1]) + ')';
  return ['texto', 'ecuacion', 'respuesta', 'enunciado', 'pregunta'].filter(k => x[k] != null).map(k => plano(x[k])).join(' ');
}
function normal(x) {
  const superDigitos = { '⁻': '-', '⁺': '+', '⁰': '0', '¹': '1', '²': '2', '³': '3', '⁴': '4', '⁵': '5', '⁶': '6', '⁷': '7', '⁸': '8', '⁹': '9' };
  return plano(x).replace(/[−–]/g, '-').replace(/(\d)[ \u00a0\u202f](?=\d{3}(?:\D|$))/g, '$1')
    .replace(/,/g, '.').replace(/[⁻⁺⁰¹²³⁴⁵⁶⁷⁸⁹]+/g, s => '^(' + [...s].map(c => superDigitos[c]).join('') + ')');
}
function literales(x) { return normal(x).match(/[+-]?\d+(?:\.\d+)?(?:e[+-]?\d+|\s*[×·*]\s*\(?10\)?\s*\^\s*\(?[+-]?\d+\)?)?/gi) || []; }
function valores(x) { return literales(x).map(z => expresion(z).n()); }
function visible(x) { const ns = valores(x); assert.ok(ns.length, 'No hay valor visible: ' + plano(x)); return ns.at(-1); }
function comprobarVisible(texto, esperado, unidad, { aproximacion = false } = {}) {
  const s = plano(texto), valor = visible(texto), diferencia = Math.abs(valor - esperado);
  if (diferencia <= 1e-9 * Math.max(1e-30, Math.abs(esperado))) {
    if (aproximacion) assert.match(s, /≈/, 'El resultado de datos aproximados requiere ≈: ' + s);
  } else {
    assert.match(s, /≈/, 'Resultado redondeado escrito como exacto: ' + s);
    const ultimo = literales(texto).at(-1), mantisa = ultimo.match(/^[+-]?\d+(?:\.(\d+))?/)[1] || '';
    const potencia = ultimo.match(/(?:e|\^\s*\(?)([+-]?\d+)/i), paso = 10 ** (Number(potencia ? potencia[1] : 0) - mantisa.length);
    assert.ok(diferencia <= paso * 0.50000001, 'Aproximación demasiado alejada: ' + s + ' / ' + esperado);
  }
  if (unidad) assert.ok(s.includes(unidad), 'Falta unidad ' + unidad + ': ' + s);
}

// Analizador aritmético propio, sin eval ni el motor que genera los ejercicios.
function expresion(texto) {
  const s = texto.replace(/\s/g, '').replace(/[·×]/g, '*').replace(/÷/g, '/');
  const ts = s.match(/\d+(?:\.\d+)?(?:e[+-]?\d+)?|[()+\-*/^√]/gi) || [];
  assert.equal(ts.join(''), s, 'No es una expresión numérica: ' + texto); let i = 0;
  function atomo() { if (ts[i] === '(') { i++; const a = sumar(); assert.equal(ts[i++], ')', texto); return a; } if (ts[i] === '√') { i++; return q(raizPositiva(atomo())); } const a = ts[i++]; assert.match(a || '', /^\d+(?:\.\d+)?(?:e[+-]?\d+)?$/i, texto); return q(a); }
  function potencia() { let a = atomo(); if (ts[i] === '^') { i++; a = a.pow(unario().n()); } return a; }
  function unario() { if (ts[i] === '+') { i++; return unario(); } if (ts[i] === '-') { i++; return unario().neg(); } return potencia(); }
  function multiplicar() { let a = unario(); while (ts[i] === '*' || ts[i] === '/') { const op = ts[i++], b = unario(); a = op === '*' ? a.mul(b) : a.div(b); } return a; }
  function sumar() { let a = multiplicar(); while (ts[i] === '+' || ts[i] === '-') { const op = ts[i++], b = multiplicar(); a = op === '+' ? a.add(b) : a.sub(b); } return a; }
  const a = sumar(); assert.equal(i, ts.length, 'Expresión incompleta'); return a;
}
function igualdades(x) {
  const t = normal(x), arit = c => c != null && /[\d.\s()+\-·×*/÷^√]/.test(c);
  for (let k = 0; k < t.length; k++) if (t[k] === '=' || t[k] === '≈') {
    let a = k, b = k + 1; while (a > 0 && arit(t[a - 1])) a--; while (b < t.length && arit(t[b])) b++;
    const iz = t.slice(a, k).trim().replace(/^\.\s+/, ''), de = t.slice(k + 1, b).trim().replace(/\.$/, '');
    const inicio = a + (t.slice(a, k).match(/^\s*/) || [''])[0].length;
    if (inicio > 0 && /[\p{L}_]/u.test(t[inicio - 1])) continue;
    if (/[+\-·×*/÷^]\s*$/.test(iz) || /[+\-·×*/÷^]\s*$/.test(de)) continue;
    if (/\d/.test(iz) && /\d/.test(de)) {
      const izquierda = expresion(iz).n();
      if (t[k] === '≈' && literales(de).length === 1) comprobarVisible('≈ ' + de, izquierda, '');
      else cerca(izquierda, expresion(de), 'Igualdad: ' + iz + ' ' + t[k] + ' ' + de);
    }
  }
}

function raizPositiva(a) {
  const z = a instanceof Q ? a.n() : a; assert.ok(z >= 0 && Number.isFinite(z));
  if (z === 0) return 0;
  let lo = 0, hi = 1; while (hi * hi < z) hi *= 2;
  for (let i = 0; i < 120; i++) { const medio = (lo + hi) / 2; if (medio * medio < z) lo = medio; else hi = medio; }
  return (lo + hi) / 2;
}

// Son operaciones físicas de referencia: no importan motores del contenido ni
// emplean sus resultados, opciones o valores calculados como datos de entrada.
function campoPuntual(mu, distancia) {
  assert.ok(mu > 0 && distancia > 0, 'El campo exterior requiere parámetro y radio positivos');
  return q(mu).div(q(distancia).pow(2));
}
function campoPorAltura(g0, R, h) {
  assert.ok(g0 > 0 && R > 0 && h >= 0, 'Altura exterior y referencia superficial válidas');
  const mu = q(g0).mul(q(R).pow(2));
  return campoPuntual(mu.n(), q(R).add(h).n());
}
function alturaInversa(g0, R, g) {
  assert.ok(g > 0 && g <= g0, 'Un campo mayor al superficial no da altura exterior');
  if (g === g0) return 0;
  let lo = 0, hi = R;
  while (campoPorAltura(g0, R, hi).n() > g) hi *= 2;
  for (let i = 0; i < 120; i++) {
    const h = (lo + hi) / 2;
    if (campoPorAltura(g0, R, h).n() > g) lo = h; else hi = h;
  }
  return (lo + hi) / 2;
}
function contribuciones(muA, muB, D, x) {
  assert.ok(muA > 0 && muB > 0 && D > 0 && x !== 0 && x !== D);
  return [campoPuntual(muA, Math.abs(x)).mul(x < 0 ? 1 : -1),
    campoPuntual(muB, Math.abs(D - x)).mul(x < D ? 1 : -1)];
}
function puntoNulo(muA, muB, D) {
  let lo = 0, hi = D;
  for (let i = 0; i < 120; i++) {
    const x = (lo + hi) / 2, [a, b] = contribuciones(muA, muB, D, x);
    if (a.add(b).n() < 0) lo = x; else hi = x;
  }
  return (lo + hi) / 2;
}

test('Campo: calibración independiente y errores físicos detectables', () => {
  cerca(campoPuntual(4e14, 8e6).n(), 6.25);
  cerca(campoPorAltura(18, 6e6, 12e6).n(), 2);
  cerca(alturaInversa(18, 6e6, 2), 12e6);
  cerca(puntoNulo(4e14, 9e14, 1e7), 4e6);
  const [a, b] = contribuciones(4e14, 9e14, 1e7, 4e6);
  cerca(a.n(), -25); cerca(b.n(), 25); assert.equal(a.add(b).n(), 0);
  assert.throws(() => alturaInversa(10, 6e6, 20));
  assert.throws(() => campoPorAltura(10, 6e6, -1));
  assert.throws(() => cerca(-1e-12, 1e-12));
  assert.throws(() => igualdades('18 / (1 + 2)^2 = 4,5'));
  assert.throws(() => comprobarVisible('0,333 N/kg', 1 / 3, 'N/kg'));
});

function textoSano(caso) {
  for (const campo of ['enunciado', 'pregunta', 'datos', 'solucion', 'pasos', 'respuesta']) {
    const contenido = caso[campo];
    const filas = Array.isArray(contenido) && contenido.some(x => x && typeof x === 'object' && ('ecuacion' in x || 'texto' in x)) ? contenido : [contenido];
    for (const fila of filas) {
      assert.doesNotMatch(plano(fila), /NaN|Infinity|undefined|\[object Object\]/);
      igualdades(fila);
    }
  }
}
function firma(c) { return JSON.stringify(Object.entries(c).filter(([k]) => !['respuesta', 'errores', 'titulo', 'nivel'].includes(k)).sort(([a], [b]) => a.localeCompare(b))); }
function coincideValor(texto, numero, unidad) {
  try { comprobarVisible(texto, numero, unidad); return true; } catch { return false; }
}
function revisarOpciones(opciones, r, errores) {
  assert.ok(opciones.length >= 4 && opciones.length <= 5);
  assert.equal(opciones.filter(o => o.correcta).length, 1);
  assert.equal(new Set(opciones.map(o => visible(o.texto))).size, opciones.length);
  assert.equal(opciones.filter(o => coincideValor(o.texto, r.valor, r.unidad)).length, 1, 'Una sola correcta por fuerza bruta');
  for (const o of opciones) {
    if (o.correcta) comprobarVisible(o.texto, r.valor, r.unidad);
    else {
      assert.ok(Object.hasOwn(errores, o.id), 'Error sin operación independiente: ' + o.id);
      comprobarVisible(o.texto, errores[o.id], r.unidad);
      comprobarVisible(o.siFuera, errores[o.id], r.unidad); igualdades(o.siFuera);
    }
  }
}

const tipos = ['campo', 'altura', 'planeta', 'peso', 'masa', 'altura-inversa', 'superposicion', 'nulo', 'balanza'];
const campoBuscado = c => c.g == null ? q(c.F).div(c.m) : q(c.g);
function campoLocal(c) {
  if (c.g != null) return q(c.g);
  if (c.g0 != null) return campoPorAltura(c.g0, c.R, c.h);
  return campoPuntual(c.mu, c.r == null ? q(c.R).add(c.h).n() : c.r);
}
function calcular(c) {
  let valor, unidad = 'N/kg';
  switch (c.tipo) {
    case 'campo': valor = campoPuntual(c.mu, c.r); break;
    case 'altura': valor = c.g0 == null ? campoPuntual(c.mu, q(c.R).add(c.h).n()) : campoPorAltura(c.g0, c.R, c.h); break;
    case 'planeta': valor = q(c.g0).mul(c.kM).div(q(c.kR).pow(2)); break;
    case 'peso': valor = campoPuntual(c.mu, c.r).mul(c.m); unidad = 'N'; break;
    case 'masa': valor = q(c.F).div(c.g); unidad = 'kg'; break;
    case 'altura-inversa': valor = alturaInversa(c.g0, c.R, campoBuscado(c).n()) / 1000; unidad = 'km'; break;
    case 'superposicion': {
      const [a, b] = contribuciones(c.muA, c.muB, c.D, c.x); valor = a.add(b); break;
    }
    case 'nulo': valor = puntoNulo(c.muA, c.muB, c.D) / 1000; unidad = 'km'; break;
    case 'balanza': {
      const gravedad = campoLocal(c), peso = gravedad.mul(c.m), aceleracion = gravedad.mul(c.beta);
      valor = peso.sub(aceleracion.mul(c.m)); unidad = 'N'; break;
    }
    default: throw new Error('Tipo sin oráculo de campo: ' + c.tipo);
  }
  return { valor: valor instanceof Q ? valor.n() : valor, unidad };
}
function erroresEsperados(c) {
  const r = q(calcular(c).valor), salida = {};
  const guardar = valores => { for (const [id, v] of Object.entries(valores)) salida[id] = v instanceof Q ? v.n() : v; };
  switch (c.tipo) {
    case 'campo': guardar({ lineal: q(c.mu).div(c.r), doble: r.mul(2), mitad: r.div(2), inversa: q(c.r).pow(2).div(c.mu) }); break;
    case 'altura': {
      const mu = c.mu == null ? q(c.g0).mul(q(c.R).pow(2)) : q(c.mu), g0 = mu.div(q(c.R).pow(2));
      const xs = { lineal: g0.mul(c.R).div(q(c.R).add(c.h)), superficie: g0,
        'cuadrado-altura': g0.div(q(1).add(q(c.h).div(c.R).pow(2))) };
      if (c.h !== 0) xs['altura-sola'] = mu.div(q(c.h).pow(2));
      guardar(xs); break;
    }
    case 'planeta': guardar({ lineal: q(c.g0).mul(c.kM).div(c.kR), 'sin-masa': q(c.g0).div(q(c.kR).pow(2)),
      'sin-radio': q(c.g0).mul(c.kM), inversa: q(c.g0).mul(q(c.kR).pow(2)).div(c.kM), 'radio-solo': q(c.g0).div(c.kR) }); break;
    case 'peso': {
      const g = campoPuntual(c.mu, c.r); guardar({ 'sin-masa': g, doble: r.mul(2), divide: g.div(c.m), cuadrado: g.pow(2).mul(c.m), mitad: r.div(2) }); break;
    }
    case 'masa': guardar({ producto: q(c.F).mul(c.g), inversa: q(c.g).div(c.F), doble: r.mul(2), mitad: r.div(2), diferencia: q(c.F).sub(c.g) }); break;
    case 'altura-inversa': {
      const g = campoBuscado(c);
      guardar({ 'desde-centro': r.add(q(c.R).div(1000)), 'sin-raiz': q(c.R).mul(q(c.g0).div(g).sub(1)).div(1000),
        inversa: q(c.R).mul(q(raizPositiva(g.div(c.g0))).sub(1)).div(1000), radio: q(c.R).div(1000), mitad: r.div(2) }); break;
    }
    case 'superposicion': {
      const [a, b] = contribuciones(c.muA, c.muB, c.D, c.x);
      guardar({ suma: a.abs().add(b.abs()), signo: r.neg(), 'solo-A': a, 'solo-B': b, 'resta-modulos': a.abs().sub(b.abs()).abs() }); break;
    }
    case 'nulo': guardar({ lineal: q(c.D).mul(c.muA).div(q(c.muA).add(c.muB)).div(1000), mitad: q(c.D).div(2000),
      complemento: q(c.D).div(1000).sub(r), cociente: q(c.D).mul(raizPositiva(q(c.muA).div(c.muB))).div(1000),
      inversa: q(c.D).div(q(1).add(q(c.muA).div(c.muB))).div(1000) }); break;
    case 'balanza': {
      const g = campoLocal(c), peso = g.mul(c.m);
      guardar({ gravedad: peso, suma: peso.mul(q(1).add(c.beta)), beta: peso.mul(c.beta), 'sin-masa': g.mul(q(1).sub(c.beta)),
        doble: r.mul(2), cuadrado: g.pow(2).mul(c.m), inversa: q(c.m).div(g), resta: g.sub(c.m) }); break;
    }
    default: throw new Error('Faltan operaciones independientes: ' + c.tipo);
  }
  return salida;
}
function fisica(c, r) {
  for (const k of ['mu', 'muA', 'muB', 'R', 'r', 'g', 'g0', 'm', 'F', 'D', 'kM', 'kR']) if (c[k] != null) assert.ok(c[k] > 0, 'Parámetro positivo: ' + k);
  if (c.h != null) assert.ok(c.h >= 0, 'Solo campo exterior');
  if (['campo', 'altura', 'planeta', 'peso', 'masa', 'nulo'].includes(c.tipo)) assert.ok(r.valor > 0);
  if (c.tipo === 'altura') assert.ok(r.valor <= (c.g0 == null ? campoPuntual(c.mu, c.R).n() : c.g0));
  if (c.tipo === 'altura-inversa') {
    assert.ok(r.valor >= 0); cerca(campoPorAltura(c.g0, c.R, r.valor * 1000).n(), campoBuscado(c), 'Altura recuperada por el campo');
  }
  if (c.tipo === 'masa') cerca(q(r.valor).mul(c.g).n(), c.F, 'La masa reconstruye la fuerza');
  if (c.tipo === 'balanza') {
    assert.ok(c.beta >= 0 && c.beta <= 1, 'Cabina con contacto y aceleración descendente hasta g');
    const g = campoLocal(c); assert.ok(r.valor >= 0 && r.valor <= g.mul(c.m).n() + 1e-10);
    cerca(q(r.valor).add(g.mul(c.beta).mul(c.m)).n(), g.mul(c.m), 'Normal más término de aceleración reconstruye el peso');
    if (c.beta === 1) { assert.equal(r.valor, 0); assert.ok(g.n() > 0); }
  }
  if (c.tipo === 'superposicion') {
    if (c.x < 0) assert.ok(r.valor > 0); if (c.x > c.D) assert.ok(r.valor < 0);
  }
  if (c.tipo === 'nulo') {
    const x = r.valor * 1000; assert.ok(x > 0 && x < c.D);
    const [a, b] = contribuciones(c.muA, c.muB, c.D, x); cerca(a.abs().n(), b.abs(), 'Campos opuestos de igual módulo');
    if (c.muA < c.muB) assert.ok(x < c.D / 2); if (c.muA > c.muB) assert.ok(x > c.D / 2);
  }
}

test('Campo: nueve familias calibradas sin respuestas del constructor', () => {
  const muestras = [
    [{ tipo: 'campo', mu: 4e14, r: 8e6 }, 6.25],
    [{ tipo: 'altura', g0: 18, R: 6e6, h: 12e6 }, 2],
    [{ tipo: 'altura', mu: 3.986e14, R: 6371e3, h: 400e3, aprox: true }, 8.694240846306913],
    [{ tipo: 'planeta', g0: 12, kM: 3, kR: 2 }, 9],
    [{ tipo: 'peso', mu: 4e14, r: 8e6, m: 40 }, 250],
    [{ tipo: 'masa', g: 6.25, F: 250 }, 40],
    [{ tipo: 'altura-inversa', g0: 18, R: 6e6, g: 2 }, 12000],
    [{ tipo: 'altura-inversa', g0: 27, R: 7e6, F: 180, m: 60 }, 14000],
    [{ tipo: 'superposicion', muA: 4e14, muB: 9e14, D: 1e7, x: -1e7 }, 6.25],
    [{ tipo: 'nulo', muA: 4e14, muB: 9e14, D: 1e7 }, 4000],
    [{ tipo: 'balanza', g: 10, m: 60, beta: 0.25 }, 450],
    [{ tipo: 'balanza', mu: 4e14, r: 8e6, m: 40, beta: 1 }, 0],
  ];
  for (const [c, esperado] of muestras) { const r = calcular(c); cerca(r.valor, esperado, c.tipo); fisica(c, r); }
});

test('Campo: operaciones de error calibradas con valores externos al generador', () => {
  const muestras = [
    [{ tipo: 'campo', mu: 4e14, r: 8e6 }, { lineal: 5e7, doble: 12.5, mitad: 3.125, inversa: 0.16 }],
    [{ tipo: 'altura', g0: 18, R: 6e6, h: 12e6 }, { 'altura-sola': 4.5, lineal: 6, superficie: 18, 'cuadrado-altura': 3.6 }],
    [{ tipo: 'planeta', g0: 12, kM: 3, kR: 2 }, { lineal: 18, 'sin-masa': 3, 'sin-radio': 36, inversa: 16, 'radio-solo': 6 }],
    [{ tipo: 'peso', mu: 4e14, r: 8e6, m: 40 }, { 'sin-masa': 6.25, doble: 500, divide: 0.15625, cuadrado: 1562.5, mitad: 125 }],
    [{ tipo: 'masa', g: 6.25, F: 250 }, { producto: 1562.5, inversa: 0.025, doble: 80, mitad: 20, diferencia: 243.75 }],
    [{ tipo: 'altura-inversa', g0: 18, R: 6e6, g: 2 }, { 'desde-centro': 18000, 'sin-raiz': 48000, inversa: -4000, radio: 6000, mitad: 6000 }],
    [{ tipo: 'superposicion', muA: 4e14, muB: 9e14, D: 1e7, x: -1e7 }, { suma: 6.25, signo: -6.25, 'solo-A': 4, 'solo-B': 2.25, 'resta-modulos': 1.75 }],
    [{ tipo: 'nulo', muA: 4e14, muB: 9e14, D: 1e7 }, { lineal: 40000 / 13, mitad: 5000, complemento: 6000, cociente: 20000 / 3, inversa: 90000 / 13 }],
    [{ tipo: 'balanza', g: 10, m: 60, beta: 0.25 }, { gravedad: 600, suma: 750, beta: 150, 'sin-masa': 7.5, doble: 900, cuadrado: 6000, inversa: 6, resta: -50 }],
  ];
  for (const [c, valores] of muestras) {
    const errores = erroresEsperados(c); assert.deepEqual(Object.keys(errores).sort(), Object.keys(valores).sort());
    for (const [id, v] of Object.entries(valores)) cerca(errores[id], v, c.tipo + '/' + id);
  }
});

function trazas(c) {
  const r = calcular(c), errores = erroresEsperados(c);
  cerca(c.respuesta.valor, r.valor, 'Respuesta declarada frente al oráculo'); assert.equal(c.respuesta.unidad, r.unidad);
  assert.equal(new Set(c.errores.map(e => e.id)).size, c.errores.length);
  for (const e of c.errores) {
    assert.ok(Object.hasOwn(errores, e.id), 'Falta oráculo: ' + c.tipo + '/' + e.id);
    cerca(e.valor, errores[e.id], 'Error declarado: ' + e.id);
  }
}

function cifras(x) { return literales(plano(x).replace(/m³\/s²|m\/s²/g, '').replace(/_[A-Za-z0-9,]+/g, '')); }
function cantidades(caso, c) {
  const r = calcular(c).valor; let entradas, filas;
  switch (c.tipo) {
    case 'campo': entradas = [c.mu, c.r / 1000]; filas = [[c.r / 1000, 1000, c.r], [c.mu, c.r, 2, r]]; break;
    case 'altura': {
      const distancia = c.R + c.h; entradas = [c.mu == null ? c.g0 : c.mu, c.R / 1000, c.h / 1000];
      filas = [[c.R, c.h, distancia], c.mu == null ? [c.g0, c.R, 2, distancia, 2, r] : [c.mu, distancia, 2, r]]; break;
    }
    case 'planeta': entradas = [c.g0, c.kM, c.kR]; filas = [[c.g0, c.kM, c.kR, 2, r]]; break;
    case 'peso': {
      const g = campoPuntual(c.mu, c.r).n(); entradas = [c.m, c.r / 1000, c.mu]; filas = [[c.mu, c.r, 2, g], [c.m, c.mu, c.r, 2, r]]; break;
    }
    case 'masa': entradas = [c.g, c.F]; filas = [[c.F, c.g, r]]; break;
    case 'altura-inversa': {
      const g = campoBuscado(c).n(), central = r * 1000 + c.R;
      entradas = c.g == null ? [c.R / 1000, c.g0, c.m, c.F] : [c.R / 1000, c.g0, c.g];
      filas = [[c.R, c.g0, g, central], [central, c.R, 1000, r]];
      if (c.g == null) filas.unshift([c.F, c.m, g]); break;
    }
    case 'superposicion': {
      const [a, b] = contribuciones(c.muA, c.muB, c.D, c.x), sa = c.x < 0 ? 1 : -1, sb = c.x < c.D ? 1 : -1;
      const da = Math.abs(c.x), db = Math.abs(c.D - c.x);
      entradas = [c.muA, c.muB, 0, c.D / 1000, c.x / 1000];
      filas = [[sa, c.muA, da, 2, a.n()], [sb, c.muB, db, 2, b.n()], [sa, c.muA, da, 2, sb, c.muB, db, 2, r]]; break;
    }
    case 'nulo': entradas = [c.muA, c.muB, c.D / 1000]; filas = [[c.muB, c.muA, raizPositiva(q(c.muB).div(c.muA))], [c.D / 1000, 1, c.muB, c.muA, r]]; break;
    case 'balanza': {
      const g = campoLocal(c).n(), operacion = c.g != null ? [c.g] : c.mu != null ? [c.mu, c.r, 2] : [c.g0, c.R, 2, c.R + c.h, 2];
      entradas = [c.m, c.beta]; filas = c.g == null ? [[...operacion, g]] : [];
      // Auditoría (26 nov): si el campo calculado es exacto, el paso del apoyo usa su valor.
      filas.push([c.m, ...(c.g == null && Math.abs(g * 1000 - Math.round(g * 1000)) < 1e-7 ? [g] : operacion), 1, c.beta, r]);
      const dados = c.g != null ? [c.g] : c.mu != null ? [c.mu, c.r / 1000] : [c.g0, c.R / 1000, c.h / 1000];
      const visibles = cifras(caso.datos[0]).map(z => expresion(z).n());
      assert.equal(visibles.length, dados.length, 'Datos de balanza'); visibles.forEach((n, i) => cerca(n, dados[i]));
      assert.match(plano(caso.datos), /sensor inferior.*normal/); break;
    }
    default: throw new Error('Falta comprobar cantidades: ' + c.tipo);
  }
  const enunciado = caso.enunciado || caso.pregunta, visibles = cifras(enunciado).map(z => expresion(z).n());
  assert.equal(visibles.length, entradas.length, c.tipo + ': datos visibles');
  visibles.forEach((n, i) => cerca(n, entradas[i], c.tipo + ': entrada visible ' + i));
  const pasos = caso.solucion || caso.pasos;
  if (Array.isArray(pasos)) {
    const cuentas = pasos.filter(p => p.ecuacion && cifras(p.ecuacion).length);
    assert.equal(cuentas.length, filas.length, c.tipo + ': filas numéricas');
    cuentas.forEach((p, j) => {
      const xs = cifras(p.ecuacion); assert.equal(xs.length, filas[j].length, c.tipo + ': cifras del paso ' + j + ' ' + plano(p.ecuacion));
      xs.forEach((x, i) => comprobarVisible('≈ ' + x, filas[j][i], ''));
    });
    // Los descartes de examen deben nombrar únicamente valores de operaciones erróneas.
    const valoresError = Object.values(erroresEsperados(c));
    for (const p of pasos.filter(p => !p.ecuacion)) for (const x of cifras(p)) {
      assert.ok(valoresError.some(n => coincideValor('≈ ' + x, n, '')), 'Descarte con cifra ajena a sus operaciones');
    }
  }
}

function registrarPruebasContenido() {
  test('Campo: 15 ejemplos completos y alternativas calculadas de manera independiente', () => {
    assert.ok(idea); assert.equal(idea.ejemplos.length, 15);
    const familias = new Set(), letras = [];
    for (const nivel of [1, 2, 3]) assert.equal(idea.ejemplos.filter(e => e.nivel === nivel).length, 5);
    for (const e of idea.ejemplos) {
      const c = e.verificacion; assert.ok(c && tipos.includes(c.tipo)); familias.add(c.tipo);
      const r = calcular(c); fisica(c, r); trazas(c); textoSano(e); cantidades(e, c);
      assert.ok(e.datos.length); comprobarVisible(e.respuesta, r.valor, r.unidad, { aproximacion: !!c.aprox });
      if (e.nivel === 3) {
        assert.equal(e.alternativas.length, 5); assert.equal(new Set(e.alternativas.map(visible)).size, 5);
        const correctas = e.alternativas.map((o, j) => coincideValor(o, r.valor, r.unidad) ? j : -1).filter(j => j >= 0);
        assert.equal(correctas.length, 1); letras.push(correctas[0]);
        const errores = Object.values(erroresEsperados(c));
        e.alternativas.forEach((o, j) => { if (j !== correctas[0]) assert.ok(errores.some(v => coincideValor(o, v, r.unidad)), 'Alternativa sin operación: ' + plano(o)); });
      }
    }
    assert.equal(familias.size, tipos.length); assert.deepEqual(letras.sort(), [0, 1, 2, 3, 4]);
  });

  test('Campo: 400 semillas por momento, todas las opciones y contrafactuales', () => {
    const vistas = { resuelve: new Set(), ahoraTu: new Set() }, familias = { resuelve: new Set(), ahoraTu: new Set() };
    const ejemplos = new Set(idea.ejemplos.map(e => firma(e.verificacion))), repetidos = [];
    for (let s = 0; s < 400; s++) for (const momento of ['resuelve', 'ahoraTu']) {
      const caso = idea[momento].generar(s), c = caso.verificacion; assert.ok(c && tipos.includes(c.tipo));
      const r = calcular(c); fisica(c, r); trazas(c); textoSano(caso); cantidades(caso, c);
      assert.deepEqual(caso, idea[momento].generar(s), 'La semilla debe ser determinística');
      assert.ok(caso.datos.length); vistas[momento].add(firma(c)); familias[momento].add(c.tipo);
      if (ejemplos.has(firma(c))) repetidos.push({ momento, semilla: s, caso: firma(c) });
      if (momento === 'resuelve') comprobarVisible(caso.respuesta, r.valor, r.unidad, { aproximacion: !!c.aprox });
      else revisarOpciones(caso.opciones, r, erroresEsperados(c));
    }
    for (const momento of ['resuelve', 'ahoraTu']) {
      assert.equal(familias[momento].size, tipos.length, momento + ': faltan familias');
      assert.ok(vistas[momento].size >= 3);
    }
    for (const firma of vistas.resuelve) assert.ok(!vistas.ahoraTu.has(firma), 'Bancos repetidos entre momentos');
    assert.deepEqual(repetidos, [], 'El generador repite un ejemplo');
  });
  test('Campo: cada contrafactual reconoce la parte rescatable', () => {
    for (let s = 0; s < 400; s++) for (const o of idea.ahoraTu.generar(s).opciones) {
      if (!o.correcta) assert.match(plano(o.siFuera), /^Bien /);
    }
  });
}

registrarPruebasContenido();

test('Campo: misión exhaustiva y 400 estados animados con campo constante', () => {
  const j = idea.juega, c = j.controles[0], g = campoPuntual(4e14, 8e6).n(), ganadores = [];
  assert.equal(j.controles.length, 1); assert.equal(c.id, 'm');
  let posicion, escala;
  // Auditoría (26 nov): dibujo y lectura usan la masa entera que muestra el control (decimales: 0).
  const revisar = masaExacta => {
    const masa = Math.round(masaExacta), peso = q(masa).mul(g).n(), valores = { m: masaExacta };
    assert.equal(j.mision.logrado(valores), Math.abs(masaExacta * g - 250) < 1e-9);
    comprobarVisible(j.lectura(valores), peso, 'N');
    assert.match(plano(j.lectura(valores)), /6,25 N\/kg/);
    const d = j.dibujo(valores).datos, p = d.paneles[0]; assert.equal(d.paneles.length, 1);
    if (posicion == null) { posicion = p.satelite.c; escala = d.escalas.F; }
    assert.deepEqual(p.satelite.c, posicion); cerca(d.escalas.F, escala);
    const flecha = p.flechas[0]; assert.equal(p.flechas.length, 1); assert.equal(flecha.familia, 'F');
    assert.deepEqual(flecha.de, p.satelite.c); cerca(flecha.d[0], -peso); assert.equal(flecha.d[1], 0);
    const fuerza = p.notas.find(n => /^F\s/.test(n.texto)), notaMasa = p.notas.find(n => /^m\s/.test(n.texto));
    comprobarVisible(fuerza.texto, peso, 'N'); comprobarVisible(notaMasa.texto, masa, 'kg');
    comprobarVisible(p.cotas[0].texto, 8000, 'km');
    assert.deepEqual(p.cotas[0].de, p.planeta.c); assert.deepEqual(p.cotas[0].a, p.satelite.c);
  };
  for (let m = c.min; m <= c.max + 1e-10; m += c.paso) {
    revisar(m); if (j.mision.logrado({ m })) ganadores.push({ m });
  }
  assert.deepEqual(ganadores, [{ m: 40 }]); assert.deepEqual(j.mision.testigo, ganadores);
  for (let k = 0; k < 400; k++) revisar(Math.round((c.min + (c.max - c.min) * k / 399) * 1e5) / 1e5);
});

test('Campo: Predice y Mira sin confundir altura con separación central', () => {
  const p = idea.predice, r = { valor: campoPorAltura(18, 1, 2).n(), unidad: 'N/kg' };
  const errores = erroresEsperados({ tipo: 'altura', g0: 18, R: 1, h: 2 });
  revisarOpciones(p.opciones, r, errores); assert.equal(p.opciones.length, 4);
  assert.equal(p.verificacion.g0, 18); assert.equal(p.verificacion.kH, 2);
  assert.deepEqual(cifras(p.datos).map(x => expresion(x).n()), [18, 2]);
  assert.equal(p.verificacion.respuesta.valor, r.valor);
  const glosario = (cargado.glosario || []).filter(t => ['campo gravitatorio', 'masa de prueba', 'superposición'].includes(t.termino));
  const previo = JSON.stringify({ glosario, lee: idea.lee, consigna: idea.juega.consigna, mision: idea.juega.mision.texto, pregunta: p.pregunta, datos: p.datos, dibujo: p.dibujo });
  assert.doesNotMatch(previo, /(?<![\d,.])2\s*N\/kg|18\s*[/÷]|novena parte/);
  const notas = p.dibujo.datos.paneles[0].notas;
  assert.ok(!notas.some(n => /^g\s*[=≈]/.test(n.texto))); assert.ok(!p.dibujo.datos.paneles[0].flechas?.length);
  comprobarVisible(p.revelar.datos.paneles[0].notas.find(n => /^g\s*=/.test(n.texto)).texto, r.valor, 'N/kg');
  assert.equal(idea.mira.pasos.length, 3);
  idea.mira.pasos.forEach(s => igualdades(s.ecuacion));
  assert.deepEqual(cifras(idea.mira.pasos[0].ecuacion).map(x => expresion(x).n()), [2, 3]);
  assert.deepEqual(cifras(idea.mira.pasos[2].ecuacion).map(x => expresion(x).n()), [18, 1, 3, 2, r.valor]);
});

