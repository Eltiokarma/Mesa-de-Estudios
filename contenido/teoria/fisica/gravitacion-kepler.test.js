'use strict';

// Oráculo independiente de la idea de Kepler. Recalcula desde
// verificacion, con fracciones y escalas SI. No importa el calculador del contenido.
// Para validar el fragmento antes del ensamblado: GR_KEPLER_MODULE=<wrapper completo>.
const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const cargado = require(process.env.GR_KEPLER_MODULE ? path.resolve(process.env.GR_KEPLER_MODULE) : './gravitacion.js');
const idea = cargado.ideas ? cargado.ideas.find(i => i.id === 'leyes-de-kepler') : (cargado.idea || cargado);

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
  const z = a instanceof Q ? a.n() : a; assert.ok(z > 0 && Number.isFinite(z));
  let lo = 0, hi = 1; while (hi * hi < z) hi *= 2;
  for (let i = 0; i < 120; i++) { const medio = (lo + hi) / 2; if (medio * medio < z) lo = medio; else hi = medio; }
  return (lo + hi) / 2;
}

function raizCubica(z) {
  let lo = 0, hi = Math.max(1, z);
  for (let i = 0; i < 180; i++) { const medio = (lo + hi) / 2; if (medio ** 3 < z) lo = medio; else hi = medio; }
  return (lo + hi) / 2;
}
const tipos = ['cercano', 'lejano', 'semieje', 'excentricidad', 'area', 'duracion', 'area-dias', 'periodo', 'semieje-periodos', 'rapidez', 'periodo-extremos', 'rapidez-alturas', 'periodo-sector', 'sector-semieje'];
// Camino independiente: geometría focal, productos cruzados y bisección positiva.
// La tercera ley se escribe T² = (T_A²/a_A³) a³, no potencia 3/2.
function periodo(c, ab) { return raizPositiva(q(c.TA).pow(2).div(q(c.aA).pow(3)).mul(q(ab).pow(3))); }
function calcular(c) {
  let valor, unidad = 'km';
  switch (c.tipo) {
    case 'cercano': valor = q(c.a).sub(q(c.a).mul(c.e)); break;
    case 'lejano': valor = q(c.a).add(q(c.a).mul(c.e)); break;
    case 'semieje': valor = q(c.rp).add(c.ra).div(2); break;
    case 'excentricidad': valor = q(c.ra).sub(c.rp).div(q(c.ra).add(c.rp)); unidad = ''; break;
    case 'area': valor = q(c.dt).mul(100).div(c.T); unidad = '%'; break;
    case 'area-dias': valor = q(c.dt).mul(100).div(q(c.T).mul(24)); unidad = '%'; break;
    case 'duracion': valor = q(c.T).mul(c.dias ? 24 : 1).mul(c.porcentaje).div(100); unidad = 'h'; break;
    case 'periodo': valor = periodo(c, c.aB); unidad = c.uTiempo || 'días'; break;
    case 'periodo-extremos': valor = periodo(c, q(c.rp).add(c.ra).div(2).n()); unidad = c.uTiempo || 'días'; break;
    case 'periodo-sector': valor = periodo(c, c.aB) * c.porcentaje / 100; unidad = c.uTiempo || 'días'; break;
    case 'semieje-periodos': valor = raizCubica(q(c.aA).pow(3).mul(q(c.TB).pow(2)).div(q(c.TA).pow(2)).n()); unidad = 'millones de km'; break;
    case 'sector-semieje': {
      const tb = q(c.dt).mul(100).div(c.porcentaje);
      valor = raizCubica(q(c.aA).pow(3).mul(tb.pow(2)).div(q(c.TA).pow(2)).n()); unidad = 'millones de km'; break;
    }
    case 'rapidez': valor = q(c.rp).mul(c.vp).div(c.ra); unidad = 'km/s'; break;
    case 'rapidez-alturas': valor = q(c.R).add(c.hp).mul(c.vp).div(q(c.R).add(c.ha)); unidad = 'km/s'; break;
    default: throw new Error('Tipo sin cálculo independiente: ' + c.tipo);
  }
  return { valor: valor instanceof Q ? valor.n() : valor, unidad };
}
function erroresEsperados(c) {
  const r = calcular(c).valor, er = {};
  if (['cercano', 'lejano'].includes(c.tipo)) {
    er['otro-extremo'] = c.tipo === 'cercano' ? c.a + c.a * c.e : c.a - c.a * c.e;
    Object.assign(er, { 'solo-a': c.a, 'solo-ae': c.a * c.e, diametro: 2 * r });
  } else if (['semieje', 'excentricidad'].includes(c.tipo)) {
    const semi = c.tipo === 'semieje';
    Object.assign(er, { suma: c.rp + c.ra, diferencia: semi ? (c.ra - c.rp) / 2 : (c.ra - c.rp) / c.ra,
      'solo-lejano': semi ? c.ra : c.rp / c.ra, doble: r * 2 });
  } else if (['area', 'duracion', 'area-dias'].includes(c.tipo)) {
    const duracion = c.tipo === 'duracion', horas = c.T * (c.tipo === 'area-dias' || c.dias ? 24 : 1);
    Object.assign(er, { inversa: duracion ? horas * 100 / c.porcentaje : 100 * horas / c.dt,
      'sin-cien': duracion ? horas * c.porcentaje : c.dt / horas, complemento: duracion ? horas - r : 100 - r, doble: 2 * r });
    if (c.tipo === 'area-dias') er['sin-dias'] = 100 * c.dt / c.T;
    if (c.tipo === 'duracion' && c.dias) er['sin-dias'] = c.T * c.porcentaje / 100;
  } else if (['periodo', 'periodo-extremos', 'periodo-sector'].includes(c.tipo)) {
    const ab = c.tipo === 'periodo-extremos' ? (c.rp + c.ra) / 2 : c.aB, ratio = ab / c.aA, fraccion = c.tipo === 'periodo-sector' ? c.porcentaje / 100 : 1;
    Object.assign(er, { lineal: c.TA * ratio * fraccion, 'raiz-simple': c.TA * raizPositiva(ratio) * fraccion,
      cuadrado: c.TA * ratio ** 2 * fraccion, inversa: raizPositiva(c.TA ** 2 / ratio ** 3) * fraccion });
    if (c.tipo === 'periodo-extremos') er['radio-instantaneo'] = periodo(c, c.ra);
  } else if (['semieje-periodos', 'sector-semieje'].includes(c.tipo)) {
    const tb = c.tipo === 'sector-semieje' ? c.dt * 100 / c.porcentaje : c.TB, ratio = tb / c.TA;
    Object.assign(er, { lineal: c.aA * ratio, 'sin-raiz': c.aA * ratio ** 2, inversa: c.aA * raizCubica(1 / ratio ** 2), 'raiz-cuadrada': c.aA * raizPositiva(ratio) });
  } else if (['rapidez', 'rapidez-alturas'].includes(c.tipo)) {
    const rp = c.tipo === 'rapidez' ? c.rp : c.R + c.hp, ra = c.tipo === 'rapidez' ? c.ra : c.R + c.ha;
    Object.assign(er, { inversa: c.vp * ra / rp, constante: c.vp, raiz: c.vp * raizPositiva(rp / ra), cuadrado: c.vp * rp ** 2 / ra ** 2 });
    if (c.tipo === 'rapidez-alturas') er['solo-alturas'] = c.vp * c.hp / c.ha;
  } else throw new Error('Errores sin oráculo: ' + c.tipo);
  return er;
}
const firma = c => JSON.stringify(Object.entries(c).filter(([k]) => !['nivel', 'titulo', 'respuesta', 'errores'].includes(k)).sort(([a], [b]) => a.localeCompare(b)));
const coincide = (texto, n, u) => { try { comprobarVisible(texto, n, u); return true; } catch { return false; } };
function entradas(c) {
  if (['cercano', 'lejano'].includes(c.tipo)) return [c.a, c.e];
  if (['semieje', 'excentricidad'].includes(c.tipo)) return [c.rp, c.ra];
  if (['area', 'area-dias'].includes(c.tipo)) return [c.T, c.dt];
  if (c.tipo === 'duracion') return [c.T, c.porcentaje];
  if (['periodo', 'periodo-sector'].includes(c.tipo)) return [c.TA, c.aA, c.aB, ...(c.tipo === 'periodo-sector' ? [c.porcentaje] : [])];
  if (c.tipo === 'semieje-periodos') return [c.TA, c.aA, c.TB];
  if (c.tipo === 'periodo-extremos') return [c.TA, c.aA, c.rp, c.ra];
  if (c.tipo === 'sector-semieje') return [c.TA, c.aA, c.porcentaje, c.dt];
  if (c.tipo === 'rapidez') return [c.rp, c.ra, c.vp];
  if (c.tipo === 'rapidez-alturas') return [c.R, c.hp, c.ha, c.vp];
  throw new Error(c.tipo);
}
function verificarCaso(z) {
  const c = z.verificacion, r = calcular(c), err = erroresEsperados(c);
  cerca(c.respuesta.valor, r.valor); assert.equal(c.respuesta.unidad, r.unidad);
  c.errores.forEach(e => { assert.ok(Object.hasOwn(err, e.id)); cerca(e.valor, err[e.id], c.tipo + '/' + e.id); });
  const texto = z.enunciado || z.pregunta, nums = valores(texto), ns = entradas(c);
  assert.equal(nums.length, ns.length, 'Datos visibles: ' + c.tipo + ': ' + plano(texto)); nums.forEach((n, i) => cerca(n, ns[i]));
  for (const campo of ['enunciado', 'pregunta', 'datos', 'solucion', 'pasos', 'respuesta']) {
    const filas = Array.isArray(z[campo]) ? z[campo] : [z[campo]];
    filas.forEach(f => { assert.doesNotMatch(plano(f), /NaN|Infinity|undefined|\[object Object\]/); igualdades(f); });
  }
  assert.ok(z.datos.length <= 6);
  assert.match(plano(z.datos), /fuente dominante fija/);
  if (['periodo', 'semieje-periodos', 'periodo-extremos', 'periodo-sector', 'sector-semieje'].includes(c.tipo)) {
    assert.match(plano(z.datos), /semieje mayor.*separación instantánea/);
  }
  if (c.tipo === 'rapidez' || c.tipo === 'rapidez-alturas') assert.match(plano(z.datos), /Solo allí.*perpendicular/);
  if (c.tipo === 'area-dias' || c.dias) assert.match(plano(z.datos), /1 día = 24 h/);
  const figura = (z.figura || z.dibujo).datos;
  assert.match(figura.alt, /no están a escala/); assert.ok(figura.paneles[0].notas.some(n => /sin escala/.test(n.texto)));
  for (const nota of figura.paneles[0].notas) {
    const nums = valores(nota.texto);
    if (nums.length) assert.ok(entradas(c).some(n => coincide(nota.texto, n, '')), 'Figura introduce un valor que no está dado: ' + nota.texto);
  }
  if (c.tipo === 'periodo-extremos') figura.paneles[0].notas.filter(n => /^r_[pa]/.test(n.texto)).forEach(n => assert.match(n.texto, /millones de km/));
  if (c.tipo === 'sector-semieje') assert.match(figura.paneles[0].notas.find(n => /^Δt/.test(n.texto)).texto, /días/);
  const pasos = z.pasos || z.solucion;
  if (Array.isArray(pasos)) {
    const eFinal = pasos.filter(p => p.ecuacion).at(-1);
    comprobarVisible(eFinal.ecuacion, r.valor, r.unidad);
    if (c.tipo.startsWith('rapidez')) assert.ok(r.valor < c.vp, 'La rapidez es menor en el extremo lejano');
    // Toda cifra de cálculo pertenece a datos, operadores o resultados físicos comprobados.
    const permitidos = [...ns, 1, 2, 3, 24, 100, r.valor];
    if (c.rp != null && c.ra != null) permitidos.push(c.rp + c.ra, (c.rp + c.ra) / 2);
    if (c.tipo === 'area-dias' || c.dias) permitidos.push(c.T * 24);
    if (c.tipo === 'rapidez-alturas') permitidos.push(c.R + c.hp, c.R + c.ha);
    if (c.tipo === 'periodo-sector') permitidos.push(periodo(c, c.aB));
    if (c.tipo === 'sector-semieje') permitidos.push(c.dt * 100 / c.porcentaje);
    for (const paso of pasos) if (paso.ecuacion) for (const n of literales(paso.ecuacion)) assert.ok(permitidos.some(p => coincide('≈ ' + n, p, '')), 'Cifra intermedia sin cálculo: ' + n);
  }
  return r;
}

