/*
 * Generador «Razones trigonométricas de ángulos agudos»: la práctica de las cinco ideas de
 * trigonometria.razones-trigonometricas-agudas (contenido/teoria/trigonometria/razones-trigonometricas-agudas.js).
 * Formato "predicciones" (docs/arquitectura.md). Funciona en el navegador (window.Generadores['razones-trig-agudas'])
 * y en Node (require). Las cuentas son exactas: fracciones de enteros y números a + b√2 + c√3 + d√6 (Ex, abajo).
 *
 * Tipos por idea (nivel 1: un paso; 2: dos pasos; 3: de examen):
 *   lados-desde-angulo   vertices (1): CO y CA de un ángulo en un triángulo PQR recto en Q · lado-objeto (2): un
 *                        cateto nombrado desde θ o desde α, con la hipotenusa y un cateto dados · suma-nombres (3): la
 *                        suma de dos nombres (el opuesto a θ y el adyacente a α pueden ser el mismo lado)
 *   razon-cociente       razon-lados (1 o 2): sen, cos o tan de un objeto con dos o tres lados dados · semejante (2): la
 *                        razón en un triángulo k veces mayor · otra-razon (3): dada una razón, otra (Pitágoras como dato)
 *                        · razon-figura (3): el triángulo escondido en un rectángulo con su diagonal o en un cuadrado
 *                        con el punto medio de un lado
 *   notables             valor-notable (1): sen, cos o tan exacto de 30°, 45° o 60° · reconoce-angulo (2): el ángulo
 *                        notable de un objeto por dos de sus lados · expresion-notable (3): una expresión con notables
 *                        (o con múltiplos de θ)
 *   aproximados          razon-convencion (1): una razón de 53° o 74° (o tan 37°, tan 16°) con la convención · lado-k
 *                        (2): un lado o el perímetro de un objeto con 3k-4k-5k o 7k-24k-25k · figura-k (3): trapecio,
 *                        cartulina cortada, escalera que resbala o sombra que se acorta
 *   complementarias      cofuncion-x (2): sen(ax + b) = cos(cx + d) y sus pares tan–cot y sec–csc · reciproca-x (2):
 *                        tan(ax + b) · cot(cx + d) = 1 y sus pares · reciproca-notable (2): expresión con cot, sec y csc
 *                        de notables · complemento (3): dada sen θ (o cos θ, tan θ), una razón de 90° − θ
 * Lo que la teoría dejó fuera no entra: despejar un lado con H · cos θ, elevación y depresión, radianes, 8° y 82°.
 *
 * Notación de la teoría: CO, CA y H; sen, cos, tan, cot, sec, csc; θ y α siempre en carmín. Respuestas racionalizadas
 * (√3/3, no 1/√3). Datos (docs/plan-calidad.md §3, punto 13; docs/molde-unidad.md §4): una línea por dato, con las
 * definiciones, la fórmula de cada tipo y la convención del examen («sen 37° = 3/5 y cos 37° = 4/5 (convención del
 * examen)»), nunca la razón que se pide ni el atajo («frente a 53° van 4 partes»). Si el tipo practica elegir (cofunción
 * o recíproca), van las dos fórmulas.
 * Colores por papel (molde §5b): el primer dato, naranja (o); el segundo, turquesa (i); lo que se pide, violeta (f); θ
 * y α, carmín (h). Un tercer dato va en tinta (el verde no va junto al naranja). La figura (pieza trig-objeto, la de la
 * teoría) se pinta igual: lo que se pide va con «?» o en tinta, y nunca se colorea según el papel en la razón (el
 * numerador y el denominador pintados delatarían qué lados se dividen).
 *
 * Errores (respaldo en docs/investigacion/trigonometria-ideas-erroneas.md): TR7 el seno es una longitud (documentado,
 * con reserva; en su variante «el opuesto es el lado vertical», parcial), TR8 la razón depende del tamaño, TR9 elige
 * mal la razón o confunde opuesto y adyacente, TR10 la razón crece como el ángulo (parciales). Los demás son hipótesis
 * de aula, los mismos códigos de la teoría donde coinciden: LAD-HIPOTENUSA, LAD-TOCA-H, LAD-NO-CAMBIA, PIT-LINEAL,
 * REC-INVERSA, TAN-H, RAZ-CHICO, FRAC-SUMA, SUMA-INCOMPLETA, ANG-OTRO, MEDIO-ENTERO, NOT-MISMO, NOT-CAMBIA,
 * NOT-ADIVINA, K-SIN-DIVIDIR, COMP-IGUALA, COMP-180, COMP-MISMO-ANG, REC-COMPLEMENTO, REC-NO-INVIERTE; y nuevos:
 * LAD-SIN-RECTO (toma como catetos los dos lados que tocan el ángulo), COMP-SIN-FIJOS (suma a 90° sin los grados
 * fijos), REC-SIN-FIJOS (iguala los ángulos sin los grados fijos), REC-PAREJA (sec como 1/sen y csc como 1/cos),
 * COMP-DATO (da la razón del dato) y APROX-UNA-SOLA (da uno de los dos lados en vez de su diferencia).
 * Cuentas comprobadas con un script aparte (casos.json, «verificacion») y con el recálculo de generador.test.js.
 */
