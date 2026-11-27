// Prueba propia de «Nomenclatura inorgánica» (etapa 7, 19 nov 2026). Lo que el validador común no ve:
//   - los colores del mapa de la unidad: catión naranja, anión turquesa, EO violeta, carga carmín, sin verde;
//   - lo que el juego reserva para Predice: ninguna especie con dos átomos del elemento que falta (idea 1), sin plomo
//     (idea 2), sin peróxidos (idea 3), sin cloro (idea 4), sin ácidos -oso (idea 5), sin hidratos (idea 6);
//   - cada misión la cumple solo lo que dice;
//   - en 400 semillas de «Ahora tú»: una sola correcta y el EO rehecho con valores fijos propios (no los del motor);
//   - ninguna explicación de un distractor de la idea 1 da una suma que no es la de su valor;
//   - las letras de las respuestas de nivel 3 repartidas (6 de cada una) y el ícono de la unidad sin Fe₂O₃.
const test = require('node:test');
const assert = require('node:assert/strict');
const def = require('./nomenclatura-inorganica.js');
const plano = x => (Array.isArray(x) ? x.map(plano).join('') : x && typeof x === 'object' ? (x.t !== undefined ? String(x.t) : x.negrita ? plano(x.negrita) : x.llave ? plano(x.llave) : '') : String(x ?? ''));
const idea = id => def.ideas.find(i => i.id === id);
const casos = i => { const ctrl = i.juega.controles; const lista = [{}]; for (const c of ctrl) { const vals = c.opciones ? c.opciones.map(o => o.valor) : Array.from({ length: Math.round((c.max - c.min) / c.paso) + 1 }, (_, k) => c.min + k * c.paso);
  const nueva = []; for (const v of lista) for (const x of vals) nueva.push(Object.assign({}, v, { [c.id]: x })); lista.splice(0, lista.length, ...nueva); } return lista; };

test('cerrada con calidad 2 (19 nov, tras el lector en frío y el auditor)', () => {
  assert.equal(def.calidad, 2);
});

test('colores del mapa: EO violeta, carga carmín, catión naranja, anión turquesa; nada en verde', () => {
  const visto = { 'c-f': new Set(), 'c-h': new Set(), 'c-o': new Set(), 'c-i': new Set() }, verde = [];
  const ir = (x, seen = new Set()) => { if (!x || typeof x !== 'object' || seen.has(x)) return; seen.add(x);
    if (x.v && x.t !== undefined) { if (x.v === 'c-d') verde.push(x.t); else if (visto[x.v]) visto[x.v].add(x.m || 'sin-m'); }
    if (x.color === 'd' || x.color === 'c-d') verde.push(JSON.stringify(x).slice(0, 40)); for (const v of Object.values(x)) ir(v, seen); };
  ir(def); for (const i of def.ideas) for (let s = 0; s < 60; s++) { ir(i.ahoraTu.generar(s)); if (i.resuelve) ir(i.resuelve.generar(s)); }
  assert.deepEqual(verde, []);
  assert.deepEqual([...visto['c-f']].filter(m => m !== 'eo' && m !== 'sin-m'), [], 'el violeta es del EO');
  assert.deepEqual([...visto['c-h']].filter(m => m !== 'carga' && m !== 'sin-m'), [], 'el carmín es de la carga');
  assert.deepEqual([...visto['c-o']].filter(m => m !== 'cation' && m !== 'sin-m'), []);
  assert.deepEqual([...visto['c-i']].filter(m => m !== 'anion' && m !== 'sin-m'), []);
});

test('el juego no adelanta la predicción', () => {
  const txt = i => casos(i).map(v => plano(i.juega.lectura(v)) + JSON.stringify(i.juega.dibujo(v).datos)).join(' ') + plano(i.juega.consigna) + plano(i.juega.mision.texto) + JSON.stringify(i.juega.controles);
  const t1 = txt(idea('estados-oxidacion'));
  for (const f of ['Fe₂O₃', 'Fe', 'Cr₂O₇']) assert.ok(!t1.includes(f), `idea 1: el juego muestra ${f}`);
  assert.ok(!/Pb|plomo/.test(txt(idea('tres-nombres'))), 'idea 2: el plomo es de Predice');
  assert.ok(!/O₂²⁻|peróxido|BaO₂|H₂O₂/.test(txt(idea('peroxidos-hidruros'))), 'idea 3: sin peróxidos');
  assert.ok(!/Cl|cloro/.test(txt(idea('arbol-funciones'))), 'idea 4: sin cloro');
  assert.ok(!/ito\b|NO₂⁻|SO₃²⁻/.test(txt(idea('sales'))), 'idea 5: sin aniones -ito');
  assert.ok(!/H₂O|hidrat/.test(txt(idea('sales-acidas-basicas-hidratadas'))), 'idea 6: sin hidratos');
});

