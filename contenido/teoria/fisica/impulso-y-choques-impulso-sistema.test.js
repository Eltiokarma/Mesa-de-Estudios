'use strict';

// Oráculo independiente, etapa 9. Solo lee entradas de verificacion.
// Calcula con racionales: balances de cada cuerpo/sistema e integración geométrica.
// El código de producción no participa en el cálculo de respuestas ni errores.
// Para el trabajo previo a ensamblar: IC_ETAPA9_MODULE=<wrapper completo>, o
// IC_ETAPA9_HELPERS=<fragmento> para probar únicamente los bancos de ejercicios.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

let parcial = false;
function cargar() {
  if (process.env.IC_ETAPA9_MODULE) return require(path.resolve(process.env.IC_ETAPA9_MODULE));
  if (!process.env.IC_ETAPA9_HELPERS) return require('./impulso-y-choques.js');
  parcial = true;
  const Kit = require('../../../nucleo/kit/kit.js');
  const fuente = fs.readFileSync(path.resolve(process.env.IC_ETAPA9_HELPERS), 'utf8');
  const h = new Function('Kit', fuente + ';return {icImpEjemplos,icSisEjemplos,icImpGenerar,icSisGenerar,icResuelve,icAhora};')(Kit);
  return { ideas: [
    { id: 'impulso', ejemplos: h.icImpEjemplos, resuelve: { generar: s => h.icResuelve(h.icImpGenerar(s, true)) }, ahoraTu: { generar: s => h.icAhora(h.icImpGenerar(s, false)) } },
    { id: 'conservacion', ejemplos: h.icSisEjemplos, resuelve: { generar: s => h.icResuelve(h.icSisGenerar(s, true)) }, ahoraTu: { generar: s => h.icAhora(h.icSisGenerar(s, false)) } },
  ] };
}
const def = cargar();
const ids = ['impulso', 'conservacion'];

function gcd(a, b) { a = a < 0n ? -a : a; b = b < 0n ? -b : b; while (b) [a, b] = [b, a % b]; return a || 1n; }
class Q {
  constructor(a, b = 1n) {
    if (a instanceof Q) { this.a = a.a; this.b = a.b; return; }
    if (typeof a !== 'bigint') {
      const s = String(a ?? 0); assert.match(s, /^-?\d+(?:\.\d+)?$/, 'Entrada racional no decimal: ' + s);
      const z = s.split('.'); b = 10n ** BigInt((z[1] || '').length); a = BigInt(z.join(''));
    }
    assert.notEqual(b, 0n, 'División por cero en el oráculo');
    if (b < 0n) { a = -a; b = -b; } const g = gcd(a, b); this.a = a / g; this.b = b / g;
  }
  add(x) { x = q(x); return new Q(this.a * x.b + x.a * this.b, this.b * x.b); }
  sub(x) { return this.add(q(x).neg()); }
  mul(x) { x = q(x); return new Q(this.a * x.a, this.b * x.b); }
  div(x) { x = q(x); return new Q(this.a * x.b, this.b * x.a); }
  neg() { return new Q(-this.a, this.b); }
  abs() { return this.a < 0n ? this.neg() : this; }
  number() { return Number(this.a) / Number(this.b); }
}
const q = x => new Q(x);
const sum = xs => xs.reduce((a, b) => a.add(b), q(0));
const SI = new Q(5n, 18n);

