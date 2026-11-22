'use strict';

// Camino independiente: solo las entradas de cada ensayo pasan al oráculo.
// No importa motores, fórmulas, soluciones ni valores esperados de producción.
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
      const s = String(a); assert.match(s, /^-?\d+(?:\.\d+)?$/, 'Entrada decimal requerida: ' + s);
      const z = s.split('.'); b = 10n ** BigInt((z[1] || '').length); a = BigInt(z.join(''));
    }
    assert.notEqual(b, 0n); if (b < 0n) { a = -a; b = -b; }
    const g = gcd(a, b); this.a = a / g; this.b = b / g;
  }
  add(x) { x = q(x); return new Q(this.a * x.b + x.a * this.b, this.b * x.b); }
  sub(x) { return this.add(q(x).neg()); }
  mul(x) { x = q(x); return new Q(this.a * x.a, this.b * x.b); }
  div(x) { x = q(x); return new Q(this.a * x.b, this.b * x.a); }
  neg() { return new Q(-this.a, this.b); }
  abs() { return this.a < 0n ? this.neg() : this; }
  n() { return Number(this.a) / Number(this.b); }
}
const q = x => new Q(x);
const suma = xs => xs.reduce((a, x) => a.add(x), q(0));
const cuadrado = x => q(x).mul(x);
const numero = x => x instanceof Q ? x.n() : x;
function cerca(actual, esperado, contexto = '') {
  esperado = numero(esperado);
  assert.ok(Number.isFinite(actual) && Number.isFinite(esperado), contexto + ': valor no finito');
  assert.ok(Math.abs(actual - esperado) <= 1e-9 * Math.max(1, Math.abs(esperado)), `${contexto}: ${actual}; independiente ${esperado}`);
}

function plano(x) {
  if (x == null) return '';
  if (typeof x !== 'object') return String(x);
  if (Array.isArray(x)) return x.map(plano).join('');
  if (x.t != null) return plano(x.t);
  if (x.sub) return plano(x.sub[0]) + '_' + plano(x.sub[1]);
  if (x.sup) return '(' + plano(x.sup[0]) + ')^(' + plano(x.sup[1]) + ')';
  if (x.frac) return '(' + plano(x.frac[0]) + ')/(' + plano(x.frac[1]) + ')';
  return ['texto', 'ecuacion', 'respuesta'].filter(k => x[k] != null).map(k => plano(x[k])).join(' ');
}
function normal(x) {
  return plano(x).replace(/[−–]/g, '-').replace(/(\d)[ \u00a0\u202f](?=\d{3}(?:\D|$))/g, '$1')
    .replace(/,/g, '.').replace(/²/g, '^2').replace(/³/g, '^3').replace(/½/g, '(1/2)');
}
function numeros(x) { return (normal(x).match(/[+-]?\d+(?:\.\d+)?/g) || []).map(Number); }
function visible(x) { const ns = numeros(x); assert.ok(ns.length, 'Falta valor visible: ' + plano(x)); return ns.at(-1); }

// Solo analiza operaciones numéricas visibles, sin eval ni funciones de la plantilla.
function expresion(texto) {
  const s = texto.replace(/\s/g, '').replace(/[·×]/g, '*').replace(/÷/g, '/');
  const ts = s.match(/\d+(?:\.\d+)?|[()+\-*/^√]/g) || [];
  assert.equal(ts.join(''), s, 'Expresión no numérica: ' + texto); let i = 0;
  function atomo() {
    if (ts[i] === '(') { i++; const a = sumar(); assert.equal(ts[i++], ')'); return a; }
    if (ts[i] === '√') { i++; const a = atomo(); assert.ok(a >= 0); return Math.sqrt(a); }
    const a = ts[i++]; assert.match(a || '', /^\d+(?:\.\d+)?$/); return Number(a);
  }
  function potencia() { const a = atomo(); if (ts[i] !== '^') return a; i++; const b = unario(); assert.ok(Number.isInteger(b) && b >= 0 && b < 5); return a ** b; }
  function unario() { if (ts[i] === '+') { i++; return unario(); } if (ts[i] === '-') { i++; return -unario(); } return potencia(); }
  function multiplicar() { let a = unario(); while (ts[i] === '*' || ts[i] === '/') { const op = ts[i++], b = unario(); assert.notEqual(op === '/' ? b : 1, 0); a = op === '*' ? a * b : a / b; } return a; }
  function sumar() { let a = multiplicar(); while (ts[i] === '+' || ts[i] === '-') { const op = ts[i++], b = multiplicar(); a = op === '+' ? a + b : a - b; } return a; }
  const a = sumar(); assert.equal(i, ts.length); return a;
}
function igualdades(x) {
  const t = normal(x), arit = c => c != null && /[\d.\s()+\-·×*/÷^√]/.test(c);
  for (let k = 0; k < t.length; k++) if (t[k] === '=') {
    let a = k, b = k + 1; while (a > 0 && arit(t[a - 1])) a--; while (b < t.length && arit(t[b])) b++;
    const iz = t.slice(a, k).trim().replace(/^\.\s+/, ''), de = t.slice(k + 1, b).trim().replace(/\.$/, '');
    // El 1 de «v_1 = ...» es parte del símbolo, no el número que se iguala.
    const primerCaracter = a + (t.slice(a, k).match(/^\s*/) || [''])[0].length;
    if (primerCaracter > 0 && /[\p{L}_]/u.test(t[primerCaracter - 1])) continue;
    if (/[+\-·×*/÷^]\s*$/.test(iz) || /[+\-·×*/÷^]\s*$/.test(de)) continue;
    if (/\d/.test(iz) && /\d/.test(de)) cerca(expresion(iz), expresion(de), 'Igualdad visible: ' + iz + ' = ' + de);
  }
}

