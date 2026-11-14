/*
 * Arreglos de la tabla viva (docs/pogil-v2-rive.md §7.3): dónde va cada carta en cada arreglo. Funciones puras,
 * sin DOM: el mismo arreglo da siempre las mismas posiciones (las prueba arreglos.test.js en Node).
 *
 * Unidades: una «celda» (el componente la convierte a px). Cada arreglo devuelve
 *   { pos: [ , {x, y, visible}, … ]   índice = Z (pos[0] vacío); visible = false si la carta se guarda en el pliegue
 *     ancho, alto                      tamaño del arreglo en celdas
 *     columnas: [{x, texto}]           rótulos de arriba (grupos IUPAC), si los hay
 *     filas: [{y, texto}]              rótulos de la izquierda (periodos), si los hay
 *     huecos: [{x, y, texto}]          casillas punteadas que remiten a otra fila (57–71 y 89–103)
 *     rotulos: [{x, y, ancho, texto}]  títulos de un tramo (la pila «sin peso atómico estándar»)
 *     pliegue: null | {x, ancho, alto} la franja que guarda los grupos 3 a 12 }
 *
 * Arreglos:
 *   tabla({abierta})   la de la IUPAC: 18 grupos y las dos series aparte, como la publica la IUPAC (grupo 3 con Sc
 *                      e Y, y las casillas 57–71 y 89–103). Plegada (por defecto en el celular) solo deja los grupos
 *                      1, 2 y 13 a 18; los grupos 3 a 12 y las series se guardan en el pliegue.
 *   filaZ({columnas})  todas en fila por número atómico, cortada en renglones.
 *   filaMasa({columnas}) en fila por peso atómico estándar; las 34 que no lo tienen van a una pila aparte, por Z
 *                      (decisión de Gerson, 14 nov: un número másico no se mezcla con un peso atómico).
 */
