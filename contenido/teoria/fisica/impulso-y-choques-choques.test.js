'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const def = process.env.MESA_CHOQUES_FRAGMENTO ? require(path.resolve(process.env.MESA_CHOQUES_FRAGMENTO)) : require('./impulso-y-choques.js');
const ideas = ['elastico-inelastico', 'restitucion'].map(id => def.ideas.find(x => x.id === id));

function texto(x) {
  if (x == null) return '';
  if (typeof x !== 'object') return String(x);
  if (Array.isArray(x)) return x.map(texto).join('');
  if ('t' in x) return texto(x.t);
  if (x.sub) return texto(x.sub[0]) + '_' + texto(x.sub[1]);
  if (x.sup) return '(' + texto(x.sup[0]) + ')^(' + texto(x.sup[1]) + ')';
  if (x.frac) return '((' + texto(x.frac[0]) + ')/(' + texto(x.frac[1]) + '))';
  if (x.raiz) return '√(' + texto(x.raiz) + ')';
  if (x.vec) return texto(x.vec);
  if (x.negrita) return texto(x.negrita);
  return '';
}
function numero(x) {
  const s = texto(x).replace(/−/g, '-').replace(/(\d)[ \u00a0\u202f](?=\d{3}(?:\D|$))/g, '$1').replace(/,/g, '.');
  const encontrados = [...s.matchAll(/[-+]?\d+(?:\.\d+)?/g)];
  assert.ok(encontrados.length, 'Falta número: ' + s);
  return Number(encontrados.at(-1)[0]);
}
function cerca(a, b, lugar, tolerancia = 1e-8) {
  assert.ok(Number.isFinite(a) && Number.isFinite(b), lugar + ': valor no finito');
  assert.ok(Math.abs(a - b) <= tolerancia, `${lugar}: ${a} no coincide con ${b}`);
}
// Auditoría (26 nov): las alternativas ya no llevan «≈» (delataba la correcta); se exige solo en explicaciones.
function valorMostrado(n, original, lugar, exigeAprox = true) {
  const t = texto(original), red = Math.round(n * 1000) / 1000;
  cerca(numero(original), red, lugar, 1e-8);
  if (exigeAprox && Math.abs(n - red) > 1e-8) assert.ok(t.includes('≈'), lugar + ': falta ≈ para un redondeo');
}

