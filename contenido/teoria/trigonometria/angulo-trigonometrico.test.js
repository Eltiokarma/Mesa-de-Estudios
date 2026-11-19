// Pruebas propias de «Ángulo trigonométrico y sistemas de medida» (además del validador común de
// contenido/teoria/teoria.test.js). Etapa 5, fases 2 y 3 (19 nov): las cinco ideas están rehechas contra el contrato (la
// unidad todavía no declara calidad: 2; la sesión la marca después del lector en frío y del auditor).
//   - el orden nuevo de las ideas, con los `id` publicados y la idea nueva `formula-general`;
//   - nada adelantado ni repetido: el radián no aparece antes de su idea y ningún ejercicio calcula un arco (s = θ · r);
//   - la idea 1 cumple el contrato: aprendizaje, actividad, pregunta, misión que solo se logra con −270°, leyenda, datos
//     en todo ejercicio, 15 ejemplos (5 por nivel; los de nivel 3, con cinco alternativas) y glosario con `simple`;
//   - regla de colores de la unidad (cabecera del archivo): en la idea 1 solo hay carmín y tinta, en cada figura y en
//     cada texto, también en «Ahora tú» y «Así se resuelve» (400 semillas);
//   - ninguna figura de Predice ni de un ejemplo muestra la respuesta, y el juego nunca muestra dos giros seguidos (lo que
//     la predicción pregunta);
//   - «Ahora tú» y «Así se resuelve» cuadran con un cálculo aparte, hecho desde el texto del enunciado (400 semillas), y
//     no hacen la misma pregunta.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const Kit = require('../../../nucleo/kit/kit.js');
const Teoria = require('../../../nucleo/teoria.js');
const Glosario = require('../../../nucleo/glosario.js');
const E = require('../../../nucleo/ecuacion.js');
const def = require('./angulo-trigonometrico.js');
for (const r of def.requiere) require(path.join(__dirname, '..', '..', '..', r));
const RAIZ = path.join(__dirname, '..', '..', '..');
const SEMILLAS = 400;
const idea = id => def.ideas.find(i => i.id === id);
const I1 = idea('sentido-signo');
const limpio = x => (Array.isArray(x) ? x.filter(y => y !== undefined && y !== null).map(limpio) : x);
const plano = x => E.texto(x === undefined || x === null ? '' : limpio(x)).replace(/[⁠ ]/g, ' ');
const num = t => Number(String(t).replace('−', '-').replace(/\s/g, '').replace(',', '.'));
const svgDe = dib => Kit.piezas[dib.pieza || I1.pieza].dibujar(dib.datos, dib.estado || {});
// Todos los colores de variable que usa un texto con partes ({ v: 'c-h', t }).
function colores(x, acc = new Set()) {
  if (Array.isArray(x)) x.forEach(y => colores(y, acc));
  else if (x && typeof x === 'object') { if (typeof x.v === 'string') acc.add(x.v); for (const [k, v] of Object.entries(x)) if (k !== 'v' && k !== 't' && typeof v === 'object') colores(v, acc); if (typeof x.color === 'string' && /^c-/.test(x.color)) acc.add(x.color); }
  return acc;
}

test('orden nuevo: cinco ideas, con los id publicados y la idea nueva al final; sin calidad 2 todavía', () => {
  assert.deepEqual(def.ideas.map(i => i.id), ['sentido-signo', 'tres-sistemas', 'minutos-decimales', 'radian', 'formula-general']);
  assert.ok(!(def.calidad >= 2), 'la unidad se marca calidad 2 al cerrarla, no en la fase 2');
  assert.ok(def.requiere.includes('/nucleo/kit/piezas/trig-giro.js'));
  const cat = JSON.parse(fs.readFileSync(path.join(RAIZ, 'catalogo/cursos/trigonometria.json'), 'utf8')).unidades.find(u => u.id === def.unidad);
  for (const i of def.ideas) for (const t of i.temas) assert.ok(cat.temas.includes(t), `${i.id}: «${t}» no es un tema del catálogo`);
  // Cada mesa del laboratorio es de una idea (fase 3): ninguna queda en «Más mesas del tema».
  assert.deepEqual(def.laboratorioIdeas, { 'dos-giros': ['sentido-signo'], 'tres-escalas': ['radian'], 'arco-sale': ['radian'] });
  for (const m of def.laboratorio) assert.ok(def.laboratorioIdeas[m.id].length, m.id);
});