// Elimina incógnitas por operaciones de fila; no usa la fórmula de choque.
function sistema2(fila1, fila2) {
  const [a, b, c] = fila1.map(q), [d, e, f] = fila2.map(q);
  const factor = d.div(a), y = f.sub(c.mul(factor)).div(e.sub(b.mul(factor)));
  return [c.sub(b.mul(y)).div(a), y];
}

function calcular(d) {
  let valor, unidad;
  const p = (m, v) => q(m).mul(v), energia = (m, v) => p(m, v).mul(v).div(2);
  switch (d.tipo) {
    case 'componente':
      valor = p(d.m, d.u); if (d.pide === 'modulo') valor = valor.abs(); unidad = 'kg·m/s'; break;
    case 'conversiones': {
      const m = q(d.g).div(1000), v = q(d.kmh).mul(new Q(5n, 18n));
      valor = m.mul(v); if (d.pide === 'modulo') valor = valor.abs(); unidad = 'kg·m/s'; break;
    }
    case 'despeje-carga':
      valor = q(d.p).div(q(d.mc).add(d.ml)); if (d.unidadSalida === 'km/h') valor = valor.mul(new Q(18n, 5n)); unidad = d.unidadSalida; break;
    case 'fuerza-constante': valor = q(d.F).mul(d.dt); unidad = 'N·s'; break;
    case 'rebote-media': valor = p(d.m, d.w).sub(p(d.m, d.u)).div(d.dt); unidad = 'N'; break;
    case 'tramos-velocidad': {
      // Integramos con puntos medios: exacto en cada pulso lineal.
      const dt = q(d.t1).div(4), puntos = [1, 3, 5, 7];
      const primero = suma(puntos.map(n => q(d.F1).mul(n).div(8).mul(dt)));
      valor = p(d.m, d.u).add(primero).add(q(d.F2).mul(d.t2)).div(d.m); unidad = 'm/s'; break;
    }
    case 'adhesion': case 'energia-transformada': case 'adhesion-rampa': {
      // El balance se despeja por operaciones de fila, fijando igualdad de velocidades.
      const [v] = sistema2([d.m1, d.m2, p(d.m1, d.u1).add(p(d.m2, d.u2))], [1, -1, 0]);
      if (d.tipo === 'adhesion') { valor = v; unidad = 'm/s'; }
      else if (d.tipo === 'energia-transformada') {
        // En el centro de masa, toda la energía relativa se transforma al unirse.
        valor = energia(d.m1, q(d.u1).sub(v)).add(energia(d.m2, q(d.u2).sub(v))); unidad = 'J';
      } else {
        const energiaFinal = energia(d.m1, v).add(energia(d.m2, v));
        const fuerza = q(d.m1).add(d.m2).mul(d.g).mul(d.pide === 'distancia' ? d.mu : 1);
        valor = energiaFinal.div(fuerza); unidad = 'm';
      }
      break;
    }
    case 'retroceso': {
      const total = q(d.m1).add(d.m2), inicial = total.mul(d.V);
      valor = inicial.sub(p(d.m2, d.w2)).div(d.m1); unidad = 'm/s'; break;
    }
    case 'balance-externo': valor = p(d.m1, d.u1).add(p(d.m2, d.u2)).add(d.I).sub(p(d.m2, d.w2)).div(d.m1); unidad = 'm/s'; break;
    case 'elastico-frontal': {
      const inicial = p(d.m1, d.u1).add(p(d.m2, d.u2));
      const vf = sistema2([d.m1, d.m2, inicial], [-1, 1, q(d.u1).sub(d.u2)]);
      valor = vf[d.pide === 'v1' ? 0 : 1]; unidad = 'm/s'; break;
    }
    case 'rapidez-relativa': valor = q(d.w2).sub(d.w1).div(q(d.u1).sub(d.u2)); unidad = ''; break;
    case 'alturas': valor = Math.sqrt(q(d.h1).div(d.h0).n()); unidad = ''; break;
    case 'rebote-tiempo': {
      // Energía gravitatoria y velocidad al despegar; raíz positiva de y(t)=0.
      const llegada = Math.sqrt(q(2).mul(d.g).mul(d.h0).n()), salida = d.e * llegada;
      valor = salida / (d.g / 2); unidad = 's'; break;
    }
    case 'dos-cuerpos': valor = q(d.m1).mul(d.x1).add(q(d.m2).mul(d.x2)).div(q(d.m1).add(d.m2)); unidad = 'm'; break;
    case 'tres-cuerpos': valor = suma(d.masas.map((m, i) => q(m).mul(d.posiciones[i]))).div(suma(d.masas)); unidad = 'm'; break;
    case 'evolucion': {
      // Promediamos posiciones finales individuales, no x_CM(0)+v_CM*t.
      const x1 = q(d.x1).add(q(d.u1).mul(d.t)), x2 = q(d.x2).add(q(d.u2).mul(d.t));
      valor = q(d.m1).mul(x1).add(q(d.m2).mul(x2)).div(q(d.m1).add(d.m2)); unidad = 'm'; break;
    }
    default: throw new Error('Tipo sin cálculo independiente: ' + d.tipo);
  }
  return { valor: numero(valor), unidad };
}

