/*
 * Generador: pasar de coordenadas cartesianas a polares y al revés (rectas, circunferencias, parábola
 * con foco en el polo, trayectoria de un proyectil y puntos). Formato "predicciones"
 * (docs/arquitectura.md). Funciona en el navegador (window.Generadores['trig-polares']) y en Node.
 * Polo en el origen, eje polar = semieje X positivo, θ en grados en _datos.
 *
 * Tipos (_datos):
 *   a-polar       se da la ecuación cartesiana y se pide la polar. Campos: curva, cart, y si la curva es
 *                 'trayectoria' también m, k, p.
 *   a-cartesiana  se da la ecuación polar y se pide la cartesiana. Campos: curva, polar.
 *   punto-a-cart  se da (r; θ) y se pide (x; y). Campos: r, theta (grados), modo ('grados' o 'radianes').
 *   punto-a-polar se da (x; y) y se pide (r; θ) con r > 0 y 0 ≤ θ < 360° (o 2π). Campos: x, y, modo.
 * curva: 'recta-x' (x = a), 'recta-y' (y = b), 'recta' (ax + by = c), 'circ-polo' (x² + y² = a²),
 *   'circ-cos' (x² + y² = 2ax), 'circ-sen' (x² + y² = 2by), 'parabola' (y² = ±4p·x + 4p² o
 *   x² = ±4p·y + 4p², foco en el polo) y 'trayectoria' (y = k − (x − m)²/(4p): el polo se pone en el
 *   foco F = (m; k − p) y el eje polar, paralelo al eje X).
 * cart = [A, B, C, D, E]: A·x² + B·y² + C·x + D·y + E = 0 (en la trayectoria, en las coordenadas X, Y
 *   medidas desde el foco).
 * polar: { forma: 'frac', N, D0, Dc, Ds } es r = N/(D0 + Dc·cos θ + Ds·sen θ);
 *        { forma: 'lin', K0, Kc, Ks, pot } es r^pot = K0 + Kc·cos θ + Ks·sen θ.
 * Respuestas (armarTexto): ecuación polar con clave 'pf:…' o 'pl:…'; cartesiana con clave
 * 'cart:A|B|C|D|E' normalizada (primer coeficiente no nulo = 1); punto (x; y) con clave 'pt:x|y' y punto
 * polar con clave 'pp:r|θ', redondeados a 6 decimales.
 *
 * Errores: CP3, CP2, CP9 a CP15, CP17 a CP19 de plantillas/coordenadas-polares/motor.js (CP3 parcial; el
 * resto, hipótesis; docs/investigacion/matematica-avanzada-ideas-erroneas.md), TR12 parcial
 * (docs/investigacion/trigonometria-ideas-erroneas.md). Los TP-* son hipótesis nuestras.
 */
