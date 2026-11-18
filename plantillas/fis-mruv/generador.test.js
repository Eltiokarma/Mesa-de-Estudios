// Pruebas de «MRUV y caída libre» (fis-mruv): casos.json (calculados aparte, con un script que no usa el generador ni
// el motor), un recálculo independiente en 600 problemas (fórmulas cerradas, sin plantillas/mruv/motor.js), fugas, los
// tipos por idea, los colores de la unidad, los códigos de error y su respaldo, el recuadro «Datos» en 400 semillas, el
// papel, el catálogo y que la práctica no repite ninguna Predice de la teoría.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const gen = require('./generador.js');
const casos = require('./casos.json');
const papel = require('./papel.json');
const { probarGenerador, probarFugas } = require('../../nucleo/probar-generador.js');
const UNIDAD = 'fisica.mruv-y-caida-libre';
const TEORIA = require.resolve('../../contenido/teoria/fisica/mruv-y-caida-libre.js');
const CIN = 'docs/investigacion/cinematica-ideas-erroneas.md';
const TRA = 'docs/investigacion/fisica-calculo-transversal-ideas-erroneas.md';

// ---- Camino independiente: fórmulas cerradas con los datos del problema (g = 10, sonido a 340 m/s) ----
const g = 10, sq = Math.sqrt;
const FORMA = {
  constante: { 'x–t': 'recta inclinada que sube', 'v–t': 'horizontal en', 'a–t': 'horizontal en 0' },
  acelera: { 'x–t': 'curva que se empina', 'v–t': 'recta inclinada que sube', 'a–t': 'horizontal en' },
  frena: { 'x–t': 'curva que se aplana', 'v–t': 'recta que baja hasta 0', 'a–t': 'horizontal en −' },
};
// La raíz positiva de p·t² + q·t + r = 0.
const raiz = (p, q, r) => (-q + sq(q * q - 4 * p * r)) / (2 * p);
function recalcular(pr) {
  const d = pr._datos;
  switch (d.tipo) {
    case 'acel': return (d.v1 - d.v0) / d.dt;
    case 'velocidad': return d.v0 + d.a * d.t;
    case 'tiempo': return d.dt;
    case 'kmh': return (d.k1 - d.k0) * 1000 / 3600 / d.dt;
    case 'izquierda': return (-d.S1 + d.S0) / d.dt;
    case 'medias': return d.sub === 'tramo2' ? (d.k2 - d.k1) / 3.6 / d.t2 : d.k2 / 3.6 / (d.t1 + d.t2);
    case 'velocimetro': return d.K * d.t / d.T;
    case 'avance': return (d.v0 + d.v1) / 2 * d.t;
    case 'frenado': return d.v0 * d.v0 / (2 * d.A);
    case 'posicion': return d.x0 + d.v0 * d.t + d.a * d.t * d.t / 2;
    case 'v2': return sq(d.v0 * d.v0 + 2 * d.a * d.dx);
    case 'kmh-frenado': return (d.k0 / 3.6) ** 2 / (2 * d.A);
    case 'horaria': return d.sub === 'velocidad' ? d.B + 2 * d.s * d.C * d.t : d.B * (d.t2 - d.t1) + d.s * d.C * (d.t2 ** 2 - d.t1 ** 2);
    case 'proporcion': return d.d1 * d.k * d.k;
    case 'enesimo': return (d.v0 * d.n + d.a * d.n * d.n / 2) - (d.v0 * (d.n - 1) + d.a * (d.n - 1) ** 2 / 2);
    case 'pendiente': return (d.v2 - d.v1) / d.T;
    case 'area': return d.sub === 'tri' ? d.V1 * d.T / 2 : (d.v1 + d.v2) / 2 * d.T;
    case 'retroceso': return d.sub === 'desplazamiento' ? d.v1 * d.t1 - d.v2 * d.t2 : d.v1 * d.t1 + d.v2 * d.t2;
    case 'tramos': return d.V * d.t1 / 2 + d.V * d.t2;
    case 'cruza-eje': { const V1 = d.a * d.t0, V2 = d.a * d.tb, T = d.t0 + d.tb; return d.sub === 'desplazamiento' ? V1 * T - d.a * T * T / 2 : (V1 * V1 + V2 * V2) / (2 * d.a); }
    case 'tren': { const D = d.a * d.k * d.k; return d.sub === 'tiempo' ? 2 * sq(D / d.a) : sq(d.a * D); }
    case 'area-acel': { const D = d.V * d.t / 2; return -d.V * d.V / (2 * D); }
    case 'at-v': return d.v0 + d.a * d.T;
    case 'forma': return FORMA[d.mov][d.sub];
    case 'igual-velocidad': return d.V / d.a;
    case 'tramos-at': return d.a1 * d.t1 + d.a2 * d.t2;
    case 'alcance': return d.sub === 'tiempo' ? 2 * d.V / d.a : 2 * d.V * d.V / d.a;
    case 'at-distancia': { const vm = d.a1 * d.t1; return vm * d.t1 / 2 + vm * d.t2 + vm * vm / (2 * d.a3); }
    case 'alcance-detras': { const D = d.a * d.t * d.t / 2 - d.V * d.t; return d.V * raiz(d.a / 2, -d.V, -D); }
    case 'separacion': return d.V * d.V / (2 * d.a);
    case 'altura': return g * d.t * d.t / 2;
    case 'caida-v': return d.sub === 'tiempo' ? g * d.t : sq(2 * g * (5 * d.t * d.t));
    case 'caida-t': return sq(2 * (5 * d.t * d.t) / g);
    case 'regla': return sq(2 * (500 * d.t * d.t / 100) / g);
    case 'caida-kmh': return sq(2 * g * 5 * d.t * d.t) * 3.6;
    case 'doble': return d.t * sq(d.k);
    case 'caida-enesimo': return g * d.n * d.n / 2 - g * (d.n - 1) ** 2 / 2;
    case 'dos-esferas': return sq(2 * 5 * d.k2 * d.k2 / g) - sq(2 * 5 * d.k1 * d.k1 / g);
    case 'pozo': { const h = 5 * d.t * d.t; return sq(2 * h / g) + h / 340; }
    case 'subida': return d.v0 / g;
    case 'altura-max': return d.v0 * d.v0 / (2 * g);
    case 'velocidad-t': return d.v0 - g * d.t;
    case 'posicion-t': return d.v0 * d.t - g * d.t * d.t / 2;
    case 'velocidad-y': return -d.vb;
    case 'kmh-altura': return (d.k0 / 3.6) ** 2 / (2 * g);
    case 'azotea': { const Y0 = 5 * d.t * d.t - d.v0 * d.t; return raiz(g / 2, -d.v0, -Y0); }
    case 'encuentro': return d.sub === 'tiempo' ? (d.v0 * d.t) / d.v0 : d.v0 * d.t - g * d.t * d.t / 2;
    case 'retorno': return d.sub === 'v0' ? g * d.T / 2 : g * (d.T / 2) ** 2 / 2;
    default: throw new Error(`tipo sin recálculo: ${d.tipo}`);
  }
}
const igual = (esperado, valor) => (typeof esperado === 'string' ? String(valor).toLowerCase().includes(esperado.toLowerCase())
  : Math.abs(esperado - valor) < 1e-9 * Math.max(1, Math.abs(esperado)));