function erroresEsperados(d) {
  const ok = q(calcular(d).valor), resultado = {}, p = (m, v) => q(m).mul(v);
  const poner = (prefijo, valores) => valores.forEach((v, i) => { resultado[`IC-${prefijo}-${i + 1}`] = numero(v); });
  const mt = d.m1 == null ? null : q(d.m1).add(d.m2);
  const pi = d.u1 == null || d.m1 == null ? null : p(d.m1, d.u1).add(p(d.m2, d.u2));
  const vComun = pi && pi.div(mt), ec = (m, v) => p(m, v).mul(v).div(2);
  switch (d.tipo) {
    case 'componente': {
      const tomar = x => d.pide === 'modulo' ? q(x).abs() : q(x);
      poner('COMP', [ok.neg(), tomar(d.u), tomar(q(d.u).div(d.m)), tomar(p(d.m, d.u).mul(d.u))]); break;
    }
    case 'conversiones': {
      const m = q(d.g).div(1000), u = q(d.kmh).mul(new Q(5n, 18n));
      const tomar = x => d.pide === 'modulo' ? q(x).abs() : q(x);
      resultado['U4-IC'] = tomar(q(d.g).mul(u)).n(); resultado['U1-IC'] = tomar(m.mul(d.kmh)).n();
      poner('CONV', [ok.neg(), tomar(u)]); break;
    }
    case 'despeje-carga': {
      const m = q(d.mc).add(d.ml), factor = d.unidadSalida === 'km/h' ? new Q(18n, 5n) : q(1);
      poner('CARGA', [q(d.p).div(d.mc).mul(factor), q(d.p).div(d.ml).mul(factor), q(d.p).mul(m).mul(factor), ok.neg()]); break;
    }
    case 'fuerza-constante': poner('FUERZA', [q(d.F), q(d.F).div(d.dt), ok.neg(), ok.div(2)]); break;
    case 'rebote-media': poner('REBOTE', [q(d.m).mul(q(d.w).abs().sub(q(d.u).abs())).div(d.dt), p(d.m, d.u).neg().div(d.dt), p(d.m, d.w).sub(p(d.m, d.u)), ok.neg(), ok.div(d.dt)]); break;
    case 'tramos-velocidad': {
      const i1 = q(d.F1).mul(d.t1).div(2), i2 = q(d.F2).mul(d.t2), total = i1.add(i2);
      poner('TRAMOS', [q(d.u).add(i1.mul(2).add(i2).div(d.m)), q(d.u).add(i1.sub(i2).div(d.m)), total.div(d.m), q(d.u).add(total)]); break;
    }
    case 'adhesion': poner('ADH', [q(d.u1).add(d.u2).div(2), pi.div(d.m1), p(d.m1, d.u1).div(mt), q(d.m1).mul(q(d.u1).abs()).add(q(d.m2).mul(q(d.u2).abs())).div(mt), ok.neg()]); break;
    case 'retroceso': {
      const inicial = mt.mul(d.V), b = p(d.m2, d.w2);
      poner('RET', [b.neg().div(d.m1), inicial.add(b).div(d.m1), inicial.sub(b).div(mt), ok.neg()]); break;
    }
    case 'balance-externo': {
      const b = p(d.m2, d.w2), final = pi.add(d.I);
      poner('EXT', [pi.sub(b).div(d.m1), pi.sub(d.I).sub(b).div(d.m1), final.add(b).div(d.m1), final.sub(b).div(mt)]); break;
    }
    case 'elastico-frontal': {
      const salidas = sistema2([d.m1, d.m2, pi], [-1, 1, q(d.u1).sub(d.u2)]);
      poner('ELAS', [vComun, d.pide === 'v1' ? d.u2 : d.u1, salidas[d.pide === 'v1' ? 1 : 0], ok.neg()]); break;
    }
    case 'energia-transformada': poner('ENER', [ec(d.m1, d.u1).add(ec(d.m2, d.u2)), ec(mt, vComun), ok.mul(2), ok.div(2)]); break;
    case 'adhesion-rampa': {
      const a = q(d.g).mul(d.pide === 'distancia' ? d.mu : 1);
      poner('RAMPA', [ec(d.m1, d.u1).add(ec(d.m2, d.u2)).div(mt.mul(a)), cuadrado(d.u1).div(a.mul(2)), ok.mul(2), ok.div(2), vComun.div(a.mul(2))]); break;
    }
    case 'rapidez-relativa': {
      const denominadorSuma = q(d.u1).add(d.u2);
      poner('REL', [q(1).div(ok), ok.neg(), q(d.w2).div(d.u1), denominadorSuma.n() ? q(d.w1).add(d.w2).div(denominadorSuma) : Infinity, ok.mul(ok)]); break;
    }
    case 'alturas': poner('ALT', [q(d.h1).div(d.h0), Math.sqrt(q(d.h0).div(d.h1).n()), q(1).sub(ok), q(1).sub(q(d.h1).div(d.h0))]); break;
    case 'rebote-tiempo': poner('VUELO', [ok.div(2), ok.div(d.e), ok.mul(d.e), ok.div(cuadrado(d.e))]); break;
    case 'dos-cuerpos': {
      const numerador = q(d.m1).mul(d.x1).add(q(d.m2).mul(d.x2));
      poner('CM2', [q(d.x1).add(d.x2).div(2), numerador.div(2), q(d.m1).mul(q(d.x1).abs()).add(q(d.m2).mul(q(d.x2).abs())).div(mt), q(d.m2).mul(d.x1).add(q(d.m1).mul(d.x2)).div(mt)]); break;
    }
    case 'tres-cuerpos': {
      const m = d.masas.map(q), x = d.posiciones.map(q), num = suma(m.map((a, i) => a.mul(x[i]))), total = suma(m);
      poner('CM3', [suma(x).div(3), num.div(3), m[0].mul(x[0]).add(m[1].mul(x[1])).div(m[0].add(m[1])), suma(m.map((a, i) => a.mul(x[i].abs()))).div(total)]); break;
    }
    case 'evolucion': {
      const inicial = q(d.m1).mul(d.x1).add(q(d.m2).mul(d.x2)).div(mt), avance = pi.div(mt).mul(d.t);
      poner('EVOL', [inicial, avance, q(d.x1).add(d.x2).add(q(d.u1).add(d.u2).mul(d.t)).div(2), inicial.sub(avance)]); break;
    }
    default: throw new Error('No hay oráculo de errores para ' + d.tipo);
  }
  return resultado;
}

