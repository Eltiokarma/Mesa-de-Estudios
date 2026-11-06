/*
 * Motor de «El compás del caso ambiguo»: ley de senos y ley de cosenos.
 *
 * Aquí vive toda la matemática de la plantilla (regla 1 de CLAUDE.md). No toca el DOM:
 * funciona igual en el navegador (window.MotorCompas) y en Node (require('./motor.js')),
 * donde lo prueban casos.json y papel.json.
 *
 * Notación (la de las academias peruanas): el triángulo es ABC; el lado a es BC (opuesto al ángulo A),
 * b es CA y c es AB. Los ángulos van en grados sexagesimales; las longitudes, en las unidades del problema.
 * R es el radio de la circunferencia circunscrita y S el área.
 *
 * Ángulos de academia: 37° y 53° son los ángulos del triángulo 3-4-5 (sen 37° = 3/5, sen 53° = 4/5), es decir,
 * 36,87° y 53,13°. El motor los recibe y los devuelve con su valor real (G37 y G53), y notable() los reconoce
 * y los nombra "37°" y "53°". Los demás (30°, 45°, 60°, 90°, 120°, 135°, 150°…) son exactos.
 *
 *   sen(g), cos(g), tan(g)                 con valores exactos en los ángulos notables (sen 30° = 0,5 justo)
 *   notable(g)                             { nombre, sen: { valor, texto }, cos: { valor, texto } } o null
 *   raizTexto(x2)                          √ de un entero simplificada: 48 → '4√3', 49 → '7', 129 → '√129'
 *   triangulo(a, b, c)                     todo el triángulo desde sus lados: ángulos, área, R, r, alturas, tipo
 *   resolver({ a, b, c, A, B, C })         con tres datos (al menos un lado): LLL, LAL, ALA, AAL o LLA
 *   casoAmbiguo({ A, b, a })               LLA con el compás: altura h = b·sen A, cuántos triángulos (0, 1 o 2),
 *                                          dónde corta el brazo a la base y qué da cada error típico
 *   leyCosenos({ b, c, A })                a² = b² + c² − 2bc·cos A, con Pitágoras y el término que se resta o se suma
 *   anguloLLL({ a, b, c })                 el ángulo A opuesto al lado a, desde los tres lados
 *   leySenos({ a, A })                     a/sen A = 2R: el diámetro y el radio de la circunscrita
 *   inscrito({ a, A, t })                  la circunscrita dibujada: la cuerda a fija y el vértice A que recorre el arco
 *                                          (t de 0 a 1; arco: ángulos polares, en radianes, donde empieza y termina)
 *   areaLAL({ b, c, A })                   S = b·c·sen A / 2, con la altura h = b·sen A
 *   heron(a, b, c)                         S = √(p(p − a)(p − b)(p − c)), con p el semiperímetro
 *   leyTangentes(t), proyecciones(t)       (a − b)/(a + b) = tan((A − B)/2)/tan((A + B)/2); a = b·cos C + c·cos B
 *
 * Cada resultado que es la respuesta de una predicción trae un campo 'errores' con lo que dan los errores
 * típicos de docs/investigacion/trigonometria-ideas-erroneas.md (TR22 a TR25): olvidar la segunda solución,
 * dar siempre dos, tratarlo como rectángulo, el signo del término 2bc·cos A, olvidarlo,
 * sumar los lados, la calculadora en radianes. Son las opciones incorrectas de la escena. Si con unos datos
 * un error da justo la respuesta correcta (por ejemplo, Pitágoras con 90°), ese error va null.
 */
