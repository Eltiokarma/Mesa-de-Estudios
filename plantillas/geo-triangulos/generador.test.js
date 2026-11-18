// Pruebas de «Triángulos y líneas notables» (práctica de geometria.triangulos): casos.json (calculados aparte, con un
// script que no usa el generador), un recálculo independiente en 400 problemas (coordenadas, cortes de rectas, ángulos
// medidos y lados enteros contados por fuerza bruta: otro camino que calc de geo-triangulos-notables), fugas, tipos por
// idea, errores, el recuadro «Datos» en 400 semillas, colores, notación, figuras a escala y consistentes con los datos, y
// rótulos que no se pisan y quedan junto a su vértice (medidos con la geometría de geo-figura, no con la del generador).
const test = require('node:test');
const assert = require('node:assert/strict');
const gen = require('./generador.js');
const casos = require('./casos.json');
const T = require('../../nucleo/kit/trazo.js');
const GF = require('../../nucleo/kit/piezas/geo-figura.js');
const { probarGenerador, probarFugas } = require('../../nucleo/probar-generador.js');

const plano = x => (Array.isArray(x) ? x.map(plano).join('') : x && typeof x === 'object' ? String(x.t) : String(x));
const sinDuros = t => String(t).replace(/ /g, ' ');
const palabras = x => sinDuros(plano(x)).split(/\s+/).filter(w => /\p{L}/u.test(w)).length;
const aNumero = t => Number(sinDuros(t).replace(/\s*(cm|°)$/, '').replace(/ /g, '').replace(',', '.'));
const casi = (a, b, e = 1e-6) => Math.abs(a - b) < e;
const RAD = Math.PI / 180;

// ---- Geometría con coordenadas (otro código que el del generador) ----
const sub = (p, q) => [p[0] - q[0], p[1] - q[1]];
const sum = (p, q) => [p[0] + q[0], p[1] + q[1]];
const esc = (p, k) => [p[0] * k, p[1] * k];
const uni = p => esc(p, 1 / Math.hypot(p[0], p[1]));
const cruz = (p, q) => p[0] * q[1] - p[1] * q[0];
const dir = g => [Math.cos(g * RAD), Math.sin(g * RAD)];
const largo = (p, q) => Math.hypot(p[0] - q[0], p[1] - q[1]);
function corte(P, u, Q, w) { const t = cruz(sub(Q, P), w) / cruz(u, w); return sum(P, esc(u, t)); }
const angulo = (V, X, Y) => GF.util.angulo(V, X, Y);
// Triángulo por sus ángulos B y C sobre BC = 1.
function triangulo(B, C) {
  const Bp = [0, 0], Cp = [1, 0];
  return { A: corte(Bp, dir(B), Cp, dir(180 - C)), B: Bp, C: Cp };
}
const bis = (V, X, Y) => sum(uni(sub(X, V)), uni(sub(Y, V)));
const bisExt = (V, X, Y) => sub(uni(sub(X, V)), uni(sub(Y, V)));
// ¿Hay triángulo con estos tres lados? (desigualdad estricta, probada lado por lado)
const hayTriangulo = (x, y, z) => x + y > z && x + z > y && y + z > x;
const enteros = (p, q) => { const r = []; for (let x = 1; x <= 200; x++) if (hayTriangulo(p, q, x)) r.push(x); return r; };

function medir(fig, an) {
  const P = id => { const q = fig.puntos.find(p => p.id === id); return [q.x, q.y]; };
  return angulo(P(an.en), P(an.de), P(an.a));
}

