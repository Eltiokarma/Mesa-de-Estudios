// Pruebas de «La combi, la gráfica y el río» (fis-mru): casos.json (calculados aparte, con un script que no usa el
// generador), un recálculo independiente en 600 problemas (paso a paso en el tiempo, bisección sobre las posiciones o la
// recta que pasa por los dos puntos, nunca la fórmula corta del generador), fugas, los tipos por idea, los colores de la
// unidad, los códigos de error, el recuadro «Datos» en 400 semillas, la figura x–t, el papel, el catálogo y que la
// práctica no repite ninguna Predice de la teoría.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const gen = require('./generador.js');
const casos = require('./casos.json');
const papel = require('./papel.json');
const { probarGenerador, probarFugas } = require('../../nucleo/probar-generador.js');
const UNIDAD = 'fisica.movimiento-rectilineo';
const TEORIA = require.resolve('../../contenido/teoria/fisica/movimiento-rectilineo.js');
const T = require(TEORIA);

// ---- Camino independiente ----
function biseccion(g, a, b) {
  let ga = g(a);
  for (let i = 0; i < 200; i++) { const m = (a + b) / 2, gm = g(m); if ((gm > 0) === (ga > 0)) { a = m; ga = gm; } else b = m; }
  return (a + b) / 2;
}
// Primer instante en que g pasa de negativa a positiva (o se anula), buscando en pasos de 0,01 s y afinando.
function cuandoCruza(g, tmax = 5000) {
  let t = 0;
  if (g(0) >= 0) return 0;
  for (; t < tmax; t += 0.01) if (g(t + 0.01) >= 0) break;
  return biseccion(g, t, t + 0.01);
}
// Recta por dos puntos (Lagrange), evaluada en t.
const recta = ([t1, x1], [t2, x2]) => t => x1 * (t - t2) / (t1 - t2) + x2 * (t - t1) / (t2 - t1);
// Paso a paso: un móvil que avanza v durante n segundos enteros.
const avanza = (x, vv, n) => { for (let i = 0; i < n; i++) x += vv; return x; };
const fmt = x => { const r = Math.round(x * 100) / 100, a = Math.abs(r); const t = String(a).replace('.', ','); return (r < 0 ? '−' : '') + t; };