// Oráculo separado: pasa primero al sistema del centro de masa. La velocidad
// relativa se invierte y escala; de allí se recuperan las salidas de cada cuerpo.
function fisica(c) {
  const masa = (c.a || 0) + (c.b || 0);
  const centro = masa ? (c.a * c.u + c.b * c.w) / masa : 0;
  const reducida = masa ? c.a * c.b / masa : 0;
  const entrada = masa ? (c.a * c.u ** 2 + c.b * c.w ** 2) / 2 : 0;
  const relativa = (c.u || 0) - (c.w || 0);
  const ecoef = c.tipo.startsWith('elastico') ? 1 : c.e;
  const aFinal = masa ? centro - c.b / masa * ecoef * relativa : 0;
  const bFinal = masa ? centro + c.a / masa * ecoef * relativa : 0;
  let esperado, unidad;
  if (c.tipo === 'union') { esperado = centro; unidad = 'm/s'; }
  else if (c.tipo === 'perdida') { esperado = reducida * relativa ** 2 / 2; unidad = 'J'; }
  else if (c.tipo === 'subida') { esperado = (masa * centro ** 2 / 2) / (masa * 10); unidad = 'm'; }
  else if (c.tipo === 'frenado') { esperado = (masa * centro ** 2 / 2) / (c.mu * masa * 10); unidad = 'm'; }
  else if (c.tipo.endsWith('-a')) { esperado = aFinal; unidad = 'm/s'; }
  else if (c.tipo.endsWith('-b')) { esperado = bFinal; unidad = 'm/s'; }
  else if (c.tipo === 'e-relativo') { esperado = Math.abs(c.vb - c.va) / Math.abs(c.u - c.w); unidad = ''; }
  else if (c.tipo === 'salida-pared') { esperado = c.U * c.e; unidad = 'm/s'; }
  else if (c.tipo === 'altura') { esperado = (c.e * Math.sqrt(20 * c.H)) ** 2 / 20; unidad = 'm'; }
  else if (c.tipo === 'e-altura') { esperado = Math.sqrt(20 * c.h) / Math.sqrt(20 * c.H); unidad = ''; }
  else if (c.tipo === 'rebote-tiempo') { esperado = Math.sqrt(8 * c.e * c.e * c.H / 10); unidad = 's'; }
  else assert.fail('Familia sin oráculo: ' + c.tipo);
  return { esperado, unidad, masa, centro, reducida, entrada, relativa, aFinal, bFinal };
}
function errorEsperado(c, id) {
  const q = fisica(c), v = q.centro, r = q.esperado, M = q.masa, Ki = q.entrada, Kf = M * v * v / 2;
  const fac = c.tipo === 'frenado' ? c.mu : 1, e = c.tipo === 'e-altura' ? Math.sqrt(c.h / c.H) : c.e;
  const U = c.U || Math.sqrt(20 * c.H), Vr = e * U;
  const esA = c.tipo.endsWith('-a');
  const map = {
    'sin-b': c.a * c.u / M,
    rapideces: (c.a * Math.abs(c.u) + c.b * Math.abs(c.w)) / M,
    'solo-masa-a': M * v / c.a,
    promedio: (c.u + c.w) / 2,
    'sin-dividir': M * v,
    signo: -v,
    'doble-masa': v / 2,
    'energia-inicial': Ki,
    'energia-final': Kf,
    'resta-invertida': Kf - Ki,
    'masa-total-relativa': M * q.relativa ** 2 / 2,
    'solo-a-relativa': c.a * q.relativa ** 2 / 2,
    'velocidad-llegada': c.u ** 2 / (20 * fac),
    'sin-mitad': v ** 2 / (10 * fac),
    'sin-cuadrado': Math.abs(v) / (20 * fac),
    'energia-antes': Ki / (M * 10 * fac),
    'masa-extra': v ** 2 / (20 * M * fac),
    'sin-roce': v ** 2 / 20,
    adhesion: v,
    intercambio: esA ? q.bFinal : q.aFinal,
    'sin-interaccion': esA ? c.u : c.w,
    'piso-fijo': (esA ? -1 : 1) * (c.tipo.startsWith('elastico') ? 1 : c.e) * c.u,
    'signo-final': -r,
    elasticidad: esA ? v - c.b / M * q.relativa : v + c.a / M * q.relativa,
    'media-separacion': esA ? v - c.b / M * q.relativa / 2 : v + c.a / M * q.relativa / 2,
    'velocidad-sola': c.vb / c.u,
    'otro-cuerpo': Math.abs(c.va / c.u),
    inversa: 1 / r,
    'suma-llegadas': (c.vb - c.va) / (c.u + c.w),
    'orden-resta': -r,
    complemento: (1 - c.e) * c.U,
    'inversa-e': c.U / c.e,
    'e-cuadrado': c.e ** 2 * c.U,
    'sin-restitucion': c.U,
    'suma-e': (1 + c.e) * c.U,
    'sin-raiz': c.h / c.H,
    'alturas-invertidas': c.H / c.h,
    'raiz-invertida': Math.sqrt(c.H / c.h),
    'fraccion-perdida': 1 - c.h / c.H,
    'complemento-e': 1 - r,
    'e-lineal': e * c.H,
    'altura-inversa': c.H / (e * e),
    'altura-perdida': (1 - e * e) * c.H,
    'complemento-altura': (1 - e) * c.H,
    'doble-altura': 2 * e * e * c.H,
    'solo-subida': Vr / 10,
    'caida-inicial': U / 10,
    'tiempo-con-e2': 2 * e * e * U / 10,
    'sin-perdida': U / 5,
    'dos-gravedades': Vr / 50,
  };
  assert.ok(Object.hasOwn(map, id), 'Error sin verificación independiente: ' + id);
  return map[id];
}

