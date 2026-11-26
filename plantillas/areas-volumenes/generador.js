/*
 * Generador «Áreas y volúmenes»: práctica de la idea 2 de «Magnitudes y unidades» (fisica.magnitudes-y-vectores;
 * contenido/teoria/fisica/magnitudes-y-vectores.js, idea «areas-volumenes»): en un área el factor va al cuadrado y en
 * un volumen, al cubo. Con hectáreas, litros y dm³, la densidad ρ = m / V y el caudal Q = V / t. Formato
 * "predicciones" (docs/arquitectura.md). Funciona en el navegador (window.Generadores['areas-volumenes']) y en Node
 * (require). No usa ningún motor: las cuentas son potencias de 10 exactas (por10) y productos.
 *
 * Tipos (nivel 1: un factor elevado; nivel 2: dos pasos o una fórmula; nivel 3: tipo examen):
 *   area      sub simple (1): m², dm², cm² y mm²; sub ha (1): hectáreas ↔ m²; sub titicaca (3): km² → ha, con el
 *             área real del lago; sub losetas (3): cuántas losetas cuadradas cubren un piso
 *   volumen   sub simple (1): m³, dm³, cm³ y litros; sub cubo (2): litros de una caja cúbica en dm;
 *             sub caja (2): litros de un acuario medido en cm
 *   densidad  sub conv (2): g/cm³ → kg/m³; sub masa (3): masa en kg de un bloque medido en cm;
 *             sub masa-m3 (3): masa en kg de un volumen en m³; sub volumen (3): litros que ocupa una masa
 *   caudal    sub caudal (2): L/s de un caño que llena un tanque en m³; sub tiempo (3): minutos para llenarlo;
 *             sub convertir (2): L/min → m³/h; sub lluvia (3): litros de lluvia sobre un techo
 *
 * Datos (docs/plan-calidad.md §3, punto 13, y docs/molde-unidad.md §4): la equivalencia de LARGO (1 m = 100 cm,
 * 1 m = 10 dm, 1 km = 1000 m), nunca la ya elevada (1 m² = 10 000 cm², 1 m³ = 1000 L): elevarla es lo que se
 * practica. Van además las definiciones (1 L = 1 dm³, la hectárea como un cuadrado de 100 m de lado, la lluvia como
 * una capa de agua) y la fórmula que se usa (A = largo × ancho, V = largo × ancho × alto, ρ = m / V, Q = V / t).
 * Dato del mundo: el área del lago Titicaca, 8372 km², con su fuente (ILEC) en el campo `fuente` del problema. Lo
 * demás, valores de todos los días con «unos» y sin fuente (aceite y hielo a unos 0,92 g/cm³, adobe a unos 1,7 g/cm³,
 * tanques de techo de 600 a 2500 L).
 * Colores: un color fijo por magnitud, el mismo de la teoría (docs/molde-unidad.md §5b; cabecera de
 * contenido/teoria/fisica/magnitudes-y-vectores.js): lo que te dan, naranja (o), también los dos datos de densidad o
 * caudal; el factor que vale 1, turquesa (i), siempre; lo que se pide y su resultado, violeta (f).
 * Errores (todos hipótesis: no hay estudio que mida cuántos postulantes los eligen):
 *   docs/investigacion/fisica-calculo-transversal-ideas-erroneas.md: U3-lineal (el factor sin elevar: 100 en vez de
 *     10 000), U3-cuadrado (en un volumen, el factor al cuadrado y no al cubo), U4-gramos (la masa en gramos donde
 *     va kg), U6-minutos (minutos donde van segundos), U2-mm (los mm de lluvia sin pasar a metros)
 *   docs/investigacion/unidades-ideas-erroneas.md: QU2-litro-como-100-cm3 (1 L = 100 cm³, o 1 m³ = 100 L)
 *   propios (los de la teoría de la unidad donde coinciden): CONV-INVERSO (multiplica en vez de dividir), CONV-PREFIJO
 *     (el factor de otro prefijo: 100 en vez de 1000, mm tomados como cm), CONV-CUBO
 *     (en un área, el factor al cubo), CONV-COMA (un cero de más o de menos), CONV-L-COMO-CM3 (cm³ donde van
 *     litros), CONV-UNIDAD-PEDIDA (el resultado en otra unidad que la pedida), CONV-BASE-100 (un minuto de 100 s),
 *     CONV-UNA-UNIDAD (cambia solo una unidad del caudal), AREA-PERIMETRO (usa el perímetro donde va el área),
 *     AREA-LADO (divide el área entre el lado de la loseta), VOL-SIN-ELEVAR (el lado en vez del volumen),
 *     VOL-POR-TRES (3 × lado en vez de lado³), VOL-AL-CUADRADO (lado²), VOL-SUMA (suma las medidas),
 *     DENS-DESPEJE (V / ρ o m · ρ: la fórmula despejada al revés), CAU-AL-REVES (t / V), CAU-DESPEJE (t = V · Q),
 *     HA-LADO (la hectárea como 100 m², sin elevar el lado), VOL-SUPERFICIE (el cartón de las seis caras en vez de lo
 *     que cabe dentro).
 * Escala: algunos errores (el factor al revés) dan hasta 10⁸ veces la correcta. Son los que se practican y no se
 * recortan (Gerson decide si se aplica el tope de 1000 de nucleo/probar-generador.js).
 * Cuentas comprobadas con un script aparte (casos.json, «verificacion») y con el recálculo de generador.test.js.
 */