function invariantes(d, respuesta) {
  for (const clave of ['m', 'mc', 'ml', 'm1', 'm2']) if (d[clave] != null) assert.ok(d[clave] > 0, clave + ': masa no positiva');
  if (d.masas) assert.ok(d.masas.every(m => m > 0));
  for (const clave of ['dt', 't1', 't2', 't', 'h0', 'g']) if (d[clave] != null) assert.ok(d[clave] > 0, clave + ': dato no positivo');
  const P = (m, v) => m * v, K = (m, v) => m * v * v / 2;
  if (d.tipo === 'rebote-media') cerca(respuesta * d.dt, P(d.m, d.w) - P(d.m, d.u), 'Impulso del rebote');
  if (d.tipo === 'adhesion') cerca((d.m1 + d.m2) * respuesta, P(d.m1, d.u1) + P(d.m2, d.u2), 'P conservado');
  if (['adhesion', 'elastico-frontal', 'energia-transformada', 'adhesion-rampa', 'rapidez-relativa'].includes(d.tipo)) assert.ok(d.u1 > d.u2, 'No hay acercamiento inicial de A, situado a la izquierda');
  if (d.tipo === 'elastico-frontal') {
    const P0 = P(d.m1, d.u1) + P(d.m2, d.u2), otra = (P0 - respuesta * (d.pide === 'v1' ? d.m1 : d.m2)) / (d.pide === 'v1' ? d.m2 : d.m1);
    const [v1, v2] = d.pide === 'v1' ? [respuesta, otra] : [otra, respuesta];
    cerca(K(d.m1, v1) + K(d.m2, v2), K(d.m1, d.u1) + K(d.m2, d.u2), 'Energía elástica'); assert.ok(v2 > v1, 'Se eligió la solución sin separación');
  }
  if (d.tipo === 'energia-transformada') {
    const vf = (P(d.m1, d.u1) + P(d.m2, d.u2)) / (d.m1 + d.m2);
    cerca(respuesta, K(d.m1, d.u1) + K(d.m2, d.u2) - K(d.m1 + d.m2, vf), 'Diferencia de energías por un segundo camino'); assert.ok(respuesta > 0);
  }
  if (d.tipo === 'retroceso') cerca(P(d.m1, respuesta) + P(d.m2, d.w2), (d.m1 + d.m2) * d.V, 'Movimiento inicial del conjunto');
  if (d.tipo === 'balance-externo') cerca(P(d.m1, respuesta) + P(d.m2, d.w2) - P(d.m1, d.u1) - P(d.m2, d.u2), d.I, 'Impulso externo completo');
  if (d.tipo === 'rapidez-relativa') { assert.ok(d.w2 >= d.w1); assert.ok(respuesta >= 0 && respuesta <= 1); }
  if (d.tipo === 'alturas') { assert.ok(d.h1 >= 0 && d.h1 <= d.h0); cerca(respuesta * respuesta * d.h0, d.h1, 'Altura recuperada'); }
  if (d.tipo === 'rebote-tiempo') { assert.ok(d.e > 0 && d.e <= 1); cerca(d.e * Math.sqrt(2 * d.g * d.h0) * respuesta - d.g * respuesta * respuesta / 2, 0, 'Regreso al nivel de contacto'); }
  if (d.tipo === 'dos-cuerpos' || d.tipo === 'tres-cuerpos') {
    const xs = d.posiciones || [d.x1, d.x2]; assert.ok(respuesta >= Math.min(...xs) - 1e-9 && respuesta <= Math.max(...xs) + 1e-9, 'CM fuera de las masas positivas');
  }
}

