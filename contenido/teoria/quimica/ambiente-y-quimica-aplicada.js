/*
 * Teoría de «Ambiente y química aplicada» (quimica.ambiente-y-quimica-aplicada). Molde: docs/teoria.md y
 * contenido/teoria/quimica/materia-y-energia.js. Compañera: Bruna (castora), voz resolutiva y cálida.
 * Fuente del contenido: docs/teoria/matriz/quimica.json (unidad 20), historia-ecuaciones-2.pdf y las precisiones de
 * Química del expediente: ozono ≠ efecto invernadero; filtrar ≠ desinfectar; eutrofización es una cadena que termina
 * en falta de oxígeno; «toda unión libera agua» es falso (la polimerización por adición no suelta nada); la nanoescala
 * cambia propiedades por la superficie, sin garantizar seguridad. Sin cifras ambientales peruanas (piden fuente y año).
 * Errores: docs/investigacion/quimica-ambiente-ideas-erroneas.md (QA) y quimica-materia-nomenclatura-organica (AM);
 * los QM- son hipótesis nuevas.
 *
 * Ficha de tarea (diseno-y-animacion)
 *   Promesa: describir un problema ambiental como una cadena (fuente → especie → proceso → efecto) y no mezclar cadenas.
 *   Persona y condiciones: postulante de 4.º, celular de 360 px, sin audio, a veces sin conexión.
 *   Resultado observable: asigna un contaminante a su problema, dice qué etapa de potabilización quita qué, ordena la
 *     cadena de la eutrofización, calcula cuánto material vuelve del reciclaje, la masa de un polímero y el área de un sólido partido.
 *   Orden de atención: 1.º la cadena o la figura · 2.º la lectura en vivo · acción: probar casos · fondo: Bruna.
 *   Estados: juego sin tocar · casos probados · predicción abierta · revelado · paso a paso · caso nuevo · acierto · «No sé».
 *   Duda que resuelve: ¿el agujero de ozono calienta?, ¿agua clara es agua segura?, ¿toda unión suelta agua?
 *
 * Colores (regla 4): en las cadenas, cada columna lleva su color de problema (sin variables). Masa m turquesa c-i;
 * área A naranja c-o; recolección naranja y recuperación verde en la barra (tramos). El número de cortes k va en tinta.
 * Fuentes (no van al alumno): EPA, What is Acid Rain? y Nutrient Pollution; NASA, Is the ozone hole causing climate
 * change?; OMS, Guidelines for Drinking-water Quality §7; OpenStax Chemistry 2e §17.6; OpenStax Organic Chemistry §31.1; NNCO.
 */
