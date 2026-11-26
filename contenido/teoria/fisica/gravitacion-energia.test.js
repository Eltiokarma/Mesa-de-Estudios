'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const T = require('../../../nucleo/teoria.js');
const pieza = require('../../../nucleo/kit/piezas/fis-gravitacion.js');
const def = require(process.env.GR_ENERGIA_MODULE ? path.resolve(process.env.GR_ENERGIA_MODULE) : './gravitacion.js');
const idea = def.ideas.find(i => i.id === 'energia-gravitatoria');

// Oráculo por cuadratura del trabajo de F_r=-GMm/r². No usa ep(), ec() ni
// ningún motor del contenido. Integra hasta 2^48 r, con cola relativa <4e-15.
const X = [0.1834346424956498, 0.525532409916329, 0.7966664774136267, 0.9602898564975363];
const W = [0.362683783378362, 0.3137066458778873, 0.2223810344533745, 0.1012285362903763];
function integral(f, a, b) {
  const c = (a + b) / 2, h = (b - a) / 2;
  return h * X.reduce((s, x, i) => s + W[i] * (f(c - h * x) + f(c + h * x)), 0);
}
function potencial(GM, m, r) {
  assert.ok(GM > 0 && m > 0 && r > 0);
  let suma = 0;
  for (let k = 0; k < 48; k++) {
    const lo = r * 2 ** k, hi = lo * 2, mid = (lo + hi) / 2, f = x => -GM * m / (x * x);
    suma += integral(f, lo, mid) + integral(f, mid, hi);
  }
  return suma;
}
const cinetica = (m, v) => m * v * v * 0.5;
function raizMonotona(fn, target, lo, hi) {
  for (let i = 0; i < 110; i++) { const mid = (lo + hi) / 2; if (fn(mid) < target) lo = mid; else hi = mid; }
  return (lo + hi) / 2;
}
function cantidades(c) {
  const m = c.toneladas == null ? c.m : c.toneladas * 1000, r = c.r == null ? c.R + c.h : c.r;
  const u = (r, masa = m) => potencial(c.GM, masa, r);
  return { m, r, u };
}
function esperado(c) {
  const { m, r, u } = cantidades(c);
  if (c.tipo === 'cambio-dado') return c.Ep2 - c.Ep1;
  if (c.tipo === 'trabajo-dado') return -c.dEp;
  if (c.tipo === 'mecanica-dada') return c.Ec + c.Ep;
  if (['potencial', 'altura', 'toneladas'].includes(c.tipo)) return u(r) / 1e9;
  if (c.tipo === 'cambio') return (u(c.r2) - u(c.r1)) / 1e9;
  if (c.tipo === 'trabajo') return (u(c.r1) - u(c.r2)) / 1e9;
  if (c.tipo === 'tramos') return (u(c.r1) - u(c.r2) + u(c.r2) - u(c.r3)) / 1e9;
  if (c.tipo === 'mecanica') return (cinetica(m, c.v) + u(r)) / 1e9;
  if (c.tipo === 'distancia') return raizMonotona(x => u(x), c.EpGJ * 1e9, 1e3, 1e12) / 1000;
  if (c.tipo === 'masa-trabajo') return c.trabajoGJ * 1e9 / (u(c.r1, 1) - u(c.r2, 1));
  if (c.tipo === 'rapidez') {
    const inicial = cinetica(m, c.v1) + u(c.r1), final = x => cinetica(m, x) + u(c.r2);
    assert.ok(final(0) < inicial, 'La posición final debe ser alcanzable.');
    return raizMonotona(final, inicial, 0, 1e6) / 1000;
  }
  if (c.tipo === 'razon') {
    const GM = 1e14, m0 = -c.Ep0 * 100, r0 = 1e7;
    return potencial(GM * c.kM, m0 * c.km, r0 * c.kr) / 1e9;
  }
  assert.fail('Tipo sin oráculo: ' + c.tipo);
}
function errorEsperado(c, id) {
  const z = esperado(c), { m, r, u } = cantidades(c);
  if (id === 'resta-invertida' || id === 'signo') return -z;
  if (id === 'mitad' || id === 'medio') return z / 2;
  if (id === 'doble') return z * 2;
  if (id === 'nulo') return 0;
  if (id === 'radio-cuadrado') return z / r;
  if (id === 'sin-masa') return z / m;
  if (id === 'desde-superficie') return u(c.h) / 1e9;
  if (id === 'sin-toneladas') return z / 1000;
  if (id === 'sin-giga') return z / 1e9;
  if (id === 'sin-km') return z * 1000;
  if (id === 'raiz-extra') return Math.sqrt(z * 1000) / 1000;
  if (['suma-extremos', 'solo-inicial', 'solo-final', 'modulo'].includes(id)) {
    const uno = c.tipo === 'cambio-dado' ? c.Ep1 : u(c.r1) / 1e9;
    const dos = c.tipo === 'cambio-dado' ? c.Ep2 : u(c.tipo === 'tramos' ? c.r3 : c.r2) / 1e9;
    return id === 'suma-extremos' ? uno + dos : id === 'solo-inicial' ? uno : id === 'solo-final' ? dos : Math.abs(uno) + Math.abs(dos);
  }
  if (['potencial-positiva', 'solo-cinetica', 'solo-potencial', 'sin-medio'].includes(id) && c.tipo !== 'rapidez') {
    const pot = c.tipo === 'mecanica-dada' ? c.Ep : u(r) / 1e9;
    const cin = c.tipo === 'mecanica-dada' ? c.Ec : cinetica(m, c.v) / 1e9;
    return id === 'potencial-positiva' ? cin - pot : id === 'solo-cinetica' ? cin : id === 'solo-potencial' ? pot : 2 * cin + pot;
  }
  if (id === 'sin-medio') return z / Math.SQRT2;
  if (id === 'sin-inicial') return Math.sqrt(2 * (u(c.r1) - u(c.r2)) / m) / 1000;
  if (id === 'cambio-invertido') return Math.sqrt(c.v1 ** 2 + 2 * (u(c.r2) - u(c.r1)) / m) / 1000;
  if (id === 'sin-gravedad') return c.v1 / 1000;
  if (id === 'modulo-inicial') return Math.abs(u(c.r1)) / 1e9;
  if (id === 'cuadrado') return z / c.kr;
  if (id === 'sin-masas') return c.Ep0 / c.kr;
  if (id === 'sin-radio') return c.Ep0 * c.kM * c.km;
  assert.fail('Error sin oráculo: ' + id);
}
const cerca = (a, b, label) => assert.ok(Math.abs(a - b) <= Math.max(Math.abs(a), Math.abs(b), 1e-100) * 2e-10 + 1e-12, `${label}: ${a} / ${b}`);
function expresion(n) {
  if (n == null) return '';
  if (Array.isArray(n)) return n.map(expresion).join('');
  if (typeof n !== 'object') return String(n);
  if (n.sub) return expresion(n.sub[0]) + expresion(n.sub[1]);
  if (n.sup) return '((' + expresion(n.sup[0]) + ')**(' + expresion(n.sup[1]) + '))';
  if (n.frac) return '((' + expresion(n.frac[0]) + ')/(' + expresion(n.frac[1]) + '))';
  if (n.raiz) return 'Math.sqrt(' + expresion(n.raiz[0]) + ')';
  if (n.par) return '(' + expresion(n.par) + ')';
  if (n.t != null) return String(n.t);
  if (n.negrita) return expresion(n.negrita);
  assert.fail('Nodo desconocido al verificar ecuación: ' + JSON.stringify(n));
}
function variables(c) {
  const z = esperado(c), mm = c.tipo === 'masa-trabajo' ? z : c.toneladas != null ? c.toneladas * 1000 : c.m;
  const r0 = c.tipo === 'distancia' ? z * 1000 : c.r != null ? c.r : c.R != null ? c.R + c.h : c.r1;
  const U = r => c.GM && mm && r ? potencial(c.GM, mm, r) : 0;
  const up1 = c.Ep1 != null ? c.Ep1 * 1e9 : U(c.r1), up2 = c.Ep2 != null ? c.Ep2 * 1e9 : U(c.r2);
  const up = c.EpGJ != null ? c.EpGJ * 1e9 : c.Ep != null ? c.Ep * 1e9 : U(r0);
  const ck1 = c.v1 != null ? cinetica(mm, c.v1) : 0, ck2 = ck1 + up1 - up2;
  const ck = c.Ec != null ? c.Ec * 1e9 : c.v != null ? cinetica(mm, c.v) : 0;
  const delta = c.dEp != null ? c.dEp * 1e9 : up2 - up1;
  return { GM: c.GM, m: mm, r: r0, R: c.R, h: c.h, r1: c.r1, r2: c.r2, r3: c.r3,
    EPG: c.tipo === 'razon' ? z * 1e9 : up, EPG1: up1, EPG2: up2, EPG3: U(c.r3), EPGinicial: c.Ep0 * 1e9, EPGnueva: z * 1e9,
    EC: ck, EC1: ck1, EC2: ck2, EM: ck + up, ΔEPG: delta,
    Wg: c.trabajoGJ != null ? c.trabajoGJ * 1e9 : c.tipo === 'tramos' ? up1 - U(c.r3) : -delta,
    v: c.v, v1: c.v1, v2: c.tipo === 'rapidez' ? z * 1000 : undefined };
}
function verificarEcuaciones(caso) {
  const c = caso.verificacion, dic = variables(c), pasos = caso.solucion && Array.isArray(caso.solucion) ? caso.solucion : caso.pasos || (caso.solucion ? [caso.solucion] : []);
  const ecuaciones = [...pasos.filter(p => p.ecuacion).map(p => p.ecuacion), ...(caso.respuesta ? [caso.respuesta] : [])];
  for (const ec of ecuaciones) for (const ecuacion of expresion(ec).split(';')) {
    const lados = ecuacion.split(/[=≈]/); if (lados.length < 2) continue;
    const escalaE = /GJ/.test(ecuacion) ? 1e9 : 1, escalaR = /\bkm\b/.test(ecuacion) && !/km\/s/.test(ecuacion) ? 1000 : 1, escalaV = /km\/s/.test(ecuacion) ? 1000 : 1;
    const evaluar = s => {
      let t = s.replace(/\b(?:GJ|J|km\/s|m\/s|km|kg)\b/g, '').replace(/−/g, '-').replace(/[·×]/g, '*').replace(/÷/g, '/').replace(/,/g, '.')
        .replace(/[⁻⁰¹²³⁴⁵⁶⁷⁸⁹]+/g, ss => '**(' + [...ss].map(c => ({ '⁻': '-', '⁰': 0, '¹': 1, '²': 2, '³': 3, '⁴': 4, '⁵': 5, '⁶': 6, '⁷': 7, '⁸': 8, '⁹': 9 })[c]).join('') + ')');
      for (const k of Object.keys(dic).sort((a, b) => b.length - a.length)) {
        const re = new RegExp('(?<![A-Za-z0-9Δ])' + k + '(?![A-Za-z0-9])', 'g');
        if (!re.test(t)) continue;
        assert.ok(Number.isFinite(dic[k]), 'Variable no determinada: ' + k + ' en ' + c.tipo);
        const factor = /^(?:E|ΔE|Wg)/.test(k) ? escalaE : /^(?:r|R|h)/.test(k) ? escalaR : /^v/.test(k) ? escalaV : 1;
        t = t.replace(re, '(' + dic[k] / factor + ')');
      }
      t = t.replace(/\s/g, '');
      assert.match(t.replace(/Math\.sqrt/g, ''), /^[0-9eE+\-*/().]*$/, 'Expresión incompleta: ' + t);
      const valor = Function('return (' + t + ')')(); assert.ok(Number.isFinite(valor)); return valor;
    };
    const valores = lados.map(evaluar);
    for (let j = 1; j < valores.length; j++) {
      const exponentes = [...lados[j].matchAll(/10([⁻⁰¹²³⁴⁵⁶⁷⁸⁹]+)/g)];
      const escala = exponentes.length ? numeralPotencia(exponentes.at(-1)[1]) : 1;
      const tolerancia = ecuacion.includes('≈') ? 0.000501 * escala : Math.max(Math.abs(valores[j - 1]), Math.abs(valores[j]), 1) * 2e-9;
      assert.ok(Math.abs(valores[j - 1] - valores[j]) <= tolerancia, `${c.tipo}: ${ecuacion}: ${valores[j - 1]} / ${valores[j]}`);
    }
  }
}
function numeralPotencia(s) { return 10 ** Number([...s].map(c => ({ '⁻': '-', '⁰': 0, '¹': 1, '²': 2, '³': 3, '⁴': 4, '⁵': 5, '⁶': 6, '⁷': 7, '⁸': 8, '⁹': 9 })[c]).join('')); }
function numeroVisible(s) {
  const inicial = s.replace(/^≈\s*/, '').replace(/\s*(?:GJ|km\/s|km|kg)$/, '').trim();
  const ss = inicial.replace(/[−]/g, '-').replace(/,/, '.').replace(/\s/g, '').replace(/×10([⁻⁰¹²³⁴⁵⁶⁷⁸⁹]+)/, (_, e) => 'e' + [...e].map(c => ({ '⁻': '-', '⁰': 0, '¹': 1, '²': 2, '³': 3, '⁴': 4, '⁵': 5, '⁶': 6, '⁷': 7, '⁸': 8, '⁹': 9 })[c]).join(''));
  const n = Number(ss); assert.ok(Number.isFinite(n), s); return n;
}
function toleranciaVisible(s) {
  if (!s.startsWith('≈')) return Math.abs(numeroVisible(s)) * 2e-10 + 1e-12;
  const mant = s.replace(/^≈\s*/, '').split('×')[0], dec = /,(\d+)/.exec(mant);
  const e = /× 10([⁻⁰¹²³⁴⁵⁶⁷⁸⁹]+)/.exec(s);
  const exp = e ? Number([...e[1]].map(c => ({ '⁻': '-', '⁰': 0, '¹': 1, '²': 2, '³': 3, '⁴': 4, '⁵': 5, '⁶': 6, '⁷': 7, '⁸': 8, '⁹': 9 })[c]).join('')) : 0;
  return 0.500001 * 10 ** (exp - (dec ? dec[1].length : 0));
}
function verificar(caso) {
  const c = caso.verificacion, z = esperado(c);
  cerca(c.respuesta.valor, z, c.tipo);
  for (const e of c.errores) cerca(e.valor, errorEsperado(c, e.id), c.tipo + ':' + e.id);
  const err = c.errores.map(e => e.valor);
  assert.ok(err.every(x => Math.abs(x - z) > Math.max(Math.abs(z), 1e-100) * 1e-11), 'Ningún error es la respuesta.');
  const opciones = caso.opciones || (caso.alternativas || []).map(texto => ({ texto }));
  if (opciones.length) {
    assert.equal(new Set(opciones.map(o => T.plano(o.texto))).size, opciones.length);
    const cercanas = opciones.filter(o => Math.abs(numeroVisible(T.plano(o.texto)) - z) <= toleranciaVisible(T.plano(o.texto)));
    // Las alternativas científicas diminutas se distinguen por su precisión, no por una tolerancia absoluta grande.
    assert.equal(cercanas.length, 1, 'Una sola alternativa corresponde al valor calculado.');
    if (opciones.some(o => o.correcta)) assert.ok(cercanas[0].correcta);
    for (const o of opciones.filter(o => o.siFuera)) {
      const e = c.errores.find(e => e.id === o.id); assert.ok(e);
      assert.ok(T.plano(o.siFuera).startsWith('Bien '));
      assert.ok(T.plano(o.siFuera).includes(T.plano(o.texto)), 'siFuera nombra el valor de su operación.');
    }
  }
  const f = caso.dibujo || caso.figura;
  if (f) {
    const g = pieza.geometria(f.datos, f.estado || {});
    for (const rot of g.rotulos) assert.ok(rot.x0 >= 4 && rot.x1 <= g.W - 4 && rot.y0 >= 0 && rot.y1 <= g.H);
  }
  assert.ok(!/NaN|undefined|Infinity/.test(JSON.stringify(caso)));
  verificarEcuaciones(caso);
}

