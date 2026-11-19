// Pruebas de «Filas, pisos y mesas» (rm-ordenamiento): un camino independiente que no usa el generador ni el motor
// (lee las pistas del texto que ve el alumno, en _datos.pistas, y prueba todos los arreglos), una sola respuesta en 600
// semillas, los tipos por idea, el recuadro «Datos», la paleta, casos.json y el papel.
const test = require('node:test');
const assert = require('node:assert/strict');
const gen = require('./generador.js');
const casos = require('./casos.json');
const papel = require('./papel.json');
const { probarGenerador, probarFugas } = require('../../nucleo/probar-generador.js');

const plano = x => (Array.isArray(x) ? x.map(plano).join('') : x && typeof x === 'object' ? String(x.t) : String(x));
const N = '([A-ZÁÉÍÓÚ][a-záéíóúñ]+)';
const NUMS = { un: 1, dos: 2, tres: 3, cuatro: 4, cinco: 5 };
const huecos = (gente, n) => { const out = [], ir = (pre, resto) => { if (pre.length === n) { if (!resto.length) out.push(pre); return; } if (n - pre.length > resto.length) ir(pre.concat(null), resto); resto.forEach((x, i) => ir(pre.concat(x), resto.slice(0, i).concat(resto.slice(i + 1)))); }; ir([], gente); return out; };
const L = (o, x) => o.indexOf(x) + 1;
const J = (o, a, b, n, circ) => { const d = Math.abs(o.indexOf(a) - o.indexOf(b)); return circ ? d === 1 || d === n - 1 : d === 1; };
function lector(n, circ) {
  return [
    [`^${N} está a la (izquierda|derecha) de ${N}$`, (a, d, b) => o => (d === 'izquierda' ? L(o, a) < L(o, b) : L(o, a) > L(o, b))],
    [`^${N} está inmediatamente a la derecha de ${N}$`, (a, b) => o => L(o, a) === L(o, b) + 1],
    [`^${N} (no )?está junto a ${N}$`, (a, no, b) => o => J(o, a, b, n) !== !!no],
    [`^${N} está en un extremo$`, a => o => L(o, a) === 1 || L(o, a) === n],
    [`^${N} está en el puesto (\\d)$`, (a, k) => o => L(o, a) === +k],
    [`^${N} vive (un|dos|tres|cuatro) pisos? más (arriba|abajo) que ${N}$`, (a, k, d, b) => o => (L(o, a) - L(o, b)) * (d === 'arriba' ? 1 : -1) === NUMS[k]],
    [`^${N} vive más arriba que ${N}$`, (a, b) => o => L(o, a) > L(o, b)],
    [`^${N} (no )?vive en el piso (\\d)$`, (a, no, p) => o => (L(o, a) === +p) !== !!no],
    [`^${N} llegó (un|dos|tres|cuatro|cinco) puestos? después que ${N}$`, (a, k, b) => o => L(o, a) - L(o, b) === NUMS[k]],
    [`^${N} llegó justo después de ${N}$`, (a, b) => o => L(o, a) - L(o, b) === 1],
    [`^${N} llegó antes que ${N}$`, (a, b) => o => L(o, a) < L(o, b)],
    [`^${N} no llegó primero$`, a => o => L(o, a) !== 1],
    [`^${N} se sienta a la (derecha|izquierda) de ${N}$`, (a, d, b) => o => o.indexOf(a) === (o.indexOf(b) + (d === 'derecha' ? 1 : n - 1)) % n],
    [`^${N} (no )?se sienta junto a ${N}$`, (a, no, b) => o => J(o, a, b, n, true) !== !!no],
    [`^${N} se sienta frente a ${N}$`, (a, b) => o => o.indexOf(a) === (o.indexOf(b) + n / 2) % n],
  ].map(([re, f]) => [new RegExp(re), f]);
}
const leer = (n, circ) => t => { const s = t.replace(/^Pista \d+: /, '').replace(/\.$/, ''); for (const [re, f] of lector(n, circ)) { const m = s.match(re); if (m) return f(...m.slice(1)); } throw new Error(`no sé leer «${t}»`); };
const edades = (gente, empates) => { const out = [], n = gente.length, ir = pre => { if (pre.length === n) { if (empates || new Set(pre).size === n) out.push(Object.fromEntries(gente.map((x, i) => [x, pre[i]]))); return; } for (let v = 1; v <= n; v++) ir(pre.concat(v)); }; ir([]); return out; };
const leerEdad = t => { const s = t.replace(/\.$/, ''); let m;
  if ((m = s.match(new RegExp(`^${N} (no )?es (mayor|menor) que ${N}$`)))) return e => ((m[3] === 'mayor' ? e[m[1]] > e[m[4]] : e[m[1]] < e[m[4]]) !== !!m[2]);
  if ((m = s.match(new RegExp(`^${N} y ${N} juntos recibieron (\\d+) soles$`))) || (m = s.match(new RegExp(`^Las edades de ${N} y ${N} suman (\\d+) años$`)))) return e => e[m[1]] + e[m[2]] === +m[3];
  if ((m = s.match(new RegExp(`^${N} recibió más que ${N}$`)))) return e => e[m[1]] > e[m[2]];
  if ((m = s.match(new RegExp(`^${N} y ${N} tienen la misma edad$`)))) return e => e[m[1]] === e[m[2]];
  throw new Error(`no sé leer «${t}»`); };
