// Pruebas de «Reacciones y balance» (reacciones-practica): el banco entero se rehace con el motor de la escena
// plantillas/balance-reacciones (balance por álgebra, EO, redox, semirreacciones e ion-electrón) y con un conteo propio de
// átomos y cargas; casos.json (calculados aparte); y en 400 semillas un recálculo independiente de la respuesta a partir de
// _datos.
const test = require('node:test');
const assert = require('node:assert/strict');
const gen = require('./generador.js');
const casos = require('./casos.json');
const MB = require('../balance-reacciones/motor.js');
const { probarGenerador, probarFugas } = require('../../nucleo/probar-generador.js');

const B = gen.BANCO;
const sinEst = t => t.replace(/\((s|l|g|ac)\)/g, '');
const sinCoef = ec => ec.replace(/(^|[>+]\s*)\d+\s+/g, '$1');
// Conteo propio: «Ca(OH)2» con paréntesis expandidos, «MnO4^-» con su carga.
function cuenta(f) {
  const out = {}; let s = f.replace(/\^.*$/, '');
  for (let g = 0; g < 5; g++) s = s.replace(/\(([^()]+)\)(\d*)/, (x, a, n) => a.repeat(+n || 1));
  for (const [, e, n] of s.matchAll(/([A-Z][a-z]?)(\d*)/g)) out[e] = (out[e] || 0) + (+n || 1);
  const q = f.match(/\^(\d*)([+-])$/); return { at: out, q: q ? (q[2] === '+' ? 1 : -1) * (+q[1] || 1) : 0 };
}
function cuadra(ec) {
  const [a, b] = sinEst(ec).split(/\s*->\s*/), tot = l => { const r = { q: 0 }; for (const x of l.split(/\s+\+\s+/)) { const m = x.match(/^(\d+)\s+(.*)$/), k = m ? +m[1] : 1, c = cuenta(m ? m[2] : x); r.q += k * c.q; for (const [e, n] of Object.entries(c.at)) r[e] = (r[e] || 0) + k * n; } return r; };
  const A = tot(a), C = tot(b); return [...new Set([...Object.keys(A), ...Object.keys(C)])].every(k => (A[k] || 0) === (C[k] || 0));
}
const conCoefs = (ec, cs) => { let k = 0; return ec.split(' -> ').map(l => l.split(' + ').map(f => `${cs[k++]} ${f}`).join(' + ')).join(' -> '); };

test('el banco cuadra y coincide con el motor', () => {
  for (const [ec] of B.INDICIO) assert.ok(cuadra(ec), ec);
  for (const [ec, k] of B.CLASE) { assert.ok(cuadra(ec), ec); assert.equal(MB.clasificar(sinCoef(ec)).tipo, k, ec); }
  for (const [ec, cs] of B.BAL) { assert.deepEqual(MB.balancear(ec).coefs, cs, ec); assert.ok(cuadra(conCoefs(ec, cs)), ec); }
  for (const [c, cs] of B.COMB) assert.deepEqual(MB.balancear(`${c} + O2 -> CO2 + H2O`).coefs, cs, c);
  for (const [ec, ox, red, AO, AR] of B.REDOX) {
    assert.ok(cuadra(ec), ec); const r = MB.redox(sinCoef(ec));
    assert.deepEqual([r.seOxida, r.seReduce, r.agenteOxidante, r.agenteReductor], [[ox[0]], [red[0]], [AO], [AR]], ec);
    assert.ok(r.estados[ox[0]].izq.includes(ox[1]), ec); assert.ok(r.estados[ox[0]].der.includes(ox[2]), ec);
    assert.ok(r.estados[red[0]].izq.includes(red[1]), ec); assert.ok(r.estados[red[0]].der.includes(red[2]), ec);
  }
  for (const ec of B.NO_REDOX) { assert.ok(cuadra(ec), ec); assert.equal(MB.redox(sinCoef(ec)).esRedox, false, ec); }
  for (const [A, Bx, el, n, a, b, q] of B.UNIDAD_E) {
    assert.equal(MB.oxidacion(A).porElemento[el], a, A); assert.equal(MB.oxidacion(Bx).porElemento[el], b, Bx);
    assert.equal(MB.especie(A).atomos[el], n, A); assert.equal(MB.especie(A).carga, q, A);
  }
  for (const [ec, cs, quien, k, kOtro, eT] of B.MOLEC) {
    assert.deepEqual(MB.balancear(ec).coefs, cs, ec); const r = MB.redox(ec), fs = ec.split(/\s*->\s*|\s+\+\s+/);
    assert.equal(fs[k], quien === 'o' ? r.agenteOxidante[0] : r.agenteReductor[0], ec); assert.equal(fs[kOtro], quien === 'o' ? r.agenteReductor[0] : r.agenteOxidante[0], ec);
    // Los electrones transferidos: los del motor (solo los átomos que cambian de EO) y, aparte, lo que pierde el reductor
    // y gana el oxidante (coeficiente × electrones por unidad), que tiene que dar lo mismo.
    const lados = Object.entries(r.electronesPorUnidad).map(([f, e]) => cs[fs.indexOf(f)] * e);
    assert.equal(r.electrones, eT, ec); assert.ok(lados.includes(eT), ec);
  }
  for (const [A, Bx, x, [e, le], nB] of B.SEMI) {
    const r = MB.semirreaccion(A, Bx, 'acido'), en = (f, lado) => (r[lado].find(t => t[1] === f) || [0])[0];
    for (const [f, [c, l]] of Object.entries(x)) assert.equal(en(f, l), c, `${A} ${f}`);
    assert.equal(r.electrones, e, A); assert.equal(r.ladoElectrones, le, A); if (nB) assert.equal(en(Bx, 'der'), nB, A);
  }
  for (const [o, r, ec, s, sinIg] of B.GLOBAL) {
    const x = MB.ionElectron(o, r, 'acido'); assert.ok(cuadra(ec), ec);
    assert.equal(x.suma, s, ec); assert.equal(x.errores.sinIgualar.suma, sinIg, ec);
    const norm = t => sinEst(t).replace(/(\d+)\s+/g, '$1').split(/\s*->\s*/).map(l => l.split(/\s*\+\s*(?![\s\d]*$)/).sort().join('+')).join('->');
    assert.equal(norm(x.texto.replace(/(\^\d*[+-])\s/g, '$1 ')), norm(ec), ec);
  }
});