// ---- Camino independiente ----
const OPUESTO = { A: 'BC', B: 'AC', C: 'AB' };
function recalcular(p) {
  const d = p._datos, fig = p.escena && p.escena.datos;
  switch (d.tipo) {
    case 'tercero': return 180 - Object.entries(d.angulos).filter(([k]) => k !== d.pide).reduce((s, [, x]) => s + x, 0);
    case 'clase': { const c = 180 - d.angulos.A - d.angulos.B; return c === 90 ? 'Rectángulo' : c > 90 ? 'Obtusángulo' : 'Acutángulo'; }
    case 'razon': { const k = 180 / d.razon.reduce((s, x) => s + x, 0); return (d.pide === 'mayor' ? Math.max(...d.razon) : Math.min(...d.razon)) * k; }
    case 'con-x': {
      // Se prueba cada x de 1 a 200 hasta que los tres ángulos sumen 180°.
      for (let x = 1; x <= 200; x++) {
        const ang = d.a.map((a, i) => a * x + d.b[i]);
        if (ang.reduce((s, y) => s + y, 0) === 180) return d.pide === 'x' ? x : ang['ABC'.indexOf(d.pide)];
      }
      return null;
    }
    case 'mariposa': {
      const v = d.angulos, phi = 180 - v.A - v.B;
      // Con el ángulo en O de un triángulo, el otro cierra con 180°.
      if (d.pide === 'A' || d.pide === 'B') { const phi2 = 180 - v.C - v.D; return 180 - phi2 - (d.pide === 'A' ? v.B : v.A); }
      return 180 - phi - (d.pide === 'C' ? v.D : v.C);
    }
    case 'exterior': { const t = triangulo(d.angulos.B, d.angulos.C); return angulo(t.C, t.A, [2, 0]); }
    case 'lejano': { const t = triangulo(d.angulos.B, d.angulos.C); return angulo(t.B, t.A, t.C); }
    case 'ext-x': {
      for (let x = 1; x <= 200; x++) if (d.aE * x + d.bE === d.aA * x + d.bA + d.aB * x + d.bB) return d.pide === 'x' ? x : d.aE * x + d.bE;
      return null;
    }
    case 'tres-ext': { const t = triangulo(d.angulos.B, d.angulos.C); return angulo(t.C, t.A, [2, 0]); }
    case 'flecha': {
      const t = triangulo(d.b, d.c), D = corte(t.B, dir(d.b - d.p), t.C, dir(180 - d.c + d.q));
      return angulo(D, t.B, t.C);
    }
    case 'antena': { const A = [0, 1], C = [1 / Math.tan(d.al * RAD), 0], D = [1 / Math.tan(d.be * RAD), 0]; return angulo(A, C, D); }
    case 'base': return (180 - d.th) / 2;
    case 'punta': { const t = triangulo(d.al, d.al); return angulo(t.A, t.B, t.C); }
    case 'lados-x': { for (let x = 1; x <= 200; x++) if (d.AB[0] * x + d.AB[1] === d.AC[0] * x + d.AC[1]) return d.AB[0] * x + d.AB[1]; return null; }
    case 'orden': {
      const m = { A: d.angulos.A, B: d.angulos.B, C: 180 - d.angulos.A - d.angulos.B }, ks = Object.keys(m).sort((x, y) => m[x] - m[y]);
      return OPUESTO[d.pide === 'mayor' ? ks[2] : ks[0]];
    }
    case 'cadena': {
      // Se arma la figura: B, C, D en AC con DB = DC, A en la recta CD con AB = BD; se miden los ángulos.
      // D: en la recta que sale de C con m∠C, a la distancia que deja DB = DC (se busca por bisección); A: más allá de D,
      // donde AB = BD (la otra raíz de |C + t·u − B| = BD).
      const C = [1, 0], B = [0, 0], u = dir(180 - d.c);
      let lo = 0, hi = 10;
      for (let k = 0; k < 200; k++) { const m = (lo + hi) / 2, X = sum(C, esc(u, m)); if (largo(X, B) > m) lo = m; else hi = m; }
      const s = lo, D = sum(C, esc(u, s)), t = -u[0] + Math.sqrt(u[0] * u[0] - 1 + s * s), A = sum(C, esc(u, t));
      return d.pide === 'A' ? angulo(A, B, D) : angulo(B, C, A);
    }
    case 'paralela': return d.AB - d.AE;
    case 'max-min': { const r = enteros(d.p, d.q); return d.pide === 'max' ? Math.max(...r) : Math.min(...r); }
    case 'cuantos': return enteros(d.p, d.q).length;
    case 'iso-dt': { const ps = [[d.a, d.a, d.b], [d.b, d.b, d.a]].filter(l => hayTriangulo(...l)).map(l => l[0] + l[1] + l[2]); return ps.length === 1 ? `${ps[0]} cm` : null; }
    case 'diagonal': {
      const r = enteros(d.a, d.b).filter(x => hayTriangulo(d.c, d.d, x));
      return d.pide === 'max' ? Math.max(...r) : d.pide === 'min' ? Math.min(...r) : r.length;
    }
    case 'punto': {
      // El perímetro pasa de BC + (AB + AC) > |p − q| + p + q; se busca el menor entero.
      let n = 1; while (!(n > Math.abs(d.p - d.q) + d.p + d.q)) n++; return n;
    }
    case 'reconocer': {
      // Se mira la figura: la línea que no es lado ni llave.
      const P = id => { const q = fig.puntos.find(z => z.id === id); return [q.x, q.y]; };
      const otras = fig.segmentos.filter(l => !l.llave && !l.discontinua && !['AB', 'BA', 'BC', 'CB', 'CA', 'AC'].includes(l.de + l.a));
      const sinA = otras.filter(l => l.de !== 'A' && l.a !== 'A');
      if (sinA.length) return 'Mediatriz';
      const l = otras[0], X = P(l.de === 'A' ? l.a : l.de), A = P('A');
      if (Math.abs(X[0] - A[0]) < 1e-9) return 'Altura';
      if (casi(X[0], 3, 1e-9)) return 'Mediana';
      if (casi(angulo(A, [0, 0], X), angulo(A, X, [6, 0]), 1e-6)) return 'Bisectriz';
      return null;
    }
    case 'donde': return d.angulos.B > 90 ? 'Fuera, en la prolongación de CB' : d.angulos.B === 90 ? 'Justo en B: AB es la altura' : 'Dentro del lado BC';
    case 'ang-altura': { const t = triangulo(d.B, d.C), H = [t.A[0], 0]; return angulo(t.A, t.B, H); }
    case 'ang-bisectriz': { const t = triangulo(d.B, d.C), F = corte(t.A, bis(t.A, t.B, t.C), t.B, [1, 0]); return angulo(F, t.A, t.C); }
    case 'altura-bisectriz': { const t = triangulo(d.B, d.C), F = corte(t.A, bis(t.A, t.B, t.C), t.B, [1, 0]); return angulo(t.A, [t.A[0], 0], F); }
    case 'incentro': case 'con-bc': { const t = triangulo(d.B, d.C), I = corte(t.B, bis(t.B, t.A, t.C), t.C, bis(t.C, t.A, t.B)); return angulo(I, t.B, t.C); }
    case 'int-ext': { const t = triangulo(d.B, d.C), E = corte(t.B, bis(t.B, t.A, t.C), t.C, bisExt(t.C, t.A, t.B)); return angulo(E, t.B, t.C); }
    case 'dos-ext': { const t = triangulo(d.B, d.C), Q = corte(t.B, bisExt(t.B, t.A, t.C), t.C, bisExt(t.C, t.A, t.B)); return angulo(Q, t.B, t.C); }
    case 'inverso': {
      // Se prueba cada A (de 2° en 2°), con B y C iguales, hasta que el ángulo de los cruces mida lo dado.
      for (let A = 2; A < 178; A += 2) {
        const t = triangulo((180 - A) / 2, (180 - A) / 2);
        const X = d.conE ? corte(t.B, bis(t.B, t.A, t.C), t.C, bisExt(t.C, t.A, t.B)) : corte(t.B, bis(t.B, t.A, t.C), t.C, bis(t.C, t.A, t.B));
        if (casi(angulo(X, t.B, t.C), d.X, 1e-6)) return A;
      }
      return null;
    }
    default: throw new Error(`tipo sin recálculo: ${d.tipo}`);
  }
}
const igual = (esperado, valor) => (typeof esperado === 'string' ? sinDuros(esperado) === sinDuros(valor)
  : typeof valor === 'number' ? casi(esperado, valor, 1e-6) : casi(esperado, aNumero(valor), 1e-6));