test('nada adelantado: el radián no aparece antes de su idea, y ningún ejercicio pide un arco', () => {
  for (const id of ['sentido-signo', 'tres-sistemas', 'minutos-decimales']) {
    const i = idea(id), partes = [i.titulo, i.lee && i.lee.tarjetas.map(t => [t.titulo, t.texto]), i.juega.consigna, i.predice.pregunta, i.predice.opciones.map(o => [o.texto, o.siFuera]), i.mira.pasos.map(p => [p.texto, p.ecuacion]), i.regla.texto, i.regla.ecuacion, i.regla.condicion];
    for (const v of Teoria.grilla(i.juega.controles)) partes.push(i.juega.lectura(v));
    for (let s = 0; s < 60; s++) { const a = i.ahoraTu.generar(s); partes.push(a.pregunta, a.opciones.map(o => [o.texto, o.siFuera]), a.solucion.texto, a.solucion.ecuacion); if (i.resuelve) { const r = i.resuelve.generar(s); partes.push(r.enunciado, r.pasos.map(p => [p.texto, p.ecuacion]), r.respuesta); } }
    const txt = plano(partes.flat(Infinity).filter(x => x !== undefined));
    assert.ok(!/\brad\b|radi[aá]n|π/.test(txt), `${id}: usa radianes antes de la idea del radián`);
  }
  for (const i of def.ideas) for (let s = 0; s < 60; s++) {
    const a = i.ahoraTu.generar(s), r = i.resuelve ? i.resuelve.generar(s) : null;
    assert.ok(!/mide su arco|largo del arco/.test(plano(a.pregunta) + (r ? plano(r.enunciado) : '')), `${i.id}: calcula un arco (es de «Longitud de arco»)`);
  }
});

test('idea 1: contrato completo (aprendizaje, actividad, pregunta, misión, leyenda, lee, regla y ejemplos)', () => {
  assert.equal(I1.titulo, 'Ángulo trigonométrico: giro con signo');
  assert.ok(I1.aprendizaje && Teoria.palabras(I1.aprendizaje) <= 25);
  assert.ok(I1.actividad && /\?$/.test(I1.pregunta));
  assert.equal(I1.pieza, 'trig-giro', 'la primera pantalla es un objeto: el timón');
  assert.equal(I1.lee.tarjetas[0].dibujo.datos.objeto, 'timon');
  assert.equal(I1.juega.dibujo(Teoria.inicio(I1.juega)).datos.objeto, 'timon');
  // La misión: solo −270° (horario, la cinta a la izquierda). +90° deja la cinta en el mismo lugar, pero es antihorario.
  const cumplen = Teoria.grilla(I1.juega.controles).filter(v => I1.juega.mision.logrado(v));
  assert.deepEqual(cumplen, [{ g: -270 }]);
  assert.ok(!I1.juega.mision.logrado({ g: 90 }) && !I1.juega.mision.logrado(Teoria.inicio(I1.juega)));
  assert.ok(I1.juega.leyenda.length >= 4);
  // La lectura enuncia la relación entre los grados, las vueltas y el sentido.
  assert.equal(plano(I1.juega.lectura({ g: -270 })), 'θ = −270°: 3/4 de vuelta, horario');
  assert.equal(plano(I1.juega.lectura({ g: 450 })), 'θ = 450°: 1 vuelta y 1/4, antihorario');
  assert.equal(plano(I1.juega.lectura({ g: 360 })), 'θ = 360°: 1 vuelta, antihorario');
  // La regla dice todo lo que «Ahora tú» pide: signo, más de una vuelta, giros seguidos y flecha invertida.
  const regla = plano([I1.regla.texto, I1.regla.ecuacion, I1.regla.condicion]);
  for (const p of [/antihorario es positivo/, /horario, negativo/, /se suman con su signo/, /más de una vuelta|pasar de una vuelta/, /invierte la flecha/, /1 vuelta = 360°/]) assert.match(regla, p);
  assert.equal(I1.ejemplos.length, 15);
});

test('idea 1: el juego no muestra lo que la predicción pregunta, y la figura de Predice no trae la respuesta', () => {
  for (const v of Teoria.grilla(I1.juega.controles)) assert.ok(I1.juega.dibujo(v).datos.giros.length <= 1, 'el juego es de un solo giro');
  const p = I1.predice;
  assert.equal(p.opciones.filter(o => o.correcta).length, 1);
  assert.equal(p.opciones.length, 4);
  for (const o of p.opciones.filter(x => !x.correcta)) assert.ok(o.error && o.siFuera, o.id);
  const correcta = plano(p.opciones.find(o => o.correcta).texto);
  assert.equal(correcta, '−90°');
  assert.equal(150 + -240, num(correcta.replace('°', '')), 'la cuenta de la predicción');
  // Los distractores salen de un error con su cuenta: sumar tamaños, perder el signo, el giro positivo que termina igual.
  assert.deepEqual(p.opciones.map(o => plano(o.texto)).sort(), ['270°', '390°', '90°', '−90°'].sort());
  assert.equal(150 + 240, 390); assert.equal(Math.abs(150 - 240), 90); assert.equal(360 - 90, 270);
  const fig = Teoria.textoSVG(svgDe(p.dibujo));
  assert.ok(!/90|240/.test(fig), `la figura de Predice muestra «${fig}»`);
  assert.equal(p.dibujo.datos.giros.length, 1, 'solo el primer giro: lo que ese dato marca por sí solo');
  // Datos de la predicción: equivalencias y definiciones, sin la regla de sumar.
  assert.ok(p.datos.length >= 1 && !/suma/.test(plano(p.datos)));
});

