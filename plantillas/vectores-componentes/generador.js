/*
 * Generador G2: componentes con triángulos notables (37°/53°, 30°/60° y 45°).
 * Formato "predicciones" (docs/arquitectura.md). Funciona en el navegador
 * (window.Generadores['vectores-componentes']) y en Node (require).
 *
 * Tipos (docs/clasificacion/compendio-vectores.md, T7, T9 y T11):
 *   modulo        módulo de la resultante de 2 a 4 vectores dados por módulo y ángulo con +x;
 *                 también como «la fuerza que falta para el equilibrio» o como desplazamientos
 *                 con puntos cardinales (norte = +y, este = +x)
 *   combinacion   módulo de una combinación como 2A − B o A − 2B + C
 *   angulo        ángulo de la resultante con el eje x positivo (de 0° a 360°)
 *
 * Convención de academia sin miedo: sen 37° = 3/5 y cos 37° = 4/5. Para que todo salga exacto, cada
 * problema usa una sola familia de ángulos:
 *   F37  0°, 37°, 53°, 90°, 127°, … (módulos múltiplos de 5: componentes enteras)
 *   F45  45°, 135°, … con módulos k√2, más los ejes con módulos enteros
 *   F30  30°, 150°, 210°, 330° con módulos pares, más 90° y 270°: x = s√3, y entero
 *   F60  60°, 120°, 240°, 300° con módulos pares, más 0° y 180°: x entero, y = s√3
 * Las componentes se guardan como enteros (x = px·√qx, y = py·√qy) y R² sale entero.
 * Errores: hipótesis nuestras salvo sumar módulos (parcial: E8 de docs/investigacion/).
 */
