'use strict';

// Oráculo independiente: solo _datos entra a los cálculos. No importa motores ni comparadores de producción.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const gen = require('./generador.js');

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
  const ts = s.match(/\d+(?:\.\d+)?(?:e[+-]?\d+)?|[()+\-*/^√∛]/gi) || [];
  assert.equal(ts.join(''), s, 'No es una expresión numérica: ' + texto); let i = 0;
  function atomo() { if (ts[i] === '(') { i++; const a = sumar(); assert.equal(ts[i++], ')', texto); return a; } if (ts[i] === '√' || ts[i] === '∛') { const grado = ts[i++] === '∛' ? 3 : 2; return q(raizPositiva(atomo(), grado)); } const a = ts[i++]; assert.match(a || '', /^\d+(?:\.\d+)?(?:e[+-]?\d+)?$/i, texto); return q(a); }
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

const TIPOS = ['fuerza', 'factores-fuerza', 'superposicion', 'campo', 'peso-altura', 'campo-nulo', 'potencial',
  'trabajo-radial', 'rapidez-energia', 'circular', 'periodo-altura', 'altura-otra-orbita', 'semieje', 'sector-tiempo',
  'kepler-extremos', 'escape', 'escape-superficie', 'escape-radial'];
function raizPositiva(x, grado = 2) {
  const valor = x instanceof Q ? x.n() : x; assert.ok(valor >= 0 && Number.isFinite(valor));
  if (valor === 0) return 0;
  let lo = 0, hi = 1; while (hi ** grado < valor) hi *= 2;
  for (let i = 0; i < 120; i++) { const m = (lo + hi) / 2; if (m ** grado < valor) lo = m; else hi = m; }
  return (lo + hi) / 2;
}
function aportes(d) {
  const numerador = q(d.G).mul(d.m), xb = q(d.D).sub(d.x);
  assert.ok(d.x !== 0 && xb.n() !== 0);
  return [numerador.mul(d.MA).div(q(d.x).pow(2)).mul(d.x < 0 ? 1 : -1),
    numerador.mul(d.MB).div(xb.pow(2)).mul(xb.n() > 0 ? 1 : -1)];
}
function trabajoPorMasa(GM, ri, rf) {
  // Integración exacta con el cambio u=1/r: F/m·dr = GM·du.
  return q(GM).mul(q(1).div(rf).sub(q(1).div(ri)));
}
function integralFuerza(GM, ri, rf, tramos = 1024) {
  const ancho = (rf - ri) / tramos; let integral = 0;
  for (let k = 0; k <= tramos; k++) {
    const r = ri + k * ancho;
    integral += (k === 0 || k === tramos ? 1 : k % 2 ? 4 : 2) * (-GM / (r * r));
  }
  return integral * ancho / 3;
}
function puntoNulo(MA, MB, D) {
  let lo = 0, hi = D;
  for (let i = 0; i < 120; i++) {
    const x = (lo + hi) / 2;
    if (MA / (x * x) > MB / ((D - x) ** 2)) lo = x; else hi = x;
  }
  return (lo + hi) / 2;
}
function retorno(GM, r0, v0) {
  const cinetica = q(v0).pow(2).div(2);
  assert.ok(cinetica.n() < q(GM).div(r0).n(), 'El retorno exige energía negativa');
  const queda = r => cinetica.add(trabajoPorMasa(GM, r0, r)).n();
  let lo = r0, hi = 2 * r0;
  while (queda(hi) > 0) hi *= 2;
  for (let i = 0; i < 110; i++) { const r = (lo + hi) / 2; if (queda(r) > 0) lo = r; else hi = r; }
  return (lo + hi) / 2;
}

