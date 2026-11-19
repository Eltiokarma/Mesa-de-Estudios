/*
 * Teoría de «Resolución de triángulos rectángulos» (trigonometria.triangulos-rectangulos), para 5.º de secundaria y
 * preuniversitario. Fuente del contenido: docs/teoria/matriz/trigonometria.json (unidad 4) y la propuesta
 * docs/etapa7/propuesta-trigonometria.md (Etapa 7, 19 nov; Gerson delegó el criterio: sus decisiones están en la
 * sección 9). Compañera: Mara (coneja), cercana y rigurosa: primero se nombra el lado desde el ángulo; después se elige la
 * razón que lleva el lado buscado arriba y el conocido abajo.
 *
 * Cinco ideas: `un-lado-un-angulo` (la hipotenusa y un ángulo), `cateto-y-angulo` (un cateto y un ángulo, nueva),
 * `elevacion-depresion`, `dos-angulos` (dos ángulos hacia la misma punta, nueva) y `angulo-observacion`. Objeto de cada
 * primera pantalla (pieza trig-vista, dibujos de prueba): la cometa con su pita, la antena con su cable tensor, el globo
 * aerostático que mira una niña, el cerro visto desde la combi y el letrero en un poste.
 *
 * REGLA DE COLORES DE LA UNIDAD (la de «Razones»; propuesta §6; molde §5b, «un color fijo por magnitud»):
 *   - carmín (h): los ángulos θ, α, β y φ, con su arco junto al vértice;
 *   - naranja (o): el cateto opuesto CO; en una visual, la altura h (el opuesto a la elevación y a la depresión);
 *   - turquesa (i): el cateto adyacente CA; en una visual, la distancia por el suelo d;
 *   - tinta: la hipotenusa H (la pita, el cable, la visual), los objetos, la horizontal del ojo y lo que se pide antes de
 *     hallarlo («?», también la línea de lo que se pide en Predice). Violeta y verde: no se usan.
 *   Un lado lleva el color de su NOMBRE desde el ángulo de la figura (el que se da o se pide). Como la elevación y la
 *   depresión se miden desde una horizontal, en las ideas 3 a 5 lo vertical es siempre naranja y lo horizontal turquesa.
 *   La respuesta lleva el color de su magnitud (una altura en naranja, una distancia en turquesa, un ángulo en carmín, una
 *   hipotenusa en tinta y negrita): decisión 6 de la propuesta (en «Razones» la respuesta va en violeta: su B4, pendiente).
 *   Lo comprueba triangulos-rectangulos.test.js en cada figura (rol de cada lado contra su color) y en cada texto.
 * Letras (propuesta §5, campo `letras`): θ un ángulo agudo dado o pedido; α y β los dos ángulos de un mismo problema (α el
 * menor); φ el ángulo de observación; CO, CA y H los lados desde θ; h una altura; d una distancia por el suelo (d₁ y d₂ en
 * la idea 4); a un largo dado con letra; v y t la rapidez y el tiempo de un móvil (d = v · t, como en Física); x un largo
 * pedido sin nombre. La altura de los ojos se dice en palabras. R, L y m no son letras (m es el metro).
 * Convención (decisiones de la Etapa 2): «≈» en la teoría (37° mide 36,87°); en `datos`, «sen 37° = 3/5 y cos 37° = 4/5
 * (convención del examen)». Respuestas racionalizadas.
 * Lo que no entra: la tangente de una suma o de una diferencia (Arcos compuestos), las condiciones con identidades, los
 * triángulos oblicuángulos y el área con el seno. Física («Vectores») da como dato F cos α y F sen α: es la regla de la
 * idea 1 con F por hipotenusa; «Movimiento rectilíneo» escribe d = v · t: la idea 4 lo usa igual.
 * Errores: TR9 (elige mal la razón) es de docs/investigacion/trigonometria-ideas-erroneas.md (parcial); los demás son
 * hipótesis de aula, en el comentario de cada idea.
 *
 * Ficha de tarea (diseno-y-animacion):
 *   Promesa: con un lado y un ángulo agudo se halla todo el triángulo; elevación y depresión se miden desde la horizontal.
 *   Persona y condiciones: postulante de 5.º o de academia, celular de 360 px de gama baja, con o sin conexión.
 *   Resultado observable: halla un lado con la razón correcta, distingue elevación de depresión, suma la altura de los
 *     ojos, resuelve dos ángulos hacia una misma punta y calcula un ángulo de observación.
 *   Orden de atención: 1.º el ángulo y su horizontal · 2.º el lado conocido · 3.º el que se busca · acción: mover el
 *     ángulo o un largo.
 *   Estados: juego sin tocar · probando · predicción pendiente · coincide / no coincide · paso de «Mira» · caso nuevo.
 *   Duda que resuelve: ¿cuándo se multiplica y cuándo se divide?, ¿desde dónde se mide la depresión?, ¿por qué acercarse
 *     no siempre agranda lo que se ve?
 */
