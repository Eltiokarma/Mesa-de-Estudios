'use strict';

// Oráculo independiente de órbitas circulares. Solo lee entradas y contenido visible;
// no importa el motor ni las funciones de cálculo de producción.
// Antes del ensamblado: GR_ORBITAS_MODULE=<wrapper completo fuera del repositorio>.
const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const cargado = require(process.env.GR_ORBITAS_MODULE ? path.resolve(process.env.GR_ORBITAS_MODULE) : './gravitacion.js');
const idea = cargado.ideas ? cargado.ideas.find(i => i.id === 'orbita-circular') : (cargado.idea || cargado);

const PI = 16 * Math.atan(1 / 5) - 4 * Math.atan(1 / 239);
function cerca(actual, esperado, contexto = '', relativa = 2e-10) {
  assert.ok(Number.isFinite(actual) && Number.isFinite(esperado), contexto + ': valor no finito');
  assert.ok(Math.abs(actual - esperado) <= relativa * Math.max(1e-25, Math.abs(esperado)), `${contexto}: ${actual}; independiente ${esperado}`);
}
function ceroCreciente(f, minimo = 0, maximo = 1) {
  assert.ok(f(minimo) <= 0, 'No se encerró la raíz por debajo');
  while (f(maximo) < 0) { maximo *= 2; assert.ok(Number.isFinite(maximo)); }
  for (let k = 0; k < 120; k++) { const medio = (minimo + maximo) / 2; if (f(medio) < 0) minimo = medio; else maximo = medio; }
  return (minimo + maximo) / 2;
}
function circular(mu, r, m = 1) {
  assert.ok(mu > 0 && r > 0 && m > 0);
  // Aceleración gravitatoria y aceleración que curva la trayectoria deben coincidir.
  const a = mu / r / r, v = ceroCreciente(x => x * x / r - a);
  const longitud = 2 * PI * r, T = longitud / v;
  const EC = m * v * v / 2;
  // Al integrar el trabajo desde infinito con u=1/r, la fuerza por dr es constante en u.
  const EPG = -mu * m * (1 / r - 0), E = EC + EPG;
  return { a, v, T, EC, EPG, E };
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
  if (x.frac) return '((' + plano(x.frac[0]) + ')/(' + plano(x.frac[1]) + '))';
  return ['texto', 'ecuacion', 'respuesta', 'enunciado', 'pregunta'].filter(k => x[k] != null).map(k => plano(x[k])).join(' ');
}
function normal(x) {
  const superDigitos = { '⁻': '-', '⁺': '+', '⁰': '0', '¹': '1', '²': '2', '³': '3', '⁴': '4', '⁵': '5', '⁶': '6', '⁷': '7', '⁸': '8', '⁹': '9' };
  return plano(x).replace(/[−–]/g, '-').replace(/(\d)[ \u00a0\u202f](?=\d{3}(?:\D|$))/g, '$1')
    .replace(/,/g, '.').replace(/[⁻⁺⁰¹²³⁴⁵⁶⁷⁸⁹]+/g, s => '^(' + [...s].map(c => superDigitos[c]).join('') + ')');
}
// Analizador propio de aritmética visible, incluidos π y raíces. No usa eval.
function expresion(texto) {
  const s = texto.replace(/\s/g, '').replace(/[·×]/g, '*').replace(/÷/g, '/')
    .replace(/([\d)])(?=[π√])/g, '$1*').replace(/π(?=[\d(])/g, 'π*');
  const ts = s.match(/\d+(?:\.\d+)?(?:e[+-]?\d+)?|[()+\-*/^√π]/gi) || [];
  assert.equal(ts.join(''), s, 'Expresión no numérica: ' + texto); let i = 0;
  function atomo() {
    if (ts[i] === '(') { i++; const a = sumar(); assert.equal(ts[i++], ')', texto); return a; }
    if (ts[i] === 'π') { i++; return PI; }
    if (ts[i] === '√') { i++; const a = atomo(); assert.ok(a >= 0); return a ? ceroCreciente(x => x * x - a) : 0; }
    const a = ts[i++]; assert.match(a || '', /^\d+(?:\.\d+)?(?:e[+-]?\d+)?$/i, texto); return Number(a);
  }
  function potencia() { const a = atomo(); if (ts[i] !== '^') return a; i++; return a ** unario(); }
  function unario() { if (ts[i] === '+') { i++; return unario(); } if (ts[i] === '-') { i++; return -unario(); } return potencia(); }
  function multiplicar() { let a = unario(); while (ts[i] === '*' || ts[i] === '/') { const op = ts[i++], b = unario(); if (op === '/') assert.notEqual(b, 0); a = op === '*' ? a * b : a / b; } return a; }
  function sumar() { let a = multiplicar(); while (ts[i] === '+' || ts[i] === '-') { const op = ts[i++], b = multiplicar(); a = op === '+' ? a + b : a - b; } return a; }
  const a = sumar(); assert.equal(i, ts.length, 'Expresión incompleta: ' + texto); return a;
}

