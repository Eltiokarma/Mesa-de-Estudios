'use strict';

// Oráculo independiente de la idea nueva de etapa 9.
// Usa aritmética racional y conversiones 5/18 y 18/5; no importa cantidadCaso.
// verificacion contiene únicamente los datos de entrada, nunca resultados del motor.
const test = require('node:test');
const assert = require('node:assert/strict');
const def = require('./impulso-y-choques.js');
const idea = def.ideas.find(x => x.id === 'cantidad-movimiento');

function r(x) {
  if (Array.isArray(x)) return x;
  const s = String(x), negativo = s.startsWith('-'), z = s.replace(/^[+-]/, '').split('.');
  const d = 10n ** BigInt((z[1] || '').length);
  return [(negativo ? -1n : 1n) * BigInt(z[0] + (z[1] || '')), d];
}
const mult = (a, b) => { a = r(a); b = r(b); return [a[0] * b[0], a[1] * b[1]]; };
const div = (a, b) => { a = r(a); b = r(b); assert.notEqual(b[0], 0n); return [a[0] * b[1], a[1] * b[0]]; };
const suma = (a, b) => { a = r(a); b = r(b); return [a[0] * b[1] + b[0] * a[1], a[1] * b[1]]; };
const abs = a => { a = r(a); return [a[0] < 0n ? -a[0] : a[0], a[1] < 0n ? -a[1] : a[1]]; };
const neg = a => mult(a, -1);
const n = a => { a = r(a); return Number(a[0]) / Number(a[1]); };
const SI = [5n, 18n], KMH = [18n, 5n];

function magnitudes(c) {
  const m = c.g !== undefined ? div(c.g, 1000) :
    c.tipo === 'carga' ? suma(c.mc, c.ml) : c.m !== undefined ? r(c.m) : null;
  const vx = c.kmh !== undefined ? mult(c.kmh, SI) : c.vx !== undefined ? r(c.vx) : null;
  return { m, vx };
}
function esperado(c) {
  const a = magnitudes(c);
  if (['directo', 'gramos', 'kmh', 'carga'].includes(c.tipo)) return { valor: n(mult(a.m, a.vx)), unidad: 'kg·m/s' };
  if (c.tipo === 'modulo') return { valor: n(abs(mult(a.m, a.vx))), unidad: 'kg·m/s' };
  if (c.tipo === 'velocidad') return { valor: n(div(c.px, c.m)), unidad: 'm/s' };
  if (c.tipo === 'velocidad-kmh') return { valor: n(mult(div(c.px, c.m), KMH)), unidad: 'km/h' };
  if (c.tipo === 'masa') return { valor: n(div(c.px, c.vx)), unidad: 'kg' };
  if (c.tipo === 'igualar') {
    const v = div(mult(c.ma, c.va), c.mb);
    return { valor: n(c.salidaKmh ? mult(v, KMH) : v), unidad: c.salidaKmh ? 'km/h' : 'm/s' };
  }
  throw new Error('Tipo sin oráculo: ' + c.tipo);
}

