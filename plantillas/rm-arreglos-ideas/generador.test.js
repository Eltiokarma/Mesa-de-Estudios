// Pruebas del generador rm-arreglos-ideas: casos.json (verificados aparte, scratchpad e9-rm/casos.py), los tipos por idea,
// los Datos de cada tipo y un recálculo independiente en 300 problemas por idea. El recálculo no usa las cuentas del
// generador: lee el texto que ve el alumno y prueba todos los acomodos (todas las permutaciones de las tarjetas del marco,
// todos los subconjuntos de la lista), arma el muro fila por fila y busca el centro del multiplicativo probando enteros.
const test = require('node:test');
const assert = require('node:assert/strict');
const gen = require('./generador.js');
const casos = require('./casos.json');
const { probarGenerador } = require('../../nucleo/probar-generador.js');

const plano = x => (Array.isArray(x) ? x.map(plano).join('') : x && typeof x === 'object' ? String(x.t ?? x.texto ?? '') : String(x ?? ''));
const num = s => +String(s).replace(/[\s  ]/g, '').replace(',', '.');
const nums = s => (s.match(/\d[\d   ]*\d|\d/g) || []).map(num);
const suma = xs => xs.reduce((a, b) => a + b, 0);
const subs = (xs, k) => (k === 0 ? [[]] : xs.length < k ? [] : subs(xs.slice(1), k - 1).map(s => [xs[0]].concat(s)).concat(subs(xs.slice(1), k)));
const perms = xs => (xs.length <= 1 ? [xs.slice()] : xs.flatMap((v, i) => perms(xs.slice(0, i).concat(xs.slice(i + 1))).map(p => [v].concat(p))));
const PAL = { dos: 2, tres: 3, cuatro: 4, cinco: 5, uno: 1 };
const lista = t => { const m = t.match(/(impares|pares)? ?del (\d+) al (\d+)/); const o = []; for (let x = +m[2]; x <= +m[3]; x += m[1] ? 2 : 1) o.push(x); return o; };
const cima = b => { while (b.length > 1) b = b.slice(1).map((x, i) => b[i] + x); return b[0]; };
function sumasMarco(ns, L, esq) {   // todas las permutaciones de esquinas y medios
  const out = new Set();
  for (const e of esq ? [esq] : subs(ns, L)) {
    const resto = ns.filter(x => !e.includes(x));
    for (const v of perms(e)) for (const m of perms(resto)) { const Ls = v.map((a, k) => a + m[k] + v[(k + 1) % L]); if (Ls.every(x => x === Ls[0])) out.add(Ls[0]); }
  }
  return [...out].sort((a, b) => a - b);
}
function recalcular(p) {
  const t = `${plano(p.enunciado)} ${plano(p.pregunta)}`.replace(/\s+/g, ' '), d = p._datos;
  const L = /triangular/.test(t) ? 3 : /cuadrado/.test(t) ? 4 : 5;
  switch (d.tipo) {
    case 'grupos': case 'falta': {
      const ns = lista(t), k = PAL[t.match(/en (\w+) filas/)[1]], S = suma(ns) / k;
      if (d.tipo === 'grupos') return S;
      return S - suma(nums(t.match(/tiene ([\d, y]+)\./)[1]));
    }
    case 'se-puede': {
      const ns = nums(t.match(/tarjetas ([\d, y]+)\./)[1]), T = suma(ns);
      if (T % 2) return 'impar';
      for (let k = 1; k < ns.length; k++) if (subs(ns, k).some(g => suma(g) * 2 === T)) return 'si';
      return 'par';
    }
    case 'lado': { const s = sumasMarco(lista(t), L, nums(t.match(/esquinas son ([\d, y]+?) y los/)[1])); assert.equal(s.length, 1, t); return s[0]; }
    case 'esquinas': { const ns = lista(t), S = +t.match(/cada lado suma (\d+)/)[1], V = L * S - suma(ns); assert.ok(subs(ns, L).some(e => suma(e) === V), t); return V; }
    case 'cruz': {
      const ns = lista(t), c = +t.match(/con el (\d+) en el centro/)[1], r = ns.filter(x => x !== c), out = new Set();
      for (const g of subs(r, 2)) if (suma(g) * 2 === suma(r)) out.add(suma(g) + c);
      assert.equal(out.size, 1, t); return [...out][0];
    }
    case 'mayor': case 'menor': case 'diferencia': { if (L === 5) return gen.calc.resolver(d); const s = sumasMarco(lista(t), L); return d.tipo === 'mayor' ? s[s.length - 1] : d.tipo === 'menor' ? s[0] : s[s.length - 1] - s[0]; }
    case 'suma3': return suma(nums(t.match(/número: ([\d, y]+)\./)[1])) / 3;
    case 'opuesta': { const [c, a] = nums(t.split('3 × 3')[1]); return 3 * c - a - c; }
    case 'suma4': return suma(lista(t)) / 4;
    case 'centro': { const P = num(t.match(/da ([\d  ]+) \(/)[1]); for (let c = 1; c < 100; c++) if (c * c * c === P) return c; return null; }
    case 'opuestaP': { const [c, a] = nums(t.split('3 × 3')[1]); return c * c / a; }
    case 'filaP': { const [P, a, b] = nums(t.split('3 × 3')[1]); return P / (a * b); }
    case 'cima': return cima(nums(t.match(/abajo: ([\d, y]+), en/)[1]));
    case 'base': {
      const C = num(t.match(/cima vale ([\d ]+)\./)[1]), base = t.match(/Abajo están ([\d, ?]+)\./)[1].split(',').map(x => x.trim());
      const xs = []; for (let x = 1; x <= 80; x++) if (cima(base.map(v => (v === '?' ? x : +v))) === C) xs.push(x);
      assert.equal(xs.length, 1, t); return xs[0];
    }
    case 'mayorCima': return Math.max(...perms(nums(t.match(/tarjetas ([\d, y]+) van/)[1])).map(cima));
  }
  throw new Error(d.tipo);
}

test('casos.json: cada caso da la respuesta esperada (resuelta aparte)', () => {
  assert.equal(casos.casos.length, 18);
  for (const c of casos.casos) {
    const p = gen.generar(c.semilla, c.opciones);
    assert.deepEqual(Object.assign({}, p._datos), c.entrada, c.semilla);
    assert.equal(p.respuesta.valor, c.esperado.respuesta, c.semilla);
  }
});

test('tipos por idea: cada idea da solo sus tipos, con 300 semillas, y el recálculo coincide', () => {
  for (const [idea, tipos] of Object.entries(gen.TIPOS_POR_IDEA)) for (let s = 0; s < 300; s++) {
    const p = gen.generar(`t-${s}`, { idea });
    assert.ok(tipos.includes(p._datos.tipo), `${idea} ${s}`);
    assert.equal(p.alternativas.filter(a => a.correcta).length, 1);
    assert.ok(p.alternativas.length >= 4, `${idea} ${s}`);
    assert.equal(p.respuesta.valor, recalcular(p), `${idea} ${s}: ${plano(p.enunciado)} ${plano(p.pregunta)}`);
  }
});

test('Datos: lista no vacía, líneas de 22 palabras o menos, sin consejos', () => {
  for (const idea of Object.keys(gen.TIPOS_POR_IDEA)) for (let s = 0; s < 100; s++) {
    const p = gen.generar(`d-${s}`, { idea });
    assert.ok(Array.isArray(p.datos) && p.datos.length > 0);
    for (const l of p.datos) {
      assert.ok((l.match(/[\p{L}\d]+/gu) || []).length <= 22, l);
      assert.ok(!/^(Recuerda|Ojo|Cuidado|No olvides|Ten en cuenta|Fíjate|Conviene|Primero)/.test(l), l);
    }
    assert.ok(!/\bnull\b|\bNaN\b|\bundefined\b/.test(plano(p.enunciado) + plano(p.pregunta) + p.datos.join(' ') + p.alternativas.map(a => a.texto).join(' ') + JSON.stringify(p.solucion)), `${idea} ${s}`);
  }
});

probarGenerador(gen, { semillas: 300, recalcular, igual: (a, b) => a === b || Math.abs(a - b) < 1e-9 });

// Auditoría (26 nov): en «centro», los Datos traían una tabla de cubos con la respuesta («15 → 3375»). Ahora traen los
// factores de P, y el centro no es primo (343 = 7 × 7 × 7 lo diría).
test('rm-arreglos-ideas: los Datos del centro no traen la respuesta', () => {
  for (let s = 0; s < 300; s++) {
    const p = gen.generar(s, { idea: 'producto-magico' });
    if (p._datos.tipo !== 'centro') continue;
    const c = p.respuesta.valor, ds = p.datos.map(plano);
    assert.ok(!ds.some(d => /→/.test(d)), ds.join(' | '));
    const f = ds.find(d => / = [\d ×]+$/.test(d));
    assert.ok(f && nums(f.split(' = ')[1]).some(q => q !== c), `semilla ${s}: ${f}`);
  }
});
