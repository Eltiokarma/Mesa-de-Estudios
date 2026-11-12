/*
 * Generador «El termómetro de la chacra»: escalas de temperatura, equivalente mecánico del calor,
 * dilatación y calor latente del sudor (huecos de la admisión de San Marcos, 2019-II a 2027-I).
 * Formato "predicciones" (docs/arquitectura.md). Funciona en el navegador
 * (window.Generadores['calor-escalas']) y en Node (require). No usa ningún motor.
 *
 * Tipos:
 *   conversion    una lectura de una escala a otra: k-a-c (temperaturas muy bajas en kelvin),
 *                 c-a-f, f-a-c e inventada (escala de un termómetro con dos puntos fijos propios)
 *   coincidencia  dónde se cruzan dos escalas: c-f (°F = n·°C o °F − °C = Δ, con el −40) y k-f
 *                 (°F − K = Δ, con el 574,25)
 *   variacion     una variación de temperatura en otra escala: f-a-c (fiebre u horno), c-a-k, c-a-f
 *                 e inventada (no se suma 273 ni se resta 32: solo cambia el tamaño del grado)
 *   joule         la caída que calienta el agua (catarata): altura (con la rapidez en el borde);
 *                 1 cal = 4,2 J
 *   dilatacion    tanque (el combustible que se contrae de noche: la temperatura del mediodía),
 *                 capacidad (un tanque sólido: γ = 3α), aparente (el líquido que rebasa: γ − 3α),
 *                 densidad (la masa no cambia: ρ = ρ0/(1 + γ·ΔT)) y proposiciones (V/F, armarTexto)
 *   sudor         el calor latente de la evaporación: cuerpo (volumen de sudor para bajar la
 *                 temperatura del cuerpo) y calor (masa de sudor para quitar un calor dado)
 *
 * Convenciones: 0 °C = 273 K y 100 °C = 212 °F, como en los exámenes; °F = 1,8·°C + 32. Calor
 * específico del agua 1 cal/(g·°C) = 4200 J/(kg·°C); del cuerpo humano, 3500 J/(kg·°C); calor latente
 * de vaporización del agua a 37 °C, 2450 kJ/kg. g = 10 m/s².
 * Errores: Q7 (documentado, llevado a la cuenta: parcial); U2, U3, U4, U5, U8 y PR3 del informe
 * transversal y los códigos CE- y Q11- (hipótesis nuestras, de las trampas 11 y 18 de
 * docs/clasificacion/trampas-admision-unmsm/fisica.md y de la tabla «sin respaldo» del informe de calor).
 */
