/*
 * Generador «Definiciones»: práctica de las cinco ideas de razonamiento-verbal.definiciones
 * (contenido/teoria/razonamiento-verbal/definiciones.js; propuesta en docs/etapa5/propuesta-verbal.md). Formato
 * "predicciones" (docs/arquitectura.md). Funciona en el navegador (window.Generadores['definiciones']) y en Node.
 *
 * Regla 1 en verbal: la respuesta no la decide un texto escrito a mano, la calcula el código con un mundo chico. Cada
 * ítem del banco trae sus seres con sus rasgos, o la clase y los rasgos de cada palabra, o el papel de cada oración del
 * texto; cada alternativa es una condición. El generador evalúa qué entra con cada una, elige como correcta la única que
 * deja dentro justo lo que se define y arma la explicación de cada incorrecta con lo que su error deja entrar o fuera
 * (el vecino que se cuela, el caso que queda fuera). Si el banco no cuadra (dos correctas, un error que no falla), lanza
 * un error: generador.test.js lo recorre entero. Textos propios, de situaciones de Juliaca, Puno y el Perú.
 *
 * Tipos por idea (TIPOS_POR_IDEA; nivel 1 un paso, 2 dos pasos, 3 de examen, con cinco alternativas). generar(semilla,
 * { idea }) da solo los de esa idea; sin idea, las cinco con el mismo peso.
 *   genero-diferencia     definicion (1) la definición que separa a la palabra de sus vecinos, entre cuatro ·
 *                         definicion-examen (3) la misma pregunta con cinco alternativas, como en un simulacro
 *   rasgo-necesario       rasgo (2) el rasgo que tienen todos los casos y ningún vecino · rasgo-examen (3) con cinco
 *   definicion-a-palabra  palabra (2) la palabra que se ajusta a una definición · palabra-examen (3) con cinco, en el
 *                         formato de la pregunta de definiciones de la UNI (HIPÓTESIS DE FORMATO: en el repo no hay
 *                         examen de verbal de la UNI; ningún ítem cita ni copia una pregunta real)
 *   definicion-defectuosa define (2) entre una circular, una negativa, una figurada y una sin rasgo, la que define ·
 *                         falta (3) una palabra que nombra una falta: ahí la negación sí define
 *   definicion-en-texto   termino (2) «En el texto, el término X se entiende como», con cuatro · termino-examen (3) con
 *                         cinco, como en San Marcos
 * Errores (docs/investigacion/razonamiento-verbal-ideas-erroneas.md, todos hipótesis): RVD1, RVD2, RVD3, RVD4, RVD6,
 * RVD7, RVD8, RVD9, RVD10, RVD11, RVD12, RVD13, RVD14, RVD15, RV11 y RV56.
 * Datos (contrato, punto 13): el criterio de la idea (las mismas líneas que la teoría) y las glosas de palabras poco
 * comunes; nunca la respuesta.
 * _datos: { idea, tipo, nivel, item, codigos }: el ítem del banco y los códigos de las incorrectas mostradas.
 */