function esperadoError(c, id) {
  const a = magnitudes(c), e = esperado(c).valor, factor = c.tipo === 'velocidad-kmh' || c.salidaKmh ? KMH : r(1);
  if (['directo', 'gramos', 'kmh'].includes(c.tipo)) {
    if (id === 'signo') return -e;
    if (id === 'sin-masa') return n(a.vx);
    if (id === 'suma') return n(suma(a.m, a.vx));
    if (id === 'cuadrado') return n(mult(mult(a.m, a.vx), a.vx));
    if (id === 'doble') return n(mult(mult(a.m, a.vx), 2));
    if (id === 'sin-convertir') return c.tipo === 'gramos' ? n(mult(c.g, a.vx)) : n(mult(a.m, c.kmh));
  }
  if (['velocidad', 'velocidad-kmh'].includes(c.tipo)) {
    if (id === 'producto') return n(mult(mult(c.px, c.m), factor));
    if (id === 'signo') return -e;
    if (id === 'masa-doble') return n(mult(div(c.px, mult(2, c.m)), factor));
    if (id === 'sin-dividir') return n(mult(c.px, factor));
  }
  if (c.tipo === 'masa') {
    if (id === 'producto') return n(mult(c.px, c.vx));
    if (id === 'signo') return -e;
    if (id === 'cuadrado') return n(div(c.px, mult(c.vx, c.vx)));
    if (id === 'sin-velocidad') return n(abs(c.px));
  }
  if (c.tipo === 'carga') {
    if (id === 'sin-carga') return n(mult(c.mc, a.vx));
    if (id === 'sin-carro') return n(mult(c.ml, a.vx));
    if (id === 'sin-convertir') return n(mult(suma(c.mc, c.ml), c.kmh));
    if (id === 'signo') return -e;
    if (id === 'cuadrado') return n(mult(mult(a.m, a.vx), a.vx));
  }
  if (c.tipo === 'igualar') {
    if (id === 'misma') return n(mult(c.va, factor));
    if (id === 'inversa') return n(mult(div(mult(c.va, c.mb), c.ma), factor));
    if (id === 'signo') return -e;
    if (id === 'sin-dividir') return n(mult(mult(c.ma, c.va), factor));
    if (id === 'sin-convertir' && c.salidaKmh) return n(div(mult(c.ma, c.va), c.mb));
  }
  if (c.tipo === 'modulo') {
    if (id === 'signo') return n(mult(a.m, a.vx));
    if (id === 'sin-convertir') return n(mult(a.m, abs(c.kmh)));
    if (id === 'sin-gramos') return n(mult(c.g, abs(a.vx)));
    if (id === 'sin-masa') return n(abs(a.vx));
    if (id === 'suma') return n(suma(a.m, abs(a.vx)));
  }
  throw new Error('Distractor sin oráculo: ' + c.tipo + '/' + id);
}

function plano(x) {
  if (x === undefined || x === null) return '';
  if (typeof x === 'string' || typeof x === 'number') return String(x);
  if (Array.isArray(x)) return x.map(plano).join('');
  if (x.t !== undefined) return plano(x.t);
  if (x.negrita !== undefined) return plano(x.negrita);
  if (x.vec !== undefined) return plano(x.vec);
  if (x.sub) return plano(x.sub[0]) + '_' + plano(x.sub[1]);
  if (x.sup) return '(' + plano(x.sup[0]) + ')^(' + plano(x.sup[1]) + ')';
  if (x.frac) return '(' + plano(x.frac[0]) + ')/(' + plano(x.frac[1]) + ')';
  return ['texto', 'ecuacion', 'respuesta', 'enunciado', 'pregunta'].filter(k => x[k] !== undefined).map(k => plano(x[k])).join(' ');
}
function numeros(x) {
  const t = plano(x).replace(/−/g, '-').replace(/(\d)[ \u00a0\u202f](?=\d{3}(?:\D|$))/g, '$1').replace(/,/g, '.');
  return (t.match(/[+-]?\d+(?:\.\d+)?/g) || []).map(Number);
}
function numeroRespuesta(x) {
  const ns = numeros(x);
  assert.ok(ns.length, 'La respuesta debe escribir su valor: ' + plano(x));
  return ns[ns.length - 1];
}
function cerca(a, b, contexto) {
  assert.ok(Number.isFinite(a) && Math.abs(a - b) <= 1e-9 * Math.max(1, Math.abs(b)),
    (contexto || '') + ': visible ' + a + ', independiente ' + b);
}
function comprobarRespuesta(x, c, contexto) {
  const e = esperado(c);
  cerca(numeroRespuesta(x), e.valor, contexto);
  assert.ok(plano(x).includes(e.unidad), 'Falta unidad ' + e.unidad + ': ' + plano(x));
}
function sinTextoRoto(caso) {
  for (const k of ['enunciado', 'pregunta', 'datos', 'solucion', 'pasos', 'respuesta', 'opciones']) {
    assert.doesNotMatch(plano(caso[k]), /NaN|undefined|\[object Object\]|Infinity/, 'Texto roto en ' + k);
  }
}
function evaluarNumeros(texto) {
  const s = texto.replace(/\s/g, '').replace(/[·×]/g, '*').replace(/÷/g, '/');
  const tokens = s.match(/\d+(?:\.\d+)?|[()+\-*/^|]/g) || [];
  assert.equal(tokens.join(''), s, 'Notación numérica desconocida: ' + texto);
  let i = 0;
  function atom() {
    const t = tokens[i++];
    if (t === '(' || t === '|') {
      const v = sum(), cierre = t === '(' ? ')' : '|';
      assert.equal(tokens[i++], cierre, 'Agrupación sin cerrar: ' + texto);
      return t === '|' ? Math.abs(v) : v;
    }
    assert.match(t || '', /^\d+(?:\.\d+)?$/, 'Falta un número: ' + texto);
    return Number(t);
  }
  function potencia() { const a = atom(); if (tokens[i] !== '^') return a; i++; return a ** unario(); }
  function unario() { if (tokens[i] === '+') { i++; return unario(); } if (tokens[i] === '-') { i++; return -unario(); } return potencia(); }
  function producto() {
    let a = unario();
    while (tokens[i] === '*' || tokens[i] === '/') { const op = tokens[i++], b = unario(); a = op === '*' ? a * b : a / b; }
    return a;
  }
  function sum() {
    let a = producto();
    while (tokens[i] === '+' || tokens[i] === '-') { const op = tokens[i++], b = producto(); a = op === '+' ? a + b : a - b; }
    return a;
  }
  const valor = sum();
  assert.equal(i, tokens.length, 'Quedan símbolos fuera de la cuenta: ' + texto);
  assert.ok(Number.isFinite(valor), 'Cuenta no finita: ' + texto);
  return valor;
}
function igualdadesNumericas(x) {
  const t = plano(x).replace(/−/g, '-').replace(/(\d)[ \u00a0\u202f](?=\d{3}(?:\D|$))/g, '$1').replace(/,/g, '.').replace(/²/g, '^2').replace(/³/g, '^3');
  // Recupera la expresión numérica ENTERA a ambos lados: conserva todos los
  // paréntesis. Una letra o una unidad delimita el tramo; no se sustituye ninguna.
  const aritmetico = ch => ch !== undefined && /[\d.\s()+\-·×*/÷^|]/.test(ch);
  for (let k = 0; k < t.length; k++) if (t[k] === '=') {
    let inicio = k, fin = k + 1;
    while (inicio > 0 && aritmetico(t[inicio - 1])) inicio--;
    while (fin < t.length && aritmetico(t[fin])) fin++;
    const izquierda = t.slice(inicio, k).trim().replace(/^\.\s+/, '');
    const derecha = t.slice(k + 1, fin).trim().replace(/\.$/, '');
    if (!/\d/.test(izquierda) || !/\d/.test(derecha)) continue;
    cerca(evaluarNumeros(izquierda), evaluarNumeros(derecha), 'Igualdad falsa ' + izquierda + ' = ' + derecha);
  }
}

