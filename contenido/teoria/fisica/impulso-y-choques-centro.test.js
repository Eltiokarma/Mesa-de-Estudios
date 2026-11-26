'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const def = require(process.env.CENTRO_FUENTE || './impulso-y-choques.js');
const idea = def.ideas.find(i => i.id === 'centro-masa');

// Oráculo independiente: fracciones exactas y momentos respecto a un cuerpo,
// en vez de reutilizar el promedio de productos del código de contenido.
const abs = a => a < 0n ? -a : a;
function gcd(a, b) { a = abs(a); b = abs(b); while (b) [a, b] = [b, a % b]; return a || 1n; }
function frac(p, q = 1n) { if (q < 0n) { p = -p; q = -q; } const d = gcd(p, q); return { p: p / d, q: q / d }; }
function r(x) {
  if (x && typeof x === 'object' && 'p' in x) return x;
  const s = String(x), k = (s.split('.')[1] || '').length;
  return frac(BigInt(s.replace('.', '')), 10n ** BigInt(k));
}
const add = (a, b) => { a = r(a); b = r(b); return frac(a.p * b.q + b.p * a.q, a.q * b.q); };
const sub = (a, b) => { b = r(b); return add(a, frac(-b.p, b.q)); };
const mul = (a, b) => { a = r(a); b = r(b); return frac(a.p * b.p, a.q * b.q); };
const div = (a, b) => { a = r(a); b = r(b); assert.notEqual(b.p, 0n); return frac(a.p * b.q, a.q * b.p); };
const sum = xs => xs.reduce(add, r(0));
const numero = a => Number(a.p) / Number(a.q);
function centro(m, xs) {
  const origen = xs[0];
  return add(origen, div(sum(xs.map((x, i) => mul(m[i], sub(x, origen)))), sum(m)));
}
function entradas(c) {
  return {
    m: c.masas.map(z => z == null ? null : div(z, c.unidadM === 'g' ? 1000 : 1)),
    x: c.posiciones && c.posiciones.map(z => z == null ? null : div(z, c.unidadX === 'cm' ? 100 : 1)),
    v: c.velocidades && c.velocidades.map(r),
  };
}
function esperado(c) {
  const { m, x, v } = entradas(c);
  if (c.tipo === 'masa-faltante') return { valor: numero(div(mul(m[0], sub(c.objetivo, x[0])), sub(x[1], c.objetivo))), unidad: 'kg' };
  if (c.tipo === 'posicion-faltante') return { valor: numero(add(c.objetivo, mul(div(m[0], m[1]), sub(c.objetivo, x[0])))), unidad: 'm' };
  if (c.tipo === 'velocidad') return { valor: numero(centro(m, v)), unidad: 'm/s' };
  if (c.tipo === 'evolucion') {
    // Extrapolación libre equivalente: al sumar momentos, las fuerzas internas
    // se cancelan. Estas posiciones virtuales NO son trayectorias individuales
    // reales si hay choques; su promedio sí da el CM con fuerza externa nula.
    // Se evalúa con fracciones exactas antes de promediar, a diferencia del motor.
    const finales = x.map((z, i) => add(z, mul(v[i], c.tiempo)));
    return { valor: numero(centro(m, finales)), unidad: 'm' };
  }
  return { valor: numero(centro(m, x)), unidad: 'm' };
}
function esperadoError(c, id) {
  const q = entradas(c), m = q.m.map(z => z == null ? null : numero(z));
  const x = q.x && q.x.map(z => z == null ? null : numero(z)), v = q.v && q.v.map(numero);
  const total = m.reduce((a, b) => a + (b || 0), 0), bueno = esperado(c).valor;
  const media = a => a.reduce((s, z) => s + z, 0) / a.length;
  const momento = a => a.reduce((s, z, i) => s + m[i] * z, 0);
  const invertido = a => a.reduce((s, z, i) => s + m[m.length - 1 - i] * z, 0) / total;
  let tabla;
  if (c.tipo === 'masa-faltante') tabla = {
    'razon-inversa': m[0] * (x[1] - c.objetivo) / (c.objetivo - x[0]),
    'sin-distancias': m[0], 'sin-restar': m[0] * c.objetivo / x[1],
    'sin-divisor': m[0] * (c.objetivo - x[0]), 'doble-masa': 2 * bueno,
  };
  else if (c.tipo === 'posicion-faltante') tabla = {
    'media-simple': 2 * c.objetivo - x[0], 'sin-restar': total * c.objetivo / m[1],
    'sin-divisor': total * c.objetivo - m[0] * x[0],
    'masa-intercambiada': (total * c.objetivo - m[1] * x[0]) / m[0], signo: -bueno,
  };
  else if (c.tipo === 'evolucion') {
    const inicial = numero(centro(q.m, q.x)), vc = numero(centro(q.m, q.v));
    tabla = { 'media-simple': media(x) + media(v) * c.tiempo, 'sin-origen': vc * c.tiempo,
      'sin-tiempo': inicial + vc, signo: inicial - vc * c.tiempo, 'sin-divisor': inicial + momento(v) * c.tiempo };
  } else if (c.tipo === 'velocidad') tabla = {
    'media-simple': media(v), 'sin-divisor': momento(v), 'doble-masa': bueno / 2,
    signo: -bueno, 'masa-intercambiada': invertido(v),
  };
  else tabla = { 'media-simple': media(x), 'sin-divisor': momento(x), 'doble-masa': bueno / 2,
    'masa-intercambiada': invertido(x), 'sin-origen': momento(x) / m.filter((_, i) => x[i] !== 0).reduce((a, b) => a + b, 0), signo: -bueno };
  assert.ok(Object.hasOwn(tabla, id), 'Error nuevo sin cálculo independiente: ' + id);
  return tabla[id];
}
function plano(x) {
  if (x == null) return '';
  if (typeof x !== 'object') return String(x);
  if (Array.isArray(x)) return x.map(plano).join('');
  if (x.frac) return '(' + plano(x.frac[0]) + ')/(' + plano(x.frac[1]) + ')';
  if (x.sub) return plano(x.sub[0]) + '_' + plano(x.sub[1]);
  if (x.sup) return '(' + plano(x.sup[0]) + ')^(' + plano(x.sup[1]) + ')';
  if (x.vec) return plano(x.vec);
  if (x.negrita) return plano(x.negrita);
  if (x.t != null) return plano(x.t);
  return Object.values(x).map(plano).join(' ');
}
function numeros(x) {
  return (plano(x).replace(/−/g, '-').replace(/(\d)[ \u00a0\u202f](?=\d{3}(?:\D|$))/g, '$1').match(/-?\d+(?:[,.]\d+)?/g) || []).map(x => Number(x.replace(',', '.')));
}
const valorTexto = x => { const ns = numeros(x); assert.ok(ns.length); return ns[ns.length - 1]; };
const cerca = (a, b, mensaje) => assert.ok(Math.abs(a - b) <= 0.00050001, `${mensaje}: ${a} frente a ${b}`);
function comprobarRespuesta(texto, c) {
  const e = esperado(c), t = plano(texto);
  cerca(valorTexto(t), e.valor, 'Respuesta incorrecta');
  assert.ok(t.endsWith(e.unidad), 'Falta unidad ' + e.unidad + ': ' + t);
  if (Math.abs(e.valor * 1000 - Math.round(e.valor * 1000)) > 1e-7) assert.ok(t.includes('≈'), 'Redondeo sin ≈');
}
function firma(c) { return JSON.stringify(['tipo', 'masas', 'posiciones', 'velocidades', 'objetivo', 'tiempo', 'unidadM', 'unidadX'].map(k => [k, c[k]])); }