test('idea 1: un solo color (carmín) en cada figura y en cada texto; el sentido lo dicen la flecha y el signo', () => {
  const figs = [], textos = [];
  const toma = dib => { if (dib) figs.push(dib); };
  for (const v of Teoria.grilla(I1.juega.controles)) { toma(I1.juega.dibujo(v)); textos.push(I1.juega.lectura(v)); }
  for (const t of I1.lee.tarjetas) { toma(t.dibujo); textos.push(t.texto); }
  toma(I1.predice.dibujo); toma(I1.predice.revelar);
  textos.push(I1.predice.pregunta, I1.predice.datos, I1.juega.consigna, I1.juega.leyenda, I1.regla.ecuacion);
  I1.mira.pasos.forEach(ps => { toma({ datos: I1.mira.datos, estado: ps.estado }); textos.push(ps.texto, ps.ecuacion); });
  for (const e of I1.ejemplos) { toma(e.figura); textos.push(e.enunciado, e.datos, e.solucion, e.respuesta); }
  for (let s = 0; s < SEMILLAS; s++) {
    const a = I1.ahoraTu.generar(s), r = I1.resuelve.generar(s);
    toma(a.dibujo); toma(r.dibujo); r.pasos.forEach(p => toma(p.dibujo));
    textos.push(a.pregunta, a.datos, a.solucion, r.enunciado, r.datos, r.pasos, r.respuesta);
  }
  assert.ok(figs.length > 1000);
  for (const d of figs) {
    const cs = new Set((svgDe(d).match(/var\(--c-[a-z]\)/g) || []));
    for (const c of cs) assert.equal(c, 'var(--c-h)', `una figura de la idea 1 usa ${c}: ${JSON.stringify(d.datos).slice(0, 120)}`);
  }
  const cs = colores(textos);
  assert.deepEqual([...cs], ['c-h'], `colores en los textos de la idea 1: ${[...cs]}`);
  assert.equal(I1.juega.controles[0].color, 'c-h');
});

test('idea 1, ejemplos: 5 por nivel con datos; la figura muestra el planteamiento, no la respuesta', () => {
  const EJ = I1.ejemplos;
  for (const nv of [1, 2, 3]) assert.equal(EJ.filter(e => e.nivel === nv).length, 5);
  EJ.forEach((e, k) => {
    assert.ok(Array.isArray(e.datos) && e.datos.length >= 1, `ejemplo ${k + 1}: sin datos`);
    assert.ok(e.figura, `ejemplo ${k + 1}: sin figura`);
    // Los números de la figura están todos en el enunciado: ninguno es un resultado.
    const enFig = Teoria.numerosDe(Teoria.textoSVG(svgDe(e.figura))), enEnun = Teoria.numerosDe(plano(e.enunciado));
    for (const x of enFig) assert.ok(enEnun.has(x), `ejemplo ${k + 1} («${e.titulo}»): la figura muestra ${x}, que no es un dato del enunciado`);
    // Lo que se pide va con «?», en tinta.
    const pide = (e.figura.datos.giros || []).filter(g => g.texto === '?');
    for (const g of pide) assert.equal(g.colorTexto, 'tinta');
    // La respuesta lleva el color de su magnitud (carmín: grados).
    assert.ok(colores(e.respuesta).has('c-h'), `ejemplo ${k + 1}: la respuesta no lleva color`);
  });
});

test('idea 1, ejemplos de nivel 3: cinco alternativas con la respuesta; por letra solo si la figura no tiene puntos con letras', () => {
  const N3 = I1.ejemplos.filter(e => e.nivel === 3), letras = [];
  for (const e of N3) {
    assert.equal(e.alternativas.length, 5, e.titulo);
    assert.equal(new Set(e.alternativas).size, 5, `${e.titulo}: alternativas repetidas`);
    const r = plano(e.respuesta), conLetras = e.figura.datos.objeto === 'rayos';
    const valor = r.replace(/^[A-E], /, '').replace(/^(x|β) = /, '');
    const k = e.alternativas.indexOf(valor);
    assert.ok(k >= 0, `${e.titulo}: la respuesta «${valor}» no está entre las alternativas`);
    letras.push('ABCDE'[k]);
    const nombra = JSON.stringify(e.solucion).includes('"negrita"') || JSON.stringify(e.respuesta).includes('"negrita"');
    if (conLetras) assert.ok(!nombra, `${e.titulo}: la figura tiene puntos con letras; el resuelto no nombra alternativas por su letra`);
    else assert.match(r, new RegExp(`^${'ABCDE'[k]}, `), `${e.titulo}: la respuesta empieza por su letra`);
  }
  assert.ok(new Set(letras).size >= 4, `la correcta se reparte entre las letras: ${letras.join('')}`);
});

// ---------- «Ahora tú» y «Así se resuelve», con un cálculo aparte desde el texto ----------
const VUELTAS = { 'un cuarto de vuelta': 1 / 4, 'un tercio de vuelta': 1 / 3, 'media vuelta': 1 / 2, 'dos tercios de vuelta': 2 / 3, 'tres cuartos de vuelta': 3 / 4, 'una vuelta': 1,
  'una vuelta y cuarto': 5 / 4, 'una vuelta y un tercio': 4 / 3, 'una vuelta y media': 3 / 2, 'una vuelta y tres cuartos': 7 / 4, 'dos vueltas': 2, 'dos vueltas y cuarto': 9 / 4, 'dos vueltas y media': 5 / 2, 'tres vueltas': 3 };
