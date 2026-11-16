/*
 * Teoría de «Soluciones» (quimica.soluciones). Molde: docs/teoria.md y contenido/teoria/quimica/materia-y-energia.js.
 * Compañera: Bruna (castora), voz resolutiva y cálida.
 * Fuente del contenido: docs/teoria/matriz/quimica.json (unidad 11), docs/teoria/fuentes/historia-ecuaciones-1.pdf y
 * la «cápsula de cantidad y concentración» del expediente (teoria-152-unidades.txt): 100 mL de 0,20 mol/L tienen
 * 0,020 mol; diluir hasta 250 mL conserva n y da 0,080 mol/L; retirar 40 mL deja 0,012 mol a la misma c.
 * Errores: docs/investigacion/gases-soluciones-ideas-erroneas.md (SO), estequiometria (ES); los QM- son hipótesis.
 *
 * Ficha de tarea (diseno-y-animacion)
 *   Promesa: separar cantidad de soluto, volumen y concentración, y usarlas para diluir, mezclar y reaccionar.
 *   Persona y condiciones: postulante de 4.º–5.º, celular de gama baja a 360 px, sin audio, a veces sin conexión.
 *   Resultado observable: clasifica un sistema disperso, lee una curva de solubilidad, calcula M, %, N y molalidad,
 *     predice qué cambia al diluir o al retirar una parte y resuelve una neutralización con n = c·V.
 *   Orden de atención: 1.º el vaso (partículas de soluto y nivel) · 2.º la lectura en vivo · acción: probar casos.
 *   Estados: juego sin tocar · casos probados · predicción abierta · revelado · paso a paso · caso nuevo · acierto · «No sé».
 *   Duda que resuelve: ¿retirar la mitad baja la concentración?, ¿agitar disuelve más?, ¿más moles es más concentrado?
 *
 * Colores (regla 4): n cantidad de soluto naranja c-o (también las bolitas de soluto), V volumen turquesa c-i (el nivel
 * del vaso), c concentración rojo c-h, m masa de soluto verde c-d. El agua no se dibuja: el vaso tintado es la solución.
 * Datos de solubilidad (g en 100 g de agua): valores redondeados de tablas usuales (CRC); no verificados contra una
 * edición concreta. Fuentes (no van al alumno): OpenStax Chemistry 2e §3.3 y §11.3.
 */