function estado(c) {
  if (c.familia === 'impulso') {
    const m = c.g == null ? q(c.m) : q(c.g).div(1000), dt = c.ms == null ? q(c.dt) : q(c.ms).div(1000);
    const vi = q(c.vi), vf = q(c.vf), dp = m.mul(vf).sub(m.mul(vi));
    const triangulo = c.forma === 'tri' || c.tipo === 'tri' || c.tipo === 'tiempo-tri';
    const pulso = c.tipo === 'tramos'
      ? sum([q(c.F1).mul(c.dt1), q(c.F2).mul(c.dt2)])
      : q(c.F).mul(dt).div(triangulo ? 2 : 1);
    return { m, dt, vi, vf, dp, triangulo, pulso };
  }
  assert.equal(c.familia, 'sistema', 'Familia desconocida');
  const escala = c.enKmh ? SI : q(1);
  const masas = [c.gA == null ? q(c.mA) : q(c.gA).div(1000), q(c.mB)];
  const antes = [q(c.uA).mul(escala), q(c.uB).mul(escala)];
  const despues = [q(c.vA).mul(escala), q(c.vB)];
  if (c.tipo === 'tres') { masas.push(q(c.mC)); antes.push(q(c.uC)); }
  const pi = sum(masas.map((m, i) => m.mul(antes[i])));
  const pf = sum(despues.map((v, i) => v.mul(masas[i])));
  const ext = c.Fext == null ? q(c.Iext) : q(c.Fext).mul(c.dt);
  const aporte = c.tipo === 'tres' ? pf : masas[0].mul(despues[0]);
  return { masas, antes, despues, pi, pf, ext, aporte, divisor: masas[masas.length - 1] };
}
function esperado(c) {
  const s = estado(c); let valor, unidad;
  if (c.familia === 'impulso') {
    if (['rect', 'tri'].includes(c.tipo)) { valor = s.pulso; unidad = 'N·s'; }
    else if (c.tipo === 'cambio') { valor = s.dp; unidad = 'N·s'; }
    else if (['fuerza', 'fuerza-ms'].includes(c.tipo)) { valor = s.dp.div(s.dt); unidad = 'N'; }
    else if (['final', 'tramos'].includes(c.tipo)) { valor = s.m.mul(s.vi).add(s.pulso).div(s.m); unidad = 'm/s'; }
    else if (['tiempo', 'tiempo-tri'].includes(c.tipo)) { valor = s.dp.div(q(c.F).div(s.triangulo ? 2 : 1)); unidad = 's'; }
    else throw new Error('Tipo de impulso sin oráculo: ' + c.tipo);
  } else if (c.tipo === 'total') { valor = s.pi; unidad = 'kg·m/s'; }
  else if (c.tipo === 'diagnostico') { valor = s.pf.sub(s.pi); unidad = 'N·s'; }
  else if (c.tipo === 'fuerza-sistema') { valor = s.pf.sub(s.pi).div(c.dt); unidad = 'N'; }
  else { valor = s.pi.add(s.ext).sub(s.aporte).div(s.divisor); unidad = 'm/s'; }
  return { valor, unidad };
}

