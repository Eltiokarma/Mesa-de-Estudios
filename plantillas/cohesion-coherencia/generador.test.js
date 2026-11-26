// Pruebas de «Cohesión y coherencia»: casos.json (calculados aparte), un recálculo por otro camino en 600 problemas,
// fugas, los tipos por idea, el recuadro «Datos» y que el banco cuadre entero. El recálculo no usa las funciones del
// generador: la tabla de abajo (el juez) se escribió leyendo cada texto del banco, y dice cuál alternativa cumple y el
// código de cada incorrecta.
const test = require('node:test');
const assert = require('node:assert/strict');
const gen = require('./generador.js');
const casos = require('./casos.json');
const { probarGenerador, probarFugas } = require('../../nucleo/probar-generador.js');

// Juez aparte de la práctica: lo escribí leyendo cada texto del banco, sin las funciones del generador.
// correcta: lo que cumple en cada ítem. codigo(item, texto): el código de una incorrecta, desde las definiciones.
const RAZON = { choque: 'Sí: afirman y niegan lo mismo a la vez', tiempo: 'No: cada una habla de un tiempo distinto',
  persona: 'No: cada una dice lo que cree otra persona', parte: 'No: cada una habla de una parte distinta' };
const CONTRA = { tienda: 'choque', ninguno: 'choque', lago: 'choque', tanque: 'choque', pasaje: 'tiempo', tio: 'tiempo', pelicula: 'persona', lluvia: 'persona', chompa: 'parte', casa: 'parte' };
const correcta = Object.assign(Object.fromEntries(Object.entries(CONTRA).map(([k, v]) => [k, RAZON[v]])), {
  cuaderno: 'Al cuaderno', gallinas: 'A las gallinas', pelota: 'A la mochila', directora: 'A la profesora', aviso: 'Al corte de agua del lunes en la mañana',
  robo: 'A que rompieran el candado', tios: 'A mis tíos', perro: 'Al veterinario',
  feria: 'vende', danza: 'presentaron', yo: 'llevas', medico: 'La enfermera', llama: 'Este animal', trucha: 'Este pescado', quena: 'Este instrumento', colca: 'Este cañón',
  cancha: 'Antes, si llovía, no había partido.', tejedoras: 'Con la lana hacen chullos, fajas y chalecos.', pozo: 'El pozo da agua limpia todo el año.',
  radio: 'Cada viernes, la radio emite dos programas.', vicuñas: 'Cada dos años, las esquilan en un chaccu.',
  charango: 'La 5', mercado: 'La 5', huerto: 'La 5', bici: 'La 4', ciencias: 'La 5',
});
// Códigos por clase de error (informe, sección RVK). Las razones de la idea 1: «Sí: dicen cosas opuestas» ve choque
// donde no hay (RVK2); el conector o la buena escritura (RVK1); «hablan de lo mismo» (RVK3); un cambio que el texto no
// dice (RVK18); «solo una excepción» no ve el choque (RV9).
const C1 = { 'Sí: dicen cosas opuestas': 'RVK2', 'Sí: les falta un conector que las una': 'RVK1', 'No: las dos hablan de lo mismo, sin pelear': 'RVK3', 'Sí: las dos oraciones hablan de la misma cosa': 'RVK3',
  'No: la segunda solo cuenta una excepción': 'RV9', 'No: las dos oraciones están bien escritas': 'RVK1', 'No: el conector une bien las dos oraciones': 'RVK1',
  'No: son de dos momentos': 'RVK18', [RAZON.tiempo]: 'RVK18', [RAZON.persona]: 'RVK18', [RAZON.parte]: 'RVK18' };
