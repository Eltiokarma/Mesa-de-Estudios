/*
 * Teoría de «Materia y energía» (quimica.materia-y-energia). Molde: docs/teoria.md y la unidad de referencia
 * contenido/teoria/fisica/movimiento-rectilineo.js. Compañera: Bruna (castora), voz resolutiva y cálida.
 * Fuente del contenido: docs/teoria/matriz/quimica.json (unidad 1), docs/teoria/fuentes/historia-ecuaciones-1.pdf
 * (p. 25) y las precisiones de Química del expediente. Errores: docs/investigacion/quimica-materia-nomenclatura-
 * organica-ideas-erroneas.md (MA), atomo-enlace (EN, AT) y gases-soluciones (GQ); los QM- son hipótesis nuevas.
 *
 * Ficha de tarea (diseno-y-animacion)
 *   Promesa: clasificar una muestra por sus partículas y decidir qué hace el calor y la energía con ella.
 *   Persona y condiciones: postulante de 3.º–5.º, celular de gama baja a 360 px, sin audio, a veces sin conexión.
 *   Resultado observable: clasifica una muestra nueva, dice si un cambio es físico, químico o nuclear y calcula
 *     Q = mcΔT, Q = mL y E = Δm·c² con sus unidades.
 *   Orden de atención: 1.º la lupa (qué partículas hay) · 2.º la lectura en vivo · acción: probar casos · fondo: Bruna.
 *   Estados: juego sin tocar · casos probados · predicción abierta · revelado · paso a paso · caso nuevo · acierto · «No sé».
 *   Duda que resuelve: ¿lo uniforme es puro?, ¿el calor siempre sube la temperatura?, ¿de dónde sale la energía nuclear?
 *
 * Colores (regla 4): m masa (y Δm) turquesa c-i, Q calor naranja c-o, T temperatura rojo c-h, E energía verde c-d.
 * En las ideas de partículas, los átomos llevan color y relleno propio (O rojo lleno, H turquesa hueco, Na naranja con
 * punto, Cl verde, C tinta): no comparten pantalla con las variables.
 * Fuentes (no van al alumno): OpenStax Chemistry 2e §1.2 y §10.3; IUPAC; NIST (c = 299 792 458 m/s, aquí 3 × 10⁸).
 */
