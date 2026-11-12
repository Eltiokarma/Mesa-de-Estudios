// Pruebas del generador «quimica-conceptos» (verdadero o falso de química): casos.json, un recálculo
// independiente en cada uno de 600 problemas (la respuesta se rehace leyendo el banco por id) y
// pruebas del banco de proposiciones y de los pares para relacionar.
const test = require('node:test');
const assert = require('node:assert/strict');
const gen = require('./generador.js');
const casos = require('./casos.json');
const { probarGenerador } = require('../../nucleo/probar-generador.js');
const catalogo = require('../../catalogo/cursos/quimica.json');

const banco = Object.fromEntries(gen.BANCO.map(p => [p.id, p]));
const pares = Object.fromEntries(gen.PARES.flatMap(c => c.pares.map(p => [p.id, { ...p, conjunto: c.id }])));
const ROM = ['I', 'II', 'III', 'IV'];

// Camino independiente: se ignoran las alternativas y la respuesta del generador; solo se leen los ids
// que se mostraron y el banco.
// Pourbaix: las zonas con sus rectas, sin los polígonos del generador. El dato se lee del texto que vio el alumno.
const REGION = {
  aluminio: (pH, E) => { const L = pH <= 4 ? -1.8 : -1.8 - 0.06 * (pH - 4); if (E < L) return 'Al'; return pH < 4 ? 'Al3' : pH < 10 ? 'Al2O3' : 'AlO2'; },
  'metal-x': (pH, E) => {
    const L = pH <= 8 ? -0.6 : -0.6 - 0.06 * (pH - 8), U = pH <= 8 ? 1.0 : 1.0 - 0.06 * (pH - 8);
    return E < L ? 'X' : E >= U ? 'XO4' : pH < 8 ? 'X2' : 'XOH2';
  },
};
const num = t => Number(t.replace('−', '-').replace(',', '.'));
const SUPD = '⁰¹²³⁴⁵⁶⁷⁸⁹';
function leerPH(t) {
  let m;
  if ((m = t.match(/^\[H⁺\] = 10⁻([¹²³⁰⁴-⁹]+) M$/))) return Number([...m[1]].map(c => SUPD.indexOf(c)).join(''));
  if ((m = t.match(/^pOH = ([\d,]+)$/))) return 14 - num(m[1]);
  if ((m = t.match(/^pH = ([\d,]+)$/))) return num(m[1]);
  throw new Error('dato de acidez ilegible: ' + t);
}
const planoE = x => (Array.isArray(x) ? x.map(planoE).join('') : x && typeof x === 'object' ? x.t : String(x));
const nombreEsp = (diag, id) => gen.POURBAIX.DIAGRAMAS.find(x => x.id === diag).especies.find(e => e.id === id).nombre;
function recalcularPourbaix(p) {
  const d = p._datos, txt = planoE(p.enunciado);
  if (d.sub === 'especie') {
    const m = txt.match(/potencial de (.+?) V y a (.+?)\.$/);
    return 'pb:' + REGION[d.diagrama](leerPH(m[2]), num(m[1]));
  }
  const sec = [...txt.matchAll(/(?:^|\s)(I{1,3})\. Con (.+?) y E = (.+?) V, [^,]+? está como (.+?)\.(?= I|$)/g)].map(m => {
    const id = REGION[d.diagrama](leerPH(m[2]), num(m[3]));
    return nombreEsp(d.diagrama, id) === m[4] ? 'V' : 'F';
  });
  return 'vf:' + sec.join('');
}
function recalcular(p) {
  const d = p._datos;
  if (d.tipo === 'pourbaix') return recalcularPourbaix(p);
  if (d.tipo === 'vf') return 'vf:' + d.ids.map(id => (banco[id].verdad ? 'V' : 'F')).join('');
  if (d.tipo === 'incorrecta' || d.tipo === 'correcta') {
    const buscada = d.tipo === 'correcta';
    const ganadoras = d.ids.filter(id => banco[id].verdad === buscada);
    assert.equal(ganadoras.length, 1, `${p.id}: debe haber una sola ${d.tipo}`);
    return 'p:' + ganadoras[0];
  }
  // relacionar: la letra de cada elemento de la izquierda es la posición de su par en la derecha.
  return 'rel:' + d.ids.map((id, k) => ROM[k] + 'abcd'[d.derecha.indexOf(id)]).join(', ');
}
probarGenerador(gen, { semillas: 600, recalcular, igual: (a, b) => a === b });