const signoDe = frase => (/izquierda|antihorario/.test(frase) ? 1 : /derecha|horario/.test(frase) ? -1 : NaN);
// «2 vueltas y 1/4, horario» → −810 (grados con signo).
function gradosDe(txt) {
  const m = /^(?:(\d+) vueltas?)?(?: y )?(?:(\d+)\/(\d+)(?: de vuelta)?)?, (antihorario|horario)$/.exec(txt);
  if (!m) return NaN;
  return (m[4] === 'horario' ? -1 : 1) * 360 * ((+m[1] || 0) + (m[2] ? m[2] / m[3] : 0));
}

test(`idea 1, «Ahora tú»: cuatro opciones, datos, y la correcta cuadra con un cálculo aparte (${SEMILLAS} semillas)`, () => {
  const tipos = [0, 0, 0];
  for (let s = 0; s < SEMILLAS; s++) {
    const c = I1.ahoraTu.generar(s), q = plano(c.pregunta), ops = c.opciones.map(o => plano(o.texto)), bien = plano(c.opciones.find(o => o.correcta).texto);
    assert.equal(c.opciones.length, 4, `semilla ${s}: ${ops}`);
    assert.equal(new Set(ops).size, 4, `semilla ${s}: opciones repetidas`);
    assert.equal(c.opciones.filter(o => o.correcta).length, 1);
    for (const o of c.opciones.filter(x => !x.correcta)) assert.ok(o.error && o.siFuera && Teoria.palabras(o.siFuera) <= 20, `semilla ${s}: ${o.id}`);
    assert.ok(Array.isArray(c.datos) && c.datos.length >= 2, `semilla ${s}: sin datos`);
    // Los datos no traen la respuesta (un número suelto se busca entero: «18» no es el «180°» del llano).
    const enDatos = /^[\d,]+$/.test(bien) ? new RegExp(`(?<![\\d,−])${bien}(?![\\d,°])`).test(plano(c.datos)) : plano(c.datos).includes(bien);
    assert.ok(!enDatos, `semilla ${s}: los datos traen la respuesta`);
    let m;
    if ((m = /(\d+)° (.+?) y, sin soltarl[oa], (\d+)° (.+?)\. ¿Cuánto mide el giro total\?$/.exec(q))) {
      tipos[0]++;
      const total = signoDe(m[2]) * +m[1] + signoDe(m[4]) * +m[3];
      assert.equal(num(bien.replace('°', '')), total, `semilla ${s}: ${q}`);
      assert.notEqual(total, 0);
      // La figura muestra solo el primer giro.
      assert.equal(c.dibujo.datos.giros.length, 1); assert.equal(c.dibujo.datos.giros[0].mide, signoDe(m[2]) * +m[1]);
    } else if ((m = /giró θ = (−?\d+)°\. ¿Cuántas vueltas dio y en qué sentido\?$/.exec(q))) {
      tipos[1]++;
      assert.equal(gradosDe(bien), num(m[1]), `semilla ${s}: ${q} → ${bien}`);
      assert.ok(!(c.dibujo.datos.giros || []).length, 'la figura no dibuja el giro (se contarían las vueltas)');
    } else if ((m = /α = \((\d+)x \+ (\d+)\)° gira de OM a ON y β = \((\d+) − (\d*)x\)°, de O([QP]) a ON\. OM y O[QP] (forman una línea recta|son perpendiculares)\. ¿Cuánto vale x\?$/.exec(q))) {
      tipos[2]++;
      const [p, q0, u, w] = [+m[1], +m[2], +m[3], m[4] === '' ? 1 : +m[4]], T = m[6] === 'son perpendiculares' ? 90 : 180;
      // α antihorario y β horario (negativo): |α| + |β| = T, o sea α − β = T.
      const x = (T - q0 + u) / (p + w), alfa = p * x + q0, beta = u - w * x;
      assert.equal(num(bien), x, `semilla ${s}: ${q}`);
      assert.ok(alfa > 0 && beta < 0 && Math.abs(alfa - beta - T) < 1e-9, `semilla ${s}: α = ${alfa}, β = ${beta}`);
      // La figura es fiel: OB está a α de OA, y el otro rayo, a T.
      const rs = Object.fromEntries(c.dibujo.datos.rayos.map(r => [r.id, r.ang]));
      assert.equal(rs.N - rs.M, alfa); assert.equal(rs[m[5]] - rs.M, T);
      assert.equal(m[5], T === 90 ? 'P' : 'Q');
    } else assert.fail(`semilla ${s}: pregunta de un tipo que la prueba no conoce: ${q}`);
  }
  assert.ok(tipos.every(n => n > 100), `los tres tipos salen parejo: ${tipos}`);
});