test('cantidad de movimiento: quince ejemplos, niveles y respuestas por oráculo racional', () => {
  assert.ok(idea, 'Falta la primera idea nueva');
  assert.equal(def.ideas[0].id, 'cantidad-movimiento');
  assert.equal(idea.ejemplos.length, 15);
  for (const nivel of [1, 2, 3]) assert.equal(idea.ejemplos.filter(e => e.nivel === nivel).length, 5);
  const letras = [];
  for (const [i, e] of idea.ejemplos.entries()) {
    assert.ok(e.verificacion && e.verificacion.tipo, 'Faltan entradas del ejemplo ' + (i + 1));
    comprobarRespuesta(e.respuesta, e.verificacion, 'Ejemplo ' + (i + 1));
    assert.ok(e.datos.length && e.solucion.length >= 1 && e.solucion.length <= 4);
    sinTextoRoto(e);
    igualdadesNumericas(e.solucion);
    if (e.nivel === 3) {
      assert.equal(e.alternativas.length, 5);
      const ns = e.alternativas.map(numeroRespuesta), bien = esperado(e.verificacion).valor;
      assert.equal(new Set(ns).size, 5, 'Opciones repetidas en ejemplo ' + (i + 1));
      const candidatas = ns.map((v, j) => Math.abs(v - bien) < 1e-9 ? j : -1).filter(j => j >= 0);
      assert.equal(candidatas.length, 1, 'Debe haber una sola alternativa correcta');
      letras.push(candidatas[0]);
    }
  }
  assert.deepEqual(letras.slice().sort(), [0, 1, 2, 3, 4]);
});

