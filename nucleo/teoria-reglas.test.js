// Reglas de calidad 2 de la teoría (nucleo/teoria-reglas.js, Etapa 5, 19 nov 2026): cada regla con un caso que la viola
// y uno que la cumple. Las unidades de verdad se prueban en contenido/teoria/teoria.test.js.
const test = require('node:test');
const assert = require('node:assert/strict');
const T = require('./teoria.js');
const R = require('./teoria-reglas.js');
const Kit = require('./kit/kit.js');

// Una pieza de prueba: escribe sus rótulos tal cual y, si se le pide, pinta con un color de variable.
Kit.registrar({
  id: 'prueba-reglas',
  dibujar: d => `<svg viewBox="0 0 10 10">${(d.rotulos || []).map(r => `<text x="1" y="5">${r}</text>`).join('')}${d.color ? `<path d="M0 0" stroke="var(--${d.color})"/>` : ''}</svg>`,
  alt: () => 'Una figura de prueba con sus rótulos.',
});
const fig = (...rotulos) => ({ pieza: 'prueba-reglas', datos: { rotulos } });
const f = (t, v = 'c-f') => ({ v, t });

const idea = (extra = {}) => Object.assign({ id: 'uno', titulo: 'Prueba', temas: ['x'], pieza: 'prueba-reglas' }, extra);
const unidad = (ideas, extra = {}) => Object.assign({ unidad: 'fisica.prueba', version: '0.1.0', calidad: 2, ideas: [].concat(ideas) }, extra);
const de = (regla, def, o = {}) => R.revisar(def, o, T).filter(h => h.regla === regla);
const predice = (pregunta, correcta, otras = ['otra cosa', 'ninguna'], extra = {}) => Object.assign({
  pregunta, opciones: [{ id: 'c', texto: correcta, correcta: true }, ...otras.map((t, i) => ({ id: `e${i}`, texto: t, siFuera: 'si…' }))],
}, extra);
// Un ejemplo de nivel 3 con alternativas; `resp` es la letra de la respuesta y `sol`, el texto del resuelto.
const ejAlt = (resp, sol = 'A, B, C, D y E: cada una sale de un error.', alts = ['7 m', '8 m', '9 m', '10 m', '11 m'], n = 0) => ({
  nivel: 3, titulo: `Caso ${n}`, enunciado: `Un lado mide ${n + 2} m. ¿Cuánto mide el otro?`, alternativas: alts, datos: ['1 m = 100 cm'],
  solucion: [{ texto: sol }], respuesta: [{ negrita: resp }, ', ', f(alts['ABCDE'.indexOf(resp)] || '8 m')],
});

test('glosario-predice: el glosario de la idea no trae el valor ni la frase que responde su Predice', () => {
  const con = (glosario, p) => unidad(idea({ lee: { tarjetas: [{ texto: 'Un doblez parte la hoja; la resultante suma.' }] }, predice: p }), { glosario });
  const hoja = predice('Una hoja se dobla 5 veces por la mitad. ¿Cuántas capas quedan?', '32 capas', ['10 capas', '25 capas']);
  const g = ejemplos => [{ termino: 'doblez', def: 'Plegar la hoja por la mitad.', simple: 'Partir la hoja en dos.', ejemplos }];
  // El valor, junto a los números de la pregunta.
  const mal = de('glosario-predice', con(g(['Un doblez deja 2 capas.', 'Con 5 dobleces quedan 32 capas.', 'El papel no se dobla más de 7 veces.']), hoja));
  assert.equal(mal.length, 1);
  assert.match(mal[0].donde, /glosario «doblez» \(ejemplo 2\)/);
  assert.deepEqual(de('glosario-predice', con(g(['Un doblez deja 2 capas.', 'Dos dobleces dejan 4 capas.', 'Una resma trae 32 paquetes.']), hoja)), [], 'el 32 solo, sin los números de la pregunta, no la delata');
  // Una respuesta de una sola cifra no se busca: está en cualquier ejemplo (falsos positivos en las unidades en proceso, 19 nov).
  const chica = predice('Una hoja se dobla 3 veces por la mitad. ¿Cuántas capas quedan?', '8 capas', ['6 capas', '3 capas']);
  assert.deepEqual(de('glosario-predice', con(g(['Un doblez deja 2 capas.', 'Con 3 dobleces quedan 8 capas.', 'x']), chica)), []);
  // La frase entera, en el `simple`.
  const vuelo = predice('Dos cóndores vuelan 300 m desde la plaza. ¿Dónde quedan?', 'Depende de hacia dónde vuela cada uno', ['En el mismo lugar']);
  const frase = [{ termino: 'resultante', def: 'La suma de dos flechas.', simple: 'Depende de hacia dónde vuela cada uno.', ejemplos: ['x', 'y', 'z'] }];
  assert.match(de('glosario-predice', con(frase, vuelo))[0].que, /la respuesta entera/);
  frase[0].simple = 'Lo que queda al juntar dos flechas.';
  assert.deepEqual(de('glosario-predice', con(frase, vuelo)), []);
});

