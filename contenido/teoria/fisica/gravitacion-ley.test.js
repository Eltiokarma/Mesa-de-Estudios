'use strict';

// Oráculo independiente de la primera idea de gravitación. Recalcula desde
// verificacion, con fracciones y escalas SI. No importa el calculador del contenido.
// Para validar el fragmento antes del ensamblado: GR_LEY_MODULE=<wrapper completo>.
const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const cargado = require(process.env.GR_LEY_MODULE ? path.resolve(process.env.GR_LEY_MODULE) : './gravitacion.js');
const idea = cargado.ideas ? cargado.ideas.find(i => i.id === 'cuadrado-inverso') : (cargado.idea || cargado);

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

const tipos = ['razon', 'mutua', 'directa', 'masa', 'distancia', 'masa-razon', 'distancia-razon', 'superposicion', 'equilibrio'];
function raizPositiva(a) {
  const z = a instanceof Q ? a.n() : a; assert.ok(z > 0 && Number.isFinite(z));
  let lo = 0, hi = 1; while (hi * hi < z) hi *= 2;
  for (let i = 0; i < 120; i++) { const medio = (lo + hi) / 2; if (medio * medio < z) lo = medio; else hi = medio; }
  return (lo + hi) / 2;
}
function radio(c) { return c.rKm == null ? q(c.r) : q(c.rKm).mul(1000); }
function masa(c) { return c.gramos == null ? q(c.m) : q(c.gramos).div(1000); }
function aportes(c) {
  const x = q(c.x), b = q(c.D).sub(x), numerador = q(c.G).mul(c.m);
  assert.notEqual(x.n(), 0); assert.notEqual(b.n(), 0);
  return [numerador.mul(c.MA).div(x.pow(2)).mul(c.x > 0 ? -1 : 1), numerador.mul(c.MB).div(b.pow(2)).mul(b.n() > 0 ? 1 : -1)];
}
function calcular(c) {
  let valor, unidad = 'N';
  switch (c.tipo) {
    case 'razon': valor = q(c.F0).mul(c.kM).mul(c.km).div(q(c.kr).pow(2)); break;
    case 'mutua': valor = q(c.F0); break;
    case 'directa': valor = q(c.G).mul(c.M).mul(masa(c)).div(radio(c).pow(2)); break;
    case 'masa': valor = q(c.F).mul(radio(c).pow(2)).div(q(c.G).mul(c.M)); unidad = 'kg'; break;
    case 'distancia': valor = raizPositiva(q(c.G).mul(c.M).mul(c.m).div(c.F)) / 1000; unidad = 'km'; break;
    case 'masa-razon': valor = q(c.F1).mul(c.kr).mul(c.kr).div(q(c.F0).mul(c.km)); unidad = 'veces'; break;
    case 'distancia-razon': valor = raizPositiva(q(c.F0).mul(c.kM).mul(c.km).div(c.F1)); unidad = 'veces'; break;
    case 'superposicion': valor = suma(aportes(c)); break;
    case 'equilibrio': {
      // Localizamos el cero por diferencias de campos; no usamos la fórmula con raíces.
      let lo = 0, hi = c.D; assert.ok(c.MA > 0 && c.MB > 0 && c.D > 0);
      for (let i = 0; i < 120; i++) {
        const x = (lo + hi) / 2, izquierda = c.MA / (x * x), derecha = c.MB / ((c.D - x) ** 2);
        if (izquierda > derecha) lo = x; else hi = x;
      }
      valor = (lo + hi) / 2000; unidad = 'km'; break;
    }
    default: throw new Error('Tipo sin oráculo: ' + c.tipo);
  }
  return { valor: valor instanceof Q ? valor.n() : valor, unidad };
}

