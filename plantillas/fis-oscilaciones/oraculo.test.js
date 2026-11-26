'use strict';

// Oráculo independiente. Solo las entradas de _datos se usan como datos físicos.
// No importa calculadores, tablas de errores ni formateadores del generador.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const TIPOS = ['extremos-amplitud', 'conteo-periodo', 'recorrido-mixto', 'fuerza-posicion',
  'aceleracion-masa', 'masa-dos-estados', 'estado-cuartos', 'velocidad-fase', 'primer-paso',
  'resorte-periodo', 'resorte-vertical', 'resortes-conectados', 'pendulo-periodo',
  'pendulo-razon', 'pendulo-longitud', 'energia-total', 'rapidez-posicion', 'amplitud-desde-estado'];

function cerca(a, b, contexto = '', tolerancia = 3e-8) {
  assert.ok(Number.isFinite(a) && Number.isFinite(b), contexto + ': valores finitos');
  assert.ok(Math.abs(a - b) <= tolerancia * Math.max(1, Math.abs(b)), `${contexto}: ${a}; independiente ${b}`);
}
function bisecar(fn, lo, hi, objetivo = 0) {
  let flo = fn(lo) - objetivo;
  assert.ok(flo * (fn(hi) - objetivo) <= 0, 'La bisección debe encerrar la solución');
  for (let n = 0; n < 90; n++) {
    const mid = (lo + hi) / 2, fm = fn(mid) - objetivo;
    if (fm === 0) return mid;
    if (flo * fm <= 0) hi = mid;
    else { lo = mid; flo = fm; }
  }
  return (lo + hi) / 2;
}
function raiz(n) {
  assert.ok(n >= -1e-10 && Number.isFinite(n), 'Radicando válido: ' + n);
  if (n <= 0) return 0;
  return bisecar(x => x * x, 0, Math.max(1, n), n);
}

// RK4 de u'' = -u. No usa seno/coseno ni la fórmula del período.
function paso(z, h) {
  const [u, w] = z;
  const a1 = w, b1 = -u, a2 = w + h * b1 / 2, b2 = -(u + h * a1 / 2);
  const a3 = w + h * b2 / 2, b3 = -(u + h * a2 / 2), a4 = w + h * b3, b4 = -(u + h * a3);
  return [u + h * (a1 + 2 * a2 + 2 * a3 + a4) / 6, w + h * (b1 + 2 * b2 + 2 * b3 + b4) / 6];
}
function primerCruce(inicial, objetivo, sentido, h = 0.002) {
  let z = [inicial, 0], t = 0;
  for (let n = 0; n < 4000; n++) {
    const siguiente = paso(z, h), cruza = (z[0] - objetivo) * (siguiente[0] - objetivo) <= 0;
    if (cruza && t > 1e-9 && Math.sign(siguiente[1]) === sentido) {
      const dt = bisecar(s => paso(z, s)[0], 0, h, objetivo);
      return t + dt;
    }
    z = siguiente; t += h;
  }
  throw new Error('No se encontró el evento dentro de un ciclo');
}
const TAU = 4 * primerCruce(1, 0, -1);
const cacheEstado = new Map(), cacheCruce = new Map();
function estado(fase) {
  fase = ((fase % TAU) + TAU) % TAU;
  const clave = fase.toFixed(12);
  if (!cacheEstado.has(clave)) {
    const n = Math.max(1, Math.ceil(fase / 0.002)), h = fase / n;
    let z = [1, 0];
    for (let i = 0; i < n; i++) z = paso(z, h);
    cacheEstado.set(clave, z);
  }
  return cacheEstado.get(clave);
}
function evento(inicial, objetivo, sentido) {
  const clave = [inicial, objetivo, sentido].join('|');
  if (!cacheCruce.has(clave)) cacheCruce.set(clave, primerCruce(inicial, objetivo, sentido));
  return cacheCruce.get(clave);
}

// Área de fuerza-deformación por trapecios, exacta para una fuerza lineal.
function areaResorte(k, desde, hasta) {
  const partes = 32, dx = (hasta - desde) / partes;
  let total = 0;
  for (let i = 0; i < partes; i++) total += (k * (desde + i * dx) + k * (desde + (i + 1) * dx)) * dx / 2;
  return total;
}
function fuerza(k, x) {
  const h = 0.125;
  return -(areaResorte(k, 0, x + h) - areaResorte(k, 0, x - h)) / (2 * h);
}
function periodoRigidez(m, k) {
  // Cambio de escala temporal de la ecuación integrada: k*(dt)^2=m.
  return TAU * raiz(m / k);
}
function periodoPendulo(L, g) { return TAU * raiz(L / g); }
function estadoCuarto(d, desfase = 0) {
  const q = Math.round(4 * d.t / d.T) + desfase, z = estado(q * TAU / 4 + (d.inicio === 'izquierda' ? TAU / 2 : 0));
  const x = Math.abs(z[0]) < 1e-8 ? 0 : Math.sign(z[0]) * d.ACm;
  const sentido = Math.abs(z[1]) < 1e-8 ? 'reposo' : z[1] > 0 ? 'derecha' : 'izquierda';
  return `x=${x};sentido=${sentido}`;
}