test(`idea 1, «Así se resuelve»: cuadra con un cálculo aparte y no hace la pregunta de «Ahora tú» (${SEMILLAS} semillas)`, () => {
  const deAhora = new Set();
  for (let s = 0; s < SEMILLAS; s++) deAhora.add(plano(I1.ahoraTu.generar(s).pregunta).replace(/−?\d+(,\d+)?/g, '#'));
  const vistos = new Set();
  for (let s = 0; s < SEMILLAS; s++) {
    const c = I1.resuelve.generar(s), q = plano(c.enunciado);
    assert.ok(!deAhora.has(q.replace(/−?\d+(,\d+)?/g, '#')), `semilla ${s}: es la misma pregunta de «Ahora tú»`);
    const frase = Object.keys(VUELTAS).sort((a, b) => b.length - a.length).find(k => q.includes(` ${k} `));
    assert.ok(frase, `semilla ${s}: ${q}`);
    const g = signoDe(q) * 360 * VUELTAS[frase];
    assert.equal(plano(c.respuesta), `θ = ${Kit.formatear(g, 0).replace(/\s/g, '')}°`, `semilla ${s}: ${q}`);
    assert.ok(Array.isArray(c.datos) && c.datos.length >= 2);
    assert.deepEqual(c.pasos.map(p => p.tipo), ['pide', 'datos', 'regla', 'cuentas', 'aplica', 'sentido']);
    // La figura del enunciado lleva «?»; el valor aparece recién en el paso que lo calcula.
    assert.ok(!/\d/.test(Teoria.textoSVG(svgDe(c.dibujo))));
    vistos.add(q);
  }
  assert.ok(vistos.size >= 30, `${vistos.size} enunciados distintos`);
});

test('glosario: la idea 1 estrena de 2 a 4 palabras con su aproximación y tres ejemplos; ninguna delata la predicción', () => {
  const es = Glosario.porIdea(def)[0].filter(e => e.simple);
  assert.ok(es.length >= 2 && es.length <= 4, es.map(e => e.termino).join(', '));
  for (const e of es) {
    assert.ok(Teoria.palabras(e.simple) <= 14, e.termino);
    assert.ok((e.ejemplos || []).length >= 3, `${e.termino}: tres ejemplos`);
    assert.ok(!/suma|negativ|positiv/.test(e.simple), `${e.termino}: su aproximación dice lo que la predicción pregunta`);
  }
});