function recalcular(p) {
  const d = p._datos;
  switch (d.tipo) {
    case 'donde': case 'ecuacion': return avanza(d.x0, d.v, d.t);
    case 'cuando': return cuandoCruza(t => d.x0 + d.v * t - d.X);
    case 'combi-kmh': return d.x0 + (d.kmh * 1000 / 3600) * d.t;
    case 'trueno': return avanza(0, 340, d.t);
    case 'eco': {
      if (d.sub === 'dos-ecos') { const lado = tt => biseccion(D => 2 * D / 340 - tt, 0, 1e5); return lado(d.t1) + lado(d.t2); }
      // La combi parte a D del cerro: el sonido llega al cerro en D/340; vuelve y se encuentra con la combi.
      const eco = D => { const ta = D / 340, resto = D - d.v * ta; return ta + resto / (340 + d.v); };
      return biseccion(D => eco(D) - d.T, 0, 1e5);
    }
    case 'ida-vuelta': return avanza(avanza(0, d.v1, d.t1), -d.v2, d.t2);
    case 'pendiente': { const r = recta([d.t1, d.x1], [d.t2, d.x2]); return r(1) - r(0); }
    case 'inicio': return recta([d.t1, d.x1], [d.t2, d.x2])(0);
    case 'extrapolar': { const r = recta([0, d.x0], [d.t1, d.x1]); return d.sub === 'donde' ? r(d.T) : r(d.T) - r(0); }
    case 'dos-rectas': {
      const vc = recta([0, 0], [d.T, d.a]), vm = recta([0, d.Dd], [d.T, d.b]);
      return `Combi: ${fmt(vc(1) - vc(0))} m/s; mototaxi: ${fmt(vm(1) - vm(0))} m/s`;
    }
    case 'ecuacion-recta': {
      const r = recta([0, d.x0], [d.t1, d.x1]), vv = r(1) - r(0), a = Math.abs(vv);
      return `x = ${fmt(r(0))} ${vv < 0 ? '−' : '+'} ${a === 1 ? '' : fmt(a)}t`;
    }
    case 'grafica-kmh': return d.sub === 'kmh' ? d.X / d.T * 3600 / 1000 : d.k * 1000 / (d.n * 60);
    case 'valla': return d.sub === 'rapidez' ? (d.L + d.L2) / (d.t1 + d.t2) : (d.L - d.L2) / (d.t1 + d.t2);
    case 'tramos-tiempo': return avanza(avanza(0, d.v1, d.t1), d.v2, d.t2) / (d.t1 + d.t2);
    case 'tramos-distancia': return (d.d1 + d.d2) / (d.d1 / d.v1 + d.d2 / d.v2);
    case 'parada': return (d.d1 + d.d2) / ((d.m1 + d.p + d.m2) / 60);
    case 'tabla': {
      let camino = 0; for (let i = 1; i < 5; i++) camino += Math.abs(d.xs[i] - d.xs[i - 1]);
      return (d.sub === 'rapidez' ? camino : d.xs[4] - d.xs[0]) / (4 * d.dt);
    }
    case 'mitades': { const tau = biseccion(s => (d.v2 + d.v3) * s - 1, 0, 10); return 2 / (1 / d.v1 + 2 * tau); }
    case 'cerro': return 2 * d.L / (d.L / d.v1 + d.L / d.v2);
    case 'frente': return cuandoCruza(t => d.v1 * t - (d.D - d.v2 * t));
    case 'alcance': return cuandoCruza(t => d.v1 * t - (d.D + d.v2 * t));
    case 'donde-cruzan': return d.v1 * cuandoCruza(t => d.v1 * t - (d.D - d.v2 * t));
    case 'alcance-kmh': return cuandoCruza(t => d.k1 / 3.6 * t - (d.D + d.k2 / 3.6 * t));
    case 'salio-antes': return cuandoCruza(t => d.v1 * t - d.v2 * (t + d.dt));
    case 'trenes': {
      // Frente de 1 en 0 hacia +; el tren 2 con su frente en 0 (de frente) o su cola en 0 (mismo lado).
      if (d.sub === 'frente') return cuandoCruza(t => (-d.L1 + d.v1 * t) - (d.L2 - d.v2 * t));
      return cuandoCruza(t => (-d.L1 + d.v1 * t) - (d.L2 + d.v2 * t));
    }
    case 'dos-veces': {
      const sep = t => Math.abs((d.D - d.v2 * t) - d.v1 * t), tc = d.D / (d.v1 + d.v2);
      return biseccion(t => sep(t) - d.s, tc, tc + 1e4);
    }
    case 'carril': return d.vB - d.vA;
    case 'frente-kmh': return (-d.kB * 1000 / 3600) - (d.kA * 1000 / 3600);
    // Río abajo: lo que rema respecto al agua, a partir de lo que se ve desde la orilla; río arriba, lo que se ve.
    case 'rio': return d.sub === 'abajo' ? biseccion(u => u + d.c - (d.u + d.c), 0, 100) : Math.abs(-d.u + d.c);
    case 'tramo-rio': return cuandoCruza(t => (d.u - d.c) * t - d.L);
    case 'ventaja-kmh': return cuandoCruza(t => (d.kB - d.kA) / 3.6 * t - d.s);
    case 'dos-viajes': { const a = d.u + d.c, b = d.u - d.c; return d.sub === 'corriente' ? biseccion(c => (a - c) - (b + c), 0, 100) : biseccion(u => (a - u) - (u - b), 0, 100); }
    case 'ida-vuelta-rio': {
      // En el marco de tierra: sube contra la corriente (o la columna) y vuelve.
      if (d.sub === 'bote') return cuandoCruza(t => (d.u - d.c) * t - d.L) + cuandoCruza(t => (d.u + d.c) * t - d.L);
      const ida = cuandoCruza(t => d.u * t - (d.L + d.c * t)), cab = d.u * ida;
      return ida + cuandoCruza(t => (cab - d.L + d.c * t) - (cab - d.u * t));
    }
    case 'placas': { const vb = d.sub === 'frente' ? -d.b : d.b; return Math.abs((d.a - vb) * d.N) / 100; }
    case 'adelanto': return cuandoCruza(t => (-d.L1 + d.v1 * t) - (d.L2 + d.v2 * t));
    default: throw new Error(`tipo sin recálculo: ${d.tipo}`);
  }
}
const cerca = (a, b) => Math.abs(a - b) < 1e-6 * Math.max(1, Math.abs(a));
const igual = (esperado, valor) => (typeof esperado === 'string' ? esperado === valor : cerca(esperado, valor));
probarGenerador(gen, { semillas: 600, recalcular, igual });
probarFugas(gen, { grupo: p => [p._datos.tipo, p._datos.sub || ''].join('/') });

for (const c of casos.casos) {
  test(`casos.json: semilla ${c.semilla} (${c.entrada.tipo})`, () => {
    const p = gen.generar(c.semilla);
    assert.deepEqual(p._datos, c.entrada, 'el generador cambió: recalcula casos.json');
    if (typeof c.esperado.respuesta === 'number') assert.ok(cerca(p.respuesta.valor, c.esperado.respuesta), `da ${p.respuesta.valor}`);
    else assert.equal(p.respuesta.valor, c.esperado.respuesta);
    assert.equal(p.alternativas.find(a => a.correcta).texto, c.esperado.texto);
  });
}
test('casos.json: de 15 a 20 casos, de las cinco ideas y los tres niveles', () => {
  assert.ok(casos.casos.length >= 15 && casos.casos.length <= 20);
  assert.deepEqual([...new Set(casos.casos.map(c => c.entrada.idea))].sort(), [...Object.keys(gen.TIPOS_POR_IDEA)].sort());
  assert.deepEqual([...new Set(casos.casos.map(c => c.entrada.nivel))].sort(), [1, 2, 3]);
});