const POR = {
  // referentes: después (RVK15), antes (RVK4), falta (RVK8), no concuerda (RVK14), el más cercano sin sentido (RV27),
  // concuerda sin sentido (RVK6), un nombre en vez del hecho (RVK5), parte del hecho (RVK7).
  cuaderno: { 'Al escritorio': 'RV27', 'A Rosa': 'RVK14', 'Al plástico, que viene después': 'RVK15' },
  gallinas: { 'A las chacras': 'RV27', 'A mi abuela': 'RVK14', 'Al maíz, que viene después': 'RVK15' },
  pelota: { 'A la pelota': 'RVK6', 'A Luis': 'RVK14', 'A algo que viene después': 'RVK15' },
  directora: { 'A la directora': 'RVK6', 'Al concurso de canto': 'RVK14', 'A nadie: debió repetir el nombre': 'RVK8' },
  aviso: { 'Al alcalde, que lo dice': 'RVK6', 'Al lunes, una palabra que viene': 'RVK5', 'A algo que el alcalde dijo antes, en otro aviso': 'RVK4', 'Al agua de la ciudad': 'RVK7' },
  robo: { 'Al candado': 'RVK5', 'Al quiosco, el último nombre': 'RV27', 'A lo que viene después': 'RVK15', 'A los vecinos': 'RVK6' },
  tios: { 'A los dos costales': 'RV27', 'A Juliaca': 'RVK14', 'A la familia, que viene después': 'RVK15' },
  perro: { 'A su perro': 'RVK6', 'A Carmen': 'RVK14', 'A la vacuna, que viene después': 'RVK15' },
  // recursos: otra palabra (RVK7), otra persona (RVK16), «está incompleta» (RVK8), no le corresponde (RVK17), no
  // concuerda (RVK14), otro nombre del texto (RVK7), concuerda pero no tiene sentido (RVK6).
  feria: { queso: 'RVK7', 'mi papá': 'RVK16', 'nada: la oración está incompleta': 'RVK8' },
  danza: { caporales: 'RVK7', 'los de cuarto': 'RVK16', 'nada: la oración está incompleta': 'RVK8' },
  yo: { llevo: 'RVK16', 'las sillas': 'RVK7', 'nada: la oración está incompleta': 'RVK8' },
  medico: { 'Don Julio': 'RVK16', 'La presión': 'RVK7', 'Nadie: falta quién se la dio': 'RVK8' },
  llama: { 'Este cerro': 'RVK17', Ellos: 'RVK14', 'Las alturas': 'RVK7', 'Esta planta': 'RVK6' },
  trucha: { 'Este animal de carga': 'RVK17', Ellas: 'RVK14', 'El lago': 'RVK7', 'Esta fruta': 'RVK6' },
  quena: { 'Este pueblo': 'RVK17', 'Él': 'RVK14', 'La banda del colegio de mi primo': 'RVK7', 'Esta comida': 'RVK6' },
  colca: { 'Esta laguna': 'RVK17', Ellas: 'RVK14', Arequipa: 'RVK7', 'Este animal': 'RVK6' },
  // inclusión: choca (RV9), solo antes (RVK12), solo después (RVK11), otro tema (RVK3).
  cancha: { 'La cancha mide treinta metros de largo.': 'RVK12', 'Los partidos de vóley son los viernes.': 'RVK11', 'La cancha sigue sin techo hasta hoy.': 'RV9', 'La biblioteca tiene libros nuevos.': 'RVK3' },
  tejedoras: { 'Las familias de la isla son numerosas.': 'RVK12', 'Las prendas de algodón se lavan fácil y se secan rápido.': 'RVK11', 'Nadie en la isla sabe tejer prendas.': 'RV9', 'El bus a Juliaca sale a las seis.': 'RVK3' },
  pozo: { 'El pozo tiene un brocal de piedra.': 'RVK12', 'El agua de lluvia se junta en baldes.': 'RVK11', 'El pozo se secó a la semana de abrirlo.': 'RV9', 'Los niños juegan fútbol en la plaza.': 'RVK3' },
  radio: { 'La radio funciona en la sala de cómputo.': 'RVK12', 'Los programas de televisión son largos y aburridos.': 'RVK11', 'La radio nunca ha emitido un programa.': 'RV9', 'El quiosco de la esquina vende emoliente.': 'RVK3' },
  vicuñas: { 'Las vicuñas viven en la puna.': 'RVK12', 'La fibra de oveja es más gruesa y se vende en Juliaca.': 'RVK11', 'A esas vicuñas nunca se les saca fibra.': 'RV9', 'La plaza del pueblo tiene bancas nuevas.': 'RVK3' },
  // hilo: vuelve al tema (RVK9), parte de lo nuevo de la anterior (RVK10), «Ninguna» (RVK3), la 1 (RV28).
  charango: { 'La 4': 'RVK9', 'La 2': 'RVK10' }, mercado: { 'La 4': 'RVK9', 'La 2': 'RVK10' }, huerto: { 'La 3': 'RVK9', 'La 2': 'RVK10' },
  bici: { 'La 3': 'RVK9', 'La 2': 'RVK10' }, ciencias: { 'La 4': 'RVK9', 'La 2': 'RVK10' },
};
const HILO = { charango: 1, mercado: 1, huerto: 1, bici: 1, ciencias: 1 };
function codigo(item, t) {
  if (CONTRA[item]) return C1[t];
  if (HILO[item]) return { Ninguna: 'RVK3', 'La 1': 'RV28' }[t] || POR[item][t];
  return POR[item][t];
}

const items = ['CONTRA', 'REF', 'REC', 'HILO', 'INC'].flatMap(b => gen[b]);

test('los ids del banco no se repiten, y el juez conoce cada ítem', () => {
  assert.equal(new Set(items.map(i => i.id)).size, items.length);
  for (const it of items) assert.ok(correcta[it.id], `el juez no conoce ${it.id}`);
});

function recalcular(p) {
  const it = p._datos.item, b = p.alternativas.filter(a => a.texto === correcta[it]);
  assert.equal(b.length, 1, `${it}: ${b.length} alternativas con «${correcta[it]}»`);
  for (const a of p.alternativas.filter(x => !x.correcta)) assert.equal(a.error.id, codigo(it, a.texto), `${it} «${a.texto}»`);
  return `ok:${b[0].texto}`;
}
probarGenerador(gen, { semillas: 600, recalcular, igual: (a, b) => a === b });
probarFugas(gen, { grupo: p => p._datos.tipo });