// Analizador aritmético separado para las cuentas numéricas que se muestran.
function evaluar(t) {
  const tokens = t.replace(/,/g, '.').replace(/[−]/g, '-').replace(/[·×]/g, '*').replace(/÷/g, '/').match(/\d+(?:\.\d+)?|[()+\-*/^]/g) || [];
  let i = 0;
  function atom() {
    if (tokens[i] === '(') { i++; const n = suma(); assert.equal(tokens[i++], ')'); return n; }
    const n = Number(tokens[i++]); assert.ok(Number.isFinite(n), t); return n;
  }
  function unary() { if (tokens[i] === '-') { i++; return -unary(); } if (tokens[i] === '+') { i++; return unary(); } const a = atom(); if (tokens[i] !== '^') return a; i++; return a ** unary(); }
  function producto() { let n = unary(); while (['*', '/'].includes(tokens[i])) { const op = tokens[i++], b = unary(); n = op === '*' ? n * b : n / b; } return n; }
  function suma() { let n = producto(); while (['+', '-'].includes(tokens[i])) { const op = tokens[i++], b = producto(); n = op === '+' ? n + b : n - b; } return n; }
  const n = suma(); assert.equal(i, tokens.length); return n;
}
function igualdades(obj) {
  if (!obj || typeof obj !== 'object') return;
  if (obj.ecuacion) {
    const t = plano(obj.ecuacion).replace(/(\d)[ \u00a0\u202f](?=\d{3}(?:\D|$))/g, '$1');
    for (let k = 0; k < t.length; k++) if (t[k] === '=') {
      let a = k, b = k + 1;
      const ar = c => c != null && /[\d\s.,()+\-−·×*/÷^]/.test(c);
      while (a > 0 && ar(t[a - 1])) a--;
      while (b < t.length && ar(t[b])) b++;
      const izq = t.slice(a, k).trim(), der = t.slice(k + 1, b).trim();
      // El (0) de x_CM(0) es un argumento, no una cuenta que se iguala a x_CM.
      // Sus valores se verifican con el oráculo del caso y la evolución de cuerpos.
      if (a > 0 && /[\p{L}_]/u.test(t[a - 1])) continue;
      if (/\d/.test(izq) && /\d/.test(der)) assert.ok(Math.abs(evaluar(izq) - evaluar(der)) < 1e-9, 'Igualdad falsa: ' + t);
    }
  }
  for (const [k, v] of Object.entries(obj)) if (k !== 'ecuacion' && typeof v === 'object') igualdades(v);
}