function calcular(d) {
  let valor, unidad;
  switch (d.tipo) {
    case 'fuerza': valor = q(d.G).mul(d.M).mul(d.m).div(q(d.r).pow(2)); unidad = 'N'; break;
    case 'factores-fuerza': valor = q(d.F0).mul(d.kM).mul(d.km).div(q(d.kr).pow(2)); unidad = 'N'; break;
    case 'superposicion': valor = suma(aportes(d)); unidad = 'N'; break;
    case 'campo': valor = q(d.GM).div(q(d.r).pow(2)); unidad = 'N/kg'; break;
    case 'peso-altura': valor = q(d.GM).mul(q(d.gramos).div(1000)).div(q(d.R).add(d.h).pow(2)); unidad = 'N'; break;
    case 'campo-nulo': valor = puntoNulo(d.MA, d.MB, d.D) / 1000; unidad = 'km'; break;
    case 'potencial': valor = q(d.GM).mul(d.m).neg().div(d.r).div(1e6); unidad = 'MJ'; break;
    case 'trabajo-radial': valor = trabajoPorMasa(d.GM, d.ri, d.rf).mul(d.m).div(1e6); unidad = 'MJ'; break;
    case 'rapidez-energia': {
      const cinetica = q(d.vi).pow(2).div(2).add(trabajoPorMasa(d.GM, d.ri, d.rf));
      assert.ok(cinetica.n() >= 0, 'La posición debe ser alcanzable');
      valor = raizPositiva(cinetica.mul(2)) / 1000; unidad = 'km/s'; break;
    }
    case 'circular': valor = raizPositiva(q(d.GM).div(d.r)) / 1000; unidad = 'km/s'; break;
    case 'periodo-altura': {
      const radio = q(d.R).add(d.h), velocidad = raizPositiva(q(d.GM).div(radio));
      valor = 2 * Math.PI * radio.n() / velocidad / 3600; unidad = 'h'; break;
    }
    case 'altura-otra-orbita': {
      const cuboR2 = q(d.r1).pow(3).mul(q(d.T2).pow(2)).div(q(d.T1).pow(2));
      valor = (raizPositiva(cuboR2, 3) - d.R) / 1000; unidad = 'km'; break;
    }
    case 'semieje': valor = q(d.rp).add(d.ra).div(2000); unidad = 'km'; break;
    case 'sector-tiempo': valor = q(d.T).div(d.S_total).mul(d.S_barrida); unidad = 's'; break;
    case 'kepler-extremos': {
      const a = q(d.rp).add(d.ra).div(2), periodo2 = q(d.T1).pow(2).mul(a.pow(3)).div(q(d.a1).pow(3));
      valor = raizPositiva(periodo2); unidad = 's'; break;
    }
    case 'escape': valor = raizPositiva(q(d.GM).div(d.r0).mul(2)) / 1000; unidad = 'km/s'; break;
    case 'escape-superficie': {
      const GM = q(d.g0).mul(q(d.R).pow(2)), energia = GM.div(q(d.R).add(d.h));
      valor = raizPositiva(energia.mul(2)) / 1000; unidad = 'km/s'; break;
    }
    case 'escape-radial': {
      assert.ok(['residual', 'retorno'].includes(d.variante));
      if (d.variante === 'retorno') { valor = retorno(d.GM, d.r0, d.v0) / 1000; unidad = 'km'; }
      else {
        const energia = q(d.v0).pow(2).div(2).sub(q(d.GM).div(d.r0));
        assert.ok(energia.n() > 0, 'La rapidez residual debe ser positiva');
        valor = raizPositiva(energia.mul(2)) / 1000; unidad = 'km/s';
      }
      break;
    }
    default: throw new Error('Tipo sin cálculo independiente: ' + d.tipo);
  }
  return { valor: valor instanceof Q ? valor.n() : valor, unidad };
}