(function (root, fabrica) {
  const def = fabrica(typeof module === 'object' && module.exports ? require('../../../nucleo/kit/kit.js') : root.Kit);
  if (typeof module === 'object' && module.exports) module.exports = def;
  else root.Teoria.unidad(def);
})(typeof self !== 'undefined' ? self : this, function (Kit) {
  'use strict';
  const f = (n, d = 2) => Kit.formatear(n, d);
  const n = { v: 'c-o', t: 'n' }, V = { v: 'c-i', t: 'V' }, c = { v: 'c-h', t: 'c' }, m = { v: 'c-d', t: 'm' };
  const n1 = { sub: [n, '1'] }, V1 = { sub: [V, '1'] }, V2 = { sub: [V, '2'] }, c1 = { sub: [c, '1'] }, c2 = { sub: [c, '2'] };
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
      const txt = fmt(d.valor);
      if (vistos.has(txt) || !Number.isFinite(d.valor)) continue;
      vistos.add(txt);
      ops.push({ id: d.id, texto: txt, error: d.error, siFuera: d.siFuera });
    }
    return ops.slice(0, 4);
  }
  const fijo = (x, d) => Math.round(x * 10 ** d) / 10 ** d;

  // ---------- Partículas de la unidad ----------
  const ATOMOS = { S: { color: 'o', estilo: 'lleno', r: 5 }, B: { color: 'd', estilo: 'punto', r: 5 }, A: { color: 'o', estilo: 'lleno', r: 5 }, H: { color: 'o', estilo: 'lleno', r: 5 }, OH: { color: 'd', estilo: 'hueco', r: 5.5 }, W: { estilo: 'hueco', r: 5 } };
  const ESPECIES = {
    ion: [['S', 0, 0]],
    coloide: [['B', 0, -5], ['B', -5, 2], ['B', 5, 2], ['B', 0, 6]],
    grumo: [['B', -6, -6], ['B', 0, -7], ['B', 6, -6], ['B', -8, 0], ['B', 0, 0], ['B', 8, 0], ['B', -5, 6], ['B', 5, 6]],
    H: [['H', 0, 0]], OH: [['OH', 0, 0]], agua: [['W', -4, 0], ['W', 4, 0]],
  };
  const lupa = (cajas, extra = {}) => ({ datos: Object.assign({ atomos: ATOMOS, especies: ESPECIES, alto: 150, separacion: 22, cajas }, extra), estado: {} });
  // Gesto directo: la superficie del líquido de la caja k está en r.y − 4 (quim-particulas: region); el nivel es la
  // fracción del alto útil. Con esto se agarra el nivel de cualquier vaso.
  const PZ = () => Kit.piezas['quim-particulas'];
  const superficie = (dib, k = 0) => { const g = PZ().geometria(dib.datos), r = PZ().region(dib.datos.cajas[k], g, k); return { x: g.x(k) + g.ancho / 2, y: r.y - 4 }; };
  const nivelEn = (dib, y) => { const g = PZ().geometria(dib.datos); return (g.y1 - y) / (g.alto - 8); };
  const EJ = d => Kit.piezas.ejes.geometria(d);
  const xyEn = (d, pt) => { const g = EJ(d); return { x: d.x.min + (pt.x - g.X(d.x.min)) * (d.x.max - d.x.min) / (g.X(d.x.max) - g.X(d.x.min)), y: d.y.min + (pt.y - g.Y(d.y.min)) * (d.y.max - d.y.min) / (g.Y(d.y.max) - g.Y(d.y.min)) }; };
  function rejilla(e, k, cols, x0, x1, y0, y1, extra = {}) {
    const filas = Math.ceil(k / cols), out = [];
    for (let i = 0; i < k; i++) {
      const cc = i % cols, fl = Math.floor(i / cols);
      out.push(Object.assign({ e, n: 1, x: x0 + (x1 - x0) * (cols === 1 ? 0.5 : cc / (cols - 1)), y: y0 + (y1 - y0) * (filas === 1 ? 0.5 : fl / (filas - 1)) }, extra));
    }
    return out;
  }

  // ---------- Idea 1: solución, coloide o suspensión ----------
  // Cambia: el tamaño de lo disperso · Permanece: el vaso, la lupa y la cantidad de agua · Progresa: de iones sueltos a
  // grumos que se asientan · Se reserva: el reposo (la suspensión cae al fondo; las otras no) · Debe verse: que lo
  // disuelto sigue ahí aunque no se vea.
  const SISTEMAS = {
    solucion: { texto: 'Solución', e: 'ion', k: 12, lee: 'Iones sueltos, menos de 1 nm: no se asientan ni se filtran.' },
    coloide: { texto: 'Coloide', e: 'coloide', k: 6, lee: 'Grupitos de 1 a 1000 nm: no se asientan, desvían la luz.' },
    suspension: { texto: 'Suspensión', e: 'grumo', k: 4, lee: 'Grumos de más de 1000 nm: se asientan y se filtran.' },
  };
  // Animación (decisión de Gerson, 15 nov: química se mueve sola). Una hora de reposo en 6 s. Los grumos de la
  // suspensión caen a rapidez constante (rapidez terminal) y tocan el fondo a los 30 min; lo disuelto y el coloide solo
  // tiemblan (agitación térmica), nunca bajan. Modelo cualitativo: los 30 min son ilustrativos, no un dato.
  const BAJA = 30, Y0 = [0.18, 0.42, 0.28, 0.56], FONDO = 0.86;
  const altura = (j, tt) => Math.min(FONDO, Y0[j] + (FONDO - Y0[j]) * tt / BAJA);
  const enFondo = (k, tt) => k === 'suspension' && tt >= BAJA;
  const vasoReposo = (k, tt) => {
    const S = SISTEMAS[k];
    const parts = k === 'suspension' ? Y0.map((y, j) => ({ e: 'grumo', n: 1, x: 0.1 + 0.8 * j / 3, y: altura(j, tt) })) : [{ e: S.e, n: S.k }];
    return lupa([{ titulo: `${S.texto}, ${f(tt, 0)} min quieto`, forma: 'vaso', nivel: 0.9, particulas: parts }], { separacion: 26, agita: enFondo(k, tt) ? undefined : tt / 10, agitaAmp: 2 });
  };
  const leeReposo = (k, tt) => (k === 'suspension' ? (enFondo(k, tt) ? 'Los grumos ya están en el fondo.' : 'Los grumos van cayendo al fondo.') : k === 'coloide' ? 'Los grupitos siguen repartidos: no caen.' : 'Los iones siguen repartidos: no caen.');
  // El tamaño de lo disperso, por sistema: lo usan «Ahora tú» y «Así se resuelve» (mismas listas, otras semillas).
  const TAM = { solucion: [0.2, 0.3, 0.5, 0.8], coloide: [5, 20, 50, 200, 500], suspension: [2000, 5000, 10000, 50000] };
  const NOM_SIS = { solucion: 'Solución', coloide: 'Coloide', suspension: 'Suspensión' };
  const LIMITES = ['solución < 1 nm', '   ·   ', 'coloide 1–1000 nm', '   ·   ', 'suspensión > 1000 nm'];
  const dispersos = {
    id: 'sistemas-dispersos',
    titulo: 'Solución, coloide o suspensión',
    temas: ['Sistemas dispersos: soluciones, coloides y suspensiones'],
    pieza: 'quim-particulas',
    // Lee (fase 2): contexto y la escala de tamaños, sin decir qué pasa por el filtro (eso se predice).
    lee: {
      tarjetas: [
        { titulo: 'Mezclas de todos los días', texto: 'En una mañana en Juliaca hay de todo: el té con azúcar, la leche del desayuno y el agua del río Coata, que baja turbia después de la lluvia. Las tres son agua con algo repartido dentro.' },
        { titulo: 'Tamaños muy pequeños', texto: 'Lo repartido puede ser tan pequeño como un ion o tan grande como un grano de arena fina. Para medirlo se usa el nanómetro: un millón de nanómetros caben en un milímetro.',
          ecuacion: [`1 nm = ${f(1e-6, 6)} mm`] },
        { titulo: 'Qué mirar', texto: 'En el juego, el vaso se queda quieto una hora en pocos segundos. Elige cada sistema y mira si lo repartido baja al fondo o sigue en su sitio.' },
      ],
    },
    juega: {
      consigna: 'El vaso queda en reposo: una hora pasa en 6 segundos. Elige un sistema y mira si lo disperso cae al fondo.',
      voz: 'Mira el tamaño de lo que flota. Eso decide el nombre.',
      controles: [
        { id: 'k', etiqueta: 'Sistema', opciones: Object.keys(SISTEMAS).map(x => ({ valor: x, texto: SISTEMAS[x].texto })) },
        { id: 't', etiqueta: 't', color: 'c-h', min: 0, max: 60, paso: 5, inicio: 0, unidad: 'min', decimales: 0, auto: { velocidad: 10 } },
      ],
      dibujo: val => vasoReposo(val.k, val.t),
      lectura: val => [`${f(val.t, 0)} min en reposo · ${leeReposo(val.k, val.t)}`],
      minimo: 3,
    },
    predice: {
      pregunta: 'Disuelves sal en agua hasta que ya no se ve ningún grano. Pasas la mezcla por un papel de filtro. ¿Qué pasa con la sal?',
      voz: 'Piensa en el tamaño de lo que hay en el agua.',
      opciones: [
        { id: 'c', texto: 'Atraviesa el filtro junto con el agua', correcta: true },
        { id: 'retiene', texto: 'Se queda en el papel', error: 'QM-FILTRO', siFuera: 'El papel retiene granos y grumos grandes. Los iones disueltos son miles de veces más chicos.' },
        { id: 'desaparece', texto: 'Ya no hay sal: desapareció', error: 'SO2', siFuera: 'No se ve, es cierto. Pero sigue ahí: el agua del filtrado sabe salada.' },
        { id: 'fondo', texto: 'Se junta en el fondo del vaso', error: 'SO1', siFuera: 'Eso pasa en una suspensión. En una solución los iones no se asientan.' },
      ],
      dibujo: lupa([{ titulo: 'Agua salada', forma: 'vaso', nivel: 0.9, particulas: [] }, { titulo: 'Filtrado', forma: 'vaso', nivel: 0.7, particulas: [] }], { flechas: true }),
      revelar: lupa([{ titulo: 'Agua salada', forma: 'vaso', nivel: 0.9, particulas: [{ e: 'ion', n: 10 }] }, { titulo: 'Filtrado', forma: 'vaso', nivel: 0.7, particulas: [{ e: 'ion', n: 8 }] }], { flechas: true }),
      coincide: 'Coincide: los iones son tan chicos que pasan por los poros del papel.',
      noCoincide: 'La lupa muestra iones en el filtrado: la sal pasó con el agua.',
    },
    mira: {
      datos: lupa([
        { titulo: 'Solución', forma: 'vaso', nivel: 0.9, particulas: [{ e: 'ion', n: 8, desde: 1 }] },
        { titulo: 'Coloide', forma: 'vaso', nivel: 0.9, particulas: [{ e: 'coloide', n: 4, desde: 2 }] },
        { titulo: 'Suspensión', forma: 'vaso', nivel: 0.9, particulas: [{ e: 'grumo', n: 2, desde: 3, hasta: 3 }, ...rejilla('grumo', 2, 2, 0.25, 0.75, 0.86, 0.86, { desde: 4 })] },
      ], { separacion: 26 }).datos,
      voz: 'Comparemos los tres vasos de izquierda a derecha.',
      pasos: [
        { estado: { corte: 1 }, texto: 'Solución: iones o moléculas sueltas, menores de 1 nm.', ecuacion: ['transparente; pasa el filtro'] },
        { estado: { corte: 2 }, texto: 'Coloide: grupitos de 1 a 1000 nm que no caen.', ecuacion: ['desvía un haz de luz (efecto Tyndall)'] },
        { estado: { corte: 3 }, texto: 'Suspensión: grumos de más de 1000 nm, recién agitados.', ecuacion: ['turbia; el filtro la retiene'] },
        { estado: { corte: 4 }, texto: 'En reposo, solo la suspensión se asienta en el fondo.' },
      ],
    },
    regla: {
      texto: 'Lo disperso se clasifica por tamaño: en la solución son moléculas o iones; en el coloide, grupitos que no se asientan; en la suspensión, grumos que caen y se filtran.',
      ecuacion: ['solución < 1\u00a0nm', '   ·   ', 'coloide 1–1000\u00a0nm', '   ·   ', 'suspensión > 1000\u00a0nm'],
      condicion: 'transparente no significa sin soluto: lo disuelto sigue en el agua aunque no se vea.',
      voz: 'Que no se vea no quiere decir que no esté.',
    },
    // Así se resuelve (fase 2): el mismo tipo de «Ahora tú» (clasificar por tamaño), con otras semillas.
    resuelve: {
      generar(s) {
        const r = azar(s + 900), tipo = ['solucion', 'coloide', 'suspension'][s % 3], tam = r.de(TAM[tipo]);
        const comp = tipo === 'solucion' ? `${f(tam, 1)} nm < 1 nm` : tipo === 'coloide' ? `1 nm < ${f(tam, 1)} nm < 1000 nm` : `${f(tam, 1)} nm > 1000 nm`;
        const sentido = {
          solucion: 'Menos de 1 nm es el tamaño de iones y moléculas sueltas: por eso se ve transparente y no se asienta en reposo.',
          coloide: 'Son grupitos de muchas moléculas: no caen al fondo, pero un haz de luz que los cruza se ve como una franja.',
          suspension: `${f(tam, 1)} nm son ${f(tam / 1000, 0)} µm: grumos que en reposo caen al fondo y que el filtro retiene.`,
        }[tipo];
        return {
          enunciado: `Lo disperso en un líquido mide unos ${f(tam, 1)} nm. ¿Es una solución, un coloide o una suspensión?`,
          pasos: [
            { tipo: 'pide', texto: 'Piden el nombre del sistema disperso: solución, coloide o suspensión.' },
            { tipo: 'datos', texto: `Lo disperso mide unos ${f(tam, 1)} nm. No dicen el color ni si es transparente, y no hace falta.` },
            { tipo: 'regla', texto: 'El nombre lo decide el tamaño de lo repartido. Hay dos límites: 1 nm y 1000 nm.', ecuacion: LIMITES },
            { tipo: 'aplica', texto: `Comparo ${f(tam, 1)} nm con los dos límites.`, ecuacion: [comp] },
            { tipo: 'sentido', texto: sentido },
          ],
          respuesta: `Es ${tipo === 'solucion' ? 'una solución' : tipo === 'coloide' ? 'un coloide' : 'una suspensión'}.`,
        };
      },
    },
    ahoraTu: {
      voz: 'Usa el tamaño de las partículas.',
      generar(s) {
        const r = azar(s), tipo = ['solucion', 'coloide', 'suspension'][s % 3];
        const tam = r.de(TAM[tipo]);
        const nom = NOM_SIS;
        const si = { solucion: 'Sería solución si lo disperso midiera menos de 1 nm.', coloide: 'Sería coloide si midiera entre 1 y 1000 nm.', suspension: 'Sería suspensión si midiera más de 1000 nm.' };
        return {
          pregunta: `Lo disperso en un líquido mide unos ${f(tam, 1)} nm. ¿Qué sistema es?`,
          opciones: Object.keys(nom).map(k => (k === tipo ? { id: 'c', texto: nom[k], correcta: true } : { id: k, texto: nom[k], error: 'QM-DISPERSO', siFuera: si[k] })),
          solucion: { texto: `${f(tam, 1)} nm cae en el intervalo de ${nom[tipo].toLowerCase()}.`, ecuacion: ['solución < 1\u00a0nm', '   ·   ', 'coloide 1–1000\u00a0nm', '   ·   ', 'suspensión > 1000\u00a0nm'] },
        };
      },
    },
  };

  // ---------- Idea 2: la curva de solubilidad ----------
  // Cambia: la temperatura y la masa echada · Permanece: 100 g de agua y la curva del KNO₃ · Progresa: de por debajo
  // (cabe más) a por encima (sobra sólido) · Se reserva: enfriar una solución que estaba bien · Debe verse: la
  // distancia vertical entre el punto y la curva.
  const KNO3 = { 0: 13.3, 10: 20.9, 20: 31.6, 30: 45.8, 40: 63.9, 50: 85.5, 60: 110, 70: 138, 80: 169 };
  const NACL = { 0: 35.7, 20: 35.9, 40: 36.4, 60: 37.1, 80: 38 };
  const curvaDe = t => Object.entries(t).map(([T, s]) => [+T, s]);
  const ejesSol = (extra = {}) => Object.assign({
    x: { min: 0, max: 80, paso: 10, cada: 2, nombre: 'T', unidad: '°C', decimales: 0 },
    y: { min: 0, max: 180, paso: 30, nombre: 'm', unidad: 'g en 100 g de agua', decimales: 0, color: 'd' },
    curvas: [{ puntos: curvaDe(KNO3), rotulo: 'KNO₃', en: [72, 144] }, { puntos: curvaDe(NACL), discontinua: true, rotulo: 'NaCl', en: [70, 37] }],
    alt: 'Curvas de solubilidad en 100 g de agua: la del nitrato de potasio sube mucho con la temperatura (de 13 g a 0 °C a 169 g a 80 °C); la del cloruro de sodio casi no cambia (36 a 38 g).',
  }, extra);
  // Animación: la temperatura sube y baja sola (barrido de 0 a 80 °C). Entre dos filas de la tabla, la curva dibujada
  // es una recta; solT lee esa misma recta, así el punto y la lectura cuadran con lo que se ve.
  const solT = T => { const ts = Object.keys(KNO3).map(Number); for (let i = 0; i < ts.length - 1; i++) if (T <= ts[i + 1]) return KNO3[ts[i]] + (KNO3[ts[i + 1]] - KNO3[ts[i]]) * (T - ts[i]) / (ts[i + 1] - ts[i]); return KNO3[80]; };
  const ejesBarrido = val => {
    const sT = solT(val.T), sobra = val.m > sT;
    return ejesSol({
      curvas: [...ejesSol().curvas, ...(sobra ? [{ puntos: [[val.T, sT], [val.T, val.m]], color: 'h' }] : [])],
      puntos: [{ x: val.T, y: val.m, color: 'd', rotulo: `${f(val.m, 0)} g`, guias: true }, { x: val.T, y: sT, color: 'd', abierto: true }],
      alt: `Curvas de solubilidad; a ${f(val.T, 0)} °C caben ${f(sT, 1)} g de KNO₃ en 100 g de agua y se echaron ${f(val.m, 0)} g${sobra ? `: sobran ${f(val.m - sT, 1)} g` : ''}.`,
    });
  };
  // Los casos de «Ahora tú» y «Así se resuelve»: con q impar se echa una masa que pasa la curva; con q par, una solución
  // saturada se enfría. Las mismas cuentas para los dos momentos (regla 1).
  const TS = [10, 20, 30, 40, 50, 60, 70];
  const casoKNO3 = (r, q) => {
    const T = TS[q % TS.length], sT = KNO3[T];
    if (q % 2) return { sobra: true, T, sT, mm: 10 * Math.ceil((sT + r.ent(5, 40)) / 10) };
    const bajas = TS.filter(x => x < T), T2 = bajas[r.ent(0, bajas.length - 1)] || 0;
    return { sobra: false, T, sT, T2, s2: KNO3[T2] };
  };
  const solubilidad = {
    id: 'curva-solubilidad',
    titulo: 'Cuánto cabe en el agua',
    temas: ['Solubilidad y curvas de solubilidad'],
    pieza: 'ejes',
    // Lee (fase 2): qué es la solubilidad y cómo se lee la gráfica, sin decir qué pasa al enfriar (eso se predice).
    lee: {
      tarjetas: [
        { titulo: 'Hasta dónde cabe', texto: 'Si echas cucharadas de azúcar a una taza de agua, llega un momento en que ya no se disuelve más y el resto se queda en el fondo. Esa cantidad máxima se llama solubilidad.' },
        { titulo: 'Cómo se lee la gráfica', texto: 'El eje vertical da los gramos que caben en 100 g de agua; el horizontal, la temperatura. Hay una curva para cada sustancia: aquí, el KNO₃, que se usa como fertilizante, y la sal común.' },
        { titulo: 'Qué mirar', texto: 'En el juego, el punto verde es lo que echaste. Una solución que ya tiene todo lo que cabe está saturada. Mira de qué lado de la curva queda el punto en cada temperatura.' },
      ],
    },
    juega: {
      consigna: 'El agua con KNO₃ se calienta y se enfría sola. Mira cuándo el punto cruza la curva: la raya roja es lo que sobra.',
      voz: 'Bajo la curva cabe más; encima, sobra.',
      controles: [
        { id: 'T', etiqueta: 'T', min: 0, max: 80, paso: 10, inicio: 20, unidad: '°C', decimales: 0, auto: { velocidad: 16, modo: 'rebota' } },
        { id: 'm', etiqueta: 'm', color: 'c-d', min: 10, max: 150, paso: 10, inicio: 50, unidad: 'g', decimales: 0 },
      ],
      dibujo: val => ({ datos: ejesBarrido(val), estado: {} }),
      lectura: val => {
        const s = solT(val.T);
        return val.m <= s ? [`${f(val.T, 0)} °C: se disuelve todo; caben `, `${f(s - val.m, 1)} g más`] : [`${f(val.T, 0)} °C: se disuelven `, `${f(s, 1)} g; sobran ${f(val.m - s, 1)} g`];
      },
      minimo: 3,
      // El punto se arrastra en las dos direcciones: a los lados cambia la temperatura y hacia arriba la masa echada.
      // Se ve cuándo cruza la curva.
      arrastres: [{ id: 'punto', etiqueta: 'punto (temperatura, masa echada)', color: 'c-d',
        donde: val => { const g = EJ(ejesSol()); return { x: g.X(val.T), y: g.Y(val.m) }; },
        mover: pt => { const q = xyEn(ejesSol(), pt); return { T: q.x, m: q.y }; } }],
    },
    predice: {
      pregunta: 'A 60 °C, 100 g de agua tienen 100 g de KNO₃ disueltos. Se enfría hasta 20 °C. ¿Cuánto sólido aparece en el fondo?',
      voz: 'Ubica el punto antes y después de enfriar.',
      opciones: [
        { id: 'c', texto: `${f(100 - KNO3[20], 1)} g`, correcta: true },
        { id: 'cero', texto: '0 g: lo disuelto ya no sale', error: 'QM-ENFRIAR', siFuera: 'Sería cierto si a 20 °C cupieran 100 g. Ahí solo caben 31,6 g.' },
        { id: 'sol', texto: `${f(KNO3[20], 1)} g`, error: 'QM-SOLUB', siFuera: '31,6 g es lo que sigue disuelto a 20 °C. El sólido es lo que sobra.' },
        { id: 'todo', texto: '100 g: precipita todo', error: 'QM-ENFRIAR', siFuera: 'Sería todo si a 20 °C no se disolviera nada. Todavía caben 31,6 g.' },
      ],
      dibujo: { datos: ejesSol({ puntos: [{ x: 60, y: 100, color: 'd', rotulo: '100 g a 60 °C', guias: true }] }), estado: {} },
      revelar: { datos: ejesSol({ puntos: [{ x: 60, y: 100, color: 'd' }, { x: 20, y: 100, color: 'd', abierto: true }, { x: 20, y: KNO3[20], color: 'd', rotulo: `${f(KNO3[20], 1)} g` }], curvas: [...ejesSol().curvas, { puntos: [[20, KNO3[20]], [20, 100]], color: 'h', rotulo: `sobran ${f(100 - KNO3[20], 1)} g`, en: [20, 100] }] }), estado: {} },
      coincide: 'Coincide: a 20 °C solo caben 31,6 g; el resto se separa como sólido.',
      noCoincide: 'A 20 °C caben 31,6 g; lo que excede la curva queda sólido.',
    },
    mira: {
      datos: ejesSol({
        puntos: [{ x: 60, y: 100, color: 'd', guias: true, desde: 1 }, { x: 60, y: KNO3[60], color: 'd', rotulo: `${f(KNO3[60], 0)} g`, desde: 2 }, { x: 20, y: KNO3[20], color: 'd', rotulo: `${f(KNO3[20], 1)} g`, desde: 3 }],
        curvas: [...ejesSol().curvas, { puntos: [[20, KNO3[20]], [20, 100]], color: 'h', desde: 4 }],
      }),
      voz: 'Comparemos el punto con la curva en cada temperatura.',
      pasos: [
        { estado: { corte: 1 }, texto: 'A 60 °C hay 100 g disueltos en 100 g de agua.', ecuacion: [m, ' = 100 g'] },
        { estado: { corte: 2 }, texto: 'A 60 °C cabrían hasta 110 g: la solución no está saturada.', ecuacion: ['100 g < 110 g'] },
        { estado: { corte: 3 }, texto: 'A 20 °C la curva baja: solo caben 31,6 g.', ecuacion: ['máximo a 20 °C: 31,6 g'] },
        { estado: { corte: 4 }, texto: 'Lo que pasa de la curva se separa como sólido.', ecuacion: [`100 − 31,6 = ${f(100 - KNO3[20], 1)} g de sólido`] },
        { estado: { corte: 4 }, texto: 'La sal común casi no cambia: enfriar no la separa.' },
      ],
    },
    regla: {
      texto: 'La curva da la masa máxima que se disuelve en 100 g de agua a cada temperatura. Bajo la curva cabe más; lo que la pasa queda sin disolver.',
      ecuacion: [{ llave: ['sólido'], nota: 'lo que sobra' }, ' = ', { llave: [m], nota: 'lo echado', color: 'c-d' }, ' − ', { llave: [{ sub: ['s', 'T'] }], nota: 'la curva' }],
      condicion: 'es un límite de equilibrio: agitar o moler acelera la disolución pero no cambia el máximo.',
      voz: 'Agitar apura, pero no hace caber más.',
    },
    resuelve: {
      pieza: 'ejes',
      generar(s) {
        const q = s + 900, C = casoKNO3(azar(q), q), T = C.T, sT = C.sT;
        if (C.sobra) {
          const mm = C.mm, x = mm - sT;
          return {
            enunciado: ['Echas ', m, ` = ${f(mm, 0)} g de KNO₃ en 100 g de agua a ${f(T, 0)} °C y agitas hasta que nada cambia. ¿Cuánto queda sin disolver?`],
            dibujo: { datos: ejesSol({ puntos: [{ x: T, y: mm, color: 'd', rotulo: `${f(mm, 0)} g`, guias: true }] }), estado: {} },
            pasos: [
              { tipo: 'pide', texto: 'Piden la masa de KNO₃ que se queda sólida en el fondo.' },
              { tipo: 'datos', texto: [m, ` = ${f(mm, 0)} g echados en 100 g de agua, a ${f(T, 0)} °C.`] },
              { tipo: 'regla', texto: 'La curva marca lo máximo que cabe a cada temperatura. Lo que echo por encima de la curva queda sólido, por más que agite.' },
              { tipo: 'cuentas', texto: `Leo la curva a ${f(T, 0)} °C: caben ${f(sT, 1)} g. Resto lo echado menos lo que cabe.`,
                ecuacion: [m, ` − ${f(sT, 1)} = ${f(mm, 0)} − ${f(sT, 1)} = ${f(x, 1)} g`],
                dibujo: { datos: ejesSol({ puntos: [{ x: T, y: mm, color: 'd', rotulo: `${f(mm, 0)} g` }, { x: T, y: sT, color: 'd', rotulo: `${f(sT, 1)} g` }], curvas: [...ejesSol().curvas, { puntos: [[T, sT], [T, mm]], color: 'h' }] }), estado: {} } },
              { tipo: 'sentido', texto: `Lo disuelto más lo sólido devuelve lo echado: ${f(sT, 1)} + ${f(x, 1)} = ${f(sT + x, 0)} g. Y sobra menos de lo que eché.` },
            ],
            respuesta: `Quedan ${f(x, 1)} g de KNO₃ sin disolver.`,
          };
        }
        const T2 = C.T2, s2 = C.s2, x = sT - s2;
        return {
          enunciado: `100 g de agua están saturados de KNO₃ a ${f(T, 0)} °C. Se enfrían hasta ${f(T2, 0)} °C. ¿Cuánto sólido aparece?`,
          dibujo: { datos: ejesSol({ puntos: [{ x: T, y: sT, color: 'd', rotulo: `saturada a ${f(T, 0)} °C`, guias: true }] }), estado: {} },
          pasos: [
            { tipo: 'pide', texto: 'Piden la masa de KNO₃ que se separa como sólido al enfriar.' },
            { tipo: 'datos', texto: `Saturada a ${f(T, 0)} °C: tiene disuelto justo lo que marca la curva ahí. Después baja a ${f(T2, 0)} °C.` },
            { tipo: 'regla', texto: 'Al enfriar, el máximo baja con la curva. Lo que ya no cabe a la temperatura baja se separa como sólido.' },
            { tipo: 'cuentas', texto: `Leo la curva dos veces: ${f(sT, 1)} g a ${f(T, 0)} °C y ${f(s2, 1)} g a ${f(T2, 0)} °C. Resto.`,
              ecuacion: [`${f(sT, 1)} − ${f(s2, 1)} = ${f(x, 1)} g`],
              dibujo: { datos: ejesSol({ puntos: [{ x: T, y: sT, color: 'd', rotulo: `${f(sT, 1)} g` }, { x: T2, y: sT, color: 'd', abierto: true }, { x: T2, y: s2, color: 'd', rotulo: `${f(s2, 1)} g` }], curvas: [...ejesSol().curvas, { puntos: [[T2, s2], [T2, sT]], color: 'h' }] }), estado: {} } },
            { tipo: 'sentido', texto: `Lo que sigue disuelto más lo sólido da lo de antes: ${f(s2, 1)} + ${f(x, 1)} = ${f(s2 + x, 1)} g. No sale todo: algo cabe en frío.` },
          ],
          respuesta: `Aparecen ${f(x, 1)} g de KNO₃ sólido.`,
        };
      },
    },
    ahoraTu: {
      pieza: 'ejes',
      voz: 'Lee el máximo en la curva antes de restar.',
      generar(s) {
        const r = azar(s), C = casoKNO3(r, s), T = C.T, sT = C.sT;
        if (C.sobra) {
          const mm = C.mm;
          return {
            pregunta: ['Echas ', m, ` = ${f(mm, 0)} g de KNO₃ en 100 g de agua a ${f(T, 0)} °C y agitas mucho. ¿Cuánto queda sin disolver?`],
            dibujo: { datos: ejesSol({ puntos: [{ x: T, y: mm, color: 'd', rotulo: `${f(mm, 0)} g`, guias: true }] }), estado: {} },
            opciones: opciones(mm - sT, [
              { id: 'agita', valor: 0, error: 'QM-AGITAR', siFuera: 'Agitar acelera, pero no sube el máximo. A esa temperatura caben menos.' },
              { id: 'max', valor: sT, error: 'QM-SOLUB', siFuera: 'Eso es lo que sí se disuelve. Se pregunta por lo que sobra.' },
              { id: 'todo', valor: mm, error: 'QM-ENFRIAR', siFuera: 'Sería todo si no se disolviera nada; algo sí se disuelve.' },
            ], x => `${f(x, 1)} g`),
            solucion: { texto: `A ${f(T, 0)} °C caben ${f(sT, 1)} g; sobra el resto.`, ecuacion: [`${f(mm, 0)} − ${f(sT, 1)} = ${f(mm - sT, 1)} g`], dibujo: { datos: ejesSol({ puntos: [{ x: T, y: mm, color: 'd', rotulo: `${f(mm, 0)} g` }, { x: T, y: sT, color: 'd', rotulo: `${f(sT, 1)} g` }] }), estado: {} } },
          };
        }
        const T2 = C.T2, s1 = sT, s2 = C.s2;
        return {
          pregunta: [`100 g de agua están saturados de KNO₃ a ${f(T, 0)} °C. Se enfrían a ${f(T2, 0)} °C. ¿Cuánto sólido aparece?`],
          dibujo: { datos: ejesSol(), estado: {} },
          opciones: opciones(s1 - s2, [
            { id: 'cero', valor: 0, error: 'QM-ENFRIAR', siFuera: 'Lo disuelto sí puede salir: al enfriar, el máximo baja.' },
            { id: 'baja', valor: s2, error: 'QM-SOLUB', siFuera: 'Eso es lo que sigue disuelto a la temperatura baja.' },
            { id: 'alta', valor: s1, error: 'QM-SOLUB', siFuera: 'Eso es todo lo disuelto al inicio; parte sigue disuelta.' },
          ], x => `${f(x, 1)} g`),
          solucion: { texto: 'Lo que había menos lo que cabe a la temperatura baja.', ecuacion: [`${f(s1, 1)} − ${f(s2, 1)} = ${f(s1 - s2, 1)} g`] },
        };
      },
    },
  };

  // ---------- Idea 3: concentración = cantidad sobre volumen ----------
  // Cambia: cuántas bolitas de soluto y cuánto volumen · Permanece: cada bolita vale 0,01 mol · Progresa: de contar
  // bolitas a contar bolitas por volumen · Se reserva: el vaso con menos moles y más concentrado · Debe verse: la
  // densidad de bolitas, no su número.
  // Animación: el volumen sube y baja solo (las mismas bolitas en más o menos solución); las bolitas tiemblan.
  const vasoConc = val => lupa([{ titulo: 'Solución', forma: 'vaso', nivel: val.v / 500, rotulo: `${f(val.v, 0)} mL`, particulas: [{ e: 'ion', n: val.k }] }], { agita: val.v / 60, agitaAmp: 2 });
  // Los datos de los cuatro tipos de «Ahora tú» (molaridad, %m/m, molalidad y normalidad); «Así se resuelve» los usa
  // con otras semillas.
  const casoConc = (r, tipo) => {
    if (tipo === 0) { const g = 4 * r.ent(1, 10), v = 50 * r.ent(2, 10); return { g, v, mol: g / 40 }; }
    if (tipo === 1) { const g = r.ent(2, 30), agua = 10 * r.ent(5, 30); return { g, agua, tot: g + agua }; }
    if (tipo === 2) return { mol: fijo(r.ent(1, 8) * 0.1, 1), kg: fijo(r.ent(2, 10) * 0.1, 1) };
    return { M: fijo(r.ent(1, 10) * 0.05, 2) };
  };
  const concentracion = {
    id: 'concentracion',
    titulo: 'Concentración: cantidad entre volumen',
    temas: ['Concentración: porcentajes, molaridad, normalidad y molalidad'],
    pieza: 'quim-particulas',
    // Lee (fase 2): la palabra, el mol y los litros. No compara dos soluciones (eso se predice).
    lee: {
      tarjetas: [
        { titulo: 'Cargado o suave', texto: 'Cuando preparas refresco de maracuyá en casa, unos lo quieren cargado y otros suave. Eso que cambia de una jarra a otra es la concentración, y en química se mide con números.' },
        { titulo: 'Contar en moles', texto: 'El soluto se cuenta en moles. Un mol es un paquete fijo de partículas, como una docena, pero enorme. Con la masa molar pasas de gramos a moles.',
          ecuacion: [n, ' = ', { frac: [m, 'M'] }, '   ·   ', '1 mol ≈ 6,02 · ', { sup: ['10', '23'] }, ' partículas'] },
        { titulo: 'Litros y mililitros', texto: `Un litro tiene 1000 mL. En las fórmulas de concentración el volumen casi siempre va en litros: 250 mL son ${f(250 / 1000, 2)} L.`,
          ecuacion: ['1 L = 1000 mL'] },
        { titulo: 'Qué mirar', texto: 'En el juego, cada bolita es 0,01 mol de soluto y el volumen sube y baja solo. Cambia el número de bolitas y mira qué tan juntas quedan.' },
      ],
    },
    juega: {
      consigna: 'Cada bolita es 0,01 mol de soluto. El volumen sube y baja solo; cambia cuántas bolitas hay. Mira qué tan juntas quedan.',
      voz: 'Fíjate en cuántas bolitas hay por cada parte del vaso.',
      controles: [
        { id: 'k', etiqueta: 'n', color: 'c-o', min: 2, max: 12, paso: 2, inicio: 4, unidad: 'bolitas', decimales: 0 },
        { id: 'v', etiqueta: 'V', color: 'c-i', min: 100, max: 500, paso: 100, inicio: 200, unidad: 'mL', decimales: 0, auto: { velocidad: 80, modo: 'rebota' } },
      ],
      dibujo: val => vasoConc(val),
      lectura: val => [c, ` = ${f(val.k * 0.01, 2)} mol / ${f(val.v / 1000, 1)} L = ${f(val.k * 0.01 / (val.v / 1000), 2)}\u00a0mol/L`],
      minimo: 3,
      // Se agarra la superficie del líquido: subirla es tener más volumen con las mismas bolitas; c responde.
      arrastres: [{ id: 'nivel', etiqueta: 'nivel del vaso (volumen de solución)', color: 'c-i',
        donde: val => superficie(vasoConc(val)),
        mover: (pt, val) => ({ v: nivelEn(vasoConc(val), pt.y) * 500 }) }],
    },
    predice: {
      pregunta: 'El vaso A tiene 0,2 mol de soluto en 1 L de solución; el B, 0,1 mol en 0,25 L. ¿Cuál es más concentrado?',
      voz: 'Compara bolitas por litro, no bolitas solas.',
      opciones: [
        { id: 'c', texto: 'B: 0,4 mol/L contra 0,2 mol/L', correcta: true },
        { id: 'a', texto: 'A, porque tiene más soluto', error: 'SO7', siFuera: 'A tiene más moles, cierto. Sería más concentrado si los repartiera en el mismo volumen.' },
        { id: 'igual', texto: 'Igual: los dos son diluidos', error: 'SO13', siFuera: 'Los dos son diluidos, sí. Pero c = n/V da números distintos.' },
        { id: 'faltan', texto: 'Falta saber la masa del soluto', error: 'SO14', siFuera: 'La masa sirve para el porcentaje. Para mol/L bastan n y V.' },
      ],
      dibujo: lupa([{ titulo: 'A', forma: 'vaso', nivel: 1, rotulo: '1 L', particulas: [] }, { titulo: 'B', forma: 'vaso', nivel: 0.25, rotulo: '0,25 L', particulas: [] }]),
      revelar: lupa([{ titulo: 'A', forma: 'vaso', nivel: 1, rotulo: '0,2 mol/L', particulas: [{ e: 'ion', n: 8 }] }, { titulo: 'B', forma: 'vaso', nivel: 0.25, rotulo: '0,4 mol/L', particulas: [{ e: 'ion', n: 4 }] }]),
      coincide: 'Coincide: B tiene menos soluto, pero mucho más junto.',
      noCoincide: 'B tiene la mitad de soluto en la cuarta parte del volumen: el doble de concentración.',
    },
    mira: {
      datos: lupa([{ titulo: 'NaOH en agua', forma: 'vaso', nivel: 0.8, rotulo: '500 mL · 520 g', particulas: [{ e: 'ion', n: 10 }] }]).datos,
      voz: 'Una misma solución, cinco maneras de medirla.',
      pasos: [
        { estado: {}, texto: 'Disolvemos 10 g de NaOH (0,25 mol) hasta 500 mL; pesa 520 g.', ecuacion: [m, ' = 10 g', '   ·   ', n, ' = 10/40 = 0,25 mol'] },
        { estado: {}, texto: 'Molaridad: moles entre litros de solución.', ecuacion: [c, ' = ', { frac: [n, V] }, ` = ${f(0.25 / 0.5, 2)} mol/L`] },
        { estado: {}, texto: 'Porcentaje en masa: gramos de soluto entre gramos de solución.', ecuacion: ['%m/m = 10/520 · 100 = ', `${f(1000 / 520, 2)} %`] },
        { estado: {}, texto: 'Porcentaje masa-volumen: gramos entre mililitros de solución.', ecuacion: ['%m/V = 10/500 · 100 = ', `${f(2, 0)} %`] },
        { estado: {}, texto: 'Molalidad: moles entre kilogramos de solvente, no de solución.', ecuacion: ['b = 0,25 / 0,510 = ', `${f(0.25 / 0.51, 2)} mol/kg`] },
        { estado: {}, texto: 'Normalidad: la molaridad por los OH⁻ que da cada unidad.', ecuacion: ['N = θ · ', c, ` = 1 · 0,5 = ${f(0.5, 1)} eq/L`] },
      ],
    },
    regla: {
      texto: 'Toda concentración es soluto sobre solución: moles entre litros (molaridad), gramos entre gramos (%m/m) o entre mililitros (%m/V). La molalidad divide entre kilogramos de solvente.',
      ecuacion: [c, ' = ', { frac: [n, { llave: [V], nota: 'de solución', color: 'c-i' }] }, '   ·   ', 'b = ', { frac: [n, 'kg de solvente'] }, '   ·   ', 'N = ', { llave: ['θ'], nota: 'H⁺ u OH⁻' }, ' · ', c],
      condicion: 'V es el volumen final de la solución, no el del agua añadida; θ son los H⁺ u OH⁻ que intercambia.',
      voz: 'Primero el numerador y el denominador; después el número.',
    },
    resuelve: {
      generar(s) {
        const tipo = s % 4, C = casoConc(azar(s + 900), tipo);
        if (tipo === 0) {
          const L = C.v / 1000, cc = C.mol / L;
          return {
            enunciado: ['Disuelves ', m, ` = ${f(C.g, 0)} g de NaOH (M = 40 g/mol) en agua hasta `, V, ` = ${f(C.v, 0)} mL de solución. ¿Cuál es su molaridad?`],
            pasos: [
              { tipo: 'pide', texto: ['Piden la molaridad ', c, ': cuántos moles de soluto hay en cada litro de solución.'] },
              { tipo: 'datos', texto: [m, ` = ${f(C.g, 0)} g de NaOH, que tiene 40 g/mol, y `, V, ` = ${f(C.v, 0)} mL de solución.`] },
              { tipo: 'regla', texto: 'Arriba van los moles de soluto y abajo los litros de solución. Antes, la masa se pasa a moles con la masa molar.',
                ecuacion: [n, ' = ', { frac: [m, 'M'] }, '   ·   ', c, ' = ', { frac: [n, V] }] },
              { tipo: 'cuentas', texto: 'Paso gramos a moles y mililitros a litros; después divido.',
                ecuacion: [n, ` = ${f(C.g, 0)} / 40 = ${f(C.mol, 3)} mol   ·   `, V, ` = ${f(L, 3)} L   →   `, c, ` = ${f(cc, 3)} mol/L`] },
              { tipo: 'sentido', texto: [`Mol entre litro da mol/L. De vuelta: `, c, ' · ', V, ` = ${f(cc, 3)} · ${f(L, 3)} = ${f(cc * L, 3)} mol, los moles del inicio.`] },
            ],
            respuesta: [c, ` = ${f(cc, 3)} mol/L`],
          };
        }
        if (tipo === 1) {
          const p = 100 * C.g / C.tot;
          return {
            enunciado: ['Disuelves ', m, ` = ${f(C.g, 0)} g de azúcar en ${f(C.agua, 0)} g de agua. ¿Cuál es el porcentaje en masa de azúcar?`],
            pasos: [
              { tipo: 'pide', texto: 'Piden el porcentaje en masa: cuántos gramos de azúcar hay en cada 100 g de solución.' },
              { tipo: 'datos', texto: [m, ` = ${f(C.g, 0)} g de azúcar (soluto) y ${f(C.agua, 0)} g de agua (solvente).`] },
              { tipo: 'regla', texto: 'Se divide la masa del soluto entre la masa de toda la solución, que es soluto más solvente, y se multiplica por 100.',
                ecuacion: ['%m/m = ', { frac: [m, 'masa de solución'] }, ' · 100'] },
              { tipo: 'cuentas', texto: 'Primero sumo para tener la masa de la solución; después divido.',
                ecuacion: [`${f(C.g, 0)} + ${f(C.agua, 0)} = ${f(C.tot, 0)} g   →   ${f(C.g, 0)} / ${f(C.tot, 0)} · 100 = ${f(p, 1)} %`] },
              { tipo: 'sentido', texto: `Queda por debajo de ${f(100 * C.g / C.agua, 1)} %, lo que daría dividir solo entre el agua: la solución pesa más que el agua sola.` },
            ],
            respuesta: `${f(p, 1)} % en masa de azúcar`,
          };
        }
        if (tipo === 2) {
          const b = C.mol / C.kg;
          return {
            enunciado: `Disuelves ${f(C.mol, 1)} mol de glucosa en ${f(C.kg, 1)} kg de agua. ¿Cuál es la molalidad de la solución?`,
            pasos: [
              { tipo: 'pide', texto: 'Piden la molalidad b: moles de soluto por cada kilogramo de solvente.' },
              { tipo: 'datos', texto: `${f(C.mol, 1)} mol de glucosa y ${f(C.kg, 1)} kg de agua, que es el solvente.` },
              { tipo: 'regla', texto: 'La molalidad no mira el volumen ni la solución entera: divide los moles entre los kilogramos de solvente.',
                ecuacion: ['b = ', { frac: [n, 'kg de solvente'] }] },
              { tipo: 'cuentas', texto: 'Los datos ya están en mol y en kg: divido directo.', ecuacion: [`b = ${f(C.mol, 1)} / ${f(C.kg, 1)} = ${f(b, 2)} mol/kg`] },
              { tipo: 'sentido', texto: `Mol entre kg da mol/kg. De vuelta: ${f(b, 2)} · ${f(C.kg, 1)} ≈ ${f(b * C.kg, 1)} mol, la glucosa del inicio.` },
            ],
            respuesta: `b = ${f(b, 2)} mol/kg`,
          };
        }
        const N = 2 * C.M;
        return {
          enunciado: ['Una solución de H₂SO₄ tiene ', c, ` = ${f(C.M, 2)} mol/L. En una neutralización, cada H₂SO₄ entrega 2 H⁺. ¿Cuál es su normalidad?`],
          pasos: [
            { tipo: 'pide', texto: 'Piden la normalidad N: los equivalentes, aquí los H⁺ que se pueden entregar, en cada litro.' },
            { tipo: 'datos', texto: [c, ` = ${f(C.M, 2)} mol/L de H₂SO₄, y cada unidad entrega 2 H⁺.`] },
            { tipo: 'regla', texto: 'La normalidad cuenta lo que intercambia cada unidad: multiplico la molaridad por los H⁺ que da cada una, θ.',
              ecuacion: ['N = θ · ', c] },
            { tipo: 'cuentas', texto: 'Aquí θ = 2.', ecuacion: [`N = 2 · ${f(C.M, 2)} = ${f(N, 2)} eq/L`] },
            { tipo: 'sentido', texto: `Cada litro tiene ${f(C.M, 2)} mol de ácido y el doble de H⁺ para entregar: ${f(N, 2)} mol. Por eso N es el doble de c.` },
          ],
          respuesta: `N = ${f(N, 2)} eq/L`,
        };
      },
    },
    ahoraTu: {
      voz: 'Escribe qué va arriba y qué va abajo.',
      generar(s) {
        const r = azar(s), tipo = s % 4, C = casoConc(r, tipo);
        if (tipo === 0) {
          const g = C.g, v = C.v, mol = C.mol;
          return {
            pregunta: ['Disuelves ', m, ` = ${f(g, 0)} g de NaOH (M = 40 g/mol) en agua hasta `, V, ` = ${f(v, 0)} mL de solución. ¿Cuál es su molaridad?`],
            opciones: opciones(mol / (v / 1000), [
              { id: 'ml', valor: mol / v, error: 'QM-ML', siFuera: 'Eso divide entre mililitros. La molaridad usa litros.' },
              { id: 'masa', valor: g / (v / 1000), error: 'SO14', siFuera: 'Eso usa gramos, no moles. Primero n = m/M.' },
              { id: 'inv', valor: (v / 1000) / mol, error: 'QM-INV', siFuera: 'Eso pone el volumen arriba. c = n/V.' },
            ], x => `${f(x, 3)} mol/L`),
            solucion: { texto: 'Pasa la masa a moles y el volumen a litros.', ecuacion: [c, ` = ${f(mol, 3)} / ${f(v / 1000, 3)} = ${f(mol / (v / 1000), 3)} mol/L`] },
          };
        }
        if (tipo === 1) {
          const g = C.g, agua = C.agua, tot = C.tot;
          return {
            pregunta: ['Disuelves ', m, ` = ${f(g, 0)} g de azúcar en ${f(agua, 0)} g de agua. ¿Cuál es el porcentaje en masa?`],
            opciones: opciones(100 * g / tot, [
              { id: 'agua', valor: 100 * g / agua, error: 'QM-SOLVENTE', siFuera: 'Eso divide entre el agua. El porcentaje usa la masa de toda la solución.' },
              { id: 'inv', valor: 100 * agua / tot, error: 'QM-INV', siFuera: 'Ese es el porcentaje de agua, no de azúcar.' },
            ], x => `${f(x, 1)} %`),
            solucion: { texto: 'Masa de soluto entre masa de solución (soluto más agua).', ecuacion: [`${f(g, 0)} / ${f(tot, 0)} · 100 = ${f(100 * g / tot, 1)} %`] },
          };
        }
        if (tipo === 2) {
          const mol = C.mol, kg = C.kg;
          return {
            pregunta: [`Disuelves ${f(mol, 1)} mol de glucosa en ${f(kg, 1)} kg de agua. ¿Cuál es la molalidad?`],
            opciones: opciones(mol / kg, [
              { id: 'inv', valor: kg / mol, error: 'QM-INV', siFuera: 'Eso pone los kilogramos arriba. b = n / kg de solvente.' },
              { id: 'g', valor: mol / (kg * 1000), error: 'QM-ML', siFuera: 'Eso divide entre gramos. La molalidad usa kilogramos.' },
            ], x => `${f(x, 2)} mol/kg`),
            solucion: { texto: 'Moles de soluto entre kilogramos de solvente.', ecuacion: [`b = ${f(mol, 1)} / ${f(kg, 1)} = ${f(mol / kg, 2)} mol/kg`] },
          };
        }
        const M = C.M;
        return {
          pregunta: ['Una solución de H₂SO₄ tiene ', c, ` = ${f(M, 2)} mol/L. En una neutralización cada unidad entrega 2 H⁺. ¿Cuál es su normalidad?`],
          opciones: opciones(2 * M, [
            { id: 'igual', valor: M, error: 'SO15', siFuera: 'Sería igual si cada unidad diera un solo H⁺. Aquí da dos.' },
            { id: 'mitad', valor: M / 2, error: 'SO15', siFuera: 'Eso divide entre 2. La normalidad multiplica por los H⁺.' },
          ], x => `${f(x, 2)} eq/L`),
          solucion: { texto: 'Se multiplica la molaridad por los H⁺ que da cada unidad.', ecuacion: [`N = 2 · ${f(M, 2)} = ${f(2 * M, 2)} eq/L`] },
        };
      },
    },
  };

  // ---------- Idea 4: diluir conserva n; retirar una parte conserva c ----------
  // Cambia: el volumen final al añadir agua · Permanece: las 10 bolitas (0,020 mol) · Progresa: el mismo soluto en más
  // volumen · Se reserva: la alícuota (retirar una parte no cambia c) · Debe verse: que el número de bolitas no cambia al
  // diluir y la densidad no cambia al retirar.
  const BOLITA = 0.002;                                                 // mol por bolita
  const vaso = (titulo, v, k, extra = {}) => Object.assign({ titulo, forma: 'vaso', nivel: v / 260, rotulo: `${f(v, 0)} mL`, particulas: [{ e: 'ion', n: k }] }, extra);
  // Animación: el agua entra sola en el segundo vaso, de 100 a 250 mL, una y otra vez; las bolitas se reparten.
  const conAgua = val => lupa([vaso('Inicio', 100, 10), vaso('Con agua', val.v, 10)], { flechas: true, alto: 190, separacion: 16, agita: val.v / 40, agitaAmp: 1.5 });
  // Los datos de los tres tipos de «Ahora tú» (diluir, retirar, mezclar); «Así se resuelve» los usa con otras semillas.
  const casoDil = (r, tipo) => {
    if (tipo === 0) { const ci = fijo(r.ent(2, 10) * 0.1, 1), vi = 50 * r.ent(1, 4), vf = vi + 50 * r.ent(1, 6); return { ci, vi, vf, cf: ci * vi / vf }; }
    if (tipo === 1) { const ci = fijo(r.ent(1, 9) * 0.1, 1), vi = 100 * r.ent(2, 5), vr = 10 * r.ent(2, Math.floor(vi / 10) - 2); return { ci, vi, vr, queda: vi - vr }; }
    const ca = fijo(r.ent(1, 5) * 0.1, 1), cb = fijo(r.ent(6, 10) * 0.1, 1), va = 100 * r.ent(1, 3), vb = 100 * r.ent(1, 3);
    return { ca, cb, va, vb, cm: (ca * va + cb * vb) / (va + vb) };
  };
  const dilucion = {
    id: 'diluir-y-retirar',
    titulo: 'Diluir no es retirar',
    temas: ['Dilución y mezcla de soluciones'],
    pieza: 'quim-particulas',
    // Lee (fase 2): qué es diluir y las dos preguntas (n y c). No dice qué pasa al retirar una parte (eso se predice).
    lee: {
      tarjetas: [
        { titulo: 'Diluir en casa', texto: 'Cuando un jugo de botella viene muy concentrado, le echas agua y queda más suave. Eso es diluir: añadir solvente a una solución, sin añadir soluto.' },
        { titulo: 'Dos preguntas', texto: ['De una solución se pueden preguntar dos cosas: cuánto soluto tiene en total, ', n, ' en moles, y qué tan concentrada está, ', c, ' en mol/L. El volumen ', V, ' las une.'],
          ecuacion: [n, ' = ', c, ' · ', V] },
        { titulo: 'Qué mirar', texto: 'En el juego, el agua entra sola en el segundo vaso. Cuenta las bolitas de los dos vasos y lee n y c en cada momento.' },
      ],
    },
    juega: {
      consigna: 'Tienes 100 mL de solución con 0,020 mol de soluto. El agua entra sola: cuenta las bolitas y lee n y c.',
      voz: 'Cuenta las bolitas antes y después de añadir agua.',
      controles: [{ id: 'v', etiqueta: 'V', color: 'c-i', min: 100, max: 250, paso: 50, inicio: 100, unidad: 'mL', decimales: 0, auto: { velocidad: 30 } }],
      dibujo: val => conAgua(val),
      lectura: val => [n, ' = 0,020 mol · ', c, ` = ${f(0.02 / (val.v / 1000), 3)}\u00a0mol/L`],
      minimo: 3,
      // Se agarra el nivel del segundo vaso y se sube: es añadir agua. Las bolitas no cambian; c baja.
      arrastres: [{ id: 'agua', etiqueta: 'nivel del vaso con agua', color: 'c-i',
        donde: val => superficie(conAgua(val), 1),
        mover: (pt, val) => ({ v: nivelEn(conAgua(val), pt.y) * 260 }) }],
    },
    predice: {
      pregunta: ['De los 100 mL de solución de ', c, ' = 0,20 mol/L, bien mezclada, retiras 40 mL. ¿Qué concentración tienen los 60 mL que quedan?'],
      voz: 'Aquí no se añade agua: solo se saca una parte.',
      opciones: [
        { id: 'c', texto: '0,20 mol/L, igual que antes', correcta: true },
        { id: 'baja', texto: '0,12 mol/L, porque salió soluto', error: 'SO10', siFuera: 'Salió soluto, es cierto, pero también salió volumen en la misma proporción.' },
        { id: 'sube', texto: '0,33 mol/L, porque hay menos volumen', error: 'QM-ALICUOTA', siFuera: 'Sería cierto si el soluto se quedara todo en 60 mL. Con la parte retirada salió soluto.' },
      ],
      dibujo: lupa([vaso('Inicio', 100, 10), vaso('Quedan', 60, 0)], { flechas: true, alto: 190, separacion: 16 }),
      revelar: lupa([vaso('Inicio', 100, 10), vaso('Quedan', 60, 6)], { flechas: true, alto: 190, separacion: 16 }),
      coincide: 'Coincide: quedan 6 bolitas en 60 mL, la misma densidad que 10 en 100 mL.',
      noCoincide: 'Quedan 6 bolitas en 60 mL: la misma proporción que 10 en 100 mL.',
    },
    mira: {
      datos: lupa([
        vaso('Inicio', 100, 10, { particulas: [{ e: 'ion', n: 10, desde: 1 }] }),
        vaso('+ agua', 250, 10, { particulas: [{ e: 'ion', n: 10, desde: 2 }] }),
        vaso('− 40 mL', 60, 6, { particulas: [{ e: 'ion', n: 6, desde: 3 }] }),
      ], { alto: 190, separacion: 16 }).datos,
      voz: 'Llevemos la cuenta de n y de c por separado.',
      pasos: [
        { estado: { corte: 1 }, texto: 'Al inicio: 0,020 mol en 0,100 L.', ecuacion: [c, ' = 0,020 / 0,100 = 0,20 mol/L'] },
        { estado: { corte: 2 }, texto: 'Con agua hasta 250 mL: el soluto es el mismo, más repartido.', ecuacion: [n, ' = 0,020 mol', '   ·   ', c, ` = 0,020 / 0,250 = ${f(0.02 / 0.25, 3)} mol/L`] },
        { estado: { corte: 2 }, texto: 'Como n no cambia, el producto c · V se conserva.', ecuacion: [c1, V1, ' = ', c2, V2, ' → 0,20 · 100 = 0,080 · 250'] },
        { estado: { corte: 3 }, texto: 'Al retirar 40 mL del inicio, quedan 60 mL con 6 bolitas.', ecuacion: [n, ` = 0,20 · 0,060 = ${f(0.012, 3)} mol`, '   ·   ', c, ' = 0,20 mol/L'] },
        { estado: { corte: 3 }, texto: 'Al mezclar dos soluciones del mismo soluto, se suman las cantidades.', ecuacion: [c, ' = ', { frac: [[c1, V1, ' + ', c2, V2], [V1, ' + ', V2]] }] },
      ],
    },
    regla: {
      texto: 'Al añadir solvente, la cantidad de soluto se conserva y la concentración baja. Al retirar una parte homogénea, la concentración no cambia y la cantidad baja.',
      ecuacion: [{ llave: [c1, V1], nota: 'antes' }, ' = ', { llave: [c2, V2], nota: 'después' }],
      condicion: 'sin reacción, pérdidas ni evaporación. Al mezclar se suman moles; sumar volúmenes es una aproximación que no siempre vale.',
      voz: 'Dos preguntas distintas: cuánto soluto hay y qué tan junto está.',
    },
    resuelve: {
      generar(s) {
        const tipo = s % 3, C = casoDil(azar(s + 900), tipo);
        if (tipo === 0) {
          const { ci, vi, vf, cf } = C;
          return {
            enunciado: ['Diluyes ', V1, ` = ${f(vi, 0)} mL de solución de `, c1, ` = ${f(ci, 1)} mol/L con agua hasta `, V2, ` = ${f(vf, 0)} mL. ¿Cuál es la nueva concentración?`],
            pasos: [
              { tipo: 'pide', texto: ['Piden ', c2, ', la concentración después de añadir agua.'] },
              { tipo: 'datos', texto: ['Antes: ', V1, ` = ${f(vi, 0)} mL y `, c1, ` = ${f(ci, 1)} mol/L. Después, el volumen final es `, V2, ` = ${f(vf, 0)} mL.`] },
              { tipo: 'regla', texto: 'Al añadir solo agua, los moles de soluto no cambian: se reparten en más volumen. Por eso c · V antes es igual a c · V después.',
                ecuacion: [c1, V1, ' = ', c2, V2] },
              { tipo: 'cuentas', texto: ['Despejo ', c2, '. Los mililitros se cancelan entre sí, así que no hace falta pasar a litros.'],
                ecuacion: [c2, ` = ${f(ci, 1)} · ${f(vi, 0)} / ${f(vf, 0)} = ${f(cf, 3)} mol/L`] },
              { tipo: 'sentido', texto: `Bajó, como debe al diluir. Los moles cuadran: ${f(ci * vi / 1000, 4)} mol antes y ${f(cf * vf / 1000, 4)} mol después.` },
            ],
            respuesta: [c2, ` = ${f(cf, 3)} mol/L`],
          };
        }
        if (tipo === 1) {
          const { ci, vi, vr, queda } = C, nq = ci * queda / 1000, ns = ci * vr / 1000;
          return {
            enunciado: ['De ', V1, ` = ${f(vi, 0)} mL de solución de `, c1, ` = ${f(ci, 1)} mol/L, bien mezclada, sacas ${f(vr, 0)} mL. ¿Cuántos moles de soluto quedan?`],
            pasos: [
              { tipo: 'pide', texto: ['Piden ', n, ', los moles de soluto que quedan después de sacar una parte.'] },
              { tipo: 'datos', texto: ['Había ', V1, ` = ${f(vi, 0)} mL a `, c1, ` = ${f(ci, 1)} mol/L. Saco ${f(vr, 0)} mL: quedan ${f(queda, 0)} mL.`] },
              { tipo: 'regla', texto: 'Sacar una parte de una solución bien mezclada no cambia su concentración. Lo que queda tiene la misma c, en menos volumen.',
                ecuacion: [n, ' = ', c, ' · ', V] },
              { tipo: 'cuentas', texto: `Paso ${f(queda, 0)} mL a litros y multiplico por la concentración.`,
                ecuacion: [n, ` = ${f(ci, 1)} · ${f(queda / 1000, 3)} = ${f(nq, 3)} mol`] },
              { tipo: 'sentido', texto: `Lo que queda más lo que saqué da lo de antes: ${f(nq, 3)} + ${f(ns, 3)} = ${f(nq + ns, 3)} mol, que es ${f(ci, 1)} · ${f(vi / 1000, 1)}.` },
            ],
            respuesta: [n, ` = ${f(nq, 3)} mol de soluto`],
          };
        }
        const { ca, cb, va, vb, cm } = C, nt = (ca * va + cb * vb) / 1000;
        const cerca = va === vb ? 'Queda justo en la mitad, porque los volúmenes son iguales.' : `Queda más cerca de ${f(va > vb ? ca : cb, 1)} mol/L, la que puso más volumen.`;
        return {
          enunciado: `Mezclas ${f(va, 0)} mL de NaCl ${f(ca, 1)} mol/L con ${f(vb, 0)} mL de NaCl ${f(cb, 1)} mol/L. Si los volúmenes se suman, ¿cuál es la concentración final?`,
          pasos: [
            { tipo: 'pide', texto: 'Piden la concentración de la mezcla, cuando ya está pareja.' },
            { tipo: 'datos', texto: `A: ${f(va, 0)} mL a ${f(ca, 1)} mol/L. B: ${f(vb, 0)} mL a ${f(cb, 1)} mol/L. Es el mismo soluto.` },
            { tipo: 'regla', texto: 'Las concentraciones no se suman. Se suman los moles de las dos y se dividen entre el volumen total.',
              ecuacion: [c, ' = ', { frac: [[c1, V1, ' + ', c2, V2], [V1, ' + ', V2]] }] },
            { tipo: 'cuentas', texto: 'Saco los moles de cada una, en litros, y divido entre el volumen total.',
              ecuacion: [n, ` = ${f(ca, 1)} · ${f(va / 1000, 1)} + ${f(cb, 1)} · ${f(vb / 1000, 1)} = ${f(nt, 2)} mol   →   `, c, ` = ${f(nt, 2)} / ${f((va + vb) / 1000, 1)} = ${f(cm, 3)} mol/L`] },
            { tipo: 'sentido', texto: `Sale entre ${f(ca, 1)} y ${f(cb, 1)} mol/L, como debe. ${cerca}` },
          ],
          respuesta: [c, ` = ${f(cm, 3)} mol/L`],
        };
      },
    },
    ahoraTu: {
      voz: 'Decide primero qué se conserva: n o c.',
      generar(s) {
        const r = azar(s), tipo = s % 3, C = casoDil(r, tipo);
        if (tipo === 0) {
          const { ci, vi, vf, cf } = C;
          return {
            pregunta: [`Diluyes `, V1, ` = ${f(vi, 0)} mL de solución de `, c1, ` = ${f(ci, 1)} mol/L con agua hasta `, V2, ` = ${f(vf, 0)} mL. ¿Cuál es la nueva concentración?`],
            opciones: opciones(cf, [
              { id: 'igual', valor: ci, error: 'AB6', siFuera: 'Sería igual si también añadieras soluto. Solo añadiste agua.' },
              { id: 'inv', valor: ci * vf / vi, error: 'QM-INV', siFuera: 'Eso la hace subir. Al repartir en más volumen, baja.' },
              { id: 'resta', valor: ci * (vi / (vf - vi)), error: 'QM-AGUA', siFuera: 'Eso divide entre el agua añadida. Se usa el volumen final.' },
            ], x => `${f(x, 3)} mol/L`),
            solucion: { texto: 'n se conserva: c₁V₁ = c₂V₂.', ecuacion: [c2, ` = ${f(ci, 1)} · ${f(vi, 0)} / ${f(vf, 0)} = ${f(cf, 3)} mol/L`] },
          };
        }
        if (tipo === 1) {
          const { ci, vi, vr, queda } = C;
          return {
            pregunta: [`De `, V1, ` = ${f(vi, 0)} mL de solución de `, c1, ` = ${f(ci, 1)} mol/L, bien mezclada, sacas ${f(vr, 0)} mL. ¿Cuántos moles de soluto quedan?`],
            opciones: opciones(ci * queda / 1000, [
              { id: 'todos', valor: ci * vi / 1000, error: 'QM-ALICUOTA', siFuera: 'Eso es lo que había antes. Con la parte que sacaste salió soluto.' },
              { id: 'sacado', valor: ci * vr / 1000, error: 'QM-ALICUOTA', siFuera: 'Eso es lo que sacaste, no lo que queda.' },
              { id: 'ml', valor: ci * queda, error: 'QM-ML', siFuera: 'Eso usa mililitros como si fueran litros.' },
            ], x => `${f(x, 3)} mol`),
            solucion: { texto: `La concentración sigue igual; quedan ${f(queda, 0)} mL.`, ecuacion: [n, ` = ${f(ci, 1)} · ${f(queda / 1000, 3)} = ${f(ci * queda / 1000, 3)} mol`] },
          };
        }
        const { ca, cb, va, vb, cm } = C;
        return {
          pregunta: [`Mezclas ${f(va, 0)} mL de NaCl ${f(ca, 1)} mol/L con ${f(vb, 0)} mL de NaCl ${f(cb, 1)} mol/L. Suponiendo que los volúmenes se suman, ¿cuál es la concentración final?`],
          opciones: opciones(cm, [
            { id: 'media', valor: (ca + cb) / 2, error: 'SO8', siFuera: 'El promedio simple vale solo con volúmenes iguales.' },
            { id: 'suma', valor: ca + cb, error: 'QM-SUMA-C', siFuera: 'Las concentraciones no se suman; se suman los moles.' },
          ], x => `${f(x, 3)} mol/L`),
          solucion: { texto: 'Se suman los moles y se dividen entre el volumen total.', ecuacion: [c, ` = (${f(ca, 1)} · ${f(va, 0)} + ${f(cb, 1)} · ${f(vb, 0)}) / ${f(va + vb, 0)} = ${f(cm, 3)} mol/L`] },
        };
      },
    },
  };

  // ---------- Idea 5: estequiometría con n = c·V ----------
  // Cambia: el volumen de base añadido · Permanece: 20 mL de HCl 0,10 mol/L (2 mmol) · Progresa: el H⁺ que queda baja
  // hasta cero y después sobra OH⁻ · Se reserva: un ácido que da dos H⁺ · Debe verse: que reacciona par por par.
  const BOL = 0.5;                                                      // mmol por bolita
  const neutra = vb => {
    const nH = 2, nOH = 0.1 * vb, quedaH = Math.max(0, nH - nOH), sobraOH = Math.max(0, nOH - nH), agua = Math.min(nH, nOH);
    // Las bolitas son pares enteros de 0,5 mmol: se cuentan con floor para que un par aparezca recién cuando se completa.
    const kH = Math.round(nH / BOL), kAgua = Math.floor(agua / BOL + 1e-9), kOH = Math.floor(sobraOH / BOL + 1e-9);
    return { nOH, quedaH, sobraOH, agua, dib: lupa([{ titulo: 'Vaso', forma: 'vaso', nivel: (20 + vb) / 60, rotulo: `${f(20 + vb, 0)} mL`,
      particulas: [{ e: 'H', n: kH - kAgua }, { e: 'OH', n: kOH }, { e: 'agua', n: kAgua }],
      cuenta: [{ e: 'H', texto: `${f(quedaH, 1)}` }, { e: 'OH', texto: `${f(sobraOH, 1)}` }, { e: 'agua', texto: `${f(agua, 1)}` }] }], { separacion: 24, agita: vb / 8, agitaAmp: 1.5 }) };
  };
  // Los pares ácido-base y los datos de «Ahora tú»; «Así se resuelve» los usa con otras semillas.
  const PARES = [
    { acido: 'HCl', base: 'NaOH', a: 1, b: 1, ec: 'HCl + NaOH → NaCl + H₂O' },
    { acido: 'H₂SO₄', base: 'NaOH', a: 1, b: 2, ec: 'H₂SO₄ + 2 NaOH → Na₂SO₄ + 2 H₂O' },
    { acido: 'HCl', base: 'Ca(OH)₂', a: 2, b: 1, ec: '2 HCl + Ca(OH)₂ → CaCl₂ + 2 H₂O' },
    { acido: 'HNO₃', base: 'KOH', a: 1, b: 1, ec: 'HNO₃ + KOH → KNO₃ + H₂O' },
  ];
  const casoNeutra = (r, k) => {
    const P = PARES[k % PARES.length], ca = fijo(r.ent(1, 5) * 0.1, 1), va = 5 * r.ent(2, 8), cb = fijo(r.ent(1, 5) * 0.1, 1);
    const na = ca * va, nb = na * P.b / P.a;
    return { P, ca, va, cb, na, nb, vb: nb / cb };
  };
  const esteq = {
    id: 'estequiometria-solucion',
    titulo: 'Reaccionar en solución: n = c·V',
    temas: ['Estequiometría en soluciones'],
    pieza: 'quim-particulas',
    // Lee (fase 2): neutralizar, milimoles y titular. No dice cómo entran los coeficientes (eso se predice).
    lee: {
      tarjetas: [
        { titulo: 'Neutralizar', texto: 'Cuando un ácido y una base se juntan, reaccionan y forman una sal y agua: es una neutralización. En las chacras del altiplano, echar cal a un suelo ácido hace algo parecido.' },
        { titulo: 'Milimoles', texto: 'En el laboratorio los volúmenes son chicos, y conviene contar en milimoles. Un milimol es la milésima parte de un mol. Si c está en mol/L y V en mL, el producto da milimoles.',
          ecuacion: ['1 mmol = 0,001 mol'] },
        { titulo: 'Titular', texto: 'Para saber cuánto ácido hay en una muestra, se le añade poco a poco una base de concentración conocida hasta que el ácido se acaba. Eso se llama titulación.' },
        { titulo: 'Qué mirar', texto: 'En el juego, la base entra sola al vaso con ácido; cada bolita es 0,5 mmol. Mira cuántas bolitas de H⁺ quedan y cuándo empieza a sobrar OH⁻.' },
      ],
    },
    juega: {
      consigna: 'Al vaso con 20 mL de HCl 0,10 mol/L le entra NaOH 0,10 mol/L solo. Cada bolita es 0,5 mmol. Mira qué queda.',
      voz: 'Cada OH⁻ se lleva un H⁺. Cuenta los pares.',
      controles: [{ id: 'v', etiqueta: 'NaOH', color: 'c-i', min: 0, max: 40, paso: 5, inicio: 5, unidad: 'mL', decimales: 0, auto: { velocidad: 6 } }],
      dibujo: val => neutra(val.v).dib,
      lectura: val => { const x = neutra(val.v); return [`${f(val.v, 1)} mL · `, n, `(OH⁻) = ${f(x.nOH, 1)} mmol · queda H⁺ ${f(x.quedaH, 1)}\u00a0mmol`]; },
      minimo: 3,
      // El nivel del vaso se agarra y se sube: es añadir base (20 mL de ácido + lo agregado). Los pares responden.
      arrastres: [{ id: 'base', etiqueta: 'nivel del vaso: más arriba, más NaOH', color: 'c-i',
        donde: val => superficie(neutra(val.v).dib),
        mover: (pt, val) => ({ v: nivelEn(neutra(val.v).dib, pt.y) * 60 - 20 }) }],
    },
    predice: {
      pregunta: '¿Qué volumen de NaOH 0,20 mol/L neutraliza 25 mL de H₂SO₄ 0,10 mol/L? (H₂SO₄ + 2 NaOH → Na₂SO₄ + 2 H₂O)',
      voz: 'Mira los coeficientes antes de igualar.',
      opciones: [
        { id: 'c', texto: '25 mL', correcta: true },
        { id: 'sin-coef', texto: '12,5 mL', error: 'QM-COEF', siFuera: 'Sería cierto si la relación fuera 1 a 1. Cada H₂SO₄ necesita dos NaOH.' },
        { id: 'c1v1', texto: '50 mL', error: 'QM-C1V1', siFuera: 'Eso usa la fórmula de la dilución al revés. Aquí hay reacción: se igualan moles con los coeficientes.' },
      ],
      dibujo: lupa([{ titulo: 'H₂SO₄ 25 mL', forma: 'vaso', nivel: 0.5, particulas: [{ e: 'H', n: 10 }] }, { titulo: 'NaOH ? mL', forma: 'vaso', nivel: 0.5, particulas: [] }]),
      revelar: lupa([{ titulo: 'H₂SO₄ 25 mL', forma: 'vaso', nivel: 0.5, particulas: [{ e: 'H', n: 10 }], cuenta: [{ e: 'H', texto: '5 mmol' }] }, { titulo: 'NaOH 25 mL', forma: 'vaso', nivel: 0.5, particulas: [{ e: 'OH', n: 10 }], cuenta: [{ e: 'OH', texto: '5 mmol' }] }]),
      coincide: 'Coincide: 2,5 mmol de ácido dan 5 mmol de H⁺, y 5 mmol de NaOH caben en 25 mL.',
      noCoincide: '2,5 mmol de H₂SO₄ piden 5 mmol de NaOH: a 0,20 mol/L son 25 mL.',
    },
    mira: {
      datos: lupa([{ titulo: 'H₂SO₄', forma: 'vaso', nivel: 0.5, particulas: [{ e: 'H', n: 10, desde: 1 }], cuenta: [{ e: 'H', texto: '5 mmol', desde: 2 }] }, { titulo: 'NaOH', forma: 'vaso', nivel: 0.5, particulas: [{ e: 'OH', n: 10, desde: 3 }], cuenta: [{ e: 'OH', texto: '5 mmol', desde: 3 }] }]).datos,
      voz: 'Vamos de volumen a moles, de moles a moles, y de vuelta a volumen.',
      pasos: [
        { estado: { corte: 1 }, texto: 'Moles de ácido: concentración por volumen.', ecuacion: [n, ' = ', c, ' · ', V, ' = 0,10 · 25 = 2,5 mmol'] },
        { estado: { corte: 2 }, texto: 'La ecuación pide 2 NaOH por cada H₂SO₄.', ecuacion: [n, '(NaOH) = 2 · 2,5 = 5 mmol'] },
        { estado: { corte: 3 }, texto: 'Volumen de base: moles entre concentración.', ecuacion: [V, ' = ', { frac: [n, c] }, ' = 5 / 0,20 = 25 mL'] },
      ],
    },
    regla: {
      texto: 'En solución, la cantidad de cada reactivo es n = c·V. La ecuación balanceada dice en qué proporción reaccionan esas cantidades.',
      ecuacion: [n, ' = ', c, ' · ', V, '   ·   ', { frac: [{ sub: [n, 'A'] }, { llave: ['a'], nota: 'coeficiente' }] }, ' = ', { frac: [{ sub: [n, 'B'] }, 'b'] }],
      condicion: 'c en mol/L y V en L (o mmol/mL y mL); la reacción es completa y sigue la ecuación escrita.',
      voz: 'Los coeficientes mandan sobre los volúmenes.',
    },
    resuelve: {
      generar(s) {
        const { P, ca, va, cb, na, nb, vb } = casoNeutra(azar(s + 900), s);
        const coef = P.a === P.b ? 'van 1 a 1' : P.b > P.a ? `cada ${P.acido} pide ${P.b} ${P.base}` : `cada ${P.base} gasta ${P.a} ${P.acido}`;
        return {
          enunciado: `¿Qué volumen de ${P.base} ${f(cb, 1)} mol/L neutraliza ${f(va, 0)} mL de ${P.acido} ${f(ca, 1)} mol/L? (${P.ec})`,
          pasos: [
            { tipo: 'pide', texto: ['Piden ', V, ` de ${P.base}: el volumen que gasta todo el ácido sin que sobre base.`] },
            { tipo: 'datos', texto: `${f(va, 0)} mL de ${P.acido} a ${f(ca, 1)} mol/L, y la base a ${f(cb, 1)} mol/L. En la ecuación, ${coef}.`, ecuacion: [P.ec] },
            { tipo: 'regla', texto: 'Paso cada volumen a moles con n = c · V. La ecuación balanceada dice cuántos moles de base van por cada mol de ácido.',
              ecuacion: [n, ' = ', c, ' · ', V, '   ·   ', { frac: [{ sub: [n, 'ácido'] }, String(P.a)] }, ' = ', { frac: [{ sub: [n, 'base'] }, String(P.b)] }] },
            { tipo: 'cuentas', texto: 'Moles de ácido, después moles de base con los coeficientes, y al final el volumen de base.',
              ecuacion: [{ sub: [n, 'ácido'] }, ` = ${f(ca, 1)} · ${f(va, 0)} = ${f(na, 2)} mmol   →   `, { sub: [n, 'base'] }, ` = ${f(na, 2)} · ${P.b}/${P.a} = ${f(nb, 2)} mmol   →   `, V, ` = ${f(nb, 2)} / ${f(cb, 1)} = ${f(vb, 1)} mL`] },
            { tipo: 'sentido', texto: `Milimoles entre mol/L da mililitros. De vuelta: ${f(cb, 1)} · ${f(vb, 1)} ≈ ${f(cb * vb, 2)} mmol de base, lo que pide la ecuación.` },
          ],
          respuesta: [V, ` = ${f(vb, 1)} mL de ${P.base}`],
        };
      },
    },
    ahoraTu: {
      voz: 'De volumen a moles, y los coeficientes en el medio.',
      generar(s) {
        const { P, ca, va, cb, na, nb, vb } = casoNeutra(azar(s), s);
        return {
          pregunta: [`¿Qué volumen de ${P.base} ${f(cb, 1)} mol/L neutraliza ${f(va, 0)} mL de ${P.acido} ${f(ca, 1)} mol/L? (${P.ec})`],
          opciones: opciones(vb, [
            { id: 'sin-coef', valor: na / cb, error: 'QM-COEF', siFuera: 'Eso supone relación 1 a 1. Revisa los coeficientes.' },
            { id: 'inv-coef', valor: na * P.a / P.b / cb, error: 'QM-COEF', siFuera: 'Eso usa los coeficientes al revés.' },
            { id: 'c1v1', valor: ca * va * cb, error: 'QM-C1V1', siFuera: 'Eso multiplica las concentraciones; se dividen los moles entre c.' },
          ], x => `${f(x, 1)} mL`),
          solucion: { texto: `${f(na, 2)} mmol de ácido piden ${f(nb, 2)} mmol de base.`, ecuacion: [V, ` = ${f(nb, 2)} / ${f(cb, 1)} = ${f(vb, 1)} mL`] },
        };
      },
    },
  };

  // ---------- Laboratorio ----------
  // Mezcla: los tres vasos usan la misma escala (600 mL llenan el vaso), para que los niveles se comparen a simple vista.
  const cMezcla = val => (val.ca * val.va + val.cb * val.vb) / (val.va + val.vb);
  // Animación: en el tercer vaso, las bolitas de A empiezan en su lado (izquierda, en proporción a su volumen) y las de B
  // en el otro; se van mezclando solas hasta quedar parejas. La fracción mezclada sigue 1 − e^(−t/1,2) (se acerca a lo
  // uniforme sin llegar de golpe; modelo cualitativo de difusión). La concentración final vale cuando ya está pareja.
  const mezclado = val => (val.t === undefined ? 1 : 1 - Math.exp(-val.t / 1.2));
  const enMezcla = (val, ka, kb) => {
    const fa = val.va / (val.va + val.vb), p = mezclado(val), out = [];
    const sitio = (j, lo, hi) => { const r = azar(j * 7 + ka * 31 + kb * 97 + 3); return [lo + (hi - lo) * r(), 0.08 + 0.84 * r()]; };
    for (let j = 0; j < ka + kb; j++) {
      const [x0, y0] = j < ka ? sitio(j, 0.06, 0.06 + 0.88 * fa) : sitio(j, 0.06 + 0.88 * fa, 0.94), [x1, y1] = sitio(j + 500, 0.06, 0.94);
      out.push({ e: 'ion', n: 1, x: x0 + (x1 - x0) * p, y: y0 + (y1 - y0) * p });
    }
    return out;
  };
  const mezclaLab = val => {
    const ka = Math.round(val.ca * val.va / 10), kb = Math.round(val.cb * val.vb / 10);
    return lupa([
      { titulo: 'A', forma: 'vaso', nivel: val.va / 600, rotulo: `${f(val.ca, 1)} M`, particulas: [{ e: 'ion', n: ka }] },
      { titulo: 'B', forma: 'vaso', nivel: val.vb / 600, rotulo: `${f(val.cb, 1)} M`, particulas: [{ e: 'ion', n: kb }] },
      { titulo: 'Mezcla', forma: 'vaso', nivel: (val.va + val.vb) / 600, rotulo: `${f(cMezcla(val), 2)} M`, particulas: enMezcla(val, ka, kb) },
    ], { alto: 190, separacion: 18, flechas: true, agita: val.t, agitaAmp: 1.5,
      alt: `Vaso A con ${f(val.va, 0)} mL a ${f(val.ca, 1)} mol/L (${ka} bolitas) y vaso B con ${f(val.vb, 0)} mL a ${f(val.cb, 1)} mol/L (${kb} bolitas); la mezcla tiene ${ka + kb} bolitas en ${f(val.va + val.vb, 0)} mL: ${f(cMezcla(val), 3)} mol/L.` });
  };
  // Solubilidad entre dos temperaturas de la tabla: interpolación lineal (aproximación para jugar, no un dato de tabla).
  const solDe = (sal, T) => {
    const tabla = sal === 'KNO3' ? KNO3 : NACL, ts = Object.keys(tabla).map(Number).sort((a, b) => a - b);
    for (let i = 0; i < ts.length - 1; i++) if (T >= ts[i] && T <= ts[i + 1]) return tabla[ts[i]] + (tabla[ts[i + 1]] - tabla[ts[i]]) * (T - ts[i]) / (ts[i + 1] - ts[i]);
    return tabla[ts[ts.length - 1]];
  };
  const salLab = val => ejesSol({
    curvas: [{ puntos: curvaDe(KNO3), rotulo: 'KNO₃', en: [72, 144], discontinua: val.s !== 'KNO3' }, { puntos: curvaDe(NACL), discontinua: val.s !== 'NACL', rotulo: 'NaCl', en: [70, 37] }],
    puntos: [{ x: val.T, y: val.m, color: 'd', rotulo: `${f(val.m, 0)} g`, guias: true }, { x: val.T, y: solDe(val.s, val.T), color: 'd', abierto: true }],
    alt: `Curvas de solubilidad del KNO₃ y del NaCl; el punto marca ${f(val.m, 0)} g a ${f(val.T, 0)} °C y la curva de la sal elegida da ${f(solDe(val.s, val.T), 1)} g.`,
  });

  return {
    unidad: 'quimica.soluciones',
    version: '0.2.0',
    estado: 'completa',
    requiere: ['/nucleo/kit/piezas/quim-particulas.js', '/nucleo/kit/piezas/ejes.js'],
    historia: {
      texto: 'Algunas mezclas se ven uniformes y, sin embargo, se comportan distinto al atravesar una membrana. En 1861, Thomas Graham estudió esa diferencia y separó coloides de cristaloides. Más tarde, van ’t Hoff relacionó las disoluciones diluidas con leyes cuantitativas. Separar cantidad de soluto, volumen y tamaño de partícula explica por qué diluir, filtrar y dializar son operaciones diferentes.',
      pregunta: '¿Cómo sabrías si un líquido transparente lleva algo disuelto?',
      fuente: { titulo: 'OpenStax, Chemistry 2e, §3.3 y §11.3', url: 'https://openstax.org/books/chemistry-2e/pages/3-3-molarity' },
    },
    // Glosario (docs/teoria.md §4d): las palabras que la unidad estrena en el curso. Los ejemplos se calculan aquí.
    glosario: [
      { termino: 'solución', def: 'Mezcla homogénea en la que lo disperso son moléculas o iones sueltos, de menos de 1 nm.',
        ejemplo: 'Agua con sal: transparente, pasa el filtro y no se asienta.', ver: ['soluto', 'solvente', 'mezcla homogénea'] },
      { termino: 'soluto', def: 'Lo que se disuelve y queda repartido en el solvente; suele estar en menor cantidad.',
        ejemplo: 'En el agua salada, la sal.', ver: ['solvente', 'concentración'] },
      { termino: 'solvente', def: 'Lo que disuelve al soluto y está en mayor cantidad; en esta unidad, casi siempre el agua.',
        ver: ['soluto'] },
      { termino: 'coloide', def: 'Mezcla con grupitos de 1 a 1000 nm que no se asientan y desvían un haz de luz.',
        ejemplo: 'La leche y la gelatina.', ver: ['efecto Tyndall', 'suspensión'] },
      { termino: 'suspensión', def: 'Mezcla con grumos de más de 1000 nm: en reposo caen al fondo y el filtro los retiene.',
        ejemplo: 'Agua con arena recién agitada.', ver: ['coloide'] },
      { termino: 'efecto Tyndall', def: 'Un haz de luz se ve como una franja al cruzar un coloide, porque sus grupitos lo desvían.',
        ver: ['coloide'] },
      { termino: 'solubilidad', medida: 'g/100 g de agua', def: 'Masa máxima de una sustancia que se disuelve en 100 g de agua a cierta temperatura.',
        ejemplo: `KNO₃ a 20 °C: ${f(KNO3[20], 1)} g en 100 g de agua.`, ver: ['curva de solubilidad', 'solución saturada'] },
      { termino: 'curva de solubilidad', def: 'Gráfica de lo máximo que se disuelve en 100 g de agua a cada temperatura.',
        ejemplo: `El KNO₃ sube de ${f(KNO3[0], 1)} g a 0 °C hasta ${f(KNO3[80], 0)} g a 80 °C.`, ver: ['solubilidad'] },
      { termino: 'solución saturada', formas: ['solución saturada', 'soluciones saturadas', 'saturada', 'saturadas'],
        def: 'La que ya tiene disuelto lo máximo a esa temperatura: lo que se añada queda sólido.',
        ejemplo: `KNO₃ a 60 °C con ${f(KNO3[60], 0)} g en 100 g de agua.`, ver: ['solubilidad'] },
      { termino: 'concentración', simbolo: 'c', def: 'Cuánto soluto hay en cada porción de solución. No depende de cuánta solución tomes.',
        ejemplo: `0,020 mol en 0,100 L: c = ${f(0.02 / 0.1, 2)} mol/L.`, ver: ['molaridad', 'dilución'] },
      { termino: 'molaridad', medida: 'mol/L', def: 'Moles de soluto en cada litro de solución.',
        ejemplo: `0,25 mol de NaOH en 0,5 L: ${f(0.25 / 0.5, 2)} mol/L.`, ver: ['concentración', 'molalidad'] },
      { termino: 'molalidad', simbolo: 'b', medida: 'mol/kg', def: 'Moles de soluto por cada kilogramo de solvente, no de solución.',
        ejemplo: `0,25 mol en 0,510 kg de agua: b = ${f(0.25 / 0.51, 2)} mol/kg.`, ver: ['molaridad'] },
      { termino: 'normalidad', simbolo: 'N', medida: 'eq/L', def: 'Molaridad multiplicada por los H⁺ u OH⁻ que aporta cada unidad del soluto.',
        ejemplo: `H₂SO₄ 0,10 mol/L da dos H⁺: N = ${f(2 * 0.1, 2)} eq/L.`, ver: ['molaridad'] },
      { termino: 'dilución', def: 'Añadir solvente: la cantidad de soluto se conserva y la concentración baja.',
        ejemplo: `100 mL a 0,20 mol/L llevados a 250 mL: ${f(0.2 * 100 / 250, 3)} mol/L.`, ver: ['concentración'] },
      { termino: 'milimol', simbolo: 'mmol', formas: ['milimol', 'milimoles'], def: 'La milésima parte de un mol. Conviene con volúmenes chicos, medidos en mL.',
        ejemplo: `0,10 mol/L por 25 mL da ${f(0.1 * 25, 1)} mmol.`, ver: ['molaridad'] },
      { termino: 'porcentaje en masa', simbolo: '%m/m', def: 'Gramos de soluto por cada 100 g de solución.',
        ejemplo: `10 g de soluto en 520 g de solución: ${f(1000 / 520, 2)} %.`, ver: ['concentración'] },
    ],
    // Laboratorio (docs/teoria.md §4b): mesas sin preguntas. La primera mezcla dos soluciones del mismo soluto, cada una
    // con su c y su V (los niveles se arrastran): el tercer vaso muestra la mezcla, que la idea 4 solo da en «Mira». La
    // segunda pone dos sales sobre la curva, con temperaturas y masas intermedias. Las lecturas dicen entradas y resultado.
    laboratorio: [
      {
        id: 'mezcla-dos', titulo: 'Mezcla dos soluciones', pieza: 'quim-particulas',
        consigna: 'Recién vertidas, A y B se mezclan solas en el tercer vaso. Elige c y V, y mira cuándo la mezcla queda pareja.',
        controles: [
          { id: 'ca', etiqueta: 'c A', color: 'c-h', min: 0.1, max: 0.4, paso: 0.1, inicio: 0.2, unidad: 'mol/L', decimales: 1 },
          { id: 'va', etiqueta: 'V A', color: 'c-i', min: 100, max: 300, paso: 100, inicio: 200, unidad: 'mL', decimales: 0 },
          { id: 'cb', etiqueta: 'c B', color: 'c-h', min: 0.1, max: 0.4, paso: 0.1, inicio: 0.4, unidad: 'mol/L', decimales: 1 },
          { id: 'vb', etiqueta: 'V B', color: 'c-i', min: 100, max: 300, paso: 100, inicio: 100, unidad: 'mL', decimales: 0 },
          { id: 't', etiqueta: 't', color: 'c-h', min: 0, max: 6, paso: 0.5, inicio: 0, unidad: 's', decimales: 1, auto: { velocidad: 1 } },
        ],
        dibujo: val => mezclaLab(val),
        lectura: val => [`Mezclado ${f(100 * mezclado(val), 0)} % · al final `, c, ` = ${f(cMezcla(val), 3)} M`],
        arrastres: [
          { id: 'nivel-a', etiqueta: 'nivel del vaso A', color: 'c-i', donde: val => superficie(mezclaLab(val), 0), mover: (pt, val) => ({ va: nivelEn(mezclaLab(val), pt.y) * 600 }) },
          { id: 'nivel-b', etiqueta: 'nivel del vaso B', color: 'c-i', donde: val => superficie(mezclaLab(val), 1), mover: (pt, val) => ({ vb: nivelEn(mezclaLab(val), pt.y) * 600 }) },
        ],
        // Retos (docs/teoria.md §4d): los comprueba cMezcla, la misma cuenta que rotula el vaso de la mezcla.
        invitaciones: [
          { texto: 'Consigue una mezcla de 0,25 M con A y B de concentraciones distintas.',
            logrado: val => val.ca !== val.cb && Math.abs(cMezcla(val) - 0.25) < 1e-9,
            bien: 'Se suman los moles, no las concentraciones. ¿Hay otra pareja que dé 0,25?' },
          { texto: 'Haz que la mezcla quede justo a la mitad entre A y B.',
            logrado: val => val.ca !== val.cb && Math.abs(cMezcla(val) - (val.ca + val.cb) / 2) < 1e-9,
            bien: 'Solo pasa con volúmenes iguales. ¿Y si B tuviera el triple?' },
          { texto: 'Con A a 0,1 M, logra que la mezcla pase de 0,3 M.',
            logrado: val => val.ca === 0.1 && cMezcla(val) > 0.3,
            bien: 'B tiene que poner mucho más volumen. Aun así, nunca llega a 0,4 M.' },
          { texto: 'Pausa la mezcla cuando ya esté casi pareja: más del 95 % mezclado.',
            logrado: val => mezclado(val) > 0.95,
            bien: 'Ya no se distingue qué bolita vino de A: recién ahí vale esa c.',
            pista: 'Espera a que la lectura pase del 95 % y pausa; ajusta t con − y +.' },
          { texto: 'Guarda dos mezclas con la misma concentración y distinto volumen total.',
            logrado: (val, guardados) => guardados.some(g => g.va + g.vb !== val.va + val.vb && Math.abs(cMezcla(g) - cMezcla(val)) < 1e-9)
              && guardados.some(g => g.ca === val.ca && g.va === val.va && g.cb === val.cb && g.vb === val.vb),
            bien: 'Misma concentración, distinta cantidad de soluto: c no cuenta cuánto hay.' },
        ],
      },
      {
        id: 'dos-sales', titulo: 'Dos sales en la curva', pieza: 'ejes',
        consigna: 'Elige la sal y arrastra el punto: temperatura y masa echada en 100 g de agua. ¿Cuál se separa al enfriar?',
        controles: [
          { id: 's', etiqueta: 'Sal', opciones: [{ valor: 'KNO3', texto: 'KNO₃' }, { valor: 'NACL', texto: 'NaCl' }] },
          { id: 'T', etiqueta: 'T', min: 0, max: 80, paso: 5, inicio: 60, unidad: '°C', decimales: 0 },
          { id: 'm', etiqueta: 'm', color: 'c-d', min: 5, max: 175, paso: 5, inicio: 100, unidad: 'g', decimales: 0 },
        ],
        dibujo: val => ({ datos: salLab(val), estado: {} }),
        lectura: val => { const sT = solDe(val.s, val.T); return [`${val.s === 'KNO3' ? 'KNO₃' : 'NaCl'} · ${f(val.T, 0)} °C · ${f(val.m, 0)} g → ${val.m <= sT ? `caben ${f(sT - val.m, 1)} g más` : `sobran ${f(val.m - sT, 1)} g`}`]; },
        arrastres: [{ id: 'punto', etiqueta: 'punto (temperatura, masa echada)', color: 'c-d',
          donde: val => { const g = EJ(salLab(val)); return { x: g.X(val.T), y: g.Y(val.m) }; },
          mover: (pt, val) => { const q = xyEn(salLab(val), pt); return { T: q.x, m: q.y }; } }],
        // Retos: los comprueba solDe, la misma curva que se dibuja.
        invitaciones: [
          { texto: 'Pon el punto justo sobre la curva de solubilidad: solución saturada.',
            logrado: val => Math.abs(val.m - solDe(val.s, val.T)) < 2.5,
            bien: 'Sobre la curva no cabe ni un gramo más. ¿Qué pasa si enfrías un poco?' },
          { texto: 'Con NaCl, haz que sobre sal sin disolver.',
            logrado: val => val.s === 'NACL' && val.m > solDe(val.s, val.T),
            bien: 'Con la sal común, calentar casi no ayuda: su curva es casi plana.' },
          { texto: 'Busca la menor temperatura que disuelve 50 g de KNO₃ por completo.',
            logrado: val => val.s === 'KNO3' && val.m === 50 && solDe('KNO3', val.T) >= 50 && solDe('KNO3', val.T - 5) < 50,
            bien: 'Cinco grados menos y ya sobra sólido. La curva manda.' },
          { texto: 'Guarda dos casos de KNO₃ con la misma masa: uno disuelto y otro con sólido.',
            logrado: (val, guardados) => val.s === 'KNO3' && guardados.some(g => g.s === 'KNO3' && g.m === val.m && (g.m <= solDe('KNO3', g.T)) !== (val.m <= solDe('KNO3', val.T)))
              && guardados.some(g => g.s === val.s && g.T === val.T && g.m === val.m),
            bien: 'La misma masa, otra temperatura: enfriar separa el KNO₃.' },
        ],
      },
    ],
    // A qué idea pertenece cada mesa del laboratorio (Gerson, 16 nov: el laboratorio se agrupa por idea). Una lista vacía:
    // la mesa no practica ninguna idea de la unidad y va en «Más mesas del tema».
    laboratorioIdeas: {
      'mezcla-dos': ['concentracion'],
      'dos-sales': ['curva-solubilidad'],
    },
    ideas: [dispersos, solubilidad, concentracion, dilucion, esteq],
  };
});
