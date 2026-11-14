/*
 * Teoría de «Planteo de ecuaciones» (razonamiento-matematico.planteo-de-ecuaciones).
 * Fuente: docs/teoria/matriz/razonamiento-matematico.json (unidad 15); historia: al-Khwarizmi (MacTutor).
 * Precisión: una frase de comparación se traduce identificando el referente; las raíces se revisan contra el contexto.
 * Colores (regla 4): la incógnita turquesa (c-i), la otra cantidad naranja (c-o), lo que se agrega con el tiempo
 * verde (c-d), lo que se descarta rojo (c-h).
 * Compañero: Faro (zorro). Códigos: RM1 (inversión al plantear), RM3 (edades); RMT-PLA-* nuevos (hipótesis).
 *
 * Ficha de tarea (diseno-y-animacion):
 *   Promesa: pasar de una frase a una ecuación que diga lo mismo, resolverla y revisar que la respuesta tenga sentido.
 *   Persona y condiciones: postulante de 3.º a 5.º, celular de gama baja, sin conexión.
 *   Resultado observable: escribe la ecuación de una comparación, resuelve edades, una cuadrática con contexto y un sistema.
 *   Orden de atención: 1.º las barras o las fichas · 2.º la lectura · acción principal fija.
 *   Estados: juego sin tocar · casos probados · predicción respondida · paso de Mira · caso nuevo resuelto o «No sé».
 *   Duda que resuelve: «"seis veces más alumnos que profesores": ¿6A = P o A = 6P?».
 */