function errores(d) {
  const c = q(calcular(d).valor), salida = {};
  const poner = campos => { for (const [id, valor] of Object.entries(campos)) salida['GRP-' + d.tipo.toUpperCase() + '-' + id] = valor instanceof Q ? valor.n() : valor; };
  const raiz = n => { n = n instanceof Q ? n.n() : n; return n < 0 ? NaN : raizPositiva(n); };
  switch (d.tipo) {
    case 'fuerza': poner({ 'SIN-CUADRADO': q(d.G).mul(d.M).mul(d.m).div(d.r), DIAMETRO: c.div(4), 'DOS-FUERZAS': c.mul(2), SIGNO: c.neg() }); break;
    case 'factores-fuerza': {
      const base = q(d.F0), r2 = q(d.kr).pow(2);
      poner({ 'DISTANCIA-LINEAL': base.mul(d.kM).mul(d.km).div(d.kr), 'SIN-DISTANCIA': base.mul(d.kM).mul(d.km), 'SIN-MASAS': base.div(r2), 'SOLO-FUENTE': base.mul(d.kM).div(r2), 'SOLO-SONDA': base.mul(d.km).div(r2) }); break;
    }
    case 'superposicion': {
      const [a, b] = aportes(d);
      poner({ MODULOS: a.abs().add(b.abs()), SIGNO: c.neg(), 'SOLO-A': a, 'SOLO-B': b, 'IGUAL-DISTANCIA': q(d.G).mul(d.m).mul(q(d.MB).sub(d.MA)).div(q(d.x).pow(2)) }); break;
    }
    case 'campo': poner({ DIAMETRO: c.div(4), 'MEDIO-RADIO': c.mul(4), 'SIN-CUADRADO': q(d.GM).div(d.r), SIGNO: c.neg() }); break;
    case 'peso-altura': {
      const n = q(d.GM).mul(q(d.gramos).div(1000)), base = { 'ALTURA-RADIO': n.div(q(d.h).pow(2)), SUPERFICIE: n.div(q(d.R).pow(2)), 'SIN-GRAMOS': c.mul(1000), 'DOS-FUERZAS': c.mul(2), DIAMETRO: c.div(4) };
      if (d.R !== d.h) base['RESTAR-ALTURA'] = n.div(q(d.R).sub(d.h).pow(2)); poner(base); break;
    }
    case 'campo-nulo': poner({ MEDIO: q(d.D).div(2000), LINEAL: q(d.D).mul(d.MA).div(q(d.MA).add(d.MB)).div(1000), 'DESDE-B': q(d.D).div(1000).sub(c), 'SIN-SUMA': d.D * raiz(q(d.MA).div(d.MB)) / 1000 }); break;
    case 'potencial': poner({ SIGNO: c.neg(), MITAD: c.div(2), DOBLE: c.mul(2), 'SIN-MASA': c.div(d.m) }); break;
    case 'trabajo-radial': {
      const n = q(d.GM).mul(d.m).neg().div(1e6), Ui = n.div(d.ri), Uf = n.div(d.rf);
      poner({ SIGNO: c.neg(), SUMA: Ui.add(Uf), INICIAL: Ui, FINAL: Uf.neg() }); break;
    }
    case 'rapidez-energia': {
      const cambio = trabajoPorMasa(d.GM, d.ri, d.rf).mul(2), vi2 = q(d.vi).pow(2);
      poner({ 'SIGNO-POTENCIAL': raiz(vi2.sub(cambio)) / 1000, 'SIN-CAMBIO': d.vi / 1000, 'SIN-DOS': raiz(vi2.add(cambio.div(2))) / 1000, 'DOBLE-CAMBIO': raiz(vi2.add(cambio.mul(2))) / 1000 }); break;
    }
    case 'circular': poner({ 'SIN-RAIZ': q(d.GM).div(d.r).div(1000), DIAMETRO: c.n() / raiz(2), 'DOBLE-GM': c.n() * raiz(2), SIGNO: c.neg(), 'SIN-CONVERSION': c.mul(1000) }); break;
    case 'periodo-altura': poner({ 'ALTURA-RADIO': 2 * Math.PI * d.h / raiz(q(d.GM).div(d.h)) / 3600, 'SIN-DOS': c.div(2), 'SIN-PI': c.n() / Math.PI, 'SIN-HORAS': c.mul(3600), DIAMETRO: c.n() * raiz(8) }); break;
    case 'altura-otra-orbita': {
      const r2 = c.mul(1000).add(d.R);
      const invertido = raizPositiva(q(d.r1).pow(3).mul(q(d.T1).pow(2)).div(q(d.T2).pow(2)), 3);
      poner({ 'SIN-RESTAR-R': r2.div(1000), 'SUMAR-R': r2.add(d.R).div(1000), LINEAL: q(d.r1).mul(d.T2).div(d.T1).sub(d.R).div(1000), INVERSA: (invertido - d.R) / 1000 }); break;
    }
    case 'semieje': poner({ SUMA: q(d.rp).add(d.ra).div(1000), DIFERENCIA: q(d.ra).sub(d.rp).div(2000), LEJANO: d.ra / 1000, CERCANO: d.rp / 1000 }); break;
    case 'sector-tiempo': poner({ INVERSA: q(d.T).mul(d.S_total).div(d.S_barrida), RESTANTE: q(d.T).mul(q(d.S_total).sub(d.S_barrida)).div(d.S_total), TOTAL: d.T, MITAD: c.div(2) }); break;
    case 'kepler-extremos': {
      const periodo = a => raiz(q(d.T1).pow(2).mul(q(a).pow(3)).div(q(d.a1).pow(3))), a = q(d.rp).add(d.ra).div(2);
      poner({ LEJANO: periodo(d.ra), CERCANO: periodo(d.rp), 'SIN-MITAD': periodo(q(d.rp).add(d.ra)), LINEAL: q(d.T1).mul(a).div(d.a1), 'SIN-RAIZ': q(d.T1).mul(a.pow(3)).div(q(d.a1).pow(3)) }); break;
    }
    case 'escape': poner({ 'SIN-DOS': c.n() / raiz(2), DOBLE: c.mul(2), 'SIN-RAIZ': q(d.GM).mul(2).div(d.r0).div(1000), SIGNO: c.neg() }); break;
    case 'escape-superficie': {
      const GM = q(d.g0).mul(q(d.R).pow(2));
      poner({ 'ALTURA-RADIO': raiz(GM.mul(2).div(d.h)) / 1000, SUPERFICIE: raiz(q(d.g0).mul(2).mul(d.R)) / 1000, 'SIN-DOS': c.n() / raiz(2), 'CAMPO-FIJO': raiz(q(d.g0).mul(2).mul(q(d.R).add(d.h))) / 1000 }); break;
    }
    case 'escape-radial': {
      const v2 = q(d.v0).pow(2), potencial = q(d.GM).div(d.r0);
      if (d.variante === 'residual') poner({ SUMA: raiz(v2.add(potencial.mul(2))) / 1000, 'SIN-DOS': raiz(v2.sub(potencial)) / 1000, INICIAL: d.v0 / 1000, 'RESTA-RAPIDECES': (d.v0 - raiz(potencial.mul(2))) / 1000 });
      else poner({ ALTURA: c.sub(q(d.r0).div(1000)), 'SIN-DOS': q(1).div(q(1).div(d.r0).sub(v2.div(d.GM))).div(1000), SUMA: q(1).div(q(1).div(d.r0).add(v2.div(q(d.GM).mul(2)))).div(1000), INICIAL: d.r0 / 1000 });
      break;
    }
    default: throw new Error('Tipo sin errores independientes: ' + d.tipo);
  }
  return salida;
}