function comprobarTextoValor(texto, valor, unidad) {
  const t = plano(texto), n = visible(t), ns = normal(t).match(/[+-]?\d+(?:\.\d+)?/g), ultimo = ns.at(-1);
  const decimales = (ultimo.split('.')[1] || '').length;
  const redondeo = Math.sign(valor) * Math.round((Math.abs(valor) + 1e-12) * 10 ** decimales) / 10 ** decimales;
  cerca(n, redondeo, 'Redondeo de ' + t);
  if (Math.abs(n - valor) > 1e-9 * Math.max(1, Math.abs(valor))) assert.match(t, /≈/, 'Redondeo sin ≈: ' + t);
  if (unidad) assert.ok(t.includes(unidad), 'Falta unidad: ' + t + ' (' + unidad + ')');
}

function afirmarNumeros(texto, esperados, contexto) {
  const ns = numeros(texto); assert.equal(ns.length, esperados.length, contexto + ': números visibles no previstos: ' + plano(texto));
  ns.forEach((n, i) => cerca(n, esperados[i], contexto + ', número ' + (i + 1)));
}
function afirmaciones(p) {
  const d = p._datos, r = calcular(d).valor, pares = [d.m1, d.u1, d.m2, d.u2];
  const mt = d.m1 == null ? null : q(d.m1).add(d.m2), pi = d.u1 == null || d.m1 == null ? null : q(d.m1).mul(d.u1).add(q(d.m2).mul(d.u2));
  const vc = pi && pi.div(mt), ec = (m, v) => q(m).mul(v).mul(v).div(2);
  let entrada, pasos;
  switch (d.tipo) {
    case 'componente': entrada = [d.m, d.u]; pasos = [[d.m, d.u, q(d.m).mul(d.u)], []]; break;
    case 'conversiones': {
      const m = q(d.g).div(1000), u = q(d.kmh).mul(new Q(5n, 18n)); entrada = [d.g, d.kmh]; pasos = [[m, u], [m, u, m.mul(u)], []]; break;
    }
    case 'despeje-carga': { const total = q(d.mc).add(d.ml); entrada = [d.mc, d.ml, d.p]; pasos = [[total], [q(d.p).div(total)], [r]]; break; }
    case 'fuerza-constante': entrada = [d.F, d.dt]; pasos = [[d.F, d.dt, r]]; break;
    case 'rebote-media': entrada = [d.m, d.u, d.w, d.dt]; pasos = [[d.m, d.w, d.u, q(d.m).mul(q(d.w).sub(d.u))], [r]]; break;
    case 'tramos-velocidad': {
      const i1 = q(d.F1).mul(d.t1).div(2), i2 = q(d.F2).mul(d.t2);
      entrada = [d.m, d.u, d.t1, d.F1, d.F2, d.t2]; pasos = [[i1, i2, i1.add(i2)], [r]]; break;
    }
    case 'adhesion': entrada = pares; pasos = [[pi], [mt, r]]; break;
    case 'retroceso': entrada = [d.m1, d.m2, d.V, d.w2]; pasos = [[mt.mul(d.V)], [r]]; break;
    case 'balance-externo': entrada = [...pares, d.I, d.w2]; pasos = [[pi.add(d.I)], [r]]; break;
    case 'elastico-frontal': entrada = pares; pasos = [[], sistema2([d.m1, d.m2, pi], [-1, 1, q(d.u1).sub(d.u2)])]; break;
    case 'energia-transformada': entrada = pares; pasos = [[vc], [ec(d.m1, d.u1).add(ec(d.m2, d.u2)), ec(mt, vc)], [r]]; break;
    case 'adhesion-rampa': {
      entrada = [...pares, ...(d.pide === 'distancia' ? [d.mu] : [])]; const a = q(d.g).mul(d.pide === 'distancia' ? d.mu : 1);
      pasos = [[vc], [], [vc.mul(vc), a.mul(2), r]]; break;
    }
    case 'rapidez-relativa': entrada = [d.u1, d.u2, d.w1, d.w2]; pasos = [[q(d.u1).sub(d.u2), q(d.w2).sub(d.w1)], [r]]; break;
    case 'alturas': entrada = [d.h0, d.h1]; pasos = [[], [d.h1, d.h0, r]]; break;
    case 'rebote-tiempo': {
      const llegada = Math.sqrt(q(2).mul(d.g).mul(d.h0).n()), salida = llegada * d.e;
      entrada = [d.h0, d.e]; pasos = [[llegada, salida], [2 * salida, d.g, r]]; break;
    }
    case 'dos-cuerpos': entrada = [d.m1, d.x1, d.m2, d.x2]; pasos = [[q(d.m1).mul(d.x1).add(q(d.m2).mul(d.x2)), mt], [r]]; break;
    case 'tres-cuerpos': entrada = d.masas.flatMap((m, i) => [m, d.posiciones[i]]); pasos = [[suma(d.masas.map((m, i) => q(m).mul(d.posiciones[i]))), suma(d.masas)], [r]]; break;
    case 'evolucion': entrada = [0, d.m1, d.x1, d.u1, d.m2, d.x2, d.u2]; pasos = [[0, q(d.m1).mul(d.x1).add(q(d.m2).mul(d.x2)).div(mt), vc], [r]]; afirmarNumeros(p.pregunta, [d.t], 'Intervalo pedido'); break;
    default: throw new Error('Afirmaciones sin revisar: ' + d.tipo);
  }
  afirmarNumeros(p.enunciado, entrada, d.tipo + ': entradas del enunciado');
  assert.equal(p.solucion.length, pasos.length, d.tipo + ': pasos sin revisar');
  p.solucion.forEach((paso, i) => afirmarNumeros(paso, pasos[i], d.tipo + ': afirmaciones del paso ' + (i + 1)));
}

