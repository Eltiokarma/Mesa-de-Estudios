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
      if (!cardinal) return `${t}° con +x`;
      const CARD = { 0: 'hacia el este', 90: 'hacia el norte', 180: 'hacia el oeste', 270: 'hacia el sur', 45: 'hacia el noreste', 135: 'hacia el noroeste', 225: 'hacia el suroeste', 315: 'hacia el sureste' };
      if (CARD[t]) return CARD[t];
      // 37° al norte del este = 37° medido desde el este hacia el norte.
      const cuad = [[0, 'este', 'norte'], [90, 'norte', 'oeste'], [180, 'oeste', 'sur'], [270, 'sur', 'este']];
      for (const [b, de, hacia] of cuad) if (t > b && t < b + 90) return `${t - b}° al ${hacia} del ${de}`;
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
        enunciado.push('. Toma norte = +y y este = +x.');
        pregunta = ['¿A qué distancia queda del punto de partida?'];
      } else if (equilibrio) {
        enunciado = ['Sobre un anillo actúan las fuerzas '];
        vs.forEach((w, i) => { if (i > 0) enunciado.push(i === n - 1 ? ' y ' : ', '); enunciado.push(v(NOMBRES[i], `${NOMBRES[i]} = ${w.texto} N`), ` (${dirTexto(w.t)})`); });
        enunciado.push('. Otra fuerza lo deja en equilibrio.');
        pregunta = ['¿Cuánto mide esa fuerza?'];
      } else {
        enunciado = ['Se tienen los vectores ', ...listaVectores, '.'];
        pregunta = [tipo === 'combinacion' ? `¿Cuánto mide |${expr}|?` : '¿Cuánto mide la resultante?'];
      }
      errores = [
        cardinal ? h('VE-recorrido-vs-desplazamiento', sumaMod, 'Bien sumados los tramos: eso es lo caminado. La distancia al inicio sale de las componentes.')
                 : pa('VE-suma-modulos', sumaMod, 'Si todos apuntaran al mismo lado, sí sumarían eso. Hay que sumar componente por componente.', E8),
        h('VE-sen-cos-cambiados', Math.hypot(CX, CY), 'Bien partir en componentes, pero con θ desde +x: x lleva el coseno e y el seno.'),
        h('VE-signo-por-cuadrante', Math.hypot(AX, AY), 'Bien las componentes, pero fuera del primer cuadrante alguna es negativa y resta.'),
        h('VE-componentes-sumadas', Math.abs(X) + Math.abs(Y), 'Bien Rx y Ry; son perpendiculares, así que el módulo sale con Pitágoras, no sumándolas.'),
        h('VE-sin-raiz', r2, `Bien calculado R² = ${f(r2)}; solo faltó sacar la raíz cuadrada.`),
      ];
      if (tipo === 'combinacion') {
        const [SX, SY] = (() => { let x = 0, y = 0; vs.forEach((w, i) => { x += Math.abs(coef[i]) * w.x; y += Math.abs(coef[i]) * w.y; }); return [x, y]; })();
        const [UX, UY] = (() => { let x = 0, y = 0; vs.forEach((w, i) => { x += Math.sign(coef[i]) * w.x; y += Math.sign(coef[i]) * w.y; }); return [x, y]; })();
        errores.splice(1, 0,
          h('VE-resta-como-suma', Math.hypot(SX, SY), 'Bien sumar por componentes; −B es B al revés: sus componentes cambian de signo.'),
          h('VE-coeficiente-olvidado', Math.hypot(UX, UY), 'Bien sumar por componentes; falta el coeficiente: 2A tiene el doble de cada componente de A.'));
      }
    } else {
      const an = anguloNotable(X, Y);
      if (!an || an.t % 90 === 0) return null;  // dirección no notable o sobre un eje: se descarta
      angular = true;
      correcta = an.t;
      enunciado = ['Se tienen los vectores ', ...listaVectores, '.'];
      pregunta = ['¿Qué ángulo forma la resultante con +x, en sentido antihorario?'];
      const ref = an.ref, cuadrante = X > 0 && Y > 0 ? 1 : X < 0 && Y > 0 ? 2 : X < 0 ? 3 : 4;
      const conRef = r => (cuadrante === 1 ? r : cuadrante === 2 ? 180 - r : cuadrante === 3 ? 180 + r : 360 - r);
      errores = [
        h('VE-tangente-invertida', conRef(90 - ref), `Bien con la tangente, pero es Ry/Rx. Al revés sale el complemento: ${90 - ref}° en vez de ${ref}°.`),
        h('VE-angulo-de-referencia', ref, `Cierto, ${ref}° es el ángulo con el eje x. Desde +x, en sentido antihorario, es ${an.t}°.`),
        h('VE-sentido-opuesto', (an.t + 180) % 360, 'Bien la dirección, pero apunta al revés: las dos componentes cambiaron de signo.'),
        h('VE-signo-por-cuadrante', cuadrante === 1 ? 180 - an.t : ref, 'Bien el ángulo de referencia; el signo de una componente te llevó a otro cuadrante.'),
        h('VE-signo-por-cuadrante', 360 - an.t, 'Bien el ángulo de referencia; el signo de Ry te llevó a otro cuadrante.'),
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
      ...escenaViva({ vs, coef, F, X, Y, PX, PY, u, cardinal, equilibrio, angular, R }, alternativas, correcta),
    };
  }

  /*
   * Escena viva (docs/escena-viva.md, sección 4): los vectores a escala sobre los ejes con î y ĵ
   * (nucleo/kit/piezas/flechas.js). Los pasos: componentes (proyecciones), cola con punta y la resultante.
   * Si se pide un módulo y todas las alternativas caben, se marca en una regla de la misma escala.
   */
  const ROTULOS = {
    'VE-recorrido-vs-desplazamiento': 'lo caminado', 'VE-suma-modulos': 'sumando módulos', 'VE-sen-cos-cambiados': 'sen y cos cambiados',
    'VE-signo-por-cuadrante': 'signo cambiado', 'VE-componentes-sumadas': 'Rx + Ry', 'VE-sin-raiz': 'sin la raíz',
    'VE-resta-como-suma': 'sin el menos', 'VE-coeficiente-olvidado': 'sin coeficientes', 'VE-tangente-invertida': 'tangente al revés',
    'VE-angulo-de-referencia': 'ángulo con el eje', 'VE-sentido-opuesto': 'al revés',
  };
  const BONITOS = [0.01, 0.02, 0.05, 0.1, 0.2, 0.25, 0.5, 1, 2, 5];
  const pasoBonito = tope => BONITOS.reduce((q, b) => (b <= tope + 1e-12 ? b : q), BONITOS[0]);
  // «8î − 6ĵ», «2√3 î + 2ĵ», «−ĵ»: componentes con los unitarios; la raíz se separa del sombrerito.
  function conIJ(px, py, F) {
    const t = (n, q, u, primero) => {
      if (n === 0) return '';
      const m = comp(Math.abs(n), q), c = m === '1' ? '' : m + (m.includes('√') ? ' ' : '');
      return `${n < 0 ? (primero ? '−' : ' − ') : primero ? '' : ' + '}${c}${u}`;
    };
    const x = t(px, F.qx, 'î', true), y = t(py, F.qy, 'ĵ', !x);
    return x + y || '0';
  }

  function escenaViva(e, alternativas, correcta) {
    const v = P.v, { vs, coef, F, X, Y, PX, PY, u, cardinal, equilibrio, angular, R } = e;
    const n = vs.length;
    const nom = i => `${coef[i] < 0 ? '−' : ''}${Math.abs(coef[i]) === 1 ? '' : Math.abs(coef[i])}${NOMBRES[i]}`;
    const colorR = n < 4 ? 'd' : null;
    const flechas = [], guias = [], angulos = [];
    vs.forEach((w, i) => {
      flechas.push({ de: [0, 0], a: [w.x, w.y], color: COLORES[i], rotulo: NOMBRES[i], valor: `${w.texto} ${u}` });
      if (w.t % 90 !== 0) {
        const b = cardinal ? Math.floor(w.t / 90) * 90 : 0;
        angulos.push({ en: [0, 0], de: b, a: w.t, texto: `${w.t - b}°`, color: COLORES[i], radio: 22 + 12 * i });
      }
      if (Math.abs(w.x) > 1e-9 && Math.abs(w.y) > 1e-9) {
        guias.push({ de: [w.x, w.y], a: [w.x, 0], color: COLORES[i], paso: 1 }, { de: [w.x, w.y], a: [0, w.y], color: COLORES[i], paso: 1 });
      }
    });
    // Cola con punta: cada término (con su coeficiente) sale de donde llegó el anterior.
    let sx = 0, sy = 0;
    vs.forEach((w, i) => {
      const dx = coef[i] * w.x, dy = coef[i] * w.y;
      if (i > 0 || coef[i] !== 1) flechas.push({ de: [sx, sy], a: [sx + dx, sy + dy], color: COLORES[i], rotulo: coef[i] !== 1 ? nom(i) : '', discontinua: true, grosor: 'contorno', paso: 2 });
      sx += dx; sy += dy;
    });
    const textoR = angular ? `${correcta}°` : `${P.radical(R)} ${u}`;
    const datos = { unidad: u, ejes: true, flechas, guias, angulos,
      resultante: { de: [0, 0], a: [X, Y], color: colorR, rotulo: 'R', valor: angular ? conIJ(PX, PY, F) : textoR } };
    if (angular) angulos.push({ en: [0, 0], de: 0, a: correcta, texto: `${correcta}°`, color: colorR, radio: 22 + 12 * n, paso: 3 });
    if (equilibrio) flechas.push({ de: [0, 0], a: [-X, -Y], rotulo: 'F', valor: textoR, discontinua: true, grosor: 'contorno', paso: 3 });
    const compo = [];
    vs.forEach((w, i) => { if (i > 0) compo.push(', '); compo.push(v(NOMBRES[i], `${nom(i)} = ${conIJ(coef[i] * w.px, coef[i] * w.py, F)}`)); });
    const tabla = cardinal ? 'norte = +ĵ, este = +î' : F === FAMILIAS.F37 ? 'sen 37° = 3/5, cos 37° = 4/5' : F === FAMILIAS.F45 ? 'cos 45° = sen 45° = √2/2' : F === FAMILIAS.F30 ? 'sen 30° = 1/2, cos 30° = √3/2' : 'cos 60° = 1/2, sen 60° = √3/2';
    const pasos = [
      { estado: { paso: 1 }, texto: ['Cada vector se parte en sus componentes sobre x e y.'], ecuacion: [`(${tabla}) `, ...compo] },
      { estado: { paso: 2 }, texto: ['Puestos cola con punta, llegan al extremo de R.'], ecuacion: ['R = ', colorR ? v('R', conIJ(PX, PY, F)) : conIJ(PX, PY, F)] },
    ];
    const vR = x => (colorR ? v('R', x) : x);
    const r2 = R * R;
    if (angular) {
      const an = anguloNotable(X, Y);
      pasos.push({ estado: { paso: 3, final: true }, texto: ['tan α = |Ry| ÷ |Rx|; los signos de Rx y Ry dan el cuadrante.'], ecuacion: [`α = ${an.ref}° → θ = `, vR(`${correcta}°`)] });
    } else {
      pasos.push({ estado: { paso: 3, final: true }, texto: [equilibrio ? 'La fuerza que falta es −R: mide lo mismo que R.' : 'El módulo sale con Pitágoras sobre Rx y Ry.'],
        ecuacion: ['|R| = √(Rx² + Ry²) = ', P.radical(R) === `√${f(r2)}` ? '' : `√${f(r2)} = `, vR(textoR)] });
    }
    let respuesta = { valor: correcta, unidad: angular ? '°' : u };
    if (!angular) {
      const pts = flechas.concat([datos.resultante]).flatMap(q => [q.de, q.a]);
      const xs = pts.map(q => q[0]), ys = pts.map(q => q[1]);
      const ancho = Math.max(Math.max(...xs, 0) - Math.min(...xs, 0), Math.max(...ys, 0) - Math.min(...ys, 0));
      const vals = alternativas.map(x => x.valor), mayor = Math.max(...vals);
      if (mayor <= 1.6 * ancho) {
        const q = mayor > 20 ? 5 : mayor > 8 ? 2 : 1;
        const max = Math.ceil(mayor * 1.08 / q) * q;
        let hueco = Infinity;
        for (let i = 0; i < vals.length; i++) for (let j = i + 1; j < vals.length; j++) hueco = Math.min(hueco, Math.abs(vals[i] - vals[j]));
        const paso = pasoBonito(Math.min(max / 150, hueco / 2));
        datos.regla = { max, respuesta: correcta, texto: textoR, decimales: paso < 0.1 ? 2 : 1 };
        respuesta = { ...respuesta, tipo: 'arrastrar', control: 'marca', paso, tolerancia: paso };
      }
    }
    const fantasmas = {};
    for (const x of alternativas) if (x.error) fantasmas[x.error.id] = { marca: x.valor, rotulo: ROTULOS[x.error.id] || '', texto: x.texto };
    const alt = `Ejes x e y con los unitarios î y ĵ y ${n} vectores a escala desde el origen, el largo proporcional al módulo: `
      + vs.map((w, i) => `${NOMBRES[i]} de ${w.texto} ${u} a ${w.t}°`).join(', ')
      + (datos.regla ? '. Debajo, una regla con la misma escala para medir R' : '');
    return { escena: { pieza: 'flechas', datos, alt }, respuesta, pasos, fantasmas };
  }

  return { id: 'vectores-componentes', titulo: 'Componentes con triángulos notables', generar, _anguloNotable: anguloNotable, _ANG: ANG_NOTABLES };
});