function afirmaciones(c) {
  const e = esperado(c), { m, x, v } = entradas(c);
  if (c.tipo === 'masa-faltante') {
    assert.ok(e.valor > 0, 'Masa imposible');
    const centroRepuesto = centro([m[0], r(e.valor)], x);
    cerca(numero(centroRepuesto), c.objetivo, 'Masa que no sitúa el centro');
  } else if (c.tipo === 'posicion-faltante') {
    cerca(numero(centro(m, [x[0], r(e.valor)])), c.objetivo, 'Posición que no sitúa el centro');
  } else {
    const valores = c.tipo === 'velocidad' ? v.map(numero) : c.tipo === 'evolucion' ? x.map((z, i) => numero(add(z, mul(v[i], c.tiempo)))) : x.map(numero);
    assert.ok(e.valor >= Math.min(...valores) - 1e-9 && e.valor <= Math.max(...valores) + 1e-9,
      c.tipo === 'evolucion' ? 'El promedio sale del intervalo de la extrapolación libre equivalente' : 'El CM sale del intervalo de cuerpos');
    const balance = valores.reduce((s, z, i) => s + numero(m[i]) * (z - e.valor), 0);
    assert.ok(Math.abs(balance) < 1e-7, 'Los momentos respecto al CM no se equilibran');
    if (c.tipo === 'evolucion') {
      const xc = centro(m, x), vc = centro(m, v);
      cerca(e.valor, numero(add(xc, mul(vc, c.tiempo))), 'No coincide evolucionar cuerpos con evolucionar el CM');
    }
  }
}

