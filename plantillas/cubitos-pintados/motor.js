/*
 * Motor de «El cubo que se pinta y se perfora» (razonamiento matemático, rutas y visualización espacial): sólidos
 * armados con cubitos que se pintan por fuera, cubos con túneles, bloques atravesados por barras, sucesiones de
 * sólidos y su superficie, bloques que se cortan para armar un cubo y el mayor cubo que se arma con bloques de dos
 * tamaños.
 *
 * Aquí vive toda la matemática de la plantilla (regla 1 de CLAUDE.md). No toca el DOM: funciona igual en el
 * navegador (window.MotorCubitos) y en Node (require('./motor.js')), donde lo prueban casos.json y papel.json.
 * Todo se cuenta por fuerza bruta, cubito por cubito y cara por cara (las fórmulas solo se comprueban en las pruebas).
 *
 * CONVENCIONES
 *   - Un cubito es una celda [x, y, z] de enteros: x crece hacia la derecha, y hacia el fondo (y = 0 es la fila del
 *     frente), z hacia arriba (z = 0 es el piso que toca la mesa). Las seis caras de un cubito se nombran por su
 *     dirección: −x (izquierda), +x (derecha), −y (frente), +y (atrás), −z (abajo), +z (arriba).
 *   - Un sólido se da de una de tres maneras (la primera que venga):
 *       dims: [a, b, c]       el bloque de a × b × c (a en x, b en y, c en z), celdas 0 ≤ x < a, 0 ≤ y < b, 0 ≤ z < c;
 *       alturas: [[...], …]   alturas[y][x] = cuántos cubitos hay apilados en la columna (x, y) (0: ninguno); la
 *                             primera fila es la del frente (y = 0); celdas (x, y, z) con 0 ≤ z < alturas[y][x];
 *       celdas: [[x, y, z], …] la lista (sin repetidos).
 *   - Una cara está EXPUESTA si en esa dirección no hay otro cubito del sólido (las caras pegadas entre dos cubitos no
 *     son expuestas). El sólido se pinta por fuera: se pintan las caras expuestas, salvo las que tocan la mesa o una
 *     pared (sinPintar). Con xmin…zmax, los extremos de las celdas del sólido:
 *       'mesa'       las caras −z de los cubitos con z = 0 (el piso z = 0 es la mesa; vale aunque zmin sea mayor:
 *                    entonces ninguna cara toca la mesa);
 *       'atras'      las caras +y de los cubitos con y = ymax;    'frente'     las caras −y con y = ymin;
 *       'izquierda'  las caras −x de los cubitos con x = xmin;    'derecha'    las caras +x con x = xmax.
 *   - Cada resultado que es la respuesta de una predicción trae 'respuestas' (lo correcto), 'errores' (lo que da cada
 *     idea errónea, agrupado con la misma clave que 'respuestas'), 'coinciden' (por clave, la lista de los errores que
 *     con esos datos dan justo la respuesta: no van en 'errores') y 'repetidos' (por clave, { error: el error anterior
 *     de la lista que da lo mismo }: tampoco van en 'errores'). Los errores se revisan en el orden en que se nombran
 *     abajo; un error que no se aplica a esos datos no aparece en ninguna parte. Los códigos (RME…, RM2) son los de
 *     docs/investigacion/razonamiento-espacial-ideas-erroneas.md y aritmetica-razonamiento-ideas-erroneas.md.
 *
 * FUNCIONES (argumentos entre llaves)
 *   solido(spec)                lista de celdas del sólido, ordenada por z, luego y, luego x.
 *   pintado({ dims | alturas | celdas, sinPintar, k })
 *       sinPintar: lista con 'mesa', 'atras', 'frente', 'izquierda', 'derecha' (por defecto, ninguna). k: un entero de
 *       0 a 6 (opcional). Da { cubitos: N, celdas (el orden de solido), pintadas: caras pintadas de cada celda (mismo
 *       orden), porCara: para cada celda, sus seis caras en el orden −x, +x, −y, +y, −z, +z, con 0 si está pegada a
 *       otro cubito, 1 si está pintada y 2 si está expuesta pero toca la mesa o una pared, cuenta: [n0, …, n6]
 *       (cuántos cubitos tienen exactamente j caras pintadas), caras: total de caras
 *       pintadas, expuestas: total de caras expuestas (pintadas o no), porPiso: [{ z, cuenta: [n0..n6] }, …] (de abajo
 *       hacia arriba), respuestas, errores, coinciden, repetidos }.
 *       respuestas.caras = caras; errores.caras, en este orden:
 *         pegadas:  6N menos las caras expuestas que no se pintan: cuenta también las caras pegadas entre cubitos (RME1);
 *         conTodas: expuestas, solo si sinPintar no está vacía: pinta también las de la mesa y la pared (RME1);
 *         todas:    6N (RME1).
 *       Con k: respuestas.k = cuenta[k]; errores.k, en este orden:
 *         yLaSiguiente: n_k + n_(k+1) (solo si k < 6): mete entre los de k caras a los de una cara más, como las
 *                    esquinas entre los de dos caras (RME4);
 *         otra:      n_(k+1), los de una cara más (solo si k < 6) (RME4);
 *         conTodas:  cuenta[k] del mismo sólido con sinPintar vacía (solo si sinPintar no está vacía) (RME1);
 *         olvidaMesa:  cuenta[k] con sinPintar sin 'mesa' (solo si sinPintar trae 'mesa' y al menos una pared) (RME1);
 *         olvidaPared: cuenta[k] con sinPintar = ['mesa'] (solo si sinPintar trae 'mesa' y al menos una pared) (RME1);
 *         restaUna:  solo con dims: cuenta[k] del bloque [a + 1, b + 1, c + 1] con el mismo sinPintar: en cada
 *                    arista o cara se resta una sola esquina (n − 1 en vez de n − 2) (RME170);
 *         sinRestar: solo con dims: lo mismo con el bloque [a + 2, b + 2, c + 2]: no se restan las esquinas (n en vez
 *                    de n − 2) (RME4).
 *   agujereado({ n, tuneles: [{ eje, en: [u, v] }, …], masa })
 *       Cubo de n × n × n (celdas de 0 a n − 1) con túneles de un cubito de sección que lo atraviesan de cara a cara.
 *       Un túnel de eje 'x' quita las celdas (t, u, v) para todo t (en = [y, z]); de eje 'y', las (u, t, v) (en = [x, z]);
 *       de eje 'z', las (u, v, t) (en = [x, y]); 0 ≤ u, v < n. Sin túneles repetidos. masa (opcional, > 0) es la masa de
 *       cada cubito. Da { total: n³, tuneles: T, quitadas: la lista de celdas quitadas (ordenada como solido),
 *       quitados: cuántas, quedan: n³ − quitados, cruces: celdas por las que pasan dos o más túneles, triples: las
 *       que están en tres, cruceCeldas: las celdas de los cruces (ordenadas), peso: quedan · masa (null sin masa),
 *       quedanCeldas: las que quedan (ordenadas), respuestas: { quedan, quitados, peso },
 *       errores, coinciden, repetidos }.
 *       errores.quitados, en este orden: sinCruces: n · T, cada túnel por separado: el cruce se quita dos veces
 *       (RME2); parejas: n · T − Σ (celdas comunes de cada par de túneles), que descuenta los cruces de a dos y falla
 *       donde se cruzan tres (RME173); soloVisibles: las celdas quitadas que están en la superficie del cubo (alguna
 *       coordenada 0 o n − 1): cuenta solo los huecos que se ven (RME3).
 *       errores.quedan: n³ menos cada uno de esos, con las mismas claves. errores.peso: lo mismo por masa (sin masa,
 *       respuestas.peso es null y no hay errores de peso).
 *   barras({ dims: [a, b, c], barras: [{ eje, en: [u, v] }, …] })
 *       Bloque de a × b × c atravesado por barras rectas de cara a cara, cada una por una fila de cubitos (eje y en como
 *       en agujereado; la barra de eje 'x' pasa por a cubitos, la de 'y' por b, la de 'z' por c). Sin barras repetidas.
 *       Cada cubito por el que pasa una barra tiene dos caras atravesadas por ella (la de entrada y la de salida); dos
 *       cubitos vecinos en la fila tienen cada uno su cara: se cuentan las dos. Da { cubitos: abc, largos: los
 *       cubitos de cada barra, atravesados: cubitos por los que pasa al menos una barra, libres: abc − atravesados,
 *       caras: caras de cubitos atravesadas, paredes: cuántos planos de separación cruza cada barra, sumados
 *       (largo + 1 por barra), celdas: las atravesadas (orden de solido), perforadas: para cada una de esas celdas,
 *       los índices (0 a 5, en el orden −x, +x, −y, +y, −z, +z) de sus caras atravesadas, respuestas: { caras, atravesados, libres },
 *       errores, coinciden, repetidos }.
 *       errores.caras, en este orden: cubos: atravesados (da los cubos en vez de las caras) (RME6); paredes: Σ (largo + 1),
 *       las dos caras pegadas como una sola (RME111); cruceDos: 2 · atravesados, dos caras por cubito aunque pasen
 *       varias barras por él (RME117).
 *       errores.atravesados: sinCruces: Σ largos (el cubito del cruce dos veces) (RME2); caras: el total de caras (RME6).
 *       errores.libres: sinCruces: abc − Σ largos (RME2).
 *   sucesion({ tipo, n, base, desde })
 *       La figura n (entero ≥ 1) de una sucesión de sólidos de cubitos apoyados en la mesa:
 *         'escalera'  n columnas en fila (de x = 0 a n − 1), la columna x de x + 1 cubitos, de un cubito de fondo;
 *         'piramide'  n pisos; el piso z (z = 0 abajo) es un cuadrado de (n − z) × (n − z) en la esquina:
 *                     0 ≤ x, y < n − z (las caras de atrás y de la izquierda quedan en un mismo plano);
 *         'fila'      n cubitos en fila (de x = 0 a n − 1).
 *       base: true si se cuentan los cuadraditos de la base (las caras que tocan la mesa); false (por defecto) si no.
 *       desde (opcional): un número de figura que divide a n, para el error del objeto entero.
 *       La superficie (área exterior) es el número de cuadraditos de caras expuestas (con o sin las de la base).
 *       Da { figura: n, cubitos, area, celdas, respuestas: { area }, errores, coinciden, repetidos }. errores.area,
 *       en este orden: pegadas: 6 · cubitos, menos la base si base es false: cuenta las caras pegadas (RME1);
 *       otraBase: el área con la otra opción de base (RME1); lineal: f(1) + (n − 1) · (f(2) − f(1)), crecer siempre lo
 *       que creció de la figura 1 a la 2 (RME112); objetoEntero: f(desde) · n / desde (solo con desde) (RM2), donde f
 *       es el área con la misma opción de base.
 *   diseccion({ dims: [a, b, c], apilar })
 *       Un bloque de volumen V = abc que se corta con cortes planos paralelos a sus caras para rearmarlo como un cubo
 *       de lado s = ∛V (entero). Las piezas se pueden mover, girar (con las caras paralelas) y, si apilar es true (por
 *       defecto), apilarse para que un mismo corte parta varias a la vez; si apilar es false, cada corte atraviesa el
 *       bloque entero sin mover nada. Solo se aceptan bloques en los que a lo más un lado es mayor que s, ese lado es
 *       múltiplo de s y los otros dividen a s (si no, error). Las piezas son cajas cuyos lados no pasan del lado del
 *       bloque ni de s, así que hacen falta al menos k = (lado mayor) / s piezas, y con k piezas se arma el cubo.
 *       Da { lado: s, piezas: k, apilando: ⌈log₂ k⌉ (cada corte a lo más duplica las piezas), sinApilar: k − 1,
 *       cortes: apilando o sinApilar según apilar, plan, respuestas: { cortes }, errores, coinciden, repetidos }.
 *       errores.cortes, en este orden: piezas: k (las piezas en vez de los cortes) (RME113); sinApilar: k − 1 (solo si
 *       apilar) (RME118); mitad: ⌈k/2⌉ (cada corte suelta dos piezas nuevas) (RME119).
 *       plan (para el dibujo; solo si apilar y k es potencia de 2, si no null): lista de etapas; cada etapa es la lista
 *       de cajas { o: [x, y, z], d: [dx, dy, dz], antes: [x, y, z] } después de cortar todas las piezas por la mitad
 *       del lado mayor y reacomodar (o: la esquina de la caja ya acomodada; antes: dónde quedó justo después del corte,
 *       antes de moverla); la primera es el bloque entero y la última arma el cubo. Se apila primero hacia arriba (z)
 *       hasta la altura s, luego hacia el fondo (y), luego hacia la derecha (x), saltando el eje del lado mayor; cada
 *       mitad lejana se pone encima (o detrás, o a la derecha) de todo lo que ya hay.
 *   mayorCubo({ g, grandes, chicos })
 *       Hay 'grandes' cubos de arista g (entero ≥ 2) y 'chicos' cubitos de arista 1 (enteros ≥ 0). El mayor cubo
 *       compacto (macizo, sin huecos) de lado L que se arma con ellos: en un cubo de lado L caben a lo más ⌊L/g⌋³
 *       cubos de arista g, así que L se puede si chicos ≥ L³ − g³ · min(grandes, ⌊L/g⌋³). Se usan los más grandes
 *       posibles (así se usan menos bloques). Da { lado: L, usaGrandes: B = min(grandes, ⌊L/g⌋³), usaChicos: L³ − g³B,
 *       bloques: B + usaChicos, sobranGrandes, sobranChicos, volumen: chicos + g³ · grandes, respuestas: { lado,
 *       bloques }, errores, coinciden, repetidos }.
 *       errores.lado, en este orden: porVolumen: ⌊∛(volumen)⌋, el lado solo por el volumen (RME114); soloChicos:
 *       ⌊∛chicos⌋ (RME116); soloGrandes: g · ⌊∛grandes⌋ (RME116).
 *       errores.bloques, en este orden: porVolumen: con L' = errores del lado por volumen (aunque no se pueda armar),
 *       min(grandes, ⌊L'/g⌋³) + L'³ − g³ · min(grandes, ⌊L'/g⌋³) (RME114); unidades: L³, los cubitos de volumen en
 *       vez de los bloques (RME172); soloChicos: ⌊∛chicos⌋³ (RME116); soloGrandes: ⌊∛grandes⌋³ (RME116).
 *       Se revisan todos los lados de ⌊∛volumen⌋ hacia abajo: que no se pueda un lado no impide uno mayor (con 7 de
 *       arista 3 y 27 cubitos no sale el de 4 pero sí el de 6). Si no se puede ni un cubo de lado 1, L = 0.
 *   util: { clave, DIRS, NOMBRE_DIR, caja, celdasFigura }   piezas internas que usa la escena para dibujar.
 */
