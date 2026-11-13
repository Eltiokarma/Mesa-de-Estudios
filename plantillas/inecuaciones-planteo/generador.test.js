// Pruebas del generador de inecuaciones y desigualdades en problemas: casos.json (verificados
// aparte, a ciegas), un recálculo independiente en cada uno de 600 problemas y propiedades.
// El recálculo va por otro camino: fuerza bruta sobre los enteros, barridos numéricos y, en los
// intervalos, pertenencia punto por punto (no se arma el intervalo con la misma fórmula).
const test = require('node:test');
const assert = require('node:assert/strict');
const gen = require('./generador.js');
const casos = require('./casos.json');
const papel = require('./papel.json');
const { probarGenerador } = require('../../nucleo/probar-generador.js');

// ---------- Claves ----------
const valorFrac = t => { const [n, d] = t.split('/').map(Number); return n / d; };
function enClave(clave, t) {
  const cuerpo = clave.slice(4);
  if (cuerpo === '') return false;
  return cuerpo.split('|').some(pieza => {
    const [lo, lc, hi, hc] = pieza.split(',');
    const e = 1e-9;
    const okLo = lo === '-inf' || t > valorFrac(lo) + e || (Math.abs(t - valorFrac(lo)) <= e && lc === '1');
    const okHi = hi === 'inf' || t < valorFrac(hi) - e || (Math.abs(t - valorFrac(hi)) <= e && hc === '1');
    return okLo && okHi;
  });
}
function igual(esperado, valor) {
  if (typeof valor === 'number') return Math.abs(esperado - valor) < 1e-6 * Math.max(1, Math.abs(valor));
  if (valor.startsWith('num:')) return Math.abs(esperado - valorFrac(valor.slice(4))) < 1e-6;
  return esperado.every(([t, dentro]) => enClave(valor, t) === dentro);
}

// ---------- Recálculo independiente ----------
const cumple = (val, rel, c) => ({ '>': val > c, '<': val < c, '≥': val >= c, '≤': val <= c })[rel];
function unico(lista) { assert.equal(lista.length, 1, `se esperaba un solo valor y hay ${lista.length}`); return lista[0]; }