(function (root, fabrica) {
  const nodo = typeof module === 'object' && module.exports;
  const def = nodo ? fabrica(require('../../../nucleo/kit/kit.js'), require('../../../plantillas/trig-angulos-verticales/motor.js'))
    : fabrica(root.Kit, root.MotorCampo);
  if (nodo) module.exports = def;
  else root.Teoria.unidad(def);
})(typeof self !== 'undefined' ? self : this, function (Kit, MC) {
  'use strict';
  const f = (x, d = 2) => Kit.formatear(x, d);
  const SEP = '   ·   ';
  // Una relación que no se parte en dos líneas: sus espacios pasan a espacios duros (como en «Razones»).
  // También dentro de un trozo de color {v, t}: «300√3 m» no se parte entre el número y su unidad (cierre, 19 nov).
  const junto = x => (typeof x === 'string' ? x.replace(/ /g, ' ') : Array.isArray(x) ? x.map(junto)
    : x && typeof x === 'object' && 'v' in x ? Object.assign({}, x, { t: junto(x.t) })
      : x && typeof x === 'object' ? Object.fromEntries(Object.entries(x).map(([k, v]) => [k, k === 'indice' ? v : junto(v)])) : x);
  // En un enunciado o una lectura, un número no se separa de su unidad al partir el renglón.
  const jN = x => (typeof x === 'string' ? x.replace(/([\d√]) (?=(cm²|m²|cm|m|km|s)(?![a-zñáéíóú]))/g, '$1 ') : Array.isArray(x) ? x.map(jN) : x);
  // Colores de la unidad (cabecera): ángulos carmín, opuesto naranja, adyacente turquesa, hipotenusa en tinta.
  const dH = t => ({ v: 'c-h', t }), dO = t => ({ v: 'c-o', t }), dI = t => ({ v: 'c-i', t });
  const neg = t => ({ negrita: [t] });
  const th = dH('θ'), al = dH('α'), be = dH('β'), fi = dH('φ');
  const CO = dO('CO'), CA = dI('CA'), HH = 'H';
  const hh = dO('h'), dd = dI('d');
  const sub = (x, i) => ({ sub: [x, i] });
  const d1 = sub(dd, '1'), d2 = sub(dd, '2'), h1 = sub(hh, '1'), h2 = sub(hh, '2');
  const frac = (a, b) => ({ frac: [a, b] });
  const RAD = Math.PI / 180, GRA = 180 / Math.PI;
  const gcd = (a, b) => (b ? gcd(b, a % b) : Math.abs(a));
  function azar(sem) {
    let q = (sem * 2654435761 + 12345) >>> 0;
    const rr = () => { q = (q + 0x6D2B79F5) >>> 0; let z = q; z = Math.imul(z ^ (z >>> 15), z | 1); z ^= z + Math.imul(z ^ (z >>> 7), z | 61); return ((z ^ (z >>> 14)) >>> 0) / 4294967296; };
    rr.ent = (lo, hi) => lo + Math.floor(rr() * (hi - lo + 1));
    rr.uno = xs => xs[Math.floor(rr() * xs.length)];
    return rr;
  }
  // Opciones distintas: la correcta primero; los distractores que repiten un texto (o no son números) se descartan.
  function opciones(correcta, distractores, fmt) {
    const vistos = new Set([fmt(correcta)]);
    const ops = [{ id: 'c', texto: fmt(correcta), correcta: true }];
    for (const x of distractores) {
      if (!x || x.valor === null || x.valor === undefined) continue;
      if (x.valor && x.valor.ex && !(Ex.val(x.valor.ex) > 0)) continue;
      const txt = fmt(x.valor);
      if (vistos.has(txt)) continue;
      vistos.add(txt);
      ops.push({ id: x.id, texto: txt, error: x.error, siFuera: x.siFuera });
    }
    return ops.slice(0, 4);
  }
  // «Ahora tú» no repite un ejemplo ni la predicción de su idea (lección 8 de la Etapa 5): si un caso sale con los mismos
  // números en el enunciado, se arma otro con otro azar.
  const firma = t => (Kit.plano(t).replace(/\u00a0/g, ' ').replace(' El dibujo no está a escala.', '').match(/\d+(?:,\d+)?/g) || []).sort().join('|');
  function sinRepetir(caso, sem, idea) {
    const previos = new Set((idea.ejemplos || []).map(e => firma(e.enunciado)).concat([firma(idea.predice.pregunta)]));
    for (let i = 0; i < 60; i++) { const c = conCuatro(caso, azar(sem + 17 + i * 7919)); const k = firma(c.pregunta); if (k === '' || !previos.has(k)) return c; }
    throw new Error(`${caso.name}: no salió un caso distinto de los ejemplos`);
  }
  // Cuatro opciones siempre: si un caso sale con menos, se arma otro con el mismo azar.
  function conCuatro(caso, rr) {
    for (let i = 0; i < 80; i++) { const c = caso(rr); if (c.opciones.length >= 4) return c; }
    throw new Error(`${caso.name}: no salieron cuatro opciones distintas`);
  }

  // ---------- Números exactos: a + b√2 + c√3 + e√6, con coeficientes racionales ----------
  // Los lados de los notables y sus razones son de esta forma; así cada respuesta y cada distractor salen exactos.
  const Ex = (() => {
    const RS = [1, 2, 3, 6];
    const q = (n, d = 1) => { if (d < 0) { n = -n; d = -d; } const m = gcd(n, d) || 1; return [n / m, d / m]; };
    const qs = (a, b) => q(a[0] * b[1] + b[0] * a[1], a[1] * b[1]), qm = (a, b) => q(a[0] * b[0], a[1] * b[1]);
    const cero = () => ({ 1: [0, 1], 2: [0, 1], 3: [0, 1], 6: [0, 1] });
    const de = (n, d = 1, r = 1) => { const x = cero(); x[r] = q(n, d); return x; };
    const suma = (a, b) => { const x = cero(); for (const r of RS) x[r] = qs(a[r], b[r]); return x; };
    const neg = a => { const x = cero(); for (const r of RS) x[r] = [-a[r][0], a[r][1]]; return x; };
    const resta = (a, b) => suma(a, neg(b));
    // √r · √s = k√t
    const MR = { '1,1': [1, 1], '1,2': [1, 2], '1,3': [1, 3], '1,6': [1, 6], '2,2': [2, 1], '2,3': [1, 6], '2,6': [2, 3], '3,3': [3, 1], '3,6': [3, 2], '6,6': [6, 1] };
    const por = (a, b) => {
      let x = cero();
      for (const r of RS) for (const s of RS) {
        if (!a[r][0] || !b[s][0]) continue;
        const [k, t] = MR[[Math.min(r, s), Math.max(r, s)].join(',')];
        x[t] = qs(x[t], qm(qm(a[r], b[s]), [k, 1]));
      }
      return x;
    };
    const terminos = a => RS.filter(r => a[r][0]);
    // División entre un número de un solo término (c√r): multiplicar por √r/(c·r).
    // y entre a + b√r (dos términos, uno racional): por (a − b√r)/(a² − r·b²).
    const entre = (a, b) => {
      const t = terminos(b);
      if (t.length === 1) { const r = t[0], [n, d] = b[r]; return por(a, de(d, n * r, r)); }
      if (t.length === 2 && t[0] === 1) {
        const r = t[1], A = b[1], B = b[r], conj = suma(de(A[0], A[1]), de(-B[0], B[1], r));
        const den = qs(qm(A, A), [-r * B[0] * B[0], B[1] * B[1]]);
        return por(por(a, conj), de(den[1], den[0]));
      }
      throw new Error('Ex.entre: divisor no soportado');
    };
    const val = a => RS.reduce((s, r) => s + a[r][0] / a[r][1] * Math.sqrt(r), 0);
    const exacto = a => terminos(a).every(r => r === 1);
    // Texto: «3√3», «20√3/3», «5 + 5√3», «(3 + √3)/2».
    function txt(a) {
      // Primero un término positivo, si hay: «300√3 − 300», no «−300 + 300√3».
      const t0 = terminos(a), pos = t0.findIndex(r => a[r][0] > 0), t = pos > 0 ? [t0[pos]].concat(t0.filter((r, i) => i !== pos)) : t0;
      if (!t.length) return '0';
      const D = t.reduce((m, r) => m * a[r][1] / gcd(m, a[r][1]), 1);
      const parte = (n, r) => `${r === 1 ? Math.abs(n) : Math.abs(n) === 1 ? '' : Math.abs(n)}${r === 1 ? '' : '√' + r}`;
      let s = '';
      t.forEach((r, i) => { const n = a[r][0] * D / a[r][1]; s += i === 0 ? (n < 0 ? '−' : '') + parte(n, r) : (n < 0 ? ' − ' : ' + ') + parte(n, r); });
      return D === 1 ? s : t.length > 1 ? `(${s})/${D}` : `${s}/${D}`;
    }
    const igual = (a, b) => RS.every(r => a[r][0] * b[r][1] === b[r][0] * a[r][1]);
    return { de, suma, resta, por, entre, val, txt, exacto, igual, cero };
  })();
  const E = (n, d = 1, r = 1) => Ex.de(n, d, r);
  // Un largo exacto con su unidad y, si no es racional, su valor con «≈»: «3√3 m ≈ 5,2 m».
  // Un racional va con decimales solo si es exacto con 3 cifras o menos («6,125»); si no («49/12»), con su fracción y su
  // valor con «≈» (cierre, 19 nov: «14 · 7/24 = 4,083 m» y la alternativa «4,08 m» eran redondeos sin «≈»).
  const decExacto = x => Ex.exacto(x) && Math.abs(Math.round(Ex.val(x) * 1000) - Ex.val(x) * 1000) < 1e-6;
  const largo = (x, u = 'm') => (decExacto(x) ? `${f(Ex.val(x), 3)} ${u}` : `${Ex.txt(x)} ${u} ≈ ${f(Ex.val(x))} ${u}`);
  // Exacto: con raíz como «20√3/3»; un racional, con decimales («6,125»), como en la respuesta.
  const exTxt = (x, u) => `${decExacto(x) ? f(Ex.val(x), 3) : Ex.txt(x)}${u ? ' ' + u : ''}`;

  // ---------- Los triángulos notables (lados opuesto, adyacente e hipotenusa) ----------
  const R3 = E(1, 1, 3), R2 = E(1, 1, 2);
  const NOT = {
    30: { op: E(1), ad: R3, hip: E(2) }, 45: { op: E(1), ad: E(1), hip: R2 }, 60: { op: R3, ad: E(1), hip: E(2) },
    37: { op: E(3), ad: E(4), hip: E(5) }, 53: { op: E(4), ad: E(3), hip: E(5) }, 16: { op: E(7), ad: E(24), hip: E(25) }, 74: { op: E(24), ad: E(7), hip: E(25) },
  };
  const CONV = g => g === 37 || g === 53 || g === 16 || g === 74;
  // Una razón como número exacto: sen = op/hip, cos = ad/hip, tan = op/ad, cot = ad/op, sec = hip/ad, csc = hip/op.
  const PARTES = { sen: ['op', 'hip'], cos: ['ad', 'hip'], tan: ['op', 'ad'], cot: ['ad', 'op'], sec: ['hip', 'ad'], csc: ['hip', 'op'] };
  const razon = (rz, g) => { const [a, b] = PARTES[rz]; return Ex.entre(NOT[g][a], NOT[g][b]); };
  // Valores de una razón de g°, como texto: «√3/2», «3/5».
  const rzTxt = (rz, g) => Ex.txt(razon(rz, g));
  // La línea de datos con los valores que se dan de g° (las razones pedidas, en el orden pedido).
  const conv = '(convención del examen)';
  function valores(g, rzs) {
    const partes = rzs.map(rz => junto(`${rz} ${g}° = ${rzTxt(rz, g)}`));
    const out = [];
    partes.forEach((p, i) => { if (i) out.push(i === partes.length - 1 ? ' y ' : ', '); out.push(p); });
    if (CONV(g)) out.push(' ', junto(conv));
    out.push('.');
    return out;
  }

  // ---------- Figuras (pieza trig-vista) ----------
  const VI = 'trig-vista';
  const fig = (datos, estado = {}) => ({ pieza: VI, datos, estado });
  const pol = (L, g) => [L * Math.cos(g * RAD), L * Math.sin(g * RAD)];
  // Un ángulo que se pide se dibuja con otra abertura, lejos de la suya (lección de Longitud de arco).
  const NO_ESC = ' El dibujo no está a escala.';
  const otroAngulo = g => (Math.abs(g - 60) >= 20 ? 60 : 30);
  // En los ejercicios (Predice, ejemplos, «Así se resuelve» y «Ahora tú») el triángulo se dibuja con otra abertura, del
  // mismo lado de 45° (el cateto mayor sigue siendo el mayor), para que lo pedido no se pueda medir con una regla; el
  // enunciado dice «El dibujo no está a escala» (nota de la sesión, 19 nov: la pita de Predice dejaba medir h/H ≈ 0,6).
  // Solo el juego, «Lee» y la regla van a escala.
  const DIB = g => (g === 45 ? 36 : g < 45 ? (g <= 20 ? g + 11 : g - 10) : (g >= 70 ? g - 11 : g + 10));
  const abre = (g, o) => (o && o.escala ? g : DIB(g));
  // El ángulo de verdad de un notable (37° es atan(3/4)), para comprobar que lo pedido no se mida en el dibujo.
  const A0 = g => (NOT[g] ? Math.atan2(Ex.val(NOT[g].op), Ex.val(NOT[g].ad)) : g * RAD);
  // Dos ángulos hacia la misma punta (idea 4), fuera de escala: el mayor no se dibuja más empinado que su valor menos 8°
  // (desde 48°), y el menor queda por lo menos 12° más abajo (cierre, 19 nov: 60° dibujado de 70° dejaba su vértice pegado
  // al pie y su rótulo bajo el suelo; 16° y 37° se dibujaban los dos de 27°, en el mismo lugar).
  const dibPar = (ga, gb, o) => {
    if (o && o.escala) return [ga, gb];
    if (ga === gb) return [DIB(ga), DIB(gb)];
    const b = gb > 45 ? Math.max(48, gb - 8) : DIB(gb);
    return [Math.min(DIB(ga), b - 12), b];
  };
  // Triángulo de examen sin suelo: el recto en C, θ en A (abajo a la izquierda), B arriba. rot: rótulos de co, ca, h, t y de
  // los vértices; rol de cada lado (CO, CA, H) para la prueba de colores.
  function triFig(co, ca, rot = {}, o = {}) {
    if (!o.escala) { const L = Math.hypot(co, ca), g = DIB(Math.round(Math.atan2(co, ca) * GRA)); co = L * Math.sin(g * RAD); ca = L * Math.cos(g * RAD); }
    const A = [0, 0], C = [ca, 0], B = [ca, co];
    const lados = [
      // Solo un lado con su medida (o su nombre) lleva color; sin rótulo o pedido («?»), en tinta (lector A, 19 nov).
      { de: A, a: C, color: rot.ca === '?' || rot.ca === undefined ? null : 'i', texto: rot.ca, lado: -1, rol: 'CA' },
      { de: C, a: B, color: rot.co === '?' || rot.co === undefined ? null : 'o', texto: rot.co, lado: -1, rol: 'CO' },
      { de: A, a: B, texto: rot.h, lado: 1, rol: 'H' },
    ];
    return { suelo: false, lados: lados.concat(o.lados || []), angulos: [{ en: A, de: C, a: B, texto: rot.t, ref: true }].concat(o.angulos || []), rectos: [{ en: C, de: A, a: B }].concat(o.rectos || []),
      nombres: o.nombres };
  }

  // ====================================================================================================================
  // Idea 1: la hipotenusa y un ángulo
  // ====================================================================================================================
  // Objeto de la primera pantalla: una cometa en la pampa, con la pita amarrada a una estaca (la pita es la hipotenusa).
  // Cambia: el ángulo θ de la pita con el suelo y el largo H de la pita. · Permanece: la estaca y el suelo. · Progresa: la
  // altura de la cometa, H · sen θ. · Se reserva: el suelo hasta debajo de la cometa (la predicción: el adyacente, con el
  // coseno). · Debe verse: el cateto que se busca es la hipotenusa por una razón; se multiplica.
  // Errores: TR9 elige la otra razón; RES-DIVIDE divide la hipotenusa entre la razón; RES-IGUAL toma la hipotenusa por el
  // cateto; RES-SIN-H suma solo los catetos en un perímetro; RES-UN-SENO usa el seno para los dos catetos; RES-PROY da una
  // proyección por la altura (todas hipótesis, salvo TR9).
  const cometa = (Hv, g, rot = {}, o = {}) => {
    const [x, y] = pol(Hv, abre(g, o));
    return {
      marco: o.marco, objetos: [{ tipo: 'estaca', x: 0 }, { tipo: 'cometa', x, y }],
      lados: [
        { de: [0, 0], a: [x, y], texto: rot.H, lado: 1, rol: 'H' },
        { de: [x, 0], a: [x, y], como: 'punteada', color: o.colH !== undefined ? o.colH : rot.h === '?' ? null : 'o', texto: rot.h, lado: 1, rol: 'CO' },
      ].concat(rot.d !== undefined ? [{ de: [0, 0], a: [x, 0], como: 'cota', color: o.colD !== undefined ? o.colD : rot.d === '?' ? null : 'i', texto: rot.d, lado: -1, sep: 12, rol: 'CA' }] : []),
      angulos: [{ en: [0, 0], de: [1, 0], a: [x, y], texto: rot.t, ref: true }],
      rectos: [{ en: [x, 0], de: [0, 0], a: [x, y] }],
    };
  };
  // Escalera apoyada en una pared (la casa a la derecha): el pie a la izquierda, la punta en la pared.
  const escalera = (Hv, g, rot = {}, o = {}) => {
    const [x, y] = pol(Hv, abre(g, o)), desde = o.desdeArriba;
    return {
      objetos: [{ tipo: 'edificio', x, h: y * 1.18, ancho: Math.max(1.2, Hv * 0.35), lado: 1, liso: true }, { tipo: 'escalera', de: [0, 0], a: [x, y] }],
      lados: [
        { de: [0, 0], a: [x, y], como: 'vista', texto: rot.H, lado: 1, rol: 'H' },
      ].concat(rot.h !== undefined ? [{ de: [x, 0], a: [x, y], como: 'cota', color: rot.h === '?' ? null : desde ? 'i' : 'o', texto: rot.h, lado: -1, sep: 10, rol: desde ? 'CA' : 'CO' }] : [])
        .concat(rot.d !== undefined ? [{ de: [0, 0], a: [x, 0], como: 'cota', color: rot.d === '?' ? null : desde ? 'o' : 'i', texto: rot.d, lado: -1, sep: 12, rol: desde ? 'CO' : 'CA' }] : []),
      angulos: [desde ? { en: [x, y], de: [x, 0], a: [0, 0], texto: rot.t, ref: true } : { en: [0, 0], de: [1, 0], a: [x, y], texto: rot.t, ref: true }],
      rectos: [{ en: [x, 0], de: [0, 0], a: [x, y] }],
    };
  };
  // Tobogán del parque: la bajada (hipotenusa) va de lo alto de la escalerita hasta el suelo, a la derecha.
  const tobogan = (Hv, g, rot = {}, o = {}) => {
    const [x, y] = pol(Hv, abre(g, o));
    return {
      objetos: [{ tipo: 'tobogan', x: 0, h: y, hasta: x, lado: 1 }],
      lados: [
        { de: [0, y], a: [x, 0], texto: rot.H, lado: 1, rol: 'H' },
      ].concat(rot.h !== undefined ? [{ de: [0, 0], a: [0, y], como: 'cota', color: rot.h === '?' ? null : 'o', texto: rot.h, lado: 1, sep: 14, rol: 'CO' }] : [])
        .concat(rot.d !== undefined ? [{ de: [0, 0], a: [x, 0], como: 'cota', color: rot.d === '?' ? null : 'i', texto: rot.d, lado: -1, sep: 12, rol: 'CA' }] : []),
      angulos: [{ en: [x, 0], de: [0, 0], a: [0, y], texto: rot.t, ref: true }],
      rectos: [{ en: [0, 0], de: [1, 0], a: [0, 1] }],
    };
  };
  // Poste (o antena) con su cable a una estaca, a la derecha; rot: H (el cable), h (el poste), d (el suelo), t (el ángulo).
  const posteCable = (Hv, g, rot = {}, o = {}) => {
    const [x, y] = pol(Hv, abre(g, o));
    return { objetos: [{ tipo: o.antena ? 'antena' : 'poste', x: 0, h: y }, { tipo: 'estaca', x }],
      lados: [{ de: [0, y], a: [x, 0], texto: rot.H, lado: 1, rol: 'H' }]
        .concat(rot.h !== undefined ? [{ de: [0, 0], a: [0, y], como: 'cota', color: rot.h === '?' ? null : 'o', texto: rot.h, lado: 1, sep: 14, rol: 'CO' }] : [])
        .concat(rot.d !== undefined ? [{ de: [0, 0], a: [x, 0], como: 'cota', color: rot.d === '?' ? null : 'i', texto: rot.d, lado: -1, sep: 12, rol: 'CA' }] : []),
      angulos: [{ en: [x, 0], de: [0, 0], a: [0, y], texto: rot.t, ref: true }], rectos: [{ en: [0, 0], de: [1, 0], a: [0, 1] }], marco: o.marco };
  };
  // La tirolesa del ejemplo 15 (los tramos secos, tampoco a escala).
  const tirolesa = () => {
    const [x, y] = pol(50, DIB(16));
    return { agua: [6, 39], objetos: [{ tipo: 'edificio', x: 0, h: y, ancho: 3, lado: -1 }, { tipo: 'estaca', x }],
      lados: [{ de: [0, y], a: [x, 0], texto: '50 m', lado: 1, rol: 'H' }, { de: [0, 0], a: [6, 0], como: 'cota', texto: '6 m', lado: -1, sep: 12 }, { de: [39, 0], a: [x, 0], como: 'cota', texto: '12 m', lado: -1, sep: 12 }, { de: [6, 0], a: [39, 0], como: 'cota', texto: '?', lado: 1, sep: 6 }],
      angulos: [{ en: [x, 0], de: [0, 0], a: [0, y], texto: '16°', ref: true }] };
  };
  const D1 = {
    rz: [junto(['sen θ = ', CO, '/', HH]), ' y ', junto(['cos θ = ', CA, '/', HH]), '.'],
    regla: [junto([CO, ' = H · sen θ']), ' y ', junto([CA, ' = H · cos θ']), ', con los catetos nombrados desde θ.'],
    pit: 'Pitágoras: la hipotenusa al cuadrado es la suma de los catetos al cuadrado.',
    area: ['Área de un triángulo rectángulo: ', frac([CO, ' · ', CA], '2'), '.'],
    cm: '1 m = 100 cm.',
    alturaCH: 'CH es la altura sobre la hipotenusa: forma ángulo recto con AB.',
  };
  const v = (g, rzs = ['sen', 'cos']) => valores(g, rzs);
  // Ejemplos resueltos de la idea 1 (molde §3). Cuentas rehechas con un script aparte que no usa este archivo (scratchpad
  // e7-trigonometria/cuentas-ejemplos.js): 6·√3/2; 4·1/2; 4·1/2 (tobogán); 30·√2/2; 10·3/5; 20·1/2 + 20·√3/2; 12·√3/2 − 12·1/2;
  // 2,5·4/5; (6 · 6√3)/2; 5·cos 37° desde la pared; a·cos θ·sen θ; 3·(30 + 40 + 50); 10·4/5 − 10·3/5; 2(a sen θ + a cos θ);
  // 50·24/25 − 6 − 12, y el valor de cada alternativa equivocada.
  // La figura muestra el planteamiento: lo que se pide va con «?» en tinta o no se dibuja.
  const ALT1 = {
    ch: ['a sen θ cos θ', 'a sen θ', 'a sen θ + a cos θ', 'a sen² θ', 'a cos² θ'],
    cerco: ['120 m', '360 m', '210 m', '330 m', '450 m'],
    resbala: ['14 m', '8 m', '2 m', '6 m', '1 m'],
    marco: ['a(sen θ + cos θ)', '4a sen θ', 'a(1 + sen θ + cos θ)', '2a(sen θ + cos θ)', '2a(tan θ + 1)'],
    rio: ['48 m', '32 m', '36 m', '42 m', '30 m'],
  };
  const letra = (alts, alt) => { const k = alts.indexOf(alt); if (k < 0) throw new Error(`«${alt}» no es alternativa`); return neg('ABCDE'[k]); };
  const EJEMPLOS_1 = [
    { nivel: 1, titulo: 'La escalera en la pared', figura: fig(escalera(6, 60, { H: '6 m', t: '60°', h: '?' })),
      enunciado: jN('Una escalera de 6 m está apoyada en una pared y forma 60° con el piso. ¿A qué altura de la pared llega su punta?' + NO_ESC),
      datos: [D1.regla, v(60)],
      solucion: [{ texto: ['Desde 60°, la pared queda enfrente: es el opuesto. La escalera es la hipotenusa.'], ecuacion: junto([CO, ' = 6 · sen 60° = 6 · ', frac('√3', '2'), ' = ', dO('3√3 m'), ' ≈ ', dO('5,2 m')]) }],
      respuesta: [dO('3√3 m'), ' ≈ ', dO('5,2 m')] },
    { nivel: 1, titulo: 'El pie de la escalera', figura: fig(escalera(4, 60, { H: '4 m', t: '60°', d: '?' })),
      enunciado: jN('Una escalera de 4 m forma 60° con el piso. ¿A qué distancia de la pared está su pie?' + NO_ESC),
      datos: [D1.regla, v(60)],
      solucion: [{ texto: ['El piso toca a los 60°: es el adyacente. Se multiplica la escalera por el coseno.'], ecuacion: junto([CA, ' = 4 · cos 60° = 4 · ', frac('1', '2'), ' = ', dI('2 m')]) }],
      respuesta: [dI('2 m')] },
    { nivel: 1, titulo: 'El tobogán del parque', figura: fig(tobogan(4, 30, { H: '4 m', t: '30°', h: '?' })),
      enunciado: jN('La bajada de un tobogán mide 4 m y forma 30° con el suelo. ¿A qué altura empieza?' + NO_ESC),
      datos: [D1.regla, v(30)],
      solucion: [{ texto: ['Desde 30° (abajo), la altura queda enfrente: el opuesto.'], ecuacion: junto([CO, ' = 4 · sen 30° = 4 · ', frac('1', '2'), ' = ', dO('2 m')]) }],
      respuesta: [dO('2 m')] },
    { nivel: 1, titulo: 'Una cometa a 45°', figura: fig(cometa(30, 45, { H: '30 m', t: '45°', h: '?' })),
      enunciado: jN('La pita de una cometa mide 30 m, está bien tensa y forma 45° con el suelo. ¿A qué altura vuela la cometa?' + NO_ESC),
      datos: [D1.regla, v(45)],
      solucion: [{ texto: ['La altura es el opuesto a 45°; la pita, la hipotenusa.'], ecuacion: junto([CO, ' = 30 · sen 45° = 30 · ', frac('√2', '2'), ' = ', dO('15√2 m'), ' ≈ ', dO('21,21 m')]) }],
      respuesta: [dO('15√2 m'), ' ≈ ', dO('21,21 m')] },
    { nivel: 1, titulo: 'Con 37°', figura: fig(triFig(6, 8, { h: '10 cm', t: '37°', co: '?' })),
      enunciado: jN('La hipotenusa de un triángulo rectángulo mide 10 cm y uno de sus ángulos agudos, 37°. ¿Cuánto mide el cateto opuesto a 37°?' + NO_ESC),
      datos: [D1.regla, v(37)],
      solucion: [{ texto: ['Opuesto: hipotenusa por el seno, con la convención del examen.'], ecuacion: junto([CO, ' = 10 · sen 37° = 10 · ', frac('3', '5'), ' = ', dO('6 cm')]) }],
      respuesta: [dO('6 cm')] },
    { nivel: 2, titulo: 'Los dos catetos', figura: fig(triFig(10, 10 * Math.sqrt(3), { h: '20 cm', t: '30°', co: '?', ca: '?' })),
      enunciado: jN('La hipotenusa de un triángulo rectángulo mide 20 cm y uno de sus ángulos, 30°. ¿Cuánto suman sus dos catetos?' + NO_ESC),
      datos: [D1.regla, v(30)],
      solucion: [
        { texto: ['Cada cateto, con su razón:'], ecuacion: [junto([CO, ' = 20 · ', frac('1', '2'), ' = ', dO('10')]), SEP, junto([CA, ' = 20 · ', frac('√3', '2'), ' = ', dI('10√3')])] },
        { texto: ['La suma, con √3 ≈ 1,732:'], ecuacion: junto([dO('10'), ' + ', dI('10√3'), ' ≈ 27,32 cm']) },
      ],
      respuesta: ['10 + 10√3 cm ≈ 27,32 cm'] },
    { nivel: 2, titulo: 'El poste y su cable', figura: fig(posteCable(12, 60, { H: '12 m', t: '60°', h: '?', d: '?' })),
      enunciado: jN('Un cable de 12 m va de la punta de un poste a una estaca y forma 60° con el suelo. ¿Cuánto más mide el poste que el suelo hasta la estaca?' + NO_ESC),
      datos: [D1.regla, v(60)],
      solucion: [
        { texto: ['Desde 60°, el poste es el opuesto y el suelo, el adyacente:'], ecuacion: [junto([CO, ' = 12 · ', frac('√3', '2'), ' = ', dO('6√3')]), SEP, junto([CA, ' = 12 · ', frac('1', '2'), ' = ', dI('6')])] },
        { texto: ['La diferencia:'], ecuacion: junto([dO('6√3'), ' − ', dI('6'), ' ≈ 10,39 − 6 = 4,39 m']) },
      ],
      respuesta: ['6√3 − 6 m ≈ 4,39 m'] },
    { nivel: 2, titulo: 'Centímetros y metros', figura: fig(escalera(2.5, 53, { H: '250 cm', t: '53°', h: '?' })),
      enunciado: jN('Una escalera de 250 cm forma 53° con el piso. ¿A cuántos metros del piso llega su punta?' + NO_ESC),
      datos: [D1.regla, v(53), D1.cm],
      solucion: [
        { texto: ['Primero, en metros: 250 cm son 2,5 m.'] },
        { texto: ['La pared es el opuesto a 53°:'], ecuacion: junto([CO, ' = 2,5 · ', frac('4', '5'), ' = ', dO('2 m')]) },
      ],
      respuesta: [dO('2 m')] },
    { nivel: 2, titulo: 'El área de la escuadra', figura: fig(triFig(6, 6 * Math.sqrt(3), { h: '12 cm', t: '30°' })),
      enunciado: jN('El lado más largo de una escuadra de dibujo mide 12 cm y su ángulo más chico, 30°. ¿Cuánto mide su área?' + NO_ESC),
      datos: [D1.regla, v(30), D1.area],
      solucion: [
        { texto: ['El lado más largo es la hipotenusa. Los catetos:'], ecuacion: [junto([CO, ' = 12 · ', frac('1', '2'), ' = ', dO('6')]), SEP, junto([CA, ' = 12 · ', frac('√3', '2'), ' = ', dI('6√3')])] },
        { texto: ['El área es la mitad del producto de los catetos:'], ecuacion: junto([frac([dO('6'), ' · ', dI('6√3')], '2'), ' = 18√3 cm² ≈ 31,18 cm²']) },
      ],
      respuesta: ['18√3 cm² ≈ 31,18 cm²'] },
    // Aquí el ángulo dado está arriba, con la pared: desde él, la pared es el adyacente y el piso, el opuesto.
    { nivel: 2, titulo: 'El ángulo con la pared', figura: fig(escalera(5, 53, { H: '5 m', t: '37°', h: '?' }, { desdeArriba: true })),
      enunciado: jN('Una escalera de 5 m forma 37° con la pared en la que se apoya. ¿A qué altura de la pared llega?' + NO_ESC),
      datos: [D1.regla, v(37)],
      solucion: [
        { texto: ['El ángulo de 37° está arriba. Desde él, la pared lo toca: es el adyacente (el piso queda enfrente).'] },
        { texto: ['Adyacente: hipotenusa por el coseno.'], ecuacion: junto([CA, ' = 5 · cos 37° = 5 · ', frac('4', '5'), ' = ', dI('4 m')]) },
      ],
      respuesta: [dI('4 m')] },
    // Nivel 3, tipo examen, con cinco alternativas. Letras de las correctas: A, B, C, D, E. Donde la figura tiene puntos con
    // letras (la altura CH), las alternativas se nombran por su valor (decisión de la Etapa 3).
    { nivel: 3, titulo: 'La altura sobre la hipotenusa',
      figura: fig(triFig(3, 4, { h: 'a', t: 'θ' }, { escala: true,
        lados: [{ de: [4, 0], a: [2.56, 1.92], como: 'punteada', texto: '?', lado: -1 }], rectos: [{ en: [2.56, 1.92], de: [4, 0], a: [4, 3] }] })),
      enunciado: 'En un triángulo rectángulo, la hipotenusa mide a y uno de sus ángulos agudos mide θ. ¿Cuánto mide la altura trazada desde el ángulo recto hasta la hipotenusa?',
      alternativas: ALT1.ch,
      datos: [D1.regla, 'Esa altura forma con un cateto otro triángulo rectángulo, con el mismo ángulo θ.'],
      solucion: [
        { texto: ['En el triángulo grande, el cateto adyacente a θ es la hipotenusa por el coseno:'], ecuacion: junto([CA, ' = a cos θ']) },
        { texto: ['Ese cateto es la hipotenusa del triángulo chico, y la altura queda enfrente de θ: se multiplica por el seno.'], ecuacion: junto(['(a cos θ) · sen θ']) },
        { texto: ['a sen θ es un cateto; a sen θ + a cos θ suma los dos; a sen² θ y a cos² θ son los pedazos de la hipotenusa.'] },
      ],
      respuesta: [letra(ALT1.ch, 'a sen θ cos θ'), ', a sen θ cos θ'] },
    { nivel: 3, titulo: 'El cerco del terreno', figura: fig(triFig(30, 40, { h: '50 m', t: '37°' })),
      enunciado: jN('Un terreno tiene forma de triángulo rectángulo: su lado mayor mide 50 m y uno de sus ángulos, 37°. Se cerca con tres vueltas de alambre. ¿Cuánto alambre se usa?' + NO_ESC),
      alternativas: ALT1.cerco,
      datos: [D1.regla, v(37)],
      solucion: [
        { texto: ['El lado mayor es la hipotenusa. Los catetos:'], ecuacion: [junto([CO, ' = 50 · ', frac('3', '5'), ' = ', dO('30')]), SEP, junto([CA, ' = 50 · ', frac('4', '5'), ' = ', dI('40')])] },
        { texto: ['Una vuelta es el perímetro; tres vueltas, el triple:'], ecuacion: junto(['3 · (30 + 40 + 50) = 3 · 120 = 360 m']) },
        { texto: ['120 m es una sola vuelta; 210 m no cuenta la hipotenusa; 330 m usa el seno para los dos catetos; 450 m toma los tres lados por 50 m.'] },
      ],
      respuesta: [letra(ALT1.cerco, '360 m'), ', 360 m'] },
    { nivel: 3, titulo: 'La escalera que resbala', figura: fig((() => { const [x1, y1] = pol(10, DIB(53)), [x2, y2] = pol(10, DIB(37)), X = 10;
        return { objetos: [{ tipo: 'edificio', x: X, h: y1 * 1.15, ancho: 3, lado: 1, liso: true }, { tipo: 'escalera', de: [X - x1, 0], a: [X, y1] }, { tipo: 'escalera', de: [X - x2, 0], a: [X, y2], tenue: true }],
          lados: [{ de: [X, y2], a: [X, y1], como: 'cota', texto: '?', lado: -1, sep: 16 }],
          angulos: [{ en: [X - x1, 0], de: [X, 0], a: [X, y1], texto: '53°', ref: true }, { en: [X - x2, 0], de: [X, 0], a: [X, y2], texto: '37°' }], rectos: [{ en: [X, 0], de: [0, 0], a: [X, y1] }] }; })()),
      enunciado: jN('Una escalera de 10 m apoyada en una pared forma 53° con el piso. Su pie resbala y ahora forma 37° con el piso. ¿Cuánto bajó su punta?' + NO_ESC),
      alternativas: ALT1.resbala,
      datos: [D1.regla, v(53), v(37)],
      solucion: [
        { texto: ['Antes y después, la altura es el opuesto al ángulo con el piso:'], ecuacion: [junto(['antes: 10 · ', frac('4', '5'), ' = ', dO('8 m')]), SEP, junto(['después: 10 · ', frac('3', '5'), ' = ', dO('6 m')])] },
        { texto: ['Bajó la diferencia:'], ecuacion: junto([dO('8 m'), ' − ', dO('6 m'), ' = ', dO('2 m')]) },
        { texto: ['8 m es la altura de antes y 6 m la de después; 14 m las suma; 1 m divide entre 2 la diferencia.'] },
      ],
      respuesta: [letra(ALT1.resbala, '2 m'), ', ', dO('2 m')] },
    { nivel: 3, titulo: 'El marco con su diagonal', figura: fig({ suelo: false, lados: [{ de: [0, 0], a: [4, 0], texto: '?', lado: -1, rol: 'CA' }, { de: [4, 0], a: [4, 3], texto: '?', lado: -1, rol: 'CO' }, { de: [0, 0], a: [4, 3], texto: 'a', lado: 1, rol: 'H' }, { de: [4, 3], a: [0, 3] }, { de: [0, 3], a: [0, 0] }],
      angulos: [{ en: [0, 0], de: [4, 0], a: [4, 3], texto: 'θ', ref: true }], rectos: [{ en: [4, 0], de: [0, 0], a: [4, 3] }] }),
      enunciado: 'La diagonal de un marco rectangular mide a y forma un ángulo θ con su base. ¿Cuánto mide el perímetro del marco?',
      alternativas: ALT1.marco,
      datos: [D1.regla, 'Un rectángulo tiene sus lados opuestos iguales.'],
      solucion: [
        { texto: ['La diagonal es la hipotenusa del triángulo de abajo. La base y la altura son sus catetos desde θ:'], ecuacion: [junto([CA, ' = a cos θ']), SEP, junto([CO, ' = a sen θ'])] },
        { texto: ['El perímetro suma dos bases y dos alturas, 2a cos θ + 2a sen θ:'], ecuacion: junto(['perímetro = 2a(sen θ + cos θ)']) },
        { texto: ['a(sen θ + cos θ) es la mitad; a(1 + sen θ + cos θ), el triángulo; 4a sen θ, lados iguales; 2a(tan θ + 1), la diagonal como base.'] },
      ],
      respuesta: [letra(ALT1.marco, '2a(sen θ + cos θ)'), ', 2a(sen θ + cos θ)'] },
    { nivel: 3, titulo: 'La tirolesa sobre el río', figura: fig(tirolesa()),
      enunciado: jN('Una tirolesa de 50 m baja con 16° de inclinación sobre un río. Su torre está a 6 m de una orilla; su llegada, a 12 m de la otra. ¿Cuánto mide el río?' + NO_ESC),
      alternativas: ALT1.rio,
      datos: [D1.regla, v(16)],
      solucion: [
        { texto: ['La distancia por el suelo, de la torre a la llegada, es el adyacente a 16°:'], ecuacion: junto([CA, ' = 50 · ', frac('24', '25'), ' = ', dI('48 m')]) },
        { texto: ['Al suelo se le quitan los tramos secos de las dos orillas:'], ecuacion: junto(['48 − 6 − 12 = 30 m']) },
        { texto: ['48 m es todo el suelo; 36 m y 42 m quitan solo un tramo; 32 m toma la tirolesa de 50 m por el suelo.'] },
      ],
      respuesta: [letra(ALT1.rio, '30 m'), ', ', dI('30 m')] },
  ];

  // El juego de la cometa: la escala no cambia (el marco es el de la pita más larga con el ángulo más alto).
  const MARCO1 = [[0, 0], [52, 52]];
  const altoCometa = val => Ex.por(E(val.H), razon('sen', val.g));
  const cometaJ = val => cometa(val.H, val.g, { H: `H = ${val.H} m`, t: `θ = ${val.g}°`, h: `h = ${exTxt(altoCometa(val), 'm')}` }, { marco: MARCO1, escala: true });
  // Ejercicios de la idea 1: el lado que se pide va en tinta, con «?» (cabecera); el que se da, con su nombre y su color.
  const pedido = (rol, pide, txt) => (rol === pide ? '?' : txt);
  // «Así se resuelve»: la escalera en la pared o el tobogán (en «Ahora tú» van la cometa, el cable y el triángulo).
  const RES1 = [
    { obj: 'escalera', g: 60, Hs: [4, 6, 8], alto: 'la altura a la que llega su punta en la pared', suelo: 'la distancia de su pie a la pared', nom: 'escalera', frase: (H, g) => `Una escalera de ${H} m está apoyada en una pared y forma ${g}° con el piso.` },
    { obj: 'escalera', g: 53, Hs: [5, 10], alto: 'la altura a la que llega su punta en la pared', suelo: 'la distancia de su pie a la pared', nom: 'escalera', frase: (H, g) => `Una escalera de ${H} m está apoyada en una pared y forma ${g}° con el piso.` },
    { obj: 'tobogan', g: 30, Hs: [3, 5, 6], alto: 'la altura desde la que se baja', suelo: 'lo que avanza por el suelo', nom: 'bajada', frase: (H, g) => `La bajada de un tobogán mide ${H} m y forma ${g}° con el suelo.` },
    { obj: 'tobogan', g: 37, Hs: [5], alto: 'la altura desde la que se baja', suelo: 'lo que avanza por el suelo', nom: 'bajada', frase: (H, g) => `La bajada de un tobogán mide ${H} m y forma ${g}° con el suelo.` },
  ];
  // «Ahora tú», tipo 0: un cateto con la hipotenusa (la cometa, el cable de un poste o un triángulo de examen).
  const COSAS1 = [
    { obj: 'cometa', gs: [30, 37, 53, 60], Hs: g => (CONV(g) ? [25, 75] : [20, 30, 40, 50, 60]), u: 'm',   // 50 m con 37° es la predicción
      frase: (H, g, pide) => `La pita de una cometa mide ${H} m, está bien tensa y forma ${g}° con el suelo. ${pide === 'op' ? '¿A qué altura vuela la cometa?' : '¿A qué distancia de la estaca, por el suelo, está el punto justo debajo de la cometa?'}` },
    { obj: 'cable', gs: [53, 60], Hs: g => (CONV(g) ? [10, 15, 20] : [8, 10, 12, 16]), u: 'm',
      frase: (H, g, pide) => `Un cable de ${H} m va de la punta de un poste a una estaca y forma ${g}° con el suelo. ${pide === 'op' ? '¿Cuánto mide el poste?' : '¿A qué distancia del poste está la estaca?'}` },
    { obj: 'triangulo', gs: [30, 37, 53, 60, 16, 74], Hs: g => (g === 16 || g === 74 ? [25, 50] : CONV(g) ? [5, 15, 20] : [6, 8, 14, 18]), u: 'cm',
      frase: (H, g, pide) => `La hipotenusa de un triángulo rectángulo mide ${H} cm y uno de sus ángulos agudos, ${g}°. ¿Cuánto mide el cateto ${pide === 'op' ? 'opuesto' : 'adyacente'} a ${g}°?` },
  ];
  const figCaso1 = (obj, H, g, pide, u) => {
    const rotH = `${H} ${u}`, co = Ex.val(Ex.por(E(H), razon('sen', g))), ca = Ex.val(Ex.por(E(H), razon('cos', g)));
    if (obj === 'cometa') return fig(cometa(H, g, { H: rotH, t: `${g}°`, h: pide === 'op' ? '?' : undefined, d: pide === 'ad' ? '?' : undefined }, { colH: pide === 'op' ? null : 'o', colD: null }));
    if (obj === 'cable') return fig(posteCable(H, g, { H: rotH, t: `${g}°`, h: pide === 'op' ? '?' : undefined, d: pide === 'ad' ? '?' : undefined }));
    return fig(triFig(co, ca, { h: rotH, t: `${g}°`, co: pide === 'op' ? '?' : undefined, ca: pide === 'ad' ? '?' : undefined }));
  };
  function casoCateto(rr) {
    let c, g, H, pide;
    do {
      c = rr.uno(COSAS1); g = rr.uno(c.gs); H = rr.uno(c.Hs(g)); pide = rr.uno(['op', 'ad']);
    } while ((c.obj === 'triangulo' && g === 37 && H === 10) || (c.obj === 'cable' && g === 60 && H === 12) || (g === 30 && H === 20));   // los ejemplos «Con 37°», «El poste y su cable» y «Los dos catetos»
    const rz = pide === 'op' ? 'sen' : 'cos', otra = pide === 'op' ? 'cos' : 'sen', u = c.u;
    const ok = Ex.por(E(H), razon(rz, g)), mal = Ex.por(E(H), razon(otra, g)), div = Ex.entre(E(H), razon(rz, g));
    const lado = pide === 'op' ? 'opuesto' : 'adyacente';
    return {
      pregunta: jN(c.frase(H, g, pide) + NO_ESC),
      datos: [D1.regla, v(g)],
      dibujo: figCaso1(c.obj, H, g, pide, u),
      opciones: opciones({ ex: ok }, [
        { id: 'otra', valor: { ex: mal }, error: 'TR9', siFuera: `Multiplicar la hipotenusa por una razón está bien; pero el ${lado} va con el ${rz === 'sen' ? 'seno' : 'coseno'}.` },
        { id: 'divide', valor: { ex: div }, error: 'RES-DIVIDE', siFuera: `Usar ${rz} ${g}° está bien; pero un cateto es menor que la hipotenusa: se multiplica.` },
        { id: 'igual', valor: { ex: E(H) }, error: 'RES-IGUAL', siFuera: `Partir de los ${H} ${u} está bien; esa es la hipotenusa: falta multiplicarla por la razón.` },
      ], x => largo(x.ex, u)),
      solucion: { texto: `Desde ${g}°, el lado pedido es el ${lado}: hipotenusa por ${rz === 'sen' ? 'seno' : 'coseno'}.`,
        ecuacion: junto([pide === 'op' ? CO : CA, ` = ${H} · ${rz} ${g}° = ${H} · ${rzTxt(rz, g)} = `, pide === 'op' ? dO(exTxt(ok, u)) : dI(exTxt(ok, u))]) },
    };
  }
  // «Ahora tú», tipo 1: el perímetro con la hipotenusa y un ángulo (los dos catetos, cada uno con su razón).
  const COSAS1B = [
    { que: 'escuadra', gs: [30, 60, 45], Hs: [10, 14, 16, 18, 24], u: 'cm', frase: (H, g) => `El lado más largo de una escuadra de dibujo mide ${H} cm y uno de sus ángulos agudos, ${g}°. ¿Cuánto mide su perímetro?` },
    { que: 'terreno', gs: [37, 53], Hs: [20, 30, 40, 60, 80], u: 'm', frase: (H, g) => `Un terreno con forma de triángulo rectángulo tiene su lado mayor de ${H} m y uno de sus ángulos de ${g}°. ¿Cuánto mide su perímetro?` },
    { que: 'vela', gs: [16, 74], Hs: [25, 50], u: 'dm', frase: (H, g) => `La vela de un bote es un triángulo rectángulo: su lado mayor mide ${H} dm y uno de sus ángulos, ${g}°. ¿Cuánto mide su perímetro?` },
  ];
  function casoPerimetro(rr) {
    let c, g, H;
    do { c = rr.uno(COSAS1B); g = rr.uno(c.gs); H = rr.uno(c.Hs); } while (c.que === 'escuadra' && g === 30 && (H === 20 || H === 12));
    const co = Ex.por(E(H), razon('sen', g)), ca = Ex.por(E(H), razon('cos', g)), u = c.u;
    const P = Ex.suma(E(H), Ex.suma(co, ca));
    const fmt = x => largo(x.ex, u);
    return {
      pregunta: jN(c.frase(H, g) + NO_ESC),
      datos: [D1.regla, v(g), 'Perímetro: la suma de los tres lados.'],
      dibujo: fig(triFig(Ex.val(co), Ex.val(ca), { h: `${H} ${u}`, t: `${g}°` })),
      opciones: opciones({ ex: P }, [
        { id: 'sinH', valor: { ex: Ex.suma(co, ca) }, error: 'RES-SIN-H', siFuera: `Los dos catetos están bien; falta sumar la hipotenusa, ${H} ${u}.` },
        { id: 'unseno', valor: { ex: Ex.suma(E(H), Ex.suma(co, co)) }, error: 'RES-UN-SENO', siFuera: 'El opuesto está bien; el adyacente va con el coseno, no otra vez con el seno.' },
        { id: 'divide', valor: { ex: Ex.suma(E(H), Ex.suma(Ex.entre(E(H), razon('sen', g)), Ex.entre(E(H), razon('cos', g)))) }, error: 'RES-DIVIDE', siFuera: 'Seno y coseno son las razones; pero se multiplica: dividir da catetos más largos que la hipotenusa.' },
      ], fmt),
      solucion: { texto: 'Cada cateto es la hipotenusa por su razón; el perímetro suma los tres lados.',
        ecuacion: junto([`${H} + `, dO(exTxt(co)), ' + ', dI(exTxt(ca)), ` = ${exTxt(P, u)}`]) },
    };
  }
  // «Ahora tú», tipo 2 (nivel de examen, con letras): en el triángulo ABC, recto en C, con la altura CH sobre la
  // hipotenusa AB = a, los dos pedazos de la hipotenusa (AH y HB) o el perímetro. La altura CH es el ejemplo 11.
  const D1L = {
    ch: 'CH forma ángulo recto con AB: los triángulos ACH y CHB también son rectángulos.',
    agudos: 'Los dos ángulos agudos de un triángulo rectángulo suman 90°.',
  };
  const figLetras = (pide) => {
    const A = [0, 0], C = [4, 0], B = [4, 3], Hp = [2.56, 1.92];
    return fig({ suelo: false,
      lados: [{ de: A, a: C, color: 'i', lado: -1, rol: 'CA' }, { de: C, a: B, color: 'o', lado: -1, rol: 'CO' }, { de: A, a: B, texto: 'a', lado: 1, rol: 'H' }]
        .concat(pide === 'per' ? [] : [{ de: C, a: Hp, como: 'punteada' }, pide === 'AH' ? { de: A, a: Hp, como: 'cota', texto: '?', lado: 1, sep: 12 } : { de: Hp, a: B, como: 'cota', texto: '?', lado: 1, sep: 12 }]),
      angulos: [{ en: A, de: C, a: B, texto: 'θ', ref: true }], rectos: [{ en: C, de: A, a: B }].concat(pide === 'per' ? [] : [{ en: Hp, de: C, a: B }]),
      puntos: [{ en: A, texto: 'A', dir: [-1, 0.4] }, { en: C, texto: 'C', dir: [1, 0.5] }, { en: B, texto: 'B', dir: [1, -0.3] }].concat(pide === 'per' ? [] : [{ en: Hp, texto: 'H', dir: [-0.7, -1] }]) });
  };
  function casoLetras(rr) {
    const pide = rr.uno(['AH', 'HB', 'per']);
    if (pide === 'per') {
      return {
        pregunta: 'En el triángulo ABC, recto en C, la hipotenusa AB mide a y el ángulo en A mide θ. ¿Cuánto mide el perímetro del triángulo?',
        datos: [D1.regla],
        dibujo: figLetras('per'),
        opciones: opciones('a(1 + sen θ + cos θ)', [
          { id: 'sinH', valor: 'a(sen θ + cos θ)', error: 'RES-SIN-H', siFuera: 'Los catetos a sen θ y a cos θ están bien; falta sumar la hipotenusa, a.' },
          { id: 'unseno', valor: 'a(1 + 2 sen θ)', error: 'RES-UN-SENO', siFuera: 'El opuesto a sen θ está bien; el adyacente va con el coseno: a cos θ.' },
          { id: 'doble', valor: '2a(sen θ + cos θ)', error: 'RES-DOBLE', siFuera: 'Los catetos están bien; pero cada uno se cuenta una vez: eso sería un rectángulo.' },
        ], x => x),
        solucion: { texto: 'Desde θ: BC = a sen θ y AC = a cos θ. Se suman con la hipotenusa.', ecuacion: junto(['a + a sen θ + a cos θ = a(1 + sen θ + cos θ)']) },
      };
    }
    const AH = pide === 'AH';
    return {
      pregunta: `En el triángulo ABC, recto en C, la hipotenusa AB mide a y el ángulo en A mide θ. CH es la altura sobre la hipotenusa. ¿Cuánto mide ${AH ? 'AH' : 'HB'}?`,
      datos: [D1.regla, D1L.ch, D1L.agudos],
      dibujo: figLetras(pide),
      opciones: opciones(AH ? 'a cos² θ' : 'a sen² θ', [
        { id: 'paso', valor: AH ? 'a cos θ' : 'a sen θ', error: 'RES-UN-PASO', siFuera: `${AH ? 'AC = a cos θ' : 'BC = a sen θ'} está bien; ese es el cateto: falta el triángulo chico.` },
        { id: 'otro', valor: AH ? 'a sen² θ' : 'a cos² θ', error: 'RES-OTRO-PEDAZO', siFuera: `El camino de dos triángulos está bien; ese es el otro pedazo, ${AH ? 'HB' : 'AH'}.` },
        { id: 'altura', valor: 'a sen θ cos θ', error: 'RES-PROY', siFuera: 'Usar dos triángulos está bien; a sen θ cos θ es la altura CH, no un pedazo de AB.' },
      ], x => x),
      solucion: AH
        ? { texto: 'AC = a cos θ. En ACH, con el mismo θ en A, AH es el adyacente:', ecuacion: junto(['AH = (a cos θ) · cos θ = a cos² θ']) }
        : { texto: 'BC = a sen θ. En CHB, el ángulo en C también mide θ, y HB queda enfrente:', ecuacion: junto(['HB = (a sen θ) · sen θ = a sen² θ']) },
    };
  }

  const unLado = {
    id: 'un-lado-un-angulo',
    titulo: 'La hipotenusa y un ángulo',
    pregunta: '¿Cómo se hallan los catetos si conoces la hipotenusa y un ángulo?',
    temas: ['Resolver con un lado y un ángulo'],
    pieza: VI,
    aprendizaje: 'Con la hipotenusa H y un ángulo agudo θ, el opuesto mide H · sen θ y el adyacente, H · cos θ: se multiplica.',
    actividad: 'Soltar o recoger la pita de una cometa y cambiar su ángulo con el suelo.',
    // Lee: el objeto, «resolver» y los nombres de los lados desde θ. No dice qué razón da el suelo (la predicción).
    lee: {
      tarjetas: [
        { titulo: 'La cometa de la pampa', texto: 'En agosto, en la pampa, las cometas suben con el viento. La pita, bien tensa, va de una estaca a la cometa y arma un triángulo rectángulo con el suelo y la altura de la cometa.',
          pieza: VI, dibujo: { datos: cometa(40, 50, {}, { colH: null, escala: true }), estado: {} } },
        { titulo: 'Resolver un triángulo', texto: 'Resolver un triángulo rectángulo es hallar los lados y ángulos que faltan. Con un ángulo agudo y un lado ya está decidido todo: lo demás sale de las razones del tema anterior.' },
        { titulo: 'Los lados, desde θ', texto: ['Desde el ángulo θ de la pita con el suelo, la altura de la cometa queda enfrente: es el cateto opuesto, ', CO, '. El suelo toca a θ: es el adyacente, ', CA, '. La pita es la hipotenusa, H.'] },
        { titulo: 'Qué mirar al jugar', texto: 'Vas a soltar o recoger pita y a cambiar su ángulo. Mira qué parte de la pita es la altura de la cometa.' },
      ],
    },
    ejemplos: EJEMPLOS_1,
    juega: {
      pieza: VI,
      consigna: ['La pita tensa es la hipotenusa H; ', th, ' es su ángulo con el suelo y ', hh, ', la altura de la cometa.'],
      mision: {
        texto: 'Con 60 m de pita, haz que la cometa vuele a 30 m de altura.',
        logrado: val => val.H === 60 && val.g === 30,
        bien: 'Listo: 60 · sen 30° = 60 · 1/2 = 30 m. La altura es media pita.',
      },
      voz: '¿Qué parte de la pita es la altura?',
      leyenda: [
        { s: th, t: 'el ángulo de la pita con el suelo' },
        { s: 'H', t: 'la pita: la hipotenusa' },
        { s: hh, t: 'altura de la cometa: el opuesto a θ' },
        { s: 'estaca', t: 'donde se amarra la pita en el suelo' },
      ],
      controles: [
        { id: 'g', etiqueta: 'θ, ángulo de la pita', color: 'c-h', min: 30, max: 60, paso: 15, inicio: 45, unidad: '°', decimales: 0 },
        { id: 'H', etiqueta: 'H, la pita', min: 20, max: 60, paso: 10, inicio: 30, unidad: 'm', decimales: 0 },
      ],
      dibujo: val => ({ datos: cometaJ(val), estado: {} }),
      lectura: val => jN([hh, ` = ${val.H} · sen ${val.g}° = ${largo(altoCometa(val))}`]),
      minimo: 3,
    },
    predice: {
      pregunta: 'La pita de otra cometa mide 50 m y forma 37° con el suelo. ¿Cuánto mide el suelo desde la estaca hasta el punto justo debajo de la cometa?' + NO_ESC,
      datos: [v(37)],
      voz: 'El juego te dio la altura; ahora se pide otro lado.',
      opciones: [
        { id: 'c', texto: '40 m', correcta: true },
        { id: 'seno', texto: '30 m', error: 'TR9', siFuera: 'Multiplicar la pita por una razón está bien; pero el seno da la altura, el lado de enfrente.' },
        { id: 'divide', texto: '62,5 m', error: 'RES-DIVIDE', siFuera: 'Usar cos 37° está bien; pero la pita es la más larga: se multiplica, no se divide.' },
        { id: 'igual', texto: '50 m', error: 'RES-IGUAL', siFuera: 'El suelo y la pita salen de la estaca; pero la pita sube: el suelo es más corto.' },
      ],
      dibujo: { datos: cometa(50, 37, { H: 'H = 50 m', t: 'θ = 37°', d: '?' }, { colH: null, colD: null }), estado: {} },
      revelar: { datos: cometa(50, 37, { H: 'H = 50 m', t: 'θ = 37°', h: '30 m', d: '40 m' }), estado: {} },
      coincide: 'Coincide: el suelo toca al ángulo, es el adyacente: 50 · cos 37° = 40 m.',
      noCoincide: 'Revisemos: desde 37°, el suelo es el cateto adyacente, y lo da el coseno.',
    },
    mira: {
      pieza: VI,
      datos: cometa(50, 37, { H: 'H = 50 m', t: 'θ = 37°', d: [{ t: '?' }, { t: 'CA = 40 m', paso: 2 }], h: [{ t: '' }, { t: 'CO = 30 m', paso: 3 }] }),
      voz: 'Primero el nombre del lado; después, la razón.',
      pasos: [
        { estado: { paso: 0 }, texto: 'Desde 37°, el suelo toca al ángulo: es el cateto adyacente.', ecuacion: junto(['cos 37° = ', frac(CA, HH)]) },
        { estado: { paso: 1 }, texto: 'Se despeja CA: la H pasa al otro lado multiplicando.', ecuacion: junto([CA, ' = H · cos 37°']) },
        { estado: { paso: 2 }, texto: 'Se reemplaza la pita y el coseno.', ecuacion: junto([CA, ' = 50 · ', frac('4', '5'), ' = ', dI('40 m')]) },
        { estado: { paso: 3 }, texto: 'La altura, con el seno: es el lado de enfrente.', ecuacion: junto([CO, ' = 50 · ', frac('3', '5'), ' = ', dO('30 m')]) },
        { estado: { paso: 3 }, texto: 'Pitágoras lo confirma: los catetos con la pita.', ecuacion: junto(['30² + 40² = 900 + 1600 = 2500 = 50²']) },
      ],
    },
    regla: {
      texto: 'Con la hipotenusa y un ángulo agudo θ, cada cateto es la hipotenusa por una razón de θ: el opuesto, por el seno; el adyacente, por el coseno.',
      ecuacion: [junto([CO, ' = H · sen ', th]), SEP, junto([CA, ' = H · cos ', th])],
      condicion: 'θ agudo y los catetos nombrados desde θ. Sale de sen θ = CO/H y de cos θ = CA/H.',
      voz: 'El cateto es menor que la hipotenusa: por eso se multiplica.',
      dibujo: { pieza: VI, datos: triFig(3, 4, { h: 'H', t: 'θ', co: 'H · sen θ', ca: 'H · cos θ' }, { escala: true }), estado: {} },
    },
    // Así se resuelve: la escalera en la pared o el tobogán. «Ahora tú» pide otras cosas (la cometa, el cable, el
    // triángulo, el perímetro y el examen con letras).
    resuelve: {
      pieza: VI,
      generar(sem) {
        const rr = azar(sem + 900), c = RES1[sem % RES1.length], H = rr.uno(c.Hs), g = c.g, pide = rr.ent(0, 1) ? 'op' : 'ad';
        const rz = pide === 'op' ? 'sen' : 'cos', ok = Ex.por(E(H), razon(rz, g));
        const quien = pide === 'op' ? c.alto : c.suelo, rotDato = `${H} m`;
        const dib = todo => (c.obj === 'escalera'
          ? fig(escalera(H, g, { H: rotDato, t: `${g}°`, h: pide === 'op' ? (todo ? exTxt(ok, 'm') : '?') : undefined, d: pide === 'ad' ? (todo ? exTxt(ok, 'm') : '?') : undefined }))
          : fig(tobogan(H, g, { H: rotDato, t: `${g}°`, h: pide === 'op' ? (todo ? exTxt(ok, 'm') : '?') : undefined, d: pide === 'ad' ? (todo ? exTxt(ok, 'm') : '?') : undefined })));
        return {
          enunciado: jN(`${c.frase(H, g)} ¿Cuánto mide ${quien}?${NO_ESC}`),
          datos: [D1.regla, v(g)],
          dibujo: dib(false),
          pasos: [
            { tipo: 'pide', texto: [`Piden ${quien}.`] },
            { tipo: 'datos', texto: [`La ${c.nom} mide ${H} m: es la hipotenusa, el lado frente al ángulo recto. El ángulo es ${g}°.`] },
            { tipo: 'regla', texto: [`Desde ${g}°, el lado pedido ${pide === 'op' ? 'queda enfrente: es el opuesto' : 'toca al ángulo: es el adyacente'}. Con la hipotenusa, se multiplica por el ${rz === 'sen' ? 'seno' : 'coseno'}.`],
              ecuacion: junto([pide === 'op' ? CO : CA, ` = H · ${rz} θ`]) },
            { tipo: 'cuentas', texto: ['Se reemplaza:'], ecuacion: junto([pide === 'op' ? CO : CA, ` = ${H} · ${rzTxt(rz, g)} = `, pide === 'op' ? dO(largo(ok)) : dI(largo(ok))]), dibujo: dib(true) },
            { tipo: 'sentido', texto: [`Tiene sentido: ${f(Ex.val(ok))} m es menos que los ${H} m de la ${c.nom}, porque un cateto es menor que la hipotenusa.`] },
          ],
          respuesta: [pide === 'op' ? dO(largo(ok)) : dI(largo(ok))],
        };
      },
    },
    ahoraTu: {
      pieza: VI,
      voz: 'Nombra el lado desde el ángulo y elige su razón.',
      generar(sem) { return sinRepetir([casoCateto, casoPerimetro, casoLetras][sem % 3], sem, unLado); },
    },
  };

  // ====================================================================================================================
  // Idea 2: un cateto y un ángulo
  // ====================================================================================================================
  // Objeto de la primera pantalla: una antena con su cable tensor (la antena es el opuesto al ángulo del cable con el suelo).
  // Cambia: el ángulo θ del cable y el alto h de la antena. · Permanece: el suelo y la estaca. · Progresa: la distancia d
  // de la estaca al pie, h · cot θ. · Se reserva: el largo del cable (la predicción: la hipotenusa con un cateto, csc).
  // · Debe verse: el lado buscado es el conocido por la razón «buscado sobre conocido»; siempre se multiplica.
  // Errores: RES-MULTIPLICA multiplica el cateto por el seno o el coseno, como en la idea 1 (la hipotenusa sale menor que
  // un cateto); REC-INVERSA usa la razón al revés (el conocido arriba); TR9 elige una razón que no une esos lados;
  // RES-HIP da la hipotenusa cuando se pedía el otro cateto; RES-COMPLEMENTO nombra los lados desde el otro agudo;
  // RES-SIN-H y RES-UN-PASO dejan un lado fuera; RES-SUMA suma donde se pide la diferencia (todas hipótesis, salvo TR9).
  const D2 = {
    rz: [junto(['sen θ = ', CO, '/', HH]), ', ', junto(['cos θ = ', CA, '/', HH]), ' y ', junto(['tan θ = ', CO, '/', CA]), '.'],
    rzr: [junto(['cot θ = ', CA, '/', CO]), ', ', junto(['sec θ = ', HH, '/', CA]), ' y ', junto(['csc θ = ', HH, '/', CO]), '.'],
    regla: 'Lado buscado = lado conocido · la razón de θ con el buscado en el numerador y el conocido abajo.',
    k: 'k: lo que mide una parte. Si una razón vale a/b, sus dos lados miden a·k y b·k.',
    pit: D1.pit,
    area: D1.area,
    cm: D1.cm,
  };
  const v3 = g => valores(g, ['sen', 'cos', 'tan']);
  // Con las recíprocas que se usan (lector en frío A: «hace falta cot 30° = √3, que no está en los Datos»).
  const v4 = g => valores(g, ['sen', 'cos', 'tan', 'cot']), v6 = g => [valores(g, ['sen', 'cos', 'tan']), valores(g, ['cot', 'sec', 'csc'])];
  // posteCable recibe la hipotenusa: con el alto h y el ángulo θ, el cable mide h ÷ sen θ.
  const antenaDe = (h, g, rot, o) => posteCable(h / Math.sin(abre(g, o) * RAD), g, rot, o);

  // El poste y su sombra: el rayo de sol pasa por la punta y llega al suelo donde termina la sombra.
  const sombraFig = (h, g, rot = {}, o = {}) => {
    const [x, y] = pol(1, abre(g, o)), L = h / y, X = L * x;
    return { objetos: [{ tipo: 'poste', x: 0, h }],
      lados: [{ de: [0, h], a: [X, 0], como: 'vista', texto: rot.H, lado: 1, rol: 'H' }]
        .concat(rot.h !== undefined ? [{ de: [0, 0], a: [0, h], como: 'cota', color: rot.h === '?' ? null : 'o', texto: rot.h, lado: 1, sep: 14, rol: 'CO' }] : [])
        .concat(rot.d !== undefined ? [{ de: [0, 0], a: [X, 0], como: 'cota', color: rot.d === '?' ? null : 'i', texto: rot.d, lado: -1, sep: 12, rol: 'CA' }] : []),
      angulos: [{ en: [X, 0], de: [0, 0], a: [0, h], texto: rot.t, ref: true }], rectos: [{ en: [0, 0], de: [1, 0], a: [0, 1] }] };
  };
  // Ejemplos de la idea 2. Cuentas rehechas aparte (cuentas-ejemplos.js): 6·√3/3; 8·3/4; 12·2√3/3; 2·2; 9·4/3; 5·2 y 5·√3;
  // 1,5·2 y 1,5·√3; 0,9·5/3; 8·3/4 y 8·6/2; 24·7/24 y 2(24 + 7); 6·√3/3 + 6·√3; 36 · 5/12 y √(15² + 36²); 12·3/4 + 12·5/4;
  // h + h cot θ + h csc θ; 12·4/3, 12·1/3 y 16 − 4, y el valor de cada alternativa equivocada.
  const ALT2 = {
    opuestos: ['4√3 m', '8√3 m', '6√3 m', '12 + 4√3 m', '2√3 m'],
    tan: ['13 cm', '15 cm', '39 cm', '93,6 cm', '86,4 cm'],
    juntos: ['36 m', '18,6 m', '27 m', '24 m', '21 m'],
    perim: ['h(1 + tan θ + sec θ)', 'h(cot θ + csc θ)', 'h(1 + sen θ + cos θ)', 'h(1 + cot θ + sen θ)', 'h(1 + cot θ + csc θ)'],
    cadena: ['12 cm', '16 cm', '4 cm', '20 cm', '36 cm'],
  };
  const EJEMPLOS_2 = [
    { nivel: 1, titulo: 'La sombra del poste', figura: fig(sombraFig(6, 60, { h: '6 m', t: '60°', d: '?' })),
      enunciado: jN('Un poste de 6 m da su sombra en el suelo cuando el sol está a 60° sobre el horizonte. ¿Cuánto mide la sombra?' + NO_ESC),
      datos: [D2.regla, D2.rzr, ...v6(60)],
      solucion: [{ texto: ['Desde 60°, el poste es el opuesto y la sombra, el adyacente: la razón «adyacente sobre opuesto» es la cotangente.'], ecuacion: junto([CA, ' = 6 · cot 60° = 6 · ', frac('√3', '3'), ' = ', dI('2√3 m'), ' ≈ ', dI('3,46 m')]) }],
      respuesta: [dI('2√3 m'), ' ≈ ', dI('3,46 m')] },
    { nivel: 1, titulo: 'El poste desde su sombra', figura: fig(sombraFig(6, 37, { d: '8 m', t: '37°', h: '?' })),
      enunciado: jN('La sombra de un poste mide 8 m cuando el sol está a 37° sobre el horizonte. ¿Cuánto mide el poste?' + NO_ESC),
      datos: [D2.regla, D2.rz, ...v6(37)],
      solucion: [{ texto: ['Se busca el opuesto con el adyacente: «opuesto sobre adyacente» es la tangente.'], ecuacion: junto([CO, ' = 8 · tan 37° = 8 · ', frac('3', '4'), ' = ', dO('6 m')]) }],
      respuesta: [dO('6 m')] },
    { nivel: 1, titulo: 'El cable de la antena', figura: fig(antenaDe(12, 60, { h: '12 m', t: '60°', H: '?' }, { antena: true })),
      enunciado: jN('Una antena de 12 m se sujeta con un cable que va de su punta al suelo y forma 60° con el suelo. ¿Cuánto mide el cable?' + NO_ESC),
      datos: [D2.regla, D2.rzr, ...v6(60)],
      solucion: [{ texto: ['El cable es la hipotenusa y la antena, el opuesto: «hipotenusa sobre opuesto» es la cosecante.'], ecuacion: junto(['H = 12 · csc 60° = 12 · ', frac('2√3', '3'), ' = ', neg('8√3 m'), ' ≈ ', neg('13,86 m')]) }],
      respuesta: [neg('8√3 m'), ' ≈ ', neg('13,86 m')] },
    { nivel: 1, titulo: 'La escalera desde su pie', figura: fig(escalera(4, 60, { d: '2 m', t: '60°', H: '?' })),
      enunciado: jN('El pie de una escalera está a 2 m de la pared y la escalera forma 60° con el piso. ¿Cuánto mide la escalera?' + NO_ESC),
      datos: [D2.regla, D2.rzr, ...v6(60)],
      solucion: [{ texto: ['Con el adyacente, la hipotenusa sale con la secante, «hipotenusa sobre adyacente».'], ecuacion: junto(['H = 2 · sec 60° = 2 · 2 = ', neg('4 m')]) }],
      respuesta: [neg('4 m')] },
    { nivel: 1, titulo: 'Con 53°', figura: fig(triFig(12, 9, { ca: '9 cm', t: '53°', co: '?' })),
      enunciado: jN('En un triángulo rectángulo, el cateto adyacente a 53° mide 9 cm. ¿Cuánto mide el cateto opuesto a 53°?' + NO_ESC),
      datos: [D2.regla, D2.rz, ...v6(53)],
      solucion: [{ texto: ['Opuesto sobre adyacente: la tangente.'], ecuacion: junto([CO, ' = 9 · tan 53° = 9 · ', frac('4', '3'), ' = ', dO('12 cm')]) }],
      respuesta: [dO('12 cm')] },
    { nivel: 2, titulo: 'El perímetro desde un cateto', figura: fig(triFig(5, 5 * Math.sqrt(3), { co: '5 cm', t: '30°' })),
      enunciado: jN('En un triángulo rectángulo, el cateto opuesto a 30° mide 5 cm. ¿Cuánto mide su perímetro?' + NO_ESC),
      datos: [D2.regla, D2.rzr, ...v6(30)],
      solucion: [
        { texto: ['La hipotenusa, con la cosecante; el adyacente, con la cotangente:'], ecuacion: [junto(['H = 5 · csc 30° = 5 · 2 = 10']), SEP, junto([CA, ' = 5 · cot 30° = ', dI('5√3')])] },
        { texto: ['Los tres lados juntos:'], ecuacion: [junto('5 + 10 + 5√3 = 15 + 5√3 cm'), ' ', junto('≈ 23,66 cm')] },
      ],
      respuesta: ['15 + 5√3 cm ≈ 23,66 cm'] },
    { nivel: 2, titulo: 'El tobogán desde su altura', figura: fig(tobogan(3, 30, { h: '1,5 m', t: '30°', H: '?', d: '?' })),
      enunciado: jN('Un tobogán empieza a 1,5 m del suelo y su bajada forma 30° con el suelo. ¿Cuánto mide la bajada y cuánto avanza por el suelo?' + NO_ESC),
      datos: [D2.regla, D2.rzr, ...v6(30)],
      solucion: [
        { texto: ['La bajada es la hipotenusa: «hipotenusa sobre opuesto», la cosecante.'], ecuacion: junto(['H = 1,5 · csc 30° = 1,5 · 2 = ', neg('3 m')]) },
        { texto: ['El suelo es el adyacente: la cotangente.'], ecuacion: junto([CA, ' = 1,5 · cot 30° = ', dI('1,5√3 m'), ' ≈ ', dI('2,6 m')]) },
      ],
      respuesta: ['bajada ', neg('3 m'), '; suelo ', dI('1,5√3 m'), ' ≈ ', dI('2,6 m')] },
    { nivel: 2, titulo: 'Centímetros y metros', figura: fig(escalera(1.5, 53, { d: '90 cm', t: '53°', H: '?' })),
      enunciado: jN('El pie de una escalera está a 90 cm de la pared y la escalera forma 53° con el piso. ¿Cuántos metros mide la escalera?' + NO_ESC),
      datos: [D2.regla, D2.rzr, ...v6(53), D2.cm],
      solucion: [
        { texto: ['En metros, el pie está a 0,9 m.'] },
        { texto: ['La hipotenusa con el adyacente: la secante.'], ecuacion: junto(['H = 0,9 · sec 53° = 0,9 · ', frac('5', '3'), ' = ', neg('1,5 m')]) },
      ],
      respuesta: [neg('1,5 m')] },
    { nivel: 2, titulo: 'El área con un cateto', figura: fig(triFig(9, 12, { ca: '12 cm', t: '37°' })),
      enunciado: jN('En un triángulo rectángulo, el cateto adyacente a 37° mide 12 cm. ¿Cuánto mide su área?' + NO_ESC),
      datos: [D2.regla, D2.rz, ...v6(37), D2.area],
      solucion: [
        { texto: ['El otro cateto, con la tangente:'], ecuacion: junto([CO, ' = 12 · tan 37° = 12 · ', frac('3', '4'), ' = ', dO('9 cm')]) },
        { texto: ['El área:'], ecuacion: junto([frac([dO('9'), ' · ', dI('12')], '2'), ' = 54 cm²']) },
      ],
      respuesta: ['54 cm²'] },
    { nivel: 2, titulo: 'El terreno y su diagonal', figura: fig({ suelo: false,
      lados: [{ de: [0, 0], a: [24, 0], color: 'i', texto: '24 m', lado: -1, rol: 'CA' }, { de: [24, 0], a: [24, 12], texto: '?', lado: -1, rol: 'CO' }, { de: [0, 0], a: [24, 12], texto: 'diagonal', lado: 1, rol: 'H' }, { de: [24, 12], a: [0, 12] }, { de: [0, 12], a: [0, 0] }],
      angulos: [{ en: [0, 0], de: [24, 0], a: [24, 12], texto: '16°', ref: true }], rectos: [{ en: [24, 0], de: [0, 0], a: [24, 12] }] }),
      enunciado: jN('Un terreno rectangular tiene 24 m de frente, y su diagonal forma 16° con el frente. ¿Cuánto mide su perímetro?' + NO_ESC),
      datos: [D2.regla, D2.rz, ...v6(16)],
      solucion: [
        { texto: ['El fondo es el opuesto a 16°; el frente, el adyacente: la tangente.'], ecuacion: junto([CO, ' = 24 · tan 16° = 24 · ', frac('7', '24'), ' = ', dO('7 m')]) },
        { texto: ['El perímetro suma dos frentes y dos fondos:'], ecuacion: junto(['2 · (24 + 7) = 62 m']) },
      ],
      respuesta: ['62 m'] },
    // Nivel 3, tipo examen. Letras de las correctas: B, C, D, E, A. Las figuras de los ejemplos 14 y 15 tienen puntos con
    // letras: ahí la respuesta y las alternativas van por su valor (decisión de la Etapa 3).
    { nivel: 3, titulo: 'Dos cables a lados opuestos', figura: fig((() => { const [x1, y1] = pol(1, DIB(60)), [x2, y2] = pol(1, DIB(30)), X1 = 6 * x1 / y1, X2 = 6 * x2 / y2;
        return { objetos: [{ tipo: 'poste', x: 0, h: 6 }, { tipo: 'estaca', x: X1 }, { tipo: 'estaca', x: -X2 }],
          lados: [{ de: [0, 6], a: [X1, 0], lado: 1 }, { de: [0, 6], a: [-X2, 0], lado: -1 }, { de: [0, 0], a: [0, 6], como: 'cota', color: 'o', texto: '6 m', lado: 1, sep: 10 }, { de: [-X2, 0], a: [X1, 0], como: 'cota', texto: '?', lado: -1, sep: 12 }],
          angulos: [{ en: [X1, 0], de: [0, 0], a: [0, 6], texto: '60°' }, { en: [-X2, 0], de: [0, 0], a: [0, 6], texto: '30°' }], rectos: [{ en: [0, 0], de: [1, 0], a: [0, 1] }] }; })()),
      enunciado: jN('De la punta de un poste de 6 m salen dos cables a estacas en lados opuestos: uno forma 60° con el suelo y el otro, 30°. ¿Qué distancia hay entre las estacas?' + NO_ESC),
      alternativas: ALT2.opuestos,
      datos: [D2.regla, D2.rzr, ...v6(30), ...v6(60)],
      solucion: [
        { texto: ['Cada estaca, con la cotangente desde su ángulo:'], ecuacion: [junto(['6 · cot 60° = ', dI('2√3')]), SEP, junto(['6 · cot 30° = ', dI('6√3')])] },
        { texto: ['Están a lados opuestos del poste: las distancias se suman.'], ecuacion: junto([dI('2√3'), ' + ', dI('6√3'), ' = 8√3 m ≈ 13,86 m']) },
        { texto: ['4√3 m las resta; 6√3 m y 2√3 m son una sola estaca; 12 + 4√3 m suma los dos cables.'] },
      ],
      respuesta: [letra(ALT2.opuestos, '8√3 m'), ', ', dI('8√3 m'), ' ≈ ', dI('13,86 m')] },
    { nivel: 3, titulo: 'Con la tangente dada', figura: fig(triFig(15, 36, { ca: '36 cm', h: '?' })),
      enunciado: jN('En un triángulo rectángulo, tan θ = 5/12 y el cateto adyacente a θ mide 36 cm. ¿Cuánto mide la hipotenusa?' + NO_ESC),
      alternativas: ALT2.tan,
      datos: [D2.k, D2.pit],
      solucion: [
        { texto: ['tan θ = 5/12: el opuesto mide 5k y el adyacente, 12k. Como 12k = 36, k = 3.'], ecuacion: junto([CO, ' = 5 · 3 = ', dO('15')]) },
        { texto: ['La hipotenusa, por Pitágoras:'], ecuacion: [junto('√(15² + 36²) = √(225 + 1296)'), ' ', junto('= √1521 = 39 cm')] },
        { texto: ['13 cm usa k = 1; 15 cm es el opuesto; 93,6 cm multiplica 36 por 13/5; 86,4 cm por 12/5, la tangente al revés.'] },
      ],
      respuesta: [letra(ALT2.tan, '39 cm'), ', ', neg('39 cm')] },
    { nivel: 3, titulo: 'El cable y el suelo, juntos', figura: fig(antenaDe(12, 53, { h: '12 m', t: '53°', H: '?', d: '?' }, { antena: true })),
      enunciado: jN('Una antena de 12 m tiene un cable tensor que forma 53° con el suelo. ¿Cuánto suman el largo del cable y la distancia de la estaca al pie de la antena?' + NO_ESC),
      alternativas: ALT2.juntos,
      datos: [D2.regla, D2.rzr, ...v6(53)],
      solucion: [
        { texto: ['Desde 53°, la antena es el opuesto. El suelo, con la cotangente; el cable, con la cosecante:'], ecuacion: [junto([CA, ' = 12 · ', frac('3', '4'), ' = ', dI('9')]), SEP, junto(['H = 12 · ', frac('5', '4'), ' = 15'])] },
        { texto: ['La suma:'], ecuacion: junto([dI('9'), ' + 15 = 24 m']) },
        { texto: ['36 m nombra los lados desde 37°; 18,6 m saca el cable con el seno; 27 m suma la antena y el cable; 21 m, la antena y el suelo.'] },
      ],
      respuesta: [letra(ALT2.juntos, '24 m'), ', 24 m'] },
    { nivel: 3, titulo: 'El triángulo del poste, con letras', figura: fig({ objetos: [{ tipo: 'poste', x: 0, h: 3 }],
        lados: [{ de: [0, 3], a: [4.5, 0], texto: 'PT', lado: 1, rol: 'H' }, { de: [0, 0], a: [0, 3], color: 'o', texto: 'h', lado: 1, sep: 12, como: 'cota', rol: 'CO' }],
        angulos: [{ en: [4.5, 0], de: [0, 0], a: [0, 3], texto: 'θ', ref: true }], rectos: [{ en: [0, 0], de: [1, 0], a: [0, 1] }],
        puntos: [{ en: [0, 0], texto: 'B', dir: [-1, 0.6] }, { en: [0, 3], texto: 'T', dir: [-1, -0.4] }, { en: [4.5, 0], texto: 'P', dir: [1, 0.6] }] }),
      enunciado: 'Un cable va de la punta T de un poste BT, de altura h, a un punto P del suelo, y forma con el suelo un ángulo θ. ¿Cuánto mide el perímetro del triángulo BPT?',
      alternativas: ALT2.perim,
      datos: [D2.regla, D2.rzr],
      solucion: [
        { texto: ['Desde θ, el poste es el opuesto. El suelo BP, con la cotangente; el cable PT, con la cosecante:'], ecuacion: [junto(['BP = h cot θ']), SEP, junto(['PT = h csc θ'])] },
        { texto: ['El perímetro suma los tres lados:'], ecuacion: [junto('h + h cot θ + h csc θ'), ' ', junto('= h(1 + cot θ + csc θ)')] },
        { texto: ['h(1 + tan θ + sec θ) mira desde T; h(cot θ + csc θ) olvida el poste.'] },
        { texto: ['h(1 + sen θ + cos θ) toma h por hipotenusa; h(1 + cot θ + sen θ) saca el cable con el seno.'] },
      ],
      respuesta: ['h(1 + cot θ + csc θ)'] },
    { nivel: 3, titulo: 'Dos razones encadenadas', figura: fig({ suelo: false,
        lados: [{ de: [0, 0], a: [16, 0], color: 'i', lado: -1 }, { de: [16, 0], a: [16, 12], color: 'o', texto: '12 cm', lado: -1 }, { de: [0, 0], a: [16, 12], lado: 1 }, { de: [16, 12], a: [9, 0], como: 'punteada' }, { de: [0, 0], a: [9, 0], como: 'cota', texto: '?', lado: 1, sep: 10 }],
        angulos: [{ en: [0, 0], de: [16, 0], a: [16, 12] }, { en: [16, 12], de: [16, 0], a: [9, 0] }], rectos: [{ en: [16, 0], de: [0, 0], a: [16, 12] }],
        puntos: [{ en: [0, 0], texto: 'A', dir: [-1, 0.6] }, { en: [16, 0], texto: 'C', dir: [1, 0.6] }, { en: [16, 12], texto: 'B', dir: [1, -0.4] }, { en: [9, 0], texto: 'D', dir: [0, 1] }] }),
      enunciado: jN('En el triángulo ABC, recto en C, tan A = 3/4 y BC = 12 cm. El punto D está en AC y la tangente del ángulo DBC es 1/3. ¿Cuánto mide AD?' + NO_ESC),
      alternativas: ALT2.cadena,
      datos: [D2.regla, D2.rz, D2.rzr],
      solucion: [
        { texto: ['Desde A, BC es el opuesto y AC el adyacente: AC sale con la cotangente de A, 4/3.'], ecuacion: junto(['AC = 12 · ', frac('4', '3'), ' = 16 cm']) },
        { texto: ['En DBC, desde B, DC es el opuesto y BC el adyacente: la tangente.'], ecuacion: junto(['DC = 12 · ', frac('1', '3'), ' = 4 cm']) },
        { texto: ['AD es lo que queda: 16 − 4 = 12 cm. 16 cm es AC; 4 cm es DC; 20 cm es AB; 36 cm divide 12 entre 1/3.'] },
      ],
      respuesta: ['AD = 12 cm'] },
  ];

  // El juego de la antena: la escala no cambia (el marco es el de la antena más alta con el cable más bajo).
  const distAntena = val => Ex.por(E(val.h), razon('cot', val.g));
  const MARCO2 = [[0, 0], [12 * Math.sqrt(3), 12]];
  // «Así se resuelve»: el poste y su sombra (en «Ahora tú» van la antena, la escalera, el cable y el triángulo).
  function resuelve2(sem) {
    const rr = azar(sem + 900), g = [30, 37, 53, 60][sem % 4], h = rr.uno(CONV(g) ? [6, 9, 12] : [4, 6, 8, 10]), pide = rr.ent(0, 1) ? 'sombra' : 'poste';
    const sombra = Ex.por(E(h), razon('cot', g)), sT = exTxt(sombra, 'm');
    const fd = (todo) => fig(sombraFig(h, g, pide === 'sombra' ? { h: `${h} m`, t: `${g}°`, d: todo ? sT : '?' } : { d: sT, t: `${g}°`, h: todo ? `${h} m` : '?' }));
    const sigue = pide === 'sombra'
      ? { regla: ['Desde el ángulo del sol, el poste es el opuesto y la sombra, el adyacente. «Adyacente sobre opuesto» es la cotangente.'], ec: [CA, ` = ${h} · cot ${g}° = ${h} · ${rzTxt('cot', g)} = `, dI(largo(sombra))], resp: dI(largo(sombra)) }
      : { regla: ['Desde el ángulo del sol, la sombra es el adyacente y el poste, el opuesto. «Opuesto sobre adyacente» es la tangente.'], ec: [CO, ` = ${sT} · tan ${g}° = ${Ex.txt(sombra)} · ${rzTxt('tan', g)} = `, dO(`${h} m`)], resp: dO(`${h} m`) };
    return {
      enunciado: jN(pide === 'sombra' ? `Un poste de ${h} m da su sombra cuando el sol está a ${g}° sobre el horizonte. ¿Cuánto mide la sombra?${NO_ESC}`
        : `La sombra de un poste mide ${sT} cuando el sol está a ${g}° sobre el horizonte. ¿Cuánto mide el poste?${NO_ESC}`),
      datos: [D2.regla, D2.rz, D2.rzr, ...v6(g)],
      dibujo: fd(false),
      pasos: [
        { tipo: 'pide', texto: [pide === 'sombra' ? 'Piden la sombra, en el suelo.' : 'Piden el alto del poste.'] },
        { tipo: 'datos', texto: [pide === 'sombra' ? `El poste mide ${h} m y el sol está a ${g}°.` : `La sombra mide ${sT} y el sol está a ${g}°.`, ' El rayo de sol, el poste y la sombra arman un triángulo rectángulo.'] },
        { tipo: 'regla', texto: sigue.regla, ecuacion: junto(['buscado = conocido · ', frac('buscado', 'conocido')]) },
        { tipo: 'cuentas', texto: ['Se reemplaza:'], ecuacion: junto(sigue.ec), dibujo: fd(true) },
        { tipo: 'sentido', texto: [g > 45 ? `Tiene sentido: con el sol a más de 45°, la sombra es más corta que el poste.` : `Tiene sentido: con el sol a menos de 45°, la sombra es más larga que el poste.`] },
      ],
      respuesta: [sigue.resp],
    };
  }
  // «Ahora tú», tipo 0: el otro cateto (la antena y su estaca, o un triángulo de examen).
  function casoOtroCateto(rr) {
    let obj, g, k, tiene;
    do {
      obj = rr.uno(['antena', 'triangulo']); g = rr.uno([30, 37, 53, 60, 16, 74]); tiene = rr.uno(['op', 'ad']);
      k = obj === 'antena' ? rr.uno(CONV(g) ? (g === 16 || g === 74 ? [7, 14, 24] : [6, 9, 12, 15]) : [6, 8, 9, 12]) : rr.uno(g === 16 || g === 74 ? [7, 14, 24, 48] : CONV(g) ? [6, 9, 12, 15, 20] : [4, 6, 10, 18]);
    } while (['53ad9', '53op9', '53op12', '16ad24', '16op24', '60op6', '37ad8', '37op8', '37ad12', '30op5'].includes(`${g}${tiene}${k}`));   // las cuentas de los ejemplos 1, 2, 5, 6 y 10
    const u = obj === 'antena' ? 'm' : 'cm', pide = tiene === 'op' ? 'ad' : 'op';
    const rz = pide === 'ad' ? 'cot' : 'tan', inv = pide === 'ad' ? 'tan' : 'cot', hip = tiene === 'op' ? 'csc' : 'sec';
    const ok = Ex.por(E(k), razon(rz, g));
    const frase = obj === 'antena'
      ? (tiene === 'op' ? `Una antena de ${k} m tiene un cable tensor que forma ${g}° con el suelo. ¿A qué distancia del pie de la antena está la estaca?`
        : `La estaca del cable tensor de una antena está a ${k} m de su pie, y el cable forma ${g}° con el suelo. ¿Cuánto mide la antena?`)
      : `En un triángulo rectángulo, el cateto ${tiene === 'op' ? 'opuesto' : 'adyacente'} a ${g}° mide ${k} cm. ¿Cuánto mide el cateto ${pide === 'op' ? 'opuesto' : 'adyacente'} a ${g}°?`;
    const dib = obj === 'antena'
      ? fig(antenaDe(Ex.val(tiene === 'op' ? E(k) : ok), g, tiene === 'op' ? { h: `${k} m`, d: '?', t: `${g}°` } : { d: `${k} m`, h: '?', t: `${g}°` }, { antena: true }))
      : fig(triFig(Ex.val(tiene === 'op' ? E(k) : ok), Ex.val(tiene === 'op' ? ok : E(k)), tiene === 'op' ? { co: `${k} cm`, ca: '?', t: `${g}°` } : { ca: `${k} cm`, co: '?', t: `${g}°` }));
    return {
      pregunta: jN(frase + NO_ESC),
      datos: [D2.regla, D2.rz, D2.rzr, ...v6(g)],
      dibujo: dib,
      opciones: opciones({ ex: ok }, [
        { id: 'inversa', valor: { ex: Ex.por(E(k), razon(inv, g)) }, error: 'REC-INVERSA', siFuera: `Tangente y cotangente unen los dos catetos; pero el buscado va en el numerador: es la ${rz === 'cot' ? 'cotangente' : 'tangente'}.` },
        { id: 'hip', valor: { ex: Ex.por(E(k), razon(hip, g)) }, error: 'RES-HIP', siFuera: 'Multiplicar el cateto por una razón está bien; pero esa da la hipotenusa, y se pedía el otro cateto.' },
        { id: 'igual', valor: { ex: E(k) }, error: 'RES-IGUAL', siFuera: `Partir de los ${k} ${u} está bien; esos los dan: falta multiplicarlos por la razón.` },
      ], x => largo(x.ex, u)),
      solucion: { texto: `El buscado entre el conocido, desde ${g}°: la ${rz === 'cot' ? 'cotangente' : 'tangente'}.`,
        ecuacion: junto([pide === 'op' ? CO : CA, ` = ${k} · ${rz} ${g}° = ${k} · ${rzTxt(rz, g)} = `, pide === 'op' ? dO(exTxt(ok, u)) : dI(exTxt(ok, u))]) },
    };
  }
  // «Ahora tú», tipo 1: la hipotenusa con un cateto (el cable de un poste, la escalera o un triángulo).
  function casoHipotenusa(rr) {
    let obj, g, k, tiene;
    do {
      obj = rr.uno(['cable', 'escalera', 'triangulo']); g = rr.uno(obj === 'escalera' ? [53, 60] : [30, 37, 53, 60]);
      tiene = obj === 'cable' ? 'op' : obj === 'escalera' ? 'ad' : rr.uno(['op', 'ad']);
      k = rr.uno(obj === 'escalera' ? (CONV(g) ? [1.2, 1.5, 1.8, 3] : [1, 1.5, 2, 3]) : obj === 'cable' ? (CONV(g) ? [6, 9, 12] : [5, 6, 8, 9]) : (CONV(g) ? [6, 12, 15] : [3, 7, 9, 11]));
    } while (['60op12', '60ad12', '60ad2', '60op2', '30op5', '30ad5', '53ad0.9', '53op12', '53ad12', '30op1.5', '30ad1.5'].includes(`${g}${tiene}${k}`));   // las cuentas de los ejemplos 3, 4, 6, 7, 8 y 13
    const rz = tiene === 'op' ? 'csc' : 'sec', mal = tiene === 'op' ? 'sen' : 'cos', otra = tiene === 'op' ? 'sec' : 'csc', cat = tiene === 'op' ? 'cot' : 'tan';
    const u = obj === 'triangulo' ? 'cm' : 'm', kT = f(k);
    const okEx = Ex.por(E(Math.round(k * 10), 10), razon(rz, g));
    const frase = obj === 'cable' ? `Un poste de ${kT} m se sujeta con un cable que va de su punta a una estaca y forma ${g}° con el suelo. ¿Cuánto mide el cable?`
      : obj === 'escalera' ? `El pie de una escalera está a ${kT} m de la pared y la escalera forma ${g}° con el piso. ¿Cuánto mide la escalera?`
        : `En un triángulo rectángulo, el cateto ${tiene === 'op' ? 'opuesto' : 'adyacente'} a ${g}° mide ${kT} cm. ¿Cuánto mide la hipotenusa?`;
    const Hv = Ex.val(okEx);
    const dib = obj === 'cable' ? fig(posteCable(Hv, g, { h: `${kT} m`, H: '?', t: `${g}°` }))
      : obj === 'escalera' ? fig(escalera(Hv, g, { d: `${kT} m`, H: '?', t: `${g}°` }))
        : fig(triFig(Hv * Math.sin(g * RAD), Hv * Math.cos(g * RAD), tiene === 'op' ? { co: `${kT} cm`, h: '?', t: `${g}°` } : { ca: `${kT} cm`, h: '?', t: `${g}°` }));
    const K = E(Math.round(k * 10), 10);
    return {
      pregunta: jN(frase + NO_ESC),
      datos: [D2.regla, D2.rz, D2.rzr, ...v6(g)],
      dibujo: dib,
      opciones: opciones({ ex: okEx }, [
        { id: 'multiplica', valor: { ex: Ex.por(K, razon(mal, g)) }, error: 'RES-MULTIPLICA', siFuera: `Usar ${mal} ${g}° es una idea; pero así la hipotenusa sale menor que el cateto. Va la recíproca.` },
        { id: 'otra', valor: { ex: Ex.por(K, razon(otra, g)) }, error: 'TR9', siFuera: `La hipotenusa va en el numerador, bien; pero abajo va el cateto que conoces, y esa razón usa el otro.` },
        { id: 'cateto', valor: { ex: Ex.por(K, razon(cat, g)) }, error: 'RES-HIP', siFuera: 'Multiplicar por una razón está bien; pero esa da el otro cateto, no la hipotenusa.' },
      ], x => largo(x.ex, u)),
      solucion: { texto: `La hipotenusa sobre el cateto conocido: la ${rz === 'csc' ? 'cosecante' : 'secante'} de ${g}°.`,
        ecuacion: junto([`H = ${kT} · ${rz} ${g}° = ${kT} · ${rzTxt(rz, g)} = `, neg(exTxt(okEx, u))]) },
    };
  }
  // «Ahora tú», tipo 2 (nivel de examen, con letras; San Marcos 2020-I): el poste BT de altura h, el cable TP con el
  // ángulo θ en P. Piden BP + PT, PT − BP o PT/BP. El perímetro BPT es el ejemplo 14.
  const figPuente = () => fig({ objetos: [{ tipo: 'poste', x: 0, h: 3 }],
    lados: [{ de: [0, 3], a: [4.5, 0], lado: 1, rol: 'H' }, { de: [0, 0], a: [0, 3], color: 'o', texto: 'h', lado: 1, sep: 12, como: 'cota', rol: 'CO' }],
    angulos: [{ en: [4.5, 0], de: [0, 0], a: [0, 3], texto: 'θ', ref: true }], rectos: [{ en: [0, 0], de: [1, 0], a: [0, 1] }],
    puntos: [{ en: [0, 0], texto: 'B', dir: [-1, 0.6] }, { en: [0, 3], texto: 'T', dir: [-1, -0.4] }, { en: [4.5, 0], texto: 'P', dir: [1, 0.6] }] });
  function casoPuente(rr) {
    const sub = rr.uno(['suma', 'resta', 'razon']);
    const base = 'Un cable va de la punta T de un poste BT, de altura h, a un punto P del suelo, y forma con el suelo un ángulo θ.';
    if (sub === 'razon') return {
      pregunta: `${base} ¿Cuánto vale PT/BP?`,
      datos: [D2.rz, D2.rzr], dibujo: figPuente(),
      opciones: opciones('sec θ', [
        { id: 'csc', valor: 'csc θ', error: 'TR9', siFuera: 'El cable va arriba, bien; pero BP es el adyacente a θ, no el opuesto.' },
        { id: 'cos', valor: 'cos θ', error: 'REC-INVERSA', siFuera: 'Cable y suelo son los lados correctos; pero el cable va en el numerador.' },
        { id: 'cot', valor: 'cot θ', error: 'RES-HIP', siFuera: 'BP es el adyacente, bien; pero el cable es la hipotenusa, no el poste.' },
      ], x => x),
      solucion: { texto: 'Desde θ, PT es la hipotenusa y BP el adyacente: hipotenusa sobre adyacente.', ecuacion: junto(['PT/BP = sec θ']) },
    };
    const suma = sub === 'suma';
    return {
      pregunta: `${base} ¿Cuánto mide ${suma ? 'BP + PT' : 'PT − BP'}?`,
      datos: [D2.regla, D2.rzr], dibujo: figPuente(),
      // Con la resta, ninguna alternativa puede salir negativa para algún θ (cierre, 19 nov): h(sen θ − tan θ) lo era siempre.
      opciones: opciones(suma ? 'h(cot θ + csc θ)' : 'h(csc θ − cot θ)', suma ? [
        { id: 'comp', valor: 'h(tan θ + sec θ)', error: 'RES-COMPLEMENTO', siFuera: 'Cotangente y cosecante son el camino; pero esas razones miran desde T, no desde P.' },
        { id: 'inv', valor: 'h(tan θ + sen θ)', error: 'REC-INVERSA', siFuera: 'Los lados son esos; pero el conocido, h, va abajo: son las recíprocas.' },
        { id: 'sen', valor: 'h(cot θ + sen θ)', error: 'RES-MULTIPLICA', siFuera: 'BP = h cot θ está bien; pero el cable es mayor que h: va con la cosecante.' },
      ] : [
        { id: 'comp', valor: 'h(sec θ − tan θ)', error: 'RES-COMPLEMENTO', siFuera: 'Cotangente y cosecante son el camino; pero esas razones miran desde T, no desde P.' },
        { id: 'suma', valor: 'h(csc θ + cot θ)', error: 'RES-SUMA', siFuera: 'PT = h csc θ y BP = h cot θ están bien; pero se pide la diferencia: se restan.' },
        { id: 'solo', valor: 'h csc θ', error: 'RES-UN-PASO', siFuera: 'PT = h csc θ está bien: ese es el cable. Falta restarle el suelo, BP = h cot θ.' },
      ], x => x),
      solucion: { texto: 'BP es el adyacente: h cot θ. PT es la hipotenusa: h csc θ.', ecuacion: junto([suma ? 'h cot θ + h csc θ = h(cot θ + csc θ)' : 'h csc θ − h cot θ = h(csc θ − cot θ)']) },
    };
  }

  const catetoIdea = {
    id: 'cateto-y-angulo',
    titulo: 'Un cateto y un ángulo',
    pregunta: '¿Cómo se halla la hipotenusa si conoces un cateto y un ángulo?',
    temas: ['Resolver con un lado y un ángulo'],
    pieza: VI,
    aprendizaje: 'Con un cateto y θ, el lado buscado es el conocido por la razón con el buscado en el numerador: tan, cot, sec o csc.',
    actividad: 'Cambiar el alto de una antena y el ángulo de su cable tensor.',
    // Lee: el objeto y que ahora el dato es un cateto. No dice cómo sale el cable (la predicción).
    lee: {
      tarjetas: [
        { titulo: 'La antena y su cable', texto: 'Una antena de radio se sostiene con cables tensores: cada cable va de su punta a una estaca clavada en el suelo. La antena, el suelo y el cable arman un triángulo rectángulo.',
          pieza: VI, dibujo: { datos: antenaDe(9, 45, {}, { antena: true, escala: true }), estado: {} } },
        { titulo: 'Ahora el dato es un cateto', texto: ['En la idea anterior el dato era la hipotenusa. Aquí sabes cuánto mide la antena, ', hh, ': es el cateto opuesto al ángulo ', th, ' del cable con el suelo.'] },
        { titulo: 'Las seis razones', texto: ['En el tema anterior viste seis razones. Cada una es un lado entre otro; el de arriba es su numerador. Las tres recíprocas: ', junto(['cot θ = ', CA, '/', CO]), ', ', junto(['sec θ = H/', CA]), ' y ', junto(['csc θ = H/', CO]), '.'] },
        { titulo: 'Qué mirar al jugar', texto: 'Vas a cambiar el alto de la antena y el ángulo del cable. Mira a qué distancia del pie queda la estaca.' },
      ],
    },
    ejemplos: EJEMPLOS_2,
    juega: {
      pieza: VI,
      consigna: ['La antena, ', hh, ', es el cateto opuesto al ángulo ', th, ' del cable con el suelo; ', dd, ' es la distancia de la estaca al pie.'],
      mision: {
        texto: 'Con la antena de 12 m, clava la estaca a 4√3 m de su pie.',
        logrado: val => val.h === 12 && val.g === 60,
        bien: 'Listo: 12 · cot 60° = 12 · √3/3 = 4√3 m.',
      },
      voz: '¿Qué razón une la antena con el suelo?',
      leyenda: [
        { s: th, t: 'el ángulo del cable con el suelo' },
        { s: hh, t: 'la antena: el opuesto a θ' },
        { s: dd, t: 'de la estaca al pie: el adyacente' },
        { s: 'cable', t: 'el cable tensor: la hipotenusa' },
      ],
      controles: [
        { id: 'g', etiqueta: 'θ, ángulo del cable', color: 'c-h', min: 30, max: 60, paso: 15, inicio: 45, unidad: '°', decimales: 0 },
        { id: 'h', etiqueta: 'h, la antena', color: 'c-o', min: 6, max: 12, paso: 3, inicio: 9, unidad: 'm', decimales: 0 },
      ],
      dibujo: val => ({ datos: antenaDe(val.h, val.g, { h: `h = ${val.h} m`, t: `θ = ${val.g}°`, d: `d = ${exTxt(distAntena(val), 'm')}`, H: 'cable' }, { antena: true, escala: true, marco: MARCO2 }), estado: {} }),
      lectura: val => jN([dd, ` = ${val.h} · cot ${val.g}° = ${largo(distAntena(val))}`]),
      minimo: 3,
    },
    predice: {
      pregunta: 'Otra antena mide 10 m y su cable tensor llega al suelo formando 30°. ¿Cuánto mide el cable?' + NO_ESC,
      datos: [v3(30)],
      voz: 'El juego te dio el suelo; ahora se pide el cable.',
      opciones: [
        { id: 'c', texto: '20 m', correcta: true },
        { id: 'multiplica', texto: '5 m', error: 'RES-MULTIPLICA', siFuera: 'Usar sen 30° es una idea; pero 5 m es menos que la antena, y el cable es la hipotenusa.' },
        { id: 'suelo', texto: '10√3 m ≈ 17,32 m', error: 'TR9', siFuera: 'Ese es el suelo hasta la estaca, el adyacente; el cable es la hipotenusa.' },
        { id: 'coseno', texto: '20√3/3 m ≈ 11,55 m', error: 'TR9', siFuera: 'Dividir la antena entre una razón va bien; pero el coseno no une la antena con el cable.' },
      ],
      dibujo: { datos: antenaDe(10, 30, { h: 'h = 10 m', t: 'θ = 30°', H: '?' }, { antena: true }), estado: {} },
      revelar: { datos: antenaDe(10, 30, { h: 'h = 10 m', t: 'θ = 30°', H: '20 m' }, { antena: true }), estado: {} },
      coincide: 'Coincide: el cable es la hipotenusa, el doble de la antena: 10 · csc 30° = 20 m.',
      noCoincide: 'Revisemos: el cable es la hipotenusa; no puede ser más corto que la antena.',
    },
    mira: {
      pieza: VI,
      datos: antenaDe(10, 30, { h: 'CO = 10 m', t: 'θ = 30°', H: [{ t: 'H = ?' }, { t: 'H = 20 m', paso: 2 }] }, { antena: true }),
      voz: 'El buscado arriba; el que tienes, abajo.',
      pasos: [
        { estado: { paso: 0 }, texto: 'Desde 30°, la antena queda enfrente: es el opuesto. El cable es la hipotenusa.', ecuacion: junto(['sen 30° = ', frac(CO, HH)]) },
        { estado: { paso: 1 }, texto: 'La razón con el buscado en el numerador es la cosecante.', ecuacion: junto(['csc 30° = ', frac(HH, CO)]) },
        { estado: { paso: 2 }, texto: 'Se despeja H: el cateto pasa multiplicando.', ecuacion: junto(['H = 10 · csc 30° = 10 · 2 = 20 m']) },
        { estado: { paso: 2 }, texto: 'Es lo mismo que dividir entre el seno.', ecuacion: junto(['H = 10 ÷ ', frac('1', '2'), ' = 20 m']) },
        { estado: { paso: 2 }, texto: 'Tiene sentido: la hipotenusa sale mayor que el cateto.', ecuacion: junto(['20 m > 10 m']) },
      ],
    },
    regla: {
      texto: 'Con un cateto y θ, multiplica el cateto que conoces por la razón de θ que tiene arriba el lado que buscas y abajo el que conoces.',
      ecuacion: [junto([CA, ' = ', CO, ' · cot ', th]), SEP, junto(['H = ', CO, ' · csc ', th]), SEP, junto([CO, ' = ', CA, ' · tan ', th]), SEP, junto(['H = ', CA, ' · sec ', th])],
      condicion: ['θ agudo y lados nombrados desde θ; ', junto(['cot θ = ', CA, '/', CO]), ', ', junto(['sec θ = H/', CA]), ' y ', junto(['csc θ = H/', CO]), '.'],
      voz: 'El buscado en el numerador: así nunca divides.',
      dibujo: { pieza: VI, datos: triFig(3, 4, { h: 'H', t: 'θ', co: 'CO', ca: 'CA' }, { escala: true }), estado: {} },
    },
    resuelve: { pieza: VI, generar: resuelve2 },
    ahoraTu: {
      pieza: VI,
      voz: 'El buscado va en el numerador de la razón.',
      generar(sem) { return sinRepetir([casoOtroCateto, casoHipotenusa, casoPuente][sem % 3], sem, catetoIdea); },
    },
  };

  // ====================================================================================================================
  // Idea 3: ángulos de elevación y depresión
  // ====================================================================================================================
  // Objeto de la primera pantalla: un globo aerostático amarrado que sube recto, y una niña que lo mira (los ojos a 1,5 m).
  // Cambia: la distancia d de la niña al punto de partida del globo y el ángulo de elevación θ. · Permanece: la altura de
  // los ojos. · Progresa: la altura h de la canasta, d · tan θ + 1,5. · Se reserva: la mirada del piloto hacia abajo (la
  // predicción: la depresión mide lo mismo que la elevación). · Debe verse: el ángulo nace en la horizontal del ojo; la
  // altura de los ojos se suma.
  // Errores: DEP-VERTICAL mide el ángulo desde la vertical (usa la razón del complemento); DEP-FALTA cree que hace falta
  // otro dato; DEP-SUPLE mide desde el otro lado de la horizontal; ELEV-OJO olvida la altura de los ojos o de la ventana;
  // DEP-RESTA resta los dos tramos que se suman; TR9 elige una razón que no une esos lados (todas hipótesis, salvo TR9).
  const OJO = 1.5;
  const D3 = {
    rz: D2.rz,
    regla: ['Con θ medido desde la horizontal del ojo, la visual sube o baja ', junto([dI('d'), ' · tan θ']), ' (d, por el suelo).'],
    ojo: 'Si la visual sale de los ojos o de un instrumento, su altura sobre el suelo se suma.',
    alt: 'Entre dos horizontales, la visual forma ángulos alternos internos: miden lo mismo.',
    rzr: D2.rzr,
    vt: 't = d ÷ v: el tiempo es la distancia entre los metros que avanza en cada segundo.',
  };
  // La niña (x = 0) mira la canasta del globo, que sube recto en x = dv. rot: h (sobre los ojos), ojo (1,5 m), d, t y dep
  // (la depresión desde la canasta, si o.dep).
  function globoFig(dv, g, rot = {}, o = {}) {
    const ga = abre(g, o), y = OJO + dv * Math.tan(ga * RAD), C = [dv, y], E0 = [0, OJO], hayDep = o.dep !== undefined;
    const L = [{ de: E0, a: C, como: 'vista', rol: 'H' }, { de: [dv, 0], a: C, como: 'punteada' }];
    if (rot.h !== undefined) L.push({ de: [dv, OJO], a: C, como: 'cota', color: rot.h === '?' ? null : 'o', texto: rot.h, lado: -1, sep: 14, rol: 'CO' });
    if (rot.ojo !== undefined) L.push({ de: [dv, 0], a: [dv, OJO], como: 'cota', texto: rot.ojo, lado: -1, sep: 14 });
    if (rot.d !== undefined) L.push({ de: [0, 0], a: [dv, 0], como: 'cota', color: rot.d === '?' ? null : 'i', texto: rot.d, lado: -1, sep: 12, rol: 'CA' });
    return { ojo: OJO, marco: o.marco, objetos: [{ tipo: 'persona', x: 0, lado: 1 }, { tipo: 'globo', x: dv, y }],
      horizontales: [{ en: E0, hasta: dv }].concat(hayDep ? [{ en: C, hasta: 0, paso: o.dep }] : []),
      lados: L,
      angulos: [{ en: E0, de: [dv, OJO], a: C, texto: rot.t, ref: true }].concat(hayDep ? [{ en: C, de: [0, y], a: E0, texto: rot.dep, paso: o.dep }] : []),
      rectos: [{ en: [dv, OJO], de: E0, a: C }] };
  }
  // Algo alto (edificio, árbol o poste) a dv del observador: con ojos (ojoV > 0) es una persona; sin ellos, un punto del
  // suelo. La altura total va como cota del lado de afuera del objeto.
  function torreFig(obj, dv, ojoV, g, rot = {}, o = {}) {
    const ga = abre(g, o), sobre = dv * Math.tan(ga * RAD), H = ojoV + sobre, E0 = [0, ojoV], T = [dv, H], ancho = obj === 'edificio' ? Math.max(3, H * 0.35) : 0;
    const L = [{ de: E0, a: T, como: 'vista', rol: 'H' }];
    if (rot.h !== undefined) L.push({ de: [dv + ancho, 0], a: [dv + ancho, H], como: 'cota', color: rot.h === '?' ? null : 'o', texto: rot.h, lado: -1, sep: obj === 'edificio' ? 8 : 14, rol: 'CO' });
    if (rot.ojo !== undefined && ojoV > 0) L.push({ de: [0, 0], a: E0, como: 'cota', texto: rot.ojo, lado: -1, sep: 14 });
    if (rot.d !== undefined) L.push({ de: [0, 0], a: [dv, 0], como: 'cota', color: rot.d === '?' ? null : 'i', texto: rot.d, lado: -1, sep: 12, rol: 'CA' });
    return { ojo: ojoV > 0 ? ojoV : undefined, marco: o.marco,
      objetos: [ojoV > 0 ? { tipo: 'persona', x: 0, lado: 1 } : { tipo: 'ojo', x: 0, y: 0 }, { tipo: obj, x: dv, h: H, ancho, lado: 1 }],
      horizontales: ojoV > 0 ? [{ en: E0, hasta: dv }] : [],
      lados: L, angulos: [{ en: E0, de: [dv, ojoV], a: T, texto: rot.t, ref: true }] };
  }
  // Desde lo alto (faro, acantilado, edificio o balcón) de altura h, en x = 0, hacia algo del suelo en x = dv: la
  // horizontal de arriba, la visual y la depresión; con o.elev, también la elevación desde abajo.
  function altoFig(obj, h, dv, g, rot = {}, o = {}) {
    const ga = abre(g, o), dd0 = h / Math.tan(ga * RAD), x = o.fijo ? dv : dd0, T = [0, h], B = [x, 0], ancho = obj === 'acantilado' ? 10 : obj === 'faro' ? 4 : 6;
    const blanco = o.blanco || (obj === 'faro' || obj === 'acantilado' ? 'lancha' : 'auto');
    const L = [{ de: T, a: B, como: 'vista', texto: rot.H, lado: 1, rol: 'H' }];
    if (rot.h !== undefined) L.push({ de: [-ancho, 0], a: [-ancho, h], como: 'cota', color: rot.h === '?' ? null : 'o', texto: rot.h, lado: 1, sep: 8, rol: 'CO' });
    if (rot.d !== undefined) L.push({ de: [0, 0], a: B, como: 'cota', color: rot.d === '?' ? null : 'i', texto: rot.d, lado: -1, sep: 12, rol: 'CA' });
    return { agua: (obj === 'faro' || obj === 'acantilado') && !o.seco ? [0, x + 30] : undefined, marco: o.marco,
      objetos: [{ tipo: obj === 'balcon' ? 'edificio' : obj, x: 0, h, ancho, lado: -1 }, { tipo: blanco, x, lado: -1 }],
      horizontales: [{ en: T, hasta: x }],
      lados: L, rectos: [{ en: [0, 0], de: [1, 0], a: [0, 1] }],   // el pie, con su ángulo recto (lector A: «¿desde dónde se mide el pie?»)
      angulos: [{ en: T, de: [x, h], a: B, texto: rot.t, ref: true }].concat(o.elev ? [{ en: B, de: [0, 0], a: T, texto: rot.elev, paso: o.elev }] : []) };
  }
  // Desde una ventana a h0 del suelo, un edificio de enfrente a dv: su base con depresión β y su azotea con elevación α.
  // Fuera de escala, la elevación dibujada se corre de 8° en 8° hasta que ni la altura del edificio (medida con la de la
  // ventana) ni el ángulo entero (depresión más elevación) se puedan medir: 15 % y 12° de diferencia, por lo menos
  // (cierre, 19 nov: con 37° y 45°, dibujados de 27° y 36°, el edificio medía 21,8 m con la regla de los 9 m; eran 21).
  function ventanaAbre(h0, gb, ga, o) {
    if (o.escala) return [gb, ga];
    const b = abre(gb, o), real = h0 + h0 / Math.tan(A0(gb)) * Math.tan(A0(ga)), phi = gb + ga;
    // o.pide: 'f' si se pide el ángulo (idea 5); si no, la altura del edificio (idea 3).
    for (const dg of [0, -8, 8, -16, 16, -24]) {
      const a = abre(ga, o) + dg;
      if (a < 8 || a > 80) continue;
      const top = h0 + h0 / Math.tan(b * RAD) * Math.tan(a * RAD);
      if (o.pide === 'f' ? Math.abs(a + b - phi) >= 12 : Math.abs(top - real) / real >= 0.15) return [b, a];
    }
    return [b, abre(ga, o)];
  }
  function ventanaFig(h0, gb, ga, rot = {}, o = {}) {
    const [bd, ad] = ventanaAbre(h0, gb, ga, o);
    const dv = h0 / Math.tan(bd * RAD), top = h0 + dv * Math.tan(ad * RAD), W0 = [0, h0];
    const L = [{ de: W0, a: [dv, top], como: 'vista' }, { de: W0, a: [dv, 0], como: 'vista' }];
    if (rot.h0 !== undefined) L.push({ de: [-5, 0], a: [-5, h0], como: 'cota', color: 'o', texto: rot.h0, lado: 1, sep: 8 });
    if (rot.H !== undefined) L.push({ de: [dv + 6, 0], a: [dv + 6, top], como: 'cota', texto: rot.H, lado: -1, sep: 8 });
    if (rot.sube !== undefined) L.push({ de: [dv + 6, h0], a: [dv + 6, top], como: 'cota', color: 'o', texto: rot.sube, lado: -1, sep: 8 });
    if (rot.d !== undefined) L.push({ de: [0, 0], a: [dv, 0], como: 'cota', color: rot.d === '?' ? null : 'i', texto: rot.d, lado: -1, sep: 12, rol: 'CA' });
    return { objetos: [{ tipo: 'edificio', x: 0, h: h0 + 3, ancho: 5, lado: -1 }, { tipo: 'ojo', x: 0, y: h0 }, { tipo: 'edificio', x: dv, h: top, ancho: 6, lado: 1 }],
      horizontales: [{ en: W0, hasta: dv }], lados: L,
      angulos: rot.f !== undefined ? [{ en: W0, de: [dv, 0], a: [dv, top], texto: rot.f, radio: 30 }]
        : [{ en: W0, de: [dv, h0], a: [dv, top], texto: rot.a }, { en: W0, de: [dv, h0], a: [dv, 0], texto: rot.b }] };
  }
  // Una altura «tramo + ojos»: «5√3 + 1,5 m ≈ 10,16 m», o «21,5 m» si el tramo es exacto.
  const conOjos = (x, ojoV, u = 'm') => (decExacto(Ex.suma(x, E(Math.round(ojoV * 10), 10))) ? `${f(Ex.val(x) + ojoV, 3)} ${u}`
    : `${Ex.txt(x)} + ${f(ojoV)} ${u} ≈ ${f(Ex.val(x) + ojoV)} ${u}`);

  // Ejemplos de la idea 3. Cuentas rehechas aparte (cuentas-ejemplos.js): 30·3/4; 40·3/4; 30·√3/3; 8·√3; tan = 6/(6√3);
  // 12·1 + 1,5; 20·3/4 + 1,2; 60·5/3 (y 60·4/3); (7,5 − 1,5)·1; 9/12; 9·4/3 = 12 y 9 + 12·1; 9·4/3 = 12 y 9·1 = 9;
  // 21·24/7; 300·√3 ÷ 1,5; (20 − 8)·1, y el valor de cada alternativa equivocada.
  const ALT3 = {
    ventana: ['12 m', '3 m', '21 m', '15,75 m', '18 m'],
    antena: ['13,5 m', '10,5 m', '1,5 m', '3 m', '12 m'],
    faro: ['6,125 m', '75 m', '21 m', '20,16 m', '72 m'],
    plaza: ['≈ 346,4 s', '200 s', '≈ 115,5 s', '400 s', '≈ 519,6 s'],
    arbol: ['20 m', '12 m', '8 m', '28 m', '12√2 m'],
  };
  const EJEMPLOS_3 = [
    { nivel: 1, titulo: 'La torre de la iglesia', figura: fig(torreFig('edificio', 30, 0, 37, { d: '30 m', t: '37°', h: '?' })),
      enunciado: jN('Desde un punto del suelo, a 30 m del pie de la torre de una iglesia, su punta se ve con 37° de elevación. ¿Cuánto mide la torre?' + NO_ESC),
      datos: [D3.regla, v4(37)],
      solucion: [{ texto: ['La torre es el opuesto a la elevación; el suelo, el adyacente: la tangente.'], ecuacion: junto([hh, ' = 30 · tan 37° = 30 · ', frac('3', '4'), ' = ', dO('22,5 m')]) }],
      respuesta: [dO('22,5 m')] },
    { nivel: 1, titulo: 'El faro y la lancha', figura: fig(altoFig('faro', 40, 0, 53, { h: '40 m', t: '53°', d: '?' })),
      enunciado: jN('Desde lo alto de un faro de 40 m se ve una lancha con un ángulo de depresión de 53°. ¿A qué distancia del pie del faro está la lancha?' + NO_ESC),
      datos: [D3.regla, D3.rzr, v4(53), D3.alt],
      solucion: [{ texto: ['Desde arriba, la altura del faro es el opuesto a la depresión y el suelo, el adyacente: la cotangente.'], ecuacion: junto([dd, ' = 40 · cot 53° = 40 · ', frac('3', '4'), ' = ', dI('30 m')]) }],
      respuesta: [dI('30 m')] },
    { nivel: 1, titulo: 'La distancia al edificio', figura: fig(torreFig('edificio', 17.32, 0, 60, { h: '30 m', t: '60°', d: '?' })),
      enunciado: jN('La azotea de un edificio de 30 m se ve desde un punto del suelo con 60° de elevación. ¿A qué distancia del edificio está ese punto?' + NO_ESC),
      datos: [D3.regla, D3.rzr, v4(60)],
      solucion: [{ texto: ['El suelo es el adyacente y la altura, el opuesto: la cotangente.'], ecuacion: junto([dd, ' = 30 · cot 60° = 30 · ', frac('√3', '3'), ' = ', dI('10√3 m'), ' ≈ ', dI('17,32 m')]) }],
      respuesta: [dI('10√3 m'), ' ≈ ', dI('17,32 m')] },
    { nivel: 1, titulo: 'Desde el balcón', figura: fig(altoFig('balcon', 8, 0, 30, { h: '8 m', t: '30°', d: '?' }, { blanco: 'persona' })),
      enunciado: jN('Desde un balcón a 8 m del suelo, una señora ve a su hijo en la vereda con un ángulo de depresión de 30°. ¿A qué distancia del edificio está el niño?' + NO_ESC),
      datos: [D3.regla, D3.rzr, v4(30), D3.alt],
      solucion: [{ texto: ['La altura del balcón es el opuesto a la depresión; la distancia, el adyacente.'], ecuacion: junto([dd, ' = 8 · cot 30° = ', dI('8√3 m'), ' ≈ ', dI('13,86 m')]) }],
      respuesta: [dI('8√3 m'), ' ≈ ', dI('13,86 m')] },
    { nivel: 1, titulo: 'El ángulo de elevación', figura: fig(torreFig('arbol', 6 * Math.sqrt(3), 0, otroAngulo(30), { h: '6 m', d: '6√3 m', t: '?' }, { escala: true })),
      enunciado: jN('Un árbol de 6 m está a 6√3 m de un punto del suelo. ¿Con qué ángulo de elevación se ve su punta desde ese punto?' + NO_ESC),
      datos: [D2.rz, v4(30), v4(60)],
      solucion: [{ texto: ['La tangente del ángulo es el opuesto entre el adyacente; se reconoce el notable.'], ecuacion: junto(['tan θ = ', frac('6', '6√3'), ' = ', frac('√3', '3'), '  →  ', th, ' = ', dH('30°')]) }],
      respuesta: [th, ' = ', dH('30°')] },
    { nivel: 2, titulo: 'La pared y el instrumento', figura: fig(torreFig('edificio', 12, 1.5, 45, { d: '12 m', t: '45°', ojo: '1,5 m', h: '?' })),
      enunciado: jN('A 12 m de una pared, un instrumento de 1,5 m de alto ve lo alto de la pared con 45° de elevación. ¿Cuánto mide la pared?' + NO_ESC),
      datos: [D3.regla, D3.ojo, v4(45)],
      solucion: [
        { texto: ['Sobre el instrumento, la tangente da el tramo de arriba:'], ecuacion: junto(['12 · tan 45° = 12 · 1 = ', dO('12 m')]) },
        { texto: ['Se suma la altura del instrumento:'], ecuacion: junto([dO('12'), ' + 1,5 = ', dO('13,5 m')]) },
      ],
      respuesta: [dO('13,5 m')] },
    { nivel: 2, titulo: 'Un instrumento de 1,2 m', figura: fig(torreFig('poste', 20, 1.2, 37, { d: '20 m', t: '37°', ojo: '1,2 m', h: '?' })),
      enunciado: jN('Un instrumento de 1,2 m, a 20 m de un poste, ve su punta con 37° de elevación. ¿Cuánto mide el poste?' + NO_ESC),
      datos: [D3.regla, D3.ojo, v4(37)],
      solucion: [
        { texto: ['El tramo sobre el instrumento:'], ecuacion: junto(['20 · tan 37° = 20 · ', frac('3', '4'), ' = ', dO('15 m')]) },
        { texto: ['Más lo que mide el instrumento:'], ecuacion: junto([dO('15'), ' + 1,2 = ', dO('16,2 m')]) },
      ],
      respuesta: [dO('16,2 m')] },
    { nivel: 2, titulo: 'La visual desde el acantilado', figura: fig(altoFig('acantilado', 60, 0, 37, { h: '60 m', t: '37°', H: '?' }, { blanco: 'barco' })),
      enunciado: jN('Desde lo alto de un acantilado de 60 m se ve un barco con 37° de depresión. ¿Cuánto mide la visual, del ojo al barco?' + NO_ESC),
      datos: [D3.regla, D3.rzr, ...v6(37), D3.alt],
      solucion: [
        { texto: ['La visual es la hipotenusa; la altura, el opuesto a la depresión: la cosecante.'], ecuacion: junto(['H = 60 · csc 37° = 60 · ', frac('5', '3'), ' = ', neg('100 m')]) },
        { texto: ['Tiene sentido: el barco está a 60 · cot 37° = 80 m, y la visual es la más larga.'] },
      ],
      respuesta: [neg('100 m')] },
    { nivel: 2, titulo: 'Del suelo a la copa', figura: fig(torreFig('arbol', 6, 1.5, 45, { h: '7,5 m', t: '45°', ojo: '1,5 m', d: '?' })),
      enunciado: jN('Una niña, con los ojos a 1,5 m del suelo, ve la copa de un árbol de 7,5 m con 45° de elevación. ¿A qué distancia del árbol está?' + NO_ESC),
      datos: [D3.regla, D3.ojo, D3.rzr, v4(45)],
      solucion: [
        { texto: ['Sobre sus ojos, el árbol tiene 7,5 − 1,5 = 6 m: ese es el opuesto.'] },
        { texto: ['El suelo, con la cotangente:'], ecuacion: junto([dd, ' = 6 · cot 45° = 6 · 1 = ', dI('6 m')]) },
      ],
      respuesta: [dI('6 m')] },
    { nivel: 2, titulo: 'La depresión en grados', figura: fig(altoFig('edificio', 9, 0, otroAngulo(37), { h: '9 m', d: '12 m', t: '?' }, { escala: true })),
      enunciado: jN('Desde una ventana a 9 m del suelo ves un auto a 12 m del pie del edificio. ¿Con qué ángulo de depresión lo ves?' + NO_ESC),
      datos: [D2.rz, v4(37), D3.alt],
      solucion: [
        { texto: ['La depresión de arriba mide lo mismo que la elevación desde el auto (alternos internos). Desde ahí, 9 es el opuesto y 12 el adyacente:'] },
        { texto: ['Se reconoce el notable:'], ecuacion: junto(['tan θ = ', frac('9', '12'), ' = ', frac('3', '4'), '  →  ', th, ' = ', dH('37°')]) },
      ],
      respuesta: [th, ' = ', dH('37°')] },
    // Nivel 3, tipo examen. Letras de las correctas: C, D, E, A, B (las figuras no tienen puntos con letras).
    { nivel: 3, titulo: 'Elevación y depresión a la vez', figura: fig(ventanaFig(9, 37, 45, { h0: '9 m', a: '45°', b: '37°', H: '?' })),
      enunciado: jN('Desde una ventana a 9 m del suelo se ve la base de un edificio de enfrente con 37° de depresión y su azotea con 45° de elevación. ¿Cuánto mide ese edificio?' + NO_ESC),
      alternativas: ALT3.ventana,
      datos: [D3.regla, D3.rzr, v4(37), v4(45), D3.alt],
      solucion: [
        { texto: ['Con la depresión, la distancia entre los edificios:'], ecuacion: junto([dd, ' = 9 · cot 37° = 9 · ', frac('4', '3'), ' = ', dI('12 m')]) },
        { texto: ['Sobre la ventana, con la elevación; y se suma lo de abajo:'], ecuacion: junto(['12 · tan 45° + 9 = 12 + 9 = ', dO('21 m')]) },
        { texto: ['12 m es solo el tramo de arriba; 3 m resta los tramos; 15,75 m mide la depresión desde la pared; 18 m pone arriba lo mismo que abajo.'] },
      ],
      respuesta: [letra(ALT3.ventana, '21 m'), ', ', dO('21 m')] },
    { nivel: 3, titulo: 'La antena sobre el edificio', figura: fig((() => { const dv = 9, o2 = 1.5, a1 = abre(45), a2 = abre(53), az = o2 + dv * Math.tan(a1 * RAD), pu = o2 + dv * Math.tan(a2 * RAD);
        return { ojo: o2, objetos: [{ tipo: 'persona', x: 0, lado: 1 }, { tipo: 'edificio', x: dv, h: az, ancho: 5, lado: 1 }, { tipo: 'antena', x: dv + 1, h: pu }],
          horizontales: [{ en: [0, o2], hasta: dv }],
          lados: [{ de: [0, o2], a: [dv, az], como: 'vista' }, { de: [0, o2], a: [dv + 1, pu], como: 'vista' }, { de: [dv + 6, az], a: [dv + 6, pu], como: 'cota', texto: '?', lado: -1, sep: 8 }, { de: [0, 0], a: [dv, 0], como: 'cota', color: 'i', texto: '9 m', lado: -1, sep: 12 }, { de: [0, 0], a: [0, o2], como: 'cota', texto: '1,5 m', lado: 1, sep: 14 }],
          angulos: [{ en: [0, o2], de: [dv, o2], a: [dv, az], texto: '45°', radio: 30 }, { en: [0, o2], de: [dv, o2], a: [dv + 1, pu], texto: '53°', radio: 48 }] }; })()),
      enunciado: jN('Un instrumento de 1,5 m está a 9 m de un edificio. Ve la azotea con 45° de elevación y la punta de la antena que está encima, con 53°. ¿Cuánto mide la antena?' + NO_ESC),
      alternativas: ALT3.antena,
      datos: [D3.regla, D3.ojo, v4(45), v4(53)],
      solucion: [
        { texto: ['Las dos alturas sobre el instrumento:'], ecuacion: [junto(['9 · tan 53° = 9 · ', frac('4', '3'), ' = ', dO('12')]), SEP, junto(['9 · tan 45° = ', dO('9')])] },
        { texto: ['La antena es la diferencia: el instrumento no cambia nada, está en las dos.'], ecuacion: junto([dO('12'), ' − ', dO('9'), ' = ', dO('3 m')]) },
        { texto: ['13,5 m es la punta desde el suelo; 10,5 m, la azotea desde el suelo; 12 m, la punta sobre el instrumento; 1,5 m es el instrumento.'] },
      ],
      respuesta: [letra(ALT3.antena, '3 m'), ', ', dO('3 m')] },
    { nivel: 3, titulo: 'La lancha lejana', figura: fig(altoFig('faro', 21, 0, 16, { h: '21 m', t: '16°', d: '?' })),
      enunciado: jN('Desde lo alto de un faro de 21 m, una lancha se ve con 16° de depresión. ¿A qué distancia del pie del faro está la lancha?' + NO_ESC),
      alternativas: ALT3.faro,
      datos: [D3.regla, D3.rzr, v4(16), D3.alt],
      solucion: [
        { texto: ['La depresión mide lo mismo que la elevación desde la lancha: el faro es su opuesto y el suelo, su adyacente.'] },
        { texto: ['La cotangente:'], ecuacion: junto([dd, ' = 21 · cot 16° = 21 · ', frac('24', '7'), ' = ', dI('72 m')]) },
        { texto: ['6,125 m usa la tangente (mide desde el faro); 75 m es la visual; 21 m es el faro; 20,16 m multiplica por el coseno.'] },
      ],
      respuesta: [letra(ALT3.faro, '72 m'), ', ', dI('72 m')] },
    { nivel: 3, titulo: 'La plaza desde el barranco', figura: fig(altoFig('acantilado', 300, 0, 30, { h: '300 m', t: '30°', d: '?' }, { blanco: 'persona', seco: true })),
      enunciado: jN('Desde lo alto de un barranco de 300 m, la plaza se ve con 30° de depresión. Un niño camina del pie del barranco a la plaza a 1,5 m/s. ¿Cuánto tarda?' + NO_ESC),
      alternativas: ALT3.plaza,
      datos: [D3.regla, D3.rzr, v4(30), D3.vt, D3.alt],
      solucion: [
        { texto: ['El camino es el adyacente a la depresión:'], ecuacion: junto([dd, ' = 300 · cot 30° = ', dI('300√3 m'), ' ≈ ', dI('519,6 m')]) },
        { texto: ['El tiempo es la distancia entre lo que avanza en cada segundo:'], ecuacion: junto(['t = ', frac('300√3', '1,5'), ' = 200√3 s ≈ 346,4 s']) },
        { texto: ['200 s camina solo 300 m; 115,5 s usa la tangente; 400 s camina la visual, 600 m; 519,6 s no divide entre 1,5 m/s.'] },
      ],
      respuesta: [letra(ALT3.plaza, '≈ 346,4 s'), ', 200√3 s ≈ 346,4 s'] },
    { nivel: 3, titulo: 'El árbol desde la azotea', figura: fig((() => { const a = abre(45), dv = 12 / Math.tan(a * RAD);
        return { objetos: [{ tipo: 'edificio', x: 0, h: 20, ancho: 6, lado: -1 }, { tipo: 'arbol', x: dv, h: 8 }],
          horizontales: [{ en: [0, 20], hasta: dv }],
          lados: [{ de: [0, 20], a: [dv, 8], como: 'vista' }, { de: [-6, 0], a: [-6, 20], como: 'cota', color: 'o', texto: '20 m', lado: 1, sep: 8 }, { de: [dv, 0], a: [dv, 8], como: 'cota', color: 'o', texto: '8 m', lado: -1, sep: 16 }, { de: [0, 0], a: [dv, 0], como: 'cota', texto: '?', lado: -1, sep: 12 }],
          angulos: [{ en: [0, 20], de: [dv, 20], a: [dv, 8], texto: '45°' }] }; })()),
      enunciado: jN('Desde la azotea de un edificio de 20 m, la copa de un árbol de 8 m se ve con 45° de depresión. ¿A qué distancia del edificio está el árbol?' + NO_ESC),
      alternativas: ALT3.arbol,
      datos: [D3.regla, D3.rzr, v4(45), D3.alt],
      solucion: [
        { texto: ['La visual no baja hasta el suelo: baja de 20 m a 8 m. El opuesto a la depresión es 20 − 8 = 12 m.'] },
        { texto: ['La distancia, con la cotangente:'], ecuacion: junto([dd, ' = 12 · cot 45° = 12 · 1 = ', dI('12 m')]) },
        { texto: ['20 m usa el edificio entero; 8 m, el árbol; 28 m suma los dos; 12√2 m es el largo de la visual.'] },
      ],
      respuesta: [letra(ALT3.arbol, '12 m'), ', ', dI('12 m')] },
  ];

  // El juego del globo: la escala no cambia (el marco es el del globo más lejano con el ángulo más alto).
  const MARCO3 = [[0, 0], [20, OJO + 20 * Math.sqrt(3)]];
  const sobreOjos = val => Ex.por(E(val.d), razon('tan', val.g));
  const globoJ = val => globoFig(val.d, val.g, { t: `${val.g}°`, h: exTxt(sobreOjos(val), 'm'), ojo: '1,5 m', d: `d = ${val.d} m` }, { escala: true, marco: MARCO3 });
  // «Así se resuelve»: la depresión desde lo alto de un faro o un acantilado, o la elevación con ojos hacia un edificio.
  function resuelve3(sem) {
    const rr = azar(sem + 900), tipo = sem % 2;
    if (tipo === 0) {
      const obj = rr.uno(['faro', 'acantilado']), g = rr.uno([30, 37, 53, 60]), h = rr.uno(CONV(g) ? [24, 36, 48] : [20, 30, 50]);
      const dist = Ex.por(E(h), razon('cot', g)), blanco = obj === 'faro' ? 'una lancha' : 'un barco';
      const fd = todo => fig(altoFig(obj, h, 0, g, { h: `${h} m`, t: `${g}°`, d: todo ? exTxt(dist, 'm') : '?', elev: todo ? `${g}°` : undefined }, { blanco: obj === 'faro' ? 'lancha' : 'barco', elev: todo ? 0 : undefined }));
      return {
        enunciado: jN(`Desde lo alto de ${obj === 'faro' ? 'un faro' : 'un acantilado'} de ${h} m se ve ${blanco} con un ángulo de depresión de ${g}°. ¿A qué distancia del pie está?${NO_ESC}`),
        datos: [D3.regla, D3.rzr, v4(g), D3.alt],
        dibujo: fd(false),
        pasos: [
          { tipo: 'pide', texto: ['Piden la distancia por el suelo, ', dd, '.'] },
          { tipo: 'datos', texto: [`La altura es ${h} m y la depresión, ${g}°, medida desde la horizontal de arriba.`] },
          { tipo: 'regla', texto: [`Entre las dos horizontales, la depresión y la elevación desde ${blanco} son alternos internos: miden lo mismo. Desde ahí, la altura es el opuesto y el suelo, el adyacente.`], ecuacion: junto([dd, ' = ', hh, ' · cot θ']) },
          { tipo: 'cuentas', texto: ['Se reemplaza:'], ecuacion: junto([dd, ` = ${h} · ${rzTxt('cot', g)} = `, dI(largo(dist))]), dibujo: fd(true) },
          { tipo: 'sentido', texto: [g > 45 ? 'Tiene sentido: con más de 45° la visual baja empinada y lo de abajo queda cerca, a menos que la altura.' : 'Tiene sentido: con menos de 45° la visual baja poco y lo de abajo queda lejos, a más que la altura.'] },
        ],
        respuesta: [dI(largo(dist))],
      };
    }
    const g = rr.uno([30, 37, 53, 60]), dv = rr.uno(CONV(g) ? [24, 36] : [10, 18]), ojoV = 1.5, sobre = Ex.por(E(dv), razon('tan', g));
    const fd = todo => fig(torreFig('edificio', dv, ojoV, g, { d: `${dv} m`, t: `${g}°`, ojo: '1,5 m', h: todo ? conOjos(sobre, ojoV).split(' ≈ ')[0] : '?' }));
    return {
      enunciado: jN(`Una persona, con los ojos a 1,5 m del suelo, está a ${dv} m de un edificio y ve su azotea con ${g}° de elevación. ¿Cuánto mide el edificio?${NO_ESC}`),
      datos: [D3.regla, D3.ojo, v4(g)],
      dibujo: fd(false),
      pasos: [
        { tipo: 'pide', texto: ['Piden la altura del edificio, desde el suelo.'] },
        { tipo: 'datos', texto: [`La distancia es ${dv} m, la elevación ${g}° y los ojos están a 1,5 m.`] },
        { tipo: 'regla', texto: ['La elevación nace en la horizontal de los ojos. La tangente da el tramo sobre los ojos; el tramo de abajo, 1,5 m, se suma.'], ecuacion: junto([hh, ' = ', dd, ' · tan θ + 1,5']) },
        { tipo: 'cuentas', texto: ['Se reemplaza y se suma:'], ecuacion: junto([hh, ` = ${dv} · ${rzTxt('tan', g)} + 1,5 = `, dO(conOjos(sobre, ojoV))]), dibujo: fd(true) },
        { tipo: 'sentido', texto: [`Tiene sentido: el tramo sobre los ojos, ${f(Ex.val(sobre))} m, es ${g > 45 ? 'mayor' : 'menor'} que la distancia, porque ${g}° es ${g > 45 ? 'más' : 'menos'} de 45°.`] },
      ],
      respuesta: [dO(conOjos(sobre, ojoV))],
    };
  }
  // «Ahora tú», tipo 0: la altura con la elevación y la altura de los ojos o de un instrumento.
  function casoElevacion(rr) {
    let obj, g, dv, ojoV;
    do {
      obj = rr.uno(['edificio', 'poste', 'arbol']); g = rr.uno([30, 37, 45, 53, 60]); ojoV = rr.uno([1.5, 1.2]);
      dv = rr.uno(g === 37 ? [8, 12, 16, 20] : g === 53 ? [6, 9, 12, 15] : obj === 'arbol' ? [4, 6, 8] : [6, 10, 12, 15]);
    } while ((obj === 'edificio' && g === 45 && dv === 12 && ojoV === 1.5) || (obj === 'poste' && g === 37 && dv === 20 && ojoV === 1.2));
    const nombre = { edificio: 'la azotea de un edificio', poste: 'la punta de un poste', arbol: 'la copa de un árbol' }[obj], quien = ojoV === 1.5 ? 'Una persona, con los ojos a 1,5 m del suelo,' : 'Un instrumento de 1,2 m de alto';
    const sobre = Ex.por(E(dv), razon('tan', g)), oT = f(ojoV);
    const fmt = x => conOjos(x.ex, x.sin ? 0 : ojoV).replace(' + 0 m', ' m');
    return {
      pregunta: jN(`${quien} está a ${dv} m y ve ${nombre} con ${g}° de elevación. ¿Cuánto mide desde el suelo?${NO_ESC}`),
      datos: [D3.regla, D3.ojo, v4(g)],
      dibujo: fig(torreFig(obj, dv, ojoV, g, { d: `${dv} m`, t: `${g}°`, ojo: `${oT} m`, h: '?' })),
      opciones: opciones({ ex: sobre }, [
        { id: 'ojo', valor: { ex: sobre, sin: true }, error: 'ELEV-OJO', siFuera: `Ese tramo está bien calculado; empieza en ${ojoV === 1.5 ? 'los ojos' : 'el instrumento'}: falta sumar ${oT} m.` },
        { id: 'vertical', valor: { ex: Ex.por(E(dv), razon('cot', g)) }, error: 'DEP-VERTICAL', siFuera: `Sumar ${oT} m va bien; pero ${g}° se mide desde la horizontal: va la tangente.` },
        { id: 'seno', valor: { ex: Ex.por(E(dv), razon('sen', g)) }, error: 'TR9', siFuera: `Sumar ${oT} m va bien; pero el seno no une la distancia con la altura.` },
      ], fmt),
      solucion: { texto: `La tangente da el tramo sobre ${ojoV === 1.5 ? 'los ojos' : 'el instrumento'}; se suma ${oT} m.`, ecuacion: junto([hh, ` = ${dv} · tan ${g}° + ${oT} = `, dO(conOjos(sobre, ojoV))]) },
    };
  }
  // «Ahora tú», tipo 1: la depresión desde lo alto de un faro, un acantilado o un edificio (la distancia o la altura).
  function casoDepresion(rr) {
    let obj, g, h, pide;
    do {
      obj = rr.uno(['faro', 'acantilado', 'edificio']); g = rr.uno([30, 37, 53, 60, 16]); pide = rr.uno(['d', 'h']);
      h = rr.uno(g === 16 ? [7, 14, 21, 28] : CONV(g) ? [12, 24, 36, 48] : [10, 20, 30, 40]);
    } while ((obj === 'faro' && g === 53 && h === 40) || (obj === 'faro' && g === 16 && h === 21) || (obj === 'acantilado' && g === 37 && h === 60));
    const lugar = { faro: 'un faro', acantilado: 'un acantilado', edificio: 'un edificio' }[obj], blanco = obj === 'edificio' ? 'un auto' : obj === 'faro' ? 'una lancha' : 'un barco';
    const dist = Ex.por(E(h), razon('cot', g));
    if (pide === 'h') {
      return {
        pregunta: jN(`Desde lo alto de ${lugar}, ${blanco} que está a ${exTxt(dist, 'm')} del pie se ve con ${g}° de depresión. ¿Cuánto mide de alto ${lugar.replace(/^un /, 'el ')}?${NO_ESC}`),
        datos: [D3.regla, D3.rzr, v4(g), D3.alt],
        dibujo: fig(altoFig(obj, h, 0, g, { h: '?', d: exTxt(dist, 'm'), t: `${g}°` }, { blanco: obj === 'edificio' ? 'auto' : obj === 'faro' ? 'lancha' : 'barco' })),
        opciones: opciones({ ex: E(h) }, [
          { id: 'vertical', valor: { ex: Ex.por(dist, razon('cot', g)) }, error: 'DEP-VERTICAL', siFuera: 'Multiplicar la distancia por una razón está bien; pero la depresión se mide desde la horizontal: va la tangente.' },
          { id: 'visual', valor: { ex: Ex.por(dist, razon('sec', g)) }, error: 'TR9', siFuera: 'Partir de la distancia está bien; esa razón da la visual, no la altura.' },
          { id: 'seno', valor: { ex: Ex.por(dist, razon('sen', g)) }, error: 'TR9', siFuera: 'Partir de la distancia está bien; el seno no une la distancia con la altura.' },
        ], x => largo(x.ex)),
        solucion: { texto: 'Desde abajo, la elevación mide lo mismo: la altura es el opuesto y la distancia, el adyacente.', ecuacion: junto([hh, ` = ${exTxt(dist)} · tan ${g}° = `, dO(`${h} m`)]) },
      };
    }
    return {
      pregunta: jN(`Desde lo alto de ${lugar} de ${h} m se ve ${blanco} con ${g}° de depresión. ¿A qué distancia del pie está?${NO_ESC}`),
      datos: [D3.regla, D3.rzr, v4(g), D3.alt],
      dibujo: fig(altoFig(obj, h, 0, g, { h: `${h} m`, d: '?', t: `${g}°` }, { blanco: obj === 'edificio' ? 'auto' : obj === 'faro' ? 'lancha' : 'barco' })),
      opciones: opciones({ ex: dist }, [
        { id: 'vertical', valor: { ex: Ex.por(E(h), razon('tan', g)) }, error: 'DEP-VERTICAL', siFuera: `Eso mide ${g}° desde la pared vertical. La depresión se mide desde la horizontal.` },
        { id: 'visual', valor: { ex: Ex.por(E(h), razon('csc', g)) }, error: 'TR9', siFuera: 'Ese es el largo de la visual, la hipotenusa. Se pide la distancia por el suelo.' },
        { id: 'igual', valor: { ex: E(h) }, error: 'RES-IGUAL', siFuera: 'Esa es la altura; solo a 45° la distancia mide lo mismo.' },
      ], x => largo(x.ex)),
      solucion: { texto: `La elevación desde abajo también es ${g}°: el suelo es el adyacente.`, ecuacion: junto([dd, ` = ${h} · cot ${g}° = `, dI(exTxt(dist, 'm'))]) },
    };
  }
  // «Ahora tú», tipo 2 (nivel de examen, San Marcos 2027-I): desde una ventana, la base de un edificio de enfrente con
  // depresión β y su azotea con elevación α. El de 9 m con 37° y 45° es el ejemplo 11.
  function casoVentana(rr) {
    let gb, h0, ga;
    do { gb = rr.uno([30, 37, 45, 53]); h0 = rr.uno(gb === 37 ? [6, 9, 12] : gb === 53 ? [8, 12, 16] : [6, 8, 10]); ga = rr.uno([30, 37, 45, 53, 60].filter(x => x !== gb)); } while (gb === 37 && ga === 45 && h0 === 9);
    const dist = Ex.por(E(h0), razon('cot', gb)), arriba = Ex.por(dist, razon('tan', ga)), tot = Ex.suma(E(h0), arriba);
    const fmt = x => largo(x.ex);
    return {
      pregunta: jN(`Desde una ventana a ${h0} m del suelo se ve la base de un edificio de enfrente con ${gb}° de depresión y su azotea con ${ga}° de elevación. ¿Cuánto mide ese edificio?${NO_ESC}`),
      datos: [D3.regla, D3.rzr, v4(gb), v4(ga), D3.alt],
      dibujo: fig(ventanaFig(h0, gb, ga, { h0: `${h0} m`, a: `${ga}°`, b: `${gb}°`, H: '?' })),
      opciones: opciones({ ex: tot }, [
        { id: 'resta', valor: { ex: Ex.resta(arriba, E(h0)) }, error: 'DEP-RESTA', siFuera: 'Los dos tramos están bien; pero se suman: el edificio tiene el de abajo y el de arriba.' },
        { id: 'ojo', valor: { ex: arriba }, error: 'ELEV-OJO', siFuera: `Ese es el tramo sobre la ventana; falta sumar los ${h0} m de abajo.` },
        { id: 'vertical', valor: { ex: Ex.suma(E(h0), Ex.por(Ex.por(E(h0), razon('tan', gb)), razon('tan', ga))) }, error: 'DEP-VERTICAL', siFuera: `Sumar está bien; pero la distancia sale con la cotangente de ${gb}°, desde la horizontal.` },
      ], fmt),
      solucion: { texto: `Con la depresión, la distancia: ${h0} · cot ${gb}° = ${exTxt(dist, 'm')}. Arriba, con la elevación, y se suma.`, ecuacion: junto([`${h0} + ${Ex.txt(dist)} · tan ${ga}° = `, dO(largo(tot))]) },
    };
  }

  const elevacion = {
    id: 'elevacion-depresion',
    titulo: 'Ángulos de elevación y depresión',
    pregunta: '¿Desde dónde se mide un ángulo de elevación o de depresión?',
    temas: ['Ángulos de elevación y depresión'],
    pieza: VI,
    aprendizaje: 'Elevación y depresión se miden desde la horizontal del ojo; la depresión de arriba mide lo que la elevación de abajo; los ojos se suman.',
    actividad: 'Pararte lejos o cerca de un globo que sube y levantar la vista hasta su canasta.',
    // Lee: el objeto, la horizontal y los dos nombres. No dice cuánto mide la depresión desde el globo (la predicción).
    lee: {
      tarjetas: [
        { titulo: 'El globo de la feria', texto: 'En una feria, un globo aerostático amarrado sube recto desde su punto de partida. Una niña lo mira desde el suelo: sus ojos están a unos 1,5 m de altura.',
          pieza: VI, dibujo: { datos: globoFig(16, 40, {}, { escala: true }), estado: {} } },
        { titulo: 'Desde la horizontal', texto: ['La línea que sale de sus ojos cuando mira de frente es la horizontal. Lo que sube la mirada desde ahí es el ángulo de elevación, ', th, '. Lo que la baja, el de depresión.'] },
        { titulo: 'La visual', texto: 'La línea recta que va del ojo a la canasta es la visual. Con la horizontal y la cuerda del globo arma un triángulo rectángulo: la visual es su hipotenusa.' },
        { titulo: 'Qué mirar al jugar', texto: 'Vas a elegir a qué distancia del globo se para la niña y cuánto sube su mirada. Mira qué tramo de la altura sale de la tangente.' },
      ],
    },
    ejemplos: EJEMPLOS_3,
    juega: {
      pieza: VI,
      consigna: ['La niña mira la canasta con un ángulo de elevación ', th, '. Sus ojos están a 1,5 m del suelo; ', dd, ', su distancia al globo.'],
      mision: {
        texto: 'Con el globo a 20 m, haz que su canasta suba a 21,5 m del suelo.',
        logrado: val => val.d === 20 && val.g === 45,
        bien: 'Listo: 20 · tan 45° = 20 m sobre tus ojos, más 1,5 m.',
      },
      voz: '¿Desde dónde empieza el ángulo?',
      leyenda: [
        { s: th, t: 'elevación, desde la horizontal de los ojos' },
        { s: hh, t: 'altura de la canasta: naranja + 1,5 m' },
        { s: dd, t: 'distancia por el suelo hasta el globo' },
        { s: 'línea punteada', t: 'la horizontal de los ojos y la visual' },
      ],
      controles: [
        { id: 'd', etiqueta: 'd, distancia al globo', color: 'c-i', min: 10, max: 20, paso: 5, inicio: 10, unidad: 'm', decimales: 0 },
        { id: 'g', etiqueta: 'θ, ángulo de elevación', color: 'c-h', min: 30, max: 60, paso: 15, inicio: 30, unidad: '°', decimales: 0 },
      ],
      dibujo: val => ({ datos: globoJ(val), estado: {} }),
      lectura: val => jN([hh, ` = ${val.d} · tan ${val.g}° + 1,5 ${Ex.exacto(sobreOjos(val)) ? '=' : '≈'} ${f(Ex.val(sobreOjos(val)) + OJO)} m`]),
      minimo: 3,
    },
    predice: {
      pregunta: 'La niña ve la canasta del globo con 30° de elevación. Desde la canasta, el piloto la mira a ella. ¿Con qué ángulo de depresión la ve?' + NO_ESC,
      datos: ['Elevación desde los ojos de la niña: 30°.'],
      voz: 'Ubica la horizontal del piloto antes de medir.',
      opciones: [
        { id: 'c', texto: '30°, el mismo', correcta: true },
        { id: 'vertical', texto: '60°', error: 'DEP-VERTICAL', siFuera: 'Medir desde una línea está bien; pero la depresión nace en la horizontal del piloto, no en la cuerda.' },
        { id: 'falta', texto: 'No se sabe sin la altura', error: 'DEP-FALTA', siFuera: 'Calcular la altura sería un camino; pero basta mirar las dos horizontales: son paralelas.' },
        { id: 'suple', texto: '150°', error: 'DEP-SUPLE', siFuera: 'La horizontal es la línea correcta; pero se mide hacia el lado de la niña: un ángulo agudo.' },
      ],
      dibujo: { datos: globoFig(16, 30, { t: '30°', dep: '?' }, { dep: 0 }), estado: {} },
      revelar: { datos: globoFig(16, 30, { t: '30°', dep: '30°' }, { dep: 0 }), estado: {} },
      coincide: 'Coincide: entre dos horizontales, la visual arma ángulos alternos internos. Miden lo mismo.',
      noCoincide: 'Revisemos: las dos horizontales son paralelas, y la visual las corta igual arriba y abajo.',
    },
    mira: {
      pieza: VI,
      datos: globoFig(16, 30, { t: '30°', dep: [{ t: '?' }, { t: '30°', paso: 3 }] }, { dep: 1 }),
      voz: 'Primero la horizontal; después el ángulo.',
      pasos: [
        { estado: { paso: 0 }, texto: 'Abajo, la elevación nace en la horizontal de los ojos: 30°.', ecuacion: ['elevación = ', dH('30°')] },
        { estado: { paso: 1 }, texto: 'Arriba, el piloto mira desde su propia horizontal, hacia abajo.', ecuacion: ['depresión = ?'] },
        { estado: { paso: 2 }, texto: 'Las dos horizontales son paralelas y la visual las corta.', ecuacion: ['ángulos alternos internos'] },
        { estado: { paso: 3 }, texto: 'Los ángulos alternos internos miden lo mismo.', ecuacion: junto(['depresión = elevación = ', dH('30°')]) },
        { estado: { paso: 3 }, texto: 'Desde arriba o abajo, la altura es el opuesto y el suelo, el adyacente.', ecuacion: junto(['tan 30° = ', frac(CO, CA)]) },
      ],
    },
    regla: {
      texto: 'La elevación y la depresión se miden desde la horizontal de quien mira, nunca desde la vertical. La depresión desde arriba mide lo mismo que la elevación desde abajo.',
      ecuacion: [junto(['sobre el ojo: ', dd, ' · tan ', th]), SEP, junto([hh, ' = ', dd, ' · tan ', th, ' + ojos']), SEP, junto(['depresión = elevación'])],
      condicion: 'θ desde la horizontal del ojo. Si la visual sale de los ojos o de un instrumento, se suma su altura.',
      voz: 'Primero la horizontal; después el ángulo.',
      dibujo: { pieza: VI, datos: (() => { const dv = 12, y = 9; return { objetos: [{ tipo: 'ojo', x: 0, y: 0 }, { tipo: 'edificio', x: dv, h: y, ancho: 4, lado: 1 }],
        horizontales: [{ en: [dv, y], hasta: 0 }],
        lados: [{ de: [0, 0], a: [dv, y], como: 'vista' }, { de: [dv + 4, 0], a: [dv + 4, y], como: 'cota', color: 'o', texto: 'h', lado: -1, sep: 8 }, { de: [0, 0], a: [dv, 0], como: 'cota', color: 'i', texto: 'd', lado: -1, sep: 12 }],
        angulos: [{ en: [0, 0], de: [dv, 0], a: [dv, y], texto: 'θ' }, { en: [dv, y], de: [0, y], a: [0, 0], texto: 'θ' }] }; })(), estado: {} },
    },
    resuelve: { pieza: VI, generar: resuelve3 },
    ahoraTu: {
      pieza: VI,
      voz: 'Ubica la horizontal y el ángulo antes de elegir la razón.',
      generar(sem) { return sinRepetir([casoElevacion, casoDepresion, casoVentana][sem % 3], sem, elevacion); },
    },
  };

  // ====================================================================================================================
  // Idea 4: dos ángulos hacia la misma punta
  // ====================================================================================================================
  // Objeto de la primera pantalla: un cerro visto desde la carretera, con una combi que mira su punta desde dos lugares.
  // Cambia: los dos ángulos de elevación, α (desde el lugar lejano) y β (desde el cercano). · Permanece: la altura del cerro,
  // 300 m. · Progresa: lo que avanzó la combi, d₁ − d₂ = h · cot α − h · cot β. · Se reserva: la altura con la caminata
  // conocida (la predicción). · Debe verse: los dos triángulos comparten la altura; cada distancia al pie es h · cot.
  // Errores: DOS-UN-TRIANGULO toma lo que se avanza por la distancia al pie; DOS-VISUAL toma la visual por la altura;
  // DOS-SUMA suma las cotangentes donde se restan (o al revés, DOS-RESTA); DOS-TAN usa tangentes donde van cotangentes;
  // DOS-MULTIPLICA multiplica donde se divide; DOS-SIN-T olvida el tiempo (d = v · t); DOS-SOLO toma una sola distancia
  // (todas hipótesis, salvo TR9).
  const D4 = {
    regla: [junto([d1, ' = ', hh, ' · cot α']), ' y ', junto([d2, ' = ', hh, ' · cot β']), ': las dos distancias al pie, con la misma altura.'],
    mismo: 'Del mismo lado del pie, lo que hay entre los dos lugares es d₁ − d₂; de lados opuestos, d₁ + d₂.',
    rzr: [junto(['cot θ = ', CA, '/', CO]), ': el adyacente entre el opuesto.'],
    vt: 'd = v · t: distancia = rapidez · tiempo, si la rapidez no cambia.',
    raiz: '√3 ≈ 1,73.',
  };
  // El cerro con su punta en (0, h) y los dos lugares a la derecha; rot: h, m (lo que hay entre los lugares), a, b, d1, d2.
  function cerroFig(h, ga, gb, rot = {}, o = {}) {
    const x1 = h / Math.tan(dibPar(ga, gb, o)[0] * RAD), x2 = h / Math.tan(dibPar(ga, gb, o)[1] * RAD), T = [0, h], tipo = o.tipo || 'cerro';
    const L = [{ de: [0, 0], a: T, como: 'punteada', color: rot.h === '?' ? null : 'o', texto: rot.h, lado: 1, rol: 'CO' }, { de: [x1, 0], a: T, como: 'vista' }, { de: [x2, 0], a: T, como: 'vista' }];
    if (rot.m !== undefined) L.push({ de: [x2, 0], a: [x1, 0], como: 'cota', color: rot.m === '?' ? null : 'i', texto: rot.m, lado: -1, sep: 12 });
    if (rot.d2 !== undefined) L.push({ de: [0, 0], a: [x2, 0], como: 'cota', color: rot.d2 === '?' ? null : 'i', texto: rot.d2, lado: -1, sep: 12 });
    const ob = tipo === 'cerro' ? { tipo: 'cerro', x: 0, h, ancho: Math.min(h * 0.9, x2 * 0.55) } : { tipo, x: 0, h, ancho: Math.max(2, h * 0.25), lado: -1 };
    const quien = o.quien || 'combi';
    return { marco: o.marco, objetos: [ob, { tipo: quien, x: x1, lado: -1, tenue: true, dx: quien === 'combi' ? 18 : 0 }, { tipo: quien, x: x2, lado: -1, dx: quien === 'combi' ? 18 : 0 }],
      lados: L,
      angulos: [{ en: [x1, 0], de: [0, 0], a: T, texto: rot.a, radio: 30 }, { en: [x2, 0], de: [0, 0], a: T, texto: rot.b, radio: 22 }] };
  }
  // Dos lugares a lados opuestos del pie de algo alto (en x = 0): A a la izquierda, con α; B a la derecha, con β.
  function opuestosFig(obj, h, ga, gb, rot = {}, o = {}) {
    const x1 = h / Math.tan(dibPar(ga, gb, o)[0] * RAD), x2 = h / Math.tan(dibPar(ga, gb, o)[1] * RAD), T = [0, h];
    const L = [{ de: [0, 0], a: T, como: obj === 'arbol' || obj === 'poste' ? 'cota' : 'punteada', color: rot.h === '?' ? null : 'o', texto: rot.h, lado: 1, sep: 14, rol: 'CO' }, { de: [-x1, 0], a: T, como: 'vista' }, { de: [x2, 0], a: T, como: 'vista' }];
    if (rot.m !== undefined) L.push({ de: [-x1, 0], a: [x2, 0], como: 'cota', color: rot.m === '?' ? null : 'i', texto: rot.m, lado: -1, sep: 12 });
    return { objetos: [{ tipo: obj, x: 0, h }, { tipo: o.quien || 'ojo', x: -x1, y: 0 }, { tipo: o.quien || 'ojo', x: x2, y: 0 }],
      lados: L,
      angulos: [{ en: [-x1, 0], de: [0, 0], a: T, texto: rot.a }, { en: [x2, 0], de: [0, 0], a: T, texto: rot.b }] };
  }
  // Desde lo alto (x = 0, altura h): dos puntos del suelo a la derecha, el lejano con depresión α y el cercano con β.
  function altoDosFig(obj, h, ga, gb, rot = {}, o = {}) {
    const x1 = h / Math.tan(dibPar(ga, gb, o)[0] * RAD), x2 = h / Math.tan(dibPar(ga, gb, o)[1] * RAD), T = [0, h], quien = o.quien || 'auto';
    const L = [{ de: T, a: [x1, 0], como: 'vista' }, { de: T, a: [x2, 0], como: 'vista' }];
    if (rot.h !== undefined) L.push({ de: [-4, 0], a: [-4, h], como: 'cota', color: rot.h === '?' ? null : 'o', texto: rot.h, lado: 1, sep: 8 });
    if (rot.m !== undefined) L.push({ de: [x2, 0], a: [x1, 0], como: 'cota', color: rot.m === '?' ? null : 'i', texto: rot.m, lado: -1, sep: 12 });
    const obs = obj === 'muro' ? [{ tipo: 'edificio', x: 0, h, ancho: 4, lado: -1 }] : obj === 'camara' ? [{ tipo: 'poste', x: 0, h }, { tipo: 'camara', x: 0, y: h }] : [{ tipo: obj, x: 0, h, ancho: 4, lado: -1 }];
    const abajo = obj === 'muro' ? [] : [{ tipo: quien, x: x1, lado: -1, tenue: true }, { tipo: quien, x: x2, lado: -1 }];
    if (obj === 'muro') L.push({ de: [x2, 0], a: [x1, 0], como: 'linea' });
    return { agua: obj === 'faro' ? [0, x1 + 20] : undefined, objetos: obs.concat(abajo), horizontales: [{ en: T, hasta: x1 }], lados: L,
      angulos: [{ en: T, de: [x1, h], a: [x1, 0], texto: rot.a, radio: 40 }, { en: T, de: [x1, h], a: [x2, 0], texto: rot.b, radio: 24 }] };
  }
  // Un dron que vuela horizontal a la altura h hacia el punto P (x = 0): primero con depresión α, después con β.
  function dronFig(h, ga, gb, rot = {}, o = {}) {
    const x1 = h / Math.tan(dibPar(ga, gb, o)[0] * RAD), x2 = h / Math.tan(dibPar(ga, gb, o)[1] * RAD), P = [0, 0];
    const L = [{ de: [x1, h], a: P, como: 'vista' }, { de: [x2, h], a: P, como: 'vista' }, { de: [x2, h], a: [x1, h], como: 'cota', color: rot.m === '?' ? null : 'i', texto: rot.m, lado: 1, sep: 12 }];
    if (rot.h !== undefined) L.push({ de: [0, 0], a: [0, h], como: 'punteada', color: rot.h === '?' ? null : 'o', texto: rot.h, lado: 1 });
    return { objetos: [{ tipo: 'dron', x: x1, y: h, tenue: true }, { tipo: 'dron', x: x2, y: h }, { tipo: 'ojo', x: 0, y: 0 }],
      horizontales: [{ en: [x1, h], hasta: 0 }], lados: L,
      angulos: [{ en: [x1, h], de: [0, h], a: P, texto: rot.a, radio: 26 }, { en: [x2, h], de: [0, h], a: P, texto: rot.b, radio: 22 }] };
  }
  const cotDif = (ga, gb) => Ex.resta(razon('cot', ga), razon('cot', gb));
  const cotSum = (ga, gb) => Ex.suma(razon('cot', ga), razon('cot', gb));
  const tanDif = (ga, gb) => Ex.resta(razon('tan', gb), razon('tan', ga));
  const v2a = (ga, gb) => (ga === gb ? [v4(ga)] : [v4(ga), v4(gb)]);

  // Ejemplos de la idea 4. Cuentas rehechas aparte (cuentas-ejemplos.js): 12·4/3 − 12·3/4; 9·4/3 + 9·3/4; 15·4/3 − 15·1;
  // 10√3 − 10; 24·4/3 − 24·3/4; 10/(4/3 − 1); 25/(4/3 + 3/4); 60/(√3 − √3/3); 20/(√3 − √3/3) · √3/3; 44/(24/7 − 4/3);
  // 28/(4/3 − 3/4); (12√3 − 4√3)/4; 30√3 − 10√3; a/(cot α + cot β); 20/(4/3 − 1), y el valor de cada alternativa equivocada.
  const ALT4 = {
    dron: ['≈ 13,44 m', '≈ 6,86 m', '≈ 37,33 m', '48 m', '28 m'],
    camara: ['8√3 m/s', '4√3 m/s', '3√3 m/s', '√3 m/s', '2√3 m/s'],
    muro: ['20√3 m', '40√3 m', '10√3 m', '30√3 m', '60 m'],
    letras: ['a/(cot α − cot β)', 'a/(cot α + cot β)', 'a(tan α + tan β)', 'a/(tan α + tan β)', 'a(cot α + cot β)'],
    lanchas: ['20 m', '≈ 8,57 m', '60 m', '80 m', '15 m'],
  };
  const EJEMPLOS_4 = [
    { nivel: 1, titulo: 'Cuánto avanzó', figura: fig(cerroFig(12, 37, 53, { h: '12 m', a: '37°', b: '53°', m: '?' }, { tipo: 'edificio', quien: 'ojo' })),
      enunciado: jN('Desde un punto del suelo ves la punta de una torre de 12 m con 37° de elevación. Avanzas hacia ella hasta verla con 53°. ¿Cuánto avanzaste?' + NO_ESC),
      datos: [D4.regla, D4.rzr, v4(37), v4(53)],
      solucion: [
        { texto: ['Cada distancia al pie, con la misma altura:'], ecuacion: [junto([d1, ' = 12 · ', frac('4', '3'), ' = ', dI('16')]), SEP, junto([d2, ' = 12 · ', frac('3', '4'), ' = ', dI('9')])] },
        { texto: ['Del mismo lado: se restan.'], ecuacion: junto([dI('16'), ' − ', dI('9'), ' = ', dI('7 m')]) },
      ],
      respuesta: [dI('7 m')] },
    { nivel: 1, titulo: 'A los dos lados del poste', figura: fig(opuestosFig('poste', 9, 37, 53, { h: '9 m', a: '37°', b: '53°', m: '?' })),
      enunciado: jN('Desde dos puntos del suelo, a lados opuestos de un poste de 9 m, su punta se ve con 37° y con 53° de elevación. ¿Qué distancia hay entre los dos puntos?' + NO_ESC),
      datos: [D4.regla, D4.mismo, D4.rzr, v4(37), v4(53)],
      solucion: [
        { texto: ['Cada distancia al pie:'], ecuacion: [junto(['9 · ', frac('4', '3'), ' = ', dI('12')]), SEP, junto(['9 · ', frac('3', '4'), ' = ', dI('6,75')])] },
        { texto: ['A lados opuestos, se suman:'], ecuacion: junto([dI('12'), ' + ', dI('6,75'), ' = ', dI('18,75 m')]) },
      ],
      respuesta: [dI('18,75 m')] },
    { nivel: 1, titulo: 'Dos autos desde lo alto', figura: fig(altoDosFig('edificio', 15, 37, 45, { h: '15 m', a: '37°', b: '45°', m: '?' })),
      enunciado: jN('Desde la azotea de un edificio de 15 m se ven dos autos del mismo lado, en línea con el pie, con depresiones de 37° y 45°. ¿Qué distancia hay entre los autos?' + NO_ESC),
      datos: [D4.regla, D4.rzr, v4(37), v4(45), D3.alt],
      solucion: [
        { texto: ['Las depresiones son las elevaciones desde cada auto. Las distancias al pie:'], ecuacion: [junto(['15 · ', frac('4', '3'), ' = ', dI('20')]), SEP, junto(['15 · 1 = ', dI('15')])] },
        { texto: ['Del mismo lado, se restan:'], ecuacion: junto([dI('20'), ' − ', dI('15'), ' = ', dI('5 m')]) },
      ],
      respuesta: [dI('5 m')] },
    { nivel: 1, titulo: 'Con 30° y 45°', figura: fig(cerroFig(10, 30, 45, { h: '10 m', a: '30°', b: '45°', m: '?' }, { tipo: 'tanque', quien: 'ojo' })),
      enunciado: jN('Un tanque elevado de 10 m se ve desde un punto del suelo con 30° y, desde otro más cerca, del mismo lado, con 45°. ¿Qué distancia hay entre los dos puntos?' + NO_ESC),
      datos: [D4.regla, D4.rzr, v4(30), v4(45)],
      solucion: [
        { texto: ['Las distancias al pie:'], ecuacion: [junto(['10 · cot 30° = ', dI('10√3')]), SEP, junto(['10 · cot 45° = ', dI('10')])] },
        { texto: ['Se restan:'], ecuacion: junto([dI('10√3'), ' − ', dI('10'), ' ≈ 17,32 − 10 = 7,32 m']) },
      ],
      respuesta: ['10√3 − 10 m ≈ ', dI('7,32 m')] },
    { nivel: 1, titulo: 'El muro entre edificios', figura: fig(altoDosFig('muro', 24, 37, 53, { h: '24 m', a: '37°', b: '53°', m: '?' })),
      enunciado: jN('Desde la azotea de un edificio de 24 m, el extremo lejano de un muro bajo se ve con 37° de depresión y el cercano, con 53°. ¿Cuánto mide el muro?' + NO_ESC),
      datos: [D4.regla, D4.rzr, v4(37), v4(53), D3.alt],
      solucion: [
        { texto: ['Las distancias al pie del edificio:'], ecuacion: [junto(['24 · ', frac('4', '3'), ' = ', dI('32')]), SEP, junto(['24 · ', frac('3', '4'), ' = ', dI('18')])] },
        { texto: ['El muro es lo que hay entre las dos:'], ecuacion: junto([dI('32'), ' − ', dI('18'), ' = ', dI('14 m')]) },
      ],
      respuesta: [dI('14 m')] },
    { nivel: 2, titulo: 'La altura con 37° y 45°', figura: fig(cerroFig(30, 37, 45, { h: '?', a: '37°', b: '45°', m: '10 m' }, { tipo: 'edificio', quien: 'ojo' })),
      enunciado: jN('Desde un punto del suelo, la punta de una torre se ve con 37°. Avanzas 10 m hacia ella y la ves con 45°. ¿Cuánto mide la torre?' + NO_ESC),
      datos: [D4.regla, D4.mismo, D4.rzr, v4(37), v4(45)],
      solucion: [
        { texto: ['Con la altura h, las dos distancias son h · 4/3 y h · 1. Lo avanzado es su resta:'], ecuacion: junto([hh, ' · ', frac('4', '3'), ' − ', hh, ' · 1 = ', hh, ' · ', frac('1', '3'), ' = 10']) },
        { texto: ['Se despeja h:'], ecuacion: junto([hh, ' = 10 · 3 = ', dO('30 m')]) },
      ],
      respuesta: [dO('30 m')] },
    { nivel: 2, titulo: 'Dos cámaras a los lados', figura: fig(opuestosFig('poste', 12, 37, 53, { h: '?', a: '37°', b: '53°', m: '25 m' }, { quien: 'camara' })),
      enunciado: jN('Dos cámaras en el suelo, a lados opuestos de un poste y separadas 25 m, ven su punta con 37° y 53° de elevación. ¿Cuánto mide el poste?' + NO_ESC),
      datos: [D4.regla, D4.mismo, D4.rzr, v4(37), v4(53)],
      solucion: [
        { texto: ['A lados opuestos, las distancias se suman:'], ecuacion: junto([hh, ' · ', frac('4', '3'), ' + ', hh, ' · ', frac('3', '4'), ' = ', hh, ' · ', frac('25', '12'), ' = 25']) },
        { texto: ['Se despeja h:'], ecuacion: junto([hh, ' = 25 · ', frac('12', '25'), ' = ', dO('12 m')]) },
      ],
      respuesta: [dO('12 m')] },
    { nivel: 2, titulo: 'La combi a 10 m/s', figura: fig(cerroFig(51.96, 30, 60, { h: '?', a: '30°', b: '60°' })),
      enunciado: jN('Una combi va a 10 m/s hacia una loma y ve su punta con 30° de elevación. 6 s después la ve con 60°. ¿Cuánto mide la loma?' + NO_ESC),
      datos: [D4.regla, D4.rzr, v4(30), v4(60), D4.vt],
      solucion: [
        { texto: ['En 6 s avanza 10 · 6 = 60 m. Las distancias al pie son h√3 y h√3/3:'], ecuacion: junto([hh, '√3 − ', frac([hh, '√3'], '3'), ' = ', frac(['2', hh, '√3'], '3'), ' = 60']) },
        { texto: ['Se despeja h:'], ecuacion: junto([hh, ' = ', frac('180', '2√3'), ' = ', dO('30√3 m'), ' ≈ ', dO('51,96 m')]) },
      ],
      respuesta: [dO('30√3 m'), ' ≈ ', dO('51,96 m')] },
    { nivel: 2, titulo: 'Dónde quedaste', figura: fig(cerroFig(17.32, 30, 60, { h: '?', a: '30°', b: '60°', m: '20 m', d2: '?' }, { tipo: 'edificio', quien: 'ojo' })),
      enunciado: jN('Desde un punto del suelo, la punta de una torre se ve con 30° de elevación; avanzas 20 m hacia ella y se ve con 60°. ¿A qué distancia del pie quedaste?' + NO_ESC),
      datos: [D4.regla, D4.rzr, v4(30), v4(60)],
      solucion: [
        { texto: ['Lo avanzado da la altura:'], ecuacion: junto([hh, '√3 − ', frac([hh, '√3'], '3'), ' = 20  →  ', hh, ' = ', frac('60', '2√3'), ' = ', dO('10√3')]) },
        { texto: ['Desde el segundo lugar:'], ecuacion: junto([d2, ' = 10√3 · ', frac('√3', '3'), ' = ', dI('10 m')]) },
      ],
      respuesta: [dI('10 m')] },
    { nivel: 2, titulo: 'Con 16° y 37°', figura: fig(cerroFig(21, 16, 37, { h: '?', a: '16°', b: '37°', m: '44 m' })),
      enunciado: jN('Desde la carretera, la punta de un cerro se ve con 16° de elevación; 44 m más adelante, con 37°. ¿Cuánto mide el cerro?' + NO_ESC),
      datos: [D4.regla, D4.rzr, v4(16), v4(37)],
      solucion: [
        { texto: ['Las distancias son h · 24/7 y h · 4/3; su resta es lo avanzado:'], ecuacion: junto([hh, ' · ', frac('24', '7'), ' − ', hh, ' · ', frac('4', '3'), ' = ', hh, ' · ', frac('44', '21'), ' = 44']) },
        { texto: ['Se despeja h:'], ecuacion: junto([hh, ' = 44 · ', frac('21', '44'), ' = ', dO('21 m')]) },
      ],
      respuesta: [dO('21 m')] },
    // Nivel 3, tipo examen. Letras de las correctas: D, E, A, B, C (las figuras no tienen puntos con letras).
    { nivel: 3, titulo: 'El dron que se acerca', figura: fig(dronFig(48, 37, 53, { a: '37°', b: '53°', m: '?', h: '?' })),
      enunciado: jN('Un dron vuela en línea recta y horizontal, a 4 m/s, hacia un punto P del suelo. Lo ve con 37° de depresión y, 7 s después, con 53°. ¿A qué altura vuela?' + NO_ESC),
      alternativas: ALT4.dron,
      datos: [D4.regla, D4.rzr, v4(37), v4(53), D4.vt, D3.alt],
      solucion: [
        { texto: ['En 7 s avanza 4 · 7 = 28 m. Las depresiones son las elevaciones desde P; las distancias, h · 4/3 y h · 3/4:'], ecuacion: junto([hh, ' · ', frac('7', '12'), ' = 28']) },
        { texto: ['Se despeja:'], ecuacion: junto([hh, ' = 28 · ', frac('12', '7'), ' = ', dO('48 m')]) },
        { texto: ['13,44 m suma las cotangentes; 6,86 m usa 4 m sin los 7 s; 37,33 m toma 28 m por la distancia al pie; 28 m es lo avanzado.'] },
      ],
      respuesta: [letra(ALT4.dron, '48 m'), ', ', dO('48 m')] },
    { nivel: 3, titulo: 'La cámara del poste', figura: fig(altoDosFig('camara', 12, 30, 60, { h: '12 m', a: '30°', b: '60°', m: '?' })),
      enunciado: jN('Una cámara en lo alto de un poste de 12 m ve un auto que se acerca, con 30° de depresión y, 4 s después, con 60°. ¿Qué rapidez lleva el auto?' + NO_ESC),
      alternativas: ALT4.camara,
      datos: [D4.regla, D4.rzr, v4(30), v4(60), D4.vt, D3.alt],
      solucion: [
        { texto: ['Las distancias al pie:'], ecuacion: [junto(['12 · cot 30° = ', dI('12√3')]), SEP, junto(['12 · cot 60° = ', dI('4√3')])] },
        { texto: ['En 4 s recorre la resta, 8√3 m:'], ecuacion: junto(['v = ', frac('8√3', '4'), ' = 2√3 m/s ≈ 3,46 m/s']) },
        { texto: ['8√3 m/s no divide entre 4 s; 4√3 m/s suma las distancias; 3√3 m/s y √3 m/s usan una sola.'] },
      ],
      respuesta: [letra(ALT4.camara, '2√3 m/s'), ', 2√3 m/s ≈ 3,46 m/s'] },
    { nivel: 3, titulo: 'El muro, con 30° y 60°', figura: fig(altoDosFig('muro', 30, 30, 60, { h: '30 m', a: '30°', b: '60°', m: '?' })),
      enunciado: jN('Desde la azotea de un edificio de 30 m, un muro bajo, alineado con el pie, tiene su extremo lejano a 30° de depresión y el cercano a 60°. ¿Cuánto mide el muro?' + NO_ESC),
      alternativas: ALT4.muro,
      datos: [D4.regla, D4.rzr, v4(30), v4(60), D3.alt],
      solucion: [
        { texto: ['Las distancias al pie:'], ecuacion: [junto(['30 · cot 30° = ', dI('30√3')]), SEP, junto(['30 · cot 60° = ', dI('10√3')])] },
        { texto: ['El muro es su resta:'], ecuacion: [junto([dI('30√3'), ' − ', dI('10√3'), ' = 20√3 m']), ' ', junto('≈ 34,64 m')] },
        { texto: ['40√3 m las suma; 30√3 m y 10√3 m son una sola; 60 m es la visual al extremo lejano.'] },
      ],
      respuesta: [letra(ALT4.muro, '20√3 m'), ', ', dI('20√3 m'), ' ≈ ', dI('34,64 m')] },
    { nivel: 3, titulo: 'A los dos lados, con letras', figura: fig(opuestosFig('poste', 8, 37, 53, { h: '?', a: 'α', b: 'β', m: 'a' })),
      enunciado: 'Desde dos puntos del suelo, a lados opuestos de un poste y separados una distancia a, su punta se ve con ángulos de elevación α y β. ¿Cuánto mide el poste?',
      alternativas: ALT4.letras,
      datos: [D4.regla, D4.mismo],
      solucion: [
        { texto: ['Con la altura h, las distancias son h cot α y h cot β; a lados opuestos se suman:'], ecuacion: junto(['h cot α + h cot β = a']) },
        { texto: ['Se despeja h:'], ecuacion: junto(['h = a/(cot α + cot β)']) },
        { texto: ['a/(cot α − cot β) es del mismo lado; a(tan α + tan β) y a(cot α + cot β) multiplican; a/(tan α + tan β) usa tangentes.'] },
      ],
      respuesta: [letra(ALT4.letras, 'a/(cot α + cot β)'), ', a/(cot α + cot β)'] },
    { nivel: 3, titulo: 'Las dos lanchas', figura: fig(altoDosFig('faro', 60, 37, 45, { h: '?', a: '37°', b: '45°', m: '20 m' }, { quien: 'lancha' })),
      enunciado: jN('Desde lo alto de un faro, dos lanchas en línea con su pie y separadas 20 m se ven con 37° y 45° de depresión. ¿Cuánto mide el faro?' + NO_ESC),
      alternativas: ALT4.lanchas,
      datos: [D4.regla, D4.rzr, v4(37), v4(45), D3.alt],
      solucion: [
        { texto: ['Las distancias al pie son h · 4/3 y h · 1; la resta es lo que las separa:'], ecuacion: junto([hh, ' · ', frac('1', '3'), ' = 20']) },
        { texto: ['Se despeja:'], ecuacion: junto([hh, ' = 60 m']) },
        { texto: ['20 m es la separación; 8,57 m suma las cotangentes; 80 m es la distancia a la lancha lejana; 15 m usa un solo triángulo.'] },
      ],
      respuesta: [letra(ALT4.lanchas, '60 m'), ', ', dO('60 m')] },
  ];

  // El juego del cerro: la altura y la escala no cambian.
  const H4 = 300;
  const MARCO4 = [[-200, 0], [H4 * Math.sqrt(3), H4]];
  const dist4 = g => Ex.por(E(H4), razon('cot', g));
  const cerroJ = val => cerroFig(H4, val.a, val.b, { h: 'h = 300 m', a: `${val.a}°`, b: `${val.b}°`, m: val.b > val.a ? exTxt(Ex.resta(dist4(val.a), dist4(val.b)), 'm') : undefined }, { escala: true, marco: MARCO4 });
  function lectura4(val) {
    if (val.b <= val.a) return 'Para acercarte, β tiene que ser mayor que α.';
    const a = dist4(val.a), b = dist4(val.b), r = Ex.resta(a, b);
    const dif = Ex.txt(r);
    return jN(['avanzó ', d1, ' − ', d2, ` = ${Ex.txt(a)} − ${Ex.txt(b)} ${/[+−]/.test(dif) ? '≈' : `= ${dif} m ≈`} ${f(Ex.val(r))} m`]);
  }
  // «Así se resuelve»: la distancia entre dos puntos de observación, con la altura dada (en «Ahora tú» se pide la altura).
  function resuelve4(sem) {
    const rr = azar(sem + 900), pares = [[37, 53], [30, 60], [45, 53], [37, 45]], [ga, gb] = pares[sem % 4], opuestos = sem % 2 === 1;
    const h = rr.uno(ga === 30 ? [6, 9] : [12, 24, 36]), d1v = Ex.por(E(h), razon('cot', ga)), d2v = Ex.por(E(h), razon('cot', gb));
    const res = opuestos ? Ex.suma(d1v, d2v) : Ex.resta(d1v, d2v);
    const fd = todo => fig(opuestos ? opuestosFig('arbol', h, ga, gb, { h: `${h} m`, a: `${ga}°`, b: `${gb}°`, m: todo ? exTxt(res, 'm') : '?' })
      : cerroFig(h, ga, gb, { h: `${h} m`, a: `${ga}°`, b: `${gb}°`, m: todo ? exTxt(res, 'm') : '?' }, { tipo: 'arbol', quien: 'ojo' }));
    return {
      enunciado: jN(opuestos ? `Desde dos puntos del suelo, a lados opuestos de un árbol de ${h} m, su copa se ve con ${ga}° y con ${gb}° de elevación. ¿Qué distancia hay entre los dos puntos?${NO_ESC}`
        : `Desde un punto del suelo, la copa de un árbol de ${h} m se ve con ${ga}°; desde otro más cerca, del mismo lado, con ${gb}°. ¿Qué distancia hay entre los dos puntos?${NO_ESC}`),
      datos: [D4.regla, D4.mismo, D4.rzr, v4(ga), v4(gb)],
      dibujo: fd(false),
      pasos: [
        { tipo: 'pide', texto: ['Piden la distancia entre los dos puntos de observación.'] },
        { tipo: 'datos', texto: [`El árbol mide ${h} m: es el lado común de los dos triángulos. Los ángulos son ${ga}° y ${gb}°.`] },
        { tipo: 'regla', texto: ['Desde cada punto, la altura es el opuesto y la distancia al pie, el adyacente: la cotangente.'], ecuacion: [junto([d1, ' = ', hh, ' · cot α']), SEP, junto([d2, ' = ', hh, ' · cot β'])] },
        { tipo: 'cuentas', texto: [`Las dos distancias, y ${opuestos ? 'se suman: están a lados opuestos' : 'se restan: están del mismo lado'}.`],
          ecuacion: junto([`${Ex.txt(d1v)} ${opuestos ? '+' : '−'} ${Ex.txt(d2v)} = `, dI(largo(res))]), dibujo: fd(true) },
        { tipo: 'sentido', texto: [opuestos ? 'Tiene sentido: la separación es mayor que cada distancia sola.' : 'Tiene sentido: la distancia entre los puntos es menor que la del punto lejano al pie.'] },
      ],
      respuesta: [dI(largo(res))],
    };
  }
  // «Ahora tú», tipo 0: la altura con lo que se avanza y los dos ángulos, del mismo lado.
  const PARES_MISMO = [[37, 45, [5, 6, 8, 10]], [45, 53, [3, 4, 5, 6]], [37, 53, [7, 14, 21]], [30, 60, [20, 40, 60]], [30, 45, [10, 20]], [45, 60, [10, 20]], [16, 37, [44, 88]]];
  function casoMismoLado(rr) {
    let par, m, obj;
    do { par = rr.uno(PARES_MISMO); m = rr.uno(par[2]); obj = rr.uno(['torre', 'cerro']); if (obj === 'cerro') m *= 10; }
    while ((par[0] === 37 && par[1] === 45 && m === 10) || (par[0] === 30 && par[1] === 60 && (m === 20 || m === 200)) || (par[0] === 16 && m === 44));
    const [ga, gb] = par, h = Ex.entre(E(m), cotDif(ga, gb));
    const nom = obj === 'torre' ? 'una torre' : 'un cerro';
    return {
      pregunta: jN(`Desde un punto del suelo, la punta de ${nom} se ve con ${ga}° de elevación. Avanzas ${m} m hacia ${obj === 'torre' ? 'ella' : 'él'} y la ves con ${gb}°. ¿Cuánto mide ${obj === 'torre' ? 'la torre' : 'el cerro'}?${NO_ESC}`),
      datos: [D4.regla, D4.mismo, D4.rzr, ...v2a(ga, gb)],
      dibujo: fig(cerroFig(Ex.val(h), ga, gb, { h: '?', a: `${ga}°`, b: `${gb}°`, m: `${m} m` }, { tipo: obj === 'torre' ? 'edificio' : 'cerro', quien: 'ojo' })),
      opciones: opciones({ ex: h }, [
        { id: 'uno', valor: { ex: Ex.por(E(m), razon('tan', gb)) }, error: 'DOS-UN-TRIANGULO', siFuera: `Usar tan ${gb}° está bien; pero ${m} m no es la distancia al pie: es lo que avanzaste.` },
        { id: 'suma', valor: { ex: Ex.entre(E(m), cotSum(ga, gb)) }, error: 'DOS-SUMA', siFuera: 'Las dos cotangentes son el camino; pero del mismo lado las distancias se restan.' },
        { id: 'tan', valor: { ex: Ex.entre(E(m), tanDif(ga, gb)) }, error: 'DOS-TAN', siFuera: 'Restar está bien; pero las distancias al pie salen con la cotangente, no con la tangente.' },
        { id: 'multiplica', valor: { ex: Ex.por(E(m), cotDif(ga, gb)) }, error: 'DOS-MULTIPLICA', siFuera: `La resta de cotangentes está bien; pero h por esa resta da ${m}: se divide.` },
      ], x => largo(x.ex)),
      solucion: { texto: 'Lo avanzado es la resta de las dos distancias al pie, con la misma h.', ecuacion: junto([hh, ` · (cot ${ga}° − cot ${gb}°) = ${m}  →  `, hh, ' = ', dO(largo(h))]) },
    };
  }
  // «Ahora tú», tipo 1 (San Marcos 2020-I): dos observadores a lados opuestos.
  const PARES_OPUESTOS = [[37, 53, [25, 50]], [30, 60, [16, 24, 40]], [45, 45, [10, 16, 24]], [37, 45, [7, 14, 21]], [45, 53, [7, 14]], [30, 45, [10, 20]]];
  function casoAmbosLados(rr) {
    let par, m, obj;
    do { par = rr.uno(PARES_OPUESTOS); m = rr.uno(par[2]); obj = rr.uno(['poste', 'arbol', 'antena']); } while (par[0] === 37 && par[1] === 53 && m === 25);
    const [ga, gb] = par, h = Ex.entre(E(m), cotSum(ga, gb));
    const nom = { poste: 'un poste', arbol: 'un árbol', antena: 'una antena' }[obj], punta = obj === 'arbol' ? 'su copa' : 'su punta';
    return {
      pregunta: jN(`Desde dos puntos del suelo, a lados opuestos de ${nom} y separados ${m} m, ${punta} se ve con ${ga}° y con ${gb}° de elevación. ¿Cuánto mide ${obj === 'antena' ? 'la antena' : obj === 'arbol' ? 'el árbol' : 'el poste'}?${NO_ESC}`),
      datos: [D4.regla, D4.mismo, D4.rzr, ...v2a(ga, gb)],
      dibujo: fig(opuestosFig(obj, Ex.val(h), ga, gb, { h: '?', a: `${ga}°`, b: `${gb}°`, m: `${m} m` })),
      opciones: opciones({ ex: h }, [
        { id: 'resta', valor: ga === gb ? null : { ex: Ex.entre(E(m), cotDif(ga, gb)) }, error: 'DOS-RESTA', siFuera: 'Las cotangentes son el camino; pero a lados opuestos las distancias se suman, no se restan.' },
        { id: 'tan', valor: { ex: Ex.entre(E(m), Ex.suma(razon('tan', ga), razon('tan', gb))) }, error: 'DOS-TAN', siFuera: 'Sumar está bien; pero cada distancia al pie sale con la cotangente.' },
        { id: 'uno', valor: { ex: Ex.por(E(m), razon('tan', ga)) }, error: 'DOS-UN-TRIANGULO', siFuera: `Usar tan ${ga}° está bien; pero ${m} m son las dos distancias juntas, no una.` },
        { id: 'multiplica', valor: { ex: Ex.por(E(m), cotSum(ga, gb)) }, error: 'DOS-MULTIPLICA', siFuera: `La suma de cotangentes está bien; pero h por esa suma da ${m}: se divide.` },
      ], x => largo(x.ex)),
      solucion: { texto: 'A lados opuestos, las dos distancias al pie se suman.', ecuacion: junto([hh, ` · (cot ${ga}° + cot ${gb}°) = ${m}  →  `, hh, ' = ', dO(largo(h))]) },
    };
  }
  // «Ahora tú», tipo 2 (nivel de examen): la cámara en un poste y un auto (rapidez), el dron (altura) o el muro entre
  // edificios (largo). Los de los ejemplos 5, 11, 12 y 13 no salen.
  function casoMovil(rr) {
    const sub = rr.uno(['camara', 'dron', 'muro']);
    if (sub === 'camara') {
      let par, h, t;
      do { par = rr.uno([[37, 53], [45, 53], [37, 45], [30, 60]]); h = rr.uno(par[0] === 30 ? [6, 9] : [12, 24]); t = rr.uno([2, 3, 4]); } while (par[0] === 30 && h === 12 && t === 4);
      const [ga, gb] = par, d1v = Ex.por(E(h), razon('cot', ga)), d2v = Ex.por(E(h), razon('cot', gb)), m = Ex.resta(d1v, d2v), v = Ex.entre(m, E(t));
      return {
        pregunta: jN(`Una cámara en lo alto de un poste de ${h} m ve un auto que se acerca, con ${ga}° de depresión y, ${t} s después, con ${gb}°. ¿Qué rapidez lleva el auto?${NO_ESC}`),
        datos: [D4.regla, D4.rzr, ...v2a(ga, gb), D4.vt, D3.alt],
        dibujo: fig(altoDosFig('camara', h, ga, gb, { h: `${h} m`, a: `${ga}°`, b: `${gb}°`, m: '?' })),
        opciones: opciones({ ex: v }, [
          { id: 'sint', valor: { ex: m }, error: 'DOS-SIN-T', siFuera: `La resta de distancias está bien: es lo que recorrió en ${t} s. Falta dividir entre el tiempo.` },
          { id: 'suma', valor: { ex: Ex.entre(Ex.suma(d1v, d2v), E(t)) }, error: 'DOS-SUMA', siFuera: 'Dividir entre el tiempo está bien; pero del mismo lado las distancias se restan.' },
          { id: 'solo', valor: { ex: Ex.entre(d1v, E(t)) }, error: 'DOS-SOLO', siFuera: 'Dividir entre el tiempo está bien; pero el auto no llegó al poste: recorrió la resta.' },
        ], x => largo(x.ex, 'm/s')),
        solucion: { texto: `Recorrió ${Ex.txt(d1v)} − ${Ex.txt(d2v)} en ${t} s.`, ecuacion: junto(['v = ', frac(`${Ex.txt(m)}`, `${t}`), ' = ', largo(v, 'm/s')]) },
      };
    }
    if (sub === 'dron') {
      let par, vv, t;
      do { par = rr.uno([[37, 53], [37, 45], [45, 53], [30, 60]]); vv = rr.uno([2, 3, 5, 6]); t = rr.uno(par[0] === 37 && par[1] === 53 ? [7, 14] : [2, 4, 5]); } while (par[0] === 37 && par[1] === 53 && vv * t === 28);
      const [ga, gb] = par, m = vv * t, h = Ex.entre(E(m), cotDif(ga, gb));
      return {
        pregunta: jN(`Un dron vuela recto y horizontal, a ${vv} m/s, hacia un punto P del suelo. Lo ve con ${ga}° de depresión y, ${t} s después, con ${gb}°. ¿A qué altura vuela?${NO_ESC}`),
        datos: [D4.regla, D4.rzr, ...v2a(ga, gb), D4.vt, D3.alt],
        dibujo: fig(dronFig(Ex.val(h), ga, gb, { a: `${ga}°`, b: `${gb}°`, m: '?', h: '?' })),
        opciones: opciones({ ex: h }, [
          { id: 'suma', valor: { ex: Ex.entre(E(m), cotSum(ga, gb)) }, error: 'DOS-SUMA', siFuera: `Avanzó ${m} m, bien; pero del mismo lado las distancias se restan.` },
          { id: 'uno', valor: { ex: Ex.por(E(m), razon('tan', gb)) }, error: 'DOS-UN-TRIANGULO', siFuera: `Avanzó ${m} m, bien; pero eso no es la distancia al punto: es la resta de dos.` },
          { id: 'sint', valor: { ex: Ex.entre(E(vv), cotDif(ga, gb)) }, error: 'DOS-SIN-T', siFuera: `La resta de cotangentes está bien; pero en ${t} s avanza ${vv} · ${t} m, no ${vv} m.` },
        ], x => largo(x.ex)),
        solucion: { texto: `En ${t} s avanza ${vv} · ${t} = ${m} m: la resta de las dos distancias a P.`, ecuacion: junto([hh, ` · (cot ${ga}° − cot ${gb}°) = ${m}  →  `, hh, ' = ', dO(largo(h))]) },
      };
    }
    let par, H;
    do { par = rr.uno([[37, 53], [37, 45], [45, 53], [30, 60], [30, 45]]); H = rr.uno(par[0] === 30 ? [12, 18, 24] : [12, 36, 48]); } while ((par[0] === 37 && par[1] === 53 && H === 24) || (par[0] === 30 && par[1] === 60 && H === 30));
    const [ga, gb] = par, d1v = Ex.por(E(H), razon('cot', ga)), d2v = Ex.por(E(H), razon('cot', gb)), L = Ex.resta(d1v, d2v);
    return {
      pregunta: jN(`Desde la azotea de un edificio de ${H} m, un muro bajo, alineado con el pie, tiene su extremo lejano a ${ga}° de depresión y el cercano a ${gb}°. ¿Cuánto mide el muro?${NO_ESC}`),
      datos: [D4.regla, D4.rzr, ...v2a(ga, gb), D3.alt],
      dibujo: fig(altoDosFig('muro', H, ga, gb, { h: `${H} m`, a: `${ga}°`, b: `${gb}°`, m: '?' })),
      opciones: opciones({ ex: L }, [
        { id: 'suma', valor: { ex: Ex.suma(d1v, d2v) }, error: 'DOS-SUMA', siFuera: 'Las dos distancias están bien; pero el muro es lo que hay entre ellas: se restan.' },
        { id: 'lejos', valor: { ex: d1v }, error: 'DOS-SOLO', siFuera: 'Esa es la distancia al extremo lejano; el muro no empieza en el pie del edificio.' },
        { id: 'tan', valor: { ex: Ex.resta(Ex.por(E(H), razon('tan', gb)), Ex.por(E(H), razon('tan', ga))) }, error: 'DOS-TAN', siFuera: 'Restar está bien; pero las distancias salen con la cotangente, no con la tangente.' },
      ], x => largo(x.ex)),
      solucion: { texto: `Las distancias al pie: ${Ex.txt(d1v)} y ${Ex.txt(d2v)}. El muro es su resta.`, ecuacion: junto([`${Ex.txt(d1v)} − ${Ex.txt(d2v)} = `, dI(largo(L))]) },
    };
  }

  const dosAngulos = {
    id: 'dos-angulos',
    titulo: 'Dos ángulos hacia la misma punta',
    pregunta: '¿Cómo se halla una altura con dos ángulos de elevación y la distancia entre ellos?',
    temas: ['Dos ángulos de elevación o depresión'],
    pieza: VI,
    aprendizaje: 'Dos visuales a una misma punta comparten la altura h: cada distancia al pie es h · cot de su ángulo; se restan o se suman.',
    actividad: 'Elegir desde dónde mira la combi la punta de un cerro, antes y después.',
    // Lee: el objeto, el lado común y qué mirar. No dice cómo sale la altura con lo avanzado (la predicción).
    lee: {
      tarjetas: [
        { titulo: 'El cerro desde la carretera', texto: 'Una combi va por la carretera hacia un cerro. El chofer ve la punta con un ángulo de elevación; más adelante, con otro más grande. El cerro no cambia: su altura es la misma para las dos miradas.',
          pieza: VI, dibujo: { datos: cerroFig(H4, 30, 45, {}, { escala: true }), estado: {} } },
        { titulo: 'Dos triángulos, un lado común', texto: ['Cada mirada arma un triángulo rectángulo con la altura del cerro, ', hh, ', y la distancia al pie: ', d1, ' desde el lugar lejano, con ', al, ', y ', d2, ' desde el cercano, con ', be, '.'] },
        { titulo: 'Qué mirar al jugar', texto: 'Vas a elegir los dos ángulos. Mira cuánto avanza la combi entre una mirada y la otra.' },
      ],
    },
    ejemplos: EJEMPLOS_4,
    juega: {
      pieza: VI,
      consigna: ['La combi ve la punta del cerro de 300 m con ', al, ' y, más adelante, con ', be, '. Las dos distancias al pie salen de ella.'],
      mision: {
        texto: 'Haz que la combi avance justo 200√3 m entre las dos miradas.',
        logrado: val => val.a === 30 && val.b === 60,
        bien: 'Listo: 300 · cot 30° − 300 · cot 60° = 300√3 − 100√3 = 200√3 m.',
      },
      voz: '¿Cuánto avanza la combi entre las dos miradas?',
      leyenda: [
        { s: al, t: 'el ángulo desde el lugar lejano' },
        { s: be, t: 'el ángulo desde el lugar cercano' },
        { s: hh, t: 'la altura del cerro, de los dos triángulos' },
        { s: d1, t: 'del lugar lejano al pie' },
        { s: d2, t: 'del lugar cercano al pie' },
      ],
      controles: [
        { id: 'a', etiqueta: 'α, la primera mirada', color: 'c-h', min: 30, max: 60, paso: 15, inicio: 30, unidad: '°', decimales: 0 },
        { id: 'b', etiqueta: 'β, la segunda mirada', color: 'c-h', min: 30, max: 60, paso: 15, inicio: 45, unidad: '°', decimales: 0 },
      ],
      dibujo: val => ({ datos: cerroJ(val), estado: {} }),
      lectura: lectura4,
      minimo: 3,
    },
    predice: {
      pregunta: 'Desde la carretera, la punta de otro cerro se ve con 30°; la combi avanza 200 m hacia él y la ve con 60°. ¿Cuánto mide el cerro?' + NO_ESC,
      datos: [junto('tan 30° = √3/3 y tan 60° = √3.'), D4.raiz],
      voz: 'Ahora sabes cuánto avanzó, y no la altura.',
      opciones: [
        { id: 'c', texto: '100√3 m ≈ 173 m', correcta: true },
        { id: 'uno', texto: '200√3 m ≈ 346 m', error: 'DOS-UN-TRIANGULO', siFuera: 'Usar tan 60° está bien; pero 200 m no es la distancia al pie: es lo que avanzó.' },
        { id: 'visual', texto: '200 m', error: 'DOS-VISUAL', siFuera: 'Ver que avanzó 200 m es clave; pero 200 m mide la visual del segundo lugar, no la altura.' },
        { id: 'seno', texto: '100 m', error: 'TR9', siFuera: 'Partir de los 200 m está bien; pero el seno de 30° no une lo avanzado con la altura.' },
      ],
      dibujo: { datos: cerroFig(173.2, 30, 60, { h: '?', a: '30°', b: '60°', m: '200 m' }), estado: {} },
      revelar: { datos: cerroFig(173.2, 30, 60, { h: '100√3 m', a: '30°', b: '60°', m: '200 m' }), estado: {} },
      coincide: 'Coincide: las dos distancias comparten la altura, h√3 y h√3/3; su resta, 200 m, da la altura.',
      noCoincide: 'Revisemos: los 200 m son la resta de las dos distancias al pie, y las dos salen de la misma altura.',
    },
    mira: {
      pieza: VI,
      datos: cerroFig(173.2, 30, 60, { h: [{ t: '?' }, { t: '100√3 m', paso: 4 }], a: '30°', b: '60°', m: '200 m' }),
      voz: 'Las dos distancias salen de la misma altura.',
      pasos: [
        { estado: { paso: 0 }, texto: 'Las dos visuales van a la misma punta: comparten la altura h.', ecuacion: [hh, ' = ?'] },
        { estado: { paso: 1 }, texto: 'Desde el lugar lejano, la distancia al pie es h por la cotangente.', ecuacion: junto([d1, ' = ', hh, ' · cot 30° = ', hh, '√3']) },
        { estado: { paso: 2 }, texto: 'Desde el cercano, lo mismo con 60°.', ecuacion: junto([d2, ' = ', hh, ' · cot 60° = ', frac([hh, '√3'], '3')]) },
        { estado: { paso: 3 }, texto: 'Lo que avanzó la combi es la resta.', ecuacion: junto([hh, '√3 − ', frac([hh, '√3'], '3'), ' = ', frac(['2', hh, '√3'], '3'), ' = 200']) },
        { estado: { paso: 4 }, texto: 'Se despeja h.', ecuacion: junto([hh, ' = ', frac('600', '2√3'), ' = 100√3 m ≈ 173 m']) },
      ],
    },
    regla: {
      texto: 'Dos visuales a una misma punta comparten la altura h: cada distancia al pie es h · cot de su ángulo. Del mismo lado se restan; de lados opuestos, se suman.',
      ecuacion: [junto([d1, ' = ', hh, ' · cot ', al]), SEP, junto([d2, ' = ', hh, ' · cot ', be]), SEP, junto([d1, ' − ', d2, ' = ', hh, '(cot ', al, ' − cot ', be, ')'])],
      condicion: 'Las dos visuales llegan a la misma punta, sobre suelo horizontal. α es el menor: el del lugar más lejano.',
      voz: 'Una sola altura para los dos triángulos.',
      dibujo: { pieza: VI, datos: cerroFig(12, 30, 53, { h: 'h', a: 'α', b: 'β', m: 'd₁ − d₂', d2: 'd₂' }, { tipo: 'edificio', quien: 'ojo', escala: true }), estado: {} },
    },
    resuelve: { pieza: VI, generar: resuelve4 },
    ahoraTu: {
      pieza: VI,
      voz: 'Escribe las dos distancias con la misma altura.',
      generar(sem) { return sinRepetir([casoMismoLado, casoAmbosLados, casoMovil][sem % 3], sem, dosAngulos); },
    },
  };

  // ====================================================================================================================
  // Idea 5: ángulo de observación
  // ====================================================================================================================
  // Objeto de la primera pantalla: un letrero en un poste, frente a una persona (sus bordes, a 2 m y a 6 m sobre los ojos).
  // Cambia: la distancia d al poste, de 6 a 12 m. · Permanece: el letrero y los ojos. · Progresa: el ángulo de observación
  // φ = β − α, que crece al acercarse. · Se reserva: acercarse más que el juego (la predicción: φ llega a un máximo y
  // vuelve a bajar). · Debe verse: φ es la resta de dos elevaciones desde el mismo ojo.
  // Errores: OBS-CRECE cree que φ crece sin tope; OBS-CONSTANTE que se queda fijo; OBS-45 que el tope es 45°;
  // OBS-SOLO-ARRIBA da la elevación del borde alto; OBS-SOLO-ABAJO la del bajo; OBS-SUMA suma las elevaciones; OBS-RESTA
  // resta cuando un borde está bajo los ojos y se suman; OBS-RESTA-ALTURAS usa la resta de alturas como un solo cateto
  // (todas hipótesis).
  const D5 = {
    regla: [junto([fi, ' = ', be, ' − ', al]), ', con ', junto(['tan ', al, ' = ', frac(h1, dd)]), ' y ', junto(['tan ', be, ' = ', frac(h2, dd)]), junto(' (alturas sobre los ojos).')],
    abajo: 'Si un borde está bajo los ojos, su visual baja: es una depresión, y las dos se suman.',
    tabla1: [junto('tan 37° = 3/4,'), ' ', junto('tan 45° = 1'), ' y ', junto('tan 53° = 4/3'), ' ', junto(conv), '.'],
    tabla2: [junto('tan 16° = 7/24'), ' y ', junto('tan 74° = 24/7'), ' ', junto(conv), '.'],
    tabla3: [junto('tan 30° = √3/3'), ' y ', junto('tan 60° = √3'), '.'],
    ojo: D3.ojo,
    max: ['El mayor ', fi, ' se ve a ', junto([dd, ' = √(', h1, ' · ', h2, ')']), '.'],
  };
  // El letrero: la persona en x = 0 y el poste en x = dv; los bordes, a h1 y h2 sobre los ojos. Fuera del juego, la figura
  // va con otra abertura (las distancias se acortan), para que φ no se mida con un transportador.
  // Fuera de escala: el borde de abajo se dibuja a otra altura (o, si está a la altura de los ojos, la distancia es otra)
  // hasta que ni φ (12° o más de diferencia) ni el largo del letrero, medido con la altura del borde de abajo (15 % o más),
  // se puedan medir (cierre, 19 nov: con la distancia por 0,62, φ salía dibujado a 1° o 4° de su valor y el letrero de 9 a
  // 16 m medía justo 7 m con la regla de los 9 m).
  function letreroAbre(dv, a1, a2) {
    const gr = r => r * 180 / Math.PI, phi = gr(Math.atan2(a2, dv) - Math.atan2(a1, dv));
    if (a1 <= 0) {
      for (const k of [1.8, 0.55, 2.5, 0.4]) { const x = dv * k; if (Math.abs(gr(Math.atan2(a2, x)) - phi) >= 12) return [x, 0, a2]; }
      return [dv * 1.8, 0, a2];
    }
    // La distancia va al 75 %: con el borde de arriba a escala, no se mide (era la respuesta del ejemplo «¿A qué distancia?»).
    const x = dv * 0.75;
    for (const k of [0.5, 1.8, 0.3, 2.2, 0.2]) {
      const b1 = a1 * k;
      if (b1 >= a2 * 0.85) continue;
      const f2 = gr(Math.atan2(a2, x) - Math.atan2(b1, x)), L = (a2 - b1) * a1 / b1;
      if (Math.abs(f2 - phi) >= 12 && Math.abs(L - (a2 - a1)) / (a2 - a1) >= 0.15) return [x, b1, a2];
    }
    return [x, a1 * 0.5, a2];
  }
  function letreroFig(dv, a1, a2, rot = {}, o = {}) {
    const [x, b1, b2] = o.escala ? [dv, a1, a2] : letreroAbre(dv, a1, a2), E0 = [0, OJO], B1 = [x, OJO + b1], B2 = [x, OJO + b2];
    const L = [{ de: E0, a: B1, como: 'vista' }, { de: E0, a: B2, como: 'vista' }];
    if (rot.h1 !== undefined) L.push({ de: [x, OJO], a: B1, como: 'cota', color: rot.h1 === '?' ? null : 'o', texto: rot.h1, lado: 1, sep: 10 });
    if (rot.h2 !== undefined) L.push({ de: [x, OJO], a: B2, como: 'cota', color: rot.h2 === '?' ? null : 'o', texto: rot.h2, lado: -1, sep: 28 });
    if (rot.L !== undefined) L.push({ de: B1, a: B2, como: 'cota', texto: rot.L, lado: -1, sep: 28 });
    if (rot.d !== undefined) L.push({ de: [0, 0], a: [x, 0], como: 'cota', color: /\?$/.test(rot.d) ? null : 'i', texto: rot.d, lado: -1, sep: 12 });
    const ang = [{ en: E0, de: B1, a: B2, texto: rot.f, radio: 54 }];
    if (rot.a !== undefined) ang.push({ en: E0, de: [x, OJO], a: B1, texto: rot.a, radio: 26 });
    if (rot.b !== undefined) ang.push({ en: E0, de: [x, OJO], a: B2, texto: rot.b, radio: 38 });
    return { ojo: OJO, marco: o.marco, nota: o.nota, objetos: [{ tipo: 'persona', x: 0, lado: 1 }, { tipo: 'letrero', x, h: OJO + b2, h1: OJO + b1, lado: 1 }],
      horizontales: [{ en: E0, hasta: x }], lados: L, angulos: ang };
  }
  const atanG = (y, x) => Math.atan2(y, x) * GRA;
  const phiDe = (dv, a1, a2) => atanG(a2, dv) - atanG(a1, dv);
  // Las tangentes de la convención: el ángulo de un cociente de la tabla.
  const TAN = [[16, E(7, 24)], [37, E(3, 4)], [45, E(1)], [53, E(4, 3)], [74, E(24, 7)]];

  // Ejemplos de la idea 5. Cuentas rehechas aparte (cuentas-ejemplos.js): 12/12 y 9/12 (45 − 37); 24/24 y 7/24 (45 − 16);
  // 10/10; 12/(4√3) y 4/(4√3) (60 − 30); 53 − 37; 12 · 4/3 − 9; (13,5 − 1,5) y (10,5 − 1,5) sobre 12; 9/12 y 12/12 (37 + 45);
  // 5√3 y 15/(5√3); 24 y 7 desde 24 m y desde 7 m; 12 · tan 53° − 9; 9/12 y 12/12; 37 − 16; √(3 · 9); 7 y 24 sobre 24, y el
  // valor de cada alternativa equivocada.
  const ALT5 = {
    antena: ['16 m', '3,5 m', '9 m', '25 m', '7 m'],
    ventana: ['82°', '8°', '45°', '37°', '53°'],
    franjas: ['16°', '21°', '37°', '53°', '90°'],
    distancia: ['6 m', '3 m', '3√3 m', '9√3 m', '9 m'],
    pantalla: ['45°', '16°', '61°', '29°', '74°'],
  };
  const EJEMPLOS_5 = [
    { nivel: 1, titulo: 'La ventana del edificio', figura: fig(letreroFig(12, 9, 12, { d: '12 m', h1: '9 m', h2: '12 m', f: '?' })),
      enunciado: jN('El borde de abajo de una ventana está a 9 m sobre tus ojos y el de arriba, a 12 m. Estás a 12 m del edificio. ¿Qué ángulo abarca la ventana?' + NO_ESC),
      datos: [D5.regla, D5.tabla1],
      solucion: [{ texto: ['Las dos elevaciones, y se restan:'], ecuacion: [junto(['tan ', be, ' = ', frac('12', '12'), ' = 1  →  ', be, ' = 45°']), SEP, junto(['tan ', al, ' = ', frac('9', '12'), ' = ', frac('3', '4'), '  →  ', al, ' = 37°']), SEP, junto([fi, ' = 45° − 37° = ', dH('8°')])] }],
      respuesta: [fi, ' = ', dH('8°')] },
    { nivel: 1, titulo: 'La pantalla del estadio', figura: fig(letreroFig(24, 7, 24, { d: '24 m', h1: '7 m', h2: '24 m', f: '?' })),
      enunciado: jN('Los bordes de la pantalla de un estadio están a 7 m y a 24 m sobre tus ojos. Estás a 24 m. ¿Qué ángulo abarca la pantalla?' + NO_ESC),
      datos: [D5.regla, D5.tabla1, D5.tabla2],
      solucion: [{ texto: ['tan β = 24/24 = 1 y tan α = 7/24: son 45° y 16°.'], ecuacion: junto([fi, ' = 45° − 16° = ', dH('29°')]) }],
      respuesta: [fi, ' = ', dH('29°')] },
    { nivel: 1, titulo: 'Un borde a nivel del ojo', figura: fig(letreroFig(10, 0, 10, { d: '10 m', h2: '10 m', f: '?' })),
      enunciado: jN('El borde de abajo de un cartel está a la altura de tus ojos y el de arriba, 10 m más alto. Estás a 10 m. ¿Qué ángulo abarca el cartel?' + NO_ESC),
      datos: [D5.regla, D5.tabla1],
      solucion: [{ texto: ['La visual de abajo es la horizontal: α = 0°. Arriba, tan β = 10/10 = 1.'], ecuacion: junto([fi, ' = 45° − 0° = ', dH('45°')]) }],
      respuesta: [fi, ' = ', dH('45°')] },
    { nivel: 1, titulo: 'La estatua en su pedestal', figura: fig(letreroFig(6.93, 4, 12, { d: '4√3 m', h1: '4 m', h2: '12 m', f: '?' })),
      enunciado: jN('El pedestal de una estatua llega a 4 m sobre tus ojos y la cabeza de la estatua, a 12 m. Estás a 4√3 m. ¿Qué ángulo abarca la estatua?' + NO_ESC),
      datos: [D5.regla, D5.tabla3],
      solucion: [{ texto: ['tan β = 12/(4√3) = √3 y tan α = 4/(4√3) = √3/3: son 60° y 30°.'], ecuacion: junto([fi, ' = 60° − 30° = ', dH('30°')]) }],
      respuesta: [fi, ' = ', dH('30°')] },
    { nivel: 1, titulo: 'Con las elevaciones dadas',
      enunciado: 'Desde un mismo punto, el borde de abajo de un letrero se ve con 37° de elevación y el de arriba, con 53°. ¿Cuál es su ángulo de observación?',
      datos: [D5.regla],
      solucion: [{ texto: ['Es la resta de las dos elevaciones:'], ecuacion: junto([fi, ' = 53° − 37° = ', dH('16°')]) }],
      respuesta: [fi, ' = ', dH('16°')] },
    { nivel: 2, titulo: 'El largo del letrero', figura: fig(letreroFig(12, 9, 16, { d: '12 m', h1: '9 m', L: '?', a: '37°', f: '16°' })),
      enunciado: jN('Estás a 12 m de un letrero. Su borde de abajo se ve con 37° de elevación y el letrero abarca 16°. ¿Cuánto mide el letrero?' + NO_ESC),
      datos: [D5.regla, D5.tabla1],
      solucion: [
        { texto: ['El borde de arriba se ve con 37° + 16° = 53°. Sus alturas sobre los ojos:'], ecuacion: [junto(['12 · ', frac('4', '3'), ' = ', dO('16')]), SEP, junto(['12 · ', frac('3', '4'), ' = ', dO('9')])] },
        { texto: ['El letrero es la resta:'], ecuacion: junto([dO('16'), ' − ', dO('9'), ' = 7 m']) },
      ],
      respuesta: ['7 m'] },
    { nivel: 2, titulo: 'Con la altura de los ojos', figura: fig(letreroFig(12, 9, 12, { d: '12 m', h1: '?', h2: '?', f: '?' })),
      enunciado: jN('Un letrero va de 10,5 m a 13,5 m del suelo. Tus ojos están a 1,5 m y estás a 12 m. ¿Qué ángulo abarca el letrero?' + NO_ESC),
      datos: [D5.regla, D5.ojo, D5.tabla1],
      solucion: [
        { texto: ['Sobre los ojos, los bordes están a 9 m y a 12 m: los ojos se restan antes.'] },
        { texto: ['Las elevaciones son 37° y 45°:'], ecuacion: junto([fi, ' = 45° − 37° = ', dH('8°')]) },
      ],
      respuesta: [fi, ' = ', dH('8°')] },
    { nivel: 2, titulo: 'Arriba y abajo de los ojos', figura: fig(ventanaFig(7, 16, 37, { h0: '7 m', d: '24 m', sube: '18 m', f: '?' }, { pide: 'f' })),
      enunciado: jN('Desde una ventana a 7 m del suelo miras el edificio de enfrente, a 24 m. Su azotea está 18 m más arriba que tu ventana. ¿Qué ángulo abarca ese edificio?' + NO_ESC),
      datos: [D5.regla, D5.abajo, D5.tabla1, D5.tabla2],
      solucion: [
        { texto: ['Abajo, la base: una depresión, con tan = 7/24, 16°. Arriba, la azotea: una elevación, con tan = 18/24 = 3/4, 37°.'] },
        { texto: ['Quedan a los dos lados de la horizontal: se suman.'], ecuacion: junto([fi, ' = 16° + 37° = ', dH('53°')]) },
      ],
      respuesta: [fi, ' = ', dH('53°')] },
    { nivel: 2, titulo: 'Desde dónde se mira', figura: fig(letreroFig(8.66, 5, 15, { h1: '5 m', h2: '15 m', a: '30°', f: '?' })),
      enunciado: jN('Un letrero va de 5 m a 15 m sobre tus ojos. Te paras donde su borde de abajo se ve con 30°. ¿Qué ángulo abarca el letrero?' + NO_ESC),
      datos: [D5.regla, D5.tabla3, D2.rzr],
      solucion: [
        { texto: ['La distancia sale del borde de abajo:'], ecuacion: junto([dd, ' = 5 · cot 30° = ', dI('5√3')]) },
        { texto: ['Arriba, tan β = 15/(5√3) = √3: β = 60°.'], ecuacion: junto([fi, ' = 60° − 30° = ', dH('30°')]) },
      ],
      respuesta: [fi, ' = ', dH('30°')] },
    { nivel: 2, titulo: 'Dos distancias, el mismo ángulo',
      enunciado: 'Un mural va de 7 m a 24 m sobre tus ojos. ¿Abarca más visto desde 24 m o desde 7 m?',
      datos: [D5.regla, D5.tabla1, D5.tabla2],
      solucion: [
        { texto: ['Desde 24 m: tan β = 1 y tan α = 7/24.'], ecuacion: junto([fi, ' = 45° − 16° = ', dH('29°')]) },
        { texto: ['Desde 7 m: tan β = 24/7 y tan α = 1.'], ecuacion: junto([fi, ' = 74° − 45° = ', dH('29°')]) },
      ],
      respuesta: ['abarca lo mismo: ', dH('29°')] },
    // Nivel 3, tipo examen. Letras de las correctas: E, A, B, C, D (las figuras no tienen puntos con letras).
    { nivel: 3, titulo: 'La antena sobre el edificio', figura: fig(letreroFig(12, 9, 16, { d: '12 m', h1: '9 m', L: '?', f: '16°' })),
      enunciado: jN('Estás a 12 m de un edificio cuya azotea está 9 m sobre tus ojos. La antena que está encima abarca 16° desde tu ojo. ¿Cuánto mide la antena?' + NO_ESC),
      alternativas: ALT5.antena,
      datos: [D5.regla, D5.tabla1, D5.tabla2],
      solucion: [
        { texto: ['La azotea se ve con tan α = 9/12 = 3/4: 37°. La punta, con 37° + 16° = 53°.'], ecuacion: junto(['12 · tan 53° = 12 · ', frac('4', '3'), ' = ', dO('16')]) },
        { texto: ['La antena es lo que va de 9 m a 16 m:'], ecuacion: junto(['16 − 9 = 7 m']) },
        { texto: ['16 m es la punta; 3,5 m es 12 · tan 16°; 9 m es la azotea; 25 m suma las dos alturas.'] },
      ],
      respuesta: [letra(ALT5.antena, '7 m'), ', 7 m'] },
    { nivel: 3, titulo: 'Desde la ventana', figura: fig(ventanaFig(9, 37, 45, { h0: '9 m', d: '12 m', H: '21 m' }, { pide: 'f' })),
      enunciado: jN('Desde una ventana a 9 m del suelo miras un edificio de 21 m que está enfrente, a 12 m. ¿Qué ángulo abarca ese edificio desde la ventana?' + NO_ESC),
      alternativas: ALT5.ventana,
      datos: [D5.regla, D5.abajo, D5.tabla1],
      solucion: [
        { texto: ['La base está 9 m bajo la ventana: depresión con tan = 9/12, 37°. La azotea, 12 m sobre ella: tan = 1, 45°.'] },
        { texto: ['Una baja y la otra sube: se suman.'], ecuacion: junto([fi, ' = 37° + 45° = ', dH('82°')]) },
        { texto: ['8° las resta; 45° y 37° son una sola visual; 53° mide la depresión desde la pared.'] },
      ],
      respuesta: [letra(ALT5.ventana, '82°'), ', ', dH('82°')] },
    { nivel: 3, titulo: 'Las dos franjas', figura: fig(letreroFig(12, 9, 16, { d: '12 m', h1: '9 m', h2: '16 m' })),
      enunciado: jN('Una torre tiene dos franjas: una va de tus ojos a 9 m sobre ellos y la otra, de 9 m a 16 m. Estás a 12 m. ¿Cuánto más abarca la de abajo?' + NO_ESC),
      alternativas: ALT5.franjas,
      datos: [D5.regla, D5.tabla1],
      solucion: [
        { texto: ['Las elevaciones: a 9 m, tan = 3/4, 37°; a 16 m, tan = 4/3, 53°. La de abajo abarca 37° − 0° = 37°; la de arriba, 53° − 37° = 16°.'] },
        { texto: ['La diferencia:'], ecuacion: junto(['37° − 16° = ', dH('21°')]) },
        { texto: ['16° y 37° son lo que abarca cada franja; 53° es la elevación de la punta; 90° suma las dos elevaciones.'] },
      ],
      respuesta: [letra(ALT5.franjas, '21°'), ', ', dH('21°')] },
    { nivel: 3, titulo: '¿A qué distancia?', figura: fig(letreroFig(5.2, 3, 9, { h1: '3 m', h2: '9 m', d: '?' })),
      enunciado: jN('Un letrero va de 3 m a 9 m sobre tus ojos. ¿A qué distancia del poste debes pararte para que abarque el mayor ángulo posible?' + NO_ESC),
      alternativas: ALT5.distancia,
      datos: [D5.regla, D5.max, D5.tabla3],
      solucion: [
        { texto: ['La distancia del mayor ángulo:'], ecuacion: junto([dd, ' = √(3 · 9) = √27 = ', dI('3√3 m')]) },
        { texto: ['Desde ahí: tan α = 3/(3√3) = √3/3 y tan β = 9/(3√3) = √3. Son 30° y 60°: abarca 30°.'] },
        { texto: ['6 m resta las alturas; 3 m y 9 m ponen un borde a 45°; 9√3 m deja el borde de arriba a 30°.'] },
      ],
      respuesta: [letra(ALT5.distancia, '3√3 m'), ', ', dI('3√3 m'), '; abarca ', dH('30°')] },
    { nivel: 3, titulo: 'La pantalla y los ojos', figura: fig(letreroFig(24, 7, 24, { d: '24 m', h1: '?', h2: '?', f: '?' })),
      enunciado: jN('Tus ojos están a 1,5 m del suelo y estás a 24 m de una pantalla que va de 8,5 m a 25,5 m del suelo. ¿Qué ángulo abarca la pantalla?' + NO_ESC),
      alternativas: ALT5.pantalla,
      datos: [D5.regla, D5.ojo, D5.tabla1, D5.tabla2],
      solucion: [
        { texto: ['Sobre los ojos, los bordes están a 7 m y a 24 m: tan α = 7/24 y tan β = 1, 16° y 45°.'] },
        { texto: ['Se restan:'], ecuacion: junto([fi, ' = 45° − 16° = ', dH('29°')]) },
        { texto: ['45° y 16° son una sola visual; 61° las suma; 74° mide el borde de abajo desde la vertical.'] },
      ],
      respuesta: [letra(ALT5.pantalla, '29°'), ', ', dH('29°')] },
  ];

  // El juego del letrero: bordes a 2 m y a 6 m sobre los ojos; la distancia, de 6 a 12 m.
  const A1 = 2, A2 = 6, DMAX = Math.sqrt(A1 * A2);
  const MARCO5 = [[0, 0], [12, OJO + A2]];
  const letreroJ = val => letreroFig(val.d, A1, A2, { d: `d = ${val.d} m`, h1: '2 m', h2: '6 m', f: 'φ' }, { escala: true, marco: MARCO5 });
  // «Así se resuelve»: el ángulo de una franja de un edificio con notables (en «Ahora tú»: otros números, el largo y la ventana).
  function resuelve5(sem) {
    const rr = azar(sem + 900), J = [{ d: 12, hs: [[9, 37], [12, 45], [16, 53]] }, { d: 24, hs: [[7, 16], [18, 37], [24, 45], [32, 53]] }][sem % 2];
    let i, j; do { i = rr.ent(0, J.hs.length - 2); j = rr.ent(i + 1, J.hs.length - 1); } while (J.d === 12 && i === 0 && j === 1);
    const [ha, aa] = J.hs[i], [hb, ab] = J.hs[j];
    const fd = todo => fig(letreroFig(J.d, ha, hb, { d: `${J.d} m`, h1: `${ha} m`, h2: `${hb} m`, f: todo ? `${ab - aa}°` : '?' }));
    return {
      enunciado: jN(`Una franja de un edificio va de ${ha} m a ${hb} m sobre tus ojos, y estás a ${J.d} m. ¿Cuál es su ángulo de observación?${NO_ESC}`),
      datos: [D5.regla, J.d === 24 ? D5.tabla2 : D5.tabla1].concat(J.d === 24 ? [D5.tabla1] : []),
      dibujo: fd(false),
      pasos: [
        { tipo: 'pide', texto: ['Piden el ángulo de observación ', fi, ': lo que abarca la mirada entre los dos bordes.'] },
        { tipo: 'datos', texto: [`Los bordes, a ${ha} m y a ${hb} m sobre los ojos; la distancia, ${J.d} m.`] },
        { tipo: 'regla', texto: ['φ es la resta de dos elevaciones desde el mismo ojo; cada una sale de su tangente.'], ecuacion: junto([fi, ' = ', be, ' − ', al]) },
        { tipo: 'cuentas', texto: ['Cada tangente se simplifica y se reconoce su ángulo de la tabla.'],
          ecuacion: [junto(['tan ', be, ` = ${hb}/${J.d}  →  `, be, ` = ${ab}°`]), SEP, junto(['tan ', al, ` = ${ha}/${J.d}  →  `, al, ` = ${aa}°`])] },
        { tipo: 'cuentas', texto: ['Se restan las dos elevaciones.'], ecuacion: junto([fi, ` = ${ab}° − ${aa}° = `, dH(`${ab - aa}°`)]), dibujo: fd(true) },
        { tipo: 'sentido', texto: [`Tiene sentido: ${ab - aa}° es menos que ${ab}°, la elevación del borde alto: es solo un pedazo de ella.`] },
      ],
      respuesta: [fi, ' = ', dH(`${ab - aa}°`)],
    };
  }
  // «Ahora tú», tipo 0: el ángulo de observación con notables. Los de los ejemplos 1 y 2 no salen.
  function casoObsNotable(rr) {
    const J = rr.uno([{ d: 12, hs: [[9, 37], [12, 45], [16, 53]] }, { d: 24, hs: [[7, 16], [18, 37], [24, 45], [32, 53]] }, { d: 7, hs: [[7, 45], [24, 74]] }]);
    let i, j, k;
    do { i = rr.ent(0, J.hs.length - 2); j = rr.ent(i + 1, J.hs.length - 1); k = J.d === 24 ? 1 : rr.ent(1, 2); }
    while ((J.d === 12 && k === 1 && i === 0 && j === 1) || (J.d === 24 && i === 0 && j === 2) || (J.d === 7 && k === 1));
    const [ha, aa] = J.hs[i], [hb, ab] = J.hs[j], dv = J.d * k;
    return {
      pregunta: jN(`Una franja de un edificio va de ${ha * k} m a ${hb * k} m sobre tus ojos. Estás a ${dv} m. ¿Cuál es su ángulo de observación?${NO_ESC}`),
      datos: [D5.regla, D5.tabla1, D5.tabla2],
      dibujo: fig(letreroFig(dv, ha * k, hb * k, { d: `${dv} m`, h1: `${ha * k} m`, h2: `${hb * k} m`, f: '?' })),
      opciones: opciones(ab - aa, [
        { id: 'arriba', valor: ab, error: 'OBS-SOLO-ARRIBA', siFuera: `${ab}° es la elevación del borde de arriba. Falta restarle la del borde de abajo.` },
        { id: 'abajo', valor: aa, error: 'OBS-SOLO-ABAJO', siFuera: `${aa}° es la elevación del borde de abajo; φ es lo que hay entre las dos visuales.` },
        { id: 'suma', valor: aa + ab, error: 'OBS-SUMA', siFuera: 'Las dos elevaciones son las correctas; el ángulo entre las visuales es su resta.' },
      ], x => `${f(x)}°`),
      solucion: { texto: `Las elevaciones miden ${ab}° y ${aa}°; se restan.`, ecuacion: junto([fi, ` = ${ab}° − ${aa}° = `, dH(`${ab - aa}°`)]) },
    };
  }
  // «Ahora tú», tipo 1: el largo de un letrero con la elevación de su borde bajo y el ángulo que abarca.
  const LARGOS = [[12, 37, 16], [12, 37, 8], [12, 45, 8], [24, 16, 21], [24, 16, 29], [24, 37, 16], [24, 16, 37], [24, 37, 8], [7, 45, 29]];
  function casoObsLargo(rr) {
    let c, k;
    do { c = rr.uno(LARGOS); k = c[0] === 24 ? 1 : rr.ent(1, 2); } while (c[0] === 12 && c[1] === 37 && c[2] === 16 && k === 1);
    const [d0, ga, gf] = c, gb = ga + gf, dv = d0 * k, tn = g => TAN.find(t => t[0] === g)[1];
    const alto = Ex.por(E(dv), tn(gb)), bajo = Ex.por(E(dv), tn(ga)), L = Ex.resta(alto, bajo);
    const enTabla = TAN.some(t => t[0] === gf);
    return {
      pregunta: jN(`Estás a ${dv} m de un letrero. Su borde de abajo se ve con ${ga}° de elevación y el letrero abarca ${gf}°. ¿Cuánto mide el letrero?${NO_ESC}`),
      datos: [D5.regla, D5.tabla1, D5.tabla2],
      dibujo: fig(letreroFig(dv, Ex.val(bajo), Ex.val(alto), { d: `${dv} m`, a: `${ga}°`, f: `${gf}°`, L: '?' })),
      opciones: opciones({ ex: L }, [
        { id: 'arriba', valor: { ex: alto }, error: 'OBS-SOLO-ARRIBA', siFuera: `Ese es el borde de arriba, a ${exTxt(alto, 'm')} sobre los ojos; falta restar el de abajo.` },
        { id: 'resta', valor: enTabla ? { ex: Ex.por(E(dv), tn(gf)) } : null, error: 'OBS-RESTA-ALTURAS', siFuera: `Usar ${gf}° es tentador; pero ${gf}° no es una elevación: no sale del suelo de los ojos.` },
        { id: 'suma', valor: { ex: Ex.suma(alto, bajo) }, error: 'OBS-SUMA', siFuera: 'Las dos alturas están bien; el letrero es lo que hay entre ellas: se restan.' },
        { id: 'abajo', valor: { ex: bajo }, error: 'OBS-SOLO-ABAJO', siFuera: 'Esa es la altura del borde de abajo, no el largo del letrero.' },
      ], x => largo(x.ex)),
      solucion: { texto: `El borde de arriba se ve con ${ga}° + ${gf}° = ${gb}°. Las dos alturas, y se restan.`, ecuacion: junto([`${dv} · tan ${gb}° − ${dv} · tan ${ga}° = ${Ex.txt(alto)} − ${Ex.txt(bajo)} = ${exTxt(L, 'm')}`]) },
    };
  }
  // «Ahora tú», tipo 2 (nivel de examen): desde una ventana, un edificio de enfrente con la base bajo los ojos (depresión)
  // y la azotea sobre ellos (elevación): se suman. El de 9 m y 12 m a 12 m es el ejemplo 12.
  function casoVentanaObs(rr) {
    const J = rr.uno([{ d: 12, hs: [[9, 37], [12, 45], [16, 53]] }, { d: 24, hs: [[7, 16], [18, 37], [24, 45], [32, 53]] }]);
    let i, j;
    do { i = rr.ent(0, J.hs.length - 1); j = rr.ent(0, J.hs.length - 1); } while ((J.d === 12 && i === 0 && j === 1) || (J.d === 24 && i === 0 && j === 1));   // los ejemplos 12 y 8
    const [h0, gb] = J.hs[i], [arriba, ga] = J.hs[j], Htot = h0 + arriba;
    return {
      pregunta: jN(`Desde una ventana a ${h0} m del suelo miras un edificio de ${Htot} m que está enfrente, a ${J.d} m. ¿Qué ángulo abarca ese edificio desde la ventana?${NO_ESC}`),
      datos: [D5.regla, D5.abajo, D5.tabla1, D5.tabla2],
      dibujo: fig(ventanaFig(h0, gb, ga, { h0: `${h0} m`, d: `${J.d} m`, H: `${Htot} m` }, { pide: 'f' })),
      opciones: opciones(gb + ga, [
        { id: 'resta', valor: Math.abs(ga - gb) || null, error: 'OBS-RESTA', siFuera: 'Las dos visuales están bien; pero una baja y la otra sube: los ángulos se suman.' },
        { id: 'arriba', valor: ga, error: 'OBS-SOLO-ARRIBA', siFuera: `${ga}° es solo la visual a la azotea; falta la de la base, bajo la ventana.` },
        { id: 'abajo', valor: gb, error: 'OBS-SOLO-ABAJO', siFuera: `${gb}° es solo la depresión a la base; falta la elevación a la azotea.` },
      ].filter(x => x.valor), x => `${f(x)}°`),
      solucion: { texto: `Base: depresión de tan ${h0}/${J.d}, ${gb}°. Azotea: elevación de tan ${arriba}/${J.d}, ${ga}°. Se suman.`, ecuacion: junto([fi, ` = ${gb}° + ${ga}° = `, dH(`${gb + ga}°`)]) },
    };
  }

  const observacion = {
    id: 'angulo-observacion',
    titulo: 'Ángulo de observación',
    pregunta: '¿Qué ángulo abarca tu mirada entre los dos bordes de un letrero?',
    temas: ['Ángulo de observación'],
    pieza: VI,
    aprendizaje: 'El ángulo de observación es la resta de las elevaciones de los dos bordes, φ = β − α; acercarse lo agranda solo hasta un punto.',
    actividad: 'Acercarte o alejarte de un letrero y mirar lo que abarcan tus dos visuales.',
    // Lee: el objeto y el vocabulario; no dice qué pasa con φ muy cerca del poste (la predicción).
    lee: {
      tarjetas: [
        { titulo: 'El letrero de la plaza', texto: 'En la plaza, un letrero alto está en un poste. Lo miras entero: una visual va a su borde de abajo y otra, a su borde de arriba.',
          pieza: VI, dibujo: { datos: letreroFig(10, A1, A2, {}, { escala: true }), estado: {} } },
        { titulo: 'Dos visuales, un ojo', texto: ['Cada visual sube su propio ángulo de elevación desde la horizontal de tus ojos: ', al, ' hasta el borde bajo y ', be, ' hasta el alto. Entre las dos visuales queda el ángulo de observación, ', fi, '.'] },
        { titulo: 'Qué mirar al jugar', texto: 'Vas a cambiar tu distancia al poste. Mira cómo se abren o se cierran las dos visuales.' },
      ],
    },
    ejemplos: EJEMPLOS_5,
    juega: {
      pieza: VI,
      consigna: ['El letrero va de 2 m a 6 m sobre tus ojos. Cambia tu distancia ', dd, ' y mira el ángulo ', fi, ' entre las dos visuales.'],
      mision: {
        texto: 'Busca una distancia desde la que el letrero abarque más de 25°.',
        logrado: val => phiDe(val.d, A1, A2) > 25,
        bien: `Listo: a 6 m, φ ≈ 45° − ${f(atanG(A1, 6), 1)}° ≈ ${f(phiDe(6, A1, A2), 1)}°.`,
      },
      voz: 'Compara las dos visuales: la de arriba y la de abajo.',
      leyenda: [
        { s: al, t: 'elevación del borde de abajo' },
        { s: be, t: 'elevación del borde de arriba' },
        { s: fi, t: 'ángulo de observación, entre las dos visuales' },
        { s: dd, t: 'tu distancia al poste, por el suelo' },
      ],
      controles: [{ id: 'd', etiqueta: 'd, distancia al poste', color: 'c-i', min: 6, max: 12, paso: 1, inicio: 10, unidad: 'm', decimales: 0 }],
      dibujo: val => ({ datos: letreroJ(val), estado: {} }),
      lectura: val => [fi, ' = ', be, ' − ', al, ` ≈ ${f(atanG(A2, val.d), 1)}° − ${f(atanG(A1, val.d), 1)}° ≈ ${f(phiDe(val.d, A1, A2), 1)}°`],
      minimo: 3,
    },
    predice: {
      pregunta: 'En el juego, de 12 m a 6 m, acercarse agrandó φ. Si sigues acercándote hasta quedar junto al poste, ¿qué le pasa a φ?',
      datos: ['Bordes del letrero: 2 m y 6 m sobre tus ojos.'],
      voz: 'Imagina las dos visuales cuando estás casi debajo del letrero.',
      opciones: [
        { id: 'c', texto: 'Crece hasta un máximo y luego baja hacia 0°', correcta: true },
        { id: 'crece', texto: 'Sigue creciendo hasta casi 90°', error: 'OBS-CRECE', siFuera: 'Acercarse lo agranda mientras estás lejos. Muy cerca, las dos visuales quedan casi verticales y se juntan.' },
        { id: 'constante', texto: 'Desde cierta distancia ya no cambia', error: 'OBS-CONSTANTE', siFuera: 'Cerca del máximo cambia poco, es cierto; después vuelve a bajar.' },
        { id: '45', texto: 'Crece hasta 45° y se queda ahí', error: 'OBS-45', siFuera: 'Buscar un tope está bien; aquí el tope es 30°, y después φ baja.' },
      ],
      dibujo: { datos: letreroFig(3, A1, A2, { d: 'd = ?', f: 'φ' }, { escala: true }), estado: {} },
      revelar: { datos: letreroFig(1, A1, A2, { d: 'd = 1 m', f: `${f(phiDe(1, A1, A2), 1)}°` }, { escala: true, nota: `el mayor: φ = 30° a d = 2√3 m ≈ ${f(DMAX)} m` }), estado: {} },
      coincide: `Coincide: el mayor φ es 30°, a unos ${f(DMAX, 1)} m. Más cerca vuelve a bajar.`,
      noCoincide: `Revisemos: a 1 m, φ ya bajó a unos ${f(phiDe(1, A1, A2), 1)}°.`,
    },
    mira: {
      pieza: VI,
      datos: letreroFig(DMAX, A1, A2, { d: 'd = 2√3 m', h1: '2 m', h2: '6 m', a: [{ t: '' }, { t: 'α', paso: 1 }], b: [{ t: '' }, { t: 'β', paso: 2 }], f: [{ t: '' }, { t: 'φ', paso: 3 }] }, { escala: true }),
      voz: 'Dos elevaciones desde el mismo ojo; φ es su diferencia.',
      pasos: [
        { estado: { paso: 1 }, texto: 'La visual al borde de abajo sube un ángulo α.', ecuacion: junto(['tan ', al, ' = ', frac('2', dd)]) },
        { estado: { paso: 2 }, texto: 'La visual al borde de arriba sube β, más empinada.', ecuacion: junto(['tan ', be, ' = ', frac('6', dd)]) },
        { estado: { paso: 3 }, texto: 'φ es lo que una visual le saca a la otra.', ecuacion: junto([fi, ' = ', be, ' − ', al]) },
        { estado: { paso: 3 }, texto: 'A d = 2√3 m, tan β = √3 y tan α = √3/3.', ecuacion: junto([fi, ' = 60° − 30° = 30°']) },
        { estado: { paso: 3 }, texto: 'Ese es el mayor φ: más cerca o más lejos, abarca menos.', ecuacion: junto([`a 1 m: ${fi} ≈ ${f(phiDe(1, A1, A2), 1)}°`]) },
      ],
    },
    regla: {
      texto: 'El ángulo de observación es la resta de las elevaciones de los dos bordes, desde el mismo ojo. No sale de restar alturas. Acercarse lo agranda solo hasta un máximo.',
      ecuacion: [junto([fi, ' = ', be, ' − ', al]), SEP, junto(['tan ', al, ' = ', frac(h1, dd)]), SEP, junto(['tan ', be, ' = ', frac(h2, dd)])],
      condicion: 'Mismo ojo; h₁ y h₂, sobre él. Si el borde de abajo queda bajo tus ojos, es una depresión y se suma.',
      voz: 'Resta ángulos, no alturas.',
      dibujo: { pieza: VI, datos: letreroFig(10, 3, 8, { h1: 'h₁', h2: 'h₂', d: 'd', a: 'α', b: 'β', f: 'φ' }, { escala: true }), estado: {} },
    },
    resuelve: { pieza: VI, generar: resuelve5 },
    ahoraTu: {
      pieza: VI,
      voz: 'Calcula cada elevación por separado y después réstalas.',
      generar(sem) { return sinRepetir([casoObsNotable, casoObsLargo, casoVentanaObs][sem % 3], sem, observacion); },
    },
  };

  // Glosario (docs/teoria.md §4d y 4g): las palabras que esta unidad estrena en el curso, con `simple` las que se muestran
  // en el Resumen de su idea y 3 ejemplos cada una. Catetos, hipotenusa y las seis razones vienen de «Razones». Ningún
  // `simple` ni ejemplo dice lo que responde una predicción: «ángulos alternos internos» (la razón de que la depresión
  // valga lo que la elevación) va sin `simple` y se usa recién en «Mira»; tampoco hay «máximo» (la predicción de la idea 5).
  const GLOSARIO = [
    { termino: 'resolver un triángulo', formas: ['resolver un triángulo rectángulo', 'resolver un triángulo', 'resolver el triángulo'],
      simple: 'Hallar los lados y los ángulos que le faltan a un triángulo.',
      def: 'Hallar los lados y ángulos que faltan de un triángulo a partir de los que se conocen.',
      ejemplos: ['Hipotenusa de 10 cm y 30°: los catetos miden 5 cm y 5√3 cm.', 'Un cateto de 6 m y 45°: el otro cateto también mide 6 m.', 'Catetos de 3 y 4: la hipotenusa mide 5.'],
      ver: ['despejar'] },
    { termino: 'despejar', formas: ['despejar', 'despeja', 'despejas', 'despejamos', 'despejando', 'se despeja'],
      simple: 'Dejar sola, a un lado del igual, la letra que buscas.',
      def: 'Dejar sola una letra a un lado del igual, haciendo la misma operación en los dos lados.',
      ejemplos: ['De CO/8 = 1/2 sale CO = 8 · 1/2 = 4.', 'De 2x = 10 sale x = 10 ÷ 2 = 5.', 'De 12/x = 3 sale x = 12 ÷ 3 = 4.'],
      ver: ['resolver un triángulo'] },
    { termino: 'pie', formas: ['pie'],
      simple: 'El punto del suelo justo debajo de algo alto.',
      def: 'Punto donde una línea vertical o perpendicular llega al suelo o a la base: justo debajo de la punta.',
      ejemplos: ['El pie de un poste es donde se clava en el suelo.', 'El pie de una escalera es su extremo apoyado en el piso.', 'Del ojo al pie de una torre se mide por el suelo.'],
      ver: ['vertical'] },
    { termino: 'distancia', medida: 'm', formas: ['distancia', 'distancias'],
      def: 'Largo del camino más corto entre dos puntos, o de un punto a una recta. Nunca es negativa.',
      ejemplos: ['Del ojo al pie de una torre, por el suelo: 6 m.', 'De un punto a una recta se mide en perpendicular.', 'Entre dos pueblos, por la carretera, hay más que en línea recta.'],
      ver: ['horizontal'] },
    { termino: 'cable tensor', formas: ['cable tensor', 'cables tensores', 'tensor', 'tensores'],
      simple: 'El cable que sujeta una antena al suelo para que no se caiga.',
      def: 'Cable tenso que va de lo alto de una antena o de un poste a una estaca en el suelo.',
      ejemplos: ['Las antenas de radio llevan tres o cuatro cables tensores.', 'El cable tensor, la antena y el suelo arman un triángulo.', 'Las cuerdas que sujetan una carpa hacen de tensores.'],
      ver: ['pie'] },
    { termino: 'numerador', formas: ['numerador', 'numeradores'],
      simple: 'El número o el lado que va arriba en una fracción.',
      def: 'Lo que va arriba en una fracción: lo que se divide. En 3/5, es el 3.',
      ejemplos: ['En 7/24, el numerador es 7.', 'En CO/H, el numerador es el cateto opuesto.', 'En H/CO, la hipotenusa va en el numerador.'],
      ver: ['despejar'] },
    { termino: 'horizontal', formas: ['horizontal', 'horizontales'],
      simple: 'Una línea plana, como el agua quieta o el piso.',
      def: 'Línea paralela al suelo plano, como la superficie del agua quieta. Desde ella se miden elevación y depresión.',
      ejemplos: ['El nivel del agua en un vaso quieto.', 'La línea que sale de tus ojos cuando miras de frente.', 'El borde de una mesa bien nivelada.'],
      ver: ['vertical', 'ángulo de elevación'] },
    { termino: 'vertical', formas: ['vertical', 'verticales'],
      def: 'Línea como la de una plomada: forma ángulo recto con el suelo plano.',
      ejemplos: ['Un poste bien parado.', 'La cuerda de una plomada.', 'La esquina de una pared.'],
      ver: ['horizontal'] },
    { termino: 'línea visual', formas: ['línea visual', 'líneas visuales', 'visual', 'visuales'],
      simple: 'La línea recta que va de tu ojo a lo que miras.',
      def: 'Recta que va del ojo de quien mira hasta el punto que mira.',
      ejemplos: ['Del ojo de una niña a la punta de un poste.', 'Del piloto de un globo a una persona en el suelo.', 'De lo alto de un faro a una lancha en el mar.'],
      ver: ['ángulo de elevación', 'ángulo de depresión'] },
    { termino: 'ángulo de elevación', formas: ['ángulo de elevación', 'ángulos de elevación', 'elevación', 'elevaciones'],
      simple: 'Cuánto subes la mirada, desde mirar de frente, para ver algo alto.',
      def: 'Lo que sube la mirada, medido desde la horizontal del ojo, para ver algo más alto.',
      ejemplos: ['Mirar la punta de un poste desde la vereda.', 'A 6 m de un muro, con 45°, su borde está 6 m sobre tus ojos.', 'Mirar un avión que pasa alto.'],
      ver: ['ángulo de depresión', 'horizontal'] },
    { termino: 'ángulo de depresión', formas: ['ángulo de depresión', 'ángulos de depresión', 'depresión', 'depresiones'],
      simple: 'Cuánto bajas la mirada, desde mirar de frente, para ver algo bajo.',
      def: 'Lo que baja la mirada, medido desde la horizontal del ojo, para ver algo más bajo.',
      ejemplos: ['Desde un balcón, mirar a alguien en la calle.', 'Desde un faro, mirar una lancha en el mar.', 'Desde un cerro, mirar la plaza de la ciudad.'],
      ver: ['ángulo de elevación', 'horizontal'] },
    // Sin `simple`: lo que dice responde la predicción de la idea 3. Se usa recién en «Mira» y en la regla.
    { termino: 'ángulos alternos internos', formas: ['ángulos alternos internos', 'alternos internos'],
      def: 'Dos ángulos entre dos paralelas, a distinto lado de la recta que las corta. Miden lo mismo.',
      ejemplos: ['Una escalera entre el piso y el techo: el ángulo de abajo y el de arriba.', 'La letra Z: sus dos esquinas.', 'Una visual entre dos horizontales: arriba y abajo.'],
      ver: ['horizontal'] },
    { termino: 'lado común', formas: ['lado común', 'lados comunes'],
      simple: 'Un lado que dos triángulos comparten.',
      def: 'Lado que pertenece a dos triángulos a la vez: mide lo mismo en los dos.',
      ejemplos: ['La altura de una torre vista desde dos lugares.', 'La diagonal que parte un rectángulo en dos triángulos.', 'El poste al que llegan dos cables.'],
      ver: ['pie'] },
    { termino: 'rapidez', medida: 'm/s', formas: ['rapidez'],
      simple: 'Cuántos metros avanza algo en cada segundo.',
      def: 'Lo que recorre un móvil en cada unidad de tiempo. Si no cambia, d = v · t.',
      ejemplos: ['Una combi a 15 m/s avanza 30 m en 2 s.', '54 km/h son 15 m/s.', 'Un dron a 4 m/s recorre 20 m en 5 s.'],
      ver: ['distancia'] },
    { termino: 'ángulo de observación', formas: ['ángulo de observación', 'ángulos de observación'],
      simple: 'Lo que abarca tu mirada entre los dos bordes de algo.',
      def: 'Ángulo entre las visuales a los dos bordes de un objeto, desde el mismo ojo: cuánto abarca la mirada.',
      ejemplos: ['Entre el pie y la cabeza de una estatua.', 'Entre el borde de abajo y el de arriba de una pantalla de cine.', 'Bordes vistos a 37° y a 53°: abarca 16°.'],
      ver: ['línea visual', 'ángulo de elevación', 'borde'] },
    { termino: 'borde', formas: ['borde', 'bordes'],
      simple: 'La orilla de algo: donde empieza o donde termina.',
      def: 'Línea o punto donde termina una cosa: en un letrero, su lado de abajo y el de arriba.',
      ejemplos: ['El borde de abajo de una ventana.', 'El borde de arriba de una pizarra.', 'Los bordes de una pantalla de cine.'],
      ver: ['ángulo de observación'] },
  ];

  // ====================================================================================================================
  // Laboratorio (docs/teoria.md §4b y 4g): una mesa por idea, o dos. Se conservan las cuatro de antes con sus id y los de
  // sus controles (torre-campo en 3D, instrumento, faro, letrero-cerca), con los colores de la unidad (la altura naranja,
  // la distancia turquesa, el ángulo carmín, la visual en tinta), y entra cometa-libre (idea 1);
  // la idea 2 aporta su juego (el tope es de 5 mesas).
  // ====================================================================================================================
  // Gesto directo: la pieza «triangulo» ajusta la escala a sus puntos; un «marco» invisible la fija.
  const TRI = () => Kit.piezas.triangulo;
  const enPx = (dd0, x, y) => { const g = TRI().geometria(dd0); return { x: g.X(x), y: g.Y(y) }; };
  const delPx = (dd0, pt) => {
    const g = TRI().geometria(dd0), x0 = g.X(0), y0 = g.Y(0);
    return { x: (pt.x - x0) / (g.X(1) - x0), y: (pt.y - y0) / (g.Y(1) - y0) };
  };
  // ---------- Laboratorio ----------
  // Ojo a la altura a sobre el suelo: la visual sube θ desde la horizontal del ojo; la torre suma a.
  // El ojo no lleva rótulo: lo marca su manija, y el rótulo «a = …» queda libre a su izquierda.
  // Tramo de la torre sobre el ojo y altura total (con el tramo a bajo el ojo): los usan el dibujo, la lectura y los retos.
  const sobreOjo = v => v.d * Math.tan(v.g * RAD), altoTorre = v => sobreOjo(v) + v.a;
  function instr(v) {
    const t = sobreOjo(v), Q = { id: 'Q', x: v.d, y: v.a };
    const lados = [
      { de: 'O', a: 'Q', color: 'i', texto: `d = ${f(v.d)} m`, horizontal: v.a > 0, grosor: 'variable' },
      { de: 'Q', a: 'T', color: 'o', texto: `${f(t, 1)} m`, grosor: 'variable' },
      { de: 'O', a: 'T', visual: true },
    ].concat(v.a > 0 ? [{ de: 'S', a: 'O', texto: `ojo: ${f(v.a)} m`, grosor: 'contorno' }, { de: 'P', a: 'Q', texto: `${f(v.a)}`, grosor: 'contorno' }] : []);
    return {
      suelo: true,
      puntos: [{ id: 'S', x: 0, y: 0 }, { id: 'O', x: 0, y: v.a }, { id: 'P', x: v.d, y: 0 }, Q, { id: 'T', x: v.d, y: v.a + t },
        { id: 'marco', x: 12, y: 12 * Math.tan(v.g * RAD) + 2, paso: 99 }, { id: 'margen', x: -2.5, y: 0, paso: 99 }],
      lados,
      angulos: [{ en: 'O', de: 'Q', a: 'T', texto: `${v.g}°`, color: 'h' }],
    };
  }
  // Faro con el pie en el origen y la lancha a la izquierda; marco fijo para que la lancha siga al dedo.
  // Distancia de la lancha al pie del faro: la usan el dibujo, la lectura y los retos.
  const lejosFaro = v => v.H / Math.tan(v.g * RAD);
  function faroL(v) {
    const x = lejosFaro(v);
    return {
      suelo: true,
      puntos: [{ id: 'L', x: -x, y: 0, rotulo: 'lancha' }, { id: 'P', x: 0, y: 0, rotulo: 'faro' }, { id: 'F', x: 0, y: v.H }, { id: 'X', x: -x, y: v.H },
        { id: 'marco', x: -30 / Math.tan(30 * RAD), y: 30, paso: 99 }],
      lados: [
        { de: 'P', a: 'F', color: 'o', texto: `${f(v.H)} m`, grosor: 'variable' },
        { de: 'F', a: 'X', horizontal: true },
        { de: 'F', a: 'L', visual: true },
        { de: 'L', a: 'P', color: 'i', texto: `${f(x, 1)} m`, grosor: 'variable' },
      ],
      angulos: [{ en: 'F', de: 'X', a: 'L', texto: `${v.g}°`, color: 'h' }, { en: 'L', de: 'P', a: 'F', texto: `${v.g}°`, color: 'h' }, { en: 'P', de: 'L', a: 'F' }],
    };
  }
  const casi = (x, y) => Math.abs(x - y) < 1e-9;
  const betaL = v => (Math.atan((v.a + v.L) / v.d) - Math.atan(v.a / v.d)) * GRA;
  const letL = v => ({
    suelo: true,
    puntos: [{ id: 'O', x: 0, y: 0, rotulo: 'ojo' }, { id: 'P', x: v.d, y: 0 }, { id: 'A', x: v.d, y: v.a }, { id: 'B', x: v.d, y: v.a + v.L },
      { id: 'marco', x: 12, y: 10, paso: 99 }],
    lados: [
      { de: 'O', a: 'P', color: 'i', texto: `d = ${f(v.d)} m`, grosor: 'variable' },
      { de: 'P', a: 'A', texto: `${f(v.a)} m` },
      { de: 'A', a: 'B', color: 'o', texto: `${f(v.L)} m`, grosor: 'variable' },
      { de: 'O', a: 'A', visual: true }, { de: 'O', a: 'B', visual: true },
    ],
    angulos: [{ en: 'O', de: 'A', a: 'B', texto: 'φ', color: 'h', radio: 46 }],
  });

  // ---------- La torre y dos miradas (laboratorio 3D, 15 nov: exploración libre, sin predicciones) ----------
  // A está al sur del pie; B gira desde el sur hacia el este y el norte (φ, el ángulo en el pie). Elevaciones y AB
  // las calcula el motor del campo (plantillas/trig-angulos-verticales/motor.js), el mismo que usa la pieza para
  // dibujar: los retos miden lo que se ve (regla 1).
  const campoDe = v => MC.campo({ h: v.h, obs: [{ id: 'A', az: 180, d: v.dA }, { id: 'B', az: 180 - v.phi, d: v.dB }] });
  const eA = v => campoDe(v).obs[0].elev, eB = v => campoDe(v).obs[1].elev, AB = v => campoDe(v).pares[0].distancia;
  const mesaTorre = {
    id: 'torre-campo', titulo: 'La torre y dos miradas', pieza: 'trig-campo-3d',
    consigna: 'Gira el campo. Cambia la torre, las distancias y el ángulo en el pie: mira los triángulos de pie y el del piso.',
    controles: [
      { id: 'h', etiqueta: 'h', color: 'c-o', min: 4, max: 20, paso: 2, inicio: 12, unidad: 'm', decimales: 0 },
      { id: 'dA', etiqueta: 'A al pie', color: 'c-i', min: 2, max: 20, paso: 2, inicio: 16, unidad: 'm', decimales: 0 },
      { id: 'dB', etiqueta: 'B al pie', color: 'c-i', min: 2, max: 20, paso: 2, inicio: 8, unidad: 'm', decimales: 0 },
      { id: 'phi', etiqueta: 'ángulo en el pie', color: 'c-h', min: 0, max: 180, paso: 15, inicio: 90, unidad: '°', decimales: 0 },
    ],
    dibujo: v => ({ datos: { h: v.h, obs: [{ id: 'A', az: 180, d: v.dA, ang: 'α' }, { id: 'B', az: 180 - v.phi, d: v.dB, ang: 'β' }], par: true, pie: true }, estado: {} }),
    lectura: v => [al, ` ≈ ${f(eA(v), 1)}°;   `, be, ` ≈ ${f(eB(v), 1)}°;   AB ≈ ${f(AB(v), 1)} m`],
    invitaciones: [
      { texto: 'Haz que desde A la punta se vea a 45°.',
        logrado: v => casi(eA(v), 45),
        bien: 'A 45°, la torre mide lo mismo que tu distancia al pie.',
        pista: 'Pon la distancia de A igual a la altura h.' },
      { texto: 'Con 90° en el pie, deja a A y B a 20 m.',
        logrado: v => v.phi === 90 && casi(AB(v), 20),
        bien: 'En el piso hay otro triángulo rectángulo: 12, 16 y 20, como 3, 4 y 5.',
        pista: 'Busca dos distancias al pie que con 20 formen un trío de Pitágoras.' },
      { texto: 'Consigue la misma elevación desde A y desde B, en lugares distintos.',
        logrado: v => casi(eA(v), eB(v)) && AB(v) > 0.5,
        bien: 'Igual distancia al pie, igual elevación: el rumbo no cambia el ángulo.',
        pista: 'Iguala las dos distancias al pie y abre el ángulo.' },
      { texto: 'Logra que AB sea la suma de las dos distancias al pie.',
        logrado: v => casi(AB(v), v.dA + v.dB),
        bien: 'Solo en lados opuestos se suman. Si no, el piso arma un triángulo.',
        pista: 'Lleva el ángulo en el pie hasta su tope.' },
      { texto: 'Guarda dos casos con la torre al doble y las mismas elevaciones.',
        logrado: (v, gs) => gs.some(p => gs.some(q => q.h === 2 * p.h && casi(eA(p), eA(q)) && casi(eB(p), eB(q)))),
        testigo: [{ h: 6, dA: 8, dB: 4, phi: 90 }, { h: 12, dA: 16, dB: 8, phi: 90 }],
        bien: 'Todo al doble y los mismos ángulos: la elevación fija la forma, no el tamaño.' },
    ],
  };
  const LABORATORIO = [
    mesaTorre,
      {
        id: 'instrumento', titulo: 'El ojo, sobre el suelo', pieza: 'triangulo',
        consigna: 'El ojo está a una altura a. Arrastra el ojo, el pie y la punta. La torre suma el tramo bajo el ojo.',
        controles: [
          { id: 'a', etiqueta: 'altura del ojo', min: 0, max: 2, paso: 0.5, inicio: 1.5, unidad: 'm', decimales: 1 },
          { id: 'd', etiqueta: 'd', color: 'c-i', min: 2, max: 12, paso: 1, inicio: 6, unidad: 'm', decimales: 0 },
          { id: 'g', etiqueta: 'θ', color: 'c-h', min: 10, max: 60, paso: 1, inicio: 30, unidad: '°', decimales: 0 },
        ],
        dibujo: v => ({ datos: instr(v), estado: {} }),
        lectura: v => [hh, ` = ${f(v.d)} · tan ${v.g}° + ${f(v.a)} ≈ ${f(altoTorre(v))} m`],
        // Retos: altoTorre y sobreOjo son las cuentas con que instr dibuja la torre.
        invitaciones: [
          { texto: 'Con el ojo a 1,5 m de altura, consigue una torre de 7,5 m.',
            logrado: v => v.a === 1.5 && casi(altoTorre(v), 7.5),
            bien: '6 m sobre el ojo y 1,5 m debajo: el tramo bajo el ojo también cuenta.' },
          { texto: 'Pon el ojo en el suelo y haz que la torre mida lo mismo que d.',
            logrado: v => v.a === 0 && casi(altoTorre(v), v.d),
            bien: 'Sin altura del ojo, 45° da torre igual a distancia: tan 45° = 1.' },
          { texto: 'Haz la torre más alta posible sin pasar de 45° de elevación.',
            logrado: v => v.g <= 45 && casi(altoTorre(v), altoTorre({ a: 2, d: 12, g: 45 })),
            bien: 'Lejos, alto y a 45°: 12 m sobre el ojo y 2 m debajo.' },
          { texto: 'A 60°, busca la menor distancia que dé una torre de más de 10 m.',
            // La más corta: con el ojo lo más alto (2 m), un metro menos ya no alcanza.
            logrado: v => v.g === 60 && altoTorre(v) > 10 && altoTorre({ a: 2, d: v.d - 1, g: 60 }) <= 10,
            bien: `A 5 m ya pasa: ${f(sobreOjo({ d: 5, g: 60 }))} m sobre el ojo, más lo de abajo.` },
        ],
        // El ojo sube o baja (a); el pie de la torre cambia d; la punta, vista desde el ojo, cambia θ.
        arrastres: [
          { id: 'ojo', etiqueta: 'ojo: cambia su altura',
            donde: v => enPx(instr(v), 0, v.a),
            mover: (pt, v) => ({ a: delPx(instr(v), pt).y }) },
          { id: 'pie', etiqueta: 'pie de la torre: cambia d', color: 'c-i',
            donde: v => enPx(instr(v), v.d, 0),
            mover: (pt, v) => ({ d: delPx(instr(v), pt).x }) },
          { id: 'punta', etiqueta: 'punta de la torre: cambia θ', color: 'c-h',
            donde: v => enPx(instr(v), v.d, v.a + v.d * Math.tan(v.g * RAD)),
            mover: (pt, v) => { const q = delPx(instr(v), pt); return { g: Math.atan2(q.y - v.a, q.x) * GRA }; } },
        ],
      },
      {
        id: 'faro', titulo: 'Depresión desde el faro', pieza: 'triangulo',
        consigna: 'Desde lo alto del faro miras la lancha. Arrastra la lancha y la punta del faro: compara la depresión con la elevación.',
        controles: [
          { id: 'H', etiqueta: 'altura', color: 'c-o', min: 10, max: 30, paso: 2, inicio: 20, unidad: 'm', decimales: 0 },
          { id: 'g', etiqueta: 'θ', color: 'c-h', min: 30, max: 75, paso: 1, inicio: 37, unidad: '°', decimales: 0 },
        ],
        dibujo: v => ({ datos: faroL(v), estado: {} }),
        lectura: v => [`depresión = elevación = ${v.g}°;   `, dd, ` = ${v.H} ÷ tan ${v.g}° ≈ ${f(lejosFaro(v))} m`],
        // Retos: lejosFaro es la distancia con que faroL dibuja la lancha.
        invitaciones: [
          { texto: 'Haz que la lancha quede tan lejos del pie como alto es el faro.',
            logrado: v => casi(lejosFaro(v), v.H),
            bien: 'Depresión de 45°: distancia igual a altura. Desde la lancha, la elevación también es 45°.' },
          { texto: 'Guarda dos casos con el mismo ángulo y el faro al doble de alto.',
            logrado: (v, gs) => gs.some(a => gs.some(b => a.g === b.g && b.H === 2 * a.H)),
            bien: 'Faro al doble, lancha al doble de lejos: el ángulo fija la forma.' },
          { texto: 'Lleva la lancha lo más lejos posible del faro.',
            logrado: v => casi(lejosFaro(v), lejosFaro({ H: 30, g: 30 })),
            bien: 'Lejos, la visual baja poco: la depresión se achica.' },
          { texto: 'Acerca la lancha hasta quedar a menos de media altura del pie.',
            logrado: v => lejosFaro(v) < v.H / 2,
            bien: 'Pasa desde 64°: la visual casi cae vertical. ¿Qué pasaría cerca de 90°?' },
        ],
        // La lancha corre por el agua: cambia el ángulo; la punta del faro cambia su altura.
        arrastres: [
          { id: 'lancha', etiqueta: 'lancha: cambia el ángulo', color: 'c-h',
            donde: v => enPx(faroL(v), -v.H / Math.tan(v.g * RAD), 0),
            mover: (pt, v) => ({ g: Math.atan2(v.H, Math.max(-delPx(faroL(v), pt).x, 1e-6)) * GRA }) },
          { id: 'punta', etiqueta: 'punta del faro: cambia su altura', color: 'c-o',
            donde: v => enPx(faroL(v), 0, v.H),
            mover: (pt, v) => ({ H: delPx(faroL(v), pt).y }) },
        ],
      },
      {
        id: 'letrero-cerca', titulo: 'El letrero, de cerca', pieza: 'triangulo',
        consigna: 'Arrastra el pie del poste y los dos bordes del letrero. Acércate hasta medio metro y busca dónde φ es mayor.',
        controles: [
          { id: 'd', etiqueta: 'd', color: 'c-i', min: 0.5, max: 12, paso: 0.5, inicio: 6, unidad: 'm', decimales: 1 },
          { id: 'a', etiqueta: 'borde bajo', color: 'c-o', min: 1, max: 4, paso: 0.5, inicio: 2, unidad: 'm', decimales: 1 },
          { id: 'L', etiqueta: 'letrero', color: 'c-o', min: 1, max: 6, paso: 0.5, inicio: 4, unidad: 'm', decimales: 1 },
        ],
        dibujo: v => ({ datos: letL(v), estado: {} }),
        lectura: v => [fi, ` ≈ ${f(betaL(v), 1)}° a `, dd, ` = ${f(v.d)} m;   el mayor, a ${f(Math.sqrt(v.a * (v.a + v.L)), 1)} m`],
        // Retos: betaL es el ángulo entre las dos visuales que dibuja letL.
        invitaciones: [
          { texto: 'Para tu letrero, busca la distancia donde φ es mayor.',
            logrado: v => betaL(v) >= betaL(Object.assign({}, v, { d: v.d - 0.5 })) && betaL(v) >= betaL(Object.assign({}, v, { d: v.d + 0.5 })),
            bien: 'Ni lejos ni pegado: el mayor φ está cerca de √(h₁ · h₂), con los dos bordes.' },
          { texto: 'Guarda dos distancias distintas, con el mismo letrero, que den el mismo φ.',
            logrado: (v, gs) => gs.some(p => gs.some(q => p.a === q.a && p.L === q.L && p.d !== q.d && casi(betaL(p), betaL(q)))),
            bien: 'Se ve igual cuando las dos distancias, multiplicadas, dan h₁ · h₂.' },
          { texto: 'Consigue que φ mida justo 45°.',
            logrado: v => casi(betaL(v), 45),
            bien: 'Restar dos elevaciones dio un ángulo notable. ¿Hay otra distancia que lo dé?' },
          { texto: 'Acércate a medio metro del poste y mira qué le pasa a φ.',
            logrado: v => v.d === 0.5 && betaL(v) < betaL(Object.assign({}, v, { d: 1 })),
            bien: 'Muy cerca, las dos visuales casi verticales se juntan: φ se achica.' },
        ],
        // El pie del poste cambia d; el borde bajo sube el letrero entero; el borde alto lo estira.
        arrastres: [
          { id: 'pie', etiqueta: 'pie del poste: cambia d', color: 'c-i',
            donde: v => enPx(letL(v), v.d, 0),
            mover: (pt, v) => ({ d: delPx(letL(v), pt).x }) },
          { id: 'bajo', etiqueta: 'borde bajo del letrero', color: 'c-o',
            donde: v => enPx(letL(v), v.d, v.a),
            mover: (pt, v) => ({ a: delPx(letL(v), pt).y }) },
          { id: 'alto', etiqueta: 'borde alto del letrero: cambia su largo', color: 'c-o',
            donde: v => enPx(letL(v), v.d, v.a + v.L),
            mover: (pt, v) => ({ L: delPx(letL(v), pt).y - v.a }) },
        ],
      },
  ];

  // Mesa nueva, con la pieza de la unidad: la cometa libre (idea 1). La idea 2 aporta su juego (tope de 5 mesas).
  const LAB_NUEVAS = [
    { id: 'cometa-libre', titulo: 'La cometa, libre', pieza: VI,
      consigna: 'Suelta o recoge pita y cambia su ángulo con el suelo. Mira la altura y el suelo hasta debajo de la cometa.',
      controles: [
        { id: 'g', etiqueta: 'θ, ángulo de la pita', color: 'c-h', min: 15, max: 75, paso: 5, inicio: 40, unidad: '°', decimales: 0 },
        { id: 'H', etiqueta: 'H, la pita', min: 10, max: 60, paso: 5, inicio: 40, unidad: 'm', decimales: 0 },
      ],
      dibujo: v => ({ datos: cometa(v.H, v.g, { H: `H = ${v.H} m`, t: `${v.g}°`, h: `${f(v.H * Math.sin(v.g * RAD), 1)} m`, d: `${f(v.H * Math.cos(v.g * RAD), 1)} m` }, { escala: true, marco: [[0, 0], [60, 58]] }), estado: {} }),
      lectura: v => jN([hh, ` = H · sen θ ≈ ${f(v.H * Math.sin(v.g * RAD), 1)} m;   `, dd, ` = H · cos θ ≈ ${f(v.H * Math.cos(v.g * RAD), 1)} m`]),
      invitaciones: [
        { texto: 'Haz que la cometa vuele a la mitad de su pita.', logrado: v => v.g === 30, bien: 'sen 30° = 1/2: la altura es media pita, con cualquier pita.' },
        { texto: 'Haz que la altura y el suelo midan lo mismo.', logrado: v => v.g === 45, bien: 'A 45°, seno y coseno valen lo mismo: los dos catetos son iguales.' },
        { texto: 'Con 50 m de pita, deja el suelo en 25 m.', logrado: v => v.H === 50 && v.g === 60, bien: 'cos 60° = 1/2: el suelo es media pita, y la cometa sube 25√3 m.' },
        { texto: 'Guarda dos casos con el mismo ángulo y la pita al doble.', logrado: (v, gs) => gs.some(p => gs.some(q => p.g === q.g && q.H === 2 * p.H)),
          testigo: [{ g: 40, H: 20 }, { g: 40, H: 40 }], bien: 'Pita al doble, altura y suelo al doble: el ángulo fija la forma.' },
      ] },
  ];

  return {
    unidad: 'trigonometria.triangulos-rectangulos',
    version: '0.2.1',
    calidad: 2,
    estado: 'completa',
    requiere: ['/nucleo/kit/piezas/trig-vista.js', '/nucleo/kit/piezas/triangulo.js', '/plantillas/trig-angulos-verticales/motor.js', '/nucleo/kit/piezas/trig-campo-3d.js'],
    historia: {
      texto: 'Hacia 1021, al-Biruni escribió un tratado sobre las sombras: relacionaba la altura del Sol, los instrumentos y el cálculo con razones. Para medir algo inalcanzable hacía falta lo mismo que hoy: fijar la horizontal, leer bien el ángulo y conocer una distancia que sí se puede medir.',
      pregunta: '¿Cómo medirías la altura de un edificio sin subir a él?',
      fuente: { titulo: 'J. J. O’Connor y E. F. Robertson, «Abu Rayhan al-Biruni», MacTutor, University of St Andrews', url: 'https://mathshistory.st-andrews.ac.uk/Biographies/Al-Biruni/' },
    },
    // Tabla de letras de la unidad (regla letras-datos del validador; propuesta §5).
    letras: { 'θ': 'un ángulo agudo dado o pedido', 'α': 'el menor de los dos ángulos de un problema', 'β': 'el mayor de los dos ángulos de un problema',
      'φ': 'el ángulo de observación', H: 'la hipotenusa', h: 'una altura sobre el suelo',
      d: 'una distancia por el suelo', a: 'un largo dado con letra', k: 'lo que mide una parte', v: 'la rapidez de un móvil', t: 'el tiempo', x: 'el largo pedido' },
    // A qué idea pertenece cada mesa del laboratorio (Gerson, 16 nov): ninguna en «Más mesas del tema».
    laboratorioIdeas: { 'cometa-libre': ['un-lado-un-angulo'], instrumento: ['elevacion-depresion'], faro: ['elevacion-depresion'],
      'torre-campo': ['dos-angulos'], 'letrero-cerca': ['angulo-observacion'] },
    ideas: [unLado, catetoIdea, elevacion, dosAngulos, observacion],
    glosario: GLOSARIO,
    laboratorio: LAB_NUEVAS.concat(LABORATORIO),
  };
});