test('cada misión: no está cumplida al abrir y la cumple solo lo que dice', () => {
  const quien = { 'estados-oxidacion': v => v.k === 'NH4' && v.eo === -3, 'tres-nombres': v => v.k === 'Cu1', 'peroxidos-hidruros': v => v.k === 'NaH' || v.k === 'CaH2',
    'arbol-funciones': v => v.k === 'N3' || v.k === 'N5', sales: v => v.c === 'Al' && v.a === 'SO4' && v.nc === 2 && v.na === 3, 'sales-acidas-basicas-hidratadas': v => v.k === 'MgOHCl' };
  for (const i of def.ideas) for (const v of casos(i)) assert.equal(!!i.juega.mision.logrado(v), quien[i.id](v), `${i.id} ${JSON.stringify(v)}`);
});

// EO con valores fijos propios: O −2, H +1 (−1 en un hidruro de metal), grupo 1 +1, grupo 2 y Zn +2, Al +3, F −1; un
// grupo SO₄ entero vale −2 cuando se pregunta por otro elemento.
const SUB = '₀₁₂₃₄₅₆₇₈₉', SUP = '⁰¹²³⁴⁵⁶⁷⁸⁹';
const asc = t => t.replace(/[₀-₉]/g, x => SUB.indexOf(x)).replace(/([⁰¹²³⁴⁵⁶⁷⁸⁹]*)([⁺⁻])$/, (m, d, q) => `^${d.split('').map(x => SUP.indexOf(x)).join('')}${q === '⁺' ? '+' : '-'}`);
function atomos(f) { const c = {}; const parse = (t, k) => { let i = 0; while (i < t.length) { if (t[i] === '(') { let d = 1, j = i + 1; while (d) { if (t[j] === '(') d++; if (t[j] === ')') d--; j++; } const m = t.slice(j).match(/^\d*/)[0]; parse(t.slice(i + 1, j - 1), k * (+m || 1)); i = j + m.length; continue; }
  const m = t.slice(i).match(/^([A-Z][a-z]?)(\d*)/); if (!m) { i++; continue; } c[m[1]] = (c[m[1]] || 0) + k * (+m[2] || 1); i += m[0].length; } }; parse(f, 1); return c; }
const FIJO = { O: -2, F: -1, Li: 1, Na: 1, K: 1, Ca: 2, Mg: 2, Ba: 2, Zn: 2, Al: 3 }, METAL = Object.keys(FIJO).filter(k => FIJO[k] > 0);
function eo(f, x, z) {
  if (x !== 'S' && /SO4/.test(f)) { const k = f.match(/SO4/g).length; return eo(f.replace(/SO4/g, ''), x, z + 2 * k); }
  const at = atomos(f), els = Object.keys(at), metal = els.some(e => METAL.includes(e));
  if (x === 'O' && els.length === 2 && metal && at.O === 2 && !els.includes('H')) { const m = els.find(e => e !== 'O'); if (FIJO[m] * at[m] === 2) return -1; }
  if (x === 'O' && f === 'H2O2') return -1;
  let s = 0; for (const e of els) if (e !== x) s += (e === 'H' ? (metal && els.length === 2 ? -1 : 1) : FIJO[e]) * at[e];
  return (z - s) / at[x];
}
const sg = v => (v > 0 ? `+${v}` : v < 0 ? `−${-v}` : '0');
const cargaDe = f => (f.includes('^') ? (+(f.match(/\^(\d*)/)[1] || 1)) * (f.endsWith('+') ? 1 : -1) : 0);