function erroresEsperados(c) {
  const valor = q(calcular(c).valor), resultado = {};
  const set = objeto => { for (const [id, n] of Object.entries(objeto)) resultado[id] = n instanceof Q ? n.n() : n; };
  switch (c.tipo) {
    case 'razon': {
      const p = q(c.F0).mul(c.kM).mul(c.km), r2 = q(c.kr).pow(2);
      set({ lineal: p.div(c.kr), 'sin-distancia': p, 'sin-masas': q(c.F0).div(r2), 'sin-fuente': q(c.F0).mul(c.km).div(r2), 'sin-sonda': q(c.F0).mul(c.kM).div(r2), 'multiplica-distancia': p.mul(r2), signo: valor.neg() }); break;
    }
    case 'mutua': set({ 'por-masas': q(c.F0).mul(c.mb).div(c.ma), 'inversa-masas': q(c.F0).mul(c.ma).div(c.mb), doble: valor.mul(2), mitad: valor.div(2), signo: valor.neg(), cero: 0 }); break;
    case 'directa': {
      const producto = q(c.G).mul(c.M).mul(masa(c)), distancia = radio(c);
      set({ lineal: producto.div(distancia), 'sin-sonda': q(c.G).mul(c.M).div(distancia.pow(2)), doble: valor.mul(2), mitad: valor.div(2), 'distancia-doble': valor.div(4), signo: valor.neg() });
      if (c.gramos != null) set({ 'sin-gramos': valor.mul(1000) });
      if (c.rKm != null) set({ 'sin-km': valor.mul(1000000) }); break;
    }
    case 'masa': set({ lineal: q(c.F).mul(radio(c)).div(q(c.G).mul(c.M)), inversa: q(1).div(valor), doble: valor.mul(2), mitad: valor.div(2), signo: valor.neg() }); break;
    case 'distancia': set({ 'sin-raiz': q(c.G).mul(c.M).mul(c.m).div(c.F).div(1000), 'sin-km': valor.mul(1000), doble: valor.mul(2), mitad: valor.div(2), signo: valor.neg() }); break;
    case 'masa-razon': set({ lineal: q(c.F1).mul(c.kr).div(q(c.F0).mul(c.km)), 'sin-distancia': q(c.F1).div(q(c.F0).mul(c.km)), inversa: q(1).div(valor), 'multiplica-sonda': q(c.F1).mul(q(c.kr).pow(2)).mul(c.km).div(c.F0), doble: valor.mul(2) }); break;
    case 'distancia-razon': set({ 'sin-raiz': q(c.F0).mul(c.kM).mul(c.km).div(c.F1), inversa: q(1).div(valor), 'sin-masas': raizPositiva(q(c.F0).div(c.F1)), 'sin-sonda': raizPositiva(q(c.F0).mul(c.kM).div(c.F1)), doble: valor.mul(2) }); break;
    case 'superposicion': {
      const [a, b] = aportes(c);
      set({ modulos: a.abs().add(b.abs()), signo: valor.neg(), 'solo-a': a, 'solo-b': b, 'resta-modulos': a.abs().sub(b.abs()), doble: valor.mul(2) }); break;
    }
    case 'equilibrio': set({ mitad: q(c.D).div(2000), lineal: q(c.D).mul(c.MA).div(q(c.MA).add(c.MB)).div(1000), 'desde-b': q(c.D).div(1000).sub(valor), 'sin-suma': c.D * raizPositiva(q(c.MA).div(c.MB)) / 1000, doble: valor.mul(2) }); break;
    default: throw new Error('Sin operaciones de error: ' + c.tipo);
  }
  return resultado;
}

function fisica(c, resultado) {
  for (const k of ['G', 'M', 'm', 'gramos', 'r', 'rKm', 'ma', 'mb', 'MA', 'MB', 'D', 'F0', 'F1', 'F', 'kM', 'km', 'kr']) if (c[k] != null) assert.ok(c[k] > 0, 'Dato no positivo: ' + k);
  if (c.tipo === 'distancia') cerca(q(resultado).mul(1000).pow(2).mul(c.F).n(), q(c.G).mul(c.M).mul(c.m), 'Radio recuperado en SI');
  if (c.tipo === 'masa') cerca(q(resultado).mul(c.G).mul(c.M).div(radio(c).pow(2)).n(), q(c.F), 'Masa recuperada');
  if (c.tipo === 'masa-razon') cerca(c.F0 * resultado * c.km / c.kr ** 2, c.F1, 'Factor de masa recuperado');
  if (c.tipo === 'distancia-razon') cerca(c.F0 * c.kM * c.km / resultado ** 2, c.F1, 'Factor de distancia recuperado');
  if (c.tipo === 'equilibrio') {
    const x = resultado * 1000; assert.ok(x > 0 && x < c.D);
    cerca(c.MA / x ** 2, c.MB / (c.D - x) ** 2, 'Campos que se cancelan');
    if (c.MA < c.MB) assert.ok(x < c.D / 2, 'Cero más cerca de la masa pequeña');
    if (c.MA > c.MB) assert.ok(x > c.D / 2, 'Cero más cerca de la masa pequeña');
  }
}