function resolver(d) {
  const r = { unidad: '', intermedios: {} };
  switch (d.tipo) {
    case 'extremos-amplitud': {
      cerca(d.izquierdoCm + d.derechoCm, 0, 'Extremos simétricos');
      r.valor = (Math.abs(d.izquierdoCm) + Math.abs(d.derechoCm)) / 2; r.unidad = 'cm'; break;
    }
    case 'conteo-periodo': {
      assert.ok(Number.isInteger(d.llegadas) && d.llegadas >= 2);
      const intervalo = (d.ultimoInstante - d.primerInstante) / (d.llegadas - 1);
      let acumulado = d.primerInstante;
      for (let i = 1; i < d.llegadas; i++) acumulado += intervalo;
      cerca(acumulado, d.ultimoInstante, 'Última llegada');
      r.valor = d.pide === 'frecuencia' ? 1 / intervalo : intervalo;
      r.unidad = d.pide === 'frecuencia' ? 'Hz' : 's';
      r.intermedios = { intervalos: d.llegadas - 1, duracion: d.ultimoInstante - d.primerInstante, T: intervalo, f: 1 / intervalo }; break;
    }
    case 'recorrido-mixto': {
      const medios = 2 * d.t / d.T;
      assert.ok(Number.isInteger(medios) && medios > 0 && medios % 2 === 1);
      let x = (d.inicio === 'derecha' ? 1 : -1) * d.ACm, recorrido = 0;
      for (let i = 0; i < medios; i++) { const nuevo = -x; recorrido += Math.abs(nuevo - x); x = nuevo; }
      r.valor = recorrido / 100; r.unidad = 'm';
      r.intermedios = { ciclos: Math.floor(medios / 2), medios, recorridoCm: recorrido }; break;
    }
    case 'fuerza-posicion': r.valor = fuerza(d.k, d.xCm / 100); r.unidad = 'N'; break;
    case 'aceleracion-masa': r.valor = fuerza(d.k, d.xCm / 100) / d.m; r.unidad = 'm/s²'; r.intermedios.F = r.valor * d.m; break;
    case 'masa-dos-estados': {
      const k = d.fuerzaPrimera / fuerza(1, d.xPrimeroCm / 100);
      const f2 = fuerza(k, d.xSegundoCm / 100);
      r.valor = f2 / d.aceleracionSegunda; r.unidad = 'kg';
      assert.ok(k > 0 && r.valor > 0); cerca(fuerza(k, d.xPrimeroCm / 100), d.fuerzaPrimera);
      r.intermedios = { k, fuerzaSegunda: f2 }; break;
    }
    case 'estado-cuartos': r.valor = estadoCuarto(d); break;
    case 'velocidad-fase': {
      const omega = TAU / d.T, phi = TAU * d.fasePiNumerador / (2 * d.fasePiDenominador);
      const z = estado(omega * d.t + phi);
      r.valor = d.ACm / 100 * omega * z[1]; r.unidad = 'm/s';
      r.intermedios = { omega, fase: omega * d.t + phi, seno: -z[1], coseno: z[0] }; break;
    }
    case 'primer-paso': {
      assert.ok(Math.abs(d.xCm) < d.ACm && d.T > 0);
      const theta = evento(d.inicio === 'derecha' ? 1 : -1, d.xCm / d.ACm, d.sentido === 'derecha' ? 1 : -1);
      r.valor = theta / TAU * d.T; r.unidad = 's'; r.intermedios.fase = theta; break;
    }
    case 'resorte-periodo': r.valor = periodoRigidez(d.m, d.k); r.unidad = 's'; break;
    case 'resorte-vertical': {
      const delta = (d.longitudEquilibrioCm - d.longitudNaturalCm) / 100;
      assert.ok(delta > 0);
      const k = d.m * d.g / delta;
      cerca(d.m * d.g + fuerza(k, delta), 0, 'Equilibrio vertical');
      r.valor = periodoRigidez(d.m, k); r.unidad = 's'; r.intermedios = { delta, k }; break;
    }
    case 'resortes-conectados': {
      let k;
      if (d.conexion === 'serie') {
        const pruebaF = 2, elongacion = pruebaF / d.rigidezPrimero + pruebaF / d.rigidezSegundo;
        k = pruebaF / elongacion;
      } else {
        const pruebaX = 0.02, totalF = -fuerza(d.rigidezPrimero, pruebaX) - fuerza(d.rigidezSegundo, pruebaX);
        k = totalF / pruebaX;
      }
      r.valor = periodoRigidez(d.m, k); r.unidad = 's'; r.intermedios.k = k; break;
    }
    case 'pendulo-periodo': r.valor = periodoPendulo(d.longitudCm / 100, d.g); r.unidad = 's'; break;
    case 'pendulo-razon': r.valor = periodoPendulo(d.longitudSegundaCm / 100, d.gravedadSegunda) / periodoPendulo(d.longitudPrimeraCm / 100, d.gravedadPrimera); break;
    case 'pendulo-longitud': {
      const T = d.duracion / d.ciclos;
      const L = bisecar(x => periodoPendulo(x, d.g), 0, Math.max(10, T * T * d.g), T);
      r.valor = L; r.unidad = 'm'; r.intermedios.T = T; break;
    }
    case 'energia-total': r.valor = areaResorte(d.k, 0, d.ACm / 100); r.unidad = 'J'; break;
    case 'rapidez-posicion': {
      assert.ok(d.ACm > Math.abs(d.xCm));
      const trabajo = areaResorte(d.k, Math.abs(d.xCm) / 100, d.ACm / 100);
      r.valor = bisecar(v => d.m * v * v / 2, 0, Math.max(1, 2 * trabajo / d.m), trabajo); r.unidad = 'm/s';
      r.intermedios = { mecanica: areaResorte(d.k, 0, d.ACm / 100), elastica: areaResorte(d.k, 0, d.xCm / 100), cinetica: trabajo }; break;
    }
    case 'amplitud-desde-estado': {
      const e = areaResorte(d.k, 0, d.xCm / 100) + d.m * d.v * d.v / 2;
      const A = bisecar(x => areaResorte(d.k, 0, x), 0, Math.max(1, 2 * e / d.k), e);
      r.valor = A * 100; r.unidad = 'cm'; r.intermedios = { mecanica: e, elastica: areaResorte(d.k, 0, d.xCm / 100), cinetica: d.m * d.v * d.v / 2 }; break;
    }
    default: throw new Error('Familia sin oráculo: ' + d.tipo);
  }
  return r;
}