// Cada entrada corresponde a una operación errónea explícita, no a un número
// inventado. El cálculo usa las magnitudes originales en aritmética racional.
function erroresEsperados(c) {
  const s = estado(c), r = esperado(c).valor, out = {};
  const add = (id, v) => { out[id] = q(v); };
  if (c.familia === 'impulso') {
    if (['rect', 'tri'].includes(c.tipo)) {
      add('signo', s.pulso.neg()); add('sin-tiempo', c.F); add('divide-tiempo', q(c.F).div(s.dt));
      add('doble', s.pulso.mul(2)); add('mitad', s.pulso.div(2));
    } else if (['cambio', 'fuerza', 'fuerza-ms'].includes(c.tipo)) {
      const d = c.tipo === 'cambio' ? q(1) : s.dt;
      add('signo', s.m.mul(s.vi.sub(s.vf)).div(d)); add('sin-masa', s.vf.sub(s.vi).div(d));
      add('suma-velocidades', s.m.mul(s.vi.add(s.vf)).div(d)); add('solo-final', s.m.mul(s.vf).div(d)); add('doble-masa', s.dp.mul(2).div(d));
      if (c.tipo !== 'cambio') { add('sin-duracion', s.dp); add('multiplica-duracion', s.dp.mul(s.dt)); }
    } else if (['final', 'tramos'].includes(c.tipo)) {
      if (c.tipo === 'tramos') {
        add('solo-primero', s.vi.add(q(c.F1).mul(c.dt1).div(s.m)));
        add('solo-segundo', s.vi.add(q(c.F2).mul(c.dt2).div(s.m)));
        add('modulos', s.vi.add(q(c.F1).mul(c.dt1).abs().add(q(c.F2).mul(c.dt2).abs()).div(s.m)));
      } else if (s.triangulo) add('rectangulo', s.vi.add(q(c.F).mul(s.dt).div(s.m)));
      add('sin-masa', s.vi.add(s.pulso)); add('sin-inicial', s.pulso.div(s.m));
      add('resta-impulso', s.vi.sub(s.pulso.div(s.m))); add('doble-impulso', s.vi.add(s.pulso.mul(2).div(s.m)));
    } else {
      add('signo', r.neg()); add('sin-masa', s.vf.sub(s.vi).div(c.F).mul(s.triangulo ? 2 : 1));
      add('inversa', q(c.F).div(s.dp)); add('doble', r.mul(2)); add('mitad', r.div(2));
    }
  } else if (c.tipo === 'total') {
    const [a, b] = s.masas, [u, v] = s.antes;
    add('modulos', a.mul(u).abs().add(b.mul(v).abs())); add('sin-masas', u.add(v));
    add('solo-a', a.mul(u)); add('solo-b', b.mul(v)); add('signo', s.pi.neg()); add('masas-cruzadas', a.mul(v).add(b.mul(u)));
  } else if (['diagnostico', 'fuerza-sistema'].includes(c.tipo)) {
    const d = c.tipo === 'diagnostico' ? q(1) : q(c.dt);
    add('signo', s.pi.sub(s.pf).div(d)); add('solo-final', s.pf.div(d));
    add('solo-a', s.masas[0].mul(s.despues[0].sub(s.antes[0])).div(d));
    add('suma-estados', s.pf.add(s.pi).div(d)); add('doble', s.pf.sub(s.pi).mul(2).div(d));
  } else {
    const saldo = s.pi.add(s.ext);
    add('signo', s.aporte.sub(saldo).div(s.divisor)); add('sin-dividir', saldo.sub(s.aporte));
    add('suma-conocido', saldo.add(s.aporte).div(s.divisor)); add('misma', s.despues[0]);
    add('sin-externo', s.pi.sub(s.aporte).div(s.divisor)); add('total-cero', s.aporte.neg().div(s.divisor));
    add('aporte-doble', saldo.sub(s.aporte.mul(2)).div(s.divisor)); add('masa-doble', saldo.sub(s.aporte).div(s.divisor.mul(2)));
    if (c.tipo === 'tres') add('sin-b', s.pi.sub(s.masas[0].mul(s.despues[0])).div(s.divisor));
  }
  return out;
}

function plano(x) {
  if (x == null) return '';
  if (typeof x !== 'object') return String(x);
  if (Array.isArray(x)) return x.map(plano).join('');
  if (x.t != null) return plano(x.t);
  if (x.negrita != null) return plano(x.negrita);
  if (x.vec != null) return plano(x.vec);
  if (x.sub) return plano(x.sub[0]) + '_' + plano(x.sub[1]);
  if (x.sup) return '(' + plano(x.sup[0]) + ')^(' + plano(x.sup[1]) + ')';
  if (x.frac) return '(' + plano(x.frac[0]) + ')/(' + plano(x.frac[1]) + ')';
  return ['texto', 'ecuacion', 'respuesta', 'enunciado', 'pregunta'].filter(k => x[k] != null).map(k => plano(x[k])).join(' ');
}
function normal(x) { return plano(x).replace(/−/g, '-').replace(/(\d)[ \u00a0\u202f](?=\d{3}(?:\D|$))/g, '$1').replace(/,/g, '.'); }
function numeros(x) { return (normal(x).match(/[+-]?\d+(?:\.\d+)?/g) || []).map(Number); }
function valorVisible(x) { const ns = numeros(x); assert.ok(ns.length, 'Falta valor: ' + plano(x)); return ns.at(-1); }
function cerca(a, b, contexto = '') {
  b = b instanceof Q ? b.number() : b;
  assert.ok(Number.isFinite(a) && Number.isFinite(b) && Math.abs(a - b) <= 1e-8 * Math.max(1, Math.abs(b)), `${contexto}: visible ${a}, independiente ${b}`);
}

