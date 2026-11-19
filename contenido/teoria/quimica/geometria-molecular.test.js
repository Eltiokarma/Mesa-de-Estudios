// Pruebas propias de «Geometría molecular y fuerzas intermoleculares» (además del validador común). Etapa 6 (19 nov):
// unidad nueva, nacida al partir «Enlace químico y fuerzas intermoleculares» (docs/etapa6/propuesta-quimica.md, B1 a B4).
//   - las cuatro ideas en el orden de la propuesta; pasaría el validador con calidad 2 (simulada); cada idea estrena sus
//     palabras; «hibridación» se define aquí y ya no en Hidrocarburos;
//   - colores: dipolo naranja, ángulo turquesa, electrones violeta, carga y temperatura carmín; sin verde;
//   - la primera pantalla es un objeto de prueba; la misión no está cumplida al abrir; el juego no muestra lo de Predice;
//   - «Ahora tú» en 400 semillas con la respuesta de tablas escritas aquí aparte (forma por enlaces y pares, sigma y pi,
//     polaridad, ebullición a 1 atm), y ninguna otra opción también correcta;
//   - toda igualdad numérica escrita cuadra; los 60 ejemplos con 5 por nivel y la letra de la alternativa esperada;
//   - las figuras de quim-enlace caben y sus rótulos no se pisan.
const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const Kit = require('../../../nucleo/kit/kit.js');
const Teoria = require('../../../nucleo/teoria.js');
const Glosario = require('../../../nucleo/glosario.js');
const E = require('../../../nucleo/ecuacion.js');
const def = require('./geometria-molecular.js');
for (const r of def.requiere) require(path.join(__dirname, '..', '..', '..', r));
const limpio = x => (Array.isArray(x) ? x.flatMap(y => (y === undefined || y === null ? [] : Array.isArray(y) ? [' ', ...limpio(y), ' '] : [y])) : x === undefined || x === null ? [] : [x]);
const sinSep = x => (Array.isArray(x) ? x.map(sinSep) : x === '   ·   ' ? ' ; ' : x);
const plano = x => E.texto(limpio(sinSep(x)));
const fichas = x => (x === null || x === undefined || typeof x !== 'object' ? [] : Array.isArray(x) ? x.flatMap(fichas)
  : typeof x.v === 'string' && /^c-/.test(x.v) ? [x] : Object.values(x).flatMap(fichas));

// ---------- Tablas escritas aparte ----------
// Enlaces y pares libres del átomo central, contados a mano.
const CENT = { 'BeCl₂': [2, 0], 'CO₂': [2, 0], HCN: [2, 0], 'BF₃': [3, 0], 'BCl₃': [3, 0], 'SO₃': [3, 0], 'CH₂O': [3, 0], 'COCl₂': [3, 0], 'SO₂': [2, 1], 'CH₄': [4, 0], 'CCl₄': [4, 0],
  'CHCl₃': [4, 0], 'CH₃Cl': [4, 0], 'NH₃': [3, 1], 'PCl₃': [3, 1], 'NF₃': [3, 1], 'H₂O': [2, 2], 'H₂S': [2, 2], 'SCl₂': [2, 2], 'PCl₅': [5, 0], 'SF₄': [4, 1], 'ClF₃': [3, 2], 'XeF₂': [2, 3],
  'SF₆': [6, 0], 'BrF₅': [5, 1], 'XeF₄': [4, 2] };
const FORMA = { '2,0': 'lineal', '3,0': 'trigonal plana', '2,1': 'angular', '4,0': 'tetraédrica', '3,1': 'piramidal trigonal', '2,2': 'angular', '5,0': 'bipirámide trigonal', '4,1': 'balancín',
  '3,2': 'forma de T', '2,3': 'lineal', '6,0': 'octaédrica', '5,1': 'pirámide cuadrada', '4,2': 'cuadrada plana' };