test('Órbitas: calibración del balance centrípeto, período y energías con una sola GM', () => {
  cerca(PI, Math.PI, 'π independiente');
  const a = circular(4e14, 16e6, 400);
  cerca(a.a, 1.5625); cerca(a.v, 5000); cerca(a.T, 6400 * PI);
  cerca(a.EC, 5e9); cerca(a.EPG, -1e10); cerca(a.E, -5e9);
  const b = circular(4e14, 64e6, 400);
  cerca(b.v, a.v / 2); cerca(b.T, a.T * 8); cerca(b.E, a.E / 4);
  cerca(expresion('√((4×10^(14))/(16×10^(6)))'), 5000);
  cerca(expresion('6400π'), a.T);
  assert.throws(() => cerca(a.v * a.T, 4 * PI * 16e6), /independiente/);
  assert.throws(() => cerca(6000 * 6000 / 16e6, a.a), /independiente/);
});

const TIPOS = ['rapidez', 'periodo', 'radio', 'masa-satelite', 'energia', 'rapidez-altura', 'periodo-altura',
  'masa-planeta', 'altura', 'rapidez-superficie', 'periodo-desde-otra', 'cambios', 'energia-desde-periodo',
  'periodo-desde-energia', 'altura-desde-periodo'];
function calcular(c) {
  let valor, unidad, pasos, mu, r, orbita;
  const radioConRapidez = (mu, v) => ceroCreciente(x => v * v * x - mu);
  const vuelta = (r, v) => 2 * PI * r / v;
  const directo = (mu0, r0, m0 = c.m || 1) => { mu = mu0; r = r0; orbita = circular(mu, r, m0); return orbita; };
  switch (c.tipo) {
    case 'rapidez': valor = directo(c.GM, c.r).v / 1000; unidad = 'km/s'; break;
    case 'periodo': directo(c.v * c.v * c.r, c.r); valor = vuelta(c.r, c.v) / 60; unidad = 'min'; break;
    case 'radio': r = radioConRapidez(c.GM, c.v); directo(c.GM, r); valor = r / 1000; unidad = 'km'; break;
    case 'masa-satelite': valor = c.v / 1000; unidad = 'km/s'; break;
    case 'energia': valor = directo(c.GM, c.r).E / 1e6; unidad = 'MJ'; break;
    case 'rapidez-altura': valor = directo(c.GM, c.R + c.h).v / 1000; unidad = 'km/s'; pasos = [[r / 1000, 'km']]; break;
    case 'periodo-altura': valor = directo(c.GM, c.R + c.h).T / 3600; unidad = 'h'; pasos = [[r / 1000, 'km'], [orbita.v / 1000, 'km/s']]; break;
    case 'masa-planeta': {
      const vel = vuelta(c.r, c.T); // numéricamente 2πr/T: longitud por tiempo.
      const a = vel * vel / c.r;
      valor = ceroCreciente(masa => c.G * masa / c.r / c.r - a); unidad = 'kg';
      directo(c.G * valor, c.r); pasos = [[vel, 'm/s']]; break;
    }
    case 'altura': r = radioConRapidez(c.GM, c.v); directo(c.GM, r); valor = (r - c.R) / 1000; unidad = 'km'; pasos = [[r / 1000, 'km']]; break;
    case 'rapidez-superficie': valor = directo(c.g0 * c.R * c.R, c.R + c.h).v / 1000; unidad = 'km/s'; pasos = [[r / 1000, 'km'], [mu, 'm³/s²']]; break;
    case 'periodo-desde-otra': valor = directo(c.v1 * c.v1 * c.r1, c.r2).T / 60; unidad = 'min'; pasos = [[mu, 'm³/s²'], [orbita.v / 1000, 'km/s']]; break;
    case 'cambios': valor = circular(c.v1 * c.v1 * c.kM, c.kr).v / 1000; unidad = 'km/s'; pasos = [[c.kM / c.kr, '']]; break;
    case 'energia-desde-periodo': {
      assert.ok(c.r2 > 0);
      const vel = vuelta(c.r, c.T); valor = directo(vel * vel * c.r, c.r2).E / 1e6; unidad = 'MJ';
      pasos = [[vel, 'm/s'], [mu, 'm³/s²']]; break;
    }
    case 'periodo-desde-energia': {
      assert.ok(c.energia < 0); const vel = ceroCreciente(x => c.m * x * x / 2 + c.energia);
      r = radioConRapidez(c.GM, vel); valor = directo(c.GM, r).T / 60; unidad = 'min';
      pasos = [[r / 1000, 'km'], [vel, 'm/s']]; break;
    }
    case 'altura-desde-periodo': {
      const vel1 = vuelta(c.r1, c.T1); r = radioConRapidez(vel1 * vel1 * c.r1, c.v2);
      directo(vel1 * vel1 * c.r1, r); valor = (r - c.R) / 1000; unidad = 'km';
      pasos = [[vel1, 'm/s'], [r / 1000, 'km']]; break;
    }
    default: throw new Error('Tipo orbital sin oráculo: ' + c.tipo);
  }
  return { valor, unidad, pasos: [...(pasos || []), [valor, unidad]], mu, r, orbita };
}
function erroresEsperados(c) {
  const o = calcular(c), z = o.valor;
  const s = x => ceroCreciente(a => a * a - x), per = (mu, r) => circular(mu, r).T;
  switch (c.tipo) {
    case 'rapidez': return { 'sin-raiz': c.GM / c.r / 1000, 'radio-doble': circular(c.GM, 2 * c.r).v / 1000, 'sin-conversion': z * 1000, 'raiz-mitad': z / 2 };
    case 'periodo': return { 'sin-dos': z / 2, 'sin-pi': 2 * c.r / c.v / 60, 'sin-minutos': z * 60, 'radio-como-camino': c.r / c.v / 60 };
    case 'radio': return { 'sin-cuadrado': c.GM / c.v / 1000, diametro: z * 2, 'sin-conversion': z * 1000, mitad: z / 2 };
    case 'masa-satelite': return { 'masa-lineal': z * c.km, 'masa-raiz': z * s(c.km), 'masa-inversa': z / c.km, 'masa-raiz-inversa': z / s(c.km) };
    case 'energia': return { 'solo-potencial': o.orbita.EPG / 1e6, 'solo-cinetica': o.orbita.EC / 1e6, 'sin-masa': z / c.m, 'sin-megajoules': z * 1e6 };
    case 'rapidez-altura': case 'rapidez-superficie': return { 'altura-como-radio': circular(o.mu, c.h).v / 1000, superficie: circular(o.mu, c.R).v / 1000, 'sin-conversion': z * 1000, 'radio-doble': circular(o.mu, 2 * o.r).v / 1000 };
    case 'periodo-altura': return { 'altura-como-radio': per(o.mu, c.h) / 3600, 'sin-horas': z * 3600, 'sin-dos': z / 2, 'sin-pi': z / PI };
    case 'masa-planeta': return { 'sin-dos-periodo': z / 4, 'sin-pi-periodo': z / (PI * PI), 'sin-G': o.mu, 'masa-doble': z * 2 };
    case 'altura': return { 'sin-restar-R': o.r / 1000, 'sumar-R': (o.r + c.R) / 1000, signo: -z, 'sin-conversion': z * 1000 };
    case 'periodo-desde-otra': return { 'rapidez-igual': 2 * PI * c.r2 / c.v1 / 60, 'radio-inicial': 2 * PI * c.r1 / c.v1 / 60, 'sin-minutos': z * 60, 'sin-dos': z / 2 };
    case 'cambios': return { 'sin-raiz': c.v1 / 1000 * c.kM / c.kr, 'incluye-satelite': z * s(c.km), 'radio-directo': c.v1 / 1000 * s(c.kM * c.kr), 'solo-masa': c.v1 / 1000 * s(c.kM), inversa: c.v1 / 1000 / s(c.kM / c.kr) };
    case 'energia-desde-periodo': return { 'solo-cinetica': o.orbita.EC / 1e6, 'solo-potencial': o.orbita.EPG / 1e6, 'media-vuelta': z / 4, 'sin-megajoules': z * 1e6 };
    case 'periodo-desde-energia': return { 'energia-potencial': per(c.GM, 2 * o.r) / 60, 'sin-minutos': z * 60, 'sin-dos': z / 2, 'sin-pi': z / PI };
    case 'altura-desde-periodo': return { 'sin-restar-R': o.r / 1000, 'sumar-R': (o.r + c.R) / 1000, 'sin-conversion': z * 1000, 'rapidez-lineal': (c.r1 * 2 * PI * c.r1 / c.T1 / c.v2 - c.R) / 1000 };
    default: throw new Error('Errores sin oráculo: ' + c.tipo);
  }
}