(function (root, fabrica) {
  const def = fabrica(typeof module === 'object' && module.exports ? require('../../../nucleo/kit/kit.js') : root.Kit);
  if (typeof module === 'object' && module.exports) module.exports = def;
  else root.Teoria.unidad(def);
})(typeof self !== 'undefined' ? self : this, function (Kit) {
  'use strict';
  const f = (n, d = 2) => Kit.formatear(n, d);
  const m = { v: 'c-i', t: 'm' }, Q = { v: 'c-o', t: 'Q' }, Tm = { v: 'c-h', t: 'T' }, E = { v: 'c-d', t: 'E' };
  const dT = ['Δ', Tm], dm = ['Δ', m];
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
  // 9 × 10¹³ (notación científica con superíndices).
  const SUP = { '-': '⁻', 0: '⁰', 1: '¹', 2: '²', 3: '³', 4: '⁴', 5: '⁵', 6: '⁶', 7: '⁷', 8: '⁸', 9: '⁹' };
  function cien(x, d = 1) {
    if (x === 0) return '0';
    let e = Math.floor(Math.log10(Math.abs(x))), mant = x / 10 ** e;
    if (Math.abs(+mant.toFixed(d)) >= 10) { e += 1; mant /= 10; }
    return `${f(mant, d)} × 10${String(e).split('').map(c => SUP[c]).join('')}`;
  }

  // ---------- Partículas: átomos y especies de la unidad ----------
  const ATOMOS = { O: { color: 'h', estilo: 'lleno', r: 6 }, H: { color: 'i', estilo: 'hueco', r: 4.5 }, Na: { color: 'o', estilo: 'punto', r: 6 },
    Cl: { color: 'd', estilo: 'lleno', r: 7 }, C: { estilo: 'lleno', r: 5 }, N: { color: 'o', estilo: 'hueco', r: 6 }, He: { color: 'd', estilo: 'punto', r: 5 } };
  const ESPECIES = {
    O2: [['O', -5, 0], ['O', 5, 0]], N2: [['N', -5, 0], ['N', 5, 0]], H2: [['H', -4, 0], ['H', 4, 0]],
    H2O: [['O', 0, -1], ['H', -6, 4], ['H', 6, 4]], CO2: [['C', 0, 0], ['O', -9, 0], ['O', 9, 0]], He: [['He', 0, 0]],
    Na: [['Na', 0, 0]], Cl: [['Cl', 0, 0]], C: [['C', 0, 0]], N: [['N', 0, 0]],
    aceite: [['C', -9, 0], ['C', -3, -2], ['C', 3, 0], ['C', 9, -2]], azucar: [['C', -6, -3], ['C', 0, -3], ['C', 6, -3], ['O', -3, 4], ['O', 3, 4]],
  };
  const lupa = (cajas, extra = {}) => ({ datos: Object.assign({ atomos: ATOMOS, especies: ESPECIES, alto: 150, separacion: 24, cajas }, extra), estado: {} });
  // Una partícula por casilla de una rejilla dentro de [x0, x1] × [y0, y1] (fracciones de la región): capas, sólidos.
  function rejilla(e, n, cols, x0, x1, y0, y1, extra = {}) {
    const filas = Math.ceil(n / cols), out = [];
    for (let k = 0; k < n; k++) {
      const c = k % cols, fl = Math.floor(k / cols);
      out.push(Object.assign({ e, n: 1, x: x0 + (x1 - x0) * (cols === 1 ? 0.5 : c / (cols - 1)), y: y0 + (y1 - y0) * (filas === 1 ? 0.5 : fl / (filas - 1)) }, extra));
    }
    return out;
  }

  // ---------- Idea 1: sustancia o mezcla se decide con la lupa ----------
  // Cambia: la muestra · Permanece: la caja y la escala de la lupa · Progresa: de una especie a varias, de una fase
  // a dos · Se reserva: la mezcla que se ve uniforme (agua con azúcar) · Debe verse: cuántas especies hay.
  const MUESTRAS = {
    oxigeno: { titulo: 'Oxígeno', caja: { forma: 'cilindro', nivel: 0.95, particulas: [{ e: 'O2', n: 8 }] }, lee: 'Oxígeno: 1 especie, 1 elemento. Sustancia simple.' },
    agua: { titulo: 'Agua', caja: { forma: 'vaso', nivel: 0.85, particulas: [{ e: 'H2O', n: 14 }] }, lee: 'Agua: 1 especie, 2 elementos. Compuesto.' },
    salada: { titulo: 'Agua salada', caja: { forma: 'vaso', nivel: 0.85, particulas: [{ e: 'H2O', n: 10 }, { e: 'Na', n: 3 }, { e: 'Cl', n: 3 }] }, lee: 'Agua salada: 3 especies, una fase. Mezcla homogénea.' },
    aceite: { titulo: 'Agua y aceite', caja: { forma: 'vaso', nivel: 0.9, particulas: [...rejilla('aceite', 6, 3, 0.18, 0.82, 0.1, 0.3), ...rejilla('H2O', 9, 3, 0.15, 0.85, 0.55, 0.92)] }, lee: 'Agua y aceite: 2 especies, dos fases. Mezcla heterogénea.' },
  };
  const muestra = k => lupa([Object.assign({ titulo: MUESTRAS[k].titulo }, MUESTRAS[k].caja)]);
  const sustancia = {
    id: 'sustancia-mezcla',
    titulo: 'Sustancia o mezcla: mira dentro',
    temas: ['Qué estudia la química', 'Sustancias y mezclas'],
    pieza: 'quim-particulas',
    juega: {
      consigna: 'Elige una muestra y mira sus partículas con la lupa. Cuenta cuántas especies distintas hay y si forman una o dos capas.',
      voz: 'Mira primero cuántas clases de partícula hay. El aspecto viene después.',
      controles: [{ id: 'k', etiqueta: 'Muestra', opciones: Object.keys(MUESTRAS).map(k => ({ valor: k, texto: MUESTRAS[k].titulo })) }],
      dibujo: val => muestra(val.k),
      lectura: val => [MUESTRAS[val.k].lee],
      minimo: 3,
    },
    predice: {
      pregunta: 'Agua con azúcar bien disuelta se ve igual que agua pura: transparente y uniforme. Mirada con la lupa, ¿qué es?',
      voz: 'Anota tu predicción antes de abrir la lupa.',
      opciones: [
        { id: 'c', texto: 'Una mezcla homogénea', correcta: true },
        { id: 'pura', texto: 'Una sustancia pura, porque se ve uniforme', error: 'MA10', siFuera: 'Se ve uniforme, es cierto. Sería pura si la lupa mostrara una sola especie de partícula.' },
        { id: 'compuesto', texto: 'Un compuesto, porque tiene varios elementos', error: 'MA9', siFuera: 'Tiene varios elementos, sí. Un compuesto es una sola especie; aquí hay dos especies sueltas.' },
        { id: 'hetero', texto: 'Una mezcla heterogénea, porque tiene dos sustancias', error: 'QM-HOMO', siFuera: 'Hay dos sustancias, bien visto. Sería heterogénea si formaran dos fases separadas.' },
      ],
      dibujo: lupa([{ titulo: 'Agua con azúcar', forma: 'vaso', nivel: 0.85, particulas: [] }]),
      revelar: lupa([{ titulo: 'Agua con azúcar', forma: 'vaso', nivel: 0.85, particulas: [{ e: 'H2O', n: 11 }, { e: 'azucar', n: 3 }] }]),
      coincide: 'Coincide: dos especies repartidas en una sola fase.',
      noCoincide: 'La lupa muestra dos especies mezcladas en una sola fase.',
    },
    mira: {
      datos: lupa([
        { titulo: 'Oxígeno', forma: 'caja', particulas: [{ e: 'O2', n: 5, desde: 1 }] },
        { titulo: 'Agua', forma: 'caja', particulas: [{ e: 'H2O', n: 5, desde: 2 }] },
        { titulo: 'Agua salada', forma: 'caja', particulas: [{ e: 'H2O', n: 4, desde: 3 }, { e: 'Na', n: 2, desde: 3 }, { e: 'Cl', n: 2, desde: 3 }] },
      ], { separacion: 26 }).datos,
      voz: 'Comparemos las tres cajas especie por especie.',
      pasos: [
        { estado: { corte: 1 }, texto: 'Oxígeno: una sola especie, hecha de un solo elemento.', ecuacion: ['sustancia simple: O₂'] },
        { estado: { corte: 2 }, texto: 'Agua: una sola especie con dos elementos unidos.', ecuacion: ['compuesto: H₂O'] },
        { estado: { corte: 3 }, texto: 'Agua salada: varias especies sueltas en una sola fase.', ecuacion: ['mezcla homogénea: H₂O + Na⁺ + Cl⁻'] },
        { estado: { corte: 3 }, texto: 'La química estudia de qué está hecho algo y cómo se transforma.' },
      ],
    },
    regla: {
      texto: 'Una sustancia tiene una sola especie de partícula: elemento si es un tipo de átomo, compuesto si son varios unidos. Una mezcla tiene varias especies.',
      ecuacion: ['mezcla homogénea: una fase   ·   heterogénea: dos o más fases'],
      condicion: 'se decide por las partículas y las fases, no por el aspecto: algo transparente y uniforme puede ser una mezcla.',
      voz: 'Cuenta especies, después fases. En ese orden.',
    },
    ahoraTu: {
      pieza: 'quim-particulas',
      voz: 'Una muestra nueva. Cuenta especies y fases.',
      generar(s) {
        const r = azar(s);
        const tipo = ['elemento', 'compuesto', 'homogenea', 'heterogenea'][s % 4];
        let parts, n;
        if (tipo === 'elemento') { const e = r.de(['O2', 'N2', 'He', 'H2']); n = r.ent(6, 11); parts = [{ e, n }]; }
        else if (tipo === 'compuesto') { const e = r.de(['H2O', 'CO2']); n = r.ent(6, 11); parts = [{ e, n }]; }
        else if (tipo === 'homogenea') { const a = r.de([['N2', 'O2'], ['H2O', 'azucar'], ['O2', 'CO2'], ['H2O', 'Na']]); const na = r.ent(5, 8), nb = r.ent(2, 4); n = na + nb; parts = [{ e: a[0], n: na }, { e: a[1], n: nb }]; }
        else { const na = 3 * r.ent(1, 2), nb = 3 * r.ent(2, 3); n = na + nb; parts = [...rejilla('aceite', na, 3, 0.18, 0.82, 0.1, na > 3 ? 0.35 : 0.2), ...rejilla('H2O', nb, 3, 0.15, 0.85, 0.55, 0.92)]; }
        const forma = tipo === 'elemento' || (tipo === 'homogenea' && parts[0].e === 'N2') || (tipo === 'homogenea' && parts[0].e === 'O2') ? 'cilindro' : 'vaso';
        const nombres = { elemento: 'Sustancia simple (elemento)', compuesto: 'Compuesto', homogenea: 'Mezcla homogénea', heterogenea: 'Mezcla heterogénea' };
        const si = {
          elemento: 'Sería elemento si hubiera una sola especie con un solo tipo de átomo.',
          compuesto: 'Sería compuesto si hubiera una sola especie con átomos de varios elementos unidos.',
          homogenea: 'Sería mezcla homogénea si hubiera varias especies repartidas en una sola fase.',
          heterogenea: 'Sería heterogénea si hubiera varias especies en fases separadas.',
        };
        const ops = Object.keys(nombres).map(k => (k === tipo ? { id: 'c', texto: nombres[k], correcta: true } : { id: k, texto: nombres[k], error: k === 'elemento' || k === 'compuesto' ? 'MA9' : 'MA10', siFuera: si[k] }));
        const porque = { elemento: 'Una sola especie, de un solo elemento.', compuesto: 'Una sola especie, con átomos de dos elementos unidos.', homogenea: 'Dos especies repartidas en una sola fase.', heterogenea: 'Dos especies en dos capas separadas.' };
        return {
          pregunta: `Con la lupa se ven ${n} partículas en la muestra. ¿Cómo se clasifica?`,
          dibujo: lupa([{ titulo: 'Muestra', forma, nivel: 0.9, particulas: parts }]),
          opciones: ops,
          solucion: { texto: porque[tipo], ecuacion: [nombres[tipo]] },
        };
      },
    },
  };

  // ---------- Idea 2: físico, químico o nuclear: ¿qué partícula cambia? ----------
  // Cambia: el proceso · Permanece: antes a la izquierda, después a la derecha, misma lupa · Progresa: de cambiar el
  // orden (estado) a cambiar las moléculas y, al final, el núcleo · Se reserva: el inventario de átomos que no
  // cambia en la reacción · Debe verse: si las partículas de después son las mismas de antes.
  const solido = e => rejilla(e, 9, 3, 0.2, 0.8, 0.45, 0.95);
  const PROCESOS = {
    funde: { texto: 'Fundir hielo', antes: { titulo: 'Hielo', forma: 'vaso', nivel: 0.95, particulas: solido('H2O') }, despues: { titulo: 'Agua', forma: 'vaso', nivel: 0.6, particulas: [{ e: 'H2O', n: 9 }] }, lee: 'Mismas moléculas, otro orden: cambio físico de estado.' },
    hierve: { texto: 'Hervir agua', antes: { titulo: 'Agua', forma: 'vaso', nivel: 0.6, particulas: [{ e: 'H2O', n: 9 }] }, despues: { titulo: 'Vapor', forma: 'cilindro', nivel: 1, particulas: [{ e: 'H2O', n: 5 }] }, lee: 'Mismas moléculas, más separadas: cambio físico de estado.' },
    disuelve: { texto: 'Disolver sal', antes: { titulo: 'Sal y agua', forma: 'vaso', nivel: 0.8, particulas: [...rejilla('Na', 2, 2, 0.3, 0.7, 0.85, 0.85), ...rejilla('Cl', 2, 2, 0.4, 0.8, 0.95, 0.95), ...rejilla('H2O', 6, 3, 0.15, 0.85, 0.1, 0.55)] }, despues: { titulo: 'Agua salada', forma: 'vaso', nivel: 0.8, particulas: [{ e: 'H2O', n: 6 }, { e: 'Na', n: 2 }, { e: 'Cl', n: 2 }] }, lee: 'Mismas partículas, ahora mezcladas: cambio físico.' },
    quema: { texto: 'Quemar hidrógeno', antes: { titulo: 'H₂ y O₂', forma: 'caja', particulas: [{ e: 'H2', n: 4 }, { e: 'O2', n: 2 }] }, despues: { titulo: 'Agua', forma: 'caja', particulas: [{ e: 'H2O', n: 4 }] }, lee: 'Aparecen moléculas nuevas con los mismos átomos: cambio químico.' },
    decae: { texto: 'Carbono-14 que decae', antes: { titulo: 'Carbono-14', forma: 'caja', particulas: [{ e: 'C', n: 6 }] }, despues: { titulo: 'Después', forma: 'caja', particulas: [{ e: 'C', n: 3 }, { e: 'N', n: 3, resalta: true }] }, lee: 'Cambia el núcleo: el átomo pasa a otro elemento. Nuclear.' },
  };
  const proceso = k => lupa([PROCESOS[k].antes, PROCESOS[k].despues], { flechas: true });
  const cambios = {
    id: 'fisico-quimico-nuclear',
    titulo: '¿Qué partícula cambia?',
    temas: ['Estados de agregación', 'Propiedades físicas y químicas', 'Fenómenos físicos, químicos y nucleares'],
    pieza: 'quim-particulas',
    juega: {
      consigna: 'Elige un proceso. A la izquierda está antes y a la derecha, después. Compara las partículas de las dos cajas.',
      voz: 'Una observación no es una explicación: mira qué partículas hay después.',
      controles: [{ id: 'k', etiqueta: 'Proceso', opciones: Object.keys(PROCESOS).map(k => ({ valor: k, texto: PROCESOS[k].texto })) }],
      dibujo: val => proceso(val.k),
      lectura: val => [PROCESOS[val.k].lee],
      minimo: 3,
    },
    predice: {
      pregunta: 'Hierves agua pura en una olla y suben burbujas grandes desde el fondo. ¿Qué hay dentro de esas burbujas?',
      voz: 'Piensa en qué le pasa a cada molécula de agua.',
      opciones: [
        { id: 'c', texto: 'Moléculas de agua en estado gaseoso', correcta: true },
        { id: 'hyo', texto: 'Hidrógeno y oxígeno separados', error: 'EN13', siFuera: 'Separar H y O sería un cambio químico. Al hervir, cada molécula de agua sigue entera.' },
        { id: 'aire', texto: 'Aire que estaba disuelto en el agua', error: 'QM-AIRE', siFuera: 'Al calentar salen burbujitas de aire disuelto, cierto. Las grandes del hervor son de vapor.' },
        { id: 'vacio', texto: 'Nada: son espacios vacíos', error: 'QM-VACIO', siFuera: 'Entre partículas sí hay vacío. Pero la burbuja está llena de moléculas de agua separadas.' },
      ],
      dibujo: lupa([{ titulo: 'Agua', forma: 'vaso', nivel: 0.6, particulas: [{ e: 'H2O', n: 9 }] }, { titulo: 'Burbuja', forma: 'caja', particulas: [] }], { flechas: true }),
      revelar: lupa([{ titulo: 'Agua', forma: 'vaso', nivel: 0.6, particulas: [{ e: 'H2O', n: 9 }] }, { titulo: 'Burbuja', forma: 'caja', particulas: [{ e: 'H2O', n: 4 }] }], { flechas: true }),
      coincide: 'Coincide: la burbuja tiene las mismas moléculas, más separadas.',
      noCoincide: 'Dentro de la burbuja hay moléculas de agua enteras, solo más separadas.',
    },
    mira: {
      datos: lupa([
        { titulo: 'Antes', forma: 'caja', particulas: [{ e: 'H2', n: 4, desde: 1 }, { e: 'O2', n: 2, desde: 1 }], cuenta: [{ e: 'H', texto: '8', desde: 3 }, { e: 'O', texto: '4', desde: 3 }] },
        { titulo: 'Después', forma: 'caja', particulas: [{ e: 'H2O', n: 4, desde: 2 }], cuenta: [{ e: 'H', texto: '8', desde: 3 }, { e: 'O', texto: '4', desde: 3 }] },
      ], { flechas: true, separacion: 26 }).datos,
      voz: 'Revisemos el inventario de átomos antes y después.',
      pasos: [
        { estado: { corte: 1 }, texto: 'Antes: hidrógeno y oxígeno, dos especies distintas.', ecuacion: ['4 H₂ + 2 O₂'] },
        { estado: { corte: 2 }, texto: 'Después: una especie nueva, agua. Eso es un cambio químico.', ecuacion: ['→ 4 H₂O'] },
        { estado: { corte: 3 }, texto: 'Los átomos no cambian: 8 de H y 4 de O, solo reordenados.', ecuacion: ['H: 8 = 8   ·   O: 4 = 4'] },
        { estado: { corte: 3 }, texto: 'Al fundir o hervir, en cambio, las moléculas siguen siendo las mismas.' },
      ],
    },
    regla: {
      texto: 'Cambio físico: las mismas partículas cambian de orden o de estado. Químico: se forman especies nuevas con los mismos átomos. Nuclear: cambia el núcleo y el elemento.',
      ecuacion: ['2 H₂ + O₂ → 2 H₂O'],
      condicion: 'las propiedades físicas (fusión, densidad) se miden sin cambiar la sustancia; las químicas (arder, oxidarse) solo al transformarla.',
      voz: 'Primero el inventario de partículas; el aspecto puede engañar.',
    },
    ahoraTu: {
      voz: 'Decide por las partículas, no por lo que se ve.',
      generar(s) {
        const CASOS = [
          ['Un cubo de hielo se derrite en la mesa', 'fisico'], ['Un clavo de hierro se oxida al aire', 'quimico'],
          ['La leña arde en la cocina', 'quimico'], ['El azúcar se disuelve en el té', 'fisico'],
          ['El alcohol se evapora de un algodón', 'fisico'], ['Un núcleo de uranio-235 se parte en dos', 'nuclear'],
          ['La leche se agria con el tiempo', 'quimico'], ['Un vidrio se rompe en pedazos', 'fisico'],
          ['Un átomo de radio-226 emite una partícula alfa y pasa a radón', 'nuclear'], ['El vinagre y el bicarbonato hacen burbujas de CO₂', 'quimico'],
        ];
        const [caso, tipo] = CASOS[s % CASOS.length];
        const nom = { fisico: 'Físico', quimico: 'Químico', nuclear: 'Nuclear' };
        const si = { fisico: 'Sería físico si las mismas partículas solo cambiaran de orden o de estado.', quimico: 'Sería químico si aparecieran especies nuevas con los mismos átomos.', nuclear: 'Sería nuclear si cambiara el núcleo y, con él, el elemento.' };
        const err = { fisico: 'MA2', quimico: 'MA1', nuclear: 'QM-NUCLEAR' };
        const porque = { fisico: 'Las partículas son las mismas; solo cambian de orden o de lugar.', quimico: 'Se forman sustancias nuevas con los mismos átomos.', nuclear: 'Cambia el núcleo: el átomo pasa a ser de otro elemento.' };
        return {
          pregunta: `${caso}. ¿Qué tipo de cambio es?`,
          opciones: Object.keys(nom).map(k => (k === tipo ? { id: 'c', texto: nom[k], correcta: true } : { id: k, texto: nom[k], error: err[tipo === 'fisico' ? 'quimico' : k] || err[k], siFuera: si[k] })),
          solucion: { texto: porque[tipo], ecuacion: [`Cambio ${nom[tipo].toLowerCase()}`] },
        };
      },
    },
  };

  // ---------- Idea 3: calor sensible y latente (la meseta) ----------
  // Cambia: el calor entregado · Permanece: 10 g de hielo a −20 °C, a 1 atm, y los ejes · Progresa: subida, meseta,
  // subida · Se reserva: la meseta de 0 °C (la temperatura no sube aunque entra calor) · Debe verse: el tramo plano.
  const MASA = 10, C_HIELO = 2.1, C_AGUA = 4.18, LF = 334;               // g, J/(g·°C), J/g
  const Q1 = MASA * C_HIELO * 20 / 1000, Q2 = Q1 + MASA * LF / 1000, Q3 = Q2 + MASA * C_AGUA * 100 / 1000; // kJ
  function estadoCalor(q) {
    if (q <= Q1) return { T: -20 + q * 1000 / (MASA * C_HIELO), fase: 'hielo' };
    if (q <= Q2) return { T: 0, fase: 'fundiendo', frac: (q - Q1) / (Q2 - Q1) };
    if (q <= Q3) return { T: (q - Q2) * 1000 / (MASA * C_AGUA), fase: 'agua' };
    return { T: 100, fase: 'hierve' };
  }
  const CURVA = [[0, -20], [Q1, 0], [Q2, 0], [Q3, 100]];
  const ejesCalor = (extra = {}) => Object.assign({
    x: { min: 0, max: 8, paso: 1, nombre: 'Q', unidad: 'kJ', decimales: 0, color: 'o' },
    y: { min: -20, max: 100, paso: 20, nombre: 'T', unidad: '°C', decimales: 0, color: 'h' },
    curvas: [{ puntos: CURVA, color: 'h' }],
    alt: 'Curva de calentamiento de 10 g de hielo desde −20 °C: sube hasta 0 °C, se queda plana mientras se funde y después sube hasta 100 °C.',
  }, extra);
  const calor = {
    id: 'calor-sensible-latente',
    titulo: 'Calor que no sube temperatura',
    temas: ['Calor sensible y latente'],
    pieza: 'ejes',
    juega: {
      consigna: 'Entrega calor a 10 g de hielo que empiezan a −20 °C. Mira dónde queda el punto en la curva.',
      voz: 'Fíjate en el tramo donde el punto avanza sin subir.',
      controles: [{ id: 'q', etiqueta: 'Q', color: 'c-o', min: 0, max: 8, paso: 0.5, inicio: 0, unidad: 'kJ', decimales: 1 }],
      dibujo: val => { const e = estadoCalor(val.q); return { datos: ejesCalor({ puntos: [{ x: val.q, y: e.T, color: 'h', rotulo: `${f(e.T, 0)} °C` }] }), estado: {} }; },
      lectura: val => { const e = estadoCalor(val.q); return [Tm, ` = ${f(e.T, 1)} °C · ${e.fase === 'fundiendo' ? `fundido ${f(100 * e.frac, 0)} %` : e.fase}`]; },
      minimo: 3,
    },
    predice: {
      pregunta: ['Un cubo de 10 g de hielo a 0 °C recibe 1 kJ y todavía no termina de fundirse. ¿Cuánto subió su ', Tm, '?'],
      voz: 'Tómate tu tiempo; es una pregunta sobre la meseta.',
      opciones: [
        { id: 'c', texto: 'Nada: sigue a 0 °C', correcta: true },
        { id: 'formula', texto: `${f(1000 / (MASA * C_AGUA), 0)} °C, con Q = mcΔT`, error: 'MA6', siFuera: 'Q = mcΔT vale cuando no hay cambio de fase. Aquí el calor se usa en fundir.' },
        { id: 'algo', texto: 'Un poco: todo calor sube la temperatura', error: 'MA6', siFuera: 'Sería cierto fuera de la meseta. Mientras se funde, el calor rompe el orden del sólido.' },
        { id: 'baja', texto: 'Bajó, porque el hielo enfría', error: 'QM-ENFRIA', siFuera: 'El hielo enfría lo que lo rodea, sí. Él mismo recibe calor y no se enfría.' },
      ],
      dibujo: { datos: ejesCalor({ curvas: [{ puntos: CURVA.slice(0, 2), color: 'h' }], puntos: [{ x: Q1, y: 0, color: 'h', rotulo: '0 °C' }] }), estado: {} },
      revelar: { datos: ejesCalor({ puntos: [{ x: Q1, y: 0, color: 'h' }, { x: Q1 + 1, y: 0, color: 'h', rotulo: '+1 kJ: 0 °C', guias: true }] }), estado: {} },
      coincide: 'Coincide: en la meseta el calor funde y la temperatura no cambia.',
      noCoincide: 'Mientras se funde, el calor va al cambio de fase: la temperatura se queda en 0 °C.',
    },
    mira: {
      datos: ejesCalor({
        curvas: [{ puntos: CURVA.slice(0, 2), color: 'h', desde: 1 }, { puntos: CURVA.slice(1, 3), color: 'h', desde: 2 }, { puntos: CURVA.slice(2, 4), color: 'h', desde: 3 }],
        areas: [],
        puntos: [{ x: Q1, y: 0, color: 'o', rotulo: `${f(Q1, 2)} kJ`, desde: 1 }, { x: Q2, y: 0, color: 'o', rotulo: `${f(Q2, 2)} kJ`, desde: 2 }, { x: Q3, y: 100, color: 'o', rotulo: `${f(Q3, 2)} kJ`, desde: 3 }],
      }),
      voz: 'Separemos el calor tramo por tramo.',
      pasos: [
        { estado: { corte: 1 }, texto: 'El hielo sube de −20 °C a 0 °C: calor sensible.', ecuacion: [Q, ' = ', m, 'c', dT, ` = ${f(MASA, 0)} · ${f(C_HIELO)} · 20 = ${f(Q1 * 1000, 0)} J`] },
        { estado: { corte: 2 }, texto: 'A 0 °C se funde sin subir: calor latente.', ecuacion: [Q, ' = ', m, 'L', ` = ${f(MASA, 0)} · ${f(LF, 0)} = ${f(MASA * LF, 0)} J`] },
        { estado: { corte: 3 }, texto: 'El agua líquida sube de 0 °C a 100 °C.', ecuacion: [Q, ' = ', m, 'c', dT, ` = ${f(MASA, 0)} · ${f(C_AGUA)} · 100 = ${f(MASA * C_AGUA * 100, 0)} J`] },
        { estado: { corte: 3 }, texto: 'El total es la suma de los tres tramos.', ecuacion: [Q, ` = ${f(Q1 * 1000, 0)} + ${f(MASA * LF, 0)} + ${f(MASA * C_AGUA * 100, 0)} = ${f(Q3 * 1000, 0)} J`] },
      ],
    },
    regla: {
      texto: 'Sin cambio de fase, el calor sube la temperatura (calor sensible). Durante un cambio de fase, la temperatura no cambia y el calor va al cambio (calor latente).',
      ecuacion: [Q, ' = ', m, 'c', dT, '   ·   ', Q, ' = ', m, 'L'],
      condicion: 'solo para una sustancia pura a presión fija. A 1 atm el agua hierve a 100 °C; en Juliaca, a 87 °C.',
      voz: 'Antes de usar una fórmula, pregunta en qué tramo estás.',
    },
    ahoraTu: {
      voz: 'Decide primero si hay cambio de fase.',
      generar(s) {
        const r = azar(s);
        if (s % 2) {
          const mm = 10 * r.ent(2, 30), dt = 5 * r.ent(2, 12), q = mm * C_AGUA * dt;
          return {
            pregunta: ['¿Cuánto calor necesitan ', m, ` = ${f(mm, 0)} g de agua líquida para subir `, dT, ` = ${f(dt, 0)} °C? (c = 4,18 J/g·°C)`],
            opciones: opciones(q, [
              { id: 'sin-c', valor: mm * dt, error: 'QM-SIN-C', siFuera: 'Eso multiplica masa por grados. Falta la capacidad calorífica del agua.' },
              { id: 'latente', valor: mm * LF, error: 'MA6', siFuera: 'Eso sería fundir esa masa de hielo. Aquí el agua solo se calienta.' },
              { id: 'sin-m', valor: C_AGUA * dt, error: 'QM-SIN-M', siFuera: 'Eso sería para 1 g. Hay que multiplicar por la masa.' },
            ], n => `${f(n, 0)} J`),
            solucion: { texto: 'No hay cambio de fase: calor sensible.', ecuacion: [Q, ` = ${f(mm, 0)} · 4,18 · ${f(dt, 0)} = ${f(q, 0)} J`] },
          };
        }
        const mm = 5 * r.ent(2, 40), q = mm * LF;
        return {
          pregunta: ['¿Cuánto calor necesitan ', m, ` = ${f(mm, 0)} g de hielo a 0 °C para fundirse por completo? (L = 334 J/g)`],
          opciones: opciones(q, [
            { id: 'cero', valor: 0, error: 'QM-CERO', siFuera: 'La temperatura no cambia, cierto. Pero el calor sí entra: se gasta en fundir.' },
            { id: 'sensible', valor: mm * C_HIELO, error: 'MA6', siFuera: 'Eso usa la capacidad calorífica. En la fusión cuenta el calor latente.' },
            { id: 'sin-m', valor: LF, error: 'QM-SIN-M', siFuera: 'Eso alcanza para 1 g. Hay que multiplicar por la masa.' },
          ], n => `${f(n, 0)} J`),
          solucion: { texto: 'A 0 °C el hielo se funde sin subir de temperatura: calor latente.', ecuacion: [Q, ' = ', m, `L = ${f(mm, 0)} · 334 = ${f(q, 0)} J`] },
        };
      },
    },
  };

  // ---------- Idea 4: la energía nuclear sale de una pérdida de masa ----------
  // Cambia: la masa que desaparece · Permanece: la recta E = Δm·c² y sus ejes · Progresa: de mg a gramos; de lo
  // químico (no se nota) a lo nuclear (se nota) · Se reserva: el punto de la combustión, pegado al origen · Debe
  // verse: que E crece en proporción a Δm con una constante enorme.
  const C2 = 9e16;                                                      // c² en m²/s²
  const ejesMasa = (max, extra = {}) => Object.assign({
    x: { min: 0, max, paso: max / 5, nombre: 'Δm', unidad: 'mg', decimales: 0, color: 'i' },
    y: { min: 0, max: max * 0.09, paso: max * 0.018, nombre: 'E', unidad: 'TJ', decimales: 0, color: 'd' },
    curvas: [{ puntos: [[0, 0], [max, max * 0.09]], color: 'd' }],
    alt: `Recta de la energía contra la masa que desaparece: E = Δm·c². Cada miligramo da 90 000 millones de joules (0,09 TJ).`,
  }, extra);
  const energia = {
    id: 'masa-energia',
    titulo: 'La energía nuclear pierde masa',
    temas: ['Equivalencia masa-energía'],
    pieza: 'ejes',
    juega: {
      consigna: 'Elige cuántos miligramos de masa desaparecen en un proceso nuclear y lee cuánta energía sale.',
      voz: 'Mira qué tan empinada es esta recta.',
      controles: [{ id: 'mg', etiqueta: 'Δm', color: 'c-i', min: 10, max: 100, paso: 10, inicio: 10, unidad: 'mg', decimales: 0 }],
      dibujo: val => ({ datos: ejesMasa(100, { puntos: [{ x: val.mg, y: val.mg * 0.09, color: 'd', rotulo: `${f(val.mg * 0.09, 1)} TJ`, guias: true }] }), estado: {} }),
      lectura: val => [E, ` = ${cien(val.mg * 1e-6 * C2)} J`],
      minimo: 3,
    },
    predice: {
      pregunta: ['En un reactor desaparece 1 g de masa. Con c = 3 × 10⁸ m/s, ¿cuánta energía ', E, ' se libera?'],
      voz: 'Revisa las unidades antes de multiplicar.',
      opciones: [
        { id: 'c', texto: '9 × 10¹³ J', correcta: true },
        { id: 'kg', texto: '9 × 10¹⁶ J', error: 'QM-G-KG', siFuera: 'Ese sería el resultado con 1 kg. Un gramo es 0,001 kg.' },
        { id: 'sin-cuadrado', texto: '3 × 10⁵ J', error: 'QM-MC', siFuera: 'Eso multiplica por c una sola vez. La fórmula usa c al cuadrado.' },
        { id: 'quimica', texto: 'Casi nada, como al quemar algo', error: 'QM-NUCLEAR', siFuera: 'Al quemar, la masa perdida es tan pequeña que no se mide. Aquí desaparece un gramo entero.' },
      ],
      dibujo: { datos: ejesMasa(1000), estado: {} },
      revelar: { datos: ejesMasa(1000, { puntos: [{ x: 1000, y: 90, color: 'd', rotulo: '90 TJ = 9 × 10¹³ J', guias: true }] }), estado: {} },
      coincide: 'Coincide: 0,001 kg por 9 × 10¹⁶ m²/s².',
      noCoincide: 'Un gramo es 0,001 kg; por c² da 9 × 10¹³ J.',
    },
    mira: {
      datos: ejesMasa(1000, {
        puntos: [
          { x: 0.00037, y: 0.000033, color: 'i', rotulo: 'quemar 1 kg de carbón', desde: 1 },
          { x: 911, y: 82, color: 'd', rotulo: 'fisión de 1 kg de uranio-235', guias: true, desde: 2 },
        ],
      }),
      voz: 'Comparemos un proceso químico con uno nuclear.',
      pasos: [
        { estado: { corte: 1 }, texto: 'Quemar 1 kg de carbón libera unos 3,3 × 10⁷ J.', ecuacion: [dm, ' = ', { frac: [E, 'c²'] }, ` = ${cien(3.3e7 / C2)} kg`] },
        { estado: { corte: 1 }, texto: 'Esa masa perdida es tan pequeña que ninguna balanza la nota.' },
        { estado: { corte: 2 }, texto: 'Fisionar 1 kg de uranio-235 libera unos 8,2 × 10¹³ J.', ecuacion: [dm, ' = ', { frac: [E, 'c²'] }, ` = ${f(8.2e13 / C2 * 1e6, 0)} mg`] },
        { estado: { corte: 2 }, texto: 'En lo nuclear se pierde casi un gramo: eso sí se mide.' },
      ],
    },
    regla: {
      texto: 'Cuando un sistema libera energía, su masa disminuye un poco. En lo químico la diferencia no se mide; en lo nuclear, sí.',
      ecuacion: [E, ' = ', dm, ' · ', { sup: ['c', '2'] }],
      condicion: 'Δm es la diferencia de masa del sistema antes y después, en kg, no la masa total; c = 3 × 10⁸ m/s.',
      voz: 'La masa no se vuelve calor entera: solo la diferencia.',
    },
    ahoraTu: {
      voz: 'Pasa la masa a kilogramos primero.',
      generar(s) {
        const r = azar(s), mg = r.ent(2, 90) * 10, kg = mg * 1e-6, e = kg * C2;
        return {
          pregunta: ['En un proceso nuclear desaparecen ', dm, ` = ${f(mg, 0)} mg. ¿Cuánta energía `, E, ' se libera? (c = 3 × 10⁸ m/s)'],
          opciones: opciones(e, [
            { id: 'g', valor: e * 1000, error: 'QM-G-KG', siFuera: 'Eso trata los miligramos como gramos. 1 mg = 10⁻⁶ kg.' },
            { id: 'c1', valor: kg * 3e8, error: 'QM-MC', siFuera: 'Eso usa c una sola vez; la fórmula pide c².' },
            { id: 'mg', valor: mg * C2, error: 'QM-G-KG', siFuera: 'Eso usa los miligramos sin pasarlos a kilogramos.' },
          ], n => `${cien(n)} J`),
          solucion: { texto: `${f(mg, 0)} mg son ${cien(kg)} kg; se multiplica por c².`, ecuacion: [E, ` = ${cien(kg)} · 9 × 10¹⁶ = ${cien(e)} J`] },
        };
      },
    },
  };

  return {
    unidad: 'quimica.materia-y-energia',
    version: '0.1.0',
    estado: 'completa',
    requiere: ['/nucleo/kit/piezas/quim-particulas.js', '/nucleo/kit/piezas/ejes.js'],
    historia: {
      texto: 'En el siglo XVIII, para entender una combustión había que decidir qué pesar: solo el sólido o también el aire. Las mediciones de Lavoisier y de otros mostraron que una muestra puede ganar masa al tomar un gas. Por eso importa dónde termina el sistema que se estudia. La relación entre masa y energía llegó mucho después, con la física del siglo XX.',
      pregunta: '¿Qué pesarías para saber si algo pierde masa al quemarse?',
      fuente: { titulo: 'OpenStax, Chemistry 2e, §1.2', url: 'https://openstax.org/books/chemistry-2e/pages/1-2-phases-and-classification-of-matter' },
    },
    ideas: [sustancia, cambios, calor, energia],
  };
});