function trazas(c) {
  const r = calcular(c), errores = erroresEsperados(c);
  cerca(c.respuesta.valor, r.valor, 'Metadato de respuesta'); assert.equal(c.respuesta.unidad, r.unidad);
  for (const e of c.errores) {
    assert.ok(Object.hasOwn(errores, e.id), 'Error sin camino independiente: ' + c.tipo + '/' + e.id);
    cerca(e.valor, errores[e.id], 'Metadato de error ' + e.id);
  }
}

function cantidades(caso, c) {
  const r = calcular(c).valor; let entradas, pasos;
  switch (c.tipo) {
    case 'razon': entradas = [c.F0, c.kM, c.km, c.kr]; pasos = [[c.F0, c.kM, c.km, c.kr, 2, r]]; break;
    case 'mutua': entradas = [c.ma, c.mb, c.F0]; pasos = [[r]]; break;
    case 'directa': entradas = [c.M, c.gramos == null ? c.m : c.gramos, c.rKm == null ? c.r : c.rKm]; pasos = [[c.G, c.M, masa(c).n(), radio(c).n(), 2, r]]; break;
    case 'masa': entradas = [c.rKm == null ? c.r : c.rKm, c.M, c.F]; pasos = [[c.F, radio(c).n(), 2, c.G, c.M, r]]; break;
    case 'distancia': entradas = [c.M, c.m, c.F]; pasos = [[c.G, c.M, c.m, c.F, 1000, r]]; break;
    case 'masa-razon': entradas = [c.F0, c.F1, c.km, c.kr]; pasos = [[c.F1, c.F0, c.kr, 2, c.km, r]]; break;
    case 'distancia-razon': entradas = [c.F0, c.F1, c.kM, c.km]; pasos = [[c.F0, c.kM, c.km, c.F1, r]]; break;
    case 'superposicion': {
      const [a, b] = aportes(c); entradas = [c.MA, c.MB, c.D / 1000, c.m, Math.abs(c.x) / 1000];
      pasos = [[Math.abs(c.x), c.D - c.x], [a.abs().n(), b.abs().n()], [r]]; break;
    }
    case 'equilibrio': entradas = [c.MA, c.MB, c.D / 1000]; pasos = [[c.MB, c.MA, raizPositiva(q(c.MB).div(c.MA))], [c.D / 1000, 1, c.MB, c.MA, r]]; break;
    default: throw new Error('Cantidades sin comprobación: ' + c.tipo);
  }
  if (['directa', 'masa', 'distancia'].includes(c.tipo)) {
    const conversiones = [];
    if (c.rKm != null) conversiones.push([c.rKm, 1000, radio(c).n()]);
    if (c.gramos != null) conversiones.push([c.gramos, 1000, masa(c).n()]);
    pasos = [...conversiones, ...pasos];
  }
  const enunciado = caso.enunciado || caso.pregunta;
  const nums = valores(enunciado); assert.equal(nums.length, entradas.length, c.tipo + ': cantidades del enunciado');
  nums.forEach((n, i) => cerca(n, entradas[i], c.tipo + ': entrada visible ' + i));
  const solucion = caso.solucion || caso.pasos;
  if (Array.isArray(solucion)) {
    // Los wrappers pueden agregar pasos de orientación sin cifras; se comprueban
    // las filas que sí contienen cantidades, en el orden físico del cálculo.
    const filas = solucion.filter(p => p.ecuacion && valores(p.ecuacion).length);
    assert.equal(filas.length, pasos.length, c.tipo + ': filas numéricas de solución');
    filas.forEach((p, j) => {
      const xs = literales(p.ecuacion || p); assert.equal(xs.length, pasos[j].length, c.tipo + ': cifras del paso ' + j + ' ' + plano(p.ecuacion || p));
      xs.forEach((x, i) => comprobarVisible('≈ ' + x, pasos[j][i], ''));
    });
    const opcionesErroneas = Object.values(erroresEsperados(c));
    for (const p of solucion.filter(p => !p.ecuacion)) for (const numero of literales(p)) {
      assert.ok(opcionesErroneas.some(n => coincideValor('≈ ' + numero, n, '')), 'Número de descarte sin operación independiente: ' + numero);
    }
  }
}