for (const c of casos.casos) {
  test(`casos.json: semilla ${c.semilla}`, () => {
    const p = gen.generar(c.semilla);
    assert.deepEqual(p._datos, c.entrada, 'el generador cambió: recalcula casos.json');
    assert.equal(p.respuesta.valor, c.esperado.respuesta);
    assert.equal(p.respuesta.texto, c.esperado.texto);
  });
}

test('casos.json cubre los cuatro tipos', () => {
  const tipos = new Set(casos.casos.map(c => c.entrada.tipo));
  for (const t of ['vf', 'incorrecta', 'correcta', 'relacionar']) assert.ok(tipos.has(t), `falta ${t}`);
  assert.ok(casos.casos.length >= 15 && casos.casos.length <= 40);
});

test('banco: ids únicos, textos sin repetir y campos completos', () => {
  assert.ok(gen.BANCO.length >= 150 && gen.BANCO.length <= 460, `${gen.BANCO.length} proposiciones`);
  const ids = new Set(), textos = new Set();
  const unidades = new Set(catalogo.unidades.map(u => u.id));
  const norm = t => t.toLowerCase().replace(/[^a-záéíóúñü0-9]/g, '');
  for (const p of gen.BANCO) {
    assert.ok(!ids.has(p.id), `id repetido ${p.id}`); ids.add(p.id);
    assert.ok(!pares[p.id], `${p.id} choca con un id de los pares`);
    assert.ok(!textos.has(norm(p.texto)), `texto repetido: ${p.texto}`); textos.add(norm(p.texto));
    assert.ok(unidades.has(p.unidad), `${p.id}: unidad ${p.unidad} no está en el catálogo`);
    assert.equal(typeof p.verdad, 'boolean');
    assert.ok(p.texto.length > 20 && p.texto.length <= 160, `${p.id}: texto de largo ${p.texto.length}`);
    assert.ok(p.explicacion && p.explicacion.length > 10, `${p.id}: sin explicación`);
    if (p.verdad) {
      assert.equal(p.error, null); assert.equal(p.corregida, null);
      if (p.negar) assert.ok(gen.ERRORES[p.negar], `${p.id}: negar ${p.negar} no está en ERRORES`);
    } else {
      assert.ok(p.error && gen.ERRORES[p.error], `${p.id}: falsa sin error válido`);
      assert.ok(p.corregida && p.corregida !== p.texto, `${p.id}: falsa sin corregida`);
    }
  }
});

test('banco: cada unidad tiene al menos 6 proposiciones y 2 falsas; cada tema sirve para los tres tipos', () => {
  const porUnidad = {};
  for (const p of gen.BANCO) (porUnidad[p.unidad] = porUnidad[p.unidad] || []).push(p);
  for (const [u, ps] of Object.entries(porUnidad)) {
    assert.ok(ps.length >= 6, `${u}: ${ps.length}`);
    assert.ok(ps.filter(p => !p.verdad).length >= 2, `${u}: pocas falsas`);
  }
  for (const t of gen.TEMAS) {
    const ps = t.ids.map(id => banco[id]);
    assert.ok(ps.filter(p => p.verdad).length >= 4 && ps.filter(p => !p.verdad).length >= 4, `${t.id}: necesita 4 V y 4 F`);
    assert.ok(ps.every(p => p.tema === t.id && p.unidad === t.unidad));
  }
});

test('errores: respaldo válido y fuente existente; todos los códigos se usan', () => {
  const usados = new Set(['AQ-negar-verdadera']);
  for (const p of gen.BANCO) { if (p.error) usados.add(p.error); if (p.negar) usados.add(p.negar); }
  for (const c of gen.PARES) { usados.add(c.codigo); if (c.codigoFamilia) usados.add(c.codigoFamilia); }
  for (const k of gen.POURBAIX.codigos) usados.add(k);
  for (const [k, e] of Object.entries(gen.ERRORES)) {
    assert.ok(['documentado', 'parcial', 'hipotesis'].includes(e.respaldo), k);
    if (k.startsWith('AQ-')) assert.equal(e.respaldo, 'hipotesis', `${k}: los códigos nuevos son hipótesis`);
    assert.ok(usados.has(k), `${k} no se usa`);
  }
  for (const k of usados) assert.ok(gen.ERRORES[k], `${k} no está en ERRORES`);
});

