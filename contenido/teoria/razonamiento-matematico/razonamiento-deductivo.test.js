// Pruebas propias de «Razonamiento deductivo» (además del validador común de contenido/teoria/teoria.test.js), para las
// cinco ideas rehechas en la etapa 3 (docs/etapa3/decisiones.md):
//   - paleta de deducción (comentario de cabecera de la unidad): un papel fijo por color en toda figura y todo texto de
//     cada idea; nada en verde ni carmín. Si un papel cambia de color, la prueba falla;
//   - ninguna figura que se ve antes de responder (Lee, Predice, ejemplos, enunciados de «Ahora tú» y «Así se resuelve»)
//     delata la respuesta: sin ✓, sin tachados, sin la persona pedida, sin el tercer aro;
//   - todo acertijo tiene una sola respuesta, comprobada aparte con un resolvedor escrito para esta prueba (no usa el
//     código de la unidad): repartos por fuerza bruta (ideas 1 y 2), dibujos de Venn contados por zonas (idea 3), casos de
//     un condicional (idea 4) y caminos en el árbol (idea 5). Los ejemplos resueltos se escriben otra vez aquí, pista por
//     pista; «Ahora tú» se lee de su texto (400 semillas);
//   - el juego, la misión y la predicción de cada idea, contados aparte; el orden de las ideas es el aprobado;
//   - las alternativas de los ejemplos tipo examen van en su propia línea (Gerson, mesa del 17 nov).
const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const Teoria = require('../../../nucleo/teoria.js');
const def = require('./razonamiento-deductivo.js');
for (const r of def.requiere) require(path.join(__dirname, '..', '..', '..', r));
const Kit = require('../../../nucleo/kit/kit.js');
const SEMILLAS = 400;
const ID = Object.fromEntries(def.ideas.map(i => [i.id, i]));
const plano = x => Teoria.plano(x);

// ---------- Utilidades del resolvedor aparte ----------
const permutaciones = xs => (xs.length <= 1 ? [xs] : xs.flatMap((x, i) => permutaciones(xs.slice(0, i).concat(xs.slice(i + 1))).map(p => [x].concat(p))));
// Repartos con varias listas: [{ persona: [item de la lista 0, item de la lista 1, …] }].
function repartos(personas, listas) {
  let out = [Object.fromEntries(personas.map(p => [p, []]))];
  for (const items of listas) out = out.flatMap(r => permutaciones(items).map(pm => Object.fromEntries(personas.map((p, i) => [p, r[p].concat([pm[i]])]))));
  return out;
}
const de = (r, L, item) => Object.keys(r).find(p => r[p][L] === item);   // quién tiene el item de la lista L
const unico = (rs, f) => { const vs = new Set(rs.map(f)); return vs.size === 1 ? [...vs][0] : undefined; };
const colores = (x, acc = []) => { if (Array.isArray(x)) x.forEach(y => colores(y, acc)); else if (x && typeof x === 'object') { if (typeof x.v === 'string' && /^c-/.test(x.v)) acc.push(x); for (const [k, y] of Object.entries(x)) if (k !== 'v' && typeof y !== 'function') colores(y, acc); } return acc; };

// ---------- Todas las figuras y todos los textos de cada idea ----------
function figurasDe(idea, semillas = SEMILLAS) {
  const out = [], p = idea.pieza;
  const add = (donde, pieza, dib, antes) => { if (dib && dib.datos) out.push({ donde, pieza: dib.pieza || pieza, datos: dib.datos, estado: dib.estado || {}, antes: !!antes }); };
  for (const [i, t] of idea.lee.tarjetas.entries()) add(`lee ${i + 1}`, t.pieza || p, t.dibujo, true);
  for (const v of Teoria.grilla(idea.juega.controles)) add(`juega ${JSON.stringify(v)}`, idea.juega.pieza || p, idea.juega.dibujo(v));
  add('predice', p, idea.predice.dibujo, true);
  add('revelar', p, idea.predice.revelar);
  for (const [i, x] of idea.mira.pasos.entries()) add(`mira ${i + 1}`, idea.mira.pieza || p, { datos: idea.mira.datos, estado: x.estado });
  for (const [i, e] of idea.ejemplos.entries()) if (e.figura) add(`ejemplo ${i + 1}`, e.figura.pieza, e.figura, true);
  for (let s = 0; s < semillas; s++) {
    const a = idea.ahoraTu.generar(s), r = idea.resuelve.generar(s);
    add(`ahora tú ${s}`, idea.ahoraTu.pieza || p, a.dibujo, true);
    add(`ahora tú ${s} solución`, idea.ahoraTu.pieza || p, a.solucion.dibujo);
    add(`resuelve ${s}`, idea.resuelve.pieza || p, r.dibujo, true);
    for (const [k, x] of r.pasos.entries()) add(`resuelve ${s} paso ${k + 1}`, idea.resuelve.pieza || p, x.dibujo);
  }
  for (const m of def.laboratorio.filter(x => (def.laboratorioIdeas[x.id] || []).includes(idea.id))) {
    const casos = Teoria.grilla(m.controles);
    for (let i = 0; i < casos.length; i += Math.max(1, Math.floor(casos.length / 300))) add(`mesa ${m.id} ${i}`, m.pieza, m.dibujo(casos[i]));
  }
  return out;
}
function textosDe(idea, semillas = SEMILLAS) {
  const t = [idea.lee, idea.juega.mision, idea.juega.leyenda, idea.predice, idea.mira.pasos, idea.regla, idea.ejemplos];
  for (const v of Teoria.grilla(idea.juega.controles)) t.push(idea.juega.lectura(v));
  for (let s = 0; s < semillas; s++) t.push(idea.ahoraTu.generar(s), idea.resuelve.generar(s));
  return t;
}
const FIG = Object.fromEntries(def.ideas.map(i => [i.id, figurasDe(i)]));
const svgDe = f => Kit.piezas[f.pieza].dibujar(f.datos, f.estado);

test('el orden de las ideas es el aprobado, los ids no cambian y la unidad pasó el contrato (calidad 2)', () => {
  assert.deepEqual(def.ideas.map(i => i.id), ['doble-entrada', 'dos-atributos', 'conclusion-necesaria', 'si-entonces', 'parentesco']);
  assert.equal(def.calidad, 2);
  for (const m of ['pistas-a-eleccion', 'marca-tu-cuadro', 'venn-libre', 'cualquier-pariente']) assert.ok(def.laboratorio.some(x => x.id === m), m);
  assert.deepEqual(Teoria.problemas(def), []);
});

test('cada idea dibuja con su pieza (el reparto con rm-objeto, los aros con rm-aros, los casos con rm-casos, el árbol con rm-familia)', () => {
  const piezas = { 'doble-entrada': ['rm-objeto'], 'dos-atributos': ['rm-objeto'], 'conclusion-necesaria': ['rm-aros'], 'si-entonces': ['rm-casos', 'rm-objeto'], parentesco: ['rm-familia'] };
  for (const [id, fs] of Object.entries(FIG)) {
    assert.ok(fs.length > 200, `${id}: ${fs.length}`);
    for (const f of fs) assert.ok(piezas[id].includes(f.pieza), `${id} ${f.donde}: ${f.pieza}`);
  }
  // La primera pantalla de cada idea es un objeto reconocible, marcado como dibujo de prueba.
  for (const i of def.ideas) assert.match(svgDe(FIG[i.id][0]), /data-objeto="[a-z]+" data-prueba="si"/, i.id);
});

// ---------- Paleta de deducción ----------
test('las piezas fijan los papeles de color', () => {
  assert.deepEqual(Kit.piezas['rm-objeto'].PAPELES, { seguro: 'f', descartado: 'tenue', amarra: 'tinta', nueva: 'tinta' });
  assert.deepEqual(Kit.piezas['rm-aros'].PAPELES, { primero: 'o', segundo: 'i', medio: 'tinta', noCumple: 'tenue' });
  assert.deepEqual(Kit.piezas['rm-casos'].PAPELES, { primero: 'o', segundo: 'i', tercero: 'tinta', seguro: 'f', descartado: 'tenue' });
  assert.deepEqual(Kit.piezas['rm-familia'].PAPELES, { habla: 'o', pedida: 'f', camino: 'tinta' });
});