function fisica(d, r) {
  for (const [k, v] of Object.entries(d)) if (typeof v === 'number') {
    assert.ok(Number.isFinite(v), 'Entrada no finita: ' + k);
    if (!['x', 'h'].includes(k)) assert.ok(v > 0, 'Entrada positiva: ' + k);
  }
  if (d.h != null) assert.ok(d.h >= 0, 'La altura exterior no puede ser negativa');
  if (d.tipo === 'superposicion') assert.ok(d.x > 0 && d.x < d.D, 'Punto entre las fuentes');
  if (d.tipo === 'campo-nulo') {
    const x = r.valor * 1000; assert.ok(x > 0 && x < d.D);
    cerca(d.MA / x ** 2, d.MB / (d.D - x) ** 2, 'Campos iguales en el punto nulo');
  }
  if (['trabajo-radial', 'rapidez-energia'].includes(d.tipo)) {
    const exacto = trabajoPorMasa(d.GM, d.ri, d.rf).n();
    const integral = integralFuerza(d.GM, d.ri, d.rf);
    assert.ok(Math.abs(exacto - integral) <= 2e-8 * Math.max(1e-30, Math.abs(exacto)), 'Integral independiente de la fuerza');
    if (d.tipo === 'trabajo-radial') assert.equal(Math.sign(r.valor), Math.sign(d.ri - d.rf));
    else cerca((r.valor * 1000) ** 2 / 2 + d.GM / d.ri, d.vi ** 2 / 2 + d.GM / d.rf, 'Conservación de energía específica');
  }
  if (d.tipo === 'potencial') assert.ok(r.valor < 0, 'Referencia cero en el infinito');
  if (d.tipo === 'circular') cerca((r.valor * 1000) ** 2 / d.r, d.GM / d.r ** 2, 'Aceleración centrípeta igual al campo');
  if (d.tipo === 'periodo-altura') {
    const radio = d.R + d.h, T = r.valor * 3600;
    cerca((2 * Math.PI / T) ** 2 * radio, d.GM / radio ** 2, 'Período y radio describen el mismo círculo');
  }
  if (d.tipo === 'altura-otra-orbita') {
    const r2 = r.valor * 1000 + d.R; assert.ok(r.valor >= 0 && d.r1 >= d.R);
    cerca(d.T1 ** 2 / d.r1 ** 3, d.T2 ** 2 / r2 ** 3, 'Dos órbitas y misma fuente');
  }
  if (d.rp != null) assert.ok(d.rp <= d.ra && d.rp > 0);
  if (d.tipo === 'sector-tiempo') assert.ok(d.S_barrida > 0 && d.S_barrida <= d.S_total && r.valor > 0 && r.valor <= d.T);
  if (d.tipo === 'kepler-extremos') {
    const a = (d.rp + d.ra) / 2; cerca(r.valor ** 2 / a ** 3, d.T1 ** 2 / d.a1 ** 3, 'Semieje de los extremos, no radio instantáneo');
  }
  if (d.tipo === 'escape') cerca((r.valor * 1000) ** 2 / 2, d.GM / d.r0, 'Umbral de energía cero');
  if (d.tipo === 'escape-superficie') cerca((r.valor * 1000) ** 2 / 2, d.g0 * d.R ** 2 / (d.R + d.h), 'Campo superficial y altura coherentes');
  if (d.tipo === 'escape-radial') {
    if (d.variante === 'retorno') {
      const rMax = r.valor * 1000; assert.ok(rMax > d.r0);
      cerca(d.v0 ** 2 / 2 + trabajoPorMasa(d.GM, d.r0, rMax).n() + d.GM / d.r0, d.GM / d.r0, 'La rapidez se anula en el retorno');
    } else {
      assert.ok(r.valor > 0 && r.valor * 1000 < d.v0);
      cerca((r.valor * 1000) ** 2 / 2 + d.GM / d.r0, d.v0 ** 2 / 2, 'Energía residual en el límite');
    }
  }
}

function formatoIndependiente(valor, unidad, aproximado = false) {
  const exponente = valor && (Math.abs(valor) >= 1e6 || Math.abs(valor) < 0.001) ? Math.floor(Math.log10(Math.abs(valor))) : 0;
  const mantisa = exponente ? valor / 10 ** exponente : valor;
  const redondeada = Math.sign(mantisa) * Math.round((Math.abs(mantisa) + Number.EPSILON) * 1000) / 1000;
  const exacto = Math.abs(redondeada * 10 ** exponente - valor) <= 1e-12 * Math.max(Math.abs(valor), 1e-30);
  const grupos = n => { const [a, b] = String(n).split('.'); return a.replace(/\B(?=(\d{3})+(?!\d))/g, ' ').replace('-', '−') + (b ? ',' + b : ''); };
  const elevado = s => String(s).replace(/[-0123456789]/g, c => ({ '-': '⁻', 0: '⁰', 1: '¹', 2: '²', 3: '³', 4: '⁴', 5: '⁵', 6: '⁶', 7: '⁷', 8: '⁸', 9: '⁹' })[c]);
  return `${aproximado || !exacto ? '≈ ' : ''}${grupos(redondeada)}${exponente ? ' × 10' + elevado(exponente) : ''}${unidad ? ' ' + unidad : ''}`;
}