function pasosComprobados(q, c) {
  const { m, x, v } = entradas(c);
  const bloques = q.pasos || (Array.isArray(q.solucion) ? q.solucion : [q.solucion]);
  for (const paso of bloques) {
    if (!paso || !paso.ecuacion) continue;
    const ecuacion = plano(paso.ecuacion).replace(/(\d)[ \u00a0\u202f](?=\d{3}(?:\D|$))/g, '$1');
    let esperadoPaso;
    if (ecuacion.startsWith('x_CM(0)')) esperadoPaso = numero(centro(m, x));
    else if (ecuacion.startsWith('v_CM,x')) esperadoPaso = numero(centro(m, v));
    else if (/^(?:x_CM|x_B|m_B)/.test(ecuacion)) esperadoPaso = esperado(c).valor;
    if (esperadoPaso !== undefined) {
      cerca(valorTexto(ecuacion), esperadoPaso, 'El paso no coincide con sus datos: ' + ecuacion);
      if (Math.abs(esperadoPaso * 1000 - Math.round(esperadoPaso * 1000)) > 1e-7) assert.ok(ecuacion.includes('≈'), 'Paso redondeado con =');
    }
    // Conversiones escritas, también cuando aparecen varias en la misma línea.
    const re = /([−-]?\d+(?:,\d+)?)\s+(g|cm)\s*=\s*([−-]?\d+(?:,\d+)?)\s+(kg|m)/g;
    for (const match of ecuacion.matchAll(re)) {
      const a = Number(match[1].replace('−', '-').replace(',', '.'));
      const b = Number(match[3].replace('−', '-').replace(',', '.'));
      assert.equal(a / (match[2] === 'g' ? 1000 : 100), b, 'Conversión impresa incorrecta');
    }
  }
}

test('centro de masa: quince ejemplos, cinco por nivel y letras A–E repartidas', () => {
  assert.equal(idea.ejemplos.length, 15);
  for (const n of [1, 2, 3]) assert.equal(idea.ejemplos.filter(e => e.nivel === n).length, 5);
  const letras = [];
  for (const e of idea.ejemplos) {
    comprobarRespuesta(e.respuesta, e.verificacion); afirmaciones(e.verificacion); igualdades(e.solucion); pasosComprobados(e, e.verificacion);
    assert.ok(e.datos.length > 0 && e.datos.length <= 6);
    assert.ok(e.solucion.length <= 4);
    if (e.nivel === 3) {
      const ns = e.alternativas.map(valorTexto), valor = esperado(e.verificacion).valor;
      const hits = ns.flatMap((v, i) => Math.abs(v - valor) <= 0.00050001 ? [i] : []);
      assert.equal(new Set(ns).size, 5); assert.equal(hits.length, 1); letras.push(hits[0]);
      const ids = e.verificacion.tipo === 'evolucion' ? ['media-simple', 'sin-origen', 'sin-tiempo', 'signo', 'sin-divisor'] :
        e.verificacion.tipo === 'masa-faltante' ? ['razon-inversa', 'sin-distancias', 'sin-restar', 'sin-divisor', 'doble-masa'] :
          ['media-simple', 'sin-divisor', 'doble-masa', 'masa-intercambiada', 'sin-origen', 'signo'];
      for (const [i, n] of ns.entries()) if (i !== hits[0]) {
        assert.ok(ids.some(id => Math.abs(esperadoError(e.verificacion, id) - n) <= 0.00050001), 'Alternativa sin error que la produzca');
      }
    }
  }
  assert.deepEqual(letras.sort(), [0, 1, 2, 3, 4]);
});