probarGenerador(gen, { semillas: 400, recalcular, igual });
probarFugas(gen, { semillas: 1500 });

// Problemas de prueba: 400 semillas y 40 de cada tipo.
const muestras = (() => {
  const ps = [];
  for (let s = 0; s < 400; s++) ps.push([String(s), gen.generar(s)]);
  for (const t of gen.TIPOS) for (let s = 0; s < 40; s++) ps.push([`${t} ${s}`, gen.generar(`c${s}`, { tipo: t })]);
  return ps;
})();

test('los recálculos también cuadran en 40 problemas de cada tipo', () => {
  for (const [s, p] of muestras) assert.ok(igual(recalcular(p), p.respuesta.valor), `${s}: ${recalcular(p)} contra ${p.respuesta.valor}`);
});

test('casos.json: cada semilla da su problema y su respuesta (calculada aparte)', () => {
  assert.ok(casos.casos.length >= 15 && casos.casos.length <= 20, `${casos.casos.length} casos`);
  for (const c of casos.casos) {
    const p = gen.generar(c.semilla), d = Object.assign({}, p._datos);
    delete d.valor;
    assert.deepEqual(JSON.parse(JSON.stringify(d)), c.entrada, `semilla ${c.semilla}: otro problema`);
    assert.equal(sinDuros(`${plano(p.enunciado)} ${plano(p.pregunta)}`), c.enunciado, `semilla ${c.semilla}: otro enunciado`);
    const ok = p.alternativas.find(a => a.correcta);
    assert.equal(sinDuros(ok.texto), c.esperado.texto, `semilla ${c.semilla}`);
    if (typeof c.esperado.valor === 'number') assert.ok(casi(aNumero(ok.texto), c.esperado.valor), `semilla ${c.semilla}`);
  }
  assert.equal(new Set(casos.casos.map(c => c.entrada.idea)).size, 6, 'los casos cubren las seis ideas');
});

test('tipos por idea: cada idea tiene práctica, cada tipo dice su idea y llega a nivel de examen', () => {
  assert.deepEqual(Object.keys(gen.IDEAS), ['suma-de-angulos', 'angulo-exterior', 'isosceles', 'desigualdad', 'lineas-notables', 'angulo-de-bisectrices']);
  assert.deepEqual(Object.values(gen.IDEAS).flat().sort(), gen.TIPOS.slice().sort());
  const teoria = require('../../contenido/teoria/geometria/triangulos.js');
  assert.deepEqual(Object.keys(gen.IDEAS), teoria.ideas.map(i => i.id), 'las ideas son las de la teoría, en su orden');
  const niveles = {};
  for (const [idea, tipos] of Object.entries(gen.IDEAS)) for (const t of tipos) for (let s = 0; s < 20; s++) {
    const d = gen.generar(`i${s}`, { tipo: t })._datos;
    assert.equal(d.tipo, t); assert.equal(d.idea, idea);
    (niveles[idea] = niveles[idea] || new Set()).add(d.nivel);
  }
  for (const [idea, n] of Object.entries(niveles)) assert.ok(n.has(1) && n.has(2) && n.has(3), `${idea}: niveles ${[...n]}`);
  for (let s = 0; s < 60; s++) for (const idea of Object.keys(gen.IDEAS)) assert.equal(gen.generar(`id${s}`, { idea })._datos.idea, idea);
});

test('la desigualdad y las bisectrices usan calc de geo-triangulos-notables (no lo copian)', () => {
  const fuente = require('fs').readFileSync(require.resolve('./generador.js'), 'utf8');
  for (const f of ['calc.tercerLado(', 'calc.diagonal(', 'calc.perimetroDosDistancias(', "calc.angulo('incentro'", "calc.angulo('int-ext'", "calc.angulo('excentro'"]) assert.ok(fuente.includes(f), f);
  assert.ok(!/obtusoEntre|mayorMenorQueRaiz/.test(fuente), 'la condición de obtusángulo no entra (va a Relaciones métricas)');
});

const CODIGO = /^(GE7-[ab]|GE8|GE-(TRI|RAZ|EXT|ISO|DT|LN|BIS)\d+(-[ab])?)$/;
test('cada explicación empieza por lo que el alumno hizo bien, es corta y tiene su respaldo (GE7 y GE8 con su informe)', () => {
  for (const [s, p] of muestras) for (const a of p.alternativas.filter(x => x.error)) {
    assert.match(a.error.explicacion, /^Bien\b/, `${s}: ${a.error.explicacion}`);
    assert.ok(palabras(a.error.explicacion) <= 22, `${s}: ${a.error.explicacion}`);
    assert.match(a.error.id, CODIGO, `${s}: ${a.error.id}`);
    const esperado = /^GE7-/.test(a.error.id) ? 'documentado' : a.error.id === 'GE8' ? 'parcial' : 'hipotesis';
    assert.equal(a.error.respaldo, esperado, `${s}: ${a.error.id}`);
    if (esperado !== 'hipotesis') assert.equal(a.error.fuente, 'docs/investigacion/geometria-ideas-erroneas.md');
  }
});

test('los códigos están en el informe de geometría (sección «Triángulos») o en rutinas/teoria-geometria.md', () => {
  const fs = require('fs'), path = require('path'), raiz = path.join(__dirname, '..', '..');
  const docs = fs.readFileSync(path.join(raiz, 'docs/investigacion/geometria-ideas-erroneas.md'), 'utf8') + fs.readFileSync(path.join(raiz, 'rutinas/teoria-geometria.md'), 'utf8');
  const enRango = id => {
    if (docs.includes(id)) return true;
    const m = id.match(/^(GE-[A-Z]+)(\d+)/);
    return m && [...docs.matchAll(new RegExp(`${m[1]}(\\d+)(?:–|-| a )(?:${m[1]})?(\\d+)`, 'g'))].some(r => +r[1] <= +m[2] && +m[2] <= +r[2]);
  };
  const vistos = new Set();
  for (const [, p] of muestras) for (const a of p.alternativas.filter(x => x.error)) vistos.add(a.error.id);
  for (const id of vistos) assert.ok(enRango(id), `${id} no está documentado`);
});

