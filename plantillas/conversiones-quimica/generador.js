/*
 * Generador: conversiones de química de examen (escalas de temperatura, densidad y longitudes atómicas,
 * calor latente molar y vida media radiactiva). Formato "predicciones" (docs/arquitectura.md). Funciona en el
 * navegador (window.Generadores['conversiones-quimica']) y en Node (require). No usa ningún motor.
 *
 * Convenciones de academia: K = °C + 273 (sin decimales); °F = 1,8 · °C + 32; en una variación, Δ°F = 1,8 · Δ°C y
 * ΔK = Δ°C. Agua: densidad 1 g/mL, M = 18 g/mol, ΔHvap = 40,7 kJ/mol (a 100 °C), ΔHfus = 6,01 kJ/mol (a 0 °C).
 * Longitudes: 1 Å = 10⁻¹⁰ m, 1 nm = 10⁻⁹ m, 1 pm = 10⁻¹² m, 1 cm = 10⁻² m. Volúmenes: 1 L = 1000 cm³,
 * 1 m³ = 10⁶ cm³. Densidades de los metales (g/cm³): Al 2,7; Fe 7,8; Zn 7,1; Cu 8,9; Ag 10,5; Pb 11,3; Au 19,3.
 * Las respuestas no se redondean por dentro; el alumno las ve con coma decimal y, si son muy chicas o muy
 * grandes, en notación científica con tres cifras («1,28 × 10⁻¹⁰ m»).
 *
 * Funciones de cálculo (exportadas; las usa el generador y las verifica papel.json):
 *  - convertir(valor, de, a): lectura de temperatura entre 'C', 'F' y 'K'.
 *  - variacion(delta, de, a): una variación de temperatura entre 'C', 'F' y 'K' (sin desfase).
 *  - volumenDeMetal({ masa (g), rho (g/cm³), unidad: 'cm3' | 'L' | 'm3' }) → { cm3, volumen }.
 *  - masaDeMetal({ volumen, unidad: 'cm3' | 'L' | 'm3', rho }) → { cm3, g, kg }.
 *  - longitud(valor, de, a): entre 'A' (ångström), 'nm', 'pm', 'cm' y 'm'.
 *  - calorLatente({ masa (g), fase: 'vap' | 'fus' }) → { n (mol), Q (kJ) }.
 *  - masaPorCalor({ Q (kJ), fase }) → { n, masa (g) }.
 *  - vidaMedia({ m0, tMedia, t }) → { vidas = t/tMedia, queda = m0/2^vidas, desintegrado }.
 *  - tiempoPara({ tMedia, fraccion }) → { vidas = log2(1/fraccion), t }.
 *
 * Tipos de problema y _datos (lo que el verificador necesita para recalcular):
 *   delta    sub 'c-f' { T1, T2 } en °C → |Δ| en °F; 'c-k' { T1, T2 } en °C → |Δ| en K; 'f-c' { dF } → Δ en °C;
 *            'tabla' { tiempos [4], temps [4] en °C, i, j (índices del intervalo pedido), a: 'F' | 'K' } → Δ en esa escala.
 *   lectura  sub 'c-f' | 'f-c' | 'c-k' | 'k-c' | 'f-k' { valor } → la lectura en la otra escala.
 *   densidad sub 'volumen' { metal, masa (g), unidad: 'L' | 'm3' } → volumen en esa unidad;
 *            sub 'masa' { metal, volumen, unidad } → masa en kg;
 *            sub 'longitud' { valor, de, a } → el valor en la unidad a.
 *   latente  sub 'vaporizar' | 'fundir' { masa (g; agua líquida o hielo), litros (true si el dato se dio en L
 *            o kg: masa ya está en g) } → kJ; sub 'inversa' { Q (kJ) } → mL de agua vaporizada.
 *   vida     sub 'queda' { m0, tMedia, t } → masa que queda; sub 'deducir' { m0, T1, a, T2 } (en T1 queda m0/2^a;
 *            se pide lo que queda en T2) → masa; sub 'tiempo' { tMedia, n } (queda 1/2^n) → tiempo.
 * Errores: ES7 del informe de estequiometría (fórmula de moles invertida); los QA-* son hipótesis nuestras (los de vida
 * media, QA-vm-*, comparten id con configuracion-ubicacion). Rangos creíbles: cada objeto y cada lugar tiene su rango de
 * temperatura, y el dato se genera dentro de él; en lectura no salen kelvin negativos entre las alternativas.
 * FIN DE LA CABECERA: con esto basta para recalcular cada caso de casos.json sin leer el código.
 */
