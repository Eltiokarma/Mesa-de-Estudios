/*
 * Motor de «Los cubitos que giran: vistas y huecos» (razonamiento matemático: cubos, sólidos y vistas).
 *
 * Aquí vive toda la matemática de la plantilla (regla 1 de CLAUDE.md). No toca el DOM: funciona igual en el navegador
 * (window.MotorVistas) y en Node (require('./motor.js')), donde lo prueban casos.json y papel.json.
 *
 * EJES Y FORMATO DE UN SÓLIDO DE CUBITOS
 *   x crece hacia la derecha, y hacia el FONDO (la fila y = 0 es la del frente) y z hacia arriba (z = 0 apoya en la mesa).
 *   El cubito (x, y, z) ocupa [x, x + 1] × [y, y + 1] × [z, z + 1] (cubitos de arista 1).
 *   pisos = lista de pisos, de abajo (pisos[0], el que toca la mesa) hacia arriba. Cada piso es una lista de textos, una
 *   por fila, COMO SE VE DESDE ARRIBA: el primer texto es la fila del fondo (y mayor) y el último la del frente (y = 0);
 *   en cada texto, el carácter j es la columna x = j ('#' = hay cubito, '.' = no hay).
 *   Ejemplo: [["##", "#."]] es un piso con cubitos en (0, 0), (0, 1) y (1, 1).
 *   dims = [nx, ny, nz]: columnas, filas y pisos de la caja que envuelve al sólido según los textos.
 *
 * LAS TRES VISTAS (listas de textos, cada texto es una fila de cuadraditos tal como se dibuja, de arriba abajo)
 *   frontal   mirando desde el frente (desde y negativo): filas de z = nz − 1 (arriba) a z = 0; columnas x = 0 … nx − 1.
 *   superior  mirando desde arriba: filas de y = ny − 1 (el fondo, arriba en el dibujo) a y = 0 (el frente); columnas x.
 *   lateral   mirando desde la DERECHA (desde x grande): filas de z = nz − 1 a z = 0; columnas y = 0 (el frente, a la
 *             izquierda del dibujo) … ny − 1 (el fondo, a la derecha).
 *   Un cuadradito de una vista es '#' si al menos un cubito queda en esa línea de mirada.
 *   area(vista) = cuántos '#' tiene.
 *
 * CARAS, ARISTAS Y VÉRTICES DE UN SÓLIDO DE CUBITOS (el poliedro que forman los cubitos pegados)
 *   Cuadradito de la superficie: una cara de un cubito que no está pegada a otro cubito (incluye las de abajo).
 *   CARA del poliedro: región plana MAXIMAL de la superficie = cuadraditos con la misma dirección hacia afuera, en el
 *   mismo plano y unidos por un lado (dos que solo se tocan en una esquina son caras distintas).
 *   VÉRTICE: punto de la cuadrícula donde la superficie no es plana ni una arista recta (los 8 cubitos que lo rodean no
 *   se repiten al correrse a lo largo de ningún eje). ARISTA: tramo recto entre dos vértices donde se juntan dos caras.
 *   Para un sólido de una pieza y sin túneles se cumple Euler: V − A + C = 2.
 *
 * FUNCIONES (todas devuelven objetos con números, textos o listas; los campos anidados se leen con punto)
 *   vistas(pisos) → { frontal, superior, lateral, dims, areas:{ frontal, superior, lateral } }.
 *   analizar(pisos, medidas?) → { volumen, dims, caja (nx·ny·nz), caras, aristas, vertices, euler (V − A + C),
 *        cuadraditos (cuadraditos de la superficie), base (cuadraditos apoyados en la mesa), area (área de la superficie con
 *        las medidas), carasEnVistas (caras que miran al frente, arriba o a la derecha: las que aparecen en las tres vistas),
 *        visibles (cubitos que se ven, al menos en parte, desde la esquina de adelante, derecha y arriba: dirección
 *        (1, −1, 1)), ocultos (volumen − visibles), vistas, listaCaras:[{ normal:[dx,dy,dz], cuadros:[[x,y,z, eje]] }] }.
 *        medidas (opcional) = { x:[anchos], y:[fondos], z:[altos] }: cada columna, fila o piso mide lo que diga la lista
 *        (vistas acotadas). Cambia volumen y area; caras, aristas y vértices no cambian.
 *   maximo(frontal, superior, lateral, medidas?) → el sólido de VOLUMEN MÁXIMO con esas tres vistas: un cubito (x, y, z)
 *        está si su cuadradito está pintado en las tres vistas (intersección de las tres extrusiones).
 *        { pisos, volumen (con medidas, si las hay), cubitos (cuántos), coincide (true si sus tres vistas son las dadas;
 *        false: las vistas no son de ningún sólido), caras, aristas, vertices, euler, cuadraditos, carasEnVistas, dims,
 *        errores:{ soloFrontal (cuadraditos de la frontal), soloSuperior, sumaVistas (los de las tres vistas sumados),
 *        caja (nx·ny·nz; con medidas, el volumen de la caja: suma de x · suma de y · suma de z), minimo (el volumen
 *        mínimo, si las vistas lo permiten), caraCuadraditos (= cuadraditos),
 *        caraVistas (= carasEnVistas), prismaFrontal y verticesPrismaFrontal (caras y vértices del prisma que sale de
 *        la vista frontal sola, de fondo ny), puntosEnAristas (puntos de la cuadrícula que están sobre las aristas,
 *        contando los vértices), cajaCaras: 6, cajaVertices: 8 } }.
 *   minimo(frontal, superior, lateral) → el MENOR número de cubitos APILADOS (cada cubito sobre la mesa o sobre otro) que
 *        da esas tres vistas. Pide que cada columna de la frontal y de la lateral esté llena desde abajo.
 *        Se calcula por niveles: cada cuadradito de la superior lleva al menos 1 cubito; para cada altura v ≥ 2, las
 *        columnas de la frontal con altura v y las filas de la lateral con altura v se cubren con torres de v cubitos,
 *        y una torre en un cuadradito de la superior que es a la vez de las dos sirve para ambas (pareo máximo):
 *        mínimo = área superior + Σ_v (v − 1)(columnas_v + filas_v − pareo_v).
 *        { volumen, pisos (un sólido mínimo), maximo (cubitos del máximo), alturas:[[...]] (filas como la superior),
 *        errores:{ unoPorCuadro (= área de la superior), maximo, soloFrontal } }.
 *   elegirVista(pisos, cual) cual = 'superior' | 'frontal' | 'lateral' → { correcta (la vista pedida), errores:{
 *        frontal, superior, lateral (las otras vistas), reflejada (la pedida leída al revés: en la superior se invierte el
 *        orden de las filas, de modo que el frente queda arriba y el fondo abajo; en la frontal y en la lateral se invierte
 *        cada fila, izquierda por derecha: la frontal desde atrás, la lateral desde la izquierda) } }, cada vista como
 *        lista de textos.
 *   completarCubo(pisos) → { n (arista del cubo compacto más pequeño = la mayor de nx, ny, nz), cubo (n³), volumen,
 *        faltan (n³ − volumen), visibles, errores:{ soloVisibles (n³ − visibles), caja (nx·ny·nz − volumen),
 *        deFrente (n³ − área frontal) } }.
 *   completarCaja(pisos, [a, b, c]) → caja transparente de a columnas, b filas y c pisos: { caja (a·b·c), volumen,
 *        faltan, visibles, errores:{ deFrente (caja − área de la frontal), soloVisibles (caja − visibles),
 *        deArriba (caja − área de la superior) } }.
 *   copiasCubo(pisos) → el cubo compacto más pequeño que se arma con copias iguales de la pieza (se pueden girar):
 *        { volumen (de la pieza), n, copias (n³ / volumen), adicionales (cubitos que se agregan a la pieza: n³ − volumen),
 *        colocaciones (una forma de armarlo: lista de copias, cada una lista de [x, y, z]), errores:{ sinDividir
 *        (n₀³ − volumen con n₀ = la mayor medida de la pieza, sin ver si se puede), copiasEnVezDeCubitos (= copias − 1),
 *        todoElCubo (n³) } }. Busca n desde la mayor medida de la pieza hasta 6; en cada n con n³ múltiplo del volumen
 *        prueba armarlo (búsqueda exhaustiva con las 24 maneras de girar la pieza).
 *   cubrir(pisos, k) → sucesión: el término 1 es el sólido dado; el término t + 1 se forma tapando con un cubito cada cara
 *        al aire del término t, menos las que se apoyan en la mesa (un cubito que toca dos caras las tapa a las dos).
 *        Devuelve el término k: { volumen, agregados (cubitos que se agregaron para formarlo, 0 si k = 1), pisos,
 *        terminos:[volúmenes de los términos 1 … k], errores:{ porCara (un cubito por cada cara al aire del término
 *        k − 1, sin las de la mesa), conMesa (también se tapa la cara de abajo: un cubito bajo cada una), mismoAumento
 *        (lo que se agregó en el paso anterior; 0 si k ≤ 2) } }.
 *   poliedroVistas({ frontal, superior, lateral }) → el sólido de volumen máximo con tres vistas CONVEXAS dadas como
 *        polígonos: frontal = [[x, z], …], superior = [[x, y], …], lateral = [[y, z], …] (vértices en orden, sin repetir
 *        el primero; mismos ejes que arriba). Es la intersección de los tres prismas que salen de las vistas: un poliedro
 *        convexo. Sus vértices son los puntos donde se cortan tres planos de los prismas y que cumplen todas las
 *        desigualdades; sus caras, los planos con tres vértices o más no alineados; sus aristas, los pares de vértices
 *        con dos caras en común.
 *        { caras, vertices, aristas, euler, volumen, listaVertices:[[x,y,z]], listaCaras:[{ normal, vertices:[índices en
 *        orden] }], listaAristas:[[i, j]], errores:{ prismaFrontal (caras del prisma de la vista frontal sola, estirada
 *        en y desde el menor hasta el mayor y de la superior y la lateral), verticesPrismaFrontal (sus vértices), carasEnVistas (caras que miran al frente, arriba o a la derecha), regionesVistas (regiones
 *        que se ven en las tres vistas sumadas: una cara inclinada que mira al frente y arriba sale en dos vistas),
 *        esquinasVistas (las esquinas de los tres polígonos sumadas),
 *        cajaCaras: 6, cajaVertices: 8 } }.
 *   interseccion({ frontal?, superior?, lateral? }, [[x0, x1], [y0, y1], [z0, z1]]) → el mismo poliedro con solo las vistas
 *        dadas, recortado por la caja (sirve para dibujar el prisma de una sola vista). Mismos campos sin errores.
 *   volumenCaja(medidas) suma útil: { x, y, z } → { largo, fondo, alto (sumas de cada lista), volumen (su producto) }.
 */