function plano(x) {
  if (x == null) return '';
  if (typeof x !== 'object') return String(x);
  if (Array.isArray(x)) return x.map(plano).join('');
  if (x.t != null) return plano(x.t);
  throw new Error('Nodo inesperado en práctica: ' + JSON.stringify(x));
}

function errores(d, r = resolver(d)) {
  const c = r.valor;
  switch (d.tipo) {
    case 'extremos-amplitud': return { ENTRE_EXTREMOS: d.derechoCm - d.izquierdoCm, POSICION_IZQUIERDA: d.izquierdoCm, RECORRIDO: 4 * c };
    case 'conteo-periodo': {
      const D = d.ultimoInstante - d.primerInstante, n = d.llegadas - 1;
      return d.pide === 'frecuencia' ? { CUENTA_LLEGADAS: d.llegadas / D, NO_RESTA_INICIO: n / d.ultimoInstante, INVIERTE: D / n }
        : { CUENTA_LLEGADAS: D / d.llegadas, NO_RESTA_INICIO: d.ultimoInstante / n, INVIERTE: n / D };
    }
    case 'recorrido-mixto': return { OMITE_MEDIO: 4 * d.ACm * Math.floor(d.t / d.T) / 100,
      MEDIO_EXTRA: 4 * d.ACm * (Math.floor(d.t / d.T) + 1) / 100, DESPLAZAMIENTO: (d.inicio === 'derecha' ? -2 : 2) * d.ACm / 100 };
    case 'fuerza-posicion': return { SIGNO: -c, DOBLE_FUERZA: 2 * c, PROMEDIO: c / 2 };
    case 'aceleracion-masa': return { SIGNO: -c, SIN_MASA: fuerza(d.k, d.xCm / 100), MASA_DOS_VECES: c / d.m };
    case 'masa-dos-estados': return { INVIERTE_MASA: 1 / c, MANTIENE_FUERZA: d.fuerzaPrimera / d.aceleracionSegunda,
      POSICIONES_INVERTIDAS: d.fuerzaPrimera * d.xPrimeroCm / (d.xSegundoCm * d.aceleracionSegunda) };
    case 'estado-cuartos': return { CUENTA_INICIO: estadoCuarto(d, -1), EXTREMO_OPUESTO: estadoCuarto(d, 2), CUARTO_EXTRA: estadoCuarto(d, 1) };
    case 'velocidad-fase': return { SIGNO: -c, SIN_OMEGA: -d.ACm / 100 * r.intermedios.seno, COSENO: -d.ACm / 100 * r.intermedios.omega * r.intermedios.coseno };
    case 'primer-paso': {
      const inicial = d.inicio === 'derecha' ? 1 : -1, sentido = d.sentido === 'derecha' ? 1 : -1;
      return { OTRO_EXTREMO: evento(-inicial, d.xCm / d.ACm, sentido) / TAU * d.T,
        FRECUENCIA_DOBLE: c / 2, VUELTA_EXTRA: c + d.T };
    }
    case 'resorte-periodo': return { SIN_2PI: raiz(d.m / d.k), SIN_RAIZ: TAU * d.m / d.k, DOS_CICLOS: 2 * c };
    case 'resorte-vertical': return { LONGITUD_TOTAL: periodoPendulo(d.longitudEquilibrioCm / 100, d.g), MEDIO_CICLO: c / 2, SIN_RAIZ: TAU * r.intermedios.delta / d.g };
    case 'resortes-conectados': {
      const otro = resolver({ ...d, conexion: d.conexion === 'serie' ? 'paralelo' : 'serie' }).valor;
      return { CONEXION_OPUESTA: otro, SOLO_PRIMERO: periodoRigidez(d.m, d.rigidezPrimero),
        ...(d.conexion === 'serie' ? { DOS_CICLOS: c * 2 } : { MEDIO_CICLO: c / 2 }) };
    }
    case 'pendulo-periodo': return { MEDIO_CICLO: c / 2, DOS_CICLOS: 2 * c, SIN_RAIZ: TAU * d.longitudCm / (100 * d.g) };
    case 'pendulo-razon': return { INVIERTE: 1 / c, SIN_RAIZ: c * c, IGNORA_GRAVEDAD: raiz(d.longitudSegundaCm / d.longitudPrimeraCm) };
    case 'pendulo-longitud': return { MEDIO_CICLO: c / 4, SIN_CUADRADO: d.g * (d.duracion / d.ciclos) / (TAU * TAU), SIN_DOS: 4 * c };
    case 'energia-total': return { SIN_MEDIO: 2 * c, MEDIO_DOS_VECES: c / 2, SIN_CUADRADO: d.k * d.ACm / 200 };
    case 'rapidez-posicion': return { TOTAL: raiz(d.k / d.m) * d.ACm / 100, ELASTICA: raiz(d.k / d.m) * Math.abs(d.xCm) / 100, SIN_DOS: c / raiz(2) };
    case 'amplitud-desde-estado': {
      const solo = 100 * raiz(d.m / d.k) * Math.abs(d.v);
      return { SOLO_CINETICA: solo, POSICION: Math.abs(d.xCm), SUMA_DISTANCIAS: Math.abs(d.xCm) + solo };
    }
    default: throw new Error('Familia sin operadores de errores: ' + d.tipo);
  }
}