function verificar(p, contexto) {
  const d = p._datos, esperado = calcular(d); assert.ok(d && d.tipo);
  cerca(p.respuesta.valor, esperado.valor, contexto); invariantes(d, p.respuesta.valor); afirmaciones(p);
  assert.equal(p.respuesta.unidad, esperado.unidad, contexto + ': unidad');
  assert.ok(p.alternativas.length >= 4 && p.alternativas.length <= 5);
  assert.equal(p.alternativas.filter(a => a.correcta).length, 1);
  assert.equal(new Set(p.alternativas.map(a => visible(a.texto))).size, p.alternativas.length, 'Colisión de alternativas visibles');
  assert.equal(p.alternativas.filter(a => Math.abs(a.valor - esperado.valor) <= 1e-9 * Math.max(1, Math.abs(esperado.valor))).length, 1, 'Unicidad numérica por fuerza bruta');
  const errores = erroresEsperados(d);
  for (const a of p.alternativas) {
    comprobarTextoValor(a.texto, a.valor, esperado.unidad);
    if (a.correcta) cerca(a.valor, esperado.valor, 'Correcta marcada');
    else {
      assert.ok(a.error && Object.hasOwn(errores, a.error.id), 'Error sin oráculo: ' + d.tipo + '/' + (a.error && a.error.id));
      cerca(a.valor, errores[a.error.id], 'Error ' + a.error.id);
      const exp = plano(a.error.explicacion); assert.match(exp, /^Bien /);
      assert.ok(exp.includes(a.texto), 'La explicación no muestra su propio resultado: ' + exp + ' / ' + a.texto);
      igualdades(exp);
    }
  }
  const campos = ['enunciado', 'pregunta', 'datos', 'solucion'];
  for (const campo of campos) {
    const lineas = Array.isArray(p[campo]) ? p[campo] : [p[campo]];
    for (const linea of lineas) { assert.doesNotMatch(plano(linea), /NaN|Infinity|undefined|\[object Object\]/); igualdades(linea); }
  }
  return esperado;
}

