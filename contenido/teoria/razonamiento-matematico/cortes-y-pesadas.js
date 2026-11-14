/*
 * Teoría de «Cortes, pesadas y balanzas» (razonamiento-matematico.cortes-y-pesadas).
 * Fuente: docs/teoria/matriz/razonamiento-matematico.json (unidad 14); historia: el problema de la moneda falsa
 * (The Mathematical Gazette).
 * Precisión: cortes y pesadas son problemas distintos; la cota 3^k no garantiza que toda estrategia exista, hay que
 * construir el árbol de pesadas.
 * Colores (regla 4): los cortes rojo (c-h), los trozos turquesa (c-i), los círculos de la balanza naranja (c-o),
 * los triángulos verde (c-d).
 * Compañero: Faro (zorro). Códigos: RMP1 (cortes contra tramos); RMT-COR-* nuevos (hipótesis).
 *
 * Ficha de tarea (diseno-y-animacion):
 *   Promesa: contar cortes y pesadas sin probar al azar: tramos, sustituciones, pesas en los dos platillos y tercios.
 *   Persona y condiciones: postulante de 3.º a 5.º, celular de gama baja, sin conexión.
 *   Resultado observable: halla cortes de listones y aros, equivalencias en balanzas, pesos medibles y el mínimo de pesadas.
 *   Orden de atención: 1.º la figura (listón, balanza, monedas) · 2.º la lectura · acción principal fija.
 *   Estados: juego sin tocar · casos probados · predicción respondida · paso de Mira · caso nuevo resuelto o «No sé».
 *   Duda que resuelve: «¿cuántos cortes son: tantos como trozos o uno menos?».
 */