(function (root, fabrica) {
  const nodo = typeof module === 'object' && module.exports;
  const api = fabrica(nodo ? require('../../nucleo/azar.js') : root.Azar,
                      nodo ? require('../../nucleo/predicciones.js') : root.Predicciones);
  if (nodo) module.exports = api;
  else (root.Generadores = root.Generadores || {})[api.id] = api;
})(typeof self !== 'undefined' ? self : this, function (Azar, P) {
  'use strict';
  const ID = 'razones-trig-agudas';
  const TRF = 'docs/investigacion/trigonometria-ideas-erroneas.md';
  const v = P.v;
  const f = (x, d = 2) => P.formatear(x, d);
  const gcd = (a, b) => (b ? gcd(b, a % b) : Math.abs(a));
  const cap = t => t.charAt(0).toUpperCase() + t.slice(1);
  // Un error: el texto es su clave (todos los textos se arman en forma canónica: fracción reducida, raíz racionalizada).
  const er = (id, texto, explicacion, respaldo = 'hipotesis') => ({ id, clave: texto, texto, explicacion, respaldo, fuente: respaldo === 'hipotesis' ? null : TRF });
  const TH = v('t', 'θ'), AL = v('al', 'α');
  const ANG = { t: { nombre: 'el ángulo θ', color: 'h' }, al: { nombre: 'el ángulo α', color: 'h' } };

  // ---------- Números ----------
  // Fracción reducida de dos largos (también con decimales: 1,5/2,5 = 3/5).
  const simpl = (p, q) => { const a = Math.round(p * 1000), b = Math.round(q * 1000), m = gcd(a, b); return [a / m, b / m]; };
  const fr = (p, q) => { const [a, b] = simpl(p, q); return b === 1 ? `${a}` : `${a}/${b}`; };
  const L = (x, u) => `${f(x)} ${u}`;
  // «12/13» si el cociente ya está simplificado; si no, «4,5/6 = 3/4» (sin repetir el mismo texto).
  const cocienteTxt = (p, q) => { const a = `${f(p)}/${f(q)}`, b = fr(p, q); return a === b ? '' : `${a} = `; };
  const xCoef = n => (n === 1 ? 'x' : `${n}x`);
  const grados = x => `${f(x)}°`;

  // Exactos de la forma a + b√2 + c√3 + d√6 con a, b, c, d racionales: { 1: [p, q], 2: [p, q], … }.
  const Qn = (p, q = 1) => { const g = gcd(p, q) || 1, s = q < 0 ? -1 : 1; return [s * p / g, s * q / g]; };
  const qSum = (x, y) => Qn(x[0] * y[1] + y[0] * x[1], x[1] * y[1]), qMul = (x, y) => Qn(x[0] * y[0], x[1] * y[1]);
  const RADMUL = { '1,1': [1, 1], '1,2': [1, 2], '1,3': [1, 3], '1,6': [1, 6], '2,2': [2, 1], '2,3': [1, 6], '2,6': [2, 3], '3,3': [3, 1], '3,6': [3, 2], '6,6': [6, 1] };
  const Ex = {
    de: (p, q = 1, k = 1) => ({ [k]: Qn(p, q) }),
    limpio: r => { for (const k of Object.keys(r)) if (r[k][0] === 0) delete r[k]; return Object.keys(r).length ? r : { 1: [0, 1] }; },
    suma: (...xs) => { const r = {}; for (const x of xs) for (const [k, q] of Object.entries(x)) r[k] = r[k] ? qSum(r[k], q) : q; return Ex.limpio(r); },
    por: (...xs) => xs.reduce((a, b) => {
      const r = {};
      for (const [k1, v1] of Object.entries(a)) for (const [k2, v2] of Object.entries(b)) {
        const [c, d] = RADMUL[[+k1, +k2].sort((x, y) => x - y).join(',')], q = qMul(qMul(v1, v2), [c, 1]);
        r[d] = r[d] ? qSum(r[d], q) : q;
      }
      return Ex.limpio(r);
    }, { 1: [1, 1] }),
    // Inverso de un número de un solo término c·√k: 1/(c√k) = √k/(c·k). Así sale racionalizado.
    inv: x => { const [k, [p, q]] = Object.entries(x)[0]; return { [k]: Qn(q, p * +k) }; },
    num: x => Object.entries(x).reduce((t, [k, [p, q]]) => t + p / q * Math.sqrt(+k), 0),
    // Texto: «√3/2», «2√3/3», «(1 + √3)/2», «3/2», «1», «−1/2».
    txt: x => {
      const ts = Object.entries(x).sort((a, b) => a[0] - b[0]);
      const D = ts.reduce((d, [, [, q]]) => d * q / gcd(d, q), 1);
      const ns = ts.map(([k, [p, q]]) => [+k, p * D / q]);
      const parte = ([k, nn], i) => { const a = Math.abs(nn), sg = nn < 0 ? '−' : ''; const t = k === 1 ? `${a}` : `${a === 1 ? '' : a}√${k}`; return i === 0 ? `${sg}${t}` : ` ${nn < 0 ? '−' : '+'} ${t}`; };
      const cuerpo = ns.map(parte).join('');
      if (D === 1) return cuerpo;
      return ns.length > 1 ? `(${cuerpo})/${D}` : `${cuerpo}/${D}`;
    },
  };
  // Las seis razones de 30°, 45° y 60°, exactas y racionalizadas.
  const NOT = {
    sen: { 30: Ex.de(1, 2), 45: Ex.de(1, 2, 2), 60: Ex.de(1, 2, 3) },
    cos: { 30: Ex.de(1, 2, 3), 45: Ex.de(1, 2, 2), 60: Ex.de(1, 2) },
    tan: { 30: Ex.de(1, 3, 3), 45: Ex.de(1), 60: Ex.de(1, 1, 3) },
  };
  for (const [r, de] of [['csc', 'sen'], ['sec', 'cos'], ['cot', 'tan']]) NOT[r] = { 30: Ex.inv(NOT[de][30]), 45: Ex.inv(NOT[de][45]), 60: Ex.inv(NOT[de][60]) };
  const otro = g => ({ 30: 60, 45: 45, 60: 30 }[g]);
  // Tablas con un error: el cateto del otro agudo (NOT-MISMO), el largo de un lado en vez del cociente (TR7, lados 1, √3,
  // 2 y 1, 1, √2), el cociente al revés (REC-INVERSA), sec, csc y cot sin dar vuelta (REC-NO-INVIERTE) y con la pareja
  // cambiada (REC-PAREJA: sec = 1/sen, csc = 1/cos).
  const MAL = {
    cambia: Object.fromEntries(Object.keys(NOT).map(r => [r, { 30: NOT[r][60], 45: NOT[r][45], 60: NOT[r][30] }])),
    largo: Object.assign({}, NOT, { sen: { 30: Ex.de(1), 45: Ex.de(1), 60: Ex.de(1, 1, 3) }, cos: { 30: Ex.de(1, 1, 3), 45: Ex.de(1), 60: Ex.de(1) } }),
    inversa: Object.assign({}, NOT, { sen: NOT.csc, cos: NOT.sec, tan: NOT.cot }),
    noInvierte: Object.assign({}, NOT, { csc: NOT.sen, sec: NOT.cos, cot: NOT.tan }),
    pareja: Object.assign({}, NOT, { csc: NOT.sec, sec: NOT.csc }),
  };
  // Expresión: lista de términos [coef, factor, …], factor = [razón, ángulo, potencia?, múltiplo de θ?].
  const potEx = (x, n = 1) => (n === 2 ? Ex.por(x, x) : x);
  const ev = (expr, T = NOT, lineal = null) => Ex.suma(...expr.map(([c, ...fs]) => Ex.por(Ex.de(c), ...fs.map(([rz, g, n, m]) => {
    // TR10: rz(m·θ) tomado como m · rz(θ).
    if (lineal && m) return potEx(Ex.por(Ex.de(m), NOT[rz][lineal]), n);
    return potEx(T[rz][g], n);
  }))));
  const factorTxt = ([rz, g, n, m]) => `${rz}${n === 2 ? '²' : ''} ${m ? `${m === 1 ? '' : m}θ` : `${g}°`}`;
  const exprTxt = expr => expr.map(([c, ...fs], i) => `${i === 0 ? (c < 0 ? '−' : '') : c < 0 ? ' − ' : ' + '}${Math.abs(c) === 1 ? '' : `${Math.abs(c)} `}${fs.map(factorTxt).join(' · ')}`).join('');
  // La misma expresión con los ángulos ya calculados (para la solución): «sen 60° · tan 30°».
  const exprGrados = expr => exprTxt(expr.map(([c, ...fs]) => [c, ...fs.map(([rz, g, n]) => [rz, g, n])]));

  // ---------- Datos (una línea cada uno; docs/molde-unidad.md §4) ----------
  const D = {
    cat: 'Catetos: los dos lados que forman el ángulo recto, de 90°.',
    h: 'Hipotenusa: el lado que queda frente al ángulo recto. Es el lado más largo.',
    co: 'Cateto opuesto a un ángulo agudo: el cateto que queda frente a ese ángulo, sin tocarlo.',
    ca: 'Cateto adyacente a un ángulo agudo: el cateto que forma ese ángulo junto con la hipotenusa.',
    pita: 'Pitágoras: hipotenusa² = cateto² + cateto²',
    seg: (p, q) => `Un lado se nombra con sus dos vértices: ${p}${q} es el lado que une ${p} con ${q}.`,
    recto: x => `Recto en ${x}: el ángulo de 90° está en el vértice ${x}.`,
    razones: l => `sen ${l} = CO/H; cos ${l} = CA/H; tan ${l} = CO/CA`,
    letras: l => `CO: cateto opuesto a ${l}; CA: cateto adyacente a ${l}; H: hipotenusa.`,
    semej: 'Triángulos semejantes: tienen los mismos ángulos y sus lados son proporcionales.',
    rect: 'Rectángulo: sus cuatro ángulos miden 90° y sus lados opuestos miden igual.',
    cuad: 'Cuadrado: sus cuatro lados miden igual y sus cuatro ángulos, 90°.',
    medio: 'Punto medio de un lado: lo parte en dos mitades iguales.',
    t30: 'Media señal (30° y 60°): hipotenusa 2; frente a 30°, 1; frente a 60°, √3.',
    t45: 'Media loseta (45° y 45°): catetos 1 y 1; hipotenusa √2.',
    racio: 'Racionalizar: 1/√2 = √2/2; 1/√3 = √3/3',
    pot: 'Potencia de una razón: sen² θ = (sen θ)²',
    c37: 'sen 37° = 3/5 y cos 37° = 4/5 (convención del examen)',
    c16: 'sen 16° = 7/25 y cos 16° = 24/25 (convención del examen)',
    par37: '37° + 53° = 90°: son los dos agudos del mismo triángulo.',
    par16: '16° + 74° = 90°: son los dos agudos del mismo triángulo.',
    k: 'k: cuánto vale cada parte. Lado = partes · k.',
    perim: 'Perímetro: la suma de los lados.',
    trap: 'AHCD es un rectángulo: CH mide igual que AD, y AH igual que DC.',
    rec: 'cot θ = CA/CO; sec θ = H/CA; csc θ = H/CO',
    cof: 'Cofunciones: sen θ = cos(90° − θ); tan θ = cot(90° − θ); sec θ = csc(90° − θ)',
    uno: 'Recíprocas: sen θ · csc θ = 1; cos θ · sec θ = 1; tan θ · cot θ = 1',
    agudos: 'Los ángulos de las razones son agudos: entre 0° y 90°.',
  };

  // ---------- Objetos (los de la teoría; pieza trig-objeto) ----------
  // ra y rb son los catetos; h, la hipotenusa. El ángulo a toca a ra; el b, a rb. vertical: el cateto vertical (TR7).
  const OBJS = [
    { objeto: 'escalera', u: 'm', ra: 'el piso', rb: 'la pared', h: 'la escalera', vertical: 'rb', a: 'entre la escalera y el piso', b: 'entre la escalera y la pared',
      intro: 'Una escalera está apoyada en una pared.', en: 'En una escalera', otra: 'Otra escalera', laOtra: 'la otra', ternas: [[1.5, 2, 2.5], [1.8, 2.4, 3], [0.7, 2.4, 2.5], [1.2, 3.5, 3.7], [1, 2.4, 2.6], [1.6, 3, 3.4]] },
    { objeto: 'rampa', u: 'm', ra: 'la base', rb: 'la altura', h: 'la rampa', vertical: 'rb', a: 'entre la rampa y el piso', b: 'entre la rampa y el borde',
      intro: 'Una rampa sube a una vereda.', en: 'En una rampa', otra: 'Otra rampa', laOtra: 'la otra', ternas: [[1.2, 0.5, 1.3], [2.4, 0.7, 2.5], [1.5, 0.8, 1.7]] },
    { objeto: 'poste', u: 'm', ra: 'el suelo', rb: 'el poste', h: 'el cable', vertical: 'rb', a: 'entre el cable y el suelo', b: 'entre el cable y el poste',
      intro: 'Un cable sostiene un poste.', en: 'Con un cable', otra: 'Otro poste', laOtra: 'el otro', ternas: [[6, 8, 10], [4.5, 6, 7.5], [5, 12, 13]] },
    { objeto: 'poste', sombra: true, u: 'm', ra: 'la sombra', rb: 'el poste', h: 'el rayo', vertical: 'rb', a: 'entre el rayo y el suelo', b: 'entre el rayo y el poste',
      intro: 'Un poste da sombra al sol.', ternas: [[8, 6, 10], [6, 4.5, 7.5], [12, 5, 13]] },
    { objeto: 'repisa', u: 'cm', ra: 'la pared', rb: 'el brazo', h: 'el tirante', vertical: 'ra', a: 'entre el tirante y la pared', b: 'entre el tirante y el brazo',
      intro: 'Una repisa tiene un brazo y un tirante.', ternas: [[40, 30, 50], [20, 15, 25], [24, 18, 30], [36, 15, 39]] },
  ];
  // Desde el vértice a, el adyacente es ra y el opuesto rb; desde b, al revés.
  const desde = x => (x === 'a' ? { ca: 'ra', co: 'rb' } : { ca: 'rb', co: 'ra' });
  const otroCat = k => (k === 'ra' ? 'rb' : 'ra');
  const PIEZA = 'trig-objeto';
  const escena = datos => ({ escena: { pieza: PIEZA, datos } });
  const figO = (o, ra, rb, lados, angulos) => escena({ objeto: o.objeto, sombra: o.sombra, medidas: { ra, rb }, lados, angulos });
  const angFig = (en, letra) => ({ [en]: { texto: letra } });

  // =============================== Idea 1: los lados se nombran desde θ ===============================
  const LETRAS = [['P', 'Q', 'R'], ['M', 'N', 'T'], ['D', 'E', 'F'], ['K', 'L', 'S']];
  const segN = (x, y) => [x, y].sort().join('');
  function vertices(rng) {
    const ls = rng.elegir(LETRAS), orden = rng.elegir([[0, 1, 2], [1, 0, 2], [2, 0, 1], [1, 2, 0]]);
    const V = { r: ls[orden[0]], a: ls[orden[1]], b: ls[orden[2]] };
    const [ra, rb] = rng.elegir([[3, 4], [5, 12], [8, 15], [4, 3], [12, 5]]);
    const giro = rng.elegir([20, 75, 140, 200, 250, 315]), en = rng.elegir(['a', 'b']);
    const X = V[en], otroV = V[en === 'a' ? 'b' : 'a'];
    const co = segN(V.r, otroV), ca = segN(V.r, X), h = segN(V.a, V.b);
    const par = (p, q) => `CO = ${p}; CA = ${q}`;
    const x = v('x', 'el cateto opuesto y el adyacente');
    return {
      variables: Object.assign({ x: { nombre: 'los catetos que se piden', color: 'f' } }, { t: { nombre: `el ángulo ${X}`, color: 'h' } }),
      enunciado: [`En el triángulo ${ls.join('')}, el ángulo recto está en ${V.r}.`],
      pregunta: ['¿Cuáles son ', x, ' al ángulo ', v('t', X), '?'],
      datos: [D.seg(...[V.r, V.a].sort()), D.recto(V.r), D.h, D.co, D.ca],
      correcta: { clave: par(co, ca), texto: par(co, ca) },
      errores: [
        er('TR9', par(ca, co), `Bien: ${co} y ${ca} son los catetos. Pero ${ca} pasa por ${X}: lo toca. El opuesto queda enfrente.`, 'parcial'),
        er('LAD-TOCA-H', par(co, h), `Bien el opuesto. ${h} también pasa por ${X}, pero no por ${V.r}: es la hipotenusa.`),
        er('LAD-HIPOTENUSA', par(h, ca), `Bien el adyacente. Pero ${h} pasa por ${X}: no queda enfrente. Es la hipotenusa.`),
        er('LAD-SIN-RECTO', par(ca, h), `Bien: ${ca} y ${h} tocan a ${X}. Pero los catetos pasan por el recto, ${V.r}.`),
      ],
      solucion: [
        [`Los catetos pasan por el recto, ${V.r}: ${segN(V.r, V.a)} y ${segN(V.r, V.b)}. ${h} es la hipotenusa.`],
        [`${ca} pasa por ${X}: es el adyacente. ${co} no lo toca: es el opuesto.`],
        ['Respuesta: ', v('x', par(co, ca)), '.'],
      ],
      extra: escena({ objeto: 'triangulo', medidas: { ra, rb }, giro, vertices: V, angulos: { [en]: {} } }),
      _datos: { tipo: 'vertices', idea: 'lados-desde-angulo', nivel: 1, r: V.r, a: V.a, b: V.b, angulo: X, pide: `CO y CA de ${X}` },
    };
  }

  // Un objeto con θ en un agudo y α en el otro; la hipotenusa y un cateto dados.
  function planteoObjeto(rng) {
    const o = rng.elegir(OBJS), [ra, rb, h] = rng.elegir(o.ternas), val = { ra, rb, h };
    const thEn = rng.elegir(['a', 'b']), alEn = thEn === 'a' ? 'b' : 'a', dado = rng.elegir(['ra', 'rb']), falta = otroCat(dado);
    // nombre → lado: co-t es el opuesto a θ; ca-a, el adyacente a α.
    const lado = { 'co-t': desde(thEn).co, 'ca-t': desde(thEn).ca, 'co-a': desde(alEn).co, 'ca-a': desde(alEn).ca };
    const nombre = { 'co-t': ['cateto opuesto', TH], 'ca-t': ['cateto adyacente', TH], 'co-a': ['cateto opuesto', AL], 'ca-a': ['cateto adyacente', AL] };
    const Lu = x => L(x, o.u);
    const enun = [`${o.intro} `, TH, ` está ${o[thEn]}; `, AL, ' es el otro agudo. ',
      `${cap(o.h)} mide `, v('a', Lu(h)), ` y ${o[dado]}, `, v('b', Lu(val[dado])), '.'];
    const vars = Object.assign({ a: { nombre: o.h, color: 'o' }, b: { nombre: o[dado], color: 'i' } }, ANG);
    const fig = figO(o, ra, rb, { [dado]: { texto: Lu(val[dado]), color: 'i' }, h: { texto: Lu(h), color: 'o' } }, Object.assign(angFig(thEn, 'θ'), angFig(alEn, 'α')));
    return { o, ra, rb, h, val, thEn, alEn, dado, falta, lado, nombre, Lu, enun, vars, fig, lin: h - val[dado] };
  }
  const pitRaiz = (h, c, u) => `√(${f(h)}² − ${f(c)}²) = √(${f(h * h, 4)} − ${f(c * c, 4)}) = ${L(Math.sqrt(h * h - c * c), u)}`;

  function ladoObjeto(rng) {
    const pl = planteoObjeto(rng), { o, val, dado, falta, lado, nombre, Lu, h } = pl;
    const q = rng.elegir(['co-a', 'ca-a', 'co-a', 'co-t', 'ca-t']), k = lado[q], deAlfa = q.endsWith('-a');
    const otroK = otroCat(k), letra = deAlfa ? 'α' : 'θ';
    const errOtro = deAlfa
      ? er('LAD-NO-CAMBIA', Lu(val[otroK]), `Bien nombrar desde θ; pero se pregunta desde α, y desde α los catetos se intercambian.`)
      : q === 'co-t' && otroK === o.vertical
        ? er('TR7', Lu(val[otroK]), `Bien elegir un cateto; ${o[otroK]} es vertical, pero toca a θ: es el adyacente.`, 'parcial')
        : er('TR9', Lu(val[otroK]), 'Bien elegir un cateto; pero es el otro: el opuesto queda enfrente y el adyacente toca al ángulo.', 'parcial');
    const errores = [errOtro,
      er('LAD-HIPOTENUSA', Lu(h), `Bien: ${o.h} está en el triángulo. Pero no es cateto: queda frente al ángulo recto.`),
      k === falta
        ? er('PIT-LINEAL', Lu(pl.lin), `Bien buscar el cateto que falta con la hipotenusa; pero Pitágoras resta los cuadrados, no los largos.`)
        : er('PIT-LINEAL', Lu(pl.lin), `Bien usar la hipotenusa para el otro cateto, aunque con cuadrados. Además, el pedido ya mide ${Lu(val[dado])}.`)];
    const solucion = [
      [`${cap(o.h)} es la hipotenusa: queda frente al ángulo recto.`],
      [`Desde ${letra}, ese cateto es ${o[k]}.`],
      k === falta ? [`Falta: ${o[k]} = ${pitRaiz(h, val[dado], o.u)}.`] : [`Es ${o[dado]}, el dato: no hace falta Pitágoras.`],
      ['Mide ', v('x', Lu(val[k])), '.'],
    ];
    return {
      variables: Object.assign({ x: { nombre: 'el cateto que se pide', color: 'f' } }, pl.vars),
      enunciado: pl.enun, pregunta: ['¿Cuánto mide el ', v('x', nombre[q][0]), ' a ', nombre[q][1], '?'],
      datos: [D.h, D.co, D.ca, D.pita],
      correcta: { clave: Lu(val[k]), texto: Lu(val[k]) }, errores, solucion, extra: pl.fig,
      _datos: { tipo: 'lado-objeto', idea: 'lados-desde-angulo', nivel: 2, objeto: o.objeto + (o.sombra ? '-sombra' : ''), ra: pl.ra, rb: pl.rb, h, theta: pl.thEn, dado, pide: q },
    };
  }

  function sumaNombres(rng) {
    const pl = planteoObjeto(rng), { o, val, dado, lado, nombre, Lu, h } = pl;
    const par = rng.elegir([['co-t', 'ca-a'], ['co-t', 'co-a'], ['ca-t', 'co-a'], ['ca-t', 'ca-a']]), k1 = lado[par[0]], k2 = lado[par[1]];
    const correcta = val[k1] + val[k2], mismo = k1 === k2;
    const conLin = k => (k === dado ? val[k] : pl.lin);
    const errores = [
      er('LAD-NO-CAMBIA', Lu(mismo ? pl.ra + pl.rb : 2 * val[k1]), mismo ? 'Bien cada nombre; pero desde α los catetos se intercambian: los dos nombres son el mismo lado.' : 'Bien cada nombre; pero desde α los catetos se intercambian: son dos lados distintos.'),
      er('LAD-HIPOTENUSA', Lu(val[k1] + h), 'Bien sumar; pero la hipotenusa no es cateto: queda frente al ángulo recto.'),
      er('PIT-LINEAL', Lu(conLin(k1) + conLin(k2)), 'Bien los nombres; pero el cateto que falta sale de Pitágoras, con cuadrados, no restando largos.'),
      er('SUMA-INCOMPLETA', Lu(val[k1]), 'Bien el primer nombre; falta sumarle el segundo.'),
    ];
    const t = x => (x.endsWith('-t') ? 'θ' : 'α');
    const solucion = [
      [`${cap(nombre[par[0]][0])} a ${t(par[0])}: ${o[k1]}. ${cap(nombre[par[1]][0])} a ${t(par[1])}: ${o[k2]}.`],
      mismo ? ['Es el mismo lado dos veces.'] : ['Son los dos catetos.'],
      ...(k1 !== dado || k2 !== dado ? [[`${cap(o[pl.falta])} = ${pitRaiz(h, val[dado], o.u)}.`]] : []),
      [`${Lu(val[k1])} + ${Lu(val[k2])} = `, v('x', Lu(correcta)), '.'],
    ];
    return {
      variables: Object.assign({ x: { nombre: 'la suma que se pide', color: 'f' } }, pl.vars),
      enunciado: pl.enun,
      pregunta: ['¿Cuánto ', v('x', 'suman'), ` el ${nombre[par[0]][0].replace('cateto ', '')} a `, nombre[par[0]][1], ` y el ${nombre[par[1]][0].replace('cateto ', '')} a `, nombre[par[1]][1], '?'],
      datos: [D.h, D.co, D.ca, D.pita],
      correcta: { clave: Lu(correcta), texto: Lu(correcta) }, errores, solucion, extra: pl.fig,
      _datos: { tipo: 'suma-nombres', idea: 'lados-desde-angulo', nivel: 3, objeto: o.objeto + (o.sombra ? '-sombra' : ''), ra: pl.ra, rb: pl.rb, h, theta: pl.thEn, dado, pide: par.join('+') },
    };
  }

  // =============================== Idea 2: una razón es un cociente ===============================
  const LADOS_RAZON = { sen: ['co', 'h'], cos: ['ca', 'h'], tan: ['co', 'ca'] };
  const DEF = { sen: 'CO/H', cos: 'CA/H', tan: 'CO/CA' };
  function razonLados(rng) {
    const o = rng.elegir(OBJS), [ra, rb, h] = rng.elegir(o.ternas), val = { ra, rb, h };
    const en = rng.elegir(['a', 'b']), ds = Object.assign({ h: 'h' }, desde(en)), letra = en === 'a' ? 'θ' : 'α', ANGv = en === 'a' ? TH : AL;
    const razon = rng.elegir(['sen', 'cos', 'tan']), [kn, kd] = LADOS_RAZON[razon].map(x => ds[x]);
    const falta = rng.elegir(['ra', 'rb', 'h', null, null]);
    const dados = ['ra', 'rb', 'h'].filter(x => x !== falta);
    const Lu = x => L(x, o.u);
    // Colores por orden de dato (nunca por su papel en la razón): primero naranja, segundo turquesa, tercero en tinta.
    const claves = ['a', 'b', null], colorFig = ['o', 'i', null];
    const vars = Object.assign({ x: { nombre: `${razon} ${letra}`, color: 'f' }, a: { nombre: o[dados[0]], color: 'o' }, b: { nombre: o[dados[1]], color: 'i' } }, ANG);
    const V = i => (claves[i] ? v(claves[i], Lu(val[dados[i]])) : Lu(val[dados[i]]));
    const medidas = dados.length === 2
      ? [`${cap(o[dados[0]])} mide `, V(0), ` y ${o[dados[1]]}, `, V(1), '.']
      : [`${cap(o[dados[0]])} mide `, V(0), `; ${o[dados[1]]}, `, V(1), `, y ${o[dados[2]]}, `, V(2), '.'];
    const lados = {};
    for (const k of ['ra', 'rb', 'h']) lados[k] = k === falta ? { texto: '?' } : Object.assign({ texto: Lu(val[k]) }, colorFig[dados.indexOf(k)] ? { color: colorFig[dados.indexOf(k)] } : {});
    // El error lineal: el lado que falta sumando o restando largos (H = CO + CA; CA = H − CO).
    const mal = Object.assign({}, val);
    if (falta === 'h') mal.h = ra + rb; else if (falta) mal[falta] = h - val[otroCat(falta)];
    const otraR = { sen: [ds.ca, 'h'], cos: [ds.co, 'h'], tan: [ds.ca, 'h'] }[razon];
    const errores = [
      er('REC-INVERSA', fr(val[kd], val[kn]), 'Bien los dos lados; pero el cociente está al revés: arriba va el primero de la definición.'),
      razon === 'tan'
        ? er('TAN-H', fr(val[kn], h), 'Bien el opuesto arriba; la tangente lo divide entre el adyacente, no entre la hipotenusa.')
        : er('TR9', fr(val[otraR[0]], val[otraR[1]]), `Bien dividir entre la hipotenusa; pero arriba va el otro cateto. Revisa cuál toca a ${letra}.`, 'parcial'),
      er('TR7', Lu(val[kn]), `Bien: ${o[kn]} va arriba. Pero la razón es un cociente: se divide entre otro lado.`, 'documentado'),
    ];
    if (falta && (falta === kn || falta === kd)) errores.unshift(er('PIT-LINEAL', fr(mal[kn], mal[kd]), 'Bien buscar el lado que falta; pero sale de Pitágoras, con cuadrados, no sumando ni restando largos.'));
    if (razon === 'tan') errores.push(er('TR9', fr(val[otraR[0]], val[otraR[1]]), `Bien un cociente de lados; pero ese es el coseno. La tangente no usa la hipotenusa.`, 'parcial'));
    const pideFalta = falta === kn || falta === kd;
    const solucion = [
      [`Desde ${letra}: CO es ${o[ds.co]}, CA es ${o[ds.ca]} y H es ${o.h}.`],
      ...(pideFalta ? [[falta === 'h' ? `H = √(${f(ra)}² + ${f(rb)}²) = ${Lu(h)}.` : `${cap(o[falta])} = ${pitRaiz(h, val[otroCat(falta)], o.u)}.`]] : []),
      [`${razon} ${letra} = ${LADOS_RAZON[razon].map(x => x.toUpperCase()).join('/')} = ${cocienteTxt(val[kn], val[kd])}`, v('x', fr(val[kn], val[kd])), '.'],
    ];
    return {
      variables: vars,
      enunciado: [`${o.intro} `, ANGv, ` es el ángulo ${o[en]}. `, ...medidas],
      pregunta: ['¿Cuánto vale ', v('x', `${razon} ${letra}`), '?'],
      datos: [D.razones(letra), D.letras(letra), D.pita],
      correcta: { clave: fr(val[kn], val[kd]), texto: fr(val[kn], val[kd]) }, errores, solucion,
      extra: figO(o, ra, rb, lados, angFig(en, letra)),
      _datos: { tipo: 'razon-lados', idea: 'razon-cociente', nivel: pideFalta ? 2 : 1, objeto: o.objeto + (o.sombra ? '-sombra' : ''), ra, rb, h, angulo: en, razon, falta, pide: `${razon} ${letra}` },
    };
  }

  function semejante(rng) {
    const o = rng.elegir(OBJS.slice(0, 3)), [ra, rb, h] = rng.elegir(o.ternas), val = { ra, rb, h };
    const k = rng.elegir([2, 3, 4]), razon = rng.elegir(['sen', 'cos', 'tan']), ds = Object.assign({ h: 'h' }, desde('a'));
    const [kn, kd] = LADOS_RAZON[razon].map(x => ds[x]), Lu = x => L(x, o.u);
    const bien = fr(val[kn], val[kd]);
    const veces = { 2: 'el doble', 3: 'el triple', 4: 'cuatro veces' }[k];
    const errores = [
      er('TR8', fr(k * val[kn], val[kd]), `Bien: los lados del grande miden ${veces}. Pero los dos crecen igual: el cociente no cambia.`, 'parcial'),
      er('RAZ-CHICO', fr(val[kn], k * val[kd]), 'Bien ver que el grande cambia; pero arriba y abajo crecen igual: el cociente se queda.'),
      er('TR7', Lu(k * val[kn]), `Bien el lado del grande, ${Lu(k * val[kn])}; la razón lo divide entre otro lado.`, 'documentado'),
      er('REC-INVERSA', fr(val[kd], val[kn]), 'Bien los lados; pero el cociente está al revés.'),
    ];
    return {
      variables: Object.assign({ x: { nombre: `${razon} θ en el triángulo grande`, color: 'f' }, a: { nombre: o.ra, color: 'o' }, b: { nombre: o.rb, color: 'i' } }, ANG),
      enunciado: [`${o.en}, ${o.ra} mide `, v('a', Lu(ra)), ` y ${o.rb}, `, v('b', Lu(rb)), '; ', TH, ` es el ángulo ${o.a}. ${o.otra} con el mismo `, TH, ` tiene sus lados ${k} veces más largos.`],
      pregunta: ['¿Cuánto vale ', v('x', `${razon} θ`), ` en ${o.laOtra}?`],
      datos: [D.razones('θ'), D.semej, D.pita],
      correcta: { clave: bien, texto: bien }, errores,
      solucion: [
        ['Mismo θ: los dos triángulos son semejantes y tienen las mismas razones.'],
        ...(razon === 'tan' ? [] : [[`En el chico, H = √(${f(ra)}² + ${f(rb)}²) = ${Lu(h)}.`]]),
        [`${razon} θ = ${cocienteTxt(val[kn], val[kd])}`, v('x', bien), ', en los dos.'],
      ],
      _datos: { tipo: 'semejante', idea: 'razon-cociente', nivel: 2, objeto: o.objeto, ra, rb, h, k, razon, pide: `${razon} θ` },
    };
  }

  const TERNAS = [[3, 4, 5], [5, 12, 13], [8, 15, 17], [7, 24, 25], [20, 21, 29]];
  function otraRazon(rng) {
    const [p, q, h] = rng.elegir(TERNAS), [co, ca] = rng.moneda() ? [p, q] : [q, p];
    const [dada, pide] = rng.elegir([['tan', 'suma'], ['sen', 'tan'], ['cos', 'sen'], ['tan', 'sen'], ['sen', 'cos'], ['cos', 'tan'], ['tan', 'cos']]);
    const R = { sen: [co, h], cos: [ca, h], tan: [co, ca] };
    let bien, pideTxt, errores, cuenta;
    if (pide === 'suma') {
      bien = fr(co + ca, h); pideTxt = 'sen θ + cos θ';
      errores = [
        er('PIT-LINEAL', '1', `Bien tomar catetos ${co} y ${ca}; pero la hipotenusa sale de Pitágoras, no de sumarlos.`),
        er('FRAC-SUMA', fr(co + ca, 2 * h), `Bien los dos cocientes, sobre ${h}; al sumar con igual denominador, el denominador se queda.`),
        er('SUMA-INCOMPLETA', fr(co, h), 'Bien el seno; falta sumarle el coseno.'),
        er('REC-INVERSA', fr(h, co + ca), 'Bien los lados; pero cada cociente está al revés.'),
      ];
      cuenta = `${co}/${h} + ${ca}/${h} = `;
    } else {
      bien = fr(...R[pide]); pideTxt = `${pide} θ`;
      const lin = { 'sen-tan': [co, h - co], 'cos-sen': [h - ca, h], 'tan-sen': [co, co + ca], 'sen-cos': [h - co, h], 'cos-tan': [h - ca, ca], 'tan-cos': [ca, co + ca] }[`${dada}-${pide}`];
      const otra = { sen: [ca, h], cos: [co, h], tan: [co, h] }[pide];
      errores = [
        er('TR9', fr(...otra), `Bien los tres lados; pero ${pide} θ divide otros dos. Nómbralos desde θ.`, 'parcial'),
        er('PIT-LINEAL', fr(...lin), 'Bien buscar el lado que falta; pero sale de Pitágoras, con cuadrados, no sumando ni restando.'),
        er('REC-INVERSA', fr(R[pide][1], R[pide][0]), 'Bien los lados; pero el cociente está al revés.'),
        er('TR9', fr(...{ sen: [co, ca], cos: [co, ca], tan: [ca, h] }[pide]), `Bien los tres lados; pero ese cociente es otra razón: ${pide} θ = ${DEF[pide]}.`, 'parcial'),
      ];
      cuenta = `${pide} θ = ${cocienteTxt(...R[pide])}`;
    }
    const falta = { sen: 'CA', cos: 'CO', tan: 'H' }[dada];
    const pit = dada === 'tan' ? `H = √(${co}² + ${ca}²) = ${h}` : `${falta} = √(${h}² − ${dada === 'sen' ? co : ca}²) = ${dada === 'sen' ? ca : co}`;
    return {
      variables: Object.assign({ x: { nombre: pideTxt, color: 'f' }, a: { nombre: `${dada} θ`, color: 'o' } }, ANG),
      enunciado: [`En un triángulo rectángulo, ${dada} θ = `, v('a', fr(...R[dada])), ', con θ agudo.'],
      pregunta: ['¿Cuánto vale ', v('x', pideTxt), '?'],
      datos: [D.razones('θ'), D.letras('θ'), D.pita],
      correcta: { clave: bien, texto: bien }, errores,
      solucion: [
        [`La razón no depende del tamaño: tomo ${dada === 'tan' ? `CO = ${co} y CA = ${ca}` : dada === 'sen' ? `CO = ${co} y H = ${h}` : `CA = ${ca} y H = ${h}`}.`],
        [`${pit}.`],
        [cuenta, v('x', bien), '.'],
      ],
      _datos: { tipo: 'otra-razon', idea: 'razon-cociente', nivel: 3, co, ca, h, dada, pide: pideTxt },
    };
  }

  function razonFigura(rng) {
    if (rng.entero(0, 2) < 2) {
      const [p, q, hh] = rng.elegir([[4, 3, 5], [12, 5, 13], [8, 6, 10], [15, 8, 17], [24, 7, 25]]), k = rng.elegir([1, 2]);
      const AB = p * k, BC = q * k, AC = hh * k, en = rng.elegir(['A', 'C']), razon = rng.elegir(['sen', 'cos', 'tan']);
      const [op, ad] = en === 'A' ? [BC, AB] : [AB, BC];
      const val = { sen: [op, AC], cos: [ad, AC], tan: [op, ad] }[razon];
      const lado = en === 'A' ? 'AB' : 'BC';
      const errores = [
        er('ANG-OTRO', fr(...{ sen: [ad, AC], cos: [op, AC], tan: [ad, op] }[razon]), `Bien el triángulo ABC; pero desde ${en} los catetos se nombran al revés.`),
        er('REC-INVERSA', fr(val[1], val[0]), 'Bien los lados; pero el cociente está al revés.'),
        razon === 'tan'
          ? er('TAN-H', fr(op, AC), 'Bien el opuesto arriba; la tangente lo divide entre el adyacente, no entre la diagonal.')
          : er('PIT-LINEAL', fr(val[0], AB + BC), 'Bien: la diagonal es la hipotenusa. Pero sale de Pitágoras, no de sumar los lados.'),
        er('TR7', `${val[0]} cm`, 'Bien el lado de arriba del cociente; la razón lo divide entre otro lado.', 'documentado'),
        er('TR9', fr(...{ sen: [op, ad], cos: [op, ad], tan: [ad, AC] }[razon]), `Bien los lados desde ${en}; pero ese cociente es otra razón: ${razon} θ = ${DEF[razon]}.`, 'parcial'),
      ];
      return {
        variables: Object.assign({ x: { nombre: `${razon} θ`, color: 'f' }, a: { nombre: 'AB', color: 'o' }, b: { nombre: 'BC', color: 'i' } }, ANG),
        enunciado: ['Un rectángulo ABCD tiene ', v('a', `AB = ${AB} cm`), ' y ', v('b', `BC = ${BC} cm`), '. ', TH, ` es el ángulo entre la diagonal AC y el lado ${lado}.`],
        pregunta: ['¿Cuánto vale ', v('x', `${razon} θ`), '?'],
        datos: [D.rect, D.razones('θ'), D.pita],
        correcta: { clave: fr(...val), texto: fr(...val) }, errores,
        solucion: [
          [`ABC es rectángulo en B; la diagonal AC es su hipotenusa: √(${AB}² + ${BC}²) = ${AC} cm.`],
          [`Desde ${en}: CO = ${op} cm y CA = ${ad} cm.`],
          [`${razon} θ = ${cocienteTxt(...val)}`, v('x', fr(...val)), '.'],
        ],
        extra: escena({ objeto: 'figura', forma: 'diagonal', medidas: { ra: AB, rb: BC }, lados: { AB: { texto: `${AB} cm`, color: 'o' }, BC: { texto: `${BC} cm`, color: 'i' } }, angulos: { [en]: { texto: 'θ' } } }),
        _datos: { tipo: 'razon-figura', idea: 'razon-cociente', nivel: 3, forma: 'diagonal', AB, BC, angulo: en, razon, pide: `${razon} θ` },
      };
    }
    // Cuadrado con M, punto medio de DC: el triángulo ADM, recto en D.
    const Lc = rng.elegir([2, 4, 6, 8, 10]), en = rng.elegir(['A', 'M']);
    const [op, ad] = en === 'A' ? [Lc / 2, Lc] : [Lc, Lc / 2];
    const raiz5 = en === 'A' ? '√5/5' : '2√5/5'; // sen θ = CO/AM, con AM = Lc·√5/2
    const errores = [
      er('MEDIO-ENTERO', '1', 'Bien el triángulo ADM; pero DM es la mitad de DC, no el lado entero.'),
      er('REC-INVERSA', fr(ad, op), 'Bien los catetos; pero desde θ el opuesto va arriba.'),
      er('TAN-H', raiz5, 'Bien el opuesto arriba; la tangente lo divide entre el adyacente, no entre AM.'),
      er('TR7', `${f(op)} cm`, 'Bien el cateto opuesto; la razón lo divide entre el adyacente.', 'documentado'),
    ];
    const bien = fr(op, ad);
    return {
      variables: Object.assign({ x: { nombre: 'tan θ', color: 'f' }, a: { nombre: 'el lado del cuadrado', color: 'o' } }, ANG),
      enunciado: ['ABCD es un cuadrado de ', v('a', `${Lc} cm`), ' de lado y M es el punto medio de DC. ', TH, ` es el ángulo ${en === 'A' ? 'DAM' : 'AMD'}.`],
      pregunta: ['¿Cuánto vale ', v('x', 'tan θ'), '?'],
      datos: [D.cuad, D.medio, D.razones('θ')],
      correcta: { clave: bien, texto: bien }, errores,
      solucion: [
        [`ADM es rectángulo en D: AD = ${Lc} cm y DM = ${f(Lc / 2)} cm, la mitad de DC.`],
        [`Desde θ, en ${en}: CO = ${f(op)} cm y CA = ${f(ad)} cm.`],
        [`tan θ = ${cocienteTxt(op, ad)}`, v('x', bien), '.'],
      ],
      extra: escena({ objeto: 'figura', forma: 'medio', medidas: { ra: Lc, rb: Lc / 2 }, lados: { AB: { texto: `${Lc} cm`, color: 'o' } }, angulos: { [en]: { texto: 'θ' } } }),
      _datos: { tipo: 'razon-figura', idea: 'razon-cociente', nivel: 3, forma: 'medio', lado: Lc, angulo: en, razon: 'tan', pide: 'tan θ' },
    };
  }

  // =============================== Idea 3: medio cuadrado, medio equilátero ===============================
  const datosNot = (...extra) => [D.razones('θ'), D.t30, D.t45, ...extra];
  function valorNotable(rng) {
    const g = rng.elegir([30, 45, 60]), rz = rng.elegir(['sen', 'cos', 'tan']), bien = Ex.txt(NOT[rz][g]);
    const otros = g === 45 ? [30, 60] : [otro(g)];
    const errores = [
      er('NOT-MISMO', Ex.txt(MAL.cambia[rz][g]), `Bien la figura; pero ese es el cateto del otro ángulo agudo. Nómbralo desde ${g}°.`),
      er('TR7', Ex.txt(MAL.largo[rz][g]), 'Bien ubicado el lado; pero la razón lo divide entre otro lado.', 'documentado'),
      er('REC-INVERSA', Ex.txt(MAL.inversa[rz][g]), 'Bien los dos lados; pero el cociente está al revés.'),
      ...otros.map(o => er('NOT-CAMBIA', Ex.txt(NOT[rz][o]), `Bien la figura; pero ese es ${rz} ${o}°. Revisa qué ángulo queda frente a cada lado.`)),
      ...(rz === 'tan' ? [er('TAN-H', Ex.txt(NOT.sen[g]), 'Bien el cateto de enfrente arriba; la tangente lo divide entre el otro cateto.')] : []),
    ];
    const fig = g === 45 ? 'media loseta: catetos 1 y 1, hipotenusa √2' : 'media señal: frente a 30°, 1; frente a 60°, √3; hipotenusa 2';
    const lados = { sen: 'CO/H', cos: 'CA/H', tan: 'CO/CA' }[rz];
    return {
      variables: Object.assign({ x: { nombre: `${rz} ${g}°`, color: 'f' } }, ANG),
      enunciado: ['Sin calculadora.'],
      pregunta: ['¿Cuál es el valor exacto de ', v('x', `${rz} ${g}°`), '?'],
      datos: datosNot(D.racio),
      correcta: { clave: bien, texto: bien }, errores,
      solucion: [
        [`En la ${fig}.`],
        [`${rz} ${g}° = ${lados}, desde ${g}°.`],
        [`${rz} ${g}° = `, v('x', bien), '.'],
      ],
      _datos: { tipo: 'valor-notable', idea: 'notables', nivel: 1, razon: rz, g, pide: `${rz} ${g}°` },
    };
  }

  // Objetos con la hipotenusa par: lados m, m√3 y 2m (30° y 60°) o m√2, m√2 y 2m (45°).
  const HIP_REC = { escalera: [2, 4], rampa: [2, 4], poste: [4, 6, 8] };
  function reconoceAngulo(rng) {
    const o = rng.elegir(OBJS.filter(x => HIP_REC[x.objeto] && !x.sombra)), g = rng.elegir([30, 45, 60]), H = rng.elegir(HIP_REC[o.objeto]), m = H / 2;
    const raiz = k => `${m === 1 ? '' : f(m)}√${k}`;
    // Desde θ (en a): el adyacente es ra y el opuesto rb.
    const lado = { 30: { ra: [m * Math.sqrt(3), raiz(3)], rb: [m, f(m)] }, 45: { ra: [m * Math.SQRT2, raiz(2)], rb: [m * Math.SQRT2, raiz(2)] }, 60: { ra: [m, f(m)], rb: [m * Math.sqrt(3), raiz(3)] } }[g];
    const dado = rng.elegir(['ra', 'rb']), Lt = k => `${lado[k][1]} ${o.u}`;
    const errores = [
      g === 45 ? er('NOT-CAMBIA', '30°', 'Bien buscar un notable; pero con dos catetos iguales no es media señal.')
        : er('NOT-CAMBIA', `${otro(g)}°`, 'Bien buscar un notable; revisa qué lado queda frente a θ y cuál lo toca.'),
      g === 45 ? er('NOT-MISMO', '60°', 'Bien buscar un notable; pero los lados son de media loseta, no de media señal.')
        : er('NOT-MISMO', '45°', 'Bien buscar un notable; pero los lados son de media señal, no de media loseta.'),
      er('NOT-ADIVINA', 'Sin transportador no se sabe', 'Bien que medir ayudaría; pero el cociente de dos lados ya fija el ángulo.'),
    ];
    const rz = dado === 'ra' ? 'cos' : 'sen';
    const cociente = dado === 'ra' ? (g === 60 ? '1/2' : g === 45 ? '√2/2' : '√3/2') : (g === 30 ? '1/2' : g === 45 ? '√2/2' : '√3/2');
    return {
      variables: Object.assign({ x: { nombre: 'el ángulo θ', color: 'f' }, a: { nombre: o.h, color: 'o' }, b: { nombre: o[dado], color: 'i' } }, ANG),
      enunciado: [`${o.intro} ${cap(o.h)} mide `, v('a', `${f(H)} ${o.u}`), ` y ${o[dado]}, `, v('b', Lt(dado)), '.'],
      pregunta: ['¿Cuánto mide ', TH, `, el ángulo ${o.a}?`],
      datos: [D.razones('θ'), D.t30, D.t45],
      correcta: { clave: `${g}°`, texto: `${g}°` }, errores,
      solucion: [
        [`Desde θ, ${o[dado]} es el ${dado === 'ra' ? 'adyacente' : 'opuesto'}: ${rz} θ = ${lado[dado][1]}/${f(H)}${`${lado[dado][1]}/${f(H)}` === cociente ? '' : ` = ${cociente}`}.`],
        [`Ese cociente es el de la ${g === 45 ? 'media loseta' : 'media señal'}, desde ${g}°: θ = `, v('x', `${g}°`), '.'],
      ],
      extra: figO(o, lado.ra[0], lado.rb[0], { h: { texto: `${f(H)} ${o.u}`, color: 'o' }, [dado]: { texto: Lt(dado), color: 'i' }, [otroCat(dado)]: { texto: '?' } }, { a: { texto: 'θ' } }),
      _datos: { tipo: 'reconoce-angulo', idea: 'notables', nivel: 2, objeto: o.objeto, H, g, dado, pide: 'θ' },
    };
  }

  // Expresiones de examen (propias; no son las de «Ahora tú» de la teoría). Con th, los ángulos son múltiplos de θ.
  const EXPR = [
    { e: [[2, ['sen', 30]], [1, ['tan', 45], ['cos', 60]]] },
    { e: [[4, ['cos', 30, 2]], [-1, ['tan', 45]]] },
    { e: [[1, ['tan', 60], ['cos', 30]], [1, ['sen', 30]]] },
    { e: [[2, ['sen', 45, 2]], [1, ['tan', 60, 2]]] },
    { e: [[3, ['tan', 30, 2]], [2, ['sen', 30]]] },
    { e: [[1, ['tan', 60]], [1, ['tan', 30]]] },
    { e: [[2, ['cos', 30]], [1, ['sen', 60]]] },
    { e: [[1, ['sen', 45], ['cos', 45]], [1, ['tan', 30], ['tan', 60]]] },
    { e: [[1, ['cos', 60, 1, 4]], [1, ['tan', 45, 1, 3]]], th: 15 },
    { e: [[1, ['sen', 60, 1, 2], ['tan', 30, 1, 1]]], th: 30 },
    { e: [[1, ['cos', 60, 1, 2]], [1, ['tan', 60, 1, 2], ['tan', 30, 1, 1]]], th: 30 },
    { e: [[2, ['sen', 30, 1, 3]], [1, ['cos', 60, 1, 6]]], th: 10 },
  ];
  function expresionNotable(rng) {
    const x = rng.elegir(EXPR), bien = Ex.txt(ev(x.e)), cuad = x.e.some(([, ...fs]) => fs.some(fa => fa[2] === 2));
    const errores = [
      er('NOT-MISMO', Ex.txt(ev(x.e, MAL.cambia)), 'Bien reemplazar cada razón; pero usaste el cateto del otro ángulo agudo.'),
      er('TR7', Ex.txt(ev(x.e, MAL.largo)), 'Bien reemplazar cada razón; pero pusiste el largo de un lado y no su cociente.', 'documentado'),
      er('REC-INVERSA', Ex.txt(ev(x.e, MAL.inversa)), 'Bien reemplazar cada razón; pero cada cociente está al revés.'),
      ...(x.th === 30 ? [er('TR10', Ex.txt(ev(x.e, NOT, 30)), 'Bien calcular con θ = 30°; pero sen 2θ no es 2 sen θ: la razón no crece como el ángulo.', 'parcial')] : []),
    ];
    const pre = x.th ? ['Si ', TH, ` = ${x.th}°, ¿cuánto vale `] : ['¿Cuánto vale '];
    return {
      variables: Object.assign({ x: { nombre: 'la expresión', color: 'f' } }, ANG),
      enunciado: ['Sin calculadora.'],
      pregunta: [...pre, v('x', exprTxt(x.e)), '?'],
      datos: datosNot(D.racio, ...(cuad ? [D.pot] : [])),
      correcta: { clave: bien, texto: bien }, errores,
      solucion: [
        ...(x.th ? [[`Primero los ángulos: queda ${exprGrados(x.e)}.`]] : []),
        ['Cada razón sale de su figura, nombrada desde su ángulo.'],
        [`${exprGrados(x.e)} = `, v('x', bien), '.'],
      ],
      _datos: { tipo: 'expresion-notable', idea: 'notables', nivel: 3, expresion: exprTxt(x.e), th: x.th || null, pide: exprTxt(x.e) },
    };
  }

  // =============================== Idea 4: 37° y 53° (y 16°, 74°) ===============================
  // Partes frente al ángulo (op), junto a él (ad) y en la hipotenusa (h).
  const TERNA = {
    37: { op: 3, ad: 4, h: 5, datos: [D.c37] }, 53: { op: 4, ad: 3, h: 5, datos: [D.c37, D.par37] },
    16: { op: 7, ad: 24, h: 25, datos: [D.c16] }, 74: { op: 24, ad: 7, h: 25, datos: [D.c16, D.par16] },
  };
  function razonConvencion(rng) {
    const [g, rz] = rng.elegir([[53, 'sen'], [53, 'cos'], [53, 'tan'], [74, 'sen'], [74, 'cos'], [74, 'tan'], [37, 'tan'], [16, 'tan']]);
    const T = TERNA[g], val = { sen: [T.op, T.h], cos: [T.ad, T.h], tan: [T.op, T.ad] }[rz], ot = { sen: [T.ad, T.h], cos: [T.op, T.h], tan: [T.ad, T.op] }[rz];
    const base = g === 53 || g === 37 ? 37 : 16, terna = T.h === 5 ? '3, 4 y 5' : '7, 24 y 25';
    const errores = [
      er('ANG-OTRO', fr(...ot), `Bien el triángulo de ${base}°; pero ese valor se lee desde su otro ángulo agudo.`),
      er('REC-INVERSA', fr(val[1], val[0]), 'Bien los dos lados; pero el cociente está al revés.'),
      rz === 'tan' ? er('TAN-H', fr(T.op, T.h), 'Bien el opuesto arriba; la tangente lo divide entre el adyacente, no la hipotenusa.')
        : er('TR9', fr(...(rz === 'sen' ? [T.op, T.ad] : [T.ad, T.op])), `Bien ubicar el triángulo; pero ${rz} divide entre la hipotenusa.`, 'parcial'),
      rz === 'tan' ? er('TR9', fr(T.ad, T.h), 'Bien ubicar el triángulo; pero ese es el coseno, no la tangente.', 'parcial')
        : er('TR9', fr(...(rz === 'sen' ? [T.ad, T.op] : [T.op, T.ad])), `Bien ubicar el triángulo; pero ese cociente es otra razón: ${rz} = ${DEF[rz]}.`, 'parcial'),
    ];
    return {
      variables: Object.assign({ x: { nombre: `${rz} ${g}°`, color: 'f' } }, ANG),
      enunciado: ['Usa la convención del examen.'],
      pregunta: ['¿Cuánto vale ', v('x', `${rz} ${g}°`), '?'],
      datos: [D.razones('θ'), ...T.datos],
      correcta: { clave: fr(...val), texto: fr(...val) }, errores,
      solucion: [
        [`Con la convención, el triángulo de ${base}° tiene lados ${terna}.`],
        [`Desde ${g}°: CO = ${T.op}, CA = ${T.ad}, H = ${T.h}.`],
        [`${rz} ${g}° = `, v('x', fr(...val)), '.'],
      ],
      _datos: { tipo: 'razon-convencion', idea: 'aproximados', nivel: 1, razon: rz, g, pide: `${rz} ${g}°` },
    };
  }

  const OBJ_APROX = [
    { o: OBJS[0], g: 53, ks: [0.5, 0.6] }, { o: OBJS[0], g: 74, ks: [0.1, 0.12] }, { o: OBJS[1], g: 16, ks: [0.1, 0.2] },
    { o: OBJS[2], g: 37, ks: [2, 1.5] }, { o: OBJS[2], g: 53, ks: [2, 1.5] }, { o: OBJS[3], g: 37, ks: [2, 3] }, { o: OBJS[3], g: 53, ks: [1.5, 2] },
  ];
  const PAPEL_LADO = { ra: 'ad', rb: 'op', h: 'h' };
  const PARTE_OTRO = { op: 'ad', ad: 'op', h: 'h' };
  function ladoK(rng) {
    const { o, g, ks } = rng.elegir(OBJ_APROX), k = rng.elegir(ks), T = TERNA[g], u = o.u;
    const Lu = x => L(x, u), val = { ra: T.ad * k, rb: T.op * k, h: T.h * k };
    const [dado, pide] = rng.elegir([['h', 'rb'], ['rb', 'h'], ['rb', 'ra'], ['ra', 'rb'], ['h', 'ra'], ['rb', 'per'], ['h', 'per']]);
    const pd = T[PAPEL_LADO[dado]];
    const kMal = val[dado] / T[PARTE_OTRO[PAPEL_LADO[dado]]];
    const per = val.ra + val.rb + val.h;
    let correcta, errores, ultimo;
    if (pide === 'per') {
      correcta = per;
      errores = [
        er('ANG-OTRO', Lu(kMal * (T.op + T.ad + T.h)), `Bien usar k; pero esas partes son del otro ángulo agudo. Frente a ${g}° van ${T.op}.`),
        er('K-SIN-DIVIDIR', Lu(val[dado] * (T.op + T.ad + T.h)), 'Bien sumar las partes; pero antes k sale de dividir el dato entre sus partes.'),
        er('SUMA-INCOMPLETA', Lu(per - val[dado]), `Bien los dos lados que faltaban; falta sumar ${o[dado]}, el dato.`),
      ];
      ultimo = [`${f(val.rb)} + ${f(val.ra)} + ${f(val.h)} = `, v('x', Lu(per)), '.'];
    } else {
      const tercero = ['ra', 'rb', 'h'].find(x => x !== dado && x !== pide);
      correcta = val[pide];
      errores = [
        er('ANG-OTRO', Lu(kMal * T[PARTE_OTRO[PAPEL_LADO[pide]]]), `Bien usar k; pero esas partes son del otro ángulo agudo. Frente a ${g}° van ${T.op}.`),
        er('TR9', Lu(val[tercero]), `Bien calculado ${o[tercero]}; pero se pedía ${o[pide]}.`, 'parcial'),
        er('K-SIN-DIVIDIR', Lu(val[dado] * T[PAPEL_LADO[pide]]), 'Bien multiplicar por las partes; pero antes k sale de dividir el dato entre sus partes.'),
      ];
      ultimo = [`${cap(o[pide])}: ${T[PAPEL_LADO[pide]]} · ${f(k)} = `, v('x', Lu(val[pide])), '.'];
    }
    const lados = { [dado]: { texto: Lu(val[dado]), color: 'o' } };
    if (pide !== 'per') lados[pide] = { texto: '?' };
    const pideTxt = pide === 'per' ? 'el perímetro del triángulo' : o[pide];
    return {
      variables: Object.assign({ x: { nombre: pideTxt, color: 'f' }, a: { nombre: o[dado], color: 'o' }, g: { nombre: 'el ángulo dado', color: 'h' } }, ANG),
      enunciado: [`${o.intro} El ángulo ${o.a} mide `, v('g', `${g}°`), `. ${cap(o[dado])} mide `, v('a', Lu(val[dado])), '.'],
      pregunta: ['¿Cuánto mide ', v('x', pideTxt), '?'],
      datos: [...T.datos, D.k, ...(pide === 'per' ? [D.perim] : [])],
      correcta: { clave: Lu(correcta), texto: Lu(correcta) }, errores,
      solucion: [
        [`Frente a ${g}° van ${T.op} partes, junto a él ${T.ad} y en la hipotenusa ${T.h}.`],
        [`${cap(o[dado])} tiene ${pd} partes: k = ${f(val[dado])} ÷ ${pd} = ${f(k)}.`],
        ...(pide === 'per' ? [[`Lados: ${T.op}k = ${Lu(val.rb)}, ${T.ad}k = ${Lu(val.ra)} y ${T.h}k = ${Lu(val.h)}.`]] : []),
        ultimo,
      ],
      extra: figO(o, val.ra, val.rb, lados, { a: { texto: `${g}°` } }),
      _datos: { tipo: 'lado-k', idea: 'aproximados', nivel: 2, objeto: o.objeto + (o.sombra ? '-sombra' : ''), g, k, dado, pide },
    };
  }

  function figuraK(rng) {
    const forma = rng.elegir(['trapecio', 'trapecio', 'cartulina', 'resbala', 'sombra']);
    const vars = Object.assign({ a: { nombre: 'el primer dato', color: 'o' }, b: { nombre: 'el segundo dato', color: 'i' }, g: { nombre: 'el ángulo dado', color: 'h' }, g2: { nombre: 'el otro ángulo dado', color: 'h' } }, ANG);
    if (forma === 'trapecio') {
      const g = rng.elegir([37, 53]), T = TERNA[g], k = rng.elegir([2, 3, 4]), men = rng.elegir([5, 6, 8, 10]);
      const CH = T.op * k, HB = T.ad * k, BC = T.h * k, AB = men + HB, per = AB + BC + men + CH;
      const pide = rng.elegir(['AB', 'BC', 'per']), bien = { AB, BC, per }[pide];
      const txt = { AB: 'la base AB', BC: 'el lado BC', per: 'el perímetro del trapecio' }[pide];
      const kM = CH / T.ad, HBm = T.op * kM, BCm = T.h * kM, mal = { AB: men + HBm, BC: BCm, per: men + HBm + BCm + men + CH }[pide];
      const sk = { AB: men + CH * T.ad, BC: CH * T.h, per: men + CH * T.ad + CH * T.h + men + CH }[pide];
      const errores = [
        er('ANG-OTRO', `${f(mal)} m`, `Bien el triángulo HBC; pero frente a ${g}° van ${T.op} partes, no ${T.ad}.`),
        pide === 'per' ? er('SUMA-INCOMPLETA', `${f(AB + BC + men)} m`, 'Bien los lados hallados; falta sumar AD, la altura.')
          : pide === 'AB' ? er('TR9', `${f(HB)} m`, 'Bien hallado HB; pero AB también incluye AH, que mide lo mismo que DC.', 'parcial')
            : er('TR9', `${f(HB)} m`, 'Bien hallado HB; pero BC es la hipotenusa del triángulo HBC.', 'parcial'),
        er('K-SIN-DIVIDIR', `${f(sk)} m`, 'Bien multiplicar por las partes; pero antes k = altura ÷ sus partes.'),
      ];
      return {
        variables: Object.assign({ x: { nombre: txt, color: 'f' } }, vars),
        enunciado: ['El trapecio ABCD tiene ', v('a', `AD = ${CH} m`), ', perpendicular a las bases, y ', v('b', `CD = ${men} m`), '. BC forma ', v('g', `${g}°`), ' con AB.'],
        pregunta: ['¿Cuánto mide ', v('x', txt), '?'],
        datos: [...TERNA[g].datos, D.k, D.trap, ...(pide === 'per' ? [D.perim] : [])],
        correcta: { clave: `${f(bien)} m`, texto: `${f(bien)} m` }, errores,
        solucion: [
          [`En HBC, recto en H, CH = ${CH} m queda frente a ${g}°: ${T.op} partes, k = ${k}.`],
          [`HB = ${T.ad}k = ${HB} m y BC = ${T.h}k = ${BC} m. AB = AH + HB = ${men} + ${HB} = ${AB} m.`],
          [{ AB: 'AB', BC: 'BC', per: `Perímetro: ${AB} + ${BC} + ${men} + ${CH}` }[pide], ' = ', v('x', `${f(bien)} m`), '.'],
        ],
        extra: escena({ objeto: 'figura', forma: 'trapecio', menor: men, medidas: { ra: HB, rb: CH }, lados: { DA: { texto: `${CH} m`, color: 'o' }, CD: { texto: `${men} m`, color: 'i' } }, angulos: { B: { texto: `${g}°` } } }),
        _datos: { tipo: 'figura-k', idea: 'aproximados', nivel: 3, forma, g, k, menor: men, pide },
      };
    }
    if (forma === 'cartulina') {
      const k = rng.elegir([3, 4, 5, 6]), AB = 4 * k, BC = 3 * k, AC = 5 * k;
      const errores = [
        er('ANG-OTRO', `${f(AB / 3 * 12)} cm`, 'Bien el 3-4-5; pero AB toca a 37°: tiene 4 partes, no 3.'),
        er('TR9', `${2 * (AB + BC)} cm`, 'Bien sumar lados; pero ese es el perímetro de la cartulina entera, sin la diagonal.', 'parcial'),
        er('K-SIN-DIVIDIR', `${12 * AB} cm`, `Bien sumar 3k + 4k + 5k; pero k = ${AB} ÷ 4, no el largo entero.`),
      ];
      return {
        variables: Object.assign({ x: { nombre: 'el perímetro de cada triángulo', color: 'f' } }, vars),
        enunciado: ['Una cartulina rectangular ABCD tiene ', v('a', `AB = ${AB} cm`), ' de largo. Se corta por la diagonal AC, que forma ', v('g', '37°'), ' con AB.'],
        pregunta: ['¿Cuánto mide ', v('x', 'el perímetro de cada triángulo'), '?'],
        datos: [D.c37, D.k, D.perim],
        correcta: { clave: `${12 * k} cm`, texto: `${12 * k} cm` }, errores,
        solucion: [
          [`AB toca a 37°: 4 partes, así que k = ${AB} ÷ 4 = ${k}.`],
          [`BC = 3k = ${BC} cm y la diagonal AC = 5k = ${AC} cm.`],
          [`${AB} + ${BC} + ${AC} = `, v('x', `${12 * k} cm`), '.'],
        ],
        extra: escena({ objeto: 'figura', forma: 'diagonal', medidas: { ra: AB, rb: BC }, lados: { AB: { texto: `${AB} cm`, color: 'o' } }, angulos: { A: { texto: '37°' } } }),
        _datos: { tipo: 'figura-k', idea: 'aproximados', nivel: 3, forma, k, pide: 'per' },
      };
    }
    if (forma === 'resbala') {
      // La escalera pasa de g1 a g2 con el piso; la pared es el cateto frente al ángulo.
      const [g1, g2] = rng.elegir([[74, 53], [74, 37]]), Lx = rng.elegir([2.5, 5]);
      const T1 = TERNA[g1], T2 = TERNA[g2];
      const p1 = Lx / T1.h * T1.op, p2 = Lx / T2.h * T2.op, bien = p1 - p2;
      const m1 = Lx / T1.h * T1.ad, m2 = Lx / T2.h * T2.ad;
      const errores = [
        er('ANG-OTRO', L(Math.abs(m1 - m2), 'm'), 'Bien restar; pero la pared queda frente al ángulo con el piso, no junto a él.'),
        er('APROX-UNA-SOLA', L(p2, 'm'), 'Bien la altura final; falta restarla de la primera.'),
        er('APROX-UNA-SOLA', L(p1, 'm'), 'Bien la altura inicial; falta restarle la final.'),
        er('K-MISMO', L(p1 - T2.op * Lx / T1.h, 'm'), `Bien k con ${g1}°; pero con ${g2}° la escalera tiene ${T2.h} partes: k cambia.`),
      ];
      return {
        variables: Object.assign({ x: { nombre: 'lo que bajó la punta', color: 'f' } }, vars),
        enunciado: ['Una escalera de ', v('a', `${f(Lx)} m`), ' forma ', v('g', `${g1}°`), ' con el piso. Resbala hasta formar ', v('g2', `${g2}°`), '.'],
        pregunta: ['¿Cuántos metros ', v('x', 'bajó su punta'), ' en la pared?'],
        datos: [...TERNA[g1].datos, D.c37, ...(g2 === 53 ? [D.par37] : []), D.k],
        correcta: { clave: L(bien, 'm'), texto: L(bien, 'm') }, errores,
        solucion: [
          [`Con ${g1}°: ${T1.h}k = ${f(Lx)}, k = ${f(Lx / T1.h)}; pared, ${T1.op}k = ${f(p1)} m.`],
          [`Con ${g2}°: ${T2.h}k = ${f(Lx)}, k = ${f(Lx / T2.h)}; pared, ${T2.op}k = ${f(p2)} m.`],
          [`${f(p1)} − ${f(p2)} = `, v('x', L(bien, 'm')), '.'],
        ],
        _datos: { tipo: 'figura-k', idea: 'aproximados', nivel: 3, forma, g1, g2, escalera: Lx, pide: 'baja' },
      };
    }
    // La sombra de un poste de H m con el sol a 37° y después a 53°.
    const H = rng.elegir([6, 12, 24]);
    const s37 = H / 3 * 4, s53 = H / 4 * 3, bien = s37 - s53;
    const errores = [
      er('ANG-OTRO', L(s37 - H, 'm'), 'Bien k con 53°; pero la sombra toca a 53°: 3 partes, no 4.'),
      er('APROX-UNA-SOLA', L(s53, 'm'), 'Bien la sombra con 53°; falta restarla de la sombra con 37°.'),
      er('K-SIN-DIVIDIR', L(H * 4 - H * 3, 'm'), 'Bien las partes de cada sombra; pero antes k = poste ÷ sus partes.'),
    ];
    return {
      variables: Object.assign({ x: { nombre: 'lo que se acortó la sombra', color: 'f' } }, vars),
      enunciado: ['Un poste de ', v('a', `${H} m`), ' da sombra cuando el sol forma ', v('g', '37°'), ' con el suelo. Más tarde forma ', v('g2', '53°'), '.'],
      pregunta: ['¿Cuántos metros ', v('x', 'se acortó la sombra'), '?'],
      datos: [D.c37, D.par37, D.k],
      correcta: { clave: L(bien, 'm'), texto: L(bien, 'm') }, errores,
      solucion: [
        [`Con 37°, el poste queda enfrente: 3k = ${H}, k = ${f(H / 3)}; sombra 4k = ${f(s37)} m.`],
        [`Con 53°, el poste tiene 4 partes: 4k = ${H}, k = ${f(H / 4)}; sombra 3k = ${f(s53)} m.`],
        [`${f(s37)} − ${f(s53)} = `, v('x', L(bien, 'm')), '.'],
      ],
      _datos: { tipo: 'figura-k', idea: 'aproximados', nivel: 3, forma, poste: H, pide: 'acorta' },
    };
  }

  // =============================== Idea 5: complementarias y recíprocas ===============================
  const arg = (m, b) => `${m === 1 ? '' : m}x${b ? ` + ${b}°` : ''}`;
  const entero = x => Number.isFinite(x) && x > 0 && Math.abs(x - Math.round(x)) < 1e-9;
  function cofuncionX(rng) {
    const [r1, r2] = rng.elegir([['sen', 'cos'], ['cos', 'sen'], ['tan', 'cot'], ['cot', 'tan'], ['sec', 'csc'], ['csc', 'sec']]);
    for (;;) {
      const a = rng.entero(1, 3), c = rng.elegir([1, 2, 3].filter(z => z !== a)), x = rng.entero(2, 9) * 2, resto = 90 - (a + c) * x;
      if (resto < 0) continue;
      const b = rng.entero(0, resto), d = resto - b;
      if (a * x + b >= 90 || c * x + d >= 90 || a * x + b <= 0 || c * x + d <= 0) continue;
      const ig = (d - b) / (a - c), m180 = (180 - b - d) / (a + c), sinF = 90 / (a + c);
      if (![ig, m180, sinF].every(entero) || new Set([x, ig, m180, sinF]).size < 4) continue;
      return {
        variables: Object.assign({ x: { nombre: 'la incógnita x', color: 'f' } }, ANG),
        enunciado: [`Se cumple ${r1}(${arg(a, b)}) = ${r2}(${arg(c, d)}), con los dos ángulos agudos.`],
        pregunta: ['¿Cuánto vale ', v('x', 'x'), '?'],
        datos: [D.cof, D.uno, D.agudos],
        correcta: { clave: grados(x), texto: grados(x) },
        errores: [
          er('COMP-IGUALA', grados(ig), 'Bien relacionar los ángulos; igualarlos vale si las razones fueran recíprocas. Aquí son cofunciones: suman 90°.'),
          er('COMP-180', grados(m180), 'Bien sumar los ángulos; pero dos agudos complementarios suman 90°, no 180°.'),
          er('COMP-SIN-FIJOS', grados(sinF), 'Bien sumar a 90°; pero faltaron los grados fijos de cada ángulo.'),
        ],
        solucion: [
          [`${r1} y ${r2} son cofunciones: sus ángulos suman 90°.`],
          [`${arg(a, b)} + ${arg(c, d)} = 90° → ${xCoef(a + c)} = ${90 - b - d}°.`],
          [v('x', `x = ${x}°`), '.'],
        ],
        _datos: { tipo: 'cofuncion-x', idea: 'complementarias', nivel: 2, r1, r2, a, b, c, d, pide: 'x' },
      };
    }
  }

  function reciprocaX(rng) {
    const [r1, r2] = rng.elegir([['tan', 'cot'], ['cot', 'tan'], ['sen', 'csc'], ['csc', 'sen'], ['cos', 'sec'], ['sec', 'cos']]);
    for (;;) {
      const a = rng.entero(1, 3), c = rng.elegir([1, 2, 3].filter(z => z !== a)), x = rng.entero(2, 9) * 2, b = rng.entero(0, 30), d = b + (a - c) * x;
      if (d < 0 || a * x + b >= 90 || c * x + d >= 90) continue;
      const comp = (90 - b - d) / (a + c), m180 = (180 - b - d) / (a + c), sinF = d / (a - c);
      if (![comp, m180, sinF].every(entero) || new Set([x, comp, m180, sinF]).size < 4) continue;
      return {
        variables: Object.assign({ x: { nombre: 'la incógnita x', color: 'f' } }, ANG),
        enunciado: [`Se cumple ${r1}(${arg(a, b)}) · ${r2}(${arg(c, d)}) = 1, con los dos ángulos agudos.`],
        pregunta: ['¿Cuánto vale ', v('x', 'x'), '?'],
        datos: [D.uno, D.cof, D.agudos],
        correcta: { clave: grados(x), texto: grados(x) },
        errores: [
          er('REC-COMPLEMENTO', grados(comp), `Bien relacionar los ángulos; sumar 90° vale para cofunciones. ${r1} · ${r2} = 1 pide el mismo ángulo.`),
          er('COMP-180', grados(m180), 'Bien relacionar los ángulos; pero aquí son recíprocas: los ángulos son iguales.'),
          er('REC-SIN-FIJOS', grados(sinF), 'Bien igualar los ángulos; pero faltó restar los grados fijos del primero.'),
        ],
        solucion: [
          [`${r1} y ${r2} son recíprocas: su producto da 1 con el mismo ángulo.`],
          [`${arg(a, b)} = ${arg(c, d)} → ${a > c ? `${xCoef(a - c)} = ${d - b}°` : `${xCoef(c - a)} = ${b - d}°`}.`],
          [v('x', `x = ${x}°`), '.'],
        ],
        _datos: { tipo: 'reciproca-x', idea: 'complementarias', nivel: 2, r1, r2, a, b, c, d, pide: 'x' },
      };
    }
  }

  // Expresiones con recíprocas de notables (propias; no son las de «Ahora tú» de la teoría).
  const EXPR_REC = [
    [[1, ['csc', 30]], [1, ['sec', 60]], [-1, ['cot', 45]]],
    [[1, ['sec', 45, 2]], [-1, ['cot', 45]]],
    [[1, ['csc', 30], ['cos', 60]], [1, ['cot', 45]]],
    [[1, ['cot', 30], ['tan', 60]], [-1, ['csc', 45, 2]]],
    [[1, ['csc', 60], ['sen', 60]], [1, ['sec', 30, 2]]],
    [[1, ['cot', 60]], [1, ['tan', 30]]],
    [[1, ['csc', 60]], [1, ['cot', 30]]],
    [[2, ['sec', 60]], [-1, ['csc', 30], ['sen', 30]]],
    [[1, ['sec', 30], ['cos', 60]], [1, ['csc', 60], ['sen', 30]]],
  ];
  function reciprocaNotable(rng) {
    for (;;) {
      const e = rng.elegir(EXPR_REC), bien = Ex.txt(ev(e)), cuad = e.some(([, ...fs]) => fs.some(fa => fa[2] === 2));
      const errores = [
        er('REC-NO-INVIERTE', Ex.txt(ev(e, MAL.noInvierte)), 'Bien reemplazar cada razón; pero sec, csc y cot dan vuelta el cociente de cos, sen y tan.'),
        er('REC-PAREJA', Ex.txt(ev(e, MAL.pareja)), 'Bien dar vuelta el cociente; pero sec da vuelta al coseno y csc, al seno.'),
        er('NOT-MISMO', Ex.txt(ev(e, MAL.cambia)), 'Bien usar las figuras; pero tomaste el cateto del otro ángulo agudo.'),
        er('REC-INVERSA', Ex.txt(ev(e, MAL.inversa)), 'Bien las recíprocas; pero sen, cos y tan quedaron al revés.'),
      ];
      if (new Set([bien, ...errores.map(x => x.clave)]).size < 4) continue;
      return {
        variables: Object.assign({ x: { nombre: 'la expresión', color: 'f' } }, ANG),
        enunciado: ['Sin calculadora.'],
        pregunta: ['¿Cuánto vale ', v('x', exprTxt(e)), '?'],
        datos: [D.rec, D.t30, D.t45, D.racio, ...(cuad ? [D.pot] : [])],
        correcta: { clave: bien, texto: bien }, errores,
        solucion: [
          ['sec, csc y cot dan vuelta a cos, sen y tan, del mismo ángulo.'],
          [`${exprTxt(e)} = `, v('x', bien), '.'],
        ],
        _datos: { tipo: 'reciproca-notable', idea: 'complementarias', nivel: 2, expresion: exprTxt(e), pide: exprTxt(e) },
      };
    }
  }

  function complemento(rng) {
    const [p, q, h] = rng.elegir(TERNAS.slice(0, 4)), [co, ca] = rng.moneda() ? [p, q] : [q, p];
    const dada = rng.elegir(['sen', 'cos', 'tan']), pide = rng.elegir(['sec', 'csc', 'cot', 'tan']);
    const R = { sen: [co, h], cos: [ca, h], tan: [co, ca], cot: [ca, co], sec: [h, ca], csc: [h, co] };
    // Razón de 90° − θ: su cofunción de θ.
    const COF = { sec: 'csc', csc: 'sec', cot: 'tan', tan: 'cot' }, NOINV = { sec: 'sen', csc: 'cos', cot: 'cot', tan: 'tan' };
    const bien = fr(...R[COF[pide]]);
    // El lado que falta, sumando o restando largos (PIT-LINEAL).
    const mal = { co, ca, h };
    if (dada === 'sen') mal.ca = h - co; else if (dada === 'cos') mal.co = h - ca; else mal.h = co + ca;
    const Rm = { sen: [mal.co, mal.h], cos: [mal.ca, mal.h], tan: [mal.co, mal.ca], cot: [mal.ca, mal.co], sec: [mal.h, mal.ca], csc: [mal.h, mal.co] };
    const errores = [
      er('COMP-MISMO-ANG', fr(...R[pide]), `Bien calculado ${pide} θ; pero se pide del otro ángulo, 90° − θ.`),
      ...(pide === 'sec' || pide === 'csc' ? [er('REC-NO-INVIERTE', fr(...R[NOINV[pide]]), 'Bien pasar al otro ángulo; pero falta dar vuelta el cociente.')] : []),
      er('PIT-LINEAL', fr(...Rm[COF[pide]]), 'Bien la cofunción; pero el lado que falta sale de Pitágoras, con cuadrados.'),
      er('COMP-DATO', fr(...R[dada]), `Bien: ${dada} θ es el dato. Pero se pide otra razón.`),
      er('REC-INVERSA', fr(...[...R[COF[pide]]].reverse()), 'Bien la cofunción; pero el cociente quedó al revés.'),
    ];
    const lado = { sen: 'CA', cos: 'CO', tan: 'H' }[dada];
    const pit = dada === 'tan' ? `H = √(${co}² + ${ca}²) = ${h}` : `${lado} = √(${h}² − ${dada === 'sen' ? co : ca}²) = ${dada === 'sen' ? ca : co}`;
    return {
      variables: Object.assign({ x: { nombre: `${pide}(90° − θ)`, color: 'f' }, a: { nombre: `${dada} θ`, color: 'o' } }, ANG),
      enunciado: [`En un triángulo rectángulo, ${dada} θ = `, v('a', fr(...R[dada])), ', con θ agudo.'],
      pregunta: ['¿Cuánto vale ', v('x', `${pide}(90° − θ)`), '?'],
      datos: [D.razones('θ'), D.rec, D.cof, D.pita],
      correcta: { clave: bien, texto: bien }, errores,
      solucion: [
        [`Por cofunción, ${pide}(90° − θ) = ${COF[pide]} θ.`],
        [`Lados: ${pit}.`],
        [`${COF[pide]} θ = ${cocienteTxt(...R[COF[pide]])}`, v('x', bien), '.'],
      ],
      _datos: { tipo: 'complemento', idea: 'complementarias', nivel: 3, co, ca, h, dada, pide: `${pide}(90° − θ)` },
    };
  }

  // =============================== Armado ===============================
  const TIPOS = {
    vertices, 'lado-objeto': ladoObjeto, 'suma-nombres': sumaNombres,
    'razon-lados': razonLados, semejante, 'otra-razon': otraRazon, 'razon-figura': razonFigura,
    'valor-notable': valorNotable, 'reconoce-angulo': reconoceAngulo, 'expresion-notable': expresionNotable,
    'razon-convencion': razonConvencion, 'lado-k': ladoK, 'figura-k': figuraK,
    'cofuncion-x': cofuncionX, 'reciproca-x': reciprocaX, 'reciproca-notable': reciprocaNotable, complemento,
  };
  const IDEAS = {
    'lados-desde-angulo': ['vertices', 'lado-objeto', 'suma-nombres'],
    'razon-cociente': ['razon-lados', 'semejante', 'otra-razon', 'razon-figura'],
    notables: ['valor-notable', 'reconoce-angulo', 'expresion-notable'],
    aproximados: ['razon-convencion', 'lado-k', 'figura-k'],
    complementarias: ['cofuncion-x', 'reciproca-x', 'reciproca-notable', 'complemento'],
  };
  // Papel (regla 6; herramientas/papel-generador.js usa «papel-1» a «papel-8»: 3 básicos, 3 intermedios y 2 avanzados).
  const PAPEL = { 'papel-1': 'vertices', 'papel-2': 'valor-notable', 'papel-3': 'razon-convencion', 'papel-4': 'lado-objeto',
    'papel-5': 'otra-razon', 'papel-6': 'cofuncion-x', 'papel-7': 'expresion-notable', 'papel-8': 'complemento' };

  // θ y α siempre en carmín (molde §5b): cada texto se parte en sus letras de ángulo, también dentro de lo que se pide.
  const ANGULO = /(θ|α)/;
  const conAngulos = linea => linea.flatMap(x => {
    if (typeof x === 'string') return x.split(ANGULO).filter(Boolean).map(t => (t === 'θ' ? TH : t === 'α' ? AL : t));
    if (x && typeof x === 'object' && x.v !== 't' && x.v !== 'al' && ANGULO.test(x.t)) return x.t.split(ANGULO).filter(Boolean).map(t => (t === 'θ' ? TH : t === 'α' ? AL : v(x.v, t)));
    return [x];
  });
  // Escala de los distractores (decisión de Gerson, 12 nov): entre 1/20 y 20 veces la correcta.
  const numDe = t => {
    let s = String(t).replace(/\s*(cm|m|°)$/, '').trim(), den = 1;
    const m = s.match(/^\((.+)\)\/(\d+)$/) || s.match(/^([^()]+)\/(\d+)$/);
    if (m) { s = m[1]; den = +m[2]; }
    let tot = 0;
    for (const q0 of s.replace(/ − /g, ' + −').split(' + ')) {
      let q = q0.trim(), sg = 1;
      if (q.startsWith('−')) { sg = -1; q = q.slice(1); }
      const mm = q.match(/^(\d+(?:,\d+)?)?(?:√(\d+))?$/);
      if (!mm || (!mm[1] && !mm[2])) return NaN;
      tot += sg * (mm[1] ? Number(mm[1].replace(',', '.')) : 1) * (mm[2] ? Math.sqrt(+mm[2]) : 1);
    }
    return tot / den;
  };
  const enEscala = (t, c) => { const a = numDe(t), b = numDe(c); if (!Number.isFinite(a) || !Number.isFinite(b) || b === 0) return true; const r = Math.abs(a / b); return r >= 1 / 20 && r <= 20; };

  function generar(semilla, opciones = {}) {
    const rng = Azar.crear(`${ID}|${semilla}`);
    // Una idea al azar y, dentro de ella, un tipo: cada idea sale una de cada cinco veces. { idea } fija la idea.
    const fijo = PAPEL[String(semilla)] || opciones.tipo;
    const idea = opciones.idea && IDEAS[opciones.idea] ? opciones.idea : rng.elegir(Object.keys(IDEAS));
    const tipo = fijo || rng.elegir(IDEAS[idea]);
    for (let intento = 0; intento < 200; intento++) {
      const pr = TIPOS[tipo](rng);
      const errores = pr.errores.filter(x => x.clave !== pr.correcta.clave && enEscala(x.texto, pr.correcta.texto) && numDe(x.texto) !== 0);
      const alternativas = P.armarTexto({ correcta: pr.correcta, errores, rng });
      if (alternativas.length < 4) continue;
      return Object.assign({
        id: `${ID}#${semilla}`, variables: Object.assign({}, ANG, pr.variables), enunciado: conAngulos(pr.enunciado), pregunta: conAngulos(pr.pregunta), datos: pr.datos,
        alternativas, solucion: pr.solucion.map(conAngulos), respuesta: { valor: pr.correcta.clave, unidad: '' }, _datos: pr._datos,
      }, pr.extra || {});
    }
    throw new Error(`${ID}: no se pudo generar un problema con 4 alternativas distintas (${tipo})`);
  }

  return { id: ID, titulo: 'Razones trigonométricas de ángulos agudos', generar, TIPOS: Object.keys(TIPOS), IDEAS };
});
