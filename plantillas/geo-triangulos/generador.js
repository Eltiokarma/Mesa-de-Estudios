/*
 * Generador «Triángulos y líneas notables»: la práctica de las seis ideas de geometria.triangulos
 * (contenido/teoria/geometria/triangulos.js). Formato "predicciones" (docs/arquitectura.md). Funciona en el navegador
 * (window.Generadores['geo-triangulos']) y en Node (require). Propuesta: docs/etapa4/propuesta-geometria.md §7a y la
 * pregunta 11 (aprobada); docs/etapa4/decisiones.md manda.
 *
 * Tipos por idea (nivel 1: un paso; 2: dos pasos; 3: de examen):
 *   suma-de-angulos       tercero (1): el tercer ángulo · clase (1): la clase por sus ángulos, sin figura (a escala la
 *                         diría) · razon (2): ángulos en razón con k · con-x (2): los tres ángulos con x; se pide x o un
 *                         ángulo · mariposa (3): dos triángulos opuestos por el vértice (como San Marcos 2025-I)
 *   angulo-exterior       exterior (1): ∠ACD con A y B · lejano (1): un interior lejano con el exterior · ext-x (2): el
 *                         exterior y los lejanos con x · tres-ext (2): la suma de los tres exteriores · flecha (3): la
 *                         punta de flecha (cóncavo) · antena (3): el ángulo entre dos cables (como San Marcos 2024-I)
 *   isosceles             base (1): un ángulo de la base · punta (1): el ángulo entre los lados iguales · lados-x (2):
 *                         ángulos iguales, lados iguales, con x · orden (2): el lado mayor por los ángulos, sin figura ·
 *                         cadena (3): AB = BD = DC · paralela (3): la bisectriz y una paralela forman un isósceles (el
 *                         recíproco, como San Marcos 2025-II)
 *   desigualdad           max-min (1): el mayor o el menor entero del tercer lado · cuantos (2): cuántos enteros ·
 *                         iso-dt (2): el isósceles de lados a y b (solo una forma se cierra), sin figura · diagonal (3):
 *                         la diagonal de un cuadrilátero · punto (3): un punto interior a distancias dadas de dos
 *                         vértices y el menor perímetro entero (como San Marcos 2026-I)
 *   lineas-notables       reconocer (1): la línea por su marca, en tinta · donde (1): dónde cae el pie de la altura ·
 *                         ang-altura (2): ∠BAH · ang-bisectriz (2): ∠AFC · altura-bisectriz (3): ∠HAF = (m∠B − m∠C)/2
 *   angulo-de-bisectrices incentro (1): ∠BIC con m∠A · int-ext (2): ∠BEC · dos-ext (2): ∠BQC · con-bc (2): ∠BIC con
 *                         m∠B y m∠C · inverso (3): m∠A con ∠BIC o ∠BEC
 * Las cuentas de la desigualdad y de las tres bisectrices las hace `calc` de geo-triangulos-notables (tercerLado,
 * diagonal, perimetroDosDistancias, angulo): aquí no se copian (propuesta §7a). En el navegador, si ese generador no está
 * cargado, se pide al mismo servidor y se ejecuta (como rm-cuadros con su motor): la app carga un solo archivo por
 * generador y el service worker ya guarda el de geo-triangulos-notables, que es de la misma unidad.
 *
 * Datos (docs/plan-calidad.md §3, punto 13; molde §4): una línea por dato, las mismas definiciones y reglas de la teoría
 * (la suma de 180°, el exterior, la suma de los exteriores, el isósceles, la desigualdad, la altura, la mediana, la
 * bisectriz, la mediatriz, las marcas y las tres reglas de las bisectrices), nunca el paso hecho. En la idea 6, cuando se
 * elige la regla, van las reglas entre las que se elige.
 * Notación (decisiones de la etapa 4): m∠A cuando el vértice tiene un solo ángulo en la figura, m∠BAC o ∠ACD cuando hay
 * varios; x sin «°» («m∠A = 2x + 10°», «x = 20»); nunca C(x) ni S(x) (C es un vértice); los lados por sus letras (AB). Si
 * se pide x, las alternativas son números; si se pide un ángulo, medidas con grado.
 *
 * Colores (regla de la unidad, cabecera de la teoría; molde §5b), en los ejercicios: todo ángulo dado en carmín (h), con
 * su arco y su rótulo, también un exterior; lo pedido («?») en tinta; los interiores con 1, 2 y 3 arcos (A, B y C) y dos
 * ángulos iguales con los mismos arcos; las mitades de una bisectriz con una rayita (dos en la otra). En la idea 4, los
 * lados dados en naranja (o) y turquesa (i), igual en el texto y en la figura; el lado pedido en tinta, punteado. En la
 * idea 5, la línea por reconocer y sus marcas en tinta (el alumno lee su marca, no su color). El violeta (f) va solo en el
 * resultado de la solución: nunca en la figura ni en el enunciado. Sin verde.
 *
 * Figuras a escala (molde §6) con la pieza geo-figura, que la práctica carga sola: cada ángulo con su valor real; los
 * rótulos de los ángulos los pone este generador (rotular), con la misma escala que geo-figura (marco), sobre la
 * bisectriz o en el hueco más ancho, lejos de lados, letras, arcos y otros rótulos, y claramente más cerca de su vértice
 * que de cualquier otro vértice con ángulo (un rótulo que se aleja se leía como de otro). Los ángulos en cuñas angostas
 * (las de la punta de flecha, el cable lejano, B y C junto a sus bisectrices) llevan su arco y su valor va en el
 * enunciado, como en la teoría. Las marcas de «miden igual» van sobre una llave que une las puntas del tramo (molde §3),
 * nunca sobre la línea. Un recto que se pide va con arco y no con el cuadradito. Las letras de los pies de la idea 5 no se
 * escriben (H, M, F dirían qué línea es). Si un rótulo no cabe, se arma otro caso.
 *
 * Errores (respaldo: hipótesis de aula, sin medir, salvo GE7-a y GE7-b, las dos formas de GE7 —documentado, de segunda
 * mano— y GE8 —parcial—, con el informe como fuente): los códigos de la teoría (rutinas/teoria-geometria.md y docs/investigacion/
 * geometria-ideas-erroneas.md, «Triángulos (18 nov)»): GE-TRI, GE-RAZ, GE-EXT, GE-ISO, GE-DT, GE-LN y GE-BIS. Nuevos aquí
 * (hipótesis, anotados en el informe): GE-EXT14 da el ángulo del cable lejano con la antena; GE-EXT15 copia el ángulo del
 * cable lejano con el techo; GE-TRI12 y GE-TRI5 también en el tercer ángulo; GE-BIS14 parte A entre cuatro; GE-ISO16 busca el isósceles
 * en el triángulo de arriba (DE = AE); GE-ISO17 toma E como punto medio de AB; GE-ISO18 da el lado entero AB; GE-DT14 da
 * el menor valor de x en vez de contar cuántos; GE-DT15 en el punto interior olvida el límite de BC (solo PB + PC);
 * GE-DT16 redondea cada parte del perímetro por separado. Ninguna explicación nombra una alternativa por su letra (las
 * figuras tienen vértices A a E); cada una empieza por lo que el alumno hizo bien.
 * Cuentas comprobadas con un script aparte (casos.json, «verificacion») y con el recálculo de generador.test.js, que mide
 * los ángulos en las coordenadas de las figuras y cuenta los lados enteros por fuerza bruta.
 */