test('Ahora tú, 400 semillas: una sola correcta, sin repetidas, y el EO rehecho aparte', () => {
  for (const i of def.ideas) for (let s = 0; s < 400; s++) {
    const c = i.ahoraTu.generar(s), d = `${i.id} ${s}`, p = plano(c.pregunta);
    assert.equal(c.opciones.filter(o => o.correcta).length, 1, d);
    assert.equal(new Set(c.opciones.map(o => o.texto)).size, c.opciones.length, `${d}: opciones repetidas`);
    assert.ok(!/NaN|undefined|null|\[object/.test(p + plano(c.opciones.map(o => o.texto + (o.siFuera || ''))) + plano(c.solucion.texto) + plano(c.solucion.ecuacion || '') + (c.datos || []).join(' ')), d);
    const m = p.match(/tiene el ([A-Z][a-z]?) en el (\S+?)( \(cada átomo\))?\?$/);
    if (m) {
      const f = asc(m[2]), z = cargaDe(f), cu = f.split('^')[0], v = eo(cu, m[1], z), n = atomos(cu)[m[1]], ok = c.opciones.find(o => o.correcta);
      assert.equal(ok.texto, sg(v), `${d}: EO del ${m[1]} en ${m[2]}`);
      for (const o of c.opciones.filter(o => !o.correcta)) { const q = (o.siFuera || '').match(/la suma da(?:ría)? ([+−]?\d+)/);
        if (q) assert.equal(z - v * n + (+o.texto.replace('−', '-')) * n, +q[1].replace('−', '-'), `${d}: siFuera de ${o.texto}`); }
    }
    const q = p.match(/¿En cuál de estas especies el ([A-Z][a-z]?) tiene EO ([+−]?\d+)\?/);
    if (q) { const meta = +q[2].replace('−', '-'), cumplen = c.opciones.filter(o => { const f = asc(o.texto), cu = f.split('^')[0]; return Object.keys(atomos(cu)).length === 1 ? meta === 0 : eo(cu, q[1], cargaDe(f)) === meta; });
      assert.deepEqual(cumplen.map(o => !!o.correcta), [true], d); }
  }
});

test('letras de nivel 3 repartidas y el ícono de la unidad sin la respuesta de la idea 1', () => {
  const n = {}; for (const i of def.ideas) for (const e of i.ejemplos.filter(e => e.alternativas)) { const L = plano(e.respuesta)[0]; n[L] = (n[L] || 0) + 1; }
  assert.deepEqual(n, { A: 6, B: 6, C: 6, D: 6, E: 6 });
  const icono = require('node:fs').readFileSync(require('node:path').join(__dirname, '..', '..', '..', 'app', 'dibujos', 'quimica.js'), 'utf8').match(/'quimica\.nomenclatura-inorganica'[\s\S]*?\n  \/\/ El mol/)[0];
  assert.ok(!/'Fe|Fe₂O₃/.test(icono.split('\n').filter(l => !/^\s*\/\//.test(l)).join('\n')), 'el ícono no muestra Fe₂O₃');
});

// ---------- Cierre (19 nov 2026): auditoría y lectores en frío (rutinas/auditoria y rutinas/frio de la unidad) ----------
// Cada prueba falla con la versión anterior a las correcciones.
const todosLosTextos = () => { const out = []; const ir = (x, seen = new Set()) => { if (x == null) return; if (typeof x === 'string') { out.push(x); return; } if (typeof x !== 'object' || seen.has(x)) return; seen.add(x); for (const v of Object.values(x)) if (typeof v !== 'function') ir(v, seen); };
  ir(def); for (const i of def.ideas) for (let s = 0; s < 60; s++) { ir(i.ahoraTu.generar(s)); ir(i.resuelve.generar(s)); for (const v of casos(i).slice(0, 40)) ir([plano(i.juega.lectura(v))]); } return out; };

test('A1: con los Datos de «¿cuál es un peróxido?», cada dióxido puede tener el EO que pide (una sola correcta)', () => {
  for (let s = 0; s < 400; s += 5) {
    const c = idea('peroxidos-hidruros').ahoraTu.generar(s);
    for (const o of c.opciones.filter(o => !o.correcta)) {
      const f = asc(o.texto), at = atomos(f), x = Object.keys(at).find(e => e !== 'O'), pide = 2 * at.O / at[x];
      const d = c.datos.find(l => l.startsWith(`EO del ${x}:`));
      assert.ok(d && d.match(/[+−]\d+/g).map(t => +t.replace('−', '-')).includes(pide), `semilla ${s}: ${o.texto} pide ${pide} y los datos dicen «${d}»`);
    }
  }
});

test('M: las explicaciones cuentan bien los EO del elemento y las listas se escriben con comas', () => {
  const nums = { uno: 1, dos: 2, tres: 3, cuatro: 4 };
  for (let s = 0; s < 400; s++) {
    const c = idea('tres-nombres').ahoraTu.generar(s), d = c.datos.find(l => /^EO del [a-zíé]+:/.test(l));
    if (d) assert.ok(!/ y .* y /.test(d), `«${d}»`);
    for (const o of c.opciones) { const m = (o.siFuera || '').match(/tiene (uno|dos|tres|cuatro)\.$/); if (m && d) assert.equal(d.match(/[+−]\d+/g).length, nums[m[1]], `${o.siFuera} / ${d}`);
      assert.ok(!/\b1 oxígenos\b/.test(o.siFuera || ''), o.siFuera); }
  }
});

test('M: «Así se resuelve» de la idea 6 no nombra sales básicas y da de qué ácido sale el anión (o cómo se nombra el hidrato)', () => {
  for (let s = 0; s < 8; s++) {
    const c = idea('sales-acidas-basicas-hidratadas').resuelve.generar(s), e = plano(c.enunciado);
    assert.ok(!/OH/.test(e), e);
    assert.ok(c.datos.some(l => /sale del ácido|hidratado/.test(l)), `${e}: ${c.datos.join(' | ')}`);
  }
});

test('M: las igualdades químicas cuadran o no se escriben (lector B): metal + agua sin «+ H₂O», y la regla de sales es el caso de su dibujo', () => {
  const i4 = idea('arbol-funciones');
  for (const v of casos(i4)) { const t = plano(i4.juega.lectura(v)); assert.ok(!/O[₀-₉]* \+ H₂O da [A-Z][a-z]?(\(OH\)|OH)/.test(t), t);
    const fl = i4.juega.dibujo(v).datos.columnas[0].flechas[1].texto; if (/hidróxido/.test(JSON.stringify(i4.juega.dibujo(v).datos))) assert.equal(fl, 'con agua'); }
  assert.ok(!JSON.stringify(i4.mira.datos.columnas[1]).includes('+ H₂O'));
  const s5 = idea('sales'); assert.ok(plano(s5.regla.ecuacion).includes('Fe₂(SO₄)₃'), 'La regla con el Fe³⁺ y el SO₄²⁻ del dibujo de Mira');
});

test('M: Predice del yeso: la correcta no es la más larga ni los Datos traen el OH⁻', () => {
  const p = idea('sales-acidas-basicas-hidratadas').predice, ok = p.opciones.find(o => o.correcta).texto.length;
  assert.ok(p.opciones.some(o => !o.correcta && o.texto.length >= ok));
  assert.ok(!p.datos.some(d => /OH/.test(d)));
});

test('M: datos que faltaban en los ejemplos y que no regalan la respuesta (lector B)', () => {
  const ej = (i, t) => idea(i).ejemplos.find(e => e.titulo === t);
  assert.ok(ej('arbol-funciones', 'El ácido de la gaseosa').datos.some(d => /carbón-/.test(d)));
  assert.ok(ej('arbol-funciones', 'Verdadero o falso').datos.some(d => /EO del H/.test(d)));
  assert.ok(ej('sales', 'Verdadero o falso').datos.some(d => /HNO₃: ácido nítrico/.test(d)));
  assert.ok(ej('tres-nombres', 'Un polvo blanco').datos.some(d => /metal/.test(d)));
  assert.ok(ej('tres-nombres', 'Dos nombres de un óxido ácido').datos.some(d => /EO del cloro/.test(d)));
  assert.ok(ej('peroxidos-hidruros', 'El gas y el ácido').datos.some(d => /clor-/.test(d)));
  assert.ok(!ej('sales-acidas-basicas-hidratadas', 'Otro bicarbonato').datos.some(d => /hidrogenocarbonato/.test(d)));
  assert.ok(ej('estados-oxidacion', 'El combustible de los cohetes').solucion.some(p => plano(p.ecuacion || '').includes('= −2')));
});

test('B: guion pegado a su terminación (-⁠oso, -⁠ico…) y palabras que el lector no entendió', () => {
  const t = todosLosTextos().join('\n');
  assert.ok(!/(^|[^A-Za-z0-9_\-])-(oso|ico|uro|ito|ato|hídrico)\b/m.test(t), (t.match(/.{0,30}(^|[^A-Za-z0-9_\-])-(oso|ico|uro|ito|ato|hídrico)\b.{0,10}/m) || [''])[0]);
  assert.ok(!/elemento solo|costumbre|\bde el átomo|sal común|1 oxígenos/.test(t), (t.match(/.{0,30}(elemento solo|costumbre|\bde el átomo|sal común|1 oxígenos).{0,10}/) || [''])[0]);
});

test('B: la manija de las sales no tapa el último cuadrito de su fila', () => {
  const j = idea('sales').juega, PFi = require('../../../nucleo/kit/piezas/quim-fichas.js'), g = PFi.geometria({ fichas: [] });
  for (const v of casos(j === undefined ? null : idea('sales')).slice(0, 60)) for (const [a, signo, k] of [[j.arrastres[0], '+', 'nc'], [j.arrastres[1], '−', 'na']]) {
    const q = (a.id === 'cation' ? { Na: 1, Ca: 2, Al: 3 }[v.c] : { Cl: 1, S: 2, CO3: 2, SO4: 2, PO4: 3 }[v.a]) * v[k], p = a.donde(v);
    assert.ok(Math.abs(p.x - g.cuadrito(q - 1, signo).x) > 10, `${JSON.stringify(v)} ${a.id}`);
    assert.equal(a.mover(p, v)[k], v[k]);
  }
});

test('M: la fórmula del hidruro: los Datos dicen qué va primero (la alternativa «H₃Al» tiene los mismos átomos)', () => {
  for (let s = 4; s < 400; s += 5) { const c = idea('peroxidos-hidruros').ahoraTu.generar(s);
    if (/hidruro de/.test(plano(c.pregunta))) assert.ok(c.datos.some(d => /va primero/.test(d)), `semilla ${s}`); }
});

// Verificación de la pasada de redacción (26 nov, rutinas/redaccion/quimica.nomenclatura-inorganica.md): la sal sin
// paréntesis (QM-POLI) ya no pega dos subíndices («ZnClO₂₂» se leía «42»; ningún subíndice pasa de 12), y el nombre Stock de un hidróxido no trae
// en Datos la plantilla «óxido de».
test('redacción: QM-POLI sin subíndices pegados; el Stock de un hidróxido no dice «óxido de»', () => {
  let poli = 0, hid = 0;
  for (const i of def.ideas) for (let s = 0; s < 400; s++) {
    const a = i.ahoraTu.generar(s), q = plano(a.pregunta);
    for (const o of a.opciones) if (o.error === 'QM-POLI' && !/^Una parte/.test(o.texto)) { poli++; assert.ok(((o.texto).match(/[₀-₉]+/g) || []).every(x => +[...x].map(c => '₀₁₂₃₄₅₆₇₈₉'.indexOf(c)).join('') <= 12), `${i.id} ${s}: ${o.texto}`); }
    if (/Stock/.test(q) && /\(OH\)|OH\b|hidróxido/.test(q)) { hid++; assert.ok(!a.datos.some(d => /«óxido de»/.test(plano(d))), `${i.id} ${s}: ${q}`); }
  }
  for (const i of def.ideas) for (const e of i.ejemplos) if (/hidróxido|\(OH\)|NaOH/.test(e.enunciado) && /Stock/.test(e.enunciado)) { hid++; assert.ok(!(e.datos || []).some(d => /«óxido de»/.test(plano(d))), e.titulo); }
  assert.ok(poli > 20 && hid > 20, `${poli} QM-POLI, ${hid} hidróxidos`);
});
test('verificación 27 nov: la regla 1 no dice que lo cedido se gana dentro de la especie (en un ion sobra o falta: es su carga), y per- no se glosa «por encima»', () => {
  const r1 = plano(def.ideas[0].regla.texto);
  assert.ok(!/los gana otro de la misma especie/.test(r1), r1);
  assert.ok(/no se compensa es la carga/.test(r1), r1);
  const todo = JSON.stringify(def.ideas.map(i => [i.lee, i.predice, i.mira, i.regla]));
  assert.ok(!/per-?,? \(?«por encima»/i.test(todo), 'per- no significa «por encima»: marca el EO más alto');
});