// Analizador de expresiones numéricas visible, sin eval ni motor de producción.
function expresion(texto) {
  const s = texto.replace(/\s/g, '').replace(/[·×]/g, '*').replace(/÷/g, '/');
  const tokens = s.match(/\d+(?:\.\d+)?|[()+\-*/^]/g) || [];
  assert.equal(tokens.join(''), s, 'Expresión no numérica: ' + texto); let i = 0;
  function atom() { if (tokens[i] === '(') { i++; const a = suma(); assert.equal(tokens[i++], ')'); return a; } const a = tokens[i++]; assert.match(a || '', /^\d+(?:\.\d+)?$/); return q(a); }
  function pot() { let a = atom(); if (tokens[i] === '^') { i++; const e = unary().number(); assert.ok(Number.isInteger(e) && e >= 0 && e < 5); let p = q(1); for (let k = 0; k < e; k++) p = p.mul(a); a = p; } return a; }
  function unary() { if (tokens[i] === '+') { i++; return unary(); } if (tokens[i] === '-') { i++; return unary().neg(); } return pot(); }
  function producto() { let a = unary(); while (tokens[i] === '*' || tokens[i] === '/') { const op = tokens[i++], b = unary(); a = op === '*' ? a.mul(b) : a.div(b); } return a; }
  function suma() { let a = producto(); while (tokens[i] === '+' || tokens[i] === '-') { const op = tokens[i++], b = producto(); a = op === '+' ? a.add(b) : a.sub(b); } return a; }
  const a = suma(); assert.equal(i, tokens.length, 'Símbolos sin consumir: ' + texto); return a;
}
function igualdades(x) {
  const t = normal(x).replace(/²/g, '^2').replace(/³/g, '^3'), arit = c => c != null && /[\d.\s()+\-·×*/÷^]/.test(c);
  for (let k = 0; k < t.length; k++) if (t[k] === '=') {
    let a = k, b = k + 1; while (a > 0 && arit(t[a - 1])) a--; while (b < t.length && arit(t[b])) b++;
    const iz = t.slice(a, k).trim().replace(/^\.\s+/, ''), de = t.slice(k + 1, b).trim().replace(/\.$/, '');
    // Una expresión que continúa con una letra no es una igualdad entre números
    // (por ejemplo, 0 = 1·(-3) + 3·v_B,x). Su balance se verifica por separado.
    if (/[+\-·×*/÷^]\s*$/.test(iz) || /[+\-·×*/÷^]\s*$/.test(de)) continue;
    if (/\d/.test(iz) && /\d/.test(de)) cerca(expresion(iz).number(), expresion(de), 'Igualdad ' + iz + ' = ' + de);
  }
}
function textoSano(c) {
  for (const k of ['enunciado', 'pregunta', 'datos', 'solucion', 'pasos', 'respuesta', 'opciones']) {
    const t = plano(c[k]); assert.doesNotMatch(t, /NaN|undefined|\[object Object\]|Infinity/); igualdades(c[k]);
  }
}
function verificarBalance(c, visible) {
  const s = estado(c), v = q(visible);
  if (c.familia === 'impulso') {
    if (['final', 'tramos'].includes(c.tipo)) cerca(s.m.mul(v.sub(s.vi)).number(), s.pulso, 'Balance final independiente');
    if (['fuerza', 'fuerza-ms'].includes(c.tipo)) cerca(v.mul(s.dt).number(), s.dp, 'F media por intervalo');
    if (['tiempo', 'tiempo-tri'].includes(c.tipo)) { assert.ok(v.number() > 0, 'Duración imposible'); cerca(v.mul(c.F).div(s.triangulo ? 2 : 1).number(), s.dp, 'Duración y área'); }
    if (s.m.number()) assert.ok(s.m.number() > 0, 'Masa imposible');
  } else {
    s.masas.forEach(m => assert.ok(m.number() > 0, 'Masa del sistema no positiva'));
    if (!['total', 'diagnostico', 'fuerza-sistema'].includes(c.tipo)) cerca(s.aporte.add(s.divisor.mul(v)).sub(s.pi).number(), s.ext, 'Balance de todo el sistema');
    if (c.tipo.startsWith('retroceso')) assert.equal(s.pi.number(), 0, 'Dice reposo sin estar en reposo');
  }
}
function afirmaciones(caso, c) {
  const s = estado(c), texto = normal([caso.solucion, caso.pasos]);
  if (/no entra impulso externo|no entra.*externo/.test(texto)) cerca(s.ext.number(), 0, 'Afirmación impulso externo nulo');
  if (/duración es positiva/.test(texto)) assert.ok(esperado(c).valor.number() > 0);
  if (c.familia === 'sistema') {
    for (const [simbolo, valor] of [['P_i.x', s.pi], ['P_f.x', ['diagnostico', 'fuerza-sistema'].includes(c.tipo) ? s.pf : s.pi.add(s.ext)]]) {
      const re = new RegExp(simbolo.replace('.', ',?') + '\\s*=([^;]+?)(?:kg|$)', 'g');
      for (const m of texto.matchAll(re)) { const lados = m[1].split('='); cerca(valorVisible(lados.at(-1)), valor, simbolo + ' del caso'); }
    }
  }
}
function firma(c) { return JSON.stringify(Object.entries(c).filter(([k]) => !['titulo', 'nivel'].includes(k)).sort(([a], [b]) => a.localeCompare(b))); }

