/*
 * Generador «Segmentos y ángulos»: la práctica de las seis ideas de geometria.segmentos-y-angulos
 * (contenido/teoria/geometria/segmentos-y-angulos.js). Formato "predicciones" (docs/arquitectura.md). Funciona en el
 * navegador (window.Generadores['geo-segmentos-angulos']) y en Node (require). Propuesta: docs/etapa3/propuesta-geometria.md
 * §7 (aprobada) y docs/etapa3/decisiones.md, que manda.
 *
 * Tipos por idea (nivel 1: un paso; 2: dos pasos; 3: de examen):
 *   suma-de-segmentos  tramo-orden (1): puntos en orden, el tramo que queda (AD − AB − CD, o AC − AB) · entre (1): cuál
 *                      de tres puntos está entre los otros dos (sin figura: diría la respuesta) · pisan (2): AC, BD y AD,
 *                      el tramo común BC · razon (2): AB : BC = m : n con k, una parte o el todo · examen-seg (3): solo se
 *                      sabe AC + BD, o CD es el doble de AB
 *   punto-medio        mitad (1): AM y MB con x, AB o AM · medio-entre (2): B entre A y C, BM con AB y BC · afuera (2):
 *                      O fuera del segmento, OM · dos-medios (3): M y N medios de AB y CD, MN con AC y BD o con AD y BC ·
 *                      equidistante (3): BM con AB − BC (como San Marcos 2025-II)
 *   abertura           clase (1): la clase de la suma de dos consecutivos · reloj (1): el convexo de las agujas a una hora
 *                      en punto · consec-x (2): consecutivos con x · pisan-ang (2): ∠AOC y ∠BOD que se pisan, ∠BOC ·
 *                      vuelta (3): cuatro ángulos alrededor de un punto, proporcionales a cuatro números
 *   bisectrices        comp-sup (1): el ángulo que falta en un recto o en una recta · veces-x (2): C(x) o S(x) es m veces
 *                      x · cadena (2): S(C(x)) o C(S(x)) dado · bisect (2): el ángulo entre dos bisectrices · veces-cs (3):
 *                      S(x) = m · C(x), o S(x) + C(x) = k · x · maximo (3): el mayor entero con un agudo (como San
 *                      Marcos 2026-I)
 *   paralelas          par (1): un ángulo dado y x en otro lugar, o el compañero de un par nombrado · ecuacion (2): dos
 *                      expresiones en x · son-paralelas (3): ¿son paralelas? con dos ángulos · girada (3): la figura
 *                      girada, se pide la medida y no x
 *   quiebre            quiebre (1): el quiebre con a y b · quiebre-veces (2): un tramo es m veces el otro · quiebre-afuera
 *                      (2): un ángulo medido del otro lado · serrucho (3): dos quiebres, se pide uno
 *
 * Datos (docs/plan-calidad.md §3, punto 13; docs/molde-unidad.md §4): una línea por dato, las mismas definiciones y
 * reglas de la teoría (D_ENTRE, la suma de tramos, la razón con k, el punto medio, consecutivos, clases, C(x), S(x),
 * bisectriz, los pares entre paralelas, la paralela auxiliar), nunca el paso hecho ni el atajo («MN es la semisuma»).
 * Notación (decisiones): m∠AOB para la medida; C(x) y S(x) para complemento y suplemento, sin puntos C ni S en esas
 * figuras; L₁ y L₂ (el subíndice de verdad, U+2081, igual en el texto, la figura y el papel). Letras y grados (cuarta
 * ronda, 18 nov: «x sin °», como la teoría): x, y, k, a, b y m valen un número y van sin «°», ellas y su valor
 * («m∠AOB = 3x + 29°», «x = 17»); el grado va en lo que se mide («m∠AOB = 80°»). El lado que queda solo con la letra
 * deja al otro sin grado («4x = 160», «x < 25»), y al reemplazar la letra se cambia por su número («3 · 17 + 29°»). Si se
 * pide x (o a), las alternativas son números (fmt: num); si se pide un ángulo, medidas con grado (fmt: gr).
 *
 * Colores: la regla de la unidad (comentario de cabecera de la teoría; molde §5b). Segmentos: el todo en tinta, los
 * tramos que se juntan naranja (o) el primero de izquierda a derecha y turquesa (i) el segundo, como los pinta la pieza
 * geo-objeto (aquí se calcula igual y generador.test.js lo compara con la pieza); lo que se pide con «?» en tinta. Ángulos:
 * todo ángulo dado en carmín (h) en la figura y lo pedido («?», x) en tinta, para que el color no diga si es igual o
 * suplementario; en el texto, los ángulos en tinta, como en los ejercicios de la teoría. El violeta (f) va solo en el
 * resultado de la solución: nunca en la figura ni en el enunciado. Sin figura (qué punto está entre los otros dos), ningún
 * tramo lleva color.
 *
 * Figuras a escala (molde §6): los segmentos con la pieza geo-objeto (recta o carretera; los puntos en su medida). Los
 * ángulos con geo-figura, que el navegador carga sola (geo-objeto la necesita para sus escenas con ángulos y la práctica
 * carga una sola pieza): cada ángulo se dibuja con su valor real y su rótulo se pone aquí, sobre su bisectriz o en el hueco
 * más ancho, lejos de los lados, de las letras y de los otros arcos; si un rótulo no cabe, se arma otro caso. Un ángulo
 * recto que se pide se dibuja con arco (sin el cuadradito, que diría 90°).
 *
 * Errores (respaldo: todos hipótesis de aula, sin medir): GE17-a y GE17-b, las dos mitades de GE17 (docs/investigacion/
 * geometria-ideas-erroneas.md, «lo que no tiene respaldo»), y los códigos de la teoría donde coinciden (GE-SEG, GE-RAZ,
 * GE-PM, GE-ANG, GE-CS, GE-BIS, GE-PAR, GE-QB). Nuevos aquí: GE-SEG15 quita uno solo de los tramos que sobran, GE-SEG16 da
 * lo que se quita y no lo que queda, GE-SEG17 reparte en partes iguales sin mirar las medidas, GE-SEG18 se queda con uno de
 * los tramos, GE-PM7 se queda en x, GE-PM8 resta el tramo del medio en vez de sumarlo, GE-PM9 dobla la suma que ya era el
 * todo, GE-PM10 da el todo en vez de la mitad, GE-ANG13 cuenta dos veces el ángulo común, GE-ANG14 parte la suma entre dos, GE-ANG15 toma el arco sin dividir
 * la vuelta, GE-CS7 copia el ángulo dado, GE-CS8 resta de una vuelta, GE-CS9 ignora una de las dos operaciones, GE-CS10
 * suma donde falta un ángulo, GE-CS11 resta x una sola vez, GE-BIS4 toma la mitad de uno solo, GE-BIS5 cree que entre
 * bisectrices siempre hay 90°, GE-RAZ4 multiplica la medida por las partes sin hallar k, GE-ANG16 divide antes de restar,
 * GE-ANG17 parte entre dos lo que ya era el ángulo, GE-PAR7 pasa un número sin cambiarle el signo. Ninguna explicación nombra una alternativa por su letra (las figuras tienen puntos con
 * letras); cada una empieza por lo que el alumno hizo bien.
 * Cuentas comprobadas con un script aparte (casos.json, «verificacion») y con el recálculo de generador.test.js, que usa
 * el motor de la escena segmentos-angulos (otro código) y las coordenadas de las figuras.
 */
