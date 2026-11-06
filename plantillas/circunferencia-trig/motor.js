/*
 * Motor de «La circunferencia que se desenrolla»: seno, coseno y sus gráficas.
 *
 * Aquí vive toda la matemática de la plantilla (regla 1 de CLAUDE.md). No toca el DOM:
 * funciona igual en el navegador (window.MotorCircTrig) y en Node (require('./motor.js')),
 * donde lo prueban casos.json y papel.json.
 *
 * Ángulos en grados sexagesimales salvo que se diga 'rad'. Las razones de los ángulos notables salen
 * exactas, como número de la forma n·√r/d (campo texto: '√3/2', '−1/2', '4/3'). Convención de academia:
 * sen 37° = 3/5 y sen 16° = 7/25 (son aproximados: el ángulo de verdad es 36,87° y 16,26°).
 *
 *   razones({ opuesto, adyacente, hipotenusa })     con dos lados: las seis razones y el ángulo
 *   escalar(lados, k)                               el mismo triángulo con los lados por k: las razones no cambian
 *   notable(angulo)                                 30, 45, 60, 37, 53, 16 o 74: lados en k y razones exactas
 *   resolverRectangulo({ angulo, lado, cual })      un ángulo agudo y un lado → los otros dos (elevación)
 *   valor(fn, g), exacto(fn, g)                     sen, cos, tan, cot, sec, csc de cualquier ángulo
 *   normalizar(g), coterminal(g), cuadrante(g)
 *   punto(theta, unidad)                            el punto (cos θ, sen θ) de la circunferencia de radio 1, signos y líneas
 *   reducir(fn, g)                                  reducción al primer cuadrante (con 180°/360° y con 90°/270°)
 *   senoidal({ fn, A, B, C, D, unidad })            y = A·fn(Bx + C) + D: amplitud, periodo, desfase, rango
 *   evaluar(f, x), muestrear(f, x0, x1, n), extremos(f, x0, x1), ceros(f, x0, x1)
 *   ecuacion({ fn, k, desde, hasta, unidad })       fn x = k: todas las soluciones en [desde, hasta⟩ y la general
 *   ecuacionFactorizada(factores, desde, hasta)     producto de factores fn x − k = 0 (no se divide entre nada)
 *   suma(a, b, fn), doble(a, fn)                    sen(a + b) contra sen a + sen b; sen 2a contra 2 sen a
 *   pitagorica(g)                                   sen² + cos² = 1
 *   fraccion(x, maxDen), textoPi(coef), textoExacto(e), sumaExacta(a, b)
 *
 * Cada resultado que es la respuesta de una predicción trae un campo 'errores' con lo que dan los errores
 * típicos de docs/investigacion/trigonometria-ideas-erroneas.md (TR7 a TR22): son las opciones incorrectas.
 * Un error que en ese caso da lo mismo que la respuesta correcta (cos(−60°) sin signo) no aparece.
 */