test('antes-predice: Lee y el juego no traen la frase ni la cuenta que responde Predice', () => {
  const p = predice('Un terreno de 7 m de lado pierde dos franjas de 2 m. ¿Qué área queda?', '25 m²', ['45 m²', '21 m²']);
  const con = (lee, juega = {}) => unidad(idea({ predice: p, lee: { tarjetas: [{ texto: lee }, { texto: 'Otra tarjeta.' }] }, juega: Object.assign({ consigna: 'Mueve el lado.' }, juega) }));
  assert.match(de('antes-predice', con('Al quitar las franjas: 5 · 5 = 25 m² de terreno.'))[0].donde, /Lee tarjeta 1/);
  assert.match(de('antes-predice', con('El terreno.', { mision: { texto: 'Deja 9 m².', bien: 'Con 7 m quedarían 5 · 5 = 25 m².' } }))[0].donde, /misión/);
  assert.deepEqual(de('antes-predice', con('Un cuadrado de 5 m de lado tiene 5 filas de 5 cuadros.', { mision: { texto: 'Deja 9 m².', bien: 'Quedó un cuadrado de 3 m.' } })), []);
});

test('letras-datos: toda letra de Datos está dicha en el ejercicio o en la tabla de letras', () => {
  const con = (datos, enunciado = 'Una combi avanza 5 s a 12 m/s. ¿Dónde está?', extra = {}) => unidad(idea({ ejemplos: [{ nivel: 1, titulo: 'Uno', enunciado, datos, solucion: [{ texto: 'x' }], respuesta: [f('60 m')] }] }), extra);
  const mal = de('letras-datos', con(['Posición: x = x0 + v · t']));
  assert.equal(mal.length, 1);
  assert.match(mal[0].que, /«v», «t» sin decir qué son/, 'x está dicha por «Posición: x»; v y t, no');
  // Dichas en el mismo recuadro, en el enunciado, en def.letras, en el símbolo de un término del glosario o en el de una unidad que se pide.
  assert.deepEqual(de('letras-datos', con(['Posición: x = x0 + v · t', 'v: la velocidad; t: el tiempo'])), []);
  assert.deepEqual(de('letras-datos', con(['Posición: x = x0 + v · t'], 'Una combi va a v = 12 m/s durante t = 5 s. ¿Dónde está?')), []);
  assert.deepEqual(de('letras-datos', con(['Posición: x = x0 + v · t'], undefined, { letras: { v: 'velocidad', t: 'tiempo' } })), []);
  assert.deepEqual(de('letras-datos', con(['Posición: x = x0 + v · t'], undefined, { glosario: [{ termino: 'velocidad', simbolo: 'v' }, { termino: 'instante', simbolo: 't' }] })), []);
  assert.deepEqual(de('letras-datos', con(['Posición: x = x0 + v · t']), { letras: { v: 'velocidad', t: 'instante' } }), []);
  // Una identidad sobre letras cualesquiera, una glosa entre paréntesis y las unidades no piden nada.
  assert.deepEqual(de('letras-datos', con(['(a + b)² = a² + 2ab + b²', 'Rapidez: v = d / t (distancia entre tiempo)', '1 km = 1000 m y g = 10 m/s²', 'Razón 2 : 3: miden 2k y 3k, con k la medida de una parte.', 'La distancia recorrida, d, suma las áreas sin signo.'])), []);
  // Las partes de una ecuación también se leen: subíndice de letras (t_e) y componentes (A_x).
  const te = [[{ sub: [f('t', 'c-i'), 'e'] }, ' = ', { frac: ['D', [{ sub: ['v', 'A'] }, ' + ', { sub: ['v', 'B'] }]] }]];
  assert.match(de('letras-datos', con(te, 'Dos combis, A y B, salen a la vez.', { letras: { v: 'velocidad', t: 'tiempo' } }))[0].que, /«t_e», «D» sin decir/);
  assert.deepEqual(de('letras-datos', con([[{ sub: ['A', 'x'] }, ' = A cos θ, con θ medido desde el eje x']], 'Una fuerza de A = 50 N.')), []);
  // En química, las fórmulas y los subniveles no son letras de una fórmula.
  const q = unidad(idea({ ejemplos: [{ nivel: 1, titulo: 'Uno', enunciado: '¿Qué es el aire?', datos: ['Aire: N₂, O₂ y otros gases', 'Orden: 1s 2s 2p; caben 2 en un s', 'carga = Z − e⁻'], solucion: [{ texto: 'x' }], respuesta: [f('Mezcla')] }] }), { unidad: 'quimica.prueba', letras: { Z: 'protones' } });
  assert.deepEqual(de('letras-datos', q), []);
  // La tabla de letras tiene que ser { letra: «qué es» }.
  assert.match(de('letras-datos', con(['1 m = 100 cm'], undefined, { letras: ['v', 't'] }))[0].que, /la tabla de letras es/);
});