function recalcular(p) {
  const d = p._datos;
  if (d.tipo === 'entero-unico' && d.sub === 'ventas') {
    const L = []; for (let n = 1; n <= 2000; n++) if ((n - d.k1) * d.b > d.a * n && (n - d.k1 - d.k2) * d.d < d.c * n) L.push(n);
    return unico(L);
  }
  if (d.tipo === 'entero-unico') {
    const L = []; for (let x = 1; x <= 2000; x++) { const l = d.m * x + d.c; if (l > 0 && x + l > d.T && x + d.e > l) L.push(l); }
    return unico(L);
  }
  if (d.tipo === 'dos-enteros') {
    const S = [];
    for (let x = 1; x <= 300; x++) for (let y = 1; y <= 300; y++) if (d.ineqs.every(([a, b, rel, c]) => cumple(a * x + b * y, rel, c))) S.push([x, y]);
    assert.ok(S.every(([x, y]) => x < 200 && y < 200), 'región no acotada');
    const f = { suma: ([x, y]) => x + y, producto: ([x, y]) => x * y, 'max-suma': ([x, y]) => x + y, 'max-x': ([x]) => x }[d.pedido];
    if (d.sub === 'unico') return f(unico(S));
    return S.map(f).reduce((a, b) => Math.max(a, b));
  }
  if (d.tipo === 'cuadratica-entera') {
    const L = []; for (let n = 1; n <= 1000; n++) if (n > d.b && n * (n + d.a) > d.A && n * (n - d.b) < d.B) L.push(n);
    return unico(L);
  }
  if (d.tipo === 'area' && d.sub === 'perimetro-comun') {
    let mejor = -1;
    for (let largo = 1; largo < 2 * d.s; largo++) { const ancho = 2 * d.s - largo; if (largo >= ancho && largo * ancho >= d.s * d.s - d.D) mejor = Math.max(mejor, largo); }
    return mejor;
  }
  if (d.tipo === 'area') {
    const L = [];
    for (let x = d.b + 1; x <= 500; x++) { const s = x * (x + d.a) + (x + d.c) * (x - d.b); if (s > d.B && s < d.A) L.push(x + x + (x + d.a) + (x + d.a)); }
    return unico(L);
  }
  if (d.tipo === 'discriminante' && d.sub === 'menor-entero') {
    // En x = i/(2a) (la rejilla contiene al vértice): a·x² + b·x + k > 0 ⟺ i² + 2b·i + 4a·k > 0.
    for (let k = -50; k <= 2000; k++) {
      let ok = true; for (let i = -400; i <= 400 && ok; i++) if (i * i + 2 * d.b * i + 4 * d.a * k <= 0) ok = false;
      if (ok) return k;
    }
    return NaN;
  }
  if (d.tipo === 'discriminante' && d.sub === 'contexto') {
    let max = -Infinity; for (let i = 0; i <= 10000; i++) { const t = i / 1000; max = Math.max(max, -5 * t * t + d.v * t + d.h0); }
    return Math.floor(max + 1e-9) + 1;
  }
  if (d.tipo === 'discriminante') {
    const puntos = [];
    for (let i = -60; i <= 60; i++) {
      const k = i / 4;
      let ok = true;
      for (let j = -5000; j <= 5000 && ok; j++) { const x = j / 100, val = k * x * x + d.b * x + k; if (d.positivo ? val <= 0 : val >= 0) ok = false; }
      puntos.push([k, ok]);
    }
    return puntos;
  }
  if (d.tipo === 'moviles') {
    let p = -Infinity; for (let i = 0; i <= 2000; i++) { const x = i / 2; if (x * x - (d.r1 + d.r2) * x + d.r1 * d.r2 <= 0) p = Math.max(p, x); }
    let q = null; for (let x = -10; x <= 200 && q === null; x++) if (x * x - (d.s1 + d.s2) * x + d.s1 * d.s2 < 0) q = x;
    // Simulación del encuentro con paso de 0,001 h.
    let xa = p, xb = q, t = 0; while (xa > xb + 1e-9) { xa -= d.vA * 0.001; xb += d.vB * 0.001; t += 0.001; }
    return Math.abs(t - (p - q) / (d.vA + d.vB)) < 0.002 ? (p - q) / (d.vA + d.vB) : t;
  }
  if (d.tipo === 'racional' && d.sub === 'homografica') {
    const E = x => (d.p * x + d.q) / (x + d.r);
    const dentroX = x => {
      const e = 1e-7;
      if (Math.abs(x - d.a) < e) return d.izqCerrado;
      if (Math.abs(x - d.b) < e) return !d.izqCerrado;
      return x > d.a && x < d.b;
    };
    const ys = [E(d.a), E(d.b)];
    const extra = [];
    for (const y of ys) extra.push(y - 1e-4, y + 1e-4, y - 0.3, y + 0.3);
    for (let i = 0; i <= 10; i++) extra.push(E(d.a + (d.b - d.a) * i / 10));
    return [...ys, ...extra].map(y => [y, Math.abs(y - d.p) > 1e-12 && dentroX((d.q - d.r * y) / (y - d.p))]);
  }
  if (d.tipo === 'racional') {
    // Barrido con paso 0,001 desde a (entero): la rejilla pasa por x = 0.
    let max = -Infinity; for (let i = 0; i <= 1000 * (d.b - d.a); i++) { const x = d.a + i / 1000; max = Math.max(max, d.k / (x * x + d.c)); }
    return max;
  }
  if (d.tipo === 'medias') {
    const ex = d.muro ? 1 : 2, L = y => ex * d.A / y + (d.k + 2) * y;
    let lo = 0.01, hi = 10000;
    for (let i = 0; i < 300; i++) { const m1 = lo + (hi - lo) / 3, m2 = hi - (hi - lo) / 3; if (L(m1) < L(m2)) hi = m2; else lo = m1; }
    return L((lo + hi) / 2);
  }
  if (d.tipo === 'valor-absoluto') {
    const pts = [];
    for (let i = -100; i <= 100; i++) {
      const x = i / 4, a = d.A[0] * x + d.A[1], b = d.B[0] * x + d.B[1];
      pts.push([x, Math.abs(a) + Math.abs(b) <= Math.abs(a + b) + 1e-12]);
    }
    return pts;
  }
  if (d.sub === 'ganancia') {
    let best = -1;
    for (let x = 0; x <= 100; x++) for (let y = 0; y <= 100; y++) if (d.a1 * x + d.b1 * y <= d.R1 && d.a2 * x + d.b2 * y <= d.R2) best = Math.max(best, d.c * x + d.d * y);
    return best;
  }
  let min = Infinity;
  for (let x = 0; x <= 100; x++) for (let y = 0; y <= 100; y++) if (d.u1 * x + d.v1 * y >= d.R1 && d.u2 * x + d.v2 * y >= d.R2) min = Math.min(min, d.ca * x + d.cb * y);
  return d.presupuesto - min;
}
probarGenerador(gen, { semillas: 600, recalcular, igual });