(function (root, fabrica) {
  const nodo = typeof module === 'object' && module.exports;
  const notables = nodo ? require('../geo-triangulos-notables/generador.js') : (root.Generadores && root.Generadores['geo-triangulos-notables']) || cargarNotables(root);
  const api = fabrica(nodo ? require('../../nucleo/azar.js') : root.Azar,
                      nodo ? require('../../nucleo/predicciones.js') : root.Predicciones, notables.calc);
  if (nodo) module.exports = api;
  else (root.Generadores = root.Generadores || {})[api.id] = api;

  // La app carga un solo archivo por generador (app/practica.js). calc vive en geo-triangulos-notables (y el service
  // worker ya lo guarda): se pide al mismo servidor y se ejecuta como un script en línea, antes de registrar este.
  function cargarNotables(r) {
    const doc = r.document, actual = doc && doc.currentScript;
    const url = new URL('../geo-triangulos-notables/generador.js', actual && actual.src ? actual.src : r.location.href).href;
    const x = new XMLHttpRequest();
    x.open('GET', url, false);
    x.send(null);
    if (x.status !== 200 && x.status !== 0) throw new Error('geo-triangulos: no se pudo cargar geo-triangulos-notables');
    const s = doc.createElement('script');
    s.text = `${x.responseText}\n//# sourceURL=${url}`;
    doc.head.appendChild(s);
    const g = r.Generadores && r.Generadores['geo-triangulos-notables'];
    if (!g) throw new Error('geo-triangulos: geo-triangulos-notables no se registró');
    return g;
  }
})(typeof self !== 'undefined' ? self : this, function (Azar, P, calc) {
  'use strict';
  const ID = 'geo-triangulos';
  const FUENTE = 'docs/investigacion/geometria-ideas-erroneas.md';
  const v = P.v;
  const f = x => P.formatear(x, 2);
  const gr = x => `${f(x)}°`;
  // Lo que vale una letra es un número: sin «°» (decisiones, cuarta ronda).
  const num = x => f(x);
  const cm = x => `${f(x)} cm`.replace(/ /g, ' ');
  const RAD = Math.PI / 180;
  const LET = ['A', 'B', 'C'];
  // GE7 (documentado, de segunda mano) y GE8 (parcial) tienen datos en el informe; GE7-a y GE7-b son sus dos formas. Todo
  // lo demás es hipótesis de aula.
  const respaldoDe = id => (/^GE7-[ab]$/.test(id) ? 'documentado' : id === 'GE8' ? 'parcial' : 'hipotesis');
  const er = (id, valor, explicacion) => ({ id, valor, explicacion, respaldo: respaldoDe(id), fuente: respaldoDe(id) === 'hipotesis' ? null : FUENTE });
  const erT = (id, texto, explicacion) => Object.assign(er(id, null, explicacion), { clave: texto, texto });
  // «2x + 10°», «x − 5°», «3x»: una expresión en x con grados.
  const exG = (a, b) => `${a === 1 ? '' : a}x${b ? ` ${b < 0 ? '−' : '+'} ${Math.abs(b)}°` : ''}`;
  // «3x − 4», «x + 9»: una expresión en x sin unidad (un lado, en cm).
  const exU = (a, b) => `${a === 1 ? '' : a}x${b ? ` ${b < 0 ? '−' : '+'} ${Math.abs(b)}` : ''}`;
  const ent = n => (Number.isInteger(n) && n > 0 ? n : NaN);

  // ---------- Datos (una línea cada uno; los de la teoría) ----------
  const D = {
    suma: 'En todo triángulo: m∠A + m∠B + m∠C = 180°.',
    sumaO: 'En todo triángulo, los tres ángulos interiores suman 180°.',
    clases: 'Acutángulo: tres ángulos agudos. Rectángulo: uno de 90°. Obtusángulo: uno de más de 90°.',
    razon: (x, y, z) => `Razón ${x} : ${y} : ${z}: los ángulos miden ${kT(x)}, ${kT(y)} y ${kT(z)} grados.`,
    opuestos: 'Opuestos por el vértice: miden igual.',
    ext: 'Un ángulo exterior mide lo que suman los dos ángulos interiores que no están a su lado.',
    ext3: 'Los tres ángulos exteriores de un triángulo, uno en cada vértice, suman 360°.',
    extDef: 'El ángulo exterior en C, ∠ACD, lo forman el lado CA y la prolongación de BC.',
    ady: 'Dos ángulos adyacentes en una recta suman 180°.',
    iso: 'Frente a lados iguales hay ángulos iguales, y frente a ángulos iguales, lados iguales.',
    mayor: 'Frente al ángulo mayor está el lado mayor.',
    dt: 'Desigualdad triangular: cada lado es menor que la suma de los otros dos y mayor que su diferencia.',
    trio: 'Tres largos forman triángulo si el mayor es menor que la suma de los otros dos.',
    isoL: 'Isósceles: dos de sus tres lados miden igual.',
    dentro: 'Con P dentro del triángulo ABC: AB + AC > PB + PC.',
    perimetro: 'Perímetro: la suma de los tres lados.',
    alt: 'Altura: va del vértice a la recta del lado opuesto y forma 90° con ella.',
    med: 'Mediana: va del vértice al punto medio del lado opuesto.',
    bis: 'Bisectriz: parte el ángulo del vértice en dos ángulos iguales.',
    mz: 'Mediatriz de un segmento: la recta perpendicular a él que pasa por su punto medio.',
    marcas: 'Marcas: cuadradito = 90°; rayitas iguales = tramos iguales; arcos iguales = ángulos iguales.',
    paralelas: 'Entre paralelas, los alternos internos son iguales.',
    bis2: 'Cada bisectriz parte su ángulo en dos ángulos iguales.',
    // Con paréntesis, iguales a la teoría («90° − m∠A ÷ 2» se leía como (90° − m∠A) ÷ 2; lector en frío, 18 nov).
    BIC: 'Dos bisectrices interiores, de B y de C: m∠BIC = 90° + (m∠A ÷ 2).',
    BEC: 'Interior de B con exterior de C: m∠BEC = m∠A ÷ 2.',
    BQC: 'Dos bisectrices exteriores, de B y de C: m∠BQC = 90° − (m∠A ÷ 2).',
  };
  const kT = p => (p === 1 ? 'k' : `${p}k`);

  // ======================= Figuras: la pieza geo-figura =======================
  // geo-figura dibuja trazos y arcos a escala; los rótulos de los ángulos, las medidas de los lados y las llaves los pone
  // este generador, con la misma escala que geo-figura (marco) y la misma estimación de ancho de texto que el kit (ancho).
  const ANCHO = 320, ME = 4, MG = 26, TAM = 16, ALTO_T = TAM * 1.05;
  function ancho(t, peso = 700) {
    let w = 0;
    for (const ch of String(t)) w += /\s/.test(ch) ? 0.28 : /[0-9]/.test(ch) ? 0.56 : /[ilI.,:;'|!]/.test(ch) ? 0.28 : /[mwMW%]/.test(ch) ? 0.82 : 0.55;
    return w * 16 * (peso >= 600 ? 1.05 : 1);
  }
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
    return { c, t1, dt };
  }
  const diag = { razon: '', llamadas: 0, fallas: 0 };
  const mal = r => { diag.razon = r; diag.fallas++; diag.lista = diag.lista || {}; const k = r.replace(/\(.*/, '').replace(/[\d.]+/g, '#'); diag.lista[k] = (diag.lista[k] || 0) + 1; return false; };
  // Hasta dónde puede quedar el borde de un rótulo de su vértice: 46 px, o algo más si el texto es ancho (2x + 15°).
  const LEJOS = w => Math.max(46, 28 + 0.55 * w), PROPIO = 0.85;
  /*
   * rotular(fig): pone los rótulos de los ángulos que traen «etiqueta» ({ texto, color }) y devuelve false si alguno no
   * cabe (fuera del lienzo, sobre una línea, una letra, un arco u otro rótulo), si su borde queda a más de 46 px de su vértice (algo más si es ancho) o si
   * no queda claramente más cerca de su vértice (0,85) que de otro vértice con ángulo. Del ángulo más chico al más grande:
   * el rótulo va sobre la bisectriz (o en el hueco más ancho si otro rayo del mismo vértice cae adentro), a la distancia
   * justa para no tocar los lados; si choca, se aleja de a 4 px. En un ángulo chico el arco crece hasta su rótulo. El mismo
   * método que plantillas/geo-segmentos-angulos.
   */
  function rotular(fig) {
    diag.llamadas++;
    const g = marco(fig), pts = {};
    for (const q of fig.puntos) pts[q.id] = q;
    const S = id => { const q = pts[id]; return [g.X(q.x), g.Y(q.y)]; };
    const lineas = fig.segmentos.map(l => [S(l.de), S(l.a)]);
    const puestos = [];
    for (const q of fig.puntos) if (q.rotulo) {
      const [x, y] = S(q.id), w = ancho(q.rotulo, 600);
      puestos.push(caja(x + Math.cos(q.lado * RAD) * 15, y - Math.sin(q.lado * RAD) * 15 + 1, w, ALTO_T));
    }
    for (const r of fig.rotulos || []) puestos.push(caja(g.X(r.x), g.Y(r.y) + 0.6, ancho(r.texto), ALTO_T));
    const dentro = b => b.x0 >= ME && b.x1 <= ANCHO - ME && b.y0 >= ME && b.y1 <= g.H - ME;
    for (const b of puestos) if (!dentro(b) || lineas.some(([p, q]) => tocaCaja(p, q, b))) return mal(`fijo ${JSON.stringify(b)}`);
    for (let i = 0; i < puestos.length; i++) for (let j = i + 1; j < puestos.length; j++) if (chocan(puestos[i], puestos[j], 1)) return mal('fijos que se pisan');
    const angs = fig.angulos;
    const sec = angs.map(a => sector(S, a));
    const rayos = id => fig.segmentos.flatMap(l => (l.de === id ? [l.a] : l.a === id ? [l.de] : [])).map(o => { const c = S(id), q = S(o); return Math.atan2(q[1] - c[1], q[0] - c[0]); });
    const orden = angs.map((_, i) => i).sort((i, j) => Math.abs(sec[i].dt) - Math.abs(sec[j].dt));
    const vertices = [...new Set(angs.map(a => a.en))];
    fig.rotulos = fig.rotulos || [];
    const nuevos = [];
    for (const i of orden) {
      const an = angs[i];
      if (!an.etiqueta) continue;
      let { c, t1, dt } = sec[i];
      const lo = dt >= 0 ? norm(t1) : norm(t1 + dt), w0 = Math.abs(dt);
      const ts = rayos(an.en).map(t => norm(t - lo)).filter(x => x > 1e-3 && x < w0 - 1e-3).sort((p, q) => p - q);
      let propio = true;
      if (ts.length) {
        const cs = [0, ...ts, w0]; let k = 0;
        for (let j = 1; j < cs.length - 1; j++) if (cs[j + 1] - cs[j] > cs[k + 1] - cs[k] + 1e-3) k = j;
        t1 = lo + cs[k]; dt = cs[k + 1] - cs[k]; propio = false;
      }
      const texto = an.etiqueta.texto, w = ancho(texto), h = ALTO_T, half = Math.abs(dt) / 2, bis = t1 + dt / 2;
      const sop = t => (w / 2) * Math.abs(Math.cos(t)) + (h / 2) * Math.abs(Math.sin(t));
      let d = (an.radio || 26) + 5 * ((an.marcas || 1) - 1) + 7 + sop(bis);
      if (half < Math.PI / 2 - 1e-6) for (const t of [t1, t1 + dt]) d = Math.max(d, (sop(t + Math.PI / 2) + 6) / Math.sin(half));
      if (propio && an.crece !== false) { const r2 = Math.round(d - sop(bis) - 5 - 5 * ((an.marcas || 1) - 1)); if (r2 > (an.radio || 26) + 6) an.radio = r2; }
      let z = null;
      for (let k = 0; k <= 12; k++) {
        const dd = d + 4 * k, b = caja(c[0] + dd * Math.cos(bis), c[1] + dd * Math.sin(bis), w, h);
        if (!dentro(b)) break;
        if (puestos.some(q => chocan(b, q))) continue;
        z = { b, x: c[0] + dd * Math.cos(bis), y: c[1] + dd * Math.sin(bis) };
        break;
      }
      if (!z) return mal(`sin lugar ${texto}`);
      // Cerca de su vértice: su borde a 46 px o menos (algo más si es ancho), y su centro claramente más cerca de él que de otro vértice con ángulo.
      const dv = Math.hypot(z.x - c[0], z.y - c[1]), borde = Math.hypot(Math.max(z.b.x0 - c[0], 0, c[0] - z.b.x1), Math.max(z.b.y0 - c[1], 0, c[1] - z.b.y1));
      if (borde > LEJOS(w)) return mal(`${texto} lejos de ${an.en} (${Math.round(borde)})`);
      for (const id of vertices) if (id !== an.en) { const [qx, qy] = S(id); if (dv >= PROPIO * Math.hypot(z.x - qx, z.y - qy)) return mal(`${texto} cerca de ${id}`); }
      puestos.push(z.b);
      nuevos.push({ i, b: z.b });
      fig.rotulos.push({ x: g.Xi(z.x), y: g.Yi(z.y - 0.6), texto, color: an.etiqueta.color, angulo: i });
    }
    // Ningún rótulo (de ángulo, letra o fijo) toca un arco, ni uno de ángulo una línea (los arcos con su radio final).
    const arcos = angs.map((a, i) => ({ c: S(a.en), t1: sec[i].t1, dt: sec[i].dt, recto: Math.abs(Math.abs(sec[i].dt) - Math.PI / 2) < 1e-3, r: [...Array(Math.max(1, a.marcas || 1)).keys()].map(k => (a.radio || 26) + 5 * k) }));
    for (const b of puestos) {
      if (nuevos.some(z => z.b === b) && lineas.some(([p, q]) => tocaCaja(p, q, b))) return mal('rótulo sobre una línea');
      for (const a of arcos) {
        if (a.recto) { const q = 12, pt = t => [a.c[0] + q * Math.cos(t), a.c[1] + q * Math.sin(t)], u = pt(a.t1), w = pt(a.t1 + a.dt); if ([[u, [u[0] + w[0] - a.c[0], u[1] + w[1] - a.c[1]]], [w, [u[0] + w[0] - a.c[0], u[1] + w[1] - a.c[1]]]].some(([p, q2]) => tocaCaja(p, q2, b, 2))) return mal('rótulo sobre un cuadradito'); continue; }
        for (const r of a.r) for (let k = 0; k <= 24; k++) {
          const t = a.t1 + a.dt * k / 24, x = a.c[0] + r * Math.cos(t), y = a.c[1] + r * Math.sin(t);
          if (x > b.x0 - 2 && x < b.x1 + 2 && y > b.y0 - 2 && y < b.y1 + 2) return mal('rótulo sobre un arco');
        }
      }
    }
    // Un recto que se pide va con arco: su lado «de» se gira 0,02° (no se ve; geo-figura dibujaría el cuadradito). También
    // un recto rotulado con una expresión («9k», «3x»): el cuadradito diría cuánto vale la letra.
    angs.forEach((a, i) => {
      if (a.etiqueta && (!a.etiqueta.color || !/^\d+°$/.test(a.etiqueta.texto)) && Math.abs(Math.abs(sec[i].dt) - Math.PI / 2) < 1e-3) {
        const V = pts[a.en], Dd = pts[a.de], t = Math.atan2(Dd.y - V.y, Dd.x - V.x) + (sec[i].dt < 0 ? 1 : -1) * 0.02 * RAD;
        const id = `~${i}`; fig.puntos.push({ id, x: V.x + Math.cos(t), y: V.y + Math.sin(t), sinPunto: true }); a.de = id;
      }
    });
    return true;
  }
  const angEsc = fig => ({ escena: { pieza: 'geo-figura', datos: fig } });
  // Tope de intentos de un tipo que arma su figura (si nunca cabe, falla en las pruebas y no se cuelga).
  const tope = () => { let k = 0; return () => { if (++k > 5000) throw new Error(`${ID}: la figura no cupo en 5000 intentos (${diag.razon})`); return true; }; };
  const polar = (c, r, g) => [c[0] + r * Math.cos(g * RAD), c[1] + r * Math.sin(g * RAD)];
  const corte = (A, B, C, Dd) => {
    const r = [B[0] - A[0], B[1] - A[1]], s = [Dd[0] - C[0], Dd[1] - C[1]], den = r[0] * s[1] - r[1] * s[0];
    const t = ((C[0] - A[0]) * s[1] - (C[1] - A[1]) * s[0]) / den;
    return [A[0] + r[0] * t, A[1] + r[1] * t];
  };
  const dist = (p, q) => Math.hypot(q[0] - p[0], q[1] - p[1]);
  const mas = (p, q, k) => [p[0] + (q[0] - p[0]) * k, p[1] + (q[1] - p[1]) * k];
  const unit = (p, q) => { const L = dist(p, q) || 1; return [(q[0] - p[0]) / L, (q[1] - p[1]) / L]; };
  // Los vértices del triángulo de base BC = 6 con ángulos b en B y c en C (ley de senos).
  const vert = (b, c, L = 6) => ({ A: polar([0, 0], L * Math.sin(c * RAD) / Math.sin((b + c) * RAD), b), B: [0, 0], C: [L, 0] });

  /*
   * figura(o): arma los datos de geo-figura.
   *   P: { id: [x, y] }        los puntos (sin punto dibujado); letras: ids con su letra (en el hueco más ancho entre sus trazos)
   *   segs: [{ de, a, color, grosor, discontinua }]
   *   angs: [{ en, de, a, mide, marcas, rayita, radio, color, texto }]   texto: el rótulo (con color, un dato; sin color, lo pedido)
   *   lados: [{ de, a, texto, color, ref }]   la medida de un lado, del lado contrario a ref (si no va, el centro de A, B, C)
   *   llaves: [{ de, a, marcas, ref }]        «miden igual» sobre una llave que une las puntas del tramo
   */
  function figura(o) {
    const ids = Object.keys(o.P), xs = ids.map(k => o.P[k][0]), ys = ids.map(k => o.P[k][1]), pad = o.pad === undefined ? 0.45 : o.pad;
    const fig = { alt: o.alt, vista: { x: [Math.min(...xs) - pad, Math.max(...xs) + pad], y: [Math.min(...ys) - (o.padAbajo === undefined ? pad : o.padAbajo), Math.max(...ys) + pad] }, alto: o.alto || 250,
      puntos: ids.map(id => Object.assign({ id, x: o.P[id][0], y: o.P[id][1], sinPunto: true }, (o.letras || []).includes(id) ? { rotulo: id } : {})),
      segmentos: (o.segs || []).map(s => Object.assign({}, s)),
      angulos: (o.angs || []).map(a => Object.assign({ en: a.en, de: a.de, a: a.a, radio: a.radio || 20, mide: a.mide, marcas: a.marcas || 1 },
        a.rayita ? { rayita: a.rayita } : {}, a.color ? { color: a.color } : {}, a.crece === false ? { crece: false } : {},
        a.texto !== undefined ? { etiqueta: Object.assign({ texto: a.texto }, a.color ? { color: a.color } : {}) } : {})),
      rotulos: [] };
    // Para las pruebas (geo-figura no los usa): los lados con medida en cm y los grupos de tramos marcados iguales.
    const medidas = (o.lados || []).filter(t => /^\d+(,\d+)? cm$/.test(t.texto.replace(/\u00a0/g, ' '))).map(t => ({ de: t.de, a: t.a, cm: Number(t.texto.replace(/\u00a0/g, ' ').replace(' cm', '').replace(',', '.')) }));
    if (medidas.length) fig.medidas = medidas;
    const grupos = {};
    for (const l of o.llaves || []) (grupos[l.marcas || 1] = grupos[l.marcas || 1] || []).push([l.de, l.a]);
    const iguales = Object.values(grupos).filter(gq => gq.length > 1);
    if (iguales.length) fig.iguales = iguales;
    const g = marco(fig), S = p => [g.X(p[0]), g.Y(p[1])], tri = ['A', 'B', 'C'].filter(k => o.P[k]);
    const cen = S([tri.reduce((s, k) => s + o.P[k][0], 0) / tri.length, tri.reduce((s, k) => s + o.P[k][1], 0) / tri.length]);
    const refDe = r => (r === undefined ? cen : S(Array.isArray(r) ? r : o.P[r]));
    const normal = (p, q, ref) => { const u = unit(p, q); let n = [-u[1], u[0]]; const m = mas(p, q, 0.5); if ((m[0] - ref[0]) * n[0] + (m[1] - ref[1]) * n[1] < 0) n = [-n[0], -n[1]]; return n; };
    const plano = q => [g.Xi(q[0]), g.Yi(q[1])];
    let k = 0;
    const nuevo = q => { const id = `~l${k++}`, p = plano(q); fig.puntos.push({ id, x: p[0], y: p[1], sinPunto: true }); return id; };
    for (const l of o.llaves || []) {
      const p = S(o.P[l.de]), q = S(o.P[l.a]), n = normal(p, q, refDe(l.ref)), u = unit(p, q), L = dist(p, q);
      const conLetra = id => (o.letras || []).includes(id);
      const off = 11, e0 = conLetra(l.de) ? Math.min(20, L / 3) : Math.min(5, L / 6), e1 = conLetra(l.a) ? Math.min(20, L / 3) : Math.min(5, L / 6);
      const Q = (base, kk, s) => [base[0] + u[0] * kk + n[0] * s, base[1] + u[1] * kk + n[1] * s];
      const a0 = Q(p, e0, 4), a1 = Q(p, e0, off), b1 = Q(q, -e1, off), b0 = Q(q, -e1, 4);
      const [i0, i1, j1, j0] = [a0, a1, b1, b0].map(nuevo);
      fig.segmentos.push({ de: i0, a: i1, grosor: 'fino', llave: true }, { de: i1, a: j1, grosor: 'fino', llave: true }, { de: j1, a: j0, grosor: 'fino', llave: true });
      const mk = Math.max(1, Math.min(3, l.marcas || 1)), mid = mas(a1, b1, 0.5);
      for (let i = 0; i < mk; i++) {
        const cc = [mid[0] + u[0] * (i - (mk - 1) / 2) * 5, mid[1] + u[1] * (i - (mk - 1) / 2) * 5];
        fig.segmentos.push({ de: nuevo([cc[0] - n[0] * 5 - u[0] * 1.5, cc[1] - n[1] * 5 - u[1] * 1.5]), a: nuevo([cc[0] + n[0] * 5 + u[0] * 1.5, cc[1] + n[1] * 5 + u[1] * 1.5]), llave: true });
      }
    }
    for (const t of o.lados || []) {
      const p = S(o.P[t.de]), q = S(o.P[t.a]), n = normal(p, q, refDe(t.ref)), w = ancho(t.texto), m = mas(p, q, t.en === undefined ? 0.5 : t.en);
      const d = (t.dist === undefined ? 6 : t.dist) + (w / 2) * Math.abs(n[0]) + (ALTO_T / 2) * Math.abs(n[1]);
      const c = [m[0] + n[0] * d, m[1] + n[1] * d];
      fig.rotulos.push(Object.assign({ x: g.Xi(c[0]), y: g.Yi(c[1] - 0.6), texto: t.texto, lado: true }, t.color ? { color: t.color } : {}));
    }
    // Las letras, en el hueco más ancho entre los trazos que llegan a su punto (o lo cruzan).
    for (const q of fig.puntos) if (q.rotulo) {
      const c = S([q.x, q.y]), ts = [];
      for (const l of fig.segmentos) {
        const a = fig.puntos.find(z => z.id === l.de), b = fig.puntos.find(z => z.id === l.a), pa = S([a.x, a.y]), pb = S([b.x, b.y]);
        if (dist(pa, c) < 0.5) { ts.push(Math.atan2(pb[1] - c[1], pb[0] - c[0])); continue; }
        if (dist(pb, c) < 0.5) { ts.push(Math.atan2(pa[1] - c[1], pa[0] - c[0])); continue; }
        const L = dist(pa, pb), u = unit(pa, pb), tt = (c[0] - pa[0]) * u[0] + (c[1] - pa[1]) * u[1], h = Math.abs((c[0] - pa[0]) * u[1] - (c[1] - pa[1]) * u[0]);
        if (h < 0.5 && tt > 0 && tt < L) ts.push(Math.atan2(u[1], u[0]), Math.atan2(-u[1], -u[0]));
      }
      for (const a of fig.angulos) if (a.en === q.id) { const s0 = sector(z => { const r = fig.puntos.find(y => y.id === z); return S([r.x, r.y]); }, a); ts.push(s0.t1 + s0.dt / 2); }
      const xs2 = ts.map(norm).sort((p, r) => p - r);
      let mejor = -Math.PI / 2;
      if (xs2.length) {
        let gap = -1;
        xs2.forEach((t, i) => { const sig = i + 1 < xs2.length ? xs2[i + 1] : xs2[0] + TAU; if (sig - t > gap) { gap = sig - t; mejor = (t + sig) / 2; } });
      }
      q.lado = -mejor / RAD;
    }
    return fig;
  }
  // Un ángulo interior de ABC: { A: ['B', 'C'], ... } con 1, 2 y 3 arcos.
  const LADOS = { A: ['B', 'C'], B: ['C', 'A'], C: ['A', 'B'] }, ARCOS = { A: 1, B: 2, C: 3 };
  const interior = (V, mide, o = {}) => Object.assign({ en: V, de: LADOS[V][0], a: LADOS[V][1], mide, marcas: o.marcas || ARCOS[V] }, o);
  const dado = (texto, o = {}) => Object.assign({ texto, color: 'h' }, o);
  const pide = (o = {}) => Object.assign({ texto: '?' }, o);
  // El triángulo de base BC con ángulos b y c; rot: { A, B, C } con dado(), pide() o { } (solo el arco, carmín).
  function triFig(b, c, rot, o = {}) {
    const { A, B, C } = vert(b, c), med = { A: 180 - b - c, B: b, C: c }, P = Object.assign({ A, B, C }, o.P || {});
    const angs = LET.filter(V => rot[V]).map(V => interior(V, med[V], Object.assign(rot[V].texto === undefined && !rot[V].color ? { color: 'h' } : {}, rot[V])));
    return figura(Object.assign({}, o, { P, letras: LET.concat(o.letras || []), segs: [{ de: 'A', a: 'B' }, { de: 'B', a: 'C' }, { de: 'C', a: 'A' }].concat(o.segs || []), angs: angs.concat(o.angs || []),
      alt: o.alt || `Triángulo ABC con ${f(med.A)}° en A, ${f(b)}° en B y ${f(c)}° en C.` }));
  }
  const tres = (rng, lo = 30, hi = 110) => {
    for (;;) { const a = 5 * rng.entero(lo / 5, hi / 5), b = 5 * rng.entero(lo / 5, hi / 5), c = 180 - a - b; if (c >= lo && c <= hi && a !== b && b !== c && a !== c) return [a, b, c]; }
  };

  // =============================== Idea 1: suma de ángulos ===============================
  function tercero(rng) {
    for (const sigue = tope(); sigue();) {
      const ang = tres(rng), j = rng.entero(0, 2), L = LET[j], [i, k] = [0, 1, 2].filter(x => x !== j), p = ang[i], q = ang[k];
      const rot = {}; LET.forEach((V, x) => { rot[V] = x === j ? pide() : dado(`${ang[x]}°`); });
      const fig = triFig(ang[1], ang[2], rot, { alt: `Triángulo ABC con ${p}° en ${LET[i]} y ${q}° en ${LET[k]}; el ángulo ${L} se pide.` });
      if (!rotular(fig)) continue;
      return {
        variables: {}, enunciado: [`En el triángulo ABC, m∠${LET[i]} = ${p}° y m∠${LET[k]} = ${q}°.`],
        pregunta: [`¿Cuánto mide el ángulo ${L}?`], datos: [D.suma], correcta: ang[j], fmt: gr,
        errores: [
          er('GE-TRI6', 180 - p, `Bien restar de 180°; falta quitar también los ${q}° del ángulo ${LET[k]}.`),
          er('GE-TRI7', p + q, 'Bien sumar los dos que conoces; el tercero es lo que les falta para 180°.'),
          er('GE-TRI12', 60, 'Bien repartir 180°; pero en partes iguales solo si los tres ángulos midieran igual.'),
          er('GE-TRI5', 360 - p - q, 'Bien restar los dos que conoces; pero los tres suman 180°, no 360°.'),
          er('GE-TRI6', 180 - q, `Bien restar de 180°; falta quitar también los ${p}° del ángulo ${LET[i]}.`),
        ],
        solucion: [[`Los tres suman 180°: el ángulo ${L} es lo que les falta a los otros dos.`], [`m∠${L} = 180° − ${p}° − ${q}° = `, v('x', gr(ang[j])), '.']],
        fig, _datos: { tipo: 'tercero', idea: 'suma-de-angulos', nivel: 1, angulos: { A: ang[0], B: ang[1], C: ang[2] }, pide: L },
      };
    }
  }

  const CLASE = { acu: 'Acutángulo', rect: 'Rectángulo', obt: 'Obtusángulo' };
  function clase(rng) {
    const t = rng.elegir(['acu', 'rect', 'obt']), x = t === 'rect' ? 90 : t === 'acu' ? rng.entero(60, 86) : rng.entero(94, 130);
    let p; do { p = rng.entero(15, 89); } while (180 - x - p < 15 || 180 - x - p > 89 || p === 180 - x - p);
    const q = 180 - x - p;
    const MAL = {
      acu: erT('GE-TRI8', CLASE.acu, `Bien: ${p}° y ${q}° son agudos. Falta mirar el tercer ángulo antes de decidir.`),
      rect: erT('GE-TRI9', CLASE.rect, 'Bien pensar en el tercer ángulo; sería rectángulo solo si midiera justo 90°.'),
      obt: erT('GE-TRI10', CLASE.obt, 'Bien pensar en el tercer ángulo; sería obtusángulo solo si pasara de 90°.'),
    };
    return {
      variables: {}, enunciado: [`En el triángulo ABC, m∠A = ${p}° y m∠B = ${q}°.`],
      pregunta: ['¿Qué clase de triángulo es, por sus ángulos?'], datos: [D.suma, D.clases],
      texto: { correcta: { clave: CLASE[t], texto: CLASE[t] }, errores: [...Object.keys(CLASE).filter(k => k !== t).map(k => MAL[k]),
        erT('GE-TRI11', 'No se sabe sin el tercer ángulo', 'Bien buscar el tercer ángulo; pero sale solo: los tres suman 180°.')] },
      solucion: [[`m∠C = 180° − ${p}° − ${q}° = ${x}°: ${t === 'rect' ? 'es recto' : t === 'obt' ? 'pasa de 90°' : 'los tres son agudos'}.`], ['Es ', v('x', CLASE[t].toLowerCase()), '.']],
      _datos: { tipo: 'clase', idea: 'suma-de-angulos', nivel: 1, angulos: { A: p, B: q }, pide: 'clase' },
    };
  }

  const RAZONES = [[2, 3, 4], [3, 4, 5], [2, 3, 5], [1, 2, 3], [3, 5, 7], [4, 5, 6], [3, 4, 8], [5, 6, 7], [2, 3, 7], [4, 5, 9], [3, 5, 10], [4, 7, 9], [5, 7, 8], [3, 4, 11]];
  function razon(rng) {
    for (const sigue = tope(); sigue();) {
      const raz = rng.elegir(RAZONES), orden = rng.elegir([[0, 1, 2], [1, 2, 0], [2, 0, 1], [0, 2, 1], [2, 1, 0], [1, 0, 2]]), S3 = raz[0] + raz[1] + raz[2], k = 180 / S3;
      const ps = orden.map(j => raz[j]), ang = ps.map(p => p * k), mayor = rng.moneda(), pp = mayor ? raz[2] : raz[0], otra = mayor ? raz[0] : raz[2];
      const rot = {}; LET.forEach((V, j) => { rot[V] = dado(kT(ps[j])); });
      const fig = triFig(ang[1], ang[2], rot, { alt: `Triángulo ABC con ángulos ${LET.map((V, j) => `${kT(ps[j])} en ${V}`).join(', ')}.` });
      if (!rotular(fig)) continue;
      return {
        variables: {}, enunciado: [`Los ángulos A, B y C de un triángulo están en razón ${ps[0]} : ${ps[1]} : ${ps[2]}.`],
        pregunta: [`¿Cuánto mide el ángulo ${mayor ? 'mayor' : 'menor'}?`], datos: [D.suma, D.razon(...ps)], correcta: pp * k, fmt: gr,
        errores: [
          er('GE-RAZ2', k, `Bien hallar k = ${f(k)}: es una sola parte. Ese ángulo tiene ${pp}.`),
          er('GE-RAZ1', otra * k, `Bien repartir en partes; pero esa medida es la del ángulo ${mayor ? 'menor' : 'mayor'}.`),
          er('GE-TRI12', 60, 'Bien repartir 180°; pero en partes iguales solo si los tres ángulos fueran iguales.'),
          er('GE-TRI5', pp * 360 / S3, 'Bien contar las partes; pero las partes llenan 180°, no 360°.'),
        ],
        solucion: [[`Las ${S3} partes llenan 180°: ${S3}k = 180, así que k = ${f(k)}.`], [`El ángulo ${mayor ? 'mayor' : 'menor'} tiene ${pp} parte${pp === 1 ? '' : 's'}: ${pp === 1 ? '' : `${pp} · `}${f(k)}° = `, v('x', gr(pp * k)), '.']],
        fig, _datos: { tipo: 'razon', idea: 'suma-de-angulos', nivel: 2, razon: ps, pide: mayor ? 'mayor' : 'menor' },
      };
    }
  }

  function conX(rng) {
    const negativo = rng.moneda();
    for (const sigue = tope(); sigue();) {
      const x = rng.entero(8, 30), ang = tres(rng, 45, 95), a = [rng.entero(1, 3), rng.entero(1, 4), rng.entero(1, 3)], b = ang.map((m, j) => m - a[j] * x);
      if (b.some(z => Math.abs(z) > 40 || z % 5 !== 0) || b.every(z => z === 0)) continue;
      const SA = a[0] + a[1] + a[2], SB = b[0] + b[1] + b[2];
      // La mitad de las veces los números sueltos suman menos de 0: así x no es siempre la menor de las alternativas.
      if (SB === 0 || (SB < 0) !== negativo) continue;
      const rot = {}; LET.forEach((V, j) => { rot[V] = dado(exG(a[j], b[j])); });
      const fig = triFig(ang[1], ang[2], rot, { alt: `Triángulo ABC con ángulos ${LET.map((V, j) => `${exG(a[j], b[j])} en ${V}`).join(', ')}.` });
      if (!rotular(fig)) continue;
      const pideX = rng.moneda(), j = rng.entero(0, 2), L = LET[j];
      const enun = [`En el triángulo ABC, m∠A = ${exG(a[0], b[0])}, m∠B = ${exG(a[1], b[1])} y m∠C = ${exG(a[2], b[2])}.`];
      const paso = [`Los tres suman 180°: ${SA}x ${SB > 0 ? '+' : '−'} ${Math.abs(SB)}° = 180°, así que ${SA}x = ${180 - SB} y x = ${x}.`];
      const base = { variables: {}, enunciado: enun, datos: [D.suma], fig, _datos: { tipo: 'con-x', idea: 'suma-de-angulos', nivel: 2, a, b, pide: pideX ? 'x' : L } };
      if (pideX) return Object.assign(base, { pregunta: ['¿Cuánto vale x?'], correcta: x, fmt: num,
        errores: [
          er('GE-TRI13', ang[j], `Bien plantear la suma; ${ang[j]}° es lo que mide el ángulo ${L}, y se pide x.`),
          er('GE-TRI5', ent((360 - SB) / SA), 'Bien igualar la suma; pero los tres ángulos suman 180°, no 360°.'),
          er('GE-TRI15', ent((180 + SB) / SA), 'Bien igualar a 180°; al pasar los números al otro lado cambia su signo.'),
          er('GE-TRI19', ent(180 / SA), 'Bien juntar las x; faltó juntar también los números sueltos.'),
        ],
        solucion: [paso, ['x = ', v('x', num(x)), '.']] });
      return Object.assign(base, { pregunta: [`¿Cuánto mide el ángulo ${L}?`], correcta: ang[j], fmt: gr,
        errores: [
          er('GE-TRI14', x, `Bien hallar x = ${x}; falta reemplazarlo en el ángulo ${L}.`),
          er('GE-RAZ1', ang[(j + 1) % 3], `Bien hallar x; esa es la medida del ángulo ${LET[(j + 1) % 3]}, no la del ${L}.`),
          er('GE-TRI7', 180 - ang[j], `Bien hallar x; ${180 - ang[j]}° es lo que suman los otros dos ángulos.`),
        ],
        solucion: [paso, [`m∠${L} = ${a[j] === 1 ? '' : `${a[j]} · `}${x}${b[j] ? ` ${b[j] < 0 ? '−' : '+'} ${Math.abs(b[j])}°` : '°'} = `, v('x', gr(ang[j])), '.']] });
    }
  }

  // La «mariposa»: AD y BC se cortan en O; triángulos AOB (izquierda) y COD (derecha), con m∠AOB = m∠COD.
  const VECINO = { A: 'B', B: 'A', C: 'D', D: 'C' }, ENFRENTE = { A: 'C', B: 'D', C: 'A', D: 'B' };
  function mariposaFig(a, b, c, d, rot) {
    const phi = 180 - a - b, s = Math.sin(phi * RAD);
    const OA = 3.1 * Math.sin(b * RAD) / s, OB = 3.1 * Math.sin(a * RAD) / s, OC = 3.1 * Math.sin(d * RAD) / s, OD = 3.1 * Math.sin(c * RAD) / s;
    const P = { O: [0, 0], A: polar([0, 0], OA, 180 - phi / 2), B: polar([0, 0], OB, 180 + phi / 2), C: polar([0, 0], OC, phi / 2), D: polar([0, 0], OD, -phi / 2) };
    const LD = { A: ['B', 'O'], B: ['O', 'A'], C: ['O', 'D'], D: ['C', 'O'] }, med = { A: a, B: b, C: c, D: d };
    return figura({ P, letras: ['A', 'B', 'C', 'D', 'O'], alto: 250, alt: 'Los segmentos AD y BC se cortan en O y forman dos triángulos, AOB y COD, opuestos por el vértice O.',
      segs: [{ de: 'A', a: 'D' }, { de: 'B', a: 'C' }, { de: 'A', a: 'B' }, { de: 'C', a: 'D' }],
      angs: Object.keys(LD).map(k => Object.assign({ en: k, de: LD[k][0], a: LD[k][1], mide: med[k], marcas: 1 }, rot[k])) });
  }
  function mariposa(rng) {
    for (const sigue = tope(); sigue();) {
      const a = 5 * rng.entero(7, 19), b = 5 * rng.entero(7, 19), phi = 180 - a - b;
      if (phi < 40 || phi > 100) continue;
      const c = 5 * rng.entero(7, 19), d = a + b - c;
      if (d < 35 || d > 95 || c === a || c === b) continue;
      const val = { A: a, B: b, C: c, D: d }, L = rng.elegir(['A', 'B', 'C', 'D']);
      const rot = {}; for (const k of ['A', 'B', 'C', 'D']) rot[k] = k === L ? pide() : dado(`${val[k]}°`);
      const fig = mariposaFig(a, b, c, d, rot);
      if (!rotular(fig)) continue;
      const dados = ['A', 'B', 'C', 'D'].filter(k => k !== L), s3 = dados.reduce((s, k) => s + val[k], 0), [p1, p2] = L === 'A' || L === 'B' ? ['C', 'D'] : ['A', 'B'];
      const [q1] = dados.filter(k => k !== p1 && k !== p2);
      return {
        variables: {}, enunciado: [`Los segmentos AD y BC se cortan en O. En los triángulos AOB y COD, ${dados.map(k => `m∠${k} = ${val[k]}°`).join(', ').replace(/, ([^,]*)$/, ' y $1')}.`],
        pregunta: [`¿Cuánto mide el ángulo ${L}?`], datos: [D.sumaO, D.opuestos], correcta: val[L], fmt: gr,
        errores: [
          er('GE-TRI16', val[ENFRENTE[L]], 'Bien comparar los dos triángulos; pero solo los ángulos en O son iguales, no los de afuera.'),
          er('GE-TRI17', 180 - s3 > 0 ? 180 - s3 : 360 - s3, 'Bien juntar los ángulos; pero son dos triángulos, cada uno con sus 180°.'),
          er('GE-TRI18', 180 - val[VECINO[L]], 'Bien completar 180°; en ese triángulo también cuenta el ángulo en O.'),
        ],
        solucion: [[`En O los dos ángulos son opuestos por el vértice: miden igual, así que m∠${p1} + m∠${p2} = m∠${q1} + m∠${L}.`], [`m∠${L} = ${val[p1]}° + ${val[p2]}° − ${val[q1]}° = `, v('x', gr(val[L])), '.']],
        fig, _datos: { tipo: 'mariposa', idea: 'suma-de-angulos', nivel: 3, angulos: val, pide: L },
      };
    }
  }

  // =============================== Idea 2: el ángulo exterior ===============================
  // Prolongaciones: D más allá de C (de BC), E más allá de A (de CA) y F más allá de B (de AB).
  function triExt(b, c, rot, ext, o = {}) {
    const { A, B, C } = vert(b, c), med = { A: 180 - b - c, B: b, C: c }, k = o.prolonga || 1.9;
    const Pe = { D: mas(C, B, -k / 6), E: mas(A, C, -k / dist(A, C)), F: mas(B, A, -k / dist(A, B)) };
    const EX = { C: ['A', 'D', 'C', 'D'], A: ['B', 'E', 'A', 'E'], B: ['C', 'F', 'B', 'F'] }, P = {}, segs = [], angs = [];
    for (const V of Object.keys(ext)) {
      const [de, a, x, y] = EX[V];
      P[a] = Pe[a]; segs.push({ de: x, a: y, discontinua: true });
      angs.push(Object.assign({ en: V, de, a, mide: 180 - med[V], marcas: 1, radio: 26 }, ext[V]));
    }
    return triFig(b, c, rot, Object.assign({}, o, { P: Object.assign(P, o.P || {}), letras: Object.keys(P).concat(o.letras || []), segs: segs.concat(o.segs || []), angs: angs.concat(o.angs || []) }));
  }
  const dosDe = (rng, lo, hi) => { for (;;) { const a = 5 * rng.entero(lo / 5, hi / 5), b = 5 * rng.entero(lo / 5, hi / 5), c = 180 - a - b; if (c >= lo && c <= hi && a !== b) return [a, b, c]; } };
  const chico = o => Object.assign({ radio: 16, crece: false }, o);
  function exterior(rng) {
    for (const sigue = tope(); sigue();) {
      const [a, b, c] = dosDe(rng, 30, 95);
      const fig = triExt(b, c, { A: dado(`${a}°`), B: dado(`${b}°`), C: chico({}) }, { C: pide() }, { alt: `Triángulo ABC con ${a}° en A y ${b}° en B; BC se prolonga más allá de C hasta D.` });
      if (!rotular(fig)) continue;
      return {
        variables: {}, enunciado: [`En el triángulo ABC, m∠A = ${a}° y m∠B = ${b}°. Se prolonga BC más allá de C, hasta D.`],
        pregunta: ['¿Cuánto mide el ángulo ACD?'], datos: [D.ext, D.ady], correcta: a + b, fmt: gr,
        errores: [
          er('GE-EXT4', c, `Bien hallar el ángulo de adentro en C, ${c}°; el exterior es su vecino en la recta.`),
          er('GE-EXT5', 180 - b, 'Bien restar de 180°; pero eso sirve con el interior de C, no con B.'),
          er('GE-EXT5', 180 - a, 'Bien restar de 180°; pero eso sirve con el interior de C, no con A.'),
          er('GE-EXT6', Math.abs(a - b), 'Bien usar los dos ángulos lejanos; el exterior los suma, no los resta.'),
        ],
        solucion: [['El exterior en C mide lo que suman los interiores A y B.'], [`m∠ACD = ${a}° + ${b}° = `, v('x', gr(a + b)), '.']],
        fig, _datos: { tipo: 'exterior', idea: 'angulo-exterior', nivel: 1, angulos: { A: a, B: b, C: c }, pide: 'ACD' },
      };
    }
  }
  function lejano(rng) {
    for (const sigue = tope(); sigue();) {
      const [a, b, c] = dosDe(rng, 30, 95), e = a + b;
      const fig = triExt(b, c, { A: dado(`${a}°`), B: pide(), C: chico({}) }, { C: dado(`${e}°`) }, { alt: `Triángulo ABC con ${a}° en A y el exterior en C de ${e}°; el ángulo B se pide.` });
      if (!rotular(fig)) continue;
      return {
        variables: {}, enunciado: [`En el triángulo ABC, D está en la prolongación de BC. El ángulo exterior ACD mide ${e}° y m∠A = ${a}°.`],
        pregunta: ['¿Cuánto mide el ángulo B?'], datos: [D.ext, D.ady], correcta: b, fmt: gr,
        errores: [
          er('GE-EXT7', e + a, 'Bien relacionar el exterior con A; pero A y B juntos dan el exterior: se resta.'),
          er('GE-EXT4', c, `Bien hallar el ángulo de adentro en C, ${c}°; pero se pide el ángulo B.`),
          er('GE-EXT5', 180 - a, 'Bien restar de 180°; eso sirve entre vecinos en una recta, y A y B no lo son.'),
        ],
        solucion: [['m∠A + m∠B es el exterior: a él le quito el ángulo A.'], [`m∠B = ${e}° − ${a}° = `, v('x', gr(b)), '.']],
        fig, _datos: { tipo: 'lejano', idea: 'angulo-exterior', nivel: 1, angulos: { A: a, B: b, C: c }, pide: 'B' },
      };
    }
  }
  function extX(rng) {
    for (const sigue = tope(); sigue();) {
      const x = rng.entero(10, 30), aA = rng.entero(1, 3), aB = rng.entero(1, 2), aE = aA + aB + rng.entero(1, 2), bA = 5 * rng.entero(-2, 6), bB = 5 * rng.entero(-2, 6);
      const A = aA * x + bA, B = aB * x + bB, E = A + B, bE = E - aE * x, C = 180 - E;
      if (A < 25 || B < 25 || C < 25 || A > 110 || B > 110 || Math.abs(bE) > 60 || bE % 5 !== 0) continue;
      const fig = triExt(B, C, { A: dado(exG(aA, bA)), B: dado(exG(aB, bB)), C: chico({}) }, { C: dado(exG(aE, bE)) }, { alt: `Triángulo ABC con ${exG(aA, bA)} en A, ${exG(aB, bB)} en B y el exterior en C de ${exG(aE, bE)}.` });
      if (!rotular(fig)) continue;
      const pideX = rng.moneda(), SA = aA + aB, SB = bA + bB;
      const paso = [`El exterior es igual a A + B: ${exG(aE, bE)} = ${exG(aA, bA)} + ${exG(aB, bB)}, así que x = ${x}.`];
      const base = { variables: {}, enunciado: [`En el triángulo ABC, D está en la prolongación de BC. m∠A = ${exG(aA, bA)}, m∠B = ${exG(aB, bB)} y m∠ACD = ${exG(aE, bE)}.`],
        datos: [D.ext], fig, _datos: { tipo: 'ext-x', idea: 'angulo-exterior', nivel: 2, aA, bA, aB, bB, aE, bE, pide: pideX ? 'x' : 'ACD' } };
      if (pideX) return Object.assign(base, { pregunta: ['¿Cuánto vale x?'], correcta: x, fmt: num,
        errores: [
          er('GE-EXT8', ent((180 - SB - bE) / (SA + aE)), 'Bien igualar; pero el exterior es igual a A + B, no suma 180° con ellos.'),
          er('GE-TRI15', ent((bE + SB) / (aE - SA)), 'Bien igualar el exterior con A + B; al pasar los números cambia su signo.'),
          er('GE-TRI13', E, `Bien plantear; ${E}° es lo que mide el exterior, y se pide x.`),
        ],
        solucion: [paso, ['x = ', v('x', num(x)), '.']] });
      return Object.assign(base, { pregunta: ['¿Cuánto mide el ángulo ACD?'], correcta: E, fmt: gr,
        errores: [
          er('GE-TRI14', x, `Bien hallar x = ${x}; falta reemplazarlo en la expresión del exterior.`),
          er('GE-EXT4', C, `Bien hallar x; ${C}° es el ángulo de adentro en C, y se pide el exterior.`),
          er('GE-EXT5', 180 - Math.min(A, B), `Bien hallar x; restar de 180° sirve con el interior de C, no con el de ${A < B ? 'A' : 'B'}.`),
          er('GE-EXT9', A, `Bien hallar x; ${A}° mide el ángulo A, uno de los dos que se suman.`),
        ],
        solucion: [paso, [`m∠ACD = ${aE === 1 ? '' : `${aE} · `}${x}${bE ? ` ${bE < 0 ? '−' : '+'} ${Math.abs(bE)}°` : '°'} = `, v('x', gr(E)), '.']] });
    }
  }
  function tresExt(rng) {
    for (const sigue = tope(); sigue();) {
      const [a, b, c] = dosDe(rng, 35, 90), eA = 180 - a, eB = 180 - b, eC = 180 - c;
      const fig = triExt(b, c, {}, { A: dado(`${eA}°`), B: dado(`${eB}°`), C: pide() }, { prolonga: 1.6, alto: 270, alt: 'Triángulo ABC con sus tres lados prolongados: un ángulo exterior en cada vértice.' });
      if (!rotular(fig)) continue;
      return {
        variables: {}, enunciado: [`En el triángulo ABC, el ángulo exterior en A mide ${eA}° y el exterior en B mide ${eB}°.`],
        pregunta: ['¿Cuánto mide el ángulo exterior en C?'], datos: [D.ext3], correcta: eC, fmt: gr,
        errores: [
          er('GE-EXT13', 120, 'Bien repartir una vuelta; pero en partes iguales solo si los tres giros midieran igual.'),
          er('GE-EXT2', 540 - eA - eB, 'Bien: cada exterior con su interior da 180°. Pero los tres exteriores solos suman 360°.'),
          er('GE-EXT4', c, `Bien hallar el ángulo de adentro en C, ${c}°; se pide el exterior.`),
        ],
        solucion: [['Los tres exteriores dan una vuelta: 360°.'], [`360° − ${eA}° − ${eB}° = `, v('x', gr(eC)), '.']],
        fig, _datos: { tipo: 'tres-ext', idea: 'angulo-exterior', nivel: 2, angulos: { A: a, B: b, C: c }, pide: 'exterior C' },
      };
    }
  }
  // La punta de flecha: D dentro de ABC, con ∠ABD = p y ∠ACD = q (cuñas angostas: su arco, y el valor en el enunciado).
  function flecha(rng) {
    for (const sigue = tope(); sigue();) {
      const a = 5 * rng.entero(10, 13), p = 5 * rng.entero(5, 8), q = 5 * rng.entero(5, 8);
      if (p === q || a + p + q > 135) continue;
      const b = 5 * rng.entero((p + 30) / 5, 20), c = 180 - a - b;
      if (c < q + 30 || b > 100 || c > 100) continue;
      const { A } = vert(b, c), Dp = corte([0, 0], polar([0, 0], 1, b - p), [6, 0], polar([6, 0], 1, 180 - c + q)), x = a + p + q;
      const fig = triFig(b, c, { A: dado(`${a}°`) }, { P: { D: Dp }, letras: ['D'], segs: [{ de: 'B', a: 'D' }, { de: 'D', a: 'C' }],
        angs: [{ en: 'B', de: 'D', a: 'A', mide: p, radio: 30, color: 'h', marcas: 1 }, { en: 'C', de: 'A', a: 'D', mide: q, radio: 30, color: 'h', marcas: 2 }, { en: 'D', de: 'B', a: 'C', mide: x, radio: 14, marcas: 3, texto: '?' }],
        alt: 'Triángulo ABC con un punto D adentro, unido a B y a C: la figura ABDC tiene forma de punta de flecha.' });
      if (A[1] < 2.2 || !rotular(fig)) continue;
      return {
        variables: {}, enunciado: [`D está dentro del triángulo ABC. m∠BAC = ${a}°, m∠ABD = ${p}° y m∠ACD = ${q}°.`],
        pregunta: ['¿Cuánto mide el ángulo BDC?'], datos: [D.ext, D.sumaO], correcta: x, fmt: gr,
        errores: [
          er('GE-EXT10', a + p, 'Bien usar un exterior; pero el ángulo en D junta los tres ángulos, no dos.'),
          er('GE-EXT10', a + q, 'Bien usar un exterior; pero el ángulo en D junta los tres ángulos, no dos.'),
          er('GE-EXT11', 360 - x, 'Bien sumar los tres; eso da el ángulo de adentro, ∠BDC, no el de afuera.'),
          er('GE-EXT12', 180 - a, `Bien: B y C suman ${180 - a}° en el triángulo grande. Pero D no es un vértice de ese triángulo.`),
        ],
        solucion: [['Prolongo BD hasta AC: dos ángulos exteriores seguidos juntan los tres ángulos.'], [`m∠BDC = ${a}° + ${p}° + ${q}° = `, v('x', gr(x)), '.']],
        fig, _datos: { tipo: 'flecha', idea: 'angulo-exterior', nivel: 3, a, p, q, b, c, pide: 'BDC' },
      };
    }
  }
  // La antena AB sobre el techo, con dos cables a C y a D (más lejos); el de C forma al con el techo y el de D, be.
  function antena(rng) {
    for (const sigue = tope(); sigue();) {
      const al = 2 * rng.entero(28, 37), be = 2 * rng.entero(8, 15), x = al - be;
      if (x < 42) continue;
      const h = 3, P = { A: [0, h], B: [0, 0], C: [h / Math.tan(al * RAD), 0], D: [h / Math.tan(be * RAD), 0] };
      const fig = figura({ P, letras: ['A', 'B', 'C', 'D'], alto: 230, alt: 'Una antena vertical AB sobre un techo plano; dos cables van de la punta A al techo, a C y a D, más lejos.',
        segs: [{ de: 'A', a: 'B', grosor: 'variable' }, { de: 'B', a: 'D' }, { de: 'A', a: 'C' }, { de: 'A', a: 'D' }],
        // El triángulo ABC es muy angosto y el ángulo en D, una cuña: los dos llevan su arco y su valor va en el texto.
        angs: [{ en: 'C', de: 'A', a: 'B', mide: al, radio: 16, color: 'h' }, { en: 'D', de: 'A', a: 'C', mide: be, radio: 34, color: 'h', marcas: 2 },
          { en: 'A', de: 'C', a: 'D', mide: x, radio: 20, texto: '?' }] });
      if (!rotular(fig)) continue;
      return {
        variables: {}, enunciado: [`La antena AB está sobre un techo plano. Un cable va de A a C y forma ${al}° con el techo; otro va de A a D, más lejos, y forma ${be}°.`],
        pregunta: ['¿Qué ángulo forman los dos cables en A?'], datos: [D.ext], correcta: x, fmt: gr,
        errores: [
          er('GE-EXT7', al + be, 'Bien ver el triángulo ACD; pero el ángulo en C es exterior: es la suma, y se resta.'),
          er('GE-EXT4', 180 - al, `Bien mirar el triángulo ACD; ${180 - al}° es su ángulo interior en C.`),
          er('GE-EXT15', be, `Bien mirar el cable de D; pero ${be}° es su ángulo con el techo, no con el otro cable.`),
          er('GE-EXT14', 90 - be, `Bien mirar el cable de D; ${90 - be}° es su ángulo con la antena, no con el otro cable.`),
          er('GE-EXT8', 180 - al - be, `Bien usar la suma de 180°; pero ${al}° está afuera del triángulo ACD.`),
        ],
        solucion: [[`En el triángulo ACD, el ángulo de ${al}° en C es exterior: ${al}° = m∠CAD + ${be}°.`], [`m∠CAD = ${al}° − ${be}° = `, v('x', gr(x)), '.']],
        fig, _datos: { tipo: 'antena', idea: 'angulo-exterior', nivel: 3, al, be, pide: 'CAD' },
      };
    }
  }

  // =============================== Idea 3: isósceles y equilátero ===============================
  const LL_AB_AC = [{ de: 'A', a: 'B', marcas: 1 }, { de: 'A', a: 'C', marcas: 1 }];
  function base(rng) {
    for (const sigue = tope(); sigue();) {
      const th = 2 * rng.entero(10, 60), al = (180 - th) / 2;
      const fig = triFig(al, al, { A: dado(`${th}°`), B: pide({ marcas: 2 }), C: { marcas: 2, color: 'h' } }, { llaves: LL_AB_AC, alt: `Triángulo isósceles ABC con AB = AC y ${th}° en A.` });
      if (!rotular(fig)) continue;
      return {
        variables: {}, enunciado: [`En el triángulo ABC, AB = AC y m∠A = ${th}°.`], pregunta: ['¿Cuánto mide el ángulo B?'], datos: [D.suma, D.iso], correcta: al, fmt: gr,
        errores: [
          er('GE-ISO4', 180 - th, `Bien restar de 180°; ${180 - th}° es lo que suman B y C juntos, y cada uno es la mitad.`),
          er('GE-ISO5', th, 'Bien buscar ángulos iguales; pero A está entre los lados iguales: los iguales son B y C.'),
          er('GE-ISO6', 90 - th, `Bien partir en dos; también se parte A: 90° − ${th}° ÷ 2.`),
        ],
        solucion: [['Frente a AB y AC, iguales, están C y B: miden igual y se reparten lo que deja A.'], [`m∠B = (180° − ${th}°) ÷ 2 = `, v('x', gr(al)), '.']],
        fig, _datos: { tipo: 'base', idea: 'isosceles', nivel: 1, th, pide: 'B' },
      };
    }
  }
  function punta(rng) {
    for (const sigue = tope(); sigue();) {
      const al = rng.entero(25, 80), th = 180 - 2 * al;
      if (al === 60) continue;
      const fig = triFig(al, al, { A: pide(), B: dado(`${al}°`, { marcas: 2 }), C: { marcas: 2, color: 'h' } }, { llaves: LL_AB_AC, alt: `Triángulo isósceles ABC con AB = AC y ${al}° en B.` });
      if (!rotular(fig)) continue;
      return {
        variables: {}, enunciado: [`En el triángulo ABC, AB = AC y m∠B = ${al}°.`], pregunta: ['¿Cuánto mide el ángulo A?'], datos: [D.suma, D.iso], correcta: th, fmt: gr,
        errores: [
          er('GE-ISO7', 180 - al, 'Bien restar de 180°; pero C mide lo mismo que B: se restan los dos.'),
          er('GE-ISO5', al, 'Bien buscar ángulos iguales; pero los iguales son B y C, y A es el otro.'),
          er('GE-ISO8', 2 * al, `Bien juntar B y C: suman ${2 * al}°. A es lo que les falta para 180°.`),
        ],
        solucion: [['C mide lo mismo que B; A es lo que les falta para 180°.'], [`m∠A = 180° − 2 · ${al}° = `, v('x', gr(th)), '.']],
        fig, _datos: { tipo: 'punta', idea: 'isosceles', nivel: 1, al, pide: 'A' },
      };
    }
  }
  function ladosX(rng) {
    for (const sigue = tope(); sigue();) {
      const x = rng.entero(3, 9), p = rng.entero(2, 4), q = rng.entero(1, p - 1), k = rng.entero(1, 8), AB = p * x - k, mAC = AB - q * x;
      if (AB <= 4 || mAC < -9 || mAC === 0) continue;
      const bc = rng.entero(Math.max(3, Math.ceil(0.5 * AB)), Math.floor(1.6 * AB)), BCx = rng.entero(1, 2), bcK = bc - BCx * x;
      if (bc === AB || bcK === 0) continue;
      const xMal = p !== BCx ? (k + bcK) / (p - BCx) : NaN, abMal = p * xMal - k, b = Math.acos(bc / (2 * AB)) / RAD;
      const fig = triFig(b, b, { B: { marcas: 2, color: 'h' }, C: { marcas: 2, color: 'h' } }, { alt: 'Triángulo ABC con los ángulos B y C iguales, marcados con dos arcos.' });
      if (!rotular(fig)) continue;
      const ABt = exU(p, -k), ACt = exU(q, mAC), BCt = exU(BCx, bcK);
      return {
        variables: {}, enunciado: [`En el triángulo ABC, m∠B = m∠C. AB = (${ABt}) cm, AC = (${ACt}) cm y BC = (${BCt}) cm.`],
        pregunta: ['¿Cuánto mide AB?'], datos: [D.iso], correcta: AB, fmt: cm,
        errores: [
          er('GE-ISO9', x, `Bien hallar x = ${x}; falta reemplazarlo en AB.`),
          er('GE-ISO10', Number.isInteger(xMal) && xMal > 0 ? abMal : NaN, 'Bien igualar dos lados; pero los iguales son los que están frente a B y a C: AC y AB.'),
          er('GE-ISO11', bc, `Bien hallar x; ${bc} cm es lo que mide BC, y se pide AB.`),
        ],
        solucion: [[`AB está frente a C y AC frente a B: como m∠B = m∠C, AB = AC. ${ABt} = ${ACt}, así que x = ${x}.`], [`AB = ${p} · ${x} − ${k} = `, v('x', cm(AB)), '.']],
        fig, _datos: { tipo: 'lados-x', idea: 'isosceles', nivel: 2, x, AB: [p, -k], AC: [q, mAC], BC: [BCx, bcK], pide: 'AB' },
      };
    }
  }
  const OPUESTO = { A: 'BC', B: 'AC', C: 'AB' };
  function orden(rng) {
    for (;;) {
      const [a, b, c] = dosDe(rng, 35, 95);
      if (new Set([a, b, c]).size < 3) continue;
      const m = { A: a, B: b, C: c }, o = LET.slice().sort((x, y) => m[y] - m[x]), menor = rng.entero(1, 4) === 1, bien = OPUESTO[o[menor ? 2 : 0]];
      const errores = menor ? [
        erT('GE-ISO1', OPUESTO[o[1]], `Bien mirar el ángulo menor; ${OPUESTO[o[1]]} lo toca, pero el lado menor es el de enfrente.`),
        erT('GE-ISO12', OPUESTO[o[0]], `Bien ordenar los ángulos; ${OPUESTO[o[0]]} está frente al mayor: es el lado mayor.`),
      ] : [
        erT('GE-ISO1', OPUESTO[o[1]], `Bien mirar el ángulo mayor; ${OPUESTO[o[1]]} lo toca, pero el lado mayor es el de enfrente.`),
        erT('GE-ISO12', OPUESTO[o[2]], `Bien ordenar los ángulos; ${OPUESTO[o[2]]} está frente al menor: es el lado menor.`),
      ];
      errores.push(erT('GE-ISO3', 'No se sabe sin medir los lados', 'Bien querer comprobar; pero los ángulos ya ordenan los lados.'));
      const z = o[menor ? 2 : 0];
      return {
        variables: {}, enunciado: [`En el triángulo ABC, m∠A = ${a}° y m∠B = ${b}°.`], pregunta: [`¿Cuál es su lado ${menor ? 'menor' : 'mayor'}?`],
        datos: [D.suma, menor ? 'Frente al ángulo menor está el lado menor.' : D.mayor],
        texto: { correcta: { clave: bien, texto: bien }, errores },
        solucion: [[`m∠C = 180° − ${a}° − ${b}° = ${c}°. El ángulo ${menor ? 'menor' : 'mayor'} está en ${z}: ${m[z]}°.`], [`El lado de enfrente, `, v('x', bien), `, es el ${menor ? 'menor' : 'mayor'}.`]],
        _datos: { tipo: 'orden', idea: 'isosceles', nivel: 2, angulos: { A: a, B: b }, pide: menor ? 'menor' : 'mayor' },
      };
    }
  }
  // La cadena AB = BD = DC, con D en AC y m∠C = c: B en (0, 0) y C en (6, 0).
  function cadenaFig(c, rot) {
    const u = [Math.cos((180 - c) * RAD), Math.sin((180 - c) * RAD)], L = 6, s = L / (2 * Math.cos(c * RAD));
    const Dp = [L + s * u[0], s * u[1]], tA = L * Math.cos(c * RAD) + Math.sqrt(Math.max(0, L * L * Math.cos(c * RAD) ** 2 - L * L + s * s)), A = [L + tA * u[0], tA * u[1]];
    const angs = [];
    if (rot.C) angs.push(Object.assign({ en: 'C', de: 'D', a: 'B', mide: c, marcas: 1, radio: 26 }, rot.C));
    if (rot.A) angs.push(Object.assign({ en: 'A', de: 'B', a: 'D', mide: 2 * c, marcas: 2 }, rot.A));
    if (rot.ABC) angs.push(Object.assign({ en: 'B', de: 'C', a: 'A', mide: 180 - 3 * c, marcas: 3, radio: 22 }, rot.ABC));
    return figura({ P: { A, B: [0, 0], C: [L, 0], D: Dp }, letras: ['A', 'B', 'C', 'D'], alto: 250, alt: 'Triángulo ABC con D en el lado AC y BD trazado; AB, BD y DC miden igual.',
      segs: [{ de: 'A', a: 'B' }, { de: 'B', a: 'C' }, { de: 'C', a: 'A' }, { de: 'B', a: 'D' }],
      llaves: [{ de: 'A', a: 'B', marcas: 1 }, { de: 'B', a: 'D', marcas: 1, ref: 'C' }, { de: 'D', a: 'C', marcas: 1, ref: 'B' }], angs });
  }
  function cadena(rng) {
    for (const sigue = tope(); sigue();) {
      const c = 5 * rng.entero(4, 8), pideA = rng.moneda();
      // C es una cuña angosta: lleva su arco y su valor va en el enunciado.
      const fig = cadenaFig(c, pideA ? { C: { color: 'h' }, A: pide() } : { C: { color: 'h' }, ABC: pide() });
      if (!rotular(fig)) continue;
      const base0 = { variables: {}, enunciado: [`En el triángulo ABC, D está en el lado AC y AB = BD = DC. m∠C = ${c}°.`], datos: [D.iso, D.ext, D.suma], fig,
        _datos: { tipo: 'cadena', idea: 'isosceles', nivel: 3, c, pide: pideA ? 'A' : 'ABC' } };
      const paso = [`BD = DC: m∠DBC = ${c}°. ∠ADB es exterior de BDC: ${c}° + ${c}° = ${2 * c}°. AB = BD: m∠A = m∠ADB.`];
      if (pideA) return Object.assign(base0, { pregunta: ['¿Cuánto mide el ángulo A?'], correcta: 2 * c, fmt: gr,
        errores: [
          er('GE-ISO13', c, `Bien: C y ∠DBC miden ${c}°. Pero A se compara con ∠ADB, no con C.`),
          er('GE-ISO14', 180 - 2 * c, `Bien hallar m∠BDC = ${180 - 2 * c}°; A es igual a ∠ADB, su vecino en la recta.`),
          er('GE-ISO15', 4 * c, 'Bien duplicar una vez (el exterior); la segunda vez sobra.'),
        ],
        solucion: [paso, ['m∠A = ', v('x', gr(2 * c)), '.']] });
      return Object.assign(base0, { pregunta: ['¿Cuánto mide el ángulo ABC?'], correcta: 180 - 3 * c, fmt: gr,
        errores: [
          er('GE-ISO14', 180 - 4 * c, `Bien hallar m∠ABD = ${180 - 4 * c}°; falta sumarle ∠DBC.`),
          er('GE-ISO13', 2 * c, `Bien hallar m∠A = ${2 * c}°; se pide el ángulo ABC.`),
          er('GE-ISO15', 180 - 2 * c, 'Bien restar de 180°; pero A mide el doble de C, no lo mismo.'),
        ],
        solucion: [paso, [`m∠ABC = 180° − ${2 * c}° − ${c}° = `, v('x', gr(180 - 3 * c)), '.']] });
    }
  }
  // La bisectriz de B corta a AC en D; DE ∥ BC con E en AB: EBD es isósceles (DE = EB). AB = L y AE = m.
  function paralela(rng) {
    for (const sigue = tope(); sigue();) {
      const L = rng.entero(9, 20), m = rng.entero(Math.ceil(L / 3), Math.floor(L / 1.6)), bc = L * (L - m) / m, bAng = 5 * rng.entero(11, 16);
      if (L - m === m || 2 * (L - m) === L) continue;
      const A = polar([0, 0], L, bAng), C = [bc, 0], ac = dist(A, C);
      const Dp = mas(A, C, L / (L + bc)), Ep = mas(A, [0, 0], m / L), cAng = Math.acos((bc * bc + ac * ac - L * L) / (2 * bc * ac)) / RAD;
      if (cAng < 30 || 180 - bAng - cAng < 30) continue;
      const k = 6 / bc, S = p => [p[0] * k, p[1] * k], P = { A: S(A), B: [0, 0], C: S(C), D: S(Dp), E: S(Ep) };
      const fig = figura({ P, letras: ['A', 'B', 'C', 'D', 'E'], alto: 250, alt: 'Triángulo ABC con la bisectriz BD del ángulo B y la paralela DE a BC, con E en AB.',
        segs: [{ de: 'A', a: 'B' }, { de: 'B', a: 'C' }, { de: 'C', a: 'A' }, { de: 'B', a: 'D' }, { de: 'D', a: 'E' }],
        angs: [{ en: 'B', de: 'C', a: 'D', mide: bAng / 2, radio: 24, color: 'h', rayita: 1 }, { en: 'B', de: 'D', a: 'A', mide: bAng / 2, radio: 24, color: 'h', rayita: 1 }],
        lados: [{ de: 'A', a: 'E', texto: cm(m) }] });
      if (!rotular(fig)) continue;
      return {
        variables: {}, enunciado: [`En el triángulo ABC, la bisectriz del ángulo B corta a AC en D. Por D pasa DE, paralela a BC, con E en AB. AB = ${cm(L)} y AE = ${cm(m)}.`],
        pregunta: ['¿Cuánto mide DE?'], datos: [D.bis, D.paralelas, D.iso], correcta: L - m, fmt: cm,
        errores: [
          er('GE-ISO16', m, 'Bien buscar un isósceles; pero los ángulos iguales están en B y en D: DE = EB.'),
          er('GE-ISO17', L / 2, 'Bien usar AB; pero E no es el punto medio de AB: DE mide lo mismo que EB.'),
          er('GE-ISO18', L, 'Bien ver que DE se apoya en AB; pero mide lo mismo que el tramo EB, no que AB.'),
        ],
        solucion: [['∠EDB y ∠DBC son alternos internos: iguales. Y m∠DBC = m∠DBE (bisectriz). En EBD, los ángulos en B y en D son iguales: DE = EB.'], [`DE = ${L} − ${m} = `, v('x', cm(L - m)), '.']],
        fig, _datos: { tipo: 'paralela', idea: 'isosceles', nivel: 3, AB: L, AE: m, pide: 'DE' },
      };
    }
  }

  // =============================== Idea 4: desigualdad triangular ===============================
  // Dos lados dados (AB = p naranja, BC = q turquesa) unidos en B con 70°; AC, el tercero, punteado con «x».
  function dosLadosFig(p, q, o = {}) {
    const A = polar([0, 0], p, 70), C = [q, 0];
    return figura({ P: { A, B: [0, 0], C }, letras: ['A', 'B', 'C'], alto: 230, pad: 0.12 * Math.max(p, q) + 0.3, alt: `Triángulo ABC con AB = ${f(p)} cm y BC = ${f(q)} cm; el tercer lado, AC, une sus puntas.`,
      segs: [{ de: 'B', a: 'A', color: 'o', grosor: 'variable' }, { de: 'B', a: 'C', color: 'i', grosor: 'variable' }, { de: 'A', a: 'C', discontinua: true }],
      lados: [{ de: 'B', a: 'A', texto: cm(p), color: 'o' }, { de: 'B', a: 'C', texto: cm(q), color: 'i' }, { de: 'A', a: 'C', texto: o.tx || 'x' }] });
  }
  const dos = rng => { for (;;) { const p = rng.entero(3, 14), q = rng.entero(3, 14); if (p !== q && Math.max(p, q) <= 3 * Math.min(p, q)) return [p, q]; } };
  const varsLados = { p: { nombre: 'el lado AB', color: 'o' }, q: { nombre: 'el lado BC', color: 'i' } };
  function maxMin(rng) {
    for (const sigue = tope(); sigue();) {
      const [p, q] = dos(rng), R = calc.tercerLado(p, q), pideMax = rng.moneda();
      // La respuesta no puede ser un número del enunciado (se copiaría sin resolver).
      if ([p, q].includes(pideMax ? R.max : R.min)) continue;
      const fig = dosLadosFig(p, q);
      if (!rotular(fig)) continue;
      const lo = Math.abs(p - q), hi = p + q;
      return {
        variables: varsLados, enunciado: ['En el triángulo ABC, ', v('p', `AB = ${cm(p)}`), ' y ', v('q', `BC = ${cm(q)}`), '. El tercer lado, AC = x, mide un número entero de cm.'],
        pregunta: [`¿Cuál es el ${pideMax ? 'mayor' : 'menor'} valor de AC?`], datos: [D.dt], correcta: pideMax ? R.max : R.min, fmt: cm,
        errores: pideMax ? [
          er('GE-DT3', hi, `Bien sumar los dos lados; con ${hi} cm los tres puntos quedan alineados: no hay triángulo.`),
          er('GE-DT5', R.min, 'Bien usar la desigualdad; ese es el menor entero posible, y se pide el mayor.'),
          er('GE-DT6', Math.max(p, q), 'Bien buscar un tope; pero el tercer lado puede pasar al mayor de los otros dos: el tope es su suma.'),
        ] : [
          er('GE-DT3', lo, `Bien restar los dos lados; con ${lo} cm los tres puntos quedan alineados: no hay triángulo.`),
          er('GE-DT5', R.max, 'Bien usar la desigualdad; ese es el mayor entero posible, y se pide el menor.'),
          er('GE-DT2', 1, 'Bien pensar en un largo chico; pero no cualquiera sirve: AC pasa de la diferencia de los lados.'),
        ],
        solucion: pideMax ? [[`AC < ${p} + ${q} = ${hi}: el mayor entero es uno menos.`], ['AC = ', v('x', cm(R.max)), '.']]
          : [[`AC > ${Math.max(p, q)} − ${Math.min(p, q)} = ${lo}: el menor entero es uno más.`], ['AC = ', v('x', cm(R.min)), '.']],
        fig, _datos: { tipo: 'max-min', idea: 'desigualdad', nivel: 1, p, q, pide: pideMax ? 'max' : 'min' },
      };
    }
  }
  function cuantos(rng) {
    for (const sigue = tope(); sigue();) {
      const [p, q] = dos(rng), R = calc.tercerLado(p, q), fig = dosLadosFig(p, q);
      if (R.min >= R.cuantos || [p, q].includes(R.cuantos) || !rotular(fig)) continue;
      const lo = Math.abs(p - q), hi = p + q, n = R.cuantos;
      return {
        variables: varsLados, enunciado: ['En el triángulo ABC, ', v('p', `AB = ${cm(p)}`), ' y ', v('q', `BC = ${cm(q)}`), '.'],
        pregunta: ['¿Cuántos valores enteros, en cm, puede tomar AC?'], datos: [D.dt], correcta: n, fmt: num,
        errores: [
          er('GE-DT3', n + 2, `Bien contar los enteros; ${lo} y ${hi} no cuentan: ahí los puntos quedan alineados.`),
          er('GE-DT4', n + 1, 'Bien contar los enteros; pero eso incluye un extremo, y ninguno de los dos da triángulo.'),
          er('GE-DT2', hi - 1, 'Bien el límite de arriba; también hay uno de abajo: la diferencia de los lados.'),
          er('GE-DT14', R.min, `Bien hallar el menor valor de AC, ${R.min} cm; pero se pide cuántos valores hay.`),
        ],
        solucion: [[`${Math.max(p, q)} − ${Math.min(p, q)} = ${lo} y ${p} + ${q} = ${hi} son los extremos, que no cuentan: ${lo} < AC < ${hi}.`], [`De ${R.min} a ${R.max} hay `, v('x', num(n)), ' enteros.']],
        fig, _datos: { tipo: 'cuantos', idea: 'desigualdad', nivel: 2, p, q, pide: 'cuantos' },
      };
    }
  }
  function isoDT(rng) {
    for (;;) {
      const a = rng.entero(2, 7), b = rng.entero(2 * a, 2 * a + 7);
      return {
        variables: {}, enunciado: [`Un triángulo isósceles tiene un lado de ${cm(a)} y otro de ${cm(b)}.`], pregunta: ['¿Cuánto mide su perímetro?'], datos: [D.isoL, D.trio],
        texto: { correcta: { clave: cm(2 * b + a), texto: cm(2 * b + a) }, errores: [
          erT('GE-DT7', cm(2 * a + b), `Bien repetir un lado; pero ${a} + ${a} no pasa de ${b}: se repite el largo.`),
          erT('GE-DT8', cm(a + b), 'Bien sumar los lados; el perímetro lleva también el lado que se repite.'),
          erT('GE-DT9', `${cm(2 * a + b)} o ${cm(2 * b + a)}`, `Bien probar las dos formas; pero ${a}, ${a} y ${b} no se cierran.`),
        ] },
        solucion: [[`${a}, ${a} y ${b} no forman triángulo: ${a} + ${a} = ${2 * a} no pasa de ${b}. Los lados son ${b}, ${b} y ${a}.`], [`${b} + ${b} + ${a} = `, v('x', cm(2 * b + a)), '.']],
        _datos: { tipo: 'iso-dt', idea: 'desigualdad', nivel: 2, a, b, pide: 'perimetro', valor: 2 * b + a },
      };
    }
  }
  // El cuadrilátero ABCD con su diagonal AC (de largo x0, solo para dibujarlo): ABC abajo de AC y ACD arriba.
  function cuadriFig(a, b, c, d, x0) {
    const ang = (p, q, r) => Math.acos((p * p + q * q - r * r) / (2 * p * q)) / RAD;
    const P = { A: [0, 0], C: [x0, 0], B: polar([0, 0], a, -ang(a, x0, b)), D: polar([0, 0], d, ang(d, x0, c)) };
    return figura({ P, letras: ['A', 'B', 'C', 'D'], alto: 250, pad: 0.06 * (a + b + c + d) + 0.2, alt: `Cuadrilátero ABCD de lados ${a}, ${b}, ${c} y ${d} cm, con la diagonal AC.`,
      segs: [{ de: 'A', a: 'B' }, { de: 'B', a: 'C' }, { de: 'C', a: 'D' }, { de: 'D', a: 'A' }, { de: 'A', a: 'C', discontinua: true }],
      lados: [{ de: 'A', a: 'B', texto: cm(a), ref: 'C' }, { de: 'B', a: 'C', texto: cm(b), ref: 'A' }, { de: 'C', a: 'D', texto: cm(c), ref: 'A' }, { de: 'D', a: 'A', texto: cm(d), ref: 'C' }] });
  }
  function diagonal(rng) {
    for (const sigue = tope(); sigue();) {
      const a = rng.entero(3, 10), b = rng.entero(3, 12), c = rng.entero(3, 10), d = rng.entero(3, 12), pide = rng.elegir(['max', 'min', 'cuantos', 'cuantos']);
      const R = calc.diagonal(a, b, c, d), lo = R.min - 1, hi = R.max + 1;
      if (R.cuantos < 3 || Math.abs(a - b) === Math.abs(c - d) || a + b === c + d || (pide === 'cuantos' && R.min >= R.cuantos)) continue;
      const R1 = calc.tercerLado(a, b), R2 = calc.tercerLado(c, d), fig = cuadriFig(a, b, c, d, (lo + hi) / 2);
      if (!rotular(fig)) continue;
      const enun = [`En el cuadrilátero ABCD, AB = ${cm(a)}, BC = ${cm(b)}, CD = ${cm(c)} y DA = ${cm(d)}.`], datos = [D.dt];
      const base0 = { variables: {}, enunciado: enun, datos, fig, _datos: { tipo: 'diagonal', idea: 'desigualdad', nivel: 3, a, b, c, d, pide } };
      const paso = [`AC es lado de ABC y de ACD: cumple los dos rangos a la vez. ${lo} < AC < ${hi}.`];
      if (pide === 'cuantos') {
        const uno = R1.cuantos === R.cuantos ? R2.cuantos : R1.cuantos;
        return Object.assign(base0, { pregunta: ['¿Cuántos valores enteros, en cm, puede tomar la diagonal AC?'], correcta: R.cuantos, fmt: num,
          errores: [
            er('GE-DT11', uno, 'Bien contar en un triángulo; AC también es lado del otro: debe cumplir los dos.'),
            er('GE-DT12', Math.max(a + b, c + d) - Math.min(Math.abs(a - b), Math.abs(c - d)) - 1, 'Bien hallar los dos rangos; juntarlos no basta: AC cumple los dos a la vez.'),
            er('GE-DT3', R.cuantos + 2, `Bien contar los enteros; en ${lo} o en ${hi} un triángulo se aplasta: los bordes no cuentan.`),
            er('GE-DT14', R.min, `Bien hallar el menor valor de AC, ${R.min} cm; pero se pide cuántos valores hay.`),
          ],
          solucion: [paso, [`De ${R.min} a ${R.max} hay `, v('x', num(R.cuantos)), ' enteros.']] });
      }
      const otroMax = Math.max(R1.max, R2.max), otroMin = Math.min(R1.min, R2.min);
      if (pide === 'max') return Object.assign(base0, { pregunta: ['Si AC mide un número entero de cm, ¿cuál es su mayor valor?'], correcta: R.max, fmt: cm,
        errores: [
          er('GE-DT11', otroMax, 'Bien usar la desigualdad en un triángulo; AC también es lado del otro, que la frena antes.'),
          er('GE-DT3', hi, `Bien hallar el tope de ${hi} cm; ahí un triángulo se aplasta: el entero es uno menos.`),
          er('GE-DT5', R.min, 'Bien usar los dos rangos; ese es el menor entero, y se pide el mayor.'),
        ],
        solucion: [paso, ['AC = ', v('x', cm(R.max)), '.']] });
      return Object.assign(base0, { pregunta: ['Si AC mide un número entero de cm, ¿cuál es su menor valor?'], correcta: R.min, fmt: cm,
        errores: [
          er('GE-DT11', otroMin, 'Bien usar la desigualdad en un triángulo; AC también es lado del otro, que pide más.'),
          er('GE-DT3', lo, `Bien hallar el límite de ${lo} cm; ahí un triángulo se aplasta: el entero es uno más.`),
          er('GE-DT5', R.max, 'Bien usar los dos rangos; ese es el mayor entero, y se pide el menor.'),
        ],
        solucion: [paso, ['AC = ', v('x', cm(R.min)), '.']] });
    }
  }
  // P dentro de ABC con PB = p y PC = q: el perímetro pasa de |p − q| + p + q = 2·máx (como San Marcos 2026-I).
  function punto(rng) {
    for (const sigue = tope(); sigue();) {
      const p = rng.entero(3, 12), q = rng.entero(3, 12);
      if (p === q || Math.max(p, q) > 2.5 * Math.min(p, q)) continue;
      const L = 0.55 * (p + q) + 0.45 * Math.abs(p - q), x = (L * L + p * p - q * q) / (2 * L), y = Math.sqrt(Math.max(0, p * p - x * x));
      if (y < 0.25 * L) continue;
      const k = 6 / L, Pp = [x * k, y * k], A = [Pp[0] + 0.4, Pp[1] + 0.32 * (p + q) * k];
      const lado = (U, W, Z) => (W[0] - U[0]) * (Z[1] - U[1]) - (W[1] - U[1]) * (Z[0] - U[0]);
      if (!(lado([0, 0], [6, 0], Pp) > 0 && lado([6, 0], A, Pp) > 0 && lado(A, [0, 0], Pp) > 0)) continue;
      const fig = figura({ P: { A, B: [0, 0], C: [6, 0], P: Pp }, letras: ['A', 'B', 'C', 'P'], alto: 240, alt: 'Triángulo ABC con un punto P adentro, unido a B y a C.',
        segs: [{ de: 'A', a: 'B' }, { de: 'B', a: 'C' }, { de: 'C', a: 'A' }, { de: 'P', a: 'B', color: 'o' }, { de: 'P', a: 'C', color: 'i' }],
        lados: [{ de: 'P', a: 'B', texto: cm(p), color: 'o', ref: 'A', dist: 4 }, { de: 'P', a: 'C', texto: cm(q), color: 'i', ref: 'A', dist: 4 }], padAbajo: 0.3 });
      if (!rotular(fig)) continue;
      const M = Math.max(p, q), bien = calc.perimetroDosDistancias(p, q);
      return {
        variables: { p: { nombre: 'PB', color: 'o' }, q: { nombre: 'PC', color: 'i' } },
        enunciado: ['P está dentro del triángulo ABC, con ', v('p', `PB = ${cm(p)}`), ' y ', v('q', `PC = ${cm(q)}`), '. El perímetro de ABC mide un número entero de cm.'],
        pregunta: ['¿Cuál es su menor valor?'], datos: [D.dt, D.dentro, D.perimetro], correcta: bien, fmt: cm,
        errores: [
          er('GE-DT3', 2 * M, `Bien sumar los dos límites; pero ${2 * M} cm es justo el borde, que no se alcanza.`),
          er('GE-DT15', p + q + 1, 'Bien usar AB + AC > PB + PC; falta el límite de BC, que pasa de la diferencia.'),
          er('GE-DT16', 2 * M + 2, 'Bien los dos límites; pero el perímetro entero sale de la suma, sin redondear cada parte.'),
        ],
        solucion: [['El dato de P sale de prolongar BP hasta AC y usar la desigualdad en los dos triángulos que se forman.'],
          [`AB + AC > ${p} + ${q} = ${p + q} y BC > ${M} − ${Math.min(p, q)} = ${Math.abs(p - q)}: el perímetro pasa de ${2 * M} cm.`], ['El menor entero: ', v('x', cm(bien)), '.']],
        fig, _datos: { tipo: 'punto', idea: 'desigualdad', nivel: 3, p, q, pide: 'perimetro' },
      };
    }
  }

  // =============================== Idea 5: líneas notables ===============================
  // Triángulo de base BC = 6 con A en (ax, ay). lineas: { h, m, b, z }: altura, mediana, bisectriz o mediatriz, en tinta,
  // con su marca (cuadradito, llave en las dos mitades, dos arcos con rayita, cuadradito y llaves en el punto medio). Los
  // pies no llevan letra: diría qué línea es.
  function cevFig(A, lineas, o = {}) {
    const B = [0, 0], C = [6, 0], P = Object.assign({ A, B, C }, o.P || {}), segs = [{ de: 'A', a: 'B' }, { de: 'B', a: 'C' }, { de: 'C', a: 'A' }], angs = [], llaves = [];
    if (lineas.h) {
      P.H = [A[0], 0]; segs.push({ de: 'A', a: 'H' });
      if (A[0] < 0) segs.push({ de: 'H', a: 'B', discontinua: true }); else if (A[0] > 6) segs.push({ de: 'C', a: 'H', discontinua: true });
      angs.push({ en: 'H', de: A[0] > 6 ? 'B' : 'C', a: 'A', mide: 90 });
    }
    if (lineas.m || lineas.z) { P.M = [3, 0]; llaves.push({ de: 'B', a: 'M', marcas: 1, ref: [3, 1] }, { de: 'M', a: 'C', marcas: 1, ref: [3, 1] }); }
    if (lineas.m) segs.push({ de: 'A', a: 'M' });
    if (lineas.b) {
      const ab = dist(A, B), ac = dist(A, C), F = [6 * ab / (ab + ac), 0], hb = (Math.atan2(B[1] - A[1], B[0] - A[0]) - Math.atan2(C[1] - A[1], C[0] - A[0]));
      P.F = F; segs.push({ de: 'A', a: 'F' });
      const half = Math.abs(((hb / RAD) + 540) % 360 - 180) / 2;
      angs.push({ en: 'A', de: 'B', a: 'F', mide: half, rayita: 1, radio: 22 }, { en: 'A', de: 'F', a: 'C', mide: half, rayita: 1, radio: 22 });
    }
    if (lineas.z) { P.Z = [3, Math.min(A[1] * 0.98, 3 + A[1] * 0.4)]; segs.push({ de: 'M', a: 'Z', discontinua: !lineas.z.solida }); angs.push({ en: 'M', de: 'C', a: 'Z', mide: 90 }); }
    return { P, segs, angs, llaves };
  }
  const LINEAS = { h: 'Altura', m: 'Mediana', b: 'Bisectriz', z: 'Mediatriz' };
  const COD5 = { h: 'GE-LN1', m: 'GE8', b: 'GE-LN2', z: 'GE-LN3' };
  const MAL5 = {
    h: 'Bien ver que sale de un vértice; pero la altura lleva el cuadradito de 90° en su pie.',
    m: 'Bien ver que llega al lado de enfrente; pero la mediana lleva la misma rayita en sus dos mitades.',
    b: 'Bien ver que sale de un vértice; pero la bisectriz lleva dos arcos iguales en ese vértice.',
    z: 'Bien ver que forma 90°; pero la mediatriz nace en el punto medio, no en un vértice.',
  };
  function reconocer(rng) {
    for (const sigue = tope(); sigue();) {
      const t = rng.elegir(['h', 'm', 'b', 'z']), ax = rng.elegir([-1.5, -1, 0.5, 1, 1.5, 2, 4, 4.5, 5, 6.5, 7]), ay = rng.elegir([2.4, 3, 3.6]);
      if ((t === 'h' && Math.abs(ax - 3) < 0.6) || (t !== 'h' && (ax < 0 || ax > 6))) continue;
      const c = cevFig([ax, ay], { [t]: t === 'z' ? { solida: true } : {} });
      const fig = figura(Object.assign(c, { letras: ['A', 'B', 'C'], alto: 240, padAbajo: c.llaves.length ? 0.9 : 0.45, alt: 'Triángulo ABC con una línea trazada hasta el lado BC (o su recta), con sus marcas.' }));
      if (!rotular(fig)) continue;
      const errores = ['h', 'm', 'b', 'z'].filter(k => k !== t).map(k => erT(COD5[k], LINEAS[k],
        t === 'z' && k === 'h' ? 'Bien ver el cuadradito de 90°; pero no sale de un vértice: nace en el punto medio.'
          : t === 'h' && k === 'z' ? 'Bien ver el cuadradito de 90°; pero sale de un vértice y no llega al punto medio.' : MAL5[k]));
      const marca = { h: 'el cuadradito de 90° en su pie', m: 'la misma rayita en las dos mitades del lado', b: 'dos arcos iguales en el vértice A', z: 'el cuadradito en el punto medio del lado, sin salir de un vértice' }[t];
      return {
        variables: {}, enunciado: ['En el triángulo ABC se trazó una línea notable, con sus marcas.'], pregunta: ['¿Qué línea notable es?'], datos: [D.marcas],
        texto: { correcta: { clave: LINEAS[t], texto: LINEAS[t] }, errores },
        solucion: [[`Su marca: ${marca}.`], ['Es la ', v('x', LINEAS[t].toLowerCase()), '.']],
        fig, _datos: { tipo: 'reconocer', idea: 'lineas-notables', nivel: 1, linea: t, A: [ax, ay], pide: 'linea' },
      };
    }
  }
  function donde(rng) {
    for (const sigue = tope(); sigue();) {
      const k = rng.entero(0, 2), b = k === 0 ? 5 * rng.entero(20, 28) : k === 1 ? 90 : 5 * rng.entero(8, 16), c = 5 * rng.entero(5, Math.min(16, (175 - b) / 5 - 1));
      if (180 - b - c < 20) continue;
      const fig = triFig(b, c, { B: b === 90 ? { color: 'h', texto: '90°' } : dado(`${b}°`), C: dado(`${c}°`) }, { alt: `Triángulo ABC con ${b}° en B y ${c}° en C.` });
      if (!rotular(fig)) continue;
      const O = { dentro: 'Dentro del lado BC', fuera: 'Fuera, en la prolongación de CB', enB: 'Justo en B: AB es la altura', medio: 'En el punto medio de BC' };
      const bien = k === 0 ? 'fuera' : k === 1 ? 'enB' : 'dentro';
      const SF = {
        dentro: ['GE7-a', 'Bien buscar dónde llega; caería dentro si B y C fueran agudos. La altura forma 90° con la recta BC.'],
        fuera: ['GE-LN4', 'Bien pensar en la prolongación; pero solo cae fuera si B es obtuso.'],
        enB: ['GE7-b', 'Bien mirar el lado AB; sería la altura solo si B midiera 90°.'],
        medio: ['GE8', 'Bien buscar un punto especial; el punto medio es el pie de la mediana, no de la altura.'],
      };
      return {
        variables: {}, enunciado: [`En el triángulo ABC, m∠B = ${b}° y m∠C = ${c}°.`], pregunta: ['¿Dónde cae el pie de la altura trazada desde A?'], datos: [D.alt, D.clases],
        texto: { correcta: { clave: O[bien], texto: O[bien] }, errores: Object.keys(O).filter(x => x !== bien).map(x => erT(SF[x][0], O[x], SF[x][1])) },
        solucion: [[k === 0 ? 'B es obtuso: la perpendicular desde A llega a la recta BC más allá de B.' : k === 1 ? 'B mide 90°: el lado AB ya es perpendicular a BC.' : 'B y C son agudos: la perpendicular cae entre B y C.'], [v('x', O[bien]), '.']],
        fig, _datos: { tipo: 'donde', idea: 'lineas-notables', nivel: 1, angulos: { B: b, C: c }, pide: 'pie' },
      };
    }
  }
  function angAltura(rng) {
    for (const sigue = tope(); sigue();) {
      const obt = rng.entero(1, 5) <= 2, b = obt ? 5 * rng.entero(23, 27) : 5 * rng.entero(7, 13), c = 5 * rng.entero(5, 10), x = obt ? b - 90 : 90 - b;
      if (180 - b - c < 15) continue;
      const { A } = vert(b, c), cv = cevFig(A, { h: {} });
      cv.angs.push({ en: 'B', de: 'C', a: 'A', mide: b, color: 'h', texto: `${b}°`, radio: 16 }, { en: 'A', de: obt ? 'H' : 'B', a: obt ? 'B' : 'H', mide: x, radio: 30, texto: '?' });
      const fig = figura(Object.assign(cv, { letras: ['A', 'B', 'C', 'H'], alto: 250, alt: `Triángulo ABC con ${b}° en B y la altura AH${obt ? ', que cae fuera, más allá de B' : ''}.` }));
      if (!rotular(fig)) continue;
      return {
        variables: {}, enunciado: [`En el triángulo ABC, m∠B = ${b}° y AH es la altura desde A${obt ? ', que cae fuera de BC, más allá de B' : ''}.`],
        pregunta: ['¿Cuánto mide el ángulo BAH?'], datos: [D.alt, D.ady, D.sumaO], correcta: x, fmt: gr,
        errores: [
          er('GE-LN5', b, `Bien mirar el triángulo ABH; ${b}° es el ángulo B, y ∠BAH es otro ángulo.`),
          er('GE-LN6', 180 - b, obt ? `Bien hallar m∠ABH = ${180 - b}°; falta restarlo junto con los 90° de H.` : 'Bien restar de 180°; también hay que quitar los 90° de H.'),
          er('GE-LN7', (180 - b) / 2, 'Bien buscar el ángulo en A; partir en dos sirve con una bisectriz, no con la altura.'),
        ],
        solucion: [[obt ? `En la recta, m∠ABH = 180° − ${b}° = ${180 - b}°; en ABH, con 90° en H:` : 'En el triángulo ABH, con 90° en H:'], [obt ? `m∠BAH = 180° − 90° − ${180 - b}° = ` : `m∠BAH = 180° − 90° − ${b}° = `, v('x', gr(x)), '.']],
        fig, _datos: { tipo: 'ang-altura', idea: 'lineas-notables', nivel: 2, B: b, C: c, obtuso: obt, pide: 'BAH' },
      };
    }
  }
  function angBisectriz(rng) {
    for (const sigue = tope(); sigue();) {
      const b = 5 * rng.entero(11, 16), c = 5 * rng.entero(6, 10), a = 180 - b - c;
      if (a < 30 || a % 2 || b < c + 10) continue;
      const x = b + a / 2, { A } = vert(b, c), cv = cevFig(A, { b: {} });
      cv.angs.push({ en: 'B', de: 'C', a: 'A', mide: b, color: 'h', texto: `${b}°`, radio: 16, marcas: 2 }, { en: 'C', de: 'A', a: 'B', mide: c, color: 'h', texto: `${c}°`, radio: 24, marcas: 3 }, { en: 'F', de: 'C', a: 'A', mide: x, radio: 16, texto: '?' });
      const fig = figura(Object.assign(cv, { letras: ['A', 'B', 'C', 'F'], alto: 250, alt: `Triángulo ABC con ${b}° en B, ${c}° en C y la bisectriz AF del ángulo A.` }));
      if (!rotular(fig)) continue;
      return {
        variables: {}, enunciado: [`En el triángulo ABC, m∠B = ${b}°, m∠C = ${c}° y AF es la bisectriz del ángulo A.`], pregunta: ['¿Cuánto mide el ángulo AFC?'],
        datos: [D.suma, D.bis, D.ext], correcta: x, fmt: gr,
        errores: [
          er('GE-LN8', b + a, 'Bien usar el exterior de ABF; ahí entra la mitad de A, no el ángulo entero.'),
          er('GE-LN9', c + a / 2, `Bien usar la mitad de A; ${c + a / 2}° mide ∠AFB, el del otro lado del pie.`),
          er('GE-LN10', 90, 'Bien buscar el ángulo en F; 90° sería si la bisectriz fuera también altura, y eso pide AB = AC.'),
        ],
        solucion: [[`m∠A = 180° − ${b}° − ${c}° = ${a}°; la bisectriz deja ${a / 2}°. ∠AFC es exterior de ABF.`], [`m∠AFC = ${b}° + ${a / 2}° = `, v('x', gr(x)), '.']],
        fig, _datos: { tipo: 'ang-bisectriz', idea: 'lineas-notables', nivel: 2, B: b, C: c, pide: 'AFC' },
      };
    }
  }
  function alturaBisectriz(rng) {
    for (const sigue = tope(); sigue();) {
      const b = 5 * rng.entero(14, 16), c = 5 * rng.entero(4, 8), a = 180 - b - c;
      if (b - c < 50 || (b - c) % 10 || a < 20 || b >= 90) continue;
      const x = (b - c) / 2, { A } = vert(b, c), cv = cevFig(A, { h: {}, b: {} });
      cv.angs = cv.angs.filter(z => z.en !== 'A');
      // ∠HAF y el ángulo C son cuñas angostas: llevan su arco (∠HAF en tinta, lo pedido) y sus valores van en el texto.
      cv.angs.push({ en: 'B', de: 'C', a: 'A', mide: b, color: 'h', radio: 14, marcas: 2, crece: false }, { en: 'C', de: 'A', a: 'B', mide: c, color: 'h', radio: 24, marcas: 3 }, { en: 'A', de: 'H', a: 'F', mide: x, radio: 40 });
      const fig = figura(Object.assign(cv, { letras: ['A', 'B', 'C', 'H', 'F'], alto: 250, alt: 'Triángulo ABC con la altura AH y la bisectriz AF del ángulo A; el ángulo HAF queda entre las dos.' }));
      if (!rotular(fig)) continue;
      return {
        variables: {}, enunciado: [`En el triángulo ABC, m∠B = ${b}° y m∠C = ${c}°. AH es la altura y AF la bisectriz del ángulo A.`], pregunta: ['¿Cuánto mide el ángulo HAF?'],
        datos: [D.suma, D.alt, D.bis], correcta: x, fmt: gr,
        errores: [
          er('GE-LN11', b - c, 'Bien restar B y C; el resultado todavía se parte entre dos.'),
          er('GE-LN12', (b + c) / 2, 'Bien partir entre dos; pero lo que se parte es la diferencia de B y C.'),
          er('GE-LN13', 90 - b, `Bien hallar m∠BAH = ${90 - b}°; falta compararlo con la mitad de A.`),
        ],
        solucion: [[`m∠A = ${a}°: m∠BAF = ${a / 2}°. En ABH, m∠BAH = 90° − ${b}° = ${90 - b}°. ∠HAF va de uno al otro.`], [`m∠HAF = ${a / 2}° − ${90 - b}° = `, v('x', gr(x)), '.']],
        fig, _datos: { tipo: 'altura-bisectriz', idea: 'lineas-notables', nivel: 3, B: b, C: c, pide: 'HAF' },
      };
    }
  }

  // =============================== Idea 6: ángulos entre bisectrices ===============================
  // Bisectrices de B y C. modo: 'I' (dos interiores), 'E' (interior de B y exterior de C) o 'Q' (dos exteriores).
  function bisFig(b, c, modo, rot) {
    const { A, B, C } = vert(b, c), a = 180 - b - c, P = { A, B, C }, segs = [], angs = [], letras = [];
    const bisB = polar(B, 1, b / 2), bisC = polar(C, 1, 180 - c / 2);
    if (modo === 'I') {
      P.I = corte(B, bisB, C, bisC); letras.push('I'); segs.push({ de: 'B', a: 'I' }, { de: 'C', a: 'I' });
      angs.push({ en: 'B', de: 'C', a: 'I', mide: b / 2, rayita: 1, radio: 26, color: 'h' }, { en: 'B', de: 'I', a: 'A', mide: b / 2, rayita: 1, radio: 26, color: 'h' },
        { en: 'C', de: 'I', a: 'B', mide: c / 2, rayita: 2, radio: 26, color: 'h' }, { en: 'C', de: 'A', a: 'I', mide: c / 2, rayita: 2, radio: 26, color: 'h' });
      if (rot.X) angs.push(Object.assign({ en: 'I', de: 'B', a: 'C', mide: 90 + a / 2, radio: 14 }, rot.X));
    } else if (modo === 'E') {
      const extC = polar(C, 1, 90 - c / 2); P.E = corte(B, bisB, C, extC); P.D = [6 + 2.2, 0]; letras.push('E', 'D');
      segs.push({ de: 'B', a: 'E' }, { de: 'C', a: 'E' }, { de: 'C', a: 'D', discontinua: true });
      angs.push({ en: 'B', de: 'C', a: 'E', mide: b / 2, rayita: 1, radio: 26, color: 'h' }, { en: 'B', de: 'E', a: 'A', mide: b / 2, rayita: 1, radio: 26, color: 'h' },
        { en: 'C', de: 'D', a: 'E', mide: 90 - c / 2, rayita: 2, radio: 22, color: 'h' }, { en: 'C', de: 'E', a: 'A', mide: 90 - c / 2, rayita: 2, radio: 22, color: 'h' });
      if (rot.X) angs.push(Object.assign({ en: 'E', de: 'B', a: 'C', mide: a / 2, radio: 22 }, rot.X));
    } else {
      // Exterior en B: entre BC y la prolongación de AB más allá de B (F); exterior en C: entre CB y la de AC más allá de C (G).
      P.F = mas(B, A, -2 / dist(A, B)); P.G = mas(C, A, -2 / dist(A, C));
      P.Q = corte(B, polar(B, 1, b / 2 - 90), C, polar(C, 1, 270 - c / 2)); letras.push('Q', 'F', 'G');
      segs.push({ de: 'B', a: 'F', discontinua: true }, { de: 'C', a: 'G', discontinua: true }, { de: 'B', a: 'Q' }, { de: 'C', a: 'Q' });
      angs.push({ en: 'B', de: 'F', a: 'Q', mide: 90 - b / 2, rayita: 1, radio: 22, color: 'h' }, { en: 'B', de: 'Q', a: 'C', mide: 90 - b / 2, rayita: 1, radio: 22, color: 'h' },
        { en: 'C', de: 'B', a: 'Q', mide: 90 - c / 2, rayita: 2, radio: 22, color: 'h' }, { en: 'C', de: 'Q', a: 'G', mide: 90 - c / 2, rayita: 2, radio: 22, color: 'h' });
      if (rot.X) angs.push(Object.assign({ en: 'Q', de: 'C', a: 'B', mide: 90 - a / 2, radio: 22 }, rot.X));
    }
    if (rot.A) angs.push(Object.assign({ en: 'A', de: 'B', a: 'C', mide: a, marcas: 1, radio: 20 }, rot.A));
    const alt = { I: 'Triángulo ABC con las bisectrices interiores de B y de C, que se cortan en I.', E: 'Triángulo ABC con la bisectriz interior de B y la exterior de C (BC se prolonga hasta D), que se cortan en E.',
      Q: 'Triángulo ABC con las bisectrices de los ángulos exteriores en B y en C, que se cortan en Q.' }[modo];
    return figura({ P, letras: ['A', 'B', 'C', ...letras], segs: [{ de: 'A', a: 'B' }, { de: 'B', a: 'C' }, { de: 'C', a: 'A' }, ...segs], angs, alt, alto: modo === 'I' ? 240 : 262 });
  }
  const bc6 = (rng, a) => { for (;;) { const b = 10 * rng.entero(3, 10), c = 180 - a - b; if (c >= 30 && c <= 100 && b <= 100) return [b, c]; } };
  function incentro(rng) {
    for (const sigue = tope(); sigue();) {
      const a = 10 * rng.entero(3, 10), [b, c] = bc6(rng, a), fig = bisFig(b, c, 'I', { A: dado(`${a}°`), X: pide() }), x = calc.angulo('incentro', a);
      if (!rotular(fig)) continue;
      return {
        variables: {}, enunciado: [`En el triángulo ABC, m∠A = ${a}°. Las bisectrices interiores de B y C se cortan en I.`], pregunta: ['¿Cuánto mide el ángulo BIC?'],
        datos: [D.BIC, D.BEC, D.BQC], correcta: x, fmt: gr,
        errores: [
          er('GE-BIS4', calc.angulo('int-ext', a), 'Bien usar la mitad de A; esa regla va con una bisectriz exterior, y aquí las dos son interiores.'),
          er('GE-BIS6', 90 + a, 'Bien sumar 90°; pero cada bisectriz deja solo la mitad: va la mitad de A.'),
          er('GE-BIS7', calc.angulo('excentro', a), 'Bien usar la mitad de A; 90° menos esa mitad va con dos bisectrices exteriores.'),
        ],
        solucion: [['Dos bisectrices interiores: 90° más la mitad de A.'], [`m∠BIC = 90° + (${a}° ÷ 2) = `, v('x', gr(x)), '.']],
        fig, _datos: { tipo: 'incentro', idea: 'angulo-de-bisectrices', nivel: 1, A: a, B: b, C: c, pide: 'BIC' },
      };
    }
  }
  function intExt(rng) {
    for (const sigue = tope(); sigue();) {
      const a = 10 * rng.entero(5, 9), [b, c] = bc6(rng, a), fig = bisFig(b, c, 'E', { A: dado(`${a}°`), X: pide() }), x = calc.angulo('int-ext', a);
      if (!rotular(fig)) continue;
      return {
        variables: {}, enunciado: [`En el triángulo ABC, m∠A = ${a}°. La bisectriz interior de B y la exterior de C se cortan en E.`], pregunta: ['¿Cuánto mide el ángulo BEC?'],
        datos: [D.BIC, D.BEC, D.BQC], correcta: x, fmt: gr,
        errores: [
          er('GE-BIS4', calc.angulo('incentro', a), 'Bien usar la mitad de A; pero esa regla va con dos interiores, y la de C es exterior.'),
          er('GE-BIS5-a', a, `Bien relacionar E con A; pero E recibe solo la mitad de los ${a}°.`),
          er('GE-BIS14', a / 4, `Bien partir A; pero se parte una sola vez: E recibe la mitad de ${a}°, no la cuarta parte.`),
          er('GE-BIS5-b', 90, 'Bien: las dos bisectrices de C forman 90° entre ellas. Pero el ángulo en E es otro.'),
          er('GE-BIS7', calc.angulo('excentro', a), 'Bien usar la mitad de A; 90° menos esa mitad va con dos bisectrices exteriores.'),
        ],
        solucion: [['Interior con exterior: la mitad de A.'], [`m∠BEC = ${a}° ÷ 2 = `, v('x', gr(x)), '.']],
        fig, _datos: { tipo: 'int-ext', idea: 'angulo-de-bisectrices', nivel: 2, A: a, B: b, C: c, pide: 'BEC' },
      };
    }
  }
  function dosExt(rng) {
    for (const sigue = tope(); sigue();) {
      const a = 10 * rng.entero(3, 9), [b, c] = bc6(rng, a), fig = bisFig(b, c, 'Q', { A: dado(`${a}°`), X: pide() }), x = calc.angulo('excentro', a);
      if (!rotular(fig)) continue;
      return {
        variables: {}, enunciado: [`En el triángulo ABC, m∠A = ${a}°. Las bisectrices de los ángulos exteriores en B y en C se cortan en Q.`], pregunta: ['¿Cuánto mide el ángulo BQC?'],
        datos: [D.BIC, D.BEC, D.BQC], correcta: x, fmt: gr,
        errores: [
          er('GE-BIS7', calc.angulo('incentro', a), 'Bien usar la mitad de A; 90° más esa mitad va con dos bisectrices interiores.'),
          er('GE-BIS4', calc.angulo('int-ext', a), 'Bien usar la mitad de A; sola va con una interior y una exterior.'),
          er('GE-BIS8', 180 - a, 'Bien restar; pero la regla es 90° menos la mitad de A.'),
        ],
        solucion: [['Dos bisectrices exteriores: 90° menos la mitad de A.'], [`m∠BQC = 90° − (${a}° ÷ 2) = `, v('x', gr(x)), '.']],
        fig, _datos: { tipo: 'dos-ext', idea: 'angulo-de-bisectrices', nivel: 2, A: a, B: b, C: c, pide: 'BQC' },
      };
    }
  }
  function conBC(rng) {
    for (const sigue = tope(); sigue();) {
      const b = 10 * rng.entero(5, 8), c = 10 * rng.entero(5, 8);
      if (b + c > 150 || b === c) continue;
      const x = 180 - (b + c) / 2, fig = bisFig(b, c, 'I', { X: pide() });
      if (!rotular(fig)) continue;
      return {
        variables: {}, enunciado: [`En el triángulo ABC, m∠B = ${b}° y m∠C = ${c}°. Las bisectrices interiores de B y C se cortan en I.`], pregunta: ['¿Cuánto mide el ángulo BIC?'],
        datos: [D.bis2, D.sumaO], correcta: x, fmt: gr,
        errores: [
          er('GE-BIS9', (b + c) / 2, `Bien sumar las dos mitades: ${(b + c) / 2}°. ∠BIC es lo que les falta para 180°.`),
          er('GE-BIS5-a', 180 - b - c, `Bien hallar m∠A = ${180 - b - c}°; pero I ve otro ángulo.`),
          er('GE-BIS10', 90 + (b + c) / 2, 'Bien recordar una regla con 90°; pero va con la mitad de A, no con la de B + C.'),
        ],
        solucion: [[`En el triángulo BIC quedan las mitades: ${b / 2}° en B y ${c / 2}° en C.`], [`m∠BIC = 180° − ${b / 2}° − ${c / 2}° = `, v('x', gr(x)), '.']],
        fig, _datos: { tipo: 'con-bc', idea: 'angulo-de-bisectrices', nivel: 2, B: b, C: c, pide: 'BIC' },
      };
    }
  }
  function inverso(rng) {
    for (const sigue = tope(); sigue();) {
      const conE = rng.entero(1, 3) === 1, a = 2 * rng.entero(15, 50), b = Math.round((180 - a) / 2 / 5) * 5 + 5 * rng.entero(-3, 3), c = 180 - a - b;
      if (c < 25 || b < 25 || (conE && (a < 60 || a > 100))) continue;
      const th = conE ? calc.angulo('int-ext', a) : calc.angulo('incentro', a), fig = bisFig(b, c, conE ? 'E' : 'I', { A: pide(), X: dado(`${th}°`) });
      if (!rotular(fig)) continue;
      const base0 = { variables: {}, datos: [D.BIC, D.BEC, D.BQC], correcta: a, fmt: gr, fig, _datos: { tipo: 'inverso', idea: 'angulo-de-bisectrices', nivel: 3, conE, X: th, B: b, C: c, pide: 'A' } };
      if (conE) return Object.assign(base0, {
        enunciado: [`En el triángulo ABC, la bisectriz interior de B y la exterior de C se cortan en E, y m∠BEC = ${th}°.`], pregunta: ['¿Cuánto mide el ángulo A?'],
        errores: [
          er('GE-BIS11', th, `Bien usar la regla de E; ${th}° es la mitad de A: falta duplicarlo.`),
          er('GE-BIS12', 180 - th, 'Bien buscar A; restar de 180° daría el vecino de ∠BEC, no el ángulo A.'),
          er('GE-BIS13', th / 2, `Bien usar la regla; pero ${th}° ya es la mitad de A: se duplica, no se divide.`),
        ],
        solucion: [['Interior con exterior: m∠BEC es la mitad de A.'], [`m∠A = 2 · ${th}° = `, v('x', gr(a)), '.']] });
      return Object.assign(base0, {
        enunciado: [`En el triángulo ABC, las bisectrices interiores de B y C se cortan en I, y m∠BIC = ${th}°.`], pregunta: ['¿Cuánto mide el ángulo A?'],
        errores: [
          er('GE-BIS11', th - 90, `Bien restar los 90°; ${th - 90}° es la mitad de A: falta duplicarlo.`),
          er('GE-BIS12', 180 - th, 'Bien buscar A; restar de 180° daría el vecino de ∠BIC, y la regla dice lo que pasa de 90°.'),
          er('GE-BIS13', (th - 90) / 2, 'Bien restar los 90°; pero lo que pasa de 90° ya es la mitad de A: se duplica.'),
        ],
        solucion: [[`Lo que pasa de 90° es la mitad de A: ${th}° − 90° = ${th - 90}°.`], [`m∠A = 2 · ${th - 90}° = `, v('x', gr(a)), '.']] });
    }
  }

  // =============================== Armado ===============================
  const TIPOS = {
    tercero, clase, razon, 'con-x': conX, mariposa,
    exterior, lejano, 'ext-x': extX, 'tres-ext': tresExt, flecha, antena,
    base, punta, 'lados-x': ladosX, orden, cadena, paralela,
    'max-min': maxMin, cuantos, 'iso-dt': isoDT, diagonal, punto,
    reconocer, donde, 'ang-altura': angAltura, 'ang-bisectriz': angBisectriz, 'altura-bisectriz': alturaBisectriz,
    incentro, 'int-ext': intExt, 'dos-ext': dosExt, 'con-bc': conBC, inverso,
  };
  const IDEAS = {
    'suma-de-angulos': ['tercero', 'clase', 'razon', 'con-x', 'mariposa'],
    'angulo-exterior': ['exterior', 'lejano', 'ext-x', 'tres-ext', 'flecha', 'antena'],
    isosceles: ['base', 'punta', 'lados-x', 'orden', 'cadena', 'paralela'],
    desigualdad: ['max-min', 'cuantos', 'iso-dt', 'diagonal', 'punto'],
    'lineas-notables': ['reconocer', 'donde', 'ang-altura', 'ang-bisectriz', 'altura-bisectriz'],
    'angulo-de-bisectrices': ['incentro', 'int-ext', 'dos-ext', 'con-bc', 'inverso'],
  };
  // Papel (regla 6; herramientas/papel-generador.js usa «papel-1» a «papel-8»: 3 básicos, 3 intermedios y 2 avanzados).
  // Solo tipos que se resuelven con el texto (el papel no lleva la figura), uno o dos por idea: las seis ideas.
  const PAPEL = { 'papel-1': 'tercero', 'papel-2': 'exterior', 'papel-3': 'base', 'papel-4': 'int-ext', 'papel-5': 'cuantos',
    'papel-6': 'ang-altura', 'papel-7': 'cadena', 'papel-8': 'punto' };

  // Pruebas de entrada y salida de la práctica (app/practica.js, semillas «entrada-1» a «-3» y «salida-1» a «-3»): se
  // muestran sin la figura, así que van tipos que se resuelven con el texto (reconocer una línea, no), de las ideas 1 a 3;
  // la salida repite los tipos de la entrada con otros números.
  const PRUEBA = { 'entrada-1': 'tercero', 'entrada-2': 'exterior', 'entrada-3': 'base', 'salida-1': 'tercero', 'salida-2': 'exterior', 'salida-3': 'base' };

  function generar(semilla, opciones = {}) {
    const rng = Azar.crear(`${ID}|${semilla}`);
    const fijo = PAPEL[String(semilla)] || PRUEBA[String(semilla)] || opciones.tipo;
    const idea = opciones.idea && IDEAS[opciones.idea] ? opciones.idea : rng.elegir(Object.keys(IDEAS));
    const tipo = fijo || rng.elegir(IDEAS[idea]);
    for (let intento = 0; intento < 200; intento++) {
      const pr = TIPOS[tipo](rng);
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
      return Object.assign({
        id: `${ID}#${semilla}`, variables: Object.assign({ x: { nombre: 'lo que se pide', color: 'f' } }, pr.variables),
        enunciado: pr.enunciado, pregunta: pr.pregunta, datos: pr.datos, alternativas, solucion: pr.solucion,
        respuesta: { valor, unidad: '' }, _datos: Object.assign({ valor: pr._datos.valor !== undefined ? pr._datos.valor : valor }, pr._datos),
      }, pr.fig ? angEsc(pr.fig) : {});
    }
    throw new Error(`${ID}: no se pudo generar un problema con 4 alternativas distintas (${tipo})`);
  }

  // TIPOS_POR_IDEA: lo que lee el catálogo para «Practicar por idea» (herramientas/construir-catalogo.js; auditoría, M8).
  // calc: el cálculo de la desigualdad que usa esta práctica (el de geo-triangulos-notables), para el verificador de geo-14.
  return { id: ID, titulo: 'Triángulos y líneas notables', generar, TIPOS: Object.keys(TIPOS), IDEAS, TIPOS_POR_IDEA: IDEAS, calc, marco, diag };
});
