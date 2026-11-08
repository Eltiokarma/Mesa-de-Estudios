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
 * curva: 'recta-x' (x = a), 'recta-y' (y = b), 'recta' (ax + by = c), 'circ-polo' (x² + y² = R²),
 *   'circ-cos' (x² + y² = 2ax), 'circ-sen' (x² + y² = 2by), 'parabola' (y² = ±4p·x + 4p² o
 *   x² = ±4p·y + 4p², foco en el polo) y 'trayectoria' (y = k − (x − m)²/(4p): el polo se pone en el
 *   foco F = (m; k − p) y el eje polar, paralelo al eje X).
 * cart = [A, B, C, D, E]: A·x² + B·y² + C·x + D·y + E = 0 (en la trayectoria, en las coordenadas X, Y
 *   medidas desde el foco).
 * polar: { forma: 'frac', N, D0, Dc, Ds } es r = N/(D0 + Dc·cos θ + Ds·sen θ);
 *        { forma: 'lin', K0, Kc, Ks, pot } es r^pot = K0 + Kc·cos θ + Ks·sen θ.
 * Claves de las respuestas (armarTexto), con números a 9 decimales: polar 'pf:N|D0|Dc|Ds' (dividido entre
 * el primer coeficiente no nulo del denominador) o 'pl:pot:K0|Kc|Ks'; cartesiana 'cart:A|B|C|D|E'
 * (dividida entre el primer coeficiente no nulo); punto 'pt:x|y'; punto polar 'pp:r|θ'.
 *
 * Distractores: cada problema tiene varios rasgos (el factor, el signo, el eje, la forma de despejar; en
 * los puntos, r, θ, el orden y los signos). Los distractores cruzan errores de varios rasgos, y se eligen
 * de modo que la correcta no sea «la más parecida a las demás».
 * Errores: CP2, CP3, CP9 a CP15, CP17 y CP19 de plantillas/coordenadas-polares/motor.js (CP3 parcial; el
 * resto, hipótesis; docs/investigacion/matematica-avanzada-ideas-erroneas.md), TR12 (parcial, en CP2:
 * docs/investigacion/trigonometria-ideas-erroneas.md). Los TP-* son hipótesis nuestras. Un error cruzado
 * lleva los códigos unidos con «+» y es hipótesis.
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
  // Número como fracción («3/2») o, si no, como raíz («2√3», «√2/2»).
  const fraccion = x => { for (let d = 1; d <= 64; d++) { const n = Math.round(x * d); if (Math.abs(x * d - n) < 1e-9) return P.textoFraccion(P.frac(n, d)); } return null; };
  const num = x => fraccion(x) ?? P.radical(x);
  const r6 = x => String(Math.round(x * 1e9) / 1e9 + 0);
  const mcd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a; };

  // Términos «2 cos θ − (3/2) sen θ + 4»; el primero sin signo.
  function terminos(terms) {
    let t = '';
    for (const [c, s] of terms) {
      if (!c) continue;
      const a = Math.abs(c), n = num(a), pega = /^[xy]/.test(s) ? '' : ' ';
      const cuerpo = s ? (a === 1 ? s : `${n.includes('/') ? `(${n})` : n}${pega}${s}`) : n;
      t += t === '' ? (c < 0 ? '−' : '') + cuerpo : (c < 0 ? ' − ' : ' + ') + cuerpo;
    }
    return t || '0';
  }
  // ---------- ecuaciones polares ----------
  function polar(q) {
    if (!q) return null;
    if (q.forma === 'frac') {
      let { N, D0, Dc, Ds } = q;
      const lead = [D0, Dc, Ds].find(x => x);
      const clave = 'pf:' + [N, D0, Dc, Ds].map(x => r6(x / lead)).join('|');
      if (lead < 0) [N, D0, Dc, Ds] = [-N, -D0, -Dc, -Ds]; // primer coeficiente del denominador positivo
      let texto;
      if (!D0 && !Ds) texto = `r = ${terminos([[N / Dc, 'sec θ']])}`;
      else if (!D0 && !Dc) texto = `r = ${terminos([[N / Ds, 'csc θ']])}`;
      else texto = `r = ${num(N)}/(${terminos([[D0, ''], [Dc, 'cos θ'], [Ds, 'sen θ']])})`;
      return { clave, texto };
    }
    const { K0, Kc, Ks, pot = 1 } = q;
    return { clave: `pl:${pot}:` + [K0, Kc, Ks].map(r6).join('|'), texto: `${pot === 2 ? 'r²' : 'r'} = ${terminos([[K0, ''], [Kc, 'cos θ'], [Ks, 'sen θ']])}` };
  }
  // ---------- ecuaciones cartesianas ----------
  function cart(c) {
    if (!c) return null;
    const lead = c.find(x => x);
    const clave = 'cart:' + c.map(x => r6(x / lead)).join('|');
    let [A, B, C, D, E] = c;
    if (c.every(Number.isInteger)) { const g = c.reduce((p, x) => mcd(p, x), 0) || 1; [A, B, C, D, E] = c.map(x => x / g); }
    let texto;
    if (A || B) {
      if ((A || B) < 0) [A, B, C, D, E] = [-A, -B, -C, -D, -E];
      texto = `${terminos([[A, 'x²'], [B, 'y²']])} = ${terminos([[-C, 'x'], [-D, 'y'], [-E, '']])}`;
    } else {
      if ((C || D) < 0) [C, D, E] = [-C, -D, -E];
      if (!D) texto = `x = ${num(-E / C)}`;
      else if (!C) texto = `y = ${num(-E / D)}`;
      else texto = `${terminos([[C, 'x'], [D, 'y']])} = ${num(-E)}`;
    }
    return { clave, texto };
  }

  // ---------- rasgos de cada curva ----------
  // Cada rasgo: lista de valores (el primero es el correcto) con el código y la explicación del error.
  // construir(valores) da { polar, cart } (cualquiera puede ser null si no se escribe así).
  const R_ = (valor, id, expl, respaldo = 'hipotesis', fuente = null) => ({ valor, id, expl, respaldo, fuente });
  const CP = (valor, id, expl) => R_(valor, id, expl, 'hipotesis', MAV);
  function curva(rng) {
    const nombre = rng.elegir(['recta-x', 'recta-y', 'recta', 'circ-polo', 'circ-cos', 'circ-sen', 'parabola', 'parabola', 'trayectoria']);
    const s = () => (rng.moneda() ? 1 : -1);
    if (nombre === 'recta-x' || nombre === 'recta-y') {
      const a = s() * rng.entero(2, 9), enX = nombre === 'recta-x';
      const rasgos = [
        [R_(enX, ''), CP(!enX, 'CP17-eje-cruzado', `Cruzaste: ${enX ? 'x = r cos θ, así que va cos θ (sec θ), no sen θ' : 'y = r sen θ, así que va sen θ (csc θ), no cos θ'}.`)],
        [R_(1, ''), R_(-1, 'TP-signo', 'Cambiaste el signo de la constante.')],
        [R_('div', ''), R_('mult', 'TP-multiplica-en-vez-de-dividir', `De r ${enX ? 'cos' : 'sen'} θ = ${num(a)} se despeja r dividiendo: el ${enX ? 'cos' : 'sen'} θ pasa a dividir, no a multiplicar.`),
          R_('const', 'TP-recta-como-circunferencia', 'Una distancia al polo constante da una circunferencia, no una recta.')],
      ];
      const construir = ([x, sg, forma]) => {
        const A = sg * a;
        if (forma === 'div') return { polar: { forma: 'frac', N: A, D0: 0, Dc: x ? 1 : 0, Ds: x ? 0 : 1 }, cart: x ? [0, 0, 1, 0, -A] : [0, 0, 0, 1, -A] };
        if (forma === 'mult') return { polar: { forma: 'lin', K0: 0, Kc: x ? A : 0, Ks: x ? 0 : A }, cart: x ? [1, 1, -A, 0, 0] : [1, 1, 0, -A, 0] };
        return x === enX ? { polar: { forma: 'lin', K0: A, Kc: 0, Ks: 0 }, cart: [1, 1, 0, 0, -A * A] } : null;
      };
      return { nombre, rasgos, construir };
    }
    if (nombre === 'recta') {
      const a = s() * rng.entero(1, 6), b = s() * rng.entero(1, 6), c0 = s() * rng.entero(2, 12);
      if (Math.abs(a) === Math.abs(b) || mcd(mcd(a, b), c0) !== 1) return null;
      const rasgos = [
        [R_(false, ''), CP(true, 'CP17-eje-cruzado', 'Cruzaste seno y coseno: x = r cos θ e y = r sen θ.')],
        [R_(false, ''), R_(true, 'TP-signo-de-un-termino', 'Cambiaste el signo del término en y.')],
        [R_('div', ''), R_('mult', 'TP-multiplica-en-vez-de-dividir', 'El denominador no multiplica al numerador: pasa (a cos θ + b sen θ) a multiplicar a r.')],
      ];
      const construir = ([cruz, sig, forma]) => {
        let [p, q] = cruz ? [b, a] : [a, b]; if (sig) q = -q;
        return forma === 'div' ? { polar: { forma: 'frac', N: c0, D0: 0, Dc: p, Ds: q }, cart: [0, 0, p, q, -c0] }
          : { polar: { forma: 'lin', K0: 0, Kc: c0 * p, Ks: c0 * q }, cart: [1, 1, -c0 * p, -c0 * q, 0] };
      };
      return { nombre, rasgos, construir };
    }
    if (nombre === 'circ-polo') {
      // Radio entero o raíz (√n); en el sentido polar → cartesiano solo enteros.
      const raiz = rng.moneda(), n0 = raiz ? rng.elegir([2, 3, 5, 6, 7, 8, 10, 12]) : 0, R0 = raiz ? Math.sqrt(n0) : rng.entero(2, 9);
      const cuadrado = R => Math.round(R * R * 1e9) / 1e9;
      const rasgos = dir => [
        [R_(R0, ''), dir === 'a-polar' ? CP(cuadrado(R0), 'CP13-sin-raiz', `r² = x² + y² = ${num(cuadrado(R0))}: r es la raíz, ${num(R0)}.`)
          : CP(Math.sqrt(R0), 'CP13-sin-raiz', `r = ${num(R0)} es √(x² + y²) = ${num(R0)}: al elevar al cuadrado queda ${num(R0 * R0)}, no ${num(R0)}.`),
          R_(2 * R0, 'TP-diametro', `Usaste el diámetro, ${num(2 * R0)}. El radio es ${num(R0)}.`)],
        [R_('const', ''), R_('cos', 'TP-agrega-coseno', 'Agregaste un cos θ: r = c·cos θ es otra circunferencia, que pasa por el polo.')],
      ];
      const construir = ([R, forma]) => (forma === 'const' ? { polar: { forma: 'lin', K0: R, Kc: 0, Ks: 0 }, cart: [1, 1, 0, 0, -cuadrado(R)] }
        : { polar: { forma: 'lin', K0: 0, Kc: R, Ks: 0 }, cart: Number.isInteger(R) ? [1, 1, -R, 0, 0] : null });
      return { nombre, rasgos, construir, raiz };
    }
    if (nombre === 'circ-cos' || nombre === 'circ-sen') {
      const a = s() * rng.entero(2, 9), enX = nombre === 'circ-cos', K = 2 * a;
      const fn = enX ? 'cos' : 'sen', otra = enX ? 'sen' : 'cos', coord = enX ? 'x' : 'y';
      const rasgos = [
        [R_(K, ''), R_(a, 'TP-sin-factor-2', 'Tomaste la mitad (el radio) en vez del coeficiente.'), R_(2 * K, 'TP-doble', 'Duplicaste el coeficiente: el diámetro ya es el coeficiente.')],
        [R_(1, ''), R_(-1, 'TP-signo', `Cambiaste el signo. El centro está del lado ${enX ? (a > 0 ? 'derecho' : 'izquierdo') : (a > 0 ? 'de arriba' : 'de abajo')}.`)],
        [R_(enX, ''), CP(!enX, 'CP17-eje-cruzado', `Cruzaste: ${coord} = r ${fn} θ; el centro está sobre el eje ${enX ? 'X' : 'Y'}.`)],
        [R_(1, ''), R_(2, 'TP-sin-dividir-entre-r', `Reemplazaste ${coord} por ${fn} θ, pero ${coord} = r ${fn} θ: r² = ${num(K)}r ${fn} θ, y al dividir entre r queda r = ${num(K)} ${fn} θ.`)],
      ];
      const construir = ([k, sg, x, pot]) => {
        const kk = sg * k;
        return { polar: { forma: 'lin', K0: 0, Kc: x ? kk : 0, Ks: x ? 0 : kk, pot }, cart: pot === 1 ? (x ? [1, 1, -kk, 0, 0] : [1, 1, 0, -kk, 0]) : null };
      };
      return { nombre, rasgos, construir, otra };
    }
    // parábola con foco en el polo: r = N/(1 − σ·trig)
    const tray = nombre === 'trayectoria';
    const p = rng.entero(1, tray ? 6 : 4);
    const enX = tray ? false : rng.moneda(), sg = tray ? -1 : s();
    const abre = enX ? (sg > 0 ? 'hacia la derecha' : 'hacia la izquierda') : (sg > 0 ? 'hacia arriba' : 'hacia abajo');
    const rasgos = [
      [R_(2 * p, ''), R_(p, 'TP-numerador-p', `El numerador es 2p = ${2 * p}, no p = ${p}.`), R_(4 * p, 'TP-numerador-4p', `Usaste 4p = ${4 * p}. Al despejar queda 2p = ${2 * p} en el numerador.`)],
      [R_(sg, ''), R_(-sg, 'TP-signo-del-denominador', `Cambiaste el signo del denominador. La parábola abre ${abre}: va 1 ${sg > 0 ? '−' : '+'} ${enX ? 'cos' : 'sen'} θ.`)],
      [R_(enX, ''), CP(!enX, 'CP17-eje-cruzado', `Cruzaste seno y coseno: el eje de esta parábola es ${enX ? 'horizontal' : 'vertical'}.`)],
    ];
    const construir = ([N, sig, x]) => ({
      polar: { forma: 'frac', N, D0: 1, Dc: x ? -sig : 0, Ds: x ? 0 : -sig },
      cart: x ? [0, 1, -2 * N * sig, 0, -N * N] : [1, 0, 0, -2 * N * sig, -N * N],
    });
    const C = { nombre, rasgos, construir };
    if (tray) { C.p = p; C.m = rng.entero(1, 9); C.k = p + rng.entero(1, 9); }
    return C;
  }

  // ---------- elección de distractores ----------
  // Distancia de Hamming entre dos claves (por partes).
  const partes = c => c.split(/[:|]/);
  const hamming = (a, b) => { const x = partes(a), y = partes(b); let d = Math.abs(x.length - y.length); for (let i = 0; i < Math.min(x.length, y.length); i++) if (x[i] !== y[i]) d++; return d; };
  // De un conjunto de candidatos, toma 4 (o 3) de modo que la correcta no sea la más central.
  function elegir(rng, correcta, pool) {
    const vistos = new Set([correcta.clave]), textos = new Set([correcta.texto]);
    const unicos = pool.filter(e => e && !vistos.has(e.clave) && !textos.has(e.texto) && vistos.add(e.clave) && textos.add(e.texto));
    for (const n of [4, 3]) {
      if (unicos.length < n) continue;
      for (let intento = 0; intento < 80; intento++) {
        const sel = rng.barajar(unicos).slice(0, n), todas = [correcta, ...sel];
        const suma = x => todas.reduce((t, y) => t + hamming(x.clave, y.clave), 0);
        const sc = suma(correcta);
        if (sel.some(e => suma(e) <= sc)) return sel;
      }
    }
    return null;
  }
  // Todas las combinaciones de rasgos salvo la correcta, con sus errores juntos.
  function combinaciones(rasgos, construir, rep) {
    const out = [];
    const idx = rasgos.map(() => 0);
    const rec = i => {
      if (i === rasgos.length) {
        if (idx.every(x => x === 0) || idx.filter(x => x > 0).length > 2) return; // a lo más dos errores juntos
        const vals = rasgos.map((r, k) => r[idx[k]].valor), b = construir(vals);
        const eq = b && rep(b);
        if (!eq) return;
        const errs = rasgos.map((r, k) => r[idx[k]]).filter((e, k) => idx[k] > 0);
        const uno = errs.length === 1;
        out.push({ id: errs.map(e => e.id).join('+'), ...eq, explicacion: errs.map(e => e.expl).join(' Además: ').replace(/ Además: (.)/g, (m, c) => ' Además, ' + c.toLowerCase()),
          respaldo: uno ? errs[0].respaldo : 'hipotesis', fuente: uno ? errs[0].fuente : (errs.some(e => e.fuente) ? MAV : null) });
        return;
      }
      for (let j = 0; j < rasgos[i].length; j++) { idx[i] = j; rec(i + 1); }
      idx[i] = 0;
    };
    rec(0);
    return out;
  }

  // ---------- armado ----------
  function cerrar(rng, semilla, o) {
    const errores = elegir(rng, o.correcta, o.pool);
    if (!errores) return null;
    const alternativas = P.armarTexto({ correcta: o.correcta, errores, rng, total: errores.length + 1 });
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
  const VARS = { c: { nombre: 'forma cartesiana', color: 'o' }, q: { nombre: 'forma polar', color: 'd' }, x: { nombre: 'x = r cos θ', color: 'i' }, y: { nombre: 'y = r sen θ', color: 'h' } };
  const pasoCambio = (X = 'x', Y = 'y') => ['Usa ', v('x', `${X} = r cos θ`), ', ', v('y', `${Y} = r sen θ`), ` y ${X}² + ${Y}² = r².`];
  const rasgosDe = (C, dir) => (typeof C.rasgos === 'function' ? C.rasgos(dir) : C.rasgos);
  const correctos = rasgos => rasgos.map(r => r[0].valor);
  function aPolar(rng, semilla) {
    const C = curva(rng); if (!C) return null;
    const rasgos = rasgosDe(C, 'a-polar'), base = C.construir(correctos(rasgos));
    const correcta = polar(base.polar);
    const pool = combinaciones(rasgos, C.construir, b => polar(b.polar));
    const tray = C.nombre === 'trayectoria';
    const ecTxt = tray ? `y = ${C.k} − (x − ${C.m})²/${4 * C.p}` : C.raiz ? `x² + y² = ${num(base.cart[4] * -1)}` : cart(base.cart).texto;
    const enunciado = tray
      ? ['Un balón lanzado sigue la trayectoria ', v('c', ecTxt), ` (en metros). Su foco es F = (${C.m}; ${C.k - C.p}). Pon el polo en F y el eje polar paralelo al eje X, hacia la derecha.`]
      : ['Una curva tiene ecuación cartesiana ', v('c', ecTxt), '.'];
    const solucion = tray
      ? [[`Desde el foco, X = x − ${C.m} e Y = y − ${C.k - C.p}: (x − ${C.m})² = −${4 * C.p}(y − ${C.k}) se vuelve `, v('c', cart(base.cart).texto.replace(/x/g, 'X').replace(/y/g, 'Y')), '.'],
        pasoCambio('X', 'Y'), [`√(X² + Y²) = ${2 * C.p} − Y, o sea r = ${2 * C.p} − r sen θ ⇒ r(1 + sen θ) = ${2 * C.p}.`], ['', v('q', correcta.texto), '.']]
      : [pasoCambio(), [`Reemplaza en ${ecTxt} y despeja r.`], ['', v('q', correcta.texto), '.']];
    return cerrar(rng, semilla, { correcta, pool, variables: VARS, enunciado, pregunta: ['¿Cuál es su ecuación polar?'], solucion,
      datos: { tipo: 'a-polar', curva: C.nombre, cart: base.cart, ...(tray ? { m: C.m, k: C.k, p: C.p } : {}) } });
  }
  function aCart(rng, semilla) {
    const C = curva(rng); if (!C || C.nombre === 'trayectoria' || C.raiz) return null;
    const rasgos = rasgosDe(C, 'a-cartesiana'), base = C.construir(correctos(rasgos));
    const correcta = cart(base.cart);
    const pool = combinaciones(rasgos, C.construir, b => cart(b.cart));
    const enunciado = ['Una curva tiene ecuación polar ', v('q', polar(base.polar).texto), '.'];
    const solucion = [pasoCambio(),
      [base.polar.forma === 'frac' ? 'Pasa el denominador a multiplicar a r y reemplaza r cos θ y r sen θ' : 'Multiplica por r si hace falta y reemplaza r², r cos θ y r sen θ', C.nombre === 'parabola' ? '; luego aísla √(x² + y²) y eleva al cuadrado.' : '.'],
      ['', v('c', correcta.texto), '.']];
    return cerrar(rng, semilla, { correcta, pool, variables: VARS, enunciado, pregunta: ['¿Cuál es su ecuación cartesiana?'], solucion,
      datos: { tipo: 'a-cartesiana', curva: C.nombre, polar: base.polar } });
  }

  // ---------- puntos ----------
  const ANG = [30, 45, 60, 120, 135, 150, 210, 225, 240, 300, 315, 330];
  const angTxt = (g, modo) => (modo === 'radianes' ? (P.pi(g * GR) || '0') : `${P.formatear(g)}°`);
  const ptTxt = (x, y) => ({ clave: `pt:${r6(x)}|${r6(y)}`, texto: `(${num(x)}; ${num(y)})` });
  function puntoCart(rng, semilla) {
    const r = rng.elegir([2, 4, 6, 8, -2, -4, -6]), th = rng.elegir(ANG), modo = rng.elegir(['grados', 'radianes']);
    const c = Math.cos(th * GR), s = Math.sin(th * GR), x = r * c, y = r * s;
    const correcta = ptTxt(x, y);
    const rT = r < 0 ? `(−${Math.abs(r)})` : String(r), aT = angTxt(th, modo);
    const rasgos = [
      [R_(1, ''), CP(Math.sign(r) / r, 'CP14-olvida-r', `Olvidaste multiplicar por r = ${num(r)}.`)],
      [R_(false, ''), R_(true, 'TP-cruza-coordenadas', 'Cruzaste: x = r cos θ e y = r sen θ.')],
      [R_('ok', ''), R_('x', 'TP-signo-de-x', `x = ${rT}·cos ${aT} = ${num(x)}: revisa el signo de cos ${aT} y el de r.`),
        R_('y', 'TP-signo-de-y', `y = ${rT}·sen ${aT} = ${num(y)}: revisa el signo de sen ${aT} y el de r.`),
        r < 0 ? R_('ambos', 'CP3-ignora-signo-de-r', `Con r = ${num(r)} < 0, el punto queda del lado opuesto al de θ: x = r cos θ e y = r sen θ llevan el signo de r.`, 'parcial', MAV)
          : R_('ambos', 'TP-cuadrante-opuesto', 'Pusiste el punto en el cuadrante opuesto: los dos signos están cambiados.'),
        R_('abs', 'CP2-reduce-al-primer-cuadrante', 'Usaste el ángulo de referencia sin los signos del cuadrante: x e y salieron positivos.', 'parcial', TRI)],
    ];
    const construir = ([esc, cruz, sg]) => {
      let [a, b] = cruz ? [y, x] : [x, y]; a *= esc; b *= esc;
      if (sg === 'x' || sg === 'ambos') a = -a; if (sg === 'y' || sg === 'ambos') b = -b; if (sg === 'abs') { a = Math.abs(a); b = Math.abs(b); }
      return { pt: ptTxt(a, b) };
    };
    const pool = combinaciones(rasgos, construir, b => b.pt).filter(e => !(Math.abs(Number(e.clave.split(/[:|]/)[1]) - x) < 1e-6 && Math.abs(Number(e.clave.split('|')[1]) - y) < 1e-6));
    const enunciado = ['Un punto tiene coordenadas polares (', v('q', `${num(r)}; ${aT}`), ').'];
    const solucion = [pasoCambio(),
      ['', v('x', `x = ${rT}·cos ${aT} = ${num(x)}`), '; ', v('y', `y = ${rT}·sen ${aT} = ${num(y)}`), '.'],
      ['El punto es ', v('c', correcta.texto), '.']];
    return cerrar(rng, semilla, { correcta, pool, variables: VARS, enunciado, pregunta: ['¿Cuáles son sus coordenadas cartesianas (x; y)?'], solucion,
      datos: { tipo: 'punto-a-cart', r, theta: th, modo } });
  }
  function puntoPolar(rng, semilla) {
    const th = rng.elegir(ANG), modo = rng.elegir(['grados', 'radianes']);
    const r = th % 90 === 45 ? rng.elegir([1, 2, 3]) * Math.SQRT2 : rng.elegir([2, 4, 6, 8]);
    const x = r * Math.cos(th * GR), y = r * Math.sin(th * GR);
    const norm = g => ((g % 360) + 360) % 360;
    const sumaAbs = Math.abs(x) + Math.abs(y);
    const rTexto = rr => (Math.abs(rr - sumaAbs) < 1e-9 && fraccion(rr) === null && P.radical(rr).includes(',') ? [num(Math.abs(x)), num(Math.abs(y))].sort((a, b) => a.length - b.length).join(' + ') : num(rr));
    const pp = (rr, g) => ({ clave: `pp:${r6(rr)}|${r6(norm(g))}`, texto: `(${rTexto(rr)}; ${angTxt(norm(g), modo)})` });
    const correcta = pp(r, th);
    const atan = Math.round(Math.atan(y / x) / GR * 1e6) / 1e6, ref = Math.abs(atan);
    const angulos = [R_(th, ''), CP(norm(atan), 'CP10-arctan-directo', 'Usaste θ = arctan(y/x) tal como lo da la calculadora. Ese ángulo está en el I o el IV cuadrante; mira los signos de x e y.'),
      CP(ref, 'CP12-angulo-de-referencia', 'Ese es el ángulo agudo con el eje X, no el ángulo medido desde el eje polar.'),
      CP(norm(90 - th), 'CP9-desde-el-eje-vertical', 'Mediste el ángulo desde el eje Y. θ se mide desde el semieje X positivo, en sentido antihorario.'),
      CP(norm(Math.round(Math.atan(x / y) / GR * 1e6) / 1e6), 'CP11-arctan-invertido', 'Usaste arctan(x/y): la tangente es y/x.'),
      R_(norm(th + 180), 'TP-suma-180-de-mas', 'Sumaste 180° sin que hiciera falta: ese ángulo apunta al cuadrante opuesto.')];
    const unicosAng = angulos.filter((a, i) => i === 0 || (Math.abs(a.valor - th) > 1e-6 && angulos.findIndex(b => Math.abs(b.valor - a.valor) < 1e-6) === i));
    const rasgos = [[R_(r, ''), CP(r * r, 'CP13-sin-raiz', `r = √(x² + y²) = ${num(r)}; olvidaste la raíz.`), R_(sumaAbs, 'TP-r-suma', 'r no es |x| + |y|; es √(x² + y²).')], unicosAng];
    const pool = combinaciones(rasgos, ([rr, g]) => ({ pp: pp(rr, g) }), b => b.pp);
    const enunciado = ['Un punto tiene coordenadas cartesianas (', v('x', num(x)), '; ', v('y', num(y)), ').'];
    const cuad = th < 90 ? 'I' : th < 180 ? 'II' : th < 270 ? 'III' : 'IV';
    const solucion = [
      ['r = √(x² + y²) = √', `${num(x * x + y * y)} = ${num(r)}`, '.'],
      [`Signos: x ${x > 0 ? '> 0' : '< 0'}, y ${y > 0 ? '> 0' : '< 0'}: el punto está en el ${cuad} cuadrante; el ángulo de referencia es ${angTxt(Math.min(th % 180, 180 - (th % 180)), modo)}.`],
      ['Medido desde el eje polar: ', v('q', `θ = ${angTxt(th, modo)}`), '; el punto es ', v('q', correcta.texto), '.']];
    return cerrar(rng, semilla, { correcta, pool, variables: VARS, enunciado, pregunta: [`¿Cuáles son sus coordenadas polares (r; θ), con r > 0 y 0 ≤ θ < ${modo === 'radianes' ? '2π' : '360°'}?`], solucion,
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
