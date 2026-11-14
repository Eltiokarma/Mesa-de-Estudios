/*
 * Teoría de «Identidades trigonométricas fundamentales» (trigonometria.identidades-fundamentales), 4.º de secundaria.
 * Fuente del contenido: docs/teoria/matriz/trigonometria.json (unidad 9), docs/teoria/fuentes/historia-ecuaciones.pdf
 * (trigonometría, pp. 82–100) y las «Precisiones de Geometría y Trigonometría» del expediente.
 * Forma: contenido/teoria/trigonometria/angulo-trigonometrico.js. Ruta: seguir un ejemplo, con apoyo de recordar.
 * Compañera: Mara (coneja), cercana y rigurosa: una identidad vale en todo su dominio; tres valores no la prueban.
 * Colores (regla 4), los mismos de circunferencia-trigonometrica: θ en naranja (c-o); seno y cosecante en rojo (c-h);
 * coseno y secante en turquesa (c-i); tangente, cotangente y el radio 1 en verde (c-d). En las gráficas de las ideas
 * 3 y 4, el miembro izquierdo de la igualdad va en naranja (es una expresión de θ) y el derecho en verde discontinuo.
 * Errores: TR11 (cruza seno y coseno), TR12 (signo), TR16 (linealidad: (a + b)² = a² + b²) de
 * docs/investigacion/trigonometria-ideas-erroneas.md y TRPN-INVERSA (de angulos-en-posicion-normal); hipótesis nuevas:
 * TRID-DIVIDE (al dividir no divide todos los términos), TRID-LINEAL (cos θ = 1 − sen θ), TRID-DOMINIO (una identidad
 * vale para todo θ aunque un denominador se anule), TRID-MITAD (olvida dividir entre 2), TRID-SIN-CUADRADO (usa k en
 * lugar de k²), TRID-POTENCIA (sen⁴ + cos⁴ = 1 como la pitagórica), TRID-MUESTREO (probar valores demuestra; es el
 * error objetivo de la matriz) y TRID-RAIZ (√(sen²θ) = sen θ).
 * Ronda 2 (14 nov, noche): manijas en las cuatro ideas (el punto P sobre la circunferencia en las ideas 1 y 2; el
 * punto de la curva, que se corre en θ, en las ideas 3 y 4), llaves en las reglas (catetos y radio, recíprocas,
 * denominadores no nulos, término doble), potencias con { sup } en las reglas, separadores «   ·   » donde había «;»
 * y laboratorio de dos mesas. Hallazgo 9: «Juega» y «Mira» usan la misma pieza en cada idea (ver la idea 2).
 *
 * Ficha de tarea (diseno-y-animacion):
 *   Promesa: las identidades salen de Pitágoras en la C.T. y se demuestran transformando, con su dominio a la vista.
 *   Persona y condiciones: postulante de 4.º, celular de 360 px de gama baja, con o sin conexión, en el aula o en casa.
 *   Resultado observable: usa una identidad para hallar un valor, simplifica declarando el dominio y refuta con un contraejemplo.
 *   Orden de atención: 1.º el triángulo de la C.T. o las dos gráficas · 2.º dónde coinciden o se separan · acción: mover θ · fondo: ejes.
 *   Estados: juego sin tocar · probando · predicción pendiente · coincide / no coincide · paso de «Mira» · caso nuevo.
 *   Duda que resuelve: ¿por qué comprobar con tres ángulos no basta, y por qué al simplificar quedan huecos?
 */