// ---------- Ideas 2 a 5 (fase 3, 19 nov) ----------
// Lo que el validador común no mira: la regla de colores por sistema, los 15 ejemplos con sus alternativas, la misión
// con una sola salida, que nada antes de Predice deje leer la respuesta en el juego, y «Ahora tú» y «Así se resuelve»
// recalculados desde el texto por otro camino (todo a fracción de vuelta: 360°, 400ᵍ, 2π rad; las condiciones con S y C
// se despejan con S = 360f y C = 400f, sin k), en 400 semillas. Las cuentas de los ejemplos, con sus distractores, están
// rehechas aparte en el scratchpad (cuentas-ideas2a5.js, 138 cuentas).
const VU = { s: 360, c: 400, r: 2 * Math.PI };
const cv = (x, de, a) => x / VU[de] * VU[a];
const IDEAS_2A5 = ['tres-sistemas', 'minutos-decimales', 'radian', 'formula-general'];
// Una alternativa como número: «40,5°», «−150ᵍ», «47° 10′», «3π/20 rad» (en radianes), «2,5 rad», «19».
function valorDe(t) {
  const s0 = t.replace(/^≈ /, '').trim();
  let m = s0.match(/^(−?)(\d+)° (\d+)′$/);
  if (m) return (m[1] ? -1 : 1) * (+m[2] + m[3] / 60);
  m = s0.match(/^(−?)(\d*)π(?:\/(\d+))?(?: rad)?$/);
  if (m) return (m[1] ? -1 : 1) * (m[2] ? +m[2] : 1) * Math.PI / (m[3] ? +m[3] : 1);
  return num(s0.replace(/ rad$/, '').replace(/[°ᵍᵐˢ′″]$/, ''));
}
// El ángulo pedido, desde el texto de la pregunta; devuelve [valor, unidad del texto] o null si el tipo no se conoce.
const UNI = { sexagesimales: 's', centesimales: 'c' };
function esperado(q) {
  let m;
  if ((m = /mide (−?[\d,]+)(ᵍ|°)\. ¿Cuánto mide en grados (sexagesimales|centesimales)\?$/.exec(q))) return cv(num(m[1]), m[2] === 'ᵍ' ? 'c' : 's', UNI[m[3]]);
  if ((m = /mide (−?[\d,]+)(ᵍ|°)\. ¿Cuánto mide su (complemento|suplemento), en grados (sexagesimales|centesimales)\?$/.exec(q))) {
    const fr = (m[3] === 'complemento' ? 0.25 : 0.5) - num(m[1]) / VU[m[2] === 'ᵍ' ? 'c' : 's'];
    return fr * VU[UNI[m[4]]];
  }
  if ((m = /triángulo miden (.+?) y (.+?)\. ¿Cuánto mide el tercero, en (grados sexagesimales|grados centesimales|radianes)\?$/.exec(q))) {
    const fr = t => (/ᵍ$/.test(t) ? valorDe(t) / 400 : /°$/.test(t) ? valorDe(t) / 360 : valorDe(t) / (2 * Math.PI));
    const f0 = 0.5 - fr(m[1]) - fr(m[2]);
    return f0 * (m[3] === 'radianes' ? 2 * Math.PI : m[3] === 'grados sexagesimales' ? 360 : 400);
  }
  if ((m = /mide (\d+)° (\d+)′\. ¿Cuánto mide en grados, con decimales\?$/.exec(q))) return +m[1] + m[2] / 60;
  if ((m = /mide ([\d,]+)°\. ¿Cuántos minutos sexagesimales son, en total\?$/.exec(q))) return num(m[1]) * 60;
  if ((m = /mide (\d+)ᵍ (\d+)ᵐ\. ¿Cuánto mide en grados centesimales, con decimales\?$/.exec(q))) return +m[1] + m[2] / 100;
  if ((m = /diferencia entre un ángulo de (\d+)° (\d+)′ y otro de (\d+)° (\d+)′\?$/.exec(q))) return (+m[1] + m[2] / 60) - (+m[3] + m[4] / 60);
  if ((m = /mide (\d+)° (\d+)′\. ¿Cuánto mide su complemento\?$/.exec(q))) return 90 - (+m[1] + m[2] / 60);
  if ((m = /avanza durante (\d+) minutos\. ¿Cuántos minutos centesimales/.exec(q))) return +m[1] / 60 * 400 * 100;
  if ((m = /mide (\d+)([′ᵐ″]), (minutos|segundos) (sexagesimales|centesimales)\. ¿Cuántos (minutos|segundos) (sexagesimales|centesimales) mide\?$/.exec(q))) {
    const partes = { '′': 60, 'ᵐ': 100, '″': 3600 }[m[2]], aSex = m[6] === 'sexagesimales';
    const grados = +m[1] / partes, otro = cv(grados, m[4] === 'sexagesimales' ? 's' : 'c', aSex ? 's' : 'c');
    return otro * (m[5] === 'segundos' ? (aSex ? 3600 : 10000) : (aSex ? 60 : 100));
  }
  if ((m = /mide (−?[\d,]+)(ᵍ|°)\. ¿Cuánto mide en radianes\?$/.exec(q))) return cv(num(m[1]), m[2] === 'ᵍ' ? 'c' : 's', 'r');
  if ((m = /mide ([\d,]+) rad, así, sin π\. ¿Cuánto mide, aproximadamente, en grados sexagesimales\?$/.exec(q))) return cv(num(m[1]), 'r', 's');
  if ((m = /tiene (\d+) cm de radio\. Sobre su llanta se acuesta una pita de ([\d,]+) cm\./.exec(q))) return num(m[2]) / +m[1];
  if ((m = /mide (.+ rad)\. ¿Cuánto mide en grados sexagesimales\?$/.exec(q))) return cv(valorDe(m[1]), 'r', 's');
  if ((m = /cumplen (.+) = (\d+)\. ¿Cuánto mide el ángulo, en (grados sexagesimales|grados centesimales|radianes)\?$/.exec(q))) {
    const F = { 'C − S': (S, C) => C - S, 'S + C': (S, C) => S + C, '2S − C': (S, C) => 2 * S - C, '3C − 2S': (S, C) => 3 * C - 2 * S,
      'S / 3 + C / 5': (S, C) => S / 3 + C / 5, 'C / 2 − S / 3': (S, C) => C / 2 - S / 3 }[m[1]];
    assert.ok(F, `condición desconocida: ${m[1]}`);
    const fr = +m[2] / F(360, 400);
    return fr * (m[3] === 'radianes' ? 2 * Math.PI : m[3] === 'grados sexagesimales' ? 360 : 400);
  }
  if ((m = /¿cuánto vale \((.+)\) \/ \((.+)\)\?$/.exec(q))) {
    const ev = e => { const S = 360 / 7, C = 400 / 7; return Function('S', 'C', `return ${e.replace(/−/g, '-').replace(/(\d)([SC])/g, '$1*$2')}`)(S, C); };
    return ev(m[1]) / ev(m[2]);
  }
  return null;
}
const PALETA = { 'tres-sistemas': ['c-h', 'c-i'], 'minutos-decimales': ['c-h', 'c-i'], radian: ['c-h', 'c-i', 'c-f', 'c-o'], 'formula-general': ['c-h', 'c-i', 'c-f'] };