const HIB = { 2: 'sp', 3: 'sp²', 4: 'sp³', 5: 'sp³d', 6: 'sp³d²' };
const POLARES = new Set(['HCN', 'CH₂O', 'COCl₂', 'SO₂', 'CHCl₃', 'CH₃Cl', 'NH₃', 'PCl₃', 'NF₃', 'H₂O', 'H₂S', 'SCl₂', 'SF₄', 'ClF₃', 'BrF₅', 'CH₂Cl₂']);
const SP = { 'H₂C=CH₂': [5, 1], 'H₂C=CH–CH₃': [8, 1], 'O=C=O': [2, 2], 'H–C≡N': [2, 2], 'H₂C=O': [3, 1], 'CH₃–CH₃': [7, 0], 'N≡N': [1, 2], 'H₂C=C=CH₂': [6, 2] };
const CARB = { 'H₂C=CH–CH₃|el carbono del CH₃': 4, 'H₂C=CH–CH₃|el carbono del medio': 3, 'HC≡C–CH₃|el carbono del medio': 2, 'H₂C=C=CH₂|el carbono del medio': 2,
  'H₂C=C=CH₂|un carbono de la punta': 3, 'CH₃–C≡N|el carbono unido al N': 2, 'H₂C=O|el carbono': 3, 'CH₃–CH₃|un carbono': 4 };
const EB = { 'H₂O': 100, 'H₂S': -60, 'NH₃': -33, 'PH₃': -88, HF: 20, HCl: -85, 'CH₃OH': 65, 'CH₄': -162, 'Br₂': 59, 'Cl₂': -34, 'n-pentano': 36, neopentano: 10 };
const FZ = { 'CH₄': 'Solo London', HCl: 'Dipolo-dipolo y London', 'NH₃': 'Puente de hidrógeno, dipolo-dipolo y London', 'CO₂': 'Solo London', HF: 'Puente de hidrógeno, dipolo-dipolo y London',
  'CH₃OCH₃': 'Dipolo-dipolo y London', 'Cl₂': 'Solo London', 'CH₃OH': 'Puente de hidrógeno, dipolo-dipolo y London', 'H₂S': 'Dipolo-dipolo y London', 'CCl₄': 'Solo London' };