test('pares: ids únicos, lados derechos distintos (salvo los tipos de sólido) y choques válidos', () => {
  const ids = new Set();
  for (const c of gen.PARES) {
    assert.ok(c.pares.length >= 4, c.id);
    for (const p of c.pares) { assert.ok(!ids.has(p.id), p.id); ids.add(p.id); }
    const ders = c.pares.map(p => p.der);
    if (c.id !== 'solido-ejemplo') assert.equal(new Set(ders).size, ders.length, `${c.id}: lados derechos repetidos`);
    else assert.ok(new Set(ders).size >= 4);
    for (const ch of c.choques || []) for (const id of ch) assert.ok(c.pares.some(p => p.id === id), `${c.id}: choque ${id}`);
    for (const id of c.familia || []) assert.ok(c.pares.some(p => p.id === id), `${c.id}: familia ${id}`);
  }
});

test('600 problemas: los textos coinciden con el banco y aparecen todos los tipos y temas', () => {
  const tipos = {}, temas = new Set(), conjuntos = new Set();
  let pb = 0;
  for (let s = 0; s < 600; s++) {
    const p = gen.generar(s), d = p._datos;
    tipos[d.tipo] = (tipos[d.tipo] || 0) + 1;
    const enun = p.enunciado.map(x => (typeof x === 'string' ? x : x.t)).join('');
    if (d.tipo === 'pourbaix') { pb++; continue; }
    if (d.tipo === 'relacionar') {
      conjuntos.add(d.conjunto);
      assert.ok(d.ids.length >= 3 && d.ids.length <= 4);
      assert.ok(d.ids.some((id, k) => d.derecha[k] !== id), `semilla ${s}: la derecha va en el mismo orden`);
      assert.equal(new Set(d.ids.map(id => pares[id].der)).size, d.ids.length, `semilla ${s}: dos pares con la misma derecha`);
      for (const id of d.ids) { assert.ok(enun.includes(pares[id].izq) && enun.includes(pares[id].der)); assert.equal(pares[id].conjunto, d.conjunto); }
      continue;
    }
    temas.add(d.tema);
    for (const id of d.ids) assert.equal(banco[id].tema, d.tema, `semilla ${s}: ${id} no es del tema`);
    if (d.tipo === 'vf') {
      assert.ok(d.ids.length >= 3 && d.ids.length <= 4);
      d.ids.forEach((id, k) => assert.ok(enun.includes(`${ROM[k]}. ${banco[id].texto}`), `semilla ${s}: falta la ${ROM[k]}`));
      for (const a of p.alternativas) assert.match(a.texto, new RegExp(`^[VF]{${d.ids.length}}$`));
      // Cada distractor difiere en una o dos posiciones de la correcta.
      for (const a of p.alternativas.filter(x => !x.correcta)) {
        const dif = [...a.texto].filter((c, k) => c !== p.respuesta.texto[k]).length;
        assert.ok(dif === 1 || dif === 2, `semilla ${s}: ${a.texto} difiere en ${dif}`);
      }
    } else {
      assert.ok(d.ids.length >= 4 && d.ids.length <= 5);
      assert.deepEqual(p.alternativas.map(a => a.valor).sort(), d.ids.map(id => 'p:' + id).sort());
      for (const a of p.alternativas) assert.equal(a.texto, banco[a.valor.slice(2)].texto);
      for (const a of p.alternativas.filter(x => !x.correcta)) {
        const q = banco[a.valor.slice(2)];
        assert.equal(a.error.id, q.verdad ? (q.negar || 'AQ-negar-verdadera') : q.error);
      }
    }
  }
  for (const t of ['vf', 'incorrecta', 'correcta', 'relacionar']) assert.ok(tipos[t] > 50, `${t}: ${tipos[t]}`);
  assert.ok(pb >= 20 && pb <= 80, `pourbaix: ${pb} de 600`);
  for (const t of gen.TEMAS) assert.ok(temas.has(t.id), `el tema ${t.id} no salió`);
  for (const c of gen.PARES) assert.ok(conjuntos.has(c.id), `el conjunto ${c.id} no salió`);
});

test('en vf, D0 lleva el código de su F y cada vecino el de la inversión que lo distingue de D0', () => {
  const codigo = q => (q.verdad ? (q.negar || 'AQ-negar-verdadera') : q.error);
  for (let s = 0; s < 600; s++) {
    const p = gen.generar(s), d = p._datos;
    if (d.tipo !== 'vf') continue;
    const dif = x => [...x].map((c, k) => (c !== p.respuesta.texto[k] ? k : -1)).filter(k => k >= 0);
    const malas = p.alternativas.filter(x => !x.correcta);
    const d0 = malas.find(a => dif(a.texto).length === 1);
    assert.ok(d0 && malas.filter(a => dif(a.texto).length === 1).length === 1, `semilla ${s}: un solo D0`);
    const f0 = dif(d0.texto)[0];
    assert.equal(banco[d.ids[f0]].verdad, false, `semilla ${s}: D0 invierte una F`);
    assert.equal(d0.error.id, codigo(banco[d.ids[f0]]), `semilla ${s}: código de D0`);
    for (const a of malas.filter(x => x !== d0)) {
      const ks = dif(a.texto);
      assert.ok(ks.length === 2 && ks.includes(f0), `semilla ${s}: ${a.texto} no es vecino de D0`);
      assert.equal(a.error.id, codigo(banco[d.ids[ks.find(k => k !== f0)]]), `semilla ${s}: código del vecino`);
    }
  }
});