function entorno(d) {
  const r = calcular(d), e = { ...d, π: Math.PI };
  delete e.idea; delete e.tipo; delete e.variante; delete e.nivel;
  if (d.gramos != null) e.m = d.gramos / 1000;
  if (d.R != null && d.h != null) e.r = d.R + d.h;
  if (d.r0 != null) e.r = e.r_0 = d.r0;
  if (d.ri != null) e.r_i = e.r_1 = d.ri;
  if (d.rf != null) e.r_f = e.r_2 = d.rf;
  if (d.vi != null) e.v_i = e.v_1 = d.vi;
  if (d.v0 != null) e.v_0 = d.v0;
  if (d.G != null && d.M != null) e.GM = d.G * d.M;
  if (d.F0 != null) e.F_0 = e.F_ref = d.F0;
  if (d.g0 != null) { e.g_0 = d.g0; e.GM = d.g0 * d.R ** 2; }
  if (e.GM != null && e.r != null) e.g = e.GM / e.r ** 2;
  if (d.MA != null) e.M_A = d.MA;
  if (d.MB != null) e.M_B = d.MB;
  if (d.tipo === 'superposicion') {
    const [a, b] = aportes(d); e.r_A = d.x; e.r_B = d.D - d.x;
    e.F_A = e.FA = a.abs().n(); e.F_B = e.FB = b.abs().n(); e.F_Ax = a.n(); e.F_Bx = b.n(); e.F_x = r.valor;
  }
  if (d.tipo === 'campo-nulo') { e.r_A = r.valor * 1000; e.r_B = d.D - e.r_A; }
  if (['fuerza', 'factores-fuerza', 'peso-altura'].includes(d.tipo)) e.F = e.F_nueva = e.F_2 = r.valor;
  if (d.tipo === 'campo') e.g = r.valor;
  if (d.tipo === 'potencial') e.E_PG = r.valor * 1e6;
  if (['trabajo-radial', 'rapidez-energia'].includes(d.tipo)) {
    const m = d.m || 1; e.E_PG_i = e.E_PG_1 = e.U_i = -d.GM * m / d.ri;
    e.E_PG_f = e.E_PG_2 = e.U_f = -d.GM * m / d.rf;
    e.W_g = trabajoPorMasa(d.GM, d.ri, d.rf).mul(m).n();
  }
  if (d.tipo === 'rapidez-energia') e.v_f = e.v_2 = r.valor * 1000;
  if (d.tipo === 'circular') e.v = e.v_c = r.valor * 1000;
  if (d.tipo === 'periodo-altura') e.T = r.valor * 3600;
  if (d.tipo === 'altura-otra-orbita') { e.r_1 = d.r1; e.r_2 = r.valor * 1000 + d.R; e.h = r.valor * 1000; e.GM = 4 * Math.PI ** 2 * d.r1 ** 3 / d.T1 ** 2; }
  if (d.T1 != null) e.T_1 = d.T1;
  if (d.T2 != null) e.T_2 = d.T2;
  if (d.rp != null) { e.r_p = d.rp; e.r_a = d.ra; e.a = e.a_2 = (d.rp + d.ra) / 2; }
  if (d.a1 != null) e.a_1 = d.a1;
  if (d.tipo === 'sector-tiempo') e.Δt = e.dt = r.valor;
  if (d.tipo === 'kepler-extremos') e.T_2 = e.T2 = r.valor;
  if (['escape', 'escape-superficie'].includes(d.tipo)) e.v_esc = r.valor * 1000;
  if (d.tipo === 'escape-superficie') e.r_0 = d.R + d.h;
  if (d.tipo === 'escape-radial') {
    if (d.variante === 'retorno') e.r_max = r.valor * 1000;
    else e.v_inf = r.valor * 1000;
    e.v_esc = raizPositiva(q(d.GM).mul(2).div(d.r0));
  }
  return e;
}

