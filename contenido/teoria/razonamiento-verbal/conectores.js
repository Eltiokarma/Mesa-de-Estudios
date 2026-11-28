/*
 * Teoría de «Conectores lógico-textuales» (razonamiento-verbal.conectores). Molde: docs/teoria.md y docs/molde-unidad.md.
 * Se rehace por el contrato «se entiende sin profesor» (etapa 8, docs/plan-calidad.md §7), con la propuesta de
 * docs/etapa8/propuesta-verbal.md como guion (Gerson delegó el criterio y revisa después):
 *   1. relacion-primero    «Primero la relación, después el conector»   rehecha el 19 nov (conserva su id y el avance)
 *   2. causa-consecuencia  «Causa o consecuencia: el orden»              nueva
 *   3. clases              «Cada espacio pide una clase»                 rehecha (conserva su id)
 *   4. locuciones          «Varias palabras, un conector»                rehecha (conserva su id)
 *   5. varios-espacios     «Varios espacios, una alternativa»            nueva
 * Es la primera unidad de la rama «Oraciones y orden». No adelanta Cohesión y coherencia (cohesión, referente,
 * pronombres), Plan de redacción (marcador de tiempo, ordenar un texto) ni Eliminación de oraciones; no usa «pista» ni
 * «contexto» (términos de Sentido contextual) ni «conclusión» (de Inferencias): la clase de «en resumen» es el cierre.
 * Objeto de la primera pantalla en verbal: el texto en su soporte, con quién lo escribe y para quién (rv-soporte, con sus
 * oraciones en trozos para marcar el espacio del conector dentro de su renglón). Textos, avisos y mensajes propios
 * (regla 5): ninguno copia un examen ni un manual. San Marcos no pregunta conectores (docs/clasificacion-unmsm-admision.md);
 * el nivel 3 sigue la forma que se supone de la UNI (un texto con uno, dos o tres espacios y cinco alternativas con un
 * conector por espacio), como hipótesis: en el repo no hay examen de verbal de la UNI.
 *
 * Ficha de tarea (diseno-y-animacion):
 *   Promesa: elegir el conector por la relación entre las dos ideas, no por cómo suena.
 *   Persona y condiciones: postulante de 5.º o preuniversitario, celular de gama baja, sin audio, sin profesor.
 *   Resultado observable: pone un conector en el espacio, marca lo que decide la relación y dice por qué falla otro.
 *   Orden de atención: 1.º el espacio en negrita · 2.º lo que hace esperar la primera idea · 3.º si la segunda lo
 *   cumple, lo rompe o suma · acción: tocar la oración.
 *   Estados: conector que marca la relación (violeta) · que marca otra (naranja) · lo que decide (turquesa) · tachado.
 *   Duda que resuelve: ¿por qué «por eso» no va en «estudió toda la semana; ¿…?, el examen le pareció difícil»?
 *
 * Colores (regla 4; paleta de lectura con papel fijo en todo verbal, como en Sentido contextual): lo que decide la
 * relación, i (turquesa, continuo: la evidencia); el conector que se prueba y marca otra relación, con su motivo, o
 * (naranja, a trazos: el distractor); el que marca la relación y la respuesta, f (violeta, punteado); lo descartado, gris
 * con raya de tinta. El espacio «¿…?» o el conector por el que se pregunta va en negrita y en tinta. Sin verde ni carmín.
 * Las letras de las alternativas que nombra un resuelto van en negrita (mala, buena). Lo comprueba conectores.test.js.
 * Códigos (docs/investigacion/razonamiento-verbal-ideas-erroneas.md y contenido/razonamiento-verbal/codigos.json): RV23
 * (se completa sin mirar el conector), RV24 (contracausal leído como causal), RV25 (concesivo escrito por causal), RV26
 * (aditivo por contraste), RV35 (otra clase por descarte) y, como hipótesis de esta unidad, RVC1 (causa y consecuencia al
 * revés), RVC2 (contraste donde nada se opone), RVC3 («aunque» delante de lo que pasó igual), RVC4 (un solo espacio),
 * RVC5 (aditivo donde la segunda sale de la primera) y RVC6 (causa donde solo se suma o se sigue).
 * Qué relación pide cada espacio y cuál marca cada conector en los juegos lo calcula el código con un mundo chico
 * (regla 1). Los ejemplos, los «Así se resuelve», los «Ahora tú» y las predicciones se revisaron con un script aparte que
 * no usa el código de la unidad (scratchpad e8-rv/rev/revisa.js): un léxico propio da a cada conector su relación y a cada
 * espacio la que pide, y comprueba que solo una alternativa cumple en todos los espacios, que cada explicación dice la
 * relación que su conector marca, y que la correcta no es la más larga, ni la más corta, ni la única escrita dentro de
 * otra.
 */
