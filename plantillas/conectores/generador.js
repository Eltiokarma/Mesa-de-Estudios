/*
 * Generador «Conectores»: práctica de las cinco ideas de razonamiento-verbal.conectores
 * (contenido/teoria/razonamiento-verbal/conectores.js; propuesta en docs/etapa8/propuesta-verbal.md). Formato
 * "predicciones" (docs/arquitectura.md). Funciona en el navegador (window.Generadores['conectores']) y en Node.
 *
 * Regla 1 en verbal: la respuesta no la decide un texto escrito a mano, la calcula el código con un mundo chico. Cada
 * ítem del banco trae su texto, la relación que pide cada espacio («pide») y sus alternativas; el generador busca en su
 * tabla (MARCA) la relación que marca cada conector, elige como correcta la única alternativa que cumple en todos los
 * espacios y arma el código y la explicación de cada incorrecta con la relación que su conector marca. Si el banco no
 * cuadra (ninguna o dos que cumplen, dos incorrectas con el mismo código), lanza un error: generador.test.js lo recorre
 * entero. Textos propios; ninguno copia un examen.
 *
 * Tipos por idea (TIPOS_POR_IDEA; nivel 2 con cuatro alternativas, nivel 3 con cinco, como en un simulacro; el formato
 * de la UNI va como hipótesis). generar(semilla, { idea }) da solo los de esa idea; sin idea, las cinco con el mismo peso.
 *   relacion-primero    relacion (2) · relacion-examen (3)
 *   causa-consecuencia  causa (2) · causa-examen (3)
 *   clases              clases (2) · clases-examen (3)
 *   locuciones          locuciones (2) · locuciones-examen (3)
 *   varios-espacios     espacios (2) · espacios-examen (3)
 * El examen usa los ítems con cuatro incorrectas de código distinto (los de contraste, adición y reformulación tienen
 * tres: solo salen en el nivel 2).
 * Errores (docs/investigacion/razonamiento-verbal-ideas-erroneas.md): RV24, RV25, RV26, RV35 y, hipótesis de la unidad,
 * RVC1 a RVC6.
 * Datos (contrato, punto 13): las relaciones entre las que se elige, con sus conectores (las mismas líneas que la
 * teoría); nunca la relación que pide el espacio.
 * _datos: { idea, tipo, nivel, item, codigos }.
 */
