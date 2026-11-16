/*
 * Teoría de «Precisión léxica y sentido contextual» (razonamiento-verbal.sentido-contextual). Molde: docs/teoria.md.
 * Contenido: matriz de verbal (unidad 3), historia (Diccionario de autoridades, 1726–1739) y códigos RV18–RV21.
 * Oraciones propias (regla 5). Ruta A · Argumentar: se cambia la palabra en la oración y se marca la pista que decide.
 *
 * Ficha de tarea:
 *   Promesa: elegir la palabra que conserva el sentido de esta oración, no el de la primera acepción que se recuerda.
 *   Persona y condiciones: postulante de 3.º a 5.º, celular, sin audio; sinónimos y antónimos en contexto (UNI, UNMSM).
 *   Resultado observable: escoge un reemplazo y señala la pista de la oración que descarta el otro.
 *   Orden de atención: 1.º la oración · 2.º la pista marcada · 3.º el reemplazo en el hueco · acción: cambiar uno.
 *   Estados: el reemplazo encaja (o) · no encaja (h) · la pista se marca (i).
 *   Duda que resuelve: ¿por qué «helada» no sirve como sinónimo de «fría» en «su respuesta fue fría»?
 *
 * Colores (regla 4): la pista del contexto i (turquesa, continuo), la palabra que se prueba o (naranja,
 * discontinuo), el rasgo o valoración que se compara d (verde, punteado), lo que no encaja h (rojo).
 * Códigos: RV18 (acepción más frecuente), RV19 (mismo campo, no sinónimo), RV20 (parónimo), RV21 (contrario de
 * otro rasgo); RVL1–RVL4 son hipótesis nuevas (ver el reporte).
 */