// Votación por posición: el valor más repetido en cada posición entre las alternativas.
function votacion(listas) {
  return listas[0].map((_, k) => {
    const c = {};
    for (const l of listas) c[l[k]] = (c[l[k]] || 0) + 1;
    const m = Math.max(...Object.values(c)), w = Object.keys(c).filter(x => c[x] === m);
    return w.length === 1 ? w[0] : null;
  });
}
test('2000 problemas: la votación por posición no da la respuesta (≤ 30 % en vf y en relacionar)', () => {
  const n = { vf: 0, relacionar: 0 }, ok = { vf: 0, relacionar: 0 };
  for (let s = 0; s < 2000; s++) {
    const p = gen.generar(s), t = p._datos.tipo;
    if (!(t in n)) continue;
    const partes = x => (t === 'vf' ? [...x] : x.split(', ').map(y => y.replace(/^[IV]+/, '')));
    const voto = votacion(p.alternativas.map(a => partes(a.texto)));
    n[t]++; if (voto.join('|') === partes(p.respuesta.texto).join('|')) ok[t]++;
    if (t === 'relacionar') {
      const id = p._datos.ids.map((_, k) => ['I', 'II', 'III', 'IV'][k] + 'abcd'[k]).join(', ');
      assert.ok(p.alternativas.every(a => a.texto !== id), `semilla ${s}: sale el orden idéntico`);
    }
  }
  for (const t of Object.keys(n)) assert.ok(ok[t] / n[t] <= 0.3, `${t}: la votación acierta ${ok[t]} de ${n[t]}`);
});

test('excluye: las proposiciones espejo no salen juntas (2000 problemas) y la relación es simétrica', () => {
  for (const p of gen.BANCO) for (const id of p.excluye) {
    assert.ok(banco[id], `${p.id}: excluye ${id}, que no existe`);
    assert.ok(banco[id].excluye.includes(p.id), `${p.id} ↔ ${id} no es simétrica`);
    assert.equal(banco[id].tema, p.tema, `${p.id} y ${id} son de temas distintos`);
  }
  for (let s = 0; s < 2000; s++) {
    const d = gen.generar(s)._datos;
    if (d.tipo === 'relacionar' || d.tipo === 'pourbaix') continue;
    for (const a of d.ids) for (const b of d.ids) assert.ok(!banco[a].excluye.includes(b), `semilla ${s}: ${a} con ${b}`);
  }
  for (const id of ['esf8', 'pro10', 'ts10', 'met8', 'con8', 'ten7', 'dal9']) assert.ok(banco[id].excluye.length > 0, id);
});

test('delatores de forma (2000 problemas): la correcta no es la más larga ni la única con «porque»', () => {
  let nC = 0, larga = 0, nI = 0, porque = 0;
  for (let s = 0; s < 2000; s++) {
    const p = gen.generar(s), t = p._datos.tipo;
    const resp = p.alternativas.find(a => a.correcta);
    const otras = p.alternativas.filter(a => !a.correcta);
    if (t === 'correcta') { nC++; if (otras.every(a => a.texto.length < resp.texto.length)) larga++; }
    if (t === 'incorrecta') { nI++; if (/porque/.test(resp.texto) && otras.every(a => !/porque/.test(a.texto))) porque++; }
  }
  assert.ok(larga / nC <= 0.3, `en «correcta», la respuesta es la más larga en ${larga} de ${nC}`);
  assert.ok(porque / nI <= 0.1, `en «incorrecta», la respuesta es la única con «porque» en ${porque} de ${nI}`);
  for (const id of ['dal6', 'dal7', 'dal8']) assert.match(banco[id].texto, /^Según Dalton,/);
});