const PUENTE = new Set(['NH₃', 'HF', 'CH₃OH', 'H₂O₂', 'CH₃NH₂']);
const ANG = { 2: '180°', 3: '120°', 4: '109,5°', 6: '90°' };
function vfEsperado(q) {
  const VERDAD = [[/NH₃ es plano/, 'F'], [/enlace doble cuenta como una sola región/, 'V'], [/se nombra contando también los pares/, 'F'], [/CH₄ tiene ángulos de 109,5°/, 'V'],
    [/H₂O y el CO₂ tienen la misma forma/, 'F'], [/pares libres cierran/, 'V'], [/Todo enlace tiene un sigma/, 'V'], [/doble tiene dos sigma/, 'F'], [/carbono del CH₄ es sp³/, 'V'],
    [/CO₂, el carbono es sp²/, 'F'], [/eteno, H₂C=CH₂, tiene 2 electrones pi/, 'V'], [/carbono sp² tiene cuatro regiones/, 'F'], [/CO₂ es apolar aunque/, 'V'], [/Toda molécula con átomos distintos/, 'F'],
    [/CCl₄ es polar porque/, 'F'], [/El agua es polar/, 'V'], [/BF₃ es polar por tener/, 'F'], [/El NH₃ es polar/, 'V'], [/se rompen sus enlaces O–H/, 'F'], [/Toda molécula tiene fuerzas de London/, 'V'],
    [/CH₃OCH₃ forma puentes/, 'F'], [/El HF forma puentes/, 'V'], [/burbujas del agua que hierve son de hidrógeno/, 'F'], [/n-pentano hierve más alto/, 'V']];
  const partes = q.split(/\b(?:III|II|I)\. /).slice(1);
  assert.equal(partes.length, 3, q);
  return partes.map(t => { const x = VERDAD.find(([re]) => re.test(t)); assert.ok(x, `V/F sin oráculo: ${t}`); return x[1]; }).join('');
}
function esperado(a) {
  const q = plano(a.pregunta);
  let m;
  if (/^Indica verdadero/.test(q)) return vfEsperado(q);
  if ((m = q.match(/^El átomo central del (\S+) está unido a (\d) átomos y (?:no tiene pares libres|tiene (\d) par(?:es)? libres?)\. ¿Qué forma/))) {
    const n = +m[2], p = m[3] ? +m[3] : 0; assert.deepEqual(CENT[m[1]], [n, p], m[1]); return FORMA[`${n},${p}`];
  }
  if ((m = q.match(/regiones de electrones tiene el átomo central del (\S+)\?$/))) return String(CENT[m[1]][0] + CENT[m[1]][1]);
  if ((m = q.match(/ángulo más pequeño entre dos enlaces del (\S+),/))) return ANG[CENT[m[1]][0]];
  if ((m = q.match(/hibridación tiene el átomo central del (\S+), con (\d) enlaces/))) return HIB[CENT[m[1]][0] + CENT[m[1]][1]];
  if ((m = q.match(/¿Cuántos enlaces sigma \(σ\) y cuántos pi \(π\) tiene el (\S+)\?$/))) return `${SP[m[1]][0]} σ y ${SP[m[1]][1]} π`;
  if ((m = q.match(/^En el (\S+), ¿qué hibridación tiene (.+)\?$/))) return HIB[CARB[`${m[1]}|${m[2]}`]];
  if ((m = q.match(/¿Cuántos electrones pi tiene el (\S+)\?$/))) return String(2 * SP[m[1]][1]);
  if ((m = q.match(/^El (\S+) tiene forma .+ y enlaces polares\. ¿La molécula es polar\?$/))) return POLARES.has(m[1]) ? 'Polar: sus dipolos no se anulan' : 'Apolar: sus dipolos se anulan';
  if ((m = q.match(/moléculas es polar: (.+)\?$/))) { const l = m[1].split(', ').filter(x => POLARES.has(x)); assert.equal(l.length, 1, q); return l[0]; }
  if ((m = q.match(/hierve a mayor temperatura, a 1 atm: el (.+) o el (.+)\?$/))) {
    const a1 = EB[m[1]] > EB[m[2]] ? m[1] : m[2]; const c = a.opciones.find(o => o.correcta).texto; assert.ok(c.startsWith(`El ${a1}:`), q); return c;
  }
  if ((m = q.match(/^¿Qué atracciones hay entre las moléculas de (\S+)\?$/))) return FZ[m[1]];
  if ((m = q.match(/forma puentes de hidrógeno entre sus moléculas: (.+)\?$/))) { const l = m[1].split(', ').filter(x => PUENTE.has(x)); assert.equal(l.length, 1, q); return l[0]; }
  throw new Error(`caso sin oráculo: ${q}`);
}
function igualdades(texto) {
  const malas = [], num = t => t.replace(/−/g, '-').replace(/·/g, '*').replace(/÷/g, '/').replace(/(\d),(\d)/g, '$1.$2');
  for (const seg of texto.split(/;|\n|: (?=\d)|→/)) {
    const partes = seg.split('=');
    for (let k = 0; k + 1 < partes.length; k++) {
      const izq = partes[k].match(/(?:^|[^\d)\s])\s*([−-]?[\d(][\d\s.,·÷+−()\-]*)$/), der = partes[k + 1].match(/^\s*([−-]?[\d\s.,·÷+−()]*\d\)?)/);
      if (!izq || !der || !/[+−·÷]/.test(izq[1].replace(/^[−-]/, ''))) continue;
      const e = num(izq[1]).trim(); if (!/^[\d\s.+\-*/()]+$/.test(e) || /\(\s*$/.test(e)) continue;
      let val, d; try { val = Function(`return (${e})`)(); d = Function(`return (${num(der[1]).trim()})`)(); } catch (err) { continue; }
      if (Math.abs(val - d) > 0.0051) malas.push(`${izq[1].trim()} = ${der[1]} (da ${val})`);
    }
  }
  return malas;
}
function lecturas(i) {
  const out = [], add = (donde, x) => out.push({ donde, x }), j = i.juega;
  for (const [k, t] of i.lee.tarjetas.entries()) add(`lee ${k + 1}`, [t.titulo, t.texto, t.ecuacion]);
  add('consigna', j.consigna); add('misión', [j.mision.texto, j.mision.bien]); add('leyenda', j.leyenda.map(x => [x.s, x.t]));
  for (const v of Teoria.grilla(j.controles)) add(`lectura ${JSON.stringify(v)}`, j.lectura(v));
  add('predice', [i.predice.pregunta, i.predice.datos, i.predice.opciones.map(o => [o.texto, o.siFuera])]);
  for (const [k, p] of i.mira.pasos.entries()) add(`mira ${k + 1}`, [p.texto, p.ecuacion]);
  add('regla', [i.regla.texto, i.regla.ecuacion, i.regla.condicion]);
  for (const [k, e] of i.ejemplos.entries()) add(`ejemplo ${k + 1}`, [e.enunciado, e.alternativas, e.datos, e.solucion.map(x => [x.texto, x.ecuacion]), e.respuesta]);
  for (let s = 0; s < 60; s++) {
    const a = i.ahoraTu.generar(s), r = i.resuelve.generar(s);
    add(`ahora tú ${s}`, [a.pregunta, a.datos, a.opciones.map(o => [o.texto, o.siFuera]), a.solucion.texto, a.solucion.ecuacion]);
    add(`resuelve ${s}`, [r.enunciado, r.datos, r.pasos.map(x => [x.texto, x.ecuacion]), r.respuesta]);
  }
  return out;
}