test(`ideas 2 a 5, «Ahora tú»: cuatro opciones con su error, datos sin la respuesta, y la correcta cuadra con un cálculo aparte desde el texto (${SEMILLAS} semillas)`, () => {
  for (const id of IDEAS_2A5) {
    const I = idea(id), vistos = new Set();
    for (let s = 0; s < SEMILLAS; s++) {
      const c = I.ahoraTu.generar(s), q = plano(c.pregunta), ops = c.opciones.map(o => plano(o.texto)), bien = plano(c.opciones.find(o => o.correcta).texto);
      assert.equal(c.opciones.length, 4, `${id} ${s}: ${ops}`);
      assert.equal(new Set(ops).size, 4, `${id} ${s}: opciones repetidas`);
      for (const o of c.opciones.filter(x => !x.correcta)) assert.ok(o.error && o.siFuera && Teoria.palabras(o.siFuera) <= 20, `${id} ${s}: ${o.id}`);
      assert.ok(Array.isArray(c.datos) && c.datos.length >= 1, `${id} ${s}: sin datos`);
      assert.ok(!plano(c.datos).includes(` ${bien}`) || bien.length < 3, `${id} ${s}: los datos traen ${bien}`);
      const e = esperado(q);
      assert.ok(e !== null, `${id} ${s}: pregunta de un tipo que la prueba no conoce: ${q}`);
      // La correcta, leída como número, es la cuenta (con el redondeo de su texto); ningún distractor la iguala.
      const tol = /≈|aproximadamente/.test(q) || /,\d$/.test(bien.replace(/[°ᵍ]$/, '')) ? 0.051 : 1e-6;
      assert.ok(Math.abs(valorDe(bien) - e) <= tol, `${id} ${s}: ${q} → ${bien} (la cuenta da ${e})`);
      for (const o of ops.filter(x => x !== bien)) assert.ok(Math.abs(valorDe(o) - e) > 1e-6 || /° \d+′/.test(o), `${id} ${s}: el distractor ${o} también vale ${e}`);
      for (const col of colores([c.pregunta, c.datos, c.solucion])) assert.ok(PALETA[id].includes(col), `${id} ${s}: color ${col} fuera de la regla`);
      // La figura muestra el planteamiento: no escribe la respuesta (ni en la escala del transportador).
      if (c.dibujo && bien.length >= 3) assert.ok(!Teoria.textoSVG(svgDe(Object.assign({ pieza: I.ahoraTu.pieza || I.pieza }, c.dibujo))).includes(bien), `${id} ${s}: la figura trae ${bien}`);
      vistos.add(q.replace(/−?\d+(,\d+)?/g, '#'));
    }
    assert.ok(vistos.size >= 3, `${id}: ${vistos.size} formas de pregunta`);
  }
});

test(`ideas 2 a 5, «Así se resuelve»: cuadra con un cálculo aparte, seis pasos, y no hace la pregunta de «Ahora tú» (${SEMILLAS} semillas)`, () => {
  for (const id of IDEAS_2A5) {
    const I = idea(id), deAhora = new Set();
    for (let s = 0; s < SEMILLAS; s++) deAhora.add(plano(I.ahoraTu.generar(s).pregunta).replace(/−?\d+(,\d+)?/g, '#'));
    for (let s = 0; s < SEMILLAS; s++) {
      const c = I.resuelve.generar(s), q = plano(c.enunciado), r = plano(c.respuesta);
      assert.ok(!deAhora.has(q.replace(/−?\d+(,\d+)?/g, '#')), `${id} ${s}: es la misma pregunta de «Ahora tú»`);
      assert.ok(c.pasos.length >= 5 && c.pasos[0].tipo === 'pide' && c.pasos[c.pasos.length - 1].tipo === 'sentido', `${id} ${s}: pasos`);
      assert.ok(Array.isArray(c.datos) && c.datos.length >= 1);
      let m;
      if (id === 'tres-sistemas') { m = /mide (−?\d+)°\./.exec(q); assert.ok(Math.abs(valorDe(r) - cv(+m[1].replace('−', '-'), 's', 'c')) < 1e-9, `${s}: ${q} → ${r}`); }
      else if (id === 'minutos-decimales') { m = /mide (\d+)° (\d+)′ (\d+)″/.exec(q); assert.ok(Math.abs(valorDe(r) - (+m[1] + m[2] / 60 + m[3] / 3600)) < 0.0006, `${s}: ${q} → ${r}`); }
      else if (id === 'radian') { m = /mide (.+ rad)\./.exec(q); assert.ok(Math.abs(valorDe(r) - cv(valorDe(m[1]), 'r', 's')) < 1e-9, `${s}: ${q} → ${r}`); }
      else {
        m = /mide (\d+)(°|ᵍ)\./.exec(q);
        const fr = +m[1] / (m[2] === '°' ? 360 : 400), [S0, C0, R0] = r.split(', ').map(x => x.split(' = ')[1]);
        assert.equal(num(S0), Math.round(360 * fr)); assert.equal(num(C0), Math.round(400 * fr));
        assert.ok(Math.abs(valorDe(R0) - 2 * Math.PI * fr) < 1e-9, `${s}: R = ${R0}`);
      }
      // La figura del enunciado no trae la respuesta.
      if (c.dibujo) { const fig = Teoria.textoSVG(svgDe(Object.assign({ pieza: I.resuelve.pieza || I.pieza }, c.dibujo))); assert.ok(!fig.includes(r.replace(/^.* = /, '')) || r.length < 3, `${id} ${s}: la figura trae ${r}`); }
    }
  }
});