(function (root, fabrica) {
  const nodo = typeof module === 'object' && module.exports;
  const api = fabrica(nodo ? require('../../nucleo/azar.js') : root.Azar,
                      nodo ? require('../../nucleo/predicciones.js') : root.Predicciones);
  if (nodo) module.exports = api;
  else (root.Generadores = root.Generadores || {})[api.id] = api;
})(typeof self !== 'undefined' ? self : this, function (Azar, P) {
  'use strict';
  const E8 = 'docs/investigacion/estatica-energia-ideas-erroneas.md';
  const h = (id, valor, explicacion) => ({ id, valor, explicacion, respaldo: 'hipotesis', fuente: null });
  const pa = (id, valor, explicacion, fuente) => ({ id, valor, explicacion, respaldo: 'parcial', fuente });
  const f = x => P.formatear(x, 2);
  const esEntero = x => Math.abs(x - Math.round(x)) < 1e-9;

  /*
   * Cada dirección: ángulo con +x, y las componentes de un vector de "paso" k como
   * [px, py] enteros por k; qx y qy dicen qué raíz multiplica a cada componente (1 o 3).
   * El módulo es k·m, con m el texto de la unidad de módulo de la familia.
   */
  const FAMILIAS = {
    F37: { qx: 1, qy: 1, paso: [1, 2, 3, 4, 5, 6], raizMod: 1, base: 5,
      dirs: { 0: [5, 0], 37: [4, 3], 53: [3, 4], 90: [0, 5], 127: [-3, 4], 143: [-4, 3], 180: [-5, 0], 217: [-4, -3], 233: [-3, -4], 270: [0, -5], 307: [3, -4], 323: [4, -3] } },
    // Módulo k√2 a 45°: componentes ±k. En los ejes, el módulo es entero (k).
    F45: { qx: 1, qy: 1, paso: [1, 2, 3, 4, 5, 6], raizMod: 2, base: 1,
      dirs: { 45: [1, 1], 135: [-1, 1], 225: [-1, -1], 315: [1, -1], 0: [1, 0], 90: [0, 1], 180: [-1, 0], 270: [0, -1] } },
    // Módulo 2k a 30°: x = k√3, y = k. En 90° y 270°, el módulo es 2k (y = ±2k).
    F30: { qx: 3, qy: 1, paso: [1, 2, 3, 4, 5], raizMod: 1, base: 2,
      dirs: { 30: [1, 1], 150: [-1, 1], 210: [-1, -1], 330: [1, -1], 90: [0, 2], 270: [0, -2] } },
    // Módulo 2k a 60°: x = k, y = k√3. En 0° y 180°, el módulo es 2k.
    F60: { qx: 1, qy: 3, paso: [1, 2, 3, 4, 5], raizMod: 1, base: 2,
      dirs: { 60: [1, 1], 120: [-1, 1], 240: [-1, -1], 300: [1, -1], 0: [2, 0], 180: [-2, 0] } },
  };
  const DIAG = { F45: [45, 135, 225, 315] };
  const NOMBRES = ['A', 'B', 'C', 'D'];
  const COLORES = ['o', 'i', 'h', 'd'];
  const ANG_NOTABLES = [0, 37, 53, 90, 127, 143, 180, 217, 233, 270, 307, 323, 45, 135, 225, 315, 30, 60, 120, 150, 210, 240, 300, 330];

  // Un vector de la familia: ángulo t y paso k. Devuelve componentes enteras (px, py), su
  // módulo (número) y el texto del módulo (con √2 en F45 diagonal).
  function vectorDe(fam, t, k) {
    const F = FAMILIAS[fam], d = F.dirs[t];
    const px = d[0] * k, py = d[1] * k;
    const x = px * Math.sqrt(F.qx), y = py * Math.sqrt(F.qy);
    const modulo = Math.hypot(x, y);
    return { t, k, px, py, x, y, modulo, texto: P.radical(modulo) };
  }
  const R2de = (fam, PX, PY) => FAMILIAS[fam].qx * PX * PX + FAMILIAS[fam].qy * PY * PY;
  const comp = (n, q) => (q === 1 ? f(n) : (n === 0 ? '0' : P.radical(n * Math.sqrt(q))));

  function generar(semilla) {
    const rng = Azar.crear('vectores-componentes|' + semilla);
    const tipo = rng.elegir(['modulo', 'modulo', 'combinacion', 'angulo']);
    for (let intento = 0; intento < 5000; intento++) {
      const pr = construir(rng, semilla, tipo);
      if (pr && pr.alternativas.length >= 4) return pr;
    }
    throw new Error('No se pudo generar un problema con 4 alternativas distintas');
  }

  // Ángulo desde +x de un vector con componentes reales (x, y), de 0° a 360°, con los notables de
  // academia: si y/x es ±3/4 o ±4/3, se usa 37° o 53° (no el valor de la calculadora).
  function anguloNotable(x, y) {
    if (Math.abs(x) < 1e-9 && Math.abs(y) < 1e-9) return null;
    const ax = Math.abs(x), ay = Math.abs(y);
    let ref = null;
    if (ay < 1e-9) ref = 0;
    else if (ax < 1e-9) ref = 90;
    else {
      const r = ay / ax;
      const tabla = [[3 / 4, 37], [4 / 3, 53], [1, 45], [1 / Math.sqrt(3), 30], [Math.sqrt(3), 60]];
      for (const [val, a] of tabla) if (Math.abs(r - val) < 1e-9) ref = a;
    }
    if (ref === null) return null;
    let t;
    if (x >= -1e-9 && y >= -1e-9) t = ref;
    else if (x < 0 && y >= -1e-9) t = 180 - ref;
    else if (x < 0 && y < 0) t = 180 + ref;
    else t = 360 - ref;
    return { t: ((t % 360) + 360) % 360, ref };
  }

  // Resultante «de academia»: entera o k√2, k√3, k√5.
  function amable(r2) {
    for (const c of [1, 2, 3, 5]) { const s = Math.sqrt(r2 / c); if (esEntero(s)) return true; }
    return false;
  }

  function construir(rng, semilla, tipo) {
    const fam = rng.elegir(tipo === 'angulo' ? ['F37', 'F37', 'F45', 'F30', 'F60'] : ['F37', 'F37', 'F45', 'F30', 'F60']);
    const F = FAMILIAS[fam];
    const n = tipo === 'combinacion' ? rng.elegir([2, 3]) : rng.elegir([2, 3, 3, 4]);
    const angs = Object.keys(F.dirs).map(Number);
    const vs = [];
    const usados = new Set();
    // En F45 al menos un vector va en diagonal; si no, la familia no se nota.
    while (vs.length < n) {
      const t = vs.length === 0 && DIAG[fam] ? rng.elegir(DIAG[fam]) : rng.elegir(angs);
      if (usados.has(t)) continue;
      usados.add(t);
      vs.push(vectorDe(fam, t, rng.elegir(F.paso)));
    }
    const coef = tipo === 'combinacion' ? vs.map((_, i) => (i === 0 ? rng.elegir([1, 2, 3]) : rng.elegir([1, -1, 2, -2]))) : vs.map(() => 1);
    if (tipo === 'combinacion' && coef.every(c => c === 1)) return null;
    let PX = 0, PY = 0;
    vs.forEach((w, i) => { PX += coef[i] * w.px; PY += coef[i] * w.py; });
    const X = PX * Math.sqrt(F.qx), Y = PY * Math.sqrt(F.qy);
    const r2 = R2de(fam, PX, PY);
    if (r2 === 0 || (tipo !== 'angulo' && !amable(r2))) return null;
    const R = Math.sqrt(r2);
    const cardinal = tipo === 'modulo' && (fam === 'F37' || fam === 'F45') && rng.moneda();
    const equilibrio = tipo === 'modulo' && !cardinal && rng.moneda();
    const u = cardinal ? 'm' : (equilibrio ? 'N' : 'u');
    const v = P.v;
    const variables = {};
    vs.forEach((w, i) => { variables[NOMBRES[i]] = { nombre: `vector ${NOMBRES[i]}`, color: COLORES[i] }; });
    if (n < 4) variables.R = { nombre: 'resultante', color: 'd' };

    // Cómo se nombra cada dirección.
    const dirTexto = t => {
      if (!cardinal) return `${t}° con el eje x positivo`;
      const CARD = { 0: 'hacia el este', 90: 'hacia el norte', 180: 'hacia el oeste', 270: 'hacia el sur', 45: 'hacia el noreste', 135: 'hacia el noroeste', 225: 'hacia el suroeste', 315: 'hacia el sureste' };
      if (CARD[t]) return CARD[t];
      // 37° al norte del este = 37° medido desde el este hacia el norte.
      const cuad = [[0, 'este', 'norte'], [90, 'norte', 'oeste'], [180, 'oeste', 'sur'], [270, 'sur', 'este']];
      for (const [b, de, hacia] of cuad) if (t > b && t < b + 90) return `en la dirección ${t - b}° al ${hacia} del ${de}`;
      return `${t}°`;
    };
    const listaVectores = [];
    vs.forEach((w, i) => {
      if (i > 0) listaVectores.push(i === n - 1 ? ' y ' : ', ');
      listaVectores.push(v(NOMBRES[i], `${NOMBRES[i]} = ${w.texto} ${u}`), ` (${dirTexto(w.t)})`);
    });
    const expr = coef.map((c, i) => (i === 0 ? (c === 1 ? '' : c) + NOMBRES[i] : (c < 0 ? ' − ' : ' + ') + (Math.abs(c) === 1 ? '' : Math.abs(c)) + NOMBRES[i])).join('');

    let enunciado, pregunta, correcta, errores, angular = false;
    // Errores de cálculo comunes, como vectores alternativos.
    const sumaCon = trans => { let x = 0, y = 0; vs.forEach((w, i) => { const [a, b] = trans(w); x += coef[i] * a; y += coef[i] * b; }); return [x, y]; };
    const [CX, CY] = sumaCon(w => [w.y, w.x]);                 // sen y cos cambiados
    const [AX, AY] = sumaCon(w => [Math.abs(w.x), Math.abs(w.y)]); // sin signos de cuadrante
    const sumaMod = vs.reduce((s, w, i) => s + Math.abs(coef[i]) * w.modulo, 0);

    if (tipo === 'modulo' || tipo === 'combinacion') {
      correcta = R;
      if (cardinal) {
        enunciado = [`Una persona camina, en este orden: `];
        vs.forEach((w, i) => { if (i > 0) enunciado.push(i === n - 1 ? ' y ' : ', '); enunciado.push(v(NOMBRES[i], `${w.texto} m`), ` ${dirTexto(w.t)}`); });
        enunciado.push('. Toma el norte como +y y el este como +x.');
        pregunta = ['¿A qué distancia queda del punto de partida (módulo del desplazamiento)?'];
      } else if (equilibrio) {
        enunciado = ['Sobre un anillo actúan las fuerzas '];
        vs.forEach((w, i) => { if (i > 0) enunciado.push(i === n - 1 ? ' y ' : ', '); enunciado.push(v(NOMBRES[i], `${NOMBRES[i]} = ${w.texto} N`), ` (${dirTexto(w.t)})`); });
        enunciado.push('. Se agrega una fuerza más para que el anillo quede en equilibrio.');
        pregunta = ['¿Cuánto mide esa fuerza?'];
      } else {
        enunciado = ['Se tienen los vectores ', ...listaVectores, '.'];
        pregunta = [tipo === 'combinacion' ? `¿Cuánto mide |${expr}|?` : '¿Cuánto mide la resultante?'];
      }
      errores = [
        cardinal ? h('VE-recorrido-vs-desplazamiento', sumaMod, 'Sumaste los tramos caminados: eso es el recorrido. La distancia al punto de partida es el módulo del desplazamiento, que se calcula con las componentes.')
                 : pa('VE-suma-modulos', sumaMod, 'Sumaste los módulos como números. Solo valdría si todos apuntaran hacia el mismo lado; hay que sumar componente por componente.', E8),
        h('VE-sen-cos-cambiados', Math.hypot(CX, CY), 'Cambiaste seno y coseno: la componente x es el módulo por el coseno del ángulo con +x, y la y es el módulo por el seno.'),
        h('VE-signo-por-cuadrante', Math.hypot(AX, AY), 'Tomaste todas las componentes como positivas. En el segundo, tercer y cuarto cuadrante alguna componente es negativa y resta.'),
        h('VE-componentes-sumadas', Math.abs(X) + Math.abs(Y), 'Sumaste las dos componentes de la resultante (|Rx| + |Ry|). Rx y Ry son perpendiculares: el módulo sale con Pitágoras.'),
        h('VE-sin-raiz', r2, `Calculaste R² = ${f(r2)} y olvidaste sacar la raíz cuadrada.`),
      ];
      if (tipo === 'combinacion') {
        const [SX, SY] = (() => { let x = 0, y = 0; vs.forEach((w, i) => { x += Math.abs(coef[i]) * w.x; y += Math.abs(coef[i]) * w.y; }); return [x, y]; })();
        const [UX, UY] = (() => { let x = 0, y = 0; vs.forEach((w, i) => { x += Math.sign(coef[i]) * w.x; y += Math.sign(coef[i]) * w.y; }); return [x, y]; })();
        errores.splice(1, 0,
          h('VE-resta-como-suma', Math.hypot(SX, SY), 'Sumaste todos los vectores aunque alguno lleva signo menos. −B es B con el sentido cambiado: sus componentes cambian de signo.'),
          h('VE-coeficiente-olvidado', Math.hypot(UX, UY), 'Olvidaste multiplicar por los coeficientes. 2A tiene el doble de cada componente de A.'));
      }
    } else {
      const an = anguloNotable(X, Y);
      if (!an || an.t % 90 === 0) return null;  // dirección no notable o sobre un eje: se descarta
      angular = true;
      correcta = an.t;
      enunciado = ['Se tienen los vectores ', ...listaVectores, '.'];
      pregunta = ['¿Qué ángulo forma la resultante con el eje x positivo (medido en sentido antihorario)?'];
      const ref = an.ref, cuadrante = X > 0 && Y > 0 ? 1 : X < 0 && Y > 0 ? 2 : X < 0 ? 3 : 4;
      const conRef = r => (cuadrante === 1 ? r : cuadrante === 2 ? 180 - r : cuadrante === 3 ? 180 + r : 360 - r);
      errores = [
        h('VE-tangente-invertida', conRef(90 - ref), `Pusiste la tangente al revés (Rx/Ry en vez de Ry/Rx): sale el complemento del ángulo de referencia, ${90 - ref}° en vez de ${ref}°.`),
        h('VE-angulo-de-referencia', ref, `${ref}° es el ángulo agudo con el eje x. La resultante está en el ${['', 'primer', 'segundo', 'tercer', 'cuarto'][cuadrante]} cuadrante, así que medido desde +x en sentido antihorario es ${an.t}°.`),
        h('VE-sentido-opuesto', (an.t + 180) % 360, 'Ese ángulo apunta al revés: cambiaste el signo de las dos componentes.'),
        h('VE-signo-por-cuadrante', cuadrante === 1 ? 180 - an.t : ref, 'Te equivocaste con el signo de una componente y ubicaste la resultante en otro cuadrante.'),
        h('VE-signo-por-cuadrante', 360 - an.t, 'Te equivocaste con el signo de la componente y y ubicaste la resultante en otro cuadrante.'),
      ];
    }

    // Solución: tabla de componentes y suma.
    const filaComp = (w, i) => {
      const c = coef[i], nom = (Math.abs(c) === 1 ? '' : Math.abs(c)) + NOMBRES[i];
      const sx = comp(c * w.px, F.qx), sy = comp(c * w.py, F.qy);
      return [v(NOMBRES[i], `${c < 0 ? '−' : ''}${nom}`), `: x = ${sx}, y = ${sy}`];
    };
    const solucion = [
      [`Cada vector se pasa a componentes: x = módulo·cos θ e y = módulo·sen θ, con θ medido desde +x${fam === 'F37' ? ' (sen 37° = 3/5, cos 37° = 4/5)' : fam === 'F45' ? ' (cos 45° = sen 45° = √2/2)' : fam === 'F30' ? ' (sen 30° = 1/2, cos 30° = √3/2)' : ' (cos 60° = 1/2, sen 60° = √3/2)'}${cardinal ? '; norte = +y, este = +x' : ''}.`],
      ...vs.map(filaComp),
      [`Se suman por componentes: Rx = ${comp(PX, F.qx)} y Ry = ${comp(PY, F.qy)}.`],
      angular
        ? [`tan α = |Ry|/|Rx| da el ángulo de referencia α = ${anguloNotable(X, Y).ref}°; con los signos de Rx y Ry, la resultante forma `, `${correcta}°`, ' con +x.']
        : [`${equilibrio ? 'La fuerza que falta es −R: mide lo mismo que R. ' : ''}|R| = √(Rx² + Ry²) = ${P.radical(R) === `√${f(r2)}` ? '' : `√${f(r2)} = `}`, n < 4 ? v('R', `${P.radical(R)} ${u}`) : `${P.radical(R)} ${u}`, '.'],
    ];

    const texto = angular ? (x => `${f(x)}°`) : (x => `${P.radical(x)} ${u}`);
    if (!angular) errores = errores.filter(e => Number.isFinite(e.valor) && e.valor > 0 && esEntero(4 * e.valor * e.valor));
    const alternativas = P.armar({ correcta, errores, rng, texto });
    return {
      id: `vectores-componentes#${semilla}`, variables, enunciado, pregunta, datos: '', alternativas, solucion,
      respuesta: { valor: correcta, unidad: angular ? '°' : u },
      _datos: { tipo, fam, vectores: vs.map(w => ({ modulo: w.texto, m: w.modulo, angulo: w.t })), coef, cardinal, equilibrio },
    };
  }

  return { id: 'vectores-componentes', titulo: 'Componentes con triángulos notables', generar, _anguloNotable: anguloNotable, _ANG: ANG_NOTABLES };
});