const permsV = xs => (xs.length <= 1 ? [xs.slice()] : xs.flatMap((x, i) => permsV(xs.slice(0, i).concat(xs.slice(i + 1))).map(p => [x].concat(p))));
// La silla de enfrente en la cuadrada, con coordenadas (no con la fórmula del generador).
const posQ = (i, k) => { const lado = Math.floor(i / k), t = (i % k + 0.5) / k; return [[-1 + 2 * t, -1.4], [1.4, -1 + 2 * t], [1 - 2 * t, 1.4], [-1.4, 1 - 2 * t]][lado]; };
const frenteQ = (i, k) => { const [x, y] = posQ(i, k), meta = Math.abs(y) > 1.2 ? [x, -y] : [-x, y]; return [...Array(4 * k).keys()].find(j => Math.hypot(posQ(j, k)[0] - meta[0], posQ(j, k)[1] - meta[1]) < 1e-9); };

// La respuesta (clave), calculada sin el generador ni el motor.
function recalcular(p) {
  const d = p._datos, pistas = (d.pistas || []).map(t => t.replace(/^Pista \d+: /, ''));
  const unica = vs => (new Set(vs).size === 1 ? vs[0] : null);
  if (d.forma === 'cuadrada') return `s:${frenteQ(d.pide.i, d.k)}`;
  if (['fila', 'pisos', 'llegada', 'mesa'].includes(d.forma)) {
    const circ = d.forma === 'mesa', fs = pistas.map(leer(d.n, circ));
    let base = huecos(d.gente, d.n);
    if (circ) base = base.filter(o => o[0] === d.gente[0]);
    const q = base.filter(o => fs.every(f => f(o)));
    if (!q.length) return null;
    const pi = d.pide;
    if (pi.t === 'puesto') return unica(q.map(o => `p:${o[pi.k - 1]}`));
    if (pi.t === 'lugar') return unica(q.map(o => `p:${L(o, pi.x)}`));
    if (pi.t === 'entre') return unica(q.map(o => `n:${Math.abs(L(o, pi.a) - L(o, pi.b)) - 1}`));
    if (pi.t === 'derecha' || pi.t === 'izquierda') return unica(q.map(o => `p:${o[(o.indexOf(pi.x) + (pi.t === 'derecha' ? 1 : d.n - 1)) % d.n]}`));
    if (pi.t === 'frente') return unica(q.map(o => `p:${o[(o.indexOf(pi.x) + d.n / 2) % d.n]}`));
    if (pi.t === 'segura') {
      const af = t => { const s = t.replace(/\.$/, ''); let m;
        if ((m = s.match(new RegExp(`^${N} está en el puesto (\\d)$`)))) return o => o[+m[2] - 1] === m[1];
        if ((m = s.match(new RegExp(`^${N} está junto a ${N}$`)))) return o => J(o, m[1], m[2], d.n);
        return null; };
      const ok = pi.opciones.filter(t => af(t) && q.every(af(t)));
      return ok.length === 1 ? `a:${ok[0]}` : null;
    }
  }
  if (d.forma === 'edades') {
    const q = edades(d.gente, false).filter(e => pistas.every(t => leerEdad(t)(e)));
    const orden = e => Object.keys(e).sort((a, b) => e[a] - e[b]);
    return unica(q.map(e => `p:${orden(e)[d.pide.desdeMayor ? d.gente.length - 1 - d.pide.k : d.pide.k]}`));
  }
  if (d.forma === 'empates') {
    const q = edades(d.gente, true).filter(e => pistas.every(t => leerEdad(t)(e)));
    const ok = d.pide.opciones.map((t, i) => [t, i]).filter(([t]) => !/^Nada/.test(t) && q.every(leerEdad(t)));
    return ok.length === 1 ? `a:${ok[0][1]}` : null;
  }
  if (d.forma === 'montos') {
    const q = permsV(d.valores).map(p => Object.fromEntries(d.gente.map((x, i) => [x, p[i]]))).filter(e => pistas.every(t => leerEdad(t)(e)));
    const pref = /soles/.test(pistas.join(' ')) ? 's' : 'e';
    return unica(q.map(e => `${pref}:${e[d.pide.x]}`));
  }
  return null;
}
probarGenerador(gen, { semillas: 600, recalcular, igual: (a, b) => a === b });
probarFugas(gen, { grupo: p => p._datos.tipo });