for (const id of ids) {
  const idea = def.ideas.find(i => i.id === id);
  test(id + ': 15 ejemplos y alternativas verificadas por balance racional independiente', () => {
    assert.ok(idea); assert.equal(idea.ejemplos.length, 15);
    const letras = [];
    for (const nivel of [1, 2, 3]) assert.equal(idea.ejemplos.filter(e => e.nivel === nivel).length, 5);
    for (const [index, e] of idea.ejemplos.entries()) {
      assert.ok(e.verificacion, 'Faltan entradas independientes'); const c = e.verificacion, r = esperado(c);
      cerca(valorVisible(e.respuesta), r.valor, `${id} ejemplo ${index + 1}`);
      assert.ok(plano(e.respuesta).includes(r.unidad)); assert.ok(e.datos.length); textoSano(e); afirmaciones(e, c);
      verificarBalance(c, valorVisible(e.respuesta));
      if (e.nivel === 3) {
        assert.equal(e.alternativas.length, 5); const ns = e.alternativas.map(valorVisible);
        assert.equal(new Set(ns).size, 5); const correctas = ns.map((v, i) => Math.abs(v - r.valor.number()) < 1e-9 ? i : -1).filter(i => i >= 0);
        assert.equal(correctas.length, 1); letras.push(correctas[0]); const errores = Object.values(erroresEsperados(c)).map(q => q.number());
        for (const [i, v] of ns.entries()) if (i !== correctas[0]) {
          assert.ok(errores.some(n => Math.abs(n - v) < 1e-9), 'Distractor sin operación independiente: ' + v);
          assert.ok(numeros(e.solucion).some(n => Math.abs(n - v) < 1e-9), 'Falta explicar alternativa ' + v);
        }
      }
    }
    assert.deepEqual(letras.sort(), [0, 1, 2, 3, 4]);
  });

  test(id + ': 400 semillas por momento, cada respuesta/distractor/siFuera y afirmación', () => {
    const firmas = { resuelve: new Set(), ahoraTu: new Set() }, ejemplos = new Set(idea.ejemplos.map(e => firma(e.verificacion)));
    const tipos = new Set();
    for (let semilla = 0; semilla < 400; semilla++) for (const momento of ['resuelve', 'ahoraTu']) {
      const caso = idea[momento].generar(semilla), c = caso.verificacion; assert.ok(c && c.familia && c.tipo);
      firmas[momento].add(firma(c)); tipos.add(c.tipo); assert.ok(caso.datos.length); textoSano(caso); afirmaciones(caso, c);
      assert.deepEqual(caso, idea[momento].generar(semilla), 'Generador no determinístico');
      const r = esperado(c);
      if (momento === 'resuelve') { cerca(valorVisible(caso.respuesta), r.valor); verificarBalance(c, valorVisible(caso.respuesta)); continue; }
      assert.ok(!ejemplos.has(firma(c)), 'Ahora tú repite un ejemplo');
      const opciones = caso.opciones, errores = erroresEsperados(c), ns = opciones.map(o => valorVisible(o.texto));
      assert.ok(opciones.length >= 4 && opciones.length <= 5); assert.equal(new Set(ns).size, opciones.length);
      assert.equal(opciones.filter(o => o.correcta).length, 1);
      assert.equal(ns.filter(v => Math.abs(v - r.valor.number()) < 1e-9).length, 1, 'Unicidad numérica por fuerza bruta');
      for (const o of opciones) {
        assert.ok(plano(o.texto).includes(r.unidad));
        if (o.correcta) { cerca(valorVisible(o.texto), r.valor); verificarBalance(c, valorVisible(o.texto)); }
        else {
          assert.ok(Object.hasOwn(errores, o.id), 'Error sin oráculo: ' + c.tipo + '/' + o.id);
          cerca(valorVisible(o.texto), errores[o.id], c.tipo + '/' + o.id);
          assert.match(plano(o.siFuera), /^Bien /, 'El contrafáctico no reconoce un paso correcto');
          const final = plano(o.siFuera).match(/Así sale (.+)\.$/); assert.ok(final, 'El error no declara su resultado');
          cerca(valorVisible(final[1]), errores[o.id], 'siFuera ' + o.id); igualdades(o.siFuera);
        }
      }
    }
    assert.ok(tipos.size >= 6); assert.ok(firmas.resuelve.size >= 3); assert.ok(firmas.ahoraTu.size >= 3);
    for (const s of firmas.resuelve) assert.ok(!firmas.ahoraTu.has(s), 'Resuelve repite Ahora tú');
  });
}