(function (root, fabrica) {
  const nodo = typeof module === 'object' && module.exports;
  const api = fabrica(nodo ? require('../../nucleo/azar.js') : root.Azar,
                      nodo ? require('../../nucleo/predicciones.js') : root.Predicciones);
  if (nodo) module.exports = api;
  else (root.Generadores = root.Generadores || {})[api.id] = api;
})(typeof self !== 'undefined' ? self : this, function (Azar, P) {
  'use strict';
  const ID = 'trig-polares';
  const MAV = 'docs/investigacion/matematica-avanzada-ideas-erroneas.md';
  const TRI = 'docs/investigacion/trigonometria-ideas-erroneas.md';
  const v = P.v, GR = Math.PI / 180;
  const fracTxt = x => { for (let d = 1; d <= 64; d++) { const n = Math.round(x * d); if (Math.abs(x * d - n) < 1e-9) return P.textoFraccion(P.frac(n, d)); } return P.formatear(x, 4); };
  const r6 = x => String(Math.round(x * 1e6) / 1e6 + 0);
  const err = (id, eq, explicacion, respaldo = 'hipotesis', fuente = null) => (eq ? { id, ...eq, explicacion, respaldo, fuente } : null);
  const cp = (id, eq, expl) => err(id, eq, expl, 'hipotesis', MAV);

  // ---------- ecuaciones polares ----------
  function termTrig(terms) { // [[coef, 'cos θ'], …] con el primero sin signo
    let t = '';
    for (const [c, s] of terms) {
      if (!c) continue;
      const a = Math.abs(c), pega = /^[xy]/.test(s) ? '' : ' ', cuerpo = s ? (a === 1 ? s : `${fracTxt(a)}${pega}${s}`) : fracTxt(a);
      t += t === '' ? (c < 0 ? '−' : '') + cuerpo : (c < 0 ? ' − ' : ' + ') + cuerpo;
    }
    return t || '0';
  }
  function polar(q) {
    if (q.forma === 'frac') {
      const { N, D0, Dc, Ds } = q;
      const lead = [D0, Dc, Ds].find(x => x);
      const clave = 'pf:' + [N, D0, Dc, Ds].map(x => fracTxt(x / lead)).join('|');
      let texto;
      if (!D0 && !Ds) texto = `r = ${termTrig([[N / Dc, 'sec θ']])}`;
      else if (!D0 && !Dc) texto = `r = ${termTrig([[N / Ds, 'csc θ']])}`;
      else texto = `r = ${fracTxt(N)}/(${termTrig([[D0, ''], [Dc, 'cos θ'], [Ds, 'sen θ']])})`;
      return { clave, texto };
    }
    const { K0, Kc, Ks, pot = 1 } = q;
    return { clave: `pl:${pot}:` + [K0, Kc, Ks].map(fracTxt).join('|'), texto: `${pot === 2 ? 'r²' : 'r'} = ${termTrig([[K0, ''], [Kc, 'cos θ'], [Ks, 'sen θ']])}` };
  }
  // ---------- ecuaciones cartesianas ----------
  function cart(c) {
    const lead = c.find(x => x);
    const clave = 'cart:' + c.map(x => fracTxt(x / lead)).join('|');
    let [A, B, C, D, E] = c;
    let texto;
    if (A || B) {
      if ((A || B) < 0) [A, B, C, D, E] = [-A, -B, -C, -D, -E];
      const izq = termTrig([[A, 'x²'], [B, 'y²']]), der = termTrig([[-C, 'x'], [-D, 'y'], [-E, '']]);
      texto = `${izq} = ${der}`;
    } else {
      if ((C || D) < 0) [C, D, E] = [-C, -D, -E];
      if (!D) texto = `x = ${fracTxt(-E / C)}`;
      else if (!C) texto = `y = ${fracTxt(-E / D)}`;
      else texto = `${termTrig([[C, 'x'], [D, 'y']])} = ${fracTxt(-E)}`;
    }
    return { clave, texto };
  }

  // Curva: ecuación cartesiana, polar correcta y distractores en las dos direcciones.
  function curva(rng) {
    const nombre = rng.elegir(['recta-x', 'recta-y', 'recta', 'circ-polo', 'circ-cos', 'circ-sen', 'parabola', 'parabola', 'trayectoria']);
    const s = () => (rng.moneda() ? 1 : -1);
    if (nombre === 'recta-x' || nombre === 'recta-y') {
      const a = s() * rng.entero(2, 6), enX = nombre === 'recta-x';
      const c = enX ? [0, 0, 1, 0, -a] : [0, 0, 0, 1, -a];
      const q = enX ? { forma: 'frac', N: a, D0: 0, Dc: 1, Ds: 0 } : { forma: 'frac', N: a, D0: 0, Dc: 0, Ds: 1 };
      const tr = enX ? 'cos θ' : 'sen θ';
      return { nombre, cart: c, polar: q,
        aPolar: [
          cp('CP17-eje-cruzado', polar(enX ? { ...q, Dc: 0, Ds: 1 } : { ...q, Dc: 1, Ds: 0 }), `Cambiaste ${enX ? 'cos θ por sen θ' : 'sen θ por cos θ'}: ${enX ? 'x = r cos θ' : 'y = r sen θ'}.`),
          err('TP-multiplica-en-vez-de-dividir', polar({ forma: 'lin', K0: 0, Kc: enX ? a : 0, Ks: enX ? 0 : a }), `De r ${tr} = ${fracTxt(a)} se despeja r dividiendo entre ${tr}, no multiplicando.`),
          err('TP-recta-como-circunferencia', polar({ forma: 'lin', K0: Math.abs(a), Kc: 0, Ks: 0 }), `r = ${fracTxt(Math.abs(a))} es una circunferencia de centro en el polo, no una recta: la distancia al polo no es constante en una recta.`),
          err('TP-signo', polar({ ...q, N: -a }), 'Cambiaste el signo de la constante.'),
        ],
        aCart: [
          cp('CP17-eje-cruzado', cart(enX ? [0, 0, 0, 1, -a] : [0, 0, 1, 0, -a]), `${enX ? 'sec θ = 1/cos θ: r cos θ es x, no y' : 'csc θ = 1/sen θ: r sen θ es y, no x'}.`),
          err('TP-recta-como-circunferencia', cart([1, 1, 0, 0, -a * a]), `r ${tr} = ${fracTxt(a)} no es r = ${fracTxt(a)}: no es una circunferencia.`),
          err('TP-signo', cart(enX ? [0, 0, 1, 0, a] : [0, 0, 0, 1, a]), 'Cambiaste el signo de la constante.'),
        ] };
    }
    if (nombre === 'recta') {
      const a = s() * rng.entero(1, 4), b = s() * rng.entero(1, 4), c0 = s() * rng.entero(2, 12);
      if (Math.abs(a) === Math.abs(b)) return null;
      const q = { forma: 'frac', N: c0, D0: 0, Dc: a, Ds: b };
      return { nombre, cart: [0, 0, a, b, -c0], polar: q,
        aPolar: [
          cp('CP17-eje-cruzado', polar({ ...q, Dc: b, Ds: a }), 'Cruzaste seno y coseno: x = r cos θ e y = r sen θ.'),
          err('TP-signo-de-un-termino', polar({ ...q, Ds: -b }), 'Cambiaste el signo de uno de los términos al sacar r de factor común.'),
          err('TP-multiplica-en-vez-de-dividir', polar({ forma: 'lin', K0: 0, Kc: c0 * a, Ks: c0 * b }), 'De r(a cos θ + b sen θ) = c se despeja r dividiendo, no multiplicando.'),
          err('TP-solo-un-termino', polar({ ...q, Ds: 0 }), 'Olvidaste el término en y.'),
        ],
        aCart: [
          cp('CP17-eje-cruzado', cart([0, 0, b, a, -c0]), 'Cruzaste seno y coseno: r cos θ = x y r sen θ = y.'),
          err('TP-signo-de-un-termino', cart([0, 0, a, -b, -c0]), 'Cambiaste el signo de uno de los términos.'),
          err('TP-multiplica-en-vez-de-dividir', cart([1, 1, -c0 * a, -c0 * b, 0]), 'Multiplicaste por r en vez de pasarlo a multiplicar al otro lado: r(a cos θ + b sen θ) = c da ax + by = c.'),
        ] };
    }
    if (nombre === 'circ-polo') {
      const a = rng.entero(2, 6);
      const q = { forma: 'lin', K0: a, Kc: 0, Ks: 0 };
      return { nombre, cart: [1, 1, 0, 0, -a * a], polar: q,
        aPolar: [
          cp('CP13-sin-raiz', polar({ ...q, K0: a * a }), `r² = x² + y² = ${a * a}: r es la raíz, ${a}.`),
          err('TP-diametro', polar({ ...q, K0: 2 * a }), `Usaste el diámetro. El radio de x² + y² = ${a * a} es ${a}.`),
          err('TP-agrega-coseno', polar({ ...q, K0: 0, Kc: a }), `r = ${a} cos θ es otra circunferencia: pasa por el polo y tiene el centro en (${fracTxt(a / 2)}; 0).`),
          err('TP-r-cuadrado-sin-raiz', polar({ ...q, K0: a, pot: 2 }), `r² = ${a} da radio √${a}. La ecuación es r² = ${a * a}, o sea r = ${a}.`),
        ],
        aCart: [
          cp('CP13-sin-raiz', cart([1, 1, 0, 0, -a]), `r = ${a} es √(x² + y²) = ${a}: al elevar al cuadrado, x² + y² = ${a * a}.`),
          err('TP-r-es-x-mas-y', cart([0, 0, 1, 1, -a]), 'r no es x + y; es √(x² + y²).'),
          err('TP-diametro', cart([1, 1, 0, 0, -4 * a * a]), `Esa es la circunferencia de radio ${2 * a}. En r = ${a}, el radio es ${a}.`),
        ] };
    }
    if (nombre === 'circ-cos' || nombre === 'circ-sen') {
      const a = s() * rng.entero(1, 5), enX = nombre === 'circ-cos', K = 2 * a;
      const c = enX ? [1, 1, -K, 0, 0] : [1, 1, 0, -K, 0];
      const q = { forma: 'lin', K0: 0, Kc: enX ? K : 0, Ks: enX ? 0 : K };
      const otro = { ...q, Kc: q.Ks, Ks: q.Kc };
      return { nombre, cart: c, polar: q,
        aPolar: [
          err('TP-sin-factor-2', polar({ ...q, Kc: q.Kc / 2, Ks: q.Ks / 2 }), `Perdiste el 2: r² = ${fracTxt(K)}r ${enX ? 'cos' : 'sen'} θ da r = ${fracTxt(K)} ${enX ? 'cos' : 'sen'} θ.`),
          cp('CP17-eje-cruzado', polar(otro), `Cruzaste seno y coseno: ${enX ? 'x = r cos θ' : 'y = r sen θ'}.`),
          cp('CP15-centro-en-el-polo', polar({ forma: 'lin', K0: Math.abs(K), Kc: 0, Ks: 0 }), 'Esa circunferencia no tiene el centro en el polo: pasa por él.'),
          err('TP-sin-dividir-entre-r', polar({ ...q, pot: 2 }), 'Falta dividir entre r: r² = k·r cos θ da r = k cos θ (r = 0, el polo, ya está en la curva).'),
          err('TP-signo', polar({ ...q, Kc: -q.Kc, Ks: -q.Ks }), `Cambiaste el signo. El centro está del lado ${(enX ? (a > 0 ? 'derecho' : 'izquierdo') : (a > 0 ? 'de arriba' : 'de abajo'))}.`),
        ],
        aCart: [
          err('TP-sin-factor-2', cart(enX ? [1, 1, -a, 0, 0] : [1, 1, 0, -a, 0]), 'Perdiste un factor 2 al pasar.'),
          cp('CP17-eje-cruzado', cart(enX ? [1, 1, 0, -K, 0] : [1, 1, -K, 0, 0]), `Cruzaste: r ${enX ? 'cos θ es x' : 'sen θ es y'}.`),
          cp('CP15-centro-en-el-polo', cart([1, 1, 0, 0, -K * K]), 'Esa circunferencia pasa por el polo; no tiene centro en él.'),
          cp('CP19-sin-x', cart([1, 1, 0, 0, -K]), `Se multiplica por r: r² = ${fracTxt(K)}r ${enX ? 'cos θ' : 'sen θ'}, y r ${enX ? 'cos θ = x' : 'sen θ = y'}.`),
        ] };
    }
    // parábola con foco en el polo
    const tray = nombre === 'trayectoria';
    const p = tray ? rng.entero(1, 4) : rng.entero(1, 4);
    const enX = tray ? false : rng.moneda(), sg = tray ? -1 : s(); // r = 2p/(1 − sg·trig)
    const c = enX ? [0, 1, -4 * p * sg, 0, -4 * p * p] : [1, 0, 0, -4 * p * sg, -4 * p * p];
    const q = { forma: 'frac', N: 2 * p, D0: 1, Dc: enX ? -sg : 0, Ds: enX ? 0 : -sg };
    const base = {
      nombre, cart: c, polar: q,
      aPolar: [
        err('TP-signo-del-denominador', polar({ ...q, Dc: -q.Dc, Ds: -q.Ds }), `Cambiaste el signo de ${enX ? 'cos θ' : 'sen θ'}. La parábola abre ${enX ? (sg > 0 ? 'hacia la derecha' : 'hacia la izquierda') : (sg > 0 ? 'hacia arriba' : 'hacia abajo')}: r = 2p/(1 ${sg > 0 ? '−' : '+'} ${enX ? 'cos' : 'sen'} θ).`),
        err('TP-sin-factor-2', polar({ ...q, N: p }), `El numerador es 2p = ${2 * p}: de r = ${enX ? 'x' : 'y'}·(…) + ${2 * p} sale r(1 ${sg > 0 ? '−' : '+'} ${enX ? 'cos' : 'sen'} θ) = ${2 * p}.`),
        err('TP-numerador-4p', polar({ ...q, N: 4 * p }), `Usaste 4p = ${4 * p}. Al despejar queda 2p = ${2 * p} en el numerador.`),
        cp('CP17-eje-cruzado', polar({ ...q, Dc: q.Ds, Ds: q.Dc }), `Cruzaste seno y coseno: el eje de esta parábola es ${enX ? 'horizontal' : 'vertical'}.`),
      ],
      aCart: [
        err('TP-signo-del-denominador', cart(enX ? [0, 1, 4 * p * sg, 0, -4 * p * p] : [1, 0, 0, 4 * p * sg, -4 * p * p]), 'Cambiaste el signo del término lineal: revisa hacia dónde abre.'),
        err('TP-sin-factor-2', cart(enX ? [0, 1, -2 * p * sg, 0, -p * p] : [1, 0, 0, -2 * p * sg, -p * p]), `Tomaste 2p = ${p}: el numerador ${2 * p} ya es 2p.`),
        cp('CP17-eje-cruzado', cart(enX ? [1, 0, 0, -4 * p * sg, -4 * p * p] : [0, 1, -4 * p * sg, 0, -4 * p * p]), 'Cruzaste x con y: el eje de la parábola está en el otro eje.'),
        err('TP-olvida-constante', cart(enX ? [0, 1, -4 * p * sg, 0, 0] : [1, 0, 0, -4 * p * sg, 0]), `Al elevar al cuadrado ${2 * p} ${sg > 0 ? '+' : '−'} ${enX ? 'x' : 'y'} se olvidó el ${4 * p * p}.`),
        err('TP-sin-elevar', cart(enX ? [1, 1, -sg, 0, -2 * p] : [1, 1, 0, -sg, -2 * p]), `Reemplazaste r por x² + y², sin raíz: r = √(x² + y²). Hay que elevar al cuadrado los dos lados.`),
      ],
    };
    if (tray) { base.m = rng.entero(1, 6); base.k = p + rng.entero(1, 8); base.p = p; }
    return base;
  }

  // ---------- armado ----------
  function cerrar(rng, semilla, o) {
    const alternativas = P.armarTexto({ correcta: o.correcta, errores: o.errores.filter(Boolean), rng });
    return { id: `${ID}#${semilla}`, variables: o.variables, enunciado: o.enunciado, pregunta: o.pregunta, datos: '', alternativas, solucion: o.solucion,
      respuesta: { valor: o.correcta.clave, unidad: '' }, _datos: o.datos };
  }
  const TIPOS = ['a-polar', 'a-polar', 'a-cartesiana', 'a-cartesiana', 'punto-a-cart', 'punto-a-polar'];
  function generar(semilla) {
    const rng = Azar.crear(`${ID}|` + semilla);
    const tipo = rng.elegir(TIPOS);
    for (let i = 0; i < 400; i++) {
      const pr = tipo === 'a-polar' ? aPolar(rng, semilla) : tipo === 'a-cartesiana' ? aCart(rng, semilla) : tipo === 'punto-a-cart' ? puntoCart(rng, semilla) : puntoPolar(rng, semilla);
      if (pr && pr.alternativas.length >= 4) return pr;
    }
    throw new Error('No se pudo generar un problema con 4 alternativas distintas');
  }
  const VARS = { c: { nombre: 'ecuación cartesiana', color: 'o' }, q: { nombre: 'ecuación polar', color: 'd' }, x: { nombre: 'x = r cos θ', color: 'i' }, y: { nombre: 'y = r sen θ', color: 'h' } };
  const pasoCambio = ['Usa ', v('x', 'x = r cos θ'), ', ', v('y', 'y = r sen θ'), ' y x² + y² = r².'];
  function aPolar(rng, semilla) {
    const C = curva(rng); if (!C) return null;
    const correcta = polar(C.polar);
    const ec = C.nombre === 'trayectoria' ? `y = ${C.k} − (x − ${C.m})²/${4 * C.p}` : cart(C.cart).texto;
    const enunciado = C.nombre === 'trayectoria'
      ? ['Un balón lanzado sigue la trayectoria ', v('c', ec), ` (en metros). Su foco es F = (${C.m}; ${C.k - C.p}). Pon el polo en F y el eje polar paralelo al eje X, hacia la derecha.`]
      : ['Una curva tiene ecuación cartesiana ', v('c', ec), '.'];
    const solucion = C.nombre === 'trayectoria'
      ? [[`Con X = x − ${C.m} e Y = y − ${C.k - C.p} (coordenadas desde el foco): (x − ${C.m})² = −${4 * C.p}(y − ${C.k}) se vuelve `, v('c', cart(C.cart).texto.replace(/x/g, 'X').replace(/y/g, 'Y')), '.'],
        pasoCambio, [`r = √(X² + Y²) = ${2 * C.p} − Y, con Y = r sen θ ⇒ r(1 + sen θ) = ${2 * C.p}.`], ['', v('q', correcta.texto), '.']]
      : [pasoCambio, [`Reemplaza en ${cart(C.cart).texto} y despeja r.`], ['', v('q', correcta.texto), '.']];
    return cerrar(rng, semilla, { correcta, errores: C.aPolar, variables: VARS, enunciado, pregunta: ['¿Cuál es su ecuación polar?'], solucion,
      datos: { tipo: 'a-polar', curva: C.nombre, cart: C.cart, ...(C.nombre === 'trayectoria' ? { m: C.m, k: C.k, p: C.p } : {}) } });
  }
  function aCart(rng, semilla) {
    const C = curva(rng); if (!C || C.nombre === 'trayectoria') return null;
    const correcta = cart(C.cart);
    const enunciado = ['Una curva tiene ecuación polar ', v('q', polar(C.polar).texto), '.'];
    const solucion = [pasoCambio,
      [C.polar.forma === 'frac' ? 'Pasa el denominador a multiplicar a r y reemplaza r cos θ y r sen θ' : 'Multiplica por r si hace falta y reemplaza r², r cos θ y r sen θ', C.nombre === 'parabola' ? '; luego aísla √(x² + y²) y eleva al cuadrado.' : '.'],
      ['', v('c', correcta.texto), '.']];
    return cerrar(rng, semilla, { correcta, errores: C.aCart, variables: VARS, enunciado, pregunta: ['¿Cuál es su ecuación cartesiana?'], solucion,
      datos: { tipo: 'a-cartesiana', curva: C.nombre, polar: C.polar } });
  }

  // ---------- puntos ----------
  const ANG = [30, 45, 60, 120, 135, 150, 210, 225, 240, 300, 315, 330, 90, 180, 270];
  const angTxt = (g, modo) => (modo === 'radianes' ? (P.pi(g * GR) || '0') : `${P.formatear(g)}°`);
  const num = x => (Math.abs(x * 2 - Math.round(x * 2)) < 1e-9 ? fracTxt(x) : P.radical(x));
  const ptTxt = (x, y) => ({ clave: `pt:${r6(x)}|${r6(y)}`, texto: `(${num(x)}; ${num(y)})` });
  function puntoCart(rng, semilla) {
    const r = rng.elegir([2, 4, 6, 8, -2, -4]), th = rng.elegir(ANG.slice(0, 12)), modo = rng.elegir(['grados', 'radianes']);
    const c = Math.cos(th * GR), s = Math.sin(th * GR), x = r * c, y = r * s;
    const correcta = ptTxt(x, y);
    const ref = th % 90 === 0 ? th : [th % 180, 180 - (th % 180)].reduce((a, b) => Math.min(a, b));
    const errores = [
      err('TP-cruza-coordenadas', ptTxt(r * s, r * c), 'Cruzaste: x = r cos θ e y = r sen θ.'),
      cp('CP14-olvida-r', ptTxt(c * Math.sign(r), s * Math.sign(r)), `Olvidaste multiplicar por r = ${r}.`),
      err('TR12-signo-del-cuadrante', ptTxt(-x, y), `El signo de x no corresponde al cuadrante: cos ${angTxt(th, modo)} = ${num(c)}.`, 'parcial', TRI),
      cp('CP2-reduce-al-primer-cuadrante', ptTxt(Math.abs(r) * Math.cos(ref * GR), Math.abs(r) * Math.sin(ref * GR)), 'Usaste el ángulo de referencia sin los signos del cuadrante.'),
    ];
    if (r < 0) errores.unshift(err('CP3-ignora-signo-de-r', ptTxt(-x, -y), `Con r = ${r} < 0, el punto queda del lado opuesto al de θ: x = r cos θ e y = r sen θ con r negativo.`, 'parcial', MAV));
    const rT = r < 0 ? `(−${Math.abs(r)})` : String(r);
    const enunciado = ['Un punto tiene coordenadas polares (', v('q', `${r < 0 ? '−' : ''}${Math.abs(r)}; ${angTxt(th, modo)}`), ').'];
    const solucion = [pasoCambio,
      ['', v('x', `x = ${rT}·cos ${angTxt(th, modo)} = ${num(x)}`), '; ', v('y', `y = ${rT}·sen ${angTxt(th, modo)} = ${num(y)}`), '.'],
      ['El punto es ', v('c', correcta.texto), '.']];
    return cerrar(rng, semilla, { correcta, errores, variables: VARS, enunciado, pregunta: ['¿Cuáles son sus coordenadas cartesianas (x; y)?'], solucion,
      datos: { tipo: 'punto-a-cart', r, theta: th, modo } });
  }
  function puntoPolar(rng, semilla) {
    const th = rng.elegir(ANG.slice(0, 12)), modo = rng.elegir(['grados', 'radianes']);
    const r = th % 90 === 45 ? rng.elegir([1, 2, 3]) * Math.SQRT2 : rng.elegir([2, 4, 6, 8]);
    const x = r * Math.cos(th * GR), y = r * Math.sin(th * GR);
    const pp = (rr, g) => ({ clave: `pp:${r6(rr)}|${r6(((g % 360) + 360) % 360)}`, texto: `(${P.radical(rr)}; ${angTxt(g, modo)})` });
    const correcta = pp(r, th);
    const mismo = (rr, g) => Math.abs(rr * Math.cos(g * GR) - x) < 1e-9 && Math.abs(rr * Math.sin(g * GR) - y) < 1e-9;
    const cand = [];
    const add = (id, rr, g, expl, resp, fte) => { if (!mismo(rr, g) && g > -360) cand.push(err(id, pp(rr, g), expl, resp || 'hipotesis', fte || MAV)); };
    const atan = Math.round(Math.atan(y / x) / GR * 1e6) / 1e6, ref = Math.abs(atan);
    if (Math.abs(x) > 1e-9) add('CP10-arctan-directo', r, ((atan % 360) + 360) % 360, 'Usaste θ = arctan(y/x) tal como lo da la calculadora. Ese ángulo está en el I o el IV cuadrante; el punto está en otro.');
    if (Math.abs(x) > 1e-9) add('CP12-angulo-de-referencia', r, ref, 'Ese es el ángulo agudo con el eje X, no el ángulo medido desde el eje polar.');
    add('CP13-sin-raiz', r * r, th, `r = √(x² + y²) = ${P.radical(r)}; olvidaste la raíz.`);
    add('CP9-desde-el-eje-vertical', r, ((90 - th) % 360 + 360) % 360, 'Mediste el ángulo desde el eje Y. θ se mide desde el semieje X positivo, en sentido antihorario.');
    if (Math.abs(y) > 1e-9) add('CP11-arctan-invertido', r, ((Math.round(Math.atan(x / y) / GR * 1e6) / 1e6) % 360 + 360) % 360, 'Usaste arctan(x/y): la tangente es y/x.');
    add('TP-suma-180-de-mas', r, (th + 180) % 360, 'Sumaste 180° sin que hiciera falta: ese ángulo apunta al cuadrante opuesto. Mira los signos de x e y antes de corregir el ángulo.');
    const errores = cand;
    const enunciado = ['Un punto tiene coordenadas cartesianas (', v("x", num(x)), "; ", v("y", num(y)), ').'];
    const cuad = th < 90 ? 'I' : th < 180 ? 'II' : th < 270 ? 'III' : 'IV';
    const solucion = [
      ['r = √(x² + y²) = √', `${fracTxt(x * x + y * y)} = ${P.radical(r)}`, '.'],
      [`Signos: x ${x > 0 ? '> 0' : x < 0 ? '< 0' : '= 0'}, y ${y > 0 ? '> 0' : y < 0 ? '< 0' : '= 0'}: el punto está en el ${cuad} cuadrante; el ángulo de referencia es ${angTxt(th % 90 === 0 ? 90 : Math.min(th % 180, 180 - th % 180), modo)}.`],
      ['Medido desde el eje polar: ', v('q', `θ = ${angTxt(th, modo)}`), '; el punto es ', v('q', correcta.texto), '.']];
    return cerrar(rng, semilla, { correcta, errores, variables: VARS, enunciado, pregunta: [`¿Cuáles son sus coordenadas polares (r; θ), con r > 0 y 0 ≤ θ < ${modo === 'radianes' ? '2π' : '360°'}?`], solucion,
      datos: { tipo: 'punto-a-polar', x, y, modo } });
  }

  const calc = {
    polar: q => polar(q),
    cartesiana: c => cart(c),
    aCartesianas: (r, g) => ({ x: r * Math.cos(g * GR), y: r * Math.sin(g * GR), texto: ptTxt(r * Math.cos(g * GR), r * Math.sin(g * GR)).texto }),
    aPolares: (x, y) => { const g = ((Math.atan2(y, x) / GR) % 360 + 360) % 360; return { r: Math.hypot(x, y), theta: Math.round(g * 1e9) / 1e9 }; },
  };
  return { id: ID, titulo: 'De cartesianas a polares y al revés', generar, calc };
});
