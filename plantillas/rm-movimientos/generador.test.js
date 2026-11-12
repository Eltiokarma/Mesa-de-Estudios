// Pruebas del generador de movimientos mínimos: casos.json (verificados aparte), papel.json y un
// recálculo independiente en cada uno de 600 problemas. El generador busca en anchura; aquí se recalcula
// por otro camino: profundidad iterativa (canoa, tubo y fichas) o relajación de distancias hasta que no
// cambian (caballo y fila), con reglas escritas de nuevo desde el enunciado.
const test = require('node:test');
const assert = require('node:assert/strict');
const gen = require('./generador.js');
const casos = require('./casos.json');
const papel = require('./papel.json');
const { probarGenerador } = require('../../nucleo/probar-generador.js');

// ---- Profundidad iterativa con memoria (no repite un estado con menos presupuesto) ----
function iddfs(inicio, hijos, meta, clave, tope = 20) {
  for (let L = 0; L <= tope; L++) {
    const visto = new Map();
    const dfs = (e, r) => {
      if (meta(e)) return true;
      if (r === 0) return false;
      const k = clave(e);
      if ((visto.get(k) ?? -1) >= r) return false;
      visto.set(k, r);
      for (const x of hijos(e)) if (dfs(x, r - 1)) return true;
      return false;
    };
    if (dfs(inicio, L)) return L;
  }
  return NaN;
}

// Canoa: estado { izq: Set de índices, canoa: 'izq' | 'der' }.
function canoaIndep(d) {
  const N = d.gente.length, todos = [...Array(N).keys()];
  const cuida = i => d.gente[i].rema && (d.guarda !== 'campesino' || d.gente[i].nombre === 'el campesino');
  const seguro = grupo => grupo.some(cuida) || !d.choques.some(([a, b]) => grupo.includes(a) && grupo.includes(b));
  const subconjuntos = arr => arr.reduce((acc, x) => acc.concat(acc.map(s => s.concat(x))), [[]]).filter(s => s.length);
  const hijos = ({ izq, canoa }) => {
    const aca = canoa === 'izq' ? izq : todos.filter(i => !izq.includes(i));
    return subconjuntos(aca).filter(s => s.some(i => d.gente[i].rema)
      && (d.modo !== 'cupo' || s.length <= d.cupo)
      && (d.modo !== 'peso' || s.reduce((t, i) => t + d.gente[i].peso, 0) <= d.limite))
      .map(s => ({ izq: canoa === 'izq' ? izq.filter(i => !s.includes(i)) : izq.concat(s).sort(), canoa: canoa === 'izq' ? 'der' : 'izq' }))
      .filter(e => seguro(e.izq) && seguro(todos.filter(i => !e.izq.includes(i))));
  };
  return iddfs({ izq: todos, canoa: 'izq' }, hijos, e => e.izq.length === 0 && e.canoa === 'der', e => e.izq.join() + e.canoa, 15);
}
// Caballo y fila: distancias que se relajan hasta que dejan de cambiar.
function relajar(nodos, vecinos, a, b) {
  const dist = new Map(nodos.map(x => [x, Infinity])); dist.set(a, 0);
  for (let cambio = true; cambio;) {
    cambio = false;
    for (const x of nodos) if (dist.get(x) < Infinity) for (const y of vecinos(x)) if (dist.get(x) + 1 < dist.get(y)) { dist.set(y, dist.get(x) + 1); cambio = true; }
  }
  return dist.get(b);
}
function caballoIndep(d) {
  const nodos = [];
  for (let c = 0; c < d.columnas; c++) for (let f = 0; f < d.filas; f++) if (!d.bloqueadas.some(([x, y]) => x === c && y === f)) nodos.push(c + ':' + f);
  const set = new Set(nodos);
  const vec = k => { const [c, f] = k.split(':').map(Number); const r = []; for (const dc of [-2, -1, 1, 2]) for (const df of [-2, -1, 1, 2]) if (Math.abs(dc) !== Math.abs(df) && set.has((c + dc) + ':' + (f + df))) r.push((c + dc) + ':' + (f + df)); return r; };
  const k = p => p[0] + ':' + p[1];
  return d.C ? relajar(nodos, vec, k(d.A), k(d.C)) + relajar(nodos, vec, k(d.C), k(d.B)) : relajar(nodos, vec, k(d.A), k(d.B));
}
function saltoIndep(d) {
  const nodos = [...Array(d.n).keys()].map(i => i + 1);
  const pasos = d.modo === 'dos-saltos' ? [d.p, -d.p, d.q, -d.q] : [d.p, -d.q];
  return relajar(nodos, x => pasos.map(k => x + k).filter(y => y >= 1 && y <= d.n), d.s, d.t);
}
// Tubo: estado [contenido del tubo como texto, bolas en la mesa ordenadas].
function tuboIndep(d) {
  const hijos = ([t, m]) => {
    const r = [];
    const bocas = d.bocas === 2 ? ['ini', 'fin'] : ['ini'];
    for (const b of bocas) {
      if (t.length) r.push(b === 'ini' ? [t.slice(1), (m + t[0]).split('').sort().join('')] : [t.slice(0, -1), (m + t[t.length - 1]).split('').sort().join('')]);
      for (const x of new Set(m)) {
        if (b === 'fin' && !t.length) continue;
        const resto = m.replace(x, '');
        r.push(b === 'ini' ? [x + t, resto] : [t + x, resto]);
      }
    }
    return r;
  };
  return iddfs([d.inicio.join(''), ''], hijos, ([t, m]) => !m && t === d.meta.join(''), e => e.join('|'), 14);
}
// Fichas: dos vecinas a dos vacías vecinas que no se tocan con las de origen.
function cumplePares(s, meta) {
  const f = s.replace(/^_+/, '').replace(/_+$/, '');
  if (f.includes('_')) return false;
  let cambios = 0; for (let i = 1; i < f.length; i++) if (f[i] !== f[i - 1]) cambios++;
  return meta === 'alternar' ? cambios === f.length - 1 : cambios === 1;
}
function paresIndep(d) {
  const hijos = s => {
    const r = [];
    for (let i = 0; i < s.length - 1; i++) {
      if (s[i] === '_' || s[i + 1] === '_') continue;
      for (let j = 0; j < s.length - 1; j++) {
        if (s[j] !== '_' || s[j + 1] !== '_' || Math.abs(i - j) < 2) continue;
        const a = s.split(''); const par = [a[i], a[i + 1]];
        a[i] = a[i + 1] = '_'; a[j] = par[0]; a[j + 1] = par[1];
        r.push(a.join(''));
      }
    }
    return r;
  };
  return iddfs(d.inicio, hijos, s => cumplePares(s, d.meta), s => s, 10);
}
function recalcular(p) {
  const d = p._datos;
  return { canoa: canoaIndep, caballo: caballoIndep, salto: saltoIndep, tubo: tuboIndep, pares: paresIndep }[d.tipo](d);
}
probarGenerador(gen, { semillas: 600, recalcular });