test('las cuatro ideas en el orden de la propuesta; pasaría el validador con calidad 2; cada idea estrena sus palabras', () => {
  assert.deepEqual(def.ideas.map(i => i.id), ['forma-repulsion', 'hibridacion', 'forma-polaridad', 'fuerzas-intermoleculares']);
  const cat = require('../../../catalogo/cursos/quimica.json').unidades.find(u => u.id === def.unidad);
  assert.deepEqual(cat.requiere, ['quimica.enlace-quimico']);
  const p = Teoria.problemas(Object.assign({}, def, { calidad: 2 }), { temas: cat.temas, semillas: 60 });
  assert.deepEqual(p, [], p.join('\n'));
  assert.deepEqual(Glosario.porIdea(def).map(l => l.filter(g => g.simple).map(g => g.termino)), [
    ['región de electrones', 'forma molecular', 'ángulo de enlace'], ['hibridación', 'enlace sigma', 'enlace pi'], ['dipolo', 'molécula polar', 'molécula apolar'],
    ['fuerzas intermoleculares', 'puente de hidrógeno', 'fuerzas de London', 'dipolo-dipolo']]);
  const hc = require('./hidrocarburos.js');
  assert.ok(!hc.glosario.some(g => g.termino === 'hibridación'), 'la hibridación se define aquí');
});

test('colores: dipolo naranja, ángulo turquesa, electrones violeta, carga y temperatura carmín; sin verde', () => {
  assert.deepEqual(def.colores, { dipolo: 'o', angulo: 'i', e: 'f', carga: 'h', temp: 'h' });
  for (const i of def.ideas) for (const l of lecturas(i)) for (const f of fichas(l.x)) {
    assert.ok(f.m && def.colores[f.m], `${i.id}, ${l.donde}: ficha sin magnitud (${f.t})`);
    assert.equal(f.v, `c-${def.colores[f.m]}`, `${i.id}, ${l.donde}: ${f.t}`);
    assert.ok(!(f.m === 'carga' && /°C/.test(f.t)), `${i.id}, ${l.donde}`);
  }
  // La carga parcial δ y la temperatura (los dos carmín) nunca van en una misma idea.
  const usa = (i, m) => lecturas(i).some(l => fichas(l.x).some(f => f.m === m));
  for (const i of def.ideas) assert.ok(!(usa(i, 'carga') && usa(i, 'temp')), i.id);
});