test('ninguna explicación ni solución nombra una alternativa por su letra', () => {
  for (const [s, p] of muestras) {
    const textos = [...p.alternativas.filter(a => a.error).map(a => a.error.explicacion), ...p.solucion.map(plano)];
    for (const t of textos) {
      assert.ok(!/\b(alternativa|opci[oó]n|respuesta)\b/i.test(t), `${s}: «${t}»`);
      assert.ok(!/\b(la|es la|marca la) [A-E]\b(?! *(y|,|=|\+|−|está|es|queda|en|de|mide))/.test(t), `${s}: «${t}»`);
    }
  }
});

test('ninguna alternativa queda fuera de escala (de 1/20 a 20 veces la correcta) ni es cero', () => {
  for (const [s, p] of muestras) {
    const c = aNumero(p.alternativas.find(a => a.correcta).texto);
    for (const a of p.alternativas) {
      const x = aNumero(a.texto);
      if (!Number.isFinite(x) || !Number.isFinite(c)) continue;
      assert.ok(x > 0 && x / c >= 1 / 20 && x / c <= 20, `${s}: ${a.texto} frente a ${c}`);
    }
  }
});

test('presupuesto de texto: enunciado y pregunta hasta 40 palabras; sin punto decimal, null ni «1x»', () => {
  for (const [s, p] of muestras) {
    assert.ok(palabras(p.enunciado) + palabras(p.pregunta) <= 40, `${s}: ${palabras(p.enunciado) + palabras(p.pregunta)} palabras: ${plano(p.enunciado)} ${plano(p.pregunta)}`);
    const todo = [plano(p.enunciado), plano(p.pregunta), ...p.solucion.map(plano), ...p.alternativas.map(a => a.texto)].join(' ');
    assert.ok(!/\d\.\d|\bnull\b|\bNaN\b|undefined|\b1x\b|−1x|\+ 0°|− 0°|\+ −|− −/.test(todo), `${s}: ${todo}`);
  }
});