test('salen los cinco tipos y sus variantes en 200 semillas', () => {
  const vistos = new Set();
  for (let s = 0; s < 200; s++) {
    const d = gen.generar(s)._datos;
    vistos.add(d.tipo); vistos.add(d.tipo + ':' + (d.tipo === 'tubo' ? d.bocas : d.modo || d.meta || (d.C ? 'via' : 'directo')));
  }
  for (const t of ['canoa:peso', 'canoa:cupo', 'caballo:via', 'caballo:directo', 'salto:dos-saltos', 'salto:avanza-retrocede', 'tubo:1', 'tubo:2', 'pares:alternar', 'pares:separar'])
    assert.ok(vistos.has(t), `no salió ${t}`);
});

test('la solución mostrada es válida paso a paso y su largo es la respuesta', () => {
  for (let s = 0; s < 300; s++) {
    const p = gen.generar(s), d = p._datos, sol = gen.calc.minimo(d);
    assert.equal(sol.movs.length, p.respuesta.valor, `semilla ${s}`);
    if (d.tipo === 'canoa') {
      let izq = new Set(d.gente.map((g, i) => i)), lado = 'izq';
      sol.movs.forEach(ids => {
        assert.ok(ids.some(i => d.gente[i].rema), `semilla ${s}: viaje sin remero`);
        if (d.modo === 'peso') assert.ok(ids.reduce((t, i) => t + d.gente[i].peso, 0) <= d.limite);
        else assert.ok(ids.length <= d.cupo);
        ids.forEach(i => { assert.equal(izq.has(i), lado === 'izq', `semilla ${s}: viaja alguien que no está con la canoa`); lado === 'izq' ? izq.delete(i) : izq.add(i); });
        lado = lado === 'izq' ? 'der' : 'izq';
        for (const orilla of [[...izq], d.gente.map((g, i) => i).filter(i => !izq.has(i))])
          if (!orilla.some(i => d.gente[i].rema && (d.guarda !== 'campesino' || i === 0))) assert.ok(!d.choques.some(([a, b]) => orilla.includes(a) && orilla.includes(b)), `semilla ${s}: choque en una orilla`);
      });
      assert.equal(izq.size, 0); assert.equal(p.respuesta.valor % 2, 1, 'los viajes de una canoa que termina en la otra orilla son impares');
    }
    if (d.tipo === 'caballo') {
      sol.camino.slice(1).forEach((e, i) => {
        const a = sol.camino[i], dx = Math.abs(e[0] - a[0]), dy = Math.abs(e[1] - a[1]);
        assert.ok((dx === 1 && dy === 2) || (dx === 2 && dy === 1), `semilla ${s}: no es salto de caballo`);
        assert.ok(e[0] >= 0 && e[1] >= 0 && e[0] < d.columnas && e[1] < d.filas);
        assert.ok(!d.bloqueadas.some(b => b[0] === e[0] && b[1] === e[1]));
      });
      if (d.C) assert.ok(sol.camino.some(e => e[0] === d.C[0] && e[1] === d.C[1]));
      assert.deepEqual(sol.camino[sol.camino.length - 1], d.B);
    }
    if (d.tipo === 'salto') {
      const ok = d.modo === 'dos-saltos' ? [d.p, -d.p, d.q, -d.q] : [d.p, -d.q];
      sol.camino.slice(1).forEach((x, i) => { assert.ok(ok.includes(x - sol.camino[i])); assert.ok(x >= 1 && x <= d.n); });
      assert.equal(sol.camino[sol.camino.length - 1], d.t);
    }
    if (d.tipo === 'tubo') {
      let t = d.inicio.slice(), m = [];
      sol.movs.forEach(mv => {
        if (mv.sacar !== undefined) { const b = mv.boca === 0 ? t.shift() : t.pop(); assert.equal(b, mv.sacar); m.push(b); }
        else { assert.ok(m.includes(mv.meter)); m.splice(m.indexOf(mv.meter), 1); if (mv.boca === 0) t.unshift(mv.meter); else t.push(mv.meter); }
        if (d.bocas === 1) assert.equal(mv.boca, 0, 'el tubo de ensayo solo tiene la boca de arriba');
      });
      assert.deepEqual(t, d.meta); assert.equal(m.length, 0);
    }
    if (d.tipo === 'pares') assert.ok(cumplePares(sol.camino[sol.camino.length - 1], d.meta));
  }
});