(function (root, fabrica) {
  const nodo = typeof module === 'object' && module.exports;
  const api = fabrica(nodo ? require('../../nucleo/azar.js') : root.Azar,
                      nodo ? require('../../nucleo/predicciones.js') : root.Predicciones);
  if (nodo) module.exports = api;
  else (root.Generadores = root.Generadores || {})[api.id] = api;
})(typeof self !== 'undefined' ? self : this, function (Azar, P) {
  'use strict';
  const ID = 'conversiones-quimica';
  const FES = 'docs/investigacion/estequiometria-ideas-erroneas.md';
  const FQA = 'docs/clasificacion/trampas-admision-unmsm/quimica.md';
  const h = (id, valor, explicacion) => ({ id, valor, explicacion, respaldo: 'hipotesis', fuente: FQA });
  const FCI = 'docs/investigacion/cinetica-ideas-erroneas.md';
  const hv = (id, valor, explicacion) => ({ id, valor, explicacion, respaldo: 'hipotesis', fuente: FCI });
  const v = P.v;
  const f = (x, d = 2) => P.formatear(x, d);
  const px = x => (x < 0 ? `(${f(x)})` : f(x));

  // ---------- Notación científica ----------
  const SUP = { '-': '⁻', 0: '⁰', 1: '¹', 2: '²', 3: '³', 4: '⁴', 5: '⁵', 6: '⁶', 7: '⁷', 8: '⁸', 9: '⁹' };
  function cient(x) {
    if (!Number.isFinite(x)) return String(x);
    if (x === 0) return '0';
    const ax = Math.abs(x);
    if (ax >= 0.01 && ax < 1e5) return P.formatear(x, ax < 1 ? 4 : 2);
    let e = Math.floor(Math.log10(ax)), m = Math.round(ax / 10 ** e * 100) / 100;
    if (m >= 10) { m /= 10; e += 1; }
    return (x < 0 ? '−' : '') + P.formatear(m, 2) + ' × 10' + String(e).split('').map(c => SUP[c]).join('');
  }

  // ---------- Cálculos ----------
  const aC = { C: x => x, F: x => (x - 32) / 1.8, K: x => x - 273 };
  const deC = { C: x => x, F: x => 1.8 * x + 32, K: x => x + 273 };
  const convertir = (valor, de, a) => deC[a](aC[de](valor));
  const PASO = { C: 1, K: 1, F: 1 / 1.8 };                               // tamaño de un grado, en grados Celsius
  const variacion = (delta, de, a) => delta * PASO[de] / PASO[a];
  const UV = { cm3: 1, L: 1e3, m3: 1e6 };                                // cm³ por unidad
  function volumenDeMetal({ masa, rho, unidad }) { const cm3 = masa / rho; return { cm3, volumen: cm3 / UV[unidad] }; }
  function masaDeMetal({ volumen, unidad, rho }) { const cm3 = volumen * UV[unidad], g = cm3 * rho; return { cm3, g, kg: g / 1000 }; }
  const UL = { A: 1e-10, nm: 1e-9, pm: 1e-12, cm: 1e-2, m: 1 };
  const NOMBRE_L = { A: 'Å', nm: 'nm', pm: 'pm', cm: 'cm', m: 'm' };
  // Cociente de potencias de diez sin errores de coma flotante (10⁻¹⁰/10⁻¹² = 100 exacto).
  const razonL = (de, a) => 10 ** (Math.round(Math.log10(UL[de])) - Math.round(Math.log10(UL[a])));
  const longitud = (valor, de, a) => { const k = razonL(de, a); return k >= 1 ? valor * k : valor / (1 / k); };
  const DH = { vap: 40.7, fus: 6.01 };
  function calorLatente({ masa, fase }) { const n = masa / 18; return { n, Q: n * DH[fase] }; }
  function masaPorCalor({ Q, fase }) { const n = Q / DH[fase]; return { n, masa: n * 18 }; }
  function vidaMedia({ m0, tMedia, t }) { const vidas = t / tMedia, queda = m0 / 2 ** vidas; return { vidas, queda, desintegrado: m0 - queda }; }
  function tiempoPara({ tMedia, fraccion }) { const vidas = Math.log2(1 / fraccion); return { vidas, t: vidas * tMedia }; }

  // ---------- Armado ----------
  function generar(semilla) {
    const rng = Azar.crear(ID + '|' + semilla);
    const tipo = rng.elegir(['delta', 'delta', 'lectura', 'densidad', 'densidad', 'latente', 'latente', 'vida', 'vida']);
    for (let intento = 0; intento < 3000; intento++) {
      const pr = ({ delta: tDelta, lectura: tLectura, densidad: tDensidad, latente: tLatente, vida: tVida })[tipo](rng, semilla);
      if (pr && pr.alternativas.length >= 4) return pr;
    }
    throw new Error('No se pudo generar un problema con 4 alternativas distintas');
  }

  function cerrar(rng, semilla, o) {
    const errores = o.errores.filter(e => Number.isFinite(e.valor) && (o.negativos || e.valor > 0));
    const texto = o.texto || (x => f(x, o.decimales ?? 2) + (o.unidad ? ' ' + o.unidad : ''));
    const alternativas = P.armar({ correcta: o.correcta, errores, rng, texto, negativos: !!o.negativos });
    return { id: `${ID}#${semilla}`, variables: o.variables, enunciado: o.enunciado, pregunta: o.pregunta, datos: o.datos || '',
      alternativas, solucion: o.solucion, respuesta: { valor: o.correcta, unidad: o.unidad }, _datos: o._datos };
  }
  const grado = { C: '°C', F: '°F', K: 'K' };

  // 1. Variación de temperatura en otra escala. Cada objeto tiene un rango creíble de temperatura (en °C).
  const OBJETOS = [
    { obj: 'el agua de una olla', de: 'del agua de una olla', min: 0, max: 100 },
    { obj: 'el aire de un balón', de: 'del aire de un balón', min: -10, max: 60 },
    { obj: 'un trozo de hierro', de: 'de un trozo de hierro', min: -20, max: 400 },
    { obj: 'una muestra de aceite', de: 'de una muestra de aceite', min: -10, max: 250 },
  ];
  function tDelta(rng, semilla) {
    const sub = rng.elegir(['c-f', 'c-f', 'c-k', 'f-c', 'tabla', 'tabla']);
    const variables = { T1: { nombre: 'temperatura inicial', color: 'o' }, T2: { nombre: 'temperatura final', color: 'i' },
      d: { nombre: 'variación', color: 'd' }, k: { nombre: 'tamaño del grado', color: 'h' } };
    const O = rng.elegir(OBJETOS);
    if (sub === 'tabla') {
      const tiempos = rng.elegir([[0, 2, 5, 8], [0, 3, 6, 10], [0, 4, 7, 12], [0, 1, 4, 6]]);
      const T0 = 5 * rng.entero(Math.ceil(O.min / 5), Math.floor((O.min + 30) / 5));
      const temps = [T0]; for (let k = 1; k < 4; k++) temps.push(temps[k - 1] + 5 * rng.entero(2, 7));
      if (temps[3] > O.max) return null;
      const [i, j] = rng.elegir([[1, 2], [1, 3], [0, 2], [2, 3]]);
      const a = rng.elegir(['F', 'F', 'K']);
      const dC = temps[j] - temps[i], correcta = variacion(dC, 'C', a);
      const total = variacion(temps[3] - temps[0], 'C', a);
      // Regla 4: los instantes del tramo pedido (t) y sus lecturas (T1, T2) tienen color propio.
      const vars = { t: { nombre: 'instantes del tramo', color: 'h' }, T1: { nombre: 'lectura al inicio del tramo', color: 'o' },
        T2: { nombre: 'lectura al final del tramo', color: 'i' }, d: { nombre: 'variación', color: 'd' } };
      const lista = [];
      tiempos.forEach((t, k) => {
        if (k) lista.push('; ');
        lista.push(k === i ? v('t', `${t} min`) : k === j ? v('t', `${t} min`) : `${t} min`, ' → ',
          k === i ? v('T1', `${f(temps[k])} °C`) : k === j ? v('T2', `${f(temps[k])} °C`) : `${f(temps[k])} °C`);
      });
      const enunciado = [`Al calentar ${O.obj}, se anotan estos datos de temperatura contra tiempo: `, ...lista, '.'];
      const pregunta = ['¿Cuánto ', v('d', 'aumentó la temperatura'), ' entre el minuto ', v('t', String(tiempos[i])), ' y el minuto ', v('t', String(tiempos[j])), `, en ${grado[a]}?`];
      const errores = [
        h('QA-intervalo-equivocado', total, `Tomaste todo el registro (de ${tiempos[0]} a ${tiempos[3]} min). La pregunta es solo entre el minuto ${tiempos[i]} y el ${tiempos[j]}.`),
        h('QA-desfase-en-variacion', a === 'F' ? correcta + 32 : correcta + 273, `Sumaste ${a === 'F' ? '32' : '273'} a una variación. Ese número solo sirve para pasar una lectura del termómetro; una diferencia no lo lleva, porque se cancela al restar.`),
        h('QA-convierte-una-lectura-final', convertir(temps[j], 'C', a), `Pasaste a ${grado[a]} la lectura del minuto ${tiempos[j]}, no la diferencia entre las dos lecturas.`),
        a === 'F' ? h('QA-factor-invertido-temp', dC / 1.8, 'Dividiste entre 1,8. El grado Fahrenheit es más chico que el Celsius: la misma variación tiene más grados °F, así que se multiplica.')
          : h('QA-factor-de-fahrenheit', dC * 1.8, 'Usaste el factor 1,8, que es del Fahrenheit. El kelvin tiene el mismo tamaño que el grado Celsius: ΔK = Δ°C.'),
        a === 'F' ? h('QA-sin-convertir', dC, 'Diste la variación en °C. Falta pasarla a °F: cada °C son 1,8 °F.')
          : h('QA-convierte-una-lectura-inicial', convertir(temps[i], 'C', a), `Pasaste a kelvin la lectura del minuto ${tiempos[i]}, no la diferencia entre las dos lecturas.`),
      ];
      const solucion = [
        ['En °C: ', v('T2', `${f(temps[j])} °C`), ' − ', v('T1', `${f(temps[i])} °C`), ' = ', v('d', `${dC} °C`), '.'],
        a === 'F' ? [`Cada °C de variación son 1,8 °F: ${dC} × 1,8 = `, v('d', `${f(correcta, 1)} °F`), '. En una variación no se suma 32.']
          : ['El kelvin y el °C tienen el mismo tamaño: ', v('d', `ΔK = ${dC} K`), '. En una variación no se suma 273.'],
      ];
      return cerrar(rng, semilla, { correcta, errores, unidad: grado[a], decimales: 1, variables: vars, enunciado, pregunta, solucion,
        _datos: { tipo: 'delta', sub, tiempos, temps, i, j, a } });
    }
    if (sub === 'f-c') {
      const dF = 9 * rng.entero(4, 18), correcta = variacion(dF, 'F', 'C');
      if (correcta > O.max - O.min) return null;
      const enunciado = [`La temperatura ${O.de} sube `, v('d', `${dF} °F`), '.'];
      const pregunta = ['¿A cuántos grados Celsius equivale esa ', v('d', 'variación'), '?'];
      const errores = [
        h('QA-desfase-en-variacion', (dF - 32) / 1.8, 'Restaste 32 a una variación. El 32 solo sirve para pasar una lectura; en una diferencia se cancela.'),
        h('QA-factor-invertido-temp', dF * 1.8, 'Multiplicaste por 1,8. El grado Celsius es más grande que el Fahrenheit: la misma variación tiene menos grados °C, así que se divide.'),
        h('QA-sin-convertir', dF, 'Dejaste el número en °F.'),
        h('QA-escala-equivocada-k', dF / 1.8 + 273, 'Sumaste 273: eso pasa una lectura a kelvin. Se pide la variación en °C.'),
      ];
      const solucion = [['Cada °C de variación son ', v('k', '1,8 °F'), ': ', v('d', `${dF} °F`), ' ÷ 1,8 = ', v('d', `${f(correcta, 1)} °C`), '. Sin restar 32: es una diferencia.']];
      return cerrar(rng, semilla, { correcta, errores, unidad: '°C', decimales: 1, variables, enunciado, pregunta, solucion, _datos: { tipo: 'delta', sub, dF } });
    }
    const T1 = 5 * rng.entero(Math.ceil(O.min / 5), Math.floor(O.max / 5)), T2 = 5 * rng.entero(Math.ceil(O.min / 5), Math.floor(O.max / 5));
    const d = Math.abs(T2 - T1), baja = T2 < T1;
    if (d < 15 || d > 150) return null;
    const a = sub === 'c-f' ? 'F' : 'K';
    const correcta = variacion(d, 'C', a);
    const enunciado = [`La temperatura ${O.de} ${baja ? 'baja' : 'sube'} de `, v('T1', `${f(T1)} °C`), ' a ', v('T2', `${f(T2)} °C`), '.'];
    const pregunta = ['¿De cuánto es la ', v('d', 'variación'), ` de temperatura, en ${grado[a]}?`];
    const errores = [
      h('QA-desfase-en-variacion', a === 'F' ? correcta + 32 : correcta + 273, `Sumaste ${a === 'F' ? '32' : '273'} a la variación. Ese desfase solo sirve para pasar una lectura; al restar dos lecturas se cancela.`),
      h('QA-convierte-una-lectura-final', convertir(T2, 'C', a), `Pasaste a ${grado[a]} la lectura final (${f(T2)} °C), no la diferencia.`),
      a === 'F' ? h('QA-factor-invertido-temp', d / 1.8, 'Dividiste entre 1,8. El grado Fahrenheit es más chico: la misma variación tiene más grados °F.')
        : h('QA-factor-de-fahrenheit', d * 1.8, 'Usaste el factor 1,8 del Fahrenheit. El kelvin y el grado Celsius tienen el mismo tamaño: ΔK = Δ°C.'),
      a === 'F' ? h('QA-sin-convertir', d, 'Diste la variación en °C. Falta pasarla a °F.') : h('QA-escala-equivocada-f', d * 1.8 + 32, 'Pasaste la variación a °F, y además con el desfase de 32. Se pide en kelvin, que tiene el tamaño del grado Celsius.'),
      h('QA-convierte-una-lectura-inicial', convertir(T1, 'C', a), `Pasaste a ${grado[a]} la lectura inicial (${f(T1)} °C), no la diferencia.`),
    ];
    const solucion = [
      ['En °C: |', v('T2', f(T2)), ' − (', v('T1', f(T1)), ')| = ', v('d', `${d} °C`), '.'],
      a === 'F' ? ['Cada °C de variación son ', v('k', '1,8 °F'), `: ${d} × 1,8 = `, v('d', `${f(correcta, 1)} °F`), '. No se suma 32: es una diferencia.']
        : ['El kelvin tiene el ', v('k', 'mismo tamaño'), ' que el grado Celsius: ', v('d', `${d} K`), '. No se suma 273.'],
    ];
    return cerrar(rng, semilla, { correcta, errores, unidad: grado[a], decimales: 1, variables, enunciado, pregunta, solucion, _datos: { tipo: 'delta', sub, T1, T2 } });
  }

  // 2. Lectura de temperatura en otra escala (para contrastar con la variación). Cada lugar tiene su rango (en °C);
  // el valor se genera dentro del rango y en la escala de origen.
  const LUGARES = [
    { t: 'Un congelador industrial marca', min: -40, max: -10 }, { t: 'El horno de una panadería está a', min: 150, max: 250 },
    { t: 'El agua de un tanque está a', min: 5, max: 90 }, { t: 'Una muestra de gas está a', min: -150, max: 400 },
    { t: 'Un termómetro de laboratorio marca', min: -50, max: 300 },
  ];
  function tLectura(rng, semilla) {
    const sub = rng.elegir(['c-f', 'f-c', 'c-k', 'k-c', 'f-k']);
    const [de, a] = sub.split('-').map(x => x.toUpperCase());
    const L = rng.elegir(LUGARES);
    let valor;
    if (de === 'C') valor = 5 * rng.entero(Math.ceil(L.min / 5), Math.floor(L.max / 5));
    else if (de === 'F') { const k = rng.entero(Math.ceil(L.min / 5), Math.floor(L.max / 5)); valor = 32 + 9 * k; }
    else valor = rng.entero(L.min + 273, L.max + 273);
    const C = aC[de](valor);
    if (C === 0 || C === -40) return null;                               // con 0 °C o −40 °C varios errores coinciden
    const correcta = convertir(valor, de, a);
    const variables = { x: { nombre: 'lectura dada', color: 'o' }, y: { nombre: 'lectura pedida', color: 'd' },
      fa: { nombre: 'factor de tamaño del grado', color: 'i' }, de: { nombre: 'desfase del cero', color: 'h' } };
    const enunciado = [L.t, ' ', v('x', `${f(valor)} ${grado[de]}`), '.'];
    const pregunta = ['¿Cuál es esa ', v('y', 'temperatura'), ` en ${grado[a]}?`];
    const errores = {
      'c-f': [h('QA-olvida-32', 1.8 * valor, 'Multiplicaste por 1,8 pero no sumaste 32. Para una lectura, el 0 °C está en 32 °F: hay que correr la escala.'),
        h('QA-orden-de-operaciones', (valor + 32) * 1.8, 'Sumaste 32 antes de multiplicar. Primero se pasa el tamaño del grado (× 1,8) y después se corre el cero (+ 32).'),
        h('QA-factor-invertido-temp', valor / 1.8 + 32, 'Dividiste entre 1,8. Un grado Celsius equivale a 1,8 °F: se multiplica.'),
        h('QA-olvida-factor', valor + 32, 'Solo sumaste 32. Los grados de las dos escalas no tienen el mismo tamaño: falta × 1,8.')],
      'f-c': [h('QA-orden-de-operaciones', valor / 1.8 - 32, 'Dividiste antes de restar 32. Primero se quita el desfase (− 32) y después se cambia el tamaño del grado (÷ 1,8).'),
        h('QA-factor-invertido-temp', (valor - 32) * 1.8, 'Multiplicaste por 1,8. Para ir de °F a °C se divide entre 1,8.'),
        h('QA-olvida-factor', valor - 32, 'Solo restaste 32. Falta dividir entre 1,8.'),
        h('QA-olvida-32', valor / 1.8, 'Dividiste entre 1,8 pero no restaste 32 antes.')],
      'c-k': [h('QA-signo-273', valor - 273, 'Restaste 273. Para pasar a kelvin se suma: el cero absoluto está 273 grados debajo del 0 °C.'),
        h('QA-sin-convertir', valor, 'Dejaste el mismo número. El kelvin tiene el tamaño del grado Celsius, pero su cero está corrido 273.'),
        h('QA-escala-equivocada-f', 1.8 * valor + 32, 'Pasaste a °F, no a kelvin.'),
        h('QA-mezcla-escalas', 1.8 * valor + 273, 'Mezclaste las dos fórmulas: el factor 1,8 es del Fahrenheit. Para kelvin solo se suma 273.')],
      'k-c': [h('QA-signo-273', valor + 273, 'Sumaste 273. De kelvin a °C se resta.'),
        h('QA-sin-convertir', valor, 'Dejaste el mismo número; falta restar 273.'),
        h('QA-formula-de-fahrenheit', (valor - 32) / 1.8, 'Usaste la fórmula del Fahrenheit (restar 32 y dividir entre 1,8). El dato está en kelvin.'),
        h('QA-escala-equivocada-f', (valor - 273) * 1.8 + 32, 'Pasaste a °F, no a °C.')],
      'f-k': [h('QA-olvida-273', C, 'Llegaste a °C y te detuviste. Falta sumar 273 para pasar a kelvin.'),
        h('QA-orden-de-operaciones', valor / 1.8 + 273, 'No restaste 32 antes de dividir entre 1,8.'),
        h('QA-olvida-factor', valor + 273, 'Sumaste 273 directo al valor en °F. Primero hay que pasar a °C: (°F − 32) ÷ 1,8.'),
        h('QA-factor-invertido-temp', (valor - 32) * 1.8 + 273, 'Multiplicaste por 1,8. Para ir de °F a °C se divide.')],
    }[sub].filter(e => a !== 'K' || e.valor > 0);                         // no hay kelvin negativos
    const solucion = {
      'c-f': [['°F = ', v('fa', '1,8'), ' × ', v('x', px(valor)), ' + ', v('de', '32'), ' = ', v('y', `${f(correcta, 1)} °F`), '.']],
      'f-c': [['°C = (', v('x', px(valor)), ' − ', v('de', '32'), ') ÷ ', v('fa', '1,8'), ' = ', v('y', `${f(correcta, 1)} °C`), '.']],
      'c-k': [['K = ', v('x', px(valor)), ' + ', v('de', '273'), ' = ', v('y', `${f(correcta, 1)} K`), '. El grado es del mismo tamaño (factor ', v('fa', '1'), ').']],
      'k-c': [['°C = ', v('x', px(valor)), ' − ', v('de', '273'), ' = ', v('y', `${f(correcta, 1)} °C`), '. El grado es del mismo tamaño (factor ', v('fa', '1'), ').']],
      'f-k': [['Primero a °C: (', v('x', px(valor)), ' − ', v('de', '32'), ') ÷ ', v('fa', '1,8'), ` = ${f(C, 1)} °C.`],
        ['Luego K = ', `${px(C)} + `, v('de', '273'), ' = ', v('y', `${f(correcta, 1)} K`), '.']],
    }[sub];
    solucion.push(['Es una lectura del termómetro: aquí sí se corre el cero de la escala.']);
    return cerrar(rng, semilla, { correcta, errores, unidad: grado[a], decimales: 1, negativos: true, variables, enunciado, pregunta, solucion,
      _datos: { tipo: 'lectura', sub, valor } });
  }

  // 3. Densidad y volumen con cm³ ↔ L ↔ m³, y longitudes atómicas.
  const METALES = [
    { s: 'Al', nombre: 'aluminio', del: 'del aluminio', rho: 2.7 }, { s: 'Fe', nombre: 'hierro', del: 'del hierro', rho: 7.8 }, { s: 'Zn', nombre: 'zinc', del: 'del zinc', rho: 7.1 },
    { s: 'Cu', nombre: 'cobre', del: 'del cobre', rho: 8.9 }, { s: 'Ag', nombre: 'plata', del: 'de la plata', rho: 10.5 }, { s: 'Pb', nombre: 'plomo', del: 'del plomo', rho: 11.3 }, { s: 'Au', nombre: 'oro', del: 'del oro', rho: 19.3 },
  ];
  const NOMBRE_V = { cm3: 'cm³', L: 'L', m3: 'm³' };
  const textoCient = u => x => cient(x) + ' ' + u;
  function tDensidad(rng, semilla) {
    const sub = rng.elegir(['volumen', 'volumen', 'masa', 'longitud', 'longitud']);
    if (sub === 'longitud') return tLongitud(rng, semilla);
    const met = rng.elegir(METALES);
    const cm3 = rng.elegir([50, 80, 125, 200, 250, 400, 500, 800, 1000, 1500, 2000, 2500, 4000, 5000]);
    const variables = { m: { nombre: 'masa', color: 'o' }, rho: { nombre: 'densidad', color: 'i' }, V: { nombre: 'volumen', color: 'd' }, k: { nombre: 'potencia de diez', color: 'h' } };
    const datos = `Densidad ${met.del}: ${f(met.rho, 1)} g/cm³. 1 L = 1000 cm³; 1 m³ = 10⁶ cm³.`;
    if (sub === 'volumen') {
      const g = cm3 * met.rho, enKg = g >= 1000 && Math.abs(g - Math.round(g)) < 1e-9;
      if (g > 15000) return null;                                        // un lingote que se pueda cargar
      const unidad = rng.elegir(['L', 'm3']);
      const r = volumenDeMetal({ masa: g, rho: met.rho, unidad });
      const correcta = r.volumen, U = NOMBRE_V[unidad];
      const masaTxt = enKg ? `${f(g / 1000, 3)} kg` : `${f(g, 1)} g`;
      const enunciado = ['Un lingote de ', met.nombre, ' tiene una ', v('m', `masa de ${masaTxt}`), ' y una ', v('rho', `densidad de ${f(met.rho, 1)} g/cm³`), '.'];
      const pregunta = ['¿Cuál es su ', v('V', 'volumen'), `, en ${U}?`];
      const errores = [];
      if (unidad !== 'cm3') errores.push(h('QA-deja-en-cm3', r.cm3, `Ese número son los cm³ (${f(r.cm3, 1)} cm³). Falta pasarlos a ${U}${unidad === 'L' ? ': 1 L = 1000 cm³' : ': 1 m³ = 10⁶ cm³'}.`));
      if (unidad === 'm3') {
        errores.push(h('QA-cubo-sin-elevar', r.cm3 * 1e-2, 'Usaste 1 cm = 10⁻² m sin elevar al cubo. En volumen, 1 cm³ = (10⁻² m)³ = 10⁻⁶ m³.'));
        errores.push(h('QA-m3-como-1000-cm3', r.cm3 * 1e-3, 'Tomaste 1 m³ = 1000 cm³ (eso es un litro). 1 m³ = (100 cm)³ = 10⁶ cm³.'));
      }
      if (unidad === 'L') {
        errores.push(h('QA-litro-como-m3', r.cm3 * 1e-6, 'Dividiste entre 10⁶: eso da m³. Un litro son 1000 cm³.'));
        errores.push(h('QA-litro-como-100-cm3', r.cm3 / 100, 'Tomaste 1 L = 100 cm³. Un litro es un cubo de 10 cm de lado: 10 × 10 × 10 = 1000 cm³.'));
      }
      if (enKg && unidad !== 'L') errores.push(h('QA-kg-sin-pasar', g / 1000 / met.rho / UV[unidad], 'Dividiste los kilogramos entre una densidad en g/cm³. Antes, pasa la masa a gramos (× 1000).'));
      errores.push(h('QA-multiplica-densidad', g * met.rho / UV[unidad], 'Multiplicaste la masa por la densidad. El volumen es masa entre densidad: V = m ÷ ρ.'));
      const solucion = [
        [enKg ? [v('m', masaTxt), ` = ${f(g, 1)} g. `] : [], 'V = ', v('m', `${f(g, 1)} g`), ' ÷ ', v('rho', `${f(met.rho, 1)} g/cm³`), ` = ${f(r.cm3, 1)} cm³.`].flat(),
        unidad === 'cm3' ? ['Ya está en cm³: ', v('V', `${f(correcta, 1)} cm³`), '.']
          : [`${f(r.cm3, 1)} cm³ `, v('k', unidad === 'L' ? '÷ 1000' : '× 10⁻⁶'), ' = ', v('V', `${cient(correcta)} ${U}`), '.'],
      ];
      return cerrar(rng, semilla, { correcta, errores, unidad: U, texto: textoCient(U), variables, enunciado, pregunta, solucion, datos,
        _datos: { tipo: 'densidad', sub, metal: met.s, masa: g, unidad } });
    }
    const unidad = rng.elegir(['L', 'm3']);
    const volumen = cm3 / UV[unidad];
    const r = masaDeMetal({ volumen, unidad, rho: met.rho });
    const correcta = r.kg, U = NOMBRE_V[unidad];
    const enunciado = ['Una pieza de ', met.nombre, ' ocupa ', v('V', `${cient(volumen)} ${U}`), '. Su ', v('rho', `densidad es ${f(met.rho, 1)} g/cm³`), '.'];
    const pregunta = ['¿Cuál es su ', v('m', 'masa'), ', en kg?'];
    const errores = [
      h('QA-sin-pasar-a-cm3', volumen * met.rho, `Multiplicaste los ${U} por g/cm³ sin pasar el volumen a cm³.`),
      h('QA-gramos-como-kg', r.g, `Ese número son gramos (${f(r.g, 1)} g). Falta dividir entre 1000 para pasar a kilogramos.`),
      h('QA-divide-densidad', r.cm3 / met.rho / 1000, 'Dividiste el volumen entre la densidad. La masa es volumen por densidad: m = ρ × V.'),
      unidad === 'm3' ? h('QA-cubo-sin-elevar', volumen * 1e2 * met.rho / 1000, 'Usaste 1 m = 100 cm sin elevar al cubo. En volumen, 1 m³ = (100 cm)³ = 10⁶ cm³.')
        : h('QA-litro-como-m3', volumen * 1e6 * met.rho / 1000, 'Tomaste el litro como si fuera un metro cúbico (10⁶ cm³). Un litro son 1000 cm³.'),
      unidad === 'm3' ? h('QA-m3-como-1000-cm3', volumen * 1e3 * met.rho / 1000, 'Tomaste 1 m³ = 1000 cm³ (eso es un litro). 1 m³ = (100 cm)³ = 10⁶ cm³.')
        : h('QA-litro-como-100-cm3', volumen * 100 * met.rho / 1000, 'Tomaste 1 L = 100 cm³. Un litro es un cubo de 10 cm de lado: 1000 cm³.'),
    ];
    const solucion = [
      [v('V', `${cient(volumen)} ${U}`), ' ', v('k', unidad === 'L' ? '× 1000' : '× 10⁶'), ` = ${f(r.cm3, 1)} cm³.`],
      ['m = ', v('rho', `${f(met.rho, 1)} g/cm³`), ` × ${f(r.cm3, 1)} cm³ = ${f(r.g, 1)} g = `, v('m', `${cient(correcta)} kg`), '.'],
    ];
    return cerrar(rng, semilla, { correcta, errores, unidad: 'kg', texto: textoCient('kg'), variables, enunciado, pregunta, solucion, datos,
      _datos: { tipo: 'densidad', sub, metal: met.s, volumen, unidad } });
  }
  const RADIOS = [['el radio del átomo de hidrógeno (de Bohr)', 0.53], ['la longitud del enlace H–H', 0.74], ['el radio del átomo de cobre', 1.28],
    ['el radio del átomo de oro', 1.44], ['la longitud del enlace C–C', 1.54], ['el radio del átomo de sodio', 1.86], ['el radio del átomo de potasio', 2.27]];
  function tLongitud(rng, semilla) {
    const [que, A] = rng.elegir(RADIOS);
    const [de, a] = rng.elegir([['A', 'nm'], ['A', 'pm'], ['A', 'm'], ['A', 'cm'], ['pm', 'A'], ['nm', 'A'], ['pm', 'nm']]);
    const valor = longitud(A, 'A', de);
    const correcta = longitud(valor, de, a);
    const variables = { x: { nombre: 'dato', color: 'o' }, y: { nombre: 'resultado', color: 'd' }, k: { nombre: 'potencia de diez', color: 'h' } };
    const U = NOMBRE_L[a];
    const enunciado = [`En una tabla aparece ${que}: `, v('x', `${cient(valor)} ${NOMBRE_L[de]}`), '.'];
    const pregunta = ['¿Cuánto es en ', v('y', U), '?'];
    const errores = [
      h('QA-factor-invertido-long', valor / razonL(de, a), 'Usaste la equivalencia al revés. Si la unidad nueva es más chica, el número tiene que crecer; si es más grande, achicarse.'),
      h('QA-potencia-diez-x10', correcta * 10, 'Te pasaste por una potencia de diez. Cuenta los exponentes: 1 Å = 10⁻¹⁰ m, 1 nm = 10⁻⁹ m, 1 pm = 10⁻¹² m.'),
      h('QA-potencia-diez-entre10', correcta / 10, 'Te faltó una potencia de diez. Cuenta los exponentes: 1 Å = 10⁻¹⁰ m, 1 nm = 10⁻⁹ m, 1 pm = 10⁻¹² m.'),
    ];
    if ((de === 'A' || a === 'A') && de !== 'cm' && a !== 'cm') {
      const Ufalso = { ...UL, A: 1e-8 };
      errores.unshift(h('QA-angstrom-como-1e-8', valor * (de === 'A' ? Ufalso.A : UL[de]) / (a === 'A' ? Ufalso.A : UL[a]), 'Tomaste 1 Å = 10⁻⁸ m. Esa equivalencia es en centímetros: 1 Å = 10⁻⁸ cm = 10⁻¹⁰ m.'));
    }
    if (de === 'nm' || a === 'nm') {
      const Uf = { ...UL, nm: 1e-6 };
      errores.push(h('QA-nm-como-micra', valor * Uf[de] / Uf[a], 'Tomaste 1 nm = 10⁻⁶ m. Ese es el micrómetro; el nanómetro es 10⁻⁹ m.'));
    }
    const k = Math.round(Math.log10(razonL(de, a)));
    const solucion = [
      [de, a].filter(u => u !== 'm').map((u, i) => [i ? ' y ' : '', `1 ${NOMBRE_L[u]} = `, v('k', `10${String(Math.round(Math.log10(UL[u]))).split('').map(c => SUP[c]).join('')} m`)]).flat().concat(['.']),
      [v('x', `${cient(valor)} ${NOMBRE_L[de]}`), ' × ', v('k', `10${String(k).split('').map(c => SUP[c]).join('')}`), ' = ', v('y', `${cient(correcta)} ${U}`), '.'],
    ];
    return cerrar(rng, semilla, { correcta, errores, unidad: U, texto: textoCient(U), variables, enunciado, pregunta, solucion,
      _datos: { tipo: 'densidad', sub: 'longitud', valor, de, a } });
  }

  // 4. Calor latente molar.
  function tLatente(rng, semilla) {
    const sub = rng.elegir(['vaporizar', 'vaporizar', 'fundir', 'inversa']);
    const variables = { m: { nombre: 'cantidad de agua', color: 'o' }, n: { nombre: 'moles', color: 'i' }, H: { nombre: 'calor molar', color: 'h' }, Q: { nombre: 'energía', color: 'd' } };
    const datos = 'Agua: M = 18 g/mol, densidad 1 g/mL. ΔHvap = 40,7 kJ/mol; ΔHfus = 6,01 kJ/mol.';
    if (sub === 'inversa') {
      const n = rng.elegir([0.5, 1, 1.5, 2, 2.5, 3, 4, 5, 8, 10]);
      const Q = n * DH.vap, r = masaPorCalor({ Q, fase: 'vap' });
      const correcta = r.masa;
      const enunciado = ['Al agua que ya hierve a 100 °C se le entregan ', v('Q', `${f(Q, 2)} kJ`), ', y toda esa energía se usa en vaporizarla.'];
      const pregunta = ['¿Cuántos ', v('m', 'mililitros de agua'), ' se vaporizan?'];
      const errores = [
        h('QA-moles-como-masa', r.n, 'Ese número son los moles de agua. Falta pasarlos a gramos (× 18) y, con la densidad de 1 g/mL, a mililitros.'),
        h('QA-calor-de-otra-fase', Q / DH.fus * 18, 'Usaste el calor de fusión (6,01 kJ/mol). Para vaporizar se usa el de vaporización, 40,7 kJ/mol.'),
        h('QA-kj-como-j', Q * 1000 / DH.vap * 18, 'Pasaste los kJ a J, pero el calor molar ya estaba en kJ/mol. Las dos cantidades deben ir en la misma unidad.'),
        h('QA-divide-masa-molar', Q / DH.vap / 18, 'Dividiste entre 18. Los moles se pasan a gramos multiplicando por la masa molar.'),
        h('QA-divide-al-reves', DH.vap / Q * 18, 'Dividiste el calor molar entre la energía. Moles = energía ÷ calor por mol.'),
      ];
      const solucion = [
        ['Moles: ', v('Q', `${f(Q, 2)} kJ`), ' ÷ ', v('H', '40,7 kJ/mol'), ' = ', v('n', `${f(r.n, 2)} mol`), '.'],
        ['Masa: ', v('n', `${f(r.n, 2)} mol`), ` × 18 g/mol = ${f(r.masa, 1)} g, que son `, v('m', `${f(correcta, 1)} mL`), ' (1 g/mL).'],
      ];
      return cerrar(rng, semilla, { correcta, errores, unidad: 'mL', decimales: 1, variables, enunciado, pregunta, solucion, datos, _datos: { tipo: 'latente', sub, Q } });
    }
    const fase = sub === 'vaporizar' ? 'vap' : 'fus', otra = fase === 'vap' ? 'fus' : 'vap';
    const litros = rng.elegir([false, false, true]);
    const masa = litros ? 18 * rng.elegir([10, 20, 25, 50, 100]) : rng.elegir([9, 18, 27, 36, 45, 54, 72, 90, 108, 180, 270, 360]);
    const r = calorLatente({ masa, fase });
    const correcta = r.Q;
    const dato = sub === 'vaporizar'
      ? (litros ? `${f(masa / 1000, 2)} L de agua` : `${masa} mL de agua`)
      : (litros ? `${f(masa / 1000, 2)} kg de hielo` : `${masa} g de hielo`);
    const enunciado = sub === 'vaporizar'
      ? ['Se quiere vaporizar por completo ', v('m', dato), ' que ya está a 100 °C.']
      : ['Se quiere fundir ', v('m', dato), ' que ya está a 0 °C.'];
    const pregunta = ['¿Cuánta ', v('Q', 'energía'), ' hace falta, en kJ?'];
    const errores = [
      h('QA-latente-sin-moles', masa * DH[fase], `Multiplicaste los gramos por ${f(DH[fase])} kJ/mol. El calor es por mol: primero hay que pasar los gramos a moles (÷ 18).`),
      h('QA-kj-como-j', correcta * 1000, 'Ese número son joules: el calor molar ya estaba en kJ/mol, no hacía falta multiplicar por 1000.'),
      h('QA-calor-de-otra-fase', r.n * DH[otra], `Usaste el calor de ${otra === 'vap' ? 'vaporización (40,7' : 'fusión (6,01'} kJ/mol). Aquí el agua se ${fase === 'vap' ? 'vaporiza' : 'funde'}.`),
      { id: 'ES7', valor: 18 / masa * DH[fase], respaldo: 'parcial', fuente: FES,
        explicacion: 'Calculaste los moles al revés (masa molar ÷ masa). Los moles son masa ÷ masa molar: más agua, más moles.' },
    ];
    if (litros) errores.splice(1, 0, h('QA-litros-como-gramos', masa / 1000 / 18 * DH[fase], `Usaste los ${sub === 'vaporizar' ? 'litros' : 'kilogramos'} como si fueran gramos. Primero pasa a gramos: × 1000.`));
    const solucion = [
      [v('m', dato), litros ? ` = ${masa} g` : (sub === 'vaporizar' ? ` = ${masa} g (1 g/mL)` : ''), '; ÷ 18 g/mol = ', v('n', `${f(r.n, 2)} mol`), '.'],
      ['Energía: ', v('n', `${f(r.n, 2)} mol`), ' × ', v('H', `${f(DH[fase])} kJ/mol`), ' = ', v('Q', `${f(correcta, 2)} kJ`), '.'],
    ];
    return cerrar(rng, semilla, { correcta, errores, unidad: 'kJ', decimales: 2, variables, enunciado, pregunta, solucion, datos, _datos: { tipo: 'latente', sub, masa, litros } });
  }

  // 5. Vida media radiactiva.
  const ISOTOPOS = [
    { s: 'yodo-131', t: 8, u: 'días', hospital: true }, { s: 'fósforo-32', t: 14, u: 'días', hospital: true },
    { s: 'tecnecio-99m', t: 6, u: 'horas', hospital: true }, { s: 'sodio-24', t: 15, u: 'horas', hospital: true },
    { s: 'cesio-137', t: 30, u: 'años', hospital: false },
  ];
  function tVida(rng, semilla) {
    const sub = rng.elegir(['queda', 'queda', 'deducir', 'tiempo']);
    const variables = { m0: { nombre: 'masa inicial', color: 'o' }, th: { nombre: 'vida media', color: 'i' }, t: { nombre: 'tiempo', color: 'h' }, q: { nombre: 'lo que queda', color: 'd' } };
    const m0 = rng.elegir([16, 20, 24, 32, 40, 48, 64, 80, 96, 100, 120, 160, 200, 256, 320]);
    const pot = x => String(x).split('').map(c => SUP[c]).join('');
    if (sub === 'tiempo') {
      const iso = rng.elegir(ISOTOPOS), n = rng.entero(2, 5);
      const r = tiempoPara({ tMedia: iso.t, fraccion: 1 / 2 ** n });
      const correcta = r.t;
      const enunciado = ['El ', iso.s, ' tiene una ', v('th', `vida media de ${iso.t} ${iso.u}`), '.'];
      const pregunta = ['¿Cuánto ', v('t', 'tiempo'), ` pasa hasta que en una muestra quede `, v('q', `1/${2 ** n}`), ' de lo que había?'];
      const errores = [
        hv('QA-vm-multiplica-fraccion', iso.t * 2 ** n, `Multiplicaste la vida media por ${2 ** n}. El ${2 ** n} es 2${pot(n)}: se llega a 1/${2 ** n} después de ${n} vidas medias, no de ${2 ** n}.`),
        hv('QA-vm-lineal', 2 * (1 - 1 / 2 ** n) * iso.t, 'Supusiste que se pierde siempre la misma cantidad por unidad de tiempo, como en una recta. Cada vida media se pierde la mitad de lo que queda, no la mitad de lo que había al inicio.'),
        hv('QA-vm-una-vida-de-menos', (n - 1) * iso.t, `Contaste una vida media menos. Tras 1 vida media queda 1/2; tras 2, 1/4…: para 1/${2 ** n} hacen falta ${n}.`),
        hv('QA-vm-una-vida-de-mas', (n + 1) * iso.t, `Contaste una vida media de más. Tras 1 vida media queda 1/2; tras 2, 1/4…: para 1/${2 ** n} hacen falta ${n}.`),
        hv('QA-vm-divide-vida-media', iso.t / 2 ** n, 'Dividiste la vida media. Mientras menos queda, más tiempo pasó: el tiempo crece.'),
      ];
      const solucion = [
        [`1 → 1/2 → 1/4 → … → `, v('q', `1/${2 ** n}`), `: son ${n} mitades, porque ${2 ** n} = 2${pot(n)}.`],
        [`${n} × `, v('th', `${iso.t} ${iso.u}`), ' = ', v('t', `${f(correcta)} ${iso.u}`), '.'],
      ];
      return cerrar(rng, semilla, { correcta, errores, unidad: iso.u, decimales: 2, variables, enunciado, pregunta, solucion, _datos: { tipo: 'vida', sub, tMedia: iso.t, n } });
    }
    if (sub === 'deducir') {
      const th = rng.elegir([2, 3, 4, 5, 6, 8, 10, 12]), a = rng.elegir([2, 3]), b = a + rng.entero(1, 3);
      const u = rng.elegir(['horas', 'días']);
      const T1 = a * th, T2 = b * th;
      const correcta = m0 / 2 ** b;
      const enunciado = ['Una muestra de ', v('m0', `${m0} mg`), ' de un isótopo radiactivo se reduce a ', `${f(m0 / 2 ** a, 2)} mg`, ' en ', v('t', `${T1} ${u}`), '.'];
      const pregunta = ['¿Cuántos ', v('q', 'mg del isótopo quedan'), u === 'días' ? ' a los ' : ' a las ', v('t', `${T2} ${u}`), ' de empezar?'];
      const errores = [
        hv('QA-vm-lee-tiempo-sin-mitad', m0 / 2 ** (T2 / T1), `Tomaste ${T1} ${u} como vida media. En ese tiempo no quedó la mitad sino 1/${2 ** a}: pasaron ${a} vidas medias, así que la vida media es ${th} ${u}.`),
        hv('QA-vm-desintegrada', m0 - correcta, 'Ese número es lo que se desintegró. Se pide lo que queda.'),
        hv('QA-vm-una-vida-de-menos', m0 / 2 ** (b - 1), 'Contaste una vida media de menos.'),
        hv('QA-vm-una-vida-de-mas', m0 / 2 ** (b + 1), 'Contaste una vida media de más.'),
        hv('QA-vm-divide-entre-2n', m0 / (2 * b), `Dividiste entre 2 × ${b}. Cada vida media divide entre 2 lo que queda: después de ${b} vidas medias se divide entre 2${pot(b)} = ${2 ** b}.`),
      ];
      const solucion = [
        [`De `, v('m0', `${m0} mg`), ` a ${f(m0 / 2 ** a, 2)} mg es 1/${2 ** a}: ${a} vidas medias en `, v('t', `${T1} ${u}`), '. La ', v('th', `vida media es ${th} ${u}`), '.'],
        [v('t', `${T2} ${u}`), ' ÷ ', v('th', `${th} ${u}`), ` = ${b} vidas medias: ${m0} ÷ 2${pot(b)} = `, v('q', `${f(correcta, 2)} mg`), '.'],
      ];
      return cerrar(rng, semilla, { correcta, errores, unidad: 'mg', decimales: 2, variables, enunciado, pregunta, solucion, _datos: { tipo: 'vida', sub, m0, T1, a, T2 } });
    }
    const iso = rng.elegir(ISOTOPOS), n = rng.entero(2, 5);
    const t = n * iso.t;
    const r = vidaMedia({ m0, tMedia: iso.t, t });
    const correcta = r.queda;
    const enunciado = [iso.hospital ? 'Un hospital recibe ' : 'Un laboratorio guarda una fuente sellada con ', v('m0', `${m0} mg de ${iso.s}`), ', cuya ', v('th', `vida media es ${iso.t} ${iso.u}`), '.'];
    const pregunta = ['¿Cuántos ', v('q', 'mg quedan'), ' después de ', v('t', `${t} ${iso.u}`), '?'];
    const errores = [
      hv('QA-vm-divide-entre-2n', m0 / (2 * n), `Dividiste entre 2 × ${n}. Cada vida media divide entre 2 lo que queda: después de ${n} vidas medias se divide entre 2${pot(n)} = ${2 ** n}.`),
      hv('QA-vm-desintegrada', r.desintegrado, 'Ese número es lo que se desintegró. Se pide lo que queda.'),
      hv('QA-vm-tiempo-como-una-vida', m0 / 2, `Tomaste los ${t} ${iso.u} como si fueran una sola vida media. La vida media es ${iso.t} ${iso.u}: en ${t} ${iso.u} caben ${n}.`),
      hv('QA-vm-una-vida-de-menos', m0 / 2 ** (n - 1), 'Contaste una vida media de menos.'),
      hv('QA-vm-una-vida-de-mas', m0 / 2 ** (n + 1), 'Contaste una vida media de más.'),
      hv('QA-vm-divide-entre-n', m0 / n, `Dividiste entre ${n}. No se reparte en partes iguales: en cada vida media se va la mitad de lo que queda.`),
    ];
    const solucion = [
      [v('t', `${t} ${iso.u}`), ' ÷ ', v('th', `${iso.t} ${iso.u}`), ` = ${n} vidas medias.`],
      [v('m0', `${m0} mg`), ` ÷ 2${pot(n)} = ${m0} ÷ ${2 ** n} = `, v('q', `${f(correcta, 2)} mg`), '.'],
    ];
    return cerrar(rng, semilla, { correcta, errores, unidad: 'mg', decimales: 2, variables, enunciado, pregunta, solucion, _datos: { tipo: 'vida', sub, m0, tMedia: iso.t, t } });
  }

  return { id: ID, titulo: 'Termómetros, lingotes e isótopos que se desintegran', generar, cient,
    convertir, variacion, volumenDeMetal, masaDeMetal, longitud, calorLatente, masaPorCalor, vidaMedia, tiempoPara, METALES, ISOTOPOS };
});
