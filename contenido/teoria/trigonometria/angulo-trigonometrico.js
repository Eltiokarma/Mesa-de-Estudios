/*
 * Teoría de «Ángulo trigonométrico y sistemas de medida» (trigonometria.angulo-trigonometrico), 3.º de secundaria.
 * Fuente del contenido: docs/teoria/matriz/trigonometria.json (unidad 1), docs/teoria/fuentes/historia-ecuaciones.pdf
 * (pp. 82–83) y las «Precisiones de Geometría y Trigonometría» del expediente. Forma: contenido/teoria/fisica/movimiento-rectilineo.js.
 * Compañera: Mara (coneja), cercana y rigurosa: conserva el origen, el sentido y la unidad del ángulo.
 * Colores (regla 4): el ángulo θ y sus tres medidas D, G y R en naranja (c-o: es un mismo giro en tres escalas),
 * el arco s en turquesa (c-i), el radio r en verde (c-d) y las vueltas n en rojo (c-h).
 * Errores (hipótesis de distractor, docs/investigacion/trigonometria-ideas-erroneas.md no los mide): TRIG-COTERM-IGUAL,
 * TRIG-SIGNO, TRIG-NEGATIVO, TRIG-SIN-SIGNO, TRIG-UNA-VUELTA, TRIG-SENTIDO, CONV-MISMO, CONV-INVERSA, CONV-MITAD,
 * CONV-PI, SEX-SUMA, SEX-REDONDEO, RAD-ENTERO, RAD-GRADOS, RAD-TAMAÑO, RAD-INVERSA, RAD-PRODUCTO, SEX-DECIMAL, SEX-CIEN.
 *
 * Ficha de tarea (diseno-y-animacion):
 *   Promesa: un giro firmado se convierte entre los tres sistemas sin perder su sentido ni su fracción de vuelta.
 *   Persona y condiciones: postulante de 3.º, celular de 360 px de gama baja, con o sin conexión, en el aula o en casa.
 *   Resultado observable: convierte un giro entre grados, grados centesimales y radianes, y distingue coterminal de igual.
 *   Orden de atención: 1.º el lado inicial · 2.º el arco con su flecha · acción: mover el giro · fondo: la circunferencia.
 *   Estados: juego sin tocar · probando · predicción pendiente · coincide / no coincide · paso de «Mira» · caso nuevo.
 *   Duda que resuelve: ¿por qué 270° y −90° no son el mismo ángulo, y por qué 1,5° no es 1° 5′?
 */
