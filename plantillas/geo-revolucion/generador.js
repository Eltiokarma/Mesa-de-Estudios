/*
 * Generador: sólidos de revolución (troncos de cono, regiones que giran, esferas y cilindros cortados).
 * Formato "predicciones" (docs/arquitectura.md). Funciona en el navegador
 * (window.Generadores['geo-revolucion']) y en Node (require).
 *
 * Convención de academia: sen 37° = 3/5, cos 37° = 4/5 (triángulo 3-4-5); sen 30° = 1/2.
 * Unidades: «u» es la unidad de longitud del problema (cm o m); áreas en u², volúmenes en u³.
 * Las respuestas son múltiplos de π (V = kπ), racionales (p/q), a√b o k/π, según el tipo.
 *
 * Tipos y campos de _datos (todo lo que hace falta para recalcular la respuesta):
 *   tronco-volumen   volumen de un tronco de cono.
 *     sub 'radios':     r (radio menor), R (radio mayor), h (altura); diametros = true si el enunciado da
 *                       los diámetros 2r y 2R en vez de los radios. Respuesta: V = πh(R² + Rr + r²)/3.
 *     sub 'generatriz': r, R, g (generatriz); la altura sale de h² = g² − (R − r)². Respuesta: V.
 *     sub 'silo':       cilindro de radio R y altura H, y debajo un tronco de cono de radio R arriba, r abajo
 *                       y generatriz g. Respuesta: volumen total (cilindro + tronco).
 *   tronco-area      área de lámina (solo superficie lateral, sin tapas).
 *     sub 'pantalla':   tronco de radios r, R y altura h (la generatriz sale por Pitágoras). Respuesta: πg(R + r).
 *     sub 'embudo':     tronco de radios r (abajo) y R (arriba), altura h, más un tubo cilíndrico de radio r y
 *                       largo H pegado abajo. Respuesta: πg(R + r) + 2πrH.
 *   tronco-llenado   recipiente lleno solo hasta una parte de su altura, medida desde el fondo.
 *     sub 'tronco':     r (radio del fondo), R (radio de la boca), H (altura), p/q (fracción de la altura que
 *                       ocupa la tierra o el agua). Respuesta: volumen ocupado (tronco de altura Hp/q).
 *     sub 'cono':       cono con la punta abajo: R (radio de la boca), H (altura), p/q. Respuesta: volumen ocupado.
 *     sub 'altura':     r, R y V3pi: la capacidad es V = V3pi·π/3. Respuesta: la altura H.
 *     sub 'suma':       S = R + r (suma de radios), D = R − r y V3pi (capacidad V = V3pi·π/3). Respuesta: H.
 *     sub 'inclinado':  vaso CILÍNDRICO de radio r y altura H con agua hasta h0; se inclina hasta que el agua
 *                       toca el borde de la boca por un lado, sin derramarse. Respuesta: altura del agua sobre la
 *                       pared del lado opuesto (el agua queda como un tronco de cilindro de generatrices H y g).
 *                       (El vaso troncocónico inclinado no tiene una respuesta limpia: no se genera.)
 *   desplazamiento   un objeto se hunde por completo en agua (no se derrama nada).
 *     sub 'cubo':       vaso cilíndrico de diámetro d; cubo de arista a. Respuesta: cuánto sube el nivel.
 *     sub 'esfera':     vaso cilíndrico de diámetro d; esfera de radio rho. Respuesta: cuánto sube el nivel.
 *     sub 'pieza':      vaso cilíndrico de diámetro d; el nivel sube s. Respuesta: volumen de la pieza.
 *     sub 'piramide':   vaso troncocónico de radios r (fondo) y R (boca) y altura H, lleno hasta el borde; se mete
 *                       una pirámide regular hexagonal de lado de base s y altura hp, totalmente sumergida.
 *                       Respuesta: agua que queda, aπ − b√3 (valor = clave «mix:a|b», con a y b como n/m).
 *     sub 'balde':      balde troncocónico de radio r en el fondo, R en la boca y altura H; el agua sube de la
 *                       altura h1 a la altura h2 (medidas desde el fondo). Respuesta: volumen de la pieza.
 *   region-gira      una región plana gira 360° alrededor de un eje.
 *     sub 'triangulo':  región entre la recta y = (b/a)x, el eje X y la recta x = a; gira alrededor del eje
 *                       indicado en eje ('x' o 'y'). Respuesta: volumen del sólido.
 *     sub 'trapecio':   trapecio rectángulo ABCD con ángulos rectos en A y B, AD ∥ BC, AD = B (base mayor),
 *                       BC = b (base menor), AB = h (altura). Si h es null, el enunciado da CD (el lado oblicuo)
 *                       y h sale por Pitágoras. Gira alrededor del lado eje ('AB', 'AD' o 'BC').
 *     sub 'rectangulo': rectángulo de lados L (paralelo al eje) y w (perpendicular al eje); su lado más
 *                       cercano al eje está a distancia d. Respuesta: volumen del sólido (un tubo).
 *   esfera-segmento  partes de una esfera de radio R.
 *     sub 'casquete':   plano a distancia d del centro. Respuesta: área del casquete menor.
 *     sub 'cupula':     casquete de radio de base a y altura hh (R no se da). Respuesta: área del casquete.
 *     sub 'una-base':   segmento esférico de una base de altura hh. Respuesta: su volumen.
 *     sub 'equilatero': un triángulo equilátero inscrito en un círculo máximo; un plano perpendicular al de ese
 *                       círculo pasa por un lado del triángulo y se retira la parte pide ('menor' o 'mayor').
 *                       Respuesta: su volumen.
 *     sub 'cubo':       esfera tangente a las 12 aristas de un cubo de arista a (mismo centro); cada cara corta un
 *                       casquete. pide = 'uno' (un casquete) o 'seis' (los seis). Respuesta de la forma k(2 − √2)π.
 *     sub 'dos-bases':  dos planos paralelos cortan la esfera en círculos de radios a1 y a2 (ninguno pasa por el
 *                       centro); mismoLado dice si están del mismo lado del centro. Respuesta: volumen del segmento entre los planos.
 *   esfera-cono      esfera inscrita en un cono recto (tangente a la superficie lateral y a la base).
 *     sub 'razon':      si equilatero = false: cono de radio R y altura H; si equilatero = true: cono equilátero
 *                       (generatriz = diámetro de la base, sin medidas). pide = 'lateral' (área de la esfera
 *                       / área lateral del cono), 'total' (área de la esfera / área total del cono) o
 *                       'volumen' (volumen de la esfera / volumen del cono).
 *     sub 'liquido':    cono de radio R y altura H, punta abajo, con la esfera adentro; se llena de agua el
 *                       espacio libre hasta la base. Respuesta: volumen de agua (cono − esfera).
 *     sub 'radio':      cono de radio R y altura H. Respuesta: radio de la esfera.
 *   esferas-tangentes
 *     sub 'tres':       tres esferas iguales, tangentes dos a dos; dato = 'perimetro', 'area' o 'lado' del triángulo
 *                       de los centros, con valor: perímetro = valor; área = valor·√3; si dato = 'lado', lo que se
 *                       da es la ALTURA del triángulo, valor·√3. Respuesta: área de una esfera.
 *     sub 'dos-piso':   dos esferas de radios R y r, apoyadas en un piso y tangentes entre sí. Respuesta:
 *                       distancia entre los dos puntos donde tocan el piso.
 *   tronco-cilindro  cilindro recto de radio r cortado por un plano oblicuo a su eje (no corta la base).
 *     sub 'generatrices': generatriz menor g1 y mayor g2. Respuesta: V = πr²(g1 + g2)/2.
 *     sub 'lateral':    área lateral AL = ALpi·π. Respuesta: el volumen.
 *   cilindro-oblicuo cilindro recto de radio r cortado por dos planos paralelos inclinados: queda un cilindro
 *                    oblicuo de sección recta πr² y generatriz g.
 *     sub 'altura':     cada base elíptica tiene área (n/m)·π, con Sbpi = [n, m]. Respuesta: altura (distancia entre las bases).
 *     sub 'volumen':    las generatrices forman theta (37, 53 o 30 grados) con el plano de la base. Respuesta: V.
 *
 * Errores: los códigos GE.. son los de docs/investigacion/geometria-ideas-erroneas.md; GE2 tiene respaldo
 * parcial; GE19, GE20, GE21 y GE22 están en la lista «sin respaldo» del informe (hipótesis). Los códigos
 * GE-<nombre> son hipótesis nuestras.
 */