const IDEAS = T.ideas.map(i => i.id);
test('tipos por idea: las cinco ideas de la teoría, y generar(semilla, { idea }) da solo los suyos, con los tres niveles', () => {
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

const VARIANTES = ['donde/derecha', 'donde/paradero', 'cuando', 'combi-kmh', 'ecuacion/baja', 'ecuacion/sube', 'trueno', 'eco/dos-ecos', 'eco/bocina', 'ida-vuelta',
  'pendiente/sube', 'pendiente/baja', 'inicio', 'extrapolar/donde', 'extrapolar/distancia', 'dos-rectas', 'ecuacion-recta', 'grafica-kmh/kmh', 'grafica-kmh/min',
  'valla/rapidez', 'valla/velocidad', 'tramos-tiempo', 'tramos-distancia', 'parada/sigue', 'parada/regresa', 'tabla/rapidez', 'tabla/velocidad', 'mitades', 'cerro',
  'frente', 'alcance', 'donde-cruzan', 'alcance-kmh', 'salio-antes', 'trenes/frente', 'trenes/mismo', 'dos-veces',
  'carril', 'frente-kmh', 'rio/abajo', 'rio/arriba', 'tramo-rio', 'ventaja-kmh', 'dos-viajes/corriente', 'dos-viajes/bote',
  'ida-vuelta-rio/bote', 'ida-vuelta-rio/columna', 'placas/frente', 'placas/mismo', 'adelanto'];
// Los de la unidad (cabecera de la teoría y sección «MRU (18 nov)» del informe) y los nuevos de esta práctica (sección
// «Práctica de MRU (fis-mru, 18 nov)» del informe).
const INFORME = fs.readFileSync(path.join(__dirname, '..', '..', 'docs/investigacion/cinematica-ideas-erroneas.md'), 'utf8');
const NUEVOS = ['MRU-ECO-MITAD', 'MRU-ECO-DOBLE', 'MRU-ECO-SIN-MITAD', 'MRU-ECO-UNO', 'MRU-ECO-RESTA', 'MRU-ECO-QUIETO', 'MRU-ECO-ESCUCHA', 'MRU-ECO-MEDIO',
  'MRU-IDA', 'MRU-RESTA-V', 'XT-PRIMER-PUNTO', 'XT-POSICION', 'XT-CAMBIA', 'DX-VUELTA-ENTERA', 'DX-SUMA-POSICIONES', 'MED-SIN-PARADA', 'VR-PROMEDIO',
  'ENC-OTRO', 'ENC-MITAD', 'ENC-UN-LARGO', 'ENC-PRIMERA', 'ENC-CRUCE', 'ENC-SOLO-S', 'REL-SIN-MITAD', 'REL-CRUZA', 'REL-UN-LARGO'];
const DE_LA_UNIDAD = ['MRU-X0', 'MRU-SIGNO', 'MRU-CONTEO', 'MRU-SUMA', 'MRU-ECUACION', 'U1-kmh', 'U1-inversa',
  'G2-altura-entre-tiempo', 'G2-ultimo-punto', 'G2-pendiente-es-altura', 'XT-SIN-DIVIDIR', 'XT-SIGNO', 'XT-INVERSA', 'XT-LEIDO',
  'DX-RAPIDEZ', 'DX-DISTANCIA', 'DX-IDA', 'MED-PROMEDIO', 'MED-SUMA', 'MED-UN-TIEMPO', 'MED-CRUZADO', 'MED-TRAMO', 'MED-PROMEDIO-MITADES',
  'VR-SUMA', 'VR-RESTA', 'VR-UNO', 'VR-RELOJ', 'VR-VENTAJA', 'REL-SENTIDO', 'REL-SIN-MARCO', 'REL-PITAGORAS', 'REL-SUMA', 'REL-SIGNO', 'REL-SOLO-A',
  'REL-SOLO-RIO', 'REL-IDA'];
const TRANSVERSALES = ['U6-min', 'U2-km', 'U2-cm'];
test('salen todas las variantes y los errores', () => {
  const tipos = new Set(), ids = new Set();
  for (let s = 0; s < 6000; s++) {
    const p = gen.generar(s), d = p._datos;
    tipos.add(d.tipo + (d.sub ? '/' + d.sub : ''));
    for (const a of p.alternativas) if (a.error) ids.add(a.error.id);
  }
  for (const t of VARIANTES) assert.ok(tipos.has(t), `no sale ${t}`);
  assert.deepEqual([...tipos].filter(t => !VARIANTES.includes(t)), []);
  for (const id of [...DE_LA_UNIDAD, ...NUEVOS, ...TRANSVERSALES]) assert.ok(ids.has(id), `no sale ${id}`);
});

test('cada error usa un código de la unidad, del informe o del informe transversal, con su respaldo', () => {
  const cabecera = fs.readFileSync(TEORIA, 'utf8').split('*/')[0];
  for (const id of DE_LA_UNIDAD.filter(x => /^MRU-|^U1/.test(x))) assert.ok(cabecera.includes(id), `${id} no está en la cabecera de la unidad`);
  for (const id of [...DE_LA_UNIDAD.filter(x => !/^MRU-|^U1/.test(x)), ...NUEVOS]) assert.ok(INFORME.includes(`| ${id} |`) || INFORME.includes(`| ${id} /`) || INFORME.includes(`/ ${id} |`), `${id} no está en el informe`);
  for (let s = 0; s < 1500; s++) for (const a of gen.generar(s).alternativas.filter(x => x.error)) {
    const id = a.error.id;
    assert.ok([...DE_LA_UNIDAD, ...NUEVOS, ...TRANSVERSALES, 'K1'].includes(id), `semilla ${s}: ${id} no es un código conocido`);
    const esperado = ['G2-altura-entre-tiempo', 'G2-pendiente-es-altura'].includes(id) ? 'documentado' : id === 'K1' ? 'parcial' : 'hipotesis';
    assert.equal(a.error.respaldo, esperado, `semilla ${s}: ${id} con respaldo ${a.error.respaldo}`);
    const fuente = /^U\d/.test(id) ? 'docs/investigacion/fisica-calculo-transversal-ideas-erroneas.md'
      : /^MRU-(X0|SIGNO|CONTEO|SUMA|ECUACION)$/.test(id) ? 'contenido/teoria/fisica/movimiento-rectilineo.js' : 'docs/investigacion/cinematica-ideas-erroneas.md';
    assert.equal(a.error.fuente, fuente, `semilla ${s}: ${id}`);
  }
});

// Redacción delegada (26 nov 2026): las explicaciones dejaron de empezar todas con «Bien» (telegrama «Bien X. Pero Y»);
// ahora dicen en una oración completa qué estuvo bien y qué faltó, así que esta prueba ya no exige ese arranque.
test('cada explicación muestra lo que da su error y no nombra una letra', () => {
  for (let s = 0; s < 1500; s++) {
    const p = gen.generar(s);
    for (const a of p.alternativas.filter(x => x.error)) {
      const e = a.error.explicacion;
      assert.ok(e.includes(a.texto), `semilla ${s}: «${e}» no muestra ${a.texto}`);
      assert.ok(!/\b(alternativa|opción|letra) [A-E]\b|\([A-E]\)|\bla [A-E]\b/.test(e), `semilla ${s}: nombra una letra: ${e}`);
      assert.ok(e.split(/\s+/).length <= 40, `semilla ${s}: explicación larga (${e.split(/\s+/).length} palabras): ${e}`);
    }
  }
});

// Un color fijo por magnitud, el de la unidad (tabla `colores` de movimiento-rectilineo.js): velocidad naranja, tiempo
// turquesa, posición, desplazamiento, separación y largo violeta. Sin carmín (no hay aceleración) ni verde. Lo que se
// pide va en palabras, sin color, y la respuesta de la solución lleva el color de su magnitud.
test('un color por magnitud, el de la unidad; la respuesta con el color de su magnitud en la solución', () => {
  const plano = x => (Array.isArray(x) ? x.map(plano).join('') : x && typeof x === 'object' ? x.t : String(x));
  for (let s = 0; s < 1000; s++) {
    const p = gen.generar(s), V = p.variables, usadas = new Set();
    for (const [k, x] of Object.entries(V)) {
      assert.ok(x.nombre in T.colores, `semilla ${s}: ${k} («${x.nombre}») no es una magnitud de la unidad`);
      assert.equal(x.color, T.colores[x.nombre], `semilla ${s}: ${x.nombre} en ${x.color}`);
      assert.ok(!['h', 'd'].includes(x.color), `semilla ${s}: carmín o verde`);
    }
    for (const linea of [p.enunciado, p.pregunta, ...p.solucion]) for (const x of linea) {
      if (x && typeof x === 'object') { assert.ok(V[x.v], `semilla ${s}: «${x.t}» usa ${x.v}, que no está`); assert.ok(x.t !== '', `semilla ${s}: tramo vacío`); usadas.add(x.v); }
      else assert.equal(typeof x, 'string', `semilla ${s}: tramo inválido`);
    }
    assert.deepEqual([...usadas].sort(), Object.keys(V).sort(), `semilla ${s}: variable sin usar`);
    // La respuesta, con el color de su magnitud, en la última línea de la solución (salvo la distancia recorrida, en tinta).
    const c = p.alternativas.find(a => a.correcta).texto, ult = p.solucion[p.solucion.length - 1], cs = c.replace(/^x = (?=[−\d])/, '');
    if (p._datos.tipo === 'dos-rectas') { for (const [, n] of c.matchAll(/(−?\d+) m\/s/g)) assert.ok(plano(p.solucion).includes(`${n} m/s`), `semilla ${s}`); continue; }
    // La distancia recorrida va en tinta: sin ficha (extrapolar, distancia).
    if (p._datos.tipo === 'extrapolar' && p._datos.sub === 'distancia') { assert.ok(plano(ult).includes(c), `semilla ${s}`); continue; }
    const ficha = ult.find(x => x && typeof x === 'object' && x.t.includes(cs));
    assert.ok(ficha, `semilla ${s}: la última línea de la solución no trae la respuesta ${c} con su color: ${plano(ult)}`);
    assert.ok(!/= x = /.test(plano(p.solucion)), `semilla ${s}: «= x =» en la solución`);
    if (/m\/s|km\/h/.test(c) && !/^Combi/.test(c)) assert.equal(V[ficha.v].nombre, 'velocidad', `semilla ${s}: ${c} sin naranja`);
    if (/ s$/.test(c)) assert.equal(V[ficha.v].nombre, 'tiempo', `semilla ${s}: ${c} sin turquesa`);
    if (/^x = /.test(c)) assert.equal(V[ficha.v].color, 'f', `semilla ${s}: ${c} sin violeta`);
    // Nunca la velocidad ni el tiempo con el color de otra magnitud: un número con m/s va en naranja, uno con s en turquesa.
    for (const linea of [p.enunciado, p.pregunta]) for (const x of linea) if (x && typeof x === 'object') {
      if (/m\/s$|km\/h$|cm por año$/.test(x.t)) assert.equal(V[x.v].nombre, 'velocidad', `semilla ${s}: «${x.t}» en ${V[x.v].nombre}`);
      if (/\d (s|min|años)$/.test(x.t)) assert.equal(V[x.v].nombre, 'tiempo', `semilla ${s}: «${x.t}» en ${V[x.v].nombre}`);
    }
    if (p.figura) assert.ok(!/--c-(h|d|o)\b/.test(p.figura.svg), `semilla ${s}: la figura usa carmín, verde o naranja`);
  }
});

test('notación: sin flechas de vector, signo menos tipográfico, coma decimal, sin «*», «^» ni «_»; móviles con palabras', () => {
  const plano = x => (Array.isArray(x) ? x.map(plano).join('') : x && typeof x === 'object' ? x.t : String(x));
  for (let s = 0; s < 1500; s++) {
    const p = gen.generar(s);
    const visto = [p.enunciado, p.pregunta, ...p.solucion].map(plano).concat(p.datos, p.alternativas.map(a => a.texto), p.alternativas.filter(a => a.error).map(a => a.error.explicacion)).join(' ');
    assert.ok(!/⃗|[*^_]|\d\.\d|\s-\d|\(-/.test(visto), `semilla ${s}: ${visto}`);
    assert.ok(!/(?<!\p{L})[Dd]e el(?!\p{L})|(?<!\p{L})[Aa] el(?!\p{L})/u.test(visto), `semilla ${s}: «de el» o «a el»`);
    // A y B solo nombran placas tectónicas (como en el examen); los móviles van con su nombre.
    if (p._datos.tipo !== 'placas') assert.ok(!/\b(móvil|combi|mototaxi) [AB]\b|\b[AB] (va|sale)\b/.test(visto), `semilla ${s}: un móvil con letra`);
  }
});

// Recuadro «Datos» (docs/plan-calidad.md §3, punto 13): líneas cortas en texto plano, sin la respuesta, con la
// herramienta de cada tipo; sin atajos («se suman», «se restan») ni consejos.
test('datos: una lista de líneas cortas, sin la respuesta, sin atajos y con la fórmula de cada tipo, en 400 semillas', () => {
  const palabras = t => t.split(/\s+/).filter(w => /\p{L}/u.test(w)).length;
  const POS = /x = x₀ \+ v · t/, XT = /v = \(x₂ − x₁\)\/\(t₂ − t₁\)/, RM = /Rapidez media = d\/Δt/, VM = /vₘ = Δx\/Δt/, REL = /la suya menos la del que mira/, ORI = /Velocidad desde la orilla =/;
  const FORMULA = {
    donde: POS, cuando: POS, 'combi-kmh': POS, ecuacion: POS, trueno: /rapidez · tiempo/, eco: /rapidez · tiempo/, 'ida-vuelta': POS,
    pendiente: XT, inicio: XT, extrapolar: XT, 'dos-rectas': XT, 'ecuacion-recta': XT, 'grafica-kmh': XT,
    valla: RM, 'tramos-tiempo': RM, 'tramos-distancia': RM, parada: RM, tabla: RM, mitades: RM, cerro: RM,
    frente: POS, alcance: POS, 'donde-cruzan': POS, 'alcance-kmh': POS, 'salio-antes': POS, trenes: POS, 'dos-veces': POS,
    carril: REL, 'frente-kmh': REL, rio: ORI, 'tramo-rio': ORI, 'ventaja-kmh': REL, 'dos-viajes': ORI, 'ida-vuelta-rio': /la suya menos la del que mira|Velocidad desde la orilla =/, placas: REL, adelanto: REL,
  };
  for (const idea of [undefined, ...IDEAS]) for (let s = 0; s < 400; s++) {
    const p = gen.generar(`d${s}`, idea ? { idea } : {}), d = p._datos;
    assert.ok(Array.isArray(p.datos) && p.datos.length, `semilla ${s}: datos debe ser una lista no vacía`);
    for (const l of p.datos) {
      assert.ok(typeof l === 'string' && l.trim() === l && l.length, `semilla ${s}: línea vacía o con espacios`);
      assert.ok(palabras(l) <= 22, `semilla ${s}: «${l}» tiene ${palabras(l)} palabras`);
      assert.ok(!/<[a-z/]|\bnull\b|\bNaN\b|\bundefined\b|^Dato:|_/i.test(l), `semilla ${s}: «${l}»`);
      assert.ok(!/se suman|se restan|recuerda|conviene|truco|atajo/i.test(l), `semilla ${s}: atajo o consejo: «${l}»`);
    }
    assert.equal(new Set(p.datos).size, p.datos.length, `semilla ${s}: líneas repetidas`);
    const todo = p.datos.join('\n');
    assert.match(todo, FORMULA[d.tipo], `semilla ${s} (${d.tipo}): falta su fórmula`);
    if (/^(eco|trueno)$/.test(d.tipo)) assert.match(todo, /unos 340 m\/s/);
    if (/kmh/.test(d.tipo)) assert.match(todo, /1 km = 1000 m y 1 h = 3600 s/);
    if (['donde', 'ecuacion', 'ida-vuelta', 'frente', 'donde-cruzan'].includes(d.tipo)) assert.match(todo, /\+ hacia la derecha/);
    // La respuesta no está en los datos: ni su texto ni, si tiene dos cifras o más, ese número.
    const c = p.alternativas.find(a => a.correcta).texto;
    assert.ok(!todo.includes(c), `semilla ${s}: los datos traen la respuesta ${c}`);
    for (const [n] of c.replace(/ /g, '').matchAll(/\d{2,}/g)) assert.ok(!new RegExp(`(?<![\\d,])${n}(?![\\d,])`).test(todo), `semilla ${s}: los datos traen ${n} (${c})`);
  }
});

test('la figura x–t de la pendiente: SVG propio, todo dentro del lienzo y los rótulos sin pisarse', () => {
  let n = 0;
  for (let s = 0; s < 400; s++) {
    const p = gen.generar(`f${s}`, { idea: 'grafica-xt' });
    if (p._datos.tipo !== 'pendiente') { assert.equal(p.figura, undefined); continue; }
    n++;
    const svg = p.figura.svg, [, W, H] = svg.match(/viewBox="0 0 (\d+) (\d+)"/).map(Number);
    const num = (t, k) => Number(t.match(new RegExp(` ${k}="(-?[\\d.]+)"`))[1]);
    for (const l of svg.match(/<line [^>]*>/g)) for (const [a, b] of [['x1', 'y1'], ['x2', 'y2']]) {
      assert.ok(num(l, a) >= 4 && num(l, a) <= W - 4 && num(l, b) >= 4 && num(l, b) <= H - 4, `semilla ${s}: línea fuera del lienzo`);
    }
    const cajas = [...svg.matchAll(/<text x="([\d.]+)" y="([\d.]+)" text-anchor="(\w+)"[^>]*>([^<]*)</g)].map(([, x, y, ancla, t]) => {
      const w = 7.5 * t.length, X = Number(x), Y = Number(y);
      const x0 = ancla === 'end' ? X - w : ancla === 'middle' ? X - w / 2 : X;
      return { t, x0, x1: x0 + w, y0: Y - 11, y1: Y + 3 };
    });
    for (const c of cajas) assert.ok(c.x0 >= 4 && c.x1 <= W - 4 && c.y0 >= 4 && c.y1 <= H - 4, `semilla ${s}: «${c.t}» fuera del lienzo`);
    for (let i = 0; i < cajas.length; i++) for (let j = i + 1; j < cajas.length; j++) {
      const a = cajas[i], b = cajas[j];
      assert.ok(a.x1 <= b.x0 || b.x1 <= a.x0 || a.y1 <= b.y0 || b.y1 <= a.y0, `semilla ${s}: «${a.t}» pisa a «${b.t}»`);
    }
    // Lo que dice el enunciado está en la figura: los dos tiempos y las dos posiciones.
    const d = p._datos;
    for (const t of [d.t1, d.t2, d.x1, d.x2].map(String)) assert.ok(cajas.some(c => c.t === t), `semilla ${s}: falta el rótulo ${t}`);
    assert.match(p.figura.alt, /Gráfica x–t/);
  }
  assert.ok(n > 30, `solo ${n} figuras`);
});

test('nunca se queda sin cuatro alternativas (semillas 0 a 2000, de texto y por idea)', () => {
  for (let s = 0; s <= 2000; s++) gen.generar(s);
  for (const s of ['entrada-1', 'entrada-2', 'entrada-3', 'salida-1', 'salida-2', 'salida-3', 'papel-1', 'examen-x'])
    for (const idea of [undefined, ...IDEAS]) gen.generar(s, { unidad: UNIDAD, idea });
});

test('papel.json: 8 problemas de las cinco ideas, con sus datos, sin figura y con su respuesta recalculada', () => {
  assert.equal(papel.problemas.length, 8);
  const ideas = new Set(), niveles = new Set();
  papel.problemas.forEach((pr, i) => {
    const p = gen.generar(`papel-${i + 1}`);
    assert.equal(p.figura, undefined, pr.id);
    ideas.add(p._datos.idea); niveles.add(p._datos.nivel);
    assert.ok(pr.enunciado.includes('Datos:'), pr.id);
    assert.ok(pr.respuesta.endsWith(p.alternativas.find(a => a.correcta).texto), pr.id);
    assert.ok(igual(recalcular(p), p.respuesta.valor), pr.id);
  });
  assert.deepEqual([...ideas].sort(), [...IDEAS].sort());
  assert.deepEqual([...niveles].sort(), [1, 2, 3]);
});

test('la unidad lista esta plantilla primero, la ficha es solo suya y el repaso la usa entera', () => {
  const raiz = path.join(__dirname, '..', '..');
  const cat = JSON.parse(fs.readFileSync(path.join(raiz, 'catalogo', 'cursos', 'fisica.json'), 'utf8'));
  assert.equal(cat.unidades.find(u => u.id === UNIDAD).plantillas[0], 'fis-mru');
  const ficha = JSON.parse(fs.readFileSync(path.join(__dirname, 'plantilla.json'), 'utf8'));
  assert.deepEqual(ficha.unidades, [UNIDAD]);
  const RT = require('../../nucleo/repaso-tipos.js');
  assert.ok(RT.cubre(ficha, UNIDAD));
  for (let s = 0; s < 50; s++) assert.equal(RT.unidadDe(ficha, gen.generar(`r${s}`)), UNIDAD, `semilla ${s}`);
});

// La práctica no repite las predicciones de la teoría (Ejercicios se abre sin pasar por Predice).
test('la práctica no repite las predicciones de la unidad', () => {
  const plano = x => (Array.isArray(x) ? x.map(plano).join('') : x && typeof x === 'object' ? (x.t !== undefined ? String(x.t) : x.sub ? x.sub.map(plano).join('') : '') : String(x));
  const pred = T.ideas.map(i => plano(i.predice.pregunta));
  assert.match(pred[0], /x = 80 m.*12 m\/s.*5 s/); assert.match(pred[1], /\(2 s; 26 m\) y \(5 s; 38 m\)/); assert.match(pred[2], /60 m.*2 m\/s.*6 m\/s/);
  assert.match(pred[3], /60 m delante.*6 m\/s.*10 m\/s/); assert.match(pred[4], /5 m\/s.*2 m\/s/);
  const ve = d => (d.tipo === 'donde' && d.x0 === 80 && d.v === -12 && d.t === 5) || (d.tipo === 'pendiente' && d.t1 === 2 && d.x1 === 26 && d.t2 === 5)
    || (d.tipo === 'valla' && d.L === 60 && d.L2 === 60) || (d.tipo === 'alcance' && d.D === 60 && d.v2 === 6 && d.v1 === 10)
    || (d.tipo === 'rio' && d.sub === 'abajo' && d.u === 5 && d.c === 2);
  for (const idea of [undefined, ...IDEAS]) for (let s = 0; s < 400; s++) {
    const p = gen.generar(`p${s}`, idea ? { idea } : {});
    assert.ok(!ve(p._datos), `${idea} semilla ${s}: ${JSON.stringify(p._datos)}`);
    const t = [p.enunciado, p.pregunta].map(plano).join(' ');
    assert.ok(!/\(2 s; 26 m\) y por \(5 s; 38 m\)|x₀ = 80 m y va hacia el paradero a 12 m\/s/.test(t), `${idea} semilla ${s}: ${t}`);
  }
});

// Valores posibles (contrato, punto 10): combis y mototaxis a rapideces de ciudad, ríos de 3 m/s o menos.
test('medidas posibles: vehículos, botes, corrientes y combis en km/h', () => {
  for (let s = 0; s < 1500; s++) {
    const d = gen.generar(s)._datos;
    if (d.tipo === 'rio' || d.tipo === 'tramo-rio' || d.tipo === 'dos-viajes' || (d.tipo === 'ida-vuelta-rio' && d.sub === 'bote')) assert.ok(d.c <= 3 && d.u <= 6 && d.c < d.u, JSON.stringify(d));
    if (d.tipo === 'combi-kmh') assert.ok(d.kmh >= 36 && d.kmh <= 90, JSON.stringify(d));
    if (d.tipo === 'parada') for (const [km, mi] of [[d.d1, d.m1], [d.d2, d.m2]]) assert.ok(km / (mi / 60) <= 72, JSON.stringify(d));
    if (d.tipo === 'frente' || d.tipo === 'alcance' || d.tipo === 'donde-cruzan' || d.tipo === 'salio-antes') assert.ok(d.v1 <= 15 && d.v2 <= 9, JSON.stringify(d));
  }
});

// Auditoría de MRU (18 nov, M1 y B1): ninguna rapidez del enunciado pasa el tope de su sujeto (la tabla común de topes.js,
// la misma que leen la teoría y los tipos de MRU de cinematica-medias y velocidad-relativa), en 400 semillas por idea.
test('medidas posibles por sujeto: ciclista, combi, columna, pastor, bote… con la tabla de topes.js (400 semillas por idea)', () => {
  const Topes = require('./topes.js');
  const plano = x => (Array.isArray(x) ? x.map(plano).join('') : x && typeof x === 'object' ? (x.t !== undefined ? String(x.t) : x.sub ? x.sub.map(plano).join('') : '') : String(x));
  const malas = [];
  for (const idea of IDEAS) for (let s = 0; s < 400; s++) {
    const p = gen.generar(`t${s}`, { idea }), t = [p.enunciado, p.pregunta].map(plano).join(' ');
    for (const m of Topes.revisar(t)) malas.push(`${idea} ${s}: ${m.sujeto} a ${m.texto} — ${t}`);
    const d = p._datos;
    if (d.tipo === 'mitades') assert.ok(Math.max(d.v1, d.v2, d.v3) <= 12, JSON.stringify(d));
    if (d.tipo === 'ida-vuelta-rio' && d.sub === 'columna') assert.ok(d.u <= 3 && d.c <= 1.5 && /corre/.test(t), JSON.stringify(d));
  }
  assert.deepEqual(malas.slice(0, 5), []);
});

// Cabos de la Etapa 4 (19 nov): una letra, un significado. En la idea 5, u es la velocidad del bote respecto al agua y c
// la de la corriente, las dos con signo, como en la regla de la teoría (v = u + c). Los dos viajes se plantean u + c y
// −u + c; antes la solución escribía «u − c», con u de rapidez.
test('velocidad relativa: u y c son velocidades con signo; ninguna solución escribe «u − c» y quien usa u la define en sus datos', () => {
  const tx = x => (Array.isArray(x) ? x.map(tx).join('') : x && typeof x === 'object' ? String(x.t ?? '') : String(x ?? ''));
  const f = n => String(Math.round(n * 100) / 100).replace('.', ',').replace('-', '−');
  const DEF = 'u: velocidad del bote respecto al agua, río abajo; río arriba, remando igual, es −u. c: velocidad de la corriente.';
  let dos = 0;
  for (let s = 0; s < 400; s++) {
    const p = gen.generar(`uc${s}`, { idea: 'velocidad-relativa' }), d = p._datos;
    const sol = p.solucion.map(tx).join(' '), todo = [tx(p.enunciado), tx(p.pregunta), sol, ...p.datos, ...p.alternativas.map(a => a.explicacion || '')].join(' ');
    assert.ok(!/\bu [−-] c\b|\bu ± c\b/.test(todo), `semilla ${s} (${d.tipo}): u como rapidez: «${sol}»`);
    assert.ok(!/\b[uc]: (la )?rapidez/.test(todo), `semilla ${s}: define la letra como rapidez`);
    if (d.tipo === 'dos-viajes') {
      dos++;
      assert.ok(p.datos.includes(DEF), `semilla ${s}: los dos viajes usan u y c sin definirlas`);
      const a = d.u + d.c, b = d.u - d.c;
      assert.ok(sol.includes(`u + c = ${f(a)}. Río arriba, hacia el lado −: −u + c = ${f(-b)}.`), `semilla ${s}: «${sol}»`);
      // Cuenta aparte: de u + c = a y −u + c = −b salen c = (a − b)/2 y u = (a + b)/2.
      assert.ok(igual((a + -b) / 2, d.c) && igual((a - -b) / 2, d.u));
    }
    if (/(^|[^\p{L}])u = /u.test(sol) && d.tipo !== 'dos-viajes') assert.match(sol, /con u la velocidad del bote respecto al agua/, `semilla ${s} (${d.tipo})`);
  }
  assert.ok(dos >= 20, 'salen los dos viajes');
});

// Verificación de la pasada de redacción (26 nov 2026): en estas explicaciones, «…, pero el tiempo es el de los dos
// tramos, 50 s; así salen 13,5 m/s» se leía como si la cuenta correcta diera el valor equivocado. El valor del error va
// con lo que hizo el alumno («dividirlo solo entre … da …»). Y «desde ahí la ves» decía que desde la pista se ve la
// velocidad relativa: se ve desde tu combi.
const comoLeida = g => {
  const out = [];
  for (let s = 0; s < 600; s++) {
    const p = g.generar(s);
    for (const a of p.alternativas) if (a.error && ['XT-SIN-DIVIDIR', 'MED-UN-TIEMPO', 'VR-UNO', 'REL-SIN-MARCO', 'REL-SOLO-A'].includes(a.error.id)) out.push([s, a]);
  }
  return out;
};
test('redacción: el valor del error va con lo que hizo el alumno, no tras la cuenta correcta', () => {
  const vistas = comoLeida(gen);
  assert.ok(vistas.length > 100);
  for (const [s, a] of vistas) {
    assert.doesNotMatch(a.error.explicacion, /; (así salen|con eso queda) [^;]+\.$/, `semilla ${s} ${a.error.id}: ${a.error.explicacion}`);
    assert.doesNotMatch(a.error.explicacion, /desde ahí la ves/, `semilla ${s}: ${a.error.explicacion}`);
    assert.ok(a.error.explicacion.includes(a.texto), `semilla ${s}: no muestra ${a.texto}`);
  }
});