// Recálculo de la respuesta a partir de _datos, con el motor y el conteo propio (no con el generador).
const bon = f => f.replace(/([A-Za-z)])(\d+)/g, (x, a, d) => a + d.split('').map(c => '₀₁₂₃₄₅₆₇₈₉'[+c]).join(''));
function recalcular(p) {
  const d = p._datos;
  switch (d.tipo) {
    case 'hubo': return d.si ? p.respuesta.valor.startsWith('Sí') : p.respuesta.valor.startsWith('No');
    case 'indicio': { const f = d.visto; return p.respuesta.valor.includes(bon(f)) && (d.tipo2 === undefined); }
    case 'estados-vf': return /^[VF]{3}$/.test(p.respuesta.valor);
    case 'forma': return p.respuesta.valor.toLowerCase() === MB.clasificar(sinCoef(d.ec)).tipo;
    case 'calor': return p.respuesta.valor.includes(d.calor === 'exo' ? 'exotérmica' : 'endotérmica');
    case 'dos-etiquetas': return p.respuesta.valor.toLowerCase() === `${MB.clasificar(sinCoef(d.ec)).tipo} y ${d.calor === 'exo' ? 'exotérmica' : 'endotérmica'}`;
    case 'coeficiente': return +p.respuesta.valor === MB.balancear(d.ec).coefs[d.k];
    case 'suma': return +p.respuesta.valor === MB.balancear(d.ec).suma;
    case 'fraccion': return +p.respuesta.valor === MB.balancear(`${d.comb} + O2 -> CO2 + H2O`).coefs[1];
    case 'agente': { const r = MB.redox(sinCoef(d.ec)); return p.respuesta.valor === bon(d.pideOx ? r.agenteOxidante[0] : r.agenteReductor[0]); }
    case 'salto': { const r = MB.redox(sinCoef(d.ec)), sube = d.b > d.a; return r.estados[d.el].izq.includes(d.a) && r.estados[d.el].der.includes(d.b) && p.respuesta.valor.startsWith(`Se ${sube ? 'oxida' : 'reduce'}`); }
    case 'es-redox': return MB.redox(sinCoef(d.ec)).esRedox;
    case 'e-unidad': { const a = MB.oxidacion(d.A).porElemento[d.el], b = MB.oxidacion(d.B).porElemento[d.el]; return +p.respuesta.valor === MB.especie(d.A).atomos[d.el] * Math.abs(a - b); }
    case 'coef-agente': return +p.respuesta.valor === MB.balancear(d.ec).coefs[d.k];
    case 'suma-redox': return +p.respuesta.valor === MB.balancear(d.ec).suma;
    case 'agua': { const r = MB.semirreaccion(d.A, d.B, 'acido'), l = r.izq.some(t => t[1] === 'H2O') ? 'izq' : 'der', n = r[l].find(t => t[1] === 'H2O')[0];
      return p.respuesta.valor === `${n} H₂O a ${l === 'izq' ? 'la izquierda' : 'la derecha'}`; }
    case 'electrones': { const r = MB.semirreaccion(d.A, d.B, 'acido'); return p.respuesta.valor === `${r.electrones} e⁻ a ${r.ladoElectrones === 'izq' ? 'la izquierda' : 'la derecha'}`; }
    case 'global': return +p.respuesta.valor === MB.ionElectron(d.o, d.r, 'acido').suma;
    default: throw new Error(`tipo sin recálculo: ${d.tipo}`);
  }
}
probarGenerador(gen, { semillas: 400, recalcular: p => recalcular(p), igual: e => e === true });
probarFugas(gen);