test('impulso/sistema: el analizador rechaza igualdades y resultados alterados', () => {
  assert.throws(() => igualdades('2 · (3 − 5) = 4 N·s'));
  assert.throws(() => cerca(4, q(-4), 'signo alterado'));
  const s = { familia: 'sistema', tipo: 'retroceso', mA: 2, mB: 4, vA: -3 };
  assert.throws(() => verificarBalance(s, -1.5));
  const i = { familia: 'impulso', tipo: 'fuerza', m: 0.5, vi: 4, vf: -2, dt: 0.2 };
  assert.throws(() => verificarBalance(i, -5));
});

test('impulso/sistema: misiones y lecturas en toda la grilla de controles', { skip: parcial ? 'El fragmento solo contiene bancos; se exige en la unidad integrada.' : false }, () => {
  for (const id of ids) {
    const j = def.ideas.find(i => i.id === id).juega; assert.ok(j.mision && j.controles);
    const inicio = Object.fromEntries(j.controles.map(c => [c.id, c.inicio])); assert.equal(Boolean(j.mision.logrado(inicio)), false);
    const grilla = j.controles.reduce((casos, c) => {
      let valores;
      if (Array.isArray(c.opciones)) valores = c.opciones.map(o => typeof o === 'object' ? (o.valor ?? o.value ?? o.id) : o);
      else { assert.ok(c.paso > 0 && Number.isFinite(c.min) && Number.isFinite(c.max)); valores = Array.from({ length: Math.round((c.max - c.min) / c.paso) + 1 }, (_, n) => Number((c.min + n * c.paso).toFixed(9))); }
      return casos.flatMap(s => valores.map(v => ({ ...s, [c.id]: v })));
    }, [{}]);
    let logros = 0;
    for (const val of grilla) {
      const esperadoLogro = id === 'impulso' ? Math.abs(q(4).add(q(val.F).mul(0.5).div(0.5)).number()) < 1e-10 : Math.abs(q(val.c).mul(10).number() - 2) < 1e-10;
      assert.equal(Boolean(j.mision.logrado(val)), esperadoLogro, id + ' misión ' + JSON.stringify(val)); if (esperadoLogro) logros++;
      const lectura = j.lectura(val); assert.doesNotMatch(plano(lectura), /NaN|undefined|\[object Object\]/); igualdades(lectura);
      const ns = numeros(lectura);
      if (id === 'impulso') {
        const vf = q(4).add(q(val.F).mul(0.5).div(0.5)).number();
        assert.ok(ns.some(n => Math.abs(n - vf) < 1e-9), 'La lectura omite la velocidad final calculada');
        assert.match(plano(lectura), vf === 0 ? /Queda en reposo/ : vf > 0 ? /Avanza hacia la derecha/ : /Retrocede hacia la izquierda/);
      } else {
        const rotulos = j.dibujo(val).datos.textos.filter(r => r.y > 180 && /^v_[AB],x/.test(r.texto));
        assert.equal(rotulos.length, 2);
        for (const [k, v] of [-10 * val.c, 10 * val.c].entries()) {
          assert.match(rotulos[k].texto, /m\/s/);
          assert.ok(numeros(rotulos[k].texto).some(n => Math.abs(n - v) < 1e-9), 'La figura no coincide con los dos movimientos');
        }
        assert.ok(ns.includes(0), 'La lectura debe indicar el total nulo');
        assert.match(plano(lectura), /Salen en sentidos opuestos; el total es 0 kg·m\/s/);
      }
    }
    assert.ok(logros > 0, id + ': misión imposible');
  }
});