probarGenerador(gen, { semillas: 600, recalcular, igual });
probarFugas(gen, { grupo: p => [p._datos.tipo, p._datos.sub || ''].join('/') });

for (const c of casos.casos) {
  test(`casos.json: semilla ${c.semilla} (${c.entrada.tipo})`, () => {
    const p = gen.generar(c.semilla);
    assert.deepEqual(p._datos, c.entrada, 'el generador cambió: recalcula casos.json');
    if (typeof c.esperado.respuesta === 'number') assert.ok(Math.abs(p.respuesta.valor - c.esperado.respuesta) < 1e-9 * Math.max(1, Math.abs(c.esperado.respuesta)), `${p.respuesta.valor} ≠ ${c.esperado.respuesta}`);
    else assert.equal(p.respuesta.valor, c.esperado.respuesta);
    assert.equal(p.alternativas.find(a => a.correcta).texto, c.esperado.texto);
  });
}

const T = require(TEORIA);
const IDEAS = T.ideas.map(i => i.id);
test('tipos por idea: las seis ideas de la teoría, y generar(semilla, { idea }) da solo los suyos, con los tres niveles', () => {
  assert.deepEqual(Object.keys(gen.TIPOS_POR_IDEA), IDEAS);
  for (const idea of IDEAS) {
    const vistos = new Set(), niveles = new Set();
    for (let s = 0; s < 400; s++) {
      const p = gen.generar(`i${s}`, { idea, unidad: UNIDAD });
      assert.equal(p._datos.idea, idea);
      assert.ok(gen.TIPOS_POR_IDEA[idea].includes(p._datos.tipo), `${idea}: salió ${p._datos.tipo}`);
      vistos.add(p._datos.tipo); niveles.add(p._datos.nivel);
    }
    assert.deepEqual([...vistos].sort(), [...gen.TIPOS_POR_IDEA[idea]].sort(), `${idea}: no salen todos sus tipos`);
    assert.deepEqual([...niveles].sort(), [1, 2, 3], `${idea}: niveles ${[...niveles]}`);
  }
});