test('Ley: calibración independiente de los nueve tipos y notación científica', () => {
  const controles = [
    [{ tipo: 'razon', F0: 160, kM: 2, km: 3, kr: 2 }, 240],
    [{ tipo: 'mutua', F0: 80, ma: 2, mb: 8 }, 80],
    [{ tipo: 'directa', G: 6.67e-11, M: 6e24, m: 600, rKm: 12000 }, 1667.5],
    [{ tipo: 'masa', G: 6.67e-11, M: 6e24, F: 1667.5, r: 12000000 }, 600],
    [{ tipo: 'distancia', G: 6.67e-11, M: 6e24, m: 600, F: 1667.5 }, 12000],
    [{ tipo: 'masa-razon', F0: 160, F1: 240, km: 3, kr: 2 }, 2],
    [{ tipo: 'distancia-razon', F0: 160, F1: 240, kM: 2, km: 3 }, 2],
    [{ tipo: 'superposicion', G: 6.67e-11, MA: 1e24, MB: 9e24, m: 600, D: 12000000, x: 4000000 }, 3126.5625],
    [{ tipo: 'equilibrio', MA: 1e24, MB: 4e24, D: 12000000 }, 4000],
  ];
  for (const [c, esperado] of controles) { cerca(calcular(c).valor, esperado, c.tipo); fisica(c, esperado); }
  cerca(q('6.67e-11').n(), 6.67e-11); cerca(expresion('6.67 * 10^(-11)').n(), 6.67e-11);
  cerca(visible('F ≈ 6,67 × 10⁻¹¹ N'), 6.67e-11);
});

test('Ley: el oráculo detecta inversión de sentido, pérdida del cuadrado y redondeo falso', () => {
  assert.throws(() => cerca(-1e-12, 1e-12, 'Fuerza muy pequeña con signo alterado'));
  assert.throws(() => igualdades('160 · 2 · 3 / 2^2 = 480 N'));
  assert.throws(() => igualdades('√(4 × 10²⁴ / 1 × 10²⁴) = 2'));
  assert.throws(() => igualdades('√(4 × 10²⁴ / 1 × 10²⁴) ≈ 2'));
  assert.throws(() => comprobarVisible('0,333 N', 1 / 3, 'N'));
  assert.throws(() => fisica({ tipo: 'distancia', G: 6.67e-11, M: 6e24, m: 600, F: 1667.5 }, 12));
});

const necesitaAprox = c => ['directa', 'masa', 'distancia', 'superposicion'].includes(c.tipo);
function textoSano(caso) {
  for (const campo of ['enunciado', 'pregunta', 'datos', 'solucion', 'pasos', 'respuesta']) {
    const contenido = caso[campo];
    const filas = Array.isArray(contenido) && contenido.some(x => x && typeof x === 'object' && ('ecuacion' in x || 'texto' in x)) ? contenido : [contenido];
    for (const fila of filas) { assert.doesNotMatch(plano(fila), /NaN|Infinity|undefined|\[object Object\]/); igualdades(fila); }
  }
}
function firma(c) { return JSON.stringify(Object.entries(c).filter(([k]) => !['respuesta', 'errores', 'titulo', 'nivel'].includes(k)).sort(([a], [b]) => a.localeCompare(b))); }
function coincideValor(texto, numero, unidad) { try { comprobarVisible(texto, numero, unidad); return true; } catch { return false; } }