test('Kepler: calibración de los catorce tipos y errores comunes', () => {
  const casos = [
    [{ tipo: 'cercano', a: 100, e: 0.6 }, 40], [{ tipo: 'lejano', a: 100, e: 0.6 }, 160],
    [{ tipo: 'semieje', rp: 40, ra: 160 }, 100], [{ tipo: 'excentricidad', rp: 40, ra: 160 }, 0.6],
    [{ tipo: 'area', T: 20, dt: 4 }, 20], [{ tipo: 'duracion', T: 20, porcentaje: 20 }, 4],
    [{ tipo: 'area-dias', T: 2, dt: 6 }, 12.5], [{ tipo: 'periodo', TA: 3, aA: 2, aB: 8 }, 24],
    [{ tipo: 'semieje-periodos', TA: 3, TB: 24, aA: 2 }, 8], [{ tipo: 'rapidez', rp: 40, ra: 160, vp: 8 }, 2],
    [{ tipo: 'periodo-extremos', TA: 3, aA: 2, rp: 4, ra: 12 }, 24],
    [{ tipo: 'rapidez-alturas', R: 3, hp: 2, ha: 12, vp: 9 }, 3],
    [{ tipo: 'periodo-sector', TA: 3, aA: 2, aB: 8, porcentaje: 25 }, 6],
    [{ tipo: 'sector-semieje', TA: 3, aA: 2, dt: 6, porcentaje: 25 }, 8],
  ];
  casos.forEach(([c, r]) => cerca(calcular(c).valor, r, c.tipo));
  assert.throws(() => igualdades('3 · √((8/2)³) = 12'));
  assert.throws(() => comprobarVisible('0,333 h', 1 / 3, 'h'));
});
test('Kepler: 15 ejemplos, cinco por nivel, cuatro descartes y A–E por fuerza bruta', () => {
  assert.ok(idea); assert.equal(idea.ejemplos.length, 15);
  const letras = [];
  [1, 2, 3].forEach(n => assert.equal(idea.ejemplos.filter(e => e.nivel === n).length, 5));
  for (const e of idea.ejemplos) {
    const r = verificarCaso(e); comprobarVisible(e.respuesta, r.valor, r.unidad);
    assert.ok(e.solucion.length <= 4);
    if (e.nivel === 3) {
      assert.equal(e.alternativas.length, 5); assert.equal(new Set(e.alternativas).size, 5);
      const aciertos = e.alternativas.map((a, i) => coincide(a, r.valor, r.unidad) ? i : -1).filter(i => i >= 0);
      assert.equal(aciertos.length, 1); letras.push(aciertos[0]);
      const errores = Object.values(erroresEsperados(e.verificacion));
      e.alternativas.forEach((a, i) => { if (i !== aciertos[0]) { assert.ok(errores.some(v => coincide(a, v, r.unidad))); assert.ok(plano(e.solucion).includes(plano(a).replace(/^≈ /, '')), 'Alternativa sin explicar por su valor: ' + plano(a)); assert.ok(!/\b[A-E]:/.test(plano(e.solucion))); } });
    }
  }
  assert.deepEqual(letras.sort(), [0, 1, 2, 3, 4]);
});
test('Kepler: 400 semillas por momento, datos, errores, igualdad, sentido y bancos disjuntos', () => {
  const bancos = { resuelve: new Set(), ahoraTu: new Set() }, ejemplos = new Set(idea.ejemplos.map(e => firma(e.verificacion))), familias = new Set();
  for (let semilla = 0; semilla < 400; semilla++) for (const nombre of ['resuelve', 'ahoraTu']) {
    const z = idea[nombre].generar(semilla), c = z.verificacion, r = verificarCaso(z);
    assert.deepEqual(z, idea[nombre].generar(semilla)); familias.add(c.tipo); bancos[nombre].add(firma(c));
    assert.ok(!ejemplos.has(firma(c))); assert.notEqual(firma(c), firma(idea.predice.verificacion));
    assert.ok(!(c.tipo === 'periodo' && ((c.TA === 20 && c.aA === 4 && c.aB === 9) || (c.TA === 81 && c.aA === 9 && c.aB === 4))), 'Caso reservado para examen');
    if (nombre === 'resuelve') { comprobarVisible(z.respuesta, r.valor, r.unidad); assert.ok(z.pasos.length >= 3 && z.pasos.length <= 6); }
    else {
      assert.equal(z.opciones.filter(o => o.correcta).length, 1);
      assert.equal(z.opciones.filter(o => coincide(o.texto, r.valor, r.unidad)).length, 1);
      assert.equal(new Set(z.opciones.map(o => visible(o.texto))).size, z.opciones.length);
      const errores = erroresEsperados(c);
      for (const o of z.opciones) {
        comprobarVisible(o.texto, o.correcta ? r.valor : errores[o.id], r.unidad);
        if (!o.correcta) { assert.match(o.siFuera, /^Bien /); comprobarVisible(o.siFuera, errores[o.id], r.unidad); }
      }
    }
  }
  assert.equal(familias.size, tipos.length); for (const f of bancos.resuelve) assert.ok(!bancos.ahoraTu.has(f));
});

