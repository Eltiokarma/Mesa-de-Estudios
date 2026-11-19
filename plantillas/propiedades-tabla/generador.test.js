// Pruebas de «Radio, ionización y electronegatividad en la tabla» (propiedades-tabla): casos.json (calculados aparte,
// con un script que no usa el generador), y en 400 semillas un recálculo independiente de la respuesta a partir de
// _datos, con tablas escritas aquí de nuevo (no las del generador).
const test = require('node:test');
const assert = require('node:assert/strict');
const gen = require('./generador.js');
const casos = require('./casos.json');
const { probarGenerador, probarFugas } = require('../../nucleo/probar-generador.js');
const plano = x => (Array.isArray(x) ? x.map(plano).join('') : x && typeof x === 'object' ? String(x.t) : String(x));

// ---------- Camino independiente ----------
const T = {};   // símbolo → [nombre, periodo, grupo, radio, EI, EN]
`H hidrógeno 1 1 53 1312 2.20|Li litio 2 1 167 520 0.98|Be berilio 2 2 112 900 1.57|B boro 2 13 87 801 2.04|C carbono 2 14 67 1086 2.55|N nitrógeno 2 15 56 1402 3.04|O oxígeno 2 16 48 1314 3.44|F flúor 2 17 42 1681 3.98|Na sodio 3 1 190 496 0.93|Mg magnesio 3 2 145 738 1.31|Al aluminio 3 13 118 578 1.61|Si silicio 3 14 111 787 1.90|P fósforo 3 15 98 1012 2.19|S azufre 3 16 88 1000 2.58|Cl cloro 3 17 79 1251 3.16|K potasio 4 1 243 419 0.82|Ca calcio 4 2 194 590 1.00|Zn cinc 4 12 142 906 1.65|Ga galio 4 13 136 579 1.81|Ge germanio 4 14 125 762 2.01|As arsénico 4 15 114 944 2.18|Se selenio 4 16 103 941 2.55|Br bromo 4 17 94 1140 2.96`
  .split('|').forEach(l => { const [s, n, p, g, r, ei, en] = l.split(' '); T[s] = { n, p: +p, g: +g, r: +r, ei: +ei, en: +en }; });
const IONES = { 'Li⁺': [3, 2, 76], 'Na⁺': [11, 10, 102], 'K⁺': [19, 18, 138], 'Rb⁺': [37, 36, 152], 'Be²⁺': [4, 2, 45], 'Mg²⁺': [12, 10, 72], 'Ca²⁺': [20, 18, 100], 'Sr²⁺': [38, 36, 118],
  'Al³⁺': [13, 10, 53.5], 'F⁻': [9, 10, 133], 'Cl⁻': [17, 18, 181], 'Br⁻': [35, 36, 196], 'O²⁻': [8, 10, 140], 'S²⁻': [16, 18, 184], 'Se²⁻': [34, 36, 198] };
const NOMZ = { 3: 'litio', 4: 'berilio', 11: 'sodio', 12: 'magnesio', 13: 'aluminio', 19: 'potasio', 20: 'calcio', 37: 'rubidio', 38: 'estroncio' };
const AE = { H: -73, Li: -60, C: -122, O: -141, F: -328, Na: -53, P: -72, S: -200, Cl: -349, K: -48, Br: -325 };
const SUC = { Li: [520, 7298, 11815], Be: [900, 1757, 14849], B: [801, 2427, 3660, 25026], C: [1086, 2353, 4621, 6223, 37831], Na: [496, 4562, 6910], Mg: [738, 1451, 7733],
  Al: [578, 1817, 2745, 11577], Si: [787, 1577, 3232, 4356, 16091], K: [419, 3052, 4420], Ca: [590, 1145, 4912] };
const ROM = { 1: 'IA', 2: 'IIA', 13: 'IIIA', 14: 'IVA', 15: 'VA', 16: 'VIA', 17: 'VIIA', 18: 'VIIIA' };
const por = (l, k, signo = -1) => l.slice().sort((a, b) => signo * (T[a][k] - T[b][k]));
const dos = x => x.toFixed(2).replace('.', ',');
function recalcular(p) {
  const d = p._datos;
  switch (d.tipo) {
    case 'radio-par': return `El de ${T[por([d.a, d.b], 'r')[0]].n}`;
    case 'radio-orden': return por(d.trio, 'r').join(' > ');
    case 'radio-z': { const L = Object.fromEntries(d.trio.map((s, i) => [s, d.letras[i]])); return por(d.trio, 'r').map(s => L[s]).join(' > '); }
    case 'ion-electrones': return String(IONES[d.ion][1]);
    case 'ion-atomo': { const [z, e] = IONES[d.ion]; return e > z ? `El ion ${d.ion}` : `El átomo de ${NOMZ[z]}`; }
    case 'iso-par': return `El ${[d.a, d.b].sort((x, y) => IONES[x][0] - IONES[y][0])[0]}`;
    case 'iso-orden': return d.lista.slice().sort((x, y) => IONES[x][0] - IONES[y][0]).join(' > ');
    case 'ei-par': return `Al ${T[por([d.a, d.b], 'ei')[0]].n}`;
    case 'ei-bajada': return `Al ${T[por([d.a, d.b], 'ei')[0]].n}`;
    case 'afinidad': return `El de ${T[[d.a, d.b].sort((x, y) => AE[x] - AE[y])[0]].n}`;
    case 'sucesivas': { const e = SUC[d.elemento], c = e.slice(1).map((x, i) => x / e[i]), k = c.indexOf(Math.max(...c)) + 1, g = k <= 2 ? k : k + 10; return `Grupo ${g} (${ROM[g]})`; }
    case 'delta-en': return dos(Math.abs(T[d.a].en - T[d.b].en));
    case 'hacia-par': return `Hacia el ${por([d.a, d.b], 'en')[0]}`;
    case 'en-orden': return por(d.trio, 'en').join(' > ');
    case 'metalico': { const [A, B] = [T[d.a], T[d.b]]; return `El ${(A.p === B.p ? A.g < B.g : A.p > B.p) ? A.n : B.n}`; }
    case 'tendencias': return d.sub === 'periodo' ? 'El radio baja y la electronegatividad sube' : 'El radio sube y la energía de ionización baja';
    default: throw new Error(`tipo sin recálculo: ${d.tipo}`);
  }
}
probarGenerador(gen, { semillas: 400, recalcular, igual: (a, b) => a === b });
probarFugas(gen);

