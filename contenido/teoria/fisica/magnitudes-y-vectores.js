/*
 * Teoría de «Magnitudes y unidades» (fisica.magnitudes-y-vectores; el id es el de antes del 16 nov, cuando la unidad
 * se partió en dos y los vectores pasaron a fisica/vectores.js). Molde de docs/teoria.md y contrato «se entiende sin
 * profesor» (docs/plan-calidad.md). Ideas: cambiar de unidad, áreas y volúmenes (aprobada por Gerson el 16 nov) y
 * dimensiones; las tres con 15 ejemplos resueltos (pestaña «Ejemplos»).
 * Colores por papel (regla 4; Gerson, 17 nov: un mismo color no cambia de papel en toda la unidad): el dato, naranja
 * (c-o), también el alto h del poste y la profundidad h del tanque (no L: L es la dimensión longitud de la idea 3); el
 * factor que vale 1, verde (c-d); el resultado y la respuesta, turquesa (c-i), también el área y el volumen de la
 * idea 2; la incógnita (k, una constante, un exponente), rojo (c-h).
 * Letras (una letra, un significado en la unidad; 17 nov): P es la presión; la potencia se escribe Pot, como en las
 * academias; T es el período del péndulo (choca con la dimensión T: se avisa); q es la cantidad de movimiento (práctica).
 * Todo ejercicio da sus datos en el campo `datos`, una línea por dato (contrato, punto 13; Gerson, 16 nov: «todos los
 * datos deben darse, incluso las fórmulas… criterio, no memoria»): las equivalencias (1 km = 1000 m), la fórmula que se
 * usa (A = largo × ancho, ρ = m / V) y, en dimensiones, las unidades o dimensiones de lo que no se pide, qué quieren
 * decir los corchetes y el punto, y la regla de los exponentes. En áreas y volúmenes se da la equivalencia de largo
 * (1 m = 100 cm): elevarla al cuadrado o al cubo es lo que se aprende. Los datos no hacen un paso ni descartan una
 * opción: nada de «½ no tiene dimensión» donde eso es lo que se juzga, ni la dimensión ya escrita de lo que se pide.
 * La figura de un ejemplo muestra el planteamiento, nunca la respuesta (17 nov): la balanza va sin veredicto y la
 * combi, sin los tramos que dan la rapidez pedida.
 * Notación de los libros (contrato, punto 13): el péndulo es T = 2π·√(L/g), con T el período y L el largo; donde la
 * letra choca con la dimensión (T, L), los datos lo avisan sin escribir la dimensión.
 * Códigos de error (hipótesis, sin dato empírico propio; matriz: «confundir dimensiones con unidades»):
 *   DIM-UNIDAD toma la unidad por la dimensión · DIM-INVERSA invierte el despeje · DIM-TERMINO copia la del otro lado
 *   DIM-EXPONENTE olvida que una potencia repite las fichas
 *   CONV-UNO un solo factor · CONV-INVERSO factor al revés · CONV-CUADRADO olvida elevar el factor
 *   CONV-CUBO eleva al cubo un factor de área (o al cuadrado uno de volumen) · CONV-PREFIJO confunde el valor de un prefijo
 *   DIM-UNO cree que basta un término · DIM-SUMA suma las dimensiones · DIM-NUMERO cree que un número suelto cambia la dimensión
 */