// Evalúa solo expresiones numéricas escritas. Nunca ejecuta texto de la unidad.
function calcular(exp) {
  const s = exp.replace(/−/g, '-').replace(/,/g, '.').replace(/½/g, '(1/2)').replace(/²/g, '^2').replace(/[·×]/g, '*').replace(/÷/g, '/');
  const tokens = s.match(/\d+(?:\.\d+)?|[+\-*/^()√]/g) || [];
  assert.equal(tokens.join(''), s.replace(/\s/g, ''), 'Expresión no numérica: ' + s);
  let i = 0;
  function primario() {
    const t = tokens[i++];
    if (t === '(') { const n = suma(); assert.equal(tokens[i++], ')'); return n; }
    if (t === '√') return Math.sqrt(unario());
    assert.match(t || '', /^\d/); return Number(t);
  }
  function potencia() { let v = primario(); if (tokens[i] === '^') { i++; v **= unario(); } return v; }
  function unario() { if (tokens[i] === '-') { i++; return -unario(); } if (tokens[i] === '+') { i++; return unario(); } return potencia(); }
  function producto() { let v = unario(); while (['*', '/'].includes(tokens[i])) { const op = tokens[i++], n = unario(); v = op === '*' ? v * n : v / n; } return v; }
  function suma() { let v = producto(); while (['+', '-'].includes(tokens[i])) { const op = tokens[i++], n = producto(); v = op === '+' ? v + n : v - n; } return v; }
  const out = suma(); assert.equal(i, tokens.length); return out;
}
function igualdades(x) {
  const s = texto(x).replace(/(\d)[ \u00a0\u202f](?=\d{3}(?:\D|$))/g, '$1');
  const numeric = ch => ch !== undefined && /[\d\s.,()+−\-·×*/÷^²√½]/.test(ch);
  for (let k = 0; k < s.length; k++) {
    if (s[k] !== '=' && s[k] !== '≈') continue;
    let l = k, r = k + 1;
    while (l > 0 && numeric(s[l - 1])) l--;
    while (r < s.length && numeric(s[r])) r++;
    const a = s.slice(l, k).trim().replace(/^[.,]\s*/, ''), b = s.slice(k + 1, r).trim().replace(/[.,]$/, '');
    if (!/\d/.test(a) || !/\d/.test(b) || !/[+−\-·×*/÷^²√½]/.test(a)) continue;
    const izquierda = calcular(a), derecha = calcular(b);
    cerca(izquierda, derecha, `Igualdad ${a} ${s[k]} ${b}`, s[k] === '≈' ? 0.0015 : 1e-8);
  }
}
function verificarCaso(c, comprobante, nombre) {
  const q = fisica(c.verificacion);
  valorMostrado(q.esperado, comprobante, nombre, typeof comprobante !== 'string');
  assert.doesNotMatch(JSON.stringify(c), /NaN|undefined|\[object Object\]/);
  assert.ok(c.datos.length >= 1 && c.datos.length <= 6);
  if (q.unidad) assert.ok(texto(comprobante).includes(q.unidad), nombre + ': falta unidad');
  for (const paso of c.solucion ? Array.isArray(c.solucion) ? c.solucion : [c.solucion] : c.pasos || []) {
    igualdades(paso.ecuacion); igualdades(paso.texto);
  }
  const d = c.verificacion;
  if (d.a) {
    assert.ok(d.a > 0 && d.b > 0 && d.u > d.w, nombre + ': no hay aproximación inicial');
    if (d.tipo.includes('elastico') || d.tipo.startsWith('restitucion-')) {
      assert.ok(q.bFinal >= q.aFinal, nombre + ': no se separan');
      cerca(d.a * q.aFinal + d.b * q.bFinal, d.a * d.u + d.b * d.w, nombre + ': cantidad total');
      if (d.tipo.startsWith('elastico')) cerca((d.a * q.aFinal ** 2 + d.b * q.bFinal ** 2) / 2, q.entrada, nombre + ': energía elástica');
    }
    if (d.tipo === 'perdida') assert.ok(q.esperado > 0, nombre + ': pérdida no positiva');
    if (['subida', 'frenado'].includes(d.tipo)) assert.ok(q.centro > 0, nombre + ': salida no hacia la etapa siguiente');
    if (d.tipo === 'e-relativo') {
      cerca(d.a * d.va + d.b * d.vb, d.a * d.u + d.b * d.w, nombre + ': velocidades realizables');
      assert.ok(d.vb >= d.va && q.esperado <= 1, nombre + ': separación pasiva');
    }
  }
  if (d.e != null) assert.ok(d.e >= 0 && d.e <= 1, nombre + ': impacto activo no declarado');
  if (d.H != null) assert.ok(d.H > 0 && (d.h == null || d.h >= 0 && d.h <= d.H), nombre + ': alturas imposibles');
  if (d.tipo === 'frenado') {
    const condiciones = texto(c.datos);
    assert.match(condiciones, /ruedas bloqueadas/);
    assert.match(condiciones, /deslizan.*horizontal/);
  }
  if (d.tipo === 'rebote-tiempo') {
    const figura = c.dibujo || c.figura;
    assert.ok(figura.datos.textos.some(t => t.texto === 't_vuelo = ?'));
    assert.ok(!figura.datos.textos.some(t => t.texto === 'h = ?'));
    assert.match(figura.datos.alt, /tiempo de vuelo/);
  }
  if (c.solucion && !Array.isArray(c.solucion)) {
    const numerosDelTexto = [...texto(c.solucion.texto).replace(/−/g, '-').replace(/,/g, '.').matchAll(/[-+]?\d+(?:\.\d+)?/g)].map(m => Number(m[0]));
    const intermedios = ['perdida', 'subida', 'frenado'].includes(d.tipo) ? [q.centro]
      : d.tipo.startsWith('elastico') || d.tipo.startsWith('restitucion-') ? [d.a * d.u + d.b * d.w, (d.tipo.startsWith('elastico') ? 1 : d.e) * (d.u - d.w)]
        : d.tipo === 'rebote-tiempo' ? [Math.sqrt(20 * d.H), d.e * Math.sqrt(20 * d.H)] : [];
    for (const v of intermedios) assert.ok(numerosDelTexto.some(n => Math.abs(n - Math.round(v * 1000) / 1000) < 1e-8), nombre + ': afirmación intermedia incorrecta');
  }
  return q;
}