(function (root, fabrica) {
  const motor = fabrica();
  if (typeof module === 'object' && module.exports) module.exports = motor;
  else root.MotorCubitos = motor;
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  const DIRS = [[-1, 0, 0], [1, 0, 0], [0, -1, 0], [0, 1, 0], [0, 0, -1], [0, 0, 1]];
  const NOMBRE_DIR = ['-x', '+x', '-y', '+y', '-z', '+z'];
  const PAREDES = ['mesa', 'atras', 'frente', 'izquierda', 'derecha'];
  const clave = c => c[0] + ',' + c[1] + ',' + c[2];
  const entero = (x, que) => { if (!Number.isInteger(x)) throw new Error(`${que} debe ser un entero`); return x; };
  const orden = (p, q) => p[2] - q[2] || p[1] - q[1] || p[0] - q[0];

  // ---------- el sólido ----------
  function solido(spec) {
    spec = spec || {};
    let celdas = [];
    if (spec.dims) {
      const [a, b, c] = spec.dims.map((v, i) => entero(v, 'dims[' + i + ']'));
      if (a < 1 || b < 1 || c < 1) throw new Error('dims deben ser positivos');
      for (let z = 0; z < c; z++) for (let y = 0; y < b; y++) for (let x = 0; x < a; x++) celdas.push([x, y, z]);
    } else if (spec.alturas) {
      spec.alturas.forEach((fila, y) => fila.forEach((h, x) => { entero(h, 'altura'); if (h < 0) throw new Error('altura negativa'); for (let z = 0; z < h; z++) celdas.push([x, y, z]); }));
    } else if (spec.celdas) {
      const vistos = new Set();
      for (const c of spec.celdas) {
        c.forEach(v => entero(v, 'coordenada'));
        const k = clave(c); if (vistos.has(k)) throw new Error('celda repetida ' + k);
        vistos.add(k); celdas.push([c[0], c[1], c[2]]);
      }
    } else throw new Error('falta dims, alturas o celdas');
    if (!celdas.length) throw new Error('el sólido no tiene cubitos');
    return celdas.sort(orden);
  }
  function caja(celdas) {
    const m = [Infinity, Infinity, Infinity], M = [-Infinity, -Infinity, -Infinity];
    for (const c of celdas) for (let i = 0; i < 3; i++) { m[i] = Math.min(m[i], c[i]); M[i] = Math.max(M[i], c[i]); }
    return { min: m, max: M };
  }
  // ¿la cara d (índice en DIRS) de la celda c toca la mesa o una pared de la lista?
  function tocaApoyo(c, d, sin, B) {
    if (d === 4 && sin.includes('mesa') && c[2] === 0) return true;
    if (d === 3 && sin.includes('atras') && c[1] === B.max[1]) return true;
    if (d === 2 && sin.includes('frente') && c[1] === B.min[1]) return true;
    if (d === 0 && sin.includes('izquierda') && c[0] === B.min[0]) return true;
    if (d === 1 && sin.includes('derecha') && c[0] === B.max[0]) return true;
    return false;
  }
  // Conteo base: por cada celda, caras expuestas y pintadas.
  function contar(celdas, sin) {
    const S = new Set(celdas.map(clave)), B = caja(celdas);
    const pintadas = [], expuestasDe = [], porCara = [];
    let caras = 0, expuestas = 0;
    for (const c of celdas) {
      let p = 0, e = 0; const f = [];
      DIRS.forEach((d, i) => {
        if (S.has(clave([c[0] + d[0], c[1] + d[1], c[2] + d[2]]))) { f.push(0); return; }
        e++; if (!tocaApoyo(c, i, sin, B)) { p++; f.push(1); } else f.push(2);
      });
      pintadas.push(p); expuestasDe.push(e); porCara.push(f); caras += p; expuestas += e;
    }
    const cuenta = [0, 0, 0, 0, 0, 0, 0]; pintadas.forEach(p => cuenta[p]++);
    return { pintadas, expuestasDe, porCara, cuenta, caras, expuestas };
  }
  // Reparte los errores (en orden) entre errores, coinciden y repetidos.
  function repartir(correcto, lista) {
    const errores = {}, coinciden = [], repetidos = {}, vistos = [];
    for (const [nombre, valor] of lista) {
      if (valor === undefined) continue;
      if (valor === correcto) { coinciden.push(nombre); continue; }
      const antes = vistos.find(v => v[1] === valor);
      if (antes) { repetidos[nombre] = antes[0]; continue; }
      vistos.push([nombre, valor]); errores[nombre] = valor;
    }
    return { errores, coinciden, repetidos };
  }
  function juntar(grupos) {
    const out = { respuestas: {}, errores: {}, coinciden: {}, repetidos: {} };
    for (const [k, correcto, lista] of grupos) {
      const A = repartir(correcto, lista);
      out.respuestas[k] = correcto; out.errores[k] = A.errores; out.coinciden[k] = A.coinciden; out.repetidos[k] = A.repetidos;
    }
    return out;
  }
  function revisarSin(sin) {
    sin = sin || [];
    for (const s of sin) if (!PAREDES.includes(s)) throw new Error('sinPintar desconocido: ' + s);
    return sin;
  }

  function pintado(o) {
    o = o || {};
    const sin = revisarSin(o.sinPintar);
    const celdas = solido(o), N = celdas.length, R = contar(celdas, sin);
    const pisos = new Map();
    celdas.forEach((c, i) => { if (!pisos.has(c[2])) pisos.set(c[2], [0, 0, 0, 0, 0, 0, 0]); pisos.get(c[2])[R.pintadas[i]]++; });
    const porPiso = [...pisos.keys()].sort((a, b) => a - b).map(z => ({ z, cuenta: pisos.get(z) }));
    const apoyadas = R.expuestas - R.caras;
    const grupos = [['caras', R.caras, [['pegadas', 6 * N - apoyadas], ['conTodas', sin.length ? R.expuestas : undefined], ['todas', 6 * N]]]];
    if (o.k !== undefined) {
      const k = entero(o.k, 'k'); if (k < 0 || k > 6) throw new Error('k va de 0 a 6');
      const conSin = s => contar(celdas, s).cuenta[k];
      const paredes = sin.filter(s => s !== 'mesa');
      const conMesaYPared = sin.includes('mesa') && paredes.length > 0;
      const bloque = d => contar(solido({ dims: d }), sin).cuenta[k];
      grupos.push(['k', R.cuenta[k], [
        ['yLaSiguiente', k < 6 ? R.cuenta[k] + R.cuenta[k + 1] : undefined],
        ['otra', k < 6 ? R.cuenta[k + 1] : undefined],
        ['conTodas', sin.length ? conSin([]) : undefined],
        ['olvidaMesa', conMesaYPared ? conSin(paredes) : undefined],
        ['olvidaPared', conMesaYPared ? conSin(['mesa']) : undefined],
        ['restaUna', o.dims ? bloque(o.dims.map(v => v + 1)) : undefined],
        ['sinRestar', o.dims ? bloque(o.dims.map(v => v + 2)) : undefined]]]);
    }
    return Object.assign({ cubitos: N, celdas, pintadas: R.pintadas, porCara: R.porCara, cuenta: R.cuenta, caras: R.caras, expuestas: R.expuestas, porPiso }, juntar(grupos));
  }

  // ---------- túneles y barras ----------
  function filaDe(eje, en, largo) {
    const [u, v] = en, out = [];
    for (let t = 0; t < largo; t++) out.push(eje === 'x' ? [t, u, v] : eje === 'y' ? [u, t, v] : eje === 'z' ? [u, v, t] : null);
    if (out[0] === null) throw new Error('eje debe ser x, y o z');
    return out;
  }
  const ejeIdx = e => ({ x: 0, y: 1, z: 2 })[e];
  function filas(lista, dims, que) {
    const vistos = new Set();
    return (lista || []).map(t => {
      const i = ejeIdx(t.eje); if (i === undefined) throw new Error('eje debe ser x, y o z');
      const otros = [0, 1, 2].filter(j => j !== i);
      t.en.forEach((v, j) => { entero(v, 'en'); if (v < 0 || v >= dims[otros[j]]) throw new Error(`${que} fuera del bloque`); });
      const k = t.eje + ':' + t.en.join(','); if (vistos.has(k)) throw new Error(`${que} repetido`); vistos.add(k);
      return filaDe(t.eje, t.en, dims[i]);
    });
  }
  function multiplicidad(fs) {
    const m = new Map();
    for (const f of fs) for (const c of f) { const k = clave(c); m.set(k, (m.get(k) || 0) + 1); }
    return m;
  }
  const desClave = k => k.split(',').map(Number);

  function agujereado(o) {
    const n = entero(o.n, 'n'); if (n < 1) throw new Error('n debe ser positivo');
    const fs = filas(o.tuneles, [n, n, n], 'túnel'), T = fs.length;
    const m = multiplicidad(fs);
    const quitadas = [...m.keys()].map(desClave).sort(orden);
    const S = new Set(m.keys());
    const quedanCeldas = solido({ dims: [n, n, n] }).filter(c => !S.has(clave(c)));
    const quitados = quitadas.length, total = n * n * n;
    let pares = 0;
    for (let i = 0; i < T; i++) for (let j = i + 1; j < T; j++) { const A = new Set(fs[i].map(clave)); pares += fs[j].filter(c => A.has(clave(c))).length; }
    const borde = quitadas.filter(c => c.some(v => v === 0 || v === n - 1)).length;
    const cruces = [...m.values()].filter(v => v >= 2).length, triples = [...m.values()].filter(v => v >= 3).length;
    const masa = o.masa === undefined || o.masa === null ? null : o.masa;
    if (masa !== null && !(masa > 0)) throw new Error('masa debe ser positiva');
    const lq = [['sinCruces', n * T], ['parejas', n * T - pares], ['soloVisibles', borde]];
    const grupos = [['quitados', quitados, lq], ['quedan', total - quitados, lq.map(([k, v]) => [k, total - v])]];
    const pesoDe = q => Math.round(q * masa * 1e9) / 1e9;
    if (masa !== null) grupos.push(['peso', pesoDe(total - quitados), lq.map(([k, v]) => [k, pesoDe(total - v)])]);
    const J = juntar(grupos);
    if (masa === null) J.respuestas.peso = null;
    const cruceCeldas = [...m.entries()].filter(e => e[1] >= 2).map(e => desClave(e[0])).sort(orden);
    return Object.assign({ total, tuneles: T, quitadas, quitados, cruceCeldas, quedan: total - quitados, cruces, triples, peso: masa === null ? null : pesoDe(total - quitados), quedanCeldas }, J);
  }

  function barras(o) {
    const dims = (o.dims || []).map((v, i) => entero(v, 'dims[' + i + ']'));
    if (dims.length !== 3 || dims.some(v => v < 1)) throw new Error('dims deben ser tres enteros positivos');
    const fs = filas(o.barras, dims, 'barra'), m = multiplicidad(fs);
    const N = dims[0] * dims[1] * dims[2], largos = fs.map(f => f.length), suma = largos.reduce((s, v) => s + v, 0);
    const atravesados = m.size, caras = 2 * suma, paredes = suma + fs.length;
    const J = juntar([
      ['caras', caras, [['cubos', atravesados], ['paredes', paredes], ['cruceDos', 2 * atravesados]]],
      ['atravesados', atravesados, [['sinCruces', suma], ['caras', caras]]],
      ['libres', N - atravesados, [['sinCruces', N - suma]]]]);
    const celdas = [...m.keys()].map(desClave).sort(orden);
    const ejes = (o.barras || []).map(t => ejeIdx(t.eje));
    const perforadas = celdas.map(c => { const k = clave(c), out = []; fs.forEach((f, j) => { if (f.some(q => clave(q) === k)) out.push(2 * ejes[j], 2 * ejes[j] + 1); }); return out.sort((a, b) => a - b); });
    return Object.assign({ cubitos: N, largos, atravesados, libres: N - atravesados, caras, paredes, celdas, perforadas }, J);
  }

  // ---------- sucesiones de sólidos ----------
  function celdasFigura(tipo, n) {
    const c = [];
    if (tipo === 'escalera') { for (let x = 0; x < n; x++) for (let z = 0; z <= x; z++) c.push([x, 0, z]); }
    else if (tipo === 'piramide') { for (let z = 0; z < n; z++) for (let y = 0; y < n - z; y++) for (let x = 0; x < n - z; x++) c.push([x, y, z]); }
    else if (tipo === 'fila') { for (let x = 0; x < n; x++) c.push([x, 0, 0]); }
    else throw new Error('tipo debe ser escalera, piramide o fila');
    return c;
  }
  function areaFigura(tipo, n, base) {
    const celdas = solido({ celdas: celdasFigura(tipo, n) });
    return { celdas, area: contar(celdas, base ? [] : ['mesa']).caras };
  }
  function sucesion(o) {
    const n = entero(o.n, 'n'); if (n < 1) throw new Error('n debe ser ≥ 1');
    const base = !!o.base, tipo = o.tipo;
    const F = areaFigura(tipo, n, base), N = F.celdas.length;
    const f1 = areaFigura(tipo, 1, base).area, f2 = areaFigura(tipo, 2, base).area;
    const abajo = F.celdas.filter(c => c[2] === 0).length;
    let objeto;
    if (o.desde !== undefined) {
      const d = entero(o.desde, 'desde'); if (d < 1 || n % d) throw new Error('desde debe dividir a n');
      objeto = areaFigura(tipo, d, base).area * (n / d);
    }
    const J = juntar([['area', F.area, [
      ['pegadas', 6 * N - (base ? 0 : abajo)], ['otraBase', areaFigura(tipo, n, !base).area],
      ['lineal', f1 + (n - 1) * (f2 - f1)], ['objetoEntero', objeto]]]]);
    return Object.assign({ figura: n, tipo, base, cubitos: N, area: F.area, celdas: F.celdas }, J);
  }

  // ---------- disección ----------
  function raizCubica(V) { let s = Math.round(Math.cbrt(V)); while (s * s * s > V) s--; while ((s + 1) ** 3 <= V) s++; return s; }
  function diseccion(o) {
    const dims = (o.dims || []).map((v, i) => entero(v, 'dims[' + i + ']'));
    if (dims.length !== 3 || dims.some(v => v < 1)) throw new Error('dims deben ser tres enteros positivos');
    const apilar = o.apilar === undefined ? true : !!o.apilar;
    const V = dims[0] * dims[1] * dims[2], s = raizCubica(V);
    if (s ** 3 !== V) throw new Error('el volumen no es un cubo perfecto');
    const grandes = dims.filter(d => d > s);
    if (grandes.length > 1) throw new Error('solo se acepta un lado mayor que el cubo');
    if (dims.some(d => d <= s && s % d)) throw new Error('los lados menores deben dividir al lado del cubo');
    const largo = grandes.length ? grandes[0] : s;
    if (largo % s) throw new Error('el lado mayor debe ser múltiplo del lado del cubo');
    const k = largo / s;
    const apilando = Math.max(0, Math.ceil(Math.log2(k) - 1e-12)), sinApilar = k - 1;
    const cortes = apilar ? apilando : sinApilar;
    const J = juntar([['cortes', cortes, [['piezas', k], ['sinApilar', apilar ? sinApilar : undefined], ['mitad', Math.ceil(k / 2)]]]]);
    return Object.assign({ lado: s, piezas: k, apilando, sinApilar, cortes, plan: apilar && (k & (k - 1)) === 0 ? planApilado(dims, s) : null }, J);
  }
  // Cortes por la mitad del lado mayor y reacomodo: primero se apila hacia arriba (z) hasta la altura s, luego hacia
  // el fondo (y) hasta s, luego hacia la derecha (x); el lado mayor puede ser cualquiera de los tres.
  function planApilado(dims, s) {
    const L = dims.indexOf(Math.max(...dims));
    let cajas = [{ o: [0, 0, 0], d: dims.slice(), antes: [0, 0, 0] }];
    const copia = cs => cs.map(c => ({ o: c.o.slice(), d: c.d.slice(), antes: c.antes.slice() }));
    const etapas = [copia(cajas)];
    if (dims[L] === s) return etapas;
    const ejes = [2, 1, 0].filter(e => e !== L);
    while (cajas[0].d[L] > s) {
      // ¿hacia dónde se apila? el primer eje (de ejes) que todavía no llega a s
      const alto = e => Math.max(...cajas.map(c => c.o[e] + c.d[e]));
      const e = ejes.find(q => alto(q) < s);
      const mitad = cajas[0].d[L] / 2, desplaza = alto(e), nuevas = [];
      for (const c of cajas) {
        const d = c.d.slice(); d[L] = mitad;
        nuevas.push({ o: c.o.slice(), d, antes: c.o.slice() });
        const o2 = c.o.slice(); o2[e] += desplaza; const a2 = c.o.slice(); a2[L] += mitad;
        nuevas.push({ o: o2, d: d.slice(), antes: a2 });
      }
      cajas = nuevas.sort((p, q) => orden(p.o, q.o));
      etapas.push(copia(cajas));
    }
    return etapas;
  }

  // ---------- el mayor cubo con bloques de dos tamaños ----------
  function mayorCubo(o) {
    const g = entero(o.g, 'g'), G = entero(o.grandes, 'grandes'), C = entero(o.chicos, 'chicos');
    if (g < 2 || G < 0 || C < 0) throw new Error('g ≥ 2, grandes ≥ 0, chicos ≥ 0');
    const g3 = g ** 3, vol = C + g3 * G;
    const usa = L => Math.min(G, Math.floor(L / g) ** 3);
    let L = raizCubica(vol);
    while (L > 0 && C < L ** 3 - g3 * usa(L)) L--;
    const B = usa(L), chicos = L ** 3 - g3 * B;
    const Lv = raizCubica(vol), Bv = usa(Lv);
    const J = juntar([
      ['lado', L, [['porVolumen', Lv], ['soloChicos', raizCubica(C)], ['soloGrandes', g * raizCubica(G)]]],
      ['bloques', B + chicos, [['porVolumen', Bv + Lv ** 3 - g3 * Bv], ['unidades', L ** 3], ['soloChicos', raizCubica(C) ** 3], ['soloGrandes', raizCubica(G) ** 3]]]]);
    return Object.assign({ lado: L, usaGrandes: B, usaChicos: chicos, bloques: B + chicos, sobranGrandes: G - B, sobranChicos: C - chicos, volumen: vol }, J);
  }

  return { solido, pintado, agujereado, barras, sucesion, diseccion, mayorCubo, util: { clave, DIRS, NOMBRE_DIR, caja, celdasFigura } };
});
