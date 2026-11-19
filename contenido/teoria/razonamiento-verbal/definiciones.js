/*
 * Teoría de «Definiciones» (razonamiento-verbal.definiciones). Molde: docs/teoria.md y docs/molde-unidad.md. Se rehace
 * por el contrato «se entiende sin profesor» (etapa 5, docs/plan-calidad.md §7), idea por idea, con la propuesta de
 * docs/etapa5/propuesta-verbal.md como guion (Gerson delegó el criterio y revisa después):
 *   1. genero-diferencia     «Clase y rasgo que separa»        rehecha el 19 nov (conserva su id y el avance)
 *   2. rasgo-necesario       «Necesario, no solo frecuente»    rehecha el 19 nov (conserva su id y el avance)
 *   3. definicion-a-palabra  «De la definición a la palabra»   nueva (la pregunta de la UNI, como hipótesis de formato)
 *   4. definicion-defectuosa «Cuando la definición no define»  nueva
 *   5. definicion-en-texto   «La definición dentro del texto»  nueva (como llega en San Marcos)
 * La unidad NO lleva calidad: 2: la marca la sesión después del lector en frío y el auditor. definiciones.test.js
 * comprueba que pasaría el validador con esa marca.
 * Objeto de la primera pantalla en verbal: el texto en su soporte, con quién lo escribe y para quién (rv-soporte; la
 * ficha de la definición con la tabla de casos es rv-definicion). Textos propios, de situaciones de Juliaca, Puno y el
 * Perú (regla 5): ninguno copia ni parafrasea textos de examen, de diccionario ni de academia.
 *
 * Ficha de tarea (diseno-y-animacion):
 *   Promesa: reconocer en una definición su clase y el rasgo que separa, y notar cuándo un vecino se cuela.
 *   Persona y condiciones: postulante de 5.º o preuniversitario, celular de gama baja, sin audio, sin profesor.
 *   Resultado observable: ante una definición, dice su clase, su rasgo y qué vecino entra si falta una pieza.
 *   Orden de atención: 1.º el cartel (para qué se define) · 2.º la ficha (clase y rasgos) · 3.º la tabla (quién entra) ·
 *     acción: tocar una pieza de la ficha.
 *   Estados: muy amplia (se cuelan 5, 3, 2 o 1) · justa · en la predicción, además, la definición del vecino.
 *   Duda que resuelve: ¿por qué «vehículo de tres ruedas» no basta para definir «mototaxi»?
 *
 * Colores de la idea 1 (regla 4; paleta de lectura con papel fijo en todo verbal, como en Tema e idea principal y en
 * app/lectura.js): lo que entra en la definición y es la cosa, y en un resuelto las palabras del texto que sostienen la
 * respuesta, i (turquesa, continuo: la evidencia); la definición o la alternativa que se prueba o se descarta, y el
 * vecino que se cuela, o (naranja, a trazos: el distractor); la definición justa y la respuesta, f (violeta, punteado:
 * la idea); lo que queda fuera, en gris (tenue). «Clase» y «rasgo» no llevan color: se distinguen por su rótulo en la
 * ficha y por su llave en la regla. Sin verde ni carmín. Las letras de las alternativas que nombra un resuelto van en
 * negrita (mala, buena). Lo comprueba definiciones.test.js.
 * Las ideas 2 a 5 usan la misma paleta (ver el comentario de cada una). La mesa vieja «Dos rasgos a la vez» se pasó a
 * esa paleta en la etapa 5; la mesa «Arma la silla», que repetía la idea 1 con verde y carmín, salió.
 * Códigos de error (hipótesis de la unidad; en docs/investigacion/razonamiento-verbal-ideas-erroneas.md y en
 * contenido/razonamiento-verbal/codigos.json): RVD1 (rasgo frecuente tomado por necesario: muy estrecha), RVD2 (falta
 * el rasgo: muy amplia), RVD3 (rasgo necesario tomado por suficiente), RVD4 (rasgo de más: muy estrecha), RVD5 (da por
 * cumplido un rasgo que el caso no tiene), RVD6 (clase lejana: muy amplia), RVD7 (el rasgo es de un vecino: define a
 * otro), RVD8 (sin clase), RVD9 (la palabra más general), RVD10 (la palabra más específica), RVD11 (otra clase del
 * mismo tema), RVD12 (acepta una definición circular), RVD13 (acepta una negativa), RVD14 (acepta una figurada), RVD15
 * (toma por definición otra oración del texto: un dato, una consecuencia, un consejo), y del informe RV56 (un ejemplo
 * en lugar de la definición) y RV11 (un absoluto que el texto no dice).
 * Lo que entra, se cuela o queda fuera en el juego, la predicción y «Mira» lo calcula `medir` con los rasgos de cada
 * vehículo (regla 1). Los 15 ejemplos, los 4 «Así se resuelve», los 6 «Ahora tú», la predicción y el juego se
 * revisaron con un script aparte que no usa el código de la unidad (scratchpad e5-rv/revisa.js): describe cada caso
 * como un mundo chico de seres con sus rasgos y cada alternativa como una condición, y comprueba que solo una deja
 * dentro justo lo que debe, que cada distractor falla por lo que dice su explicación y que la correcta no es la más
 * larga ni la más corta.
 */
