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
  const aire = {
    id: 'cadenas-del-aire',
    titulo: 'Cada problema, su cadena',
    temas: ['Ecosistemas y contaminantes', 'Efecto invernadero', 'Smog y lluvia ácida', 'Capa de ozono'],
    pieza: 'quim-cadena',
    juega: {
      consigna: 'Elige un problema del aire. Lee su cadena de arriba abajo: de dónde sale, qué sustancia actúa, qué le pasa y qué efecto deja.',
      voz: 'Un contaminante se entiende por su cadena completa.',
      controles: [{ id: 'k', etiqueta: 'Problema', opciones: Object.keys(AIRE).map(k => ({ valor: k, texto: AIRE[k].titulo })) }],
      dibujo: val => cadena([col(val.k)]),
      lectura: val => [AIRE[val.k].lee],
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
    ahoraTu: {
      voz: 'Ubica la sustancia en su cadena.',
      generar(s) {
        const C = [
          ['El SO₂ que sale de una fundición', 'lluvia'], ['El CO₂ de los motores y las cocinas', 'invernadero'],
          ['Los CFC de refrigeradoras antiguas', 'ozono'], ['Los NOₓ de los autos en una tarde soleada', 'smog'],
          ['El metano de un relleno sanitario', 'invernadero'], ['El H₂SO₄ que se forma en las nubes', 'lluvia'],
        ];
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
    { texto: 'coagular y flocular: las partículas se juntan', quita: 'aún no quita nada' },
    { texto: 'sedimentar y filtrar: agua clara', quita: 'partículas; quedan microbios' },
    { texto: 'desinfectar con cloro: microbios inactivados', quita: 'microbios' },
  ];
  const potab = (hasta, desde = false) => cadena([{ titulo: 'Potabilización', color: 'i', nodos: ETAPAS.map((e, i) => ({ texto: e.texto, desde: desde ? i : 0, tenue: !desde && i > hasta })) }]);
  const agua = {
    id: 'filtrar-no-desinfecta',
    titulo: 'Agua clara no es segura',
    temas: ['Contaminación y potabilización del agua'],
    pieza: 'quim-cadena',
    juega: {
      consigna: 'Avanza el tratamiento del agua de un río etapa por etapa. Mira qué quita cada una.',
      voz: 'Anota qué queda en el agua después de cada etapa.',
      controles: [{ id: 'e', etiqueta: 'Hasta la etapa', min: 1, max: 3, paso: 1, inicio: 1, decimales: 0 }],
      dibujo: val => potab(val.e - 1),
      lectura: val => [`Hasta aquí se quitan: ${ETAPAS[val.e - 1].quita}.`],
      minimo: 3,
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
      ecuacion: ['filtrar ≠ desinfectar'],
      condicion: 'agua clara no es agua segura; las sales o metales disueltos necesitan otros tratamientos.',
      voz: 'Pregunta qué quita cada etapa.',
    },
    ahoraTu: {
      voz: 'Piensa si lo que se quiere quitar es partícula, microbio o algo disuelto.',
      generar(s) {
        const C = [['la arena que trae el río', 'filtro'], ['las bacterias del agua', 'cloro'], ['el plomo disuelto', 'otro'], ['los flóculos formados al coagular', 'filtro'], ['los virus del agua', 'cloro'], ['la sal disuelta del agua de mar', 'otro']];
        const [cosa, k] = C[s % C.length];
        const T = { filtro: 'Sedimentar y filtrar', cloro: 'Desinfectar', otro: 'Ninguna de estas dos: está disuelto' };
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
  const eutro = {
    id: 'eutrofizacion',
    titulo: 'Más nutrientes, menos oxígeno',
    temas: ['Eutrofización'],
    pieza: 'quim-cadena',
    juega: {
      consigna: 'Elige cuántos nutrientes llegan a un lago y sigue la cadena hasta los peces.',
      voz: 'Busca el eslabón que de verdad afecta a los peces.',
      controles: [{ id: 'n', etiqueta: 'Nutrientes', opciones: [{ valor: 'pocos', texto: 'Pocos' }, { valor: 'muchos', texto: 'Muchos' }] }],
      dibujo: val => cadena([{ titulo: val.n === 'pocos' ? 'Lago sano' : 'Lago eutrofizado', color: val.n === 'pocos' ? 'd' : 'h', nodos: (val.n === 'pocos' ? SANO : EUTRO).map(t => ({ texto: t })) }]),
      lectura: val => [val.n === 'pocos' ? 'Hay oxígeno disuelto de sobra.' : 'El oxígeno disuelto se agota.'],
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
  const reciclaje = {
    id: 'reciclaje-flujos',
    titulo: 'Reciclar se mide con flujos',
    temas: ['Reciclaje y tecnologías limpias'],
    pieza: 'barra-porcentaje',
    juega: {
      consigna: 'De 100 kg de botellas usadas, elige qué parte se recolecta y qué parte de lo recolectado recupera la planta.',
      voz: 'Mira sobre qué se aplica el segundo porcentaje.',
      controles: [
        { id: 'a', etiqueta: 'Recolectado', min: 30, max: 90, paso: 20, inicio: 50, unidad: '%', decimales: 0 },
        { id: 'b', etiqueta: 'Recuperado', min: 60, max: 90, paso: 10, inicio: 70, unidad: '%', decimales: 0 },
      ],
      dibujo: val => barra(val.a, val.b),
      lectura: val => [m, ` que vuelve = ${f(val.a * val.b / 100, 1)} kg de 100 kg`],
      minimo: 3,
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
      ecuacion: [{ sub: [m, 'vuelve'] }, ' = ', { sub: [m, 'total'] }, ' · ', { sub: ['f', 'recolectada'] }, ' · ', { sub: ['f', 'recuperada'] }],
      condicion: 'las fracciones se aplican una sobre otra; «reciclable» no dice cuánto se recicla de verdad.',
      voz: 'Sigue los kilos de un paso al siguiente.',
    },
    ahoraTu: {
      voz: 'Multiplica las fracciones, en orden.',
      generar(s) {
        const x = azar(s), tot = 50 * x.ent(2, 20), a = 5 * x.ent(5, 18), b = 5 * x.ent(12, 19), v = tot * a / 100 * b / 100;
        const mat = ['latas de aluminio', 'botellas de plástico', 'papel', 'vidrio'][s % 4];
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
  function poli(n, corte = 0) {
    const atomos = [], enlaces = [];
    // En serpentina, cuatro por fila: la cadena es una sola fila de enlaces aunque se doble en el papel.
    for (let i = 0; i < 2 * n; i++) {
      const fila = Math.floor(i / 4), k = i % 4, col = fila % 2 ? 3 - k : k;
      atomos.push({ id: `c${i}`, t: 'CH₂', x: col * 1.5, y: fila * 1.3, color: 'i' });
      if (i) enlaces.push({ a: `c${i - 1}`, b: `c${i}` });
    }
    return { datos: { escala: 40, alto: 170, atomos, enlaces, textos: [{ x: -0.95, y: 0, t: '–' }, { x: 2.25, y: 2.4, t: `${n} etilenos: ${2 * n} grupos CH₂, sin subproducto` }],
      alt: `Cadena de polietileno formada por ${n} moléculas de etileno: ${2 * n} grupos CH₂ unidos en fila; no se libera ninguna molécula.` }, estado: { corte } };
  }
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
  const polimeros = {
    id: 'polimeros-adicion',
    titulo: 'No toda unión suelta agua',
    temas: ['Nanotecnología, polímeros y corrosión (solo UNI)'],
    pieza: 'quim-molecula',
    juega: {
      consigna: 'Une moléculas de etileno, CH₂=CH₂: cada doble enlace se abre y se engancha al siguiente. Cuenta los átomos de la cadena.',
      voz: 'Cuenta si sobra algún átomo al unir.',
      controles: [{ id: 'n', etiqueta: 'Etilenos', min: 2, max: 4, paso: 1, inicio: 2, decimales: 0 }],
      dibujo: val => poli(val.n),
      lectura: val => [m, ` de la cadena = ${f(val.n, 0)} · 28 = ${f(28 * val.n, 0)} g/mol`],
      minimo: 3,
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
      ecuacion: ['adición: n CH₂=CH₂ → (–CH₂–CH₂–)ₙ'],
      condicion: 'que un polímero sea degradable o reciclable depende de su estructura y de cómo se procesa; no son lo mismo.',
      voz: 'Antes de decir que sale agua, cuenta átomos.',
    },
    ahoraTu: {
      voz: 'Decide si la unión suelta agua.',
      generar(s) {
        const x = azar(s), n = x.ent(3, 12), cond = s % 2 === 1;
        if (!cond) {
          const M = x.de([28, 42, 104]), nom = { 28: 'etileno', 42: 'propileno', 104: 'estireno' }[M];
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
        const M = x.de([75, 89, 181]), nom = { 75: 'glicina', 89: 'alanina', 181: 'tirosina' }[M];
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
  const nano = {
    id: 'superficie-nano-corrosion',
    titulo: 'Más pedazos, más superficie',
    temas: ['Nanotecnología, polímeros y corrosión (solo UNI)'],
    pieza: 'ejes',
    juega: {
      consigna: 'Corta un cubo de 1 cm³ en k partes por arista: salen k³ cubitos. Mira cómo cambia el área total expuesta.',
      voz: 'Fíjate en qué crece y qué se queda igual.',
      controles: [{ id: 'k', etiqueta: 'k', min: 1, max: 10, paso: 1, inicio: 1, decimales: 0 }],
      dibujo: val => ({ datos: ejesA({ puntos: [{ x: val.k, y: 6 * val.k, color: 'o', rotulo: `${f(6 * val.k, 0)} cm²`, guias: true }] }), estado: {} }),
      lectura: val => [`${f(val.k ** 3, 0)} cubitos · volumen 1 cm³ · `, A, ` = ${f(6 * val.k, 0)} cm²`],
      minimo: 3,
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
      ecuacion: [A, ' = 6k (1 cm³ cortado en k partes por arista)'],
      condicion: 'la nanoescala no garantiza seguridad ni mejor rendimiento; la corrosión depende también del medio, como sal o ácido.',
      voz: 'Pregunta cuánta superficie queda expuesta.',
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

  return {
    unidad: 'quimica.ambiente-y-quimica-aplicada',
    version: '0.1.0',
    estado: 'completa',
    requiere: ['/nucleo/kit/piezas/quim-cadena.js', '/nucleo/kit/piezas/barra-porcentaje.js', '/nucleo/kit/piezas/quim-molecula.js', '/nucleo/kit/piezas/ejes.js'],
    historia: {
      texto: 'Una sustancia poco reactiva junto al suelo no tiene por qué ser inofensiva en toda la atmósfera. En 1974, Mario Molina y F. Sherwood Rowland mostraron que los clorofluorocarbonos podían llegar a la estratosfera y liberar cloro capaz de destruir ozono. Su análisis unió emisiones, transporte, radiación y ciclos catalíticos. Evaluar un contaminante exige seguir toda su cadena.',
      pregunta: '¿Dónde buscarías el daño de un gas que no reacciona cerca del suelo?',
      fuente: { titulo: 'NASA, Is the ozone hole causing climate change?', url: 'https://science.nasa.gov/climate-change/faq/is-the-ozone-hole-causing-climate-change/' },
    },
    ideas: [aire, agua, eutro, reciclaje, polimeros, nano],
  };
});
