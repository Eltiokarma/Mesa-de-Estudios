/*
 * Generador «Analogías»: práctica de las cinco ideas de razonamiento-verbal.analogias
 * (contenido/teoria/razonamiento-verbal/analogias.js; propuesta en docs/etapa6/propuesta-verbal.md). Formato
 * "predicciones" (docs/arquitectura.md). Funciona en el navegador (window.Generadores['analogias']) y en Node.
 *
 * Regla 1 en verbal: la respuesta no la decide un texto escrito a mano, la calcula el código con un mundo chico. Cada
 * ítem del banco trae su par base y sus pares, cada uno con su relación (una etiqueta: persona y herramienta, lugar,
 * clase, parte, grupo, causa con su sentido, sucesión, sinónimo, antónimo, grado con su sentido, otro rasgo, categoría
 * gramatical…). El generador elige como correcta la única alternativa con la misma relación que el par base, y arma el
 * código y la explicación de cada incorrecta con lo que su relación tiene de distinto. Si el banco no cuadra (dos con la
 * relación del par base, dos incorrectas con el mismo código), lanza un error: generador.test.js lo recorre entero.
 * Pares propios; la hoja sigue el formato de las analogías de la UNI como HIPÓTESIS DE FORMATO (en el repo no hay
 * examen de verbal de la UNI; ningún ítem cita ni copia una pregunta real). Ningún par repite una palabra del par base.
 *
 * Tipos por idea (TIPOS_POR_IDEA; nivel 2 con cuatro alternativas, nivel 3 con cinco, como en un simulacro). generar(
 * semilla, { idea }) da solo los de esa idea; sin idea, las cinco con el mismo peso.
 *   relacion-no-tema   herramienta (2) · herramienta-examen (3)
 *   parte-o-clase      inclusion (2) · inclusion-examen (3)
 *   clase-y-causa      orden (2) · orden-examen (3)
 *   sinonimo-antonimo  rasgo (2) · rasgo-examen (3)
 *   puente-justa       justa (2) · justa-examen (3)
 * Errores (docs/investigacion/razonamiento-verbal-ideas-erroneas.md): RV15, RV16, RV17, RV21 y, hipótesis de la
 * unidad, RVA1 a RVA8.
 * Datos (contrato, punto 13): el criterio de la idea (las mismas líneas que la teoría) y las glosas; nunca la respuesta.
 * _datos: { idea, tipo, nivel, item, codigos }.
 */