(function (root, fabrica) {
  const def = fabrica(typeof module === 'object' && module.exports ? require('../../../nucleo/kit/kit.js') : root.Kit);
  if (typeof module === 'object' && module.exports) module.exports = def;
  else root.Teoria.unidad(def);
})(typeof self !== 'undefined' ? self : this, function (Kit) {
  'use strict';
  // ---------- Ayudantes de la unidad rehecha (idea 1; etapa 5, 19 nov) ----------
  // Un trozo de color largo puede partirse en renglones (largo: true); si no, en el celular se sale a lo ancho.
  const pinto = v => t => (String(t).length > 14 ? { v, t, largo: true } : { v, t });
  // Paleta de lectura (papel fijo en todo verbal): turquesa, lo que entra y la evidencia; naranja, lo que se prueba, se
  // descarta o se cuela; violeta, la definición justa y la respuesta.
  const cubre = pinto('c-i'), prop = pinto('c-o'), justo = pinto('c-f');
  // La letra de una alternativa, en negrita (Gerson, mesa del 17 nov): la descartada en naranja y la correcta en violeta.
  // El U+2060 (invisible) evita que la letra sola salga en cursiva, como una variable (nucleo/ecuacion.js, LETRA).
  const mala = L => ({ v: 'c-o', t: `${L}⁠` }), buena = L => ({ v: 'c-f', t: `${L}⁠` });
  const ora = (pre, lista) => lista.map((t, k) => (typeof t === 'string' ? { id: `${pre}${k + 1}`, t } : Object.assign({ id: `${pre}${k + 1}` }, t)));
  const opciones = (c, malas) => [{ id: 'c', texto: c, correcta: true }, ...malas.map(([texto, error, siFuera], k) => ({ id: `e${k}`, texto, error, siFuera }))];
  const voltear = (arr, s) => (s % 2 ? arr.slice().reverse() : arr.slice());
  const lista = xs => (xs.length <= 1 ? xs.join('') : `${xs.slice(0, -1).join(', ')} y ${xs[xs.length - 1]}`);
  const sinMision = j => Object.fromEntries(Object.entries(j).filter(([k]) => k !== 'mision'));

  // ---------- Idea 1: clase y rasgo que separa (etapa 5, 19 nov; docs/etapa5/propuesta-verbal.md) ----------
  // Cambia: la clase y los dos rasgos de la definición de «mototaxi». Permanece: el cartel del paradero y los siete
  // vehículos con sus rasgos. Progresa: cuántos vehículos se cuelan (5, 3, 2, 1, 0). Se reserva: la definición del
  // vecino, que tiene las dos piezas y aun así falla (predicción). Debe verse: que cada pieza deja fuera a un vecino
  // distinto, y que si falta una, ese vecino se cuela.
  // Objeto de la primera pantalla (contrato, punto 1, regla de verbal): el texto en su soporte, con quién lo escribe y
  // para quién: el cartel de la municipalidad en un paradero de Juliaca, que necesita la definición para saber a quién
  // le toca la regla. El cartel y su fecha son inventados para el ejercicio; no citan ninguna ordenanza real.
  // Colores: el vehículo que entra y es mototaxi, i (turquesa, continuo); la definición que se prueba y el vecino que se
  // cuela, o (naranja, a trazos); la definición justa, f (violeta, punteado); lo que queda fuera, gris. «Clase» y
  // «Rasgo» no llevan color: se distinguen por su rótulo. Todo lo que entra o se cuela lo calcula `medir` con los
  // rasgos de cada vehículo (regla 1).
  // El criterio de la idea, como dato (contrato, punto 13: en verbal, el dato es la definición o el criterio que se aplica).
  const D_DEF = 'Definición: dice la clase de la cosa y el rasgo que la separa de sus vecinos.';
  const D_AMPLIA = 'Muy amplia: la definición deja entrar a un vecino, que no es la cosa.';
  const D_VECINO = 'Vecino: cosa parecida, de la misma clase, que no es lo que se define.';
  const D_CERCANA = 'Clase más cercana: la más chica que contiene a todos los casos.';
  const D_GENERO = 'Género próximo: la clase más cercana. Diferencia específica: el rasgo que separa.';
  const D_OTRA = 'Define al vecino: tiene clase y rasgo, pero el rasgo es de otra cosa.';
  const D_SINCLASE = 'Sin clase: la frase da un rasgo, pero no dice qué es la cosa.';

  const CARTEL = { soporte: 'cartel', lugar: 'Cartel en un paradero de Juliaca', hojas: [
    { id: 'c', titulo: 'Comunicado', de: 'la Municipalidad', para: 'conductores del paradero', oraciones: ora('c', [
      'Desde el 1 de diciembre, todo mototaxi llevará su número pintado atrás.']) }] };
  // Los vehículos del paradero, en el orden de la tabla. mt: es un mototaxi; corto: cómo lo nombra la lectura. Son siete
  // para que cada pieza deje fuera a alguien también en la ficha de «motocarga» (predicción): sin el triciclo de carga,
  // «con motor» no separaba a nadie ahí (lo encontró el script de revisión, 19 nov).
  const VEH = [
    { id: 'v1', n: 'tricitaxi a pedal', corto: 'el tricitaxi', ruedas: 3, motor: false, lleva: 'pasajeros' },
    { id: 'v2', n: 'mototaxi abierto', corto: 'el mototaxi abierto', ruedas: 3, motor: true, lleva: 'pasajeros', mt: true },
    { id: 'v3', n: 'combi', corto: 'la combi', ruedas: 4, motor: true, lleva: 'pasajeros' },
    { id: 'v4', n: 'motocarga', corto: 'la motocarga', ruedas: 3, motor: true, lleva: 'carga' },
    { id: 'v5', n: 'mototaxi cerrado', corto: 'el mototaxi cerrado', ruedas: 3, motor: true, lleva: 'pasajeros', mt: true },
    { id: 'v6', n: 'triciclo de carga', corto: 'el triciclo de carga', ruedas: 3, motor: false, lleva: 'carga' },
    { id: 'v7', n: 'camioneta', corto: 'la camioneta', ruedas: 4, motor: true, lleva: 'carga' },
  ];
  const TABLA_VEH = { titulo: 'Vehículos del paradero', cols: ['Vehículo', 'Ruedas', 'Motor', 'Lleva'], anchos: [120, 58, 50, 66],
    filas: VEH.map(v => ({ id: v.id, celdas: [v.n, String(v.ruedas), v.motor ? 'sí' : 'no', v.lleva] })) };
  // Una definición es una lista de condiciones sobre los rasgos; un vehículo entra si las cumple todas.
  const entra = (v, cond) => Object.entries(cond).every(([k, x]) => v[k] === x);
  // Qué pasa con una definición: quiénes entran, qué vecinos se cuelan y qué casos de la cosa quedan fuera.
  const medir = (cond, es) => ({ dentro: VEH.filter(v => entra(v, cond)), cuelan: VEH.filter(v => entra(v, cond) && !es(v)), faltan: VEH.filter(v => es(v) && !entra(v, cond)) });
  const esMoto = v => !!v.mt, esCarga = v => v.id === 'v4';
  const N_MOTO = VEH.filter(esMoto).length;
  // El estado de la figura: las piezas puestas, cada fila marcada y, en palabras, el resultado.
  const estFicha = (partes, cond, es, extra = {}) => {
    const r = medir(cond, es), justa = !r.cuelan.length && !r.faltan.length;
    return Object.assign({
      partes, color: justa ? 'f' : 'o',
      filas: Object.fromEntries(r.dentro.map(v => [v.id, es(v) ? 'i' : 'o'])),
      tenue: VEH.filter(v => !entra(v, cond)).map(v => v.id),
      sello: justa ? { t: 'Justa: no se cuela ninguno', c: 'f' }
        : r.cuelan.length ? { t: `Se ${r.cuelan.length === 1 ? 'cuela' : 'cuelan'} ${r.cuelan.length}`, c: 'o' }
          : { t: 'Queda fuera lo que se define', c: 'o' },
    }, extra);
  };

  // El juego: la ficha de «mototaxi». g: la clase; m y p: los dos rasgos, que se ponen o se quitan.
  const CLASES = { veh: { t: 'vehículo', cond: {} }, tres: { t: 'vehículo de tres ruedas', cond: { ruedas: 3 } } };
  const R_MOTOR = 'con motor', R_PASAJ = 'que lleva pasajeros';
  const condDe = val => Object.assign({}, CLASES[val.g].cond, val.m ? { motor: true } : {}, val.p ? { lleva: 'pasajeros' } : {});
  const partesDe = val => ({ g: CLASES[val.g].t, m: val.m ? R_MOTOR : '', p: val.p ? R_PASAJ : '' });
  const FIG_MOTO = { soporte: CARTEL, toques: { g: 'g', m: 'm', p: 'p' }, casos: TABLA_VEH,
    entrada: { termino: 'mototaxi', rotulo: 'Ficha del cartel', partes: [{ id: 'g', papel: 'Clase' }, { id: 'm', papel: 'Rasgo', casilla: true, hueco: R_MOTOR }, { id: 'p', papel: 'Rasgo', casilla: true, hueco: R_PASAJ }] } };
  const lecturaMoto = val => {
    const r = medir(condDe(val), esMoto), n = r.cuelan.length;
    if (!n) return [justo('Justa'), ': entran ', cubre(`los ${N_MOTO} mototaxis`), ' y nadie más'];
    if (n <= 2) return [prop('Muy amplia'), `: se ${n === 1 ? 'cuela' : 'cuelan'} `, prop(lista(r.cuelan.map(v => v.corto)))];
    return [prop('Muy amplia'), ': se cuelan ', prop(`${n} vehículos`), ' que no son mototaxi'];
  };

  // La predicción: la ficha de «motocarga», con la misma tabla. Cada opción es una definición entera; cond dice qué pide.
  const FIG_CARGA = { casos: TABLA_VEH, entrada: { termino: 'motocarga', rotulo: 'Ficha nueva', partes: [{ id: 'g', papel: 'Clase' }, { id: 'r1', papel: 'Rasgo' }, { id: 'r2', papel: 'Rasgo' }] } };
  const OPS_CARGA = {
    c: { texto: 'Vehículo de tres ruedas, con motor, que lleva carga', partes: { g: 'vehículo de tres ruedas', r1: R_MOTOR, r2: 'que lleva carga' }, cond: { ruedas: 3, motor: true, lleva: 'carga' } },
    rasgo: { texto: 'Vehículo de tres ruedas, con motor', partes: { g: 'vehículo de tres ruedas', r1: R_MOTOR }, cond: { ruedas: 3, motor: true } },
    clase: { texto: 'Vehículo con motor, que lleva carga', partes: { g: 'vehículo', r1: R_MOTOR, r2: 'que lleva carga' }, cond: { motor: true, lleva: 'carga' } },
    vecino: { texto: 'Vehículo de tres ruedas, con motor, que lleva pasajeros', partes: { g: 'vehículo de tres ruedas', r1: R_MOTOR, r2: R_PASAJ }, cond: { ruedas: 3, motor: true, lleva: 'pasajeros' } },
  };
  const estCarga = (k, extra) => estFicha(OPS_CARGA[k].partes, OPS_CARGA[k].cond, esCarga, extra);
  const cuelanCarga = k => medir(OPS_CARGA[k].cond, esCarga).cuelan;

  // Lee: la primera tarjeta muestra el cartel (quién escribe y para quién) y la tercera presenta «vecino» y «se cuela»
  // con su dibujo, antes del juego (contrato, puntos 1 y 6). Los instrumentos no salen en el juego ni en la predicción.
  const INSTR = [['i1', 'quena', 'soplando', true], ['i2', 'zampoña', 'soplando', true], ['i3', 'charango', 'con los dedos', true], ['i4', 'pizarra', 'no se toca', false]];
  const FIG_LEE = { entrada: { termino: 'quena', rotulo: 'Ficha de música', partes: [{ id: 'g', papel: 'Clase' }] },
    casos: { titulo: 'Cosas del salón', cols: ['Cosa', 'Cómo se toca'], anchos: [120, 174], filas: INSTR.map(([id, n, c]) => ({ id, celdas: [n, c] })) } };
  const EST_LEE = { partes: { g: 'instrumento musical' }, color: 'o', filas: Object.fromEntries(INSTR.filter(x => x[3]).map(x => [x[0], x[1] === 'quena' ? 'i' : 'o'])),
    tenue: INSTR.filter(x => !x[3]).map(x => x[0]), sello: { t: `Se cuelan ${INSTR.filter(x => x[3]).length - 1}`, c: 'o' } };

  // «Así se resuelve»: textos distintos de los de «Ahora tú» (docs/teoria.md 4e). Las definiciones candidatas están
  // escritas en el soporte, numeradas (o con letra, en la hoja de simulacro); en «Lo aplico» la figura deja la buena en
  // violeta y tacha las otras. La buena cambia de lugar: 3.ª, 1.ª, 2.ª y B.
  const cuaderno = (lugar, titulo, de, para, entradas) => ({ soporte: 'cuaderno', lugar, hojas: [{ id: 'h', titulo, de, para, oraciones: ora('h', entradas) }] });
  const simDef = (numero, pregunta, alternativas, oraciones) => ({ soporte: 'simulacro', numero, hojas: [Object.assign({ id: 'h', titulo: 'Definiciones' }, oraciones ? { oraciones: ora('h', oraciones) } : {})],
    pregunta, alternativas: alternativas.map((t, k) => ({ id: 'ABCDE'[k], t })) });
  const RESUELVE = [
    { c: 'termómetro', buena: 'h3',
      sop: cuaderno('Cuaderno de Rosa', 'Glosario: termómetro', 'Rosa', 'la práctica de Ciencia y Tecnología', [
        'Instrumento de medida.', 'Instrumento que mide el peso de un cuerpo.', 'Instrumento que mide la temperatura.']),
      enunciado: 'Rosa escribió tres definiciones de «termómetro» para su glosario. ¿Con cuál se queda: la 1, la 2 o la 3?',
      datos: [D_DEF, D_AMPLIA, D_VECINO],
      tengo: 'Las tres empiezan por la misma clase, «instrumento». Los vecinos del termómetro son otros instrumentos de medida: la balanza y la regla.',
      malas: ['La 1 no trae rasgo: entran la balanza y la regla, ', prop('muy amplia'), '. La 2 da el rasgo de la balanza: ', prop('define al vecino'), '.'],
      bien: ['La 3 dice la clase, «instrumento», y el rasgo, «que mide la temperatura»: ', cubre('entra solo el termómetro'), '.'],
      sentido: 'Ni la balanza ni la regla miden la temperatura: con ese rasgo, ningún vecino se cuela.',
      respuesta: [justo('La 3'), ': instrumento que mide la temperatura'] },
    { c: 'semáforo', buena: 'h1',
      sop: cuaderno('Cuaderno de Diego', 'Glosario: semáforo', 'Diego', 'la semana de la seguridad vial', [
        'Aparato de luces que ordena el paso en un cruce.', 'Aparato de luces de la calle.', 'Aparato de luces que alumbra la calle durante toda la noche.']),
      enunciado: 'Diego tiene tres definiciones de «semáforo» en su cuaderno. ¿Cuál deja entrar al semáforo y a ningún vecino?',
      datos: [D_DEF, D_AMPLIA, D_VECINO],
      tengo: 'Las tres dicen la clase, «aparato de luces». En la calle hay otro aparato de luces: el poste de alumbrado.',
      malas: ['La 2 no trae rasgo: entra el poste de alumbrado, ', prop('muy amplia'), '. La 3 da el rasgo del poste: ', prop('define al vecino'), '.'],
      bien: ['La 1 dice la clase, «aparato de luces», y el rasgo, «que ordena el paso en un cruce»: ', cubre('entra solo el semáforo'), '.'],
      sentido: 'El poste alumbra, pero no ordena el paso de nadie: con ese rasgo queda fuera.',
      respuesta: [justo('La 1'), ': aparato de luces que ordena el paso'] },
    { c: 'poncho', buena: 'h2',
      sop: { soporte: 'mural', lugar: 'Mural de la feria de tejidos del colegio', hojas: [{ id: 'h', titulo: 'Ficha por completar: poncho', de: '3.º A', para: 'los visitantes de la feria', oraciones: ora('h', [
        'Objeto de lana que sirve para abrigarse en los días de frío.', 'Prenda de abrigo: manta con una abertura para la cabeza.', 'Prenda de abrigo.']) }] },
      enunciado: 'Los alumnos de 3.º A deben elegir una definición de «poncho» para su ficha. ¿Cuál es la justa?',
      datos: [D_DEF, D_AMPLIA, D_CERCANA],
      tengo: 'Hay dos clases: «objeto de lana» y «prenda de abrigo». Vecinos del poncho: la chompa, el chullo y la frazada.',
      malas: ['La 1 usa una clase lejana, «objeto»: entra la frazada. La 3 no trae rasgo: entran la chompa y el chullo. Las dos son ', prop('muy amplias'), '.'],
      bien: ['La 2 da la clase cercana, «prenda de abrigo», y el rasgo, «manta con una abertura para la cabeza»: ', cubre('entra solo el poncho'), '.'],
      sentido: 'La chompa tiene mangas y el chullo va en la cabeza: ninguno es una manta con abertura.',
      respuesta: [justo('La 2'), ': prenda de abrigo, manta con abertura para la cabeza'] },
    { c: 'brújula', buena: 'B', hoja: true,
      sop: simDef(6, '¿Qué alternativa define mejor la palabra «brújula»?', ['Instrumento de orientación.', 'Instrumento que señala el norte con una aguja imantada.',
        'Objeto que llevan los viajeros cuando salen a caminar por el campo.', 'Instrumento que mide la presión del aire.', 'Lo que señala siempre hacia el norte.']),
      enunciado: 'Pregunta 6 del simulacro, de definiciones: hay que elegir la que define mejor «brújula». Las alternativas están en la hoja.',
      datos: [D_DEF, D_AMPLIA, D_OTRA, D_SINCLASE, 'Imantada: que atrae al hierro, como un imán.'],
      tengo: 'Hay cinco alternativas. Vecinos de la brújula: otros instrumentos, como el barómetro, y otras cosas de viaje.',
      malas: [mala('A'), ' no trae rasgo y ', mala('C'), ' usa una clase lejana: son ', prop('muy amplias'), '. ', mala('D'), ' define al barómetro. ', mala('E'), ' no dice qué es.'],
      bien: [buena('B'), ' da la clase, «instrumento», y el rasgo, «señala el norte con una aguja imantada»: ', cubre('entra solo la brújula'), '.'],
      sentido: 'Un mapa también orienta y una mochila también va de viaje: sin el rasgo, se cuelan.',
      respuesta: [buena('B'), ': instrumento que señala el norte con una aguja imantada'] },
  ];
  const estResuelto = R => ({ marcas: { [R.buena]: 'f' }, tachar: (R.hoja ? R.sop.alternativas : R.sop.hojas[0].oraciones).map(x => x.id).filter(id => id !== R.buena) });

  // «Ahora tú»: dos de base (una página de diccionario con los vecinos ya definidos), dos intermedios (el vecino muy
  // parecido; una palabra en un mensaje) y dos de examen (cinco opciones; un verbo). Cada incorrecta sale de un error:
  // RVD2 (falta el rasgo: muy amplia), RVD6 (clase lejana: muy amplia), RVD7 (el rasgo es de un vecino: define a otro) y
  // RVD8 (sin clase: no dice qué es). Hipótesis de la unidad (docs/etapa5/propuesta-verbal.md, decisión 6).
  const pagina = (titulo, entradas) => ({ soporte: 'diccionario', lugar: 'Diccionario escolar', hojas: [{ id: 'd', titulo, oraciones: ora('d', entradas.map(([lema, t]) => ({ lema, t }))) }] });
  const AHORA = [
    { sop: pagina('En la mesa', [['cuchillo', 'Cubierto con filo, para cortar.'], ['tenedor', 'Cubierto con dientes, para pinchar.'], ['cuchara', '________']]),
      pregunta: 'En esta página falta la definición de «cuchara». ¿Cuál deja entrar a la cuchara y a ninguno de sus vecinos?',
      datos: [D_DEF, D_AMPLIA, D_VECINO],
      ok: 'Cubierto con una parte honda, para tomar líquidos', sol: 'Dice la clase, «cubierto», y el rasgo que deja fuera al cuchillo y al tenedor.',
      m: [['Cubierto de la mesa', 'RVD2', 'La clase está bien, pero sin rasgo también entran el cuchillo y el tenedor.'],
        ['Cubierto con dientes, para pinchar la comida', 'RVD7', 'Tiene clase y rasgo, pero ese rasgo es el del tenedor.'],
        ['Objeto de metal o de madera que se usa a la hora de comer', 'RVD6', 'Es cierto, pero «objeto» queda muy lejos: también entran el plato y la olla.']] },
    { sop: pagina('Instrumentos', [['guitarra', 'Instrumento de seis cuerdas, de caja grande.'], ['quena', 'Instrumento de viento, de caña.'], ['charango', '________']]),
      pregunta: 'En esta página falta la definición de «charango». ¿Cuál lo deja entrar y deja fuera a sus vecinos?',
      datos: [D_DEF, D_AMPLIA, D_VECINO],
      ok: 'Instrumento de cuerda pequeño, con cinco pares de cuerdas', sol: 'Dice la clase, «instrumento de cuerda», y el rasgo que deja fuera a la guitarra.',
      m: [['Instrumento musical de los Andes', 'RVD2', 'La clase está bien, pero sin un rasgo que separe también entra la quena.'],
        ['Instrumento de viento, hecho de caña', 'RVD7', 'Tiene clase y rasgo, pero ese rasgo es el de la quena.'],
        ['Cosa que suena cuando alguien la toca con las manos o la sopla', 'RVD6', 'Es cierto, pero «cosa que suena» queda muy lejos: también entra una campana.']] },
    { sop: { soporte: 'folleto', lugar: 'Folleto del muelle de Puno', hojas: [{ id: 'f', titulo: 'Información para visitantes', de: 'la caseta del muelle', para: 'visitantes', oraciones: ora('f', [
        'Desde el muelle de Puno salen lanchas a las islas de Taquile y Amantaní.', 'A la península de Capachica también se llega por carretera.']) }] },
      pregunta: 'El folleto habla de islas y de una península. ¿Qué definición de «isla» deja fuera a la península?',
      datos: [D_DEF, D_AMPLIA, D_VECINO],
      ok: 'Porción de tierra rodeada de agua por todas partes', sol: 'Dice la clase, «porción de tierra», y el rasgo que deja fuera a la península.',
      m: [['Porción de tierra que está junto al agua', 'RVD2', 'La clase está bien, pero ese rasgo no separa: también entra la península.'],
        ['Porción de tierra rodeada de agua por todos lados menos uno', 'RVD7', 'Tiene clase y rasgo, pero ese rasgo es el de la península.'],
        ['Lugar del lago adonde llegan las lanchas', 'RVD6', 'Es cierto de Taquile, pero «lugar» queda muy lejos: también entra un muelle.']] },
    { sop: { soporte: 'mensaje', lugar: 'Familias de 2.º C', hojas: [{ id: 'm', de: 'la tutora', para: 'familias de 2.º C', oraciones: ora('m', [
        'Para mañana se anuncia una helada.', 'Manden a sus hijos con un termo de mate caliente.']) }] },
      pregunta: 'La tutora pide un termo. ¿Qué definición de «termo» lo separa de una botella cualquiera?',
      datos: [D_DEF, D_AMPLIA, D_VECINO],
      ok: 'Recipiente que mantiene la temperatura de lo que guarda', sol: 'Dice la clase, «recipiente», y el rasgo que deja fuera a la botella y a la jarra.',
      m: [['Recipiente para llevar líquidos', 'RVD2', 'La clase está bien, pero ese rasgo no separa: también entran la botella y la jarra.'],
        ['Recipiente de metal en el que se cocina', 'RVD7', 'Tiene clase y rasgo, pero ese rasgo es el de la olla.'],
        ['Objeto que se lleva al colegio en los días de mucho frío', 'RVD6', 'Puede ser cierto, pero «objeto» queda muy lejos: también entra la chompa.']] },
    { sop: simDef(17, null, [], ['Tras tres meses de sequía, el bofedal se quedó sin pasto.']),
      pregunta: 'La hoja de simulacro pide definir la palabra «sequía», que usa la oración. ¿Qué alternativa la define mejor?',
      datos: [D_DEF, D_AMPLIA, D_OTRA, D_SINCLASE, 'Bofedal: pastizal húmedo de las zonas altas.'],
      ok: 'Periodo largo en que casi no llueve en una región', sol: 'Dice la clase, «periodo», y el rasgo que deja fuera al invierno y a la helada.',
      m: [['Periodo largo de tiempo en una región', 'RVD2', 'La clase, «periodo», está bien, pero falta el rasgo: también entra el invierno.'],
        ['Periodo de frío en que la temperatura baja de cero grados', 'RVD7', 'Tiene clase y rasgo, pero ese rasgo es el de la helada.'],
        ['Problema que sufren cada cierto tiempo los agricultores del altiplano', 'RVD6', 'Es cierto, pero «problema» queda muy lejos: también entran la helada y la plaga.'],
        ['Que casi no llueve durante muchos meses', 'RVD8', 'El rasgo está bien, pero no dice qué es: falta la clase, «periodo».']] },
    { sop: simDef(18, null, [], ['En la biblioteca, Diego tuvo que susurrar para no molestar.']),
      pregunta: 'La hoja de simulacro pide definir el verbo «susurrar», que usa la oración. ¿Qué alternativa lo define mejor?',
      datos: [D_DEF, D_AMPLIA, D_OTRA, D_SINCLASE],
      ok: 'Hablar en voz muy baja', sol: 'Dice la clase, «hablar», y el rasgo que deja fuera a gritar y a conversar.',
      m: [['Hablar', 'RVD2', 'La clase está bien: susurrar es hablar. Pero sin rasgo también entran gritar y conversar.'],
        ['Hablar en voz muy alta, para que se oiga lejos', 'RVD7', 'Tiene clase y rasgo, pero ese rasgo es el de gritar.'],
        ['Hacer un sonido con la boca', 'RVD6', 'Es cierto, pero esa clase queda muy lejos: también entra silbar.'],
        ['En voz muy baja, casi sin que se oiga', 'RVD8', 'El rasgo está bien, pero no dice qué acción es: falta «hablar».']] },
  ];
  // La hoja de «Ahora tú» va sin pregunta ni alternativas (las alternativas son los botones de la app). En la solución,
  // la entrada que faltaba aparece escrita y en violeta.
  const sinPie = sop => Object.fromEntries(Object.entries(sop).filter(([k]) => k !== 'pregunta' && k !== 'alternativas'));
  const conHueco = (sop, ok) => Object.assign({}, sop, { hojas: sop.hojas.map(h => Object.assign({}, h, { oraciones: (h.oraciones || []).map(o => (o.t === '________' ? Object.assign({}, o, { t: `${ok}.` }) : o)) })) });
  const huecoDe = sop => sop.hojas.flatMap(h => h.oraciones || []).filter(o => o.t === '________').map(o => o.id);

  // Ejemplos resueltos (pestaña «Ejemplos», docs/teoria.md 4h; docs/metodo/unidad/2-ejemplos.md). La figura es el texto en
  // su soporte, sin ninguna marca (muestra el planteamiento, no la respuesta). En el resuelto, las palabras del texto que
  // sostienen la respuesta van en turquesa, lo que se descarta en naranja y la respuesta en violeta. Nivel 1: un paso
  // (decir la clase y el rasgo, ver si un vecino entra, elegir la clase más cercana). Nivel 2: dos pasos (hallar el
  // vecino que se cuela y el rasgo que lo deja fuera). Nivel 3: hoja de simulacro con cinco alternativas, cada una con
  // su falla; las correctas son A, C, E, B y D. Ninguno usa «muy estrecha» ni el ejemplo como falla (idea 2), ni pide
  // la palabra a partir de la definición (idea 3).
  // Revisado aparte (scratchpad e5-rv/revisa.js, que no usa el código de la unidad): cada alternativa se evalúa sobre un
  // mundo chico de seres con sus rasgos; solo una deja dentro justo lo que debe, cada distractor falla por lo que dice su
  // explicación (el vecino que nombra de verdad se cuela), toda oración o letra citada existe y la correcta nunca es
  // la alternativa más larga ni la más corta.
  const fig = sop => ({ pieza: 'rv-soporte', datos: sop, estado: {} });
  const EJEMPLOS_CLASE = [
    { nivel: 1, titulo: 'La entrada del diccionario',
      enunciado: 'En esta entrada del diccionario, ¿qué palabras dicen la clase y cuáles el rasgo que separa?',
      datos: [D_DEF, D_VECINO],
      figura: fig(pagina('P', [['puente', 'Construcción que permite pasar por encima de un río o de una vía.']])),
      solucion: [
        { texto: [cubre('«Construcción»'), ' responde «¿qué es un puente?»: es la clase. En ella también está su vecino, el túnel.'] },
        { texto: ['El rasgo es ', cubre('«que permite pasar por encima»'), ': deja fuera al túnel, que pasa por debajo.'] }],
      respuesta: [justo('Clase: construcción'), '; ', justo('rasgo: pasar por encima')] },
    { nivel: 1, titulo: 'El glosario de Diego',
      enunciado: 'Diego definió «cuaderno» así en su glosario. Con esa definición, ¿entra también un libro?',
      datos: [D_DEF, D_AMPLIA],
      figura: fig(cuaderno('Cuaderno de Diego', 'Glosario de útiles', 'Diego', 'la clase de Comunicación', ['Cuaderno: conjunto de hojas unidas.'])),
      solucion: [
        { texto: ['Un libro también es un ', cubre('conjunto de hojas unidas'), ': cumple todo lo que la definición pide, y entra.'] },
        { texto: ['Entra un vecino que no es un cuaderno: la definición es ', prop('muy amplia'), '.'] }],
      respuesta: [justo('Sí entra'), ': la definición es muy amplia'] },
    { nivel: 1, titulo: 'El comunicado de las tardanzas',
      enunciado: 'La oración 2 define «tardanza». ¿Cuál es su clase y cuál el rasgo que la separa de una llegada puntual?',
      datos: [D_DEF],
      figura: fig({ soporte: 'mural', lugar: 'Mural del colegio', hojas: [{ id: 'h', titulo: 'Comunicado de la Dirección', para: 'estudiantes y familias', oraciones: ora('h', [
        'Desde marzo, tres tardanzas en un mes cuentan como una falta.', 'Tardanza: llegada al colegio después de las 7:45 de la mañana.']) }] }),
      solucion: [
        { texto: ['La clase es ', cubre('«llegada al colegio»'), ': dice qué es una tardanza. Una llegada puntual también está en esa clase.'] },
        { texto: ['El rasgo es ', cubre('«después de las 7:45 de la mañana»'), ': deja fuera la llegada puntual.'] }],
      respuesta: [justo('Clase: llegada al colegio'), '; ', justo('rasgo: pasada la hora que fija el aviso')] },
    { nivel: 1, titulo: 'Dos frases para el triángulo',
      enunciado: 'Rosa escribió dos frases para «triángulo» en su cuaderno. ¿Cuál de las dos dice la clase: la 1 o la 2?',
      datos: [D_DEF, 'Polígono: figura plana y cerrada, de lados rectos.'],
      figura: fig(cuaderno('Cuaderno de Rosa', 'Matemática: triángulo', 'Rosa', 'el examen del lunes', ['Que tiene tres lados.', 'Polígono de tres lados.'])),
      solucion: [
        { texto: ['La 1 da un rasgo, pero ', prop('no dice qué es'), ': tres lados también tiene una figura abierta, como una Z.'] },
        { texto: ['La 2 empieza por la clase, ', cubre('«Polígono»'), ', y después da el rasgo, ', cubre('«de tres lados»'), '.'] }],
      respuesta: [justo('La 2'), ': «polígono» es la clase'] },
    { nivel: 1, titulo: 'Tres clases para el cuy',
      enunciado: 'Para definir «cuy», ¿cuál es la clase más cercana: «ser vivo», «roedor» o «animal»?',
      datos: [D_CERCANA, 'Roedor: animal con dientes delanteros que no dejan de crecer, como el ratón.'],
      figura: fig({ soporte: 'cartel', lugar: 'Cartel de la feria agropecuaria', hojas: [{ id: 'h', titulo: 'Concurso del cuy', de: 'la comisión de la feria', para: 'criadores', oraciones: ora('h', [
        'El domingo se premiará al cuy de mayor peso.', 'Cada criador puede presentar hasta tres cuyes.']) }] }),
      solucion: [
        { texto: ['Las tres clases contienen al cuy. «Ser vivo» y «animal» ', prop('son muy amplias'), ': en ellas también entran la alpaca y la gallina.'] },
        { texto: [cubre('«Roedor»'), ' es la más chica de las tres: ya deja fuera a la alpaca y a la gallina.'] }],
      respuesta: [justo('«Roedor»'), ': la clase más cercana'] },

    { nivel: 2, titulo: 'La bicicleta sin su rasgo',
      enunciado: 'A esta definición de «bicicleta» le falta un rasgo. ¿Qué vecino se cuela, y cuál lo deja fuera: «con asiento», «con timón» o «que se mueve con pedales»?',
      datos: [D_DEF, D_AMPLIA, D_VECINO],
      figura: fig(cuaderno('Cuaderno de Diego', 'Glosario de Educación Física', 'Diego', 'la exposición del jueves', ['Bicicleta: vehículo de dos ruedas.'])),
      solucion: [
        { texto: ['La motocicleta también es un ', cubre('vehículo de dos ruedas'), ': se cuela. La definición es ', prop('muy amplia'), '.'] },
        { texto: ['La motocicleta también tiene asiento y timón: esos rasgos no la separan. Pedales no tiene: ', cubre('«que se mueve con pedales»'), ' la deja fuera.'] }],
      respuesta: [justo('Se cuela la motocicleta'), '; la deja fuera «que se mueve con pedales»'] },
    { nivel: 2, titulo: 'El campeonato del sábado',
      enunciado: 'Con la definición de la oración 2, ¿entra un equipo de seis varones? ¿Qué rasgo falta: «con uniforme», «con mujeres y varones» o «del mismo salón»?',
      datos: [D_DEF, D_AMPLIA],
      figura: fig({ soporte: 'mural', lugar: 'Mural del colegio', hojas: [{ id: 'h', titulo: 'Convocatoria del municipio escolar', para: 'secciones de 4.º y 5.º', oraciones: ora('h', [
        'El sábado habrá un campeonato de vóley para equipos mixtos.', 'Equipo mixto: equipo de seis jugadores.']) }] }),
      solucion: [
        { texto: ['Seis varones forman un ', cubre('equipo de seis jugadores'), ': entran. Pero no son un equipo mixto: la definición es ', prop('muy amplia'), '.'] },
        { texto: ['Un equipo de seis varones puede tener uniforme y ser del mismo salón. Lo que no tiene es ', cubre('mujeres y varones'), '.'] }],
      respuesta: [justo('Sí entra'), '; falta el rasgo «con mujeres y varones»'] },
    { nivel: 2, titulo: 'La clase del chullo',
      enunciado: '¿Qué frase define «chullo» con la clase más cercana: «prenda de lana», «gorro de lana con orejeras» o «cosa que abriga la cabeza»?',
      datos: [D_DEF, D_CERCANA, D_AMPLIA],
      figura: fig({ soporte: 'cartel', lugar: 'Cartel en un puesto de tejidos', hojas: [{ id: 'h', titulo: 'Chullos de alpaca', de: 'la asociación de tejedoras', para: 'visitantes', oraciones: ora('h', [
        'Cada chullo se teje a mano.', 'Sus dibujos cambian de una comunidad a otra.']) }] }),
      solucion: [
        { texto: ['Con «prenda de lana» entra la chompa, y con «cosa que abriga la cabeza», el sombrero: las dos clases quedan lejos y son ', prop('muy amplias'), '.'] },
        { texto: [cubre('«Gorro»'), ' es la clase más cercana, y ', cubre('«con orejeras»'), ' lo separa de los otros gorros.'] }],
      respuesta: [justo('«Gorro de lana con orejeras»')] },
    { nivel: 2, titulo: 'El lago y sus vecinos',
      enunciado: 'En esta definición de «lago» se cuelan el río y el mar. ¿Con cuál queda justa: «muy grande», «que corre hacia el mar» o «que no corre, rodeada de tierra»?',
      datos: [D_DEF, D_AMPLIA, D_OTRA],
      figura: fig(cuaderno('Cuaderno de Rosa', 'Glosario de Ciencias Sociales', 'Rosa', 'la práctica del martes', ['Lago: masa de agua.'])),
      solucion: [
        { texto: ['«Muy grande» no separa: el mar también lo es. «Que corre hacia el mar» es el rasgo del río: ', prop('define al vecino'), '.'] },
        { texto: ['El río corre y el mar no está rodeado de tierra: ', cubre('«que no corre, rodeada de tierra»'), ' deja fuera a los dos.'] }],
      respuesta: [justo('«Masa de agua que no corre, rodeada de tierra»')] },
    { nivel: 2, titulo: 'El concurso de cuentos',
      enunciado: 'La oración 2 define «cuento inédito». ¿Su rasgo deja fuera un cuento que ya salió en la revista del colegio? Si no, ¿cuál lo haría?',
      datos: [D_DEF, D_AMPLIA, 'Inédito: que todavía no se ha publicado.'],
      figura: fig({ soporte: 'cartel', lugar: 'Cartel en la biblioteca del colegio', hojas: [{ id: 'h', titulo: 'Concurso de cuentos', de: 'la biblioteca', para: 'estudiantes de 1.º a 5.º', oraciones: ora('h', [
        'Solo se recibirán cuentos inéditos.', 'Cuento inédito: cuento escrito por un estudiante del colegio.']) }] }),
      solucion: [
        { texto: ['Un cuento de la revista también puede ser ', cubre('de un estudiante del colegio'), ': entra. El rasgo no separa y la definición es ', prop('muy amplia'), '.'] },
        { texto: ['Lo que separa a un cuento inédito de uno de la revista es ', cubre('que todavía no se ha publicado'), '.'] }],
      respuesta: [justo('No lo deja fuera'), '; el rasgo es «que todavía no se ha publicado»'] },

    { nivel: 3, titulo: 'La palabra «helada»',
      enunciado: 'Pregunta 31 del simulacro, de definiciones: hay que elegir la que define mejor «helada». ¿Qué alternativa es la correcta?',
      datos: [D_DEF, D_AMPLIA, D_OTRA, D_SINCLASE, 'Congelarse: volverse hielo, como el agua de un charco en una noche muy fría.'],
      // Sin cifra ni fuente: el rasgo es que el frío llega a congelar el agua (antes decía «0 °C o menos» y citaba un
      // atlas que no se pudo comprobar en esta sesión; decisión de la sesión, 19 nov).
      figura: fig(simDef(31, '¿Qué alternativa define mejor la palabra «helada»?', ['Descenso de la temperatura del aire hasta que el agua se congela.', 'Fenómeno del clima que cada año afecta a las chacras y a los animales del altiplano.',
        'Descenso de la temperatura del aire.', 'Caída de granos de hielo desde las nubes.', 'Lo que quema los sembríos en las noches de junio.'])),
      solucion: [
        { texto: [mala('B'), ' usa una clase lejana, «fenómeno del clima»: entra la sequía. ', mala('C'), ' no trae el rasgo: entra una tarde fresca. Son ', prop('muy amplias'), '.'] },
        { texto: [mala('D'), ' define a un vecino, el granizo. ', mala('E'), ' empieza con «lo que»: no dice qué es.'] },
        { texto: [buena('A'), ' da la clase, ', cubre('«descenso de la temperatura del aire»'), ', y el rasgo, ', cubre('«hasta que el agua se congela»'), '.'] }],
      respuesta: [buena('A'), ': descenso de la temperatura del aire hasta que el agua se congela'] },
    { nivel: 3, titulo: 'El verbo «remendar»',
      enunciado: 'Pregunta 32 del simulacro, de definiciones: hay que elegir la que define mejor el verbo «remendar». ¿Qué alternativa es la correcta?',
      datos: [D_DEF, D_AMPLIA, D_OTRA, D_SINCLASE],
      figura: fig(simDef(32, '¿Qué alternativa define mejor el verbo «remendar»?', ['Coser.', 'Arreglar una cosa que dejó de funcionar.',
        'Coser un parche o unas puntadas en una tela rota.', 'Coser dos telas nuevas para hacer una prenda de vestir.', 'Con aguja e hilo, sobre la parte gastada.'])),
      solucion: [
        { texto: [mala('A'), ' no trae el rasgo: también entra coser un botón. ', mala('B'), ' usa una clase lejana: entra arreglar una radio. Son ', prop('muy amplias'), '.'] },
        { texto: [mala('D'), ' define a un vecino: confeccionar. ', mala('E'), ' dice con qué y dónde, pero no qué acción es.'] },
        { texto: [buena('C'), ' da la clase, ', cubre('«coser»'), ', y el rasgo: ', cubre('«un parche o unas puntadas en una tela rota»'), '.'] }],
      respuesta: [buena('C'), ': coser un parche o unas puntadas en una tela rota'] },
    { nivel: 3, titulo: 'La palabra «andén»',
      enunciado: 'Pregunta 33 del simulacro, de definiciones: hay que elegir la que define mejor «andén», el del campo. ¿Qué alternativa es la correcta?',
      datos: [D_DEF, D_AMPLIA, D_OTRA, D_SINCLASE, 'Ladera: lado inclinado de un cerro.', 'Chullpa: torre funeraria antigua, de piedra, como las de Sillustani.'],
      figura: fig(simDef(33, '¿Qué alternativa define mejor la palabra «andén», el del campo?', ['Terreno de cultivo.', 'Construcción antigua de piedra.',
        'Canal abierto en la tierra que lleva el agua de riego hasta las chacras.', 'En la ladera del cerro, con muros de piedra.', 'Terraza de cultivo hecha en una ladera, con un muro de piedra.'])),
      solucion: [
        { texto: [mala('A'), ' no trae el rasgo: entra cualquier chacra. ', mala('B'), ' usa una clase lejana: entra una chullpa. Son ', prop('muy amplias'), '.'] },
        { texto: [mala('C'), ' define a un vecino: la acequia. ', mala('D'), ' dice dónde y con qué, pero no qué es.'] },
        { texto: [buena('E'), ' da la clase, ', cubre('«terraza de cultivo»'), ', y el rasgo: ', cubre('«hecha en una ladera, con un muro de piedra»'), '.'] }],
      respuesta: [buena('E'), ': terraza de cultivo en una ladera, con muro de piedra'] },
    { nivel: 3, titulo: 'El género próximo',
      enunciado: 'Pregunta 34 del simulacro: «En la definición, el género próximo es». ¿Qué alternativa es la correcta?',
      datos: [D_GENERO, D_DEF],
      figura: fig(simDef(34, 'En la definición, el género próximo es', ['barómetro.', 'instrumento.', 'que mide la presión del aire.', 'la presión del aire.', 'mide.'],
        ['Barómetro: instrumento que mide la presión del aire.'])),
      solucion: [
        { texto: [mala('A'), ' es la palabra que se define. ', mala('C'), ' es la diferencia específica: separa al barómetro de otros instrumentos.'] },
        { texto: [mala('D'), ' y ', mala('E'), ' son pedazos del rasgo: ninguno responde «¿qué es?».'] },
        { texto: [buena('B'), ' responde «¿qué es un barómetro?»: ', cubre('un instrumento'), '. Es la clase más cercana.'] }],
      respuesta: [buena('B'), ': instrumento'] },
    { nivel: 3, titulo: 'Cinco definiciones cortas',
      enunciado: 'Pregunta 35 del simulacro: «¿Cuál de estas definiciones es muy amplia?». ¿Qué alternativa es la correcta?',
      datos: [D_DEF, D_AMPLIA, D_VECINO],
      figura: fig(simDef(35, '¿Cuál de estas definiciones es muy amplia?', ['Triángulo: polígono de tres lados.', 'Semana: periodo de siete días seguidos.',
        'Huérfano: persona que perdió a su padre, a su madre o a los dos.', 'Cuchillo: utensilio que se usa en la cocina.', 'Abuelo: padre del padre o de la madre.'])),
      solucion: [
        { texto: [mala('A'), ', ', mala('B'), ', ', mala('C'), ' y ', mala('E'), ' dan la clase y un rasgo que separa: el cuadrado tiene cuatro lados y el mes, más de siete días.'] },
        { texto: [buena('D'), ' da un rasgo que no separa: en «utensilio que se usa en la cocina» también entran ', prop('la olla y el cucharón'), '.'] }],
      respuesta: [buena('D'), ': deja entrar a la olla y al cucharón'] },
  ];

  const claseRasgo = {
    id: 'genero-diferencia',
    titulo: 'Clase y rasgo que separa',
    pregunta: '¿Qué dos piezas tiene una definición?',
    temas: ['Género próximo', 'Diferencia específica'],
    pieza: 'rv-definicion',
    lee: {
      tarjetas: [
        { titulo: 'Un cartel que necesita definir', texto: 'En un paradero de Juliaca, la municipalidad pegó este cartel para los conductores. ¿Le toca al tricitaxi? ¿Y a la motocarga? Para saberlo, el cartel tiene que decir qué es un mototaxi: tiene que dar su definición.',
          pieza: 'rv-soporte', dibujo: { datos: CARTEL, estado: {} } },
        { titulo: 'La clase: ¿qué es?', texto: 'Una definición empieza por la clase: el grupo al que pertenece la cosa. Un cuy es un animal; una quena, un instrumento musical. La clase responde «¿qué es?», pero en ella todavía entran muchas cosas.' },
        { titulo: 'Los vecinos se cuelan', texto: 'Los vecinos son las cosas parecidas, de la misma clase. Si la ficha de «quena» solo dice su clase, la quena entra (turquesa) y sus vecinos se cuelan: entran sin ser quenas (naranja). La pizarra queda fuera (gris).',
          pieza: 'rv-definicion', dibujo: { datos: FIG_LEE, estado: EST_LEE } },
        { titulo: 'Qué mirar al jugar', texto: 'Debajo del cartel está la ficha de «mototaxi», con su clase y dos rasgos, y la tabla de los vehículos del paradero. Toca una pieza de la ficha para cambiarla y mira en la tabla quién entra.' },
      ],
    },
    actividad: 'Armar la definición de «mototaxi» y ver qué vehículos del paradero entran.',
    aprendizaje: 'Una definición dice la clase de la cosa y el rasgo que la separa de sus vecinos; si un vecino entra, es muy amplia.',
    ejemplos: EJEMPLOS_CLASE,
    juega: {
      consigna: 'La municipalidad pide que todo mototaxi pinte su número. Falta decir qué es un mototaxi, para saber a quién le toca.',
      mision: {
        texto: `Arma la definición que deje entrar a los ${N_MOTO} mototaxis y a ningún otro vehículo.`,
        logrado: val => { const r = medir(condDe(val), esMoto); return !r.cuelan.length && !r.faltan.length; },
        bien: 'Listo: con la clase cercana y los dos rasgos no se cuela ninguno.',
      },
      voz: 'Cambia una sola pieza cada vez y mira quién entra en la tabla.',
      leyenda: [
        { s: 'Clase', t: 'el grupo: responde «¿qué es?»' },
        { s: 'Rasgo', t: 'lo que lo separa de sus vecinos' },
        { s: cubre('turquesa'), t: 'vehículo que entra y es mototaxi' },
        { s: prop('naranja'), t: 'vehículo que se cuela, o la definición amplia' },
        { s: 'gris', t: 'vehículo que queda fuera' },
        { s: justo('violeta'), t: 'la definición que quedó justa' },
        { s: 'botón marcado', t: 'lo que elegiste; no es color del texto' },
      ],
      controles: [
        { id: 'g', etiqueta: 'Clase', opciones: Object.entries(CLASES).map(([valor, c]) => ({ valor, texto: c.t })) },
        { id: 'm', etiqueta: 'Rasgo 1', opciones: [{ valor: 0, texto: 'sin él' }, { valor: 1, texto: R_MOTOR }] },
        { id: 'p', etiqueta: 'Rasgo 2', opciones: [{ valor: 0, texto: 'sin él' }, { valor: 1, texto: R_PASAJ }] },
      ],
      dibujo: val => ({ datos: FIG_MOTO, estado: estFicha(partesDe(val), condDe(val), esMoto) }),
      lectura: lecturaMoto,
      minimo: 4,
    },
    predice: {
      pregunta: 'El paradero necesita otra ficha: la de «motocarga». ¿Qué definición deja entrar solo a la motocarga de la tabla?',
      opciones: [
        { id: 'c', texto: OPS_CARGA.c.texto, correcta: true },
        { id: 'rasgo', texto: OPS_CARGA.rasgo.texto, error: 'RVD2', siFuera: 'La clase y el motor están bien, pero también entran los dos mototaxis: falta un rasgo.' },
        { id: 'clase', texto: OPS_CARGA.clase.texto, error: 'RVD6', siFuera: 'Los dos rasgos están bien, pero con esa clase tan amplia también entra la camioneta.' },
        { id: 'vecino', texto: OPS_CARGA.vecino.texto, error: 'RVD7', siFuera: 'Tiene clase y dos rasgos, pero es la definición del mototaxi: la motocarga queda fuera.' },
      ],
      dibujo: { datos: FIG_CARGA, estado: {} },
      revelar: { datos: FIG_CARGA, estado: estCarga('c') },
      coincide: 'Coincide: la clase deja fuera a la camioneta; «con motor», al triciclo de carga, y «que lleva carga», a los mototaxis.',
    },
    mira: {
      datos: FIG_CARGA,
      pasos: [
        { estado: estCarga('clase', { nuevo: ['g', ...cuelanCarga('clase').map(v => v.id)] }), texto: 'Con la clase «vehículo» también entra la camioneta: esa clase queda lejos.',
          ecuacion: [prop('muy amplia'), ': se cuela ', prop(lista(cuelanCarga('clase').map(v => v.corto)))] },
        { estado: estCarga('rasgo', { nuevo: ['g', ...cuelanCarga('rasgo').map(v => v.id)] }), texto: 'Con la clase cercana y un solo rasgo, se cuelan los dos mototaxis.',
          ecuacion: [prop('muy amplia'), ': se cuelan ', prop(`${cuelanCarga('rasgo').length} mototaxis`)] },
        { estado: estCarga('vecino', { nuevo: ['r2'] }), texto: '«Que lleva pasajeros» es el rasgo del mototaxi: la motocarga queda fuera.',
          ecuacion: [prop('define al vecino'), ': entran ', prop(`${cuelanCarga('vecino').length} mototaxis`)] },
        { estado: estCarga('c', { nuevo: ['g', 'r1', 'r2', 'v4'] }), texto: 'Clase cercana y dos rasgos: entra solo la motocarga.',
          ecuacion: [justo('justa'), ': entra ', cubre('la motocarga'), ' y nadie más'] },
        { estado: estCarga('c'), texto: 'Prueba final: ¿se cuela algún vecino? Ninguno. ¿Queda fuera la motocarga? No.' },
      ],
    },
    regla: {
      // Sin paréntesis pegado a «diferencia específica»: el subrayado del glosario dejaba el «(» solo al final del renglón.
      texto: 'Una definición dice la clase de la cosa (género próximo) y el rasgo que la separa de sus vecinos: su diferencia específica. Si un vecino se cuela, es muy amplia.',
      ecuacion: ['definición = ', { llave: [{ negrita: 'clase' }], nota: '¿qué es?' }, ' + ', { llave: [{ negrita: 'rasgo que separa' }], nota: 'solo ella lo tiene' }],
      condicion: 'la clase es la más cercana que contiene a todos los casos, y ningún vecino tiene todos los rasgos.',
    },
    resuelve: {
      pieza: 'rv-soporte',
      generar(s) {
        const R = RESUELVE[s % RESUELVE.length];
        return {
          enunciado: R.enunciado,
          datos: R.datos,
          dibujo: { datos: R.sop, estado: {} },
          pasos: [
            { tipo: 'pide', texto: `Piden la definición de «${R.c}»: la clase y el rasgo que deja fuera a sus vecinos.` },
            { tipo: 'datos', texto: R.tengo },
            { tipo: 'regla', texto: 'Clase cercana más rasgo que separa. Si un vecino entra, es muy amplia; si el rasgo es de otra cosa, define al vecino.' },
            { tipo: 'aplica', texto: R.malas },
            { tipo: 'aplica', texto: R.bien, dibujo: { datos: R.sop, estado: estResuelto(R) } },
            { tipo: 'sentido', texto: R.sentido },
          ],
          respuesta: R.respuesta,
        };
      },
    },
    ahoraTu: {
      pieza: 'rv-soporte',
      generar(s) {
        const A = AHORA[s % AHORA.length], sop = sinPie(A.sop);
        return {
          pregunta: A.pregunta,
          datos: A.datos,
          dibujo: { datos: sop, estado: {} },
          opciones: opciones(A.ok, voltear(A.m, s)),
          solucion: { texto: A.sol, ecuacion: [justo(A.ok)],
            dibujo: { datos: conHueco(sop, A.ok), estado: { marcas: Object.fromEntries(huecoDe(sop).map(id => [id, 'f'])) } } },
        };
      },
    },
  };

  // La mesa de la idea 1: el mismo juego, sin la misión (en el laboratorio nada se califica). Los retos los decide
  // `medir`, con los rasgos de cada vehículo.
  const mesaParadero = Object.assign({ id: 'paradero', titulo: 'La ficha del paradero', pieza: 'rv-definicion' }, sinMision(claseRasgo.juega), {
    invitaciones: [
      { texto: 'Haz que la combi sea el único vehículo que se cuela.',
        logrado: val => { const r = medir(condDe(val), esMoto); return r.cuelan.length === 1 && r.cuelan[0].n === 'combi'; },
        bien: 'La combi tiene motor y lleva pasajeros: solo la clase la deja fuera.' },
      { texto: 'Haz que la motocarga sea el único vehículo que se cuela.',
        logrado: val => { const r = medir(condDe(val), esMoto); return r.cuelan.length === 1 && r.cuelan[0].n === 'motocarga'; },
        bien: 'La motocarga tiene tres ruedas y motor: solo «que lleva pasajeros» la deja fuera.' },
      { texto: 'Guarda dos fichas distintas con un solo vehículo colado cada una.',
        logrado: (val, guardados) => { const uno = v => medir(condDe(v), esMoto).cuelan.length === 1; return uno(val) && guardados.some(g => uno(g) && JSON.stringify(partesDe(g)) !== JSON.stringify(partesDe(val))); },
        bien: 'Cada pieza que falta deja pasar a un vecino distinto.' },
    ] });


  // ---------- Idea 2: necesario, no solo frecuente (etapa 5, fase 3; docs/etapa5/propuesta-verbal.md) ----------
  // Cambia: el rasgo de la ficha de «ave». Permanece: la lámina de la feria y los seis animales con sus rasgos.
  // Progresa: cuántas aves quedan fuera y cuántos animales se cuelan. Se reserva: el rasgo que tienen todas las aves y
  // también un vecino, «pone huevos» (predicción). Debe verse: que un rasgo frecuente deja fuera casos (muy estrecha).
  // Objeto de la primera pantalla: la lámina que 2.º B pega en el mural de la feria de ciencias, con su ficha.
  // Colores: ave que entra, i; animal mal ubicado (se cuela, o es ave y queda fuera), o; definición justa, f; fuera, gris.
  // Datos del mundo (de conocimiento general, sin cifras): el zambullidor del Titicaca y el suri son aves que no vuelan;
  // la gaviota andina y la parihuana vuelan; el murciélago es un mamífero que vuela; la rana gigante del Titicaca pone
  // huevos y vive en el lago. Fuentes para el auditor: SERNANP (Reserva Nacional del Titicaca) y SERFOR, Libro Rojo (2018).
  const D_ESTRECHA = 'Muy estrecha: la definición deja fuera un caso que sí es la cosa.';
  const D_NECES = 'Rasgo necesario: lo tienen todos los casos, sin excepción.';
  const D_SUFI = 'Rasgo suficiente: no lo tiene ningún vecino; basta para separar.';
  const D_EJEMPLO = 'Ejemplo: un caso de la cosa. La muestra, pero no la define.';

  const LAMINA = { soporte: 'mural', lugar: 'Mural de la feria de ciencias', hojas: [
    { id: 'l', titulo: 'Animales del altiplano', de: '2.º B', para: 'los visitantes de la feria', oraciones: ora('l', [
      'En esta lámina hay cuatro aves y dos animales que no lo son.']) }] };
  const ANI = [
    { id: 'a1', n: 'zambullidor', corto: 'el zambullidor', vuela: false, plumas: true, huevos: true, lugar: 'lago', ave: true },
    { id: 'a2', n: 'murciélago', corto: 'el murciélago', vuela: true, plumas: false, huevos: false, lugar: 'cueva' },
    { id: 'a3', n: 'gaviota', corto: 'la gaviota', vuela: true, plumas: true, huevos: true, lugar: 'lago', ave: true },
    { id: 'a4', n: 'rana gigante', corto: 'la rana', vuela: false, plumas: false, huevos: true, lugar: 'lago' },
    { id: 'a5', n: 'suri', corto: 'el suri', vuela: false, plumas: true, huevos: true, lugar: 'puna', ave: true },
    { id: 'a6', n: 'parihuana', corto: 'la parihuana', vuela: true, plumas: true, huevos: true, lugar: 'lago', ave: true },
  ];
  const sn = b => (b ? 'sí' : 'no');
  const TABLA_ANI = { titulo: 'Animales de la lámina', cols: ['Animal', 'Vuela', 'Plumas', 'Huevos', 'Lugar'], anchos: [100, 42, 54, 56, 42],
    filas: ANI.map(a => ({ id: a.id, celdas: [a.n, sn(a.vuela), sn(a.plumas), sn(a.huevos), a.lugar] })) };
  const RASGOS_AVE = {
    vuela: { t: 'que vuela', cond: { vuela: true } }, lago: { t: 'que vive en el lago', cond: { lugar: 'lago' } },
    plumas: { t: 'que tiene plumas', cond: { plumas: true } }, huevos: { t: 'que pone huevos', cond: { huevos: true } } };
  const N_AVES = ANI.filter(a => a.ave).length;
  // Qué pasa con un rasgo: qué aves quedan fuera y qué animales se cuelan.
  const medirAve = k => ({ dentro: ANI.filter(a => entra(a, RASGOS_AVE[k].cond)), faltan: ANI.filter(a => a.ave && !entra(a, RASGOS_AVE[k].cond)), cuelan: ANI.filter(a => !a.ave && entra(a, RASGOS_AVE[k].cond)) });
  const estAve = (k, extra = {}) => {
    const r = medirAve(k), justa = !r.faltan.length && !r.cuelan.length;
    const nf = r.faltan.length, nc = r.cuelan.length;
    return Object.assign({
      partes: { g: 'animal', r: RASGOS_AVE[k].t }, color: justa ? 'f' : 'o',
      // El ave que queda fuera va en naranja y en gris a la vez: está mal ubicada y fuera.
      filas: Object.fromEntries([...r.dentro.map(a => [a.id, a.ave ? 'i' : 'o']), ...r.faltan.map(a => [a.id, 'o'])]),
      tenue: ANI.filter(a => !entra(a, RASGOS_AVE[k].cond)).map(a => a.id),
      sello: justa ? { t: `Justa: las ${N_AVES} aves y nadie más`, c: 'f' }
        : { t: [nf ? `Fuera ${nf} ${nf === 1 ? 'ave' : 'aves'}` : '', nc ? `se ${nc === 1 ? 'cuela' : 'cuelan'} ${nc}` : ''].filter(Boolean).join(' · ').replace(/^s/, 'S'), c: 'o' },
    }, extra);
  };
  const ENT_AVE = { termino: 'ave', rotulo: 'Ficha de la lámina', partes: [{ id: 'g', papel: 'Clase', hueco: 'animal' }, { id: 'r', papel: 'Rasgo' }] };
  const FIG_AVE = { soporte: LAMINA, toques: { r: 'r' }, casos: TABLA_ANI, entrada: ENT_AVE };
  const FIG_HUEVOS = { casos: TABLA_ANI, entrada: { termino: 'ave', rotulo: 'Otra ficha', partes: [{ id: 'g', papel: 'Clase', hueco: 'animal' }, { id: 'r', papel: 'Rasgo', hueco: RASGOS_AVE.huevos.t }] } };
  const lecturaAve = val => {
    const r = medirAve(val.r);
    if (!r.faltan.length && !r.cuelan.length) return [justo('Justa'), ': entran ', cubre(`las ${N_AVES} aves`), ' y nadie más'];
    const out = [];
    if (r.faltan.length) out.push(prop('Muy estrecha'), ': fuera ', prop(lista(r.faltan.map(a => a.corto))));
    else out.push(prop('Muy amplia'));
    if (r.cuelan.length) out.push(r.faltan.length ? '; se cuela ' : ': se cuela ', prop(lista(r.cuelan.map(a => a.corto))));
    return out;
  };

  // «Así se resuelve»: tres cuadernos o fichas con tres definiciones numeradas y una hoja con cinco alternativas. La
  // buena cambia de lugar: 2.ª, 3.ª, 1.ª y D. Ningún caso es de «Ahora tú».
  const RESUELVE_NEC = [
    { c: 'cuadrado', buena: 'h2',
      sop: cuaderno('Cuaderno de Rosa', 'Matemática: cuadrado', 'Rosa', 'el examen del lunes', [
        'Figura de cuatro lados y cuatro ángulos rectos.', 'Figura de cuatro lados iguales y cuatro ángulos rectos.', 'Figura de cuatro lados iguales y ángulos rectos, de un metro de lado.']),
      enunciado: 'Rosa tiene tres definiciones de «cuadrado». ¿En cuál los rasgos están en todos los cuadrados y en ninguna otra figura?',
      datos: [D_NECES, D_ESTRECHA, D_AMPLIA],
      tengo: 'Las tres dicen la clase, «figura». Vecinos del cuadrado: el rectángulo y el rombo. Hay cuadrados de todos los tamaños.',
      malas: ['La 1 pide rasgos que también tiene el rectángulo: ', prop('muy amplia'), '. La 3 agrega «de un metro de lado» y deja fuera los demás cuadrados: ', prop('muy estrecha'), '.'],
      bien: ['La 2 pide ', cubre('cuatro lados iguales y cuatro ángulos rectos'), ': lo tienen todos los cuadrados y ninguna otra figura.'],
      sentido: 'Un cuadrado chico o girado sigue cumpliendo la 2; un rectángulo o un rombo, no.',
      respuesta: [justo('La 2'), ': cuatro lados iguales y cuatro ángulos rectos'] },
    { c: 'libro', buena: 'h3',
      sop: cuaderno('Cuaderno de Diego', 'Glosario: libro', 'Diego', 'la visita a la biblioteca', [
        'Conjunto de hojas unidas por un lado.', 'Conjunto de hojas impresas y unidas, con dibujos a color.', 'Conjunto de hojas impresas, unidas por un lado.']),
      enunciado: 'Diego escribió tres definiciones de «libro» antes de visitar la biblioteca. ¿Cuál no deja fuera ningún libro ni deja entrar a un cuaderno?',
      datos: [D_NECES, D_ESTRECHA, D_AMPLIA],
      tengo: 'Las tres dicen la clase, «conjunto de hojas». El vecino es el cuaderno, que viene en blanco. Hay libros sin dibujos, como un diccionario.',
      malas: ['La 1 vale también para un cuaderno: ', prop('muy amplia'), '. La 2 pide «dibujos a color», que es frecuente y no de todos: deja fuera el diccionario, ', prop('muy estrecha'), '.'],
      bien: ['La 3 pide ', cubre('hojas impresas, unidas por un lado'), ': lo tiene todo libro y no lo tiene el cuaderno.'],
      sentido: 'El diccionario, sin dibujos, cumple la 3; el cuaderno en blanco, no.',
      respuesta: [justo('La 3'), ': hojas impresas, unidas por un lado'] },
    { c: 'reloj', buena: 'h1',
      sop: { soporte: 'mural', lugar: 'Mural del museo escolar', hojas: [{ id: 'h', titulo: 'Ficha por completar: reloj', de: '1.º C', para: 'los visitantes del museo', oraciones: ora('h', [
        'Instrumento que mide el tiempo y muestra la hora del día.', 'Instrumento redondo, con dos agujas que giran sobre doce números.', 'Instrumento como el de la torre de la plaza.']) }] },
      enunciado: 'Los alumnos de 1.º C deben elegir la definición de «reloj» para su museo. ¿Cuál vale para todos los relojes?',
      datos: [D_NECES, D_ESTRECHA, D_EJEMPLO],
      tengo: 'Las tres dicen la clase, «instrumento». Hay relojes de agujas y relojes digitales, que no tienen agujas.',
      malas: ['La 2 pide agujas, que es frecuente y no de todos: deja fuera el reloj digital, ', prop('muy estrecha'), '. La 3 ', prop('da un ejemplo'), ': no dice qué tienen todos.'],
      bien: ['La 1 pide ', cubre('que mida el tiempo y muestre la hora'), ': lo hace todo reloj, con agujas o sin ellas.'],
      sentido: 'El reloj digital del celular cumple la 1 aunque no sea redondo ni tenga agujas.',
      respuesta: [justo('La 1'), ': instrumento que mide el tiempo y muestra la hora'] },
    { c: 'volcán', buena: 'D', hoja: true,
      sop: simDef(12, '¿Qué alternativa define mejor la palabra «volcán»?', ['Montaña.', 'Montaña con nieve en la punta.', 'El Misti, que se ve desde Arequipa.',
        'Montaña con una abertura por donde puede salir lava.', 'Montaña del Perú con una abertura por donde sale lava y humo.']),
      enunciado: 'Pregunta 12 del simulacro, de definiciones: hay que elegir la que define mejor «volcán». Las alternativas están en la hoja.',
      datos: [D_NECES, D_ESTRECHA, D_AMPLIA, D_EJEMPLO, 'Lava: roca derretida que sale del interior de la Tierra.'],
      tengo: 'Hay cinco alternativas. Hay volcanes con nieve y sin nieve, en el Perú y en otros países. Su vecino es el cerro que no es volcán.',
      malas: [mala('A'), ' vale para cualquier cerro: ', prop('muy amplia'), '. ', mala('B'), ' y ', mala('E'), ' piden nieve o «del Perú» y dejan volcanes fuera: ', prop('muy estrechas'), '. ', mala('C'), ' es un ejemplo.'],
      bien: [buena('D'), ' pide ', cubre('una abertura por donde puede salir lava'), ': la tiene todo volcán y ningún cerro común.'],
      sentido: 'Un volcán sin nieve, de cualquier país, cumple la D; un nevado que no es volcán, no.',
      respuesta: [buena('D'), ': montaña con una abertura por donde puede salir lava'] },
  ];

  // «Ahora tú»: una lámina, un cuaderno o un cartel con tres casos, y se pide el rasgo que tienen todos y ningún
  // vecino. Códigos: RVD1 (rasgo frecuente tomado por necesario: muy estrecha), RVD3 (rasgo necesario que no basta: muy
  // amplia), RV56 (un ejemplo en lugar del rasgo) y RVD4 (agrega un rasgo de más: muy estrecha).
  const lamina = (lugar, titulo, de, casos) => ({ soporte: 'mural', lugar, hojas: [{ id: 'k', titulo, de, para: 'los visitantes', oraciones: ora('k', casos) }] });
  const AHORA_NEC = [
    { sop: lamina('Mural de la feria de ciencias', 'Peces', '1.º A', ['La trucha vive en ríos y lagos.', 'La sardina vive en el mar.', 'El caballito de mar nada de pie.']),
      pregunta: 'La lámina muestra tres peces. ¿Qué rasgo de «pez» está en todos y no en un animal que no es pez?', datos: [D_NECES, D_SUFI, D_EJEMPLO],
      ok: 'Respira por branquias toda su vida', sol: 'La trucha, la sardina y el caballito de mar respiran por branquias; el pato, no.',
      m: [['Vive en el mar', 'RVD1', 'Muchos peces son de mar, pero la trucha de la lámina vive en ríos y lagos.'],
        ['Nada en el agua', 'RVD3', 'Todos los peces nadan, pero también nada el pato, que no es pez.'],
        ['Es como la sardina que se vende en el mercado', 'RV56', 'La sardina es un pez, pero un caso no dice qué tienen todos.']] },
    { sop: cuaderno('Cuaderno de Rosa', 'Matemática: triángulos', 'Rosa', 'la práctica del miércoles', ['El equilátero tiene sus tres lados iguales.', 'El rectángulo tiene un ángulo recto.', 'El obtusángulo tiene un ángulo mayor que el recto.']),
      pregunta: 'Rosa anotó tres triángulos. ¿Qué rasgo de «triángulo» está en los tres y no en otra figura?', datos: [D_NECES, D_SUFI, D_EJEMPLO],
      ok: 'Tiene exactamente tres lados', sol: 'Los tres triángulos del cuaderno tienen tres lados; el cuadrado tiene cuatro.',
      m: [['Tiene un ángulo recto', 'RVD1', 'El triángulo rectángulo lo tiene, pero el equilátero no: no está en todos.'],
        ['Es una figura cerrada de lados rectos', 'RVD3', 'Todo triángulo lo es, pero también el cuadrado: no basta.'],
        ['Es como la escuadra de la clase', 'RV56', 'La escuadra tiene esa forma, pero un caso no dice qué tienen todos.']] },
    { sop: lamina('Mural de la feria de ciencias', 'Mamíferos', '3.º B', ['El perro corre en cuatro patas.', 'La ballena nada en el mar.', 'El murciélago vuela de noche.']),
      pregunta: 'La lámina muestra tres mamíferos. ¿Qué rasgo de «mamífero» está en los tres y no en un ave?', datos: [D_NECES, D_SUFI, D_EJEMPLO],
      ok: 'Alimenta a sus crías con leche', sol: 'El perro, la ballena y el murciélago dan leche a sus crías; un ave, no.',
      m: [['Camina en cuatro patas', 'RVD1', 'El perro sí, pero la ballena y el murciélago de la lámina no.'],
        ['Respira aire por los pulmones', 'RVD3', 'Los tres lo hacen, pero también las aves: no basta.'],
        ['Es un animal como el perro de la casa', 'RV56', 'El perro es un mamífero, pero un caso no dice qué tienen todos.']] },
    { sop: lamina('Mural de la feria de ciencias', 'Insectos', '2.º A', ['La hormiga obrera no tiene alas.', 'La mariposa vuela de flor en flor.', 'El escarabajo camina por el suelo.']),
      pregunta: 'La lámina muestra tres insectos. ¿Qué rasgo de «insecto» está en los tres y no en una araña?', datos: [D_NECES, D_SUFI, D_EJEMPLO, 'La araña tiene ocho patas.'],
      ok: 'Tiene seis patas', sol: 'La hormiga, la mariposa y el escarabajo tienen seis patas; la araña, ocho.',
      m: [['Tiene alas', 'RVD1', 'La mariposa sí, pero la hormiga obrera de la lámina no tiene alas.'],
        ['Es un animal pequeño', 'RVD3', 'Los tres lo son, pero también la araña, que no es un insecto.'],
        ['Es como la mosca que entra a la cocina', 'RV56', 'La mosca es un insecto, pero un caso no dice qué tienen todos.']] },
    { sop: { soporte: 'cartel', lugar: 'Cartel del taller de música', hojas: [{ id: 'k', titulo: 'Instrumentos de viento', de: 'el profesor de Música', para: 'el taller', oraciones: ora('k', [
        'La quena es de caña.', 'La zampoña tiene varios tubos.', 'La trompeta es de metal.']) }] },
      pregunta: 'El cartel nombra tres instrumentos de viento. ¿Qué rasgo está en los tres y no en un charango?', datos: [D_NECES, D_SUFI, D_ESTRECHA, D_EJEMPLO],
      ok: 'Suena cuando se sopla aire por él', sol: 'La quena, la zampoña y la trompeta suenan al soplar; el charango, al pulsar sus cuerdas.',
      m: [['Está hecho de caña', 'RVD1', 'La quena sí, pero la trompeta del cartel es de metal.'],
        ['Produce sonidos musicales', 'RVD3', 'Los tres lo hacen, pero también el charango, que es de cuerda.'],
        ['Es como la quena que toca el profesor', 'RV56', 'La quena es de viento, pero un caso no dice qué tienen todos.'],
        ['Suena cuando se sopla y tiene varios tubos de distinto largo', 'RVD4', 'Soplar está bien, pero «varios tubos» deja fuera a la quena y a la trompeta.']] },
    { sop: { soporte: 'mural', lugar: 'Mural del aula', hojas: [{ id: 'k', titulo: 'Calendario del año', de: 'la tutora', para: '4.º A', oraciones: ora('k', [
        'Febrero tiene veintiocho o veintinueve días.', 'Julio tiene treinta y uno.', 'Setiembre tiene treinta.']) }] },
      pregunta: 'El calendario nombra tres meses. ¿Qué rasgo de «mes» está en los tres y no en una semana?', datos: [D_NECES, D_SUFI, D_EJEMPLO],
      ok: 'Es una de las doce partes del año', sol: 'Febrero, julio y setiembre son tres de las doce partes del año; una semana, no.',
      m: [['Tiene treinta y un días', 'RVD1', 'Julio sí, pero febrero y setiembre no: no está en todos.'],
        ['Dura más de una semana', 'RVD3', 'Los tres duran más, pero también las vacaciones de verano.'],
        ['Es como julio, el mes de las Fiestas Patrias', 'RV56', 'Julio es un mes, pero un caso no dice qué tienen todos.']] },
  ];

  // Ejemplos resueltos de la idea 2. Nivel 1: una sola prueba (¿está en todos?, ¿define o da un ejemplo?, ¿basta?).
  // Nivel 2: dos pasos (hallar el caso que queda fuera y arreglar la definición; dos fallas a la vez). Nivel 3: hoja de
  // simulacro con cinco alternativas; las correctas son B, D, A, E y C.
  const EJEMPLOS_NEC = [
    { nivel: 1, titulo: 'Los perros del glosario',
      enunciado: 'Diego definió «perro» así. ¿El rasgo «con manchas» está en todos los perros?',
      datos: [D_NECES, D_ESTRECHA],
      figura: fig(cuaderno('Cuaderno de Diego', 'Glosario de animales', 'Diego', 'la clase de Ciencia y Tecnología', ['Perro: animal que ladra, con manchas en el pelo.'])),
      solucion: [
        { texto: ['Muchos perros tienen manchas, pero un perro de un solo color no: ', cubre('«con manchas»'), ' es frecuente, no de todos.'] },
        { texto: ['Ese perro es un perro y queda fuera: la definición es ', prop('muy estrecha'), '.'] }],
      respuesta: [justo('No'), ': deja fuera al perro de un solo color'] },
    { nivel: 1, titulo: 'El río de Rosa',
      enunciado: 'Rosa escribió esto para «río». ¿Lo define o solo da un ejemplo?',
      datos: [D_DEF, D_EJEMPLO],
      figura: fig(cuaderno('Cuaderno de Rosa', 'Glosario de Ciencias Sociales', 'Rosa', 'la práctica del martes', ['Río: como el Ramis, que llega al lago Titicaca.'])),
      solucion: [
        { texto: [cubre('«Como el Ramis»'), ' nombra un caso. No dice la clase ni el rasgo que tienen todos los ríos.'] }],
      respuesta: [justo('Solo da un ejemplo'), ': no define'] },
    { nivel: 1, titulo: 'La mesa de una pata',
      enunciado: 'Con esta entrada del diccionario, ¿entra una mesa redonda de una sola pata?',
      datos: [D_NECES, D_ESTRECHA],
      figura: fig(pagina('M', [['mesa', 'Mueble de cuatro patas, con un tablero para poner cosas encima.']])),
      solucion: [
        { texto: ['La mesa de una pata no cumple ', cubre('«de cuatro patas»'), ': queda fuera.'] },
        { texto: ['Pero es una mesa. La definición deja fuera un caso: es ', prop('muy estrecha'), '.'] }],
      respuesta: [justo('No entra'), ': la definición es muy estrecha'] },
    { nivel: 1, titulo: 'Las frutas del mercado',
      enunciado: 'Para definir «fruta», ¿«dulce» es un rasgo de todas las frutas de la lámina o solo de algunas?',
      datos: [D_NECES],
      figura: fig(lamina('Mural de la feria de ciencias', 'Frutas del mercado', '1.º B', ['El plátano y la naranja son dulces.', 'El limón es ácido.'])),
      solucion: [
        { texto: ['La oración 2 dice que ', cubre('el limón es ácido'), ': es una fruta y no es dulce.'] },
        { texto: ['«Dulce» está en muchas frutas, no en todas: no sirve para definir.'] }],
      respuesta: [justo('Solo de algunas'), ': el limón no es dulce'] },
    { nivel: 1, titulo: 'La abeja y la mosca',
      enunciado: 'Todas las abejas vuelan. ¿Basta «insecto que vuela» para dejar fuera a la mosca?',
      datos: [D_NECES, D_SUFI, D_AMPLIA],
      figura: fig(cuaderno('Cuaderno de Diego', 'Glosario de animales', 'Diego', 'la clase de Ciencia y Tecnología', ['Abeja: insecto que vuela.'])),
      solucion: [
        { texto: ['Volar es de todas las abejas. Pero la mosca también es un ', cubre('insecto que vuela'), ': entra.'] },
        { texto: ['El rasgo está en todas, pero no basta: se cuela un vecino y la definición es ', prop('muy amplia'), '.'] }],
      respuesta: [justo('No basta'), ': la mosca se cuela'] },

    { nivel: 2, titulo: 'El profesor del cartel',
      enunciado: 'Esta definición de «profesor» deja fuera a alguien. ¿A quién, y qué palabras hay que quitarle?',
      datos: [D_NECES, D_ESTRECHA],
      figura: fig({ soporte: 'cartel', lugar: 'Cartel en la sala de profesores', hojas: [{ id: 'h', titulo: 'Día del Maestro', de: 'el municipio escolar', para: 'los profesores', oraciones: ora('h', [
        'El 6 de julio saludamos a todos nuestros profesores.', 'Profesor: persona que enseña Matemática en un colegio.']) }] }),
      solucion: [
        { texto: ['Quien enseña Comunicación o Arte no cumple ', cubre('«que enseña Matemática»'), ' y queda fuera, aunque es profesor: ', prop('muy estrecha'), '.'] },
        { texto: ['Enseñar Matemática es de algunos profesores. Sin esa palabra queda «persona que enseña en un colegio».'] }],
      respuesta: [justo('Quien enseña otro curso'), '; sobra «Matemática»'] },
    { nivel: 2, titulo: 'Un mueble de madera',
      enunciado: 'Con esta definición de «mueble», ¿cuál queda fuera y cuál se cuela: la silla de plástico, la mesa de madera o la cuchara de palo?',
      datos: [D_ESTRECHA, D_AMPLIA],
      figura: fig(cuaderno('Cuaderno de Rosa', 'Glosario del hogar', 'Rosa', 'la clase de Educación para el Trabajo', ['Mueble: objeto de madera.'])),
      solucion: [
        { texto: ['La silla de plástico es un mueble y no es ', cubre('de madera'), ': queda fuera. Por ese lado es ', prop('muy estrecha'), '.'] },
        { texto: ['La cuchara de palo es un ', cubre('objeto de madera'), ' y no es un mueble: se cuela. Por ese lado es ', prop('muy amplia'), '.'] }],
      respuesta: [justo('Fuera, la silla de plástico'), '; se cuela la cuchara de palo'] },
    { nivel: 2, titulo: 'La araña y sus ocho patas',
      enunciado: '¿Cuál sirve sola para definir «araña»: «que teje telas», «de ocho patas» o ninguna de las dos?',
      datos: [D_NECES, D_SUFI, 'La tarántula es una araña que no teje telas para cazar.'],
      figura: fig(lamina('Mural de la feria de ciencias', 'Animales de ocho patas', '2.º C', ['La araña de jardín teje su tela entre las plantas.', 'El alacrán tiene ocho patas y una cola con aguijón.'])),
      solucion: [
        { texto: ['«Que teje telas» deja fuera a la tarántula: es frecuente, no de todas. Sola queda ', prop('muy estrecha'), '.'] },
        { texto: ['«De ocho patas» está en todas las arañas, pero también en ', cubre('el alacrán'), ' de la oración 2: sola queda ', prop('muy amplia'), '.'] }],
      respuesta: [justo('Ninguna sola'), ': una deja casos fuera y la otra deja entrar al alacrán'] },
    { nivel: 2, titulo: 'Dos frases para «textil»',
      enunciado: 'El folleto trae dos frases para «textil». ¿Cuál define y cuál solo muestra un caso? Con la que define, ¿entra una chompa?',
      datos: [D_DEF, D_EJEMPLO],
      figura: fig({ soporte: 'folleto', lugar: 'Folleto del museo de la ciudad', hojas: [{ id: 'h', titulo: 'Sala de textiles', de: 'el museo', para: 'visitantes', oraciones: ora('h', [
        'Textil: como el poncho de la vitrina 3.', 'Textil: objeto hecho con hilos tejidos.']) }] }),
      solucion: [
        { texto: ['La 1 nombra un caso, el poncho: ', prop('da un ejemplo'), '. La 2 dice la clase, «objeto», y el rasgo, ', cubre('«hecho con hilos tejidos»'), '.'] },
        { texto: ['Una chompa es un objeto hecho con hilos tejidos: entra, y está bien que entre.'] }],
      respuesta: [justo('Define la 2'), '; la chompa entra'] },
    { nivel: 2, titulo: 'Los socios de la biblioteca',
      enunciado: 'Según la oración 1, ¿la definición de la oración 2 deja fuera a alguien? ¿Cómo queda justa?',
      datos: [D_NECES, D_ESTRECHA],
      figura: fig({ soporte: 'cartel', lugar: 'Cartel en la biblioteca del colegio', hojas: [{ id: 'h', titulo: 'Carné de socio', de: 'la biblioteca', para: 'estudiantes', oraciones: ora('h', [
        'Puede ser socio todo estudiante del colegio que saque su carné.', 'Socio: estudiante de quinto que tiene carné.']) }] }),
      solucion: [
        { texto: ['Un estudiante de tercero con carné es socio por la oración 1, pero no cumple ', cubre('«de quinto»'), ': queda fuera. Es ', prop('muy estrecha'), '.'] },
        { texto: ['Ser de quinto es de algunos socios, no de todos. Queda justa con «estudiante del colegio que tiene carné».'] }],
      respuesta: [justo('Sí, a los de otros grados'), '; justa: «estudiante del colegio con carné»'] },

    { nivel: 3, titulo: 'La palabra «colegio»',
      enunciado: 'Pregunta 41 del simulacro, de definiciones: hay que elegir la que define mejor «colegio». ¿Qué alternativa es la correcta?',
      datos: [D_NECES, D_ESTRECHA, D_AMPLIA, D_EJEMPLO],
      figura: fig(simDef(41, '¿Qué alternativa define mejor la palabra «colegio»?', ['Lugar de enseñanza con patio, portón azul y campana.', 'Lugar donde se enseña a niños y jóvenes.',
        'Lugar donde hay muchos niños.', 'El lugar adonde voy de lunes a viernes.', 'Lugar donde se enseña a niños y jóvenes de la ciudad de Juliaca.'])),
      solucion: [
        { texto: [mala('A'), ' pide portón azul y campana, que son de algunos, y ', mala('E'), ' agrega «de Juliaca»: dejan colegios fuera, ', prop('muy estrechas'), '.'] },
        { texto: [mala('C'), ' vale también para un parque: ', prop('muy amplia'), '. ', mala('D'), ' es un ejemplo: el caso de quien habla.'] },
        { texto: [buena('B'), ' pide ', cubre('que se enseñe a niños y jóvenes'), ': lo tiene todo colegio y no un parque.'] }],
      respuesta: [buena('B'), ': lugar donde se enseña a niños y jóvenes'] },
    { nivel: 3, titulo: 'La palabra «mochila»',
      enunciado: 'Pregunta 42 del simulacro, de definiciones: hay que elegir la que define mejor «mochila». ¿Qué alternativa es la correcta?',
      datos: [D_NECES, D_ESTRECHA, D_AMPLIA, D_EJEMPLO],
      figura: fig(simDef(42, '¿Qué alternativa define mejor la palabra «mochila»?', ['Bolsa para llevar cosas.', 'Bolsa de tela azul, con cierre y dos bolsillos.',
        'La que cuelga en el respaldo de mi carpeta.', 'Bolsa que se lleva en la espalda, sujeta con dos correas.', 'Bolsa que llevan en la espalda los escolares de primaria, con sus útiles.'])),
      solucion: [
        { texto: [mala('A'), ' vale también para una bolsa del mercado: ', prop('muy amplia'), '. ', mala('C'), ' es un ejemplo.'] },
        { texto: [mala('B'), ' pide color y bolsillos, que son de algunas, y ', mala('E'), ' agrega «escolares de primaria»: dejan mochilas fuera, ', prop('muy estrechas'), '.'] },
        { texto: [buena('D'), ' pide ', cubre('que se lleve en la espalda, con dos correas'), ': lo tiene toda mochila, de cualquier color o dueño.'] }],
      respuesta: [buena('D'), ': bolsa que se lleva en la espalda, con dos correas'] },
    { nivel: 3, titulo: 'El verbo «nadar»',
      enunciado: 'Pregunta 43 del simulacro, de definiciones: hay que elegir la que define mejor el verbo «nadar». ¿Qué alternativa es la correcta?',
      datos: [D_NECES, D_ESTRECHA, D_AMPLIA, D_EJEMPLO],
      figura: fig(simDef(43, '¿Qué alternativa define mejor el verbo «nadar»?', ['Avanzar en el agua moviendo el cuerpo.', 'Estar dentro del agua.',
        'Lo que hacen las truchas en el criadero.', 'Avanzar en el agua del mar moviendo el cuerpo.', 'Avanzar en el agua moviendo los brazos, uno después del otro.'])),
      solucion: [
        { texto: [mala('B'), ' vale también para quien solo se baña: ', prop('muy amplia'), '. ', mala('C'), ' es un ejemplo.'] },
        { texto: [mala('D'), ' agrega «del mar» y ', mala('E'), ' pide mover los brazos por turnos: dejan fuera nadar en el lago o como nada un pez, ', prop('muy estrechas'), '.'] },
        { texto: [buena('A'), ' pide ', cubre('avanzar en el agua moviendo el cuerpo'), ': vale para una persona y para un pez, en cualquier agua.'] }],
      respuesta: [buena('A'), ': avanzar en el agua moviendo el cuerpo'] },
    { nivel: 3, titulo: 'Un rasgo de solo algunas',
      enunciado: 'Pregunta 44 del simulacro: «¿En cuál de estas definiciones el rasgo es solo frecuente?». ¿Qué alternativa es la correcta?',
      datos: [D_NECES, D_ESTRECHA],
      figura: fig(simDef(44, '¿En cuál de estas definiciones el rasgo es solo frecuente?', ['Semana: periodo de siete días.', 'Madre: mujer que tiene uno o más hijos.',
        'Triángulo: polígono de tres lados.', 'Isla: tierra rodeada de agua.', 'Abuela: mujer mayor de cabello blanco.'])),
      solucion: [
        { texto: ['En ', mala('A'), ', ', mala('B'), ', ', mala('C'), ' y ', mala('D'), ' el rasgo está en todos los casos: no hay semana de ocho días ni madre sin hijos.'] },
        { texto: ['En ', buena('E'), ', ', cubre('«de cabello blanco»'), ' es de muchas abuelas, no de todas: la abuela de cabello negro queda fuera. Es ', prop('muy estrecha'), '.'] }],
      respuesta: [buena('E'), ': no toda abuela tiene el cabello blanco'] },
    { nivel: 3, titulo: 'La que deja un caso fuera',
      enunciado: 'Pregunta 45 del simulacro: «¿Cuál de estas definiciones es muy estrecha?». ¿Qué alternativa es la correcta?',
      datos: [D_ESTRECHA, D_NECES],
      figura: fig(simDef(45, '¿Cuál de estas definiciones es muy estrecha?', ['Zapato: calzado que cubre el pie.', 'Hermano: persona que tiene los mismos padres que otra.',
        'Cuchara: cubierto de metal con una parte honda.', 'Año: periodo de doce meses.', 'Vecino: persona que vive cerca de otra.'])),
      solucion: [
        { texto: ['En ', mala('A'), ', ', mala('B'), ', ', mala('D'), ' y ', mala('E'), ' ningún caso queda fuera: todo año tiene doce meses y todo zapato cubre el pie.'] },
        { texto: ['En ', buena('C'), ', ', cubre('«de metal»'), ' es frecuente, no de todas: la cuchara de palo queda fuera.'] }],
      respuesta: [buena('C'), ': deja fuera a la cuchara de palo'] },
  ];

  const rasgoNecesario = {
    id: 'rasgo-necesario',
    titulo: 'Necesario, no solo frecuente',
    pregunta: '¿Sirve para definir un rasgo que casi todos tienen?',
    temas: ['Rasgos mínimos de significado'],
    pieza: 'rv-definicion',
    lee: {
      tarjetas: [
        { titulo: 'Una lámina para la feria', texto: 'Los alumnos de 2.º B prepararon esta lámina para la feria de ciencias. Debajo va una ficha que diga qué es un ave. Ya tienen la clase, «animal». Les falta el rasgo que separa a las aves de los demás.',
          pieza: 'rv-soporte', dibujo: { datos: LAMINA, estado: {} } },
        { titulo: 'Casi todos no es todos', texto: 'Que algo pase casi siempre no quiere decir que pase siempre. Casi todos en tu salón llevan mochila, pero alguno carga sus cuadernos en la mano. Un rasgo de casi todos deja fuera a ese alguno.' },
        { titulo: 'Un caso no define', texto: '«Un ave es, por ejemplo, el cóndor» nombra un caso: no dice qué tienen todas las aves. Un ejemplo ayuda a imaginar la cosa, pero no la define. Para definirla hacen falta su clase y su rasgo.' },
        { titulo: 'Qué mirar al jugar', texto: 'Toca el rasgo de la ficha para cambiarlo. En la tabla, mira dos cosas: si algún ave queda fuera y si se cuela un animal que no es ave. Las dos fallas van en naranja.' },
      ],
    },
    actividad: 'Probar un rasgo para «ave» en la lámina de la feria de ciencias.',
    aprendizaje: 'El rasgo de una definición está en todos los casos; si deja fuera uno, es muy estrecha. Un ejemplo no define.',
    ejemplos: EJEMPLOS_NEC,
    juega: {
      consigna: 'Para la feria de ciencias, 2.º B armó una lámina de animales del altiplano. Falta el rasgo que define «ave».',
      mision: {
        texto: `Busca el rasgo que deje entrar a las ${N_AVES} aves y a ningún otro animal.`,
        logrado: val => { const r = medirAve(val.r); return !r.faltan.length && !r.cuelan.length; },
        bien: `Listo: ese rasgo está en las ${N_AVES} aves y en ningún otro animal.`,
      },
      voz: 'Mira qué ave queda fuera con cada rasgo, y qué animal se cuela.',
      leyenda: [
        { s: 'Clase', t: 'el grupo: responde «¿qué es?»' },
        { s: 'Rasgo', t: 'lo que separa a las aves' },
        { s: cubre('turquesa'), t: 'ave que entra' },
        { s: prop('naranja'), t: 'mal ubicado: se cuela o falta' },
        { s: 'gris', t: 'animal que queda fuera' },
        { s: justo('violeta'), t: 'la definición que quedó justa' },
        { s: 'botón marcado', t: 'lo que elegiste; no es color del texto' },
      ],
      controles: [{ id: 'r', etiqueta: 'Rasgo', opciones: ['vuela', 'lago', 'plumas'].map(valor => ({ valor, texto: RASGOS_AVE[valor].t })) }],
      dibujo: val => ({ datos: FIG_AVE, estado: estAve(val.r) }),
      lectura: lecturaAve,
      minimo: 3,
    },
    predice: {
      pregunta: 'Las cuatro aves de la lámina ponen huevos. Si la ficha dijera «animal que pone huevos», ¿qué pasaría?',
      opciones: [
        { id: 'c', texto: 'Entran las cuatro aves, y también la rana', correcta: true },
        { id: 'justa', texto: 'Entran justo las cuatro aves', error: 'RVD3', siFuera: 'Es cierto que ninguna ave queda fuera, pero la rana también pone huevos y entra.' },
        { id: 'fuera', texto: 'Quedan fuera el zambullidor y el suri', error: 'RVD1', siFuera: 'Eso pasaba con «que vuela». Huevos ponen las cuatro aves: ninguna queda fuera.' },
        { id: 'todos', texto: 'Entran los seis animales de la lámina, sin dejar ninguno fuera', error: 'RVD5', siFuera: 'La rana sí entra, pero el murciélago no pone huevos: queda fuera.' },
      ],
      dibujo: { datos: FIG_HUEVOS, estado: {} },
      revelar: { datos: FIG_HUEVOS, estado: estAve('huevos') },
      coincide: 'Coincide: poner huevos está en las cuatro aves, pero también en la rana. Está en todas y no basta.',
    },
    mira: {
      datos: FIG_HUEVOS,
      pasos: [
        { estado: estAve('vuela', { nuevo: ['r', ...medirAve('vuela').faltan.map(a => a.id)] }), texto: 'Volar es frecuente, no de todas: el zambullidor y el suri quedan fuera.',
          ecuacion: [prop('muy estrecha'), ': fuera ', prop(`${medirAve('vuela').faltan.length} aves`)] },
        { estado: estAve('huevos', { nuevo: ['r', ...medirAve('huevos').cuelan.map(a => a.id)] }), texto: 'Poner huevos está en las cuatro aves, pero también en la rana.',
          ecuacion: [prop('muy amplia'), ': se cuela ', prop(lista(medirAve('huevos').cuelan.map(a => a.corto)))] },
        { estado: estAve('plumas', { nuevo: ['r'] }), texto: 'Las plumas están en las cuatro aves y en ningún otro animal.',
          ecuacion: [justo('justa'), ': entran ', cubre(`las ${N_AVES} aves`), ' y nadie más'] },
        { estado: estAve('plumas'), texto: 'Prueba final: ¿queda fuera algún ave? Ninguna. ¿Se cuela otro animal? Ninguno.' },
      ],
    },
    regla: {
      texto: 'El rasgo de una definición está en todos los casos, no solo en muchos. Si deja fuera un caso, la definición es muy estrecha. Un ejemplo no define.',
      ecuacion: ['rasgo que define = ', { llave: [{ negrita: 'en todos los casos' }], nota: 'ni muy estrecha' }, ' + ', { llave: [{ negrita: 'en ningún vecino' }], nota: 'ni muy amplia' }],
      condicion: 'el rasgo es necesario (lo tienen todos los casos del concepto) y suficiente (no lo tiene ningún vecino).',
    },
    resuelve: {
      pieza: 'rv-soporte',
      generar(s) {
        const R = RESUELVE_NEC[s % RESUELVE_NEC.length];
        return {
          enunciado: R.enunciado, datos: R.datos, dibujo: { datos: R.sop, estado: {} },
          pasos: [
            { tipo: 'pide', texto: `Piden la definición de «${R.c}» cuyo rasgo está en todos los casos y en ningún vecino.` },
            { tipo: 'datos', texto: R.tengo },
            { tipo: 'regla', texto: 'Dos pruebas: ¿queda fuera algún caso? Entonces es muy estrecha. ¿Entra un vecino? Entonces es muy amplia. Un ejemplo no define.' },
            { tipo: 'aplica', texto: R.malas },
            { tipo: 'aplica', texto: R.bien, dibujo: { datos: R.sop, estado: estResuelto(R) } },
            { tipo: 'sentido', texto: R.sentido },
          ],
          respuesta: R.respuesta,
        };
      },
    },
    ahoraTu: {
      pieza: 'rv-soporte',
      generar(s) {
        const A = AHORA_NEC[s % AHORA_NEC.length];
        return {
          pregunta: A.pregunta, datos: A.datos, dibujo: { datos: A.sop, estado: {} },
          opciones: opciones(A.ok, voltear(A.m, s)),
          solucion: { texto: A.sol, ecuacion: [justo(A.ok)], dibujo: { datos: A.sop, estado: { marcas: Object.fromEntries(A.sop.hojas[0].oraciones.map(o => [o.id, 'i'])) } } },
        };
      },
    },
  };
  // La mesa de la idea 2: el mismo juego, sin la misión, con el rasgo «que pone huevos» como cuarta opción.
  const mesaLamina = Object.assign({ id: 'lamina', titulo: 'La lámina de las aves', pieza: 'rv-definicion' }, sinMision(rasgoNecesario.juega), {
    controles: [{ id: 'r', etiqueta: 'Rasgo', opciones: Object.keys(RASGOS_AVE).map(valor => ({ valor, texto: RASGOS_AVE[valor].t })) }],
    invitaciones: [
      { texto: 'Busca un rasgo que no deje ningún ave fuera, aunque se cuele un animal.',
        logrado: val => { const r = medirAve(val.r); return !r.faltan.length && r.cuelan.length > 0; },
        bien: 'Ese rasgo está en todas las aves, pero no basta: también lo tiene un vecino.' },
      { texto: 'Haz que el suri sea la única ave que queda fuera.',
        logrado: val => { const r = medirAve(val.r); return r.faltan.length === 1 && r.faltan[0].n === 'suri'; },
        bien: 'El suri vive en la puna: el lago es de muchas aves, no de todas.' },
      { texto: 'Guarda un rasgo que deje aves fuera y otro que no deje ninguna.',
        logrado: (val, guardados) => [val, ...guardados].some(g => medirAve(g.r).faltan.length > 0) && [val, ...guardados].some(g => medirAve(g.r).faltan.length === 0) && guardados.length > 0,
        bien: 'Compara los dos: uno es frecuente; el otro está en todas.' },
    ] });

  // ---------- Idea 3: de la definición a la palabra (etapa 5, fase 3) ----------
  // HIPÓTESIS DE FORMATO: una definición sin su palabra y cinco palabras del mismo tema, como se describe la pregunta de
  // «Definiciones» de la UNI. En el repo no hay ningún examen de la UNI de verbal: ninguna hoja de esta idea cita ni
  // copia una pregunta real; todas son propias (docs/etapa5/propuesta-verbal.md, decisión 2).
  // Cambia: qué palabras de la hoja están tachadas. Permanece: la definición y sus cinco palabras. Progresa: de cinco
  // candidatas a una. Se reserva: la palabra más específica, que cumple todo y agrega un rasgo (predicción). Debe verse:
  // que cada palabra descartada falla por algo distinto: otra clase, la más general, el vecino, la más específica.
  // Objeto de la primera pantalla: la hoja de simulacro. Colores: la definición que la palabra cumple, i; la palabra
  // que se descarta, o; la palabra que se ajusta, f; lo tachado, tinta.
  // Códigos: RVD9 (la más general: cumple la clase y no los rasgos), RVD10 (la más específica: agrega un rasgo), RVD7
  // (el vecino: misma clase, otro rasgo) y RVD11 (otra clase: una palabra del mismo tema que no es de esa clase).
  const D_AJUSTA = 'Se ajusta: la palabra cumple la clase y cada rasgo de la definición, y ninguno más.';
  const D_GENERAL = 'La más general: cumple la clase, pero no dice los rasgos.';
  const D_ESPEC = 'La más específica: cumple todo y agrega un rasgo que la definición no dice.';
  const D_VERBO = 'Una definición que empieza con un verbo, como «hablar», define una acción.';
  const P_AJUSTA = 'Elija la palabra que se ajusta a la definición.';
  const hojaDef = (numero, definicion, palabras) => simDef(numero, palabras ? P_AJUSTA : null, palabras || [], [`________: ${definicion}`]);
  const estHoja = (buena, sop) => ({ marcas: { [buena]: 'f', h1: 'i' }, tachar: sop.alternativas.map(a => a.id).filter(id => id !== buena) });

  const HOJA_OLLA = hojaDef(21, 'Recipiente de barro o de metal, redondo y hondo, que sirve para cocinar.', ['jarra', 'recipiente', 'cocinar', 'olla', 'olla de presión']);
  // Por qué se descarta cada palabra de la hoja del juego (D es la que se ajusta).
  const ALTS_OLLA = [
    { id: 'A', por: [prop('«jarra»'), ': es un recipiente, pero sirve para servir'] },
    { id: 'B', por: [prop('«recipiente»'), ': cumple la clase, no dice los rasgos'] },
    { id: 'C', por: [prop('«cocinar»'), ': es una acción, no un recipiente'] },
    { id: 'D', ok: true },
    { id: 'E', por: [prop('«olla de presión»'), ': agrega un rasgo, la tapa'] },
  ];
  const tachadasOlla = val => ALTS_OLLA.filter(x => val[x.id.toLowerCase()] === 1);
  const listoOlla = val => ALTS_OLLA.every(x => (val[x.id.toLowerCase()] === 1) === !x.ok);
  const estOlla = val => ({ tachar: tachadasOlla(val).map(x => x.id), marcas: listoOlla(val) ? { D: 'f', h1: 'i' } : {} });
  const lecturaOlla = val => {
    const t = tachadasOlla(val);
    if (t.some(x => x.ok)) return [prop('Cuidado'), ': tachaste la que cumple la clase y cada rasgo'];
    if (listoOlla(val)) return [justo('Queda «olla»'), ': cumple ', cubre('la clase y cada rasgo')];
    if (!t.length) return ['Cinco palabras del mismo tema: solo una se ajusta'];
    return t[t.length - 1].por;
  };
  const HOJA_GANADO = hojaDef(22, 'Persona que cría y cuida ganado.', ['trabajador', 'agricultor', 'ganadero', 'pastor de alpacas', 'ganado']);
  const estGanado = (tachar, extra = {}) => Object.assign({ tachar }, extra);

  // «Así se resuelve»: cuatro hojas con sus cinco palabras. Las correctas son B, D, A y E.
  const RESUELVE_PAL = [
    { buena: 'B', sop: hojaDef(23, 'Embarcación angosta y ligera, sin motor, que se mueve con remos.', ['lancha', 'canoa', 'embarcación', 'remo', 'canoa de pesca']),
      datos: [D_AJUSTA, D_GENERAL, D_ESPEC],
      tengo: 'La definición empieza con «embarcación» y da tres rasgos: angosta y ligera, sin motor, con remos.',
      malas: [mala('D'), ' no es una embarcación. ', mala('C'), ' es la más general. ', mala('A'), ' cambia un rasgo: la lancha lleva motor. ', mala('E'), ' agrega «de pesca».'],
      bien: [buena('B'), ' cumple la clase y los tres rasgos: ', cubre('angosta y ligera, sin motor, con remos'), '.'],
      sentido: 'Si la definición dijera «con motor», la palabra sería «lancha»: un solo rasgo cambia la palabra.' },
    { buena: 'D', sop: hojaDef(24, 'Lugar donde se guardan y se prestan libros.', ['librería', 'local', 'bibliotecario', 'biblioteca', 'biblioteca escolar']),
      datos: [D_AJUSTA, D_GENERAL, D_ESPEC],
      tengo: 'La definición empieza con «lugar» y da un rasgo: ahí los libros se guardan y se prestan.',
      malas: [mala('C'), ' es una persona, no un lugar. ', mala('B'), ' es la más general. ', mala('A'), ' cambia el rasgo: en la librería se venden. ', mala('E'), ' agrega «escolar».'],
      bien: [buena('D'), ' cumple la clase, «lugar», y el rasgo: ', cubre('se guardan y se prestan libros'), '.'],
      sentido: 'Una biblioteca escolar es una biblioteca, pero la definición no dice de quién es: la palabra tampoco.' },
    { buena: 'A', sop: hojaDef(25, 'Caminar con dificultad por una lesión en la pierna o en el pie.', ['cojear', 'caminar', 'tropezar', 'cojo', 'cojear del pie izquierdo']),
      datos: [D_AJUSTA, D_GENERAL, D_ESPEC, D_VERBO],
      tengo: 'La definición empieza con el verbo «caminar»: define una acción. Su rasgo: con dificultad, por una lesión.',
      malas: [mala('D'), ' no es una acción: dice cómo es alguien. ', mala('B'), ' es la más general. ', mala('C'), ' cambia el rasgo: es chocar con algo. ', mala('E'), ' agrega cuál pie.'],
      bien: [buena('A'), ' cumple la clase, «caminar», y el rasgo: ', cubre('con dificultad por una lesión'), '.'],
      sentido: '«Cojo» y «cojear» son de la misma familia, pero la definición pide la acción.' },
    { buena: 'E', sop: hojaDef(26, 'Periodo de siete días seguidos.', ['periodo', 'mes', 'semanal', 'Semana Santa', 'semana']),
      datos: [D_AJUSTA, D_GENERAL, D_ESPEC],
      tengo: 'La definición empieza con «periodo» y da un rasgo: de siete días seguidos.',
      malas: [mala('C'), ' no nombra un periodo: dice cada cuánto pasa algo. ', mala('A'), ' es la más general. ', mala('B'), ' cambia el rasgo: unos treinta días. ', mala('D'), ' agrega cuál semana.'],
      bien: [buena('E'), ' cumple la clase, «periodo», y el rasgo: ', cubre('de siete días seguidos'), '.'],
      sentido: 'La Semana Santa es una semana, pero no toda semana es la Semana Santa.' },
  ];

  // «Ahora tú»: la hoja trae solo la definición; las cinco palabras son los botones. Códigos: RVD9, RVD10, RVD7, RVD11.
  const AHORA_PAL = [
    { sop: hojaDef(27, 'Calzado que cubre el pie y parte de la pierna.'), ok: 'bota', sol: 'Es un calzado y cubre también parte de la pierna, sin decir de qué material es.',
      m: [['calzado', 'RVD9', 'Una bota es un calzado, pero esa palabra no dice que cubre parte de la pierna.'],
        ['bota de jebe', 'RVD10', 'Cubre el pie y la pierna, pero agrega el material, que la definición no dice.'],
        ['sandalia', 'RVD7', 'Es un calzado, pero deja el pie al aire: cambia el rasgo.'],
        ['pie', 'RVD11', 'Es del mismo tema, pero el pie no es un calzado.']] },
    { sop: hojaDef(28, 'Tienda donde se venden medicinas.'), ok: 'farmacia', sol: 'Es una tienda y en ella se venden medicinas, sin decir a qué hora atiende.',
      m: [['tienda', 'RVD9', 'Una farmacia es una tienda, pero esa palabra no dice qué se vende.'],
        ['farmacia de turno', 'RVD10', 'Vende medicinas, pero agrega «de turno», que la definición no dice.'],
        ['panadería', 'RVD7', 'Es una tienda, pero vende pan: cambia el rasgo.'],
        ['jarabe', 'RVD11', 'Es del mismo tema, pero un jarabe es una medicina, no una tienda.']] },
    { sop: hojaDef(29, 'Persona que enseña en un colegio.'), ok: 'profesor', sol: 'Es una persona y enseña en un colegio, sin decir qué curso.',
      m: [['persona', 'RVD9', 'Un profesor es una persona, pero esa palabra no dice que enseña.'],
        ['profesor de Matemática', 'RVD10', 'Enseña en un colegio, pero agrega el curso, que la definición no dice.'],
        ['portero', 'RVD7', 'Es una persona del colegio, pero cuida la puerta: cambia el rasgo.'],
        ['enseñanza', 'RVD11', 'Es del mismo tema, pero la enseñanza no es una persona.']] },
    { sop: hojaDef(30, 'Instrumento de dos hojas de metal que sirve para cortar.'), ok: 'tijera', sol: 'Es un instrumento, tiene dos hojas de metal y corta, sin decir qué corta.',
      m: [['instrumento', 'RVD9', 'Una tijera es un instrumento, pero esa palabra no dice que corta.'],
        ['tijera de podar', 'RVD10', 'Tiene dos hojas y corta, pero agrega para qué, que la definición no dice.'],
        ['cuchillo', 'RVD7', 'Es un instrumento que corta, pero tiene una sola hoja: cambia un rasgo.'],
        ['corte', 'RVD11', 'Es del mismo tema, pero un corte no es un instrumento.']] },
    { sop: hojaDef(31, 'Correr despacio y con pasos cortos.'), ok: 'trotar', datos: [D_AJUSTA, D_GENERAL, D_ESPEC, D_VERBO], sol: 'Es correr, despacio y con pasos cortos, sin decir por dónde.',
      m: [['correr', 'RVD9', 'Trotar es correr, pero esa palabra no dice que es despacio.'],
        ['trotar en subida', 'RVD10', 'Es correr despacio, pero agrega por dónde, que la definición no dice.'],
        ['galopar', 'RVD7', 'Es correr, pero rápido y a cuatro patas, como el caballo: cambia el rasgo.'],
        ['trote', 'RVD11', 'Es de la misma familia, pero nombra la cosa y no la acción.']] },
    { sop: hojaDef(32, 'Hijo del hermano o de la hermana de una persona.'), ok: 'sobrino', sol: 'Es un hijo, y de un hermano o de una hermana, sin decir si es el mayor.',
      m: [['pariente', 'RVD9', 'Un sobrino es un pariente, pero esa palabra no dice de quién es hijo.'],
        ['sobrino mayor', 'RVD10', 'Es hijo de un hermano, pero agrega «mayor», que la definición no dice.'],
        ['primo', 'RVD7', 'Es un pariente, pero es hijo del tío o de la tía: cambia el rasgo.'],
        ['familia', 'RVD11', 'Es del mismo tema, pero la familia es un grupo, no un hijo.']] },
  ];

  // Ejemplos resueltos de la idea 3. Nivel 1: un paso (la clase de la definición, verbo o cosa, la más general, la más
  // específica, el vecino). Nivel 2: dos pasos entre tres palabras (primero la clase, después el rasgo). Nivel 3: la
  // hoja completa, con cinco palabras; las correctas son C, A, E, B y D.
  const EJEMPLOS_PAL = [
    { nivel: 1, titulo: 'La clase de la definición',
      enunciado: '¿Cuál de estas tres no puede ser la palabra, por ser de otra clase: «martillo», «serrucho» o «clavar»?',
      datos: [D_AJUSTA],
      figura: fig(hojaDef(51, 'Herramienta con mango y cabeza de metal, que sirve para clavar.')),
      solucion: [
        { texto: ['La definición empieza con ', cubre('«Herramienta»'), ': la palabra nombra una herramienta. El martillo y el serrucho lo son.'] },
        { texto: ['«Clavar» ', prop('es una acción'), ', no una herramienta: se descarta sin mirar los rasgos.'] }],
      respuesta: [justo('«Clavar»'), ': es una acción, no una herramienta'] },
    { nivel: 1, titulo: 'La escoba y el piso',
      enunciado: 'Esta definición, ¿es la de «barrer» o la de «escoba»?',
      datos: [D_AJUSTA, D_VERBO],
      figura: fig(hojaDef(52, 'Limpiar el piso con una escoba.')),
      solucion: [
        { texto: ['Empieza con el verbo ', cubre('«Limpiar»'), ': define una acción. «Escoba» nombra una cosa, ', prop('otra clase'), '.'] }],
      respuesta: [justo('La de «barrer»'), ': empieza con un verbo'] },
    { nivel: 1, titulo: 'Una palabra que queda grande',
      enunciado: 'Una lechuza es un ave. ¿Se ajusta la palabra «ave» a esta definición?',
      datos: [D_AJUSTA, D_GENERAL],
      figura: fig(hojaDef(53, 'Ave nocturna de ojos grandes, que caza ratones.')),
      solucion: [
        { texto: ['«Ave» cumple la clase, pero no dice ', cubre('«nocturna de ojos grandes, que caza ratones»'), ': también es un ave la gallina.'] },
        { texto: ['Es ', prop('la más general'), ': le faltan los rasgos.'] }],
      respuesta: [justo('No'), ': «ave» es la más general'] },
    { nivel: 1, titulo: 'Un rasgo de más',
      enunciado: '¿Qué palabra se ajusta a la definición: «pantalón» o «pantalón de lana»?',
      datos: [D_AJUSTA, D_ESPEC],
      figura: fig(hojaDef(54, 'Prenda de vestir que cubre cada pierna por separado, de la cintura a los tobillos.')),
      solucion: [
        { texto: ['Las dos son prendas que cubren las piernas. Pero «de lana» es un rasgo que la definición no dice: ', prop('la más específica'), '.'] }],
      respuesta: [justo('«Pantalón»'), ': no agrega ningún rasgo'] },
    { nivel: 1, titulo: 'El pariente vecino',
      enunciado: '¿Se ajusta la palabra «abuelo» a esta definición?',
      datos: [D_AJUSTA],
      figura: fig(hojaDef(55, 'Hermano del padre o de la madre de una persona.')),
      solucion: [
        { texto: ['El abuelo también es un pariente, pero es el padre del padre o de la madre, no ', cubre('el hermano'), ': ', prop('cambia el rasgo'), '.'] }],
      respuesta: [justo('No'), ': el abuelo es el padre, no el hermano'] },

    { nivel: 2, titulo: 'Tres palabras del mercado',
      enunciado: '¿Qué palabra se ajusta a la definición: «chacra», «vender» o «mercado»?',
      datos: [D_AJUSTA, D_VERBO],
      figura: fig(hojaDef(56, 'Lugar donde se venden frutas, verduras y otros alimentos.')),
      solucion: [
        { texto: ['Primero la clase: empieza con ', cubre('«Lugar»'), '. «Vender» es una acción: ', prop('otra clase'), '.'] },
        { texto: ['Después el rasgo: en la chacra se siembra, no se vende: ', prop('cambia el rasgo'), '. Queda «mercado».'] }],
      respuesta: [justo('«Mercado»'), ': un lugar, y donde se vende'] },
    { nivel: 2, titulo: 'La lana y la carne',
      enunciado: '¿Qué palabra se ajusta a la definición: «animal», «oveja merina» u «oveja»?',
      datos: [D_AJUSTA, D_GENERAL, D_ESPEC],
      figura: fig(hojaDef(57, 'Animal doméstico de cuatro patas, cubierto de lana, que bala.')),
      solucion: [
        { texto: ['«Animal» cumple la clase y no dice los rasgos: ', prop('la más general'), '.'] },
        { texto: ['«Oveja merina» cumple todo, pero agrega la raza: ', prop('la más específica'), '. Queda «oveja».'] }],
      respuesta: [justo('«Oveja»'), ': ni un rasgo menos, ni uno más'] },
    { nivel: 2, titulo: 'En voz muy alta',
      enunciado: '¿Qué palabra se ajusta a la definición: «hablar», «gritar» o «grito»?',
      datos: [D_AJUSTA, D_GENERAL, D_VERBO],
      figura: fig(hojaDef(58, 'Decir algo en voz muy alta.')),
      solucion: [
        { texto: ['Primero la clase: empieza con el verbo ', cubre('«Decir»'), '. «Grito» nombra una cosa: ', prop('otra clase'), '.'] },
        { texto: ['Después el rasgo: «hablar» no dice «en voz muy alta»: ', prop('la más general'), '. Queda «gritar».'] }],
      respuesta: [justo('«Gritar»'), ': una acción, y en voz muy alta'] },
    { nivel: 2, titulo: 'Al lado de la pista',
      enunciado: '¿Qué palabra se ajusta a la definición: «ciclovía», «camino» o «vereda»?',
      datos: [D_AJUSTA, D_GENERAL],
      figura: fig(hojaDef(59, 'Camino angosto para bicicletas, al lado de la pista.')),
      solucion: [
        { texto: ['«Camino» cumple la clase y no dice para quién es: ', prop('la más general'), '.'] },
        { texto: ['La vereda también va al lado de la pista, pero es para quienes van a pie: ', prop('cambia el rasgo'), '. Queda «ciclovía».'] }],
      respuesta: [justo('«Ciclovía»'), ': un camino, y para bicicletas'] },
    { nivel: 2, titulo: 'Sin agua ni humedad',
      enunciado: '¿Qué palabra se ajusta a la definición: «sequía», «mojado» o «seco»?',
      datos: [D_AJUSTA, 'Una definición que empieza con «que…» dice cómo es algo: define un adjetivo.'],
      figura: fig(hojaDef(60, 'Que no tiene agua ni humedad.')),
      solucion: [
        { texto: ['Primero la clase: empieza con ', cubre('«Que»'), ': dice cómo es algo. «Sequía» nombra un periodo: ', prop('otra clase'), '.'] },
        { texto: ['Después el rasgo: «mojado» dice lo contrario, que sí tiene agua: ', prop('cambia el rasgo'), '. Queda «seco».'] }],
      respuesta: [justo('«Seco»'), ': dice cómo es algo, y sin agua'] },

    { nivel: 3, titulo: 'Un golpe de viento',
      enunciado: 'Pregunta 61 del simulacro, de definiciones. ¿Qué palabra se ajusta a la definición de la hoja?',
      datos: [D_AJUSTA, D_GENERAL, D_ESPEC],
      figura: fig(hojaDef(61, 'Golpe de viento fuerte y de poca duración.', ['viento', 'brisa', 'ráfaga', 'soplar', 'ráfaga de arena'])),
      solucion: [
        { texto: [mala('D'), ' es una acción, no un golpe de viento: ', prop('otra clase'), '. ', mala('A'), ' no dice «fuerte» ni «de poca duración»: ', prop('la más general'), '.'] },
        { texto: [mala('B'), ' es un viento suave: ', prop('cambia el rasgo'), '. ', mala('E'), ' agrega «de arena»: ', prop('la más específica'), '.'] },
        { texto: [buena('C'), ' cumple la clase y los dos rasgos: ', cubre('fuerte y de poca duración'), '.'] }],
      respuesta: [buena('C'), ': ráfaga'] },
    { nivel: 3, titulo: 'La luz y el aire',
      enunciado: 'Pregunta 62 del simulacro, de definiciones. ¿Qué palabra se ajusta a la definición de la hoja?',
      datos: [D_AJUSTA, D_GENERAL, D_ESPEC],
      figura: fig(hojaDef(62, 'Abertura en una pared para que entren la luz y el aire.', ['ventana', 'abertura', 'puerta', 'ventilar', 'ventana del baño'])),
      solucion: [
        { texto: [mala('D'), ' es una acción: ', prop('otra clase'), '. ', mala('B'), ' no dice dónde está ni para qué: ', prop('la más general'), '.'] },
        { texto: [mala('C'), ' es una abertura para entrar y salir: ', prop('cambia el rasgo'), '. ', mala('E'), ' agrega «del baño»: ', prop('la más específica'), '.'] },
        { texto: [buena('A'), ' cumple la clase, «abertura», y el rasgo: ', cubre('para que entren la luz y el aire'), '.'] }],
      respuesta: [buena('A'), ': ventana'] },
    { nivel: 3, titulo: 'Quitar la humedad',
      enunciado: 'Pregunta 63 del simulacro, de definiciones. ¿Qué palabra se ajusta a la definición de la hoja?',
      datos: [D_AJUSTA, D_GENERAL, D_ESPEC, D_VERBO],
      figura: fig(hojaDef(63, 'Quitar el agua o la humedad de una cosa.', ['quitar', 'mojar', 'seco', 'secar al sol', 'secar'])),
      solucion: [
        { texto: [mala('C'), ' dice cómo está algo, no es una acción: ', prop('otra clase'), '. ', mala('A'), ' no dice qué se quita: ', prop('la más general'), '.'] },
        { texto: [mala('B'), ' es poner agua, lo contrario: ', prop('cambia el rasgo'), '. ', mala('D'), ' agrega «al sol»: ', prop('la más específica'), '.'] },
        { texto: [buena('E'), ' cumple la clase, «quitar», y el rasgo: ', cubre('el agua o la humedad de una cosa'), '.'] }],
      respuesta: [buena('E'), ': secar'] },
    { nivel: 3, titulo: 'Un terreno sin plantas',
      enunciado: 'Pregunta 64 del simulacro, de definiciones. ¿Qué palabra se ajusta a la definición de la hoja?',
      datos: [D_AJUSTA, D_GENERAL, '«Dicho de un terreno: que…» dice cómo es un terreno: define un adjetivo.'],
      figura: fig(hojaDef(64, 'Dicho de un terreno: que no tiene agua ni plantas.', ['seco', 'árido', 'pantanoso', 'sequedad', 'terreno'])),
      solucion: [
        { texto: [mala('D'), ' y ', mala('E'), ' nombran cosas; la definición dice cómo es un terreno: ', prop('otra clase'), '.'] },
        { texto: [mala('A'), ' vale para cualquier cosa sin agua y no dice «ni plantas»: ', prop('la más general'), '. ', mala('C'), ' es un terreno con mucha agua: ', prop('cambia el rasgo'), '.'] },
        { texto: [buena('B'), ' se dice de un terreno y cumple el rasgo: ', cubre('no tiene agua ni plantas'), '.'] }],
      respuesta: [buena('B'), ': árido'] },
    { nivel: 3, titulo: 'Rayos y truenos',
      enunciado: 'Pregunta 65 del simulacro, de definiciones. ¿Qué palabra se ajusta a la definición de la hoja?',
      datos: [D_AJUSTA, D_GENERAL, D_ESPEC],
      figura: fig(hojaDef(65, 'Lluvia fuerte con viento, rayos y truenos.', ['lluvia', 'llovizna', 'tronar', 'tormenta', 'tormenta de granizo'])),
      solucion: [
        { texto: [mala('C'), ' es una acción: ', prop('otra clase'), '. ', mala('A'), ' no dice «fuerte» ni «con rayos»: ', prop('la más general'), '.'] },
        { texto: [mala('B'), ' es una lluvia fina y suave: ', prop('cambia el rasgo'), '. ', mala('E'), ' agrega el granizo: ', prop('la más específica'), '.'] },
        { texto: [buena('D'), ' cumple la clase, «lluvia», y los rasgos: ', cubre('fuerte, con viento, rayos y truenos'), '.'] }],
      respuesta: [buena('D'), ': tormenta'] },
  ];

  const definicionPalabra = {
    id: 'definicion-a-palabra',
    titulo: 'De la definición a la palabra',
    pregunta: '¿Cómo se pasa de una definición a su palabra?',
    temas: ['Definición y palabra definida'],
    pieza: 'rv-soporte',
    lee: {
      tarjetas: [
        { titulo: 'Una hoja de simulacro', texto: 'En esta hoja, la definición viene sin su palabra definida, y debajo hay cinco palabras del mismo tema. Solo una cumple todo lo que la definición dice. Antes de mirarlas, lee la definición entera.',
          pieza: 'rv-soporte', dibujo: { datos: HOJA_OLLA, estado: {} } },
        { titulo: 'La primera palabra manda', texto: 'La definición empieza por la clase. Si empieza con «recipiente», la palabra nombra un recipiente. Si empieza con un verbo, como «hablar», define una acción. Una palabra de otra clase se descarta sin mirar más.' },
        { titulo: 'Del grupo grande al chico', texto: 'Dentro de una clase hay grupos más chicos, sus especies: «calzado» es la clase; «zapato» y «sandalia», dos especies. Y dentro de «zapato» hay otras, como «zapato de fútbol». Cada paso hacia abajo agrega un rasgo.' },
        { titulo: 'Qué mirar al jugar', texto: 'Toca una palabra de la hoja para tacharla y lee por qué no se ajusta. Tócala otra vez para dejarla. Prueba con las cinco.' },
      ],
    },
    actividad: 'Tachar palabras en una hoja de simulacro hasta dejar la que se define.',
    aprendizaje: 'Para hallar la palabra, primero la clase y después cada rasgo: la más general no los tiene todos y la más específica agrega uno.',
    ejemplos: EJEMPLOS_PAL,
    juega: {
      consigna: 'Así llega una pregunta de definiciones en un simulacro: una definición sin su palabra y cinco palabras parecidas.',
      mision: {
        texto: 'Toca en la hoja las palabras que no se ajustan, hasta que quede una sola.',
        logrado: listoOlla,
        bien: 'Queda la única que cumple la clase y cada rasgo, sin agregar ninguno.',
      },
      voz: 'Antes de tachar, pregúntate: ¿es de esa clase?, ¿le falta o le sobra un rasgo?',
      leyenda: [
        { s: '________', t: 'el lugar de la palabra que se define' },
        { s: 'A–E', t: 'las cinco palabras de la hoja' },
        { s: 'tachado', t: 'palabra que descartaste' },
        { s: prop('naranja'), t: 'la palabra descartada y su falla' },
        { s: cubre('turquesa'), t: 'la definición que la palabra cumple' },
        { s: justo('violeta'), t: 'la palabra que se ajusta' },
        { s: 'botón marcado', t: 'lo que elegiste; no es color del texto' },
      ],
      controles: ALTS_OLLA.map(x => ({ id: x.id.toLowerCase(), etiqueta: `Palabra ${x.id}`, opciones: [{ valor: 0, texto: 'dejar' }, { valor: 1, texto: 'tachar' }] })),
      dibujo: val => ({ datos: Object.assign({ toques: Object.fromEntries(ALTS_OLLA.map(x => [x.id, x.id.toLowerCase()])) }, HOJA_OLLA), estado: estOlla(val) }),
      lectura: lecturaOlla,
      minimo: 3,
    },
    predice: {
      pregunta: 'Otra hoja del simulacro. ¿Qué palabra se ajusta a la definición? Las letras son las de la hoja.',
      datos: ['Ganado: conjunto de animales que se crían, como vacas, ovejas o alpacas.'],
      orden: 'fijo',
      opciones: [
        { id: 'A', texto: 'trabajador', error: 'RVD9', siFuera: 'Quien cría ganado es un trabajador, pero esa palabra no dice nada del ganado.' },
        { id: 'B', texto: 'agricultor', error: 'RVD7', siFuera: 'Es una persona del campo, pero el agricultor cultiva la tierra: cambia el rasgo.' },
        { id: 'c', texto: 'ganadero', correcta: true },
        { id: 'D', texto: 'pastor de alpacas', error: 'RVD10', siFuera: 'Cría y cuida ganado, pero agrega algo que la definición no dice: que son alpacas.' },
        { id: 'E', texto: 'ganado', error: 'RVD11', siFuera: 'Es del mismo tema, pero el ganado son los animales, no la persona.' },
      ],
      dibujo: { datos: HOJA_GANADO, estado: {} },
      revelar: { datos: HOJA_GANADO, estado: estHoja('C', HOJA_GANADO) },
      coincide: 'Coincide: cumple la clase, «persona», y el rasgo entero, sin agregar nada.',
    },
    mira: {
      datos: HOJA_GANADO,
      pasos: [
        { estado: estGanado(['E'], { nuevo: ['E'] }), texto: 'La definición empieza con «persona»: «ganado» nombra animales. Fuera.', ecuacion: [mala('E'), ': ', prop('otra clase')] },
        { estado: estGanado(['E', 'A'], { nuevo: ['A'] }), texto: '«Trabajador» es una persona, pero no dice nada del ganado.', ecuacion: [mala('A'), ': ', prop('la más general')] },
        { estado: estGanado(['E', 'A', 'B'], { nuevo: ['B'] }), texto: '«Agricultor» cambia el rasgo: cultiva la tierra, no cría ganado.', ecuacion: [mala('B'), ': ', prop('el vecino')] },
        { estado: estGanado(['E', 'A', 'B', 'D'], { nuevo: ['D'] }), texto: '«Pastor de alpacas» agrega «alpacas», que la definición no dice.', ecuacion: [mala('D'), ': ', prop('la más específica')] },
        { estado: Object.assign(estHoja('C', HOJA_GANADO), { nuevo: ['C'] }), texto: 'Queda «ganadero»: la clase y cada rasgo, ni uno más.', ecuacion: [buena('C'), ': ', cubre('se ajusta')] },
      ],
    },
    regla: {
      texto: 'La palabra se ajusta si cumple la clase y cada rasgo, sin agregar ninguno. Fallan la más general, la más específica, el vecino y la de otra clase.',
      ecuacion: ['la palabra = ', { llave: [{ negrita: 'la misma clase' }], nota: 'primero' }, ' + ', { llave: [{ negrita: 'cada rasgo' }], nota: 'ni uno menos, ni uno más' }],
      condicion: 'la definición es de diccionario: empieza por la clase y sus rasgos separan a la palabra de sus vecinos.',
    },
    resuelve: {
      pieza: 'rv-soporte',
      generar(s) {
        const R = RESUELVE_PAL[s % RESUELVE_PAL.length];
        return {
          enunciado: `Pregunta ${R.sop.numero} del simulacro, de definiciones. ¿Qué palabra de la hoja se ajusta a la definición?`,
          datos: R.datos, dibujo: { datos: R.sop, estado: {} },
          pasos: [
            { tipo: 'pide', texto: 'Piden la palabra que cumple la clase y cada rasgo de la definición, sin agregar ninguno.' },
            { tipo: 'datos', texto: R.tengo },
            { tipo: 'regla', texto: 'Primero la clase: fuera la de otra clase. Después los rasgos: fuera la más general, el vecino y la más específica.' },
            { tipo: 'aplica', texto: R.malas },
            { tipo: 'aplica', texto: R.bien, dibujo: { datos: R.sop, estado: estHoja(R.buena, R.sop) } },
            { tipo: 'sentido', texto: R.sentido },
          ],
          respuesta: [buena(R.buena), ': ', R.sop.alternativas.find(a => a.id === R.buena).t],
        };
      },
    },
    ahoraTu: {
      pieza: 'rv-soporte',
      generar(s) {
        const A = AHORA_PAL[s % AHORA_PAL.length];
        return {
          pregunta: 'La hoja trae la definición sin su palabra. ¿Qué palabra se ajusta a ella?',
          datos: A.datos || [D_AJUSTA, D_GENERAL, D_ESPEC], dibujo: { datos: A.sop, estado: {} },
          opciones: opciones(A.ok, voltear(A.m, s)),
          solucion: { texto: A.sol, ecuacion: [justo(A.ok)], dibujo: { datos: A.sop, estado: { marcas: { h1: 'i' } } } },
        };
      },
    },
  };

  // ---------- Idea 4: cuando la definición no define (etapa 5, fase 3) ----------
  // Cambia: qué entradas del cuaderno están tachadas. Permanece: las cuatro entradas del glosario de Mateo. Progresa: de
  // cuatro entradas a la única que dice clase y rasgo. Se reserva: la definición que solo niega (predicción) y cuándo
  // negar sí vale (Mira). Debe verse: que una frase con forma de definición puede no decir qué es la cosa.
  // Objeto de la primera pantalla: el cuaderno de un compañero que pide revisar su glosario. Colores: la entrada que se
  // descarta, o; la que sí define, f; lo que la buena dice (clase y rasgo, o la falta que nombra), i; lo tachado, tinta.
  // «Circular» se enseña solo con la misma palabra repetida («sequía: tiempo en que hay sequía»): definir «pescador» con
  // «pescar» es lo que hace un diccionario y no se cuenta como falla.
  // Códigos: RVD12 (acepta una definición circular), RVD13 (acepta una negativa), RVD14 (acepta una figurada) y RVD2.
  const D_CIRC = 'Circular: la definición usa la misma palabra que define.';
  const D_NEG = 'Negativa: solo dice lo que la cosa no es.';
  const D_FIG = 'Figurada: compara la cosa con otra en vez de decir qué es.';
  const D_FALTA = 'Negar vale cuando la palabra nombra una falta: «calvo: que no tiene pelo».';

  const CUAD_MATEO = cuaderno('Cuaderno de Mateo', 'Glosario de Ciencia y Tecnología', 'Mateo', 'la práctica del viernes', [
    'Sequía: tiempo en que hay sequía.', 'Alpaca: animal de la puna.', 'Bofedal: pastizal húmedo de las zonas altas.', 'Cóndor: el rey de los cielos andinos.']);
  const ENT_MATEO = [
    { id: 'h1', ctl: 'a', por: [prop('La 1'), ': repite la palabra, no dice nada nuevo'] },
    { id: 'h2', ctl: 'b', por: [prop('La 2'), ': muy amplia, también entra la vicuña'] },
    { id: 'h3', ctl: 'c', ok: true },
    { id: 'h4', ctl: 'd', por: [prop('La 4'), ': compara con un rey, no dice qué es'] },
  ];
  const tachadasMateo = val => ENT_MATEO.filter(x => val[x.ctl] === 1);
  const listoMateo = val => ENT_MATEO.every(x => (val[x.ctl] === 1) === !x.ok);
  const lecturaMateo = val => {
    const t = tachadasMateo(val);
    if (t.some(x => x.ok)) return [prop('Cuidado'), ': la 3 dice clase y rasgo'];
    if (listoMateo(val)) return [justo('Queda la 3'), ': dice ', cubre('la clase y el rasgo')];
    if (!t.length) return ['Cuatro entradas con forma de definición: solo una define'];
    return t[t.length - 1].por;
  };
  // La predicción y «Mira»: la misma hoja, con dos entradas más que aparecen después (tapadas hasta su paso).
  const PESCADOR = cuaderno('Cuaderno de Mateo', 'Glosario de Ciencias Sociales', 'Mateo', 'la exposición del lunes', ['Pescador: persona que no trabaja en la chacra.']);
  const PESCADOR3 = cuaderno('Cuaderno de Mateo', 'Glosario de Ciencias Sociales', 'Mateo', 'la exposición del lunes', [
    'Pescador: persona que no trabaja en la chacra.', 'Pescador: persona que pesca por oficio.', 'Soltero: persona que no está casada.']);

  // «Así se resuelve»: tres definiciones numeradas de una misma palabra (o cinco con letra). La buena: 2.ª, 3.ª, 1.ª y C.
  const RESUELVE_FALLA = [
    { c: 'lluvia', buena: 'h2',
      sop: cuaderno('Cuaderno de Rosa', 'Glosario: lluvia', 'Rosa', 'la práctica de Ciencia y Tecnología', ['Agua de lluvia que moja los campos.', 'Agua que cae de las nubes en gotas.', 'Las lágrimas del cielo.']),
      enunciado: 'Rosa tiene tres frases para «lluvia». ¿Cuál la define de verdad: la 1, la 2 o la 3?',
      datos: [D_DEF, D_CIRC, D_FIG],
      tengo: 'Las tres tienen forma de definición. Hay que ver si dicen la clase y el rasgo, o solo lo parecen.',
      malas: ['La 1 usa «lluvia» para definir «lluvia»: ', prop('circular'), '. La 3 la compara con lágrimas: ', prop('figurada'), '.'],
      bien: ['La 2 dice la clase, «agua», y el rasgo: ', cubre('que cae de las nubes en gotas'), '.'],
      sentido: 'Quien nunca vio llover entiende la 2; con la 1 y la 3 se queda igual.',
      respuesta: [justo('La 2'), ': agua que cae de las nubes en gotas'] },
    { c: 'vecino', buena: 'h3',
      sop: cuaderno('Cuaderno de Diego', 'Glosario: vecino', 'Diego', 'la clase de Personal Social', ['Persona que no es de la familia ni vive en la misma casa.', 'El vecino de la casa de al lado.', 'Persona que vive en una casa cercana a la de otra.']),
      enunciado: 'Diego escribió tres frases para «vecino». ¿Cuál lo define de verdad: la 1, la 2 o la 3?',
      datos: [D_DEF, D_CIRC, D_NEG],
      tengo: 'Las tres tienen forma de definición. Hay que ver si dicen la clase y el rasgo, o solo lo parecen.',
      malas: ['La 1 solo dice lo que no es: entra cualquier desconocido, ', prop('negativa'), '. La 2 usa «vecino» para definir «vecino»: ', prop('circular'), '.'],
      bien: ['La 3 dice la clase, «persona», y el rasgo: ', cubre('que vive en una casa cercana a la de otra'), '.'],
      sentido: 'Un desconocido de otra ciudad cumple la 1 y no es un vecino: negar no separa.',
      respuesta: [justo('La 3'), ': persona que vive en una casa cercana'] },
    { c: 'soltero', buena: 'h1',
      sop: cuaderno('Cuaderno de Rosa', 'Glosario: soltero', 'Rosa', 'la clase de Personal Social', ['Persona adulta que no está casada con nadie.', 'Persona soltera, que vive sin esposo ni esposa en su casa.', 'Un pájaro que vuela sin jaula.']),
      enunciado: 'Rosa tiene tres frases para «soltero». Una de ellas niega y aun así define. ¿Cuál es?',
      datos: [D_CIRC, D_NEG, D_FIG, D_FALTA],
      tengo: '«Soltero» nombra una falta: la de no estar casado. Su rasgo solo se puede decir negando.',
      malas: ['La 2 usa «soltera» para definir «soltero»: ', prop('circular'), '. La 3 lo compara con un pájaro: ', prop('figurada'), '.'],
      bien: ['La 1 niega, pero esa falta es el rasgo: ', cubre('que no está casada'), ' separa al soltero del casado.'],
      sentido: 'No toda negación está mal: vale cuando la palabra nombra justo lo que falta.',
      respuesta: [justo('La 1'), ': persona adulta que no está casada'] },
    { c: 'semilla', buena: 'C', hoja: true,
      sop: simDef(8, '¿Cuál de estas define la palabra «semilla»?', ['La semilla que se guarda para sembrar.', 'Parte de la planta que no es hoja, ni flor, ni tallo, ni raíz.',
        'Parte del fruto de la que nace una planta nueva.', 'La cuna dormida de un árbol.', 'Parte de la planta.']),
      enunciado: 'Pregunta 8 del simulacro, de definiciones: hay que elegir la que define «semilla». Las alternativas están en la hoja.',
      datos: [D_DEF, D_CIRC, D_NEG, D_FIG, D_AMPLIA],
      tengo: 'Hay cinco alternativas con forma de definición. Solo una dice la clase y el rasgo de la semilla.',
      malas: [mala('A'), ' repite «semilla»: ', prop('circular'), '. ', mala('B'), ' solo niega: entra el fruto. ', mala('D'), ' compara: ', prop('figurada'), '. ', mala('E'), ' no trae rasgo: ', prop('muy amplia'), '.'],
      bien: [buena('C'), ' dice la clase, «parte del fruto», y el rasgo: ', cubre('de la que nace una planta nueva'), '.'],
      sentido: 'La pulpa de un durazno también es parte del fruto, pero de ella no nace una planta.',
      respuesta: [buena('C'), ': parte del fruto de la que nace una planta nueva'] },
  ];

  // «Ahora tú»: una oración usa la palabra y cuatro frases dicen definirla. Códigos: RVD12, RVD13, RVD14.
  const nota = (lugar, de, para, oraciones) => ({ soporte: 'mensaje', lugar, hojas: [{ id: 'n', de, para, oraciones: ora('n', oraciones) }] });
  const AHORA_FALLA = [
    { c: 'hospital', sop: nota('Familias de 3.º A', 'la tutora', 'familias de 3.º A', ['El jueves visitaremos el hospital de la ciudad.', 'Cada alumno hará un glosario de la visita.']),
      ok: 'Lugar donde se atiende y se cura a los enfermos', sol: 'Dice la clase, «lugar», y el rasgo: ahí se atiende y se cura a los enfermos.',
      m: [['Lugar donde trabaja la gente del hospital', 'RVD12', 'Empieza por la clase, pero usa «hospital» para definir «hospital».'],
        ['Lugar que no es una casa ni un colegio', 'RVD13', 'Empieza por la clase, pero solo niega: también entra un mercado.'],
        ['El taller donde se arregla el cuerpo de las personas', 'RVD14', 'Da una idea, pero compara el hospital con un taller: no dice qué es.']] },
    { c: 'ahorrar', sop: nota('Familias de 2.º B', 'el tutor', 'familias de 2.º B', ['Este mes aprenderemos a ahorrar en el aula.', 'Cada alumno traerá una alcancía.']),
      ok: 'Guardar dinero para usarlo más adelante', sol: 'Dice la clase, «guardar dinero», y el rasgo: para usarlo más adelante.',
      m: [['Hacer lo mismo que hace el que sabe ahorrar', 'RVD12', 'Es una acción, pero usa «ahorrar» para definir «ahorrar».'],
        ['No gastar en golosinas ni en juegos', 'RVD13', 'Tiene que ver, pero solo niega: quien no tiene dinero tampoco gasta.'],
        ['Sembrar hoy lo que se va a cosechar mañana', 'RVD14', 'Da una idea, pero compara el ahorro con una siembra: no dice qué es.']] },
    { c: 'noche', datos: [D_DEF, D_CIRC, D_NEG, D_FIG, D_FALTA], sop: nota('Club de astronomía', 'el profesor', 'el club', ['El viernes miraremos las estrellas desde el patio.', 'Nos reuniremos al empezar la noche.']),
      ok: 'Parte del día en que no hay luz del sol', sol: 'Dice la clase, «parte del día», y su rasgo es una falta: la de la luz del sol.',
      m: [['Tiempo que dura toda la noche', 'RVD12', 'Empieza por la clase, pero usa «noche» para definir «noche».'],
        ['Lo que no es la mañana ni la tarde', 'RVD13', 'Niega, pero no dice qué le falta a la noche: la luz del sol.'],
        ['El manto negro que cubre la ciudad dormida', 'RVD14', 'Da una imagen, pero compara la noche con un manto: no dice qué es.']] },
    { c: 'amigo', sop: nota('Familias de 1.º C', 'la tutora', 'familias de 1.º C', ['En tutoría hablaremos de lo que es un buen amigo.', 'Cada alumno escribirá su propia definición.']),
      ok: 'Persona a la que se quiere y en quien se confía', sol: 'Dice la clase, «persona», y el rasgo: se la quiere y se confía en ella.',
      m: [['Persona que es amiga de otra persona', 'RVD12', 'Empieza por la clase, pero usa «amiga» para definir «amigo».'],
        ['Persona que no es un enemigo ni un desconocido', 'RVD13', 'Empieza por la clase, pero solo niega: también entra un pariente lejano.'],
        ['Un tesoro que se encuentra muy pocas veces en la vida', 'RVD14', 'Dice algo bonito, pero compara al amigo con un tesoro: no dice qué es.']] },
    { c: 'desierto', datos: [D_DEF, D_CIRC, D_NEG, D_FIG, D_FALTA], sop: nota('Familias de 4.º B', 'el profesor de Geografía', 'familias de 4.º B', ['El mapa de la tarea muestra el desierto de la costa.', 'Los alumnos deben definirlo con sus palabras.']),
      ok: 'Lugar muy seco, donde casi no llueve ni crecen plantas', sol: 'Dice la clase, «lugar», y su rasgo es una falta: la de lluvia y de plantas.',
      m: [['Lugar que tiene el paisaje de un desierto', 'RVD12', 'Empieza por la clase, pero usa «desierto» para definir «desierto».'],
        ['Lugar que no es selva ni ciudad', 'RVD13', 'Niega, pero no nombra la falta: tampoco la puna es selva ni ciudad.'],
        ['Un mar de arena que no tiene orillas, ni olas, ni barcos de pesca', 'RVD14', 'Da una imagen, pero compara el desierto con un mar: no dice qué es.']] },
    { c: 'ciego', datos: [D_DEF, D_CIRC, D_NEG, D_FIG, D_FALTA], sop: nota('Familias de 5.º A', 'la tutora', 'familias de 5.º A', ['Nos visitará un músico ciego que toca el charango.', 'Antes, hablaremos en clase de esa palabra.']),
      ok: 'Dicho de una persona: que no puede ver', sol: 'Su rasgo es una falta, la de la vista: aquí negar es definir.',
      m: [['Dicho de una persona: que está ciega', 'RVD12', 'Habla de una persona, pero usa «ciega» para definir «ciego».'],
        ['Dicho de una persona: que no es sorda ni muda', 'RVD13', 'Niega, pero no nombra la falta: quien ve bien tampoco es sordo ni mudo.'],
        ['Dicho de una persona: que vive en una noche sin fin', 'RVD14', 'Da una imagen, pero compara la ceguera con una noche: no dice qué es.']] },
  ];

  // Ejemplos resueltos de la idea 4. Nivel 1: decir qué le pasa a una definición (repite, niega, compara, niega y vale,
  // define). Nivel 2: dos pasos (la falla y su arreglo; dos entradas que se mandan una a la otra). Nivel 3: hoja de
  // simulacro con cinco alternativas; las correctas son D, B, A, E y C.
  const EJEMPLOS_FALLA = [
    { nivel: 1, titulo: 'El tejedor del cuaderno',
      enunciado: 'Mateo definió «tejedor» así. ¿Qué palabra de su definición no debería estar ahí?',
      datos: [D_DEF, D_CIRC],
      figura: fig(cuaderno('Cuaderno de Mateo', 'Glosario de oficios', 'Mateo', 'la feria de tejidos', ['Tejedor: persona que hace el trabajo de un tejedor.'])),
      solucion: [
        { texto: ['La definición usa ', cubre('«tejedor»'), ' para decir qué es un tejedor: quien no conoce la palabra se queda igual. Es ', prop('circular'), '.'] }],
      respuesta: [justo('«Tejedor»'), ': la definición repite la palabra'] },
    { nivel: 1, titulo: 'Lo que no es caliente',
      enunciado: 'Esta entrada, ¿dice qué es el frío o solo dice qué no es?',
      datos: [D_DEF, D_NEG],
      figura: fig(cuaderno('Cuaderno de Mateo', 'Glosario de Ciencia y Tecnología', 'Mateo', 'la práctica del viernes', ['Frío: lo que no es caliente.'])),
      solucion: [
        { texto: [cubre('«Lo que no es caliente»'), ' solo niega. Algo tibio tampoco es caliente, y no es frío: la definición es ', prop('negativa'), '.'] }],
      respuesta: [justo('Solo dice qué no es'), ': es negativa'] },
    { nivel: 1, titulo: 'La primavera de la vida',
      enunciado: 'El cartel dice esto de la juventud. ¿Dice su clase y su rasgo, o la compara con otra cosa?',
      datos: [D_DEF, D_FIG],
      figura: fig({ soporte: 'cartel', lugar: 'Cartel en el patio del colegio', hojas: [{ id: 'h', titulo: 'Semana de la Juventud', de: 'el municipio escolar', para: 'estudiantes', oraciones: ora('h', ['La juventud es la primavera de la vida.']) }] }),
      solucion: [
        { texto: ['La frase llama a la juventud ', cubre('«la primavera de la vida»'), ': la compara con una estación. Es ', prop('figurada'), ': sirve en un cartel, no en un diccionario.'] }],
      respuesta: [justo('La compara'), ': es figurada'] },
    { nivel: 1, titulo: 'Una negación que vale',
      enunciado: 'Esta entrada del diccionario niega. ¿Está mal por eso?',
      datos: [D_NEG, D_FALTA],
      figura: fig(pagina('M', [['mudo', 'Que no puede hablar.']])),
      solucion: [
        { texto: ['«Mudo» nombra una falta: la del habla. ', cubre('«Que no puede hablar»'), ' dice justo eso: aquí negar es dar el rasgo.'] }],
      respuesta: [justo('No está mal'), ': la palabra nombra una falta'] },
    { nivel: 1, titulo: 'La chacra del glosario',
      enunciado: 'Esta entrada, ¿repite la palabra, niega, compara o define?',
      datos: [D_DEF, D_CIRC, D_NEG, D_FIG],
      figura: fig(cuaderno('Cuaderno de Mateo', 'Glosario del campo', 'Mateo', 'la visita al biohuerto', ['Chacra: terreno donde se siembra.'])),
      solucion: [
        { texto: ['No repite «chacra», no niega y no compara. Dice la clase, ', cubre('«terreno»'), ', y el rasgo, ', cubre('«donde se siembra»'), '.'] }],
      respuesta: [justo('Define'), ': dice clase y rasgo'] },

    { nivel: 2, titulo: 'El panadero circular',
      enunciado: '¿Qué le pasa a esta definición, y cuál la arregla: «persona que hace y vende pan», «persona que no es carpintero» o «el mago de la harina»?',
      datos: [D_DEF, D_CIRC, D_NEG, D_FIG],
      figura: fig(cuaderno('Cuaderno de Mateo', 'Glosario de oficios', 'Mateo', 'la feria de tejidos', ['Panadero: el que trabaja de panadero.'])),
      solucion: [
        { texto: ['La definición usa ', cubre('«panadero»'), ' para definir «panadero»: es ', prop('circular'), '.'] },
        { texto: ['«Persona que no es carpintero» solo niega y «el mago de la harina» compara. La primera dice clase y rasgo.'] }],
      respuesta: [justo('Es circular'), '; la arregla «persona que hace y vende pan»'] },
    { nivel: 2, titulo: 'El desayuno que niega',
      enunciado: 'Con esta definición de «desayuno», ¿qué otra comida entra? ¿Qué rasgo la dejaría fuera: «la más rica», «la primera del día» o «la que se toma sentado»?',
      datos: [D_NEG, D_AMPLIA],
      figura: fig(cuaderno('Cuaderno de Rosa', 'Glosario de la salud', 'Rosa', 'la clase de tutoría', ['Desayuno: comida que no es el almuerzo ni la cena.'])),
      solucion: [
        { texto: ['Una merienda de media tarde es una ', cubre('comida que no es el almuerzo ni la cena'), ': entra. La definición solo niega y queda ', prop('muy amplia'), '.'] },
        { texto: ['La merienda también puede ser rica y tomarse sentado. Lo que solo tiene el desayuno es ser ', cubre('la primera del día'), '.'] }],
      respuesta: [justo('Entra la merienda'), '; el rasgo es «la primera del día»'] },
    { nivel: 2, titulo: 'El lema de la biblioteca',
      enunciado: '¿Sirve la oración 1 como definición de «libro» para un diccionario? Si no, ¿qué dos cosas le faltan?',
      datos: [D_DEF, D_FIG],
      figura: fig({ soporte: 'mural', lugar: 'Mural de la biblioteca', hojas: [{ id: 'h', titulo: 'Mes de la lectura', de: 'la biblioteca', para: 'estudiantes', oraciones: ora('h', ['Un libro es un amigo que nunca falla.', 'Este mes, lleva uno a tu casa.']) }] }),
      solucion: [
        { texto: ['La oración 1 llama al libro ', cubre('«un amigo»'), ': lo compara con una persona. Es ', prop('figurada'), ' y no sirve para un diccionario.'] },
        { texto: ['Le faltan la clase, que diga qué es, y el rasgo que lo separe de sus vecinos.'] }],
      respuesta: [justo('No sirve'), ': compara; le faltan la clase y el rasgo'] },
    { nivel: 2, titulo: 'Dos entradas que niegan',
      enunciado: 'Las dos entradas niegan. ¿Cuál está bien y cuál no?',
      datos: [D_NEG, D_FALTA],
      figura: fig(pagina('V', [['vacío', 'Que no tiene nada dentro.'], ['vaso', 'Lo que no es plato ni taza.']])),
      solucion: [
        { texto: ['«Vacío» nombra una falta, la de contenido: ', cubre('«que no tiene nada dentro»'), ' es su rasgo. Está bien.'] },
        { texto: ['«Vaso» no nombra una falta. ', prop('«Lo que no es plato ni taza»'), ' deja entrar a la olla: está mal.'] }],
      respuesta: [justo('Bien la 1'), ', «vacío»; mal la 2, «vaso»'] },
    { nivel: 2, titulo: 'El día y la noche',
      enunciado: 'Si alguien no supiera qué es el día ni qué es la noche, ¿estas dos entradas se lo dirían?',
      datos: [D_CIRC, D_NEG],
      figura: fig(pagina('D', [['día', 'Tiempo que no es noche.'], ['noche', 'Tiempo que no es día.']])),
      solucion: [
        { texto: ['Para entender la 1 hay que saber qué es la noche, y para entender la 2, qué es el día: ', prop('cada una manda a la otra'), '.'] },
        { texto: ['Además, las dos ', prop('solo niegan'), ': ninguna dice el rasgo, como «con luz del sol».'] }],
      respuesta: [justo('No'), ': dan vueltas en círculo y solo niegan'] },

    { nivel: 3, titulo: 'La palabra «madrugada»',
      enunciado: 'Pregunta 71 del simulacro, de definiciones: hay que elegir la que define «madrugada». ¿Qué alternativa es la correcta?',
      datos: [D_DEF, D_CIRC, D_NEG, D_FIG, D_AMPLIA],
      figura: fig(simDef(71, '¿Cuál de estas define la palabra «madrugada»?', ['La madrugada de cada día.', 'Parte del día que no es la tarde.',
        'El silencio largo y frío que despierta a los gallos del barrio.', 'Parte del día que va de la medianoche al amanecer.', 'Parte del día.'])),
      solucion: [
        { texto: [mala('A'), ' repite «madrugada»: ', prop('circular'), '. ', mala('B'), ' solo niega: también entra la mañana.'] },
        { texto: [mala('C'), ' la compara con un silencio: ', prop('figurada'), '. ', mala('E'), ' no trae rasgo: ', prop('muy amplia'), '.'] },
        { texto: [buena('D'), ' dice la clase, «parte del día», y el rasgo: ', cubre('de la medianoche al amanecer'), '.'] }],
      respuesta: [buena('D'), ': parte del día, de la medianoche al amanecer'] },
    { nivel: 3, titulo: 'La definición circular',
      enunciado: 'Pregunta 72 del simulacro: «¿Cuál de estas definiciones es circular?». ¿Qué alternativa es la correcta?',
      datos: [D_CIRC, D_FALTA],
      figura: fig(simDef(72, '¿Cuál de estas definiciones es circular?', ['Semilla: parte del fruto de la que nace una planta.', 'Lector: persona que es buen lector de libros.',
        'Panadería: tienda donde se hace y se vende pan.', 'Calvo: que no tiene pelo en la cabeza.', 'Feria: mercado al aire libre en días fijos.'])),
      solucion: [
        { texto: [mala('A'), ', ', mala('C'), ' y ', mala('E'), ' dicen clase y rasgo sin repetir su palabra. ', mala('D'), ' niega, pero «calvo» nombra una falta.'] },
        { texto: [buena('B'), ' usa ', cubre('«lector»'), ' para definir «lector»: quien no conoce la palabra se queda igual.'] }],
      respuesta: [buena('B'), ': usa «lector» para definir «lector»'] },
    { nivel: 3, titulo: 'La negación correcta',
      enunciado: 'Pregunta 73 del simulacro: «¿Cuál de estas definiciones que niegan es correcta?». ¿Qué alternativa es la correcta?',
      datos: [D_NEG, D_FALTA],
      figura: fig(simDef(73, '¿Cuál de estas definiciones que niegan es correcta?', ['Mudo: persona que no puede hablar.', 'Gato: animal que no ladra.',
        'Rojo: color que no es azul ni verde.', 'Lápiz: útil que no es de tinta.', 'Río: agua que no está quieta.'])),
      solucion: [
        { texto: ['En ', mala('B'), ' entra la vaca; en ', mala('C'), ', el amarillo; en ', mala('D'), ', la regla; en ', mala('E'), ', el mar. Ninguna de esas palabras nombra una falta.'] },
        { texto: [buena('A'), ' nombra una falta, la del habla: ', cubre('«que no puede hablar»'), ' es su rasgo.'] }],
      respuesta: [buena('A'), ': «mudo» nombra una falta'] },
    { nivel: 3, titulo: 'El faro del cartel',
      enunciado: 'Pregunta 74 del simulacro: «¿En cuál de estas definiciones hay sentido figurado?». ¿Qué alternativa es la correcta?',
      datos: [D_FIG, D_DEF],
      figura: fig(simDef(74, '¿En cuál de estas definiciones hay sentido figurado?', ['Maestro: persona que enseña.', 'Abeja: insecto que hace miel.',
        'Faro: torre con una luz para guiar a los barcos.', 'Puerto: lugar donde llegan y salen los barcos.', 'Maestro: el faro que guía a sus alumnos.'])),
      solucion: [
        { texto: [mala('A'), ', ', mala('B'), ', ', mala('C'), ' y ', mala('D'), ' dicen la clase y el rasgo de lo que nombran, sin comparar.'] },
        { texto: [buena('E'), ' llama al maestro ', cubre('«el faro»'), ': un maestro no es una torre con luz. Lo compara.'] }],
      respuesta: [buena('E'), ': compara al maestro con un faro'] },
    { nivel: 3, titulo: 'La palabra «sombra»',
      enunciado: 'Pregunta 75 del simulacro, de definiciones: hay que elegir la que define «sombra». ¿Qué alternativa es la correcta?',
      datos: [D_DEF, D_CIRC, D_NEG, D_FIG, D_AMPLIA],
      figura: fig(simDef(75, '¿Cuál de estas define la palabra «sombra»?', ['La sombra que da un árbol al mediodía.', 'Lugar donde no cae la lluvia.',
        'Zona oscura que deja un cuerpo al tapar la luz.', 'La hermana callada que nos sigue a todas partes.', 'Zona oscura.'])),
      solucion: [
        { texto: [mala('A'), ' repite «sombra»: ', prop('circular'), '. ', mala('B'), ' solo niega, y niega otra cosa: bajo un techo no llueve.'] },
        { texto: [mala('D'), ' la compara con una hermana: ', prop('figurada'), '. ', mala('E'), ' no trae rasgo: ', prop('muy amplia'), '.'] },
        { texto: [buena('C'), ' dice la clase, «zona oscura», y el rasgo: ', cubre('que deja un cuerpo al tapar la luz'), '.'] }],
      respuesta: [buena('C'), ': zona oscura que deja un cuerpo al tapar la luz'] },
  ];

  const definicionDefectuosa = {
    id: 'definicion-defectuosa',
    titulo: 'Cuando la definición no define',
    pregunta: '¿Cuándo una frase parece definición y no lo es?',
    temas: ['Defectos de la definición'],
    pieza: 'rv-soporte',
    lee: {
      tarjetas: [
        { titulo: 'El glosario de Mateo', texto: 'Mateo copió cuatro definiciones en su cuaderno para la práctica y te pide revisarlas. Todas tienen la palabra, dos puntos y una frase. Pero tener forma de definición no es lo mismo que definir.',
          pieza: 'rv-soporte', dibujo: { datos: CUAD_MATEO, estado: {} } },
        { titulo: 'Repetir no explica', texto: 'Si preguntas qué es un tejedor y te responden «el que hace de tejedor», te quedas igual. Una definición que usa la misma palabra que define da vueltas en círculo: es una definición circular.' },
        { titulo: 'Comparar no es definir', texto: '«Mi abuela es un roble» dice algo bonito de la abuela, pero no qué es una abuela. Eso es sentido figurado: llamar a una cosa con el nombre de otra. Sirve en un poema, no en un diccionario.' },
        { titulo: 'Qué mirar al jugar', texto: 'Toca una entrada del cuaderno para tacharla y lee qué le pasa. Tócala otra vez para dejarla. Una sola dice la clase y el rasgo.' },
      ],
    },
    actividad: 'Revisar el glosario de un compañero y dejar la única entrada que define.',
    aprendizaje: 'Una definición falla si repite la palabra, si solo dice lo que no es o si compara en vez de dar clase y rasgo.',
    ejemplos: EJEMPLOS_FALLA,
    juega: {
      consigna: 'Mateo te presta su cuaderno antes de la práctica. De sus cuatro definiciones, solo una define.',
      mision: {
        texto: 'Tacha en el cuaderno las entradas que no definen, hasta dejar una sola.',
        logrado: listoMateo,
        bien: 'Queda la única que dice la clase y el rasgo de su palabra.',
      },
      voz: 'Pregúntale a cada entrada: ¿me dice qué es la cosa?',
      leyenda: [
        { s: '1, 2, 3, 4', t: 'número de cada entrada del cuaderno' },
        { s: 'tachado', t: 'entrada que descartaste' },
        { s: prop('naranja'), t: 'la entrada descartada y su falla' },
        { s: cubre('turquesa'), t: 'lo que la buena sí dice' },
        { s: justo('violeta'), t: 'la entrada que define' },
        { s: 'botón marcado', t: 'lo que elegiste; no es color del texto' },
      ],
      controles: ENT_MATEO.map((x, k) => ({ id: x.ctl, etiqueta: `Entrada ${k + 1}`, opciones: [{ valor: 0, texto: 'dejar' }, { valor: 1, texto: 'tachar' }] })),
      dibujo: val => ({ datos: Object.assign({ toques: Object.fromEntries(ENT_MATEO.map(x => [x.id, x.ctl])) }, CUAD_MATEO),
        estado: { tachar: tachadasMateo(val).map(x => x.id), marcas: listoMateo(val) ? { h3: 'f' } : {} } }),
      lectura: lecturaMateo,
      minimo: 3,
    },
    predice: {
      pregunta: 'En otra hoja, Mateo definió «pescador» así. ¿Qué le pasa a esa definición?',
      opciones: [
        { id: 'c', texto: 'Solo dice lo que no es: también entra un profesor', correcta: true },
        { id: 'bien', texto: 'Está bien: tiene clase y rasgo', error: 'RVD13', siFuera: 'Tiene la clase, «persona», pero su rasgo solo niega: no dice qué hace un pescador.' },
        { id: 'repite', texto: 'Repite la palabra que define', error: 'RVD12', siFuera: 'Esa falla existe, pero aquí «pescador» no vuelve a aparecer en la frase.' },
        { id: 'compara', texto: 'Compara al pescador con otra cosa, como en un poema', error: 'RVD14', siFuera: 'Esa falla existe, pero aquí no hay comparación: la frase solo niega.' },
      ],
      dibujo: { datos: PESCADOR, estado: {} },
      revelar: { datos: PESCADOR, estado: { marcas: { h1: 'o' } } },
      coincide: 'Coincide: «no trabaja en la chacra» deja entrar al profesor y al chofer. Negar no separa.',
    },
    mira: {
      datos: PESCADOR3,
      pasos: [
        { estado: { marcas: { h1: 'o' }, tapar: ['h2', 'h3'], nuevo: ['h1'] }, texto: 'Tiene clase, «persona», pero su rasgo solo dice lo que no hace.', ecuacion: [prop('negativa'), ': no dice qué hace'] },
        { estado: { marcas: { h1: 'o' }, tapar: ['h2', 'h3'] }, texto: 'Tampoco trabajan en la chacra el profesor ni el chofer: entran.', ecuacion: [prop('muy amplia'), ': entra ', prop('el profesor')] },
        { estado: { marcas: { h1: 'o', h2: 'f' }, tapar: ['h3'], nuevo: ['h2'] }, texto: 'La buena dice lo que sí hace: pesca por oficio.', ecuacion: [justo('define'), ': clase y rasgo'] },
        { estado: { marcas: { h1: 'o', h2: 'f', h3: 'i' }, nuevo: ['h3'] }, texto: 'Negar vale si la palabra nombra una falta, como «soltero».', ecuacion: [cubre('«que no está casada»'), ': la falta es el rasgo'] },
      ],
    },
    regla: {
      texto: 'Una definición no define si repite la palabra, si solo dice lo que la cosa no es o si la compara con otra. Tiene que decir clase y rasgo.',
      ecuacion: [{ llave: [{ negrita: 'repite' }], nota: 'circular' }, ' · ', { llave: [{ negrita: 'solo niega' }], nota: 'negativa' }, ' · ', { llave: [{ negrita: 'compara' }], nota: 'figurada' }],
      condicion: 'una definición negativa vale solo si la palabra nombra una falta, como «soltero: persona que no está casada».',
    },
    resuelve: {
      pieza: 'rv-soporte',
      generar(s) {
        const R = RESUELVE_FALLA[s % RESUELVE_FALLA.length];
        return {
          enunciado: R.enunciado, datos: R.datos, dibujo: { datos: R.sop, estado: {} },
          pasos: [
            { tipo: 'pide', texto: `Piden la frase que define «${R.c}»: la que dice su clase y su rasgo.` },
            { tipo: 'datos', texto: R.tengo },
            { tipo: 'regla', texto: 'No define la que repite la palabra, la que solo niega ni la que compara. Negar vale si la palabra nombra una falta.' },
            { tipo: 'aplica', texto: R.malas },
            { tipo: 'aplica', texto: R.bien, dibujo: { datos: R.sop, estado: estResuelto(R) } },
            { tipo: 'sentido', texto: R.sentido },
          ],
          respuesta: R.respuesta,
        };
      },
    },
    ahoraTu: {
      pieza: 'rv-soporte',
      generar(s) {
        const A = AHORA_FALLA[s % AHORA_FALLA.length];
        return {
          pregunta: `El mensaje usa la palabra «${A.c}». ¿Cuál de estas frases la define de verdad?`,
          datos: A.datos || [D_DEF, D_CIRC, D_NEG, D_FIG], dibujo: { datos: A.sop, estado: {} },
          opciones: opciones(A.ok, voltear(A.m, s)),
          solucion: { texto: A.sol, ecuacion: [justo(A.ok)], dibujo: { datos: A.sop, estado: {} } },
        };
      },
    },
  };

  // ---------- Idea 5: la definición dentro del texto (etapa 5, fase 3) ----------
  // Cambia: qué oraciones del folleto están tachadas. Permanece: el folleto del puesto de salud y sus cinco oraciones.
  // Progresa: de cinco oraciones a la única que dice qué es el soroche. Se reserva: la frase que lo dice con otras
  // palabras y le agrega un «solo» (predicción): en el juego se elige una oración del texto; en la predicción, una
  // alternativa que la repite con otras palabras. Debe verse: que un dato, un ejemplo o un consejo hablan del término
  // sin definirlo.
  // Objeto de la primera pantalla: el folleto que el puesto de salud entrega a los visitantes en el terminal de Puno
  // (inventado para el ejercicio). Colores: la oración que define y las palabras que la sostienen, i; la oración o la
  // alternativa que se descarta, o; la respuesta, f; lo tachado, tinta.
  // Límite con «Sentido contextual»: aquí el texto define el término con todas sus letras («es», «se llama»); si hay que
  // deducir el sentido de pistas, es de la otra unidad (docs/etapa5/propuesta-verbal.md, punto 1).
  // Datos del mundo, de conocimiento general y sin cifras exactas (los folletos, avisos y ferias son inventados): Puno
  // está a unos 3800 m de altura; el soroche es el malestar que causa la falta de oxígeno en la altura; el chuño es papa
  // helada de noche y secada al sol, y dura meses. Las hojas de historia y de arte (mita, huayno, Pucllana, Melgar) solo
  // dicen lo que trae cualquier texto escolar.
  // Códigos: RVD15 (toma por definición otra oración del texto que habla del término: un dato, una consecuencia, un
  // consejo), RV56 (un ejemplo en lugar de la definición), RV11 (agrega un absoluto que el texto no dice: «solo») y
  // RVD11 (cambia la clase: una cosa del mismo tema, como la causa o el producto).
  const D_TEXTO = 'Un texto define un término cuando dice qué es: «es», «se llama», «consiste en».';
  const D_DATO = 'Dato: una cifra, un lugar o una fecha del término. Lo acompaña, pero no lo define.';
  const D_SOLO = '«Solo», «siempre», «nunca»: dicen que no hay excepción.';
  const D_PARA = 'Paráfrasis: lo mismo que dice el texto, con otras palabras.';

  const FOLLETO = { soporte: 'folleto', lugar: 'Folleto del terminal terrestre de Puno', hojas: [{ id: 's', titulo: 'Bienvenido a Puno', de: 'el puesto de salud', para: 'los visitantes', oraciones: ora('s', [
    'Puno está a unos 3800 metros sobre el nivel del mar.', 'Muchos visitantes sienten soroche el primer día.',
    'El soroche es el malestar que causa la falta de oxígeno en la altura.', 'Por ejemplo, a un turista le puede doler la cabeza al bajar del bus.',
    'Camine despacio y tome mucha agua en las primeras horas.']) }] };
  // Lo que hace cada oración del folleto (la 3 es la que define).
  const ORA_FOL = [
    { id: 's1', ctl: 'a', por: [prop('La 1'), ': da un dato, la altura; no dice qué es'] },
    { id: 's2', ctl: 'b', por: [prop('La 2'), ': dice a quiénes les pasa, no qué es'] },
    { id: 's3', ctl: 'c', ok: true },
    { id: 's4', ctl: 'd', por: [prop('La 4'), ': da un ejemplo, un caso de soroche'] },
    { id: 's5', ctl: 'e', por: [prop('La 5'), ': da un consejo para evitarlo'] },
  ];
  const tachadasFol = val => ORA_FOL.filter(x => val[x.ctl] === 1);
  const listoFol = val => ORA_FOL.every(x => (val[x.ctl] === 1) === !x.ok);
  const lecturaFol = val => {
    const t = tachadasFol(val);
    if (t.some(x => x.ok)) return [prop('Cuidado'), ': la 3 dice qué es el soroche'];
    if (listoFol(val)) return [justo('Queda la 3'), ': dice ', cubre('la clase y el rasgo')];
    if (!t.length) return ['Cinco oraciones sobre el soroche: solo una dice qué es'];
    return t[t.length - 1].por;
  };

  // La predicción y «Mira»: el folleto de una feria (inventada) con el chuño.
  const CHUNO = { soporte: 'folleto', lugar: 'Folleto de la feria de Ilave', hojas: [{ id: 'p', titulo: 'Feria del chuño', de: 'la municipalidad', para: 'los visitantes', oraciones: ora('p', [
    'Este sábado, en la plaza, se vende chuño de varias comunidades.', 'El chuño es una papa seca que se obtiene helándola de noche y secándola al sol de día.',
    'Así preparado, se puede guardar durante muchos meses.', 'Por ejemplo, con chuño se prepara el chairo.']) }] };

  // «Así se resuelve»: cuatro hojas de simulacro con un texto corto y cinco alternativas. Las correctas: B, D, A y C.
  const hojaTexto = (numero, titulo, oraciones, termino, alts) => ({ soporte: 'simulacro', numero, hojas: [{ id: 'h', titulo, oraciones: ora('h', oraciones) }],
    pregunta: `En el texto, el término «${termino}» se entiende como`, alternativas: alts.map((t, k) => ({ id: 'ABCDE'[k], t })) });
  const RESUELVE_TEX = [
    { c: 'totora', buena: 'B', def: 'h2',
      sop: hojaTexto(81, 'Texto', ['En el lago Titicaca crece mucha totora.', 'La totora es una planta de tallo largo que crece en el agua, a la orilla del lago.',
        'Con sus tallos, los uros hacen balsas y casas.', 'En algunas bahías, cubre la orilla de punta a punta.'], 'totora',
      ['planta que solo crece cerca de las islas flotantes de los uros.', 'planta de tallo largo que crece en el agua de la orilla.', 'material con el que los uros hacen sus balsas.',
        'planta que abunda en el lago Titicaca.', 'balsa hecha con tallos del lago.']),
      datos: [D_TEXTO, D_DATO, D_SOLO],
      tengo: 'La oración 2 dice «la totora es»: ahí está la definición. Las otras tres dan datos o usos.',
      malas: [mala('A'), ' agrega «solo»: el texto no lo dice. ', mala('C'), ' y ', mala('E'), ' cambian la clase: material y balsa, no planta. ', mala('D'), ' toma el dato de la oración 1.'],
      bien: [buena('B'), ' dice con otras palabras la oración 2: ', cubre('planta de tallo largo que crece en el agua'), '.'],
      sentido: 'Quien no conoce la totora la reconoce con la B; con la D, cualquier planta del lago serviría.' },
    { c: 'puna', buena: 'D', def: 'h2',
      sop: hojaTexto(82, 'Texto', ['Gran parte de Puno está en la puna.', 'La puna es una región alta y fría de los Andes, de pastos y casi sin árboles.',
        'Ahí se crían alpacas y llamas.', 'De noche, la temperatura baja mucho.'], 'puna',
      ['región donde se crían alpacas y llamas.', 'región alta y fría que solo hay en Puno.', 'pasto duro que crece en las zonas altas y frías de los Andes del sur.',
        'región alta y fría de los Andes, con pastos y casi sin árboles.', 'lugar donde de noche hace mucho frío.']),
      datos: [D_TEXTO, D_DATO, D_SOLO],
      tengo: 'La oración 2 dice «la puna es»: da la clase, «región», y sus rasgos. Las otras dan datos.',
      malas: [mala('A'), ' y ', mala('E'), ' toman los datos de las oraciones 3 y 4. ', mala('B'), ' agrega «solo en Puno». ', mala('C'), ' cambia la clase: un pasto, no una región.'],
      bien: [buena('D'), ' conserva la clase y los rasgos: ', cubre('región alta y fría de los Andes, de pastos y casi sin árboles'), '.'],
      sentido: 'También hay puna fuera de Puno, y en otros lugares también se crían alpacas: solo la D separa.' },
    { c: 'huayno', buena: 'A', def: 'h2',
      sop: hojaTexto(83, 'Texto', ['En la fiesta de la Candelaria se bailan muchas danzas.', 'El huayno es un género de música y baile andino, de ritmo alegre, que se baila en pareja.',
        'Se toca con charango, quena y guitarra, entre otros instrumentos.', 'Por ejemplo, «Valicha» es un huayno muy conocido.'], 'huayno',
      ['música y baile andino de ritmo alegre, que se baila en pareja.', 'canción muy conocida, como «Valicha».', 'instrumento andino, como la quena y el charango.',
        'danza que solo se baila en la fiesta de la Candelaria.', 'música que se toca con charango, quena y guitarra en las fiestas del pueblo.']),
      datos: [D_TEXTO, D_DATO, D_SOLO, D_PARA],
      tengo: 'La oración 2 dice «el huayno es»: da la clase, «música y baile andino», y sus rasgos.',
      malas: [mala('B'), ' es el ejemplo de la oración 4. ', mala('C'), ' cambia la clase: un instrumento. ', mala('D'), ' agrega «solo». ', mala('E'), ' toma el dato de la oración 3.'],
      bien: [buena('A'), ' es la paráfrasis de la oración 2: ', cubre('de ritmo alegre, que se baila en pareja'), '.'],
      sentido: 'Con charango y quena se tocan otras músicas: la E no separa al huayno de ellas.' },
    { c: 'mita', buena: 'C', def: 'h2',
      sop: hojaTexto(84, 'Texto', ['Durante la Colonia, muchos indígenas trabajaron en las minas de Potosí.',
        'La mita colonial fue un trabajo obligatorio por turnos que las autoridades españolas impusieron a los pueblos indígenas.',
        'Algunos mitayos caminaban desde Puno durante semanas.', 'Muchos no volvieron a sus pueblos.'], 'mita',
      ['viaje de varias semanas que hacían los mitayos desde Puno hasta las minas.', 'mina de plata de Potosí donde trabajaban los indígenas.',
        'trabajo obligatorio por turnos impuesto a los pueblos indígenas.', 'trabajo que solo se hacía en las minas de Potosí.', 'trabajo de quienes nunca volvieron.']),
      datos: [D_TEXTO, D_DATO, D_SOLO, 'Colonia: los casi tres siglos en que España gobernó el Perú.'],
      tengo: 'La oración 2 dice «la mita colonial fue»: da la clase, «trabajo obligatorio», y su rasgo, «por turnos».',
      malas: [mala('A'), ' toma el dato de la oración 3. ', mala('B'), ' cambia la clase: una mina. ', mala('D'), ' agrega «solo». ', mala('E'), ' toma otro dato, el de la oración 4.'],
      bien: [buena('C'), ' conserva la clase y el rasgo: ', cubre('trabajo obligatorio por turnos'), ', impuesto a los pueblos indígenas.'],
      sentido: 'El texto no dice que la mita fuera solo en Potosí: dice que muchos trabajaron ahí.' },
  ];
  const estHojaTex = R => ({ marcas: { [R.def]: 'i', [R.buena]: 'f' }, tachar: R.sop.alternativas.map(a => a.id).filter(id => id !== R.buena) });

  // «Ahora tú»: el texto en su soporte y la pregunta de San Marcos; las alternativas son los botones. Códigos: RVD15,
  // RV56, RV11 y RVD11 (uno por alternativa).
  const papelDe = (soporte, lugar, titulo, de, para, oraciones) => ({ soporte, lugar, hojas: [Object.assign({ id: 't' }, titulo ? { titulo } : {}, { de, para, oraciones: ora('t', oraciones) })] });
  const AHORA_TEX = [
    { c: 'quinua', def: 't2', sop: papelDe('cartel', 'Cartel en el mercado de Juliaca', 'Quinua del altiplano', 'la asociación de productores', 'los compradores', [
      'En este puesto se vende quinua blanca, roja y negra.', 'La quinua es una planta de los Andes cuyo grano se come cocido, como un cereal.',
      'Su grano tiene más proteína que el arroz.', 'Por ejemplo, con ella se prepara la sopa de quinua.']),
      ok: 'Planta de los Andes cuyo grano se come cocido', sol: 'La oración 2 dice qué es: una planta de los Andes, y su rasgo, el grano que se come cocido.',
      m: [['Grano de tres colores que se vende en un puesto del mercado', 'RVD15', 'Es cierto que se vende ahí, pero es un dato de la oración 1: no dice qué es.'],
        ['La sopa que se prepara con un grano', 'RV56', 'Es un uso, el ejemplo de la oración 4: no dice qué es la quinua.'],
        ['Planta andina que solo se cultiva en Juliaca', 'RV11', 'Es una planta andina, pero el texto no dice «solo»: ese absoluto lo agregaste.']] },
    { c: 'friaje', def: 't2', sop: papelDe('mensaje', 'Familias de 4.º A', null, 'la tutora', 'familias de 4.º A', [
      'Esta semana llega el friaje a Puerto Maldonado.', 'El friaje es un descenso brusco de la temperatura en la selva, causado por vientos fríos del sur.',
      'Hace unos años, la temperatura bajó mucho en una sola noche.', 'Envíen a sus hijos con casaca.']),
      ok: 'Bajada brusca de la temperatura en la selva, por vientos fríos', sol: 'La oración 2 dice qué es: un descenso brusco de la temperatura en la selva, y su causa.',
      m: [['Frío por el que los alumnos deben llevar casaca', 'RVD15', 'Tiene que ver, pero es el consejo de la oración 4: no dice qué es el friaje.'],
        ['La noche de hace unos años en que la temperatura bajó mucho de golpe', 'RV56', 'Es un caso, el de la oración 3: un ejemplo no define.'],
        ['Bajada de la temperatura que llega solo de noche', 'RV11', 'Es una bajada de la temperatura, pero el texto no dice que sea solo de noche.'],
        ['Viento frío que sopla desde el sur', 'RVD11', 'El viento es la causa del friaje, no el friaje: cambia la clase.']] },
    { c: 'apacheta', def: 't2', sop: papelDe('cartel', 'Cartel en un camino de la puna', 'Apacheta del abra', 'la comunidad', 'los viajeros', [
      'En el abra de este camino hay una apacheta.', 'Una apacheta es un montón de piedras que los viajeros forman en los pasos altos, como ofrenda.',
      'Cada viajero que pasa deja una piedra.', 'Por favor, no saque piedras de ella.']),
      ok: 'Montón de piedras de los viajeros en un paso alto, como ofrenda', sol: 'La oración 2 dice qué es: la clase, «montón de piedras», y su rasgo, de los viajeros y como ofrenda.',
      m: [['Piedra que cada viajero deja al pasar por el abra', 'RVD15', 'Es lo que hace cada viajero, el dato de la oración 3: no dice qué es la apacheta.'],
        ['Montón de piedras que solo forman los viajeros del altiplano de Puno', 'RV11', 'Es un montón de piedras, pero el texto no dice «solo»: ese absoluto lo agregaste.'],
        ['Camino alto por el que pasan los viajeros', 'RVD11', 'El paso alto es el lugar, no la apacheta: cambia la clase.']] },
    { c: 'huaico', def: 't2', sop: papelDe('mural', 'Mural de la municipalidad', 'Temporada de lluvias', 'Defensa Civil', 'los vecinos', [
      'Entre enero y marzo, la quebrada puede activarse.', 'Un huaico es un torrente de lodo y piedras que baja de golpe por una quebrada, después de lluvias fuertes.',
      'Hace algunos años, varios huaicos dañaron casas y puentes en la costa.', 'No construya su casa en el cauce de la quebrada.']),
      ok: 'Torrente de lodo y piedras que baja de golpe por una quebrada', sol: 'La oración 2 dice qué es: la clase, «torrente de lodo y piedras», y su rasgo.',
      m: [['Lluvia fuerte que cae entre enero y marzo', 'RVD11', 'La lluvia es la causa del huaico, no el huaico: cambia la clase.'],
        ['El que dañó casas y puentes de la costa hace algunos años', 'RV56', 'Es un caso, el de la oración 3: un ejemplo no define.'],
        ['Torrente de lodo que baja solo por las quebradas de la costa', 'RV11', 'Es un torrente de lodo, pero el texto no dice «solo» en la costa.'],
        ['Peligro por el que no conviene vivir cerca de una quebrada, en su cauce', 'RVD15', 'Tiene que ver, pero es el consejo de la oración 4: no dice qué es.']] },
    { c: 'faena', def: 't2', sop: papelDe('mensaje', 'Vecinos del barrio Santa Rosa', null, 'la junta vecinal', 'los vecinos', [
      'El domingo habrá faena en el barrio.', 'La faena es un trabajo que los vecinos hacen juntos, sin pago, para una obra de todos.',
      'La última vez se limpió el canal de riego.', 'Cada familia debe enviar al menos a una persona.']),
      ok: 'Trabajo que hacen juntos los vecinos, sin pago, para una obra común', sol: 'La oración 2 dice qué es: la clase, «trabajo», y sus rasgos: juntos, sin pago, para todos.',
      m: [['La limpieza del canal de riego', 'RV56', 'Es lo que se hizo la última vez, el caso de la oración 3: un ejemplo no define.'],
        ['Reunión a la que cada familia del barrio envía a una persona los domingos', 'RVD15', 'Es la regla de la oración 4, y la faena no es una reunión: no dice qué es.'],
        ['Trabajo sin pago que solo se hace los domingos', 'RV11', 'Es un trabajo sin pago, pero el texto no dice «solo» los domingos.']] },
    { c: 'ojota', def: 't2', sop: papelDe('mural', 'Mural del museo del colegio', 'Vitrina 2: el calzado del campo', '5.º B', 'los visitantes', [
      'En esta vitrina se ven unas ojotas.', 'La ojota es una sandalia de caucho que se sujeta al pie con tiras.',
      'Se usa mucho en el campo, porque es barata y dura bastante.', 'Por ejemplo, estas son de un pastor de Macusani.']),
      ok: 'Sandalia de caucho que se sujeta al pie con tiras', sol: 'La oración 2 dice qué es: la clase, «sandalia de caucho», y su rasgo, las tiras.',
      m: [['Calzado barato que se usa mucho en el campo', 'RVD15', 'Es cierto, pero es el dato de la oración 3: también es barata una zapatilla.'],
        ['Las sandalias de un pastor', 'RV56', 'Es un caso, el de la oración 4: un ejemplo no define.'],
        ['Sandalia de caucho que solo usan los pastores de Macusani', 'RV11', 'Es una sandalia de caucho, pero el texto no dice «solo»: ese absoluto lo agregaste.']] },
  ];

  // Ejemplos resueltos de la idea 5. Nivel 1: un paso (qué oración define, dato o definición, ejemplo o definición, un
  // «solo» que no está, las palabras que avisan). Nivel 2: dos pasos (la oración y su clase; qué cambió una paráfrasis).
  // Nivel 3: la pregunta de San Marcos con un texto de cuatro oraciones y cinco alternativas; correctas E, C, B, D y A.
  const EJEMPLOS_TEX = [
    { nivel: 1, titulo: 'La oración que define',
      enunciado: '¿Qué oración del cartel define «ichu»: la 1, la 2 o la 3?',
      datos: [D_TEXTO],
      figura: fig(papelDe('cartel', 'Cartel en el mirador', 'Paisaje de la puna', 'la municipalidad', 'los visitantes', ['El ichu cubre los cerros de la puna.', 'El ichu es una hierba alta y dura de las zonas frías de los Andes.', 'Con él se techan casas.'])),
      solucion: [
        { texto: ['La 2 dice ', cubre('«El ichu es»'), ' y da la clase, «hierba», y el rasgo, «alta y dura, de las zonas frías».'] },
        { texto: ['La 1 dice dónde crece y la 3, para qué sirve: ', prop('hablan del ichu'), ', pero no dicen qué es.'] }],
      respuesta: [justo('La 2'), ': dice qué es el ichu'] },
    { nivel: 1, titulo: 'Un dato con número',
      enunciado: 'En el folleto, ¿la oración 1 define «lago Titicaca» o da un dato?',
      datos: [D_TEXTO, D_DATO],
      figura: fig(papelDe('folleto', 'Folleto del muelle de Puno', 'El lago', 'la caseta del muelle', 'los visitantes', ['El lago Titicaca está a unos 3800 metros sobre el nivel del mar.'])),
      solucion: [
        { texto: ['La oración da ', cubre('una altura'), ': un número sobre el lago. No dice su clase, «lago», ni lo que lo separa de otros lagos.'] }],
      respuesta: [justo('Da un dato'), ': la altura del lago'] },
    { nivel: 1, titulo: 'Un ejemplo de cuento',
      enunciado: 'El mensaje dice qué es un cuento «por ejemplo». ¿Define «cuento»?',
      datos: [D_TEXTO, D_EJEMPLO],
      figura: fig(papelDe('mensaje', 'Club de lectura de 3.º A', null, 'el profesor de Comunicación', 'el club', ['Un cuento es, por ejemplo, «El caballero Carmelo».', 'Lo leeremos el viernes.'])),
      solucion: [
        { texto: [cubre('«Por ejemplo»'), ' avisa que viene un caso: «El caballero Carmelo» es un cuento, pero no dice qué tienen todos los cuentos.'] }],
      respuesta: [justo('No'), ': da un ejemplo'] },
    { nivel: 1, titulo: 'Un «solo» que no está',
      enunciado: 'Según el texto, ¿se puede decir que el cuy solo se cría en el campo?',
      datos: [D_TEXTO, D_SOLO],
      figura: fig(papelDe('mural', 'Mural de la feria de ciencias', 'El cuy', '1.º B', 'los visitantes', ['El cuy es un roedor que se cría en muchas casas del campo andino.'])),
      solucion: [
        { texto: ['El texto dice ', cubre('«en muchas casas del campo»'), ': no dice que sea solo ahí. Ese «solo» ', prop('se agrega'), '.'] }],
      respuesta: [justo('No'), ': el texto no dice «solo»'] },
    { nivel: 1, titulo: 'Las palabras que avisan',
      enunciado: '¿Qué palabras de la oración 2 avisan que define «apu»?',
      datos: [D_TEXTO],
      figura: fig(papelDe('folleto', 'Folleto de la fiesta del pueblo', 'Fiesta de las Cruces', 'la comunidad', 'los visitantes', ['La fiesta empieza con una subida al cerro.', 'Se llama apu al cerro que una comunidad respeta como su protector.'])),
      solucion: [
        { texto: [cubre('«Se llama… al»'), ' avisa que la oración dice qué es un apu: la clase, «cerro», y el rasgo, «que una comunidad respeta como su protector».'] }],
      respuesta: [justo('«Se llama»'), ': avisa la definición'] },

    { nivel: 2, titulo: 'La clase del charqui',
      enunciado: '¿Qué oración define «charqui», y cuál es la clase que da?',
      datos: [D_TEXTO, D_DATO],
      figura: fig(papelDe('cartel', 'Cartel del mercado de Ayaviri', 'Charqui de alpaca', 'la asociación de criadores', 'los compradores', ['Aquí se vende charqui los jueves.', 'El charqui es carne de alpaca o de llama, salada y secada al sol y al frío.', 'Dura varios meses sin malograrse.'])),
      solucion: [
        { texto: ['La 1 dice cuándo se vende y la 3 cuánto dura: ', prop('son datos'), '. La 2 dice ', cubre('«El charqui es»'), '.'] },
        { texto: ['Lo primero que dice es la clase: ', cubre('«carne»'), '. Lo demás, de alpaca o de llama y salada y secada, son sus rasgos.'] }],
      respuesta: [justo('La 2'), '; la clase es «carne»'] },
    { nivel: 2, titulo: 'El retablo de Diego',
      enunciado: 'Diego resumió: «Un retablo es una caja que muestra una feria». ¿Qué cambió del texto, y por qué ya no define?',
      datos: [D_TEXTO, D_EJEMPLO],
      figura: fig(papelDe('folleto', 'Folleto del mercado artesanal', 'Retablos de Ayacucho', 'la asociación de artesanos', 'los visitantes', ['El retablo es una caja de madera con figuras que muestran una escena del pueblo.', 'Por ejemplo, muchos muestran una feria o una fiesta.'])),
      solucion: [
        { texto: ['El texto da el rasgo: ', cubre('«figuras que muestran una escena del pueblo»'), '. Diego puso en su lugar el ejemplo de la oración 2, ', prop('«una feria»'), '.'] },
        { texto: ['Un retablo con una fiesta queda fuera de lo que escribió Diego, y es un retablo.'] }],
      respuesta: [justo('Cambió el rasgo por un ejemplo'), ': un retablo con una fiesta queda fuera'] },
    { nivel: 2, titulo: 'Dos veces «es»',
      enunciado: 'Las dos oraciones dicen «es». ¿Cuál define «Misti», y por qué la otra no?',
      datos: [D_TEXTO],
      figura: fig(papelDe('cartel', 'Cartel del mirador de Yanahuara', 'Arequipa', 'la municipalidad', 'los visitantes', ['El Misti es muy visitado.', 'El Misti es un volcán del sur del Perú, cerca de Arequipa.'])),
      solucion: [
        { texto: ['La 1 dice ', prop('cómo es'), ' el Misti para los visitantes: no da una clase.'] },
        { texto: ['La 2 dice ', cubre('qué es'), ': la clase, «volcán», y el rasgo que lo ubica, «del sur del Perú, cerca de Arequipa».'] }],
      respuesta: [justo('La 2'), ': da la clase, «volcán»; la 1 no'] },
    { nivel: 2, titulo: 'La alpaca de Rosa',
      enunciado: 'Rosa escribió: «La alpaca es un camélido que solo se cría en Puno». ¿Qué agregó al texto y qué rasgo le quitó?',
      datos: [D_TEXTO, D_SOLO, 'Camélido: animal de la familia de la llama, la vicuña y el camello.'],
      figura: fig(papelDe('mural', 'Mural de la feria de ciencias', 'La alpaca', '2.º A', 'los visitantes', ['La alpaca es un camélido de los Andes que se cría por su lana.', 'Muchas se crían en Puno.'])),
      solucion: [
        { texto: ['La oración 2 dice ', cubre('«muchas»'), ', no todas: Rosa ', prop('agregó «solo»'), ', y con eso deja fuera las alpacas de Cusco o de Arequipa.'] },
        { texto: ['Además le quitó el rasgo que la separa de la vicuña: ', cubre('«que se cría por su lana»'), '.'] }],
      respuesta: [justo('Agregó «solo»'), '; quitó «que se cría por su lana»'] },
    { nivel: 2, titulo: 'El quipu de Diego',
      enunciado: 'Diego escribió: «El quipu era la persona que leía los nudos». ¿Qué cambió del texto?',
      datos: [D_TEXTO, 'Inca: del pueblo que gobernó los Andes desde el Cusco antes de la llegada de los españoles.'],
      figura: fig(papelDe('folleto', 'Folleto del museo de la ciudad', 'Sala inca', 'el museo', 'los visitantes', ['El quipu era un conjunto de cuerdas con nudos que los incas usaban para llevar cuentas.', 'Los quipucamayoc sabían leerlos.'])),
      solucion: [
        { texto: ['El texto da la clase: ', cubre('«un conjunto de cuerdas con nudos»'), '.'] },
        { texto: ['Diego tomó a quien lo leía, el quipucamayoc de la oración 2: ', prop('cambió la clase'), ', de cuerdas a persona.'] }],
      respuesta: [justo('Cambió la clase'), ': el quipu eran cuerdas, no una persona'] },

    { nivel: 3, titulo: 'El aguayo de la feria',
      enunciado: 'Pregunta 91 del simulacro, de comprensión de lectura. ¿Qué alternativa es la correcta?',
      datos: [D_TEXTO, D_DATO, D_SOLO],
      figura: fig(hojaTexto(91, 'Texto', ['En las ferias de Puno se ven aguayos de muchos colores.', 'El aguayo es una manta tejida, de colores vivos, que se usa para cargar cosas o bebés en la espalda.',
        'Sus dibujos cambian de una comunidad a otra.', 'Por ejemplo, muchas mujeres lo usan para llevar la compra del mercado.'], 'aguayo',
        ['manta de colores vivos que solo se teje en las comunidades de Puno.', 'la compra que las mujeres llevan del mercado.', 'dibujo propio de cada comunidad.',
          'tela de colores que se vende en las ferias.', 'manta tejida de colores, que sirve para cargar en la espalda.'])),
      solucion: [
        { texto: [mala('A'), ' agrega «solo». ', mala('B'), ' es el ejemplo de la oración 4. ', mala('C'), ' cambia la clase: un dibujo.'] },
        { texto: [mala('D'), ' toma el dato de la oración 1: también se venden otras telas.'] },
        { texto: [buena('E'), ' dice con otras palabras la oración 2: ', cubre('manta tejida, de colores vivos, para cargar en la espalda'), '.'] }],
      respuesta: [buena('E'), ': manta tejida de colores, que sirve para cargar en la espalda'] },
    { nivel: 3, titulo: 'El yaraví',
      enunciado: 'Pregunta 92 del simulacro, de comprensión de lectura. ¿Qué alternativa es la correcta?',
      datos: [D_TEXTO, D_DATO, D_SOLO],
      figura: fig(hojaTexto(92, 'Texto', ['En Arequipa se canta el yaraví desde hace mucho tiempo.', 'El yaraví es un canto triste y lento, de origen andino, que habla de amor o de despedida.',
        'Mariano Melgar escribió yaravíes muy conocidos.', 'Hoy se canta casi siempre con guitarra.'], 'yaraví',
        ['canción alegre que se baila en pareja en las fiestas de los pueblos.', 'poema que escribió Mariano Melgar en Arequipa.', 'canto triste y lento, de origen andino, de amor o de despedida.',
          'canto que solo se canta acompañado de guitarra.', 'costumbre antigua de la ciudad de Arequipa.'])),
      solucion: [
        { texto: [mala('A'), ' define a un vecino, el huayno: es lo contrario de triste y lento. ', mala('B'), ' es un caso, el de la oración 3.'] },
        { texto: [mala('D'), ' cambia «casi siempre» por «solo». ', mala('E'), ' toma el dato de la oración 1 y su clase queda muy lejos.'] },
        { texto: [buena('C'), ' conserva la clase y los rasgos de la oración 2: ', cubre('canto triste y lento, de amor o de despedida'), '.'] }],
      respuesta: [buena('C'), ': canto triste y lento, de origen andino, de amor o de despedida'] },
    { nivel: 3, titulo: 'El ayni',
      enunciado: 'Pregunta 93 del simulacro, de comprensión de lectura. ¿Qué alternativa es la correcta?',
      datos: [D_TEXTO, D_SOLO, D_PARA],
      figura: fig(hojaTexto(93, 'Texto', ['En muchas comunidades de Puno se practica el ayni.', 'El ayni es una ayuda que se devuelve: quien recibe un día de trabajo lo paga después con otro día de trabajo.',
        'Por ejemplo, una familia ayuda a techar la casa del vecino, y luego el vecino la ayuda en la cosecha.', 'Así, nadie paga con dinero.'], 'ayni',
        ['trabajo que se hace solo en la época de cosecha.', 'ayuda en el trabajo que se devuelve después con otro trabajo.', 'techado de la casa de un vecino de la comunidad.',
          'trabajo comunal, sin pago, para una obra que es de todos los vecinos.', 'costumbre de muchas comunidades de Puno.'])),
      solucion: [
        { texto: [mala('A'), ' agrega «solo». ', mala('C'), ' es el ejemplo de la oración 3. ', mala('E'), ' toma el dato de la oración 1: su clase queda muy lejos.'] },
        { texto: [mala('D'), ' define a un vecino, la faena: es para una obra de todos y no se devuelve.'] },
        { texto: [buena('B'), ' es la paráfrasis de la oración 2: ', cubre('una ayuda que se devuelve con otro día de trabajo'), '.'] }],
      respuesta: [buena('B'), ': ayuda en el trabajo que se devuelve después con otro trabajo'] },
    { nivel: 3, titulo: 'La fotosíntesis',
      enunciado: 'Pregunta 94 del simulacro, de comprensión de lectura. ¿Qué alternativa es la correcta?',
      datos: [D_TEXTO, D_DATO, D_SOLO],
      figura: fig(hojaTexto(94, 'Texto', ['Las plantas de la puna reciben mucha luz.', 'La fotosíntesis es el proceso con que las plantas fabrican su alimento usando la luz del sol, el agua y el aire.',
        'Ocurre sobre todo en las hojas.', 'Sin ella, no habría pasto para las alpacas.'], 'fotosíntesis',
        ['parte de la planta donde se fabrica el alimento.', 'proceso que solo ocurre en las plantas de la puna.', 'razón por la que hay pasto para las alpacas y las llamas de toda la puna.',
          'proceso con que las plantas fabrican su alimento con luz, agua y aire.', 'alimento que fabrican las plantas en sus hojas.'])),
      solucion: [
        { texto: [mala('A'), ' y ', mala('E'), ' cambian la clase: la hoja y el alimento no son un proceso. ', mala('B'), ' agrega «solo».'] },
        { texto: [mala('C'), ' toma la consecuencia de la oración 4: dice para qué sirve, no qué es.'] },
        { texto: [buena('D'), ' conserva la clase y el rasgo de la oración 2: ', cubre('proceso con que las plantas fabrican su alimento'), ', con luz, agua y aire.'] }],
      respuesta: [buena('D'), ': proceso con que las plantas fabrican su alimento con luz, agua y aire'] },
    { nivel: 3, titulo: 'La huaca',
      enunciado: 'Pregunta 95 del simulacro, de comprensión de lectura. ¿Qué alternativa es la correcta?',
      datos: [D_TEXTO, D_DATO, D_SOLO],
      figura: fig(hojaTexto(95, 'Texto', ['En la costa del Perú hay muchas huacas.', 'Para los antiguos peruanos, una huaca era un lugar u objeto sagrado, al que se le hacían ofrendas.',
        'Por ejemplo, la huaca Pucllana, en Miraflores, es una pirámide de adobe.', 'Hoy muchas son sitios arqueológicos que se pueden visitar.'], 'huaca',
        ['lugar u objeto sagrado al que se le hacían ofrendas.', 'pirámide de adobe que está en Miraflores.', 'sitio arqueológico que hoy se puede visitar con un guía en la costa.',
          'pirámide sagrada que solo hay en la costa.', 'ofrenda que se dejaba en un lugar sagrado.'])),
      solucion: [
        { texto: [mala('B'), ' es el ejemplo de la oración 3. ', mala('C'), ' toma el dato de la oración 4. ', mala('D'), ' agrega «solo».'] },
        { texto: [mala('E'), ' cambia la clase: la ofrenda es lo que se le daba a la huaca.'] },
        { texto: [buena('A'), ' conserva la clase y el rasgo de la oración 2: ', cubre('lugar u objeto sagrado'), ', al que se le hacían ofrendas.'] }],
      respuesta: [buena('A'), ': lugar u objeto sagrado al que se le hacían ofrendas'] },
  ];

  const definicionTexto = {
    id: 'definicion-en-texto',
    titulo: 'La definición dentro del texto',
    pregunta: '¿Dónde define un texto la palabra que usa?',
    temas: ['Definición en el texto'],
    pieza: 'rv-soporte',
    lee: {
      tarjetas: [
        { titulo: 'Un folleto en el terminal', texto: 'En el terminal de Puno, el puesto de salud entrega este folleto a los visitantes. Sus cinco oraciones hablan del soroche, pero no todas dicen qué es.',
          pieza: 'rv-soporte', dibujo: { datos: FOLLETO, estado: {} } },
        { titulo: 'Cómo avisa un texto que define', texto: 'Un texto define un término cuando dice qué es: «el soroche es…», «se llama…», «consiste en…». Esa oración da la clase y el rasgo, como una entrada de diccionario, pero dentro del texto.' },
        { titulo: 'Hablar de algo no es definirlo', texto: 'Otras oraciones dan un dato con números, cuentan a quién le pasa, ponen un ejemplo o dan un consejo. Todas hablan del término, y ninguna dice qué es.' },
        { titulo: 'Qué mirar al jugar', texto: 'Toca una oración del folleto para tacharla y lee qué hace. Tócala otra vez para dejarla. Una sola dice qué es el soroche.' },
      ],
    },
    actividad: 'Tachar en un folleto las oraciones que solo dan datos, hasta dejar la que define.',
    aprendizaje: 'Si un texto define un término, la respuesta conserva su clase y su rasgo; un dato, un ejemplo o un «solo» no lo definen.',
    ejemplos: EJEMPLOS_TEX,
    juega: {
      consigna: 'El puesto de salud entrega este folleto en el terminal. Busca la oración que dice qué es el soroche.',
      mision: {
        texto: 'Tacha las oraciones que hablan del soroche sin decir qué es, hasta dejar una.',
        logrado: listoFol,
        bien: 'Queda la única oración que dice la clase y el rasgo del soroche.',
      },
      voz: 'Pregúntale a cada oración: ¿dice qué es, o solo habla del soroche?',
      leyenda: [
        { s: '1 a 5', t: 'número de cada oración del folleto' },
        { s: 'tachado', t: 'oración que descartaste' },
        { s: prop('naranja'), t: 'la oración descartada y lo que hace' },
        { s: cubre('turquesa'), t: 'lo que la buena sí dice' },
        { s: justo('violeta'), t: 'la oración que define' },
        { s: 'botón marcado', t: 'lo que elegiste; no es color del texto' },
      ],
      controles: ORA_FOL.map((x, k) => ({ id: x.ctl, etiqueta: `Oración ${k + 1}`, opciones: [{ valor: 0, texto: 'dejar' }, { valor: 1, texto: 'tachar' }] })),
      dibujo: val => ({ datos: Object.assign({ toques: Object.fromEntries(ORA_FOL.map(x => [x.id, x.ctl])) }, FOLLETO),
        estado: { tachar: tachadasFol(val).map(x => x.id), marcas: listoFol(val) ? { s3: 'f' } : {} } }),
      lectura: lecturaFol,
      minimo: 3,
    },
    predice: {
      pregunta: 'Otro folleto, de una feria. En él, el término «chuño» se entiende como',
      opciones: [
        { id: 'c', texto: 'Papa seca por la helada de la noche y el sol del día', correcta: true },
        { id: 'dato', texto: 'Producto de varias comunidades que se vende el sábado en la plaza', error: 'RVD15', siFuera: 'Es cierto que se vende ahí, pero es el dato de la oración 1: no dice qué es.' },
        { id: 'ejemplo', texto: 'El ingrediente con el que se prepara el chairo', error: 'RV56', siFuera: 'Es un uso del chuño, el ejemplo de la oración 4: un ejemplo no define.' },
        { id: 'solo', texto: 'Papa seca que solo se prepara en las comunidades de Ilave', error: 'RV11', siFuera: 'Es papa seca, pero el texto dice «de varias comunidades», no «solo» de Ilave: ese absoluto lo agregaste.' },
      ],
      dibujo: { datos: CHUNO, estado: {} },
      revelar: { datos: CHUNO, estado: { marcas: { p2: 'i' }, tachar: ['p1', 'p3', 'p4'] } },
      coincide: 'Coincide: la oración 2 da la clase, «papa seca», y cómo se obtiene. La venta, lo que dura y el chairo no dicen qué es.',
    },
    mira: {
      datos: CHUNO,
      pasos: [
        { estado: { marcas: { p1: 'o' }, nuevo: ['p1'] }, texto: 'La oración 1 dice dónde y cuándo se vende el chuño: es un dato.', ecuacion: [prop('dato'), ': no dice qué es'] },
        { estado: { marcas: { p3: 'o' }, tachar: ['p1'], nuevo: ['p3'] }, texto: 'La 3 dice cuánto dura: otro dato del chuño.', ecuacion: [prop('dato'), ': no dice qué es'] },
        { estado: { marcas: { p4: 'o' }, tachar: ['p1', 'p3'], nuevo: ['p4'] }, texto: 'La 4 da un uso, el chairo: un ejemplo no define.', ecuacion: [prop('ejemplo'), ': no dice qué es'] },
        { estado: { marcas: { p2: 'i' }, tachar: ['p1', 'p3', 'p4'], nuevo: ['p2'] }, texto: 'La 2 dice «el chuño es»: da la clase, papa seca, y su rasgo.', ecuacion: [cubre('clase y rasgo'), ': la define'] },
        { estado: { marcas: { p2: 'f' }, tachar: ['p1', 'p3', 'p4'] }, texto: 'La respuesta es su paráfrasis: lo mismo, sin agregar un «solo».', ecuacion: [justo('papa seca'), ' con la helada y el sol'] },
      ],
    },
    regla: {
      texto: 'Si un texto define un término, la respuesta conserva la clase y el rasgo que el texto da. Un dato, un ejemplo o un «solo» no lo definen.',
      ecuacion: ['el término = ', { llave: [{ negrita: 'la clase del texto' }], nota: 'la misma' }, ' + ', { llave: [{ negrita: 'su rasgo' }], nota: 'sin agregar nada' }],
      condicion: 'el texto lo define con todas sus letras («es», «se llama»); si hay que deducirlo de pistas, no lo define.',
    },
    resuelve: {
      pieza: 'rv-soporte',
      generar(s) {
        const R = RESUELVE_TEX[s % RESUELVE_TEX.length];
        return {
          enunciado: `Pregunta ${R.sop.numero} del simulacro, de comprensión de lectura: «En el texto, el término «${R.c}» se entiende como». Las alternativas están en la hoja.`,
          datos: R.datos, dibujo: { datos: R.sop, estado: {} },
          pasos: [
            { tipo: 'pide', texto: `Piden lo que el texto entiende por «${R.c}»: la clase y el rasgo que el mismo texto da.` },
            { tipo: 'datos', texto: R.tengo },
            { tipo: 'regla', texto: 'Busco la oración que dice qué es. La respuesta dice lo mismo: fuera el dato, el ejemplo, la otra clase y el «solo» que el texto no dice.' },
            { tipo: 'aplica', texto: R.malas },
            { tipo: 'aplica', texto: R.bien, dibujo: { datos: R.sop, estado: estHojaTex(R) } },
            { tipo: 'sentido', texto: R.sentido },
          ],
          respuesta: [buena(R.buena), ': ', R.sop.alternativas.find(a => a.id === R.buena).t],
        };
      },
    },
    ahoraTu: {
      pieza: 'rv-soporte',
      generar(s) {
        const A = AHORA_TEX[s % AHORA_TEX.length];
        return {
          pregunta: `En el texto, el término «${A.c}» se entiende como`,
          datos: [D_TEXTO, D_DATO, D_SOLO], dibujo: { datos: A.sop, estado: {} },
          opciones: opciones(A.ok, voltear(A.m, s)),
          solucion: { texto: A.sol, ecuacion: [justo(A.ok)], dibujo: { datos: A.sop, estado: { marcas: { [A.def]: 'i' } } } },
        };
      },
    },
  };

  // ---------- Laboratorio ----------
  // Las mesas de las ideas 3 y 5: el mismo juego, sin la misión (en el laboratorio nada se califica).
  const mesaHoja = Object.assign({ id: 'hoja', titulo: 'La hoja de las cinco palabras', pieza: 'rv-soporte' }, sinMision(definicionPalabra.juega), {
    invitaciones: [
      { texto: 'Tacha solo la palabra que no es un recipiente.',
        logrado: val => ALTS_OLLA.every(x => (val[x.id.toLowerCase()] === 1) === (x.id === 'C')),
        bien: '«Cocinar» es una acción: las otras cuatro son recipientes.' },
      { texto: 'Deja dos palabras: la que se ajusta y la que agrega un rasgo.',
        logrado: val => ALTS_OLLA.every(x => (val[x.id.toLowerCase()] === 1) === !['D', 'E'].includes(x.id)),
        bien: 'La olla de presión cumple todo y agrega la tapa: es la más específica.' },
    ] });
  const mesaFolleto = Object.assign({ id: 'folleto', titulo: 'El folleto del soroche', pieza: 'rv-soporte' }, sinMision(definicionTexto.juega), {
    invitaciones: [
      { texto: 'Deja solo la oración con un número y la del ejemplo.',
        logrado: val => ORA_FOL.every(x => (val[x.ctl] === 1) === !['s1', 's4'].includes(x.id)),
        bien: 'Un número y un ejemplo hablan del soroche, pero ninguno dice qué es.' },
      { texto: 'Tacha solo la oración que define y lee lo que queda.',
        logrado: val => ORA_FOL.every(x => (val[x.ctl] === 1) === !!x.ok),
        bien: 'Sin la 3, el folleto habla del soroche y nunca dice qué es.' },
    ] });

  // La mesa «Dos rasgos a la vez», de antes de la etapa 5 (pieza rv-texto), pasada a la paleta de lectura: lo que la
  // definición clasifica bien, i; lo mal ubicado y las fichas que se prueban, o; los siete bien, f. La definición junta
  // dos rasgos (o uno, con «ninguno») y la lista suma el ornitorrinco, un mamífero con pico que pone huevos. El código
  // cuenta, con los rasgos de cada animal (regla 1), cuántas aves entran y cuántos vecinos se cuelan.
  // Gesto directo (docs/teoria.md §4b): la manija va sobre el número del rasgo (rv-texto.ancla) y salta al más cercano
  // al dedo (rv-texto.cercana); los botones del control son la alternativa.
  const RV = () => Kit.piezas['rv-texto'];
  const manija = (id, control, datosDe, ids, etiqueta) => ({
    id, etiqueta, color: 'c-o',
    donde: val => RV().ancla(datosDe(val), val[control]),
    mover: (pt, val) => ({ [control]: RV().cercana(datosDe(val), pt, ids) }),
  });
  const admite = (caso, rasgos) => rasgos.every(r => caso.rasgos.includes(r));
  function clasificar(casos, rasgos) {
    const marcas = {}, tachar = [];
    let errores = 0;
    casos.forEach((c, k) => {
      const dentro = admite(c, rasgos), ok = dentro === c.es;
      if (!ok) errores++;
      if (dentro) marcas[`c${k}`] = ok ? 'i' : 'o';
      else { if (!ok) marcas[`c${k}`] = 'o'; tachar.push(`c${k}`); }
    });
    return { marcas, tachar, errores };
  }
  const ANIMALES = [
    { nombre: 'gorrión', es: true, rasgos: ['vuela', 'plumas', 'huevos', 'pico'] },
    { nombre: 'pingüino', es: true, rasgos: ['plumas', 'huevos', 'pico'] },
    { nombre: 'murciélago', es: false, rasgos: ['vuela'] },
    { nombre: 'avestruz', es: true, rasgos: ['plumas', 'huevos', 'pico'] },
    { nombre: 'tortuga', es: false, rasgos: ['huevos', 'pico'] },
    { nombre: 'cóndor', es: true, rasgos: ['vuela', 'plumas', 'huevos', 'pico'] },
    { nombre: 'ornitorrinco', es: false, rasgos: ['huevos', 'pico'] },
  ];
  const PIEZAS = { ninguno: 'ninguno', vuela: 'vuela', pico: 'tiene pico', plumas: 'tiene plumas', huevos: 'pone huevos' };
  const rasgosDe = val => [...new Set([val.a, val.b].filter(x => x !== 'ninguno'))];
  const figDos = () => ({ secciones: [
    { id: 'def', titulo: 'Definición de «ave»', modo: 'tarjeta', fragmentos: [{ id: 'r', hueco: true, reserva: 'tiene plumas y pone huevos' }] },
    { id: 'bandeja', titulo: 'Rasgos', modo: 'lista', fragmentos: Object.entries(PIEZAS).map(([id, t]) => ({ id, t })) },
    { id: 'casos', titulo: 'Casos', modo: 'lista', fragmentos: ANIMALES.map((c, k) => ({ id: `c${k}`, t: c.nombre })) },
  ] });
  const textoDef = val => { const rs = rasgosDe(val); return rs.length ? rs.map(r => PIEZAS[r]).join(' y ') : 'animal'; };
  const N_AVES_DOS = ANIMALES.filter(c => c.es).length;
  const mesaDos = {
    id: 'dos-rasgos', titulo: 'Dos rasgos a la vez', pieza: 'rv-texto',
    consigna: 'Arrastra las dos fichas a los rasgos de la definición de «ave». Busca la que deja dentro las cuatro aves y fuera a los demás.',
    voz: 'Mira qué hace el ornitorrinco con cada par.',
    controles: [
      { id: 'a', etiqueta: 'Rasgo 1', opciones: Object.entries(PIEZAS).map(([valor, texto]) => ({ valor, texto })), inicio: 'huevos' },
      { id: 'b', etiqueta: 'Rasgo 2', opciones: Object.entries(PIEZAS).map(([valor, texto]) => ({ valor, texto })), inicio: 'pico' },
    ],
    dibujo: val => {
      const r = clasificar(ANIMALES, rasgosDe(val)), n = ANIMALES.length;
      return { datos: figDos(), estado: { huecos: { r: textoDef(val) }, marcas: Object.assign({ r: r.errores ? 'o' : 'f', [val.a]: 'o', [val.b]: 'o' }, r.marcas), tachar: r.tachar,
        sellos: { casos: r.errores ? { t: `${r.errores} mal ${r.errores === 1 ? 'ubicado' : 'ubicados'}`, c: 'o' } : { t: `${n} de ${n} bien`, c: 'f' } } } };
    },
    lectura: val => {
      const rs = rasgosDe(val), dentro = ANIMALES.filter(c => c.es && admite(c, rs)).length, colados = ANIMALES.filter(c => !c.es && admite(c, rs)).length;
      const tono = (t, ok) => ({ v: ok ? 'c-i' : 'c-o', t });
      // La definición va sin color: un trozo de color no se parte y, largo, desborda la miniatura del caso guardado.
      return [`${textoDef(val)}: `, tono(`${dentro} de ${N_AVES_DOS} aves`, dentro === N_AVES_DOS), ' · ', tono(`${colados} ${colados === 1 ? 'colado' : 'colados'}`, colados === 0)];
    },
    arrastres: [
      manija('rasgo-1', 'a', figDos, Object.keys(PIEZAS), 'primera ficha de rasgo'),
      manija('rasgo-2', 'b', figDos, Object.keys(PIEZAS), 'segunda ficha de rasgo'),
    ],
    // Invitaciones: logrado(valores, guardados) comprueba con clasificar y admite (las mismas funciones que marcan los
    // casos), no con el texto.
    invitaciones: [
      { texto: 'Arma una definición que deje dentro las cuatro aves y fuera a los demás.',
        logrado: val => clasificar(ANIMALES, rasgosDe(val)).errores === 0,
        bien: 'Ningún caso en naranja. ¿Qué rasgo de tu par hizo el trabajo?' },
      { texto: 'Haz que el pingüino quede fuera de la definición de «ave».',
        logrado: val => !admite(ANIMALES[1], rasgosDe(val)),
        bien: 'El pingüino es ave y no vuela: ese rasgo no es necesario.' },
      { texto: 'Consigue que se cuelen todos los animales que no son aves.',
        logrado: val => ANIMALES.every(c => c.es || admite(c, rasgosDe(val))),
        bien: 'Sin rasgos que separen, la definición queda muy amplia.' },
      { texto: 'Guarda dos definiciones distintas que clasifiquen bien a los siete animales.',
        logrado: (val, guardados) => clasificar(ANIMALES, rasgosDe(val)).errores === 0
          && guardados.some(g => textoDef(g) !== textoDef(val) && clasificar(ANIMALES, rasgosDe(g)).errores === 0),
        bien: 'Las dos sirven: sumar un rasgo que todas las aves tienen no cambia nada.' },
    ],
  };

  return {
    unidad: 'razonamiento-verbal.definiciones',
    version: '0.4.0',
    // Sin calidad: 2 todavía: la sesión la marca después del lector en frío y el auditor (etapa 5). La unidad ya pasa
    // el validador como si la tuviera (definiciones.test.js).
    estado: 'completa',
    requiere: ['/nucleo/kit/piezas/rv-texto.js', '/nucleo/kit/piezas/rv-soporte.js', '/nucleo/kit/piezas/rv-definicion.js'],
    historia: {
      texto: 'En los Tópicos, en la Grecia del siglo IV a. C., Aristóteles estudió cómo discutir una definición y encontrar sus defectos: podía quedar demasiado amplia, demasiado estrecha o poco clara. Relacionó la clase con las diferencias que separan una especie de otra. Enumerar cualidades llamativas no basta para delimitar un concepto.',
      pregunta: '¿Cómo sabrías si una definición se queda corta?',
      // La fuente es la que cita la matriz de la unidad (antes el título decía «Matriz de teoría…» y el enlace iba a otra página).
      fuente: { titulo: 'Aristóteles, Tópicos, libro VI (Internet Classics Archive, MIT)', url: 'https://classics.mit.edu/Aristotle/topics.6.vi.html' },
    },
    // Glosario: las palabras con que el curso habla de definiciones. Se definen aquí una vez; las demás unidades las
    // heredan. Cada idea estrena de 2 a 4 (con `simple` y tres ejemplos): idea 1, definición, género próximo,
    // diferencia específica y rasgo; idea 2, necesario y suficiente; idea 3, especie y palabra definida; idea 4,
    // definición circular, definición negativa y sentido figurado; idea 5, término y dato («paráfrasis» y «absoluto» ya los definen Resumen y síntesis y Tema e idea principal). Sus ejemplos usan
    // palabras que no salen en el juego, la predicción, «Ahora tú» ni los ejemplos resueltos de su idea: el glosario se
    // lee antes de jugar y no puede dar una respuesta (lo prueba definiciones.test.js).
    glosario: [
      { termino: 'definición', def: 'Frase que dice qué es algo y lo separa de todo lo demás, sin dejar casos fuera.',
        simple: 'Decir en una frase qué es una cosa, sin que se confunda con otra.',
        ejemplos: ['Paraguas: utensilio plegable que cubre de la lluvia.', 'Domingo: día de la semana que sigue al sábado.', 'Nieto: hijo del hijo o de la hija.'],
        ver: ['género próximo', 'diferencia específica'], formas: ['definición', 'definiciones'] },
      { termino: 'género próximo', def: 'La clase más cercana que contiene a lo que se define.',
        simple: 'El grupo más chico donde entra la cosa: dice qué es.',
        ejemplos: ['Para «paraguas», «utensilio plegable» y no solo «cosa».', 'Para «domingo», «día de la semana».', 'Para «colibrí», «ave» y no «cosa que vuela».'],
        ver: ['diferencia específica'] },
      { termino: 'diferencia específica', def: 'Los rasgos que separan a un concepto de los otros de su misma clase.',
        simple: 'Lo que la cosa tiene y sus parecidos no.',
        ejemplos: ['«Que cubre de la lluvia» separa al paraguas de la sombrilla.', '«Que sigue al sábado» separa al domingo de los otros días.', '«De pico largo, que vuela quieto ante la flor» separa al colibrí.'],
        ver: ['género próximo', 'rasgo'] },
      { termino: 'rasgo', def: 'Característica que tiene algo y que sirve para reconocerlo o distinguirlo.',
        simple: 'Algo que una cosa tiene y que sirve para reconocerla.',
        ejemplos: ['Tener rayas es propio de la cebra.', 'Ser plegable es propio del paraguas.', 'Volar quieto ante la flor es propio del colibrí.'],
        formas: ['rasgo', 'rasgos'], ver: ['necesario', 'suficiente'] },
      { termino: 'necesario', def: 'Dicho de un rasgo: lo tienen todos los casos, sin excepción.',
        simple: 'Que está en todos los casos, sin que falte en ninguno.',
        ejemplos: ['Tener ruedas es necesario en un tren: no hay tren sin ruedas.', 'Tener alas es necesario en un avión.', 'Tener hojas no es necesario en una planta: el cactus casi no tiene.'],
        formas: ['necesario', 'necesarios', 'necesaria'], ver: ['suficiente'] },
      { termino: 'suficiente', def: 'Dicho de los rasgos: juntos bastan para dejar fuera todo lo que no corresponde.',
        simple: 'Que basta para separar a la cosa de sus parecidos.',
        ejemplos: ['«Que tiene trompa» basta para separar al elefante de los otros animales.', '«Que sigue al lunes» basta para separar al martes de los otros días.', '«Que tiene ruedas» no basta para el tren: el bus también las tiene.'],
        ver: ['necesario'] },
      { termino: 'especie', def: 'Grupo más chico dentro de una clase: tiene sus rasgos y suma otros propios.',
        simple: 'Un grupo más chico que está dentro de otro.',
        ejemplos: ['«Perro» es una especie dentro de «mamífero».', '«Silla» es una especie dentro de «mueble».', '«Rosa» es una especie dentro de «flor».'],
        formas: ['especie', 'especies'], ver: ['género próximo'] },
      { termino: 'palabra definida', def: 'La palabra que una definición explica; en el diccionario va primero, en negrita.',
        simple: 'La palabra que se explica.',
        ejemplos: ['En «Nieto: hijo del hijo o de la hija», la palabra definida es «nieto».', 'En una entrada del diccionario, va antes de los dos puntos.', 'En «Martes: día que sigue al lunes», es «martes».'],
        ver: ['definición'] },
      { termino: 'definición circular', def: 'La que usa la misma palabra que define, y así no explica nada.',
        simple: 'Explicar una palabra con la misma palabra.',
        ejemplos: ['«Nadador: el que nada como un nadador.»', '«Barco: un barco que flota en el agua.»', 'Quien no sabe qué es un barco se queda igual.'],
        formas: ['circular', 'circulares'], ver: ['definición'] },
      { termino: 'definición negativa', def: 'La que nombra lo que la cosa no es, sin dar su rasgo.',
        simple: 'Decir qué no es una cosa, en lugar de qué es.',
        ejemplos: ['«Pez: animal que no es ave.» Entra la rana.', '«Mesa: mueble que no es silla.» Entra el ropero.', 'Vale si la palabra nombra una falta, como «manco».'],
        formas: ['negativa', 'negativas'], ver: ['definición'] },
      { termino: 'sentido figurado', def: 'Uso de una palabra con el sentido de otra que se le parece, para comparar.',
        simple: 'Llamar a una cosa con el nombre de otra que se le parece.',
        ejemplos: ['«Mi hermano es un león»: lo compara con un león.', '«Ese examen fue un paseo»: fue fácil.', 'Sirve en una canción, no en un diccionario.'],
        formas: ['sentido figurado', 'figurada', 'figuradas'], ver: ['definición'] },
      { termino: 'término', def: 'Palabra que tiene un sentido preciso en una materia o en un texto.',
        simple: 'Una palabra con un sentido fijo.',
        ejemplos: ['En Matemática, «suma» es un término.', 'En un folleto de salud, «vacuna» es un término.', 'Un texto que usa un término nuevo suele decir qué es.'],
        formas: ['término', 'términos'], ver: ['definición', 'dato'] },
      { termino: 'dato', def: 'Información puntual sobre algo: una cifra, un lugar, una fecha o cuántos casos hay.',
        simple: 'Algo concreto que se dice de una cosa, como un número o un lugar.',
        ejemplos: ['«El puente mide 40 metros» da un dato del puente.', '«La feria es el domingo» da un dato de la feria.', 'Un dato acompaña a una cosa, pero no dice qué es.'],
        formas: ['dato', 'datos'], ver: ['término'] },
      { termino: 'concepto', def: 'Idea general que reúne a todos los casos de una misma cosa.',
        ejemplos: ['«Mueble» reúne a la cama, al ropero y al estante.', '«Fiesta» reúne al cumpleaños, al aniversario y al carnaval.', '«Planeta» reúne a la Tierra, a Marte y a Júpiter.'],
        ver: ['definición'] },
    ],
    laboratorio: [mesaParadero, mesaLamina, mesaDos, mesaHoja, mesaFolleto],
    // A qué idea pertenece cada mesa (Gerson, 16 nov: el laboratorio se agrupa por idea). La mesa vieja «Arma la silla»
    // salió en la etapa 5: repetía la idea 1 con la paleta vieja, y el paradero la reemplaza.
    laboratorioIdeas: {
      'paradero': ['genero-diferencia'],
      'lamina': ['rasgo-necesario'],
      'dos-rasgos': ['rasgo-necesario'],
      'hoja': ['definicion-a-palabra'],
      'folleto': ['definicion-en-texto'],
    },
    ideas: [claseRasgo, rasgoNecesario, definicionPalabra, definicionDefectuosa, definicionTexto],
  };
});
