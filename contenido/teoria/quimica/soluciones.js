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
  const vasoSistema = (k, reposo) => {
    const S = SISTEMAS[k];
    const parts = reposo && k === 'suspension' ? rejilla('grumo', 4, 4, 0.1, 0.9, 0.86, 0.86) : [{ e: S.e, n: S.k }];
    return lupa([{ titulo: `${S.texto}${reposo ? ', en reposo' : ''}`, forma: 'vaso', nivel: 0.9, particulas: parts }], { separacion: 26 });
  };
  const dispersos = {
    id: 'sistemas-dispersos',
    titulo: 'Solución, coloide o suspensión',
    temas: ['Sistemas dispersos: soluciones, coloides y suspensiones'],
    pieza: 'quim-particulas',
    juega: {
      consigna: 'Elige un sistema y déjalo en reposo. Compara el tamaño de lo disperso y si cae al fondo.',
      voz: 'Mira el tamaño de lo que flota. Eso decide el nombre.',
      controles: [
        { id: 'k', etiqueta: 'Sistema', opciones: Object.keys(SISTEMAS).map(x => ({ valor: x, texto: SISTEMAS[x].texto })) },
        { id: 'r', etiqueta: 'Reposo', opciones: [{ valor: 'no', texto: 'Recién agitado' }, { valor: 'si', texto: 'Una hora quieto' }] },
      ],
      dibujo: val => vasoSistema(val.k, val.r === 'si'),
      lectura: val => [SISTEMAS[val.k].lee],
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
      ecuacion: ['solución < 1 nm   ·   coloide 1–1000 nm   ·   suspensión > 1000 nm'],
      condicion: 'transparente no significa sin soluto: lo disuelto sigue en el agua aunque no se vea.',
      voz: 'Que no se vea no quiere decir que no esté.',
    },
    ahoraTu: {
      voz: 'Usa el tamaño de las partículas.',
      generar(s) {
        const r = azar(s), tipo = ['solucion', 'coloide', 'suspension'][s % 3];
        const tam = tipo === 'solucion' ? r.de([0.2, 0.3, 0.5, 0.8]) : tipo === 'coloide' ? r.de([5, 20, 50, 200, 500]) : r.de([2000, 5000, 10000, 50000]);
        const nom = { solucion: 'Solución', coloide: 'Coloide', suspension: 'Suspensión' };
        const si = { solucion: 'Sería solución si lo disperso midiera menos de 1 nm.', coloide: 'Sería coloide si midiera entre 1 y 1000 nm.', suspension: 'Sería suspensión si midiera más de 1000 nm.' };
        return {
          pregunta: `Lo disperso en un líquido mide unos ${f(tam, 1)} nm. ¿Qué sistema es?`,
          opciones: Object.keys(nom).map(k => (k === tipo ? { id: 'c', texto: nom[k], correcta: true } : { id: k, texto: nom[k], error: 'QM-DISPERSO', siFuera: si[k] })),
          solucion: { texto: `${f(tam, 1)} nm cae en el intervalo de ${nom[tipo].toLowerCase()}.`, ecuacion: ['solución < 1 nm · coloide 1–1000 nm · suspensión > 1000 nm'] },
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
  const solubilidad = {
    id: 'curva-solubilidad',
    titulo: 'Cuánto cabe en el agua',
    temas: ['Solubilidad y curvas de solubilidad'],
    pieza: 'ejes',
    juega: {
      consigna: 'Echa nitrato de potasio (KNO₃) en 100 g de agua y elige la temperatura. Mira si el punto queda bajo la curva o encima.',
      voz: 'Bajo la curva cabe más; encima, sobra.',
      controles: [
        { id: 'T', etiqueta: 'T', min: 0, max: 80, paso: 10, inicio: 20, unidad: '°C', decimales: 0 },
        { id: 'm', etiqueta: 'm', color: 'c-d', min: 10, max: 150, paso: 10, inicio: 50, unidad: 'g', decimales: 0 },
      ],
      dibujo: val => ({ datos: ejesSol({ puntos: [{ x: val.T, y: val.m, color: 'd', rotulo: `${f(val.m, 0)} g`, guias: true }] }), estado: {} }),
      lectura: val => {
        const s = KNO3[val.T];
        return val.m <= s ? ['Se disuelve todo; caben ', `${f(s - val.m, 1)} g más`] : ['Se disuelven ', `${f(s, 1)} g; quedan ${f(val.m - s, 1)} g sin disolver`];
      },
      minimo: 3,
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
      ecuacion: ['sólido que aparece = masa echada − máximo de la curva'],
      condicion: 'es un límite de equilibrio: agitar o moler acelera la disolución pero no cambia el máximo.',
      voz: 'Agitar apura, pero no hace caber más.',
    },
    ahoraTu: {
      pieza: 'ejes',
      voz: 'Lee el máximo en la curva antes de restar.',
      generar(s) {
        const r = azar(s), Ts = [10, 20, 30, 40, 50, 60, 70];
        const T = Ts[s % Ts.length], sT = KNO3[T];
        if (s % 2) {
          const mm = 10 * Math.ceil((sT + r.ent(5, 40)) / 10);
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
        const T2 = Ts.filter(x => x < T)[r.ent(0, Ts.filter(x => x < T).length - 1)] || 0, s1 = sT, s2 = KNO3[T2];
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
  const concentracion = {
    id: 'concentracion',
    titulo: 'Concentración: cantidad entre volumen',
    temas: ['Concentración: porcentajes, molaridad, normalidad y molalidad'],
    pieza: 'quim-particulas',
    juega: {
      consigna: 'Cada bolita es 0,01 mol de soluto. Cambia cuántas hay y el volumen de solución. Mira qué tan juntas quedan.',
      voz: 'Fíjate en cuántas bolitas hay por cada parte del vaso.',
      controles: [
        { id: 'k', etiqueta: 'n', color: 'c-o', min: 2, max: 12, paso: 2, inicio: 4, unidad: 'bolitas', decimales: 0 },
        { id: 'v', etiqueta: 'V', color: 'c-i', min: 100, max: 500, paso: 100, inicio: 200, unidad: 'mL', decimales: 0 },
      ],
      dibujo: val => lupa([{ titulo: 'Solución', forma: 'vaso', nivel: val.v / 500, rotulo: `${f(val.v, 0)} mL`, particulas: [{ e: 'ion', n: val.k }] }]),
      lectura: val => [c, ` = ${f(val.k * 0.01, 2)} mol / ${f(val.v / 1000, 1)} L = ${f(val.k * 0.01 / (val.v / 1000), 2)} mol/L`],
      minimo: 3,
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
        { estado: {}, texto: 'Disolvemos 10 g de NaOH (0,25 mol) hasta 500 mL; pesa 520 g.', ecuacion: [m, ' = 10 g   ·   ', n, ' = 10/40 = 0,25 mol'] },
        { estado: {}, texto: 'Molaridad: moles entre litros de solución.', ecuacion: [c, ' = ', { frac: [n, V] }, ` = ${f(0.25 / 0.5, 2)} mol/L`] },
        { estado: {}, texto: 'Porcentaje en masa: gramos de soluto entre gramos de solución.', ecuacion: ['%m/m = 10/520 · 100 = ', `${f(1000 / 520, 2)} %`] },
        { estado: {}, texto: 'Porcentaje masa-volumen: gramos entre mililitros de solución.', ecuacion: ['%m/V = 10/500 · 100 = ', `${f(2, 0)} %`] },
        { estado: {}, texto: 'Molalidad: moles entre kilogramos de solvente, no de solución.', ecuacion: ['b = 0,25 / 0,510 = ', `${f(0.25 / 0.51, 2)} mol/kg`] },
        { estado: {}, texto: 'Normalidad: la molaridad por los OH⁻ que da cada unidad.', ecuacion: ['N = θ · ', c, ` = 1 · 0,5 = ${f(0.5, 1)} eq/L`] },
      ],
    },
    regla: {
      texto: 'Toda concentración es soluto sobre solución: moles entre litros (molaridad), gramos entre gramos (%m/m) o entre mililitros (%m/V). La molalidad divide entre kilogramos de solvente.',
      ecuacion: [c, ' = ', { frac: [n, V] }, '   ·   b = ', { frac: [n, 'kg de solvente'] }, '   ·   N = θ · ', c],
      condicion: 'V es el volumen final de la solución, no el del agua añadida; θ son los H⁺ u OH⁻ que intercambia.',
      voz: 'Primero el numerador y el denominador; después el número.',
    },
    ahoraTu: {
      voz: 'Escribe qué va arriba y qué va abajo.',
      generar(s) {
        const r = azar(s), tipo = s % 4;
        if (tipo === 0) {
          const g = 4 * r.ent(1, 10), v = 50 * r.ent(2, 10), mol = g / 40;
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
          const g = r.ent(2, 30), agua = 10 * r.ent(5, 30), tot = g + agua;
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
          const mol = fijo(r.ent(1, 8) * 0.1, 1), kg = fijo(r.ent(2, 10) * 0.1, 1);
          return {
            pregunta: [`Disuelves ${f(mol, 1)} mol de glucosa en ${f(kg, 1)} kg de agua. ¿Cuál es la molalidad?`],
            opciones: opciones(mol / kg, [
              { id: 'inv', valor: kg / mol, error: 'QM-INV', siFuera: 'Eso pone los kilogramos arriba. b = n / kg de solvente.' },
              { id: 'g', valor: mol / (kg * 1000), error: 'QM-ML', siFuera: 'Eso divide entre gramos. La molalidad usa kilogramos.' },
            ], x => `${f(x, 2)} mol/kg`),
            solucion: { texto: 'Moles de soluto entre kilogramos de solvente.', ecuacion: [`b = ${f(mol, 1)} / ${f(kg, 1)} = ${f(mol / kg, 2)} mol/kg`] },
          };
        }
        const M = fijo(r.ent(1, 10) * 0.05, 2);
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
  const dilucion = {
    id: 'diluir-y-retirar',
    titulo: 'Diluir no es retirar',
    temas: ['Dilución y mezcla de soluciones'],
    pieza: 'quim-particulas',
    juega: {
      consigna: 'Tienes 100 mL de solución con 0,020 mol de soluto. Añade agua hasta el volumen que elijas y lee n y c.',
      voz: 'Cuenta las bolitas antes y después de añadir agua.',
      controles: [{ id: 'v', etiqueta: 'V', color: 'c-i', min: 100, max: 250, paso: 50, inicio: 100, unidad: 'mL', decimales: 0 }],
      dibujo: val => lupa([vaso('Inicio', 100, 10), vaso('Con agua', val.v, 10)], { flechas: true, alto: 190, separacion: 16 }),
      lectura: val => [n, ' = 0,020 mol · ', c, ` = ${f(0.02 / (val.v / 1000), 3)} mol/L`],
      minimo: 3,
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
        { estado: { corte: 2 }, texto: 'Con agua hasta 250 mL: el soluto es el mismo, más repartido.', ecuacion: [n, ' = 0,020 mol   ·   ', c, ` = 0,020 / 0,250 = ${f(0.02 / 0.25, 3)} mol/L`] },
        { estado: { corte: 2 }, texto: 'Como n no cambia, el producto c · V se conserva.', ecuacion: [c1, V1, ' = ', c2, V2, ' → 0,20 · 100 = 0,080 · 250'] },
        { estado: { corte: 3 }, texto: 'Al retirar 40 mL del inicio, quedan 60 mL con 6 bolitas.', ecuacion: [n, ` = 0,20 · 0,060 = ${f(0.012, 3)} mol   ·   `, c, ' = 0,20 mol/L'] },
        { estado: { corte: 3 }, texto: 'Al mezclar dos soluciones del mismo soluto, se suman las cantidades.', ecuacion: [c, ' = ', { frac: [[c1, V1, ' + ', c2, V2], [V1, ' + ', V2]] }] },
      ],
    },
    regla: {
      texto: 'Al añadir solvente, la cantidad de soluto se conserva y la concentración baja. Al retirar una parte homogénea, la concentración no cambia y la cantidad baja.',
      ecuacion: [c1, V1, ' = ', c2, V2],
      condicion: 'sin reacción, pérdidas ni evaporación. Al mezclar se suman moles; sumar volúmenes es una aproximación que no siempre vale.',
      voz: 'Dos preguntas distintas: cuánto soluto hay y qué tan junto está.',
    },
    ahoraTu: {
      voz: 'Decide primero qué se conserva: n o c.',
      generar(s) {
        const r = azar(s), tipo = s % 3;
        if (tipo === 0) {
          const ci = fijo(r.ent(2, 10) * 0.1, 1), vi = 50 * r.ent(1, 4), vf = vi + 50 * r.ent(1, 6), cf = ci * vi / vf;
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
          const ci = fijo(r.ent(1, 9) * 0.1, 1), vi = 100 * r.ent(2, 5), vr = 10 * r.ent(2, Math.floor(vi / 10) - 2), queda = vi - vr;
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
        const ca = fijo(r.ent(1, 5) * 0.1, 1), cb = fijo(r.ent(6, 10) * 0.1, 1), va = 100 * r.ent(1, 3), vb = 100 * r.ent(1, 3), cm = (ca * va + cb * vb) / (va + vb);
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
    return { nOH, quedaH, sobraOH, agua, dib: lupa([{ titulo: 'Matraz', forma: 'vaso', nivel: (20 + vb) / 60, rotulo: `${f(20 + vb, 0)} mL`,
      particulas: [{ e: 'H', n: Math.round(quedaH / BOL) }, { e: 'OH', n: Math.round(sobraOH / BOL) }, { e: 'agua', n: Math.round(agua / BOL) }],
      cuenta: [{ e: 'H', texto: `${f(quedaH, 1)}` }, { e: 'OH', texto: `${f(sobraOH, 1)}` }, { e: 'agua', texto: `${f(agua, 1)}` }] }], { separacion: 24 }) };
  };
  const esteq = {
    id: 'estequiometria-solucion',
    titulo: 'Reaccionar en solución: n = c·V',
    temas: ['Estequiometría en soluciones'],
    pieza: 'quim-particulas',
    juega: {
      consigna: 'Al matraz con 20 mL de HCl 0,10 mol/L le añades NaOH 0,10 mol/L. Cada bolita es 0,5 mmol. Mira qué queda.',
      voz: 'Cada OH⁻ se lleva un H⁺. Cuenta los pares.',
      controles: [{ id: 'v', etiqueta: 'NaOH', color: 'c-i', min: 0, max: 40, paso: 5, inicio: 5, unidad: 'mL', decimales: 0 }],
      dibujo: val => neutra(val.v).dib,
      lectura: val => { const x = neutra(val.v); return [n, `(OH⁻) = ${f(x.nOH, 1)} mmol · queda H⁺ ${f(x.quedaH, 1)} mmol`]; },
      minimo: 3,
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
      ecuacion: [n, ' = ', c, ' · ', V, '   ·   ', { frac: [{ sub: [n, 'A'] }, 'a'] }, ' = ', { frac: [{ sub: [n, 'B'] }, 'b'] }],
      condicion: 'c en mol/L y V en L (o mmol/mL y mL); la reacción es completa y sigue la ecuación escrita.',
      voz: 'Los coeficientes mandan sobre los volúmenes.',
    },
    ahoraTu: {
      voz: 'De volumen a moles, y los coeficientes en el medio.',
      generar(s) {
        const r = azar(s);
        const pares = [
          { acido: 'HCl', base: 'NaOH', a: 1, b: 1, ec: 'HCl + NaOH → NaCl + H₂O' },
          { acido: 'H₂SO₄', base: 'NaOH', a: 1, b: 2, ec: 'H₂SO₄ + 2 NaOH → Na₂SO₄ + 2 H₂O' },
          { acido: 'HCl', base: 'Ca(OH)₂', a: 2, b: 1, ec: '2 HCl + Ca(OH)₂ → CaCl₂ + 2 H₂O' },
          { acido: 'HNO₃', base: 'KOH', a: 1, b: 1, ec: 'HNO₃ + KOH → KNO₃ + H₂O' },
        ];
        const P = pares[s % pares.length], ca = fijo(r.ent(1, 5) * 0.1, 1), va = 5 * r.ent(2, 8), cb = fijo(r.ent(1, 5) * 0.1, 1);
        const na = ca * va, nb = na * P.b / P.a, vb = nb / cb;
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

  return {
    unidad: 'quimica.soluciones',
    version: '0.1.0',
    estado: 'completa',
    requiere: ['/nucleo/kit/piezas/quim-particulas.js', '/nucleo/kit/piezas/ejes.js'],
    historia: {
      texto: 'Algunas mezclas se ven uniformes y, sin embargo, se comportan distinto al atravesar una membrana. En 1861, Thomas Graham estudió esa diferencia y separó coloides de cristaloides. Más tarde, van ’t Hoff relacionó las disoluciones diluidas con leyes cuantitativas. Separar cantidad de soluto, volumen y tamaño de partícula explica por qué diluir, filtrar y dializar son operaciones diferentes.',
      pregunta: '¿Cómo sabrías si un líquido transparente lleva algo disuelto?',
      fuente: { titulo: 'OpenStax, Chemistry 2e, §3.3 y §11.3', url: 'https://openstax.org/books/chemistry-2e/pages/3-3-molarity' },
    },
    ideas: [dispersos, solubilidad, concentracion, dilucion, esteq],
  };
});
