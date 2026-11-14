/*
 * Teoría de «Analogías» (razonamiento-verbal.analogias). Molde: docs/teoria.md. Contenido: matriz de verbal
 * (unidad 2), historia (Poética de Aristóteles) y códigos RV15–RV17 y RV21 de
 * docs/investigacion/razonamiento-verbal-ideas-erroneas.md. Pares y oraciones propios (regla 5).
 * Ruta C · Comparar: se prueba un par en la oración puente del par base y se ve si la relación se conserva.
 *
 * Ficha de tarea:
 *   Promesa: elegir el par que conserva la relación del par base, en el mismo orden.
 *   Persona y condiciones: postulante de 3.º a 5.º, celular, sin audio; analogías de la UNI (semana 2).
 *   Resultado observable: nombra la relación con una oración puente y la aplica igual a los dos pares.
 *   Orden de atención: 1.º el par base · 2.º la oración puente con el par probado · acción: cambiar el par.
 *   Estados: la oración se cumple (i) · no se cumple (h) · se cumple al revés.
 *   Duda que resuelve: ¿por qué «carpintero : madera» no sirve si es del mismo tema que «carpintero : serrucho»?
 *
 * Colores (regla 4): par base i (turquesa, continuo), par que se prueba o (naranja, discontinuo),
 * la relación (oración puente) d (verde, punteado), lo que no se cumple h (rojo).
 * Códigos: RV15 (asociación temática), RV16 (orden invertido), RV17 (otra relación del mismo campo),
 * RV21 (contrario de otro rasgo o solo distinto); RVA1 (sucesión tomada por causa) es hipótesis nueva.
 */