for (const tipo of gen.TIPOS) {
  test('Oráculo independiente: 400 semillas de ' + tipo, () => {
    for (let semilla = 0; semilla < 400; semilla++) {
      const p = gen.generar(semilla, { tipo }); assert.equal(p._datos.tipo, tipo);
      verificar(p, tipo + ', semilla ' + semilla);
    }
  });
}

test('Oráculo: los 18 casos archivados coinciden con sus entradas y cálculo aparte', () => {
  const archivo = JSON.parse(fs.readFileSync(path.join(__dirname, 'casos.json'), 'utf8'));
  assert.equal(archivo.casos.length, 18); const tipos = new Set();
  for (const c of archivo.casos) {
    const tipo = c.entrada.tipo, p = gen.generar(c.semilla, { tipo }); tipos.add(tipo);
    assert.deepEqual(p._datos, c.entrada, 'Caso desactualizado: ' + tipo);
    const r = verificar(p, 'casos.json/' + tipo); cerca(c.esperado.respuesta, r.valor, 'Valor archivado independiente');
    comprobarTextoValor(c.esperado.texto, r.valor, r.unidad);
    assert.equal(c.esperado.texto, p.alternativas.find(a => a.correcta).texto);
  }
  assert.deepEqual([...tipos].sort(), [...gen.TIPOS].sort());
});