function normal(texto) {
  const supers = { '⁻': '-', '⁺': '+', '⁰': '0', '¹': '1', '²': '2', '³': '3', '⁴': '4', '⁵': '5', '⁶': '6', '⁷': '7', '⁸': '8', '⁹': '9' };
  return plano(texto).replace(/[−–]/g, '-').replace(/(\d)[ \u00a0\u202f](?=\d{3}(?:\D|$))/g, '$1')
    .replace(/,/g, '.').replace(/[⁻⁺⁰¹²³⁴⁵⁶⁷⁸⁹]+/g, s => '^(' + [...s].map(c => supers[c]).join('') + ')')
    .replace(/√/g, 'sqrt').replace(/[·×]/g, '*').replace(/÷/g, '/');
}
// Analizador propio: gramática aritmética y funciones trigonométricas evaluadas
// con el oscilador integrado. No ejecuta texto como JavaScript.
function expresion(texto, entorno = {}) {
  let s = normal(texto).replace(/\|([^|]+)\|/g, 'abs($1)').replace(/\s/g, '');
  s = s.replace(/(\d|\))(?=π|sqrt|sen|cos|[a-df-zA-DF-Z])/g, '$1*').replace(/(π|\))(?=\(|sqrt|sen|cos)/g, '$1*');
  const tokens = s.match(/\d+(?:\.\d+)?(?:e[+-]?\d+)?|[A-Za-zÁ-úδωφ]+|π|[()+\-*/^]/g) || [];
  assert.equal(tokens.join(''), s, 'Expresión desconocida: ' + texto);
  let i = 0;
  function atom() {
    const t = tokens[i++];
    if (t === '(') { const r = suma(); assert.equal(tokens[i++], ')', texto); return r; }
    if (t === 'π') return TAU / 2;
    if (['sqrt', 'sen', 'sin', 'cos', 'abs'].includes(t)) {
      const r = unary();
      return t === 'sqrt' ? raiz(r) : t === 'abs' ? Math.abs(r) : t === 'cos' ? estado(r)[0] : -estado(r)[1];
    }
    if (/^\d/.test(t || '')) return Number(t);
    assert.ok(Object.hasOwn(entorno, t), 'Símbolo sin entrada independiente: ' + t + ' en ' + texto);
    return entorno[t];
  }
  function power() { let a = atom(); if (tokens[i] === '^') { i++; a **= unary(); } return a; }
  function unary() { if (tokens[i] === '+') { i++; return unary(); } if (tokens[i] === '-') { i++; return -unary(); } return power(); }
  function product() { let a = unary(); while (tokens[i] === '*' || tokens[i] === '/') { const op = tokens[i++], b = unary(); a = op === '*' ? a * b : a / b; } return a; }
  function suma() { let a = product(); while (tokens[i] === '+' || tokens[i] === '-') { const op = tokens[i++], b = product(); a = op === '+' ? a + b : a - b; } return a; }
  const r = suma(); assert.equal(i, tokens.length, 'Cuenta incompleta: ' + texto); assert.ok(Number.isFinite(r), texto); return r;
}
function numero(n) {
  const signo = n < 0 ? '−' : '', abs = Math.abs(n), redondeado = Math.round((abs + 1e-11 * Math.max(1, abs)) * 1000) / 1000;
  const [entero, decimal] = redondeado.toFixed(3).replace(/0+$/, '').replace(/\.$/, '').split('.');
  return (redondeado ? signo : '') + entero.replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + (decimal ? ',' + decimal : '');
}
function piExacto(n, maximo = 12) {
  const coef = n / (TAU / 2);
  for (let den = 1; den <= maximo; den++) {
    const num = Math.round(coef * den);
    if (Math.abs(coef * den - num) <= 1e-8 * Math.max(1, Math.abs(num))) {
      return num === 0 ? '0' : (num < 0 ? '−' : '') + (Math.abs(num) === 1 ? '' : numero(Math.abs(num))) + 'π' + (den === 1 ? '' : '/' + den);
    }
  }
  return null;
}
function cantidadVisible(texto, esperado, unidad, { fisicaAproximada = false } = {}) {
  let t = plano(texto).trim(), aproximado = t.includes('≈');
  if (unidad) { assert.ok(t.endsWith(unidad), 'Unidad incorrecta: ' + t + ' (se esperaba ' + unidad + ')'); t = t.slice(0, -unidad.length).trim(); }
  const valor = expresion(t.replace(/^≈\s*/, '').replace(/^\+/, ''));
  if (aproximado) assert.ok(Math.abs(valor - esperado) <= 0.00050001 + Math.abs(esperado) * 3e-10, `Redondeo visible ${texto}; esperado ${esperado}`);
  else cerca(valor, esperado, 'Cantidad declarada exacta ' + texto);
  if (fisicaAproximada) assert.ok(aproximado, 'La aproximación del péndulo debe declararse: ' + texto);
  return valor;
}
function cantidadesEnTexto(texto) {
  const s = normal(texto), matches = s.match(/[+-]?(?:\d+(?:\.\d+)?(?:e[+-]?\d+)?\*?)?π(?:\/\d+)?|[+-]?\d+(?:\.\d+)?(?:e[+-]?\d+)?/g) || [];
  return matches.map(expresion);
}
function visibles(d, p) {
  const previos = plano(p.enunciado) + ' ' + plano(p.pregunta) + ' ' + p.datos.join(' '), ns = cantidadesEnTexto(previos);
  const porColor = {};
  for (const nodo of [...p.enunciado, ...p.pregunta]) if (nodo && typeof nodo === 'object' && nodo.v) {
    (porColor[nodo.v] ||= []).push(...cantidadesEnTexto(nodo.t));
    assert.doesNotMatch(nodo.t, /\d\.\d/, 'Coma decimal en el texto publicado');
  }
  const claves = { izquierdoCm: 'x', derechoCm: 'x', primerInstante: 't', ultimoInstante: 't', llegadas: 'N', ACm: 'A', T: 'T', t: 't',
    k: 'k', m: 'm', xCm: 'x', xPrimeroCm: 'x', xSegundoCm: 'x', fuerzaPrimera: 'F', aceleracionSegunda: 'a',
    rigidezPrimero: 'k', rigidezSegundo: 'k', ciclos: 'N', duracion: 't', v: 'v', longitudCm: 'L', longitudNaturalCm: 'L',
    longitudEquilibrioCm: 'L', longitudPrimeraCm: 'L', longitudSegundaCm: 'L', gravedadPrimera: 'g', gravedadSegunda: 'g' };
  const ignorar = new Set(['nivel', 'fasePiNumerador', 'fasePiDenominador']);
  for (const [k, valor] of Object.entries(d)) {
    if (typeof valor !== 'number' || ignorar.has(k)) continue;
    assert.ok(ns.some(n => Math.abs(n - valor) <= 1e-8 * Math.max(1, Math.abs(valor))), `Entrada ${k}=${valor} oculta o redondeada: ${previos}`);
    if (claves[k]) assert.ok((porColor[claves[k]] || []).some(n => Math.abs(n - valor) <= 1e-8 * Math.max(1, Math.abs(valor))), `Entrada ${k} no coincide con el valor y variable publicados`);
  }
  if (d.fasePiNumerador != null) {
    const phi = (TAU / 2) * d.fasePiNumerador / d.fasePiDenominador;
    assert.ok(ns.some(n => Math.abs(n - phi) < 1e-8), 'Fase inicial visible completa');
  }
  for (const dato of p.datos) {
    assert.ok(typeof dato === 'string');
    assert.ok(dato.split(/\s+/).length <= 22, 'Datos excede 22 palabras: ' + dato);
    // Se permiten equivalencias numéricas y valores trigonométricos; no recetas.
    assert.doesNotMatch(dato, /(?:F|a|T|f|ω|φ|E|k|m|g|L|A|v)\s*[=≈]\s*(?:[-−]?\s*[A-Za-zωφπ√]|\d*(?:[,.]\d+)?π)/, 'Fórmula que delata el camino en Datos: ' + dato);
    assert.doesNotMatch(dato, /(?:divide|multiplica|despeja|reemplaza|sustituye|calcula|usa la fórmula)/i);
  }
}