test('primera pantalla con objeto; misión no cumplida al abrir; el juego no muestra lo que pregunta Predice', () => {
  const P = Kit.piezas['quim-enlace'];
  const objs = ['globos', 'soplete', 'chorro', 'olla'];
  def.ideas.forEach((i, n) => {
    const t = i.lee.tarjetas[0];
    assert.ok(P.dibujar(t.dibujo.datos).includes(`data-objeto="${objs[n]}" data-prueba="si"`), i.id);
    const j = i.juega, inicio = Object.fromEntries(j.controles.map(c => [c.id, c.inicio !== undefined ? c.inicio : c.opciones[0].valor]));
    assert.equal(j.mision.logrado(inicio), false, `${i.id}: cumplida al abrir`);
    assert.ok(Teoria.grilla(j.controles).some(v => j.mision.logrado(v)), `${i.id}: nadie la cumple`);
  });
  const [I1, I2, I3, I4] = def.ideas;
  for (const v of Teoria.grilla(I1.juega.controles)) assert.equal(I1.juega.dibujo(v).datos.pares.length, 0, 'el juego de la idea 1 no tiene pares libres');
  for (const v of Teoria.grilla(I2.juega.controles)) assert.ok(I2.juega.dibujo(v).datos.enlaces.every(e => e.orden < 3), 'sin triple en el juego de la idea 2');
  assert.ok(!I3.juega.controles[0].opciones.some(o => o.valor === 'CH2Cl2'), 'sin CH₂Cl₂ en el juego de la idea 3');
  assert.ok(!I4.juega.controles[0].opciones.some(o => /H₂S/.test(o.texto)), 'sin H₂S en el juego de la idea 4');
  assert.deepEqual(Teoria.grilla(I1.juega.controles).filter(v => I1.juega.mision.logrado(v)), [{ n: 3 }]);
});

test('Ahora tú: una correcta, la respuesta de una tabla aparte y ninguna otra también correcta (400 semillas)', () => {
  for (const i of def.ideas) for (let s = 0; s < 400; s++) {
    const a = i.ahoraTu.generar(s), donde = `${i.id} ${s}`;
    assert.ok(Array.isArray(a.datos) && a.datos.length, `${donde}: sin datos`);
    assert.ok(a.opciones.length >= 3 && a.opciones.length <= 4, `${donde}: ${a.opciones.length} opciones`);
    assert.equal(new Set(a.opciones.map(o => o.texto)).size, a.opciones.length, donde);
    const c = a.opciones.filter(o => o.correcta); assert.equal(c.length, 1, donde);
    const esp = esperado(a);
    assert.equal(c[0].texto, esp, `${donde}: ${plano(a.pregunta)}`);
    assert.equal(a.opciones.filter(o => o.texto === esp).length, 1, `${donde}: dos correctas`);
    // La predicción no se repite: ni el NH₃ en la forma, ni el acetileno, ni el CH₂Cl₂, ni el agua con el H₂S.
    const q = plano(a.pregunta);
    if (i.id === 'forma-repulsion') assert.ok(!/NH₃/.test(q), donde);
    if (i.id === 'hibridacion') assert.ok(!/HC≡CH|C₂H₂/.test(q), donde);
    if (i.id === 'forma-polaridad') assert.ok(!/CH₂Cl₂/.test(q), donde);
    if (i.id === 'fuerzas-intermoleculares') assert.ok(!(/(?:^|[\s:,])H₂O(?![₂\w])/.test(q) && /H₂S/.test(q)), donde);
  }
});