test('Oráculo: ocho problemas de papel conservan datos, opciones, respuesta y pasos verificados', () => {
  const papel = JSON.parse(fs.readFileSync(path.join(__dirname, 'papel.json'), 'utf8'));
  assert.equal(papel.problemas.length, 8); const entradas = Object.entries(gen.PAPEL); assert.equal(entradas.length, 8);
  for (const [i, [semilla, tipo]] of entradas.entries()) {
    const p = gen.generar(semilla), escrito = papel.problemas[i]; assert.equal(p._datos.tipo, tipo); verificar(p, 'papel/' + semilla);
    const base = `${plano(p.enunciado)} ${plano(p.pregunta)}`.replace(/\s+/g, ' ').trim();
    assert.ok(escrito.enunciado.startsWith(base)); assert.match(escrito.enunciado, / Datos: /);
    for (const dato of p.datos) assert.ok(escrito.enunciado.includes(plano(dato)), 'El papel omitió un dato: ' + plano(dato));
    for (const a of p.alternativas) assert.ok(escrito.enunciado.includes(`${a.letra}) ${a.texto}`));
    const correcta = p.alternativas.find(a => a.correcta); assert.equal(escrito.respuesta, `${correcta.letra}) ${correcta.texto}`);
    assert.deepEqual(escrito.pasos, p.solucion.map(plano).map(x => x.trim()).filter(Boolean));
    escrito.pasos.forEach(igualdades);
  }
});

test('Oráculo: detecta signo alterado, igualdad falsa y choque que no conserva energía', () => {
  igualdades('v_1 = -3 m/s; v2 = 3 m/s');
  assert.throws(() => igualdades('2 · (3 - 5) = 4 N·s'));
  assert.throws(() => comprobarTextoValor('0,33', 1 / 3, ''));
  assert.throws(() => cerca(-4, q(4)));
  assert.throws(() => invariantes({ tipo: 'elastico-frontal', m1: 1, m2: 3, u1: 6, u2: 0, pide: 'v1' }, 1.5));
});

test('Oráculo: casos de control con conversiones, sentidos opuestos y dos etapas', () => {
  const controles = [
    [{ tipo: 'componente', m: 1.25, u: -4, pide: 'componente' }, -5],
    [{ tipo: 'componente', m: 1.25, u: -4, pide: 'modulo' }, 5],
    [{ tipo: 'conversiones', g: 625, kmh: -21.6, pide: 'componente' }, -3.75],
    [{ tipo: 'despeje-carga', mc: 1.25, ml: 0.75, p: -6, unidadSalida: 'km/h' }, -10.8],
    [{ tipo: 'fuerza-constante', F: -6, dt: 0.75 }, -4.5],
    [{ tipo: 'rebote-media', m: 0.375, u: 8, w: -4, dt: 0.03 }, -150],
    [{ tipo: 'tramos-velocidad', m: 0.5, u: 2, F1: 4, t1: 0.5, F2: -2, t2: 0.5 }, 2],
    [{ tipo: 'adhesion', m1: 1.5, m2: 2.5, u1: 6, u2: 2 }, 3.5],
    [{ tipo: 'retroceso', m1: 1, m2: 3, V: 2, w2: 3 }, -1],
    [{ tipo: 'balance-externo', m1: 2, m2: 3, u1: 4, u2: -1, I: -4, w2: 1 }, -1],
    [{ tipo: 'elastico-frontal', m1: 1, m2: 3, u1: 6, u2: 0, pide: 'v1' }, -3],
    [{ tipo: 'elastico-frontal', m1: 1, m2: 3, u1: 6, u2: 0, pide: 'v2' }, 3],
    [{ tipo: 'energia-transformada', m1: 1.5, m2: 2.5, u1: 6, u2: 2 }, 7.5],
    [{ tipo: 'adhesion-rampa', m1: 2, m2: 6, u1: 12, u2: 0, g: 10, pide: 'altura' }, 0.45],
    [{ tipo: 'adhesion-rampa', m1: 2, m2: 6, u1: 12, u2: 0, g: 10, mu: 0.3, pide: 'distancia' }, 1.5],
    [{ tipo: 'rapidez-relativa', u1: 6, u2: 2, w1: 2, w2: 4 }, 0.5],
    [{ tipo: 'alturas', h0: 5, h1: 1.25 }, 0.5],
    [{ tipo: 'rebote-tiempo', h0: 1.25, e: 0.6, g: 10 }, 0.6],
    [{ tipo: 'dos-cuerpos', m1: 1.5, m2: 2.5, x1: 1, x2: 5 }, 3.5],
    [{ tipo: 'tres-cuerpos', masas: [1, 2, 3], posiciones: [-2, 1, 4] }, 2],
    [{ tipo: 'evolucion', m1: 1.5, m2: 2.5, x1: 1, x2: 5, u1: 0.6, u2: -0.2, t: 2 }, 3.7],
  ];
  for (const [datos, esperado] of controles) { cerca(calcular(datos).valor, esperado, datos.tipo); invariantes(datos, esperado); }
});