test('ideas 2 a 5: contrato (objeto en «Lee», misión con una sola salida, leyenda, 15 ejemplos con datos) y el juego no muestra la respuesta de Predice', () => {
  const OBJ = { 'tres-sistemas': 'transportador', 'minutos-decimales': 'lupa', radian: 'rueda', 'formula-general': 'calculadora' };
  const RESP = { 'tres-sistemas': '40,5°', 'minutos-decimales': '50ᵐ', radian: '2π: unas 6,28', 'formula-general': '27°' };
  for (const id of IDEAS_2A5) {
    const I = idea(id);
    assert.ok(I.aprendizaje && Teoria.palabras(I.aprendizaje) <= 25 && I.actividad && /\?$/.test(I.pregunta), id);
    assert.equal(I.lee.tarjetas[0].dibujo.datos.objeto, OBJ[id], `${id}: la primera pantalla es un objeto`);
    assert.equal(I.juega.dibujo(Teoria.inicio(I.juega)).datos.objeto, OBJ[id]);
    const cumplen = Teoria.grilla(I.juega.controles).filter(v => I.juega.mision.logrado(v));
    assert.equal(cumplen.length, 1, `${id}: la misión tiene ${cumplen.length} salidas`);
    assert.ok(!I.juega.mision.logrado(Teoria.inicio(I.juega)), `${id}: la misión ya está cumplida al abrir`);
    assert.ok(I.juega.leyenda.length >= 3);
    assert.equal(plano(I.predice.opciones.find(o => o.correcta).texto), RESP[id]);
    // Ninguna lectura ni figura del juego escribe la respuesta de la predicción.
    const r = RESP[id].replace(/:.*/, '');
    for (const v of Teoria.grilla(I.juega.controles)) {
      const t = plano(I.juega.lectura(v)) + ' ' + Teoria.textoSVG(svgDe(Object.assign({ pieza: I.juega.pieza }, I.juega.dibujo(v))));
      assert.ok(!t.includes(r) || id === 'radian', `${id} ${JSON.stringify(v)}: el juego muestra ${r}`);
      if (id === 'formula-general') assert.ok(!/57/.test(t), 'el juego no muestra la suma S + C de la predicción');
    }
    assert.equal(I.ejemplos.length, 15);
    for (const nv of [1, 2, 3]) assert.equal(I.ejemplos.filter(e => e.nivel === nv).length, 5, `${id} nivel ${nv}`);
    for (const [k, e] of I.ejemplos.entries()) {
      assert.ok(Array.isArray(e.datos) && e.datos.length, `${id} ejemplo ${k + 1}: sin datos`);
      if (e.nivel === 3) {
        assert.equal(new Set(e.alternativas).size, 5, `${id} ejemplo ${k + 1}`);
        const v = plano(e.respuesta).replace(/^[A-E], /, '').replace(/^≈ /, '').replace(/^x = /, '');
        assert.ok(e.alternativas.includes(v), `${id} ejemplo ${k + 1}: «${v}» no está entre las alternativas`);
      }
      for (const col of colores([e.enunciado, e.datos, e.solucion, e.respuesta])) assert.ok(PALETA[id].includes(col), `${id} ejemplo ${k + 1}: color ${col}`);
    }
  }
  // La rueda: en el juego no pasa de 2,5 pitas, así la vuelta entera (la predicción) no se ve.
  for (const v of Teoria.grilla(idea('radian').juega.controles)) assert.ok(v.n <= 2.5);
});

test('regla de colores en los textos: ° en carmín, ᵍ en turquesa, π y rad en violeta (todas las ideas)', () => {
  const mal = [];
  const mira = (x, donde) => {
    if (Array.isArray(x)) return x.forEach(y => mira(y, donde));
    if (!x || typeof x !== 'object') return;
    if (typeof x.v === 'string' && typeof x.t === 'string') {
      if (/[ᵍᵐˢ]/.test(x.t) && x.v !== 'c-i') mal.push(`${donde}: «${x.t}» en ${x.v}`);
      if (/π|rad\b/.test(x.t) && !/[°ᵍ]/.test(x.t) && x.v !== 'c-f') mal.push(`${donde}: «${x.t}» en ${x.v}`);
      if (/^[^ᵍπ]*[°′″]$/.test(x.t) && x.v !== 'c-h') mal.push(`${donde}: «${x.t}» en ${x.v}`);
    }
    for (const [k, y] of Object.entries(x)) if (k !== 'v' && k !== 't' && typeof y === 'object') mira(y, donde);
  };
  for (const I of def.ideas) {
    mira([I.lee.tarjetas.map(t => t.texto), I.juega.consigna, I.juega.leyenda, I.predice.pregunta, I.predice.datos, I.regla.ecuacion], I.id);
    I.mira.pasos.forEach((p, k) => mira([p.texto, p.ecuacion], `${I.id} mira ${k + 1}`));
    I.ejemplos.forEach((e, k) => mira([e.enunciado, e.datos, e.solucion, e.respuesta], `${I.id} ejemplo ${k + 1}`));
    for (let s = 0; s < 60; s++) { const a = I.ahoraTu.generar(s), r = I.resuelve.generar(s); mira([a.pregunta, a.datos, a.solucion, r.enunciado, r.datos, r.pasos, r.respuesta], `${I.id} ${s}`); }
  }
  assert.deepEqual(mal.slice(0, 20), []);
});