test('tipos por idea: generar(semilla, { idea }) da solo los tipos de esa idea, y las seis ideas tienen tipos', () => {
  const T = gen.TIPOS_POR_IDEA;
  assert.deepEqual(Object.keys(T), ['orden-lineal', 'posiciones', 'comparaciones', 'con-numeros', 'orden-circular', 'mesa-cuadrada']);
  for (const [idea, tipos] of Object.entries(T)) for (let s = 0; s < 60; s++) {
    const p = gen.generar(`i${s}`, { idea });
    assert.ok(tipos.includes(p._datos.tipo), `${idea}: tipo ${p._datos.tipo}`);
    assert.equal(p._datos.idea, idea);
  }
  // Hay nivel de examen en cada grupo de ideas.
  const niveles = new Set([...Array(300).keys()].map(s => gen.generar(s)._datos.nivel));
  assert.deepEqual([...niveles].sort(), [1, 2, 3]);
});

test('datos: lista de líneas cortas, con las pistas aparte del enunciado y sin la respuesta', () => {
  for (let s = 0; s < 400; s++) {
    const p = gen.generar(s), d = `semilla ${s}`;
    assert.ok(Array.isArray(p.datos) && p.datos.length >= 1 && p.datos.length <= 6, d);
    for (const l of p.datos) {
      assert.equal(typeof l, 'string', d);
      assert.ok((l.match(/[\p{L}\p{N}]+/gu) || []).length <= 22, `${d}: «${l}»`);
      assert.ok(!/^(Recuerda|Ojo|Cuidado|Fíjate|Primero)/.test(l), `${d}: consejo en datos`);
    }
    // Una afirmación correcta («Beto está junto a Ciro», «Ana es menor que Fito») no es una pista dicha tal cual.
    const correcta = p.alternativas.find(a => a.correcta).texto;
    if (/ (está|es|vive|se sienta) /.test(correcta)) assert.ok(!p.datos.some(l => l.includes(correcta)), `${d}: la respuesta en los datos`);
    assert.ok(!/Pista \d/.test(plano(p.enunciado) + plano(p.pregunta)), `${d}: pistas en el enunciado`);
  }
});

test('paleta de deducción: solo violeta (x), y solo en la solución', () => {
  for (let s = 0; s < 200; s++) {
    const p = gen.generar(s);
    assert.deepEqual(Object.keys(p.variables), ['x']);
    assert.equal(p.variables.x.color, 'f');
    const enPregunta = JSON.stringify([p.enunciado, p.pregunta]);
    assert.ok(!/"v":/.test(enPregunta), `semilla ${s}: color en la pregunta`);
    assert.ok(JSON.stringify(p.solucion).includes('"v":"x"'), `semilla ${s}: la solución no marca lo pedido`);
  }
});

test('casos.json: cada caso vuelve a salir igual y su respuesta la confirma el camino independiente', () => {
  assert.ok(casos.casos.length >= 15);
  for (const c of casos.casos) {
    const p = gen.generar(c.semilla, c.idea ? { idea: c.idea } : undefined);
    assert.deepEqual(p._datos, c.entrada, `semilla ${c.semilla}`);
    assert.equal(p.respuesta.valor, c.esperado.clave, `semilla ${c.semilla}`);
    assert.equal(p.respuesta.texto, c.esperado.texto, `semilla ${c.semilla}`);
    assert.equal(recalcular(p), c.esperado.clave, `semilla ${c.semilla}`);
  }
});

test('papel: 8 problemas al día con el generador, con sus datos', () => {
  assert.equal(papel.problemas.length, 8);
  for (const pr of papel.problemas) assert.match(pr.enunciado, / Datos: /);
});

// Auditoría de Ordenamiento (19 nov): nombres con mayúscula, «la menor» para ellas y la misma línea de palabras que la teoría.
test('auditoría: ningún nombre en minúscula, el artículo concuerda y la línea de palabras es la de la teoría', () => {
  const NOM = ['Ana', 'Beto', 'Ciro', 'Dina', 'Eva', 'Fito', 'Rosa', 'Iván', 'Leo'], ELLAS = new Set(['Ana', 'Dina', 'Eva', 'Rosa']);
  const re = new RegExp(`\\b(${NOM.map(x => x.toLowerCase()).join('|')})\\b`);
  const plano = x => (Array.isArray(x) ? x.map(plano).join('') : x && typeof x === 'object' ? plano(x.t) : String(x || ''));
  const teoria = require('../../contenido/teoria/razonamiento-matematico/ordenamiento-de-informacion.js');
  for (const idea of Object.keys(gen.TIPOS_POR_IDEA)) for (let s = 0; s < 200; s++) {
    const p = gen.generar(s, { idea });
    const t = plano(p.solucion) + p.alternativas.map(a => (a.error ? a.error.explicacion : '')).join(' ');
    assert.ok(!re.test(t), `${idea} semilla ${s}: ${(t.match(re) || [])[0]}`);
    for (const x of ELLAS) assert.ok(!new RegExp(`${x} es el (mayor|menor)`).test(t), `${idea} semilla ${s}`);
    for (const d of p.datos) if (/^A la izquierda de: no obliga/.test(d)) {
      const linea = teoria.ideas[0].ahoraTu.generar(0).datos.find(x => /^A la izquierda de: no obliga/.test(x));
      assert.equal(d, linea, 'la misma línea que la teoría');
    }
  }
});
