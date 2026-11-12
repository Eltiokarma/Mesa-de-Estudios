/*
 * Motor de «La lupa de las moléculas grandes».
 *
 * Aquí vive toda la química de la plantilla (regla 1 de CLAUDE.md). No toca el DOM: funciona igual en el navegador
 * (window.MotorMoleculaGrande, con moleculas.js cargado antes) y en Node (require('./motor.js')), donde lo prueban
 * casos.json y papel.json. RDKit solo se usó como herramienta de autor (coordenadas.py: dibujo y comprobación de los
 * SMILES); todo lo de aquí está escrito en JS.
 *
 * ENTRADA. Toda función recibe `x`: el id de una molécula de la biblioteca (moleculas.js, p. ej. 'tirosina'), un
 * SMILES o una molécula ya leída. Índices de átomo: desde 0, en el orden en que aparecen los átomos en el SMILES (los
 * H no son átomos: van implícitos en cada átomo). Índices de enlace: desde 0, en el orden en que el SMILES los cierra
 * (cada átomo nuevo cierra su enlace con el anterior; un dígito de anillo cierra su enlace cuando aparece por segunda
 * vez).
 *
 * FUNCIONES
 *   molecula(smiles): lee un SMILES de subconjunto: B C N O P S F Cl Br I sin corchetes; aromáticos b c n o p s;
 *     corchetes con H y carga ([nH], [O-], [NH3+], [C@@H]); anillos con dígitos y %nn; ramas; enlaces - = # : y / \ y
 *     @ @@ (se leen y se guardan; el motor no calcula estereoquímica). Los anillos aromáticos en minúscula se pasan a
 *     una estructura de Kekulé (enlaces 1 y 2 alternados). H implícitos por la valencia normal más baja que alcance:
 *     B 3; C 4; N 3 o 5; O 2; P 3 o 5; S 2, 4 o 6; halógenos 1. Devuelve { atomos: [{ el, h, carga, arom, quiral }],
 *     enlaces: [{ a, b, orden }] }.
 *   formula(x): { texto (Hill: C, H y el resto en orden alfabético), conteo, masa, hidrocarburo }. Masas molares de
 *     academia: H 1, B 11, C 12, N 14, O 16, F 19, P 31, S 32, Cl 35,5, Br 80, I 127 (g/mol).
 *   hibridacion(x): { porAtomo: ['sp3'…] (null en el H), carbonos: { sp: [i…], sp2: [...], sp3: [...] }, cuenta }.
 *   lupa(x, 'sp2' | 'sp3' | 'sp'): { valor, atomos, errores } (solo carbonos).
 *   enlaces(x): { sigma, pi, dobles, triples, electronesPi, polares, apolares, conexionesPolares, conexionesApolares,
 *     enlacesPi: [k…], errores: { pi: {...}, electronesPi: {...}, polares: {...} } }.
 *   pares(x): { total, porElemento: { O: n… }, porAtomo: [n…], errores }.
 *   octeto(x): { atomos: [{ i, el, electrones, estado: 'cumple' | 'expandido' | 'incompleto' }] (los H no son
 *     átomos: cumplen su dueto), noCumplen: [i…], valor (cuántos no cumplen), todosCumplen, errores }.
 *   anillos(x): { lista: [{ atomos, tamano, huckel, electrones, aromatico, conCarbonilo, hetero }], total, aromaticos,
 *     errores }.
 *   grupos(x): { lista: [{ tipo, nombre, clase?, atomos }], cuenta: { tipo: n }, principal: { tipo, familia, nombre },
 *     alcoholes: { primario: n, secundario: n, terciario: n } (solo las clases que hay), aminas (igual), errores }.
 *     Los tipos van sin tilde: acido, carboxilato, ester, lactona, amida, lactama, urea, nitrilo, aldehido, cetona,
 *     alcohol, fenol, enol, hemiacetal, acetal, tiol, amina, amonio, imina, eter, sulfuro, disulfuro, sulfoxido,
 *     tiosulfinato, halogenuro, alquino, alqueno, aromatico, heterociclo.
 *   quirales(x): { valor, atomos, errores }.
 *   metilos(x): { valor, atomos, enAnillo, enCadena, errores } los CH₃ unidos a un carbono (sustituyentes metilo; el CH₃ de un
 *     éter, éster o amina no cuenta; un etilo, CH₃–CH₂–, no es un metilo). Se agregó con conteo(x, 'metilos').
 *   numeroOxidacion(x, i): número de oxidación del átomo i, y errores.
 *   hidrogenar(x, k): la molécula con el enlace k (C=C, C≡C, C=O o C=N) un orden más abajo (entra H₂); mismos átomos.
 *   ionizar(id, pH): forma que predomina a ese pH según los pKa de la ficha → { smiles, molecula, carga, forma,
 *     cargas: [{ i, carga }], errores }.
 *   conteo(x, lupa) con lupa 'sp2' | 'sp3' | 'sp' | 'pi' (enlaces π) | 'epi' (electrones π) | 'pares' | 'quirales' |
 *     'aromaticos' | 'polares' | 'octeto': { valor, atomos o enlaces, errores }.
 *   opciones(x, lupa): la correcta y tres errores de valor distinto, de menor a mayor; el lugar de la correcta lo
 *     decide una semilla de la molécula y la lupa (con lupa 'grupos': la función principal, en orden barajado). Si los
 *     errores no alcanzan, completa con el vecino de abajo o de arriba («conteo apurado»).
 *   lupaDisponible(x, lupa): si Explorar ofrece esa lupa (no sp sin C≡C, octeto sin átomos del tercer período,
 *     aromáticos sin anillos; tampoco aromáticos en quercetina y cafeína, ni la función principal de la cafeína).
 *   solubilidad(x): carbonos, O + N, grupos con OH, y la solubilidad de tabla de la ficha (el motor no la calcula).
 *   experimento(nombre): los cinco de «¿Qué pasa si…?» ('hidrogenar-oleico', 'piruvico-lactico', 'ciclar-glucosa',
 *     'octeto-alicina', 'fenilalanina-tirosina'): molécula de antes y de después, valor que se pregunta y errores.
 *   resumen(x): todo junto.
 *
 * CONVENCIONES (las del examen de admisión; cuando un libro dice otra cosa, se avisa)
 *   1. Hibridación del carbono (escolar, por sus enlaces): sp³ si todos sus enlaces son simples; sp² si tiene un doble
 *      (o es de un anillo aromático: en la estructura de Kekulé siempre tiene un doble); sp si tiene un triple o dos
 *      dobles. Las lupas sp, sp² y sp³ cuentan SOLO carbonos.
 *      Hibridación de N, O, S y halógenos: por dominios = átomos unidos (con los H) + pares libres: 4 sp³, 3 sp², 2 sp
 *      (5 sp³d, 6 sp³d²). Excepción: un N, O o S que está en un anillo aromático y pone su par en el anillo (N–H del
 *      pirrol o del indol, N con tres enlaces simples de la purina, O del furano) es sp². El N de una amida se cuenta
 *      por dominios (sp³), sin resonancia, como en la escuela; en la molécula real es casi plano. Ninguna lupa ni
 *      pregunta de la escena pregunta la hibridación de un N de amida.
 *   2. Enlaces σ y π: cada par de átomos unidos tiene 1 σ; un doble suma 1 π y un triple, 2 π. Los C–H y O–H cuentan
 *      como σ. Electrones π = 2 × enlaces π (los pares libres que un N o un O pone en un anillo aromático no se cuentan
 *      aquí: se cuentan como pares libres).
 *   3. Enlace polar: diferencia de electronegatividad de Pauling (H 2,20; B 2,04; C 2,55; N 3,04; O 3,44; F 3,98;
 *      P 2,19; S 2,58; Cl 3,16; Br 2,96; I 2,66), redondeada a centésimas, ≥ 0,4 (el corte de plantillas/enlace). Así
 *      C–H (0,35), C–S (0,03), S–H (0,38) y C–I (0,11) son apolares; C–N, C–O, O–H, N–H, C=O y S=O, polares. «polares»
 *      y «apolares» cuentan ENLACES como pares de electrones: un doble cuenta 2 (su σ y su π) y un triple, 3;
 *      «conexionesPolares» cuenta cada par de átomos unidos una sola vez.
 *   4. Pares libres: (electrones de valencia − carga − electrones que el átomo pone en enlaces, contando cada H) / 2,
 *      con la estructura tal como la escribe el SMILES. Electrones de valencia: H 1, B 3, C 4, N 5, O 6, P 5, S 6, F, Cl,
 *      Br e I 7. Octeto: electrones alrededor del átomo = 2 × (enlaces que tiene, contando el orden y los H) +
 *      2 × pares libres. 8: cumple; más de 8: expandido; menos de 8: incompleto (cada H tiene 2: cumple su dueto). El S de la alicina,
 *      escrito S(=O), queda con 10 (expandido); otros libros lo dibujan S⁺–O⁻ con octeto.
 *   5. Anillos: el conjunto más pequeño de anillos (SSSR; tantos como enlaces − átomos + 1, los más chicos que son
 *      independientes). Aromático (Hückel): cada átomo del anillo pone 1 electrón si tiene un doble enlace con otro
 *      átomo de ese anillo o de un anillo fusionado con él, 0 si su doble enlace va a un O, N o S fuera del anillo
 *      (C=O; el anillo queda marcado conCarbonilo), 2 si es un N, O o S sin doble enlace que pone su par libre; si algún
 *      átomo no puede poner nada (un C sp³, un doble enlace hacia una cadena), el anillo no es aromático. Es aromático si
 *      la suma es 4n + 2 (2, 6, 10…). Así lo hace también RDKit: el anillo de la pirona de la quercetina y el de seis de
 *      la cafeína (con C=O) cuentan como aromáticos; algunos libros no los cuentan, y por eso van marcados. Los anillos de
 *      los esteroides (salvo el A del estradiol) y el de la vitamina A no son aromáticos: tienen carbonos sp³.
 *   6. Grupos funcionales (cada uno con sus átomos):
 *      ácido carboxílico C(=O)OH; carboxilato C(=O)O⁻; éster C(=O)–O–C, lactona si el O y el C=O están en un mismo
 *      anillo; amida C(=O)–N, lactama si el C y el N están en un mismo anillo, urea si el C=O tiene dos N; aldehído C=O
 *      con un H; cetona C=O entre dos C; alcohol C–OH con el C sp³ (primario, secundario o terciario según cuántos C
 *      tiene unidos ese carbono; el C del metanol sería primario); fenol OH en un C de un anillo aromático; enol OH en un
 *      C de un doble C=C que no es aromático; hemiacetal un C sp³ con un OH y un O–C (incluye el hemicetal); acetal un
 *      C sp³ con dos O–C y ningún OH (incluye el cetal: el enlace glucosídico); éter C–O–C que no es nada de lo
 *      anterior (también el que está en un anillo aromático); amina por cuántos C tiene el N (1.ª, 2.ª o 3.ª), si el N no
 *      es de amida ni está en un anillo aromático; amonio N⁺ con H; nitrilo C≡N; imina C=N fuera de anillo aromático;
 *      halogenuro C–X; tiol S–H; sulfuro C–S–C; disulfuro C–S–S–C; sulfóxido C–S(=O)–C; tiosulfinato C–S(=O)–S–C;
 *      alqueno cada C=C que no es aromático ni de un enol; alquino cada C≡C; anillo aromático cada anillo aromático solo
 *      de carbonos; heterociclo aromático (nitrogenado, oxigenado o azufrado) cada anillo aromático con N, O o S. En un
 *      ácido, el O del OH no es alcohol ni el C=O es cetona; los O de un hemiacetal o acetal no son éter.
 *      Función principal (prioridad IUPAC, de mayor a menor): ácido carboxílico (y carboxilato) > éster (y lactona) >
 *      amida (lactama, urea) > nitrilo > aldehído > cetona > alcohol (con fenol, enol y hemiacetal) > tiol > amina (y
 *      amonio) > imina; si no hay ninguno de estos, no hay sufijo: el motor da el primero de éter, sulfuro, disulfuro,
 *      tiosulfinato, sulfóxido, halogenuro, alquino, alqueno, anillo aromático.
 *   7. Carbono quiral: carbono sp³ con 4 sustituyentes distintos (los H implícitos cuentan). Dos sustituyentes son
 *      iguales si su árbol, recorrido desde el carbono hacia afuera sin volver por el átomo de donde se viene, es el
 *      mismo hasta una profundidad igual al número de átomos (elemento, carga, H y orden de enlace en cada nudo; así
 *      funciona también en los anillos). Solo carbonos: el S de un sulfóxido no se cuenta. No se mira la
 *      estereoquímica de los sustituyentes (no hay pseudoasimétricos en la biblioteca).
 *   8. Número de oxidación de un átomo: por cada enlace, +orden si el otro átomo es más electronegativo, −orden si es
 *      menos (los H cuentan así), 0 si es del mismo elemento; más la carga del átomo.
 *   9. Forma según el pH (ionizar): cada grupo ácido de la ficha (carboxilo, amino como NH₃⁺, fenol) está protonado si
 *      pH < pKa y desprotonado si pH > pKa (la forma que predomina; pKa de tabla, Lehninger). Forma: «catión», «anión»,
 *      «neutra» o «zwitterión» (ion dipolar: una carga + y una − en la misma molécula).
 *  10. Cada función que alimenta una predicción trae `errores`: lo que da cada error típico (ver ERRORES abajo; códigos
 *      EN3, EN4, EN12, FO3 y FO4 de docs/investigacion/ y AQ- de química admisión, hipótesis).
 * FIN DE LA CABECERA
 */