(function (root, fabrica) {
  const nodo = typeof module === 'object' && module.exports;
  const api = fabrica(nodo ? require('../../nucleo/azar.js') : root.Azar,
                      nodo ? require('../../nucleo/predicciones.js') : root.Predicciones);
  if (nodo) module.exports = api;
  else (root.Generadores = root.Generadores || {})[api.id] = api;
})(typeof self !== 'undefined' ? self : this, function (Azar, P) {
  'use strict';
  const ID = 'geo-segmentos-angulos';
  const FUENTE = 'docs/investigacion/geometria-ideas-erroneas.md';
  const v = P.v;
  const f = x => P.formatear(x, 2);
  const gr = x => `${f(x)}°`;
  // Lo que vale una letra es un número: sin «°» (decisiones, cuarta ronda).
  const num = x => f(x);
  const RAD = Math.PI / 180;
  const er = (id, valor, explicacion) => ({ id, valor, explicacion, respaldo: 'hipotesis', fuente: /^GE17/.test(id) ? FUENTE : null });
  const erT = (id, texto, explicacion) => Object.assign(er(id, null, explicacion), { clave: texto, texto });
  const x2 = (a, b) => `${a === 1 ? '' : a}x`;
  // «2x + 10°», «x − 5°», «3x»: una expresión en x con grados.
  const exG = (a, b) => `${a === 1 ? '' : a}x${b ? ` ${b < 0 ? '−' : '+'} ${Math.abs(b)}°` : ''}`;
  // «3 · 25 + 15°», «25 − 5°»: la expresión con x ya reemplazado (x es un número; el grado, en el número que se suma).
  const conX = (a, b, x) => `${a === 1 ? '' : `${a} · `}${x}${b ? ` ${b < 0 ? '−' : '+'} ${Math.abs(b)}°` : ''}`;
  // «3x + 20° = 110°», o «3x = 110» si no queda número que sumar: el lado solo con la letra deja al otro sin grado.
  const igualG = (a, b, t, op = '=') => `${exG(a, b)} ${op} ${t}${b ? '°' : ''}`;
  const exU = (a, b) => `${a === 1 ? '' : a}x${b ? ` ${b < 0 ? '−' : '+'} ${Math.abs(b)}` : ''}`;

  // ---------- Datos (una línea cada uno; las de la teoría) ----------
  const D = {
    entre: 'Un punto está entre otros dos si sus dos tramos suman el tramo de punta a punta.',
    orden: ls => `Con puntos en orden, cada medida es la suma de sus tramos: ${ls[0]}${ls[ls.length - 1]} = ${ls.slice(1).map((l, i) => `${ls[i]}${l}`).join(' + ')}.`,
    entreDe: (X, Y, Z) => `${Y} entre ${X} y ${Z}: ${X}${Y} + ${Y}${Z} = ${X}${Z}.`,
    razon: (m, n) => `Razón AB : BC = ${m} : ${n}: AB = ${m}k y BC = ${n}k, con k la medida de una parte.`,
    medio: (M, X, Y) => `${M} es el punto medio de ${X}${Y}: está entre ${X} y ${Y}, y ${X}${M} = ${M}${Y}.`,
    suma: 'Con puntos en orden, cada tramo largo es la suma de los tramos que lo forman.',
    equi: 'M equidistante de A y C, y entre ellos: AM = MC = AC/2.',
    consec: (a, b, c) => `Consecutivos: m∠${a}O${c} = m∠${a}O${b} + m∠${b}O${c}.`,
    consecSuman: 'Consecutivos: sus medidas se suman.',
    clases: 'Agudo: menos de 90°. Recto: 90°. Obtuso: entre 90° y 180°. Llano: 180°. No convexo: más de 180°.',
    vuelta: 'Una vuelta completa: 360°.',
    reloj: 'El reloj tiene 12 números a igual distancia.',
    convexo: 'El ángulo convexo de las agujas es el del lado corto: menos de 180°.',
    C: 'Complemento: C(x) = 90° − x, si x < 90.',
    S: 'Suplemento: S(x) = 180° − x, si x < 180.',
    recto: 'Un ángulo recto mide 90°.',
    llano: 'Tres puntos en una recta, con O en medio: m∠AOE = 180°.',
    bis: 'La bisectriz parte un ángulo en dos ángulos iguales.',
    agudo: 'Agudo: más de 0° y menos de 90°.',
    iguales: 'Entre paralelas: correspondientes, alternos internos y alternos externos son iguales.',
    suman: 'Entre paralelas: conjugados internos y conjugados externos suman 180°.',
    cruce: 'En un cruce: opuestos por el vértice iguales; vecinos, suman 180°.',
    reves: 'Al revés: si un par cumple su regla, las rectas son paralelas.',
    quiebre: 'Por V se puede trazar una paralela a las dos rectas.',
    alt: 'Entre paralelas, los alternos internos son iguales.',
    vecinos: 'En P, los dos ángulos vecinos suman 180°.',
    serrucho: 'Por M y por N se pueden trazar paralelas a las rectas.',
    cadaQuiebre: 'Cada quiebre mide la suma de los ángulos de sus tramos con una paralela.',
  };

  // ======================= Segmentos: figura con la pieza geo-objeto =======================
  // El color de cada tramo sale de su papel, igual que en geo-objeto: los «dato», de izquierda a derecha (primero el que
  // empieza antes; si empiezan juntos, el que acaba antes), naranja, turquesa y verde; lo demás en tinta.
  const COLORES_DATO = ['o', 'i', 'd'];
  function colores(F) {
    const km = id => F.puntos.find(p => p.id === id).km, out = {};
    F.tramos.filter(t => (t.papel || 'dato') === 'dato').map(t => ({ t, lo: Math.min(km(t.de), km(t.a)), hi: Math.max(km(t.de), km(t.a)) }))
      .sort((a, b) => a.lo - b.lo || a.hi - b.hi).forEach((x, k) => { out[x.t.de + x.t.a] = COLORES_DATO[Math.min(k, 2)]; });
    return out;
  }
  const clave = s => s.split('').sort().join('');
  // El nombre de un tramo en el texto, con el color que tiene en la figura (o en tinta).
  function pintor(F) {
    const cs = colores(F), vars = {};
    const pinta = nom => {
      const k = Object.keys(cs).find(t => clave(t) === clave(nom));
      if (!k) return nom;
      vars[nom] = { nombre: `el tramo ${nom}`, color: cs[k] };
      return v(nom, nom);
    };
    return { pinta, vars };
  }
  const pto = (id, km) => ({ id, km });
  const tr = (de, a, texto, nivel, papel, marcas) => Object.assign({ de, a, texto, nivel }, papel ? { papel } : {}, marcas ? { marcas } : {});
  const segEsc = F => ({ escena: { pieza: 'geo-objeto', datos: F } });

  // ¿Caben las cotas? (las mismas medidas que geo-objeto: puntos entre x = 22 y 298, margen de 7 % del largo). Dos rótulos
  // de un mismo nivel no se pisan y ninguno es mucho más ancho que su tramo.
  const ANCHO = 320, ME = 4;
  function ancho(t, peso = 700) {
    let w = 0;
    for (const ch of String(t)) w += /\s/.test(ch) ? 0.28 : /[0-9]/.test(ch) ? 0.56 : /[ilI.,:;'|!]/.test(ch) ? 0.28 : /[mwMW%]/.test(ch) ? 0.82 : 0.55;
    return w * 16 * (peso >= 600 ? 1.05 : 1);
  }
  function cotasCaben(F) {
    const kms = F.puntos.map(p => p.km), lo = Math.min(...kms), hi = Math.max(...kms), pad = Math.max(0.6, (hi - lo) * 0.07);
    const s = 276 / (hi - lo + 2 * pad), X = km => 160 + (km - (lo + hi) / 2) * s, km = id => F.puntos.find(p => p.id === id).km;
    const cajas = [];
    for (const t of F.tramos) {
      if (!t.texto || t.nivel === 0) continue;
      const a = X(km(t.de)), b = X(km(t.a)), w = ancho(t.texto), c = (a + b) / 2;
      if (w > Math.abs(b - a) + 14) return false;
      if (c - w / 2 < ME || c + w / 2 > ANCHO - ME) return false;
      for (const q of cajas) if (q.nivel === t.nivel && c - w / 2 < q.x1 + 6 && q.x0 < c + w / 2 + 6) return false;
      cajas.push({ nivel: t.nivel, x0: c - w / 2, x1: c + w / 2 });
    }
    // Letras de los puntos: dos puntos muy juntos se reparten; se pide que estén a 16 px o más.
    const xs = F.puntos.map(p => X(p.km)).sort((p, q) => p - q);
    for (let i = 1; i < xs.length; i++) if (xs[i] - xs[i - 1] < 16) return false;
    return true;
  }

  // ¿Caben las rayitas de «miden igual»? La misma cuenta que geo-objeto (marcas). Desde la ronda 2 del lector (18 nov), cada
  // grupo de rayitas va en la cima de un arco (una llave de esquinas redondas) que une las puntas de su tramo, 22 px sobre
  // la línea, y 20 px más arriba si su tramo contiene a otro marcado: con la rayita sobre la línea, un punto que partía el
  // tramo cambiaba qué tramo se leía («AM = BC»). Se pide 10 px o más de cada punto, de las rayitas de otro grupo y de
  // otro arco. generador.test.js compara esta respuesta con la de la pieza.
  const HOLGURA_MARCA = 10, ALTO_ARCO = 22, PASO_ARCO = 20, DY = 5, RP = 5.5, BOT = 140;
  function marcasCaben(F) {
    const ts = F.tramos.filter(t => t.nivel === 0 && t.marcas > 0);
    if (!ts.length) return true;
    const kms = F.puntos.map(p => p.km), lo = Math.min(...kms), hi = Math.max(...kms), pad = Math.max(0.6, (hi - lo || 1) * 0.07);
    const s = 276 / (hi - lo + 2 * pad), X = km => 160 + (km - (lo + hi) / 2) * s, xDe = id => X(F.puntos.find(p => p.id === id).km);
    const xs = F.puntos.map(p => X(p.km)), hw = t => (t.marcas - 1) * 3 + 4;
    const ext = t => [Math.min(xDe(t.de), xDe(t.a)), Math.max(xDe(t.de), xDe(t.a))];
    const dentro = (u, t) => { const [a, b] = ext(t), [c, e] = ext(u); return u !== t && c >= a - 0.5 && e <= b + 0.5 && e - c < b - a - 0.5; };
    const prof = t => Math.max(0, ...ts.filter(u => dentro(u, t)).map(u => prof(u) + 1));
    const alto = k => ALTO_ARCO + PASO_ARCO * Math.max(...ts.filter(t => t.marcas === k).map(prof));
    const ps = ts.map(t => {
      const [a, b] = ext(t), al = alto(t.marcas), m = Math.min(4, (b - a) / 6), x0 = a + m, x1 = b - m, cima = BOT - al, r = Math.min(7, (x1 - x0) / 2, BOT - 6 - cima);
      const yEn = x => { if (x < x0 || x > x1) return null; const dx = x < x0 + r ? x0 + r - x : x > x1 - r ? x - (x1 - r) : 0; return cima + r - Math.sqrt(Math.max(0, r * r - dx * dx)); };
      return { t, x: (a + b) / 2, y: cima, hw: hw(t), yEn };
    });
    return ps.every(z => {
      let h = Infinity;
      for (const x of xs) h = Math.min(h, Math.max(Math.abs(z.x - x) - z.hw - RP, BOT - z.y - DY - RP));
      for (const w of ps) {
        if (w === z) continue;
        if (w.t.marcas !== z.t.marcas) h = Math.min(h, Math.max(Math.abs(z.x - w.x) - z.hw - w.hw, Math.abs(z.y - w.y) - 2 * DY));
        for (const x of [z.x - z.hw, z.x, z.x + z.hw]) { const y = w.yEn(x); if (y !== null) h = Math.min(h, Math.abs(y - z.y) - DY); }
      }
      return h >= HOLGURA_MARCA;
    });
  }

  // Lugares: carretera en km, avenida en metros (de 100 en 100) o una recta de examen en cm.
  const LUG = [
    { objeto: 'carretera', lugar: 'una carretera recta', cosa: 'paradero', cosas: 'paraderos', u: 'km', k: 1 },
    { objeto: 'carretera', lugar: 'una avenida recta', cosa: 'paradero', cosas: 'paraderos', u: 'm', k: 100 },
    { objeto: 'recta', lugar: 'una recta', cosa: 'punto', cosas: 'puntos', u: 'cm', k: 1 },
  ];
  // Sin cortes dentro de una medida: «1 200 m» con espacios duros (el número y su unidad no se parten en el celular).
  const med = (x, u) => `${f(x)} ${u}`.replace(/ /g, '\u00a0');

  // =============================== Idea 1: suma de segmentos ===============================
  function tramoOrden(rng) {
    const L = rng.elegir(LUG), u = L.u, K = L.k, m = x => med(x * K, u);
    if (rng.moneda()) {
      // Cuatro puntos: AD, AB y CD; se pide BC.
      const a = rng.entero(2, 9), b = rng.entero(2, 9), c = rng.entero(2, 9), t = a + b + c;
      const F = { objeto: L.objeto, puntos: [pto('A', 0), pto('B', a * K), pto('C', (a + b) * K), pto('D', t * K)],
        tramos: [tr('A', 'B', m(a), 1), tr('B', 'C', '?', 1, 'pide'), tr('C', 'D', m(c), 1), tr('A', 'D', m(t), -1, 'todo')] };
      const { pinta, vars } = pintor(F), AB = pinta('AB'), CD = pinta('CD');
      return {
        variables: vars, F,
        enunciado: [`A, B, C y D son ${L.cosas} de ${L.lugar}, en ese orden. AD = ${m(t)}, `, AB, ` = ${m(a)} y `, CD, ` = ${m(c)}.`],
        pregunta: ['¿Cuánto mide BC?'],
        datos: [D.orden(['A', 'B', 'C', 'D'])],
        correcta: b * K, fmt: x => med(x, u),
        errores: [
          er('GE-SEG15', (t - a) * K, 'Bien quitarle AB a AD; falta quitarle también CD.'),
          er('GE-SEG15', (t - c) * K, 'Bien quitarle CD a AD; falta quitarle también AB.'),
          er('GE-SEG16', (a + c) * K, 'Bien juntar AB y CD; pero eso es lo que sobra, no lo que queda.'),
          er('GE-SEG12', b * K / 2, 'Bien la resta AD − AB − CD; lo que queda ya es BC, sin partirlo.'),
        ],
        solucion: [['BC es lo que queda de AD sin ', AB, ' ni ', CD, '.'], ['BC = ', `${f(t * K)} − ${f(a * K)} − ${f(c * K)} = `, v('x', m(b)), '.']],
        _datos: { tipo: 'tramo-orden', idea: 'suma-de-segmentos', nivel: 1, sub: 'cuatro', K, u, puntos: { A: 0, B: a * K, C: (a + b) * K, D: t * K }, pide: 'BC' },
      };
    }
    // Tres puntos: AC y AB; se pide BC.
    const a = rng.entero(2, 12), b = rng.entero(2, 12), t = a + b;
    const F = { objeto: L.objeto, puntos: [pto('A', 0), pto('B', a * K), pto('C', t * K)],
      tramos: [tr('A', 'B', m(a), 1), tr('B', 'C', '?', 1, 'pide'), tr('A', 'C', m(t), -1, 'todo')] };
    const { pinta, vars } = pintor(F), AB = pinta('AB');
    return {
      variables: vars, F,
      enunciado: [`A, B y C son ${L.cosas} de ${L.lugar}, en ese orden. AC = ${m(t)} y `, AB, ` = ${m(a)}.`],
      pregunta: ['¿Cuánto mide BC?'],
      datos: [D.entreDe('A', 'B', 'C')],
      correcta: b * K, fmt: x => med(x, u),
      errores: [
        er('GE-SEG1', (t + a) * K, 'Bien usar AC y AB; pero AB ya está dentro de AC: se resta, no se suma.'),
        er('GE-SEG17', t * K / 2, 'Bien partir AC; pero B no está en el medio: las dos partes no miden igual.'),
        er('GE-SEG18', a * K, 'Bien: AB es un tramo de AC. Pero se pide el otro, BC.'),
        er('GE-SEG12', b * K / 2, 'Bien restar AC − AB; lo que queda ya es BC, sin partirlo.'),
      ],
      solucion: [['B está entre A y C: ', AB, ' y BC juntos hacen AC.'], ['BC = ', `${f(t * K)} − ${f(a * K)} = `, v('x', m(b)), '.']],
      _datos: { tipo: 'tramo-orden', idea: 'suma-de-segmentos', nivel: 1, sub: 'tres', K, u, puntos: { A: 0, B: a * K, C: t * K }, pide: 'BC' },
    };
  }

  const LETRAS = [['A', 'B', 'C'], ['P', 'Q', 'R'], ['M', 'N', 'T']];
  function entre(rng) {
    const L = rng.elegir([LUG[0], LUG[2]]), ls = rng.elegir(LETRAS), orden = rng.elegir([[0, 1, 2], [1, 0, 2], [0, 2, 1]]);
    const Y = ls[orden[0]], X = ls[orden[1]], Z = ls[orden[2]];
    const p = rng.entero(2, 9), q0 = rng.entero(2, 9), q = q0 === p ? p + 1 : q0;
    const dist = { [Y + X]: p, [X + Y]: p, [X + Z]: q, [Z + X]: q, [Y + Z]: p + q, [Z + Y]: p + q };
    const [L1, L2, L3] = ls, mayor = [Y, Z].sort().join(''), cosa = L.cosa === 'punto' ? 'el punto' : 'el paradero';
    const txt = l => `${L.cosa === 'punto' ? 'El punto' : 'El paradero'} ${l}`;
    const errores = ls.filter(l => l !== X).map(l => (l === L2
      ? erT('GE-SEG8', txt(l), 'Bien pensar en el orden; pero lo dicen las medidas, no el orden de las letras.')
      : erT('GE-SEG7', txt(l), `Bien buscar el tramo más largo, ${mayor}; pero ${cosa} ${l} es una de sus puntas.`)));
    errores.push(erT('GE-SEG9', 'Ninguno de los tres', 'Bien desconfiar sin el orden dicho; pero dos tramos que suman el tercero lo deciden.'));
    return {
      variables: {},
      enunciado: [`En ${L.lugar} hay tres ${L.cosas}: ${L1}, ${L2} y ${L3}. ${L1}${L2} = ${med(dist[L1 + L2], L.u)}, ${L2}${L3} = ${med(dist[L2 + L3], L.u)} y ${L1}${L3} = ${med(dist[L1 + L3], L.u)}.`],
      pregunta: ['¿Cuál de los tres está entre los otros dos?'],
      datos: [D.entre],
      texto: { correcta: { clave: txt(X), texto: txt(X) }, errores },
      solucion: [[`El tramo más largo, ${mayor} = ${med(p + q, L.u)}, va de punta a punta.`], [`Compruebo: ${[Y, X].sort().join('')} + ${[X, Z].sort().join('')} = ${p} + ${q} = ${p + q}.`], [`Está en medio ${cosa} `, v('x', X), '.']],
      _datos: { tipo: 'entre', idea: 'suma-de-segmentos', nivel: 1, distancias: { [L1 + L2]: dist[L1 + L2], [L2 + L3]: dist[L2 + L3], [L1 + L3]: dist[L1 + L3] }, pide: 'el del medio' },
    };
  }

  function cuatroPuntos(L, a, b, c) { const K = L.k; return [pto('A', 0), pto('B', a * K), pto('C', (a + b) * K), pto('D', (a + b + c) * K)]; }
  function pisan(rng) {
    const L = rng.elegir(LUG), u = L.u, K = L.k, m = x => med(x * K, u);
    const a = rng.entero(2, 9), b = rng.entero(2, 9), c = rng.entero(2, 9), p = a + b, q = b + c, t = a + b + c;
    const F = { objeto: L.objeto, puntos: cuatroPuntos(L, a, b, c),
      tramos: [tr('B', 'C', '?', 1, 'pide'), tr('A', 'C', m(p), 2), tr('B', 'D', m(q), 3), tr('A', 'D', m(t), -1, 'todo')] };
    const { pinta, vars } = pintor(F), AC = pinta('AC'), BD = pinta('BD');
    return {
      variables: vars, F,
      enunciado: [`A, B, C y D están en ese orden en ${L.lugar}. `, AC, ` = ${m(p)}, `, BD, ` = ${m(q)} y AD = ${m(t)}.`],
      pregunta: ['¿Cuánto mide BC?'],
      datos: [D.orden(['A', 'B', 'C', 'D'])],
      correcta: b * K, fmt: x => med(x, u),
      errores: [
        er('GE-SEG4', (p + q) * K, 'Bien sumar AC y BD; pero así BC queda contado dos veces.'),
        er('GE-SEG5', (t - p) * K, 'Bien: AD − AC es una resta válida. Pero da CD, no BC.'),
        er('GE-SEG5', (t - q) * K, 'Bien: AD − BD es una resta válida. Pero da AB, no BC.'),
        er('GE-SEG11', (p + q) * K / 2, 'Bien sumar AC y BD; partir entre dos serviría si no se pisaran.'),
      ],
      solucion: [[AC, ' y ', BD, ' juntos cubren AD y repiten BC: a su suma le quito AD.'], ['BC = ', `${f(p * K)} + ${f(q * K)} − ${f(t * K)} = `, v('x', m(b)), '.']],
      _datos: { tipo: 'pisan', idea: 'suma-de-segmentos', nivel: 2, K, u, puntos: { A: 0, B: a * K, C: p * K, D: t * K }, pide: 'BC' },
    };
  }

  const RAZONES = [[2, 3], [3, 2], [1, 3], [3, 4], [2, 5], [4, 3], [3, 5], [5, 2], [1, 2], [4, 5]];
  function razon(rng) {
    const L = rng.elegir(LUG), u = L.u, K = L.k, [mm, n] = rng.elegir(RAZONES), k = rng.entero(2, 6), t = mm + n, mk = x => med(x * K, u);
    const pideTodo = rng.entero(1, 3) === 1;
    const F = { objeto: L.objeto, puntos: [pto('A', 0), pto('B', mm * k * K), pto('C', t * k * K)],
      tramos: [tr('A', 'B', `${mm === 1 ? '' : mm}k`, 1), tr('B', 'C', `${n}k`, 1), tr('A', 'C', pideTodo ? '?' : mk(t * k), -1, pideTodo ? 'pide' : 'todo')] };
    const { pinta, vars } = pintor(F), AB = pinta('AB'), BC = pinta('BC');
    const datos = [D.razon(mm, n), D.entreDe('A', 'B', 'C')];
    if (pideTodo) {
      return {
        variables: vars, F,
        enunciado: [`En ${L.lugar}, B está entre A y C, con `, AB, ' : ', BC, ` = ${mm} : ${n} y `, AB, ` = ${mk(mm * k)}.`],
        pregunta: ['¿Cuánto mide AC?'],
        datos, correcta: t * k * K, fmt: x => med(x, u),
        errores: [
          er('GE-RAZ1', n * k * K, 'Bien hallar k; pero esa es la medida de BC, no la de AC.'),
          er('GE-RAZ2', k * K, `Bien hallar k: es una sola parte. AC tiene ${mm} + ${n} partes.`),
          er('GE-RAZ3', (mm * k + n) * K, `Bien sumarle algo a AB; pero ${n} cuenta partes, no ${u}.`),
          er('GE-RAZ4', mm * k * (mm + n) * K, `Bien contar ${mm + n} partes; pero cada parte es k, no la medida de AB.`),
        ],
        solucion: [[AB, ` tiene ${mm} parte${mm === 1 ? '' : 's'}: k = ${mk(mm * k)} ÷ ${mm} = ${mk(k)}.`], [`AC tiene ${mm} + ${n} = ${t} partes: AC = ${t} · ${mk(k)} = `, v('x', mk(t * k)), '.']],
        _datos: { tipo: 'razon', idea: 'suma-de-segmentos', nivel: 2, sub: 'todo', K, u, m: mm, n, dado: mm * k * K, puntos: { A: 0, B: mm * k * K, C: t * k * K }, pide: 'AC' },
      };
    }
    const pideAB = rng.moneda(), X = pideAB ? AB : BC, partes = pideAB ? mm : n, otras = pideAB ? n : mm;
    return {
      variables: vars, F,
      enunciado: [`En ${L.lugar}, B está entre A y C, con `, AB, ' : ', BC, ` = ${mm} : ${n} y AC = ${mk(t * k)}.`],
      pregunta: ['¿Cuánto mide ', X, '?'],
      datos, correcta: partes * k * K, fmt: x => med(x, u),
      errores: [
        er('GE-RAZ1', otras * k * K, 'Bien repartir AC en partes; pero esa medida es la del otro tramo.'),
        er('GE-RAZ2', k * K, `Bien hallar k: es una sola parte. El tramo tiene ${partes}.`),
        er('GE-RAZ3', (t * k - otras) * K, `Bien quitarle algo a AC; pero ${otras} cuenta partes, no ${u}.`),
      ],
      solucion: [[`AC junta ${mm} + ${n} = ${t} partes: k = ${mk(t * k)} ÷ ${t} = ${mk(k)}.`], [X, ` = ${partes} · ${mk(k)} = `, v('x', mk(partes * k)), '.']],
      _datos: { tipo: 'razon', idea: 'suma-de-segmentos', nivel: 2, sub: 'parte', K, u, m: mm, n, puntos: { A: 0, B: mm * k * K, C: t * k * K }, pide: pideAB ? 'AB' : 'BC' },
    };
  }

  function examenSeg(rng) {
    if (rng.moneda()) {
      const a = rng.entero(2, 12), b = rng.entero(2, 12), c = rng.entero(2, 12), s = 2 * b + a + c, t = a + b + c;
      const F = { objeto: 'recta', puntos: cuatroPuntos(LUG[2], a, b, c), tramos: [tr('B', 'C', '?', 1, 'pide'), tr('A', 'C', 'AC', 2), tr('B', 'D', 'BD', 3), tr('A', 'D', `${t} cm`, -1, 'todo')] };
      const { pinta, vars } = pintor(F), AC = pinta('AC'), BD = pinta('BD');
      return {
        variables: vars, F,
        enunciado: ['A, B, C y D están en ese orden sobre una recta. ', AC, ' + ', BD, ` = ${s} cm y AD = ${t} cm.`],
        pregunta: ['¿Cuánto mide BC?'],
        datos: [D.orden(['A', 'B', 'C', 'D'])],
        correcta: b, fmt: x => med(x, 'cm'),
        errores: [
          er('GE-SEG11', s / 2, 'Bien usar la suma; pero su mitad es el promedio de AC y BD, no el tramo común.'),
          er('GE-SEG5', 2 * t - s, 'Bien restar con AD; pero esa resta da los extremos juntos, AB + CD.'),
          er('GE-SEG12', (s - t) / 2, 'Bien restar AD a la suma; lo que sobra ya es BC, sin partirlo.'),
        ],
        solucion: [[AC, ' + ', BD, ' cubre AD una vez y BC otra vez: le quito AD.'], [`BC = ${s} − ${t} = `, v('x', med(b, 'cm')), '.']],
        _datos: { tipo: 'examen-seg', idea: 'suma-de-segmentos', nivel: 3, sub: 'suma', K: 1, u: 'cm', puntos: { A: 0, B: a, C: a + b, D: t }, pide: 'BC' },
      };
    }
    const a = rng.entero(2, 6), b = rng.entero(a + 1, a + 9), p = a + b, q = b + 2 * a;
    const F = { objeto: 'recta', puntos: cuatroPuntos(LUG[2], a, b, 2 * a), tramos: [tr('B', 'C', '?', 1, 'pide'), tr('A', 'C', `${p} cm`, 2), tr('B', 'D', `${q} cm`, 3)] };
    const { pinta, vars } = pintor(F), AC = pinta('AC'), BD = pinta('BD');
    return {
      variables: vars, F,
      enunciado: ['A, B, C y D están en ese orden sobre una recta. ', AC, ` = ${p} cm, `, BD, ` = ${q} cm y CD mide el doble de AB.`],
      pregunta: ['¿Cuánto mide BC?'],
      datos: ['Con puntos en orden, cada medida es la suma de sus tramos: AC = AB + BC y BD = BC + CD.'],
      correcta: b, fmt: x => med(x, 'cm'),
      errores: [
        er('GE-SEG5', q - p, 'Bien restar BD − AC; pero da CD − AB, que aquí es AB, no BC.'),
        er('GE-SEG11', (p + q) / 2, 'Bien juntar AC y BD; su promedio sería BC si AB y CD midieran igual.'),
        er('GE-SEG14', b - a, 'Bien quitarle un tramo a AC; pero se le quita AB, no CD.'),
        er('GE-SEG18', 2 * a, 'Bien hallar los tramos de las puntas; pero ese es CD, no BC.'),
      ],
      solucion: [['Con AB = x y CD = 2x: ', BD, ' − ', AC, ` = 2x − x = x, así que AB = ${q} − ${p} = ${a} cm.`], [`BC = ${p} − ${a} = `, v('x', med(b, 'cm')), '.']],
      _datos: { tipo: 'examen-seg', idea: 'suma-de-segmentos', nivel: 3, sub: 'doble', K: 1, u: 'cm', puntos: { A: 0, B: a, C: p, D: p + 2 * a }, pide: 'BC' },
    };
  }

  // =============================== Idea 2: el punto medio ===============================
  function mitad(rng) {
    const xx = rng.entero(2, 9), al = rng.entero(2, 4), ga = rng.entero(1, al - 1), be = rng.entero(0, 9), de = (al - ga) * xx + be;
    const am = al * xx + be, pideAB = rng.moneda();
    const F = { objeto: 'recta', puntos: [pto('A', 0), pto('M', am), pto('B', 2 * am)],
      tramos: [tr('A', 'M', exU(al, be), 1, 'igual', 1), tr('M', 'B', exU(ga, de), 1, 'igual', 1), ...(pideAB ? [tr('A', 'B', '?', -1, 'pide')] : [])] };
    const pide = pideAB ? 'AB' : 'AM', bien = pideAB ? 2 * am : am;
    const errores = [er('GE-PM7', xx, `Bien hallar x = ${xx}; falta reemplazarlo en la medida.`)];
    if (pideAB) errores.push(er('GE-PM4', am, 'Bien hallar AM; pero AB tiene las dos mitades.'), er('GE-PM9', 4 * am, 'Bien sumar AM y MB; esa suma ya es AB: no se dobla.'), er('GE-PM6', am / 2, 'Bien hallar AM; pero AB es su doble, no su mitad.'));
    else errores.push(er('GE-PM10', 2 * am, 'Bien sumar las dos mitades; pero esa suma es AB, no AM.'), er('GE-SEG12', am / 2, `Bien reemplazar x = ${xx}; AM ya es la mitad: no se parte otra vez.`));
    return {
      variables: {}, F,
      enunciado: [`Sobre una recta, M es el punto medio de AB. AM = (${exU(al, be)}) cm y MB = (${exU(ga, de)}) cm.`],
      pregunta: [`¿Cuánto mide ${pide}?`],
      datos: [D.medio('M', 'A', 'B'), 'AB = AM + MB'],
      correcta: bien, fmt: x => med(x, 'cm'), errores,
      solucion: [[`AM = MB: ${exU(al, be)} = ${exU(ga, de)}, así que ${al - ga === 1 ? '' : al - ga}x = ${de - be} y x = ${xx}.`],
        pideAB ? [`AM = ${al} · ${xx}${be ? ` + ${be}` : ''} = ${am} cm, y AB = 2 · ${am} = `, v('x', med(bien, 'cm')), '.'] : [`AM = ${al} · ${xx}${be ? ` + ${be}` : ''} = `, v('x', med(bien, 'cm')), '.']],
      _datos: { tipo: 'mitad', idea: 'punto-medio', nivel: 1, a1: al, b1: be, a2: ga, b2: de, puntos: { A: 0, M: am, B: 2 * am }, pide },
    };
  }

  function medioEntre(rng) {
    const q = rng.entero(2, 9), k = rng.entero(2, 7), p = q + 2 * k, ac = p + q, mAc = ac / 2, despues = rng.moneda();
    // despues: B más allá de M (AB > BC); si no, B entre A y M (AB < BC).
    const ab = despues ? p : q, bc = despues ? q : p;
    const pts = despues ? [pto('A', 0), pto('M', mAc), pto('B', ab), pto('C', ac)] : [pto('A', 0), pto('B', ab), pto('M', mAc), pto('C', ac)];
    const F = { objeto: 'recta', puntos: pts,
      tramos: [tr('A', 'B', `${ab} cm`, 1), tr('B', 'C', `${bc} cm`, 1), tr('A', 'M', undefined, 0, 'igual', 1), tr('M', 'C', undefined, 0, 'igual', 1), tr('B', 'M', '?', -1, 'pide')] };
    const { pinta, vars } = pintor(F), AB = pinta('AB'), BC = pinta('BC');
    return {
      variables: vars, F,
      enunciado: ['B está entre A y C sobre una recta, con ', AB, ` = ${ab} cm y `, BC, ` = ${bc} cm. M es el punto medio de AC.`],
      pregunta: ['¿Cuánto mide BM?'],
      datos: [D.medio('M', 'A', 'C'), D.suma],
      correcta: k, fmt: x => med(x, 'cm'),
      errores: [
        er('GE-PM3', 2 * k, 'Bien comparar AB con BC; pero esa diferencia se reparte: BM es su mitad.'),
        er('GE-PM4', mAc, `Bien hallar AM = ${f(mAc)} cm; falta ir de M hasta B.`),
        er('GE-PM5', despues ? ab / 2 : bc / 2, `Bien partir en dos; pero se parte AC, no ${despues ? 'AB' : 'BC'}.`),
        er('GE-PM2', k / 2, 'Bien partir la diferencia; pero una sola vez: BM es su mitad, no su cuarta parte.'),
      ],
      solucion: [[`AC = ${ab} + ${bc} = ${ac} cm; su mitad es AM = ${f(mAc)} cm.`], [despues ? `B está más allá de M: BM = ${ab} − ${f(mAc)} = ` : `B está antes de M: BM = ${f(mAc)} − ${ab} = `, v('x', med(k, 'cm')), '.']],
      _datos: { tipo: 'medio-entre', idea: 'punto-medio', nivel: 2, sub: despues ? 'despues' : 'antes', puntos: Object.fromEntries(pts.map(x => [x.id, x.km])), pide: 'BM' },
    };
  }

  function afuera(rng) {
    const oa = rng.entero(2, 12), h = rng.entero(2, 9), ob = oa + 2 * h, om = oa + h, L = rng.elegir([LUG[0], LUG[2]]), u = L.u;
    const F = { objeto: L.objeto, puntos: [pto('O', 0), pto('A', oa), pto('M', om), pto('B', ob)],
      tramos: [tr('O', 'A', `${oa} ${u}`, 1), tr('O', 'B', `${ob} ${u}`, 2), tr('A', 'M', undefined, 0, 'igual', 1), tr('M', 'B', undefined, 0, 'igual', 1), tr('O', 'M', '?', -1, 'pide')] };
    const { pinta, vars } = pintor(F), OA = pinta('OA'), OB = pinta('OB');
    const que = L.objeto === 'carretera' ? 'paraderos de una carretera recta' : 'puntos de una recta';
    return {
      variables: vars, F,
      enunciado: [`O, A, M y B son ${que}, en ese orden, y M es el punto medio de AB. `, OA, ` = ${oa} ${u} y `, OB, ` = ${ob} ${u}.`],
      pregunta: ['¿Cuánto mide OM?'],
      datos: [D.medio('M', 'A', 'B'), D.suma],
      correcta: om, fmt: x => med(x, u),
      errores: [
        er('GE-PM4', h, `Bien: la mitad de AB es ${h} ${u}. Falta sumarle OA para llegar de O a M.`),
        er('GE-SEG5', 2 * h, `Bien restar ${ob} − ${oa}; pero eso da AB, no OM.`),
        er('GE-PM3', oa + ob, 'Bien juntar OA y OB; pero esa suma es el doble de OM.'),
      ],
      solucion: [[`AB = ${ob} − ${oa} = ${2 * h} ${u}; su mitad es AM = ${h} ${u}.`], [`OM = ${oa} + ${h} = `, v('x', med(om, u)), '.']],
      _datos: { tipo: 'afuera', idea: 'punto-medio', nivel: 2, u, puntos: { O: 0, A: oa, M: om, B: ob }, pide: 'OM' },
    };
  }

  function dosMedios(rng) {
    const a = 2 * rng.entero(2, 6), b = rng.entero(2, 12), c = 2 * rng.entero(2, 6), t = a + b + c, mn = a / 2 + b + c / 2;
    const L = rng.elegir([LUG[0], LUG[2]]), u = L.u, fm = x => med(x, u);
    const pts = [pto('A', 0), pto('M', a / 2), pto('B', a), pto('C', a + b), pto('N', a + b + c / 2), pto('D', t)];
    const mitades = [tr('A', 'M', undefined, 0, 'igual', 1), tr('M', 'B', undefined, 0, 'igual', 1), tr('C', 'N', undefined, 0, 'igual', 2), tr('N', 'D', undefined, 0, 'igual', 2)];
    const que = L.objeto === 'carretera' ? 'paraderos de una carretera recta' : 'puntos de una recta';
    const datos = [D.medio('M', 'A', 'B'), D.medio('N', 'C', 'D'), D.suma];
    if (rng.moneda()) {
      const p = a + b, q = b + c;
      const F = { objeto: L.objeto, puntos: pts, tramos: [tr('A', 'C', fm(p), 1), tr('B', 'D', fm(q), 2), ...mitades, tr('M', 'N', '?', -1, 'pide')] };
      const { pinta, vars } = pintor(F), AC = pinta('AC'), BD = pinta('BD');
      return {
        variables: vars, F,
        enunciado: [`A, B, C y D son ${que}, en ese orden. M es el punto medio de AB y N, el de CD. `, AC, ` = ${fm(p)} y `, BD, ` = ${fm(q)}.`],
        pregunta: ['¿Cuánto mide MN?'], datos,
        texto: { correcta: { clave: fm(mn), texto: fm(mn) }, errores: [
          erT('GE-PM1', fm(p + q), 'Bien sumar AC y BD; pero esa suma trae AB y CD enteros y BC dos veces.'),
          erT('GE-PM2', fm((p + q) / 4), 'Bien dividir, pero una sola vez: entre 4 se parte también BC.'),
          erT('GE-SEG3', 'No se puede: falta BC', 'Bien ver que BC importa; pero no hace falta: en la cuenta se junta solo.'),
        ] },
        valor: mn,
        solucion: [['MN junta media AB, todo BC y media CD: la mitad de ', AC, ' + ', BD, '.'], [`MN = (${f(p)} + ${f(q)}) ÷ 2 = `, v('x', fm(mn)), '.']],
        _datos: { tipo: 'dos-medios', idea: 'punto-medio', nivel: 3, sub: 'ac-bd', u, puntos: Object.fromEntries(pts.map(x => [x.id, x.km])), pide: 'MN' },
      };
    }
    const F = { objeto: L.objeto, puntos: pts, tramos: [tr('B', 'C', fm(b), 1), tr('A', 'D', fm(t), 2, 'todo'), ...mitades, tr('M', 'N', '?', -1, 'pide')] };
    const { pinta, vars } = pintor(F), BC = pinta('BC');
    return {
      variables: vars, F,
      enunciado: [`A, B, C y D son ${que}, en ese orden. M es el punto medio de AB y N, el de CD. AD = ${fm(t)} y `, BC, ` = ${fm(b)}.`],
      pregunta: ['¿Cuánto mide MN?'], datos,
      texto: { correcta: { clave: fm(mn), texto: fm(mn) }, errores: [
        erT('GE-PM1', fm(t + b), 'Bien sumar AD y BC; falta partir esa suma entre 2.'),
        erT('GE-PM8', fm((t - b) / 2), 'Bien partir entre 2; pero BC se suma: MN tiene a BC entero.'),
        erT('GE-PM5', fm(t / 2), 'Bien partir en dos; pero la mitad de AD no es MN: falta la mitad de BC.'),
        erT('GE-SEG3', 'No se puede: faltan AB y CD', 'Bien ver que AB y CD importan; pero no hace falta conocerlos por separado.'),
      ] },
      valor: mn,
      solucion: [['AD = AB + BC + CD, y MN = media AB + BC + media CD.'], ['Entonces 2 · MN = AD + ', BC, ':'], [`MN = (${f(t)} + ${f(b)}) ÷ 2 = `, v('x', fm(mn)), '.']],
      _datos: { tipo: 'dos-medios', idea: 'punto-medio', nivel: 3, sub: 'ad-bc', u, puntos: Object.fromEntries(pts.map(x => [x.id, x.km])), pide: 'MN' },
    };
  }

  function equidistante(rng) {
    const k = rng.entero(2, 12), q = rng.entero(2, 9), p = q + 2 * k, ac = p + q, d = 2 * k;
    const F = { objeto: 'recta', puntos: [pto('A', 0), pto('M', ac / 2), pto('B', p), pto('C', ac)],
      tramos: [tr('A', 'B', 'AB', 1), tr('B', 'C', 'BC', 1), tr('A', 'M', undefined, 0, 'igual', 1), tr('M', 'C', undefined, 0, 'igual', 1), tr('B', 'M', '?', -1, 'pide')] };
    const { pinta, vars } = pintor(F), AB = pinta('AB'), BC = pinta('BC');
    return {
      variables: vars, F,
      enunciado: ['Sobre una recta, B está entre A y C, y M es el punto de AC equidistante de A y de C. ', AB, ' − ', BC, ` = ${d} cm.`],
      pregunta: ['¿Cuánto mide BM?'],
      datos: [D.equi, D.suma],
      texto: { correcta: { clave: med(k, 'cm'), texto: med(k, 'cm') }, errores: [
        erT('GE-PM3', med(d, 'cm'), 'Bien usar la diferencia; pero BM es solo su mitad.'),
        erT('GE-PM6', med(2 * d, 'cm'), 'Bien: la diferencia y BM van juntas por un 2. Pero BM es la mitad.'),
        erT('GE-SEG3', 'No se puede: faltan AB y BC', 'Bien: con AB y BC saldría. Pero basta su diferencia: lo demás se cancela.'),
      ] },
      valor: k,
      solucion: [['BM = ', AB, ' − AM, y AM es la mitad de ', AB, ' + ', BC, '.'], ['Así, BM = (', AB, ' − ', BC, `) ÷ 2 = ${d} ÷ 2 = `, v('x', med(k, 'cm')), '.']],
      _datos: { tipo: 'equidistante', idea: 'punto-medio', nivel: 3, puntos: { A: 0, M: ac / 2, B: p, C: ac }, diferencia: d, pide: 'BM' },
    };
  }

  // ======================= Ángulos: figura con la pieza geo-figura =======================
  // geo-figura dibuja los trazos y los arcos a escala; los rótulos de los ángulos los pone este generador (rotulos), con
  // la misma escala que geo-figura (marco) y la misma estimación de ancho de texto que el kit (ancho).
  const MG = 26, TAM = 16, ALTO_T = TAM * 1.05;
  function marco(fig) {
    const [x0, x1] = fig.vista.x, [y0, y1] = fig.vista.y, sx = x1 - x0, sy = y1 - y0, alto = fig.alto || 240;
    const s = Math.min((ANCHO - 2 * MG) / sx, (alto - 2 * MG) / sy), H = Math.round(sy * s + 2 * MG);
    const ox = (ANCHO - sx * s) / 2;
    return { s, H, X: x => ox + (x - x0) * s, Y: y => MG + (y1 - y) * s, Xi: px => x0 + (px - ox) / s, Yi: py => y1 - (py - MG) / s };
  }
  const caja = (x, y, w, h) => ({ x0: x - w / 2, x1: x + w / 2, y0: y - h / 2, y1: y + h / 2 });
  const chocan = (a, b, e = 2) => a.x0 < b.x1 + e && b.x0 < a.x1 + e && a.y0 < b.y1 + e && b.y0 < a.y1 + e;
  // ¿El segmento p–q toca la caja b (con margen e)? (Liang-Barsky.)
  function tocaCaja(p, q, b0, e = 1) {
    const b = { x0: b0.x0 - e, x1: b0.x1 + e, y0: b0.y0 - e, y1: b0.y1 + e };
    let t0 = 0, t1 = 1; const dx = q[0] - p[0], dy = q[1] - p[1];
    for (const [pp, qq] of [[-dx, p[0] - b.x0], [dx, b.x1 - p[0]], [-dy, p[1] - b.y0], [dy, b.y1 - p[1]]]) {
      if (pp === 0) { if (qq < 0) return false; continue; }
      const r = qq / pp;
      if (pp < 0) { if (r > t1) return false; if (r > t0) t0 = r; } else { if (r < t0) return false; if (r < t1) t1 = r; }
    }
    return true;
  }
  const TAU = 2 * Math.PI, norm = t => ((t % TAU) + TAU) % TAU;
  // Sector de un ángulo en pantalla (y hacia abajo), como lo dibuja geo-figura: del lado «de» al «a» por el camino corto.
  function sector(S, an) {
    const c = S(an.en), p1 = S(an.de), p2 = S(an.a);
    const t1 = Math.atan2(p1[1] - c[1], p1[0] - c[0]), t2 = Math.atan2(p2[1] - c[1], p2[0] - c[0]);
    let dt = t2 - t1; while (dt > Math.PI) dt -= TAU; while (dt < -Math.PI) dt += TAU;
    if (an.mayor) dt = dt > 0 ? dt - TAU : dt + TAU;
    return { c, t1, dt };
  }
  /*
   * rotular(fig): pone los rótulos de los ángulos que traen «etiqueta» ({ texto, color }) y devuelve false si alguno no
   * cabe (fuera del lienzo, sobre una línea, una letra, un arco u otro rótulo). Del ángulo más chico al más grande: el
   * rótulo va sobre la bisectriz (o en el hueco más ancho si otro rayo del mismo vértice cae adentro), a la distancia justa
   * para no tocar los lados; si choca, se aleja de a 4 px. En un ángulo chico el arco crece hasta su rótulo.
   */
  const diag = { razon: '', llamadas: 0, fallas: 0 };
  const mal = r => { diag.razon = r; diag.fallas++; diag.lista = diag.lista || {}; const k = r.replace(/\(.*/, '').replace(/\d+/g, '#'); diag.lista[k] = (diag.lista[k] || 0) + 1; return false; };
  function rotular(fig) {
    diag.llamadas++;
    const g = marco(fig), pts = {};
    for (const q of fig.puntos) pts[q.id] = q;
    const S = id => { const q = pts[id]; return [g.X(q.x), g.Y(q.y)]; };
    const lineas = fig.segmentos.map(l => {
      const a = S(l.de), b = S(l.a);
      if (!l.recta) return [a, b];
      const u = [b[0] - a[0], b[1] - a[1]], L = Math.hypot(...u);
      return [[a[0] - u[0] / L * 900, a[1] - u[1] / L * 900], [a[0] + u[0] / L * 900, a[1] + u[1] / L * 900]];
    });
    const puestos = [];
    for (const q of fig.puntos) if (q.rotulo) {
      const [x, y] = S(q.id), w = ancho(q.rotulo, 600);
      puestos.push(caja(x + Math.cos(q.lado * RAD) * 15, y - Math.sin(q.lado * RAD) * 15 + 1, w, ALTO_T));
    }
    for (const r of fig.rotulos || []) puestos.push(caja(g.X(r.x), g.Y(r.y) + 0.6, ancho(r.texto), ALTO_T));
    // Las letras y los rótulos fijos no tocan ninguna línea ni salen del lienzo.
    const dentro = b => b.x0 >= ME && b.x1 <= ANCHO - ME && b.y0 >= ME && b.y1 <= g.H - ME;
    for (const b of puestos) if (!dentro(b) || lineas.some(([p, q]) => tocaCaja(p, q, b))) return mal(`fijo ${JSON.stringify(b)}`);
    const angs = fig.angulos;
    const sec = angs.map(a => sector(S, a));
    const rayos = id => fig.segmentos.flatMap(l => (l.de === id ? [l.a] : l.a === id && !l.recta ? [l.de] : [])).map(o => { const c = S(id), q = S(o); return Math.atan2(q[1] - c[1], q[0] - c[0]); });
    const orden = angs.map((_, i) => i).sort((i, j) => Math.abs(sec[i].dt) - Math.abs(sec[j].dt));
    fig.rotulos = fig.rotulos || [];
    const nuevos = [];
    for (const i of orden) {
      const an = angs[i];
      if (!an.etiqueta) continue;
      let { c, t1, dt } = sec[i];
      const lo = dt >= 0 ? norm(t1) : norm(t1 + dt), w0 = Math.abs(dt);
      const ts = rayos(an.en).map(t => norm(t - lo)).filter(x => x > 1e-3 && x < w0 - 1e-3).sort((p, q) => p - q);
      let propio = true;
      if (an.hueco) {
        // El rótulo va en el hueco que se pide (la parte que el ángulo no comparte con otro).
        const h1 = Math.atan2(S(an.hueco[0])[1] - c[1], S(an.hueco[0])[0] - c[0]), h2 = Math.atan2(S(an.hueco[1])[1] - c[1], S(an.hueco[1])[0] - c[0]);
        let hd = h2 - h1; while (hd > Math.PI) hd -= TAU; while (hd < -Math.PI) hd += TAU;
        t1 = h1; dt = hd; propio = false;
      } else if (ts.length) {
        const cs = [0, ...ts, w0]; let k = 0;
        for (let j = 1; j < cs.length - 1; j++) if (cs[j + 1] - cs[j] > cs[k + 1] - cs[k] + 1e-3) k = j;
        t1 = lo + cs[k]; dt = cs[k + 1] - cs[k]; propio = false;
      }
      const texto = an.etiqueta.texto, w = ancho(texto), h = ALTO_T, half = Math.abs(dt) / 2, bis = t1 + dt / 2;
      const sop = t => (w / 2) * Math.abs(Math.cos(t)) + (h / 2) * Math.abs(Math.sin(t));
      let d = (an.radio || 26) + 7 + sop(bis);
      if (half < Math.PI / 2 - 1e-6) for (const t of [t1, t1 + dt]) d = Math.max(d, (sop(t + Math.PI / 2) + 6) / Math.sin(half));
      if (propio && an.crece !== false) { const r2 = Math.round(d - sop(bis) - 5); if (r2 > (an.radio || 26) + 6) an.radio = r2; }
      let z = null;
      for (let k = 0; k <= 12; k++) {
        const dd = d + 4 * k, b = caja(c[0] + dd * Math.cos(bis), c[1] + dd * Math.sin(bis), w, h);
        if (!dentro(b)) break;
        if (puestos.some(q => chocan(b, q))) continue;
        z = { b, x: c[0] + dd * Math.cos(bis), y: c[1] + dd * Math.sin(bis) };
        break;
      }
      if (!z) return mal(`sin lugar ${texto}`);
      // Un rótulo que se alejó (ángulo chico) no queda junto a otro vértice: parecería de otro ángulo.
      const dv = Math.hypot(z.x - c[0], z.y - c[1]);
      if (dv > 45) for (const id of new Set(angs.map(a => a.en))) if (id !== an.en) { const [qx, qy] = S(id); if (Math.hypot(z.x - qx, z.y - qy) < 0.75 * dv) return mal(`${texto} cerca de ${id} (${Math.round(Math.hypot(z.x - qx, z.y - qy))} contra ${Math.round(dv)}; ${an.en})`); }
      puestos.push(z.b);
      nuevos.push({ i, b: z.b });
      fig.rotulos.push({ x: g.Xi(z.x), y: g.Yi(z.y - 0.6), texto, color: an.etiqueta.color, angulo: i });
    }
    // Ningún rótulo (de ángulo, letra o fijo) toca un arco, ni uno de ángulo una línea (los arcos con su radio final).
    const arcos = angs.map((a, i) => ({ c: S(a.en), t1: sec[i].t1, dt: sec[i].dt, r: [...Array(Math.max(1, a.marcas || 1)).keys()].map(k => (a.radio || 26) + 5 * k) }));
    for (const b of puestos) {
      if (nuevos.some(z => z.b === b) && lineas.some(([p, q]) => tocaCaja(p, q, b))) return mal('rótulo sobre una línea');
      for (const a of arcos) for (const r of a.r) for (let k = 0; k <= 24; k++) {
        const t = a.t1 + a.dt * k / 24, x = a.c[0] + r * Math.cos(t), y = a.c[1] + r * Math.sin(t);
        if (x > b.x0 - 2 && x < b.x1 + 2 && y > b.y0 - 2 && y < b.y1 + 2) return mal('rótulo sobre un arco');
      }
    }
    // Un recto que se pide va con arco: su lado «de» se gira 0,02° (no se ve; geo-figura dibujaría el cuadradito).
    angs.forEach((a, i) => {
      if (a.etiqueta && !a.etiqueta.color && Math.abs(Math.abs(sec[i].dt) - Math.PI / 2) < 1e-3 && !a.mayor) {
        const V = pts[a.en], Dd = pts[a.de], t = Math.atan2(Dd.y - V.y, Dd.x - V.x) + (sec[i].dt < 0 ? 1 : -1) * 0.02 * RAD;
        const id = `~${i}`; fig.puntos.push({ id, x: V.x + Math.cos(t), y: V.y + Math.sin(t), sinPunto: true }); a.de = id;
      }
    });
    return true;
  }
  const angEsc = fig => ({ escena: { pieza: 'geo-figura', datos: fig } });
  // Tope de intentos de un tipo que arma su figura (si nunca cabe, falla en las pruebas y no se cuelga).
  const tope = () => { let k = 0; return () => { if (++k > 600) throw new Error(`${ID}: la figura no cupo en 600 intentos`); return true; }; };
  const polar = (r, g) => [r * Math.cos(g * RAD), r * Math.sin(g * RAD)];

  // Rayos desde O: rayos [{ id, dir, discontinua }]; la O va en la bisectriz del hueco más ancho entre los rayos.
  function abanico(rayos, angs, o = {}) {
    const R = o.R || 2.5;
    const pts = rayos.map(q => { const p = polar(q.largo || R, q.dir); return { id: q.id, x: p[0], y: p[1], rotulo: q.id, lado: q.dir, sinPunto: true }; });
    const ds = rayos.map(q => norm(q.dir * RAD) / RAD).sort((a, b) => a - b);
    let hueco = [ds[ds.length - 1], ds[0] + 360];
    for (let i = 1; i < ds.length; i++) if (ds[i] - ds[i - 1] > hueco[1] - hueco[0]) hueco = [ds[i - 1], ds[i]];
    const pad = o.pad || 0.85, xs = [0, ...pts.map(p => p.x)], ys = [0, ...pts.map(p => p.y)];
    return { alt: o.alt, vista: { x: [Math.min(...xs) - pad, Math.max(...xs) + pad], y: [Math.min(...ys) - pad, Math.max(...ys) + pad] }, alto: o.alto || 240,
      puntos: [{ id: 'O', x: 0, y: 0, rotulo: 'O', lado: (hueco[0] + hueco[1]) / 2 }, ...pts],
      segmentos: rayos.map(q => ({ de: 'O', a: q.id, discontinua: q.discontinua })),
      angulos: angs.map(a => Object.assign({ en: 'O', radio: 28 }, a)) };
  }
  const dado = (t, extra) => Object.assign({ etiqueta: { texto: t, color: 'h' }, color: 'h' }, extra || {});
  const pedido = (t, extra) => Object.assign({ etiqueta: { texto: t } }, extra || {});

  // =============================== Idea 3: clases de ángulos ===============================
  const CLASE = g => (g < 90 ? 'agudo' : g === 90 ? 'recto' : g < 180 ? 'obtuso' : g === 180 ? 'llano' : 'no convexo');
  const CLASES = ['agudo', 'recto', 'obtuso', 'llano', 'no convexo'];
  const RANGO = { agudo: 'fuera menor que 90°', recto: 'fuera justo 90°', obtuso: 'estuviera entre 90° y 180°', llano: 'fuera justo 180°', 'no convexo': 'pasara de 180°' };
  // Dos consecutivos del mismo color con el mismo radio se ven como un solo arco (auditoría de la teoría, 17 nov): radios
  // de 26 y 36, sin crecer hasta el rótulo.
  function consecFig(a, b, giro, ta, tb, alt) {
    return abanico([{ id: 'A', dir: giro }, { id: 'B', dir: giro + a }, { id: 'C', dir: giro + a + b }],
      [Object.assign(dado(ta), { de: 'A', a: 'B', mide: a, radio: 26, crece: false }), Object.assign(dado(tb), { de: 'B', a: 'C', mide: b, radio: 36, crece: false })], { alt });
  }
  function clase(rng) {
    for (const sigue = tope(); sigue();) {
      const a = 5 * rng.entero(6, 20), b = 5 * rng.entero(6, 22), t = a + b, giro = 15 * rng.entero(0, 6);
      if (t > 180) continue;
      const fig = consecFig(a, b, giro, `${a}°`, `${b}°`, '∠AOB y ∠BOC consecutivos, con OB entre OA y OC.');
      if (!rotular(fig)) continue;
      const bien = CLASE(t);
      const cerca = CLASES.filter(n => n !== bien).sort((x, y) => Math.abs(CLASES.indexOf(x) - CLASES.indexOf(bien)) - Math.abs(CLASES.indexOf(y) - CLASES.indexOf(bien))).slice(0, 3);
      return {
        variables: {}, enunciado: [`∠AOB y ∠BOC son consecutivos: OB queda entre OA y OC. m∠AOB = ${a}° y m∠BOC = ${b}°.`],
        pregunta: ['¿Qué clase de ángulo es ∠AOC?'],
        datos: [D.consec('A', 'B', 'C'), D.clases],
        texto: { correcta: { clave: bien, texto: bien }, errores: cerca.map(n => erT('GE-ANG3', n, `Bien sumar las dos aberturas; «${n}» sería si la suma ${RANGO[n]}.`)) },
        solucion: [[`Las aberturas consecutivas se suman: m∠AOC = ${a}° + ${b}° = ${t}°.`], [`${t}° es `, v('x', bien), '.']],
        fig, _datos: { tipo: 'clase', idea: 'abertura', nivel: 1, a, b, pide: '∠AOC' },
      };
    }
  }

  function relojFig(h) {
    const puntos = [{ id: 'O', x: 0, y: 0 }], segmentos = [], rotulos = [];
    for (let k = 1; k <= 12; k++) {
      const g = 90 - 30 * k, p = polar(0.88, g), q = polar(1, g), r = polar(1.3, g);
      puntos.push({ id: `t${k}`, x: p[0], y: p[1], sinPunto: true }, { id: `u${k}`, x: q[0], y: q[1], sinPunto: true });
      segmentos.push({ de: `t${k}`, a: `u${k}`, grosor: 'fino' });
      rotulos.push({ x: r[0], y: r[1] - 0.04, texto: String(k), fijo: true });
    }
    const mi = polar(0.82, 90), ho = polar(0.58, 90 - 30 * h);
    puntos.push({ id: 'Mi', x: mi[0], y: mi[1], sinPunto: true }, { id: 'Ho', x: ho[0], y: ho[1], sinPunto: true });
    segmentos.push({ de: 'O', a: 'Mi', grosor: 'variable' }, { de: 'O', a: 'Ho', grosor: 'variable' });
    return { alt: `El reloj de la plaza a las ${h}:00: el minutero en el 12 y el horario en el ${h}.`, vista: { x: [-1.6, 1.6], y: [-1.6, 1.6] }, alto: 240,
      puntos, segmentos, circulos: [{ centro: 'O', r: 1 }], rotulos,
      angulos: [Object.assign(pedido('?'), { en: 'O', de: 'Mi', a: 'Ho', radio: 20, mide: 30 * Math.min(h, 12 - h) })] };
  }
  function reloj(rng) {
    for (const sigue = tope(); sigue();) {
      const h = rng.elegir([1, 2, 4, 5, 7, 8, 10, 11]), esp = Math.min(h, 12 - h), bien = 30 * esp;
      const fig = relojFig(h);
      if (!rotular(fig)) continue;
      return {
        variables: {}, enunciado: [`El reloj de la plaza marca las ${h}:00.`],
        pregunta: ['¿Cuánto mide el ángulo convexo que forman sus agujas?'],
        datos: [D.vuelta, D.reloj, D.convexo],
        correcta: bien, fmt: gr,
        errores: [
          er('GE-ANG5', 360 - bien, 'Bien: ese también es un ángulo de las agujas. Pero se pide el convexo, el del lado corto.'),
          er('GE-ANG6', 6 * esp, 'Bien contar los espacios; pero entre dos números hay 30°: 6° es un minuto.'),
          er('GE-ANG7', 15 * esp, 'Bien repartir entre 12; pero se reparte la vuelta entera, 360°, no 180°.'),
        ],
        solucion: [[`Entre dos números hay 360° ÷ 12 = 30°. Por el lado corto hay ${esp} espacio${esp === 1 ? '' : 's'}.`], [`${esp} · 30° = `, v('x', gr(bien)), '.']],
        fig, _datos: { tipo: 'reloj', idea: 'abertura', nivel: 1, hora: h, pide: 'el convexo' },
      };
    }
  }

  function consecX(rng) {
    for (const sigue = tope(); sigue();) {
      const xv = 5 * rng.entero(2, 8), a1 = rng.entero(1, 4), a2 = rng.entero(1, 4), b1 = 5 * rng.entero(-2, 6), b2 = 5 * rng.entero(0, 6);
      const m1 = a1 * xv + b1, m2 = a2 * xv + b2, t = m1 + m2;
      if (m1 < 30 || m2 < 30 || t >= 180 || m1 === m2) continue;
      const fig = consecFig(m1, m2, 5 * rng.entero(0, 12), exG(a1, b1), exG(a2, b2), '∠AOB y ∠BOC consecutivos, cada uno con su medida en x.');
      if (!rotular(fig)) continue;
      const pideB = rng.moneda(), bien = pideB ? m2 : m1, otro = pideB ? m1 : m2;
      return {
        variables: {}, enunciado: [`∠AOB y ∠BOC son consecutivos. m∠AOB = ${exG(a1, b1)}, m∠BOC = ${exG(a2, b2)} y m∠AOC = ${t}°.`],
        pregunta: [`¿Cuánto mide ∠${pideB ? 'BOC' : 'AOB'}?`],
        datos: [D.consec('A', 'B', 'C')],
        correcta: bien, fmt: gr,
        errores: [
          er('GE-ANG8', xv, `Bien hallar x = ${xv}; falta reemplazarlo en ∠${pideB ? 'BOC' : 'AOB'}.`),
          er('GE-ANG9', otro, `Bien la cuenta; pero ese es ∠${pideB ? 'AOB' : 'BOC'}, no el que se pide.`),
          er('GE-ANG14', t / 2, 'Bien usar ∠AOC; partirlo en dos serviría si OB fuera su bisectriz.'),
        ],
        solucion: [[`${exG(a1, b1)} + ${exG(a2, b2)} = ${t}${b1 || b2 ? '°' : ''}: ${igualG(a1 + a2, b1 + b2, t)}, así que x = ${xv}.`],
          [`m∠${pideB ? 'BOC' : 'AOB'} = ${pideB ? conX(a2, b2, xv) : conX(a1, b1, xv)} = `, v('x', gr(bien)), '.']],
        fig, _datos: { tipo: 'consec-x', idea: 'abertura', nivel: 2, a1, b1, a2, b2, total: t, pide: pideB ? 'BOC' : 'AOB' },
      };
    }
  }

  function pisanAng(rng) {
    for (const sigue = tope(); sigue();) {
      const al = 5 * rng.entero(5, 12), be = 5 * rng.entero(5, 12), ga = 5 * rng.entero(5, 12), giro = 5 * rng.entero(0, 6);
      const aoc = al + be, bod = be + ga, aod = al + be + ga;
      if (aod > 170) continue;
      const fig = abanico([{ id: 'A', dir: giro }, { id: 'B', dir: giro + al }, { id: 'C', dir: giro + al + be }, { id: 'D', dir: giro + aod }],
        [Object.assign(dado(`${aoc}°`), { de: 'A', a: 'C', mide: aoc, radio: 22, crece: false, hueco: ['A', 'B'] }), Object.assign(dado(`${bod}°`), { de: 'B', a: 'D', mide: bod, radio: 42, crece: false, hueco: ['C', 'D'] }),
          Object.assign(pedido('?'), { de: 'B', a: 'C', mide: be, radio: 62, crece: false })], { alt: 'Cuatro rayos OA, OB, OC y OD, en ese orden.', R: 2.8 });
      if (!rotular(fig)) continue;
      return {
        variables: {}, enunciado: [`Los rayos OA, OB, OC y OD salen de O en ese orden. m∠AOC = ${aoc}°, m∠BOD = ${bod}° y m∠AOD = ${aod}°.`],
        pregunta: ['¿Cuánto mide ∠BOC?'],
        datos: ['Consecutivos: sus medidas se suman. m∠AOD = m∠AOB + m∠BOC + m∠COD.'],
        correcta: be, fmt: gr,
        errores: [
          er('GE-ANG13', aoc + bod, 'Bien juntar ∠AOC y ∠BOD; pero así ∠BOC queda contado dos veces.'),
          er('GE-ANG9', aod - aoc, 'Bien restar ∠AOD − ∠AOC; pero eso da ∠COD, no ∠BOC.'),
          er('GE-ANG9', aod - bod, 'Bien restar ∠AOD − ∠BOD; pero eso da ∠AOB, no ∠BOC.'),
          er('GE-ANG14', (aoc + bod) / 2, 'Bien sumar los dos; partir entre dos daría su promedio, no el ángulo común.'),
          er('GE-ANG17', be / 2, 'Bien la cuenta: sumar y quitarle ∠AOD. Lo que sobra ya es ∠BOC, sin partirlo.'),
        ],
        solucion: [['∠AOC y ∠BOD juntos cubren ∠AOD y repiten ∠BOC.'], [`m∠BOC = ${aoc}° + ${bod}° − ${aod}° = `, v('x', gr(be)), '.']],
        fig, _datos: { tipo: 'pisan-ang', idea: 'abertura', nivel: 2, aob: al, boc: be, cod: ga, pide: 'BOC' },
      };
    }
  }

  const VUELTAS = [[20, [2, 4, 5, 7]], [15, [3, 4, 6, 11]], [18, [2, 3, 6, 9]], [10, [5, 6, 8, 17]], [30, [1, 2, 4, 5]], [36, [1, 2, 3, 4]], [24, [2, 3, 4, 6]], [12, [4, 6, 7, 13]], [20, [3, 4, 5, 6]]];
  function vuelta(rng) {
    for (const sigue = tope(); sigue();) {
      const [xv, ks0] = rng.elegir(VUELTAS), ks = rng.barajar(ks0), S = ks.reduce((s, k) => s + k, 0), mx = Math.max(...ks) * xv, giro = 10 * rng.entero(0, 8);
      let d = giro; const rayos = [], angs = [];
      ks.forEach((k, i) => { rayos.push({ id: 'ABCD'[i], dir: d }); d += k * xv; });
      // Radios alternados (36 y 46): cuatro arcos carmín del mismo radio se veían como un círculo entero.
      ks.forEach((k, i) => angs.push(Object.assign(dado(x2(k)), { de: 'ABCD'[i], a: 'ABCD'[(i + 1) % 4], mide: k * xv, mayor: k * xv > 180, radio: i % 2 ? 46 : 36, crece: false })));
      const fig = abanico(rayos, angs, { alt: 'Cuatro ángulos alrededor del punto O que dan la vuelta entera.' });
      if (!rotular(fig)) continue;
      return {
        variables: {}, enunciado: [`Alrededor del punto O hay cuatro ángulos consecutivos que dan la vuelta entera: ${ks.map(x2).join(', ')}.`],
        pregunta: ['¿Cuánto mide el mayor?'],
        datos: [D.vuelta, D.consecSuman],
        correcta: mx, fmt: gr,
        errores: [
          er('GE-ANG8', xv, `Bien hallar x = ${xv}; falta multiplicar por ${Math.max(...ks)}.`),
          er('GE-ANG10', mx / 2, 'Bien sumar los cuatro; pero alrededor de un punto suman 360°, no 180°.'),
          er('GE-ANG9', Math.min(...ks) * xv, 'Bien hallada la x; pero ese es el menor de los cuatro.'),
          // (Solo si da menos de una vuelta: un ángulo de 630° no engaña a nadie.)
          ...(90 * Math.max(...ks) < 360 ? [er('GE-ANG15', 90 * Math.max(...ks), `Bien multiplicar por ${Math.max(...ks)}; pero x no es 360 ÷ 4: la vuelta tiene ${S} partes de x.`)] : []),
          er('GE-ANG5', 360 - mx, 'Bien hallar x; pero eso es lo que queda de la vuelta, no el mayor de los cuatro.'),
        ],
        solucion: [[`Los cuatro dan la vuelta: ${S}x = 360, así que x = ${xv}.`], [`El mayor es ${x2(Math.max(...ks))}: m∠${'ABCD'[ks.indexOf(Math.max(...ks))]}O${'ABCD'[(ks.indexOf(Math.max(...ks)) + 1) % 4]} = ${Math.max(...ks)} · ${xv} = `, v('x', gr(mx)), '.']],
        fig, _datos: { tipo: 'vuelta', idea: 'abertura', nivel: 3, ks, pide: 'el mayor' },
      };
    }
  }

  // ======================= Idea 4: complemento, suplemento y bisectriz =======================
  function compSup(rng) {
    for (const sigue = tope(); sigue();) {
      const esC = rng.moneda(), a = 5 * rng.entero(4, esC ? 14 : 30), giro = 5 * rng.entero(0, 4);
      if (!esC && (a > 150 || a === 90)) continue;
      const base = esC ? 90 : 180, bien = base - a, fin = esC ? 'D' : 'E';
      const fig = abanico([{ id: 'A', dir: giro }, { id: 'B', dir: giro + a }, { id: fin, dir: giro + base }],
        [Object.assign(dado(`${a}°`), { de: 'A', a: 'B', mide: a }), Object.assign(pedido('?'), { de: 'B', a: fin, mide: bien })].concat(esC ? [{ de: 'A', a: 'D', color: 'h', radio: 14, mide: 90 }] : []),
        { alt: esC ? '∠AOD es recto; el rayo OB lo parte.' : 'A, O y E en una recta; el rayo OB sale de O.' });
      if (!rotular(fig)) continue;
      const errores = esC
        ? [er('GE-CS5', 180 - a, 'Bien restar de un total; pero ∠AOD es recto: el total es 90°, no 180°.')]
        : [er('GE-CS5', 90 - a, 'Bien restar de un total; pero A, O y E forman una recta: el total es 180°.')];
      errores.push(er('GE-CS7', a, `Bien ubicar ∠AOB; pero se pide el otro, el que le falta para ${base}°.`),
        er('GE-CS8', 360 - a, `Bien restar de un total; pero el total es ${base}°, no una vuelta.`),
        er('GE-CS10', base + a, `Bien usar ${base}°; pero ∠BO${fin} es lo que falta: se resta.`));
      return {
        variables: {}, enunciado: [esC ? `El ángulo AOD es recto y el rayo OB lo parte en dos: m∠AOB = ${a}°.` : `A, O y E están en una recta, con O en medio. El rayo OB forma m∠AOB = ${a}°.`],
        pregunta: [`¿Cuánto mide ∠BO${fin}?`],
        datos: esC ? [D.recto, D.C] : [D.llano, D.S],
        correcta: bien, fmt: gr, errores,
        solucion: [[esC ? `∠BOD es lo que le falta a ${a}° para 90°: C(${a}°).` : `∠BOE es lo que le falta a ${a}° para 180°: S(${a}°).`], [`${base}° − ${a}° = `, v('x', gr(bien)), '.']],
        fig, _datos: { tipo: 'comp-sup', idea: 'bisectrices', nivel: 1, sub: esC ? 'C' : 'S', a, pide: `BO${fin}` },
      };
    }
  }

  function vecesX(rng) {
    const esS = rng.moneda(), m = rng.elegir(esS ? [2, 3, 4, 5, 8] : [1, 2, 4, 5, 8]), base = esS ? 180 : 90, val = base / (m + 1), otra = esS ? 90 : 180;
    const nom = esS ? 'suplemento' : 'complemento', F = esS ? 'S' : 'C', veces = m === 1 ? 'mide lo mismo que' : `es ${m} veces`;
    return {
      variables: {}, enunciado: [`El ${nom} de un ángulo ${veces} el ángulo.`],
      pregunta: ['¿Cuánto mide el ángulo?'],
      datos: [D.C, D.S],
      correcta: val, fmt: gr,
      errores: [
        er('GE-CS4', base / m, `Bien repartir ${base}°; pero el ángulo también entra: ${base}° − x = ${m === 1 ? 'x' : `${m}x`}.`),
        er('GE-CS5', otra / (m + 1), `Bien la cuenta con ${otra}°; pero el ${nom} es lo que falta para ${base}°.`),
        er('GE-CS6', base - val, `Bien: ${gr(base - val)} es el ${nom}. Pero se pide el ángulo.`),
      ],
      solucion: [[`Si el ángulo mide x: ${F}(x) = ${base}° − x = ${m === 1 ? 'x' : `${m}x`}, así que ${m + 1}x = ${base}.`], [`x = ${base} ÷ ${m + 1} = ${f(val)}: el ángulo mide `, v('x', gr(val)), '.']],
      _datos: { tipo: 'veces-x', idea: 'bisectrices', nivel: 2, sub: F, m, pide: 'x' },
    };
  }

  function cadena(rng) {
    if (rng.moneda()) {
      const val = 5 * rng.entero(2, 16), k = 90 + val;
      return {
        variables: {}, enunciado: [`Un ángulo mide x, y el suplemento de su complemento mide ${k}°: S(C(x)) = ${k}°.`],
        pregunta: ['¿Cuánto vale x?'],
        datos: [D.C, D.S],
        correcta: val, fmt: num,
        errores: [
          er('GE-CS1', 180 - k, `Bien deshacer el suplemento: C(x) = ${180 - k}°. Falta deshacer el complemento.`),
          er('GE-CS2', k + 90, 'Bien deshacer las dos; pero en otro orden: primero se deshace el de afuera, S.'),
          er('GE-CS3', k / 2, 'Bien deshacer operaciones; pero aquí son dos restas, no una mitad.'),
        ],
        solucion: [['S(C(x)) = 180° − (90° − x) = 90° + x.'], [`90° + x = ${k}°, así que x = `, v('x', num(val)), '.']],
        _datos: { tipo: 'cadena', idea: 'bisectrices', nivel: 2, sub: 'SC', k, pide: 'x' },
      };
    }
    const val = 5 * rng.entero(20, 34), k = val - 90;
    return {
      variables: {}, enunciado: [`Un ángulo mide x, y el complemento de su suplemento mide ${k}°: C(S(x)) = ${k}°.`],
      pregunta: ['¿Cuánto vale x?'],
      datos: [D.C, D.S],
      correcta: val, fmt: num,
      errores: [
        er('GE-CS1', 90 - k, `Bien deshacer el complemento: S(x) = ${90 - k}°. Falta deshacer el suplemento.`),
        er('GE-CS9', 180 - k, 'Bien deshacer el suplemento; pero antes falta deshacer el complemento.'),
        er('GE-CS3', k / 2, 'Bien deshacer operaciones; pero aquí son dos restas, no una mitad.'),
      ],
      solucion: [['C(S(x)) = 90° − (180° − x) = x − 90°.'], [`x − 90° = ${k}°, así que x = `, v('x', num(val)), '.']],
      _datos: { tipo: 'cadena', idea: 'bisectrices', nivel: 2, sub: 'CS', k, pide: 'x' },
    };
  }

  function bisect(rng) {
    for (const sigue = tope(); sigue();) {
      const recta = rng.entero(1, 3) === 1, giro = 5 * rng.entero(0, 4);
      const a = recta ? 10 * rng.entero(5, 13) : 10 * rng.entero(4, 11), b = recta ? 180 - a : 10 * rng.entero(4, 11);
      if (!recta && (a + b > 170 || a + b < 100 || a === b)) continue;
      const fin = recta ? 'E' : 'D';
      const rayos = [{ id: 'A', dir: giro }, { id: 'M', dir: giro + a / 2, discontinua: true }, { id: 'B', dir: giro + a }, { id: 'N', dir: giro + a + b / 2, discontinua: true }, { id: fin, dir: giro + a + b }];
      const angs = [{ de: 'A', a: 'M', color: 'h', rayita: 1, radio: 36, mide: a / 2 }, { de: 'M', a: 'B', color: 'h', rayita: 1, radio: 36, mide: a / 2 },
        { de: 'B', a: 'N', rayita: 2, radio: 36, mide: b / 2, color: recta ? undefined : 'h' }, { de: 'N', a: fin, rayita: 2, radio: 36, mide: b / 2, color: recta ? undefined : 'h' },
        Object.assign(dado(`${a}°`), { de: 'A', a: 'B', mide: a, radio: 58, crece: false })];
      if (!recta) angs.push(Object.assign(dado(`${b}°`), { de: 'B', a: 'D', mide: b, radio: 58, crece: false }));
      const fig = abanico(rayos, angs, { alt: recta ? 'A, O y E en una recta; OB sale de O; OM y ON son las bisectrices de ∠AOB y ∠BOE.' : '∠AOB y ∠BOD consecutivos, con sus bisectrices OM y ON.', R: 2.6 });
      if (!rotular(fig)) continue;
      const bien = (a + b) / 2;
      const errores = recta
        ? [er('GE-BIS2', 180, 'Bien juntar los dos ángulos; pero OM y ON toman solo la mitad de cada uno.'),
          er('GE-BIS4', a / 2, 'Bien tomar la mitad de ∠AOB; falta sumarle la mitad de ∠BOE.'),
          er('GE-BIS4', b / 2, 'Bien tomar la mitad de ∠BOE; falta sumarle la mitad de ∠AOB.'),
          er('GE-BIS3', a, 'Bien: ∠MON abraza a OB. Pero sus lados son las bisectrices, no OA y OB.')]
        : [er('GE-BIS2', a + b, 'Bien juntar los dos ángulos; pero OM y ON toman solo la mitad de cada uno.'),
          er('GE-BIS4', a / 2, 'Bien tomar la mitad de ∠AOB; falta sumarle la mitad de ∠BOD.'),
          er('GE-BIS4', b / 2, 'Bien tomar la mitad de ∠BOD; falta sumarle la mitad de ∠AOB.'),
          er('GE-BIS5', 90, 'Bien recordar el caso de la recta, que da 90°; aquí los dos no forman una recta.')];
      return {
        variables: {}, enunciado: [recta ? `A, O y E están en una recta, con O en medio, y m∠AOB = ${a}°. OM y ON son las bisectrices de ∠AOB y ∠BOE.` : `∠AOB y ∠BOD son consecutivos: m∠AOB = ${a}° y m∠BOD = ${b}°. OM y ON son sus bisectrices.`],
        pregunta: ['¿Cuánto mide ∠MON?'],
        datos: recta ? [D.bis, D.llano] : [D.bis, D.consecSuman],
        correcta: bien, fmt: gr, errores,
        solucion: recta
          ? [[`m∠BOE = 180° − ${a}° = ${b}°. Cada bisectriz toma la mitad: ${f(a / 2)}° y ${f(b / 2)}°.`], [`m∠MON = ${f(a / 2)}° + ${f(b / 2)}° = `, v('x', gr(bien)), '.']]
          : [[`Cada bisectriz toma la mitad de su ángulo: ${f(a / 2)}° y ${f(b / 2)}°.`], [`m∠MON = ${f(a / 2)}° + ${f(b / 2)}° = `, v('x', gr(bien)), '.']],
        fig, _datos: { tipo: 'bisect', idea: 'bisectrices', nivel: 2, sub: recta ? 'recta' : 'consecutivos', a, b, pide: 'MON' },
      };
    }
  }

  function vecesCS(rng) {
    if (rng.entero(1, 3) === 1) {
      const k = rng.elegir([4, 7, 13, 16, 25]), val = 270 / (k + 2);
      return {
        variables: {}, enunciado: [`Un ángulo mide x. Su suplemento más su complemento es ${k} veces el ángulo: S(x) + C(x) = ${k}x.`],
        pregunta: ['¿Cuánto mide el ángulo?'],
        datos: [D.C, D.S],
        correcta: val, fmt: gr,
        errores: [
          er('GE-CS4', 270 / k, 'Bien sumar 180° + 90°; pero el ángulo se resta en cada uno: 270° − 2x.'),
          er('GE-CS11', 270 / (k + 1), 'Bien plantear la suma; pero x se resta dos veces: 270° − 2x.'),
          er('GE-CS6', 90 - val, `Bien: ${gr(90 - val)} es su complemento. Pero se pide el ángulo.`),
          er('GE-CS9', 180 / (k + 1), 'Bien plantear con el suplemento; falta sumarle el complemento, 90° − x.'),
        ],
        solucion: [[`(180° − x) + (90° − x) = ${k}x, así que ${k + 2}x = 270.`], [`x = 270 ÷ ${k + 2} = ${f(val)}: el ángulo mide `, v('x', gr(val)), '.']],
        _datos: { tipo: 'veces-cs', idea: 'bisectrices', nivel: 3, sub: 'suma', k, pide: 'x' },
      };
    }
    const m = rng.elegir([3, 4, 7, 10, 19]), val = (90 * m - 180) / (m - 1);
    return {
      variables: {}, enunciado: [`Un ángulo mide x, y su suplemento es ${m} veces su complemento: S(x) = ${m} · C(x).`],
      pregunta: ['¿Cuánto mide el ángulo?'],
      datos: [D.C, D.S],
      correcta: val, fmt: gr,
      errores: [
        er('GE-CS2', (180 * m - 90) / (m - 1), `Bien plantear con ${m} veces; pero el ${m} multiplica al complemento, no al suplemento.`),
        er('GE-CS4', 180 / m, `Bien repartir 180° entre ${m}; pero el complemento también depende de x.`),
        er('GE-CS6', 90 - val, `Bien: ${gr(90 - val)} es el complemento. Pero se pide el ángulo.`),
      ],
      solucion: [[`180° − x = ${m}(90° − x) = ${90 * m}° − ${m}x.`], [`${m - 1}x = ${90 * m - 180}, así que x = ${f(val)}: el ángulo mide `, v('x', gr(val)), '.']],
      _datos: { tipo: 'veces-cs', idea: 'bisectrices', nivel: 3, sub: 'veces', m, pide: 'x' },
    };
  }

  const MAXIMOS = [[1, 2, 0], [2, 1, 0], [2, 1, 15], [2, 2, 10], [2, 3, 0], [2, 3, 15], [3, 1, 10], [3, 2, 15], [3, 2, 20], [3, 3, 0], [4, 1, 15], [4, 2, 0], [1, 1, 20], [5, 3, 10]];
  function maximo(rng) {
    for (const sigue = tope(); sigue();) {
      const [p, q, c] = rng.elegir(MAXIMOS), lim = (90 - c) / (p + q), bien = lim - 1, giro = 5 * rng.entero(0, 6);
      const ex = (k, cc) => `${k === 1 ? '' : k}x${cc ? ` + ${cc}°` : ''}`;
      const fig = abanico([{ id: 'A', dir: giro }, { id: 'B', dir: giro + p * bien }, { id: 'D', dir: giro + (p + q) * bien + c }],
        [Object.assign(dado(ex(p, 0)), { de: 'A', a: 'B', mide: p * bien }), Object.assign(dado(ex(q, c)), { de: 'B', a: 'D', mide: q * bien + c, radio: 34 })],
        { alt: '∠AOB y ∠BOD consecutivos, cada uno con su medida en x.' });
      if (!rotular(fig)) continue;
      return {
        variables: {}, enunciado: [`∠AOB y ∠BOD son consecutivos, con m∠AOB = ${ex(p, 0)} y m∠BOD = ${ex(q, c)}. ∠AOD es agudo.`],
        pregunta: ['¿Cuál es el mayor valor entero de x?'],
        datos: [D.consec('A', 'B', 'D'), D.agudo],
        correcta: bien, fmt: num,
        errores: [
          er('GE-ANG11', lim, `Bien plantear la desigualdad; pero con x = ${lim} el ángulo mide 90°: recto, no agudo.`),
          er('GE-ANG12', Math.ceil((180 - c) / (p + q)) - 1, 'Bien poner un tope; pero el tope del agudo es 90°, no 180°.'),
          er('GE-ANG8', (p + q) * bien + c, `Bien: con x = ${bien}, m∠AOD mide eso. Pero se pide x.`),
          er('GE-ANG16', Math.ceil(90 / (p + q) - c) - 1, `Bien despejar x; pero primero se resta ${c}° y después se divide.`),
        ],
        solucion: [[`∠AOD es agudo: ${igualG(p + q, c, 90, '<')}, así que x < ${lim}. El límite no entra: con ${lim}, sería recto.`], ['El mayor entero es x = ', v('x', num(bien)), '.']],
        fig, _datos: { tipo: 'maximo', idea: 'bisectrices', nivel: 3, p, q, c, pide: 'x' },
      };
    }
  }

  // =============================== Idea 5: paralelas y una secante ===============================
  // L₂ abajo (cruce P), L₁ arriba (cruce Q); la secante pasa por P y Q con inclinación th. Cuadrantes de cada cruce:
  // ad (arriba a la derecha), ai, bi, bd. abre: cuánto se abre L₁ (0: paralelas); giro: toda la figura girada.
  const IGUAL_TH = c => c === 'ad' || c === 'bi';
  const medidaEn = (th, c) => (IGUAL_TH(c) ? th : 180 - th);
  const PARES = [
    { nombre: 'correspondientes', p: 'ad', q: 'ad', igual: true }, { nombre: 'correspondientes', p: 'ai', q: 'ai', igual: true },
    { nombre: 'correspondientes', p: 'bd', q: 'bd', igual: true }, { nombre: 'correspondientes', p: 'bi', q: 'bi', igual: true },
    { nombre: 'alternos internos', p: 'ad', q: 'bi', igual: true }, { nombre: 'alternos internos', p: 'ai', q: 'bd', igual: true },
    { nombre: 'alternos externos', p: 'bi', q: 'ad', igual: true }, { nombre: 'alternos externos', p: 'bd', q: 'ai', igual: true },
    { nombre: 'conjugados internos', p: 'ad', q: 'bd', igual: false }, { nombre: 'conjugados internos', p: 'ai', q: 'bi', igual: false },
    { nombre: 'conjugados externos', p: 'bd', q: 'ad', igual: false }, { nombre: 'conjugados externos', p: 'bi', q: 'ai', igual: false },
  ];
  const LADOS = { ad: ['d', 'u'], ai: ['u', 'i'], bi: ['i', 'b'], bd: ['b', 'd'] };
  function paralelasFig(th, marcas, o = {}) {
    const giro = o.giro || 0, abre = o.abre || 0, h = 3.6, t = Math.tan(th * RAD);
    const rot = p => { const c = Math.cos(giro * RAD), s = Math.sin(giro * RAD); return [p[0] * c - p[1] * s, p[0] * s + p[1] * c]; };
    const Pp = [-h / 2 / t, 0], Qp = [h / 2 / t, h], u = polar(1, th), w = polar(1, abre);
    const base = { P: Pp, Q: Qp, Pd: [Pp[0] + 1, 0], Pi: [Pp[0] - 1, 0], Pu: [Pp[0] + u[0], u[1]], Pb: [Pp[0] - u[0], -u[1]],
      Qd: [Qp[0] + w[0], h + w[1]], Qi: [Qp[0] - w[0], h - w[1]], Qu: [Qp[0] + u[0], h + u[1]], Qb: [Qp[0] - u[0], h - u[1]] };
    const puntos = Object.entries(base).map(([id, p]) => { const q = rot(p); return { id, x: q[0], y: q[1], sinPunto: true }; });
    const R = 3.4, esq = [[-R, 0], [R, 0], [-R, h], [R, h]].map(rot), xs = esq.map(p => p[0]), ys = esq.map(p => p[1]);
    const marca = !(o.marcarParalelas === false || abre);
    // L₁ y L₂ en la punta de su recta más lejana del cruce con la secante.
    const xL2 = Pp[0] < 0 ? R - 0.55 : -R + 0.35, xL1 = Qp[0] < 0 ? R - 0.55 : -R + 0.35;
    const off = giro ? 0.66 : 0.42, l2 = rot([xL2, off]), l1 = rot([xL1, h + (xL1 - Qp[0]) * Math.tan(abre * RAD) + off]);
    return { alt: o.alt || 'Dos rectas cortadas por una secante.', vista: { x: [Math.min(...xs) - 0.5, Math.max(...xs) + 0.5], y: [Math.min(...ys) - (giro ? 1.6 : 1.3), Math.max(...ys) + (giro ? 1.6 : 1.3)] }, alto: 260,
      puntos, segmentos: [{ de: 'Pi', a: 'Pd', recta: true, paralela: marca ? 1 : 0 }, { de: 'Qi', a: 'Qd', recta: true, paralela: marca ? 1 : 0 }, { de: 'Pb', a: 'Qu', recta: true }],
      rotulos: [{ x: l2[0], y: l2[1], texto: 'L₂', fijo: true }, { x: l1[0], y: l1[1], texto: 'L₁', fijo: true }],
      angulos: marcas.map(m => { const [l1s, l2s] = LADOS[m.cuad]; return Object.assign({ en: m.cruce, de: m.cruce + l1s, a: m.cruce + l2s, radio: 20, mide: m.mide }, m.color ? { color: m.color } : {}, { etiqueta: { texto: m.texto, color: m.color } }); }) };
  }
  const mk = (cruce, cuad, mide, texto, color) => ({ cruce, cuad, texto, color, mide });
  const L12 = 'L₁ ∥ L₂';

  function par(rng) {
    for (const sigue = tope(); sigue();) {
      const th = 5 * rng.entero(10, 26);
      if (th === 90) continue;
      const nombrado = rng.entero(1, 3) === 1;
      let k1, c1, k2, c2, pr = null;
      if (nombrado) { pr = rng.elegir(PARES); [k1, c1, k2, c2] = rng.moneda() ? ['P', pr.p, 'Q', pr.q] : ['Q', pr.q, 'P', pr.p]; }
      else { c1 = rng.elegir(LADOS_K); k1 = rng.elegir(['P', 'Q']); c2 = rng.elegir(LADOS_K); k2 = rng.elegir(['P', 'Q']); if (c2 === c1 && k2 === k1) k2 = k1 === 'P' ? 'Q' : 'P'; }
      const val = medidaEn(th, c1), x = medidaEn(th, c2), giro = nombrado ? 0 : rng.elegir([0, 0, 15, -20]);
      const fig = paralelasFig(th, [mk(k1, c1, val, `${val}°`, 'h'), mk(k2, c2, x, 'x')], { giro });
      if (!rotular(fig)) continue;
      const igual = x === val;
      return {
        variables: {}, enunciado: [nombrado ? `${L12} y una secante las corta. Dos ${pr.nombre}: uno mide ${val}° y el otro, x.` : `${L12} y una secante las corta. Uno de los ángulos mide ${val}°.`],
        pregunta: ['¿Cuánto vale x?'],
        datos: [D.iguales, D.suman, D.cruce],
        correcta: x, fmt: num,
        errores: [
          er('GE17-a', 180 - x, igual ? 'Bien buscar la regla del par; pero estos dos ocupan lugares que miden igual.' : 'Bien buscar la regla del par; pero estos dos suman 180°, no son iguales.'),
          er('GE-PAR2', Math.abs(90 - val), 'Bien buscar lo que falta; pero entre paralelas se completa 180°, no 90°.'),
          er('GE-PAR3', 360 - val, 'Bien: una vuelta mide 360°. Pero estos dos no dan la vuelta entera.'),
        ],
        solucion: [[igual ? 'Los dos ocupan lugares de igual medida.' : 'Los dos ocupan lugares que juntos suman 180°.'], [igual ? 'x = ' : `x + ${val}° = 180°, así que x = `, v('x', num(x)), '.']],
        fig, _datos: { tipo: 'par', idea: 'paralelas', nivel: 1, sub: nombrado ? 'nombrado' : 'figura', th, dado: { cruce: k1, cuad: c1 }, pedido: { cruce: k2, cuad: c2 }, pide: 'x' },
      };
    }
  }
  const LADOS_K = ['ad', 'ai', 'bi', 'bd'];

  function ecuacion(rng, op = {}) {
    for (const sigue = tope(); sigue();) {
      const pr = rng.elegir(PARES), th = 5 * rng.entero(10, 26), m1 = medidaEn(th, pr.p), m2 = medidaEn(th, pr.q), xv = rng.entero(5, 25);
      if (th === 90) continue;
      const a1 = rng.entero(2, 5), a2r = rng.entero(1, 4), a2 = a2r === a1 ? a1 - 1 : a2r, b1 = m1 - a1 * xv, b2 = m2 - a2 * xv;
      if (a1 === a2 || Math.abs(b1) > 60 || Math.abs(b2) > 60 || !b1 || !b2) continue;
      const nombra = op.nombra !== undefined ? op.nombra : rng.moneda();
      const fig = paralelasFig(th, [mk('P', pr.p, m1, exG(a1, b1), 'h'), mk('Q', pr.q, m2, exG(a2, b2), 'h')]);
      if (!rotular(fig)) continue;
      const otro = pr.igual ? (180 - b1 - b2) / (a1 + a2) : (b2 - b1) / (a1 - a2);
      return {
        variables: {}, enunciado: [nombra ? `${L12}. Dos ${pr.nombre} miden ${exG(a1, b1)} y ${exG(a2, b2)}.` : `${L12}. Dos ángulos de la figura miden ${exG(a1, b1)} y ${exG(a2, b2)}.`],
        pregunta: ['¿Cuánto vale x?'],
        datos: [D.iguales, D.suman, D.cruce],
        correcta: xv, fmt: num,
        errores: [
          er('GE17-a', otro, pr.igual ? 'Bien plantear una ecuación; pero estos dos son iguales: no suman 180°.' : 'Bien plantear una ecuación; pero estos dos suman 180°: no son iguales.'),
          er('GE-PAR4', m1, `Bien: ${m1}° es lo que mide un ángulo. Pero se pide x.`),
          er('GE-PAR4', m2 === m1 ? 180 - m1 : m2, 'Bien resuelto el ángulo; pero se pide x, no la medida.'),
          er('GE-PAR2', (90 - b1 - b2) / (a1 + a2), 'Bien juntar las dos expresiones; pero entre paralelas no se completa 90°.'),
          er('GE-PAR7', pr.igual ? Math.abs((b1 + b2) / (a1 - a2)) : (180 + b1 + b2) / (a1 + a2), 'Bien la regla del par; pero al pasar un número al otro lado cambia de signo.'),
        ],
        solucion: [[`Son ${pr.nombre}: ${pr.igual ? 'iguales' : 'suman 180°'}.`], [pr.igual ? `${exG(a1, b1)} = ${exG(a2, b2)}, así que x = ` : `${exG(a1, b1)} + ${exG(a2, b2)} = 180°, así que x = `, v('x', num(xv)), '.']],
        fig, _datos: { tipo: 'ecuacion', idea: 'paralelas', nivel: 2, sub: nombra ? 'nombra' : 'figura', par: pr.nombre, igual: pr.igual, a1, b1, a2, b2, th, cuadP: pr.p, cuadQ: pr.q, pide: 'x' },
      };
    }
  }

  function sonParalelas(rng) {
    for (const sigue = tope(); sigue();) {
      const pr = rng.elegir(PARES), th = 5 * rng.entero(10, 26), si = rng.moneda(), dd = si ? 0 : rng.elegir([2, 3, 4, 5]) * rng.elegir([1, -1]);
      if (th === 90) continue;
      const mP = medidaEn(th, pr.p), mQ = medidaEn(th - dd, pr.q);
      const fig = paralelasFig(th, [mk('P', pr.p, mP, `${mP}°`, 'h'), mk('Q', pr.q, mQ, `${mQ}°`, 'h')], { abre: dd, marcarParalelas: false });
      if (!rotular(fig)) continue;
      const regla = pr.igual ? 'ser iguales' : 'sumar 180°', otra = pr.igual ? 'sumar 180°' : 'ser iguales';
      const correcta = si ? 'Sí: los dos cumplen la regla de su par' : `No: los ${pr.nombre} no cumplen su regla`;
      const errores = si ? [
        erT('GE17-a', `No: para ser paralelas deberían ${otra}`, `Bien revisar la regla del par; pero los ${pr.nombre} deben ${regla}.`),
        erT('GE17-b', 'No: en el dibujo no están marcadas como paralelas', 'Bien mirar las marcas; pero aquí lo deciden los ángulos.'),
        erT('GE-PAR5', 'No se sabe sin medir la distancia entre ellas', 'Bien: medir la distancia serviría. Pero un par de ángulos ya lo decide.'),
      ] : [
        erT('GE17-b', 'Sí: en el dibujo se ven paralelas', 'Bien mirar el dibujo para ubicarse; pero solo los ángulos lo deciden.'),
        erT('GE-PAR6', `Sí: la diferencia de ${Math.abs(dd)}° es muy chica`, 'Bien ver que la diferencia es chica; pero con cualquier diferencia las rectas se cortan.'),
        erT('GE-PAR5', 'No se sabe sin medir la distancia entre ellas', 'Bien: medir la distancia serviría. Pero un par de ángulos ya lo decide.'),
      ];
      return {
        variables: {}, enunciado: [`Una secante corta a L₁ y L₂. Dos ${pr.nombre} miden ${mP}° y ${mQ}°.`],
        pregunta: ['¿L₁ y L₂ son paralelas?'],
        datos: [D.iguales, D.suman, D.reves],
        texto: { correcta: { clave: correcta, texto: correcta }, errores },
        solucion: [[`Los ${pr.nombre} ${pr.igual ? 'deben medir igual' : 'deben sumar 180°'}.`], [pr.igual ? `${mP}° ${mP === mQ ? '=' : '≠'} ${mQ}°: ` : `${mP}° + ${mQ}° = ${mP + mQ}°: `, v('x', si ? 'son paralelas' : 'no son paralelas'), '.']],
        fig, _datos: { tipo: 'son-paralelas', idea: 'paralelas', nivel: 3, par: pr.nombre, igual: pr.igual, mP, mQ, abre: dd, pide: '¿paralelas?' },
      };
    }
  }

  function girada(rng) {
    for (const sigue = tope(); sigue();) {
      const pr = rng.elegir(PARES.filter(p => p.nombre.endsWith('externos'))), th = 5 * rng.entero(12, 24), m1 = medidaEn(th, pr.p), m2 = medidaEn(th, pr.q), xv = rng.entero(6, 25);
      if (th === 90) continue;
      const a1 = rng.entero(2, 5), a2 = rng.entero(1, a1 - 1), b1 = m1 - a1 * xv, b2 = m2 - a2 * xv;
      if (Math.abs(b1) > 60 || Math.abs(b2) > 60 || b1 === 0 || b2 === 0) continue;
      const giro = rng.elegir([25, 35, -30, 50, -45]);
      const fig = paralelasFig(th, [mk('P', pr.p, m1, exG(a1, b1), 'h'), mk('Q', pr.q, m2, exG(a2, b2), 'h')], { giro });
      if (!rotular(fig)) continue;
      const xMal = pr.igual ? (180 - b1 - b2) / (a1 + a2) : (b2 - b1) / (a1 - a2);
      return {
        variables: {}, enunciado: [`${L12}, aunque la figura esté girada. Los ${pr.nombre} miden ${exG(a1, b1)} y ${exG(a2, b2)}.`],
        pregunta: [`¿Cuánto mide el ángulo ${exG(a1, b1)}?`],
        datos: [D.iguales, D.suman],
        correcta: m1, fmt: gr,
        errores: [
          er('GE-PAR4', xv, `Bien hallar x = ${xv}; falta reemplazarlo en el ángulo.`),
          er('GE17-a', 180 - m1, pr.igual ? 'Bien la ecuación; pero ese es el vecino del ángulo: estos dos se igualan.' : 'Bien la ecuación; pero ese es el otro ángulo del par, no este.'),
          er('GE17-a', a1 * xMal + b1, pr.igual ? 'Bien plantear con los dos; pero los alternos externos son iguales, no suman 180°.' : 'Bien plantear con los dos; pero los conjugados externos suman 180°, no son iguales.'),
        ],
        solucion: [[`Girar no cambia nada. Son ${pr.nombre}: ${pr.igual ? 'iguales' : 'suman 180°'}, y x = ${xv}.`], [`${conX(a1, b1, xv)} = `, v('x', gr(m1)), '.']],
        fig, _datos: { tipo: 'girada', idea: 'paralelas', nivel: 3, par: pr.nombre, igual: pr.igual, a1, b1, a2, b2, th, pide: 'el ángulo' },
      };
    }
  }

  // =============================== Idea 6: el quiebre entre paralelas ===============================
  // L₁ arriba (y = 3,6) y L₂ abajo (y = 0). P en L₁, V entre las dos (el quiebre abre hacia la izquierda), Q en L₂.
  // a: el ángulo de PV con L₁ (hacia la derecha de P); b: el de QV con L₂ (hacia la derecha de Q); x = a + b en V.
  function quiebreFig(a, b, marcas, alt) {
    const h = 3.6, h1 = h / 2, P0 = [0, h], V0 = [h1 / Math.tan(a * RAD), h - h1], Q0 = [V0[0] - (h - h1) / Math.tan(b * RAD), 0];
    const lo = Math.min(P0[0], Q0[0]) - 1.5, hi = V0[0] + 1.3, cx = (lo + hi) / 2, sh = p => [p[0] - cx, p[1]];
    const [Pp, Vp, Qp] = [P0, V0, Q0].map(sh), X0 = lo - cx, X1 = hi - cx;
    const puntos = [{ id: 'P', x: Pp[0], y: Pp[1], rotulo: 'P', lado: 115 }, { id: 'V', x: Vp[0], y: Vp[1], rotulo: 'V', lado: 0 }, { id: 'Q', x: Qp[0], y: Qp[1], rotulo: 'Q', lado: 235 },
      { id: 'Pd', x: Pp[0] + 1, y: h, sinPunto: true }, { id: 'Pi', x: Pp[0] - 1, y: h, sinPunto: true }, { id: 'Qd', x: Qp[0] + 1, y: 0, sinPunto: true },
      { id: 'Ti', x: X0, y: h, sinPunto: true }, { id: 'Td', x: X1, y: h, sinPunto: true }, { id: 'Bi', x: X0, y: 0, sinPunto: true }, { id: 'Bd', x: X1, y: 0, sinPunto: true }];
    const A = { a: ['P', 'Pd', 'V', a], afP: ['P', 'Pi', 'V', 180 - a], b: ['Q', 'Qd', 'V', b], x: ['V', 'P', 'Q', a + b] };
    const angulos = Object.entries(marcas).map(([k, m]) => Object.assign({ en: A[k][0], de: A[k][1], a: A[k][2], radio: 22, mide: A[k][3], etiqueta: { texto: m.texto, color: m.color } }, m.color ? { color: m.color } : {}));
    const ls = [[X0 + 0.3, h + 0.4, 'L₁'], [X0 + 0.3, 0.4, 'L₂']];
    return { alt, vista: { x: [X0, X1], y: [-0.9, h + 0.9] }, alto: 250, puntos,
      segmentos: [{ de: 'Ti', a: 'Td', recta: true, paralela: 1 }, { de: 'Bi', a: 'Bd', recta: true, paralela: 1 }, { de: 'P', a: 'V', grosor: 'variable' }, { de: 'V', a: 'Q', grosor: 'variable' }],
      rotulos: ls.map(([x, y, t]) => ({ x, y, texto: t, fijo: true })), angulos };
  }
  const ALT_Q = 'La línea P–V–Q dobla en V entre dos rectas paralelas, L₁ arriba y L₂ abajo.';
  function quiebre(rng) {
    for (const sigue = tope(); sigue();) {
      const a = 5 * rng.entero(4, 13), b = 5 * rng.entero(4, 13), x = a + b;
      const fig = quiebreFig(a, b, { a: { texto: `${a}°`, color: 'h' }, b: { texto: `${b}°`, color: 'h' }, x: { texto: 'x' } }, ALT_Q);
      if (!rotular(fig)) continue;
      return {
        // Sin figura (papel-3) el texto tiene que dar un solo dibujo (auditoría, 17 nov: con P y Q a lados distintos de V,
        // x saldría 160°): P y Q a la izquierda de V y los ángulos medidos hacia V.
        variables: {}, enunciado: [`${L12}. P está en L₁ y Q en L₂, los dos a la izquierda de V. PV forma ${a}° con L₁ y QV forma ${b}° con L₂, medidos del lado de V.`],
        pregunta: ['¿Cuánto vale x, el quiebre en V?'],
        datos: [D.quiebre, D.alt],
        correcta: x, fmt: num,
        errores: [
          er('GE17-a', 180 - x, 'Bien usar la paralela por V; pero cada par es alterno: se iguala, no se resta de 180°.'),
          er('GE-QB1', x / 2, 'Bien sumar los dos; partir en mitades serviría si se pidiera una sola parte.'),
          er('GE-QB3', Math.abs(a - b), 'Bien comparar los dos tramos; pero la paralela por V los junta, no los resta.'),
        ],
        solucion: [['La paralela por V parte x en dos: cada parte es alterna interna con el ángulo de su tramo.'], [`x = ${a} + ${b} = `, v('x', num(x)), '.']],
        fig, _datos: { tipo: 'quiebre', idea: 'quiebre', nivel: 1, a, b, pide: 'x' },
      };
    }
  }

  function quiebreVeces(rng) {
    for (const sigue = tope(); sigue();) {
      const m = rng.elegir([2, 3]), b = 5 * rng.entero(3, Math.floor(70 / m / 5)), a = m * b, x = a + b;
      const fig = quiebreFig(a, b, { a: { texto: '?' }, b: { texto: 'b', color: 'h' }, x: { texto: `${x}°`, color: 'h' } }, ALT_Q);
      if (!rotular(fig)) continue;
      return {
        variables: {}, enunciado: [`${L12}. El quiebre en V mide ${x}°, y el ángulo a de PV con L₁ es ${m} veces el ángulo b de QV con L₂.`],
        pregunta: ['¿Cuánto vale a?'],
        datos: [D.quiebre, D.alt],
        correcta: a, fmt: num,
        errores: [
          er('GE-QB4', b, `Bien hallar b = ${b}; falta multiplicar por ${m} para tener a.`),
          er('GE-QB1', x / 2, 'Bien usar el quiebre; partirlo en mitades serviría si a y b midieran igual.'),
          er('GE-QB4', x / m, `Bien repartir ${x}°; pero entre ${m + 1} partes, no entre ${m}.`),
          er('GE17-a', m * (180 - x) / (m + 1), 'Bien repartir en partes; pero el quiebre es la suma de a y b, no lo que les falta para 180°.'),
        ],
        solucion: [[`a + b = ${x} y a = ${m}b: ${m + 1}b = ${x}, así que b = ${b}.`], [`a = ${m} · ${b} = `, v('x', num(a)), '.']],
        fig, _datos: { tipo: 'quiebre-veces', idea: 'quiebre', nivel: 2, a, b, m, pide: 'a' },
      };
    }
  }

  function quiebreAfuera(rng) {
    for (const sigue = tope(); sigue();) {
      const a = 5 * rng.entero(4, 13), b = 5 * rng.entero(4, 13), af = 180 - a, x = a + b;
      const fig = quiebreFig(a, b, { afP: { texto: `${af}°`, color: 'h' }, b: { texto: `${b}°`, color: 'h' }, x: { texto: 'x' } }, ALT_Q);
      if (!rotular(fig)) continue;
      return {
        variables: {}, enunciado: [`${L12}. Arriba, PV forma ${af}° con L₁, medido del lado de afuera; abajo, QV forma ${b}° con L₂.`],
        pregunta: ['¿Cuánto vale x, el quiebre en V?'],
        datos: [D.quiebre, D.alt, D.vecinos],
        correcta: x, fmt: num,
        errores: [
          er('GE-QB5', af + b, 'Bien sumar los ángulos de los tramos; pero primero se pasa el de arriba al lado de V.'),
          er('GE17-a', 180 - x, 'Bien usar la paralela por V; pero cada par es alterno: se iguala, no se resta de 180°.'),
          er('GE-QB4', a, `Bien pasar ${af}° al lado de V: da ${a}°. Falta sumarle el de abajo.`),
        ],
        solucion: [[`Del lado de V, PV forma 180° − ${af}° = ${a}° con L₁.`], [`x = ${a} + ${b} = `, v('x', num(x)), '.']],
        fig, _datos: { tipo: 'quiebre-afuera', idea: 'quiebre', nivel: 2, a, b, pide: 'x' },
      };
    }
  }

  // El serrucho: P en L₁, M (abre a la izquierda), N (abre a la derecha), Q en L₂. a, mm, b: los ángulos de cada tramo
  // con la horizontal; el quiebre en M mide a + mm y el de N, mm + b.
  function serruchoFig(a, mm, b, T) {
    const HS = 5.2, P0 = [0, HS], M0 = [2 / Math.tan(a * RAD), HS - 2], N0 = [M0[0] - 1.2 / Math.tan(mm * RAD), 2], Q0 = [N0[0] + 2 / Math.tan(b * RAD), 0];
    const xs = [P0, M0, N0, Q0].map(p => p[0]), lo = Math.min(...xs) - 1.6, hi = Math.max(...xs) + 1.3, cx = (lo + hi) / 2, sh = p => [p[0] - cx, p[1]];
    const [p, m, n, q] = [P0, M0, N0, Q0].map(sh), X0 = lo - cx, X1 = hi - cx;
    const puntos = [{ id: 'P', x: p[0], y: p[1], rotulo: 'P', lado: 125 }, { id: 'M', x: m[0], y: m[1], rotulo: 'M', lado: 0 }, { id: 'N', x: n[0], y: n[1], rotulo: 'N', lado: 180 }, { id: 'Q', x: q[0], y: q[1], rotulo: 'Q', lado: -55 },
      { id: 'Pd', x: p[0] + 1, y: HS, sinPunto: true }, { id: 'Qi', x: q[0] - 1, y: 0, sinPunto: true },
      { id: 'Ti', x: X0, y: HS, sinPunto: true }, { id: 'Td', x: X1, y: HS, sinPunto: true }, { id: 'Bi', x: X0, y: 0, sinPunto: true }, { id: 'Bd', x: X1, y: 0, sinPunto: true }];
    const an = (en, de, aa, mide, t) => Object.assign({ en, de, a: aa, radio: 20, mide, etiqueta: { texto: t.texto, color: t.color } }, t.color ? { color: t.color } : {});
    return { alt: 'Una línea quebrada P–M–N–Q entre dos paralelas, L₁ arriba y L₂ abajo: dobla en M y en N.', vista: { x: [X0, X1], y: [-0.8, HS + 0.8] }, alto: 270, puntos,
      segmentos: [{ de: 'Ti', a: 'Td', recta: true, paralela: 1 }, { de: 'Bi', a: 'Bd', recta: true, paralela: 1 }, { de: 'P', a: 'M', grosor: 'variable' }, { de: 'M', a: 'N', grosor: 'variable' }, { de: 'N', a: 'Q', grosor: 'variable' }],
      rotulos: [{ x: X0 + 0.3, y: HS + 0.4, texto: 'L₁', fijo: true }, { x: X0 + 0.3, y: 0.4, texto: 'L₂', fijo: true }],
      angulos: [an('P', 'Pd', 'M', a, T.a), an('M', 'P', 'N', a + mm, T.x), an('N', 'M', 'Q', mm + b, T.y), an('Q', 'Qi', 'N', b, T.b)] };
  }
  function serrucho(rng) {
    for (const sigue = tope(); sigue();) {
      const a = 5 * rng.entero(5, 11), mm = 5 * rng.entero(5, 9), b = 5 * rng.entero(5, 11), x = a + mm, y = mm + b, pideM = rng.moneda();
      const H = { color: 'h' };
      const fig = serruchoFig(a, mm, b, { a: Object.assign({ texto: `${a}°` }, H), b: Object.assign({ texto: `${b}°` }, H), x: pideM ? { texto: '?' } : Object.assign({ texto: `${x}°` }, H), y: pideM ? Object.assign({ texto: `${y}°` }, H) : { texto: '?' } });
      if (!rotular(fig)) continue;
      const bien = pideM ? x : y, dadoQ = pideM ? y : x;
      return {
        variables: {}, enunciado: [`${L12}. La línea P–M–N–Q dobla dos veces. En P forma ${a}° con L₁, en Q forma ${b}° con L₂ y en ${pideM ? 'N' : 'M'} dobla ${dadoQ}°.`],
        pregunta: [`¿Cuánto mide el quiebre en ${pideM ? 'M' : 'N'}?`],
        datos: [D.serrucho, D.cadaQuiebre],
        correcta: bien, fmt: gr,
        errores: [
          er('GE-QB6', a + dadoQ + b, 'Bien juntar ángulos; pero los de un lado se igualan con los del otro, no se suman todos.'),
          er('GE-QB7', a + b, `Bien sumar ${a}° y ${b}°; con un solo quiebre bastaría. Aquí el tramo del medio también cuenta.`),
          er('GE-QB4', mm, `Bien hallar el ángulo del tramo del medio, ${mm}°; falta sumarle ${pideM ? `${a}°` : `${b}°`}.`),
        ],
        solucion: pideM
          ? [[`En N: ${y}° = m + ${b}°, así que m = ${mm}: el tramo del medio forma ${mm}° con una paralela.`], [`El quiebre en M: ${a}° + ${mm}° = `, v('x', gr(x)), '.']]
          : [[`En M: ${x}° = ${a}° + m, así que m = ${mm}: el tramo del medio forma ${mm}° con una paralela.`], [`El quiebre en N: ${mm}° + ${b}° = `, v('x', gr(y)), '.']],
        fig, _datos: { tipo: 'serrucho', idea: 'quiebre', nivel: 3, a, m: mm, b, pide: pideM ? 'M' : 'N' },
      };
    }
  }

  // =============================== Armado ===============================
  const TIPOS = {
    'tramo-orden': tramoOrden, entre, pisan, razon, 'examen-seg': examenSeg,
    mitad, 'medio-entre': medioEntre, afuera, 'dos-medios': dosMedios, equidistante,
    clase, reloj, 'consec-x': consecX, 'pisan-ang': pisanAng, vuelta,
    'comp-sup': compSup, 'veces-x': vecesX, cadena, bisect, 'veces-cs': vecesCS, maximo,
    par, ecuacion, 'son-paralelas': sonParalelas, girada,
    quiebre, 'quiebre-veces': quiebreVeces, 'quiebre-afuera': quiebreAfuera, serrucho,
  };
  const IDEAS = {
    'suma-de-segmentos': ['tramo-orden', 'entre', 'pisan', 'razon', 'examen-seg'],
    'punto-medio': ['mitad', 'medio-entre', 'afuera', 'dos-medios', 'equidistante'],
    abertura: ['clase', 'reloj', 'consec-x', 'pisan-ang', 'vuelta'],
    bisectrices: ['comp-sup', 'veces-x', 'cadena', 'bisect', 'veces-cs', 'maximo'],
    paralelas: ['par', 'ecuacion', 'son-paralelas', 'girada'],
    quiebre: ['quiebre', 'quiebre-veces', 'quiebre-afuera', 'serrucho'],
  };
  // Papel (regla 6; herramientas/papel-generador.js usa «papel-1» a «papel-8»: 3 básicos, 3 intermedios y 2 avanzados).
  // Solo tipos que se resuelven con el texto (el papel no lleva la figura), uno o dos por idea.
  const PAPEL = { 'papel-1': 'tramo-orden', 'papel-2': 'reloj', 'papel-3': 'quiebre', 'papel-4': 'pisan', 'papel-5': 'cadena',
    'papel-6': 'ecuacion', 'papel-7': 'equidistante', 'papel-8': 'veces-cs' };
  const PAPEL_OP = { 'papel-6': { nombra: true } };

  function generar(semilla, opciones = {}) {
    const rng = Azar.crear(`${ID}|${semilla}`);
    const fijo = PAPEL[String(semilla)] || opciones.tipo;
    const idea = opciones.idea && IDEAS[opciones.idea] ? opciones.idea : rng.elegir(Object.keys(IDEAS));
    const tipo = fijo || rng.elegir(IDEAS[idea]);
    for (let intento = 0; intento < 200; intento++) {
      const pr = TIPOS[tipo](rng, PAPEL_OP[String(semilla)] || {});
      if (pr.F && (!cotasCaben(pr.F) || !marcasCaben(pr.F))) continue;
      let alternativas, valor;
      if (pr.texto) {
        alternativas = P.armarTexto({ correcta: pr.texto.correcta, errores: pr.texto.errores, rng });
        valor = pr.texto.correcta.clave;
      } else {
        // Escala de los distractores (decisión de Gerson, 12 nov): entre 1/20 y 20 veces la correcta, sin ceros.
        const errores = pr.errores.filter(e => Number.isFinite(e.valor) && e.valor > 0 && P.enEscala(e.valor, pr.correcta, e.id));
        alternativas = P.armar({ correcta: pr.correcta, errores, rng, texto: pr.fmt });
        valor = pr.correcta;
      }
      if (alternativas.length < 4) continue;
      const extra = pr.F ? segEsc(pr.F) : pr.fig ? angEsc(pr.fig) : {};
      return Object.assign({
        id: `${ID}#${semilla}`, variables: Object.assign({ x: { nombre: 'lo que se pide', color: 'f' } }, pr.variables),
        enunciado: pr.enunciado, pregunta: pr.pregunta, datos: pr.datos, alternativas, solucion: pr.solucion,
        respuesta: { valor, unidad: '' }, _datos: Object.assign({ valor: pr.valor !== undefined ? pr.valor : valor }, pr._datos),
      }, extra);
    }
    throw new Error(`${ID}: no se pudo generar un problema con 4 alternativas distintas (${tipo})`);
  }

  return { id: ID, titulo: 'Segmentos y ángulos', generar, TIPOS: Object.keys(TIPOS), IDEAS, marco, colores, marcasCaben, diag };
});