const VARIANTES = ['acel/acelera', 'acel/frena', 'velocidad', 'tiempo', 'kmh/arranca', 'kmh/frena', 'izquierda/frena', 'izquierda/acelera',
  'medias/tramo2', 'medias/total', 'velocimetro', 'avance', 'frenado', 'posicion', 'v2', 'kmh-frenado', 'horaria/velocidad',
  'horaria/desplazamiento', 'proporcion', 'enesimo', 'pendiente/sube', 'pendiente/baja', 'area/tri', 'area/trap',
  'retroceso/desplazamiento', 'retroceso/distancia', 'tramos', 'cruza-eje/desplazamiento', 'cruza-eje/distancia', 'tren/tiempo',
  'tren/vmax', 'area-acel', 'at-v/acelera', 'at-v/frena', 'forma/x–t', 'forma/v–t', 'forma/a–t', 'igual-velocidad', 'tramos-at',
  'alcance/tiempo', 'alcance/donde', 'at-distancia', 'alcance-detras', 'separacion', 'altura', 'caida-v/tiempo', 'caida-v/altura',
  'caida-t', 'regla', 'caida-kmh', 'doble', 'caida-enesimo', 'dos-esferas', 'pozo', 'subida', 'altura-max', 'velocidad-t',
  'posicion-t', 'velocidad-y', 'kmh-altura', 'azotea', 'encuentro/tiempo', 'encuentro/altura', 'retorno/v0', 'retorno/altura'];
// Los códigos nuevos de esta práctica (hipótesis; la cabecera del generador y el informe de cinemática dicen qué mide cada uno).
const NUEVOS = ['K-SIN-V0', 'K-INVERSA', 'K-RESTA-T', 'K-MITAD', 'MED-SIN-RESTA', 'MED-SUMA-A', 'U1-al-reves', 'U1-ms',
  'MRUV-RESTA', 'MRUV-SIN-CUADRADO', 'MRUV-RAIZ', 'MRUV-SIN-DOS', 'MRUV-SIN-V0', 'MRUV-SUMA-RAIZ', 'MRUV-POS-INICIAL', 'MRUV-DISTANCIA',
  'MRUV-DIF-D', 'MRUV-ENESIMO', 'MRUV-VEL-N', 'MRUV-ANTERIOR', 'MRUV-OTRO-SEG', 'DX-SIGNO', 'DX-SOLO-TRI', 'DX-MEDIA-V', 'DX-TRAPECIO',
  'MRUV-DOBLE-TRAMO', 'MRUV-VMAX', 'MRUV-MEDIA-V', 'G4-tiempo', 'AT-TRAMO', 'AT-TODO', 'AT-ALTURA', 'K-ALC-TIEMPO', 'K-ALC-SIN-D',
  'K-SEP-ALCANCE', 'K-SEP-TIEMPO', 'K-SEP-MOTO', 'C-IGUAL', 'C-CUADRADO', 'C-ANTERIOR', 'C-OTRO-SEG', 'C-SUMA-T', 'C-SOLO-UNA',
  'C-SONIDO-DOBLE', 'U2-cm', 'C-SIN-G', 'C-SIN-V0', 'C-MITAD-T', 'C-SOLO-G', 'C-VUELTA-SOLTAR', 'C-ENC-CAIDO', 'C-ENC-SIN-G',
  'C-ENC-MITAD-H', 'C-CUARTO'];