test('respaldo: cada código de informe está en su fuente; documentado solo en una F con código de informe', () => {
  const fs = require('node:fs'), path = require('node:path');
  for (const [k, e] of Object.entries(gen.ERRORES)) {
    if (k.startsWith('AQ-')) { assert.equal(e.fuente, null, k); continue; }
    const texto = fs.readFileSync(path.join(__dirname, '../..', e.fuente), 'utf8');
    assert.ok(texto.includes(`| ${k} |`), `${k} no aparece como «| ${k} |» en ${e.fuente}`);
  }
  for (const p of gen.BANCO) if (p.respaldo) {
    assert.ok(!p.verdad && !p.error.startsWith('AQ-'), `${p.id}: respaldo propio en una V o en un código nuevo`);
    assert.equal(p.respaldo, 'documentado');
  }
  assert.ok(!gen.ERRORES.BM8, 'BM8 ya no se usa');
});

// Pourbaix: los dos diagramas, sus zonas y las lecturas con error.
test('pourbaix: las zonas del generador coinciden con las rectas en una cuadrícula fina', () => {
  for (const d of gen.POURBAIX.DIAGRAMAS) {
    let n = 0;
    for (let pH = 0.05; pH < 14; pH += 0.1) for (let E = d.ejeE[0] + 0.005; E < d.ejeE[1]; E += 0.01) {
      assert.equal(gen.POURBAIX.especieEn(d, pH, E).id, REGION[d.id](pH, E), `${d.id}: (${pH.toFixed(2)}; ${E.toFixed(3)})`);
      n++;
    }
    assert.ok(n > 10000);
    assert.equal(d.especies.length, 4);
    // Las zonas se reparten todo el cuadro sin traslapes: el área de los polígonos suma el cuadro.
    const area = poly => Math.abs(poly.reduce((t, [x, y], i) => { const [x2, y2] = poly[(i + 1) % poly.length]; return t + x * y2 - x2 * y; }, 0)) / 2;
    const total = d.especies.reduce((t, e) => t + area(e.poly), 0);
    assert.ok(Math.abs(total - 14 * (d.ejeE[1] - d.ejeE[0])) < 1e-9, `${d.id}: ${total}`);
  }
});

test('pourbaix: figura con descripción, sin el punto en el problema y con el punto en la solución; los dos subtipos y las tres formas', () => {
  const vistos = new Set(), formas = new Set(), diag = new Set();
  for (let s = 0; s < 1500; s++) {
    const p = gen.generar(s), d = p._datos;
    if (d.tipo !== 'pourbaix') continue;
    vistos.add(d.sub); diag.add(d.diagrama);
    assert.ok(p.figura && p.figuraSolucion, `semilla ${s}: faltan las figuras`);
    assert.ok(!/<circle/.test(p.figura.svg), `semilla ${s}: el problema no debe marcar el punto`);
    assert.ok(/<circle/.test(p.figuraSolucion.svg), `semilla ${s}: la solución marca el punto`);
    const plano = planoE(p.enunciado);
    for (const f of ['[H⁺]', 'pOH', 'pH']) if (plano.includes(f)) formas.add(f);
    if (d.sub === 'especie') {
      assert.equal(p.alternativas.length, 4);
      for (const a of p.alternativas.filter(a => !a.correcta)) assert.ok(a.error.id.startsWith('AQ-pourbaix-'), a.error.id);
      // Las variables que se declaran son las que se usan (regla 4).
      assert.deepEqual(Object.keys(p.variables).sort(), ['E', 'pH']);
    } else {
      assert.deepEqual(Object.keys(p.variables), []);
      assert.equal(d.puntos.length, 3);
    }
  }
  assert.deepEqual([...vistos].sort(), ['especie', 'vf']);
  assert.deepEqual([...formas].sort(), ['[H⁺]', 'pH', 'pOH']);
  assert.deepEqual([...diag].sort(), ['aluminio', 'metal-x']);
});

test('pourbaix: los errores de lectura (pH ↔ pOH y signo de E) dan lo que dice su explicación', () => {
  for (let s = 0; s < 1500; s++) {
    const p = gen.generar(s), d = p._datos;
    if (d.tipo !== 'pourbaix' || d.sub !== 'especie') continue;
    const dg = gen.POURBAIX.DIAGRAMAS.find(x => x.id === d.diagrama), m = planoE(p.enunciado).match(/potencial de (.+?) V y a (.+?)\.$/);
    const pH = leerPH(m[2]), E = num(m[1]);
    for (const a of p.alternativas.filter(x => !x.correcta)) {
      const id = a.valor.slice(3);
      if (/^AQ-pourbaix-(h-poh|poh-ph|ph-poh)$/.test(a.error.id)) assert.equal(REGION[d.diagrama](14 - pH, E), id, `semilla ${s}`);
      if (a.error.id === 'AQ-pourbaix-signo-e') assert.equal(REGION[d.diagrama](pH, Math.max(dg.ejeE[0], Math.min(dg.ejeE[1], -E))), id, `semilla ${s}`);
    }
  }
});
