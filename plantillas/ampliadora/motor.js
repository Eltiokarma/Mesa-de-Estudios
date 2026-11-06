/*
 * Motor de La ampliadora: semejanza, área y volumen.
 *
 * Aquí vive toda la geometría de la plantilla (regla 1 de CLAUDE.md). No toca el
 * DOM: funciona igual en el navegador (window.MotorAmpliadora) y en Node
 * (require('./motor.js')), donde lo prueban casos.json y papel.json.
 *
 * Unidades: las que traiga el problema (cm, m…); el motor no convierte. Las figuras con
 * círculos devuelven además el coeficiente de π en 'pi' (cono r = 3, h = 4 → pi.volumen = 12,
 * es decir, 12π), para comparar sin decimales.
 *
 *   figura('cono', { r:3, h:4 })                   perímetro, área, área lateral, volumen…
 *   escalar('cubo', { arista:2 }, 3)               la figura ampliada y las razones medidas (k, k², k³)
 *   homotecia([[0,0],[3,0],[3,3]], [0,0], 2)       los vértices ampliados desde un punto fijo
 *   teselar('triangulo', 2)                        las k² copias de la figura chica, con las invertidas
 *   cubitos(3), bloque(3, 4, 2)                    cubitos totales, visibles desde fuera y en el dibujo
 *   segunMagnitud(2, 3, 'area')                    lo que crece con el área: 2 h → 18 h
 *   maqueta(50, 3, 'area')                         de la maqueta 1:50 a la realidad
 *   conosParaLlenar(3, 4), vertido(3, 4, t)        cono y cilindro de igual base y altura; los vertidos
 *                                                 (t de 0 a 3; 'vertido' es el número del vertido en curso, desde 1,
 *                                                 y el cono se vuelve a llenar al empezar cada vertido)
 *   siFueraLineal('cuadrado', { lado:3 }, 2)       la figura con k veces el área, que no es semejante
 *
 * Cada resultado que es la respuesta de una predicción trae un campo 'errores' con los valores
 * que dan los errores típicos de docs/investigacion/geometria-ideas-erroneas.md (GE1, GE2, GE13,
 * GE14, GE20, GE21): son las opciones incorrectas de la escena.
 */