// ---------- casos.json ----------
for (const c of casos.casos) {
  test(`casos.json: semilla ${c.semilla}`, () => {
    const p = gen.generar(c.semilla);
    assert.deepEqual(p._datos, c.entrada, 'el generador cambió: recalcula casos.json');
    const valor = typeof p.respuesta.valor === 'string' && p.respuesta.valor.startsWith('num:') ? valorFrac(p.respuesta.valor.slice(4)) : p.respuesta.valor;
    if (typeof c.esperado.respuesta === 'number') assert.ok(Math.abs(valor - c.esperado.respuesta) <= casos.tolerancia, `da ${valor}`);
    else assert.equal(p.respuesta.texto, c.esperado.respuesta);
    assert.equal(p.alternativas.find(a => a.correcta).texto, c.esperado.exacta);
  });
}

// ---------- Propiedades ----------
const PROBLEMAS = Array.from({ length: 600 }, (_, s) => gen.generar(s));
const plano = partes => partes.map(x => (typeof x === 'string' ? x : x.t)).join('');

test('salen todos los tipos y subtipos', () => {
  const vistos = new Set(PROBLEMAS.map(p => `${p._datos.tipo}/${p._datos.sub || ''}`));
  assert.deepEqual([...vistos].sort(), ['area/dos-rectangulos', 'area/perimetro-comun', 'cuadratica-entera/', 'discriminante/contexto', 'discriminante/intervalo', 'discriminante/menor-entero',
    'dos-enteros/maximo', 'dos-enteros/unico', 'entero-unico/dos-personas', 'entero-unico/ventas', 'lineal-entera/ganancia', 'lineal-entera/sobrante', 'medias/', 'moviles/',
    'racional/cuadrado', 'racional/homografica', 'valor-absoluto/mismo', 'valor-absoluto/opuestos']);
  const pedidos = new Set(PROBLEMAS.filter(p => p._datos.pedido).map(p => p._datos.pedido));
  assert.deepEqual([...pedidos].sort(), ['max-suma', 'max-x', 'producto', 'suma']);
});

test('las alternativas tienen la misma forma', () => {
  const forma = t => {
    if (/^(ℝ|∅|[⟨[].*[\]⟩])$/.test(t)) return 'intervalo';
    if (/^−?\d+(\/\d+)?$/.test(t) && !/^\d+$/.test(t)) return 'fraccion-o-entero';
    return t.replace(/[\d ,]+/g, '#');
  };
  for (const [s, p] of PROBLEMAS.entries()) {
    const alt = p.alternativas.map(a => a.texto);
    if (p._datos.sub === 'cuadrado') { assert.ok(alt.every(t => /^\d+(\/\d+)?$/.test(t)), `semilla ${s}: ${alt}`); continue; }
    const formas = new Set(alt.map(forma));
    assert.equal(formas.size, 1, `semilla ${s}: formas distintas (${alt.join(' | ')})`);
    for (const t of alt) assert.ok(!/\d,\d{3}/.test(t), `semilla ${s}: más de dos decimales (${t})`);
  }
});

test('ningún distractor da la respuesta correcta', () => {
  for (const [s, p] of PROBLEMAS.entries()) {
    const esperado = recalcular(p);
    for (const a of p.alternativas.filter(a => !a.correcta)) {
      if (typeof a.valor === 'number') assert.ok(Math.abs(a.valor - p.respuesta.valor) > 1e-9, `semilla ${s}`);
      else assert.ok(!igual(esperado, a.valor), `semilla ${s}: el distractor ${a.texto} también cumple`);
    }
  }
});