for (const c of casos.casos) {
  test(`casos.json: ${c.semilla}`, () => {
    const p = gen.generar(c.semilla, { idea: c.idea });
    assert.deepEqual({ tipo: p._datos.tipo, item: p._datos.item }, c.entrada, 'el generador cambió: recalcula casos.json');
    assert.equal(p.alternativas.find(a => a.correcta).texto, c.esperado.texto);
    assert.deepEqual(p.alternativas.filter(a => a.error).map(a => [a.texto, a.error.id]).sort(), c.esperado.errores.slice().sort());
  });
}

test('cada idea tiene sus tipos, salen los dos niveles, todos los ítems y todos los códigos', () => {
  assert.deepEqual(Object.keys(gen.TIPOS_POR_IDEA), ['no-contradiccion', 'referente', 'repetir-sustituir-callar', 'conocido-y-nuevo', 'incluir']);
  const ids = new Set(), niveles = new Set(), vistos = new Set();
  for (const idea of Object.keys(gen.TIPOS_POR_IDEA)) for (let s = 0; s < 300; s++) {
    const p = gen.generar(s, { idea });
    assert.equal(p._datos.idea, idea);
    assert.ok(gen.TIPOS_POR_IDEA[idea].includes(p._datos.tipo));
    assert.equal(p.alternativas.length, p._datos.nivel === 3 ? 5 : 4);
    niveles.add(p._datos.nivel); vistos.add(p._datos.item);
    for (const a of p.alternativas) if (a.error) ids.add(a.error.id);
  }
  assert.deepEqual([...niveles].sort(), [2, 3]);
  for (const it of items) assert.ok(vistos.has(it.id), `no sale ${it.id}`);
  const codigos = require('../../contenido/razonamiento-verbal/codigos.json');
  for (const id of ids) assert.ok(codigos[id], `${id} no está en codigos.json`);
  assert.ok(ids.size >= 18, `pocos códigos (${ids.size})`);
});

test('Datos: de 1 a 6 líneas de 22 palabras o menos, sin la respuesta ni consejos', () => {
  for (let s = 0; s < 400; s++) {
    const p = gen.generar(s);
    assert.ok(p.datos.length >= 1 && p.datos.length <= 6);
    for (const l of p.datos) {
      assert.ok(l.split(/\s+/).length <= 22, l);
      assert.ok(!/^(Recuerda|Ojo|Cuidado|Fíjate|No olvides)/.test(l), l);
      assert.ok(!l.includes(p.respuesta.texto), `semilla ${s}: «${l}» trae la respuesta`);
    }
  }
});

test('la correcta no es la más larga ni la más corta (un empate no delata), y no está escrita dentro de otra', () => {
  for (let s = 0; s < 600; s++) {
    const p = gen.generar(s), l = p.alternativas.map(a => a.texto.length), c = p.alternativas.find(a => a.correcta);
    const mx = Math.max(...l), mn = Math.min(...l);
    assert.ok(!(c.texto.length === mx && l.filter(x => x === mx).length === 1), `semilla ${s}: la más larga`);
    assert.ok(!(c.texto.length === mn && l.filter(x => x === mn).length === 1), `semilla ${s}: la más corta`);
    for (const a of p.alternativas) if (a !== c) assert.ok(!new RegExp(`(^|\\s)${c.texto.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(\\s|$)`).test(a.texto), `semilla ${s}: «${c.texto}» dentro de «${a.texto}»`);
  }
});

// Auditoría (26 nov): la correcta no se delata por la forma. Si todas las incorrectas empiezan con la misma palabra
// («No:») y la correcta con otra («Sí:»), se acierta sin leer el texto. Tampoco es la única con más palabras.
test('la correcta no es la única que empieza distinto, ni la única con más o menos palabras (400 semillas)', () => {
  const pri = t => ({ al: 'a', del: 'de' }[t.split(/[\s:,]/)[0].toLowerCase()] || t.split(/[\s:,]/)[0].toLowerCase()), pal = t => t.split(/\s+/).length;
  for (let s = 0; s < 400; s++) {
    const p = gen.generar(s), c = p.alternativas.find(a => a.correcta), ot = p.alternativas.filter(a => a !== c);
    const iniciales = new Set(ot.map(a => pri(a.texto)));
    assert.ok(!(iniciales.size === 1 && !iniciales.has(pri(c.texto))), `semilla ${s}: solo «${c.texto}» empieza distinto`);
    const n = ot.map(a => pal(a.texto));
    if (new Set(n.concat(pal(c.texto))).size > 1) {
      assert.ok(pal(c.texto) <= Math.max(...n) && pal(c.texto) >= Math.min(...n), `semilla ${s}: «${c.texto}» se delata por sus palabras`);
    }
  }
});