(function (root, fabrica) {
  const motor = fabrica();
  if (typeof module === 'object' && module.exports) module.exports = motor;
  else root.MotorAmpliadora = motor;
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  const PI = Math.PI;
  const EPS = 1e-9;
  const PLANAS = ['cuadrado', 'rectangulo', 'triangulo', 'circulo'];
  const SOLIDAS = ['cubo', 'prisma', 'cilindro', 'cono', 'piramide', 'esfera'];
  const EXPONENTE = Object.freeze({ longitud: 1, perimetro: 1, area: 2, volumen: 3 });

  function numero(x, que, o) {
    o = o || {};
    const v = typeof x === 'string' && x.trim() !== '' ? Number(x) : x;
    if (typeof v !== 'number' || !Number.isFinite(v)) throw new Error(`${que}: falta un número`);
    if (o.positivo && !(v > 0)) throw new Error(`${que} debe ser mayor que cero`);
    if (!o.positivo && v < 0) throw new Error(`${que} no puede ser negativo`);
    return v;
  }
  const entero = (x, que, min) => {
    const v = numero(x, que);
    if (!Number.isInteger(v)) throw new Error(`${que} debe ser un número entero`);
    if (v < (min === undefined ? 1 : min)) throw new Error(`${que} debe ser al menos ${min === undefined ? 1 : min}`);
    return v;
  };
  const limpio = x => (Math.abs(x - Math.round(x)) < 1e-9 * Math.max(1, Math.abs(x)) ? Math.round(x) : x);

  // ---------- Figuras ----------
  // Planas: cuadrado { lado }, rectangulo { base, altura }, triangulo { lado } (equilátero) o { a, b, c },
  // circulo { r }. Sólidas: cubo { arista }, prisma { largo, ancho, alto } o { base: { tipo, … }, h },
  // cilindro { r, h }, cono { r, h }, piramide { base: { tipo: 'cuadrado'|'triangulo', lado }, h } (base
  // regular), esfera { r }.
  function figura(tipo, d) {
    d = d || {};
    switch (tipo) {
      case 'cuadrado': {
        const l = numero(d.lado, 'el lado', { positivo: true });
        return { tipo, dimension: 2, lado: l, perimetro: 4 * l, area: l * l, diagonal: l * Math.SQRT2 };
      }
      case 'rectangulo': {
        const b = numero(d.base, 'la base', { positivo: true }), h = numero(d.altura, 'la altura', { positivo: true });
        return { tipo, dimension: 2, lado: b, base: b, altura: h, perimetro: 2 * (b + h), area: b * h, diagonal: Math.hypot(b, h) };
      }
      case 'triangulo': {
        let a, b, c;
        if (d.lado !== undefined) a = b = c = numero(d.lado, 'el lado', { positivo: true });
        else { a = numero(d.a, 'el lado a', { positivo: true }); b = numero(d.b, 'el lado b', { positivo: true }); c = numero(d.c, 'el lado c', { positivo: true }); }
        const [x, y, z] = [a, b, c].sort((p, q) => p - q);
        if (x + y <= z * (1 + 1e-12)) throw new Error('esos lados no forman un triángulo: el mayor debe ser menor que la suma de los otros dos');
        const s = (a + b + c) / 2, area = Math.sqrt(s * (s - a) * (s - b) * (s - c));
        return { tipo, dimension: 2, lado: a, a, b, c, perimetro: a + b + c, area, altura: 2 * area / a, equilatero: a === b && b === c };
      }
      case 'circulo': {
        const r = numero(d.r, 'el radio', { positivo: true });
        return { tipo, dimension: 2, lado: r, r, diametro: 2 * r, perimetro: 2 * PI * r, area: PI * r * r,
          pi: { perimetro: 2 * r, area: r * r } };
      }
      case 'cubo': {
        const a = numero(d.arista, 'la arista', { positivo: true });
        return { tipo, dimension: 3, lado: a, arista: a, areaCara: a * a, area: 6 * a * a, lateral: 4 * a * a, volumen: a * a * a,
          diagonal: a * Math.sqrt(3), errores: { volumenComoArea: 6 * a * a } };
      }
      case 'prisma': {
        let base, h;
        if (d.base) { base = figura(d.base.tipo, d.base); h = numero(d.h, 'la altura', { positivo: true }); }
        else { base = figura('rectangulo', { base: d.largo, altura: d.ancho }); h = numero(d.alto, 'el alto', { positivo: true }); }
        if (base.dimension !== 2) throw new Error('la base de un prisma es una figura plana');
        const lateral = base.perimetro * h, area = lateral + 2 * base.area;
        return { tipo, dimension: 3, lado: base.lado, h, base, areaBase: base.area, lateral, area, volumen: base.area * h,
          errores: { volumenComoArea: area } };
      }
      case 'cilindro': {
        const r = numero(d.r, 'el radio', { positivo: true }), h = numero(d.h, 'la altura', { positivo: true });
        return { tipo, dimension: 3, lado: r, r, h, areaBase: PI * r * r, lateral: 2 * PI * r * h, area: 2 * PI * r * h + 2 * PI * r * r,
          volumen: PI * r * r * h, pi: { areaBase: r * r, lateral: 2 * r * h, area: 2 * r * h + 2 * r * r, volumen: r * r * h } };
      }
      case 'cono': {
        const r = numero(d.r, 'el radio', { positivo: true }), h = numero(d.h, 'la altura', { positivo: true }), g = Math.hypot(r, h);
        return { tipo, dimension: 3, lado: r, r, h, generatriz: limpio(g), areaBase: PI * r * r, lateral: PI * r * g, area: PI * r * g + PI * r * r,
          volumen: PI * r * r * h / 3,
          pi: { areaBase: r * r, lateral: limpio(r * g), area: limpio(r * g + r * r), volumen: r * r * h / 3 },
          errores: { sinTercio: PI * r * r * h, sinTercioPi: r * r * h, lateralConAltura: PI * r * h, lateralConAlturaPi: r * h } };
      }
      case 'piramide': {
        const b = d.base || {};
        const n = b.tipo === 'cuadrado' ? 4 : b.tipo === 'triangulo' ? 3 : 0;
        if (!n) throw new Error('la base de la pirámide debe ser un cuadrado o un triángulo equilátero');
        const l = numero(b.lado, 'el lado de la base', { positivo: true }), h = numero(d.h, 'la altura', { positivo: true });
        const base = figura(b.tipo, { lado: l });
        const apBase = l / (2 * Math.tan(PI / n)), ap = Math.hypot(h, apBase);
        const lateral = base.perimetro * ap / 2;
        return { tipo, dimension: 3, lado: l, h, base, areaBase: base.area, apotemaBase: limpio(apBase), apotema: limpio(ap),
          lateral: limpio(lateral), area: limpio(lateral + base.area), volumen: base.area * h / 3,
          errores: { sinTercio: base.area * h, lateralConAltura: base.perimetro * h / 2 } };
      }
      case 'esfera': {
        const r = numero(d.r, 'el radio', { positivo: true });
        return { tipo, dimension: 3, lado: r, r, area: 4 * PI * r * r, volumen: 4 / 3 * PI * r * r * r,
          pi: { area: 4 * r * r, volumen: 4 / 3 * r * r * r } };
      }
      default: throw new Error(`figura desconocida: ${tipo}`);
    }
  }

  // Multiplica por k todas las longitudes de las medidas (también las de la base de un prisma o pirámide).
  function escalarMedidas(d, k) {
    const out = {};
    for (const [c, v] of Object.entries(d)) {
      if (c === 'tipo') out[c] = v;
      else if (v && typeof v === 'object') out[c] = escalarMedidas(v, k);
      else out[c] = numero(v, c) * k;
    }
    return out;
  }

  // La figura ampliada por k y las razones MEDIDAS entre la ampliada y la original (no se suponen):
  // perímetro / perímetro = k, área / área = k², volumen / volumen = k³.
  function escalar(tipo, d, k) {
    k = numero(k, 'la razón k', { positivo: true });
    const original = figura(tipo, d), escalada = figura(tipo, escalarMedidas(d, k));
    const razon = { lado: escalada.lado / original.lado, area: escalada.area / original.area };
    if (original.perimetro !== undefined) razon.perimetro = escalada.perimetro / original.perimetro;
    if (original.volumen !== undefined) razon.volumen = escalada.volumen / original.volumen;
    const errores = { areaLineal: original.area * k, areaCubo: original.area * k * k * k };
    if (original.volumen !== undefined) Object.assign(errores, { volumenLineal: original.volumen * k, volumenCuadrado: original.volumen * k * k });
    return { k, original, escalada, razon, esperado: { longitud: k, area: k * k, volumen: k * k * k }, errores };
  }

  // ---------- Coordenadas ----------
  // Vértices de una figura plana con la esquina inferior izquierda en el origen (y hacia arriba).
  // El círculo devuelve { centro, r }: tangente a los dos ejes.
  function vertices(tipo, d) {
    const f = figura(tipo, d);
    if (tipo === 'cuadrado') return [[0, 0], [f.lado, 0], [f.lado, f.lado], [0, f.lado]];
    if (tipo === 'rectangulo') return [[0, 0], [f.base, 0], [f.base, f.altura], [0, f.altura]];
    if (tipo === 'triangulo') {
      // A en el origen, B sobre el eje x a distancia c, C arriba.
      const { a, b, c } = f, x = (b * b + c * c - a * a) / (2 * c), y = Math.sqrt(Math.max(0, b * b - x * x));
      return [[0, 0], [c, 0], [limpio(x), y]];
    }
    if (tipo === 'circulo') return { centro: [f.r, f.r], r: f.r };
    throw new Error(`${tipo} no es una figura plana`);
  }
  const coord = (p, que) => { if (!Array.isArray(p) || p.length !== 2) throw new Error(`${que}: se espera un punto [x, y]`);
    return p.map(v => { if (typeof v !== 'number' || !Number.isFinite(v)) throw new Error(`${que}: falta un número`); return v; }); };
  // Homotecia de centro O y razón k: P' = O + k·(P − O). Con k > 0 la figura crece (k > 1) o se achica (k < 1)
  // sin girar; los ángulos no cambian y cada lado se multiplica por k.
  function homotecia(puntos, centro, k) {
    k = numero(k, 'la razón k', { positivo: true });
    const O = coord(centro, 'el centro');
    if (!Array.isArray(puntos) || !puntos.length) throw new Error('faltan los puntos de la figura');
    return puntos.map((p, j) => { const P = coord(p, `el punto ${j + 1}`); return [limpio(O[0] + k * (P[0] - O[0])), limpio(O[1] + k * (P[1] - O[1]))]; });
  }
  const distancia = (p, q) => Math.hypot(q[0] - p[0], q[1] - p[1]);
  function lados(puntos) { return puntos.map((p, j) => distancia(p, puntos[(j + 1) % puntos.length])); }
  // Ángulos interiores de un polígono convexo, en grados, en el orden de los vértices.
  function angulos(puntos) {
    const n = puntos.length;
    if (n < 3) throw new Error('un polígono tiene al menos 3 vértices');
    return puntos.map((p, j) => {
      const a = puntos[(j + n - 1) % n], b = puntos[(j + 1) % n];
      const u = [a[0] - p[0], a[1] - p[1]], v = [b[0] - p[0], b[1] - p[1]];
      const c = (u[0] * v[0] + u[1] * v[1]) / (Math.hypot(...u) * Math.hypot(...v));
      return Math.acos(Math.max(-1, Math.min(1, c))) * 180 / PI;
    });
  }
  // Área de un polígono por la fórmula del zapato (determinantes), sin signo.
  function areaPoligono(puntos) {
    let s = 0;
    for (let j = 0; j < puntos.length; j++) { const p = puntos[j], q = puntos[(j + 1) % puntos.length]; s += p[0] * q[1] - q[0] * p[1]; }
    return Math.abs(s) / 2;
  }

  // ---------- Baldosas y copias ----------
  // La figura ampliada k veces (k entero) se llena con k² copias de la figura chica (de lado 1).
  // Cuadrado: una cuadrícula de k × k. Triángulo equilátero: k filas; en la fila i (desde abajo, i = 0…k−1)
  // hay k − i triángulos "de pie" y k − i − 1 invertidos (los del centro). En total k(k+1)/2 de pie y
  // k(k−1)/2 invertidos: k². Cada pieza: { vertices, invertido, fila }.
  function teselar(tipo, k) {
    k = entero(k, 'la razón k', 1);
    const piezas = [];
    if (tipo === 'cuadrado') {
      for (let f = 0; f < k; f++) for (let c = 0; c < k; c++) piezas.push({ vertices: [[c, f], [c + 1, f], [c + 1, f + 1], [c, f + 1]], invertido: false, fila: f });
    } else if (tipo === 'triangulo') {
      const h = Math.sqrt(3) / 2;
      for (let f = 0; f < k; f++) {
        const x0 = f / 2, y0 = f * h, y1 = (f + 1) * h;
        for (let j = 0; j < k - f; j++) piezas.push({ vertices: [[x0 + j, y0], [x0 + j + 1, y0], [x0 + j + 0.5, y1]], invertido: false, fila: f });
        for (let j = 0; j < k - f - 1; j++) piezas.push({ vertices: [[x0 + j + 0.5, y1], [x0 + j + 1, y0], [x0 + j + 1.5, y1]], invertido: true, fila: f });
      }
    } else throw new Error(`no sé teselar un ${tipo}: solo cuadrado o triángulo`);
    const invertidos = piezas.filter(p => p.invertido).length;
    return { tipo, k, piezas, total: piezas.length, derechos: piezas.length - invertidos, invertidos,
      errores: tipo === 'cuadrado' ? { lineal: k, borde: k === 1 ? 1 : 4 * k - 4 } : { lineal: k, soloDerechos: piezas.length - invertidos } };
  }
  // Cuántas copias de la figura chica caben en la ampliada: k² (planas) o k³ (sólidos). Para k entero
  // y figuras con teselación, se cuentan las piezas una por una.
  function copias(tipo, k) {
    k = numero(k, 'la razón k', { positivo: true });
    const d = PLANAS.includes(tipo) ? 2 : SOLIDAS.includes(tipo) ? 3 : 0;
    if (!d) throw new Error(`figura desconocida: ${tipo}`);
    const r = { tipo, k, copias: limpio(Math.pow(k, d)), dimension: d, errores: { lineal: k, cuadrado: limpio(k * k), cubo: limpio(k * k * k) } };
    if (Number.isInteger(k) && (tipo === 'cuadrado' || tipo === 'triangulo')) r.contadas = teselar(tipo, k).total;
    if (Number.isInteger(k) && tipo === 'cubo') r.contadas = cubitos(k).total;
    return r;
  }
  // Baldosas cuadradas de 1 × 1 (cuadrícula con esquinas en enteros) que quedan enteras dentro de una figura
  // plana con su esquina en el origen. La figura cubre 'area' baldosas: las enteras y los pedazos.
  function baldosas(tipo, d) {
    const f = figura(tipo, d), v = vertices(tipo, d);
    const dentro = (x, y) => {
      if (tipo === 'circulo') return Math.hypot(x - v.centro[0], y - v.centro[1]) <= v.r + EPS;
      // polígono convexo en sentido antihorario
      for (let j = 0; j < v.length; j++) { const p = v[j], q = v[(j + 1) % v.length]; if ((q[0] - p[0]) * (y - p[1]) - (q[1] - p[1]) * (x - p[0]) < -EPS) return false; }
      return true;
    };
    const ancho = tipo === 'circulo' ? 2 * f.r : Math.max(...v.map(p => p[0])), alto = tipo === 'circulo' ? 2 * f.r : Math.max(...v.map(p => p[1]));
    const enteras = [];
    for (let i = 0; i < Math.ceil(ancho - EPS); i++) for (let j = 0; j < Math.ceil(alto - EPS); j++)
      if (dentro(i, j) && dentro(i + 1, j) && dentro(i, j + 1) && dentro(i + 1, j + 1)) enteras.push([i, j]);
    return { tipo, area: f.area, enteras: enteras.length, celdas: enteras, pedazos: f.area - enteras.length };
  }

  // ---------- Cubitos ----------
  // Cubo de n × n × n cubitos. Desde fuera (las seis caras) se ve la cáscara: n³ − (n−2)³; adentro quedan (n−2)³.
  // En un dibujo en perspectiva se ven tres caras: los cubitos que asoman son n³ − (n−1)³ y las caritas, 3n².
  function cubitos(n) {
    n = entero(n, 'el número de cubitos por arista', 1);
    return Object.assign(bloque(n, n, n), { n });
  }
  // Bloque de a × b × c cubitos (largo, ancho, alto).
  function bloque(a, b, c) {
    a = entero(a, 'el largo', 1); b = entero(b, 'el ancho', 1); c = entero(c, 'el alto', 1);
    const total = a * b * c;
    const interior = Math.max(0, a - 2) * Math.max(0, b - 2) * Math.max(0, c - 2);
    const ocultosDibujo = (a - 1) * (b - 1) * (c - 1);
    // cuántos cubitos tienen 3, 2, 1 o 0 caras pintadas si se pinta todo el bloque por fuera (solo si los tres lados ≥ 2)
    let pintadas = null;
    if (a >= 2 && b >= 2 && c >= 2) pintadas = { 3: 8, 2: 4 * ((a - 2) + (b - 2) + (c - 2)), 1: 2 * ((a - 2) * (b - 2) + (b - 2) * (c - 2) + (a - 2) * (c - 2)), 0: interior };
    return { a, b, c, total, visibles: total - interior, interior, visiblesDibujo: total - ocultosDibujo, ocultosDibujo,
      carasDibujo: a * b + b * c + a * c, carasExteriores: 2 * (a * b + b * c + a * c), pintadas,
      errores: { carasDibujo: a * b + b * c + a * c, visiblesDibujo: total - ocultosDibujo, carasExteriores: 2 * (a * b + b * c + a * c), soloCascara: total - interior } };
  }

  // ---------- Lo que crece con una magnitud ----------
  // Si algo (tiempo, pintura, abono, precio) es proporcional a una longitud, un área o un volumen, al ampliar
  // la figura por k se multiplica por k, k² o k³. 'errores' trae lo que da cada exponente equivocado.
  function segunMagnitud(valor, k, magnitud) {
    valor = numero(valor, 'el valor'); k = numero(k, 'la razón k', { positivo: true });
    const d = EXPONENTE[magnitud];
    if (!d) throw new Error(`magnitud desconocida: ${magnitud} (longitud, area o volumen)`);
    const f = Math.pow(k, d);
    return { resultado: limpio(valor * f), factor: limpio(f), exponente: d,
      errores: { lineal: limpio(valor * k), cuadrado: limpio(valor * k * k), cubo: limpio(valor * k * k * k) } };
  }
  // Escala de maqueta o de mapa 1 : e. De la maqueta a la realidad, las longitudes se multiplican por e,
  // las áreas por e² y los volúmenes por e³ (sentido 'aMaqueta': se divide).
  function maqueta(e, valor, magnitud, sentido) {
    e = numero(e, 'la escala', { positivo: true });
    const k = sentido === 'aMaqueta' ? 1 / e : e;
    if (sentido !== undefined && sentido !== 'aReal' && sentido !== 'aMaqueta') throw new Error(`sentido desconocido: ${sentido}`);
    const r = segunMagnitud(valor, k, magnitud);
    return { escala: e, real: sentido === 'aMaqueta' ? undefined : r.resultado, maqueta: sentido === 'aMaqueta' ? r.resultado : undefined,
      resultado: r.resultado, factor: r.factor, errores: r.errores };
  }

  // ---------- Cono y cilindro ----------
  // Con la misma base y la misma altura, el cilindro guarda el triple que el cono: hacen falta 3 conos.
  function conosParaLlenar(r, h) {
    const co = figura('cono', { r, h }), ci = figura('cilindro', { r, h });
    return { conos: limpio(ci.volumen / co.volumen), Vcono: co.volumen, Vcilindro: ci.volumen, pi: { Vcono: co.pi.volumen, Vcilindro: ci.pi.volumen },
      errores: { mitad: 2, sinTercio: 1 } };
  }
  // El agua en un instante t de los vertidos (t de 0 a 3). En el vertido i (i = 0, 1, 2) se vacía un cono lleno,
  // con la punta hacia abajo, en el cilindro. Con una fracción f del vertido hecha, en el cono queda (1 − f)·V
  // y su nivel es h·(1 − f)^(1/3) (conos semejantes: el volumen va con el cubo de la altura). El cilindro
  // sube (i + f)·h/3. El volumen total siempre suma (i + 1) conos.
  function vertido(r, h, t) {
    const base = conosParaLlenar(r, h), n = base.conos;
    t = numero(t, 'el tiempo del vertido');
    if (t > n + EPS) throw new Error(`son ${n} vertidos: t va de 0 a ${n}`);
    const i = Math.min(Math.floor(t + EPS), n - 1), f = Math.min(1, Math.max(0, t - i));
    const enCono = (1 - f) * base.Vcono, enCilindro = (i + f) * base.Vcono;
    const nivelCono = h * Math.cbrt(1 - f), nivelCilindro = enCilindro / (PI * r * r);
    return { vertido: i + 1, fraccion: f, completos: t >= n - EPS ? n : i, enCono, enCilindro,
      nivelCono: limpio(nivelCono), radioAgua: limpio(r * Math.cbrt(1 - f)), nivelCilindro: limpio(nivelCilindro), lleno: nivelCilindro >= h - EPS };
  }

  // ---------- ¿Y si fuera lineal? ----------
  // Una figura con k veces el área existe, pero no es semejante: hay que estirarla en una sola dirección.
  // Cuadrado → rectángulo k·l × l; triángulo equilátero → triángulo de base k·l y la misma altura;
  // círculo → elipse de semiejes k·r y r. La semejante con k veces el área tiene los lados ×√k.
  function siFueraLineal(tipo, d, k) {
    k = numero(k, 'la razón k', { positivo: true });
    const f = figura(tipo, d), sem = escalar(tipo, d, k);
    let lineal;
    if (tipo === 'cuadrado') lineal = { tipo: 'rectangulo', base: k * f.lado, altura: f.lado, vertices: [[0, 0], [k * f.lado, 0], [k * f.lado, f.lado], [0, f.lado]] };
    else if (tipo === 'triangulo') {
      if (!f.equilatero) throw new Error('el estiramiento se hace con el triángulo equilátero');
      const h = f.altura; lineal = { tipo: 'triangulo', base: k * f.lado, altura: h, vertices: [[0, 0], [k * f.lado, 0], [k * f.lado / 2, h]] };
    } else if (tipo === 'circulo') lineal = { tipo: 'elipse', rx: k * f.r, ry: f.r, centro: [k * f.r, f.r] };
    else throw new Error(`${tipo}: el botón "¿y si fuera lineal?" es para figuras planas`);
    lineal.area = tipo === 'circulo' ? PI * lineal.rx * lineal.ry : lineal.vertices ? areaPoligono(lineal.vertices) : 0;
    lineal.razonArea = lineal.area / f.area;
    // es semejante si las razones entre sus dimensiones son las de la original (solo con k = 1)
    lineal.semejante = Math.abs(k - 1) < EPS;
    return { k, original: f, semejante: sem.escalada, razonAreaSemejante: sem.razon.area, lineal, ladoParaArea: Math.sqrt(k) * f.lado, razonLadoParaArea: Math.sqrt(k) };
  }

  // ---------- Fracciones para mostrar k ----------
  // La fracción más simple con denominador hasta maxDen que vale x (o null).
  function fraccion(x, maxDen) {
    x = numero(x, 'el número'); maxDen = maxDen || 12;
    for (let q = 1; q <= maxDen; q++) { const p = Math.round(x * q); if (Math.abs(p / q - x) < 1e-9) return { num: p, den: q }; }
    return null;
  }

  return { PLANAS, SOLIDAS, figura, escalar, vertices, homotecia, lados, angulos, areaPoligono, teselar, copias, baldosas,
    cubitos, bloque, segunMagnitud, maqueta, conosParaLlenar, vertido, siFueraLineal, fraccion };
});
