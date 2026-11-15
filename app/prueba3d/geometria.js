/*
 * Geometría de la prueba 3D (app/prueba3d/): sin DOM ni three.js, para que las cuentas tengan pruebas (regla 1).
 *   seccion(caja, normal, d) → polígono de corte de una caja con el plano n·p = d (puntos en orden) y su nombre
 *   normalDe(inclinacion, giro) → normal unitaria del plano a partir de dos ángulos en grados
 *   molecula(id) → átomos y enlaces con la geometría de repulsión de pares (ángulos de libro)
 * Funciona en el navegador (window.Geo3D) y en Node.
 */
(function (root, fabrica) {
  const api = fabrica();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.Geo3D = api;
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';
  const rad = g => g * Math.PI / 180;
  const resta = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
  const punto = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
  const cruz = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
  const largo = a => Math.hypot(a[0], a[1], a[2]);
  const unit = a => { const l = largo(a) || 1; return [a[0] / l, a[1] / l, a[2] / l]; };

  // Normal: se inclina «inclinacion» grados desde la vertical y se gira «giro» grados alrededor de ella.
  function normalDe(inclinacion, giro) {
    const t = rad(inclinacion), f = rad(giro);
    return [Math.sin(t) * Math.sin(f), Math.cos(t), Math.sin(t) * Math.cos(f)];
  }

  // Caja centrada en el origen con lados a (x), b (y) y c (z).
  function vertices(caja) {
    const [a, b, c] = [caja.a / 2, caja.b / 2, caja.c / 2];
    const v = [];
    for (const x of [-a, a]) for (const y of [-b, b]) for (const z of [-c, c]) v.push([x, y, z]);
    return v;
  }
  const ARISTAS = [[0, 1], [2, 3], [4, 5], [6, 7], [0, 2], [1, 3], [4, 6], [5, 7], [0, 4], [1, 5], [2, 6], [3, 7]];
  const NOMBRES = { 3: 'triángulo', 4: 'cuadrilátero', 5: 'pentágono', 6: 'hexágono' };

  // Corte de la caja con el plano n·p = d: puntos donde el plano cruza las aristas, ordenados alrededor de su centro.
  function seccion(caja, normal, d) {
    const n = unit(normal), v = vertices(caja), pts = [];
    const agregar = p => { if (!pts.some(q => largo(resta(p, q)) < 1e-7)) pts.push(p); };
    for (const [i, j] of ARISTAS) {
      const fi = punto(n, v[i]) - d, fj = punto(n, v[j]) - d;
      if (Math.abs(fi) < 1e-9) agregar(v[i]);
      if (Math.abs(fj) < 1e-9) agregar(v[j]);
      if (fi * fj < 0) { const t = fi / (fi - fj); agregar([v[i][0] + t * (v[j][0] - v[i][0]), v[i][1] + t * (v[j][1] - v[i][1]), v[i][2] + t * (v[j][2] - v[i][2])]); }
    }
    if (pts.length < 3) return { puntos: [], lados: 0, nombre: 'sin corte', area: 0 };
    const c = pts.reduce((s, p) => [s[0] + p[0] / pts.length, s[1] + p[1] / pts.length, s[2] + p[2] / pts.length], [0, 0, 0]);
    const u = unit(resta(pts[0], c)), w = cruz(n, u);
    pts.sort((p, q) => Math.atan2(punto(resta(p, c), w), punto(resta(p, c), u)) - Math.atan2(punto(resta(q, c), w), punto(resta(q, c), u)));
    let area = 0;
    for (let k = 0; k < pts.length; k++) area += punto(n, cruz(resta(pts[k], c), resta(pts[(k + 1) % pts.length], c))) / 2;
    const lados = pts.length;
    let nombre = NOMBRES[lados] || `${lados} lados`;
    if (lados === 4) {
      const l = pts.map((p, k) => largo(resta(pts[(k + 1) % 4], p)));
      const recto = Math.abs(punto(resta(pts[1], pts[0]), resta(pts[3], pts[0]))) < 1e-6;
      nombre = recto ? (Math.abs(l[0] - l[1]) < 1e-6 ? 'cuadrado' : 'rectángulo') : 'cuadrilátero';
    }
    if (lados === 6) {
      const l = pts.map((p, k) => largo(resta(pts[(k + 1) % 6], p)));
      if (l.every(x => Math.abs(x - l[0]) < 1e-6)) nombre = 'hexágono regular';
    }
    return { puntos: pts, lados, nombre, area: Math.abs(area) };
  }

  // Moléculas con la forma que predice la repulsión de pares (ángulos de libro; distancias en unidades arbitrarias).
  function direcciones(forma) {
    const T = Math.acos(-1 / 3);                       // 109,47°: tetraedro
    switch (forma) {
      case 'lineal': return [[1, 0, 0], [-1, 0, 0]];
      case 'trigonal': return [0, 120, 240].map(g => [Math.cos(rad(g)), Math.sin(rad(g)), 0]);
      case 'tetraedro': return [[0, 1, 0], ...[0, 120, 240].map(g => [Math.sin(T) * Math.cos(rad(g)), Math.cos(T), Math.sin(T) * Math.sin(rad(g))])];
      default: return [];
    }
  }
  const MOLECULAS = {
    CO2: { nombre: 'Dióxido de carbono', central: 'C', ligandos: ['O', 'O'], forma: 'lineal', libres: 0, angulo: 180, geometria: 'lineal' },
    BF3: { nombre: 'Trifluoruro de boro', central: 'B', ligandos: ['F', 'F', 'F'], forma: 'trigonal', libres: 0, angulo: 120, geometria: 'trigonal plana' },
    CH4: { nombre: 'Metano', central: 'C', ligandos: ['H', 'H', 'H', 'H'], forma: 'tetraedro', libres: 0, angulo: 109.5, geometria: 'tetraédrica' },
    NH3: { nombre: 'Amoníaco', central: 'N', ligandos: ['H', 'H', 'H'], forma: 'tetraedro', libres: 1, angulo: 107, geometria: 'piramidal' },
    H2O: { nombre: 'Agua', central: 'O', ligandos: ['H', 'H'], forma: 'tetraedro', libres: 2, angulo: 104.5, geometria: 'angular' },
  };
  function molecula(id) {
    const m = MOLECULAS[id];
    const dirs = direcciones(m.forma);
    // Los pares libres ocupan las primeras direcciones del tetraedro (arriba): los enlaces quedan en las demás.
    const libres = dirs.slice(0, m.libres), enl = dirs.slice(m.libres);
    return Object.assign({ id }, m, {
      atomos: [{ el: m.central, pos: [0, 0, 0] }, ...m.ligandos.map((el, k) => ({ el, pos: enl[k].map(x => x * 1.6) }))],
      pares: libres.map(d => d.map(x => x * 1.1)),
    });
  }
  // Ángulo entre dos enlaces (grados) de la geometría dibujada; con pares libres, el libro lo cierra un poco.
  const anguloDibujado = mol => mol.atomos.length < 3 ? 0
    : Math.round(Math.acos(punto(unit(mol.atomos[1].pos), unit(mol.atomos[2].pos))) * 180 / Math.PI * 10) / 10;

  return { seccion, normalDe, vertices, molecula, MOLECULAS, anguloDibujado };
});