test('el átomo es mayor que su catión y menor que su anión (recálculo de ion-atomo con el número de electrones)', () => {
  for (let s = 0; s < 400; s++) {
    const p = gen.generar(s, { idea: 'radio-ionico' }); if (p._datos.tipo !== 'ion-atomo') continue;
    const [z, e] = IONES[p._datos.ion];
    assert.equal(/^El ion/.test(p.respuesta.valor), e > z, `${s}: ${p.respuesta.valor}`);
  }
});

test('por idea: cada idea da solo sus tipos; sin idea salen las cuatro', () => {
  for (const [idea, tipos] of Object.entries(gen.TIPOS_POR_IDEA)) {
    const vistos = new Set();
    for (let s = 0; s < 200; s++) { const p = gen.generar(s, { idea }); assert.equal(p._datos.idea, idea); vistos.add(p._datos.tipo); }
    assert.deepEqual([...vistos].sort(), [...tipos].sort(), idea);
  }
  const ideas = new Set(); for (let s = 0; s < 200; s++) ideas.add(gen.generar(s)._datos.idea);
  assert.equal(ideas.size, 4);
  assert.deepEqual(Object.keys(gen.TIPOS_POR_IDEA), ['radio-atomico-ionico', 'radio-ionico', 'energia-ionizacion', 'electronegatividad']);
});

test('datos: lista de líneas cortas, sin la respuesta y sin consejos (400 semillas)', () => {
  for (let s = 0; s < 400; s++) {
    const p = gen.generar(s), c = p.respuesta.valor;
    assert.ok(Array.isArray(p.datos) && p.datos.length >= 1, `${s}: sin datos`);
    for (const l of p.datos) {
      assert.ok(l.split(/\s+/).length <= 22, `${s}: dato largo: ${l}`);
      assert.ok(!l.includes(c), `${s}: los datos traen la respuesta «${c}»`);
      assert.ok(!/^(Recuerda|Ojo|Cuidado|No olvides|Ten en cuenta|Fíjate|Conviene)/.test(l), `${s}: consejo en datos`);
    }
    // Cada alternativa incorrecta empieza por lo que el alumno hizo bien, o nombra lo que lo confundió.
    for (const a of p.alternativas.filter(x => !x.correcta)) assert.ok(a.error.explicacion.length <= 160, `${s}: explicación larga`);
    // Colores de la unidad: Z naranja, radio turquesa, energía carmín, electronegatividad violeta.
    for (const [k, x] of Object.entries(p.variables)) assert.equal(x.color, { Z: 'o', r: 'i', EI: 'h', EN: 'f' }[k], `${s}: ${k}`);
  }
});

test('casos.json: de 15 a 20 casos verificados aparte, de las cuatro ideas y los tres niveles', () => {
  assert.ok(casos.casos.length >= 15 && casos.casos.length <= 20);
  assert.deepEqual([...new Set(casos.casos.map(c => c.entrada.idea))].sort(), Object.keys(gen.TIPOS_POR_IDEA).sort());
  assert.deepEqual([...new Set(casos.casos.map(c => c.entrada.nivel))].sort(), [1, 2, 3]);
  for (const c of casos.casos) {
    const p = gen.generar(c.semilla, { idea: c.entrada.idea });
    assert.deepEqual(p._datos, c.entrada, `semilla ${c.semilla}: el generador cambió; recalcula casos.json`);
    assert.equal(p.respuesta.valor, c.esperado.respuesta, `semilla ${c.semilla}`);
    assert.ok(plano(p.pregunta).length > 5);
  }
});

// Auditoría (19 nov): cada prueba falla con la versión de antes.
test('auditoría: el par de isoelectrónicos tiene una sola respuesta, y el carácter metálico sigue la EI de la unidad', () => {
  for (let s = 0; s < 400; s++) {
    const p = gen.generar(s, { idea: 'radio-ionico' });
    assert.ok(!p.alternativas.some(a => /mayor carga/.test(a.texto)), `${s}: «el de mayor carga» puede ser la correcta`);
    const q = gen.generar(s, { idea: 'electronegatividad' }), d = q._datos;
    if (d.tipo === 'metalico') { const E = gen.DATOS.EL, m = q.respuesta.valor.replace('El ', ''), [x, y] = [E[d.a], E[d.b]], mas = x.nombre === m ? x : y, otro = mas === x ? y : x; assert.ok(mas.ei < otro.ei, `${s}: ${mas.s} ${mas.ei}, ${otro.s} ${otro.ei}`); }
  }
});
