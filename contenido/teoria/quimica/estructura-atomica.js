/*
 * Teoría de «Estructura atómica» (quimica.estructura-atomica). Molde: docs/teoria.md y la unidad de referencia
 * contenido/teoria/fisica/movimiento-rectilineo.js; forma de química: contenido/teoria/quimica/materia-y-energia.js.
 * Compañera: Bruna (castora), voz resolutiva y cálida.
 * Fuente del contenido: docs/teoria/matriz/quimica.json (unidad 2), docs/teoria/fuentes/historia-ecuaciones-1.pdf
 * (p. 26) y las precisiones de Química del expediente. Errores: docs/investigacion/atomo-enlace-ideas-erroneas.md
 * (AT, TP4); los QM- son hipótesis nuevas (ninguno medido).
 *
 * Ficha de tarea (diseno-y-animacion)
 *   Promesa: contar las partículas de un átomo o ion y escribir dónde están sus electrones.
 *   Persona y condiciones: postulante de 3.º–5.º, celular de gama baja a 360 px, sin audio, a veces sin conexión.
 *   Resultado observable: da Z, A, N y electrones de una especie; dice qué modelo explicó qué evidencia; escribe la
 *     configuración de un átomo o ion (hasta Z = 20) y cuenta electrones desapareados.
 *   Orden de atención: 1.º el núcleo (qué elemento es) · 2.º los electrones (qué carga tiene) · acción: probar casos.
 *   Estados: juego sin tocar · casos probados · predicción abierta · revelado · paso a paso · caso nuevo · acierto · «No sé».
 *   Duda que resuelve: ¿quitar un electrón cambia el elemento?, ¿el orbital es una órbita?, ¿de dónde salen los
 *     electrones de un catión?
 *
 * Colores (regla 4): Z protones rojo c-h, N neutrones verde c-d, electrones turquesa c-i (los mismos de la pieza
 * quim-atomo y de las flechas de quim-cajas), A número de masa naranja c-o.
 * Datos: configuraciones por la regla de n + l (Möller) en estado fundamental, Z ≤ 20 en los casos generados.
 * Radios iónicos: Shannon (1976), número de coordinación 6, en pm (los mismos de plantillas/atomo-y-tabla/motor.js).
 * Fuentes (no van al alumno): OpenStax Chemistry 2e §2.3 y §6.4; Dalton (1808), Rutherford (1911), Bohr (1913).
 */