// Notación (decisiones de la etapa 4): m∠ para la medida; nunca C(x) ni S(x); los lados por sus letras, sin a, b, c.
test('notación: m∠ para la medida, sin C(x) ni S(x), sin la convención a, b, c', () => {
  for (const [s, p] of muestras) {
    const todo = [plano(p.enunciado), plano(p.pregunta), ...p.datos, ...p.solucion.map(plano)].join(' ');
    assert.ok(!/(^|[^m])∠[A-Z]{1,3} =/.test(todo), `${s}: una medida sin «m»: ${todo}`);
    assert.ok(!/\b[CS]\(/.test(todo), `${s}: C( o S(: ${todo}`);
    assert.ok(!/\b[abc] = \d/.test(todo), `${s}: la convención a, b, c: ${todo}`);
  }
});

// Recuadro «Datos» (docs/plan-calidad.md §3, punto 13): líneas cortas con la herramienta de cada tipo; nunca el valor de
// lo que se pide ni un consejo.
const FORMULA = {
  tercero: ['m∠A + m∠B + m∠C = 180°'], clase: ['m∠A + m∠B + m∠C = 180°', 'Acutángulo: tres ángulos agudos'],
  razon: ['m∠A + m∠B + m∠C = 180°', /los ángulos miden \d*k, \d*k y \d*k grados/], 'con-x': ['m∠A + m∠B + m∠C = 180°'],
  mariposa: ['suman 180°', 'Opuestos por el vértice'],
  exterior: ['Un ángulo exterior mide lo que suman', 'adyacentes en una recta suman 180°'], lejano: ['Un ángulo exterior mide lo que suman'],
  'ext-x': ['Un ángulo exterior mide lo que suman'], 'tres-ext': ['exteriores de un triángulo, uno en cada vértice, suman 360°'],
  flecha: ['Un ángulo exterior mide lo que suman', 'suman 180°'], antena: ['Un ángulo exterior mide lo que suman'],
  base: ['= 180°', 'Frente a lados iguales hay ángulos iguales'], punta: ['= 180°', 'Frente a lados iguales hay ángulos iguales'],
  'lados-x': ['frente a ángulos iguales, lados iguales'], orden: ['= 180°', /Frente al ángulo (mayor|menor) está el lado (mayor|menor)/],
  cadena: ['Frente a lados iguales', 'Un ángulo exterior mide', '= 180°'], paralela: ['Bisectriz: parte el ángulo', 'alternos internos son iguales', 'frente a ángulos iguales, lados iguales'],
  'max-min': ['Desigualdad triangular'], cuantos: ['Desigualdad triangular'], 'iso-dt': ['Isósceles: dos de sus tres lados', 'Tres largos forman triángulo'],
  diagonal: ['Desigualdad triangular'], punto: ['Desigualdad triangular', 'AB + AC > PB + PC', 'Perímetro'],
  reconocer: ['cuadradito = 90°'], donde: ['Altura: va del vértice', 'Obtusángulo'], 'ang-altura': ['Altura: va del vértice', 'adyacentes', 'suman 180°'],
  'ang-bisectriz': ['= 180°', 'Bisectriz: parte', 'Un ángulo exterior mide'], 'altura-bisectriz': ['= 180°', 'Altura: va del vértice', 'Bisectriz: parte'],
  incentro: ['m∠BIC = 90° + (m∠A ÷ 2)', 'm∠BEC = m∠A ÷ 2', 'm∠BQC = 90° − (m∠A ÷ 2)'], 'int-ext': ['m∠BIC = 90° + (m∠A ÷ 2)', 'm∠BEC = m∠A ÷ 2', 'm∠BQC = 90° − (m∠A ÷ 2)'],
  'dos-ext': ['m∠BIC = 90° + (m∠A ÷ 2)', 'm∠BEC = m∠A ÷ 2', 'm∠BQC = 90° − (m∠A ÷ 2)'], 'con-bc': ['Cada bisectriz parte su ángulo', 'suman 180°'],
  inverso: ['m∠BIC = 90° + (m∠A ÷ 2)', 'm∠BEC = m∠A ÷ 2', 'm∠BQC = 90° − (m∠A ÷ 2)'],
};
test('datos: lista de líneas cortas, con la herramienta de cada tipo, sin la respuesta ni consejos, en 400 semillas', () => {
  for (const [s, p] of muestras) {
    const d = p._datos;
    assert.ok(Array.isArray(p.datos) && p.datos.length, `${s}: datos debe ser una lista no vacía`);
    for (const l of p.datos) {
      assert.ok(typeof l === 'string' && l.trim() === l && l.length, `${s}: línea vacía o con espacios`);
      assert.ok(palabras(l) <= 22, `${s}: «${l}» tiene ${palabras(l)} palabras`);
      assert.ok(!/<[a-z/]|\bnull\b|\bNaN\b|\bundefined\b|\d\.\d/i.test(l), `${s}: «${l}»`);
      assert.ok(!/^(Recuerda|Ojo|Truco|Tip|Consejo|Primero|Siempre|No olvides)/i.test(l), `${s}: «${l}» es un consejo`);
      // El atajo no es un dato: «x = a + b + c» de la punta de flecha, «(m∠B − m∠C) ÷ 2», el perímetro que pasa de 2·máx.
      assert.ok(!/m∠BDC =|HAF|2 · máx|el doble del mayor/.test(l), `${s}: «${l}» es un atajo`);
    }
    assert.equal(new Set(p.datos).size, p.datos.length, `${s}: líneas repetidas`);
    const todo = p.datos.join('\n');
    for (const fo of FORMULA[d.tipo]) assert.ok(fo instanceof RegExp ? fo.test(todo) : todo.includes(fo), `${s} (${d.tipo}): falta «${fo}»`);
    const c = sinDuros(p.alternativas.find(a => a.correcta).texto).replace(/ cm$|°$/, '');
    if (/^\d/.test(c)) assert.ok(!new RegExp(`(^|[^\\d,])${c.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?![\\d,])`).test(todo), `${s}: los datos traen ${c}`);
  }
});

// Ronda 2 del lector en frío (18 nov, noche): con una regla de cruce en los datos van las tres, y cada cruce dicho en
// palabras (I, E y Q), igual que en la teoría.
test('bisectrices: si los datos traen una regla de cruce, traen las tres, con I, E y Q dichos en palabras (400 semillas)', () => {
  let n = 0;
  for (const [s, p] of muestras) {
    const ls = p.datos.map(plano);
    if (!ls.some(l => /m∠B[IEQ]C = .*÷ 2/.test(l))) continue;
    n++;
    for (const L of ['I', 'E', 'Q']) assert.ok(ls.some(l => new RegExp(`^${L} es el cruce de la`).test(l) && new RegExp(`m∠B${L}C = `).test(l)), `${s}: falta el cruce ${L} en palabras`);
  }
  assert.ok(n > 20, `${n}`);
});

// ---- Colores (regla de la unidad; molde §5b) ----
test('colores: ángulos dados en carmín y lo pedido en tinta; lados dados naranja y turquesa (idea 4), igual en el texto; la idea 5 en tinta; sin violeta en figura ni enunciado', () => {
  let conFig = 0;
  for (const [s, p] of muestras) {
    const V = p.variables, d = p._datos;
    assert.equal(V.x.color, 'f');
    const partes = [p.enunciado, p.pregunta].flat().filter(x => x && typeof x === 'object');
    for (const x of partes) assert.notEqual(V[x.v].color, 'f', `${s}: violeta en el enunciado («${x.t}»)`);
    assert.ok(p.solucion.flat().some(x => x && typeof x === 'object' && x.v === 'x'), `${s}: la solución no marca el resultado`);
    for (const a of p.alternativas) assert.equal(typeof a.texto, 'string', `${s}: alternativa con color`);
    if (!p.escena) { assert.equal(partes.length, 0, `${s}: sin figura, nada lleva color`); continue; }
    conFig++;
    const fig = p.escena.datos;
    assert.equal(p.escena.pieza, 'geo-figura');
    for (const a of fig.angulos) {
      if (a.etiqueta) {
        if (a.etiqueta.texto === '?') assert.ok(!a.color && !a.etiqueta.color, `${s}: lo pedido en color`);
        else assert.ok(a.etiqueta.color === 'h' && a.color === 'h', `${s}: el ángulo dado «${a.etiqueta.texto}» no va en carmín`);
      } else assert.ok(!a.color || a.color === 'h', `${s}: un arco de otro color`);
      if (d.idea === 'lineas-notables' && !a.etiqueta && a.en !== 'B' && a.en !== 'C') assert.ok(!a.color, `${s}: la marca de la línea en color`);
    }
    const svg = GF.dibujar(fig, { corte: 0 });
    assert.ok(!/var\(--c-[fd]\)/.test(svg), `${s}: violeta o verde en la figura`);
    if (d.idea !== 'desigualdad') assert.ok(!/var\(--c-[io]\)/.test(svg), `${s}: naranja o turquesa fuera de la idea 4`);
    if (d.idea === 'lineas-notables') for (const l of fig.segmentos) assert.ok(!l.color, `${s}: una línea en color: se reconoce por su marca`);
    // Cada medida en color del texto tiene ese color en la figura (el lado y su rótulo), y al revés.
    const enColor = fig.segmentos.filter(l => l.color).map(l => l.color).sort();
    assert.deepEqual(partes.map(x => V[x.v].color).sort(), enColor, `${s}: los colores del texto no son los de la figura`);
    for (const r of (fig.rotulos || []).filter(r => r.lado && r.color)) assert.ok(partes.some(x => sinDuros(x.t).includes(sinDuros(r.texto)) && V[x.v].color === r.color), `${s}: «${r.texto}» en ${r.color} y no así en el texto`);
  }
  assert.ok(conFig > 350, `${conFig} figuras`);
});

// ---- Figuras a escala y consistentes con los datos (molde §6, con números) ----
const valorExpr = (t, x) => { const m = String(t).match(/^(\d*)x(?: ([+−]) (\d+)°)?$/); return m ? (m[1] ? +m[1] : 1) * x + (m[2] ? (m[2] === '+' ? 1 : -1) * +m[3] : 0) : null; };
test('figuras: cada ángulo se dibuja con su medida; los rótulos dicen esa medida; lo pedido mide la respuesta; lados a escala', () => {
  for (const [s, p] of muestras) {
    if (!p.escena) continue;
    const fig = p.escena.datos, d = p._datos, q = plano(p.pregunta), ok = p.alternativas.find(a => a.correcta).texto;
    const conX = [], conK = [];
    for (const a of fig.angulos) {
      const m = medir(fig, a);
      assert.ok(Number.isFinite(a.mide) && Math.abs(m - a.mide) < 0.05, `${s} (${d.tipo}): el ángulo de ${a.en} mide ${m}, no ${a.mide}`);
      const t = a.etiqueta && a.etiqueta.texto;
      if (!t) continue;
      if (/^\d+°$/.test(t)) assert.ok(casi(parseInt(t, 10), a.mide, 1e-9), `${s}: rótulo ${t} en un ángulo de ${a.mide}°`);
      else if (/^\d*k$/.test(t)) conK.push([t === 'k' ? 1 : parseInt(t, 10), a.mide]);
      else if (/x/.test(t)) conX.push([t, a.mide]);
      if (t === '?' && /^¿Cuánto mide el ángulo|^¿Qué ángulo/.test(q)) assert.ok(casi(a.mide, aNumero(ok), 0.05), `${s} (${d.tipo}): lo pedido mide ${a.mide}`);
    }
    if (conX.length) {
      const xs = conX.map(([t, m]) => { const r = t.match(/^(\d*)x(?: ([+−]) (\d+)°)?$/); return (m - (r[2] ? (r[2] === '+' ? 1 : -1) * +r[3] : 0)) / (r[1] ? +r[1] : 1); });
      for (const x of xs) assert.ok(casi(x, xs[0], 1e-6), `${s} (${d.tipo}): las expresiones no comparten x`);
      for (const [t, m] of conX) assert.ok(casi(valorExpr(t, xs[0]), m, 1e-6));
    }
    if (conK.length) for (const [k, m] of conK) assert.ok(casi(m / k, conK[0][1] / conK[0][0], 1e-6), `${s}: las partes con k no van a escala`);
    // Las medidas en cm de los lados van a escala (un mismo factor en toda la figura).
    const P = id => { const z = fig.puntos.find(y => y.id === id); return [z.x, z.y]; };
    const medidos = (fig.medidas || []).map(z => largo(P(z.de), P(z.a)) / z.cm);
    for (const k of medidos) assert.ok(casi(k, medidos[0], 1e-6), `${s} (${d.tipo}): los lados no van a escala`);
    // Las llaves de «miden igual» unen tramos que miden igual.
    for (const g of fig.iguales || []) for (const z of g) assert.ok(casi(largo(P(z[0]), P(z[1])), largo(P(g[0][0]), P(g[0][1])), 1e-6), `${s} (${d.tipo}): ${z.join('')} no mide lo que ${g[0].join('')}`);
    // Las medidas que el texto da en grados son las de la figura.
    for (const m of plano(p.enunciado).matchAll(/m∠([A-Z])([A-Z])([A-Z]) = (\d+)°/g)) {
      const A = fig.puntos.find(z => z.rotulo === m[1]), O = fig.puntos.find(z => z.rotulo === m[2]), B = fig.puntos.find(z => z.rotulo === m[3]);
      if (!A || !O || !B) continue;
      assert.ok(casi(angulo([O.x, O.y], [A.x, A.y], [B.x, B.y]), +m[4], 0.05), `${s}: el texto dice ${m[0]} y la figura no`);
    }
  }
});

test('idea 5: la figura no nombra los pies (H, M, F) cuando se pide reconocer la línea; las llaves sí marcan mitades iguales', () => {
  for (let s = 0; s < 200; s++) {
    const p = gen.generar(`r${s}`, { tipo: 'reconocer' }), fig = p.escena.datos;
    assert.deepEqual(fig.puntos.filter(q => q.rotulo).map(q => q.rotulo).sort(), ['A', 'B', 'C'], `${s}: letras de más`);
    if (/Mediana|Mediatriz/.test(p.respuesta.valor)) assert.ok((fig.iguales || []).length, `${s}: sin llaves en las mitades`);
  }
});

// ---- Rótulos que no se pisan y quedan junto a su vértice, medidos con la geometría de geo-figura ----
const TAM = 16, ALTO_T = TAM * 1.05, M = 4;
const caja = (x, y, w, h) => ({ x0: x - w / 2, x1: x + w / 2, y0: y - h / 2, y1: y + h / 2 });
const chocan = (a, b) => a.x0 < b.x1 && b.x0 < a.x1 && a.y0 < b.y1 && b.y0 < a.y1;
function cruza(p, q, b) {
  for (let k = 0; k <= 200; k++) { const x = p[0] + (q[0] - p[0]) * k / 200, y = p[1] + (q[1] - p[1]) * k / 200; if (x > b.x0 && x < b.x1 && y > b.y0 && y < b.y1) return true; }
  return false;
}
test('rótulos: caben en el lienzo, no cruzan líneas ni arcos, no se pisan y quedan junto a su vértice (geometría de geo-figura)', () => {
  for (const [s, p] of muestras) {
    if (!p.escena) continue;
    const fig = p.escena.datos, g = GF.geometria(fig);
    assert.ok(casi(gen.marco(fig).s, g.s, 1e-9), `${s}: la escala del generador no es la de geo-figura`);
    const cajas = [];
    for (const q of fig.puntos) if (q.rotulo) {
      const [x, y] = g.S(q.id);
      cajas.push({ t: q.rotulo, b: caja(x + Math.cos(q.lado * RAD) * 15, y - Math.sin(q.lado * RAD) * 15 + 1, T.ancho(q.rotulo, TAM, 600), ALTO_T) });
    }
    for (const r of fig.rotulos || []) { const [x, y] = g.S([r.x, r.y]); cajas.push({ t: r.texto, angulo: r.angulo, b: caja(x, y + 0.6, T.ancho(r.texto, TAM, 700), ALTO_T) }); }
    const lineas = fig.segmentos.map(l => [g.S(l.de), g.S(l.a)]);
    for (const [i, c] of cajas.entries()) {
      const b = c.b;
      assert.ok(b.x0 >= M - 1e-9 && b.x1 <= 320 - M + 1e-9 && b.y0 >= M - 1e-9 && b.y1 <= g.alto - M + 1e-9, `${s} (${p._datos.tipo}): «${c.t}» sale del lienzo`);
      for (const [a, q] of lineas) assert.ok(!cruza(a, q, b), `${s} (${p._datos.tipo}): «${c.t}» cruza una línea`);
      for (const o of cajas.slice(i + 1)) assert.ok(!chocan(b, o.b), `${s} (${p._datos.tipo}): «${c.t}» pisa a «${o.t}»`);
      for (const a of fig.angulos) {
        const cc = g.S(a.en), p1 = g.S(a.de), p2 = g.S(a.a);
        const t1 = Math.atan2(p1[1] - cc[1], p1[0] - cc[0]), t2 = Math.atan2(p2[1] - cc[1], p2[0] - cc[0]);
        let dt = t2 - t1; while (dt > Math.PI) dt -= 2 * Math.PI; while (dt < -Math.PI) dt += 2 * Math.PI;
        if (Math.abs(Math.abs(dt) - Math.PI / 2) < 1e-4) continue; // el cuadradito del recto, junto al vértice
        for (let k = 0; k < Math.max(1, a.marcas || 1); k++) {
          const r = (a.radio || 26) + 5 * k;
          for (let j = 0; j <= 60; j++) { const t = t1 + dt * j / 60, x = cc[0] + r * Math.cos(t), y = cc[1] + r * Math.sin(t); assert.ok(!(x > b.x0 && x < b.x1 && y > b.y0 && y < b.y1), `${s} (${p._datos.tipo}): «${c.t}» sobre un arco`); }
        }
      }
      // Junto a su vértice: el borde a 46 px o menos (28 + 0,55 del ancho si el texto es ancho) y el centro claramente más cerca de su
      // vértice (0,85) que de otro vértice con ángulo.
      if (c.angulo !== undefined) {
        const an = fig.angulos[c.angulo], v = g.S(an.en), cx = (b.x0 + b.x1) / 2, cy = (b.y0 + b.y1) / 2, w = b.x1 - b.x0;
        const borde = Math.hypot(Math.max(b.x0 - v[0], 0, v[0] - b.x1), Math.max(b.y0 - v[1], 0, v[1] - b.y1));
        assert.ok(borde <= Math.max(46, 28 + 0.55 * w) + 1, `${s} (${p._datos.tipo}): «${c.t}» a ${Math.round(borde)} px de ${an.en}`);
        for (const id of new Set(fig.angulos.map(z => z.en))) if (id !== an.en) { const u = g.S(id); assert.ok(Math.hypot(cx - v[0], cy - v[1]) < 0.85 * Math.hypot(cx - u[0], cy - u[1]) + 1e-6, `${s} (${p._datos.tipo}): «${c.t}» se lee como de ${id}`); }
      }
    }
    // Un recto que se pide, o rotulado con una letra, no se dibuja con el cuadradito (diría 90°).
    for (const a of fig.angulos) if (a.etiqueta && (!a.etiqueta.color || !/^\d+°$/.test(a.etiqueta.texto))) {
      const cc = g.S(a.en), p1 = g.S(a.de), p2 = g.S(a.a);
      let dt = Math.atan2(p2[1] - cc[1], p2[0] - cc[0]) - Math.atan2(p1[1] - cc[1], p1[0] - cc[0]); while (dt > Math.PI) dt -= 2 * Math.PI; while (dt < -Math.PI) dt += 2 * Math.PI;
      assert.ok(Math.abs(Math.abs(dt) - Math.PI / 2) >= 1e-4, `${s}: «${a.etiqueta.texto}» es recto y saldría con cuadradito`);
    }
  }
});

test('la figura no rotula nada que el enunciado no diga (salvo «?», x, las partes con k y las letras), y su texto alternativo no trae la respuesta', () => {
  for (const [s, p] of muestras) {
    if (!p.escena) continue;
    const enun = sinDuros(plano(p.enunciado) + ' ' + plano(p.pregunta));
    for (const r of p.escena.datos.rotulos || []) {
      if (/^(\?|x|\d*k)$/.test(r.texto)) continue;
      assert.ok(enun.includes(sinDuros(r.texto)), `${s} (${p._datos.tipo}): la figura rotula «${r.texto}» y el enunciado no`);
    }
    assert.ok(typeof p.escena.datos.alt === 'string' && p.escena.datos.alt.length > 15, `${s}: figura sin texto alternativo`);
    const ok = sinDuros(p.alternativas.find(a => a.correcta).texto);
    if (/^\d.*(°| cm)$/.test(ok)) assert.ok(!new RegExp(`(^|[^\\d])${ok}`).test(sinDuros(p.escena.datos.alt)), `${s}: el texto alternativo trae la respuesta`);
  }
});

test('las piezas dibujan cada figura sin NaN ni colores fijos', () => {
  for (const [s, p] of muestras) {
    if (!p.escena) continue;
    const svg = GF.dibujar(p.escena.datos, { corte: 0 });
    assert.ok(/^<svg[\s>]/.test(svg) && !/NaN|undefined/.test(svg), `${s}: SVG roto`);
    assert.ok(!/#[0-9a-f]{3,6}\b/i.test(svg), `${s}: colores fijos`);
  }
});

test('nunca se queda sin cuatro alternativas (semillas 0 a 2000 y de texto)', () => {
  for (let s = 0; s <= 2000; s++) gen.generar(s);
  for (const s of ['entrada-1', 'entrada-2', 'entrada-3', 'salida-1', 'salida-3', 'papel-1', 'papel-8', 'alumno-7']) gen.generar(s);
  for (const t of gen.TIPOS) for (let s = 0; s < 50; s++) assert.equal(gen.generar(`t${s}`, { tipo: t })._datos.tipo, t);
});

// «x sin °» (decisiones, cuarta ronda): la misma lectura que la prueba de Segmentos y ángulos.
const GRADO_LETRA = /^\d*[a-z]$/, GRADO_NUM = /^\d+(?:,\d+)?$/, GRADO_CON = /^\d+(?:,\d+)?°$/, GRADO_OP = /^[+−·-]$/;
const gradoTermino = t => GRADO_LETRA.test(t) || GRADO_NUM.test(t) || GRADO_CON.test(t);
function gradoExpresion(tokens) {
  const out = [];
  for (let i = 0; i < tokens.length; i += 2) {
    if (!gradoTermino(tokens[i])) break;
    out.push(tokens[i]);
    if (!GRADO_OP.test(tokens[i + 1] || '') || !gradoTermino(tokens[i + 2] || '')) break;
  }
  return out;
}
function gradosMal(texto) {
  const s = String(texto).replace(/[  ⁠]/g, ' '), mal = [];
  const soloLetra = e => e.length > 0 && e.some(t => GRADO_LETRA.test(t)) && !e.some(t => GRADO_CON.test(t));
  const soloGrados = e => e.length > 0 && e.every(t => GRADO_CON.test(t));
  for (const m of s.matchAll(/(?<![A-Za-zÀ-ÿ])[a-z]°/g)) mal.push(`«${m[0]}» en «${s.slice(0, 90)}»`);
  for (const m of s.matchAll(/¿Cuánto miden? [a-z]\b/g)) mal.push(`«${m[0]}» en «${s.slice(0, 90)}»`);
  for (const trozo of s.split(/[:;?¿→()«»]|[,.](?=\s|$)|\s{2,}| y | o /)) {
    const lados = trozo.split(/\s*[=<>≤≥]\s*/);
    for (let i = 0; i + 1 < lados.length; i++) {
      const L = gradoExpresion(lados[i].trim().split(/\s+/).filter(Boolean).reverse()), R = gradoExpresion(lados[i + 1].trim().split(/\s+/).filter(Boolean));
      if ((soloLetra(L) && soloGrados(R)) || (soloGrados(L) && soloLetra(R))) mal.push(`una letra igualada a grados en «${trozo.trim().slice(0, 90)}»`);
    }
  }
  return mal;
}
test('x sin «°»: una letra vale un número; el grado va en lo que se mide (400 semillas, 40 por tipo, y el papel)', () => {
  const mal = new Set();
  let pideX = 0;
  for (const [s, p] of muestras) {
    const textos = [plano(p.enunciado), plano(p.pregunta), ...p.datos, ...p.solucion.map(plano), ...p.alternativas.flatMap(a => [a.texto, a.error ? a.error.explicacion : ''])];
    const fig = p.escena && p.escena.datos;
    if (fig) textos.push(fig.alt || '', ...(fig.rotulos || []).map(r => r.texto || ''));
    for (const t of textos) for (const m of gradosMal(t)) mal.add(`${s}: ${m}`);
    const q = plano(p.pregunta);
    if (/¿Cuánto vale x\?/.test(q)) { pideX++; for (const a of p.alternativas) assert.ok(!/°/.test(a.texto), `${s}: se pide x y la alternativa es «${a.texto}»`); }
    if (/¿Cuánto mide el ángulo|¿Qué ángulo/.test(q)) for (const a of p.alternativas) assert.ok(/°$/.test(a.texto), `${s}: se pide un ángulo y la alternativa es «${a.texto}»`);
  }
  const papel = require('./papel.json');
  for (const p of papel.problemas) for (const t of [p.enunciado, p.respuesta, ...p.pasos]) for (const m of gradosMal(t)) mal.add(`papel ${p.id}: ${m}`);
  assert.ok(pideX > 10, `pocos problemas que piden x: ${pideX}`);
  for (const t of ['x = 17°', 'x°', '3x = 90°', '¿Cuánto mide x?']) assert.ok(gradosMal(t).length, `no detecta «${t}»`);
  for (const t of ['x = 17', 'm∠A = 3x + 29°', '3 · 17 + 29° = 80°']) assert.deepEqual(gradosMal(t), [], `«${t}» está bien`);
  assert.deepEqual([...mal].slice(0, 20), []);
});

test('papel: 8 problemas del generador, de las seis ideas, con «Datos:» al final y sin figura que haga falta', () => {
  const papel = require('./papel.json');
  assert.equal(papel.problemas.length, 8);
  const ideas = new Set();
  papel.problemas.forEach((q, i) => {
    const p = gen.generar(`papel-${i + 1}`);
    ideas.add(p._datos.idea);
    assert.ok(q.enunciado.startsWith(sinDuros(`${plano(p.enunciado)} ${plano(p.pregunta)}`).slice(0, 40)) || sinDuros(q.enunciado).startsWith(sinDuros(`${plano(p.enunciado)} ${plano(p.pregunta)}`).slice(0, 40)), `${q.id}: no es el del generador`);
    assert.ok(/ Datos: .+ Alternativas: /.test(q.enunciado), `${q.id}: sin datos al final`);
    assert.ok(!/figura/i.test(q.enunciado), `${q.id}: pide mirar una figura`);
  });
  assert.equal(ideas.size, 6, 'el papel cubre las seis ideas');
});

test('las pruebas de entrada y salida de la práctica (sin figura) solo traen tipos que se resuelven con el texto', () => {
  const tipos = s => gen.generar(s)._datos.tipo;
  for (const f of ['entrada', 'salida']) for (let i = 1; i <= 3; i++) assert.ok(!['reconocer'].includes(tipos(`${f}-${i}`)), `${f}-${i}`);
  assert.deepEqual([1, 2, 3].map(i => tipos(`entrada-${i}`)), [1, 2, 3].map(i => tipos(`salida-${i}`)), 'la salida repite los tipos de la entrada');
  assert.notDeepEqual(gen.generar('entrada-1').enunciado, gen.generar('salida-1').enunciado);
});