// Los de la unidad que esta práctica usa (cabecera de la teoría), y G1, del informe (documentado).
const DE_LA_UNIDAD = ['K3', 'K4', 'K-SIGNO', 'K-TIEMPO', 'K-CUADRADO', 'K-SINDIV', 'K-SUMA', 'K-POR', 'MED-PROMEDIO-A', 'MED-TRAMO', 'U1-kmh',
  'PR1-frenado', 'MRUV-FRENO-IGUAL', 'MRUV-VT', 'MRUV-TIEMPO', 'MRUV-SIGNO-D', 'DX-RECT', 'DX-SEMI', 'DX-INICIAL', 'MRUV-ACEL', 'MRU-X0',
  'MRUV-MEDIO', 'MRUV-SIN-A', 'MRUV-MEDIO-A', 'MRUV-POSICION', 'MRUV-POSICION-FINAL', 'MRUV-DESDE-0', 'DX-SUMA', 'DX-IDA', 'DX-ALTURA',
  'DX-RESTA', 'DX-TRIANGULO', 'G4', 'MRUV-MITAD', 'MRUV-SOLO-ACELERA', 'K1-a', 'G3', 'G-SENTIDO', 'G4-medio', 'DX-TRAMO',
  'K-ALC-PERSEGUIDOR', 'K-ALC-D', 'C-MEDIO', 'C-VELOCIDAD', 'C-LINEAL', 'C-RAIZ', 'C-TIEMPO', 'C-RESTA-ALTURAS', 'C-SIN-SONIDO',
  'C-VUELTA', 'C-ENESIMO', 'K3', 'C-ALTURA', 'C-SOLTAR', 'C-SUBIDA', 'C-ENC-MITAD', 'C-ENC-CAIDA', 'G1', 'PR1'];
test('salen todas las variantes, todos los códigos nuevos y los de la unidad', () => {
  const tipos = new Set(), ids = new Set();
  for (let s = 0; s < 6000; s++) {
    const p = gen.generar(s), d = p._datos;
    tipos.add(d.tipo + (d.sub ? '/' + d.sub : ''));
    for (const a of p.alternativas) if (a.error) ids.add(a.error.id);
  }
  for (const t of VARIANTES) assert.ok(tipos.has(t), `no sale ${t}`);
  assert.equal(tipos.size, VARIANTES.length, `variantes de más: ${[...tipos].filter(t => !VARIANTES.includes(t))}`);
  for (const id of [...NUEVOS, ...DE_LA_UNIDAD]) assert.ok(ids.has(id), `no sale ${id}`);
});

test('cada error es de la unidad o nuevo, con su respaldo y su fuente; los nuevos no están en la teoría y sí en el informe', () => {
  const teoria = fs.readFileSync(TEORIA, 'utf8'), informe = fs.readFileSync(path.join(__dirname, '..', '..', CIN), 'utf8');
  const esta = (txt, id) => new RegExp(`(^|[^A-Za-z0-9-])${id.replace(/-/g, '\\-')}(?![A-Za-z0-9-])`).test(txt);
  for (const n of NUEVOS) {
    assert.ok(!esta(teoria, n), `${n} ya está en la teoría: no es nuevo`);
    assert.ok(esta(informe, n), `${n} falta en el informe de cinemática`);
  }
  for (const id of DE_LA_UNIDAD) if (id !== 'G1' && id !== 'PR1') assert.ok(esta(teoria, id), `${id} no está en la teoría`);
  const DOC = ['C1', 'G1', 'G3', 'G4'], PARCIAL = ['K1-a', 'K3', 'K4', 'C2'];
  for (let s = 0; s < 2000; s++) for (const a of gen.generar(s).alternativas.filter(x => x.error)) {
    const id = a.error.id;
    assert.ok(DE_LA_UNIDAD.includes(id) || NUEVOS.includes(id), `semilla ${s}: ${id} no es de la unidad ni nuevo`);
    assert.equal(a.error.respaldo, DOC.includes(id) ? 'documentado' : PARCIAL.includes(id) ? 'parcial' : 'hipotesis', `semilla ${s}: ${id} con respaldo ${a.error.respaldo}`);
    assert.equal(a.error.fuente, /^(U1|U2|PR1)\b/.test(id) ? TRA : CIN, `semilla ${s}: ${id} con fuente ${a.error.fuente}`);
  }
});