test('paleta en las figuras: cada color solo en su papel, y nunca verde ni carmín', () => {
  const textoCon = (s, c) => [...s.matchAll(new RegExp(`<text[^>]*fill="var\\(--c-${c}\\)"[^>]*>([^<]*)<`, 'g'))].map(m => m[1].replace(/&amp;/g, '&'));
  for (const [id, fs] of Object.entries(FIG)) for (const f of fs) {
    const s = svgDe(f), d = f.datos, donde = `${id} ${f.donde}`;
    assert.ok(!/var\(--c-[dh]\)/.test(s), `${donde}: verde o carmín`);
    if (f.pieza === 'rm-objeto') {
      assert.ok(!/var\(--c-[oi]\)/.test(s), `${donde}: el cuadro solo usa violeta`);
      for (const [m] of s.matchAll(/<g data-marca="no"[^>]*>/g)) assert.match(m, /opacity="0.55"/, donde);
    } else if (f.pieza === 'rm-aros') {
      const aros = (d.aros || []).concat(...(d.diagramas || []).map(x => x.aros));
      const nom = papel => new Set(aros.filter(a => a.papel === papel).map(a => a.nombre));
      for (const t of textoCon(s, 'o')) assert.ok(nom('primero').has(t), `${donde}: «${t}» en naranja`);
      for (const t of textoCon(s, 'i')) assert.ok(nom('segundo').has(t), `${donde}: «${t}» en turquesa`);
      for (const [m] of s.matchAll(/<(?:ellipse|circle)[^>]*stroke="var\(--c-(o|i)\)"[^>]*>/g)) assert.match(m, new RegExp(`data-aro="${m.includes('--c-o') ? 'primero' : 'segundo'}"`), donde);
      assert.ok(!/var\(--c-f\)/.test(s), `${donde}: violeta en un aro`);
    } else if (f.pieza === 'rm-casos') {
      const vars = (d.tablas || []).flatMap(t => t.vars), val = papel => new Set(vars.filter(v => v.papel === papel).flatMap(v => [v.t, v.si, v.no]));
      const ok = { o: new Set([...val('primero'), 'llueve', 'no llueve']), i: new Set([...val('segundo'), 'pista mojada', 'pista seca']) };
      for (const c of ['o', 'i']) for (const t of textoCon(s, c)) assert.ok(ok[c].has(t), `${donde}: «${t}» en ${c}`);
      for (const [m] of s.matchAll(/<(?:line|ellipse)[^>]*(?:stroke|fill)="var\(--c-(?:o|i)\)"[^>]*>/g)) assert.match(m, /data-(gota|charco)="si"/, donde);
      const violetas = (s.match(/var\(--c-f\)/g) || []).length, seguras = (s.match(/data-marca="(si|fila-segura)"/g) || []).length;
      assert.equal(violetas, seguras, `${donde}: violeta fuera del caso que queda`);
    } else {
      const nombre = x => (d.personas.find(p => p.id === x) || {}).nombre;
      for (const t of textoCon(s, 'o')) assert.equal(t, nombre(d.habla), `${donde}: «${t}» en naranja`);
      const ped = d.pedida && typeof d.pedida === 'object' ? d.pedida.id : d.pedida;
      for (const t of textoCon(s, 'f')) { const p = d.personas.find(x => x.id === ped); assert.equal(t, p.incognita ? '?' : p.nombre, `${donde}: «${t}» en violeta`); }
      for (const [m] of s.matchAll(/<rect[^>]*stroke="var\(--c-(o|f)\)"[^>]*>/g)) assert.match(m, /data-papel="(habla|pedida)"/, donde);
    }
  }
});

test('paleta en los textos: violeta en el cuadro; naranja y turquesa solo para lo primero y lo segundo de cada idea', () => {
  const papel = {
    'doble-entrada': { 'c-f': null }, 'dos-atributos': { 'c-f': null },
    'conclusion-necesaria': { 'c-o': ['A', 'quenista', 'quenistas'], 'c-i': ['diablada'], 'c-f': null },
    'si-entonces': { 'c-o': ['p', 'llueve'], 'c-i': ['q', 'mojada'], 'c-f': null },
    parentesco: { 'c-o': ['Ana'], 'c-f': null },
  };
  for (const i of def.ideas) for (const c of colores(textosDe(i, 60))) {
    assert.ok(c.v in papel[i.id], `${i.id}: «${c.t}» en ${c.v}`);
    if (papel[i.id][c.v]) assert.ok(papel[i.id][c.v].includes(c.t), `${i.id}: «${c.t}» en ${c.v}`);
  }
});

test('ninguna figura de antes de responder delata la respuesta', () => {
  for (const [id, fs] of Object.entries(FIG)) for (const f of fs.filter(x => x.antes)) {
    const s = svgDe(f), donde = `${id} ${f.donde}`;
    assert.ok(!/var\(--c-f\)|data-marca="si"|data-marca="fila-segura"|data-reparto="fuera"|data-papel="pedida"/.test(s), donde);
    assert.ok(!(f.datos.manos || []).length, `${donde}: una cosa en la mano`);
    // Los ejemplos y los enunciados van sin ninguna marca ni caso tachado: el planteamiento, no la respuesta.
    if (/^(ejemplo|ahora tú \d+$|resuelve \d+$)/.test(f.donde)) assert.ok(!/data-marca|data-fila="fuera"/.test(s), donde);
  }
  // Idea 3: la figura de un ejemplo o de un enunciado dibuja solo la primera premisa (dos aros como mucho).
  for (const f of FIG['conclusion-necesaria'].filter(x => x.antes && /^(ejemplo|resuelve)/.test(x.donde))) assert.ok(f.datos.diagramas.every(d => d.aros.length <= 2), f.donde);
  // Idea 5: la persona pedida va como «?» o no va.
  for (const f of FIG.parentesco.filter(x => x.antes)) assert.ok(!f.datos.pedida, f.donde);
});

// ---------- Alternativas de los ejemplos tipo examen ----------
test('ejemplos: 5 por nivel; los de nivel 3 traen sus alternativas en línea aparte, y la letra de la respuesta en violeta', () => {
  for (const i of def.ideas) {
    assert.deepEqual([1, 2, 3].map(n => i.ejemplos.filter(e => e.nivel === n).length), [5, 5, 5], i.id);
    for (const e of i.ejemplos) {
      assert.ok(!/\b[A-E]\) /.test(plano(e.enunciado)), `${i.id} «${e.titulo}»: alternativas pegadas al enunciado`);
      assert.ok(colores(e.respuesta).some(c => c.v === 'c-f'), `${i.id} «${e.titulo}»: respuesta sin color`);
      if (e.alternativas) {
        assert.equal(e.alternativas.length, 5, e.titulo);
        assert.match(JSON.stringify(e.respuesta[0]), /^\{"v":"c-f","t":"[A-E]"\}$/, `${e.titulo}: la letra va sola, en violeta`);
      }
    }
    // Los cuadros (ideas 1 y 2) y el examen de las demás: los 5 de nivel 3 traen alternativas.
    assert.equal(i.ejemplos.filter(e => e.nivel === 3 && e.alternativas).length, 5, i.id);
  }
});
const letra = e => e.respuesta[0].t, elegida = e => e.alternativas['ABCDE'.indexOf(letra(e))];