(function (root, fabrica) {
  const motor = fabrica();
  if (typeof module === 'object' && module.exports) module.exports = motor;
  else root.MotorCircTrig = motor;
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  const PI = Math.PI, TOL = 1e-9, GR = PI / 180;
  const FNS = ['sen', 'cos', 'tan', 'cot', 'sec', 'csc'];

  function numero(x, que, o) {
    o = o || {};
    if (typeof x !== 'number' || !Number.isFinite(x)) throw new Error(`${que} debe ser un número`);
    if (o.positivo && !(x > 0)) throw new Error(`${que} debe ser mayor que cero`);
    return x;
  }
  function funcion(fn) {
    if (!FNS.includes(fn)) throw new Error(`función desconocida: ${fn} (usa ${FNS.join(', ')})`);
    return fn;
  }
  // Redondea el ruido de coma flotante cerca de un entero (30,000000000000004 → 30) y quita el −0.
  const limpio = x => (Math.abs(x - Math.round(x)) <= TOL * Math.max(1, Math.abs(x)) ? Math.round(x) + 0 : x + 0);
  const cero = x => (Math.abs(x) < 1e-12 ? 0 : x);

  // Un error típico que da lo mismo que la respuesta correcta no sirve como distractor: se quita.
  // correcto: el valor correcto, o una función nombre → valor correcto para ese error.
  function igual(a, b) {
    if (Array.isArray(a) || Array.isArray(b)) return Array.isArray(a) && Array.isArray(b) && a.length === b.length && a.every((x, j) => igual(x, b[j]));
    if (typeof a !== 'number' || typeof b !== 'number') return a === b;
    return Math.abs(a - b) <= 1e-9 * Math.max(1, Math.abs(b));
  }
  function depurar(errores, correcto, textos) {
    for (const k of Object.keys(errores)) {
      const c = typeof correcto === 'function' ? correcto(k) : correcto;
      if (c !== undefined && igual(errores[k], c)) { delete errores[k]; if (textos) delete textos[k]; }
    }
    return errores;
  }

  // ---------- Fracciones, π y números exactos ----------
  function fraccion(x, maxDen) {
    numero(x, 'el número'); maxDen = maxDen || 360;
    for (let q = 1; q <= maxDen; q++) {
      const p = Math.round(x * q);
      if (Math.abs(p / q - x) <= TOL * Math.max(1, Math.abs(x))) return { num: p + 0, den: q };
    }
    return null;
  }
  function textoPi(c) {
    const f = fraccion(c, 360);
    if (!f) return null;
    if (f.num === 0) return '0';
    const s = f.num < 0 ? '−' : '', n = Math.abs(f.num);
    const arriba = n === 1 ? 'π' : `${n}π`;
    return s + (f.den === 1 ? arriba : `${arriba}/${f.den}`);
  }
  function mcd(a, b) { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a; }
  // r = s²·t con t libre de cuadrados
  function sacarCuadrados(r) {
    let s = 1, t = r;
    for (let p = 2; p * p <= t; p++) while (t % (p * p) === 0) { t /= p * p; s *= p; }
    return { s, t };
  }
  // Número exacto n·√r/d (n, d, r enteros; r libre de cuadrados; d > 0).
  function exactoDe(n, d, r) {
    r = r === undefined ? 1 : r;
    if (d < 0) { n = -n; d = -d; }
    const q = sacarCuadrados(r); n *= q.s; r = q.t;
    if (n === 0) return { n: 0, d: 1, r: 1, valor: 0, texto: '0' };
    const g = mcd(n, d); n /= g; d /= g;
    const e = { n, d, r, valor: n * Math.sqrt(r) / d };
    e.texto = textoExacto(e);
    return e;
  }
  function textoExacto(e) {
    if (!e) return null;
    if (e.n === 0) return '0';
    const s = e.n < 0 ? '−' : '', a = Math.abs(e.n);
    const arriba = e.r === 1 ? String(a) : (a === 1 ? `√${e.r}` : `${a}√${e.r}`);
    return s + (e.d === 1 ? arriba : `${arriba}/${e.d}`);
  }
  // ka·√ma / (kb·√mb), racionalizado
  const cociente = (a, b) => exactoDe(a[0], b[0] * b[1], a[1] * b[1]);
  const opuestoDe = e => (e ? exactoDe(-e.n, e.d, e.r) : e);
  // Suma de dos exactos: se junta si tienen la misma raíz; si no, se escribe (a + b)/d.
  function sumaExacta(a, b) {
    if (a.r === b.r) return exactoDe(a.n * b.d + b.n * a.d, a.d * b.d, a.r);
    const L = a.d * b.d / mcd(a.d, b.d);
    const t = (n, r) => { const m = Math.abs(n); return r === 1 ? String(m) : (m === 1 ? `√${r}` : `${m}√${r}`); };
    const na = a.n * L / a.d, nb = b.n * L / b.d;
    const dentro = `${na < 0 ? '−' : ''}${t(na, a.r)} ${nb < 0 ? '−' : '+'} ${t(nb, b.r)}`;
    return { valor: a.valor + b.valor, texto: L === 1 ? dentro : `(${dentro})/${L}`, d: L };
  }

  // ---------- Razones en el triángulo rectángulo ----------
  function razonesDe(op, ady, hip) {
    return { sen: op / hip, cos: ady / hip, tan: op / ady, cot: ady / op, sec: hip / ady, csc: hip / op };
  }
  function textoRazon(x) { const f = fraccion(x, 1000); return f ? (f.den === 1 ? String(f.num) : `${f.num}/${f.den}`) : null; }
  function razones(o) {
    o = o || {};
    let op = o.opuesto, ady = o.adyacente, hip = o.hipotenusa;
    const dados = [op, ady, hip].filter(x => x !== undefined).length;
    if (dados !== 2) throw new Error('da exactamente dos lados: opuesto, adyacente o hipotenusa');
    if (op !== undefined) numero(op, 'el cateto opuesto', { positivo: true });
    if (ady !== undefined) numero(ady, 'el cateto adyacente', { positivo: true });
    if (hip !== undefined) numero(hip, 'la hipotenusa', { positivo: true });
    if (hip !== undefined && !((op !== undefined ? op : ady) < hip)) throw new Error('la hipotenusa debe ser mayor que cada cateto');
    if (hip === undefined) hip = Math.hypot(op, ady);
    else if (op === undefined) op = Math.sqrt(hip * hip - ady * ady);
    else ady = Math.sqrt(hip * hip - op * op);
    op = limpio(op); ady = limpio(ady); hip = limpio(hip);
    const r = razonesDe(op, ady, hip), ang = Math.atan2(op, ady) / GR;
    const textos = {}; for (const k of FNS) textos[k] = textoRazon(r[k]);
    return {
      opuesto: op, adyacente: ady, hipotenusa: hip, ...r, angulo: ang, complemento: 90 - ang, textos,
      pitagoras: op * op + ady * ady - hip * hip,
      errores: depurar({
        senoComoLongitud: op,       // TR7: el seno es el cateto opuesto
        senoInvertido: hip / op,    // hipotenusa entre opuesto (es la cosecante)
        senoConAdyacente: ady / hip, // TR9/TR11: cruza seno y coseno
        tanInvertida: ady / op,     // TR9: adyacente entre opuesto (es la cotangente)
      }, k => (k === 'tanInvertida' ? r.tan : r.sen)),
    };
  }
  // El mismo ángulo con los lados por k (TR7, TR8): los lados van por k y las razones no cambian.
  function escalar(o, k) {
    numero(k, 'k', { positivo: true });
    const a = razones(o);
    const d = razones({ opuesto: a.opuesto * k, adyacente: a.adyacente * k });
    return {
      antes: a, despues: d, k, senAntes: a.sen, senDespues: d.sen, cosDespues: d.cos, tanDespues: d.tan, anguloDespues: d.angulo,
      errores: depurar({
        senoPorK: a.sen * k,                  // TR8: el seno crece con el triángulo
        senoComoLongitud: a.opuesto * k,      // TR7: el seno es el cateto (ahora más largo)
        senoEntreK: a.sen / k,                // el seno "se reparte" (hipótesis)
      }, d.sen),
    };
  }

  // Triángulos notables: lados como coeficiente·√radicando (se multiplican por k).
  const NOTABLES = {
    30: { op: [1, 1], ady: [1, 3], hip: [2, 1] },
    45: { op: [1, 1], ady: [1, 1], hip: [1, 2] },
    60: { op: [1, 3], ady: [1, 1], hip: [2, 1] },
    37: { op: [3, 1], ady: [4, 1], hip: [5, 1], aproximado: true },
    53: { op: [4, 1], ady: [3, 1], hip: [5, 1], aproximado: true },
    16: { op: [7, 1], ady: [24, 1], hip: [25, 1], aproximado: true },
    74: { op: [24, 1], ady: [7, 1], hip: [25, 1], aproximado: true },
  };
  const ANGULOS_NOTABLES = Object.keys(NOTABLES).map(Number).sort((a, b) => a - b);
  const textoLado = ([c, m]) => `${c === 1 ? '' : c}k${m === 1 ? '' : `√${m}`}`;
  function notable(angulo) {
    numero(angulo, 'el ángulo');
    const N = NOTABLES[angulo];
    if (!N) throw new Error(`${angulo}° no es un ángulo notable (usa ${ANGULOS_NOTABLES.join(', ')})`);
    const { op, ady, hip } = N, ex = {
      sen: cociente(op, hip), cos: cociente(ady, hip), tan: cociente(op, ady),
      cot: cociente(ady, op), sec: cociente(hip, ady), csc: cociente(hip, op),
    };
    const largo = ([c, m]) => c * Math.sqrt(m);
    return {
      angulo, aproximado: !!N.aproximado, anguloReal: Math.atan2(largo(op), largo(ady)) / GR,
      lados: { opuesto: { coef: op[0], raiz: op[1], valor: largo(op), texto: textoLado(op) },
        adyacente: { coef: ady[0], raiz: ady[1], valor: largo(ady), texto: textoLado(ady) },
        hipotenusa: { coef: hip[0], raiz: hip[1], valor: largo(hip), texto: textoLado(hip) } },
      exactos: ex, sen: ex.sen.valor, cos: ex.cos.valor, tan: ex.tan.valor, cot: ex.cot.valor, sec: ex.sec.valor, csc: ex.csc.valor,
      textos: Object.fromEntries(FNS.map(k => [k, ex[k].texto])),
    };
  }
  // Razón de un ángulo agudo: la de academia si es notable, la verdadera si no.
  function razonAguda(fn, a) {
    if (NOTABLES[a]) return notable(a)[fn];
    return valor(fn, a);
  }
  // Un ángulo agudo y un lado (cual: 'opuesto', 'adyacente' o 'hipotenusa') → los tres lados.
  function resolverRectangulo(o) {
    o = o || {};
    const a = numero(o.angulo, 'el ángulo'), L = numero(o.lado, 'el lado', { positivo: true }), cual = o.cual;
    if (!(a > 0 && a < 90)) throw new Error('el ángulo debe ser agudo (entre 0° y 90°)');
    if (!['opuesto', 'adyacente', 'hipotenusa'].includes(cual)) throw new Error("cual: 'opuesto', 'adyacente' o 'hipotenusa'");
    const s = razonAguda('sen', a), c = razonAguda('cos', a), t = razonAguda('tan', a);
    let op, ady, hip;
    if (cual === 'opuesto') { op = L; ady = L / t; hip = L / s; }
    else if (cual === 'adyacente') { ady = L; op = L * t; hip = L / c; }
    else { hip = L; op = L * s; ady = L * c; }
    const err = cual === 'adyacente' ? { opuestoConSeno: L * s, opuestoConCoseno: L * c, opuestoConCotangente: L / t }
      : cual === 'hipotenusa' ? { opuestoConCoseno: L * c, opuestoConTangente: L * t }
      : { adyacenteConTangente: L * t, hipotenusaConSeno: L * s };
    return { angulo: a, convencion: NOTABLES[a] ? (NOTABLES[a].aproximado ? 'academia' : 'exacta') : 'decimal',
      opuesto: limpio(op), adyacente: limpio(ady), hipotenusa: limpio(hip),
      errores: depurar(err, k => (k.startsWith('opuesto') ? op : k.startsWith('adyacente') ? ady : hip)) };   // TR9: elige mal la razón
  }

  // ---------- Ángulos en posición normal ----------
  function normalizar(g) { numero(g, 'el ángulo'); const r = limpio(((g % 360) + 360) % 360); return r === 360 ? 0 : r; }
  function coterminal(g) {
    const r = normalizar(g), k = Math.round((g - r) / 360);
    return { grados: g, reducido: r, vueltas: k, negativo: g < 0, forma: `${g}° = 360°·(${k}) + ${r}°` };
  }
  // 1, 2, 3, 4 o null si el lado final cae en un eje (ángulo cuadrantal).
  function cuadrante(g) {
    const r = normalizar(g);
    if (r === 0 || r === 90 || r === 180 || r === 270) return null;
    return r < 90 ? 1 : r < 180 ? 2 : r < 270 ? 3 : 4;
  }
  const EJE = { 0: 'x+', 90: 'y+', 180: 'x−', 270: 'y−' };
  const SIGNOS = { sen: [1, 1, -1, -1], cos: [1, -1, -1, 1], tan: [1, -1, 1, -1] };
  SIGNOS.csc = SIGNOS.sen; SIGNOS.sec = SIGNOS.cos; SIGNOS.cot = SIGNOS.tan;
  const CO = { sen: 'cos', cos: 'sen', tan: 'cot', cot: 'tan', sec: 'csc', csc: 'sec' };
  // Valores en los ejes: [0°, 90°, 180°, 270°]; null = no definida
  const CUADRANTALES = {
    sen: [0, 1, 0, -1], cos: [1, 0, -1, 0], tan: [0, null, 0, null],
    cot: [null, 0, null, 0], sec: [1, null, -1, null], csc: [null, 1, null, -1],
  };
  // Ángulo de referencia (entre 0° y 90°) de un ángulo reducido que no está en un eje.
  function referencia(r) { return r < 90 ? r : r < 180 ? limpio(180 - r) : r < 270 ? limpio(r - 180) : limpio(360 - r); }
  function base(fn, a) {   // fn de un ángulo agudo, sin signo
    const x = a * GR;
    return { sen: Math.sin(x), cos: Math.cos(x), tan: Math.tan(x), cot: 1 / Math.tan(x), sec: 1 / Math.cos(x), csc: 1 / Math.sin(x) }[fn];
  }
  // fn de cualquier ángulo en grados: null si no está definida (tan 90°). Se calcula con el ángulo de referencia
  // y el signo del cuadrante, así sen 180° da 0 y no 1,2·10⁻¹⁶.
  function valor(fn, g) {
    funcion(fn); const r = normalizar(g), c = cuadrante(r);
    if (c === null) return CUADRANTALES[fn][r / 90];
    return SIGNOS[fn][c - 1] * base(fn, referencia(r));
  }
  // Exacto si el ángulo de referencia es 0°, 30°, 45°, 60°, 90° (o 37°, 53°, 16°, 74° de academia); si no, null.
  function exacto(fn, g) {
    funcion(fn); const r = normalizar(g), c = cuadrante(r);
    if (c === null) { const v = CUADRANTALES[fn][r / 90]; return v === null ? { definido: false, texto: 'no está definida' } : exactoDe(v, 1, 1); }
    const a = referencia(r);
    if (!NOTABLES[a]) return null;
    const e = notable(a).exactos[fn];
    return SIGNOS[fn][c - 1] < 0 ? opuestoDe(e) : e;
  }
  const textoValor = (fn, g) => { const e = exacto(fn, g); return e ? e.texto : null; };

  function aGrados(theta, unidad) {
    numero(theta, 'el ángulo');
    const u = unidad || 'sex';
    if (u === 'sex') return theta;
    if (u === 'rad') return theta / GR;
    if (u === 'pi') return theta * 180;
    throw new Error(`unidad desconocida: ${u} (usa sex, rad o pi)`);
  }
  // El punto de la circunferencia de radio 1, con sus líneas trigonométricas (segmentos con signo).
  function punto(theta, unidad) {
    const g = aGrados(theta, unidad), r = normalizar(g), c = cuadrante(r);
    const sen = cero(valor('sen', g)), cos = cero(valor('cos', g)), tan = valor('tan', g);
    const sg = x => (x === null ? null : x > 1e-12 ? 1 : x < -1e-12 ? -1 : 0);
    return {
      grados: g, rad: g * GR, reducido: r, vueltas: Math.round((g - r) / 360), cuadrante: c, eje: c === null ? EJE[r] : null,
      referencia: c === null ? null : referencia(r),
      x: cos, y: sen, sen, cos, tan: tan === null ? null : cero(tan), cot: valor('cot', g), sec: valor('sec', g), csc: valor('csc', g),
      signos: { sen: sg(sen), cos: sg(cos), tan: sg(tan) },
      textos: { sen: textoValor('sen', g), cos: textoValor('cos', g), tan: textoValor('tan', g) },
      lineas: {
        // seno: vertical, del eje x hasta P; coseno: horizontal, del centro hasta el pie de P en el eje x;
        // tangente: sobre la recta x = 1, desde (1, 0) hasta donde la corta la recta OP (no existe si OP es vertical).
        seno: { desde: { x: cos, y: 0 }, hasta: { x: cos, y: sen }, valor: sen },
        coseno: { desde: { x: 0, y: 0 }, hasta: { x: cos, y: 0 }, valor: cos },
        tangente: tan === null ? null : { desde: { x: 1, y: 0 }, hasta: { x: 1, y: cero(tan) }, valor: cero(tan) },
      },
      identidad: sen * sen + cos * cos,
    };
  }

  // ---------- Reducción al primer cuadrante ----------
  function reducir(fn, g) {
    funcion(fn); numero(g, 'el ángulo');
    const r = normalizar(g), c = cuadrante(r), k = Math.round((g - r) / 360);
    const v = valor(fn, g), e = exacto(fn, g);
    const fuera = { fn, grados: g, reducido: r, vueltas: k, negativo: g < 0, valor: v, exacto: e, texto: e ? e.texto : null };
    const errNeg = g < 0 ? { negativoSinSigno: valor(fn, -g) } : {};   // TR15: sen(−30°) = +sen 30°
    if (c === null) return Object.assign(fuera, { cuadrante: null, eje: EJE[r], referencia: null, signo: v === null ? null : Math.sign(v),
      forma180: null, forma90: null, errores: depurar({
        comoSeno: valor('sen', g),                                    // toma la razón igual al seno (tan 90° = 1)
        invertida: valor(CO[fn], g),                                  // usa la co-razón (tan 90° = cot 90° = 0)
        ...(r > 0 && NOTABLES[45] ? { proporcional: base(fn, 45) * r / 45 } : {}),   // TR10: crece igual que el ángulo
        ...errNeg }, v) });
    const a = referencia(r), s = SIGNOS[fn][c - 1], co = CO[fn];
    const f180 = c === 1 ? null : { base: c === 4 ? 360 : 180, op: c === 3 ? '+' : '−', angulo: a, fn, signo: s };
    // con 90° o 270° la razón cambia a su co-razón: sen(90° + x) = cos x
    const b = limpio(90 - a);
    const f90 = { base: c <= 2 ? 90 : 270, op: c === 1 || c === 3 ? '−' : '+', angulo: b, fn: co, signo: s };
    if (f180) f180.texto = `${fn}(${f180.base}° ${f180.op} ${a}°) = ${s < 0 ? '−' : ''}${fn} ${a}°`;
    f90.texto = `${fn}(${f90.base}° ${f90.op} ${b}°) = ${s < 0 ? '−' : ''}${co} ${b}°`;
    const ex = x => (NOTABLES[x] ? notable(x) : null);
    const otra = (fn === 'sen' || fn === 'cos') ? valor(co, g) : undefined;
    const errores = {
      sinSigno: Math.abs(v),                                  // TR12: el seno como distancia, sin signo
      cambiaRazon180: s * base(co, a),                         // TR14: cambia a la co-razón con 180° o 360°
      sinCambiarRazon90: s * base(fn, b),                      // TR14: no cambia a la co-razón con 90° o 270°
      ...(otra !== undefined ? { otraCoordenada: otra, otraCoordenadaSinSigno: Math.abs(otra) } : {}),   // TR11
      ...(c > 1 ? { proporcional: base(fn, a) * r / a } : {}),      // TR10: la razón crece igual que el ángulo (sen 150° = 5 sen 30°)
      ...errNeg,
    };
    const errTexto = {};
    for (const [nombre, val] of Object.entries(errores)) {
      // texto exacto de cada error, si sale de un ángulo notable
      const ref = nombre === 'cambiaRazon180' ? ex(a) && ex(a).exactos[co] : nombre === 'sinCambiarRazon90' ? ex(b) && ex(b).exactos[fn]
        : nombre.startsWith('otraCoordenada') ? exacto(co, g) : nombre === 'negativoSinSigno' ? exacto(fn, -g) : e;
      if (!ref || ref.definido === false) continue;
      const mag = Math.abs(ref.n), dEx = exactoDe(Math.sign(val) * mag || 0, ref.d, ref.r);
      errTexto[nombre] = Math.abs(dEx.valor - val) < 1e-9 ? dEx.texto : null;
    }
    depurar(errores, v, errTexto);
    return Object.assign(fuera, { cuadrante: c, eje: null, referencia: a, signo: s, forma180: f180, forma90: f90,
      resultado: `${s < 0 ? '−' : ''}${fn} ${a}°`, errores, erroresTexto: errTexto });
  }

  // ---------- Funciones y = A·fn(Bx + C) + D ----------
  // x y C en radianes (unidad 'rad', por defecto) o en grados (unidad 'sex'); B no tiene unidad.
  function senoidal(o) {
    o = o || {};
    const fn = o.fn || 'sen';
    if (!['sen', 'cos', 'tan'].includes(fn)) throw new Error("fn: 'sen', 'cos' o 'tan'");
    const A = o.A === undefined ? 1 : numero(o.A, 'A'), B = o.B === undefined ? 1 : numero(o.B, 'B');
    const C = o.C === undefined ? 0 : numero(o.C, 'C'), D = o.D === undefined ? 0 : numero(o.D, 'D');
    if (A === 0) throw new Error('A no puede ser cero: la gráfica sería una recta');
    if (B === 0) throw new Error('B no puede ser cero: la función no sería periódica');
    const unidad = o.unidad || 'rad';
    if (unidad !== 'rad' && unidad !== 'sex') throw new Error("unidad: 'rad' o 'sex'");
    const vuelta = unidad === 'rad' ? 2 * PI : 360, medio = vuelta / 2;
    const periodo = (fn === 'tan' ? medio : vuelta) / Math.abs(B);
    const amp = fn === 'tan' ? null : Math.abs(A);
    const r = {
      fn, A, B, C, D, unidad, amplitud: amp, periodo, periodoPi: unidad === 'rad' ? periodo / PI : null,
      frecuencia: 1 / periodo, desfase: limpio(-C / B * 1e9) / 1e9 + 0, reflejada: A < 0, lineaMedia: D,
      maximo: fn === 'tan' ? null : D + Math.abs(A), minimo: fn === 'tan' ? null : D - Math.abs(A),
      rango: fn === 'tan' ? null : [D - Math.abs(A), D + Math.abs(A)],
      errores: {
        periodoPorB: (fn === 'tan' ? medio : vuelta) * Math.abs(B),   // TR18: multiplica en vez de dividir
        periodoIgualB: Math.abs(B),                                    // TR18: el periodo es el número que acompaña a x
        periodoConAmplitud: vuelta * Math.abs(A),                      // mezcla amplitud y periodo (hipótesis)
        ...(fn === 'tan' ? { periodoDeSeno: vuelta / Math.abs(B) } : {}),   // usa 2π/B también en la tangente
        ...(fn !== 'tan' ? { amplitudConD: Math.abs(A) + D, amplitudConSigno: A } : {}),  // TR19 y la amplitud negativa
        desfaseSinDividir: -C + 0,                                     // olvida dividir entre B
      },
    };
    depurar(r.errores, k => (k.startsWith('periodo') ? periodo : k.startsWith('amplitud') ? amp : r.desfase));
    r.periodoTexto = unidad === 'rad' ? textoPi(r.periodoPi) : `${limpio(periodo)}°`;
    return r;
  }
  const ficha = f => (f && f.periodo !== undefined ? f : senoidal(f));
  function evaluar(f, x) {
    f = ficha(f); numero(x, 'x');
    const u = f.B * x + f.C, g = f.unidad === 'rad' ? u / GR : u;
    const v = valor(f.fn, g);
    return v === null ? null : f.A * v + f.D;
  }
  // Puntos para dibujar. En la tangente, null corta la curva en cada asíntota.
  function muestrear(f, x0, x1, n) {
    f = ficha(f); numero(x0, 'x0'); numero(x1, 'x1'); n = n || 200;
    if (!(x1 > x0)) throw new Error('x1 debe ser mayor que x0');
    const pts = [];
    for (let j = 0; j <= n; j++) {
      const x = x0 + (x1 - x0) * j / n, y = evaluar(f, x);
      pts.push({ x, y: y === null || (f.fn === 'tan' && Math.abs(y) > 1e6) ? null : y });
    }
    if (f.fn === 'tan') for (let j = 1; j < pts.length; j++) {
      // un salto de +∞ a −∞ entre dos muestras: se corta
      if (pts[j].y !== null && pts[j - 1].y !== null && Math.sign(pts[j].y) !== Math.sign(pts[j - 1].y) && Math.abs(pts[j].y - pts[j - 1].y) > 10 * Math.abs(f.A)) pts.splice(j, 0, { x: pts[j].x, y: null }), j++;
    }
    return pts;
  }
  // Valores de u (en la unidad de la función) en [0, vuelta) con fn(u) = k, y el periodo con el que se repiten.
  function basesU(fn, k, vuelta) {
    const m = vuelta / 360, out = [];
    if (fn === 'tan') { out.push(normalizar(Math.atan(k) / GR) * m); return { u: out, paso: vuelta / 2 }; }
    if (Math.abs(k) > 1 + 1e-12) return { u: [], paso: vuelta };
    const kk = Math.max(-1, Math.min(1, k));
    const a = (fn === 'sen' ? Math.asin(kk) : Math.acos(kk)) / GR;
    const cand = fn === 'sen' ? [a, 180 - a] : [a, 360 - a];
    for (const c of cand) { const n = normalizar(limpio(c)); if (!out.some(z => Math.abs(z - n * m) < 1e-9)) out.push(n * m); }
    return { u: out.sort((p, q) => p - q), paso: vuelta };
  }
  // x en [x0, x1] con B·x + C = u + paso·n
  function xsDe(f, us, paso, x0, x1) {
    const xs = [];
    for (const u of us) {
      const n0 = Math.ceil(((f.B > 0 ? f.B * x0 : f.B * x1) + f.C - u) / paso - 1e-9), n1 = Math.floor(((f.B > 0 ? f.B * x1 : f.B * x0) + f.C - u) / paso + 1e-9);
      for (let n = n0; n <= n1; n++) { const x = (u + paso * n - f.C) / f.B; if (x >= x0 - 1e-9 && x <= x1 + 1e-9) xs.push(cero(x)); }
    }
    return xs.sort((p, q) => p - q).filter((x, j, l) => j === 0 || Math.abs(x - l[j - 1]) > 1e-9);
  }
  function extremos(f, x0, x1) {
    f = ficha(f); numero(x0, 'x0'); numero(x1, 'x1');
    if (f.fn === 'tan') throw new Error('la tangente no tiene máximos ni mínimos');
    const vuelta = f.unidad === 'rad' ? 2 * PI : 360;
    const arriba = basesU(f.fn, 1, vuelta), abajo = basesU(f.fn, -1, vuelta);
    const xa = xsDe(f, arriba.u, arriba.paso, x0, x1), xb = xsDe(f, abajo.u, abajo.paso, x0, x1);
    return { maximos: f.A > 0 ? xa : xb, minimos: f.A > 0 ? xb : xa, valorMaximo: f.maximo, valorMinimo: f.minimo };
  }
  function ceros(f, x0, x1) {
    f = ficha(f); numero(x0, 'x0'); numero(x1, 'x1');
    const vuelta = f.unidad === 'rad' ? 2 * PI : 360, b = basesU(f.fn, -f.D / f.A, vuelta);
    return xsDe(f, b.u, b.paso, x0, x1);
  }
  function asintotas(f, x0, x1) {
    f = ficha(f);
    if (f.fn !== 'tan') return [];
    const vuelta = f.unidad === 'rad' ? 2 * PI : 360;
    return xsDe(f, [vuelta / 4], vuelta / 2, x0, x1);
  }

  // ---------- Ecuaciones ----------
  // fn x = k con x en [desde, hasta⟩ (grados por defecto). Da todas las soluciones, la solución general y los
  // errores típicos: quedarse con el valor de la calculadora (TR22) o poner una por cuadrante.
  function ecuacion(o) {
    o = o || {};
    const fn = o.fn || 'sen';
    if (!['sen', 'cos', 'tan'].includes(fn)) throw new Error("fn: 'sen', 'cos' o 'tan'");
    const k = numero(o.k, 'k'), unidad = o.unidad || 'sex';
    if (unidad !== 'rad' && unidad !== 'sex') throw new Error("unidad: 'rad' o 'sex'");
    const m = unidad === 'rad' ? GR : 1;
    const desde = o.desde === undefined ? 0 : numero(o.desde, 'desde'), hasta = o.hasta === undefined ? 360 * m : numero(o.hasta, 'hasta');
    if (!(hasta > desde)) throw new Error('el intervalo está vacío');
    const b = basesU(fn, k, 360);
    const f = { B: 1, C: 0 };
    const enG = xsDe(f, b.u, b.paso, desde / m, hasta / m).filter(x => x * m < hasta - 1e-9 && x * m >= desde - 1e-9).map(limpio);
    const sols = enG.map(x => x * m);
    const principal = fn === 'tan' ? limpio(Math.atan(k) / GR) : Math.abs(k) > 1 + 1e-12 ? null
      : limpio((fn === 'sen' ? Math.asin(Math.max(-1, Math.min(1, k))) : Math.acos(Math.max(-1, Math.min(1, k)))) / GR);
    const tg = x => `${limpio(x)}°`;
    const general = principal === null ? null
      : fn === 'sen' ? { forma: `x = 180°·n + (−1)ⁿ·${tg(principal)}`, valorPrincipal: principal, paso: 180 }
      : fn === 'cos' ? { forma: `x = 360°·n ± ${tg(principal)}`, valorPrincipal: principal, paso: 360 }
      : { forma: `x = 180°·n + ${tg(principal)}`, valorPrincipal: principal, paso: 180 };
    if (general && unidad === 'rad') general.formaRad = fn === 'sen' ? `x = π·n + (−1)ⁿ·${textoPi(principal / 180) || (principal * GR).toFixed(4)}`
      : fn === 'cos' ? `x = 2π·n ± ${textoPi(principal / 180) || (principal * GR).toFixed(4)}` : `x = π·n + ${textoPi(principal / 180) || (principal * GR).toFixed(4)}`;
    const errores = {};
    if (principal !== null) {
      const p = normalizar(principal);
      errores.soloPrincipal = [p * m].filter(x => x >= desde - 1e-9 && x < hasta - 1e-9);   // TR22
      if (fn !== 'tan') {
        const a = referencia(p) === null ? p : (cuadrante(p) === null ? p : referencia(p));
        errores.unaPorCuadrante = [a, 180 - a, 180 + a, 360 - a].map(limpio).map(normalizar)
          .filter((x, j, l) => l.indexOf(x) === j).sort((x, y) => x - y).map(x => x * m);   // ignora el signo de k
      }
      errores.cantidadSoloPrincipal = errores.soloPrincipal.length;
    } else {
      errores.cantidadComoUnMedio = 2;                                // la resuelve como si fuera sen x = 1/2 (hipótesis)
      if (fn === 'sen') errores.proporcional = 90 * k * m;              // TR10: sen 90° = 1, entonces sen 180° = 2
    }
    depurar(errores, n => (n.startsWith('cantidad') ? sols.length : sols));
    return {
      fn, k, unidad, desde, hasta, soluciones: sols, cantidad: sols.length, sinSolucion: sols.length === 0,
      grados: enG, enPi: enG.map(x => x / 180), textosPi: enG.map(x => textoPi(x / 180)), general, principal, errores,
    };
  }
  // Producto de factores (fn x − k) = 0: es la unión de las soluciones de cada factor. errores.dividiendo: lo que
  // queda si se divide entre el primer factor en vez de igualarlo a cero (TR21).
  function ecuacionFactorizada(factores, desde, hasta, unidad) {
    if (!Array.isArray(factores) || factores.length < 2) throw new Error('da al menos dos factores');
    const partes = factores.map(q => ecuacion({ fn: q.fn, k: q.k, desde, hasta, unidad }));
    const unir = l => l.flat().sort((a, b) => a - b).filter((x, j, s) => j === 0 || Math.abs(x - s[j - 1]) > 1e-9);
    const sols = unir(partes.map(p => p.soluciones));
    const resto = unir(partes.slice(1).map(p => p.soluciones));
    const u = partes[0].unidad;
    return { soluciones: sols, cantidad: sols.length, porFactor: partes.map(p => p.soluciones),
      enPi: u === 'rad' ? sols.map(x => x / PI) : sols.map(x => x / 180),
      errores: depurar({ dividiendo: resto, cantidadDividiendo: resto.length }, n => (n === 'dividiendo' ? sols : sols.length)) };
  }

  // ---------- Identidades ----------
  // sen(a + b) contra sen a + sen b (TR16). fn: 'sen' o 'cos'.
  function suma(a, b, fn) {
    numero(a, 'a'); numero(b, 'b'); fn = fn || 'sen';
    if (fn !== 'sen' && fn !== 'cos') throw new Error("fn: 'sen' o 'cos'");
    const deLaSuma = valor(fn, a + b), sumaDe = valor(fn, a) + valor(fn, b);
    const formula = fn === 'sen' ? valor('sen', a) * valor('cos', b) + valor('cos', a) * valor('sen', b)
      : valor('cos', a) * valor('cos', b) - valor('sen', a) * valor('sen', b);
    const ea = exacto(fn, a), eb = exacto(fn, b), es = exacto(fn, a + b);
    return {
      fn, a, b, deLaSuma: cero(deLaSuma), sumaDe: cero(sumaDe), formula: cero(formula), diferencia: sumaDe - deLaSuma,
      iguales: Math.abs(sumaDe - deLaSuma) < 1e-9,
      textoDeLaSuma: es ? es.texto : null, textoSumaDe: ea && eb ? sumaExacta(ea, eb).texto : null,
      formulaTexto: fn === 'sen' ? 'sen(a + b) = sen a·cos b + cos a·sen b' : 'cos(a + b) = cos a·cos b − sen a·sen b',
      errores: depurar({ lineal: cero(sumaDe) }, deLaSuma),     // TR16: sen(a + b) = sen a + sen b
    };
  }
  function doble(a, fn) {
    numero(a, 'a'); fn = fn || 'sen';
    if (fn !== 'sen' && fn !== 'cos') throw new Error("fn: 'sen' o 'cos'");
    const v = valor(fn, 2 * a), f = fn === 'sen' ? 2 * valor('sen', a) * valor('cos', a) : valor('cos', a) ** 2 - valor('sen', a) ** 2;
    return { fn, a, deDoble: cero(v), formula: cero(f), dobleDe: cero(2 * valor(fn, a)), iguales: Math.abs(v - 2 * valor(fn, a)) < 1e-9,
      errores: depurar({ lineal: cero(2 * valor(fn, a)) }, v) };   // TR16: sen 2x = 2 sen x
  }
  function pitagorica(g) {
    numero(g, 'el ángulo');
    const s = valor('sen', g), c = valor('cos', g);
    return { grados: g, sen: s, cos: c, sen2: s * s, cos2: c * c, suma: s * s + c * c,
      errores: depurar({ sinCuadrados: s + c, senoDelCuadrado: valor('sen', g * g) + valor('cos', g * g) }, 1) };   // TR17: sen²x leído como sen(x²)
  }

  return { PI, FNS, NOTABLES: ANGULOS_NOTABLES, fraccion, textoPi, textoExacto, exactoDe, sumaExacta,
    razones, escalar, notable, resolverRectangulo, valor, exacto, normalizar, coterminal, cuadrante, referencia: r => referencia(normalizar(r)),
    punto, reducir, senoidal, evaluar, muestrear, extremos, ceros, asintotas, ecuacion, ecuacionFactorizada, suma, doble, pitagorica, aGrados };
});