const UNIDADES = [
  ['N·m²/kg²', 1], ['N⋅m²/kg²', 1], ['m³/s²', 1], ['m/s²', 1], ['km/s', 1000], ['m/s', 1],
  ['N/kg', 1], ['MJ', 1e6], ['GJ', 1e9], ['J', 1], ['km', 1000], ['m²', 1], ['m', 1], ['kg', 1], ['g', 0.001], ['N', 1], ['h', 3600], ['s', 1]
];
function ladoExpresion(texto, variables) {
  let s = plano(texto).trim().replace(/[.;]$/, ''), factor = 1;
  for (const [u, f] of UNIDADES) if (s.endsWith(' ' + u)) {
    const previo = s.slice(0, -u.length).trim();
    if (!/[+\-−*/^]$/.test(previo)) { s = previo; factor = f; break; }
  }
  s = normal(s).replace(/\b([A-Za-z]+)\{([^}]+)\}/g, '$1_$2').replace(/(\d|\))(?=π|GM\b)/g, '$1*').replace(/π(?=[\p{L}_])/gu, 'π*');
  const originales = s;
  // Una variable se reemplaza por sus datos SI; nunca por el número de producción.
  const claves = Object.keys(variables).sort((a, b) => b.length - a.length);
  for (const k of claves) {
    const segura = k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const re = new RegExp('(?<![\\p{L}\\d_])' + segura + '(?![\\p{L}\\d_])', 'gu');
    s = s.replace(re, '(' + variables[k] + ')');
  }
  s = s.replace(/(\d|\))(?=\()/g, '$1*').replace(/\)(?=\d)/g, ')*');
  assert.doesNotMatch(s, /[A-BD-FH-RT-UW-Zb-df-rt-uw-zα-ω]/, 'Símbolo sin valor independiente: ' + originales);
  return { valor: expresion(s).n() * factor, factor, original: originales };
}

function comprobarEcuaciones(filas, d) {
  const variables = entorno(d); let evaluadas = 0;
  for (const fila of filas) for (const segmento of plano(fila).split(';')) {
    if (!/[=≈]/.test(segmento)) continue;
    const partes = segmento.split(/([=≈])/), valores = [];
    const ultimo = ladoExpresion(partes.at(-1), variables), escala = ultimo.factor;
    for (let i = 0; i < partes.length; i += 2) valores.push(ladoExpresion(partes[i], variables));
    // Las soluciones expresan el símbolo izquierdo en la unidad final y sus
    // cuentas numéricas incluyen la conversión (por ejemplo, /1000 para km).
    valores[0].valor /= escala;
    for (let i = 1; i < valores.length; i++) { valores[i].valor /= valores[i].factor; valores[i].factor = 1; }
    for (let i = 1; i < valores.length; i++) {
      const a = valores[i - 1], b = valores[i], relacion = partes[2 * i - 1];
      if (relacion === '≈') {
        const ultimos = literales(b.original);
        if (ultimos.length === 1) comprobarVisible('≈ ' + ultimos[0], a.valor / b.factor, '');
        else cerca(a.valor, b.valor, 'Ecuación aproximada con operaciones: ' + segmento);
      } else cerca(a.valor, b.valor, 'Ecuación con símbolos: ' + segmento);
      evaluadas++;
    }
  }
  return evaluadas;
}

function cifras(x) { return literales(plano(x).replace(/m³\/s²|m\/s²|m²|N·m²\/kg²/g, '')); }
function cantidadesVisibles(p, d) {
  let xs;
  switch (d.tipo) {
    case 'fuerza': xs = [d.m, d.r / 1000, d.M]; break;
    case 'factores-fuerza': xs = [d.F0, d.kM, d.km, d.kr]; break;
    case 'superposicion': xs = [d.MA, d.MB, d.D / 1000, d.m, d.x / 1000]; break;
    case 'campo': xs = [d.r / 1000]; break;
    case 'peso-altura': xs = [d.gramos, d.h / 1000, d.R / 1000]; break;
    case 'campo-nulo': xs = [d.MA, d.MB, d.D / 1000]; break;
    case 'potencial': xs = [d.m, d.r / 1000]; break;
    case 'trabajo-radial': xs = [d.m, d.ri / 1000, d.rf / 1000]; break;
    case 'rapidez-energia': xs = [d.ri / 1000, d.vi / 1000, d.rf / 1000]; break;
    case 'circular': xs = [d.r / 1000]; break;
    case 'periodo-altura': xs = [d.h / 1000, d.R / 1000]; break;
    case 'altura-otra-orbita': xs = [d.R / 1000, d.r1 / 1000, d.T1, d.T2]; break;
    case 'semieje': xs = [d.rp / 1000, d.ra / 1000]; break;
    case 'sector-tiempo': xs = [d.S_total, d.T / 3600, d.S_barrida]; break;
    case 'kepler-extremos': xs = [d.a1 / 1000, d.T1 / 3600, d.rp / 1000, d.ra / 1000]; break;
    case 'escape': xs = [d.r0 / 1000]; break;
    case 'escape-superficie': xs = [d.R / 1000, d.g0, d.h / 1000]; break;
    case 'escape-radial': xs = [d.r0 / 1000, d.v0 / 1000]; break;
    default: throw new Error('Falta verificar enunciado: ' + d.tipo);
  }
  const ns = cifras([p.enunciado, p.pregunta]).map(x => expresion(x).n());
  assert.equal(ns.length, xs.length, d.tipo + ': número de entradas visibles');
  ns.forEach((n, i) => cerca(n, xs[i], d.tipo + ': entrada visible ' + i));
  if (d.GM != null) {
    const linea = p.datos.find(x => /^GM =/.test(plano(x))); assert.ok(linea, 'El producto GM debe estar dado');
    cerca(expresion(cifras(plano(linea).split(':')[0])[0]).n(), d.GM, 'GM visible');
  }
  if (d.G != null) {
    const linea = p.datos.find(x => /^G ≈/.test(plano(x))); assert.ok(linea, 'G aproximada debe estar dada');
    cerca(expresion(cifras(plano(linea).split('N·')[0])[0]).n(), d.G, 'G visible');
  }
}