// ---------- Ideas 1 y 2: los ejemplos, escritos otra vez y resueltos por fuerza bruta ----------
// Cada uno: personas, listas, pistas como funciones de un reparto, y qué se pregunta (q) con lo que debe salir.
const NO = (p, L, x) => r => r[p][L] !== x, SI = (p, L, x) => r => r[p][L] === x;
const MISMO = (L1, a, L2, b) => r => de(r, L1, a) === de(r, L2, b), DISTINTO = (L1, a, L2, b) => r => de(r, L1, a) !== de(r, L2, b);
const DEP = ['fútbol', 'vóley', 'ajedrez'], TAL = ['danza', 'teatro', 'dibujo'], KER = ['picarones', 'emoliente', 'choclo'], COM = ['adornos', 'música', 'juegos'];
const EJ1 = [
  { ps: ['Ana', 'Beto', 'Ciro'], ls: [DEP], c: [NO('Beto', 0, 'fútbol'), NO('Beto', 0, 'ajedrez')], q: rs => unico(rs, r => r.Beto[0]), sale: 'vóley' },
  { ps: ['Rosa', 'Iván', 'Nora'], ls: [TAL], c: [NO('Rosa', 0, 'teatro'), NO('Nora', 0, 'teatro')], q: rs => unico(rs, r => de(r, 0, 'teatro')), sale: 'Iván' },
  { ps: ['Lucho', 'Maru', 'Teo'], ls: [KER], c: [SI('Maru', 0, 'emoliente')], q: rs => ['Lucho', 'Maru', 'Teo'].flatMap(p => KER.filter(x => !rs.some(r => r[p][0] === x))).length, sale: 4 },
  { ps: ['Ana', 'Beto', 'Ciro'], ls: [DEP], c: [NO('Ciro', 0, 'vóley')], q: rs => rs.length, sale: 4 },
  { ps: ['Sara', 'Gino', 'Pía'], ls: [COM], c: [NO('Sara', 0, 'música'), NO('Sara', 0, 'juegos')], q: rs => (rs.every(r => r.Gino[0] === 'música') ? 'Es seguro' : 'No es seguro'), sale: 'No es seguro' },
  { ps: ['Ana', 'Beto', 'Ciro'], ls: [DEP], c: [NO('Ana', 0, 'fútbol'), NO('Beto', 0, 'fútbol'), NO('Beto', 0, 'vóley')], q: rs => (rs.length === 1 ? `Ana ${rs[0].Ana[0]}, Beto ${rs[0].Beto[0]}, Ciro ${rs[0].Ciro[0]}` : null), sale: 'Ana vóley, Beto ajedrez, Ciro fútbol' },
  { ps: ['Rosa', 'Iván', 'Nora'], ls: [TAL], c: [NO('Iván', 0, 'dibujo'), NO('Nora', 0, 'dibujo'), NO('Iván', 0, 'teatro')], q: rs => unico(rs, r => r.Nora[0]), sale: 'teatro' },
  { ps: ['Ana', 'Beto', 'Ciro', 'Dina'], ls: [['fútbol', 'vóley', 'ajedrez', 'básquet']], c: [SI('Dina', 0, 'básquet'), NO('Ana', 0, 'vóley'), NO('Ana', 0, 'ajedrez')],
    q: rs => ['Ana', 'Beto', 'Ciro', 'Dina'].filter(p => unico(rs, r => r[p][0])).map(p => `${p} ${rs[0][p][0]}`).join(', '), sale: 'Ana fútbol, Dina básquet' },
  { ps: ['Lucho', 'Maru', 'Teo'], ls: [KER], c: [NO('Lucho', 0, 'emoliente'), NO('Teo', 0, 'emoliente'), NO('Teo', 0, 'picarones')], q: rs => unico(rs, r => r.Lucho[0]), sale: 'picarones' },
  { ps: ['Rosa', 'Iván', 'Nora', 'Leo'], ls: [['danza', 'teatro', 'dibujo', 'banda']], c: [NO('Rosa', 0, 'teatro'), NO('Iván', 0, 'teatro'), SI('Leo', 0, 'banda'), NO('Rosa', 0, 'danza')], q: rs => unico(rs, r => de(r, 0, 'teatro')), sale: 'Nora' },
  { ps: ['Carla', 'Delia', 'Elsa', 'Flor'], ls: [['médica', 'obstetra', 'dentista', 'técnica']], c: [NO('Carla', 0, 'médica'), NO('Delia', 0, 'médica'), NO('Delia', 0, 'dentista'), NO('Delia', 0, 'obstetra'), NO('Carla', 0, 'dentista'), NO('Elsa', 0, 'dentista')],
    q: rs => unico(rs, r => r.Carla[0]), sale: 'obstetra' },
  { ps: ['Raúl', 'Saúl', 'Tito', 'Uriel'], ls: [['Gaby', 'Hilda', 'Inés', 'Julia']], c: [NO('Raúl', 0, 'Gaby'), NO('Saúl', 0, 'Gaby'), NO('Raúl', 0, 'Inés'), NO('Saúl', 0, 'Inés'), r => ['Saúl', 'Tito'].includes(de(r, 0, 'Hilda')), NO('Tito', 0, 'Gaby')],
    q: rs => unico(rs, r => de(r, 0, 'Julia')), sale: 'Raúl' },
  { ps: ['Ana', 'Beto', 'Ciro', 'Dina'], ls: [['fútbol', 'vóley', 'básquet', 'ajedrez']], c: [NO('Ana', 0, 'vóley'), NO('Beto', 0, 'ajedrez'), NO('Dina', 0, 'ajedrez'), NO('Ciro', 0, 'fútbol'), NO('Ciro', 0, 'básquet'), NO('Beto', 0, 'fútbol'), NO('Dina', 0, 'fútbol')],
    q: rs => unico(rs, r => r.Ciro[0]), sale: 'ajedrez' },
  { ps: ['Lucho', 'Maru', 'Teo', 'Vilma'], ls: [['tamales', 'jugos', 'choclo', 'queso']], c: [NO('Lucho', 0, 'jugos'), NO('Teo', 0, 'jugos'), NO('Maru', 0, 'jugos'), NO('Maru', 0, 'queso'), NO('Lucho', 0, 'choclo'), NO('Teo', 0, 'choclo'), NO('Lucho', 0, 'tamales')],
    q: rs => unico(rs, r => r.Maru[0]), sale: 'choclo' },
  { ps: ['Sara', 'Gino', 'Pía', 'Omar'], ls: [['adornos', 'música', 'juegos', 'limpieza']], c: [r => ['juegos', 'limpieza'].includes(r.Sara[0]), r => ['juegos', 'limpieza'].includes(r.Gino[0]), NO('Omar', 0, 'música')],
    q: rs => unico(rs, r => de(r, 0, 'música')), sale: 'Pía' },
];
const LI = ['quena', 'charango', 'bombo'], LC = ['Puno', 'Juliaca', 'Ilave'], P3 = ['Ana', 'Beto', 'Ciro'], RIN = ['Rosa', 'Iván', 'Nora'];
const EJ2 = [
  { ps: P3, ls: [LI, LC], c: [MISMO(0, 'charango', 1, 'Juliaca')], q: rs => rs.every(r => de(r, 0, 'charango') === de(r, 1, 'Juliaca')), sale: true },
  { ps: RIN, ls: [LI, LC], c: [SI('Rosa', 1, 'Puno'), MISMO(1, 'Puno', 0, 'quena')], q: rs => unico(rs, r => r.Rosa[0]), sale: 'quena' },
  { ps: RIN, ls: [LI, LC], c: [SI('Iván', 0, 'bombo'), DISTINTO(0, 'bombo', 1, 'Ilave')], q: rs => rs.some(r => r.Iván[1] === 'Ilave'), sale: false },
  { ps: P3, ls: [LI, LC], c: [], q: rs => rs.length, sale: 36 },
  { ps: P3, ls: [LI, LC], c: [MISMO(0, 'charango', 1, 'Juliaca'), NO('Ana', 0, 'charango')], q: rs => rs.every(r => r.Ana[1] !== 'Juliaca'), sale: true },
  { ps: ['Lucho', 'Maru', 'Teo'], ls: [['tamales', 'jugos', 'choclo'], ['rojo', 'azul', 'blanco']], c: [SI('Maru', 1, 'azul'), MISMO(0, 'jugos', 1, 'rojo'), NO('Maru', 0, 'tamales')], q: rs => unico(rs, r => r.Maru[0]), sale: 'choclo' },
  { ps: P3, ls: [LI, LC], c: [SI('Ciro', 0, 'bombo'), SI('Ana', 1, 'Puno'), NO('Beto', 1, 'Ilave')], q: rs => unico(rs, r => r[de(r, 0, 'bombo')][1]), sale: 'Ilave' },
  { ps: ['Dina', 'Eva', 'Fito'], ls: [['fútbol', 'vóley', 'ajedrez'], ['5', '7', '9']], c: [MISMO(0, 'vóley', 1, '7'), SI('Eva', 1, '5'), NO('Fito', 0, 'vóley')], q: rs => unico(rs, r => r.Dina[0]), sale: 'vóley' },
  { ps: ['Gaby', 'Hugo', 'Inés'], ls: [LI, ['15', '16', '17']], c: [DISTINTO(0, 'quena', 1, '15'), DISTINTO(0, 'charango', 1, '15'), SI('Hugo', 1, '15')], q: rs => unico(rs, r => r.Hugo[0]), sale: 'bombo' },
  { ps: ['Ana', 'Beto', 'Ciro', 'Dina'], ls: [['fútbol', 'vóley', 'básquet', 'ajedrez'], ['5', '7', '9', '10']], c: [SI('Ana', 1, '10'), r => !['fútbol', 'vóley'].includes(r[de(r, 1, '10')][0]), SI('Beto', 0, 'ajedrez')], q: rs => unico(rs, r => r.Ana[0]), sale: 'básquet' },
  { ps: ['Ana', 'Beto', 'Ciro', 'Dina'], ls: [['quena', 'charango', 'bombo', 'zampoña'], ['Puno', 'Juliaca', 'Ilave', 'Ayaviri']], c: [MISMO(0, 'zampoña', 1, 'Juliaca'), NO('Ana', 0, 'zampoña'), SI('Ciro', 0, 'charango'), SI('Beto', 1, 'Puno')],
    q: rs => unico(rs, r => de(r, 1, 'Juliaca')), sale: 'Dina' },
  { ps: ['Gaby', 'Hugo', 'Inés'], ls: [LI, LC, ['15', '16', '17']], c: [MISMO(0, 'quena', 1, 'Ilave'), DISTINTO(1, 'Ilave', 2, '15'), SI('Gaby', 2, '16'), NO('Gaby', 0, 'quena')],
    q: rs => unico(rs, r => r[de(r, 0, 'quena')][2]), sale: '17' },
  { ps: ['Lucho', 'Maru', 'Teo', 'Vilma'], ls: [['tamales', 'jugos', 'choclo', 'queso'], ['rojo', 'azul', 'blanco', 'negro']], c: [MISMO(0, 'jugos', 1, 'azul'), SI('Maru', 1, 'rojo'), SI('Teo', 0, 'queso'), DISTINTO(1, 'negro', 0, 'tamales'), NO('Lucho', 1, 'azul')],
    q: rs => ['Lucho vende choclo', 'Teo usa mandil negro', 'Vilma usa mandil azul', 'Maru vende tamales', 'Lucho usa mandil negro'].filter(t => { const [p, v, ...x] = t.split(' '), it = x[x.length - 1]; return rs.every(r => r[p][v === 'vende' ? 0 : 1] === it); }).join(), sale: 'Vilma usa mandil azul' },
  { ps: ['Ana', 'Beto', 'Ciro'], ls: [[2, 3, 5], ['rojo', 'azul', 'blanco']], c: [r => r[de(r, 1, 'rojo')][0] % 2 === 0, r => r.Ciro[0] % 2 === 0, r => r.Beto[0] > r.Ana[0], NO('Ana', 1, 'azul')], q: rs => String(unico(rs, r => r[de(r, 1, 'azul')][0])), sale: '5' },
  { ps: ['Rosa', 'Nora', 'Lía'], ls: [[10, 20, 50], ['pan', 'fruta', 'leche']], c: [r => r[de(r, 1, 'pan')][0] === 10, NO('Nora', 0, 10), r => r.Lía[0] > r.Rosa[0], r => r[de(r, 1, 'leche')][0] !== 50], q: rs => unico(rs, r => r.Rosa[1]), sale: 'pan' },
];