function sinUnidades(x) {
  return normal(x).replace(/(?:km\/s|m\^\(3\)\/s\^\(2\)|m\^\(2\)\/s\^\(2\)|m\/s\^\(2\)|m\/s|N·m\^\(2\)\/kg\^\(2\)|N\/kg)/g, '')
    .replace(/_[A-Za-z0-9]+/g, '_');
}
function literales(x) {
  return sinUnidades(x).match(/[+-]?\d+(?:\.\d+)?(?:e[+-]?\d+|\s*[·×*]\s*\(?10\)?\s*\^\s*\(?[+-]?\d+\)?)?(?:\s*π)?/gi) || [];
}
const valores = x => literales(x).map(expresion);
function comprobarVisible(texto, esperado, unidad = '', exigeAprox = false) {
  const s = plano(texto), xs = literales(texto), ultimo = xs.at(-1); assert.ok(ultimo, 'Falta cantidad: ' + s);
  const n = expresion(ultimo), diferencia = Math.abs(n - esperado);
  if (unidad) assert.ok(s.includes(unidad), 'Falta unidad ' + unidad + ': ' + s);
  if (exigeAprox) assert.match(s, /≈/, 'Dato aproximado presentado como exacto: ' + s);
  if (diferencia <= 2e-10 * Math.max(1e-25, Math.abs(esperado))) return n;
  assert.match(s, /≈/, 'Redondeo escrito como exacto: ' + s);
  const dec = (ultimo.match(/^[+-]?\d+(?:\.(\d+))?/) || [])[1] || '';
  const potencia = ultimo.match(/(?:e|\^\s*\(?)([+-]?\d+)/i), paso = 10 ** (Number(potencia ? potencia[1] : 0) - dec.length) * (ultimo.includes('π') ? PI : 1);
  assert.ok(diferencia <= paso * 0.500001 + 1e-12 * Math.abs(esperado), `Aproximación fuera de precisión: ${s}; esperado ${esperado}`);
  return n;
}
function coincide(texto, esperado, unidad) { try { comprobarVisible(texto, esperado, unidad); return true; } catch { return false; } }
function igualdades(x) {
  const t = normal(x), arit = c => c != null && /[\d.\s()+\-·×*/÷^√π]/.test(c);
  for (let k = 0; k < t.length; k++) if (t[k] === '=' || t[k] === '≈') {
    let a = k, b = k + 1; while (a > 0 && arit(t[a - 1])) a--; while (b < t.length && arit(t[b])) b++;
    const iz = t.slice(a, k).trim().replace(/^\.\s+/, ''), de = t.slice(k + 1, b).trim().replace(/\.$/, '');
    const inicio = a + (t.slice(a, k).match(/^\s*/) || [''])[0].length;
    if (inicio > 0 && /[\p{L}_]/u.test(t[inicio - 1])) continue;
    if (/^[·×*/÷^]/.test(iz) || /[+\-·×*/÷^]\s*$/.test(iz) || /[+\-·×*/÷^]\s*$/.test(de)) continue;
    if (/\d/.test(iz) && /\d/.test(de)) {
      const izquierda = expresion(iz);
      if (t[k] === '≈' && literales(de).length === 1) comprobarVisible('≈ ' + de, izquierda);
      else cerca(izquierda, expresion(de), 'Igualdad: ' + iz + ' ' + t[k] + ' ' + de);
    }
  }
}
function entradasVisibles(c) {
  switch (c.tipo) {
    case 'rapidez': return [c.r / 1000];
    case 'periodo': return [c.r / 1000, c.v / 1000];
    case 'radio': return [c.v / 1000];
    case 'masa-satelite': return [c.m, c.v / 1000, c.km * c.m];
    case 'energia': return [c.m, c.r / 1000];
    case 'rapidez-altura': case 'periodo-altura': return [c.R / 1000, c.h / 1000];
    case 'rapidez-superficie': return [c.R / 1000, c.g0, c.h / 1000];
    case 'masa-planeta': return [c.r / 1000, c.T];
    case 'altura': return [c.R / 1000, c.v / 1000];
    case 'periodo-desde-otra': return [c.r1 / 1000, c.v1 / 1000, c.r2 / 1000];
    case 'cambios': return [c.v1 / 1000, c.kM, c.kr, c.km];
    case 'energia-desde-periodo': return [c.m, c.r / 1000, c.T, c.r2 / 1000];
    case 'periodo-desde-energia': return [c.m, c.energia / 1e6];
    case 'altura-desde-periodo': return [c.R / 1000, c.r1 / 1000, c.T1, c.v2 / 1000];
  }
}
function sustituir(exp, variables) {
  const numerica = exp.replace(/[A-Za-z][A-Za-z0-9_]*/g, nombre => {
    assert.ok(Object.hasOwn(variables, nombre) && Number.isFinite(variables[nombre]), 'Letra sin entrada: ' + nombre);
    return '(' + variables[nombre] + ')';
  }).replace(/(\d|\))(?=\()/g, '$1*');
  return expresion(numerica);
}
function comprobarCuenta(ecuacion, c, o, indice) {
  const orbitaPrimera = c.tipo === 'energia-desde-periodo' ? circular(o.mu, c.r) : o.orbita;
  const variables = { G: c.G || 1, M: o.mu / (c.G || 1), m: c.m || 1,
    r: c.tipo === 'energia-desde-periodo' ? c.r : o.r, R: c.R,
    r_1: c.r1 || c.r, r_2: c.r2 || o.r,
    v: orbitaPrimera && orbitaPrimera.v,
    v_1: c.v1 || 2 * PI * c.r1 / c.T1, v_2: c.v2 || (o.orbita && o.orbita.v),
    v_inicial: c.v / 1000, v_nueva: c.v / 1000 };
  if (indice === o.pasos.length - 1 && ['altura', 'altura-desde-periodo'].includes(c.tipo)) {
    // En estas restas ambos radios están expresados en los kilómetros del paso anterior.
    variables.r /= 1000; variables.r_2 /= 1000; variables.R /= 1000;
  }
  const miembros = normal(ecuacion).split(/=|≈/);
  assert.ok(miembros.length >= 3, 'Falta la sustitución entre la letra y el resultado');
  for (const cuenta of miembros.slice(1, -1)) cerca(sustituir(cuenta, variables), o.pasos[indice][0], 'Cuenta sustituida: ' + plano(ecuacion));
}
function revisarCaso(caso) {
  const c = caso.verificacion; assert.ok(c && TIPOS.includes(c.tipo)); const o = calcular(c), ctx = c.tipo + '/' + (c.semilla ?? c.titulo);
  const ns = valores(caso.enunciado || caso.pregunta), entradas = entradasVisibles(c);
  assert.equal(ns.length, entradas.length, ctx + ': cifras del enunciado'); ns.forEach((n, i) => cerca(n, entradas[i], ctx + ': entrada ' + i));
  assert.ok(caso.datos.length > 0);
  assert.match(plano(caso.datos), /(?:exterior|fuera)/); assert.match(plano(caso.datos), /sin aire/);
  if (c.GM) { const dato = caso.datos.find(d => /^GM =/.test(plano(d))); assert.ok(dato, ctx + ': falta GM'); comprobarVisible(dato, c.GM, 'm³/s²'); }
  if (c.G) { const dato = caso.datos.find(d => /^G ≈/.test(plano(d))); assert.ok(dato); comprobarVisible(dato, c.G, 'N·m²/kg²', true); }
  if (o.orbita) {
    const a = o.orbita;
    cerca(a.v * a.v * o.r, o.mu, ctx + ': una sola GM'); cerca(a.v * a.T, 2 * PI * o.r, ctx + ': una vuelta');
    cerca(a.E, -a.EC, ctx + ': energía circular'); cerca(a.EPG, -2 * a.EC, ctx + ': referencia infinita');
    if (c.R) assert.ok(o.r > c.R, ctx + ': la órbita atraviesa el planeta');
    if (c.T) cerca(c.tipo === 'energia-desde-periodo' ? circular(o.mu, c.r).T : a.T, c.T, ctx + ': período dado');
    if (c.v && c.tipo !== 'masa-satelite') cerca(a.v, c.v, ctx + ': rapidez dada');
    if (c.energia) cerca(a.E, c.energia, ctx + ': energía dada');
  }
  // Los metadatos son una salida más a comprobar; nunca alimentan las cuentas independientes.
  cerca(c.respuesta.valor, o.valor, ctx + ': metadata respuesta'); assert.equal(c.respuesta.unidad, o.unidad);
  assert.equal(c.intermedios.length, o.pasos.length, ctx + ': cantidad de pasos');
  c.intermedios.forEach((p, i) => { cerca(p.valor, o.pasos[i][0], ctx + ': intermedio ' + i); assert.equal(p.unidad, o.pasos[i][1]); });
  const errores = erroresEsperados(c);
  for (const e of c.errores) { assert.ok(Object.hasOwn(errores, e.id), ctx + ': error desconocido ' + e.id); cerca(e.valor, errores[e.id], ctx + ': error ' + e.id); }
  const sol = caso.pasos || caso.solucion;
  const filas = Array.isArray(sol) ? sol.filter(p => p.ecuacion) : sol && sol.ecuacion ? [sol] : [];
  if (filas.length === o.pasos.length) filas.forEach((p, i) => { comprobarVisible(p.ecuacion, o.pasos[i][0], o.pasos[i][1], !!c.G); comprobarCuenta(p.ecuacion, c, o, i); });
  else { assert.equal(filas.length, 1, ctx + ': solución sin cuenta'); comprobarVisible(filas[0].ecuacion, o.valor, o.unidad, !!c.G); comprobarCuenta(filas[0].ecuacion, c, o, o.pasos.length - 1); }
  for (const p of filas) igualdades(p.ecuacion);
  if (caso.respuesta) comprobarVisible(caso.respuesta, o.valor, o.unidad, !!c.G);
  for (const x of [caso.enunciado, caso.pregunta, caso.datos, caso.solucion, caso.pasos, caso.respuesta]) assert.doesNotMatch(plano(x), /NaN|Infinity|undefined|\[object Object\]/);
  const fig = (caso.figura || caso.dibujo).datos;
  for (const p of fig.paneles) {
    assert.match(fig.alt, /(?:sin escala|no está a escala)/); assert.ok(p.orbita && p.orbita.r > p.planeta.R);
    cerca(Math.hypot(p.satelite.c[0] - p.planeta.c[0], p.satelite.c[1] - p.planeta.c[1]), p.orbita.r);
    for (const n of p.notas || []) {
      if (/^GM =/.test(n.texto)) comprobarVisible(n.texto, c.GM, 'm³/s²');
      if (/^v =/.test(n.texto)) comprobarVisible(n.texto, c.v / 1000, 'km/s');
      if (/^T =/.test(n.texto)) comprobarVisible(n.texto, c.T, 's');
      if (/^m =/.test(n.texto)) comprobarVisible(n.texto, c.m, 'kg');
      if (/^R =/.test(n.texto)) comprobarVisible(n.texto, c.R / 1000, 'km');
      if (/^h =/.test(n.texto)) comprobarVisible(n.texto, c.h / 1000, 'km');
      if (/^r_1 =/.test(n.texto)) comprobarVisible(n.texto, (c.r1 || c.r) / 1000, 'km');
    }
    if (/^r_2/.test(p.cotas[0].texto)) comprobarVisible(p.cotas[0].texto, c.r2 / 1000, 'km');
    else if (/^r_1/.test(p.cotas[0].texto)) comprobarVisible(p.cotas[0].texto, (c.r1 || c.r) / 1000, 'km');
    else if (c.r != null) comprobarVisible(p.cotas[0].texto, c.r / 1000, 'km');
    else assert.match(p.cotas[0].texto, /\?/);
  }
  return { c, o, errores };
}
const firma = c => JSON.stringify(Object.entries(c).filter(([k]) => !['respuesta', 'errores', 'intermedios', 'titulo', 'nivel', 'semilla', 'banco'].includes(k)).sort(([a], [b]) => a.localeCompare(b)));

test('Órbitas: quince ejemplos, cinco por nivel, todas sus cifras y alternativas calculadas aparte', () => {
  assert.ok(idea); assert.equal(idea.ejemplos.length, 15);
  for (const n of [1, 2, 3]) assert.equal(idea.ejemplos.filter(e => e.nivel === n).length, 5);
  const letras = [], tipos = new Set();
  for (const e of idea.ejemplos) {
    const { c, o, errores } = revisarCaso(e); tipos.add(c.tipo);
    if (e.nivel === 3) {
      assert.equal(e.alternativas.length, 5); assert.equal(new Set(e.alternativas.map(plano)).size, 5);
      const buenas = e.alternativas.map((t, i) => coincide(t, o.valor, o.unidad) ? i : -1).filter(i => i >= 0);
      assert.equal(buenas.length, 1, 'Unicidad por fuerza bruta: ' + c.tipo); letras.push(buenas[0]);
      e.alternativas.forEach((t, i) => { if (i !== buenas[0]) assert.ok(Object.values(errores).some(x => coincide(t, x, o.unidad)), 'Distractor sin operación: ' + t); });
    }
  }
  assert.deepEqual([...tipos].sort(), [...TIPOS].sort()); assert.deepEqual(letras.sort(), [0, 1, 2, 3, 4]);
});

test('Órbitas: 400 semillas en Resuelve y otras 400 en Ahora tú, opciones y siFuera independientes', () => {
  const ejemplos = new Set(idea.ejemplos.map(e => firma(e.verificacion))), vistos = { resuelve: new Set(), ahoraTu: new Set() };
  for (const momento of ['resuelve', 'ahoraTu']) {
    const tipos = new Set();
    for (let s = 0; s < 400; s++) {
      const caso = idea[momento].generar(s), { c, o, errores } = revisarCaso(caso);
      tipos.add(c.tipo); vistos[momento].add(firma(c)); assert.ok(!ejemplos.has(firma(c)), 'Repite un ejemplo');
      assert.deepEqual(caso, idea[momento].generar(s));
      if (momento === 'ahoraTu') {
        assert.ok(caso.opciones.length >= 4 && caso.opciones.length <= 5);
        assert.equal(caso.opciones.filter(x => x.correcta).length, 1); assert.equal(new Set(caso.opciones.map(x => plano(x.texto))).size, caso.opciones.length);
        assert.equal(caso.opciones.filter(x => coincide(x.texto, o.valor, o.unidad)).length, 1, 'Unicidad por fuerza bruta: ' + s);
        for (const x of caso.opciones) {
          if (x.correcta) comprobarVisible(x.texto, o.valor, o.unidad, !!c.G);
          else { assert.ok(Object.hasOwn(errores, x.id)); comprobarVisible(x.texto, errores[x.id], o.unidad, !!c.G); assert.match(plano(x.siFuera), /^Bien /); comprobarVisible(x.siFuera, errores[x.id], o.unidad, !!c.G); igualdades(x.siFuera); }
        }
      }
    }
    assert.deepEqual([...tipos].sort(), [...TIPOS].sort()); assert.ok(vistos[momento].size >= 3);
  }
  for (const f of vistos.resuelve) assert.ok(!vistos.ahoraTu.has(f), 'Los dos momentos repiten entradas');
});

test('Órbitas: misión exhaustiva y 400 instantes; solo 5 km/s habilita círculo y reloj físico', () => {
  const j = idea.juega, velocidades = j.controles.find(c => c.id === 'v').opciones.map(o => o.valor), reloj = j.controles.find(c => c.id === 't');
  assert.deepEqual(velocidades, [2, 4, 5, 6]); const fis = circular(4e14, 16e6), ganadoras = new Set();
  function revisar(v, t) {
    const a = { v, t }, correcta = v === 5, fig = j.dibujo(a).datos, p = fig.paneles[0], ac = v * v * 1e6 / 16e6;
    assert.equal(j.mision.logrado(a), correcta); if (correcta) ganadoras.add(v);
    assert.equal(!!p.orbita, correcta); assert.ok(!(p.orbitas || []).length);
    const theta = correcta ? fis.v / 16e6 * t : 0;
    assert.ok(Math.abs(p.satelite.c[0] - 3 * Math.cos(theta)) < 1e-10); assert.ok(Math.abs(p.satelite.c[1] - 3 * Math.sin(theta)) < 1e-10);
    assert.equal(p.flechas.length, 1); const f = p.flechas[0]; assert.equal(f.familia, 'v'); assert.deepEqual(f.de, p.satelite.c);
    cerca(Math.hypot(...f.d), v * 1000); assert.ok(Math.abs(f.d[0] * p.satelite.c[0] + f.d[1] * p.satelite.c[1]) < 1e-7);
    assert.equal(fig.escalas.v, 0.006);
    const nota = inicio => p.notas.find(n => n.texto.startsWith(inicio)).texto;
    comprobarVisible(nota('GM '), 4e14, 'm³/s²'); comprobarVisible(nota('r '), 16000, 'km'); comprobarVisible(nota('v '), v, 'km/s');
    comprobarVisible(nota('g '), fis.a, 'm/s²'); comprobarVisible(nota('v²/r '), ac, 'm/s²');
    if (correcta) { comprobarVisible(nota('t '), t, 's'); assert.match(plano(j.lectura(a)), /exactamente|coincide/); }
    else { assert.match(plano(p.notas), /Solo se muestra el estado inicial/); assert.match(fig.alt, /No se dibuja su trayectoria/); assert.match(plano(j.lectura(a)), ac < fis.a ? /g mayor que/ : /g menor que/); }
  }
  for (const v of velocidades) for (let t = reloj.min; t <= reloj.max; t += reloj.paso) revisar(v, t);
  for (let i = 0; i < 400; i++) revisar(velocidades[i % velocidades.length], Math.round(reloj.max * i / 399 * 1e5) / 1e5);
  revisar(5, reloj.max);
  // Robustez del criterio físico, sin exigir rótulos de controles que la interfaz no ofrece.
  for (const v of [2.25, 4.99999, 5.00001, 5.75]) {
    assert.equal(j.mision.logrado({ v, t: 15000 }), false);
    assert.equal(j.dibujo({ v, t: 15000 }).datos.paneles[0].orbita, undefined);
  }
  assert.deepEqual([...ganadoras], [5]); assert.deepEqual(j.mision.testigo, [{ v: 5, t: 0 }]);
  const inicio = j.dibujo({ v: 5, t: 0 }).datos.paneles[0].satelite.c, fin = j.dibujo({ v: 5, t: fis.T }).datos.paneles[0].satelite.c;
  inicio.forEach((x, i) => assert.ok(Math.abs(x - fin[i]) < 1e-10, 'Un período debe cerrar la vuelta'));
});

test('Órbitas: Predice, Mira y revelación; lo previo no anticipa la relación que se pregunta', () => {
  const p = idea.predice, base = circular(8000 * 8000, 1), nueva = circular(8000 * 8000, 4), correcta = nueva.v / 1000;
  cerca(base.v, 8000); const errores = { lineal: base.v / 4 / 1000, igual: base.v / 1000, directa: base.v * 2 / 1000 };
  assert.equal(p.opciones.filter(x => coincide(x.texto, correcta, 'km/s')).length, 1);
  assert.equal(new Set(p.opciones.map(x => plano(x.texto))).size, p.opciones.length);
  for (const x of p.opciones) {
    comprobarVisible(x.texto, x.correcta ? correcta : errores[x.id], 'km/s');
    if (!x.correcta) { assert.match(plano(x.siFuera), /^Bien /); comprobarVisible(x.siFuera, errores[x.id], 'km/s'); }
  }
  const previo = plano([idea.lee.tarjetas.map(t => t.texto), idea.juega.consigna, idea.juega.mision.texto, p.datos]);
  assert.doesNotMatch(previo, /mitad de la rapidez|rapidez.*raíz.*radio|4 km\/s/);
  const ocultas = p.dibujo.datos.paneles[0].notas; assert.match(ocultas.find(n => /^v_2/.test(n.texto)).texto, /\?/);
  comprobarVisible(p.revelar.datos.paneles[0].notas.find(n => /^v_2/.test(n.texto)).texto, correcta, 'km/s');
  assert.equal(idea.mira.pasos.length, 6); idea.mira.pasos.forEach(paso => igualdades(paso.ecuacion));
  comprobarVisible(idea.mira.pasos[3].ecuacion, correcta, 'km/s');
  assert.match(plano(idea.regla.condicion), /exterior/); assert.match(plano(idea.regla.condicion), /infinito/);
});

test('Órbitas: fórmulas simbólicas de Mira y Regla contrastadas en 400 sistemas independientes', () => {
  function identidad(ecuacion, variables) {
    for (const igualdad of normal(ecuacion).split(';')) {
      const miembros = igualdad.split('=').map(s => sustituir(s, variables));
      assert.ok(miembros.length >= 2);
      for (const miembro of miembros.slice(1)) cerca(miembro, miembros[0], plano(ecuacion));
    }
  }
  for (let s = 0; s < 400; s++) {
    const mu = (210 + 13 * s) * 1e11, radio = (6 + s % 47) * 1e6, masa = 20 + 11 * s;
    const a = circular(mu, radio, masa), b = circular(mu, 4 * radio, masa);
    // G=1 permite expresar la masa central como GM sin introducir otra aproximación.
    const variables = { G: 1, M: mu, m: masa, r: radio, v: a.v, T: a.T, E_M: a.E,
      r_1: radio, r_2: 4 * radio, v_1: a.v, v_2: b.v };
    for (const indice of [0, 1, 2, 4, 5]) identidad(idea.mira.pasos[indice].ecuacion, variables);
    identidad(idea.regla.ecuacion, variables);
    cerca(a.E, a.EPG / 2, 'Afirmación: la energía circular es la mitad de la potencial');
    cerca(a.v, circular(mu, radio, masa * 17).v, 'Afirmación: la masa del satélite se cancela');
  }
});

test('Órbitas: el oráculo rechaza redondeos falsos, signos y unidades cambiados', () => {
  assert.throws(() => comprobarVisible('g = 1,563 m/s²', 1.5625, 'm/s²'), /Redondeo/);
  assert.doesNotThrow(() => comprobarVisible('g ≈ 1,563 m/s²', 1.5625, 'm/s²'));
  assert.throws(() => comprobarVisible('E_M = 5 000 MJ', -5e9 / 1e6, 'MJ'), /Redondeo/);
  assert.throws(() => igualdades('8 ÷ √4 = 2'), /independiente/);
  assert.throws(() => comprobarVisible('T ≈ 335,103 s', 6400 * PI / 60, 'min'), /Falta unidad/);
});
