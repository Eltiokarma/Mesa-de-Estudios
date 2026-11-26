/* Práctica propia de las seis ideas de Gravitación, etapa 10.
 * Todos los valores son modelos ideales, no mediciones de satélites reales.
 * Física local y determinista; funciona en Node y navegador, sin XHR ni motor ajeno.
 * _datos conserva solo entradas. El oráculo independiente recalcula resultados,
 * distractores y cuentas visibles en 400 semillas de cada tipo.
 * Masas f; distancias i; fuerzas h; rapideces o; tiempos d. Campo y energías en tinta.
 * Los errores GRP son hipótesis: docs/etapa10/errores-fisica.md.
 */
(function (root, fabrica) {
  const nodo = typeof module === 'object' && module.exports;
  const api = fabrica(nodo ? require('../../nucleo/azar.js') : root.Azar, nodo ? require('../../nucleo/predicciones.js') : root.Predicciones);
  if (nodo) module.exports = api;
  else (root.Generadores = root.Generadores || {})[api.id] = api;
})(typeof self !== 'undefined' ? self : this, function (Azar, P) {
  'use strict';
  const ID = 'fis-gravitacion', UNIDAD = 'fisica.gravitacion', FUENTE = 'docs/etapa10/errores-fisica.md';
  const TIPOS_POR_IDEA = {
    'cuadrado-inverso': ['fuerza', 'factores-fuerza', 'superposicion'],
    'campo-gravitatorio': ['campo', 'peso-altura', 'campo-nulo'],
    'energia-gravitatoria': ['potencial', 'trabajo-radial', 'rapidez-energia'],
    'orbita-circular': ['circular', 'periodo-altura', 'altura-otra-orbita'],
    'leyes-de-kepler': ['semieje', 'sector-tiempo', 'kepler-extremos'],
    escape: ['escape', 'escape-superficie', 'escape-radial'],
  };
  const IDEAS = Object.keys(TIPOS_POR_IDEA), TIPOS = IDEAS.flatMap(i => TIPOS_POR_IDEA[i]);
  const IDEA = Object.fromEntries(IDEAS.flatMap(i => TIPOS_POR_IDEA[i].map(t => [t, i])));
  const NIVEL = Object.fromEntries(IDEAS.flatMap(i => TIPOS_POR_IDEA[i].map((t, j) => [t, j + 1])));
  const PAPEL = { 'papel-1': 'fuerza', 'papel-2': 'campo', 'papel-3': 'potencial', 'papel-4': 'circular',
    'papel-5': 'semieje', 'papel-6': 'escape-radial', 'papel-7': 'rapidez-energia', 'papel-8': 'escape-radial' };
  const VARIABLES = { M: { nombre: 'masa de la fuente', color: 'f' }, m: { nombre: 'masa del cuerpo', color: 'f' },
    r: { nombre: 'distancia al centro', color: 'i' }, R: { nombre: 'radio del planeta', color: 'i' }, h: { nombre: 'altura sobre la superficie', color: 'i' },
    F: { nombre: 'fuerza gravitatoria', color: 'h' }, v: { nombre: 'rapidez', color: 'o' }, T: { nombre: 'período', color: 'd' },
    t: { nombre: 'duración', color: 'd' }, a: { nombre: 'semieje mayor', color: 'i' } };
  const sp = x => String(x).split('').map(c => c === '-' ? '⁻' : '⁰¹²³⁴⁵⁶⁷⁸⁹'[+c]).join('');
  const f = x => P.formatear(Math.abs(x) < 1e-12 ? 0 : x, 3);
  function numero(x) {
    if (x && (Math.abs(x) >= 1e6 || Math.abs(x) < 0.001)) { const e = Math.floor(Math.log10(Math.abs(x))); return `${f(x / 10 ** e)} × 10${sp(e)}`; }
    return f(x);
  }
  const n = x => x < 0 || Math.abs(x) >= 1e6 || (x && Math.abs(x) < 0.001) ? `(${numero(x)})` : numero(x);
  const N = (clave, x) => P.v(clave, n(x));
  function exacto(x) {
    const e = x && (Math.abs(x) >= 1e6 || Math.abs(x) < 0.001) ? Math.floor(Math.log10(Math.abs(x))) : 0;
    return Math.abs(Math.round(x / 10 ** e * 1000) / 1000 * 10 ** e - x) <= 1e-12 * Math.max(1, Math.abs(x));
  }
  const dato = (clave, x, u) => P.v(clave, `${numero(x)}${u ? ` ${u}` : ''}`);
  const SI = '1 km = 1000 m; 1 h = 3600 s; 1 MJ = 10⁶ J; 1 kg = 1000 g.';
  const MODELO = 'Modelo ideal: fuente esférica fija, cuerpo exterior y masa pequeña frente a la fuente; sin aire ni propulsión.';
  const RADIAL = 'Fuente esférica fija dominante; salida radial exterior hacia afuera, sin aire ni propulsión; energía potencial cero en el infinito.';
  const GM = x => `GM = ${numero(x)} m³/s²: constante gravitatoria G por masa de la fuente M.`;
  const DG = 'G ≈ 6,67 × 10⁻¹¹ N·m²/kg²: constante de gravitación universal.';
  const D = {
    fuerza: 'F = G·M·m/r²; F: módulo de fuerza; M y m: masas; r: distancia entre centros.',
    campo: 'g = GM/r²; g: módulo del campo; r: distancia al centro de la fuente.',
    peso: 'F = m·g; F: peso; m: masa del cuerpo; g: módulo del campo.',
    altura: 'r = R + h; r: distancia central; R: radio planetario; h: altura sobre la superficie.',
    potencial: 'E_PG = −GM·m/r; E_PG: energía potencial; m: masa; r: distancia central.',
    cero: 'La energía potencial gravitatoria vale cero en el infinito.',
    trabajo: 'W_g = E_PG,i − E_PG,f; W_g: trabajo de la gravedad; i y f: estados inicial y final.',
    energia: 'v_f² = v_i² + 2GM·(1/r_f − 1/r_i); v: rapidez; r: distancia central; i/f: inicial/final.',
    circular: 'v² = GM/r; v: rapidez circular; r: radio orbital desde el centro.',
    periodo: 'T = 2πr/v; T: período circular; r: radio orbital; v: rapidez.',
    periodoCubo: 'GM = 4π²r³/T²; r: radio de una órbita circular; T: período.',
    semieje: 'a = (r_p + r_a)/2; a: semieje mayor; r_p y r_a: distancias mínima y máxima al foco.',
    areas: 'S_barrida/S_total = Δt/T; S: área; Δt: duración; T: período orbital.',
    kepler: 'T_2²/T_1² = a_2³/a_1³; T: período; a: semieje mayor; 1 y 2 identifican órbitas de la misma fuente.',
    escape: 'v_esc² = 2GM/r_0; v_esc: umbral de escape; r_0: distancia central inicial.',
    superficie: 'g_0 = GM/R²; g_0: módulo del campo superficial; R: radio del planeta.',
    residual: 'v_inf² = v_0² − 2GM/r_0; v_inf: rapidez residual; v_0: rapidez inicial; r_0: distancia central inicial.',
    retorno: 'v_0²/2 − GM/r_0 = −GM/r_max; v_0: rapidez inicial; r_0/r_max: radios inicial/máximo.',
  };
  function entradas(rng, tipo, papel) {
    const elegir = a => rng.elegir(a), GMv = elegir([3.7, 4.3, 5.1, 5.9, 6.7]) * 1e14;
    const rad = elegir([7.5, 9.5, 11.5, 13.5, 15.5]) * 1e6, masa = elegir([130, 170, 230, 370, 530]);
    if (tipo === 'fuerza') return { G: 6.67e-11, M: elegir([2.7, 3.3, 4.7, 6.3]) * 1e24, m: masa, r: rad };
    if (tipo === 'factores-fuerza') return { F0: elegir([63, 117, 153, 189, 231]), kM: elegir([2, 3, 5]), km: elegir([2, 4, 5]), kr: elegir([2, 3, 4]) };
    if (tipo === 'superposicion') { const Dv = elegir([12, 15, 18, 21]) * 1e6; return { G: 6.67e-11, MA: elegir([2, 3, 5, 7]) * 1e24, MB: elegir([3, 4, 6, 8]) * 1e24, m: masa, D: Dv, x: Dv * elegir([0.25, 1 / 3, 2 / 3, 0.75]) }; }
    if (tipo === 'campo') return { GM: GMv, r: rad };
    if (tipo === 'peso-altura') return { GM: GMv, R: elegir([4, 5, 6]) * 1e6, h: elegir([1.5, 2.5, 3.5]) * 1e6, gramos: elegir([23000, 47000, 63000]) };
    if (tipo === 'campo-nulo') return { MA: elegir([4, 9, 16, 25]) * 1e24, MB: elegir([36, 49, 64, 81]) * 1e24, D: elegir([13, 17, 19, 23]) * 1e6 };
    if (tipo === 'potencial') return { GM: GMv, m: masa, r: rad };
    if (tipo === 'trabajo-radial') { const ri = elegir([7, 11, 13, 17]) * 1e6; return { GM: GMv, m: masa, ri, rf: ri * elegir([0.5, 1.5, 2.5]) }; }
    if (tipo === 'rapidez-energia') { const ri = elegir([12, 14, 16, 18]) * 1e6; return { GM: GMv, ri, rf: ri * elegir([1.5, 2, 2.5]), vi: elegir([13000, 15000, 17000]) }; }
    if (tipo === 'circular') return { GM: GMv, r: rad };
    if (tipo === 'periodo-altura') return { GM: GMv, R: elegir([4.5, 5.5, 6.5]) * 1e6, h: elegir([2, 3, 5]) * 1e6 };
    if (tipo === 'altura-otra-orbita') { const T1 = elegir([7000, 11000, 13000]); return { R: elegir([3.5, 4.5, 5.5]) * 1e6, r1: elegir([9, 11, 13]) * 1e6, T1, T2: T1 * elegir([2, 3, 5, 8]) }; }
    if (tipo === 'semieje') { const rp = elegir([5, 7, 11]) * 1e6; return { rp, ra: rp * elegir([2, 3, 4]) }; }
    if (tipo === 'sector-tiempo') { const Sb = elegir([2, 3, 5, 7]) * 1e14; return { T: elegir([7, 11, 13, 17]) * 3600, S_total: Sb * elegir([3, 4, 5, 6]), S_barrida: Sb }; }
    if (tipo === 'kepler-extremos') return { T1: elegir([7, 11, 13, 17]) * 3600, a1: elegir([6, 8, 10]) * 1e6, rp: elegir([5, 7, 9]) * 1e6, ra: elegir([15, 21, 27]) * 1e6 };
    if (tipo === 'escape') return { GM: GMv, r0: rad };
    if (tipo === 'escape-superficie') return { g0: elegir([7, 9, 11, 13]), R: elegir([3.5, 4.5, 5.5]) * 1e6, h: elegir([1, 2, 3]) * 1e6 };
    const variante = papel === 'papel-6' ? 'residual' : papel === 'papel-8' ? 'retorno' : elegir(['residual', 'retorno']);
    return { GM: GMv, r0: rad, v0: variante === 'residual' ? elegir([15000, 16000, 18000, 19000]) : elegir([2000, 3000, 4000]), variante };
  }
  function construir(tipo, c) {
    let correcta, unidad, clave, simbolo, enunciado, pregunta;
    const datos = [MODELO], solucion = [], errores = [], raiz = Math.sqrt, periodo = (mu, r) => 2 * Math.PI * Math.sqrt(r ** 3 / mu);
    const col = (k, t) => k ? P.v(k, t) : t;
    const ecuacion = (s, expr, val, u, k) => solucion.push([col(k, s), ' = ', ...(Array.isArray(expr) ? expr : [expr]),
      c.G || !exacto(val) ? ' ≈ ' : ' = ', col(k, `${numero(val)} ${u}`)]);
    const responde = (val, u, k, s, expr) => { correcta = val; unidad = u; clave = k; simbolo = s; ecuacion(s, expr, val, u, k); };
    const error = (id, val, texto) => errores.push({ id, valor: val, texto });
    if (tipo === 'fuerza') {
      enunciado = ['Una sonda de ', dato('m', c.m, 'kg'), ' está a ', dato('r', c.r / 1000, 'km'), ' del centro de una fuente de ', dato('M', c.M, 'kg'), '.'];
      pregunta = ['¿Cuál es el módulo de la fuerza gravitatoria sobre la sonda?']; datos.push(DG, D.fuerza, SI);
      responde(c.G * c.M * c.m / c.r ** 2, 'N', 'F', 'F', [n(c.G), ' × ', N('M', c.M), ' × ', N('m', c.m), ' / ', N('r', c.r), '²']);
      error('SIN-CUADRADO', c.G * c.M * c.m / c.r, 'Bien incluir la distancia; omitiste elevarla al cuadrado.');
      error('DIAMETRO', correcta / 4, 'Bien cuadrar la distancia; antes la duplicaste como si pidieran el diámetro.');
      error('DOS-FUERZAS', correcta * 2, 'Bien calcular una atracción; sumaste fuerzas que actúan sobre cuerpos distintos.');
      error('SIGNO', -correcta, 'Bien hallar el tamaño; asignaste signo negativo al módulo.');
    } else if (tipo === 'factores-fuerza') {
      enunciado = ['La fuerza inicial es ', dato('F', c.F0, 'N'), '. La masa fuente se multiplica por ', dato('M', c.kM, ''), ', la otra masa por ', dato('m', c.km, ''), ' y la distancia por ', dato('r', c.kr, ''), '.'];
      pregunta = ['¿Cuál es el nuevo módulo de la fuerza gravitatoria?'];
      datos.push(D.fuerza, 'G es la constante gravitatoria, igual en ambos estados. Los subíndices 1/2 indican estados inicial/final.');
      responde(c.F0 * c.kM * c.km / c.kr ** 2, 'N', 'F', 'F_2', [N('F', c.F0), ' × ', N('M', c.kM), ' × ', N('m', c.km), ' / ', N('r', c.kr), '²']);
      error('DISTANCIA-LINEAL', c.F0 * c.kM * c.km / c.kr, 'Bien cambiar las masas; usaste la distancia sin cuadrarla.');
      error('SIN-DISTANCIA', c.F0 * c.kM * c.km, 'Bien aplicar ambas masas; omitiste el cambio de distancia.');
      error('SIN-MASAS', c.F0 / c.kr ** 2, 'Bien cuadrar el cambio de distancia; omitiste las dos masas.');
      error('SOLO-FUENTE', c.F0 * c.kM / c.kr ** 2, 'Bien cambiar fuente y distancia; omitiste la otra masa.');
      error('SOLO-SONDA', c.F0 * c.km / c.kr ** 2, 'Bien cambiar sonda y distancia; omitiste la masa fuente.');
    } else if (tipo === 'superposicion') {
      const FA = c.G * c.MA * c.m / c.x ** 2, FB = c.G * c.MB * c.m / (c.D - c.x) ** 2;
      enunciado = ['A y B tienen ', dato('M', c.MA, 'kg'), ' y ', dato('M', c.MB, 'kg'), ', separados ', dato('r', c.D / 1000, 'km'), '. Una sonda de ', dato('m', c.m, 'kg'), ' queda entre ambos, a ', dato('r', c.x / 1000, 'km'), ' de A.'];
      pregunta = ['¿Cuál es la componente horizontal de la fuerza neta sobre la sonda?'];
      datos.push(DG, D.fuerza, 'A está a la izquierda de B; derecha positiva. Cada atracción apunta hacia su fuente.', 'F_x = −F_A + F_B; r_A + r_B = D. D: separación entre fuentes; A/B: fuente correspondiente.', SI);
      ecuacion('r_B', [N('r', c.D), ' − ', N('r', c.x)], c.D - c.x, 'm', 'r');
      responde(-FA + FB, 'N', 'F', 'F_x', ['−', n(c.G), ' × ', N('M', c.MA), ' × ', N('m', c.m), ' / ', N('r', c.x),
        '² + ', n(c.G), ' × ', N('M', c.MB), ' × ', N('m', c.m), ' / ', N('r', c.D - c.x), '²']);
      error('MODULOS', FA + FB, 'Bien hallar ambas fuerzas; sumaste módulos sin sus sentidos.');
      error('SIGNO', FA - FB, 'Bien combinar atracciones; invertiste el eje positivo.');
      error('SOLO-A', -FA, 'Bien orientar la atracción de A; omitiste la de B.');
      error('SOLO-B', FB, 'Bien orientar la atracción de B; omitiste la de A.');
      error('IGUAL-DISTANCIA', c.G * c.m * (c.MB - c.MA) / c.x ** 2, 'Bien combinar masas; supusiste iguales las dos separaciones.');
    } else if (tipo === 'campo') {
      enunciado = ['Una sonda está a ', dato('r', c.r / 1000, 'km'), ' del centro del planeta ideal.']; pregunta = ['¿Cuál es el módulo del campo gravitatorio allí?'];
      datos.push(GM(c.GM), D.campo, SI);
      responde(c.GM / c.r ** 2, 'N/kg', null, 'g', [n(c.GM), ' / ', N('r', c.r), '²']);
      error('DIAMETRO', correcta / 4, 'Bien cuadrar la distancia; duplicaste el radio dado.');
      error('MEDIO-RADIO', correcta * 4, 'Bien usar una distancia central; tomaste la mitad del radio.');
      error('SIN-CUADRADO', c.GM / c.r, 'Bien usar GM; omitiste el cuadrado de la distancia.');
      error('SIGNO', -correcta, 'Bien hallar el tamaño; diste signo negativo al módulo del campo.');
    } else if (tipo === 'peso-altura') {
      const radio = c.R + c.h, masa = c.gramos / 1000;
      enunciado = ['Una sonda de ', dato('m', c.gramos, 'g'), ' está a ', dato('h', c.h / 1000, 'km'), ' de altura sobre un planeta de radio ', dato('R', c.R / 1000, 'km'), '.']; pregunta = ['¿Cuánto pesa allí la sonda, en newtons?'];
      datos.push(GM(c.GM), D.campo, D.peso, D.altura, SI);
      ecuacion('m', [N('m', c.gramos), ' / 1000'], masa, 'kg', 'm'); ecuacion('r', [N('R', c.R), ' + ', N('h', c.h)], radio, 'm', 'r');
      responde(c.GM * masa / radio ** 2, 'N', 'F', 'F', [n(c.GM), ' × ', N('m', masa), ' / ', N('r', radio), '²']);
      error('ALTURA-RADIO', c.GM * masa / c.h ** 2, 'Bien usar la altura; la confundiste con la distancia central.');
      error('SUPERFICIE', c.GM * masa / c.R ** 2, 'Bien usar el radio planetario; omitiste la altura.');
      error('SIN-GRAMOS', correcta * 1000, 'Bien calcular el campo; dejaste la masa en gramos.');
      error('RESTAR-ALTURA', c.GM * masa / (c.R - c.h) ** 2, 'Bien combinar radio y altura; restaste en lugar de sumar.');
      error('DOS-FUERZAS', correcta * 2, 'Bien hallar el peso; contaste dos veces la misma atracción.');
      error('DIAMETRO', correcta / 4, 'Bien sumar radio y altura; duplicaste después la distancia central.');
    } else if (tipo === 'campo-nulo') {
      const x = c.D * raiz(c.MA) / (raiz(c.MA) + raiz(c.MB));
      enunciado = ['Las fuentes A y B tienen ', dato('M', c.MA, 'kg'), ' y ', dato('M', c.MB, 'kg'), '. Sus centros distan ', dato('r', c.D / 1000, 'km'), '.']; pregunta = ['Entre ambas, ¿a qué distancia de A se anula el campo neto?'];
      datos.push('g_A = G·M_A/r_A²; g_B = G·M_B/r_B². g_A/g_B: módulos de los campos.',
        'Los campos vectoriales son opuestos. M_A/M_B: masas; r_A/r_B: distancias centrales; G: constante gravitatoria.',
        'Campo neto nulo: g_A = g_B; r_A + r_B = D. D: separación entre centros.', SI);
      responde(x / 1000, 'km', 'r', 'r_A', [N('r', c.D), ' × √(', N('M', c.MA), ') / (√(', N('M', c.MA), ') + √(', N('M', c.MB), ')) / 1000']);
      error('MEDIO', c.D / 2000, 'Bien buscar entre fuentes; elegiste el punto medio pese a las masas distintas.');
      error('LINEAL', c.D * c.MA / (c.MA + c.MB) / 1000, 'Bien ponderar las masas; faltaron sus raíces.');
      error('DESDE-B', (c.D - x) / 1000, 'Bien ubicar el punto; mediste desde B en vez de A.');
      error('SIN-SUMA', c.D * raiz(c.MA / c.MB) / 1000, 'Bien obtener una razón; omitiste que las dos distancias suman D.');
    } else if (tipo === 'potencial') {
      enunciado = ['Una sonda de ', dato('m', c.m, 'kg'), ' está a ', dato('r', c.r / 1000, 'km'), ' del centro del planeta.']; pregunta = ['¿Cuál es su energía potencial gravitatoria, en megajoules?'];
      datos.push(GM(c.GM), D.potencial, D.cero, SI);
      responde(-c.GM * c.m / c.r / 1e6, 'MJ', null, 'E_PG', ['−', n(c.GM), ' × ', N('m', c.m), ' / ', N('r', c.r), ' / 10⁶']);
      error('SIGNO', -correcta, 'Bien hallar el módulo; omitiste el signo del potencial con este cero.');
      error('MITAD', correcta / 2, 'Bien usar GM y la masa; introdujiste el divisor dos de la energía cinética.');
      error('DOBLE', correcta * 2, 'Bien aplicar el potencial; contaste dos veces el mismo término.');
      error('SIN-MASA', correcta / c.m, 'Bien hallar energía por kilogramo; omitiste multiplicar por la masa.');
    } else if (tipo === 'trabajo-radial') {
      const Ui = -c.GM * c.m / c.ri / 1e6, Uf = -c.GM * c.m / c.rf / 1e6;
      enunciado = ['Una sonda de ', dato('m', c.m, 'kg'), ' pasa de ', dato('r', c.ri / 1000, 'km'), ' a ', dato('r', c.rf / 1000, 'km'), ' del centro del planeta.']; pregunta = ['¿Qué trabajo realiza la gravedad, en megajoules?'];
      datos.push(GM(c.GM), D.potencial, D.trabajo, D.cero, SI);
      responde(Ui - Uf, 'MJ', null, 'W_g', [n(c.GM), ' × ', N('m', c.m), ' × (1/', N('r', c.rf), ' − 1/', N('r', c.ri), ') / 10⁶']);
      error('SIGNO', Uf - Ui, 'Bien comparar energías; invertiste el orden de la resta.');
      error('SUMA', Ui + Uf, 'Bien hallar ambas energías; las sumaste en vez de restarlas.');
      error('INICIAL', Ui, 'Bien hallar el potencial inicial; omitiste el estado final.');
      error('FINAL', -Uf, 'Bien usar el potencial final; omitiste el estado inicial.');
    } else if (tipo === 'rapidez-energia') {
      const cambio = 2 * c.GM * (1 / c.rf - 1 / c.ri);
      enunciado = ['Una sonda sale radialmente hacia afuera desde ', dato('r', c.ri / 1000, 'km'), ' del centro, con ', dato('v', c.vi / 1000, 'km/s'), '.']; pregunta = ['¿Qué rapidez tiene al llegar a ', dato('r', c.rf / 1000, 'km'), ' del centro?'];
      datos.push(GM(c.GM), D.energia, D.cero, SI);
      responde(raiz(c.vi ** 2 + cambio) / 1000, 'km/s', 'v', 'v_f', ['√(', N('v', c.vi), '² + 2 × ', n(c.GM), ' × (1/', N('r', c.rf), ' − 1/', N('r', c.ri), ')) / 1000']);
      error('SIGNO-POTENCIAL', raiz(c.vi ** 2 - cambio) / 1000, 'Bien conservar energía; invertiste el cambio del potencial.');
      error('SIN-CAMBIO', c.vi / 1000, 'Bien leer la rapidez inicial; omitiste el cambio de energía potencial.');
      error('SIN-DOS', raiz(c.vi ** 2 + cambio / 2) / 1000, 'Bien comparar radios; faltó el factor dos al despejar la rapidez cuadrada.');
      error('DOBLE-CAMBIO', raiz(c.vi ** 2 + 2 * cambio) / 1000, 'Bien incluir el potencial; contaste dos veces su cambio.');
    } else if (tipo === 'circular') {
      enunciado = ['Un satélite recorre una órbita circular de radio ', dato('r', c.r / 1000, 'km'), ' alrededor del planeta ideal.']; pregunta = ['¿Cuál es su rapidez orbital?'];
      datos.push(GM(c.GM), D.circular, SI);
      responde(raiz(c.GM / c.r) / 1000, 'km/s', 'v', 'v', ['√(', n(c.GM), ' / ', N('r', c.r), ') / 1000']);
      error('SIN-RAIZ', c.GM / c.r / 1000, 'Bien despejar la rapidez cuadrada; omitiste la raíz.');
      error('DIAMETRO', correcta / raiz(2), 'Bien usar la condición circular; sustituiste diámetro por radio.');
      error('DOBLE-GM', correcta * raiz(2), 'Bien tomar una raíz; duplicaste GM antes de aplicarla.');
      error('SIGNO', -correcta, 'Bien hallar el módulo; la rapidez no tiene signo negativo.');
      error('SIN-CONVERSION', correcta * 1000, 'Bien hallar metros por segundo; faltó convertir a kilómetros por segundo.');
    } else if (tipo === 'periodo-altura') {
      const radio = c.R + c.h;
      enunciado = ['Un satélite gira a ', dato('h', c.h / 1000, 'km'), ' de altura sobre un planeta de radio ', dato('R', c.R / 1000, 'km'), '.']; pregunta = ['¿Cuánto dura una vuelta circular, en horas?'];
      datos.push(GM(c.GM), D.altura, D.circular, D.periodo, SI);
      ecuacion('r', [N('R', c.R), ' + ', N('h', c.h)], radio, 'm', 'r');
      responde(periodo(c.GM, radio) / 3600, 'h', 'T', 'T', ['2π × √(', N('r', radio), '³ / ', n(c.GM), ') / 3600']);
      error('ALTURA-RADIO', periodo(c.GM, c.h) / 3600, 'Bien usar el período circular; tomaste la altura como radio orbital.');
      error('SIN-DOS', correcta / 2, 'Bien hallar una duración; recorriste media circunferencia.');
      error('SIN-PI', correcta / Math.PI, 'Bien usar radio y rapidez; omitiste π.');
      error('SIN-HORAS', correcta * 3600, 'Bien calcular segundos; faltó convertirlos a horas.');
      error('DIAMETRO', periodo(c.GM, 2 * radio) / 3600, 'Bien sumar radio y altura; trataste el diámetro como radio orbital.');
    } else if (tipo === 'altura-otra-orbita') {
      const mu = 4 * Math.PI ** 2 * c.r1 ** 3 / c.T1 ** 2, r2 = Math.cbrt(mu * c.T2 ** 2 / (4 * Math.PI ** 2));
      enunciado = ['Un planeta tiene radio ', dato('R', c.R / 1000, 'km'), '. Una órbita circular de radio ', dato('r', c.r1 / 1000, 'km'), ' tarda ', dato('T', c.T1, 's'), '.']; pregunta = ['¿Qué altura tiene otra órbita circular que tarda ', dato('T', c.T2, 's'), ' alrededor del mismo planeta?'];
      datos.push(D.periodoCubo, D.altura, 'Los subíndices 1 y 2 distinguen las dos órbitas; GM es el mismo en ambas.', SI);
      ecuacion('GM', ['4π² × ', N('r', c.r1), '³ / ', N('T', c.T1), '²'], mu, 'm³/s²');
      ecuacion('r_2', ['∛(', N('r', c.r1), '³ × (', N('T', c.T2), ' / ', N('T', c.T1), ')²)'], r2, 'm', 'r');
      responde((r2 - c.R) / 1000, 'km', 'h', 'h', ['(∛(', N('r', c.r1), '³ × (', N('T', c.T2), ' / ', N('T', c.T1), ')²) − ', N('R', c.R), ') / 1000']);
      error('SIN-RESTAR-R', r2 / 1000, 'Bien hallar el radio orbital; faltó restar el radio planetario.');
      error('SUMAR-R', (r2 + c.R) / 1000, 'Bien hallar el radio orbital; sumaste el radio planetario.');
      error('LINEAL', (c.r1 * c.T2 / c.T1 - c.R) / 1000, 'Bien comparar períodos; supusiste que el radio cambia en la misma proporción.');
      error('INVERSA', (c.r1 * (c.T1 / c.T2) ** (2 / 3) - c.R) / 1000, 'Bien usar el exponente dos tercios; invertiste la razón de períodos.');
    } else if (tipo === 'semieje') {
      enunciado = ['Una órbita elíptica llega a ', dato('r', c.rp / 1000, 'km'), ' y ', dato('r', c.ra / 1000, 'km'), ' como distancias mínima y máxima al foco ocupado por el planeta.']; pregunta = ['¿Cuál es su semieje mayor?'];
      datos.push(D.semieje, SI);
      responde((c.rp + c.ra) / 2000, 'km', 'a', 'a', ['(', N('r', c.rp), ' + ', N('r', c.ra), ') / 2 / 1000']);
      error('SUMA', (c.rp + c.ra) / 1000, 'Bien sumar los extremos; faltó dividir entre dos.');
      error('DIFERENCIA', (c.ra - c.rp) / 2000, 'Bien combinar extremos; restaste en lugar de sumarlos.');
      error('LEJANO', c.ra / 1000, 'Bien identificar el extremo lejano; no es el semieje mayor.');
      error('CERCANO', c.rp / 1000, 'Bien identificar el extremo cercano; no es el semieje mayor.');
    } else if (tipo === 'sector-tiempo') {
      enunciado = [`Una órbita tiene área total ${numero(c.S_total)} m² y período `, dato('T', c.T / 3600, 'h'), `. El radio desde el foco barre ${numero(c.S_barrida)} m².`]; pregunta = ['¿Cuántos segundos tarda en barrer esa área?'];
      datos.push(D.areas, 'El movimiento orbital conserva la misma área barrida por unidad de tiempo.', SI);
      responde(c.T * c.S_barrida / c.S_total, 's', 't', 'Δt', [N('T', c.T), ' × ', n(c.S_barrida), ' / ', n(c.S_total)]);
      error('INVERSA', c.T * c.S_total / c.S_barrida, 'Bien relacionar área y tiempo; invertiste la fracción de área.');
      error('RESTANTE', c.T * (c.S_total - c.S_barrida) / c.S_total, 'Bien hallar una fracción; usaste el área que falta.');
      error('TOTAL', c.T, 'Bien leer el período; ese tiempo corresponde al área completa.');
      error('MITAD', correcta / 2, 'Bien hallar la fracción temporal; la dividiste otra vez entre dos.');
    } else if (tipo === 'kepler-extremos') {
      const a2 = (c.rp + c.ra) / 2;
      enunciado = ['Una órbita de semieje ', dato('a', c.a1 / 1000, 'km'), ' tarda ', dato('T', c.T1 / 3600, 'h'), '. Otra alcanza ', dato('r', c.rp / 1000, 'km'), ' y ', dato('r', c.ra / 1000, 'km'), ' del mismo foco como extremos.']; pregunta = ['¿Cuál es el período de la segunda órbita, en segundos?'];
      datos.push(D.semieje, D.kepler, SI);
      ecuacion('a_2', ['(', N('r', c.rp), ' + ', N('r', c.ra), ') / 2'], a2, 'm', 'a');
      responde(c.T1 * (a2 / c.a1) ** 1.5, 's', 'T', 'T_2', [N('T', c.T1), ' × √(((', N('r', c.rp), ' + ', N('r', c.ra), ') / (2 × ', N('a', c.a1), '))³)']);
      error('LEJANO', c.T1 * (c.ra / c.a1) ** 1.5, 'Bien aplicar la ley de períodos; usaste el extremo lejano como semieje.');
      error('CERCANO', c.T1 * (c.rp / c.a1) ** 1.5, 'Bien aplicar la ley de períodos; usaste el extremo cercano como semieje.');
      error('SIN-MITAD', c.T1 * ((c.rp + c.ra) / c.a1) ** 1.5, 'Bien sumar los extremos; faltó dividirlos entre dos antes de comparar.');
      error('LINEAL', c.T1 * a2 / c.a1, 'Bien comparar semiejes; aplicaste una proporción lineal al período.');
      error('SIN-RAIZ', c.T1 * (a2 / c.a1) ** 3, 'Bien elevar la razón al cubo; faltó sacar su raíz.');
    } else if (tipo === 'escape') {
      enunciado = ['Una sonda parte radialmente hacia afuera desde ', dato('r', c.r0 / 1000, 'km'), ' del centro del planeta.']; pregunta = ['¿Cuál es la menor rapidez inicial que permite escapar?'];
      datos[0] = RADIAL; datos.push(GM(c.GM), D.escape, SI);
      responde(raiz(2 * c.GM / c.r0) / 1000, 'km/s', 'v', 'v_esc', ['√(2 × ', n(c.GM), ' / ', N('r', c.r0), ') / 1000']);
      error('SIN-DOS', correcta / raiz(2), 'Bien usar una raíz; omitiste el factor dos.');
      error('DOBLE', correcta * 2, 'Bien obtener el umbral; duplicaste la rapidez obtenida.');
      error('SIN-RAIZ', 2 * c.GM / c.r0 / 1000, 'Bien despejar la rapidez cuadrada; omitiste la raíz.');
      error('SIGNO', -correcta, 'Bien hallar el tamaño; una rapidez no es negativa.');
    } else if (tipo === 'escape-superficie') {
      const radio = c.R + c.h, mu = c.g0 * c.R ** 2;
      enunciado = ['Un planeta tiene radio ', dato('R', c.R / 1000, 'km'), ` y campo superficial ${numero(c.g0)} N/kg. Una sonda parte a `, dato('h', c.h / 1000, 'km'), ' de altura.']; pregunta = ['¿Cuál es su umbral de escape radial hacia afuera?'];
      datos[0] = RADIAL; datos.push(D.superficie, D.altura, D.escape, '1 N/kg = 1 m/s².', SI);
      ecuacion('GM', [n(c.g0), ' × ', N('R', c.R), '²'], mu, 'm³/s²'); ecuacion('r_0', [N('R', c.R), ' + ', N('h', c.h)], radio, 'm', 'r');
      responde(raiz(2 * mu / radio) / 1000, 'km/s', 'v', 'v_esc', ['√(2 × ', n(c.g0), ' × ', N('R', c.R), '² / (', N('R', c.R), ' + ', N('h', c.h), ')) / 1000']);
      error('ALTURA-RADIO', raiz(2 * mu / c.h) / 1000, 'Bien usar la altura; la trataste como distancia al centro.');
      error('SUPERFICIE', raiz(2 * c.g0 * c.R) / 1000, 'Bien usar el campo superficial; calculaste una salida desde la superficie.');
      error('SIN-DOS', correcta / raiz(2), 'Bien reconstruir GM; omitiste el factor dos del umbral.');
      error('CAMPO-FIJO', raiz(2 * c.g0 * (c.R + c.h)) / 1000, 'Bien sumar radio y altura; trataste el campo superficial como si actuara allí.');
    } else {
      datos[0] = RADIAL; datos.push(GM(c.GM), c.variante === 'residual' ? D.residual : D.retorno, SI);
      enunciado = ['Una sonda parte desde ', dato('r', c.r0 / 1000, 'km'), ' del centro, con rapidez radial ', dato('v', c.v0 / 1000, 'km/s'), ' hacia afuera.'];
      if (c.variante === 'residual') {
        pregunta = ['¿A qué rapidez tiende al alejarse indefinidamente?'];
        responde(raiz(c.v0 ** 2 - 2 * c.GM / c.r0) / 1000, 'km/s', 'v', 'v_inf', ['√(', N('v', c.v0), '² − 2 × ', n(c.GM), ' / ', N('r', c.r0), ') / 1000']);
        error('SUMA', raiz(c.v0 ** 2 + 2 * c.GM / c.r0) / 1000, 'Bien comparar energías; sumaste el potencial disponible en vez de descontarlo.');
        error('SIN-DOS', raiz(c.v0 ** 2 - c.GM / c.r0) / 1000, 'Bien restar el potencial; omitiste el factor dos.');
        error('INICIAL', c.v0 / 1000, 'Bien leer la rapidez inicial; omitiste la pérdida de energía cinética.');
        error('RESTA-RAPIDECES', (c.v0 - raiz(2 * c.GM / c.r0)) / 1000, 'Bien hallar el umbral; restaste rapideces en lugar de sus cuadrados.');
      } else {
        const maximo = 1 / (1 / c.r0 - c.v0 ** 2 / (2 * c.GM));
        pregunta = ['¿Cuál es su distancia máxima al centro antes de regresar?'];
        responde(maximo / 1000, 'km', 'r', 'r_max', ['1 / (1/', N('r', c.r0), ' − ', N('v', c.v0), '²/(2 × ', n(c.GM), ')) / 1000']);
        error('ALTURA', (maximo - c.r0) / 1000, 'Bien hallar el punto de retorno; respondiste con lo avanzado desde el inicio.');
        error('SIN-DOS', 1 / (1 / c.r0 - c.v0 ** 2 / c.GM) / 1000, 'Bien despejar el radio; omitiste el divisor dos de la energía cinética.');
        error('SUMA', 1 / (1 / c.r0 + c.v0 ** 2 / (2 * c.GM)) / 1000, 'Bien despejar una distancia; cambiaste la resta del denominador por suma.');
        error('INICIAL', c.r0 / 1000, 'Bien identificar el radio de partida; omitiste el ascenso posterior.');
      }
    }
    return { correcta, unidad, clave, simbolo, enunciado, pregunta, datos, solucion, errores };
  }
  function cerrar(rng, semilla, tipo, c) {
    const o = construir(tipo, c);
    if (!Number.isFinite(o.correcta) || Math.abs(o.correcta) < 1e-10) return null;
    const texto = x => `${c.G || !exacto(x) ? '≈ ' : ''}${numero(x)} ${o.unidad}`;
    const vistos = new Set([texto(o.correcta)]), errores = [];
    for (const e of o.errores) {
      if (!P.enEscala(e.valor, o.correcta, e.id) || Math.abs(e.valor - o.correcta) < 1e-10 * Math.max(1, Math.abs(o.correcta))) continue;
      const t = texto(e.valor); if (vistos.has(t)) continue; vistos.add(t);
      errores.push({ id: `GRP-${tipo.toUpperCase()}-${e.id}`, valor: e.valor, explicacion: `${e.texto} Así sale ${t}.`, respaldo: 'hipotesis', fuente: FUENTE });
    }
    const menor = errores.find(e => e.valor < o.correcta), mayor = errores.find(e => e.valor > o.correcta);
    if (errores.length < 3 || !menor || !mayor) return null;
    const elegidos = [menor, mayor, ...rng.barajar(errores.filter(e => e !== menor && e !== mayor))].slice(0, 4);
    const alternativas = P.armar({ correcta: o.correcta, errores: elegidos, rng, negativos: true, total: 5, texto });
    if (alternativas.length < 4) return null;
    const usadas = new Set();
    const recorrer = x => { if (Array.isArray(x)) x.forEach(recorrer); else if (x && typeof x === 'object' && x.v) usadas.add(x.v); };
    recorrer([o.enunciado, o.pregunta, o.solucion]);
    return { id: `${ID}#${semilla}`, variables: Object.fromEntries([...usadas].map(k => [k, { ...VARIABLES[k] }])),
      enunciado: o.enunciado, pregunta: o.pregunta, datos: o.datos, alternativas, solucion: o.solucion,
      respuesta: { valor: o.correcta, unidad: o.unidad }, _datos: { idea: IDEA[tipo], tipo, nivel: NIVEL[tipo], variante: c.variante || 'base', ...c } };
  }
  function generar(semilla, opciones = {}) {
    const o = typeof opciones === 'string' ? { unidad: opciones } : opciones;
    if (o.unidad && o.unidad !== UNIDAD) throw new Error(`${ID}: unidad incompatible: ${o.unidad}`);
    if (o.idea && !TIPOS_POR_IDEA[o.idea]) throw new Error(`${ID}: idea desconocida: ${o.idea}`);
    if (o.tipo && !TIPOS.includes(o.tipo)) throw new Error(`${ID}: tipo desconocido: ${o.tipo}`);
    if (o.idea && o.tipo && IDEA[o.tipo] !== o.idea) throw new Error(`${ID}: tipo e idea incompatibles.`);
    const rng = Azar.crear(`${ID}|${semilla}`), papel = !o.tipo && !o.idea && PAPEL[String(semilla)] ? String(semilla) : null;
    const tipo = o.tipo || (papel ? PAPEL[papel] : rng.elegir(TIPOS_POR_IDEA[o.idea || rng.elegir(IDEAS)]));
    for (let intento = 0; intento < 300; intento++) { const c = entradas(rng, tipo, papel), p = cerrar(rng, semilla, tipo, c); if (p) return p; }
    throw new Error(`${ID}: no se pudo construir ${tipo} con cuatro alternativas calculadas y distintas.`);
  }
  return { id: ID, titulo: 'Gravitación, órbitas y escape', generar, TIPOS_POR_IDEA, TIPOS, NIVEL, PAPEL };
});