test('ejemplos de las ideas 1 y 2: cada acertijo tiene la respuesta que dice el resuelto (fuerza bruta aparte)', () => {
  for (const [id, EJ] of [['doble-entrada', EJ1], ['dos-atributos', EJ2]]) EJ.forEach((x, k) => {
    const e = ID[id].ejemplos[k], rs = repartos(x.ps, x.ls).filter(r => x.c.every(f => f(r)));
    assert.ok(rs.length >= 1, `${id} ejemplo ${k + 1}: ningún reparto`);
    assert.deepEqual(x.q(rs), x.sale, `${id} ejemplo ${k + 1} «${e.titulo}»`);
    // Las personas de la figura son las del enunciado, y la respuesta dice lo que salió.
    const resp = plano(e.respuesta).toLowerCase();
    if (typeof x.sale === 'string' && !e.alternativas) assert.ok(x.sale.split(', ').every(t => resp.includes(t.toLowerCase())), `${id} ejemplo ${k + 1}: «${resp}»`);
    if (e.alternativas) {
      // La alternativa elegida es la única que cumple; las demás no salen en todos los repartos.
      const ok = elegida(e).toLowerCase();
      assert.ok(String(x.sale).split(', ').some(t => ok.includes(String(t).toLowerCase())), `${id} ejemplo ${k + 1}: ${letra(e)} es «${elegida(e)}», salió ${x.sale}`);
      for (const [j, a] of e.alternativas.entries()) if ('ABCDE'[j] !== letra(e)) assert.ok(a.toLowerCase() !== String(x.sale).toLowerCase(), `${id} ejemplo ${k + 1}: «${a}»`);
    }
  });
});

// ---------- Idea 2: «Ahora tú» y «Así se resuelve» leídos de su texto ----------
const VERBOS = ['lleva el número', 'usa mandil', 'vive en', 'toca', 'tiene', 'vende', 'juega'];
const PREG = { '¿Qué toca': 'toca', '¿Dónde vive': 'vive en', '¿Cuántos años tiene': 'tiene', '¿Qué vende': 'vende', '¿De qué color es el mandil de': 'usa mandil', '¿Qué juega': 'juega', '¿Qué número lleva': 'lleva el número' };
const RE_V = `(${VERBOS.join('|')})`;
function leer2(enunciado, datos) {
  const t = plano(enunciado), m = t.match(/^(.+?) (?:tocan|atienden|compiten)[^.]*\. Cada uno (.+?)\. (¿.*)$/);
  assert.ok(m, `no leo: ${t}`);
  const personas = m[1].split(/, | y /), listas = m[2].split(/; |, y /).map(seg => {
    const v = VERBOS.find(x => seg.startsWith(x + ' '));
    return { v, items: seg.slice(v.length + 1).replace(/ años$/, '').split(/, | o /) };
  });
  const L = v => listas.findIndex(x => x.v === v), it = s => s.replace(/ años$/, '');
  const reglas = [];
  for (const l of datos.filter(x => /^Pista \d+: /.test(x)).map(x => x.replace(/^Pista \d+: /, '').replace(/\.$/, ''))) {
    let r;
    if ((r = l.match(new RegExp(`^Quien ${RE_V} (.+?) (no )?${RE_V} (.+)$`)))) { const [, v1, a, no, v2, b] = r; reglas.push(x => (de(x, L(v1), it(a)) === de(x, L(v2), it(b))) === !no); }
    else if ((r = l.match(new RegExp(`^(\\S+) (?:conversa|almuerza|estudia|viaja) con quien ${RE_V} (.+)$`)))) { const [, p, v, a] = r; reglas.push(x => x[p][L(v)] !== it(a)); }
    else if ((r = l.match(new RegExp(`^(\\S+) no ${RE_V} (.+?) ni (?:en )?(?:${RE_V} )?(.+)$`)))) { const [, p, v1, a, v2, b] = r; reglas.push(x => x[p][L(v1)] !== it(a) && x[p][L(v2 || v1)] !== it(b)); }
    else if ((r = l.match(new RegExp(`^(\\S+) (no )?${RE_V} (.+)$`)))) { const [, p, no, v, a] = r; reglas.push(x => (x[p][L(v)] === it(a)) === !no); }
    else assert.fail(`no leo la pista «${l}»`);
  }
  const rs = repartos(personas, listas.map(x => x.items)).filter(x => reglas.every(f => f(x)));
  // «X v a» o «Quien v a v2 b»: cuántos repartos la cumplen.
  const vale = texto => {
    let r;
    if ((r = texto.match(new RegExp(`^Quien ${RE_V} (.+?) ${RE_V} (.+)$`)))) return rs.filter(x => de(x, L(r[1]), it(r[2])) === de(x, L(r[3]), it(r[4]))).length;
    r = texto.match(new RegExp(`^(\\S+) ${RE_V} (.+)$`));
    assert.ok(r, `no leo «${texto}»`);
    return rs.filter(x => x[r[1]][L(r[2])] === it(r[3])).length;
  };
  return { personas, listas, pregunta: m[3], rs, L, it, vale };
}
function respuesta2(L, pregunta) {
  const [, preg, sujeto] = pregunta.match(/^(¿.+?) (\S+|quien .+)\?$/).slice(0, 3);
  const k = Object.keys(PREG).find(x => pregunta.startsWith(x + ' '));
  const sujetoT = pregunta.slice(k.length + 1, -1), Lq = L.L(PREG[k]);
  void preg; void sujeto;
  let r;
  if ((r = sujetoT.match(new RegExp(`^quien ${RE_V} (.+)$`)))) return unico(L.rs, x => x[de(x, L.L(r[1]), L.it(r[2]))][Lq]);
  return unico(L.rs, x => x[sujetoT][Lq]);
}