(function (root, fabrica) {
  const nodo = typeof module === 'object' && module.exports;
  const api = fabrica(nodo ? require('../../nucleo/azar.js') : root.Azar, nodo ? require('../../nucleo/predicciones.js') : root.Predicciones);
  if (nodo) module.exports = api;
  else (root.Generadores = root.Generadores || {})[api.id] = api;
})(typeof self !== 'undefined' ? self : this, function (Azar, P) {
  'use strict';
  const ID = 'analogias';
  const FUENTE = 'docs/investigacion/razonamiento-verbal-ideas-erroneas.md';
  const RESPALDO = { RV15: 'parcial', RV16: 'parcial', RV17: 'parcial' };
  const err = (id, explicacion) => ({ id, explicacion, respaldo: RESPALDO[id] || 'hipotesis', fuente: FUENTE });
  // Las incorrectas que se muestran: k al azar, de modo que la correcta no sea la más larga ni la más corta (lección de
  // la auditoría de Definiciones). Si ninguna mezcla sirve, el banco no cuadra y se lanza un error.
  function elegir(rng, malas, k, correcta) {
    const sirve = xs => { const l = xs.map(x => x.t.length), c = correcta.length; return c < Math.max(...l) && c > Math.min(...l); };
    for (let n = 0; n < 60; n++) { const xs = rng.barajar(malas).slice(0, k); if (sirve(xs)) return xs; }
    throw new Error(`${ID}: con «${correcta}» ninguna mezcla deja la correcta entre la más corta y la más larga`);
  }
  const partes = t => t.split(' : ');

  // Las líneas de datos, las mismas de la teoría.
  const D_PUENTE = 'Oración puente: frase corta que dice cómo se une el par base; vale también para el otro par.';
  const D_AGENTE = 'Agente e instrumento: una persona y la herramienta con que hace su trabajo.';
  const D_TEMA = 'Mismo tema: dos pares que hablan de lo mismo pueden unirse de otra manera.';
  const D_VAGA = 'Oración muy amplia: «usa» o «tiene que ver con» valen para casi cualquier par.';
  const D_CLASE = 'Género y especie: todo lo que nombra una palabra es lo que nombra la otra (todo gato es un animal).';
  const D_PARTE = 'Parte y todo: una palabra nombra una pieza que, con otras distintas, forma lo que nombra la otra.';
  const D_GRUPO = 'Elemento y conjunto: la otra palabra nombra muchos iguales a la primera, juntos.';
  const D_CAUSA = 'Causa y efecto: una cosa produce la otra; la que produce es la causa.';
  const D_ORDEN = 'Mismo orden: lo que va primero en el par base va primero en el otro par.';
  const D_SUCESION = 'Sucesión: una cosa viene después de otra sin que la primera la produzca.';
  const D_SIN = 'Sinónimos: dicen casi lo mismo del mismo rasgo.';
  const D_ANT = 'Antónimos: dicen lo opuesto del mismo rasgo.';
  const D_OTRO = 'Otro rasgo: dos palabras que hablan de cosas distintas no son sinónimos ni antónimos.';
  const D_GRADO = 'Intensidad: las dos dicen lo mismo del rasgo, pero una con más fuerza que la otra.';
  const D_JUSTA = 'Oración puente justa: vale para el par base y para un solo par de las alternativas.';
  const D_AMPLIA = 'Muy amplia: la oración puente deja pasar a más de un par.';
  const D_CAT = 'Categoría gramatical: sustantivo (nombra algo), verbo (dice una acción) o adjetivo (dice cómo es algo).';

  // ---------------- El banco ----------------
  // Cada ítem: { id, base: [par, relación], alts: [[par, relación, nota?], …] } con cuatro incorrectas. Relaciones:
  //   idea 1: H persona y herramienta de su oficio · LUG su lugar · OBR lo que hace · MAT su material · USA alguien que
  //           usa algo sin que sea su trabajo · SINP herramienta y aquello sobre lo que actúa, sin persona · TEMA
  //   idea 2: CLASE especie y género · PARTE pieza de un todo · GRUPO uno de muchos iguales · TEMA · H, OBR (otra)
  //   idea 3: CE causa y efecto · EC efecto y causa · SUC sucesión · TEMA · H, OBR, LLEVA (otra)
  //   idea 4: SIN · ANT · MAS mismo rasgo, de menos a más · MENOS de más a menos · OTRO rasgos distintos · TEMA
  //   idea 5: PLUGAR persona y lugar donde trabaja · PVEH persona y vehículo que conduce · PACC persona y su acción ·
  //           IACC instrumento y su acción · IMIDE instrumento y lo que mide · CUIDA persona y lo que cuida, y sus
  //           vueltas (LUGARP, VEHP, ACCP, ACCI, MIDEI); PESTA, PVA, IUSO (pasan una oración vaga); PSUSTACC, ISUST
  //           (la acción dicha con un sustantivo); TEMA; H, LLEVA, OTRA (otra relación). En la idea 5, la nota dice el
  //           motivo de cada incorrecta.
  const HERR = [
    { id: 'estetoscopio', base: ['médico : estetoscopio', 'H'], alts: [['herrero : tenaza', 'H'], ['enfermo : jarabe', 'USA'], ['dentista : consultorio', 'LUG'], ['jeringa : brazo', 'SINP'], ['receta : farmacia', 'TEMA']] },
    { id: 'anzuelo', base: ['pescador : anzuelo', 'H'], alts: [['músico : violín', 'H'], ['muelle : bote', 'TEMA'], ['cocinero : sopa', 'OBR'], ['bañista : flotador', 'USA'], ['cuchillo : pan', 'SINP']] },
    { id: 'sierra', base: ['leñador : sierra', 'H'], alts: [['relojero : pinza', 'H'], ['leña : estufa', 'TEMA'], ['maderero : aserradero', 'LUG'], ['niño : columpio', 'USA'], ['tijera : tela', 'SINP']] },
    { id: 'lazo', base: ['ganadero : lazo', 'H'], alts: [['pintora : rodillo', 'H'], ['vaca : pasto', 'TEMA'], ['quesera : queso', 'OBR'], ['turista : sombrero', 'USA'], ['pala : tierra', 'SINP']] },
    { id: 'computadora', base: ['secretaria : computadora', 'H'], alts: [['bombero : hacha', 'H'], ['tinta : hoja', 'TEMA'], ['escritora : novela', 'OBR'], ['estudiante : celular', 'USA'], ['grapadora : papel', 'SINP']] },
    { id: 'manguera', base: ['jardinera : manguera', 'H'], alts: [['cocinero : batidora', 'H'], ['flor : maceta', 'TEMA'], ['florista : ramo', 'OBR'], ['peatón : paraguas de colores', 'USA'], ['escoba : polvo', 'SINP']] },
  ];
  const INCL = [
    { id: 'iguana', base: ['iguana : reptil', 'CLASE'], alts: [['vicuña : camélido', 'CLASE'], ['caparazón : tortuga', 'PARTE'], ['estrella : galaxia', 'GRUPO'], ['sol : desierto', 'TEMA'], ['cazador : trampa', 'H']],
      datos: ['Camélido: animal como la llama, la alpaca o la vicuña.'] },
    { id: 'teclado', base: ['teclado : computadora', 'PARTE'], alts: [['puerta : ropero', 'PARTE'], ['laptop : aparato', 'CLASE'], ['isla : archipiélago', 'GRUPO'], ['cable : luz', 'TEMA'], ['técnico : destornillador', 'H']] },
    { id: 'roble', base: ['roble : árbol', 'CLASE'], alts: [['margarita : flor', 'CLASE'], ['raíz : planta', 'PARTE'], ['pino : pinar', 'GRUPO'], ['hacha : bosque', 'TEMA'], ['leñador : motosierra', 'H']],
      datos: ['Pinar: terreno con muchos pinos.'] },
    { id: 'promocion', base: ['estudiante : promoción', 'GRUPO'], alts: [['cerro : cordillera', 'GRUPO'], ['carpeta : mueble', 'CLASE'], ['tapa : cuaderno', 'PARTE'], ['tiza : pizarra', 'TEMA'], ['profesora : pizarra acrílica', 'H']] },
    { id: 'aspa', base: ['aspa : molino', 'PARTE'], alts: [['cuello : camisa', 'PARTE'], ['blusa : prenda', 'CLASE'], ['trigo : trigal', 'GRUPO'], ['viento : cometa', 'TEMA'], ['molinero : harina', 'OBR']],
      datos: ['Trigal: campo sembrado con mucho trigo.'] },
    { id: 'flota', base: ['bus : flota', 'GRUPO'], alts: [['carro : caravana', 'GRUPO'], ['camioneta : vehículo', 'CLASE'], ['llanta : camión', 'PARTE'], ['pasaje : boleto', 'TEMA'], ['piloto : timón', 'H']],
      datos: ['Caravana: fila de muchos carros que viajan juntos.'] },
  ];
  const ORDEN = [
    { id: 'contaminacion', base: ['contaminación : enfermedad', 'CE'], alts: [['erosión : derrumbe', 'CE'], ['tos : gripe', 'EC'], ['agosto : setiembre', 'SUC'], ['basura : río', 'TEMA'], ['médico : estetoscopio', 'H']] },
    { id: 'bostezo', base: ['bostezo : sueño', 'EC'], alts: [['temblor : frío', 'EC'], ['susto : grito', 'CE'], ['abril : mayo', 'SUC'], ['cama : sábana', 'TEMA'], ['tejedor : telar', 'H']] },
    { id: 'ceniza', base: ['fuego : ceniza', 'CE'], alts: [['rayo : apagón', 'CE'], ['charco : aguacero', 'EC'], ['noche : alba', 'SUC'], ['fogón : olla', 'TEMA'], ['bombero : casco', 'LLEVA']] },
    { id: 'sudor', base: ['sudor : ejercicio', 'EC'], alts: [['risa : cosquillas', 'EC'], ['calor : sed', 'CE'], ['lonche : cena', 'SUC'], ['zapatilla : pista atlética', 'TEMA'], ['atleta : medalla', 'OBR']] },
    { id: 'hongo', base: ['humedad : hongo', 'CE'], alts: [['vacuna : defensa', 'CE'], ['vómito : indigestión', 'EC'], ['sábado : domingo', 'SUC'], ['pared : pintura', 'TEMA'], ['pintor : rodillo', 'H']] },
    { id: 'aplauso', base: ['aplauso : gol', 'EC'], alts: [['llanto : cebolla', 'EC'], ['lluvia : arcoíris', 'CE'], ['junio : julio', 'SUC'], ['arco : red', 'TEMA'], ['árbitro : silbato', 'H']] },
  ];
  const RASGO = [
    { id: 'comico', base: ['cómico : gracioso', 'SIN'], alts: [['viejo : anciano', 'SIN'], ['nuevo : usado', 'ANT'], ['joven : azul', 'OTRO'], ['grande : inmenso', 'MAS'], ['bufón : chiste', 'TEMA']] },
    { id: 'ruidoso', base: ['ruidoso : silencioso', 'ANT'], alts: [['duro : blando', 'ANT'], ['alto : elevado', 'SIN'], ['murmullo : grito', 'MAS'], ['dulce : frío', 'OTRO'], ['bocina : tráfico', 'TEMA']] },
    { id: 'fresco', base: ['fresco : helado', 'MAS'], alts: [['molesto : furioso', 'MAS'], ['enfurecido : enojado', 'MENOS'], ['frío : caliente', 'ANT'], ['nevado : cumbre', 'TEMA'], ['calvo : azul', 'OTRO']] },
    { id: 'aterrado', base: ['aterrado : asustado', 'MENOS'], alts: [['diluvio : lluvia', 'MENOS'], ['miedo : pánico', 'MAS'], ['valiente : miedoso', 'ANT'], ['susto : temor', 'SIN'], ['película : terror', 'TEMA']] },
    { id: 'triste', base: ['triste : apenado', 'SIN'], alts: [['lindo : bonito', 'SIN'], ['feo : bello', 'ANT'], ['grande : verde', 'OTRO'], ['bueno : buenísimo', 'MAS'], ['lágrima : pañuelo', 'TEMA']] },
    { id: 'subir', base: ['subir : bajar', 'ANT'], alts: [['entrar : salir', 'ANT'], ['empezar : iniciar', 'SIN'], ['caminar : correr', 'MAS'], ['oír : leer', 'OTRO'], ['escalera : piso', 'TEMA']] },
  ];
  const JUSTA = [
    { id: 'carpintero', base: ['carpintero : taller', 'PLUGAR'], alts: [['cocinera : comedor', 'PLUGAR'], ['estudio : fotógrafo', 'LUGARP', 'Es un lugar y quien trabaja ahí, bien; pero al revés.'],
      ['paciente : clínica', 'PESTA', 'El paciente está en la clínica, pero no trabaja ahí: «está en» es muy amplia.'], ['vendedor : vender', 'PACC', '«Vender» es una acción, no un lugar: otra categoría gramatical.'],
      ['madera : aserrín', 'TEMA', 'Son del mismo tema que el carpintero, pero no son una persona y su lugar.']] },
    { id: 'avioneta', base: ['piloto : avioneta', 'PVEH'], alts: [['conductora : micro', 'PVEH'], ['tren : maquinista', 'VEHP', 'Es un vehículo y quien lo conduce, bien; pero al revés.'],
      ['turista : lancha', 'PVA', 'El turista va en la lancha, pero no la conduce: «va en» es muy amplia.'], ['manejar : volante', 'ACCI', '«Manejar» es una acción: otra categoría gramatical, y no conduce nada.'],
      ['aeropuerto : torre de control', 'TEMA', 'Son del mismo tema que el piloto, pero ninguno conduce al otro.']] },
    { id: 'escritor', base: ['escritor : escribir', 'PACC'], alts: [['jugador : jugar', 'PACC'], ['dibujar : dibujante', 'ACCP', 'Es una persona y su acción, bien; pero al revés.'],
      ['pintor : pintura', 'PSUSTACC', 'El pintor hace la pintura, bien; pero «pintura» nombra una cosa, no una acción.'], ['tinta : hoja', 'TEMA', 'Son del mismo tema que el escritor, pero no son una persona y su acción.'],
      ['ciclista : casco', 'LLEVA', 'Es una persona y lo que lleva puesto: otra relación.']] },
    { id: 'aguja', base: ['aguja : coser', 'IACC'], alts: [['regadera : regar', 'IACC'], ['planchar : plancha', 'ACCI', 'Es una herramienta y su acción, bien; pero al revés.'],
      ['escoba : limpieza', 'ISUST', 'La escoba sirve para limpiar, bien; pero «limpieza» nombra una cosa, no una acción.'], ['tela : botón', 'TEMA', 'Son del mismo tema que la aguja, pero no son una herramienta y su acción.'],
      ['libro : estante', 'OTRA', 'El libro va en el estante: otra relación.']] },
    { id: 'reloj', base: ['reloj : tiempo', 'IMIDE'], alts: [['metro : longitud', 'IMIDE'], ['temperatura : termómetro', 'MIDEI', 'Es un instrumento y lo que mide, bien; pero al revés.'],
      ['cronómetro : contar', 'IACC', '«Contar» es una acción: otra categoría gramatical, no lo que se mide.'], ['mochila : viaje', 'IUSO', 'La mochila sirve en un viaje, pero no lo mide: «sirve para» es muy amplia.'],
      ['pulsera : muñeca', 'TEMA', 'Son del mismo tema que el reloj, pero no son un instrumento y lo que mide.']] },
    { id: 'enfermera', base: ['enfermera : pacientes', 'CUIDA'], alts: [['cuidadora : ancianos', 'CUIDA'], ['vigilar : guardián', 'ACCP', 'Es una persona que cuida, bien; pero al revés: la acción va primero.'],
      ['paciente : hospital', 'PESTA', 'El paciente está en el hospital, pero no cuida a nadie ahí: «está en» es muy amplia.'], ['jeringa : vacuna', 'TEMA', 'Son del mismo tema que la enfermera, pero no son alguien y lo que cuida.'],
      ['médico : estetoscopio', 'H', 'Es una persona y su herramienta: otra relación.']] },
  ];

  // ---------------- El código y la explicación de cada incorrecta, por su relación ----------------
  const VUELTA = { CE: 'EC', EC: 'CE', MAS: 'MENOS', MENOS: 'MAS', PLUGAR: 'LUGARP', PVEH: 'VEHP', PACC: 'ACCP', IACC: 'ACCI', IMIDE: 'MIDEI', CUIDA: 'ACCP' };
  const NOMBRE2 = { CLASE: 'clase', PARTE: 'parte', GRUPO: 'grupo' };
  function codigo(tb, t) {
    if (VUELTA[tb] === t) return 'RV16';
    if (t === 'TEMA') return 'RV15';
    if (['H'].includes(tb)) return { LUG: 'RV17', OBR: 'RV17', MAT: 'RV17', USA: 'RVA5', SINP: 'RVA8' }[t];
    if (NOMBRE2[tb]) return { CLASE: 'RVA2', PARTE: 'RVA6', GRUPO: 'RVA7' }[t] || 'RV17';
    if (tb === 'CE' || tb === 'EC') return t === 'SUC' ? 'RVA1' : 'RV17';
    if (['SIN', 'ANT', 'MAS', 'MENOS'].includes(tb)) {
      if (t === 'OTRO') return 'RV21';
      if (t === 'MAS' || t === 'MENOS' || (tb !== 'SIN' && tb !== 'ANT' && t === 'ANT')) return 'RVA3';
      return 'RV17';
    }
    if (['PESTA', 'PVA', 'IUSO'].includes(t)) return 'RVA5';
    if (['PSUSTACC', 'ISUST', 'PACC', 'IACC', 'ACCI'].includes(t)) return 'RVA4';
    return 'RV17';
  }
  function explicar(tb, t, par, nota) {
    if (nota) return nota;
    const [a, b] = partes(par);
    if (t === 'TEMA') return `«${a}» y «${b}» son del mismo tema que el par base, pero no se unen como él.`;
    if (tb === 'H') return {
      LUG: `Hay una persona, bien; pero «${b}» es el lugar donde trabaja, no su herramienta.`,
      OBR: `Hay una persona, bien; pero «${b}» es lo que hace, no su herramienta.`,
      MAT: `Hay una persona, bien; pero «${b}» es su material, no su herramienta.`,
      USA: `«${a}» usa «${b}», pero no como herramienta de su trabajo: «usa» es muy amplia.`,
      SINP: `«${a}» es una herramienta, pero falta la persona que trabaja con ella.`,
    }[t];
    if (NOMBRE2[tb]) return {
      CLASE: `Todo lo que es «${a}» es «${b}»: es de clase, no de ${NOMBRE2[tb]}.`,
      PARTE: `«${a}» es una pieza de «${b}»: es de parte, no de ${NOMBRE2[tb]}.`,
      GRUPO: `«${b}» se forma con muchos iguales a «${a}»: es de grupo, no de ${NOMBRE2[tb]}.`,
    }[t] || 'Es otra relación: no es de clase, ni de parte, ni de grupo.';
    if (tb === 'CE' || tb === 'EC') {
      if (VUELTA[tb] === t) return tb === 'CE' ? `Es causa y efecto, bien; pero «${b}» produce «${a}»: al revés del par base.` : `Es causa y efecto, bien; pero «${a}» produce «${b}»: la causa primero, al revés del par base.`;
      if (t === 'SUC') return `«${b}» viene después de «${a}», pero «${a}» no lo produce: es sucesión.`;
      return 'Es otra relación, no la de causa y efecto.';
    }
    if (VUELTA[tb] === t) return 'Es intensidad, bien; pero va en el sentido contrario: al revés del par base.';
    if (t === 'OTRO') return `«${a}» y «${b}» hablan de rasgos distintos: no son sinónimos ni antónimos.`;
    if (t === 'SIN') return 'Hablan del mismo rasgo, bien; pero dicen casi lo mismo: son sinónimos.';
    if (t === 'ANT') return 'Hablan del mismo rasgo, bien; pero dicen lo opuesto: son antónimos.';
    return 'Hablan del mismo rasgo, bien; pero una dice más que la otra: es intensidad.';
  }

  const IDEA_BANCO = { herramienta: HERR, inclusion: INCL, orden: ORDEN, rasgo: RASGO, justa: JUSTA };
  const DATOS = {
    herramienta: [D_PUENTE, D_AGENTE, D_TEMA, D_VAGA],
    inclusion: [D_CLASE, D_PARTE, D_GRUPO],
    orden: [D_CAUSA, D_ORDEN, D_SUCESION],
    rasgo: [D_SIN, D_ANT, D_OTRO, D_GRADO],
    justa: [D_JUSTA, D_AMPLIA, D_CAT, D_ORDEN],
  };
  const SOLUCION = {
    herramienta: ok => [`«${ok}» cumple la oración del par base: una persona y la herramienta con que trabaja.`, 'Las otras hablan del mismo tema, unen a la persona con otra cosa, solo usan algo o no tienen persona.'],
    inclusion: ok => [`«${ok}» se une como el par base: se prueban «todo… es un…», «… es una pieza de…» y «muchos… forman…».`, 'Las otras son de otra de esas tres relaciones, del mismo tema o de otra relación.'],
    orden: ok => [`«${ok}» es causa y efecto en el mismo orden que el par base.`, 'Las otras van al revés, solo vienen después, son del mismo tema o se unen de otra manera.'],
    rasgo: ok => [`«${ok}» habla de un mismo rasgo y se une como el par base.`, 'Las otras son de otra relación del rasgo, hablan de rasgos distintos o son del mismo tema.'],
    justa: ok => [`«${ok}» cumple una oración puente justa del par base: no pasa ningún otro par.`, 'Las otras van al revés, cambian la categoría gramatical, pasan solo una oración muy amplia o son del mismo tema.'],
  };
  function tPar(rng, base, examen) {
    const it = rng.elegir(IDEA_BANCO[base]), [bp, tb] = it.base;
    const buenas = it.alts.filter(x => x[1] === tb);
    if (buenas.length !== 1) throw new Error(`${ID}: en «${it.id}» hay ${buenas.length} con la relación del par base`);
    const malas = it.alts.filter(x => x[1] !== tb).map(([t, rel, nota]) => ({ t, rel, nota, cod: codigo(tb, rel) }));
    const cods = malas.map(m => m.cod);
    if (cods.some(c => !c) || new Set(cods).size !== cods.length) throw new Error(`${ID}: en «${it.id}» los códigos no son distintos (${cods})`);
    const bw = partes(bp);
    for (const x of it.alts) if (partes(x[0]).some(w => bw.includes(w))) throw new Error(`${ID}: en «${it.id}», «${x[0]}» repite una palabra del par base`);
    const ok = buenas[0][0];
    const errores = elegir(rng, malas, examen ? 4 : 3, ok).map(m => Object.assign({ clave: `par:${m.t}`, texto: m.t }, err(m.cod, explicar(tb, m.rel, m.t, m.nota))));
    return {
      enunciado: [examen ? 'Pregunta de analogías del simulacro.' : 'Analogía.'],
      pregunta: [`Par base: «${bp.toUpperCase()}». ¿Qué par guarda la misma relación?`],
      datos: DATOS[base].concat(it.datos || []), correcta: ok, errores,
      solucion: SOLUCION[base](ok).map(t => [t]),
      _datos: { item: it.id },
    };
  }

  // ---------------- Tipos por idea ----------------
  const CONSTRUIR = {};
  for (const b of Object.keys(IDEA_BANCO)) { CONSTRUIR[b] = rng => tPar(rng, b, false); CONSTRUIR[`${b}-examen`] = rng => tPar(rng, b, true); }
  const TIPOS_POR_IDEA = {
    'relacion-no-tema': ['herramienta', 'herramienta-examen'],
    'parte-o-clase': ['inclusion', 'inclusion-examen'],
    'clase-y-causa': ['orden', 'orden-examen'],
    'sinonimo-antonimo': ['rasgo', 'rasgo-examen'],
    'puente-justa': ['justa', 'justa-examen'],
  };
  const IDEAS = Object.keys(TIPOS_POR_IDEA);
  const IDEA_DE = Object.fromEntries(IDEAS.flatMap(i => TIPOS_POR_IDEA[i].map(t => [t, i])));
  const NIVEL = Object.fromEntries(Object.keys(CONSTRUIR).map(t => [t, /examen/.test(t) ? 3 : 2]));
  // Papel (regla 6; herramientas/papel-generador.js toma «papel-1» a «papel-8»): las cinco ideas, de menos a más.
  const PAPEL = { 'papel-1': 'herramienta', 'papel-2': 'inclusion', 'papel-3': 'orden', 'papel-4': 'rasgo', 'papel-5': 'justa',
    'papel-6': 'inclusion-examen', 'papel-7': 'orden-examen', 'papel-8': 'justa-examen' };

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

  return { id: ID, titulo: 'Analogías', generar, TIPOS_POR_IDEA, NIVEL, TIPOS: Object.keys(CONSTRUIR), HERR, INCL, ORDEN, RASGO, JUSTA, codigo };
});