(function (root, fabrica) {
  const nodo = typeof module === 'object' && module.exports;
  const api = fabrica(nodo ? require('../../nucleo/azar.js') : root.Azar, nodo ? require('../../nucleo/predicciones.js') : root.Predicciones);
  if (nodo) module.exports = api;
  else (root.Generadores = root.Generadores || {})[api.id] = api;
})(typeof self !== 'undefined' ? self : this, function (Azar, P) {
  'use strict';
  const ID = 'conectores';
  const FUENTE = 'docs/investigacion/razonamiento-verbal-ideas-erroneas.md';
  const RESPALDO = { RV24: 'parcial', RV25: 'parcial' };
  const err = (id, explicacion) => ({ id, explicacion, respaldo: RESPALDO[id] || 'hipotesis', fuente: FUENTE });
  // Las incorrectas que se muestran: k al azar, de modo que la correcta no sea la más larga ni la más corta. Si ninguna
  // mezcla sirve, el banco no cuadra y se lanza un error.
  function elegir(rng, malas, k, correcta) {
    const sirve = xs => { const l = xs.map(x => x.t.length), c = correcta.length; return c < Math.max(...l) && c > Math.min(...l); };
    for (let n = 0; n < 80; n++) { const xs = rng.barajar(malas).slice(0, k); if (sirve(xs)) return xs; }
    throw new Error(`${ID}: con «${correcta}» ninguna mezcla deja la correcta entre la más corta y la más larga`);
  }

  // La relación que marca cada conector.
  const MARCA = {};
  const pon = (rel, ...cs) => cs.forEach(c => { MARCA[c] = rel; });
  pon('contraste', 'sin embargo', 'pero', 'aun así', 'no obstante', 'en cambio');
  pon('concesión', 'aunque', 'si bien', 'aun cuando', 'a pesar de que');
  pon('consecuencia', 'por eso', 'así que', 'por lo tanto', 'por consiguiente', 'de modo que', 'de manera que');
  pon('causa', 'porque', 'ya que', 'dado que', 'puesto que');
  pon('adición', 'además', 'también', 'asimismo', 'así como', 'además de que');
  pon('reformulación', 'es decir', 'o sea', 'en otras palabras');
  pon('ejemplo', 'por ejemplo');
  pon('orden', 'primero', 'antes', 'después', 'finalmente');
  pon('cierre', 'en resumen', 'en suma', 'en síntesis');
  const marca = c => { const r = MARCA[c.toLowerCase()]; if (!r) throw new Error(`${ID}: «${c}» no está en la tabla`); return r; };
  // Qué marca cada relación, en palabras del curso.
  const NOMBRE = { contraste: 'un choque', concesión: 'un obstáculo', consecuencia: 'un resultado', causa: 'una razón', adición: 'una suma',
    reformulación: 'una repetición con otras palabras', ejemplo: 'un caso', orden: 'otro paso', cierre: 'un cierre' };

  // El código de una incorrecta: según lo que pide el espacio y lo que marca su conector.
  const OTRA = new Set(['reformulación', 'ejemplo', 'orden', 'cierre']);
  function codigo(pide, rel) {
    if (pide === 'contraste') return rel === 'adición' ? 'RV26' : rel === 'consecuencia' || rel === 'causa' ? 'RV24' : OTRA.has(rel) ? 'RV35' : null;
    if (pide === 'concesión') return rel === 'causa' ? 'RV25' : rel === 'consecuencia' ? 'RV24' : rel === 'adición' ? 'RV26' : OTRA.has(rel) ? 'RV35' : null;
    if (pide === 'consecuencia' || pide === 'causa') {
      if (rel === 'consecuencia' || rel === 'causa') return 'RVC1';
      return rel === 'contraste' || rel === 'concesión' ? 'RVC2' : rel === 'adición' ? 'RVC5' : 'RV35';
    }
    if (pide === 'adición') return rel === 'consecuencia' || rel === 'causa' ? 'RVC6' : rel === 'contraste' ? 'RVC2' : 'RV35';
    // ejemplo, reformulación, orden y cierre
    return OTRA.has(rel) ? 'RV35' : rel === 'contraste' || rel === 'concesión' ? 'RVC2' : rel === 'adición' ? 'RVC5' : 'RVC6';
  }
  function explicar(pide, rel, c) {
    if ((pide === 'causa' && rel === 'consecuencia') || (pide === 'consecuencia' && rel === 'causa')) return `Une razón y resultado, bien; pero «${c}» los pone al revés.`;
    return `Une las dos ideas, bien; pero «${c}» marca ${NOMBRE[rel]}, y aquí va ${NOMBRE[pide]}.`;
  }

  // Las líneas de datos, las mismas de la teoría.
  const D = {
    ESPERA: 'Lo esperado: lo que la primera idea hace esperar que venga después.',
    ADI: 'Adición: la segunda idea suma otra cosa en la misma dirección (además, también, asimismo, así como, además de que).',
    CONT: 'Contraste: la segunda idea rompe lo esperado o se opone a la primera (pero, sin embargo, aun así, no obstante, en cambio).',
    RES: 'Resultado: la segunda idea sale de la primera, como se esperaba (por eso, así que, por lo tanto, por consiguiente).',
    CASO: 'Un caso: la segunda parte da un caso de la primera (por ejemplo).',
    OTRAS: 'Otras palabras: la segunda parte dice lo mismo de otra manera (es decir, o sea, en otras palabras).',
    CAUSA: 'Causa: la razón de que pase lo otro; va justo después de «porque».',
    CONSEC: 'Consecuencia: lo que resulta de la causa; va después de «por eso», «así que» o «por lo tanto».',
    EJEM: 'Ejemplificación: la segunda parte da un caso de la primera (por ejemplo).',
    REFOR: 'Reformulación: la segunda parte dice lo mismo con otras palabras (es decir, o sea, en otras palabras).',
    TIEMPO: 'Orden en el tiempo: dice qué pasa primero y qué pasa después (primero, antes, después, finalmente).',
    CIERRE: 'Cierre: la última parte junta en una sola idea lo dicho antes (en resumen, en síntesis, en suma).',
    LOCU: 'Locución conjuntiva: grupo fijo de palabras que funciona como un solo conector.',
    CONCE: 'Concesión: se admite un obstáculo que no impide lo que se afirma (aunque, si bien, a pesar de que, aun cuando).',
    DELANTE: 'El conector de concesión va delante del obstáculo; el de contraste, delante de lo que pasó igual.',
    CAUSA4: 'Causa: lo que sigue al conector es la razón de lo otro (porque, ya que, dado que, puesto que, como).',
    CONSEC4: 'Consecuencia: lo que sigue resulta de lo otro (por eso, así que, por lo tanto, de modo que, de manera que).',
    VARIOS: 'Varios espacios: cada espacio pide su propia relación; una alternativa sirve si cada conector suyo va con la de su espacio.',
  };

  // ---------------- El banco ----------------
  // Cada ítem: { id, o (el texto, con «¿…?» en cada espacio; con varios, «¿…? (1)», «¿…? (2)»…), pide (la relación de cada
  // espacio, separadas por un espacio), ok (la alternativa que cumple), malas (las incorrectas) }. Una alternativa de
  // varios espacios lleva sus conectores separados por « – ». El generador no confía en `ok`: lo comprueba con MARCA.
  const RELACION = [
    { id: 'cuadernos', o: 'La tienda bajó a la mitad el precio de los cuadernos, ¿…? se vendieron todos en una mañana.', pide: 'consecuencia', ok: 'por eso',
      malas: ['sin embargo', 'porque', 'además', 'es decir'] },
    { id: 'carretera', o: 'El río subió mucho con las lluvias, ¿…? el agua tapó la carretera.', pide: 'consecuencia', ok: 'así que',
      malas: ['en cambio', 'porque', 'también', 'o sea'] },
    { id: 'admision', o: 'El examen de admisión es en marzo, ¿…? Lucía estudia todos los días desde enero.', pide: 'consecuencia', ok: 'por lo tanto',
      malas: ['sin embargo', 'porque', 'también', 'en otras palabras'] },
    { id: 'danza', o: 'Ensayamos la danza todo el mes, ¿…? en el concurso nos equivocamos de paso.', pide: 'contraste', ok: 'aun así',
      malas: ['por lo tanto', 'además', 'o sea'] },
    { id: 'piscina', o: 'El hotel tenía una piscina muy grande, ¿…? nadie se bañó en ella en todo el viaje.', pide: 'contraste', ok: 'sin embargo',
      malas: ['por consiguiente', 'también', 'es decir'] },
    { id: 'bus', o: 'El bus nuevo tiene asientos cómodos, ¿…? lleva wifi para los pasajeros.', pide: 'adición', ok: 'además',
      malas: ['por eso', 'sin embargo', 'o sea'] },
  ];
  const CAUSA = [
    { id: 'mercado', o: 'Cerraron el mercado temprano, ¿…? se fue la luz en todo el barrio.', pide: 'causa', ok: 'porque',
      malas: ['por eso', 'pero', 'además', 'es decir'] },
    { id: 'muela', o: 'Mi hermano no fue al colegio, ¿…? tenía dolor de muela.', pide: 'causa', ok: 'porque',
      malas: ['así que', 'sin embargo', 'también', 'o sea'] },
    { id: 'campeonato', o: 'Ganamos el campeonato del distrito, ¿…? jugaremos la final regional.', pide: 'consecuencia', ok: 'así que',
      malas: ['pero', 'porque', 'también', 'es decir'] },
    { id: 'tuberia', o: 'Se rompió la tubería del baño, ¿…? el piso quedó lleno de agua.', pide: 'consecuencia', ok: 'por eso',
      malas: ['porque', 'sin embargo', 'también', 'es decir'] },
    { id: 'trafico', o: 'Las clases empezaron tarde, ¿…? el profesor se quedó atrapado en el tráfico.', pide: 'causa', ok: 'porque',
      malas: ['por eso', 'pero', 'además', 'o sea'] },
    { id: 'bicicleta', o: 'El precio del pasaje se duplicó, ¿…? muchos vecinos ahora van en bicicleta.', pide: 'consecuencia', ok: 'por lo tanto',
      malas: ['porque', 'sin embargo', 'también', 'en otras palabras'] },
  ];
  const CLASES = [
    { id: 'frutas', o: 'Hay frutas que crecen en la selva, ¿…? el camu camu y el aguaje.', pide: 'ejemplo', ok: 'por ejemplo',
      malas: ['en otras palabras', 'aun así', 'así que', 'además'] },
    { id: 'condor', o: 'El cóndor es un ave carroñera, ¿…? se alimenta de animales muertos.', pide: 'reformulación', ok: 'es decir',
      malas: ['por ejemplo', 'sin embargo', 'también'] },
    { id: 'harina', o: 'Primero se pesa la harina, ¿…? se mezcla con los huevos y la leche.', pide: 'orden', ok: 'después',
      malas: ['es decir', 'sin embargo', 'por eso', 'además'] },
    { id: 'barrio', o: 'Tiene parques, una biblioteca y un buen hospital, ¿…? es un barrio con todo lo necesario.', pide: 'cierre', ok: 'en suma',
      malas: ['por ejemplo', 'sin embargo', 'además', 'porque'] },
    { id: 'liebre', o: 'Algunos animales cambian de color con las estaciones, ¿…? la liebre de las montañas frías.', pide: 'ejemplo', ok: 'por ejemplo',
      malas: ['o sea', 'aun así', 'por lo tanto', 'también'] },
    { id: 'virtual', o: 'La reunión será virtual, ¿…? cada uno se conectará desde su casa.', pide: 'reformulación', ok: 'es decir',
      malas: ['por ejemplo', 'sin embargo', 'también'] },
  ];
  const LOCUCIONES = [
    { id: 'barro', o: '¿…? el camino estaba lleno de barro, los vecinos llegaron a la asamblea.', pide: 'concesión', ok: 'Aun cuando',
      malas: ['Dado que', 'De modo que', 'Así como', 'Por ejemplo'] },
    { id: 'chaleco', o: '¿…? no sabía nadar, Luis cruzó el lago en bote sin miedo.', pide: 'concesión', ok: 'Si bien',
      malas: ['Ya que', 'De manera que', 'Así como', 'Es decir'] },
    { id: 'sala', o: 'Usaremos la sala grande, ¿…? vendrán más de cien padres de familia.', pide: 'causa', ok: 'dado que',
      malas: ['si bien', 'de modo que', 'así como', 'es decir'] },
    { id: 'colecta', o: 'Los vecinos hicieron una colecta, ¿…? la familia Quispe perdió su casa en un incendio.', pide: 'causa', ok: 'puesto que',
      malas: ['si bien', 'de manera que', 'así como', 'por ejemplo'] },
    { id: 'omnibus', o: 'El ómnibus se malogró a mitad de camino, ¿…? llegamos a Puno de noche.', pide: 'consecuencia', ok: 'de modo que',
      malas: ['si bien', 'ya que', 'además de que', 'es decir'] },
    { id: 'techo', o: 'Las lluvias dañaron el techo del aula, ¿…? las clases pasaron a la biblioteca.', pide: 'consecuencia', ok: 'de manera que',
      malas: ['a pesar de que', 'puesto que', 'así como', 'o sea'] },
  ];
  // Con varios espacios, las incorrectas no cambian un espacio por vez alrededor de la correcta: si no, la correcta sería
  // la que más se repite en cada lugar y se podría elegir sin leer (probarFugas, «central»). Cada ítem lleva una que
  // falla solo en el último espacio (RVC4), una que falla solo en el primero y dos que fallan en los dos. Cierre (20 nov):
  // la RVC4 lleva en el primer espacio otro conector de la misma relación, para que la correcta no comparta con ella
  // («así que – además» y no «por eso – además»); antes, la correcta empataba como central con la RVC4.
  const ESPACIOS = [
    { id: 'kermes', o: 'El colegio organizó una kermés, ¿…? (1) juntó dinero para arreglar el techo. ¿…? (2) todavía falta comprar las calaminas.', pide: 'consecuencia contraste',
      ok: 'por eso – sin embargo', malas: ['así que – además', 'en cambio – sin embargo', 'porque – sin embargo', 'o sea – además'] },
    { id: 'libros', o: 'La biblioteca tiene pocos libros de ciencia, ¿…? (1) los alumnos buscan en internet. ¿…? (2) la biblioteca abre solo dos horas al día.', pide: 'consecuencia adición',
      ok: 'por eso – además', malas: ['así que – en cambio', 'pero – además', 'porque – además', 'es decir – en cambio'] },
    { id: 'abuelo', o: 'Mi abuelo no sabe leer, ¿…? (1) de niño tuvo que trabajar en la chacra. ¿…? (2) cuenta muy bien las historias del pueblo.', pide: 'causa contraste',
      ok: 'porque – sin embargo', malas: ['ya que – por eso', 'por lo tanto – sin embargo', 'es decir – sin embargo', 'además – por eso'] },
    { id: 'posta', o: 'La posta abre a las ocho, ¿…? (1) los pacientes llegan desde las seis. ¿…? (2) a las ocho ya hay una cola larga.', pide: 'contraste consecuencia',
      ok: 'sin embargo – por eso', malas: ['pero – además', 'así que – por eso', 'además – por eso', 'en otras palabras – además'] },
    { id: 'parque', o: 'El parque tiene muchos árboles nativos, ¿…? (1) el queñual y el colle. ¿…? (2) es el lugar con más sombra del barrio.', pide: 'ejemplo consecuencia',
      ok: 'por ejemplo – por eso', malas: ['por ejemplo – sin embargo', 'es decir – así que', 'aun así – sin embargo', 'además – sin embargo'] },
    { id: 'largo', o: '¿…? (1) el examen fue largo, terminé a tiempo, ¿…? (2) empecé por las preguntas fáciles.', pide: 'concesión causa',
      ok: 'A pesar de que – porque', malas: ['A pesar de que – así que', 'Dado que – porque', 'De modo que – así que', 'Así como – así que'] },
  ];

  const IDEA_BANCO = { relacion: RELACION, causa: CAUSA, clases: CLASES, locuciones: LOCUCIONES, espacios: ESPACIOS };
  // Datos (cierre, 20 nov): las líneas fijas del tipo y la de cada relación que marca alguna alternativa mostrada. Antes el
  // recuadro traía una lista fija por idea, y la de varios espacios sumaba la relación que pedía el ítem (la de ejemplo, la
  // de orden o la de concesión): mirando solo los Datos se descartaban alternativas, y en varios espacios se veía qué pedía.
  const LINEA = { adición: D.ADI, contraste: D.CONT, consecuencia: D.CONSEC4, causa: D.CAUSA4, concesión: D.CONCE, ejemplo: D.EJEM,
    reformulación: D.REFOR, orden: D.TIEMPO, cierre: D.CIERRE };
  const VARIANTE = { relacion: { consecuencia: D.RES, ejemplo: D.CASO, reformulación: D.OTRAS }, causa: { causa: D.CAUSA, consecuencia: D.CONSEC, ejemplo: D.CASO, reformulación: D.OTRAS } };
  const FIJAS = { relacion: [D.ESPERA], causa: [], clases: [], locuciones: [], espacios: [D.VARIOS] };
  const ORDEN_REL = ['adición', 'contraste', 'consecuencia', 'causa', 'concesión', 'ejemplo', 'reformulación', 'orden', 'cierre'];
  function datosDe(base, textos) {
    const rs = new Set(textos.flatMap(t => t.split(' – ').map(marca)));
    const linea = r => (VARIANTE[base] && VARIANTE[base][r]) || LINEA[r];
    return FIJAS[base].concat(ORDEN_REL.filter(r => rs.has(r)).map(linea), base === 'locuciones' && rs.has('concesión') ? [D.DELANTE] : []);
  }
  const sinPunto = t => t.replace(/[.]$/, '');

  // Evalúa una alternativa contra lo que pide cada espacio: el primer espacio en que falla (o −1) y la relación ahí.
  function evaluar(alt, pide) {
    const cs = alt.split(' – ');
    if (cs.length !== pide.length) throw new Error(`${ID}: «${alt}» no tiene un conector por espacio`);
    const fallas = cs.map((c, k) => (marca(c) === pide[k] ? -1 : k)).filter(k => k >= 0);
    return { cs, fallas };
  }
  function tItem(rng, base, examen) {
    const banco = IDEA_BANCO[base].filter(it => !examen || it.malas.length >= 4);
    const it = rng.elegir(banco), pide = it.pide.split(' ');
    const todas = [it.ok].concat(it.malas).map(t => Object.assign({ t }, evaluar(t, pide)));
    const buenas = todas.filter(a => !a.fallas.length);
    if (buenas.length !== 1 || buenas[0].t !== it.ok) throw new Error(`${ID}: en «${it.id}» cumplen ${buenas.map(b => b.t)}`);
    const malas = todas.filter(a => a.fallas.length).map(a => {
      const f = a.fallas[0], rel = marca(a.cs[f]);
      if (pide.length > 1) {
        const soloUltimo = a.fallas.length === 1 && f === pide.length - 1;
        const cod = soloUltimo ? 'RVC4' : codigo(pide[f], rel);
        const bien = pide.map((p, k) => k).filter(k => !a.fallas.includes(k)).map(k => k + 1);
        const ex = `${bien.length ? `Acierta en el espacio ${bien.join(' y ')}, bien; pero` : 'Une las ideas, bien; pero'} en el ${f + 1}, «${a.cs[f]}» marca ${NOMBRE[rel]}, y ahí va ${NOMBRE[pide[f]]}.`;
        return { t: a.t, cod, ex };
      }
      return { t: a.t, cod: codigo(pide[0], rel), ex: explicar(pide[0], rel, a.t) };
    });
    const cods = malas.map(m => m.cod);
    if (cods.some(c => !c) || new Set(cods).size !== cods.length) throw new Error(`${ID}: en «${it.id}» los códigos no son distintos (${cods})`);
    const errores = elegir(rng, malas, examen ? 4 : 3, it.ok).map(m => Object.assign({ clave: `alt:${m.t}`, texto: m.t }, err(m.cod, m.ex)));
    const varios = pide.length > 1;
    return {
      enunciado: [examen ? 'Pregunta del simulacro.' : 'Conectores.'],
      pregunta: [varios ? `¿Qué alternativa completa los espacios de «${sinPunto(it.o)}»?` : `En «${sinPunto(it.o)}», ¿qué conector va en el espacio?`],
      datos: datosDe(base, [it.ok].concat(errores.map(e => e.texto))), correcta: it.ok, errores,
      solucion: [[varios ? `Cada espacio pide lo suyo: ${pide.map(p => NOMBRE[p]).join(', ')}; «${it.ok}» cumple en todos.` : `El espacio pide ${NOMBRE[pide[0]]}: «${it.ok}» la marca.`],
        [varios ? 'Las otras fallan al menos en un espacio, y se descartan enteras.' : 'Las otras marcan otra relación o la ponen al revés.']],
      _datos: { item: it.id },
    };
  }

  // ---------------- Tipos por idea ----------------
  const CONSTRUIR = {};
  for (const b of Object.keys(IDEA_BANCO)) { CONSTRUIR[b] = rng => tItem(rng, b, false); CONSTRUIR[`${b}-examen`] = rng => tItem(rng, b, true); }
  const TIPOS_POR_IDEA = {
    'relacion-primero': ['relacion', 'relacion-examen'],
    'causa-consecuencia': ['causa', 'causa-examen'],
    'clases': ['clases', 'clases-examen'],
    'locuciones': ['locuciones', 'locuciones-examen'],
    'varios-espacios': ['espacios', 'espacios-examen'],
  };
  const IDEAS = Object.keys(TIPOS_POR_IDEA);
  const IDEA_DE = Object.fromEntries(IDEAS.flatMap(i => TIPOS_POR_IDEA[i].map(t => [t, i])));
  const NIVEL = Object.fromEntries(Object.keys(CONSTRUIR).map(t => [t, /examen/.test(t) ? 3 : 2]));
  // Papel (regla 6; herramientas/papel-generador.js toma «papel-1» a «papel-8»): las cinco ideas, de menos a más.
  const PAPEL = { 'papel-1': 'relacion', 'papel-2': 'causa', 'papel-3': 'clases', 'papel-4': 'locuciones', 'papel-5': 'espacios',
    'papel-6': 'causa-examen', 'papel-7': 'locuciones-examen', 'papel-8': 'espacios-examen' };

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

  return { id: ID, titulo: 'Conectores', generar, TIPOS_POR_IDEA, NIVEL, TIPOS: Object.keys(CONSTRUIR), RELACION, CAUSA, CLASES, LOCUCIONES, ESPACIOS, MARCA };
});