test('idea 2, «Ahora tú»: la correcta es la única que vale (400 semillas, leídas del texto)', () => {
  const tipos = new Set();
  for (let s = 0; s < SEMILLAS; s++) {
    const c = ID['dos-atributos'].ahoraTu.generar(s), L = leer2(c.pregunta, c.datos), ops = c.opciones;
    assert.equal(ops.filter(o => o.correcta).length, 1, `semilla ${s}`);
    assert.ok(L.rs.length >= 1, `semilla ${s}: ningún reparto`);
    assert.ok(c.datos.some(x => /^Pista \d+: Quien /.test(x)), `semilla ${s}: sin pista que cruce dos listas`);
    if (/necesariamente verdadera/.test(L.pregunta)) {
      tipos.add('necesaria');
      for (const o of ops) assert.equal(L.vale(o.texto) === L.rs.length, !!o.correcta, `semilla ${s}: «${o.texto}»`);
    } else {
      tipos.add(L.listas.length === 3 ? 'tres listas' : / quien /.test(L.pregunta) ? 'sin nombre' : 'persona');
      const v = respuesta2(L, L.pregunta);
      assert.ok(v !== undefined, `semilla ${s}: ${L.pregunta} no queda decidida`);
      assert.equal(L.it(ops.find(o => o.correcta).texto).toLowerCase(), String(v).toLowerCase(), `semilla ${s}`);
      // Sin las pistas que no nombran a nadie, no se sabría (la pista cruzada hace falta).
    }
  }
  assert.deepEqual([...tipos].sort(), ['necesaria', 'persona', 'sin nombre', 'tres listas']);
});

test('idea 2, «Así se resuelve»: un solo reparto, con una pista que cruza, y la respuesta lo dice', () => {
  for (let s = 0; s < 100; s++) {
    const r = ID['dos-atributos'].resuelve.generar(s), L = leer2(r.enunciado, r.datos);
    assert.equal(L.rs.length, 1, `semilla ${s}`);
    const txt = plano(r.respuesta);
    for (const [p, v] of Object.entries(L.rs[0])) assert.ok(txt.includes(`${p}: ${v.map((x, i) => (L.listas[i].v === 'tiene' ? `${x} años` : x)).join(', ')}`), `semilla ${s}: ${txt}`);
    assert.notEqual(plano(r.enunciado), plano(ID['dos-atributos'].ahoraTu.generar(s).pregunta));
  }
});

test('idea 2: juego, misión y predicción contados aparte (36 → 12 → 4 → 2 → 1)', () => {
  const I = ID['dos-atributos'], todos = repartos(P3, [LI, LC]);
  const J = [SI('Beto', 1, 'Ilave'), MISMO(0, 'charango', 1, 'Juliaca'), NO('Beto', 0, 'quena'), NO('Ana', 1, 'Juliaca')];
  const q = n => todos.filter(r => J.slice(0, n).every(f => f(r)));
  assert.deepEqual([0, 1, 2, 3, 4].map(n => q(n).length), [36, 12, 4, 2, 1]);
  const sabeBeto = n => unico(q(n), r => r.Beto[0]) !== undefined;
  assert.deepEqual([0, 1, 2, 3].map(n => I.juega.mision.logrado({ n })), [0, 1, 2, 3].map(n => sabeBeto(n) && !sabeBeto(n - 1)));
  // Con la pista 2 (sin nombre), Beto pierde el charango; con la 1 sola, no.
  assert.ok(q(2).every(r => r.Beto[0] !== 'charango') && q(1).some(r => r.Beto[0] === 'charango'));
  assert.match(plano(I.juega.lectura({ n: 2 })), /Beto no toca charango/);
  assert.match(plano(I.juega.lectura({ n: 3 })), new RegExp(`Beto toca ${unico(q(3), r => r.Beto[0])}`));
  for (const n of [0, 1, 2, 3]) assert.match(I.juega.dibujo({ n }).datos.nota, new RegExp(`Quedan ${q(n).length} de 36|${q(n).length} repartos posibles`));
  assert.equal(I.predice.opciones.find(o => o.correcta).texto.toLowerCase(), unico(q(4), r => r.Ana[0]));
  // La pista nueva del juego se marca en el cuadro que nombra: la 2, en el de ciudades e instrumentos.
  const nueva = Object.entries(I.juega.dibujo({ n: 2 }).datos.marcas).filter(([, x]) => x.nueva).map(([k]) => k);
  assert.deepEqual(nueva, ['1:1|0:1']);
});

// ---------- Idea 3: dibujos de Venn contados por zonas ----------
function modelos(n, premisas) {
  const zonas = Array.from({ length: (1 << n) - 1 }, (_, i) => i + 1), out = [];
  for (let b = 0; b < 1 << zonas.length; b++) {
    const on = zonas.filter((_, i) => (b >> i) & 1);
    if ([...Array(n).keys()].every(g => on.some(z => (z >> g) & 1)) && premisas.every(p => p(on))) out.push(on);
  }
  return out;
}
const en = (z, g) => (z >> g) & 1;
const TODOS = (x, y) => on => !on.some(z => en(z, x) && !en(z, y)), NINGUN = (x, y) => on => !on.some(z => en(z, x) && en(z, y));
const ALG = (x, y) => on => on.some(z => en(z, x) && en(z, y)), ALGNO = (x, y) => on => on.some(z => en(z, x) && !en(z, y));
const plural = s => (/[aeiouáéíóú]$/.test(s) ? `${s}s` : `${s}es`);
// Lee una afirmación del examen con los grupos que va encontrando (singular o plural).
function afirmacion(texto, grupos) {
  const g = s => { const k = grupos.indexOf(s) >= 0 ? s : grupos.indexOf(plural(s)) >= 0 ? plural(s) : null; if (k) return grupos.indexOf(k); grupos.push(s); return grupos.length - 1; };
  let r;
  if ((r = texto.match(/^Todos los (.+?) son (.+)$/))) return TODOS(g(r[1]), g(r[2]));
  if ((r = texto.match(/^Ningún (.+?) es (.+)$/))) return NINGUN(g(plural(r[1])), g(plural(r[2])));
  if ((r = texto.match(/^Algunos (.+?) no son (.+)$/))) return ALGNO(g(r[1]), g(r[2]));
  if ((r = texto.match(/^Algunos (.+?) son (.+)$/))) return ALG(g(r[1]), g(r[2]));
  return null;
}
function leer3(pregunta) {
  const frases = plano(pregunta).split(/(?<=\.) /).filter(x => !/\?$/.test(x)).map(x => x.replace(/\.$/, ''));
  const grupos = [], prem = frases.map(f => afirmacion(f, grupos));
  assert.ok(prem.every(Boolean), `no leo: ${pregunta}`);
  return { grupos, prem };
}

test('idea 3, «Ahora tú»: la correcta es la única que vale en todos los dibujos (400 semillas)', () => {
  for (let s = 0; s < SEMILLAS; s++) {
    const c = ID['conclusion-necesaria'].ahoraTu.generar(s), L = leer3(c.pregunta);
    assert.ok(c.datos.includes('Cada grupo tiene al menos un integrante.'), `semilla ${s}`);
    for (const o of c.opciones) {
      const grupos = L.grupos.slice(), a = afirmacion(o.texto, grupos);
      let segura;
      if (/^Nada seguro entre (.+) y (.+)$/.test(o.texto)) {
        const [, x, y] = o.texto.match(/^Nada seguro entre (.+) y (.+)$/), gx = grupos.indexOf(x), gy = grupos.indexOf(y);
        const ms = modelos(grupos.length, L.prem);
        segura = ![TODOS(gx, gy), TODOS(gy, gx), NINGUN(gx, gy), ALG(gx, gy), ALGNO(gx, gy), ALGNO(gy, gx)].some(f => ms.every(f));
      } else {
        assert.ok(a, `semilla ${s}: no leo «${o.texto}»`);
        assert.equal(grupos.length, L.grupos.length, `semilla ${s}: «${o.texto}» nombra un grupo nuevo`);
        segura = modelos(grupos.length, L.prem).every(a);
      }
      assert.equal(segura, !!o.correcta, `semilla ${s}: «${o.texto}» (${plano(c.pregunta)})`);
    }
  }
});

