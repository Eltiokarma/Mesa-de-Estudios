// Pruebas propias de «Enlace químico» (además del validador común de contenido/teoria/teoria.test.js). Etapa 6 (19 nov):
// las cinco ideas rehechas contra el contrato (docs/etapa6/propuesta-quimica.md, A1 a A5).
//   - las cinco ideas en el orden de la propuesta; la unidad pasaría el validador con calidad: 2 (simulada; no se declara
//     hasta el lector en frío y el auditor) y cada idea estrena sus palabras;
//   - colores: Z naranja, EN turquesa, electrones violeta, carga carmín; sin verde; las letras A–E, sin color;
//   - la primera pantalla de cada idea es un objeto de prueba; la misión no está cumplida al abrir y la cumplen solo los
//     casos previstos; el juego no muestra lo que pregunta Predice;
//   - «Ahora tú» en 400 semillas: datos, de 3 a 4 opciones distintas, una correcta, y la respuesta que da una tabla escrita
//     aquí aparte; ninguna otra opción también es correcta;
//   - toda igualdad numérica escrita (ejemplos, Mira, regla, «Así se resuelve», «Ahora tú») se comprueba con su cuenta;
//   - los 75 ejemplos: 5 por nivel, datos, alternativas explicadas, la letra correcta la de la alternativa esperada;
//   - nada de nombres de compuestos ni de funciones (Nomenclatura viene después);
//   - las figuras de quim-enlace caben con 4 de margen y sus rótulos no se pisan.
const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const Kit = require('../../../nucleo/kit/kit.js');
const Teoria = require('../../../nucleo/teoria.js');
const Glosario = require('../../../nucleo/glosario.js');
const E = require('../../../nucleo/ecuacion.js');
const def = require('./enlace-quimico.js');
for (const r of def.requiere) require(path.join(__dirname, '..', '..', '..', r));
const SEMILLAS = 400;
const limpio = x => (Array.isArray(x) ? x.flatMap(y => (y === undefined || y === null ? [] : Array.isArray(y) ? [' ', ...limpio(y), ' '] : [y])) : x === undefined || x === null ? [] : [x]);
const plano = x => E.texto(limpio(x));
const fichas = x => (x === null || x === undefined || typeof x !== 'object' ? [] : Array.isArray(x) ? x.flatMap(fichas)
  : typeof x.v === 'string' && /^c-/.test(x.v) ? [x] : Object.values(x).flatMap(fichas));

// ---------- Tablas escritas aparte (no usan las de la unidad ni las del motor) ----------
const VAL = { H: 1, Li: 1, Na: 1, K: 1, Cu: 1, Ag: 1, Be: 2, Mg: 2, Ca: 2, Fe: 2, Zn: 2, B: 3, Al: 3, C: 4, Si: 4, N: 5, P: 5, O: 6, S: 6, F: 7, Cl: 7, Br: 7, I: 7, Xe: 8 };
const EN = { H: 2.20, Li: 0.98, B: 2.04, C: 2.55, N: 3.04, O: 3.44, F: 3.98, Na: 0.93, Mg: 1.31, Al: 1.61, P: 2.19, S: 2.58, Cl: 3.16, K: 0.82, Ca: 1.00, Br: 2.96, I: 2.66 };
const METAL = new Set(['Li', 'Na', 'K', 'Be', 'Mg', 'Ca', 'Al', 'Fe', 'Cu', 'Zn', 'Ag']);
const NOM = { hidrógeno: 'H', litio: 'Li', berilio: 'Be', boro: 'B', carbono: 'C', nitrógeno: 'N', oxígeno: 'O', flúor: 'F', sodio: 'Na', magnesio: 'Mg', aluminio: 'Al', fósforo: 'P',
  azufre: 'S', cloro: 'Cl', potasio: 'K', calcio: 'Ca', bromo: 'Br', yodo: 'I', hierro: 'Fe', cobre: 'Cu', cinc: 'Zn', plata: 'Ag', silicio: 'Si' };
const SIMB_NOM = Object.fromEntries(Object.entries(NOM).map(([n, s]) => [s, n]));
const SUBN = { '₁': 1, '₂': 2, '₃': 3, '₄': 4, '₅': 5, '₆': 6 };
// Átomos y carga de una fórmula escrita (NH₄⁺, CO₃²⁻, Al₂O₃, CH₃COO⁻).
function atomosDe(fo) {
  const m = fo.match(/^([^⁺⁻²³]+)([²³]?)([⁺⁻]?)$/), cuerpo = m[1], q = m[3] ? (m[2] ? { '²': 2, '³': 3 }[m[2]] : 1) * (m[3] === '⁺' ? 1 : -1) : 0, out = [];
  for (const x of cuerpo.matchAll(/([A-Z][a-z]?)([₁-₆]?)/g)) for (let k = 0; k < (x[2] ? SUBN[x[2]] : 1); k++) out.push(x[1]);
  return { atomos: out, q };
}
const gcd = (a, b) => (b ? gcd(b, a % b) : a);
const qIon = s => (METAL.has(s) ? VAL[s] : VAL[s] - 8);
const SUPQ = q => `${Math.abs(q) === 1 ? '' : '⁰¹²³'[Math.abs(q)]}${q > 0 ? '⁺' : '⁻'}`;
const SUBI = n => (n === 1 ? '' : '₀₁₂₃₄₅₆'[n]);

