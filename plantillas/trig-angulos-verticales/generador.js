/*
 * Generador «Ángulos verticales: dos visuales a la vez». Formato "predicciones" (docs/arquitectura.md).
 * Funciona en el navegador (window.Generadores['trig-angulos-verticales']) y en Node (require).
 *
 * Convención de academia: tan 8° = 1/7, tan 16° = 7/24, tan 37° = 3/4, tan 45° = 1, tan 53° = 4/3,
 * tan 74° = 24/7, tan 82° = 7, tan 30° = √3/3 y tan 60° = √3. Algunos ángulos se dan solo por su
 * tangente («un ángulo α con tan α = 2/3»). El suelo siempre es horizontal y todo está en un mismo
 * plano vertical. En _datos, toda tangente es un número (tA = 0.75 es «tan α = 3/4»); angA y angB
 * dicen cómo se nombró el ángulo en el enunciado («37°», o null si se dio solo su tangente).
 *
 * Tipos y campos de _datos:
 *   mismo-lado        Un observador ve la punta de algo alto con elevación α; avanza d m hacia la base y la ve
 *                     con elevación β (tA < tB). { d, tA, tB, h0, pide }. h0: altura del visor sobre el suelo
 *                     (0 si los ángulos se miden desde el suelo). pide 'altura': altura total = h0 + d/(cot α − cot β);
 *                     pide 'distancia': distancia del segundo punto a la base = (altura sobre el visor)·cot β.
 *   ambos-lados       Dos observadores A y B en el suelo, a ambos lados de la base, separados d m; ven la punta con
 *                     elevaciones α (desde A) y β (desde B). { d, tA, tB, pide }. 'altura' = d/(cot α + cot β);
 *                     'distancia' = distancia de A a la base = altura·cot α.
 *   movimiento        Dos ángulos tomados con t s de diferencia mientras algo se mueve con rapidez constante.
 *                     { sub, v, unidadV, t, tA, tB, complementarios, v2, sentido }. Respuesta: la altura
 *                     H = d/(cot α − cot β), con d el avance horizontal relativo en m.
 *                     sub 'auto': un auto va hacia el cerro a v km/h; elevaciones α y luego β. d = v·t/3,6.
 *                     sub 'dron': un dron vuela horizontal a v m/s hacia un punto del suelo; depresiones α y luego β. d = v·t.
 *                     sub 'camara': cámara fija en lo alto de un poste; un auto se acerca a v km/h; depresiones α y luego β.
 *                     sub 'avioneta': avioneta a v km/h y auto a v2 km/h por la misma recta; sentido 'opuesto'
 *                     (se acercan: d = (v + v2)·t/3,6) o 'mismo' (la avioneta lo alcanza: d = (v − v2)·t/3,6).
 *                     complementarios = true: el enunciado solo da α y dice que β es su complemento (tA·tB = 1).
 *   entre-edificios   Desde la azotea de un edificio de H m. { sub, H, tA, tB }.
 *                     sub 'muro': un muro bajo en el suelo, alineado con la base; su extremo lejano se ve con
 *                     depresión α y el cercano con β (tA < tB). Respuesta: largo = H(cot α − cot β).
 *                     sub 'otro': otro edificio más bajo; su azotea se ve con depresión α y su base con β (tA < tB).
 *                     Respuesta: su altura = H − (H·cot β)·tan α.
 *   mitad-cima        Torre de altura h2 a D m del observador; se ve un punto de la torre a h1 m del suelo con
 *                     elevación α y la punta con β. { sub, h1, h2, D, pide }. sub 'mitad' (h1 = h2/2) o 'ventana'.
 *                     Respuesta: tan(β − α) = (h2 − h1)·D / (D² + h1·h2), una fracción; con pide 'cot' (solo en 'mitad'),
 *                     su inverso cot(β − α).
 *   objeto-elevado    Antena de a m sobre un edificio de b m; observador en el suelo a D m de la base; la antena se
 *                     ve bajo θ (ángulo entre las visuales a la base y a la punta de la antena). { sub, a, b, D, t, D0, pide }.
 *                     sub 'tan': da a, b, D; respuesta tan θ = a·D/(D² + b(a + b)).
 *                     sub 'altura': da b, D y t = tan θ; respuesta a. sub 'pura': lo mismo en un triángulo ABC recto
 *                     en B con AB = D, E en BC con BE = b y tan(∠EAC) = t; respuesta EC (= a).
 *                     sub 'distancia': da a, b, t; las dos distancias D que cumplen t·D² − a·D + t·b(a + b) = 0;
 *                     pide 'menor' o 'mayor' de las dos; con pide 'traslado' hay un fotógrafo a D0 m (más lejos que
 *                     las dos) y la respuesta es lo mínimo que debe acercarse: D0 − (la mayor).
 *   dron-camino       Dron a altura h sobre el punto O del suelo; camino AB en el suelo alineado con O, con OA = p
 *                     y AB = L (A entre O y B); el camino se ve bajo θ con tan θ = t; el dron vuela más alto que X m.
 *                     { p, L, t, X }. Las alturas posibles cumplen t·h² − L·h + t·p(p + L) = 0; respuesta: la que
 *                     supera X.
 *   puente-simbolico  (sale en cerca del 11 % de las semillas, por un sorteo aparte) Pilar, poste o antena BT de
 *                     altura `altura` (letra h, H, b o k); un cable une T con P del piso, y desde P se ve T con elevación
 *                     `angulo` ('α', '2θ', 'β', 'x', '2x' o 'φ'). { sub, angulo, altura, contexto }.
 *                     sub 'suma': BP + PT = altura·(cot + csc) = altura·cot(angulo/2); sub 'resta': PT − BP =
 *                     altura·tan(angulo/2); sub 'razon': (BP + PT)/BT = cot(angulo/2); sub 'razon-resta':
 *                     (PT − BP)/BT = tan(angulo/2). Respuesta simbólica (texto), p. ej. «h·cot(α/2)», «tan θ».
 *   condicion-angulo  Elevación θ con una condición: { cond, valor, mayor45, d, pide }. cond 'suma' (sen θ + cos θ),
 *                     'producto' (sen θ·cos θ), 'tancot' (tan θ + cot θ) o 'doble' (sen 2θ) = valor; mayor45 dice si
 *                     θ > 45°. d: distancia horizontal del observador a la base de la torre. pide 'visual': distancia del
 *                     observador a la punta = d/cos θ; pide 'altura' = d·tan θ.
 *
 * Errores: TR9 (razón equivocada) y TR16 (linealidad) son «parcial» con fuente en
 * docs/investigacion/trigonometria-ideas-erroneas.md. Los AV-* son hipótesis nuestras; AV-suma-cotangentes y
 * AV-resta-cotangentes salen del documento de trampas (TR9, variante) y AV-otra-raiz / AV-raiz-bajo-obstaculo,
 * de la trampa «la otra raíz de la cuadrática» (docs/clasificacion/trampas-admision-unmsm/geometria-trigonometria.md).
 */