(function (root, fabrica) {
  const nodo = typeof module === 'object' && module.exports;
  const api = fabrica(nodo ? require('../../nucleo/azar.js') : root.Azar,
                      nodo ? require('../../nucleo/predicciones.js') : root.Predicciones);
  if (nodo) module.exports = api;
  else (root.Generadores = root.Generadores || {})[api.id] = api;
})(typeof self !== 'undefined' ? self : this, function (Azar, P) {
  'use strict';
  const CAL = 'docs/investigacion/fluidos-calor-termodinamica-ideas-erroneas.md';
  const TRV = 'docs/investigacion/fisica-calculo-transversal-ideas-erroneas.md';
  const TRA = 'docs/clasificacion/trampas-admision-unmsm/fisica.md';
  const h = (id, valor, explicacion, fuente = TRA) => ({ id, valor, explicacion, respaldo: 'hipotesis', fuente });
  const pa = (id, valor, explicacion, fuente) => ({ id, valor, explicacion, respaldo: 'parcial', fuente });
  const ht = (id, clave, texto, explicacion, respaldo = 'hipotesis', fuente = TRA) => ({ id, clave, texto, explicacion, respaldo, fuente });
  const f = (x, d = 2) => P.formatear(x, d);
  const par = x => (x < 0 ? `(${f(x)})` : f(x));
  const v = P.v;
  const decs = x => { for (let k = 0; k <= 6; k++) if (limpio(x, k)) return k; return 99; };
  const limpio = (x, dec = 2) => Number.isFinite(x) && Math.abs(x * 10 ** dec - Math.round(x * 10 ** dec)) < 1e-6 && Math.abs(x) < 1e7;
  const g = 10;
  // Potencia de diez con superíndices: 1,8 × 10⁻⁴.
  const SUP = { '-': '⁻', 0: '⁰', 1: '¹', 2: '²', 3: '³', 4: '⁴', 5: '⁵', 6: '⁶', 7: '⁷', 8: '⁸', 9: '⁹' };
  function cient(x) {
    const e = Math.floor(Math.log10(Math.abs(x)) + 1e-12), m = x / 10 ** e;
    return `${f(m, 2)} × 10${String(e).split('').map(c => SUP[c]).join('')}`;
  }

  function generar(semilla) {
    const rng = Azar.crear('calor-escalas|' + semilla);
    const [tipo, sub] = rng.elegir([
      ['conversion', 'k-a-c'], ['conversion', 'k-a-c'], ['conversion', 'c-a-f'], ['conversion', 'f-a-c'], ['conversion', 'inventada'], ['conversion', 'inventada'],
      ['coincidencia', 'c-f'], ['coincidencia', 'c-f'], ['coincidencia', 'k-f'], ['coincidencia', 'k-f'],
      ['variacion', 'f-a-c'], ['variacion', 'f-a-c'], ['variacion', 'c-a-k'], ['variacion', 'c-a-f'], ['variacion', 'inventada'],
      ['joule', 'altura'], ['joule', 'altura'],
      ['dilatacion', 'tanque'], ['dilatacion', 'tanque'], ['dilatacion', 'capacidad'], ['dilatacion', 'aparente'], ['dilatacion', 'aparente'],
      ['dilatacion', 'densidad'], ['dilatacion', 'proposiciones'], ['dilatacion', 'proposiciones'],
      ['sudor', 'cuerpo'], ['sudor', 'cuerpo'], ['sudor', 'calor']]);
    for (let intento = 0; intento < 5000; intento++) {
      const pr = CONSTRUIR[tipo](rng, semilla, sub);
      if (pr && pr.alternativas.length >= 4) return pr;
    }
    // Respaldo (no debería pasar): un tipo que siempre sale.
    for (let intento = 0; intento < 5000; intento++) {
      const pr = CONSTRUIR.dilatacion(rng, semilla, 'tanque');
      if (pr && pr.alternativas.length >= 4) return pr;
    }
    throw new Error('No se pudo generar un problema con 4 alternativas distintas');
  }

  function cerrar(rng, semilla, o) {
    let alternativas, respuesta;
    if (o.textual) {
      alternativas = P.armarTexto({ correcta: o.correcta, errores: o.errores, rng });
      respuesta = { valor: o.correcta.clave, texto: o.correcta.texto, unidad: '' };
    } else {
      const dec = o.decimales ?? 2;
      const txt = x => f(x, dec) + (o.unidad ? ' ' + o.unidad : '');
      // Las incorrectas no pueden delatarse: ni con más decimales (hasta 1 si la correcta tiene 0 o 1; nunca más de 2) ni fuera de escala
      // (entre 1/20 y 20 veces la correcta, y dentro del rango físico del problema si lo hay).
      const maxDec = Math.min(decs(o.correcta) <= 1 ? 1 : 2, dec);
      const errores = o.errores.filter(e => {
        if (!Number.isFinite(e.valor) || (!o.negativos && e.valor <= 0)) return false;
        if (decs(e.valor) > (P.esUnidades(e.id) ? Math.max(3, maxDec) : maxDec)) return false; // una trampa de unidades corre la coma
        // Las trampas de unidades (U2, U3, U5, U8: kJ por J, sumar 273 a una variación) van aunque se salgan
        // de escala o del rango físico, hasta 1000 veces la correcta (decisión de Gerson, 12 nov 2026).
        if (P.esUnidades(e.id)) return P.enEscala(e.valor, o.correcta, e.id);
        const r = Math.abs(e.valor) / Math.abs(o.correcta);
        if (!(r >= 1 / 20 && r <= 20)) return false;
        return !o.rango || (e.valor >= o.rango[0] && e.valor <= o.rango[1]);
      });
      // Primero las que tienen a lo más los decimales de la correcta: así casi nunca se nota cuál es.
      const dc = decs(o.correcta);
      errores.sort((a, b) => (decs(a.valor) > dc) - (decs(b.valor) > dc));
      const parejas = errores.filter(e => decs(e.valor) <= dc);
      if (parejas.length >= 3) errores.splice(0, errores.length, ...parejas);
      // Una trampa de unidades, si hay, va siempre entre las alternativas (decisión de Gerson, 12 nov 2026).
      const iu = errores.findIndex(e => P.esUnidades(e.id)), iu0 = o.errores.findIndex(e => e && P.esUnidades(e.id) && !errores.includes(e) && decs(e.valor) <= 3 && P.enEscala(e.valor, o.correcta, e.id));
      if (iu > 0) errores.unshift(...errores.splice(iu, 1));
      else if (iu < 0 && iu0 >= 0) errores.unshift(o.errores[iu0]);
      alternativas = P.armar({ correcta: o.correcta, errores, rng, texto: txt, negativos: !!o.negativos });
      respuesta = { valor: o.correcta, unidad: o.unidad };
    }
    return {
      id: `calor-escalas#${semilla}`, variables: o.variables, enunciado: o.enunciado, pregunta: o.pregunta, datos: '',
      alternativas, solucion: o.solucion, respuesta, _datos: o.datos,
    };
  }

  const aF = c => 1.8 * c + 32, aC = F => (F - 32) / 1.8;
  const VARE = { T: { nombre: 'lectura dada', color: 'o' }, a: { nombre: 'puntos fijos', color: 'i' }, k: { nombre: 'tamaño del grado', color: 'h' }, x: { nombre: 'lo que se pide', color: 'd' } };

  // ---------------- conversion ----------------
  const FRIO = [[4, 'El helio líquido hierve a unos'], [20, 'El hidrógeno líquido hierve a unos'], [27, 'El neón líquido hierve a unos'], [54, 'El oxígeno se congela a unos'],
    [63, 'El nitrógeno se congela a unos'], [77, 'El nitrógeno líquido hierve a unos'], [87, 'El argón líquido hierve a unos'], [90, 'El oxígeno líquido hierve a unos'],
    [112, 'El metano líquido hierve a unos'], [165, 'El xenón líquido hierve a unos'], [195, 'El hielo seco (dióxido de carbono sólido) pasa a gas a unos'],
    [234, 'El mercurio se congela a unos'], [239, 'El cloro líquido hierve a unos'], [183, 'El alcohol etílico se congela a unos']];
  const DONDE_C = [['En Juliaca, una madrugada de junio el termómetro marca', [-20, -15, -10, -5]], ['En Macusani, una noche de helada el termómetro marca', [-25, -20, -15, -10]],
    ['En la puna, al amanecer, el termómetro marca', [-10, -5, 5]], ['Una tarde de verano en Lima el termómetro marca', [20, 25, 30]], ['En Pucallpa, a mediodía, el termómetro marca', [30, 35, 40]],
    ['Una sopa recién servida está a', [60, 70, 80, 90]], ['El agua de una terma está a', [40, 45, 50, 55, 60, 65]], ['El aceite de una freidora está a', [150, 160, 170, 180, 190]]];
  const DONDE_F = [['Una receta de un libro de cocina de Estados Unidos pide hornear el queque a', [160, 170, 180, 190, 200]], ['El pronóstico de una ciudad de Florida anuncia', [25, 30, 35]],
    ['El congelador de un laboratorio está a', [-30, -25, -20]], ['En un canal de Estados Unidos dicen que la ciudad llegará a', [10, 15, 20, 40]],
    ['Una receta de pizza pide el horno a', [220, 230, 240, 250]], ['Un refrigerador de un hotel en Miami marca', [0, 5]]];
  function conversion(rng, semilla, sub) {
    if (sub === 'k-a-c') {
      const [K, frase] = rng.elegir(FRIO), C = K - 273;
      const enunciado = [`${frase} `, v('T', `${f(K)} K`), '. Toma 0 °C = 273 K.'];
      const pregunta = ['¿A cuántos ', v('x', 'grados Celsius'), ' equivale esa temperatura?'];
      const errores = [
        h('U8-sumar-273', K + 273, `Sumaste 273. Para pasar de kelvin a Celsius se resta: °C = K − 273. Una temperatura menor que 273 K está bajo cero.`, TRV),
        h('CE-signo', 273 - K, `Restaste al revés (273 − ${f(K)}). °C = K − 273: como ${f(K)} K está por debajo de 273 K, la temperatura es negativa.`),
        h('CE-factor-en-kelvin', C / 1.8, 'Dividiste entre 1,8, como si el kelvin fuera un grado de otro tamaño. Un kelvin y un grado Celsius miden lo mismo: solo cambia el cero.'),
        h('CE-da-fahrenheit', aF(C), `Esa es la lectura en °F. En °C basta restar 273: ${f(K)} − 273.`),
        h('CE-sumar-con-signo', -(K + 273), 'Sumaste 273 y le pusiste signo menos porque es muy frío. La cuenta es °C = K − 273: se resta.'),
      ];
      const solucion = [['El kelvin y el grado Celsius tienen el mismo tamaño; la escala Kelvin empieza 273 grados más abajo.'],
        [v('x', '°C'), ' = ', v('T', f(K)), ` − 273 = `, v('x', `${f(C)} °C`), '.']];
      return cerrar(rng, semilla, { negativos: true, correcta: C, errores, unidad: '°C', variables: VARE, enunciado, pregunta, solucion,
        datos: { tipo: 'conversion', sub, K } });
    }
    if (sub === 'c-a-f') {
      const id = rng.entero(0, DONDE_C.length - 1), frase = DONDE_C[id][0], C = rng.elegir(DONDE_C[id][1]);
      const F = aF(C);
      const enunciado = [`${frase} `, v('T', `${f(C)} °C`), '.'];
      const pregunta = ['¿Cuánto marcaría un termómetro en ', v('x', 'grados Fahrenheit'), '?'];
      const errores = [
        h('CE-sin-32', 1.8 * C, 'Te faltó sumar 32. El 0 °C (agua que se congela) es 32 °F: °F = 1,8·°C + 32.'),
        h('CE-factor-invertido', C / 1.8 + 32, 'Usaste el factor al revés. Un grado Celsius es más grande que uno Fahrenheit: se multiplica por 1,8 (9/5).'),
        h('CE-orden', 1.8 * (C + 32), 'Sumaste 32 antes de multiplicar. Primero se multiplica por 1,8 y después se suma 32.'),
        h('CE-solo-32', C + 32, 'Solo sumaste 32. Además del cero, cambia el tamaño del grado: se multiplica por 1,8.'),
        h('CE-regla-aproximada', 2 * C + 30, 'Usaste la regla aproximada «el doble más 30». Sirve para tener una idea, pero el factor es 1,8 y el cero es 32: °F = 1,8·°C + 32.'),
        h('CE-por-dos', 2 * C + 32, 'Multiplicaste por 2. Entre congelación y ebullición hay 180 grados Fahrenheit por cada 100 Celsius: el factor es 1,8.'),
      ];
      const solucion = [['Entre congelación (0 °C = 32 °F) y ebullición (100 °C = 212 °F) hay 100 grados Celsius y 180 Fahrenheit: un grado Celsius vale 1,8 Fahrenheit.'],
        [v('x', '°F'), ' = 1,8 · ', v('T', par(C)), ' + 32 = ', v('x', `${f(F)} °F`), '.']];
      return cerrar(rng, semilla, { negativos: true, correcta: F, errores, unidad: '°F', variables: VARE, enunciado, pregunta, solucion,
        datos: { tipo: 'conversion', sub, C, contexto: id } });
    }
    if (sub === 'f-a-c') {
      const id = rng.entero(0, DONDE_F.length - 1), frase = DONDE_F[id][0], C = rng.elegir(DONDE_F[id][1]);
      const F = aF(C);
      const enunciado = [`${frase} `, v('T', `${f(F)} °F`), '.'];
      const pregunta = ['¿A cuántos ', v('x', 'grados Celsius'), ' equivale?'];
      const errores = [
        h('CE-orden', F / 1.8 - 32, 'Dividiste primero y restaste después. Hay que deshacer en orden inverso: primero se resta 32 y después se divide entre 1,8.'),
        h('CE-sin-32', F / 1.8, 'Te faltó restar 32: 32 °F es el 0 °C.'),
        h('CE-factor-invertido', 1.8 * (F - 32), 'Multiplicaste por 1,8. De Fahrenheit a Celsius se divide: el grado Fahrenheit es más chico.'),
        h('CE-solo-32', F - 32, 'Solo restaste 32. Además del cero, cambia el tamaño del grado: falta dividir entre 1,8.'),
        h('CE-regla-aproximada', (F - 30) / 2, 'Usaste la regla aproximada «restar 30 y dividir entre 2». Sirve para tener una idea, pero la cuenta exacta es (°F − 32)/1,8.'),
        h('CE-por-dos', (F - 32) / 2, 'Dividiste entre 2. Entre congelación y ebullición hay 180 grados Fahrenheit por cada 100 Celsius: se divide entre 1,8.'),
      ];
      const solucion = [['°F = 1,8·°C + 32, así que °C = (°F − 32)/1,8.'],
        [v('x', '°C'), ' = (', v('T', f(F)), ` − 32) / 1,8 = ${f(F - 32)} / 1,8 = `, v('x', `${f(C)} °C`), '.']];
      return cerrar(rng, semilla, { negativos: true, correcta: C, errores, unidad: '°C', variables: VARE, enunciado, pregunta, solucion,
        datos: { tipo: 'conversion', sub, F, contexto: id } });
    }
    // inventada: el termómetro de la chacra
    const a = rng.elegir([-20, -10, 10, 20, 30, 40]), b = a + rng.elegir([50, 80, 120, 150, 200]);
    const C = rng.elegir([10, 20, 25, 30, 40, 50, 60, 80]), X = a + (b - a) * C / 100;
    const haciaX = rng.moneda();
    if (!limpio(X)) return null;
    const base = ['El abuelo marcó en la chacra un termómetro viejo con su propia escala, los grados chacra (°Ch). Lo calibró a nivel del mar: en el hielo que se derrite marca ', v('a', `${f(a)} °Ch`), ' y en el agua que hierve, ', v('a', `${f(b)} °Ch`), '. '];
    const k = (b - a) / 100;
    let enunciado, pregunta, correcta, errores, solucion, unidad;
    if (haciaX) {
      correcta = X; unidad = '°Ch';
      enunciado = [...base, 'Un día, otro termómetro marca ', v('T', `${f(C)} °C`), '.'];
      pregunta = ['¿Cuánto marca el ', v('x', 'termómetro del abuelo'), '?'];
      errores = [
        h('CE-sin-desplazamiento', (b - a) * C / 100, `Escalaste bien el tamaño del grado, pero te faltó el cero: el hielo marca ${f(a)} °Ch, no 0. Hay que sumarlo.`),
        h('CE-razon-invertida', a + 100 * C / (b - a), `Invertiste la razón de tamaños: entre los dos puntos hay ${f(b - a)} °Ch por cada 100 °C, así que 1 °C = ${f(k)} °Ch.`),
        h('CE-solo-desplazamiento', C + a, `Solo sumaste el cero. El grado chacra tiene otro tamaño: 100 °C son ${f(b - a)} °Ch.`),
        h('CE-con-b', b * C / 100, `Usaste ${f(b)} como si la escala empezara en cero. Lo que corresponde a los 100 °C es la distancia entre los puntos fijos, ${f(b)} − (${f(a)}) = ${f(b - a)} °Ch, y después se suma el cero.`),
      ];
      solucion = [['En las dos escalas, la lectura avanza en proporción entre los puntos fijos: (X − ', v('a', f(a)), ') / ', v('k', f(b - a)), ' = (°C − 0) / 100.'],
        [v('x', 'X'), ' = ', v('a', f(a)), ' + ', v('k', f(b - a)), ' · ', v('T', f(C)), ' / 100 = ', v('x', `${f(X)} °Ch`), '.']];
    } else {
      correcta = C; unidad = '°C';
      enunciado = [...base, 'Un día, el termómetro del abuelo marca ', v('T', `${f(X)} °Ch`), '.'];
      pregunta = ['¿Cuál es la temperatura en ', v('x', 'grados Celsius'), '?'];
      errores = [
        h('CE-sin-desplazamiento', 100 * X / (b - a), `Te faltó restar el cero: el hielo marca ${f(a)} °Ch. Primero se resta y después se cambia el tamaño del grado.`),
        h('CE-razon-invertida', (X - a) * (b - a) / 100, `Invertiste la razón de tamaños: ${f(b - a)} °Ch equivalen a 100 °C, así que se multiplica por 100/${f(b - a)}.`),
        h('CE-solo-desplazamiento', X - a, `Solo restaste el cero. El grado chacra tiene otro tamaño: ${f(b - a)} °Ch son 100 °C.`),
        h('CE-con-b', 100 * X / b, `Usaste ${f(b)} como si la escala empezara en cero. Lo que equivale a 100 °C es la distancia entre los puntos fijos, ${f(b - a)} °Ch.`),
      ];
      solucion = [['En las dos escalas, la lectura avanza en proporción entre los puntos fijos: (X − ', v('a', f(a)), ') / ', v('k', f(b - a)), ' = °C / 100.'],
        [v('x', '°C'), ' = 100 · (', v('T', f(X)), ' − ', v('a', par(a)), ') / ', v('k', f(b - a)), ' = ', v('x', `${f(C)} °C`), '.']];
    }
    return cerrar(rng, semilla, { negativos: true, correcta, errores, unidad, variables: VARE, enunciado, pregunta, solucion,
      datos: { tipo: 'conversion', sub, fusion: a, ebullicion: b, lectura: haciaX ? C : X, haciaX } });
  }

  // ---------------- coincidencia ----------------
  function coincidencia(rng, semilla, sub) {
    if (sub === 'c-f') {
      const forma = rng.elegir(['igual', 'doble', 'quintuple', 'delta', 'delta', 'delta', 'delta']);
      let n = 1, D = 0, frase;
      if (forma === 'doble') { n = 2; frase = 'la lectura en °F es el doble de la lectura en °C'; }
      else if (forma === 'quintuple') { n = 5; frase = 'la lectura en °F es cinco veces la lectura en °C'; }
      else if (forma === 'delta') { const C0 = rng.elegir([-35, -30, -25, -20, -15, -10, -5, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 60, 70, 80, 90, 100]); D = 32 + 0.8 * C0; frase = `la lectura en °F supera en ${f(D)} a la lectura en °C`; }
      else frase = 'un termómetro en °C y otro en °F marcan el mismo número';
      // 1,8·C + 32 = n·C + D
      const sol = (k1, k0) => (k0 - D) / (n - k1); // C con k1·C + k0 = n·C + D
      const C = sol(1.8, 32);
      if (!limpio(C)) return null;
      const VAR = { n: { nombre: 'la condición', color: 'o' }, x: { nombre: 'temperatura pedida', color: 'd' } };
      const enunciado = ['Se busca la temperatura a la que ', v('n', frase), '. Recuerda que °F = 1,8·°C + 32.'];
      const pregunta = ['¿A qué ', v('x', 'temperatura en °C'), ' pasa eso?'];
      const errores = [
        h('CE-factor-invertido', sol(5 / 9, 32), 'Usaste °F = (5/9)·°C + 32, con el factor al revés. Un grado Celsius vale 1,8 Fahrenheit.'),
        h('CE-orden', (57.6 - D) / (n - 1.8), 'Usaste °F = 1,8·(°C + 32): sumaste 32 antes de multiplicar.'),
        h('CE-signo', -C, 'Te salió el signo cambiado al despejar. Comprueba reemplazando en °F = 1,8·°C + 32.'),
        h('CE-da-fahrenheit', n * C + D, 'Esa es la lectura en °F. Se pedía la de °C.'),
        h('CE-sin-32', sol(1.8, 0), 'Te olvidaste del 32: °F = 1,8·°C + 32.'),
      ];
      const solucion = [['Se pone la condición como ecuación: 1,8·C + 32 = ', v('n', forma === 'delta' ? `C + ${f(D)}` : (n === 1 ? 'C' : `${n}·C`)), '.'],
        [`(1,8 − ${f(n)})·C = ${f(D)} − 32, así que `, v('x', `C = ${f(C)} °C`), ` (y °F = ${f(aF(C))}).`]];
      return cerrar(rng, semilla, { negativos: true, correcta: C, errores, unidad: '°C', variables: VAR, enunciado, pregunta, solucion,
        datos: { tipo: 'coincidencia', sub, n, delta: D } });
    }
    // k-f: °F − K = Δ
    const D = rng.elegir([0, 0, 0, -40, -20, -10, 10, 20, 30, 40, 50, 60, 80, 100, 120, 150]);
    const K = (D + 459.4) / 0.8;
    const VAR = { n: { nombre: 'la condición', color: 'o' }, x: { nombre: 'temperatura pedida', color: 'd' } };
    const frase = D === 0 ? 'un termómetro en kelvin y otro en °F marcan el mismo número' : (D > 0 ? `la lectura en °F supera en ${f(D)} a la lectura en kelvin` : `la lectura en °F es ${f(-D)} menos que la lectura en kelvin`);
    const enunciado = ['Se busca la temperatura a la que ', v('n', frase), '. Usa °F = 1,8·°C + 32 y K = °C + 273.'];
    const pregunta = ['¿Cuál es esa ', v('x', 'temperatura en kelvin'), '?'];
    const errores = [
      h('CE-sin-32', (491.4 + D) / 0.8, 'Te olvidaste del 32 al pasar a Fahrenheit: °F = 1,8·(K − 273) + 32.'),
      h('CE-da-celsius', K - 273, 'Esa es la temperatura en °C. Se pedía en kelvin: súmale 273.'),
      D === 0 ? h('CE-coincidencia-cf', -40, 'Ese es el cruce entre Celsius y Fahrenheit, −40. Aquí se cruzan Kelvin y Fahrenheit: hay que plantear su propia ecuación.') : h('CE-signo-delta', (459.4 - D) / 0.8, 'Pusiste la diferencia con el signo cambiado. Plantea: lectura en °F = lectura en K + Δ.'),
      D === 0 ? h('CE-coincidencia-cf', 233, 'Pasaste a kelvin el −40 °C del cruce Celsius-Fahrenheit. A 233 K el termómetro en °F marca −40, no 233.') : h('CE-da-fahrenheit', K + D, 'Esa es la lectura en °F. Se pedía en kelvin.'),
    ];
    const solucion = [['En kelvin: °F = 1,8·(K − 273) + 32. La condición: 1,8·(K − 273) + 32 = ', v('n', D === 0 ? 'K' : `K ${D > 0 ? '+' : '−'} ${f(Math.abs(D))}`), '.'],
      [`0,8·K = 491,4 − 32 ${D >= 0 ? '+' : '−'} ${f(Math.abs(D))} = ${f(459.4 + D)}, así que `, v('x', `K = ${f(K)}`), '.']];
    return cerrar(rng, semilla, { negativos: true, rango: [0, Infinity], correcta: K, errores, unidad: 'K', variables: VAR, enunciado, pregunta, solucion,
      datos: { tipo: 'coincidencia', sub, delta: D } });
  }

  // ---------------- variacion ----------------
  function variacion(rng, semilla, sub) {
    const VAR = { T: { nombre: 'lecturas', color: 'o' }, a: { nombre: 'puntos fijos', color: 'i' }, k: { nombre: 'tamaño del grado', color: 'h' }, x: { nombre: 'variación pedida', color: 'd' } };
    if (sub === 'f-a-c') {
      const fiebre = rng.moneda();
      const T1 = fiebre ? rng.elegir([96.8, 97.7, 98.6, 99.5]) : rng.elegir([59, 68, 77, 86, 95]);
      const dF = fiebre ? rng.elegir([0.9, 1.8, 2.7, 3.6, 4.5, 5.4]) : rng.elegir([90, 135, 180, 225, 270, 315, 360]);
      const T2 = +(T1 + dF).toFixed(6), dC = +(dF / 1.8).toFixed(6);
      const enunciado = fiebre ? ['La temperatura de un paciente, medida con un termómetro en °F, sube de ', v('T', `${f(T1)} °F`), ' a ', v('T', `${f(T2)} °F`), ' por la fiebre.']
        : ['El horno de una panadería, con un termómetro en °F, pasa de ', v('T', `${f(T1)} °F`), ' a ', v('T', `${f(T2)} °F`), '.'];
      const pregunta = ['¿Cuánto ', v('x', 'subió su temperatura en grados Celsius'), '?'];
      const errores = [
        h('U8-restar-32', fiebre ? (dF - 32) / 1.8 : Math.round((dF - 32) / 1.8), 'Le restaste 32 a la variación. El 32 corre el cero de la escala y se cancela al restar dos lecturas: una variación solo se divide entre 1,8.', TRV),
        h('CE-factor-invertido', 1.8 * dF, 'Multiplicaste por 1,8. El grado Fahrenheit es más chico: la variación en °C es menor, se divide entre 1,8.'),
        h('CE-misma-variacion', dF, 'Usaste la misma variación. El grado Celsius es 1,8 veces más grande que el Fahrenheit.'),
        h('CE-final-por-variacion', aC(T2), 'Esa es la temperatura final en °C. Se pedía cuánto subió.'),
      ];
      const solucion = [['Variación en °F: ', v('T', `${f(T2)} − ${f(T1)}`), ` = ${f(dF)} °F.`],
        ['Un grado Celsius vale 1,8 Fahrenheit, y el 32 se cancela al restar: ', v('x', `ΔT = ${f(dF)} / 1,8 = ${f(dC)} °C`), '.']];
      return cerrar(rng, semilla, { correcta: dC, errores, unidad: '°C', variables: VAR, enunciado, pregunta, solucion,
        datos: { tipo: 'variacion', sub, T1, T2 } });
    }
    if (sub === 'c-a-k') {
      const T1 = rng.elegir([10, 12, 15, 18, 20]), T2 = rng.elegir([60, 75, 80, 85, 90, 95]), dC = T2 - T1;
      const enunciado = ['El agua de una olla pasa de ', v('T', `${f(T1)} °C`), ' a ', v('T', `${f(T2)} °C`), '. Toma 0 °C = 273 K.'];
      const pregunta = ['¿En cuántos ', v('x', 'kelvin'), ' aumentó su temperatura?'];
      const errores = [
        h('U8-sumar-273', dC + 273, 'Le sumaste 273 a la variación. El 273 corre el cero y se cancela al restar dos lecturas: una variación de 1 °C es una variación de 1 K.', TRV),
        h('CE-final-por-variacion', T2 + 273, 'Esa es la temperatura final en kelvin. Se pedía cuánto subió.'),
        h('CE-factor-en-kelvin', 1.8 * dC, 'Multiplicaste por 1,8, como si el kelvin tuviera el tamaño del grado Fahrenheit. Kelvin y Celsius tienen el mismo tamaño de grado.'),
        h('CE-da-fahrenheit', 1.8 * dC + 32, 'Pasaste la variación a Fahrenheit, y además sumando 32. Se pedía en kelvin: ΔK = Δ°C.'),
      ];
      const solucion = [['En kelvin: ', v('T', `(${f(T2)} + 273) − (${f(T1)} + 273)`), ': el 273 se cancela.'],
        [v('x', `ΔT = ${f(dC)} K`), ', lo mismo que en °C.']];
      return cerrar(rng, semilla, { correcta: dC, errores, unidad: 'K', variables: VAR, enunciado, pregunta, solucion,
        datos: { tipo: 'variacion', sub, T1, T2 } });
    }
    if (sub === 'c-a-f') {
      const T1 = rng.elegir([-12, -10, -8, -5, -3]), dC = rng.elegir([15, 18, 20, 25]), T2 = T1 + dC, dF = 1.8 * dC;
      const enunciado = ['En Juliaca, un día de invierno, el termómetro marca ', v('T', `${f(T1)} °C`), ' al amanecer y ', v('T', `${f(T2)} °C`), ' a mediodía.'];
      const pregunta = ['¿Cuánto ', v('x', 'subió la temperatura en grados Fahrenheit'), '?'];
      const errores = [
        h('U8-sumar-32', dF + 32, 'Le sumaste 32 a la variación. El 32 corre el cero y se cancela al restar dos lecturas: una variación solo se multiplica por 1,8.', TRV),
        h('CE-factor-invertido', dC / 1.8, 'Dividiste entre 1,8. El grado Fahrenheit es más chico: la misma variación da un número mayor en °F.'),
        h('CE-misma-variacion', dC, 'Usaste la misma variación. Un grado Celsius vale 1,8 Fahrenheit.'),
        h('CE-final-por-variacion', aF(T2), 'Esa es la temperatura de mediodía en °F. Se pedía cuánto subió.'),
      ];
      const solucion = [['Variación en °C: ', v('T', `${f(T2)} − ${par(T1)}`), ` = ${f(dC)} °C.`],
        ['Un grado Celsius vale 1,8 Fahrenheit, y el 32 se cancela al restar: ', v('x', `ΔT = 1,8 · ${f(dC)} = ${f(dF)} °F`), '.']];
      return cerrar(rng, semilla, { correcta: dF, errores, unidad: '°F', variables: VAR, enunciado, pregunta, solucion,
        datos: { tipo: 'variacion', sub, T1, T2 } });
    }
    // inventada
    const a = rng.elegir([-20, -10, 10, 20, 30, 40]), b = a + rng.elegir([50, 80, 120, 150, 200]);
    const T1 = rng.elegir([5, 10, 15, 20]), dC = rng.elegir([10, 20, 25, 30, 40, 50]), T2 = T1 + dC;
    const dX = dC * (b - a) / 100;
    if (!limpio(dX)) return null;
    const enunciado = ['El termómetro del abuelo, en la chacra, usa su propia escala, los grados chacra (°Ch): marca ', v('a', `${f(a)} °Ch`), ' en el hielo que se derrite y ', v('a', `${f(b)} °Ch`), ' en el agua que hierve a nivel del mar. Una mañana, la temperatura sube de ', v('T', `${f(T1)} °C`), ' a ', v('T', `${f(T2)} °C`), '.'];
    const pregunta = ['¿Cuánto ', v('x', 'subió la lectura del termómetro del abuelo'), '?'];
    const errores = [
      h('CE-con-desplazamiento', dX + a, `Le sumaste el cero de la escala (${f(a)} °Ch) a la variación. El cero se cancela al restar dos lecturas.`),
      h('CE-razon-invertida', 100 * dC / (b - a), `Invertiste la razón de tamaños: 100 °C equivalen a ${f(b - a)} °Ch, así que 1 °C = ${f((b - a) / 100)} °Ch.`),
      h('CE-misma-variacion', dC, `Usaste la misma variación. El grado chacra tiene otro tamaño: 100 °C son ${f(b - a)} °Ch.`),
      h('CE-final-por-variacion', a + (b - a) * T2 / 100, 'Esa es la lectura final del termómetro del abuelo. Se pedía cuánto subió.'),
    ];
    const solucion = [['Entre los puntos fijos hay 100 °C y ', v('k', `${f(b - a)} °Ch`), `: 1 °C = ${f((b - a) / 100)} °Ch. El cero (`, v('a', f(a)), ') se cancela en una variación.'],
      ['La temperatura sube ', v('T', `${f(dC)} °C`), ', así que la lectura sube ', v('x', `${f(dC)} · ${f((b - a) / 100)} = ${f(dX)} °Ch`), '.']];
    return cerrar(rng, semilla, { correcta: dX, errores, unidad: '°Ch', variables: VAR, enunciado, pregunta, solucion,
      datos: { tipo: 'variacion', sub, fusion: a, ebullicion: b, T1, T2 } });
  }

  // ---------------- joule: la catarata que calienta el agua ----------------
  function joule(rng, semilla, sub) {
    const dT = rng.elegir([0.05, 0.1, 0.15, 0.2, 0.25, 0.3, 0.35, 0.4, 0.45, 0.5]), v0 = rng.elegir([0, 8, 10, 12, 14, 16, 20]);
    const il = rng.entero(0, 4), lugar = ['En la sierra de Amazonas', 'En la selva de Junín', 'En la sierra de Cajamarca', 'En el valle del Colca', 'En la selva de San Martín'][il];
    const c = 4200, H = (c * dT - v0 * v0 / 2) / g;
    if (!limpio(H, 1) || H < 10 || H > 800) return null;
    const VAR = { H: { nombre: 'altura', color: 'o' }, v0: { nombre: 'rapidez en el borde', color: 'i' }, dT: { nombre: 'calentamiento', color: 'h' }, x: { nombre: 'lo que se pide', color: 'd' } };
    const datosC = ' El calor específico del agua es 1 cal/(g·°C) y 1 cal = 4,2 J; g = 10 m/s². Supón que toda la energía mecánica que el agua tenía en el borde se queda en ella como calor.';
    const borde = v0 ? ['llega al borde con una rapidez de ', v('v0', `${f(v0)} m/s`), ' y cae'] : ['cae desde el reposo'];
    if (sub === 'altura') {
      const enunciado = [`${lugar}, el agua de un río `, ...borde, ' por una catarata. Al pie, su temperatura subió ', v('dT', `${f(dT)} °C`), '.', datosC];
      const pregunta = ['¿Qué ', v('x', 'altura'), ' tiene la catarata?'];
      const errores = [
        h('PR3-sin-medio', (c * dT - v0 * v0) / g, 'La energía cinética es ½·m·v²: te faltó el ½.', TRV),
        h('CE-suma-cinetica', (c * dT + v0 * v0 / 2) / g, 'Al despejar h sumaste la energía cinética, y había que restarla. De g·h + ½·v0² = c·ΔT sale g·h = c·ΔT − ½·v0²: la energía cinética del borde ya pone parte del calor, así que la caída necesaria es menor.'),
        h('U5-sin-4,2', (1000 * dT - v0 * v0 / 2) / g, 'Usaste c = 1000 J/(kg·°C): pasaste los gramos a kilogramos, pero no las calorías a joules. c = 1 cal/(g·°C) = 4200 J/(kg·°C).', TRV),
        h('CE-por-g', c * dT * g, 'Multiplicaste por g en lugar de dividir: de m·g·h = m·c·ΔT sale h = c·ΔT/g.'),
      ];
      if (v0) errores.unshift(h('CE-sin-cinetica', c * dT / g, 'Te olvidaste de la energía cinética que el agua ya traía en el borde. Ella también se vuelve calor: m·g·h + ½·m·v0² = m·c·ΔT.'));
      const solucion = [['c = 1 cal/(g·°C) = 4,2 J/(0,001 kg·°C) = 4200 J/(kg·°C).'],
        ['Energía por kilogramo: g·', v('x', 'h'), v0 ? ' + ½·' : '', v0 ? v('v0', 'v0') : '', v0 ? '²' : '', ' = c·', v('dT', 'ΔT'), ` = 4200 · ${f(dT)} = ${f(c * dT)} J/kg.`],
        [v('x', 'h'), ` = (${f(c * dT)}${v0 ? ` − ${f(v0 * v0 / 2)}` : ''}) / 10 = `, v('x', `${f(H, 1)} m`), '.']];
      return cerrar(rng, semilla, { correcta: H, errores, unidad: 'm', decimales: 1, variables: VAR, enunciado, pregunta, solucion,
        datos: { tipo: 'joule', sub, deltaT: dT, v0, lugar: il } });
    }
  }

  // ---------------- dilatacion ----------------
  const PROP_CALOR = [
    { id: 'C-masa', t: 'Su masa aumenta.', v: false, cod: 'CE-masa-cambia', e: 'Al dilatarse, las mismas partículas se separan un poco: no aparecen partículas nuevas, así que la masa no cambia.' },
    { id: 'C-inercia', t: 'Su inercia no cambia.', v: true, cod: 'CE-inercia-cambia', e: 'La inercia depende de la masa, y la masa no cambia al calentarlo.' },
    { id: 'C-densidad', t: 'Su densidad disminuye.', v: true, cod: 'CE-densidad-igual', e: 'La misma masa ocupa un volumen mayor: ρ = m/V baja.' },
    { id: 'C-peso', t: 'Su peso aumenta, porque ahora es más grande.', v: false, cod: 'CE-masa-cambia', e: 'El peso es m·g y la masa no cambia: pesa lo mismo, aunque ocupe más.' },
    { id: 'C-volumen', t: 'Su volumen aumenta.', v: true, cod: 'CE-volumen', e: 'Se dilata en las tres dimensiones: su volumen crece, ΔV = 3α·V0·ΔT.' },
  ];
  const PROP_FRIO = [
    { id: 'F-masa', t: 'Su masa disminuye.', v: false, cod: 'CE-masa-cambia', e: 'Al contraerse, las mismas partículas se acercan: ninguna se va, así que la masa no cambia.' },
    { id: 'F-inercia', t: 'Su inercia disminuye.', v: false, cod: 'CE-inercia-cambia', e: 'La inercia depende de la masa, y la masa no cambia al enfriarlo.' },
    { id: 'F-densidad', t: 'Su densidad aumenta.', v: true, cod: 'CE-densidad-igual', e: 'La misma masa ocupa un volumen menor: ρ = m/V sube.' },
    { id: 'F-peso', t: 'Su peso no cambia.', v: true, cod: 'CE-masa-cambia', e: 'El peso es m·g y la masa no cambia.' },
    { id: 'F-volumen', t: 'Su volumen disminuye.', v: true, cod: 'CE-volumen', e: 'Se contrae en las tres dimensiones: su volumen baja.' },
  ];
  const ROM = ['I', 'II', 'III'];
  const VF = b => (b ? 'V' : 'F');
  function dilatacion(rng, semilla, sub) {
    if (sub === 'proposiciones') {
      const calor = rng.moneda();
      const elegidas = rng.barajar(calor ? PROP_CALOR : PROP_FRIO).slice(0, 3);
      const patron = elegidas.map(s => VF(s.v)).join('');
      const VAR = { x: { nombre: 'valor de verdad', color: 'd' } };
      const enunciado = [calor ? 'Un cubo de cobre que estaba a 20 °C se calienta hasta 300 °C y se dilata. ' : 'Un cubo de cobre que estaba a 300 °C se enfría hasta 20 °C y se contrae. ',
        'Indica si cada afirmación es verdadera (V) o falsa (F). ', ...elegidas.map((s, i) => `${ROM[i]}. ${s.t} `)];
      const pregunta = ['¿Cuál es la ', v('x', 'secuencia correcta'), '?'];
      const errores = elegidas.map((s, i) => {
        const p = elegidas.map((x, j) => VF(j === i ? !x.v : x.v)).join('');
        return ht(s.cod, 'vf:' + p, p, `La ${ROM[i]} es ${s.v ? 'verdadera' : 'falsa'}. ${s.e}`);
      });
      const p2 = elegidas.map((x, j) => VF(j < 2 ? !x.v : x.v)).join('');
      errores.push(ht(elegidas[0].cod, 'vf:' + p2, p2, `La I es ${elegidas[0].v ? 'verdadera' : 'falsa'}. ${elegidas[0].e} Y la II es ${elegidas[1].v ? 'verdadera' : 'falsa'}. ${elegidas[1].e}`));
      const solucion = [['Al cambiar la temperatura cambian el volumen y la densidad; la masa, la inercia y el peso no.'],
        ...elegidas.map((s, i) => [`${ROM[i]}: `, v('x', VF(s.v)), `. ${s.e}`]),
        ['Secuencia: ', v('x', patron), '.']];
      return cerrar(rng, semilla, { textual: true, correcta: { clave: 'vf:' + patron, texto: patron }, errores, variables: VAR, enunciado, pregunta, solucion,
        datos: { tipo: 'dilatacion', sub, calor, afirmaciones: elegidas.map(s => s.id) } });
    }
    if (sub === 'tanque') {
      const gam = rng.elegir([9.6e-4, 1e-3, 9e-4, 1.2e-3]), Vm3 = rng.elegir([5, 8, 10, 12, 20]), dT = rng.elegir([10, 12, 15, 18, 20, 25]);
      const T2 = rng.elegir([2, 4, 5, 6, 8]), T1 = T2 + dT, dV = Vm3 * 1000 * gam * dT;
      if (!limpio(dV, 1)) return null;
      const VAR = { V: { nombre: 'volúmenes', color: 'o' }, gam: { nombre: 'coeficiente volumétrico', color: 'i' }, T: { nombre: 'temperatura de la madrugada', color: 'h' }, x: { nombre: 'temperatura del mediodía', color: 'd' } };
      const enunciado = ['Al mediodía, un grifo de Arequipa llena un tanque con ', v('V', `${f(Vm3)} m³`), ' de gasolina. En la madrugada la gasolina se enfría hasta ', v('T', `${f(T2)} °C`), ' y su volumen baja ', v('V', `${f(dV, 1)} L`), '. El coeficiente de dilatación volumétrica de la gasolina es ', v('gam', `${cient(gam)} °C⁻¹`), '.'];
      const pregunta = ['¿Qué ', v('x', 'temperatura'), ' tenía la gasolina al mediodía?'];
      const errores = [
        h('Q11-triplicar', T2 + dT / 3, 'Multiplicaste el coeficiente por 3. Ya es volumétrico (γ): se triplica solo cuando dan el coeficiente lineal α de un sólido.', CAL),
        h('CE-signo', T2 - dT, 'Restaste la variación. De noche se enfría: al mediodía estaba más caliente, así que la variación se suma a la temperatura de la madrugada.'),
        h('CE-variacion-por-temperatura', dT, 'Esa es la variación de temperatura. Se pedía la temperatura del mediodía: súmale la de la madrugada.'),
        h('U3-litros', T2 + 10 * dT, 'Pasaste los m³ a litros multiplicando por 100. 1 m³ = 1000 L.', TRV),
      ];
      const solucion = [[v('V', `V0 = ${f(Vm3)} m³ = ${f(Vm3 * 1000)} L`), '. ΔV = V0·', v('gam', 'γ'), '·ΔT, así que ΔT = ΔV/(V0·γ).'],
        [`ΔT = ${f(dV, 1)} / (${f(Vm3 * 1000)} · ${cient(gam)}) = ${f(dT)} °C.`],
        [v('x', 'T'), ' = ', v('T', f(T2)), ` + ${f(dT)} = `, v('x', `${f(T1)} °C`), '.']];
      return cerrar(rng, semilla, { negativos: true, rango: [-30, 60], correcta: T1, errores, unidad: '°C', variables: VAR, enunciado, pregunta, solucion,
        datos: { tipo: 'dilatacion', sub, gamma: gam, V0: Vm3, T2, dV } });
    }
    if (sub === 'capacidad') {
      const [mat, al] = rng.elegir([['acero', 1.2e-5], ['aluminio', 2.4e-5], ['cobre', 1.7e-5]]);
      const V0 = rng.elegir([1000, 2000, 5000, 10000]), T1 = rng.elegir([5, 10, 15]), dT = rng.elegir([20, 25, 30, 40, 50]), T2 = T1 + dT;
      const dV = 3 * al * V0 * dT;
      if (!limpio(dV, 3)) return null;
      const VAR = { V: { nombre: 'capacidad', color: 'o' }, al: { nombre: 'coeficiente lineal', color: 'i' }, T: { nombre: 'temperaturas', color: 'h' }, x: { nombre: 'aumento de capacidad', color: 'd' } };
      const enunciado = [`Un tanque vacío de ${mat}, de `, v('V', `${f(V0)} L`), ' de capacidad, pasa de ', v('T', `${f(T1)} °C`), ' a ', v('T', `${f(T2)} °C`), ` al sol. El coeficiente de dilatación lineal del ${mat} es `, v('al', `${cient(al)} °C⁻¹`), '.'];
      const pregunta = ['¿En cuántos litros ', v('x', 'aumenta su capacidad'), '?'];
      const errores = [
        h('Q11-sin-triplicar', al * V0 * dT, 'Usaste el coeficiente lineal para un volumen. El tanque se dilata en las tres dimensiones: γ = 3α.', CAL),
        h('Q11-area', 2 * al * V0 * dT, 'Usaste 2α, que es el coeficiente de un área. Para un volumen es 3α.', CAL),
        h('CE-temperatura-final', 3 * al * V0 * T2, 'Usaste la temperatura final en lugar de la variación: ΔT = T2 − T1.'),
        h('CE-volumen-final', V0 + dV, 'Esa es la capacidad final. Se pedía cuánto aumenta.'),
      ];
      const solucion = [['El hueco del tanque se dilata como si fuera de ', mat, ' macizo, en las tres dimensiones: γ = 3·', v('al', 'α'), ` = ${cient(3 * al)} °C⁻¹.`],
        [v('x', 'ΔV'), ' = 3α·', v('V', 'V0'), '·', v('T', 'ΔT'), ` = ${cient(3 * al)} · ${f(V0)} · ${f(dT)} = `, v('x', `${f(dV, 3)} L`), '.']];
      return cerrar(rng, semilla, { correcta: dV, errores, unidad: 'L', decimales: 3, variables: VAR, enunciado, pregunta, solucion,
        datos: { tipo: 'dilatacion', sub, alfa: al, V0, T1, T2 } });
    }
    if (sub === 'aparente') {
      const [liq, gam] = rng.elegir([['mercurio', 1.8e-4], ['mercurio', 1.8e-4], ['glicerina', 5e-4], ['alcohol', 1.1e-3]]);
      const [vid, al] = rng.elegir([['vidrio común', 9e-6], ['vidrio común', 1e-5], ['vidrio pírex', 3e-6]]);
      if (liq !== 'mercurio' && al < 5e-6) return null; // con pírex, solo mercurio: si no, el vidrio casi no cuenta
      const V0 = rng.elegir([100, 200, 250, 500]), dT = rng.elegir([20, 40, 50, 80, 100]), T1 = 20, T2 = T1 + dT;
      const rebalse = V0 * (gam - 3 * al) * dT;
      if (!limpio(rebalse, 3)) return null;
      const VAR = { gam: { nombre: 'coeficiente del líquido', color: 'o' }, al: { nombre: 'coeficiente del recipiente', color: 'i' }, V: { nombre: 'volumen inicial', color: 'h' }, x: { nombre: 'volumen que rebasa', color: 'd' } };
      const enunciado = [`Un matraz de ${vid} está lleno hasta la marca con `, v('V', `${f(V0)} cm³`), ` de ${liq} a ${T1} °C. Se calientan juntos hasta ${T2} °C. El coeficiente de dilatación volumétrica del ${liq} es `, v('gam', `${cient(gam)} °C⁻¹`), ' y el de dilatación lineal del vidrio, ', v('al', `${cient(al)} °C⁻¹`), '.'];
      const pregunta = [`¿Cuántos cm³ de ${liq} `, v('x', 'quedan por encima de la marca'), ' (o se derraman)?'];
      const errores = [
        h('CE-sin-recipiente', V0 * gam * dT, 'Te olvidaste de que el matraz también se dilata: su capacidad crece y guarda parte del líquido dilatado. Lo que rebasa es la diferencia.'),
        h('Q11-sin-triplicar', V0 * (gam - al) * dT, 'Restaste el coeficiente lineal del vidrio. La capacidad del matraz es un volumen: crece con 3α.', CAL),
        h('CE-suma-recipiente', V0 * (gam + 3 * al) * dT, 'Sumaste la dilatación del matraz. Al crecer el matraz, cabe más líquido: se resta.'),
        h('CE-solo-recipiente', 3 * al * V0 * dT, 'Ese es cuánto crece la capacidad del matraz. Lo que rebasa es lo que crece el líquido menos lo que crece el matraz.'),
      ];
      const solucion = [['Crece el líquido: ΔV_líq = ', v('V', 'V0'), '·', v('gam', 'γ'), '·ΔT. Crece también el matraz: ΔV_mat = V0·3', v('al', 'α'), '·ΔT.'],
        ['Rebasa la diferencia: ', v('x', 'ΔV'), ' = V0·(γ − 3α)·ΔT = ', `${f(V0)} · (${cient(gam)} − ${cient(3 * al)}) · ${f(dT)} = `, v('x', `${f(rebalse, 3)} cm³`), '.']];
      return cerrar(rng, semilla, { correcta: rebalse, errores, unidad: 'cm³', decimales: 3, variables: VAR, enunciado, pregunta, solucion,
        datos: { tipo: 'dilatacion', sub, gamma: gam, alfa: al, V0, deltaT: dT } });
    }
    // densidad: la masa no cambia. Densidades reales a 20 °C; la respuesta se pide redondeada al entero.
    const [mat, coef, lineal, rho0, El, del] = rng.elegir([['latón', 1.9e-5, true, 8500, 'Un bloque de latón', 'del latón'], ['aluminio', 2.4e-5, true, 2700, 'Un bloque de aluminio', 'del aluminio'],
      ['cobre', 1.7e-5, true, 8900, 'Un bloque de cobre', 'del cobre'], ['hierro', 1.2e-5, true, 7900, 'Un bloque de hierro', 'del hierro'],
      ['aceite', 7e-4, false, 920, 'El aceite de cocina', 'del aceite'], ['glicerina', 5e-4, false, 1260, 'La glicerina', 'de la glicerina'],
      ['mercurio', 1.8e-4, false, 13600, 'El mercurio', 'del mercurio'], ['alcohol', 1.1e-3, false, 790, 'El alcohol', 'del alcohol']]);
    const dT = rng.elegir(lineal ? [50, 100, 150, 200, 250, 300] : [10, 20, 30, 40, 50, 60]);
    const gam = lineal ? 3 * coef : coef, exacta = rho0 / (1 + gam * dT), rho = Math.round(exacta);
    const VAR = { rho0: { nombre: 'densidad inicial', color: 'o' }, coef: { nombre: 'coeficiente', color: 'i' }, dT: { nombre: 'calentamiento', color: 'h' }, x: { nombre: 'densidad final', color: 'd' } };
    const enunciado = [`${El} tiene una densidad de `, v('rho0', `${f(rho0)} kg/m³`), ' a 20 °C. Se calienta ', v('dT', `${f(dT)} °C`), lineal ? '. El coeficiente de dilatación lineal ' : '. El coeficiente de dilatación volumétrica ', del, ' es ', v('coef', `${cient(coef)} °C⁻¹`), '.'];
    const pregunta = ['¿Cuál es su ', v('x', 'densidad'), ' después de calentarse? (Redondea al entero.)'];
    const errores = [
      h('CE-densidad-sube', Math.round(rho0 * (1 + gam * dT)), 'Multiplicaste por (1 + γ·ΔT), como si la densidad creciera igual que el volumen. La masa no cambia y el volumen crece: la densidad baja, ρ = ρ0/(1 + γ·ΔT).'),
      h('CE-densidad-igual', rho0, 'Como la masa no cambia, supusiste que la densidad tampoco. Pero el volumen crece, y ρ = m/V baja.'),
      lineal ? h('Q11-sin-triplicar', Math.round(rho0 / (1 + coef * dT)), 'Usaste el coeficiente lineal para el volumen. El bloque se dilata en las tres dimensiones: γ = 3α.', CAL)
        : h('Q11-triplicar', Math.round(rho0 / (1 + 3 * coef * dT)), 'Multiplicaste el coeficiente por 3. Ya es volumétrico (γ): se triplica solo el coeficiente lineal α de un sólido.', CAL),
      lineal ? h('Q11-area', Math.round(rho0 / (1 + 2 * coef * dT)), 'Usaste 2α, que es el coeficiente de un área. Para un volumen es 3α.', CAL)
        : h('CE-densidad-sube', Math.round(rho0 + rho0 * gam * dT), 'Sumaste a la densidad lo que crece el volumen. Al crecer el volumen con la misma masa, la densidad baja.'),
    ];
    const solucion = [['La masa no cambia; el volumen pasa de V0 a V0·(1 + γ·ΔT)', lineal ? ', con γ = 3·' : '', lineal ? v('coef', 'α') : '', `. Aquí γ·ΔT = ${f(gam * dT, 4)}.`],
      [v('x', 'ρ'), ' = m/V = ', v('rho0', 'ρ0'), ` / (1 + ${f(gam * dT, 4)}) = ${f(rho0)} / ${f(1 + gam * dT, 4)} ≈ `, v('x', `${f(rho)} kg/m³`), '.']];
    return cerrar(rng, semilla, { correcta: rho, errores, unidad: 'kg/m³', decimales: 0, rango: [0.5 * rho0, 1.5 * rho0], variables: VAR, enunciado, pregunta, solucion,
      datos: { tipo: 'dilatacion', sub, rho0, coef, lineal, deltaT: dT } });
  }

  // ---------------- sudor: el calor latente que enfría ----------------
  function sudor(rng, semilla, sub) {
    const Lv = 2.45e6, Lf = 3.34e5, cc = 3500, ca = 4200;
    const r1 = x => Math.round(x * 10) / 10; // lo que el alumno anotaría, con un decimal
    const VAR = { M: { nombre: 'masa del cuerpo', color: 'o' }, Q: { nombre: 'calor', color: 'h' }, L: { nombre: 'calor latente', color: 'i' }, x: { nombre: 'sudor que se evapora', color: 'd' } };
    const datosL = ['El calor latente de vaporización del agua a 37 °C es ', v('L', '2,45 × 10⁶ J/kg'), ' (el de fusión del hielo es 3,34 × 10⁵ J/kg) y el calor específico del agua líquida, 4200 J/(kg·°C).'];
    const orden = (mg, unidad) => [
      h('CE-orden-latente', mg * 10, `Leíste mal la potencia de diez del calor latente: 2,45 × 10⁶ J/kg son 2 450 000 J/kg, no 245 000. El sudor necesario es diez veces menor que tu cuenta.`, TRV),
      h('CE-orden-latente', mg / 10, `Leíste mal la potencia de diez del calor latente: 2,45 × 10⁶ J/kg son 2 450 000 J/kg, no 24 500 000. El sudor necesario es diez veces mayor que tu cuenta.`, TRV),
    ];
    if (sub === 'cuerpo') {
      const ip = rng.entero(0, 3), quien = ['Después de un partido en Iquitos, un futbolista de ', 'Después de cosechar al sol en Piura, un agricultor de ', 'Después de una maratón en Lima, una corredora de ', 'Después de cargar sacos en el mercado, un estibador de '][ip];
      const M = rng.elegir([49, 56, 63, 70, 77, 84, 91]), dT = rng.elegir([0.5, 1, 1.5, 2]);
      const Q = M * cc * dT, mg = Q / Lv * 1000;
      if (!limpio(mg)) return null;
      const enunciado = [quien, v('M', `${f(M)} kg`), ' tiene la temperatura del cuerpo ', `${f(dT)} °C`, ' por encima de lo normal. Su cuerpo solo puede enfriarse evaporando sudor. El calor específico del cuerpo humano es 3500 J/(kg·°C). ', ...datosL, ' Un gramo de sudor ocupa 1 mL.'];
      const pregunta = ['¿Qué ', v('x', 'volumen de sudor'), ` debe evaporarse para que su temperatura baje ${f(dT)} °C?`];
      const errores = [
        ...orden(mg),
        h('CE-calor-del-agua', M * ca * dT / Lv * 1000, 'Usaste el calor específico del agua (4200) para el cuerpo. El dato del cuerpo es 3500 J/(kg·°C).'),
        h('U8-fahrenheit', mg * 1.8, `Multiplicaste la variación por 1,8, como si la pasaras a Fahrenheit. El calor específico está por grado Celsius (o kelvin, que es lo mismo en una variación): ΔT = ${f(dT)} °C.`, TRV),
        pa('Q7-sin-latente', r1(Q / (ca * 63) * 1000), 'Calentaste el sudor de 37 °C a 100 °C con el calor específico, sin evaporarlo. Lo que enfría es el cambio de fase: el sudor se evapora a la temperatura de la piel y se lleva el calor latente.', CAL),
        h('U8-kelvin', r1(M * cc * (dT + 273) / Lv * 1000), `Pasaste la variación a kelvin sumando 273. Una variación de ${f(dT)} °C es una variación de ${f(dT)} K.`, TRV),
        h('Q7-fusion', r1(Q / Lf * 1000), 'Usaste el calor latente de fusión del hielo. El sudor no se derrite: se evapora, con el calor latente de vaporización.'),
      ];
      const solucion = [['Calor que el cuerpo debe perder: ', v('Q', 'Q'), ' = ', v('M', 'M'), `·c·ΔT = ${f(M)} · 3500 · ${f(dT)} = ${f(Q)} J.`],
        ['Ese calor se lo lleva el sudor al evaporarse, sin cambiar de temperatura: Q = m·', v('L', 'L'), '.'],
        [v('x', 'm'), ` = ${f(Q)} / 2 450 000 = ${f(mg / 1000, 3)} kg = `, v('x', `${f(mg)} mL`), '.']];
      return cerrar(rng, semilla, { correcta: mg, errores, unidad: 'mL', rango: [0, 5000], variables: VAR, enunciado, pregunta, solucion,
        datos: { tipo: 'sudor', sub, M, deltaT: dT, persona: ip } });
    }
    const QkJ = rng.elegir([245, 367.5, 490, 612.5, 735, 857.5, 980, 1225, 1470]), mg = QkJ * 1000 / Lv * 1000;
    const ip = rng.entero(0, 2), quien = ['Durante una carrera en Lima, el cuerpo de una corredora', 'Durante una tarde de fútbol en Tarapoto, el cuerpo de un arquero', 'Durante una caminata en Arequipa, el cuerpo de un turista'][ip];
    const enunciado = [`${quien} produce `, v('Q', `${f(QkJ)} kJ`), ' de calor que debe eliminar evaporando sudor, a 37 °C. ', ...datosL];
    const pregunta = ['¿Qué ', v('x', 'masa de sudor'), ' debe evaporarse?'];
    const errores = [
      ...orden(mg),
      pa('Q7-sin-latente', r1(QkJ * 1000 / (ca * 63) * 1000), 'Calentaste el sudor de 37 °C a 100 °C con el calor específico, sin evaporarlo. Lo que se lleva el calor es la evaporación: Q = m·L.', CAL),
      h('U2-kilo', QkJ / Lv * 1000, `Dejaste el calor en kJ y el calor latente en J/kg. Hay que usar las mismas unidades: Q = ${f(QkJ)} kJ = ${f(QkJ * 1000)} J.`, TRV),
      h('CE-hasta-100', r1(QkJ * 1000 / (Lv + ca * 63) * 1000), 'Sumaste calentar el sudor hasta 100 °C. El sudor se evapora a la temperatura de la piel: solo hace falta el calor latente.'),
      h('Q7-fusion', r1(QkJ / 334 * 1000), 'Usaste el calor latente de fusión del hielo. El sudor se evapora: va el de vaporización, 2,45 × 10⁶ J/kg.'),
    ];
    const solucion = [['El sudor se evapora a 37 °C y se lleva calor sin cambiar de temperatura: ', v('Q', 'Q'), ' = m·', v('L', 'L'), '.'],
      [v('x', 'm'), ` = ${f(QkJ * 1000)} J / 2 450 000 J/kg = ${f(mg / 1000, 3)} kg = `, v('x', `${f(mg)} g`), '.']];
    return cerrar(rng, semilla, { correcta: mg, errores, unidad: 'g', rango: [0, 5000], variables: VAR, enunciado, pregunta, solucion,
      datos: { tipo: 'sudor', sub, QkJ, persona: ip } });
  }

  const CONSTRUIR = { conversion, coincidencia, variacion, joule, dilatacion, sudor };
  return { id: 'calor-escalas', titulo: 'El termómetro de la chacra', generar };
});