// Oráculo geométrico: bisección, polígono denso y ecuación de Newton por RK4.
function anomalíaIndependiente(t) {
  const m = 2 * Math.PI * t / 20, vuelta = Math.floor(m / (2 * Math.PI)), objetivo = m - vuelta * 2 * Math.PI;
  let lo = 0, hi = 2 * Math.PI;
  for (let k = 0; k < 90; k++) { const x = (lo + hi) / 2; if (x - 0.6 * Math.sin(x) < objetivo) lo = x; else hi = x; }
  return (lo + hi) / 2 + vuelta * 2 * Math.PI;
}
function coord(E) { return [6000 - 10000 * Math.cos(E), -8000 * Math.sin(E)]; }
function areaPoligono(ps) { return Math.abs(ps.reduce((s, p, i) => { const q = ps[(i + 1) % ps.length]; return s + p[0] * q[1] - p[1] * q[0]; }, 0)) / 2; }
test('Kepler: 400 estados, foco correcto, sector físico, misión única y lectura medible', () => {
  const j = idea.juega, areaTotal = Math.PI * 10000 * 8000, ganadores = [];
  for (const inicio of [0, 5, 10, 15]) for (let duracion = 1; duracion <= 5; duracion++) {
    const c = { inicio, duracion, u: 0 };
    assert.equal(j.mision.logrado(c), duracion === 4);
    if (j.mision.logrado(c)) ganadores.push(c);
  }
  assert.equal(ganadores.length, 4); assert.ok(!j.mision.logrado({ inicio: 0, duracion: 1, u: 0 }));
  j.mision.testigo.forEach(c => assert.ok(j.mision.logrado(c)));
  for (let k = 0; k < 400; k++) {
    const inicio = ((k * 137) % 2000) / 100, duracion = 1 + k % 5, u = k / 399, c = { inicio, duracion, u };
    const d = j.dibujo(c).datos, p = d.paneles[0], v = d.verificacionOrbital;
    cerca(v.GM, 4 * Math.PI ** 2 * (1e7) ** 3 / 72000 ** 2);
    assert.deepEqual(p.planeta.c, [0, 0]); assert.equal(p.planeta.R, 2000); assert.deepEqual(p.orbita, { a: 10000, b: 8000 });
    const esperado = coord(anomalíaIndependiente(inicio + duracion * u));
    p.satelite.c.forEach((x, n) => assert.ok(Math.abs(x - esperado[n]) < 2e-8));
    const [x, y] = p.satelite.c;
    cerca(((x - 6000) / 10000) ** 2 + (y / 8000) ** 2, 1);
    assert.ok(Math.hypot(x, y) > 2000); cerca(Math.hypot(x, y) + Math.hypot(x - 12000, y), 20000);
    cerca(v.areaKm2 / areaTotal, duracion / 20); assert.equal(j.mision.logrado(c), duracion === 4);
    assert.deepEqual(valores(j.lectura(c)), [duracion, 5 * duracion]);
    const inicioE = anomalíaIndependiente(inicio), finalE = anomalíaIndependiente(inicio + duracion);
    const denso = [[0, 0], ...Array.from({ length: 4097 }, (_, i) => coord(inicioE + (finalE - inicioE) * i / 4096)), [0, 0]];
    assert.ok(Math.abs(areaPoligono(denso) / v.areaKm2 - 1) < 1.5e-7, 'Área independiente por polígono denso');
    const sector = p.sectores[0]; assert.equal(sector.color, 'tinta'); assert.equal(sector.puntos.length, 131);
    sector.puntos.slice(1, -1).forEach((p, i) => { const esperado = coord(anomalíaIndependiente(inicio + duracion * i / 128)); p.forEach((x, n) => assert.ok(Math.abs(x - esperado[n]) < 2e-8)); });
    assert.ok(Math.abs(areaPoligono(sector.puntos) / v.areaKm2 - 1) < 0.00017, 'Error visual del sector acotado');
    assert.deepEqual(p.cotas[0].de, [6000, 0]); assert.deepEqual(p.cotas[0].a, [16000, 0]); comprobarVisible(p.cotas[0].texto, 10000, 'km');
  }
});
test('Kepler: trayectoria contrastada con integración gravitatoria independiente', () => {
  const GM = 4 * Math.PI ** 2 * 1e21 / 72000 ** 2, rp = 4e6, a = 1e7;
  let z = [-rp, 0, 0, -Math.sqrt(GM * (2 / rp - 1 / a))], area = 0;
  const h = 72000 / 40000, derivar = v => { const r = Math.hypot(v[0], v[1]); return [v[2], v[3], -GM * v[0] / r ** 3, -GM * v[1] / r ** 3]; };
  const sumar = (z, k, f) => z.map((x, i) => x + h * k[i] * f), E0 = (z[2] ** 2 + z[3] ** 2) / 2 - GM / rp;
  for (let i = 0; i <= 40000; i++) {
    if (i % 2000 === 0) {
      const c = { inicio: i * h / 3600, duracion: 1, u: 0 }, p = idea.juega.dibujo(c).datos.paneles[0].satelite.c;
      assert.ok(Math.hypot(p[0] * 1000 - z[0], p[1] * 1000 - z[1]) < 0.01, 'Posición integrada');
      cerca((z[2] ** 2 + z[3] ** 2) / 2 - GM / Math.hypot(z[0], z[1]), E0);
    }
    if (i === 40000) break;
    const k1 = derivar(z), k2 = derivar(sumar(z, k1, 0.5)), k3 = derivar(sumar(z, k2, 0.5)), k4 = derivar(sumar(z, k3, 1));
    area += h * (z[0] * z[3] - z[1] * z[2]) / 2;
    z = z.map((x, n) => x + h * (k1[n] + 2 * k2[n] + 2 * k3[n] + k4[n]) / 6);
  }
  cerca(area, Math.PI * 1e7 * 8e6); assert.ok(Math.hypot(z[0] + rp, z[1]) < 0.01);
});
test('Kepler: predicción independiente, ninguna fórmula o respuesta previa y Mira', () => {
  const p = idea.predice, c = p.verificacion, r = calcular(c), errores = erroresEsperados(c);
  cerca(r.valor, 24); assert.deepEqual([c.TA, c.aA, c.aB], [3, 2, 8]);
  assert.equal(c.circulares, true); assert.match(p.pregunta, /órbitas circulares/);
  assert.match(plano(p.datos[3]), /circulares.*semieje mayor.*coincide.*radio/);
  assert.equal(p.dibujo.datos.paneles.length, 2);
  for (const [i, panel] of p.dibujo.datos.paneles.entries()) {
    assert.equal(panel.modo, 'circular'); assert.ok(panel.orbita.r > 0);
    cerca(Math.hypot(panel.satelite.c[0], panel.satelite.c[1]), panel.orbita.r);
    comprobarVisible(panel.cotas[0].texto, i ? 8 : 2, 'UA');
    assert.match(panel.notas.at(-1).texto, /sin escala/);
  }
  assert.equal(p.opciones.filter(o => coincide(o.texto, r.valor, 'años')).length, 1);
  p.opciones.forEach(o => { comprobarVisible(o.texto, o.correcta ? r.valor : errores[o.id], 'años'); if (!o.correcta) comprobarVisible(o.siFuera, errores[o.id], 'años'); });
  assert.deepEqual(p.opciones.map(o => visible(o.texto)), [24, 12, 6, 48]);
  const previo = JSON.stringify({ lee: idea.lee, glosario: cargado.glosario, consigna: idea.juega.consigna, mision: idea.juega.mision.texto, datos: p.datos });
  assert.doesNotMatch(previo, /24 años|T_B.*(?:\^3|√)|período.*(?:ocho veces|se octuplica)/);
  const datoUA = plano(p.datos[2]); assert.match(datoUA, /1 UA ≈ 150 millones de km/);
  assert.equal(idea.mira.pasos.length, 4); idea.mira.pasos.forEach(p => igualdades(p.ecuacion));
  comprobarVisible(idea.mira.pasos.at(-1).ecuacion, 24, 'años');
  assert.match(idea.regla.texto, /rápidez|rapidez/); assert.match(idea.regla.condicion, /masas que giran despreciables/);
  // Auditoría (26 nov): la regla trae los extremos que piden «Así se resuelve» y «Ahora tú».
  assert.match(JSON.stringify(idea.regla.ecuacion), /1 − e/); assert.match(JSON.stringify(idea.regla.ecuacion), /1 \+ e/);
});