test('«Así se resuelve» no repite «Ahora tú»; toda igualdad escrita cuadra', () => {
  const malas = [];
  for (const i of def.ideas) {
    const ahora = new Set(Array.from({ length: 12 }, (_, s) => plano(i.ahoraTu.generar(s).pregunta)));
    for (let s = 0; s < 4; s++) assert.ok(!ahora.has(plano(i.resuelve.generar(s).enunciado)), `${i.id} ${s}`);
    for (const l of lecturas(i)) for (const m of igualdades(plano(l.x))) malas.push(`${i.id}, ${l.donde}: ${m}`);
  }
  assert.deepEqual(malas, []);
});

test('ejemplos: 15 por idea, 5 por nivel; en el nivel 3 la letra es la de la alternativa que se espera', () => {
  const ESPERA = {
    'Octeto expandido y pares': 'Tiene 5 regiones y forma de balancín.', 'Tres moléculas, tres formas': 'Trigonal plana, piramidal y angular', 'Un ángulo que se cierra': 'El del NH₃ es algo menor: su par libre empuja más.',
    'Dos pares en forma de T': 'Forma de T', 'forma-repulsion|Verdadero o falso': 'VFV',
    'Dos carbonos del CH₃–C≡N': 'sp³ y sp', 'Una cadena con dos dobles': '9 σ y 4 electrones pi', 'Las hibridaciones del azufre': 'sp³d², octaédrica', 'Tres carbonos seguidos': 'sp², sp y sp²',
    'hibridacion|Verdadero o falso': 'VFF', 'Polar y apolar': 'NF₃', 'La razón del CCl₄': 'Es apolar: sus cuatro dipolos se anulan en el tetraedro.',
    'Pares libres y polaridad': 'El H₂O es polar y el XeF₂, apolar.', 'forma-polaridad|Verdadero o falso': 'VFV', 'Tres moléculas, dos factores': 'Solo el CH₃Cl',
    'El agua y su vecino': 'El agua forma puentes de hidrógeno y el H₂S no.', 'Tres sustancias para ordenar': 'CH₃OH > HCl > CH₄', 'Quién forma puentes': 'NH₃',
    'Dos líquidos de la misma fórmula': 'El etanol hierve más alto: tiene un H unido a O.', 'fuerzas-intermoleculares|Verdadero o falso': 'FVF',
  };
  const letras = [];
  for (const i of def.ideas) {
    for (const n of [1, 2, 3]) assert.equal(i.ejemplos.filter(e => e.nivel === n).length, 5, `${i.id} nivel ${n}`);
    for (const e of i.ejemplos.filter(x => x.nivel === 3)) {
      const bien = ESPERA[`${i.id}|${e.titulo}`] || ESPERA[e.titulo];
      assert.ok(bien, `${i.id} «${e.titulo}»`);
      const k = e.alternativas.indexOf(bien); assert.ok(k >= 0, `${i.id} «${e.titulo}»: «${bien}»`);
      assert.equal(e.respuesta[0].negrita[0], 'ABCDE'[k], `${i.id} «${e.titulo}»`);
      letras.push('ABCDE'[k]);
    }
  }
  for (const L of 'ABCDE') assert.equal(letras.filter(x => x === L).length, 4, `letra ${L}`);
});

test('las figuras de quim-enlace caben con 4 de margen y sus rótulos no se pisan', () => {
  const P = Kit.piezas['quim-enlace'];
  const solapan = (a, b) => a.x0 < b.x1 - 0.5 && b.x0 < a.x1 - 0.5 && a.y0 < b.y1 - 0.5 && b.y0 < a.y1 - 0.5;
  for (const i of def.ideas) {
    const t = i.lee.tarjetas[0], g = P.geometria(t.dibujo.datos);
    for (const c of [...g.textos, ...g.objetos]) assert.ok(c.x0 >= g.M && c.x1 <= g.W - g.M && c.y0 >= g.M && c.y1 <= g.H - g.M, `${i.id}: se sale «${c.txt || c.que}»`);
    for (const x of g.textos) for (const o of g.objetos) assert.ok(!solapan(x, o), `${i.id}: «${x.txt}» pisa ${o.que}`);
  }
});