test('choques: treinta ejemplos, dificultad, alternativas y cálculos independientes', () => {
  for (const idea of ideas) {
    assert.ok(idea); assert.equal(idea.ejemplos.length, 15);
    for (const nivel of [1, 2, 3]) assert.equal(idea.ejemplos.filter(e => e.nivel === nivel).length, 5);
    const letras = [];
    idea.ejemplos.forEach((e, i) => {
      const q = verificarCaso(e, e.respuesta, `${idea.id}/ejemplo ${i + 1}`);
      assert.ok(e.solucion.length <= 4);
      if (e.nivel === 3) {
        assert.equal(e.alternativas.length, 5);
        const vals = e.alternativas.map(numero), correcta = Math.round(q.esperado * 1000) / 1000;
        assert.equal(new Set(vals).size, 5); assert.equal(vals.filter(v => Math.abs(v - correcta) < 1e-8).length, 1);
        letras.push(vals.findIndex(v => Math.abs(v - correcta) < 1e-8));
        const ids = {
          subida: ['velocidad-llegada', 'sin-mitad', 'sin-cuadrado', 'energia-antes'],
          frenado: ['velocidad-llegada', 'sin-mitad', 'sin-cuadrado', 'energia-antes'],
          perdida: ['energia-inicial', 'energia-final', 'resta-invertida', 'masa-total-relativa'],
          'rebote-tiempo': ['solo-subida', 'caida-inicial', 'tiempo-con-e2', 'sin-perdida'],
          'restitucion-a': ['adhesion', 'intercambio', 'sin-interaccion', 'piso-fijo'],
          'restitucion-b': ['adhesion', 'intercambio', 'sin-interaccion', 'piso-fijo'],
        }[e.verificacion.tipo];
        assert.ok(ids, 'Faltan errores de examen verificados');
        const valoresError = ids.map(id => Math.round(errorEsperado(e.verificacion, id) * 1000) / 1000).sort((a, b) => a - b);
        const otros = vals.filter(v => Math.abs(v - correcta) > 1e-8).sort((a, b) => a - b);
        otros.forEach((v, j) => cerca(v, valoresError[j], 'Alternativa de examen ' + i));
        for (const v of valoresError) assert.ok(texto(e.solucion.at(-1).texto).replace(/−/g, '-').replace(/,/g, '.').includes(String(v)), 'La explicación omite un error de examen');
      }
    });
    assert.deepEqual(letras.slice().sort(), [0, 1, 2, 3, 4]);
  }
});