(function (root, fabrica) {
  const def = fabrica(typeof module === 'object' && module.exports ? require('../../../nucleo/kit/kit.js') : root.Kit);
  if (typeof module === 'object' && module.exports) module.exports = def;
  else root.Teoria.unidad(def);
})(typeof self !== 'undefined' ? self : this, function (Kit) {
  'use strict';
  // Gesto directo (docs/teoria.md §4b): bajo la oración puente hay una bandeja con los pares (o palabras) para probar.
  // El alumno arrastra la ficha por la bandeja y la suelta en el par que quiere poner en los huecos; la manija va
  // sobre el número del par (rv-texto.ancla) y salta al más cercano al dedo (rv-texto.cercana). Los botones del
  // control «p» son la alternativa sin arrastre.
  const RV = () => Kit.piezas['rv-texto'];
  const conBandeja = (datos, items, titulo = 'Pares para probar') => ({ secciones: datos.secciones.concat([{ id: 'bandeja', titulo, modo: 'lista', fragmentos: items }]) });
  const ficha = (datosDe, ids, etiqueta = 'ficha del par que se prueba') => ({
    id: 'ficha', etiqueta, color: 'c-o',
    donde: val => RV().ancla(datosDe(val), val.p),
    mover: (pt, val) => ({ p: RV().cercana(datosDe(val), pt, ids) }),
  });
  // El estado marca, además, la ficha elegida en la bandeja.
  const conFicha = (estado, id) => Object.assign({}, estado, { marcas: Object.assign({}, estado.marcas, { [id]: 'o' }) });
  // Una lectura en vivo no parte línea dentro de un color (.var): si el texto es largo, solo va en color su cabeza.
  const corto = (fn, t) => {
    if (t.length <= 26) return fn(t);
    const k = [t.indexOf(': '), t.indexOf(', ')].filter(i => i > 0).sort((a, b) => a - b)[0];
    if (k && k <= 24) return [fn(t.slice(0, k)), t.slice(k)];
    const ps = t.split(' '); let n = 1;
    while (n < ps.length && ps.slice(0, n + 1).join(' ').length <= 18) n++;
    return [fn(ps.slice(0, n).join(' ')), ' ' + ps.slice(n).join(' ')];
  };
  const base = t => ({ v: 'c-i', t }), prueba = t => ({ v: 'c-o', t }), rel = t => ({ v: 'c-d', t }), mal = t => ({ v: 'c-h', t });
  const opciones = (c, malas) => [{ id: 'c', texto: c, correcta: true }, ...malas.map(([texto, error, siFuera], k) => ({ id: `e${k}`, texto, error, siFuera }))];
  const voltear = (arr, s) => (s % 2 ? arr.slice().reverse() : arr.slice());

  // Figura: el par base arriba y, debajo, la oración puente con el par que se prueba en los huecos.
  //   puente(a, b) → [antes, entre, después]: «Un {a} trabaja con un {b} como herramienta.»
  function figura(par, partes, reserva) {
    return {
      secciones: [
        { id: 'base', titulo: 'Par base', modo: 'tarjeta', fragmentos: [{ id: 'pb', t: `${par[0]} : ${par[1]}` }] },
        { id: 'puente', titulo: 'Oración puente', modo: 'parrafo', fragmentos: [
          ...(partes[0] ? [{ id: 'p0', t: partes[0] }] : []), { id: 'a', hueco: true, reserva: reserva[0] },
          { id: 'p1', t: partes[1] }, { id: 'b', hueco: true, reserva: reserva[1] }, ...(partes[2] ? [{ id: 'p2', t: partes[2] }] : [])] },
      ],
    };
  }
  // Estado: el par probado en los huecos, la oración marcada como relación y el sello «se cumple / no se cumple».
  const probar = (a, b, cumple, color = 'o', extra = {}) => Object.assign({
    huecos: { a, b }, marcas: { pb: 'i', a: cumple ? color : 'h', b: cumple ? color : 'h', p0: 'd', p1: 'd', p2: 'd' },
    sellos: { puente: cumple ? { t: 'Se cumple', c: 'i' } : { t: 'No se cumple', c: 'h' } },
  }, extra);

  // ---------- Idea 1: la relación, no el tema (agente e instrumento; parte y todo) ----------
  // Cambia: el par que entra en la oración puente. Permanece: el par base y su oración. Progresa: se descartan los
  // pares del mismo tema que no cumplen. Se reserva: el par invertido (serrucho : carpintero), que tiene las mismas
  // palabras. Debe verse: la oración que se lee falsa con el par equivocado.
  const CARP = ['Un', 'trabaja con un', 'como herramienta.'];
  const CANDIDATOS = {
    cirujano: { a: 'cirujano', b: 'bisturí', cumple: true, dice: 'Se cumple: el bisturí es su herramienta' },
    madera: { a: 'carpintero', b: 'madera', cumple: false, dice: 'No: la madera es el material' },
    arbol: { a: 'árbol', b: 'tronco', cumple: false, dice: 'No: el tronco es una parte' },
    reves: { a: 'serrucho', b: 'carpintero', cumple: false, dice: 'No: está al revés' },
  };
  const figCarp = () => figura(['carpintero', 'serrucho'], CARP, ['carpintero', 'carpintero']);
  // El juego usa la misma figura que «Mira», con la bandeja debajo (hallazgo 9: es el mismo dibujo, más las fichas).
  const figCarpB = () => conBandeja(figCarp(), Object.entries(CANDIDATOS).map(([id, c]) => ({ id, t: `${c.a} : ${c.b}` })));
  const relacionNoTema = {
    id: 'relacion-no-tema',
    titulo: 'La relación, no el tema',
    temas: ['Agente e instrumento', 'Parte y todo'],
    pieza: 'rv-texto',
    juega: {
      consigna: 'El par base es «carpintero : serrucho». Pon otro par en la oración puente y mira si sigue siendo verdadera.',
      voz: 'La oración tiene que valer igual para los dos pares.',
      controles: [{ id: 'p', etiqueta: 'Par', opciones: Object.entries(CANDIDATOS).map(([valor, c]) => ({ valor, texto: `${c.a} : ${c.b}` })) }],
      dibujo: val => { const c = CANDIDATOS[val.p]; return { datos: figCarpB(), estado: conFicha(probar(c.a, c.b, c.cumple), val.p) }; },
      lectura: val => { const c = CANDIDATOS[val.p]; return [c.cumple ? corto(base, c.dice) : corto(mal, c.dice)]; },
      minimo: 3,
      // Arrastra la ficha por la bandeja: el par que sueltas entra en los huecos de la oración puente.
      arrastres: [ficha(figCarpB, Object.keys(CANDIDATOS))],
    },
    predice: {
      pregunta: 'Par base: «dedo : mano». ¿Qué par guarda la misma relación?',
      voz: 'Arma primero tu oración puente con el par base.',
      opciones: opciones('pétalo : flor', [
        ['guante : mano', 'RV15', 'El guante también va con la mano, pero no es una parte de ella.'],
        ['mano : dedo', 'RV16', 'Es la misma relación, pero al revés: el todo va primero.'],
        ['anillo : dedo', 'RV17', 'Anillo y dedo van juntos; el anillo se pone en el dedo, no es parte de él.'],
      ]),
      dibujo: { datos: figura(['dedo', 'mano'], ['El', 'es una parte de la', ''], ['pétalo', 'flor']), estado: { marcas: { pb: 'i' } } },
      revelar: { datos: figura(['dedo', 'mano'], ['El', 'es una parte de la', ''], ['pétalo', 'flor']), estado: probar('pétalo', 'flor', true) },
      coincide: 'Coincide: «el pétalo es una parte de la flor», igual que el dedo de la mano.',
    },
    mira: {
      datos: figCarp(),
      voz: 'La misma oración, con cada par.',
      pasos: [
        { estado: probar('carpintero', 'serrucho', true, 'i', { nuevo: ['puente'] }), texto: 'Primero, una oración que sea verdadera con el par base.', ecuacion: [base('carpintero'), ' ', rel('trabaja con'), ' ', base('serrucho')] },
        { estado: probar('carpintero', 'madera', false, 'o', { nuevo: ['a', 'b', 'puente'] }), texto: 'Mismo tema, otra relación: la madera es el material.', ecuacion: [prueba('carpintero'), ' : ', mal('madera'), ' no cumple'] },
        { estado: probar('serrucho', 'carpintero', false, 'o', { nuevo: ['a', 'b', 'puente'] }), texto: 'Las mismas palabras al revés tampoco: el orden importa.', ecuacion: [mal('serrucho'), ' : ', mal('carpintero'), ' no cumple'] },
        { estado: probar('cirujano', 'bisturí', true, 'o', { nuevo: ['a', 'b', 'puente'] }), texto: 'Otro oficio, otra herramienta: la oración sigue siendo verdadera.', ecuacion: [prueba('cirujano'), ' : ', prueba('bisturí'), ' cumple'] },
      ],
    },
    regla: {
      texto: 'Una analogía conserva la relación del par base, en el mismo orden. Se comprueba con una oración puente que sea verdadera para los dos pares.',
      ecuacion: [{ llave: [base('A'), ' : ', base('B')], nota: 'par base', color: 'c-i' }, ' :: ', { llave: [prueba('C'), ' : ', prueba('D')], nota: 'par probado', color: 'c-o' }, '   ·   ', { llave: [rel('misma oración')], nota: 'vale para ambos', color: 'c-d' }],
      condicion: 'la oración puente es precisa (herramienta, parte, material) y no basta que los pares sean del mismo tema.',
    },
    ahoraTu: {
      voz: 'Arma la oración puente antes de mirar las opciones.',
      generar(s) {
        const B = [
          { base: 'pintor : pincel', ok: 'jardinero : tijera', m: [['pintor : cuadro', 'RV17', 'El pintor hace el cuadro: es su obra, no su herramienta.'], ['pincel : pintor', 'RV16', 'Es la relación correcta, pero al revés.'], ['pintor : museo', 'RV15', 'Van juntos en el tema del arte, pero el museo no es su herramienta.']] },
          { base: 'tecla : piano', ok: 'cuerda : guitarra', m: [['piano : tecla', 'RV16', 'Es la relación correcta, pero al revés: el todo va primero.'], ['pianista : piano', 'RV17', 'El pianista usa el piano; no es una parte de él.'], ['piano : música', 'RV15', 'El piano produce música; la música no es una parte.']] },
          { base: 'pescador : red', ok: 'escritor : pluma', m: [['pescador : pez', 'RV17', 'El pez es lo que obtiene, no su instrumento.'], ['red : pescador', 'RV16', 'Es la relación correcta, pero al revés.'], ['pescador : mar', 'RV15', 'Comparten tema; el mar es el lugar, no el instrumento.']] },
          { base: 'página : libro', ok: 'vagón : tren', m: [['libro : página', 'RV16', 'Es la relación correcta, pero al revés.'], ['lector : libro', 'RV17', 'El lector usa el libro; no es una parte de él.'], ['libro : biblioteca', 'RV15', 'El libro está en la biblioteca, pero no como una parte suya.']] },
          { base: 'barbero : navaja', ok: 'agricultor : arado', m: [['barbero : barba', 'RV17', 'La barba es lo que corta; no es su instrumento.'], ['navaja : barbero', 'RV16', 'Es la relación correcta, pero al revés.'], ['barbero : peluquería', 'RV15', 'La peluquería es el lugar; comparten tema, no relación.']] },
          { base: 'rueda : bicicleta', ok: 'hoja : árbol', m: [['ciclista : bicicleta', 'RV17', 'El ciclista usa la bicicleta; no es una parte de ella.'], ['bicicleta : rueda', 'RV16', 'Es la relación correcta, pero al revés.'], ['bicicleta : pista', 'RV15', 'Comparten tema; la pista es el lugar.']] },
        ];
        const b = B[s % B.length];
        return {
          pregunta: '¿Qué par guarda la misma relación que el par base, en el mismo orden?',
          dibujo: { datos: { secciones: [{ id: 'base', titulo: 'Par base', modo: 'tarjeta', fragmentos: [{ id: 'pb', t: b.base }] }] }, estado: { marcas: { pb: 'i' } } },
          opciones: opciones(b.ok, voltear(b.m, s)),
          solucion: { texto: 'La misma oración puente vale para los dos pares, en el mismo orden.', ecuacion: [base(b.base), ' :: ', prueba(b.ok)] },
        };
      },
    },
  };

  // ---------- Idea 2: clase y miembro; causa y efecto ----------
  // Cambia: el par base (dos de clase y dos de causa). Permanece: la oración puente y su versión al revés.
  // Progresa: cada par se lee en los dos sentidos. Se reserva: la sucesión sin causa (lunes : martes), para la
  // predicción. Debe verse: que la oración al revés es falsa: la dirección es parte de la relación.
  const PARES = {
    perro: { par: ['mamífero', 'perro'], tipo: 'Género y especie', partes: ['Todo', 'es un'], ida: ['perro', 'mamífero'], vuelta: ['mamífero', 'perro'] },
    mango: { par: ['fruta', 'mango'], tipo: 'Género y especie', partes: ['Todo', 'es una'], partesV: ['Toda', 'es un'], ida: ['mango', 'fruta'], vuelta: ['fruta', 'mango'] },
    fuego: { par: ['fuego', 'humo'], tipo: 'Causa y efecto', partes: ['El', 'produce el'], ida: ['fuego', 'humo'], vuelta: ['humo', 'fuego'] },
    lluvia: { par: ['lluvia', 'barro'], tipo: 'Causa y efecto', partes: ['La', 'produce el'], partesV: ['El', 'produce la'], ida: ['lluvia', 'barro'], vuelta: ['barro', 'lluvia'] },
  };
  // Dos tarjetas con la misma oración puente: en el orden del par y al revés. Todo el texto entra por huecos
  // (los de la oración, sin recuadro), para que la misma figura sirva a las dos relaciones.
  function figDos() {
    const fr = pre => [
      { id: `${pre}0`, hueco: true, caja: false, reserva: 'Todo' }, { id: `${pre}a`, hueco: true, reserva: 'mamífero' },
      { id: `${pre}1`, hueco: true, caja: false, reserva: 'producen el' }, { id: `${pre}b`, hueco: true, reserva: 'mamífero' }];
    return { secciones: [{ id: 'ida', titulo: 'En este orden', modo: 'tarjeta', fragmentos: fr('i') }, { id: 'vuelta', titulo: 'Al revés', modo: 'tarjeta', fragmentos: fr('v') }] };
  }
  // La bandeja va arriba: así el sello de la primera tarjeta no queda bajo el botón de la lupa. «Mira» usa esta misma
  // figura (hallazgo 9): el alumno ve el dibujo que movió.
  const figDosB = () => ({ secciones: [{ id: 'bandeja', titulo: 'Pares base', modo: 'lista', fragmentos: Object.entries(PARES).map(([id, p]) => ({ id, t: `${p.par[0]} : ${p.par[1]}` })) }].concat(figDos().secciones) });
  const estadoDos = (p, extra = {}) => Object.assign({
    huecos: { i0: p.partes[0], ia: p.ida[0], i1: p.partes[1], ib: p.ida[1], v0: (p.partesV || p.partes)[0], va: p.vuelta[0], v1: (p.partesV || p.partes)[1], vb: p.vuelta[1] },
    marcas: { ia: 'i', ib: 'i', i0: 'd', i1: 'd', va: 'h', vb: 'h' },
    tachar: ['v0', 'v1'],
    sellos: { ida: { t: 'Verdadera', c: 'i' }, vuelta: { t: 'Falsa', c: 'h' } },
  }, extra);
  const claseCausa = {
    id: 'clase-y-causa',
    titulo: 'Clase y miembro, causa y efecto',
    temas: ['Género y especie', 'Causa y efecto'],
    pieza: 'rv-texto',
    juega: {
      consigna: 'Elige un par base. Mira su oración puente en el orden del par y al revés.',
      voz: 'Fíjate qué oración deja de ser verdadera al dar vuelta el par.',
      controles: [{ id: 'p', etiqueta: 'Par base', opciones: Object.entries(PARES).map(([valor, p]) => ({ valor, texto: `${p.par[0]} : ${p.par[1]}` })) }],
      dibujo: val => ({ datos: figDosB(), estado: conFicha(estadoDos(PARES[val.p]), val.p) }),
      lectura: val => [corto(rel, PARES[val.p].tipo), ': solo vale en un sentido'],
      minimo: 3,
      // Arrastra la ficha a otro par base: las dos tarjetas lo leen en el orden del par y al revés.
      arrastres: [ficha(figDosB, Object.keys(PARES), 'ficha del par base')],
    },
    predice: {
      pregunta: 'Par base: «incendio : cenizas». ¿Qué par guarda la misma relación?',
      opciones: opciones('golpe : moretón', [
        ['lunes : martes', 'RVA1', 'Martes viene después del lunes, pero el lunes no lo produce: es solo orden.'],
        ['cenizas : incendio', 'RV16', 'Es la misma relación, pero al revés: la causa va primero.'],
        ['bombero : incendio', 'RV15', 'Bombero e incendio van juntos en el tema; el bombero no lo produce.'],
      ]),
      dibujo: { datos: figDos(), estado: { huecos: { i0: 'El', ia: 'incendio', i1: 'produce las', ib: 'cenizas', v0: 'Las', va: 'cenizas', v1: 'producen el', vb: 'incendio' }, marcas: { ia: 'i', ib: 'i' } } },
      revelar: { datos: figDos(), estado: estadoDos({ partes: ['El', 'produce el'], ida: ['golpe', 'moretón'], vuelta: ['moretón', 'golpe'] }) },
      coincide: 'Coincide: el golpe produce el moretón, como el incendio produce las cenizas.',
    },
    mira: {
      datos: figDosB(),
      voz: 'Dos relaciones, la misma prueba de dirección.',
      pasos: [
        { estado: { huecos: { i0: 'Todo', ia: 'perro', i1: 'es un', ib: 'mamífero' }, marcas: { ia: 'i', ib: 'i', i0: 'd', i1: 'd' }, sellos: { ida: { t: 'Verdadera', c: 'i' } }, tapar: ['v0', 'va', 'v1', 'vb'], nuevo: ['ida'] }, texto: 'Todo perro es un mamífero: el perro es una clase dentro de otra.', ecuacion: [base('especie'), ' ⊂ ', base('género')] },
        { estado: estadoDos(PARES.perro, { nuevo: ['vuelta', 'va', 'vb'] }), texto: 'Al revés es falso: no todo mamífero es un perro.', ecuacion: [mal('género'), ' ⊄ ', mal('especie')] },
        { estado: estadoDos(PARES.fuego, { nuevo: ['ida', 'vuelta'] }), texto: 'La causa produce el efecto; el efecto no produce la causa.', ecuacion: [base('causa'), ' → ', base('efecto')] },
        { estado: { huecos: { i0: 'El', ia: 'lunes', i1: 'produce el', ib: 'martes' }, marcas: { ia: 'h', ib: 'h' }, tachar: ['i0', 'i1'], tapar: ['v0', 'va', 'v1', 'vb'], sellos: { ida: { t: 'Solo viene antes', c: 'h' } }, nuevo: ['ida'] }, texto: 'Que algo venga después no basta: el lunes no produce el martes.', ecuacion: [mal('después'), ' ≠ ', base('causa')] },
      ],
    },
    regla: {
      texto: 'En género y especie, todo miembro pertenece a la clase, pero no al revés. En causa y efecto, el primero produce el segundo; venir antes no basta.',
      ecuacion: [{ llave: [base('especie'), ' es un ', base('género')], nota: 'no al revés', color: 'c-i' }, '   ·   ', base('causa'), ' ', { llave: [rel('produce')], nota: 'no solo antes', color: 'c-d' }, ' ', base('efecto')],
      condicion: 'el par de la opción va en el mismo orden que el par base y la oración puente es verdadera así.',
    },
    ahoraTu: {
      generar(s) {
        const B = [
          { base: 'ave : cóndor', ok: 'reptil : lagartija', m: [['cóndor : ave', 'RV16', 'Es la misma relación, pero al revés: la clase va primero.'], ['ave : nido', 'RV17', 'El ave hace el nido; el nido no es una clase de ave.'], ['ave : pluma', 'RV17', 'La pluma es una parte del ave, no un tipo de ave.']] },
          { base: 'virus : gripe', ok: 'chispa : incendio', m: [['gripe : virus', 'RV16', 'Es la misma relación, pero al revés: la causa va primero.'], ['virus : médico', 'RV15', 'Comparten el tema de la salud; el virus no produce al médico.'], ['enero : febrero', 'RVA1', 'Febrero viene después, pero enero no lo produce.']] },
          { base: 'instrumento : quena', ok: 'herramienta : martillo', m: [['quena : instrumento', 'RV16', 'Es la misma relación, pero al revés.'], ['quena : músico', 'RV17', 'El músico toca la quena; no es un tipo de quena.'], ['instrumento : concierto', 'RV15', 'Comparten tema, pero el concierto no es un tipo de instrumento.']] },
          { base: 'estudio : aprobación', ok: 'ejercicio : fuerza', m: [['aprobación : estudio', 'RV16', 'Es la misma relación, pero al revés.'], ['estudio : cuaderno', 'RV17', 'El cuaderno sirve para estudiar; no es un efecto del estudio.'], ['mañana : tarde', 'RVA1', 'La tarde viene después de la mañana, pero no es su efecto.']] },
          { base: 'mueble : mesa', ok: 'calzado : sandalia', m: [['mesa : mueble', 'RV16', 'Es la misma relación, pero al revés.'], ['mesa : pata', 'RV17', 'La pata es una parte de la mesa, no un tipo.'], ['mueble : carpintero', 'RV15', 'El carpintero hace muebles; no es un tipo de mueble.']] },
          { base: 'helada : pérdida de cosecha', ok: 'erosión : derrumbe', m: [['pérdida de cosecha : helada', 'RV16', 'Es la misma relación, pero al revés.'], ['helada : invierno', 'RV17', 'La helada ocurre en invierno; no lo produce.'], ['siembra : cosecha', 'RVA1', 'La cosecha viene después de la siembra; aquí el par base es un daño causado.']] },
        ];
        const b = B[s % B.length];
        return {
          pregunta: '¿Qué par guarda la misma relación que el par base, en el mismo orden?',
          dibujo: { datos: { secciones: [{ id: 'base', titulo: 'Par base', modo: 'tarjeta', fragmentos: [{ id: 'pb', t: b.base }] }] }, estado: { marcas: { pb: 'i' } } },
          opciones: opciones(b.ok, voltear(b.m, s)),
          solucion: { texto: 'Misma relación y mismo orden: la oración puente vale para los dos.', ecuacion: [base(b.base), ' :: ', prueba(b.ok)] },
        };
      },
    },
  };

  // ---------- Idea 3: sinónimos y antónimos se miden en un rasgo ----------
  // Cambia: la palabra que se compara con «alegre». Permanece: la palabra base. Progresa: de compartir el rasgo
  // (sinónimo) a oponerse en él (antónimo). Se reserva: «cansado», distinto pero no opuesto. Debe verse: el rasgo
  // que se compara (el ánimo).
  const ALEGRE = {
    contento: { b: 'contento', rel: 'Sinonimia', puente: ['', 'significa casi lo mismo que', ''], ok: true },
    triste: { b: 'triste', rel: 'Antonimia', puente: ['', 'es lo contrario, en el ánimo, de', ''], ok: true },
    cansado: { b: 'cansado', rel: 'Ninguna: otro rasgo', puente: ['', 'es lo contrario, en el ánimo, de', ''], ok: false },
    risa: { b: 'risa', rel: 'Ninguna: otra clase de palabra', puente: ['', 'significa casi lo mismo que', ''], ok: false },
  };
  const figAleg = (p, otra = '?') => figura(['alegre', otra], p, ['alegre', 'contento']);
  const figAlegB = k => conBandeja(figAleg(ALEGRE[k].puente, ALEGRE[k].b), Object.entries(ALEGRE).map(([id, c]) => ({ id, t: c.b })), 'Palabras para comparar');
  const estAleg = (k, extra = {}) => { const c = ALEGRE[k]; return probar('alegre', c.b, c.ok, 'o', Object.assign({ marcas: { pb: 'i', a: 'i', b: c.ok ? 'o' : 'h', p0: 'd', p1: 'd', p2: 'd' } }, extra)); };
  const sinAnt = {
    id: 'sinonimo-antonimo',
    titulo: 'Sinónimos y antónimos en un rasgo',
    temas: ['Sinonimia y antonimia'],
    pieza: 'rv-texto',
    juega: {
      consigna: 'Compara «alegre» con otras palabras. Mira qué oración puente queda verdadera y qué rasgo comparan.',
      voz: 'Lo contrario se mide siempre en el mismo rasgo.',
      controles: [{ id: 'p', etiqueta: 'Palabra', opciones: Object.entries(ALEGRE).map(([valor, c]) => ({ valor, texto: c.b })) }],
      dibujo: val => ({ datos: figAlegB(val.p), estado: conFicha(estAleg(val.p, { huecos: { a: 'alegre', b: ALEGRE[val.p].b } }), val.p) }),
      // Arrastra la ficha a otra palabra: entra en la oración puente junto a «alegre».
      arrastres: [ficha(val => figAlegB(val.p), Object.keys(ALEGRE), 'ficha de la palabra')],
      lectura: val => ['Relación: ', ALEGRE[val.p].ok ? corto(rel, ALEGRE[val.p].rel) : corto(mal, ALEGRE[val.p].rel)],
      minimo: 3,
    },
    predice: {
      pregunta: 'Par base: «rápido : lento». ¿Qué par guarda la misma relación?',
      opciones: opciones('subir : bajar', [
        ['rápido : veloz', 'RV17', 'Comparten el rasgo; serían la analogía si el par base fuera de sinónimos.'],
        ['lento : tortuga', 'RV15', 'La tortuga se asocia con lo lento, pero no es lo contrario de nada.'],
        ['rápido : cansado', 'RV21', 'Son distintos, pero no opuestos: cansado mide otro rasgo.'],
      ]),
      dibujo: { datos: figura(['rápido', 'lento'], ['', 'es lo contrario de', ''], ['subir', 'bajar']), estado: { marcas: { pb: 'i' } } },
      revelar: { datos: figura(['rápido', 'lento'], ['', 'es lo contrario de', ''], ['subir', 'bajar']), estado: probar('subir', 'bajar', true) },
      coincide: 'Coincide: los dos pares se oponen dentro de un mismo rasgo (rapidez, dirección).',
    },
    mira: {
      datos: figAleg(['', 'comparado en el ánimo con', '']),
      pasos: [
        { estado: estAleg('contento', { huecos: { a: 'alegre', b: 'contento' }, nuevo: ['b'] }), texto: 'Sinónimos: los dos dicen casi lo mismo del ánimo.', ecuacion: [base('alegre'), ' ≈ ', prueba('contento')] },
        { estado: estAleg('triste', { huecos: { a: 'alegre', b: 'triste' }, nuevo: ['b'] }), texto: 'Antónimos: se oponen en el mismo rasgo, el ánimo.', ecuacion: [base('alegre'), ' ↔ ', prueba('triste')] },
        { estado: estAleg('cansado', { huecos: { a: 'alegre', b: 'cansado' }, nuevo: ['b', 'puente'] }), texto: '«Cansado» es distinto, pero mide la energía: no es el opuesto.', ecuacion: [mal('cansado'), ': otro rasgo'] },
      ],
    },
    regla: {
      texto: 'Los sinónimos comparten un rasgo de significado; los antónimos se oponen dentro del mismo rasgo. Ser distintas no hace contrarias a dos palabras.',
      ecuacion: [{ llave: [base('A'), ' ≈ ', prueba('B')], nota: 'mismo rasgo', color: 'c-i' }, '   ·   ', { llave: [base('A'), ' ↔ ', prueba('B')], nota: 'rasgo opuesto', color: 'c-o' }],
      condicion: 'se nombra el rasgo que se compara (ánimo, temperatura, tamaño) y las dos palabras hablan de él.',
    },
    ahoraTu: {
      generar(s) {
        const B = [
          { base: 'caliente : frío', ok: 'claro : oscuro', m: [['caliente : tibio', 'RV21', 'Están en el mismo rasgo, pero tibio es un punto medio, no el opuesto.'], ['frío : hielo', 'RV15', 'El hielo se asocia con el frío, pero no es su contrario.'], ['caliente : ardiente', 'RV17', 'Comparten el rasgo: serían sinónimos, no contrarios.']] },
          { base: 'generoso : dadivoso', ok: 'astuto : sagaz', m: [['generoso : tacaño', 'RV17', 'Se oponen en el mismo rasgo: serían antónimos, no sinónimos.'], ['generoso : regalo', 'RV15', 'Comparten tema, pero regalo no es un rasgo de una persona.'], ['generoso : alto', 'RV21', 'Son de otro rasgo; no significan lo mismo.']] },
          { base: 'ancho : angosto', ok: 'pesado : liviano', m: [['ancho : amplio', 'RV17', 'Comparten el rasgo: serían sinónimos.'], ['ancho : largo', 'RV21', 'Son distintos, pero miden otra dimensión; no son opuestos.'], ['angosto : callejón', 'RV15', 'Un callejón suele ser angosto; no es su contrario.']] },
          { base: 'comenzar : iniciar', ok: 'terminar : concluir', m: [['comenzar : terminar', 'RV17', 'Se oponen: serían antónimos, no sinónimos.'], ['comenzar : carrera', 'RV15', 'Una carrera comienza, pero no significa comenzar.'], ['comenzar : correr', 'RV21', 'Son acciones distintas; no significan lo mismo.']] },
          { base: 'valiente : cobarde', ok: 'honesto : mentiroso', m: [['valiente : audaz', 'RV17', 'Comparten el rasgo: serían sinónimos.'], ['valiente : héroe', 'RV15', 'Un héroe suele ser valiente; no es su contrario.'], ['valiente : tímido', 'RV21', 'Tímido habla del trato con otros, no del miedo al peligro.']] },
          { base: 'escaso : abundante', ok: 'vacío : lleno', m: [['escaso : poco', 'RV17', 'Comparten el rasgo: serían sinónimos.'], ['escaso : sequía', 'RV15', 'En una sequía el agua es escasa; no es su contrario.'], ['escaso : pequeño', 'RV21', 'Pequeño mide tamaño, no cantidad.']] },
        ];
        const b = B[s % B.length];
        return {
          pregunta: '¿Qué par guarda la misma relación que el par base?',
          dibujo: { datos: { secciones: [{ id: 'base', titulo: 'Par base', modo: 'tarjeta', fragmentos: [{ id: 'pb', t: b.base }] }] }, estado: { marcas: { pb: 'i' } } },
          opciones: opciones(b.ok, voltear(b.m, s)),
          solucion: { texto: 'Se nombra el rasgo y se mira si comparten o se oponen en él.', ecuacion: [base(b.base), ' :: ', prueba(b.ok)] },
        };
      },
    },
  };

  // ---------- Laboratorio: el taller de la oración puente ----------
  // Más rico que los juegos: seis relaciones a la vez y ocho fichas, entre ellas una invertida (flor : pétalo) y una
  // sucesión sin causa (lunes : martes). Si se cumple lo decide el código (regla 1) con la relación y el orden de cada
  // ficha; «cumplen n de 8» cuenta, para la relación elegida, cuántas fichas la cumplen en ese orden.
  const RELS = {
    herramienta: { texto: 'Herramienta', partes: ['', 'trabaja con', ''] },
    parte: { texto: 'Parte y todo', partes: ['', 'es una parte de', ''] },
    especie: { texto: 'Especie y clase', partes: ['', 'es un tipo de', ''] },
    causa: { texto: 'Causa', partes: ['', 'produce', ''] },
    sinonimo: { texto: 'Sinónimos', partes: ['', 'significa casi lo mismo que', ''] },
    antonimo: { texto: 'Antónimos', partes: ['', 'es lo contrario de', ''] },
  };
  const FICHAS = {
    cirujano: { a: 'cirujano', b: 'bisturí', rel: 'herramienta' },
    petalo: { a: 'pétalo', b: 'flor', rel: 'parte' },
    flor: { a: 'flor', b: 'pétalo', rel: 'parte', alReves: true },
    condor: { a: 'cóndor', b: 'ave', rel: 'especie' },
    chispa: { a: 'chispa', b: 'incendio', rel: 'causa' },
    lunes: { a: 'lunes', b: 'martes', rel: null },
    alegre: { a: 'alegre', b: 'contento', rel: 'sinonimo' },
    frio: { a: 'frío', b: 'caliente', rel: 'antonimo' },
  };
  const veredicto = (r, k) => { const f = FICHAS[k]; return f.rel !== r ? 'no' : f.alReves ? 'reves' : 'si'; };
  // Las fichas van arriba y la oración debajo: el sello de la oración no choca con el botón de la lupa.
  const figTaller = r => ({ secciones: [
    { id: 'bandeja', titulo: 'Fichas', modo: 'lista', fragmentos: Object.entries(FICHAS).map(([id, f]) => ({ id, t: `${f.a} : ${f.b}` })) },
    { id: 'puente', titulo: 'Oración puente', modo: 'tarjeta', fragmentos: [
      { id: 'a', hueco: true, reserva: 'cirujano' }, { id: 'p1', t: RELS[r].partes[1] }, { id: 'b', hueco: true, reserva: 'incendio' }] },
  ] });
  const SELLO = { si: { t: 'Se cumple', c: 'i' }, reves: { t: 'Solo al revés', c: 'h' }, no: { t: 'No se cumple', c: 'h' } };
  const mesaTaller = {
    id: 'taller', titulo: 'El taller de la oración puente', pieza: 'rv-texto',
    consigna: 'Elige una relación y arrastra la ficha por la bandeja. Mira con qué pares la oración queda verdadera.',
    voz: 'Una ficha puede cumplir otra relación, o la misma al revés.',
    controles: [
      { id: 'r', etiqueta: 'Relación', opciones: Object.entries(RELS).map(([valor, x]) => ({ valor, texto: x.texto })) },
      { id: 'p', etiqueta: 'Ficha', opciones: Object.entries(FICHAS).map(([valor, f]) => ({ valor, texto: `${f.a} : ${f.b}` })) },
    ],
    dibujo: val => {
      const f = FICHAS[val.p], v = veredicto(val.r, val.p), ok = v === 'si';
      const marcas = { a: ok ? 'o' : 'h', b: ok ? 'o' : 'h', p1: 'd', p2: 'd', [val.p]: 'o' };
      return { datos: figTaller(val.r), estado: { huecos: { a: f.a, b: f.b }, marcas, sellos: { puente: SELLO[v] } } };
    },
    lectura: val => {
      const v = veredicto(val.r, val.p), n = Object.keys(FICHAS).filter(k => veredicto(val.r, k) === 'si').length;
      return [rel(RELS[val.r].texto), ': ', v === 'si' ? base(SELLO[v].t) : mal(SELLO[v].t), ` · cumplen ${n} de 8`];
    },
    arrastres: [ficha(val => figTaller(val.r), Object.keys(FICHAS), 'ficha que entra en la oración')],
  };

  return {
    unidad: 'razonamiento-verbal.analogias',
    version: '0.2.0',
    estado: 'completa',
    requiere: ['/nucleo/kit/piezas/rv-texto.js'],
    historia: {
      texto: 'En la Poética, Aristóteles describió la analogía como una relación entre dos términos que se parece a la relación entre otros dos. Quería explicar las metáforas, no armar exámenes. Su idea obliga a mirar la relación y su dirección, y no solo el parecido entre las palabras.',
      pregunta: '¿Qué tienen en común un carpintero y un cirujano?',
      fuente: { titulo: 'Matriz de teoría de razonamiento verbal (Aristóteles, Poética)', url: 'https://cvc.cervantes.es/ensenanza/biblioteca_ele/diccio_ele/diccionario/comprensionlectora.htm' },
    },
    laboratorio: [
      mesaTaller,
      Object.assign({ id: 'en-dos-sentidos', titulo: 'En los dos sentidos', pieza: 'rv-texto' }, claseCausa.juega),
      Object.assign({ id: 'un-rasgo', titulo: 'Sinónimos y antónimos', pieza: 'rv-texto' }, sinAnt.juega),
    ],
    ideas: [relacionNoTema, claseCausa, sinAnt],
  };
});