(function (root, fabrica) {
  const def = fabrica(typeof module === 'object' && module.exports ? require('../../../nucleo/kit/kit.js') : root.Kit);
  if (typeof module === 'object' && module.exports) module.exports = def;
  else root.Teoria.unidad(def);
})(typeof self !== 'undefined' ? self : this, function (Kit) {
  'use strict';
  const f = (n, d = 2) => Kit.formatear(n, d);
  const Z = { v: 'c-h', t: 'Z' }, N = { v: 'c-d', t: 'N' }, A = { v: 'c-o', t: 'A' }, e = { v: 'c-i', t: 'e' };
  function azar(s) {
    let q = (s * 2654435761 + 12345) >>> 0;
    const r = () => { q = (q + 0x6D2B79F5) >>> 0; let z = q; z = Math.imul(z ^ (z >>> 15), z | 1); z ^= z + Math.imul(z ^ (z >>> 7), z | 61); return ((z ^ (z >>> 14)) >>> 0) / 4294967296; };
    r.ent = (lo, hi) => lo + Math.floor(r() * (hi - lo + 1));
    r.de = l => l[Math.floor(r() * l.length)];
    return r;
  }
  function opciones(correcta, distractores, fmt) {
    const vistos = new Set([fmt(correcta)]);
    const ops = [{ id: 'c', texto: fmt(correcta), correcta: true }];
    for (const d of distractores) {
      if (d.valor === undefined || d.valor === null || (typeof d.valor === 'number' && !Number.isFinite(d.valor))) continue;
      const txt = fmt(d.valor);
      if (vistos.has(txt)) continue;
      vistos.add(txt);
      ops.push({ id: d.id, texto: txt, error: d.error, siFuera: d.siFuera });
    }
    return ops.slice(0, 4);
  }
  const SUP = { '-': '⁻', '+': '⁺', 0: '⁰', 1: '¹', 2: '²', 3: '³', 4: '⁴', 5: '⁵', 6: '⁶', 7: '⁷', 8: '⁸', 9: '⁹' };
  const sup = x => String(x).split('').map(c => SUP[c] || c).join('');
  const carga = q => (q === 0 ? '' : sup(`${Math.abs(q) === 1 ? '' : Math.abs(q)}${q > 0 ? '+' : '-'}`));
  const signo = q => (q > 0 ? `+${q}` : q < 0 ? `−${-q}` : '0');

  const SIMB = ['', 'H', 'He', 'Li', 'Be', 'B', 'C', 'N', 'O', 'F', 'Ne', 'Na', 'Mg', 'Al', 'Si', 'P', 'S', 'Cl', 'Ar', 'K', 'Ca'];
  const NOMBRE = ['', 'hidrógeno', 'helio', 'litio', 'berilio', 'boro', 'carbono', 'nitrógeno', 'oxígeno', 'flúor', 'neón', 'sodio', 'magnesio',
    'aluminio', 'silicio', 'fósforo', 'azufre', 'cloro', 'argón', 'potasio', 'calcio'];
  // Capas del modelo de Bohr para Z ≤ 20 (2, 8, 8, 2): solo para dibujar el modelo de capas.
  const capas = n => [2, 8, 8, 2].map((c, i, l) => Math.max(0, Math.min(c, n - l.slice(0, i).reduce((a, b) => a + b, 0)))).filter((x, i, l) => x > 0 || l.slice(i).some(y => y > 0));
  // Orden de llenado (n + l, y a igual n + l, menor n) hasta 4p.
  const ORDEN = [['1s', 2], ['2s', 2], ['2p', 6], ['3s', 2], ['3p', 6], ['4s', 2], ['3d', 10], ['4p', 6]];
  function config(n) {
    const out = [];
    let resto = n;
    for (const [nom, cap] of ORDEN) { if (resto <= 0) break; const k = Math.min(cap, resto); out.push([nom, k]); resto -= k; }
    return out;
  }
  const textoConfig = c => c.map(([nom, k]) => `${nom}${sup(k)}`).join(' ');
  const cajasDe = nom => ({ s: 1, p: 3, d: 5, f: 7 })[nom.slice(-1)];
  const filasConfig = c => c.map(([nom, k]) => ({ nombre: nom, e: k, cajas: cajasDe(nom) }));

  // ---------- Idea 1: el núcleo decide el elemento ----------
  // Cambia: protones, neutrones y carga · Permanece: el dibujo del núcleo al centro y las capas afuera · Progresa:
  // de cambiar N (isótopo) a cambiar electrones (ion) y a cambiar Z (otro elemento) · Se reserva: el electrón que
  // sale, dibujado afuera · Debe verse: que Z está en el núcleo y la carga, afuera.
  function especie(z, n, q) {
    const el = Math.max(0, z - q);
    return { simbolo: `${SIMB[z]}${carga(q)}`, Z: z, N: n, capas: capas(el), titulo: `${SIMB[z]}${carga(q)}`, rotulo: `A = ${z + n} · carga ${signo(q)}`,
      sale: q > 0 ? { n: Math.min(q, z) } : undefined, llega: q < 0 ? { n: -q } : undefined };
  }
  const nucleo = {
    id: 'nucleo-identidad',
    titulo: 'El núcleo decide el elemento',
    temas: ['Partículas subatómicas', 'Número atómico y de masa', 'Isótopos'],
    pieza: 'quim-atomo',
    juega: {
      consigna: 'Cambia los protones, los neutrones y la carga. Mira qué cambia el nombre del elemento y qué solo cambia la masa o la carga.',
      voz: 'Mueve una sola cosa a la vez y mira el nombre.',
      controles: [
        { id: 'z', etiqueta: 'Protones', color: 'c-h', min: 1, max: 12, paso: 1, inicio: 6, decimales: 0 },
        { id: 'n', etiqueta: 'Neutrones', color: 'c-d', min: 0, max: 14, paso: 1, inicio: 6, decimales: 0 },
        { id: 'q', etiqueta: 'Carga', min: -2, max: 2, paso: 1, inicio: 0, decimales: 0 },
      ],
      dibujo: v => ({ datos: { atomos: [especie(v.z, v.n, v.q)] }, estado: {} }),
      lectura: v => (v.q > v.z ? [`${NOMBRE[v.z]}: no tiene ${v.q} electrones que perder`] : [Z, ` = ${v.z}: ${NOMBRE[v.z]} · `, A, ` = ${v.z + v.n} · carga ${signo(v.q)}`]),
      minimo: 4,
    },
    predice: {
      pregunta: 'Un átomo de sodio tiene 11 protones, 12 neutrones y 11 electrones. Si pierde un electrón, ¿qué es ahora?',
      voz: 'Antes de responder, mira dónde está cada partícula.',
      opciones: [
        { id: 'c', texto: 'Un ion Na⁺: sigue siendo sodio', correcta: true },
        { id: 'neon', texto: 'Neón, porque ahora tiene 10 electrones', error: 'QM-ION-ELEMENTO', siFuera: 'El neón tiene 10 electrones, cierto. Pero el elemento lo decide el núcleo: sigue con 11 protones.' },
        { id: 'isotopo', texto: 'Un isótopo del sodio', error: 'QM-ION-ISOTOPO', siFuera: 'Sería un isótopo si cambiaran los neutrones. Aquí cambió un electrón: es un ion.' },
        { id: 'magnesio', texto: 'Magnesio, porque queda con carga +1', error: 'QM-ION-ELEMENTO', siFuera: 'La carga cambió, bien visto. Pero el magnesio tiene 12 protones; aquí siguen siendo 11.' },
      ],
      dibujo: { datos: { atomos: [especie(11, 12, 0)] }, estado: {} },
      revelar: { datos: { atomos: [especie(11, 12, 0), especie(11, 12, 1)] }, estado: {} },
      coincide: 'Coincide: el núcleo no cambió, solo salió un electrón.',
      noCoincide: 'El núcleo sigue con 11 protones: es sodio con carga +1.',
    },
    mira: {
      datos: { atomos: [Object.assign(especie(6, 6, 0), { titulo: 'carbono-12', desde: 1 }), Object.assign(especie(6, 8, 0), { titulo: 'carbono-14', desde: 2 })] },
      voz: 'Comparemos dos átomos de carbono partícula por partícula.',
      pasos: [
        { estado: { corte: 1 }, texto: 'Seis protones en el núcleo: eso lo hace carbono.', ecuacion: [Z, ' = 6'] },
        { estado: { corte: 1 }, texto: 'Con 6 neutrones, su número de masa es 12.', ecuacion: [A, ' = ', Z, ' + ', N, ' = 6 + 6 = 12'] },
        { estado: { corte: 2 }, texto: 'Otro carbono con 8 neutrones: número de masa 14.', ecuacion: [A, ' = 6 + 8 = 14'] },
        { estado: { corte: 2 }, texto: 'Mismo Z, distinto N: son isótopos. Sus electrones son iguales.', ecuacion: ['¹²C y ¹⁴C: 6 ', e] },
      ],
    },
    regla: {
      texto: 'Z cuenta los protones y decide el elemento. A = Z + N cuenta protones y neutrones. La carga es protones menos electrones.',
      ecuacion: [A, ' = ', Z, ' + ', N, '   ·   carga = ', Z, ' − ', e],
      condicion: 'isótopos: mismo Z y distinto N. Iones: mismo Z y distinto número de electrones; el elemento no cambia.',
      voz: 'Primero el núcleo, después los electrones.',
    },
    ahoraTu: {
      voz: 'Separa lo que está en el núcleo de lo que está afuera.',
      generar(s) {
        const LISTA = [[8, 16, -2], [11, 23, 1], [12, 24, 2], [13, 27, 3], [16, 32, -2], [17, 35, -1], [17, 37, -1], [19, 39, 1], [20, 40, 2], [26, 56, 3], [26, 56, 2], [9, 19, -1], [7, 14, -3], [29, 63, 2]];
        const SIM = { 26: 'Fe', 29: 'Cu' };
        const r = azar(s), [z, a, q] = LISTA[r.ent(0, LISTA.length - 1)];
        const sim = `${SIMB[z] || SIM[z]}${carga(q)}`, masa = sup(a);
        if (s % 2) {
          return {
            pregunta: ['El ion ', `${masa}${sim}`, ' tiene ', Z, ` = ${z}. ¿Cuántos electrones tiene?`],
            opciones: opciones(z - q, [
              { id: 'suma', valor: z + q, error: 'QM-CARGA-E', siFuera: 'Eso suma la carga. Una carga positiva significa electrones de menos.' },
              { id: 'neutro', valor: z, error: 'QM-CARGA-E', siFuera: 'Así sería el átomo neutro. La carga dice cuántos electrones ganó o perdió.' },
              { id: 'neutrones', valor: a - z, error: 'QM-NEUTRONES', siFuera: 'Eso cuenta los neutrones del núcleo, no los electrones.' },
            ], n => `${n}`),
            solucion: { texto: `Carga ${signo(q)}: ${q > 0 ? 'perdió' : 'ganó'} ${Math.abs(q)} electrones respecto de los ${z} del átomo neutro.`, ecuacion: [e, ` = ${z} − (${signo(q)}) = ${z - q}`] },
          };
        }
        return {
          pregunta: ['El ion ', `${masa}${sim}`, ' tiene ', Z, ` = ${z}. ¿Cuántos neutrones tiene su núcleo?`],
          opciones: opciones(a - z, [
            { id: 'carga', valor: a - z - q, error: 'QM-CARGA-N', siFuera: 'Eso resta la carga. La carga viene de los electrones; no toca el núcleo.' },
            { id: 'a', valor: a, error: 'QM-NEUTRONES', siFuera: 'Ese es A: protones y neutrones juntos.' },
            { id: 'z', valor: z, error: 'AT4', siFuera: 'Sería cierto si hubiera tantos neutrones como protones; eso no siempre pasa.' },
          ], n => `${n}`),
          solucion: { texto: 'Los neutrones salen de A menos Z; la carga no cambia el núcleo.', ecuacion: [N, ' = ', A, ' − ', Z, ` = ${a} − ${z} = ${a - z}`] },
        };
      },
    },
  };

  // ---------- Idea 2: cada modelo respondió a una evidencia ----------
  // Cambia: el modelo elegido · Permanece: la cadena evidencia → modelo → lo que no explicaba · Progresa: de Dalton
  // al modelo actual · Se reserva: la lámina de oro de Rutherford (se predice) · Debe verse: qué evidencia obligó a
  // cambiar de modelo.
  const MODELOS = {
    dalton: { titulo: 'Dalton, 1808', nodos: ['Los elementos se combinan en proporciones fijas de masa', 'Átomos indivisibles, iguales en cada elemento', 'No explica la electricidad ni los electrones'] },
    thomson: { titulo: 'Thomson, 1904', nodos: ['Los rayos catódicos llevan partículas negativas', 'Electrones en una esfera de carga positiva', 'No explica por qué rebotan las partículas alfa'] },
    bohr: { titulo: 'Bohr, 1913', nodos: ['El hidrógeno solo emite ciertos colores', 'Electrones en niveles de energía permitidos', 'Solo funciona bien con el hidrógeno'] },
    actual: { titulo: 'Modelo actual, 1926', nodos: ['El electrón se comporta como onda', 'Orbitales: regiones donde es probable hallarlo', 'Es el modelo que se usa hoy'] },
  };
  const cadenaModelo = k => ({ datos: { columnas: [{ titulo: MODELOS[k].titulo, nodos: MODELOS[k].nodos.map((t, i) => ({ texto: t, color: ['d', 'o', undefined][i] })) }] }, estado: {} });
  const modelos = {
    id: 'modelos-atomicos',
    titulo: 'Cada modelo respondió a una evidencia',
    temas: ['Modelos atómicos de Dalton a Bohr', 'Modelo actual'],
    pieza: 'quim-cadena',
    juega: {
      consigna: 'Elige un modelo. Arriba está lo que se observó, al medio el modelo que lo explicaba y abajo lo que no lograba explicar.',
      voz: 'Lee cada cadena de arriba abajo: evidencia, modelo, límite.',
      controles: [{ id: 'k', etiqueta: 'Modelo', opciones: Object.keys(MODELOS).map(k => ({ valor: k, texto: MODELOS[k].titulo.split(',')[0] })) }],
      dibujo: v => cadenaModelo(v.k),
      lectura: v => [`${MODELOS[v.k].titulo}: ${MODELOS[v.k].nodos[1]}`.split(' ').slice(0, 12).join(' ')],
      minimo: 3,
    },
    predice: {
      pregunta: 'Rutherford lanzó partículas alfa contra una lámina muy fina de oro. Casi todas la atravesaron y unas pocas rebotaron. ¿Qué concluyó?',
      voz: 'Piensa qué tendría que haber dentro del átomo para que pase eso.',
      opciones: [
        { id: 'c', texto: 'Casi todo es vacío; la masa está en un núcleo diminuto', correcta: true },
        { id: 'orbitas', texto: 'Los electrones giran en órbitas fijas', error: 'AT5', siFuera: 'Las órbitas fijas son de Bohr, dos años después, para explicar los colores del hidrógeno.' },
        { id: 'macizo', texto: 'El átomo es una esfera maciza e indivisible', error: 'QM-MODELO', siFuera: 'Así lo pensaba Dalton. Si fuera macizo, casi ninguna partícula pasaría.' },
        { id: 'thomson', texto: 'La carga positiva está repartida en todo el átomo', error: 'QM-MODELO', siFuera: 'Era el modelo de Thomson. Con la carga repartida, ninguna partícula rebotaría hacia atrás.' },
      ],
      dibujo: { datos: { columnas: [{ titulo: 'Rutherford, 1911', nodos: [{ texto: 'Casi todas las alfa atraviesan el oro; pocas rebotan', color: 'd' }, { texto: '¿?', tenue: true }, { texto: '¿?', tenue: true }] }] }, estado: {} },
      revelar: { datos: { columnas: [{ titulo: 'Rutherford, 1911', nodos: [{ texto: 'Casi todas las alfa atraviesan el oro; pocas rebotan', color: 'd' }, { texto: 'Núcleo diminuto y positivo; electrones afuera', color: 'o' }, { texto: 'No explica por qué el electrón no cae al núcleo' }] }] }, estado: {} },
      coincide: 'Coincide: solo un núcleo pequeño y denso hace rebotar a unas pocas.',
      noCoincide: 'Si unas pocas rebotan, la masa positiva está concentrada en un núcleo pequeño.',
    },
    mira: {
      datos: { columnas: [{ titulo: 'Evidencia y modelo', nodos: [
        { texto: 'Dalton: átomos indivisibles', desde: 1 },
        { texto: 'Thomson: aparecen los electrones', desde: 2 },
        { texto: 'Rutherford: núcleo pequeño y denso', desde: 3 },
        { texto: 'Bohr: niveles de energía', desde: 4 },
        { texto: 'Actual: orbitales, no órbitas', color: 'i', desde: 5 },
      ] }] },
      voz: 'Sigamos la cadena: cada evidencia nueva cambió el modelo.',
      pasos: [
        { estado: { corte: 1 }, texto: 'Las proporciones fijas de masa llevaron a pensar en átomos.' },
        { estado: { corte: 2 }, texto: 'Los rayos catódicos mostraron partículas negativas dentro del átomo.' },
        { estado: { corte: 3 }, texto: 'La lámina de oro mostró un núcleo pequeño, denso y positivo.' },
        { estado: { corte: 4 }, texto: 'Los colores del hidrógeno pidieron niveles de energía permitidos.' },
        { estado: { corte: 5 }, texto: 'Hoy: el orbital es una región de probabilidad, no un camino.' },
      ],
    },
    regla: {
      texto: 'Cada modelo explicó una evidencia que el anterior no podía. En el modelo actual, el electrón no sigue una órbita: un orbital es una región donde es probable encontrarlo.',
      condicion: 'el modelo de Bohr sirve para el hidrógeno y para contar niveles; no es una foto del átomo.',
      voz: 'Un modelo vale por lo que explica, no por lo bonito del dibujo.',
    },
    ahoraTu: {
      voz: 'Relaciona la evidencia con el modelo que la explicó.',
      generar(s) {
        const CASOS = [
          ['Las sustancias se combinan siempre en proporciones fijas de masa.', 'Dalton'],
          ['Los rayos catódicos tienen partículas negativas, sea cual sea el metal.', 'Thomson'],
          ['Unas pocas partículas alfa rebotan al chocar con una lámina de oro.', 'Rutherford'],
          ['El hidrógeno caliente solo emite luz de ciertos colores.', 'Bohr'],
          ['Del electrón solo se puede dar la probabilidad de hallarlo en una región.', 'Actual'],
        ];
        const [ev, mod] = CASOS[s % CASOS.length];
        const nombres = { Dalton: 'Dalton', Thomson: 'Thomson', Rutherford: 'Rutherford', Bohr: 'Bohr', Actual: 'El modelo actual (orbitales)' };
        const que = { Dalton: 'átomos indivisibles con masa propia', Thomson: 'electrones dentro del átomo', Rutherford: 'un núcleo pequeño y denso', Bohr: 'niveles de energía permitidos', Actual: 'orbitales como regiones de probabilidad' };
        return {
          pregunta: `«${ev}» ¿Qué modelo se propuso para explicar esta evidencia?`,
          opciones: Object.keys(nombres).map(k => (k === mod ? { id: 'c', texto: nombres[k], correcta: true }
            : { id: k.toLowerCase(), texto: nombres[k], error: k === 'Bohr' ? 'AT5' : 'QM-MODELO', siFuera: `Ese modelo propuso ${que[k]}; explicaba otra evidencia.` })),
          solucion: { texto: `${nombres[mod]} propuso ${que[mod]} para explicarlo.` },
        };
      },
    },
  };

  // ---------- Idea 3: números cuánticos ----------
  // Cambia: el nivel n y el subnivel l · Permanece: una caja por orbital, dos flechas por caja · Progresa: de 1
  // subnivel a 3, de 2 a 18 electrones · Se reserva: el nivel 4 con su subnivel f · Debe verse: cuántas cajas y
  // flechas tiene cada nivel.
  const LETRA = 'spdf';
  const nivel = (n, sel, lleno = true) => ({ filas: Array.from({ length: n }, (_, l) => ({ nombre: `${n}${LETRA[l]}`, e: lleno ? 2 * (2 * l + 1) : 0, cajas: 2 * l + 1, color: l === sel ? 'o' : undefined })) });
  const cuanticos = {
    id: 'numeros-cuanticos',
    titulo: 'Niveles, subniveles y orbitales',
    temas: ['Números cuánticos y orbitales'],
    pieza: 'quim-cajas',
    juega: {
      consigna: 'Elige el nivel n y el subnivel l. Cuenta las cajas (orbitales) y las flechas (electrones) que caben.',
      voz: 'Prueba también un l igual o mayor que n.',
      controles: [
        { id: 'n', etiqueta: 'n', min: 1, max: 3, paso: 1, inicio: 2, decimales: 0 },
        { id: 'l', etiqueta: 'l', min: 0, max: 2, paso: 1, inicio: 1, decimales: 0 },
      ],
      dibujo: v => ({ datos: Object.assign(nivel(v.n, v.l), { rotulo: `nivel ${v.n}: ${2 * v.n * v.n} e⁻ como máximo` }), estado: {} }),
      lectura: v => (v.l >= v.n ? [`l = ${v.l} no existe con n = ${v.n}: l es menor que n`] : [`${v.n}${LETRA[v.l]}: ${2 * v.l + 1} orbitales, ${2 * (2 * v.l + 1)} electrones como máximo`]),
      minimo: 4,
    },
    predice: {
      pregunta: '¿Cuántos electrones caben, como máximo, en el nivel n = 4?',
      voz: 'Piensa qué subniveles aparecen al subir de nivel.',
      opciones: [
        { id: 'c', texto: '32', correcta: true },
        { id: 'octeto', texto: '8', error: 'QM-OCTETO-NIVEL', siFuera: 'Ocho es el octeto de la capa de valencia, no lo que cabe en un nivel completo.' },
        { id: 'orbitales', texto: '16', error: 'QM-ORBITAL-ELECTRON', siFuera: 'Dieciséis son los orbitales del nivel 4. En cada orbital caben dos electrones.' },
        { id: 'periodo', texto: '18', error: 'QM-PERIODO-NIVEL', siFuera: 'Dieciocho elementos tiene el periodo 4, pero el nivel 4 también tiene 4d y 4f.' },
      ],
      dibujo: { datos: Object.assign(nivel(4, -1, false), { filas: nivel(4, -1, false).filas.slice(0, 3), rotulo: 'nivel 4: 4s, 4p, 4d y 4f' }), estado: {} },
      revelar: { datos: Object.assign(nivel(4, -1), { filas: nivel(4, -1).filas.slice(0, 3), rotulo: '+ 4f (7 cajas, 14 e⁻) = 32 e⁻' }), estado: {} },
      coincide: 'Coincide: 2 + 6 + 10 + 14 = 32.',
      noCoincide: 'El nivel 4 tiene 16 orbitales: 2 + 6 + 10 + 14 = 32 electrones.',
    },
    mira: {
      datos: { filas: [
        { nombre: '3s', e: 2, cajas: 1, desde: 1 }, { nombre: '3p', e: 6, cajas: 3, desde: 2 }, { nombre: '3d', e: 10, cajas: 5, desde: 3 },
      ], rotulo: 'nivel 3: 9 orbitales, 18 e⁻' },
      voz: 'Armemos el nivel 3 subnivel por subnivel.',
      pasos: [
        { estado: { corte: 1 }, texto: 'n = 3 es el tercer nivel. Con l = 0 está el 3s: un orbital.', ecuacion: ['l = 0 (s):  mₗ = 0'] },
        { estado: { corte: 2 }, texto: 'Con l = 1, el 3p: tres orbitales.', ecuacion: ['l = 1 (p):  mₗ = −1, 0, +1'] },
        { estado: { corte: 3 }, texto: 'Con l = 2, el 3d: cinco orbitales.', ecuacion: ['l = 2 (d):  mₗ = −2 … +2'] },
        { estado: { corte: 3 }, texto: 'En cada caja caben dos electrones con espín opuesto.', ecuacion: ['mₛ = +½ o −½'] },
        { estado: { corte: 3 }, texto: 'Total del nivel 3: 9 orbitales y 18 electrones.', ecuacion: ['2 · 3² = 18'] },
      ],
    },
    regla: {
      texto: 'n da el nivel; l, de 0 a n − 1, da el subnivel (s, p, d, f); mₗ, de −l a +l, da una caja por orbital; mₛ = ±½.',
      ecuacion: ['orbitales por subnivel = 2l + 1   ·   electrones por nivel = 2', { sup: ['n', '2'] }],
      condicion: 'cada orbital admite dos electrones de espín opuesto (Pauli); un orbital es una región de probabilidad, no una órbita.',
      voz: 'Cuenta cajas y después flechas.',
    },
    ahoraTu: {
      voz: 'Primero el subnivel, después las cajas.',
      generar(s) {
        const r = azar(s), tipo = s % 3;
        if (tipo === 2) {
          const n = r.ent(1, 6);
          return {
            pregunta: `¿Cuántos electrones caben, como máximo, en el nivel n = ${n}?`,
            opciones: opciones(2 * n * n, [
              { id: 'n2', valor: n * n, error: 'QM-ORBITAL-ELECTRON', siFuera: 'Eso cuenta los orbitales. En cada orbital caben dos electrones.' },
              { id: 'ocho', valor: 8, error: 'QM-OCTETO-NIVEL', siFuera: 'Ocho es el octeto de valencia, no la capacidad de un nivel.' },
              { id: 'dos-n', valor: 2 * n, error: 'QM-ORBITAL-ELECTRON', siFuera: 'Eso multiplica por n una sola vez; la regla es 2n².' },
            ], x => `${x}`),
            solucion: { texto: `El nivel ${n} tiene ${n * n} orbitales con dos electrones cada uno.`, ecuacion: [`2 · ${n}² = ${2 * n * n}`] },
          };
        }
        const n = r.ent(2, 5), l = r.ent(0, Math.min(3, n - 1)), sub = `${n}${LETRA[l]}`;
        if (tipo === 0) return {
          pregunta: `¿Cuántos orbitales tiene el subnivel ${sub}?`,
          opciones: opciones(2 * l + 1, [
            { id: 'electrones', valor: 2 * (2 * l + 1), error: 'QM-ORBITAL-ELECTRON', siFuera: 'Esos son los electrones que caben. Cada orbital lleva dos.' },
            { id: 'n', valor: n, error: 'QM-N-L', siFuera: 'Eso es el nivel. Los orbitales dependen de l, no de n.' },
            { id: 'l', valor: l + 3, error: 'QM-N-L', siFuera: 'Los orbitales son 2l + 1, uno por cada valor de mₗ.' },
          ], x => `${x}`),
          solucion: { texto: `${LETRA[l]} es l = ${l}; mₗ va de −${l} a +${l}.`, ecuacion: [`2 · ${l} + 1 = ${2 * l + 1}`] },
        };
        return {
          pregunta: `¿Cuántos electrones caben, como máximo, en el subnivel ${sub}?`,
          opciones: opciones(2 * (2 * l + 1), [
            { id: 'orbitales', valor: 2 * l + 1, error: 'QM-ORBITAL-ELECTRON', siFuera: 'Esos son los orbitales. En cada uno caben dos electrones.' },
            { id: 'nivel', valor: 2 * n * n, error: 'QM-N-L', siFuera: 'Eso cabe en todo el nivel, no en un solo subnivel.' },
            { id: 'ocho', valor: 8, error: 'QM-OCTETO-NIVEL', siFuera: 'Ocho es el octeto de valencia, no la capacidad de un subnivel.' },
          ], x => `${x}`),
          solucion: { texto: `${LETRA[l]} tiene ${2 * l + 1} orbitales, con dos electrones cada uno.`, ecuacion: [`2 · (2 · ${l} + 1) = ${2 * (2 * l + 1)}`] },
        };
      },
    },
  };

  // ---------- Idea 4: configuración de átomos e iones ----------
  // Cambia: el número de electrones · Permanece: el orden de llenado 1s 2s 2p 3s 3p 4s · Progresa: de llenar un
  // átomo a ganar electrones (anión) y a perderlos (catión) · Se reserva: el 4s que sale antes que el 3d · Debe verse:
  // qué subnivel recibe o pierde cada electrón.
  const configuracion = {
    id: 'configuracion-electronica',
    titulo: 'Dónde va cada electrón',
    temas: ['Configuración electrónica de átomos e iones'],
    pieza: 'quim-cajas',
    juega: {
      consigna: 'Cambia el número de electrones del átomo neutro. Mira en qué subnivel entra cada electrón nuevo.',
      voz: 'Fíjate qué pasa al llegar a 19.',
      controles: [{ id: 'z', etiqueta: 'Z', color: 'c-h', min: 1, max: 20, paso: 1, inicio: 6, decimales: 0 }],
      dibujo: v => ({ datos: { filas: filasConfig(config(v.z)) }, estado: {} }),
      lectura: v => [Z, ` = ${v.z} (${SIMB[v.z]}): ${textoConfig(config(v.z))}`],
      minimo: 4,
    },
    predice: {
      pregunta: 'El hierro es [Ar] 4s² 3d⁶. Al formar el ion Fe²⁺ pierde dos electrones. ¿De qué subnivel salen?',
      voz: 'Anota tu predicción; aquí el orden de salida importa.',
      opciones: [
        { id: 'c', texto: 'Del 4s: queda [Ar] 3d⁶', correcta: true },
        { id: 'ultimo', texto: 'Del 3d, el último en llenarse: [Ar] 4s² 3d⁴', error: 'QM-ULTIMO', siFuera: 'El 3d se llena después, cierto. Pero al quitar, sale primero el nivel n = 4, el más externo.' },
        { id: 'reparte', texto: 'Uno de cada uno: [Ar] 4s¹ 3d⁵', error: 'QM-REPARTE', siFuera: 'Sería así si salieran parejos. Salen primero los del nivel más alto, el 4s.' },
      ],
      dibujo: { datos: { filas: [{ nombre: '4s', e: 2, cajas: 1 }, { nombre: '3d', e: 6, cajas: 5 }], rotulo: 'Fe: [Ar] más estos' }, estado: {} },
      revelar: { datos: { filas: [{ nombre: '4s', e: 2, cajas: 1, sale: 2 }, { nombre: '3d', e: 6, cajas: 5 }], rotulo: 'Fe²⁺: [Ar] 3d⁶' }, estado: {} },
      coincide: 'Coincide: salen primero los del nivel más externo, el 4s.',
      noCoincide: 'Los dos electrones salen del 4s, el nivel más externo.',
    },
    mira: {
      datos: { filas: [
        { nombre: '1s', e: 2, cajas: 1, desde: 1 }, { nombre: '2s', e: 2, cajas: 1, desde: 2 }, { nombre: '2p', e: 6, cajas: 3, desde: 2 },
        { nombre: '3s', e: 2, cajas: 1, desde: 3 }, { nombre: '3p', e: 4, cajas: 3, desde: 3 }, { nombre: 'S²⁻', e: 6, cajas: 3, desde: 4, color: 'o' },
      ] },
      voz: 'Llenemos el azufre electrón por electrón.',
      pasos: [
        { estado: { corte: 1 }, texto: 'Primero se llena el subnivel de menor energía, el 1s.', ecuacion: ['1s²'] },
        { estado: { corte: 2 }, texto: 'Después el 2s y el 2p: el nivel 2 se completa con 8.', ecuacion: ['2s² 2p⁶'] },
        { estado: { corte: 3 }, texto: 'El azufre tiene 16 electrones: quedan 4 para el 3p.', ecuacion: ['S: 1s² 2s² 2p⁶ 3s² 3p⁴'] },
        { estado: { corte: 4 }, texto: 'El S²⁻ gana dos electrones: completa el 3p, como el argón.', ecuacion: ['S²⁻: 1s² 2s² 2p⁶ 3s² 3p⁶'] },
        { estado: { corte: 4 }, texto: 'En un catión salen primero los del n más alto: 4s antes que 3d.' },
      ],
    },
    regla: {
      texto: 'Los subniveles se llenan en orden de energía: 1s 2s 2p 3s 3p 4s 3d 4p. Un anión suma electrones; un catión pierde primero los del n más alto.',
      ecuacion: [e, ' = ', Z, ' − carga'],
      condicion: 'en estado fundamental. Hay excepciones verificadas: el Cr y el Cu pasan un electrón del 4s al 3d.',
      voz: 'Cuenta los electrones antes de escribir la configuración.',
    },
    ahoraTu: {
      voz: 'Cuenta primero los electrones de la especie.',
      generar(s) {
        const LISTA = [[7, 0], [8, 0], [11, 0], [13, 0], [15, 0], [16, 0], [19, 0], [20, 0], [11, 1], [12, 2], [13, 3], [8, -2], [9, -1], [16, -2], [17, -1], [19, 1], [20, 2], [7, -3]];
        const [z, q] = LISTA[s % LISTA.length], el = z - q, sim = `${SIMB[z]}${carga(q)}`;
        const tres = n => { const c = config(n); return n >= 19 ? textoConfig(c.filter(x => x[0] !== '4s').concat([['3d', n - 18]])) : null; };
        return {
          pregunta: ['¿Cuál es la configuración electrónica del ', sim, ' (', Z, ` = ${z})?`],
          opciones: opciones(textoConfig(config(el)), [
            q ? { id: 'neutro', valor: textoConfig(config(z)), error: 'QM-CARGA-E', siFuera: 'Esa es la del átomo neutro. La carga cambia el número de electrones.' } : {},
            q ? { id: 'signo', valor: textoConfig(config(z + q)), error: 'QM-CARGA-E', siFuera: 'Eso aplica la carga al revés: positivo es perder electrones.' } : {},
            el >= 19 ? { id: '3d', valor: tres(el), error: 'QM-3D-ANTES', siFuera: 'El 3d viene después del 4s al llenar; el 4s tiene menos energía.' } : {},
            { id: 'mas', valor: textoConfig(config(el + 1)), error: 'QM-CUENTA', siFuera: 'Esa tiene un electrón de más. Cuenta de nuevo los superíndices.' },
            { id: 'menos', valor: textoConfig(config(el - 1)), error: 'QM-CUENTA', siFuera: 'Esa tiene un electrón de menos. Cuenta de nuevo los superíndices.' },
          ], x => x),
          solucion: { texto: `${sim} tiene ${el} electrones; se llenan en orden de energía.`, ecuacion: [`${sim}: ${textoConfig(config(el))}`] },
        };
      },
    },
  };

  // ---------- Idea 5: electrones solos e isoelectrónicos ----------
  // Cambia: la especie · Permanece: las cajas de valencia y la marca de los desapareados · Progresa: de 3 a 0
  // desapareados; de O²⁻ a Mg²⁺ con los mismos 10 electrones · Se reserva: el tamaño de los isoelectrónicos (se
  // predice en la recta) · Debe verse: las cajas con una sola flecha y el radio que baja con Z.
  const VALENCIA = {
    C: { filas: [['2s', 2, 1], ['2p', 2, 3]], d: 2 }, N: { filas: [['2s', 2, 1], ['2p', 3, 3]], d: 3 }, O: { filas: [['2s', 2, 1], ['2p', 4, 3]], d: 2 },
    F: { filas: [['2s', 2, 1], ['2p', 5, 3]], d: 1 }, Ne: { filas: [['2s', 2, 1], ['2p', 6, 3]], d: 0 }, 'Fe²⁺': { filas: [['4s', 0, 1], ['3d', 6, 5]], d: 4 },
    Mg: { filas: [['3s', 2, 1], ['3p', 0, 3]], d: 0 }, P: { filas: [['3s', 2, 1], ['3p', 3, 3]], d: 3 }, S: { filas: [['3s', 2, 1], ['3p', 4, 3]], d: 2 },
    Cl: { filas: [['3s', 2, 1], ['3p', 5, 3]], d: 1 }, 'Mn²⁺': { filas: [['4s', 0, 1], ['3d', 5, 5]], d: 5 }, 'Zn²⁺': { filas: [['4s', 0, 1], ['3d', 10, 5]], d: 0 }, B: { filas: [['2s', 2, 1], ['2p', 1, 3]], d: 1 },
  };
  const cajasValencia = k => ({ datos: { filas: VALENCIA[k].filas.map(([nombre, e, cajas]) => ({ nombre, e, cajas })), desapareados: true, rotulo: `${VALENCIA[k].d} desapareados · ${VALENCIA[k].d ? 'paramagnético' : 'diamagnético'}` }, estado: {} });
  // Radios iónicos de Shannon (1976), NC 6, en pm.
  const ISO10 = [['O²⁻', 8, 140], ['F⁻', 9, 133], ['Na⁺', 11, 102], ['Mg²⁺', 12, 72], ['Al³⁺', 13, 53.5]];
  const ISO18 = [['S²⁻', 16, 184], ['Cl⁻', 17, 181], ['K⁺', 19, 138], ['Ca²⁺', 20, 100]];
  const rectaRadios = (lista, desde = false) => ({
    min: 40, max: 150, paso: 10, cada: 2, sufijo: ' pm', decimales: 1, variable: 'r (pm)', filas: 2,
    elementos: lista.map(([s, z, r], i) => ({ tipo: 'punto', x: r, rotulo: `${s} (${z} p)`, fila: 1 + (i % 2), desde: desde ? i + 1 : 0 })),
    alt: `Radios iónicos (Shannon, en pm) de especies con 10 electrones: ${lista.map(([s, z, r]) => `${s} con ${z} protones, ${f(r, 1)} pm`).join('; ')}.`,
  });
  const ISO_PRED = ISO10.slice(0, 4);
  const desapareados = {
    id: 'desapareados-isoelectronicos',
    titulo: 'Electrones solos e isoelectrónicos',
    temas: ['Paramagnetismo y especies isoelectrónicas'],
    pieza: 'quim-cajas',
    juega: {
      consigna: 'Elige una especie y mira sus cajas de valencia. Las cajas marcadas tienen un electrón solo, sin pareja.',
      voz: 'Cuenta solo las cajas marcadas.',
      controles: [{ id: 'k', etiqueta: 'Especie', opciones: ['N', 'O', 'F', 'Ne', 'Fe²⁺'].map(k => ({ valor: k, texto: k })) }],
      dibujo: v => cajasValencia(v.k),
      lectura: v => [`${v.k}: ${VALENCIA[v.k].d} desapareados · ${VALENCIA[v.k].d ? 'lo atrae un imán' : 'un imán no lo atrae'}`],
      minimo: 3,
    },
    predice: {
      pieza: 'recta',
      pregunta: 'O²⁻, F⁻, Na⁺ y Mg²⁺ tienen 10 electrones cada uno. ¿Cuál de los cuatro es el más pequeño?',
      voz: 'Mismos electrones; mira qué cambia en el núcleo.',
      opciones: [
        { id: 'c', texto: 'Mg²⁺', correcta: true },
        { id: 'iguales', texto: 'Los cuatro miden lo mismo', error: 'QM-ISO-RADIO', siFuera: 'Tienen los mismos electrones, cierto. Pero el núcleo atrae distinto: hay de 8 a 12 protones.' },
        { id: 'o', texto: 'O²⁻, porque tiene menos protones', error: 'QM-ISO-ORDEN', siFuera: 'Menos protones atraen menos a los mismos 10 electrones: el O²⁻ es el más grande.' },
        { id: 'na', texto: 'Na⁺, porque perdió un electrón', error: 'QM-ISO-ORDEN', siFuera: 'Perdió un electrón, cierto. El Mg²⁺ tiene los mismos 10 electrones y un protón más.' },
      ],
      dibujo: { datos: Object.assign(rectaRadios([]), { alt: 'Recta de radios en pm, todavía sin especies.' }), estado: {} },
      revelar: { datos: rectaRadios(ISO_PRED), estado: {} },
      coincide: 'Coincide: con 12 protones, el Mg²⁺ atrae más a los mismos electrones.',
      noCoincide: 'El de más protones atrae más a los mismos 10 electrones: el Mg²⁺.',
    },
    mira: {
      pieza: 'recta',
      datos: rectaRadios(ISO10, true),
      voz: 'Ubiquemos los cinco en la recta, en orden de protones.',
      pasos: [
        { estado: { corte: 1 }, texto: 'O²⁻: 8 protones para 10 electrones.', ecuacion: ['r = 140 pm'] },
        { estado: { corte: 2 }, texto: 'F⁻: un protón más, los mismos electrones.', ecuacion: ['r = 133 pm'] },
        { estado: { corte: 3 }, texto: 'Na⁺: 11 protones jalan más fuerte.', ecuacion: ['r = 102 pm'] },
        { estado: { corte: 5 }, texto: 'Mg²⁺ y Al³⁺: más protones, más pequeños todavía.', ecuacion: ['r = 72 pm y 53,5 pm'] },
        { estado: { corte: 5 }, texto: 'Las cajas de los cinco son iguales: 1s² 2s² 2p⁶, sin desapareados.' },
      ],
    },
    regla: {
      texto: 'Con electrones desapareados, la especie es paramagnética; con todos apareados, diamagnética. Isoelectrónicas: mismos electrones; la de más protones es la más pequeña.',
      condicion: 'Hund: los electrones ocupan cajas vacías antes de aparearse. Los radios se comparan en una misma escala (aquí, Shannon).',
      voz: 'Cajas con una flecha sola: ahí está el paramagnetismo.',
    },
    ahoraTu: {
      voz: 'Cuenta las cajas con una sola flecha.',
      generar(s) {
        const r = azar(s);
        if (s % 3 === 2) {
          const serie = r.de([ISO10, ISO18]).slice();
          const tres = serie.filter((_, i) => i !== r.ent(0, serie.length - 1)).slice(0, 3);
          const menor = tres.reduce((a, b) => (b[1] > a[1] ? b : a)), mayor = tres.reduce((a, b) => (b[1] < a[1] ? b : a));
          return {
            pregunta: `${tres.map(x => x[0]).join(', ')} tienen los mismos electrones. ¿Cuál es el más pequeño?`,
            opciones: [
              { id: 'c', texto: menor[0], correcta: true },
              { id: 'mayor', texto: mayor[0], error: 'QM-ISO-ORDEN', siFuera: 'Ese tiene menos protones para los mismos electrones: es el más grande.' },
              { id: 'iguales', texto: 'Miden lo mismo', error: 'QM-ISO-RADIO', siFuera: 'Mismos electrones no es mismo tamaño: el núcleo de cada uno atrae distinto.' },
            ],
            solucion: { texto: `${menor[0]} tiene ${menor[1]} protones: atrae más a los mismos electrones.` },
          };
        }
        const k = r.de(Object.keys(VALENCIA)), d = VALENCIA[k].d, txt = n => `${n}: ${n ? 'paramagnético' : 'diamagnético'}`;
        const totalE = VALENCIA[k].filas.reduce((a, x) => a + x[1], 0);
        return {
          pregunta: `Estas son las cajas de valencia del ${k}. ¿Cuántos electrones desapareados tiene y cómo responde a un imán?`,
          dibujo: { datos: { filas: VALENCIA[k].filas.map(([nombre, e, cajas]) => ({ nombre, e, cajas })) }, estado: {} },
          opciones: opciones(txt(d), [
            { id: 'par', valor: txt(totalE % 2), error: 'QM-HUND', siFuera: 'Eso aparea los electrones antes de llenar las cajas vacías. Hund dice lo contrario.' },
            { id: 'uno-mas', valor: txt(d + 1), error: 'QM-CUENTA', siFuera: 'Cuenta solo las cajas con una flecha.' },
            { id: 'cero', valor: txt(0), error: 'QM-HUND', siFuera: 'Sería diamagnético si todas las cajas tuvieran dos flechas.' },
            { id: 'todos', valor: txt(totalE), error: 'QM-HUND', siFuera: 'Eso cuenta todos los electrones de valencia, no solo los que están solos.' },
          ], x => x),
          solucion: { texto: `Por Hund quedan ${d} cajas con una sola flecha.`, ecuacion: [`${k}: ${txt(d)}`], dibujo: { datos: { filas: VALENCIA[k].filas.map(([nombre, e, cajas]) => ({ nombre, e, cajas })), desapareados: true }, estado: {} } },
        };
      },
    },
  };

  return {
    unidad: 'quimica.estructura-atomica',
    version: '0.1.0',
    estado: 'completa',
    requiere: ['/nucleo/kit/piezas/quim-atomo.js', '/nucleo/kit/piezas/quim-cadena.js', '/nucleo/kit/piezas/quim-cajas.js', '/nucleo/kit/piezas/recta.js'],
    historia: {
      texto: 'Desde 1808, John Dalton explicó las proporciones de combinación con átomos de masa propia; algunas de sus fórmulas estaban equivocadas. En 1911, la dispersión de partículas alfa llevó a Rutherford al núcleo, y en 1913 Bohr propuso niveles de energía. El modelo actual no es una foto: es la descripción que mejor explica las evidencias que tenemos.',
      pregunta: '¿Cómo sabes qué hay dentro de algo que no puedes ver?',
      fuente: { titulo: 'OpenStax, Chemistry 2e, §2.3', url: 'https://openstax.org/books/chemistry-2e/pages/2-3-atomic-structure-and-symbolism' },
    },
    ideas: [nucleo, modelos, cuanticos, configuracion, desapareados],
  };
});