(function (root, fabrica) {
  const nodo = typeof module === 'object' && module.exports;
  const api = fabrica(nodo ? require('../../nucleo/azar.js') : root.Azar, nodo ? require('../../nucleo/predicciones.js') : root.Predicciones);
  if (nodo) module.exports = api;
  else (root.Generadores = root.Generadores || {})[api.id] = api;
})(typeof self !== 'undefined' ? self : this, function (Azar, P) {
  'use strict';
  const ID = 'definiciones';
  const FUENTE = 'docs/investigacion/razonamiento-verbal-ideas-erroneas.md';
  const err = (id, explicacion) => ({ id, explicacion, respaldo: 'hipotesis', fuente: FUENTE });
  const lista = xs => (xs.length <= 1 ? xs.join('') : `${xs.slice(0, -1).join(', ')} y ${xs[xs.length - 1]}`);
  const may = t => t.charAt(0).toUpperCase() + t.slice(1);
  // Las incorrectas que se muestran: k al azar, de modo que la correcta no sea la más larga ni la más corta (auditoría,
  // 19 nov: lo era en uno de cada cuatro problemas). Si la primera mezcla cumple, es la de siempre; si no, se vuelve a
  // mezclar. Si ninguna mezcla sirve, el banco no cuadra y se lanza un error (generador.test.js recorre el banco).
  function elegir(rng, malas, k, correcta, texto = x => x[0]) {
    const sirve = xs => { const l = xs.map(x => texto(x).length), c = correcta.length; return c < Math.max(...l) && c > Math.min(...l); };
    for (let n = 0; n < 40; n++) { const xs = rng.barajar(malas).slice(0, k); if (sirve(xs)) return xs; }
    throw new Error(`${ID}: con «${correcta}» ninguna mezcla deja la correcta entre la más corta y la más larga`);
  }

  // Las líneas de datos, las mismas de la teoría.
  const D_DEF = 'Definición: dice la clase de la cosa y el rasgo que la separa de sus vecinos.';
  const D_AMPLIA = 'Muy amplia: la definición deja entrar a un vecino, que no es la cosa.';
  const D_VECINO = 'Vecino: cosa parecida, de la misma clase, que no es lo que se define.';
  const D_SINCLASE = 'Sin clase: la frase da un rasgo, pero no dice qué es la cosa.';
  const D_NECES = 'Rasgo necesario: lo tienen todos los casos, sin excepción.';
  const D_SUFI = 'Rasgo suficiente: no lo tiene ningún vecino; basta para separar.';
  const D_EJEMPLO = 'Ejemplo: un caso de la cosa. La muestra, pero no la define.';
  const D_AJUSTA = 'Se ajusta: la palabra cumple la clase y cada rasgo de la definición, sin agregar otro.';
  const D_OTRA = 'Define al vecino: tiene clase y rasgo, pero el rasgo es de otra cosa.';
  const D_VECINO3 = 'El vecino: palabra de la misma clase que cambia un rasgo.';
  const D_OTRA3 = 'Otra clase: palabra del mismo tema que no es de la clase que nombra la definición.';
  const D_GENERAL = 'La más general: cumple la clase, pero no dice los rasgos.';
  const D_ESPEC = 'La más específica: cumple todo y agrega un rasgo que la definición no dice.';
  const D_CIRC = 'Circular: la definición usa la misma palabra que define.';
  const D_NEG = 'Negativa: solo dice lo que la cosa no es.';
  const D_FIG = 'Figurada: compara la cosa con otra en vez de decir qué es.';
  const D_FALTA = 'Negar vale cuando la palabra nombra una falta: «calvo: que no tiene pelo».';
  const D_TEXTO = 'Un texto define un término cuando dice qué es: «es», «se llama», «consiste en».';
  const D_DATO = 'Dato: una cifra, un lugar o una fecha del término. Lo acompaña, pero no lo define.';
  const D_SOLO = '«Solo», «siempre», «nunca»: dicen que no hay excepción.';

  // ---------------- Idea 1: clase y rasgo que separa ----------------
  // seres: lo que hay en la situación, con sus rasgos (el primero de la lista de una cosa es su clase). ops: [texto,
  // condición, código]; la condición es la lista de rasgos que pide. Las clases lejanas («objeto», «cosa») las tienen
  // todos los seres de su tipo.
  const DEF = [
    { id: 'linterna', p: 'linterna', cl: 'aparato', sit: 'En la mochila de emergencia del colegio hay una linterna, una radio y velas.',
      seres: { linterna: ['objeto', 'aparato', 'da luz', 'portátil', 'pilas'], radio: ['objeto', 'aparato', 'pilas', 'portátil', 'da sonido'], foco: ['objeto', 'aparato', 'da luz', 'en el techo'], vela: ['objeto', 'da luz', 'portátil'] },
      ops: [['Aparato portátil que da luz con pilas', ['aparato', 'da luz', 'portátil']], ['Aparato que da luz', ['aparato', 'da luz'], 'RVD2'],
        ['Aparato portátil que funciona con pilas y da sonido', ['aparato', 'da sonido'], 'RVD7'], ['Objeto que se puede llevar a todas partes', ['objeto', 'portátil'], 'RVD6'],
        ['Que alumbra y se puede llevar en la mano', ['da luz', 'portátil'], 'RVD8']] },
    { id: 'sarten', p: 'sartén', cl: 'utensilio de cocina', sit: 'En la cocina del comedor escolar hay una sartén, una olla y un cucharón.',
      seres: { sartén: ['objeto', 'utensilio de cocina', 'para freír', 'poco hondo', 'con mango'], olla: ['objeto', 'utensilio de cocina', 'hondo', 'para hervir'], cucharón: ['objeto', 'utensilio de cocina', 'con mango', 'para servir'], plato: ['objeto', 'poco hondo'], parrilla: ['objeto', 'para freír'] },
      ops: [['Utensilio de cocina poco hondo, con mango, para freír', ['utensilio de cocina', 'poco hondo', 'para freír']], ['Utensilio de cocina con un mango largo', ['utensilio de cocina', 'con mango'], 'RVD2'],
        ['Utensilio de cocina hondo, en el que se hierve el agua', ['utensilio de cocina', 'hondo', 'para hervir'], 'RVD7'], ['Objeto de la casa que es poco hondo', ['objeto', 'poco hondo'], 'RVD6'],
        ['Que sirve para freír los huevos y el pescado del almuerzo', ['para freír'], 'RVD8']] },
    { id: 'tambor', p: 'tambor', cl: 'instrumento de percusión', sit: 'En la banda del colegio hay tambores, platillos y trompetas.',
      seres: { tambor: ['objeto', 'instrumento', 'de percusión', 'con parche', 'se golpea'], platillos: ['objeto', 'instrumento', 'de percusión', 'de metal', 'se golpea'], trompeta: ['objeto', 'instrumento', 'de viento', 'de metal'], puerta: ['objeto', 'se golpea'] },
      ops: [['Instrumento de percusión con un parche que se golpea', ['instrumento', 'de percusión', 'con parche']], ['Instrumento de percusión que se golpea', ['instrumento', 'de percusión'], 'RVD2'],
        ['Instrumento de percusión de dos discos de metal que chocan entre sí', ['instrumento', 'de percusión', 'de metal'], 'RVD7'], ['Objeto que suena cuando se lo golpea', ['objeto', 'se golpea'], 'RVD6'],
        ['Que suena fuerte cuando se lo golpea con un palo', ['se golpea'], 'RVD8']] },
    { id: 'balde', p: 'balde', cl: 'recipiente', sit: 'Para regar el biohuerto, la profesora pidió un balde y una regadera.',
      seres: { balde: ['objeto', 'recipiente', 'con asa', 'boca ancha', 'para llevar líquidos'], regadera: ['objeto', 'recipiente', 'con asa', 'con pico de flor', 'para llevar líquidos'], botella: ['objeto', 'recipiente', 'boca angosta', 'para llevar líquidos'], canasta: ['objeto', 'con asa'] },
      ops: [['Recipiente de boca ancha, con asa, para llevar líquidos', ['recipiente', 'boca ancha', 'con asa']], ['Recipiente para llevar líquidos', ['recipiente', 'para llevar líquidos'], 'RVD2'],
        ['Recipiente con asa y un pico que reparte el agua en gotas', ['recipiente', 'con pico de flor'], 'RVD7'], ['Objeto que se lleva colgado de un asa', ['objeto', 'con asa'], 'RVD6'],
        ['Que tiene asa y boca ancha', ['con asa', 'boca ancha'], 'RVD8']],
      // Sin clase, «con asa y boca ancha» deja entrar a la canasta: tiene asa y es abierta arriba.
      extra: { canasta: ['boca ancha'] } },
    { id: 'peine', p: 'peine', cl: 'utensilio', sit: 'En la lista de útiles de aseo para el viaje de promoción hay un peine y un cepillo de dientes.',
      seres: { peine: ['objeto', 'utensilio', 'con púas', 'para el cabello'], 'cepillo de dientes': ['objeto', 'utensilio', 'con cerdas', 'para los dientes'], 'cepillo de pelo': ['objeto', 'utensilio', 'con cerdas', 'para el cabello'], tenedor: ['objeto', 'utensilio', 'con púas', 'para comer'], cinta: ['objeto', 'para el cabello'] },
      ops: [['Utensilio con púas para arreglar el cabello', ['utensilio', 'con púas', 'para el cabello']], ['Utensilio para arreglar el cabello', ['utensilio', 'para el cabello'], 'RVD2'],
        ['Utensilio con cerdas para limpiar los dientes', ['utensilio', 'para los dientes'], 'RVD7'], ['Objeto que se usa en la cabeza', ['objeto', 'para el cabello'], 'RVD6'],
        ['Que tiene púas, como los dientes de un tenedor', ['con púas'], 'RVD8']] },
    { id: 'calculadora', p: 'calculadora', cl: 'aparato', sit: 'Para el examen de Matemática se permite una calculadora, pero no el celular.',
      seres: { calculadora: ['objeto', 'aparato', 'hace cuentas', 'con teclas', 'solo cuentas'], celular: ['objeto', 'aparato', 'hace cuentas', 'con pantalla', 'llama'], reloj: ['objeto', 'aparato', 'da la hora'], ábaco: ['objeto', 'hace cuentas', 'solo cuentas'] },
      ops: [['Aparato con teclas que sirve solo para hacer cuentas', ['aparato', 'solo cuentas']], ['Aparato que puede hacer cuentas', ['aparato', 'hace cuentas'], 'RVD2'],
        ['Aparato con pantalla que sirve para llamar y hacer cuentas', ['aparato', 'llama'], 'RVD7'], ['Objeto que sirve para hacer cuentas', ['objeto', 'hace cuentas'], 'RVD6'],
        ['Que sirve solo para hacer cuentas', ['solo cuentas'], 'RVD8']] },
    { id: 'ventilador', p: 'ventilador', cl: 'aparato eléctrico', sit: 'En el aula de cómputo hay un ventilador, una estufa y una impresora.',
      seres: { ventilador: ['objeto', 'aparato eléctrico', 'mueve el aire', 'aspas'], estufa: ['objeto', 'aparato eléctrico', 'da calor'], impresora: ['objeto', 'aparato eléctrico', 'imprime'], abanico: ['objeto', 'mueve el aire'] },
      ops: [['Aparato eléctrico con aspas que mueve el aire', ['aparato eléctrico', 'mueve el aire']], ['Aparato eléctrico del aula', ['aparato eléctrico'], 'RVD2'],
        ['Aparato eléctrico que da calor en los días de frío', ['aparato eléctrico', 'da calor'], 'RVD7'], ['Objeto que sirve para refrescar el aire de un cuarto', ['objeto', 'mueve el aire'], 'RVD6'],
        ['Que mueve el aire para refrescar', ['mueve el aire'], 'RVD8']] },
    { id: 'hamaca', p: 'hamaca', cl: 'red o tela', sit: 'En el patio de la casa de la selva hay una hamaca y una cuerda para tender la ropa.',
      seres: { hamaca: ['objeto', 'red o tela', 'colgada', 'para echarse'], cuerda: ['objeto', 'colgada', 'para tender'], 'red de pescar': ['objeto', 'red o tela', 'para pescar'], cama: ['objeto', 'para echarse'] },
      ops: [['Red o tela colgada de sus puntas, para echarse', ['red o tela', 'colgada', 'para echarse']], ['Red o tela de la casa', ['red o tela'], 'RVD2'],
        ['Red que se lanza al agua para sacar peces', ['red o tela', 'para pescar'], 'RVD7'], ['Objeto en el que una persona se echa a descansar', ['objeto', 'para echarse'], 'RVD6'],
        ['Que cuelga entre dos palos', ['colgada'], 'RVD8']] },
  ];
  // Los nombres femeninos del banco (para «la radio», «la sartén»).
  const FEM = new Set(['linterna', 'radio', 'vela', 'sartén', 'olla', 'parrilla', 'regadera', 'botella', 'canasta', 'cinta', 'calculadora', 'estufa', 'impresora', 'hamaca', 'cuerda', 'red de pescar', 'cama', 'trompeta', 'puerta']);
  // Qué entra con una condición, y quiénes se cuelan (lo que no es la palabra).
  const entran = (it, pide) => Object.entries(it.seres).filter(([n, r]) => pide.every(x => r.includes(x) || ((it.extra || {})[n] || []).includes(x))).map(([n]) => n);
  function tDefinicion(rng, examen) {
    const it = rng.elegir(DEF), [ok, ...malas] = it.ops;
    const dentro = entran(it, ok[1]);
    if (dentro.length !== 1 || dentro[0] !== it.p) throw new Error(`${ID}: en «${it.id}» la correcta deja dentro a ${dentro}`);
    const errores = elegir(rng, malas, examen ? 4 : 3, ok[0]).map(([t, pide, cod]) => {
      const d = entran(it, pide), cuelan = d.filter(n => n !== it.p);
      const nom = n => `${FEM.has(n) ? 'la' : /s$/.test(n) ? 'los' : 'el'} ${n}`;
      // «de el» se contrae: «el rasgo del celular», «es cierto de la calculadora».
      const del = n => `el ${nom(n).replace(/^el /, 'del ').replace(/^(la|los) /, 'de $1 ')}`;
      let ex;
      if (cod === 'RVD7') { if (d.includes(it.p) || !cuelan.length) throw new Error(`${ID}: «${t}» no define al vecino`); ex = `Tiene clase y rasgo, pero ese rasgo es ${del(cuelan[0])}: ${nom(it.p)} queda fuera.`; }
      else {
        if (!d.includes(it.p) || !cuelan.length) throw new Error(`${ID}: «${t}» (${cod}) no deja entrar a nadie más`);
        if (cod === 'RVD2') ex = `La clase, «${it.cl}», está bien, pero falta un rasgo que separe: también entra ${nom(cuelan[0])}.`;
        if (cod === 'RVD6') ex = `Es cierto ${del(it.p).replace(/^el /, '')}, pero esa clase queda muy lejos: también ${cuelan.length > 1 ? 'entran' : 'entra'} ${lista(cuelan.map(nom))}.`;
        if (cod === 'RVD8') ex = `El rasgo va bien, pero no dice qué es: falta la clase, «${it.cl}». Así entra también ${nom(cuelan[0])}.`;
      }
      return Object.assign({ clave: `def:${t}`, texto: t }, err(cod, ex));
    });
    return {
      enunciado: [it.sit], pregunta: [examen ? `Pregunta del simulacro: ¿qué alternativa define mejor la palabra «${it.p}»?` : `¿Qué definición de «${it.p}» la separa de sus vecinos?`],
      datos: examen ? [D_DEF, D_AMPLIA, D_OTRA, D_SINCLASE] : [D_DEF, D_AMPLIA, D_VECINO, D_OTRA],
      correcta: ok[0], errores,
      solucion: [[`Primero la clase: «${it.cl}», el grupo al que pertenece.`],
        [`Después el rasgo: «${ok[0]}» deja fuera a ${lista(Object.keys(it.seres).filter(n => n !== it.p))}.`],
        ['Las otras dejan entrar a un vecino, definen a otro o no dicen la clase.']],
      _datos: { item: it.id },
    };
  }

  // ---------------- Idea 2: necesario, no solo frecuente ----------------
  // casos: los casos de la cosa, con sus rasgos; vecinos: lo que no lo es. ops: [texto, condición o null si es un
  // ejemplo, código]. La correcta está en todos los casos y en ningún vecino.
  const RASGO = [
    { id: 'cuadrilatero', c: 'cuadrilátero', sit: 'En la pizarra hay un cuadrado, un rombo y un trapecio, y al lado un triángulo.',
      casos: { cuadrado: ['4 lados', 'lados iguales', 'ángulos rectos', 'lados rectos'], rombo: ['4 lados', 'lados iguales', 'lados rectos'], trapecio: ['4 lados', 'lados rectos'] }, vecinos: { triángulo: ['3 lados', 'lados rectos'] },
      ops: [['Tiene exactamente cuatro lados', ['4 lados']], ['Tiene sus cuatro lados del mismo largo', ['lados iguales'], 'RVD1'], ['Tiene lados rectos', ['lados rectos'], 'RVD3'],
        ['Es como una baldosa', null, 'RV56'], ['Tiene cuatro lados y cuatro ángulos rectos', ['4 lados', 'ángulos rectos'], 'RVD4']] },
    { id: 'par', c: 'número par', sit: 'Rosa anotó en su cuaderno tres números pares: 2, 10 y 36. Al lado anotó el 7.',
      casos: { '2': ['entre 2', 'entero'], '10': ['entre 2', 'entero', 'termina en 0', 'entre 5'], '36': ['entre 2', 'entero', 'entre 4'] }, vecinos: { '7': ['entero'] },
      ops: [['Se puede dividir entre 2 sin que sobre nada', ['entre 2']], ['Es un número que termina en cero', ['termina en 0'], 'RVD1'], ['Es un número entero', ['entero'], 'RVD3'],
        ['Es como el 4, que se reparte en dos grupos iguales', null, 'RV56'], ['Se puede dividir entre 2 y también entre 4', ['entre 2', 'entre 4'], 'RVD4']] },
    { id: 'equipo', c: 'deporte de equipo', sit: 'El municipio escolar organiza campeonatos de fútbol, vóley y básquet. Para atletismo hay otra fecha.',
      casos: { fútbol: ['dos equipos', 'pelota', 'con los pies', 'once'], vóley: ['dos equipos', 'pelota'], básquet: ['dos equipos', 'pelota'] }, vecinos: { atletismo: ['individual'], tenis: ['pelota', 'individual'] },
      ops: [['Se juega entre dos equipos de varios jugadores', ['dos equipos']], ['Se juega pateando la pelota con los pies', ['con los pies'], 'RVD1'], ['Se juega con una pelota dentro de una cancha marcada', ['pelota'], 'RVD3'],
        ['Es como el fútbol del recreo', null, 'RV56'], ['Se juega entre dos equipos de once jugadores', ['dos equipos', 'once'], 'RVD4']],
      datos: ['El tenis se juega con pelota, uno contra uno.'] },
    { id: 'cuerda', c: 'instrumento de cuerda', sit: 'En la clase de Música hay una guitarra, un charango y un violín. El profesor toca la quena.',
      casos: { guitarra: ['cuerdas vibran', 'música', 'con los dedos'], charango: ['cuerdas vibran', 'música', 'con los dedos'], violín: ['cuerdas vibran', 'música', 'con arco'] }, vecinos: { quena: ['música', 'se sopla'] },
      ops: [['Suena al hacer vibrar sus cuerdas', ['cuerdas vibran']], ['Se toca pulsando las cuerdas con los dedos', ['con los dedos'], 'RVD1'], ['Produce música', ['música'], 'RVD3'],
        ['Es como el charango de la fiesta', null, 'RV56'], ['Tiene cuerdas que se hacen sonar con un arco', ['cuerdas vibran', 'con arco'], 'RVD4']],
      datos: ['El violín se toca frotando sus cuerdas con un arco.'] },
    { id: 'liquido', c: 'líquido', sit: 'En el laboratorio hay agua, leche y aceite en frascos, y un cubo de hielo en un plato.',
      casos: { agua: ['toma la forma', 'transparente', 'en botella'], leche: ['toma la forma', 'en botella'], aceite: ['toma la forma', 'transparente', 'en botella'] }, vecinos: { hielo: ['transparente', 'sólido'], arena: ['en botella'] },
      ops: [['Toma la forma del recipiente sin cambiar su volumen', ['toma la forma']], ['Es transparente y deja ver lo que hay detrás', ['transparente'], 'RVD1'], ['Se puede guardar en una botella o en un frasco con tapa', ['en botella'], 'RVD3'],
        ['Es como el agua del caño', null, 'RV56'], ['Toma la forma del recipiente y deja ver a través', ['toma la forma', 'transparente'], 'RVD4']],
      datos: ['La arena también se puede guardar en una botella.'] },
    { id: 'aguda', c: 'palabra aguda', sit: 'En la clase de Comunicación, la profesora escribió tres palabras agudas: café, canción y reloj. Al lado escribió «mesa».',
      casos: { café: ['fuerza al final', 'tilde', 'dos sílabas'], canción: ['fuerza al final', 'tilde', 'dos sílabas'], reloj: ['fuerza al final', 'dos sílabas'] }, vecinos: { mesa: ['dos sílabas'] },
      ops: [['Lleva la fuerza de la voz en la última sílaba', ['fuerza al final']], ['Lleva tilde sobre la vocal de la última sílaba', ['tilde'], 'RVD1'], ['Tiene dos sílabas o más', ['dos sílabas'], 'RVD3'],
        ['Es como «sofá»', null, 'RV56'], ['Lleva la fuerza en la última sílaba y lleva tilde', ['fuerza al final', 'tilde'], 'RVD4']],
      datos: ['«Mesa» lleva la fuerza de la voz en «me».'] },
  ];
  const tiene = (r, pide) => pide.every(x => r.includes(x));
  function tRasgo(rng, examen) {
    const it = rng.elegir(RASGO), [ok, ...malas] = it.ops;
    const fuera = pide => Object.entries(it.casos).filter(([, r]) => !tiene(r, pide)).map(([n]) => n);
    const cuelan = pide => Object.entries(it.vecinos).filter(([, r]) => tiene(r, pide)).map(([n]) => n);
    if (fuera(ok[1]).length || cuelan(ok[1]).length) throw new Error(`${ID}: en «${it.id}» la correcta no está en todos o la tiene un vecino`);
    const q = n => (/^\d+$/.test(n) ? `el ${n}` : n);
    const errores = elegir(rng, malas, examen ? 4 : 3, ok[0]).map(([t, pide, cod]) => {
      let ex;
      if (cod === 'RV56') ex = 'Nombra un caso, pero un caso no dice qué tienen todos: un ejemplo no define.';
      else if (cod === 'RVD3') { const c = cuelan(pide); if (fuera(pide).length || !c.length) throw new Error(`${ID}: «${t}» no es necesario y amplio`); ex = `Lo tienen todos los casos, pero también ${q(c[0])}: no basta para separar.`; }
      else { const f = fuera(pide); if (!f.length) throw new Error(`${ID}: «${t}» no deja casos fuera`); ex = `Algunos lo tienen, pero ${q(f[0])} no, y también es ${it.c}: la definición queda muy estrecha.`; }
      return Object.assign({ clave: `rasgo:${t}`, texto: t }, err(cod, ex));
    });
    return {
      enunciado: [it.sit], pregunta: [examen ? `Pregunta del simulacro: ¿qué rasgo de «${it.c}» está en todos los casos y en ningún otro?` : `¿Qué rasgo de «${it.c}» está en todos los casos y en ningún vecino?`],
      datos: [D_NECES, D_SUFI, D_EJEMPLO, ...(it.datos || [])],
      correcta: ok[0], errores,
      solucion: [[`Dos pruebas: ¿lo tienen todos los casos (${lista(Object.keys(it.casos).map(q))})? ¿Lo tiene algún vecino (${lista(Object.keys(it.vecinos).map(q))})?`],
        [`«${ok[0]}» pasa las dos: está en todos los casos y en ningún vecino.`]],
      _datos: { item: it.id },
    };
  }

  // ---------------- Idea 3: de la definición a la palabra ----------------
  // defi: [clase, rasgos]; pals: palabra → [clase, rasgos, nota]. La palabra se ajusta si tiene la misma clase y
  // justo los mismos rasgos. Formato de la UNI como hipótesis (ver la cabecera).
  const PAL = [
    { id: 'perro', t: 'Animal doméstico que ladra.', defi: ['animal', ['doméstico', 'ladra']],
      pals: { perro: ['animal', ['doméstico', 'ladra']], animal: ['animal', []], chihuahua: ['animal', ['doméstico', 'ladra', 'raza'], 'la raza'], gato: ['animal', ['doméstico', 'maúlla'], 'maúlla, no ladra'], ladrido: ['sonido', [], 'el sonido que hace'] } },
    { id: 'silla', t: 'Mueble con respaldo, para que se siente una persona.', defi: ['mueble', ['respaldo', 'sentarse', 'una persona']],
      pals: { silla: ['mueble', ['respaldo', 'sentarse', 'una persona']], mueble: ['mueble', []], mecedora: ['mueble', ['respaldo', 'sentarse', 'una persona', 'se mece'], 'que se mece'], taburete: ['mueble', ['sentarse', 'una persona'], 'no tiene respaldo'], pata: ['parte', [], 'una parte del mueble'] } },
    { id: 'chofer', t: 'Persona que conduce un vehículo.', defi: ['persona', ['conduce']],
      pals: { chofer: ['persona', ['conduce']], persona: ['persona', []], taxista: ['persona', ['conduce', 'taxi'], 'que el vehículo es un taxi'], pasajero: ['persona', ['va dentro'], 'va en el vehículo sin conducirlo'], bus: ['vehículo', [], 'el vehículo, no la persona'] } },
    { id: 'arbol', t: 'Planta de tronco leñoso y alto, que se ramifica lejos del suelo.', defi: ['planta', ['tronco leñoso', 'alto', 'ramas arriba']],
      pals: { árbol: ['planta', ['tronco leñoso', 'alto', 'ramas arriba']], planta: ['planta', []], eucalipto: ['planta', ['tronco leñoso', 'alto', 'ramas arriba', 'especie'], 'cuál árbol es'], arbusto: ['planta', ['tronco leñoso', 'ramas abajo'], 'es bajo y se ramifica desde el suelo'], leña: ['material', [], 'la madera que da'] } },
    { id: 'contemplar', t: 'Mirar algo con atención y por un buen rato.', defi: ['mirar', ['atención', 'largo rato']],
      pals: { contemplar: ['mirar', ['atención', 'largo rato']], mirar: ['mirar', []], 'contemplar el lago': ['mirar', ['atención', 'largo rato', 'el lago'], 'el lago'], ojear: ['mirar', ['de pasada'], 'es mirar de pasada'], mirada: ['cosa', [], 'una cosa, no una acción'] } },
    { id: 'teatro', t: 'Edificio donde se representan obras con actores, para el público.', defi: ['edificio', ['obras con actores', 'público']],
      pals: { teatro: ['edificio', ['obras con actores', 'público']], edificio: ['edificio', []], anfiteatro: ['edificio', ['obras con actores', 'público', 'al aire libre'], 'que es al aire libre, en semicírculo'], cine: ['edificio', ['películas', 'público'], 'ahí se proyectan películas'], obra: ['espectáculo', [], 'lo que se representa'] } },
    { id: 'esquilar', t: 'Cortar la lana o el pelo a un animal.', defi: ['cortar', ['lana o pelo', 'animal']],
      pals: { esquilar: ['cortar', ['lana o pelo', 'animal']], cortar: ['cortar', []], 'esquilar alpacas': ['cortar', ['lana o pelo', 'animal', 'alpacas'], 'alpacas'], podar: ['cortar', ['ramas'], 'es cortar ramas'], lana: ['material', [], 'lo que se corta'] } },
    { id: 'cunado', t: 'Esposo de la hermana de una persona.', defi: ['esposo', ['de la hermana']],
      pals: { cuñado: ['esposo', ['de la hermana']], esposo: ['esposo', []], 'cuñado mayor': ['esposo', ['de la hermana', 'mayor'], 'mayor'], yerno: ['esposo', ['de la hija'], 'es el esposo de la hija'], matrimonio: ['unión', [], 'la unión, no la persona'] } },
    { id: 'infusion', t: 'Bebida caliente hecha con hojas de una planta en agua hervida.', defi: ['bebida', ['caliente', 'hojas', 'agua hervida']],
      pals: { infusión: ['bebida', ['caliente', 'hojas', 'agua hervida']], bebida: ['bebida', []], manzanilla: ['bebida', ['caliente', 'hojas', 'agua hervida', 'manzanilla'], 'de qué planta es'], jugo: ['bebida', ['fría', 'fruta'], 'es fría y de fruta'], hoja: ['parte', [], 'una parte de la planta'] } },
    { id: 'vivero', t: 'Lugar donde se crían plantas para venderlas o trasplantarlas.', defi: ['lugar', ['crían plantas', 'vender o trasplantar']],
      pals: { vivero: ['lugar', ['crían plantas', 'vender o trasplantar']], lugar: ['lugar', []], 'vivero municipal': ['lugar', ['crían plantas', 'vender o trasplantar', 'municipal'], 'municipal'], huerto: ['lugar', ['verduras', 'para comer'], 'ahí se siembran verduras para comer'], planta: ['ser vivo', [], 'lo que se cría'] } },
  ];
  // La clase de una palabra respecto de la definición.
  function clasePal(defi, pal) {
    if (pal[0] !== defi[0]) return 'otra';
    const d = defi[1], p = pal[1], todos = d.every(x => p.includes(x)), sobra = p.some(x => !d.includes(x));
    if (todos && !sobra) return 'ok';
    if (todos) return 'especifica';
    if (!p.length) return 'general';
    return 'vecino';
  }
  const COD_PAL = { general: 'RVD9', especifica: 'RVD10', vecino: 'RVD7', otra: 'RVD11' };
  function tPalabra(rng, examen) {
    const it = rng.elegir(PAL), ws = Object.keys(it.pals), buenas = ws.filter(w => clasePal(it.defi, it.pals[w]) === 'ok');
    if (buenas.length !== 1) throw new Error(`${ID}: en «${it.id}» se ajustan ${buenas}`);
    const errores = elegir(rng, ws.filter(w => w !== buenas[0]), examen ? 4 : 3, buenas[0], w => w).map(w => {
      const c = clasePal(it.defi, it.pals[w]), nota = it.pals[w][2];
      const ex = { general: `«${w}» cumple la clase, pero no dice los rasgos: es la más general.`, especifica: `«${w}» cumple todo, pero agrega «${nota}», que la definición no dice: es la más específica.`,
        vecino: `«${w}» es de la misma clase, pero ${nota}: cambia el rasgo.`, otra: `«${w}» es del mismo tema, pero es ${nota}: es de otra clase.` }[c];
      return Object.assign({ clave: `pal:${w}`, texto: w }, err(COD_PAL[c], ex));
    });
    return {
      enunciado: [`________: ${it.t}`], pregunta: [examen ? 'Pregunta de definiciones del simulacro: ¿qué palabra se ajusta a la definición?' : '¿Qué palabra se ajusta a la definición?'],
      datos: [D_AJUSTA, D_GENERAL, D_ESPEC, D_VECINO3, D_OTRA3], correcta: buenas[0], errores,
      solucion: [[`Primero la clase: la definición empieza con «${it.t.split(/[ ,]/)[0].toLowerCase()}».`], [`Después cada rasgo: «${buenas[0]}» los cumple todos y no agrega ninguno.`],
        ['La más general no dice los rasgos, la más específica agrega uno, el vecino cambia uno y la de otra clase no es lo que la definición nombra.']],
      _datos: { item: it.id },
    };
  }

  // ---------------- Idea 4: cuando la definición no define ----------------
  // forma: define · circular (repite la palabra) · negativa (solo dice lo que no es) · figurada (compara) · amplia (sin
  // rasgo). En «falta», la palabra nombra una falta y la frase que niega esa falta es la que define.
  const FALLA = [
    { id: 'mercado', p: 'mercado', sit: 'Para la tarea de Personal Social, Diego escribió cinco frases sobre el mercado de su barrio.',
      fr: [['Lugar donde se compran y venden alimentos y otras cosas', 'define'], ['Lugar que queda donde está el mercado del barrio, cerca de la plaza', 'circular'], ['Lugar que no es una tienda, ni una feria, ni un supermercado', 'negativa'],
        ['El corazón ruidoso y alegre de toda la ciudad', 'figurada', 'un corazón'], ['Lugar de la ciudad', 'amplia', 'la plaza']] },
    { id: 'escribir', p: 'escribir', sit: 'En el glosario de Comunicación, Rosa probó cinco frases para el verbo «escribir».',
      fr: [['Poner letras o palabras en un papel o en una pantalla', 'define'], ['Hacer lo mismo que hace un escritor cuando se sienta a escribir', 'circular'], ['No hablar, ni dibujar, ni cantar lo que uno piensa', 'negativa'],
        ['Sembrar ideas en una hoja en blanco para que otros las cosechen', 'figurada', 'una siembra'], ['Usar las manos', 'amplia', 'dibujar']] },
    { id: 'invierno', p: 'invierno', sit: 'En el mural del aula, 1.º B pegó cinco frases sobre el invierno en Puno.',
      fr: [['Estación más fría del año, entre el otoño y la primavera', 'define'], ['Tiempo del año en que es invierno en todo el altiplano', 'circular'], ['Estación que no es el verano, ni el otoño, ni la primavera', 'negativa'],
        ['El largo sueño helado de los campos y de los ríos', 'figurada', 'un sueño'], ['Estación del año', 'amplia', 'el verano']] },
    { id: 'medico', p: 'médico', sit: 'Antes de la visita a la posta, la tutora pidió definir la palabra «médico».',
      fr: [['Persona con título para curar enfermedades', 'define'], ['Persona que trabaja como médico en una posta o un hospital', 'circular'], ['Persona que no es enfermera ni técnico de la posta', 'negativa'],
        ['El ángel de bata blanca que cuida a los enfermos', 'figurada', 'un ángel'], ['Persona del hospital', 'amplia', 'la enfermera']] },
    { id: 'tristeza', p: 'tristeza', sit: 'En tutoría, cada alumno escribió una frase para la palabra «tristeza».',
      fr: [['Sentimiento de pena por algo que salió mal o se perdió', 'define'], ['Lo que siente una persona triste cuando algo le sale mal', 'circular'], ['Lo que se siente cuando no se está alegre ni contento', 'negativa'],
        ['Una nube gris en el pecho', 'figurada', 'una nube'], ['Sentimiento de una persona', 'amplia', 'la alegría']] },
    { id: 'montana', p: 'montaña', sit: 'Para la exposición de Geografía, Mateo probó cinco frases para «montaña».',
      fr: [['Gran elevación natural del terreno', 'define'], ['Terreno alto que tiene la forma de una montaña', 'circular'], ['Terreno que no es una llanura, ni un valle, ni una quebrada', 'negativa'],
        ['El gigante de piedra que mira el valle desde lo alto', 'figurada', 'un gigante'], ['Parte del terreno', 'amplia', 'la llanura']] },
  ];
  const FALTA = [
    { id: 'sordo', p: 'sordo', sit: 'En la feria inclusiva del colegio, un cartel explica la palabra «sordo».',
      fr: [['Dicho de una persona: que no puede oír los sonidos', 'define'], ['Dicho de una persona: que está sorda', 'circular'], ['Dicho de una persona: que no es ciega ni muda', 'negativa'], ['Dicho de una persona: que vive en un silencio sin fin', 'figurada', 'un silencio sin fin']] },
    { id: 'descalzo', p: 'descalzo', sit: 'El profesor de Educación Física pidió definir «descalzo» antes de la clase en la arena.',
      fr: [['Que no lleva zapatos ni nada en los pies', 'define'], ['Que anda descalzo por la arena de la playa', 'circular'], ['Que no está en la casa', 'negativa'], ['Que camina con los pies en libertad', 'figurada', 'la libertad']] },
    { id: 'inmovil', p: 'inmóvil', sit: 'En el cuento del taller de lectura, un personaje se queda «inmóvil». La profesora pidió definir la palabra.',
      fr: [['Que no se mueve de su sitio', 'define'], ['Que está inmóvil', 'circular'], ['Que no corre ni salta ni baila', 'negativa'], ['Que es una estatua de carne y hueso', 'figurada', 'una estatua']] },
    { id: 'desnudo', p: 'desnudo', sit: 'En la clase de Arte, Rosa tuvo que definir «desnudo», la palabra del título de una pintura.',
      fr: [['Que no lleva ropa sobre el cuerpo', 'define'], ['Que se quedó desnudo', 'circular'], ['Que no está triste ni enfermo ni cansado', 'negativa'], ['Que viste solo su propia piel', 'figurada', 'un vestido de piel']] },
  ];
  const COD_FALLA = { circular: 'RVD12', negativa: 'RVD13', figurada: 'RVD14', amplia: 'RVD2' };
  function tFalla(rng, falta) {
    const it = rng.elegir(falta ? FALTA : FALLA), ok = it.fr.filter(f => f[1] === 'define');
    if (ok.length !== 1) throw new Error(`${ID}: en «${it.id}» hay ${ok.length} que definen`);
    const malas = elegir(rng, it.fr.filter(f => f[1] !== 'define'), 3, ok[0][0]);
    const errores = malas.map(([t, forma, nota]) => {
      const ex = { circular: `Tiene forma de definición, pero usa «${it.p}» (o su familia) para definir «${it.p}»: quien no conoce la palabra se queda igual.`,
        negativa: falta ? 'Niega, pero no nombra la falta que dice la palabra: niega otras cosas.' : 'Tiene forma de definición, pero solo dice lo que no es: entran muchas otras cosas.',
        figurada: `Dice algo con gracia, pero compara con ${nota}: no dice qué es.`, amplia: `Dice la clase, pero le falta el rasgo: también entra ${nota}.` }[forma];
      return Object.assign({ clave: `fr:${t}`, texto: t }, err(COD_FALLA[forma], ex));
    });
    return {
      enunciado: [it.sit], pregunta: [`¿Cuál de estas frases define de verdad «${it.p}»?`],
      datos: falta ? [D_CIRC, D_NEG, D_FIG, D_FALTA] : [D_DEF, D_CIRC, D_NEG, D_FIG],
      correcta: ok[0][0], errores,
      solucion: falta ? [[`«${may(it.p)}» nombra una falta: su rasgo solo se dice negando.`], [`«${ok[0][0]}» nombra esa falta: define.`], ['Las otras repiten la palabra, niegan otras cosas o comparan.']]
        : [[`«${ok[0][0]}» dice la clase y el rasgo, sin repetir la palabra, sin negar y sin comparar.`], ['Las otras repiten la palabra, solo niegan, comparan o no traen el rasgo.']],
      _datos: { item: it.id },
    };
  }

  // ---------------- Idea 5: la definición dentro del texto ----------------
  // ors: [oración, papel]; ops: [texto, código]; la primera op es la paráfrasis de la oración que define. El generador
  // comprueba que la oración que define diga «es» o «se llama», que la paráfrasis empiece por la clase que esa oración
  // da y que la alternativa con «solo» agregue algo que el texto no dice.
  const TEXTO = [
    { id: 'tarwi', t: 'tarwi', cl: 'legumbre', clA: 'una legumbre', lugar: 'Cartel de la feria de Lampa',
      ors: [['El tarwi es una legumbre andina de grano blanco, que se come después de quitarle el sabor amargo en agua.', 'define'], ['En la feria se vende tarwi desgranado.', 'dato'],
        ['Tiene mucha proteína.', 'dato'], ['Por ejemplo, con él se prepara el ceviche de tarwi.', 'ejemplo']],
      ops: [['Legumbre andina de grano blanco, que se come sin su sabor amargo'], ['Grano con mucha proteína que se vende desgranado en la feria del pueblo', 'RVD15'], ['El ceviche de la feria, que se prepara con un grano andino de color blanco', 'RV56'],
        ['Legumbre andina que solo se come en ceviche', 'RV11'], ['Agua en la que se lava un grano amargo', 'RVD11']] },
    { id: 'mate', t: 'mate burilado', cl: 'calabaza', clA: 'una calabaza', lugar: 'Folleto del museo de Huancayo',
      ors: [['En Huancayo hay muchos talleres de mate burilado.', 'dato'], ['Un buen mate puede tomar varias semanas de trabajo.', 'dato'],
        ['El mate burilado es una calabaza seca con dibujos grabados con un buril.', 'define'], ['Por ejemplo, el de la vitrina 4 muestra una corrida de toros.', 'ejemplo']],
      ops: [['Calabaza seca con dibujos grabados con un buril'], ['Trabajo de varias semanas en un taller de Huancayo', 'RVD15'], ['La pieza de la vitrina 4, con una corrida de toros', 'RV56'],
        ['Calabaza que solo hacen en Huancayo', 'RV11'], ['Herramienta de punta fina', 'RVD11']],
      datos: ['Buril: herramienta de punta fina para grabar.'] },
    { id: 'granizada', t: 'granizada', cl: 'lluvia', clA: 'una lluvia', lugar: 'Mensaje de la junta vecinal de Juliaca',
      ors: [['Ayer por la tarde cayó una granizada sobre Juliaca.', 'dato'], ['Una granizada es una lluvia de pequeños trozos de hielo que caen de las nubes.', 'define'],
        ['Por ejemplo, la de ayer rompió varios techos de calamina.', 'ejemplo'], ['Cubra sus plantas con plástico cuando el cielo se ponga oscuro.', 'consejo']],
      ops: [['Lluvia de pequeños trozos de hielo que caen de las nubes'], ['Lo que cayó ayer por la tarde sobre la ciudad de Juliaca, con mucho ruido', 'RVD15'], ['La que ayer rompió varios techos de calamina en la ciudad de Juliaca', 'RV56'],
        ['Caída de hielo que solo ocurre por la tarde', 'RV11'], ['Plástico con que se cubren las plantas', 'RVD11']] },
    { id: 'minka', t: 'minka', cl: 'trabajo', clA: 'un trabajo', lugar: 'Folleto de la comunidad de Capachica',
      ors: [['En la comunidad se hizo una minka la semana pasada.', 'dato'], ['La minka es un trabajo que una familia pide a sus vecinos y paga con comida y bebida.', 'define'],
        ['Por ejemplo, este año se levantó así la casa de doña Juana.', 'ejemplo'], ['Ese día, todos llegaron muy temprano.', 'dato']],
      ops: [['Trabajo que una familia pide a sus vecinos y paga con comida'], ['Día en que los vecinos llegan muy temprano', 'RVD15'], ['La construcción de la casa de doña Juana, que se levantó este año', 'RV56'],
        ['Trabajo que solo se hace en la comunidad de Capachica, cerca del lago', 'RV11'], ['Comida y bebida que se invita a los vecinos', 'RVD11']] },
    { id: 'eclipse', t: 'eclipse', cl: 'ocultamiento', clA: 'un ocultamiento', lugar: 'Mensaje del club de astronomía del colegio',
      ors: [['El club mirará un eclipse desde el patio.', 'dato'], ['Nunca mire el Sol sin lentes especiales.', 'consejo'],
        ['Un eclipse es el ocultamiento de un astro porque otro se pone delante.', 'define'], ['Por ejemplo, en un eclipse de sol, la Luna tapa al Sol.', 'ejemplo']],
      ops: [['Ocultamiento de un astro porque otro se pone delante'], ['Lo que el club de astronomía mirará desde el patio del colegio', 'RVD15'], ['El momento en que la Luna tapa al Sol', 'RV56'],
        ['Ocultamiento que solo se puede ver de noche', 'RV11'], ['Astro que se pone delante de otro astro y lo tapa por un rato', 'RVD11']] },
    { id: 'vacuna', t: 'vacuna', cl: 'sustancia', clA: 'una sustancia', lugar: 'Comunicado del puesto de salud',
      ors: [['El lunes llega al colegio la campaña de vacunación.', 'dato'], ['Una vacuna es una sustancia que prepara al cuerpo para defenderse de una enfermedad.', 'define'],
        ['Por ejemplo, la vacuna contra el sarampión se pone de niño.', 'ejemplo'], ['Lleven su carné de vacunación.', 'consejo']],
      ops: [['Sustancia que prepara al cuerpo para defenderse de una enfermedad'], ['Campaña de vacunación que llega al colegio el lunes, con el puesto de salud', 'RVD15'], ['La que se pone de niño contra el sarampión, como dice el comunicado del puesto', 'RV56'],
        ['Sustancia que solo se pone a los niños', 'RV11'], ['Enfermedad de la que el cuerpo se defiende', 'RVD11']] },
  ];
  const raiz = t => t.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').slice(0, 5);
  function tTermino(rng, examen) {
    const it = rng.elegir(TEXTO), def = it.ors.find(o => o[1] === 'define'), texto = it.ors.map(o => o[0]).join(' ');
    if (!new RegExp(`${it.t} es |se llama ${it.t}`).test(def[0])) throw new Error(`${ID}: en «${it.id}» la oración que define no dice «es»`);
    const [ok, ...malas] = it.ops;
    if (raiz(ok[0]) !== raiz(it.cl)) throw new Error(`${ID}: en «${it.id}» la paráfrasis no empieza por la clase`);
    const n = k => it.ors.findIndex(o => o[1] === k) + 1;
    const errores = elegir(rng, malas, examen ? 4 : 3, ok[0]).map(([t, cod]) => {
      if (cod === 'RV11' && (!/\bsolo\b/.test(t) || /\bsolo\b/.test(texto))) throw new Error(`${ID}: «${t}» no agrega un «solo»`);
      if (cod === 'RVD11' && raiz(t) === raiz(it.cl)) throw new Error(`${ID}: «${t}» no cambia la clase`);
      const ex = { RVD15: 'Tiene que ver con el texto, pero toma otra oración, que da un dato o un consejo: no dice qué es.', RV56: `Es un caso, el de la oración ${n('ejemplo')}: un ejemplo no define.`,
        RV11: 'Conserva parte de la clase, pero agrega un «solo» que el texto no dice.', RVD11: `Es del mismo tema, pero cambia la clase: el texto dice que es ${it.clA}.` }[cod];
      return Object.assign({ clave: `ter:${t}`, texto: t }, err(cod, ex));
    });
    return {
      enunciado: [`${it.lugar}: `, ...it.ors.map((o, k) => `(${k + 1}) ${o[0]}${k < it.ors.length - 1 ? ' ' : ''}`)],
      pregunta: [examen ? `Pregunta de comprensión de lectura: en el texto, el término «${it.t}» se entiende como` : `En el texto, el término «${it.t}» se entiende como`],
      datos: [D_TEXTO, D_DATO, D_SOLO, ...(it.datos || [])], correcta: ok[0], errores,
      solucion: [[`La oración ${n('define')} dice «${it.t} es»: ahí está la definición.`], [`«${ok[0]}» conserva su clase, «${it.cl}», y su rasgo.`],
        ['Las otras toman un dato o un ejemplo, cambian la clase o agregan un «solo».']],
      _datos: { item: it.id },
    };
  }

  // ---------------- Tipos por idea ----------------
  const CONSTRUIR = {
    definicion: rng => tDefinicion(rng, false), 'definicion-examen': rng => tDefinicion(rng, true),
    rasgo: rng => tRasgo(rng, false), 'rasgo-examen': rng => tRasgo(rng, true),
    palabra: rng => tPalabra(rng, false), 'palabra-examen': rng => tPalabra(rng, true),
    define: rng => tFalla(rng, false), falta: rng => tFalla(rng, true),
    termino: rng => tTermino(rng, false), 'termino-examen': rng => tTermino(rng, true),
  };
  const TIPOS_POR_IDEA = {
    'genero-diferencia': ['definicion', 'definicion-examen'],
    'rasgo-necesario': ['rasgo', 'rasgo-examen'],
    'definicion-a-palabra': ['palabra', 'palabra-examen'],
    'definicion-defectuosa': ['define', 'falta'],
    'definicion-en-texto': ['termino', 'termino-examen'],
  };
  const IDEAS = Object.keys(TIPOS_POR_IDEA);
  const IDEA_DE = Object.fromEntries(IDEAS.flatMap(i => TIPOS_POR_IDEA[i].map(t => [t, i])));
  const NIVEL = { definicion: 1, 'definicion-examen': 3, rasgo: 2, 'rasgo-examen': 3, palabra: 2, 'palabra-examen': 3, define: 2, falta: 3, termino: 2, 'termino-examen': 3 };
  // Papel (regla 6; herramientas/papel-generador.js toma «papel-1» a «papel-8»): las cinco ideas, de menos a más.
  const PAPEL = { 'papel-1': 'definicion', 'papel-2': 'rasgo', 'papel-3': 'palabra', 'papel-4': 'define', 'papel-5': 'termino',
    'papel-6': 'palabra-examen', 'papel-7': 'falta', 'papel-8': 'termino-examen' };

  function generar(semilla, opciones) {
    const o = typeof opciones === 'string' ? { unidad: opciones } : opciones || {};
    const rng = Azar.crear(`${ID}|${semilla}`);
    const tipo = (!o.idea && PAPEL[String(semilla)]) || rng.elegir(TIPOS_POR_IDEA[TIPOS_POR_IDEA[o.idea] ? o.idea : rng.elegir(IDEAS)]);
    const pr = CONSTRUIR[tipo](rng);
    const alternativas = P.armarTexto({ correcta: { clave: `ok:${pr.correcta}`, texto: pr.correcta }, errores: pr.errores, rng });
    return {
      id: `${ID}#${semilla}`, variables: {}, enunciado: pr.enunciado, pregunta: pr.pregunta, datos: pr.datos, alternativas,
      solucion: pr.solucion, respuesta: { valor: `ok:${pr.correcta}`, texto: pr.correcta, unidad: '' },
      _datos: Object.assign({ idea: IDEA_DE[tipo], tipo, nivel: NIVEL[tipo], codigos: alternativas.filter(a => a.error).map(a => a.error.id) }, pr._datos),
    };
  }

  return { id: ID, titulo: 'Definiciones', generar, TIPOS_POR_IDEA, NIVEL, TIPOS: Object.keys(CONSTRUIR), DEF, RASGO, PAL, FALLA, FALTA, TEXTO };
});