(function (root, fabrica) {
  const bib = (typeof module === 'object' && module.exports) ? require('./moleculas.js') : (root && root.MoleculasGrandes);
  const motor = fabrica(bib);
  if (typeof module === 'object' && module.exports) module.exports = motor;
  else root.MotorMoleculaGrande = motor;
})(typeof self !== 'undefined' ? self : this, function (BIB) {
  'use strict';

  const VAL = { B: [3], C: [4], N: [3, 5], O: [2], P: [3, 5], S: [2, 4, 6], F: [1], Cl: [1], Br: [1], I: [1] };
  const VE = { H: 1, B: 3, C: 4, N: 5, O: 6, P: 5, S: 6, F: 7, Cl: 7, Br: 7, I: 7 };
  const EN = { H: 2.20, B: 2.04, C: 2.55, N: 3.04, O: 3.44, F: 3.98, P: 2.19, S: 2.58, Cl: 3.16, Br: 2.96, I: 2.66 };
  const MASA = { H: 1, B: 11, C: 12, N: 14, O: 16, F: 19, P: 31, S: 32, Cl: 35.5, Br: 80, I: 127 };
  const HALO = new Set(['F', 'Cl', 'Br', 'I']);
  const r2 = x => Math.round(x * 100) / 100;

  // ---------------- Lector de SMILES ----------------
  function molecula(smiles) {
    const s = String(smiles).trim();
    if (!s) throw new Error('molécula: SMILES vacío');
    const at = [], en = [], anillos = {};
    const pila = [];
    let prev = -1, bond = null, i = 0;
    const err = m => { throw new Error(`molécula: ${m} (en «${s}», posición ${i + 1})`); };
    const nuevo = a => { at.push(a); const k = at.length - 1; if (prev >= 0) unir(prev, k, bond); prev = k; bond = null; return k; };
    function unir(a, b, sim) {
      if (a === b || en.some(e => (e.a === a && e.b === b) || (e.a === b && e.b === a))) err('enlace repetido');
      const arom = at[a].arom && at[b].arom;
      let orden = 1, ar = false;
      if (sim === '=') orden = 2; else if (sim === '#') orden = 3;
      else if (sim === ':' || (sim === null && arom)) ar = true;
      en.push({ a, b, orden, ar, dir: sim === '/' || sim === '\\' ? sim : null });
    }
    while (i < s.length) {
      const ch = s[i];
      if (ch === '(') { if (prev < 0) err('rama sin átomo'); pila.push(prev); i++; continue; }
      if (ch === ')') { if (!pila.length) err('paréntesis de más'); prev = pila.pop(); i++; continue; }
      if ('-=#:/\\'.includes(ch)) { bond = ch; i++; continue; }
      if (ch === '.') err('el SMILES tiene piezas sueltas');
      if (/\d/.test(ch) || ch === '%') {
        let n;
        if (ch === '%') { n = s.slice(i + 1, i + 3); if (!/^\d\d$/.test(n)) err('%nn mal escrito'); i += 3; } else { n = ch; i++; }
        if (prev < 0) err('dígito de anillo sin átomo');
        if (anillos[n]) {
          const r = anillos[n]; delete anillos[n];
          const sim = bond || r.bond; bond = null;
          unir(r.atomo, prev, sim);
        } else { anillos[n] = { atomo: prev, bond }; bond = null; }
        continue;
      }
      if (ch === '[') {
        const j = s.indexOf(']', i); if (j < 0) err('falta cerrar un corchete');
        const t = s.slice(i + 1, j);
        const m = /^(\d*)(Cl|Br|[BCNOPSFI]|[bcnops])(@@|@)?(H\d?)?([+-]+\d*|[+-]\d+)?$/.exec(t);
        if (!m) err(`no entiendo «[${t}]»`);
        let carga = 0;
        if (m[5]) { const sg = m[5][0] === '+' ? 1 : -1; const d = m[5].replace(/[+-]/g, ''); carga = sg * (d ? +d : m[5].length); }
        const arom = /^[a-z]/.test(m[2]);
        nuevo({ el: arom ? m[2].toUpperCase() : m[2], arom, carga, h: m[4] ? (m[4].length > 1 ? +m[4][1] : 1) : 0, corchete: true, quiral: m[3] || null });
        i = j + 1; continue;
      }
      let el = null;
      if (s.startsWith('Cl', i)) el = 'Cl'; else if (s.startsWith('Br', i)) el = 'Br';
      else if ('BCNOPSFI'.includes(ch)) el = ch;
      else if ('bcnops'.includes(ch)) el = ch;
      if (!el) err(`no entiendo «${ch}»`);
      i += el.length;
      const arom = /^[a-z]/.test(el);
      nuevo({ el: arom ? el.toUpperCase() : el, arom, carga: 0, h: null, corchete: false, quiral: null });
    }
    if (pila.length) err('falta cerrar un paréntesis');
    if (Object.keys(anillos).length) err('un anillo no se cierra');
    kekule(at, en, s);
    // H implícitos
    const vec = vecinos({ atomos: at, enlaces: en });
    at.forEach((a, k) => {
      const suma = vec[k].reduce((t, v) => t + v.orden, 0);
      if (a.corchete) { a.h = a.h || 0; return; }
      const v = VAL[a.el].find(x => x >= suma);
      if (v === undefined) throw new Error(`molécula: el átomo ${k} (${a.el}) tiene ${suma} enlaces: más que su valencia`);
      a.h = v - suma;
    });
    // Una sola pieza
    const vis = new Set([0]), q = [0];
    while (q.length) { const k = q.pop(); for (const v of vec[k]) if (!vis.has(v.j)) { vis.add(v.j); q.push(v.j); } }
    if (vis.size !== at.length) throw new Error('molécula: piezas sueltas');
    const m = { smiles: s, atomos: at.map(a => ({ el: a.el, h: a.h, carga: a.carga, arom: a.arom, quiral: a.quiral, corchete: a.corchete })), enlaces: en.map(e => ({ a: e.a, b: e.b, orden: e.orden, dir: e.dir })) };
    return m;
  }
  // Pasa los enlaces aromáticos a una estructura de Kekulé (pareo perfecto de los átomos que necesitan un doble).
  function kekule(at, en, s) {
    const ar = en.map((e, k) => (e.ar ? k : -1)).filter(k => k >= 0);
    if (!ar.length) return;
    const grado = at.map(() => 0), exoDoble = at.map(() => false);
    en.forEach(e => { grado[e.a]++; grado[e.b]++; if (e.orden === 2 && !e.ar) { exoDoble[e.a] = true; exoDoble[e.b] = true; } });
    const necesita = at.map((a, k) => {
      if (!a.arom) return false;
      if (exoDoble[k]) return false;
      if (a.el === 'C' || a.el === 'B') return true;
      if (a.el === 'N' || a.el === 'P') {
        if (a.corchete) return (a.h === 0 && a.carga === 0 && grado[k] === 2) || (a.carga === 1 && a.h === 0 && grado[k] === 3) || (a.carga === 1 && a.h === 1 && grado[k] === 2);
        return grado[k] === 2;
      }
      return false;   // o, s
    });
    const libre = at.map((a, k) => necesita[k]);
    const cand = k => ar.filter(j => (en[j].a === k || en[j].b === k));
    function resolver() {
      const k = libre.findIndex(x => x);
      if (k < 0) return true;
      for (const j of cand(k)) {
        const o = en[j].a === k ? en[j].b : en[j].a;
        if (!libre[o]) continue;
        en[j].orden = 2; libre[k] = libre[o] = false;
        if (resolver()) return true;
        en[j].orden = 1; libre[k] = libre[o] = true;
      }
      return false;
    }
    if (!resolver()) throw new Error(`molécula: el anillo aromático de «${s}» no tiene estructura de Kekulé`);
    en.forEach(e => { delete e.ar; });
  }
  function vecinos(m) {
    const v = m.atomos.map(() => []);
    m.enlaces.forEach((e, k) => { v[e.a].push({ j: e.b, orden: e.orden, k }); v[e.b].push({ j: e.a, orden: e.orden, k }); });
    return v;
  }
  const cache = new Map();
  function M(x) {
    if (x && typeof x === 'object' && x.atomos) return x;
    if (typeof x !== 'string') throw new Error('molécula: dame un id de la biblioteca, un SMILES o una molécula');
    if (cache.has(x)) return cache.get(x);
    const ficha = BIB && BIB.POR_ID[x];
    const m = molecula(ficha ? ficha.smiles : x);
    if (ficha) m.id = x;
    cache.set(x, m);
    return m;
  }
  // Datos por átomo que todo lo demás usa.
  function info(x) {
    const m = M(x);
    if (m._info) return m._info;
    const v = vecinos(m);
    const atom = m.atomos.map((a, i) => {
      const enl = v[i].reduce((t, z) => t + z.orden, 0);
      const pares = a.el in VE ? (VE[a.el] - a.carga - enl - a.h) / 2 : 0;
      const dobles = v[i].filter(z => z.orden === 2).length, triples = v[i].filter(z => z.orden === 3).length;
      return { i, el: a.el, h: a.h, carga: a.carga, enl, pares, dobles, triples, grado: v[i].length };
    });
    const I = { m, v, atom };
    Object.defineProperty(m, '_info', { value: I, enumerable: false, configurable: true, writable: true });
    I.anillos = sssr(I);
    marcarAromaticos(I);
    return I;
  }

  // ---------------- Fórmula ----------------
  function formula(x) {
    const m = M(x), c = {};
    for (const a of m.atomos) { c[a.el] = (c[a.el] || 0) + 1; if (a.h) c.H = (c.H || 0) + a.h; }
    const orden = Object.keys(c).sort((p, q) => (p === 'C' ? -1 : q === 'C' ? 1 : p === 'H' ? -1 : q === 'H' ? 1 : p < q ? -1 : 1));
    const texto = orden.map(e => e + (c[e] > 1 ? c[e] : '')).join('');
    const masa = Math.round(orden.reduce((t, e) => t + MASA[e] * c[e], 0) * 10) / 10;
    const carga = m.atomos.reduce((t, a) => t + a.carga, 0);
    return { texto, conteo: c, masa, carga, hidrocarburo: orden.every(e => e === 'C' || e === 'H') };
  }

  // ---------------- Anillos (SSSR) y aromaticidad ----------------
  function sssr(I) {
    const n = I.atom.length, E = I.m.enlaces, nr = E.length - n + 1;
    if (nr <= 0) return [];
    const ady = I.v;
    // Caminos más cortos desde cada átomo (BFS con padre).
    const camino = (s, t, prohibido) => {
      const pad = new Array(n).fill(-2); pad[s] = -1; const q = [s];
      while (q.length) { const u = q.shift(); if (u === t) break; for (const z of ady[u]) if (pad[z.j] === -2 && z.k !== prohibido) { pad[z.j] = u; q.push(z.j); } }
      if (pad[t] === -2) return null;
      const p = []; for (let u = t; u !== -1; u = pad[u]) p.push(u); return p.reverse();
    };
    const cands = [];
    E.forEach((e, k) => { const p = camino(e.a, e.b, k); if (p) cands.push(p); });
    // Ciclos de Horton: para cada átomo y enlace, camino(v, a) + enlace + camino(b, v) si no se cruzan.
    const dist = [];
    for (let s = 0; s < n; s++) { const d = new Array(n).fill(Infinity); d[s] = 0; const q = [s]; while (q.length) { const u = q.shift(); for (const z of ady[u]) if (d[z.j] === Infinity) { d[z.j] = d[u] + 1; q.push(z.j); } } dist.push(d); }
    for (let s = 0; s < n; s++) E.forEach(e => {
      const p1 = camino(s, e.a), p2 = camino(s, e.b);
      if (!p1 || !p2) return;
      const set1 = new Set(p1);
      if (p2.some(u => u !== s && set1.has(u))) return;
      const ciclo = p1.concat(p2.slice(1).reverse());
      if (ciclo.length >= 3) cands.push(ciclo);
    });
    const clave = c => { const ks = []; for (let t = 0; t < c.length; t++) { const a = c[t], b = c[(t + 1) % c.length]; const k = E.findIndex(e => (e.a === a && e.b === b) || (e.a === b && e.b === a)); if (k < 0) return null; ks.push(k); } return ks; };
    const vistos = new Set(), lista = [];
    for (const c of cands) {
      const ks = clave(c); if (!ks || new Set(ks).size !== ks.length || new Set(c).size !== c.length) continue;
      const id = ks.slice().sort((a, b) => a - b).join(',');
      if (vistos.has(id)) continue; vistos.add(id); lista.push({ atomos: c, ks });
    }
    lista.sort((a, b) => a.atomos.length - b.atomos.length);
    // Independencia sobre GF(2).
    const base = [], filas = [];
    for (const c of lista) {
      if (base.length === nr) break;
      let vec = new Array(E.length).fill(0); c.ks.forEach(k => { vec[k] = 1; });
      for (const f of filas) if (vec[f.piv]) vec = vec.map((x, k) => x ^ f.vec[k]);
      const piv = vec.indexOf(1);
      if (piv < 0) continue;
      filas.push({ vec, piv }); base.push(c);
    }
    return base.map(c => ({ atomos: c.atomos.slice(), enlaces: c.ks.slice(), tamano: c.atomos.length }));
  }
  function marcarAromaticos(I) {
    const R = I.anillos, E = I.m.enlaces;
    const enAnillo = R.map(r => new Set(r.atomos));
    const fusion = R.map((r, k) => R.map((q, j) => j !== k && q.atomos.some(a => enAnillo[k].has(a))));
    R.forEach((r, k) => {
      let e = 0, ok = true, conCarbonilo = false;
      for (const a of r.atomos) {
        const A = I.atom[a];
        const dob = I.v[a].filter(z => z.orden === 2);
        if (I.v[a].some(z => z.orden === 3)) { ok = false; break; }
        if (dob.length) {
          const z = dob[0];
          if (enAnillo[k].has(z.j)) { e += 1; continue; }
          if (R.some((q, j) => fusion[k][j] && enAnillo[j].has(z.j))) { e += 1; continue; }
          if (['O', 'N', 'S'].includes(I.atom[z.j].el)) { conCarbonilo = true; continue; }
          ok = false; break;
        }
        if (['N', 'O', 'S', 'P'].includes(A.el) && A.pares >= 1 && A.grado + A.h <= 3) { e += 2; continue; }
        ok = false; break;
      }
      r.electrones = ok ? e : null;
      r.huckel = ok && e % 4 === 2;
      r.aromatico = r.huckel;
      r.conCarbonilo = r.huckel && conCarbonilo;
      r.hetero = [...new Set(r.atomos.map(a => I.atom[a].el).filter(x => x !== 'C'))];
    });
    I.aromAtom = I.atom.map((a, i) => R.some(r => r.aromatico && r.atomos.includes(i)));
  }
  function anillos(x) {
    const I = info(x), R = I.anillos;
    const lista = R.map(r => ({ atomos: r.atomos.slice(), tamano: r.tamano, huckel: r.huckel, electrones: r.electrones, aromatico: r.aromatico, conCarbonilo: r.conCarbonilo, hetero: r.hetero.slice() }));
    const aromaticos = lista.filter(r => r.aromatico).length;
    const conDoble = R.filter(r => r.enlaces.some(k => I.m.enlaces[k].orden === 2)).length;   // un doble DENTRO del anillo
    return { lista, total: lista.length, aromaticos, atomos: [...new Set(lista.filter(r => r.aromatico).flatMap(r => r.atomos))].sort((a, b) => a - b),
      errores: { todoAnillo: lista.length, seisLados: lista.filter(r => r.tamano === 6).length, conDoble, sinCarbonilo: lista.filter(r => r.aromatico && !r.conCarbonilo).length } };
  }

  // ---------------- Hibridación ----------------
  function hibridacion(x) {
    const I = info(x);
    const porAtomo = I.atom.map((A, i) => {
      if (A.el === 'C') return A.triples || A.dobles >= 2 ? 'sp' : A.dobles === 1 ? 'sp2' : 'sp3';
      if (I.aromAtom[i] && A.dobles === 0 && A.pares >= 1) return 'sp2';
      const d = A.grado + A.h + A.pares;
      return ({ 2: 'sp', 3: 'sp2', 4: 'sp3', 5: 'sp3d', 6: 'sp3d2' })[d] || null;
    });
    const carbonos = { sp: [], sp2: [], sp3: [] };
    porAtomo.forEach((h, i) => { if (I.atom[i].el === 'C') carbonos[h].push(i); });
    return { porAtomo, carbonos, cuenta: { sp: carbonos.sp.length, sp2: carbonos.sp2.length, sp3: carbonos.sp3.length } };
  }
  function lupa(x, tipo) {
    const I = info(x), H = hibridacion(x), C = I.atom.filter(a => a.el === 'C');
    const cO = i => I.v[i].some(z => z.orden === 2 && I.atom[z.j].el !== 'C');   // C de un C=O o C=N
    if (tipo === 'sp2') {
      const at = H.carbonos.sp2;
      const dobles = I.m.enlaces.filter(e => e.orden === 2).length;
      const sp2Todos = H.porAtomo.filter((h, i) => h === 'sp2').length;
      return { valor: at.length, atomos: at, errores: {
        sinCarbonilo: at.filter(i => !cO(i)).length,            // olvida el C del C=O (carboxilo, carbonilo)
        comoDobles: dobles,                                     // cuenta dobles enlaces en vez de carbonos
        todosLosC: C.length,                                    // todos los carbonos
        conHeteroatomos: sp2Todos } };                          // suma los O y N sp2
    }
    if (tipo === 'sp3') {
      const at = H.carbonos.sp3;
      return { valor: at.length, atomos: at, errores: {
        sinMetilos: at.filter(i => I.atom[i].h !== 3).length,   // olvida los CH3 de las puntas
        conHeteroatomos: H.porAtomo.filter(h => h === 'sp3').length,
        soloCadena: at.filter(i => !I.anillos.some(r => r.atomos.includes(i))).length,   // olvida los del anillo
        todosLosC: C.length } };
    }
    if (tipo === 'sp') {
      const at = H.carbonos.sp;
      const triples = I.m.enlaces.filter(e => e.orden === 3).length;
      return { valor: at.length, atomos: at, errores: { comoTriples: triples, unoPorTriple: triples, comoSp2: H.carbonos.sp2.length, todosLosC: C.length } };
    }
    throw new Error(`lupa: no conozco «${tipo}»`);
  }

  // ---------------- Enlaces ----------------
  function polaridad(a, b) { return r2(Math.abs(EN[a] - EN[b])) >= 0.4; }
  function enlaces(x) {
    const I = info(x), E = I.m.enlaces;
    let sigma = 0, pi = 0, dobles = 0, triples = 0, pol = 0, apol = 0, cPol = 0, cApol = 0, chs = 0, piAnillo = 0;
    const enlacesPi = [], polaresK = [], polaresH = [];
    const enAnillo = k => I.anillos.some(r => r.enlaces.includes(k));
    E.forEach((e, k) => {
      sigma++; pi += e.orden - 1;
      if (e.orden === 2) dobles++; if (e.orden === 3) triples++;
      if (e.orden > 1) { enlacesPi.push(k); if (enAnillo(k)) piAnillo += e.orden - 1; }
      const p = polaridad(I.atom[e.a].el, I.atom[e.b].el);
      if (p) { pol += e.orden; cPol++; polaresK.push(k); } else { apol += e.orden; cApol++; }
    });
    I.atom.forEach((A, i) => {
      if (!A.h) return;
      sigma += A.h;
      if (polaridad(A.el, 'H')) { pol += A.h; cPol += A.h; polaresH.push(i); } else { apol += A.h; cApol += A.h; if (A.el === 'C') chs += A.h; }
    });
    const piCO = E.filter(e => e.orden > 1 && (I.atom[e.a].el !== 'C' || I.atom[e.b].el !== 'C')).reduce((t, e) => t + e.orden - 1, 0);
    const paresHetero = I.atom.filter(a => a.el !== 'C' && a.el !== 'H').reduce((t, a) => t + a.pares, 0);
    return { sigma, pi, dobles, triples, electronesPi: 2 * pi, polares: pol, apolares: apol, conexionesPolares: cPol, conexionesApolares: cApol,
      enlacesPi, enlacesPolares: polaresK, hPolares: polaresH, total: sigma + pi,
      errores: {
        pi: { comoElectrones: 2 * pi, soloCC: pi - piCO, sinAnillos: pi - piAnillo, comoSigma: sigma },
        electronesPi: { comoEnlaces: pi, cuatroPorDoble: 4 * dobles + 6 * triples, sinAnillos: 2 * (pi - piAnillo), conPares: 2 * pi + 2 * paresHetero },
        polares: { conCH: pol + chs, dobleComoUno: cPol, sinOH: pol - I.atom.filter((a, i) => polaresH.includes(i)).reduce((t, a) => t + a.h, 0), todos: pol + apol } } };
  }

  // ---------------- Pares libres y octeto ----------------
  function pares(x) {
    const I = info(x), porElemento = {};
    const porAtomo = I.atom.map(a => a.pares);
    I.atom.forEach(a => { porElemento[a.el] = (porElemento[a.el] || 0) + a.pares; });
    const total = porAtomo.reduce((t, p) => t + p, 0);
    const de = el => porElemento[el] || 0;
    const halo = Object.keys(porElemento).filter(e => HALO.has(e)).reduce((t, e) => t + porElemento[e], 0);
    const conPares = I.atom.filter(a => a.pares > 0).length;
    return { total, porElemento, porAtomo, atomos: porAtomo.map((p, i) => (p ? i : -1)).filter(i => i >= 0),
      errores: { sinO: total - de('O'), sinHalogenos: total - halo, sinN: total - de('N'), comoElectrones: 2 * total, unoPorAtomo: conPares, sinS: total - de('S') } };
  }
  function octeto(x) {
    const I = info(x);
    const atomos = I.atom.map(A => {
      const e = 2 * (A.enl + A.h) + 2 * A.pares;
      return { i: A.i, el: A.el, electrones: e, estado: e === 8 ? 'cumple' : e > 8 ? 'expandido' : 'incompleto' };
    });
    const noCumplen = atomos.filter(a => a.estado !== 'cumple').map(a => a.i);
    const tercer = atomos.filter(a => ['P', 'S', 'Cl', 'Br', 'I'].includes(a.el)).map(a => a.i);
    const nH = I.atom.reduce((t, a) => t + a.h, 0);
    // Errores (cuántos átomos «no cumplen»): EN3, el octeto como ley (los del tercer período también cumplen); contar
    // cada enlace doble o triple como un solo par (así todo átomo con un doble parece quedar corto); dar por expandido
    // a todo átomo del tercer período.
    const dobleComoUno = I.atom.filter(A => 2 * (A.grado + A.h) + 2 * A.pares !== 8).length;
    return { atomos, noCumplen, valor: noCumplen.length, todosCumplen: noCumplen.length === 0, hidrogenos: nH,
      errores: { tercerPeriodoCumple: noCumplen.filter(i => !tercer.includes(i)).length, dobleComoUno,
        todoTercerPeriodo: new Set([...noCumplen, ...tercer]).size } };
  }

  // ---------------- Grupos funcionales ----------------
  const NOMBRES = {
    acido: 'ácido carboxílico', carboxilato: 'carboxilato', ester: 'éster', lactona: 'lactona', amida: 'amida', lactama: 'lactama',
    urea: 'urea', nitrilo: 'nitrilo', aldehido: 'aldehído', cetona: 'cetona', alcohol: 'alcohol', fenol: 'fenol', enol: 'enol',
    hemiacetal: 'hemiacetal', acetal: 'acetal', tiol: 'tiol', amina: 'amina', amonio: 'amonio', imina: 'imina', eter: 'éter',
    sulfuro: 'sulfuro', disulfuro: 'disulfuro', sulfoxido: 'sulfóxido', tiosulfinato: 'tiosulfinato', halogenuro: 'halogenuro',
    alquino: 'alquino', alqueno: 'alqueno', aromatico: 'anillo aromático', heterociclo: 'heterociclo aromático',
  };
  const PRIORIDAD = ['acido', 'carboxilato', 'ester', 'lactona', 'amida', 'lactama', 'urea', 'nitrilo', 'aldehido', 'cetona',
    'alcohol', 'fenol', 'enol', 'hemiacetal', 'tiol', 'amina', 'amonio', 'imina'];
  const SIN_SUFIJO = ['eter', 'acetal', 'sulfuro', 'disulfuro', 'tiosulfinato', 'sulfoxido', 'halogenuro', 'alquino', 'alqueno', 'aromatico', 'heterociclo'];
  // Familias para la función principal: alcohol, fenol, enol y hemiacetal dan el mismo sufijo (-ol).
  const FAMILIA = { carboxilato: 'acido', lactona: 'ester', lactama: 'amida', urea: 'amida', fenol: 'alcohol', enol: 'alcohol', hemiacetal: 'alcohol', amonio: 'amina' };
  function grupos(x) {
    const I = info(x), A = I.atom, V = I.v, lista = [], usado = new Set();
    const el = i => A[i].el;
    const ring = (a, b) => I.anillos.some(r => r.atomos.includes(a) && r.atomos.includes(b));
    const dobleA = (i, e) => V[i].find(z => z.orden === 2 && el(z.j) === e);
    const add = (tipo, atomos, extra) => { lista.push(Object.assign({ tipo, nombre: NOMBRES[tipo], atomos: atomos.slice().sort((p, q) => p - q) }, extra || {})); atomos.forEach(a => usado.add(a)); };
    const carbonilos = A.filter(a => a.el === 'C' && dobleA(a.i, 'O')).map(a => a.i);
    // Ácidos, carboxilatos, ésteres, amidas
    for (const c of carbonilos) {
      const oD = dobleA(c, 'O').j;
      const oS = V[c].filter(z => z.orden === 1 && el(z.j) === 'O').map(z => z.j);
      const nS = V[c].filter(z => z.orden === 1 && el(z.j) === 'N').map(z => z.j);
      const oh = oS.find(o => A[o].h === 1), om = oS.find(o => A[o].carga === -1), oc = oS.find(o => A[o].h === 0 && A[o].carga === 0 && V[o].length === 2);
      if (oh !== undefined) add('acido', [c, oD, oh]);
      else if (om !== undefined) add('carboxilato', [c, oD, om]);
      else if (oc !== undefined) { const r = V[oc].find(z => z.j !== c).j; add(ring(c, oc) ? 'lactona' : 'ester', [c, oD, oc]); void r; }
      else if (nS.length >= 2) add('urea', [c, oD, ...nS]);
      else if (nS.length === 1) add(ring(c, nS[0]) ? 'lactama' : 'amida', [c, oD, nS[0]]);
      else if (A[c].h >= 1) add('aldehido', [c, oD]);
      else if (V[c].filter(z => el(z.j) === 'C').length === 2) add('cetona', [c, oD]);
    }
    // OH y O–C (los O de ácidos, ésteres y amidas ya están tomados)
    const enCarbonilo = new Set(lista.flatMap(g => g.atomos));
    const sp3C = i => el(i) === 'C' && A[i].dobles === 0 && A[i].triples === 0;
    for (const a of A) {
      if (a.el !== 'C' || !sp3C(a.i)) continue;
      const os = V[a.i].filter(z => z.orden === 1 && el(z.j) === 'O' && !enCarbonilo.has(z.j)).map(z => z.j);
      const ohs = os.filter(o => A[o].h === 1), ocs = os.filter(o => A[o].h === 0 && V[o].length === 2 && V[o].every(z => el(z.j) === 'C' && !carbonilos.includes(z.j)));
      if (ohs.length === 1 && ocs.length >= 1) add('hemiacetal', [a.i, ohs[0], ocs[0]]);
      else if (ohs.length === 0 && ocs.length >= 2) add('acetal', [a.i, ocs[0], ocs[1]]);
    }
    for (const o of A) {
      if (o.el !== 'O' || usado.has(o.i) || o.h !== 1) continue;
      const c = V[o.i][0].j;
      if (el(c) !== 'C') continue;
      if (I.aromAtom[c]) add('fenol', [c, o.i]);
      else if (A[c].dobles === 1 && dobleA(c, 'C')) add('enol', [c, o.i]);
      else if (sp3C(c)) { const n = V[c].filter(z => el(z.j) === 'C').length; add('alcohol', [c, o.i], { clase: n === 3 ? 'terciario' : n === 2 ? 'secundario' : 'primario' }); }
    }
    for (const o of A) {
      if (o.el !== 'O' || usado.has(o.i) || o.h !== 0 || o.carga !== 0 || V[o.i].length !== 2) continue;
      if (V[o.i].every(z => el(z.j) === 'C' && z.orden === 1)) add('eter', [V[o.i][0].j, o.i, V[o.i][1].j]);
    }
    // Nitrógeno
    for (const n of A) {
      if (n.el !== 'N' || usado.has(n.i)) continue;
      if (I.aromAtom[n.i]) continue;
      const tri = V[n.i].find(z => z.orden === 3 && el(z.j) === 'C');
      if (tri) { add('nitrilo', [tri.j, n.i]); continue; }
      const dob = V[n.i].find(z => z.orden === 2 && el(z.j) === 'C');
      if (dob) { add('imina', [dob.j, n.i]); continue; }
      const cs = V[n.i].filter(z => el(z.j) === 'C').length;
      if (n.carga === 1 && n.h >= 1) { add('amonio', [n.i], { clase: cs === 1 ? 'primario' : cs === 2 ? 'secundario' : 'terciario' }); continue; }
      if (n.carga === 0) add('amina', [n.i], { clase: cs === 1 ? 'primaria' : cs === 2 ? 'secundaria' : 'terciaria' });
    }
    // Azufre
    for (const s of A) {
      if (s.el !== 'S' || usado.has(s.i)) continue;
      const oD = dobleA(s.i, 'O');
      const ss = V[s.i].find(z => el(z.j) === 'S');
      if (oD) { if (ss) add('tiosulfinato', [s.i, oD.j, ss.j]); else add('sulfoxido', [s.i, oD.j]); continue; }
      if (s.h === 1) { add('tiol', [s.i]); continue; }
      if (ss && !usado.has(ss.j)) { add('disulfuro', [s.i, ss.j]); continue; }
      if (V[s.i].length === 2 && V[s.i].every(z => el(z.j) === 'C')) add('sulfuro', [s.i]);
    }
    for (const a of A) if (HALO.has(a.el)) { const c = V[a.i][0]; if (c && el(c.j) === 'C') add('halogenuro', [c.j, a.i], { clase: a.el }); }
    // Enlaces múltiples C–C fuera de anillos aromáticos
    const enol = new Set(lista.filter(g => g.tipo === 'enol').map(g => g.atomos.find(i => el(i) === 'C')));
    I.m.enlaces.forEach(e => {
      if (el(e.a) !== 'C' || el(e.b) !== 'C' || e.orden === 1) return;
      if (e.orden === 3) { add('alquino', [e.a, e.b]); return; }
      if (I.aromAtom[e.a] && I.aromAtom[e.b] && I.anillos.some(r => r.aromatico && r.atomos.includes(e.a) && r.atomos.includes(e.b))) return;
      if (enol.has(e.a) || enol.has(e.b)) return;
      add('alqueno', [e.a, e.b]);
    });
    for (const r of I.anillos) if (r.aromatico) {
      const het = r.hetero;
      if (!het.length) add('aromatico', r.atomos);
      else add('heterociclo', r.atomos, { clase: het.includes('N') ? 'nitrogenado' : het.includes('O') ? 'oxigenado' : 'azufrado' });
    }
    const cuenta = {};
    lista.forEach(g => { cuenta[g.tipo] = (cuenta[g.tipo] || 0) + 1; });
    // Función principal
    const tipos = [...new Set(lista.map(g => g.tipo))];
    const conSufijo = tipos.filter(t => PRIORIDAD.includes(t)).sort((p, q) => PRIORIDAD.indexOf(p) - PRIORIDAD.indexOf(q));
    const sinSufijo = tipos.filter(t => SIN_SUFIJO.includes(t)).sort((p, q) => SIN_SUFIJO.indexOf(p) - SIN_SUFIJO.indexOf(q));
    const pTipo = conSufijo[0] || sinSufijo[0] || null;
    const fam = t => FAMILIA[t] || t;
    const secundaria = conSufijo.find(t => fam(t) !== fam(pTipo)) || null;
    const principal = pTipo ? { tipo: pTipo, familia: fam(pTipo), nombre: NOMBRES[pTipo] } : null;
    const tiene = t => tipos.includes(t);
    const clases = t => { const c = {}; lista.filter(g => g.tipo === t).forEach(g => { c[g.clase] = (c[g.clase] || 0) + 1; }); return c; };
    return { lista, cuenta, tipos, principal, alcoholes: clases('alcohol'), aminas: clases('amina'),
      errores: {
        porSecundaria: secundaria ? NOMBRES[secundaria] : null,                                  // FO4: toma la función que no manda
        carboxiloComoCetonaAlcohol: tiene('acido') ? 'cetona y alcohol' : null,                  // AQ-carboxilo-cetona-alcohol
        fenolComoAlcohol: tiene('fenol') ? 'alcohol' : null,                                    // AQ-fenol-alcohol
        esterComoEter: tiene('ester') || tiene('lactona') ? 'éter' : null,                      // AQ-ester-eter
        lactonaComoLactama: tiene('lactona') ? 'lactama' : tiene('lactama') ? 'lactona' : null, // AQ-lactona-lactama
        aromaticoPrimero: (tiene('aromatico') || tiene('heterociclo')) && pTipo !== 'aromatico' ? 'anillo aromático' : null,
      } };
  }

  // ---------------- Carbonos quirales ----------------
  function quirales(x) {
    const I = info(x), A = I.atom, V = I.v, n = A.length;
    const ids = new Map(), memo = new Map();
    const intern = s => { if (!ids.has(s)) ids.set(s, ids.size); return ids.get(s); };
    const et = i => `${A[i].el}${A[i].carga}h${A[i].h}`;
    function h(a, p, d) {
      const k = a + ',' + p + ',' + d;
      if (memo.has(k)) return memo.get(k);
      let r;
      if (d === 0) r = intern(et(a));
      else r = intern(et(a) + '(' + V[a].filter(z => z.j !== p).map(z => z.orden + ':' + h(z.j, a, d - 1)).sort().join(',') + ')');
      memo.set(k, r); return r;
    }
    const D = Math.min(n, 60);
    const H = hibridacion(x);
    const sus = i => [...V[i].map(z => 'x' + z.orden + ':' + h(z.j, i, D)), ...Array(A[i].h).fill('H')];
    const sus1 = i => [...V[i].map(z => A[z.j].el), ...Array(A[i].h).fill('H')];
    const at = [], conHet = [], dosIguales = [], soloVecinos = [];
    A.forEach((a, i) => {
      if (a.el !== 'C' || H.porAtomo[i] !== 'sp3') return;
      const s = sus(i), d = new Set(s).size;
      if (d === 4 && s.length === 4) at.push(i);
      if (d >= 3 && a.h <= 1) dosIguales.push(i);
      if (V[i].some(z => A[z.j].el !== 'C')) conHet.push(i);
      if (new Set(sus1(i)).size === 4) soloVecinos.push(i);
    });
    return { valor: at.length, atomos: at, errores: { conHeteroatomo: conHet.length, dosIguales: dosIguales.length, soloVecinos: soloVecinos.length,
      unoPorCH: A.filter((a, i) => a.el === 'C' && H.porAtomo[i] === 'sp3' && a.h === 1).length, todosLosC: A.filter(a => a.el === 'C').length } };
  }

  // ---------------- Metilos (sustituyentes CH₃) ----------------
  // Un metilo es un CH₃ unido por un solo enlace a un carbono (queda fuera el CH₃ de un éter, un éster o una amina).
  // Se cuenta cada CH₃ como un grupo; no es un «etilo» (CH₃–CH₂–), que tiene dos carbonos.
  function metilos(x) {
    const I = info(x), H = hibridacion(x);
    const enAnillo = i => I.anillos.some(r => r.atomos.includes(i));
    const at = I.atom.filter(a => a.el === 'C' && a.h === 3 && I.v[a.i].length === 1 && I.atom[I.v[a.i][0].j].el === 'C').map(a => a.i);
    return { valor: at.length, atomos: at,
      enAnillo: at.filter(i => enAnillo(I.v[i][0].j)).length, enCadena: at.filter(i => !enAnillo(I.v[i][0].j)).length,
      errores: {
        soloCadena: at.filter(i => !enAnillo(I.v[i][0].j)).length,    // solo los de la cadena larga
        soloAnillos: at.filter(i => enAnillo(I.v[i][0].j)).length,    // solo los de los anillos
        todosLosSp3: H.carbonos.sp3.length,                           // todos los carbonos sp³ (con los CH₂ y los cuaternarios)
        puntasConDoble: at.filter(i => I.atom[I.v[i][0].j].dobles > 0).length } };   // solo los CH₃ pegados a un C=C
  }

  // ---------------- Número de oxidación ----------------
  function numeroOxidacion(x, i) {
    const I = info(x), A = I.atom[i];
    if (!A) throw new Error(`numeroOxidacion: no hay átomo ${i}`);
    let base = 0, soloMas = 0;
    for (const z of I.v[i]) { const o = I.atom[z.j].el; if (o === A.el) continue; const s = EN[o] > EN[A.el] ? 1 : -1; base += s * z.orden; if (s > 0) soloMas += z.orden; }
    const sH = EN.H > EN[A.el] ? 1 : -1;
    base += sH * A.h; if (sH > 0) soloMas += A.h;
    return { valor: base + A.carga, errores: { ignoraH: soloMas + A.carga, signoAlReves: -base + A.carga } };
  }

  // ---------------- Cambios: hidrogenar, ionizar ----------------
  function aSmiles(m) {
    // Escribe la molécula como SMILES en el MISMO orden de átomos (para que el dibujo y los índices sigan valiendo):
    // recorrido en profundidad desde el 0, con dígitos de anillo para los enlaces que vuelven.
    const V = vecinos(m), n = m.atomos.length, visto = new Array(n).fill(false), arbol = new Set();
    const orden = [];
    (function dfs(u) { visto[u] = true; orden.push(u); for (const z of V[u].slice().sort((p, q) => p.j - q.j)) if (!visto[z.j]) { arbol.add(z.k); dfs(z.j); } })(0);
    if (orden.some((u, k) => u !== k)) return null;   // el orden cambiaría: no se puede escribir igual
    const cierres = m.enlaces.map((e, k) => k).filter(k => !arbol.has(k));
    const dig = {}; let sig = 1;
    cierres.forEach(k => { dig[k] = sig++; });
    const sb = o => (o === 2 ? '=' : o === 3 ? '#' : '');
    // Sin @ ni @@ (el motor no los usa) y con corchete solo si la carga o los H no son los de la valencia normal.
    const atomo = (a, k) => {
      const s = V[k].reduce((t, z) => t + z.orden, 0), v = VAL[a.el] && VAL[a.el].find(q => q >= s);
      if (!a.carga && v !== undefined && v - s === a.h) return a.el;
      return '[' + a.el + (a.h ? 'H' + (a.h > 1 ? a.h : '') : '') + (a.carga ? (a.carga > 0 ? '+' : '-') + (Math.abs(a.carga) > 1 ? Math.abs(a.carga) : '') : '') + ']';
    };
    let out = '';
    (function esc(u, p) {
      out += atomo(m.atomos[u], u);
      for (const k of cierres) { const e = m.enlaces[k]; if (e.a === u || e.b === u) { out += (e.a === u ? sb(e.orden) : '') + (dig[k] > 9 ? '%' + dig[k] : dig[k]); } }
      const hijos = V[u].filter(z => arbol.has(z.k) && z.j !== p && z.j > u).sort((p2, q) => p2.j - q.j);
      hijos.forEach((z, t) => { const s = sb(z.orden) + ''; if (t < hijos.length - 1) { out += '(' + s; esc(z.j, u); out += ')'; } else { out += s; esc(z.j, u); } });
    })(0, -1);
    return out;
  }
  function copiar(m) { return { smiles: m.smiles, atomos: m.atomos.map(a => ({ ...a })), enlaces: m.enlaces.map(e => ({ ...e })), id: m.id }; }
  function rehacerH(m) {
    const V = vecinos(m);
    m.atomos.forEach((a, k) => {
      if (a.corchete) return;
      const s = V[k].reduce((t, z) => t + z.orden, 0), v = VAL[a.el].find(q => q >= s);
      if (v === undefined) throw new Error(`el átomo ${k} queda con ${s} enlaces`);
      a.h = v - s;
    });
    delete m._info;
    const s = aSmiles(m); m.smiles = s || m.smiles + ' (cambiada)';
    return m;
  }
  function hidrogenar(x, k) {
    const m0 = M(x), e = m0.enlaces[k];
    if (!e) throw new Error(`hidrogenar: no hay enlace ${k}`);
    if (e.orden < 2) throw new Error(`hidrogenar: el enlace ${k} es simple`);
    const m = copiar(m0); m.enlaces[k].orden -= 1; m.enlaces[k].dir = null; delete m.id;
    return rehacerH(m);
  }
  function ionizar(x, pH) {
    const id = typeof x === 'string' ? x : x.id;
    const ficha = BIB && BIB.POR_ID[id];
    if (!ficha || !ficha.pka) throw new Error(`ionizar: «${id}» no tiene pKa en la ficha`);
    const m0 = M(id), G = grupos(id);
    const m = copiar(m0); delete m.id;
    const cargas = [];
    const pone = (i, carga, dh) => { const a = m.atomos[i]; a.corchete = true; a.carga = carga; a.h = Math.max(0, a.h + dh); cargas.push({ i, carga }); };
    const ac = G.lista.find(g => g.tipo === 'acido'), am = G.lista.find(g => g.tipo === 'amina' && g.clase === 'primaria'), fe = G.lista.find(g => g.tipo === 'fenol');
    const pk = ficha.pka;
    const estado = {};
    if (ac && pk.carboxilo !== undefined) { estado.carboxilo = pH > pk.carboxilo ? 'COO⁻' : 'COOH'; if (pH > pk.carboxilo) pone(ac.atomos.find(i => m0.atomos[i].el === 'O' && m0.atomos[i].h === 1), -1, -1); }
    if (am && pk.amino !== undefined) { estado.amino = pH < pk.amino ? 'NH₃⁺' : 'NH₂'; if (pH < pk.amino) pone(am.atomos[0], 1, +1); }
    if (fe && pk.fenol !== undefined) { estado.fenol = pH > pk.fenol ? 'O⁻' : 'OH'; if (pH > pk.fenol) pone(fe.atomos.find(i => m0.atomos[i].el === 'O'), -1, -1); }
    delete m._info;
    m.smiles = aSmiles(m) || m.smiles;
    const pos = cargas.filter(c => c.carga > 0).length, neg = cargas.filter(c => c.carga < 0).length, carga = pos - neg;
    const forma = pos && neg ? 'zwitterión' : pos ? 'catión' : neg ? 'anión' : 'neutra';
    // Errores: todo desprotonado (carga −1 por cada grupo ácido, el amino como NH₂), todo protonado, sin cargas.
    const nAc = (ac && pk.carboxilo !== undefined ? 1 : 0) + (fe && pk.fenol !== undefined ? 1 : 0);
    return { smiles: m.smiles, molecula: m, carga, forma, cargas, estado, errores: { todoDesprotonado: -nAc, todoProtonado: am ? 1 : 0, sinCargas: 0 } };
  }

  // ---------------- Opciones para Explorar ----------------
  const ERRORES = {
    // lupa: [clave del error, código, respaldo, explicación]
    sp2: [['sinCarbonilo', 'EN12-sp2-sin-carbonilo', 'parcial', 'Olvidaste el carbono del C=O (del carboxilo, del aldehído o de la cetona): con su doble enlace al O también es sp².'],
      ['comoDobles', 'AQ-sp2-igual-dobles', 'hipotesis', 'Contaste dobles enlaces, no carbonos: cada C=C tiene dos carbonos sp², y un C=O tiene uno.'],
      ['todosLosC', 'AQ-sp2-todos-los-C', 'hipotesis', 'Contaste todos los carbonos: los que solo tienen enlaces simples son sp³.'],
      ['conHeteroatomos', 'AQ-sp2-cuenta-O-N', 'hipotesis', 'Sumaste átomos que no son carbonos: la lupa cuenta solo carbonos sp².']],
    sp3: [['sinMetilos', 'AQ-sp3-olvida-metilos', 'hipotesis', 'Olvidaste los CH₃ de las puntas y de las ramas: con cuatro enlaces simples también son sp³.'],
      ['soloCadena', 'AQ-sp3-olvida-anillo', 'hipotesis', 'Olvidaste los carbonos sp³ que están en los anillos.'],
      ['conHeteroatomos', 'AQ-sp3-cuenta-O-N', 'hipotesis', 'Sumaste los O y N con cuatro dominios: la lupa cuenta solo carbonos.'],
      ['todosLosC', 'AQ-sp3-todos-los-C', 'hipotesis', 'Contaste todos los carbonos: los que tienen un doble enlace son sp².']],
    sp: [['comoSp2', 'EN12-sp-con-doble', 'parcial', 'Contaste los carbonos con un doble enlace: esos son sp². Es sp el carbono con un triple (o con dos dobles).'],
      ['todosLosC', 'AQ-sp-todos-los-C', 'hipotesis', 'Contaste todos los carbonos.']],
    pi: [['comoElectrones', 'AQ-pi-electrones-por-enlaces', 'hipotesis', 'Esos son los electrones π: cada enlace π tiene 2 electrones.'],
      ['soloCC', 'AQ-pi-olvida-CO', 'hipotesis', 'Olvidaste los enlaces π de los C=O (o C=N): también son dobles.'],
      ['sinAnillos', 'AQ-pi-olvida-anillos', 'hipotesis', 'Olvidaste los dobles enlaces que están dentro de los anillos.'],
      ['comoSigma', 'AQ-pi-cuenta-sigma', 'hipotesis', 'Esos son los enlaces σ: hay uno en cada par de átomos unidos, con los C–H.']],
    epi: [['comoEnlaces', 'AQ-pi-enlaces-por-electrones', 'hipotesis', 'Contaste enlaces π, no electrones: cada enlace π tiene 2 electrones.'],
      ['cuatroPorDoble', 'AQ-pi-cuatro-por-doble', 'hipotesis', 'Contaste los 4 electrones de cada doble enlace: 2 son del σ y solo 2 son π.'],
      ['sinAnillos', 'AQ-pi-olvida-anillos', 'hipotesis', 'Olvidaste los dobles enlaces de los anillos.'],
      ['conPares', 'AQ-pi-suma-pares', 'hipotesis', 'Sumaste los pares libres: no son electrones π de enlace.']],
    pares: [['sinO', 'AQ-pares-olvida-O', 'hipotesis', 'Olvidaste los pares libres de los oxígenos: cada O tiene 2 (el O⁻, 3).'],
      ['sinHalogenos', 'AQ-pares-olvida-halogeno', 'hipotesis', 'Olvidaste los pares de los halógenos: cada uno, con un solo enlace, tiene 3.'],
      ['sinN', 'AQ-pares-olvida-N', 'hipotesis', 'Olvidaste el par libre del nitrógeno (el NH₃⁺ ya no lo tiene).'],
      ['sinS', 'AQ-pares-olvida-S', 'hipotesis', 'Olvidaste los pares libres del azufre.'],
      ['comoElectrones', 'AQ-pares-cuenta-electrones', 'hipotesis', 'Contaste electrones, no pares: cada par son 2 electrones.'],
      ['unoPorAtomo', 'AQ-pares-uno-por-atomo', 'hipotesis', 'Pusiste un solo par por átomo: el O tiene 2 y los halógenos 3.']],
    octeto: [['tercerPeriodoCumple', 'EN3-octeto-ley', 'parcial', 'Diste por hecho que todo átomo cumple el octeto. El S unido a un O con doble enlace y a otros dos átomos queda con 10 electrones: octeto expandido, posible desde el tercer período.'],
      ['todoTercerPeriodo', 'AQ-octeto-todo-tercer-periodo', 'hipotesis', 'No todo átomo del tercer período expande su octeto: un S con dos enlaces simples y dos pares libres tiene 8.'],
      ['dobleComoUno', 'AQ-octeto-doble-un-par', 'hipotesis', 'Contaste cada doble enlace como un solo par: un C=C o un C=O son dos pares compartidos, 4 electrones.']],
    quirales: [['soloVecinos', 'AQ-quiral-solo-vecinos', 'hipotesis', 'Comparaste solo los átomos pegados al carbono: dos sustituyentes que empiezan con C pueden ser grupos distintos. Hay que mirar el grupo entero.'],
      ['dosIguales', 'AQ-quiral-dos-iguales', 'hipotesis', 'Contaste carbonos que tienen dos grupos iguales: para ser quiral, los cuatro tienen que ser distintos.'],
      ['conHeteroatomo', 'AQ-quiral-todo-C-con-O', 'hipotesis', 'Contaste los carbonos unidos a un O o un N: eso no basta, hacen falta cuatro grupos distintos.'],
      ['todosLosC', 'AQ-quiral-todos-los-C', 'hipotesis', 'Contaste todos los carbonos: un C con un doble enlace o con dos H no puede tener cuatro grupos distintos.'],
      ['unoPorCH', 'AQ-quiral-todo-CH', 'hipotesis', 'Contaste cada CH de la molécula sin mirar sus grupos.']],
    aromaticos: [['todoAnillo', 'AQ-aromatico-todo-anillo', 'hipotesis', 'Contaste todos los anillos: para ser aromático, el anillo no puede tener carbonos sp³ y su nube π debe tener 4n + 2 electrones.'],
      ['conDoble', 'AQ-aromatico-un-doble', 'hipotesis', 'Contaste anillos que tienen un doble enlace dentro: con un carbono sp³ en el anillo, la nube π se corta.'],
      ['seisLados', 'AQ-aromatico-seis-lados', 'hipotesis', 'Contaste los anillos de seis lados: el tamaño no basta.'],
      ['sinCarbonilo', 'AQ-aromatico-sin-carbonilo', 'hipotesis', 'Dejaste fuera el anillo con C=O. Aquí, como en RDKit, se cuenta (su C=O pone 0 electrones); algunos libros no lo cuentan.']],
    metilos: [['soloCadena', 'AQ-metilos-solo-cadena', 'hipotesis', 'Contaste solo los CH₃ de la cadena larga: los CH₃ que están pegados a los anillos también son metilos.'],
      ['soloAnillos', 'AQ-metilos-solo-anillos', 'hipotesis', 'Contaste solo los CH₃ de los anillos: los de la cadena también cuentan.'],
      ['puntasConDoble', 'AQ-metilos-solo-doble', 'hipotesis', 'Contaste solo los CH₃ pegados a un C=C: un CH₃ unido a un carbono con enlaces simples también es un metilo.'],
      ['todosLosSp3', 'AQ-metilos-todos-sp3', 'hipotesis', 'Contaste todos los carbonos sp³: un CH₂ o un carbono sin H no es un metilo. Metilo es solo el CH₃.']],
    polares: [['conCH', 'AQ-polar-cuenta-CH', 'hipotesis', 'Contaste los C–H como polares: su diferencia de electronegatividad es 0,35, menos de 0,4.'],
      ['dobleComoUno', 'AQ-polar-doble-uno', 'hipotesis', 'Contaste cada doble enlace polar (C=O) como uno solo: son dos enlaces, un σ y un π.'],
      ['sinOH', 'AQ-polar-olvida-OH', 'hipotesis', 'Olvidaste los O–H y N–H: son de los más polares.'],
      ['todos', 'AQ-polar-todos', 'hipotesis', 'Contaste todos los enlaces: los C–C, C–H, C–S y C–I son apolares con el corte de 0,4.']],
  };
  function conteo(x, tipo) {
    if (tipo === 'sp2' || tipo === 'sp3' || tipo === 'sp') return lupa(x, tipo);
    if (tipo === 'pi') { const e = enlaces(x); return { valor: e.pi, enlaces: e.enlacesPi, errores: e.errores.pi }; }
    if (tipo === 'epi') { const e = enlaces(x); return { valor: e.electronesPi, enlaces: e.enlacesPi, errores: e.errores.electronesPi }; }
    if (tipo === 'pares') { const p = pares(x); return { valor: p.total, atomos: p.atomos, porAtomo: p.porAtomo, errores: p.errores }; }
    if (tipo === 'quirales') return quirales(x);
    if (tipo === 'aromaticos') { const a = anillos(x); return { valor: a.aromaticos, atomos: a.atomos, anillos: a.lista.filter(r => r.aromatico), errores: a.errores }; }
    if (tipo === 'polares') { const e = enlaces(x); return { valor: e.polares, enlaces: e.enlacesPolares, hPolares: e.hPolares, errores: e.errores.polares }; }
    if (tipo === 'metilos') return metilos(x);
    if (tipo === 'octeto') { const o = octeto(x); return { valor: o.valor, atomos: o.noCumplen, electrones: o.atomos.map(a => a.electrones), errores: o.errores }; }
    throw new Error(`conteo: no conozco «${tipo}»`);
  }
  // ¿Se ofrece esta lupa en Explorar? No si la respuesta es 0 sin un error real que la pueda confundir (sp sin C≡C,
  // octeto sin átomos del tercer período en adelante, aromáticos sin anillos), ni la función principal de la cafeína
  // ni los aromáticos de la quercetina y la cafeína (anillos con C=O fuera del anillo: el motor los cuenta como RDKit,
  // la academia no; ver la cabecera, convención 5).
  function lupaDisponible(x, tipo) {
    const I = info(x), f = typeof x === 'string' && BIB && BIB.POR_ID[x];
    if (tipo === 'grupos') return !(f && f.sinPrincipal);
    if (tipo === 'sp') return I.atom.some(a => a.triples || a.dobles >= 2);
    if (tipo === 'octeto') return I.atom.some(a => ['P', 'S', 'Cl', 'Br', 'I'].includes(a.el));
    if (tipo === 'metilos') return metilos(x).valor >= 2;
    if (tipo === 'aromaticos') return I.anillos.length > 0 && !(f && f.sinAromaticos);
    return true;
  }
  // Semilla de una molécula y una lupa: decide en qué lugar cae la correcta (0 a 3).
  function semilla(x, tipo) { const t = (typeof x === 'string' ? x : x.smiles) + '|' + tipo; let h = 2166136261; for (const ch of t) { h ^= ch.codePointAt(0); h = Math.imul(h, 16777619) >>> 0; } return h; }
  // La correcta y tres errores de valor distinto, de menor a mayor. La correcta cae en el lugar que da la semilla (si
  // hay valores debajo para ponerla ahí): los errores reales van primero; si no alcanzan, el vecino de abajo o de
  // arriba («conteo apurado»).
  function opciones(x, tipo) {
    if (tipo === 'grupos') return opcionesGrupos(x);
    const c = conteo(x, tipo), v = c.valor;
    const reales = [];
    for (const [k, codigo, respaldo, explicacion0] of ERRORES[tipo]) {
      const e = c.errores[k];
      if (typeof e !== 'number' || e < 0 || e === v || reales.some(o => o.valor === e)) continue;
      let explicacion = explicacion0;
      if (tipo === 'octeto' && k === 'todoTercerPeriodo' && !info(x).atom.some(a => a.el === 'S'))
        explicacion = 'No todo átomo del tercer período en adelante pasa de 8: cada I con un enlace y tres pares libres tiene 8.';
      reales.push({ valor: e, correcta: false, error: codigo, respaldo, explicacion });
    }
    const relleno = d => ({ valor: v + d, correcta: false, error: 'AQ-conteo-apurado', respaldo: 'hipotesis', explicacion: `Se te ${d > 0 ? 'coló' : 'escapó'} alguno al contar: vuelve a mirarlos uno por uno con la lupa.` });
    // No hay más de v valores enteros debajo de v: con v chico la correcta va arriba; con v ≥ 3 se compensa y no va primera.
    const sem = semilla(x, tipo), pos = v >= 3 ? 1 + sem % 3 : Math.min(sem % 4, v);
    const debajo = reales.filter(o => o.valor < v).slice(0, pos), arriba = reales.filter(o => o.valor > v).slice(0, 3 - pos);
    for (let d = -1; debajo.length < pos; d--) if (!debajo.some(o => o.valor === v + d)) debajo.push(relleno(d));
    for (let d = 1; arriba.length < 3 - pos; d++) if (!arriba.some(o => o.valor === v + d)) arriba.push(relleno(d));
    const lista = [{ valor: v, correcta: true }, ...debajo, ...arriba].sort((p, q) => p.valor - q.valor);
    return { tipo, valor: v, opciones: lista, conteo: c };
  }
  function opcionesGrupos(x) {
    const G = grupos(x), p = G.principal;
    if (!p) throw new Error('opciones: la molécula no tiene grupos');
    const nombreP = p.familia !== p.tipo ? `${NOMBRES[p.tipo]}` : p.nombre;
    const lista = [{ valor: nombreP, correcta: true }];
    const E = [
      ['porSecundaria', 'FO4-funcion-secundaria', 'parcial', 'Esa función también está, pero manda la de mayor prioridad (ácido > éster > amida > aldehído > cetona > alcohol > amina).'],
      ['carboxiloComoCetonaAlcohol', 'AQ-carboxilo-cetona-alcohol', 'hipotesis', 'El C=O y el OH en el mismo carbono no son una cetona y un alcohol: juntos forman el carboxilo, –COOH.'],
      ['esterComoEter', 'AQ-ester-eter', 'hipotesis', 'El O entre dos carbonos, con un C=O al lado, es de un éster (o una lactona), no de un éter.'],
      ['lactonaComoLactama', 'AQ-lactona-lactama', 'hipotesis', 'Lactona es el éster cerrado en anillo (con O); lactama es la amida cerrada en anillo (con N).'],
      ['fenolComoAlcohol', 'AQ-fenol-alcohol', 'hipotesis', 'El OH sobre un carbono del anillo aromático es un fenol, no un alcohol.'],
      ['aromaticoPrimero', 'AQ-aromatico-manda', 'hipotesis', 'El anillo aromático no da sufijo: manda el grupo con O o N de mayor prioridad.'],
    ];
    for (const [k, codigo, respaldo, explicacion] of E) {
      const v = G.errores[k];
      if (!v || lista.some(o => o.valor === v)) continue;
      lista.push({ valor: v, correcta: false, error: codigo, respaldo, explicacion });
      if (lista.length === 4) break;
    }
    // Si faltan, primero un grupo que sí está (y no manda), después grupos que no están.
    const presentes = G.tipos.filter(t => t !== p.tipo && FAMILIA[t] !== p.tipo && !['aromatico', 'heterociclo'].includes(t)).map(t => NOMBRES[t]);
    const acetal = G.tipos.includes('hemiacetal') || G.tipos.includes('acetal');
    for (const v of [...presentes, 'alcohol', 'cetona', 'éter', 'amina', 'alqueno', 'aldehído']) {
      if (lista.length >= 4) break;
      if (lista.some(o => o.valor === v)) continue;
      const esta = presentes.includes(v);
      const explicacion = v === 'éter' && acetal ? 'Ese O entre dos carbonos está, pero forma un hemiacetal o un acetal, y el éter no da sufijo: manda el alcohol.'
        : esta ? 'Ese grupo está, pero no es el de mayor prioridad.' : 'Ese grupo no está en esta molécula: busca sus átomos con la lupa.';
      lista.push({ valor: v, correcta: false, error: esta ? 'FO4-funcion-secundaria' : 'AQ-grupo-a-ojo', respaldo: esta ? 'parcial' : 'hipotesis', explicacion });
    }
    // Orden barajado con la semilla de la molécula: la correcta no cae siempre primero.
    let h = semilla(x, 'grupos');
    for (let i = lista.length - 1; i > 0; i--) { const j = h % (i + 1); h = Math.floor(h / (i + 1)) || semilla(x, 'grupos' + i); [lista[i], lista[j]] = [lista[j], lista[i]]; }
    return { tipo: 'grupos', valor: nombreP, opciones: lista, conteo: G };
  }

  // ---------------- Solubilidad (cualitativa, de tabla) ----------------
  function solubilidad(x) {
    const f = formula(x), G = grupos(x);
    const polares = (f.conteo.O || 0) + (f.conteo.N || 0);
    const oh = ['alcohol', 'fenol', 'enol', 'hemiacetal', 'acido'].reduce((t, k) => t + (G.cuenta[k] || 0), 0);
    const ficha = typeof x === 'string' && BIB && BIB.POR_ID[x];
    return { carbonos: f.conteo.C || 0, heteroatomosPolares: polares, gruposOH: oh, carbonosPorPolar: polares ? r2((f.conteo.C || 0) / polares) : null,
      tabla: ficha ? ficha.solubilidad : null, errores: { porOH: oh > 0 ? 'soluble' : 'insoluble' } };
  }

  // ---------------- Los experimentos de «¿Qué pasa si…?» ----------------
  // Cada uno: la molécula de antes y la de después (con los mismos átomos, para dibujarlas en el mismo lugar), el valor
  // que se pregunta y lo que da cada error.
  function experimento(nombre) {
    if (nombre === 'hidrogenar-oleico') {
      const k = M('acido-oleico').enlaces.findIndex(e => e.orden === 2 && M('acido-oleico').atomos[e.a].el === 'C' && M('acido-oleico').atomos[e.b].el === 'C');
      const d = hidrogenar('acido-oleico', k), a = lupa('acido-oleico', 'sp2'), b = lupa(d, 'sp2');
      return { antes: 'acido-oleico', despues: d, enlace: k, valor: b.valor, antesValor: a.valor, atomos: b.atomos, hAntes: formula('acido-oleico').conteo.H, hDespues: formula(d).conteo.H,
        formula: formula(d).texto, masaAntes: formula('acido-oleico').masa, masaDespues: formula(d).masa,
        errores: { sinCarbonilo: b.errores.sinCarbonilo, sinCambio: a.valor, unoMenos: a.valor - 1 } };
    }
    if (nombre === 'piruvico-lactico') {
      const d = hidrogenar('acido-piruvico', 1), a = numeroOxidacion('acido-piruvico', 1).valor, b = numeroOxidacion(d, 1).valor;
      return { antes: 'acido-piruvico', despues: d, atomo: 1, antesValor: a, valor: b, reduccion: b < a, quiralesAntes: quirales('acido-piruvico').valor, quiralesDespues: quirales(d).valor,
        errores: { alReves: 'oxidación', sinOxigeno: 'ninguna' } };
    }
    if (nombre === 'ciclar-glucosa') {
      const a = quirales('glucosa-abierta'), b = quirales('glucosa-ciclica');
      return { antes: 'glucosa-abierta', despues: 'glucosa-ciclica', antesValor: a.valor, valor: b.valor, atomos: b.atomos,
        errores: { sinCambio: a.valor, pierdeC5: a.valor - 1, conHeteroatomo: b.errores.conHeteroatomo } };
    }
    if (nombre === 'octeto-alicina') {
      const o = octeto('alicina'), i = o.noCumplen[0], A = info('alicina').atom[i];
      return { antes: 'alicina', despues: 'alicina', atomo: i, valor: o.atomos[i].electrones, pares: A.pares, enlacesDelAtomo: A.enl,
        errores: { comoLey: 8, paresDeSulfuro: 2 * A.enl + 4, valencia: VE[A.el] } };
    }
    if (nombre === 'fenilalanina-tirosina') {
      const a = grupos('fenilalanina'), b = grupos('tirosina');
      const nuevos = b.tipos.filter(t => !a.tipos.includes(t));
      return { antes: 'fenilalanina', despues: 'tirosina', nuevos, valor: nuevos[0], grupo: b.lista.find(g => g.tipo === nuevos[0]),
        formulaAntes: formula('fenilalanina').texto, formulaDespues: formula('tirosina').texto,
        errores: { comoAlcohol: 'alcohol', comoEter: 'eter', comoAcido: 'acido' } };
    }
    throw new Error(`experimento: no conozco «${nombre}»`);
  }

  function resumen(x) {
    return { formula: formula(x), hibridacion: hibridacion(x).cuenta, enlaces: enlaces(x), pares: pares(x).total, quirales: quirales(x).valor,
      anillos: anillos(x), grupos: grupos(x), octeto: octeto(x) };
  }
  function ficha(id) { const f = BIB && BIB.POR_ID[id]; if (!f) throw new Error(`no hay «${id}» en la biblioteca`); return f; }
  function biblioteca() { return BIB ? BIB.LISTA : []; }

  return { molecula, formula, hibridacion, lupa, enlaces, pares, octeto, anillos, grupos, quirales, metilos, numeroOxidacion, hidrogenar, ionizar,
    conteo, opciones, lupaDisponible, solubilidad, experimento, resumen, ficha, biblioteca, aSmiles, ERRORES, NOMBRES, PRIORIDAD, EN, MASA };
});