function entornoDatos(d) {
  const e = entorno(d);
  if (d.tipo === 'factores-fuerza') {
    // Una realización compatible de los factores permite comprobar la ley
    // general sin inventar una masa o radio que el problema no proporcionó.
    e.G = 6.67e-11; e.M = d.F0 / e.G * d.kM; e.m = d.km; e.r = d.kr;
  }
  if (d.tipo === 'superposicion') { e.M = d.MA; e.r = d.x; e.F = e.F_A; }
  if (d.tipo === 'campo-nulo') {
    e.G = 6.67e-11; e.GM_A = e.G * d.MA; e.GM_B = e.G * d.MB;
    e.g_A = e.GM_A / e.r_A ** 2; e.g_B = e.GM_B / e.r_B ** 2;
  }
  if (d.tipo === 'trabajo-radial') { e.r = d.ri; e.E_PG = e.E_PG_i; }
  if (d.tipo === 'periodo-altura') e.v = 2 * Math.PI * e.r / e.T;
  if (d.tipo === 'altura-otra-orbita') { e.r = e.r_2; e.T = d.T2; }
  return e;
}
function comprobarDatos(p, d) {
  const variables = entornoDatos(d); let evaluadas = 0;
  for (const fila of p.datos) {
    let t = plano(fila).replace(/E_PG,([if])/g, 'E_PG_$1').replace(/^Entre las fuentes,\s*/, '').replace(/ tienen sentidos opuestos\.?$/, '');
    for (let s of t.split(/;| y (?=g_B\s*=)/)) {
      if (!/[=≈]/.test(s)) continue;
      const colon = s.indexOf(':'), igualdad = s.search(/[=≈]/);
      if (colon >= 0) s = colon < igualdad ? s.slice(colon + 1) : s.slice(0, colon);
      s = s.split(/\.\s+/)[0];
      const partes = s.trim().split(/([=≈])/), valores = [];
      for (let i = 0; i < partes.length; i += 2) valores.push(ladoExpresion(partes[i], variables));
      for (let i = 1; i < valores.length; i++) {
        const a = valores[i - 1], b = valores[i];
        if (partes[2 * i - 1] === '≈' && literales(b.original).length === 1) comprobarVisible('≈ ' + b.original, a.valor / b.factor, '');
        else cerca(a.valor, b.valor, 'Fórmula de Datos: ' + s);
        evaluadas++;
      }
    }
  }
  return evaluadas;
}

function validar(p) {
  const d = p._datos, r = calcular(d); fisica(d, r); cantidadesVisibles(p, d);
  cerca(p.respuesta.valor, r.valor, d.tipo + ': respuesta'); assert.equal(p.respuesta.unidad, r.unidad);
  assert.ok(p.alternativas.length >= 4 && p.alternativas.length <= 5);
  assert.equal(p.alternativas.filter(a => a.correcta).length, 1);
  const iguales = p.alternativas.filter(a => Math.abs(a.valor - r.valor) <= 1e-9 * Math.max(1e-30, Math.abs(r.valor)));
  assert.equal(iguales.length, 1, 'Unicidad por fuerza bruta'); assert.equal(iguales[0].correcta, true);
  assert.equal(new Set(p.alternativas.map(a => visible(a.texto))).size, p.alternativas.length, 'Opciones visibles distintas');
  const err = errores(d);
  for (const a of p.alternativas) {
    const esperado = a.correcta ? r.valor : err[a.error?.id];
    assert.ok(Number.isFinite(esperado), 'Operación no cubierta: ' + a.error?.id);
    cerca(a.valor, esperado, a.error?.id || 'Correcta');
    comprobarVisible(a.texto, esperado, r.unidad, { aproximacion: d.G != null });
    if (!a.correcta) {
      assert.match(a.error.explicacion, /^Bien /); assert.equal(a.error.respaldo, 'hipotesis');
      assert.equal(a.error.fuente, 'docs/etapa10/errores-fisica.md');
      comprobarVisible(a.error.explicacion, esperado, r.unidad, { aproximacion: d.G != null });
    }
  }
  assert.ok(comprobarEcuaciones(p.solucion, d) >= 1, 'Falta una cuenta comprobable');
  assert.ok(comprobarDatos(p, d) >= 1, 'Falta una fórmula comprobable en Datos');
  for (const texto of [p.enunciado, p.pregunta, p.datos, p.solucion]) assert.doesNotMatch(plano(texto), /NaN|undefined|Infinity|\[object Object\]/);
  return r;
}