test('cada explicación empieza por lo que el alumno hizo bien, muestra lo que da su error y no nombra una letra', () => {
  for (let s = 0; s < 2000; s++) {
    const p = gen.generar(s);
    for (const a of p.alternativas.filter(x => x.error)) {
      const e = a.error.explicacion;
      assert.match(e, /^Bien/, `semilla ${s}: ${e}`);
      assert.ok(e.includes(a.texto), `semilla ${s}: «${e}» no muestra ${a.texto}`);
      assert.ok(!/\b(alternativa|opción|letra) [A-E]\b|\([A-E]\)|\bla [A-E]\b/.test(e), `semilla ${s}: nombra una letra: ${e}`);
      assert.ok(e.split(/\s+/).length <= 40, `semilla ${s}: explicación larga: ${e}`);
    }
  }
});

// Un color fijo por magnitud, el de la unidad (cabecera de mruv-y-caida-libre.js): v naranja, t turquesa, x (posición,
// desplazamiento, altura) violeta, a y g carmín. Sin verde. Ninguna letra de alternativa en violeta (ni en otro color).
test('un color por magnitud: v naranja, t turquesa, x violeta, a carmín; sin verde ni letras de alternativa con color', () => {
  const COLOR = { v: 'o', t: 'i', x: 'f', a: 'h' };
  for (let s = 0; s < 1000; s++) {
    const p = gen.generar(s), V = p.variables, usadas = new Set();
    for (const [k, x] of Object.entries(V)) {
      assert.equal(x.color, COLOR[k], `semilla ${s}: ${k} en ${x.color}`);
      assert.ok(x.nombre, `semilla ${s}: ${k} sin nombre`);
    }
    for (const linea of [p.enunciado, p.pregunta, ...p.solucion]) for (const x of linea) {
      if (x && typeof x === 'object') {
        assert.ok(V[x.v], `semilla ${s}: «${x.t}» usa ${x.v}, que no está`); assert.ok(x.t, `semilla ${s}: tramo vacío`); usadas.add(x.v);
        assert.ok(!/^[A-E]\)?$/.test(x.t), `semilla ${s}: la letra «${x.t}» lleva color`);
      } else assert.equal(typeof x, 'string', `semilla ${s}: tramo inválido`);
    }
    assert.deepEqual([...usadas].sort(), Object.keys(V).sort(), `semilla ${s}: variable sin usar`);
    // La respuesta va en el color de su magnitud, en la última línea de la solución (salvo la distancia y la forma, en tinta).
    const d = p._datos;
    const tinta = ['retroceso', 'cruza-eje'].includes(d.tipo) && d.sub === 'distancia' || ['forma', 'at-distancia'].includes(d.tipo);
    if (!tinta) assert.ok(p.solucion[p.solucion.length - 1].some(x => x && typeof x === 'object'), `semilla ${s}: la respuesta sin color`);
  }
});