// Respuesta esperada de un caso de «Ahora tú», calculada con las tablas de arriba.
function esperado(a) {
  const q = plano(a.pregunta);
  let m;
  if ((m = q.match(/une las partículas del (?:\S+ \()?([^ )?]+)\)?\?$/))) {
    const els = [...new Set(atomosDe(m[1]).atomos)], me = els.filter(s => METAL.has(s)).length;
    return me && me < els.length ? 'Iónico' : me ? 'Metálico' : 'Covalente';
  }
  if (/¿Qué tipo de enlace tiene\?$/.test(q)) return /estado sólido|corriente y el calor/.test(q) && !/Sólido no conduce/.test(q) ? 'Metálico' : /disuelto en agua, sí|solo cuando está fundido/.test(q) ? 'Iónico' : 'Covalente';
  if ((m = q.match(/molécula (\w+)₂\?$/))) return 'Covalente apolar';
  if ((m = q.match(/hay entre \S+ y \S+ \((\w+)–(\w+)\)\?$/))) return Math.abs(EN[m[1]] - EN[m[2]]) >= 1.7 - 1e-9 ? 'Iónico' : 'Covalente polar';
  if ((m = q.match(/^En el enlace (\w+)–(\w+), ¿qué átomo queda con carga parcial negativa/))) { const s = EN[m[1]] > EN[m[2]] ? m[1] : m[2]; return `El ${SIMB_NOM[s]} (${s})`; }
  if ((m = q.match(/^¿Qué ion forma el (\S+) al unirse/))) { const s = NOM[m[1]]; return `${s}${SUPQ(qIon(s))}`; }
  if ((m = q.match(/fórmula del compuesto iónico que forman el (\S+) y el (\S+)\?$/))) { const [x, y] = [NOM[m[1]], NOM[m[2]]], a1 = qIon(x), b1 = -qIon(y), g = gcd(a1, b1); return `${x}${SUBI(b1 / g)}${y}${SUBI(a1 / g)}`; }
  if ((m = q.match(/^En el (\S+), ¿cuántos electrones pasan en total del (\S+) al (\S+) por/))) { const at = atomosDe(m[1]).atomos, x = NOM[m[2]]; return String(at.filter(s => s === x).length * qIon(x)); }
  if ((m = q.match(/hay que repartir en la estructura de Lewis del (\S+)\?$/))) { const { atomos, q: c } = atomosDe(m[1]); return String(atomos.reduce((t, s) => t + VAL[s], 0) - c); }
  if ((m = q.match(/^En la estructura de Lewis del (\S+), ¿cuántos pares libres tiene el átomo central, el (\w+)\?$/))) {
    const at = atomosDe(m[1]).atomos, c = m[2], n = at.length - 1; return String((VAL[c] - n) / 2);
  }
  if ((m = q.match(/^¿Cómo es el enlace entre (.+)\?$/))) {
    const T = { 'los dos oxígenos del O₂': 2, 'el carbono y un oxígeno del CO₂': 2, 'el carbono y el nitrógeno del HCN': 3, 'el carbono y el oxígeno del CH₂O': 2, 'los dos cloros del Cl₂': 1,
      'el hidrógeno y el cloro del HCl': 1, 'el hidrógeno y el carbono del HCN': 1 };
    return { 1: 'Simple: un par compartido', 2: 'Doble: dos pares compartidos', 3: 'Triple: tres pares compartidos' }[T[m[1]]];
  }
  if ((m = q.match(/del (\S+), ¿cuántos pares compartidos y cuántos pares libres/))) {
    const T = { HCN: [4, 1], 'CH₂O': [4, 2], 'CO₂': [4, 4], 'O₂': [2, 4], 'Cl₂': [1, 6], 'NH₃': [3, 1] }[m[1]];
    return `${T[0]} compartido${T[0] > 1 ? 's' : ''} y ${T[1]} libre${T[1] === 1 ? '' : 's'}`;
  }
  if ((m = q.match(/del ([^\s,]+), el átomo central, el \w+, forma un enlace simple con cada \w+\. ¿Cuántos electrones lo rodean\?$/))) {
    return String({ 'BeCl₂': 4, 'BF₃': 6, 'BCl₃': 6, 'PCl₅': 10, 'SF₆': 12, 'SF₄': 10, 'ClF₃': 10, 'XeF₄': 12, 'BrF₅': 12 }[m[1]]);
  }
  if ((m = q.match(/octeto del átomo central en el (\S+)\?$/))) {
    const k = { 'BeCl₂': 'incompleto', 'BF₃': 'incompleto', 'BCl₃': 'incompleto', 'PCl₅': 'expandido', 'SF₆': 'expandido', 'XeF₄': 'expandido', 'NH₃': 'cumple', 'H₂O': 'cumple', 'CH₄': 'cumple', 'PCl₃': 'cumple', 'NO₂': 'impar', 'ClO₂': 'impar' }[m[1]];
    return { incompleto: 'Octeto incompleto: menos de 8', cumple: 'Cumple el octeto: 8', expandido: 'Octeto expandido: más de 8', impar: 'Impar: un electrón sin pareja' }[k];
  }
  if ((m = q.match(/^El (\S+) se forma cuando .+\. ¿Qué átomo pone los dos electrones/))) return `El ${SIMB_NOM[{ 'NH₄⁺': 'N', 'H₃O⁺': 'O', 'BF₄⁻': 'F', 'H₃N–BF₃': 'N', 'AlCl₄⁻': 'Cl' }[m[1]]]}`;
  if ((m = q.match(/es un radical libre: (.+)\?$/))) {
    const l = m[1].split(', '), imp = l.filter(x => { const { atomos, q: c } = atomosDe(x); return (atomos.reduce((t, s) => t + VAL[s], 0) - c) % 2; });
    assert.equal(imp.length, 1, q); return imp[0];
  }
  if ((m = q.match(/^El (\S+) tiene (\d) estructuras de resonancia; en cada una, (?:un (\S+) es doble|3 de sus 6)/))) {
    // pares compartidos en esos enlaces, número de esos enlaces y de estructuras; la fracción, simplificada
    const [t, n, e] = { 'O₃': [3, 2, 2], 'NO₃⁻': [4, 3, 3], 'CH₃COO⁻': [3, 2, 2], 'SO₃': [4, 3, 3], 'SO₂': [3, 2, 2], 'C₆H₆': [9, 6, 2] }[m[1]]; assert.equal(e, +m[2]);
    const g = t % 3 === 0 && n % 3 === 0 ? 3 : 1; return `${t / g}/${n / g}`;
  }
  if ((m = q.match(/^En el (\S+), el doble enlace puede ir en cualquiera/))) return String({ 'O₃': 2, 'NO₃⁻': 3, 'CH₃COO⁻': 2, 'SO₃': 3, 'SO₂': 2, 'CO₃²⁻': 3, 'NO₂⁻': 2 }[m[1]]);
  if ((m = q.match(/tiene estructuras de resonancia: (.+)\?$/))) { const si = m[1].split(', ').filter(x => ['O₃', 'NO₃⁻', 'CO₃²⁻', 'NO₂⁻', 'SO₃'].includes(x)); assert.equal(si.length, 1, q); return si[0]; }
  if ((m = q.match(/qué carga formal tiene (.+)\?$/))) {
    const [v, l, b] = { 'el carbono central, con cuatro enlaces (un doble y dos simples) y sin pares libres': [4, 0, 4], 'el oxígeno del doble enlace, con dos pares libres': [6, 4, 2],
      'el nitrógeno central, con tres enlaces (un doble y un simple) y un par libre': [5, 2, 3], 'el azufre central, con cuatro enlaces (un doble y dos simples) y sin pares libres': [6, 0, 4],
      'el azufre central, con tres enlaces (un doble y un simple) y un par libre': [6, 2, 3], 'el oxígeno con enlace simple y tres pares libres': [6, 6, 1] }[m[1]];
    const c = v - l - b; return c === 0 ? '0' : `${c > 0 ? '+' : '−'}${Math.abs(c)}`;
  }
  if (/^Indica verdadero/.test(q)) {
    const VERDAD = [[/KBr sólido está hecho de moléculas/, 'F'], [/Mg²⁺ tiene tantos electrones como el neón/, 'V'], [/iónico sólido conduce/, 'F'], [/CaCl₂ tiene dos Cl⁻/, 'V'],
      [/oxígeno pierde dos electrones/, 'F'], [/funden a temperatura alta/, 'V'], [/Na₂O cada sodio entrega un electrón/, 'V'],
      [/O₂ es un compuesto/, 'F'], [/CO₂ tiene dos enlaces dobles/, 'V'], [/H₂O, el oxígeno tiene dos pares libres/, 'V'], [/HCl hay dos pares compartidos/, 'F'], [/8 electrones en el H₂/, 'F'], [/NH₃ tiene ocho electrones/, 'V'],
      [/BF₃, el boro queda con 6/, 'V'], [/nitrógeno puede tener 10/, 'F'], [/SF₆, el azufre tiene 12/, 'V'], [/NO tiene un electrón sin pareja/, 'V'], [/OH⁻ es un radical/, 'F'], [/NH₄⁺ hay un enlace dativo/, 'V'],
      [/el doble salta de un O a otro/, 'F'], [/los átomos no se mueven/, 'V'], [/O₃ tiene dos estructuras/, 'V'], [/CO₂ tiene resonancia/, 'F'], [/tres C–O del CO₃²⁻ miden igual/, 'V'], [/híbrido de resonancia es una estructura más/, 'F']];
    const partes = q.split(/\b(?:III|II|I)\. /).slice(1);
    assert.equal(partes.length, 3, q);
    return partes.map(t => { const x = VERDAD.find(([re]) => re.test(t)); assert.ok(x, `V/F sin oráculo: ${t}`); return x[1]; }).join('');
  }
  throw new Error(`caso sin oráculo: ${q}`);
}