test('idea 3, ejemplos: cada respuesta vale en todos los dibujos, y las otras alternativas no', () => {
  // [premisas, afirmación pedida, ¿segura?] para los de nivel 1 y 2; los de nivel 3 se leen de sus alternativas.
  const EJ3 = [
    [['Todos los quenistas son banda'], 'Todos los banda son quenistas', false],
    [['Ningún ciclista es nadador'], 'Ningún nadador es ciclista', true],
    [['Algunos músicos son pintores'], 'Algunos pintores son músicos', true],
    [['Algunos lectores son nadadores'], 'Algunos lectores no son nadadores', false],
    [['Todos los coristas son músicos'], 'Algunos coristas son músicos', true],
    [['Todos los ajedrecistas son lectores', 'Todos los lectores son puntuales'], 'Todos los ajedrecistas son puntuales', true],
    [['Todos los ciclistas son deportistas', 'Algunos deportistas son nadadores'], 'Algunos ciclistas son nadadores', false],
    [['Todos los delegados son lectores', 'Ningún lector es impuntual'], 'Ningún delegado es impuntual', true],
    [['Algunos danzantes son músicos', 'Todos los músicos son bandas'], 'Algunos danzantes son bandas', true],
    [['Ningún pintor es ciclista', 'Todos los nadadores son ciclistas'], 'Ningún nadador es pintor', true],
  ];
  const I = ID['conclusion-necesaria'];
  EJ3.forEach(([ps, af, segura], k) => {
    const grupos = [], prem = ps.map(p => afirmacion(p, grupos)), a = afirmacion(af, grupos);
    assert.equal(modelos(grupos.length, prem).every(a), segura, `ejemplo ${k + 1}`);
    assert.equal(/^(No es seguro)/.test(plano(I.ejemplos[k].respuesta)), !segura, `ejemplo ${k + 1}: ${plano(I.ejemplos[k].respuesta)}`);
  });
  // Nivel 3: las premisas salen del enunciado; «¿cuál no…?» pide la única que no vale.
  for (const e of I.ejemplos.filter(x => x.nivel === 3)) {
    const t = plano(e.enunciado).replace(/^En un aula, todos los (.+?) son (.+?), algunos (.+?) son (.+?) y ningún (.+?) es (.+?)\./, 'Todos los $1 son $2. Algunos $3 son $4. Ningún $5 es $6.');
    const L = leer3(t), niega = /no se puede concluir/.test(t);
    const vale = e.alternativas.map(x => { const g = L.grupos.slice(), a = afirmacion(x, g); return a && g.length === L.grupos.length ? modelos(g.length, L.prem).every(a) : /^Nada/.test(x) ? false : null; });
    const buenas = e.alternativas.filter((_, j) => vale[j] === !niega);
    assert.deepEqual(buenas, [elegida(e)], `«${e.titulo}»: ${JSON.stringify(vale)}`);
  }
});

test('idea 3: juego, misión, predicción y «Mira», comprobados con la geometría de los aros', () => {
  const I = ID['conclusion-necesaria'], P = Kit.piezas['rm-aros'];
  const dentroDe = (a, b) => Math.hypot(a.x - b.x, a.y - b.y) + a.r <= b.r + 1e-9, tocan = (a, b) => Math.hypot(a.x - b.x, a.y - b.y) < a.r + b.r;
  const pies = (p, a) => Math.hypot(p[0] - a.x, p[1] - a.y) < a.r;
  for (const v of Teoria.grilla(I.juega.controles)) {
    const d = I.juega.dibujo(v).datos, [B, Q, D] = d.aros;
    assert.ok(dentroDe(Q, B), 'premisa 1: quenistas dentro de la banda');
    const cumple = d.ninos.some(p => pies(p, B) && pies(p, D)), bailan = d.ninos.filter(p => pies(p, Q) && pies(p, D)).length;
    assert.equal(D.cumple !== false, cumple, `${v.c}: el aro gris es el que no cumple`);
    assert.equal(I.juega.mision.logrado(v), cumple && bailan === 0, v.c);
    const l = plano(I.juega.lectura(v));
    assert.match(l, cumple ? (bailan === 0 ? /ningún quenista/ : bailan === d.ninos.filter(p => pies(p, Q)).length ? /todos los quenistas/ : /algún quenista/) : /No cumple/, v.c);
    // Los nombres van en el piso del patio, y la manija cae en el aro.
    const pt = I.juega.arrastres[0].donde(v), piso = P.patioPiso(pt);
    assert.ok(Math.abs(piso.x - D.x) < 1e-9 && Math.abs(piso.y - D.y) < 1e-9);
  }
  // Predicción: con «ningún», el aro de la diablada no toca la banda y, por eso, tampoco a los quenistas.
  const rv = I.predice.revelar.datos, [B, Q, D] = rv.aros;
  assert.ok(!tocan(D, B) && !tocan(D, Q) && rv.ninos.some(p => pies(p, D)));
  assert.equal(I.predice.opciones.find(o => o.correcta).texto, 'Ningún quenista baila diablada');
  assert.ok(modelos(3, [TODOS(0, 1), NINGUN(1, 2)]).every(NINGUN(0, 2)));
  // Mira: los dos dibujos cumplen las premisas y dicen lo contrario.
  const [d1, d2] = I.mira.datos.diagramas.map(x => x.aros);
  for (const [b, q, dd] of [d1, d2]) { assert.ok(dentroDe(q, b) && tocan(dd, b)); }
  assert.ok(tocan(d1[2], d1[1]) && !tocan(d2[2], d2[1]));
});

// ---------- Idea 4: casos de un condicional ----------
const norm = t => t.toLowerCase().replace(/(^| )no /g, '$1').replace(/^(un|el|la) /, '').trim();
const neg = t => /(^| )no /.test(t.toLowerCase());
const igual = (a, b) => { const x = norm(a), y = norm(b); return x === y || x.endsWith(` ${y}`) || y.endsWith(` ${x}`); };
function leer4(pregunta) {
  const t = plano(pregunta);
  let m = t.match(/^Regla: si (.+?), (.+?)\. Se sabe que (.+?)\. ¿/);
  if (m) return { partes: [m[1], m[2]], reglas: [[0, 1]], dato: m[3] };
  m = t.match(/^Reglas: si (.+?), (.+?); y si (.+?), (.+?)\. Se sabe que (.+?)\. ¿/);
  assert.ok(m, `no leo: ${t}`);
  assert.ok(igual(m[2], m[3]));
  return { partes: [m[1], m[2], m[4]], reglas: [[0, 1], [1, 2]], dato: m[5] };
}
function casos4(L) {
  const n = L.partes.length, out = [];
  for (let b = 0; b < 1 << n; b++) {
    const c = [...Array(n).keys()].map(i => !!((b >> i) & 1));
    if (L.reglas.some(([x, y]) => c[x] && !c[y])) continue;
    const j = L.partes.findIndex(p => igual(p, L.dato));
    assert.ok(j >= 0, `no ubico el dato «${L.dato}»`);
    if (c[j] !== !neg(L.dato)) continue;
    out.push(c);
  }
  return { out, dj: L.partes.findIndex(p => igual(p, L.dato)) };
}

test('idea 4, «Ahora tú»: la correcta es la única segura en los casos que quedan (400 semillas)', () => {
  const tipos = new Set();
  for (let s = 0; s < SEMILLAS; s++) {
    const c = ID['si-entonces'].ahoraTu.generar(s), ops = c.opciones;
    assert.equal(ops.filter(o => o.correcta).length, 1, `semilla ${s}`);
    if (/^Regla/.test(plano(c.pregunta))) {
      tipos.add(/^Reglas/.test(plano(c.pregunta)) ? 'cadena' : 'simple');
      const L = leer4(c.pregunta), { out, dj } = casos4(L);
      const seguraDe = texto => { const x = texto.replace(/^Que /, ''), j = L.partes.findIndex(p => igual(p, x)); assert.ok(j >= 0, `«${texto}»`); return out.every(k => k[j] === !neg(x)); };
      const algoNuevo = L.partes.some((_, j) => j !== dj && new Set(out.map(k => k[j])).size === 1);
      for (const o of ops) assert.equal(/^Nada/.test(o.texto) ? !algoNuevo : seguraDe(o.texto), !!o.correcta, `semilla ${s}: «${o.texto}» (${plano(c.pregunta)})`);
    } else {
      tipos.add('reparto');
      const m = plano(c.pregunta).match(/^(.+?) se inscribieron[^:]*: (.+?)\. ¿Qué juega (\S+)\?$/), ps = m[1].split(/, | y /), cosas = m[2].split(/, | o /);
      const regla = c.datos.find(x => /^Regla: /.test(x)).match(/^Regla: si (\S+) juega (.+?), (\S+) juega (.+)\.$/);
      const pistas = c.datos.filter(x => /^Pista/.test(x)).map(x => x.match(/^Pista \d+: (\S+) no juega (.+)\.$/));
      const rs = permutaciones(cosas).map(p => Object.fromEntries(ps.map((x, i) => [x, p[i]])))
        .filter(r => (r[regla[1]] !== regla[2] || r[regla[3]] === regla[4]) && pistas.every(p => r[p[1]] !== p[2]));
      const v = unico(rs, r => r[m[3]]);
      assert.ok(v, `semilla ${s}: ${m[3]} no queda decidido`);
      assert.equal(ops.find(o => o.correcta).texto.toLowerCase(), v, `semilla ${s}`);
      // Sin la regla, no se sabría (la forma indirecta hace falta).
      const sin = permutaciones(cosas).map(p => Object.fromEntries(ps.map((x, i) => [x, p[i]]))).filter(r => pistas.every(p => r[p[1]] !== p[2]));
      assert.equal(unico(sin, r => r[m[3]]), undefined, `semilla ${s}: la regla sobra`);
    }
  }
  assert.deepEqual([...tipos].sort(), ['cadena', 'reparto', 'simple']);
});