test('Ley: 15 ejemplos, cinco por nivel y alternativas independientes sin duplicados', () => {
  assert.ok(idea); assert.equal(idea.ejemplos.length, 15);
  for (const nivel of [1, 2, 3]) assert.equal(idea.ejemplos.filter(e => e.nivel === nivel).length, 5);
  const letras = [];
  for (const [i, e] of idea.ejemplos.entries()) {
    const c = e.verificacion; assert.ok(c && tipos.includes(c.tipo)); const r = calcular(c);
    fisica(c, r.valor); trazas(c); textoSano(e); cantidades(e, c); assert.ok(e.datos.length);
    comprobarVisible(e.respuesta, r.valor, r.unidad, { aproximacion: necesitaAprox(c) });
    if (e.nivel === 3) {
      assert.equal(e.alternativas.length, 5); assert.equal(new Set(e.alternativas.map(visible)).size, 5);
      const correctas = e.alternativas.map((a, n) => coincideValor(a, r.valor, r.unidad) ? n : -1).filter(n => n >= 0);
      assert.equal(correctas.length, 1, 'Unicidad por fuerza bruta en ejemplo ' + (i + 1)); letras.push(correctas[0]);
      const posibles = Object.values(erroresEsperados(c));
      e.alternativas.forEach((a, n) => { if (n !== correctas[0]) assert.ok(posibles.some(valor => coincideValor(a, valor, r.unidad)), 'Alternativa sin operación de error: ' + plano(a)); });
    }
  }
  assert.deepEqual(letras.sort(), [0, 1, 2, 3, 4]);
});

test('Ley: 400 semillas por momento, respuestas, errores y siFuera independientes', () => {
  const vistos = { resuelve: new Set(), ahoraTu: new Set() }, familias = new Set(), ejemplos = new Set(idea.ejemplos.map(e => firma(e.verificacion)));
  for (let semilla = 0; semilla < 400; semilla++) for (const momento of ['resuelve', 'ahoraTu']) {
    const caso = idea[momento].generar(semilla), c = caso.verificacion; assert.ok(c && tipos.includes(c.tipo)); const r = calcular(c);
    familias.add(c.tipo); vistos[momento].add(firma(c)); assert.ok(caso.datos.length); fisica(c, r.valor); trazas(c); textoSano(caso); cantidades(caso, c);
    assert.deepEqual(caso, idea[momento].generar(semilla), 'Semilla no determinística');
    assert.ok(!ejemplos.has(firma(c)), 'El ejercicio repite un ejemplo de teoría');
    if (momento === 'resuelve') comprobarVisible(caso.respuesta, r.valor, r.unidad, { aproximacion: necesitaAprox(c) });
    else {
      assert.ok(caso.opciones.length >= 4 && caso.opciones.length <= 5);
      assert.equal(caso.opciones.filter(o => o.correcta).length, 1);
      assert.equal(new Set(caso.opciones.map(o => visible(o.texto))).size, caso.opciones.length);
      assert.equal(caso.opciones.filter(o => coincideValor(o.texto, r.valor, r.unidad)).length, 1, 'Unicidad por fuerza bruta: ' + semilla);
      const errores = erroresEsperados(c);
      for (const o of caso.opciones) {
        if (o.correcta) comprobarVisible(o.texto, r.valor, r.unidad, { aproximacion: necesitaAprox(c) });
        else {
          assert.ok(Object.hasOwn(errores, o.id), 'Error sin oráculo: ' + c.tipo + '/' + o.id);
          comprobarVisible(o.texto, errores[o.id], r.unidad);
          assert.match(plano(o.siFuera), /^Bien /); comprobarVisible(o.siFuera, errores[o.id], r.unidad); igualdades(o.siFuera);
        }
      }
    }
  }
  assert.equal(familias.size, tipos.length, 'Deben aparecer los nueve tipos');
  for (const momento of ['resuelve', 'ahoraTu']) assert.ok(vistos[momento].size >= 3);
  for (const f of vistos.resuelve) assert.ok(!vistos.ahoraTu.has(f), 'Resuelve y Ahora tú repiten un caso');
});