test('choques: 400 semillas por momento, cada alternativa, explicación y caso físico', () => {
  const firmaDe = c => JSON.stringify(Object.keys(c).filter(k => k !== 'titulo').sort().map(k => [k, Math.round(c[k] * 1e9) / 1e9 || c[k]]));
  for (const idea of ideas) {
    const firmas = { resuelve: new Set(), ahoraTu: new Set() };
    const ejemplos = new Set(idea.ejemplos.map(e => firmaDe(e.verificacion)));
    for (let semilla = 0; semilla < 400; semilla++) for (const momento of ['resuelve', 'ahoraTu']) {
      const c = idea[momento].generar(semilla), nombre = `${idea.id}/${momento}/${semilla}`;
      const firma = firmaDe(c.verificacion); firmas[momento].add(firma);
      assert.ok(!ejemplos.has(firma), nombre + ': repite un ejemplo');
      if (momento === 'resuelve') { verificarCaso(c, c.respuesta, nombre); assert.ok(c.pasos.length <= 6); continue; }
      const correcta = c.opciones.filter(o => o.correcta); assert.equal(correcta.length, 1);
      const q = verificarCaso(c, correcta[0].texto, nombre), vals = c.opciones.map(o => numero(o.texto));
      assert.equal(new Set(vals).size, vals.length, nombre + ': alternativas repetidas');
      assert.equal(vals.filter(v => Math.abs(v - Math.round(q.esperado * 1000) / 1000) < 1e-8).length, 1);
      for (const op of c.opciones.filter(o => !o.correcta)) {
        const esperado = errorEsperado(c.verificacion, op.id);
        valorMostrado(esperado, op.texto, nombre + '/' + op.id, false);
        valorMostrado(esperado, op.siFuera, nombre + '/explicación ' + op.id);
        assert.match(op.siFuera, /^Bien /);
        igualdades(op.siFuera);
      }
    }
    assert.ok(firmas.resuelve.size >= 3 && firmas.ahoraTu.size >= 3);
    for (const s of firmas.resuelve) assert.ok(!firmas.ahoraTu.has(s), 'Resuelve repite Ahora tú');
  }
});

test('choques: misiones por fuerza bruta y relaciones visibles durante el juego', () => {
  const [choque, rebote] = ideas; let n = 0;
  for (let b = 1; b <= 4; b++) for (let u = 2; u <= 6; u++) for (const t of [0, 0.25, 0.5, 1]) {
    const v = 2 * u / (2 + b), logrado = Math.abs(v - 3) < 1e-9;
    assert.equal(choque.juega.mision.logrado({ b, u, t }), logrado);
    if (logrado && t === 0) n++;
    const perdida = b / (2 + b) * u * u; assert.ok(perdida > 0);
    const lectura = texto(choque.juega.lectura({ b, u, t }));
    assert.match(lectura, /energía cinética disminuye/); valorMostrado(v, lectura.split('. La energía')[0], 'lectura del choque');
  }
  assert.equal(n, 1); let nr = 0;
  for (const e of [0.25, 0.5, 0.75, 1]) for (const t of [0, 0.25, 0.5, 1]) {
    const h = Math.pow(e * Math.sqrt(80), 2) / 20, logrado = Math.abs(h - 2.25) < 1e-8;
    assert.equal(rebote.juega.mision.logrado({ e, t }), logrado);
    if (logrado && t === 0) nr++;
    cerca(numero(rebote.juega.lectura({ e, t })), Math.round(h * 1000) / 1000, 'altura visible');
  }
  assert.equal(nr, 1);
  for (const idea of ideas) {
    const inicial = Object.fromEntries(idea.juega.controles.map(c => [c.id, c.inicio]));
    assert.equal(idea.juega.mision.logrado(inicial), false);
  }
});

test('choques: predicciones con una respuesta y errores numéricos explicados', () => {
  const esperado = [
    // Auditoría (26 nov): «energia» se cambió por «promedio» y la predicción de restitución pasó a e = 0,8.
    { c: (2 * 6 - 4 * 1.5) / 6, rapideces: (2 * 6 + 4 * 1.5) / 6, 'sin-b': 2 * 6 / 6, promedio: (6 - 1.5) / 2 },
    { c: (9.5 - 5.5) / (10 - 5), 'velocidad-sola': 9.5 / 10, 'otro-cuerpo': 5.5 / 10, inversa: (10 - 5) / (9.5 - 5.5) },
  ];
  ideas.forEach((idea, i) => {
    assert.equal(idea.predice.opciones.filter(o => o.correcta).length, 1);
    assert.equal(new Set(idea.predice.opciones.map(o => numero(o.texto))).size, 4);
    for (const op of idea.predice.opciones) {
      valorMostrado(esperado[i][op.id], op.texto, idea.id + '/Predice/' + op.id, false);
      if (!op.correcta) valorMostrado(esperado[i][op.id], op.siFuera, idea.id + '/siFuera/' + op.id);
    }
    for (const p of idea.mira.pasos) { igualdades(p.ecuacion); igualdades(p.texto); }
  });
});