test('idea 4: juego, misión, predicción y ejemplos, contados aparte', () => {
  const I = ID['si-entonces'];
  const quedan = dato => [[1, 1], [1, 0], [0, 1], [0, 0]].filter(([p, q]) => !(p && !q) && dato(p, q));
  const D = { nada: () => true, llueve: p => p, 'no-llueve': p => !p, mojada: (p, q) => q, seca: (p, q) => !q };
  for (const v of Teoria.grilla(I.juega.controles)) {
    const n = quedan(D[v.dato]).length, d = I.juega.dibujo(v).datos;
    assert.equal(I.juega.mision.logrado(v), n === 1, v.dato);
    assert.equal(d.tablas[0].filas.filter(f => !f.fuera).length, n, v.dato);
    assert.match(plano(I.juega.lectura(v)), n === 1 ? /Queda un solo caso/ : new RegExp(`${n}`), v.dato);
  }
  assert.deepEqual(quedan(D.seca), [[0, 0]]);
  assert.equal(I.predice.opciones.find(o => o.correcta).texto, 'Que no llovió');
  // Ejemplos: [partes, reglas, dato (índice y valor), lo que se pide (índice y valor) o null si no se concluye].
  const EJ4 = [
    [2, [[0, 1]], [0, true], [1, true]], [2, [[0, 1]], [1, false], [0, false]], [2, [[0, 1]], [1, true], null], [2, [[0, 1]], [0, false], null], [2, [[0, 1]], null, 'prohibido'],
    [3, [[0, 1], [1, 2]], [0, true], [2, true]], [3, [[0, 1], [1, 2]], [2, false], [0, false]], [2, [[0, 1]], [1, false], [0, false]], [2, [[0, 1]], [1, true], null],
  ];
  EJ4.forEach(([n, reglas, dato, pide], k) => {
    const cs = [];
    for (let b = 0; b < 1 << n; b++) { const c = [...Array(n).keys()].map(i => !!((b >> i) & 1)); if (!reglas.some(([x, y]) => c[x] && !c[y]) && (!dato || c[dato[0]] === dato[1])) cs.push(c); }
    const e = I.ejemplos[k];
    if (pide === 'prohibido') { assert.equal(cs.length, 3); return; }
    if (pide) assert.ok(cs.every(c => c[pide[0]] === pide[1]), `ejemplo ${k + 1}`);
    else assert.ok(new Set(cs.map(c => c[0])).size === 2 || new Set(cs.map(c => c[1])).size === 2, `ejemplo ${k + 1}`);
    if (k === 8) assert.equal(cs.length, 2);
    assert.equal(/No es seguro|Quedan 2/.test(plano(e.respuesta)), !pide, `ejemplo ${k + 1}: ${plano(e.respuesta)}`);
  });
  // Ejemplo 10 (reparto con regla) y 12 (contrafáctico): por fuerza bruta.
  const r10 = repartos(['Ana', 'Beto', 'Ciro'], [['fútbol', 'vóley', 'ajedrez']]).filter(r => (r.Ana[0] !== 'fútbol' || r.Beto[0] === 'ajedrez') && r.Beto[0] !== 'ajedrez' && r.Ciro[0] !== 'fútbol');
  assert.equal(unico(r10, r => de(r, 0, 'fútbol')), 'Beto');
  const r12 = repartos(['Ana', 'Beto', 'Ciro'], [['médico', 'profesor', 'abogado']]).filter(r => (r.Beto[0] === 'profesor' || r.Ciro[0] === 'médico') && r.Ciro[0] === 'abogado');
  assert.equal(unico(r12, r => r.Beto[0]), 'profesor');
  assert.equal(elegida(I.ejemplos[11]).toLowerCase(), 'profesor');
  // Nivel 3 de cadena (11, 14 y 15) y el del pan (13): la alternativa elegida es la única segura.
  const segura3 = (reglas, dato, f) => { const cs = []; for (let b = 0; b < 8; b++) { const c = [0, 1, 2].map(i => !!((b >> i) & 1)); if (!reglas.some(([x, y]) => c[x] && !c[y]) && c[dato[0]] === dato[1]) cs.push(c); } return cs.every(f); };
  assert.ok(segura3([[0, 1], [1, 2]], [2, false], c => !c[1] && !c[0]) && elegida(I.ejemplos[10]) === 'No tiene canicas y no es rojo');
  assert.ok(!segura3([[0, 1], [1, 2]], [2, false], c => c[1]));
  assert.ok(segura3([[0, 1], [1, 2]], [2, false], c => !c[1] && !c[0]) && elegida(I.ejemplos[14]) === 'Rosa no faltó y no tiene fiebre');
  assert.ok(segura3([[0, 1]], [1, false], c => !c[0]) && elegida(I.ejemplos[12]) === 'El pan no está en el horno');
  // «¿Cuál no se concluye?»: con p, q y r son seguros; «si r, p» no (hay un caso con r y sin p que las reglas permiten).
  assert.ok(segura3([[0, 1], [1, 2]], [0, true], c => c[1] && c[2]));
  assert.ok(!segura3([[0, 1], [1, 2]], [2, true], c => c[0]) && elegida(I.ejemplos[13]) === 'Si Luis lleva buzo, es lunes');
});

// ---------- Idea 5: caminos en el árbol ----------
const PASO = { padre: [1, 0], madre: [1, 0], hermano: [1, 1], hermana: [1, 1], hijo: [0, 1], hija: [0, 1], abuelo: [2, 0], 'tío': [2, 1], 'tía': [2, 1] };
const NOMBRES = { '1,0': ['padre', 'madre'], '2,0': ['abuelo', 'abuela'], '3,0': ['bisabuelo', 'bisabuela'], '0,1': ['hijo', 'hija'], '0,2': ['nieto', 'nieta'], '0,3': ['bisnieto', 'bisnieta'],
  '1,1': ['hermano', 'hermana'], '2,1': ['tío', 'tía'], '1,2': ['sobrino', 'sobrina'], '2,2': ['primo', 'prima'], '3,1': ['tío abuelo', 'tía abuela'], '1,3': ['sobrino nieto', 'sobrina nieta'] };
const MUJERES = ['Ana', 'Rosa'];

test('idea 5, «Ahora tú»: el parentesco sale de sumar lo que sube y lo que baja (400 semillas)', () => {
  const tipos = new Set();
  for (let s = 0; s < SEMILLAS; s++) {
    const c = ID.parentesco.ahoraTu.generar(s), t = plano(c.pregunta), ok = c.opciones.find(o => o.correcta).texto;
    assert.equal(c.opciones.filter(o => o.correcta).length, 1, `semilla ${s}`);
    let m;
    if ((m = t.match(/^(\S+) dice: «Me visitó (el|la) (\S+) de mi (\S+)»\./))) {
      tipos.add('desde mi');
      const [u1, d1] = PASO[m[4]], [u2, d2] = PASO[m[3]];
      assert.equal(ok.toLowerCase(), NOMBRES[`${u1 + u2},${d1 + d2}`][m[2] === 'la' ? 1 : 0], `semilla ${s}: ${t}`);
    } else if ((m = t.match(/^(\S+) es (el|la) (\S+) de(?:l| la) (\S+) de (\S+)\. ¿Qué es \5 de \1\?$/))) {
      tipos.add('al revés');
      const [u1, d1] = PASO[m[4]], [u2, d2] = PASO[m[3]];
      assert.equal(ok.toLowerCase(), NOMBRES[`${d1 + d2},${u1 + u2}`][MUJERES.includes(m[5]) ? 1 : 0], `semilla ${s}: ${t}`);
      assert.equal(m[1] === 'Carmen', m[2] === 'la', `semilla ${s}: el nombre no va con el parentesco`);
    } else {
      m = t.match(/hay (\d+) padres y (\d+) hijos/);
      assert.ok(m && m[1] === m[2], `no leo: ${t}`);
      tipos.add('mínimo');
      // Con k hijos hace falta alguien arriba de todos: k + 1; una línea de k + 1 personas alcanza.
      assert.equal(ok, String(+m[1] + 1), `semilla ${s}`);
    }
  }
  assert.deepEqual([...tipos].sort(), ['al revés', 'desde mi', 'mínimo']);
});