(function (root, fabrica) {
  const def = fabrica(typeof module === 'object' && module.exports ? require('../../../nucleo/kit/kit.js') : root.Kit);
  if (typeof module === 'object' && module.exports) module.exports = def;
  else root.Teoria.unidad(def);
})(typeof self !== 'undefined' ? self : this, function (Kit) {
  'use strict';
  // Gesto directo (docs/teoria.md §4b): la figura trae un banco de palabras; el alumno arrastra el marcador a la
  // palabra que quiere probar y esa entra al hueco. La manija va al centro de la palabra (rv-texto.ancla) y salta a la
  // más cercana al dedo (rv-texto.cercana); los botones del control son la alternativa sin arrastre.
  const RV = () => Kit.piezas['rv-texto'];
  const banco = (ws, titulo = 'Prueba con') => ({ id: 'banco', titulo, modo: 'parrafo', fragmentos: ws.map(w => ({ id: `p-${w}`, t: w })) });
  const conBanco = (datos, ws, titulo) => ({ esquinaLibre: true, secciones: datos.secciones.concat([banco(ws, titulo)]) });
  // Manija sobre el banco: mueve el control `id` (sus valores son las palabras del banco).
  const tomaPalabra = (id, datosDe, ws, etiqueta) => ({
    id: 'palabra', etiqueta, color: 'c-o',
    donde: val => RV().ancla(datosDe(val), `p-${val[id]}`),
    mover: (pt, val) => ({ [id]: RV().cercana(datosDe(val), pt, ws.map(w => `p-${w}`)).slice(2) }),
  });
  // Una lectura en vivo no parte línea dentro de un color (.var): si el texto es largo, solo va en color su cabeza.
  const corto = (fn, t) => {
    // El trozo de color no se parte: con 14 letras o menos cabe en la miniatura de un caso guardado del laboratorio.
    if (t.length <= 14) return fn(t);
    const k = [t.indexOf(': '), t.indexOf(', ')].filter(i => i > 0).sort((a, b) => a - b)[0];
    if (k && k <= 14) return [fn(t.slice(0, k)), t.slice(k)];
    const ps = t.split(' '); let n = 1;
    while (n < ps.length && ps.slice(0, n + 1).join(' ').length <= 14) n++;
    return [fn(ps.slice(0, n).join(' ')), ' ' + ps.slice(n).join(' ')];
  };
  const pista = t => ({ v: 'c-i', t }), palabra = t => ({ v: 'c-o', t }), rasgo = t => ({ v: 'c-d', t }), mal = t => ({ v: 'c-h', t });
  const opciones = (c, malas) => [{ id: 'c', texto: c, correcta: true }, ...malas.map(([texto, error, siFuera], k) => ({ id: `e${k}`, texto, error, siFuera }))];
  const voltear = (arr, s) => (s % 2 ? arr.slice().reverse() : arr.slice());
  // Una oración partida en trozos: [texto, 'pista'] marca la pista; null es el hueco de la palabra.
  //   oracion([['El agua del'], ['lago', 'pista'], ['estaba'], null, ['.']], 'distante')
  function oracion(partes, reserva, titulo = 'Oración') {
    let k = 0;
    return { esquinaLibre: true, secciones: [{ id: 'o', titulo, modo: 'tarjeta', fragmentos: partes.map(p => (p === null ? { id: 'w', hueco: true, reserva } : { id: `t${k++}`, t: p[0], pista: p[1] === 'pista' })) }] };
  }
  const pistas = datos => datos.secciones[0].fragmentos.filter(f => f.pista).map(f => f.id);
  const marcar = (datos, ids, color = 'i') => Object.fromEntries(ids.map(id => [id, color]));
  // Ahora tú: oración con la palabra subrayada (sin hueco) y las pistas sin marcar: el alumno las busca.
  function tarjeta(texto, palabraClave) {
    const [antes, despues] = texto.split(palabraClave);
    return { datos: { esquinaLibre: true, secciones: [{ id: 'o', titulo: 'Oración', modo: 'tarjeta', fragmentos: [{ id: 'a', t: antes.trim() }, { id: 'w', t: palabraClave }, ...(despues.trim() ? [{ id: 'b', t: despues.trim() }] : [])] }] }, estado: { marcas: { w: 'o' } } };
  }

  // Bancos de «Ahora tú» (sin cambios); «Así se resuelve» toma de aquí otro caso que el de la misma semilla.
  const BANCO_ACEP = [
    { o: 'El discurso del alcalde fue pesado: duró dos horas y la gente se iba durmiendo.', w: 'pesado', pide: 'sinónimo', ok: 'aburrido', m: [['denso de carga', 'RV18', 'Sirve si se habla de peso físico; aquí se habla de un discurso.'], ['grave', 'RV19', 'Es del mismo campo, pero aquí no se trata de seriedad.'], ['pensado', 'RV20', 'Se parece por la forma, pero significa otra cosa.']] },
    { o: 'Es un alumno brillante: entiende rápido y explica bien a sus compañeros.', w: 'brillante', pide: 'antónimo', ok: 'torpe', m: [['opaco de color', 'RV18', 'Sería el contrario si se hablara de luz; aquí es inteligencia.'], ['callado', 'RV21', 'Es distinto, pero habla de cuánto conversa, no de cuánto entiende.'], ['talentoso', 'RV17', 'Va en el mismo sentido que brillante: sería un sinónimo.']] },
    { o: 'La crítica fue dura: señaló cada error sin reconocer ningún acierto.', w: 'dura', pide: 'sinónimo', ok: 'severa', m: [['sólida', 'RV18', 'Sirve para un material; aquí se habla de una crítica.'], ['larga', 'RV19', 'La crítica pudo ser larga, pero eso no es lo que dice «dura».'], ['durable', 'RV20', 'Se parece por la forma, pero significa que dura mucho.']] },
    { o: 'El precio del pasaje está alto: cuesta el doble que el mes pasado.', w: 'alto', pide: 'antónimo', ok: 'barato', m: [['bajo de estatura', 'RV18', 'Sería el contrario si se hablara de altura; aquí es el precio.'], ['caro', 'RV17', 'Va en el mismo sentido que alto: sería un sinónimo.'], ['lejano', 'RV21', 'Es distinto, pero mide distancia, no precio.']] },
    { o: 'Su explicación fue clara: todos la entendieron a la primera.', w: 'clara', pide: 'antónimo', ok: 'confusa', m: [['oscura de color', 'RV18', 'Sería el contrario en luz o color; aquí es una explicación.'], ['corta', 'RV21', 'Es distinto, pero mide extensión, no comprensión.'], ['sencilla', 'RV17', 'Va en el mismo sentido que clara: sería un sinónimo.']] },
    { o: 'Fue un golpe duro para la familia perder la cosecha de todo el año.', w: 'golpe', pide: 'sinónimo', ok: 'desgracia', m: [['puñete', 'RV18', 'Sirve para un golpe con la mano; aquí es una pérdida.'], ['ruido', 'RV19', 'Un golpe puede sonar, pero aquí no se habla de sonido.'], ['gopel', 'RV20', 'Solo se parece por las letras.']] },
  ];
  const BANCO_VALOR = [
    { o: 'El vecino es tacaño: nunca invita nada.', w: 'tacaño', ok: 'ahorrativo', pide: 'elogie', m: [['avaro', 'RVL2', 'Describe lo mismo, pero también critica: no cambia la valoración.'], ['generoso', 'RVL1', 'Cambia la conducta: un generoso sí invita.'], ['callado', 'RV19', 'Describe otra cosa: cuánto habla, no cuánto gasta.']] },
    { o: 'La casa es vieja: la construyeron hace cien años.', w: 'vieja', ok: 'antigua', pide: 'valore mejor', m: [['ruinosa', 'RVL2', 'Agrega una crítica: describe deterioro, no solo edad.'], ['nueva', 'RVL1', 'Cambia lo que describe: la casa ya no tendría cien años.'], ['grande', 'RV19', 'Describe otra cosa: tamaño, no edad.']] },
    { o: 'Mi primo es curioso: pregunta por todo lo que ve.', w: 'curioso', ok: 'entrometido', pide: 'critique', m: [['interesado en aprender', 'RVL2', 'Describe lo mismo, pero lo elogia: no lo critica.'], ['indiferente', 'RVL1', 'Cambia la conducta: alguien indiferente no pregunta.'], ['alto', 'RV19', 'Describe otra cosa: estatura.']] },
    { o: 'El líder fue firme: no cambió su decisión.', w: 'firme', ok: 'obstinado', pide: 'critique', m: [['decidido', 'RVL2', 'Describe lo mismo con elogio: no lo critica.'], ['dudoso', 'RVL1', 'Cambia la conducta: un dudoso sí cambiaría.'], ['joven', 'RV19', 'Describe otra cosa: edad.']] },
    { o: 'La comida estaba picante: tenía mucho ají.', w: 'picante', ok: 'sabrosa y picante', pide: 'elogie', m: [['incomible de tanto ají', 'RVL2', 'Describe el ají con crítica, no con elogio.'], ['sin ají', 'RVL1', 'Cambia lo que describe: ya no tendría ají.'], ['fría', 'RV19', 'Describe otra cosa: temperatura.']] },
    { o: 'El niño es inquieto: no se queda sentado.', w: 'inquieto', ok: 'activo', pide: 'valore mejor', m: [['revoltoso', 'RVL2', 'Describe lo mismo, pero sigue siendo una crítica.'], ['tranquilo', 'RVL1', 'Cambia la conducta: un niño tranquilo sí se queda sentado.'], ['pequeño', 'RV19', 'Describe otra cosa: tamaño o edad.']] },
  ];
  const BANCO_PRECISA = [
    { o: 'El jurado ___ al ganador del concurso de cuentos.', ok: 'eligió', m: [['tuvo', 'RVL3', '«Tuvo» encaja, pero no dice qué hizo el jurado.'], ['escribió', 'RV19', 'Es del campo de los cuentos, pero el jurado no escribe al ganador.'], ['perdió', 'RV23', 'Choca con la oración: un jurado decide al ganador.']] },
    { o: 'La doctora ___ una dieta sin sal a su paciente.', ok: 'recetó', m: [['dio', 'RVL3', '«Dio» encaja, pero es vago: no dice que fue una indicación médica.'], ['cocinó', 'RV19', 'Es del campo de la comida, pero la doctora no la prepara.'], ['prohibió', 'RV23', 'Choca: lo que prohíbe es la sal, no la dieta sin sal.']] },
    { o: 'El alcalde ___ la nueva plaza en la ceremonia del domingo.', ok: 'inauguró', m: [['hizo', 'RVL3', '«Hizo» encaja, pero no dice qué pasó en la ceremonia.'], ['barrió', 'RV19', 'Es algo que se hace en una plaza, pero no en una ceremonia.'], ['cerró', 'RV23', 'Choca con «nueva»: una plaza nueva se abre.']] },
    { o: 'Los vecinos ___ dinero para arreglar la pista del barrio.', ok: 'reunieron', m: [['pusieron cosas', 'RVL3', 'Es vago: «cosas» no precisa qué aportaron.'], ['gastaron', 'RV23', 'Choca: primero hay que juntar el dinero para arreglarla.'], ['contaron', 'RV19', 'Es del campo del dinero, pero no dice que lo juntaran.']] },
    { o: 'La profesora ___ las dudas de los alumnos una por una.', ok: 'resolvió', m: [['vio', 'RVL3', '«Vio» encaja, pero no dice que las aclarara.'], ['tuvo', 'RV23', 'Las dudas son de los alumnos, no de la profesora.'], ['dictó', 'RV19', 'Es del campo de la clase, pero no se dictan dudas.']] },
    { o: 'El río ___ los campos después de tres días de lluvia.', ok: 'inundó', m: [['hizo algo en', 'RVL3', 'Es vago: no dice qué le pasó a los campos.'], ['regó', 'RV23', 'Encaja con campos, pero choca con tres días de lluvia: es exceso.'], ['cruzó', 'RV19', 'Un río cruza un valle, pero eso no es lo que causa la lluvia.']] },
  ];
  const BANCO_PISTA = [
    { o: 'El camino era sinuoso: daba tantas curvas que el bus iba muy despacio.', w: 'sinuoso', ok: 'Con muchas curvas', m: [['Peligroso', 'RVL4', 'Se asocia con un camino difícil, pero la pista dice curvas.'], ['Largo', 'RVL4', 'Un camino así puede ser largo, pero la pista habla de curvas.'], ['Recto', 'RV34', 'Es lo contrario de lo que dice la pista.']] },
    { o: 'Era un hombre locuaz; en cambio, su hermano casi no hablaba.', w: 'locuaz', ok: 'Que habla mucho', m: [['Que es callado', 'RV24', 'Eso describe al hermano: «en cambio» marca lo contrario.'], ['Que está loco', 'RV20', 'Se parece por la forma, pero la pista habla de hablar.'], ['Que es amable', 'RVL4', 'Puede serlo, pero la oración no habla de eso.']] },
    { o: 'La planta es perenne: conserva sus hojas verdes durante todo el año.', w: 'perenne', ok: 'Que dura todo el año', m: [['Que da flores', 'RVL4', 'Es una idea de plantas, pero la pista habla de hojas todo el año.'], ['Que pierde sus hojas', 'RV34', 'Es lo contrario de lo que dice la pista.'], ['Que es grande', 'RVL4', 'La oración no habla del tamaño.']] },
    { o: 'Su letra era ilegible: ni la profesora pudo entender lo que escribió.', w: 'ilegible', ok: 'Que no se puede leer', m: [['Que es bonita', 'RVL4', 'La oración no la valora así; dice que no se entendía.'], ['Que es ilegal', 'RV20', 'Se parece por la forma, pero la pista habla de leer.'], ['Que es pequeña', 'RVL4', 'Podría ser una causa, pero la pista dice que no se entendía.']] },
    { o: 'Fue un error garrafal: por él, el puente se cayó a la semana.', w: 'garrafal', ok: 'Muy grave', m: [['Pequeño', 'RV34', 'La consecuencia, un puente caído, dice lo contrario.'], ['Gracioso', 'RVL4', 'Nada en la oración lo toma como broma.'], ['Escondido', 'RVL4', 'La oración no habla de si se veía o no.']] },
    { o: 'El agua del pozo es potable: la familia la toma sin hervirla y nunca se enferma.', w: 'potable', ok: 'Que se puede beber', m: [['Que es caliente', 'RVL4', 'Al contrario: la toman sin hervirla.'], ['Que es abundante', 'RVL4', 'La oración no dice cuánta agua hay.'], ['Que está sucia', 'RV34', 'Es lo contrario de lo que dice la pista.']] },
  ];
  // Así se resuelve: lo que cada caso del banco necesita para contarse paso a paso (acepción, valoración, partes que
  // deciden, tipo de pista). Es dato del banco, como sus opciones; «Ahora tú» no lo usa.
  const ACEPCION = { pesado: 'aburrimiento', brillante: 'inteligencia', dura: 'severidad', alto: 'precio', clara: 'comprensión', golpe: 'una pérdida que duele' };
  const VALORA = {
    tacaño: ['no gasta ni invita', 'lo critica', 'lo elogia'], vieja: ['tiene muchos años', 'algo despectiva', 'la valora mejor'],
    curioso: ['pregunta por todo', 'casi neutra', 'lo critica'], firme: ['no cambia su decisión', 'lo elogia', 'lo critica'],
    picante: ['tiene mucho ají', 'neutra', 'la elogia'], inquieto: ['no se queda sentado', 'algo despectiva', 'lo valora mejor'],
  };
  const DECIDE = { eligió: 'al ganador del concurso', recetó: 'una dieta sin sal a su paciente', inauguró: 'la nueva plaza en la ceremonia', reunieron: 'dinero para arreglar la pista', resolvió: 'las dudas de los alumnos', inundó: 'después de tres días de lluvia' };
  const TIPO_PISTA = { sinuoso: 'una consecuencia', locuaz: 'un contraste', perenne: 'una explicación', ilegible: 'una consecuencia', garrafal: 'una consecuencia', potable: 'una consecuencia' };
  function azar(s) {
    let q = (s * 2654435761 + 12345) >>> 0;
    return () => { q = (q + 0x6D2B79F5) >>> 0; let z = q; z = Math.imul(z ^ (z >>> 15), z | 1); z ^= z + Math.imul(z ^ (z >>> 7), z | 61); return ((z ^ (z >>> 14)) >>> 0) / 4294967296; };
  }
  // Índice de «Así se resuelve»: sale de azar(s + 900) y nunca coincide con el de «Ahora tú» (s % n).
  const otroIndice = (s, n) => (s % n + 1 + Math.floor(azar(s + 900)() * (n - 1))) % n;
  const barajar = (b, s) => {
    const r = azar(s + 900), malas = b.m.slice(); r(); if (r() < 0.5) malas.reverse();
    const ops = opciones(b.ok, malas), c = ops.shift(), k = Math.floor(r() * (ops.length + 1));
    ops.splice(k, 0, c); return ops;
  };
  const minus = t => t.charAt(0).toLowerCase() + t.slice(1);
  // Un trozo de color largo (una pista, una razón) puede partir línea (.var.largo): si no, se sale de la tarjeta.
  const largo = x => Object.assign(x, { largo: true });
  const trampa = (b, codigo) => b.m.find(m => m[1] === codigo);
  // Figura de «Así se resuelve»: la oración del caso (la misma tarjeta de «Ahora tú») y la lista de opciones; el
  // estado marca la pista (i), llena el hueco y, al resolver, marca la correcta (i) y tacha las demás.
  const conOpciones = (fig, ops, extra = {}, resuelto = false) => ({
    datos: { esquinaLibre: true, secciones: fig.datos.secciones.concat([{ id: 'ops', titulo: 'Opciones', modo: 'lista', fragmentos: ops.map((o, k) => ({ id: `o${k}`, t: o.texto })) }]) },
    estado: Object.assign({}, fig.estado, extra, {
      marcas: Object.assign({}, fig.estado.marcas, extra.marcas, resuelto ? { [`o${ops.findIndex(o => o.correcta)}`]: 'i' } : {}),
    }, resuelto ? { tachar: ops.map((o, k) => (o.correcta ? null : `o${k}`)).filter(Boolean) } : {}),
  });
  // La oración con hueco de la idea 3 (como la de «Ahora tú»); el hueco se llena con el verbo elegido.
  const conHueco = o => { const [antes, despues] = o.split('___'); return { datos: { esquinaLibre: true, secciones: [{ id: 'o', titulo: 'Oración', modo: 'tarjeta', fragmentos: [{ id: 'a', t: antes.trim() }, { id: 'w', hueco: true, reserva: 'construyó' }, { id: 'b', t: despues.trim() }] }] }, estado: { marcas: {} } }; };
  // La parte que sigue a la palabra (la pista, en estos bancos), sin la puntuación del comienzo.
  const despuesDe = (o, w) => o.split(w)[1].replace(/^[\s:;,]+/, '').replace(/\.$/, '');

  // ---------- Idea 1: la oración elige la acepción ----------
  // Cambia: la oración (la palabra «fría» se queda) y el reemplazo. Permanece: la palabra y su lugar.
  // Progresa: qué reemplazo encaja en cada oración. Se reserva: el antónimo en contexto (la predicción).
  // Debe verse: la pista que decide la acepción, marcada junto al hueco.
  const FRIA = {
    agua: { partes: [['El agua del'], ['lago', 'pista'], ['estaba'], null, ['y nadie quiso'], ['bañarse.', 'pista']], ok: 'helada', sentido: 'temperatura' },
    trato: { partes: [['Su respuesta fue'], null, ['y'], ['cortante:', 'pista'], ['ni siquiera nos'], ['saludó.', 'pista']], ok: 'distante', sentido: 'trato' },
    calma: { partes: [['En el examen mantuvo la cabeza'], null, ['y'], ['resolvió sin apuro.', 'pista']], ok: 'serena', sentido: 'calma' },
  };
  const REEMPLAZOS = ['helada', 'distante', 'serena'];
  const figFria = k => oracion(FRIA[k].partes, 'distante');
  // El juego y «Mira» usan la misma figura: la oración y, debajo, el banco con los tres reemplazos (hallazgo 9).
  const figFriaB = k => conBanco(figFria(k), REEMPLAZOS);
  const estFria = (k, r, extra = {}) => {
    const d = figFria(k), ok = FRIA[k].ok === r;
    return Object.assign({ huecos: { w: r }, marcas: Object.assign(marcar(d, pistas(d)), { w: ok ? 'o' : 'h' }), sellos: { o: ok ? { t: 'Encaja', c: 'i' } : { t: 'Cambia el sentido', c: 'h' } } }, extra);
  };
  const acepcion = {
    id: 'acepcion',
    titulo: 'La oración elige la acepción',
    temas: ['Sinónimos en contexto', 'Antónimos en contexto'],
    pieza: 'rv-texto',
    // Lee (fase 2): qué es una acepción y qué es una pista, sin tocar el contrario de «fría» (Predice).
    lee: {
      tarjetas: [
        { titulo: 'Una palabra, varios sentidos', texto: 'Muchas palabras tienen varios significados, y a cada uno se le llama acepción. «Banco» puede ser el asiento de la plaza o el lugar donde guardas tu dinero.' },
        { titulo: 'La oración da pistas', texto: 'La oración avisa qué acepción usa. En «me senté en el banco a esperar la combi», «me senté» es la pista: nadie se sienta en una oficina de dinero.' },
        { titulo: 'Qué mirar', texto: 'En el juego, la palabra que falta es siempre «fría». Mira qué palabras de cada oración están marcadas y qué reemplazo encaja con ellas.' },
      ],
    },
    juega: {
      consigna: 'La palabra que falta es «fría». Cambia la oración y prueba reemplazos: mira cuál conserva el sentido en cada una.',
      voz: 'Las palabras marcadas son las pistas de la oración.',
      controles: [
        { id: 'o', etiqueta: 'Oración', opciones: [{ valor: 'agua', texto: 'el lago' }, { valor: 'trato', texto: 'la respuesta' }, { valor: 'calma', texto: 'el examen' }] },
        { id: 'r', etiqueta: 'Reemplazo', opciones: REEMPLAZOS.map(r => ({ valor: r, texto: r })) },
      ],
      dibujo: val => ({ datos: figFriaB(val.o), estado: estFria(val.o, val.r, { marcas: Object.assign(estFria(val.o, val.r).marcas, { [`p-${val.r}`]: 'o' }) }) }),
      lectura: val => (FRIA[val.o].ok === val.r ? [corto(palabra, val.r), ': encaja, habla de ', corto(rasgo, FRIA[val.o].sentido)] : [corto(mal, val.r), ': aquí «fría» habla de ', corto(rasgo, FRIA[val.o].sentido)]),
      minimo: 4,
      // Arrastra el marcador por el banco: la palabra que sueltas entra al hueco.
      arrastres: [tomaPalabra('r', val => figFriaB(val.o), REEMPLAZOS, 'palabra que se prueba en el hueco')],
    },
    predice: {
      pregunta: 'En «su respuesta fue fría y cortante», ¿qué palabra significa lo contrario de «fría»?',
      voz: 'Lo contrario también depende de la acepción.',
      opciones: opciones('cálida', [
        ['caliente', 'RV18', 'Es el contrario de «fría» en temperatura; aquí «fría» habla del trato.'],
        ['helada', 'RV17', 'En temperatura, helada va en el mismo sentido que fría: no es su contrario.'],
        ['lenta', 'RV21', 'Es distinta, pero mide la rapidez, no el trato.'],
      ]),
      dibujo: { datos: figFria('trato'), estado: { huecos: { w: 'fría' }, marcas: { w: 'o' } } },
      revelar: { datos: figFria('trato'), estado: { huecos: { w: 'cálida' }, marcas: Object.assign(marcar(figFria('trato'), pistas(figFria('trato'))), { w: 'o' }), sellos: { o: { t: 'Contrario en el trato', c: 'i' } } } },
      coincide: 'Coincide: una respuesta cálida es afectuosa; se opone a fría en el trato.',
    },
    mira: {
      datos: figFriaB('trato'),
      voz: 'Primero la pista, después la palabra.',
      pasos: [
        { estado: { huecos: { w: 'fría' }, marcas: { w: 'o' } }, texto: '«Fría» tiene varias acepciones: temperatura, trato, calma.', ecuacion: [palabra('fría'), ' → ', rasgo('¿qué acepción?')] },
        { estado: { huecos: { w: 'fría' }, marcas: Object.assign(marcar(figFria('trato'), pistas(figFria('trato'))), { w: 'o' }), nuevo: ['t2', 't4'] }, texto: '«Cortante» y «ni saludó» dicen que se habla del trato.', ecuacion: [pista('cortante'), ' + ', pista('no saludó'), ' → ', rasgo('trato')] },
        { estado: estFria('trato', 'helada', { nuevo: ['w'] }), texto: '«Helada» conserva la temperatura, no el trato: cambia el sentido.', ecuacion: [mal('helada'), ' ≠ ', palabra('distante')] },
        { estado: estFria('trato', 'distante', { nuevo: ['w'] }), texto: '«Distante» habla del trato y encaja con las pistas.', ecuacion: [palabra('fría'), ' ≈ ', palabra('distante'), ' (trato)'] },
      ],
    },
    regla: {
      texto: 'Un sinónimo o un antónimo en contexto se elige por la acepción que pide la oración, no por la primera que se recuerda. Las pistas de la oración deciden.',
      ecuacion: [pista('pista'), ' → ', { llave: [rasgo('acepción')], nota: 'sentido que usa', color: 'c-d' }, ' → ', palabra('reemplazo')],
      condicion: 'el reemplazo, puesto en el lugar de la palabra, conserva el sentido y el tono de la oración.',
    },
    // Así se resuelve (fase 2): otro caso del banco de «Ahora tú»; primero la pista, después la palabra.
    resuelve: {
      pieza: 'rv-texto',
      voz: 'Primero la pista; después, la palabra.',
      generar(s) {
        const b = BANCO_ACEP[otroIndice(s, BANCO_ACEP.length)], ops = barajar(b, s), fig = tarjeta(b.o, b.w), t = trampa(b, 'RV18');
        return {
          enunciado: `En esta oración, ¿qué palabra es un ${b.pide} de «${b.w}»?`,
          dibujo: conOpciones(fig, ops),
          pasos: [
            { tipo: 'pide', texto: [`Piden un ${b.pide} de `, palabra(b.w), ' con el sentido que tiene en esta oración, no en cualquiera.'] },
            { tipo: 'datos', texto: ['La pista de la oración: ', largo(pista(`«${despuesDe(b.o, b.w)}»`)), '.'], dibujo: conOpciones(fig, ops, { marcas: { b: 'i' } }) },
            { tipo: 'regla', texto: 'Veo qué acepción usa la oración. Después busco la palabra que dice lo mismo, o lo contrario, en esa acepción.', ecuacion: [pista('pista'), ' → ', rasgo('acepción'), ' → ', palabra('reemplazo')] },
            { tipo: 'aplica', texto: ['Aquí ', palabra(b.w), ' habla de ', largo(rasgo(ACEPCION[b.w])), `. En esa acepción, el ${b.pide} es `, palabra(b.ok), '.'], dibujo: conOpciones(fig, ops, { marcas: { b: 'i' } }, true) },
            { tipo: 'sentido', texto: [`«${t[0]}» es la trampa de la primera acepción. `, largo(mal(t[2]))] },
          ],
          respuesta: [palabra(b.ok)],
        };
      },
    },
    ahoraTu: {
      voz: 'Busca la pista que decide la acepción.',
      generar(s) {
        const B = BANCO_ACEP;
        const b = B[s % B.length];
        return {
          pregunta: `En esta oración, ¿qué palabra es un ${b.pide} de «${b.w}»?`,
          dibujo: tarjeta(b.o, b.w),
          opciones: opciones(b.ok, voltear(b.m, s)),
          solucion: { texto: `La oración pide la acepción que dan sus pistas; «${b.ok}» la conserva.`, ecuacion: [palabra(b.w), b.pide === 'sinónimo' ? ' ≈ ' : ' ↔ ', palabra(b.ok)] },
        };
      },
    },
  };

  // ---------- Idea 2: lo que dice y cómo lo valora ----------
  // Cambia: la palabra para la misma persona. Permanece: la oración y lo que describe (poco peso).
  // Progresa: la valoración, de positiva a negativa. Se reserva: «terco / perseverante» (la predicción).
  // Debe verse: el sello de lo que denota no cambia; el de la valoración sí.
  const PESO = {
    esbelta: { val: 'la elogia', c: 'i' },
    delgada: { val: 'neutra', c: 'd' },
    flaca: { val: 'algo despectiva', c: 'o' },
    esquelética: { val: 'la critica', c: 'h' },
  };
  const figPeso = () => ({ esquinaLibre: true, secciones: [
    { id: 'o', titulo: 'Oración', modo: 'tarjeta', fragmentos: [{ id: 'a', t: 'Rosa es' }, { id: 'w', hueco: true, reserva: 'esquelética' }, { id: 'b', t: 'y mide un metro setenta.' }] },
    { id: 'den', titulo: 'Lo que dice (denotación)', modo: 'parrafo', fragmentos: [{ id: 'd1', t: 'tiene poco peso para su altura' }] },
    { id: 'con', titulo: 'Cómo lo valora (connotación)', modo: 'parrafo', fragmentos: [{ id: 'c1', hueco: true, caja: false, reserva: 'algo despectiva' }] },
  ] });
  const PALABRAS_PESO = Object.keys(PESO);
  const figPesoB = () => conBanco(figPeso(), PALABRAS_PESO, 'De elogio a crítica');
  const estPeso = (w, extra = {}) => Object.assign({ huecos: { w, c1: PESO[w].val }, marcas: { w: 'o', d1: 'i', c1: PESO[w].c }, sellos: { den: { t: 'No cambia', c: 'i' }, con: { t: 'Cambia', c: 'd' } } }, extra);
  const denotaConnota = {
    id: 'denota-connota',
    titulo: 'Lo que dice y cómo valora',
    temas: ['Denotación y connotación'],
    pieza: 'rv-texto',
    // Lee (fase 2): solo el vocabulario (elogiar, criticar) y qué mirar; que la valoración cambie y la conducta no, lo
    // descubre en el juego y en Predice.
    lee: {
      tarjetas: [
        { titulo: 'Elogiar y criticar', texto: 'Elogiar es hablar bien de alguien; criticar es señalar lo que no te gusta de él. En el examen te preguntan si una palabra elogia, critica o solo describe.' },
        { titulo: 'Qué mirar', texto: 'En el juego describes a Rosa con cuatro palabras. Abajo hay dos tarjetas: una dice lo que la palabra describe y la otra, cómo lo valora. Mira cuál se mueve.' },
      ],
    },
    juega: {
      consigna: 'Describe a Rosa con distintas palabras. Mira qué se mantiene y qué cambia en cada caso.',
      voz: 'Compara las dos tarjetas de abajo.',
      controles: [{ id: 'w', etiqueta: 'Palabra', opciones: Object.keys(PESO).map(w => ({ valor: w, texto: w })) }],
      dibujo: val => ({ datos: figPesoB(), estado: estPeso(val.w, { marcas: Object.assign(estPeso(val.w).marcas, { [`p-${val.w}`]: 'o' }) }) }),
      lectura: val => ['Dice lo mismo; la valoración es ', corto(rasgo, PESO[val.w].val)],
      minimo: 3,
      // Corre el marcador por la fila de palabras, del elogio a la crítica: lo que dice no se mueve.
      arrastres: [tomaPalabra('w', () => figPesoB(), PALABRAS_PESO, 'palabra para describir a Rosa')],
    },
    predice: {
      pregunta: 'En «Pedro es terco: insiste aunque le digan que no», ¿qué cambia si «terco» se reemplaza por «perseverante»?',
      opciones: opciones('Cambia la valoración, no la conducta', [
        ['Cambia la conducta que se describe', 'RVL1', 'Cambiaría si dejara de insistir; las dos palabras describen insistir.'],
        ['No cambia nada: son sinónimos', 'RVL2', 'Coinciden en lo que describen; una lo critica y la otra lo elogia.'],
        ['Se vuelve una oración sin opinión', 'RVL1', 'Perseverante también opina: elogia la insistencia.'],
      ]),
      dibujo: { datos: figPeso(), estado: { huecos: { w: 'esbelta' }, tapar: ['d1', 'c1'], marcas: { w: 'o' } } },
      revelar: { datos: { esquinaLibre: true, secciones: [
        { id: 'o', titulo: 'Oración', modo: 'tarjeta', fragmentos: [{ id: 'a', t: 'Pedro es' }, { id: 'w', hueco: true, reserva: 'perseverante' }, { id: 'b', t: ': insiste aunque le digan que no.' }] },
        { id: 'den', titulo: 'Lo que dice (denotación)', modo: 'parrafo', fragmentos: [{ id: 'd1', t: 'insiste en lo que quiere' }] },
        { id: 'con', titulo: 'Cómo lo valora (connotación)', modo: 'parrafo', fragmentos: [{ id: 'c1', t: 'terco lo critica; perseverante lo elogia' }] },
      ] }, estado: { huecos: { w: 'perseverante' }, marcas: { w: 'o', d1: 'i', c1: 'd' }, sellos: { den: { t: 'No cambia', c: 'i' }, con: { t: 'Cambia', c: 'd' } } } },
      coincide: 'Coincide: la conducta es la misma; cambia si la palabra la aprueba o la reprueba.',
    },
    mira: {
      datos: figPesoB(),
      pasos: [
        { estado: { huecos: { w: 'delgada', c1: PESO.delgada.val }, marcas: { w: 'o', d1: 'i' }, tapar: ['c1'], nuevo: ['d1'] }, texto: 'La denotación es lo que la palabra describe: poco peso.', ecuacion: [palabra('delgada'), ' → ', pista('poco peso')] },
        { estado: estPeso('esbelta', { nuevo: ['c1', 'w'] }), texto: '«Esbelta» describe lo mismo y además lo elogia.', ecuacion: [palabra('esbelta'), ' = ', pista('poco peso'), ' + ', rasgo('elogio')] },
        { estado: estPeso('esquelética', { nuevo: ['c1', 'w'] }), texto: '«Esquelética» describe lo mismo y lo critica.', ecuacion: [palabra('esquelética'), ' = ', pista('poco peso'), ' + ', rasgo('crítica')] },
      ],
    },
    regla: {
      texto: 'La denotación es lo que una palabra describe; la connotación es la valoración o asociación que le suma. Dos palabras pueden denotar lo mismo y connotar lo contrario.',
      ecuacion: [palabra('palabra'), ' = ', { llave: [pista('denotación')], nota: 'lo que describe', color: 'c-i' }, ' + ', { llave: [rasgo('connotación')], nota: 'cómo lo valora', color: 'c-d' }],
      condicion: 'se compara en la misma oración; un sinónimo que cambia la valoración no conserva el tono.',
    },
    // Así se resuelve (fase 2): otro caso del banco; se separa lo que describe de cómo lo valora.
    resuelve: {
      pieza: 'rv-texto',
      voz: 'Separa lo que describe de cómo lo valora.',
      generar(s) {
        const b = BANCO_VALOR[otroIndice(s, BANCO_VALOR.length)], ops = barajar(b, s), fig = tarjeta(b.o, b.w), [den, antes, ahora] = VALORA[b.w];
        const cambia = trampa(b, 'RVL1'), igual = trampa(b, 'RVL2');
        return {
          enunciado: `¿Qué palabra describe la misma conducta que «${b.w}», pero hace que la oración la ${b.pide}?`,
          dibujo: conOpciones(fig, ops),
          pasos: [
            { tipo: 'pide', texto: `Piden otra palabra para la misma conducta, que haga que la oración la ${b.pide}.` },
            { tipo: 'datos', texto: [palabra(b.w), ' describe que ', largo(pista(den)), '. Su valoración: ', rasgo(antes), '.'], dibujo: conOpciones(fig, ops, { marcas: { b: 'i' } }) },
            { tipo: 'regla', texto: 'Conservo lo que la palabra describe y cambio solo cómo lo valora.', ecuacion: [pista('misma denotación'), ' + ', rasgo('otra connotación')] },
            { tipo: 'aplica', texto: [`Descarto «${cambia[0]}», porque `, largo(mal(minus(cambia[2]))), ' Queda ', palabra(b.ok), ': describe lo mismo y ', rasgo(ahora), '.'], dibujo: conOpciones(fig, ops, { marcas: { b: 'i' } }, true) },
            { tipo: 'sentido', texto: [`La parecida, «${igual[0]}», tampoco sirve, porque `, largo(mal(minus(igual[2])))] },
          ],
          respuesta: [palabra(b.ok)],
        };
      },
    },
    ahoraTu: {
      generar(s) {
        const B = BANCO_VALOR;
        const b = B[s % B.length];
        return {
          pregunta: `¿Qué palabra describe la misma conducta que «${b.w}», pero hace que la oración la ${b.pide}?`,
          dibujo: tarjeta(b.o, b.w),
          opciones: opciones(b.ok, voltear(b.m, s)),
          solucion: { texto: 'Se conserva lo que describe y se cambia solo la valoración.', ecuacion: [pista('misma denotación'), ' + ', rasgo('otra connotación')] },
        };
      },
    },
  };

  // ---------- Idea 3: la palabra precisa ----------
  // Cambia: el objeto (informe, casa, pregunta) y el verbo. Permanece: el sujeto y la oración.
  // Progresa: de un verbo comodín a uno preciso. Se reserva: el verbo que contradice el contexto (predicción).
  // Debe verse: que «hizo» encaja en todas, y por eso no precisa nada.
  const OBJ = {
    informe: { t: 'un informe de diez páginas', ok: 'redactó' },
    casa: { t: 'una casa de dos pisos', ok: 'construyó' },
    pregunta: { t: 'una pregunta sobre el examen', ok: 'formuló' },
  };
  const VERBOS = ['hizo', 'redactó', 'construyó', 'formuló'];
  const figPrec = k => ({ esquinaLibre: true, secciones: [{ id: 'o', titulo: 'Oración', modo: 'tarjeta', fragmentos: [{ id: 'a', t: 'El ingeniero' }, { id: 'w', hueco: true, reserva: 'construyó' }, { id: 'b', t: `${OBJ[k].t}.` }] }] });
  const figPrecB = k => conBanco(figPrec(k), VERBOS);
  const juicio = (k, v) => (v === 'hizo' ? 'vago' : OBJ[k].ok === v ? 'preciso' : 'no encaja');
  const estPrec = (k, v, extra = {}) => { const j = juicio(k, v); return Object.assign({ huecos: { w: v }, marcas: { b: 'i', w: j === 'preciso' ? 'o' : j === 'vago' ? 'd' : 'h' }, sellos: { o: { t: j === 'preciso' ? 'Preciso' : j === 'vago' ? 'Vago' : 'No encaja', c: j === 'preciso' ? 'i' : j === 'vago' ? 'd' : 'h' } } }, extra); };
  const precision = {
    id: 'palabra-precisa',
    titulo: 'La palabra precisa',
    temas: ['Precisión léxica'],
    pieza: 'rv-texto',
    // Lee (fase 2): qué hace el verbo y qué decide cuál va, sin el comodín ni la oración de la comisión (Predice).
    lee: {
      tarjetas: [
        { titulo: 'Varias palabras posibles', texto: 'Al escribir, casi siempre hay varias palabras que podrían ir en un mismo lugar. En el examen te piden la que mejor dice lo que pasa en esa oración.' },
        { titulo: 'El verbo dice la acción', texto: 'El verbo dice qué hace alguien: «redactar», «construir», «preguntar». Una persona puede hacer muchas cosas; el resto de la oración dice cuál hizo.' },
        { titulo: 'Qué mirar', texto: 'En el juego, el ingeniero hace tres cosas distintas. Prueba cada verbo con cada una y mira con cuántas encaja.' },
      ],
    },
    juega: {
      consigna: 'Cambia lo que hizo el ingeniero y prueba verbos. Mira cuál dice más sobre esa acción en particular.',
      voz: 'Fíjate en qué verbo sirve para todo.',
      controles: [
        { id: 'k', etiqueta: 'Objeto', opciones: Object.keys(OBJ).map(k => ({ valor: k, texto: k })) },
        { id: 'v', etiqueta: 'Verbo', opciones: VERBOS.map(v => ({ valor: v, texto: v })) },
      ],
      dibujo: val => ({ datos: figPrecB(val.k), estado: estPrec(val.k, val.v, { marcas: Object.assign(estPrec(val.k, val.v).marcas, { [`p-${val.v}`]: 'o' }) }) }),
      // Arrastra el marcador por los verbos: el que sueltas entra al hueco.
      arrastres: [tomaPalabra('v', val => figPrecB(val.k), VERBOS, 'verbo que se prueba')],
      lectura: val => { const j = juicio(val.k, val.v); return [j === 'preciso' ? corto(palabra, val.v) : j === 'vago' ? corto(rasgo, val.v) : corto(mal, val.v), j === 'vago' ? ': sirve para todo, no precisa' : j === 'preciso' ? ': nombra esta acción' : ': no encaja con el objeto']; },
      minimo: 4,
    },
    predice: {
      pregunta: 'En «la comisión ___ el reglamento con cuidado antes de aprobarlo», ¿qué verbo es el más preciso?',
      opciones: opciones('examinó', [
        ['vio', 'RVL3', '«Vio» encaja, pero es vago: no dice que lo revisaran con cuidado.'],
        ['aprobó', 'RV23', 'Encaja con «reglamento», pero choca con «antes de aprobarlo».'],
        ['escribió', 'RV19', 'Es del mismo campo, pero la comisión lo aprueba: no dice que lo escribiera.'],
      ]),
      dibujo: { datos: { esquinaLibre: true, secciones: [{ id: 'o', titulo: 'Oración', modo: 'tarjeta', fragmentos: [{ id: 'a', t: 'La comisión' }, { id: 'w', hueco: true, reserva: 'examinó' }, { id: 'b', t: 'el reglamento' }, { id: 'c', t: 'con cuidado antes de aprobarlo.' }] }] }, estado: {} },
      revelar: { datos: { esquinaLibre: true, secciones: [{ id: 'o', titulo: 'Oración', modo: 'tarjeta', fragmentos: [{ id: 'a', t: 'La comisión' }, { id: 'w', hueco: true, reserva: 'examinó' }, { id: 'b', t: 'el reglamento' }, { id: 'c', t: 'con cuidado antes de aprobarlo.' }] }] }, estado: { huecos: { w: 'examinó' }, marcas: { w: 'o', c: 'i' }, sellos: { o: { t: 'Preciso', c: 'i' } } } },
      coincide: 'Coincide: «con cuidado antes de aprobarlo» pide revisar a fondo: examinar.',
    },
    mira: {
      datos: figPrecB('informe'),
      pasos: [
        { estado: estPrec('informe', 'hizo'), texto: '«Hizo» encaja con informe, casa y pregunta: por eso no precisa.', ecuacion: [rasgo('hizo'), ' sirve para todo'] },
        { estado: estPrec('informe', 'construyó', { nuevo: ['w'] }), texto: '«Construyó» es preciso, pero para otra cosa: no encaja.', ecuacion: [mal('construyó'), ' + informe'] },
        { estado: estPrec('informe', 'redactó', { nuevo: ['w'] }), texto: '«Redactó» nombra justo lo que se hace con un informe.', ecuacion: [palabra('redactó'), ' + ', pista('informe')] },
      ],
    },
    regla: {
      texto: 'La palabra precisa nombra justo lo que dice la oración y encaja con todas sus partes. Un comodín como hacer, ver o cosa encaja en todo: informa poco.',
      ecuacion: [{ llave: [palabra('verbo preciso')], nota: 'no es comodín', color: 'c-o' }, ' = encaja con ', pista('el objeto'), ' + dice más'],
      condicion: 'la palabra no choca con ninguna otra parte de la oración (los complementos, los conectores, el tiempo).',
    },
    // Así se resuelve (fase 2): otro caso del banco; se descartan el comodín y el verbo que choca.
    resuelve: {
      pieza: 'rv-texto',
      voz: 'Descarta el comodín y el verbo que choca.',
      generar(s) {
        const b = BANCO_PRECISA[otroIndice(s, BANCO_PRECISA.length)], ops = barajar(b, s), fig = conHueco(b.o);
        const vago = trampa(b, 'RVL3'), choca = trampa(b, 'RV23');
        return {
          enunciado: `¿Qué palabra completa con más precisión la oración «${b.o}»?`,
          dibujo: conOpciones(fig, ops),
          pasos: [
            { tipo: 'pide', texto: 'Piden la palabra que encaja con toda la oración y, además, dice más sobre la acción.' },
            { tipo: 'datos', texto: ['Las partes que deciden: ', largo(pista(`«${DECIDE[b.ok]}»`)), '.'], dibujo: conOpciones(fig, ops, { marcas: { b: 'i' } }) },
            { tipo: 'regla', texto: 'Descarto la palabra que sirve para todo y la que choca con alguna parte. Queda la que nombra justo esa acción.', ecuacion: [palabra('preciso'), ' = encaja con todo + dice más'] },
            { tipo: 'aplica', texto: [`«${vago[0]}» es vago; `, mal(`«${choca[0]}»`), ' choca con la oración. Queda ', palabra(b.ok), ': encaja y dice más.'], dibujo: conOpciones(fig, ops, { huecos: { w: b.ok }, marcas: { b: 'i', w: 'o' } }, true) },
            { tipo: 'sentido', texto: `Leo la oración completa: «${b.o.replace('___', b.ok)}» Encaja con todas sus partes.` },
          ],
          respuesta: [palabra(b.ok)],
        };
      },
    },
    ahoraTu: {
      generar(s) {
        const B = BANCO_PRECISA;
        const b = B[s % B.length];
        const [antes, despues] = b.o.split('___');
        return {
          pregunta: '¿Qué palabra completa la oración con más precisión?',
          dibujo: { datos: { esquinaLibre: true, secciones: [{ id: 'o', titulo: 'Oración', modo: 'tarjeta', fragmentos: [{ id: 'a', t: antes.trim() }, { id: 'w', hueco: true, reserva: 'construyó' }, { id: 'b', t: despues.trim() }] }] }, estado: {} },
          opciones: opciones(b.ok, voltear(b.m, s)),
          solucion: { texto: `«${b.ok}» encaja con todas las partes de la oración y dice más.`, ecuacion: [palabra(b.ok)] },
        };
      },
    },
  };

  // ---------- Idea 4: deducir el significado por las pistas ----------
  // Cambia: la pista que se marca. Permanece: la oración con la palabra desconocida («inocuo»).
  // Progresa: cada pista suma información. Se reserva: «efímero» con la pista de tiempo (predicción).
  // Debe verse: la pista que dice el significado (la consecuencia) frente a la que solo acompaña.
  const INOCUO = [
    { id: 'a', t: 'El jarabe es' }, { id: 'w', t: 'inocuo:' }, { id: 'b', t: 'aunque un niño lo tome por error,' }, { id: 'c', t: 'no le hará ningún daño.' }, { id: 'd', t: 'Viene en un frasco azul.' },
  ];
  // La cabeza en color es corta (≤ 14 letras): así cabe también en la miniatura de un caso guardado.
  const QUE_DICE = { b: ['Plantea', ' un caso de riesgo'], c: ['Dice qué es', ': no hace daño'], d: ['Es un detalle', ': no ayuda'] };
  const figIno = () => ({ esquinaLibre: true, secciones: [{ id: 'o', titulo: 'Texto', modo: 'tarjeta', fragmentos: INOCUO }] });
  const inferencia = {
    id: 'inferir-significado',
    titulo: 'El significado sale de las pistas',
    temas: ['Inferencias léxicas'],
    pieza: 'rv-texto',
    // Lee (fase 2): que la oración ayuda con la palabra nueva, sin decir qué pista es la buena (eso lo marca el juego).
    lee: {
      tarjetas: [
        { titulo: 'Palabras nuevas', texto: 'En una lectura siempre aparece alguna palabra que no conoces. En el examen no hay diccionario, pero la misma oración te puede ayudar a entenderla.' },
        { titulo: 'Lo que rodea a la palabra', texto: 'Mira lo que viene antes y después de la palabra: una explicación, un ejemplo o lo que pasó luego. Algunas frases cercanas ayudan; otras solo la acompañan.' },
        { titulo: 'Qué mirar', texto: 'En el juego, el texto dice que un jarabe es «inocuo». Marca cada parte del texto y mira cuál te dice qué significa esa palabra.' },
      ],
    },
    juega: {
      consigna: '«Inocuo» quizá sea nueva para ti. Marca cada parte del texto y mira cuál dice qué significa.',
      voz: 'No todas las frases cercanas ayudan igual.',
      controles: [{ id: 'p', etiqueta: 'Marca', opciones: [{ valor: 'b', texto: 'aunque un niño…' }, { valor: 'c', texto: 'no le hará…' }, { valor: 'd', texto: 'Viene en…' }] }],
      dibujo: val => ({ datos: figIno(), estado: { marcas: { w: 'o', [val.p]: val.p === 'c' ? 'i' : val.p === 'b' ? 'd' : 'h' } } }),
      lectura: val => [(val.p === 'c' ? pista : val.p === 'b' ? rasgo : mal)(QUE_DICE[val.p][0]), QUE_DICE[val.p][1]],
      minimo: 3,
      // Arrastra el marcador por el texto: se marca la parte donde lo sueltas.
      arrastres: [{ id: 'frase', etiqueta: 'marcador de la parte del texto', color: 'c-i',
        donde: val => RV().ancla(figIno(), val.p),
        mover: pt => ({ p: RV().cercana(figIno(), pt, ['b', 'c', 'd']) }) }],
    },
    predice: {
      pregunta: '«La fama del cantante fue efímera: en un mes, ya nadie recordaba su nombre.» ¿Qué significa «efímera»?',
      opciones: opciones('Que dura poco tiempo', [
        ['Que es muy grande', 'RVL4', 'Se asocia con «fama», pero la pista habla de tiempo: un mes.'],
        ['Que es falsa', 'RV7', 'El texto no dice que no fuera real; dice que se olvidó pronto.'],
        ['Que es merecida', 'RVL4', 'Nada en la oración la juzga; solo dice cuánto duró.'],
      ]),
      dibujo: { datos: { esquinaLibre: true, secciones: [{ id: 'o', titulo: 'Texto', modo: 'tarjeta', fragmentos: [{ id: 'a', t: 'La fama del cantante fue' }, { id: 'w', t: 'efímera:' }, { id: 'b', t: 'en un mes, ya nadie recordaba su nombre.' }] }] }, estado: { marcas: { w: 'o' } } },
      revelar: { datos: { esquinaLibre: true, secciones: [{ id: 'o', titulo: 'Texto', modo: 'tarjeta', fragmentos: [{ id: 'a', t: 'La fama del cantante fue' }, { id: 'w', t: 'efímera:' }, { id: 'b', t: 'en un mes, ya nadie recordaba su nombre.' }] }] }, estado: { marcas: { w: 'o', b: 'i' }, sellos: { o: { t: 'Pista: en un mes', c: 'i' } } } },
      coincide: 'Coincide: «en un mes, ya nadie» dice que duró poco.',
    },
    mira: {
      datos: figIno(),
      pasos: [
        { estado: { marcas: { w: 'o' } }, texto: 'Ubica la palabra y mira lo que la rodea.', ecuacion: [palabra('inocuo'), ' = ?'] },
        { estado: { marcas: { w: 'o', c: 'i' }, nuevo: ['c'] }, texto: 'Los dos puntos anuncian una explicación: «no le hará ningún daño».', ecuacion: [palabra('inocuo'), ' = ', pista('no hace daño')] },
        { estado: { marcas: { w: 'o', c: 'i', b: 'd' }, nuevo: ['b'] }, texto: 'El «aunque» lo confirma: ni siquiera tomado por error daña.', ecuacion: [rasgo('aunque'), ' + ', pista('no daña')] },
        { estado: { marcas: { w: 'o', c: 'i', b: 'd' }, tachar: ['d'], nuevo: ['d'] }, texto: 'El frasco azul es un detalle: no dice nada del significado.', ecuacion: [palabra('inocuo'), ' ≈ ', pista('que no hace daño')] },
      ],
    },
    regla: {
      texto: 'El significado de una palabra nueva se deduce de las pistas de su oración: una explicación, un ejemplo, un contraste o una consecuencia. La respuesta debe encajar en su lugar.',
      ecuacion: [{ llave: [pista('pista')], nota: 'explica o contrasta', color: 'c-i' }, ' + ', palabra('lugar de la palabra'), ' → significado'],
      condicion: 'la pista está en el texto y habla de la palabra; una asociación propia o un detalle cercano no bastan.',
    },
    // Así se resuelve (fase 2): otro caso del banco; la pista dice el significado y la asociación se descarta.
    resuelve: {
      pieza: 'rv-texto',
      voz: 'Busca la parte que habla de la palabra.',
      generar(s) {
        const b = BANCO_PISTA[otroIndice(s, BANCO_PISTA.length)], ops = barajar(b, s), fig = tarjeta(b.o, b.w), t = trampa(b, 'RVL4');
        return {
          enunciado: `Según las pistas de la oración, ¿qué significa «${b.w}»?`,
          dibujo: conOpciones(fig, ops),
          pasos: [
            { tipo: 'pide', texto: ['Piden qué significa ', palabra(b.w), ' según esta oración, aunque no la conozca.'] },
            { tipo: 'datos', texto: ['La parte que habla de la palabra: ', largo(pista(`«${despuesDe(b.o, b.w)}»`)), '.'], dibujo: conOpciones(fig, ops, { marcas: { b: 'i' } }) },
            { tipo: 'regla', texto: 'Busco la parte que explica la palabra, la contrasta o cuenta su consecuencia. El significado debe encajar en el lugar de la palabra.', ecuacion: [pista('pista'), ' + ', palabra('lugar'), ' → significado'] },
            { tipo: 'aplica', texto: ['La pista da ', rasgo(TIPO_PISTA[b.w]), '. Por eso ', palabra(b.w), ' quiere decir ', largo(pista(`«${minus(b.ok)}»`)), '.'], dibujo: conOpciones(fig, ops, { marcas: { b: 'i' } }, true) },
            { tipo: 'sentido', texto: [`Descarto «${minus(t[0])}». `, largo(mal(t[2]))] },
          ],
          respuesta: [`«${b.ok}»`],
        };
      },
    },
    ahoraTu: {
      generar(s) {
        const B = BANCO_PISTA;
        const b = B[s % B.length];
        return {
          pregunta: `Según las pistas de la oración, ¿qué significa «${b.w}»?`,
          dibujo: tarjeta(b.o, b.w),
          opciones: opciones(b.ok, voltear(b.m, s)),
          solucion: { texto: 'Lo dice la parte que explica o da la consecuencia.', ecuacion: [palabra(b.w), ' ≈ ', pista(b.ok.toLowerCase())] },
        };
      },
    },
  };

  // ---------- Laboratorio: dos palabras, tres oraciones cada una ----------
  // Más que el juego de la idea 1: se cambia también la palabra polisémica («fría» o «dura»), así se ve que el truco no
  // es propio de una palabra. La lectura dice qué acepción pide la oración, para que el caso guardado se entienda solo.
  const DURA = {
    piedra: { partes: [['La piedra del muro era'], null, ['y no se'], ['rompió con el martillo.', 'pista']], ok: 'sólida', sentido: 'material' },
    critica: { partes: [['La crítica fue'], null, [':'], ['señaló cada error', 'pista'], ['sin reconocer ningún'], ['acierto.', 'pista']], ok: 'severa', sentido: 'trato' },
    semana: { partes: [['Fue una semana'], null, [':'], ['trabajamos de día y de noche.', 'pista']], ok: 'agotadora', sentido: 'esfuerzo' },
  };
  const POLI = {
    fria: { w: 'fría', casos: FRIA, orden: ['agua', 'trato', 'calma'], ws: REEMPLAZOS },
    dura: { w: 'dura', casos: DURA, orden: ['piedra', 'critica', 'semana'], ws: ['sólida', 'severa', 'agotadora'] },
  };
  const figPoli = val => { const P = POLI[val.w]; return conBanco(oracion(P.casos[P.orden[val.o]].partes, 'agotadora'), P.ws); };
  const mesaPoli = {
    id: 'dos-palabras', titulo: 'Fría y dura', pieza: 'rv-texto',
    consigna: 'Elige la palabra que falta y la oración. Arrastra un reemplazo al hueco y compara qué acepción pide cada oración.',
    voz: 'Una palabra polisémica: la misma forma, tres acepciones.',
    controles: [
      { id: 'w', etiqueta: 'Palabra', opciones: [{ valor: 'fria', texto: 'fría' }, { valor: 'dura', texto: 'dura' }] },
      { id: 'o', etiqueta: 'Oración', opciones: [{ valor: 0, texto: '1' }, { valor: 1, texto: '2' }, { valor: 2, texto: '3' }] },
      { id: 'r', etiqueta: 'Reemplazo', opciones: [0, 1, 2].map(k => ({ valor: k, texto: `${k + 1}` })) },
    ],
    dibujo: val => {
      const P = POLI[val.w], c = P.casos[P.orden[val.o]], r = P.ws[val.r], ok = c.ok === r, d = figPoli(val);
      return { datos: d, estado: { huecos: { w: r }, marcas: Object.assign(marcar(d, pistas(d)), { w: ok ? 'o' : 'h', [`p-${r}`]: 'o' }), sellos: { o: ok ? { t: 'Encaja', c: 'i' } : { t: 'Cambia el sentido', c: 'h' } } } };
    },
    lectura: val => {
      const P = POLI[val.w], c = P.casos[P.orden[val.o]], r = P.ws[val.r];
      return [c.ok === r ? palabra(r) : mal(r), ` por «${P.w}»: pide `, rasgo(c.sentido)];
    },
    arrastres: [{
      id: 'palabra', etiqueta: 'reemplazo que entra al hueco', color: 'c-o',
      donde: val => RV().ancla(figPoli(val), `p-${POLI[val.w].ws[val.r]}`),
      mover: (pt, val) => { const ws = POLI[val.w].ws, id = RV().cercana(figPoli(val), pt, ws.map(w => `p-${w}`)); return { r: ws.indexOf(id.slice(2)) }; },
    }],
    // Invitaciones: encajaPoli compara el reemplazo con el de la oración, como el sello «Encaja» del dibujo.
    invitaciones: [
      { texto: 'Con «dura», pon en una oración el reemplazo que encaja.',
        logrado: val => val.w === 'dura' && encajaPoli(val),
        bien: 'Las pistas de la oración eligieron la acepción, no la memoria.' },
      { texto: 'Pon «helada» en una oración donde cambie el sentido.',
        logrado: val => POLI[val.w].ws[val.r] === 'helada' && !encajaPoli(val),
        bien: '«Helada» guarda la temperatura; esta oración pedía otra acepción.' },
      { texto: 'Guarda dos oraciones de la misma palabra, cada una con su reemplazo justo.',
        logrado: (val, guardados) => encajaPoli(val) && guardados.some(g => g.w === val.w && g.o !== val.o && encajaPoli(g)),
        bien: 'Misma palabra, dos reemplazos distintos. ¿Qué pista decidió cada uno?' },
      { texto: 'Guarda la misma acepción con «fría» y con «dura».',
        logrado: (val, guardados) => encajaPoli(val) && guardados.some(g => g.w !== val.w && encajaPoli(g) && casoPoli(g).sentido === casoPoli(val).sentido),
        bien: 'Dos palabras distintas que aquí hablan de lo mismo: el trato.' },
    ],
  };
  // Ayudas de los retos: el caso de la oración elegida y si el reemplazo encaja (lo mismo que decide el sello).
  function casoPoli(val) { const P = POLI[val.w]; return P.casos[P.orden[val.o]]; }
  function encajaPoli(val) { return casoPoli(val).ok === POLI[val.w].ws[val.r]; }
  // Escala de valoración: tres conductas, cuatro palabras cada una, del elogio a la crítica.
  const ESCALA = {
    peso: { o: ['Rosa es', 'y pesa poco para su altura.'], den: 'tiene poco peso', ws: ['esbelta', 'delgada', 'flaca', 'esquelética'] },
    insiste: { o: ['Pedro es', ': insiste aunque le digan que no.'], den: 'insiste mucho', ws: ['perseverante', 'tenaz', 'porfiado', 'terco'] },
    gasta: { o: ['El vecino es', ': gasta muy poco.'], den: 'gasta poco dinero', ws: ['ahorrativo', 'austero', 'agarrado', 'tacaño'] },
  };
  const VALOR = [['la elogia', 'i'], ['casi neutra', 'd'], ['algo despectiva', 'o'], ['la critica', 'h']];
  const figEscala = k => { const E = ESCALA[k]; return { esquinaLibre: true, secciones: [
    { id: 'o', titulo: 'Oración', modo: 'tarjeta', fragmentos: [{ id: 'a', t: E.o[0] }, { id: 'w', hueco: true, reserva: 'perseverante' }, { id: 'b', t: E.o[1] }] },
    { id: 'den', titulo: 'Lo que dice', modo: 'parrafo', fragmentos: [{ id: 'd1', t: E.den }] },
    banco(E.ws, 'De elogio a crítica'),
  ] }; };
  const mesaEscala = {
    id: 'escala', titulo: 'Del elogio a la crítica', pieza: 'rv-texto',
    consigna: 'Elige a quién describes y corre el marcador por la fila de palabras. Mira qué se queda igual y qué cambia.',
    controles: [
      { id: 'k', etiqueta: 'Conducta', opciones: [{ valor: 'peso', texto: 'Rosa' }, { valor: 'insiste', texto: 'Pedro' }, { valor: 'gasta', texto: 'el vecino' }] },
      { id: 'n', etiqueta: 'Palabra', opciones: [0, 1, 2, 3].map(k => ({ valor: k, texto: `${k + 1}` })) },
    ],
    dibujo: val => { const E = ESCALA[val.k], w = E.ws[val.n], v = VALOR[val.n];
      return { datos: figEscala(val.k), estado: { huecos: { w }, marcas: { w: 'o', d1: 'i', [`p-${w}`]: v[1] }, sellos: { den: { t: 'No cambia', c: 'i' }, banco: { t: v[0], c: v[1] } } } }; },
    lectura: val => { const E = ESCALA[val.k], v = VALOR[val.n]; return [palabra(E.ws[val.n]), ': ', pista(E.den), ', y ', rasgo(v[0])]; },
    arrastres: [{
      id: 'palabra', etiqueta: 'palabra de la fila', color: 'c-o',
      donde: val => RV().ancla(figEscala(val.k), `p-${ESCALA[val.k].ws[val.n]}`),
      mover: (pt, val) => { const ws = ESCALA[val.k].ws; return { n: ws.indexOf(RV().cercana(figEscala(val.k), pt, ws.map(w => `p-${w}`)).slice(2)) }; },
    }],
    // Invitaciones: la valoración de cada palabra sale de VALOR, la misma tabla que pone el sello de la fila.
    invitaciones: [
      { texto: 'Describe al vecino con la palabra que más lo critica.',
        logrado: val => val.k === 'gasta' && val.n === VALOR.length - 1,
        bien: '«Tacaño» dice lo mismo que «ahorrativo», pero lo juzga.' },
      { texto: 'Encuentra para Rosa una palabra casi neutra.',
        logrado: val => val.k === 'peso' && VALOR[val.n][1] === 'd',
        bien: 'Describe el peso sin elogiar ni criticar mucho.' },
      { texto: 'Guarda dos palabras para Pedro: una que lo elogie y otra que lo critique.',
        logrado: (val, guardados) => val.k === 'insiste' && [VALOR[0][1], VALOR[VALOR.length - 1][1]]
          .every(c => guardados.some(g => g.k === 'insiste' && VALOR[g.n][1] === c)),
        bien: 'Lo que dice no cambió: insiste mucho. Cambió la connotación.' },
    ],
  };

  return {
    unidad: 'razonamiento-verbal.sentido-contextual',
    version: '0.2.0',
    estado: 'completa',
    requiere: ['/nucleo/kit/piezas/rv-texto.js'],
    historia: {
      texto: 'El Diccionario de autoridades, publicado entre 1726 y 1739, acompañaba cada definición con citas de autores que mostraban cómo se usaba la palabra. Un diccionario reúne las acepciones posibles; elegir la que corresponde a un texto exige mirar la oración donde aparece.',
      pregunta: '¿Por qué un diccionario no basta para entender una oración?',
      fuente: { titulo: 'Matriz de teoría de razonamiento verbal (Diccionario de autoridades)', url: 'https://cvc.cervantes.es/ensenanza/biblioteca_ele/diccio_ele/diccionario/contextodiscursivo.htm' },
    },
    // Glosario: las palabras con que el curso habla del sentido de las palabras en su oración.
    glosario: [
      { termino: 'acepción', def: 'Cada uno de los significados que puede tener una misma palabra.',
        ejemplo: '«Fría» tiene una acepción de temperatura y otra de trato.', formas: ['acepción', 'acepciones'], ver: ['polisemia', 'contexto'] },
      { termino: 'polisemia', def: 'Hecho de que una misma palabra tenga varios significados.',
        ejemplo: '«Dura» es polisémica: piedra dura, crítica dura, semana dura.', formas: ['polisemia', 'polisémica', 'polisémicas', 'polisémico'], ver: ['acepción'] },
      { termino: 'contexto', def: 'Lo que rodea a una palabra o a un texto y ayuda a entender su sentido.',
        ejemplo: 'En «su respuesta fue fría y cortante», «cortante» muestra que se habla del trato.', ver: ['acepción'] },
      { termino: 'denotación', def: 'Lo que una palabra describe o nombra, sin juicios.',
        ejemplo: '«Delgada» y «esquelética» describen lo mismo: poco peso.', ver: ['connotación'] },
      { termino: 'connotación', def: 'Valoración o asociación que una palabra suma a lo que describe.',
        ejemplo: '«Esbelta» elogia; «esquelética» critica.', formas: ['connotación', 'connotaciones', 'connotar'], ver: ['denotación', 'valoración'] },
      { termino: 'valoración', def: 'Juicio de elogio o de crítica que una palabra suma sobre lo que nombra.',
        ejemplo: '«Perseverante» elogia a Pedro; «terco» lo critica, aunque digan lo mismo.', formas: ['valoración', 'valoraciones'], ver: ['connotación'] },
      { termino: 'precisión léxica', def: 'Elegir la palabra que nombra justo lo que se quiere decir y encaja con toda la oración.',
        ejemplo: '«Redactó un informe» es más exacto que «hizo un informe».', formas: ['precisión léxica', 'palabra precisa', 'palabras precisas'], ver: ['comodín'] },
      { termino: 'comodín', def: 'Palabra tan general que encaja en casi cualquier oración y por eso informa poco.',
        ejemplo: '«Hacer», «ver» y «cosa».', formas: ['comodín', 'comodines'], ver: ['precisión léxica'] },
    ],
    laboratorio: [
      mesaPoli,
      mesaEscala,
      Object.assign({ id: 'pistas', titulo: 'Las pistas de «inocuo»', pieza: 'rv-texto',
        // Retos: QUE_DICE es lo que la lectura en vivo dice de cada parte marcada.
        invitaciones: [
          { texto: 'Marca la parte del texto que dice qué significa «inocuo».',
            logrado: val => QUE_DICE[val.p] === QUE_DICE.c,
            bien: 'Tras los dos puntos viene la explicación: no hace daño.' },
          { texto: 'Marca un detalle cercano que no ayuda a entender la palabra.',
            logrado: val => QUE_DICE[val.p] === QUE_DICE.d,
            bien: 'El frasco azul está cerca, pero no habla de la palabra.' },
          { texto: 'Guarda la parte que explica y la que solo confirma, para compararlas.',
            logrado: (val, guardados) => ['b', 'c'].every(p => guardados.some(g => g.p === p)),
            bien: 'Una dice qué es; la otra, con «aunque», lo sostiene.' },
        ] }, inferencia.juega),
    ],
    ideas: [acepcion, denotaConnota, precision, inferencia],
  };
});