(function (root, fabrica) {
  const nodo = typeof module === 'object' && module.exports;
  const api = fabrica(nodo ? require('../../nucleo/azar.js') : root.Azar,
                      nodo ? require('../../nucleo/predicciones.js') : root.Predicciones);
  if (nodo) module.exports = api;
  else (root.Generadores = root.Generadores || {})[api.id] = api;
})(typeof self !== 'undefined' ? self : this, function (Azar, P) {
  'use strict';
  const ID = 'areas-volumenes';
  const TRANS = 'docs/investigacion/fisica-calculo-transversal-ideas-erroneas.md';
  const UNIS = 'docs/investigacion/unidades-ideas-erroneas.md';
  const FUENTE_TITICACA = 'ILEC, World Lake Database, ficha del lago Titicaca (SAM-04): 8372 km² de superficie';
  const v = P.v;
  const h = (id, valor, explicacion, fuente = null) => ({ id, valor, explicacion, respaldo: 'hipotesis', fuente });

  // ---- Números ----
  const por10 = (x, k) => Number((x * 10 ** k).toPrecision(12));
  const limpio = x => Number(x.toPrecision(12));
  const f = (n, d = 2) => P.formatear(n, d).replace(/^(−?\d) (\d{3})(?=,|$)/, '$1$2');
  function num(x) {
    if (x === 0) return '0';
    const d = Math.max(0, Math.min(12, 3 - Math.floor(Math.log10(Math.abs(x)) + 1e-9)));
    return f(x, d);
  }
  const conU = u => x => `${num(x)} ${u}`;
  const cifra = k => f(10 ** Math.abs(k), 0);

  // ---- Datos (una línea cada uno) ----
  const LARGO = { 'm|cm': '1 m = 100 cm', 'm|dm': '1 m = 10 dm', 'dm|cm': '1 dm = 10 cm', 'cm|mm': '1 cm = 10 mm', 'km|m': '1 km = 1000 m', 'm|mm': '1 m = 1000 mm' };
  const LITRO = '1 L = 1 dm³ (un litro cabe en un cubo de 10 cm de lado)';
  const HA = '1 ha (hectárea): un cuadrado de 100 m de lado';
  const RECT = 'Área de un rectángulo: A = largo × ancho';
  const CUADRADO = 'Área de un cuadrado: A = lado × lado';
  const CAJA = 'Volumen de una caja: V = largo × ancho × alto';
  const CUBO = 'Volumen de un cubo: V = lado × lado × lado';
  const RHO = 'Densidad: ρ = m / V (masa entre volumen)';
  const Q = 'Caudal: Q = V / t (volumen entre tiempo)';
  const KG = '1 kg = 1000 g';

  const TIPOS = ['area', 'area', 'area', 'volumen', 'volumen', 'volumen', 'densidad', 'densidad', 'densidad', 'caudal', 'caudal', 'caudal'];

  // Papel (regla 6; herramientas/papel-generador.js usa las semillas «papel-1» a «papel-8» y rotula 3 básicos, 3
  // intermedios y 2 avanzados): recorre los tipos en orden de nivel, en vez de dejarlo al azar.
  const PAPEL = { 'papel-1': ['area', 'simple'], 'papel-2': ['volumen', 'simple'], 'papel-3': ['area', 'ha'], 'papel-4': ['volumen', 'caja'],
    'papel-5': ['densidad', 'conv'], 'papel-6': ['caudal', 'caudal'], 'papel-7': ['densidad', 'masa'], 'papel-8': ['caudal', 'lluvia'] };

  // Un tramo amarrado a una variable que el problema no tiene (el factor, en los problemas con dos datos) va sin color:
  // la app lo pintaría con el color por defecto, el naranja del dato.
  const sinVariableSuelta = (lineas, vars) => lineas.map(l => l.map(x => (x && typeof x === 'object' && !vars[x.v] ? x.t : x)));

  function generar(semilla) {
    const rng = Azar.crear(ID + '|' + semilla);
    const [tipo, sub] = PAPEL[String(semilla)] || [rng.elegir(TIPOS)];
    for (let intento = 0; intento < 200; intento++) {
      const pr = CONSTRUIR[tipo](rng, sub);
      const alternativas = P.armar({ correcta: pr.correcta, errores: pr.errores, rng, texto: pr.texto });
      if (alternativas.length >= 4) {
        const salida = {
          id: `${ID}#${semilla}`, variables: pr.variables, enunciado: pr.enunciado, pregunta: pr.pregunta, datos: pr.datos,
          alternativas, solucion: sinVariableSuelta(pr.solucion, pr.variables), respuesta: { valor: pr.correcta, unidad: pr.unidad }, _datos: pr._datos,
        };
        if (pr.fuente) salida.fuente = pr.fuente;
        return salida;
      }
    }
    throw new Error('No se pudo generar un problema con 4 alternativas distintas');
  }

  const VARS = (que, pide) => ({ d: { nombre: que, color: 'o' }, k: { nombre: 'factor que vale 1', color: 'i' }, x: { nombre: pide, color: 'f' } });
  // Con dos datos (densidad y volumen, caudal y tiempo), los dos van en naranja: son lo que te dan (un color fijo por
  // magnitud, molde §5b); el turquesa queda para el factor, como en la teoría.
  const VARS2 = (a, b, pide) => ({ a: { nombre: a, color: 'o' }, b: { nombre: b, color: 'o' }, k: { nombre: 'factor que vale 1', color: 'i' }, x: { nombre: pide, color: 'f' } });

  // ---- Áreas ----
  // Exponente del largo de cada unidad respecto del metro.
  const LIN = { km: 3, m: 0, dm: -1, cm: -2, mm: -3 };
  const NOM2 = { m: 'metros cuadrados (m²)', dm: 'decímetros cuadrados (dm²)', cm: 'centímetros cuadrados (cm²)', mm: 'milímetros cuadrados (mm²)' };
  const NOM3 = { m: 'metros cúbicos (m³)', dm: 'decímetros cúbicos (dm³)', cm: 'centímetros cúbicos (cm³)' };
  const AREAS = [
    { de: 'm', a: 'cm', xs: [1.8, 2.4, 3], pre: 'Una pizarra tiene ', pos: ' de superficie.' },
    { de: 'cm', a: 'm', xs: [900, 1600, 2500], pre: 'Una loseta cuadrada cubre ', pos: ' del piso.' },
    { de: 'cm', a: 'm', xs: [600], pre: 'La tapa de un cuaderno cubre unos ', pos: '.' },
    { de: 'm', a: 'dm', xs: [1.2, 1.5], pre: 'Una ventana tiene ', pos: ' de vidrio.' },
    { de: 'cm', a: 'mm', xs: [6, 8], pre: 'Una estampilla cubre ', pos: ' del sobre.' },
    { de: 'mm', a: 'cm', xs: [2.5, 4, 6], pre: 'El corte de un cable eléctrico de cobre tiene ', pos: ' de área.' },
  ];
  function area(rng, forzado) {
    const sub = forzado || rng.elegir(['simple', 'simple', 'simple', 'ha', 'ha', 'titicaca', 'losetas', 'losetas']);
    if (sub === 'simple') {
      const s = rng.elegir(AREAS), x = rng.elegir(s.xs);
      const kL = LIN[s.de] - LIN[s.a], kA = 2 * kL, sube = kL > 0;
      const correcta = por10(x, kA), F = cifra(kL), F2 = cifra(kA), op = sube ? '×' : '÷';
      const eq = LARGO[`${s.de}|${s.a}`] || LARGO[`${s.a}|${s.de}`];
      const ua = `${s.a}²`, ud = `${s.de}²`;
      const grande = s.de === 'm' || (s.de === 'cm' && s.a === 'mm');
      const unidad1 = `1 ${grande ? ud : ua}`, lado = `(${F} ${grande ? s.a : s.de})² = ${F2} ${grande ? ua : ud}`;
      return {
        variables: VARS(`el área en ${ud}`, `el área en ${ua}`),
        enunciado: [s.pre, v('d', `${num(x)} ${ud}`), s.pos],
        pregunta: ['¿Cuánto es en ', v('x', NOM2[s.a]), '?'],
        datos: [eq], correcta, texto: conU(ua), unidad: ua,
        errores: [
          h('U3-lineal', por10(x, kL), `Usaste el ${F} de ${eq}, pero sin elevarlo, y así sale ${num(por10(x, kL))}; un área es largo por ancho, así que el factor es ${F} × ${F} = ${F2}.`, TRANS),
          h('CONV-INVERSO', por10(x, -kA), `Usaste el ${F2}, pero al revés: ${num(x)} ${sube ? '÷' : '×'} ${F2} = ${num(por10(x, -kA))}. Como el ${ua} es más ${sube ? 'chico' : 'grande'} que el ${ud}, el número tiene que ${sube ? 'subir' : 'bajar'}.`),
          h('CONV-CUBO', por10(x, 3 * kL), `Elevar el ${F} estaba bien, pero al cubo se eleva para un volumen: ${F}³ = ${cifra(3 * kL)}. Un área lleva el factor solo dos veces.`),
          h('CONV-COMA', por10(x, kA - Math.sign(kL)), `La idea de ${sube ? 'multiplicar' : 'dividir'} es correcta, pero con un cero de menos sale ${num(por10(x, kA - Math.sign(kL)))}; el factor es ${F} × ${F} = ${F2}.`),
        ],
        solucion: [
          [`La equivalencia que dan es de largo, ${eq}, y un área es largo por ancho: el factor entra dos veces.`],
          [unidad1, ' = ', v('k', lado), '.'],
          [v('d', `${num(x)} ${ud}`), ` ${op} ${F2} = `, v('x', `${num(correcta)} ${ua}`), '.'],
        ],
        _datos: { tipo: 'area', sub, nivel: 1, x, de: ud, a: ua },
      };
    }
    if (sub === 'ha') {
      const aM2 = rng.moneda();
      if (aM2) {
        const x = rng.elegir([1.5, 2.5, 3]), correcta = por10(x, 4);
        return {
          variables: VARS('el área en hectáreas', 'el área en m²'),
          enunciado: ['Una chacra de quinua en Cabana mide ', v('d', `${num(x)} ha`), '.'],
          pregunta: ['¿Cuántos ', v('x', 'metros cuadrados (m²)'), ' son?'],
          datos: [HA, CUADRADO], correcta, texto: conU('m²'), unidad: 'm²',
          errores: [
            h('HA-LADO', por10(x, 2), `Usaste bien el lado de 100 m de la hectárea, pero sin elevarlo sale ${num(por10(x, 2))}; el área del cuadrado es 100 × 100.`),
            h('AREA-PERIMETRO', limpio(x * 400), `El cuadrado de 100 m de lado está bien, pero 4 × 100 = 400 es su perímetro, no su área, y así sale ${num(x * 400)}.`),
            h('CONV-INVERSO', por10(x, -4), `Usaste el 10 000, pero al revés: ${num(x)} ÷ 10 000 = ${num(por10(x, -4))}. Como el m² es más chico que la hectárea, el número sube.`),
            h('CONV-CUBO', por10(x, 6), `Elevar el 100 estaba bien, pero al cubo se eleva para un volumen: 100³ = 1 000 000. Un área es lado por lado.`),
          ],
          solucion: [
            ['Una hectárea es un cuadrado de 100 m de lado: ', v('k', '1 ha = 100 m × 100 m = 10 000 m²'), '.'],
            [v('d', `${num(x)} ha`), ' × 10 000 = ', v('x', `${num(correcta)} m²`), '.'],
          ],
          _datos: { tipo: 'area', sub, nivel: 1, x, de: 'ha', a: 'm²' },
        };
      }
      const x = rng.elegir([2500, 5000, 7500]), correcta = por10(x, -4);
      return {
        variables: VARS('el área en m²', 'el área en hectáreas'),
        enunciado: ['Un terreno en las afueras de Juliaca mide ', v('d', `${num(x)} m²`), '.'],
        pregunta: ['¿Cuántas ', v('x', 'hectáreas (ha)'), ' son?'],
        datos: [HA, CUADRADO], correcta, texto: conU('ha'), unidad: 'ha',
        errores: [
          h('HA-LADO', por10(x, -2), `Usaste bien el lado de 100 m, pero sin elevarlo sale ${num(por10(x, -2))}; una hectárea son 100 × 100 m².`),
          h('CONV-INVERSO', por10(x, 4), `Usaste el 10 000, pero al revés: ${num(x)} × 10 000 = ${num(por10(x, 4))}. Como la hectárea es más grande que el m², el número baja.`),
          h('CONV-COMA', por10(x, -3), `Dividir estaba bien, pero entre 1000 falta un cero y sale ${num(por10(x, -3))}; una hectárea son 100 × 100 = 10 000 m².`),
          h('AREA-PERIMETRO', limpio(x / 400), `El cuadrado de 100 m de lado está bien, pero 400 m es su perímetro, no su área, y así sale ${num(x / 400)}.`),
        ],
        solucion: [
          ['Una hectárea es un cuadrado de 100 m de lado: ', v('k', '1 ha = 100 m × 100 m = 10 000 m²'), '.'],
          [v('d', `${num(x)} m²`), ' ÷ 10 000 = ', v('x', `${num(correcta)} ha`), '.'],
        ],
        _datos: { tipo: 'area', sub, nivel: 1, x, de: 'm²', a: 'ha' },
      };
    }
    if (sub === 'titicaca') {
      const x = 8372, m2 = por10(x, 6), correcta = por10(x, 2);
      return {
        variables: VARS('el área en km²', 'el área en hectáreas'),
        enunciado: ['El lago Titicaca cubre unos ', v('d', `${num(x)} km²`), ', entre el Perú y Bolivia.'],
        pregunta: ['¿Cuántas ', v('x', 'hectáreas (ha)'), ' son?'],
        datos: [LARGO['km|m'], HA], correcta, texto: conU('ha'), unidad: 'ha', fuente: FUENTE_TITICACA,
        errores: [
          h('U3-lineal', por10(x, -1), `Dividir entre 10 000 al final estaba bien, pero no elevaste el factor del km²: 1 km² son 1000 × 1000 m², no 1000. Así sale ${num(por10(x, -1))}.`, TRANS),
          h('HA-LADO', por10(x, 4), `Pasaste bien 1 km² a 1 000 000 m², pero la hectárea no son 100 m²: es un cuadrado de 100 m de lado, 10 000 m². Así sale ${num(por10(x, 4))}.`),
          h('CONV-INVERSO', por10(x, -2), `Usaste el factor 100 entre km² y ha, pero al revés: ${num(x)} ÷ 100 = ${num(por10(x, -2))}. Como la hectárea es más chica, el número sube.`),
          h('CONV-COMA', por10(x, 3), `Elevar estaba bien, pero pusiste un cero de más: 1 km² son 100 ha, no 1000. Así sale ${num(por10(x, 3))}.`),
        ],
        solucion: [
          ['Primero se pasa el km² a m², elevando el 1000: ', v('k', '1 km² = (1000 m)² = 1 000 000 m²'), `, así que el lago cubre ${num(m2)} m².`],
          ['La hectárea es un cuadrado de 100 m de lado: ', v('k', '1 ha = 100 m × 100 m = 10 000 m²'), '.'],
          [`${num(m2)} m² ÷ 10 000 = `, v('x', `${num(correcta)} ha`), '. Es decir, 1 km² = 100 ha.'],
        ],
        _datos: { tipo: 'area', sub, nivel: 3, x, de: 'km²', a: 'ha' },
      };
    }
    // losetas: cuántas losetas cuadradas de lado L cm cubren un piso de a m × b m.
    const [a, b, L] = rng.elegir([[9, 6, 30], [10, 8, 50], [7.2, 6, 60], [6, 4.8, 40], [12, 9, 60]]);
    const Am = limpio(a * b), lm = L / 100, Al = limpio(lm * lm), correcta = Math.round(Am / Al);
    return {
      variables: VARS2('las medidas del piso', 'el lado de la loseta', 'cuántas losetas'),
      enunciado: ['El piso de un aula mide ', v('a', `${num(a)} m × ${num(b)} m`), '. Se cubre con losetas cuadradas de ', v('b', `${L} cm`), ' de lado.'],
      pregunta: ['¿', v('x', 'Cuántas losetas'), ' hacen falta?'],
      datos: [LARGO['m|cm'], RECT, CUADRADO], correcta, texto: x => num(x), unidad: '',
      errores: [
        h('CONV-COMA', limpio(Am / (lm * lm / 100)), `La idea de dividir las áreas es correcta, pero ${L} cm no son ${num(lm / 10)} m: la coma se corre dos lugares, ${num(lm)} m. Así sale ${num(Am / (lm * lm / 100))}.`),
        h('AREA-LADO', limpio(Am / lm), `El área del aula está bien, ${num(Am)} m², pero se divide entre el área de una loseta, no entre su lado: ${num(Am)} ÷ ${num(lm)} = ${num(Am / lm)}.`),
        h('U3-lineal', limpio(Am * 100 / (L * L)), `Las dos áreas están bien, pero ${num(Am)} m² no son ${num(Am * 100)} cm², porque 1 m² = 100 × 100 cm². Así sale ${num(Am * 100 / (L * L))}.`, TRANS),
        h('CONV-UNIDAD-PEDIDA', limpio(Am / (L * L)), `Dividir las áreas estaba bien, pero una está en m² y la otra en cm²: ${num(Am)} ÷ ${L * L} = ${num(Am / (L * L))}.`),
        h('AREA-PERIMETRO', limpio(2 * (a + b) / lm), `Pasaste bien el lado a ${num(lm)} m, pero ${num(2 * (a + b))} m es el borde del aula, y así se cuentan solo las losetas de la orilla: ${num(2 * (a + b) / lm)}.`),
      ],
      solucion: [
        ['Primero se pasa todo a metros: ', v('b', `${L} cm`), ` = ${num(lm)} m. El área de una loseta es ${num(lm)} m × ${num(lm)} m = ${num(Al)} m².`],
        ['El área del aula es ', v('a', `${num(a)} m × ${num(b)} m`), ` = ${num(Am)} m².`],
        [`${num(Am)} m² ÷ ${num(Al)} m² = `, v('x', num(correcta)), ` losetas (${num(a / lm)} a lo largo por ${num(b / lm)} a lo ancho).`],
      ],
      _datos: { tipo: 'area', sub, nivel: 3, a, b, L },
    };
  }

  // ---- Volúmenes ----
  // Exponente de 10 de cada unidad de volumen respecto del m³.
  const V3 = { 'm³': 0, L: -3, 'dm³': -3, 'cm³': -6 };
  const VOLS = [
    { de: 'm³', a: 'L', xs: [0.6, 1.1, 2.5], pre: 'Un tanque de agua del techo guarda ', pos: '.', dat: [LARGO['m|dm'], LITRO] },
    { de: 'L', a: 'm³', xs: [9000, 15000], pre: 'Un camión cisterna lleva unos ', pos: ' de agua para el barrio.', dat: [LARGO['m|dm'], LITRO] },
    { de: 'cm³', a: 'L', xs: [355, 625, 750], pre: 'Una botella tiene ', pos: ' de gaseosa.', dat: [LARGO['dm|cm'], LITRO] },
    { de: 'L', a: 'cm³', xs: [1.5, 2], pre: 'Una jarra tiene ', pos: ' de chicha morada.', dat: [LARGO['dm|cm'], LITRO] },
    { de: 'm³', a: 'cm³', xs: [0.05, 0.12], pre: 'Una caja de cartón tiene ', pos: ' de volumen.', dat: [LARGO['m|cm']] },
    { de: 'dm³', a: 'm³', xs: [20, 50], pre: 'Un bidón guarda ', pos: ' de agua.', dat: [LARGO['m|dm']] },
  ];
  const art = u => (u === 'L' ? 'El litro' : `El ${u}`);
  const NOMV = { 'm³': 'metros cúbicos (m³)', L: 'litros (L)', 'dm³': 'decímetros cúbicos (dm³)', 'cm³': 'centímetros cúbicos (cm³)' };
  function volumen(rng, forzado) {
    const sub = forzado || rng.elegir(['simple', 'simple', 'simple', 'simple', 'cubo', 'caja']);
    if (sub === 'simple') {
      const s = rng.elegir(VOLS), x = rng.elegir(s.xs);
      const k = V3[s.de] - V3[s.a], kL = k / 3, sube = k > 0;
      const correcta = por10(x, k), F = cifra(kL), F3 = cifra(k), op = sube ? '×' : '÷', opMal = sube ? '÷' : '×';
      const eq = s.dat[0];
      const conLitro = s.de === 'L' || s.a === 'L';
      const grande = sube ? s.de : s.a, chica = sube ? s.a : s.de;
      const errores = [
        h('U3-lineal', por10(x, kL), `Usaste el ${F} de ${eq}, pero sin elevarlo, y así sale ${num(por10(x, kL))}; un volumen es largo por ancho por alto, así que el factor es ${F} × ${F} × ${F} = ${F3}.`, TRANS),
        conLitro ? h('QU2-litro-como-100-cm3', por10(x, 2 * kL), `Elevar el ${F} estaba bien, pero solo lo elevaste al cuadrado: 1 ${grande} no son ${cifra(2 * kL)} ${chica}. Un volumen lleva el factor tres veces: ${F3}.`, UNIS)
          : h('U3-cuadrado', por10(x, 2 * kL), `Elevar el ${F} estaba bien, pero solo lo elevaste al cuadrado, y ${F}² = ${cifra(2 * kL)} sirve para un área. Un volumen lleva el factor tres veces: ${F3}.`, TRANS),
        h('CONV-INVERSO', por10(x, -k), `Usaste el ${F3}, pero al revés: ${num(x)} ${opMal} ${F3} = ${num(por10(x, -k))}. Como ${art(s.a).toLowerCase()} es más ${sube ? 'chico' : 'grande'} que ${art(s.de).toLowerCase()}, el número tiene que ${sube ? 'subir' : 'bajar'}.`),
      ];
      // Con litros, el error de elevar 100 cm en vez de 10 dm: salen cm³, no litros.
      if (s.de === 'm³' && s.a === 'L') errores.push(h('CONV-L-COMO-CM3', por10(x, 6), `Elevar al cubo estaba bien, pero lo hiciste con 100 cm: 1 m³ = 1 000 000 cm³ da centímetros cúbicos, y un litro es un dm³.`));
      else if (s.de === 'L' && s.a === 'm³') errores.push(h('CONV-L-COMO-CM3', por10(x, -6), `Elevar al cubo estaba bien, pero con 100 cm se pasa de cm³ a m³, no de litros. Un litro es un dm³: 1 m³ = 1000 L.`));
      else errores.push(h('CONV-COMA', por10(x, k - Math.sign(k)), `La idea de ${sube ? 'multiplicar' : 'dividir'} es correcta, pero con un cero de menos sale ${num(por10(x, k - Math.sign(k)))}; el factor es ${F} × ${F} × ${F} = ${F3}.`));
      const factor = conLitro
        ? (s.de === 'cm³' || s.a === 'cm³' ? '1 L = 1 dm³ = (10 cm)³ = 1000 cm³' : '1 m³ = (10 dm)³ = 1000 dm³ = 1000 L')
        : `1 ${grande} = (${F} ${chica.replace('³', '')})³ = ${F3} ${chica}`;
      return {
        variables: VARS(`el volumen en ${s.de}`, `el volumen en ${s.a}`),
        enunciado: [s.pre, v('d', `${num(x)} ${s.de}`), s.pos],
        pregunta: ['¿Cuánto es en ', v('x', NOMV[s.a]), '?'],
        datos: s.dat, correcta, texto: conU(s.a), unidad: s.a, errores,
        solucion: [
          [`La equivalencia que dan es de largo, ${eq}, y un volumen es largo por ancho por alto: el factor entra tres veces.`],
          [v('k', factor), '.'],
          [v('d', `${num(x)} ${s.de}`), ` ${op} ${F3} = `, v('x', `${num(correcta)} ${s.a}`), '.'],
        ],
        _datos: { tipo: 'volumen', sub, nivel: 1, x, de: s.de, a: s.a },
      };
    }
    if (sub === 'cubo') {
      const L = rng.elegir([3, 4, 5, 6]), correcta = L ** 3;
      return {
        variables: VARS('el lado de la caja', 'el volumen en litros'),
        enunciado: [rng.elegir(['Una caja cúbica de cartón mide ', 'Un tanque cúbico de plástico mide ', 'Una urna cúbica de vidrio mide ']), v('d', `${L} dm`), ' de lado.'],
        pregunta: ['¿Cuántos ', v('x', 'litros (L)'), ' le caben?'],
        datos: [CUBO, '1 L = 1 dm³ (un cubo de 1 dm de lado)'], correcta, texto: conU('L'), unidad: 'L',
        errores: [
          h('VOL-SIN-ELEVAR', L, `Es cierto que cada dm³ es un litro, pero ${L} dm es el lado, no el volumen: caben ${L} × ${L} × ${L} cubos de 1 dm.`),
          h('VOL-POR-TRES', 3 * L, `Es cierto que el lado va tres veces, pero se multiplica ${L} × ${L} × ${L}, no 3 × ${L} = ${3 * L}.`),
          h('VOL-AL-CUADRADO', L * L, `Multiplicar el lado estaba bien, pero ${L} × ${L} = ${L * L} es el área de una cara; falta multiplicar otra vez por ${L}, el alto.`),
          h('VOL-SUPERFICIE', 6 * L * L, `El área de una cara está bien, ${L * L} dm², pero 6 × ${L * L} = ${6 * L * L} dm² es el cartón de las seis caras, no lo que cabe dentro.`),
        ],
        solucion: [
          ['El volumen de un cubo es lado por lado por lado: ', v('d', `${L} dm`), ` × ${L} dm × ${L} dm = ${correcta} dm³.`],
          ['Cada dm³ es un litro, ', v('k', '1 L = 1 dm³'), ', así que caben ', v('x', `${correcta} L`), '.'],
        ],
        _datos: { tipo: 'volumen', sub, nivel: 2, L },
      };
    }
    // caja: un acuario en cm, en litros.
    const [l, a, al] = rng.elegir([[60, 30, 40], [50, 25, 30], [80, 40, 50], [40, 20, 25]]);
    const cm3 = l * a * al, correcta = cm3 / 1000;
    return {
      variables: VARS('las medidas del acuario', 'el volumen en litros'),
      enunciado: ['Un acuario mide ', v('d', `${l} cm × ${a} cm × ${al} cm`), ' por dentro.'],
      pregunta: ['¿Cuántos ', v('x', 'litros (L)'), ' de agua le caben?'],
      datos: [CAJA, LARGO['dm|cm'], LITRO], correcta, texto: conU('L'), unidad: 'L',
      errores: [
        h('QU2-litro-como-100-cm3', cm3 / 100, `El volumen está bien, ${num(cm3)} cm³, pero un litro no son 100 cm³: es un cubo de 10 cm de lado, 10 × 10 × 10 = 1000 cm³.`, UNIS),
        h('VOL-SUMA', l + a + al, `Las tres medidas están bien, pero el volumen se multiplica, no se suma: ${l} + ${a} + ${al} = ${l + a + al}.`),
        h('CONV-L-COMO-CM3', cm3 / 1e6, `El volumen está bien, pero al dividir entre 1 000 000 salen m³, no litros: un litro es un dm³, 1000 cm³.`),
        h('U3-lineal', cm3 / 10, `El volumen está bien, ${num(cm3)} cm³, pero usaste el 10 de 1 dm = 10 cm sin elevarlo al cubo, y un litro son 1000 cm³. Así sale ${num(cm3 / 10)}.`, TRANS),
        h('CONV-UNIDAD-PEDIDA', cm3, `El volumen está bien, ${num(cm3)} cm³, pero se piden litros: falta pasar los cm³ a litros.`),
      ],
      solucion: [
        ['El agua llena una caja, cuyo volumen es ', v('d', `${l} cm × ${a} cm × ${al} cm`), ` = ${num(cm3)} cm³.`],
        ['Un litro es un cubo de 10 cm de lado: ', v('k', '1 L = (10 cm)³ = 1000 cm³'), '.'],
        [`${num(cm3)} ÷ 1000 = `, v('x', `${num(correcta)} L`), '.'],
      ],
      _datos: { tipo: 'volumen', sub, nivel: 2, l, a, al },
    };
  }

  // ---- Densidad ----
  const del_ = t => t.replace(/^el /, 'del ').replace(/^la /, 'de la ');
  const MATERIALES = [
    { que: 'el aceite de cocina', rho: 0.92 }, { que: 'el hielo', rho: 0.92 }, { que: 'el aluminio', rho: 2.7 },
    { que: 'el hierro', rho: 7.9 }, { que: 'el vidrio', rho: 2.5 }, { que: 'el mercurio', rho: 13.6 },
    { que: 'el adobe', rho: 1.7 }, { que: 'la leche', rho: 1.03 },
  ];
  function densidad(rng, forzado) {
    const sub = forzado || rng.elegir(['conv', 'conv', 'masa', 'masa-m3', 'volumen']);
    if (sub === 'conv') {
      const M = rng.elegir(MATERIALES), rho = M.rho, correcta = limpio(rho * 1000);
      return {
        variables: VARS(`la densidad ${del_(M.que)} en g/cm³`, 'la densidad en kg/m³'),
        enunciado: [`La densidad ${del_(M.que)} es de unos `, v('d', `${num(rho)} g/cm³`), '.'],
        pregunta: ['¿Cuánto es en ', v('x', 'kilogramos por metro cúbico (kg/m³)'), '?'],
        datos: [RHO, KG, LARGO['m|cm']], correcta, texto: conU('kg/m³'), unidad: 'kg/m³',
        errores: [
          h('U3-cuadrado', limpio(rho * 10), `Pasaste bien los gramos a kg dividiendo entre 1000, pero elevaste el 100 solo al cuadrado: 1 m³ = 1 000 000 cm³, no 10 000. Así sale ${num(rho * 10)}.`, TRANS),
          h('U3-lineal', limpio(rho / 10), `Pasaste bien los gramos a kg, pero no elevaste el 100, y así sale ${num(rho / 10)}; un m³ es (100 cm)³ = 1 000 000 cm³.`, TRANS),
          h('CONV-INVERSO', limpio(rho / 1000), `Usaste los dos factores, pero los dos al revés: ${num(rho)} ÷ 1000 = ${num(rho / 1000)}, y un m³ guarda muchísimos gramos.`),
          h('U4-gramos', limpio(rho * 1e6), `Pasaste bien los cm³ a m³, con 1 000 000 cm³ en un m³, pero quedaron gramos, ${num(rho * 1e6)} g/m³: faltó pasar a kg.`, TRANS),
        ],
        solucion: [
          [`${num(rho)} g/cm³ dice cuántos gramos hay en cada cm³, y hay dos cambios: los g a kg y los cm³ a m³.`],
          ['La equivalencia de largo es 1 m = 100 cm, y en un volumen va al cubo: ', v('k', '1 m³ = (100 cm)³ = 1 000 000 cm³'), '.'],
          [v('d', `${num(rho)} g/cm³`), ' × ', v('k', '(1 kg / 1000 g)'), ' × ', v('k', '(1 000 000 cm³ / 1 m³)'), ' = ', v('x', `${num(correcta)} kg/m³`), '.'],
        ],
        _datos: { tipo: 'densidad', sub, nivel: 2, rho },
      };
    }
    if (sub === 'masa') {
      const c = rng.elegir([
        { que: 'Un adobe', dims: [40, 20, 12], rho: 1.7, mat: 'el adobe' },
        { que: 'Un adobe', dims: [38, 18, 10], rho: 1.7, mat: 'el adobe' },
        { que: 'Un ladrillo', dims: [24, 13, 9], rho: 1.8, mat: 'el ladrillo' },
        { que: 'Una barra de aluminio', dims: [50, 4, 2], rho: 2.7, mat: 'el aluminio' },
        { que: 'Un lingote de hierro', dims: [10, 5, 4], rho: 7.9, mat: 'el hierro' },
      ]);
      const V = c.dims[0] * c.dims[1] * c.dims[2], g = limpio(V * c.rho), correcta = limpio(g / 1000);
      const med = c.dims.map(x => `${x} cm`).join(' × ');
      return {
        variables: VARS2('las medidas del bloque', 'la densidad', 'la masa en kg'),
        enunciado: [`${c.que} mide `, v('a', med), `. La densidad ${del_(c.mat)} es de unos `, v('b', `${num(c.rho)} g/cm³`), '.'],
        pregunta: ['¿Cuál es su ', v('x', 'masa en kilogramos (kg)'), '?'],
        datos: [CAJA, RHO, KG], correcta, texto: conU('kg'), unidad: 'kg',
        errores: [
          h('U4-gramos', g, `Calculaste bien m = ρ × V = ${num(g)}, pero eso está en gramos y se piden kilogramos: falta dividir entre 1000.`, TRANS),
          h('DENS-DESPEJE', limpio(V / c.rho / 1000), `El volumen está bien, ${num(V)} cm³, pero de ρ = m / V sale m = ρ × V, no V ÷ ρ. Así sale ${num(V / c.rho / 1000)}.`),
          h('CONV-PREFIJO', limpio(g / 100), `La masa está bien, m = ${num(g)} g, pero dividir entre 100 no da kilogramos, porque 1 kg = 1000 g. Así sale ${num(g / 100)}.`),
          h('CONV-COMA', limpio(g / 10000), `La masa está bien, m = ${num(g)} g, pero al pasar a kg corriste la coma un lugar de más y salió ${num(g / 10000)}.`),
        ],
        solucion: [
          ['Primero se calcula el volumen: ', v('a', med), ` = ${num(V)} cm³.`],
          ['De ρ = m / V sale m = ρ × V: ', v('b', `${num(c.rho)} g/cm³`), ` × ${num(V)} cm³ = ${num(g)} g (los cm³ se tachan).`],
          ['Al final se pasa a kilogramos: ', `${num(g)} g × `, v('k', '(1 kg / 1000 g)'), ' = ', v('x', `${num(correcta)} kg`), '.'],
        ],
        _datos: { tipo: 'densidad', sub, nivel: 3, dims: c.dims, rho: c.rho },
      };
    }
    if (sub === 'masa-m3') {
      const c = rng.elegir([
        { pre: 'Un tanque del techo tiene ', V: 1.1, mat: 'agua', rho: 1, frase: 'La densidad del agua es de ' },
        { pre: 'Un tanque del techo tiene ', V: 0.6, mat: 'agua', rho: 1, frase: 'La densidad del agua es de ' },
        { pre: 'Un bloque de hielo tiene ', V: 0.2, mat: 'hielo', rho: 0.92, frase: 'La densidad del hielo es de unos ' },
        { pre: 'Un cilindro de la fábrica tiene ', V: 0.2, mat: 'aceite', rho: 0.92, frase: 'La densidad del aceite es de unos ' },
      ]);
      const rhoSI = limpio(c.rho * 1000), correcta = limpio(rhoSI * c.V);
      return {
        variables: VARS2('el volumen', 'la densidad', 'la masa en kg'),
        enunciado: [c.pre, v('a', `${num(c.V)} m³`), ` de ${c.mat}. ${c.frase}`, v('b', `${num(c.rho)} g/cm³`), '.'],
        pregunta: ['¿Cuál es la ', v('x', 'masa en kilogramos (kg)'), ` del ${c.mat}?`],
        datos: [RHO, KG, LARGO['m|cm']], correcta, texto: conU('kg'), unidad: 'kg',
        errores: [
          h('U3-cuadrado', limpio(c.rho * 10 * c.V), `La fórmula m = ρ × V está bien, pero elevaste el 100 solo al cuadrado, y así ρ queda en ${num(c.rho * 10)} kg/m³ y no en ${num(rhoSI)}. Sale ${num(c.rho * 10 * c.V)}.`, TRANS),
          h('U4-gramos', limpio(c.rho * 1e6 * c.V), `Pasaste bien los cm³ a m³, pero quedaron gramos, ${num(c.rho * 1e6 * c.V)} g: faltó pasar a kilogramos.`, TRANS),
          h('DENS-DESPEJE', limpio(c.V / rhoSI), `La densidad está bien, ρ = ${num(rhoSI)} kg/m³, pero de ρ = m / V sale m = ρ × V, no V ÷ ρ, que da ${num(c.V / rhoSI)}.`),
          h('CONV-UNIDAD-PEDIDA', limpio(c.rho * c.V), `La fórmula m = ρ × V está bien, pero ρ está en g/cm³ y V en m³: hay que cambiar una antes de multiplicar. Así sale ${num(c.rho * c.V)}.`),
        ],
        solucion: [
          ['Primero se pasa la densidad a kg/m³, con 1 kg = 1000 g y ', v('k', '1 m³ = (100 cm)³ = 1 000 000 cm³'), ':'],
          [v('b', `${num(c.rho)} g/cm³`), ` × 1 000 000 ÷ 1000 = ${num(rhoSI)} kg/m³.`],
          ['De ρ = m / V sale m = ρ × V: ', `${num(rhoSI)} kg/m³ × `, v('a', `${num(c.V)} m³`), ' = ', v('x', `${num(correcta)} kg`), '.'],
        ],
        _datos: { tipo: 'densidad', sub, nivel: 3, V: c.V, rho: c.rho },
      };
    }
    // volumen: los litros que ocupa una masa.
    const c = rng.elegir([
      { m: 4.6, rho: 0.92, que: 'aceite', pre: 'Un bidón tiene ' }, { m: 13.8, rho: 0.92, que: 'aceite', pre: 'Una lata grande tiene ' },
      { m: 18.4, rho: 0.92, que: 'aceite', pre: 'Un balde tiene ' }, { m: 15.45, rho: 1.03, que: 'leche', pre: 'Un porongo tiene ' },
      { m: 6.8, rho: 13.6, que: 'mercurio', pre: 'Un frasco de laboratorio tiene ' },
    ]);
    const g = por10(c.m, 3), cm3 = limpio(g / c.rho), correcta = limpio(cm3 / 1000);
    return {
      variables: VARS2('la masa', 'la densidad', 'el volumen en litros'),
      enunciado: [c.pre, v('a', `${num(c.m)} kg`), ` de ${c.que}. La densidad del ${c.que} es de unos `, v('b', `${num(c.rho)} g/cm³`), '.'],
      pregunta: ['¿Cuántos ', v('x', 'litros (L)'), ` de ${c.que} son?`],
      datos: [RHO, KG, LARGO['dm|cm'], LITRO], correcta, texto: conU('L'), unidad: 'L',
      errores: [
        h('DENS-DESPEJE', limpio(c.m * c.rho), `Pasar a gramos estaba bien, pero de ρ = m / V sale V = m ÷ ρ, no m × ρ, que da ${num(c.m * c.rho)}.`),
        h('QU2-litro-como-100-cm3', limpio(cm3 / 100), `El volumen está bien, V = ${num(cm3)} cm³, pero un litro no son 100 cm³: son (10 cm)³ = 1000 cm³. Así sale ${num(cm3 / 100)}.`, UNIS),
        h('U4-gramos', limpio(c.m / c.rho / 1000), `La fórmula V = m ÷ ρ está bien, pero la masa está en kg y la densidad en g/cm³, así que ${num(c.m)} ÷ ${num(c.rho)} mezcla unidades. Sale ${num(c.m / c.rho / 1000)}.`, TRANS),
        h('CONV-UNIDAD-PEDIDA', cm3, `El volumen está bien, V = ${num(cm3)} cm³, pero se piden litros: falta dividir entre 1000.`),
      ],
      solucion: [
        ['Primero se pasa la masa a gramos, como en la densidad: ', v('a', `${num(c.m)} kg`), ` = ${num(g)} g.`],
        ['De ρ = m / V sale V = m ÷ ρ: ', `${num(g)} g ÷ `, v('b', `${num(c.rho)} g/cm³`), ` = ${num(cm3)} cm³.`],
        ['Un litro es un cubo de 10 cm de lado: ', v('k', '1 L = (10 cm)³ = 1000 cm³'), `. ${num(cm3)} ÷ 1000 = `, v('x', `${num(correcta)} L`), '.'],
      ],
      _datos: { tipo: 'densidad', sub, nivel: 3, m: c.m, rho: c.rho },
    };
  }

  // ---- Caudal y lluvia ----
  function caudal(rng, forzado) {
    const sub = forzado || rng.elegir(['caudal', 'caudal', 'tiempo', 'convertir', 'lluvia', 'lluvia']);
    if (sub === 'caudal') {
      const V = rng.elegir([0.6, 1.1, 2.5]), t = rng.elegir([20, 25, 40, 50]);
      const L = por10(V, 3), s = t * 60, correcta = limpio(L / s);
      return {
        variables: VARS2('el volumen del tanque', 'el tiempo', 'el caudal en L/s'),
        enunciado: ['Un caño llena un tanque de ', v('a', `${num(V)} m³`), ' en ', v('b', `${t} min`), '.'],
        pregunta: ['¿Cuál es su caudal en ', v('x', 'litros por segundo (L/s)'), '?'],
        datos: [Q, LARGO['m|dm'], LITRO, '1 min = 60 s'], correcta, texto: conU('L/s'), unidad: 'L/s',
        errores: [
          h('U6-minutos', limpio(L / t), `La fórmula Q = V / t con ${num(L)} L está bien, pero dividiste entre minutos, y ${num(L / t)} son litros por minuto.`, TRANS),
          h('QU2-litro-como-100-cm3', limpio(V * 100 / s), `La fórmula Q = V / t está bien, pero 1 m³ no son 100 L: un m³ es (10 dm)³ = 1000 dm³ = 1000 L. Así sale ${num(V * 100 / s)}.`, UNIS),
          h('CAU-AL-REVES', limpio(s / L), `Pasaste bien a litros y segundos, pero el caudal es volumen entre tiempo, no tiempo entre volumen, que da ${num(s / L)}.`),
          h('CONV-BASE-100', limpio(L / (t * 100)), `La fórmula Q = V / t está bien, pero un minuto tiene 60 s, no 100: ${num(L)} ÷ ${num(t * 100)} = ${num(L / (t * 100))}.`),
          h('CONV-UNIDAD-PEDIDA', limpio(V / s), `Dividir entre ${s} s estaba bien, pero ${num(V / s)} son m³ por segundo: falta pasar a litros.`),
        ],
        solucion: [
          ['Primero se pasa el volumen a litros: ', v('k', '1 m³ = (10 dm)³ = 1000 dm³ = 1000 L'), '; ', v('a', `${num(V)} m³`), ` = ${num(L)} L.`],
          ['Luego se pasa el tiempo a segundos: ', v('b', `${t} min`), ` = ${t} × 60 = ${s} s.`],
          ['Q = V / t = ', `${num(L)} L ÷ ${s} s = `, v('x', `${num(correcta)} L/s`), '.'],
        ],
        _datos: { tipo: 'caudal', sub, nivel: 2, V, t },
      };
    }
    if (sub === 'tiempo') {
      const q = rng.elegir([0.2, 0.25, 0.5]), V = rng.elegir([0.6, 1.2, 1.5]);
      const L = por10(V, 3), s = limpio(L / q), correcta = limpio(s / 60);
      return {
        variables: VARS2('el caudal', 'el volumen del tanque', 'el tiempo en minutos'),
        enunciado: ['De un caño salen ', v('a', `${num(q)} L/s`), '. Se quiere llenar un tanque de ', v('b', `${num(V)} m³`), '.'],
        pregunta: ['¿Cuántos ', v('x', 'minutos (min)'), ' tarda en llenarse?'],
        datos: [Q, LARGO['m|dm'], LITRO, '1 min = 60 s'], correcta, texto: conU('min'), unidad: 'min',
        errores: [
          h('CONV-UNIDAD-PEDIDA', s, `Calculaste bien t = V ÷ Q = ${num(s)}, pero eso está en segundos y se piden minutos: falta dividir entre 60.`),
          h('QU2-litro-como-100-cm3', limpio(V * 100 / q / 60), `La fórmula t = V ÷ Q está bien, pero 1 m³ no son 100 L: son (10 dm)³ = 1000 L. Así sale ${num(V * 100 / q / 60)}.`, UNIS),
          h('CAU-DESPEJE', limpio(L * q / 60), `Pasar a litros estaba bien, pero de Q = V / t sale t = V ÷ Q, no V × Q, que da ${num(L * q / 60)}.`),
          h('CONV-BASE-100', limpio(s / 100), `El tiempo está bien, t = ${num(s)} s, pero un minuto tiene 60 s, no 100, y así sale ${num(s / 100)}.`),
          h('CONV-L-COMO-CM3', limpio(V / q / 60), `La fórmula t = V ÷ Q está bien, pero el volumen está en m³ y el caudal en L/s, y ${num(V)} m³ no son ${num(V)} L. Así sale ${num(V / q / 60)}.`),
        ],
        solucion: [
          ['Primero se pasa el volumen a litros: ', v('k', '1 m³ = (10 dm)³ = 1000 L'), '; ', v('b', `${num(V)} m³`), ` = ${num(L)} L.`],
          ['De Q = V / t sale t = V ÷ Q: ', `${num(L)} L ÷ `, v('a', `${num(q)} L/s`), ` = ${num(s)} s.`],
          [`Al final se pasa a minutos: ${num(s)} ÷ 60 = `, v('x', `${num(correcta)} min`), '.'],
        ],
        _datos: { tipo: 'caudal', sub, nivel: 3, q, V },
      };
    }
    if (sub === 'convertir') {
      const x = rng.elegir([8, 15, 20, 25]), correcta = limpio(x * 60 / 1000);
      return {
        variables: VARS('el caudal en L/min', 'el caudal en m³/h'),
        enunciado: ['De un caño del patio salen ', v('d', `${x} L/min`), ' de agua.'],
        pregunta: ['¿Cuánto es en ', v('x', 'metros cúbicos por hora (m³/h)'), '?'],
        datos: [LARGO['m|dm'], LITRO, '1 h = 60 min'], correcta, texto: conU('m³/h'), unidad: 'm³/h',
        errores: [
          h('QU2-litro-como-100-cm3', limpio(x * 60 / 100), `Multiplicar por los 60 min de la hora estaba bien, pero 1 m³ no son 100 L: son (10 dm)³ = 1000 L. Así sale ${num(x * 60 / 100)}.`, UNIS),
          h('CONV-UNA-UNIDAD', x * 60, `Multiplicar por los 60 min de una hora estaba bien, pero ${num(x * 60)} son litros por hora: falta pasar los litros a m³.`),
          h('CONV-UNA-UNIDAD', limpio(x / 1000), `Pasaste bien ${x} L a ${num(x / 1000)} m³, pero esos son m³ por minuto: falta pasar el minuto a horas.`),
          h('CONV-INVERSO', limpio(x * 1000 / 60), `Usaste los dos factores, pero los dos al revés: ${x} × 1000 ÷ 60 = ${num(x * 1000 / 60)}.`),
          h('U3-lineal', limpio(x * 60 / 10), `Multiplicar por 60 estaba bien, pero usaste el 10 de 1 m = 10 dm sin elevarlo al cubo, y un m³ son 1000 L. Así sale ${num(x * 60 / 10)}.`, TRANS),
        ],
        solucion: [
          ['Hay dos cambios de unidad: los litros a m³ y los minutos a horas.'],
          ['Un m³ es (10 dm)³ = 1000 dm³, así que ', v('k', '1 m³ = 1000 L'), '.'],
          [v('d', `${x} L/min`), ' × ', v('k', '(1 m³ / 1000 L)'), ' × ', v('k', '(60 min / 1 h)'), ` = ${x} × 60 ÷ 1000 = `, v('x', `${num(correcta)} m³/h`), '.'],
        ],
        _datos: { tipo: 'caudal', sub, nivel: 2, x },
      };
    }
    // lluvia: una capa de agua de mm de alto sobre un techo de a × b.
    const mm = rng.elegir([10, 15, 20, 25]), [a, b] = rng.elegir([[10, 8], [12, 9], [6, 5], [15, 10]]);
    const m3 = limpio(a * b * mm / 1000), correcta = limpio(m3 * 1000);
    return {
      variables: VARS2('las medidas del techo', 'la lluvia', 'los litros de agua'),
      enunciado: ['Una tormenta en Juliaca deja ', v('b', `${mm} mm`), ' de lluvia sobre un techo plano de ', v('a', `${a} m × ${b} m`), '.'],
      pregunta: ['¿Cuántos ', v('x', 'litros (L)'), ' de agua caen sobre el techo?'],
      datos: [`Lluvia de ${mm} mm: una capa de agua de ${mm} mm de alto`, CAJA, LARGO['m|mm'], LARGO['m|dm'], LITRO], correcta, texto: conU('L'), unidad: 'L',
      errores: [
        h('CONV-UNIDAD-PEDIDA', m3, `El volumen está bien, ${num(m3)} m³, pero se piden litros, y 1 m³ = (10 dm)³ = 1000 L.`),
        h('CONV-PREFIJO', limpio(m3 * 10000), `La idea de la capa de agua es correcta, pero pasaste ${mm} mm a ${num(mm / 100)} m como si fueran centímetros, y así sale ${num(m3 * 10000)}; 1 m = 1000 mm.`),
        h('QU2-litro-como-100-cm3', limpio(m3 * 100), `El volumen está bien, ${num(m3)} m³, pero 1 m³ no son 100 L: son (10 dm)³ = 1000 L. Así sale ${num(m3 * 100)}.`, UNIS),
        h('U2-mm', limpio(a * b * mm * 1000), `La fórmula V = largo × ancho × alto está bien, pero el alto está en mm y lo demás en m, así que ${a} × ${b} × ${mm} mezcla unidades. Sale ${num(a * b * mm * 1000)}.`, TRANS),
      ],
      solucion: [
        ['La lluvia es una capa de agua sobre el techo, y su alto se pasa a metros: ', v('b', `${mm} mm`), ` ÷ 1000 = ${num(mm / 1000)} m.`],
        ['V = largo × ancho × alto = ', v('a', `${a} m × ${b} m`), ` × ${num(mm / 1000)} m = ${num(m3)} m³.`],
        ['Para pasar a litros, ', v('k', '1 m³ = (10 dm)³ = 1000 L'), `; ${num(m3)} × 1000 = `, v('x', `${num(correcta)} L`), '.'],
      ],
      _datos: { tipo: 'caudal', sub, nivel: 3, mm, a, b },
    };
  }

  const CONSTRUIR = { area, volumen, densidad, caudal };
  return { id: ID, titulo: 'Áreas y volúmenes', generar };
});