test('impulso/sistema: predicciones, Mira y condiciones físicas estáticas', { skip: parcial ? 'El fragmento no contiene momentos.' : false }, () => {
  const imp = def.ideas.find(i => i.id === 'impulso'), sis = def.ideas.find(i => i.id === 'conservacion');
  const deltaP = q(0.5).mul(0).sub(q(0.5).mul(8)), fa = deltaP.div(0.2), fb = deltaP.div(0.4);
  const vb = q(0).sub(q(1).mul(-3)).div(3);
  const mapas = [
    [imp, { c: fb, 'mismo-tiempo': fa, 'doble-fuerza': fa.mul(2), signo: fb.neg() }, 'N'],
    [sis, { c: vb, 'misma-rapidez': q(-3).abs(), signo: vb.neg(), proporcional: q(3).mul(3) }, 'm/s'],
  ];
  for (const [idea, mapa, unidad] of mapas) {
    const opciones = idea.predice.opciones; assert.equal(opciones.filter(o => o.correcta).length, 1);
    const valores = opciones.map(o => valorVisible(o.texto)); assert.equal(new Set(valores).size, opciones.length);
    assert.equal(valores.filter(n => Math.abs(n - mapa.c.number()) < 1e-9).length, 1);
    for (const o of opciones) {
      assert.ok(Object.hasOwn(mapa, o.id), 'Predice sin oráculo: ' + o.id); cerca(valorVisible(o.texto), mapa[o.id]);
      assert.ok(plano(o.texto).includes(unidad));
      if (!o.correcta) { assert.match(plano(o.siFuera), /^Bien /); igualdades(o.siFuera); }
    }
    for (const x of [idea.lee.tarjetas, idea.predice.datos, idea.predice.coincide, idea.mira.pasos, idea.regla]) {
      assert.doesNotMatch(plano(x), /NaN|undefined|\[object Object\]/); igualdades(x);
    }
  }
  cerca(fb.abs().mul(2).number(), fa.abs(), 'La segunda fuerza media tiene mitad de módulo');
  cerca(fa.mul(0.2).number(), fb.mul(0.4), 'Los impulsos de ambos frenados son iguales');
  cerca(q(1).mul(-3).add(q(3).mul(vb)).number(), 0, 'La separación conserva el total');
  assert.match(plano(imp.predice.coincide), /media/); assert.doesNotMatch(plano(imp.predice.coincide), /máxima.*mitad|mitad.*máxima/);
  assert.match(plano(sis.predice.datos), /impulso externo horizontal.*despreciable/);
});