(function (root, fabrica) {
  const motor = fabrica();
  if (typeof module === 'object' && module.exports) module.exports = motor;
  else root.MotorCompas = motor;
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  const PI = Math.PI, TOL = 1e-9;
  const rad = g => g * PI / 180;
  const grados = r => r * 180 / PI;
  const G37 = grados(Math.atan2(3, 4));   // 36,869…°: sen = 3/5
  const G53 = grados(Math.atan2(4, 3));   // 53,130…°: sen = 4/5

  function numero(x, que, o) {
    o = o || {};
    if (typeof x !== 'number' || !Number.isFinite(x)) throw new Error(`${que} debe ser un número`);
    if (o.positivo && !(x > 0)) throw new Error(`${que} debe ser mayor que cero`);
    return x;
  }
  function angulo(x, que) {
    numero(x, que);
    if (!(x > 0 && x < 180)) throw new Error(`${que} debe estar entre 0° y 180°`);
    return x;
  }
  const igual = (x, y) => Math.abs(x - y) <= 1e-9 * Math.max(1, Math.abs(x), Math.abs(y));
  // Un error típico que, con estos datos, da justo la respuesta correcta no sirve de distractor: va null.
  const distinto = (x, correcto) => (Math.abs(x - correcto) <= 1e-9 * Math.max(1, Math.abs(correcto)) ? null : x);
  const limpiarA2 = (e, a2) => { for (const k of Object.keys(e)) if (Math.abs(e[k].a2 - a2) <= 1e-9 * Math.max(1, a2)) e[k] = null; return e; };
  // Redondea el ruido de coma flotante cerca de un entero (49,00000000001 → 49).
  const limpio = x => (Math.abs(x - Math.round(x)) <= 1e-9 * Math.max(1, Math.abs(x)) ? Math.round(x) + 0 : x);

  // ---------- Ángulos notables ----------
  const R2 = Math.SQRT2 / 2, R3 = Math.sqrt(3) / 2;
  // [grados, nombre, sen, texto del seno, cos, texto del coseno, de academia]
  const BASE = [
    [0, '0°', 0, '0', 1, '1'],
    [30, '30°', 0.5, '1/2', R3, '√3/2'],
    [G37, '37°', 0.6, '3/5', 0.8, '4/5', true],
    [45, '45°', R2, '√2/2', R2, '√2/2'],
    [G53, '53°', 0.8, '4/5', 0.6, '3/5', true],
    [60, '60°', R3, '√3/2', 0.5, '1/2'],
    [90, '90°', 1, '1', 0, '0'],
  ];
  const NOTABLES = [];
  for (const [g, n, s, st, c, ct, ac] of BASE) {
    NOTABLES.push({ grados: g, nombre: n, academia: !!ac, sen: { valor: s, texto: st }, cos: { valor: c, texto: ct } });
    if (g > 0 && g < 90) {
      const g2 = 180 - g, n2 = ac ? `${180 - Math.round(g)}°` : `${g2}°`;
      NOTABLES.push({ grados: g2, nombre: n2, academia: !!ac, sen: { valor: s, texto: st }, cos: { valor: -c, texto: '−' + ct } });
    }
  }
  NOTABLES.push({ grados: 180, nombre: '180°', academia: false, sen: { valor: 0, texto: '0' }, cos: { valor: -1, texto: '−1' } });
  function notable(g) {
    numero(g, 'el ángulo');
    const n = NOTABLES.find(k => Math.abs(k.grados - g) <= 1e-7);
    return n ? { grados: n.grados, nombre: n.nombre, academia: n.academia, sen: { ...n.sen }, cos: { ...n.cos } } : null;
  }
  const sen = g => { const n = notable(g); return n ? n.sen.valor : Math.sin(rad(g)); };
  const cos = g => { const n = notable(g); return n ? n.cos.valor : Math.cos(rad(g)); };
  const tan = g => { if (igual(g, 90)) throw new Error('tan 90° no existe'); return sen(g) / cos(g); };
  const asen = x => grados(Math.asin(Math.max(-1, Math.min(1, x))));
  const acos = x => grados(Math.acos(Math.max(-1, Math.min(1, x))));

  // √ de un entero, simplificada como en el examen: 48 → '4√3'. null si x2 no es un entero no negativo.
  function raizTexto(x2) {
    numero(x2, 'el número');
    const n = limpio(x2);
    if (!Number.isInteger(n) || n < 0) return null;
    let fuera = 1, dentro = n;
    for (let k = 2; k * k <= dentro; k++) while (dentro % (k * k) === 0) { dentro /= k * k; fuera *= k; }
    if (dentro === 1) return String(fuera);
    return (fuera === 1 ? '' : String(fuera)) + '√' + dentro;
  }

  // ---------- El triángulo completo ----------
  function completo(a, b, c, A, B, C) {
    const p = (a + b + c) / 2, S = b * c * sen(A) / 2;
    const max = Math.max(A, B, C);
    const tipo = igual(max, 90) ? 'rectángulo' : max > 90 ? 'obtusángulo' : 'acutángulo';
    const t = { a, b, c, A, B, C, perimetro: a + b + c, p, area: S, R: a / (2 * sen(A)), r: S / p,
      alturas: { a: 2 * S / a, b: 2 * S / b, c: 2 * S / c }, tipo };
    if (tipo !== 'acutángulo') t[tipo === 'rectángulo' ? 'verticeRecto' : 'verticeObtuso'] = A === max ? 'A' : B === max ? 'B' : 'C';
    return t;
  }
  function desigualdad(a, b, c) {
    if (!(a < b + c && b < a + c && c < a + b) || igual(a, b + c) || igual(b, a + c) || igual(c, a + b))
      throw new Error('con esos lados no se forma un triángulo: cada lado debe ser menor que la suma de los otros dos');
  }
  // Desde los tres lados (LLL): cada ángulo por la ley de cosenos.
  function triangulo(a, b, c) {
    numero(a, 'a', { positivo: true }); numero(b, 'b', { positivo: true }); numero(c, 'c', { positivo: true });
    desigualdad(a, b, c);
    const ang = (x, y, z) => { const k = (y * y + z * z - x * x) / (2 * y * z); const n = NOTABLES.find(q => Math.abs(q.cos.valor - k) <= 1e-12); return n ? n.grados : acos(k); };
    const A = ang(a, b, c), B = ang(b, c, a);
    return completo(a, b, c, A, B, 180 - A - B);
  }

  // ---------- LLA: el caso ambiguo ----------
  // Ángulo X, su lado opuesto x y otro lado y (adyacente a X). Devuelve las soluciones para el ángulo Y opuesto a y.
  function lla(X, x, y) {
    const h = y * sen(X), s = h / x;
    let n, situacion;
    // A recto u obtuso: a tiene que ser el lado mayor
    if (X >= 90 - 1e-12) { if (x > y && !igual(x, y)) { n = 1; situacion = 'obtuso-uno'; } else { n = 0; situacion = 'obtuso-no'; } }
    else if (igual(x, h)) { n = 1; situacion = 'tangente'; }
    else if (x < h) { n = 0; situacion = 'no-alcanza'; }
    else if (x < y && !igual(x, y)) { n = 2; situacion = 'dos'; }
    else { n = 1; situacion = 'uno'; }
    const sol = [];
    if (n > 0) {
      const Y1 = situacion === 'tangente' ? 90 : asen(s);
      const cand = situacion === 'tangente' ? [90] : [Y1, 180 - Y1];
      for (const Y of cand) if (X + Y < 180 - 1e-9) sol.push(Y);
      if (sol.length !== n) throw new Error('caso ambiguo: el conteo no cuadra');   // no debería pasar
    }
    return { h, s, n, situacion, Y: sol };
  }

  // El compás: A en el origen, la base (el lado c) sobre la parte positiva del eje x y C = b·(cos A, sen A).
  // El brazo de largo a, con centro en C, corta la recta de la base donde x = b·cos A ± √(a² − h²).
  function casoAmbiguo(o) {
    const A = angulo(o.A, 'el ángulo A'), b = numero(o.b, 'b', { positivo: true }), a = numero(o.a, 'a', { positivo: true });
    const r = lla(A, a, b), h = r.h;
    const C = { x: b * cos(A), y: h }, pie = { x: C.x, y: 0 };
    const cortes = [];
    const d2 = a * a - h * h;
    if (igual(a, h)) cortes.push(pie.x);
    else if (d2 > 0) { const d = Math.sqrt(d2); cortes.push(C.x + d, C.x - d); }
    const corte = x => {
      const valido = x > 1e-9;
      const k = { x, valido, direccion: grados(Math.atan2(-h, x - C.x)) };
      if (valido) {
        // ángulo en B entre BA (hacia A, a la izquierda) y BC: cos B = (x − Cx)/a
        k.B = igual(x, C.x) ? 90 : acos((x - C.x) / a);
        k.c = x;
      } else k.anguloEnA = 180 - A;   // detrás de A: el ángulo del triángulo en A sería el suplemento
      return k;
    };
    const cs = cortes.map(corte);
    const soluciones = r.Y.map(B => {
      const Cc = 180 - A - B, c = a * sen(Cc) / sen(A);
      return completo(a, b, c, A, B, Cc);
    });
    // Ningún error puede coincidir con la respuesta correcta: si coincide, va null.
    const agudo = r.s <= 1 ? (r.situacion === 'tangente' ? 90 : asen(r.s)) : null;
    const comoLaCorrecta = (n, Bs) => n === r.n && Bs.length === r.Y.length && Bs.every((x, j) => igual(x, r.Y[j]));
    const errores = {
      // TR23: solo el ángulo que da la calculadora (el agudo), aunque haya dos triángulos
      soloAgudo: agudo !== null && !comoLaCorrecta(1, [agudo]) ? { n: 1, B: agudo } : null,
      // dar siempre B y 180° − B, sin revisar que los ángulos sumen menos de 180°
      siempreDos: r.s < 1 && !igual(r.s, 1) && !comoLaCorrecta(2, [asen(r.s), 180 - asen(r.s)]) ? { n: 2, B: [asen(r.s), 180 - asen(r.s)] } : null,
      // TR25: tratarlo como rectángulo en B (a y c catetos, b hipotenusa); con a = h ese es justo el correcto
      rectanguloEnB: a < b && r.situacion !== 'tangente' ? { B: 90, c: Math.sqrt(b * b - a * a) } : null,
      // la calculadora en radianes: sen B = b·sen(A rad)/a
      senoEnRadianes: distinto(b * Math.sin(A) / a, r.s),
      // sen B = b·sen A / a pasa de 1 (a < h): no hay ángulo B
      senoMayorQueUno: r.s > 1 && !igual(r.s, 1),
    };
    return { A, b, a, h, senB: r.s, n: r.n, situacion: r.situacion, C, pie, cortes: cs, soluciones,
      B: soluciones.map(t => t.B), c: soluciones.map(t => t.c), errores };
  }

  // ---------- Ley de cosenos ----------
  function leyCosenos(o) {
    const b = numero(o.b, 'b', { positivo: true }), c = numero(o.c, 'c', { positivo: true }), A = angulo(o.A, 'el ángulo A');
    const k = cos(A), b2 = b * b, c2 = c * c, termino = 2 * b * c * k, a2 = limpio(b2 + c2 - termino), pit = b2 + c2;
    const conA2 = x => { const v = limpio(x); return { a2: v, a: v >= 0 ? Math.sqrt(v) : NaN }; };
    return { b, c, A, cosA: k, b2, c2, pitagoras: pit, termino: limpio(termino), rectangulo: limpio(Math.abs(termino)),
      signo: Math.abs(k) < 1e-12 ? 'nada' : k > 0 ? 'resta' : 'suma',
      proyeccion: limpio(b * k), a2, a: Math.sqrt(a2),
      puntos: { A: { x: 0, y: 0 }, B: { x: c, y: 0 }, C: { x: b * k, y: b * sen(A) }, H: { x: b * k, y: 0 } },
      errores: limpiarA2({
        signoCambiado: conA2(pit + termino),            // TR24: + en vez de −
        sinTermino: conA2(pit),                          // TR24: Pitágoras, sin el término
        cosenoSinSigno: conA2(pit - 2 * b * c * Math.abs(k)),   // cos 120° = 1/2: el término siempre resta
        sinElDos: conA2(pit - b * c * k),                // olvida el 2 de 2bc
        cosenoComoSeno: conA2(pit - 2 * b * c * sen(A)), // usa sen A (con 90°: cos 90° = 1)
        conRadianes: conA2(pit - 2 * b * c * Math.cos(A)),   // la calculadora en RAD lee A como radianes
        sumaLados: { a: b + c, a2: (b + c) * (b + c) },  // "a = b + c"
      }, a2) };
  }

  // El ángulo A desde los tres lados: cos A = (b² + c² − a²)/(2bc).
  function anguloLLL(o) {
    const a = numero(o.a, 'a', { positivo: true }), b = numero(o.b, 'b', { positivo: true }), c = numero(o.c, 'c', { positivo: true });
    desigualdad(a, b, c);
    const t = triangulo(a, b, c), k = limpio((b * b + c * c - a * a) / (2 * b * c) * 1e12) / 1e12;
    const dif = a * a - (b * b + c * c);
    return { a, b, c, A: t.A, cosA: k, cosTexto: fraccionTexto(k), triangulo: t,
      comparaPitagoras: Math.abs(dif) < 1e-9 ? 'igual' : dif > 0 ? 'mayor' : 'menor',
      errores: {
        signoCambiado: distinto(acos(-k), t.A),  // TR24: cos A = (a² − b² − c²)/(2bc), el suplemento
        rectangulo: distinto(90, t.A),           // TR25: lo toma por rectángulo
        enRadianes: distinto(Math.acos(Math.max(-1, Math.min(1, k))), t.A),   // la calculadora en RAD: el número en radianes
      } };
  }
  function fraccionTexto(x) {
    for (let q = 1; q <= 100; q++) {
      const p = Math.round(x * q);
      if (Math.abs(p / q - x) <= 1e-9) return q === 1 ? (p < 0 ? '−' : '') + Math.abs(p) : `${p < 0 ? '−' : ''}${Math.abs(p)}/${q}`;
    }
    return null;
  }

  // ---------- Ley de senos y la circunscrita ----------
  function leySenos(o) {
    const a = numero(o.a, 'a', { positivo: true }), A = angulo(o.A, 'el ángulo A');
    const razon = a / sen(A);
    return { a, A, senA: sen(A), razon, diametro: razon, R: razon / 2,
      errores: {
        diametroComoRadio: distinto(razon, razon / 2),   // a/sen A = R (falta el 2)
        multiplica: distinto(a * sen(A), razon / 2),      // a·sen A (con 45° da justo R)
        senoEnRadianes: distinto(a / Math.sin(A) / 2, razon / 2),
      } };
  }
  // La circunscrita: centro O = (0, 0), la cuerda BC (largo a) abajo y horizontal; el vértice A recorre el arco mayor
  // (t de 0 a 1, de un extremo al otro). El ángulo en A es siempre el mismo (ángulo inscrito): a/sen A = 2R.
  function inscrito(o) {
    const a = numero(o.a, 'a', { positivo: true }), A = angulo(o.A, 'el ángulo A');
    const t = o.t === undefined ? 0.5 : numero(o.t, 't');
    const R = a / (2 * sen(A)), y = -R * cos(A);          // la cuerda está a R·cos A bajo el centro (sobre él si A > 90°)
    const B = { x: -a / 2, y }, C = { x: a / 2, y };
    // ángulos polares de B y C; el vértice recorre el arco que no contiene a la cuerda (el que mide 360° − 2A)
    const aB = Math.atan2(B.y, B.x), aC = Math.atan2(C.y, C.x);
    let ini = aC, fin = aB; if (fin <= ini) fin += 2 * PI;
    const f = Math.min(0.98, Math.max(0.02, t)), phi = ini + (fin - ini) * f;
    const P = { x: R * Math.cos(phi), y: R * Math.sin(phi) };
    const u = { x: B.x - P.x, y: B.y - P.y }, v = { x: C.x - P.x, y: C.y - P.y };
    const enP = grados(Math.acos((u.x * v.x + u.y * v.y) / (Math.hypot(u.x, u.y) * Math.hypot(v.x, v.y))));
    return { a, A, R, O: { x: 0, y: 0 }, B, C, P, t: f, anguloEnP: enP, opuesto: { x: -B.x, y: -B.y }, arco: { desde: ini, hasta: fin } };
  }

  // ---------- Área ----------
  function areaLAL(o) {
    const b = numero(o.b, 'b', { positivo: true }), c = numero(o.c, 'c', { positivo: true }), A = angulo(o.A, 'el ángulo A');
    const S = limpio(b * c * sen(A) / 2 * 1e9) / 1e9, h = b * sen(A);
    return { b, c, A, S, h, pieFuera: A > 90 && !igual(A, 90), ladoA: leyCosenos({ b, c, A }).a,
      errores: {
        sinMitad: 2 * S,                                 // b·c·sen A
        conCoseno: distinto(b * c * Math.abs(cos(A)) / 2, S),   // usa el coseno (con 45° o 135° da justo S)
        senoNegativo: A > 90 ? -S : null,                 // "con ángulo obtuso el seno es negativo"
        conRadianes: distinto(b * c * Math.sin(A) / 2, S),
      } };
  }
  function heron(a, b, c) {
    numero(a, 'a', { positivo: true }); numero(b, 'b', { positivo: true }); numero(c, 'c', { positivo: true });
    desigualdad(a, b, c);
    const p = (a + b + c) / 2, prod = p * (p - a) * (p - b) * (p - c);
    return { p, factores: [p, p - a, p - b, p - c], producto: limpio(prod), S: Math.sqrt(prod) };
  }

  // ---------- Leyes de tangentes y de proyecciones ----------
  function leyTangentes(t) {
    return { izquierda: (t.a - t.b) / (t.a + t.b), derecha: Math.tan(rad((t.A - t.B) / 2)) / Math.tan(rad((t.A + t.B) / 2)) };
  }
  function proyecciones(t) {
    return { a: t.b * cos(t.C) + t.c * cos(t.B), b: t.a * cos(t.C) + t.c * cos(t.A), c: t.a * cos(t.B) + t.b * cos(t.A) };
  }

  // ---------- Resolver con tres datos ----------
  const OP = { a: 'A', b: 'B', c: 'C', A: 'a', B: 'b', C: 'c' };
  function resolver(d) {
    const lados = ['a', 'b', 'c'].filter(k => d[k] !== undefined), angs = ['A', 'B', 'C'].filter(k => d[k] !== undefined);
    if (lados.length + angs.length !== 3) throw new Error('hacen falta exactamente tres datos');
    if (!lados.length) throw new Error('con tres ángulos no hay un solo triángulo: hace falta al menos un lado');
    lados.forEach(k => numero(d[k], k, { positivo: true })); angs.forEach(k => angulo(d[k], `el ángulo ${k}`));
    const arma = (v) => completo(v.a, v.b, v.c, v.A, v.B, v.C);
    if (lados.length === 3) return { caso: 'LLL', n: 1, soluciones: [triangulo(d.a, d.b, d.c)] };
    if (lados.length === 1) {
      const suma = angs.reduce((s, k) => s + d[k], 0);
      if (suma >= 180 - 1e-9) throw new Error('los dos ángulos deben sumar menos de 180°');
      const v = { ...d }, falta = ['A', 'B', 'C'].find(k => d[k] === undefined); v[falta] = 180 - suma;
      const l = lados[0], k = v[l] / sen(v[OP[l]]);
      for (const x of ['a', 'b', 'c']) if (v[x] === undefined) v[x] = k * sen(v[OP[x]]);
      return { caso: falta === OP[l] ? 'ALA' : 'AAL', n: 1, soluciones: [arma(v)] };
    }
    // dos lados y un ángulo
    const X = angs[0];
    if (lados.includes(OP[X])) {
      // LLA: el ángulo es opuesto a uno de los lados dados
      const x = OP[X], y = lados.find(k => k !== x), Y = OP[y], Z = ['A', 'B', 'C'].find(k => k !== X && k !== Y), z = OP[Z];
      const r = lla(d[X], d[x], d[y]);
      const soluciones = r.Y.map(ang => { const v = { ...d }; v[Y] = ang; v[Z] = 180 - d[X] - ang; v[z] = d[x] * sen(v[Z]) / sen(d[X]); return arma(v); });
      return { caso: 'LLA', n: r.n, situacion: r.situacion, h: r.h, soluciones };
    }
    // LAL: el ángulo está entre los dos lados
    const [y, z] = lados, x = OP[X];
    const l = leyCosenos({ b: d[y], c: d[z], A: d[X] }), v = { ...d }; v[x] = l.a;
    const t = triangulo(v.a, v.b, v.c);
    t[X] = d[X];   // el dato, sin ruido
    return { caso: 'LAL', n: 1, soluciones: [t] };
  }

  return { rad, grados, G37, G53, sen, cos, tan, asen, acos, notable, raizTexto, fraccionTexto,
    triangulo, resolver, casoAmbiguo, leyCosenos, anguloLLL, leySenos, inscrito, areaLAL, heron, leyTangentes, proyecciones };
});