(function (root, fabrica) {
  const def = fabrica(typeof module === 'object' && module.exports ? require('../../../nucleo/kit/kit.js') : root.Kit);
  if (typeof module === 'object' && module.exports) module.exports = def;
  else root.Teoria.unidad(def);
})(typeof self !== 'undefined' ? self : this, function (Kit) {
  'use strict';
  const f = (n, d = 2) => Kit.formatear(n, d);
  const x = { v: 'c-i', t: 'x' }, A = { v: 'c-o', t: 'A' }, Pp = { v: 'c-i', t: 'P' }, cc = { v: 'c-i', t: 'c' }, gg = { v: 'c-o', t: 'g' };
  function azar(s) {
    let q = (s * 2654435761 + 12345) >>> 0;
    const r = () => { q = (q + 0x6D2B79F5) >>> 0; let z = q; z = Math.imul(z ^ (z >>> 15), z | 1); z ^= z + Math.imul(z ^ (z >>> 7), z | 61); return ((z ^ (z >>> 14)) >>> 0) / 4294967296; };
    r.ent = (lo, hi) => lo + Math.floor(r() * (hi - lo + 1));
    r.elegir = xs => xs[Math.floor(r() * xs.length)];
    return r;
  }
  function opcionesTexto(correcta, distractores) {
    const vistos = new Set([correcta]);
    const ops = [{ id: 'c', texto: correcta, correcta: true }];
    for (const d of distractores) { if (!d.texto || vistos.has(d.texto) || /NaN|Infinity/.test(d.texto) || ops.length >= 4) continue; vistos.add(d.texto); ops.push(d); }
    return ops;
  }
  // Barras horizontales a escala (modelo de barras): [{ valor, color, rotulo, extra: { valor, color } }]
  function barras(lista, extra = {}) {
    const max = extra.max || Math.max(...lista.map(b => b.valor + (b.extra ? b.extra.valor : 0)), 1);
    const k = 6.4 / max, x0 = 3.1;
    const poligonos = [], textos = [];
    lista.forEach((b, i) => {
      const y = 0.5 + i * 1.5, w = b.valor * k;
      poligonos.push({ puntos: [[x0, y], [x0 + w, y], [x0 + w, y + 1], [x0, y + 1]], color: b.color, relleno: 0.25, desde: b.desde || 0 });
      if (b.partes) for (let j = 1; j < b.partes; j++) poligonos.push({ puntos: [[x0 + w * j / b.partes, y], [x0 + w * j / b.partes, y + 1]], abierto: true, color: b.color, grosor: 'cuadricula', desde: b.desde || 0 });
      if (b.extra) poligonos.push({ puntos: [[x0 + w, y], [x0 + w + b.extra.valor * k, y], [x0 + w + b.extra.valor * k, y + 1], [x0 + w, y + 1]], color: b.extra.color, relleno: 0.3, desde: b.extra.desde || 0 });
      textos.push({ x: 0.2, y: y + 0.5, t: b.rotulo, ancla: 'start', color: b.color });
      if (b.texto) textos.push({ x: x0 + w / 2, y: y + 0.5, t: b.texto, desde: b.desde || 0 });
    });
    return { ancho: 10, alto: 0.6 + lista.length * 1.5, poligonos, textos, pie: extra.pie };
  }

  // ---------- Idea 1: del enunciado a la ecuación ----------
  // Cambia: cuántos profesores · Permanece: «por cada profesor hay 6 alumnos» · Progresa: la barra de alumnos ·
  // Se reserva: la traducción palabra por palabra · Debe verse: el grupo más grande lleva el número que multiplica al chico.
  const traducir = {
    id: 'traducir',
    titulo: 'Quién es más grande',
    temas: ['Del enunciado a la ecuación'],
    pieza: 'rm-plano',
    juega: {
      consigna: 'En un aula hay 6 alumnos por cada profesor. Cambia el número de profesores y compara las dos barras.',
      voz: 'Mira cuál barra es la más larga.',
      controles: [{ id: 'p', etiqueta: 'Profesores', min: 1, max: 4, paso: 1, inicio: 1, decimales: 0, color: 'c-i' }],
      dibujo: val => ({ datos: barras([{ valor: val.p, color: 'i', rotulo: 'Prof.', partes: val.p, texto: String(val.p) }, { valor: 6 * val.p, color: 'o', rotulo: 'Alumnos', partes: val.p, texto: String(6 * val.p) }], { max: 24 }), estado: {} }),
      lectura: val => [A, ` = 6 · `, Pp, ` = 6 · ${val.p} = ${6 * val.p}`],
      minimo: 3,
    },
    predice: {
      pregunta: 'En un club hay 4 veces tantos socios como entrenadores. Con S socios y E entrenadores, ¿qué ecuación lo dice?',
      opciones: [
        { id: 'inv', texto: '4S = E', error: 'RM1', siFuera: '4S = E sigue el orden de las palabras, pero diría que hay más entrenadores.' },
        { id: 'c', texto: 'S = 4E', correcta: true },
        { id: 'suma', texto: 'S = E + 4', error: 'RMT-PLA-1', siFuera: 'S = E + 4 sería «cuatro socios más que entrenadores»; aquí son cuatro veces.' },
      ],
      dibujo: { datos: barras([{ valor: 1, color: 'i', rotulo: 'E' }, { valor: 4, color: 'o', rotulo: 'S' }], { max: 4 }), estado: {} },
      revelar: { datos: barras([{ valor: 2, color: 'i', rotulo: 'E', texto: '2', partes: 2 }, { valor: 8, color: 'o', rotulo: 'S', texto: '8', partes: 2 }], { max: 8, pie: 'Prueba: 2 entrenadores, 8 socios' }), estado: {} },
      coincide: 'Coincide: hay más socios, así que S es el que vale 4 veces el otro.',
    },
    mira: {
      datos: barras([{ valor: 2, color: 'i', rotulo: 'E', texto: '2', partes: 2 }, { valor: 8, color: 'o', rotulo: 'S', texto: '8', partes: 2, desde: 1 }], { max: 8 }),
      pasos: [
        { estado: { corte: 0 }, texto: 'Se da un valor de prueba: 2 entrenadores.' },
        { estado: { corte: 1 }, texto: 'Hay 4 veces tantos socios: 8.' },
        { estado: { corte: 1 }, texto: 'Se prueba la ecuación con esos números: 8 = 4 · 2 se cumple.', ecuacion: ['S = 4E'] },
      ],
    },
    regla: {
      texto: 'Antes de escribir, se decide qué cantidad es mayor. El número que multiplica va con la cantidad menor. Se comprueba con valores de prueba.',
      ecuacion: ['«a es k veces b»:  a = k · b'],
      condicion: 'las dos letras representan cantidades, no las palabras «socio» o «entrenador»; y k es «veces», no «más que».',
    },
    ahoraTu: {
      voz: 'Inventa números que cumplan la frase y prueba cada ecuación.',
      generar(s) {
        const r = azar(s), k = r.ent(2, 9);
        const [mayor, menor, Mm, mm] = r.elegir([['libros', 'cuadernos', 'L', 'C'], ['vacas', 'toros', 'V', 'T'], ['sillas', 'mesas', 'S', 'M'], ['peras', 'mangos', 'P', 'M'], ['buses', 'trenes', 'B', 'T']]);
        const tipo = s % 3;
        const frase = [`hay ${k} veces tantos ${mayor} como ${menor}`, `por cada uno de los ${menor} hay ${k} ${mayor}`, `hay ${k} ${mayor} más que ${menor}`][tipo];
        const bien = tipo === 2 ? `${Mm} = ${mm} + ${k}` : `${Mm} = ${k}${mm}`;
        return {
          pregunta: `En un almacén ${frase}. Con ${Mm} ${mayor} y ${mm} ${menor}, ¿qué ecuación lo dice?`,
          opciones: opcionesTexto(bien, [
            { id: 'inv', texto: tipo === 2 ? `${mm} = ${Mm} + ${k}` : `${k}${Mm} = ${mm}`, error: 'RM1', siFuera: `Esa diría que hay más ${menor}.` },
            { id: 'otra', texto: tipo === 2 ? `${Mm} = ${k}${mm}` : `${Mm} = ${mm} + ${k}`, error: 'RMT-PLA-1', siFuera: tipo === 2 ? '«Más que» suma; «veces» multiplica.' : '«Veces» multiplica; «más que» suma.' },
            { id: 'inv2', texto: tipo === 2 ? `${Mm} + ${k} = ${mm}` : `${mm} = ${k}${Mm}`, error: 'RM1', siFuera: `Esa diría que hay más ${menor}.` },
          ]),
          solucion: { texto: `Hay más ${mayor}; se prueba con ${mm} = 2.`, ecuacion: [tipo === 2 ? `${Mm} = 2 + ${k} = ${2 + k}` : `${Mm} = ${k} · 2 = ${2 * k}`] },
        };
      },
    },
  };

  // ---------- Idea 2: edades (ecuación lineal) ----------
  // Cambia: cuántos años pasan · Permanece: la diferencia de edades · Progresa: la razón entre las edades, que baja ·
  // Se reserva: cuándo el padre tiene el triple · Debe verse: los años se suman a los dos; la diferencia no cambia.
  const edades = (P, h, t, extra = {}) => barras([
    { valor: P, color: 'o', rotulo: 'Padre', texto: String(P + t), extra: t ? { valor: t, color: 'd' } : null },
    { valor: h, color: 'i', rotulo: 'Hijo', texto: String(h + t), extra: t ? { valor: t, color: 'd' } : null },
  ], { max: 60, pie: extra.pie || `Diferencia: ${P - h} años` });
  const edad = {
    id: 'edades',
    titulo: 'Pasan años para los dos',
    temas: ['Ecuaciones lineales'],
    pieza: 'rm-plano',
    juega: {
      consigna: 'Un padre tiene 30 años y su hijo 6. Haz pasar los años y mira la diferencia y la razón entre sus edades.',
      voz: 'La parte verde se agrega a las dos barras.',
      controles: [{ id: 't', etiqueta: 'Pasan', min: 0, max: 18, paso: 3, inicio: 0, unidad: 'años', decimales: 0, color: 'c-d' }],
      dibujo: val => ({ datos: edades(30, 6, val.t), estado: {} }),
      lectura: val => [`${30 + val.t} − ${6 + val.t} = 24 · razón ${f((30 + val.t) / (6 + val.t), 2)}`],
      minimo: 4,
    },
    predice: {
      pregunta: 'Una madre tiene 34 años y su hija 8. ¿Dentro de cuántos años la madre tendrá el triple de la edad de la hija?',
      opciones: [
        { id: 'c', texto: '5 años', correcta: true },
        { id: 'resta', texto: '10 años', error: 'RM3', siFuera: 'Eso supone que la razón cambia de a poco; se plantea 34 + x = 3(8 + x).' },
        { id: 'solo', texto: '24 años', error: 'RMT-PLA-2', siFuera: '24 suma años solo a una edad: 34 = 3 · (8 + x) da otra cosa.' },
        { id: 'nunca', texto: 'Nunca: ya tiene más del triple', error: 'RMT-PLA-3', siFuera: 'Hoy tiene más del triple, y la razón baja con los años: en algún momento es exactamente 3.' },
      ],
      dibujo: { datos: edades(34, 8, 0), estado: {} },
      revelar: { datos: edades(34, 8, 5, { pie: '39 = 3 · 13' }), estado: {} },
      coincide: 'Coincide: en 5 años, 39 y 13; 39 es el triple de 13.',
    },
    mira: {
      datos: edades(34, 8, 5, { pie: 'La diferencia sigue en 26' }),
      pasos: [
        { estado: { corte: 0 }, texto: 'Dentro de x años: la madre tendrá 34 + x; la hija, 8 + x.', ecuacion: ['34 + ', x, ' = 3(8 + ', x, ')'] },
        { estado: { corte: 0 }, texto: 'Se reparte el 3 y se juntan las x.', ecuacion: ['34 + ', x, ' = 24 + 3', x, '  ⇒  10 = 2', x] },
        { estado: { corte: 0 }, texto: 'x = 5. Comprobación: 39 y 13.', ecuacion: [x, ' = 5'] },
      ],
    },
    regla: {
      texto: 'Con edades, los años que pasan se suman a todos; la diferencia de edades no cambia. Se plantea la condición en el momento pedido y se comprueba.',
      ecuacion: ['(A + ', x, ') = k · (B + ', x, ')'],
      condicion: 'la respuesta tiene que ser un número de años con sentido (no negativo si se pregunta por el futuro).',
    },
    ahoraTu: {
      pieza: 'rm-plano',
      voz: 'Escribe las dos edades en el momento pedido.',
      generar(s) {
        const r = azar(s), h = r.ent(3, 12), xx = r.ent(2, 12), k = r.ent(2, 4), P = k * (h + xx) - xx;
        return {
          pregunta: `Un padre tiene ${P} años y su hijo ${h}. ¿Dentro de cuántos años el padre tendrá ${k === 2 ? 'el doble' : k === 3 ? 'el triple' : 'el cuádruple'} de la edad de su hijo?`,
          dibujo: { datos: edades(P, h, 0), estado: {} },
          opciones: opcionesTexto(`${xx} años`, [
            { id: 'solo', texto: `${f((P - k * h) / k, 1)} años`, error: 'RMT-PLA-2', siFuera: 'Los años se suman a las dos edades.' },
            { id: 'dif', texto: `${P - h} años`, error: 'RM3', siFuera: 'Esa es la diferencia de edades.' },
            { id: 'k', texto: `${xx + 1} años`, error: 'RMT-PLA-4', siFuera: 'Comprueba: no da exactamente esa razón.' },
          ]),
          solucion: { texto: `Comprobación: ${P + xx} = ${k} · ${h + xx}.`, ecuacion: [`${P} + `, x, ` = ${k}(${h} + `, x, `)  ⇒  `, x, ` = ${xx}`] },
        };
      },
    },
  };

  // ---------- Idea 3: cuadrática con contexto ----------
  // Cambia: un número entero · Permanece: el rectángulo de lados n y n + 1 · Progresa: el área · Se reserva: la raíz
  // negativa · Debe verse: las dos raíces cumplen la ecuación, pero solo una tiene sentido.
  const rect = (nn, extra = {}) => {
    const k = 5 / 11;
    return {
      ancho: 10, alto: 6,
      poligonos: [{ puntos: [[1, 0.5], [1 + (nn + 1) * k, 0.5], [1 + (nn + 1) * k, 0.5 + nn * k], [1, 0.5 + nn * k]], color: 'i', relleno: 0.2 }],
      textos: [{ x: 1 + (nn + 1) * k / 2, y: 0.25, t: `${nn + 1}`, color: 'o' }, { x: 0.55, y: 0.5 + nn * k / 2, t: `${nn}`, color: 'i' }, { x: 1 + (nn + 1) * k / 2, y: 0.5 + nn * k / 2, t: `${nn * (nn + 1)}` }],
      pie: extra.pie,
    };
  };
  const cuadratica = {
    id: 'cuadratica',
    titulo: 'Dos raíces, una respuesta',
    temas: ['Ecuaciones cuadráticas'],
    pieza: 'rm-plano',
    juega: {
      consigna: 'Un rectángulo mide n de alto y n + 1 de largo. Cambia n y mira su área.',
      voz: 'El área crece rápido: n se multiplica por su consecutivo.',
      controles: [{ id: 'n', etiqueta: 'n', min: 1, max: 10, paso: 1, inicio: 3, decimales: 0, color: 'c-i' }],
      dibujo: val => ({ datos: rect(val.n), estado: {} }),
      lectura: val => [x, `(`, x, ` + 1) = ${val.n} · ${val.n + 1} = ${val.n * (val.n + 1)}`],
      minimo: 3,
    },
    predice: {
      pregunta: 'Las edades de dos hermanos son números seguidos y su producto es 132. ¿Cuántos años tiene el mayor?',
      opciones: [
        { id: 'c', texto: '12 años', correcta: true },
        { id: 'menor', texto: '11 años', error: 'RMT-PLA-5', siFuera: '11 es la edad del menor: x = 11 y el mayor x + 1.' },
        { id: 'neg', texto: '12 o −11 años', error: 'RMT-PLA-6', siFuera: 'La ecuación también da x = −12 (mayor −11), pero una edad no es negativa.' },
        { id: 'mitad', texto: '66 años', error: 'RMT-PLA-7', siFuera: '66 es 132 / 2; el producto de seguidos no se reparte en mitades.' },
      ],
      dibujo: { datos: rect(10, { pie: 'n · (n + 1) = 132 ?' }), estado: {} },
      revelar: { datos: rect(11, { pie: '11 · 12 = 132' }), estado: {} },
      coincide: 'Coincide: 11 · 12 = 132; el mayor tiene 12.',
    },
    mira: {
      datos: rect(11),
      pasos: [
        { estado: { corte: 0 }, texto: 'El menor tiene x años; el mayor, x + 1.', ecuacion: [x, '(', x, ' + 1) = 132'] },
        { estado: { corte: 0 }, texto: 'Se pasa todo a un lado y se factoriza.', ecuacion: ['(', x, ' − 11)(', x, ' + 12) = 0'] },
        { estado: { corte: 0 }, texto: 'x = 11 o x = −12; una edad no es negativa.', ecuacion: [x, ' = 11 · mayor = 12'] },
      ],
    },
    regla: {
      texto: 'Una ecuación cuadrática puede tener dos raíces. Las dos cumplen la ecuación, pero solo se acepta la que tiene sentido en el problema.',
      ecuacion: [x, '(', x, ' + 1) = N  ⇒  dos raíces; se descarta la que no cabe en el contexto'],
      condicion: 'se revisa el dominio: edades y longitudes no son negativas; cantidades de objetos son enteras.',
    },
    ahoraTu: {
      pieza: 'rm-plano',
      voz: 'Busca dos números seguidos cuyo producto sea ese.',
      generar(s) {
        const r = azar(s), nn = r.ent(4, 25), N = nn * (nn + 1), pide = s % 2 ? 'mayor' : 'menor';
        const bien = pide === 'mayor' ? nn + 1 : nn;
        return {
          pregunta: `Dos números enteros positivos y seguidos tienen producto ${N}. ¿Cuál es el ${pide}?`,
          opciones: opcionesTexto(String(bien), [
            { id: 'otro', texto: String(pide === 'mayor' ? nn : nn + 1), error: 'RMT-PLA-5', siFuera: `Ese es el ${pide === 'mayor' ? 'menor' : 'mayor'}.` },
            { id: 'neg', texto: String(-(nn + 1)), error: 'RMT-PLA-6', siFuera: 'Es raíz de la ecuación, pero no es positivo.' },
            { id: 'mitad', texto: String(N / 2), error: 'RMT-PLA-7', siFuera: 'El producto no se reparte en mitades.' },
          ]),
          solucion: { texto: `${nn} · ${nn + 1} = ${N}.`, ecuacion: [x, `(`, x, ` + 1) = ${N}  ⇒  `, x, ` = ${nn}`] },
        };
      },
    },
  };

  // ---------- Idea 4: sistemas (cabezas y patas) ----------
  // Cambia: cuántos conejos hay entre 10 animales · Permanece: 10 cabezas · Progresa: las patas · Se reserva: 15 cabezas
  // y 46 patas · Debe verse: cambiar una gallina por un conejo agrega 2 patas.
  const granja = (c, g, extra = {}) => ({
    filas: [
      { rotulo: `Conejos: ${c} (4 patas)`, fichas: Array.from({ length: c }, () => ({ t: 'C', color: 'i' })) },
      { rotulo: `Gallinas: ${g} (2 patas)`, fichas: Array.from({ length: g }, () => ({ t: 'G', color: 'o' })) },
    ],
    tam: 24, pie: extra.pie || `Cabezas ${c + g} · patas ${4 * c + 2 * g}`,
  });
  const sistema = {
    id: 'cabezas-y-patas',
    titulo: 'Cabezas y patas',
    temas: ['Sistemas de ecuaciones'],
    pieza: 'rm-fichas',
    juega: {
      consigna: 'En un corral hay 10 animales entre conejos y gallinas. Cambia cuántos son conejos y cuenta las patas.',
      voz: 'Mira cuánto suben las patas con cada conejo más.',
      controles: [{ id: 'c', etiqueta: 'Conejos', min: 0, max: 10, paso: 1, inicio: 0, decimales: 0, color: 'c-i' }],
      dibujo: val => ({ datos: granja(val.c, 10 - val.c), estado: {} }),
      lectura: val => [`Patas = 20 + 2 · `, cc, ` = ${20 + 2 * val.c}`],
      minimo: 4,
    },
    predice: {
      pregunta: 'En otro corral hay 15 cabezas y 46 patas, entre conejos y gallinas. ¿Cuántos conejos hay?',
      opciones: [
        { id: 'c', texto: '8', correcta: true },
        { id: 'g', texto: '7', error: 'RMT-PLA-8', siFuera: '7 son las gallinas: 15 − 8.' },
        { id: 'div', texto: '11,5', error: 'RMT-PLA-9', siFuera: '46 / 4 supone que todos son conejos; hay gallinas.' },
        { id: 'resta', texto: '16', error: 'RMT-PLA-10', siFuera: '16 son las patas de más; cada conejo aporta solo 2 de ellas.' },
      ],
      dibujo: { datos: granja(0, 15, { pie: '15 cabezas · 46 patas' }), estado: {} },
      revelar: { datos: granja(8, 7), estado: {} },
      coincide: 'Coincide: si todos fueran gallinas habría 30 patas; las 16 que sobran son 8 conejos.',
    },
    mira: {
      datos: granja(8, 7),
      pasos: [
        { estado: { corte: 0 }, texto: 'Si los 15 fueran gallinas: 30 patas.', ecuacion: ['15 · 2 = 30'] },
        { estado: { corte: 0 }, texto: 'Sobran 16 patas; cada conejo trae 2 más que una gallina.', ecuacion: [cc, ' = 16 / 2 = 8'] },
        { estado: { corte: 0 }, texto: 'Con letras es un sistema: el mismo resultado.', ecuacion: [cc, ' + ', gg, ' = 15 · 4', cc, ' + 2', gg, ' = 46'] },
      ],
    },
    regla: {
      texto: 'Dos datos distintos sobre las mismas cantidades forman un sistema. Se puede suponer todo de un tipo y repartir la diferencia, o resolver con dos ecuaciones.',
      ecuacion: [cc, ' + ', gg, ' = cabezas  ·  4', cc, ' + 2', gg, ' = patas'],
      condicion: 'las dos ecuaciones son independientes y la solución tiene sentido: animales enteros y no negativos.',
    },
    ahoraTu: {
      pieza: 'rm-fichas',
      voz: 'Supón que todos son del tipo con menos patas.',
      generar(s) {
        const r = azar(s), c = r.ent(2, 14), g = r.ent(2, 14), H = c + g, Pt = 4 * c + 2 * g, pide = s % 2 ? 'gallinas' : 'conejos';
        const bien = pide === 'conejos' ? c : g;
        return {
          pregunta: `En un corral hay ${H} cabezas y ${Pt} patas, entre conejos y gallinas. ¿Cuántas ${pide === 'conejos' ? 'son conejos' : 'son gallinas'}?`,
          dibujo: { datos: granja(0, Math.min(H, 12), { pie: `${H} cabezas · ${Pt} patas` }), estado: {} },
          opciones: opcionesTexto(String(bien), [
            { id: 'otro', texto: String(pide === 'conejos' ? g : c), error: 'RMT-PLA-8', siFuera: `Esos son ${pide === 'conejos' ? 'las gallinas' : 'los conejos'}.` },
            { id: 'dif', texto: String(Pt - 2 * H), error: 'RMT-PLA-10', siFuera: 'Esas son las patas de más; cada conejo aporta 2.' },
            { id: 'div', texto: f(Pt / 4, 2), error: 'RMT-PLA-9', siFuera: 'Eso supone que todos son conejos.' },
          ]),
          solucion: { texto: `Todos gallinas: ${2 * H} patas; sobran ${Pt - 2 * H}, de a 2 por conejo.`, ecuacion: [cc, ` = ${Pt - 2 * H} / 2 = ${c}`] },
        };
      },
    },
  };

  return {
    unidad: 'razonamiento-matematico.planteo-de-ecuaciones',
    version: '0.1.0',
    estado: 'completa',
    requiere: ['/nucleo/kit/piezas/rm-plano.js', '/nucleo/kit/piezas/rm-fichas.js'],
    historia: {
      texto: 'En el siglo IX, al-Khwarizmi escribió un tratado que ordenó métodos para resolver ecuaciones y aplicarlos a problemas prácticos. Lo escribía todo con palabras: la x y el signo igual llegaron mucho después. Plantear es eso: comprimir en una ecuación lo que una frase dice.',
      pregunta: '¿Cómo escribirías una ecuación solo con palabras?',
      fuente: { titulo: 'Al-Khwarizmi · MacTutor', url: 'https://mathshistory.st-andrews.ac.uk/Biographies/Al-Khwarizmi/' },
    },
    ideas: [traducir, edad, cuadratica, sistema],
  };
});