test('energía: quince ejemplos y cinco de cada nivel, con oráculo por trabajo integrado', () => {
  assert.equal(idea.ejemplos.length, 15);
  for (const n of [1, 2, 3]) assert.equal(idea.ejemplos.filter(e => e.nivel === n).length, 5);
  for (const e of idea.ejemplos) verificar(e);
  const letras = idea.ejemplos.filter(e => e.alternativas).map(e => e.alternativas.findIndex(a =>
    Math.abs(numeroVisible(T.plano(a)) - esperado(e.verificacion)) <= toleranciaVisible(T.plano(a))));
  assert.deepEqual(letras, [0, 1, 2, 3, 4]);
});
test('energía: 400 semillas de cada generador, resultados, distractores, figuras y no repetición', () => {
  const r = new Set(), a = new Set(), tipos = new Set();
  for (let s = 0; s < 400; s++) {
    const x = idea.resuelve.generar(s), y = idea.ahoraTu.generar(s); verificar(x); verificar(y);
    const clave = c => { const { respuesta, errores, ...entrada } = c.verificacion; return JSON.stringify(entrada); };
    r.add(clave(x)); a.add(clave(y)); tipos.add(y.verificacion.tipo);
  }
  assert.equal(tipos.size, 14);
  for (const k of r) assert.ok(!a.has(k), 'Los bancos deben ser distintos.');
  for (const e of [...idea.ejemplos, idea.predice]) {
    const { respuesta, errores, ...entrada } = e.verificacion;
    assert.ok(!r.has(JSON.stringify(entrada)) && !a.has(JSON.stringify(entrada)));
  }
});
test('energía: misión única, campo exterior, signos y datos de Predice sin respuesta', () => {
  const controles = idea.juega.controles[0].opciones.map(x => ({ rKm: x.valor }));
  assert.deepEqual(controles.filter(idea.juega.mision.logrado), [{ rKm: 16000 }]);
  for (const x of controles) {
    assert.ok(x.rKm * 1000 > 4e6);
    const U = potencial(4e14, 400, x.rKm * 1000) / 1e9;
    const textos = pieza.geometria(idea.juega.dibujo(x).datos).rotulos.map(r => r.texto);
    const t = textos.filter(t => /^E_PG [=≈]/.test(t)).at(-1);
    assert.ok(t); const valor = (t.includes('≈') ? '≈ ' : '') + t.replace(/^E_PG [=≈] /, '');
    assert.ok(Math.abs(numeroVisible(valor) - U) <= toleranciaVisible(valor));
    if (x.rKm === 12000) assert.ok(t.includes('≈'), 'El tercio no se escribe como igualdad exacta.');
  }
  verificar(idea.predice);
  verificarEcuaciones({ verificacion: idea.predice.verificacion, pasos: idea.mira.pasos });
  assert.ok(!T.plano(idea.predice.pregunta).includes('aumenta'));
  assert.ok(!T.plano(idea.predice.datos).includes('6 GJ'));
  assert.equal(idea.predice.opciones.filter(o => numeroVisible(T.plano(o.texto)) > 0).length, 2, 'El signo positivo no identifica una sola alternativa.');
});
test('energía: figuras estáticas, cotas y objetos dentro del lienzo', () => {
  const figuras = [...idea.lee.tarjetas.filter(t => t.dibujo).map(t => t.dibujo), idea.predice.dibujo, idea.predice.revelar, idea.regla.dibujo,
    ...idea.mira.pasos.map(p => ({ datos: idea.mira.datos, estado: p.estado }))];
  for (const f of figuras) {
    const g = pieza.geometria(f.datos, f.estado || {});
    for (const r of [...g.rotulos, ...g.objetos]) assert.ok(r.x0 >= 4 && r.x1 <= g.W - 4 && r.y0 >= 0 && r.y1 <= g.H, r.texto || r.tipo);
    for (const s of g.segmentos) for (const [x, y] of [s.de, s.a]) assert.ok(x >= 4 && x <= g.W - 4 && y >= 0 && y <= g.H);
  }
});
test('energía: el validador comprueba 400 semillas como calidad 2 sin cambiar la marca real', () => {
  const parcial = { ...def, calidad: 2, ideas: [idea], glosario: def.glosario.filter(g => ['referencia en el infinito', 'trabajo gravitatorio', 'energía potencial gravitatoria', 'nivel de referencia'].includes(g.termino)) };
  delete parcial.laboratorio; delete parcial.laboratorioIdeas;
  assert.deepEqual(T.problemas(parcial, { semillas: 400 }), []);
});