test('notación: «−» de verdad, coma decimal, v_0 con subíndice, sin «^», «*», «ᵧ» ni «vo»', () => {
  const plano = x => (Array.isArray(x) ? x.map(plano).join('') : x && typeof x === 'object' ? x.t : String(x));
  for (let s = 0; s < 1500; s++) {
    const p = gen.generar(s);
    const todo = [p.enunciado, p.pregunta, ...p.solucion].map(plano).concat(p.datos, p.alternativas.map(a => a.texto), p.alternativas.filter(a => a.error).map(a => a.error.explicacion)).join(' ');
    assert.ok(!/[\^*ᵧ]|\d-\d|\s-\d|\d\.\d|\bv0\b|\bvo\b|\bNaN\b|\bundefined\b/.test(todo), `semilla ${s}: ${todo}`);
    // En las alternativas no hay subíndices «_» (la app no los convierte ahí).
    for (const a of p.alternativas) assert.ok(!a.texto.includes('_'), `semilla ${s}: ${a.texto}`);
  }
});

// Recuadro «Datos» (docs/plan-calidad.md §3, punto 13): líneas cortas en texto plano, sin la respuesta ni el paso hecho,
// con la fórmula de cada idea; sin atajos (tₛ = v₀/g, H = v₀²/2g, dₙ = v₀ + a(n − ½)) ni consejos.
test('datos: una lista de líneas cortas, sin la respuesta, sin atajos y con la fórmula de cada idea, en 400 semillas', () => {
  const palabras = t => t.split(/\s+/).filter(w => /\p{L}/u.test(w)).length;
  const FORMULA = {
    aceleracion: /a(_m)? = Δv\/Δt|v = v_0 \+ a · t/, 'ecuaciones-mruv': /x = x_0 \+ v_0 · t \+ ½ · a · t²/, 'pendiente-aceleracion': /Pendiente de la gráfica v–t: a = Δv\/Δt/,
    'graficas-xt-at': /x–t: posición contra tiempo/, 'caida-reposo': /h = ½ · g · t²/, 'caida-libre': /y = v_0 · t − ½ · g · t²/,
  };
  // Constantes y equivalencias que pueden coincidir con una respuesta sin darla (g = 10, 340 m/s, 1000 m, 3600 s, 100 cm).
  const CONSTANTES = /g = 10 m\/s²|unos 340 m\/s|1 km = 1000 m y 1 h = 3600 s|1 m = 100 cm/g;
  for (let s = 0; s < 400; s++) {
    for (const idea of [undefined, ...IDEAS]) {
      const p = gen.generar(`d${s}`, idea ? { idea } : {}), d = p._datos;
      assert.ok(Array.isArray(p.datos) && p.datos.length, `semilla ${s}: datos debe ser una lista no vacía`);
      for (const l of p.datos) {
        assert.ok(typeof l === 'string' && l.trim() === l && l.length, `semilla ${s}: línea vacía o con espacios`);
        assert.ok(palabras(l) <= 22, `semilla ${s}: «${l}» tiene ${palabras(l)} palabras`);
        assert.ok(!/<[a-z/]|\bnull\b|\bNaN\b|\bundefined\b|^Dato:/i.test(l), `semilla ${s}: «${l}»`);
        assert.ok(!/v_0\/g|v_0²\/2g|v_0²\/\(2g\)|n − ½|\bdebes\b|\brecuerda\b|\bfíjate\b/i.test(l), `semilla ${s}: atajo o consejo: «${l}»`);
      }
      assert.equal(new Set(p.datos).size, p.datos.length, `semilla ${s}: líneas repetidas`);
      const todo = p.datos.join('\n');
      assert.match(todo, FORMULA[d.idea], `semilla ${s} (${d.tipo}): falta la fórmula de su idea`);
      const c = p.alternativas.find(a => a.correcta).texto;
      const sin = todo.replace(CONSTANTES, '');
      assert.ok(!sin.includes(c), `semilla ${s}: los datos traen la respuesta ${c}`);
      for (const [n] of c.replace(/ /g, ' ').matchAll(/\d+(,\d+)?/g)) if (n.length >= 2) assert.ok(!new RegExp(`(?<![\\d,])${n}(?![\\d,])`).test(sin), `semilla ${s}: los datos traen ${n} (${c})`);
    }
  }
});