(function (root, fabrica) {
  const nodo = typeof module === 'object' && module.exports;
  const api = fabrica(nodo ? require('../../nucleo/azar.js') : root.Azar,
                      nodo ? require('../../nucleo/predicciones.js') : root.Predicciones);
  if (nodo) module.exports = api;
  else (root.Generadores = root.Generadores || {})[api.id] = api;
})(typeof self !== 'undefined' ? self : this, function (Azar, P) {
  'use strict';
  const ID = 'trig-angulos-verticales';
  const TRF = 'docs/investigacion/trigonometria-ideas-erroneas.md';
  const h = (id, valor, explicacion) => ({ id, valor, explicacion, respaldo: 'hipotesis', fuente: null });
  const p = (id, valor, explicacion) => ({ id, valor, explicacion, respaldo: 'parcial', fuente: TRF });
  const v = P.v;
  const S3 = Math.sqrt(3);

  // ---------- Números exactos: q·√r con q fracción y r libre de cuadrados ----------
  const LIBRES = [];
  for (let r = 1; r <= 120; r++) { let ok = true; for (let k = 2; k * k <= r; k++) if (r % (k * k) === 0) { ok = false; break; } if (ok) LIBRES.push(r); }
  const mcd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a || 1; };
  // exacto(x): «12», «3/7», «5√3», «2√3/7», «−3/5»; null si x no es así (denominador hasta dmax).
  function exacto(x, dmax = 60, rmax = 120) {
    if (!Number.isFinite(x)) return null;
    if (Math.abs(x) < 1e-12) return '0';
    for (const r of LIBRES) {
      if (r > rmax) break;
      const y = x / Math.sqrt(r);
      for (let d = 1; d <= dmax; d++) {
        const n = Math.round(y * d);
        if (n === 0 || Math.abs(n) > 1e6) continue;
        if (Math.abs(y * d - n) < 1e-10 + 1e-12 * Math.abs(n)) {
          const g = mcd(n, d), nn = Math.abs(n / g), dd = d / g, s = n < 0 ? '−' : '';
          if (r === 1) return s + P.formatear(nn, 0) + (dd === 1 ? '' : '/' + dd);
          return s + (nn === 1 ? '' : P.formatear(nn, 0)) + '√' + r + (dd === 1 ? '' : '/' + dd);
        }
      }
    }
    return null;
  }
  const longitudLimpia = x => { const t = exacto(x); return t !== null && !t.includes('/') && x > 0; };
  const fraccionLimpia = x => { const t = exacto(x); return t !== null && x > 0 && !t.includes('√'); };
  const ex = x => exacto(x) || exacto(x, 3000, 1) || P.formatear(x, 2);
  // Entre paréntesis si es fracción o raíz, para dividir sin ambigüedad: «600 ÷ (2√3/3)».
  const entreP = t => (/[\/√]/.test(t) ? `(${t})` : t);
  // Ecuación t·x² − a·x + t·P = 0 con t = n/d, escrita con enteros: n·x² − d·a·x + n·P = 0 (simplificada).
  const cuadratica = (t, a, P2, x = 'x') => {
    const [n, d] = fraccion(t), A2 = n, B = d * a, C = n * P2, g = mcd(mcd(A2, B), C);
    return `${A2 / g === 1 ? '' : A2 / g}${x}² − ${B / g}${x} + ${C / g} = 0`;
  };
  function fraccion(t) { for (let d = 1; d <= 1000; d++) { const n = Math.round(t * d); if (Math.abs(t * d - n) < 1e-9) return [n, d]; } return [t, 1]; }

  // ---------- Ángulos de academia ----------
  const A = (txt, n, d) => ({ txt, t: n / d, frac: d === 1 ? `${n}` : `${n}/${d}` });
  const NOTABLES = [A('8°', 1, 7), A('16°', 7, 24), A('37°', 3, 4), A('45°', 1, 1), A('53°', 4, 3), A('74°', 24, 7), A('82°', 7, 1)];
  const POR_TANGENTE = [A(null, 1, 2), A(null, 1, 3), A(null, 2, 3), A(null, 2, 1), A(null, 3, 1), A(null, 3, 2), A(null, 1, 4), A(null, 5, 12), A(null, 12, 5)];
  const RACIONALES = NOTABLES.concat(POR_TANGENTE);
  const RAIZ3 = [{ txt: '30°', t: S3 / 3, frac: '√3/3' }, { txt: '60°', t: S3, frac: '√3' }];
  // «… con un ángulo de elevación » + «de 37°» o «α (con tan α = 2/3)».
  const angulo = (clave, o, letra) => (o.txt ? ['de ', v(clave, o.txt)] : [v(clave, letra), ` (con tan ${letra} = ${o.frac})`]);
  const nombre = (o, letra) => o.txt || letra;
  // Más corto, para los enunciados que acompañan una figura: «37°» o «α (tan α = 2/3)».
  const anguloCorto = (clave, o, letra) => (o.txt ? [v(clave, o.txt)] : [v(clave, letra), ` (tan ${letra} = ${o.frac})`]);
  const sen = t => t / Math.sqrt(1 + t * t);
  const deEl = el => (el.startsWith('el ') ? 'del ' + el.slice(3) : 'de ' + el);

  // ---------- Cálculo (regla 1): funciones puras, las mismas que verifica papel.json ----------
  const num = t => (Array.isArray(t) ? t[0] / t[1] : t);
  const calc = {
    // Avanza d hacia la base: d = H(cot α − cot β). H medida desde el nivel del visor.
    mismoLado: ({ d, tA, tB }) => d / (1 / num(tA) - 1 / num(tB)),
    // A ambos lados: d = H(cot α + cot β).
    ambosLados: ({ d, tA, tB }) => d / (1 / num(tA) + 1 / num(tB)),
    // Muro visto desde una azotea de H: largo = H(cot α − cot β).
    muro: ({ H, tA, tB }) => H * (1 / num(tA) - 1 / num(tB)),
    // Otro edificio: separación H·cot β y desnivel separación·tan α.
    otroEdificio: ({ H, tA, tB }) => H - (H / num(tB)) * num(tA),
    // Ángulo entre las visuales a dos puntos de una misma vertical (alturas h1 < h2) desde D: tan(β − α).
    tanVisto: ({ h1, h2, D }) => { const ta = h1 / D, tb = h2 / D; return (tb - ta) / (1 + ta * tb); },
    // Antena sobre edificio b, a D, vista bajo θ: tan β = (t + tan α)/(1 − t·tan α) y a = D·tan β − b.
    alturaAntena: ({ b, D, t }) => { const ta = b / D, tt = num(t); return D * (tt + ta) / (1 - tt * ta) - b; },
    // Distancias desde las que se ve la antena bajo θ: t·D² − a·D + t·b(a + b) = 0 → [menor, mayor].
    distanciasAntena: ({ a, b, t }) => raices(num(t), -a, num(t) * b * (a + b)),
    // Alturas del dron que ve el camino AB bajo θ: t·h² − L·h + t·p(p + L) = 0 → [menor, mayor].
    alturasDron: ({ p, L, t }) => raices(num(t), -L, num(t) * p * (p + L)),
    // sen y cos de θ con la condición dada y el lado de 45° en que está θ.
    porCondicion: ({ cond, valor, mayor45 }) => {
      const val = num(valor);
      const P2 = cond === 'suma' ? (val * val - 1) / 2 : cond === 'producto' ? val : cond === 'tancot' ? 1 / val : val / 2;
      const s = Math.sqrt(1 + 2 * P2);                        // sen θ + cos θ (> 0 en un ángulo agudo)
      const [m, M] = raices(1, -s, P2);
      const sn = mayor45 ? M : m, cs = mayor45 ? m : M;
      return { sen: sn, cos: cs, tan: sn / cs };
    },
    velocidad: (vkmh) => vkmh / 3.6,
  };
  function raices(A2, B, C) {
    const disc = B * B - 4 * A2 * C;
    if (disc < -1e-9) return [];
    const r = Math.sqrt(Math.max(0, disc));
    return [(-B - r) / (2 * A2), (-B + r) / (2 * A2)].sort((x, y) => x - y);
  }

  function generar(semilla) {
    // Un sorteo aparte decide si sale el problema simbólico; así el resto de semillas no cambia.
    if (Azar.crear(ID + '|simbolico|' + semilla).sig() < 0.11) return puenteSimbolico(semilla);
    const rng = Azar.crear(ID + '|' + semilla);
    const tipo = rng.elegir(TIPOS), pref = rng.sig();   // pref fija el subtipo en todos los intentos
    for (let intento = 0; intento < 200; intento++) {
      const pr = construir(rng, semilla, tipo, pref);
      if (pr && pr.alternativas.length >= 4) return pr;
    }
    throw new Error('No se pudo generar un problema con 4 alternativas distintas');
  }

  const TIPOS = ['mismo-lado', 'ambos-lados', 'movimiento', 'entre-edificios', 'mitad-cima', 'objeto-elevado', 'dron-camino', 'condicion-angulo'];
  const D_LISTA = [];
  for (let d = 2; d <= 240; d++) D_LISTA.push(d);

  // Par de ángulos (tA < tB salvo que se permita igualdad) de una misma familia.
  function par(rng, { iguales = false, soloRacional = false } = {}) {
    const fam = !soloRacional && rng.sig() < 0.2 ? RAIZ3 : RACIONALES;
    for (;;) {
      const x = rng.elegir(fam), y = rng.elegir(fam);
      if (!iguales && x.t === y.t) continue;
      if (fam === RACIONALES && x.txt === null && y.txt === null && rng.moneda()) continue; // más notables
      return x.t <= y.t ? [x, y] : [y, x];
    }
  }
  // Elige d de una lista barajada para que f(d) sea limpia.

  const porPref = (pref, lista) => lista[Math.min(lista.length - 1, Math.floor(pref * lista.length))];
  function construir(rng, semilla, tipo, pref) {
    const r = ({
      'mismo-lado': mismoLado, 'ambos-lados': ambosLados, movimiento, 'entre-edificios': entreEdificios,
      'mitad-cima': mitadCima, 'objeto-elevado': objetoElevado, 'dron-camino': dronCamino, 'condicion-angulo': condicionAngulo,
    })[tipo](rng, pref);
    if (!r) return null;
    const { correcta, unidad = 'm', fraccion = false } = r;
    const limpio = fraccion ? fraccionLimpia : longitudLimpia;
    if (!limpio(correcta)) return null;
    const errores = r.errores.filter(e => Number.isFinite(e.valor) && e.valor > 0 && limpio(e.valor));
    const texto = x => exacto(x) + (unidad ? ' ' + unidad : '');
    const alternativas = P.armar({ correcta, errores, rng, texto });
    // La forma de la correcta (entero, raíz, fracción) debe aparecer también en algún distractor.
    const clase = t => (t.includes('√') ? 'r' : '') + (t.includes('/') ? 'f' : '');
    const cc = clase(alternativas.find(a => a.correcta).texto);
    if (!alternativas.some(a => !a.correcta && clase(a.texto) === cc)) return null;
    // Distractores revisados (para que la correcta no quede siempre en un extremo): se arman con un azar
    // aparte, después de las comprobaciones de arriba, para no mover la secuencia de rng ni los problemas.
    // Si no alcanzan para 4 alternativas de la misma forma, se queda lo de antes.
    let finales = alternativas;
    if (r.distractores && alternativas.length >= 4) {
      const nuevos = r.distractores.filter(e => Number.isFinite(e.valor) && e.valor > 0 && limpio(e.valor));
      const alt2 = P.armar({ correcta, errores: nuevos, rng: Azar.crear(ID + '|distractores|' + semilla), texto });
      if (alt2.length >= 4 && alt2.some(a => !a.correcta && clase(a.texto) === cc)) finales = alt2;
    }
    return {
      id: `${ID}#${semilla}`, variables: r.variables, enunciado: r.enunciado, pregunta: r.pregunta, datos: '',
      alternativas: finales, solucion: r.solucion, respuesta: { valor: correcta, unidad }, _datos: { tipo, ...r.datos },
      ...(r.viva ? r.viva(finales) : {}),
    };
  }


  // ---------- Problema simbólico: el recorrido en el puente (cot y csc que se simplifican) ----------
  // csc x + cot x = (1 + cos x)/sen x = cot(x/2)   y   csc x − cot x = (1 − cos x)/sen x = tan(x/2).
  const razonTxt = (fn, arg) => (arg.includes('/') ? `${fn}(${arg})` : `${fn} ${arg}`);
  const ANGULOS_SIMB = [['α', 'α/2', '2α'], ['2θ', 'θ', '4θ'], ['β', 'β/2', '2β'], ['x', 'x/2', '2x'], ['2x', 'x', '4x'], ['φ', 'φ/2', '2φ']];
  function puenteSimbolico(semilla) {
    const rng = Azar.crear(ID + '|simbolico|' + semilla + '|problema');
    const sub = rng.elegir(['suma', 'resta', 'razon', 'razon-resta']);
    const [angulo, mitad, doble] = rng.elegir(ANGULOS_SIMB), entero = angulo;
    const altura = rng.elegir(['h', 'H', 'b', 'k']);
    const contexto = rng.elegir(['puente', 'poste', 'antena']);
    const suma = sub === 'suma' || sub === 'razon', razon = sub.startsWith('razon');
    const pre = razon ? '' : `${altura}·`;
    const T = (fn, arg) => { const t = `${pre}${razonTxt(fn, arg)}`; return { clave: t, texto: t }; };
    const e = (id, fn, arg, explicacion) => ({ id, ...T(fn, arg), explicacion, respaldo: 'hipotesis', fuente: null });
    const x = angulo, xm = mitad.includes('/') ? `(${mitad})` : ` ${mitad}`;
    const correcta = T(suma ? 'cot' : 'tan', mitad);
    // Cada distractor cambia la función, el ángulo o los dos; así ni «cot» ni «α/2» quedan en mayoría
    // alrededor de la correcta (antes, la que compartía más rasgos con las demás era siempre la correcta).
    const errores = suma ? [
      e('AV-mitad-invertida', 'tan', mitad, `Cambiaste las dos identidades: cot ${x} + csc ${x} da cot${xm}; la que da tan${xm} es csc ${x} − cot ${x}.`),
      e('AV-sin-mitad', 'cot', entero, `Simplificaste cot ${x} + csc ${x} como si diera cot ${x}, pero el csc ${x} no desaparece. Escribe todo con senos y cosenos: (cos ${x} + 1)/sen ${x}. Con 1 + cos ${x} = 2cos²${xm} y sen ${x} = 2 sen${xm}·cos${xm} queda cot${xm}.`),
      e('AV-mitad-invertida+AV-sin-mitad', 'tan', entero, `Dos errores: no partiste el ángulo (1 + cos ${x} = 2cos²${xm} deja ${mitad}, no ${x}) y además invertiste la razón, porque cos${xm} queda arriba y sen${xm} abajo. Sale cot${xm}, no tan ${x}.`),
      e('AV-mitad-invertida+AV-angulo-doble', 'tan', doble, `Dos errores: duplicaste el ángulo en vez de partirlo (1 + cos ${x} = 2cos²${xm}) y además invertiste la razón (cos${xm} queda arriba). Sale cot${xm}, no tan ${doble}.`),
    ] : [
      e('AV-mitad-invertida', 'cot', mitad, `Cambiaste las dos identidades: csc ${x} − cot ${x} da tan${xm}; la que da cot${xm} es csc ${x} + cot ${x}.`),
      e('AV-sin-mitad', 'tan', entero, `Simplificaste csc ${x} − cot ${x} como si diera tan ${x}. Escribe todo con senos y cosenos: (1 − cos ${x})/sen ${x}. Con 1 − cos ${x} = 2sen²${xm} y sen ${x} = 2 sen${xm}·cos${xm} queda tan${xm}.`),
      e('AV-mitad-invertida+AV-sin-mitad', 'cot', entero, `Dos errores: no partiste el ángulo (1 − cos ${x} = 2sen²${xm} deja ${mitad}, no ${x}) y además invertiste la razón, porque sen${xm} queda arriba y cos${xm} abajo. Sale tan${xm}, no cot ${x}.`),
      e('AV-mitad-invertida+AV-angulo-doble', 'cot', doble, `Dos errores: duplicaste el ángulo en vez de partirlo (1 − cos ${x} = 2sen²${xm}) y además invertiste la razón (sen${xm} queda arriba). Sale tan${xm}, no cot ${doble}.`),
    ];
    const variables = {
      h: { nombre: 'altura', color: 'o' }, a: { nombre: 'ángulo de elevación', color: 'i' },
      r: { nombre: razon ? 'razón pedida' : suma ? 'recorrido' : 'diferencia de longitudes', color: 'h' },
    };
    const escena = {
      puente: ['Sobre el tablero horizontal de un puente se levanta un pilar vertical BT de altura ', v('h', altura), ' (B está en el tablero). Un tirante recto une la punta T con un punto P del tablero', 'el tablero', 'el tirante'],
      poste: ['Un poste vertical BT de altura ', v('h', altura), ' se levanta sobre un suelo horizontal (B es su base). Un cable tensor recto une la punta T con un punto P del suelo', 'el suelo', 'el cable'],
      antena: ['Una antena vertical BT de altura ', v('h', altura), ' está sobre una azotea plana (B es su base). Un viento de acero recto une la punta T con un punto P de la azotea', 'la azotea', 'el viento de acero'],
    }[contexto];
    const [ini, hAlt, fin, piso, cable] = [escena[0], escena[1], escena[2], escena[3], escena[4]];
    const enunciado = [ini, hAlt, fin, ', y desde P la punta T se ve con un ángulo de elevación ', v('a', angulo), '.',
      sub === 'suma' ? ` Una persona va de B a P por ${piso} y luego sube por ${cable} de P a T.` : ''];
    const pregunta = [{
      suma: '¿Cuál es la expresión más simple del recorrido BP + PT?',
      resta: `¿Cuánto más largo es ${cable} PT que el tramo BP? Da la expresión más simple.`,
      razon: '¿A qué es igual (BP + PT)/BT, en su forma más simple?',
      'razon-resta': '¿A qué es igual (PT − BP)/BT, en su forma más simple?',
    }[sub]];
    const H = razon ? 'BT' : altura;
    const solucion = [
      ['En el triángulo rectángulo PBT: BP = ', v('h', H), `·cot ${x} y PT = `, v('h', H), `·csc ${x}.`],
      [suma ? `BP + PT = ${H}(cot ${x} + csc ${x}) = ${H}(cos ${x} + 1)/sen ${x}.` : `PT − BP = ${H}(csc ${x} − cot ${x}) = ${H}(1 − cos ${x})/sen ${x}.`],
      [suma ? `1 + cos ${x} = 2cos²${xm} y sen ${x} = 2 sen${xm}·cos${xm}.` : `1 − cos ${x} = 2sen²${xm} y sen ${x} = 2 sen${xm}·cos${xm}.`],
      [razon ? 'Se cancela el 2 y un factor; al dividir entre BT queda ' : 'Se cancela el 2 y un factor: ', v('r', correcta.texto), '.'],
    ];
    const alternativas = P.armarTexto({ correcta, errores, rng });
    return {
      id: `${ID}#${semilla}`, variables, enunciado, pregunta, datos: '', alternativas, solucion,
      respuesta: { valor: correcta.clave, unidad: '' }, _datos: { tipo: 'puente-simbolico', sub, angulo, altura, contexto },
    };
  }

  const OBJETOS = [
    { obj: 'una torre de telecomunicaciones', el: 'la torre', base: 'la base de la torre', punta: 'la punta de la torre', lo: 'la', quien: 'Ana', rango: [20, 150] },
    { obj: 'un cerro', el: 'el cerro', base: 'el pie del cerro', punta: 'la cima del cerro', lo: 'la', quien: 'una topógrafa', rango: [100, 3000] },
    { obj: 'un faro', el: 'el faro', base: 'la base del faro', punta: 'la luz del faro', lo: 'la', quien: 'Luis', rango: [15, 80] },
    { obj: 'un poste de alumbrado', el: 'el poste', base: 'la base del poste', punta: 'el foco del poste', lo: 'lo', quien: 'Rosa', rango: [4, 15] },
    { obj: 'un edificio', el: 'el edificio', base: 'la base del edificio', punta: 'el borde de la azotea', lo: 'lo', quien: 'Jorge', rango: [10, 150] },
  ];
  const enRango = (x, [m, M]) => x >= m - 1e-9 && x <= M + 1e-9;

  // Errores comunes a «dos visuales y una distancia d»: H = d/(cot α ∓ cot β).
  function erroresDos({ d, tA, tB, suma, h0 = 0 }) {
    const cA = 1 / tA, cB = 1 / tB, sA = sen(tA), sB = sen(tB);
    const otra = suma ? d / Math.abs(cA - cB) : d / (cA + cB);
    return [
      suma ? h('AV-resta-cotangentes', otra + h0, 'Bien con las cotangentes; restar va si están del mismo lado. Aquí la base queda entre ellos: se suman.')
           : h('AV-suma-cotangentes', otra + h0, 'Bien con las cotangentes; sumar va si la base queda entre ellos. Aquí están del mismo lado: se restan.'),
      p('TR9', d / (suma ? 1 / sA + 1 / sB : 1 / sA - 1 / sB) + h0, 'Bien el triángulo, pero la distancia por el suelo es el cateto adyacente: la une la tangente, no el seno.'),
      h('AV-angulo-en-otro-vertice', d / (suma ? tA + tB : Math.abs(tB - tA)) + h0, 'Bien el triángulo, pero la elevación se mide desde la horizontal: la distancia por el suelo es H·cot.'),
      h('AV-un-angulo', d * tA + h0, 'Bien un triángulo, pero d es solo un tramo: hace falta la segunda visual.'),
    ];
  }

  function mismoLado(rng) {
    const ctx = rng.elegir(OBJETOS);
    const [a, b] = par(rng);
    const racional = a.txt !== '30°' && a.txt !== '60°';
    const h0 = racional && rng.sig() < 0.35 ? rng.elegir([1, 2]) : 0;
    const pide = h0 === 0 && rng.sig() < 0.35 ? 'distancia' : 'altura';
    const resp = d => { const Hv = calc.mismoLado({ d, tA: a.t, tB: b.t }); return pide === 'altura' ? Hv + h0 : Hv / b.t; };
    const d = rng.barajar(D_LISTA).find(x => longitudLimpia(resp(x)) && enRango(calc.mismoLado({ d: x, tA: a.t, tB: b.t }) + h0, ctx.rango));
    if (d === undefined) return null;
    const Hv = calc.mismoLado({ d, tA: a.t, tB: b.t }), x = Hv / b.t;
    const correcta = resp(d);
    const variables = {
      a: { nombre: 'primer ángulo de elevación', color: 'o' }, b: { nombre: 'segundo ángulo de elevación', color: 'i' },
      d: { nombre: 'tramo que camina', color: 'd' }, H: { nombre: pide === 'altura' ? 'altura' : 'distancia del punto Q a la base', color: 'h' },
    };
    const enunciado = [`Desde P se ve ${ctx.punta} con elevación `, ...anguloCorto('a', a, 'α'),
      '. Tras avanzar ', v('d', `${d} m`), ' hacia la base, desde Q se ve con elevación ', ...anguloCorto('b', b, 'β'), '.',
      h0 ? ` Visor a ${h0} m del suelo.` : ''];
    const pregunta = [pide === 'altura' ? `¿Qué altura tiene ${ctx.el}?` : '¿A qué distancia de la base está Q?'];
    let errores = erroresDos({ d, tA: a.t, tB: b.t, h0: pide === 'altura' ? h0 : 0 });
    if (pide === 'altura') {
      errores.splice(1, 0, h('AV-resta-tangentes', d * (b.t - a.t) + h0, 'Bien restar, pero cada visual tiene su distancia a la base: se restan las cotangentes, no las tangentes.'));
      if (h0) errores.unshift(h('AV-olvida-visor', Hv, `Bien la altura sobre el visor; falta sumar los ${h0} m del visor al suelo.`));
      errores.push(h('AV-distancia-por-altura', x, 'Ese número es la distancia de Q a la base; se pide la altura.'));
    } else {
      const Hs = d / (1 / a.t + 1 / b.t);
      errores = [
        h('AV-distancia-desde-P', x + d, 'Esa es la distancia de P a la base. Q está d metros más cerca.'),
        h('AV-distancia-por-altura', Hv, 'Bien la altura; falta multiplicar por cot β para llegar a la distancia de Q.'),
        h('AV-suma-cotangentes', Hs / b.t, 'Bien con las cotangentes; están del mismo lado de la base: d = H(cot α − cot β).'),
        h('AV-angulo-en-otro-vertice', Hv * b.t, 'Bien la altura, pero la distancia por el suelo es el cateto adyacente: H·cot β, no H·tan β.'),
        p('TR9', Hv / sen(b.t), 'Bien la altura; al dividir entre el seno sale la visual, no la distancia por el suelo.'),
      ];
    }
    const cA = ex(1 / a.t), cB = ex(1 / b.t), na = nombre(a, 'α'), nb = nombre(b, 'β');
    const solucion = [
      ['Sea H la altura', h0 ? ' sobre el visor' : '', ' y x la distancia de Q a la base. Triángulo de Q: x = H·cot ', v('b', nb), '. Triángulo de P: x + ', v('d', `${d}`), ' = H·cot ', v('a', na), '.'],
      ['Restando: ', v('d', `${d}`), ` = H(cot ${na} − cot ${nb}) = H(${cA} − ${cB}) = H·${ex(1 / a.t - 1 / b.t)}.`],
      ['H = ', `${d} ÷ ${entreP(ex(1 / a.t - 1 / b.t))} = ${ex(Hv)} m.`],
      pide === 'altura'
        ? (h0 ? ['Se suma la altura del visor: ', v('H', `${ex(Hv)} + ${h0} = ${ex(correcta)} m`), '.'] : ['Altura: ', v('H', `${ex(correcta)} m`), '.'])
        : ['x = H·cot ', v('b', nb), ` = ${ex(Hv)} · ${cB} = `, v('H', `${ex(correcta)} m`), '.'],
    ];
    const viva = alts => vivaMismoLado({ d, a, b, h0, pide, Hv, x, correcta, na, nb, cA, cB }, alts);
    return { correcta, errores, variables, enunciado, pregunta, solucion, viva, datos: { d, tA: a.t, tB: b.t, angA: a.txt, angB: b.txt, h0, pide } };
  }

  /*
   * Escena viva (docs/escena-viva.md, sección 4) de los dos tipos de dos visuales: la figura a escala
   * (nucleo/kit/piezas/triangulo.js) con la torre, el suelo, las visuales y sus ángulos; la solución recorre
   * los dos triángulos. Se responde con alternativas. Los otros tipos siguen con el formato de siempre.
   */
  const ROTULOS = {
    'AV-resta-cotangentes': 'restando cot', 'AV-suma-cotangentes': 'sumando cot', TR9: 'con el seno', 'AV-angulo-en-otro-vertice': 'ángulo arriba',
    'AV-un-angulo': 'un solo triángulo', 'AV-resta-tangentes': 'restando tan', 'AV-olvida-visor': 'sin el visor',
    'AV-distancia-por-altura': 'otra medida', 'AV-distancia-desde-P': 'desde P', 'AV-distancia-de-B': 'desde B',
  };
  const fantasmasDe = alts => {
    const f = {};
    for (const x of alts) if (x.error) f[x.error.id] = { marca: x.valor, rotulo: ROTULOS[x.error.id] || '', texto: x.texto };
    return f;
  };

  function vivaMismoLado(e, alts) {
    const { d, a, b, h0, pide, Hv, x, correcta, na, nb, cA, cB } = e;
    const H = Hv + h0, alto = pide === 'altura';
    const puntos = [{ id: 'B', x: 0, y: 0, rotulo: '' }, { id: 'T', x: 0, y: H, rotulo: '' }, { id: 'Q', x, y: 0, rotulo: 'Q' }, { id: 'P', x: x + d, y: 0, rotulo: 'P' }];
    const lados = [{ de: 'B', a: 'T', color: 'h', grosor: 'variable', texto: alto ? 'H = ?' : '', final: alto ? `H = ${ex(correcta)} m` : undefined }];
    let ojoP = 'P', ojoQ = 'Q', pie = 'B';
    if (h0) {
      puntos.push({ id: 'P1', x: x + d, y: h0 }, { id: 'Q1', x, y: h0 }, { id: 'O', x: 0, y: h0 });
      lados.push({ de: 'P', a: 'P1', texto: `${h0} m` }, { de: 'Q', a: 'Q1' }, { de: 'P1', a: 'O', horizontal: true });
      ojoP = 'P1'; ojoQ = 'Q1'; pie = 'O';
    }
    lados.push({ de: ojoP, a: 'T', color: 'o', visual: true }, { de: ojoQ, a: 'T', color: 'i', visual: true });
    const angulos = [{ en: ojoP, de: pie, a: 'T', texto: na, color: 'o' }, { en: ojoQ, de: pie, a: 'T', texto: nb, color: 'i' }, { en: pie, de: ojoQ, a: 'T' }];
    const cotas = [{ de: 'Q', a: 'P', texto: `${d} m`, color: 'd' },
      alto ? { de: 'B', a: 'Q', texto: 'x', paso: 1 } : { de: 'B', a: 'Q', texto: 'x = ?', final: `x = ${ex(correcta)} m`, color: 'h' }];
    const datos = { suelo: true, puntos, lados, angulos, cotas };
    const v = P.v;
    const pasos = [
      { estado: { paso: 1 }, texto: ['Triángulo de Q: x = H·cot ', v('b', nb), '.'], ecuacion: ['x = H·', cB] },
      { estado: { paso: 2 }, texto: ['Triángulo de P: x + ', v('d', `${d}`), ' = H·cot ', v('a', na), '. Se restan.'],
        ecuacion: [v('d', `${d}`), ` = H(${cA} − ${cB}) → H = ${ex(Hv)} m`] },
      alto
        ? (h0 ? { estado: { paso: 2, final: true }, texto: ['Se suma la altura del visor.'], ecuacion: [v('H', `${ex(Hv)} + ${h0} = ${ex(correcta)} m`)] }
              : { estado: { paso: 2, final: true }, texto: ['Esa es la altura que se pide.'], ecuacion: ['H = ', v('H', `${ex(correcta)} m`)] })
        : { estado: { paso: 2, final: true }, texto: ['La distancia de Q es x = H·cot ', v('b', nb), '.'], ecuacion: [`x = ${ex(Hv)} · ${cB} = `, v('H', `${ex(correcta)} m`)] },
    ];
    const alt = `Figura a escala: la ${alto ? 'altura H' : 'base'} vista desde P con elevación ${na} y desde Q, ${d} m más cerca, con elevación ${nb}`
      + (h0 ? `; los ángulos se miden a ${h0} m del suelo` : '');
    return { escena: { pieza: 'triangulo', datos, alt }, pasos, fantasmas: fantasmasDe(alts) };
  }

  function vivaAmbosLados(e, alts) {
    const { d, a, b, pide, H, correcta, na, nb } = e;
    const alto = pide === 'altura', xA = H / a.t, xB = H / b.t;
    const puntos = [{ id: 'A', x: -xA, y: 0, rotulo: 'A' }, { id: 'O', x: 0, y: 0 }, { id: 'B', x: xB, y: 0, rotulo: 'B' }, { id: 'T', x: 0, y: H }];
    const lados = [
      { de: 'O', a: 'T', color: 'h', grosor: 'variable', texto: alto ? 'H = ?' : 'H', final: alto ? `H = ${ex(correcta)} m` : undefined },
      { de: 'A', a: 'T', color: 'o', visual: true }, { de: 'B', a: 'T', color: 'i', visual: true },
      // Las dos distancias a la base, con el color de su ángulo (paso 1); si se pide AO, va rotulada desde el inicio.
      alto ? { de: 'A', a: 'O', color: 'o', grosor: 'variable', paso: 1 } : { de: 'A', a: 'O', texto: 'AO = ?', final: `AO = ${ex(correcta)} m`, color: 'h', grosor: 'variable' },
      { de: 'O', a: 'B', color: 'i', grosor: 'variable', paso: 1 },
    ];
    const angulos = [{ en: 'A', de: 'O', a: 'T', texto: na, color: 'o' }, { en: 'B', de: 'O', a: 'T', texto: nb, color: 'i' }, { en: 'O', de: 'B', a: 'T' }];
    const datos = { suelo: true, puntos, lados, angulos, cotas: [{ de: 'A', a: 'B', texto: `${d} m`, color: 'd', dist: 48 }] };
    const v = P.v;
    const pasos = [
      { estado: { paso: 1 }, texto: ['La base queda entre A y B: sus distancias suman ', v('d', `${d}`), '.'],
        ecuacion: [v('d', `${d}`), ' = H·cot ', v('a', na), ' + H·cot ', v('b', nb), ` = H·${ex(1 / a.t + 1 / b.t)}`] },
      alto
        ? { estado: { paso: 1, final: true }, texto: ['Se despeja la altura H.'], ecuacion: [`H = ${d} ÷ ${entreP(ex(1 / a.t + 1 / b.t))} = `, v('H', `${ex(correcta)} m`)] }
        : { estado: { paso: 1, final: true }, texto: ['La distancia de A es H·cot ', v('a', na), '.'], ecuacion: [`H = ${ex(H)}; AO = ${ex(H)} · ${ex(1 / a.t)} = `, v('H', `${ex(correcta)} m`)] },
    ];
    const alt = `Figura a escala: la altura vista desde A con elevación ${na} y desde B, al otro lado, con elevación ${nb}; A y B separados ${d} m`;
    return { escena: { pieza: 'triangulo', datos, alt }, pasos, fantasmas: fantasmasDe(alts) };
  }

  function ambosLados(rng) {
    const ctx = rng.elegir(OBJETOS);
    const [a0, b0] = par(rng, { iguales: true });
    const [a, b] = rng.moneda() ? [a0, b0] : [b0, a0];
    const pide = rng.sig() < 0.3 ? 'distancia' : 'altura';
    const resp = d => { const H = calc.ambosLados({ d, tA: a.t, tB: b.t }); return pide === 'altura' ? H : H / a.t; };
    const d = rng.barajar(D_LISTA).find(x => longitudLimpia(resp(x)) && enRango(calc.ambosLados({ d: x, tA: a.t, tB: b.t }), ctx.rango));
    if (d === undefined) return null;
    const H = calc.ambosLados({ d, tA: a.t, tB: b.t }), correcta = resp(d);
    const quien = rng.elegir([['Dos guardaparques, en los puntos A y B,', 'Los guardaparques'], ['Dos estudiantes, en los puntos A y B,', 'Los estudiantes'], ['Dos topógrafos, en los puntos A y B,', 'Los topógrafos']]);
    const variables = {
      a: { nombre: 'ángulo de elevación desde A', color: 'o' }, b: { nombre: 'ángulo de elevación desde B', color: 'i' },
      d: { nombre: 'distancia AB', color: 'd' }, H: { nombre: pide === 'altura' ? 'altura' : 'distancia de A a la base', color: 'h' },
    };
    const enunciado = ['Desde A y B, a ', v('d', `${d} m`), ` entre sí, se ve ${ctx.punta} con elevaciones `,
      ...anguloCorto('a', a, 'α'), ' y ', ...anguloCorto('b', b, 'β'), '. La base queda entre A y B.'];
    const pregunta = [pide === 'altura' ? `¿Qué altura tiene ${ctx.el}?` : '¿A qué distancia de la base está A?'];
    let errores = erroresDos({ d, tA: a.t, tB: b.t, suma: true });
    if (pide === 'distancia') {
      errores = errores.map(e => ({ ...e, valor: e.valor / a.t }));
      errores.unshift(h('AV-distancia-por-altura', H, 'Bien la altura; falta multiplicar por cot α para llegar a la distancia de A.'),
        h('AV-distancia-de-B', H / b.t, 'Bien el método; esa es la distancia de B a la base, no la de A.'));
    } else {
      errores.push(h('AV-distancia-por-altura', H / a.t, 'Ese número es la distancia de A a la base; se pide la altura.'));
    }
    const na = nombre(a, 'α'), nb = nombre(b, 'β');
    const solucion = [
      ['La base queda entre A y B: la distancia de A a la base es H·cot ', v('a', na), ' y la de B es H·cot ', v('b', nb), '. Las dos suman ', v('d', `${d}`), '.'],
      [`${d} = H(cot ${na} + cot ${nb}) = H(${ex(1 / a.t)} + ${ex(1 / b.t)}) = H·${ex(1 / a.t + 1 / b.t)}.`],
      pide === 'altura' ? ['H = ', v('H', `${ex(H)} m`), '.'] : [`H = ${ex(H)} m; distancia de A a la base = H·cot ${na} = `, v('H', `${ex(correcta)} m`), '.'],
    ];
    const viva = alts => vivaAmbosLados({ d, a, b, pide, H, correcta, na, nb }, alts);
    return { correcta, errores, variables, enunciado, pregunta, solucion, viva, datos: { d, tA: a.t, tB: b.t, angA: a.txt, angB: b.txt, pide } };
  }

  function movimiento(rng, pref) {
    const sub = porPref(pref, ['auto', 'dron', 'camara', 'avioneta']);
    const quiereComp = rng.sig() < 0.4;
    let a, b;
    for (let k = 0; k < 50; k++) { [a, b] = par(rng); if (!quiereComp || Math.abs(a.t * b.t - 1) < 1e-12) break; }
    const complementarios = quiereComp && Math.abs(a.t * b.t - 1) < 1e-12 && a.txt !== null;
    const T = [2, 3, 4, 5, 6, 8, 10, 12, 15, 20];
    let combos = [];
    if (sub === 'dron') for (const vv of [2, 3, 4, 5, 6, 8, 10]) for (const t of T) combos.push({ v: vv, t, dd: vv * t });
    else if (sub === 'avioneta') for (const vv of [180, 216, 252, 288, 360]) for (const v2 of [36, 54, 72, 90, 108]) for (const t of [2, 3, 4, 5, 6, 8, 10]) for (const sentido of ['opuesto', 'mismo'])
      combos.push({ v: vv, v2, t, sentido, dd: (sentido === 'opuesto' ? vv + v2 : vv - v2) * t / 3.6 });
    else for (const vv of [18, 36, 54, 72, 90]) for (const t of sub === 'camara' ? [1, 2, 3, 4, 5, 6] : T) combos.push({ v: vv, t, dd: vv * t / 3.6 });
    combos = rng.barajar(combos);
    const RANGO = { auto: [100, 3000], dron: [10, 300], camara: [8, 60], avioneta: [150, 3000] }[sub];
    const c = combos.find(o => Number.isInteger(Math.round(o.dd * 1e9) / 1e9) && longitudLimpia(calc.mismoLado({ d: o.dd, tA: a.t, tB: b.t })) && enRango(calc.mismoLado({ d: o.dd, tA: a.t, tB: b.t }), RANGO));
    if (!c) return null;
    const d = Math.round(c.dd), H = calc.mismoLado({ d, tA: a.t, tB: b.t }), correcta = H;
    const kmh = sub !== 'dron', na = nombre(a, 'α'), nb = complementarios ? `(90° − ${a.txt})` : ' ' + nombre(b, 'β');
    const variables = {
      a: { nombre: 'primer ángulo', color: 'o' }, b: { nombre: 'segundo ángulo', color: 'i' },
      d: { nombre: 'rapidez y tiempo', color: 'd' }, H: { nombre: 'altura', color: 'h' },
    };
    const segundo = complementarios ? ['igual al ', v('b', 'complemento del primero')] : angulo('b', b, 'β');
    const rap = v('d', kmh ? `${c.v} km/h` : `${c.v} m/s`), tt = v('d', `${c.t} s`);
    let enunciado, pregunta;
    if (sub === 'auto') {
      enunciado = ['Un auto avanza con rapidez constante de ', rap, ' por una pista recta y horizontal que va directo hacia el pie de un cerro. Desde el auto, la cima se ve con un ángulo de elevación ', ...angulo('a', a, 'α'),
        '; ', tt, ' después, se ve con un ángulo de elevación ', ...segundo, '. Los ángulos se miden desde el nivel de la pista.'];
      pregunta = ['¿Cuál es la altura del cerro sobre el nivel de la pista?'];
    } else if (sub === 'dron') {
      enunciado = ['Un dron vuela en línea recta y horizontal, con rapidez constante de ', rap, ', hacia la vertical de una casa. En un momento ve la casa con un ángulo de depresión ', ...angulo('a', a, 'α'),
        ' y, ', tt, ' después, con un ángulo de depresión ', ...segundo, '. La casa está en el suelo horizontal; tómala como un punto.'];
      pregunta = ['¿A qué altura vuela el dron?'];
    } else if (sub === 'camara') {
      enunciado = ['Una cámara está fija en lo alto de una torre de vigilancia vertical. Un auto se acerca a la torre por una pista recta y horizontal con rapidez constante de ', rap, '. La cámara ve el auto con un ángulo de depresión ', ...angulo('a', a, 'α'),
        ' y, ', tt, ' después, con un ángulo de depresión ', ...segundo, '.'];
      pregunta = ['¿Cuál es la altura de la torre de vigilancia?'];
    } else {
      enunciado = ['Una avioneta vuela horizontalmente a ', rap, ' sobre una carretera recta. Por la carretera va un auto a ', v('d', `${c.v2} km/h`), c.sentido === 'opuesto' ? ', en sentido contrario, acercándose a la avioneta.' : ', en el mismo sentido y por delante de la avioneta, que lo va alcanzando.',
        ' El piloto ve el auto con un ángulo de depresión ', ...angulo('a', a, 'α'), ' y, ', tt, ' después, con un ángulo de depresión ', ...segundo, ' (el auto aún no queda bajo la avioneta).'];
      pregunta = ['¿A qué altura vuela la avioneta?'];
    }
    const errores = erroresDos({ d, tA: a.t, tB: b.t });
    errores.push(h('AV-distancia-por-altura', H / b.t, 'Esa es la distancia horizontal en el segundo momento, no la altura.'));
    if (kmh) errores.splice(1, 0, h('AU3-sin-convertir', H * 3.6, `Multiplicaste ${c.v} por ${c.t} sin pasar los km/h a m/s. Con segundos, la rapidez va en m/s: ${c.v} km/h = ${P.formatear(c.v / 3.6, 2)} m/s.`));
    if (sub === 'avioneta') {
      const otraV = c.sentido === 'opuesto' ? c.v - c.v2 : c.v + c.v2;
      errores.splice(1, 0, h('AV-velocidad-relativa', calc.mismoLado({ d: otraV * c.t / 3.6, tA: a.t, tB: b.t }), c.sentido === 'opuesto' ? 'Restaste las rapideces. Si se acercan en sentidos contrarios, cada segundo la distancia horizontal entre ellos baja en la suma de las dos rapideces.' : 'Sumaste las rapideces. Si van en el mismo sentido, la avioneta solo gana la diferencia de rapideces cada segundo.'),
        h('AV-solo-avioneta', calc.mismoLado({ d: c.v * c.t / 3.6, tA: a.t, tB: b.t }), 'Usaste solo lo que avanzó la avioneta. El auto también se movió: lo que importa es cuánto cambió la distancia horizontal entre los dos.'));
    }
    const dTexto = sub === 'dron' ? `${c.v} · ${c.t} = ${d} m`
      : sub === 'avioneta' ? `(${c.v} ${c.sentido === 'opuesto' ? '+' : '−'} ${c.v2}) km/h = ${P.formatear((c.sentido === 'opuesto' ? c.v + c.v2 : c.v - c.v2) / 3.6, 2)} m/s; en ${c.t} s: ${d} m`
      : `${c.v} km/h = ${P.formatear(c.v / 3.6, 2)} m/s; en ${c.t} s: ${d} m`;
    const solucion = [
      ['Avance horizontal entre las dos visuales: ', v('d', dTexto), '.'],
      sub === 'dron' || sub === 'camara' || sub === 'avioneta'
        ? ['El ángulo de depresión es igual al de elevación desde el suelo (alternos internos entre paralelas horizontales). Así, con altura H, las distancias horizontales son H·cot ', v('a', na), ' y H·cot', v('b', nb), '.']
        : ['Con altura H, las distancias horizontales al pie del cerro son H·cot ', v('a', na), ' y H·cot', v('b', nb), '.'],
      complementarios ? [`Como el segundo ángulo es el complemento, su cotangente es tan ${a.txt}: d = H(cot ${a.txt} − tan ${a.txt}) = H(${ex(1 / a.t)} − ${ex(a.t)}).`]
        : [`d = H(cot ${na} − cot${nb}) = H(${ex(1 / a.t)} − ${ex(1 / b.t)}) = H·${ex(1 / a.t - 1 / b.t)}.`],
      ['H = ', `${d} ÷ ${entreP(ex(1 / a.t - 1 / b.t))} = `, v('H', `${ex(H)} m`), '.'],
    ];
    return { correcta, errores, variables, enunciado, pregunta, solucion,
      datos: { sub, v: c.v, unidadV: kmh ? 'km/h' : 'm/s', t: c.t, tA: a.t, tB: b.t, angA: a.txt, angB: complementarios ? null : b.txt, complementarios, v2: c.v2 ?? null, sentido: c.sentido ?? null } };
  }

  function entreEdificios(rng, pref) {
    const sub = pref < 0.5 ? 'muro' : 'otro';
    const [a, b] = par(rng, { soloRacional: true });
    const Hs = rng.barajar(D_LISTA.filter(x => x >= 10 && x <= 150));
    let H = null;
    for (const x of Hs) {
      if (sub === 'muro') { if (longitudLimpia(calc.muro({ H: x, tA: a.t, tB: b.t }))) { H = x; break; } }
      else { const D = x / b.t, hb = calc.otroEdificio({ H: x, tA: a.t, tB: b.t }); if (longitudLimpia(D) && longitudLimpia(hb) && hb >= 3) { H = x; break; } }
    }
    if (H === null) return null;
    const na = nombre(a, 'α'), nb = nombre(b, 'β');
    const variables = {
      a: { nombre: sub === 'muro' ? 'depresión al extremo lejano' : 'depresión a la azotea del otro edificio', color: 'o' },
      b: { nombre: sub === 'muro' ? 'depresión al extremo cercano' : 'depresión a la base del otro edificio', color: 'i' },
      d: { nombre: 'altura del edificio de la observadora', color: 'd' }, H: { nombre: sub === 'muro' ? 'largo del muro' : 'altura del otro edificio', color: 'h' },
    };
    let correcta, enunciado, pregunta, errores, solucion;
    const inicio = ['Desde la azotea de un edificio de ', v('d', `${H} m`), ' de altura, una arquitecta observa '];
    if (sub === 'muro') {
      correcta = calc.muro({ H, tA: a.t, tB: b.t });
      enunciado = [...inicio, 'un muro bajo (de altura despreciable) construido en el suelo horizontal, en línea recta con la base de su edificio y alejándose de él. Ve el extremo más lejano del muro con un ángulo de depresión ', ...angulo('a', a, 'α'),
        ' y el extremo más cercano con un ángulo de depresión ', ...angulo('b', b, 'β'), '.'];
      pregunta = ['¿Cuánto mide el muro?'];
      errores = [
        h('AV-angulo-en-otro-vertice', H * (b.t - a.t), 'Multiplicaste la altura por las tangentes. El ángulo de depresión se mide desde la horizontal: por alternos internos, es el ángulo en el extremo del muro, y la distancia por el suelo es la altura por la cotangente.'),
        h('AV-suma-cotangentes', H * (1 / a.t + 1 / b.t), 'Sumaste las dos distancias. Los dos extremos están del mismo lado del edificio: el muro es la diferencia entre la distancia al extremo lejano y la distancia al cercano.'),
        h('AV-un-angulo', H / a.t, 'Esa es la distancia de la base del edificio al extremo lejano. Falta restarle la distancia al extremo cercano.'),
        p('TR9', H * (1 / sen(a.t) - 1 / sen(b.t)), 'Usaste el seno donde va la tangente: dividir la altura entre el seno da la visual (la hipotenusa), no la distancia por el suelo.'),
      ];
      solucion = [
        ['Por alternos internos, cada ángulo de depresión es el ángulo en el extremo del muro. Distancia de la base al extremo lejano: ', v('d', `${H}`), '·cot ', v('a', na), ` = ${ex(H / a.t)} m.`],
        ['Distancia al extremo cercano: ', v('d', `${H}`), '·cot ', v('b', nb), ` = ${ex(H / b.t)} m.`],
        ['Largo del muro: ', v('H', `${ex(H / a.t)} − ${ex(H / b.t)} = ${ex(correcta)} m`), '.'],
      ];
    } else {
      correcta = calc.otroEdificio({ H, tA: a.t, tB: b.t });
      const D = H / b.t, desn = D * a.t;
      enunciado = [...inicio, 'otro edificio, más bajo, construido sobre el mismo suelo horizontal. Ve la azotea del edificio bajo con un ángulo de depresión ', ...angulo('a', a, 'α'),
        ' y su base con un ángulo de depresión ', ...angulo('b', b, 'β'), '.'];
      pregunta = ['¿Cuánto mide el edificio más bajo?'];
      errores = [
        h('AV-desnivel', desn, 'Ese es el desnivel entre las dos azoteas, no la altura del edificio bajo: falta restarlo de la altura del edificio alto.'),
        h('AV-distancia-por-altura', D, 'Esa es la distancia entre los dos edificios, no una altura.'),
        h('AV-angulo-en-otro-vertice', H - D / a.t, 'Usaste la cotangente del ángulo a la azotea: el desnivel es la separación por la tangente (cateto opuesto sobre adyacente), con el ángulo en el vértice de la observadora.'),
        h('AV-suma-desnivel', H + desn, 'Sumaste el desnivel. La azotea del otro se ve hacia abajo: el edificio bajo mide la altura del alto menos el desnivel.'),
        p('TR9', H - D * sen(a.t), 'Usaste el seno donde va la tangente: el desnivel y la separación son los dos catetos del triángulo, y los une la tangente.'),
      ];
      solucion = [
        ['Separación entre los edificios (triángulo con la base): ', v('d', `${H}`), '·cot ', v('b', nb), ` = ${ex(D)} m.`],
        ['Desnivel entre las azoteas (triángulo con la azotea baja): ', `${ex(D)}·tan `, v('a', na), ` = ${ex(desn)} m.`],
        ['Altura del edificio bajo: ', v('H', `${H} − ${ex(desn)} = ${ex(correcta)} m`), '.'],
      ];
    }
    return { correcta, errores, variables, enunciado, pregunta, solucion, datos: { sub, H, tA: a.t, tB: b.t, angA: a.txt, angB: b.txt } };
  }

  // Errores de tan(β − α) con tan α = h1/D y tan β = h2/D.
  function erroresTanDif(h1, h2, D, quien) {
    const ta = h1 / D, tb = h2 / D;
    return [
      p('TR16', tb - ta, 'Restaste las tangentes: tan(β − α) no es tan β − tan α. La resta va arriba, pero se divide entre 1 + tan β·tan α.'),
      h('AV-signo-denominador', (tb - ta) / (1 - ta * tb), 'Pusiste 1 − tan β·tan α abajo: ese es el denominador de tan(β + α). Para la diferencia va 1 + tan β·tan α.'),
      h('AV-tangente-total', tb, `Esa es la tangente del ángulo de elevación a ${quien}, no la del ángulo entre las dos visuales.`),
      h('AV-razon-invertida', (1 + ta * tb) / (tb - ta), 'Pusiste la fórmula al revés: arriba va la resta de tangentes y abajo 1 + su producto.'),
      h('AV-tangente-parte', ta, 'Esa es la tangente de la elevación al punto más bajo, no la del ángulo entre las dos visuales.'),
    ];
  }
  // Distractores revisados de tan(β − α): unos por encima de la correcta (TR16, signo del denominador) y
  // otros por debajo (errores al multiplicar las tangentes en el denominador), alternados, para que la
  // correcta no sea siempre la menor. Con inv = true se pide la cotangente: cada error es el inverso del
  // tan(β − α) mal calculado, y la explicación lo dice.
  function distractoresTanDif(h1, h2, D, quien, inv = false) {
    const ta = h1 / D, tb = h2 / D, c = (tb - ta) / (1 + ta * tb);
    const f = x => (inv ? 1 / x : x);
    const y = inv ? ' Luego invertiste ese valor para la cotangente.' : '';
    return [
      p('TR16', f(tb - ta), 'Restaste las tangentes: tan(β − α) no es tan β − tan α. La resta va arriba, pero se divide entre 1 + tan β·tan α.' + y),
      h('AV-cuadrado-denominador', f((tb - ta) / (1 + tb * tb)), `En el denominador pusiste tan β·tan β = (${h2}/${D})² en vez de tan β·tan α = (${h2}/${D})(${h1}/${D}).` + y),
      h('AV-signo-denominador', f((tb - ta) / (1 - ta * tb)), 'Pusiste 1 − tan β·tan α abajo: ese es el denominador de tan(β + α). Para la diferencia va 1 + tan β·tan α.' + y),
      h('AV-producto-sin-cuadrado', f((h2 - h1) / (D + h1 * h2)), `Al multiplicar tan β·tan α = (${h2}/${D})(${h1}/${D}) dividiste ${h1 * h2} entre ${D} y no entre ${D}² = ${D * D}: el denominador te salió 1 + ${h1 * h2}/${D}.` + y),
      h('AV-cancelar-D', f(c / D), `Al dividir (${h2 - h1}/${D}) entre (${D * D + h1 * h2}/${D * D}) te quedó ${h2 - h1}/${D * D + h1 * h2}: se te fue el factor ${D} que sube al multiplicar por ${D}².` + y),
      inv ? h('AV-tangente-por-cotangente', c, 'Ese es tan(β − α). Se pide la cotangente, su inverso.')
          : h('AV-tangente-total', tb, `Esa es la tangente del ángulo de elevación a ${quien}, no la del ángulo entre las dos visuales.`),
      h('AV-tangente-parte', f(ta), inv ? 'Esa es la cotangente de la elevación al punto más bajo, no la del ángulo entre las dos visuales.' : 'Esa es la tangente de la elevación al punto más bajo, no la del ángulo entre las dos visuales.'),
    ];
  }
  function elegirTanDif(rng, filtro) {
    const cand = todosTanDif(filtro);
    return cand.length ? rng.elegir(cand) : null;
  }
  const TAN_DIF = [];
  for (let D = 4; D <= 40; D++) for (let h2 = 6; h2 <= 60; h2++) for (let h1 = 2; h1 < h2; h1++) {
    if (D === h1 || D === h2) continue;                       // con D = h1 o D = h2 las tangentes salen enteras y delatan
    const n = (h2 - h1) * D, dd = D * D + h1 * h2, g = mcd(n, dd);
    if (dd / g <= 60 && n / g < dd / g) TAN_DIF.push([h1, h2, D]);
  }
  function todosTanDif(filtro) { return TAN_DIF.filter(c => filtro(...c)); }
  // Punto medio: hay pocas razones h1/D distintas, así que se admite denominador hasta 100.
  const MITAD = [];
  for (let D = 4; D <= 80; D++) for (let h1 = 2; h1 <= 50; h1++) {
    if (D === h1 || D === 2 * h1) continue;
    const n = h1 * D, dd = D * D + 2 * h1 * h1, g = mcd(n, dd);
    if (dd / g <= 100) MITAD.push([h1, 2 * h1, D]);
  }

  function mitadCima(rng, pref) {
    const sub = pref < 0.5 ? 'mitad' : 'ventana';
    const c = sub === 'mitad' ? rng.elegir(MITAD) : elegirTanDif(rng, (h1, h2) => 2 * h1 !== h2);
    if (!c) return null;
    const pide = sub === 'mitad' && rng.moneda() ? 'cot' : 'tan';
    const [h1, h2, D] = c, tanDif = calc.tanVisto({ h1, h2, D }), correcta = pide === 'cot' ? 1 / tanDif : tanDif;
    const variables = {
      a: { nombre: 'elevación al punto más bajo', color: 'o' }, b: { nombre: 'elevación a la punta', color: 'i' },
      d: { nombre: 'distancia a la torre', color: 'd' }, H: { nombre: 'altura de la torre', color: 'h' },
    };
    const enunciado = sub === 'mitad'
      ? ['Una torre vertical de ', v('H', `${h2} m`), ' se levanta sobre un suelo horizontal. Desde un punto del suelo a ', v('d', `${D} m`), ' de su base, se ve el punto medio de la torre con un ángulo de elevación ', v('a', 'α'), ' y la punta con un ángulo de elevación ', v('b', 'β'), '.']
      : ['Una torre vertical de ', v('H', `${h2} m`), ` tiene una ventana a ${h1} m del suelo horizontal. Desde un punto del suelo a `, v('d', `${D} m`), ' de su base, se ve la ventana con un ángulo de elevación ', v('a', 'α'), ' y la punta de la torre con un ángulo de elevación ', v('b', 'β'), '.'];
    const pregunta = [pide === 'cot' ? '¿Cuánto vale cot(β − α), la cotangente del ángulo entre las dos visuales?' : '¿Cuánto vale tan(β − α), la tangente del ángulo entre las dos visuales?'];
    const ta = h1 / D, tb = h2 / D;
    const errores = pide === 'tan' ? erroresTanDif(h1, h2, D, 'la punta') : [
      h('AV-tangente-por-cotangente', tanDif, 'Ese es tan(β − α). Se pide la cotangente, su inverso.'),
      p('TR16', 1 / (tb - ta), 'Tomaste tan(β − α) = tan β − tan α y luego invertiste. La tangente de la diferencia lleva el denominador 1 + tan β·tan α.'),
      h('AV-signo-denominador', (1 - ta * tb) / (tb - ta), 'Usaste 1 − tan β·tan α: ese es el de la tangente de una suma. Para la diferencia va 1 + tan β·tan α.'),
      h('AV-tangente-total', D / h2, 'Esa es la cotangente de la elevación a la punta, no la del ángulo entre las dos visuales.'),
      h('AV-tangente-parte', D / h1, 'Esa es la cotangente de la elevación al punto medio, no la del ángulo entre las dos visuales.'),
    ];
    const solucion = [
      ['tan ', v('a', 'α'), ` = ${h1}/${D}${ex(ta) === `${h1}/${D}` ? '' : ' = ' + ex(ta)} (${sub === 'mitad' ? 'la mitad de la torre' : 'la ventana'}) y tan `, v('b', 'β'), ' = ', v('H', `${h2}`), '/', v('d', `${D}`), `${ex(tb) === `${h2}/${D}` ? '' : ' = ' + ex(tb)}.`],
      ['tan(β − α) = (tan β − tan α) / (1 + tan β·tan α).'],
      [`= (${ex(tb)} − ${ex(ta)}) / (1 + ${ex(tb)}·${ex(ta)}) = ${entreP(ex(tb - ta))} ÷ ${entreP(ex(1 + ta * tb))} = ${ex(tanDif)}.`],
      ...(pide === 'cot' ? [['cot(β − α) = 1/tan(β − α) = ', ex(correcta), '.']] : []),
    ];
    const distractores = distractoresTanDif(h1, h2, D, 'la punta', pide === 'cot');
    return { correcta, errores, distractores, variables, enunciado, pregunta, solucion, datos: { sub, h1, h2, D, pide }, unidad: '', fraccion: true };
  }

  function objetoElevado(rng, pref) {
    const sub = porPref(pref, ['tan', 'altura', 'pura', 'distancia']);
    const variables = {
      a: { nombre: 'altura de la antena', color: 'h' }, b: { nombre: 'altura del edificio', color: 'o' },
      d: { nombre: 'distancia a la base', color: 'd' }, t: { nombre: 'tangente del ángulo bajo el que se ve la antena', color: 'i' },
    };
    if (sub === 'tan') {
      const c = elegirTanDif(rng, () => true);
      if (!c) return null;
      const [b, h2, D] = c, a = h2 - b, correcta = calc.tanVisto({ h1: b, h2, D });
      const enunciado = ['Sobre la azotea de un edificio de ', v('b', `${b} m`), ' hay una antena vertical de ', v('a', `${a} m`), '. Desde un punto P del suelo horizontal, a ', v('d', `${D} m`), ' de la base del edificio, la antena se ve bajo un ángulo ', v('t', 'θ'), ': el ángulo entre la visual al pie de la antena y la visual a su punta.'];
      const solucion = [
        ['Sea α la elevación al pie de la antena y β la elevación a la punta: θ = β − α.'],
        ['tan α = ', v('b', `${b}`), '/', v('d', `${D}`), ` = ${ex(b / D)}; tan β = (${b} + ${a})/${D} = ${ex(h2 / D)}.`],
        ['tan ', v('t', 'θ'), ` = (${ex(h2 / D)} − ${ex(b / D)}) / (1 + ${ex(h2 / D)}·${ex(b / D)}) = `, v('t', ex(correcta)), '.'],
      ];
      return { correcta, errores: erroresTanDif(b, h2, D, 'la punta de la antena'), distractores: distractoresTanDif(b, h2, D, 'la punta de la antena'), variables, enunciado, pregunta: ['¿Cuánto vale tan θ?'], solucion, datos: { sub, a, b, D }, unidad: '', fraccion: true };
    }
    if (sub === 'altura' || sub === 'pura') {
      // Se buscan números con al menos tres distractores que se escriban como la respuesta (enteros).
      const erroresAltura = (b, h2, D) => {
        const a = h2 - b, t = calc.tanVisto({ h1: b, h2, D }), ta = b / D, tbS = (t + ta) / (1 + t * ta);
        return [
        p('TR16', D * t, sub === 'pura'
          ? 'Sumaste las tangentes: tomaste tan(∠BAE + ∠EAC) = tan(∠BAE) + tan(∠EAC). La tangente de una suma lleva el denominador 1 − tan(∠BAE)·tan(∠EAC).'
          : 'Sumaste las tangentes: tomaste tan(α + θ) = tan α + tan θ. La tangente de una suma no se reparte así: es (tan α + tan θ)/(1 − tan α·tan θ).'),
        h('AV-altura-total', a + b, sub === 'pura' ? 'Ese es el cateto BC completo. Se pide solo el tramo EC: falta restar BE.' : 'Esa es la altura de la punta de la antena sobre el suelo. Falta restar el edificio.'),
        h('AV-signo-denominador', D * tbS - b, sub === 'pura'
          ? 'Usaste 1 + tan(∠BAE)·tan(∠EAC) en el denominador: ese es el de la tangente de una diferencia. ∠BAC = ∠BAE + ∠EAC es una suma, y va 1 − tan(∠BAE)·tan(∠EAC).'
          : 'Usaste 1 + tan α·tan θ en el denominador: ese es el de la tangente de una diferencia. Aquí β = α + θ es una suma, y va 1 − tan α·tan θ.'),
        h('AV-tangente-desde-punta', D / t - b, sub === 'pura'
          ? 'Dividiste AB entre tan(∠EAC), como si ∠EAC estuviera en el vértice C. tan(∠BAC) es BC/AB: el cateto BC va arriba.'
          : 'Dividiste la distancia entre tan θ, como si θ fuera la elevación medida desde el pie. tan β es la altura total sobre la distancia, no al revés.'),
        ];
      };
      let c = null;
      for (const x of rng.barajar(todosTanDif(() => true))) {
        const n = erroresAltura(...x).filter(e => e.valor > 0 && longitudLimpia(e.valor) && Math.abs(e.valor - (x[1] - x[0])) > 1e-9).length;
        if (n >= 3) { c = x; break; }
      }
      if (!c) return null;
      const [b, h2, D] = c, a = h2 - b, t = calc.tanVisto({ h1: b, h2, D }), tt = ex(t);
      const correcta = calc.alturaAntena({ b, D, t });
      const ta = b / D;
      const errores = erroresAltura(b, h2, D);
      let enunciado, pregunta, solucion;
      if (sub === 'altura') {
        enunciado = ['Sobre la azotea de un edificio de ', v('b', `${b} m`), ' hay una antena vertical. Desde un punto P del suelo horizontal, a ', v('d', `${D} m`), ' de la base del edificio, la antena se ve bajo un ángulo θ (entre las visuales a su pie y a su punta) con ', v('t', `tan θ = ${tt}`), '.'];
        pregunta = ['¿Cuánto mide la antena?'];
        solucion = [
          ['Sea α la elevación al pie de la antena: tan α = ', v('b', `${b}`), '/', v('d', `${D}`), ` = ${ex(ta)}. La elevación a la punta es α + θ.`],
          ['tan(α + θ) = (tan α + tan θ) / (1 − tan α·tan θ) = ', `(${ex(ta)} + `, v('t', tt), `) / (1 − ${ex(ta)}·${tt}) = ${ex(h2 / D)}.`],
          [`Altura de la punta: ${D}·${ex(h2 / D)} = ${h2} m. Antena: `, v('a', `${h2} − ${b} = ${a} m`), '.'],
        ];
      } else {
        enunciado = ['En el triángulo ABC, recto en B, el cateto AB mide ', v('d', `${D} cm`), '. El punto E está en el cateto BC, con BE = ', v('b', `${b} cm`), ', y la tangente del ángulo EAC es ', v('t', tt), '.'];
        pregunta = ['¿Cuánto mide EC?'];
        solucion = [
          ['tan(∠BAE) = BE/AB = ', v('b', `${b}`), '/', v('d', `${D}`), ` = ${ex(ta)}. El ángulo BAC es ∠BAE + ∠EAC.`],
          ['tan(∠BAC) = (', `${ex(ta)} + `, v('t', tt), `) / (1 − ${ex(ta)}·${tt}) = ${ex(h2 / D)}.`],
          [`BC = AB·tan(∠BAC) = ${D}·${ex(h2 / D)} = ${h2} cm, y EC = `, v('a', `${h2} − ${b} = ${a} cm`), '.'],
        ];
      }
      return { correcta, errores, variables, enunciado, pregunta, solucion, datos: { sub, b, D, t }, unidad: sub === 'pura' ? 'cm' : 'm' };
    }
    // sub 'distancia': raíces enteras D1 < D2 con D1·D2 = b(a + b).
    const cand = [];
    for (let b = 2; b <= 30; b++) for (let a = 1; a <= 40; a++) {
      const P2 = b * (a + b);
      for (let D1 = 1; D1 * D1 < P2; D1++) if (P2 % D1 === 0) {
        const D2 = P2 / D1, S = D1 + D2, g = mcd(a, S);
        if (S / g <= 30 && a / g < S / g && D1 >= 2) cand.push([a, b, D1, D2]);
      }
    }
    const [a, b, D1, D2] = rng.elegir(cand), t = a / (D1 + D2), tt = ex(t);
    const pide = rng.elegir(['menor', 'mayor', 'traslado']);
    const D0 = pide === 'traslado' ? D2 + rng.entero(2, 20) : null;
    const correcta = pide === 'menor' ? D1 : pide === 'mayor' ? D2 : D0 - D2;
    variables.d = { nombre: pide === 'traslado' ? 'cuánto debe acercarse' : 'distancia a la base', color: 'd' };
    const enunciado = ['Sobre la azotea de un edificio de ', v('b', `${b} m`), ' hay una antena vertical de ', v('a', `${a} m`), '. Un fotógrafo, con la cámara a ras del suelo horizontal frente al edificio, ve la antena bajo un ángulo θ (entre las visuales a su pie y a su punta) con ', v('t', `tan θ = ${tt}`), '.',
      pide === 'traslado' ? ` Ahora está a ${D0} m de la base del edificio y quiere acercarse en línea recta.` : ' Hay dos puntos del suelo desde los que eso ocurre.'];
    const pregunta = [pide === 'menor' ? '¿A qué distancia de la base está la posición más cercana?' : pide === 'mayor' ? '¿A qué distancia de la base está la posición más lejana?' : '¿Cuánto debe acercarse, como mínimo, para ver la antena bajo ese ángulo θ?'];
    const errores = pide === 'traslado' ? [
      h('AV-otra-raiz', D0 - D1, `Llevaste al fotógrafo hasta la posición de ${D1} m. Al acercarse desde ${D0} m, primero pasa por la de ${D2} m, y ahí ya ve la antena bajo θ: esa es la menor distancia que debe moverse.`),
      h('AV-posicion-por-traslado', D2, `${D2} m es la posición final, medida desde la base. Se pide cuánto se mueve el fotógrafo: ${D0} − ${D2}.`),
      h('AV-diferencia-raices', D2 - D1, 'Esa es la distancia entre las dos posiciones posibles, no lo que se mueve el fotógrafo desde donde está ahora.'),
      h('AV-angulo-desde-base', Math.abs(D0 - a / t), 'Tomaste tan θ = (antena)/(distancia), como si el ángulo se viera desde el pie de la antena. θ es la diferencia de dos elevaciones y se usa la tangente de la diferencia.'),
    ] : [
      h('AV-otra-raiz', pide === 'menor' ? D2 : D1, `Esa es la otra raíz de la ecuación: la posición ${pide === 'menor' ? 'más lejana' : 'más cercana'}. Las dos dan el mismo ángulo θ; se pide la ${pide === 'menor' ? 'más cercana' : 'más lejana'}.`),
      h('AV-angulo-desde-base', a / t, 'Tomaste tan θ = (antena)/(distancia), como si el ángulo se viera desde el pie de la antena. θ es la diferencia de dos elevaciones: hay que usar la tangente de la diferencia.'),
      h('AV-media-geometrica', Math.sqrt(D1 * D2), 'Esa es la posición donde el ángulo es el mayor posible (la media geométrica de las dos), no una de las posiciones con tan θ dada.'),
      h('AV-diferencia-raices', D2 - D1, 'Esa es la distancia entre las dos posiciones, no la distancia a la base.'),
    ];
    const solucion = [
      ['Con el fotógrafo a x de la base: tan α = ', v('b', `${b}`), '/x (pie de la antena) y tan β = ', `${a + b}/x (punta). θ = β − α.`],
      ['tan θ = (', `${a + b}/x − ${b}/x) / (1 + ${a + b}·${b}/x²) = ${a}x / (x² + ${b * (a + b)}).`],
      [v('t', tt), ` = ${a}x / (x² + ${b * (a + b)}) → ${cuadratica(t, a, b * (a + b))} → x = ${D1} o x = ${D2}.`],
      pide === 'traslado' ? [`Desde ${D0} m, al acercarse primero llega a ${D2} m: se mueve `, v('d', `${D0} − ${D2} = ${correcta} m`), '.']
        : ['La posición ', pide === 'menor' ? 'más cercana' : 'más lejana', ' está a ', v('d', `${correcta} m`), '.'],
    ];
    return { correcta, errores, variables, enunciado, pregunta, solucion, datos: { sub, a, b, t, D0, pide } };
  }

  function dronCamino(rng) {
    const cand = [];
    for (let p0 = 1; p0 <= 30; p0++) for (let L = 2; L <= 40; L++) {
      const P2 = p0 * (p0 + L);
      for (let h1 = 2; h1 * h1 < P2; h1++) if (P2 % h1 === 0) {
        const h2 = P2 / h1, S = h1 + h2, g = mcd(L, S);
        if (S / g <= 30 && L / g < S / g && h2 - h1 >= 3) cand.push([p0, L, h1, h2]);
      }
    }
    const [p0, L, h1, h2] = rng.elegir(cand), t = L / (h1 + h2), tt = ex(t);
    const X = rng.entero(h1 + 1, h2 - 1), correcta = h2;
    const variables = {
      p: { nombre: 'distancia OA', color: 'o' }, L: { nombre: 'largo del camino AB', color: 'd' },
      t: { nombre: 'tangente del ángulo bajo el que se ve el camino', color: 'i' }, H: { nombre: 'altura del dron', color: 'h' },
    };
    const enunciado = ['Un dron está suspendido justo encima del punto O de un terreno horizontal. En el terreno hay un camino recto AB alineado con O, con A entre O y B: OA = ', v('p', `${p0} m`), ' y AB = ', v('L', `${L} m`),
      '. Desde el dron, el camino AB se ve bajo un ángulo θ (entre las visuales a A y a B) con ', v('t', `tan θ = ${tt}`), `. El dron está más alto que la azotea de un edificio vecino de ${X} m.`];
    const pregunta = ['¿A qué altura está el dron?'];
    const errores = [
      h('AV-raiz-bajo-obstaculo', h1, `Esa es la otra raíz de la ecuación: también da tan θ = ${tt}, pero queda por debajo de los ${X} m del edificio. El enunciado dice que el dron está más alto.`),
      h('AV-angulo-desde-base', L / t, 'Tomaste tan θ = (camino)/(altura), como si el camino empezara justo debajo del dron. Empieza a OA de O: θ es la diferencia de dos ángulos medidos desde la vertical.'),
      h('AV-media-geometrica', Math.sqrt(p0 * (p0 + L)), 'Esa es la altura desde la que el camino se ve con el mayor ángulo posible, no la que da la tangente pedida.'),
      h('AV-diferencia-raices', h2 - h1, 'Esa es la diferencia entre las dos alturas posibles, no una altura.'),
    ];
    const solucion = [
      ['Con el dron a altura h, mide los ángulos desde la vertical: tan φ₁ = ', v('p', `${p0}`), '/h (hacia A) y tan φ₂ = ', `${p0 + L}/h (hacia B). θ = φ₂ − φ₁.`],
      ['tan θ = (', `${p0 + L}/h − ${p0}/h) / (1 + ${p0}·${p0 + L}/h²) = ${L}h / (h² + ${p0 * (p0 + L)}).`],
      [v('t', tt), ` = ${L}h / (h² + ${p0 * (p0 + L)}) → ${cuadratica(t, L, p0 * (p0 + L), 'h')} → h = ${h1} o h = ${h2}.`],
      [`Solo ${h2} m supera los ${X} m del edificio: h = `, v('H', `${h2} m`), '.'],
    ];
    return { correcta, errores, variables, enunciado, pregunta, solucion, datos: { p: p0, L, t, X } };
  }

  function condicionAngulo(rng) {
    const [x, y, hip] = rng.elegir([[3, 4, 5], [5, 12, 13], [7, 24, 25], [8, 15, 17]]);
    const mayor45 = rng.moneda();
    const op = mayor45 ? y : x, ad = mayor45 ? x : y;       // cateto opuesto y adyacente a θ
    const cond = rng.elegir(['suma', 'producto', 'tancot', 'doble']);
    const [vn, vd] = cond === 'suma' ? [x + y, hip] : cond === 'producto' ? [x * y, hip * hip] : cond === 'tancot' ? [hip * hip, x * y] : [2 * x * y, hip * hip];
    const g = mcd(vn, vd), valor = [vn / g, vd / g], vt = `${vn / g}/${vd / g}`;
    const pide = rng.moneda() ? 'visual' : 'altura';
    const k = [1, 2, 3].find(x => enRango(ad * op * x * op / ad, [10, 200]) && rng.sig() < 0.7) ?? 1, d = ad * op * k;
    if (!enRango(d * op / ad, [10, 200])) return null;
    const correcta = pide === 'visual' ? d * hip / ad : d * op / ad;
    const expr = { suma: 'sen θ + cos θ', producto: 'sen θ · cos θ', tancot: 'tan θ + cot θ', doble: 'sen 2θ' }[cond];
    const variables = {
      d: { nombre: 'distancia a la base', color: 'd' }, c: { nombre: 'condición del ángulo', color: 'i' },
      t: { nombre: 'ángulo de elevación', color: 'o' }, H: { nombre: pide === 'visual' ? 'distancia a la punta' : 'altura', color: 'h' },
    };
    const enunciado = ['Desde un punto del suelo horizontal, a ', v('d', `${d} m`), ' de la base de una torre vertical, se ve su punta con un ángulo de elevación ', v('t', 'θ'), `, ${mayor45 ? 'mayor' : 'menor'} que 45°, tal que `, v('c', `${expr} = ${vt}`), '.'];
    const pregunta = [pide === 'visual' ? '¿Cuál es la distancia del punto a la punta de la torre?' : '¿Cuál es la altura de la torre?'];
    const otro = pide === 'visual' ? d * hip / op : d * ad / op;
    const errores = [
      h('AV-otra-raiz-angulo', otro, `La condición se cumple con dos ángulos complementarios. Usaste el ${mayor45 ? 'menor' : 'mayor'} que 45°; el enunciado pide el ${mayor45 ? 'mayor' : 'menor'}.`),
      pide === 'visual' ? p('TR9', d * hip / op, 'Dividiste la distancia entre el seno. La distancia por el suelo es el cateto adyacente a θ: la visual es esa distancia entre el coseno.')
                        : p('TR9', d * op / hip, 'Multiplicaste por el seno. La altura y la distancia por el suelo son los dos catetos: los une la tangente, no el seno.'),
      h('AV-distancia-por-altura', pide === 'visual' ? d * op / ad : d * hip / ad, pide === 'visual' ? 'Esa es la altura de la torre, no la distancia a su punta.' : 'Esa es la distancia a la punta (la visual), no la altura.'),
      h('AV-suma-catetos', d + d * op / ad, pide === 'visual' ? 'Sumaste la distancia por el suelo y la altura. La visual es la hipotenusa: es más corta que esa suma (los catetos se combinan con Pitágoras o con el coseno).' : 'Sumaste la distancia por el suelo y la altura: se pide solo la altura.'),
    ];
    const pasoCond = {
      suma: `(sen θ + cos θ)² = 1 + 2 sen θ cos θ → 2 sen θ cos θ = (${vt})² − 1 = ${ex(2 * x * y / hip / hip)}.`,
      producto: `2 sen θ cos θ = 2·${vt} = ${ex(2 * x * y / hip / hip)}.`,
      tancot: `tan θ + cot θ = 1/(sen θ cos θ) → sen θ cos θ = ${vd / g}/${vn / g}, y 2 sen θ cos θ = ${ex(2 * x * y / hip / hip)}.`,
      doble: `sen 2θ = 2 sen θ cos θ = ${vt}.`,
    }[cond];
    const solucion = [
      [pasoCond],
      [`(sen θ + cos θ)² = 1 + ${ex(2 * x * y / hip / hip)} = ${ex((x + y) ** 2 / hip / hip)}: sen θ + cos θ = ${ex((x + y) / hip)} y sen θ·cos θ = ${ex(x * y / hip / hip)}. Son ${x}/${hip} y ${y}/${hip}.`],
      ['Como ', v('t', 'θ'), ` es ${mayor45 ? 'mayor' : 'menor'} que 45°, sen θ ${mayor45 ? '>' : '<'} cos θ: sen θ = ${op}/${hip}, cos θ = ${ad}/${hip} y tan θ = ${op}/${ad}.`],
      pide === 'visual' ? ['Distancia a la punta = ', v('d', `${d}`), ` / cos θ = ${d}·${hip}/${ad} = `, v('H', `${ex(correcta)} m`), '.']
                        : ['Altura = ', v('d', `${d}`), ` · tan θ = ${d}·${op}/${ad} = `, v('H', `${ex(correcta)} m`), '.'],
    ];
    return { correcta, errores, variables, enunciado, pregunta, solucion, datos: { cond, valor, mayor45, d, pide } };
  }

  return { id: ID, titulo: 'Ángulos verticales: dos visuales a la vez', generar, calc, exacto };
});