(function (root, fabrica) {
  const nodo = typeof module === 'object' && module.exports;
  const datos = nodo ? require('./datos.js') : root.Kit.tablaDatos;
  const api = fabrica(datos);
  if (nodo) module.exports = api;
  else root.Kit.tablaArreglos = api;
})(typeof self !== 'undefined' ? self : this, function (datos) {
  'use strict';
  const { ELEMENTOS } = datos;
  const INICIO = [0, 1, 3, 11, 19, 37, 55, 87, 119];   // primer Z de cada periodo (y el que seguiría al 7)
  const ANCHO_PLIEGUE = 0.35;                          // en celdas
  const SEPARA_SERIES = 0.4;                           // aire entre la tabla y las dos series de abajo

  // Ubicación por posición en la tabla de la IUPAC (no por configuración: eso lo calcula el motor de cada escena).
  function ubicacion(Z) {
    if (!Number.isInteger(Z) || Z < 1 || Z > 118) throw new Error(`ubicacion: Z fuera de 1 a 118 (${Z})`);
    let periodo = 1;
    while (Z >= INICIO[periodo + 1]) periodo++;
    const k = Z - INICIO[periodo];   // lugar dentro del periodo, desde 0
    let grupo, serie = null;
    if (periodo === 1) grupo = Z === 1 ? 1 : 18;
    else if (periodo <= 3) grupo = k < 2 ? k + 1 : k + 11;
    else if (periodo <= 5) grupo = k + 1;
    else if (k < 2) grupo = k + 1;
    else if (k <= 16) { grupo = null; serie = periodo === 6 ? 'lantánidos' : 'actínidos'; }
    else grupo = k - 13;
    let bloque = null;   // las dos series van en su fila aparte: la tabla no les asigna bloque aquí
    if (grupo !== null) bloque = Z === 2 || grupo <= 2 ? 's' : grupo >= 13 ? 'p' : 'd';
    return { Z, periodo, grupo, serie, indiceSerie: serie ? k - 2 : null, bloque };
  }
  const UBIC = [null];
  for (let z = 1; z <= 118; z++) UBIC.push(ubicacion(z));

  const vacio = () => ({ pos: [null], columnas: [], filas: [], huecos: [], rotulos: [], pliegue: null });

  function tabla({ abierta = false } = {}) {
    const r = vacio();
    const xGrupo = g => abierta ? g - 1 : g <= 2 ? g - 1 : 2 + ANCHO_PLIEGUE + (g - 13);
    const xPliegue = 2 + ANCHO_PLIEGUE / 2 - 0.5;   // las cartas guardadas se centran en la franja
    for (let z = 1; z <= 118; z++) {
      const u = UBIC[z];
      if (u.serie) {
        r.pos.push(abierta
          ? { x: 2 + u.indiceSerie, y: 7 + SEPARA_SERIES + (u.periodo === 6 ? 0 : 1), visible: true }
          : { x: xPliegue, y: u.periodo - 1, visible: false });
      } else if (!abierta && u.grupo >= 3 && u.grupo <= 12) {
        r.pos.push({ x: xPliegue, y: u.periodo - 1, visible: false });
      } else {
        r.pos.push({ x: xGrupo(u.grupo), y: u.periodo - 1, visible: true });
      }
    }
    const grupos = abierta ? Array.from({ length: 18 }, (_, i) => i + 1) : [1, 2, 13, 14, 15, 16, 17, 18];
    r.columnas = grupos.map(g => ({ x: xGrupo(g), texto: String(g) }));
    r.filas = [1, 2, 3, 4, 5, 6, 7].map(p => ({ y: p - 1, texto: String(p) }));
    if (abierta) {
      r.huecos = [{ x: 2, y: 5, texto: '57–71' }, { x: 2, y: 6, texto: '89–103' }];
      r.ancho = 18;
      r.alto = 9 + SEPARA_SERIES;
    } else {
      r.pliegue = { x: 2, ancho: ANCHO_PLIEGUE, alto: 7 };
      r.ancho = 8 + ANCHO_PLIEGUE;
      r.alto = 7;
    }
    return r;
  }

  function enRenglones(r, zs, columnas, y0) {
    zs.forEach((z, i) => { r.pos[z] = { x: i % columnas, y: y0 + Math.floor(i / columnas), visible: true }; });
    return y0 + Math.ceil(zs.length / columnas);
  }

  function columnasValidas(c) {
    if (!Number.isInteger(c) || c < 2) throw new Error(`columnas: entero de 2 o más (${c})`);
    return c;
  }

  function filaZ({ columnas = 8 } = {}) {
    const r = vacio(); columnasValidas(columnas);
    r.pos = new Array(119).fill(null);
    r.alto = enRenglones(r, ELEMENTOS.map(e => e.Z), columnas, 0);
    r.ancho = columnas;
    return r;
  }

  // Orden por peso atómico estándar (abreviado de la CIAAW 2024). Solo los 84 que lo tienen.
  function ordenPorMasa() {
    return ELEMENTOS.filter(e => e.peso !== undefined).slice().sort((a, b) => a.peso - b.peso || a.Z - b.Z).map(e => e.Z);
  }
  const sinPeso = () => ELEMENTOS.filter(e => e.peso === undefined).map(e => e.Z);

  function filaMasa({ columnas = 8 } = {}) {
    const r = vacio(); columnasValidas(columnas);
    r.pos = new Array(119).fill(null);
    const fin = enRenglones(r, ordenPorMasa(), columnas, 0);
    const resto = sinPeso();
    r.rotulos = [{ x: 0, y: fin + 0.15, ancho: columnas, texto: `Sin peso atómico estándar (${resto.length})` }];
    r.alto = enRenglones(r, resto, columnas, fin + 1);
    r.ancho = columnas;
    return r;
  }

  // Pares vecinos en el orden por masa que quedan al revés del orden por Z: [más liviano, más pesado].
  function inversiones() {
    const o = ordenPorMasa(), r = [];
    for (let i = 1; i < o.length; i++) if (o[i - 1] > o[i]) r.push([o[i - 1], o[i]]);
    return r;
  }

  const ARREGLOS = { tabla, filaZ, filaMasa };
  function arreglo(id, opciones) {
    if (!ARREGLOS[id]) throw new Error(`arreglo desconocido: ${id}`);
    return ARREGLOS[id](opciones);
  }

  return { ubicacion, arreglo, tabla, filaZ, filaMasa, ordenPorMasa, inversiones, ANCHO_PLIEGUE };
});