(function (root, fabrica) {
  const def = fabrica(typeof module === 'object' && module.exports ? require('../../../nucleo/kit/kit.js') : root.Kit);
  if (typeof module === 'object' && module.exports) module.exports = def;
  else root.Teoria.unidad(def);
})(typeof self !== 'undefined' ? self : this, function (Kit) {
  'use strict';
  const f = (n, d = 2) => Kit.formatear(n, d);
  const c = { v: 'c-h', t: 'c' }, tz = { v: 'c-i', t: 'trozos' }, k = { v: 'c-h', t: 'k' };
  function azar(s) {
    let q = (s * 2654435761 + 12345) >>> 0;
    const r = () => { q = (q + 0x6D2B79F5) >>> 0; let z = q; z = Math.imul(z ^ (z >>> 15), z | 1); z ^= z + Math.imul(z ^ (z >>> 7), z | 61); return ((z ^ (z >>> 14)) >>> 0) / 4294967296; };
    r.ent = (lo, hi) => lo + Math.floor(r() * (hi - lo + 1));
    r.elegir = xs => xs[Math.floor(r() * xs.length)];
    return r;
  }
  function opcionesNum(correcta, distractores) {
    const vistos = new Set([correcta]);
    const ops = [{ id: 'c', texto: f(correcta), correcta: true }];
    for (const x of distractores) { if (vistos.has(x.valor) || !Number.isFinite(x.valor) || x.valor < 0 || ops.length >= 4) continue; vistos.add(x.valor); ops.push({ id: x.id, texto: f(x.valor), error: x.error, siFuera: x.siFuera }); }
    return ops;
  }

  // ---------- Idea 1: cortes rectos ----------
  // Cambia: cuántos cortes y si es listón o aro · Permanece: el objeto · Progresa: los trozos · Se reserva: la varilla de
  // 60 cm en trozos de 12 · Debe verse: en un listón, trozos = cortes + 1; en un aro, trozos = cortes.
  function objeto(cortes, tipo, extra = {}) {
    if (tipo === 'aro') {
      const lineas = Array.from({ length: cortes }, (_, i) => { const a = 2 * Math.PI * i / Math.max(cortes, 1); return { de: [5 + 1.6 * Math.sin(a), 3 - 1.6 * Math.cos(a)], a: [5 + 2.8 * Math.sin(a), 3 - 2.8 * Math.cos(a)], color: 'h', grosor: 'variable' }; });
      return { ancho: 10, alto: 6, circulos: [{ x: 5, y: 3, r: 2.2, color: 'i', relleno: 0, grosor: 'variable' }], lineas, pie: extra.pie };
    }
    const lineas = Array.from({ length: cortes }, (_, i) => { const x = 0.6 + 8.8 * (i + 1) / (cortes + 1); return { de: [x, 2], a: [x, 4], color: 'h', grosor: 'variable' }; });
    return { ancho: 10, alto: 6, poligonos: [{ puntos: [[0.6, 2.6], [9.4, 2.6], [9.4, 3.4], [0.6, 3.4]], color: 'i', relleno: 0.2 }], lineas, pie: extra.pie };
  }
  const cortes = {
    id: 'cortes',
    titulo: 'Cortes y trozos no coinciden',
    temas: ['Cortes rectos de objetos'],
    pieza: 'rm-plano',
    juega: {
      consigna: 'Cambia cuántos cortes haces y si cortas un listón o un aro. Cuenta los trozos que salen.',
      voz: 'Compara el listón con el aro con los mismos cortes.',
      controles: [
        { id: 'n', etiqueta: 'Cortes', min: 1, max: 6, paso: 1, inicio: 1, decimales: 0, color: 'c-h' },
        { id: 't', etiqueta: 'Objeto', opciones: [{ valor: 'liston', texto: 'Listón' }, { valor: 'aro', texto: 'Aro' }] },
      ],
      dibujo: val => ({ datos: objeto(val.n, val.t), estado: {} }),
      lectura: val => [c, ` = ${val.n} · `, tz, ` = ${val.t === 'aro' ? val.n : val.n + 1}`],
      minimo: 4,
    },
    predice: {
      pregunta: 'Una varilla de 60 cm se corta en trozos de 12 cm. Cada corte toma 3 minutos. ¿Cuántos minutos se tarda?',
      opciones: [
        { id: 'cinco', texto: '15 minutos', error: 'RMP1', siFuera: '15 son 5 cortes; pero 5 trozos salen con 4 cortes: el último trozo ya queda solo.' },
        { id: 'c', texto: '12 minutos', correcta: true },
        { id: 'seis', texto: '18 minutos', error: 'RMT-COR-1', siFuera: '18 serían 6 cortes, uno por trozo y uno más.' },
      ],
      dibujo: { datos: objeto(0, 'liston', { pie: '60 cm' }), estado: {} },
      revelar: { datos: objeto(4, 'liston', { pie: '5 trozos de 12 cm con 4 cortes' }), estado: {} },
      coincide: 'Coincide: 60 / 12 = 5 trozos, y en un listón eso pide 4 cortes.',
    },
    mira: {
      datos: objeto(4, 'liston'),
      pasos: [
        { estado: { corte: 0 }, texto: 'Trozos: 60 / 12 = 5.', ecuacion: [tz, ' = 5'] },
        { estado: { corte: 0 }, texto: 'En un listón, cada corte separa un trozo y el último queda solo.', ecuacion: [c, ' = 5 − 1 = 4'] },
        { estado: { corte: 0 }, texto: '4 cortes de 3 minutos.', ecuacion: ['4 · 3 = 12 min'] },
      ],
    },
    regla: {
      texto: 'En un listón abierto, los trozos son uno más que los cortes. En un aro cerrado, son tantos como los cortes.',
      ecuacion: ['listón: ', tz, ' = ', c, ' + 1  ·  aro: ', tz, ' = ', c],
      condicion: 'los cortes son rectos, uno por vez y sin doblar ni apilar las piezas.',
    },
    ahoraTu: {
      pieza: 'rm-plano',
      voz: 'Primero los trozos; después los cortes.',
      generar(s) {
        const r = azar(s), t = r.ent(5, 20), nt = r.ent(3, 9), L = t * nt, min = r.ent(2, 5), aro = s % 3 === 2;
        const nc = aro ? nt : nt - 1, bien = nc * min;
        return {
          pregunta: aro
            ? `Un aro de ${L} cm de largo se corta en trozos de ${t} cm. Cada corte toma ${min} minutos. ¿Cuántos minutos se tarda?`
            : `Un listón de ${L} cm se corta en trozos de ${t} cm. Cada corte toma ${min} minutos. ¿Cuántos minutos se tarda?`,
          dibujo: { datos: objeto(0, aro ? 'aro' : 'liston', { pie: `${L} cm` }), estado: {} },
          opciones: opcionesNum(bien, [
            { id: 'tro', valor: nt * min, error: aro ? 'RMT-COR-2' : 'RMP1', siFuera: aro ? 'En el aro sí: trozos = cortes. Revisa los trozos.' : 'Eso cuenta un corte por trozo.' },
            { id: 'menos', valor: (nt - 1) * min, error: 'RMT-COR-2', siFuera: 'En un aro cerrado hacen falta tantos cortes como trozos.' },
            { id: 'mas', valor: (nt + 1) * min, error: 'RMT-COR-1', siFuera: 'Sobra un corte.' },
          ]),
          solucion: { texto: `${L} / ${t} = ${nt} trozos; ${aro ? 'en el aro' : 'en el listón'} son ${nc} cortes.`, ecuacion: [`${nc} · ${min} = ${bien} min`] },
        };
      },
    },
  };

  // ---------- Idea 2: equilibrio y sustitución ----------
  // Cambia: cuántos triángulos van a la derecha · Permanece: dos círculos a la izquierda · Progresa: la inclinación ·
  // Se reserva: la cadena de dos balanzas · Debe verse: se cambia una figura por lo que pesa lo mismo.
  const COL = { circulo: 'o', triangulo: 'd', cuadrado: 'i' };
  const PESOS = { circulo: 6, triangulo: 4, cuadrado: 2 };
  const balanza = (balanzas, extra = {}) => Object.assign({ unidad: 'kg', colores: COL, pesos: PESOS, balanzas, trabajo: extra.trabajo || [] }, extra.marca ? { marca: extra.marca } : {});
  const equilibrio = {
    id: 'sustituir',
    titulo: 'Cambiar por lo que pesa igual',
    temas: ['Equilibrio de objetos'],
    pieza: 'balanza',
    juega: {
      consigna: 'A la izquierda hay dos círculos. Pon triángulos a la derecha hasta que la balanza quede en equilibrio.',
      voz: 'El travesaño se inclina hacia lo que pesa más.',
      controles: [{ id: 't', etiqueta: 'Triángulos', min: 1, max: 5, paso: 1, inicio: 1, decimales: 0, color: 'c-d' }],
      dibujo: val => ({ datos: balanza([{ izq: { circulo: 2 }, der: { triangulo: val.t } }]), estado: {} }),
      lectura: val => [val.t === 3 ? 'Equilibrio: 2 círculos pesan como 3 triángulos' : val.t < 3 ? 'Pesa más la izquierda' : 'Pesa más la derecha'],
      minimo: 3,
    },
    predice: {
      pregunta: 'Se sabe que 2 círculos equilibran 3 triángulos y que 1 triángulo equilibra 2 cuadrados. ¿Cuántos cuadrados equilibran 4 círculos?',
      opciones: [
        { id: 'seis', texto: '6', error: 'RMT-COR-3', siFuera: '6 son los triángulos que equilibran 4 círculos; falta cambiarlos por cuadrados.' },
        { id: 'c', texto: '12', correcta: true },
        { id: 'ocho', texto: '8', error: 'RMT-COR-4', siFuera: '8 sería si un círculo valiera 2 cuadrados; vale 3.' },
      ],
      dibujo: { datos: balanza([{ izq: { circulo: 2 }, der: { triangulo: 3 }, estado: 'equilibrio' }, { izq: { triangulo: 1 }, der: { cuadrado: 2 }, estado: 'equilibrio' }]), estado: {} },
      revelar: { datos: balanza([{ izq: { circulo: 2 }, der: { triangulo: 3 }, estado: 'equilibrio' }, { izq: { triangulo: 1 }, der: { cuadrado: 2 }, estado: 'equilibrio' }], { trabajo: [{ izq: { circulo: 4 }, der: { cuadrado: 12 } }] }), estado: {} },
      coincide: 'Coincide: 4 círculos pesan como 6 triángulos, y 6 triángulos como 12 cuadrados.',
    },
    mira: {
      datos: balanza([{ izq: { circulo: 2 }, der: { triangulo: 3 }, estado: 'equilibrio' }, { izq: { triangulo: 1 }, der: { cuadrado: 2 }, estado: 'equilibrio' }], {
        trabajo: [{ izq: { circulo: 4 }, der: {} }, { izq: { circulo: 4 }, der: { triangulo: 6 } }, { izq: { circulo: 4 }, der: { cuadrado: 12 } }],
      }),
      pasos: [
        { estado: { vista: 0 }, texto: '¿Qué equilibra 4 círculos?' },
        { estado: { vista: 1, usa: [0] }, texto: 'Doble de la primera balanza: 4 círculos = 6 triángulos.', ecuacion: ['4 ● = 6 ▲'] },
        { estado: { vista: 2, usa: [1] }, texto: 'Cada triángulo se cambia por 2 cuadrados.', ecuacion: ['6 ▲ = 12 ■'] },
      ],
    },
    regla: {
      texto: 'Una balanza en equilibrio sigue en equilibrio si se cambia una figura por otras que pesan lo mismo, o si se multiplican los dos lados por igual.',
      ecuacion: ['2 ● = 3 ▲ y ▲ = 2 ■  ⇒  ● = 3 ■'],
      condicion: 'las figuras iguales pesan lo mismo y las balanzas del enunciado están en equilibrio.',
    },
    ahoraTu: {
      pieza: 'balanza',
      voz: 'Lleva todo a la figura más chica.',
      generar(s) {
        const r = azar(s), a = r.ent(1, 3), b = r.ent(a + 1, 5), m = r.ent(2, 4), q = a * r.ent(1, 3);
        // a círculos = b triángulos; 1 triángulo = m cuadrados; ¿cuántos cuadrados equilibran q círculos?
        const bien = q / a * b * m;
        return {
          pregunta: `${a} ${a === 1 ? 'círculo equilibra' : 'círculos equilibran'} ${b} triángulos, y 1 triángulo equilibra ${m} cuadrados. ¿Cuántos cuadrados equilibran ${q} ${q === 1 ? 'círculo' : 'círculos'}?`,
          dibujo: { datos: Object.assign(balanza([{ izq: { circulo: a }, der: { triangulo: b }, estado: 'equilibrio' }, { izq: { triangulo: 1 }, der: { cuadrado: m }, estado: 'equilibrio' }]), { pesos: null }), estado: {} },
          opciones: opcionesNum(bien, [
            { id: 'tri', valor: q / a * b, error: 'RMT-COR-3', siFuera: 'Esos son triángulos; falta cambiarlos por cuadrados.' },
            { id: 'inv', valor: q * a / b * m, error: 'RMT-COR-5', siFuera: 'La razón está al revés.' },
            { id: 'suma', valor: q + b + m, error: 'RMT-COR-6', siFuera: 'Sumar figuras no respeta los pesos.' },
          ]),
          solucion: { texto: `${q} círculos = ${q / a * b} triángulos = ${bien} cuadrados.`, ecuacion: [`${q / a * b} · ${m} = ${bien}`] },
        };
      },
    },
  };

  // ---------- Idea 3: pesas en los dos platillos ----------
  // Cambia: el peso que se quiere medir · Permanece: las pesas 1, 3 y 9 · Progresa: dónde va cada pesa · Se reserva:
  // agregar la pesa de 27 · Debe verse: una pesa junto al objeto resta.
  function ternario(w) {   // dígitos −1, 0, 1 para 1, 3, 9, 27 (w hasta 40)
    const d = []; let x = w;
    for (let i = 0; i < 4; i++) { let m = x % 3; x = Math.floor(x / 3); if (m === 2) { m = -1; x += 1; } d.push(m); }
    return d;
  }
  const P3 = [1, 3, 9, 27];
  function pesas(w, extra = {}) {
    const d = ternario(w), izq = [], der = [];
    d.forEach((m, i) => { if (m === 1) der.push([P3[i], 1]); if (m === -1) izq.push([P3[i], 1]); });
    return { unidad: 'kg', colores: COL, balanzas: [{ izq: Object.assign({ saco: w }, izq.length ? { pesas: izq } : {}), der: der.length ? { pesas: der } : {}, estado: 'equilibrio' }], trabajo: [] };
  }
  const expresion = w => ternario(w).map((m, i) => (m ? `${m > 0 ? '+' : '−'} ${P3[i]}` : '')).filter(Boolean).reverse().join(' ').replace(/^\+ /, '');
  const pesasIdea = {
    id: 'pesas-en-dos-platillos',
    titulo: 'Pesas en los dos platillos',
    temas: ['Balanzas y pesas'],
    pieza: 'balanza',
    juega: {
      consigna: 'Con pesas de 1, 3 y 9 kg, que pueden ir en cualquiera de los dos platillos, mide un saco. Cambia su peso.',
      voz: 'Una pesa al lado del saco le resta al otro platillo.',
      controles: [{ id: 'w', etiqueta: 'Saco', min: 1, max: 13, paso: 1, inicio: 2, unidad: 'kg', decimales: 0, color: 'c-o' }],
      dibujo: val => ({ datos: pesas(val.w), estado: {} }),
      lectura: val => [`${val.w} = ${expresion(val.w)}`],
      minimo: 4,
    },
    predice: {
      pregunta: 'Se agrega una pesa de 27 kg a las de 1, 3 y 9. ¿Hasta qué peso entero se puede medir cualquier saco?',
      opciones: [
        { id: 'unlado', texto: '27 kg', error: 'RMT-COR-7', siFuera: '27 es la pesa nueva sola; con las otras se llega más lejos.' },
        { id: 'c', texto: '40 kg', correcta: true },
        { id: 'pot', texto: '81 kg', error: 'RMT-COR-8', siFuera: '81 sería la siguiente pesa; la suma de todas es 40.' },
      ],
      dibujo: { datos: pesas(13), estado: {} },
      revelar: { datos: pesas(40), estado: {} },
      coincide: 'Coincide: con todas en un platillo, 1 + 3 + 9 + 27 = 40, y cada peso menor se arma restando.',
    },
    mira: {
      datos: pesas(7),
      pasos: [
        { estado: { corte: 0 }, texto: 'Saco de 7 kg: al otro lado, 9 y 1.', ecuacion: ['9 + 1 = 10'] },
        { estado: { corte: 0 }, texto: 'Junto al saco va la de 3: resta.', ecuacion: ['7 + 3 = 9 + 1'] },
        { estado: { corte: 0 }, texto: 'Cada pesa se usa a favor, en contra o no se usa.', ecuacion: ['7 = 9 − 3 + 1'] },
      ],
    },
    regla: {
      texto: 'Si las pesas pueden ir en los dos platillos, cada una suma, resta o no se usa. Con 1, 3, 9, 27… se mide todo peso entero hasta su suma.',
      ecuacion: ['1 + 3 + … + ', { sup: ['3', [k, ' − 1']] }, ' = ', { frac: [[{ sup: ['3', k] }, ' − 1'], '2'] }],
      condicion: 'hay una pesa de cada valor y se miden pesos enteros; con pesas en un solo platillo, conviene 1, 2, 4, 8.',
    },
    ahoraTu: {
      voz: 'Piensa si las pesas van en un platillo o en los dos.',
      generar(s) {
        const r = azar(s), kk = r.ent(2, 5), dos = s % 2 === 0;
        const ps = dos ? Array.from({ length: kk }, (_, i) => 3 ** i) : Array.from({ length: kk }, (_, i) => 2 ** i);
        const bien = ps.reduce((m, x) => m + x, 0);
        return {
          pregunta: `Con pesas de ${ps.join(', ')} kg, una de cada una, ${dos ? 'que pueden ir en los dos platillos' : 'puestas solo en el platillo opuesto al saco'}, ¿hasta qué peso entero se puede medir cualquier saco?`,
          opciones: opcionesNum(bien, [
            { id: 'mayor', valor: ps[ps.length - 1], error: 'RMT-COR-7', siFuera: 'Esa es solo la pesa mayor.' },
            { id: 'sig', valor: dos ? 3 ** kk : 2 ** kk, error: 'RMT-COR-8', siFuera: 'Esa sería la siguiente pesa, no la suma.' },
            { id: 'menos', valor: bien - 1, error: 'RMT-COR-9', siFuera: 'Con todas juntas se llega a la suma exacta.' },
          ]),
          solucion: { texto: 'El mayor peso es la suma de todas; los menores se arman combinando.', ecuacion: [`${ps.join(' + ')} = ${bien} kg`] },
        };
      },
    },
  };

  // ---------- Idea 4: el mínimo de pesadas ----------
  // Cambia: cuántas monedas · Permanece: una sola pesa más y la balanza de dos platillos · Progresa: los grupos de tercios ·
  // Se reserva: 10 monedas (una más que 9) · Debe verse: cada pesada tiene tres resultados y deja un tercio.
  function monedas(n, extra = {}) {
    const g = Math.ceil(n / 3), grupos = [Math.min(g, n), Math.min(g, Math.max(0, n - g)), Math.max(0, n - 2 * g)];
    const mon = (q, col) => Array.from({ length: q }, () => ({ color: col, forma: 'circulo', t: '' }));
    return {
      filas: [{ rotulo: `Platillo izquierdo: ${grupos[0]}`, fichas: mon(grupos[0], 'o') }, { rotulo: `Platillo derecho: ${grupos[1]}`, fichas: mon(grupos[1], 'i') }, { rotulo: `Afuera: ${grupos[2]}`, fichas: mon(grupos[2], 'd') }],
      tam: 22, pie: extra.pie || `${n} monedas → quedan ${g} candidatas`,
    };
  }
  const pesadas = n => { let k2 = 0, m = 1; while (m < n) { m *= 3; k2++; } return k2; };
  const minimo = {
    id: 'minimo-de-pesadas',
    titulo: 'Cada pesada deja un tercio',
    temas: ['Número mínimo de pesadas'],
    pieza: 'rm-fichas',
    juega: {
      consigna: 'Entre varias monedas iguales, una pesa más. Se reparten en tres grupos: dos a la balanza y uno afuera. Cambia cuántas monedas hay.',
      voz: 'Si la balanza queda pareja, la pesada está afuera.',
      controles: [{ id: 'n', etiqueta: 'Monedas', opciones: [3, 9, 27].map(v => ({ valor: v, texto: String(v) })) }],
      dibujo: val => ({ datos: monedas(val.n), estado: {} }),
      lectura: val => [k, ` = ${pesadas(val.n)} pesadas para ${val.n} monedas`],
      minimo: 3,
    },
    predice: {
      pregunta: 'Entre 10 monedas iguales, una pesa más. ¿Cuántas pesadas aseguran encontrarla?',
      opciones: [
        { id: 'dos', texto: '2', error: 'RMT-COR-10', siFuera: 'Con 2 pesadas se distinguen hasta 9 monedas; 10 ya no caben.' },
        { id: 'c', texto: '3', correcta: true },
        { id: 'cinco', texto: '5', error: 'RMT-COR-11', siFuera: '5 sería partiendo en mitades; los tercios usan los tres resultados.' },
      ],
      dibujo: { datos: monedas(10), estado: {} },
      revelar: { datos: monedas(10, { pie: '3 · 3 = 9 < 10 ≤ 27: hacen falta 3' }), estado: {} },
      coincide: 'Coincide: dos pesadas distinguen 9 casos; con 10 monedas hace falta una tercera.',
    },
    mira: {
      datos: monedas(9),
      pasos: [
        { estado: { corte: 0 }, texto: '3 contra 3: si baja un lado, la moneda está ahí; si no, afuera.', ecuacion: ['9 → 3'] },
        { estado: { corte: 0 }, texto: 'Con 3 candidatas: 1 contra 1, y la tercera afuera.', ecuacion: ['3 → 1'] },
        { estado: { corte: 0 }, texto: 'Cada pesada tiene 3 resultados: k pesadas distinguen 3 a la k casos.', ecuacion: ['n ≤ ', { sup: ['3', k] }] },
      ],
    },
    regla: {
      texto: 'Si se sabe que la moneda distinta pesa más, cada pesada deja un tercio de las candidatas. El mínimo k es el menor que cumple 3 a la k ≥ n.',
      ecuacion: ['n ≤ ', { sup: ['3', k] }],
      condicion: 'se sabe si la moneda distinta pesa más o menos; si no se sabe, hacen falta más pesadas.',
    },
    ahoraTu: {
      pieza: 'rm-fichas',
      voz: 'Busca la menor potencia de 3 que alcance.',
      generar(s) {
        const r = azar(s), nn = r.ent(4, 90), bien = pesadas(nn);
        return {
          pregunta: `Entre ${nn} monedas iguales, una pesa más. Con una balanza de dos platillos, ¿cuántas pesadas aseguran encontrarla?`,
          dibujo: { datos: monedas(Math.min(nn, 27)), estado: {} },
          opciones: opcionesNum(bien, [
            { id: 'menos', valor: bien - 1, error: 'RMT-COR-10', siFuera: `Esas pesadas distinguen solo ${3 ** (bien - 1)} monedas.` },
            { id: 'mitad', valor: Math.ceil(Math.log2(nn)), error: 'RMT-COR-11', siFuera: 'Eso parte en mitades; con tercios bastan menos.' },
            { id: 'mas', valor: bien + 1, error: 'RMT-COR-12', siFuera: 'Con una menos ya alcanza.' },
          ]),
          solucion: { texto: `${3 ** (bien - 1)} < ${nn} ≤ ${3 ** bien}.`, ecuacion: [k, ` = ${bien}`] },
        };
      },
    },
  };

  return {
    unidad: 'razonamiento-matematico.cortes-y-pesadas',
    version: '0.1.0',
    estado: 'completa',
    requiere: ['/nucleo/kit/piezas/rm-plano.js', '/nucleo/kit/piezas/balanza.js', '/nucleo/kit/piezas/rm-fichas.js'],
    historia: {
      texto: 'A mediados del siglo XX, revistas como The Mathematical Gazette discutieron el problema de la moneda falsa: encontrarla con el menor número de pesadas. La balanza se vuelve un instrumento de información, no solo de medida: cada resultado decide la pesada siguiente. Los cortes son otra pregunta: cuántas piezas deja cada corte.',
      pregunta: '¿Cuánta información da una sola pesada?',
      fuente: { titulo: 'The Counterfeit Coin Problem · The Mathematical Gazette', url: 'https://www.cambridge.org/core/journals/mathematical-gazette/article/abs/counterfeit-coin-problem/9492ED055B1AF7EBDDFE6D4A9137363C' },
    },
    ideas: [cortes, equilibrio, pesasIdea, minimo],
  };
});
