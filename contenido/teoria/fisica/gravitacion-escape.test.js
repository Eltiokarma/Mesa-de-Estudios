'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const T = require('../../../nucleo/teoria.js');
const pieza = require('../../../nucleo/kit/piezas/fis-gravitacion.js');
const def = require(process.env.GR_ESCAPE_MODULE ? path.resolve(process.env.GR_ESCAPE_MODULE) : './gravitacion.js');
const idea = def.ideas.find(i => i.id === 'escape');

// Oráculo de energía con búsquedas de raíz; no usa escape(), energia() ni los
// despejes del contenido. El cero de energía potencial es el infinito.
const E = (GM, masa, distancia, velocidad) => masa * velocidad * velocidad / 2 - GM * masa / distancia;
function raiz(fn, valor, lo, hi) {
  assert.ok(fn(lo) <= valor && fn(hi) >= valor, 'El intervalo debe contener la raíz.');
  for (let j = 0; j < 100; j++) { const m = (lo + hi) / 2; if (fn(m) < valor) lo = m; else hi = m; }
  return (lo + hi) / 2;
}
const umbral = (GM, r, masa = 73) => raiz(v => E(GM, masa, r, v), 0, 0, 1e7);
const rr = c => c.r == null ? c.R + c.h : c.r;
function esperado(c) {
  if (['umbral', 'altura'].includes(c.tipo)) return umbral(c.GM, rr(c)) / 1000;
  if (c.tipo === 'circular') return umbral(c.vc * c.vc * 1e7, 1e7) / 1000;
  if (c.tipo === 'otra-masa') {
    const GM = c.vRef * c.vRef * 1e7 / 2;
    return umbral(GM, 1e7, 73 * c.km) / 1000;
  }
  if (c.tipo === 'razon') {
    const GM = c.vRef * c.vRef * 1e7 / 2;
    return umbral(GM * c.kM, 1e7 * c.kr) / 1000;
  }
  if (c.tipo === 'dos-planetas') {
    const Rref = 1e7, gRef = c.vRef * c.vRef / (2 * Rref), Rnuevo = Rref * c.kR;
    return umbral(gRef * c.kg * Rnuevo * Rnuevo, Rnuevo) / 1000;
  }
  if (['residual', 'residual-altura', 'rapidez-finita'].includes(c.tipo)) {
    const inicio = E(c.GM, 73, rr(c), c.v0), distancia = c.tipo === 'rapidez-finita' ? c.rFinal : Infinity;
    assert.ok(inicio > 0);
    const final = v => 73 * v * v / 2 - (Number.isFinite(distancia) ? c.GM * 73 / distancia : 0);
    return raiz(final, inicio, 0, c.v0 * 2) / 1000;
  }
  if (['retorno', 'altura-retorno'].includes(c.tipo)) {
    const inicio = E(c.GM, 73, rr(c), c.v0);
    assert.ok(inicio < 0 && c.v0 > 0);
    const retorno = raiz(r => E(c.GM, 73, r, 0), inicio, rr(c), rr(c) * 100);
    assert.ok(retorno > rr(c));
    if (c.R) assert.ok(rr(c) > c.R && retorno > c.R);
    return (retorno - (c.tipo === 'altura-retorno' ? c.R : 0)) / 1000;
  }
  if (['radio', 'radio-altura'].includes(c.tipo)) {
    const salida = raiz(r => E(c.GM, 73, r, c.vesc), 0, 1e3, 1e12);
    assert.ok(salida > (c.R || 0));
    return (salida - (c.tipo === 'radio-altura' ? c.R : 0)) / 1000;
  }
  assert.fail('Tipo no verificado: ' + c.tipo);
}
function errorEsperado(c, id) {
  const z = esperado(c), radio = rr(c);
  if (id === 'signo') return -z;
  if (id === 'sin-km') return z * 1000;
  if (id === 'cero' || id === 'sin-gravedad') return 0;
  if (id === 'sin-dos') return ['radio', 'radio-altura'].includes(c.tipo) ? (c.GM / (c.vesc * c.vesc) - (c.tipo === 'radio-altura' ? c.R : 0)) / 1000 : z / Math.SQRT2;
  if (id === 'dos-fuera') return z * Math.SQRT2;
  if (id === 'desde-superficie') return umbral(c.GM, c.h) / 1000;
  if (id === 'igual-circular') return c.vc / 1000;
  if (id === 'doble-circular') return c.vc / 500;
  if (id === 'divide-raiz') return c.vc / (1000 * Math.SQRT2);
  if (id === 'lineal') return c.vRef / 1000 * (c.tipo === 'dos-planetas' ? c.kg * c.kR : c.kM / c.kr);
  if (id === 'directa-radio') return c.vRef / 1000 * Math.sqrt(c.kM * c.kr);
  if (id === 'sin-radio') return c.vRef / 1000 * Math.sqrt(c.kM);
  if (id === 'sin-masa') return c.vRef / (1000 * Math.sqrt(c.kr));
  if (id === 'sin-cambios') return c.vRef / 1000;
  if (id === 'masa-lineal') return c.vRef * c.km / 1000;
  if (id === 'masa-raiz') return c.vRef * Math.sqrt(c.km) / 1000;
  if (id === 'masa-inversa') return c.vRef / (c.km * 1000);
  if (id === 'radio-inverso') return c.vRef / 1000 * Math.sqrt(c.kg / c.kR);
  if (id === 'solo-campo') return c.vRef / 1000 * Math.sqrt(c.kg);
  if (id === 'solo-radio') return c.vRef / 1000 * Math.sqrt(c.kR);
  if (id === 'resta-rapideces') return (c.v0 - umbral(c.GM, radio)) / 1000;
  if (id === 'sin-frenado') return c.v0 / 1000;
  if (id === 'solo-escape') return umbral(c.GM, radio) / 1000;
  if (id === 'infinito-antes') return raiz(v => v * v / 2, E(c.GM, 1, radio, c.v0), 0, c.v0) / 1000;
  if (id === 'solo-altura') return Math.sqrt(c.v0 * c.v0 - 2 * c.GM / c.h) / 1000;
  if (id === 'radio-como-altura') return z + c.R / 1000;
  if (id === 'desde-salida') return z + (c.tipo === 'altura-retorno' ? c.R / 1000 : 0) - radio / 1000;
  if (id === 'sin-movimiento') return (radio - (c.tipo === 'altura-retorno' ? c.R : 0)) / 1000;
  if (id === 'sin-cuadrado') return (2 * c.GM / c.vesc - (c.tipo === 'radio-altura' ? c.R : 0)) / 1000;
  assert.fail('Distractor sin verificar: ' + id);
}
function numeral(s) {
  return Number(String(s).replace(/^≈\s*/, '').replace(/\s*(?:km\/s|km|GJ)$/, '').replace(/−/g, '-').replace(/,/g, '.').replace(/\s/g, '')
    .replace(/×10([⁻⁰¹²³⁴⁵⁶⁷⁸⁹]+)/, (_, exp) => 'e' + [...exp].map(c => ({ '⁻': '-', '⁰': 0, '¹': 1, '²': 2, '³': 3, '⁴': 4, '⁵': 5, '⁶': 6, '⁷': 7, '⁸': 8, '⁹': 9 })[c]).join('')));
}
const cerca = (a, b, texto) => assert.ok(Math.abs(a - b) <= Math.max(Math.abs(a), Math.abs(b), 1e-12) * 2e-12, `${texto}: ${a} frente a ${b}`);
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
  const z = esperado(c), masa = 73;
  let GM = c.GM, radio = rr(c), R = c.R, g;
  if (['radio', 'radio-altura'].includes(c.tipo)) radio = z * 1000 + (c.tipo === 'radio-altura' ? R : 0);
  if (c.tipo === 'circular') { radio = 1e7; GM = c.vc * c.vc * radio; }
  if (c.tipo === 'otra-masa') { radio = 1e7; GM = c.vRef * c.vRef * radio / 2; }
  if (c.tipo === 'razon') { radio = 1e7 * c.kr; GM = c.vRef * c.vRef * 1e7 / 2 * c.kM; }
  if (c.tipo === 'dos-planetas') { R = 1e7 * c.kR; radio = R; g = c.vRef * c.vRef / (2e7) * c.kg; GM = g * R * R; }
  const esc = umbral(GM, radio), v0 = c.v0 == null ? esc : c.v0;
  const ck0 = masa * v0 * v0 / 2, up0 = -GM * masa / radio, ini = ck0 + up0;
  let rmax, hmax;
  if (['retorno', 'altura-retorno'].includes(c.tipo)) { rmax = z * 1000 + (c.tipo === 'altura-retorno' ? R : 0); hmax = rmax - R; }
  return { GM, m: masa, r: radio, r0: radio, R, h: c.tipo === 'radio-altura' ? z * 1000 : c.h, rmax, hmax,
    vesc: esc, vescref: c.vRef, vescnueva: z * 1000, vc: c.vc, v0, vinf: z * 1000, vfinal: z * 1000, gsuperficie: g,
    EC: ck0, EPG: up0, EMinicial: ini, EMfinal: ini, ECinicial: ck0, EPGinicial: up0, EPGretorno: rmax ? -GM * masa / rmax : undefined };
}
function verificarEcuaciones(caso, extra = []) {
  const c = caso.verificacion, dic = variables(c), pasos = Array.isArray(caso.solucion) ? caso.solucion : caso.pasos || (caso.solucion ? [caso.solucion] : []);
  const ecuaciones = [...pasos.filter(p => p.ecuacion).map(p => p.ecuacion), ...(caso.respuesta ? [caso.respuesta] : []), ...extra];
  for (const ec of ecuaciones) for (const ecuacion of expresion(ec).split(';')) {
    const lados = ecuacion.split(/[=≈]/); if (lados.length < 2) continue;
    const escalaE = /GJ/.test(ecuacion) ? 1e9 : 1, escalaR = /\bkm\b/.test(ecuacion) && !/km\/s/.test(ecuacion) ? 1000 : 1, escalaV = /km\/s/.test(ecuacion) ? 1000 : 1;
    const evaluar = s => {
      let t = s.replace(/\b(?:GJ|J|km\/s|m\/s|km|kg)\b/g, '').replace(/−/g, '-').replace(/[·×]/g, '*').replace(/÷/g, '/').replace(/,/g, '.').replace(/_/g, '')
        .replace(/[⁻⁰¹²³⁴⁵⁶⁷⁸⁹]+/g, ss => '**(' + [...ss].map(c => ({ '⁻': '-', '⁰': 0, '¹': 1, '²': 2, '³': 3, '⁴': 4, '⁵': 5, '⁶': 6, '⁷': 7, '⁸': 8, '⁹': 9 })[c]).join('') + ')');
      for (const k of Object.keys(dic).sort((a, b) => b.length - a.length)) {
        const re = new RegExp('(?<![A-Za-z0-9])' + k + '(?![A-Za-z0-9])', 'g');
        if (!re.test(t)) continue;
        assert.ok(Number.isFinite(dic[k]), 'Variable no determinada: ' + k + ' en ' + c.tipo);
        const factor = /^E/.test(k) ? escalaE : /^(?:r|R|h)/.test(k) ? escalaR : /^v/.test(k) ? escalaV : 1;
        t = t.replace(re, '(' + dic[k] / factor + ')');
      }
      t = t.replace(/\s/g, '');
      assert.match(t.replace(/Math\.sqrt/g, ''), /^[0-9eE+\-*/().]*$/, 'Expresión incompleta: ' + t);
      const valor = Function('return (' + t + ')')(); assert.ok(Number.isFinite(valor)); return valor;
    };
    const valores = lados.map(evaluar);
    for (let j = 1; j < valores.length; j++) {
      const exponentes = [...lados[j].matchAll(/10([⁻⁰¹²³⁴⁵⁶⁷⁸⁹]+)/g)];
      const escala = exponentes.length ? numeral('1 × 10' + exponentes.at(-1)[1]) : 1;
      const tol = ecuacion.includes('≈') ? 0.000501 * escala : Math.max(Math.abs(valores[j - 1]), Math.abs(valores[j]), 1) * 2e-9;
      assert.ok(Math.abs(valores[j - 1] - valores[j]) <= tol, `${c.tipo}: ${ecuacion}: ${valores[j - 1]} / ${valores[j]}`);
    }
  }
}
function tolerancia(s) {
  if (!s.startsWith('≈')) return Math.abs(numeral(s)) * 2e-12 + 1e-12;
  const parte = s.split('×')[0], dec = /,(\d+)/.exec(parte);
  const potencia = /× 10([⁻⁰¹²³⁴⁵⁶⁷⁸⁹]+)/.exec(s);
  const e = potencia ? Math.log10(numeral('1 × 10' + potencia[1])) : 0;
  return 0.500001 * 10 ** (e - (dec ? dec[1].length : 0));
}
function verificar(caso) {
  const c = caso.verificacion, valor = esperado(c);
  cerca(c.respuesta.valor, valor, c.tipo);
  for (const e of c.errores) cerca(e.valor, errorEsperado(c, e.id), c.tipo + ':' + e.id);
  if (c.GM != null) {
    const linea = caso.datos.map(T.plano).find(x => x.startsWith('GM ='));
    assert.ok(linea);
    const leido = numeral(linea.match(/^GM = (.*?) m³\/s²/)[1]);
    cerca(leido, c.GM, 'El GM visible debe ser la entrada real, sin precisión oculta');
  }
  const opciones = caso.opciones || (caso.alternativas || []).map(texto => ({ texto }));
  if (opciones.length) {
    assert.equal(new Set(opciones.map(o => T.plano(o.texto))).size, opciones.length);
    const correctas = opciones.filter(o => Math.abs(numeral(T.plano(o.texto)) - valor) <= tolerancia(T.plano(o.texto)));
    assert.equal(correctas.length, 1, 'Alternativa correcta única en ' + c.tipo);
    if (opciones.some(x => x.correcta)) assert.ok(correctas[0].correcta);
    for (const o of opciones.filter(o => o.siFuera)) {
      assert.ok(T.plano(o.siFuera).startsWith('Bien '));
      assert.ok(T.plano(o.siFuera).includes(T.plano(o.texto)));
    }
  }
  const fig = caso.dibujo || caso.figura;
  if (fig) {
    const geom = pieza.geometria(fig.datos, fig.estado || {});
    for (const rot of geom.rotulos) assert.ok(rot.x0 >= 4 && rot.x1 <= geom.W - 4 && rot.y0 >= 0 && rot.y1 <= geom.H, rot.texto);
    for (const f of geom.flechas) assert.ok(f.x1 >= 4 && f.x2 <= geom.W - 4, 'Flecha dentro del lienzo.');
  }
  assert.ok(!/NaN|undefined|Infinity/.test(JSON.stringify(caso)));
  verificarEcuaciones(caso);
}
test('escape: quince ejemplos, niveles y respuestas contrastados con raíces de la energía', () => {
  assert.equal(idea.ejemplos.length, 15);
  for (const n of [1, 2, 3]) assert.equal(idea.ejemplos.filter(e => e.nivel === n).length, 5);
  for (const c of idea.ejemplos) verificar(c);
  const letras = idea.ejemplos.filter(e => e.alternativas).map(e => e.alternativas.findIndex(a => Math.abs(numeral(T.plano(a)) - esperado(e.verificacion)) <= tolerancia(T.plano(a))));
  assert.deepEqual(letras, [0, 1, 2, 3, 4]);
});
test('escape: 400 semillas por banco; sin precisión oculta, distractores calculados y datos exteriores', () => {
  const sr = new Set(), sa = new Set(), tipos = new Set();
  const clave = c => { const { respuesta, errores, ...entrada } = c.verificacion; return JSON.stringify(entrada); };
  for (let s = 0; s < 400; s++) {
    const x = idea.resuelve.generar(s), y = idea.ahoraTu.generar(s); verificar(x); verificar(y);
    sr.add(clave(x)); sa.add(clave(y)); tipos.add(y.verificacion.tipo);
    for (const e of [x, y]) { const c = e.verificacion; if (c.R && c.h != null) assert.ok(c.R > 0 && c.h >= 0 && rr(c) >= c.R); }
  }
  assert.equal(tipos.size, 13);
  for (const x of sr) assert.ok(!sa.has(x));
  for (const e of [...idea.ejemplos, idea.predice]) assert.ok(!sr.has(clave(e)) && !sa.has(clave(e)));
});
test('escape: misión de mínimo única y signo de energía coherente en todo el control', () => {
  const valores = idea.juega.controles[0].opciones.map(o => ({ vKm: o.valor }));
  assert.deepEqual(valores.filter(idea.juega.mision.logrado), [{ vKm: 10 }]);
  for (const c of valores) {
    const en = E(4e14, 100, 8e6, c.vKm * 1000), texto = T.plano(idea.juega.lectura(c));
    assert.ok(en < 0 ? texto.includes('regresa') : en === 0 ? texto.includes('umbral') : texto.includes('positiva'));
    const gs = pieza.geometria(idea.juega.dibujo(c).datos), flechas = gs.flechas;
    cerca(flechas[1].largo / flechas[0].largo, c.vKm / 6, 'Escala común de velocidad');
    const energiaLeida = gs.rotulos.filter(r => r.texto.startsWith('E_M =')).at(-1).texto.replace('E_M = ', '');
    cerca(numeral(energiaLeida), en / 1e9, 'Lectura de energía');
  }
  verificar(idea.predice);
  verificarEcuaciones(idea.predice, idea.mira.pasos.map(p => p.ecuacion));
  assert.ok(!T.plano(idea.predice.datos).includes('5 km/s'));
});
test('escape: Lee y figuras estáticas mantienen velocidades y todos los elementos dentro del lienzo', () => {
  const figuras = [...idea.lee.tarjetas.filter(t => t.dibujo).map(t => t.dibujo), idea.predice.dibujo, idea.predice.revelar, idea.regla.dibujo,
    ...idea.mira.pasos.map(p => ({ datos: idea.mira.datos, estado: p.estado }))];
  for (const figura of figuras) {
    const g = pieza.geometria(figura.datos, figura.estado || {});
    for (const r of [...g.rotulos, ...g.objetos]) assert.ok(r.x0 >= 4 && r.x1 <= g.W - 4 && r.y0 >= 0 && r.y1 <= g.H, r.texto || r.tipo);
    for (const f of g.flechas) for (const [x, y] of [[f.x1, f.y1], [f.x2, f.y2], ...f.punta]) assert.ok(x >= 4 && x <= g.W - 4 && y >= 0 && y <= g.H);
  }
  const inicial = pieza.geometria(idea.lee.tarjetas[0].dibujo.datos);
  assert.deepEqual(inicial.flechas.map(f => f.vector), [[6000, 0], [8000, 0]], 'La primera comparación es 6 y 8 km/s.');
});
test('escape: calidad2 simulada, 400 semillas sin cambiar la marca publicada', () => {
  const parcial = { ...def, calidad: 2, ideas: [idea], glosario: def.glosario.filter(g => ['rapidez de escape', 'punto de retorno', 'rapidez residual límite'].includes(g.termino)) };
  delete parcial.laboratorio; delete parcial.laboratorioIdeas;
  assert.deepEqual(T.problemas(parcial, { semillas: 400 }), []);
});