function textoEstado(clave) {
  const m = clave.match(/^x=(-?\d+(?:\.\d+)?);sentido=(izquierda|derecha|reposo)$/);
  assert.ok(m, 'Clave física: ' + clave);
  return 'x = ' + numero(Number(m[1])) + ' cm; ' + (m[2] === 'reposo' ? 'reposo instantáneo' : 'hacia la ' + m[2]);
}
function formato(valor, unidad, d) {
  if (typeof valor === 'string') return textoEstado(valor);
  const fisica = d.tipo.startsWith('pendulo-');
  const conPi = ['resorte-periodo', 'resorte-vertical', 'resortes-conectados'].includes(d.tipo) ? piExacto(valor, 100) : null;
  const texto = conPi || numero(valor), representado = expresion(texto);
  const aprox = fisica || Math.abs(representado - valor) > 1e-9 * Math.max(1, Math.abs(valor));
  return (aprox ? '≈ ' : '') + texto + (unidad ? ' ' + unidad : '');
}
const metricas = { problemas: 0, alternativas: 0, igualdades: 0, entradas: 0 };
function ambiente(d, r, indice) {
  const e = {};
  for (const key of ['k', 'm', 'g', 'T', 't', 'v']) if (d[key] != null) e[key] = d[key];
  if (d.ACm != null) e.A = d.ACm / 100;
  if (d.xCm != null) e.x = d.xCm / 100;
  switch (d.tipo) {
    case 'extremos-amplitud': Object.assign(e, { A: r.valor, x: d.izquierdoCm }); break;
    case 'conteo-periodo': Object.assign(e, { N: d.llegadas - 1, duración: d.ultimoInstante - d.primerInstante,
      T: (d.ultimoInstante - d.primerInstante) / (d.llegadas - 1), f: (d.llegadas - 1) / (d.ultimoInstante - d.primerInstante) }); break;
    case 'recorrido-mixto': Object.assign(e, { d: r.valor, N: Math.floor(d.t / d.T) }); break;
    case 'fuerza-posicion': e.F = r.valor; break;
    case 'aceleracion-masa': Object.assign(e, { F: r.intermedios.F, a: r.valor }); break;
    case 'masa-dos-estados': Object.assign(e, { k: r.intermedios.k, m: r.valor,
      F: indice === 0 ? d.fuerzaPrimera : r.intermedios.fuerzaSegunda,
      x: (indice === 0 ? d.xPrimeroCm : d.xSegundoCm) / 100, a: d.aceleracionSegunda }); break;
    case 'estado-cuartos': Object.assign(e, { q: 4 * d.t / d.T, cuartos: 4 * d.t / d.T }); break;
    case 'velocidad-fase': Object.assign(e, { ω: r.intermedios.omega, φ: (TAU / 2) * d.fasePiNumerador / d.fasePiDenominador,
      fase: r.intermedios.fase, v: r.valor }); break;
    case 'primer-paso': {
      const inicial = d.inicio === 'izquierda' ? TAU / 2 : 0;
      Object.assign(e, { ω: TAU / d.T, fase: inicial + r.intermedios.fase, faseInicial: inicial,
        faseFinal: inicial + r.intermedios.fase, avance: r.intermedios.fase, t: r.valor }); break;
    }
    case 'resorte-periodo': e.T = r.valor; break;
    case 'resorte-vertical': Object.assign(e, { δ: r.intermedios.delta, alargamiento: r.intermedios.delta, k: r.intermedios.k, T: r.valor }); break;
    case 'resortes-conectados': Object.assign(e, { k: r.intermedios.k, rigidezEquivalente: r.intermedios.k, T: r.valor }); break;
    case 'pendulo-periodo': Object.assign(e, { L: d.longitudCm / 100, T: r.valor }); break;
    case 'pendulo-razon': Object.assign(e, { razon: r.valor, periodoPrimero: periodoPendulo(d.longitudPrimeraCm / 100, d.gravedadPrimera),
      periodoSegundo: periodoPendulo(d.longitudSegundaCm / 100, d.gravedadSegunda) }); break;
    case 'pendulo-longitud': Object.assign(e, { L: r.valor, T: d.duracion / d.ciclos, N: d.ciclos, t: d.duracion }); break;
    case 'energia-total': e.EM = r.valor; break;
    case 'rapidez-posicion': Object.assign(e, { EM: r.intermedios.mecanica, EE: r.intermedios.elastica, EC: r.intermedios.cinetica, v: r.valor, rapidez: r.valor }); break;
    case 'amplitud-desde-estado': Object.assign(e, { EM: r.intermedios.mecanica, EE: r.intermedios.elastica, EC: r.intermedios.cinetica, A: indice === 3 ? r.valor : r.valor / 100 }); break;
  }
  return e;
}
function quitarUnidades(s) {
  return s.replace(/([\dπ)])\s+(?:m\/s\^\(2\)|rad\/s|N\/m|m\/s|kg|cm|rad|Hz|J|N|s|m)(?![\p{L}\d])/gu, '$1');
}
function ecuaciones(p, r) {
  const d = p._datos;
  let total = 0;
  for (let i = 0; i < p.solucion.length; i++) {
    const linea = plano(p.solucion[i]);
    if (d.tipo === 'estado-cuartos' && linea.includes('x = ')) {
      assert.ok(linea.includes(textoEstado(r.valor)), 'Estado final explicado');
      continue;
    }
    if (d.tipo === 'velocidad-fase' && /signo (positivo|negativo)/.test(linea)) {
      assert.equal(linea.includes('positivo'), r.valor > 0);
      assert.equal(linea.includes('derecha'), r.valor > 0);
    }
    if (d.tipo === 'pendulo-razon' && /razón (mayor|menor)/.test(linea)) {
      assert.equal(linea.includes('mayor'), r.valor > 1, 'Comparación física de los períodos');
      assert.equal(linea.includes('más'), r.valor > 1, 'Interpretación del tiempo de un ciclo');
    }
    for (const nodo of p.solucion[i]) if (nodo && typeof nodo === 'object') assert.doesNotMatch(nodo.t, /\d\.\d/, 'Coma decimal en la solución');
    for (let cadena of linea.split(';')) {
      if (!/[=≈]/.test(cadena)) continue;
      cadena = normal(cadena).replace(/energía mecánica/gi, 'EM').replace(/energía del resorte/gi, 'EE').replace(/energía cinética/gi, 'EC');
      cadena = cadena.replace(/fase inicial/g, 'faseInicial').replace(/fase final/g, 'faseFinal').replace(/rigidez equivalente/g, 'rigidezEquivalente');
      cadena = cadena.replace(/período primero/g, 'periodoPrimero').replace(/período segundo/g, 'periodoSegundo');
      if (cadena.includes(':')) cadena = cadena.slice(cadena.lastIndexOf(':') + 1);
      cadena = quitarUnidades(cadena).trim().replace(/\.$/, '');
      const partes = cadena.split(/\s*([=≈])\s*/), env = ambiente(d, r, i);
      let izquierda = expresion(partes[0], env);
      for (let j = 1; j < partes.length; j += 2) {
        const derecha = expresion(partes[j + 1], env);
        if (partes[j] === '≈') assert.ok(Math.abs(izquierda - derecha) <= 0.0005001 + Math.abs(izquierda) * 3e-8, 'Aproximación visible: ' + cadena);
        else cerca(izquierda, derecha, 'Igualdad visible: ' + cadena);
        izquierda = derecha; total++;
      }
    }
  }
  for (const dato of p.datos) if (/\b(sen|cos)\(/.test(dato)) for (const cadena of normal(dato).replace(/\.$/, '').split(';')) {
    const partes = cadena.split(/\s*([=≈])\s*/); assert.equal(partes.length, 3);
    const iz = expresion(partes[0]), de = expresion(partes[2]);
    if (partes[1] === '=') cerca(iz, de, 'Dato trigonométrico: ' + cadena);
    else assert.ok(Math.abs(iz - de) <= 0.0005001);
    total++;
  }
  assert.ok(total > 0, 'La solución debe mostrar una cuenta verificable');
  metricas.igualdades += total;
  return total;
}
function validar(p) {
  const d = p._datos, r = resolver(d), errs = errores(d, r);
  assert.ok(d && !Object.hasOwn(d, 'valor') && !Object.hasOwn(d, 'respuesta'), 'Solo datos conocidos en _datos');
  for (const key of ['m', 'k', 'g', 'T', 'ACm', 'longitudCm', 'longitudPrimeraCm', 'longitudSegundaCm',
    'longitudNaturalCm', 'longitudEquilibrioCm', 'rigidezPrimero', 'rigidezSegundo', 'gravedadPrimera', 'gravedadSegunda']) {
    if (d[key] != null) assert.ok(d[key] > 0, 'Condición física: ' + key + ' positivo');
  }
  if (d.anguloGrados != null) assert.ok(d.anguloGrados >= 5 && d.anguloGrados <= 10, 'Régimen de ángulo pequeño declarado');
  if (d.tipo === 'extremos-amplitud') assert.ok(d.izquierdoCm < 0 && d.derechoCm > 0);
  if (d.tipo === 'conteo-periodo') assert.ok(d.ultimoInstante > d.primerInstante);
  if (d.tipo === 'masa-dos-estados') assert.ok(d.fuerzaPrimera * d.xPrimeroCm < 0 && d.aceleracionSegunda * d.xSegundoCm < 0);
  if (d.tipo === 'amplitud-desde-estado') assert.ok(r.valor > Math.abs(d.xCm));
  for (const [key, value] of Object.entries(d)) {
    if (typeof value !== 'number') continue;
    assert.ok(Number.isFinite(value));
    cerca(value * 1000, Math.round(value * 1000), 'Entrada exacta hasta tres decimales ' + key);
    metricas.entradas++;
  }
  assert.equal(p.respuesta.unidad, r.unidad);
  if (typeof r.valor === 'string') assert.equal(p.respuesta.valor, r.valor);
  else cerca(p.respuesta.valor, r.valor, d.tipo + ': respuesta física');
  visibles(d, p);
  const candidatas = [r.valor, ...Object.values(errs)];
  assert.equal(new Set(candidatas.map(x => formato(x, r.unidad, d))).size, 4, 'Unicidad visible de todas las operaciones');
  assert.equal(p.alternativas.length, 4);
  assert.equal(p.alternativas.filter(a => a.correcta).length, 1);
  for (const alternativa of p.alternativas) {
    let esperado;
    if (alternativa.correcta) esperado = r.valor;
    else {
      const prefijo = 'OSP-' + d.tipo.toUpperCase() + '-';
      assert.ok(alternativa.error.id.startsWith(prefijo), alternativa.error.id);
      const op = alternativa.error.id.slice(prefijo.length);
      assert.ok(Object.hasOwn(errs, op), 'Operación no documentada: ' + op);
      esperado = errs[op];
      assert.equal(alternativa.error.respaldo, 'hipotesis');
      assert.equal(alternativa.error.fuente, 'docs/etapa11/errores-fisica.md');
      assert.ok(alternativa.error.explicacion.includes(formato(esperado, r.unidad, d)), 'La explicación no conserva su cifra/unidad: ' + alternativa.error.explicacion);
      if (typeof esperado === 'number') {
        const razon = Math.abs(esperado / r.valor);
        assert.ok(razon >= 0.05 - 1e-10 && razon <= 20 + 1e-10, 'Opciones comparables en escala: ' + alternativa.error.id);
      }
    }
    if (typeof esperado === 'string') assert.equal(alternativa.valor, esperado);
    else cerca(alternativa.valor, esperado, alternativa.error?.id || 'Correcta');
    assert.equal(alternativa.texto, formato(esperado, r.unidad, d), 'Formato calculado independientemente');
    const aciertos = candidatas.filter(c => typeof c === 'string' ? c === alternativa.valor : Math.abs(c - alternativa.valor) <= 1e-8 * Math.max(1, Math.abs(c)));
    assert.equal(aciertos.length, 1, 'Cada alternativa responde a una sola operación física');
    if (typeof esperado !== 'string') cantidadVisible(alternativa.texto, esperado, r.unidad, { fisicaAproximada: d.tipo.startsWith('pendulo-') });
    metricas.alternativas++;
  }
  assert.ok(p._verificacion && Array.isArray(p._verificacion.errores));
  assert.equal(p._verificacion.errores.length, 3);
  for (const e of p._verificacion.errores) {
    const op = e.id.slice(('OSP-' + d.tipo.toUpperCase() + '-').length);
    assert.ok(Object.hasOwn(errs, op));
    assert.equal(e.operacion, op);
    if (typeof errs[op] === 'string') assert.equal(e.valor, errs[op]);
    else cerca(e.valor, errs[op], 'Traza independiente ' + e.id);
  }
  ecuaciones(p, r);
  metricas.problemas++;
  return r;
}

module.exports = { TIPOS, TAU, resolver, errores, plano, cerca, estado, estadoCuarto, areaResorte, fuerza, periodoRigidez, periodoPendulo, raiz, evento,
  normal, expresion, numero, piExacto, cantidadVisible, cantidadesEnTexto, visibles, formato, textoEstado, validar, metricas, ecuaciones };

if (!process.env.OSC_ORACLE_SOLO_EXPORTAR) {
  const gen = require('./generador.js');
  test('el integrador converge y los balances tienen calibraciones independientes', () => {
    const tauGrueso = 4 * primerCruce(1, 0, -1, 0.004);
    cerca(TAU, 2 * Math.PI, 'Período de referencia u doble prima = -u', 1e-11);
    assert.ok(Math.abs(TAU - 2 * Math.PI) < Math.abs(tauGrueso - 2 * Math.PI));
    cerca(fuerza(20, 0.06), -1.2, 'Pendiente del potencial');
    cerca(areaResorte(40, 0.03, 0.05), 0.032, 'Área de un trapecio');
    cerca(evento(1, 0.5, -1) / TAU, 1 / 6, 'Primer evento');
    cerca(evento(1, 0.5, 1) / TAU, 5 / 6, 'Segundo sentido');
    cerca(periodoRigidez(0.25, 25), Math.PI / 5, 'Escala temporal');
    cerca(resolver({ tipo: 'pendulo-longitud', ciclos: 10, duracion: 20, g: 10 }).valor, 10 / Math.PI ** 2, 'Longitud inversa por eventos');
  });
  for (const tipo of TIPOS) test(`${tipo}: 400 semillas, datos visibles, respuesta y todos los errores`, () => {
    const variantes = new Set(), letras = new Set();
    for (let semilla = 0; semilla < 400; semilla++) {
      const p = gen.generar(semilla, { tipo });
      try { validar(p); }
      catch (error) { error.message = `${tipo}, semilla ${semilla}: ${error.message}`; throw error; }
      letras.add(p.alternativas.find(a => a.correcta).letra);
      if (tipo === 'conteo-periodo') variantes.add(p._datos.pide);
      if (tipo === 'resortes-conectados') variantes.add(p._datos.conexion);
      if (tipo === 'estado-cuartos') variantes.add(p.respuesta.valor.replace(/x=[^;]+;/, 'x=' + (Number(p.respuesta.valor.match(/x=([^;]+)/)[1]) === 0 ? 0 : Math.sign(Number(p.respuesta.valor.match(/x=([^;]+)/)[1]))) + ';'));
      if (tipo === 'primer-paso') variantes.add(p._datos.inicio + '/' + p._datos.sentido + '/' + Math.sign(p._datos.xCm));
    }
    assert.equal(letras.size, 4, 'La correcta cubre todas las letras');
    if (tipo === 'conteo-periodo' || tipo === 'resortes-conectados') assert.equal(variantes.size, 2);
    if (tipo === 'estado-cuartos') assert.equal(variantes.size, 4);
    if (tipo === 'primer-paso') assert.equal(variantes.size, 8);
  });
  test('veinte referencias se recalculan desde entradas completas', () => {
    const archivo = JSON.parse(fs.readFileSync(path.join(__dirname, 'casos.json'), 'utf8'));
    assert.equal(archivo.plantilla, 'fis-oscilaciones'); assert.equal(archivo.casos.length, 20);
    assert.equal(new Set(archivo.casos.map(c => c.opciones.tipo)).size, 18);
    for (const caso of archivo.casos) {
      const p = gen.generar(caso.semilla, caso.opciones), r = validar(p);
      assert.deepEqual(p._datos, caso.entrada);
      if (typeof r.valor === 'string') assert.equal(caso.esperado.respuesta, r.valor);
      else cerca(caso.esperado.respuesta, r.valor, 'Caso de referencia independiente');
      assert.equal(caso.esperado.unidad, r.unidad);
      assert.equal(caso.esperado.texto, formato(r.valor, r.unidad, p._datos));
    }
  });
  test('ocho problemas de papel conservan datos, cifras, unidades y pasos verificados', () => {
    const papel = JSON.parse(fs.readFileSync(path.join(__dirname, 'papel.json'), 'utf8'));
    assert.equal(papel.problemas.length, 8);
    assert.deepEqual(papel, require('../../herramientas/papel-generador.js').armar('fis-oscilaciones'));
    const tipos = ['conteo-periodo', 'aceleracion-masa', 'estado-cuartos', 'resorte-vertical', 'pendulo-longitud', 'rapidez-posicion', 'resortes-conectados', 'amplitud-desde-estado'];
    for (let i = 0; i < 8; i++) {
      const p = gen.generar('papel-' + (i + 1)), r = validar(p), escrito = papel.problemas[i];
      assert.equal(p._datos.tipo, tipos[i]);
      assert.ok(escrito.enunciado.includes(plano(p.enunciado)));
      assert.ok(escrito.enunciado.includes(plano(p.pregunta)));
      for (const dato of p.datos) assert.ok(escrito.enunciado.includes(dato));
      const correcta = p.alternativas.find(a => a.correcta);
      assert.equal(escrito.respuesta, correcta.letra + ') ' + formato(r.valor, r.unidad, p._datos));
      assert.deepEqual(escrito.pasos, p.solucion.map(plano));
    }
  });
  test('el oráculo rechaza resultados alterados y entradas publicadas con otra precisión', () => {
    const p = gen.generar(71, { tipo: 'masa-dos-estados' });
    const cambiado = structuredClone(p); cambiado.respuesta.valor *= 1.01;
    assert.throws(() => validar(cambiado), /respuesta física/);
    const entrada = structuredClone(p); entrada._datos.xPrimeroCm += 0.0001;
    assert.throws(() => validar(entrada), /Entrada exacta hasta tres decimales/);
    const opciones = structuredClone(p); opciones.alternativas.find(a => !a.correcta).valor *= 1.01;
    assert.throws(() => validar(opciones), /OSP-/);
  });
}
