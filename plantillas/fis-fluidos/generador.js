/* Práctica autónoma de Fluidos: seis ideas y dieciocho familias.
 * Las respuestas y los errores se calculan desde entradas visibles.
 * Datos contiene condiciones y equivalencias, sin fórmulas de resolución.
 * Hipótesis de errores: docs/etapa12/errores-fisica.md.
 */
(function (root, fabrica) {
  const nodo = typeof module === 'object' && module.exports;
  const api = fabrica(nodo ? require('../../nucleo/azar.js') : root.Azar, nodo ? require('../../nucleo/predicciones.js') : root.Predicciones);
  if (nodo) module.exports = api;
  else (root.Generadores = root.Generadores || {})[api.id] = api;
})(typeof self !== 'undefined' ? self : this, function (Azar, P) {
  'use strict';
  const ID = 'fis-fluidos', UNIDAD = 'fisica.fluidos', FUENTE = 'docs/etapa12/errores-fisica.md';
  const TIPOS_POR_IDEA = {
    'presion-profundidad': ['densidad-muestra', 'presion-cara', 'referencia-profundidad'],
    'vasos-comunicantes': ['manometro-signo', 'columnas-inmiscibles', 'barometro-referencia'],
    'prensa-hidraulica': ['fuerza-pistones', 'recorrido-volumen', 'prensa-desnivel'],
    empuje: ['volumen-desplazado', 'equilibrio-cuerpo', 'densidad-dos-lecturas'],
    'tension-superficial': ['pelicula-caras', 'coeficiente-pelicula', 'capilaridad-radio'],
    bernoulli: ['caudal-volumen', 'continuidad-secciones', 'bernoulli-desnivel'],
  };
  const IDEAS = Object.keys(TIPOS_POR_IDEA), TIPOS = IDEAS.flatMap(i => TIPOS_POR_IDEA[i]);
  const IDEA_DE = Object.fromEntries(IDEAS.flatMap(i => TIPOS_POR_IDEA[i].map(t => [t, i])));
  const NIVEL = Object.fromEntries(IDEAS.flatMap(i => TIPOS_POR_IDEA[i].map((t, n) => [t, n + 1])));
  const VARIABLES = {
    p: { nombre: 'presión indicada', color: 'i' }, F: { nombre: 'fuerza normal o superficial indicada', color: 'h' },
    E: { nombre: 'empuje', color: 'h' }, P: { nombre: 'peso', color: 'h' }, T: { nombre: 'tensión o fuerza de sostén', color: 'h' },
    g: { nombre: 'gravedad del modelo', color: 'h' }, t: { nombre: 'duración de la medida', color: 'h' },
    rho: { nombre: 'densidad indicada', color: 'f' }, m: { nombre: 'masa', color: 'f' }, gamma: { nombre: 'coeficiente de tensión superficial', color: 'f' }, n: { nombre: 'número de interfaces', color: 'f' },
    A: { nombre: 'área de la sección indicada', color: 'd' }, V: { nombre: 'volumen indicado', color: 'd' }, h: { nombre: 'profundidad o altura de columna', color: 'd' },
    z: { nombre: 'altura respecto del nivel elegido', color: 'd' }, ell: { nombre: 'recorrido del pistón', color: 'd' }, L: { nombre: 'longitud de contacto', color: 'd' },
    r: { nombre: 'radio del tubo', color: 'd' }, d: { nombre: 'diámetro', color: 'd' },
    v: { nombre: 'rapidez', color: 'o' }, Q: { nombre: 'caudal', color: 'o' }, W: { nombre: 'trabajo', color: 'o' },
  };
  const NOMBRES = { rho: 'ρ', gamma: 'γ', ell: 'ℓ' };
  const f = (x, decimales = 3) => P.formatear(Math.abs(x) < 1e-12 ? 0 : x, decimales);
  const red = x => Math.round(x * 1e9) / 1e9;
  const exacto = x => Math.abs(x - Math.round(x * 1000) / 1000) < 1e-9;
  const v = (k, t) => P.v(k, t), s = (k, t) => v(k, t || NOMBRES[k] || k);
  const q = (k, x, unidad = '', decimales = 3) => v(k, f(x, decimales) + (unidad ? ' ' + unidad : ''));
  const igual = (a, b) => Math.abs(a - b) <= 1e-9 * Math.max(1, Math.abs(a), Math.abs(b));
  const mostrar = (x, unidad) => `${exacto(x) ? '' : '≈ '}${f(x)}${unidad ? ' ' + unidad : ''}`;
  const error = (operacion, valor, motivo) => ({ operacion, valor, motivo });
  const tomar = (rng, xs) => rng.elegir(xs);
  function indice(semilla, n) {
    const numero = Number(semilla);
    if (Number.isFinite(numero)) return Math.abs(Math.floor(numero)) % n;
    return [...String(semilla)].reduce((s, c) => s + c.charCodeAt(0), 0) % n;
  }
  function cuenta(texto, clave, nombre, expresion, valor, unidad) {
    return [texto, s(clave, nombre), ' = ', ...expresion, exacto(valor) ? ' = ' : ' ≈ ', q(clave, valor, unidad), '.'];
  }
  const cm = '1 m = 100 cm.', areaCm = '1 m² = 10 000 cm².', volumenCm = '1 m³ = 1 000 000 cm³.', litro = '1 L = 0,001 m³.', kPa = '1 kPa = 1000 Pa.';
  const gravedad = g => `En este modelo, g = ${f(g)} m/s².`;
  const prensa = ['Pistones ideales sin masa ni roce; el mismo aire actúa afuera.', 'Líquido incompresible, sin fugas; las fuerzas son normales y adicionales.'];
  const cuerpo = ['Fluido homogéneo en reposo; el cuerpo no toca paredes ni fondo.', 'Se desprecia el empuje del aire y la tensión superficial.'];
  const flujo = ['Flujo estacionario e incompresible, sin fugas ni viscosidad apreciable.', 'Las secciones pertenecen a la misma línea de corriente.'];

  // Solo entradas; no contiene respuestas ni procedimientos. Estas reservas se verifican aparte.
  const RESERVAS = [
    ['densidad-muestra', { masaKg: 2.4, volumenL: 3 }],
    ['presion-cara', { fuerzaN: 210, areaCm2: 35 }],
    ['referencia-profundidad', { masaKg: 2.2, volumenL: 2, pSuperficialKPa: 88, pSensorKPa: 121, g: 10 }],
    ['manometro-signo', { rho: 840, g: 10, desnivelCm: 15, ramaMasAlta: 'gas', pAtmKPa: 100 }],
    ['columnas-inmiscibles', { volumenLigeroCm3: 420, areaRamaCm2: 28, rhoLigero: 840, rhoBase: 1400, g: 10 }],
    ['barometro-referencia', { pAtmInicialKPa: 102, pTopeInicialKPa: 2, alturaInicialCm: 80, pTopeFinalKPa: 4, alturaFinalCm: 72, g: 10 }],
    ['fuerza-pistones', { areaEntradaCm2: 7, areaSalidaCm2: 28, fuerzaEntradaN: 21 }],
    ['recorrido-volumen', { variante: 'diametros', diametroEntradaCm: 3, diametroSalidaCm: 6, recorridoEntradaCm: 24 }],
    ['prensa-desnivel', { areaEntradaCm2: 10, areaSalidaCm2: 30, fuerzaEntradaN: 50, rho: 1000, g: 10, alturaEntradaM: 0, alturaSalidaM: 0.4 }],
    ['volumen-desplazado', { volumenTotalCm3: 800, volumenSumergidoCm3: 300, rho: 1100, g: 10 }],
    ['equilibrio-cuerpo', { variante: 'suspension', masaKg: 1.6, volumenTotalCm3: 600, rho: 1000, g: 10 }],
    ['densidad-dos-lecturas', { lecturaAireN: 28, lecturaLiquidoN: 20, rhoLiquido: 800, g: 10 }],
    ['pelicula-caras', { caras: 2, gammaMNPorM: 34, longitudContactoCm: 14 }],
    ['coeficiente-pelicula', { fuerzaSostenMN: 11.2, masaAlambreG: 0.2, longitudContactoCm: 10, caras: 2, g: 10 }],
    ['capilaridad-radio', { fuerzaPeliculaMN: 4.4, longitudContactoCm: 10, caras: 2, rho: 1100, g: 10, ascensoCm: 2, pide: 'radio' }],
    ['caudal-volumen', { volumenL: 4.8, tiempoS: 8 }],
    ['continuidad-secciones', { variante: 'diametros', diametroEntradaCm: 4, diametroSalidaCm: 6, rapidezEntrada: 4.5 }],
    ['bernoulli-desnivel', { variante: 'tuberia', rho: 1000, g: 10, areaEntradaCm2: 9, areaSalidaCm2: 6, rapidezEntrada: 2, pEntradaKPa: 120, alturaEntradaM: 1, alturaSalidaM: 0 }],
    ['equilibrio-cuerpo', { variante: 'libre', masaKg: 0.84, volumenTotalCm3: 1200, rho: 1000, g: 10 }],
    ['bernoulli-desnivel', { variante: 'deposito', g: 10, caudalLPorS: 5.6, areaOrificioCm2: 8 }],
  ];
  const PAPEL = [0, 3, 6, 18, 13, 16, 2, 17];
  function reservaDe(semilla) {
    const papel = /^papel-([1-8])$/.exec(String(semilla));
    if (papel) return RESERVAS[PAPEL[Number(papel[1]) - 1]];
    const i = Number(semilla) - 12001;
    return Number.isInteger(i) && i >= 0 && i < RESERVAS.length ? RESERVAS[i] : null;
  }

  function entradas(tipo, rng, semilla) {
    const elegir = xs => tomar(rng, xs), g = 10;
    switch (tipo) {
      case 'densidad-muestra': { const volumenL = elegir([1.4, 1.8, 2.2, 2.6, 3.2, 3.6]); return { masaKg: red(volumenL * elegir([0.6, 0.7, 0.8, 0.9, 1.1, 1.2, 1.3])), volumenL }; }
      case 'presion-cara': { const areaCm2 = elegir([18, 24, 32, 36, 42, 48, 56, 64, 72]); return { fuerzaN: red(elegir([12, 18, 24, 30, 36, 42, 48, 54]) * areaCm2 / 10), areaCm2 }; }
      case 'referencia-profundidad': { const rho = elegir([650, 850, 1050, 1150, 1350]), volumenL = elegir([1.4, 1.8, 2.2, 2.6]), h = elegir([2, 3, 5, 6]), pSuperficialKPa = elegir([82, 86, 94, 98]); return { masaKg: red(rho * volumenL / 1000), volumenL, pSuperficialKPa, pSensorKPa: red(pSuperficialKPa + rho * g * h / 1000), g }; }
      case 'manometro-signo': return { rho: elegir([760, 840, 920, 1160, 1320]), g, desnivelCm: elegir([6, 10, 14, 18, 22, 25]), ramaMasAlta: ['abierta', 'gas'][indice(semilla, 2)], pAtmKPa: elegir([94, 98, 102]) };
      case 'columnas-inmiscibles': { const rhoBase = elegir([1100, 1300, 1400, 1500]), areaRamaCm2 = elegir([14, 20, 28, 32]); return { volumenLigeroCm3: areaRamaCm2 * elegir([12, 18, 24, 30]), areaRamaCm2, rhoLigero: red(rhoBase * elegir([0.4, 0.6, 0.7, 0.75])), rhoBase, g }; }
      case 'barometro-referencia': { const rho = elegir([11500, 12500, 13500, 14500]), alturaInicialCm = elegir([52, 56, 68, 76, 84]), pTopeInicialKPa = elegir([1, 3, 5]); return { pAtmInicialKPa: red(pTopeInicialKPa + rho * g * alturaInicialCm / 100000), pTopeInicialKPa, alturaInicialCm, pTopeFinalKPa: elegir([2, 4, 6]), alturaFinalCm: elegir([48, 60, 64, 72, 80]), g }; }
      case 'fuerza-pistones': { const areaEntradaCm2 = elegir([7, 9, 11, 14, 16]); return { areaEntradaCm2, areaSalidaCm2: areaEntradaCm2 * elegir([2, 3, 4]), fuerzaEntradaN: elegir([14, 21, 28, 35, 42]) }; }
      case 'recorrido-volumen': { const variante = ['diametros', 'trabajo'][indice(semilla, 2)], diametroEntradaCm = elegir([2, 3, 4, 5]), diametroSalidaCm = diametroEntradaCm * elegir([1.5, 2]), recorrido = elegir([12, 16, 20, 24, 28, 36]); if (variante === 'diametros') return { variante, diametroEntradaCm, diametroSalidaCm, recorridoEntradaCm: recorrido }; const fuerzaEntradaN = elegir([25, 35, 45, 55]); return { variante, diametroEntradaCm, diametroSalidaCm, trabajoEntradaJ: red(fuerzaEntradaN * recorrido / 100), fuerzaEntradaN }; }
      case 'prensa-desnivel': { const areaEntradaCm2 = elegir([5, 7, 9, 11]), areaSalidaCm2 = areaEntradaCm2 * elegir([2, 3, 4]); return { areaEntradaCm2, areaSalidaCm2, fuerzaEntradaN: red(areaEntradaCm2 * elegir([24, 36, 48, 60, 72]) / 10), rho: elegir([850, 950, 1050, 1150]), g, alturaEntradaM: 0, alturaSalidaM: elegir([0.2, 0.3, 0.4, 0.6]) }; }
      case 'volumen-desplazado': { const volumenSumergidoCm3 = elegir([200, 300, 400, 600]); return { volumenTotalCm3: volumenSumergidoCm3 * elegir([1.5, 2.5, 3]), volumenSumergidoCm3, rho: elegir([850, 950, 1100, 1300]), g }; }
      case 'equilibrio-cuerpo': { const variante = ['suspension', 'anclaje', 'libre'][indice(semilla, 3)], rho = elegir([850, 950, 1100, 1300]), volumenTotalCm3 = elegir([400, 800, 1200]), masaLiquido = rho * volumenTotalCm3 / 1e6, proporcion = elegir(variante === 'libre' ? [0.6, 0.65, 0.7, 0.75, 0.8] : [0.25, 0.4]); return { variante, masaKg: red(variante === 'suspension' ? masaLiquido / proporcion : masaLiquido * proporcion), volumenTotalCm3, rho, g }; }
      case 'densidad-dos-lecturas': { const rhoLiquido = elegir([700, 800, 1000, 1100, 1300]), volumen = elegir([400, 600, 800, 1000, 1200]) / 1e6, masa = rhoLiquido * elegir([2.5, 4]) * volumen; return { lecturaAireN: red(masa * g), lecturaLiquidoN: red(masa * g - rhoLiquido * volumen * g), rhoLiquido, g }; }
      case 'pelicula-caras': return { caras: indice(semilla, 2) + 1, gammaMNPorM: elegir([18, 22, 34, 46, 58, 62]), longitudContactoCm: elegir([6, 8, 10, 14, 16, 18, 20]) };
      case 'coeficiente-pelicula': { const gamma = elegir([18, 22, 34, 46, 58, 62]), longitudContactoCm = elegir([8, 10, 12, 14, 16, 18, 20]), masaAlambreG = elegir([0.1, 0.2, 0.3, 0.5, 0.6]), caras = 2; return { fuerzaSostenMN: red(caras * gamma * longitudContactoCm / 100 + masaAlambreG * g), masaAlambreG, longitudContactoCm, caras, g }; }
      case 'capilaridad-radio': { const [gamma, rho] = elegir([[18, 900], [22, 1100], [34, 850], [46, 1150], [58, 1450], [62, 1550]]), longitudContactoCm = elegir([8, 10, 12, 14]), caras = 2; return { fuerzaPeliculaMN: red(caras * gamma * longitudContactoCm / 100), longitudContactoCm, caras, rho, g, ascensoCm: elegir([2, 2.5, 4, 5]), pide: ['radio', 'diametro'][indice(semilla, 2)] }; }
      case 'caudal-volumen': { const tiempoS = elegir([4, 6, 8, 10]); return { volumenL: red(tiempoS * elegir([0.4, 0.6, 0.75, 1.25, 1.4, 1.6])), tiempoS }; }
      case 'continuidad-secciones': { const variante = ['areas', 'diametros'][indice(semilla, 2)], rapidezEntrada = elegir([1.8, 3.6, 4.5, 6.3, 7.2]); if (variante === 'areas') { const menor = elegir([6, 8, 10, 12, 14, 16, 18, 20]), mayor = menor * elegir([1.5, 2]), ensancha = elegir([true, false]); return { variante, areaEntradaCm2: ensancha ? menor : mayor, areaSalidaCm2: ensancha ? mayor : menor, rapidezEntrada }; } const menor = elegir([2, 3, 4]), mayor = menor * elegir([1.5, 2]), ensancha = elegir([true, false]); return { variante, diametroEntradaCm: ensancha ? menor : mayor, diametroSalidaCm: ensancha ? mayor : menor, rapidezEntrada }; }
      case 'bernoulli-desnivel': { const variante = ['tuberia', 'deposito'][indice(semilla, 2)]; if (variante === 'deposito') { const areaOrificioCm2 = elegir([3, 6, 7, 8]), rapidez = elegir([3, 5, 6, 7, 8]); if (areaOrificioCm2 === 8 && rapidez === 8) return null; return { variante, g, caudalLPorS: red(areaOrificioCm2 * rapidez / 10), areaOrificioCm2 }; } const menor = elegir([5, 7, 9, 11]), estrecha = elegir([true, false]), desnivel = elegir([0.2, 0.4, 0.6, 0.8, 1.2, 1.4]); return { variante, rho: elegir([900, 1100, 1300]), g, areaEntradaCm2: estrecha ? 2 * menor : menor, areaSalidaCm2: estrecha ? menor : 2 * menor, rapidezEntrada: elegir([2, 4, 6]), pEntradaKPa: elegir([118, 126, 138, 154, 166]), alturaEntradaM: estrecha ? desnivel : 0, alturaSalidaM: estrecha ? 0 : desnivel }; }
      default: throw new Error('Tipo sin banco: ' + tipo);
    }
  }

  const CONSTRUIR = {};
  CONSTRUIR['densidad-muestra'] = d => {
    const valor = d.masaKg / d.volumenL;
    return { valor, unidad: 'kg/L', datos: ['La muestra es homogénea y ocupa el volumen indicado.'],
      enunciado: ['Una muestra de líquido tiene masa ', q('m', d.masaKg, 'kg'), ' y volumen ', q('V', d.volumenL, 'L'), '.'], pregunta: ['¿Cuál es su densidad en kilogramos por litro?'],
      solucion: [['La densidad relaciona la masa de la muestra con el volumen que ocupa.'], cuenta('Dividimos: ', 'rho', '', [q('m', d.masaKg), ' / ', q('V', d.volumenL)], valor, 'kg/L')],
      errores: [error('INVIERTE_COCIENTE', d.volumenL / d.masaKg, 'dividiste volumen entre masa'), error('MULTIPLICA_VOLUMEN', d.masaKg * d.volumenL, 'multiplicaste masa por volumen'), error('DIVIDE_VOLUMEN_DOS_VECES', d.masaKg / d.volumenL ** 2, 'dividiste dos veces entre el volumen')] };
  };
  CONSTRUIR['presion-cara'] = d => {
    const area = d.areaCm2 / 10000, valor = d.fuerzaN / area / 1000;
    return { valor, unidad: 'kPa', datos: ['La fuerza indicada es la resultante normal sobre una sola cara plana.', areaCm, kPa],
      enunciado: ['Sobre una cara de ', q('A', d.areaCm2, 'cm²'), ' actúa una fuerza normal resultante de ', q('F', d.fuerzaN, 'N'), '.'], pregunta: ['¿Cuál es la presión media sobre esa cara, en kilopascales?'],
      solucion: [['La presión media es la fuerza normal dividida entre el área de una cara.'], cuenta('Convertimos área y presión: ', 'p', '', [q('F', d.fuerzaN), ' / (', q('A', d.areaCm2), ' / 10 000) / 1000'], valor, 'kPa')],
      errores: [error('CONVERSION_AREA_POR_DIEZ', d.fuerzaN / (d.areaCm2 / 1000) / 1000, 'dividiste el área entre mil en vez de diez mil'), error('DUPLICA_CARA', valor / 2, 'sumaste otra cara que no recibe esa fuerza'), error('USA_FUERZA_COMO_PRESION', d.fuerzaN, 'diste la cifra de fuerza como presión')] };
  };
  CONSTRUIR['referencia-profundidad'] = d => {
    const rho = d.masaKg / (d.volumenL / 1000), diferencia = (d.pSensorKPa - d.pSuperficialKPa) * 1000, valor = diferencia / (rho * d.g);
    return { valor, unidad: 'm', intermedios: { rho }, datos: ['El líquido es homogéneo y está en reposo; la muestra pertenece al mismo líquido.', 'Ambas presiones son absolutas; la profundidad se mide verticalmente desde la superficie.', gravedad(d.g), litro, kPa],
      enunciado: ['Una muestra de ', q('V', d.volumenL, 'L'), ' tiene masa ', q('m', d.masaKg, 'kg'), '. En el depósito, la superficie está a ', q('p', d.pSuperficialKPa, 'kPa'), ' y un sensor marca ', q('p', d.pSensorKPa, 'kPa'), '.'], pregunta: ['¿A qué profundidad está el sensor?'],
      solucion: [cuenta('Hallamos la densidad de la muestra: ', 'rho', '', [q('m', d.masaKg), ' / (', q('V', d.volumenL), ' / 1000)'], rho, 'kg/m³'),
        ['Restamos la referencia: ', s('p', 'presión del sensor'), ' − ', s('p', 'presión superficial'), ' = ', s('rho'), ' × ', s('g'), ' × ', s('h'), '.'],
        ['Despejamos: ', s('h'), ' = (', s('p', 'presión del sensor'), ' − ', s('p', 'presión superficial'), ') / (', s('rho'), ' × ', s('g'), ').'],
        cuenta('Reemplazamos con presiones en pascales: ', 'h', '', ['(', q('p', d.pSensorKPa), ' − ', q('p', d.pSuperficialKPa), ') × 1000 / (', q('rho', rho), ' × ', q('g', d.g), ')'], valor, 'm')],
      errores: [error('OMITE_REFERENCIA', d.pSensorKPa * 1000 / (rho * d.g), 'omitiste restar la presión superficial'), error('SUMA_REFERENCIA', (d.pSensorKPa + d.pSuperficialKPa) * 1000 / (rho * d.g), 'sumaste ambas presiones en lugar de restarlas'), error('MULTIPLICA_MUESTRA', diferencia / (d.masaKg * d.volumenL * 1000 * d.g), 'calculaste densidad multiplicando masa por volumen')] };
  };
  CONSTRUIR['manometro-signo'] = d => {
    const signo = d.ramaMasAlta === 'abierta' ? 1 : -1, valor = signo * d.rho * d.g * d.desnivelCm / 100000;
    return { valor, unidad: 'kPa', datos: ['Hay un solo líquido en reposo; una rama conecta al gas y la otra está abierta al aire.', 'La presión manométrica se mide respecto del aire exterior.', gravedad(d.g), cm, kPa],
      enunciado: ['Un manómetro contiene líquido de ', q('rho', d.rho, 'kg/m³'), '. La rama ', d.ramaMasAlta === 'abierta' ? 'abierta al aire' : 'conectada al gas', ' tiene la superficie ', q('h', d.desnivelCm, 'cm'), ' más alta. Afuera hay ', q('p', d.pAtmKPa, 'kPa'), ' absolutos.'], pregunta: ['¿Cuál es la presión manométrica del gas?'],
      solucion: [[signo > 0 ? 'El gas sostiene la columna mayor del lado abierto: su presión supera la del aire.' : 'La columna mayor queda del lado del gas: su presión es menor que la del aire.'],
        cuenta('Aplicamos ese signo al desnivel vertical: ', 'p', 'presión manométrica', [signo < 0 ? '−' : '', q('rho', d.rho), ' × ', q('g', d.g), ' × (', q('h', d.desnivelCm), ' / 100) / 1000'], valor, 'kPa')],
      errores: [error('INVIERTE_SIGNO', -valor, 'intercambiaste cuál superficie está más alta'), error('CONFUNDE_DESNIVEL_CON_DOBLE', valor / 2, 'tomaste la mitad del desnivel total indicado'), error('DUPLICA_DESNIVEL', 2 * valor, 'duplicaste un dato que ya era la separación entre superficies')] };
  };
  CONSTRUIR['columnas-inmiscibles'] = d => {
    const ligera = d.volumenLigeroCm3 / d.areaRamaCm2, base = d.rhoLigero * ligera / d.rhoBase, valor = ligera - base;
    return { valor, unidad: 'cm', intermedios: { alturaLigeraCm: ligera, alturaBaseCm: base }, datos: ['Las ramas son verticales y de sección constante; ambas superficies están al mismo aire.', 'Los líquidos están en reposo y no se mezclan; el menos denso queda encima.', gravedad(d.g)],
      enunciado: ['Sobre un líquido de ', q('rho', d.rhoBase, 'kg/m³'), ' se vierten ', q('V', d.volumenLigeroCm3, 'cm³'), ' de otro de ', q('rho', d.rhoLigero, 'kg/m³'), ', en una rama de ', q('A', d.areaRamaCm2, 'cm²'), '.'], pregunta: ['¿Qué diferencia de altura queda entre las superficies libres?'],
      solucion: [cuenta('Hallamos la columna ligera: ', 'h', 'altura ligera', [q('V', d.volumenLigeroCm3), ' / ', q('A', d.areaRamaCm2)], ligera, 'cm'),
        cuenta('Igualamos presiones a la altura de la interfaz: ', 'h', 'altura equivalente', [q('rho', d.rhoLigero), ' × ', q('h', ligera), ' / ', q('rho', d.rhoBase)], base, 'cm'),
        cuenta('Restamos ambas columnas: ', 'h', 'separación', [q('h', ligera), ' − ', q('h', base)], valor, 'cm')],
      errores: [error('DA_COLUMNA_BASE', base, 'diste la columna equivalente del líquido más denso'), error('DA_COLUMNA_LIGERA', ligera, 'diste toda la altura del líquido añadido'), error('INVIERTE_DENSIDADES', ligera * (1 - d.rhoBase / d.rhoLigero), 'invertiste las densidades al igualar las presiones')] };
  };
  CONSTRUIR['barometro-referencia'] = d => {
    const rho = (d.pAtmInicialKPa - d.pTopeInicialKPa) * 1000 / (d.g * d.alturaInicialCm / 100);
    const valor = d.pTopeFinalKPa + rho * d.g * d.alturaFinalCm / 100000;
    return { valor, unidad: 'kPa', intermedios: { rho }, datos: ['El barómetro usa el mismo líquido y la misma gravedad en ambas lecturas.', 'El líquido está en reposo; las presiones indicadas son absolutas.', gravedad(d.g), cm, kPa],
      enunciado: ['Al inicio hay ', q('p', d.pAtmInicialKPa, 'kPa'), ' afuera, ', q('p', d.pTopeInicialKPa, 'kPa'), ' sobre la columna y altura ', q('h', d.alturaInicialCm, 'cm'), '. Después, arriba hay ', q('p', d.pTopeFinalKPa, 'kPa'), ' y la columna mide ', q('h', d.alturaFinalCm, 'cm'), '.'], pregunta: ['¿Cuál es la nueva presión atmosférica absoluta?'],
      solucion: [['Despejamos la densidad: ', s('rho'), ' = (', s('p', 'presión exterior inicial'), ' − ', s('p', 'presión superior inicial'), ') / (', s('g'), ' × ', s('h', 'altura inicial'), ').'],
        cuenta('Calibramos con la primera lectura: ', 'rho', '', ['(', q('p', d.pAtmInicialKPa), ' − ', q('p', d.pTopeInicialKPa), ') × 1000 / (', q('g', d.g), ' × ', q('h', d.alturaInicialCm / 100), ')'], rho, 'kg/m³'),
        cuenta('Sumamos la referencia superior de la segunda lectura: ', 'p', 'presión exterior final', [q('p', d.pTopeFinalKPa), ' + ', q('rho', rho), ' × ', q('g', d.g), ' × ', q('h', d.alturaFinalCm / 100), ' / 1000'], valor, 'kPa')],
      errores: [error('OMITE_TOPE_INICIAL', d.pTopeFinalKPa + d.pAtmInicialKPa * d.alturaFinalCm / d.alturaInicialCm, 'supusiste vacío sobre la primera columna'), error('OMITE_TOPE_FINAL', (d.pAtmInicialKPa - d.pTopeInicialKPa) * d.alturaFinalCm / d.alturaInicialCm, 'supusiste vacío sobre la segunda columna'), error('INVIERTE_ALTURAS', d.pTopeFinalKPa + (d.pAtmInicialKPa - d.pTopeInicialKPa) * d.alturaInicialCm / d.alturaFinalCm, 'invertiste la razón de alturas entre las dos lecturas')] };
  };

  CONSTRUIR['fuerza-pistones'] = d => {
    const razon = d.areaSalidaCm2 / d.areaEntradaCm2, valor = d.fuerzaEntradaN * razon;
    return { valor, unidad: 'N', datos: [...prensa, 'Los pistones tienen ejes horizontales a la misma cota y están en equilibrio.'],
      enunciado: ['Una prensa tiene áreas de entrada ', q('A', d.areaEntradaCm2, 'cm²'), ' y salida ', q('A', d.areaSalidaCm2, 'cm²'), '. La fuerza de entrada es ', q('F', d.fuerzaEntradaN, 'N'), '.'], pregunta: ['¿Qué fuerza exterior resistente equilibra el pistón de salida?'],
      solucion: [['Igualamos las presiones añadidas y despejamos: ', s('F', 'fuerza de salida'), ' = ', s('F', 'fuerza de entrada'), ' × ', s('A', 'área de salida'), ' / ', s('A', 'área de entrada'), '.'],
        cuenta('Las áreas usan la misma unidad: ', 'F', 'fuerza de salida', [q('F', d.fuerzaEntradaN), ' × ', q('A', d.areaSalidaCm2), ' / ', q('A', d.areaEntradaCm2)], valor, 'N')],
      errores: [error('CONSERVA_FUERZA', d.fuerzaEntradaN, 'conservaste la fuerza en vez de la presión añadida'), error('INVIERTE_AREAS', d.fuerzaEntradaN / razon, 'invertiste la razón de áreas'), error('CUADRA_AREAS', d.fuerzaEntradaN * razon ** 2, 'elevaste al cuadrado una razón que ya compara áreas')] };
  };
  CONSTRUIR['recorrido-volumen'] = d => {
    const trabajo = d.variante === 'trabajo', recorrido = trabajo ? d.trabajoEntradaJ / d.fuerzaEntradaN * 100 : d.recorridoEntradaCm;
    if (d.diametroEntradaCm === 4 && d.diametroSalidaCm === 8 && igual(recorrido, 24)) return null; // Sistema del ejemplo 12 de prensa.
    const razon = d.diametroSalidaCm / d.diametroEntradaCm, valor = recorrido / razon ** 2;
    const solucion = [['El volumen transferido es el mismo: ', s('ell', 'recorrido de salida'), ' = ', s('ell', 'recorrido de entrada'), ' × (', s('d', 'diámetro de entrada'), ' / ', s('d', 'diámetro de salida'), ')².']];
    if (trabajo) solucion.unshift(cuenta('Despejamos el recorrido de entrada del trabajo: ', 'ell', 'recorrido de entrada', [q('W', d.trabajoEntradaJ), ' / ', q('F', d.fuerzaEntradaN), ' × 100'], recorrido, 'cm'));
    solucion.push(cuenta('Reemplazamos los diámetros: ', 'ell', 'recorrido de salida', [q('ell', recorrido), ' × (', q('d', d.diametroEntradaCm), ' / ', q('d', d.diametroSalidaCm), ')²'], valor, 'cm'));
    return { valor, unidad: 'cm', intermedios: { recorridoEntradaM: recorrido / 100 }, datos: [...prensa, 'Los ejes son horizontales a igual cota; el movimiento es cuasiestático y sin pérdidas.', 'Las caras de los pistones son circulares.', cm],
      enunciado: ['Los diámetros de una prensa son ', q('d', d.diametroEntradaCm, 'cm'), ' a la entrada y ', q('d', d.diametroSalidaCm, 'cm'), ' a la salida. ', ...(trabajo ? ['La entrada recibe ', q('W', d.trabajoEntradaJ, 'J'), ' de trabajo mediante una fuerza constante de ', q('F', d.fuerzaEntradaN, 'N'), '.'] : ['El pistón de entrada avanza ', q('ell', d.recorridoEntradaCm, 'cm'), '.'])],
      pregunta: ['¿Cuánto avanza el pistón de salida?'], solucion,
      errores: [error('USA_DIAMETROS', recorrido / razon, 'usaste la razón de diámetros como razón de áreas'), error('OMITE_CAMBIO_DE_AREA', recorrido, 'asignaste a ambos pistones el mismo recorrido'), error('CUADRA_AREAS', recorrido / razon ** 4, 'volviste a elevar al cuadrado la razón de áreas')] };
  };
  CONSTRUIR['prensa-desnivel'] = d => {
    const entrada = d.areaEntradaCm2 / 10000, salida = d.areaSalidaCm2 / 10000, p1 = d.fuerzaEntradaN / entrada;
    const dz = d.alturaSalidaM - d.alturaEntradaM, p2 = p1 - d.rho * d.g * dz, valor = p2 * salida;
    if (!(dz > 0 && p2 > 0)) return null;
    return { valor, unidad: 'N', intermedios: { presionEntradaPa: p1, presionSalidaPa: p2 }, datos: [...prensa, 'Las cotas de los centros de las caras usan el mismo nivel; el conjunto está en equilibrio estático.', gravedad(d.g), areaCm],
      enunciado: ['La entrada tiene ', q('A', d.areaEntradaCm2, 'cm²'), ', fuerza ', q('F', d.fuerzaEntradaN, 'N'), ' y cota ', q('z', d.alturaEntradaM, 'm'), '. La salida tiene ', q('A', d.areaSalidaCm2, 'cm²'), ' y cota ', q('z', d.alturaSalidaM, 'm'), '. El líquido tiene densidad ', q('rho', d.rho, 'kg/m³'), '.'], pregunta: ['¿Qué fuerza exterior resistente equilibra la salida?'],
      solucion: [cuenta('Calculamos la presión adicional de entrada: ', 'p', 'presión de entrada', [q('F', d.fuerzaEntradaN), ' / (', q('A', d.areaEntradaCm2), ' / 10 000)'], p1, 'Pa'),
        cuenta('Despejamos la presión a la cota superior: ', 'p', 'presión de salida', [q('p', p1), ' − ', q('rho', d.rho), ' × ', q('g', d.g), ' × (', q('z', d.alturaSalidaM), ' − ', q('z', d.alturaEntradaM), ')'], p2, 'Pa'),
        cuenta('Aplicamos esa presión al área de salida: ', 'F', 'fuerza de salida', [q('p', p2), ' × (', q('A', d.areaSalidaCm2), ' / 10 000)'], valor, 'N')],
      errores: [error('OMITE_DESNIVEL', p1 * salida, 'conservaste la presión pese al cambio de altura'), error('INVIERTE_DESNIVEL', (p1 + d.rho * d.g * dz) * salida, 'aumentaste la presión al subir'), error('USA_AREA_ENTRADA', p2 * entrada, 'aplicaste la presión de salida al área del otro pistón')] };
  };
  CONSTRUIR['volumen-desplazado'] = d => {
    const valor = d.rho * d.g * d.volumenSumergidoCm3 / 1e6;
    return { valor, unidad: 'N', datos: [...cuerpo, gravedad(d.g), volumenCm],
      enunciado: ['Un cuerpo tiene volumen total ', q('V', d.volumenTotalCm3, 'cm³'), '; de ellos, ', q('V', d.volumenSumergidoCm3, 'cm³'), ' están sumergidos en un líquido de ', q('rho', d.rho, 'kg/m³'), '.'], pregunta: ['¿Cuál es el empuje sobre el cuerpo?'],
      solucion: [['El volumen desplazado coincide con la parte sumergida, aunque el cuerpo tenga una parte fuera del líquido.'],
        cuenta('Calculamos el peso del líquido desplazado: ', 'E', '', [q('rho', d.rho), ' × ', q('g', d.g), ' × (', q('V', d.volumenSumergidoCm3), ' / 1 000 000)'], valor, 'N')],
      errores: [error('USA_VOLUMEN_TOTAL', d.rho * d.g * d.volumenTotalCm3 / 1e6, 'usaste también el volumen que está fuera del líquido'), error('USA_VOLUMEN_EMERGIDO', d.rho * d.g * (d.volumenTotalCm3 - d.volumenSumergidoCm3) / 1e6, 'tomaste la parte emergida como volumen desplazado'), error('OMITE_GRAVEDAD', d.rho * d.volumenSumergidoCm3 / 1e6, 'diste la masa desplazada como si fuera una fuerza')] };
  };
  CONSTRUIR['equilibrio-cuerpo'] = d => {
    const libre = d.variante === 'libre', superior = d.variante === 'suspension', peso = d.masaKg * d.g, empuje = d.rho * d.g * d.volumenTotalCm3 / 1e6;
    const volumen = d.masaKg / d.rho * 1e6, valor = libre ? 100 * volumen / d.volumenTotalCm3 : superior ? peso - empuje : empuje - peso;
    if (!(valor > 0) || (libre && !(valor < 100))) return null;
    const enunciado = ['Un cuerpo de ', q('m', d.masaKg, 'kg'), ' y ', q('V', d.volumenTotalCm3, 'cm³'), ' está en un líquido de ', q('rho', d.rho, 'kg/m³'), '. ', libre ? 'Flota libremente en equilibrio.' : superior ? 'Una cuerda superior lo mantiene totalmente sumergido.' : 'Una cuerda anclada abajo lo mantiene totalmente sumergido.'];
    const solucion = libre ? [
      ['En flotación libre, el empuje equilibra el peso. La gravedad se cancela al despejar el volumen sumergido.'],
      cuenta('Despejamos y expresamos el volumen en centímetros cúbicos: ', 'V', 'volumen sumergido', [q('m', d.masaKg), ' / ', q('rho', d.rho), ' × 1 000 000'], volumen, 'cm³'),
      cuenta('Comparamos con el volumen total: ', 'V', 'porcentaje sumergido', ['100 × ', q('V', volumen), ' / ', q('V', d.volumenTotalCm3)], valor, '%'),
    ] : [cuenta('Calculamos el peso: ', 'P', '', [q('m', d.masaKg), ' × ', q('g', d.g)], peso, 'N'),
      cuenta('Calculamos el empuje con todo el cuerpo sumergido: ', 'E', '', [q('rho', d.rho), ' × ', q('g', d.g), ' × (', q('V', d.volumenTotalCm3), ' / 1 000 000)'], empuje, 'N'),
      cuenta(superior ? 'La cuerda tira hacia arriba; despejamos la tensión: ' : 'La cuerda tira hacia abajo; despejamos la tensión: ', 'T', '', superior ? [q('P', peso), ' − ', q('E', empuje)] : [q('E', empuje), ' − ', q('P', peso)], valor, 'N')];
    const errores = libre ? [error('USA_VOLUMEN_TOTAL', 100, 'supusiste que todo el cuerpo estaba sumergido'), error('DA_PORCENTAJE_EMERGIDO', 100 - valor, 'diste la parte emergida en lugar de la sumergida'), error('INVIERTE_DENSIDADES', 10000 / valor, 'invertiste la razón de densidades al hallar la fracción')] :
      [error('USA_PESO_SOLO', peso, 'tomaste el peso como tensión y omitiste el empuje'), error('USA_EMPUJE_SOLO', empuje, 'tomaste el empuje como tensión y omitiste el peso'), error('SUMA_FUERZAS', peso + empuje, 'sumaste peso y empuje pese a sus sentidos opuestos')];
    return { valor, unidad: libre ? '%' : 'N', intermedios: { pesoN: peso, empujeCompletoN: empuje }, enunciado,
      pregunta: [libre ? '¿Qué porcentaje de su volumen queda sumergido?' : '¿Cuál es la tensión de la cuerda?'],
      datos: [...cuerpo, libre ? 'No hay cuerda ni sostén; el cuerpo mantiene una orientación estable.' : 'La cuerda es ideal y el cuerpo está en equilibrio.', gravedad(d.g), volumenCm], solucion, errores };
  };
  CONSTRUIR['densidad-dos-lecturas'] = d => {
    const masa = d.lecturaAireN / d.g, empuje = d.lecturaAireN - d.lecturaLiquidoN, volumenCm3 = empuje / (d.rhoLiquido * d.g) * 1e6;
    const valor = masa / (volumenCm3 / 1e6);
    return { valor, unidad: 'kg/m³', intermedios: { masaKg: masa, volumenM3: volumenCm3 / 1e6 }, datos: [...cuerpo, 'El cuerpo es homogéneo; el dinamómetro lo sostiene desde arriba en equilibrio.', 'La segunda lectura corresponde al cuerpo totalmente sumergido en el líquido.', gravedad(d.g), volumenCm],
      enunciado: ['Un dinamómetro marca ', q('T', d.lecturaAireN, 'N'), ' al sostener un cuerpo en aire y ', q('T', d.lecturaLiquidoN, 'N'), ' al sumergirlo en un líquido de ', q('rho', d.rhoLiquido, 'kg/m³'), '.'], pregunta: ['¿Cuál es la densidad del cuerpo?'],
      solucion: [cuenta('La lectura en aire permite despejar la masa: ', 'm', '', [q('T', d.lecturaAireN), ' / ', q('g', d.g)], masa, 'kg'),
        cuenta('El empuje explica la reducción de lectura: ', 'E', '', [q('T', d.lecturaAireN), ' − ', q('T', d.lecturaLiquidoN)], empuje, 'N'),
        cuenta('Despejamos el volumen desplazado: ', 'V', '', [q('E', empuje), ' × 1 000 000 / (', q('rho', d.rhoLiquido), ' × ', q('g', d.g), ')'], volumenCm3, 'cm³'),
        cuenta('Dividimos masa entre volumen del cuerpo: ', 'rho', 'densidad del cuerpo', [q('m', masa), ' / (', q('V', volumenCm3), ' / 1 000 000)'], valor, 'kg/m³')],
      errores: [error('USA_LECTURA_LIQUIDO', d.lecturaLiquidoN * d.rhoLiquido / empuje, 'calculaste la masa con la lectura dentro del líquido'), error('SUMA_EN_DENOMINADOR', d.lecturaAireN * d.rhoLiquido / (d.lecturaAireN + d.lecturaLiquidoN), 'sumaste las lecturas para hallar el empuje'), error('SUMA_EN_NUMERADOR', (d.lecturaAireN + d.lecturaLiquidoN) * d.rhoLiquido / empuje, 'sumaste ambas lecturas para hallar el peso del cuerpo')] };
  };
  CONSTRUIR['pelicula-caras'] = d => {
    const longitud = d.longitudContactoCm / 100, valor = d.caras * d.gammaMNPorM * longitud;
    return { valor, unidad: 'mN', datos: ['La tracción de cada interfaz es perpendicular al borde y apunta en el mismo sentido.', 'El coeficiente es uniforme a lo largo del contacto.', cm, '1 N = 1000 mN.'],
      enunciado: ['Un borde recto de ', q('L', d.longitudContactoCm, 'cm'), ' recibe la tracción de ', q('n', d.caras), d.caras === 1 ? ' interfaz' : ' interfaces', ', con coeficiente ', q('gamma', d.gammaMNPorM, 'mN/m'), '.'], pregunta: ['¿Cuál es la fuerza superficial total sobre el borde?'],
      solucion: [['Sumamos la contribución de cada interfaz: ', s('F'), ' = ', s('n'), ' × ', s('gamma'), ' × ', s('L'), '.'],
        cuenta('Usamos el contacto en metros: ', 'F', '', [q('n', d.caras), ' × ', q('gamma', d.gammaMNPorM), ' × (', q('L', d.longitudContactoCm), ' / 100)'], valor, 'mN')],
      errores: [error('CAMBIA_NUMERO_CARAS', (d.caras === 2 ? 1 : 2) * d.gammaMNPorM * longitud, d.caras === 2 ? 'contaste solo una de las dos interfaces' : 'contaste dos interfaces cuando solo hay una'), error('USA_AREA_EN_VEZ_CONTACTO', d.caras * d.gammaMNPorM * longitud ** 2, 'elevaste al cuadrado el contacto como si se pidiera un área'), error('USA_COEFICIENTE_COMO_FUERZA', d.gammaMNPorM, 'diste el coeficiente como si fuera una fuerza')] };
  };
  CONSTRUIR['coeficiente-pelicula'] = d => {
    const peso = d.masaAlambreG * d.g, superficial = d.fuerzaSostenMN - peso, contacto = d.longitudContactoCm / 100;
    if (!(superficial > 0)) return null;
    const valor = superficial / (d.caras * contacto);
    return { valor, unidad: 'mN/m', intermedios: { pesoMN: peso, fuerzaSuperficialMN: superficial },
      enunciado: ['Un alambre de ', q('m', d.masaAlambreG, 'g'), ' forma el borde superior de una película de ', q('n', d.caras), ' caras, con ', q('L', d.longitudContactoCm, 'cm'), ' de contacto. El sostén ejerce ', q('T', d.fuerzaSostenMN, 'mN'), ' hacia arriba.'], pregunta: ['¿Cuál es el coeficiente de tensión superficial?'],
      datos: ['El alambre horizontal está en equilibrio y la película vertical queda debajo.', 'Peso y tracción superficial apuntan hacia abajo; el sostén apunta hacia arriba.', gravedad(d.g), cm, '1 g = 0,001 kg; 1 N = 1000 mN.'],
      solucion: [cuenta('Expresamos el peso en milinewtons: ', 'P', '', ['(', q('m', d.masaAlambreG), ' / 1000) × ', q('g', d.g), ' × 1000'], peso, 'mN'),
        cuenta('Despejamos la fuerza superficial del equilibrio: ', 'F', 'fuerza superficial', [q('T', d.fuerzaSostenMN), ' − ', q('P', peso)], superficial, 'mN'),
        cuenta('Dividimos por el contacto de todas las caras: ', 'gamma', '', [q('F', superficial), ' / (', q('n', d.caras), ' × (', q('L', d.longitudContactoCm), ' / 100))'], valor, 'mN/m')],
      errores: [error('IGNORA_PESO', d.fuerzaSostenMN / (d.caras * contacto), 'atribuiste toda la fuerza de sostén a la película'), error('SUMA_PESO', (d.fuerzaSostenMN + peso) / (d.caras * contacto), 'sumaste el peso en vez de descontarlo del sostén'), error('DUPLICA_CARAS', superficial / (2 * d.caras * contacto), 'contaste otra vez las dos caras de la película')] };
  };
  CONSTRUIR['capilaridad-radio'] = d => {
    const gammaMN = d.fuerzaPeliculaMN / (d.caras * d.longitudContactoCm / 100), altura = d.ascensoCm / 100;
    const radioM = 2 * (gammaMN / 1000) / (d.rho * d.g * altura), radioMM = radioM * 1000, diametro = d.pide === 'diametro', valor = radioMM * (diametro ? 2 : 1);
    if (!(altura / radioM >= 40)) return null;
    const solucion = [cuenta('Calibramos el coeficiente con la película: ', 'gamma', '', [q('F', d.fuerzaPeliculaMN), ' / (', q('n', d.caras), ' × (', q('L', d.longitudContactoCm), ' / 100))'], gammaMN, 'mN/m'),
      ['Del equilibrio entre contacto y peso despejamos: ', s('r'), ' = 2 × ', s('gamma'), ' / (', s('rho'), ' × ', s('g'), ' × ', s('h'), ').'],
      cuenta('Convertimos el coeficiente y damos el radio en milímetros: ', 'r', '', ['2 × (', q('gamma', gammaMN), ' / 1000) × 1000 / (', q('rho', d.rho), ' × ', q('g', d.g), ' × (', q('h', d.ascensoCm), ' / 100))'], radioMM, 'mm')];
    if (diametro) solucion.push(cuenta('El diámetro abarca dos radios: ', 'd', '', ['2 × ', q('r', radioMM)], valor, 'mm'));
    return { valor, unidad: 'mm', intermedios: { gammaNPorM: gammaMN / 1000, radioM },
      enunciado: ['Una película de ', q('n', d.caras), ' caras ejerce ', q('F', d.fuerzaPeliculaMN, 'mN'), ' sobre un contacto de ', q('L', d.longitudContactoCm, 'cm'), '. El mismo líquido, de ', q('rho', d.rho, 'kg/m³'), ', asciende ', q('h', d.ascensoCm, 'cm'), ' en un tubo capilar.'], pregunta: [diametro ? '¿Cuál es el diámetro interior del tubo?' : '¿Cuál es el radio interior del tubo?'],
      datos: ['Tubo circular vertical y depósito grande; el líquido está en equilibrio.', 'El ángulo de contacto es 0°; el volumen del menisco es despreciable.', 'La tracción de cada cara de la película es perpendicular al borde.', gravedad(d.g), '1 m = 100 cm = 1000 mm.', '1 N = 1000 mN.'], solucion,
      errores: [error('OMITE_CARAS_CALIBRACION', valor * d.caras, 'calibraste el coeficiente como si la película tuviera una sola cara'), error(diametro ? 'DA_RADIO' : 'OMITE_FACTOR_DOS', valor / 2, diametro ? 'entregaste el radio cuando se pidió el diámetro' : 'omitiste el factor dos al despejar el radio'), error('CONVERSION_ALTURA_POR_DIEZ', valor / 10, 'dividiste los centímetros entre diez en vez de cien')] };
  };
  CONSTRUIR['caudal-volumen'] = d => {
    const valor = d.volumenL / d.tiempoS;
    return { valor, unidad: 'L/s', datos: ['El flujo es constante y se recoge todo el líquido que sale durante la medida.'],
      enunciado: ['Por una salida se recogen ', q('V', d.volumenL, 'L'), ' de líquido en ', q('t', d.tiempoS, 's'), '.'], pregunta: ['¿Cuál es el caudal, en litros por segundo?'],
      solucion: [['El caudal indica el volumen transportado por unidad de tiempo.'], cuenta('Dividimos el volumen entre la duración: ', 'Q', '', [q('V', d.volumenL), ' / ', q('t', d.tiempoS)], valor, 'L/s')],
      errores: [error('INVIERTE_COCIENTE', d.tiempoS / d.volumenL, 'dividiste tiempo entre volumen'), error('OMITE_TIEMPO', d.volumenL, 'diste el volumen recogido como si fuera caudal'), error('DIVIDE_TIEMPO_DOS_VECES', d.volumenL / d.tiempoS ** 2, 'dividiste dos veces entre la duración')] };
  };
  CONSTRUIR['continuidad-secciones'] = d => {
    const diametros = d.variante === 'diametros', razon = diametros ? (d.diametroEntradaCm / d.diametroSalidaCm) ** 2 : d.areaEntradaCm2 / d.areaSalidaCm2;
    const valor = d.rapidezEntrada * razon;
    return { valor, unidad: 'm/s', datos: diametros ? [...flujo, 'Ambas secciones son circulares.'] : flujo,
      enunciado: ['Un líquido entra a ', q('v', d.rapidezEntrada, 'm/s'), '. ', ...(diametros ? ['El diámetro pasa de ', q('d', d.diametroEntradaCm, 'cm'), ' en la entrada a ', q('d', d.diametroSalidaCm, 'cm'), ' en la salida.'] : ['El área pasa de ', q('A', d.areaEntradaCm2, 'cm²'), ' en la entrada a ', q('A', d.areaSalidaCm2, 'cm²'), ' en la salida.'])], pregunta: ['¿Cuál es la rapidez en la sección de salida?'],
      solucion: [[diametros ? 'Conservamos el caudal; la razón de áreas es el cuadrado de la razón de diámetros.' : 'Conservamos el caudal y despejamos la rapidez: área de entrada por rapidez de entrada, dividida entre área de salida.'],
        cuenta('Reemplazamos las cantidades: ', 'v', 'rapidez de salida', diametros ? [q('v', d.rapidezEntrada), ' × (', q('d', d.diametroEntradaCm), ' / ', q('d', d.diametroSalidaCm), ')²'] : [q('v', d.rapidezEntrada), ' × ', q('A', d.areaEntradaCm2), ' / ', q('A', d.areaSalidaCm2)], valor, 'm/s')],
      errores: [error(diametros ? 'USA_DIAMETROS' : 'INVIERTE_AREAS', d.rapidezEntrada * (diametros ? d.diametroEntradaCm / d.diametroSalidaCm : 1 / razon), diametros ? 'usaste diámetros directamente como si fueran áreas' : 'invertiste la razón de áreas'), error('CONSERVA_RAPIDEZ', d.rapidezEntrada, 'conservaste la rapidez en vez del caudal'), error('CUADRA_AREAS', d.rapidezEntrada * razon ** 2, 'elevaste al cuadrado una razón que ya compara áreas')] };
  };
  CONSTRUIR['bernoulli-desnivel'] = d => {
    if (d.variante === 'deposito') {
      const velocidad = 10 * d.caudalLPorS / d.areaOrificioCm2, valor = velocidad ** 2 / (2 * d.g);
      return { valor, unidad: 'm', intermedios: { rapidezSalida: velocidad },
        enunciado: ['Un depósito grande descarga ', q('Q', d.caudalLPorS, 'L/s'), ' por un orificio de ', q('A', d.areaOrificioCm2, 'cm²'), '.'], pregunta: ['¿A qué altura sobre el orificio está la superficie del líquido?'],
        datos: ['Superficie y orificio están al mismo aire; el líquido es incompresible y se desprecia la viscosidad.', 'El área del depósito es mucho mayor; su nivel cambia de forma despreciable durante la medida.', gravedad(d.g), litro, areaCm],
        solucion: [cuenta('Hallamos la rapidez mediante el caudal: ', 'v', '', ['(', q('Q', d.caudalLPorS), ' / 1000) / (', q('A', d.areaOrificioCm2), ' / 10 000)'], velocidad, 'm/s'),
          ['La energía permite despejar la altura: ', s('h'), ' = ', s('v'), '² / (2 × ', s('g'), ').'],
          cuenta('Reemplazamos la rapidez obtenida: ', 'h', '', [q('v', velocidad), '² / (2 × ', q('g', d.g), ')'], valor, 'm')],
        errores: [error('OMITE_FACTOR_DOS', velocidad ** 2 / d.g, 'omitiste el dos que proviene de la energía cinética'), error('DUPLICA_AREA_ORIFICIO', (velocidad / 2) ** 2 / (2 * d.g), 'usaste el doble del área de salida al hallar rapidez'), error('USA_CAUDAL_COMO_RAPIDEZ', d.caudalLPorS ** 2 / (2 * d.g), 'tomaste la cifra de caudal como rapidez')] };
    }
    const velocidad = d.rapidezEntrada * d.areaEntradaCm2 / d.areaSalidaCm2;
    const cinetica = d.rho * (d.rapidezEntrada ** 2 - velocidad ** 2) / 2000, altura = d.rho * d.g * (d.alturaEntradaM - d.alturaSalidaM) / 1000;
    const valor = d.pEntradaKPa + cinetica + altura;
    if (cinetica * altura >= 0 || igual(cinetica + altura, 0) || valor <= 0) return null;
    return { valor, unidad: 'kPa', intermedios: { rapidezSalida: velocidad, cambioCineticoKPa: cinetica, cambioAlturaKPa: altura },
      enunciado: ['Un líquido de ', q('rho', d.rho, 'kg/m³'), ' entra por una sección de ', q('A', d.areaEntradaCm2, 'cm²'), ', a ', q('v', d.rapidezEntrada, 'm/s'), ', con presión ', q('p', d.pEntradaKPa, 'kPa'), ' y cota ', q('z', d.alturaEntradaM, 'm'), '. La salida tiene ', q('A', d.areaSalidaCm2, 'cm²'), ' y cota ', q('z', d.alturaSalidaM, 'm'), '.'], pregunta: ['¿Cuál es la presión absoluta en la salida?'],
      datos: [...flujo, 'Las presiones son absolutas y las cotas usan el mismo nivel de referencia.', gravedad(d.g), kPa],
      solucion: [cuenta('Conservamos el caudal para hallar la rapidez: ', 'v', 'rapidez de salida', [q('v', d.rapidezEntrada), ' × ', q('A', d.areaEntradaCm2), ' / ', q('A', d.areaSalidaCm2)], velocidad, 'm/s'),
        cuenta('Al despejar presión, el cambio por rapidez es: ', 'p', 'cambio por rapidez', [q('rho', d.rho), ' × (', q('v', d.rapidezEntrada), '² − ', q('v', velocidad), '²) / 2000'], cinetica, 'kPa'),
        cuenta('El cambio por altura es: ', 'p', 'cambio por altura', [q('rho', d.rho), ' × ', q('g', d.g), ' × (', q('z', d.alturaEntradaM), ' − ', q('z', d.alturaSalidaM), ') / 1000'], altura, 'kPa'),
        cuenta('Sumamos ambos cambios a la presión inicial: ', 'p', 'presión de salida', [q('p', d.pEntradaKPa), ' + (', q('p', cinetica), ') + (', q('p', altura), ')'], valor, 'kPa')],
      errores: [error('INVIERTE_CAMBIO_CINETICO', d.pEntradaKPa - cinetica + altura, 'cambiaste el signo de la contribución de rapidez'), error('INVIERTE_CAMBIO_ALTURA', d.pEntradaKPa + cinetica - altura, 'cambiaste el signo de la contribución de altura'), error('CONSERVA_RAPIDEZ', d.pEntradaKPa + altura, 'conservaste la rapidez aunque cambió el área')] };
  };

  function cerrar(semilla, tipo, d, c, rng) {
    if (!c || !Number.isFinite(c.valor) || c.valor === 0) return null;
    const textos = [mostrar(c.valor, c.unidad)], valores = [c.valor], errores = [];
    for (const e of c.errores) {
      const texto = mostrar(e.valor, c.unidad);
      if (!Number.isFinite(e.valor) || valores.some(x => igual(x, e.valor)) || textos.includes(texto) || !P.enEscala(e.valor, c.valor)) return null;
      valores.push(e.valor); textos.push(texto);
      errores.push({ id: `FLP-${tipo.toUpperCase()}-${e.operacion}`, valor: e.valor, texto,
        explicacion: `Identificaste los datos; ${e.motivo}. Obtienes ${texto}.`, respaldo: 'hipotesis', fuente: FUENTE });
    }
    if (errores.length !== 3) throw new Error('Cada caso necesita tres errores calculados.');
    const alternativas = P.armar({ correcta: c.valor, errores, rng, total: 4, negativos: true, texto: x => mostrar(x, c.unidad) });
    if (alternativas.length !== 4) return null;
    const usadas = new Set(), visitar = x => { if (Array.isArray(x)) x.forEach(visitar); else if (x && typeof x === 'object' && x.v) usadas.add(x.v); };
    [c.enunciado, c.pregunta, c.solucion].forEach(visitar);
    return { id: `${ID}#${semilla}`, variables: Object.fromEntries([...usadas].map(k => [k, { ...VARIABLES[k] }])),
      enunciado: c.enunciado, pregunta: c.pregunta, datos: c.datos, alternativas, solucion: c.solucion,
      respuesta: { valor: c.valor, unidad: c.unidad }, _datos: { idea: IDEA_DE[tipo], tipo, nivel: NIVEL[tipo], ...d },
      _verificacion: { intermedios: c.intermedios || {}, errores: c.errores.map(e => ({ id: `FLP-${tipo.toUpperCase()}-${e.operacion}`, operacion: e.operacion, valor: e.valor })) } };
  }
  function generar(semilla, opciones) {
    const o = typeof opciones === 'string' ? { unidad: opciones } : opciones || {};
    if (o.unidad && o.unidad !== UNIDAD) throw new Error('fis-fluidos: unidad ajena');
    if (o.idea && !TIPOS_POR_IDEA[o.idea]) throw new Error('fis-fluidos: idea desconocida');
    if (o.tipo && !TIPOS.includes(o.tipo)) throw new Error('fis-fluidos: tipo desconocido');
    if (o.tipo && o.idea && IDEA_DE[o.tipo] !== o.idea) throw new Error('fis-fluidos: tipo ajeno a la idea');
    const reserva = reservaDe(semilla), selector = Azar.crear(`${ID}|seleccion|${semilla}`);
    const tipo = o.tipo || (!o.idea && reserva && reserva[0]) || tomar(selector, TIPOS_POR_IDEA[o.idea || tomar(selector, IDEAS)]);
    const fija = reserva && reserva[0] === tipo ? reserva[1] : null;
    const rng = Azar.crear(`${ID}|${tipo}|${semilla}`);
    if (!CONSTRUIR[tipo]) throw new Error('Familia todavía en implementación: ' + tipo);
    for (let intento = 0; intento < 400; intento++) {
      const d = fija ? { ...fija } : entradas(tipo, rng, semilla);
      const c = d && CONSTRUIR[tipo](d), p = c && cerrar(semilla, tipo, d, c, rng);
      if (p) return p;
      if (fija) throw new Error('Reserva inválida: ' + semilla);
    }
    throw new Error(`fis-fluidos: no se obtuvieron opciones válidas para ${tipo}, semilla ${semilla}`);
  }
  return { id: ID, titulo: 'Fluidos: presión, empuje y flujo', generar, TIPOS_POR_IDEA, TIPOS, NIVEL };
});