(function (root, fabrica) {
  const def = fabrica(typeof module === 'object' && module.exports ? require('../../../nucleo/kit/kit.js') : root.Kit);
  if (typeof module === 'object' && module.exports) module.exports = def;
  else root.Teoria.unidad(def);
})(typeof self !== 'undefined' ? self : this, function (Kit) {
  'use strict';
  const f = (n, d = 2) => Kit.formatear(n, d);
  const th = { v: 'c-o', t: 'θ' }, s = { v: 'c-i', t: 's' }, r = { v: 'c-d', t: 'r' }, n = { v: 'c-h', t: 'n' };
  const D = { v: 'c-o', t: 'D' }, G = { v: 'c-o', t: 'G' }, R = { v: 'c-o', t: 'R' };
  const gc = x => ({ sup: [x, 'g'] });              // 40ᵍ: grados centesimales
  const gcd = (a, b) => (b ? gcd(b, a % b) : Math.abs(a));
  // Grados → radianes como fracción de π: 90 → «π/2», −135 → «−3π/4», 360 → «2π».
  const piTxt = deg => piFrac(Math.round(deg), 180);
  function piFrac(p, q) {           // (p/q)·π, simplificado
    if (p === 0) return '0';
    const m = gcd(p, q), num = p / m, den = q / m;
    const sg = num < 0 ? '−' : '', a = Math.abs(num);
    return `${sg}${a === 1 ? '' : a}π${den === 1 ? '' : '/' + den}`;
  }
  const mod360 = x => ((x % 360) + 360) % 360;
  // Azar con semilla para «Ahora tú» (el de la unidad de referencia).
  function azar(sem) {
    let q = (sem * 2654435761 + 12345) >>> 0;
    const rr = () => { q = (q + 0x6D2B79F5) >>> 0; let z = q; z = Math.imul(z ^ (z >>> 15), z | 1); z ^= z + Math.imul(z ^ (z >>> 7), z | 61); return ((z ^ (z >>> 14)) >>> 0) / 4294967296; };
    rr.ent = (lo, hi) => lo + Math.floor(rr() * (hi - lo + 1));
    rr.uno = xs => xs[Math.floor(rr() * xs.length)];
    return rr;
  }
  // Opciones distintas: la correcta primero; los distractores que repiten un texto se descartan.
  function opciones(correcta, distractores, fmt) {
    const vistos = new Set([fmt(correcta)]);
    const ops = [{ id: 'c', texto: fmt(correcta), correcta: true }];
    for (const d of distractores) {
      if (typeof d.valor === 'number' && !Number.isFinite(d.valor)) continue;
      const txt = fmt(d.valor);
      if (vistos.has(txt)) continue;
      vistos.add(txt);
      ops.push({ id: d.id, texto: txt, error: d.error, siFuera: d.siFuera });
    }
    return ops.slice(0, 4);
  }

  // ---------- Idea 1: el sentido del giro es el signo ----------
  // Cambia: el giro θ, de −720° a 720°. · Permanece: el lado inicial sobre el eje x positivo y la circunferencia.
  // Progresa: el arco con flecha, que se enrosca una vuelta más en cada 360°. · Se reserva: dos giros distintos
  // que terminan en el mismo lado (la predicción). · Debe verse: la flecha del arco (sentido) y el número de vueltas.
  const giro = (g, extra = {}) => Object.assign({
    circulos: [{ r: 1 }],
    rayos: [{ ang: 0, largo: 1, grosor: 'contorno' }, { ang: g, largo: 1, color: 'o' }],
    arcos: [{ de: 0, a: g, r: 0.3, color: 'o', rotulo: `${f(g)}°` }],
    rotulos: [{ x: 0.72, y: -0.2, texto: 'inicial' }],
    alt: `Giro de ${f(g)} grados desde el lado inicial, ${g >= 0 ? 'antihorario' : 'horario'}`,
  }, extra);
  function vueltasTxt(g) {
    const k = Math.floor(Math.abs(g) / 360), resto = Math.abs(g) - 360 * k;
    if (!k) return 'menos de 1 vuelta';
    return `${f(k)} vuelta${k > 1 ? 's' : ''}${resto ? ` y ${f(resto)}°` : ''}`;
  }
  const sentido = {
    id: 'sentido-signo',
    titulo: 'El sentido es el signo',
    temas: ['Sentido de giro y signo'],
    pieza: 'trig-plano',
    juega: {
      consigna: 'Elige el giro. El rayo naranja sale del lado inicial y el arco con flecha cuenta el recorrido, también si da más de una vuelta.',
      voz: 'Conservemos el lado inicial; después mira hacia dónde apunta la flecha.',
      controles: [{ id: 'g', etiqueta: 'θ', color: 'c-o', min: -720, max: 720, paso: 30, inicio: 120, unidad: '°', decimales: 0 }],
      dibujo: val => ({ datos: giro(val.g), estado: {} }),
      lectura: val => [th, ` = ${f(val.g)}° · ${val.g > 0 ? 'antihorario' : val.g < 0 ? 'horario' : 'sin giro'} · ${vueltasTxt(val.g)}`],
      minimo: 3,
    },
    predice: {
      pregunta: 'Un rayo gira 270° y otro gira −90°, los dos desde el mismo lado inicial. Terminan en el mismo lugar. ¿Son el mismo ángulo trigonométrico?',
      voz: 'Antes de decidir, piensa en el recorrido, no solo en el final.',
      opciones: [
        { id: 'c', texto: 'No: terminan juntos, pero los giros son distintos', correcta: true },
        { id: 'igual', texto: 'Sí: terminan en el mismo lado', error: 'TRIG-COTERM-IGUAL', siFuera: 'Terminar juntos los hace coterminales. Pero el ángulo es el giro: estos difieren en una vuelta.' },
        { id: 'cuadrante', texto: 'Sí: el signo solo indica el cuadrante', error: 'TRIG-SIGNO', siFuera: 'El signo no dice el cuadrante: dice el sentido. 270° gira antihorario; −90°, horario.' },
        { id: 'negativo', texto: 'No: un ángulo negativo no existe', error: 'TRIG-NEGATIVO', siFuera: 'Es cierto que son distintos, pero −90° sí existe: es un giro en sentido horario.' },
      ],
      dibujo: { datos: giro(-90, { arcos: [], rayos: [{ ang: 0, largo: 1, grosor: 'contorno' }, { ang: -90, color: 'o', rotulo: '¿?' }] }), estado: {} },
      revelar: { datos: giro(270, { arcos: [{ de: 0, a: 270, r: 0.3, color: 'o', rotulo: '270°' }, { de: 0, a: -90, r: 0.62, color: 'o', rotulo: '−90°' }] }), estado: {} },
      coincide: 'Coincide: terminan en el mismo lado, pero uno gira 360° más que el otro.',
      noCoincide: 'Revisemos el recorrido: los dos arcos están dibujados.',
    },
    mira: {
      datos: {
        circulos: [{ r: 1 }],
        rayos: [{ ang: 0, largo: 1, grosor: 'contorno', desde: 1 }, { ang: -90, color: 'o', desde: 2 }],
        arcos: [{ de: 0, a: 270, r: 0.3, color: 'o', rotulo: '+270°', desde: 2 }, { de: 0, a: -90, r: 0.62, color: 'o', rotulo: '−90°', desde: 3 }],
        rotulos: [{ x: 0.72, y: -0.2, texto: 'inicial', desde: 1 }, { x: -0.55, y: -1.18, texto: '360° de diferencia', color: 'h', desde: 4 }],
        alt: 'Dos giros desde el lado inicial: 270 grados antihorario y 90 grados horario, que terminan en el mismo lado',
      },
      voz: 'Mira cada flecha: el sentido se lee en ella.',
      pasos: [
        { estado: { corte: 1 }, texto: 'Todo giro parte del lado inicial, sobre el eje x positivo.', ecuacion: [th, ' = 0°'] },
        { estado: { corte: 2 }, texto: 'Contra las agujas del reloj, el giro es positivo.', ecuacion: [th, ' = +270°'] },
        { estado: { corte: 3 }, texto: 'Con las agujas del reloj, el giro es negativo.', ecuacion: [th, ' = −90°'] },
        { estado: { corte: 4 }, texto: 'Terminan en el mismo lado y difieren en una vuelta.', ecuacion: ['270° − (−90°) = 360° · ', n, ',  ', n, ' = 1'] },
      ],
    },
    regla: {
      texto: 'Un ángulo trigonométrico es un giro: antihorario es positivo y horario es negativo. Dos giros que terminan en el mismo lado son coterminales.',
      ecuacion: [{ sub: [th, '1'] }, ' − ', { sub: [th, '2'] }, ' = 360° · ', n],
      condicion: 'los dos se miden desde el mismo lado inicial, y n es un entero. Coterminales no quiere decir iguales.',
      voz: 'El signo guarda el sentido; las vueltas guardan el recorrido.',
    },
    ahoraTu: {
      pieza: 'trig-plano',
      voz: 'Primero el sentido, después las vueltas.',
      generar(sem) {
        const rr = azar(sem), sg = sem % 2 ? -1 : 1, k = rr.ent(1, 2), resto = rr.uno([30, 45, 60, 120, 135, 150, 210, 240, 300, 315]);
        const g = sg * (360 * k + resto), bien = mod360(g);
        return {
          pregunta: ['Un rayo gira ', th, ` = ${f(g)}°. ¿Qué ángulo entre 0° y 360° termina en el mismo lado?`],
          opciones: opciones(bien, [
            { id: 'sin-signo', valor: mod360(Math.abs(g)), error: 'TRIG-SIN-SIGNO', siFuera: 'Quitar vueltas está bien, pero el giro es negativo: va en sentido horario.' },
            { id: 'una', valor: g - sg * 360, error: 'TRIG-UNA-VUELTA', siFuera: `Eso quita una vuelta. Aquí el giro da ${f(k)} vuelta${k > 1 ? 's' : ''} completa${k > 1 ? 's' : ''} antes de quedar entre 0° y 360°.` },
            { id: 'sentido', valor: 360 - bien, error: 'TRIG-SENTIDO', siFuera: 'Eso mide lo que falta para la vuelta, en el sentido contrario.' },
          ], v => `${f(v)}°`),
          solucion: {
            texto: `Se quitan ${f(k)} vuelta${k > 1 ? 's' : ''} completa${k > 1 ? 's' : ''} sin perder el sentido.`,
            ecuacion: [`${f(g)}° ${sg > 0 ? '−' : '+'} 360° · ${f(sg > 0 ? k : k + 1)} = ${f(bien)}°`],
            dibujo: { datos: giro(g, { rayos: [{ ang: 0, largo: 1, grosor: 'contorno' }, { ang: g, color: 'o', rotulo: `${f(bien)}°` }] }), estado: {} },
          },
        };
      },
    },
  };

  // ---------- Idea 2: una vuelta, tres escalas ----------
  // Cambia: el giro θ entre 0° y 360°. · Permanece: la circunferencia y el sector que muestra la fracción de vuelta.
  // Progresa: la fracción sombreada. · Se reserva: un giro dado en grados centesimales (la predicción).
  // Debe verse: que la fracción de vuelta es la misma en las tres escalas.
  const fraccion = g => { const m = gcd(g, 360); return g === 0 ? '0' : g === 360 ? '1 vuelta' : `${g / m}/${360 / m} de vuelta`; };
  const sector = (g, rot, extra = {}) => Object.assign({
    circulos: [{ r: 1 }],
    sectores: [{ de: 0, a: g, r: 1, color: 'o' }],
    rayos: [{ ang: 0, largo: 1.15, grosor: 'contorno' }, { ang: g, color: 'o', rotulo: rot }],
    alt: `Sector de ${f(g)} grados: ${fraccion(g)}`,
  }, extra);
  const escalas = {
    id: 'tres-sistemas',
    titulo: 'Una vuelta, tres escalas',
    temas: ['Sistemas sexagesimal, centesimal y radial', 'Conversión entre sistemas'],
    pieza: 'trig-plano',
    juega: {
      consigna: 'Elige el giro y mira la parte sombreada de la vuelta. La lectura lo escribe en los tres sistemas.',
      voz: 'Fíjate en qué parte de la vuelta queda sombreada.',
      controles: [{ id: 'g', etiqueta: 'θ', color: 'c-o', min: 18, max: 360, paso: 18, inicio: 90, unidad: '°', decimales: 0 }],
      dibujo: val => ({ datos: sector(val.g, fraccion(val.g)), estado: {} }),
      lectura: val => [`${f(val.g)}° = `, gc(f(val.g * 10 / 9)), ` = ${piTxt(val.g)} rad`],
      minimo: 3,
    },
    predice: {
      pregunta: ['Un giro mide ', gc('40'), '. ¿Cuántos grados sexagesimales mide?'],
      voz: 'Recuerda cuánto mide una vuelta en cada escala.',
      opciones: [
        { id: 'c', texto: '36°', correcta: true },
        { id: 'mismo', texto: '40°', error: 'CONV-MISMO', siFuera: 'Sería cierto si las dos escalas fueran iguales. La vuelta tiene 400ᵍ y solo 360°.' },
        { id: 'inversa', texto: '44,4°', error: 'CONV-INVERSA', siFuera: 'Eso multiplica por 10/9. El grado centesimal es más chico: se multiplica por 9/10.' },
        { id: 'mitad', texto: '72°', error: 'CONV-MITAD', siFuera: 'Eso toma 100ᵍ como media vuelta. Media vuelta son 200ᵍ.' },
      ],
      dibujo: { datos: sector(0, '', { sectores: [], rayos: [{ ang: 0, largo: 1.15, grosor: 'contorno' }] }), estado: {} },
      revelar: { datos: sector(36, '36° = 40ᵍ'), estado: {} },
      coincide: 'Coincide: 40 de 400 es la décima parte de la vuelta, igual que 36 de 360.',
    },
    mira: {
      datos: {
        circulos: [{ r: 1 }],
        sectores: [{ de: 0, a: 36, r: 1, color: 'o', desde: 2 }],
        rayos: [{ ang: 0, largo: 1.15, grosor: 'contorno' }, { ang: 36, color: 'o', rotulo: '40ᵍ', desde: 2, hasta: 2 }, { ang: 36, color: 'o', rotulo: '36°', desde: 3 }],
        arcos: [{ de: 0, a: 360, r: 0.25, espiral: 0, color: 'o', rotulo: '1 vuelta', flecha: false, desde: 1, hasta: 1 }],
        alt: 'Una vuelta y su décima parte: 40 grados centesimales son 36 grados sexagesimales',
      },
      voz: 'Una vuelta primero; después, la parte que ocupa el giro.',
      pasos: [
        { estado: { corte: 1 }, texto: 'Una vuelta mide 360°, 400ᵍ o 2π rad.', ecuacion: ['360° = ', gc('400'), ' = 2π rad'] },
        { estado: { corte: 2 }, texto: 'El giro de 40ᵍ ocupa 40 de las 400 partes.', ecuacion: [{ frac: [gc('40'), gc('400')] }, ' = ', { frac: ['1', '10'] }, ' de vuelta'] },
        { estado: { corte: 3 }, texto: 'La décima parte de 360° es 36°.', ecuacion: ['360° · ', { frac: ['1', '10'] }, ' = 36°'] },
      ],
    },
    regla: {
      texto: 'Convertir no cambia el giro: conserva la fracción de vuelta. Por eso las tres medidas, divididas entre su media vuelta, dan lo mismo.',
      ecuacion: [{ frac: [D, '180'] }, ' = ', { frac: [G, '200'] }, ' = ', { frac: [R, 'π'] }],
      condicion: 'D, G y R son las medidas del mismo ángulo, con el mismo signo. Media vuelta es 180°, 200ᵍ o π rad.',
      voz: 'Tres escalas, un solo giro.',
    },
    ahoraTu: {
      voz: 'Compara las dos medias vueltas antes de calcular.',
      generar(sem) {
        const rr = azar(sem), deg = 9 * rr.ent(1, 39) * (rr.ent(0, 4) === 0 ? -1 : 1);
        const cen = deg * 10 / 9, tipo = sem % 3;
        if (tipo === 0) {
          return {
            pregunta: ['Un ángulo mide ', gc(f(cen)), '. ¿Cuánto mide en grados sexagesimales?'],
            opciones: opciones(deg, [
              { id: 'mismo', valor: cen, error: 'CONV-MISMO', siFuera: 'Eso conserva el número. Una vuelta tiene 400ᵍ y solo 360°.' },
              { id: 'inversa', valor: cen * 10 / 9, error: 'CONV-INVERSA', siFuera: 'Eso multiplica por 10/9. Se multiplica por 9/10: 180 sobre 200.' },
              { id: 'mitad', valor: cen * 180 / 100, error: 'CONV-MITAD', siFuera: 'Eso toma 100ᵍ como media vuelta. Media vuelta son 200ᵍ.' },
            ], v => `${f(v)}°`),
            solucion: { texto: 'Se conserva la fracción de media vuelta.', ecuacion: [D, ' = ', `${f(cen)} · `, { frac: ['180', '200'] }, ` = ${f(deg)}°`] },
          };
        }
        const dd = 15 * rr.ent(1, 24) * (rr.ent(0, 4) === 0 ? -1 : 1);
        if (tipo === 1) {
          return {
            pregunta: ['Un ángulo mide ', D, ` = ${f(dd)}°. ¿Cuánto mide en radianes?`],
            opciones: opciones(piTxt(dd), [
              { id: 'inversa', valor: `${f(dd * 180)}π`, error: 'CONV-INVERSA', siFuera: 'Eso multiplica por 180. Se divide entre 180 y se multiplica por π.' },
              { id: 'sin-pi', valor: f(dd / 180, 2), error: 'CONV-PI', siFuera: 'Esa es la fracción de media vuelta; falta multiplicarla por π.' },
              { id: 'cien', valor: piFrac(dd, 200), error: 'CONV-MITAD', siFuera: 'Eso usa 200 como media vuelta: esa es la de los grados centesimales.' },
            ], v => `${v} rad`),
            solucion: { texto: 'Media vuelta son 180° y también π rad.', ecuacion: [R, ` = ${f(dd)} · `, { frac: ['π', '180'] }, ` = ${piTxt(dd)} rad`] },
          };
        }
        return {
          pregunta: ['Un ángulo mide ', R, ` = ${piTxt(dd)} rad. ¿Cuánto mide en grados sexagesimales?`],
          opciones: opciones(dd, [
            { id: 'cen', valor: dd * 10 / 9, error: 'CONV-MITAD', siFuera: 'Esa es la medida en grados centesimales, no en sexagesimales.' },
            { id: 'pi-num', valor: Math.round(dd / 180 * Math.PI * 100) / 100, error: 'CONV-PI', siFuera: 'Eso es el número de radianes, escrito como decimal. Falta pasar a grados.' },
            { id: 'doble', valor: dd * 2, error: 'CONV-INVERSA', siFuera: 'Eso toma π como una vuelta entera. π rad es media vuelta: 180°.' },
          ], v => `${f(v)}°`),
          solucion: { texto: 'Se cambia π por 180°: los dos son media vuelta.', ecuacion: [D, ` = ${piTxt(dd)} · `, { frac: ['180°', 'π'] }, ` = ${f(dd)}°`] },
        };
      },
    },
  };

  // ---------- Idea 3: un radián, un radio de arco ----------
  // Cambia: el radio r y el arco s. · Permanece: el centro, el lado inicial y la escala del plano.
  // Progresa: el número de radios que caben en el arco. · Se reserva: la vuelta completa (la predicción).
  // Debe verse: que θ = s/r no cambia si r y s crecen juntos.
  const arcoRad = (rv, sv, extra = {}) => {
    const deg = sv / rv * 180 / Math.PI;
    return Object.assign({
      ventana: { x: [-3.3, 3.3], y: [-3.3, 3.3] },
      circulos: [{ r: rv }],
      sectores: [{ de: 0, a: deg, r: rv, color: 'o' }],
      arcos: [{ de: 0, a: deg, r: rv, espiral: 0, color: 'i', rotulo: `s = ${f(sv)}`, flecha: false }],
      segmentos: [{ de: [0, 0], a: [rv, 0], color: 'd', rotulo: `r = ${f(rv)}` }],
      alt: `Arco de largo ${f(sv)} en un círculo de radio ${f(rv)}: ${f(sv / rv)} radianes`,
    }, extra);
  };
  // La vuelta partida en radios: 6 arcos de un radio (alternados) y el sobrante.
  const tiras = (desde = 0, hasta) => {
    const a = [], uno = 180 / Math.PI;
    for (let k = 0; k < 6; k++) a.push({ de: k * uno, a: (k + 1) * uno, r: 1, espiral: 0, color: k % 2 ? 'd' : 'i', grosor: 'variable', flecha: false, desde: desde ? desde + (k >= 3 ? 1 : 0) : 0, hasta, rotulo: `${k + 1}` });
    a.push({ de: 6 * uno, a: 360, r: 1, espiral: 0, color: 'h', flecha: false, desde: desde ? desde + 2 : 0, hasta });
    return a;
  };
  const radian = {
    id: 'radian',
    titulo: 'Un radián: un radio de arco',
    temas: ['Radián', 'Conversión entre sistemas'],
    pieza: 'trig-plano',
    juega: {
      consigna: 'Elige el radio r y el largo del arco s. La lectura dice cuántos radios mide el arco: esa es la medida en radianes.',
      voz: 'Prueba duplicar r y s a la vez.',
      controles: [
        { id: 'r', etiqueta: 'r', color: 'c-d', min: 1, max: 3, paso: 0.5, inicio: 2, unidad: 'cm', decimales: 1 },
        { id: 's', etiqueta: 's', color: 'c-i', min: 0.5, max: 6, paso: 0.5, inicio: 2, unidad: 'cm', decimales: 1 },
      ],
      dibujo: val => ({ datos: arcoRad(val.r, val.s), estado: {} }),
      lectura: val => [th, ' = ', s, '/', r, ` = ${f(val.s)}/${f(val.r)} = ${f(val.s / val.r)} rad`],
      minimo: 3,
    },
    predice: {
      pregunta: 'Si recorres una vuelta completa por el borde, ¿cuántos radios de largo mide ese recorrido? Es la medida de una vuelta en radianes.',
      voz: 'Imagina radios puestos uno tras otro sobre el borde.',
      opciones: [
        { id: 'c', texto: '2π ≈ 6,28', correcta: true },
        { id: 'entero', texto: '6 exactos', error: 'RAD-ENTERO', siFuera: 'Caben 6 radios enteros, y sobra un pedazo: la vuelta mide 2π ≈ 6,28 radios.' },
        { id: 'grados', texto: '360', error: 'RAD-GRADOS', siFuera: '360 es la vuelta en grados. En radianes se cuentan radios de arco.' },
        { id: 'tamano', texto: 'Depende del radio', error: 'RAD-TAMAÑO', siFuera: 'Con un radio mayor, el borde crece en la misma proporción: el cociente no cambia.' },
      ],
      dibujo: { datos: { circulos: [{ r: 1 }], segmentos: [{ de: [0, 0], a: [1, 0], color: 'd', rotulo: 'r' }], arcos: [{ de: 0, a: 180 / Math.PI, r: 1, espiral: 0, color: 'i', flecha: false, rotulo: '1' }], alt: 'Circunferencia con un arco del largo del radio' }, estado: {} },
      revelar: { datos: { circulos: [{ r: 1 }], segmentos: [{ de: [0, 0], a: [1, 0], color: 'd', rotulo: 'r' }], arcos: tiras(), rotulos: [{ x: -0.5, y: 0.35, texto: `2π ≈ ${f(2 * Math.PI)}`, color: 'o' }], alt: 'La vuelta partida en seis arcos del largo del radio y un sobrante: 2 pi radianes' }, estado: {} },
      coincide: 'Coincide: seis radios enteros y un sobrante de unos 0,28 radios.',
    },
    mira: {
      datos: {
        circulos: [{ r: 1 }],
        segmentos: [{ de: [0, 0], a: [1, 0], color: 'd', rotulo: 'r' }, { de: [0, 0], a: [Math.cos(1), Math.sin(1)], color: 'd', desde: 1, hasta: 1 }],
        arcos: tiras(2).map((a, k) => (k === 0 ? Object.assign({}, a, { desde: 1, hasta: undefined }) : a)),
        sectores: [{ de: 0, a: 180 / Math.PI, r: 1, color: 'o', desde: 1, hasta: 1 }],
        rotulos: [{ x: 0, y: 0.35, texto: `π ≈ ${f(Math.PI)}`, color: 'o', desde: 3, hasta: 3 }, { x: -0.5, y: 0.35, texto: `2π ≈ ${f(2 * Math.PI)}`, color: 'o', desde: 4 }],
        alt: 'Radios de arco puestos sobre la circunferencia: tres y un poco en media vuelta, seis y un poco en una vuelta',
      },
      voz: 'Cuenta los radios a lo largo del borde.',
      pasos: [
        { estado: { corte: 1 }, texto: 'Un arco del mismo largo que el radio forma un radián.', ecuacion: [s, ' = ', r, '  ⇒  ', th, ' = 1 rad'] },
        { estado: { corte: 3 }, texto: 'En media vuelta caben tres radios y un poco: π.', ecuacion: ['180° = π rad ≈ ', f(Math.PI), ' rad'] },
        { estado: { corte: 4 }, texto: 'En la vuelta entera caben 2π radios.', ecuacion: ['360° = 2π rad ≈ ', f(2 * Math.PI), ' rad'] },
        { estado: { corte: 4 }, texto: 'Por eso un radián es un poco menos de 60°.', ecuacion: ['1 rad = ', { frac: ['180°', 'π'] }, ` ≈ ${f(180 / Math.PI, 1)}°`] },
      ],
    },
    regla: {
      texto: 'La medida en radianes cuenta cuántos radios mide el arco. No depende del tamaño del círculo: si el radio crece, el arco crece igual.',
      ecuacion: [th, ' = ', { frac: [s, r] }, ';   1 vuelta = 2π rad'],
      condicion: 's y r en la misma unidad de longitud, y θ en radianes.',
      voz: 'El radián compara dos largos; por eso no lleva centímetros.',
    },
    ahoraTu: {
      voz: 'Mira si piden el ángulo o el arco.',
      generar(sem) {
        const rr = azar(sem), rv = rr.ent(2, 9), pide = sem % 2 ? 'arco' : 'angulo';
        if (pide === 'angulo') {
          const sv = rv * rr.uno([0.5, 1.5, 2, 2.5, 3, 4]);
          const t = sv / rv;
          return {
            pregunta: ['En un círculo de radio ', r, ` = ${f(rv)} cm, un arco mide `, s, ` = ${f(sv)} cm. ¿Cuánto mide su ángulo central en radianes?`],
            opciones: opciones(t, [
              { id: 'inversa', valor: rv / sv, error: 'RAD-INVERSA', siFuera: 'Eso divide el radio entre el arco. Se cuentan radios dentro del arco: s/r.' },
              { id: 'producto', valor: sv * rv, error: 'RAD-PRODUCTO', siFuera: 'Eso multiplica los largos. Los radianes salen de comparar: s entre r.' },
              { id: 'grados', valor: t * 180 / Math.PI, error: 'RAD-GRADOS', siFuera: 'Ese número es la medida en grados, sin el símbolo.' },
            ], v => `${f(v)} rad`),
            solucion: { texto: `El arco mide ${f(t)} veces el radio.`, ecuacion: [th, ' = ', { frac: [`${f(sv)}`, `${f(rv)}`] }, ` = ${f(t)} rad`] },
          };
        }
        const t = rr.uno([0.5, 1.5, 2, 2.5, 3]), sv = t * rv;
        return {
          pregunta: ['Un ángulo central de ', th, ` = ${f(t)} rad está en un círculo de radio `, r, ` = ${f(rv)} cm. ¿Cuánto mide su arco?`],
          opciones: opciones(sv, [
            { id: 'division', valor: rv / t, error: 'RAD-INVERSA', siFuera: 'Eso divide el radio entre el ángulo. El arco son θ radios: θ · r.' },
            { id: 'solo', valor: t, error: 'RAD-TAMAÑO', siFuera: 'Ese es el ángulo. El arco depende también del radio.' },
            { id: 'grados', valor: t * 180 / Math.PI * rv, error: 'RAD-GRADOS', siFuera: 'Eso usa el ángulo en grados. La fórmula s = θ r pide radianes.' },
          ], v => `${f(v)} cm`),
          solucion: { texto: `El arco mide ${f(t)} radios de ${f(rv)} cm.`, ecuacion: [s, ' = ', th, ' · ', r, ` = ${f(t)} · ${f(rv)} = ${f(sv)} cm`] },
        };
      },
    },
  };

  // ---------- Idea 4: minutos no son décimas ----------
  // Cambia: grados y minutos de un ángulo. · Permanece: la recta de 0° a 4° partida en quintos (12′).
  // Progresa: el punto que avanza un minuto de cada sesenta. · Se reserva: el decimal que parece igual (la predicción).
  // Debe verse: que 2° 15′ queda en 2,25°, no en 2,15°.
  const rectaGrados = elementos => ({ min: 0, max: 4, paso: 0.2, cada: 5, sufijo: '°', decimales: 0, variable: 'θ', color: 'o', filas: 3, elementos });
  const gm = (g, m) => `${g}° ${m}′`;
  const minutos = {
    id: 'minutos-decimales',
    titulo: 'Minutos no son décimas',
    temas: ['Sistemas sexagesimal, centesimal y radial'],
    pieza: 'recta',
    juega: {
      consigna: 'Arma un ángulo con grados y minutos. Cada rayita de la recta son 12 minutos; un grado tiene 60.',
      voz: 'Cuenta las rayitas que hay entre dos grados.',
      controles: [
        { id: 'g', etiqueta: 'Grados', min: 0, max: 3, paso: 1, inicio: 1, unidad: '°', decimales: 0 },
        { id: 'm', etiqueta: 'Minutos', min: 0, max: 48, paso: 12, inicio: 36, unidad: '′', decimales: 0 },
      ],
      dibujo: val => ({ datos: rectaGrados([{ tipo: 'punto', x: val.g + val.m / 60, color: 'o', rotulo: gm(val.g, val.m) }]), estado: {} }),
      lectura: val => [th, ` = ${gm(val.g, val.m)} = ${f(val.g + val.m / 60, 4)}°`],
      minimo: 3,
    },
    predice: {
      pregunta: '¿Cuántos grados, con decimales, mide un ángulo de 2° 15′?',
      voz: 'Piensa en cuántos minutos tiene un grado.',
      opciones: [
        { id: 'c', texto: '2,25°', correcta: true },
        { id: 'decimal', texto: '2,15°', error: 'SEX-DECIMAL', siFuera: 'Sería cierto si un grado tuviera 100 minutos. Tiene 60: 15′ es la cuarta parte.' },
        { id: 'cien', texto: '2,015°', error: 'SEX-CIEN', siFuera: 'Eso lee 15′ como milésimas. Un minuto es la sexagésima parte de un grado.' },
        { id: 'suma', texto: '17°', error: 'SEX-SUMA', siFuera: 'Eso suma grados y minutos como si fueran la misma unidad.' },
      ],
      dibujo: { datos: rectaGrados([]), estado: {} },
      revelar: { datos: rectaGrados([{ tipo: 'punto', x: 2.25, color: 'o', rotulo: '2° 15′ = 2,25°' }, { tipo: 'punto', x: 2.15, abierto: true, rotulo: '2,15°', fila: 2 }]), estado: {} },
      coincide: 'Coincide: 15 de los 60 minutos de un grado son la cuarta parte.',
    },
    mira: {
      datos: rectaGrados([
        { tipo: 'distancia', a: 2, b: 3, rotulo: '1° = 60′', desde: 1, fila: 3 },
        { tipo: 'distancia', a: 2, b: 2.25, color: 'o', rotulo: '15′', desde: 2, fila: 2 },
        { tipo: 'punto', x: 2.25, color: 'o', rotulo: '2,25°', desde: 3 },
      ]),
      voz: 'Un grado partido en sesenta, no en cien.',
      pasos: [
        { estado: { corte: 1 }, texto: 'Entre dos grados hay 60 minutos.', ecuacion: ['1° = 60′'] },
        { estado: { corte: 2 }, texto: '15 minutos son 15 de esas 60 partes.', ecuacion: [{ frac: ['15', '60'] }, ' = ', { frac: ['1', '4'] }, ' = 0,25'] },
        { estado: { corte: 3 }, texto: 'El ángulo queda a un cuarto del camino entre 2° y 3°.', ecuacion: ['2° 15′ = 2,25°'] },
      ],
    },
    regla: {
      texto: 'En el sistema sexagesimal, un grado tiene 60 minutos y un minuto tiene 60 segundos. Para pasar minutos a grados se divide entre 60.',
      ecuacion: ['1° = 60′;   1′ = 60″;   m′ = ', { frac: ['m', '60'] }, ' grados'],
      condicion: 'los minutos y segundos son sexagesimales. Una coma decimal ya no es sexagesimal: 1,5° = 1° 30′.',
      voz: 'Sesenta partes por grado; no las leas como décimas.',
    },
    ahoraTu: {
      voz: 'Primero decide en cuántas partes se divide un grado.',
      generar(sem) {
        const rr = azar(sem), g = rr.ent(1, 40), m = rr.uno([6, 12, 15, 18, 24, 30, 36, 42, 45, 48, 54]);
        const dec = g + m / 60;
        if (sem % 2) {
          return {
            pregunta: ['Un ángulo mide ', th, ` = ${f(dec, 2)}°. ¿Cuánto mide en grados y minutos?`],
            opciones: opciones(gm(g, m), [
              { id: 'decimal', valor: gm(g, Math.round((dec - g) * 100)), error: 'SEX-DECIMAL', siFuera: 'Eso lee las décimas como minutos. Hay que multiplicar la parte decimal por 60.' },
              { id: 'redondeo', valor: gm(g + Math.round(dec - g), 0), error: 'SEX-REDONDEO', siFuera: 'Eso redondea al grado entero. La parte decimal se convierte en minutos.' },
              { id: 'suma', valor: `${f(Math.round(dec * 60))}′`, error: 'SEX-SUMA', siFuera: 'Ese es el ángulo entero en minutos; aquí se piden grados y minutos.' },
            ], v => v),
            solucion: { texto: `La parte decimal por 60 da los minutos.`, ecuacion: [`${f(dec - g, 2)} · 60 = ${m}′  ⇒  `, th, ` = ${gm(g, m)}`] },
          };
        }
        return {
          pregunta: ['Un ángulo mide ', th, ` = ${gm(g, m)}. ¿Cuánto mide en grados, con decimales?`],
          opciones: opciones(dec, [
            { id: 'decimal', valor: g + m / 100, error: 'SEX-DECIMAL', siFuera: `Eso lee ${m}′ como centésimas. Un grado tiene 60 minutos.` },
            { id: 'cien', valor: g + m / 1000, error: 'SEX-CIEN', siFuera: `Eso lee ${m}′ como milésimas. Se divide entre 60.` },
            { id: 'suma', valor: g + m, error: 'SEX-SUMA', siFuera: 'Eso suma grados y minutos como si fueran la misma unidad.' },
          ], v => `${f(v, 3)}°`),
          solucion: { texto: `Los ${m} minutos se dividen entre 60.`, ecuacion: [`${f(g)} + `, { frac: [`${m}`, '60'] }, ` = ${f(dec, 3)}°`] },
        };
      },
    },
  };

  return {
    unidad: 'trigonometria.angulo-trigonometrico',
    version: '0.1.0',
    estado: 'completa',
    requiere: ['/nucleo/kit/piezas/trig-plano.js', '/nucleo/kit/piezas/recta.js'],
    historia: {
      texto: 'Los astrónomos babilonios contaban en base sesenta, y la astronomía griega heredó la vuelta de 360 partes; de ahí vienen nuestros grados, minutos y segundos. Mucho después apareció otra idea: medir el giro comparando el arco con el radio. Grados y radianes nombran el mismo giro con escalas distintas.',
      pregunta: '¿Por qué una vuelta tendría 360 partes y no 100?',
      fuente: { titulo: 'J. J. O’Connor y E. F. Robertson, «Babylonian numerals», MacTutor', url: 'https://mathshistory.st-andrews.ac.uk/HistTopics/Babylonian_numerals/' },
    },
    ideas: [sentido, escalas, radian, minutos],
  };
});