(function (raiz, fabrica) {
  const M = fabrica();
  if (typeof module === 'object' && module.exports) module.exports = M;
  else raiz.MotorVistas = M;
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';
  const EPS = 1e-9;
  const clave = (x, y, z) => x + ',' + y + ',' + z;
  const DIRS = [[1, 0, 0], [-1, 0, 0], [0, 1, 0], [0, -1, 0], [0, 0, 1], [0, 0, -1]];

  // ---------- lectura y escritura ----------
  function leer(pisos) {
    if (!Array.isArray(pisos) || !pisos.length) throw new Error('pisos debe ser una lista de pisos');
    const ny = Math.max(...pisos.map(p => p.length));
    const nx = Math.max(...pisos.map(p => Math.max(0, ...p.map(f => f.length))));
    const nz = pisos.length;
    const celdas = [];
    pisos.forEach((piso, z) => piso.forEach((fila, r) => {
      const y = piso.length - 1 - r;
      for (let x = 0; x < fila.length; x++) {
        const ch = fila[x];
        if (ch === '#') celdas.push([x, y, z]);
        else if (ch !== '.') throw new Error('carácter no válido: ' + ch);
      }
    }));
    return { celdas, dims: [nx, ny, nz] };
  }
  function conjunto(celdas) { const s = new Set(); for (const [x, y, z] of celdas) s.add(clave(x, y, z)); return s; }
  function cajaDe(celdas) {
    const mn = [Infinity, Infinity, Infinity], mx = [-Infinity, -Infinity, -Infinity];
    for (const c of celdas) for (let k = 0; k < 3; k++) { mn[k] = Math.min(mn[k], c[k]); mx[k] = Math.max(mx[k], c[k]); }
    return { mn, mx };
  }
  // celdas → pisos (normalizando a la esquina 0, 0, 0 salvo z, que se toma desde 0 si zDesde0)
  function aPisos(celdas, dims) {
    let mn = [0, 0, 0], d = dims;
    if (!d) { const b = cajaDe(celdas); mn = [b.mn[0], b.mn[1], 0]; d = [b.mx[0] - mn[0] + 1, b.mx[1] - mn[1] + 1, b.mx[2] + 1]; }
    const s = conjunto(celdas.map(([x, y, z]) => [x - mn[0], y - mn[1], z]));
    const pisos = [];
    for (let z = 0; z < d[2]; z++) {
      const piso = [];
      for (let y = d[1] - 1; y >= 0; y--) { let f = ''; for (let x = 0; x < d[0]; x++) f += s.has(clave(x, y, z)) ? '#' : '.'; piso.push(f); }
      pisos.push(piso);
    }
    return pisos;
  }

  // ---------- vistas ----------
  function vistasDe(celdas, dims) {
    const [nx, ny, nz] = dims, s = conjunto(celdas);
    const hay = (x, y, z) => s.has(clave(x, y, z));
    const frontal = [], superior = [], lateral = [];
    for (let z = nz - 1; z >= 0; z--) { let f = ''; for (let x = 0; x < nx; x++) { let a = false; for (let y = 0; y < ny && !a; y++) a = hay(x, y, z); f += a ? '#' : '.'; } frontal.push(f); }
    for (let y = ny - 1; y >= 0; y--) { let f = ''; for (let x = 0; x < nx; x++) { let a = false; for (let z = 0; z < nz && !a; z++) a = hay(x, y, z); f += a ? '#' : '.'; } superior.push(f); }
    for (let z = nz - 1; z >= 0; z--) { let f = ''; for (let y = 0; y < ny; y++) { let a = false; for (let x = 0; x < nx && !a; x++) a = hay(x, y, z); f += a ? '#' : '.'; } lateral.push(f); }
    return { frontal, superior, lateral };
  }
  const area = v => v.reduce((s, f) => s + [...f].filter(c => c === '#').length, 0);
  function vistas(pisos) {
    const { celdas, dims } = leer(pisos), v = vistasDe(celdas, dims);
    return Object.assign(v, { dims, areas: { frontal: area(v.frontal), superior: area(v.superior), lateral: area(v.lateral) } });
  }
  const pintada = (v, fila, col) => (v[fila] || '')[col] === '#';

  // ---------- caras, aristas y vértices ----------
  function cuadrosSuperficie(s, celdas) {
    const out = [];
    for (const [x, y, z] of celdas) DIRS.forEach((d, k) => { if (!s.has(clave(x + d[0], y + d[1], z + d[2]))) out.push({ c: [x, y, z], d, k }); });
    return out;
  }
  function carasDe(s, celdas) {
    const q = cuadrosSuperficie(s, celdas), idx = new Map();
    q.forEach((c, i) => idx.set(c.k + '|' + clave(...c.c), i));
    const padre = q.map((_, i) => i);
    const raizDe = i => { while (padre[i] !== i) { padre[i] = padre[padre[i]]; i = padre[i]; } return i; };
    q.forEach((c, i) => {
      const eje = c.d.findIndex(v => v !== 0);
      for (let e = 0; e < 3; e++) if (e !== eje) for (const sg of [-1, 1]) {
        const n = c.c.slice(); n[e] += sg;
        const j = idx.get(c.k + '|' + clave(...n));
        if (j !== undefined) { const a = raizDe(i), b = raizDe(j); if (a !== b) padre[a] = b; }
      }
    });
    const grupos = new Map();
    q.forEach((c, i) => { const r = raizDe(i); if (!grupos.has(r)) grupos.set(r, { normal: c.d, cuadros: [] }); grupos.get(r).cuadros.push(c.c.concat([c.k])); });
    return { cuadros: q, caras: [...grupos.values()] };
  }
  function esquinas(s, celdas) {
    const pts = new Set();
    for (const [x, y, z] of celdas) for (let a = 0; a < 2; a++) for (let b = 0; b < 2; b++) for (let c = 0; c < 2; c++) pts.add(clave(x + a, y + b, z + c));
    return [...pts].map(k => k.split(',').map(Number));
  }
  function config(s, p) { // c[i][j][k] = cubito (p − 1 + i, …)
    const c = [];
    for (let i = 0; i < 2; i++) { c.push([]); for (let j = 0; j < 2; j++) { c[i].push([]); for (let k = 0; k < 2; k++) c[i][j].push(s.has(clave(p[0] - 1 + i, p[1] - 1 + j, p[2] - 1 + k))); } }
    return c;
  }
  function esVertice(s, p) {
    const c = config(s, p);
    const inv = [
      (j, k) => c[0][j][k] === c[1][j][k],
      (i, k) => c[i][0][k] === c[i][1][k],
      (i, j) => c[i][j][0] === c[i][j][1]];
    for (const f of inv) { let ok = true; for (let a = 0; a < 2; a++) for (let b = 0; b < 2; b++) if (!f(a, b)) ok = false; if (ok) return false; }
    return true;
  }
  // ¿El tramo unidad que sale de p en el eje e es parte de una arista?
  function esTramo(s, p, e) {
    const o = [0, 1, 2].filter(k => k !== e), q = [];
    for (let i = 0; i < 2; i++) for (let j = 0; j < 2; j++) { const c = p.slice(); c[o[0]] += i - 1; c[o[1]] += j - 1; q.push(s.has(clave(...c))); }
    const [c00, c01, c10, c11] = q; // c[i][j]: i en o[0], j en o[1]
    const parteJ = c00 === c10 && c01 === c11, parteI = c00 === c01 && c10 === c11;
    return !(parteJ || parteI);
  }
  function topologia(s, celdas) {
    const pts = esquinas(s, celdas), sp = new Set(pts.map(p => clave(...p)));
    const verts = pts.filter(p => esVertice(s, p));
    const sv = new Set(verts.map(p => clave(...p)));
    let aristas = 0; const listaAristas = [], enAristas = new Set(sv);
    for (const p of pts) for (let e = 0; e < 3; e++) {
      if (!sv.has(clave(...p)) || !esTramo(s, p, e)) continue;
      // recorre hacia + e hasta el siguiente vértice
      const q = p.slice(); q[e]++;
      while (!sv.has(clave(...q)) && sp.has(clave(...q))) q[e]++;
      aristas++; listaAristas.push([p.slice(), q.slice()]);
      for (let t = p[e] + 1; t < q[e]; t++) { const r = p.slice(); r[e] = t; enAristas.add(clave(...r)); }
    }
    const { cuadros, caras } = carasDe(s, celdas);
    return { vertices: verts.length, listaVertices: verts, aristas, listaAristas, caras: caras.length, listaCaras: caras, cuadros, puntosEnAristas: enAristas.size };
  }

  // ---------- visibilidad desde (1, −1, 1) ----------
  const VISTA_ISO = [1, -1, 1];
  function rayoLibre(s, p, d, lim) {
    // recorrido exacto de celdas (Amanatides y Woo) desde p en la dirección d
    const cel = p.map(Math.floor), paso = d.map(v => (v > 0 ? 1 : v < 0 ? -1 : 0));
    const tMax = [0, 1, 2].map(k => (d[k] === 0 ? Infinity : ((d[k] > 0 ? cel[k] + 1 - p[k] : p[k] - cel[k]) / Math.abs(d[k]))));
    const tD = d.map(v => (v === 0 ? Infinity : 1 / Math.abs(v)));
    for (let n = 0; n < 4 * lim; n++) {
      if (s.has(clave(...cel))) return false;
      const k = tMax[0] <= tMax[1] && tMax[0] <= tMax[2] ? 0 : tMax[1] <= tMax[2] ? 1 : 2;
      cel[k] += paso[k]; tMax[k] += tD[k];
    }
    return true;
  }
  function visiblesDe(s, celdas, d) {
    d = d || VISTA_ISO;
    const b = cajaDe(celdas), lim = (b.mx[0] - b.mn[0]) + (b.mx[1] - b.mn[1]) + (b.mx[2] - b.mn[2]) + 6;
    const dirsVe = DIRS.filter(n => n[0] * d[0] + n[1] * d[1] + n[2] * d[2] > 0);
    let vis = 0; const lista = [];
    for (const c of celdas) {
      let ve = false;
      for (const n of dirsVe) {
        if (s.has(clave(c[0] + n[0], c[1] + n[1], c[2] + n[2]))) continue;
        const e = n.findIndex(v => v !== 0), o = [0, 1, 2].filter(k => k !== e);
        for (let i = 0; i < 5 && !ve; i++) for (let j = 0; j < 5 && !ve; j++) {
          const p = c.slice();
          p[e] = c[e] + (n[e] > 0 ? 1 + 1e-7 : -1e-7);
          p[o[0]] = c[o[0]] + 0.1 + 0.2 * i; p[o[1]] = c[o[1]] + 0.17 + 0.2 * j;
          if (rayoLibre(s, p, d, lim)) ve = true;
        }
        if (ve) break;
      }
      if (ve) { vis++; lista.push(c); }
    }
    return { visibles: vis, lista };
  }

  // ---------- medidas (vistas acotadas) ----------
  function medidasDe(medidas, dims) {
    const m = medidas || {};
    return [0, 1, 2].map(k => { const l = m['xyz'[k]]; const r = []; for (let i = 0; i < dims[k]; i++) r.push(l && l[i] !== undefined ? l[i] : 1); return r; });
  }

  function analizarCeldas(celdas, dims, medidas) {
    const s = conjunto(celdas), T = topologia(s, celdas), md = medidasDe(medidas, dims);
    let volumen = 0, areaS = 0, base = 0;
    for (const [x, y, z] of celdas) volumen += md[0][x] * md[1][y] * md[2][z];
    for (const q of T.cuadros) {
      const [x, y, z] = q.c, e = q.d.findIndex(v => v !== 0);
      const lados = [md[0][x], md[1][y], md[2][z]].filter((_, k) => k !== e);
      areaS += lados[0] * lados[1];
      if (q.d[2] === -1 && z === 0) base++;
    }
    const enVistas = T.listaCaras.filter(f => f.normal[1] === -1 || f.normal[2] === 1 || f.normal[0] === 1).length;
    const V = visiblesDe(s, celdas);
    return { volumen, cubitos: celdas.length, dims, caja: dims[0] * dims[1] * dims[2], caras: T.caras, aristas: T.aristas, vertices: T.vertices,
      euler: T.vertices - T.aristas + T.caras, puntosEnAristas: T.puntosEnAristas, cuadraditos: T.cuadros.length, base, area: areaS, carasEnVistas: enVistas,
      visibles: V.visibles, ocultos: celdas.length - V.visibles, listaVisibles: V.lista, vistas: vistasDe(celdas, dims),
      listaCaras: T.listaCaras, listaVertices: T.listaVertices, listaAristas: T.listaAristas };
  }
  function analizar(pisos, medidas) { const { celdas, dims } = leer(pisos); return analizarCeldas(celdas, dims, medidas); }

  // ---------- sólido máximo y mínimo ----------
  function dimsVistas(F, T, L) {
    const nx = Math.max(...F.map(f => f.length), ...T.map(f => f.length)), ny = Math.max(T.length, ...L.map(f => f.length)), nz = Math.max(F.length, L.length);
    if (F.length !== L.length) throw new Error('la frontal y la lateral deben tener la misma altura');
    if (T.length !== Math.max(...L.map(f => f.length))) throw new Error('la superior y la lateral deben tener el mismo fondo');
    if (Math.max(...F.map(f => f.length)) !== Math.max(...T.map(f => f.length))) throw new Error('la frontal y la superior deben tener el mismo ancho');
    return [nx, ny, nz];
  }
  function celdasMaximo(F, T, L) {
    const [nx, ny, nz] = dimsVistas(F, T, L), celdas = [];
    for (let z = 0; z < nz; z++) for (let y = 0; y < ny; y++) for (let x = 0; x < nx; x++)
      if (pintada(F, nz - 1 - z, x) && pintada(T, ny - 1 - y, x) && pintada(L, nz - 1 - z, y)) celdas.push([x, y, z]);
    return { celdas, dims: [nx, ny, nz] };
  }
  const igual = (a, b) => a.length === b.length && a.every((f, i) => f === b[i]);
  function alturasColumna(V) { // columnas de una vista (filas de arriba abajo): altura llena desde abajo
    const h = V.length, w = Math.max(...V.map(f => f.length)), out = [];
    for (let c = 0; c < w; c++) {
      let alto = 0; while (alto < h && pintada(V, h - 1 - alto, c)) alto++;
      for (let r = alto; r < h; r++) if (pintada(V, h - 1 - r, c)) throw new Error('una columna de la vista no está llena desde abajo: el mínimo apilado no está definido');
      out.push(alto);
    }
    return out;
  }
  function pareoMaximo(adj, nI) { // adj[i] = lista de j
    const dueño = new Map();
    const intentar = (i, vis) => { for (const j of adj[i]) { if (vis.has(j)) continue; vis.add(j); if (!dueño.has(j) || intentar(dueño.get(j), vis)) { dueño.set(j, i); return true; } } return false; };
    let m = 0; for (let i = 0; i < nI; i++) if (intentar(i, new Set())) m++;
    return { m, dueño };
  }
  function minimo(F, T, L) {
    const mx = celdasMaximo(F, T, L), [nx, ny, nz] = mx.dims;
    const vm = vistasDe(mx.celdas, mx.dims);
    if (!igual(vm.frontal, F) || !igual(vm.superior, T) || !igual(vm.lateral, L)) throw new Error('las tres vistas no son de ningún sólido');
    const hF = alturasColumna(F), hL = alturasColumna(L);
    const enT = (x, y) => pintada(T, ny - 1 - y, x);
    const h = []; for (let y = 0; y < ny; y++) { h.push([]); for (let x = 0; x < nx; x++) h[y].push(enT(x, y) ? 1 : 0); }
    let total = area(T);
    for (let v = 2; v <= nz; v++) {
      const X = [], Y = [];
      for (let x = 0; x < nx; x++) if (hF[x] === v) X.push(x);
      for (let y = 0; y < ny; y++) if (hL[y] === v) Y.push(y);
      const adj = X.map(x => Y.filter(y => enT(x, y)));
      const P = pareoMaximo(adj, X.length);
      total += (v - 1) * (X.length + Y.length - P.m);
      // arma una solución: torres en los pares, y una torre suelta para cada columna o fila sin par
      const conPar = new Set(), filaPar = new Set();
      for (const [y, i] of P.dueño) { h[y][X[i]] = v; conPar.add(X[i]); filaPar.add(y); }
      for (const x of X) if (!conPar.has(x)) { const y = [...Array(ny).keys()].find(y => enT(x, y) && hL[y] >= v); h[y][x] = v; }
      for (const y of Y) if (!filaPar.has(y)) { const x = [...Array(nx).keys()].find(x => enT(x, y) && hF[x] >= v); h[y][x] = v; }
    }
    const celdas = []; for (let y = 0; y < ny; y++) for (let x = 0; x < nx; x++) for (let z = 0; z < h[y][x]; z++) celdas.push([x, y, z]);
    return { volumen: total, cubitos: total, pisos: aPisos(celdas, mx.dims), alturas: h.slice().reverse(), maximo: mx.celdas.length,
      errores: { unoPorCuadro: area(T), maximo: mx.celdas.length, soloFrontal: area(F) } };
  }
  function maximo(F, T, L, medidas) {
    const mx = celdasMaximo(F, T, L), A = analizarCeldas(mx.celdas, mx.dims, medidas);
    const v = A.vistas, coincide = igual(v.frontal, F) && igual(v.superior, T) && igual(v.lateral, L);
    let mn = null; try { mn = minimo(F, T, L).volumen; } catch (e) { mn = null; }
    const [nx, ny, nz] = mx.dims, pf = [];
    for (let z = 0; z < nz; z++) for (let x = 0; x < nx; x++) if (pintada(F, nz - 1 - z, x)) for (let y = 0; y < ny; y++) pf.push([x, y, z]);
    const PF = topologia(conjunto(pf), pf);
    const md = medidasDe(medidas, mx.dims), cajaM = md[0].reduce((a, b) => a + b, 0) * md[1].reduce((a, b) => a + b, 0) * md[2].reduce((a, b) => a + b, 0);
    return Object.assign(A, { pisos: aPisos(mx.celdas, mx.dims), coincide,
      errores: { soloFrontal: area(F), soloSuperior: area(T), sumaVistas: area(F) + area(T) + area(L), caja: medidas ? cajaM : mx.dims[0] * mx.dims[1] * mx.dims[2],
        minimo: mn, caraCuadraditos: A.cuadraditos, caraVistas: A.carasEnVistas, prismaFrontal: PF.caras, verticesPrismaFrontal: PF.vertices,
        puntosEnAristas: A.puntosEnAristas, cajaCaras: 6, cajaVertices: 8 } });
  }

  // ---------- elegir una vista ----------
  function elegirVista(pisos, cual) {
    const v = vistas(pisos);
    if (!['superior', 'frontal', 'lateral'].includes(cual)) throw new Error('vista desconocida: ' + cual);
    const espejo = t => t.map(f => [...f].reverse().join(''));
    const reflejada = { superior: v.superior.slice().reverse(), frontal: espejo(v.frontal), lateral: espejo(v.lateral) }[cual];
    return { correcta: v[cual], errores: { frontal: v.frontal, superior: v.superior, lateral: v.lateral, reflejada } };
  }

  // ---------- completar ----------
  function completarCubo(pisos) {
    const { celdas, dims } = leer(pisos), s = conjunto(celdas), n = Math.max(...dims);
    const vis = visiblesDe(s, celdas).visibles, F = vistasDe(celdas, dims).frontal;
    return { n, cubo: n * n * n, volumen: celdas.length, faltan: n * n * n - celdas.length, visibles: vis,
      errores: { soloVisibles: n * n * n - vis, caja: dims[0] * dims[1] * dims[2] - celdas.length, deFrente: n * n * n - area(F) } };
  }
  function completarCaja(pisos, caja) {
    const { celdas } = leer(pisos), s = conjunto(celdas), [a, b, c] = caja;
    for (const [x, y, z] of celdas) if (x >= a || y >= b || z >= c) throw new Error('el sólido no cabe en la caja');
    const C = a * b * c, vis = visiblesDe(s, celdas).visibles, F = vistasDe(celdas, caja).frontal;
    const T = vistasDe(celdas, caja).superior;
    return { caja: C, volumen: celdas.length, faltan: C - celdas.length, visibles: vis, errores: { deFrente: C - area(F), soloVisibles: C - vis, deArriba: C - area(T) } };
  }

  // ---------- copias que arman un cubo ----------
  function rotaciones(celdas) {
    const giros = [];
    // las 24 rotaciones: permutaciones de ejes con signos y determinante +1
    const perms = [[0, 1, 2], [1, 2, 0], [2, 0, 1], [0, 2, 1], [2, 1, 0], [1, 0, 2]];
    perms.forEach((p, ip) => { for (let sx of [1, -1]) for (let sy of [1, -1]) for (let sz of [1, -1]) {
      const par = ip < 3 ? 1 : -1; if (par * sx * sy * sz !== 1) continue;
      giros.push(c => [sx * c[p[0]], sy * c[p[1]], sz * c[p[2]]]);
    } });
    const vistas = new Set(), out = [];
    for (const g of giros) {
      const r = celdas.map(g), b = cajaDe(r);
      const nr = r.map(c => [c[0] - b.mn[0], c[1] - b.mn[1], c[2] - b.mn[2]]).sort((a, b) => a[0] - b[0] || a[1] - b[1] || a[2] - b[2]);
      const k = nr.map(c => c.join(',')).join(';');
      if (!vistas.has(k)) { vistas.add(k); out.push(nr); }
    }
    return out;
  }
  function llenarCubo(formas, n) {
    const ocupado = new Set(), puestas = [], total = n * n * n, V = formas[0].length;
    const dentro = c => c.every(v => v >= 0 && v < n);
    const primero = () => { for (let z = 0; z < n; z++) for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) if (!ocupado.has(clave(x, y, z))) return [x, y, z]; return null; };
    let pasos = 0;
    const buscar = () => {
      if (ocupado.size === total) return true;
      if (++pasos > 2e6) throw new Error('búsqueda demasiado larga');
      const p = primero();
      for (const f of formas) for (const ancla of f) {
        const pos = f.map(c => [c[0] - ancla[0] + p[0], c[1] - ancla[1] + p[1], c[2] - ancla[2] + p[2]]);
        if (!pos.every(dentro) || pos.some(c => ocupado.has(clave(...c)))) continue;
        // el primer libre (en el orden z, y, x) tiene que ser el menor de la pieza: si no, deja un hueco antes
        pos.forEach(c => ocupado.add(clave(...c))); puestas.push(pos);
        if (buscar()) return true;
        puestas.pop(); pos.forEach(c => ocupado.delete(clave(...c)));
      }
      return false;
    };
    if (total % V) return null;
    return buscar() ? puestas.map(p => p.map(c => c.slice())) : null;
  }
  function copiasCubo(pisos) {
    const { celdas } = leer(pisos), V = celdas.length, b = cajaDe(celdas);
    const n0 = Math.max(b.mx[0] - b.mn[0] + 1, b.mx[1] - b.mn[1] + 1, b.mx[2] - b.mn[2] + 1);
    const formas = rotaciones(celdas.map(c => [c[0] - b.mn[0], c[1] - b.mn[1], c[2] - b.mn[2]]));
    for (let n = n0; n <= 6; n++) {
      if ((n * n * n) % V) continue;
      const col = llenarCubo(formas, n);
      if (col) return { volumen: V, n, copias: n * n * n / V, adicionales: n * n * n - V, colocaciones: col,
        errores: { sinDividir: n0 * n0 * n0 - V, copiasEnVezDeCubitos: n * n * n / V - 1, todoElCubo: n * n * n } };
    }
    throw new Error('no se encontró un cubo de arista ≤ 6 armado con copias de la pieza');
  }

  // ---------- cubos que cubren ----------
  function cubrir(pisos, k) {
    if (!(k >= 1) || k !== Math.floor(k)) throw new Error('k debe ser un entero ≥ 1');
    let { celdas } = leer(pisos);
    let s = conjunto(celdas); const terminos = [celdas.length];
    let agregados = 0, porCara = 0, conMesa = 0, anterior = 0, previo = 0;
    for (let t = 2; t <= k; t++) {
      const nuevas = new Map(), bajo = new Set(); let caras = 0;
      for (const [x, y, z] of celdas) for (const d of DIRS) {
        const n = [x + d[0], y + d[1], z + d[2]], kk = clave(...n);
        if (s.has(kk)) continue;
        if (n[2] < 0) { bajo.add(kk); continue; }
        caras++; nuevas.set(kk, n);
      }
      previo = anterior; anterior = nuevas.size;
      agregados = nuevas.size; porCara = caras; conMesa = nuevas.size + bajo.size;
      celdas = celdas.concat([...nuevas.values()]); s = conjunto(celdas); terminos.push(celdas.length);
    }
    return { volumen: celdas.length, agregados, pisos: aPisos(celdas), terminos,
      errores: { porCara, conMesa, mismoAumento: k >= 3 ? previo : 0 } };
  }

  // ---------- poliedro convexo desde tres vistas convexas ----------
  function semiplanos(pol) { // pol = [[a, b]] → [[pa, pb, c]] con pa·a + pb·b ≤ c
    const n = pol.length, cx = pol.reduce((s, p) => s + p[0], 0) / n, cy = pol.reduce((s, p) => s + p[1], 0) / n, out = [];
    for (let i = 0; i < n; i++) {
      const [a1, b1] = pol[i], [a2, b2] = pol[(i + 1) % n];
      let pa = b2 - b1, pb = -(a2 - a1), c = pa * a1 + pb * b1;
      if (pa * cx + pb * cy > c) { pa = -pa; pb = -pb; c = -c; }
      out.push([pa, pb, c]);
    }
    return out;
  }
  function det3(m) { return m[0][0] * (m[1][1] * m[2][2] - m[1][2] * m[2][1]) - m[0][1] * (m[1][0] * m[2][2] - m[1][2] * m[2][0]) + m[0][2] * (m[1][0] * m[2][1] - m[1][1] * m[2][0]); }
  const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]], cruz = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]], punto = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
  function planosDe(o, extra) {
    const P = [];
    const pon = (n, c) => { const l = Math.hypot(...n); const q = [n[0] / l, n[1] / l, n[2] / l, c / l];
      if (!P.some(r => Math.abs(r[0] - q[0]) < 1e-9 && Math.abs(r[1] - q[1]) < 1e-9 && Math.abs(r[2] - q[2]) < 1e-9 && Math.abs(r[3] - q[3]) < 1e-9)) P.push(q); };
    if (o.frontal) for (const [a, b, c] of semiplanos(o.frontal)) pon([a, 0, b], c);
    if (o.superior) for (const [a, b, c] of semiplanos(o.superior)) pon([a, b, 0], c);
    if (o.lateral) for (const [a, b, c] of semiplanos(o.lateral)) pon([0, a, b], c);
    for (const e of extra || []) pon(e.slice(0, 3), e[3]);
    return P;
  }
  function poliedroDePlanos(P) {
    const verts = [];
    for (let i = 0; i < P.length; i++) for (let j = i + 1; j < P.length; j++) for (let k = j + 1; k < P.length; k++) {
      const A = [P[i], P[j], P[k]], D = det3(A.map(r => r.slice(0, 3)));
      if (Math.abs(D) < 1e-12) continue;
      const sol = [0, 1, 2].map(col => det3(A.map(r => r.slice(0, 3).map((v, q) => (q === col ? r[3] : v)))) / D);
      if (!P.every(r => r[0] * sol[0] + r[1] * sol[1] + r[2] * sol[2] <= r[3] + 1e-9)) continue;
      if (!verts.some(v => Math.hypot(...sub(v, sol)) < 1e-7)) verts.push(sol.map(v => (Math.abs(v - Math.round(v)) < 1e-9 ? Math.round(v) : v)));
    }
    const sobre = (r, v) => Math.abs(r[0] * v[0] + r[1] * v[1] + r[2] * v[2] - r[3]) < 1e-7;
    const caras = [];
    for (const r of P) {
      const ids = verts.map((v, i) => i).filter(i => sobre(r, verts[i]));
      if (ids.length < 3) continue;
      let plano = false;
      for (let a = 1; a < ids.length && !plano; a++) for (let b = a + 1; b < ids.length && !plano; b++)
        if (Math.hypot(...cruz(sub(verts[ids[a]], verts[ids[0]]), sub(verts[ids[b]], verts[ids[0]]))) > 1e-9) plano = true;
      if (!plano) continue;
      // ordena alrededor del centro de la cara
      const n = r.slice(0, 3), c = ids.reduce((s, i) => [s[0] + verts[i][0] / ids.length, s[1] + verts[i][1] / ids.length, s[2] + verts[i][2] / ids.length], [0, 0, 0]);
      const u = sub(verts[ids[0]], c), w = cruz(n, u);
      ids.sort((a, b) => Math.atan2(punto(sub(verts[a], c), w), punto(sub(verts[a], c), u)) - Math.atan2(punto(sub(verts[b], c), w), punto(sub(verts[b], c), u)));
      caras.push({ normal: n, c: r[3], vertices: ids });
    }
    const aristas = [];
    for (let i = 0; i < verts.length; i++) for (let j = i + 1; j < verts.length; j++) {
      const comunes = caras.filter(f => f.vertices.includes(i) && f.vertices.includes(j)).length;
      if (comunes >= 2) aristas.push([i, j]);
    }
    // volumen: pirámides desde el centro de los vértices
    const cen = verts.reduce((s, v) => [s[0] + v[0] / verts.length, s[1] + v[1] / verts.length, s[2] + v[2] / verts.length], [0, 0, 0]);
    let vol = 0;
    for (const f of caras) {
      let ar = [0, 0, 0]; const p0 = verts[f.vertices[0]];
      for (let t = 1; t + 1 < f.vertices.length; t++) { const q = cruz(sub(verts[f.vertices[t]], p0), sub(verts[f.vertices[t + 1]], p0)); ar = [ar[0] + q[0], ar[1] + q[1], ar[2] + q[2]]; }
      const a = Math.hypot(...ar) / 2, h = f.c - punto(f.normal, cen);
      vol += a * h / 3;
    }
    return { caras: caras.length, vertices: verts.length, aristas: aristas.length, euler: verts.length - aristas.length + caras.length, volumen: vol,
      listaVertices: verts, listaCaras: caras.map(f => ({ normal: f.normal, vertices: f.vertices })), listaAristas: aristas };
  }
  function poliedroVistas(o) {
    if (!o || !o.frontal || !o.superior || !o.lateral) throw new Error('faltan vistas: frontal, superior y lateral');
    const R = poliedroDePlanos(planosDe(o));
    // el prisma de la vista frontal sola, cortado por la caja de las otras dos
    const ys = o.superior.map(p => p[1]).concat(o.lateral.map(p => p[0])), y0 = Math.min(...ys), y1 = Math.max(...ys);
    const PF = poliedroDePlanos(planosDe({ frontal: o.frontal }, [[0, 1, 0, y1], [0, -1, 0, -y0]]));
    const ve = [[0, -1, 0], [0, 0, 1], [1, 0, 0]], cuenta = f => ve.filter(d => punto(d, f.normal) > 1e-9).length;
    R.errores = { prismaFrontal: PF.caras, verticesPrismaFrontal: PF.vertices, carasEnVistas: R.listaCaras.filter(f => cuenta(f) > 0).length,
      regionesVistas: R.listaCaras.reduce((s, f) => s + cuenta(f), 0), esquinasVistas: o.frontal.length + o.superior.length + o.lateral.length,
      cajaCaras: 6, cajaVertices: 8 };
    return R;
  }
  function interseccion(o, caja) {
    const [[x0, x1], [y0, y1], [z0, z1]] = caja;
    return poliedroDePlanos(planosDe(o, [[1, 0, 0, x1], [-1, 0, 0, -x0], [0, 1, 0, y1], [0, -1, 0, -y0], [0, 0, 1, z1], [0, 0, -1, -z0]]));
  }
  function volumenCaja(m) { const s = l => (l || [1]).reduce((a, b) => a + b, 0); return { largo: s(m.x), fondo: s(m.y), alto: s(m.z), volumen: s(m.x) * s(m.y) * s(m.z) }; }

  return { leer, aPisos, vistas, analizar, maximo, minimo, elegirVista, completarCubo, completarCaja, copiasCubo, cubrir,
    poliedroVistas, interseccion, volumenCaja, VISTA_ISO,
    util: { conjunto, cajaDe, rotaciones, llenarCubo, area, esVertice, esTramo, igual, alturasColumna } };
});