(function (root, fabrica) {
  const def = fabrica(typeof module === 'object' && module.exports ? require('../../../nucleo/kit/kit.js') : root.Kit);
  if (typeof module === 'object' && module.exports) module.exports = def;
  else root.Teoria.unidad(def);
})(typeof self !== 'undefined' ? self : this, function (Kit) {
  'use strict';
  const f = (n, d = 2) => Kit.formatear(n, d);
  const m = { v: 'c-i', t: 'm' }, A = { v: 'c-o', t: 'A' };
  function azar(s) {
    let q = (s * 2654435761 + 12345) >>> 0;
    const x = () => { q = (q + 0x6D2B79F5) >>> 0; let z = q; z = Math.imul(z ^ (z >>> 15), z | 1); z ^= z + Math.imul(z ^ (z >>> 7), z | 61); return ((z ^ (z >>> 14)) >>> 0) / 4294967296; };
    x.ent = (lo, hi) => lo + Math.floor(x() * (hi - lo + 1));
    x.de = l => l[Math.floor(x() * l.length)];
    return x;
  }
  function opciones(correcta, distractores, fmt) {
    const vistos = new Set([fmt(correcta)]);
    const ops = [{ id: 'c', texto: fmt(correcta), correcta: true }];
    for (const d of distractores) {
      const txt = fmt(d.valor);
      if (vistos.has(txt) || !Number.isFinite(d.valor)) continue;
      vistos.add(txt);
      ops.push({ id: d.id, texto: txt, error: d.error, siFuera: d.siFuera });
    }
    return ops.slice(0, 4);
  }
  const SUP = { '-': '⁻', 0: '⁰', 1: '¹', 2: '²', 3: '³', 4: '⁴', 5: '⁵', 6: '⁶', 7: '⁷', 8: '⁸', 9: '⁹' };
  function cien(x, d = 1) {
    if (x === 0) return '0';
    let e = Math.floor(Math.log10(Math.abs(x))), mant = x / 10 ** e;
    if (Math.abs(+mant.toFixed(d)) >= 10) { e += 1; mant /= 10; }
    return `${f(mant, d)} × 10${String(e).split('').map(c => SUP[c]).join('')}`;
  }
  // Gesto directo (docs/teoria.md §4b): cada manija usa la geometría que exporta su pieza (quim-cadena, ejes,
  // quim-molecula) o la de barra-porcentaje, que va de x = 10 a x = 310 con su escala en el total.
  const PZ = id => Kit.piezas[id];
  const cercana = (valores, donde, pt, val, id) => {
    let mejor = valores[0], dm = Infinity;
    for (const o of valores) { const q = donde(Object.assign({}, val, { [id]: o })), dd = Math.hypot(q.x - pt.x, q.y - pt.y); if (dd < dm - 1e-9) { dm = dd; mejor = o; } }
    return mejor;
  };
  // barra-porcentaje: el pedazo del tramo i (1, 2, …) cae a su fila, en y = 96 + 24 (i − 1), de 14 px de alto.
  const xBarra = (v, total = 100) => 10 + 300 * v / total;
  const yFila = i => 96 + 24 * (i - 1) + 7;
  const cadena = (cols, alt) => ({ datos: Object.assign({ columnas: cols }, alt ? { alt } : {}), estado: {} });

  // ---------- Idea 1: cada problema del aire es su propia cadena ----------
  // Cambia: el problema · Permanece: el orden fuente → especie → proceso → efecto · Progresa: cuatro cadenas, una a una ·
  // Se reserva: poner ozono e invernadero lado a lado · Debe verse: que no comparten flechas.
  const AIRE = {
    invernadero: { titulo: 'Efecto invernadero', color: 'o', nodos: ['quema de combustibles', 'más CO₂ y CH₄ en el aire', 'absorben el infrarrojo de la Tierra', 'sube la temperatura media'], lee: 'Especie clave: CO₂; efecto: calentamiento.' },
    ozono: { titulo: 'Capa de ozono', color: 'i', nodos: ['CFC liberados', 'la luz UV suelta Cl en la estratosfera', 'cada Cl destruye muchos O₃', 'llega más UV al suelo'], lee: 'Especie clave: Cl de los CFC; efecto: más UV.' },
    lluvia: { titulo: 'Lluvia ácida', color: 'h', nodos: ['SO₂ y NOₓ de fundiciones y motores', 'forman H₂SO₄ y HNO₃ en el aire', 'lluvia con pH menor que 5,6', 'daña suelos, lagos y edificios'], lee: 'Especies clave: SO₂ y NOₓ; efecto: acidez.' },
    smog: { titulo: 'Smog fotoquímico', color: 'd', nodos: ['NOₓ y vapores orgánicos de los autos', 'la luz solar los hace reaccionar', 'forma O₃ junto al suelo', 'irrita ojos y pulmones'], lee: 'Especie clave: O₃ junto al suelo; efecto: irritación.' },
  };
  const col = (k, desde = 0) => ({ titulo: AIRE[k].titulo, color: AIRE[k].color, nodos: AIRE[k].nodos.map(t => ({ texto: t, desde })) });
  // Animación (decisión de Gerson, 15 nov: química se mueve sola): la cadena se arma sola, un eslabón por segundo, y
  // queda completa dos segundos antes de volver a empezar. Lo que aún no llega se ve tenue (la forma de la cadena no
  // salta). El segundo es del dibujo, no del fenómeno: una cadena real tarda días o años.
  const eslabon = (tt, nNodos) => Math.min(nNodos, Math.floor(tt) + 1);
  const colHasta = (k, c) => ({ titulo: AIRE[k].titulo, color: AIRE[k].color, nodos: AIRE[k].nodos.map((t, i) => ({ texto: t, tenue: i >= c })) });
  // Casos de «Así se resuelve» y «Ahora tú»: una sustancia con su fuente y la cadena a la que aporta sobre todo.
  const CASOS_AIRE = [
    ['El SO₂ que sale de una fundición', 'lluvia'], ['El CO₂ de los motores y las cocinas', 'invernadero'],
    ['Los CFC de refrigeradoras antiguas', 'ozono'], ['Los NOₓ de los autos en una tarde soleada', 'smog'],
    ['El metano de un relleno sanitario', 'invernadero'], ['El H₂SO₄ que se forma en las nubes', 'lluvia'],
  ];
  const CADENA_DE = { invernadero: 'del efecto invernadero', ozono: 'de la capa de ozono', lluvia: 'de la lluvia ácida', smog: 'del smog fotoquímico' };
  // El último eslabón de cada cadena, dicho como comprobación (paso «¿Tiene sentido?»).
  const FIN_AIRE = {
    invernadero: 'El efecto final es calentar el planeta: cuadra con un gas que se acumula en el aire y retiene calor.',
    ozono: 'El efecto final es que llega más ultravioleta: cuadra con una sustancia que suelta cloro en la estratosfera.',
    lluvia: 'El efecto final es una lluvia más ácida: cuadra con una sustancia que forma ácidos en el aire.',
    smog: 'El efecto final es ozono junto al suelo que irrita: cuadra con gases de autos que reaccionan con la luz del sol.',
  };
  const aire = {
    id: 'cadenas-del-aire',
    titulo: 'Cada problema, su cadena',
    temas: ['Ecosistemas y contaminantes', 'Efecto invernadero', 'Smog y lluvia ácida', 'Capa de ozono'],
    pieza: 'quim-cadena',
    // Lee (fase 2): contexto cercano y vocabulario (eslabones de una cadena, estratosfera); no compara ozono con invernadero.
    lee: {
      tarjetas: [
        { titulo: 'Lo que no se ve', texto: 'En las mañanas de Juliaca se ve el humo de los motores y de las ladrilleras. Lo que no se ve son los gases que ese humo lleva. Cada gas sigue su propio camino en el aire.' },
        { titulo: 'Cuatro preguntas', texto: 'Para entender un contaminante, pregunta en orden: ¿de dónde sale?, ¿qué sustancia actúa?, ¿qué le pasa en el aire? y ¿qué efecto deja? Las cuatro respuestas forman su cadena.',
          ecuacion: ['fuente → especie → transformación → efecto'] },
        { titulo: 'Arriba de las nubes', texto: 'Entre unos 10 y 50 km de altura está la estratosfera, más arriba de donde se forman casi todas las nubes. Ahí está la mayor parte del ozono, O₃, de la atmósfera.' },
        { titulo: 'Qué mirar al jugar', texto: 'En el juego, cada cadena se arma sola, eslabón por eslabón. Cambia de problema y lee qué sustancia actúa en el segundo eslabón y qué efecto deja el último.' },
      ],
    },
    juega: {
      consigna: 'La cadena se arma sola, un eslabón por segundo: de dónde sale, qué sustancia actúa, qué le pasa y qué efecto deja. Cambia de problema.',
      voz: 'Un contaminante se entiende por su cadena completa.',
      controles: [
        { id: 'k', etiqueta: 'Problema', opciones: Object.keys(AIRE).map(k => ({ valor: k, texto: AIRE[k].titulo })) },
        { id: 't', etiqueta: 't', color: 'c-h', min: 0, max: 5, paso: 1, inicio: 0, unidad: 's', decimales: 0, auto: { velocidad: 1 } },
      ],
      dibujo: val => cadena([colHasta(val.k, eslabon(val.t, 4))]),
      lectura: val => { const c = eslabon(val.t, 4); return [c < 4 ? `Eslabón ${c} de 4: ${AIRE[val.k].nodos[c - 1]}.` : AIRE[val.k].lee]; },
      // Sin arrastre: cada problema es otra cadena, con otras sustancias; no hay una variable que se deslice de una a
      // otra (y juntarlas con un gesto sugeriría que comparten eslabones, la idea errónea QA1).
      minimo: 3,
    },
    predice: {
      pregunta: '¿El agujero de la capa de ozono es la causa principal del calentamiento global?',
      voz: 'Compara las dos cadenas eslabón por eslabón.',
      opciones: [
        { id: 'c', texto: 'No: son cadenas distintas, con sustancias y radiación distintas', correcta: true },
        { id: 'entra', texto: 'Sí: por el agujero entra más calor del Sol', error: 'QA2', siFuera: 'Por el agujero entra más ultravioleta, no más calor. El calentamiento viene del infrarrojo atrapado.' },
        { id: 'mismo', texto: 'Sí: son el mismo problema de contaminación', error: 'QA1', siFuera: 'Algunos gases, como los CFC, participan en ambos. Pero el mecanismo de cada uno es otro.' },
      ],
      dibujo: cadena([col('ozono'), { titulo: 'Efecto invernadero', color: 'o', nodos: [] }]),
      revelar: cadena([col('ozono'), col('invernadero')]),
      coincide: 'Coincide: ultravioleta en una cadena, infrarrojo en la otra.',
      noCoincide: 'El ozono filtra ultravioleta; el calentamiento es infrarrojo atrapado por CO₂.',
    },
    mira: {
      datos: { columnas: [{ titulo: 'Cloro en la estratosfera', color: 'i', nodos: [
        { texto: 'Cl + O₃ → ClO + O₂', desde: 1 }, { texto: 'ClO + O → Cl + O₂', desde: 2 }, { texto: 'el Cl vuelve y ataca otro O₃', desde: 3 }, { texto: 'neto: O₃ + O → 2 O₂', desde: 4 }] }] },
      voz: 'Sigamos a un solo átomo de cloro.',
      pasos: [
        { estado: { corte: 1 }, texto: 'El cloro rompe una molécula de ozono.', ecuacion: ['Cl + O₃ → ClO + O₂'] },
        { estado: { corte: 2 }, texto: 'El ClO reacciona con un O suelto y devuelve el cloro.', ecuacion: ['ClO + O → Cl + O₂'] },
        { estado: { corte: 3 }, texto: 'El cloro no se gasta: es un catalizador y repite el ciclo.' },
        { estado: { corte: 4 }, texto: 'Sumando, el ozono se pierde y el cloro sigue igual.', ecuacion: ['O₃ + O → 2 O₂'] },
      ],
    },
    regla: {
      texto: 'Un contaminante se describe por su fuente, la especie, su transformación y su efecto. El efecto invernadero y la pérdida de ozono son cadenas distintas.',
      ecuacion: ['fuente → especie → transformación → efecto'],
      condicion: 'una sustancia puede estar en más de una cadena (los CFC también absorben infrarrojo), pero cada mecanismo es otro.',
      voz: 'Antes de culpar a un gas, arma su cadena.',
    },
    // Así se resuelve (fase 2): el mismo tipo de «Ahora tú» (ubicar una sustancia en su cadena), con CASOS_AIRE y AIRE.
    resuelve: {
      generar(s) {
        const r = azar(s + 900), [caso, k] = CASOS_AIRE[r.ent(0, CASOS_AIRE.length - 1)], N = AIRE[k].nodos;
        return {
          enunciado: `${caso}. ¿A qué cadena aporta sobre todo?`,
          pasos: [
            { tipo: 'pide', texto: 'Piden en qué problema del aire actúa esa sustancia: efecto invernadero, capa de ozono, lluvia ácida o smog.' },
            { tipo: 'datos', texto: `Tengo la sustancia y de dónde viene: «${caso}».` },
            { tipo: 'regla', texto: 'Cada problema del aire es una cadena con sus propias sustancias. Se busca la cadena donde esa sustancia es un eslabón.' },
            { tipo: 'aplica', texto: `La sustancia encaja en la cadena ${CADENA_DE[k]}, que empieza así:`, ecuacion: [`${N[0]} → ${N[1]}`] },
            { tipo: 'sentido', texto: FIN_AIRE[k] },
          ],
          respuesta: `Aporta sobre todo a la cadena ${CADENA_DE[k]}.`,
        };
      },
    },
    ahoraTu: {
      voz: 'Ubica la sustancia en su cadena.',
      generar(s) {
        const C = CASOS_AIRE;
        const [caso, k] = C[s % C.length];
        const si = { invernadero: 'Sería invernadero si la sustancia atrapara el infrarrojo que emite la Tierra.', ozono: 'Sería ozono si liberara cloro o bromo en la estratosfera.', lluvia: 'Sería lluvia ácida si formara ácidos que bajan el pH de la lluvia.', smog: 'Sería smog si con luz solar formara ozono junto al suelo.' };
        return {
          pregunta: `${caso}. ¿A qué cadena aporta sobre todo?`,
          opciones: Object.keys(AIRE).map(j => (j === k ? { id: 'c', texto: AIRE[j].titulo, correcta: true } : { id: j, texto: AIRE[j].titulo, error: j === 'ozono' || k === 'ozono' ? 'QA1' : 'AM2', siFuera: si[j] })),
          solucion: { texto: `${AIRE[k].nodos[0]} → ${AIRE[k].nodos[3]}.`.slice(0, 120) },
        };
      },
    },
  };

  // ---------- Idea 2: agua clara no es agua segura ----------
  // Cambia: hasta qué etapa llega el tratamiento · Permanece: el orden de las barreras · Progresa: el agua se aclara ·
  // Se reserva: la desinfección, que no se ve · Debe verse: qué quita cada etapa.
  const ETAPAS = [
    { texto: 'agua de río: turbia y con microbios', quita: 'nada' },
    { texto: 'coagular y flocular: las partículas se juntan', quita: 'nada aún' },
    { texto: 'sedimentar y filtrar: agua clara', quita: 'partículas; quedan microbios' },
    { texto: 'desinfectar con cloro: microbios inactivados', quita: 'microbios' },
  ];
  // Animación: el agua avanza sola por la planta y vuelve (barrido de la etapa, unos 2 s por etapa). La etapa hecha es
  // la más cercana al frente del agua; la manija sigue al frente sin saltos.
  const etapaDe = e => Math.min(3, Math.max(1, Math.round(e)));
  const potab = (hasta, desde = false) => cadena([{ titulo: 'Potabilización', color: 'i', nodos: ETAPAS.map((e, i) => ({ texto: e.texto, desde: desde ? i : 0, tenue: !desde && i > hasta })) }]);
  // Casos de «Así se resuelve» y «Ahora tú»: qué se quiere quitar y qué etapa lo quita.
  const CASOS_AGUA = [['la arena que trae el río', 'filtro'], ['las bacterias del agua', 'cloro'], ['el plomo disuelto', 'otro'], ['los flóculos formados al coagular', 'filtro'], ['los virus del agua', 'cloro'], ['la sal disuelta del agua de mar', 'otro']];
  const ETAPA_AGUA = { filtro: 'Sedimentar y filtrar', cloro: 'Desinfectar', otro: 'Ninguna de estas dos: está disuelto' };
  const CLASE_AGUA = { filtro: 'una partícula suelta, que no está disuelta', cloro: 'un microbio', otro: 'algo disuelto: está repartido entre las moléculas de agua' };
  const APLICA_AGUA = {
    filtro: 'Es una partícula: la retienen la sedimentación y el filtro.',
    cloro: 'Es un microbio: lo inactiva la desinfección con cloro.',
    otro: 'Está disuelto: no lo retiene el filtro ni lo quita el cloro. Ninguna de esas dos etapas sirve.',
  };
  const SENTIDO_AGUA = {
    filtro: 'Cuadra: la arena del filtro retiene granos y grumos, y por eso el agua sale clara.',
    cloro: 'Cuadra: muchos microbios atraviesan el filtro; el cloro reacciona con ellos y los inactiva.',
    otro: 'Cuadra: lo disuelto atraviesa el filtro junto con el agua y el cloro no lo saca; hace falta otro tratamiento.',
  };
  const agua = {
    id: 'filtrar-no-desinfecta',
    titulo: 'Agua clara no es segura',
    temas: ['Contaminación y potabilización del agua'],
    pieza: 'quim-cadena',
    // Lee (fase 2): de dónde viene el agua y las primeras etapas (coagular, sedimentar, filtrar); no dice qué deja pasar el filtro.
    lee: {
      tarjetas: [
        { titulo: 'Del río al caño', texto: 'En Juliaca y en Puno, el agua de la red sale de ríos o del lago Titicaca. Antes de llegar al caño, pasa por una planta de tratamiento que la limpia en varias etapas.' },
        { titulo: 'Coagular', texto: 'El agua del río trae arcilla tan fina que no se asienta sola. Se agrega un coagulante, como el sulfato de aluminio, y las partículas se juntan en grumos más grandes: los flóculos.' },
        { titulo: 'Sedimentar y filtrar', texto: 'Los flóculos pesan y se van al fondo de los tanques: eso es sedimentar. Después, el agua atraviesa capas de arena y grava que atrapan lo que quedó flotando.' },
        { titulo: 'Qué mirar al jugar', texto: 'En el juego, las etapas se encienden una por una. En cada etapa, lee qué se quitó y anota qué sigue en el agua.' },
      ],
    },
    juega: {
      consigna: 'Las etapas de la planta se encienden solas, una por una. Mira qué quita cada etapa y qué sigue en el agua.',
      voz: 'Anota qué queda en el agua después de cada etapa.',
      controles: [{ id: 'e', etiqueta: 'Hasta la etapa', min: 1, max: 3, paso: 1, inicio: 1, decimales: 0, auto: { velocidad: 0.5, modo: 'rebota' } }],
      dibujo: val => potab(etapaDe(val.e) - 1),
      lectura: val => [`Etapa ${etapaDe(val.e)} · se quitan: ${ETAPAS[etapaDe(val.e) - 1].quita}.`],
      minimo: 3,
      // Se agarra la marca del borde de la última etapa hecha y se baja por la planta: cae en la etapa más cercana.
      // Responde la lectura con lo que ya se quitó. La desinfección (etapa 4) queda fuera: es la predicción.
      arrastres: [{ id: 'etapa', etiqueta: 'hasta dónde llegó el agua: bájala por la planta', color: 'c-i',
        donde: val => { const g = PZ('quim-cadena').geometria(potab(val.e - 1).datos); return { x: g.x(0) + g.ancho, y: g.y(val.e - 1) + g.altoNodo / 2 }; },
        mover: pt => { const g = PZ('quim-cadena').geometria(potab(0).datos); return { e: 1 + Math.round((pt.y - g.altoNodo / 2 - g.y(0)) / (g.y(1) - g.y(0))) }; } }],
    },
    predice: {
      pregunta: 'Después de filtrar, el agua del río sale transparente. ¿Ya se puede tomar?',
      voz: 'Piensa en lo que el filtro no ve.',
      opciones: [
        { id: 'c', texto: 'No: falta desinfectar; el filtro no quita todos los microbios', correcta: true },
        { id: 'clara', texto: 'Sí: si es transparente, está limpia', error: 'QA16', siFuera: 'Transparente sí dice que no hay partículas grandes. Los microbios no se ven.' },
        { id: 'doble', texto: 'Sí, si se filtra dos veces', error: 'QM-FILTRAR-DOBLE', siFuera: 'Filtrar más quita más partículas. Para los microbios hace falta otra barrera.' },
      ],
      dibujo: potab(2),
      revelar: potab(3),
      coincide: 'Coincide: filtrar y desinfectar cumplen funciones distintas.',
      noCoincide: 'Falta la desinfección: el agua clara puede llevar microbios.',
    },
    mira: {
      datos: { columnas: [
        { titulo: 'Filtrar', color: 'i', nodos: [{ texto: 'arena y flóculos', desde: 1 }, { texto: 'quedan atrapados', desde: 1 }, { texto: 'agua clara', desde: 2 }] },
        { titulo: 'Desinfectar', color: 'o', nodos: [{ texto: 'bacterias y virus', desde: 3 }, { texto: 'el cloro los inactiva', desde: 3 }, { texto: 'agua segura', desde: 4 }] },
      ] },
      voz: 'Dos barreras, dos funciones.',
      pasos: [
        { estado: { corte: 1 }, texto: 'El filtro retiene partículas: arena, arcilla, flóculos.' },
        { estado: { corte: 2 }, texto: 'El agua sale clara, pero muchos microbios pasan.' },
        { estado: { corte: 3 }, texto: 'El cloro reacciona con los microbios y los inactiva.' },
        { estado: { corte: 4 }, texto: 'Solo con las dos barreras el agua es segura para beber.' },
      ],
    },
    regla: {
      texto: 'Potabilizar combina barreras: coagular, sedimentar y filtrar quitan partículas; desinfectar inactiva microbios. Ninguna reemplaza a la otra.',
      ecuacion: [{ llave: ['filtrar'], nota: 'quita partículas' }, ' ≠ ', { llave: ['desinfectar'], nota: 'inactiva microbios' }],
      condicion: 'agua clara no es agua segura; las sales o metales disueltos necesitan otros tratamientos.',
      voz: 'Pregunta qué quita cada etapa.',
    },
    // Así se resuelve (fase 2): el mismo tipo de «Ahora tú» (qué etapa quita qué), con CASOS_AGUA y ETAPA_AGUA.
    resuelve: {
      generar(s) {
        const r = azar(s + 900), [cosa, k] = CASOS_AGUA[r.ent(0, CASOS_AGUA.length - 1)];
        return {
          enunciado: `¿Qué etapa de una planta de agua potable quita ${cosa}?`,
          pasos: [
            { tipo: 'pide', texto: `Piden la etapa de la planta que quita ${cosa}.` },
            { tipo: 'datos', texto: `Lo que hay que quitar es ${CLASE_AGUA[k]}.` },
            { tipo: 'regla', texto: 'Cada etapa quita una clase de cosa: el filtro retiene partículas, el cloro inactiva microbios y lo disuelto necesita otro tratamiento.' },
            { tipo: 'aplica', texto: APLICA_AGUA[k] },
            { tipo: 'sentido', texto: SENTIDO_AGUA[k] },
          ],
          respuesta: `${ETAPA_AGUA[k]}.`,
        };
      },
    },
    ahoraTu: {
      voz: 'Piensa si lo que se quiere quitar es partícula, microbio o algo disuelto.',
      generar(s) {
        const C = CASOS_AGUA;
        const [cosa, k] = C[s % C.length];
        const T = ETAPA_AGUA;
        const si = { filtro: 'Filtrar sirve para partículas que el filtro retiene.', cloro: 'Desinfectar sirve para inactivar microbios.', otro: 'Haría falta otro tratamiento si estuviera disuelto.' };
        return {
          pregunta: `¿Qué etapa de una planta de agua potable quita ${cosa}?`,
          opciones: Object.keys(T).map(j => (j === k ? { id: 'c', texto: T[j], correcta: true } : { id: j, texto: T[j], error: 'QA16', siFuera: si[j] })),
          solucion: { texto: { filtro: 'Es una partícula: la retienen la sedimentación y el filtro.', cloro: 'Es un microbio: lo inactiva la desinfección.', otro: 'Está disuelto: no lo retiene el filtro ni lo quita el cloro.' }[k] },
        };
      },
    },
  };

  // ---------- Idea 3: la eutrofización termina en falta de oxígeno ----------
  // Cambia: la cantidad de nutrientes · Permanece: el lago y el orden de la cadena · Progresa: algas, muerte, bacterias,
  // oxígeno · Se reserva: el oxígeno disuelto, el eslabón que mata a los peces · Debe verse: que el color no es el daño.
  const EUTRO = ['nitratos y fosfatos de fertilizantes y desagües', 'las algas crecen de más', 'las algas mueren y se hunden', 'bacterias las descomponen y gastan O₂', 'falta O₂ disuelto: mueren peces'];
  const SANO = ['pocos nutrientes', 'algas en cantidad normal', 'O₂ disuelto suficiente', 'los peces viven'];
  // Animación: como en el aire, la cadena del lago se arma sola, un eslabón por segundo (cámara rápida: en un lago real
  // pasan semanas), y queda completa dos segundos.
  const lago = (n, c) => ({ titulo: n === 'pocos' ? 'Lago sano' : 'Lago eutrofizado', color: n === 'pocos' ? 'd' : 'h', nodos: (n === 'pocos' ? SANO : EUTRO).map((t, i) => ({ texto: t, tenue: i >= c })) });
  const eutro = {
    id: 'eutrofizacion',
    titulo: 'Más nutrientes, menos oxígeno',
    temas: ['Eutrofización'],
    pieza: 'quim-cadena',
    // Lee (fase 2): el lago verde, nutrientes y la palabra eutrofización; no dice qué eslabón daña a los peces.
    lee: {
      tarjetas: [
        { titulo: 'Un lago que se pone verde', texto: 'En algunas bahías de lagos, como la bahía interior de Puno, el agua se ve verde. Ese verde son algas y plantas diminutas que crecen mucho más de lo normal.' },
        { titulo: 'Alimento para las algas', texto: 'Las algas, como las plantas de una chacra, crecen con nitrógeno y fósforo. Los nitratos y fosfatos llegan al agua desde fertilizantes, detergentes y desagües.' },
        { titulo: 'Una palabra larga', texto: 'Al exceso de nutrientes en un lago, y a todo lo que desencadena, se le llama eutrofización. La palabra viene del griego y quiere decir «bien alimentado».' },
        { titulo: 'Qué mirar al jugar', texto: 'En el juego, compara la cadena con pocos nutrientes y la cadena con muchos. Lee cada eslabón hasta llegar al último.' },
      ],
    },
    juega: {
      consigna: 'Elige cuántos nutrientes llegan a un lago. La cadena avanza sola, en cámara rápida, hasta el último eslabón.',
      voz: 'Busca el eslabón que de verdad afecta a los peces.',
      controles: [
        { id: 'n', etiqueta: 'Nutrientes', opciones: [{ valor: 'pocos', texto: 'Pocos' }, { valor: 'muchos', texto: 'Muchos' }] },
        { id: 't', etiqueta: 't', color: 'c-h', min: 0, max: 6, paso: 1, inicio: 0, unidad: 's', decimales: 0, auto: { velocidad: 1 } },
      ],
      dibujo: val => { const N = (val.n === 'pocos' ? SANO : EUTRO).length; return cadena([lago(val.n, eslabon(val.t, N))]); },
      lectura: val => {
        const L = val.n === 'pocos' ? SANO : EUTRO, c = eslabon(val.t, L.length);
        return [c < L.length ? `Eslabón ${c} de ${L.length}: ${L[c - 1]}.` : val.n === 'pocos' ? 'Hay oxígeno disuelto de sobra.' : 'El oxígeno disuelto se agota.'];
      },
      // Sin arrastre: son dos estados del lago (pocos o muchos nutrientes) con cadenas distintas; la figura no tiene
      // una cantidad dibujada que se pueda deslizar.
      minimo: 2,
    },
    predice: {
      pregunta: 'Un lago se pone verde por el exceso de fosfatos de los detergentes. ¿Qué hace morir a sus peces?',
      voz: 'Ordena los eslabones antes de elegir.',
      opciones: [
        { id: 'c', texto: 'Falta oxígeno: lo gastan bacterias que descomponen algas muertas', correcta: true },
        { id: 'color', texto: 'El color verde, que tapa la luz', error: 'QA15', siFuera: 'El verde es la señal visible. El daño a los peces viene del oxígeno que falta.' },
        { id: 'veneno', texto: 'Los fosfatos, que son venenosos para los peces', error: 'QM-FOSFATO-VENENO', siFuera: 'Los fosfatos alimentan a las algas. El problema llega después, con la falta de oxígeno.' },
        { id: 'algas', texto: 'Las algas vivas, que respiran el oxígeno del día', error: 'QM-ALGAS-O2', siFuera: 'De día las algas producen oxígeno. Lo agotan las bacterias que descomponen las muertas.' },
      ],
      dibujo: cadena([{ titulo: 'Lago eutrofizado', color: 'h', nodos: EUTRO.slice(0, 2).map(t => ({ texto: t })) }]),
      revelar: cadena([{ titulo: 'Lago eutrofizado', color: 'h', nodos: EUTRO.map((t, i) => ({ texto: t, color: i >= 3 ? 'h' : undefined })) }]),
      coincide: 'Coincide: el eslabón decisivo es el oxígeno disuelto.',
      noCoincide: 'La cadena sigue hasta el oxígeno: eso es lo que falta a los peces.',
    },
    mira: {
      datos: { columnas: [{ titulo: 'Lago eutrofizado', color: 'h', nodos: EUTRO.map((t, i) => ({ texto: t, desde: i + 1 })) }] },
      voz: 'Un eslabón por paso.',
      pasos: [
        { estado: { corte: 1 }, texto: 'Llegan nitratos y fosfatos: alimento para las algas.' },
        { estado: { corte: 2 }, texto: 'Las algas crecen mucho y el agua se pone verde.' },
        { estado: { corte: 3 }, texto: 'Al morir, las algas se hunden.' },
        { estado: { corte: 4 }, texto: 'Las bacterias que las descomponen respiran y gastan oxígeno.' },
        { estado: { corte: 5 }, texto: 'Sin oxígeno disuelto, los peces no pueden respirar.' },
      ],
    },
    regla: {
      texto: 'La eutrofización es una cadena: exceso de nutrientes, algas que crecen y mueren, bacterias que las descomponen gastando oxígeno, y un agua sin oxígeno.',
      ecuacion: ['nutrientes → algas → descomposición → falta de O₂'],
      condicion: 'los nutrientes vienen sobre todo de fertilizantes, detergentes y desagües; el daño es el oxígeno que falta, no el color.',
      voz: 'Sigue la cadena hasta el final.',
    },
    // Así se resuelve (fase 2): el mismo tipo de «Ahora tú» (el eslabón vecino en la cadena EUTRO), con otra semilla.
    resuelve: {
      generar(s) {
        const r = azar(s + 900), i = r.ent(0, 3), despues = r() < 0.5;
        const ref = despues ? EUTRO[i] : EUTRO[i + 1], bien = despues ? EUTRO[i + 1] : EUTRO[i];
        return {
          enunciado: `En la cadena de la eutrofización, ¿qué va justo ${despues ? 'después' : 'antes'} de «${ref}»?`,
          pasos: [
            { tipo: 'pide', texto: `Piden el eslabón que va justo ${despues ? 'después' : 'antes'} de «${ref}».` },
            { tipo: 'datos', texto: `«${ref}» es el eslabón ${despues ? i + 1 : i + 2} de los ${EUTRO.length} de la cadena.` },
            { tipo: 'regla', texto: 'La eutrofización es una sola cadena: cada eslabón causa el siguiente. Para hallar el vecino, pregunto qué causa ese eslabón o qué lo causó.' },
            { tipo: 'aplica', texto: despues ? `¿Qué causa «${ref}»? El eslabón siguiente: «${bien}».` : `¿Qué causó «${ref}»? El eslabón anterior: «${bien}».` },
            { tipo: 'sentido', texto: `Leído en orden, primero «${EUTRO[i]}» y luego «${EUTRO[i + 1]}»: la causa va antes que el efecto.` },
          ],
          respuesta: `«${bien}».`,
        };
      },
    },
    ahoraTu: {
      voz: 'Ubica el eslabón en su lugar.',
      generar(s) {
        const i = s % 4, despues = s % 8 < 4;
        const ref = despues ? EUTRO[i] : EUTRO[i + 1], bien = despues ? EUTRO[i + 1] : EUTRO[i];
        const otros = EUTRO.filter(t => t !== ref && t !== bien).slice(0, 2);
        return {
          pregunta: `En la cadena de la eutrofización, ¿qué va justo ${despues ? 'después' : 'antes'} de «${ref}»?`,
          opciones: [{ id: 'c', texto: bien, correcta: true }, ...otros.map((t, k) => ({ id: `o${k}`, texto: t, error: 'QA15', siFuera: 'Ese eslabón sí está en la cadena, pero en otro lugar. Revisa qué causa a qué.' }))],
          solucion: { texto: 'Nutrientes, algas, algas muertas, bacterias que gastan O₂, falta de oxígeno.' },
        };
      },
    },
  };

  // ---------- Idea 4: reciclar se mide con flujos ----------
  // Cambia: la fracción recolectada y la recuperada · Permanece: 100 kg de botellas · Progresa: dos cortes sucesivos ·
  // Se reserva: el segundo porcentaje, que muerde lo recolectado · Debe verse: cuánto vuelve de verdad.
  const barra = (rec, recu, corte = 2) => ({ datos: { total: 100, sufijo: ' kg', decimales: 1, color: 'i', tramos: [{ tipo: 'descuento', pct: 100 - rec, color: 'o' }, { tipo: 'descuento', pct: 100 - recu, color: 'd' }] }, estado: { corte } });
  const MATERIALES = ['latas de aluminio', 'botellas de plástico', 'papel', 'vidrio'];
  const reciclaje = {
    id: 'reciclaje-flujos',
    titulo: 'Reciclar se mide con flujos',
    temas: ['Reciclaje y tecnologías limpias'],
    pieza: 'barra-porcentaje',
    // Lee (fase 2): recolectar y recuperar como dos pasos, y medir en kilos; no dice cómo se combinan los dos porcentajes.
    lee: {
      tarjetas: [
        { titulo: 'Después de la feria', texto: 'Después de una feria en Juliaca quedan bolsas llenas de botellas de plástico. Algunas llegan a un centro de acopio; otras terminan en la calle, en un botadero o en el río.' },
        { titulo: 'Dos pasos distintos', texto: 'Recolectar es juntar las botellas y llevarlas a la planta. Recuperar es lo que la planta logra convertir en material nuevo; lo demás se descarta, como etiquetas, restos y suciedad.' },
        { titulo: 'Seguir los kilos', texto: 'Una etiqueta que dice «reciclable» no dice cuánto se recicla. Para saberlo, se siguen los kilos: cuántos entran a cada paso y cuántos salen de él.' },
        { titulo: 'Qué mirar al jugar', texto: ['En el juego, la barra de arriba son 100 kg. Mira cómo se acorta en cada paso y lee cuántos kilos ', m, ' vuelven al final.'] },
      ],
    },
    juega: {
      consigna: 'De 100 kg de botellas, lo recolectado para reciclaje sube y baja solo. Mira cómo lo recuperado crece y se achica con él.',
      voz: 'Mira sobre qué se aplica el segundo porcentaje.',
      controles: [
        { id: 'a', etiqueta: 'Recolectado', color: 'c-o', min: 30, max: 90, paso: 10, inicio: 50, unidad: '%', decimales: 0, auto: { velocidad: 15, modo: 'rebota' } },
        { id: 'b', etiqueta: 'Recuperado', color: 'c-d', min: 60, max: 90, paso: 10, inicio: 70, unidad: '%', decimales: 0 },
      ],
      // Animación: lo recolectado barre de 30 a 90 %; se dibuja en por cientos enteros (los rótulos no muestran decimales).
      dibujo: val => barra(Math.round(val.a), val.b),
      lectura: val => [`${f(Math.round(val.a), 0)} % llega · `, m, ` que vuelve = ${f(Math.round(val.a) * val.b / 100, 1)} kg`],
      minimo: 3,
      // Se agarra el borde de cada pedazo: el del primero es lo recolectado (sobre 100 kg); el del segundo, lo
      // recuperado (sobre lo recolectado). Responde la barra, que se acorta, y los kilos que vuelven.
      arrastres: [
        { id: 'recolectado', etiqueta: 'borde de lo recolectado', color: 'c-o',
          donde: val => ({ x: xBarra(val.a), y: yFila(1) }),
          mover: pt => ({ a: (pt.x - 10) / 3 }) },
        { id: 'recuperado', etiqueta: 'borde de lo recuperado', color: 'c-d',
          donde: val => ({ x: xBarra(val.a * val.b / 100), y: yFila(2) }),
          mover: (pt, val) => ({ b: 100 * (pt.x - 10) / (3 * val.a) }) },
      ],
    },
    predice: {
      pregunta: 'Una ciudad recolecta el 40 % de sus botellas y la planta recupera el 85 % de lo recolectado. ¿Qué parte del total vuelve como material?',
      voz: 'El segundo porcentaje se aplica a lo que llegó a la planta.',
      opciones: [
        { id: 'c', texto: `${f(40 * 85 / 100, 0)} %`, correcta: true },
        { id: 'ultimo', texto: '85 %', error: 'QM-RECICLAJE-ULTIMO', siFuera: 'El 85 % es lo que logra la planta con lo que recibe. Al total le falta el 60 % no recolectado.' },
        { id: 'promedio', texto: '62,5 %', error: 'QM-PROMEDIO', siFuera: 'Eso promedia. Los porcentajes sucesivos se multiplican.' },
        { id: 'resta', texto: '25 %', error: 'QM-RESTA-PCT', siFuera: 'Eso resta los porcentajes. Se multiplica: 0,40 × 0,85.' },
      ],
      dibujo: barra(40, 85, 0),
      revelar: { datos: barra(40, 85).datos, estado: { corte: 2, final: true } },
      coincide: 'Coincide: 40 kg llegan y de ellos vuelven 34 kg.',
      noCoincide: 'De 100 kg llegan 40 kg; el 85 % de 40 kg son 34 kg.',
    },
    mira: {
      datos: barra(40, 85).datos,
      voz: 'Sigamos los kilos, no los porcentajes.',
      pasos: [
        { estado: { corte: 1 }, texto: 'Se recolecta el 40 %: llegan 40 kg a la planta.', ecuacion: ['100 · 0,40 = 40 kg'] },
        { estado: { corte: 2 }, texto: 'La planta recupera el 85 % de esos 40 kg.', ecuacion: [m, ' = 40 · 0,85 = 34 kg'] },
        { estado: { corte: 2, final: true }, texto: 'Vuelve el 34 % del total: el resto se pierde como residuo.' },
        { estado: { corte: 2, final: true }, texto: 'Una tecnología limpia también reduce lo que entra y lo que sale.' },
      ],
    },
    regla: {
      texto: 'Reciclar se evalúa con flujos de materia: lo que vuelve es el total por la fracción recolectada por la fracción recuperada. No basta una etiqueta.',
      ecuacion: [{ sub: [m, 'vuelve'] }, ' = ', { sub: [m, 'total'] }, ' · ', { llave: [{ sub: ['f', 'rec'] }], nota: 'lo que llega', color: 'c-o' }, ' · ', { llave: [{ sub: ['f', 'recup'] }], nota: 'lo recuperado', color: 'c-d' }],
      condicion: 'las fracciones se aplican una sobre otra; «reciclable» no dice cuánto se recicla de verdad.',
      voz: 'Sigue los kilos de un paso al siguiente.',
    },
    // Así se resuelve (fase 2): el mismo tipo de «Ahora tú» (kilos que vuelven tras dos porcentajes), con las mismas cuentas.
    resuelve: {
      generar(s) {
        const x = azar(s + 900), tot = 50 * x.ent(2, 20), a = 5 * x.ent(5, 18), b = 5 * x.ent(12, 19);
        const llega = tot * a / 100, v = llega * b / 100, mat = MATERIALES[x.ent(0, 3)];
        return {
          enunciado: [`Se desechan ${f(tot, 0)} kg de ${mat}. Se recolecta el ${f(a, 0)} % y la planta recupera el ${f(b, 0)} % de lo recolectado. ¿Cuánto material `, m, ' vuelve?'],
          pasos: [
            { tipo: 'pide', texto: ['Piden la masa ', m, ` de ${mat} que vuelve como material.`] },
            { tipo: 'datos', texto: `Total: ${f(tot, 0)} kg. Recolectado: ${f(a, 0)} % del total. Recuperado: ${f(b, 0)} % de lo recolectado.` },
            { tipo: 'regla', texto: 'El segundo porcentaje se aplica sobre lo que llegó a la planta, no sobre el total. Primero saco lo recolectado; después, la parte que se recupera de eso.' },
            { tipo: 'cuentas', texto: 'Kilos que llegan a la planta y, de ellos, los que se recuperan.',
              ecuacion: [`${f(tot, 0)} · ${f(a / 100)} = ${f(llega, 1)} kg → `, m, ` = ${f(llega, 1)} · ${f(b / 100)} = ${f(v, 1)} kg`] },
            { tipo: 'sentido', texto: ['Cuadra: ', m, ` es menos que lo recolectado (${f(llega, 1)} kg), que es menos que el total. Vuelve el ${f(a * b / 100, 2)} % de lo desechado.`] },
          ],
          respuesta: [m, ` = ${f(v, 1)} kg`],
        };
      },
    },
    ahoraTu: {
      voz: 'Multiplica las fracciones, en orden.',
      generar(s) {
        const x = azar(s), tot = 50 * x.ent(2, 20), a = 5 * x.ent(5, 18), b = 5 * x.ent(12, 19), v = tot * a / 100 * b / 100;
        const mat = MATERIALES[s % 4];
        return {
          pregunta: [`Se desechan ${f(tot, 0)} kg de ${mat}. Se recolecta el ${f(a, 0)} % y la planta recupera el ${f(b, 0)} % de lo recolectado. ¿Cuánto material `, m, ' vuelve?'],
          opciones: opciones(v, [
            { id: 'ultimo', valor: tot * b / 100, error: 'QM-RECICLAJE-ULTIMO', siFuera: 'Eso aplica solo la recuperación. Antes se pierde lo no recolectado.' },
            { id: 'recolectado', valor: tot * a / 100, error: 'QM-RECICLAJE-ULTIMO', siFuera: 'Eso es lo que llega a la planta. No todo se recupera.' },
            { id: 'resta', valor: tot * (a + b - 100) / 100, error: 'QM-RESTA-PCT', siFuera: 'Eso combina los porcentajes sumando y restando. Se multiplican.' },
          ], n => `${f(n, 1)} kg`),
          solucion: { texto: 'Primero lo recolectado; después, la parte que se recupera de eso.', ecuacion: [m, ` = ${f(tot, 0)} · ${f(a / 100)} · ${f(b / 100)} = ${f(v, 1)} kg`] },
        };
      },
    },
  };

  // ---------- Idea 5: no toda unión suelta agua (polímeros) ----------
  // Cambia: cuántos etilenos se unen · Permanece: la cadena de carbonos y su masa · Progresa: la cadena crece de dos en
  // dos carbonos · Se reserva: la condensación, que sí suelta agua · Debe verse: que en la adición no sobra ningún átomo.
  // Animación: n avanza solo de 2 a 4 y vuelve a empezar. La parte entera son los etilenos ya unidos; en la primera
  // mitad de cada tramo llega desde abajo el etileno siguiente, con su doble enlace (CH₂=CH₂), y en la mitad se
  // engancha: el doble enlace se abre y pasa a ser un enlace simple más de la cadena. Nada se suelta.
  const sitio = i => { const fila = Math.floor(i / 4), k = i % 4, col = fila % 2 ? 3 - k : k; return { x: col * 1.5, y: fila * 1.3 }; };
  const unidos = n => Math.min(4, Math.max(2, Math.round(n)));
  const llegando = n => { const r = n - Math.floor(n); return unidos(n) < 4 && r > 1e-6 && r < 0.5; };
  function poli(n, corte = 0) {
    const atomos = [], enlaces = [], nu = unidos(n), llega = n - Math.floor(n);
    // En serpentina, cuatro por fila: la cadena es una sola fila de enlaces aunque se doble en el papel.
    for (let i = 0; i < 2 * nu; i++) {
      const p = sitio(i);
      atomos.push({ id: `c${i}`, t: 'CH₂', x: p.x, y: p.y, color: 'i' });
      if (i) enlaces.push({ a: `c${i - 1}`, b: `c${i}` });
    }
    // El etileno que se acerca: entre la parte entera y la mitad, sube 1,2 unidades hasta su sitio en la cadena.
    if (llegando(n)) {
      const dy = 1.2 * (1 - llega / 0.5);
      [0, 1].forEach(j => { const p = sitio(2 * nu + j); atomos.push({ id: `l${j}`, t: 'CH₂', x: p.x, y: p.y + dy, color: 'h' }); });
      enlaces.push({ a: 'l0', b: 'l1', orden: 2 });
    }
    // Textos invisibles en las esquinas (desde 99): fijan el encuadre, así la cadena no se corre mientras crece.
    return { datos: { escala: 40, alto: 190, atomos, enlaces, textos: [{ x: -0.95, y: 0, t: '–' }, { x: 2.25, y: 3.2, t: `${nu} etilenos: ${2 * nu} grupos CH₂, sin subproducto` },
      { x: -0.95, y: -0.3, t: '', desde: 99 }, { x: 4.5, y: 3.2, t: '', desde: 99 }],
      alt: `Cadena de polietileno formada por ${nu} moléculas de etileno: ${2 * nu} grupos CH₂ unidos en fila; no se libera ninguna molécula.` }, estado: { corte } };
  }
  // La manija va 22 px debajo del último CH₂, con el encuadre de la cadena actual.
  const finPoli = n => { const d = poli(n).datos, g = PZ('quim-molecula').encuadre(d), a = d.atomos.find(x => x.id === `c${2 * unidos(n) - 1}`); return { x: g.X(a.x), y: g.Y(a.y) + 22 }; };
  const MIRA_POLI = {
    escala: 34, alto: 260,
    atomos: [
      { id: 'a1', t: 'CH₂', x: -0.6, y: 0, color: 'i', desde: 1 }, { id: 'a2', t: 'CH₂', x: 0.9, y: 0, color: 'i', desde: 1 }, { id: 'a3', t: 'CH₂', x: 2.4, y: 0, color: 'i', desde: 1 }, { id: 'a4', t: 'CH₂', x: 3.9, y: 0, color: 'i', desde: 1 },
      { id: 'r1', t: 'R–COOH', x: 0, y: 2.4, desde: 3 }, { id: 'r2', t: 'HO–R′', x: 2.6, y: 2.4, desde: 3 },
      { id: 'e1', t: 'R–COO–R′', x: 0.7, y: 4.2, desde: 4 }, { id: 'w', t: 'H₂O', x: 3.3, y: 4.2, color: 'h', desde: 4 },
    ],
    enlaces: [{ a: 'a1', b: 'a2', desde: 1 }, { a: 'a2', b: 'a3', desde: 1 }, { a: 'a3', b: 'a4', desde: 1 }],
    textos: [{ x: 1.8, y: 0.9, t: 'adición: no sale nada', color: 'i', desde: 2 }, { x: 1.3, y: 2.4, t: '+', desde: 3 }, { x: 2.3, y: 4.2, t: '+', desde: 4 }, { x: 1.8, y: 5.1, t: 'condensación: sale agua', color: 'h', desde: 5 }],
    flechas: [{ de: [1.6, 3.0], a: [1.6, 3.6], desde: 4 }],
    alt: 'Arriba, polimerización por adición: grupos CH₂ unidos sin subproducto. Abajo, condensación: un ácido y un alcohol forman un éster y sueltan una molécula de agua.',
  };
  // Monómeros de «Así se resuelve» y «Ahora tú», por su masa molar en g/mol.
  const MONO_ADICION = { 28: 'etileno', 42: 'propileno', 104: 'estireno' }, MONO_CONDENSA = { 75: 'glicina', 89: 'alanina', 181: 'tirosina' };
  const polimeros = {
    id: 'polimeros-adicion',
    titulo: 'No toda unión suelta agua',
    temas: ['Nanotecnología, polímeros y corrosión (solo UNI)'],
    pieza: 'quim-molecula',
    // Lee (fase 2): qué es un polímero y su monómero; no dice si al unirse sale alguna molécula (es la predicción).
    lee: {
      tarjetas: [
        { titulo: 'Plásticos de todos los días', texto: 'La bolsa del mercado, el balde y la botella de gaseosa son polímeros: moléculas enormes hechas de muchas piezas pequeñas repetidas, como los eslabones de una cadena.' },
        { titulo: 'La pieza que se repite', texto: 'Cada pieza pequeña se llama monómero. El de la bolsa es el etileno, que tiene dos carbonos unidos por un doble enlace y dos hidrógenos en cada carbono.',
          ecuacion: ['CH₂=CH₂'] },
        { titulo: 'Qué mirar al jugar', texto: 'En el juego, los etilenos llegan de uno en uno. Cuenta los CH₂ antes y después de cada enganche, y revisa si queda algún átomo suelto.' },
      ],
    },
    juega: {
      consigna: 'Llegan solas moléculas de etileno, CH₂=CH₂: el doble enlace se abre y se engancha a la cadena. Cuenta si sobra algún átomo.',
      voz: 'Cuenta si sobra algún átomo al unir.',
      controles: [{ id: 'n', etiqueta: 'Etilenos', min: 2, max: 4, paso: 1, inicio: 2, decimales: 0, auto: { velocidad: 0.75 } }],
      dibujo: val => poli(val.n),
      lectura: val => [m, ` = ${f(unidos(val.n), 0)} · 28 = ${f(28 * unidos(val.n), 0)} g/mol${llegando(val.n) ? ' · llega otro etileno' : ''}`],
      minimo: 3,
      // Se agarra el último CH₂ y se arrastra por la serpentina: cada etileno que se engancha suma dos CH₂. Responde
      // la masa de la lectura, que sube 28 por etileno sin restar nada.
      arrastres: [{ id: 'extremo', etiqueta: 'último CH₂: engancha otro etileno', color: 'c-i',
        donde: val => finPoli(val.n),
        mover: (pt, val) => ({ n: cercana([2, 3, 4], v => finPoli(v.n), pt, val, 'n') }) }],
    },
    predice: {
      pregunta: 'Al unir muchas moléculas de etileno para formar polietileno, ¿qué molécula pequeña se libera?',
      voz: 'Revisa tu cuenta de átomos antes de elegir.',
      opciones: [
        { id: 'c', texto: 'Ninguna: todos los átomos quedan en la cadena', correcta: true },
        { id: 'agua', texto: 'Agua, como en toda unión de moléculas', error: 'QM-AGUA-UNION', siFuera: 'Algunas uniones sí sueltan agua: las condensaciones. La adición abre dobles enlaces sin soltar nada.' },
        { id: 'h2', texto: 'Hidrógeno, H₂', error: 'QM-POLI-H2', siFuera: 'Si saliera H₂, la cadena tendría menos H que los monómeros. Tiene los mismos.' },
      ],
      dibujo: poli(2),
      revelar: { datos: MIRA_POLI, estado: { corte: 5 } },
      coincide: 'Coincide: en la adición la masa de la cadena es la suma de los monómeros.',
      noCoincide: 'En la adición no sale nada; el agua sale solo en las condensaciones.',
    },
    mira: {
      datos: MIRA_POLI,
      voz: 'Comparemos dos maneras de unir.',
      pasos: [
        { estado: { corte: 1 }, texto: 'Adición: los dobles enlaces se abren y los CH₂ se unen en fila.', ecuacion: ['n CH₂=CH₂ → (–CH₂–CH₂–)ₙ'] },
        { estado: { corte: 2 }, texto: 'No sobra ningún átomo: la cadena pesa lo mismo que los monómeros.' },
        { estado: { corte: 3 }, texto: 'Condensación: un ácido y un alcohol se unen…' },
        { estado: { corte: 4 }, texto: '…y sueltan una molécula de agua por cada unión.', ecuacion: ['R–COOH + HO–R′ → R–COO–R′ + H₂O'] },
        { estado: { corte: 5 }, texto: 'Así se forman el PET y el nailon; el polietileno, no.' },
      ],
    },
    regla: {
      texto: 'En la polimerización por adición los monómeros se unen abriendo dobles enlaces y no se libera nada. En la condensación se libera una molécula pequeña, a menudo agua.',
      ecuacion: [{ llave: ['n CH₂=CH₂'], nota: 'n monómeros', color: 'c-h' }, ' → ', { llave: ['(–CH₂–CH₂–)ₙ'], nota: 'nada sobra', color: 'c-i' }],
      condicion: 'que un polímero sea degradable o reciclable depende de su estructura y de cómo se procesa; no son lo mismo.',
      voz: 'Antes de decir que sale agua, cuenta átomos.',
    },
    // Así se resuelve (fase 2): los dos tipos de «Ahora tú» (masa de la cadena por adición o por condensación), mismas cuentas.
    resuelve: {
      generar(s) {
        const x = azar(s + 900), n = x.ent(3, 12), cond = s % 2 === 1;
        if (!cond) {
          const M = x.de([28, 42, 104]), nom = MONO_ADICION[M], v = n * M;
          return {
            enunciado: [`${f(n, 0)} moléculas de ${nom} (M = ${f(M, 0)} g/mol) se unen por adición en una sola cadena. ¿Qué masa molar `, m, ' tiene la cadena?'],
            pasos: [
              { tipo: 'pide', texto: ['Piden la masa molar ', m, ` de la cadena de ${nom}.`] },
              { tipo: 'datos', texto: `${f(n, 0)} monómeros de ${f(M, 0)} g/mol cada uno, unidos por adición.` },
              { tipo: 'regla', texto: 'En la adición, cada monómero abre su doble enlace y se engancha sin soltar nada: la cadena pesa lo que suman sus piezas.' },
              { tipo: 'cuentas', texto: 'Sumo las masas de todos los monómeros.', ecuacion: [m, ` = ${f(n, 0)} · ${f(M, 0)} = ${f(v, 0)} g/mol`] },
              { tipo: 'sentido', texto: ['De vuelta: ', m, ` ÷ ${f(M, 0)} = ${f(v / M, 0)} monómeros, ni uno más ni uno menos. No falta ningún átomo.`] },
            ],
            respuesta: [m, ` = ${f(v, 0)} g/mol`],
          };
        }
        const M = x.de([75, 89, 181]), nom = MONO_CONDENSA[M], u = n - 1, v = n * M - u * 18;
        return {
          enunciado: [`${f(n, 0)} moléculas de ${nom} (M = ${f(M, 0)} g/mol) se unen por condensación en una cadena; cada unión suelta un H₂O. ¿Qué masa `, m, ' tiene la cadena?'],
          pasos: [
            { tipo: 'pide', texto: ['Piden la masa molar ', m, ` de la cadena de ${nom}.`] },
            { tipo: 'datos', texto: `${f(n, 0)} piezas de ${f(M, 0)} g/mol; cada unión suelta una molécula de agua de 18 g/mol.` },
            { tipo: 'regla', texto: `En la condensación, cada unión entre dos piezas suelta un H₂O. Con ${f(n, 0)} piezas en fila hay ${f(u, 0)} uniones, una menos que piezas.` },
            { tipo: 'cuentas', texto: 'Sumo las piezas y resto el agua que salió en las uniones.', ecuacion: [m, ` = ${f(n, 0)} · ${f(M, 0)} − ${f(u, 0)} · 18 = ${f(n * M, 0)} − ${f(u * 18, 0)} = ${f(v, 0)} g/mol`] },
            { tipo: 'sentido', texto: ['Cuadra: ', m, ` es menor que la suma de las piezas (${f(n * M, 0)} g/mol) justo en la masa de ${f(u, 0)} aguas.`] },
          ],
          respuesta: [m, ` = ${f(v, 0)} g/mol`],
        };
      },
    },
    ahoraTu: {
      voz: 'Decide si la unión suelta agua.',
      generar(s) {
        const x = azar(s), n = x.ent(3, 12), cond = s % 2 === 1;
        if (!cond) {
          const M = x.de([28, 42, 104]), nom = MONO_ADICION[M];
          return {
            pregunta: [`${f(n, 0)} moléculas de ${nom} (M = ${f(M, 0)} g/mol) se unen por adición en una sola cadena. ¿Qué masa molar `, m, ' tiene la cadena?'],
            opciones: opciones(n * M, [
              { id: 'agua', valor: n * M - (n - 1) * 18, error: 'QM-AGUA-UNION', siFuera: 'Eso resta agua en cada unión. En la adición no sale ninguna molécula.' },
              { id: 'uno', valor: M, error: 'QM-POLI-MONOMERO', siFuera: 'Esa es la masa de un solo monómero; la cadena los junta todos.' },
              { id: 'n-mas', valor: (n + 1) * M, error: 'QM-POLI-CONTEO', siFuera: `Eso cuenta ${f(n + 1, 0)} monómeros en vez de ${f(n, 0)}.` },
            ], v => `${f(v, 0)} g/mol`),
            solucion: { texto: 'En la adición no se pierde ningún átomo: se suman las masas.', ecuacion: [m, ` = ${f(n, 0)} · ${f(M, 0)} = ${f(n * M, 0)} g/mol`] },
          };
        }
        const M = x.de([75, 89, 181]), nom = MONO_CONDENSA[M];
        const v = n * M - (n - 1) * 18;
        return {
          pregunta: [`${f(n, 0)} moléculas de ${nom} (M = ${f(M, 0)} g/mol) se unen por condensación en una cadena; cada unión suelta un H₂O. ¿Qué masa `, m, ' tiene la cadena?'],
          opciones: opciones(v, [
            { id: 'suma', valor: n * M, error: 'QM-SIN-AGUA', siFuera: 'Eso sería una adición. Aquí cada unión libera una molécula de agua.' },
            { id: 'n-aguas', valor: n * M - n * 18, error: 'BMH6', siFuera: `Eso resta ${f(n, 0)} aguas. Con ${f(n, 0)} piezas en fila hay ${f(n - 1, 0)} uniones.` },
            { id: 'una', valor: n * M - 18, error: 'QM-UNA-AGUA', siFuera: 'Eso resta una sola agua. Sale una por cada unión.' },
          ], w => `${f(w, 0)} g/mol`),
          solucion: { texto: `Hay ${f(n - 1, 0)} uniones y cada una suelta un agua.`, ecuacion: [m, ` = ${f(n, 0)} · ${f(M, 0)} − ${f(n - 1, 0)} · 18 = ${f(v, 0)} g/mol`] },
        };
      },
    },
  };

  // ---------- Idea 6: la superficie manda (nanoescala y corrosión) ----------
  // Cambia: en cuántas partes se corta cada arista · Permanece: 1 cm³ de material · Progresa: el área crece en
  // proporción a los cortes · Se reserva: el salto a la nanoescala · Debe verse: que el volumen no cambia y el área sí.
  const ejesA = (extra = {}) => Object.assign({
    x: { min: 0, max: 10, paso: 1, nombre: 'k', decimales: 0 },
    y: { min: 0, max: 60, paso: 10, nombre: 'A', unidad: 'cm²', decimales: 0, color: 'o' },
    curvas: [{ puntos: [[1, 6], [10, 60]], color: 'o' }],
    alt: 'Área total de 1 cm³ de material cortado en k partes por arista: A = 6k cm², una recta que crece con k mientras el volumen sigue siendo 1 cm³.',
  }, extra);
  // Animación: k barre de 1 a 10 y vuelve. Los cortes son enteros: k se redondea y el punto salta de corte en corte;
  // la recta se dibuja firme hasta el punto y tenue después.
  const cortes = k => Math.min(10, Math.max(1, Math.round(k)));
  const nanoK = k => ejesA({
    curvas: [{ puntos: [[1, 6], [10, 60]], color: 'o', discontinua: true }, ...(k > 1 ? [{ puntos: [[1, 6], [k, 6 * k]], color: 'o' }] : [])],
    puntos: [{ x: k, y: 6 * k, color: 'o', rotulo: `${f(6 * k, 0)} cm²`, guias: true }],
  });
  const nano = {
    id: 'superficie-nano-corrosion',
    titulo: 'Más pedazos, más superficie',
    temas: ['Nanotecnología, polímeros y corrosión (solo UNI)'],
    pieza: 'ejes',
    // Lee (fase 2): superficie, nanómetro y corrosión como contexto; no dice cómo crece el área con los cortes.
    lee: {
      tarjetas: [
        { titulo: 'Terrón o polvo', texto: 'Un terrón de azúcar tarda en disolverse en el agua; el azúcar en polvo, casi nada. Es la misma sustancia y la misma cantidad. Lo que cambia es cuánta superficie toca el agua.' },
        { titulo: 'Muy, muy pequeño', texto: 'Un nanómetro es la millonésima parte de un milímetro. Un cabello tiene unos 80 000 nm de grosor. La nanoescala va de 1 a 100 nm: ahí casi todo es superficie.',
          ecuacion: ['1 nm = 10⁻⁹ m'] },
        { titulo: 'La calamina que se oxida', texto: 'La calamina de un techo se oxida donde el agua y el aire tocan el metal. La corrosión es una reacción que ocurre en la superficie.' },
        { titulo: 'Qué mirar al jugar', texto: ['En el juego, cada vez que k sube, el cubo se corta en más partes por arista. Mira cuánto sube el área ', A, ' del punto naranja con cada corte.'] },
      ],
    },
    juega: {
      consigna: 'La gráfica da el área de 1 cm³ cortado en k partes por arista. El punto avanza solo: mira qué crece y qué no.',
      voz: 'Fíjate en qué crece y qué se queda igual.',
      controles: [{ id: 'k', etiqueta: 'k', min: 1, max: 10, paso: 1, inicio: 1, decimales: 0, auto: { velocidad: 2, modo: 'rebota' } }],
      dibujo: val => ({ datos: nanoK(cortes(val.k)), estado: {} }),
      lectura: val => { const k = cortes(val.k); return [`${f(k ** 3, 0)} cubitos · volumen 1\u00a0cm³`, '   ·   ', A, ` = ${f(6 * k, 0)} cm²`]; },
      minimo: 3,
      // Se agarra el punto y se desliza por la recta: más a la derecha, más cortes por arista. Responde el área, que
      // sube 6 cm² por corte, mientras el volumen de la lectura no cambia.
      arrastres: [{ id: 'cortes', etiqueta: 'punto sobre la recta: más cortes', color: 'c-o',
        donde: val => { const g = PZ('ejes').geometria(ejesA()); return { x: g.X(cortes(val.k)), y: g.Y(6 * cortes(val.k)) }; },
        mover: pt => { const g = PZ('ejes').geometria(ejesA()); return { k: (pt.x - g.X(0)) / (g.X(1) - g.X(0)) }; } }],
    },
    predice: {
      pieza: 'ejes',
      pregunta: ['Ahora lo partes en cubitos de 1 nm de arista: k = 10⁷. ¿Cuánta área total ', A, ' queda expuesta?'],
      voz: 'La recta sigue igual de recta.',
      opciones: [
        { id: 'c', texto: `${cien(6e7, 0)} cm², unos 6 000 m²`, correcta: true },
        { id: 'igual', texto: '6 cm², la misma: el material es el mismo', error: 'QM-AREA-CONSTANTE', siFuera: 'El volumen sí es el mismo. Cada corte deja caras nuevas expuestas.' },
        { id: 'cubo', texto: `${cien(6e21, 0)} cm²`, error: 'QM-AREA-VOLUMEN', siFuera: 'Eso multiplica por k³, el número de cubitos. Cada uno es más chico: el área crece como k.' },
      ],
      dibujo: { datos: ejesA(), estado: {} },
      revelar: { datos: ejesA({ puntos: [{ x: 10, y: 60, color: 'o', rotulo: 'sigue: A = 6k', guias: true }] }), estado: {} },
      coincide: 'Coincide: 6 cm² por 10⁷, casi una cancha de fútbol de superficie.',
      noCoincide: 'El área crece como k: 6 × 10⁷ cm², unos 6 000 m².',
    },
    mira: {
      datos: ejesA({ puntos: [{ x: 1, y: 6, color: 'o', rotulo: '6 cm²', desde: 1 }, { x: 10, y: 60, color: 'o', rotulo: '60 cm²', guias: true, desde: 2 }] }),
      voz: 'Vamos del área a lo que pasa en ella.',
      pasos: [
        { estado: { corte: 1 }, texto: 'Un cubo de 1 cm tiene 6 caras de 1 cm².', ecuacion: [A, ' = 6 cm²'] },
        { estado: { corte: 2 }, texto: 'Partido en 1 000 cubitos de 1 mm, el área sube a 60 cm².', ecuacion: [A, ' = 6k'] },
        { estado: { corte: 2 }, texto: 'En la nanoescala muchos átomos quedan en la superficie: cambian color y reactividad.' },
        { estado: { corte: 2 }, texto: 'La corrosión del hierro ocurre en la superficie, con agua y oxígeno.', ecuacion: ['2 Fe + O₂ + 2 H₂O → 2 Fe(OH)₂'] },
        { estado: { corte: 2 }, texto: 'Por eso la lana de acero se oxida antes que un clavo.' },
      ],
    },
    regla: {
      texto: 'Al dividir un material su superficie crece con el mismo volumen: en la nanoescala eso cambia propiedades. La corrosión es una redox en la superficie que necesita agua y oxígeno.',
      ecuacion: [A, ' = 6', { llave: ['k'], nota: 'partes por arista' }, '\u00a0cm²', '   ·   ', 'V = 1\u00a0cm³'],
      condicion: 'la nanoescala no garantiza seguridad ni mejor rendimiento; la corrosión depende también del medio, como sal o ácido.',
      voz: 'Pregunta cuánta superficie queda expuesta.',
    },
    // Así se resuelve (fase 2): el mismo tipo de «Ahora tú» (área total de un cubo partido), con las mismas cuentas.
    resuelve: {
      generar(s) {
        const x = azar(s + 900), a = x.ent(1, 4), k = x.ent(2, 9), entero = 6 * a * a, area = entero * k;
        return {
          enunciado: [`Un cubo de ${f(a, 0)} cm de arista se corta en ${f(k, 0)} partes por arista. ¿Cuánta área total `, A, ' tienen los cubitos?'],
          pasos: [
            { tipo: 'pide', texto: ['Piden el área total ', A, ': la suma de las caras de todos los cubitos.'] },
            { tipo: 'datos', texto: `Arista del cubo: ${f(a, 0)} cm. Cortes: ${f(k, 0)} partes por arista, así que salen ${f(k, 0)}³ = ${f(k ** 3, 0)} cubitos.` },
            { tipo: 'regla', texto: 'Cortar no cambia el volumen, pero deja caras nuevas al aire. Cada cubito tiene una arista k veces menor y 6 caras.' },
            { tipo: 'cuentas', texto: 'Cuento los cubitos por el área de cada uno; los k se simplifican.',
              ecuacion: [A, ` = ${f(k ** 3, 0)} · 6 · `, { frac: [`${f(a, 0)}²`, `${f(k, 0)}²`] }, ` = 6 · ${f(a, 0)}² · ${f(k, 0)} = ${f(area, 0)} cm²`] },
            { tipo: 'sentido', texto: `El cubo entero tenía 6 · ${f(a, 0)}² = ${f(entero, 0)} cm². Con ${f(k, 0)} partes por arista el área se multiplica por ${f(k, 0)}, y el volumen sigue en ${f(a ** 3, 0)} cm³.` },
          ],
          respuesta: [A, ` = ${f(area, 0)} cm²`],
        };
      },
    },
    ahoraTu: {
      voz: 'Cada corte agrega caras nuevas.',
      generar(s) {
        const x = azar(s), a = x.ent(1, 4), k = x.ent(2, 9), area = 6 * a * a * k;
        return {
          pregunta: [`Un cubo de ${f(a, 0)} cm de arista se corta en ${f(k, 0)} partes por arista. ¿Cuánta área total `, A, ' tienen los cubitos?'],
          opciones: opciones(area, [
            { id: 'igual', valor: 6 * a * a, error: 'QM-AREA-CONSTANTE', siFuera: 'Esa es el área del cubo entero. Al cortar aparecen caras nuevas.' },
            { id: 'cubo', valor: 6 * a * a * k ** 3, error: 'QM-AREA-VOLUMEN', siFuera: 'Eso suma cubitos del tamaño original. Cada cubito es k veces más chico por lado.' },
            { id: 'cuadrado', valor: 6 * a * a * k * k, error: 'QM-AREA-VOLUMEN', siFuera: 'Eso multiplica por k². El área total crece como k.' },
          ], v => `${f(v, 0)} cm²`),
          solucion: { texto: `Hay ${f(k ** 3, 0)} cubitos de ${f(a / k, 2)} cm de arista; el área crece ${f(k, 0)} veces.`, ecuacion: [A, ` = 6 · ${f(a, 0)}² · ${f(k, 0)} = ${f(area, 0)} cm²`] },
        };
      },
    },
  };


  // ---------- Laboratorio ----------
  // Mesa 1: tres filtros sucesivos sobre 100 kg (recolectar, separar en la planta y recuperar), con rangos amplios y
  // una manija en el borde de cada pedazo. Cada porcentaje muerde lo que dejó el anterior.
  const queda3 = (val, i) => [100, val.a, val.a * val.s / 100, val.a * val.s * val.b / 1e4][i];
  // Animación: los 100 kg pasan por los filtros uno por segundo. En el segundo j (0, 1, 2) el filtro j + 1 va
  // reteniendo su parte: el pedazo crece en por cientos enteros de 0 a su tamaño; desde t = 3 s se ve el final (1 s)
  // y vuelve a empezar. Sin t (o con t ≥ 3), los tres filtros completos. La lectura dice lo que pasa en ese momento.
  const PCT = ['a', 's', 'b'];
  const avance3 = val => (val.t === undefined ? 3 : Math.min(3, Math.max(0, val.t)));
  const barra3 = val => {
    const tt = avance3(val), j = Math.floor(tt), fr = tt - j;
    const col = ['o', 'h', 'd'], tramos = [];
    for (let i = 0; i < 3; i++) {
      const pct = 100 - val[PCT[i]];
      if (i < j) tramos.push({ tipo: 'descuento', pct, color: col[i] });
      else if (i === j) tramos.push({ tipo: 'descuento', pct: Math.round(pct * fr), color: col[i] });
    }
    return { datos: { total: 100, sufijo: ' kg', decimales: 1, color: 'i', tramos }, estado: { corte: tramos.length } };
  };
  const pasan3 = val => { const d = barra3(val).datos; return PZ('barra-porcentaje').valores(d).pop(); };
  // Mesa 2: un cubo de arista a (1 a 4 cm) cortado en k partes por arista (1 a 20): A = 6a²k. La escala del eje sigue
  // a la arista, así la recta se ve entera; el punto gris es el cubo sin cortar.
  const areaCubo = v => 6 * v.a * v.a * v.k;   // área total de los k³ cubitos: la usan el dibujo, la lectura y los retos
  const ejesCubo = (a, extra = {}) => {
    const tope = 6 * a * a * 20;
    return Object.assign({
      x: { min: 0, max: 20, paso: 1, cada: 5, nombre: 'k', decimales: 0 },
      y: { min: 0, max: tope, paso: tope / 6, cada: 2, nombre: 'A', unidad: 'cm²', decimales: 0, color: 'o' },
      curvas: [{ puntos: [[1, 6 * a * a], [20, tope]], color: 'o' }],
      alt: `Área total de un cubo de ${a} cm de arista cortado en k partes por arista: A = 6 · ${a}² · k, una recta; el volumen no cambia.`,
    }, extra);
  };
  const puntoCubo = val => { const g = PZ('ejes').geometria(ejesCubo(val.a)); return { x: g.X(val.k), y: g.Y(6 * val.a * val.a * val.k) }; };

  return {
    unidad: 'quimica.ambiente-y-quimica-aplicada',
    version: '0.2.0',
    estado: 'completa',
    requiere: ['/nucleo/kit/piezas/quim-cadena.js', '/nucleo/kit/piezas/barra-porcentaje.js', '/nucleo/kit/piezas/quim-molecula.js', '/nucleo/kit/piezas/ejes.js'],
    historia: {
      texto: 'Una sustancia poco reactiva junto al suelo no tiene por qué ser inofensiva en toda la atmósfera. En 1974, Mario Molina y F. Sherwood Rowland mostraron que los clorofluorocarbonos podían llegar a la estratosfera y liberar cloro capaz de destruir ozono. Su análisis unió emisiones, transporte, radiación y ciclos catalíticos. Evaluar un contaminante exige seguir toda su cadena.',
      pregunta: '¿Dónde buscarías el daño de un gas que no reacciona cerca del suelo?',
      fuente: { titulo: 'NASA, Is the ozone hole causing climate change?', url: 'https://science.nasa.gov/climate-change/faq/is-the-ozone-hole-causing-climate-change/' },
    },
    // Laboratorio (docs/teoria.md §4b): sin preguntas. La primera mesa es más rica que el juego de reciclaje: tres
    // filtros con rangos de 10 a 100 % y tres manijas. La segunda junta la arista y los cortes, hasta 20 por arista.
    // La lectura dice entradas y resultado, para que un caso guardado se entienda solo.
    glosario: [
      { termino: 'contaminante', def: 'Sustancia que, en cantidad suficiente, daña a los seres vivos o al ambiente al que llega.',
        ejemplo: 'El SO₂ de una fundición: termina como lluvia ácida.', formas: ['contaminante', 'contaminantes'], ver: ['lluvia ácida'] },
      { termino: 'smog', def: 'Niebla sucia de la ciudad: humo y gases del tránsito que la luz solar convierte en ozono y otros irritantes.',
        ver: ['contaminante'] },
      { termino: 'lluvia ácida', def: 'Lluvia con ácidos formados en el aire a partir de SO₂ y de óxidos de nitrógeno.',
        ejemplo: 'SO₂ → SO₃, y SO₃ + H₂O → H₂SO₄.', ver: ['contaminante', 'escala de pH'] },
      { termino: 'efecto invernadero', def: 'Retención de calor en la atmósfera: gases como el CO₂ dejan pasar la luz pero frenan el calor que sale.',
        ver: ['capa de ozono'] },
      { termino: 'capa de ozono', def: 'Zona alta de la atmósfera con más O₃, que absorbe gran parte de la luz ultravioleta del Sol.',
        ver: ['CFC', 'efecto invernadero'] },
      { termino: 'estratosfera', def: 'Capa de la atmósfera entre unos 10 y 50 km de altura, sobre la zona de las nubes.',
        ver: ['capa de ozono'] },
      { termino: 'CFC', def: 'Clorofluorocarbonos: gases de aerosoles y refrigeradoras antiguas que destruyen el ozono de la estratosfera.',
        ver: ['capa de ozono'] },
      { termino: 'eutrofización', def: 'Exceso de nutrientes en un lago: crecen algas, al morir se descomponen y se gasta el oxígeno del agua.',
        ejemplo: 'Fosfatos de detergentes y fertilizantes que llegan a una bahía.', ver: ['oxígeno disuelto'] },
      { termino: 'oxígeno disuelto', def: 'O₂ mezclado en el agua, el que respiran los peces; lo gastan las bacterias que descomponen materia.',
        ver: ['eutrofización'] },
      { termino: 'potabilización', def: 'Tratamiento que vuelve el agua apta para beber: coagular, sedimentar, filtrar y desinfectar.',
        formas: ['potabilización', 'potabilizar'], ver: ['desinfección'] },
      { termino: 'coagulante', formas: ['coagulante', 'coagulantes', 'coagular'], def: 'Sustancia que hace que las partículas finas del agua se peguen entre sí, como el sulfato de aluminio.',
        ver: ['flóculo'] },
      { termino: 'flóculo', formas: ['flóculo', 'flóculos'], def: 'Grumo de partículas pegadas que se forma al tratar el agua; pesa y se va al fondo.',
        ver: ['coagulante', 'sedimentar'] },
      { termino: 'sedimentar', formas: ['sedimentar', 'sedimentación'], def: 'Dejar el agua quieta para que lo más pesado se asiente en el fondo del tanque.',
        ver: ['flóculo', 'potabilización'] },
      { termino: 'nutriente', formas: ['nutriente', 'nutrientes'], def: 'Sustancia que un ser vivo usa para crecer, como los nitratos y fosfatos para las algas.',
        ver: ['eutrofización'] },
      { termino: 'nanómetro', simbolo: 'nm', formas: ['nanómetro', 'nanómetros'], def: 'Millonésima parte de un milímetro: 10⁻⁹ m.',
        ver: ['nanoescala'] },
      { termino: 'desinfección', def: 'Paso que mata o inactiva los microbios del agua, por ejemplo con cloro o luz ultravioleta.',
        formas: ['desinfección', 'desinfectar'], ver: ['potabilización'] },
      { termino: 'reciclaje', def: 'Recuperar el material de un producto usado para fabricar otro, en lugar de botarlo.',
        ver: ['recuperación'] },
      { termino: 'monómero', def: 'Molécula pequeña que se repite muchas veces, unida a otras iguales, para formar un polímero.',
        ejemplo: 'Eteno, CH₂=CH₂, el monómero del polietileno.', formas: ['monómero', 'monómeros'], ver: ['polímero'] },
      { termino: 'polimerización por adición', def: 'Unión de muchos monómeros que abren su doble enlace y se enganchan sin soltar ninguna molécula.',
        ejemplo: 'n CH₂=CH₂ → (–CH₂–CH₂–)ₙ: el polietileno.', ver: ['monómero', 'adición'] },
      { termino: 'nanoescala', def: 'Tamaños de 1 a 100 nanómetros, donde muchos átomos quedan en la superficie y cambian las propiedades.' },
      { termino: 'corrosión', def: 'Deterioro de un metal por una reacción redox en su superficie, con agua y oxígeno.',
        ejemplo: 'El hierro de un clavo mojado forma herrumbre.', ver: ['oxidación'] },
    ],
    laboratorio: [
      {
        id: 'tres-filtros', titulo: 'Tres filtros sobre 100 kg', pieza: 'barra-porcentaje',
        consigna: 'Los 100 kg pasan solos por los tres filtros, uno por segundo. Arrastra el borde de cada pedazo y busca qué filtro pesa más.',
        controles: [
          { id: 'a', etiqueta: 'Recolectado', color: 'c-o', min: 10, max: 100, paso: 5, inicio: 50, unidad: '%', decimales: 0 },
          { id: 's', etiqueta: 'Separado', color: 'c-h', min: 10, max: 100, paso: 5, inicio: 80, unidad: '%', decimales: 0 },
          { id: 'b', etiqueta: 'Recuperado', color: 'c-d', min: 10, max: 100, paso: 5, inicio: 70, unidad: '%', decimales: 0 },
          { id: 't', etiqueta: 't', color: 'c-h', min: 0, max: 4, paso: 0.5, inicio: 0, unidad: 's', decimales: 1, auto: { velocidad: 1 } },
        ],
        dibujo: barra3,
        lectura: val => [`Pasan ${f(pasan3(val), 1)} kg · al final `, m, ` = ${f(queda3(val, 3), 1)} kg`],
        // Cada manija es el borde izquierdo del pedazo que cae en su fila: lo que queda tras ese filtro.
        arrastres: [
          { id: 'recolectado', etiqueta: 'borde de lo recolectado', color: 'c-o',
            donde: val => ({ x: xBarra(queda3(val, 1)), y: yFila(1) }),
            mover: pt => ({ a: (pt.x - 10) / 3 }) },
          { id: 'separado', etiqueta: 'borde de lo separado', color: 'c-h',
            donde: val => ({ x: xBarra(queda3(val, 2)), y: yFila(2) }),
            mover: (pt, val) => ({ s: 100 * (pt.x - 10) / (3 * queda3(val, 1)) }) },
          { id: 'recuperado', etiqueta: 'borde de lo recuperado', color: 'c-d',
            donde: val => ({ x: xBarra(queda3(val, 3)), y: yFila(3) }),
            mover: (pt, val) => ({ b: 100 * (pt.x - 10) / (3 * queda3(val, 2)) }) },
        ],
        invitaciones: [
          { texto: 'Recupera al menos 60 kg de cada 100 kg.',
            logrado: val => queda3(val, 3) >= 60,
            bien: 'Para llegar alto, los tres filtros tienen que ser buenos a la vez.' },
          { texto: 'Pon dos filtros al 100 % y deja salir justo la mitad.',
            logrado: val => [val.a, val.s, val.b].filter(x => x === 100).length === 2 && Math.abs(queda3(val, 3) - 50) < 1e-9,
            bien: 'Basta un solo filtro al 50 % para perder la mitad.' },
          { texto: 'Pasa de 80 kg con la separación por debajo de 90 %.',
            logrado: val => queda3(val, 3) > 80 && val.s < 90,
            bien: 'Con los otros perfectos, el filtro flojo pone el techo.' },
          { texto: 'Pausa justo cuando la carga ya cruzó los tres filtros.',
            logrado: val => avance3(val) >= 3,
            bien: 'Ahí la barra vale lo que de verdad vuelve.',
            pista: 'Espera a que el tercer pedazo deje de crecer y pausa; ajusta t con − y +.' },
          { texto: 'Guarda dos casos con los mismos tres porcentajes en otro orden.',
            logrado: (val, guardados) => { const k = x => [x.a, x.s, x.b].sort((p, q) => p - q).join();
              return guardados.some(g => k(g) === k(val) && (g.a !== val.a || g.s !== val.s || g.b !== val.b) && Math.abs(queda3(g, 3) - queda3(val, 3)) < 1e-9); },
            bien: 'Mismos kilos: los filtros se multiplican y el orden no importa.' },
        ],
      },
      {
        id: 'cubo-partido', titulo: 'Arista y cortes juntos', pieza: 'ejes',
        consigna: 'Elige la arista y desliza el punto por la recta: más a la derecha, más cortes. Compara su área con la del punto «entero».',
        controles: [
          { id: 'a', etiqueta: 'Arista', min: 1, max: 4, paso: 1, inicio: 1, unidad: 'cm', decimales: 0 },
          { id: 'k', etiqueta: 'k', min: 1, max: 20, paso: 1, inicio: 5, unidad: '', decimales: 0 },
        ],
        dibujo: val => ({ datos: ejesCubo(val.a, { puntos: [
          { x: 1, y: 6 * val.a * val.a, rotulo: 'entero' },
          { x: val.k, y: areaCubo(val), color: 'o', rotulo: `${f(areaCubo(val), 0)} cm²`, guias: true },
        ] }), estado: {} }),
        lectura: val => [`a = ${val.a} cm, k = ${val.k} → ${f(val.k ** 3, 0)} cubitos, `, A, ` = ${f(areaCubo(val), 0)} cm²`],
        // El punto se desliza por la recta: más a la derecha, más cortes; responde el área (el volumen no cambia).
        arrastres: [{ id: 'cortes', etiqueta: 'punto sobre la recta: más cortes', color: 'c-o',
          donde: puntoCubo,
          mover: (pt, val) => { const g = PZ('ejes').geometria(ejesCubo(val.a)); return { k: (pt.x - g.X(0)) / (g.X(1) - g.X(0)) }; } }],
        invitaciones: [
          { texto: 'Haz que el área total sea diez veces la del cubo entero.',
            logrado: val => areaCubo(val) === 10 * areaCubo({ a: val.a, k: 1 }),
            bien: 'Diez veces la superficie, y el volumen no cambió nada.' },
          { texto: 'Con el cubo de 1 cm, busca el menor k que pase de 100 cm².',
            logrado: val => val.a === 1 && areaCubo(val) > 100 && areaCubo({ a: 1, k: val.k - 1 }) <= 100,
            bien: 'Cada corte suma área; el volumen sigue en 1 cm³.' },
          { texto: 'Guarda dos cubos de distinta arista con la misma área total.',
            logrado: (val, guardados) => guardados.some(g => g.a !== val.a && areaCubo(g) === areaCubo(val)),
            bien: 'Un cubo grande poco partido iguala a uno chico muy partido.' },
          { texto: 'Llega al área más grande que permite esta mesa.',
            logrado: val => areaCubo(val) === areaCubo({ a: 4, k: 20 }),
            bien: 'La mayor superficie posible: por eso un polvo fino reacciona tan rápido.' },
        ],
      },
    ],
    // A qué idea pertenece cada mesa del laboratorio (Gerson, 16 nov: el laboratorio se agrupa por idea). Una lista vacía:
    // la mesa no practica ninguna idea de la unidad y va en «Más mesas del tema».
    laboratorioIdeas: {
      'tres-filtros': ['reciclaje-flujos'],
      'cubo-partido': ['superficie-nano-corrosion'],
    },
    ideas: [aire, agua, eutro, reciclaje, polimeros, nano],
  };
});