test('los distractores dicen lo que dicen', () => {
  for (let s = 0; s < 400; s++) {
    const p = gen.generar(s), n = p.respuesta.valor;
    for (const a of p.alternativas.filter(x => !x.correcta)) {
      const id = a.error.id;
      if (id === 'RMP14-sin-regresos') assert.equal(a.valor, (n + 1) / 2);
      if (id === 'RMP14-regreso-final' || id === 'RMP1-estados') assert.equal(a.valor, n + 1);
      if (id === 'RMP18-sacar-y-meter') assert.equal(a.valor, n / 2);
      if (id === 'RMP18-fichas') assert.equal(a.valor, 2 * n);
      if (/^RMP2-/.test(id)) assert.ok(a.valor > n, `semilla ${s}: ${id} debe ser una estrategia más larga`);
      if (/^RMP19-|^RMP11-|^RMP15-(bloqueada|boca-cerrada|hija-cuida)/.test(id)) assert.ok(a.valor < n, `semilla ${s}: ${id} relaja una regla y debe salir menos`);
    }
  }
});

for (const c of casos.casos) {
  test(`casos.json: semilla ${c.semilla}`, () => {
    const p = gen.generar(c.semilla);
    assert.deepEqual(p._datos, c.entrada, 'el generador cambió: recalcula casos.json');
    assert.equal(p.respuesta.valor, c.esperado.respuesta);
  });
}

function parcial(real, espera, que) {
  for (const [k, val] of Object.entries(espera)) {
    if (val && typeof val === 'object' && !Array.isArray(val)) parcial(real[k], val, `${que}.${k}`);
    else assert.deepEqual(real[k], val, `${que}.${k}`);
  }
}
for (const pr of papel.problemas) {
  test(`papel ${pr.id}: la respuesta sale del cálculo y del cálculo independiente`, () => {
    for (const vf of pr.verificar) {
      parcial(gen.calc[vf.fn](...vf.args), vf.espera, `${pr.id}.${vf.fn}`);
      if (vf.espera.n !== undefined) assert.equal(recalcular({ _datos: vf.args[0] }), vf.espera.n);
    }
  });
}