(function (root, fabrica) {
  const def = fabrica(typeof module === 'object' && module.exports ? require('../../../nucleo/kit/kit.js') : root.Kit);
  if (typeof module === 'object' && module.exports) module.exports = def;
  else root.Teoria.unidad(def);
})(typeof self !== 'undefined' ? self : this, function (Kit) {
  'use strict';
  // ---------- Ayudantes (los de Sentido contextual) ----------
  // Un trozo de color largo puede partirse en renglones (largo: true); si no, en el celular se sale a lo ancho.
  const pinto = v => t => (String(t).length > 14 ? { v, t, largo: true } : { v, t });
  const cubre = pinto('c-i'), prop = pinto('c-o'), justo = pinto('c-f');
  // La letra de una alternativa, en negrita (Gerson, mesa del 17 nov): la descartada en naranja y la correcta en violeta.
  // El U+2060 (invisible) evita que la letra sola salga en cursiva, como una variable (nucleo/ecuacion.js, LETRA).
  const mala = L => ({ v: 'c-o', t: `${L}⁠` }), buena = L => ({ v: 'c-f', t: `${L}⁠` });
  const opciones = (c, malas) => [{ id: 'c', texto: c, correcta: true }, ...malas.map(([texto, error, siFuera], k) => ({ id: `e${k}`, texto, error, siFuera }))];
  const voltear = (arr, s) => (s % 2 ? arr.slice().reverse() : arr.slice());
  const sinMision = j => Object.fromEntries(Object.entries(j).filter(([k]) => k !== 'mision'));
  const LETRAS = 'ABCDE';
  const fig = sop => ({ pieza: 'rv-soporte', datos: sop, estado: {} });
  const may = t => t.charAt(0).toUpperCase() + t.slice(1);
  const HUECO = '¿…?';

  // Una oración en trozos (rv-soporte, etapa 7): «[w:¿…?]» es el espacio del conector (o el conector por el que se
  // pregunta), en negrita; «[x:…]» e «[y:…]», el segundo y el tercer espacio de un texto con varios; «[p:…]» y «[q:…]» son
  // lo que decide la relación (turquesa al resolver). Con `w`, el espacio toma otro texto; con `reserva`, su lugar guarda
  // el ancho del más largo (el juego cambia el conector sin mover el texto).
  //   oracion('n1', 'Ana estudió toda la semana; [w:¿…?] [p:el examen le pareció fácil].')
  // La puntuación junto al espacio no delata el conector (cierre, 20 nov: «; ¿…? la cosecha» solo admitía «por eso» y
  // «¿…?,» pedía uno con coma). Dentro de la oración, el espacio va siempre tras una coma y sin coma después; al empezar
  // la oración, sin coma. El espacio del final (lo que completa la idea) no cambia. Los conectores del juego traen su
  // propia coma, como en el examen.
  function neutro(pl) {
    let out = '', i = 0, m;
    const re = /\[[wxy]:¿…\?(?: \(\d\))?\]/g;
    while ((m = re.exec(pl))) {
      let antes = pl.slice(i, m.index), despues = pl.slice(m.index + m[0].length);
      if (!/^\s*\.?\s*$/.test(despues) && !/^\./.test(despues)) {
        const previo = (out + antes).replace(/\s+$/, '');
        if (previo && !/[.:]$/.test(previo)) antes = antes.replace(/\s*[;,]?\s*$/, '') + ', ';
        if (/^,/.test(despues)) { pl = pl.slice(0, m.index + m[0].length) + despues.slice(1); }
      }
      out += antes + m[0];
      i = m.index + m[0].length;
    }
    return out + pl.slice(i);
  }
  function oracion(id, plantilla0, w, reserva) {
    const plantilla = neutro(plantilla0);
    const frags = [];
    let k = 0;
    for (const m of plantilla.split(/(\[[wxypq]:[^\]]+\])/)) {
      const e = m.match(/^\[([wxypq]):([^\]]+)\]$/);
      if (e) {
        const negra = 'wxy'.includes(e[1]);
        frags.push(Object.assign({ id: `${id}${e[1]}`, t: e[1] === 'w' && w !== undefined ? w : e[2] }, negra ? { negrita: true } : {}, e[1] === 'w' && reserva ? { reserva } : {}));
      } else if (m.trim()) frags.push({ id: `${id}t${k++}`, t: m.trim() });
    }
    const t = plantilla.replace(/\[w:([^\]]+)\]/, (_, x) => (w !== undefined ? w : x)).replace(/\[[xypq]:([^\]]+)\]/g, '$1');
    return { id, t, frags };
  }
  // Una oración que sigue tras «:», «;» o «,» va en el mismo número (lección M7 de Sentido contextual).
  const juntar = lista => lista.reduce((a, t) => { const u = a[a.length - 1];
    if (typeof t === 'string' && typeof u === 'string' && /[:;,]$/.test(u)) a[a.length - 1] = `${u} ${t}`; else a.push(t); return a; }, []);
  const ors = (pre, lista) => juntar(lista).map((t, k) => (typeof t === 'string' ? oracion(`${pre}${k + 1}`, t) : t));
  // Ids de lo que decide en una oración en trozos.
  const pistasDe = o => o.frags.filter(f => /[pq]$/.test(f.id) && f.id.length === o.id.length + 1).map(f => f.id);
  const papel = (soporte, lugar, titulo, de, para, oraciones, extra) => Object.assign({ soporte, lugar, hojas: [Object.assign({ id: 'k' }, titulo ? { titulo } : {}, { de, para, oraciones })] }, extra || {});
  // La hoja de simulacro: un texto de dos o tres oraciones, la pregunta y las alternativas A–E (formato UNI, hipótesis);
  // sin alternativas, cuando son los botones de «Ahora tú».
  const P_ELIJA = 'Elige el conector que, puesto en el espacio, da al texto un sentido coherente y preciso.';
  const P_VARIOS = 'Elige la alternativa que, puesta en los espacios, da al texto un sentido coherente y preciso.';
  const P_FINAL = 'Elige lo que completa el texto con un sentido coherente.';
  const P_IGUAL = '¿Qué oración dice lo mismo que el texto?';
  const sim = (numero, oraciones, pregunta, alts) => ({ soporte: 'simulacro', numero, hojas: [{ id: 'h', titulo: 'Texto', oraciones }],
    pregunta: alts && alts.length ? pregunta || P_ELIJA : null, alternativas: (alts || []).map((t, k) => ({ id: LETRAS[k], t })) });
  // El estado de una hoja resuelta: lo que decide en turquesa, la buena en violeta y las demás tachadas.
  const pistasHoja = sop => sop.hojas.flatMap(h => (h.oraciones || []).filter(o => o.frags).flatMap(pistasDe));
  const estHoja = (sop, L) => ({ marcas: Object.assign(Object.fromEntries(pistasHoja(sop).map(id => [id, 'i'])), L ? { [L]: 'f' } : {}),
    tachar: L ? sop.alternativas.map(a => a.id).filter(id => id !== L) : [] });
  // Un cuaderno con la oración y, debajo, lo que se prueba (uno por renglón): la figura de «Mira». La oración va sin
  // número y lo que se prueba, con raya (lección M7 de Sentido contextual).
  const probador = (lugar, titulo, de, plantilla, candidatos) => papel('cuaderno', lugar, titulo, de, 'la práctica de Comunicación',
    [Object.assign(oracion('c0', plantilla), { num: '' })].concat(candidatos.map((t, k) => ({ id: `c${k + 1}`, t, num: '–' }))));
  // La palabra en negrita de una lista de oraciones (la que se pregunta).
  const palabraDe = os => { for (const o of os) { const m = o.match(/\[w:([^\]]+)\]/); if (m) return m[1]; } return null; };
  // «Así se resuelve»: el enunciado, los datos y la respuesta, armados igual en las cinco ideas.
  const resuelveDe = (R, extra, k) => Object.assign({
    enunciado: `Pregunta ${R.sop.numero} del simulacro. ${R.sop.pregunta}`,
    datos: datosPregunta(k, R.datos, R.sop.pregunta, R.sop.alternativas.map(a => a.t), R.sop), dibujo: { datos: R.sop, estado: {} },
    respuesta: [buena(R.buena), ': ', R.sop.alternativas.find(a => a.id === R.buena).t],
  }, extra);
  const pasosDe = (R, pide, regla) => [
    { tipo: 'pide', texto: pide },
    { tipo: 'datos', texto: R.tengo },
    { tipo: 'regla', texto: regla },
    { tipo: 'aplica', texto: R.malas },
    { tipo: 'aplica', texto: R.bien, dibujo: { datos: R.sop, estado: estHoja(R.sop, R.buena) } },
    { tipo: 'sentido', texto: R.sentido },
  ];

  // Las relaciones, con sus conectores entre paréntesis: la tabla entre la que se elige (contrato, punto 13). Las mismas
  // líneas en la teoría y en la práctica (plantillas/conectores/). La idea 1 dice «resultado»; la 2 presenta la causa y
  // la consecuencia, con su dirección (propuesta, decisión 2).
  // Cierre (20 nov): cada lista trae todos los conectores de esa relación que usa la unidad, el contraste dice también
  // «o se opone» (en cambio), el orden en el tiempo ya no se contradice con «antes» y el cierre junta lo dicho, sin nada
  // nuevo (no es una consecuencia ni una conclusión, que estrena Inferencias). Todas las líneas están aquí arriba.
  const D_ESPERA = 'Lo esperado: lo que la primera idea hace esperar que venga después.';
  const D_ADI = 'Adición: la segunda idea suma otra cosa en la misma dirección (además, también, asimismo, así como, además de que).';
  const D_CONT = 'Contraste: la segunda idea rompe lo esperado o se opone a la primera (pero, sin embargo, aun así, no obstante, en cambio).';
  const D_RES = 'Resultado: la segunda idea sale de la primera, como se esperaba (por eso, así que, por lo tanto, por consiguiente).';
  // Sin la lista de conectores: cuando se pregunta qué relación marca un conector, la lista sería la respuesta.
  const D_ADI0 = 'Adición: la segunda idea suma otra cosa en la misma dirección.';
  const D_CONT0 = 'Contraste: la segunda idea rompe lo esperado o se opone a la primera.';
  const D_RES0 = 'Resultado: la segunda idea sale de la primera, como se esperaba.';
  // Idea 2: la causa y la consecuencia, con su lugar junto al conector.
  const D_CAUSA = 'Causa: la razón de que pase lo otro; va justo después de «porque».';
  const D_CONSEC = 'Consecuencia: lo que resulta de la causa; va después de «por eso», «así que» o «por lo tanto».';
  const D_CAUSA0 = 'Causa: la razón de que pase lo otro.';
  const D_CONSEC0 = 'Consecuencia: lo que resulta de la causa.';
  const D_ALREVES = 'Al revés: el conector pone la causa como consecuencia, o la consecuencia como causa.';
  const D_IDEA2 = [D_CAUSA, D_CONSEC, D_CONT, D_ADI];
  // Idea 3: las clases nuevas.
  const D_EJEM = 'Ejemplificación: la segunda parte da un caso de la primera (por ejemplo).';
  const D_REFOR = 'Reformulación: la segunda parte dice lo mismo con otras palabras (es decir, o sea, en otras palabras).';
  const D_TIEMPO = 'Orden en el tiempo: dice qué pasa primero y qué pasa después (primero, antes, después, finalmente).';
  const D_CIERRE = 'Cierre: la última parte junta en una sola idea lo dicho antes (en resumen, en síntesis, en suma).';
  const D_EJEM0 = 'Ejemplificación: la segunda parte da un caso de la primera.';
  const D_REFOR0 = 'Reformulación: la segunda parte dice lo mismo con otras palabras.';
  const D_TIEMPO0 = 'Orden en el tiempo: dice qué pasa primero y qué pasa después.';
  const D_CIERRE0 = 'Cierre: la última parte junta en una sola idea lo dicho antes.';
  const D_IDEA3 = [D_EJEM, D_REFOR, D_TIEMPO, D_CIERRE];
  const D_IDEA3_0 = [D_EJEM0, D_REFOR0, D_TIEMPO0, D_CIERRE0];
  // Idea 4: las locuciones; desde aquí la causa y la consecuencia dicen de qué lado del conector va cada una.
  const D_LOCU = 'Locución conjuntiva: grupo fijo de palabras que funciona como un solo conector.';
  const D_CONCE = 'Concesión: se admite un obstáculo que no impide lo que se afirma (aunque, si bien, a pesar de que, aun cuando).';
  const D_DELANTE = 'El conector de concesión va delante del obstáculo; el de contraste, delante de lo que pasó igual.';
  const D_CAUSA4 = 'Causa: lo que sigue al conector es la razón de lo otro (porque, ya que, dado que, puesto que, como).';
  const D_CONSEC4 = 'Consecuencia: lo que sigue resulta de lo otro (por eso, así que, por lo tanto, de modo que, de manera que).';
  const D_CONCE0 = 'Concesión: se admite un obstáculo que no impide lo que se afirma.';
  const D_CAUSA40 = 'Causa: lo que sigue al conector es la razón de lo otro.';
  const D_CONSEC40 = 'Consecuencia: lo que sigue al conector resulta de lo otro.';
  const D_IDEA4 = [D_CONCE, D_DELANTE, D_CAUSA4, D_CONSEC4, D_ADI];
  // Idea 5: varios espacios.
  const D_VARIOS = 'Varios espacios: cada espacio pide su propia relación; una alternativa sirve si cada conector suyo va con la de su espacio.';
  const D_IDEA5 = [D_VARIOS, D_ADI, D_CONT, D_CAUSA4, D_CONSEC4];
  const D_IDEA5_0 = [D_VARIOS, D_ADI0, D_CONT0, D_CAUSA40, D_CONSEC40];

  // Los Datos de cada pregunta con alternativas (cierre, 20 nov; contrato, punto 13: «si el ejercicio practica elegir,
  // van las fórmulas entre las que se elige»): las líneas fijas de la idea y la de cada relación que marca alguna de sus
  // alternativas. Así ninguna alternativa se descarta solo porque su conector no está en el recuadro (antes, en 52
  // preguntas quedaban menos alternativas mirando solo los Datos), y los Datos no dicen cuál pide el espacio.
  const TABLA = [['adición', 'además de que|además|también|asimismo|así como'], ['contraste', 'sin embargo|pero|aun así|no obstante|en cambio'],
    ['consecuencia', 'por eso|así que|por lo tanto|por consiguiente|de modo que|de manera que'], ['causa', 'porque|ya que|dado que|puesto que|como'],
    ['concesión', 'aunque|si bien|a pesar de que|aun cuando'], ['ejemplo', 'por ejemplo'], ['reformulación', 'es decir|o sea|en otras palabras'],
    ['orden', 'primero|antes|después|finalmente'], ['cierre', 'en resumen|en síntesis|en suma']];
  const CONECTOR = TABLA.flatMap(([r, cs]) => cs.split('|').map(c => [c, r])).sort((a, b) => b[0].length - a[0].length);
  const LINEA = { adición: D_ADI, contraste: D_CONT, consecuencia: D_CONSEC4, causa: D_CAUSA4, concesión: D_CONCE, ejemplo: D_EJEM,
    reformulación: D_REFOR, orden: D_TIEMPO, cierre: D_CIERRE };
  // Antes de la idea 3, el caso y las otras palabras se dicen sin los nombres que esa idea estrena (orden, punto 9).
  const D_CASO = 'Un caso: la segunda parte da un caso de la primera (por ejemplo).';
  const D_OTRAS = 'Otras palabras: la segunda parte dice lo mismo de otra manera (es decir, o sea, en otras palabras).';
  const VARIANTE = { 1: { consecuencia: D_RES, ejemplo: D_CASO, reformulación: D_OTRAS }, 2: { causa: D_CAUSA, consecuencia: D_CONSEC, ejemplo: D_CASO, reformulación: D_OTRAS } };
  const FIJAS = { 1: [D_ESPERA], 2: [], 3: [], 4: [], 5: [D_VARIOS] };
  // Las relaciones que marcan los conectores escritos en unos textos (el más largo primero: «además de que» antes que
  // «además»).
  function relacionesEn(textos) {
    const rs = new Set();
    for (const t0 of textos) {
      let t = ` ${String(t0).toLowerCase().replace(/[.,;:¿?¡!«»–]/g, ' ')} `;
      for (const [c, r] of CONECTOR) if (t.includes(` ${c} `)) { rs.add(r); t = t.split(` ${c} `).join('  '); }
    }
    return TABLA.map(([r]) => r).filter(r => rs.has(r));
  }
  // k: la idea; base: las líneas de siempre (quedan para las preguntas que piden completar el final, que no traen
  // conectores en sus alternativas); textos: las alternativas; extra: el texto, en las que piden la oración que dice lo
  // mismo (su conector también se define).
  function datosDe(k, base, textos, extra) {
    const rs = relacionesEn(textos.concat(extra || []));
    if (!rs.length) return base;
    const linea = r => (VARIANTE[k] && VARIANTE[k][r]) || LINEA[r];
    return FIJAS[k].concat(rs.map(linea), k === 4 && rs.includes('concesión') ? [D_DELANTE] : []);
  }
  const pideFinal = t => /completa/.test(t) && !/alternativa/.test(t);
  const pideIgual = t => /dice lo mismo/.test(t);
  const textoDe = sop => sop.hojas.flatMap(h => (h.oraciones || []).map(o => o.t));
  // Los Datos de una pregunta: según lo que pide (un final, la oración que dice lo mismo o el conector del espacio).
  const datosPregunta = (k, base, pregunta, alternativas, sop) => (pideFinal(pregunta) ? base
    : datosDe(k, base, alternativas, pideIgual(pregunta) ? textoDe(sop) : []));
  // Los ejemplos de nivel 2 y 3: las alternativas salen de la figura o de la lista del enunciado.
  function completarDatos(ejemplos, k) {
    for (const e of ejemplos.filter(x => x.nivel > 1)) {
      const d = e.figura.datos, lista = e.enunciado.match(/«([^»]+)», «([^»]+)» o «([^»]+)»/);
      const alts = (d.alternativas || []).length ? d.alternativas.map(a => a.t) : lista ? lista.slice(1) : [];
      e.datos = datosPregunta(k, e.datos, e.enunciado, alts, d);
    }
    return ejemplos;
  }

  // ---------- Idea 1: primero la relación, después el conector (conserva su id; etapa 8) ----------
  // Cambia: el conector que entra en el espacio de cada nota. Permanece: las tres notas y lo que decide en cada una.
  // Progresa: de tres espacios a tres conectores que marcan la relación. Se reserva: el conector que ya está y anuncia lo
  // que viene (predicción): en el juego se elige el conector. Debe verse: que dos notas empiezan igual y piden conectores
  // distintos, porque el final cumple o rompe lo esperado.
  // Objeto de la primera pantalla: el mural del colegio (quién escribe: 5.º B; para quién: todo el colegio).
  // Colores: lo que decide, i; el conector que marca otra relación, o; el que marca la del espacio, f.
  // Códigos: RV23 (se completa sin mirar el conector), RV24, RV26, RV35, RVC1, RVC2, RVC5 y RVC6.

  // El juego: el mundo chico de las tres notas. Cada nota pide una relación; cada conector marca una sola.
  const REL1 = { 'por eso': 'resultado', 'sin embargo,': 'contraste', 'además,': 'adición' };
  const OPS1 = [HUECO, 'por eso', 'sin embargo,', 'además,'];
  const NOTAS1 = [
    { id: 'n1', pl: 'Ana estudió toda la semana; [w:¿…?] [p:el examen le pareció fácil].', ok: 1, pide: 'resultado', dice: 'cumple lo esperado' },
    { id: 'n2', pl: 'Luis estudió toda la semana; [w:¿…?] [p:el examen le pareció difícil].', ok: 2, pide: 'contraste', dice: 'rompe lo esperado' },
    { id: 'n3', pl: 'Para el próximo simulacro, trae tu DNI; [w:¿…?] [p:lleva dos lápices y un borrador].', ok: 3, pide: 'adición', dice: 'suma otra cosa' },
  ];
  const RES1 = 'sin embargo,';
  const va1 = (n, v) => !!v && REL1[OPS1[v]] === n.pide;
  const mural1 = val => papel('mural', 'Mural del colegio', 'Notas del simulacro', '5.º B', 'todo el colegio',
    NOTAS1.map(n => oracion(n.id, n.pl, OPS1[val[n.id] || 0], RES1)));
  const INI1 = Object.fromEntries(NOTAS1.map(n => [n.id, 0]));
  const listo1 = val => NOTAS1.every(n => va1(n, val[n.id]));
  const est1 = val => ({ marcas: Object.assign(Object.fromEntries(NOTAS1.map(n => [`${n.id}p`, 'i'])),
    Object.fromEntries(NOTAS1.filter(n => val[n.id]).map(n => [`${n.id}w`, va1(n, val[n.id]) ? 'f' : 'o']))) });
  const sinComa = t => t.replace(/,$/, '');
  const lectura1 = val => {
    if (listo1(val)) return [justo('Tres relaciones'), ': resultado, contraste y adición'];
    const k = NOTAS1.findIndex(n => val[n.id] && !va1(n, val[n.id]));
    if (k >= 0) { const n = NOTAS1[k], c = OPS1[val[n.id]]; return [prop(`«${may(sinComa(c))}»`), `: marca ${REL1[c]}; la nota ${k + 1} ${n.dice}`]; }
    const b = NOTAS1.filter(n => va1(n, val[n.id])).length;
    return b ? [justo(`${b} de 3 notas bien unidas`), '; falta probar en las otras'] : ['Toca una nota y prueba un conector en el espacio'];
  };

  // La predicción: el conector ya está y anuncia lo que viene. Sin letras en la figura: la app baraja las opciones.
  const PL_PAPA = 'Mateo [p:practicó el baile todos los días]; [q:sin embargo,] [w:¿…?].';
  const baile1 = (w, reserva) => papel('mural', 'Mural del colegio', 'El concurso de danzas', 'el club de periodismo', 'todo el colegio',
    [oracion('f1', PL_PAPA, w, reserva)]);
  const PROB1 = probador('Cuaderno de Joel', '¿Qué completa la nota?', 'Joel', PL_PAPA,
    ['bailó sin equivocarse', 'también aprendió a tocar la quena', 'ensayó el baile cada día', 'se equivocó en varios pasos']);

  // «Así se resuelve»: cuatro hojas con un texto y cinco alternativas. La buena: C, A, E y B (en la unidad, cada letra
  // cuatro veces en las 20 hojas: lección B4 de Sentido contextual). Ningún caso es de «Ahora tú» ni de los ejemplos.
  const D_IDEA1 = [D_ESPERA, D_ADI, D_CONT, D_RES];
  const PIDE1 = 'Piden el conector que une las dos ideas que rodean al espacio.';
  const REGLA1 = 'Se nombra la relación: si la segunda idea cumple lo esperado, resultado; si lo rompe, contraste; si suma otra cosa, adición.';
  const RESUELVE_1 = [
    { sop: sim(9, ors('h', ['Los transportistas de Juliaca pidieron una reunión con el alcalde.', 'Esperaron toda la mañana en la puerta de la municipalidad;', '[w:¿…?], [p:el alcalde no salió a recibirlos].']), P_ELIJA,
      ['por consiguiente', 'además', 'sin embargo', 'es decir', 'por ejemplo']), buena: 'C', pide: PIDE1,
      datos: D_IDEA1, tengo: ['Esperar toda la mañana hace esperar que el alcalde los reciba. ', cubre('«El alcalde no salió a recibirlos»'), ' rompe eso.'],
      malas: [mala('A'), ' diría que esperar hizo que no saliera. ', mala('B'), ' sumaría otra cosa. ', mala('D'), ' repetiría lo mismo con otras palabras. ', mala('E'), ' daría un caso de lo anterior.'],
      bien: [buena('C'), ': ', justo('sin embargo'), ' marca que lo esperado se rompe.'],
      sentido: 'Relee con el conector: esperaron toda la mañana; sin embargo, el alcalde no salió. Se entiende el reclamo.' },
    { sop: sim(10, ors('h', ['El puesto de doña Elsa vende el pan más barato del mercado;', '[w:¿…?], [p:sus clientes llegan desde otros barrios].', 'Los sábados, el pan se acaba antes de las nueve.']), P_ELIJA,
      ['por eso', 'sin embargo', 'o sea', 'por ejemplo', 'en cambio']), buena: 'A', pide: PIDE1,
      datos: D_IDEA1, tengo: ['Un pan barato hace esperar muchos clientes. ', cubre('«Sus clientes llegan desde otros barrios»'), ' lo cumple.'],
      malas: [mala('B'), ' y ', mala('E'), ' marcarían un contraste, y nada se rompe. ', mala('C'), ' repetiría lo mismo con otras palabras. ', mala('D'), ' daría un caso de lo anterior.'],
      bien: [buena('A'), ': ', justo('por eso'), ' marca el resultado del pan barato.'],
      sentido: 'Relee: con clientes de otros barrios, se entiende que el pan se acabe tan temprano.' },
    { sop: sim(11, ors('h', ['La posta de Lampa vacuna a los niños del barrio;', '[w:¿…?], [p:controla su peso y su talla cada mes].']), P_ELIJA,
      ['sin embargo', 'por lo tanto', 'o sea', 'aun así', 'también']), buena: 'E', pide: PIDE1,
      datos: D_IDEA1, tengo: [cubre('«Controla su peso y su talla»'), ' es otro servicio de la posta: va en la misma dirección que vacunar.'],
      malas: [mala('A'), ' y ', mala('D'), ' marcarían un contraste, y nada se opone. ', mala('B'), ' diría que vacunar hace controlar el peso. ', mala('C'), ' repetiría lo mismo.'],
      bien: [buena('E'), ': ', justo('también'), ' suma otro servicio.'],
      sentido: 'Relee: vacuna a los niños; también controla su peso. Son dos servicios, uno junto al otro.' },
    { sop: sim(12, ors('h', ['El equipo del colegio [q:entrenó poco] este año;', '[p:sin embargo,] [w:¿…?].']), P_FINAL,
      ['perdió todos sus partidos', 'ganó la copa de la provincia', 'entrenó solo los sábados', 'estrenó un uniforme nuevo', 'casi no hizo goles en todo el año']), buena: 'B',
      pide: 'Piden lo que completa el texto después de «sin embargo».',
      datos: D_IDEA1, tengo: [cubre('«Entrenó poco»'), ' hace esperar que pierda, y ', cubre('«sin embargo»'), ' anuncia que lo que sigue rompe eso.'],
      malas: [mala('A'), ' y ', mala('E'), ' cumplen lo esperado: irían con «por eso». ', mala('C'), ' repite la primera idea. ', mala('D'), ' suma otra cosa, como con «además».'],
      bien: [buena('B'), ': ', justo('ganar la copa'), ' rompe lo esperado, como anuncia el conector.'],
      sentido: 'Relee: entrenó poco; sin embargo, ganó la copa. Es una sorpresa, y eso pide el conector.' },
  ];

  // «Ahora tú»: la hoja trae el texto; las opciones son los botones. Cinco casos con cuatro opciones y uno con cinco (el cierre quitó «porque», que la idea 2 presenta). En
  // cada caso, cada incorrecta tiene un código distinto. `final`: se pide lo que completa el texto después del conector.
  const AHORA_1 = [
    { o: ['La carretera a Arequipa estuvo cerrada por un huaico;', '[w:¿…?] [p:los buses salieron con un día de retraso].'], ok: 'por eso',
      por: 'El retraso es lo que se esperaba tras el huaico: un resultado.',
      m: [['sin embargo', 'RVC2', 'Une las dos ideas, bien; pero el retraso es lo que se esperaba, no lo rompe.'],
        ['además', 'RVC5', 'Habla del viaje, bien; pero el retraso sale del huaico: no es otra cosa aparte.'],
        ['es decir', 'RV35', 'Une las dos ideas, bien; pero la segunda no repite la primera.']] },
    { o: ['Mi abuela tiene ochenta años;', '[w:¿…?], [p:camina cada mañana hasta la feria].'], ok: 'aun así',
      por: 'A esa edad se espera caminar menos; caminar cada mañana lo rompe.',
      m: [['por lo tanto', 'RV24', 'Une las dos ideas, bien; pero marca un resultado, y a esa edad se espera caminar menos.'],
        ['también', 'RV26', 'Suma una idea, bien; pero aquí la segunda va contra lo esperado.'],
        ['o sea', 'RV35', 'Une las dos ideas, bien; pero caminar no repite tener ochenta años.']] },
    { o: ['El bus a Lampa sale cada media hora;', '[p:por eso] [w:¿…?].'], ok: 'nadie espera mucho en el paradero', final: true,
      por: '«Por eso» anuncia lo esperado: con buses seguidos, nadie espera mucho.',
      m: [['muchos esperan horas en el paradero', 'RV23', 'Habla del paradero, bien; pero eso rompe lo esperado, y «por eso» anuncia que se cumple.'],
        ['el pasaje cuesta dos soles', 'RVC5', 'Es un dato del bus, bien; pero no sale de que pase seguido.'],
        ['sale dos veces cada hora', 'RV35', 'Es cierto, bien; pero repite la primera idea con otras palabras.']] },
    { o: ['Las ventanas del aula no cierran bien;', '[w:¿…?], [p:la puerta tiene la chapa rota].'], ok: 'además',
      por: 'La chapa rota es otro problema del aula, en la misma dirección.',
      m: [['por eso', 'RVC6', 'Une dos quejas, bien; pero marcaría un resultado: las ventanas no rompen la chapa.'],
        ['sin embargo', 'RVC2', 'Une las dos ideas, bien; pero nada se opone: son dos problemas.'],
        ['o sea', 'RV35', 'Une las dos ideas, bien; pero la chapa no repite lo de las ventanas.']] },
    { o: ['Ese invierno heló casi todas las noches en el altiplano;', '[p:sin embargo,] [w:¿…?].'], ok: 'la quinua de don Pedro no se dañó', final: true,
      por: '«Sin embargo» anuncia lo contrario de lo esperado tras tanta helada.',
      m: [['muchas familias perdieron su papa', 'RV23', 'Habla de la helada, bien; pero eso es lo esperado, y «sin embargo» anuncia lo contrario.'],
        ['también nevó dos veces en julio', 'RV26', 'Sigue con el invierno, bien; pero suma otra cosa, y «sin embargo» anuncia un choque.'],
        ['el frío fue muy fuerte cada noche', 'RV35', 'Habla del frío, bien; pero repite la primera idea con otras palabras.'],
        ['las familias compraron más frazadas', 'RV24', 'Habla del invierno, bien; pero es un resultado del frío, no lo rompe.']] },
    { o: ['El agua del lago estaba muy fría;', '[w:¿…?] [p:nadie quiso meterse a nadar].'], ok: 'así que',
      por: 'Con el agua tan fría, se esperaba que nadie nadara: un resultado.',
      m: [['sin embargo', 'RVC2', 'Une las dos ideas, bien; pero marca un choque, y no nadar era lo esperado.'],
        ['también', 'RVC5', 'Une las dos ideas, bien; pero suma, y no nadar sale del agua fría.'],
        ['o sea', 'RV35', 'Une las dos ideas, bien; pero no nadar no repite lo del agua.']] },
  ];

  // Ejemplos resueltos de la idea 1. La figura es el texto en su soporte, sin marcas (el espacio o el conector en
  // negrita). Nivel 1: un paso (qué relación marca un conector, si la segunda idea cumple o rompe lo esperado, si un
  // conector sirve). Nivel 2: tres conectores o tres finales de una lista. Nivel 3: la hoja de simulacro con cinco
  // alternativas; las correctas son A, B, C, D y E. Revisado aparte (scratchpad e8-rv/rev/revisa.js): solo una cumple,
  // cada distractor falla por lo que dice el resuelto y la correcta no es la más larga ni la más corta.
  const EJEMPLOS_1 = [
    { nivel: 1, titulo: 'El examen de Pedro',
      enunciado: '¿Qué relación marca «sin embargo» en el mensaje de Pedro?',
      datos: [D_ESPERA, D_ADI0, D_CONT0, D_RES0],
      figura: fig(papel('mensaje', 'Promoción 2026', null, 'Pedro', 'la promoción', ors('k', ['Repasé toda la noche;', '[w:sin embargo], [p:me olvidé las fórmulas en el examen].']))),
      solucion: [{ texto: ['Repasar toda la noche hace esperar que recuerde las fórmulas. ', cubre('«Me olvidé las fórmulas»'), ' rompe eso.'] }],
      respuesta: [justo('Contraste'), ': lo esperado se rompe'] },
    { nivel: 1, titulo: 'Las calles de Juliaca',
      enunciado: '¿La segunda idea del aviso cumple o rompe lo que hace esperar la primera?',
      datos: [D_ESPERA],
      figura: fig(papel('puerta', 'Puerta de la municipalidad de Juliaca', 'Aviso', 'la municipalidad', 'los vecinos', ors('k', ['Llovió toda la noche en Juliaca;', '[w:por eso] [p:varias calles amanecieron inundadas].', 'Eviten pasar por las calles del mercado.']))),
      solucion: [{ texto: ['Tras una noche de lluvia se espera agua en las calles; ', cubre('«amanecieron inundadas»'), ' lo cumple.'] }],
      respuesta: [justo('Lo cumple'), ': es un resultado de la lluvia'] },
    { nivel: 1, titulo: 'La librería del barrio',
      enunciado: '¿Sirve «además» en el espacio del cartel de la librería?',
      datos: [D_ADI, D_CONT, D_RES],
      figura: fig(papel('cartel', 'Cartel de una librería de Puno', 'Atendemos todo el año', 'la librería', 'los vecinos', ors('k', ['Vendemos cuadernos y lapiceros;', '[w:¿…?], [p:sacamos fotocopias a color].']))),
      solucion: [{ texto: [cubre('«Sacamos fotocopias a color»'), ' suma otro servicio de la librería, en la misma dirección: una adición.'] }],
      respuesta: [justo('Sí'), ': suma otro servicio'] },
    { nivel: 1, titulo: 'Los volantes de la feria',
      enunciado: '¿Qué hace esperar la primera idea del mensaje de la junta?',
      datos: [D_ESPERA],
      figura: fig(papel('mensaje', 'Junta vecinal Bellavista', null, 'la presidenta de la junta', 'los vecinos', ors('k', ['Repartimos volantes de la feria en todo el barrio;', '[w:¿…?], [p:llegaron muy pocos vecinos].']))),
      solucion: [{ texto: ['Repartir volantes en todo el barrio hace esperar que vaya mucha gente; ', cubre('«llegaron muy pocos»'), ' lo rompe.'] }],
      respuesta: [justo('Que lleguen muchos vecinos')] },
    { nivel: 1, titulo: 'La carrera de Lucía',
      enunciado: '¿Por qué «por eso» no sirve en el espacio de la nota del club de atletismo?',
      datos: [D_ESPERA, D_RES],
      figura: fig(papel('mural', 'Mural del colegio', 'Deportes', 'el club de atletismo', 'todo el colegio', ors('k', ['Lucía entrenó todo el año para la carrera;', '[w:¿…?], [p:llegó en el último puesto por una lesión].']))),
      solucion: [
        { texto: ['Entrenar todo el año hace esperar un buen puesto; ', cubre('«llegó en el último puesto»'), ' lo rompe.'] },
        { texto: [prop('«Por eso»'), ' marca un resultado: lo que se esperaba.'] }],
      respuesta: [justo('Porque lo esperado se rompe'), ': va un contraste'] },

    { nivel: 2, titulo: 'La helada de junio',
      enunciado: '¿Qué conector va en el espacio: «por eso», «sin embargo» o «además»?',
      datos: D_IDEA1,
      figura: fig(papel('mensaje', 'Familia Mamani', null, 'el tío Juan', 'la familia', ors('k', ['La helada de junio quemó las hojas de la quinua;', '[w:¿…?] [p:la cosecha salió muy pequeña].']))),
      solucion: [
        { texto: [cubre('«La cosecha salió muy pequeña»'), ' es lo que se esperaba tras la helada: un resultado.'] },
        { texto: [prop('«Sin embargo»'), ' anunciaría lo contrario; ', prop('«además»'), ', otra cosa aparte.'] }],
      respuesta: [justo('«Por eso»')] },
    { nivel: 2, titulo: 'El colegio sin agua',
      enunciado: '¿Qué conector va en el espacio: «por lo tanto», «aun así» o «o sea»?',
      datos: D_IDEA1,
      figura: fig(papel('puerta', 'Puerta del colegio', 'Aviso de la Dirección', 'la Dirección', 'las familias', ors('k', ['El colegio se quedó sin agua toda la semana;', '[w:¿…?], [p:las clases siguieron con normalidad].']))),
      solucion: [
        { texto: ['Sin agua se espera suspender las clases; ', cubre('«siguieron con normalidad»'), ' rompe eso.'] },
        { texto: [prop('«Por lo tanto»'), ' marcaría un resultado; ', prop('«o sea»'), ' repetiría lo mismo.'] }],
      respuesta: [justo('«Aun así»')] },
    { nivel: 2, titulo: 'El club de ciencias',
      enunciado: '¿Qué conector va en el espacio: «sin embargo», «o sea» o «además»?',
      datos: D_IDEA1,
      figura: fig(papel('mural', 'Mural del colegio', 'Clubes', 'el club de ciencias', 'los estudiantes', ors('k', ['El club de ciencias da un taller de robótica;', '[w:¿…?], [p:organiza una feria de inventos en noviembre].']))),
      solucion: [
        { texto: [cubre('«Organiza una feria de inventos»'), ' es otra actividad del club, en la misma dirección.'] },
        { texto: [prop('«Sin embargo»'), ' marcaría un choque; ', prop('«o sea»'), ' repetiría lo mismo.'] }],
      respuesta: [justo('«Además»')] },
    { nivel: 2, titulo: 'La papa cara',
      enunciado: '¿Qué completa el mensaje: «compramos menos papa», «compramos más papa» o «la papa viene de Lampa»?',
      datos: D_IDEA1,
      figura: fig(papel('mensaje', 'Familia Mamani', null, 'la mamá', 'la familia', ors('k', ['Este mes la papa subió mucho de precio;', '[p:por eso] [w:¿…?].']))),
      solucion: [
        { texto: [cubre('«Por eso»'), ' anuncia lo esperado tras la subida: comprar menos.'] },
        { texto: [prop('«Compramos más papa»'), ' lo rompe; ', prop('«la papa viene de Lampa»'), ' es otra cosa aparte.'] }],
      respuesta: [justo('«Compramos menos papa»')] },
    // Apertura (la cevichería; aperturas-para-la-teoria, 28 nov): en un contraste con «pero», pesa más lo que va
    // después. Los mismos dos datos en otro orden recomiendan cosas distintas.
    { nivel: 2, titulo: 'Lo que va después del «pero»',
      enunciado: 'Maribel pregunta en el grupo si se matricula en la academia del jirón Lima. ¿Qué mensaje la anima a ir: «el de Nilo», «el de Fiorella» o «los dos por igual»?',
      datos: D_IDEA1,
      figura: fig({ soporte: 'mensaje', lugar: 'Promoción 2026', hojas: [
        { id: 'k', de: 'Nilo', para: 'Maribel', oraciones: ors('k', ['Sus profesores explican muy bien, [w:pero] [p:la academia queda lejos].']) },
        { id: 'm', de: 'Fiorella', para: 'Maribel', oraciones: ors('m', ['La academia queda lejos, [w:pero] [p:sus profesores explican muy bien].']) }] }),
      solucion: [
        { texto: ['Los dos mensajes traen los mismos datos, la distancia y los buenos profesores, y solo cambia el orden alrededor del «pero».'] },
        { texto: ['Con «pero», pesa más lo que va después, porque corrige lo dicho antes: Fiorella termina en ', cubre('«explican muy bien»'), ' y Nilo, en ', prop('«queda lejos»'), '.'] },
        { texto: ['Fiorella recomienda ir aunque quede lejos, y Nilo advierte que la distancia pesa más. ', prop('«Los dos por igual»'), ' no mira el orden.'] }],
      respuesta: [justo('«El de Fiorella»')] },

    { nivel: 3, titulo: 'El puente viejo',
      enunciado: 'Pregunta 21 del simulacro. Elige el conector que, puesto en el espacio, da al texto un sentido coherente y preciso.',
      datos: D_IDEA1,
      figura: fig(sim(21, ors('h', ['El puente viejo de Lampa tiene más de cien años;', '[w:¿…?], [p:resiste el paso de los camiones más pesados].', 'Los vecinos lo cuidan como a un abuelo.']), P_ELIJA,
        ['aun así', 'por lo tanto', 'es decir', 'además', 'por ejemplo'])),
      solucion: [
        { texto: ['Un puente de cien años hace esperar que esté débil; ', cubre('«resiste el paso de los camiones»'), ' rompe eso.'] },
        { texto: [mala('B'), ' marcaría un resultado; ', mala('D'), ' sumaría en la misma dirección.'] },
        { texto: [mala('C'), ' repetiría lo mismo; ', mala('E'), ' daría un caso. ', buena('A'), ': ', justo('aun así'), ' marca el contraste.'] }],
      respuesta: [buena('A'), ': aun así'] },
    { nivel: 3, titulo: 'La biblioteca de noche',
      enunciado: 'Pregunta 22 del simulacro. Elige el conector que, puesto en el espacio, da al texto un sentido coherente y preciso.',
      datos: D_IDEA1,
      figura: fig(sim(22, ors('h', ['La biblioteca municipal amplió su horario hasta las nueve de la noche;', '[w:¿…?] [p:ahora más estudiantes van después del colegio].']), P_ELIJA,
        ['sin embargo', 'por eso', 'por ejemplo', 'o sea', 'en cambio'])),
      solucion: [
        { texto: [cubre('«Más estudiantes van»'), ' es lo que se espera con más horario: un resultado.'] },
        { texto: [mala('A'), ' y ', mala('E'), ' marcarían un choque. ', mala('C'), ' daría un caso; ', mala('D'), ' repetiría lo mismo.'] },
        { texto: [buena('B'), ': ', justo('por eso'), ' marca el resultado.'] }],
      respuesta: [buena('B'), ': por eso'] },
    { nivel: 3, titulo: 'La chompa de Pucará',
      enunciado: 'Pregunta 23 del simulacro. Elige el conector que, puesto en el espacio, da al texto un sentido coherente y preciso.',
      datos: D_IDEA1,
      figura: fig(sim(23, ors('h', ['Esta chompa es de fibra de alpaca;', '[w:¿…?] [p:está tejida a mano por artesanas de Pucará].']), P_ELIJA,
        ['sin embargo', 'por consiguiente', 'también', 'es decir', 'o sea'])),
      solucion: [
        { texto: [cubre('«Está tejida a mano»'), ' suma otra virtud de la chompa, en la misma dirección.'] },
        { texto: [mala('A'), ' marcaría un choque; ', mala('B'), ', un resultado de la fibra.'] },
        { texto: [mala('D'), ' y ', mala('E'), ' repetirían lo mismo. ', buena('C'), ': ', justo('también'), ' suma.'] }],
      respuesta: [buena('C'), ': también'] },
    { nivel: 3, titulo: 'El huaico de la carretera',
      enunciado: 'Pregunta 24 del simulacro. Elige lo que completa el texto con un sentido coherente.',
      datos: D_IDEA1,
      figura: fig(sim(24, ors('h', ['Los camiones de fruta llegan a Lima por la carretera central.', 'Un huaico la tapó durante dos días;', '[p:sin embargo,] [w:¿…?].']), P_FINAL,
        ['los camiones no pudieron pasar', 'también cayó granizo en la sierra', 'la carretera quedó cerrada', 'la fruta llegó a tiempo a Lima', 'la fruta llegó tarde a los mercados'])),
      solucion: [
        { texto: [mala('A'), ' y ', mala('E'), ' cumplen lo esperado: irían con «por eso».'] },
        { texto: [mala('B'), ' suma otra cosa; ', mala('C'), ' repite la primera idea.'] },
        { texto: [buena('D'), ': ', justo('llegar a tiempo'), ' rompe lo esperado, como anuncia ', cubre('«sin embargo»'), '.'] }],
      respuesta: [buena('D'), ': la fruta llegó a tiempo a Lima'] },
    { nivel: 3, titulo: 'Las lluvias de febrero',
      enunciado: 'Pregunta 25 del simulacro. Elige el conector que, puesto en el espacio, da al texto un sentido coherente y preciso.',
      datos: D_IDEA1,
      figura: fig(sim(25, ors('h', ['En febrero llovió en Puno mucho más que otros años;', '[w:¿…?], [p:el nivel del lago subió].']), P_ELIJA,
        ['no obstante', 'por ejemplo', 'en otras palabras', 'asimismo', 'por lo tanto'])),
      solucion: [
        { texto: [cubre('«El nivel del lago subió»'), ' es lo que se espera con tanta lluvia: un resultado.'] },
        { texto: [mala('A'), ' marcaría un choque; ', mala('D'), ' sumaría otra cosa.'] },
        { texto: [mala('B'), ' daría un caso; ', mala('C'), ' repetiría lo mismo. ', buena('E'), ': ', justo('por lo tanto'), '.'] }],
      respuesta: [buena('E'), ': por lo tanto'] },
  ];

  const relacion = {
    id: 'relacion-primero',
    titulo: 'Primero la relación, después el conector',
    pregunta: '¿Por qué «sin embargo» va en una nota y «por eso» en otra?',
    temas: ['Conectores de adición, contraste y causa'],
    pieza: 'rv-soporte',
    lee: {
      tarjetas: [
        { titulo: 'Notas del mural', texto: 'En el mural del colegio, 5.º B dejó tres notas sobre el simulacro. Las dos primeras empiezan igual: alguien estudió toda la semana. Lo que sigue cambia, y con eso cambia la palabra que une las dos partes.',
          pieza: 'rv-soporte', dibujo: { datos: mural1(INI1), estado: {} } },
        { titulo: 'El conector', texto: 'Un conector es la palabra que une dos ideas y dice cómo se relacionan: «además», «sin embargo», «por eso». Cada uno marca una relación distinta entre lo de antes y lo de después.' },
        { titulo: 'Lo que se espera', texto: 'Cada idea hace esperar algo. Tras «llovió toda la noche», se espera encontrar charcos en la calle. Esa espera es la expectativa: la segunda idea la cumple, la rompe o suma otra cosa.' },
        { titulo: 'Qué mirar al jugar', texto: 'Toca una nota para cambiar el conector del espacio ¿…? y relee la nota entera. La segunda idea está en turquesa: ¿cumple lo esperado, lo rompe o suma otra cosa?' },
      ],
    },
    actividad: 'Poner en tres notas del mural el conector que une cada par de ideas.',
    aprendizaje: 'Antes del conector se nombra la relación: si la segunda idea cumple lo esperado, resultado; si lo rompe, contraste; si suma otra cosa, adición.',
    ejemplos: completarDatos(EJEMPLOS_1, 1),
    juega: {
      consigna: 'Tres notas del mural de 5.º B. En turquesa, lo que decide el conector: aquí, la segunda idea de cada nota.',
      mision: {
        texto: 'Pon en cada nota el conector que marca cómo se une la segunda idea.',
        logrado: listo1,
        bien: 'Las notas 1 y 2 empiezan igual: el final decidió el conector.',
      },
      voz: '¿La segunda parte cumple lo esperado, lo rompe o suma otra cosa?',
      leyenda: [
        { s: 'negrita', t: 'el espacio del conector' },
        { s: cubre('turquesa'), t: 'lo que decide el conector' },
        { s: prop('naranja'), t: 'conector que marca otra relación' },
        { s: justo('violeta'), t: 'conector que marca esa relación' },
      ],
      controles: NOTAS1.map((n, k) => ({ id: n.id, etiqueta: `Nota ${k + 1}`, opciones: OPS1.map((t, v) => ({ valor: v, texto: sinComa(t) })) })),
      dibujo: val => ({ datos: Object.assign({ toques: Object.fromEntries(NOTAS1.map(n => [n.id, n.id])) }, mural1(val)), estado: est1(val) }),
      lectura: lectura1,
      minimo: 3,
    },
    predice: {
      pregunta: 'En el mismo mural hay otra nota: «Mateo practicó el baile todos los días; sin embargo, ¿…?». ¿Qué parte completa la nota?',
      voz: 'Elige antes de ver: después lo comprobamos con lo esperado.',
      opciones: opciones('se equivocó en varios pasos', [
        ['bailó sin equivocarse', 'RV23', 'Es lo que se espera tras practicar tanto, bien; pero «sin embargo» anuncia lo contrario.'],
        ['también aprendió a tocar la quena', 'RV26', 'Sigue con Mateo, bien; pero suma otra cosa, y «sin embargo» anuncia un choque.'],
        ['ensayó el baile cada día', 'RV35', 'Habla del baile, bien; pero repite la primera idea con otras palabras.'],
      ]),
      dibujo: { datos: baile1(), estado: {} },
      revelar: { datos: baile1('se equivocó en varios pasos', 'se equivocó en varios pasos'), estado: { marcas: { f1w: 'f', f1p: 'i', f1q: 'i' } } },
      coincide: 'Coincide: tras practicar todos los días se espera bailar bien; «sin embargo» anuncia lo contrario.',
    },
    mira: {
      datos: PROB1,
      voz: 'Volvamos a la nota: primero, lo que hace esperar.',
      pasos: [
        { estado: { senal: ['c0'], marcas: { c0p: 'i' }, nuevo: ['c0p'] }, texto: 'Practicar todos los días hace esperar algo: que baile bien.',
          ecuacion: [cubre('practicó todos los días'), ' → ', { negrita: 'baila bien' }] },
        { estado: { marcas: { c0p: 'i', c0q: 'i' }, tachar: ['c1'], nuevo: ['c0q', 'c1'] }, texto: '«Bailó sin equivocarse» cumple lo esperado; «sin embargo» anuncia que se rompe.',
          ecuacion: [prop('sin equivocarse'), ': iría con «por eso»'] },
        { estado: { marcas: { c0p: 'i', c0q: 'i' }, tachar: ['c1', 'c2'], nuevo: ['c2'] }, texto: 'La quena suma otra cosa: eso pediría «además».',
          ecuacion: [prop('la quena'), ': adición'] },
        { estado: { marcas: { c0p: 'i', c0q: 'i' }, tachar: ['c1', 'c2', 'c3'], nuevo: ['c3'] }, texto: '«Ensayó cada día» repite la primera idea: no rompe nada.',
          ecuacion: [prop('ensayó cada día'), ': lo mismo'] },
        { estado: { marcas: { c0p: 'i', c0q: 'i', c4: 'f' }, tachar: ['c1', 'c2', 'c3'], nuevo: ['c4'] }, texto: '«Se equivocó» rompe lo esperado: es lo que anuncia «sin embargo».',
          ecuacion: [justo('se equivocó'), ': lo contrario de lo esperado'] },
      ],
    },
    regla: {
      texto: 'Nombra la relación antes del conector: si la segunda idea cumple lo esperado, resultado; si lo rompe, contraste; si suma, adición. El conector también avisa qué viene.',
      ecuacion: ['resultado: ', { negrita: 'por eso' }, '; contraste: ', { negrita: 'sin embargo' }, '; adición: ', { negrita: 'además' }],
      voz: 'Vuelve a esta regla cuando dudes entre dos conectores.',
      condicion: 'las dos ideas hablan de lo mismo, y la segunda se mide con lo que hace esperar la primera.',
    },
    resuelve: {
      pieza: 'rv-soporte',
      generar(s) {
        const R = RESUELVE_1[s % RESUELVE_1.length];
        return resuelveDe(R, { pasos: pasosDe(R, R.pide, REGLA1) }, 1);
      },
    },
    ahoraTu: {
      pieza: 'rv-soporte',
      voz: 'Otro texto corto. Antes de mirar las opciones, di qué hace esperar la primera idea.',
      generar(s) {
        const A = AHORA_1[s % AHORA_1.length], sop = sim(13 + (s % AHORA_1.length), ors('h', A.o));
        return {
          pregunta: A.final ? '¿Qué completa el texto después del conector?' : '¿Qué conector va en el espacio?',
          datos: datosPregunta(1, D_IDEA1, A.final ? 'completa' : '', [A.ok, ...A.m.map(x => x[0])], sop),
          dibujo: { datos: sop, estado: {} },
          opciones: opciones(A.ok, voltear(A.m, s)),
          solucion: { texto: A.por, ecuacion: [justo(A.ok)], dibujo: { datos: sop, estado: estHoja(sop) } },
        };
      },
    },
  };

  // Mesa de la idea 1: el mural sin la misión, con sus retos.
  const mesaRelacion = Object.assign({ id: 'relacion', titulo: 'Las notas del mural', pieza: 'rv-soporte' }, sinMision(relacion.juega), {
    invitaciones: [
      { texto: 'Pon «por eso» en las tres notas y mira en cuál encaja.',
        logrado: val => NOTAS1.every(n => val[n.id] === 1),
        bien: 'Solo en la nota 1: la 2 rompe lo esperado y la 3 suma otra cosa.' },
      { texto: 'Deja bien unida solo la nota del examen difícil; las otras, con el espacio vacío.',
        logrado: val => NOTAS1.every(n => (n.id === 'n2' ? va1(n, val[n.id]) : val[n.id] === 0)),
        bien: '«Sin embargo»: un examen difícil rompe lo que se esperaba tras estudiar.' },
      { texto: 'Haz que ninguna nota quede bien unida.',
        logrado: val => NOTAS1.every(n => val[n.id] && !va1(n, val[n.id])),
        bien: 'Cada conector marca una relación: en una nota que pide otra, no encaja.' },
    ] });

  // ---------- Idea 2: causa o consecuencia, el orden (nueva, etapa 8) ----------
  // Cambia: el conector de cada oración del comunicado. Permanece: el río, el puente y la feria. Progresa: de tres
  // espacios a tres conectores, cada uno junto a la idea que le toca. Se reserva: decir lo mismo con el otro conector y el
  // otro orden (predicción). Debe verse: que «porque» va delante de la razón y «por eso», delante de lo que resulta.
  // Objeto de la primera pantalla: la puerta de la municipalidad de Lampa con su comunicado (para los vecinos).
  // Colores: lo que decide (la razón, o lo que se hace igual), i; el conector al revés o de otra relación, o; el que va, f.
  // Códigos: RVC1 (al revés), RVC2 (contraste donde nada se opone), RVC5 (suma donde una sale de la otra), RV35.

  // El juego: el mundo chico del comunicado. Cada oración pide una relación; cada conector marca una sola.
  const REL2 = { porque: 'causa', 'por eso': 'consecuencia', pero: 'contraste' };
  const OPS2 = [HUECO, 'porque', 'por eso', 'pero'];
  const COM2 = [
    { id: 'o1', pl: '[p:El río Lampa creció mucho con las lluvias]; [w:¿…?] cerramos el puente viejo.', pide: 'consecuencia',
      no: { porque: 'diría que cerrar el puente hizo crecer el río', pero: 'cerrar el puente era lo esperado' } },
    { id: 'o2', pl: 'Cerramos el puente viejo [w:¿…?] [p:el agua podía llevarse sus tablas].', pide: 'causa',
      no: { 'por eso': 'diría que cerrar el puente movió el agua', pero: 'el agua es la razón del cierre' } },
    { id: 'o3', pl: 'El puente estará cerrado toda la semana; [w:¿…?] [p:la feria del domingo se hará igual].', pide: 'contraste',
      no: { porque: 'la feria no es la razón del cierre', 'por eso': 'la feria no sale del cierre' } },
  ];
  const va2 = (o, v) => !!v && REL2[OPS2[v]] === o.pide;
  const comunicado2 = val => papel('puerta', 'Puerta de la municipalidad de Lampa', 'Comunicado', 'la municipalidad', 'los vecinos',
    COM2.map(o => oracion(o.id, o.pl, OPS2[val[o.id] || 0], 'por eso')));
  const INI2 = Object.fromEntries(COM2.map(o => [o.id, 0]));
  const listo2 = val => COM2.every(o => va2(o, val[o.id]));
  const est2 = val => ({ marcas: Object.assign(Object.fromEntries(COM2.map(o => [`${o.id}p`, 'i'])),
    Object.fromEntries(COM2.filter(o => val[o.id]).map(o => [`${o.id}w`, va2(o, val[o.id]) ? 'f' : 'o']))) });
  const lectura2 = val => {
    if (listo2(val)) return [justo('Cada conector en su lugar'), ': razón, resultado y choque'];
    const o = COM2.find(x => val[x.id] && !va2(x, val[x.id]));
    if (o) { const c = OPS2[val[o.id]]; return [prop(`«${may(c)}»`), `: ${o.no[c]}`]; }
    const b = COM2.filter(x => va2(x, val[x.id])).length;
    return b ? [justo(`${b} de 3 oraciones bien unidas`), '; faltan las otras'] : ['Toca una oración y prueba un conector'];
  };

  // La predicción: la misma relación con el otro conector y el otro orden. Sin letras en la figura.
  const PL_LUZ = '[p:El colegio se quedó sin luz]; [w:por eso] suspendieron las clases.';
  const dir2 = extra => papel('puerta', 'Puerta del colegio', 'Comunicado', 'la Dirección', 'las familias',
    [oracion('d1', PL_LUZ)].concat(extra || []));
  const PROB2 = probador('Cuaderno de Nilda', '¿Qué oración dice lo mismo?', 'Nilda', PL_LUZ,
    ['El colegio se quedó sin luz porque suspendieron las clases', 'El colegio se quedó sin luz, pero suspendieron las clases',
      'El colegio se quedó sin luz y además suspendieron las clases', 'Suspendieron las clases porque el colegio se quedó sin luz']);

  // «Así se resuelve»: cuatro hojas. Dos piden el conector y dos la oración que dice lo mismo. La buena: D, B, A y E.
  const PIDE2C = 'Piden el conector del espacio: hay que ver cuál idea es la razón de la otra.';
  const PIDE2I = 'Piden la oración que cuenta lo mismo con otro conector y otro orden.';
  const REGLA2 = '«Porque» va delante de la causa y «por eso», delante de la consecuencia; si cambia el orden de las ideas, cambia el conector.';
  const RESUELVE_2 = [
    { sop: sim(31, ors('h', ['Esta semana, la posta de Chucuito atendió a muchos niños con tos [w:¿…?] [p:hubo cinco noches seguidas de helada].', 'Las enfermeras piden abrigar bien a los pequeños.']), P_ELIJA,
      ['por eso', 'sin embargo', 'o sea', 'porque', 'además']), buena: 'D', pide: PIDE2C,
      datos: D_IDEA2, tengo: [cubre('«Cinco noches seguidas de helada»'), ' es la razón de tantos niños con tos: es la causa, y va después del espacio.'],
      malas: [mala('A'), ' pondría la tos como razón de la helada: al revés. ', mala('B'), ' marcaría un choque, y nada se rompe. ', mala('C'), ' repetiría lo mismo. ', mala('E'), ' sumaría otra cosa aparte.'],
      bien: [buena('D'), ': ', justo('porque'), ' va delante de la causa, la helada.'],
      sentido: 'Relee: atendió a muchos niños con tos porque hubo cinco noches de helada. La razón va después de «porque».' },
    { sop: sim(32, ors('h', ['[p:La carretera a Puno se llenó de nieve]; [w:por eso] los buses no salieron de Juliaca.']), P_IGUAL,
      ['La carretera se llenó de nieve porque los buses no salieron', 'Los buses no salieron porque la carretera se llenó de nieve', 'La carretera se llenó de nieve, pero los buses no salieron',
        'Los buses no salieron; por eso la carretera se llenó de nieve', 'La carretera se llenó de nieve y los buses salieron igual']), buena: 'B', pide: PIDE2I,
      datos: D_IDEA2, tengo: ['La razón es que ', cubre('«la carretera a Puno se llenó de nieve»'), '; lo que resultó, que los buses no salieran.'],
      malas: [mala('A'), ' y ', mala('D'), ' ponen la nieve como resultado de los buses: al revés. ', mala('C'), ' marcaría un choque. ', mala('E'), ' dice lo contrario del texto.'],
      bien: [buena('B'), ': ', justo('porque'), ' queda delante de la causa, la nieve.'],
      sentido: 'Las dos oraciones cuentan lo mismo: la nieve primero, y los buses que no salen por ella.' },
    { sop: sim(33, ors('h', ['[p:Cada vez hay menos peces en esa parte del lago];', '[w:¿…?] muchas familias de la isla dejaron de pescar.']), P_ELIJA,
      ['así que', 'porque', 'sin embargo', 'es decir', 'también']), buena: 'A', pide: PIDE2C,
      datos: D_IDEA2, tengo: [cubre('«Cada vez hay menos peces»'), ' es la razón; dejar de pescar es lo que resulta, y va después del espacio.'],
      malas: [mala('B'), ' pondría la pesca como razón de que falten peces: al revés. ', mala('C'), ' marcaría un choque. ', mala('D'), ' repetiría lo mismo; ', mala('E'), ' sumaría otra cosa.'],
      bien: [buena('A'), ': ', justo('así que'), ' va delante de la consecuencia.'],
      sentido: 'Relee: hay menos peces, así que dejaron de pescar. Primero la razón, después lo que resulta.' },
    { sop: sim(34, ors('h', ['Cerraron la cancha del barrio [w:porque] [p:el pasto estaba lleno de huecos].']), P_IGUAL,
      ['Cerraron la cancha; por eso el pasto se llenó de huecos', 'El pasto estaba lleno de huecos, pero cerraron la cancha', 'Cerraron la cancha y además el pasto tenía huecos',
        'Cerraron la cancha porque el pasto estaba muy bien', 'El pasto se llenó de huecos; por eso cerraron la cancha']), buena: 'E', pide: PIDE2I,
      datos: D_IDEA2, tengo: ['La razón es que ', cubre('«el pasto estaba lleno de huecos»'), ': va después de «porque».'],
      malas: [mala('A'), ' pone los huecos como resultado del cierre: al revés. ', mala('B'), ' marcaría un choque; ', mala('C'), ' sumaría un dato aparte. ', mala('D'), ' dice otra cosa.'],
      bien: [buena('E'), ': la causa va primero y ', justo('por eso'), ', delante de la consecuencia.'],
      sentido: 'Las dos oraciones dicen lo mismo: los huecos son la razón y el cierre, lo que resultó.' },
  ];

  // «Ahora tú»: cuatro casos con cuatro opciones y dos con cinco. `pregunta`: qué se pide en ese caso.
  const AHORA_2 = [
    { o: ['[p:El pan se quemó en el horno];', '[w:¿…?] nadie quiso comerlo en el desayuno.'], ok: 'por eso',
      por: 'No comerlo es lo que resulta del pan quemado: va después de «por eso».',
      m: [['porque', 'RVC1', 'Une razón y resultado, bien; pero al revés: no comerlo no quemó el pan.'],
        ['pero', 'RVC2', 'Une las dos ideas, bien; pero marca un choque, y no comerlo era lo esperado.'],
        ['es decir', 'RV35', 'Une las dos ideas, bien; pero no repite lo del pan quemado.']] },
    { o: ['Hoy no hubo clases en el colegio [w:¿…?] [p:los profesores tenían una capacitación].'], ok: 'porque',
      por: 'La capacitación es la razón de que no hubiera clases: va después de «porque».',
      m: [['por eso', 'RVC1', 'Une razón y resultado, bien; pero al revés: la capacitación no sale de no tener clases.'],
        ['pero', 'RVC2', 'Une las dos ideas, bien; pero nada se opone: la capacitación lo explica.'],
        ['también', 'RVC5', 'Une las dos ideas, bien; pero la capacitación es la razón, no otra cosa aparte.']] },
    { o: ['[p:Se cortó el agua en todo el barrio]; [w:por eso] la lavandería cerró temprano.'], ok: 'La lavandería cerró temprano porque se cortó el agua',
      pregunta: '¿Qué oración dice lo mismo que el texto?', por: 'La razón es el corte de agua: «porque» va delante de ella.',
      m: [['Se cortó el agua porque la lavandería cerró temprano', 'RVC1', 'Usa «porque», bien; pero delante del resultado: diría que la lavandería cortó el agua.'],
        ['Se cortó el agua, pero la lavandería cerró temprano', 'RVC2', 'Une las dos ideas, bien; pero marca un choque, y cerrar era lo esperado.'],
        ['Se cortó el agua y además la lavandería cerró temprano', 'RVC5', 'Junta los dos hechos, bien; pero como cosas aparte: se pierde la razón.']] },
    { o: ['La feria de Lampa se suspendió [p:porque] [w:¿…?].'], ok: 'llovió granizo toda la mañana',
      pregunta: '¿Qué completa el texto después del conector?', por: 'Después de «porque» va la razón: el granizo explica la suspensión.',
      m: [['los niños se quedaron sin ver los títeres', 'RVC1', 'Es algo que pasó, bien; pero es un resultado de suspender, no su razón.'],
        ['los vendedores llegaron igual', 'RVC2', 'Habla de la feria, bien; pero va contra lo dicho: no es una razón.'],
        ['también cerraron el mercado', 'RVC5', 'Habla del mismo día, bien; pero suma otra cosa: no da la razón.']] },
    { o: ['[p:Tu inscripción llegó después de la fecha límite];', '[w:¿…?] no podrás dar el examen de mayo.'], ok: 'así que',
      por: 'No dar el examen es lo que resulta de inscribirse tarde: una consecuencia.',
      m: [['porque', 'RVC1', 'Une razón y resultado, bien; pero al revés: no dar el examen no atrasó la inscripción.'],
        ['sin embargo', 'RVC2', 'Une las dos ideas, bien; pero marca un choque, y no dar el examen es lo esperado.'],
        ['además', 'RVC5', 'Une las dos ideas, bien; pero una sale de la otra: no es otra cosa aparte.'],
        ['por ejemplo', 'RV35', 'Une las dos ideas, bien; pero lo segundo no es un caso de lo primero.']] },
    { o: ['El médico le pidió reposo a mi hermano [w:¿…?] [p:tenía fiebre muy alta].'], ok: 'porque',
      por: 'La fiebre es la razón del reposo: va después de «porque».',
      m: [['por eso', 'RVC1', 'Une razón y resultado, bien; pero al revés: el reposo no le dio fiebre.'],
        ['pero', 'RVC2', 'Une las dos ideas, bien; pero nada se opone: la fiebre explica el reposo.'],
        ['además', 'RVC5', 'Une las dos ideas, bien; pero la fiebre es la razón, no otra cosa aparte.'],
        ['o sea', 'RV35', 'Une las dos ideas, bien; pero la fiebre no repite lo del reposo.']] },
  ];

  // Ejemplos resueltos de la idea 2. Nivel 1: cuál es la causa o la consecuencia, si un conector sirve. Nivel 2: tres
  // conectores, tres finales o tres oraciones de una lista. Nivel 3: la hoja con cinco alternativas; las correctas son A,
  // B, C, D y E. Revisado aparte (scratchpad e8-rv/rev/revisa.js).
  const EJEMPLOS_2 = [
    { nivel: 1, titulo: 'El bus de Iván',
      enunciado: '¿Qué idea es la causa en el mensaje de Iván?',
      datos: [D_CAUSA0, D_CONSEC0],
      figura: fig(papel('mensaje', 'Promoción 2026', null, 'Iván', 'la promoción', ors('k', ['Llegué tarde al simulacro [w:porque] [p:el bus se malogró en la carretera].']))),
      solucion: [{ texto: [cubre('«El bus se malogró»'), ' es la razón de que Iván llegara tarde: es la causa, y va después de «porque».'] }],
      respuesta: [justo('Que el bus se malogró en la carretera')] },
    { nivel: 1, titulo: 'La tienda en feriado',
      enunciado: '¿Sirve «porque» en el espacio del cartel de la tienda?',
      datos: [D_CAUSA0, D_CONSEC0, D_ALREVES],
      figura: fig(papel('cartel', 'Cartel de la tienda de don Julio', 'Aviso', 'don Julio', 'los clientes', ors('k', ['[p:Mañana es feriado];', '[w:¿…?] la tienda abrirá solo hasta el mediodía.']))),
      solucion: [{ texto: [cubre('«Mañana es feriado»'), ' es la causa del horario corto. ', prop('«Porque»'), ' lo pondría ', prop('al revés'), ': el horario como razón del feriado.'] }],
      respuesta: [justo('No'), ': aquí va «por eso»'] },
    { nivel: 1, titulo: 'El médico de viaje',
      enunciado: '¿Qué idea es la consecuencia en el aviso de la posta?',
      datos: [D_CAUSA0, D_CONSEC0],
      figura: fig(papel('puerta', 'Puerta de la posta de Lampa', 'Aviso', 'la posta', 'los pacientes', ors('k', ['El médico de turno está de viaje;', '[w:por eso] [p:hoy no habrá atención en la tarde].']))),
      solucion: [{ texto: [cubre('«Hoy no habrá atención en la tarde»'), ' es lo que resulta del viaje: va después de «por eso».'] }],
      respuesta: [justo('Que hoy no habrá atención en la tarde')] },
    { nivel: 1, titulo: 'La neblina de Juliaca',
      enunciado: '¿«Hay mucha neblina; por eso el vuelo se atrasó» dice lo mismo que el mensaje de Nina?',
      datos: [D_CAUSA0, D_CONSEC0],
      figura: fig(papel('mensaje', 'Familia Condori', null, 'Nina', 'la familia', ors('k', ['Mi vuelo se atrasó [w:porque] [p:hay mucha neblina en Juliaca].']))),
      solucion: [{ texto: ['Las dos ponen ', cubre('«mucha neblina»'), ' como la razón del atraso: cambia el orden y cambia el conector.'] }],
      respuesta: [justo('Sí'), ': la neblina es la razón en las dos'] },
    { nivel: 1, titulo: 'La cancha con pasto nuevo',
      enunciado: '¿Por qué «pero» no sirve en el espacio del cartel de la cancha?',
      datos: [D_CAUSA0, D_CONSEC0, D_CONT0],
      figura: fig(papel('cartel', 'Cartel de la cancha del barrio', 'Aviso', 'la junta vecinal', 'los vecinos', ors('k', ['[p:El pasto recién sembrado necesita crecer];', '[w:¿…?] nadie puede jugar en la cancha este mes.']))),
      solucion: [
        { texto: [cubre('«Necesita crecer»'), ' es la causa, y no jugar es lo que resulta.'] },
        { texto: [prop('«Pero»'), ' marcaría un choque, y no jugar es lo esperado.'] }],
      respuesta: [justo('Porque nada se opone'), ': va «por eso»'] },

    { nivel: 2, titulo: 'El reservorio',
      enunciado: '¿Qué conector va en el espacio: «por eso», «pero» o «porque»?',
      datos: D_IDEA2,
      figura: fig(papel('mensaje', 'Junta vecinal Bellavista', null, 'la presidenta de la junta', 'los vecinos', ors('k', ['Mañana no habrá agua en el barrio [w:¿…?] [p:van a limpiar el reservorio].']))),
      solucion: [
        { texto: [cubre('«Van a limpiar el reservorio»'), ' es la razón de que no haya agua: la causa.'] },
        { texto: [prop('«Por eso»'), ' la pondría como resultado; ', prop('«pero»'), ' marcaría un choque.'] }],
      respuesta: [justo('«Porque»')] },
    { nivel: 2, titulo: 'El ascensor malogrado',
      enunciado: '¿Qué conector va en el espacio: «así que», «porque» o «sin embargo»?',
      datos: D_IDEA2,
      figura: fig(papel('puerta', 'Puerta del hospital', 'Aviso', 'el hospital', 'los pacientes', ors('k', ['[p:El ascensor del hospital está malogrado];', '[w:¿…?] los pacientes suben por la escalera.']))),
      solucion: [
        { texto: [cubre('«El ascensor del hospital está malogrado»'), ' es la razón; subir por la escalera es lo que resulta.'] },
        { texto: [prop('«Porque»'), ' iría al revés; ', prop('«sin embargo»'), ' marcaría un choque.'] }],
      respuesta: [justo('«Así que»')] },
    { nivel: 2, titulo: 'Tarde al trabajo',
      enunciado: '¿Qué completa el mensaje: «me retaron», «el bus demoró una hora» o «también llegué tarde ayer»?',
      datos: D_IDEA2,
      figura: fig(papel('mensaje', 'Familia Condori', null, 'el papá', 'la familia', ors('k', ['Llegué tarde al trabajo [p:porque] [w:¿…?].']))),
      solucion: [
        { texto: ['Después de ', cubre('«porque»'), ' va la razón de llegar tarde: el bus que demoró.'] },
        { texto: [prop('«Me retaron»'), ' es un resultado de llegar tarde; ', prop('«también llegué tarde ayer»'), ' suma otra cosa: no es la razón.'] }],
      respuesta: [justo('«El bus demoró una hora»')] },
    { nivel: 2, titulo: 'Los libros nuevos',
      enunciado: '¿Qué conector va en el espacio: «porque», «sin embargo» o «por eso»?',
      datos: D_IDEA2,
      figura: fig(papel('mural', 'Mural del colegio', 'Biblioteca', 'la bibliotecaria', 'los estudiantes', ors('k', ['[p:La biblioteca recibió cien libros nuevos];', '[w:¿…?] amplió sus estantes en marzo.']))),
      solucion: [
        { texto: [cubre('«Recibió cien libros nuevos»'), ' es la razón de ampliar los estantes.'] },
        { texto: [prop('«Porque»'), ' iría al revés; ', prop('«sin embargo»'), ' marcaría un choque.'] }],
      respuesta: [justo('«Por eso»')] },
    { nivel: 2, titulo: 'Clases en casa',
      enunciado: '¿Qué dice lo mismo que el aviso: «El colegio dio clases virtuales porque hubo paro», «Hubo un paro porque el colegio dio clases virtuales» o «Hubo paro y el colegio también hizo una feria»?',
      datos: D_IDEA2,
      figura: fig(papel('puerta', 'Puerta del colegio', 'Aviso', 'la Dirección', 'las familias', ors('k', ['[p:Hubo paro de transportistas]; [w:por eso] el colegio dio clases virtuales.']))),
      solucion: [
        { texto: ['La razón es ', cubre('«hubo paro de transportistas»'), ': con «porque» va después.'] },
        { texto: [prop('La segunda'), ' lo pone al revés; ', prop('la tercera'), ' suma otra cosa.'] }],
      respuesta: [justo('«El colegio dio clases virtuales porque hubo paro»')] },

    { nivel: 3, titulo: 'El vuelo con tormenta',
      enunciado: 'Pregunta 41 del simulacro. Elige el conector que, puesto en el espacio, da al texto un sentido coherente y preciso.',
      datos: D_IDEA2,
      figura: fig(sim(41, ors('h', ['El vuelo de Juliaca a Lima salió con tres horas de retraso [w:¿…?] [p:una tormenta cerró el aeropuerto toda la mañana].']), P_ELIJA,
        ['porque', 'así que', 'pero', 'además', 'o sea'])),
      solucion: [
        { texto: [cubre('«Una tormenta cerró el aeropuerto»'), ' es la razón del retraso, y va después del espacio.'] },
        { texto: [mala('B'), ' iría al revés; ', mala('C'), ' marcaría un choque.'] },
        { texto: [mala('D'), ' sumaría otra cosa; ', mala('E'), ' repetiría lo mismo. ', buena('A'), ': ', justo('porque'), '.'] }],
      respuesta: [buena('A'), ': porque'] },
    { nivel: 3, titulo: 'El pasaje a cuatro soles',
      enunciado: 'Pregunta 42 del simulacro. ¿Qué oración dice lo mismo que el texto?',
      datos: D_IDEA2,
      figura: fig(sim(42, ors('h', ['[p:El precio del pasaje subió a cuatro soles]; [w:por eso] muchos estudiantes ahora caminan al colegio.']), P_IGUAL,
        ['Muchos caminan al colegio, pero el pasaje subió', 'Muchos estudiantes caminan porque el pasaje subió', 'El pasaje subió porque muchos estudiantes caminan',
          'El pasaje subió y además muchos estudiantes caminan', 'Muchos estudiantes caminan; por eso el pasaje subió'])),
      solucion: [
        { texto: ['La razón es que ', cubre('«el precio del pasaje subió»'), '; caminar es lo que resulta.'] },
        { texto: [mala('C'), ' y ', mala('E'), ' lo ponen al revés. ', mala('A'), ' marcaría un choque; ', mala('D'), ' suma dos cosas aparte.'] },
        { texto: [buena('B'), ': ', justo('porque'), ' va delante de la causa, el pasaje.'] }],
      respuesta: [buena('B'), ': Muchos estudiantes caminan porque el pasaje subió'] },
    { nivel: 3, titulo: 'Los pueblos aislados',
      enunciado: 'Pregunta 43 del simulacro. Elige el conector que, puesto en el espacio, da al texto un sentido coherente y preciso.',
      datos: D_IDEA2,
      figura: fig(sim(43, ors('h', ['[p:Los ríos de la selva crecieron con las lluvias de enero];', '[w:¿…?] varios pueblos quedaron aislados.']), P_ELIJA,
        ['porque', 'sin embargo', 'así que', 'por ejemplo', 'además'])),
      solucion: [
        { texto: [cubre('«Los ríos de la selva crecieron»'), ' es la razón; quedar aislados es lo que resulta.'] },
        { texto: [mala('A'), ' iría al revés; ', mala('B'), ' marcaría un choque.'] },
        { texto: [mala('D'), ' daría un caso; ', mala('E'), ' sumaría otra cosa. ', buena('C'), ': ', justo('así que'), '.'] }],
      respuesta: [buena('C'), ': así que'] },
    { nivel: 3, titulo: 'El premio de la isla',
      enunciado: 'Pregunta 44 del simulacro. Elige lo que completa el texto con un sentido coherente.',
      datos: D_IDEA2,
      figura: fig(sim(44, ors('h', ['La comunidad de la isla ganó un premio de turismo [p:porque] [w:¿…?].']), P_FINAL,
        ['este año la visitarán más turistas', 'también ganó un premio de pesca', 'nadie la visita en invierno', 'cuida sus casas y sus costumbres', 'el premio fue para su turismo'])),
      solucion: [
        { texto: ['Después de ', cubre('«porque»'), ' va la razón del premio.'] },
        { texto: [mala('A'), ' es un resultado del premio: al revés. ', mala('B'), ' suma otra cosa; ', mala('C'), ' iría contra el premio; ', mala('E'), ' repite lo dicho.'] },
        { texto: [buena('D'), ': ', justo('cuidar sus casas y costumbres'), ' explica el premio.'] }],
      respuesta: [buena('D'), ': cuida sus casas y sus costumbres'] },
    { nivel: 3, titulo: 'El mercado tarde',
      enunciado: 'Pregunta 45 del simulacro. ¿Qué oración dice lo mismo que el texto?',
      datos: D_IDEA2,
      figura: fig(sim(45, ors('h', ['El mercado de Lampa abrió más tarde [w:porque] [p:los camiones de fruta llegaron con retraso].']), P_IGUAL,
        ['Los camiones llegaron tarde porque el mercado abrió tarde', 'El mercado abrió tarde, pero los camiones llegaron', 'El mercado abrió tarde y además llovió en Lampa',
          'El mercado abrió tarde; por eso los camiones llegaron tarde', 'Los camiones se retrasaron; por eso el mercado abrió tarde'])),
      solucion: [
        { texto: ['La razón es que ', cubre('«los camiones de fruta llegaron con retraso»'), '.'] },
        { texto: [mala('A'), ' y ', mala('D'), ' lo ponen al revés. ', mala('B'), ' marcaría un choque; ', mala('C'), ' suma otra cosa.'] },
        { texto: [buena('E'), ': la causa va primero, y ', justo('por eso'), ', delante de la consecuencia.'] }],
      respuesta: [buena('E'), ': Los camiones se retrasaron; por eso el mercado abrió tarde'] },
  ];

  const causa = {
    id: 'causa-consecuencia',
    titulo: 'Causa o consecuencia: el orden',
    pregunta: '¿«Porque» y «por eso» dicen lo mismo?',
    temas: ['Conectores de adición, contraste y causa'],
    pieza: 'rv-soporte',
    lee: {
      tarjetas: [
        { titulo: 'El comunicado', texto: 'La municipalidad de Lampa pegó un comunicado en su puerta. Habla del río que creció y del puente que cerraron, pero lo cuenta en oraciones con distinto orden.',
          pieza: 'rv-soporte', dibujo: { datos: comunicado2(INI2), estado: {} } },
        { titulo: 'Causa y consecuencia', texto: 'La causa es la razón de que algo pase; la consecuencia, lo que pasa por esa razón. La lluvia es la causa de los charcos, y los charcos, su consecuencia.' },
        { titulo: 'Dos lados de lo mismo', texto: 'Unos conectores van delante de la causa; otros, delante de la consecuencia. Por eso importa cuál de las dos ideas va primero en la oración.' },
        { titulo: 'Qué mirar al jugar', texto: 'Toca cada oración del comunicado para cambiar el conector. Antes, busca cuál de las dos ideas es la razón de la otra.' },
      ],
    },
    actividad: 'Poner «porque», «por eso» o «pero» en el comunicado según qué idea es la razón.',
    aprendizaje: '«Porque» va delante de la causa y «por eso», delante de la consecuencia; si se cambia el orden de las ideas, cambia el conector.',
    ejemplos: completarDatos(EJEMPLOS_2, 2),
    juega: {
      consigna: 'El comunicado de la municipalidad de Lampa. En turquesa, la razón o lo que choca: decide qué conector va.',
      mision: {
        texto: 'Pon en cada oración del comunicado el conector que marca cómo se unen sus ideas.',
        logrado: listo2,
        bien: 'Cada conector quedó junto a la idea que le toca.',
      },
      voz: '¿Cuál de las dos ideas es la razón de la otra?',
      leyenda: [
        { s: 'negrita', t: 'el espacio del conector' },
        { s: cubre('turquesa'), t: 'la razón o lo que choca' },
        { s: prop('naranja'), t: 'conector al revés o de otra relación' },
        { s: justo('violeta'), t: 'conector que marca esa relación' },
      ],
      controles: COM2.map((o, k) => ({ id: o.id, etiqueta: `Oración ${k + 1}`, opciones: OPS2.map((t, v) => ({ valor: v, texto: t })) })),
      dibujo: val => ({ datos: Object.assign({ toques: Object.fromEntries(COM2.map(o => [o.id, o.id])) }, comunicado2(val)), estado: est2(val) }),
      lectura: lectura2,
      minimo: 3,
    },
    predice: {
      pregunta: 'En la puerta del colegio se lee: «El colegio se quedó sin luz; por eso suspendieron las clases». ¿Qué oración dice lo mismo?',
      voz: 'Elige antes de ver: después buscamos cuál es la razón.',
      opciones: opciones('Suspendieron las clases porque el colegio se quedó sin luz', [
        ['El colegio se quedó sin luz porque suspendieron las clases', 'RVC1', 'Usa «porque», bien; pero delante del resultado: diría que suspender las clases cortó la luz.'],
        ['El colegio se quedó sin luz, pero suspendieron las clases', 'RVC2', 'Une las dos ideas, bien; pero marca un choque, y suspender era lo esperado.'],
        ['El colegio se quedó sin luz y además suspendieron las clases', 'RVC5', 'Junta los dos hechos, bien; pero como cosas aparte: se pierde cuál es la razón.'],
      ]),
      dibujo: { datos: dir2(), estado: {} },
      revelar: { datos: dir2([oracion('d3', 'Suspendieron las clases [w:porque] [p:el colegio se quedó sin luz].')]), estado: { marcas: { d1p: 'i', d3p: 'i', d3w: 'f' } } },
      coincide: 'Coincide: la falta de luz es la razón; «porque» va delante de ella, y la oración dice lo mismo.',
    },
    mira: {
      datos: PROB2,
      voz: 'Volvamos al comunicado: primero, cuál es la razón.',
      pasos: [
        { estado: { senal: ['c0'], marcas: { c0p: 'i' }, nuevo: ['c0p'] }, texto: 'La razón es que no hubo luz; lo que resultó, suspender las clases.',
          ecuacion: [cubre('sin luz'), ' → ', { negrita: 'clases suspendidas' }] },
        { estado: { marcas: { c0p: 'i' }, tachar: ['c1'], nuevo: ['c1'] }, texto: '«Porque» delante de «suspendieron» haría de las clases la razón: al revés.',
          ecuacion: [prop('porque + resultado'), ': al revés'] },
        { estado: { marcas: { c0p: 'i' }, tachar: ['c1', 'c2'], nuevo: ['c2'] }, texto: '«Pero» marcaría un choque, y suspender las clases era lo esperado.',
          ecuacion: [prop('pero'), ': contraste'] },
        { estado: { marcas: { c0p: 'i' }, tachar: ['c1', 'c2', 'c3'], nuevo: ['c3'] }, texto: '«Además» sumaría un dato aparte; aquí uno sale del otro.',
          ecuacion: [prop('además'), ': adición'] },
        { estado: { marcas: { c0p: 'i', c4: 'f' }, tachar: ['c1', 'c2', 'c3'], nuevo: ['c4'] }, texto: '«Porque» va delante de la causa: «porque el colegio se quedó sin luz».',
          ecuacion: [justo('consecuencia'), ' + porque + ', cubre('causa')] },
      ],
    },
    regla: {
      texto: '«Porque» va delante de la causa; «por eso», delante de la consecuencia. Si se cambia el orden de las dos ideas, cambia el conector, y la oración dice lo mismo.',
      // El orden de «porque» también se ve, y «por eso» no se parte en dos renglones (espacio que no se corta).
      ecuacion: [{ negrita: 'por\u00a0eso' }, ' + consecuencia; ', { negrita: 'porque' }, ' + ', cubre('causa')],
      voz: 'Antes de elegir, busca la razón.',
      condicion: 'se sabe cuál idea es la razón: «porque» va delante de ella, y «por eso», delante de lo que resulta.',
    },
    resuelve: {
      pieza: 'rv-soporte',
      generar(s) {
        const R = RESUELVE_2[s % RESUELVE_2.length];
        return resuelveDe(R, { pasos: pasosDe(R, R.pide, REGLA2) }, 2);
      },
    },
    ahoraTu: {
      pieza: 'rv-soporte',
      voz: 'Otro texto corto. Primero busca cuál idea es la razón de la otra.',
      generar(s) {
        const A = AHORA_2[s % AHORA_2.length], sop = sim(35 + (s % AHORA_2.length), ors('h', A.o));
        return {
          pregunta: A.pregunta || '¿Qué conector va en el espacio?',
          datos: datosPregunta(2, D_IDEA2, A.pregunta || '', [A.ok, ...A.m.map(x => x[0])], sop),
          dibujo: { datos: sop, estado: {} },
          opciones: opciones(A.ok, voltear(A.m, s)),
          solucion: { texto: A.por, ecuacion: [justo(A.ok.length > 14 ? 'porque + causa' : A.ok)], dibujo: { datos: sop, estado: estHoja(sop) } },
        };
      },
    },
  };

  // Mesa de la idea 2: el comunicado sin la misión, con sus retos.
  const mesaComunicado = Object.assign({ id: 'comunicado', titulo: 'El comunicado del puente', pieza: 'rv-soporte' }, sinMision(causa.juega), {
    invitaciones: [
      { texto: 'Pon «porque» en las tres oraciones y mira en cuál encaja.',
        logrado: val => COM2.every(o => val[o.id] === 1),
        bien: 'Solo en la oración 2: ahí la razón va después del espacio.' },
      { texto: 'Deja bien unida solo la oración del río; las otras, con el espacio vacío.',
        logrado: val => COM2.every(o => (o.id === 'o1' ? va2(o, val[o.id]) : val[o.id] === 0)),
        bien: '«Por eso»: el río que creció es la razón, y va antes.' },
      { texto: 'Haz que ninguna oración quede bien unida.',
        logrado: val => COM2.every(o => val[o.id] && !va2(o, val[o.id])),
        bien: 'Al revés o con un choque: el comunicado ya no dice lo que pasó.' },
    ] });

  // ---------- Idea 3: cada espacio pide una clase (conserva su id; etapa 8) ----------
  // Cambia: el conector de cada espacio del folleto. Permanece: la receta de la quinua. Progresa: de tres espacios a tres
  // conectores de tres clases nuevas (un caso, otras palabras, otro paso). Se reserva: el cierre (predicción). Debe verse:
  // que lo que va después del espacio decide la clase.
  // Objeto de la primera pantalla: el folleto de la feria de la quinua de Cabana (la cooperativa, para los visitantes).
  // Colores: lo que sigue al espacio (decide), i; el conector de otra clase, o; el de la clase que pide, f.
  // Códigos: RV35 (otra clase), RVC2, RVC5 y RVC6.

  // El juego: el mundo chico del folleto. Cada espacio pide una clase; cada conector es de una sola.
  const REL3 = { 'por ejemplo': 'ejemplificación', 'es decir': 'reformulación', 'después': 'orden en el tiempo' };
  const OPS3 = [HUECO, 'por ejemplo', 'es decir', 'después'];
  const FOLLETO3 = [
    { id: 'o1', pl: 'La quinua se puede preparar de muchas formas; [w:¿…?], [p:graneada, como el arroz].', pide: 'ejemplificación', dice: 'da un caso' },
    { id: 'o2', pl: 'Antes hay que quitarle la saponina; [w:¿…?], [p:la capa amarga que cubre el grano].', pide: 'reformulación', dice: 'explica una palabra' },
    { id: 'o3', pl: 'Primero se lava varias veces con agua fría; [w:¿…?], [p:se hierve quince minutos].', pide: 'orden en el tiempo', dice: 'sigue con otro paso' },
  ];
  const va3 = (o, v) => !!v && REL3[OPS3[v]] === o.pide;
  const folleto3 = (val, extra) => papel('folleto', 'Feria de la quinua de Cabana', 'Quinua graneada', 'la cooperativa de Cabana', 'los visitantes de la feria',
    FOLLETO3.map(o => oracion(o.id, o.pl, OPS3[val[o.id] || 0], 'por ejemplo')).concat(extra || []));
  const INI3 = Object.fromEntries(FOLLETO3.map(o => [o.id, 0]));
  const listo3 = val => FOLLETO3.every(o => va3(o, val[o.id]));
  const est3 = val => ({ marcas: Object.assign(Object.fromEntries(FOLLETO3.map(o => [`${o.id}p`, 'i'])),
    Object.fromEntries(FOLLETO3.filter(o => val[o.id]).map(o => [`${o.id}w`, va3(o, val[o.id]) ? 'f' : 'o']))) });
  const lectura3 = val => {
    if (listo3(val)) return [justo('Tres clases'), ': un caso, otras palabras y otro paso'];
    const k = FOLLETO3.findIndex(o => val[o.id] && !va3(o, val[o.id]));
    if (k >= 0) { const o = FOLLETO3[k], c = OPS3[val[o.id]]; return [prop(`«${may(c)}»`), `: marca ${REL3[c]}; la oración ${k + 1} ${o.dice}`]; }
    const b = FOLLETO3.filter(o => va3(o, val[o.id])).length;
    return b ? [justo(`${b} de 3 espacios bien puestos`), '; faltan los otros'] : ['Toca una oración y prueba un conector'];
  };

  // La predicción: la clase de cierre, al final del folleto ya completo (sin marcas). Sin letras en la figura.
  // La última oración junta lo que el folleto ya dijo (lavar, hervir, muchas formas): nada nuevo (cierre, 20 nov; antes
  // decía «y es fácil de cocinar», que el folleto no dice).
  const PL_CIERRE = '[w:¿…?], la quinua [p:se lava, se hierve y se prepara de muchas formas].';
  const llenas3 = () => FOLLETO3.map(o => ({ id: o.id, t: oracion(o.id, o.pl, OPS3[FOLLETO3.indexOf(o) + 1]).t }));
  const folletoFin3 = (w, reserva) => papel('folleto', 'Feria de la quinua de Cabana', 'Quinua graneada', 'la cooperativa de Cabana', 'los visitantes de la feria',
    llenas3().concat([oracion('o4', PL_CIERRE, w, reserva)]));
  const PROB3 = probador('Cuaderno de Sofía', '¿Qué conector cierra el folleto?', 'Sofía', PL_CIERRE, ['por ejemplo', 'sin embargo', 'por eso', 'en resumen']);

  // «Así se resuelve»: cuatro hojas, una por clase nueva. La buena: B, E, C y D.
  const PIDE3 = 'Piden el conector del espacio: hay que ver qué hace la parte que sigue con la de antes.';
  const REGLA3 = 'Cada clase marca una relación: un caso (por ejemplo), otras palabras (es decir), otro paso (después) o un cierre (en resumen).';
  const RESUELVE_3 = [
    { sop: sim(51, ors('h', ['En el lago viven muchas aves;', '[w:¿…?], [p:la parihuana, de plumas rosadas].']), P_ELIJA,
      ['es decir', 'por ejemplo', 'después', 'en resumen', 'por lo tanto']), buena: 'B',
      datos: D_IDEA3, tengo: [cubre('«La parihuana»'), ' es una sola ave: un caso de las muchas aves del lago.'],
      malas: [mala('A'), ' diría que «muchas aves» y la parihuana son lo mismo. ', mala('C'), ' marcaría otro paso. ', mala('D'), ' cerraría el texto. ', mala('E'), ' marcaría una consecuencia.'],
      bien: [buena('B'), ': ', justo('por ejemplo'), ' presenta un caso.'],
      sentido: 'Una sola ave no es lo mismo que «muchas aves»: por eso es un ejemplo y no otras palabras.' },
    { sop: sim(52, ors('h', ['El médico dijo que la herida de Juan es superficial;', '[w:¿…?], [p:no llega a lo profundo de la piel].']), P_ELIJA,
      ['por ejemplo', 'después', 'sin embargo', 'en suma', 'es decir']), buena: 'E',
      datos: D_IDEA3, tengo: [cubre('«No llega a lo profundo de la piel»'), ' dice lo mismo que «superficial», con otras palabras.'],
      malas: [mala('A'), ' daría un caso. ', mala('B'), ' marcaría otro paso. ', mala('C'), ' marcaría un choque. ', mala('D'), ' cerraría un texto, y aquí no se reúne nada.'],
      bien: [buena('E'), ': ', justo('es decir'), ' explica la palabra difícil.'],
      sentido: 'Relee: superficial, es decir, que no llega a lo profundo. La segunda parte explica la primera.' },
    { sop: sim(53, ors('h', ['Para inscribirte, llena primero la ficha en la página del colegio;', '[w:¿…?], [p:lleva la ficha impresa a la secretaría].']), P_ELIJA,
      ['es decir', 'por ejemplo', 'después', 'en resumen', 'o sea']), buena: 'C',
      datos: D_IDEA3, tengo: [cubre('«Lleva la ficha impresa»'), ' es el paso que sigue a llenarla: va después en el tiempo.'],
      malas: [mala('A'), ' y ', mala('E'), ' repetirían lo mismo, y es otra acción. ', mala('B'), ' daría un caso. ', mala('D'), ' cerraría el texto.'],
      bien: [buena('C'), ': ', justo('después'), ' marca el paso que sigue.'],
      sentido: '«Primero» ya avisaba que venía otro paso: después.' },
    { sop: sim(54, ors('h', ['La quinua resiste el frío;', 'también crece con poca agua y en tierras pobres.', '[w:¿…?], [p:es un cultivo que aguanta condiciones difíciles].']), P_ELIJA,
      ['por ejemplo', 'antes', 'sin embargo', 'en suma', 'después']), buena: 'D',
      datos: D_IDEA3, tengo: [cubre('«Es un cultivo que aguanta condiciones difíciles»'), ' reúne lo dicho: el frío, la poca agua y las tierras pobres.'],
      malas: [mala('A'), ' daría un caso. ', mala('B'), ' y ', mala('E'), ' marcarían otro paso. ', mala('C'), ' marcaría un choque.'],
      bien: [buena('D'), ': ', justo('en suma'), ' cierra el texto.'],
      sentido: 'La última oración no agrega nada nuevo: junta lo anterior. Eso es un cierre.' },
  ];

  // «Ahora tú»: cuatro casos con cuatro opciones y dos con cinco.
  const AHORA_3 = [
    { o: ['Primero, los alumnos ordenaron el aula;', '[w:¿…?], [p:salieron al patio para la formación].'], ok: 'después',
      por: 'Salir al patio es el paso que sigue: orden en el tiempo.',
      m: [['o sea', 'RV35', 'Une las dos acciones, bien; pero salir al patio no repite ordenar el aula.'],
        ['sin embargo', 'RVC2', 'Une las dos acciones, bien; pero nada se opone: es el paso que sigue.'],
        ['por lo tanto', 'RVC6', 'Une las dos acciones, bien; pero marcaría un resultado, y ordenar el aula es solo el paso anterior.']] },
    { o: ['El mercado de Juliaca vende frutas de la selva, papas de la sierra y pescado del lago;', '[w:¿…?], [p:ahí se encuentra comida de muchas regiones].'], ok: 'en suma',
      por: 'La última parte reúne lo dicho: selva, sierra y lago. Es un cierre.',
      m: [['por ejemplo', 'RV35', 'Une las dos partes, bien; pero «muchas regiones» no es un caso: junta lo dicho.'],
        ['sin embargo', 'RVC2', 'Une las dos partes, bien; pero nada se opone a lo anterior.'],
        ['además', 'RVC5', 'Une las dos partes, bien; pero no suma otra cosa: reúne lo dicho.']] },
    { o: ['En Puno se celebran muchas fiestas;', '[w:¿…?], [p:la Candelaria, en febrero].'], ok: 'por ejemplo',
      por: 'La Candelaria es un caso de las muchas fiestas de Puno.',
      m: [['es decir', 'RV35', 'Une las dos partes, bien; pero una fiesta no es lo mismo que «muchas fiestas».'],
        ['sin embargo', 'RVC2', 'Une las dos partes, bien; pero nada se opone: la Candelaria es una de ellas.'],
        ['por lo tanto', 'RVC6', 'Une las dos partes, bien; pero la Candelaria no resulta de que haya muchas fiestas.']] },
    { o: ['La tortuga de río es una especie amenazada;', '[w:¿…?], [p:corre peligro de desaparecer].'], ok: 'es decir',
      por: '«Corre peligro de desaparecer» dice lo mismo que «amenazada», con otras palabras.',
      m: [['por ejemplo', 'RV35', 'Une las dos partes, bien; pero no da un caso: dice lo mismo.'],
        ['además', 'RVC5', 'Une las dos partes, bien; pero no suma otra cosa: repite la primera.'],
        ['sin embargo', 'RVC2', 'Une las dos partes, bien; pero nada se opone: las dos dicen lo mismo.']] },
    { o: ['Algunos animales de la puna son muy resistentes al frío;', '[w:¿…?], [p:la vicuña, que vive en lo alto de los Andes].'], ok: 'por ejemplo',
      por: 'La vicuña es un caso de animal de la puna que resiste el frío.',
      m: [['o sea', 'RV35', 'Une las dos partes, bien; pero la vicuña sola no es lo mismo que «algunos animales».'],
        ['aun así', 'RVC2', 'Une las dos partes, bien; pero nada se opone: la vicuña es uno de ellos.'],
        ['por lo tanto', 'RVC6', 'Une las dos partes, bien; pero la vicuña no resulta de lo anterior.'],
        ['también', 'RVC5', 'Une las dos partes, bien; pero no suma otra cosa: da un caso.']] },
    { o: ['El agua de esa laguna no es potable;', '[w:¿…?], [p:no se puede tomar sin hervirla].'], ok: 'es decir',
      por: '«No se puede tomar sin hervirla» explica «no es potable» con otras palabras.',
      m: [['por ejemplo', 'RV35', 'Une las dos partes, bien; pero no da un caso: dice lo mismo.'],
        ['sin embargo', 'RVC2', 'Une las dos partes, bien; pero nada se opone: las dos dicen lo mismo.'],
        ['además', 'RVC5', 'Une las dos partes, bien; pero no suma otra cosa: repite la primera.'],
        ['porque', 'RVC6', 'Une las dos partes, bien; pero la segunda no es la razón: dice lo mismo.']] },
  ];

  // Ejemplos resueltos de la idea 3. Nivel 1: qué clase marca un conector, si un conector sirve. Nivel 2: tres conectores
  // de una lista. Nivel 3: la hoja con cinco alternativas; las correctas son A, B, C, D y E. Revisado aparte.
  const EJEMPLOS_3 = [
    { nivel: 1, titulo: 'Las vasijas del museo',
      enunciado: '¿Qué relación marca «es decir» en el cartel del museo?',
      datos: D_IDEA3_0,
      figura: fig(papel('cartel', 'Cartel del museo del pueblo', 'Sala 2', 'el museo', 'los visitantes', ors('k', ['Estas vasijas son prehispánicas;', '[w:es decir], [p:se hicieron antes de que llegaran los españoles].']))),
      solucion: [{ texto: [cubre('«Antes de que llegaran los españoles»'), ' explica «prehispánicas» con otras palabras.'] }],
      respuesta: [justo('Reformulación'), ': dice lo mismo con otras palabras'] },
    { nivel: 1, titulo: 'Las frutas del recreo',
      enunciado: '¿Sirve «por ejemplo» en el espacio del mensaje de la tutora?',
      datos: [D_EJEM],
      figura: fig(papel('mensaje', 'Familias de 5.º B', null, 'la tutora', 'las familias', ors('k', ['Los chicos pueden traer frutas para el recreo;', '[w:¿…?], [p:una mandarina o un plátano].']))),
      solucion: [{ texto: [cubre('«Una mandarina o un plátano»'), ' son casos de frutas: es una ejemplificación.'] }],
      respuesta: [justo('Sí'), ': da casos de frutas'] },
    { nivel: 1, titulo: 'La mazamorra de la abuela',
      enunciado: '¿Qué relación marca «después» en la receta del cuaderno de la abuela?',
      datos: D_IDEA3_0,
      figura: fig(papel('cuaderno', 'Cuaderno de cocina', 'Mazamorra morada', 'la abuela', 'sus nietos', ors('k', ['Hierve el maíz morado con canela;', '[w:después], [p:cuela el líquido y agrega la fruta].']))),
      solucion: [{ texto: [cubre('«Cuela el líquido»'), ' es el paso que sigue a hervir: orden en el tiempo.'] }],
      respuesta: [justo('Orden en el tiempo')] },
    { nivel: 1, titulo: 'Los libros de la biblioteca',
      enunciado: '¿Por qué «es decir» no sirve en el espacio del aviso de la biblioteca?',
      datos: [D_EJEM0, D_REFOR0],
      figura: fig(papel('puerta', 'Puerta de la biblioteca', 'Aviso', 'la biblioteca', 'los estudiantes', ors('k', ['Aquí hay libros de muchos temas;', '[w:¿…?], [p:de historia del Perú].']))),
      solucion: [
        { texto: [prop('«Es decir»'), ' diría que «muchos temas» es lo mismo que historia del Perú.'] },
        { texto: [cubre('«De historia del Perú»'), ' es solo un caso: va «por ejemplo».'] }],
      respuesta: [justo('Porque es un caso, no lo mismo'), ': va «por ejemplo»'] },
    { nivel: 1, titulo: 'El informe de la brigada',
      enunciado: '¿Qué relación marca «en resumen» en el informe de la brigada ecológica?',
      datos: D_IDEA3_0,
      figura: fig(papel('mural', 'Mural del colegio', 'Informe de la brigada', 'la brigada ecológica', 'todo el colegio', ors('k', ['Plantamos treinta árboles, limpiamos el patio y separamos la basura;', '[w:en resumen], [p:fue un buen mes para el colegio].']))),
      solucion: [{ texto: [cubre('«Fue un buen mes»'), ' reúne lo dicho antes: los árboles, el patio y la basura.'] }],
      respuesta: [justo('Cierre'), ': reúne lo dicho antes'] },

    { nivel: 2, titulo: 'El viaje de promoción',
      enunciado: '¿Qué conector va en el espacio: «después», «en resumen» o «por ejemplo»?',
      datos: D_IDEA3,
      figura: fig(papel('mensaje', 'Promoción 2026', null, 'el delegado', 'la promoción', ors('k', ['Hicimos una rifa, una pollada y una venta de queques;', '[w:¿…?], [p:toda la promoción trabajó para el viaje].']))),
      solucion: [
        { texto: [cubre('«Toda la promoción trabajó para el viaje»'), ' junta en una idea la rifa, la pollada y los queques: es un cierre.'] },
        { texto: [prop('«Después»'), ' marcaría otro paso; ', prop('«por ejemplo»'), ', un caso.'] }],
      respuesta: [justo('«En resumen»')] },
    { nivel: 2, titulo: 'La vacuna gratuita',
      enunciado: '¿Qué conector va en el espacio: «por ejemplo», «después» o «es decir»?',
      datos: D_IDEA3,
      figura: fig(papel('puerta', 'Puerta de la posta', 'Aviso', 'la posta', 'las mamás y los papás', ors('k', ['Este mes la vacuna es gratuita;', '[w:¿…?], [p:no tiene ningún costo para las familias].']))),
      solucion: [
        { texto: [cubre('«No tiene ningún costo»'), ' dice lo mismo que «gratuita», con otras palabras.'] },
        { texto: [prop('«Por ejemplo»'), ' daría un caso; ', prop('«después»'), ', otro paso.'] }],
      respuesta: [justo('«Es decir»')] },
    { nivel: 2, titulo: 'El sábado de compras',
      enunciado: '¿Qué conector va en el espacio: «después», «o sea» o «es decir»?',
      datos: D_IDEA3,
      figura: fig(papel('mensaje', 'Familia Mamani', null, 'la mamá', 'la familia', ors('k', ['Primero vamos a la feria a comprar papa;', '[w:¿…?], [p:pasamos por la casa de la abuela].']))),
      solucion: [
        { texto: [cubre('«Pasamos por la casa de la abuela»'), ' es lo que viene tras la feria: otro paso.'] },
        { texto: [prop('«O sea»'), ' y ', prop('«es decir»'), ' repetirían lo mismo, y es otra acción.'] }],
      respuesta: [justo('«Después»')] },
    { nivel: 2, titulo: 'La feria de ciencias',
      enunciado: '¿Qué conector va en el espacio: «después», «por ejemplo» o «en otras palabras»?',
      datos: D_IDEA3,
      figura: fig(papel('cartel', 'Cartel de la feria de ciencias', 'Proyectos', 'el club de ciencias', 'los visitantes', ors('k', ['Hay proyectos sobre el agua del lago;', '[w:¿…?], [p:un filtro hecho con arena y carbón].']))),
      solucion: [
        { texto: [cubre('«Un filtro hecho con arena y carbón»'), ' es un caso de proyecto sobre el agua.'] },
        { texto: [prop('«Después»'), ' marcaría otro paso; ', prop('«en otras palabras»'), ' diría lo mismo.'] }],
      respuesta: [justo('«Por ejemplo»')] },
    { nivel: 2, titulo: 'La plaza arreglada',
      enunciado: '¿Qué conector va en el espacio: «antes», «por ejemplo» o «en suma»?',
      datos: D_IDEA3,
      figura: fig(papel('mensaje', 'Junta vecinal Bellavista', null, 'el tesorero', 'los vecinos', ors('k', ['Arreglamos la pileta, pintamos las bancas y pusimos focos nuevos;', '[w:¿…?], [p:la junta renovó toda la plaza].']))),
      solucion: [
        { texto: [cubre('«La junta renovó toda la plaza»'), ' junta los tres arreglos en una sola idea: es un cierre.'] },
        { texto: [prop('«Antes»'), ' marcaría otro paso; ', prop('«por ejemplo»'), ', un caso.'] }],
      respuesta: [justo('«En suma»')] },

    { nivel: 3, titulo: 'Palabras del quechua',
      enunciado: 'Pregunta 61 del simulacro. Elige el conector que, puesto en el espacio, da al texto un sentido coherente y preciso.',
      datos: D_IDEA3,
      figura: fig(sim(61, ors('h', ['Muchas palabras del castellano del Perú vienen del quechua;', '[w:¿…?], [p:«cancha», «choclo» y «papa»].']), P_ELIJA,
        ['por ejemplo', 'después', 'sin embargo', 'por lo tanto', 'o sea'])),
      solucion: [
        { texto: [cubre('«Cancha», «choclo» y «papa»'), ' son casos de esas palabras.'] },
        { texto: [mala('B'), ' marcaría otro paso; ', mala('C'), ', un choque; ', mala('D'), ', una consecuencia.'] },
        { texto: [mala('E'), ' diría que tres palabras son lo mismo que «muchas». ', buena('A'), ': ', justo('por ejemplo'), '.'] }],
      respuesta: [buena('A'), ': por ejemplo'] },
    { nivel: 3, titulo: 'El bosque de queñuas',
      enunciado: 'Pregunta 62 del simulacro. Elige el conector que, puesto en el espacio, da al texto un sentido coherente y preciso.',
      datos: D_IDEA3,
      figura: fig(sim(62, ors('h', ['La comunidad decidió por unanimidad cuidar el bosque de queñuas;', '[w:¿…?], [p:todos, sin excepción, votaron a favor].']), P_ELIJA,
        ['por ejemplo', 'es decir', 'después', 'sin embargo', 'por eso'])),
      solucion: [
        { texto: [cubre('«Todos, sin excepción, votaron a favor»'), ' explica «por unanimidad» con otras palabras.'] },
        { texto: [mala('A'), ' daría un caso; ', mala('C'), ', otro paso.'] },
        { texto: [mala('D'), ' marcaría un choque; ', mala('E'), ', una consecuencia. ', buena('B'), ': ', justo('es decir'), '.'] }],
      respuesta: [buena('B'), ': es decir'] },
    { nivel: 3, titulo: 'El pedido de los vecinos',
      enunciado: 'Pregunta 63 del simulacro. Elige el conector que, puesto en el espacio, da al texto un sentido coherente y preciso.',
      datos: D_IDEA3,
      figura: fig(sim(63, ors('h', ['Primero, el comité recogió las firmas de los vecinos;', '[w:¿…?], [p:presentó el pedido en la municipalidad].', 'Finalmente, esperó la respuesta del alcalde.']), P_ELIJA,
        ['es decir', 'por ejemplo', 'después', 'sin embargo', 'o sea'])),
      solucion: [
        { texto: [cubre('«Presentó el pedido»'), ' es el paso que sigue a recoger las firmas.'] },
        { texto: [mala('A'), ' y ', mala('E'), ' repetirían lo mismo; ', mala('B'), ' daría un caso.'] },
        { texto: [mala('D'), ' marcaría un choque. ', buena('C'), ': ', justo('después'), ' marca el paso que sigue.'] }],
      respuesta: [buena('C'), ': después'] },
    { nivel: 3, titulo: 'La vida en el lago',
      enunciado: 'Pregunta 64 del simulacro. Elige el conector que, puesto en el espacio, da al texto un sentido coherente y preciso.',
      datos: D_IDEA3,
      figura: fig(sim(64, ors('h', ['El lago Titicaca da pescado a las familias de sus orillas.', 'Su totora sirve para hacer balsas y casas.', '[w:¿…?], [p:el lago es la base de la vida en sus orillas].']), P_ELIJA,
        ['por ejemplo', 'antes', 'sin embargo', 'en suma', 'aun así'])),
      solucion: [
        { texto: [cubre('«El lago es la base de la vida»'), ' reúne lo dicho: el pescado, las balsas y las casas.'] },
        { texto: [mala('A'), ' daría un caso; ', mala('B'), ', otro paso.'] },
        { texto: [mala('C'), ' y ', mala('E'), ' marcarían un choque. ', buena('D'), ': ', justo('en suma'), ' cierra.'] }],
      respuesta: [buena('D'), ': en suma'] },
    { nivel: 3, titulo: 'El puente peatonal',
      enunciado: 'Pregunta 65 del simulacro. Elige lo que completa el texto con un sentido coherente.',
      datos: D_IDEA3,
      figura: fig(sim(65, ors('h', ['El nuevo puente del río es peatonal;', '[p:es decir,] [w:¿…?].']), P_FINAL,
        ['lo construyó la municipalidad', 'pasan muchos carros por él', 'se terminó en dos meses', 'tiene barandas de fierro', 'solo pueden cruzarlo a pie'])),
      solucion: [
        { texto: ['Después de ', cubre('«es decir»'), ' va lo mismo con otras palabras: qué es «peatonal».'] },
        { texto: [mala('B'), ' dice lo contrario; ', mala('A'), ', ', mala('C'), ' y ', mala('D'), ' cuentan otras cosas del puente.'] },
        { texto: [buena('E'), ': ', justo('cruzarlo a pie'), ' explica «peatonal».'] }],
      respuesta: [buena('E'), ': solo pueden cruzarlo a pie'] },
  ];

  const clases = {
    id: 'clases',
    titulo: 'Cada espacio pide una clase',
    pregunta: '¿Cómo sé qué clase de conector pide un espacio?',
    temas: ['Clases de conectores'],
    pieza: 'rv-soporte',
    lee: {
      tarjetas: [
        { titulo: 'El folleto de la feria', texto: 'En la feria de la quinua de Cabana, la cooperativa reparte un folleto con una receta. Tiene tres espacios, y cada uno pide un conector distinto.',
          pieza: 'rv-soporte', dibujo: { datos: folleto3(INI3), estado: {} } },
        { titulo: 'Más relaciones', texto: 'Además de sumar, chocar o dar la razón, dos ideas pueden unirse de otras maneras: una da un caso de la otra, la dice con otras palabras o sigue después en el tiempo.' },
        { titulo: 'Clases de conectores', texto: 'Los conectores que marcan la misma relación forman una clase de conectores: «pero» y «sin embargo» son de la misma. Los estudios del discurso los llaman marcadores del discurso.' },
        { titulo: 'Qué mirar al jugar', texto: 'Toca cada oración para cambiar el conector. Mira lo que va después del espacio: ¿es un caso, otras palabras u otro paso?' },
      ],
    },
    actividad: 'Completar el folleto de la quinua con un conector de la clase que pide cada espacio.',
    aprendizaje: 'Los conectores se agrupan en clases por la relación que marcan; también hay ejemplificación, reformulación, orden en el tiempo y cierre.',
    ejemplos: completarDatos(EJEMPLOS_3, 3),
    juega: {
      consigna: 'El folleto de la cooperativa de Cabana. En turquesa, lo que va después de cada espacio: decide qué clase pide.',
      mision: {
        texto: 'Pon en cada espacio del folleto un conector de la clase que pide.',
        logrado: listo3,
        bien: 'Un caso, otras palabras y otro paso: tres clases distintas.',
      },
      voz: '¿Lo que sigue es un caso, otras palabras u otro paso?',
      leyenda: [
        { s: 'negrita', t: 'el espacio del conector' },
        { s: cubre('turquesa'), t: 'lo que decide la clase' },
        { s: prop('naranja'), t: 'conector de otra clase' },
        { s: justo('violeta'), t: 'conector de la clase que pide' },
      ],
      controles: FOLLETO3.map((o, k) => ({ id: o.id, etiqueta: `Oración ${k + 1}`, opciones: OPS3.map((t, v) => ({ valor: v, texto: t })) })),
      dibujo: val => ({ datos: Object.assign({ toques: Object.fromEntries(FOLLETO3.map(o => [o.id, o.id])) }, folleto3(val)), estado: est3(val) }),
      lectura: lectura3,
      minimo: 3,
    },
    predice: {
      pregunta: 'El folleto termina así: «¿…? la quinua se lava, se hierve y se prepara de muchas formas». ¿Qué conector va en el espacio?',
      voz: 'Elige antes de ver: después miramos qué hace esa oración.',
      opciones: opciones('en resumen', [
        ['por ejemplo', 'RV35', 'Une con lo anterior, bien; pero la última oración no da un caso: junta lo dicho.'],
        ['sin embargo', 'RVC2', 'Une con lo anterior, bien; pero nada choca con lo que dijo el folleto.'],
        ['por eso', 'RVC6', 'Une con lo anterior, bien; pero marcaría un resultado, y la oración no sale de lo anterior: lo repite.'],
      ]),
      dibujo: { datos: folletoFin3(), estado: {} },
      revelar: { datos: folletoFin3('En resumen', 'En resumen'), estado: { marcas: { o4w: 'f', o4p: 'i' } } },
      coincide: 'Coincide: la última oración junta lo que el folleto ya dijo: es un cierre.',
    },
    mira: {
      datos: PROB3,
      voz: 'Volvamos al final del folleto: ¿qué hace esa oración?',
      pasos: [
        { estado: { senal: ['c0'], marcas: { c0p: 'i' }, nuevo: ['c0p'] }, texto: 'La oración junta lo que el folleto ya dijo: lavar, hervir y muchas formas.',
          ecuacion: [cubre('lavar + hervir + formas'), ' → ', { negrita: 'lo dicho antes' }] },
        { estado: { marcas: { c0p: 'i' }, tachar: ['c1'], nuevo: ['c1'] }, texto: '«Por ejemplo» daría un caso; aquí no hay un caso, hay un resumen.',
          ecuacion: [prop('por ejemplo'), ': ejemplificación'] },
        { estado: { marcas: { c0p: 'i' }, tachar: ['c1', 'c2'], nuevo: ['c2'] }, texto: '«Sin embargo» marcaría un choque; nada choca con lo anterior.',
          ecuacion: [prop('sin embargo'), ': contraste'] },
        { estado: { marcas: { c0p: 'i' }, tachar: ['c1', 'c2', 'c3'], nuevo: ['c3'] }, texto: '«Por eso» diría que la oración resulta de lo anterior, y solo lo repite.',
          ecuacion: [prop('por eso'), ': consecuencia'] },
        { estado: { marcas: { c0p: 'i', c4: 'f' }, tachar: ['c1', 'c2', 'c3'], nuevo: ['c4'] }, texto: '«En resumen» reúne lo dicho antes: es un cierre.',
          ecuacion: [justo('en resumen'), ': cierre'] },
      ],
    },
    regla: {
      texto: 'Los conectores se agrupan en clases por la relación que marcan. Además de las anteriores: ejemplificación (por ejemplo), reformulación (es decir), orden en el tiempo (después) y cierre (en resumen).',
      ecuacion: [cubre('lo de antes'), ' + ', { negrita: 'clase' }, ' + ', cubre('lo de después')],
      voz: 'Antes de elegir, mira qué hace la parte que sigue.',
      condicion: 'las partes a los dos lados del espacio tienen esa relación; un conector de la misma clase puede reemplazar a otro.',
    },
    resuelve: {
      pieza: 'rv-soporte',
      generar(s) {
        const R = RESUELVE_3[s % RESUELVE_3.length];
        return resuelveDe(R, { pasos: pasosDe(R, PIDE3, REGLA3) }, 3);
      },
    },
    ahoraTu: {
      pieza: 'rv-soporte',
      voz: 'Otro texto corto. Mira qué hace la parte que va después del espacio.',
      generar(s) {
        const A = AHORA_3[s % AHORA_3.length], sop = sim(55 + (s % AHORA_3.length), ors('h', A.o));
        return {
          pregunta: '¿Qué conector va en el espacio?',
          datos: datosPregunta(3, D_IDEA3, '', [A.ok, ...A.m.map(x => x[0])], sop),
          dibujo: { datos: sop, estado: {} },
          opciones: opciones(A.ok, voltear(A.m, s)),
          solucion: { texto: A.por, ecuacion: [justo(A.ok)], dibujo: { datos: sop, estado: estHoja(sop) } },
        };
      },
    },
  };

  // Mesa de la idea 3: el folleto sin la misión, con sus retos (conserva el id «tablero» de la mesa vieja).
  const mesaFolleto = Object.assign({ id: 'tablero', titulo: 'El folleto de la quinua', pieza: 'rv-soporte' }, sinMision(clases.juega), {
    invitaciones: [
      { texto: 'Pon «es decir» en las tres oraciones y mira en cuál encaja.',
        logrado: val => FOLLETO3.every(o => val[o.id] === 2),
        bien: 'Solo en la oración 2: ahí se explica una palabra difícil.' },
      { texto: 'Deja bien puesto solo el espacio de los pasos; los otros, vacíos.',
        logrado: val => FOLLETO3.every(o => (o.id === 'o3' ? va3(o, val[o.id]) : val[o.id] === 0)),
        bien: '«Después»: hervir viene tras lavar.' },
      { texto: 'Haz que ningún espacio quede bien puesto.',
        logrado: val => FOLLETO3.every(o => val[o.id] && !va3(o, val[o.id])),
        bien: 'Cada espacio pide su clase: con otra, el folleto dice otra cosa.' },
    ] });

  // ---------- Idea 4: varias palabras, un conector (conserva su id; etapa 8) ----------
  // Cambia: la locución de cada oración del periódico mural. Permanece: la misma lluvia de la tarde. Progresa: de tres
  // espacios a tres locuciones de tres relaciones (concesión, causa y consecuencia). Se reserva: dónde va «aunque» al
  // reescribir una oración (predicción). Debe verse: que la misma lluvia es obstáculo, razón o causa de un resultado
  // según lo que pasó después, y que cada locución vale por un conector simple.
  // Objeto de la primera pantalla: el periódico mural de 5.º A (el equipo de prensa, para todo el colegio).
  // Colores: lo que pasó (decide), i; la locución de otra relación, o; la que marca la relación, f.
  // Códigos: RV24, RV25, RV26, RV35, RVC1, RVC2, RVC3 y RVC5.

  // El juego: el mundo chico del periódico mural. Cada oración pide una relación; cada locución marca una sola.
  const REL4 = { 'si bien': 'concesión', 'dado que': 'causa', 'de modo que': 'consecuencia' };
  const EQ4 = { 'si bien': 'aunque', 'dado que': 'porque', 'de modo que': 'por eso' };
  const OPS4 = [HUECO, 'si bien', 'dado que', 'de modo que'];
  const MURAL4 = [
    { id: 'o1', pl: '[w:¿…?] llovió toda la tarde, [p:la feria se hizo igual en la plaza].', pide: 'concesión', may: true,
      no: { 'dado que': 'la lluvia no explica la plaza', 'de modo que': 'no hay nada antes de la lluvia' } },
    { id: 'o2', pl: '[w:¿…?] llovió toda la tarde, [p:los puestos se pasaron al coliseo].', pide: 'causa', may: true,
      no: { 'si bien': 'pasarse al coliseo era lo esperado', 'de modo que': 'no hay nada antes de la lluvia' } },
    { id: 'o3', pl: 'Llovió toda la tarde, [w:¿…?] [p:la plaza amaneció llena de charcos].', pide: 'consecuencia',
      no: { 'si bien': 'los charcos eran lo esperado', 'dado que': 'los charcos no causaron la lluvia' } },
  ];
  const va4 = (o, v) => !!v && REL4[OPS4[v]] === o.pide;
  const pone4 = (o, v) => (v ? (o.may ? may(OPS4[v]) : OPS4[v]) : HUECO);
  const mural4 = val => papel('mural', 'Periódico mural de 5.º A', 'La feria del sábado', 'el equipo de prensa', 'todo el colegio',
    MURAL4.map(o => oracion(o.id, o.pl, pone4(o, val[o.id] || 0), 'De modo que')));
  const INI4 = Object.fromEntries(MURAL4.map(o => [o.id, 0]));
  const listo4 = val => MURAL4.every(o => va4(o, val[o.id]));
  const est4 = val => ({ marcas: Object.assign(Object.fromEntries(MURAL4.map(o => [`${o.id}p`, 'i'])),
    Object.fromEntries(MURAL4.filter(o => val[o.id]).map(o => [`${o.id}w`, va4(o, val[o.id]) ? 'f' : 'o']))) });
  const lectura4 = val => {
    if (listo4(val)) return [justo('Tres locuciones'), ': como aunque, porque y por eso'];
    const o = MURAL4.find(x => val[x.id] && !va4(x, val[x.id]));
    if (o) { const c = OPS4[val[o.id]]; return [prop(`«${may(c)}»`), ` = ${EQ4[c]}; ${o.no[c]}`]; }
    const b = MURAL4.filter(x => va4(x, val[x.id])).length;
    return b ? [justo(`${b} de 3 oraciones bien unidas`), '; faltan las otras'] : ['Toca una oración y prueba una locución'];
  };

  // La predicción: dónde va «aunque» al reescribir una oración con «aun así». Sin letras en la figura.
  const PL_FIEBRE = '[p:Rosa tenía fiebre]; [w:aun así], fue al colegio.';
  const aula4 = extra => papel('mural', 'Periódico mural de 5.º A', 'Noticias del aula', 'el equipo de prensa', 'todo el colegio',
    [oracion('r1', PL_FIEBRE), oracion('r2', 'Al mediodía, su mamá la recogió.')].concat(extra || []));
  const PROB4 = probador('Cuaderno de Mateo', '¿Dónde va «aunque»?', 'Mateo', PL_FIEBRE,
    ['Aunque fue al colegio, Rosa tenía fiebre', 'Como tenía fiebre, Rosa fue al colegio', 'Rosa tenía fiebre y además fue al colegio', 'Aunque tenía fiebre, Rosa fue al colegio']);

  // «Así se resuelve»: cuatro hojas. La buena: E, D, B y A.
  const PIDE4 = 'Piden la locución del espacio: hay que ver qué relación une las dos ideas.';
  const REGLA4 = 'Una locución vale por un conector simple y se clasifica igual; en la concesión, va delante del obstáculo.';
  const RESUELVE_4 = [
    { sop: sim(71, ors('h', ['[w:¿…?] [q:el camino a la comunidad estaba cerrado por un derrumbe], [p:la brigada llegó a tiempo por otra ruta].']), P_ELIJA,
      ['Dado que', 'De modo que', 'Así como', 'Puesto que', 'Aun cuando']), buena: 'E', pide: PIDE4,
      datos: D_IDEA4, tengo: [cubre('«El camino a la comunidad estaba cerrado»'), ' es un obstáculo, y ', cubre('«la brigada llegó a tiempo»'), ' pasó igual.'],
      malas: [mala('A'), ' y ', mala('D'), ' darían una razón: el derrumbe no explica llegar a tiempo. ', mala('B'), ' marcaría un resultado. ', mala('C'), ' sumaría otra cosa.'],
      bien: [buena('E'), ': ', justo('aun cuando'), ' equivale a «aunque».'],
      sentido: 'Cambia la locución por «aunque»: aunque el camino estaba cerrado, llegó a tiempo. Dice lo mismo.' },
    { sop: sim(72, ors('h', ['Los vecinos limpiaron el canal [w:¿…?] [p:la basura tapaba el paso del agua].']), P_ELIJA,
      ['si bien', 'de modo que', 'a pesar de que', 'puesto que', 'así como']), buena: 'D', pide: PIDE4,
      datos: D_IDEA4, tengo: [cubre('«La basura tapaba el paso del agua»'), ' es la razón de limpiar el canal: una causa.'],
      malas: [mala('A'), ' y ', mala('C'), ' marcarían un obstáculo. ', mala('B'), ' pondría la basura como resultado: al revés. ', mala('E'), ' sumaría otra cosa.'],
      bien: [buena('D'), ': ', justo('puesto que'), ' equivale a «porque».'],
      sentido: 'Cambia por «porque»: limpiaron el canal porque la basura tapaba el agua. Dice lo mismo.' },
    { sop: sim(73, ors('h', ['[p:Las inscripciones se cerraron el viernes],', '[w:¿…?] nadie más podrá entrar al concurso.']), P_ELIJA,
      ['ya que', 'de modo que', 'si bien', 'a pesar de que', 'así como']), buena: 'B', pide: PIDE4,
      datos: D_IDEA4, tengo: [cubre('«Las inscripciones se cerraron»'), ' es la razón; que nadie más entre es lo que resulta.'],
      malas: [mala('A'), ' pondría el resultado como razón: al revés. ', mala('C'), ' y ', mala('D'), ' marcarían un obstáculo. ', mala('E'), ' sumaría otra cosa.'],
      bien: [buena('B'), ': ', justo('de modo que'), ' equivale a «por eso».'],
      sentido: 'Cambia por «por eso»: se cerraron las inscripciones; por eso nadie más entrará. Dice lo mismo.' },
    { sop: sim(74, ors('h', ['[p:El examen era difícil]; [w:aun así], casi todos lo aprobaron.']), '¿Qué oración con «aunque» dice lo mismo que el texto?',
      ['Aunque el examen era difícil, casi todos lo aprobaron', 'Aunque casi todos lo aprobaron, el examen era muy difícil', 'Como el examen era difícil, casi todos lo aprobaron',
        'El examen era difícil y además todos lo aprobaron', 'Aunque el examen era fácil, casi todos lo aprobaron']), buena: 'A',
      pide: 'Piden la oración con «aunque» que dice lo mismo que el texto.',
      datos: D_IDEA4, tengo: [cubre('«El examen era difícil»'), ' es el obstáculo; aprobar es lo que pasó igual.'],
      malas: [mala('B'), ' pone «aunque» delante de lo que pasó igual: afirma otra cosa. ', mala('C'), ' da una razón. ', mala('D'), ' suma. ', mala('E'), ' cambia el examen.'],
      bien: [buena('A'), ': ', justo('aunque'), ' va delante del obstáculo.'],
      sentido: 'El texto afirma que casi todos aprobaron; la oración A afirma lo mismo.' },
  ];

  // «Ahora tú»: cuatro casos con cuatro opciones y dos con cinco.
  const AHORA_4 = [
    { o: ['Llevaremos casacas [w:¿…?] [p:en la puna hace mucho frío de noche].'], ok: 'puesto que',
      por: 'El frío de la puna es la razón de llevar casacas: causa.',
      m: [['si bien', 'RVC2', 'Une las dos ideas, bien; pero marca un obstáculo, y el frío es la razón de llevarlas.'],
        ['de modo que', 'RVC1', 'Une razón y resultado, bien; pero al revés: el frío no resulta de llevar casacas.'],
        ['así como', 'RVC5', 'Une las dos ideas, bien; pero suma, y el frío es la razón.']] },
    { o: ['[p:Se acabaron las entradas en una hora],', '[w:¿…?] muchos se quedaron sin ver el partido.'], ok: 'de modo que',
      por: 'Quedarse sin ver el partido resulta de que se acabaran las entradas.',
      m: [['aun cuando', 'RVC2', 'Une las dos ideas, bien; pero marca un obstáculo, y quedarse fuera era lo esperado.'],
        ['ya que', 'RVC1', 'Une razón y resultado, bien; pero al revés: quedarse fuera no acabó las entradas.'],
        ['además de que', 'RVC5', 'Une las dos ideas, bien; pero suma, y una sale de la otra.']] },
    { o: ['[p:Hacía mucho viento]; [w:aun así], los pescadores salieron al lago.'], ok: 'Aunque hacía mucho viento, los pescadores salieron',
      pregunta: '¿Qué oración con «aunque» dice lo mismo que el texto?', por: 'El viento es el obstáculo: «aunque» va delante de él.',
      m: [['Aunque los pescadores salieron, hacía mucho viento', 'RVC3', 'Usa «aunque», bien; pero delante de lo que pasó igual: cambia lo que se afirma.'],
        ['Como hacía mucho viento, los pescadores salieron', 'RV24', 'Une las dos ideas, bien; pero «como» da una razón, y el viento no explica salir.'],
        ['Hacía mucho viento y además los pescadores salieron', 'RV26', 'Junta los dos hechos, bien; pero como una suma: se pierde el obstáculo.']] },
    { o: ['[w:¿…?] [q:no tenía experiencia], [p:Pedro hizo un buen trabajo en la feria].'], ok: 'Aun cuando',
      por: 'La falta de experiencia es un obstáculo que no impidió el buen trabajo: concesión.',
      m: [['Puesto que', 'RV25', 'Une las dos ideas, bien; pero da una razón, y la falta de experiencia no explica el buen trabajo.'],
        ['De manera que', 'RV24', 'Une las dos ideas, bien; pero marca un resultado, y el buen trabajo va contra lo esperado.'],
        ['Así como', 'RV26', 'Une las dos ideas, bien; pero suma, y aquí hay un obstáculo superado.']] },
    { o: ['La reunión se pasó para el lunes [w:¿…?] [p:el presidente de la junta está de viaje].'], ok: 'dado que',
      por: 'El viaje del presidente es la razón del cambio: causa.',
      m: [['si bien', 'RVC2', 'Une las dos ideas, bien; pero marca un obstáculo, y el viaje es la razón.'],
        ['de manera que', 'RVC1', 'Une razón y resultado, bien; pero al revés: el viaje no resulta de pasar la reunión.'],
        ['así como', 'RVC5', 'Une las dos ideas, bien; pero suma, y el viaje explica el cambio.'],
        ['es decir', 'RV35', 'Une las dos ideas, bien; pero el viaje no repite lo de la reunión.']] },
    { o: ['[w:¿…?] [q:la abuela nunca fue a la escuela], [p:aprendió a leer sola].'], ok: 'Aun cuando',
      por: 'No ir a la escuela es un obstáculo que no le impidió aprender a leer: concesión.',
      m: [['Dado que', 'RV25', 'Une las dos ideas, bien; pero da una razón, y no ir a la escuela no explica aprender a leer.'],
        ['De modo que', 'RV24', 'Une las dos ideas, bien; pero marca un resultado, y aquí hay un obstáculo.'],
        ['Así como', 'RV26', 'Une las dos ideas, bien; pero suma, y aquí una va contra la otra.'],
        ['Por ejemplo', 'RV35', 'Une las dos ideas, bien; pero lo segundo no es un caso de lo primero.']] },
  ];

  // Ejemplos resueltos de la idea 4. Nivel 1: a qué equivale una locución, qué relación marca, dónde va «aunque». Nivel 2:
  // tres locuciones u oraciones de una lista. Nivel 3: la hoja con cinco alternativas; las correctas son A, B, C, D y E.
  const EJEMPLOS_4 = [
    { nivel: 1, titulo: 'La salida del simulacro',
      enunciado: '¿Qué conector simple puede reemplazar a «dado que» en el aviso del colegio?',
      datos: [D_LOCU, D_CONCE0, D_CAUSA40, D_CONSEC40],
      figura: fig(papel('puerta', 'Puerta del colegio', 'Aviso', 'la Dirección', 'las familias', ors('k', ['[w:Dado que] [p:mañana hay simulacro], la salida será a la una.']))),
      solucion: [{ texto: [cubre('«Mañana hay simulacro»'), ' es la razón de salir a la una: es una causa, como con «porque».'] }],
      respuesta: [justo('«Porque»'), ': las dos dan la razón'] },
    { nivel: 1, titulo: 'El turno de la tía',
      enunciado: '¿«Puesto que» es una locución conjuntiva en el mensaje de la tía Nely?',
      datos: [D_LOCU, D_CAUSA40],
      figura: fig(papel('mensaje', 'Familia Condori', null, 'la tía Nely', 'la familia', ors('k', ['No iré a la fiesta [w:puesto que] [p:tengo turno en el hospital].']))),
      solucion: [{ texto: ['Son dos palabras fijas que trabajan como un solo conector; ', cubre('«tengo turno en el hospital»'), ' es la razón.'] }],
      respuesta: [justo('Sí'), ': funciona como «porque»'] },
    { nivel: 1, titulo: 'El campeonato con lluvia',
      enunciado: '¿Qué relación marca «a pesar de que» en el cartel de la liga?',
      datos: [D_CONCE0, D_CAUSA40, D_CONSEC40],
      figura: fig(papel('cartel', 'Cartel de la cancha', 'Campeonato', 'la liga del barrio', 'los vecinos', ors('k', ['[w:A pesar de que] [q:llovió toda la semana], [p:el campeonato terminó en la fecha prevista].']))),
      solucion: [{ texto: [cubre('«Llovió toda la semana»'), ' es un obstáculo que no impidió terminar a tiempo: es una concesión.'] }],
      respuesta: [justo('Concesión'), ': el obstáculo no impidió terminar'] },
    { nivel: 1, titulo: 'La maqueta de Hugo',
      enunciado: 'Si se reescribe con «aunque» el mensaje de Hugo, ¿delante de qué idea va «aunque»?',
      datos: [D_CONCE0, D_DELANTE],
      figura: fig(papel('mensaje', 'Promoción 2026', null, 'Hugo', 'la promoción', ors('k', ['[p:Estaba muy cansado]; [w:aun así], terminé la maqueta.']))),
      solucion: [{ texto: [cubre('«Estaba muy cansado»'), ' es el obstáculo, y «aunque» va delante de él: «aunque estaba muy cansado, terminé la maqueta».'] }],
      respuesta: [justo('Delante de «estaba muy cansado»')] },
    { nivel: 1, titulo: 'Las vacunas nuevas',
      enunciado: '¿Sirve «si bien» en el espacio del aviso de la posta?',
      datos: [D_CONCE0, D_CAUSA40],
      figura: fig(papel('puerta', 'Puerta de la posta', 'Aviso', 'la posta', 'los pacientes', ors('k', ['[w:¿…?] [p:llegaron más vacunas], hoy atenderemos hasta las seis.']))),
      solucion: [{ texto: [prop('«Si bien»'), ' marcaría un obstáculo, y ', cubre('«llegaron más vacunas»'), ' es la razón de atender más.'] }],
      respuesta: [justo('No'), ': va una locución de causa'] },

    { nivel: 2, titulo: 'La cancha mojada',
      enunciado: '¿Qué locución va en el espacio: «si bien», «ya que» o «de modo que»?',
      datos: D_IDEA4,
      figura: fig(papel('mensaje', 'Promoción 2026', null, 'el capitán del equipo', 'la promoción', ors('k', ['[w:¿…?] [q:la cancha estaba mojada], [p:el partido se jugó igual].']))),
      solucion: [
        { texto: [cubre('«La cancha estaba mojada»'), ' es un obstáculo que no impidió jugar: concesión.'] },
        { texto: [prop('«Ya que»'), ' daría una razón; ', prop('«de modo que»'), ', un resultado.'] }],
      respuesta: [justo('«Si bien»')] },
    { nivel: 2, titulo: 'La biblioteca cerrada',
      enunciado: '¿Qué locución va en el espacio: «si bien», «puesto que» o «de manera que»?',
      datos: D_IDEA4,
      figura: fig(papel('puerta', 'Puerta de la biblioteca', 'Aviso', 'la biblioteca', 'los estudiantes', ors('k', ['Cerramos la biblioteca temprano [w:¿…?] [p:había que fumigar los estantes].']))),
      solucion: [
        { texto: [cubre('«Había que fumigar los estantes»'), ' es la razón del cierre: causa.'] },
        { texto: [prop('«Si bien»'), ' marcaría un obstáculo; ', prop('«de manera que»'), ', un resultado.'] }],
      respuesta: [justo('«Puesto que»')] },
    { nivel: 2, titulo: 'La banda de la procesión',
      enunciado: '¿Qué locución va en el espacio: «aun cuando», «a pesar de que» o «de modo que»?',
      datos: D_IDEA4,
      figura: fig(papel('mural', 'Mural de la parroquia', 'Avisos', 'el comité de la fiesta', 'los vecinos', ors('k', ['[p:El maestro de la banda se enfermó],', '[w:¿…?] la banda no tocó en la procesión.']))),
      solucion: [
        { texto: [cubre('«El maestro de la banda se enfermó»'), ' es la razón; no tocar es lo que resultó.'] },
        { texto: [prop('«Aun cuando»'), ' y ', prop('«a pesar de que»'), ' marcarían un obstáculo superado, y la banda no tocó.'] }],
      respuesta: [justo('«De modo que»')] },
    { nivel: 2, titulo: 'El paseo con lluvia',
      enunciado: '¿Qué dice lo mismo que el mensaje: «Aunque llovió, salimos al paseo», «Aunque salimos al paseo, llovió mucho» o «Como llovió, salimos al paseo»?',
      datos: D_IDEA4,
      figura: fig(papel('mensaje', 'Familia Mamani', null, 'el tío Juan', 'la familia', ors('k', ['[p:Llovió en la mañana]; [w:aun así], salimos al paseo.']))),
      solucion: [
        { texto: [cubre('«Llovió en la mañana»'), ' es el obstáculo: «aunque» va delante de él.'] },
        { texto: [prop('La segunda'), ' pone el paseo como obstáculo; ', prop('la tercera'), ' da una razón.'] }],
      respuesta: [justo('«Aunque llovió, salimos al paseo»')] },
    { nivel: 2, titulo: 'La carpa del campamento',
      enunciado: '¿Qué locución va en el espacio: «por ejemplo», «aun cuando» o «así como»?',
      datos: D_IDEA4,
      figura: fig(papel('mural', 'Mural de los scouts', 'El campamento', 'la jefa de grupo', 'los scouts', ors('k', ['[w:¿…?] [q:nadie lo ayudó], [p:Raúl armó solo la carpa del campamento].']))),
      solucion: [
        { texto: [cubre('«Nadie lo ayudó»'), ' es un obstáculo que no impidió armar la carpa: concesión.'] },
        { texto: [prop('«Por ejemplo»'), ' daría un caso; ', prop('«así como»'), ' sumaría.'] }],
      respuesta: [justo('«Aun cuando»')] },

    { nivel: 3, titulo: 'Los miradores de Puno',
      enunciado: 'Pregunta 81 del simulacro. Elige la locución que, puesta en el espacio, da al texto un sentido coherente y preciso.',
      datos: D_IDEA4,
      figura: fig(sim(81, ors('h', ['[w:¿…?] [q:la ciudad de Puno está a más de 3800 metros de altura], [p:muchos turistas suben a sus miradores sin problemas].']), P_ELIJA,
        ['Aun cuando', 'Dado que', 'De manera que', 'Así como', 'Ya que'])),
      solucion: [
        { texto: [cubre('«Está a más de 3800 metros»'), ' es un obstáculo; ', cubre('«suben a sus miradores sin problemas»'), ' pasa igual.'] },
        { texto: [mala('B'), ' y ', mala('E'), ' darían una razón; ', mala('C'), ', un resultado; ', mala('D'), ' sumaría.'] },
        { texto: [buena('A'), ': ', justo('aun cuando'), ' marca la concesión.'] }],
      respuesta: [buena('A'), ': aun cuando'] },
    { nivel: 3, titulo: 'Las frazadas de junio',
      enunciado: 'Pregunta 82 del simulacro. Elige la locución que, puesta en el espacio, da al texto un sentido coherente y preciso.',
      datos: D_IDEA4,
      figura: fig(sim(82, ors('h', ['La municipalidad repartió frazadas en las comunidades altas [w:¿…?] [p:se anuncian heladas de hasta diez grados bajo cero].']), P_ELIJA,
        ['si bien', 'puesto que', 'de modo que', 'a pesar de que', 'así como'])),
      solucion: [
        { texto: [cubre('«Se anuncian heladas»'), ' es la razón de repartir frazadas: causa.'] },
        { texto: [mala('A'), ' y ', mala('D'), ' marcarían un obstáculo; ', mala('C'), ' iría al revés; ', mala('E'), ' sumaría.'] },
        { texto: [buena('B'), ': ', justo('puesto que'), ' equivale a «porque».'] }],
      respuesta: [buena('B'), ': puesto que'] },
    { nivel: 3, titulo: 'El viaje a Arequipa',
      enunciado: 'Pregunta 83 del simulacro. Elige la locución que, puesta en el espacio, da al texto un sentido coherente y preciso.',
      datos: D_IDEA4,
      figura: fig(sim(83, ors('h', ['[p:La carretera quedó en mal estado tras las lluvias],', '[w:¿…?] el viaje a Arequipa ahora dura dos horas más.']), P_ELIJA,
        ['ya que', 'aun cuando', 'de modo que', 'si bien', 'a pesar de que'])),
      solucion: [
        { texto: [cubre('«La carretera quedó en mal estado»'), ' es la razón; el viaje más largo es lo que resulta.'] },
        { texto: [mala('A'), ' iría al revés. ', mala('B'), ', ', mala('D'), ' y ', mala('E'), ' marcarían un obstáculo.'] },
        { texto: [buena('C'), ': ', justo('de modo que'), ' equivale a «por eso».'] }],
      respuesta: [buena('C'), ': de modo que'] },
    { nivel: 3, titulo: 'El equipo incompleto',
      enunciado: 'Pregunta 84 del simulacro. ¿Qué oración con «aunque» dice lo mismo que el texto?',
      datos: D_IDEA4,
      figura: fig(sim(84, ors('h', ['[p:Faltaban dos jugadores]; [w:aun así], el equipo ganó el partido.']), '¿Qué oración con «aunque» dice lo mismo que el texto?',
        ['Aunque el equipo ganó, faltaban dos jugadores', 'Como faltaban dos jugadores, el equipo ganó', 'Faltaban dos jugadores y además el equipo ganó',
          'Aunque faltaban dos jugadores, el equipo ganó', 'Aunque estaban todos, el equipo ganó el partido'])),
      solucion: [
        { texto: [cubre('«Faltaban dos jugadores»'), ' es el obstáculo; ganar es lo que pasó igual.'] },
        { texto: [mala('A'), ' pone «aunque» delante de lo que pasó igual. ', mala('B'), ' da una razón; ', mala('C'), ' suma; ', mala('E'), ' cambia el texto.'] },
        { texto: [buena('D'), ': ', justo('aunque'), ' va delante del obstáculo.'] }],
      respuesta: [buena('D'), ': Aunque faltaban dos jugadores, el equipo ganó'] },
    { nivel: 3, titulo: 'El museo pequeño',
      enunciado: 'Pregunta 85 del simulacro. Elige lo que completa el texto con un sentido coherente.',
      datos: D_IDEA4,
      figura: fig(sim(85, ors('h', ['[p:Si bien] [q:el museo es pequeño], [w:¿…?].']), P_FINAL,
        ['recibe pocas visitas al año', 'tiene un solo guardián', 'es pequeño y tiene dos salas', 'tiene pocas salas', 'guarda piezas de gran valor'])),
      solucion: [
        { texto: [cubre('«Si bien»'), ' admite un obstáculo, ', cubre('«el museo es pequeño»'), ', y anuncia algo que va contra él.'] },
        { texto: [mala('A'), ', ', mala('B'), ' y ', mala('D'), ' van con «pequeño»: no hay obstáculo superado. ', mala('C'), ' repite.'] },
        { texto: [buena('E'), ': ', justo('piezas de gran valor'), ' va contra lo que hace esperar «pequeño».'] }],
      respuesta: [buena('E'), ': guarda piezas de gran valor'] },
  ];

  const locuciones = {
    id: 'locuciones',
    titulo: 'Varias palabras, un conector',
    pregunta: '¿Por qué «si bien» puede reemplazar a «aunque»?',
    temas: ['Locuciones conjuntivas'],
    pieza: 'rv-soporte',
    lee: {
      tarjetas: [
        { titulo: 'El periódico mural', texto: 'El equipo de prensa de 5.º A contó en el periódico mural cómo fue la feria del sábado. Las tres oraciones hablan de la misma lluvia, y cada una tiene un espacio.',
          pieza: 'rv-soporte', dibujo: { datos: mural4(INI4), estado: {} } },
        { titulo: 'Una locución', texto: 'Una locución conjuntiva es un grupo fijo de palabras que trabaja como un solo conector: «dado que», «de modo que», «si bien». Sus palabras no se separan.' },
        { titulo: 'Un obstáculo que no impide', texto: 'A veces se admite un obstáculo y se dice que no impidió algo: «hacía frío; aun así, salimos». Esa relación es la concesión, una forma del contraste.' },
        { titulo: 'Qué mirar al jugar', texto: 'Toca cada oración para cambiar la locución. Pregúntate si lo que sigue a la locución es un obstáculo, una razón o lo que resultó.' },
      ],
    },
    actividad: 'Poner en el periódico mural la locución que une cada par de ideas.',
    aprendizaje: 'Una locución conjuntiva funciona como un conector y se clasifica igual; la de concesión, como «aunque», va delante del obstáculo que no impidió lo dicho.',
    ejemplos: completarDatos(EJEMPLOS_4, 4),
    juega: {
      consigna: 'El periódico mural de 5.º A. En turquesa, lo que pasó con la lluvia: decide qué locución va.',
      mision: {
        texto: 'Pon en cada oración la locución que marca cómo se unen sus dos ideas.',
        logrado: listo4,
        bien: 'Tres locuciones, tres relaciones: cada una vale por un conector.',
      },
      voz: '¿Lo que sigue a la locución es un obstáculo, una razón o lo que resultó?',
      leyenda: [
        { s: 'negrita', t: 'el espacio de la locución' },
        { s: cubre('turquesa'), t: 'lo que pasó: decide la locución' },
        { s: prop('naranja'), t: 'locución de otra relación' },
        { s: justo('violeta'), t: 'locución que marca esa relación' },
      ],
      controles: MURAL4.map((o, k) => ({ id: o.id, etiqueta: `Oración ${k + 1}`, opciones: OPS4.map((t, v) => ({ valor: v, texto: t })) })),
      dibujo: val => ({ datos: Object.assign({ toques: Object.fromEntries(MURAL4.map(o => [o.id, o.id])) }, mural4(val)), estado: est4(val) }),
      lectura: lectura4,
      minimo: 3,
    },
    predice: {
      pregunta: 'En el mismo periódico mural: «Rosa tenía fiebre; aun así, fue al colegio». ¿Qué oración con «aunque» dice lo mismo?',
      voz: 'Elige antes de ver: después buscamos el obstáculo.',
      opciones: opciones('Aunque tenía fiebre, Rosa fue al colegio', [
        ['Aunque fue al colegio, Rosa tenía fiebre', 'RVC3', 'Usa «aunque», bien; pero delante de lo que pasó igual: haría de ir al colegio el obstáculo.'],
        ['Como tenía fiebre, Rosa fue al colegio', 'RV24', 'Une las dos ideas, bien; pero «como» da una razón, y la fiebre no explica que fuera.'],
        ['Rosa tenía fiebre y además fue al colegio', 'RV26', 'Junta los dos hechos, bien; pero como una suma: se pierde que la fiebre era un obstáculo.'],
      ]),
      dibujo: { datos: aula4(), estado: {} },
      revelar: { datos: aula4([oracion('r3', '[w:Aunque] [p:tenía fiebre], Rosa fue al colegio.')]), estado: { marcas: { r1p: 'i', r3p: 'i', r3w: 'f' } } },
      coincide: 'Coincide: la fiebre es el obstáculo, y «aunque» va delante de él.',
    },
    mira: {
      datos: PROB4,
      voz: 'Volvamos a la noticia: ¿cuál es el obstáculo?',
      pasos: [
        { estado: { senal: ['c0'], marcas: { c0p: 'i' }, nuevo: ['c0p'] }, texto: 'La fiebre es el obstáculo; ir al colegio es lo que pasó igual.',
          ecuacion: [cubre('tenía fiebre'), ': obstáculo'] },
        { estado: { marcas: { c0p: 'i' }, tachar: ['c1'], nuevo: ['c1'] }, texto: '«Aunque» delante de «fue al colegio» haría de ir al colegio el obstáculo.',
          ecuacion: [prop('aunque fue al colegio'), ': otro obstáculo'] },
        { estado: { marcas: { c0p: 'i' }, tachar: ['c1', 'c2'], nuevo: ['c2'] }, texto: '«Como» da una razón: la fiebre no explica que fuera.',
          ecuacion: [prop('como'), ': causa'] },
        { estado: { marcas: { c0p: 'i' }, tachar: ['c1', 'c2', 'c3'], nuevo: ['c3'] }, texto: '«Y además» suma; aquí la fiebre iba en contra de ir.',
          ecuacion: [prop('y además'), ': adición'] },
        { estado: { marcas: { c0p: 'i', c4: 'f' }, tachar: ['c1', 'c2', 'c3'], nuevo: ['c4'] }, texto: '«Aunque» va delante del obstáculo: «aunque tenía fiebre».',
          ecuacion: [justo('aunque'), ' + ', cubre('obstáculo')] },
      ],
    },
    regla: {
      texto: 'Una locución conjuntiva es un grupo de palabras que funciona como un solo conector y se clasifica igual. En la concesión, «aunque» o «si bien» van delante del obstáculo.',
      ecuacion: [{ negrita: 'aunque' }, ' + ', cubre('obstáculo'), ' + lo que pasó igual'],
      voz: 'Si dudas, cambia la locución por un conector simple.',
      condicion: 'la locución se puede cambiar por un conector simple y la oración sigue diciendo lo mismo.',
    },
    resuelve: {
      pieza: 'rv-soporte',
      generar(s) {
        const R = RESUELVE_4[s % RESUELVE_4.length];
        return resuelveDe(R, { pasos: pasosDe(R, R.pide, REGLA4) }, 4);
      },
    },
    ahoraTu: {
      pieza: 'rv-soporte',
      voz: 'Otro texto corto. Cambia la locución por un conector simple y relee.',
      generar(s) {
        const A = AHORA_4[s % AHORA_4.length], sop = sim(75 + (s % AHORA_4.length), ors('h', A.o));
        return {
          pregunta: A.pregunta || '¿Qué locución va en el espacio?',
          datos: datosPregunta(4, D_IDEA4, A.pregunta || '', [A.ok, ...A.m.map(x => x[0])], sop),
          dibujo: { datos: sop, estado: {} },
          opciones: opciones(A.ok, voltear(A.m, s)),
          solucion: { texto: A.por, ecuacion: [justo(A.ok.length > 14 ? 'aunque + obstáculo' : A.ok)], dibujo: { datos: sop, estado: estHoja(sop) } },
        };
      },
    },
  };

  // Mesa de la idea 4: el periódico mural sin la misión, con sus retos (conserva el id de la mesa vieja).
  const mesaLocuciones = Object.assign({ id: 'locuciones', titulo: 'La feria con lluvia', pieza: 'rv-soporte' }, sinMision(locuciones.juega), {
    invitaciones: [
      { texto: 'Pon «dado que» en las tres oraciones y mira en cuál encaja.',
        logrado: val => MURAL4.every(o => val[o.id] === 2),
        bien: 'Solo en la oración 2: ahí la lluvia es la razón.' },
      { texto: 'Deja bien unida solo la oración de la plaza; las otras, con el espacio vacío.',
        logrado: val => MURAL4.every(o => (o.id === 'o1' ? va4(o, val[o.id]) : val[o.id] === 0)),
        bien: '«Si bien»: la lluvia fue un obstáculo que no impidió la feria.' },
      { texto: 'Haz que ninguna oración quede bien unida.',
        logrado: val => MURAL4.every(o => val[o.id] && !va4(o, val[o.id])),
        bien: 'Cada locución vale por un conector: con otra relación, no encaja.' },
    ] });

  // ---------- Idea 5: varios espacios, una alternativa (nueva, etapa 8) ----------
  // Cambia: qué alternativas se tachan y cuál se marca. Permanece: la hoja con dos espacios. Progresa: de cinco
  // alternativas a la única que cumple en los dos. Se reserva: el texto con tres espacios (predicción). Debe verse: que
  // una alternativa puede acertar en un espacio y fallar en el otro, y que entonces se descarta entera.
  // Objeto de la primera pantalla: la hoja de simulacro (el examen, para el postulante).
  // Colores: lo que decide cada espacio, i; la alternativa marcada que falla, o; la que sirve, f; las tachadas, raya.
  // Códigos: RVC4 (un solo espacio) y los de la relación del espacio en que falla cada alternativa.
  const sinToques = x => Object.fromEntries(Object.entries(x).filter(([k]) => k !== 'toques'));

  // Un texto con varios espacios: «{1}», «{2}» y «{3}» son los espacios (en negrita); `vals` los llena (revelar).
  const espacios = (pre, lista, vals) => ors(pre, lista.map(t => t.replace(/\{(\d)\}/g, (_, n) => `[${'wxy'[n - 1]}:${vals ? vals[n - 1] : `¿…? (${n})`}]`)));

  // El juego: el mundo chico de la hoja. Cada espacio pide una relación; cada alternativa trae un conector por espacio.
  const REL5 = { 'sin embargo': 'contraste', 'en cambio': 'contraste', 'además': 'adición', 'por eso': 'consecuencia', 'es decir': 'reformulación', porque: 'causa' };
  const TEXTO5 = ['Este año llovió muy poco en el altiplano; {1} [p:la cosecha de papa fue pequeña].', '{2} [q:la quinua, que resiste la sequía, dio una buena cosecha].'];
  const PIDE5 = ['consecuencia', 'contraste'];
  const ALT5 = [['sin embargo', 'en cambio'], ['por eso', 'en cambio'], ['por eso', 'además'], ['es decir', 'además'], ['porque', 'además']];
  const falla5 = a => a.findIndex((c, k) => REL5[c] !== PIDE5[k]);
  const MARCA5 = [HUECO, 'sirve', 'no sirve'];
  const CTL5 = 'abcde';
  const hoja5 = () => Object.assign(sim(20, espacios('h', TEXTO5), P_VARIOS, ALT5.map(a => a.join(' – '))), { toques: Object.fromEntries(ALT5.map((a, k) => [LETRAS[k], CTL5[k]])) });
  const INI5 = Object.fromEntries(ALT5.map((a, k) => [CTL5[k], 0]));
  const listo5 = val => ALT5.every((a, k) => val[CTL5[k]] === (falla5(a) < 0 ? 1 : 2));
  const est5 = val => ({ marcas: Object.assign({ h1p: 'i', h2q: 'i' }, Object.fromEntries(ALT5.map((a, k) => [LETRAS[k], val[CTL5[k]]]).filter(([, v]) => v === 1).map(([L]) => [L, falla5(ALT5[LETRAS.indexOf(L)]) < 0 ? 'f' : 'o']))),
    tachar: ALT5.map((a, k) => LETRAS[k]).filter((L, k) => val[CTL5[k]] === 2) });
  const lectura5 = val => {
    if (listo5(val)) return [justo('B: por eso y en cambio'), '; las demás fallan en un espacio'];
    for (const [k, a] of ALT5.entries()) {
      const v = val[CTL5[k]], f = falla5(a);
      if (v === 1 && f >= 0) return [prop(LETRAS[k]), `: «${a[f]}» falla en el espacio ${f + 1}`];
      if (v === 2 && f < 0) return [prop(LETRAS[k]), ': sus dos conectores sí sirven'];
    }
    const n = ALT5.filter((a, k) => val[CTL5[k]] === 2).length;
    return n ? [justo(`${n} de 4 tachadas`), '; revisa las otras'] : ['Toca una alternativa: ¿sirve en los dos espacios?'];
  };

  // La predicción: un texto con tres espacios. Sin letras en la figura (la app baraja las opciones).
  // El espacio 3 se decide sin saber de precios (antes: «se vende cara porque se cultiva poco»), y la correcta no es la
  // que más comparte con las demás: la que falla solo en el 3 (RVC4) usa otro conector de contraste en el 1.
  const TEXTO5P = ['La papa nativa tiene cientos de variedades; {1} [p:la papa blanca del mercado tiene pocas].', '{2} [q:la nativa casi no se ve en Lima], {3} [p:se vende sobre todo en las ferias de la sierra].'];
  const OK5P = ['en cambio', 'además', 'porque'];
  const MALAS5P = [['sin embargo', 'además', 'por eso'], ['por eso', 'además', 'ya que'], ['no obstante', 'es decir', 'por eso']];
  const papas5 = vals => sim(21, espacios('h', TEXTO5P, vals));
  // Mira: el cuaderno con el texto y las cuatro alternativas, sin letras (la app baraja las de Predice: con letras, la
  // correcta era la A en Predice y la D en Mira; lector B).
  const MIRA5 = papel('cuaderno', 'Cuaderno de Tomás', '¿Qué alternativa completa los tres?', 'Tomás', 'la práctica de Comunicación',
    espacios('c', TEXTO5P).map(o => Object.assign(o, { num: '' })).concat(MALAS5P.concat([OK5P]).map((a, k) => ({ id: `a${k + 1}`, t: a.join(' – '), num: '–' }))));

  // «Así se resuelve»: cuatro hojas. La buena: A, C, D y C.
  const PIDE5R = 'Piden la alternativa que sirve en todos los espacios del texto.';
  const REGLA5 = 'Cada espacio pide su relación: se prueba uno por uno y se descarta la alternativa que falle en alguno.';
  const RESUELVE_5 = [
    { sop: sim(91, espacios('h', ['Mi hermana estudia enfermería en las mañanas; {1}, [p:trabaja en una farmacia por las tardes].', '{2}, [q:casi no tiene tiempo libre].']), P_VARIOS,
      ['también – por eso', 'también – sin embargo', 'o sea – por eso', 'por eso – sin embargo', 'es decir – sin embargo']), buena: 'A',
      datos: D_IDEA5, tengo: ['En el 1, ', cubre('«trabaja en una farmacia»'), ' suma otra tarea; en el 2, ', cubre('«casi no tiene tiempo libre»'), ' resulta de las dos.'],
      malas: [mala('B'), ' sirve en el 1, pero en el 2 nada choca. ', mala('C'), ' falla en el 1: no repite. ', mala('D'), ' y ', mala('E'), ' fallan en los dos.'],
      bien: [buena('A'), ': ', justo('también'), ' y ', justo('por eso'), ' cumplen en los dos.'],
      sentido: 'Relee: estudia; también trabaja; por eso casi no tiene tiempo libre. Todo encaja.' },
    { sop: sim(92, espacios('h', ['La biblioteca abrió una sala de lectura para niños; {1}, [p:muy pocos la visitan] {2} [q:el horario coincide con el de las clases].']), P_VARIOS,
      ['sin embargo – por eso', 'por eso – porque', 'sin embargo – porque', 'además – por eso', 'es decir – por eso']), buena: 'C',
      datos: D_IDEA5, tengo: ['En el 1, ', cubre('«muy pocos la visitan»'), ' rompe lo esperado; en el 2, ', cubre('«el horario coincide»'), ' es la razón.'],
      malas: [mala('A'), ' sirve en el 1, pero pone la razón al revés en el 2. ', mala('B'), ' falla en el 1. ', mala('D'), ' y ', mala('E'), ' fallan en los dos.'],
      bien: [buena('C'), ': ', justo('sin embargo'), ' y ', justo('porque'), ' cumplen en los dos.'],
      sentido: 'Relee: abrió la sala; sin embargo, pocos van, porque el horario choca con las clases.' },
    { sop: sim(93, espacios('h', ['En la feria hubo muchos platos típicos; {1}, [p:el chairo y la huatia].', 'También hubo danzas y concursos.', '{2}, [q:fue una feria completa].']), P_VARIOS,
      ['es decir – en resumen', 'por ejemplo – sin embargo', 'después – sin embargo', 'por ejemplo – en resumen', 'o sea – sin embargo']), buena: 'D',
      datos: D_IDEA5.concat([D_EJEM, D_CIERRE]).filter(l => l !== D_CAUSA && l !== D_CONSEC), tengo: ['En el 1, ', cubre('«el chairo y la huatia»'), ' son casos; en el 2, ', cubre('«fue una feria completa»'), ' reúne lo dicho.'],
      malas: [mala('A'), ' falla en el 1. ', mala('B'), ' sirve en el 1, pero falla en el 2. ', mala('C'), ' y ', mala('E'), ' fallan en los dos.'],
      bien: [buena('D'), ': ', justo('por ejemplo'), ' y ', justo('en resumen'), ' cumplen en los dos.'],
      sentido: 'Un caso en el espacio 1 y un cierre en el 2: la alternativa D trae justo eso.' },
    { sop: sim(94, espacios('h', ['La neblina cubrió el aeropuerto de Juliaca; {1}, [p:el vuelo de la mañana salió tres horas tarde].', '{2}, [q:ningún pasajero se quejó del retraso].']), P_VARIOS,
      ['por lo tanto – también', 'porque – aun así', 'así que – aun así', 'sin embargo – aun así', 'es decir – también']), buena: 'C',
      datos: D_IDEA5, tengo: ['En el 1, ', cubre('«salió tres horas tarde»'), ' resulta de la neblina; en el 2, ', cubre('«ningún pasajero se quejó»'), ' rompe lo esperado.'],
      malas: [mala('A'), ' sirve en el 1, pero en el 2 suma donde hay un choque. ', mala('B'), ' y ', mala('D'), ' fallan en el 1. ', mala('E'), ' falla en los dos.'],
      bien: [buena('C'), ': ', justo('así que'), ' y ', justo('aun así'), ' cumplen en los dos.'],
      sentido: 'Relee: salió tarde por la neblina; aun así, nadie se quejó del retraso. Encaja.' },
  ];

  // «Ahora tú»: cuatro casos con cuatro opciones y dos con cinco. El código de cada incorrecta es el del espacio en que
  // falla; RVC4, la que acierta en los primeros espacios y falla en el último.
  const AHORA_5 = [
    { o: ['El camino al nevado es muy empinado; {1} [p:los turistas suben despacio].', '{2}, [q:el sendero no tiene barandas en las curvas].'], ok: 'por eso – también',
      por: 'Subir despacio resulta de lo empinado; las curvas sin barandas suman otra dificultad.',
      m: [['así que – sin embargo', 'RVC4', 'Acierta en el espacio 1, bien; pero en el 2 nada se opone: se suma otra dificultad.'],
        ['pero – también', 'RVC2', 'Acierta en el espacio 2, bien; pero en el 1 subir despacio es lo esperado.'],
        ['es decir – sin embargo', 'RV35', 'Une las ideas, bien; pero en el 1, «es decir» repetiría, y en el 2 nada se opone.']] },
    { o: ['La señal de internet en la comunidad es muy débil; {1} [p:los alumnos no pueden ver las clases virtuales].', '{2}, [q:la luz eléctrica se corta varias veces al día].'], ok: 'así que – además',
      por: 'No ver las clases resulta de la señal débil; los cortes de luz suman otro problema.',
      m: [['por lo tanto – en cambio', 'RVC4', 'Acierta en el espacio 1, bien; pero en el 2 nada se opone: es otro problema.'],
        ['pero – además', 'RVC2', 'Acierta en el espacio 2, bien; pero en el 1 no ver las clases es lo esperado.'],
        ['porque – en cambio', 'RVC1', 'Une las ideas, bien; pero en el 1 la causa queda al revés, y en el 2 nada se opone.']] },
    { o: ['El colegio no tenía instrumentos nuevos; {1}, [p:ganó el concurso de bandas] {2} [q:sus alumnos ensayaron durante meses].'], ok: 'sin embargo – porque',
      por: 'Ganar rompe lo esperado sin instrumentos; ensayar es la razón del triunfo.',
      m: [['no obstante – por eso', 'RVC4', 'Acierta en el espacio 1, bien; pero en el 2 la razón del triunfo queda al revés.'],
        ['por eso – porque', 'RV24', 'Acierta en el espacio 2, bien; pero en el 1 ganar va contra lo esperado.'],
        ['además – por eso', 'RV26', 'Une las ideas, bien; pero en el 1 hay un choque, y en el 2 la razón va al revés.']] },
    { o: ['La feria de Lampa empezó tarde {1} [p:el camión de los toldos se malogró en el camino].', '{2} [q:muchos compradores se fueron sin comprar].'], ok: 'dado que – por eso',
      por: 'El camión malogrado es la razón de empezar tarde; que muchos se fueran resulta de eso.',
      m: [['porque – sin embargo', 'RVC4', 'Acierta en el espacio 1, bien; pero en el 2 nada se opone: irse sale de empezar tarde.'],
        ['así que – por eso', 'RVC1', 'Acierta en el espacio 2, bien; pero en el 1 la razón queda al revés.'],
        ['pero – sin embargo', 'RVC2', 'Une las ideas, bien; pero en el 1 nada se opone: el camión es la razón.']] },
    { o: ['El cerro parece fácil de subir; {1}, [p:muchos turistas no llegan a la cima] {2} [q:el aire de la altura los cansa pronto].', '{3}, [p:los guías piden subir despacio].'], ok: 'sin embargo – porque – por eso',
      por: 'No llegar rompe lo esperado; el aire es la razón; el pedido de los guías resulta de eso.',
      m: [['aun así – ya que – además', 'RVC4', 'Acierta en los espacios 1 y 2, bien; pero en el 3 el pedido de los guías resulta de eso.'],
        ['por eso – porque – por eso', 'RV24', 'Acierta en los espacios 2 y 3, bien; pero en el 1 no llegar va contra lo esperado.'],
        ['no obstante – por lo tanto – además', 'RVC1', 'Acierta en el 1, bien; pero en el 2 la razón va al revés, y en el 3 se suma.'],
        ['también – puesto que – además', 'RV26', 'Acierta en el espacio 2, bien; pero en el 1 hay un choque, no una suma.']] },
    { o: ['Delia ya sabía tejer chompas; {1}, [p:este año aprendió a tejer mantas].', '{2}, [q:ahora vende las dos cosas en la feria].'], ok: 'además – por eso',
      por: 'Las mantas suman otra habilidad; vender las dos cosas resulta de saber tejerlas.',
      m: [['también – pero', 'RVC4', 'Acierta en el espacio 1, bien; pero en el 2 vender las dos cosas sale de saber tejerlas.'],
        ['sin embargo – por eso', 'RVC2', 'Acierta en el espacio 2, bien; pero en el 1 nada se opone: se suma otra habilidad.'],
        ['o sea – también', 'RV35', 'Une las ideas, bien; pero en el 1 las mantas no repiten las chompas, y el 2 no suma.'],
        ['por eso – pero', 'RVC6', 'Une las ideas, bien; pero en el 1 tejer chompas no causa aprender mantas.']] },
  ];

  // Ejemplos resueltos de la idea 5. Nivel 1: qué relación pide un espacio, en qué espacio falla una alternativa. Nivel 2:
  // tres alternativas de una lista. Nivel 3: la hoja con cinco alternativas; las correctas son A, B, C, D y E.
  const EJEMPLOS_5 = [
    { nivel: 1, titulo: 'El carné de vacunación',
      enunciado: '¿Qué relación pide el espacio 1 del aviso de la posta?',
      datos: D_IDEA5_0,
      figura: fig(papel('puerta', 'Puerta de la posta', 'Aviso', 'la posta', 'las familias', espacios('k', ['Mañana vacunamos a los niños contra el sarampión; {1}, [p:traigan su carné de vacunación].', '{2}, [q:los niños sin carné también serán atendidos].']))),
      solucion: [{ texto: [cubre('«Traigan su carné»'), ' es lo que resulta de que mañana haya vacunación: el espacio 1 pide una consecuencia.'] }],
      respuesta: [justo('Consecuencia'), ': como «por eso»'] },
    { nivel: 1, titulo: 'El viaje de promoción',
      enunciado: '¿Sirve la alternativa «por eso – además» en el mensaje de la delegada?',
      datos: D_IDEA5_0,
      figura: fig(papel('mensaje', 'Promoción 2026', null, 'la delegada', 'la promoción', espacios('k', ['El viaje de promoción costará menos de lo pensado; {1}, [p:casi todos se inscribieron].', '{2}, [q:dos compañeros todavía no pagan].']))),
      solucion: [
        { texto: ['En el 1 sirve: ', cubre('«casi todos se inscribieron»'), ' resulta del buen precio.'] },
        { texto: ['En el 2, ', prop('«además»'), ' sumaría, y ', cubre('«dos todavía no pagan»'), ' choca con lo anterior.'] }],
      respuesta: [justo('No'), ': falla en el espacio 2'] },
    { nivel: 1, titulo: 'El agua turbia',
      enunciado: '¿En qué espacio falla la alternativa «además – porque» en el aviso de la municipalidad?',
      datos: D_IDEA5_0,
      figura: fig(papel('cartel', 'Cartel de la municipalidad', 'Aviso', 'la municipalidad', 'los vecinos', espacios('k', ['El agua del caño sale turbia esta semana; {1}, [p:hiérvanla antes de tomarla].', 'Ocurre {2} [q:están limpiando el reservorio].']))),
      solucion: [
        { texto: ['En el 2, «porque» sirve: ', cubre('«están limpiando el reservorio»'), ' es la razón.'] },
        { texto: ['En el 1, ', prop('«además»'), ' sumaría, y hervirla resulta del agua turbia.'] }],
      respuesta: [justo('En el espacio 1')] },
    { nivel: 1, titulo: 'La chacra del abuelo',
      enunciado: '¿Qué relación pide el espacio 2 del mensaje del tío Juan?',
      datos: D_IDEA5_0,
      figura: fig(papel('mensaje', 'Familia Mamani', null, 'el tío Juan', 'la familia', espacios('k', ['La chacra del abuelo es pequeña; {1}, [p:da papa para todo el año] {2} [q:el abuelo la cuida mucho].']))),
      solucion: [{ texto: [cubre('«El abuelo la cuida mucho»'), ' es la razón de que dé tanta papa: el espacio 2 pide una causa.'] }],
      respuesta: [justo('Causa'), ': como «porque»'] },
    { nivel: 1, titulo: 'El paseo al lago',
      enunciado: '¿Qué relación pide el espacio 1 del mensaje de la tutora?',
      datos: D_IDEA5_0,
      figura: fig(papel('mensaje', 'Familias de 5.º B', null, 'la tutora', 'las familias', espacios('k', ['El paseo al lago estaba listo; {1}, [p:se suspendió por la lluvia].', '{2}, [q:se hará el próximo sábado].']))),
      solucion: [{ texto: ['Un paseo listo hace esperar que se haga; ', cubre('«se suspendió por la lluvia»'), ' lo rompe: el espacio 1 pide un contraste.'] }],
      respuesta: [justo('Contraste'), ': como «sin embargo»'] },

    { nivel: 2, titulo: 'La calle en obras',
      enunciado: '¿Qué alternativa completa el mensaje: «además – porque», «sin embargo – porque» o «por eso – porque»?',
      datos: D_IDEA5,
      figura: fig(papel('mensaje', 'Junta vecinal Bellavista', null, 'el presidente de la junta', 'los vecinos', espacios('k', ['La calle principal está en obras; {1} [p:los carros dan la vuelta por el mercado] {2} [q:el paso está cerrado hasta junio].']))),
      solucion: [
        { texto: [cubre('«Los carros dan la vuelta»'), ' resulta de las obras; ', cubre('«el paso está cerrado»'), ' es la razón.'] },
        { texto: [prop('«Además»'), ' y ', prop('«sin embargo»'), ' fallan en el espacio 1.'] }],
      respuesta: [justo('«Por eso – porque»')] },
    { nivel: 2, titulo: 'El turno de la tarde',
      enunciado: '¿Qué alternativa completa el cartel: «por eso – en cambio», «así que – es decir» o «porque – sin embargo»?',
      datos: D_IDEA5,
      figura: fig(papel('cartel', 'Cartel de la academia', 'Horarios', 'la academia', 'los postulantes', espacios('k', ['Muchos alumnos trabajan en las mañanas; {1}, [p:abrimos un turno de tarde].', '{2}, [q:el turno de la mañana sigue igual].']))),
      solucion: [
        { texto: [cubre('«Abrimos un turno de tarde»'), ' resulta del trabajo; ', cubre('«el turno de la mañana sigue igual»'), ' se opone al cambio.'] },
        { texto: [prop('La segunda'), ' falla en el espacio 2; ', prop('la tercera'), ', en el 1.'] }],
      respuesta: [justo('«Por eso – en cambio»')] },
    { nivel: 2, titulo: 'El hermano en Arequipa',
      enunciado: '¿Qué alternativa completa el mensaje: «o sea – por eso», «además – por eso» o «sin embargo – por eso»?',
      datos: D_IDEA5,
      figura: fig(papel('mensaje', 'Familia Condori', null, 'la mamá', 'la familia', espacios('k', ['Tu hermano consiguió trabajo en Arequipa; {1}, [p:lo aceptaron en el instituto de allá].', '{2}, [q:se mudará en febrero].']))),
      solucion: [
        { texto: [cubre('«Lo aceptaron en el instituto»'), ' suma otra buena noticia; ', cubre('«se mudará en febrero»'), ' resulta de las dos.'] },
        { texto: [prop('«O sea»'), ' y ', prop('«sin embargo»'), ' fallan en el espacio 1.'] }],
      respuesta: [justo('«Además – por eso»')] },
    { nivel: 2, titulo: 'Los mantos de Paracas',
      enunciado: '¿Qué alternativa completa el cartel: «por lo tanto – por ejemplo», «además – por ejemplo» o «aun así – por ejemplo»?',
      datos: D_IDEA5.concat([D_EJEM]),
      figura: fig(papel('cartel', 'Cartel del museo', 'Sala de textiles', 'el museo', 'los visitantes', espacios('k', ['Los textiles de Paracas tienen más de dos mil años; {1}, [p:sus colores todavía se ven intensos].', 'Hay piezas de muchas formas; {2}, [q:mantos, bolsas y vinchas].']))),
      solucion: [
        { texto: ['Tanto tiempo hace esperar colores gastados; ', cubre('«todavía se ven intensos»'), ' lo rompe.'] },
        { texto: [prop('«Por lo tanto»'), ' y ', prop('«además»'), ' fallan en el espacio 1.'] }],
      respuesta: [justo('«Aun así – por ejemplo»')] },
    { nivel: 2, titulo: 'La brigada de reciclaje',
      enunciado: '¿Qué alternativa completa el mural: «porque – en suma», «por eso – en suma» o «o sea – en suma»?',
      datos: D_IDEA5.concat([D_CIERRE]),
      figura: fig(papel('mural', 'Mural del colegio', 'Nuestra brigada', 'la brigada de reciclaje', 'todo el colegio', espacios('k', ['Este año el patio está limpio {1} [p:cada salón recoge su basura].', 'Además, vendemos las botellas y compramos plantas.', '{2}, [q:el reciclaje cambió el colegio].']))),
      solucion: [
        { texto: [cubre('«Cada salón recoge su basura»'), ' es la razón del patio limpio.'] },
        { texto: [prop('«Por eso»'), ' la pondría al revés; ', prop('«o sea»'), ' repetiría.'] }],
      respuesta: [justo('«Porque – en suma»')] },

    { nivel: 3, titulo: 'Los botes del lago',
      enunciado: 'Pregunta 101 del simulacro. Elige la alternativa que, puesta en los espacios, da al texto un sentido coherente y preciso.',
      datos: D_IDEA5,
      figura: fig(sim(101, espacios('h', ['El lago estaba muy agitado por el viento; {1} [p:los botes no salieron en la mañana].', '{2}, [q:en la tarde el viento paró y salieron todos].']), P_VARIOS,
        ['por eso – sin embargo', 'así que – además', 'aun así – por lo tanto', 'porque – en cambio', 'es decir – por eso'])),
      solucion: [
        { texto: ['En el 1, ', cubre('«los botes no salieron»'), ' resulta del viento; en el 2, ', cubre('«salieron todos»'), ' se opone a la mañana.'] },
        { texto: [mala('C'), ', ', mala('D'), ' y ', mala('E'), ' fallan en el 1. ', mala('B'), ' sirve en el 1, pero suma en el 2.'] },
        { texto: [buena('A'), ': ', justo('por eso – sin embargo'), ' cumple en los dos.'] }],
      respuesta: [buena('A'), ': por eso – sin embargo'] },
    { nivel: 3, titulo: 'El tren de los vecinos',
      enunciado: 'Pregunta 102 del simulacro. Elige la alternativa que, puesta en los espacios, da al texto un sentido coherente y preciso.',
      datos: D_IDEA5.concat([D_CONCE]),
      figura: fig(sim(102, espacios('h', ['{1} [q:el pasaje subió], [p:los vecinos siguen usando el tren] {2} es más seguro que la carretera.']), P_VARIOS,
        ['Dado que – porque', 'Si bien – ya que', 'Si bien – de modo que', 'Ya que – porque', 'Así como – puesto que'])),
      solucion: [
        { texto: [cubre('«El pasaje subió»'), ' es un obstáculo que no impidió ', cubre('«siguen usando el tren»'), '; lo que sigue es la razón.'] },
        { texto: [mala('A'), ', ', mala('D'), ' y ', mala('E'), ' fallan en el 1. ', mala('C'), ' sirve en el 1, pero pone un resultado en el 2.'] },
        { texto: [buena('B'), ': ', justo('si bien – ya que'), ' cumple en los dos.'] }],
      respuesta: [buena('B'), ': Si bien – ya que'] },
    { nivel: 3, titulo: 'El puente de la comunidad',
      enunciado: 'Pregunta 103 del simulacro. Elige la alternativa que, puesta en los espacios, da al texto un sentido coherente y preciso.',
      datos: D_IDEA5.concat([D_TIEMPO]),
      figura: fig(sim(103, espacios('h', ['Primero, la comunidad votó por el nuevo puente; {1}, [p:pidió el dinero a la municipalidad].', 'El dinero llegó en mayo; {2} [q:la obra empezó en junio].']), P_VARIOS,
        ['después – sin embargo', 'es decir – sin embargo', 'después – así que', 'además – sin embargo', 'por eso – pero'])),
      solucion: [
        { texto: ['En el 1, ', cubre('«pidió el dinero»'), ' es el paso que sigue; en el 2, ', cubre('«la obra empezó»'), ' resulta del dinero.'] },
        { texto: [mala('B'), ', ', mala('D'), ' y ', mala('E'), ' fallan en el 1. ', mala('A'), ' sirve en el 1, pero marca un choque en el 2.'] },
        { texto: [buena('C'), ': ', justo('después – así que'), ' cumple en los dos.'] }],
      respuesta: [buena('C'), ': después – así que'] },
    { nivel: 3, titulo: 'El terremoto',
      enunciado: 'Pregunta 104 del simulacro. Elige la alternativa que, puesta en los espacios, da al texto un sentido coherente y preciso.',
      datos: D_IDEA5.concat([D_EJEM]),
      figura: fig(sim(104, espacios('h', ['El terremoto fue fuerte; {1}, [p:ninguna casa de la calle se cayó] {2} [q:todas tenían columnas de concreto].', 'En otras calles hubo daños; {3}, [p:la iglesia perdió su torre].']), P_VARIOS,
        ['por eso – porque – en otras palabras', 'pero – por eso – por ejemplo', 'aun así – porque – en otras palabras', 'aun así – porque – por ejemplo', 'es decir – porque – en otras palabras'])),
      solucion: [
        { texto: ['En el 1 hay un choque; en el 2, ', cubre('«columnas de concreto»'), ' es la razón; en el 3, la torre es un caso de los daños.'] },
        { texto: [mala('A'), ' y ', mala('E'), ' fallan en el 1; ', mala('B'), ', en el 2; ', mala('C'), ', en el 3.'] },
        { texto: [buena('D'), ': ', justo('aun así – porque – por ejemplo'), ' cumple en los tres.'] }],
      respuesta: [buena('D'), ': aun así – porque – por ejemplo'] },
    { nivel: 3, titulo: 'Las faenas de abril',
      enunciado: 'Pregunta 105 del simulacro. Elige la alternativa que, puesta en los espacios, da al texto un sentido coherente y preciso.',
      datos: [D_VARIOS, D_REFOR, D_EJEM, D_CONCE, D_CAUSA4, D_CONSEC4],
      figura: fig(sim(105, espacios('h', ['La comunidad aprobó el proyecto por unanimidad; {1}, [p:nadie votó en contra].', '{2} [q:faltaba el dinero], el proyecto empezó en abril con faenas de los vecinos.']), P_VARIOS,
        ['por ejemplo – dado que', 'en otras palabras – dado que', 'o sea – de modo que', 'por ejemplo – a pesar de que', 'es decir – a pesar de que'])),
      solucion: [
        { texto: ['En el 1, ', cubre('«nadie votó en contra»'), ' dice lo mismo que «por unanimidad»; en el 2, ', cubre('«faltaba el dinero»'), ' es un obstáculo.'] },
        { texto: [mala('A'), ' y ', mala('D'), ' fallan en el 1; ', mala('B'), ' y ', mala('C'), ' sirven en el 1, pero fallan en el 2.'] },
        { texto: [buena('E'), ': ', justo('es decir – a pesar de que'), ' cumple en los dos.'] }],
      respuesta: [buena('E'), ': es decir – a pesar de que'] },
  ];

  const espaciosIdea = {
    id: 'varios-espacios',
    titulo: 'Varios espacios, una alternativa',
    pregunta: '¿Basta con que una alternativa sirva en el primer espacio?',
    temas: ['Conectores de adición, contraste y causa', 'Clases de conectores'],
    pieza: 'rv-soporte',
    lee: {
      tarjetas: [
        { titulo: 'La hoja del simulacro', texto: 'En el examen, un texto puede traer dos o tres espacios para conectores. Cada alternativa trae un conector por espacio, en orden: el primero va en el espacio 1.',
          pieza: 'rv-soporte', dibujo: { datos: sinToques(hoja5()), estado: {} } },
        { titulo: 'Un espacio, una relación', texto: 'Cada espacio pide su propia relación, como en las ideas anteriores. Que un conector sirva en el espacio 1 no dice nada del espacio 2.' },
        { titulo: 'Descartar', texto: 'Cuando un conector de una alternativa no sirve en su espacio, se descarta la alternativa entera: se tacha, aunque su otro conector sí sirva.' },
        { titulo: 'Qué mirar al jugar', texto: 'Toca cada alternativa para marcar si sirve o no. Prueba sus conectores espacio por espacio, empezando por el más claro.' },
      ],
    },
    actividad: 'Tachar en una hoja de simulacro las alternativas que fallan en algún espacio.',
    aprendizaje: 'Con varios espacios, cada uno pide su relación; se descarta toda alternativa que falle en uno, y sirve la que cumple en todos.',
    ejemplos: completarDatos(EJEMPLOS_5, 5),
    juega: {
      consigna: 'Una hoja de simulacro con dos espacios. En turquesa, lo que decide cada espacio.',
      mision: {
        texto: 'Tacha las alternativas que fallan en algún espacio y marca la que sirve en los dos.',
        logrado: listo5,
        bien: 'Cada espacio con su relación: solo una alternativa cumple en los dos.',
      },
      voz: 'Prueba cada conector en su espacio, de uno en uno.',
      leyenda: [
        { s: 'negrita', t: 'los espacios, con su número' },
        { s: cubre('turquesa'), t: 'lo que decide cada espacio' },
        { s: prop('naranja'), t: 'alternativa marcada que falla' },
        { s: justo('violeta'), t: 'la que sirve en los dos' },
      ],
      controles: ALT5.map((a, k) => ({ id: CTL5[k], etiqueta: `Alternativa ${LETRAS[k]}`, opciones: MARCA5.map((t, v) => ({ valor: v, texto: t })) })),
      dibujo: val => ({ datos: hoja5(), estado: est5(val) }),
      lectura: lectura5,
      minimo: 3,
    },
    predice: {
      pregunta: 'Otra hoja del simulacro trae un texto con tres espacios. ¿Qué alternativa completa los tres?',
      voz: 'Elige antes de ver: después lo probamos espacio por espacio.',
      opciones: opciones(OK5P.join(' – '), [
        [MALAS5P[0].join(' – '), 'RVC4', 'Acierta en los espacios 1 y 2, bien; pero en el 3, «por eso» pone la causa al revés.'],
        [MALAS5P[1].join(' – '), 'RV24', 'Acierta en los espacios 2 y 3, bien; pero en el 1 las dos papas se oponen.'],
        [MALAS5P[2].join(' – '), 'RV35', 'Acierta en el 1, bien; pero «es decir» repite en el 2, y en el 3 invierte la causa.'],
      ]),
      dibujo: { datos: papas5(), estado: {} },
      revelar: { datos: papas5(OK5P), estado: { marcas: { h1w: 'f', h2x: 'f', h2y: 'f', h1p: 'i', h2q: 'i', h2p: 'i' } } },
      coincide: 'Coincide: cada espacio pide lo suyo (contraste, adición y causa), y solo esa alternativa cumple en los tres.',
    },
    mira: {
      datos: MIRA5,
      voz: 'Volvamos a la hoja: un espacio a la vez.',
      pasos: [
        { estado: { senal: ['c2'], marcas: { c2p: 'i' }, nuevo: ['c2p'] }, texto: 'Empieza por el espacio más claro: el 3 da una razón.',
          ecuacion: [cubre('ferias de la sierra'), ' → ', { negrita: 'espacio 3: causa' }] },
        { estado: { marcas: { c2p: 'i' }, tachar: ['a1', 'a3'], nuevo: ['a1', 'a3'] }, texto: 'En el espacio 3, «por eso» pone la causa al revés: fuera las dos.',
          ecuacion: [prop('… – por eso'), ': falla en el 3'] },
        { estado: { marcas: { c2p: 'i', c1p: 'i' }, tachar: ['a1', 'a2', 'a3'], nuevo: ['c1p', 'a2'] }, texto: 'El espacio 1 opone dos papas: «por eso» no sirve ahí, y se tacha.',
          ecuacion: [prop('por eso – …'), ': falla en el 1'] },
        { estado: { marcas: { c2p: 'i', c1p: 'i', c2q: 'i' }, tachar: ['a1', 'a2', 'a3'], nuevo: ['c2q'] }, texto: 'El espacio 2 suma otro dato: «además» sirve en la que queda.',
          ecuacion: [cubre('no se ve en Lima'), ': otro dato, una suma'] },
        { estado: { marcas: { c2p: 'i', c1p: 'i', c2q: 'i', a4: 'f' }, tachar: ['a1', 'a2', 'a3'], nuevo: ['a4'] }, texto: 'Queda «en cambio – además – porque»: cumple en los tres espacios.',
          ecuacion: [justo('en cambio – además – porque'), ': contraste, adición y causa'] },
      ],
    },
    regla: {
      texto: 'En un texto con varios espacios, cada espacio pide su propia relación. Se prueba uno por uno, desde el más claro, y se descarta toda alternativa que falle en alguno.',
      ecuacion: [cubre('espacio 1'), ' y ', cubre('espacio 2'), ' → ', justo('la que cumple en todos')],
      voz: 'Una alternativa vale entera o no vale.',
      condicion: 'cada conector de la alternativa marca la relación que pide su espacio.',
    },
    resuelve: {
      pieza: 'rv-soporte',
      generar(s) {
        const R = RESUELVE_5[s % RESUELVE_5.length];
        return resuelveDe(R, { pasos: pasosDe(R, PIDE5R, REGLA5) }, 5);
      },
    },
    ahoraTu: {
      pieza: 'rv-soporte',
      voz: 'Otro texto con espacios. Resuelve primero el espacio más claro.',
      generar(s) {
        const A = AHORA_5[s % AHORA_5.length], sop = sim(95 + (s % AHORA_5.length), espacios('h', A.o));
        return {
          pregunta: '¿Qué alternativa completa los espacios del texto?',
          datos: datosPregunta(5, D_IDEA5, '', [A.ok, ...A.m.map(x => x[0])], sop),
          dibujo: { datos: sop, estado: {} },
          opciones: opciones(A.ok, voltear(A.m, s)),
          solucion: { texto: A.por, ecuacion: [justo(A.ok)], dibujo: { datos: sop, estado: estHoja(sop) } },
        };
      },
    },
  };

  // Mesa de la idea 5: la hoja sin la misión, con sus retos.
  const mesaSimulacro = Object.assign({ id: 'simulacro', titulo: 'La hoja con dos espacios', pieza: 'rv-soporte' }, sinMision(espaciosIdea.juega), {
    invitaciones: [
      { texto: 'Marca como que sirve la alternativa C y lee por qué falla.',
        logrado: val => val.c === 1,
        bien: 'C acierta en el espacio 1, pero «además» falla en el 2: no sirve.' },
      { texto: 'Tacha todas las que fallan en el espacio 1.',
        logrado: val => ALT5.every((a, k) => (falla5(a) === 0) === (val[CTL5[k]] === 2)),
        bien: 'Con un solo espacio ya se van tres: quedan B y C.' },
      { texto: 'Deja una sola alternativa sin tachar.',
        logrado: val => ALT5.filter((a, k) => val[CTL5[k]] !== 2).length === 1,
        bien: 'Si la que queda es B, cumple en los dos espacios.' },
    ] });

  // ---------- Glosario: las palabras con que el curso habla de cómo se unen las ideas ----------
  // Cada idea estrena de 2 a 4, con `simple` y tres ejemplos: idea 1, conector, expectativa, adición y contraste; idea 2,
  // causa y consecuencia; idea 3, clase de conector, ejemplificación, reformulación y marcador del discurso; idea 4,
  // locución conjuntiva y concesión; idea 5, alternativa y descartar. Los ejemplos no traen la respuesta de ninguna
  // predicción ni una oración de los juegos, los resueltos o los ejercicios (lo prueba conectores.test.js).
  const GLOSARIO = [
    { termino: 'conector', def: 'Palabra o grupo de palabras que une dos ideas y dice qué relación hay entre ellas.',
      simple: 'Una palabra que une dos ideas y dice cómo se unen.',
      ejemplos: ['En «llegué tarde y me retaron», «y» une dos ideas.', 'Un conector no se elige por cómo suena, sino por lo que une.', 'Sin conector, el lector tiene que adivinar cómo se unen las ideas.'],
      formas: ['conector', 'conectores'], ver: ['expectativa', 'clase de conector'] },
    { termino: 'expectativa', def: 'Lo que una idea hace esperar que venga después; la idea que sigue la cumple o la rompe.',
      simple: 'Lo que uno espera que pase después de leer una idea.',
      ejemplos: ['Tras «se fue la luz», se espera la casa a oscuras.', 'Tras «ganó la rifa», se espera que esté contento.', 'Un buen lector se adelanta: espera algo antes de terminar la oración.'],
      formas: ['expectativa', 'expectativas'], ver: ['contraste'] },
    { termino: 'adición', def: 'Relación en la que la segunda idea suma otra cosa a la primera, en la misma dirección.',
      simple: 'Sumar una idea más, que va para el mismo lado.',
      ejemplos: ['«Canta en el coro; además, toca la zampoña.»', '«La tienda vende pan y también leche.»', 'En una adición, ninguna idea sale de la otra.'],
      ver: ['conector'] },
    { termino: 'contraste', def: 'Relación en la que la segunda idea rompe lo que la primera hacía esperar, o se le opone.',
      simple: 'Cuando lo que viene va contra lo que se esperaba.',
      ejemplos: ['«Se preparó poco; aun así, ganó el debate.»', '«Hace sol, pero el viento es helado.»', 'El contraste sorprende: lo esperado no llega.'],
      formas: ['contraste', 'contrastes'], ver: ['expectativa', 'concesión'] },
    { termino: 'causa', def: 'Lo que hace que algo pase: la razón de otra idea.',
      simple: 'La razón por la que algo pasa.',
      ejemplos: ['En «no salió porque llovía», la lluvia es la causa.', 'La causa puede ir al principio o al final de la oración.', 'Una misma causa puede traer varias cosas.'],
      formas: ['causa', 'causas'], ver: ['consecuencia'] },
    { termino: 'consecuencia', def: 'Lo que resulta de una causa.',
      simple: 'Lo que pasa por culpa o gracias a otra cosa.',
      ejemplos: ['En «llovía; por eso no salió», no salir es la consecuencia.', 'Los charcos son una consecuencia de la lluvia.', '«Así que» y «por lo tanto» anuncian una consecuencia.'],
      formas: ['consecuencia', 'consecuencias'], ver: ['causa'] },
    { termino: 'clase de conector', def: 'Grupo de conectores que marcan la misma relación; uno puede reemplazar a otro.',
      simple: 'Conectores que hacen el mismo trabajo.',
      ejemplos: ['«Pero» y «sin embargo» son de la misma clase.', '«Por eso» y «así que» se pueden cambiar uno por otro.', 'Hay clases de adición, de contraste, de orden y otras.'],
      formas: ['clase de conector', 'clases de conectores', 'clase de conectores'], ver: ['conector'] },
    { termino: 'ejemplificación', def: 'Relación en la que la segunda parte da un caso concreto de lo que dice la primera.',
      simple: 'Dar un caso para que se entienda una idea general.',
      ejemplos: ['«Hay aves que viajan lejos; por ejemplo, la golondrina.»', 'Un ejemplo no suma una idea nueva: muestra la misma.', '«Frutas como la tuna»: «como» también da un ejemplo.'],
      ver: ['reformulación'] },
    { termino: 'reformulación', def: 'Relación en la que la segunda parte dice lo mismo que la primera con otras palabras.',
      simple: 'Decir lo mismo de otra manera, para que se entienda.',
      ejemplos: ['«Es un ave nocturna, es decir, sale de noche.»', '«O sea» y «en otras palabras» reformulan.', 'Sirve para explicar una palabra difícil.'],
      ver: ['ejemplificación'] },
    { termino: 'marcador del discurso', def: 'Nombre que dan los estudios del discurso a las palabras que guían cómo leer lo que sigue.',
      simple: 'El nombre que les dan los estudiosos a estas palabras guía.',
      ejemplos: ['Los conectores son una parte de los marcadores del discurso.', '«Bueno», al empezar a hablar, también es un marcador.', 'Portolés estudió los marcadores del español.'],
      formas: ['marcadores del discurso', 'marcador del discurso'], ver: ['conector'] },
    { termino: 'locución conjuntiva', def: 'Grupo fijo de palabras que funciona como un solo conector.',
      simple: 'Varias palabras que trabajan juntas como un solo conector.',
      ejemplos: ['«A pesar de que» vale como una sola palabra.', '«Puesto que» funciona como «porque».', 'Sus palabras no se separan ni se cambian por otras.'],
      formas: ['locuciones conjuntivas', 'locución conjuntiva', 'locuciones', 'locución'], ver: ['conector', 'concesión'] },
    { termino: 'concesión', def: 'Contraste en el que se admite un obstáculo que no impide lo que se afirma.',
      simple: 'Reconocer un problema que no impidió lo que pasó.',
      ejemplos: ['Admitir el frío y salir igual a pasear es una concesión.', '«Aun cuando», «si bien» y «a pesar de que» marcan concesión.', 'La concesión es una forma del contraste.'],
      formas: ['concesión', 'concesiones'], ver: ['contraste', 'locución conjuntiva'] },
    { termino: 'alternativa', def: 'Cada respuesta posible de una pregunta de examen, con su letra.',
      simple: 'Cada respuesta que te dan para elegir, con su letra.',
      ejemplos: ['Una pregunta de examen suele traer cinco alternativas, de la A a la E.', 'Con dos espacios, cada alternativa trae dos conectores.', 'Solo una alternativa es la correcta.'],
      formas: ['alternativa', 'alternativas'], ver: ['descartar'] },
    { termino: 'descartar', def: 'Tachar una alternativa porque una de sus partes no sirve.',
      simple: 'Tachar una respuesta que falla en algo.',
      ejemplos: ['Si el primer conector falla, la alternativa se descarta entera.', 'Descartar ahorra tiempo: lo tachado ya no se vuelve a mirar.', 'Al final, solo una queda sin descartar.'],
      formas: ['descartar', 'descarta', 'descartada', 'descartadas', 'descartan'], ver: ['alternativa'] },
  ];
  const HISTORIA = {
    texto: 'Los estudios del discurso se preguntaron no solo cómo se unen las oraciones, sino cómo ciertas palabras guían la lectura. En español, Portolés (1998) y Martín Zorraquino y Portolés (1999) ordenaron los marcadores del discurso. Una misma forma puede cumplir funciones distintas: una lista no resuelve todos los casos.',
    pregunta: '¿Qué te dice «sin embargo» antes de leer lo que sigue?',
    // La fuente es la que cita la matriz de la unidad (antes el título decía «Matriz de teoría…» y el enlace iba al CVC).
    fuente: { titulo: 'Instituto Cervantes, Diccionario de términos clave de ELE: marcadores del discurso', url: 'https://cvc.cervantes.es/ensenanza/biblioteca_ele/diccio_ele/diccionario/marcadoresdiscurso.htm' },
  };

  const IDEAS_U = [relacion, causa, clases, locuciones, espaciosIdea];

  return {
    unidad: 'razonamiento-verbal.conectores',
    version: '0.3.1',
    calidad: 2,
    estado: 'completa',
    requiere: ['/nucleo/kit/piezas/rv-soporte.js'],
    // La unidad no usa letras de fórmula: lo que hay que leer en la figura va en la leyenda de cada juego.
    letras: {},
    historia: HISTORIA,
    glosario: GLOSARIO,
    laboratorio: [mesaRelacion, mesaComunicado, mesaFolleto, mesaLocuciones, mesaSimulacro],
    // A qué idea pertenece cada mesa (Gerson, 16 nov: el laboratorio se agrupa por idea). Las tres mesas viejas conservan
    // su id con el dibujo del juego nuevo de su idea (etapa 8); «comunicado» y «simulacro» son nuevas.
    laboratorioIdeas: {
      relacion: ['relacion-primero'],
      comunicado: ['causa-consecuencia'],
      tablero: ['clases'],
      locuciones: ['locuciones'],
      simulacro: ['varios-espacios'],
    },
    ideas: IDEAS_U,
  };
});