test('cada respuesta se recalcula aparte (400 semillas por idea)', () => {
  for (const idea of Object.keys(gen.TIPOS_POR_IDEA)) for (let s = 0; s < 400; s++) {
    const p = gen.generar(s, { idea });
    assert.ok(recalcular(p), `${idea} ${s}: ${p._datos.tipo} ${p.respuesta.valor}`);
  }
});

test('casos.json: cada caso da la respuesta calculada aparte', () => {
  assert.ok(casos.casos.length >= 18);
  for (const c of casos.casos) {
    const p = gen.generar(c.semilla, { idea: c.entrada.idea });
    assert.equal(p._datos.tipo, c.entrada.tipo, `${c.semilla}`);
    assert.equal(p.respuesta.valor, c.esperado.respuesta, `${c.semilla} ${c.entrada.tipo}`);
  }
});

test('por idea: cada idea da solo sus tipos; los Datos no traen la respuesta ni pasan de 22 palabras', () => {
  for (const [idea, tipos] of Object.entries(gen.TIPOS_POR_IDEA)) {
    const vistos = new Set();
    for (let s = 0; s < 400; s++) {
      const p = gen.generar(s, { idea }); vistos.add(p._datos.tipo);
      assert.ok(tipos.includes(p._datos.tipo)); assert.equal(p._datos.idea, idea);
      assert.ok(Array.isArray(p.datos) && p.datos.length && p.datos.every(l => l.split(/\s+/).length <= 22), `${idea} ${s}: datos`);
      // En «forma» los Datos dan las cuatro clases entre las que se elige (contrato, punto 13): ahí el nombre sí va.
      if (p._datos.tipo !== 'forma') assert.ok(!p.datos.some(l => p.respuesta.valor.length > 3 && l.includes(p.respuesta.valor)), `${idea} ${s}: los datos traen la respuesta`);
      for (const a of p.alternativas.filter(x => !x.correcta)) assert.ok(a.error.explicacion.split(/\s+/).length <= 22, `${idea} ${s}: ${a.error.explicacion}`);
    }
    assert.deepEqual([...vistos].sort(), [...tipos].sort(), idea);
  }
});

test('papel con las seis ideas y niveles 1, 1, 1, 2, 2, 2, 3, 3', () => {
  const ps = Array.from({ length: 8 }, (_, i) => gen.generar(`papel-${i + 1}`));
  assert.equal(new Set(ps.map(p => p._datos.idea)).size, 6);
  assert.deepEqual(ps.map(p => p._datos.nivel), [1, 1, 1, 2, 2, 2, 3, 3]);
});

// Las afirmaciones V/F se rehacen con la ecuación: (g) o (s) en un producto, lado del reactivo y número de productos.
test('las afirmaciones V/F de la idea 1 dicen lo que la ecuación dice', () => {
  for (let s = 0; s < 400; s++) {
    const p = gen.generar(s, { idea: 'indicios' }); if (p._datos.tipo !== 'estados-vf') continue;
    const d = p._datos, [iz, de] = d.ec.split(' -> '), prods = de.split(' + '), reac = iz.split(' + ');
    const v1 = d.dice === 'gas' ? prods.some(x => x.endsWith('(g)')) : prods.some(x => x.endsWith('(s)')) && reac.every(x => x.endsWith('(ac)'));
    const v2 = reac.some(x => x.replace(/^\d+\s+/, '') === d.otra), v3 = d.nDice === prods.length;
    assert.equal(p.respuesta.valor, [v1, v2, v3].map(x => (x ? 'V' : 'F')).join(''), `${s} ${d.ec}`);
  }
});