(function (root, fabrica) {
  const nodo = typeof module === 'object' && module.exports;
  const api = fabrica(nodo ? require('../../nucleo/azar.js') : root.Azar,
                      nodo ? require('../../nucleo/predicciones.js') : root.Predicciones);
  if (nodo) module.exports = api;
  else (root.Generadores = root.Generadores || {})[api.id] = api;
})(typeof self !== 'undefined' ? self : this, function (Azar, P) {
  'use strict';
  const INF = 'docs/investigacion/geometria-ideas-erroneas.md';
  const PI = Math.PI;
  const h_ = (id, valor, explicacion) => ({ id, valor, explicacion, respaldo: 'hipotesis', fuente: null });
  const par = (id, valor, explicacion) => ({ id, valor, explicacion, respaldo: 'parcial', fuente: INF });
  const v = P.v;
  const f = x => P.formatear(x, 2);

  // ---------- Cálculo puro (lo usan el generador y papel.json) ----------
  const calc = {
    cono: (r, h) => PI * r * r * h / 3,
    cilindro: (r, h) => PI * r * r * h,
    esfera: r => 4 * PI * r ** 3 / 3,
    areaEsfera: r => 4 * PI * r * r,
    troncoCono: (R, r, h) => PI * h * (R * R + R * r + r * r) / 3,
    generatriz: (R, r, h) => Math.hypot(h, R - r),
    lateralTronco: (R, r, g) => PI * g * (R + r),
    radioANivel: (r, R, H, z) => r + (R - r) * z / H,
    casquete: (R, hh) => 2 * PI * R * hh,
    segmentoUnaBase: (R, hh) => PI * hh * hh * (3 * R - hh) / 3,
    segmentoDosBases: (hh, a1, a2) => PI * hh * (hh * hh + 3 * a1 * a1 + 3 * a2 * a2) / 6,
    radioInscritoCono: (R, H) => R * H / (R + Math.hypot(R, H)),
    subidaNivel: (Vpieza, rCil) => Vpieza / (PI * rCil * rCil),
    troncoCilindro: (r, g1, g2) => PI * r * r * (g1 + g2) / 2,
    distanciaContactos: (R, r) => 2 * Math.sqrt(R * r),
    alturaOblicuo: (r, g, Sbpi) => r * r * g / Sbpi, // base elíptica de área Sbpi·π
  };

  // ---------- Cómo se escribe cada respuesta ----------
  const esEntero = x => Math.abs(x - Math.round(x)) < 1e-9 * Math.max(1, Math.abs(x));
  function racional(x, qmax = 12) {
    if (!Number.isFinite(x)) return null;
    for (let q = 1; q <= qmax; q++) if (esEntero(x * q)) return [Math.round(x * q), q];
    return null;
  }
  const conU = (t, u) => (u ? `${t} ${u}` : t);
  const fraccion = (x, qmax) => { const r = racional(x, qmax); return r && r[0] > 0 ? (r[1] === 1 ? P.formatear(r[0]) : `${P.formatear(r[0])}/${r[1]}`) : null; };
  const FORMAS = {
    pi: u => x => P.pi(x, u),
    q: u => x => { const r = racional(x); if (!r || r[0] <= 0) return null; return conU(r[1] === 1 ? P.formatear(r[0]) : `${P.formatear(r[0])}/${r[1]}`, u); },
    razon: () => x => fraccion(x, 300),
    rad: u => x => (x > 0 && esEntero(x * x) ? conU(P.radical(x), u) : null),
    invpi: u => x => { const r = racional(x * PI); if (!r || r[0] <= 0) return null; return conU(r[1] === 1 ? `${P.formatear(r[0])}/π` : `${P.formatear(r[0])}/(${r[1]}π)`, u); },
  };
  // k(2 − √2)π: casquetes de la esfera tangente a las aristas del cubo.
  const DOS = 2 - Math.SQRT2;
  FORMAS.casq = u => x => {
    const r = racional(x / (DOS * PI)); if (!r || r[0] <= 0) return null;
    const k = r[0] === 1 ? '' : P.formatear(r[0]);
    return conU(r[1] === 1 ? `${k}(2 − √2)π` : `${k}(2 − √2)π/${r[1]}`, u);
  };
  // aπ − b√3 con a y b racionales: el valor es { A, B } (coeficientes) y la clave los fija exactos.
  const coef = x => { const r = racional(x); return r && r[0] > 0 ? (r[1] === 1 ? (r[0] === 1 ? '' : P.formatear(r[0])) : `(${P.formatear(r[0])}/${r[1]})`) : null; };
  const mixta = u => m => {
    if (!m || !(m.A * PI - m.B * Math.sqrt(3) > 0)) return null;
    const a = coef(m.A), b = coef(m.B), ra = racional(m.A), rb = racional(m.B);
    if (a === null || b === null) return null;
    return { clave: `mix:${ra[0]}/${ra[1]}|${rb[0]}/${rb[1]}`, texto: conU(`${a}π − ${b}√3`, u) };
  };
  const tpi = (x, u) => P.pi(x, u) || f(x);
  const tq = (x, u = '') => FORMAS.q(u)(x) || f(x);

  const SEN = { 37: [3, 5], 53: [4, 5], 30: [1, 2] };
  const COS = { 37: [4, 5], 53: [3, 5] };
  const sen = t => SEN[t][0] / SEN[t][1];
  // Ternas para Pitágoras: [cateto, cateto, hipotenusa].
  const TERNAS = [[3, 4, 5], [4, 3, 5], [6, 8, 10], [8, 6, 10], [5, 12, 13], [12, 5, 13], [9, 12, 15], [12, 9, 15]];

  // Se sortean el tipo y la variante una sola vez; si los números no sirven, se reintenta la MISMA
  // variante. Se pide además que la correcta no sea la única fracción entre enteros (ni al revés): al
  // menos `minimo` distractores de la misma clase; se afloja solo si la variante no lo logra.
  function generar(semilla) {
    const rng = Azar.crear('geo-revolucion|' + semilla);
    const tipo = rng.elegir(TIPOS), sub = rng.elegir(SUBS[tipo]);
    for (let intento = 0; intento < 400; intento++) {
      const minimo = intento < 120 ? 2 : intento < 300 ? 1 : 0;
      const pr = construir(rng, semilla, tipo, sub, minimo);
      if (pr) return pr;
    }
    throw new Error('No se pudo generar un problema con 4 alternativas distintas');
  }

  const TIPOS = ['tronco-volumen', 'tronco-area', 'tronco-llenado', 'desplazamiento', 'region-gira',
    'esfera-segmento', 'esfera-cono', 'esferas-tangentes', 'tronco-cilindro', 'cilindro-oblicuo'];

  // Variantes de cada tipo (las repetidas pesan más).
  const SUBS = {
    'tronco-volumen': ['radios', 'generatriz', 'silo'],
    'tronco-area': ['pantalla', 'embudo'],
    'tronco-llenado': ['tronco', 'tronco', 'cono', 'altura', 'suma', 'inclinado'],
    'desplazamiento': ['cubo', 'esfera', 'pieza', 'balde', 'piramide'],
    'region-gira': ['triangulo', 'trapecio', 'trapecio', 'rectangulo'],
    'esfera-segmento': ['casquete', 'cupula', 'una-base', 'equilatero', 'dos-bases', 'cubo'],
    'esfera-cono': ['razon', 'liquido', 'liquido', 'radio'],
    'esferas-tangentes': ['tres', 'dos-piso'],
    'tronco-cilindro': ['generatrices', 'lateral'],
    'cilindro-oblicuo': ['altura', 'volumen'],
  };

  // Clase de un valor según cómo se escribe: entero (o coeficiente entero) contra fracción.
  function clase(forma, x) {
    if (forma === 'mixta') return /\/1\|.*\/1$/.test(x);
    const k = { pi: x / PI, q: x, razon: x, rad: x, invpi: x * PI, casq: x / (DOS * PI) }[forma];
    return esEntero(k);
  }

  function construir(rng, semilla, tipo, sub, minimo) {
    const pr = HACER[tipo](rng, sub);
    if (!pr) return null;
    let alternativas, valor = pr.correcta;
    if (pr.forma === 'mixta') {
      // Respuesta aπ − b√3: se compara por clave (a y b exactos), con P.armarTexto.
      const m = mixta(pr.unidad), c = m(pr.correcta);
      if (!c) return null;
      const errores = pr.errores.map(e => { const t = m(e.valor); return t && { id: e.id, clave: t.clave, texto: t.texto, explicacion: e.explicacion, respaldo: e.respaldo, fuente: e.fuente }; }).filter(Boolean);
      alternativas = P.armarTexto({ correcta: c, errores, rng });
      valor = c.clave;
    } else {
      const texto = FORMAS[pr.forma](pr.unidad);
      if (texto(pr.correcta) === null) return null;
      const errores = pr.errores.filter(e => Number.isFinite(e.valor) && e.valor > 0 && texto(e.valor) !== null);
      alternativas = P.armar({ correcta: pr.correcta, errores, rng, texto });
    }
    if (alternativas.length < 4) return null;
    const cc = clase(pr.forma, valor);
    if (alternativas.filter(a => !a.correcta && clase(pr.forma, a.valor) === cc).length < minimo) return null;
    return {
      id: `geo-revolucion#${semilla}`, variables: pr.variables, enunciado: pr.enunciado, pregunta: pr.pregunta,
      datos: '', alternativas, solucion: pr.solucion,
      respuesta: { valor, unidad: pr.unidad }, _datos: Object.assign({ tipo }, pr.datos),
    };
  }

  const unidad = rng => rng.elegir(['cm', 'cm', 'm']);

  // ---------- Tronco de cono: volumen ----------
  function troncoVolumen(rng, sub) {
    const u = unidad(rng), u3 = u + '³';
    const variables = { r: { nombre: 'radio menor', color: 'o' }, R: { nombre: 'radio mayor', color: 'i' }, h: { nombre: 'altura del tronco', color: 'h' }, V: { nombre: 'volumen', color: 'd' } };
    if (sub === 'radios') {
      const r = rng.entero(2, 6), R = r + rng.entero(1, 5), h = rng.entero(2, 12);
      if ((h * (R * R + R * r + r * r)) % 3 !== 0) return null;
      const diam = rng.moneda();
      const V = calc.troncoCono(R, r, h);
      const S = R * R + R * r + r * r;
      const cosa = rng.elegir(u === 'm' ? ['Una tolva de granos', 'Un tanque de agua'] : ['Un balde', 'Una maceta', 'Un vaso']);
      const enunciado = diam
        ? [`${cosa} tiene forma de tronco de cono. El fondo es un círculo de `, v('r', `${2 * r} ${u} de diámetro`), ', la boca un círculo de ', v('R', `${2 * R} ${u} de diámetro`), ' y su altura es ', v('h', `${h} ${u}`), '.']
        : [`${cosa} tiene forma de tronco de cono. El radio del fondo mide `, v('r', `${r} ${u}`), ', el radio de la boca ', v('R', `${R} ${u}`), ' y su altura es ', v('h', `${h} ${u}`), '.'];
      const errores = [
        h_('GE-tronco-promedio-radios', PI * ((R + r) / 2) ** 2 * h, 'Usaste un cilindro con el radio promedio (R + r)/2. El tronco no es un cilindro: su volumen es πh(R² + Rr + r²)/3, que no coincide con el del radio promedio.'),
        h_('GE20', 3 * V, 'Olvidaste el factor 1/3. El tronco es un cono grande menos uno chico, y cada cono lleva 1/3: V = πh(R² + Rr + r²)/3.'),
        h_('GE-tronco-sin-producto', PI * h * (R * R + r * r) / 3, 'Te faltó el término Rr. La fórmula tiene tres términos: R² + Rr + r².'),
        h_('GE-tronco-semisuma-bases', PI * h * (R * R + r * r) / 2, 'Promediaste las áreas de las dos bases y multiplicaste por la altura. Eso no da el volumen del tronco: falta el término Rr y el 1/3.'),
      ];
      if (diam) errores.unshift(h_('GE19', 4 * V, `Usaste los diámetros (${2 * r} y ${2 * R}) como si fueran radios. Primero hay que dividirlos entre 2.`));
      const solucion = [
        diam ? ['Radios: ', v('r', `r = ${r} ${u}`), ' y ', v('R', `R = ${R} ${u}`), ' (la mitad de cada diámetro).'] : ['Fórmula del tronco de cono: V = πh(R² + Rr + r²)/3.'],
        ['R² + Rr + r² = ', v('R', `${R}`), '² + ', v('R', `${R}`), '·', v('r', `${r}`), ' + ', v('r', `${r}`), `² = ${R * R} + ${R * r} + ${r * r} = ${S}.`],
        ['V = π·', v('h', `${h}`), `·${S}/3 = `, v('V', tpi(V, u3)), '.'],
      ];
      return { forma: 'pi', unidad: u3, correcta: V, errores, variables, solucion, enunciado, pregunta: ['¿Cuál es su capacidad?'], datos: { sub, r, R, h, diametros: diam } };
    }
    const [c1, c2, c3] = rng.elegir(TERNAS.slice(0, 6)), k = rng.elegir([1, 1, 2]);
    const dR = c1 * k, h = c2 * k, g = c3 * k;
    if (sub === 'generatriz') {
      const r = rng.entero(2, 6), R = r + dR;
      const V = calc.troncoCono(R, r, h), S = R * R + R * r + r * r;
      if (P.pi(V) === null) return null;
      const enunciado = ['Un tronco de cono tiene bases de radios ', v('r', `${r} ${u}`), ' y ', v('R', `${R} ${u}`), '. Su generatriz (el segmento inclinado que une los bordes de las dos bases) mide ', v('g', `${g} ${u}`), '.'];
      delete variables.h; variables.g = { nombre: 'generatriz', color: 'h' };
      const errores = [
        h_('GE21', calc.troncoCono(R, r, g), `Usaste la generatriz (${g}) como si fuera la altura. La altura es vertical; la generatriz es inclinada y más larga.`),
        h_('GE20', 3 * V, 'Olvidaste el factor 1/3 de la fórmula del tronco.'),
        h_('GE-tronco-promedio-radios', PI * ((R + r) / 2) ** 2 * h, 'Usaste un cilindro con el radio promedio: el tronco no es un cilindro.'),
        h_('GE-tronco-sin-producto', PI * h * (R * R + r * r) / 3, 'Te faltó el término Rr en R² + Rr + r².'),
      ];
      const solucion = [
        ['Corta el tronco por su eje: queda un trapecio. La generatriz es la hipotenusa de un triángulo rectángulo de catetos R − r y h.'],
        ['R − r = ', v('R', `${R}`), ' − ', v('r', `${r}`), ` = ${dR}; h² = `, v('g', `${g}`), `² − ${dR}² → h = ${h} ${u}.`],
        [`R² + Rr + r² = ${R * R} + ${R * r} + ${r * r} = ${S}.`],
        [`V = π·${h}·${S}/3 = `, v('V', tpi(V, u3)), '.'],
      ];
      return { forma: 'pi', unidad: u3, correcta: V, errores, variables, solucion, enunciado, pregunta: ['¿Cuál es el volumen del tronco?'], datos: { sub, r, R, g } };
    }
    // silo (en metros)
    if (u !== 'm') return null;
    const r = rng.entero(1, 3), R = r + dR, H = rng.entero(2, 8);
    const Vc = calc.cilindro(R, H), Vt = calc.troncoCono(R, r, h), V = Vc + Vt;
    if (P.pi(V) === null) return null;
    variables.H = { nombre: 'altura del cilindro', color: 'o' };
    delete variables.r;
    delete variables.h; variables.g = { nombre: 'generatriz del tronco', color: 'h' };
    const enunciado = ['Un silo está formado por un cilindro de radio ', v('R', `${R} ${u}`), ' y altura ', v('H', `${H} ${u}`), `, apoyado sobre un tronco de cono que tiene arriba el mismo radio que el cilindro y abajo una boca de salida de radio ${r} ${u}. La generatriz del tronco mide `, v('g', `${g} ${u}`), '.'];
    const errores = [
      h_('GE-tronco-como-cono', Vc + calc.cono(R, h), `Tomaste la parte de abajo como un cono completo de radio ${R}. Tiene una boca de radio ${r}: es un tronco.`),
      h_('GE21', Vc + calc.troncoCono(R, r, g), `Usaste la generatriz (${g}) como altura del tronco. La altura sale por Pitágoras con R − r = ${dR}: h = ${h}.`),
      h_('GE20', Vc + 3 * Vt, 'Olvidaste el factor 1/3 en el volumen del tronco.'),
      h_('GE-tronco-promedio-radios', Vc + PI * ((R + r) / 2) ** 2 * h, 'Tomaste el tronco como un cilindro con el radio promedio: el tronco no es un cilindro.'),
      h_('GE-silo-solo-cilindro', Vc, 'Calculaste solo el cilindro: falta sumar el tronco de abajo.'),
    ];
    const solucion = [
      ['Cilindro: π·', v('R', `${R}`), '²·', v('H', `${H}`), ` = ${tpi(Vc)}.`],
      ['Tronco: R − r = ', `${dR}`, ' y la generatriz ', v('g', `${g}`), ` es hipotenusa → altura h = ${h} ${u}.`],
      [`Volumen del tronco: π·${h}·(${R * R} + ${R * r} + ${r * r})/3 = ${tpi(Vt)}.`],
      ['Total: ', v('V', tpi(V, u3)), '.'],
    ];
    return { forma: 'pi', unidad: u3, correcta: V, errores, variables, solucion, enunciado, pregunta: ['¿Cuál es el volumen total del silo?'], datos: { sub, R, H, r, g } };
  }

  // ---------- Tronco de cono: área lateral ----------
  function troncoArea(rng, sub) {
    const u = 'cm', u2 = 'cm²';
    const [c1, c2, c3] = rng.elegir(TERNAS.slice(0, 6)), k = rng.elegir([1, 2]);
    const dR = c1 * k, h = c2 * k, g = c3 * k;
    const r = rng.entero(2, 6), R = r + dR;
    const AL = calc.lateralTronco(R, r, g);
    const variables = { r: { nombre: 'radio menor', color: 'o' }, R: { nombre: 'radio mayor', color: 'i' }, h: { nombre: 'altura del tronco', color: 'h' }, A: { nombre: 'área de la lámina', color: 'd' } };
    if (sub === 'pantalla') {
      const enunciado = ['La pantalla de una lámpara es la superficie lateral de un tronco de cono, sin tapas. Su borde de arriba es un círculo de radio ', v('r', `${r} ${u}`), ', el de abajo un círculo de radio ', v('R', `${R} ${u}`), ' y la distancia vertical entre ellos es ', v('h', `${h} ${u}`), '.'];
      const errores = [
        h_('GE21', calc.lateralTronco(R, r, h), `Usaste la altura (${h}) en lugar de la generatriz. La lámina se mide a lo largo del borde inclinado, que es g = ${g}.`),
        h_('GE-area-bases-que-no-tiene', AL + PI * (R * R + r * r), 'Sumaste las áreas de los dos círculos. La pantalla no tiene tapas: solo cuenta la superficie lateral.'),
        h_('GE-tronco-area-sin-mitad', 2 * AL, 'Multiplicaste la suma de las dos circunferencias por g sin dividir entre 2. El desarrollo es como un trapecio: (2πR + 2πr)/2 · g.'),
        h_('GE-tronco-area-diferencia', calc.lateralTronco(R, r, g) * (R - r) / (R + r), 'Usaste R − r en vez de R + r. El área lateral es πg(R + r).'),
      ];
      const solucion = [
        ['Generatriz: g² = ', v('h', `${h}`), `² + (R − r)² = ${h * h} + ${dR * dR} → g = ${g} ${u}.`],
        ['Área lateral del tronco: πg(R + r) = π·', `${g}`, '·(', v('R', `${R}`), ' + ', v('r', `${r}`), ') = ', v('A', tpi(AL, u2)), '.'],
      ];
      return { forma: 'pi', unidad: u2, correcta: AL, errores, variables, solucion, enunciado, pregunta: ['¿Cuánta tela se necesita para la pantalla?'], datos: { sub, r, R, h } };
    }
    const H = rng.entero(2, 8);
    const At = 2 * PI * r * H, A = AL + At;
    variables.H = { nombre: 'largo del tubo', color: 'h' };
    delete variables.h; delete variables.A;
    const enunciado = ['Un embudo de lata está formado por un tronco de cono, abierto arriba y abajo, de radios ', v('R', `${R} ${u}`), ' (boca) y ', v('r', `${r} ${u}`), ` (salida) y altura ${h} ${u}, y un tubo cilíndrico de radio `, v('r', `${r} ${u}`), ' y largo ', v('H', `${H} ${u}`), ' soldado en la salida.'];
    const errores = [
      h_('GE-area-bases-que-no-tiene', A + PI * (R * R + r * r), 'Sumaste los círculos de la boca y de la salida. El embudo está abierto: esas tapas no existen.'),
      h_('GE-area-bases-que-no-tiene', A + PI * R * R, 'Sumaste el círculo de la boca, que el embudo no tiene (está abierto).'),
      h_('GE21', calc.lateralTronco(R, r, h) + At, `Usaste la altura del tronco (${h}) en vez de su generatriz (${g}).`),
      h_('GE-embudo-sin-tubo', AL, 'Calculaste solo el tronco: falta la lámina del tubo, 2πrH.'),
      h_('GE-volumen-por-area', AL + PI * r * r * H, 'Para el tubo usaste πr²H, que es su volumen. La lámina del tubo es un rectángulo de 2πr por H.'),
    ];
    const solucion = [
      ['Generatriz del tronco: g² = ', `${h}² + (`, v('R', `${R}`), ' − ', v('r', `${r}`), `)² = ${h * h + dR * dR} → g = ${g} ${u}.`],
      [`Tronco (solo lateral): π·${g}·(${R} + ${r}) = ${tpi(AL)}.`],
      ['Tubo (solo lateral): 2π·', v('r', `${r}`), '·', v('H', `${H}`), ` = ${tpi(At)}.`],
      [`Total: ${tpi(A, u2)} (no hay tapas).`],
    ];
    return { forma: 'pi', unidad: u2, correcta: A, errores, variables, solucion, enunciado, pregunta: ['¿Cuánta lata se usó en total?'], datos: { sub, r, R, h, H } };
  }

  // ---------- Recipiente lleno hasta una fracción de la altura ----------
  const FRACS = [[1, 2], [1, 3], [2, 3], [1, 4], [3, 4], [2, 5], [3, 5]];
  const fracTxt = (p, q) => `${p}/${q}`;
  function troncoLlenado(rng, sub) {
    const u = 'cm', u3 = 'cm³';
    const variables = { r: { nombre: 'radio del fondo', color: 'o' }, R: { nombre: 'radio de la boca', color: 'i' }, H: { nombre: 'altura', color: 'h' }, V: { nombre: 'volumen ocupado', color: 'd' } };
    if (sub === 'tronco') {
      const [p, q] = rng.elegir(FRACS);
      const r = rng.entero(2, 6), R = r + q * rng.entero(1, 2), H = q * rng.entero(1, 4) * (q <= 3 ? 3 : 1);
      const z = H * p / q, m = calc.radioANivel(r, R, H, z);
      const V = calc.troncoCono(m, r, z), Vt = calc.troncoCono(R, r, H);
      if (P.pi(V) === null) return null;
      const mArr = R - (R - r) * p / q;
      const tierra = rng.moneda(), sus = tierra ? 'tierra' : 'agua';
      const errores = [
        par('GE2', Vt * p / q, `Tomaste ${fracTxt(p, q)} del volumen total. El volumen no crece en proporción a la altura: arriba el recipiente es más ancho, y cada centímetro de altura guarda más ${sus}.`),
        h_('GE22', calc.troncoCono((R + r) / 2, r, z), `Usaste el radio promedio (R + r)/2 en el nivel de la ${sus}. El radio en ese nivel sale por semejanza: crece ${R - r} cm en toda la altura, así que a ${fracTxt(p, q)} de la altura crece ${fracTxt(p, q)} de ${R - r}.`),
        h_('GE-llenado-desde-arriba', calc.troncoCono(mArr, r, z), `Bajaste el radio desde la boca, R − (R − r)·${fracTxt(p, q)}, como si la fracción se midiera desde arriba. La ${sus} empieza en el fondo: el radio en su superficie es r + (R − r)·${fracTxt(p, q)}.`),
        h_('GE-llenado-radio-boca', calc.troncoCono(R, r, z), `Usaste el radio de la boca (${R}) en la superficie de la ${sus}. La ${sus} no llega a la boca: en su nivel el radio es menor.`),
        h_('GE-llenado-cilindro-fondo', calc.cilindro(r, z), `Tomaste la ${sus} como un cilindro con el radio del fondo: el recipiente se ensancha hacia arriba.`),
        h_('GE20', 3 * V, 'Olvidaste el factor 1/3 en el volumen del tronco.'),
      ];
      const enunciado = [tierra ? 'Una maceta' : 'Un balde', ' tiene forma de tronco de cono: el fondo es un círculo de radio ', v('r', `${r} ${u}`), ', la boca un círculo de radio ', v('R', `${R} ${u}`), ' y su altura es ', v('H', `${H} ${u}`), `. Se llena de ${tierra ? 'tierra' : 'agua'} hasta una altura igual a ${fracTxt(p, q)} de la altura total, medida desde el fondo.`];
      const solucion = [
        [`Altura ocupada: ${fracTxt(p, q)} de `, v('H', `${H}`), ` = ${f(z)} ${u}.`],
        ['Radio en ese nivel (semejanza): el radio crece de ', v('r', `${r}`), ' a ', v('R', `${R}`), ` en toda la altura; a ${fracTxt(p, q)} de ella vale ${r} + ${fracTxt(p, q)}·${R - r} = ${f(m)} ${u}.`],
        [`Es un tronco de radios ${r} y ${f(m)} y altura ${f(z)}: V = π·${f(z)}·(${f(m * m)} + ${f(m * r)} + ${r * r})/3.`],
        ['V = ', v('V', tpi(V, u3)), '.'],
      ];
      return { forma: 'pi', unidad: u3, correcta: V, errores, variables, solucion, enunciado, pregunta: [`¿Qué volumen de ${tierra ? 'tierra' : 'agua'} contiene?`], datos: { sub, r, R, H, p, q } };
    }
    if (sub === 'cono') {
      const [p, q] = rng.elegir(FRACS.slice(0, 5));
      const R = q * rng.entero(1, 3), H = q * rng.entero(1, 3) * 3;
      const Vt = calc.cono(R, H), k = p / q, V = Vt * k ** 3;
      delete variables.r;
      const enunciado = ['Una copa tiene forma de cono con la punta hacia abajo; el borde es un círculo de radio ', v('R', `${R} ${u}`), ' y la altura de la copa es ', v('H', `${H} ${u}`), `. Se sirve jugo hasta una altura igual a ${fracTxt(p, q)} de la altura de la copa, medida desde la punta.`];
      const errores = [
        par('GE2', Vt * k, `Tomaste ${fracTxt(p, q)} del volumen de la copa llena. El jugo forma un cono semejante con razón k = ${fracTxt(p, q)}: su volumen es k³ veces el de la copa.`),
        par('GE2', Vt * k * k, `Usaste k² (como para un área). Un volumen se multiplica por k³ = (${fracTxt(p, q)})³.`),
        h_('GE-llenado-lo-que-falta', Vt * (1 - k ** 3), 'Calculaste el espacio vacío que queda en la copa, no el jugo.'),
        h_('GE20', 3 * V, 'Olvidaste el factor 1/3 del cono.'),
      ];
      const solucion = [
        [`El jugo es un cono semejante a la copa, con razón k = ${fracTxt(p, q)}: radio ${f(R * k)} y altura ${f(H * k)}.`],
        ['Copa llena: π·', v('R', `${R}`), '²·', v('H', `${H}`), `/3 = ${tpi(Vt)}.`],
        [`Jugo: k³ · ${tpi(Vt)} = (${fracTxt(p, q)})³ · ${tpi(Vt)} = `, v('V', tpi(V, u3)), '.'],
      ];
      return { forma: 'pi', unidad: u3, correcta: V, errores, variables, solucion, enunciado, pregunta: ['¿Qué volumen de jugo hay en la copa?'], datos: { sub, R, H, p, q } };
    }
    if (sub === 'suma') {
      const r = rng.entero(1, 8), R = r + rng.entero(1, 8), H = rng.entero(2, 15);
      const S = R + r, D = R - r, Q = R * R + R * r + r * r, V = calc.troncoCono(R, r, H), V3pi = Math.round(3 * V / PI);
      if (!esEntero(3 * V / PI)) return null;
      const vars = { S: { nombre: 'suma de radios', color: 'o' }, D: { nombre: 'diferencia de radios', color: 'i' }, V: { nombre: 'capacidad', color: 'd' }, H: { nombre: 'altura', color: 'h' } };
      const enunciado = ['Un vaso tiene forma de tronco de cono. La suma del radio de la boca y el del fondo es ', v('S', `${S} ${u}`), ', y el de la boca excede al del fondo en ', v('D', `${D} ${u}`), '. Su capacidad es ', v('V', tpi(V, u3)), '.'];
      const errores = [
        h_('GE-tronco-suma-al-cuadrado', V3pi / (S * S), `Usaste (R + r)² = ${S * S} en lugar de R² + Rr + r². (R + r)² = R² + 2Rr + r²: tiene un Rr de más.`),
        h_('GE20', V3pi / 3 / Q, 'Despejaste sin el factor 1/3 de la fórmula del tronco.'),
        h_('GE-tronco-promedio-radios', V3pi / 3 / ((S / 2) ** 2), 'Tomaste el vaso como un cilindro con el radio promedio (R + r)/2: el tronco no es un cilindro.'),
        h_('GE-tronco-sin-producto', V3pi / (R * R + r * r), 'Te faltó el término Rr en R² + Rr + r².'),
      ];
      const solucion = [
        ['Con la suma y la diferencia: R = (', v('S', `${S}`), ' + ', v('D', `${D}`), `)/2 = ${R} y r = (${S} − ${D})/2 = ${r}.`],
        [`R² + Rr + r² = ${R * R} + ${R * r} + ${r * r} = ${Q}.`],
        ['H = 3V/(π·', `${Q}) = ${V3pi}/${Q} = `, v('H', tq(H, u)), '.'],
      ];
      return { forma: 'q', unidad: u, correcta: H, errores, variables: vars, solucion, enunciado, pregunta: ['¿Cuál es la altura del vaso?'], datos: { sub, S, D, V3pi } };
    }
    if (sub === 'inclinado') {
      // Cilindro inclinado hasta que el agua toca el borde de la boca: queda un tronco de cilindro cuyas
      // generatrices de agua son H (lado bajo... del borde) y g; su semisuma es el nivel inicial h0.
      const H = 2 * rng.entero(3, 10), h0 = rng.entero(H / 2 + 1, H - 1), r = rng.entero(2, 6);
      const g = 2 * h0 - H;
      const vars = { H: { nombre: 'altura del vaso', color: 'o' }, h0: { nombre: 'nivel inicial', color: 'i' }, g: { nombre: 'altura del agua en el lado opuesto', color: 'd' } };
      const enunciado = ['Un vaso cilíndrico de radio ', `${r} ${u}`, ' y ', v('H', `${H} ${u}`), ' de altura tiene agua hasta ', v('h0', `${h0} ${u}`), ' del fondo. Se inclina despacio hasta que el agua llega justo al borde de la boca por un lado, sin derramarse.'];
      const errores = [
        h_('GE-inclinado-lo-que-subio', H - h0, `Tomaste lo que sube el agua de un lado (${H} − ${h0}) como la altura del otro lado. Lo que sube de un lado es lo que baja del otro: ${h0} − ${H - h0}.`),
        h_('GE-inclinado-no-cambia', h0, 'Supusiste que el agua sigue a la misma altura en el lado opuesto. Al inclinar, sube de un lado y baja del otro.'),
        h_('GE-inclinado-mitad', h0 / 2, 'Tomaste la mitad del nivel inicial sin razón. El volumen no cambia: el promedio de las dos alturas del agua sigue siendo el nivel inicial.'),
        h_('GE-inclinado-mitad-bajada', (3 * h0 - H) / 2, 'Bajaste el agua solo la mitad de lo que subió del otro lado. Sube y baja lo mismo.'),
      ];
      const solucion = [
        ['El agua inclinada forma un tronco de cilindro: su volumen es πr²·(semisuma de las dos alturas del agua).'],
        ['El volumen no cambia: (', v('H', `${H}`), ' + g)/2 = ', v('h0', `${h0}`), '.'],
        [`g = 2·${h0} − ${H} = `, v('g', tq(g, u)), '.'],
      ];
      return { forma: 'q', unidad: u, correcta: g, errores, variables: vars, solucion, enunciado, pregunta: ['¿A qué altura del fondo queda el agua en el lado opuesto, medida sobre la pared?'], datos: { sub, r, H, h0 } };
    }
    // altura desde el volumen
    const r = rng.entero(1, 8), R = r + rng.entero(1, 8), H = rng.entero(2, 15);
    const S = R * R + R * r + r * r, V = calc.troncoCono(R, r, H);
    if (P.pi(V) === null) return null;
    variables.V = { nombre: 'capacidad', color: 'd' };
    const Vpi = V / PI, V3pi = Math.round(3 * Vpi);
    const enunciado = ['Un vaso tiene forma de tronco de cono, con fondo de radio ', v('r', `${r} ${u}`), ' y boca de radio ', v('R', `${R} ${u}`), '. Su capacidad es ', v('V', tpi(V, u3)), '.'];
    const errores = [
      h_('GE20', Vpi / S, 'Despejaste sin el factor 1/3: la fórmula es V = πh(R² + Rr + r²)/3, así que h = 3V/(π(R² + Rr + r²)).'),
      h_('GE-tronco-sin-producto', 3 * Vpi / (R * R + r * r), 'Te faltó el término Rr en R² + Rr + r².'),
      h_('GE-tronco-promedio-radios', Vpi / ((R + r) / 2) ** 2, 'Tomaste el vaso como un cilindro con el radio promedio: el tronco no es un cilindro.'),
      h_('GE-tronco-como-cono', 3 * Vpi / (R * R), 'Usaste la fórmula del cono con el radio de la boca: el vaso tiene fondo, es un tronco.'),
    ];
    const solucion = [
      [`R² + Rr + r² = ${R * R} + ${R * r} + ${r * r} = ${S}.`],
      ['V = πH(R² + Rr + r²)/3 → ', v('V', tpi(V)), ` = π·H·${S}/3.`],
      [`H = 3V/(π·${S}) = ${V3pi}/${S} = `, v('H', tq(H, u)), '.'],
    ];
    return { forma: 'q', unidad: u, correcta: H, errores, variables, solucion, enunciado, pregunta: ['¿Cuál es la altura del vaso?'], datos: { sub, r, R, V3pi } };
  }

  // ---------- Desplazamiento de volumen ----------
  function desplazamiento(rng, sub) {
    const u = 'cm', u3 = 'cm³';
    const variables = { d: { nombre: 'diámetro del vaso', color: 'o' }, a: { nombre: 'tamaño del objeto', color: 'i' }, s: { nombre: 'subida del nivel', color: 'h' }, V: { nombre: 'volumen del objeto', color: 'd' } };
    if (sub === 'piramide') {
      const r = rng.entero(3, 6), R = r + rng.entero(1, 4), H = rng.entero(4, 12);
      const s = rng.entero(2, r), hp = rng.entero(2, H);
      const A = H * (R * R + R * r + r * r) / 3, B = s * s * hp / 2;
      if (!esEntero(A) || !esEntero(B) || !(A * PI - B * Math.sqrt(3) > 0)) return null;
      const vars = { V: { nombre: 'vaso', color: 'o' }, s: { nombre: 'lado del hexágono', color: 'i' }, hp: { nombre: 'altura de la pirámide', color: 'h' }, X: { nombre: 'agua que queda', color: 'd' } };
      const enunciado = ['Un vaso con forma de tronco de cono, de ', v('V', `radio ${r} ${u} en el fondo, ${R} ${u} en la boca y ${H} ${u} de altura`), ', está lleno de agua hasta el borde. Se mete en él una pirámide regular de base hexagonal, de ', v('s', `${s} ${u}`), ' de lado de base y ', v('hp', `${hp} ${u}`), ' de altura, que se apoya en el fondo y queda totalmente sumergida; se derrama el agua que desplaza.'];
      const errores = [
        { ...h_('GE20', 0, 'Calculaste la pirámide sin su 1/3: el agua derramada es el volumen de la pirámide, (área de la base)·h/3.'), valor: { A, B: 3 * B } },
        { ...h_('GE-hexagono-un-triangulo', 0, 'Tomaste el área de un solo triángulo equilátero como base. El hexágono regular son seis: 6·s²√3/4.'), valor: { A, B: B / 6 } },
        { ...h_('GE20', 0, 'Calculaste el vaso sin el 1/3 de la fórmula del tronco de cono.'), valor: { A: 3 * A, B } },
        { ...h_('GE-tronco-promedio-radios', 0, 'Tomaste el vaso como un cilindro con el radio promedio: el tronco no es un cilindro.'), valor: { A: H * ((R + r) / 2) ** 2, B } },
        { ...h_('GE-hexagono-area', 0, 'Usaste 6·s²√3/2 para el hexágono: cada triángulo equilátero mide s²√3/4, no s²√3/2.'), valor: { A, B: 2 * B } },
      ];
      const tA = coef(A) === '' ? '' : coef(A), tB = coef(B) === '' ? '' : coef(B);
      const solucion = [
        ['Vaso lleno: π·', `${H}·(${R * R} + ${R * r} + ${r * r})/3 = ${tA}π ${u3}.`],
        ['Base de la pirámide: 6 equiláteros de lado ', v('s', `${s}`), `: 6·${s * s}√3/4 = ${coef(3 * s * s / 2)}√3.`],
        ['Pirámide: ', `${coef(3 * s * s / 2)}√3·`, v('hp', `${hp}`), `/3 = ${tB}√3 ${u3}: ese volumen de agua se derrama.`],
        ['Queda: ', v('X', `${tA}π − ${tB}√3 ${u3}`), '.'],
      ];
      return { forma: 'mixta', unidad: u3, correcta: { A, B }, errores, variables: vars, solucion, enunciado, pregunta: ['¿Qué volumen de agua queda en el vaso?'], datos: { sub, r, R, H, s, hp } };
    }
    if (sub === 'cubo') {
      const a = rng.entero(2, 6), d = 2 * rng.entero(2, 6), rc = d / 2;
      const Vc = a ** 3, s = calc.subidaNivel(Vc, rc);
      delete variables.V;
      const enunciado = ['Un vaso cilíndrico de ', v('d', `${d} ${u} de diámetro`), ' tiene agua. Se suelta dentro un cubo de metal de ', v('a', `${a} ${u}`), ' de arista, que queda totalmente sumergido sin que se derrame agua.'];
      const errores = [
        h_('GE19', Vc / (PI * d * d), `Usaste el diámetro (${d}) como si fuera el radio. El área del fondo es π(d/2)² = π·${rc}².`),
        h_('GE19', Vc / (PI * d), 'Dividiste entre πd, que es la longitud de la circunferencia del fondo. Hay que dividir entre el área del fondo, πr².'),
        h_('GE-desplaza-sin-cuadrado', Vc / (PI * rc), 'Dividiste entre π·r sin elevar el radio al cuadrado: el área del fondo es πr².'),
        h_('GE-desplaza-area-cubo', 6 * a * a / (PI * rc * rc), 'Usaste el área de las seis caras del cubo (6a²). El agua que sube ocupa el volumen del cubo, a³.'),
      ];
      const solucion = [
        ['El agua que sube ocupa el mismo volumen que el cubo: ', v('a', `${a}`), `³ = ${Vc} ${u3}.`],
        ['Ese volumen es un cilindro de radio ', v('d', `${rc} ${u}`), ` (la mitad de ${d}) y altura s: π·${rc}²·s = ${Vc}.`],
        ['s = ', `${Vc}/(${rc * rc}π) = `, v('s', FORMAS.invpi(u)(s)), '.'],
      ];
      return { forma: 'invpi', unidad: u, correcta: s, errores, variables, solucion, enunciado, pregunta: ['¿Cuánto sube el nivel del agua?'], datos: { sub, a, d } };
    }
    if (sub === 'esfera') {
      const rho = rng.entero(1, 6), d = 2 * rng.entero(2, 10), rc = d / 2;
      const Ve = calc.esfera(rho), s = calc.subidaNivel(Ve, rc);
      delete variables.V;
      const enunciado = ['En un recipiente cilíndrico de ', v('d', `${d} ${u} de diámetro`), ' con agua se hunde por completo una canica de acero de ', v('a', `${rho} ${u} de radio`), '. No se derrama agua.'];
      const errores = [
        h_('GE19', s / 4, `Usaste el diámetro del recipiente (${d}) como radio.`),
        h_('GE-esfera-radio-diametro', s / 8, `Tomaste ${rho} ${u} como diámetro de la canica: es su radio.`),
        h_('GE-esfera-sin-cuatro-tercios', s * 3 / 4, 'Usaste πr³ para la esfera: su volumen es (4/3)πr³.'),
        h_('GE-desplaza-sube-diametro', 2 * rho, 'Supusiste que el agua sube lo que mide la canica. Sube lo que hace falta para que un cilindro de agua del ancho del recipiente tenga el volumen de la canica.'),
        h_('GE-area-por-volumen', calc.areaEsfera(rho) / (PI * rc * rc), 'Usaste el área de la esfera (4πr²) en vez de su volumen (4πr³/3).'),
      ];
      const solucion = [
        ['Volumen de la canica: (4/3)π·', v('a', `${rho}`), `³ = ${tpi(Ve)}.`],
        ['El agua sube s: π·', v('d', `${rc}`), `²·s = ${tpi(Ve)}.`],
        [`s = ${f(Ve / PI)}/${rc * rc} = `, v('s', tq(s, u)), '.'],
      ];
      return { forma: 'q', unidad: u, correcta: s, errores, variables, solucion, enunciado, pregunta: ['¿Cuánto sube el nivel del agua?'], datos: { sub, rho, d } };
    }
    if (sub === 'pieza') {
      const d = 2 * rng.entero(2, 8), rc = d / 2, s = rng.entero(1, 6);
      const V = calc.cilindro(rc, s);
      delete variables.a;
      const cosa = rng.elegir(['una tuerca de acero', 'una piedra', 'una pieza de bronce']);
      const enunciado = ['Un vaso cilíndrico mide ', v('d', `${d} ${u} de diámetro`), ` por dentro. Al hundir por completo ${cosa}, el nivel del agua sube `, v('s', `${s} ${u}`), ' sin que se derrame nada.'];
      const errores = [
        h_('GE19', PI * d * d * s, `Usaste el diámetro (${d}) como radio. El radio del vaso es ${rc}.`),
        h_('GE19', PI * d * s, 'Usaste la longitud de la circunferencia por la subida: eso es la pared mojada, no el volumen del agua que subió.'),
        h_('GE-desplaza-un-tercio', V / 3, 'Pusiste un 1/3, como en el cono. El agua que sube forma un cilindro: πr²·s, sin 1/3.'),
        h_('GE-desplaza-radio-sin-cuadrado', PI * rc * s, 'Olvidaste elevar el radio al cuadrado: el área del fondo es πr².'),
      ];
      const solucion = [
        ['El volumen del objeto es el del agua que subió: un cilindro de radio ', v('d', `${rc} ${u}`), ' y altura ', v('s', `${s} ${u}`), '.'],
        [`V = π·${rc}²·${s} = `, v('V', tpi(V, u3)), '.'],
      ];
      return { forma: 'pi', unidad: u3, correcta: V, errores, variables, solucion, enunciado, pregunta: [`¿Cuál es el volumen ${cosa.replace(/^un |^una /, m => m === 'un ' ? 'del ' : 'de la ')}?`], datos: { sub, d, s } };
    }
    // balde troncocónico
    const n = rng.elegir([3, 4, 5]), t = rng.entero(2, 5), c = rng.entero(1, 2), r = rng.entero(4, 8);
    const H = n * t, R = r + n * c;
    const i = rng.entero(1, n - 2), j = rng.entero(i + 1, n - 1);
    const h1 = i * t, h2 = j * t, r1 = r + i * c, r2 = r + j * c;
    const V = calc.troncoCono(r2, r1, h2 - h1);
    if (P.pi(V) === null) return null;
    variables.d = { nombre: 'radio del fondo', color: 'o' };
    variables.a = { nombre: 'radio de la boca', color: 'i' };
    delete variables.s; delete variables.V;
    variables.h1 = { nombre: 'nivel antes', color: 'h' };
    variables.h2 = { nombre: 'nivel después', color: 'd' };
    const enunciado = ['Un balde tiene forma de tronco de cono, con fondo de radio ', v('d', `${r} ${u}`), ', boca de radio ', v('a', `${R} ${u}`), ` y altura ${H} ${u}. El agua llega a `, v('h1', `${h1} ${u}`), ' del fondo. Se hunde por completo una pieza de metal y el agua sube hasta ', v('h2', `${h2} ${u}`), ' del fondo, sin derramarse.'];
    const errores = [
      h_('GE-desplaza-como-cilindro', calc.cilindro(r, h2 - h1), `Usaste un cilindro con el radio del fondo (${r}). El balde se ensancha: a esa altura el agua ocupa un tronco de cono.`),
      h_('GE-desplaza-como-cilindro', calc.cilindro(R, h2 - h1), `Usaste un cilindro con el radio de la boca (${R}). El agua no llega a la boca: los radios de los dos niveles salen por semejanza.`),
      h_('GE20', 3 * V, 'Olvidaste el factor 1/3 en el volumen del tronco.'),
      h_('GE-tronco-promedio-radios', PI * ((r1 + r2) / 2) ** 2 * (h2 - h1), 'Usaste un cilindro con el radio promedio de los dos niveles: la capa de agua es un tronco, no un cilindro.'),
      h_('GE22', calc.troncoCono(R, r, h2 - h1), `Usaste los radios del fondo y de la boca (${r} y ${R}). Los radios a las alturas ${h1} y ${h2} son otros: salen por semejanza.`),
    ];
    const solucion = [
      [`El radio crece ${R - r} ${u} en ${H} ${u} de altura: ${c} ${u} por cada ${t} ${u}.`],
      ['A ', v('h1', `${h1}`), ` ${u}: radio ${r1}; a `, v('h2', `${h2}`), ` ${u}: radio ${r2}.`],
      [`El agua que subió es un tronco de radios ${r1} y ${r2} y altura ${h2 - h1}: π·${h2 - h1}·(${r2 * r2} + ${r1 * r2} + ${r1 * r1})/3.`],
      ['Volumen de la pieza: ', tpi(V, u3), '.'],
    ];
    return { forma: 'pi', unidad: u3, correcta: V, errores, variables, solucion, enunciado, pregunta: ['¿Cuál es el volumen de la pieza?'], datos: { sub, r, R, H, h1, h2 } };
  }

  // ---------- Región que gira ----------
  function regionGira(rng, sub) {
    const u = 'cm', u3 = 'cm³';
    if (sub === 'triangulo') {
      const [a, b] = rng.elegir([[4, 3], [3, 4], [8, 6], [6, 8], [6, 3], [3, 6], [4, 2], [2, 4], [6, 4], [4, 6], [9, 6], [6, 9]]);
      const eje = rng.elegir(['x', 'y']);
      const g = (x, y) => { let p = x, q = y; while (q) [p, q] = [q, p % q]; return p; };
      const m = g(b, a), num = b / m, den = a / m;
      const recta = den === 1 ? `y = ${num === 1 ? '' : num}x` : `y = ${num === 1 ? '' : num}x/${den}`;
      const cono = eje === 'x' ? calc.cono(b, a) : calc.cono(a, b);
      const V = eje === 'x' ? cono : calc.cilindro(a, b) - cono;
      const variables = { m: { nombre: 'recta', color: 'o' }, a: { nombre: 'recta vertical x = a', color: 'i' }, e: { nombre: 'eje de giro', color: 'h' }, V: { nombre: 'volumen', color: 'd' } };
      const enunciado = ['En el plano cartesiano (medidas en cm), la región limitada por la recta ', v('m', recta), ', el eje X y la recta ', v('a', `x = ${a}`), ' gira una vuelta completa alrededor del ', v('e', `eje ${eje.toUpperCase()}`), '.'];
      const errores = eje === 'x' ? [
        h_('GE-gira-eje-cambiado', calc.cono(a, b), `Cambiaste el radio por la altura. Al girar alrededor del eje X, el radio es la altura del triángulo (y = ${b} en x = ${a}) y la altura del cono es ${a}.`),
        h_('GE20', 3 * V, 'Olvidaste el factor 1/3: el sólido es un cono, no un cilindro.'),
        h_('GE-gira-region-complementaria', calc.cilindro(b, a) - V, 'Calculaste el sólido que genera la otra parte del rectángulo (cilindro menos cono). La región es el triángulo bajo la recta: genera un cono.'),
        h_('GE-gira-mitad', PI * b * b * a / 2, 'Tomaste el cono como medio cilindro. Es un tercio.'),
      ] : [
        h_('GE-gira-region-complementaria', cono, `Ese es el cono que genera el triángulo entre la recta y el eje Y. La región está bajo la recta, del lado del eje X: al girar alrededor del eje Y genera un cilindro con un hueco cónico.`),
        h_('GE-gira-sin-hueco', calc.cilindro(a, b), 'Calculaste el cilindro entero. Falta restar el cono que no barre la región (el que queda entre la recta y el eje Y).'),
        h_('GE-gira-eje-cambiado', calc.cilindro(b, a) - calc.cono(b, a), `Cambiaste el radio por la altura: al girar alrededor del eje Y, el radio es ${a} y la altura es ${b}.`),
        h_('GE-gira-mitad', calc.cilindro(a, b) / 2, 'Tomaste la mitad del cilindro. El cono que se resta es un tercio del cilindro, así que queda dos tercios.'),
      ];
      const solucion = eje === 'x' ? [
        [`La región es un triángulo rectángulo de vértices (0; 0), (${a}; 0) y (${a}; ${b}).`],
        ['Al girar alrededor del ', v('e', 'eje X'), ' genera un cono de radio ', `${b}`, ' (la recta en ', v('a', `x = ${a}`), ') y altura ', `${a}`, '.'],
        [`V = π·${b}²·${a}/3 = `, v('V', tpi(V, u3)), '.'],
      ] : [
        [`La región es un triángulo rectángulo de vértices (0; 0), (${a}; 0) y (${a}; ${b}).`],
        ['Al girar alrededor del ', v('e', 'eje Y'), ', el lado vertical (en ', v('a', `x = ${a}`), `) barre un cilindro de radio ${a} y altura ${b}; la hipotenusa barre un cono que queda hueco.`],
        [`V = π·${a}²·${b} − π·${a}²·${b}/3 = ${tpi(calc.cilindro(a, b))} − ${tpi(cono)} = `, v('V', tpi(V, u3)), '.'],
      ];
      return { forma: 'pi', unidad: u3, correcta: V, errores, variables, solucion, enunciado, pregunta: ['¿Cuál es el volumen del sólido que se genera?'], datos: { sub, a, b, eje } };
    }
    if (sub === 'trapecio') {
      const daCD = rng.moneda();
      let B, b, h, CD = null;
      if (daCD) { const [c1, c2, c3] = rng.elegir(TERNAS.slice(0, 4)); b = rng.entero(1, 6); B = b + c1; h = c2; CD = c3; }
      else { b = rng.entero(1, 6); B = b + rng.entero(1, 6); h = rng.entero(2, 6); }
      const eje = rng.elegir(['AB', 'AD', 'BC']);
      const VAB = calc.troncoCono(B, b, h), cono = calc.cono(h, B - b);
      const VAD = calc.cilindro(h, b) + cono, VBC = calc.cilindro(h, B) - cono;
      const V = { AB: VAB, AD: VAD, BC: VBC }[eje];
      const variables = { B: { nombre: 'base mayor AD', color: 'o' }, b: { nombre: 'base menor BC', color: 'i' }, h: { nombre: daCD ? 'lado oblicuo CD' : 'altura AB', color: 'h' }, V: { nombre: 'volumen', color: 'd' } };
      const enunciado = ['El trapecio rectángulo ABCD tiene ángulos rectos en A y en B, con AD paralelo a BC. La base mayor mide ', v('B', `AD = ${B} ${u}`), ', la base menor ', v('b', `BC = ${b} ${u}`), ' y ', daCD ? v('h', `el lado oblicuo CD = ${CD} ${u}`) : v('h', `la altura AB = ${h} ${u}`), `. El trapecio gira una vuelta alrededor del lado ${eje}.`];
      const nombre = { AB: 'el lado AB', AD: 'la base mayor AD', BC: 'la base menor BC' };
      const errores = [];
      for (const otro of ['AB', 'AD', 'BC']) if (otro !== eje) errores.push(h_('GE-gira-otro-lado', { AB: VAB, AD: VAD, BC: VBC }[otro], `Ese es el sólido que sale al girar alrededor de ${nombre[otro]}. Aquí el eje es ${eje}: mira qué segmentos quedan pegados al eje y cuáles giran lejos de él.`));
      if (eje === 'AB') {
        errores.push(h_('GE20', 3 * VAB, 'Olvidaste el factor 1/3 del tronco de cono.'));
        errores.push(h_('GE-tronco-promedio-radios', PI * ((B + b) / 2) ** 2 * h, 'Usaste un cilindro con el radio promedio: el sólido es un tronco de cono.'));
      } else if (eje === 'AD') {
        errores.push(h_('GE20', calc.cilindro(h, b) + 3 * cono, 'El cono de la punta va con 1/3: lo calculaste como cilindro.'));
        errores.push(h_('GE-gira-cono-restado', calc.cilindro(h, b) - cono, 'Restaste el cono. Al girar alrededor de la base mayor, el triángulo de la punta suma un cono al cilindro.'));
        errores.push(h_('GE-gira-sin-hueco', calc.cilindro(h, B), 'Calculaste el cilindro de largo AD completo. Al lado de D la región es un triángulo, que genera un cono, no un cilindro.'));
      } else {
        errores.push(h_('GE20', calc.cilindro(h, B) - 3 * cono, 'El hueco cónico va con 1/3: lo restaste como cilindro.'));
        errores.push(h_('GE-gira-cono-restado', calc.cilindro(h, B) + cono, 'Sumaste el cono. Al girar alrededor de la base menor, el triángulo que falta deja un hueco cónico: se resta.'));
        errores.push(h_('GE-gira-sin-hueco', calc.cilindro(h, B), 'Calculaste el cilindro completo sin restar el hueco cónico.'));
      }
      const pasoH = daCD ? [['Altura: AB² = ', v('h', `${CD}`), `² − (${B} − ${b})² = ${CD * CD} − ${(B - b) ** 2} → AB = ${h} ${u}.`]] : [];
      const cuerpo = eje === 'AB' ? [
        ['Al girar alrededor de AB, BC y AD barren dos círculos de radios ', v('b', `${b}`), ' y ', v('B', `${B}`), `, y CD barre la superficie lateral: es un tronco de cono de altura ${h}.`],
        [`V = π·${h}·(${B * B} + ${B * b} + ${b * b})/3 = `, v('V', tpi(V, u3)), '.'],
      ] : eje === 'AD' ? [
        ['Sea E el pie de la perpendicular desde C a AD. Al girar alrededor de AD, el rectángulo ABCE genera un cilindro de radio AB = ', `${h}`, ' y largo BC = ', v('b', `${b}`), `, y el triángulo CED genera un cono de radio CE = ${h} y altura ED = ${B} − ${b} = ${B - b}.`],
        [`V = π·${h}²·${b} + π·${h}²·${B - b}/3 = ${tpi(calc.cilindro(h, b))} + ${tpi(cono)} = `, v('V', tpi(V, u3)), '.'],
      ] : [
        ['Prolonga BC hasta F, con BF = AD: el rectángulo ABFD, al girar alrededor de BC, genera un cilindro de radio AB = ', `${h}`, ' y largo ', v('B', `${B}`), `. El triángulo CFD queda fuera del trapecio: genera un cono de radio FD = ${h} y altura CF = ${B - b}, que se resta (queda hueco del lado de D).`],
        [`V = π·${h}²·${B} − π·${h}²·${B - b}/3 = ${tpi(calc.cilindro(h, B))} − ${tpi(cono)} = `, v('V', tpi(V, u3)), '.'],
      ];
      return { forma: 'pi', unidad: u3, correcta: V, errores, variables, solucion: pasoH.concat(cuerpo), enunciado, pregunta: ['¿Cuál es el volumen del sólido que se genera?'], datos: { sub, B, b, h: daCD ? null : h, CD, eje } };
    }
    // rectángulo con hueco
    const w = rng.entero(1, 4), L = rng.entero(2, 8), d = rng.entero(1, 4);
    const V = PI * L * ((d + w) ** 2 - d * d);
    const variables = { w: { nombre: 'ancho del rectángulo', color: 'o' }, L: { nombre: 'largo del rectángulo', color: 'i' }, d: { nombre: 'distancia al eje', color: 'h' }, V: { nombre: 'volumen', color: 'd' } };
    const enunciado = ['Un rectángulo de ', v('L', `${L} ${u}`), ' por ', v('w', `${w} ${u}`), ` gira una vuelta alrededor de una recta de su mismo plano, paralela a los lados de ${L} ${u}. El lado más cercano a la recta está a `, v('d', `${d} ${u}`), ' de ella.'];
    const errores = [
      h_('GE-gira-sin-distancia', PI * L * w * w, `Hiciste girar el rectángulo alrededor de su propio lado. Está a ${d} ${u} del eje: genera un tubo.`),
      h_('GE-gira-sin-hueco', PI * L * (d + w) ** 2, `Calculaste el cilindro macizo de radio ${d + w}. El espacio entre el eje y el rectángulo no se barre: queda un hueco de radio ${d}.`),
      h_('GE-gira-pappus-borde', 2 * PI * d * w * L, 'Multiplicaste el área del rectángulo por la vuelta del lado más cercano (2πd). El rectángulo recorre en promedio la vuelta de su centro, a d + w/2 del eje.'),
      h_('GE-gira-resta-radios', PI * L * (w * w + d * d), `Restaste mal los cuadrados: (d + w)² − d² no es w² + d²; es 2dw + w².`),
    ];
    const solucion = [
      ['El lado lejano barre un cilindro de radio ', v('d', `${d}`), ' + ', v('w', `${w}`), ` = ${d + w}; el lado cercano, uno de radio `, v('d', `${d}`), '. Queda un tubo de largo ', v('L', `${L}`), '.'],
      [`V = π·${L}·(${d + w}² − ${d}²) = π·${L}·${(d + w) ** 2 - d * d} = `, v('V', tpi(V, u3)), '.'],
    ];
    return { forma: 'pi', unidad: u3, correcta: V, errores, variables, solucion, enunciado, pregunta: ['¿Cuál es el volumen del sólido que se genera?'], datos: { sub, w, L, d } };
  }

  // ---------- Partes de la esfera ----------
  const ESFERA = { 5: [3, 4], 10: [6, 8], 13: [5, 12], 15: [9, 12], 17: [8, 15], 25: [7, 15, 20, 24] };
  function esferaSegmento(rng, sub) {
    const u = sub === 'cupula' ? 'm' : sub === 'dos-bases' ? 'cm' : rng.elegir(['cm', 'm']), u2 = u + '²', u3 = u + '³';
    const variables = { R: { nombre: 'radio de la esfera', color: 'o' }, d: { nombre: 'distancia o altura', color: 'i' }, a: { nombre: 'radio del círculo de corte', color: 'h' }, X: { nombre: 'lo que se pide', color: 'd' } };
    if (sub === 'cubo') {
      const a = rng.entero(1, 12), pide = rng.elegir(['uno', 'seis']);
      const uno = PI * a * a * DOS / 2, correcta = pide === 'uno' ? uno : 6 * uno;
      const vars = { a: { nombre: 'arista del cubo', color: 'o' }, R: { nombre: 'radio de la esfera', color: 'i' }, d: { nombre: 'altura del casquete', color: 'h' }, X: { nombre: 'área pedida', color: 'd' } };
      const enunciado = ['Una esfera y un cubo de ', v('a', `${a} ${u}`), ' de arista tienen el mismo centro, y la esfera es tangente a las 12 aristas del cubo (las toca en sus puntos medios). Cada cara del cubo corta a la esfera y deja afuera un casquete esférico.'];
      const errores = [
        h_(pide === 'uno' ? 'GE-casquetes-seis-por-uno' : 'GE-casquetes-uno-por-seis', pide === 'uno' ? 6 * uno : uno, pide === 'uno' ? 'Sumaste los seis casquetes; se pide el de una sola cara.' : 'Ese es un solo casquete. Cada una de las seis caras corta uno.'),
        h_('GE-casquete-cuatro-pi', 2 * correcta, 'Usaste 4πRh, que mezcla el área de la esfera con la del casquete. El casquete mide 2πRh.'),
        h_('GE-casquete-sin-dos', correcta / 2, 'Usaste πRh: el área del casquete es 2πRh.'),
        h_('GE-casquetes-tres-caras', pide === 'uno' ? 3 * uno : 3 * uno, pide === 'uno' ? 'Ese es el total de las tres caras que se ven en un dibujo. Se pide un solo casquete.' : 'Contaste solo las tres caras que se ven en el dibujo: el cubo tiene seis.'),
      ];
      const solucion = [
        ['La esfera toca cada arista en su punto medio, y la distancia del centro del cubo a ese punto es la mitad de la diagonal de una cara: ', v('R', 'R = a√2/2'), '.'],
        ['Cada cara está a a/2 del centro, así que el casquete que sale tiene altura ', v('d', 'h = R − a/2 = a(√2 − 1)/2'), '.'],
        ['Un casquete: 2πRh = 2π·(a√2/2)·a(√2 − 1)/2 = πa²(2 − √2)/2 = ', FORMAS.casq(u2)(uno), ` con a = `, v('a', `${a}`), '.'],
        pide === 'uno' ? ['Respuesta: ', v('X', FORMAS.casq(u2)(uno)), '.'] : ['Seis casquetes: ', v('X', FORMAS.casq(u2)(6 * uno)), '.'],
      ];
      return { forma: 'casq', unidad: u2, correcta, errores, variables: vars, solucion, enunciado, pregunta: [pide === 'uno' ? '¿Cuál es el área de uno de esos casquetes?' : '¿Cuál es el área total de los seis casquetes que quedan fuera del cubo?'], datos: { sub, a, pide } };
    }
    if (sub === 'casquete') {
      const [d, a, R] = rng.elegir([[3, 4, 5], [4, 3, 5], [6, 8, 10], [8, 6, 10], [5, 12, 13], [12, 5, 13], [9, 12, 15], [12, 9, 15], [7, 24, 25], [24, 7, 25], [15, 20, 25], [20, 15, 25], [12, 16, 20], [16, 12, 20]]);
      const hh = R - d, A = calc.casquete(R, hh);
      delete variables.a;
      const enunciado = ['Un plano corta una esfera de radio ', v('R', `${R} ${u}`), ' a ', v('d', `${d} ${u}`), ' de su centro.'];
      const errores = [
        h_('GE-casquete-base', PI * a * a, 'Calculaste el área del círculo de corte (la «tapa» plana). El casquete es la parte curva de la esfera.'),
        h_('GE-casquete-altura-cambiada', calc.casquete(R, d), `Usaste la distancia al centro (${d}) como altura del casquete. La altura va del plano a la superficie: R − d = ${hh}.`),
        h_('GE-casquete-el-grande', calc.casquete(R, R + d), 'Ese es el casquete mayor (altura R + d). Se pide el menor.'),
        h_('GE-casquete-esfera-entera', calc.areaEsfera(R), 'Esa es el área de toda la esfera.'),
      ];
      const solucion = [
        ['Altura del casquete menor: h = ', v('R', `${R}`), ' − ', v('d', `${d}`), ` = ${hh} ${u}.`],
        ['Área del casquete: 2πRh (como la de la franja del cilindro que lo envuelve).'],
        [`A = 2π·${R}·${hh} = `, v('X', tpi(A, u2)), '.'],
      ];
      return { forma: 'pi', unidad: u2, correcta: A, errores, variables, solucion, enunciado, pregunta: ['¿Cuál es el área del casquete esférico menor?'], datos: { sub, R, d } };
    }
    if (sub === 'cupula') {
      const a = rng.entero(2, 8), hh = rng.entero(1, a - 1);
      const R = (a * a + hh * hh) / (2 * hh), A = calc.casquete(R, hh);
      delete variables.R;
      const enunciado = ['La cúpula de un observatorio es un casquete esférico. Su base es un círculo de ', v('a', `${a} ${u} de radio`), ' y su punto más alto está a ', v('d', `${hh} ${u}`), ' sobre el plano de la base.'];
      const errores = [
        h_('GE-casquete-base', PI * a * a, 'Calculaste el área del círculo de la base, no la de la superficie curva.'),
        h_('GE-casquete-radio-base', 2 * PI * a * hh, `Usaste el radio de la base (${a}) como radio de la esfera. El radio de la esfera sale de R² = a² + (R − h)².`),
        h_('GE-cupula-semiesfera', 2 * PI * a * a, `Tomaste la cúpula como media esfera de radio ${a}. Solo lo sería si su altura fuera ${a}.`),
        h_('GE-casquete-esfera-entera', calc.areaEsfera(R), 'Esa es el área de la esfera completa.'),
      ];
      const solucion = [
        ['El radio R de la esfera cumple R² = ', v('a', `${a}`), '² + (R − ', v('d', `${hh}`), `)² → 2·${hh}·R = ${a * a} + ${hh * hh} → R = ${tq(R)}.`],
        [`Área del casquete: 2πRh = 2π·${tq(R)}·${hh} = `, v('X', tpi(A, u2)), '.'],
        ['Atajo: 2πRh = π(a² + h²).'],
      ];
      return { forma: 'pi', unidad: u2, correcta: A, errores, variables, solucion, enunciado, pregunta: ['¿Cuál es el área de la superficie de la cúpula?'], datos: { sub, a, hh } };
    }
    if (sub === 'una-base') {
      const R = rng.entero(2, 9), hh = rng.entero(1, R);
      const V = calc.segmentoUnaBase(R, hh), a2 = hh * (2 * R - hh);
      delete variables.a;
      const enunciado = ['De una esfera de radio ', v('R', `${R} ${u}`), ' se corta, con un plano, un segmento esférico de una base cuya altura es ', v('d', `${hh} ${u}`), '.'];
      const errores = [
        h_('GE20', 3 * V, 'Olvidaste el 1/3 de la fórmula πh²(3R − h)/3.'),
        h_('GE-segmento-como-cono', PI * a2 * hh / 3, 'Calculaste el cono que tiene la misma base y la misma altura. El segmento es curvo por fuera: tiene más volumen que ese cono.'),
        h_('GE-segmento-como-cilindro', PI * a2 * hh, 'Calculaste el cilindro de la misma base y altura: el segmento cabe dentro de él y tiene menos volumen.'),
        h_('GE-segmento-radio-cambiado', PI * hh * hh * (3 * hh - R) / 3, 'Cambiaste R por h en la fórmula: es πh²(3R − h)/3.'),
      ];
      const solucion = [
        ['Volumen del segmento de una base: V = πh²(3R − h)/3.'],
        ['V = π·', v('d', `${hh}`), '²·(3·', v('R', `${R}`), ` − ${hh})/3 = π·${hh * hh}·${3 * R - hh}/3 = `, v('X', tpi(V, u3)), '.'],
      ];
      return { forma: 'pi', unidad: u3, correcta: V, errores, variables, solucion, enunciado, pregunta: ['¿Cuál es el volumen del segmento?'], datos: { sub, R, hh } };
    }
    if (sub === 'equilatero') {
      const R = rng.elegir([6, 12, 18, 24, 30]), pide = rng.elegir(['menor', 'menor', 'mayor']);
      const Vm = calc.segmentoUnaBase(R, R / 2), VM = calc.segmentoUnaBase(R, 3 * R / 2), V = pide === 'menor' ? Vm : VM;
      const hh = pide === 'menor' ? R / 2 : 3 * R / 2;
      delete variables.a; delete variables.d;
      const enunciado = ['En un círculo máximo de una esfera de radio ', v('R', `${R} ${u}`), ` se inscribe un triángulo equilátero. Un plano perpendicular al plano de ese círculo pasa por uno de los lados del triángulo y corta la esfera en dos partes. Se retira la parte ${pide}.`];
      const errores = [
        pide === 'menor' ? h_('GE-segmento-el-grande', VM, 'Ese es el volumen de la parte mayor (altura 3R/2). Se retira la menor.')
                         : h_('GE-segmento-el-chico', Vm, 'Ese es el volumen de la parte menor (altura R/2). Se retira la mayor.'),
        h_('GE20', 3 * V, 'Olvidaste el 1/3 de la fórmula πh²(3R − h)/3.'),
        pide === 'menor' ? h_('GE-segmento-como-cono', calc.cono(R * Math.sqrt(3) / 2, R / 2), 'Calculaste un cono con la misma base y altura: el segmento es curvo y tiene más volumen.')
                         : h_('GE-segmento-esfera-menos-cono', calc.esfera(R) - calc.cono(R * Math.sqrt(3) / 2, R / 2), 'A la esfera le quitaste un cono con la base del corte, no el segmento menor: el segmento es curvo y tiene más volumen que ese cono.'),
        pide === 'menor' ? h_('GE-segmento-como-cilindro', calc.cilindro(R * Math.sqrt(3) / 2, R / 2), 'Calculaste un cilindro con la misma base y altura: el segmento tiene menos volumen.')
                         : h_('GE-segmento-altura-mal', calc.segmentoUnaBase(R, R), 'Tomaste la altura de la parte mayor como R: el plano no pasa por el centro, la altura es R + R/2.'),
        h_('GE-segmento-semiesfera', calc.esfera(R) / 2, 'Tomaste media esfera: el plano no pasa por el centro.'),
        h_('GE-segmento-apotema-tercio', calc.segmentoUnaBase(R, pide === 'menor' ? 2 * R / 3 : 4 * R / 3), 'Pusiste el plano a R/3 del centro. El lado del equilátero inscrito está a R/2 del centro (el apotema es la mitad del radio).'),
      ];
      const solucion = [
        ['El lado del equilátero inscrito está a R/2 del centro (es su apotema: un tercio de la altura, que mide 3R/2).'],
        ['El plano queda a ', `${R / 2} ${u}`, ` del centro: la parte ${pide} es un segmento de una base de altura h = `, pide === 'menor' ? v('R', `${R}`) : '', pide === 'menor' ? ` − ${R / 2}` : `${R} + ${R / 2}`, ` = ${hh} ${u}.`],
        [`V = π·${hh}²·(3·${R} − ${hh})/3 = `, v('X', tpi(V, u3)), '.'],
      ];
      return { forma: 'pi', unidad: u3, correcta: V, errores, variables, solucion, enunciado, pregunta: ['¿Cuál es el volumen de la parte que se retira?'], datos: { sub, R, pide } };
    }
    // dos bases
    const R = Number(rng.elegir(Object.keys(ESFERA)));
    const mismoLado = rng.moneda();
    const ds = ESFERA[R];
    let d1, d2;
    // Ningún plano pasa por el centro (así la boca no es un círculo máximo).
    if (mismoLado) { d1 = rng.elegir(ds.slice(0, -1)); d2 = rng.elegir(ds.filter(x => x > d1)); }
    else { d1 = rng.elegir(ds); d2 = rng.elegir(ds); }
    const a = d => Math.sqrt(R * R - d * d), a1 = a(d1), a2 = a(d2);
    const hh = mismoLado ? d2 - d1 : d1 + d2;
    const V = calc.segmentoDosBases(hh, a1, a2);
    const enunciado = mismoLado
      ? ['Un tazón se obtiene al cortar una esfera de radio ', v('R', `${R} ${u}`), ' con dos planos paralelos, los dos del mismo lado del centro: la boca es un círculo de radio ', v('a1', `${a1} ${u}`), ' y el fondo plano un círculo de radio ', v('a2', `${a2} ${u}`), '.']
      : ['Dos planos paralelos, uno a cada lado del centro, cortan una esfera de radio ', v('R', `${R} ${u}`), ' en círculos de radios ', v('a1', `${a1} ${u}`), ' y ', v('a2', `${a2} ${u}`), '.'];
    const hMal = mismoLado ? d1 + d2 : Math.abs(d1 - d2);
    const errores = [
      h_('GE-segmento-lado-del-centro', hMal > 0 ? calc.segmentoDosBases(hMal, a1, a2) : NaN, mismoLado ? 'Sumaste las distancias al centro: los dos planos están del mismo lado, así que la altura es su diferencia.' : 'Restaste las distancias al centro: los planos están a lados opuestos, así que la altura es su suma.'),
      h_('GE-segmento-como-tronco', calc.troncoCono(a1, a2, hh), 'Usaste la fórmula del tronco de cono. La pared del segmento es curva: su volumen es πh(h² + 3a₁² + 3a₂²)/6.'),
      h_('GE-segmento-sin-h-cubo', PI * hh * (a1 * a1 + a2 * a2) / 2, 'Te faltó el término h² dentro del paréntesis: V = πh(h² + 3a₁² + 3a₂²)/6.'),
      h_('GE-segmento-promedio-bases', PI * ((a1 + a2) / 2) ** 2 * hh, 'Usaste un cilindro con el radio promedio de los dos círculos.'),
    ];
    delete variables.a; delete variables.X;
    variables.d = { nombre: 'altura del segmento', color: 'i' };
    variables.a1 = { nombre: 'radio de un círculo', color: 'h' };
    variables.a2 = { nombre: 'radio del otro círculo', color: 'd' };
    const solucion = [
      ['Distancia de cada plano al centro (Pitágoras con el radio ', v('R', `${R}`), '): ', '√(', `${R * R} − `, v('a1', `${a1}`), `²) = ${d1}`, ' y √(', `${R * R} − `, v('a2', `${a2}`), `²) = ${d2}`, '.'],
      [mismoLado ? 'Del mismo lado del centro: ' : 'A lados opuestos: ', 'h = ', v('d', `${hh} ${u}`), '.'],
      [`V = πh(h² + 3a₁² + 3a₂²)/6 = π·${hh}·(${hh * hh} + ${3 * a1 * a1} + ${3 * a2 * a2})/6 = ${tpi(V, u3)}.`],
    ];
    if (hh <= 0) return null;
    return { forma: 'pi', unidad: u3, correcta: V, errores, variables, solucion, enunciado, pregunta: [mismoLado ? '¿Cuál es la capacidad del tazón?' : '¿Cuál es el volumen de la parte de la esfera entre los dos planos?'], datos: { sub, R, a1, a2, mismoLado } };
  }

  // ---------- Esfera inscrita en un cono ----------
  function esferaCono(rng, sub) {
    const u = 'cm';
    if (sub === 'razon' && rng.moneda()) {
      // Cono recto cualquiera (terna pitagórica): las razones dependen de la forma del cono, no de su tamaño.
      const pide = rng.elegir(['lateral', 'total', 'volumen']);
      const [R, H] = rng.elegir([[3, 4], [4, 3], [5, 12], [12, 5], [8, 15], [15, 8], [7, 24], [20, 21]]);
      const g = Math.hypot(R, H), r = calc.radioInscritoCono(R, H);
      const raz = (rr, que) => que === 'lateral' ? 4 * rr * rr / (R * g) : que === 'total' ? 4 * rr * rr / (R * (R + g)) : 4 * rr ** 3 / (R * R * H);
      const correcta = raz(r, pide);
      const vars = { R: { nombre: 'radio del cono', color: 'o' }, H: { nombre: 'altura del cono', color: 'i' }, r: { nombre: 'radio de la esfera', color: 'h' }, X: { nombre: 'razón', color: 'd' } };
      const que = { lateral: 'el área de la esfera y el área lateral del cono', total: 'el área de la esfera y el área total del cono', volumen: 'el volumen de la esfera y el volumen del cono' }[pide];
      const enunciado = ['Un cono recto tiene radio de base ', v('R', `${R} cm`), ' y altura ', v('H', `${H} cm`), '. Dentro hay una esfera tangente a la base y a toda la superficie lateral.'];
      const otra = pide === 'lateral' ? 'total' : 'lateral';
      const errores = [
        h_('GE-razon-invertida', 1 / correcta, 'Pusiste la razón al revés (cono entre esfera).'),
        pide !== 'volumen' ? h_(pide === 'lateral' ? 'GE-inscrita-area-total' : 'GE-inscrita-area-lateral', raz(r, otra), pide === 'lateral' ? 'Dividiste entre el área total (con la base); se pide la lateral.' : 'Dividiste entre el área lateral; se pide la total, con la base.') : h_('GE-inscrita-area-lateral', raz(r, 'lateral'), 'Esa es una razón de áreas; se piden volúmenes.'),
        h_('GE-inscrita-baricentro', raz(H / 3, pide), 'Tomaste r = H/3, que solo vale en el cono equilátero. El radio es área/semiperímetro del corte.'),
        h_('GE-inscrita-radio-mitad', raz(R / 2, pide), 'Tomaste el radio de la esfera como la mitad del radio de la base, sin calcularlo.'),
        h_('GE-inscrita-medio-triangulo', raz((R + H - g) / 2, pide), 'Usaste el inradio del triángulo rectángulo de la mitad del corte. La esfera es el círculo inscrito en el triángulo isósceles completo.'),
      ];
      const solucion = [
        ['Corte por el eje: triángulo isósceles de base ', v('R', `2·${R}`), ', altura ', v('H', `${H}`), ` y lados g = ${g}; la esfera es su círculo inscrito.`],
        ['r = área/semiperímetro = ', `${R * H}/${R + g} = `, v('r', tq(r)), '.'],
        pide === 'volumen' ? [`Razón: (4/3)πr³ ÷ (πR²H/3) = 4r³/(R²H) = `, v('X', fraccion(correcta, 300)), '.']
          : pide === 'lateral' ? [`Razón: 4πr² ÷ πRg = 4r²/(R·${g}) = `, v('X', fraccion(correcta, 300)), '.']
            : [`Razón: 4πr² ÷ πR(g + R) = 4r²/(R·${g + R}) = `, v('X', fraccion(correcta, 300)), '.'],
      ];
      return { forma: 'razon', unidad: '', correcta, errores, variables: vars, solucion, enunciado, pregunta: [`¿Cuál es la razón entre ${que}?`], datos: { sub, equilatero: false, pide, R, H } };
    }
    if (sub === 'razon') {
      const pide = rng.elegir(['lateral', 'total', 'volumen']);
      const variables = { g: { nombre: 'generatriz = diámetro', color: 'o' }, r: { nombre: 'radio de la esfera', color: 'i' }, X: { nombre: 'razón', color: 'd' } };
      const correcta = { lateral: 2 / 3, total: 4 / 9, volumen: 4 / 9 }[pide];
      const que = { lateral: 'el área de la esfera y el área lateral del cono', total: 'el área de la esfera y el área total del cono', volumen: 'el volumen de la esfera y el volumen del cono' }[pide];
      const enunciado = ['Un cono es equilátero: ', v('g', 'su generatriz mide lo mismo que el diámetro de su base'), '. Dentro de él hay una esfera tangente a la base y a toda la superficie lateral.'];
      const errores = {
        lateral: [
          h_('GE-inscrita-area-total', 4 / 9, 'Dividiste entre el área total del cono (con la base). Se pide el área lateral, sin la base.'),
          h_('GE-inscrita-radio-mitad', 1 / 2, 'Tomaste el radio de la esfera como la mitad del radio de la base. Es R/√3: el centro de la esfera es el incentro del triángulo equilátero.'),
          h_('GE-razon-invertida', 3 / 2, 'Pusiste la razón al revés (cono entre esfera).'),
          h_('GE19', 8 / 3, 'Usaste el diámetro de la esfera como si fuera su radio.'),
        ],
        total: [
          h_('GE-inscrita-area-lateral', 2 / 3, 'Dividiste entre el área lateral. Se pide el área total del cono, que incluye la base.'),
          h_('GE-inscrita-radio-mitad', 1 / 3, 'Tomaste el radio de la esfera como la mitad del radio de la base. Es R/√3.'),
          h_('GE-razon-invertida', 9 / 4, 'Pusiste la razón al revés (cono entre esfera).'),
          h_('GE19', 16 / 9, 'Usaste el diámetro de la esfera como si fuera su radio.'),
        ],
        volumen: [
          h_('GE-razon-invertida', 9 / 4, 'Pusiste la razón al revés (cono entre esfera).'),
          h_('GE-esfera-sin-cuatro-tercios', 1 / 3, 'Usaste πr³ para la esfera: su volumen es (4/3)πr³.'),
          h_('GE-inscrita-area-lateral', 2 / 3, 'Esa es la razón entre el área de la esfera y el área lateral del cono. Se piden volúmenes.'),
          h_('GE-inscrita-mitad', 1 / 2, 'Supusiste que la esfera llena la mitad del cono. Hay que calcular los dos volúmenes.'),
        ],
      }[pide];
      const solucion = [
        ['Corta por el eje: queda un triángulo equilátero de lado 2R, y la esfera se ve como su círculo inscrito.'],
        ['El inradio del equilátero es un tercio de su altura: ', v('r', 'r = (R√3)/3 = R/√3'), ', y la altura del cono es R√3 = 3r.'],
        pide === 'volumen'
          ? ['Esfera: (4/3)πr³. Cono: π(3r²)(3r)/3 = 3πr³. Razón: (4/3)/3 = ', v('X', '4/9'), '.']
          : pide === 'lateral'
            ? ['Esfera: 4πr² = 4πR²/3. Lateral del cono: πR·', v('g', '2R'), ' = 2πR². Razón: ', v('X', '2/3'), '.']
            : ['Esfera: 4πR²/3. Total del cono: 2πR² + πR² = 3πR². Razón: ', v('X', '4/9'), '.'],
      ];
      return { forma: 'q', unidad: '', correcta, errores, variables, solucion, enunciado, pregunta: [`¿Cuál es la razón entre ${que}?`], datos: { sub, equilatero: true, pide } };
    }
    const [R, H] = rng.elegir(sub === 'radio' ? [[6, 8], [12, 16], [18, 24], [12, 9], [24, 18], [15, 36], [30, 72], [60, 25], [3, 4], [9, 12], [5, 12], [15, 20]] : [[3, 4], [6, 8], [9, 12], [12, 16], [12, 9], [24, 18], [15, 36], [15, 20]]);
    const equi = sub === 'liquido' && rng.entero(1, 3) === 1;
    const g = Math.hypot(R, H);
    const variables = { R: { nombre: 'radio del cono', color: 'o' }, H: { nombre: 'altura del cono', color: 'i' }, r: { nombre: 'radio de la esfera', color: 'h' }, X: { nombre: 'lo que se pide', color: 'd' } };
    if (sub === 'radio') {
      const r = calc.radioInscritoCono(R, H);
      const enunciado = ['Un cono recto tiene radio de base ', v('R', `${R} ${u}`), ' y altura ', v('H', `${H} ${u}`), '. Dentro hay una esfera tangente a la base y a la superficie lateral.'];
      const errores = [
        h_('GE-inscrita-baricentro', H / 3, 'Tomaste r = H/3, que solo vale en el cono equilátero (ahí el incentro coincide con el baricentro).'),
        h_('GE-inscrita-medio-triangulo', (R + H - g) / 2, 'Ese es el inradio del triángulo rectángulo de la mitad del corte (catetos R y H). La esfera es tangente a las dos generatrices: es el círculo inscrito en el triángulo isósceles completo.'),
        h_('GE-inscrita-radio-mitad', R / 2, 'Tomaste la mitad del radio de la base sin calcular.'),
        h_('GE-inscrita-altura-mitad', H / 2, 'Tomaste la mitad de la altura: la esfera no llega a la mitad, porque el cono se angosta.'),
      ];
      const solucion = [
        ['Corta por el eje: triángulo isósceles de base ', v('R', `2·${R}`), ', altura ', v('H', `${H}`), ` y lados g = √(${R * R} + ${H * H}) = ${g}.`],
        ['La esfera es su círculo inscrito: r = área/semiperímetro.'],
        [`Área = ${R}·${H} = ${R * H}; semiperímetro = ${R} + ${g} = ${R + g}; r = ${R * H}/${R + g} = `, v('r', tq(r, u)), '.'],
      ];
      return { forma: 'q', unidad: u, correcta: r, errores, variables, solucion, enunciado, pregunta: ['¿Cuál es el radio de la esfera?'], datos: { sub, R, H } };
    }
    // líquido
    let Rc = R, Hc = H, r;
    if (equi) { r = rng.entero(1, 5); Hc = 3 * r; Rc = r * Math.sqrt(3); }
    else r = calc.radioInscritoCono(R, H);
    const Vc = calc.cono(Rc, Hc), Ve = calc.esfera(r), L = Vc - Ve;
    const u3 = 'cm³';
    const enunciado = equi
      ? ['Un recipiente con forma de cono equilátero (la generatriz mide lo mismo que el diámetro de la base) se coloca con la punta hacia abajo; su altura es ', v('H', `${Hc} ${u}`), '. Dentro se pone una esfera tangente a la superficie lateral y a la tapa (el plano de la boca), y se llena de agua el espacio libre.']
      : ['Un recipiente cónico, con la punta hacia abajo, tiene en la boca un círculo de radio ', v('R', `${R} ${u}`), ' y su altura es ', v('H', `${H} ${u}`), '. Dentro se pone una esfera tangente a la superficie lateral y a la tapa (el plano de la boca), y se llena de agua el espacio libre.'];
    if (equi) delete variables.R;
    const errores = [
      h_('GE20', 3 * Vc - Ve, 'Calculaste el cono sin su 1/3.'),
      h_('GE-inscrita-pide-esfera', Ve, 'Ese es el volumen de la esfera; se pide el agua que la rodea.'),
      h_('GE-inscrita-olvida-esfera', Vc, 'Ese es el volumen del cono lleno: falta restar la esfera.'),
      equi ? h_('GE-inscrita-radio-mitad', Vc - calc.esfera(Hc / 2), 'Tomaste el radio de la esfera como la mitad de la altura. En el equilátero es un tercio de la altura.')
           : h_('GE-inscrita-baricentro', Vc - calc.esfera(H / 3), 'Tomaste r = H/3, que solo vale en el cono equilátero.'),
      h_('GE-inscrita-radio-mitad', Vc - calc.esfera(Rc / 2), 'Tomaste el radio de la esfera como la mitad del radio de la boca, sin calcularlo.'),
    ];
    const solucion = equi ? [
      ['En el corte por el eje se ve un triángulo equilátero; la esfera es su círculo inscrito, y su radio es un tercio de la altura: ', v('r', `r = ${r} ${u}`), '.'],
      [`Radio de la boca: R = r√3, así que R² = ${3 * r * r}. Cono: π·${3 * r * r}·${Hc}/3 = ${tpi(Vc)}.`],
      [`Esfera: (4/3)π·${r}³ = ${tpi(Ve)}.`],
      ['Agua: ', v('X', tpi(L, u3)), '.'],
    ] : [
      [`Corte por el eje: triángulo isósceles de base ${2 * R}, altura ${H} y lados g = ${g}; la esfera es su círculo inscrito.`],
      [`r = área/semiperímetro = ${R * H}/${R + g} = `, v('r', tq(r, u)), '.'],
      ['Cono: π·', v('R', `${R}`), '²·', v('H', `${H}`), `/3 = ${tpi(Vc)}. Esfera: (4/3)π·r³ = ${tpi(Ve)}.`],
      ['Agua: ', v('X', tpi(L, u3)), '.'],
    ];
    return { forma: 'pi', unidad: u3, correcta: L, errores, variables, solucion, enunciado, pregunta: ['¿Qué volumen de agua cabe?'], datos: equi ? { sub, equilatero: true, H: Hc } : { sub, equilatero: false, R, H } };
  }

  // ---------- Esferas tangentes ----------
  function esferasTangentes(rng, sub) {
    const u = 'cm';
    if (sub === 'tres') {
      const r = rng.entero(1, 10), dato = rng.elegir(['perimetro', 'area', 'lado']);
      const valor = dato === 'perimetro' ? 6 * r : dato === 'area' ? r * r : r;
      const [cosas, cosa] = rng.elegir([['pelotas', 'pelota'], ['naranjas', 'naranja'], ['canicas', 'canica'], ['esferas de vidrio', 'esfera']]);
      const k3 = valor === 1 ? '√3' : `${valor}√3`;
      const datoTxt = dato === 'perimetro' ? `${valor} ${u} de perímetro` : dato === 'area' ? `${k3} ${u}² de área` : `altura ${k3} ${u}`;
      const A = calc.areaEsfera(r);
      const variables = { T: { nombre: 'triángulo de los centros', color: 'o' }, l: { nombre: 'lado = 2r', color: 'i' }, r: { nombre: 'radio', color: 'h' }, A: { nombre: 'área de una esfera', color: 'd' } };
      const enunciado = [`Tres ${cosas} iguales están sobre una mesa, cada una tocando a las otras dos (se suponen esferas perfectas). Los centros forman un triángulo de `, v('T', datoTxt), '.'];
      const errores = [
        h_('GE19', calc.areaEsfera(2 * r), 'Tomaste el lado del triángulo como el radio. Dos esferas que se tocan tienen sus centros a r + r = 2r: el lado es el diámetro.'),
        h_('GE-esfera-area-circulo', PI * r * r, 'Usaste πr², que es el área de un círculo. El área de la esfera es 4πr².'),
        h_('GE-esferas-las-tres', 3 * A, `Sumaste las tres ${cosas}; se pide el área de una.`),
        h_('GE-esfera-area-mitad', 2 * PI * r * r, 'Usaste 2πr²: esa es media esfera. El área completa es 4πr².'),
      ];
      const solucion = [
        ['Dos esferas tangentes tienen sus centros a r + r: ', v('l', 'el lado del triángulo es 2r'), ', y el triángulo es equilátero.'],
        dato === 'perimetro' ? ['Perímetro: 3·2r = ', v('T', `${valor}`), ' → ', v('r', `r = ${r} ${u}`), '.']
          : dato === 'area' ? ['Área del equilátero de lado 2r: (2r)²√3/4 = r²√3 = ', v('T', k3), ' → ', v('r', `r = ${r} ${u}`), '.']
            : ['Altura del equilátero de lado 2r: 2r·√3/2 = r√3 = ', v('T', k3), ' → ', v('r', `r = ${r} ${u}`), '.'],
        [`Área de una ${cosa}: 4π·${r}² = `, v('A', tpi(A, u + '²')), '.'],
      ];
      return { forma: 'pi', unidad: u + '²', correcta: A, errores, variables, solucion, enunciado, pregunta: [`¿Cuál es el área de la superficie de una ${cosa}?`], datos: { sub, dato, valor } };
    }
    const R = rng.entero(2, 12), r = rng.entero(1, R - 1);
    const D = calc.distanciaContactos(R, r);
    const variables = { R: { nombre: 'radio mayor', color: 'o' }, r: { nombre: 'radio menor', color: 'i' }, D: { nombre: 'distancia en el piso', color: 'd' } };
    const enunciado = ['Dos esferas de radios ', v('R', `${R} ${u}`), ' y ', v('r', `${r} ${u}`), ' están apoyadas en un piso horizontal y se tocan entre sí.'];
    const errores = [
      h_('GE-tangentes-hipotenusa', R + r, `R + r = ${R + r} es la distancia entre los centros (la hipotenusa). En el piso se mide el cateto horizontal.`),
      h_('GE-tangentes-diferencia', R - r, 'R − r es la diferencia de alturas de los centros (el otro cateto), no la distancia en el piso.'),
      h_('GE-tangentes-sin-dos', Math.sqrt(R * r), 'Te faltó el factor 2: (R + r)² − (R − r)² = 4Rr, y su raíz es 2√(Rr).'),
      h_('GE-tangentes-pitagoras-radios', Math.hypot(R, r), 'Usaste √(R² + r²), como si los radios fueran los catetos. Los catetos son R − r (vertical) y la distancia buscada.'),
    ];
    const solucion = [
      ['Los centros están a la altura de su radio, sobre los puntos de contacto con el piso. La recta entre centros mide ', v('R', `${R}`), ' + ', v('r', `${r}`), ` = ${R + r}.`],
      [`Triángulo rectángulo: hipotenusa ${R + r}, cateto vertical ${R} − ${r} = ${R - r} y cateto horizontal D.`],
      [`D² = ${(R + r) ** 2} − ${(R - r) ** 2} = ${4 * R * r} → D = `, v('D', `${P.radical(D)} ${u}`), '.'],
    ];
    return { forma: 'rad', unidad: u, correcta: D, errores, variables, solucion, enunciado, pregunta: ['¿A qué distancia están los dos puntos donde las esferas tocan el piso?'], datos: { sub, R, r } };
  }

  // ---------- Tronco de cilindro ----------
  function troncoCilindro(rng, sub) {
    const u = 'cm', u3 = 'cm³';
    const r = rng.entero(2, 8);
    const variables = { r: { nombre: 'radio', color: 'o' }, g: { nombre: 'generatrices', color: 'i' }, A: { nombre: 'área lateral', color: 'h' }, V: { nombre: 'volumen', color: 'd' } };
    if (sub === 'generatrices') {
      const g1 = rng.entero(3, 12), g2 = g1 + rng.entero(1, 8);
      const V = calc.troncoCilindro(r, g1, g2);
      delete variables.A;
      const enunciado = ['Un tacho cilíndrico de radio ', v('r', `${r} ${u}`), ' tiene la tapa de arriba cortada en forma oblicua: su altura es ', v('g', `${g1} ${u}`), ' en el punto más bajo del borde y ', v('g', `${g2} ${u}`), ' en el más alto.'];
      const errores = [
        h_('GE-tronco-cil-generatriz-mayor', calc.cilindro(r, g2), 'Usaste la generatriz mayor como altura: así cuentas un cilindro más alto que el tacho.'),
        h_('GE-tronco-cil-generatriz-menor', calc.cilindro(r, g1), 'Usaste la generatriz menor: dejas fuera la cuña de arriba.'),
        h_('GE-tronco-cil-suma', calc.cilindro(r, g1 + g2), 'Sumaste las dos generatrices sin dividir entre 2. La altura promedio (el eje) es su semisuma.'),
        h_('GE-tronco-cil-cuna-cono', PI * r * r * (g1 + (g2 - g1) / 3), 'Partiste el tacho en un cilindro de altura g₁ y una cuña encima, y a la cuña le pusiste 1/3 como a un cono. La cuña es la mitad de un cilindro de altura g₂ − g₁: lleva 1/2.'),
      ];
      const solucion = [
        ['Dos troncos iguales, uno invertido sobre el otro, forman un cilindro de altura g₁ + g₂: el tronco es la mitad.'],
        ['Eje (generatriz media) = (', v('g', `${g1}`), ' + ', v('g', `${g2}`), `)/2 = ${f((g1 + g2) / 2)} ${u}.`],
        ['V = π·', v('r', `${r}`), `²·${f((g1 + g2) / 2)} = `, v('V', tpi(V, u3)), '.'],
      ];
      return { forma: 'pi', unidad: u3, correcta: V, errores, variables, solucion, enunciado, pregunta: ['¿Cuál es la capacidad del tacho?'], datos: { sub, r, g1, g2 } };
    }
    const e = rng.entero(3, 12), ALpi = 2 * r * e, V = calc.cilindro(r, e);
    delete variables.g;
    const enunciado = ['Un tacho tiene forma de tronco de cilindro recto (un cilindro cortado arriba por un plano oblicuo) de radio ', v('r', `${r} ${u}`), '. Para forrar su superficie lateral se usaron ', v('A', tpi(PI * ALpi, 'cm²')), ' de papel.'];
    const errores = [
      h_('GE-tronco-cil-lateral-sin-dos', 2 * V, 'Usaste AL = πr·(eje). El área lateral es la circunferencia por el eje: 2πr·eje.'),
      h_('GE-tronco-cil-suma', V / 2, 'Tomaste AL = 2πr(g₁ + g₂) y te salió la mitad del eje. AL = πr(g₁ + g₂) = 2πr·eje.'),
      h_('GE19', PI * ALpi, `Dividiste el área entre πr² (el área de la base) para hallar la altura. Hay que dividir entre la circunferencia 2πr.`),
      h_('GE-tercio-de-mas', V / 3, 'Pusiste un 1/3: el tronco de cilindro no tiene punta como el cono.'),
    ];
    const solucion = [
      ['El área lateral es la circunferencia por la generatriz media (el eje): AL = 2πr·eje.'],
      ['2π·', v('r', `${r}`), '·eje = ', v('A', tpi(PI * ALpi)), ` → eje = ${e} ${u}.`],
      ['V = πr²·eje = π·', `${r * r}·${e} = `, v('V', tpi(V, u3)), '.'],
    ];
    return { forma: 'pi', unidad: u3, correcta: V, errores, variables, solucion, enunciado, pregunta: ['¿Cuál es su volumen?'], datos: { sub, r, ALpi } };
  }

  // ---------- Cilindro oblicuo ----------
  function cilindroOblicuo(rng, sub) {
    const u = 'cm';
    const t = rng.elegir([37, 53, 30]), [sn, sd] = SEN[t];
    const r = rng.entero(1, 6), g = sd * rng.entero(1, 4);
    const variables = { r: { nombre: 'radio de la sección recta', color: 'o' }, S: { nombre: 'área de la base', color: 'i' }, g: { nombre: 'generatriz', color: 'h' }, X: { nombre: 'lo que se pide', color: 'd' } };
    if (sub === 'altura') {
      const Sbpi = r * r * sd / sn, SbQ = racional(Sbpi);
      const hh = g * sn / sd;
      if (!SbQ) return null;
      const enunciado = ['Un tronco de madera es un cilindro recto de radio ', v('r', `${r} ${u}`), '. Se corta con dos planos paralelos entre sí e inclinados respecto del eje, y queda un cilindro oblicuo: cada base es una elipse de ', v('S', `${tpi(PI * Sbpi)} ${u}²`), ' de área y cada generatriz (el borde recto entre las bases) mide ', v('g', `${g} ${u}`), '.'];
      const errores = [
        h_('GE-oblicuo-altura-generatriz', g, 'Tomaste la generatriz como altura. En el cilindro oblicuo la generatriz está inclinada: la altura es la distancia entre los planos de las bases, y es menor.'),
        h_('GE-oblicuo-razon-invertida', g * sd / sn, 'Pusiste la razón de áreas al revés: la base elíptica es más grande que la sección recta, así que la altura es menor que la generatriz.'),
        h_('GE-oblicuo-base-por-recta', g * sn * sn / (sd * sd), 'Aplicaste dos veces la razón de áreas. Basta una: V = (sección recta)·g = (base)·h.'),
      ];
      const solucion = [
        ['El volumen se puede calcular de dos maneras: sección recta por generatriz, o base por altura.'],
        ['Sección recta: π·', v('r', `${r}`), `² = ${tpi(PI * r * r)}. V = ${tpi(PI * r * r)}·`, v('g', `${g}`), ` = ${tpi(PI * r * r * g)}.`],
        ['h = V ÷ base = ', `${tpi(PI * r * r * g)} ÷ `, v('S', tpi(PI * Sbpi)), ' = ', v('X', tq(hh, u)), '.'],
      ];
      return { forma: 'q', unidad: u, correcta: hh, errores, variables, solucion, enunciado, pregunta: ['¿Cuál es la altura del cilindro oblicuo?'], datos: { sub, r, g, Sbpi: SbQ } };
    }
    const V = calc.cilindro(r, g);
    delete variables.S;
    variables.t = { nombre: 'inclinación', color: 'i' };
    const enunciado = ['En un cilindro oblicuo, la sección perpendicular a las generatrices (sección recta) es un círculo de radio ', v('r', `${r} ${u}`), '. Las generatrices miden ', v('g', `${g} ${u}`), ' y forman ', v('t', `${t}°`), ' con el plano de la base.'];
    const errores = [
      h_('GE-oblicuo-base-por-generatriz', V * sd / sn, 'Multiplicaste el área de la base elíptica por la generatriz. La base va con la altura; la generatriz va con la sección recta.'),
      h_('GE-oblicuo-recta-por-altura', V * sn / sd, 'Multiplicaste la sección recta por la altura. La sección recta va con la generatriz: V = πr²·g.'),
      h_('GE-tercio-de-mas', V / 3, 'Pusiste un 1/3: un cilindro, aunque esté inclinado, no es un cono.'),
      h_('GE-oblicuo-coseno', t === 30 ? NaN : V * (COS[t][0] / COS[t][1]), 'Multiplicaste por el coseno: no hace falta ningún ángulo si se usa la sección recta con la generatriz.'),
    ];
    const solucion = [
      ['Volumen de un cilindro oblicuo: (sección recta)·(generatriz) = (base)·(altura).'],
      ['Con la sección recta: V = π·', v('r', `${r}`), '²·', v('g', `${g}`), ' = ', v('X', tpi(V, u + '³')), '.'],
      ['El ángulo de ', v('t', `${t}°`), ' no hace falta por este camino.'],
    ];
    return { forma: 'pi', unidad: u + '³', correcta: V, errores, variables, solucion, enunciado, pregunta: ['¿Cuál es el volumen del cilindro?'], datos: { sub, r, g, theta: t } };
  }

  const HACER = {
    'tronco-volumen': troncoVolumen, 'tronco-area': troncoArea, 'tronco-llenado': troncoLlenado,
    desplazamiento, 'region-gira': regionGira, 'esfera-segmento': esferaSegmento, 'esfera-cono': esferaCono,
    'esferas-tangentes': esferasTangentes, 'tronco-cilindro': troncoCilindro, 'cilindro-oblicuo': cilindroOblicuo,
  };

  return { id: 'geo-revolucion', titulo: 'Sólidos de revolución: troncos, regiones que giran y esferas', generar, calc, TIPOS };
});