test('los datos son creíbles', () => {
  for (const [s, p] of PROBLEMAS.entries()) {
    const d = p._datos, r = p.respuesta.valor;
    if (d.sub === 'ventas') assert.ok(r >= 8 && r <= 150, `semilla ${s}: ${r}`);
    if (d.sub === 'dos-personas') assert.ok(r > 0 && r <= 200 && d.e <= 100, `semilla ${s}`);
    if (d.tipo === 'dos-enteros') assert.ok(r <= 300, `semilla ${s}`);
    if (d.tipo === 'cuadratica-entera') assert.ok(r >= 8 && r <= 18 && d.A <= 700, `semilla ${s}`);
    if (d.tipo === 'moviles') assert.ok(r > 0 && r <= 6, `semilla ${s}: ${r} h`);
    if (d.tipo === 'medias') assert.ok(d.A <= 5000 && r <= 1000, `semilla ${s}`);
    if (d.sub === 'contexto') assert.ok(r <= 40, `semilla ${s}`);
    if (d.sub === 'ganancia' || d.sub === 'sobrante') assert.ok(r > 0 && r <= 1500, `semilla ${s}: ${r}`);
  }
});

test('ningún texto trae undefined, NaN, −−, guion como menos ni signos dobles', () => {
  for (const [s, p] of PROBLEMAS.entries()) {
    const textos = [plano(p.enunciado), plano(p.pregunta), ...p.solucion.map(plano), ...p.alternativas.map(a => a.texto), ...p.alternativas.filter(a => a.error).map(a => a.error.explicacion)];
    for (const t of textos) {
      assert.ok(!/undefined|NaN|Infinity|−−|\+ −|− −|\[object/.test(t), `semilla ${s}: «${t}»`);
      assert.ok(!/(^|[\s(=;/])-\d/.test(t), `semilla ${s}: guion como signo menos en «${t}»`);
    }
    for (const parte of [...p.enunciado, ...p.pregunta, ...p.solucion.flat()]) if (typeof parte !== 'string') assert.ok(p.variables[parte.v], `semilla ${s}: variable ${parte.v} sin color`);
    const colores = Object.values(p.variables).map(x => x.color);
    assert.equal(new Set(colores).size, colores.length, `semilla ${s}: dos variables con el mismo color`);
    assert.ok(colores.every(c => ['o', 'i', 'd', 'h'].includes(c)));
  }
});

test('los títulos no regalan la respuesta', () => {
  assert.equal(gen.titulo, require('./plantilla.json').titulo);
  assert.ok(!/discriminante|vértice|medias|triangular|redonde/i.test(gen.titulo + papel.titulo));
});

// ---------- papel.json ----------
test('papel.json: de 5 a 10 problemas bien formados', () => {
  assert.ok(papel.titulo && papel.indicacion);
  assert.ok(papel.problemas.length >= 5 && papel.problemas.length <= 10);
  for (const pr of papel.problemas) {
    for (const campo of ['id', 'nivel', 'enunciado', 'respuesta']) assert.ok(pr[campo], `${pr.id}: falta ${campo}`);
    assert.ok(['básico', 'intermedio', 'avanzado'].includes(pr.nivel));
    assert.ok(Array.isArray(pr.pasos) && pr.pasos.length >= 2);
  }
});

test('papel.json: cada respuesta se recalcula por fuerza bruta', () => {
  const R = Object.fromEntries(papel.problemas.map(p => [p.id, p.respuesta]));
  const rango = (a, b) => Array.from({ length: b - a + 1 }, (_, i) => a + i);
  // p1: ventas
  assert.deepEqual(rango(1, 500).filter(n => n - 10 > n / 2 && n - 16 < n / 4), [21]); assert.match(R.p1, /^21 /);
  // p2: menor k con x² − 8x + k > 0 para todo x (barrido en enteros y medios)
  const p2 = rango(-10, 100).find(k => rango(-200, 200).every(i => { const x = i / 2; return x * x - 8 * x + k > 0; }));
  assert.equal(p2, 17); assert.match(R.p2, /17/);
  // p3
  const S3 = []; for (let x = 1; x < 100; x++) for (let y = 1; y < 100; y++) if (3 * x - 2 * y >= 11 && x + y < 12 && y > 3) S3.push([x, y]);
  assert.deepEqual(S3, [[7, 4]]); assert.match(R.p3, /^11 animales \(7 patos y 4 gallinas\)/);
  // p4: k = 4 no; 4,25 sí; −5 no
  const pos = k => rango(-5000, 5000).every(j => { const x = j / 100; return k * x * x + 8 * x + k > 0; });
  assert.deepEqual([4, 4.25, 10, -5, 0, 3.9].map(pos), [false, true, true, false, false, false]); assert.equal(R.p4, 'k ∈ ⟨4; +∞⟩.');
  // p5
  assert.equal(Math.max(...rango(10, 19).filter(x => x * (20 - x) >= 80)), 14); assert.match(R.p5, /^14 cm/);
  // p6: imágenes de los extremos y sentido
  const E6 = x => (3 * x + 1) / (x + 1);
  assert.equal(E6(1), 2); assert.equal(E6(3), 5 / 2); assert.ok(E6(2) > E6(1.5)); assert.equal(R.p6, 'E ∈ [2; 5/2⟩.');
  // p7: barrido del costado
  let m7 = Infinity; for (let i = 1; i <= 100000; i++) { const y = i / 1000; m7 = Math.min(m7, 2 * 800 / y + 4 * y); }
  assert.ok(Math.abs(m7 - 160) < 1e-6); assert.match(R.p7, /^160 m/);
  // p8
  const p8 = rango(-80, 80).map(i => i / 4).filter(x => Math.abs(x - 2) + Math.abs(x + 5) <= Math.abs(2 * x + 3));
  assert.ok(p8.every(x => x <= -5 || x >= 2) && p8.includes(-5) && p8.includes(2) && p8.includes(-20) && p8.includes(20));
  assert.equal(R.p8, 'C.S. = ⟨−∞; −5] ∪ [2; +∞⟩.');
  // p9
  let b9 = -1, a9; for (let x = 0; x <= 30; x++) for (let y = 0; y <= 30; y++) if (3 * x + 2 * y <= 24 && x + 3 * y <= 20 && 40 * x + 30 * y > b9) { b9 = 40 * x + 30 * y; a9 = [x, y]; }
  assert.equal(b9, 330); assert.deepEqual(a9, [6, 3]); assert.match(R.p9, /^S\/ 330 \(6 chompas y 3 chalinas\)/);
  assert.ok(Math.abs((40 * 32 + 30 * 36) / 7 - 337.142857) < 1e-5);
  // p10
  const p10p = Math.max(...rango(0, 40).filter(x => x * x - 30 * x + 200 <= 0)), p10q = rango(-5, 40).find(x => x * x - 9 * x + 14 < 0);
  assert.equal((p10p - p10q) / (10 + 7), 1); assert.match(R.p10, /^1 hora/);
});

// ---------- Escena viva (docs/escena-viva.md): recta del kit, arrastre, línea de tiempo y fantasmas ----------
const Kit = require('../../nucleo/kit/kit.js');
const recta = require('../../nucleo/kit/piezas/recta.js');
const LT = require('../../nucleo/kit/linea-tiempo.js');
const SIN_ESCENA = new Set(['dos-enteros', 'medias', 'lineal-entera']);
const VIVOS = Array.from({ length: 400 }, (_, s) => gen.generar(s));

test('escena viva: los tipos que caben en la recta la traen; los otros siguen como siempre', () => {
  const con = new Set(), sin = new Set();
  for (const p of VIVOS) (p.escena ? con : sin).add(p._datos.tipo);
  assert.deepEqual([...sin].sort(), [...SIN_ESCENA].sort());
  assert.equal(con.size, 7);
});

test('escena viva: presupuesto de texto (enunciado ≤ 40, paso ≤ 14, error ≤ 20) en todos los tipos', () => {
  for (const [s, p] of VIVOS.entries()) {
    assert.ok(Kit.palabras(p.enunciado) + Kit.palabras(p.pregunta) <= 40, `semilla ${s}: enunciado de ${Kit.palabras(p.enunciado) + Kit.palabras(p.pregunta)}`);
    for (const q of p.pasos || p.solucion.map(t => ({ texto: t }))) assert.ok(Kit.palabras(q.texto) <= 14, `semilla ${s}: «${Kit.plano(q.texto)}»`);
    for (const a of p.alternativas.filter(x => x.error)) assert.ok(Kit.palabras(a.error.explicacion) <= 20, `semilla ${s}: «${a.error.explicacion}»`);
  }
});

test('escena viva: cada paso se dibuja sin NaN y el final muestra la respuesta', () => {
  for (const [s, p] of VIVOS.entries()) {
    if (!p.escena) continue;
    assert.equal(p.escena.pieza, 'recta'); assert.ok(Kit.piezas.recta);
    assert.ok(p.pasos.length >= 2 && p.pasos[p.pasos.length - 1].estado.final, `semilla ${s}: el último paso es el resultado`);
    for (let i = 1; i <= p.pasos.length; i++) {
      const svg = recta.dibujar(p.escena.datos, LT.estado(p.pasos, i));
      assert.ok(!/NaN|undefined|null|Infinity/.test(svg), `semilla ${s}, paso ${i}`);
      assert.ok(!/NaN|undefined|null/.test(Kit.plano(p.pasos[i - 1].texto) + Kit.plano(p.pasos[i - 1].ecuacion)), `semilla ${s}, paso ${i}`);
    }
    const fin = recta.dibujar(p.escena.datos, LT.estado(p.pasos, p.pasos.length));
    if (p.respuesta.tipo === 'arrastrar') assert.ok(fin.includes(`>${Kit.formatear(p.respuesta.valor)}${p.escena.datos.sufijo} ✓<`), `semilla ${s}: el final no dibuja la respuesta`);
    for (const f of Object.values(p.fantasmas)) assert.ok(!/NaN|undefined|null/.test(recta.dibujar(p.escena.datos, { corte: 0, fantasma: f })));
  }
});

test('escena viva: el entero que deja la recta es el de la respuesta (los rótulos dicen lo que valen)', () => {
  const num = t => Number(t.replace('…', '').replace(',', '.').replace('−', '-').split('/').reduce((a, b) => a / b));
  for (const [s, p] of VIVOS.entries()) {
    if (!p.escena || p.respuesta.tipo !== 'arrastrar') continue;
    const ent = p.escena.datos.elementos.find(e => e.tipo === 'enteros');
    assert.equal(ent.b, p.respuesta.valor, `semilla ${s}`);
    assert.ok(ent.rotulo.endsWith(String(p.respuesta.valor)), `semilla ${s}: «${ent.rotulo}»`);
    for (const e of p.escena.datos.elementos.filter(x => x.tipo === 'intervalo' && /^[a-zA-Z]+ [<>] /.test(x.rotulo || ''))) {
      const cota = e.a === null ? e.b : e.a;
      assert.ok(Math.abs(num(e.rotulo.split(/[<>] /)[1]) - cota) < 0.01, `semilla ${s}: «${e.rotulo}» rotula ${cota}`);
    }
  }
});

test('escena viva: con arrastre, cada opción se alcanza con la marca y equivale a sí misma; su fantasma está en su valor', () => {
  for (const [s, p] of VIVOS.entries()) {
    if (!p.escena || p.respuesta.tipo !== 'arrastrar') continue;
    const r = p.respuesta, c = recta.controles(p.escena.datos).marca;
    assert.equal(r.control, 'marca');
    const ids = p.alternativas.filter(a => a.error).map(a => a.error.id);
    for (const a of p.alternativas) {
      assert.ok(a.valor >= c.min && a.valor <= c.max, `semilla ${s}: ${a.texto} no cabe en la recta`);
      const puesto = Kit.respuesta.ajustar(a.valor, r.paso, c.min, c.max);
      assert.equal(Kit.respuesta.clasificar(puesto, p.alternativas, r.tolerancia), a, `semilla ${s}: ${a.texto}`);
      if (a.error && ids.filter(i => i === a.error.id).length === 1) assert.equal(p.fantasmas[a.error.id].marca, a.valor);
    }
  }
});