(function (root, fabrica) {
  const def = fabrica(typeof module === 'object' && module.exports ? require('../../../nucleo/kit/kit.js') : root.Kit);
  if (typeof module === 'object' && module.exports) module.exports = def;
  else root.Teoria.unidad(def);
})(typeof self !== 'undefined' ? self : this, function (Kit) {
  'use strict';
  const f = (n, d = 2) => Kit.formatear(n, d);
  const th = { v: 'c-o', t: 'θ' };
  const rad = g => g * Math.PI / 180;
  const gcd = (a, b) => (b ? gcd(b, a % b) : Math.abs(a));
  const ROM = ['', 'I', 'II', 'III', 'IV'];
  // Potencias de las razones con { sup } (tipografía de la ronda 2): sen²θ, cos⁴θ…
  const p2 = (fn, e = '2') => ({ sup: [fn, e] });
  // Gesto directo (docs/teoria.md §4b): las manijas usan la geometría de las piezas. La pieza ejes no trae inversa:
  // se invierte su escala lineal aquí (como `inversa` en fisica/movimiento-rectilineo.js).
  const TP = () => Kit.piezas['trig-plano'], EJES = () => Kit.piezas.ejes;
  const inversa = (escala, a, b) => px => a + (px - escala(a)) * (b - a) / (escala(b) - escala(a));
  const punta = (d, gr, L = 1) => TP().enPx(d, L * Math.cos(rad(gr)), L * Math.sin(rad(gr)));
  // El ángulo del dedo entre 0° y 360°; cerca de 0° viniendo de arriba de 180°, se queda en 360° (atan2 da 0).
  const giroDe = (d, pt, actual) => { const a = TP().anguloDe(d, pt); return a < 8 && actual > 180 ? 360 : a; };
  // En una gráfica de ejes, el θ que marca el dedo (solo cuenta la x).
  const thetaDe = (datos, pt) => inversa(v => EJES().geometria(datos).X(v), datos.x.min, datos.x.max)(pt.x);
  const enEjes = (datos, x, y) => { const g = EJES().geometria(datos); return { x: g.X(x), y: g.Y(y) }; };
  // Fracción simplificada como texto: (−3, 5) → «−3/5».
  function fr(p, q) {
    if (p === 0) return '0';
    const m = gcd(p, q), sg = (p < 0) !== (q < 0) ? '−' : '', a = Math.abs(p / m), b = Math.abs(q / m);
    return b === 1 ? `${sg}${a}` : `${sg}${a}/${b}`;
  }
  function azar(sem) {
    let q = (sem * 2654435761 + 12345) >>> 0;
    const rr = () => { q = (q + 0x6D2B79F5) >>> 0; let z = q; z = Math.imul(z ^ (z >>> 15), z | 1); z ^= z + Math.imul(z ^ (z >>> 7), z | 61); return ((z ^ (z >>> 14)) >>> 0) / 4294967296; };
    rr.ent = (lo, hi) => lo + Math.floor(rr() * (hi - lo + 1));
    rr.uno = xs => xs[Math.floor(rr() * xs.length)];
    return rr;
  }
  function opciones(correcta, distractores, fmt) {
    const vistos = new Set([fmt(correcta)]);
    const ops = [{ id: 'c', texto: fmt(correcta), correcta: true }];
    for (const d of distractores) {
      const txt = fmt(d.valor);
      if (vistos.has(txt)) continue;
      vistos.add(txt);
      ops.push({ id: d.id, texto: txt, error: d.error, siFuera: d.siFuera });
    }
    return ops.slice(0, 4);
  }

  // ---------- Idea 1: Pitágoras en la circunferencia ----------
  // Cambia: el arco θ. · Permanece: el radio 1 como hipotenusa. · Progresa: los catetos sen θ y cos θ, con signo.
  // Se reserva: dividir entre cos²θ (la predicción): aparece el triángulo de la recta tangente. · Debe verse: que la
  // suma de los cuadrados no cambia aunque los catetos sí.
  function triangulo(g, extra = {}) {
    const x = Math.cos(rad(g)), y = Math.sin(rad(g));
    return Object.assign({
      circulos: [{ r: 1 }],
      segmentos: [
        { de: [0, 0], a: [x, 0], color: 'i', rotulo: Math.abs(x) > 0.25 ? 'cos θ' : undefined },
        { de: [x, 0], a: [x, y], color: 'h', rotulo: Math.abs(y) > 0.25 ? 'sen θ' : undefined },
        { de: [0, 0], a: [x, y], color: 'd' },
      ],
      arcos: [{ de: 0, a: g, r: 0.2, color: 'o' }],
      puntos: [{ x, y, rotulo: 'P', lado: y >= 0 ? (x >= 0 ? 'ne' : 'no') : (x >= 0 ? 'se' : 'so') }],
      // Si el triángulo se aplana sobre un eje, el «1» se taparía con el cateto: no se rotula.
      rotulos: Math.abs(x) < 0.15 || Math.abs(y) < 0.15 ? [] : [(() => { const s = x * y > 0 ? 1 : -1; return { x: x / 2 - s * y * 0.13, y: y / 2 + s * x * 0.13 - 0.04, texto: '1', color: 'd' }; })()],
      alt: `Triángulo en la circunferencia para θ = ${f(g)} grados: catetos ${f(Math.abs(x))} y ${f(Math.abs(y))}, hipotenusa 1`,
    }, extra);
  }
  const V40 = { c: Math.cos(rad(40)), s: Math.sin(rad(40)), t: Math.tan(rad(40)) };
  const tresTriangulos = {
    ventana: { x: [-0.3, 1.6], y: [-0.3, 1.6] },
    curvas: [{ puntos: Array.from({ length: 31 }, (_, i) => [Math.cos(i * Math.PI / 60), Math.sin(i * Math.PI / 60)]), color: null }],
    rectas: [{ x: 1, color: 'd', desde: 2 }, { y: 1, color: 'd', desde: 3 }],
    segmentos: [
      { de: [0, 0], a: [V40.c, 0], color: 'i', rotulo: 'cos', desde: 1, hasta: 1 }, { de: [V40.c, 0], a: [V40.c, V40.s], color: 'h', rotulo: 'sen', desde: 1, hasta: 1 },
      { de: [0, 0], a: [1, 0], color: 'd', rotulo: '1', desde: 2, hasta: 2 }, { de: [1, 0], a: [1, V40.t], color: 'd', rotulo: 'tan', desde: 2, hasta: 2 }, { de: [0, 0], a: [1, V40.t], color: 'i', rotulo: 'sec', lado: 'adentro', desde: 2, hasta: 2 },
      { de: [0, 0], a: [0, 1], color: 'd', rotulo: '1', desde: 3 }, { de: [0, 1], a: [1 / V40.t, 1], color: 'd', rotulo: 'cot', desde: 3 }, { de: [0, 0], a: [1 / V40.t, 1], color: 'h', rotulo: 'csc', lado: 'adentro', desde: 3 },
      { de: [0, 0], a: [V40.c, V40.s], color: 'd', desde: 1, hasta: 1 },
    ],
    puntos: [{ x: V40.c, y: V40.s, rotulo: 'P', lado: 'no', desde: 1, hasta: 1 }],
    alt: 'Tres triángulos rectángulos semejantes del mismo ángulo de 40 grados: catetos seno y coseno con hipotenusa 1; 1 y tangente con hipotenusa secante; 1 y cotangente con hipotenusa cosecante',
  };
  const pitagoricas = {
    id: 'pitagoricas',
    titulo: 'Pitágoras dentro de la circunferencia',
    temas: ['Identidades pitagóricas'],
    pieza: 'trig-plano',
    juega: {
      consigna: 'Gira θ. Los catetos del triángulo son cos θ y sen θ; la hipotenusa es el radio, 1. Mira la suma de sus cuadrados.',
      voz: 'Los catetos cambian; fíjate si la suma también cambia.',
      controles: [{ id: 'g', etiqueta: 'θ', color: 'c-o', min: 0, max: 360, paso: 15, inicio: 30, unidad: '°', decimales: 0 }],
      dibujo: val => ({ datos: triangulo(val.g), estado: {} }),
      lectura: val => { const s2 = Math.sin(rad(val.g)) ** 2, c2 = Math.cos(rad(val.g)) ** 2; return [`sen²`, th, ' + cos²', th, ` = ${f(s2)} + ${f(c2)} = ${f(s2 + c2)}`]; },
      minimo: 3,
      // Se arrastra P sobre la circunferencia: los catetos cambian y la hipotenusa sigue en 1.
      arrastres: [{ id: 'punto-p', etiqueta: 'punto P del arco θ', color: 'c-o',
        donde: val => punta(triangulo(val.g), val.g),
        mover: (pt, val) => ({ g: giroDe(triangulo(val.g), pt, val.g) }) }],
    },
    predice: {
      pregunta: 'Si divides cada término de sen²θ + cos²θ = 1 entre cos²θ, ¿qué igualdad queda?',
      voz: 'Divide término por término, sin dejar ninguno.',
      opciones: [
        { id: 'c', texto: 'tan²θ + 1 = sec²θ', correcta: true },
        { id: 'uno', texto: 'tan²θ + 1 = 1', error: 'TRID-DIVIDE', siFuera: 'Los dos primeros términos están bien divididos. El 1 también se divide: 1/cos²θ = sec²θ.' },
        { id: 'cot', texto: 'cot²θ + 1 = csc²θ', error: 'TR11', siFuera: 'Esa es correcta si se divide entre sen²θ. Aquí se divide entre cos²θ.' },
        { id: 'parcial', texto: 'tan²θ + cos²θ = sec²θ', error: 'TRID-DIVIDE', siFuera: 'El primero y el 1 están bien. cos²θ entre cos²θ da 1.' },
      ],
      dibujo: { datos: triangulo(40), estado: {} },
      revelar: { datos: tresTriangulos, estado: { corte: 2 } },
      coincide: 'Coincide: aparece el triángulo de la recta tangente, con catetos 1 y tan θ.',
      noCoincide: 'Revisemos: el triángulo dividido entre cos θ tiene catetos 1 y tan θ.',
    },
    mira: {
      datos: tresTriangulos,
      voz: 'Tres triángulos del mismo ángulo: cada uno da una identidad.',
      pasos: [
        { estado: { corte: 1 }, texto: 'En la C.T., Pitágoras con catetos cos θ, sen θ e hipotenusa 1.', ecuacion: ['sen²', th, ' + cos²', th, ' = 1'] },
        { estado: { corte: 2 }, texto: 'Entre cos²θ: el triángulo de la recta x = 1.', ecuacion: ['tan²', th, ' + 1 = sec²', th] },
        { estado: { corte: 3 }, texto: 'Entre sen²θ: el triángulo de la recta y = 1.', ecuacion: ['1 + cot²', th, ' = csc²', th] },
      ],
    },
    regla: {
      texto: 'La pitagórica es Pitágoras en la circunferencia de radio 1. Dividida entre cos²θ o entre sen²θ, da las otras dos.',
      ecuacion: [{ llave: [p2('sen'), th], nota: 'cateto al cuadrado', color: 'c-h' }, ' + ', { llave: [p2('cos'), th], nota: 'otro cateto', color: 'c-i' }, ' = ', { llave: ['1'], nota: 'radio', color: 'c-d' },
        '   ·   ', '1 + ', p2('tan'), th, ' = ', p2('sec'), th, '   ·   ', '1 + ', p2('cot'), th, ' = ', p2('csc'), th],
      condicion: 'La primera, para todo θ. La segunda pide cos θ ≠ 0; la tercera, sen θ ≠ 0.',
      voz: 'Antes de dividir, anotemos qué no puede valer cero.',
    },
    ahoraTu: {
      voz: 'Usa la pitagórica; el signo lo da el cuadrante.',
      generar(sem) {
        const rr = azar(sem), [a, b, c] = rr.uno([[3, 4, 5], [5, 12, 13], [8, 15, 17], [7, 24, 25]]), q = rr.ent(1, 4);
        const sx = q === 1 || q === 4 ? 1 : -1, sy = q <= 2 ? 1 : -1, dadoSen = sem % 2 === 0;
        const x = sx * (dadoSen ? b : a), y = sy * (dadoSen ? a : b);
        const dado = dadoSen ? fr(y, c) : fr(x, c), pide = dadoSen ? 'cos' : 'sen';
        const bien = dadoSen ? fr(x, c) : fr(y, c), otro = dadoSen ? Math.abs(y) : Math.abs(x);
        const sgPide = dadoSen ? sx : sy;
        return {
          pregunta: [`Si ${dadoSen ? 'sen' : 'cos'} `, th, ` = ${dado} y `, th, ` está en el cuadrante ${ROM[q]}, ¿cuánto vale ${pide} `, th, '?'],
          opciones: opciones(bien, [
            { id: 'signo', valor: fr(-sgPide * Math.abs(dadoSen ? x : y), c), error: 'TR12', siFuera: `El tamaño sale bien de la pitagórica. En el cuadrante ${ROM[q]}, ${pide} θ es ${sgPide > 0 ? 'positivo' : 'negativo'}.` },
            { id: 'lineal', valor: fr(sgPide * (c - otro), c), error: 'TRID-LINEAL', siFuera: 'Restar de 1 está bien encaminado, pero la identidad es con cuadrados.' },
            { id: 'cruza', valor: fr(sgPide * otro, c), error: 'TR11', siFuera: `Ese es el tamaño del dato. ${pide} θ mide el otro cateto.` },
          ], v => v),
          solucion: {
            texto: `${pide}² θ = 1 − (${fr(otro, c)})², y en el ${ROM[q]} su signo es ${sgPide > 0 ? '+' : '−'}.`,
            ecuacion: [`${pide} `, th, ' = ', sgPide > 0 ? '' : '−', { raiz: [`1 − ${fr(otro * otro, c * c)}`] }, ` = ${bien}`],
            dibujo: { datos: triangulo(Math.atan2(y, x) * 180 / Math.PI < 0 ? Math.atan2(y, x) * 180 / Math.PI + 360 : Math.atan2(y, x) * 180 / Math.PI), estado: {} },
          },
        };
      },
    },
  };

  // ---------- Idea 2: recíprocas y por división, con su dominio ----------
  // Cambia: el arco θ, de 30° en 30°. · Permanece: la C.T. con sus ejes. · Progresa: tan θ junto al cociente
  // sen θ/cos θ. · Se reserva: dónde falla sen θ · csc θ = 1 (la predicción; el juego no muestra csc).
  // Debe verse: que la igualdad vale salvo donde un denominador se anula.
  function cociente(g, extra = {}) {
    const x = Math.cos(rad(g)), y = Math.sin(rad(g)), tn = Math.abs(x) < 1e-9 ? NaN : y / x;
    const conT = Number.isFinite(tn) && Math.abs(tn) <= 2;
    return Object.assign({
      ventana: { x: [-1.4, 1.6], y: [-2.1, 2.1] },
      circulos: [{ r: 1 }],
      rectas: [{ x: 1, color: 'd' }],
      segmentos: [{ de: [0, 0], a: [x, 0], color: 'i' }, { de: [x, 0], a: [x, y], color: 'h' }].concat(conT ? [{ de: [0, 0], a: [1, tn], grosor: 'contorno', discontinua: true }, { de: [1, 0], a: [1, tn], color: 'd', punta: Math.abs(tn) > 0.05, rotulo: 'tan' }] : []),
      arcos: [{ de: 0, a: g, r: 0.2, color: 'o' }],
      puntos: [{ x, y, rotulo: 'P', lado: y >= 0 ? (x >= 0 ? 'ne' : 'no') : (x >= 0 ? 'se' : 'so') }],
      alt: `θ = ${f(g)} grados: seno ${f(y)}, coseno ${f(x)}${conT ? `, tangente ${f(tn)}` : Number.isFinite(tn) ? '' : ', tangente no existe'}`,
    }, extra);
  }
  const huecos = (desde = 0, extra = []) => [
    { x: 1, y: 0, abierto: true, rotulo: '0°', lado: 'se', desde }, { x: -1, y: 0, abierto: true, rotulo: '180°', lado: 'so', desde },
  ].concat(extra);
  const reciprocas = {
    id: 'reciprocas-division',
    titulo: 'Recíprocas y cocientes, con dominio',
    temas: ['Identidades recíprocas y por división'],
    pieza: 'trig-plano',
    juega: {
      consigna: 'Gira θ. Compara la línea tangente con el cociente de la línea seno entre la línea coseno. Prueba también donde el coseno vale 0.',
      voz: 'Mira qué pasa cuando el divisor se hace cero.',
      controles: [{ id: 'g', etiqueta: 'θ', color: 'c-o', min: 0, max: 360, paso: 30, inicio: 30, unidad: '°', decimales: 0 }],
      dibujo: val => ({ datos: cociente(val.g), estado: {} }),
      lectura: val => {
        const x = Math.cos(rad(val.g)), y = Math.sin(rad(val.g));
        if (Math.abs(x) < 1e-9) return ['cos ', th, ' = 0: tan ', th, ' no existe'];
        return ['tan ', th, ` = ${f(y / x)} · sen/cos = ${f(y)}/${f(x)}`];
      },
      minimo: 4,
      // Se arrastra P: la línea tangente responde y desaparece donde cos θ = 0.
      arrastres: [{ id: 'punto-p', etiqueta: 'punto P del arco θ', color: 'c-o',
        donde: val => punta(cociente(val.g), val.g),
        mover: (pt, val) => ({ g: giroDe(cociente(val.g), pt, val.g) }) }],
    },
    predice: {
      pregunta: 'Como csc θ = 1/sen θ, sen θ · csc θ = 1. ¿Vale esa igualdad para todo θ entre 0° y 360°?',
      voz: 'Antes de multiplicar, revisa si csc θ existe.',
      opciones: [
        { id: 'c', texto: 'No: falla donde sen θ = 0', correcta: true },
        { id: 'siempre', texto: 'Sí: son recíprocas', error: 'TRID-DOMINIO', siFuera: 'Son recíprocas, sí. Pero en 0° y 180° sen θ = 0 y csc θ no existe.' },
        { id: 'negativo', texto: 'No: falla donde sen θ < 0', error: 'TR12', siFuera: 'Con sen θ < 0, csc θ también es negativa: el producto sigue siendo 1.' },
        { id: 'cos', texto: 'No: falla donde cos θ = 0', error: 'TR11', siFuera: 'Eso pasa con tan θ y sec θ. csc θ depende del seno.' },
      ],
      dibujo: { datos: { circulos: [{ r: 1 }], puntos: [{ x: 0.5, y: 0.866, rotulo: 'P' }], segmentos: [{ de: [0.5, 0], a: [0.5, 0.866], color: 'h', rotulo: 'sen θ' }], alt: 'Circunferencia trigonométrica con la línea seno de un punto P' }, estado: {} },
      revelar: { datos: { circulos: [{ r: 1 }], puntos: huecos(), rotulos: [{ x: 0, y: 0.4, texto: 'sen θ = 0 → csc θ no existe', color: 'h' }], alt: 'En 0 y 180 grados el seno vale 0: la cosecante no existe y el producto no está definido' }, estado: {} },
      coincide: 'Coincide: donde sen θ = 0, csc θ no existe y no hay producto.',
      noCoincide: 'Revisemos los puntos donde la línea seno mide 0.',
    },
    // Hallazgo 9: «Mira» se queda en la misma C.T. del juego, pero sin las líneas: muestra solo los huecos del dominio,
    // que en el juego aparecían como «no existe». Es la misma figura, vista desde lo que falta.
    mira: {
      datos: {
        circulos: [{ r: 1 }],
        puntos: huecos(2, [{ x: 0, y: 1, abierto: true, rotulo: '90°', lado: 'ne', desde: 4 }, { x: 0, y: -1, abierto: true, rotulo: '270°', lado: 'se', desde: 4 }]),
        rotulos: [{ x: 0, y: 0.35, texto: 'sen θ · csc θ = 1', color: 'h', desde: 1, hasta: 3 }, { x: 0, y: -0.35, texto: 'tan θ = sen θ / cos θ', color: 'd', desde: 4 }],
        alt: 'Huecos del dominio: 0 y 180 grados para la cosecante, 90 y 270 grados para la tangente',
      },
      voz: 'Cada identidad lleva consigo sus huecos.',
      pasos: [
        { estado: { corte: 1 }, texto: 'La cosecante es la recíproca del seno.', ecuacion: ['csc ', th, ' = ', { frac: ['1', 'sen θ'] }, '  ⇒  sen ', th, ' · csc ', th, ' = 1'] },
        { estado: { corte: 2 }, texto: 'En 0° y 180°, sen θ = 0: csc θ no existe.', ecuacion: ['sen 0° = sen 180° = 0'] },
        { estado: { corte: 3 }, texto: 'La identidad vale en todos los demás ángulos.', ecuacion: [th, ' ≠ 180°·k'] },
        { estado: { corte: 4 }, texto: 'La tangente es un cociente: pide cos θ ≠ 0.', ecuacion: ['tan ', th, ' = ', { frac: ['sen θ', 'cos θ'] }, '   ·   ', th, ' ≠ 90° + 180°·k'] },
      ],
    },
    regla: {
      texto: 'Cada razón tiene su recíproca, y tangente y cotangente son cocientes de seno y coseno. Cada una vale solo donde su denominador no se anula.',
      ecuacion: ['sen ', th, ' · ', { llave: ['csc ', th], nota: 'recíproca', color: 'c-h' }, ' = 1', '   ·   ', 'cos ', th, ' · ', { llave: ['sec ', th], nota: 'recíproca', color: 'c-i' }, ' = 1', '   ·   ',
        'tan ', th, ' = ', { frac: ['sen θ', { llave: ['cos θ'], nota: 'no nulo', color: 'c-i' }] }, '   ·   ', 'cot ', th, ' = ', { frac: ['cos θ', 'sen θ'] }],
      condicion: 'sen θ ≠ 0 para csc y cot; cos θ ≠ 0 para sec y tan; k entero.',
      voz: 'Una identidad viene con su dominio; no lo olvidemos.',
    },
    ahoraTu: {
      voz: 'Primero el cociente correcto; después, el signo.',
      generar(sem) {
        const rr = azar(sem);
        if (sem % 3 === 2) {
          const casos = [
            ['tan θ · cot θ = 1', 'θ = 0°, 90°, 180° y 270°', 'tan y cot', 'TRID-DOMINIO'],
            ['cos θ · sec θ = 1', 'θ = 90° y 270°', 'sec', 'TR11'],
            ['sen θ · csc θ = 1', 'θ = 0° y 180°', 'csc', 'TR11'],
            ['cot θ = cos θ / sen θ', 'θ = 0° y 180°', 'cot', 'TR11'],
          ];
          const [ec, bien, quien] = casos[rr.ent(0, 3)];
          return {
            pregunta: [`¿Para qué ángulos de [0°, 360°) no vale la identidad ${ec}?`],
            opciones: opciones(bien, [
              { id: 'ninguno', valor: 'Vale para todos', error: 'TRID-DOMINIO', siFuera: `La igualdad es correcta donde existe. Pero ${quien} no existe en algunos ángulos.` },
              { id: 'b', valor: 'θ = 90° y 270°', error: 'TR11', siFuera: 'Ahí cos θ = 0. Revisa qué función tiene ese cero en el denominador.' },
              { id: 'a', valor: 'θ = 0° y 180°', error: 'TR11', siFuera: 'Ahí sen θ = 0. Revisa qué función tiene ese cero en el denominador.' },
              { id: 't', valor: 'θ = 0°, 90°, 180° y 270°', error: 'TRID-DOMINIO', siFuera: 'Esos cuatro anulan seno o coseno. Aquí solo importa el denominador de esta identidad.' },
            ], v => v),
            solucion: { texto: `Se excluyen los ángulos donde ${quien} no existe.`, ecuacion: [bien] },
          };
        }
        const [a, b, c] = rr.uno([[3, 4, 5], [5, 12, 13], [8, 15, 17]]), sx = rr.uno([1, -1]), sy = rr.uno([1, -1]), sw = rr.ent(0, 1);
        const x = sx * (sw ? a : b), y = sy * (sw ? b : a);
        const fn = ['tan', 'cot', 'sec', 'csc'][rr.ent(0, 3)];
        const par = { tan: [y, x], cot: [x, y], sec: [c, x], csc: [c, y] }[fn];
        const reci = { tan: 'cot', cot: 'tan', sec: 'cos', csc: 'sen' }[fn];
        return {
          pregunta: ['Si sen ', th, ` = ${fr(y, c)} y cos `, th, ` = ${fr(x, c)}, ¿cuánto vale ${fn} `, th, '?'],
          opciones: opciones(fr(par[0], par[1]), [
            { id: 'inversa', valor: fr(par[1], par[0]), error: 'TRPN-INVERSA', siFuera: `Ese cociente es ${reci} θ, su recíproca.` },
            { id: 'signo', valor: fr(-par[0], par[1]), error: 'TR12', siFuera: 'El tamaño es correcto. El signo sale de los signos del seno y del coseno.' },
            { id: 'cruza', valor: fn === 'tan' || fn === 'cot' ? fr(par[0] * c, c) : fr(c, fn === 'sec' ? y : x), error: 'TR11', siFuera: fn === 'tan' || fn === 'cot' ? 'El numerador es correcto, pero falta dividir entre el otro valor.' : `Ese es ${fn === 'sec' ? 'csc' : 'sec'} θ: cambia seno por coseno.` },
          ], v => v),
          solucion: {
            texto: { tan: 'tan θ = sen θ / cos θ.', cot: 'cot θ = cos θ / sen θ.', sec: 'sec θ = 1 / cos θ.', csc: 'csc θ = 1 / sen θ.' }[fn],
            ecuacion: [`${fn} `, th, ` = ${fr(par[0], par[1])}`],
          },
        };
      },
    },
  };

  // ---------- Gráficas para las ideas 3 y 4 (pieza ejes) ----------
  const muestras = (F, paso = 3) => {
    const pts = [];
    for (let g = 0; g <= 360; g += paso) { const v = F(g); pts.push(Number.isFinite(v) ? [g, v] : null); }
    return pts;
  };
  const ejesTh = (ymin, ymax, extra) => Object.assign({
    x: { min: 0, max: 360, paso: 90, nombre: 'θ', unidad: '°', decimales: 0, color: 'o' },
    y: { min: ymin, max: ymax, paso: 0.5, decimales: 1 },
  }, extra);
  const S = g => Math.sin(rad(g)), C = g => Math.cos(rad(g));

  // ---------- Idea 3: identidades auxiliares (elevar al cuadrado) ----------
  // Cambia: θ en la gráfica de sen⁴θ + cos⁴θ. · Permanece: la recta y = 1 de la pitagórica.
  // Progresa: cuánto se separa la curva de 1. · Se reserva: (sen θ + cos θ)² (la predicción).
  // Debe verse: que elevar al cuadrado deja el término doble 2·sen θ·cos θ.
  const cuarta = g => S(g) ** 4 + C(g) ** 4, sumaCuad = g => (S(g) + C(g)) ** 2;
  const auxiliares = {
    id: 'auxiliares',
    titulo: 'Al cuadrado aparece el doble',
    temas: ['Identidades auxiliares'],
    pieza: 'ejes',
    juega: {
      consigna: 'Mueve θ. La curva naranja es sen⁴θ + cos⁴θ; la recta verde, el 1 de la pitagórica. Mira cuánto le falta para llegar a 1.',
      voz: 'Fíjate dónde la curva toca el 1 y dónde se aleja.',
      controles: [{ id: 'g', etiqueta: 'θ', color: 'c-o', min: 0, max: 360, paso: 15, inicio: 30, unidad: '°', decimales: 0 }],
      dibujo: val => ({ datos: ejesTh(0, 1.5, {
        curvas: [{ puntos: muestras(cuarta), color: 'o', rotulo: 'sen⁴ + cos⁴', en: [215, 0.3] }, { puntos: [[0, 1], [360, 1]], color: 'd', discontinua: true, rotulo: '1', en: [350, 1.1] }],
        puntos: [{ x: val.g, y: cuarta(val.g), color: 'o', guias: true }],
      }), estado: {} }),
      lectura: val => [`sen⁴`, th, ' + cos⁴', th, ` = ${f(cuarta(val.g))} · 2sen²·cos² = ${f(2 * (S(val.g) * C(val.g)) ** 2)}`],
      minimo: 3,
      // Se arrastra el punto por la curva: el dedo elige θ y la altura dice cuánto falta para 1.
      arrastres: [{ id: 'punto-curva', etiqueta: 'punto de la curva en θ', color: 'c-o',
        donde: val => enEjes(ejesTh(0, 1.5), val.g, cuarta(val.g)),
        mover: pt => ({ g: thetaDe(ejesTh(0, 1.5), pt) }) }],
    },
    predice: {
      pregunta: '¿A qué es igual (sen θ + cos θ)² para todo θ?',
      voz: 'Desarrolla el cuadrado de una suma antes de usar la pitagórica.',
      opciones: [
        { id: 'c', texto: '1 + 2 sen θ cos θ', correcta: true },
        { id: 'lineal', texto: '1', error: 'TR16', siFuera: 'sen²θ + cos²θ = 1, bien. Pero el cuadrado de una suma también deja 2 sen θ cos θ.' },
        { id: 'sin-doble', texto: '1 + sen θ cos θ', error: 'TRID-MITAD', siFuera: 'Aparece el producto, bien. En (a + b)² ese término va dos veces.' },
        { id: 'dos', texto: '2', error: 'TRID-POTENCIA', siFuera: 'Vale 2 solo en 45°. En 0° vale 1: no es lo mismo para todo θ.' },
      ],
      dibujo: { datos: ejesTh(0, 2.5, { curvas: [{ puntos: [[0, 1], [360, 1]], color: 'd', discontinua: true, rotulo: '1', en: [350, 1.15] }] }), estado: {} },
      revelar: { datos: ejesTh(0, 2.5, {
        curvas: [{ puntos: muestras(sumaCuad), color: 'o', rotulo: '(sen + cos)²', en: [60, 2.25] }, { puntos: [[0, 1], [360, 1]], color: 'd', discontinua: true, rotulo: '1', en: [350, 1.15] }],
        puntos: [{ x: 45, y: 2, color: 'o', rotulo: '45°: 2' }, { x: 135, y: 0, color: 'o', rotulo: '135°: 0' }],
      }), estado: {} },
      coincide: 'Coincide: la curva se separa de 1 justo en 2 sen θ cos θ.',
      noCoincide: 'Revisemos: la curva sube hasta 2 y baja hasta 0; no es constante.',
    },
    mira: {
      datos: ejesTh(0, 2.5, {
        curvas: [
          { puntos: [[0, 1], [360, 1]], color: 'd', discontinua: true, rotulo: '1', en: [350, 1.15] },
          { puntos: muestras(sumaCuad), color: 'o', rotulo: '(sen + cos)²', en: [60, 2.25], desde: 2, hasta: 3 },
          { puntos: muestras(cuarta), color: 'o', rotulo: 'sen⁴ + cos⁴', en: [215, 0.3], desde: 4 },
        ],
        puntos: [{ x: 45, y: 2, color: 'o', rotulo: '+2 sen cos', desde: 3, hasta: 3 }, { x: 135, y: 0, color: 'o', rotulo: '−', desde: 3, hasta: 3 }],
      }),
      voz: 'Desarrolla, cambia lo que ya conoces y compara con la gráfica.',
      pasos: [
        { estado: { corte: 1 }, texto: 'El cuadrado de una suma deja tres términos.', ecuacion: ['(sen ', th, ' + cos ', th, ')² = sen²', th, ' + 2 sen ', th, ' cos ', th, ' + cos²', th] },
        { estado: { corte: 2 }, texto: 'sen²θ + cos²θ se cambia por 1.', ecuacion: ['(sen ', th, ' + cos ', th, ')² = 1 + 2 sen ', th, ' cos ', th] },
        { estado: { corte: 3 }, texto: 'Donde sen θ cos θ > 0 la curva sube; donde es negativo, baja.', ecuacion: ['45°: 1 + 1 = 2', '   ·   ', '135°: 1 − 1 = 0'] },
        { estado: { corte: 4 }, texto: 'Elevando sen²θ + cos²θ = 1 al cuadrado sale otra.', ecuacion: ['sen⁴', th, ' + cos⁴', th, ' = 1 − 2 sen²', th, ' cos²', th] },
      ],
    },
    regla: {
      texto: 'Las auxiliares salen de elevar al cuadrado y cambiar sen²θ + cos²θ por 1. El término doble no desaparece.',
      // Con espacios duros (\u00a0) cada miembro queda entero: si no cabe, la línea se parte en el «=».
      ecuacion: [{ sup: [{ par: ['sen\u00a0', th, '\u00a0±\u00a0cos\u00a0', th] }, '2'] }, ' = ', { llave: ['1\u00a0±\u00a02\u00a0sen\u00a0', th, '\u00a0cos\u00a0', th], nota: 'queda el doble', color: 'c-o' },
        '   ·   ', p2('sen', '4'), th, '\u00a0+\u00a0', p2('cos', '4'), th, ' = ', '1\u00a0−\u00a02', { sup: [{ par: ['sen\u00a0', th, '\u00a0cos\u00a0', th] }, '2'] }],
      condicion: 'Valen para todo θ. Otra útil: tan θ + cot θ = sec θ · csc θ, con sen θ ≠ 0 y cos θ ≠ 0.',
      voz: 'Al cuadrado, el doble producto siempre se queda.',
    },
    ahoraTu: {
      voz: 'Eleva al cuadrado y usa la pitagórica.',
      generar(sem) {
        const rr = azar(sem), tipo = sem % 3;
        const [p, q] = rr.uno([[7, 5], [1, 5], [6, 5], [4, 3], [1, 2], [5, 4], [1, 3], [2, 3]]);
        if (tipo < 2) {
          // k = p/q = sen θ + cos θ (tipo 0) o sen θ − cos θ (tipo 1)
          const signo = tipo === 0 ? '+' : '−';
          const num = tipo === 0 ? p * p - q * q : q * q - p * p, den = 2 * q * q;   // sen θ cos θ
          return {
            pregunta: ['Si sen ', th, ` ${signo} cos `, th, ` = ${fr(p, q)}, ¿cuánto vale sen `, th, ' cos ', th, '?'],
            opciones: opciones(fr(num, den), [
              { id: 'mitad', valor: fr(num, den / 2), error: 'TRID-MITAD', siFuera: 'Elevar y usar la pitagórica está bien. Falta dividir entre 2: el término es 2 sen θ cos θ.' },
              { id: 'sin-cuadrado', valor: fr(tipo === 0 ? p - q : q - p, 2 * q), error: 'TRID-SIN-CUADRADO', siFuera: `Restar 1 y dividir entre 2 está bien, pero sobre el cuadrado: (${fr(p, q)})².` },
              { id: 'signo', valor: fr(-num, den), error: 'TR12', siFuera: `El tamaño es correcto. Con «${signo}», el término doble va ${tipo === 0 ? 'sumando' : 'restando'}.` },
            ], v => v),
            solucion: {
              texto: `Al cuadrado: 1 ${signo} 2 sen θ cos θ = ${fr(p * p, q * q)}.`,
              ecuacion: ['sen ', th, ' cos ', th, ` = ${fr(num, den)}`],
            },
          };
        }
        // sen θ cos θ = m → sen⁴θ + cos⁴θ = 1 − 2m²
        const m = rr.uno([[1, 4], [1, 3], [-1, 4], [2, 5], [1, 5], [-1, 3], [3, 8], [-2, 5]]);
        return {
          pregunta: ['Si sen ', th, ' cos ', th, ` = ${fr(m[0], m[1])}, ¿cuánto vale sen⁴`, th, ' + cos⁴', th, '?'],
          opciones: opciones(fr(m[1] * m[1] - 2 * m[0] * m[0], m[1] * m[1]), [
            { id: 'sin-cuadrado', valor: fr(m[1] - 2 * m[0], m[1]), error: 'TRID-SIN-CUADRADO', siFuera: 'La forma 1 − 2(…) es correcta. Lo que se resta es (sen θ cos θ)².' },
            { id: 'potencia', valor: '1', error: 'TRID-POTENCIA', siFuera: 'Sería 1 con cuadrados: sen²θ + cos²θ. Con cuartas potencias sobra 2 sen²θ cos²θ.' },
            { id: 'mitad', valor: fr(m[1] * m[1] - m[0] * m[0], m[1] * m[1]), error: 'TRID-MITAD', siFuera: 'Restar el cuadrado del producto está bien. Se resta dos veces.' },
          ], v => v),
          solucion: {
            texto: `sen⁴θ + cos⁴θ = 1 − 2(${fr(m[0], m[1])})².`,
            ecuacion: [`sen⁴`, th, ' + cos⁴', th, ` = ${fr(m[1] * m[1] - 2 * m[0] * m[0], m[1] * m[1])}`],
          },
        };
      },
    },
  };

  // ---------- Idea 4: demostrar no es probar valores ----------
  // Cambia: la igualdad candidata y θ. · Permanece: los dos miembros graficados con los mismos colores.
  // Progresa: dónde coinciden y dónde se separan. · Se reserva: sen θ + cos θ = 1, que coincide en tres valores (la
  // predicción). · Debe verse: que un contraejemplo refuta y que los huecos del dominio quedan después de simplificar.
  const CAND = {
    a: { izq: g => (Math.abs(S(g)) < 1e-9 ? NaN : (1 - C(g) ** 2) / S(g)), der: S, txtI: '(1 − cos²θ)/sen θ', txtD: 'sen θ' },
    r: { izq: g => Math.abs(S(g)), der: S, txtI: '√(sen²θ)', txtD: 'sen θ' },
  };
  function candidata(id, g) {
    const c = CAND[id], vi = c.izq(g), vd = c.der(g);
    return ejesTh(-1.5, 1.5, {
      curvas: [{ puntos: muestras(c.der), color: 'd', discontinua: true, rotulo: c.txtD, en: [300, -1.2] }, { puntos: muestras(c.izq), color: 'o', rotulo: c.txtI, en: [200, 1.3] }],
      puntos: (id === 'a' ? [0, 180, 360].map(x => ({ x, y: 0, abierto: true })) : []).concat(Number.isFinite(vi) ? [{ x: g, y: vi, color: 'o' }] : []).concat([{ x: g, y: vd, color: 'd', abierto: true }]),
    });
  }
  const demostrar = {
    id: 'simplificar-demostrar',
    titulo: 'Demostrar no es probar valores',
    temas: ['Simplificación y demostración'],
    pieza: 'ejes',
    juega: {
      consigna: 'Elige una igualdad y mueve θ. La curva naranja es el lado izquierdo; la verde punteada, el derecho. Busca dónde se separan.',
      voz: 'Una sola separación basta para decir que no es identidad.',
      controles: [
        { id: 'c', etiqueta: 'Igualdad', opciones: [{ valor: 'a', texto: '(1 − cos²θ)/sen θ = sen θ' }, { valor: 'r', texto: '√(sen²θ) = sen θ' }] },
        { id: 'g', etiqueta: 'θ', color: 'c-o', min: 0, max: 360, paso: 30, inicio: 60, unidad: '°', decimales: 0 },
      ],
      dibujo: val => ({ datos: candidata(val.c, val.g), estado: {} }),
      lectura: val => { const c = CAND[val.c], vi = c.izq(val.g); return [`izquierda: ${Number.isFinite(vi) ? f(vi) : 'no existe'} · derecha: ${f(c.der(val.g))}`]; },
      minimo: 4,
      // Se arrastra el punto naranja por la curva (o el verde, si el izquierdo no existe): el dedo elige θ.
      arrastres: [{ id: 'punto-curva', etiqueta: 'punto de la curva en θ', color: 'c-o',
        donde: val => { const c = CAND[val.c], vi = c.izq(val.g); return enEjes(candidata(val.c, val.g), val.g, Number.isFinite(vi) ? vi : c.der(val.g)); },
        mover: (pt, val) => ({ g: thetaDe(candidata(val.c, val.g), pt) }) }],
    },
    predice: {
      pregunta: 'La igualdad sen θ + cos θ = 1 se cumple en θ = 0°, 90° y 360°. ¿Es una identidad?',
      voz: 'Piensa qué haría falta para estar seguros en todos los ángulos.',
      opciones: [
        { id: 'c', texto: 'No: basta un ángulo donde falle', correcta: true },
        { id: 'muestreo', texto: 'Sí: se cumple en tres ángulos', error: 'TRID-MUESTREO', siFuera: 'Probar ayuda a sospechar. Pero en 45° la izquierda vale 1,41: no es identidad.' },
        { id: 'pitagorica', texto: 'Sí: es la pitagórica', error: 'TR16', siFuera: 'La pitagórica es sen²θ + cos²θ = 1, con cuadrados. Sin cuadrados, cambia.' },
      ],
      dibujo: { datos: ejesTh(-1.5, 1.5, { curvas: [{ puntos: [[0, 1], [360, 1]], color: 'd', discontinua: true, rotulo: '1', en: [330, 1.25] }], puntos: [0, 90, 360].map(x => ({ x, y: 1, color: 'o' })) }), estado: {} },
      revelar: { datos: ejesTh(-1.5, 1.5, {
        curvas: [{ puntos: [[0, 1], [360, 1]], color: 'd', discontinua: true, rotulo: '1', en: [330, 1.25] }, { puntos: muestras(g => S(g) + C(g)), color: 'o', rotulo: 'sen + cos', en: [230, -1.3] }],
        puntos: [0, 90, 360].map(x => ({ x, y: 1, color: 'o' })).concat([{ x: 45, y: Math.SQRT2, color: 'o', rotulo: `45°: ${f(Math.SQRT2)}` }]),
      }), estado: {} },
      coincide: 'Coincide: en 45° la izquierda vale 1,41, no 1.',
      noCoincide: 'Revisemos 45°: la curva naranja pasa por encima del 1.',
    },
    mira: {
      datos: ejesTh(-1.5, 1.5, {
        curvas: [
          { puntos: [[0, 1], [360, 1]], color: 'd', discontinua: true, rotulo: '1', en: [330, 1.25], hasta: 2 },
          { puntos: muestras(g => S(g) + C(g)), color: 'o', rotulo: 'sen + cos', en: [230, -1.3], hasta: 2 },
          { puntos: muestras(S), color: 'd', discontinua: true, rotulo: 'sen θ', en: [300, -1.2], desde: 3 },
          { puntos: muestras(CAND.a.izq), color: 'o', rotulo: '(1 − cos²)/sen', en: [200, 1.3], desde: 3 },
        ],
        puntos: [0, 90, 360].map(x => ({ x, y: 1, color: 'o', hasta: 1 })).concat([{ x: 45, y: Math.SQRT2, color: 'o', rotulo: 'falla', desde: 2, hasta: 2 }]).concat([0, 180, 360].map(x => ({ x, y: 0, abierto: true, desde: 4 }))),
      }),
      voz: 'Primero refutar; después, demostrar de verdad.',
      pasos: [
        { estado: { corte: 1 }, texto: 'Coincidir en tres ángulos no prueba nada.', ecuacion: ['0°, 90°, 360°:  sen ', th, ' + cos ', th, ' = 1'] },
        { estado: { corte: 2 }, texto: 'Un contraejemplo la refuta: en 45° vale 1,41.', ecuacion: [`sen 45° + cos 45° = √2 ≈ ${f(Math.SQRT2)} ≠ 1`] },
        { estado: { corte: 3 }, texto: 'Demostrar es transformar un lado con igualdades válidas.', ecuacion: [{ frac: ['1 − cos²θ', 'sen θ'] }, ' = ', { frac: ['sen²θ', 'sen θ'] }, ' = sen ', th] },
        { estado: { corte: 4 }, texto: 'Quedan huecos donde sen θ = 0: el dominio se conserva.', ecuacion: [th, ' ≠ 180°·k'] },
      ],
    },
    regla: {
      texto: 'Una identidad se demuestra transformando un lado, con igualdades válidas, hasta obtener el otro. Probar valores solo puede refutarla: un contraejemplo basta.',
      ecuacion: [{ frac: ['1 − cos²θ', { llave: ['sen θ'], nota: 'no nulo', color: 'c-h' }] }, ' = sen ', th, '   ·   ', th, ' ≠ 180°·k', '   ·   ', { raiz: [p2('sen'), th] }, ' = |sen ', th, '|'],
      condicion: 'Simplificar no devuelve los valores excluidos: un denominador que se anulaba sigue fuera del dominio.',
      voz: 'Anotemos el dominio al empezar y conservémoslo al terminar.',
    },
    ahoraTu: {
      voz: 'Transforma un lado y anota qué no puede valer cero.',
      generar(sem) {
        const P = [
          ['(1 − cos²x)/sen x', 'sen x', [['cos x', 'TR11', 'Cambiar 1 − cos²x por sen²x está bien. Luego se divide entre sen x.'], ['1', 'TRID-DIVIDE', 'Sería 1 si arriba quedara sen x. Arriba queda sen²x.'], ['sen² x', 'TRID-DIVIDE', 'El numerador es sen²x, bien. Falta dividirlo entre sen x.']]],
          ['(1 − sen²x)/cos x', 'cos x', [['sen x', 'TR11', '1 − sen²x = cos²x, bien. Entre cos x queda cos x.'], ['1', 'TRID-DIVIDE', 'Sería 1 si arriba quedara cos x. Arriba queda cos²x.'], ['cos² x', 'TRID-DIVIDE', 'El numerador es cos²x, bien. Falta dividirlo entre cos x.']]],
          ['sec²x − tan²x', '1', [['0', 'TRID-DIVIDE', 'Restar es correcto, pero sec²x y tan²x no son iguales: difieren en 1.'], ['sec x − tan x', 'TR16', 'Eso saca la raíz término a término. Se usa 1 + tan²x = sec²x.'], ['cos² x', 'TR11', 'Esa es otra pitagórica. Aquí sirve 1 + tan²x = sec²x.']]],
          ['csc²x − cot²x', '1', [['0', 'TRID-DIVIDE', 'Restar es correcto, pero csc²x y cot²x difieren en 1.'], ['csc x − cot x', 'TR16', 'Eso saca la raíz término a término. Se usa 1 + cot²x = csc²x.'], ['sen² x', 'TR11', 'Esa es otra pitagórica. Aquí sirve 1 + cot²x = csc²x.']]],
          ['tan x · cos x', 'sen x', [['cos x', 'TR11', 'Escribir tan x = sen x/cos x está bien. El cos x se cancela y queda sen x.'], ['1', 'TRPN-INVERSA', 'Sería 1 con cot x · tan x. Aquí tan x · cos x = sen x.'], ['sen x · cos² x', 'TRPN-INVERSA', 'Eso toma tan x = sen x · cos x. Es un cociente: sen x/cos x.']]],
          ['cot x · sen x', 'cos x', [['sen x', 'TR11', 'Escribir cot x = cos x/sen x está bien. Se cancela sen x y queda cos x.'], ['1', 'TRPN-INVERSA', 'Sería 1 con cot x · tan x. Aquí queda cos x.'], ['cos x · sen² x', 'TRPN-INVERSA', 'Eso toma cot x = cos x · sen x. Es un cociente: cos x/sen x.']]],
          ['sen x · csc x + cos x · sec x', '2', [['1', 'TRID-DIVIDE', 'Cada producto vale 1, bien. Son dos productos: 1 + 1.'], ['0', 'TR12', 'Cada producto vale 1, y se suman.'], ['sen x + cos x', 'TRPN-INVERSA', 'csc x y sec x son recíprocas: cada producto da 1.']]],
          ['(sen x + cos x)² − 2 sen x cos x', '1', [['−2 sen x cos x', 'TR16', 'Desarrollar el cuadrado está bien encaminado; también aparece 2 sen x cos x, que se cancela.'], ['1 − 4 sen x cos x', 'TR12', 'El término doble del cuadrado suma; con el que se resta, se cancela.'], ['sen x + cos x', 'TR16', 'Eso saca la raíz. Se desarrolla el cuadrado: 1 + 2 sen x cos x.']]],
          ['sen²x · sec²x', 'tan² x', [['1', 'TRPN-INVERSA', 'Sería 1 con cos²x · sec²x. sen²x/cos²x es tan²x.'], ['cot² x', 'TRPN-INVERSA', 'Ese es el cociente al revés. sen²x/cos²x = tan²x.'], ['sen² x', 'TRID-DIVIDE', 'sec²x no es 1: es 1/cos²x.']]],
          ['(sec²x − 1)/tan x', 'tan x', [['1', 'TRID-DIVIDE', 'sec²x − 1 = tan²x, bien. Entre tan x queda tan x.'], ['sec x', 'TR16', 'Eso resta 1 a la raíz. Se usa 1 + tan²x = sec²x.'], ['tan² x', 'TRID-DIVIDE', 'El numerador es tan²x, bien. Falta dividirlo entre tan x.']]],
        ];
        const [exp, bien, ds] = P[sem % P.length];
        return {
          pregunta: [`Simplifica E = ${exp}, en los x donde E existe.`],
          opciones: opciones(bien, ds.map(([v, e, s], i) => ({ id: `d${i}`, valor: v, error: e, siFuera: s })), v => v),
          solucion: { texto: 'Se transforma con recíprocas, cocientes y pitagóricas.', ecuacion: [`E = ${exp} = ${bien}`] },
        };
      },
    },
  };

  // ---------- Laboratorio ----------
  // Mesa 1: los tres triángulos de la idea 1, de uno en uno y para cualquier θ (de 1° en 1°). Lo que sale de la
  // ventana no se dibuja; la lectura da los números igual.
  const VL = { x: [-2.2, 2.2], y: [-2.2, 2.2] };
  const LADO = (x, y) => (y >= 0 ? (x >= 0 ? 'ne' : 'no') : (x >= 0 ? 'se' : 'so'));
  function tresLibre(g, tri) {
    const x = C(g), y = S(g), tn = Math.abs(x) < 1e-9 ? NaN : y / x, ct = Math.abs(y) < 1e-9 ? NaN : x / y;
    const enV = v => Number.isFinite(v) && Math.abs(v) <= 2.1;
    let seg = [], rectas = [];
    if (tri === 'sc') seg = triangulo(g).segmentos;
    if (tri === 'ts') {
      rectas = [{ x: 1, color: 'd' }];
      if (enV(tn)) seg = [{ de: [0, 0], a: [1, 0], color: 'd', rotulo: '1' }, { de: [1, 0], a: [1, tn], color: 'd', rotulo: Math.abs(tn) > 0.3 ? 'tan' : undefined }, { de: [0, 0], a: [1, tn], color: 'i', rotulo: 'sec', lado: 'adentro' }];
    }
    if (tri === 'cc') {
      rectas = [{ y: 1, color: 'd' }];
      if (enV(ct)) seg = [{ de: [0, 0], a: [0, 1], color: 'd', rotulo: '1' }, { de: [0, 1], a: [ct, 1], color: 'd', rotulo: Math.abs(ct) > 0.3 ? 'cot' : undefined }, { de: [0, 0], a: [ct, 1], color: 'h', rotulo: 'csc', lado: 'adentro' }];
    }
    return {
      ventana: tri === 'sc' ? { x: [-1.3, 1.3], y: [-1.3, 1.3] } : VL,
      circulos: [{ r: 1 }], rectas, segmentos: seg,
      rayos: [{ ang: g, color: 'o', grosor: 'cuadricula', punta: false }],
      arcos: g ? [{ de: 0, a: g, r: 0.2, color: 'o' }] : [],
      puntos: [{ x, y, rotulo: 'P', lado: LADO(x, y) }],
      alt: `Triángulo de la identidad ${{ sc: 'seno cuadrado más coseno cuadrado', ts: 'uno más tangente cuadrada', cc: 'uno más cotangente cuadrada' }[tri]} para θ = ${f(g)} grados`,
    };
  }
  // Mesa 2: dos miembros de una igualdad candidata, con más candidatas que la idea 4 (dos de ellas sí son identidades).
  const CAND2 = {
    // enI y enD: dónde va el rótulo de cada miembro, junto a su curva.
    a: Object.assign({ enI: [110, 1.6], enD: [270, -1.6] }, CAND.a), r: Object.assign({ enI: [250, 1.6], enD: [270, -1.6] }, CAND.r),
    s: { izq: g => S(g) + C(g), der: () => 1, txtI: 'sen + cos', txtD: '1', enI: [60, 2], enD: [345, 1.5] },
    t: { izq: g => (Math.abs(S(g) * C(g)) < 1e-9 ? NaN : S(g) / C(g) + C(g) / S(g)), der: g => (Math.abs(S(g) * C(g)) < 1e-9 ? NaN : 1 / (S(g) * C(g))), txtI: 'tan + cot', txtD: 'sec · csc', enI: [45, 2.7], enD: [135, -2.6] },
    c: { izq: g => S(g) ** 4 - C(g) ** 4, der: g => S(g) ** 2 - C(g) ** 2, txtI: 'sen⁴ − cos⁴', txtD: 'sen² − cos²', enI: [90, 1.6], enD: [180, -1.6] },
  };
  const recorta = F => g => { const v = F(g); return Number.isFinite(v) && Math.abs(v) <= 3 ? v : NaN; };
  function candidata2(id, g) {
    const c = CAND2[id], vi = c.izq(g), vd = c.der(g), en = v => Number.isFinite(v) && Math.abs(v) <= 3;
    return Object.assign(ejesTh(-3, 3, {
      curvas: [{ puntos: muestras(recorta(c.der), 2), color: 'd', discontinua: true, rotulo: c.txtD, en: c.enD }, { puntos: muestras(recorta(c.izq), 2), color: 'o', rotulo: c.txtI, en: c.enI }],
      puntos: (en(vi) ? [{ x: g, y: vi, color: 'o' }] : []).concat(en(vd) ? [{ x: g, y: vd, color: 'd', abierto: true }] : []),
    }), { y: { min: -3, max: 3, paso: 1, decimales: 0 } });
  }

  return {
    unidad: 'trigonometria.identidades-fundamentales',
    version: '0.1.0',
    estado: 'completa',
    requiere: ['/nucleo/kit/piezas/trig-plano.js', '/nucleo/kit/piezas/ejes.js'],
    // Laboratorio (docs/teoria.md §4b): dos mesas sin preguntas. La primera deja ver los tres triángulos de la idea 1
    // para cualquier θ, de grado en grado, con la suma de cuadrados en la lectura (el juego solo muestra el primero);
    // la segunda compara los dos miembros de cinco igualdades, tres que fallan y dos que sí son identidades, con su
    // gráfica y sus huecos (la idea 4 trae dos que fallan).
    laboratorio: [
      {
        id: 'tres-triangulos', titulo: 'Tres triángulos, cualquier ángulo', pieza: 'trig-plano',
        consigna: 'Elige el triángulo y arrastra P. La lectura suma los cuadrados de los catetos y los compara con la hipotenusa al cuadrado.',
        controles: [
          { id: 'g', etiqueta: 'θ', color: 'c-o', min: 0, max: 360, paso: 1, inicio: 50, unidad: '°', decimales: 0 },
          { id: 'tri', etiqueta: 'Triángulo', opciones: [{ valor: 'sc', texto: 'sen, cos, 1' }, { valor: 'ts', texto: '1, tan, sec' }, { valor: 'cc', texto: '1, cot, csc' }] },
        ],
        dibujo: v => ({ datos: tresLibre(v.g, v.tri), estado: {} }),
        lectura: v => {
          const x = C(v.g), y = S(v.g);
          if (v.tri === 'sc') return [p2('sen'), th, ' + ', p2('cos'), th, ` = ${f(y * y)} + ${f(x * x)} = ${f(x * x + y * y)}`];
          const [a, nom, hip] = v.tri === 'ts' ? [x, 'tan', 'sec'] : [y, 'cot', 'csc'];
          if (Math.abs(a) < 1e-9) return [`${v.tri === 'ts' ? 'cos' : 'sen'} `, th, ` = 0: ${nom} y ${hip} no existen`];
          const k = (v.tri === 'ts' ? y / x : x / y) ** 2;
          return ['1 + ', p2(nom), th, ` = 1 + ${f(k)} = ${f(1 + k)} = `, p2(hip), th];
        },
        arrastres: [{ id: 'punto-p', etiqueta: 'punto P del arco θ', color: 'c-o',
          donde: v => punta(tresLibre(v.g, v.tri), v.g),
          mover: (pt, v) => ({ g: giroDe(tresLibre(v.g, v.tri), pt, v.g) }) }],
      },
      {
        id: 'dos-miembros', titulo: '¿Identidad o casualidad?', pieza: 'ejes',
        consigna: 'Elige una igualdad y arrastra el punto por la curva naranja. Si las dos curvas se separan en algún θ, no es identidad.',
        controles: [
          { id: 'c', etiqueta: 'Igualdad', opciones: [{ valor: 's', texto: 'sen θ + cos θ = 1' }, { valor: 'r', texto: '√(sen²θ) = sen θ' }, { valor: 'a', texto: '(1 − cos²θ)/sen θ = sen θ' }, { valor: 't', texto: 'tan θ + cot θ = sec θ · csc θ' }, { valor: 'c', texto: 'sen⁴θ − cos⁴θ = sen²θ − cos²θ' }] },
          { id: 'g', etiqueta: 'θ', color: 'c-o', min: 0, max: 360, paso: 5, inicio: 45, unidad: '°', decimales: 0 },
        ],
        dibujo: v => ({ datos: candidata2(v.c, v.g), estado: {} }),
        lectura: v => {
          const c = CAND2[v.c], vi = c.izq(v.g), vd = c.der(v.g);
          const ok = Number.isFinite(vi) && Number.isFinite(vd);
          return [th, ` = ${f(v.g)}° · izquierda ${Number.isFinite(vi) ? f(vi) : 'no existe'} · derecha ${Number.isFinite(vd) ? f(vd) : 'no existe'} · ${!ok ? 'hueco' : Math.abs(vi - vd) < 5e-3 ? 'coinciden' : 'se separan'}`];
        },
        arrastres: [{ id: 'punto-curva', etiqueta: 'punto de la curva en θ', color: 'c-o',
          donde: v => {
            const c = CAND2[v.c], d = candidata2(v.c, v.g), en = x => Number.isFinite(x) && Math.abs(x) <= 3;
            const y = en(c.izq(v.g)) ? c.izq(v.g) : en(c.der(v.g)) ? c.der(v.g) : 0;
            return enEjes(d, v.g, y);
          },
          mover: (pt, v) => ({ g: thetaDe(candidata2(v.c, v.g), pt) }) }],
      },
    ],
    historia: {
      texto: 'En el siglo X, Abu’l-Wafa hizo tablas trigonométricas y estudió cómo se relacionan las seis líneas de un mismo arco, para la astronomía y para el cálculo. Su obra pertenece a una tradición de lengua árabe que recibió y transformó resultados anteriores. Lo valioso fue convertir relaciones geométricas en instrumentos de cálculo, cuidando los valores para los que cada expresión tiene sentido.',
      pregunta: '¿Para qué sirve una relación entre las seis líneas de un arco?',
      fuente: { titulo: 'J. J. O’Connor y E. F. Robertson, «Mohammad Abu’l-Wafa al-Buzjani», MacTutor, University of St Andrews', url: 'https://mathshistory.st-andrews.ac.uk/Biographies/Abul-Wafa/' },
    },
    ideas: [pitagoricas, reciprocas, auxiliares, demostrar],
  };
});