test('situaciones posibles (punto 10): rapideces, alturas y tiempos de problema', () => {
  for (let s = 0; s < 3000; s++) {
    const p = gen.generar(s), d = p._datos, txt = [p.enunciado, p.pregunta].map(l => l.map(x => (typeof x === 'string' ? x : x.t)).join('')).join(' ');
    for (const [, n] of txt.replace(/ /g, '').matchAll(/(\d+(?:,\d+)?) m\/s(?!²)/g)) assert.ok(Number(n.replace(',', '.')) <= 30, `semilla ${s}: ${txt}`);
    for (const [, n] of txt.matchAll(/(\d+) km\/h/g)) assert.ok(Number(n) <= 108, `semilla ${s}: ${txt}`);
    if (/mototaxi/.test(txt)) for (const [, n] of txt.matchAll(/mototaxi[^.]*? a (\d+(?:,\d+)?) m\/s/g)) assert.ok(Number(n.replace(',', '.')) <= 15, `semilla ${s}: ${txt}`);
    if (/ventana/.test(txt)) for (const [, n] of txt.matchAll(/(\d+(?:,\d+)?) m del/g)) assert.ok(Number(n.replace(',', '.')) <= 15, `semilla ${s}: ${txt}`);
    if (/azotea/.test(txt)) for (const [, n] of txt.matchAll(/(\d+(?:,\d+)?) m (del|de la)/g)) assert.ok(Number(n.replace(',', '.')) <= 45, `semilla ${s}: ${txt}`);
    if (d.idea === 'caida-libre') for (const [, n] of txt.replace(/\u00a0/g, '').matchAll(/(\d+(?:,\d+)?) m\/s(?!²)/g)) assert.ok(Number(n.replace(',', '.')) <= 20, `semilla ${s}: pelota muy rápida: ${txt}`);
    if (d.tipo === 'regla') assert.ok(500 * d.t * d.t <= 30, `semilla ${s}: la regla mide 30 cm`);
  }
});

test('nunca se queda sin cuatro alternativas (semillas 0 a 2000, de texto y por idea)', () => {
  for (let s = 0; s <= 2000; s++) gen.generar(s);
  for (const s of ['entrada-1', 'entrada-2', 'entrada-3', 'salida-1', 'salida-2', 'salida-3', 'papel-1', 'examen-x'])
    for (const idea of [undefined, ...IDEAS]) gen.generar(s, { unidad: UNIDAD, idea });
});

test('papel.json: 8 problemas de las seis ideas, con sus datos al final y su respuesta recalculada', () => {
  assert.equal(papel.problemas.length, 8);
  const ideas = new Set(), niveles = new Set();
  papel.problemas.forEach((pr, i) => {
    const p = gen.generar(`papel-${i + 1}`);
    ideas.add(p._datos.idea); niveles.add(p._datos.nivel);
    assert.match(pr.enunciado, /\? Datos: .+ Alternativas: /, pr.id);
    assert.ok(pr.respuesta.endsWith(p.alternativas.find(a => a.correcta).texto), pr.id);
    assert.ok(igual(recalcular(p), p.respuesta.valor), pr.id);
  });
  assert.deepEqual([...ideas].sort(), [...IDEAS].sort());
  assert.deepEqual([...niveles].sort(), [1, 2, 3]);
});

test('la unidad lista esta plantilla primero, la ficha es solo suya y el repaso la usa entera', () => {
  const raiz = path.join(__dirname, '..', '..');
  const cat = JSON.parse(fs.readFileSync(path.join(raiz, 'catalogo', 'cursos', 'fisica.json'), 'utf8'));
  assert.equal(cat.unidades.find(u => u.id === UNIDAD).plantillas[0], 'fis-mruv');
  const ficha = JSON.parse(fs.readFileSync(path.join(__dirname, 'plantilla.json'), 'utf8'));
  assert.deepEqual(ficha.unidades, [UNIDAD]);
  const RT = require('../../nucleo/repaso-tipos.js');
  assert.ok(RT.cubre(ficha, UNIDAD));
  for (let s = 0; s < 50; s++) assert.equal(RT.unidadDe(ficha, gen.generar(`r${s}`)), UNIDAD, `semilla ${s}`);
});