(function (root, fabrica) {
  const nodo = typeof module === 'object' && module.exports;
  const def = nodo ? fabrica(require('../../../nucleo/kit/kit.js')) : fabrica(root.Kit);
  if (nodo) module.exports = def;
  else root.Teoria.unidad(def);
})(typeof self !== 'undefined' ? self : this, function (Kit) {
  'use strict';
  // Números de 4 cifras sin espacio (RAE y SI: 3400, pero 12 000), igual que los escritos a mano.
  const f = (n, d = 2) => Kit.formatear(n, d).replace(/^(−?\d) (\d{3})(?=,|$)/, '$1$2');
  // Para los distractores muy chicos (2,5 ÷ 10 000): las cifras que hagan falta, no un redondeo a 4 decimales.
  const fc = n => f(n, Math.abs(n) >= 1 || n === 0 ? 3 : Math.min(8, 2 - Math.floor(Math.log10(Math.abs(n)))));
  const k = { v: 'c-h', t: 'k' };
  function azar(s) {
    let q = (s * 2654435761 + 12345) >>> 0;
    const r = () => { q = (q + 0x6D2B79F5) >>> 0; let z = q; z = Math.imul(z ^ (z >>> 15), z | 1); z ^= z + Math.imul(z ^ (z >>> 7), z | 61); return ((z ^ (z >>> 14)) >>> 0) / 4294967296; };
    r.ent = (lo, hi) => lo + Math.floor(r() * (hi - lo + 1));
    r.de = xs => xs[Math.floor(r() * xs.length)];
    return r;
  }
  // La correcta primero; los distractores que repiten un texto o no son finitos se descartan.
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

  // ---------- Idea 1: cambiar de unidad cambia el número, no la magnitud ----------
  // Rehecha el 16 nov contra el contrato «se entiende sin profesor» (docs/plan-calidad.md): Gerson pidió un poste de
  // luz medido con reglas de distintas escalas, en SVG (pieza fis-medida). Antes era una barra sobre una recta que
  // cambiaba de regla al cambiar de unidad, y así no se podía comparar.
  // Cambia: el alto del poste · Permanece: el poste es uno solo y las tres reglas lo miden juntas ·
  // Progresa: los tres números a la vez (6,5 m, 65 dm, 650 cm) · Se reserva: la conversión de km/h a m/s ·
  // Debe verse: el mismo alto con tres números; la regla más fina da el número más grande.
  const POSTE = 8;   // m: los postes de alumbrado de baja tensión suelen medir unos 8 m
  // Largos creíbles para los ejercicios de la idea 1 (contrato, punto 10: nada de lápices de 2,5 m).
  const LARGOS = [{ que: 'Una puerta', m: 2.1 }, { que: 'Una pizarra', m: 2.4 }, { que: 'Un poste de luz', m: 8.5 },
    { que: 'Una cancha de vóley', m: 18 }, { que: 'Un estudiante', m: 1.65 }];
  // Valores de los ejercicios: rapideces de carretera (sin 72 km/h, el de «Predice»; sin 108: un bus no va tan
  // rápido), clases de 40 a 90 minutos y pastillas en mg.
  const RAPIDECES = [36, 54, 90], RAPIDECES_MS = [5, 10, 15, 25], PASTILLAS = [250, 400, 500, 750];
  const CLASES = [40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90];
  const MILI = '1 g = 1000 mg (m, mili: una milésima)';
  // Un valor de la lista distinto del que «Ahora tú» saca con la misma semilla (su primer azar es r.de(xs)).
  const otro = (xs, s) => xs[(Math.floor(azar(s)() * xs.length) + 1 + Math.floor(azar(s + 900)() * (xs.length - 1))) % xs.length];
  const MISION = 6.5;
  const Lp = { v: 'c-o', t: 'h' };
  const medida = L => ({ datos: { objeto: 'poste', alto: L, max: 10, color: 'o', variable: 'h' }, estado: {} });
  // Lo que avanza en cada segundo a 72 km/h: tramos de 20 m (se calcula: 72 · 1000 / 3600).
  const V_KMH = 72, V_MS = V_KMH * 1000 / 3600;
  // La combi en su pista (pieza fis-combi): dónde está en cada segundo. segundos: 0 la deja en la partida.
  const pista = (segundos, v = V_MS) => ({ v, segundos, max: Math.max(100, Math.ceil(5 * v / 20) * 20), paso: 10, numero: 20, color: 'o' });
  // Ejemplos resueltos de «Cambiar de unidad» (pestaña «Ejemplos», Gerson 16 nov): 3 niveles × 5, resueltos enteros.
  // Colores por papel: el dato, naranja (c-o); el factor que vale 1, verde (c-d); el resultado, turquesa (c-i). Cada
  // ejemplo trae sus equivalencias y su fórmula en `datos` (contrato, punto 13), también la regla de las potencias de
  // 10 donde se usa. El ÷ 3,6 no se da por sabido: se hace con 1000 y 3600 o se dice de dónde sale. Niveles (17 nov,
  // auditoría): N1, un factor; N2, dos factores o dos pasos; N3, tres pasos o más, o el error típico del examen.
  // Las figuras muestran el planteamiento, no el resultado: la combi sin sus tramos y las rapideces sin barras medidas.
  // Cuentas recalculadas con un script aparte, fuera del repo (17 nov): 105/1000, 3,4·1000, 45/60, 12·1000, 72·60;
  // 90·1000/3600, 10·3600/1000, 24·60·60, 3·3600/1000, 70·10⁻⁶; 3·10⁸·60/10³; 100 000/3600 ≈ 27,8 y 900/60 = 15;
  // 120/5 = 24, 24/1000·1000; 54 000/3600 = 15, 20·60 = 1200, 15·1200; 1800/2 = 900, 900 000/3600 = 250.
  const dO = t => ({ v: 'c-o', t }), dF = t => ({ v: 'c-d', t }), dR = t => ({ v: 'c-i', t });
  const fo = datos => ({ pieza: 'fis-objeto', datos, estado: {} });
  const tc = t => ({ tacha: t });
  // km/h a m/s con los dos factores a la vista (para no dar el ÷ 3,6 por sabido).
  const aMs = (n, res) => [{ frac: [[dO(`${n} `), tc('km')], ['1 ', tc('h')]] }, ' × ', { frac: [dF('1000 m'), ['1 ', tc('km')]] }, ' × ', { frac: [['1 ', tc('h')], dF('3600 s')] }, ' = ', res];
  const POT10 = 'Potencias de 10: al multiplicar, los exponentes se suman; al dividir, se restan (10⁵ ÷ 10² = 10³)';
  const EJEMPLOS_UNIDADES = [
    { nivel: 1, titulo: 'El largo de una cancha', figura: fo({ objeto: 'cancha', largo: '105 m' }),
      enunciado: ['Una cancha de fútbol mide ', dO('105 m'), ' de largo. ¿Cuántos kilómetros son?'],
      datos: ['1 km = 1000 m'],
      solucion: [
        { texto: ['El kilómetro es más grande que el metro: el número tiene que ', dR('bajar'), '.'] },
        { texto: ['Se multiplica por el factor que tiene km arriba y m abajo; los metros se tachan.'], ecuacion: [dO('105'), ' ', { tacha: 'm' }, ' × ', { frac: [dF('1 km'), ['1000 ', { tacha: 'm' }]] }, ' = ', dR('0,105 km')] },
      ],
      respuesta: [dR('0,105 km')] },
    { nivel: 1, titulo: 'Un bebé en la balanza', figura: fo({ objeto: 'bebe', pantalla: '3,4 kg' }),
      enunciado: ['Un bebé recién nacido tiene una masa de ', dO('3,4 kg'), '. ¿Cuántos gramos son?'],
      datos: ['1 kg = 1000 g'],
      solucion: [
        { texto: ['El gramo es más chico: caben muchos en un kilogramo. El número tiene que ', dR('subir'), '.'] },
        { texto: ['Factor con g arriba y kg abajo.'], ecuacion: [dO('3,4'), ' ', { tacha: 'kg' }, ' × ', { frac: [dF('1000 g'), ['1 ', { tacha: 'kg' }]] }, ' = ', dR('3400 g')] },
      ],
      respuesta: [dR('3400 g')] },
    { nivel: 1, titulo: 'Un viaje en fracción de hora', figura: fo({ objeto: 'reloj', minutos: 45, texto: '45 min' }),
      enunciado: ['El viaje en combi de Juliaca a Puno dura unos ', dO('45 min'), '. ¿Cuántas horas son?'],
      datos: ['1 h = 60 min'],
      solucion: [
        { texto: ['En el reloj, 45 minutos son tres cuartos de la vuelta: menos de una hora.'] },
        { texto: ['Factor con h arriba y min abajo.'], ecuacion: [dO('45'), ' ', { tacha: 'min' }, ' × ', { frac: [dF('1 h'), ['60 ', { tacha: 'min' }]] }, ' = ', dR('0,75 h')] },
      ],
      respuesta: [dR('0,75 h'), ', tres cuartos de hora'] },
    { nivel: 1, titulo: 'La carga de un camión', figura: fo({ objeto: 'camion', carga: '12 t' }),
      enunciado: ['Un camión lleva ', dO('12 t'), ' de papa a la feria. ¿Cuántos kilogramos son?'],
      datos: ['1 t (tonelada) = 1000 kg'],
      solucion: [
        { texto: ['La tonelada, t, es una unidad grande de masa: mil kilogramos.'] },
        { texto: ['Factor con kg arriba y t abajo.'], ecuacion: [dO('12'), ' ', { tacha: 't' }, ' × ', { frac: [dF('1000 kg'), ['1 ', { tacha: 't' }]] }, ' = ', dR('12 000 kg')] },
      ],
      respuesta: [dR('12 000 kg')] },
    { nivel: 1, titulo: 'Latidos en una hora', figura: fo({ objeto: 'corazon', texto: '72 latidos en un minuto' }),
      enunciado: ['Un corazón late ', dO('72 veces por minuto'), '. ¿Cuántas veces late en una hora?'],
      datos: ['1 h = 60 min'],
      solucion: [
        { texto: ['Una hora tiene 60 minutos, y en cada uno late 72 veces.'] },
        { texto: ['Los minutos se tachan.'], ecuacion: [{ frac: [dO('72 latidos'), ['1 ', { tacha: 'min' }]] }, ' × ', { frac: [['60 ', { tacha: 'min' }], dF('1 h')] }, ' = ', dR('4320 latidos/h')] },
      ],
      respuesta: [dR('4320'), ' latidos'] },
    { nivel: 2, titulo: 'Una combi en m/s', figura: { pieza: 'fis-combi', datos: pista(0, 25), estado: {} },
      enunciado: ['Una combi va a ', dO('90 km/h'), '. ¿Cuántos metros avanza en cada segundo?'],
      datos: ['1 km = 1000 m', '1 h = 3600 s'],
      solucion: [
        { texto: ['Hay que cambiar dos unidades: los km a m y las horas a segundos. Dos factores.'] },
        { texto: ['Los km se tachan arriba con abajo, y las h también.'], ecuacion: [{ frac: [[dO('90 '), { tacha: 'km' }], ['1 ', { tacha: 'h' }]] }, ' × ', { frac: [dF('1000 m'), ['1 ', { tacha: 'km' }]] }, ' × ', { frac: [['1 ', { tacha: 'h' }], dF('3600 s')] }, ' = ', dR('25 m/s')] },
        { texto: ['Atajo: por 1000 y entre 3600 es lo mismo que entre 3,6, porque 3600 ÷ 1000 = 3,6.'], ecuacion: ['90 ÷ 3,6 = ', dR('25')] },
      ],
      respuesta: [dR('25 m/s')] },
    { nivel: 2, titulo: 'Un corredor en km/h', figura: fo({ objeto: 'atleta', distancia: '100 m', tiempo: '10 s' }),
      enunciado: ['Un corredor hace los ', dO('100 m'), ' en ', dO('10 s'), '. ¿A cuántos km/h corre?'],
      datos: ['Rapidez: v = d / t (distancia entre tiempo)', '1 km = 1000 m', '1 h = 3600 s'],
      solucion: [
        { texto: ['Primero su rapidez en m/s: metros entre segundos.'], ecuacion: ['100 m ÷ 10 s = ', dO('10 m/s')] },
        { texto: ['Luego a km/h: los metros a km y los segundos a horas.'], ecuacion: [{ frac: [dO('10 m'), '1 s'] }, ' × ', { frac: [dF('1 km'), '1000 m'] }, ' × ', { frac: [dF('3600 s'), '1 h'] }, ' = ', dR('36 km/h')] },
      ],
      respuesta: [dR('36 km/h')] },
    { nivel: 2, titulo: 'Los segundos de un día', figura: fo({ objeto: 'reloj', minutos: 60, texto: '1 h: una vuelta del minutero' }),
      enunciado: ['¿Cuántos segundos tiene ', dO('1 día'), '?'],
      datos: ['1 día = 24 h', '1 h = 60 min', '1 min = 60 s'],
      solucion: [
        { texto: ['Se encadenan tres factores: de días a horas, de horas a minutos y de minutos a segundos.'] },
        { texto: ['Cada unidad de arriba se tacha con la misma de abajo: día con día, h con h y min con min.'], ecuacion: [dO('1 '), tc('día'), ' × ', { frac: [[dF('24 '), tc('h')], ['1 ', tc('día')]] }, ' × ', { frac: [[dF('60 '), tc('min')], ['1 ', tc('h')]] }, ' × ', { frac: [dF('60 s'), ['1 ', tc('min')]] }, ' = ', dR('86 400 s')] },
      ],
      respuesta: [dR('86 400 s')] },
    { nivel: 2, titulo: 'Un caracol lento', figura: fo({ objeto: 'caracol', texto: '3 mm en cada segundo' }),
      enunciado: ['Un caracol avanza ', dO('3 mm/s'), '. ¿Cuántos metros avanza en una hora?'],
      datos: ['Distancia: d = v · t (rapidez por tiempo)', '1 m = 1000 mm', '1 h = 3600 s'],
      solucion: [
        { texto: ['En una hora hay 3600 segundos: avanza 3 mm en cada uno.'], ecuacion: [dO('3 mm/s'), ' × ', dF('3600 s'), ' = 10 800 mm'] },
        { texto: ['Y los milímetros a metros: entre 1000.'], ecuacion: ['10 800 mm × ', { frac: [dF('1 m'), '1000 mm'] }, ' = ', dR('10,8 m')] },
      ],
      respuesta: [dR('10,8 m'), ' en una hora: ', dR('10,8 m/h')] },
    { nivel: 2, titulo: 'El grosor de un cabello', figura: fo({ objeto: 'cabello', texto: '70 μm' }),
      enunciado: ['Un cabello tiene unos ', dO('70 μm'), ' de grosor. ¿Cuántos metros son? Escríbelo en notación científica.'],
      datos: ['1 μm = 10⁻⁶ m (μ se lee «micro»: una millonésima)', 'Notación científica: un número de 1 a 10 por una potencia de 10', POT10],
      solucion: [
        { texto: ['Factor con m arriba y μm abajo; los μm se tachan.'], ecuacion: [dO('70'), ' ', tc('μm'), ' × ', { frac: [dF('10⁻⁶ m'), ['1 ', tc('μm')]] }, ' = 70 × 10⁻⁶ m'] },
        { texto: ['70 no está entre 1 y 10: 70 = 7 × 10. Los exponentes se suman: 1 + (−6) = −5.'], ecuacion: ['7 × 10¹ × 10⁻⁶ m = ', dR('7 × 10⁻⁵ m')] },
      ],
      respuesta: [dR('7 × 10⁻⁵ m'), ', o 0,00007 m'] },
    { nivel: 3, titulo: 'La luz en un minuto', figura: fo({ objeto: 'sol', texto: '300 000 000 m en cada segundo' }),
      enunciado: ['La luz viaja a ', dO('3 × 10⁸ m/s'), '. ¿Cuántos kilómetros recorre en ', dO('1 min'), '?'],
      datos: ['Distancia: d = v · t (rapidez por tiempo)', '1 min = 60 s', '1 km = 10³ m', POT10],
      fuente: 'BIPM, El Sistema Internacional de Unidades, 9.ª ed. (2019): c = 299 792 458 m/s; aquí, redondeada a 3 × 10⁸ m/s',
      solucion: [
        { texto: ['En un minuto hay 60 segundos: se multiplica.'], ecuacion: [dO('3 × 10⁸ m/s'), ' × ', dF('60 s'), ' = 180 × 10⁸ m = 1,8 × 10¹⁰ m'] },
        { texto: ['De metros a kilómetros se divide entre 10³: los exponentes se restan.'], ecuacion: ['1,8 × 10¹⁰ m × ', { frac: [dF('1 km'), '10³ m'] }, ' = ', dR('1,8 × 10⁷ km')] },
      ],
      respuesta: [dR('1,8 × 10⁷ km'), ': dieciocho millones de kilómetros'] },
    { nivel: 3, titulo: '¿Guepardo, auto o caballo?', figura: fo({ objeto: 'comparar', titulo: 'Tres rapideces en tres unidades', barras: [{ nombre: 'Guepardo', texto: '30 m/s' }, { nombre: 'Auto', texto: '100 km/h' }, { nombre: 'Caballo', texto: '900 m/min' }] }),
      enunciado: ['Ordena de más lento a más rápido: un guepardo a unos ', dO('30 m/s'), ', un auto a ', dO('100 km/h'), ' y un caballo de carrera a ', dO('900 m/min'), '.'],
      datos: ['1 km = 1000 m', '1 h = 3600 s', '1 min = 60 s'],
      solucion: [
        { texto: ['Para comparar, las tres en la misma unidad: m/s. El guepardo ya está en m/s.'] },
        { texto: ['El auto: los km a metros y las horas a segundos.'], ecuacion: aMs(100, dO('27,8 m/s')) },
        { texto: ['El caballo: los minutos a segundos.'], ecuacion: [{ frac: [dO('900 m'), ['1 ', tc('min')]] }, ' × ', { frac: [['1 ', tc('min')], dF('60 s')] }, ' = ', dO('15 m/s')] },
        { texto: ['Ya en la misma unidad se ordenan: 15 es menos que 27,8, y 27,8 es menos que 30.'] },
      ],
      respuesta: [dR('Caballo, auto y guepardo'), ': 15, 27,8 y 30 m/s'] },
    { nivel: 3, titulo: 'Un jarabe en g/L', figura: fo({ objeto: 'botella', texto: '120 mg', nombre: 'en cada 5 mL' }),
      enunciado: ['La etiqueta de un jarabe dice ', dO('120 mg'), ' de medicina en cada ', dO('5 mL'), '. ¿Cuántos gramos de medicina hay en 1 L de jarabe?'],
      datos: ['1 g = 1000 mg (m se lee «mili»: una milésima)', '1 L = 1000 mL'],
      solucion: [
        { texto: ['Primero, cuánto hay en 1 mL: se reparte entre 5.'], ecuacion: [dO('120 mg'), ' ÷ ', dO('5 mL'), ' = ', dO('24 mg/mL')] },
        { texto: ['Dos factores: los mg a g y los mL a L. Los mL de abajo se tachan con un factor que los lleva arriba.'], ecuacion: [{ frac: [[dO('24 '), tc('mg')], ['1 ', tc('mL')]] }, ' × ', { frac: [dF('1 g'), ['1000 ', tc('mg')]] }, ' × ', { frac: [['1000 ', tc('mL')], dF('1 L')] }, ' = ', dR('24 g/L')] },
        { texto: ['Ojo: los dos 1000 se cancelan. Por eso 24 mg/mL y 24 g/L son lo mismo: no se divide entre 1000.'] },
      ],
      respuesta: [dR('24 g'), ' de medicina en 1 L'] },
    { nivel: 3, titulo: 'Cuánto avanza en 20 minutos', figura: { pieza: 'fis-combi', datos: pista(0, 15), estado: {} },
      enunciado: ['Una combi va a ', dO('54 km/h'), ' durante ', dO('20 min'), '. ¿Cuántos metros recorre?'],
      datos: ['Distancia: d = v · t (rapidez por tiempo)', '1 km = 1000 m', '1 h = 3600 s', '1 min = 60 s'],
      solucion: [
        { texto: ['Antes de multiplicar, todo al SI. La rapidez, en m/s:'], ecuacion: aMs(54, dO('15 m/s')) },
        { texto: ['El tiempo, en segundos:'], ecuacion: [dO('20'), ' ', tc('min'), ' × ', { frac: [dF('60 s'), ['1 ', tc('min')]] }, ' = ', dO('1200 s')] },
        { texto: ['Distancia es rapidez por tiempo; los segundos se tachan.'], ecuacion: [{ frac: [dO('15 m'), ['1 ', tc('s')]] }, ' × ', dO('1200 '), tc('s'), ' = ', dR('18 000 m')] },
        { texto: ['Error típico: multiplicar 54 × 20 = 1080 sin cambiar las unidades. Las horas y los minutos no se tachan entre sí.'] },
      ],
      respuesta: [dR('18 000 m'), ', o 18 km'] },
    { nivel: 3, titulo: '¿Un avión supera al sonido?', figura: fo({ objeto: 'comparar', titulo: 'Dos rapideces en distinta unidad', barras: [{ nombre: 'Avión', texto: '1800 km en 2 h' }, { nombre: 'Sonido', texto: '340 m/s' }] }),
      enunciado: ['Un avión de pasajeros recorre ', dO('1800 km'), ' en ', dO('2 h'), '. El sonido viaja en el aire a unos ', dO('340 m/s'), '. ¿El avión va más rápido que el sonido?'],
      datos: ['Rapidez: v = d / t (distancia entre tiempo)', '1 km = 1000 m', '1 h = 3600 s'],
      solucion: [
        { texto: ['La rapidez del avión, en km/h: distancia entre tiempo.'], ecuacion: [dO('1800 km'), ' ÷ ', dO('2 h'), ' = ', dO('900 km/h')] },
        { texto: ['Para comparar con el sonido, a m/s: los km a metros y las horas a segundos.'], ecuacion: aMs(900, dO('250 m/s')) },
        { texto: ['250 m/s es menos que 340 m/s: el sonido le gana por 90 m/s.'] },
      ],
      respuesta: [dR('No'), ': va a 250 m/s; el sonido, a unos 340 m/s'] },
  ];

  const unidades = {
    id: 'unidades',
    titulo: 'Cambiar de unidad',
    pregunta: '¿Qué cambia cuando mides lo mismo en otra unidad?',
    temas: ['Magnitudes fundamentales y derivadas', 'Sistema Internacional', 'Conversión de unidades'],
    pieza: 'fis-medida',
    lee: {
      tarjetas: [
        { titulo: 'Medir es contar', texto: 'Medir algo es contar cuántas veces cabe en él una unidad: el metro, el decímetro o el centímetro. Lo que se mide, como el largo, es una magnitud. El número que sale depende de la unidad que elijas.' },
        { titulo: 'Las unidades de la ciencia', texto: 'La ciencia usa el Sistema Internacional (SI): el metro, el kilogramo y el segundo. Un prefijo agranda o achica la unidad: kilo (k) es mil veces; centi (c), una centésima; mili (m), una milésima; y micro (μ), una millonésima.' },
        { titulo: 'Unidades que se juntan', texto: 'Una rapidez junta dos unidades. 60 km/h dice cuántos kilómetros se avanzan en una hora; en metros por segundo, m/s, dice cuántos metros en un segundo.' },
        { titulo: 'Qué mirar al jugar', texto: 'Vas a medir un poste de luz con tres reglas a la vez. Cambia su alto y mira las tres reglas juntas: ¿marcan la misma altura?' },
      ],
    },
    actividad: 'Medir un poste de luz con tres reglas a la vez: en metros, decímetros y centímetros.',
    ejemplos: EJEMPLOS_UNIDADES,
    aprendizaje: 'El poste mide lo mismo en cualquier unidad; cambia el número: en decímetros es 10 veces más y en centímetros, 100 veces más.',
    juega: {
      pieza: 'fis-medida',
      consigna: 'Los postes de luz de Juliaca miden unos 8 m. Aquí medimos uno con tres reglas a la vez.',
      mision: {
        texto: `Cambia el alto del poste hasta que la regla de centímetros marque ${f(MISION * 100, 0)}.`,
        logrado: val => Math.abs(val.L - MISION) < 1e-9,
        bien: `Listo: ${f(MISION * 100, 0)} cm. Mira las otras reglas: ${f(MISION, 1)} m y ${f(MISION * 10, 0)} dm. Es el mismo poste.`,
      },
      voz: 'Mira las tres reglas: ¿marcan alturas distintas o la misma altura con otro número?',
      leyenda: [
        { s: Lp, t: 'el alto del poste' },
        { s: 'm', t: 'metro' },
        { s: 'dm', t: 'decímetro: 10 caben en un metro' },
        { s: 'cm', t: 'centímetro: 100 caben en un metro' },
      ],
      controles: [
        { id: 'L', etiqueta: 'Alto del poste, h', color: 'c-o', min: 4, max: 10, paso: 0.1, inicio: POSTE, unidad: 'm', decimales: 1 },
      ],
      dibujo: val => medida(val.L),
      lectura: val => [Lp, ` = ${f(val.L, 1)} m = ${f(val.L * 10, 0)} dm = ${f(val.L * 100, 0)} cm`],
      minimo: 3,
    },
    predice: {
      pregunta: `Una combi va a ${f(V_KMH, 0)} km/h. ¿Cuántos metros avanza en cada segundo?`,
      datos: ['1 km = 1000 m', '1 h = 3600 s'],
      opciones: [
        { id: 'c', texto: `${f(V_MS, 0)} m`, correcta: true },
        { id: 'solo-km', texto: `${f(V_KMH * 1000, 0)} m`, error: 'CONV-UNO', siFuera: 'Eso pasa bien los km a metros, pero son los metros de una hora entera.' },
        { id: 'por', texto: `${f(V_KMH * 3.6, 1)} m`, error: 'CONV-INVERSO', siFuera: 'Multiplicaste: 72 × 3,6 = 259,2 m en un segundo, más que dos canchas de fútbol. Una combi no corre tanto.' },
        { id: 'minuto', texto: `${f(V_KMH * 1000 / 60, 0)} m`, error: 'CONV-UNO', siFuera: 'Esos son los metros de un minuto. Una hora tiene 3600 segundos.' },
      ],
      pieza: 'fis-combi',
      dibujo: { datos: pista(0), estado: {} },
      revelar: { datos: pista(5), estado: {} },
      coincide: `Coincide: 72 000 m repartidos en 3600 s dan ${f(V_MS, 0)} m cada segundo.`,
    },
    // «Predice», «Mira» y «Así se resuelve» muestran la combi en su pista (pieza fis-combi, 16 nov): antes eran saltos
    // sobre una recta que hablaban de una combi que no se dibujaba.
    mira: {
      pieza: 'fis-combi',
      datos: pista(5),
      // Las unidades se tachan arriba con abajo (lector en frío, 16 nov: no se veía por qué el factor de la hora va al revés).
      pasos: [
        { estado: { corte: 0 }, texto: '72 km/h quiere decir 72 km en una hora.', ecuacion: ['72 km/h = ', { frac: ['72 km', '1 h'] }] },
        { estado: { corte: 0 }, texto: 'Algo entre algo igual da 1, y 1000 m es igual a 1 km.', ecuacion: [{ frac: ['1000 m', '1 km'] }, ' = 1'] },
        { estado: { corte: 0 }, texto: 'Por 1 nada cambia: el km de arriba se tacha con el de abajo.',
          ecuacion: [{ frac: [['72 ', { tacha: 'km' }], '1 h'] }, ' × ', { frac: ['1000 m', ['1 ', { tacha: 'km' }]] }, ' = ', { frac: ['72 000 m', '1 h'] }] },
        { estado: { corte: 0 }, texto: 'Para tachar la hora de abajo, el factor lleva la hora arriba.',
          ecuacion: [{ frac: ['72 000 m', ['1 ', { tacha: 'h' }]] }, ' × ', { frac: [['1 ', { tacha: 'h' }], '3600 s'] }, ' = ', { frac: ['72 000 m', '3600 s'] }] },
        { estado: { corte: 1 }, texto: 'Se reparten los metros entre los segundos: 20 m en cada uno.', ecuacion: [{ frac: ['72 000 m', '3600 s'] }, ' = 20 m/s'] },
        { estado: { corte: 3 }, texto: 'Atajo: por 1000 y entre 3600 es entre 3,6, porque 3600 ÷ 1000 = 3,6.', ecuacion: ['72 ÷ 3,6 = 20'] },
        { estado: { corte: 5 }, texto: 'Cinco segundos, cinco tramos iguales: la misma rapidez, otro número.', ecuacion: ['72 km/h = 20 m/s'] },
      ],
    },
    regla: {
      texto: 'Cambiar de unidad no cambia lo medido: el poste es el mismo y la combi va igual de rápido. Cambia el número: se multiplica por factores que valen 1.',
      ecuacion: [{ frac: [['72 ', { tacha: 'km' }], ['1 ', { tacha: 'h' }]] }, ' × ', { llave: [{ frac: ['1000 m', ['1 ', { tacha: 'km' }]] }], nota: 'vale 1', color: 'c-d' }, ' × ', { llave: [{ frac: [['1 ', { tacha: 'h' }], '3600 s'] }], nota: 'vale 1', color: 'c-d' }, ' = 20 ', { frac: ['m', 's'] }],
      condicion: 'cada factor vale 1 y va de modo que la unidad vieja se tache: arriba si estaba abajo, y al revés.',
    },
    // «Así se resuelve» y «Ahora tú» son del mismo tipo con la misma semilla (docs/teoria.md 4e), pero con otro valor:
    // `otro` nunca elige el que toca en «Ahora tú» (auditoría, 17 nov: con la semilla 2 salían los dos iguales).
    resuelve: {
      pieza: 'fis-combi',
      generar(s) {
        const tipo = s % 5;
        if (tipo === 0) {
          // Sin 72 km/h: ese es el caso de «Predice» y «Mira».
          const n = otro(RAPIDECES, s), ms = n * 1000 / 3600;
          return {
            enunciado: `Una combi va a ${f(n, 0)} km/h. ¿Cuántos metros avanza en cada segundo?`,
            datos: ['1 km = 1000 m', '1 h = 3600 s'],
            dibujo: { datos: pista(0, ms), estado: {} },
            pasos: [
              { tipo: 'pide', texto: 'Piden la rapidez en metros por segundo: cuántos metros avanza en un segundo.' },
              { tipo: 'datos', texto: `Va a ${f(n, 0)} km/h: avanza ${f(n, 0)} km en cada hora.` },
              { tipo: 'regla', texto: 'Cada unidad se cambia con un factor que vale 1: los km a metros y la hora a segundos.', ecuacion: ['1 km = 1000 m', '  y  ', '1 h = 3600 s'] },
              { tipo: 'cuentas', texto: 'Los km y las horas se tachan y queda m/s. Por 1000 y entre 3600 es lo mismo que entre 3,6.', ecuacion: [`${f(n, 0)} `, { frac: [{ tacha: 'km' }, { tacha: 'h' }] }, ' × ', { frac: ['1000 m', ['1 ', { tacha: 'km' }]] }, ' × ', { frac: [['1 ', { tacha: 'h' }], '3600 s'] }, ` = ${f(ms, 2)} m/s`], dibujo: { datos: pista(1, ms), estado: {} } },
              { tipo: 'sentido', texto: `${f(ms, 2)} m en un segundo: menos que una cancha de fútbol. Es creíble para un vehículo.` },
            ],
            respuesta: `${f(ms, 2)} m/s`,
          };
        }
        if (tipo === 1) {
          const o = otro(LARGOS, s);
          return {
            enunciado: `${o.que} mide ${f(o.m, 2)} m. ¿Cuántos centímetros son?`,
            datos: ['1 m = 100 cm'],
            pasos: [
              { tipo: 'pide', texto: 'Piden el mismo largo en centímetros.' },
              { tipo: 'datos', texto: `Mide ${f(o.m, 2)} m.` },
              { tipo: 'regla', texto: 'En un metro caben 100 centímetros: ese es el factor que vale 1.', ecuacion: [{ frac: ['100 cm', '1 m'] }, ' = 1'] },
              { tipo: 'cuentas', texto: 'Se multiplica por 100.', ecuacion: [`${f(o.m, 2)} m × `, { frac: ['100 cm', '1 m'] }, ` = ${f(o.m * 100, 0)} cm`] },
              { tipo: 'sentido', texto: 'El centímetro es más chico que el metro: el número tenía que subir, y subió.' },
            ],
            respuesta: `${f(o.m * 100, 0)} cm`,
          };
        }
        if (tipo === 2) {
          const mn = otro(CLASES, s), sg = mn * 60;
          return {
            enunciado: `Una clase dura ${f(mn, 0)} minutos. ¿Cuántos segundos son?`,
            datos: ['1 min = 60 s'],
            pasos: [
              { tipo: 'pide', texto: 'Piden el mismo tiempo en segundos, la unidad del Sistema Internacional.' },
              { tipo: 'datos', texto: `La clase dura ${f(mn, 0)} min.` },
              { tipo: 'regla', texto: 'Un minuto son 60 segundos: ese es el factor que vale 1.', ecuacion: [{ frac: ['60 s', '1 min'] }, ' = 1'] },
              { tipo: 'cuentas', texto: 'Se multiplica por 60.', ecuacion: [`${f(mn, 0)} min × `, { frac: ['60 s', '1 min'] }, ` = ${f(sg, 0)} s`] },
              { tipo: 'sentido', texto: 'El segundo es más chico que el minuto: el número tenía que subir, y subió.' },
            ],
            respuesta: `${f(sg, 0)} s`,
          };
        }
        if (tipo === 3) {
          // La figura es una combi: el texto también (auditoría, 17 nov: decía «ciclista» y se dibujaba una combi).
          const v = otro(RAPIDECES_MS, s), kmh = v * 3.6;
          return {
            enunciado: `Una combi va a ${f(v, 0)} m/s. ¿Cuántos km/h son?`,
            datos: ['1 km = 1000 m', '1 h = 3600 s'],
            dibujo: { datos: pista(0, v), estado: {} },
            pasos: [
              { tipo: 'pide', texto: 'Piden la misma rapidez en kilómetros por hora.' },
              { tipo: 'datos', texto: `Avanza ${f(v, 0)} m en cada segundo.`, dibujo: { datos: pista(1, v), estado: {} } },
              { tipo: 'regla', texto: 'Es el camino de vuelta: los metros a km y los segundos a horas. Los dos factores juntos dan 3,6.', ecuacion: [{ frac: ['1 km', '1000 m'] }, ' × ', { frac: ['3600 s', '1 h'] }, ' = 3,6'] },
              { tipo: 'cuentas', texto: 'Se multiplica por 3,6.', ecuacion: [`${f(v, 0)} × 3,6 = ${f(kmh, 0)} km/h`] },
              { tipo: 'sentido', texto: 'En una hora se avanza mucho más que en un segundo: el número tenía que subir.' },
            ],
            respuesta: `${f(kmh, 0)} km/h`,
          };
        }
        const mg = otro(PASTILLAS, s);
        return {
          enunciado: `Una pastilla tiene ${f(mg, 0)} mg de medicina. ¿Cuántos gramos son?`,
          datos: [MILI],
          pasos: [
            { tipo: 'pide', texto: 'Piden la misma masa en gramos.' },
            { tipo: 'datos', texto: `La pastilla tiene ${f(mg, 0)} mg: miligramos.` },
            { tipo: 'regla', texto: 'El prefijo mili quiere decir una milésima: en un gramo caben 1000 mg.', ecuacion: [{ frac: ['1 g', '1000 mg'] }, ' = 1'] },
            { tipo: 'cuentas', texto: 'Los mg se tachan: se divide entre 1000.', ecuacion: [`${f(mg, 0)} `, { tacha: 'mg' }, ' × ', { frac: ['1 g', ['1000 ', { tacha: 'mg' }]] }, ` = ${f(mg / 1000, 3)} g`] },
            { tipo: 'sentido', texto: 'El gramo es más grande que el miligramo: el número tenía que bajar. Una pastilla pesa menos de un gramo.' },
          ],
          respuesta: `${f(mg / 1000, 3)} g`,
        };
      },
    },
    ahoraTu: {
      generar(s) {
        const r = azar(s), tipo = s % 5;
        if (tipo === 0) {
          const n = r.de(RAPIDECES), ms = n * 1000 / 3600;
          return {
            pregunta: `Un bus va a ${f(n, 0)} km/h. ¿Cuánto es eso en m/s?`,
            datos: ['1 km = 1000 m', '1 h = 3600 s'],
            opciones: opciones(ms, [
              { id: 'por', valor: n * 3.6, error: 'CONV-INVERSO', siFuera: 'Multiplicar por 3,6 agranda el número; de km/h a m/s, el número baja.' },
              { id: 'km', valor: n * 1000, error: 'CONV-UNO', siFuera: 'Pasaste los km a metros; falta pasar la hora a segundos.' },
              { id: 'min', valor: n * 1000 / 60, error: 'CONV-UNO', siFuera: 'Eso divide entre 60: son metros por minuto.' },
            ], x => `${f(x, 2)} m/s`),
            solucion: { texto: 'Por 1000 y entre 3600: es dividir entre 3,6.', ecuacion: [`${f(n, 0)} ÷ 3,6 = ${f(ms, 2)} m/s`] },
          };
        }
        if (tipo === 1) {
          const o = r.de(LARGOS);
          return {
            pregunta: `${o.que} mide ${f(o.m, 2)} m. ¿Cuántos centímetros son?`,
            datos: ['1 m = 100 cm'],
            opciones: opciones(o.m * 100, [
              { id: 'dm', valor: o.m * 10, error: 'CONV-UNO', siFuera: 'Por 10 da decímetros; en un metro caben 100 cm.' },
              { id: 'inverso', valor: o.m / 100, error: 'CONV-INVERSO', siFuera: 'Dividir achica el número; el centímetro es más chico, el número sube.' },
              { id: 'mm', valor: o.m * 1000, error: 'CONV-UNO', siFuera: 'Por 1000 da milímetros; en un metro caben 100 cm.' },
            ], x => `${fc(x)} cm`),
            solucion: { texto: 'En un metro caben 100 cm.', ecuacion: [`${f(o.m, 2)} m × `, { frac: ['100 cm', '1 m'] }, ` = ${f(o.m * 100, 0)} cm`] },
          };
        }
        if (tipo === 2) {
          const mn = r.de(CLASES), sg = mn * 60;
          return {
            pregunta: `Una clase dura ${f(mn, 0)} minutos. ¿Cuántos segundos son?`,
            datos: ['1 min = 60 s'],
            opciones: opciones(sg, [
              { id: 'div', valor: mn / 60, error: 'CONV-INVERSO', siFuera: 'Dividir da horas: el segundo es más chico, el número sube.' },
              { id: 'cien', valor: mn * 100, error: 'CONV-UNO', siFuera: 'Un minuto tiene 60 segundos, no 100.' },
              { id: 'hora', valor: mn * 3600, error: 'CONV-UNO', siFuera: 'Ese 3600 es para horas, no para minutos.' },
            ], x => `${f(x, 2)} s`),
            solucion: { texto: 'Cada minuto son 60 segundos.', ecuacion: [`${f(mn, 0)} min × `, { frac: ['60 s', '1 min'] }, ` = ${f(sg, 0)} s`] },
          };
        }
        if (tipo === 3) {
          const v = r.de(RAPIDECES_MS);
          return {
            pregunta: `${v <= 10 ? 'Un ciclista' : 'Un carro'} va a ${f(v, 0)} m/s. ¿Cuántos km/h son?`,
            datos: ['1 km = 1000 m', '1 h = 3600 s'],
            opciones: opciones(v * 3.6, [
              { id: 'entre', valor: v / 3.6, error: 'CONV-INVERSO', siFuera: 'Entre 3,6 es para ir de km/h a m/s; aquí es el camino de vuelta.' },
              { id: 'sesenta', valor: v * 60, error: 'CONV-UNO', siFuera: 'Eso son metros por minuto; falta pasar a km y a horas.' },
              { id: 'tres-mil', valor: v * 3600, error: 'CONV-UNO', siFuera: 'Eso son metros por hora; falta pasar los metros a km.' },
            ], x => `${f(x, 2)} km/h`),
            solucion: { texto: 'Por 3600 y entre 1000: es multiplicar por 3,6.', ecuacion: [`${f(v, 0)} × 3,6 = ${f(v * 3.6, 0)} km/h`] },
          };
        }
        const mg = r.de(PASTILLAS);
        return {
          pregunta: `Una pastilla tiene ${f(mg, 0)} mg de medicina. ¿Cuántos gramos son?`,
          datos: [MILI],
          opciones: opciones(mg / 1000, [
            { id: 'por', valor: mg * 1000, error: 'CONV-INVERSO', siFuera: 'Multiplicar agranda el número; el gramo es más grande que el miligramo, el número baja.' },
            { id: 'centi', valor: mg / 100, error: 'CONV-PREFIJO', siFuera: 'Entre 100 sería si mili fuera una centésima; es una milésima.' },
            { id: 'deci', valor: mg / 10, error: 'CONV-PREFIJO', siFuera: 'Entre 10 sería un décimo; mili es una milésima: entre 1000.' },
          ], x => `${f(x, 3)} g`),
          solucion: { texto: 'En un gramo caben 1000 mg: se divide entre 1000.', ecuacion: [`${f(mg, 0)} mg × `, { frac: ['1 g', '1000 mg'] }, ` = ${f(mg / 1000, 3)} g`] },
        };
      },
    },
  };

  // ---------- Idea 2: en un área el factor va al cuadrado; en un volumen, al cubo ----------
  // Nueva el 16 nov (Gerson aprobó sacar estas conversiones de la idea 1, donde llegaban sin preparación). Pieza
  // fis-area: el mismo piso cubierto con cuadros de 1 m y de 1 dm, lado a lado, y un cubo con cuadrícula para el volumen.
  // Cambia: el lado del piso · Permanece: el piso es uno solo · Progresa: los cuadros que caben (× 100 al pasar a dm²) ·
  // Se reserva: m² a cm² (10 000), que se predice · Debe verse: el factor 10 entra una vez por cada lado.
  // El área y el volumen son lo que resulta de cambiar de unidad: turquesa (c-i); el lado que se cambia, naranja.
  const Ar = { v: 'c-i', t: 'A' };
  const pisoDoble = L => ({ datos: { color: 'i', cuadros: [
    { lado: L, max: 3, celdas: 1, arriba: `${f(L, 1)} m`, abajo: `${f(L * L, 2)} m²`, nombre: 'cuadros de 1 m' },
    { lado: L * 10, max: 30, celdas: 1, arriba: `${f(L * 10, 0)} dm`, abajo: `${f(L * L * 100, 0)} dm²`, nombre: 'cuadros de 1 dm' },
  ] }, estado: {} });
  const VISTAS_AREA = [
    { cuadros: [{ lado: 1, celdas: 10, fila: true, arriba: '1 m = 10 dm', abajo: '100 dm²', nombre: 'cuadros de 1 dm' }] },
    { cuadros: [{ lado: 1, celdas: 10, arriba: '1 m = 10 dm', abajo: '1 m² = 100 dm²', nombre: 'cuadros de 1 dm' },
      { lado: 1, celdas: 10, arriba: '1 dm = 10 cm', abajo: '1 dm² = 100 cm²', nombre: 'un dm², en cm' }] },
    { cubo: { n: 10, arriba: '1 dm = 10 cm', abajo: '1 dm³ = 1000 cm³ = 1 L', nombre: 'cubitos de 1 cm' } },
  ];
  // Datos creíbles: chacras de la sierra en hectáreas, tanques de agua de los techos, botellas.
  const CHACRAS = [0.5, 1.5, 2, 2.5, 3];
  const TANQUES = [600, 1100, 2500];
  const BOTELLAS = [250, 500, 625, 750];
  const PIZARRAS = [1.5, 2, 2.4, 3], BALDES = [0.008, 0.01, 0.012, 0.02];
  const HA = '1 ha (hectárea): un cuadrado de 100 m de lado';
  // Ejemplos resueltos de «Áreas y volúmenes» (pestaña «Ejemplos», 16 nov): 3 niveles × 5, con el molde de
  // EJEMPLOS_UNIDADES (dato naranja, factor que vale 1 verde, resultado turquesa) y objetos de fis-objeto. En áreas y
  // volúmenes los datos dan la equivalencia de largo cuando el ejemplo enseña a elevarla (1 m = 100 cm), y la fórmula
  // del área o del volumen que se usa.
  // Cuentas recalculadas con un script aparte, fuera del repo: 2,5·10 000 = 250·100, 2,5·1000,
  // 1,1·1000, 2,5 mL = 2,5 cm³, 893·10⁹ = 8,93·10¹¹; 624/10 000; 8·6 = 48, 0,4² = 0,16, 48/0,16 = 300 = 20·15;
  // 12·6·1,5 = 108, 108·1000; 0,92·10⁶/1000 = 920; 12·60/1000 = 0,72; √10 000 = 100, 4·100·4 = 1600; 2³ = 8;
  // 40·20·10 = 8000, 8000·1,7 = 13 600, /1000 = 13,6; 8·50 = 400, 6·50 = 300, 4·3 = 12, 48·2500 = 120 000 = 12·10⁴;
  // 120/1000 = 0,12, 10·8·0,12 = 9,6, 9,6·1000 = 9600, 9600/1100 ≈ 8,7 (16 nov, con los datos reales).
  // Datos reales, con su `fuente`: el Titicaca guarda unos 893 km³ (ILEC; 8372 km² por 107 m de hondo medio dan
  // ≈ 896 km³, cuadra); el adobe tradicional peruano, 1690–1750 kg/m³ (se usa 1,7 g/cm³); la lluvia normal de febrero
  // en Juliaca, 120,3 mm (SENAMHI). Creíbles, sin fuente: hielo a 0,92 g/cm³; tanques de techo de 1100 L.
  // Ejemplos resueltos de «Áreas y volúmenes» (pestaña «Ejemplos», 16 nov): 3 niveles × 5, con el molde de
  // EJEMPLOS_UNIDADES (dato naranja, factor que vale 1 verde, resultado turquesa) y objetos de fis-objeto. En áreas y
  // volúmenes los datos dan la equivalencia de largo cuando el ejemplo enseña a elevarla (1 m = 100 cm), y la fórmula
  // del área o del volumen que se usa. Niveles (17 nov, auditoría): la caja de 2 dm baja a N2 y el hielo sube a N3, con
  // un paso más (la masa del bloque) y el error típico de elevar al cuadrado.
  // Cuentas recalculadas con un script aparte, fuera del repo (17 nov): 2,5·10 000 = 250·100, 2,5·1000,
  // 1,1·1000, 2,5 mL = 2,5 cm³, 893·10⁹ = 8,93·10¹¹; 624/10 000; 8·6 = 48, 0,4² = 0,16, 48/0,16 = 300 = 20·15;
  // 12·6·1,5 = 108, 108·1000; 2³ = 8; 12·60/1000 = 0,72; √10 000 = 100, 4·100·4 = 1600;
  // 0,92·10⁶/1000 = 920, 920·0,5 = 460 (con el error de elevar al cuadrado: 0,92·10⁴/1000 = 9,2 y 9,2·0,5 = 4,6);
  // 40·20·10 = 8000, 8000·1,7 = 13 600, /1000 = 13,6; 8·50 = 400, 6·50 = 300, 4·3 = 12, 48·2500 = 120 000 = 12·10⁴;
  // 120/1000 = 0,12, 10·8·0,12 = 9,6, 9,6·1000 = 9600, 9600/1100 ≈ 8,7.
  // Datos reales, con su `fuente`: el Titicaca guarda unos 893 km³ (ILEC; 8372 km² por 107 m de hondo medio dan
  // ≈ 896 km³, cuadra); el adobe tradicional, 1690–1700 kg/m³ según la revisión de Pakamuros (UNJ, 2026; se usa
  // 1,7 g/cm³); la lluvia normal de febrero en Juliaca, 120,3 mm (SENAMHI). De todos los días, con «unos» y sin
  // fuente (Gerson, 17 nov): hielo a 0,92 g/cm³; tanques de techo de 1100 L.
  // Piedra y otros, «Análisis de las propiedades del adobe como material de construcción», Revista Científica Pakamuros
  // 14(1), pp. 172-188, Universidad Nacional de Jaén, 2026 (revisión PRISMA): adobe tradicional, 1690-1700 kg/m³.
  const FUENTE_ADOBE = 'Revista Pakamuros 14(1), UNJ, 2026, revisión sobre el adobe: revistas.unj.edu.pe/index.php/pakamuros/article/view/948';
  const EJEMPLOS_AREAS = [
    { nivel: 1, titulo: 'Una chacra en metros cuadrados', figura: fo({ objeto: 'terreno', largo: '250 m', ancho: '100 m', texto: '2,5 ha' }),
      enunciado: ['Una chacra de quinua en Cabana mide ', dO('2,5 ha'), '. ¿Cuántos metros cuadrados son?'],
      datos: ['1 ha = 10 000 m²', 'Área de un rectángulo: A = largo × ancho'],
      solucion: [
        { texto: ['Una hectárea es un cuadrado de 100 m de lado: en ella caben 10 000 cuadros de 1 m².'] },
        { texto: ['Factor con m² arriba y ha abajo; las hectáreas se tachan.'], ecuacion: [dO('2,5'), ' ', { tacha: 'ha' }, ' × ', { frac: [dF('10 000 m²'), ['1 ', { tacha: 'ha' }]] }, ' = ', dR('25 000 m²')] },
        { texto: ['Se comprueba con el dibujo: la chacra mide 250 m por 100 m.'], ecuacion: ['250 m × 100 m = ', dR('25 000 m²')] },
      ],
      respuesta: [dR('25 000 m²')] },
    { nivel: 1, titulo: 'Una botella en mililitros', figura: fo({ objeto: 'botella', texto: '2,5 L' }),
      enunciado: ['Una botella de agua dice ', dO('2,5 L'), '. ¿Cuántos mililitros son?'],
      datos: ['1 L = 1000 mL'],
      solucion: [
        { texto: ['El mililitro es mil veces más chico que el litro: el número tiene que ', dR('subir'), '.'] },
        { texto: ['Factor con mL arriba y L abajo.'], ecuacion: [dO('2,5'), ' ', { tacha: 'L' }, ' × ', { frac: [dF('1000 mL'), ['1 ', { tacha: 'L' }]] }, ' = ', dR('2500 mL')] },
      ],
      respuesta: [dR('2500 mL')] },
    { nivel: 1, titulo: 'El tanque del techo', figura: fo({ objeto: 'tanque', texto: '1,1 m³' }),
      enunciado: ['El tanque de agua de una casa en Juliaca guarda ', dO('1,1 m³'), '. ¿Cuántos litros son?'],
      datos: ['1 m³ = 1000 L'],
      solucion: [
        { texto: ['Un metro cúbico es un cubo de 1 m de lado: dentro caben 1000 botellas de un litro.'] },
        { texto: ['Factor con L arriba y m³ abajo.'], ecuacion: [dO('1,1'), ' ', { tacha: 'm³' }, ' × ', { frac: [dF('1000 L'), ['1 ', { tacha: 'm³' }]] }, ' = ', dR('1100 L')] },
      ],
      respuesta: [dR('1100 L')] },
    { nivel: 1, titulo: 'Una vacuna en la jeringa', figura: fo({ objeto: 'jeringa', ml: 2.5, max: 5, texto: '2,5 mL' }),
      enunciado: ['En la posta, una enfermera pone ', dO('2,5 mL'), ' de vacuna en una jeringa. ¿Cuántos centímetros cúbicos son?'],
      datos: ['1 mL = 1 cm³'],
      solucion: [
        { texto: ['Un mililitro es lo que cabe en un cubito de 1 cm de lado: es la misma medida con dos nombres.'] },
        { texto: ['El factor vale 1 y el número no cambia.'], ecuacion: [dO('2,5'), ' ', { tacha: 'mL' }, ' × ', { frac: [dF('1 cm³'), ['1 ', { tacha: 'mL' }]] }, ' = ', dR('2,5 cm³')] },
      ],
      respuesta: [dR('2,5 cm³')] },
    { nivel: 1, titulo: 'El agua del lago Titicaca', figura: fo({ objeto: 'lago', nombre: 'Lago Titicaca', texto: '893 km³' }),
      enunciado: ['El lago Titicaca guarda unos ', dO('893 km³'), ' de agua. ¿Cuántos metros cúbicos son?'],
      datos: ['1 km³ = 10⁹ m³'],
      fuente: 'ILEC, World Lake Database, ficha del lago Titicaca (SAM-04)',
      solucion: [
        { texto: ['Un km³ es un cubo de 1 km de lado: caben mil millones de cubos de 1 m. El número sube mucho.'] },
        { texto: ['Se multiplica y se escribe en notación científica.'], ecuacion: [dO('893'), ' ', { tacha: 'km³' }, ' × ', { frac: [dF('10⁹ m³'), ['1 ', { tacha: 'km³' }]] }, ' = 893 × 10⁹ m³ = ', dR('8,93 × 10¹¹ m³')] },
      ],
      respuesta: [dR('8,93 × 10¹¹ m³')] },
    { nivel: 2, titulo: 'Una hoja en metros cuadrados', figura: fo({ objeto: 'hoja', ancho: '21 cm', alto: '29,7 cm', texto: '624 cm²' }),
      enunciado: ['Una hoja A4 cubre unos ', dO('624 cm²'), ' de la carpeta. ¿Cuántos metros cuadrados son?'],
      datos: ['1 m = 100 cm'],
      solucion: [
        { texto: ['El dato es de largo y aquí hay un área: el factor se eleva al cuadrado.'], ecuacion: [dF('1 m²'), ' = (100 cm)² = ', dF('10 000 cm²')] },
        { texto: ['Ahora sí, el factor con m² arriba y cm² abajo.'], ecuacion: [dO('624'), ' ', { tacha: 'cm²' }, ' × ', { frac: [dF('1 m²'), ['10 000 ', { tacha: 'cm²' }]] }, ' = ', dR('0,0624 m²')] },
        { texto: ['Dividir solo entre 100 daría 6,24 m²: más que una pizarra. No puede ser una hoja.'] },
      ],
      respuesta: [dR('0,0624 m²'), ', no 6,24 m²'] },
    { nivel: 2, titulo: 'Losetas para el aula', figura: fo({ objeto: 'piso', largo: '8 m', ancho: '6 m', loseta: '40 cm', nx: 20, ny: 15 }),
      enunciado: ['El aula mide ', dO('8 m'), ' por ', dO('6 m'), '. Se cubre con losetas cuadradas de ', dO('40 cm'), ' de lado. ¿Cuántas losetas hacen falta?'],
      datos: ['1 m = 100 cm', 'Área de un rectángulo: A = largo × ancho', 'Área de un cuadrado: A = lado × lado'],
      solucion: [
        { texto: ['Todo en metros: 40 cm = 0,4 m. El área de una loseta:'], ecuacion: ['0,4 m × 0,4 m = ', dO('0,16 m²')] },
        { texto: ['El área del aula, y cuántas losetas caben en ella:'], ecuacion: ['8 m × 6 m = 48 m²,   48 m² ÷ ', dO('0,16 m²'), ' = ', dR('300')] },
        { texto: ['Se comprueba por lados: caben 20 losetas a lo largo y 15 a lo ancho.'], ecuacion: ['20 × 15 = ', dR('300')] },
      ],
      respuesta: [dR('300 losetas')] },
    { nivel: 2, titulo: 'La piscina en litros', figura: fo({ objeto: 'piscina', largo: '12 m', ancho: '6 m', hondo: '1,5 m' }),
      enunciado: ['La piscina del colegio mide ', dO('12 m'), ' de largo, ', dO('6 m'), ' de ancho y ', dO('1,5 m'), ' de hondo. ¿Cuántos litros de agua le caben?'],
      datos: ['Volumen de una caja: V = largo × ancho × alto', '1 m³ = 1000 L'],
      solucion: [
        { texto: ['El agua llena una caja: su volumen es largo por ancho por hondo.'], ecuacion: [dO('12 m'), ' × ', dO('6 m'), ' × ', dO('1,5 m'), ' = ', dO('108 m³')] },
        { texto: ['De m³ a litros, factor con L arriba.'], ecuacion: [dO('108'), ' ', { tacha: 'm³' }, ' × ', { frac: [dF('1000 L'), ['1 ', { tacha: 'm³' }]] }, ' = ', dR('108 000 L')] },
      ],
      respuesta: [dR('108 000 L')] },
    { nivel: 2, titulo: 'Una caja de 2 dm', figura: { pieza: 'fis-area', datos: { color: 'i', cubo: { n: 2, arriba: '2 dm', nombre: 'cada cubito: 1 dm de lado' } }, estado: {} },
      enunciado: ['Una caja cúbica de cartón mide ', dO('2 dm'), ' de lado. ¿Cuántos litros de agua le caben?'],
      datos: ['1 L = 1 dm³', 'Volumen de un cubo: V = lado × lado × lado'],
      solucion: [
        { texto: ['Error típico: responder 2 L. Un volumen lleva el lado tres veces: largo, ancho y alto.'] },
        { texto: ['En el dibujo caben 2 × 2 × 2 cubos de 1 dm, y cada uno es un litro.'], ecuacion: ['(', dO('2 dm'), ')³ = 2 × 2 × 2 dm³ = ', dR('8 dm³'), ' = ', dR('8 L')] },
      ],
      respuesta: [dR('8 L'), ', no 2 L'] },
    { nivel: 2, titulo: 'Un caño en m³ por hora', figura: fo({ objeto: 'cano', texto: '12 L/min' }),
      enunciado: ['De un caño salen ', dO('12 L/min'), ' de agua. ¿Cuántos metros cúbicos echa en una hora?'],
      datos: ['1 m³ = 1000 L', '1 h = 60 min'],
      solucion: [
        { texto: ['Hay dos unidades que cambiar: los litros a m³ y los minutos a horas. Dos factores.'] },
        { texto: ['Los L y los min se tachan.'], ecuacion: [{ frac: [[dO('12 '), { tacha: 'L' }], ['1 ', { tacha: 'min' }]] }, ' × ', { frac: [dF('1 m³'), ['1000 ', { tacha: 'L' }]] }, ' × ', { frac: [['60 ', { tacha: 'min' }], dF('1 h')] }, ' = ', dR('0,72 m³/h')] },
      ],
      respuesta: [dR('0,72 m³'), ' en una hora, o 720 L'] },
    { nivel: 3, titulo: 'La cerca de una hectárea', figura: fo({ objeto: 'terreno', cuadrado: true, largo: 'lado: ?', texto: '1 ha' }),
      enunciado: ['Don Teófilo cerca un terreno cuadrado de ', dO('1 ha'), ' con 4 vueltas de alambre. ¿Cuántos metros de alambre necesita?'],
      datos: ['1 ha = 10 000 m²', 'Área de un cuadrado: A = lado × lado', 'Perímetro de un cuadrado: 4 × lado'],
      solucion: [
        { texto: ['El área de un cuadrado es lado por lado. ¿Qué número, por sí mismo, da 10 000?'], ecuacion: ['lado = ', { raiz: '10 000 m²' }, ' = ', dO('100 m')] },
        { texto: ['Una vuelta rodea los 4 lados; y son 4 vueltas.'], ecuacion: ['4 × ', dO('100 m'), ' = 400 m,   4 × 400 m = ', dR('1600 m')] },
        { texto: ['Ojo: el lado no es 10 000 ÷ 4. Eso confunde el área con el perímetro.'] },
      ],
      respuesta: [dR('1600 m'), ' de alambre'] },
    { nivel: 3, titulo: 'Un bloque de hielo', figura: fo({ objeto: 'bloque', material: 'hielo', texto: '0,92 g/cm³', nombre: 'V = 0,5 m³' }),
      enunciado: ['El hielo tiene una densidad de unos ', dO('0,92 g/cm³'), '. ¿Cuál es la masa, en kilogramos, de un bloque de hielo de ', dO('0,5 m³'), '?'],
      datos: ['Densidad: ρ = m / V (masa entre volumen)', '1 kg = 1000 g', '1 m = 100 cm'],
      solucion: [
        { texto: ['Primero la densidad en kg/m³. Del dato de largo sale el de volumen: el factor va al cubo.'], ecuacion: [dF('1 m³'), ' = (100 cm)³ = ', dF('1 000 000 cm³')] },
        { texto: ['Dos factores: los g se tachan con los g, y los cm³ con los cm³.'], ecuacion: [{ frac: [[dO('0,92 '), tc('g')], ['1 ', tc('cm³')]] }, ' × ', { frac: [dF('1 kg'), ['1000 ', tc('g')]] }, ' × ', { frac: [['1 000 000 ', tc('cm³')], dF('1 m³')] }, ' = ', dO('920 kg/m³')] },
        { texto: ['Cada m³ tiene 920 kg; el bloque tiene medio m³. De ρ = m / V sale m = ρ × V.'], ecuacion: [dO('920 kg/m³'), ' × ', dO('0,5 m³'), ' = ', dR('460 kg')] },
        { texto: ['Error típico: elevar el 100 solo al cuadrado. Daría 9,2 kg/m³: un bloque de 4,6 kg, más liviano que una mochila.'] },
      ],
      respuesta: [dR('460 kg')] },
    { nivel: 3, titulo: 'La masa de un adobe', figura: fo({ objeto: 'bloque', material: 'adobe', largo: '40 cm', ancho: '20 cm', alto: '10 cm', texto: '1,7 g/cm³' }),
      enunciado: ['Un adobe mide ', dO('40 cm'), ' × ', dO('20 cm'), ' × ', dO('10 cm'), '. El adobe tradicional tiene una densidad de unos ', dO('1,7 g/cm³'), '. ¿Cuál es su masa en kilogramos?'],
      datos: ['Volumen de una caja: V = largo × ancho × alto', 'Densidad: ρ = m / V (masa entre volumen)', '1 kg = 1000 g'],
      fuente: FUENTE_ADOBE,
      solucion: [
        { texto: ['Primero su volumen: largo por ancho por alto.'], ecuacion: [dO('40 cm'), ' × ', dO('20 cm'), ' × ', dO('10 cm'), ' = ', dO('8000 cm³')] },
        { texto: ['La densidad dice cuántos gramos hay en cada cm³: se multiplica.'], ecuacion: [dO('8000 '), { tacha: 'cm³' }, ' × ', { frac: [dO('1,7 g'), ['1 ', { tacha: 'cm³' }]] }, ' = 13 600 g'] },
        { texto: ['Y a kilogramos, con el factor que tiene kg arriba.'], ecuacion: ['13 600 ', { tacha: 'g' }, ' × ', { frac: [dF('1 kg'), ['1000 ', { tacha: 'g' }]] }, ' = ', dR('13,6 kg')] },
      ],
      respuesta: [dR('13,6 kg')] },
    { nivel: 3, titulo: 'El plano de un dormitorio', figura: fo({ objeto: 'plano', ancho: '8 cm', alto: '6 cm', escala: '1 : 50' }),
      enunciado: ['En un plano a escala ', dO('1 : 50'), ', un dormitorio mide ', dO('8 cm'), ' por ', dO('6 cm'), '. ¿Cuál es su área real en m²?'],
      datos: ['Escala 1 : 50: cada largo real es 50 veces el del plano', 'Área de un rectángulo: A = largo × ancho', '1 m = 100 cm'],
      solucion: [
        { texto: ['Con la escala, cada largo del plano se multiplica por 50.'], ecuacion: [dO('8 cm'), ' × 50 = 400 cm = 4 m,   ', dO('6 cm'), ' × 50 = 300 cm = 3 m'] },
        { texto: ['El área real es largo por ancho.'], ecuacion: ['4 m × 3 m = ', dR('12 m²')] },
        { texto: ['Ojo: el área no creció 50 veces, sino 50 × 50 = 2500. En el plano eran 48 cm².'], ecuacion: ['48 cm² × 2500 = 120 000 cm² = ', dR('12 m²')] },
      ],
      respuesta: [dR('12 m²')] },
    { nivel: 3, titulo: 'La lluvia sobre un techo', figura: fo({ objeto: 'techo', largo: '10 m', ancho: '8 m', lluvia: '120 mm' }),
      enunciado: ['En Juliaca, en todo el mes de febrero, llueven unos ', dO('120 mm'), '. ¿Cuántos litros de agua caen ese mes sobre un techo plano de ', dO('10 m'), ' por ', dO('8 m'), '?'],
      datos: ['120 mm de lluvia: una capa de agua de 120 mm de alto', 'Volumen de una caja: V = largo × ancho × alto', '1 m = 1000 mm', '1 m³ = 1000 L'],
      fuente: 'SENAMHI, boletín regional de Puno, febrero de 2021: normal de febrero en Juliaca, 120,3 mm',
      solucion: [
        { texto: ['La lluvia del mes es una capa de agua de 120 mm de alto sobre todo el techo. En metros:'], ecuacion: [dO('120 mm'), ' ÷ 1000 = ', dO('0,12 m')] },
        { texto: ['El volumen de esa capa es largo por ancho por alto.'], ecuacion: [dO('10 m'), ' × ', dO('8 m'), ' × ', dO('0,12 m'), ' = 9,6 m³'] },
        { texto: ['Y a litros, por 1000.'], ecuacion: ['9,6 ', { tacha: 'm³' }, ' × ', { frac: [dF('1000 L'), ['1 ', { tacha: 'm³' }]] }, ' = ', dR('9600 L')] },
        { texto: ['Para darse una idea: un tanque de techo guarda 1100 L. Esa lluvia llenaría casi 9.'], ecuacion: ['9600 L ÷ 1100 L ≈ 8,7'] },
      ],
      respuesta: [dR('9600 L'), ' en el mes: casi 9 tanques de techo'] },
  ];

  const areas = {
    id: 'areas-volumenes',
    titulo: 'Áreas y volúmenes',
    pregunta: '¿Por qué un metro cuadrado no son 10 decímetros cuadrados?',
    temas: ['Conversión de unidades'],
    pieza: 'fis-area',
    lee: {
      tarjetas: [
        { titulo: 'Área: cuántos cuadros caben', texto: 'El área de un piso dice cuántos cuadros de una medida caben en él. Un metro cuadrado, m², es un cuadro de 1 m de lado.' },
        { titulo: 'Volumen: cuántos cubos caben', texto: 'El volumen dice cuántos cubos de una medida caben dentro, por ejemplo cubitos de 1 cm de lado. Un litro es lo que cabe en un cubo de 10 cm de lado.' },
        { titulo: 'Medidas de terrenos', texto: 'En el campo, las chacras se miden en hectáreas. Una hectárea es un cuadrado de 100 m de lado.' },
        { titulo: 'Qué mirar al jugar', texto: 'Vas a cubrir el mismo piso con cuadros de 1 m y con cuadros de 1 dm, que miden 10 cm de lado. Compara los dos números.' },
      ],
    },
    actividad: 'Cubrir el mismo piso con cuadros de 1 m y de 1 dm, y contarlos.',
    ejemplos: EJEMPLOS_AREAS,
    aprendizaje: 'De m² a dm², el número se multiplica por 100 y no por 10: el factor 10 entra una vez por cada lado.',
    juega: {
      consigna: 'Un piso cuadrado, cubierto dos veces: con cuadros de 1 m y con cuadros de 1 dm.',
      mision: {
        texto: 'Cambia el lado hasta que el piso tenga 625 cuadros de 1 dm.',
        logrado: val => Math.abs(val.L - 2.5) < 1e-9,
        bien: 'Listo: 625 dm². Son 6,25 m²: cada metro cuadrado guarda 100 decímetros cuadrados.',
      },
      voz: '¿Cuántos cuadros de 1 dm caben en uno de 1 m?',
      leyenda: [
        { s: Ar, t: 'el área del piso' },
        { s: 'm²', t: 'metro cuadrado: cuadro de 1 m de lado' },
        { s: 'dm²', t: 'decímetro cuadrado: cuadro de 10 cm de lado' },
      ],
      controles: [
        { id: 'L', etiqueta: 'Lado del piso', color: 'c-o', min: 1, max: 3, paso: 0.5, inicio: 2, unidad: 'm', decimales: 1 },
      ],
      dibujo: val => pisoDoble(val.L),
      lectura: val => [Ar, ` = ${f(val.L * val.L, 2)} m² = ${f(val.L * val.L * 100, 0)} dm²`],
      minimo: 3,
    },
    predice: {
      pregunta: '¿Cuántos cuadraditos de 1 cm de lado caben en un cuadrado de 1 m²?',
      datos: ['1 m = 100 cm', '1 m²: un cuadrado de 1 m de lado'],
      opciones: [
        { id: 'c', texto: '10 000', correcta: true },
        { id: 'fila', texto: '100', error: 'CONV-CUADRADO', siFuera: 'Esos caben en una sola fila: 1 m tiene 100 cm. Pero hay 100 filas.' },
        { id: 'mil', texto: '1000', error: 'CONV-CUADRADO', siFuera: 'Mil serían 10 filas de 100. En 1 m hay 100 filas, no 10.' },
        { id: 'millon', texto: '1 000 000', error: 'CONV-CUBO', siFuera: 'Un millón es lo que cabe en un metro cúbico: ahí el factor va tres veces.' },
      ],
      dibujo: { datos: { color: 'i', cuadros: [{ lado: 1, celdas: 1, arriba: '1 m', abajo: '1 m²', nombre: 'un cuadro de 1 m de lado' }] }, estado: {} },
      revelar: { datos: Object.assign({ color: 'i' }, VISTAS_AREA[1]), estado: {} },
      coincide: 'Coincide: 100 filas de 100 cuadraditos son 10 000 cm².',
    },
    mira: {
      datos: { color: 'i', vistas: VISTAS_AREA },
      pasos: [
        { estado: { vista: 0 }, texto: 'Un metro tiene 10 dm: en una fila caben 10 cuadros de 1 dm.', ecuacion: ['1 m = 10 dm'] },
        { estado: { vista: 0 }, texto: 'Son 10 filas de 10: el factor 10 entra dos veces.', ecuacion: ['1 m² = 10 dm × 10 dm = 100 dm²'] },
        { estado: { vista: 1 }, texto: 'Cada dm² tiene 100 cm²: 100 veces 100.', ecuacion: ['1 m² = 100 × 100 cm² = 10 000 cm²'] },
        { estado: { vista: 2 }, texto: 'En un volumen el factor entra tres veces: largo, ancho y alto.', ecuacion: ['1 dm³ = 10 × 10 × 10 cm³ = 1000 cm³'] },
        { estado: { vista: 2 }, texto: 'Un cubo de 10 cm de lado guarda justo un litro.', ecuacion: ['1 dm³ = 1 L = 1000 cm³'] },
        { estado: { vista: 2 }, texto: 'Un metro cúbico son 10 por 10 por 10 de esos cubos: 1000 litros.', ecuacion: ['1 m³ = (10 dm)³ = 1000 dm³ = 1000 L'] },
      ],
    },
    regla: {
      texto: 'En un área el factor va al cuadrado; en un volumen, al cubo. De unidad grande a chica se multiplica; de chica a grande, se divide.',
      ecuacion: ['1 m² = (100 cm)² = 10 000 cm²', '   ·   ', '1 m³ = (10 dm)³ = 1000 dm³ = 1000 L'],
      condicion: 'se cambia de unidad dentro de una misma magnitud: un área no se pasa a volumen, ni un largo a área.',
    },
    // Datos de largo, no la equivalencia ya elevada (auditoría, 17 nov): elevar al cuadrado o al cubo es lo que se
    // practica. Cinco tipos: hectáreas, m² a cm², litros a m³, cm³ a litros y m³ a cm³.
    resuelve: {
      pieza: 'fis-area',
      generar(s) {
        const r = azar(s + 900), tipo = s % 5;
        if (tipo === 0) {
          const ha = r.de(CHACRAS);
          return {
            enunciado: `Una chacra en Puno mide ${f(ha, 1)} hectáreas. ¿Cuántos m² son?`,
            datos: [HA],
            dibujo: { datos: { color: 'i', cuadros: [{ lado: 100, celdas: 0.1, arriba: '100 m', abajo: '1 ha', nombre: 'cada cuadro: 10 m × 10 m' }] }, estado: {} },
            pasos: [
              { tipo: 'pide', texto: 'Piden la misma área en metros cuadrados.' },
              { tipo: 'datos', texto: `La chacra mide ${f(ha, 1)} ha, y una hectárea es un cuadrado de 100 m de lado.` },
              { tipo: 'regla', texto: 'Un área es lado por lado: en una hectárea caben 100 por 100 metros cuadrados.', ecuacion: ['1 ha = 100 m × 100 m = 10 000 m²'] },
              { tipo: 'cuentas', texto: 'Se multiplica por 10 000.', ecuacion: [`${f(ha, 1)} × 10 000 = ${f(ha * 10000, 0)} m²`] },
              { tipo: 'sentido', texto: 'El m² es mucho más chico que la hectárea: el número tenía que subir, y subió mucho.' },
            ],
            respuesta: `${f(ha * 10000, 0)} m²`,
          };
        }
        if (tipo === 1) {
          const m2 = r.de(PIZARRAS);
          return {
            enunciado: `Una pizarra tiene ${f(m2, 1)} m² de área. ¿Cuántos cm² son?`,
            datos: ['1 m = 100 cm'],
            pasos: [
              { tipo: 'pide', texto: 'Piden la misma área en centímetros cuadrados.' },
              { tipo: 'datos', texto: `La pizarra tiene ${f(m2, 1)} m².` },
              { tipo: 'regla', texto: 'En un área el factor va al cuadrado: 100 cm por 100 cm.', ecuacion: ['1 m² = (100 cm)² = 10 000 cm²'] },
              { tipo: 'cuentas', texto: 'Se multiplica por 10 000, no por 100.', ecuacion: [`${f(m2, 1)} × 10 000 = ${f(m2 * 10000, 0)} cm²`] },
              { tipo: 'sentido', texto: 'Un cm² es una uña de chico: en una pizarra caben muchísimos.' },
            ],
            respuesta: `${f(m2 * 10000, 0)} cm²`,
          };
        }
        if (tipo === 2) {
          const L = r.de(TANQUES);
          return {
            enunciado: `Un tanque de agua del techo guarda ${f(L, 0)} L. ¿Cuántos m³ son?`,
            datos: ['1 m = 10 dm', '1 L = 1 dm³'],
            dibujo: { datos: { color: 'i', cubo: { n: 10, arriba: '1 m = 10 dm', nombre: 'cada cubito: 1 dm³ = 1 L' } }, estado: {} },
            pasos: [
              { tipo: 'pide', texto: 'Piden el mismo volumen en metros cúbicos.' },
              { tipo: 'datos', texto: `El tanque guarda ${f(L, 0)} litros, y cada litro es un dm³.` },
              { tipo: 'regla', texto: 'En un volumen el factor va al cubo: un m³ es un cubo de 10 dm de lado.', ecuacion: ['1 m³ = (10 dm)³ = 1000 dm³ = 1000 L'] },
              { tipo: 'cuentas', texto: 'Se divide entre 1000.', ecuacion: [`${f(L, 0)} ÷ 1000 = ${f(L / 1000, 2)} m³`] },
              { tipo: 'sentido', texto: 'Un m³ es un cubo de 1 m de lado: un tanque cabe en uno o en pocos de esos.' },
            ],
            respuesta: `${f(L / 1000, 2)} m³`,
          };
        }
        if (tipo === 3) {
          const cm3 = r.de(BOTELLAS);
          return {
            enunciado: `Una botella tiene ${f(cm3, 0)} cm³ de gaseosa. ¿Cuántos litros son?`,
            datos: ['1 dm = 10 cm', '1 L = 1 dm³'],
            pasos: [
              { tipo: 'pide', texto: 'Piden el mismo volumen en litros.' },
              { tipo: 'datos', texto: `La botella tiene ${f(cm3, 0)} cm³, y un litro es un dm³.` },
              { tipo: 'regla', texto: 'En un volumen el factor va al cubo: un litro es un cubo de 10 cm de lado.', ecuacion: ['1 L = 1 dm³ = (10 cm)³ = 1000 cm³'] },
              { tipo: 'cuentas', texto: 'Se divide entre 1000.', ecuacion: [`${f(cm3, 0)} ÷ 1000 = ${f(cm3 / 1000, 3)} L`] },
              { tipo: 'sentido', texto: 'Una botella personal tiene menos de un litro: tiene sentido.' },
            ],
            respuesta: `${f(cm3 / 1000, 3)} L`,
          };
        }
        const m3 = r.de(BALDES);
        return {
          enunciado: `Un balde guarda ${f(m3, 3)} m³ de agua. ¿Cuántos cm³ son?`,
          datos: ['1 m = 100 cm'],
          pasos: [
            { tipo: 'pide', texto: 'Piden el mismo volumen en centímetros cúbicos.' },
            { tipo: 'datos', texto: `El balde guarda ${f(m3, 3)} m³.` },
            { tipo: 'regla', texto: 'En un volumen el factor va al cubo: 100 cm, tres veces.', ecuacion: ['1 m³ = (100 cm)³ = 1 000 000 cm³'] },
            { tipo: 'cuentas', texto: 'Se multiplica por un millón.', ecuacion: [`${f(m3, 3)} × 1 000 000 = ${f(m3 * 1e6, 0)} cm³`] },
            { tipo: 'sentido', texto: `${f(m3 * 1e6, 0)} cm³ son ${f(m3 * 1000, 0)} L: un balde de los de casa.` },
          ],
          respuesta: `${f(m3 * 1e6, 0)} cm³`,
        };
      },
    },
    ahoraTu: {
      generar(s) {
        // Otro tipo que el del ejemplo resuelto con la misma semilla (lector en frío, 16 nov: «es casi el mismo problema»).
        const r = azar(s), tipo = (s + 2) % 5;
        if (tipo === 0) {
          const ha = r.de(CHACRAS);
          return {
            pregunta: `Una chacra mide ${f(ha, 1)} hectáreas. ¿Cuántos m² son?`,
            datos: [HA],
            opciones: opciones(ha * 10000, [
              { id: 'cien', valor: ha * 100, error: 'CONV-CUADRADO', siFuera: 'Por 100 es un solo lado; la hectárea es 100 m por 100 m.' },
              { id: 'mil', valor: ha * 1000, error: 'CONV-CUADRADO', siFuera: 'Mil no sale de ningún lado: son 100 × 100 = 10 000.' },
              { id: 'inverso', valor: ha / 10000, error: 'CONV-INVERSO', siFuera: 'Dividir achica el número; el m² es más chico que la hectárea.' },
            ], x => `${fc(x)} m²`),
            solucion: { texto: 'Una hectárea son 100 m × 100 m.', ecuacion: [`${f(ha, 1)} × 10 000 = ${f(ha * 10000, 0)} m²`] },
          };
        }
        if (tipo === 1) {
          const m2 = r.de(PIZARRAS);
          return {
            pregunta: `Una pizarra tiene ${f(m2, 1)} m². ¿Cuántos cm² son?`,
            datos: ['1 m = 100 cm'],
            opciones: opciones(m2 * 10000, [
              { id: 'cien', valor: m2 * 100, error: 'CONV-CUADRADO', siFuera: 'Por 100 pasa un largo a cm; un área lleva el factor al cuadrado.' },
              { id: 'millon', valor: m2 * 1e6, error: 'CONV-CUBO', siFuera: 'Un millón es para m³; en un área el factor va dos veces.' },
              { id: 'inverso', valor: m2 / 10000, error: 'CONV-INVERSO', siFuera: 'Dividir achica el número; el cm² es más chico, el número sube.' },
            ], x => `${fc(x)} cm²`),
            solucion: { texto: 'El factor va al cuadrado: 100 × 100.', ecuacion: [`${f(m2, 1)} × 10 000 = ${f(m2 * 10000, 0)} cm²`] },
          };
        }
        if (tipo === 2) {
          const L = r.de(TANQUES);
          return {
            pregunta: `Un tanque de agua guarda ${f(L, 0)} L. ¿Cuántos m³ son?`,
            datos: ['1 m = 10 dm', '1 L = 1 dm³'],
            opciones: opciones(L / 1000, [
              { id: 'por', valor: L * 1000, error: 'CONV-INVERSO', siFuera: 'Multiplicar agranda el número; el m³ es mucho más grande que el litro.' },
              { id: 'cien', valor: L / 100, error: 'CONV-CUADRADO', siFuera: 'Entre 100 es el factor al cuadrado; un volumen lo lleva al cubo: 10 × 10 × 10 = 1000.' },
              { id: 'diez', valor: L / 10, error: 'CONV-UNO', siFuera: 'Entre 10 cambia un largo; un volumen lleva el factor tres veces.' },
            ], x => `${fc(x)} m³`),
            solucion: { texto: '1 m³ = (10 dm)³ = 1000 dm³ = 1000 L.', ecuacion: [`${f(L, 0)} ÷ 1000 = ${f(L / 1000, 2)} m³`] },
          };
        }
        if (tipo === 3) {
          const cm3 = r.de(BOTELLAS);
          return {
            pregunta: `Una botella tiene ${f(cm3, 0)} cm³. ¿Cuántos litros son?`,
            datos: ['1 dm = 10 cm', '1 L = 1 dm³'],
            opciones: opciones(cm3 / 1000, [
              { id: 'cien', valor: cm3 / 100, error: 'CONV-CUADRADO', siFuera: 'Entre 100 es el factor al cuadrado; un litro es (10 cm)³ = 1000 cm³.' },
              { id: 'por', valor: cm3 * 1000, error: 'CONV-INVERSO', siFuera: 'Multiplicar agranda el número; el litro es más grande que el cm³.' },
              { id: 'diez', valor: cm3 / 10, error: 'CONV-UNO', siFuera: 'Entre 10 cambia un largo; un volumen lleva el factor tres veces.' },
            ], x => `${fc(x)} L`),
            solucion: { texto: '1 L = 1 dm³ = (10 cm)³ = 1000 cm³.', ecuacion: [`${f(cm3, 0)} ÷ 1000 = ${f(cm3 / 1000, 3)} L`] },
          };
        }
        const m3 = r.de(BALDES);
        return {
          pregunta: `Un balde guarda ${f(m3, 3)} m³ de agua. ¿Cuántos cm³ son?`,
          datos: ['1 m = 100 cm'],
          opciones: opciones(m3 * 1e6, [
            { id: 'cien', valor: m3 * 100, error: 'CONV-UNO', siFuera: 'Por 100 pasa un largo; un volumen lleva el factor tres veces.' },
            { id: 'diezmil', valor: m3 * 10000, error: 'CONV-CUADRADO', siFuera: 'Por 10 000 es el factor al cuadrado, para un área; un volumen va al cubo.' },
            { id: 'inverso', valor: m3 / 1e6, error: 'CONV-INVERSO', siFuera: 'Dividir achica el número; el cm³ es más chico, el número sube.' },
          ], x => `${fc(x)} cm³`),
          solucion: { texto: 'El factor va al cubo: (100 cm)³ = 1 000 000 cm³.', ecuacion: [`${f(m3, 3)} × 1 000 000 = ${f(m3 * 1e6, 0)} cm³`] },
        };
      },
    },
  };

  // ---------- Idea 3: los dos lados de una fórmula tienen la misma dimensión ----------
  // Rehecha el 16 nov contra el contrato «se entiende sin profesor» (docs/plan-calidad.md): Gerson no entendió las
  // «fichas huecas que dividen» ni la lectura «L⁻² T⁻¹: sin nombre en el SI». Ahora es una balanza (pieza
  // fis-balanza-dim): a cada lado, de qué está hecho ese lado de una fórmula real, escrito en letras.
  // Cambia: la fórmula que se prueba · Permanece: la distancia d a la izquierda (L) ·
  // Progresa: cuáles cuadran · Se reserva: despejar la dimensión de una constante k · Debe verse: se opera como con letras.
  // Letras (17 nov): P es la presión y Pot, la potencia (una letra, un significado en la unidad).
  const DIM = { L: [0, 1, 0], T: [0, 0, 1], M: [1, 0, 0], v: [0, 1, -1], a: [0, 1, -2], F: [1, 1, -2], E: [1, 2, -2], Pot: [1, 2, -3], P: [1, -1, -2], area: [0, 2, 0] };
  const SUPS = { '-': '⁻', 0: '⁰', 1: '¹', 2: '²', 3: '³', 4: '⁴', 5: '⁵', 6: '⁶', 7: '⁷', 8: '⁸', 9: '⁹' };
  const dimTxt = e => {
    const ps = ['M', 'L', 'T'].map((x, i) => (e[i] ? (e[i] === 1 ? x : x + String(e[i]).split('').map(c => SUPS[c]).join('')) : '')).filter(Boolean);
    return ps.length ? ps.join(' ') : '1';
  };
  const suma = (a, b, n = 1) => a.map((x, i) => x + n * b[i]);
  // Fórmulas que alguien propone para la distancia d de una combi: la balanza dice cuáles pueden estar bien.
  const FORMULAS = {
    'v/t': { der: 'v / t', exps: [0, 1, -2], cuenta: 'L T⁻¹ ÷ T = L T⁻²' },
    'vt': { der: 'v · t', exps: [0, 1, 0], cuenta: 'L T⁻¹ × T = L' },
    'vt2': { der: 'v · t²', exps: [0, 1, 1], cuenta: 'L T⁻¹ × T² = L T' },
    'at': { der: 'a · t', exps: [0, 1, -1], cuenta: 'L T⁻² × T = L T⁻¹' },
    'at2': { der: '½ a · t²', exps: [0, 1, 0], cuenta: 'L T⁻² × T² = L' },
  };
  const balanzaD = f => ({ datos: { izq: { nombre: 'd', exps: DIM.L }, der: { nombre: FORMULAS[f].der, exps: FORMULAS[f].exps } }, estado: {} });
  const VISTAS_K = [
    { izq: { nombre: 'x', exps: DIM.L }, der: { nombre: 'k · t²', oculta: true } },
    { izq: { nombre: 'x', exps: DIM.L }, der: { nombre: 'k · t²', oculta: true } },
    { izq: { nombre: 'x', exps: DIM.L }, der: { nombre: 'k · t²', exps: DIM.L } },
  ];
  // Fórmulas con sumas: d, v, x distancias o rapideces; a aceleración; t tiempo (v₀, rapidez del inicio).
  const L1 = [0, 1, 0], V1 = [0, 1, -1], A1 = [0, 1, -2], V2 = [0, 2, -2];
  // `datos` dice qué es cada letra (va en el enunciado); `dat`, las unidades y las dimensiones de base que el alumno
  // necesita para deducir (contrato, punto 13: van en el recuadro «Datos», no en el enunciado).
  const BASE_DIM = 'Dimensiones de base: masa, M; longitud, L; tiempo, T';
  // Lo que el resuelto usa y hay que decir (lector en frío, 17 nov): los corchetes, el punto y la regla de los exponentes.
  const LEE_DIM = '[x] se lee «la dimensión de x»; a · b se lee «a por b»';
  const EXP_DIM = 'Exponentes: al multiplicar se suman (L × L² = L³); al dividir se restan (L³ ÷ L = L²)';
  const UN_VA = 'v se mide en m/s y a, en m/s²', UN_VV = 'v y v₀ se miden en m/s; a, en m/s²';
  // En los datos no va «un número como ½ no tiene dimensión»: descartaba la opción «el número suelto la rompe»
  // (auditoría, 17 nov). Es una regla de la idea (Lee, tarjeta 3), no un dato.
  const SUMAS = [
    { f: 'd = v·t + ½·a·t²', izq: ['d', L1], terminos: [['v·t', L1], ['½·a·t²', L1]], datos: 'd es una distancia, v una rapidez, a una aceleración y t un tiempo.', dat: [UN_VA, BASE_DIM, LEE_DIM] },
    { f: 'd = v·t + a·t', izq: ['d', L1], terminos: [['v·t', L1], ['a·t', V1]], datos: 'd es una distancia, v una rapidez, a una aceleración y t un tiempo.', dat: [UN_VA, BASE_DIM, LEE_DIM] },
    { f: 'v = v₀ + a·t', izq: ['v', V1], terminos: [['v₀', V1], ['a·t', V1]], datos: 'v y v₀ son rapideces, a una aceleración y t un tiempo.', dat: [UN_VV, BASE_DIM, LEE_DIM] },
    { f: 'v = v₀ + a·t²', izq: ['v', V1], terminos: [['v₀', V1], ['a·t²', L1]], datos: 'v y v₀ son rapideces, a una aceleración y t un tiempo.', dat: [UN_VV, BASE_DIM, LEE_DIM] },
    { f: 'v² = v₀² + 2·a·d', izq: ['v²', V2], terminos: [['v₀²', V2], ['2·a·d', V2]], datos: 'v y v₀ son rapideces, a una aceleración y d una distancia.', dat: [UN_VV, BASE_DIM, LEE_DIM] },
    { f: 'x = v·t + d/t', izq: ['x', L1], terminos: [['v·t', L1], ['d/t', V1]], datos: 'x y d son distancias, v una rapidez y t un tiempo.', dat: ['v se mide en m/s', BASE_DIM, LEE_DIM] },
  ];
  // Despejar k en Q = k · F o Q = k · F²: Q es la magnitud del lado izquierdo y F, la que multiplica a k.
  const MAGS = [['F', 'una fuerza', 'masa por aceleración'], ['E', 'una energía', 'fuerza por distancia'], ['Pot', 'una potencia', 'energía entre tiempo'], ['P', 'una presión', 'fuerza entre área']];
  const FACTORES = [['v', 'una rapidez', 'v'], ['a', 'una aceleración', 'a'], ['area', 'un área', 'S'], ['L', 'una longitud', 'x'], ['T', 'un tiempo', 't']];
  // Una pareja (Q, F) distinta de la que «Ahora tú» saca con la misma semilla (sus dos primeros azares: r.de(MAGS) y
  // r.de(FACTORES)).
  const PAREJAS = MAGS.flatMap(q => FACTORES.map(fa => [q, fa]));
  const otroPar = s => {
    const ra = azar(s), qi = Math.floor(ra() * MAGS.length), fi = Math.floor(ra() * FACTORES.length);
    const ia = qi * FACTORES.length + fi, ib = Math.floor(azar(s + 900)() * (PAREJAS.length - 1));
    return PAREJAS[(ia + 1 + ib) % PAREJAS.length];
  };
  // Ejemplos resueltos de «Análisis dimensional» (pestaña «Ejemplos», 16 nov): 3 niveles × 5, con el molde de
  // EJEMPLOS_UNIDADES. Colores: la dimensión de un dato, naranja (c-o); la que resulta, turquesa (c-i); la incógnita
  // (una constante o un exponente), roja (c-h), como la k de esta idea. Notación de la app: [v] = L T⁻¹.
  // Datos (contrato, punto 13): la fórmula, las unidades de lo que no se pide (g en m/s²) o su dimensión ([F] si no es
  // lo que se pide), las dimensiones de base, qué es [ ] y «·» y la regla de los exponentes. Nunca la dimensión que se
  // pide ni un paso hecho: el péndulo avisa que T es el período y L el largo, pero el alumno escribe [T] y [L].
  // Las figuras no dan el veredicto (17 nov): la balanza de «¿cuadra?» lleva los lados por calcular con «?».
  // El nivel 1 usa letras, no números que después no se usan (lector en frío, 17 nov: el adobe con sus medidas).
  // Exponentes recalculados con un script aparte, fuera del repo, como vectores (M, L, T), 17 nov:
  // v = (0,1,−1), A = (0,2,0), ρ = (1,−3,0), F = (1,1,−2), P = (1,−1,−2); v·t y ½·a·t² = (0,1,0); m·g·h = (1,2,−2);
  // m·v²/t = (1,2,−3) ≠ F = (1,1,−2), m·v/t = (1,1,−2); v², v₀² y 2·a·d = (0,2,−2); ρ·g = (1,−2,−2) ≠ P;
  // péndulo (T, L y g): x + y = 0, −2y = 1 → x = ½, y = −½; [A] = E/v² = M, [B] = E/P = L³;
  // [A/B] = (0,1,−2) − (0,1,−1) = T⁻¹; [G] = F·L²/M² = (−1,3,−2); aire: (1,−3+2x+y,−y) = (1,1,−2) → y = 2, x = 1.
  const dH = t => ({ v: 'c-h', t });
  // La balanza de un ejemplo: un lado sin exps se muestra con «?»; sin veredicto ni inclinación (planteamiento).
  const lado = (nombre, exps) => (exps ? { nombre, exps } : { nombre, oculta: true });
  const bal = (iz, ie, de, ee) => ({ pieza: 'fis-balanza-dim', datos: { izq: lado(iz, ie), der: lado(de, ee), sinVeredicto: true }, estado: {} });
  const EJEMPLOS_DIM = [
    { nivel: 1, titulo: 'La dimensión de una rapidez', figura: fo({ objeto: 'atleta', distancia: 'd', tiempo: 't' }),
      enunciado: ['Un corredor recorre una distancia d en un tiempo t. ¿Cuál es la dimensión de su rapidez v?'],
      datos: ['Rapidez: v = d / t (distancia entre tiempo)', BASE_DIM, LEE_DIM],
      solucion: [
        { texto: ['Una distancia es una longitud, L, y un tiempo es T.'], ecuacion: ['[d] = ', dO('L'), ',   [t] = ', dO('T')] },
        { texto: ['Se dividen las letras: L entre T se escribe L T⁻¹.'], ecuacion: ['[v] = ', { frac: [dO('L'), dO('T')] }, ' = ', dR('L T⁻¹')] },
      ],
      respuesta: ['[v] = ', dR('L T⁻¹'), ', en m/s o en km/h'] },
    { nivel: 1, titulo: 'La dimensión de un área', figura: fo({ objeto: 'terreno', largo: 'largo', ancho: 'ancho', texto: 'A' }),
      enunciado: ['Una chacra es un rectángulo. ¿Cuál es la dimensión de su área A?'],
      datos: ['Área de un rectángulo: A = largo × ancho', BASE_DIM, LEE_DIM],
      solucion: [
        { texto: ['Cada lado es una longitud: L.'] },
        { texto: ['Se multiplican las letras: L por L es L².'], ecuacion: ['[A] = ', dO('L'), ' × ', dO('L'), ' = ', dR('L²')] },
        { texto: ['Por eso un área va en m² o en hectáreas: siempre es una longitud al cuadrado.'] },
      ],
      respuesta: ['[A] = ', dR('L²')] },
    { nivel: 1, titulo: 'La dimensión de una densidad', figura: fo({ objeto: 'bloque', material: 'adobe', texto: 'masa m, volumen V' }),
      enunciado: ['Un adobe tiene una masa m y ocupa un volumen V. ¿Cuál es la dimensión de su densidad ρ?'],
      datos: ['Densidad: ρ = m / V (masa entre volumen)', 'Un volumen es largo × ancho × alto', BASE_DIM, LEE_DIM],
      solucion: [
        { texto: ['La masa es M. El volumen es largo por ancho por alto: L tres veces.'], ecuacion: ['[m] = ', dO('M'), ',   [V] = L × L × L = ', dO('L³')] },
        { texto: ['Dividir entre L³ se escribe L⁻³.'], ecuacion: ['[ρ] = ', { frac: [dO('M'), dO('L³')] }, ' = ', dR('M L⁻³')] },
      ],
      respuesta: ['[ρ] = ', dR('M L⁻³'), ', en kg/m³ o en g/cm³'] },
    { nivel: 1, titulo: 'La dimensión de una fuerza', figura: fo({ objeto: 'caja', masa: 'm', fuerza: 'F', aceleracion: 'a', color2: 'o' }),
      enunciado: ['Un estudiante empuja una caja de masa m y le da una aceleración a. ¿Cuál es la dimensión de la fuerza F?'],
      datos: ['Fuerza: F = m · a (masa por aceleración)', 'La aceleración a se mide en m/s²', BASE_DIM, LEE_DIM],
      solucion: [
        { texto: ['La aceleración va en m/s²: metros entre segundos al cuadrado, una longitud entre T².'], ecuacion: ['[a] = L ÷ T² = ', dO('L T⁻²')] },
        { texto: ['La masa es M. Se multiplican las letras.'], ecuacion: ['[F] = ', dO('M'), ' × ', dO('L T⁻²'), ' = ', dR('M L T⁻²')] },
      ],
      respuesta: ['[F] = ', dR('M L T⁻²'), '; en el SI, el newton'] },
    { nivel: 1, titulo: 'La dimensión de una presión', figura: fo({ objeto: 'presion', fuerza: 'F', area: 'A', texto: 'la presión P' }),
      enunciado: ['Una caja apoyada aprieta el piso con su peso, repartido en su base. ¿Cuál es la dimensión de la presión P que hace?'],
      datos: ['Presión: P = F / A (fuerza entre área)', '[F] = M L T⁻² (una fuerza)', '[A] = L² (un área)', EXP_DIM, LEE_DIM],
      solucion: [
        { texto: ['Se dividen las letras, como en una fracción.'], ecuacion: ['[P] = ', { frac: [dO('M L T⁻²'), dO('L²')] }] },
        { texto: ['L² está dividiendo: los exponentes de L se restan, 1 − 2 = −1. Las demás letras quedan igual.'], ecuacion: ['[P] = M L¹⁻² T⁻² = ', dR('M L⁻¹ T⁻²')] },
      ],
      respuesta: ['[P] = ', dR('M L⁻¹ T⁻²')] },
    { nivel: 2, titulo: '¿Cuadra la fórmula del MRUV?', figura: bal('v · t', null, '½ a t²', null),
      enunciado: ['¿Puede estar bien escrita d = v·t + ½·a·t²? Aquí d es una distancia, v una rapidez, a una aceleración y t un tiempo.'],
      datos: [UN_VA, BASE_DIM, LEE_DIM, EXP_DIM],
      solucion: [
        { texto: ['En una suma, cada término debe tener la dimensión del otro lado: [d] = L.'] },
        { texto: ['Primer término: T⁻¹ por T da T⁰, y T⁰ no se escribe.'], ecuacion: ['[v·t] = ', dO('L T⁻¹'), ' × ', dO('T'), ' = ', dR('L')] },
        { texto: ['Segundo término: el ½ es un número y no tiene dimensión.'], ecuacion: ['[½·a·t²] = ', dO('L T⁻²'), ' × ', dO('T²'), ' = ', dR('L')] },
      ],
      respuesta: [dR('Sí'), ': los dos términos son ', dR('L'), ', como d'] },
    { nivel: 2, titulo: 'La energía para subir agua', figura: fo({ objeto: 'tanque', texto: 'masa m', altura: 'h' }),
      enunciado: ['Para subir agua de masa m al tanque, a una altura h, hace falta la energía E = m·g·h, con g la aceleración de la gravedad. ¿Cuadran sus dos lados?'],
      datos: ['[E] = M L² T⁻² (una energía)', 'g se mide en m/s²', BASE_DIM, LEE_DIM, EXP_DIM],
      solucion: [
        { texto: ['Cada letra con su dimensión: m es una masa, g una aceleración y h una longitud.'], ecuacion: ['[m] = ', dO('M'), ',   [g] = ', dO('L T⁻²'), ',   [h] = ', dO('L')] },
        { texto: ['Se multiplican, y las L se juntan: L × L = L².'], ecuacion: ['[m·g·h] = M × L T⁻² × L = ', dR('M L² T⁻²')] },
      ],
      respuesta: [dR('Sí'), ': los dos lados son ', dR('M L² T⁻²')] },
    { nivel: 2, titulo: 'Una fuerza mal escrita', figura: bal('F', [1, 1, -2], 'm · v² / t', null),
      enunciado: ['Para la fuerza que frena una pelota, un compañero escribe F = m·v²/t, con m una masa, v una rapidez y t un tiempo. ¿Puede estar bien?'],
      datos: ['[F] = M L T⁻² (una fuerza)', 'v se mide en m/s', BASE_DIM, LEE_DIM, EXP_DIM],
      solucion: [
        { texto: ['La rapidez al cuadrado lleva su dimensión dos veces: los exponentes se duplican.'], ecuacion: ['[v²] = (L T⁻¹)² = ', dO('L² T⁻²')] },
        { texto: ['Por la masa y entre el tiempo: T⁻² entre T da T⁻³.'], ecuacion: ['[m·v²/t] = ', { frac: [['M × ', dO('L² T⁻²')], 'T'] }, ' = ', dR('M L² T⁻³')] },
        { texto: ['Se compara con la fuerza, M L T⁻²: le sobran una L y un T⁻¹. Los lados no cuadran.'] },
        { texto: ['Sin el cuadrado sí cuadra: m·v/t es masa por aceleración, M L T⁻².'] },
      ],
      respuesta: [dR('No'), ': da M L² T⁻³, no M L T⁻²'] },
    { nivel: 2, titulo: 'La rapidez al frenar', figura: bal('v²', null, '2 a d', null),
      enunciado: ['Una combi frena. ¿Puede estar bien escrita v² = v₀² + 2·a·d? Aquí v y v₀ son rapideces, a una aceleración y d una distancia.'],
      datos: [UN_VV, BASE_DIM, LEE_DIM, EXP_DIM],
      solucion: [
        { texto: ['A la izquierda hay una rapidez al cuadrado: el L T⁻¹ dos veces. v₀² es igual.'], ecuacion: ['[v²] = [v₀²] = (L T⁻¹)² = ', dO('L² T⁻²')] },
        { texto: ['El último término: el 2 es un número y no cuenta.'], ecuacion: ['[2·a·d] = ', dO('L T⁻²'), ' × ', dO('L'), ' = ', dR('L² T⁻²')] },
      ],
      respuesta: [dR('Sí'), ': los tres términos son ', dR('L² T⁻²')] },
    { nivel: 2, titulo: 'La presión en el fondo', figura: fo({ objeto: 'deposito', altura: 'h', texto: 'P', superficie: 'P₀' }),
      enunciado: ['Para la presión en el fondo de un tanque, alguien escribe P = P₀ + ρ·g. P y P₀ son presiones, ρ una densidad y g una aceleración. ¿Cuadra?'],
      datos: ['[P] = [P₀] = M L⁻¹ T⁻² (presiones)', 'ρ se mide en kg/m³', 'g se mide en m/s²', BASE_DIM, LEE_DIM],
      solucion: [
        { texto: ['Las presiones son M L⁻¹ T⁻². El otro término es densidad por aceleración:'], ecuacion: ['[ρ·g] = ', dO('M L⁻³'), ' × ', dO('L T⁻²'), ' = ', dR('M L⁻² T⁻²')] },
        { texto: ['L⁻² no es L⁻¹: ese término no es una presión y no se puede sumar.'] },
        { texto: ['Falta multiplicar por una longitud: la profundidad ', dO('h'), ' del dibujo. P = P₀ + ρ·g·', dO('h'), ' sí cuadra.'] },
      ],
      respuesta: [dR('No'), ': ρ·g no es una presión; falta la ', dO('h')] },
    { nivel: 3, titulo: 'Los exponentes del péndulo', figura: fo({ objeto: 'pendulo', largo: 'L', g: 'g', texto: 'T: el período, una ida y vuelta' }),
      enunciado: ['El período T de un péndulo, una ida y vuelta, depende de su largo L y de la gravedad g: T = k·', { sup: ['L', dH('x')] }, '·', { sup: ['g', dH('y')] }, ', con k un número. Halla ', dH('x'), ' e ', dH('y'), '.'],
      datos: ['Ojo: aquí T es el período y L, el largo del hilo; no los confundas con las dimensiones T y L', 'g se mide en m/s²', 'k es un número: no tiene dimensión', BASE_DIM, LEE_DIM, EXP_DIM],
      solucion: [
        { texto: ['Cada magnitud con M, L y T: el período es un tiempo y el largo, una longitud. El número k no cuenta.'], ecuacion: ['[T] = T,   [L] = L,   [g] = L T⁻²'] },
        { texto: ['Se reemplaza y se juntan los exponentes de cada letra: al multiplicar, se suman.'], ecuacion: ['T = ', { sup: ['L', dH('x')] }, ' · ', { sup: [{ par: 'L T⁻²' }, dH('y')] }, ' = ', { sup: ['L', [dH('x'), ' + ', dH('y')]] }, ' ', { sup: ['T', ['−2', dH('y')]] }] },
        { texto: ['A la izquierda no hay L, exponente 0, y la T tiene exponente 1.'], ecuacion: [dH('x'), ' + ', dH('y'), ' = 0,   −2', dH('y'), ' = 1   →   ', dH('y'), ' = ', dR('−½'), ',   ', dH('x'), ' = ', dR('½')] },
        { texto: ['El exponente ½ es una raíz cuadrada. Los libros escriben T = 2π·√(L/g): ahí k = 2π.'], ecuacion: ['T = k·', { raiz: 'L / g' }] },
      ],
      respuesta: [dH('x'), ' = ', dR('½'), ' e ', dH('y'), ' = ', dR('−½'), ': T = k·√(L/g)'] },
    { nivel: 3, titulo: 'Dos constantes en una suma', figura: bal('E', [1, 2, -2], 'A·v² + B·P', null),
      enunciado: ['En E = ', dH('A'), '·v² + ', dH('B'), '·P, E es una energía, v una rapidez y P una presión. ¿Qué dimensiones tienen ', dH('A'), ' y ', dH('B'), '?'],
      datos: ['[E] = M L² T⁻² (una energía)', '[P] = M L⁻¹ T⁻² (una presión)', 'v se mide en m/s', BASE_DIM, LEE_DIM, EXP_DIM],
      solucion: [
        { texto: ['Cada término de la suma debe ser una energía. Para despejar, se divide.'] },
        { texto: ['La rapidez va en m/s: [v] = L T⁻¹. Se divide entre [v²] = L² T⁻²:'], ecuacion: ['[', dH('A'), '] = ', { frac: ['M L² T⁻²', 'L² T⁻²'] }, ' = ', dR('M')] },
        { texto: ['Se divide entre [P] = M L⁻¹ T⁻²; las L se restan: 2 − (−1) = 3.'], ecuacion: ['[', dH('B'), '] = ', { frac: ['M L² T⁻²', 'M L⁻¹ T⁻²'] }, ' = ', dR('L³')] },
        { texto: [dH('A'), ' es una masa y ', dH('B'), ', un volumen.'] },
      ],
      respuesta: ['[', dH('A'), '] = ', dR('M'), ' y [', dH('B'), '] = ', dR('L³')] },
    { nivel: 3, titulo: 'El cociente de dos constantes', figura: bal('x', [0, 1, 0], 'A·t² + B·t', null),
      enunciado: ['La posición de una combi que arranca es x = ', dH('A'), '·t² + ', dH('B'), '·t, con x una distancia y t un tiempo. ¿Qué dimensión tiene ', dH('A'), ' / ', dH('B'), '?'],
      datos: [BASE_DIM, LEE_DIM, EXP_DIM],
      solucion: [
        { texto: ['Cada término debe ser una longitud, como x: L. Se despeja cada constante.'], ecuacion: ['[', dH('A'), '] = L ÷ T² = ', dO('L T⁻²'), ',   [', dH('B'), '] = L ÷ T = ', dO('L T⁻¹')] },
        { texto: ['Se dividen: las L se van y los exponentes de T se restan, −2 − (−1) = −1.'], ecuacion: ['[', dH('A'), ' / ', dH('B'), '] = ', { frac: [dO('L T⁻²'), dO('L T⁻¹')] }, ' = ', dR('T⁻¹')] },
      ],
      respuesta: ['[', dH('A'), ' / ', dH('B'), '] = ', dR('T⁻¹'), ': algo «por segundo»'] },
    { nivel: 3, titulo: 'La constante de la gravitación', figura: fo({ objeto: 'planetas', m1: 'm₁', m2: 'm₂', d: 'd', fuerza: 'F', color2: 'o' }),
      enunciado: ['Dos masas, m₁ y m₂, se atraen con la fuerza F = ', dH('G'), '·m₁·m₂ / d², donde d es la distancia entre ellas. ¿Qué dimensión tiene la constante ', dH('G'), '?'],
      datos: ['[F] = M L T⁻² (una fuerza)', BASE_DIM, LEE_DIM, EXP_DIM],
      solucion: [
        { texto: ['Se despeja ', dH('G'), ': pasa multiplicando lo que dividía y dividiendo lo que multiplicaba.'], ecuacion: [dH('G'), ' = ', { frac: ['F · d²', 'm₁ · m₂'] }] },
        { texto: ['Cada parte con M, L y T.'], ecuacion: ['[F] = ', dO('M L T⁻²'), ',   [d²] = ', dO('L²'), ',   [m₁ · m₂] = ', dO('M²')] },
        { texto: ['M² está dividiendo: sus exponentes se restan, 1 − 2 = −1. L² multiplica: se suman, 1 + 2 = 3.'], ecuacion: ['[', dH('G'), '] = ', { frac: ['M L T⁻² · L²', 'M²'] }, ' = ', dR('M⁻¹ L³ T⁻²')] },
      ],
      respuesta: ['[', dH('G'), '] = ', dR('M⁻¹ L³ T⁻²')] },
    { nivel: 3, titulo: 'El aire que frena una combi', figura: fo({ objeto: 'viento', v: 'v', fuerza: 'F', area: 'A: el frente', aire: 'aire, ρ', color2: 'o' }),
      enunciado: ['El aire frena a una combi con F = k·ρ·', { sup: ['A', dH('x')] }, '·', { sup: ['v', dH('y')] }, ': ρ es la densidad del aire, A el área del frente, v la rapidez y k un número. Halla ', dH('x'), ' e ', dH('y'), '.'],
      datos: ['[F] = M L T⁻² (una fuerza)', 'ρ se mide en kg/m³', 'A se mide en m² y v, en m/s', BASE_DIM, LEE_DIM, EXP_DIM],
      solucion: [
        { texto: ['Cada letra con M, L y T, leídas de sus unidades.'], ecuacion: ['[F] = M L T⁻²,   [ρ] = M L⁻³,   [A] = L²,   [v] = L T⁻¹'] },
        { texto: ['Se juntan los exponentes de cada letra del lado derecho: al multiplicar, se suman.'], ecuacion: ['M L T⁻² = M · ', { sup: ['L', ['−3 + 2', dH('x'), ' + ', dH('y')]] }, ' · ', { sup: ['T', ['−', dH('y')]] }] },
        { texto: ['La T da ', dH('y'), ' = 2. La L da −3 + 2', dH('x'), ' + 2 = 1, así que ', dH('x'), ' = 1.'], ecuacion: [dH('x'), ' = ', dR('1'), ',   ', dH('y'), ' = ', dR('2'), '   →   F = k·ρ·A·v²'] },
      ],
      respuesta: [dH('x'), ' = ', dR('1'), ' e ', dH('y'), ' = ', dR('2')] },
  ];

  const dimensiones = {
    id: 'homogeneidad',
    titulo: 'Análisis dimensional',
    pregunta: '¿Cómo sabes si una fórmula de física puede estar bien escrita?',
    temas: ['Análisis dimensional', 'Magnitudes fundamentales y derivadas'],
    pieza: 'fis-balanza-dim',
    lee: {
      tarjetas: [
        { titulo: 'Las letras de base', texto: 'Las magnitudes fundamentales, como la masa (M), la longitud (L) y el tiempo (T), son las letras con que se arman todas las demás.' },
        { titulo: 'De qué está hecha una magnitud', texto: 'La rapidez es una magnitud derivada: una longitud entre un tiempo. Su dimensión es L T⁻¹, tanto en m/s como en km/h.' },
        { titulo: 'Letras que se operan', texto: 'Las dimensiones se multiplican y se dividen como letras: L entre T es L T⁻¹, y T por T es T². Un número como ½ no tiene dimensión.' },
        { titulo: 'Qué mirar al jugar', texto: 'Vas a hacer análisis dimensional: poner fórmulas de una distancia en una balanza y mirar cuándo queda derecha.' },
      ],
    },
    actividad: 'Poner fórmulas en una balanza, un lado en cada platillo, y ver cuáles la dejan derecha.',
    ejemplos: EJEMPLOS_DIM,
    aprendizaje: 'Una fórmula solo puede estar bien si sus dos lados tienen la misma dimensión; las dimensiones se multiplican y dividen como letras.',
    juega: {
      consigna: 'Alguien anota fórmulas para la distancia d que recorre una combi. La balanza compara de qué está hecho cada lado.',
      mision: {
        texto: 'Encuentra la fórmula con aceleración que deja la balanza derecha.',
        logrado: val => val.f === 'at2',
        bien: 'Esa es: ½ a t² es una longitud, como d. El ½ no tiene dimensión.',
      },
      voz: '¿Qué fórmulas dejan la balanza derecha?',
      // En el Resumen, la balanza con d = v · t, la fórmula que trae el glosario (el inicio del juego, v / t, no cuadra y
      // ahí no se explica por qué: lector en frío, 16 nov).
      resumen: { f: 'vt' },
      leyenda: [
        { s: 'd', t: 'distancia: L' }, { s: 'v', t: 'rapidez: L T⁻¹' }, { s: 'a', t: 'aceleración: L T⁻²' }, { s: 't', t: 'tiempo: T' },
        { s: 'L', t: 'una longitud (metros)' }, { s: 'T', t: 'un tiempo (segundos)' }, { s: 'T⁻¹', t: '«entre un tiempo»: por segundo' },
        { s: '[ ]', t: '«la dimensión de»: [d] = L' }, { s: '·', t: '«por»: v · t es v por t' },
      ],
      controles: [
        { id: 'f', etiqueta: 'Fórmula', opciones: [
          { valor: 'v/t', texto: 'd = v / t' }, { valor: 'vt', texto: 'd = v · t' }, { valor: 'vt2', texto: 'd = v · t²' },
          { valor: 'at', texto: 'd = a · t' }, { valor: 'at2', texto: 'd = ½ a · t²' },
        ] },
      ],
      dibujo: val => balanzaD(val.f),
      lectura: val => [`[${FORMULAS[val.f].der}] = ${FORMULAS[val.f].cuenta}`],
      minimo: 3,
    },
    predice: {
      pregunta: ['En la fórmula x = ', k, ' · t², x es una distancia, t un tiempo y ', k, ' una constante. ¿Qué dimensión debe tener ', k, '?'],
      opciones: [
        { id: 'c', texto: 'L T⁻²', correcta: true },
        { id: 'igual', texto: 'L, igual que x', error: 'DIM-TERMINO', siFuera: 'L es lo que debe tener todo el lado k · t², no k sola: falta quitar el T².' },
        { id: 'inv', texto: 'L T², por el t²', error: 'DIM-INVERSA', siFuera: 'Sería cierto si x = k / t². Aquí k multiplica: debe quitar el T².' },
        { id: 'unidad', texto: 'Ninguna: k es solo un número', error: 'DIM-UNIDAD', siFuera: 'Si k fuera solo un número, el lado derecho sería T², un tiempo al cuadrado, y no una distancia.' },
      ],
      dibujo: { datos: VISTAS_K[0], estado: {} },
      revelar: { datos: VISTAS_K[2], estado: {} },
      coincide: 'Coincide: k = L T⁻² quita las dos T de t², y el lado derecho queda L.',
    },
    mira: {
      datos: { vistas: VISTAS_K },
      pasos: [
        { estado: { vista: 0 }, texto: 'A la izquierda, x es una distancia: su dimensión es L.', ecuacion: ['[x] = L'] },
        { estado: { vista: 0 }, texto: 't² es un tiempo por otro tiempo.', ecuacion: ['[t²] = T × T = T²'] },
        { estado: { vista: 1 }, texto: 'Para que quede L, k debe traer L y quitar T²: dividir entre T².', ecuacion: ['[', k, '] = L ÷ T² = L T⁻²'] },
        { estado: { vista: 2 }, texto: 'Con eso, la balanza queda derecha.', ecuacion: ['[', k, ' · t²] = L T⁻² × T² = L = [x]'] },
        { estado: { vista: 2 }, texto: 'L T⁻² es una aceleración: k puede ser algo como ½ a.', ecuacion: ['x = ½ a t²'] },
        { estado: { vista: 2 }, texto: 'Si hay una suma, cada término debe cuadrar por separado.', ecuacion: ['d = v t + ½ a t²:   [v t] = L,   [½ a t²] = L'] },
      ],
    },
    regla: {
      texto: 'Los dos lados de una fórmula de física tienen la misma dimensión, y en una suma, cada término también. Las dimensiones se multiplican y se dividen como letras.',
      ecuacion: ['[d] = [v · t] = [½ a · t²] = L'],
      condicion: 'cada término se escribe con M, L y T. Ojo: cuadrar no prueba la fórmula, porque un ½ no tiene dimensión.',
    },
    // Mismo tipo que «Ahora tú» con la misma semilla, pero otro caso (docs/teoria.md 4e; auditoría, 17 nov: había
    // enunciados iguales): `otro` evita la fórmula o la pareja de letras que «Ahora tú» saca con esa semilla.
    resuelve: {
      generar(s) {
        if (s % 3 === 2) {
          const S = otro(SUMAS, s);
          const malo = S.terminos.find(t => dimTxt(t[1]) !== dimTxt(S.izq[1]));
          return {
            enunciado: `¿Puede estar bien escrita la fórmula ${S.f}? ${S.datos}`,
            datos: S.dat,
            pasos: [
              { tipo: 'pide', texto: 'Piden revisar si la fórmula es homogénea: si todo cuadra.' },
              { tipo: 'datos', texto: `A la izquierda está ${S.izq[0]}: ${dimTxt(S.izq[1])}. A la derecha hay una suma de ${S.terminos.length} términos.` },
              { tipo: 'regla', texto: 'Solo se suman cosas de la misma dimensión: cada término debe tener la del otro lado.' },
              { tipo: 'cuentas', texto: 'Se revisa término por término.', ecuacion: [S.terminos.map(t => `[${t[0]}] = ${dimTxt(t[1])}`).join(',   ')] },
              { tipo: 'sentido', texto: malo ? `${malo[0]} es ${dimTxt(malo[1])} y no ${dimTxt(S.izq[1])}: no se puede sumar. La fórmula está mal.` : `Todos son ${dimTxt(S.izq[1])}, como ${S.izq[0]}: puede estar bien. Los números como ½ no cuentan.` },
            ],
            respuesta: malo ? `No: ${malo[0]} no cuadra` : 'Sí: cada término cuadra',
          };
        }
        const [Q, F] = otroPar(s);
        const n = (s % 2) + 1, kd = suma(DIM[Q[0]], DIM[F[0]], -n), letra = Q[0];
        const pot = n === 2 ? `${F[2]}²` : F[2], dp = DIM[F[0]].map(x => x * n);
        const bal = conK => ({ datos: { izq: { nombre: letra, exps: DIM[Q[0]] }, der: conK ? { nombre: `k · ${pot}`, exps: DIM[Q[0]] } : { nombre: `k · ${pot}`, oculta: true } }, estado: {} });
        return {
          enunciado: ['En ', `${letra} = `, k, ` · ${pot}`, `, ${letra} es ${Q[1]} y ${F[2]} es ${F[1]}. ¿Qué dimensión tiene `, k, '?'],
          datos: [`[${letra}] = ${dimTxt(DIM[Q[0]])} (${Q[1]})`, `[${F[2]}] = ${dimTxt(DIM[F[0]])} (${F[1]})`, LEE_DIM],
          dibujo: bal(false),
          pasos: [
            { tipo: 'pide', texto: ['Piden de qué está hecha ', k, ': su dimensión.'] },
            { tipo: 'datos', texto: `${letra} es ${Q[1]}: ${Q[2]}. ${pot} trae su dimensión ${n === 2 ? 'dos veces' : 'una vez'}.`, ecuacion: [`[${letra}] = ${dimTxt(DIM[Q[0]])}`, '  y  ', `[${pot}] = ${dimTxt(dp)}`] },
            { tipo: 'regla', texto: 'Los dos lados deben tener la misma dimensión. Para despejar, se divide.', ecuacion: ['[', k, `] = [${letra}] ÷ [${pot}]`] },
            { tipo: 'cuentas', texto: 'Se dividen las letras: se restan los exponentes, y lo que queda con 0 desaparece.', ecuacion: ['[', k, `] = ${dimTxt(DIM[Q[0]])} ÷ ${dimTxt(dp)} = ${dimTxt(kd)}`], dibujo: bal(true) },
            { tipo: 'sentido', texto: ['Comprueba: ', k, ` por ${pot} debe dar ${dimTxt(DIM[Q[0]])}. Da.`], ecuacion: [`${dimTxt(kd)} × ${dimTxt(dp)} = ${dimTxt(DIM[Q[0]])}`] },
          ],
          respuesta: ['[', k, `] = ${dimTxt(kd)}`],
        };
      },
    },
    ahoraTu: {
      generar(s) {
        const r = azar(s);
        if (s % 3 === 2) {
          const S = r.de(SUMAS), malo = S.terminos.find(t => dimTxt(t[1]) !== dimTxt(S.izq[1])), izq = dimTxt(S.izq[1]);
          return {
            pregunta: `${S.datos} ¿La fórmula ${S.f} puede estar bien escrita?`,
            datos: S.dat,
            opciones: malo ? [
              { id: 'c', texto: `No: ${malo[0]} no es ${izq}`, correcta: true },
              { id: 'uno', texto: 'Sí: el primer término ya cuadra', error: 'DIM-UNO', siFuera: 'En una suma cuadran todos o ninguno: no se suman metros con segundos.' },
              { id: 'suma', texto: 'Sí: en una suma, las dimensiones se suman', error: 'DIM-SUMA', siFuera: 'Las dimensiones no se suman: L + L sigue siendo L, y L + T no se puede.' },
            ] : [
              { id: 'c', texto: `Sí: cada término es ${izq}`, correcta: true },
              { id: 'suma', texto: `No: ${izq} + ${izq} da 2 ${izq}`, error: 'DIM-SUMA', siFuera: `Sumar dos ${izq} da otra ${izq}: dos distancias juntas siguen siendo distancia.` },
              { id: 'num', texto: 'No: el número suelto la rompe', error: 'DIM-NUMERO', siFuera: 'Los números como ½ o 2 no tienen dimensión: no cambian nada.' },
            ],
            solucion: { texto: 'Se revisa cada término por separado.', ecuacion: [S.terminos.map(t => `[${t[0]}] = ${dimTxt(t[1])}`).join(',   ')] },
          };
        }
        // Mismo orden de azar que antes (Q y después F): la pareja es la que `otro` evita en «Así se resuelve».
        const Q = r.de(MAGS), F = r.de(FACTORES);
        const n = (s % 2) + 1, kd = suma(DIM[Q[0]], DIM[F[0]], -n);
        const letra = Q[0];
        const pot = n === 2 ? `${F[2]}²` : F[2];
        const dp = DIM[F[0]].map(x => x * n);
        return {
          pregunta: ['En ', `${letra} = `, k, ` · ${pot}`, `, ${letra} es ${Q[1]} y ${F[2]} es ${F[1]}. ¿Qué dimensión tiene `, k, '?'],
          datos: [`[${letra}] = ${dimTxt(DIM[Q[0]])} (${Q[1]})`, `[${F[2]}] = ${dimTxt(DIM[F[0]])} (${F[1]})`, LEE_DIM],
          dibujo: { datos: { izq: { nombre: letra, exps: DIM[Q[0]] }, der: { nombre: `k · ${pot}`, oculta: true } }, estado: {} },
          opciones: opciones(dimTxt(kd), [
            { id: 'inv', valor: dimTxt(suma(DIM[Q[0]], DIM[F[0]], n)), error: 'DIM-INVERSA', siFuera: `Eso multiplica por ${pot}; para despejar k se divide.` },
            { id: 'igual', valor: dimTxt(DIM[Q[0]]), error: 'DIM-TERMINO', siFuera: `Esa es la dimensión de ${letra}; k es solo una parte del lado derecho.` },
            { id: 'solo', valor: dimTxt(DIM[F[0]].map(x => -x * n)), error: 'DIM-INVERSA', siFuera: `Eso quita ${pot}, pero olvida lo que trae ${letra}.` },
            { id: 'pot1', valor: dimTxt(suma(DIM[Q[0]], DIM[F[0]], -(3 - n))), error: 'DIM-EXPONENTE', siFuera: `Revisa el exponente: ${pot} trae su dimensión ${n === 2 ? 'dos veces' : 'una vez'}.` },
          ], x => x),
          solucion: {
            texto: `Se divide la dimensión de ${letra} entre la de ${pot}.`,
            ecuacion: ['[', k, `] = ${dimTxt(DIM[Q[0]])} ÷ ${dimTxt(dp)} = ${dimTxt(kd)}`],
            dibujo: { datos: { izq: { nombre: letra, exps: DIM[Q[0]] }, der: { nombre: `k · ${pot}`, exps: DIM[Q[0]] } }, estado: {} },
          },
        };
      },
    },
  };

  return {
    unidad: 'fisica.magnitudes-y-vectores',
    // Desde el 16 nov es «Magnitudes y unidades» (Gerson eligió partir la unidad); los vectores van en fisica/vectores.js.
    // El id no cambia: el avance de los alumnos se guarda con él.
    version: '0.4.0',
    estado: 'completa',
    // Pasó por el contrato «se entiende sin profesor» (16 nov): el validador exige misión, leyenda, aprendizaje, pregunta
    // y 3 ejemplos por término del glosario.
    calidad: 2,
    requiere: ['/nucleo/kit/piezas/fis-objeto.js', '/nucleo/kit/piezas/fis-medida.js', '/nucleo/kit/piezas/fis-combi.js', '/nucleo/kit/piezas/fis-area.js', '/nucleo/kit/piezas/fis-balanza-dim.js'],
    // Glosario del tema (docs/teoria.md, 4d): las palabras que esta unidad estrena en el curso (es la primera).
    glosario: [
      { termino: 'medir', formas: ['medir', 'mide', 'mides', 'medimos', 'medido'], simple: 'Contar cuántas veces cabe algo chico, que tomas de patrón, en algo grande.',
        def: 'Comparar algo con un patrón fijo y contar cuántas veces cabe en él.',
        ejemplos: ['El largo de una puerta con una wincha: cabe 2,1 veces el metro.', 'El patio a pasos: 30 pasos de largo.', 'Una clase con el reloj: 45 veces un minuto.'], ver: ['unidad', 'magnitud'] },
      { termino: 'unidad', formas: ['unidad', 'unidades'], simple: 'El pedazo con el que mides: un metro, un segundo, una cuchara.',
        def: 'Cantidad fija que se toma como patrón para medir, como el metro o el segundo.',
        ejemplos: ['El metro es la unidad de largo del SI.', 'El segundo es la unidad de tiempo.', 'La vara y el paso fueron unidades antiguas para medir largos.'], ver: ['medir', 'Sistema Internacional'] },
      { termino: 'factor de conversión', simple: 'La equivalencia que usas para cambiar de unidad, como 1 m = 100 cm.', formas: ['factor de conversión', 'factores de conversión', 'factor', 'factores'],
        def: 'Fracción que vale 1 y cambia la unidad: arriba y abajo dice lo mismo, como 100 cm sobre 1 m.',
        ejemplos: ['De m a cm: 100 cm sobre 1 m.', 'De horas a segundos: 3600 s sobre 1 h.', 'De m² a cm²: el de m a cm, al cuadrado, 10 000.'], ver: ['magnitud'] },
      { termino: 'área', simple: 'Cuántos cuadraditos caben en una superficie, como las losetas de un piso.', formas: ['área', 'áreas'], def: 'Cuánta superficie ocupa algo: cuántos cuadros de una medida caben en él.',
        ejemplos: ['El piso de un aula de 7 m por 8 m: 56 m².', 'Una cancha de fútbol: unos 7000 m².', 'Una hoja A4: unos 620 cm².'], ver: ['volumen', 'hectárea'] },
      { termino: 'volumen', simple: 'Cuántos cubitos caben dentro de algo, como el agua en un tanque.', formas: ['volumen', 'volúmenes'], def: 'Cuánto espacio ocupa algo: cuántos cubos de una medida caben dentro.',
        ejemplos: ['Un tanque de agua del techo: 1100 L, que es 1,1 m³.', 'Una botella personal: 500 cm³, medio litro.', 'Un cubo de 1 m de lado: 1 m³, que son 1000 L.'], ver: ['área', 'litro'] },
      { termino: 'hectárea', simple: 'Un terreno cuadrado de 100 m por lado: así se miden las chacras.', simbolo: 'ha', formas: ['hectárea', 'hectáreas'], def: 'Medida de terrenos: un cuadrado de 100 m de lado, o sea 10 000 m².',
        ejemplos: ['Una chacra de 2 ha mide 20 000 m².', 'Una cancha de fútbol ocupa unas tres cuartas partes de una hectárea.', 'Media hectárea son 5000 m².'], ver: ['área'] },
      { termino: 'litro', simple: 'Lo que cabe en una caja de 10 cm por lado.', simbolo: 'L', formas: ['litro', 'litros'], def: 'Medida de volumen: lo que cabe en un cubo de 10 cm de lado, 1 dm³.',
        ejemplos: ['Una botella grande de gaseosa: 3 L.', 'Un balde: unos 10 L.', '1000 L llenan un cubo de 1 m de lado.'], ver: ['volumen'] },
      { termino: 'magnitud', simple: 'Lo que se puede medir: el largo, el tiempo, la masa. La alegría, no.', def: 'Propiedad de algo que se puede medir y decir con un número y una unidad.',
        ejemplos: ['El largo de una mesa: 2,5 m, que también son 250 cm.', 'La temperatura de Juliaca una mañana de julio: unos −8 °C.', 'La masa de una pelota de fútbol: unos 0,43 kg.'], ver: ['magnitud fundamental', 'magnitud derivada'] },
      { termino: 'magnitud fundamental', simple: 'Las medidas de base, como largo, masa y tiempo; las demás salen de ellas.', formas: ['magnitud fundamental', 'magnitudes fundamentales'],
        def: 'Una de las siete que el SI toma como base, como la masa, la longitud y el tiempo.',
        ejemplos: ['La longitud se mide en metros y el tiempo, en segundos.', 'La masa de un saco de quinua se mide en kilogramos.', 'La corriente de un foco se mide en amperios, otra de las siete.'], ver: ['magnitud derivada', 'Sistema Internacional'] },
      { termino: 'magnitud derivada', formas: ['magnitud derivada', 'magnitudes derivadas'],
        def: 'La que se arma combinando las fundamentales, como la velocidad: longitud entre tiempo.',
        ejemplos: ['[F] = M L T⁻²: la fuerza sale de masa, longitud y tiempo.', 'La rapidez de una combi: metros entre segundos, m/s.', 'El área de un terreno: metro por metro, m².'], ver: ['magnitud fundamental', 'dimensión'] },
      { termino: 'Sistema Internacional', simbolo: 'SI', def: 'Acuerdo mundial de unidades: metro, kilogramo, segundo y otras cuatro de base.',
        ejemplos: ['72 km/h, en unidades del SI, son 20 m/s.', 'La masa va en kilogramos, no en libras ni en arrobas.', 'Un viaje de 2 h, en segundos del SI, son 7200 s.'], ver: ['magnitud fundamental'] },
      { termino: 'dimensión', simple: 'De qué está hecha una medida: de largo (L), tiempo (T) o masa (M).', simbolo: '[ ]', formas: ['dimensión', 'dimensiones'],
        def: 'Cómo se arma una magnitud con masa (M), longitud (L) y tiempo (T); no depende de la unidad elegida.',
        ejemplos: ['[v] = L T⁻¹, tanto en m/s como en km/h.', 'Un área tiene dimensión L², tanto en m² como en hectáreas.', 'La aceleración es L T⁻², tanto en m/s² como en km/h².'], ver: ['análisis dimensional'] },
      { termino: 'fórmula', formas: ['fórmula', 'fórmulas'], simple: 'Una receta con letras: d = v · t dice cómo sacar la distancia.',
        def: 'Igualdad con letras que dice cómo calcular una magnitud a partir de otras.',
        ejemplos: ['d = v · t: la distancia es rapidez por tiempo.', 'A = a · a: el área de un cuadrado de lado a.', 'F = m · a: la segunda ley de Newton.'], ver: ['dimensión', 'constante'] },
      { termino: 'constante', formas: ['constante', 'constantes'], simple: 'Un valor fijo de una fórmula; puede ser solo un número o traer unidades.',
        def: 'Valor fijo dentro de una fórmula; puede ser solo un número o traer dimensión.',
        ejemplos: ['En d = ½ a t², el ½ es solo un número: no tiene dimensión.', 'En x = k t², k tiene dimensión L T⁻².', 'La gravedad, g = 9,8 m/s², es una constante con unidades.'], ver: ['fórmula', 'dimensión'] },
      { termino: 'análisis dimensional', def: 'Comprobar con M, L y T que cada término de una ecuación tenga la misma dimensión, o despejar una.',
        ejemplos: ['Si x = k t², entonces [k] = L T⁻².', 'En d = v t los dos lados son L: la fórmula puede estar bien.', 'En v = d + t se suma longitud con tiempo: la fórmula está mal.'], ver: ['dimensión'] },
      { termino: 'masa', simbolo: 'm', medida: 'kg', def: 'Cuánta materia tiene un cuerpo. Es fundamental en el SI y no cambia de un lugar a otro.',
        ejemplos: ['Un saco de 5 kg tiene 5 kg en Lima y en la Luna.', 'Un estudiante de 60 kg sigue teniendo 60 kg en la cima del Misti.', 'Un litro de agua tiene una masa de 1 kg.'], ver: ['magnitud fundamental'] },
    ],
    historia: {
      texto: 'Durante siglos, cada pueblo midió con sus propios patrones: la vara, el paso, la arroba. En 1795, Francia creó el sistema métrico, con unidades que crecen de 10 en 10. En 1960 nació el Sistema Internacional, y desde 2019 sus unidades se definen con constantes de la naturaleza, como la rapidez de la luz: cualquiera, en cualquier país, puede reproducir el mismo metro.',
      pregunta: '¿Qué cambia cuando mides lo mismo en otra unidad?',
      fuente: { titulo: 'NIST — A Turning Point for Humanity: Redefining the World’s Measurement System', url: 'https://www.nist.gov/si-redefinition/turning-point-humanity-redefining-worlds-measurement-system' },
    },
    ideas: [unidades, areas, dimensiones],
  };
});
