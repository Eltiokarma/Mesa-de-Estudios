/*
 * «¿Cuál pesa más?» (prototipo de calentamiento, docs/vision-pisa-agilidad-interaccion.md, sección 2).
 * Dos tarjetas con una cuenta o una cantidad cada una; el alumno toca la que vale más, o «Iguales».
 *
 * Motor sin DOM (regla 1): arma las rondas y lleva el puntaje. Cada tarjeta trae su valor exacto como
 * fracción { n, d } en unidades del SI, así la comparación nunca depende de redondeos.
 * Sirve en el navegador (window.CualPesaMas) y en Node (require).
 */
(function (root, fabrica) {
  const api = fabrica();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.CualPesaMas = api;
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  const NIVEL_MAX = 5;

  // ---------- Fracciones exactas ----------
  const mcd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a || 1; };
  const frac = (n, d = 1) => { const g = mcd(n, d); const s = d < 0 ? -1 : 1; return { n: s * n / g, d: s * d / g }; };
  const por = (a, b) => frac(a.n * b.n, a.d * b.d);
  const comparar = (a, b) => Math.sign(a.n * b.d - b.n * a.d);   // 1: a mayor, -1: b mayor, 0: iguales

  // ---------- Formato (coma decimal, como en el examen) ----------
  const SUP = { 0: '⁰', 1: '¹', 2: '²', 3: '³', 4: '⁴', 5: '⁵', 6: '⁶', 7: '⁷', 8: '⁸', 9: '⁹' };
  const sup = k => String(k).split('').map(c => SUP[c]).join('');
  // Decimal exacto con coma: 0.25 → «0,25». Solo para números con pocas cifras decimales.
  const dec = x => String(Math.round(x * 1000) / 1000).replace('.', ',');
  // Valor para mostrar después de responder: entero, o decimal con dos cifras y «≈».
  function mostrar(v) {
    if (v.d === 1) return String(v.n);
    const x = v.n / v.d;
    const exacto = Math.round(x * 100) / 100 === x;
    return (exacto ? '' : '≈ ') + dec(Math.round(x * 100) / 100);
  }

  const FRACCIONES = [
    ['½', 1, 2], ['¼', 1, 4], ['¾', 3, 4], ['⅓', 1, 3], ['⅔', 2, 3], ['⅕', 1, 5], ['⅖', 2, 5], ['⅗', 3, 5], ['⅘', 4, 5],
  ];
  // Razones de los triángulos notables (37°-53° y 30°-60°): todas exactas como fracción.
  const NOTABLES = [
    ['sen 37°', 3, 5], ['cos 37°', 4, 5], ['tg 37°', 3, 4], ['sen 53°', 4, 5], ['cos 53°', 3, 5], ['tg 53°', 4, 3],
    ['sen 30°', 1, 2], ['cos 60°', 1, 2], ['tg 45°', 1, 1],
  ];
  // Unidades: factor exacto al SI (m/s, m, kg, m³).
  const UNIDADES = {
    velocidad: { si: 'm/s', lista: [['km/h', frac(5, 18)], ['m/s', frac(1)]] },
    longitud: { si: 'm', lista: [['km', frac(1000)], ['m', frac(1)], ['cm', frac(1, 100)]] },
    masa: { si: 'kg', lista: [['kg', frac(1)], ['g', frac(1, 1000)]] },
    volumen: { si: 'm³', lista: [['L', frac(1, 1000)], ['cm³', frac(1, 1000000)], ['mL', frac(1, 1000000)]] },
  };

  const tarjeta = (texto, valor, dim = 'numero') => ({ texto, valor, dim });

  // ---------- Familias de tarjetas por nivel ----------
  // Cada familia recibe el azar y devuelve una tarjeta. Las de unidades reciben además la dimensión.
  const FAMILIAS = {
    suma: r => { const a = r.entero(2, 15), b = r.entero(2, 15); return tarjeta(`${a} + ${b}`, frac(a + b)); },
    resta: r => { const a = r.entero(8, 25), b = r.entero(1, a - 2); return tarjeta(`${a} − ${b}`, frac(a - b)); },
    producto: r => { const a = r.entero(2, 9), b = r.entero(2, 9); return tarjeta(`${a} × ${b}`, frac(a * b)); },
    potencia: r => {
      const [b, e] = r.elegir([[2, 3], [2, 4], [2, 5], [2, 6], [3, 2], [3, 3], [4, 2], [4, 3], [5, 2], [5, 3], [6, 2], [7, 2], [8, 2], [9, 2], [10, 2]]);
      return tarjeta(`${b}${sup(e)}`, frac(b ** e));
    },
    decimal: r => {
      const [t, f] = r.elegir([['0,5', frac(1, 2)], ['0,25', frac(1, 4)], ['0,2', frac(1, 5)]]);
      const x = r.elegir([8, 12, 16, 20, 24, 40, 60, 80]);
      return r.moneda() ? tarjeta(`${t} × ${x}`, por(f, frac(x))) : tarjeta(`${x} ÷ ${t}`, frac(x * f.d, f.n));
    },
    fraccion: r => {
      const [t, n, d] = r.elegir(FRACCIONES);
      const x = d * r.entero(2, 12);
      return tarjeta(`${t} de ${x}`, frac(n * x, d));
    },
    porcentaje: r => {
      const p = r.elegir([10, 20, 25, 50, 75]);
      const x = r.elegir([20, 40, 60, 80, 120, 200]);
      return tarjeta(`${p} % de ${x}`, frac(p * x, 100));
    },
    notable: r => {
      const [t, n, d] = r.elegir(NOTABLES);
      const k = d * r.entero(1, 6) * (d === 1 ? 2 : 1);
      return tarjeta(`${k} ${t}`, frac(k * n, d));
    },
    cientifica: r => {
      const c = r.elegir([[1, '1'], [frac(1, 2), '0,5'], [2, '2'], [3, '3'], [4, '4'], [frac(5, 2), '2,5']]);
      const e = r.entero(2, 3);
      const v = typeof c[0] === 'number' ? frac(c[0] * 10 ** e) : por(c[0], frac(10 ** e));
      return tarjeta(c[1] === '1' ? `10${sup(e)}` : `${c[1]} × 10${sup(e)}`, v);
    },
    unidad: (r, dim) => {
      const u = UNIDADES[dim];
      const [nombre, f] = r.elegir(u.lista);
      let x;
      if (nombre === 'km/h') x = frac(18 * r.entero(1, 6));        // 18 km/h = 5 m/s: siempre exacto
      else if (nombre === 'm/s') x = frac(r.elegir([4, 5, 6, 8, 10, 12, 15, 18, 20, 25, 30]));
      else if (nombre === 'km') x = frac(r.entero(1, 6), 2);         // 0,5 km a 3 km
      else if (nombre === 'm') x = frac(r.elegir([500, 800, 1000, 1200, 1500, 2000, 2500, 3000, 1, 2, 3]));
      else if (nombre === 'cm') x = frac(r.elegir([50, 75, 100, 120, 150, 180, 200, 250, 300]));
      else if (nombre === 'kg') x = frac(r.entero(1, 6), 2);
      else if (nombre === 'g') x = frac(r.elegir([250, 400, 500, 750, 1000, 1200, 1500, 2000, 2500, 3000]));
      else if (nombre === 'L') x = frac(r.entero(1, 6), 2);
      else x = frac(r.elegir([250, 400, 500, 750, 1000, 1200, 1500, 2000, 2500, 3000]));
      return tarjeta(`${dec(x.n / x.d)} ${nombre}`, por(x, f), dim);
    },
  };

  // Qué familias entran en cada nivel. Del 3 en adelante se mezclan las de antes, para que no se olviden.
  const NIVELES = {
    1: ['suma', 'resta'],
    2: ['producto', 'potencia', 'suma'],
    3: ['decimal', 'fraccion', 'porcentaje', 'producto'],
    4: ['unidad', 'porcentaje', 'potencia'],
    5: ['notable', 'cientifica', 'unidad', 'fraccion'],
  };
  const DIMS = Object.keys(UNIDADES);

  // Una tarjeta del nivel, de la dimensión pedida (o de cualquiera si dim es null).
  function sacar(r, nivel, dim) {
    const familias = NIVELES[nivel].filter(f => (f === 'unidad') === (dim !== null && dim !== 'numero'));
    const f = r.elegir(familias.length ? familias : NIVELES[nivel].filter(x => x !== 'unidad'));
    return f === 'unidad' ? FAMILIAS.unidad(r, dim) : FAMILIAS[f](r);
  }

  // Una ronda: { izq, der, respuesta: 'izq' | 'der' | 'iguales' }.
  // Una de cada cuatro sale con valores iguales (y textos distintos); las demás, con valores cercanos
  // (la mayor no pasa de 1,8 veces la menor), para que haya que pensar y no baste con mirar el tamaño.
  function ronda(r, nivel) {
    const nv = Math.min(NIVEL_MAX, Math.max(1, nivel | 0));
    const conUnidad = NIVELES[nv].includes('unidad') && r.sig() < 0.45;
    const dim = conUnidad ? r.elegir(DIMS) : 'numero';
    const a = sacar(r, nv, conUnidad ? dim : null);
    const quiereIguales = r.sig() < 0.25;
    let b = null;
    for (let i = 0; i < 400 && !b; i++) {
      const c = sacar(r, nv, conUnidad ? dim : null);
      if (mismoTexto(a.texto, c.texto)) continue;   // «2 × 9» y «9 × 2» cuentan como la misma
      const cmp = comparar(a.valor, c.valor);
      if (quiereIguales ? cmp === 0 : cmp !== 0 && cercanos(a.valor, c.valor)) b = c;
    }
    // No apareció el par buscado: primero uno cercano y, si tampoco, cualquiera distinto.
    for (const pide of [c => cercanos(a.valor, c.valor), () => true]) {
      for (let i = 0; i < 400 && !b; i++) {
        const c = sacar(r, nv, conUnidad ? dim : null);
        if (!mismoTexto(a.texto, c.texto) && comparar(a.valor, c.valor) !== 0 && pide(c)) b = c;
      }
    }
    const [izq, der] = r.moneda() ? [a, b] : [b, a];
    const cmp = comparar(izq.valor, der.valor);
    return { nivel: nv, izq, der, respuesta: cmp > 0 ? 'izq' : cmp < 0 ? 'der' : 'iguales', si: UNIDADES[izq.dim] ? UNIDADES[izq.dim].si : '' };
  }
  const mismoTexto = (x, y) => [...x].sort().join('') === [...y].sort().join('');
  function cercanos(a, b) {
    const [men, may] = comparar(a, b) < 0 ? [a, b] : [b, a];
    return may.n * men.d * 10 <= men.n * may.d * 18;   // may / men ≤ 1,8
  }

  // ---------- Puntaje ----------
  // 100 puntos por acierto, por el multiplicador de la racha (x2 desde 3, x3 desde 6, x4 desde 10).
  // Sube de nivel con 4 aciertos seguidos en el nivel; baja con 2 errores seguidos. El error corta la racha.
  const multiplicador = racha => racha >= 10 ? 4 : racha >= 6 ? 3 : racha >= 3 ? 2 : 1;
  const nuevo = () => ({ puntos: 0, racha: 0, mejorRacha: 0, nivel: 1, nivelMax: 1, enNivel: 0, errores: 0, aciertos: 0, fallos: 0 });

  function anotar(e, correcto) {
    const s = { ...e };
    let cambio = 0, ganados = 0;
    if (correcto) {
      s.racha++; s.aciertos++; s.enNivel++; s.errores = 0;
      ganados = 100 * multiplicador(s.racha);
      s.puntos += ganados;
      if (s.enNivel >= 4 && s.nivel < NIVEL_MAX) { s.nivel++; s.enNivel = 0; cambio = 1; }
    } else {
      s.racha = 0; s.fallos++; s.enNivel = 0; s.errores++;
      if (s.errores >= 2 && s.nivel > 1) { s.nivel--; s.errores = 0; cambio = -1; }
    }
    s.mejorRacha = Math.max(s.mejorRacha, s.racha);
    s.nivelMax = Math.max(s.nivelMax, s.nivel);
    return { estado: s, ganados, cambio, multiplicador: multiplicador(s.racha) };
  }

  return { NIVEL_MAX, NIVELES, FAMILIAS, UNIDADES, frac, comparar, mostrar, ronda, nuevo, anotar, multiplicador };
});