test('centro de masa: 400 semillas por generador con cada error y afirmación comprobados aparte', () => {
  const firmas = { resuelve: new Set(), ahoraTu: new Set() }, ejemplos = new Set(idea.ejemplos.map(e => firma(e.verificacion)));
  for (let s = 0; s < 400; s++) for (const momento of ['resuelve', 'ahoraTu']) {
    const q = idea[momento].generar(s), c = q.verificacion, f = firma(c);
    if (c.tipo === 'evolucion') assert.match(plano(q.pregunta || q.enunciado), /fuerza externa horizontal neta.*nula durante todo el intervalo/);
    firmas[momento].add(f); afirmaciones(c); igualdades(q); pasosComprobados(q, c);
    assert.ok(!ejemplos.has(f), 'Se repite un ejemplo');
    assert.doesNotMatch(plano(q), /NaN|undefined|\[object Object\]/);
    assert.ok(q.datos.length > 0 && q.datos.length <= 6);
    if (momento === 'resuelve') { comprobarRespuesta(q.respuesta, c); assert.ok(q.pasos.length <= 6); continue; }
    const numerosOpciones = q.opciones.map(o => valorTexto(o.texto)), bien = esperado(c).valor;
    if (c.tipo === 'evolucion') {
      const e = entradas(c), ns = numeros(q.solucion.texto);
      assert.equal(ns.length, 2, 'La solución debe mostrar posición y velocidad iniciales del centro');
      cerca(ns[0], numero(centro(e.m, e.x)), 'Posición inicial afirmada en la solución');
      cerca(ns[1], numero(centro(e.m, e.v)), 'Velocidad afirmada en la solución');
    }
    assert.equal(new Set(numerosOpciones).size, q.opciones.length);
    assert.equal(q.opciones.filter(o => o.correcta).length, 1);
    assert.equal(numerosOpciones.filter(n => Math.abs(n - bien) < 0.00050001).length, 1);
    for (const o of q.opciones) {
      const num = o.correcta ? bien : esperadoError(c, o.id);
      cerca(valorTexto(o.texto), num, `semilla ${s}, ${o.id}`);
      if (!o.correcta) {
        assert.match(o.siFuera, /^Bien /);
        cerca(valorTexto(o.siFuera), num, 'siFuera no justifica su propio valor');
      }
    }
  }
  assert.ok(firmas.resuelve.size >= 3 && firmas.ahoraTu.size >= 3);
  for (const f of firmas.resuelve) assert.ok(!firmas.ahoraTu.has(f), 'Resuelve y Ahora tú repiten caso');
});

test('centro de masa: misión recorrida por fuerza bruta y sin respuesta cumplida al abrir', () => {
  const juego = idea.juega;
  assert.equal(juego.mision.logrado({ mB: 1, xB: 2 }), false);
  const logros = [];
  for (let mB = 1; mB <= 4; mB++) for (let xB = 2; xB <= 6; xB++) {
    const xc = numero(centro([r(2), r(mB)], [r(0), r(xB)]));
    const cumple = Math.abs(xc - 4) < 1e-9;
    assert.equal(juego.mision.logrado({ mB, xB }), cumple);
    if (cumple) logros.push({ mB, xB });
    const lectura = juego.lectura({ mB, xB });
    cerca(valorTexto(lectura), xc, 'Lectura del centro');
    assert.ok(xc > 0 && xc < xB, 'Debe estar entre masas positivas');
  }
  assert.deepEqual(logros, [{ mB: 4, xB: 6 }]);
});

test('centro de masa: el resorte no borra la traslación inicial del sistema', () => {
  assert.match(plano(idea.predice.datos), /Resorte de masa despreciable/);
  const opciones = idea.predice.opciones;
  const valores = { c: numero(centro([r(2), r(4)], [r(3), r(3)])), reposo: 0, 'suma-velocidades': 3 + 3, 'doble-masa': (2 * 3 + 4 * 3) / (2 * (2 + 4)) };
  assert.equal(opciones.filter(o => o.correcta).length, 1);
  assert.equal(new Set(opciones.map(o => valorTexto(o.texto))).size, opciones.length);
  for (const o of opciones) {
    cerca(valorTexto(o.texto), valores[o.id], 'Predice ' + o.id);
    if (!o.correcta) cerca(valorTexto(o.siFuera), valores[o.id], 'Predice siFuera ' + o.id);
  }
  for (const f of [idea.predice.dibujo, idea.predice.revelar, ...idea.mira.datos.cortes.map(datos => ({ datos }))]) {
    assert.match(f.datos.alt, /instante anterior a la separación/);
    assert.ok(f.datos.textos.some(t => t.texto === 'Velocidades antes de separarse.'));
    for (const t of f.datos.textos.filter(t => /v_[AB],x/.test(t.texto))) assert.match(t.texto, /^Antes:/);
  }
});