test('la física la hace el motor de la escena MRUV, no una copia', () => {
  const src = fs.readFileSync(path.join(__dirname, 'generador.js'), 'utf8');
  assert.match(src, /require\('\.\.\/mruv\/motor\.js'\)/);
  assert.ok(!/function movil\b|function lanzamientoVertical\b|function instantesIguales\b/.test(src), 'el generador copió el motor');
  for (const fn of ['movil', 'enesimoSegundo', 'cruces', 'igualVelocidad', 'lanzamientoVertical', 'pendiente']) assert.match(src, new RegExp(`M\\.${fn}\\(`), `no usa M.${fn}`);
});

// La práctica no repite las predicciones de la teoría (Ejercicios se abre sin pasar por Predice): la combi de 20 a 8 m/s en
// 4 s (idea 1), la que frena con 2 m/s² a 10 o 20 m/s (idea 2), el mototaxi de 3 s a 4 m/s que retrocede 4 s a 1,5 m/s
// (idea 3) y el mototaxi a 10 m/s con la combi de 2 m/s² (idea 4). Las de las ideas 5 y 6 son conceptuales (la canica y
// la piedra; la aceleración en la cima) y ningún tipo las pregunta.
test('la práctica no repite las predicciones de la unidad', () => {
  const plano = x => (Array.isArray(x) ? x.map(plano).join('') : x && typeof x === 'object' ? (x.t !== undefined ? String(x.t) : '') : String(x));
  const predices = T.ideas.map(i => plano(i.predice.pregunta));
  assert.match(predices[0], /20 m\/s.*8 m\/s/); assert.match(predices[2], /1,5 m\/s/); assert.match(predices[3], /2 m\/s²/);
  const ve = d => (d.tipo === 'acel' && d.v0 === 20 && d.v1 === 8 && d.dt === 4)
    || (['frenado'].includes(d.tipo) && d.A === 2 && [10, 20].includes(d.v0))
    || (d.tipo === 'retroceso' && d.v1 === 4 && d.t1 === 3 && d.v2 === 1.5 && d.t2 === 4)
    || (['igual-velocidad', 'alcance', 'separacion'].includes(d.tipo) && d.V === 10 && d.a === 2);
  for (const idea of [undefined, ...IDEAS]) for (let s = 0; s < 400; s++) {
    const p = gen.generar(`p${s}`, idea ? { idea } : {});
    assert.ok(!ve(p._datos), `${idea} semilla ${s}: ${JSON.stringify(p._datos)}`);
    const t = [p.enunciado, p.pregunta].map(plano).join(' ');
    assert.ok(!/canica y una piedra|Justo ahí, ¿cuánto vale su aceleración/.test(t), `${idea} semilla ${s}: ${t}`);
  }
});

// Correcciones del 18 nov (auditoría de la unidad): el encuentro trae la altura con y_0 (A3), frente al colegio no se va a
// más de 12 m/s y los puentes no pasan de 80 m (B1 y B2).
test('el encuentro trae y = y_0 + …; frente al colegio, hasta 12 m/s; puentes de hasta 80 m', () => {
  const plano = x => (Array.isArray(x) ? x.map(plano).join('') : x && typeof x === 'object' ? (x.t !== undefined ? String(x.t) : '') : String(x));
  const num = s => Number(s.replace(/\s/g, '').replace(',', '.'));
  let enc = 0;
  for (const idea of [undefined, ...IDEAS]) for (let s = 0; s < 600; s++) {
    const p = gen.generar(`c${s}`, idea ? { idea } : {}), t = plano(p.enunciado), d = p.datos.join('\n');
    if (p._datos.tipo === 'encuentro') { enc++; assert.match(d, /y = y_0 \+ v_0 · t − ½ · g · t²/, `semilla ${s}`); }
    const col = t.match(/Frente al colegio, una combi va a ([\d,]+) (m\/s|km\/h)/);
    if (col) assert.ok(num(col[1]) / (col[2] === 'km/h' ? 3.6 : 1) <= 12 + 1e-9, `semilla ${s}: ${t}`);
    const pu = t.match(/puente a ([\d ,]+) m/);
    if (pu) assert.ok(num(pu[1]) <= 80, `semilla ${s}: ${t}`);
  }
  assert.ok(enc > 10, `${enc} encuentros`);
});