// BATERÍA: las utilidades anteriores también permiten producir casos de referencia
// desde entradas, sin inspeccionar respuesta ni alternativas de producción.
test('Práctica: calibración independiente de operaciones y detección de errores', () => {
  cerca(calcular({ tipo: 'factores-fuerza', F0: 160, kM: 2, km: 3, kr: 2 }).valor, 240);
  cerca(calcular({ tipo: 'peso-altura', GM: 4e14, R: 4e6, h: 4e6, gramos: 40000 }).valor, 250);
  cerca(calcular({ tipo: 'trabajo-radial', GM: 4e14, m: 300, ri: 1e7, rf: 2e7 }).valor, -6000);
  cerca(calcular({ tipo: 'altura-otra-orbita', R: 4e6, r1: 8e6, T1: 1000, T2: 8000 }).valor, 28000);
  cerca(calcular({ tipo: 'escape-radial', GM: 4e14, r0: 8e6, v0: 6000, variante: 'retorno' }).valor, 12500);
  cerca(expresion('∛(64)').n(), 4);
  assert.throws(() => comprobarVisible('0,333 N', 1 / 3, 'N'));
  assert.throws(() => retorno(4e14, 8e6, 11000));
  assert.throws(() => comprobarEcuaciones([['F = 160 × 2 × 3 / 2² = 480 N']], { tipo: 'factores-fuerza', F0: 160, kM: 2, km: 3, kr: 2 }));
  assert.throws(() => igualdades('√(4 × 10²⁴ / 1 × 10²⁴) = 2'));
});

for (const tipo of TIPOS) test('Práctica independiente: 400 semillas de ' + tipo, () => {
  const variantes = new Set();
  for (let s = 0; s < 400; s++) {
    const p = gen.generar(s, { tipo }); assert.equal(p._datos.tipo, tipo); variantes.add(p._datos.variante);
    try { validar(p); } catch (e) { e.message = tipo + ', semilla ' + s + ': ' + e.message; throw e; }
    assert.deepEqual(p, gen.generar(s, { tipo }), 'Semilla no determinística');
  }
  if (tipo === 'escape-radial') assert.deepEqual([...variantes].sort(), ['residual', 'retorno']);
});

test('Práctica: veinte casos de referencia, semillas exactas y texto independiente', () => {
  const casos = JSON.parse(fs.readFileSync(path.join(__dirname, 'casos.json'), 'utf8'));
  assert.equal(casos.plantilla, 'fis-gravitacion'); assert.equal(casos.casos.length, 20);
  assert.equal(new Set(casos.casos.map(c => c.entrada.tipo)).size, 18);
  const variantes = new Set();
  for (const c of casos.casos) {
    const p = gen.generar(c.semilla, c.opciones); assert.deepEqual(p._datos, c.entrada);
    const r = validar(p); cerca(c.esperado.respuesta, r.valor); assert.equal(c.esperado.unidad, r.unidad);
    assert.equal(c.esperado.texto, formatoIndependiente(r.valor, r.unidad, c.entrada.G != null));
    assert.equal(c.esperado.texto, p.alternativas.find(a => a.correcta).texto);
    if (c.entrada.tipo === 'escape-radial') variantes.add(c.entrada.variante);
  }
  assert.deepEqual([...variantes].sort(), ['residual', 'retorno']);
});

test('Práctica: ocho problemas de papel conservan datos, unidades y cuentas independientes', () => {
  const papel = JSON.parse(fs.readFileSync(path.join(__dirname, 'papel.json'), 'utf8'));
  assert.equal(papel.problemas.length, 8);
  assert.deepEqual(papel, require('../../herramientas/papel-generador.js').armar(gen.id));
  const ideas = new Set(), finales = new Set();
  for (let i = 0; i < 8; i++) {
    const p = gen.generar('papel-' + (i + 1)), impreso = papel.problemas[i], r = validar(p);
    ideas.add(p._datos.idea);
    if (p._datos.tipo === 'escape-radial') finales.add(p._datos.variante);
    assert.equal(impreso.id, 'p' + (i + 1));
    assert.ok(impreso.enunciado.includes(plano(p.enunciado)));
    assert.ok(impreso.enunciado.includes(plano(p.pregunta)));
    for (const dato of p.datos) assert.ok(impreso.enunciado.includes(plano(dato)));
    const correcta = p.alternativas.find(a => a.correcta);
    assert.equal(impreso.respuesta, correcta.letra + ') ' + formatoIndependiente(r.valor, r.unidad, p._datos.G != null));
    assert.deepEqual(impreso.pasos, p.solucion.map(plano));
    comprobarVisible(impreso.respuesta, r.valor, r.unidad, { aproximacion: p._datos.G != null });
    assert.ok(comprobarEcuaciones(impreso.pasos, p._datos) >= 1);
  }
  assert.equal(ideas.size, 6);
  assert.deepEqual([...finales].sort(), ['residual', 'retorno']);
});