test('idea 5: juego, misión, ejemplos y «Así se resuelve», con el árbol escrito aparte', () => {
  const I = ID.parentesco;
  // El árbol de las fotos: hijo → padre.
  const PADRE = { Pedro: 'Raúl', 'Tomás': 'Raúl', Ana: 'Pedro', Luis: 'Pedro', 'Iván': 'Tomás' };
  const sube = x => { const o = [x]; while (PADRE[o[o.length - 1]]) o.push(PADRE[o[o.length - 1]]); return o; };
  const camino = (a, b) => { const sa = sube(a), sb = sube(b), c = sa.find(x => sb.includes(x)); return [sa.indexOf(c), sb.indexOf(c)]; };
  const nom = { pedro: 'Pedro', raul: 'Raúl', tomas: 'Tomás', ivan: 'Iván', luis: 'Luis' };
  for (const v of Teoria.grilla(I.juega.controles)) {
    const [u, d] = camino('Ana', nom[v.c]);
    assert.equal(plano(I.juega.lectura(v)), `Para Ana, ${nom[v.c]} es su ${NOMBRES[`${u},${d}`][0]}: sube ${u}, baja ${d}`);
    // «el hijo del único hermano de mi papá»: sube a Pedro, a Raúl, baja a Tomás y a su hijo.
    assert.equal(I.juega.mision.logrado(v), nom[v.c] === 'Iván');
  }
  assert.deepEqual(camino('Ana', 'Iván'), [2, 2]);
  // Predicción: Raúl, Pedro y Luis son 2 padres y 2 hijos.
  assert.equal(I.predice.opciones.find(o => o.correcta).texto, 'Tres');
  // Ejemplos con el árbol de Luis (escrito otra vez): lo que dice la respuesta.
  const P2 = { Raúl: 'Elena', Marta: 'Elena', Pedro: 'Raúl', 'Tomás': 'Raúl', Luis: 'Pedro', Rosa: 'Pedro', 'Iván': 'Tomás', Sara: 'Rosa' };
  const sube2 = x => { const o = [x]; while (P2[o[o.length - 1]]) o.push(P2[o[o.length - 1]]); return o; };
  const rel = (a, b, f) => { const sa = sube2(a), sb = sube2(b), c = sa.find(x => sb.includes(x)); return NOMBRES[`${sa.indexOf(c)},${sb.indexOf(c)}`][f ? 1 : 0]; };
  const pares = [['Luis', 'Tomás', 0], ['Luis', 'Sara', 1], ['Luis', 'Raúl', 0], ['Luis', 'Iván', 0], ['Luis', 'Elena', 1], ['Luis', 'Raúl', 0], ['Luis', 'Rosa', 1], ['Luis', 'Iván', 0], ['Tomás', 'Luis', 0], ['Luis', 'Marta', 1]];
  pares.forEach(([a, b, f], k) => assert.ok(plano(I.ejemplos[k].respuesta).toLowerCase().includes(rel(a, b, f)), `ejemplo ${k + 1}: ${rel(a, b, f)}`));
  // Nivel 3: la hija de la hermana de mi mamá (sube 2, baja 2), el hermano, el mínimo de 3, los 4 hijos y el padre.
  assert.deepEqual(I.ejemplos.slice(10).map(e => elegida(e)), [NOMBRES['2,2'][1].replace(/^./, x => x.toUpperCase()), 'Su hermano', '3', '4', 'Padre']);
  // Así se resuelve: la respuesta es la suma de los dos tramos de la frase.
  for (let s = 0; s < 60; s++) {
    const r = I.resuelve.generar(s), m = plano(r.enunciado).match(/«Ayer llamó (el|la) (\S+) de mi (\S+)»/);
    const [u1, d1] = PASO[m[3]], [u2, d2] = PASO[m[2]];
    assert.equal(plano(r.respuesta), `Es su ${NOMBRES[`${u1 + u2},${d1 + d2}`][m[1] === 'la' ? 1 : 0]}`, `semilla ${s}`);
  }
});

// ---------- Idea 1: lo de antes ----------
test('idea 1: «Ahora tú» llega al examen y se resuelve aparte; juego y predicción contados aparte', () => {
  const I = ID['doble-entrada'];
  let examen = 0;
  for (let s = 0; s < SEMILLAS; s++) {
    const c = I.ahoraTu.generar(s), t = plano(c.pregunta);
    const m = t.match(/^(.+?) (?:se inscribieron|están cada uno|venden cada uno)[^:]*: (.+?)\. (¿.*)$/);
    assert.ok(m, t);
    const nombres = m[1].split(/, | y /), cosas = m[2].split(/, | o /), verbo = ['juega', 'está en', 'vende'].find(v => c.datos[0].includes(v));
    const reglas = c.datos.filter(x => /^Pista \d+: /.test(x)).map(x => x.replace(/^Pista \d+: /, '').replace(/\.$/, '')).map(l => {
      let r;
      if ((r = l.match(new RegExp(`^Quien ${verbo} (.+?) (?:conversa|almuerza|estudia|viaja) con (\\S+) y con (\\S+)$`)))) return a => a[r[2]] !== r[1] && a[r[3]] !== r[1];
      if ((r = l.match(new RegExp(`^(\\S+) (?:conversa|almuerza|estudia|viaja) con quien ${verbo} (.+)$`)))) return a => a[r[1]] !== r[2];
      if ((r = l.match(new RegExp(`^(\\S+) no ${verbo} (.+?) ni (?:en )?(.+)$`)))) return a => a[r[1]] !== r[2] && a[r[1]] !== r[3];
      if ((r = l.match(new RegExp(`^(\\S+) no ${verbo} (.+)$`)))) return a => a[r[1]] !== r[2];
      if ((r = l.match(new RegExp(`^(\\S+) ${verbo} (.+)$`)))) return a => a[r[1]] === r[2];
      return assert.fail(l);
    });
    const rs = permutaciones(cosas).map(p => Object.fromEntries(nombres.map((x, i) => [x, p[i]]))).filter(a => reglas.every(f => f(a)));
    if (/¿Qué es seguro\?|necesariamente/.test(m[3])) {
      if (nombres.length === 4 && /necesariamente/.test(m[3])) examen++;
      for (const o of c.opciones) {
        if (/^Nada/.test(o.texto)) { assert.ok(!o.correcta); continue; }
        const r = o.texto.match(new RegExp(`^(\\S+) ${verbo} (.+)$`));
        assert.equal(rs.every(a => a[r[1]] === r[2]), !!o.correcta, `semilla ${s}: «${o.texto}»`);
      }
    } else {
      const quien = nombres.find(x => m[3].includes(` ${x}?`));
      assert.equal(c.opciones.find(o => o.correcta).texto, unico(rs, a => a[quien]), `semilla ${s}`);
    }
  }
  assert.ok(examen >= SEMILLAS / 5, `examen ${examen}`);
  const todos = permutaciones([0, 1, 2]), J = [a => a[0] !== 1, a => a[0] !== 2, a => a[2] !== 1];
  const q = n => todos.filter(a => J.slice(0, n).every(f => f(a)));
  assert.deepEqual([0, 1, 2, 3].map(n => q(n).length), [6, 4, 2, 1]);
  assert.deepEqual([0, 1, 2, 3].map(n => I.juega.mision.logrado({ n })), [false, false, true, false]);
  assert.equal(I.predice.opciones.find(o => o.correcta).texto, 'Ciro juega ajedrez');
});

test('la mesa de marcar a mano: tocar cada casilla cambia su control, y los retos los cumple solo el cuadro correcto', () => {
  const m = def.laboratorio.find(x => x.id === 'marca-tu-cuadro'), base = Teoria.inicio(m);
  const s = Kit.piezas['rm-objeto'].dibujar(m.dibujo(base).datos);
  for (const c of m.controles) assert.ok(s.includes(`data-toque="${c.id}"`), c.id);
  const sol = [0, 2, 1], lleno = Object.fromEntries(m.controles.map(c => [c.id, sol[+c.id[1]] === +c.id[2] ? 'si' : 'no']));
  assert.equal(m.invitaciones[2].logrado(lleno), true);
  assert.equal(m.invitaciones[2].logrado(Object.assign({}, lleno, { m00: 'no', m01: 'si' })), false);
});