// Toda igualdad numérica simple escrita («5 + 4 · 1 − 1 = 8», «(6 − 2) ÷ 2 = 2», «3,44 − 1,31 = 2,13») se comprueba.
function igualdades(texto) {
  const malas = [];
  const num = t => t.replace(/−/g, '-').replace(/·/g, '*').replace(/÷/g, '/').replace(/(\d),(\d)/g, '$1.$2');
  for (const seg of texto.split(/\s{3}·\s{3}|;|\n|: (?=\d)|→/)) {
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

test('las cinco ideas en el orden de la propuesta; pasaría el validador con calidad 2 y cada idea estrena sus palabras', () => {
  assert.deepEqual(def.ideas.map(i => i.id), ['tres-enlaces', 'enlace-ionico', 'lewis-octeto', 'dativo-excepciones', 'resonancia']);
  assert.equal(def.calidad, 2, 'cerrada el 19 nov tras el lector en frío y el auditor');
  const cat = require('../../../catalogo/cursos/quimica.json').unidades.find(u => u.id === def.unidad);
  const p = Teoria.problemas(Object.assign({}, def, { calidad: 2 }), { temas: cat.temas, semillas: 60 });
  assert.deepEqual(p, [], p.join('\n'));
  assert.deepEqual(Glosario.porIdea(def).map(l => l.filter(g => g.simple).map(g => g.termino)), [
    ['enlace iónico', 'enlace covalente', 'enlace metálico', 'carga parcial'], ['regla del octeto', 'compuesto iónico', 'red de iones'],
    ['estructura de Lewis', 'par libre', 'enlace múltiple'], ['enlace dativo', 'octeto incompleto', 'octeto expandido', 'radical libre'],
    ['resonancia', 'híbrido de resonancia', 'orden de enlace', 'carga formal']]);
  assert.equal(cat.nombre, 'Enlace químico');
});

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
function figuras(i) {
  const out = [], con = (donde, f, pieza) => { if (f && f.datos) out.push({ donde: `${i.id} ${donde}`, datos: f.datos, estado: f.estado || {}, pieza: f.pieza || pieza || i.pieza }); };
  for (const v of Teoria.grilla(i.juega.controles)) con(`juego ${JSON.stringify(v)}`, i.juega.dibujo(v), i.juega.pieza);
  for (const [k, t] of i.lee.tarjetas.entries()) con(`lee ${k + 1}`, t.dibujo, t.pieza);
  con('predice', i.predice.dibujo, i.predice.pieza); con('revelar', i.predice.revelar, i.predice.pieza);
  for (let c = 0; c <= 6; c++) con(`mira corte ${c}`, { datos: i.mira.datos, estado: { corte: c } }, i.mira.pieza);
  i.ejemplos.forEach((e, k) => con(`ejemplo ${k + 1}`, e.figura));
  if (i.regla.dibujo) con('regla', i.regla.dibujo, i.mira.pieza);
  for (let s = 0; s < 12; s++) { const r = i.resuelve.generar(s); con(`resuelve ${s}`, r.dibujo, i.resuelve.pieza); r.pasos.forEach((p, k) => con(`resuelve ${s} paso ${k + 1}`, p.dibujo, i.resuelve.pieza)); }
  return out;
}

test('colores: Z naranja, EN turquesa, electrones violeta, carga carmín; sin verde; las letras A–E, sin color', () => {
  assert.deepEqual(def.colores, { z: 'o', en: 'i', e: 'f', carga: 'h' });
  const usados = new Set();
  for (const i of def.ideas) {
    for (const l of lecturas(i)) for (const f of fichas(l.x)) {
      assert.ok(f.m && def.colores[f.m], `${i.id}, ${l.donde}: ficha sin magnitud (${f.t})`);
      assert.equal(f.v, `c-${def.colores[f.m]}`, `${i.id}, ${l.donde}: ${f.t}`);
      assert.ok(!/^[A-E]$/.test(f.t), `${i.id}, ${l.donde}: la letra ${f.t} lleva color`);
      usados.add(f.m);
    }
    for (const f of figuras(i)) assert.ok(!/var\(--c-d\)/.test(Kit.piezas[f.pieza].dibujar(f.datos, f.estado)), `${f.donde}: verde`);
  }
  assert.deepEqual([...usados].sort(), ['carga', 'e', 'en', 'z']);
});

test('la primera pantalla es un objeto de prueba; la misión no está cumplida al abrir y la cumplen solo los casos previstos', () => {
  const P = Kit.piezas['quim-enlace'];
  const casos = [['probador', [{ m: 'agua-sal' }]], ['sal', [{ a: 'Al', b: 'O' }, { a: 'Al', b: 'S' }]], ['ventana', [{ k: 'Cl2' }]], ['limpiador', [{ k: 'NO' }]], ['tiza', [{ k: 1 }]]];
  def.ideas.forEach((i, n) => {
    const [objeto, logran] = casos[n], t = i.lee.tarjetas[0];
    assert.equal(t.pieza, 'quim-enlace', i.id);
    assert.ok(P.dibujar(t.dibujo.datos).includes(`data-objeto="${objeto}" data-prueba="si"`), `${i.id}: ${objeto}`);
    const j = i.juega, inicio = Object.fromEntries(j.controles.map(c => [c.id, c.inicio !== undefined ? c.inicio : c.opciones[0].valor]));
    assert.equal(j.mision.logrado(inicio), false, `${i.id}: cumplida al abrir`);
    assert.deepEqual(Teoria.grilla(j.controles).filter(v => j.mision.logrado(v)), logran, i.id);
    assert.equal(new Set(i.predice.opciones.filter(o => !o.correcta).map(o => o.error)).size, i.predice.opciones.length - 1, `${i.id}: un código por distractor en Predice`);
  });
  // El juego no muestra lo que pregunta Predice: sin lupa en la idea 1, sin nitrógeno en la 2, sin triple en la 3, sin
  // dativo en la 4 y sin el NO₃⁻ en la 5.
  const [I1, I2, I3, I4, I5] = def.ideas;
  for (const v of Teoria.grilla(I1.juega.controles)) assert.equal(I1.juega.dibujo(v).pieza, 'quim-enlace');
  for (const v of Teoria.grilla(I2.juega.controles)) assert.ok(!/\bN\b/.test(JSON.stringify(I2.juega.dibujo(v).datos.filas)));
  for (const v of Teoria.grilla(I3.juega.controles)) assert.ok(I3.juega.dibujo(v).datos.enlaces.every(e => e.orden < 3), JSON.stringify(v));
  for (const v of Teoria.grilla(I4.juega.controles)) assert.ok(!/NH₄|H₃O/.test(JSON.stringify(I4.juega.dibujo(v).datos)));
  for (const v of Teoria.grilla(I5.juega.controles)) assert.equal(I5.juega.dibujo(v).datos.atomos[0].t, 'C');
});

test('Ahora tú: datos, opciones distintas, una correcta, la respuesta de una tabla aparte y ninguna otra también correcta (400 semillas)', () => {
  for (const i of def.ideas) for (let s = 0; s < SEMILLAS; s++) {
    const a = i.ahoraTu.generar(s), donde = `${i.id} ${s}`;
    assert.ok(Array.isArray(a.datos) && a.datos.length, `${donde}: sin datos`);
    assert.ok(a.opciones.length >= 3 && a.opciones.length <= 4, `${donde}: ${a.opciones.length} opciones`);
    assert.equal(new Set(a.opciones.map(o => o.texto)).size, a.opciones.length, `${donde}: opciones repetidas`);
    const c = a.opciones.filter(o => o.correcta);
    assert.equal(c.length, 1, donde);
    const esp = esperado(a);
    assert.equal(c[0].texto, esp, `${donde}: ${plano(a.pregunta)}`);
    assert.equal(a.opciones.filter(o => o.texto === esp).length, 1, `${donde}: dos opciones correctas`);
    for (const o of a.opciones.filter(x => !x.correcta)) assert.ok(o.error && o.siFuera, `${donde}: distractor sin código o siFuera`);
  }
});

test('«Así se resuelve» no repite los casos de «Ahora tú»', () => {
  for (const i of def.ideas) {
    const ahora = new Set(Array.from({ length: 12 }, (_, s) => plano(i.ahoraTu.generar(s).pregunta)));
    for (let s = 0; s < 4; s++) assert.ok(!ahora.has(plano(i.resuelve.generar(s).enunciado)), `${i.id} ${s}`);
  }
});

test('toda igualdad numérica escrita cuadra con su cuenta, y no hay nombres de compuestos ni de funciones', () => {
  const malas = [];
  const NOMBRES = /\b(cloruro|bromuro|yoduro|fluoruro|óxido|hidróxido|sulfuro|nitruro|carbonato|nitrato|nitrito|amonio|hidronio|sulfato|sulfito|fosfato|perclorato|hidruro|oxisal|haloidea|peróxido|ácido)\b/i;
  const sinSep = x => (Array.isArray(x) ? x.map(sinSep) : x === '   ·   ' ? ' ; ' : x);
  for (const i of def.ideas) for (const l of lecturas(i)) {
    const t = plano(sinSep(l.x));
    for (const m of igualdades(t)) malas.push(`${i.id}, ${l.donde}: ${m}`);
    assert.ok(!NOMBRES.test(t), `${i.id}, ${l.donde}: ${t.match(NOMBRES)}`);
  }
  for (const g of def.glosario) assert.ok(!NOMBRES.test([g.def, g.simple, ...(g.ejemplos || [])].join(' ')), g.termino);
  assert.deepEqual(malas, []);
});

test('ejemplos: 15 por idea, 5 por nivel, con datos; en el nivel 3 la letra es la de la alternativa que se espera', () => {
  // Alternativa correcta de cada ejemplo de nivel 3, decidida aquí aparte (título → texto).
  const ESPERA = {
    'Cada sustancia con su enlace': 'Iónico, covalente y metálico', 'Tres sólidos en el laboratorio': 'X iónico, Q covalente, R metálico', 'El caso del HF': 'Es covalente polar: son dos no metales que comparten el par.',
    'Verdadero o falso': null, 'Dos elementos sin nombre': null,
    'El litio con el nitrógeno': '3', 'Un sólido iónico': 'Fundido o disuelto conduce la corriente; sólido, no.', 'Los iones del MgF₂': 'Los dos iones tienen 10 electrones, como el neón.',
    'Los dos gases del aire': 'El N₂ tiene un enlace triple y el O₂, uno doble.', 'La estructura del HCN': 'Tiene un enlace triple C≡N y un par libre en el nitrógeno.', 'Dos moléculas con hidrógeno': '1 y 2',
    'Un anión de cinco átomos': '32', 'Pares libres con más de ocho': '1, 2 y 2', 'Un radical en la lista': 'OH', 'El amoníaco y el boro': 'El N pone su par libre y el B completa su octeto.',
    'Quién no se expande': 'N', 'Los pares del N₂O': '4', 'Tres enlaces carbono–oxígeno': 'CO₃²⁻ > CO₂ > CO', 'Quién tiene resonancia': 'O₃', 'Las cargas del ozono': '0, +1 y −1',
  };
  const VF = { 'tres-enlaces': 'FVV', 'enlace-ionico': 'VFV', 'lewis-octeto': 'FVV', 'dativo-excepciones': 'VFV', resonancia: 'FVV' };
  const SIN_NOMBRE = { 'tres-enlaces': 'Iónico en X con Q; covalente apolar en Q₂', 'enlace-ionico': 'X forma X²⁺ y la fórmula es XQ₂.' };
  const letras = [];
  for (const i of def.ideas) {
    assert.equal(i.ejemplos.length, 15, i.id);
    for (const n of [1, 2, 3]) assert.equal(i.ejemplos.filter(e => e.nivel === n).length, 5, `${i.id} nivel ${n}`);
    for (const e of i.ejemplos) {
      assert.ok(Array.isArray(e.datos) && e.datos.length, `${i.id} «${e.titulo}»: sin datos`);
      if (e.nivel !== 3) continue;
      const bien = e.titulo === 'Verdadero o falso' ? VF[i.id] : e.titulo === 'Dos elementos sin nombre' ? SIN_NOMBRE[i.id] : ESPERA[e.titulo];
      assert.ok(bien, `${i.id} «${e.titulo}»: sin respuesta esperada`);
      const k = e.alternativas.indexOf(bien);
      assert.ok(k >= 0, `${i.id} «${e.titulo}»: «${bien}» no está entre las alternativas`);
      const L = 'ABCDE'[k];
      assert.equal(e.respuesta[0].negrita[0], L, `${i.id} «${e.titulo}»`);
      letras.push(L);
    }
  }
  for (const L of 'ABCDE') assert.equal(letras.filter(x => x === L).length, 5, `letra ${L}`);
});

test('las figuras de quim-enlace caben con 4 de margen y sus rótulos no se pisan', () => {
  const P = Kit.piezas['quim-enlace'];
  const solapan = (a, b) => a.x0 < b.x1 - 0.5 && b.x0 < a.x1 - 0.5 && a.y0 < b.y1 - 0.5 && b.y0 < a.y1 - 0.5;
  for (const i of def.ideas) for (const f of figuras(i).filter(x => x.pieza === 'quim-enlace')) {
    const g = P.geometria(f.datos, f.estado), { W, H, M } = g;
    for (const c of [...g.textos, ...g.objetos]) assert.ok(c.x0 >= M - 1e-9 && c.x1 <= W - M + 1e-9 && c.y0 >= M - 1e-9 && c.y1 <= H - M + 1e-9, `${f.donde}: se sale «${c.txt || c.que}»`);
    for (let a = 0; a < g.textos.length; a++) for (let b = a + 1; b < g.textos.length; b++) assert.ok(!solapan(g.textos[a], g.textos[b]), `${f.donde}: «${g.textos[a].txt}» pisa «${g.textos[b].txt}»`);
    for (const t of g.textos) for (const o of g.objetos.filter(x => x.que !== 'corchetes')) assert.ok(!solapan(t, o), `${f.donde}: «${t.txt}» pisa ${o.que}`);
    for (const [x, y] of g.puntos || []) for (const t of g.textos) assert.ok(!(x > t.x0 + 1 && x < t.x1 - 1 && y > t.y0 + 1 && y < t.y1 - 1), `${f.donde}: un punto cae sobre «${t.txt}»`);
  }
});

// ---------- Auditoría del cierre (19 nov): cada prueba falla con la versión anterior ----------
// Figuras de Lewis (quim-molecula): carga formal de cada átomo = valencia − electrones propios − órdenes de sus enlaces; la
// suma es la carga de la especie y los electrones dibujados son los de valencia menos esa carga. Una figura que olvida un
// par libre (el XeF₂ con 2 de sus 3) no cuadra. Las cargas dibujadas son las cargas formales de cada átomo.
function revisaLewis(donde, d, corte) {
  const ve = x => (x.desde === undefined || corte >= x.desde) && (x.hasta === undefined || corte <= x.hasta);
  const en = (d.enlaces || []).filter(ve), pa = (d.pares || []).filter(ve), tx = (d.textos || []).filter(ve), cg = (d.cargas || []).filter(ve);
  if (tx.some(t => /\?|4\/3|ΔEN/.test(t.t)) || !pa.length) return null; // lo pedido tapado, el híbrido, la mesa o el esqueleto
  const fo = ((d.alt || '').match(/del ([A-Z][A-Za-z₀-₉²³⁺⁻]*)/) || (d.alt || '').match(/\b([A-Z][A-Za-z₀-₉]*[₀-₉][A-Za-z₀-₉]*[²³]?[⁺⁻]?)/) || [])[1];
  assert.ok(fo, `${donde}: el alt no nombra la especie`);
  const { atomos, q } = atomosDe(fo), sueltos = {};
  for (const t of tx.filter(x => x.t === '•')) { const a = d.atomos.reduce((m, b) => ((b.x - t.x) ** 2 + (b.y - t.y) ** 2 < (m.x - t.x) ** 2 + (m.y - t.y) ** 2 ? b : m)); sueltos[a.id] = (sueltos[a.id] || 0) + 1; }
  let suma = 0, dibujados = 0;
  for (const a of d.atomos) {
    const ord = en.filter(e => e.a === a.id || e.b === a.id).reduce((t, e) => t + (e.orden || 1), 0), lp = pa.filter(p => p.en === a.id).length, s1 = sueltos[a.id] || 0;
    const fc = VAL[a.t] - 2 * lp - s1 - ord; suma += fc; dibujados += 2 * lp + s1;
    if (cg.length) { const t = cg.filter(c => c.en === a.id).map(c => c.t).join(''); assert.equal(t === '' ? 0 : t === '+' ? 1 : -1, fc, `${donde}: carga del ${a.t} (${a.id})`); }
  }
  dibujados += 2 * en.reduce((t, e) => t + (e.orden || 1), 0);
  assert.equal(suma, q, `${donde}: las cargas formales del ${fo} suman ${suma}`);
  assert.equal(dibujados, atomos.reduce((t, s) => t + VAL[s], 0) - q, `${donde}: electrones dibujados del ${fo}`);
  return fo;
}
test('auditoría: ninguna figura de Lewis tiene electrones de más ni de menos, en el juego, Mira, la regla, los ejemplos y 400 semillas de «Así se resuelve»', () => {
  const vistas = new Set();
  for (const i of def.ideas) {
    const lewis = (donde, f, cortes = [0]) => { if (f && f.pieza === 'quim-molecula') for (const c of cortes) { const fo = revisaLewis(`${i.id} ${donde}`, f.datos, c); if (fo) vistas.add(fo); } };
    for (const v of Teoria.grilla(i.juega.controles)) lewis(`juego ${JSON.stringify(v)}`, i.juega.dibujo(v));
    lewis('predice', i.predice.dibujo); lewis('revelar', i.predice.revelar);
    lewis('mira', { pieza: i.mira.pieza, datos: i.mira.datos }, [1, 2, 3, 4, 5, 6]);
    lewis('regla', i.regla.dibujo);
    i.ejemplos.forEach((e, k) => lewis(`ejemplo ${k + 1}`, e.figura));
    for (let s = 0; s < SEMILLAS; s++) { const r = i.resuelve.generar(s); lewis(`resuelve ${s}`, r.dibujo); r.pasos.forEach(p => lewis(`resuelve ${s}`, p.dibujo)); }
  }
  const mesa = def.laboratorio.find(m => m.id === 'resonancia-libre');
  for (const v of Teoria.grilla(mesa.controles)) { const fo = revisaLewis(`mesa ${JSON.stringify(v)}`, mesa.dibujo(v).datos, 0); if (fo) vistas.add(fo); }
  for (const fo of ['XeF₂', 'BrF₃', 'PCl₅', 'SF₆', 'BF₃', 'NO', 'NH₄⁺', 'CO₃²⁻', 'NO₃⁻', 'N₂', 'CO₂']) assert.ok(vistas.has(fo), `no se revisó el ${fo}`);
});
test('auditoría: ninguna explicación de una fórmula iónica dice «no da 0» de una fórmula que da 0 (Mg₂O₂), en 400 semillas', () => {
  const ion = def.ideas[1];
  for (let s = 0; s < SEMILLAS; s++) {
    const a = ion.ahoraTu.generar(s), m = plano(a.pregunta).match(/que forman el (\S+) y el (\S+)\?$/); if (!m) continue;
    const [x, y] = [NOM[m[1]], NOM[m[2]]];
    for (const o of a.opciones) {
      const at = atomosDe(o.texto).atomos, carga = at.filter(z => z === x).length * qIon(x) + at.filter(z => z === y).length * qIon(y);
      if (/no da 0/.test(o.siFuera || '')) assert.notEqual(carga, 0, `${o.texto}: ${o.siFuera}`);
      if (/simplifica|más chicos/.test(o.siFuera || '')) assert.equal(carga, 0, `${o.texto}: ${o.siFuera}`);
    }
  }
});
test('auditoría: la mesa de dos átomos pone a cada ion la carga de su grupo (el C con un metal, 4−; el H, −)', () => {
  const mesa = def.laboratorio.find(m => m.id === 'dos-atomos');
  for (const v of Teoria.grilla(mesa.controles)) {
    const d = mesa.dibujo(v).datos; if (METAL.has(v.a) === METAL.has(v.b)) continue;
    for (const c of d.cargas) {
      const s = d.atomos.find(a => a.id === c.en).t, q = METAL.has(s) ? VAL[s] : s === 'H' ? -1 : VAL[s] - 8;
      assert.equal(c.t, `${Math.abs(q) === 1 ? '' : Math.abs(q)}${q > 0 ? '+' : '−'}`, `${v.a}–${v.b}: ${s}`);
    }
  }
});
test('auditoría: nada de forma, hibridación ni polaridad de la molécula, y sin «electrónes», «1 pares» ni «cambian 1 electrón»', () => {
  const PROHIBIDO = /lineal|angular|tetra[eé]dric|piramidal|trigonal|hibrida|\bsp[²³\d]|moléculas? (a)?polar|geometr|RPECV|dipolo|ángulo de enlace|fuerzas? intermolecular/i;
  const MAL = /electrónes|\b[01] pares|cambian 1 electrón|tiene ningún/;
  const textos = [];
  const junta = x => { if (x == null || typeof x === 'function') return; if (typeof x === 'string') textos.push(x); else if (typeof x === 'object') for (const [k, y] of Object.entries(x)) if (!['pieza', 'v', 'm', 'id', 'formas'].includes(k)) junta(y); };
  for (const i of def.ideas) { junta(Object.assign({}, i, { ahoraTu: null, resuelve: null })); for (const l of lecturas(i)) textos.push(plano(l.x)); }
  junta(def.glosario); junta(def.historia); junta(def.laboratorio);
  for (const t of textos) { assert.ok(!PROHIBIDO.test(t), `de Geometría molecular: «${t.slice(0, 80)}»`); assert.ok(!MAL.test(t), `«${t.match(MAL)}» en «${t.slice(0, 80)}»`); }
});
test('auditoría: la EN va con dos decimales («2,20») y «Ahora tú» de la resonancia no repite las especies ni el V/F de los ejemplos', () => {
  for (const i of def.ideas) for (const l of lecturas(i)) {
    const t = plano(l.x); for (const m of t.matchAll(/EN: ([^·\n]+)/g)) assert.ok(!/\b[A-Z][a-z]? \d,\d(?!\d)/.test(m[1]), `${i.id} ${l.donde}: «${m[0]}»`);
  }
  const res = def.ideas[4], enEjemplos = res.ejemplos.map(e => e.enunciado).join(' ');
  const vfEj = i => i.ejemplos.find(e => e.titulo === 'Verdadero o falso').enunciado.split(/\b(?:III|II|I)\. /).slice(1).map(x => x.trim());
  for (let s = 0; s < SEMILLAS; s++) {
    const q = plano(res.ahoraTu.generar(s).pregunta);
    let m;
    if ((m = q.match(/^El (\S+) tiene \d estructuras de resonancia/))) assert.ok(!enEjemplos.includes(`${m[1]} tiene`) && !/^(O₃|NO₃⁻|CH₃COO⁻|CO₃²⁻)$/.test(m[1]), `orden del ${m[1]}: ya está en un ejemplo o en el juego`);
    if ((m = q.match(/del (\S+), ¿qué carga formal tiene/))) assert.ok(!/^(NO₃⁻|O₃)$/.test(m[1]), `carga formal en el ${m[1]}: ya está en los ejemplos`);
    if ((m = q.match(/^En el (\S+), el doble enlace puede ir/))) assert.notEqual(m[1], 'CO₃²⁻', 'el CO₃²⁻ ya está en un ejemplo');
    for (const k of [2, 4]) { const a = plano(def.ideas[k].ahoraTu.generar(s).pregunta); if (/^Indica verdadero/.test(a)) assert.notDeepEqual(a.split(/\b(?:III|II|I)\. /).slice(1).map(x => x.trim()), vfEj(def.ideas[k]), `${def.ideas[k].id} ${s}: el V/F del ejemplo`); }
  }
});

// Verificación de la pasada de redacción (26 nov): un grano de sal tiene del orden de 10¹⁸ iones (un trillón), no
// «billones» (10¹²).
test('verificación 27 nov: la explicación QM-FORM-CARGA dice bien si falta o sobra carga del metal (AlF₂ sobra, Li₂N falta), en 400 semillas', () => {
  const ion = def.ideas[1];
  let vistas = 0;
  for (let s = 0; s < SEMILLAS; s++) {
    const a = ion.ahoraTu.generar(s), m = plano(a.pregunta).match(/que forman el (\S+) y el (\S+)\?$/); if (!m) continue;
    const [x, y] = [NOM[m[1]], NOM[m[2]]];
    for (const o of a.opciones.filter(o => o.error === 'QM-FORM-CARGA')) {
      const at = atomosDe(o.texto).atomos, carga = at.filter(z => z === x).length * qIon(x) + at.filter(z => z === y).length * qIon(y);
      const dice = /no alcanzan? para/.test(o.siFuera) ? -1 : /más carga de la que anula/.test(o.siFuera) ? 1 : 0;
      assert.equal(dice, Math.sign(carga), `${o.texto}: ${o.siFuera}`);
      vistas++;
    }
  }
  assert.ok(vistas > 20, `solo ${vistas} explicaciones QM-FORM-CARGA`);
});
test('redacción: el grano de sal del «Lee» no dice «billones»', () => {
  const lee = def.ideas.flatMap(i => (i.lee && i.lee.tarjetas) || []).map(t => plano(t.texto)).join(' ');
  assert.ok(/grano/.test(lee) && !/billones/.test(lee));
});