test('Ley: misión exhaustiva, lectura y fuerzas visibles con escala constante', () => {
  const juego = idea.juega, control = juego.controles[0];
  assert.equal(juego.controles.length, 1); assert.equal(control.id, 'k');
  const ganadores = [], Fref = q('6.67e-11').mul('6e24').mul(600).div(q(12000000).pow(2));
  let escala;
  const revisar = k => {
    const val = { k }, razon = q(1).div(q(k).pow(2)).n();
    assert.equal(juego.mision.logrado(val), Math.abs(razon - 1 / 4) < 1e-10);
    const lectura = juego.lectura(val);
    if (k === 1 && !valores(lectura).length) assert.match(plano(lectura), /lo mismo que en la referencia/);
    else comprobarVisible(lectura, razon, 'veces');
    const d = juego.dibujo(val).datos; assert.equal(d.paneles.length, 2);
    if (escala == null) escala = d.escalas.F;
    cerca(d.escalas.F, escala, 'La escala de fuerza debe permanecer fija');
    d.paneles.forEach((p, indice) => {
      const factor = indice ? k : 1, fuerza = Fref.div(q(factor).pow(2)).n();
      assert.deepEqual(p.planeta.c, [0, 0]); cerca(p.satelite.c[0], 2 * factor);
      assert.deepEqual(p.cotas[0].de, p.planeta.c); assert.deepEqual(p.cotas[0].a, p.satelite.c);
      comprobarVisible(p.cotas[0].texto, 12000 * factor, 'km');
      assert.equal(p.flechas.length, 1); const flecha = p.flechas[0];
      assert.equal(flecha.familia, 'F'); assert.deepEqual(flecha.de, p.satelite.c);
      cerca(flecha.d[0], -fuerza, 'La atracción apunta a la fuente'); assert.equal(flecha.d[1], 0);
      const nota = p.notas.find(n => /^F\s/.test(n.texto)); assert.ok(nota);
      comprobarVisible(nota.texto, fuerza, 'N', { aproximacion: true });
      assert.deepEqual(valores(p.notas.find(n => /^M\s/.test(n.texto)).texto), [6e24, 600]);
    });
  };
  for (let k = control.min; k <= control.max + 1e-10; k += control.paso) {
    revisar(k); if (juego.mision.logrado({ k })) ganadores.push({ k });
  }
  assert.deepEqual(ganadores, [{ k: 2 }]); assert.deepEqual(juego.mision.testigo, ganadores);
  // La animación entrega valores de control redondeados a cinco decimales.
  for (let i = 0; i < 400; i++) revisar(Math.round((control.min + (control.max - control.min) * i / 399) * 1e5) / 1e5);
});

test('Ley: Predice, cada error y Mira calculados aparte; lo previo no delata', () => {
  const p = idea.predice, c = { tipo: 'razon', F0: 160, kM: 2, km: 3, kr: 2 };
  const r = calcular(c), errores = erroresEsperados(c);
  assert.equal(p.opciones.length, 4);
  assert.equal(p.opciones.filter(o => coincideValor(o.texto, r.valor, r.unidad)).length, 1);
  assert.equal(new Set(p.opciones.map(o => visible(o.texto))).size, p.opciones.length);
  for (const o of p.opciones) {
    comprobarVisible(o.texto, o.correcta ? r.valor : errores[o.id], r.unidad);
    if (!o.correcta) { assert.match(o.siFuera, /^Bien /); comprobarVisible(o.siFuera, errores[o.id], r.unidad); }
  }
  const previo = JSON.stringify({ lee: idea.lee, consigna: idea.juega.consigna, mision: idea.juega.mision.texto, datos: p.datos, pregunta: p.pregunta, dibujo: p.dibujo });
  assert.doesNotMatch(previo, /240|tres medios|una vez y media|1[,.]5\s*veces/);
  assert.deepEqual(valores(p.datos), [160]);
  assert.match(p.datos[1], /fuente se duplica.*sonda se triplica/); assert.match(p.datos[2], /centros.*duplica/);
  const conocidas = p.dibujo.datos.paneles[0].notas.filter(n => valores(n.texto).length);
  assert.deepEqual(conocidas.map(n => valores(n.texto)), [[160], [2], [3]]);
  assert.ok(!p.dibujo.datos.paneles.some(panel => panel.flechas?.length));
  const revelada = p.revelar.datos.paneles[0].notas.find(n => /^F_nueva/.test(n.texto));
  comprobarVisible(revelada.texto, r.valor, r.unidad);
  const esperados = [[2], [2, 3, 6], [2, 2, 4], [160, 6, 4, r.valor]];
  assert.equal(idea.mira.pasos.length, esperados.length);
  idea.mira.pasos.forEach((paso, i) => { igualdades(paso.ecuacion); assert.deepEqual(valores(paso.ecuacion), esperados[i]); });
});