test('cantidad de movimiento: 400 semillas, respuestas y cada distractor recalculados aparte', () => {
  const vistos = { resuelve: new Set(), ahoraTu: new Set() };
  const firma = c => JSON.stringify(['tipo', 'm', 'vx', 'g', 'kmh', 'px', 'mc', 'ml', 'ma', 'va', 'mb', 'salidaKmh'].map(k => [k, c[k]]));
  const ejemplos = new Set(idea.ejemplos.map(e => firma(e.verificacion)));
  for (let semilla = 0; semilla < 400; semilla++) {
    for (const momento of ['resuelve', 'ahoraTu']) {
      const c = idea[momento].generar(semilla), datos = c.verificacion;
      assert.ok(datos && datos.tipo, momento + ': faltan entradas del caso');
      vistos[momento].add(firma(datos));
      sinTextoRoto(c);
      assert.ok(Array.isArray(c.datos) && c.datos.length);
      igualdadesNumericas(c.solucion);
      igualdadesNumericas(c.pasos);
      if (momento === 'resuelve') {
        comprobarRespuesta(c.respuesta, datos, momento + ' ' + semilla);
        continue;
      }
      const esperadoBien = esperado(datos).valor, opciones = c.opciones;
      assert.ok(!ejemplos.has(firma(datos)), 'Ahora tú repite un ejemplo');
      assert.ok(opciones.length >= 3);
      const ns = opciones.map(o => numeroRespuesta(o.texto));
      assert.equal(new Set(ns).size, ns.length, 'Alternativas numéricas repetidas');
      assert.equal(opciones.filter(o => o.correcta === true).length, 1);
      assert.equal(ns.filter(v => Math.abs(v - esperadoBien) < 1e-9).length, 1, 'Dos opciones equivalentes a la correcta');
      for (const o of opciones) {
        const calculado = o.correcta ? esperadoBien : esperadoError(datos, o.id);
        cerca(numeroRespuesta(o.texto), calculado, momento + ' ' + semilla + '/' + o.id);
        if (!o.correcta) {
          assert.ok(numeros(o.siFuera).some(v => Math.abs(v - calculado) < 1e-9),
            'La explicación no escribe el valor de su error: ' + o.id + ' ' + plano(o.siFuera));
          igualdadesNumericas(o.siFuera);
        }
      }
      igualdadesNumericas(c.solucion);
    }
  }
  assert.ok(vistos.resuelve.size >= 3);
  assert.ok(vistos.ahoraTu.size >= 3);
  for (const caso of vistos.resuelve) assert.ok(!vistos.ahoraTu.has(caso), 'Resuelve repite un caso de Ahora tú');
});

test('cantidad de movimiento: misión comprobada en los dieciséis pares de controles', () => {
  const j = idea.juega, inicio = Object.fromEntries(j.controles.map(c => [c.id, c.inicio]));
  assert.equal(j.mision.logrado(inicio), false);
  assert.equal(j.mision.logrado({ mB: 3, vB: 2, t: 0 }), true);
  let logros = 0;
  for (let mB = 1; mB <= 4; mB++) for (let vB = 1; vB <= 4; vB++) {
    const p = n(mult(mB, vB)), debe = p === 6 && mB !== 2;
    assert.equal(Boolean(j.mision.logrado({ mB, vB, t: 0 })), debe);
    if (debe) logros++;
    for (const t of [0, 0.17, 0.5, 1]) {
      const lectura = plano(j.lectura({ mB, vB, t }));
      assert.doesNotMatch(lectura, /NaN|undefined|\[object Object\]/);
      assert.ok(numeros(lectura).some(x => Math.abs(x - p) < 1e-9), 'La lectura no muestra p de B');
      igualdadesNumericas(lectura);
      assert.equal(Boolean(j.mision.logrado({ mB, vB, t })), debe, 'El reloj cambia la misión');
    }
  }
  assert.equal(logros, 1);
});

test('cantidad de movimiento: la predicción distingue módulo y sentido', () => {
  const opciones = idea.predice.opciones;
  assert.equal(opciones.filter(o => o.correcta).length, 1);
  const expected = { c: -6, 'ignora-sentido': 6, 'solo-masa': -12, 'solo-rapidez': -3 };
  for (const o of opciones) {
    assert.ok(Object.hasOwn(expected, o.id), 'Distractor nuevo sin cuenta independiente: ' + o.id);
    const t = plano(o.texto), numero = numeroRespuesta(o.texto);
    assert.match(t, /izquierda|derecha/);
    const signo = /izquierda/.test(t) ? -1 : 1;
    cerca(signo * Math.abs(numero), expected[o.id], 'Predice ' + o.id);
  }
  const calculado = n(mult(4, r(-1.5)));
  assert.equal(calculado, -6);
  assert.equal(Math.abs(calculado), n(mult(2, 3)));
});