test('letra-repartida: en los ejemplos de nivel 3 y en «Ahora tú», ninguna letra pasa del 40 % ni falta (con 10 casos o más)', () => {
  const con = letras => unidad([0, 1].map(k => idea({ id: `i${k}`, ejemplos: letras.slice(k * 5, k * 5 + 5).split('').map((l, n) => ejAlt(l, undefined, undefined, k * 5 + n)) })));
  assert.match(de('letra-repartida', con('BBBBBACBBD'))[0].que, /la B es la correcta en 7 de 10 \(70 %/);
  assert.match(de('letra-repartida', con('ABCDABCDAB')).map(h => h.que).join('\n'), /la E nunca es la correcta en 10 casos/);
  assert.deepEqual(de('letra-repartida', con('ABCDEEDCBA')), []);
  assert.deepEqual(de('letra-repartida', con('BBBBB')), [], 'con menos de 10 casos no se mide');
  // «Ahora tú»: la letra es la que deja la app al barajar (T.barajar con semilla + 7).
  const ops = s => ['a', 'b', 'c', 'd'].map(id => ({ id, texto: `opción ${id} del caso ${s}`, siFuera: 'si…' }));
  const siempreA = s => { const o = ops(s); T.barajar(o, s + 7)[0].correcta = true; return { pregunta: `Caso ${s}`, opciones: o }; };
  const pareja = s => { const o = ops(s); o[0].correcta = true; return { pregunta: `Caso ${s}`, opciones: o }; };
  assert.match(de('letra-repartida', unidad(idea({ ahoraTu: { generar: siempreA } })))[0].que, /«Ahora tú»: la A es la correcta en 60 de 60/);
  assert.deepEqual(de('letra-repartida', unidad(idea({ ahoraTu: { generar: pareja } }))), []);
});

// Una alternativa se nombra por su letra o por su valor. Donde la figura tiene puntos A, B, C, ningún resuelto nombra
// una alternativa por su letra (Gerson, docs/etapa3/decisiones.md, «Letras de las alternativas»): ahí va el valor.
const triangulo = (respuesta, sol) => ({
  nivel: 3, titulo: 'El lado que falta', enunciado: 'En el triángulo ABC, AB = AC y M es el punto medio de BC. Si AB mide 17 cm, ¿cuánto mide AC?',
  alternativas: ['15 cm', '17 cm', '19 cm', '21 cm', '34 cm'], datos: ['Isósceles: dos lados iguales.'], solucion: [{ texto: sol }], respuesta,
});
const SOL_VALOR = 'AC = AB = 17 cm. 15 cm le resta 2; 19 cm y 21 cm le suman; 34 cm es el doble: confunde A con M.';

test('respuesta-letra: la respuesta dice cuál es su alternativa, por su letra o por su valor', () => {
  const con = e => unidad(idea({ ejemplos: [e] }));
  // Por su letra: «B, 8 m». Si la letra no es la de ese valor, falla.
  assert.deepEqual(de('respuesta-letra', con(ejAlt('B'))), []);
  const otra = ejAlt('B'); otra.respuesta = [{ negrita: 'C' }, ', ', f('8 m')];
  assert.match(de('respuesta-letra', con(otra))[0].que, /dice C y escribe «8 m», que es la alternativa B/);
  // Por su valor, sin letra: «8 m», y con puntos en la figura, «AC = 17 cm» (la A de AC no es una alternativa).
  const sin = ejAlt('B'); sin.respuesta = [f('8 m')];
  assert.deepEqual(de('respuesta-letra', con(sin)), []);
  assert.deepEqual(de('respuesta-letra', con(triangulo(['AC = ', f('17 cm')], SOL_VALOR))), []);
  // «C = 40 N» empieza por la letra de un vector, no por la de una alternativa: vale por su valor (que aquí es la A).
  const vector = Object.assign(ejAlt('A', 'A, B, C, D y E.', ['40 N', '50 N', '60 N', '70 N', '80 N']), { respuesta: ['C = ', f('40 N')] });
  assert.deepEqual(de('respuesta-letra', con(vector)), []);
  // El valor puede ir sin el signo de su unidad: «x = 40» con la alternativa «40°».
  const grados = Object.assign(ejAlt('A', 'A, B, C, D y E.', ['20°', '40°', '50°', '70°', '90°']), { respuesta: ['x = ', f('40')] });
  assert.deepEqual(de('respuesta-letra', con(grados)), []);
  // Ni letra ni valor de la lista, o el valor de dos alternativas: falla.
  assert.match(de('respuesta-letra', con(triangulo(['Mide lo mismo que ', f('AB')], SOL_VALOR)))[0].que, /no dice cuál es su alternativa/);
  assert.match(de('respuesta-letra', con(triangulo(['Entre ', f('15 cm'), ' y ', f('17 cm')], SOL_VALOR)))[0].que, /aquí calzan A y B/);
  // La letra que se deduce del valor entra en el reparto: diez veces «17 cm», la B, pasa del 40 %.
  const diez = [0, 1].map(k => idea({ id: `i${k}`, ejemplos: [0, 1, 2, 3, 4].map(n => Object.assign(triangulo(['AC = ', f('17 cm')], SOL_VALOR), { enunciado: `Caso ${k}${n}: ¿cuánto mide AC?` })) }));
  assert.match(de('letra-repartida', unidad(diez)).map(h => h.que).join('\n'), /la B es la correcta en 10 de 10/);
});

test('alternativa-sin-explicar: el resuelto nombra cada incorrecta, por su letra o por su valor', () => {
  const con = sol => unidad(idea({ ejemplos: [ejAlt('B', sol)] }));
  // Por su letra.
  assert.match(de('alternativa-sin-explicar', con('Se suma 3 + 5. La A resta en vez de sumar.'))[0].que, /no nombra las alternativas C \(«9 m»\), D \(«10 m»\), E \(«11 m»\)/);
  assert.deepEqual(de('alternativa-sin-explicar', con('A resta. C suma mal. D olvida la llevada. E duplica.')), []);
  assert.deepEqual(de('alternativa-sin-explicar', con('La A resta en vez de sumar; las demás no usan los dos lados.')), []);
  // La letra puede ir en negrita, como parte de la ecuación.
  const e = ejAlt('B'); e.solucion = [{ texto: ['Suma. ', { negrita: 'A' }, ' resta; ', { negrita: 'C' }, ' y ', { negrita: 'D' }, ' olvidan un lado; ', { negrita: 'E' }, ' duplica.'] }];
  assert.deepEqual(de('alternativa-sin-explicar', unidad(idea({ ejemplos: [e] }))), []);
  // Por su valor, sin ninguna letra de alternativa: una figura con puntos A, B, C.
  const tri = (resp, sol) => unidad(idea({ ejemplos: [triangulo(resp, sol)] }));
  assert.deepEqual(de('alternativa-sin-explicar', tri(['AC = ', f('17 cm')], SOL_VALOR)), []);
  // Las letras A, B y M del resuelto son puntos; aun así cuentan como nombradas (la regla no distingue), pero las que
  // no salen ni como letra ni como valor, fallan: aquí la D y la E.
  assert.match(de('alternativa-sin-explicar', tri(['AC = ', f('17 cm')], 'AC = AB = 17 cm. Con 15 cm se le resta 2; con 19 cm se le suma.'))[0].que, /no nombra las alternativas D \(«21 cm»\), E \(«34 cm»\), ni por su letra ni por su valor/);
  // Mezcla de las dos formas en un mismo resuelto.
  assert.deepEqual(de('alternativa-sin-explicar', con('Suma: 8 m. Con 7 m se resta; la C y la D olvidan un lado; 11 m duplica.')), []);
});

test('figura-respuesta: la figura de un ejemplo o de Predice no escribe el número que se pide', () => {
  const ej = figura => unidad(idea({ ejemplos: [{ nivel: 1, titulo: 'Uno', enunciado: 'Dos fuerzas de 5 N y 12 N forman 90°. ¿Cuánto mide la resultante?', datos: ['R² = A² + B²'], figura, solucion: [{ texto: 'x' }], respuesta: ['R = ', f('13 N')] }] }));
  assert.match(de('figura-respuesta', ej(fig('A = 5 N', 'B = 12 N', 'R = 13 N')))[0].que, /la figura escribe 13/);
  assert.deepEqual(de('figura-respuesta', ej(fig('A = 5 N', 'B = 12 N', 'R = ?'))), []);
  assert.deepEqual(de('figura-respuesta', ej(fig('0', '13', '26', '39', 'N'))), [], 'una marca de la escala no es la respuesta');
  const p = dibujo => unidad(idea({ predice: predice('Un terreno de 7 m de lado pierde dos franjas de 2 m. ¿Qué área queda?', '25 m²', ['45 m²', '21 m²'], { dibujo }) }));
  assert.match(de('figura-respuesta', p({ datos: { rotulos: ['7 m', '2 m', '25 m²'] } }))[0].que, /el dibujo de Predice escribe 25/);
  assert.deepEqual(de('figura-respuesta', p({ datos: { rotulos: ['7 m', '2 m', '?'] } })), []);
});

test('datos-respuesta: los Datos no traen «lo que se pregunta = la respuesta»', () => {
  const ej = datos => unidad(idea({ ejemplos: [{ nivel: 1, titulo: 'Uno', enunciado: 'En el triángulo 3-4-5, ¿cuánto vale cos 37°?', datos, solucion: [{ texto: 'x' }], respuesta: ['cos 37° = ', f('4/5')] }] }));
  assert.match(de('datos-respuesta', ej(['sen 37° = 3/5 y cos 37° = 4/5']))[0].que, /ya traen la respuesta \(«4\/5»\)/);
  assert.deepEqual(de('datos-respuesta', ej(['Coseno: cateto adyacente entre hipotenusa', 'Frente a 37° va el 3; frente a 53°, el 4'])), []);
  const at = datos => unidad(idea({ ahoraTu: { generar: s => ({ pregunta: `Caso ${s}: ¿cuántos metros hay en 1 km?`, datos, opciones: [{ id: 'c', texto: '1000 m', correcta: true }, { id: 'a', texto: '100 m', siFuera: 'x' }] }) } }));
  assert.match(de('datos-respuesta', at(['1 km = 1000 m']))[0].que, /60 de 60 semillas/);
  assert.deepEqual(de('datos-respuesta', at(['kilo: mil veces la unidad'])), []);
});

test('datos-consejo: una línea de Datos no es un consejo (el aviso de una letra que choca sí va)', () => {
  const con = datos => unidad(idea({ ejemplos: [{ nivel: 1, titulo: 'Uno', enunciado: '¿Cuántos metros son 2 km?', datos, solucion: [{ texto: 'x' }], respuesta: [f('2000 m')] }] }));
  assert.match(de('datos-consejo', con(['1 km = 1000 m', 'Recuerda pasar todo a metros antes de operar']))[0].que, /es un consejo, no un dato/);
  assert.equal(de('datos-consejo', con(['Ojo: los movimientos son independientes'])).length, 1);
  assert.deepEqual(de('datos-consejo', con(['1 km = 1000 m', 'Ojo: aquí T es el período y L, el largo del hilo'])), []);
});

test('resuelve-repite: «Así se resuelve» no trae un caso de «Ahora tú»', () => {
  const at = { generar: s => ({ pregunta: `Una puerta mide ${s + 2} m. ¿Cuántos centímetros son?`, opciones: [{ id: 'c', texto: 'x', correcta: true }, { id: 'a', texto: 'y', siFuera: 'z' }] }) };
  const con = enunciado => unidad(idea({ ahoraTu: at, resuelve: { generar: s => ({ enunciado: enunciado(s), pasos: [] }) } }));
  assert.match(de('resuelve-repite', con(s => `Una puerta mide ${s + 5} m. ¿Cuántos centímetros son?`))[0].que, /el mismo caso que «Ahora tú» \(semilla 3\)/);
  assert.deepEqual(de('resuelve-repite', con(s => `Un poste mide ${s + 5} m. ¿Cuántos decímetros son?`)), []);
  assert.deepEqual(de('resuelve-repite', con(s => `Una puerta mide ${s + 40} m. ¿Cuántos centímetros son?`)), [], 'solo cuentan los 12 primeros casos de «Ahora tú»');
});

test('leyenda-visible: cada letra y cada color de la leyenda se ve en el juego', () => {
  const con = (leyenda, rotulo, extra = {}) => unidad(idea({ juega: Object.assign({
    consigna: 'Gira la flecha.', controles: [{ id: 'a', etiqueta: 'Ángulo', min: 0, max: 90, paso: 30, inicio: 30 }],
    dibujo: v => ({ datos: { rotulos: [rotulo(v)], color: extra.pinta } }), leyenda,
  }, extra.juega || {}) }));
  assert.match(de('leyenda-visible', con([{ s: 'θ', t: 'el ángulo' }, { s: 'R', t: 'la resultante' }], v => `R = ${v.a}`))[0].que, /nombra «θ»/);
  assert.deepEqual(de('leyenda-visible', con([{ s: 'θ', t: 'el ángulo' }, { s: 'R', t: 'la resultante' }], v => `R = 5; θ = ${v.a}°`)), []);
  // Vale si se ve en otro caso del juego (aquí, solo al llegar a 90°) o en la etiqueta de un control.
  assert.deepEqual(de('leyenda-visible', con([{ s: 'E', t: 'sale si no cabe' }], v => (v.a === 90 ? 'E' : 'cabe'))), []);
  // Un color: tiene que pintarse en la figura, la lectura o un control.
  assert.match(de('leyenda-visible', con([{ s: 'naranja', t: 'lo que se muda' }], () => 'x'))[0].que, /nombra «naranja»/);
  assert.deepEqual(de('leyenda-visible', con([{ s: 'naranja', t: 'lo que se muda' }], () => 'x', { pinta: 'c-o' })), []);
});

test('las reglas entran en Teoria.problemas solo con calidad 2, y una excepción con fecha deja la falta como pendiente', () => {
  const base = require('../contenido/teoria/aritmetica/numeracion.js');
  for (const r of base.requiere || []) require(require('node:path').join(__dirname, '..', r));
  // Una letra sin decir en los Datos del primer ejemplo de la primera idea.
  const i0 = base.ideas[0], ej = i0.ejemplos.slice();
  ej[0] = Object.assign({}, ej[0], { datos: [].concat(ej[0].datos || [], ['w = k · z']) });
  const tocada = cal => Object.assign({}, base, { calidad: cal, ideas: [Object.assign({}, i0, { ejemplos: ej })].concat(base.ideas.slice(1)) });
  const deRegla = (def, o) => T.problemas(def, o).filter(p => /\[letras-datos\]/.test(p));
  assert.equal(deRegla(tocada(2)).length, 1, 'con calidad 2 la regla falla');
  assert.match(deRegla(tocada(2))[0], /«w», «k», «z» sin decir qué son/);
  assert.deepEqual(deRegla(tocada(1)), [], 'sin calidad 2 la regla no corre');
  assert.deepEqual(deRegla(tocada(2), { sinReglas: true }), []);
  // Con una excepción (unidad, idea, motivo y fecha) deja de fallar y pasa a la lista de pendientes.
  R.EXCEPCIONES.push({ regla: 'letras-datos', unidad: base.unidad, idea: i0.id, motivo: 'prueba', fecha: '2026-11-19' });
  try {
    assert.deepEqual(deRegla(tocada(2)), []);
    assert.ok(T.pendientes(tocada(2)).some(p => /\[letras-datos\].*pendiente desde 2026-11-19: prueba/.test(p)));
    assert.deepEqual(R.sobran(base, {}, T).filter(x => x.motivo === 'prueba').length, 1, 'en la unidad sin tocar, la excepción sobra');
  } finally { R.EXCEPCIONES.pop(); }
});

test('cada regla tiene su descripción y cada excepción, su regla, su unidad, su motivo y su fecha', () => {
  const usadas = new Set(R.EXCEPCIONES.map(x => x.regla));
  for (const r of usadas) assert.ok(R.REGLAS[r], `la excepción nombra una regla que no existe: ${r}`);
  for (const x of R.EXCEPCIONES) {
    assert.match(x.unidad || '', /^[a-z-]+\.[a-z0-9-]+$/, JSON.stringify(x));
    assert.ok(typeof x.idea === 'string' && typeof x.motivo === 'string' && x.motivo.length >= 10, JSON.stringify(x));
    assert.match(x.fecha || '', /^\d{4}-\d{2}-\d{2}$/, JSON.stringify(x));
  }
});
