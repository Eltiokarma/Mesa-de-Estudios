/*
 * Generador: diagramas de flujo y operadores (razonamiento matemático).
 * Formato "predicciones" (docs/arquitectura.md). Funciona en el navegador
 * (window.Generadores['rm-diagramas-flujo']) y en Node (require). No usa ningún motor.
 *
 * Cada problema de diagrama se arma como un programa: una lista de bloques (inicio, asignación,
 * leer, decisión, imprimir, fin) y, en cada uno, a qué bloque se pasa después. Un intérprete
 * pequeño (ejecutar) lo corre y guarda la traza; el mismo programa se dibuja en SVG (dibujar)
 * y se describe con palabras en el alt. Los errores se calculan corriendo el programa con un
 * cambio (una vuelta menos, la desigualdad del borde cambiada, las asignaciones en otro orden…).
 *
 * Tipos y su _datos:
 *   acumulador       { tipo, sub: 'suma'|'producto', termino: 'k'|'k2'|'2k+1', k0, p, forma: 'abajo'|'arriba',
 *                      op: '>'|'>='|'<'|'<=', L, orden: 'acum'|'cont', imprime: 'S'|'P'|'k' }
 *                    S ← 0 (o P ← 1), k ← k0; en cada vuelta S ← S + término (o P ← P × k) y k ← k + p.
 *                    'abajo': se pregunta ¿S op L? al final de la vuelta y se sale con Sí.
 *                    'arriba': se pregunta ¿k op L? antes de la vuelta y se repite con Sí.
 *   contador         { tipo, a, p, opFin: '>'|'>=', b, expr: clave de EXPR_X, m, pide: 'cuantos'|'suma' }
 *                    n ← a; x ← expr(n); si x es múltiplo de m, Imprimir x; n ← n + p; ¿n opFin b? Sí → Fin.
 *   dos-contadores   { tipo, sub: 'primo'|'multiplo', a, opFin, b, d, imprime: 'B-A'|'A-B' }
 *                    primo: si n es primo, A ← A + 1; si no, B ← B + 1. multiplo: si n es múltiplo de d,
 *                    A ← A + n; si no, B ← B + 1. n ← n + 1 hasta ¿n opFin b?; Imprimir la resta.
 *   descuentos       { tipo, P, T1, T2, op1, op2, a, b, c, E }
 *                    Leer P; ¿P op1 T1? Sí: D ← (1 − a/100)P y D ← (1 − b/100)D. No: ¿P op2 T2? Sí:
 *                    D ← (1 − c/100)P; No: D ← P. Imprimir D + E (E es el envío).
 *   cifras           { tipo, termino: 'k2'|'k3'|'kk1', n, orden, sub: 'una-vez'|'reducir' }
 *                    S ← 0, k ← 1; S ← S + término y k ← k + 1 hasta ¿k > n?; luego la suma de cifras
 *                    de S una vez (R) o repetida hasta que quede una cifra.
 *   potencias-div    { tipo, sub: 'base', N, b, orden } o { tipo, sub: 'mitades', N, regla: '3n+1'|'n+1' }
 *                    base: S ← S + resto de n ÷ b y n ← cociente de n ÷ b hasta ¿n = 0?; Imprimir S.
 *                    mitades: si n es par, n ← n ÷ 2; si no, n ← regla; S ← S + n, hasta ¿n = 1?; Imprimir S.
 *   impresos         { tipo, n0, m, T, d, cond: 'par'|'mult3', pide: 'cifras'|'suma' }
 *                    Leer N; repetir: N ← N × m, Imprimir N, ¿N > T? No → otra vuelta; Sí → N ← N ÷ d y ¿cond?
 *                    (Sí → Fin; No → otra vuelta). Se pide la suma de lo impreso o la suma de sus cifras.
 *                    (UNMSM 2023-I: n0 = 3, m = 10, T = 600, d = 5, par; semilla 'unmsm-2023-I-29'.)
 *   bucles           { tipo, N0, T, c, p, q, m }
 *                    Leer N; K ← N ÷ 2; ¿K > T? No → N ← K² y otra vez K ← N ÷ 2; Sí → K ← N − c y ¿K múltiplo de m?
 *                    (No → N ← pK + q y otra vez K ← N − c; Sí → Imprimir K). Hay dos bucles que vuelven a cajas distintas.
 *                    (UNMSM 2026-I: N0 = 16, T = 71, c = 73, p = 2, q = 3, m = 2; semilla 'unmsm-2026-I-24'.)
 *   operador         { tipo, regla, forma: 'izq'|'der'|'mixto', x, y, z, regla2 }
 *                    a ◇ b definido por una regla; se evalúa (x ◇ y) ◇ z, x ◇ (y ◇ z) o (x ◇ y) ∗ z.
 *
 * calc: { resolver(datos) → respuesta, programa(datos) → { bloques, columnas }, ejecutar(prog, opciones),
 *         evaluar(expr, estado), esPrimo(n), sumaCifras(n), operar(regla, a, b) }.
 *
 * Errores (todos hipótesis; los informes no traen cifras para diagramas de flujo):
 *   RMP20 bucle corrido en una vuelta (una vuelta menos, una más, asignaciones en otro orden)
 *   RMP21 borde de la condición (> leído como ≥, < como ≤, o al revés)
 *   RMP22 lo impreso o contado equivocado (otra variable, todas las vueltas, la condición sobre n)
 *   RMP23 bloque saltado (la suma de cifras final, el segundo descuento, el envío, la operación de afuera)
 *   RMP24 primalidad mal decidida (el 1 como primo, todo impar como primo)
 *   RMP25 operador mal leído (el paréntesis ignorado, los operandos conmutados, un operador por otro)
 *   AR1 (descuentos sumados, parcial) y AR5 (el monto descontado por el que se paga, hipótesis).
 * Errores de «impresos» y «bucles» (cierre-100, 12 nov 2026; hipótesis):
 *   RMP106 sumar también lo que no se imprime (el valor tras la división); RMP107 quedarse con la suma sin sumar
 *   sus cifras; RMP108 salir sin probar la última condición (Fin apenas pasa de T; imprimir K sin ver si es
 *   múltiplo); RMP109 contar el número que se ingresa como si se imprimiera; y de los viejos RMP20 (vueltas,
 *   la flecha de vuelta a otra caja, la variable equivocada), RMP21 (borde) y RMP22 (imprimir N en vez de K).
 */
(function (root, fabrica) {
  const nodo = typeof module === 'object' && module.exports;
  const api = fabrica(nodo ? require('../../nucleo/azar.js') : root.Azar,
                      nodo ? require('../../nucleo/predicciones.js') : root.Predicciones);
  if (nodo) module.exports = api;
  else (root.Generadores = root.Generadores || {})[api.id] = api;
})(typeof self !== 'undefined' ? self : this, function (Azar, P) {
  'use strict';
  const ID = 'rm-diagramas-flujo';
  const RM = 'docs/investigacion/aritmetica-razonamiento-ideas-erroneas.md';
  const h = (id, valor, explicacion) => ({ id, valor, explicacion, respaldo: 'hipotesis', fuente: null });
  const f = x => P.formatear(x, 2);
  const v = P.v;
  const xml = P.xml;
  const redondo = x => Math.round(x * 1e6) / 1e6;
  // Soles siempre con dos decimales: «S/ 563,20».
  const soles = x => { const [e, d] = Math.abs(x).toFixed(2).split('.'); return `S/ ${x < 0 ? '−' : ''}${f(Number(e))},${d}`; };

  // ---------------- Expresiones ----------------
  // número | 'variable' | [op, a, b]; op: + − * / ^ div mod cifras. Condiciones: > >= < <= = primo mult par.
  function esPrimo(n) { if (n < 2 || !Number.isInteger(n)) return false; for (let d = 2; d * d <= n; d++) if (n % d === 0) return false; return true; }
  const sumaCifras = n => String(Math.abs(Math.round(n))).split('').reduce((s, c) => s + Number(c), 0);
  function evaluar(e, s) {
    if (typeof e === 'number') return e;
    if (typeof e === 'string') { if (!(e in s)) throw new Error(`variable sin valor: ${e}`); return s[e]; }
    const [op, a, b] = e;
    const x = evaluar(a, s), y = b === undefined ? undefined : evaluar(b, s);
    switch (op) {
      case '+': return x + y;
      case '-': return x - y;
      case '*': return x * y;
      case '/': return x / y;
      case '^': return x ** y;
      case 'div': return Math.floor(x / y);
      case 'mod': return ((x % y) + y) % y;
      case 'cifras': return sumaCifras(x);
      case '>': return x > y;
      case '>=': return x >= y;
      case '<': return x < y;
      case '<=': return x <= y;
      case '=': return x === y;
      case 'primo': return esPrimo(x);
      case 'mult': return x % y === 0;
      case 'par': return x % 2 === 0;
      default: throw new Error(`operación desconocida: ${op}`);
    }
  }
  // Texto de una expresión como lista de partes: cadenas y { v, t } (variables, para el color).
  const PREC = { '+': 1, '-': 1, '*': 2, '/': 2, '^': 4 };
  const SUP = { 2: '²', 3: '³' };
  function partes(e, min = 0) {
    if (typeof e === 'number') return [f(e)];
    if (typeof e === 'string') return [{ v: e, t: e }];
    const [op, a, b] = e;
    if (op === 'div') return ['cociente de ', ...partes(a, 3), ' ÷ ', ...partes(b, 3)];
    if (op === 'mod') return ['resto de ', ...partes(a, 3), ' ÷ ', ...partes(b, 3)];
    if (op === 'cifras') return ['suma de cifras de ', ...partes(a, 3)];
    let r;
    if (op === '+' || op === '-') r = [...partes(a, 1), op === '+' ? ' + ' : ' − ', ...partes(b, 2)];
    else if (op === '*' && typeof a === 'number' && Number.isInteger(a) && (typeof b === 'string' || b[0] === '^')) r = [f(a), ...partes(b, 3)];
    else if (op === '*') r = [...partes(a, 2), ' × ', ...partes(b, 3)];
    else if (op === '/') r = [...partes(a, 2), ' ÷ ', ...partes(b, 3)];
    else if (op === '^') r = [...partes(a, 5), SUP[b]];
    return PREC[op] < min ? ['(', ...r, ')'] : r;
  }
  const OPS = { '>': ' > ', '>=': ' ≥ ', '<': ' < ', '<=': ' ≤ ', '=': ' = ' };
  function partesCond(c) {
    const [op, a, b] = c;
    if (op === 'primo') return ['¿', ...partes(a), ' es primo?'];
    if (op === 'mult') return ['¿', ...partes(a), ` es múltiplo de ${b}?`];
    if (op === 'par') return ['¿', ...partes(a), ' es par?'];
    return ['¿', ...partes(a), OPS[op], ...partes(b), '?'];
  }
  const plano = ps => ps.map(x => (typeof x === 'string' ? x : x.t)).join('');
  // Partes de la app: las variables con su color (P.v), el resto como texto.
  const app = ps => ps.map(x => (typeof x === 'string' ? x : v(x.v, x.t)));
  const asigPartes = ([x, e]) => [{ v: x, t: x }, ' ← ', ...partes(e)];
  const opTexto = op => OPS[op].trim();
  const BORDE = { '>': '>=', '>=': '>', '<': '<=', '<=': '<' };

  // ---------------- Intérprete ----------------
  // bloque: { tipo: 'inicio'|'asig'|'leer'|'dec'|'imp'|'fin', ops, vars, cond, expr, sig, si, no, sigue, traza }
  // sigue: en la decisión de un bucle, la rama ('si' o 'no') que vuelve a repetir.
  // opciones.delta = −1 o +1 corre el bucle `bucle` una vuelta menos o una más.
  function ejecutar(prog, opciones = {}) {
    const { entrada = {}, delta = 0, bucle = prog.bucle } = opciones;
    const K = delta ? ejecutar(prog, { entrada }).vueltas[bucle] : null;
    const s = {}, impresos = [], traza = [], vueltas = {};
    let i = 0, pasos = 0;
    for (;;) {
      if (++pasos > 20000) throw new Error('el diagrama no termina');
      const b = prog.bloques[i];
      if (b.tipo === 'fin') break;
      if (b.tipo === 'inicio') { i = b.sig; continue; }
      if (b.tipo === 'leer') { for (const x of b.vars) s[x] = entrada[x]; i = b.sig; continue; }
      if (b.tipo === 'asig') {
        for (const [x, e] of b.ops) s[x] = redondo(evaluar(e, s));
        if (b.traza) traza.push({ ...s });
        i = b.sig; continue;
      }
      if (b.tipo === 'imp') { const val = redondo(evaluar(b.expr, s)); impresos.push(val); if (b.traza) traza.push({ ...s, _imp: val, _i: i }); i = b.sig; continue; }
      if (b.tipo === 'dec') {
        let r = evaluar(b.cond, s);
        if (b.sigue) {
          const c = vueltas[i] || 0, repite = (r ? 'si' : 'no') === b.sigue;
          if (delta && i === bucle) {
            if (delta < 0 && repite && c === K - 1) r = !r;
            if (delta > 0 && !repite && c === K) r = !r;
          }
          if ((r ? 'si' : 'no') === b.sigue) vueltas[i] = c + 1;
        }
        if (b.traza) traza.push({ ...s, _cond: r, _i: i });
        i = r ? b.si : b.no; continue;
      }
      throw new Error(`bloque desconocido: ${b.tipo}`);
    }
    return { impresos, estado: s, traza, vueltas };
  }
  const ultimo = r => r.impresos[r.impresos.length - 1];
  const copia = prog => JSON.parse(JSON.stringify(prog));

  // ---------------- Dibujo ----------------
  const CX = 175, GAP = 26, ANCHO = 368;
  const LANE_DER = k => 312 + 20 * k, LANE_IZQ = k => 36 - 20 * k;
  function tspans(ps, colores) {
    // Junta las cadenas seguidas y pinta las variables con su color.
    return ps.map(x => (typeof x === 'string' ? xml(x)
      : `<tspan style="fill:var(--c-${colores[x.v] || 'o'});font-weight:bold">${xml(x.t)}</tspan>`)).join('');
  }
  function lineasDe(b) {
    if (b.tipo === 'inicio') return [['Inicio']];
    if (b.tipo === 'fin') return [['Fin']];
    if (b.tipo === 'leer') return [['Leer ', ...b.vars.map(x => ({ v: x, t: x }))]];
    if (b.tipo === 'asig') return b.ops.map(asigPartes);
    if (b.tipo === 'imp') return [['Imprimir ', ...partes(b.expr)]];
    return [partesCond(b.cond)];
  }
  const flecha = (x, y, dir) => {
    const d = { abajo: [[-5, -8], [5, -8]], der: [[-8, -5], [-8, 5]], izq: [[8, -5], [8, 5]] }[dir];
    return `<polygon points="${x},${y} ${x + d[0][0]},${y + d[0][1]} ${x + d[1][0]},${y + d[1][1]}" style="fill:currentColor"/>`;
  };
  function dibujar(prog, colores) {
    const B = prog.bloques, geo = [];
    let y = 8;
    for (const b of B) {
      const lineas = lineasDe(b);
      let alto, ancho;
      if (b.tipo === 'inicio' || b.tipo === 'fin') { alto = 32; ancho = 110; }
      else if (b.tipo === 'dec') { alto = 62; ancho = 230; }
      else if (b.tipo === 'asig') { alto = 12 + 22 * lineas.length; ancho = 190; }
      else { alto = 34; ancho = 196; }
      geo.push({ top: y, bot: y + alto, cy: y + alto / 2, alto, ancho, lineas });
      y += alto + GAP;
    }
    const H = y - GAP + 8;
    // Aristas: las que van al bloque siguiente bajan por el centro; las demás, por un carril.
    const aristas = [];
    B.forEach((b, i) => {
      const sal = b.tipo === 'dec' ? [['Sí', b.si], ['No', b.no]] : b.tipo === 'fin' ? [] : [[null, b.sig]];
      for (const [et, j] of sal) aristas.push({ de: i, a: j, et, recta: j === i + 1 });
    });
    const carriles = { izq: [], der: [] };
    const lane = aristas.filter(a => !a.recta).map(a => {
      const lado = (B[a.de].lado && B[a.de].lado[a.et || '_']) || (a.a < a.de ? 'izq' : 'der');
      const y1 = geo[a.de].cy, y2 = geo[a.a].top - 13;
      return { ...a, lado, lo: Math.min(y1, y2), hi: Math.max(y1, y2) };
    }).sort((p, q) => (p.hi - p.lo) - (q.hi - q.lo));
    for (const a of lane) {
      const cs = carriles[a.lado];
      let k = 0;
      while (cs[k] && cs[k].some(o => o.a !== a.a && !(a.hi < o.lo - 2 || a.lo > o.hi + 2))) k++;
      (cs[k] = cs[k] || []).push(a); a.k = k;
    }
    const out = [];
    // Formas
    B.forEach((b, i) => {
      const g = geo[i], x0 = CX - g.ancho / 2, x1 = CX + g.ancho / 2;
      const est = 'style="fill:var(--card);stroke:currentColor;stroke-width:1.5"';
      if (b.tipo === 'inicio' || b.tipo === 'fin') out.push(`<rect x="${x0}" y="${g.top}" width="${g.ancho}" height="${g.alto}" rx="16" ${est}/>`);
      else if (b.tipo === 'asig') out.push(`<rect x="${x0}" y="${g.top}" width="${g.ancho}" height="${g.alto}" ${est}/>`);
      else if (b.tipo === 'dec') out.push(`<polygon points="${CX},${g.top} ${x1},${g.cy} ${CX},${g.bot} ${x0},${g.cy}" ${est}/>`);
      else out.push(`<polygon points="${x0 + 12},${g.top} ${x1},${g.top} ${x1 - 12},${g.bot} ${x0},${g.bot}" ${est}/>`);
      const n = g.lineas.length;
      g.lineas.forEach((ps, k) => {
        const ty = g.cy + (k - (n - 1) / 2) * 22 + 5;
        out.push(`<text x="${CX}" y="${ty}" text-anchor="middle" font-size="15" style="fill:currentColor">${tspans(ps, colores)}</text>`);
      });
    });
    // Aristas rectas
    for (const a of aristas.filter(a => a.recta)) {
      const g = geo[a.de], t = geo[a.a];
      out.push(`<line x1="${CX}" y1="${g.bot}" x2="${CX}" y2="${t.top - 1}" style="stroke:currentColor;stroke-width:1.5"/>`, flecha(CX, t.top, 'abajo'));
      if (a.et) out.push(`<text x="${CX + 8}" y="${g.bot + 15}" font-size="13" style="fill:currentColor">${a.et}</text>`);
    }
    // Aristas por carril
    const entradas = new Set();
    for (const a of lane) {
      const g = geo[a.de], t = geo[a.a], b = B[a.de];
      const lx = a.lado === 'der' ? LANE_DER(a.k) : LANE_IZQ(a.k);
      const sx = a.lado === 'der' ? CX + g.ancho / 2 - (b.tipo === 'imp' || b.tipo === 'leer' ? 6 : 0) : CX - g.ancho / 2 + (b.tipo === 'imp' || b.tipo === 'leer' ? 6 : 0);
      const ye = t.top - 13;
      const xf = a.lado === 'der' ? CX + 2 : CX - 2;
      out.push(`<polyline points="${sx},${g.cy} ${lx},${g.cy} ${lx},${ye} ${xf},${ye}" style="fill:none;stroke:currentColor;stroke-width:1.5"/>`,
        flecha(CX, ye, a.lado === 'der' ? 'izq' : 'der'));
      if (a.et) out.push(a.lado === 'der'
        ? `<text x="${sx + 3}" y="${g.cy - 6}" font-size="13" style="fill:currentColor">${a.et}</text>`
        : `<text x="${sx - 3}" y="${g.cy - 6}" text-anchor="end" font-size="13" style="fill:currentColor">${a.et}</text>`);
      entradas.add(a.a);
    }
    for (const j of entradas) {
      if (aristas.some(a => a.recta && a.a === j)) continue;
      const t = geo[j];
      out.push(`<line x1="${CX}" y1="${t.top - 13}" x2="${CX}" y2="${t.top - 1}" style="stroke:currentColor;stroke-width:1.5"/>`, flecha(CX, t.top, 'abajo'));
    }
    return `<svg viewBox="0 0 ${ANCHO} ${H}" xmlns="http://www.w3.org/2000/svg">${out.join('')}</svg>`;
  }
  // El algoritmo con palabras, paso a paso (para lectores de pantalla y para revisar sin ver la figura).
  function describir(prog) {
    const B = prog.bloques, ir = (j, i) => (j === i + 1 ? `sigue al paso ${j + 1}` : j < i ? `vuelve al paso ${j + 1}` : `salta al paso ${j + 1}`);
    const pasos = B.map((b, i) => {
      const n = `Paso ${i + 1}: `;
      if (b.tipo === 'inicio') return `${n}Inicio.`;
      if (b.tipo === 'fin') return `${n}Fin.`;
      const luego = j => (j === i + 1 ? '' : ` Luego ${ir(j, i)}.`);
      if (b.tipo === 'leer') return `${n}leer ${b.vars.join(', ')}.${luego(b.sig)}`;
      if (b.tipo === 'asig') return `${n}${b.ops.map(o => `${o[0]} toma el valor de ${plano(partes(o[1]))}`).join('; después, ')}.${luego(b.sig)}`;
      if (b.tipo === 'imp') return `${n}imprimir ${plano(partes(b.expr))}.${luego(b.sig)}`;
      return `${n}pregunta ${plano(partesCond(b.cond))} Si es sí, ${ir(b.si, i)}; si es no, ${ir(b.no, i)}.`;
    });
    return 'Diagrama de flujo. ' + pasos.join(' ');
  }
  // Tabla de la traza (figura de la solución).
  function tablaTraza(cols, filas, colores, condTexto) {
    const todas = ['N.º', ...cols, ...(condTexto ? [condTexto] : [])];
    const anchos = todas.map((c, i) => (i === 0 ? 62 : condTexto && i === todas.length - 1 ? 130 : 56));
    const W = Math.max(300, anchos.reduce((a, b) => a + b, 0) + 10);
    const out = []; let x = 5;
    const xs = anchos.map(a => { const c = x + a / 2; x += a; return c; });
    const fila = 24, H = fila * (filas.length + 1) + 10;
    todas.forEach((c, i) => {
      const col = i > 0 && i <= cols.length ? ` style="fill:var(--c-${colores[c] || 'o'});font-weight:bold"` : ' style="fill:currentColor;font-weight:bold"';
      out.push(`<text x="${xs[i]}" y="22" text-anchor="middle" font-size="14"${col}>${xml(c)}</text>`);
    });
    out.push(`<line x1="5" y1="30" x2="${x}" y2="30" style="stroke:currentColor"/>`);
    filas.forEach((r, k) => {
      const yy = 30 + fila * (k + 1) - 6;
      const celdas = [String(k + 1), ...cols.map(c => f(r[c])), ...(condTexto ? [r._cond ? 'Sí' : 'No'] : [])];
      celdas.forEach((t, i) => out.push(`<text x="${xs[i]}" y="${yy}" text-anchor="middle" font-size="14" style="fill:currentColor">${xml(t)}</text>`));
    });
    const alt = `Tabla de la traza. Columnas: ${todas.join(', ')}. ` + filas.map((r, k) => `Fila ${k + 1}: ${cols.map(c => `${c} = ${f(r[c])}`).join(', ')}${condTexto ? `, ${r._cond ? 'sí' : 'no'}` : ''}.`).join(' ');
    return { svg: `<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">${out.join('')}</svg>`, alt };
  }
  const trazaTexto = (cols, filas) => filas.map((r, k) => `${k + 1}.ª: ${cols.map(c => `${c} = ${f(r[c])}`).join(', ')}${r._cond === undefined ? '' : ` (${r._cond ? 'Sí' : 'No'})`}`).join(' · ');

  // ---------------- Programas por tipo ----------------
  const TERM = { k: 'k', k2: ['^', 'k', 2], k3: ['^', 'k', 3], '2k+1': ['+', ['*', 2, 'k'], 1], kk1: ['*', 'k', ['+', 'k', 1]] };
  const EXPR_X = {
    '2n+3': ['+', ['*', 2, 'n'], 3], '3n-1': ['-', ['*', 3, 'n'], 1], '5n+2': ['+', ['*', 5, 'n'], 2],
    'n2+1': ['+', ['^', 'n', 2], 1], 'n2-n': ['-', ['^', 'n', 2], 'n'], '4n+1': ['+', ['*', 4, 'n'], 1], 'n2+2': ['+', ['^', 'n', 2], 2],
  };
  function programa(d) {
    const I = (sig) => ({ tipo: 'inicio', sig }), F = { tipo: 'fin' };
    if (d.tipo === 'acumulador') {
      const A = d.sub === 'producto' ? 'P' : 'S';
      const acum = d.sub === 'producto' ? [A, ['*', A, 'k']] : [A, ['+', A, TERM[d.termino]]];
      const cont = ['k', ['+', 'k', d.p]];
      const cuerpo = d.orden === 'acum' ? [acum, cont] : [cont, acum];
      const init = [[A, d.sub === 'producto' ? 1 : 0], ['k', d.k0]];
      const bloques = d.forma === 'abajo'
        ? [I(1), { tipo: 'asig', ops: init, sig: 2 }, { tipo: 'asig', ops: cuerpo, sig: 3 },
           { tipo: 'dec', cond: [d.op, A, d.L], si: 4, no: 2, sigue: 'no', traza: true }, { tipo: 'imp', expr: d.imprime, sig: 5 }, F]
        : [I(1), { tipo: 'asig', ops: init, sig: 2 }, { tipo: 'dec', cond: [d.op, 'k', d.L], si: 3, no: 4, sigue: 'si', traza: true },
           { tipo: 'asig', ops: cuerpo, sig: 2 }, { tipo: 'imp', expr: d.imprime, sig: 5 }, F];
      return { bloques, bucle: d.forma === 'abajo' ? 3 : 2, columnas: d.forma === 'abajo' ? [A, 'k'] : ['k', A], vars: [A, 'k'] };
    }
    if (d.tipo === 'contador') {
      const bloques = [I(1), { tipo: 'asig', ops: [['n', d.a]], sig: 2 }, { tipo: 'asig', ops: [['x', EXPR_X[d.expr]]], sig: 3 },
        { tipo: 'dec', cond: ['mult', 'x', d.m], si: 4, no: 5, traza: true }, { tipo: 'imp', expr: 'x', sig: 5 },
        { tipo: 'asig', ops: [['n', ['+', 'n', d.p]]], sig: 6 }, { tipo: 'dec', cond: [d.opFin, 'n', d.b], si: 7, no: 2, sigue: 'no' }, F];
      return { bloques, bucle: 6, columnas: ['n', 'x'], vars: ['n', 'x'] };
    }
    if (d.tipo === 'dos-contadores') {
      const cond = d.sub === 'primo' ? ['primo', 'n'] : ['mult', 'n', d.d];
      const masA = d.sub === 'primo' ? ['+', 'A', 1] : ['+', 'A', 'n'];
      const bloques = [I(1), { tipo: 'asig', ops: [['n', d.a], ['A', 0], ['B', 0]], sig: 2 },
        { tipo: 'dec', cond, si: 3, no: 4, lado: { No: 'izq' } },
        { tipo: 'asig', ops: [['A', masA]], sig: 5, traza: true }, { tipo: 'asig', ops: [['B', ['+', 'B', 1]]], sig: 5, traza: true },
        { tipo: 'asig', ops: [['n', ['+', 'n', 1]]], sig: 6 }, { tipo: 'dec', cond: [d.opFin, 'n', d.b], si: 7, no: 2, sigue: 'no' },
        { tipo: 'imp', expr: d.imprime === 'B-A' ? ['-', 'B', 'A'] : ['-', 'A', 'B'], sig: 8 }, F];
      return { bloques, bucle: 6, columnas: ['n', 'A', 'B'], vars: ['n', 'A', 'B'] };
    }
    if (d.tipo === 'descuentos') {
      const bloques = [I(1), { tipo: 'leer', vars: ['P'], sig: 2 },
        { tipo: 'dec', cond: [d.op1, 'P', d.T1], si: 3, no: 4, lado: { No: 'izq' } },
        { tipo: 'asig', ops: [['D', ['*', redondo(1 - d.a / 100), 'P']], ['D', ['*', redondo(1 - d.b / 100), 'D']]], sig: 7 },
        { tipo: 'dec', cond: [d.op2, 'P', d.T2], si: 5, no: 6, lado: { No: 'izq' } },
        { tipo: 'asig', ops: [['D', ['*', redondo(1 - d.c / 100), 'P']]], sig: 7 }, { tipo: 'asig', ops: [['D', 'P']], sig: 7 },
        { tipo: 'imp', expr: ['+', 'D', d.E], sig: 8 }, F];
      return { bloques, bucle: null, columnas: ['P', 'D'], vars: ['P', 'D'], entrada: { P: d.P } };
    }
    if (d.tipo === 'cifras') {
      const acum = ['S', ['+', 'S', TERM[d.termino]]], cont = ['k', ['+', 'k', 1]];
      const base = [I(1), { tipo: 'asig', ops: [['S', 0], ['k', 1]], sig: 2 },
        { tipo: 'asig', ops: d.orden === 'acum' ? [acum, cont] : [cont, acum], sig: 3 },
        { tipo: 'dec', cond: ['>', 'k', d.n], si: 4, no: 2, sigue: 'no', traza: true }];
      const bloques = d.sub === 'una-vez'
        ? [...base, { tipo: 'asig', ops: [['R', ['cifras', 'S']]], sig: 5 }, { tipo: 'imp', expr: 'R', sig: 6 }, F]
        : [...base, { tipo: 'dec', cond: ['>=', 'S', 10], si: 5, no: 6, sigue: 'si' }, { tipo: 'asig', ops: [['S', ['cifras', 'S']]], sig: 4 },
           { tipo: 'imp', expr: 'S', sig: 7 }, F];
      return { bloques, bucle: 3, bucle2: d.sub === 'reducir' ? 4 : null, columnas: ['S', 'k'], vars: d.sub === 'una-vez' ? ['S', 'k', 'R'] : ['S', 'k'] };
    }
    if (d.tipo === 'potencias-div' && d.sub === 'base') {
      const r = ['S', ['+', 'S', ['mod', 'n', d.b]]], q = ['n', ['div', 'n', d.b]];
      const bloques = [I(1), { tipo: 'asig', ops: [['n', d.N], ['S', 0]], sig: 2 },
        { tipo: 'asig', ops: d.orden === 'acum' ? [r, q] : [q, r], sig: 3 },
        { tipo: 'dec', cond: ['=', 'n', 0], si: 4, no: 2, sigue: 'no', traza: true }, { tipo: 'imp', expr: 'S', sig: 5 }, F];
      return { bloques, bucle: 3, columnas: ['n', 'S'], vars: ['n', 'S'] };
    }
    if (d.tipo === 'potencias-div') {
      const regla = d.regla === '3n+1' ? ['+', ['*', 3, 'n'], 1] : ['+', 'n', 1];
      const bloques = [I(1), { tipo: 'asig', ops: [['n', d.N], ['S', 0]], sig: 2 },
        { tipo: 'dec', cond: ['par', 'n'], si: 3, no: 4, lado: { No: 'izq' } },
        { tipo: 'asig', ops: [['n', ['/', 'n', 2]]], sig: 5 }, { tipo: 'asig', ops: [['n', regla]], sig: 5 },
        { tipo: 'asig', ops: [['S', ['+', 'S', 'n']]], sig: 6 }, { tipo: 'dec', cond: ['=', 'n', 1], si: 7, no: 2, sigue: 'no', traza: true },
        { tipo: 'imp', expr: 'S', sig: 8 }, F];
      return { bloques, bucle: 6, columnas: ['n', 'S'], vars: ['n', 'S'] };
    }
    if (d.tipo === 'impresos') {
      const cond = d.cond === 'par' ? ['par', 'N'] : ['mult', 'N', 3];
      const bloques = [I(1), { tipo: 'leer', vars: ['N'], sig: 2 }, { tipo: 'asig', ops: [['N', ['*', 'N', d.m]]], sig: 3 },
        { tipo: 'imp', expr: 'N', sig: 4, traza: true }, { tipo: 'dec', cond: ['>', 'N', d.T], si: 5, no: 2, sigue: 'no', traza: true },
        { tipo: 'asig', ops: [['N', ['/', 'N', d.d]]], sig: 6 }, { tipo: 'dec', cond, si: 7, no: 2, traza: true }, F];
      return { bloques, bucle: 4, columnas: ['N'], vars: ['N'], entrada: { N: d.n0 } };
    }
    if (d.tipo === 'bucles') {
      const bloques = [I(1), { tipo: 'leer', vars: ['N'], sig: 2 }, { tipo: 'asig', ops: [['K', ['/', 'N', 2]]], sig: 3 },
        { tipo: 'dec', cond: ['>', 'K', d.T], si: 5, no: 4, sigue: 'no', traza: true }, { tipo: 'asig', ops: [['N', ['^', 'K', 2]]], sig: 2 },
        { tipo: 'asig', ops: [['K', ['-', 'N', d.c]]], sig: 6 }, { tipo: 'dec', cond: ['mult', 'K', d.m], si: 8, no: 7, traza: true },
        { tipo: 'asig', ops: [['N', ['+', ['*', d.p, 'K'], d.q]]], sig: 5 }, { tipo: 'imp', expr: 'K', sig: 9 }, F];
      return { bloques, bucle: 3, columnas: ['N', 'K'], vars: ['N', 'K'], entrada: { N: d.N0 } };
    }
    throw new Error(`sin programa para ${d.tipo}`);
  }

  // ---------------- Operadores ----------------
  const pn = n => (n < 0 ? `(${f(n)})` : f(n));
  const REGLAS = {
    '2a-b': { t: '2a − b', fn: (a, b) => 2 * a - b, s: (a, b) => `2 × ${pn(a)} − ${pn(b)}` },
    'a2-b': { t: 'a² − b', fn: (a, b) => a * a - b, s: (a, b) => `${pn(a)}² − ${pn(b)}` },
    '3a+b': { t: '3a + b', fn: (a, b) => 3 * a + b, s: (a, b) => `3 × ${pn(a)} + ${pn(b)}` },
    'ab-a': { t: 'ab − a', fn: (a, b) => a * b - a, s: (a, b) => `${pn(a)} × ${pn(b)} − ${pn(a)}` },
    'a+2b': { t: 'a + 2b', fn: (a, b) => a + 2 * b, s: (a, b) => `${pn(a)} + 2 × ${pn(b)}` },
    'a2+b': { t: 'a² + b', fn: (a, b) => a * a + b, s: (a, b) => `${pn(a)}² + ${pn(b)}` },
    '2a+3b': { t: '2a + 3b', fn: (a, b) => 2 * a + 3 * b, s: (a, b) => `2 × ${pn(a)} + 3 × ${pn(b)}` },
    'a(a-b)': { t: 'a(a − b)', fn: (a, b) => a * (a - b), s: (a, b) => `${pn(a)} × (${pn(a)} − ${pn(b)})` },
    'ab+b': { t: 'ab + b', fn: (a, b) => a * b + b, s: (a, b) => `${pn(a)} × ${pn(b)} + ${pn(b)}` },
  };
  const operar = (regla, a, b) => REGLAS[regla].fn(a, b);
  function valorOperador(d) {
    const o = (a, b) => operar(d.regla, a, b), o2 = (a, b) => operar(d.regla2, a, b);
    if (d.forma === 'izq') return o(o(d.x, d.y), d.z);
    if (d.forma === 'der') return o(d.x, o(d.y, d.z));
    return o2(o(d.x, d.y), d.z);
  }

  function resolver(d) {
    if (d.tipo === 'operador') return valorOperador(d);
    const prog = programa(d), r = ejecutar(prog, { entrada: prog.entrada });
    if (d.tipo === 'impresos') { const t = r.impresos.reduce((a, b) => a + b, 0); return d.pide === 'cifras' ? sumaCifras(t) : t; }
    if (d.tipo === 'contador') return d.pide === 'cuantos' ? r.impresos.length : r.impresos.reduce((a, b) => a + b, 0);
    return ultimo(r);
  }

  // ---------------- Generación ----------------
  // Preguntas oficiales reproducidas tal cual (UNMSM): semilla → [tipo, datos]; la figura y la solución son propias.
  const OFICIAL = {
    'unmsm-2023-I-29': ['impresos', { tipo: 'impresos', n0: 3, m: 10, T: 600, d: 5, cond: 'par', pide: 'cifras' }],
    'unmsm-2026-I-24': ['bucles', { tipo: 'bucles', N0: 16, T: 71, c: 73, p: 2, q: 3, m: 2 }],
  };
  function generar(semilla) {
    const rng = Azar.crear(`${ID}|${semilla}`);
    const of = OFICIAL[semilla];
    let tipo = rng.elegir(['acumulador', 'acumulador', 'contador', 'dos-contadores', 'descuentos', 'cifras', 'potencias-div', 'operador', 'operador']);
    // Los tipos de cierre-100 salen de un sorteo aparte, para no mover lo que ya se había generado con cada semilla.
    const lado = Azar.crear(`${ID}|nuevos|${semilla}`);
    if (lado.sig() < 0.2) tipo = lado.elegir(['impresos', 'bucles']);
    if (of) tipo = of[0];
    for (let intento = 0; intento < 400; intento++) {
      const p = construir(rng, semilla, tipo, of && of[1]);
      if (p && p.alternativas.length >= 4) return p;
      if (of) break;
    }
    throw new Error('No se pudo generar un problema con 4 alternativas distintas');
  }
  const CONSTR = {};
  function construir(rng, semilla, tipo, fijo) {
    const o = CONSTR[tipo](rng, fijo);
    if (!o) return null;
    const alternativas = P.armar({ correcta: o.correcta, errores: o.errores, rng, negativos: !!o.negativos, texto: o.texto });
    const p = {
      id: `${ID}#${semilla}`, variables: o.variables, enunciado: o.enunciado, pregunta: o.pregunta, datos: '',
      alternativas, solucion: o.solucion, respuesta: { valor: o.correcta, unidad: o.unidad || '' }, _datos: o.datos,
    };
    if (o.figura) p.figura = o.figura;
    if (o.figuraSolucion) p.figuraSolucion = o.figuraSolucion;
    return p;
  }
  const COLORES = ['o', 'i', 'h', 'd'];
  function variablesDe(prog, nombres = {}) {
    const variables = {}, colores = {};
    prog.vars.forEach((x, i) => { variables[x] = { nombre: nombres[x] || `variable ${x}`, color: COLORES[i] }; colores[x] = COLORES[i]; });
    return { variables, colores };
  }
  const INTRO = (prog) => ['Sigue el diagrama de flujo desde Inicio. Una flecha como «', v(prog.vars[0], `${prog.vars[0]} ← …`),
    '» significa que ', v(prog.vars[0], prog.vars[0]), ' toma el valor de lo que está a la derecha, calculado con los valores de ese momento.'];
  // Corre el programa con un cambio y devuelve el último valor impreso (o NaN si falla).
  function variante(prog, cambio, opciones = {}) {
    try { const q = copia(prog); if (cambio) cambio(q); return ultimo(ejecutar(q, { entrada: prog.entrada, ...opciones })); } catch (e) { return NaN; }
  }

  // ---- acumulador ----
  CONSTR.acumulador = function (rng) {
    const sub = rng.elegir(['suma', 'suma', 'producto']);
    const forma = rng.elegir(['abajo', 'abajo', 'arriba']);
    const termino = sub === 'producto' ? 'k' : rng.elegir(['k', 'k2', 'k2', '2k+1']);
    const k0 = sub === 'producto' ? rng.elegir([1, 2]) : rng.elegir([1, 1, 2, 3]);
    const p = sub === 'producto' ? rng.elegir([1, 1, 2]) : rng.elegir([1, 1, 2, 3]);
    const orden = rng.elegir(['acum', 'acum', 'cont']);
    const A = sub === 'producto' ? 'P' : 'S';
    const imprime = rng.elegir([A, A, 'k']);
    // Valores del acumulador vuelta a vuelta, para fijar el límite.
    const seq = []; let s = sub === 'producto' ? 1 : 0, k = k0;
    for (let i = 0; i < 12; i++) {
      const t = { k: k, k2: k * k, '2k+1': 2 * k + 1 }[termino];
      if (orden === 'acum') { s = sub === 'producto' ? s * k : s + t; k += p; }
      else { k += p; s = sub === 'producto' ? s * k : s + { k: k, k2: k * k, '2k+1': 2 * k + 1 }[termino]; }
      seq.push({ s, k });
    }
    let op, L;
    if (forma === 'abajo') {
      op = rng.elegir(['>', '>=']);
      const m = rng.entero(sub === 'producto' ? 3 : 4, sub === 'producto' ? 5 : 7);
      const lo = seq[m - 2].s, hi = seq[m - 1].s;
      L = (rng.sig() < 0.7 || hi - lo < 3) ? hi : rng.entero(lo + 1, hi - 1);
      if (L > 20000) return null;
    } else {
      op = rng.elegir(['<=', '<']);
      const m = rng.entero(4, 7);
      const ks = [k0]; for (let i = 1; i < 12; i++) ks.push(k0 + i * p);
      L = op === '<=' ? ks[m - 1] : ks[m];
      if (p > 1 && rng.moneda()) L = op === '<=' ? ks[m - 1] + 1 : ks[m] - 1;
    }
    const datos = { tipo: 'acumulador', sub, termino, k0, p, forma, op, L, orden, imprime };
    const prog = programa(datos), run = ejecutar(prog);
    const correcta = ultimo(run);
    if (run.traza.length > 10 || run.traza.length < 3 || correcta > 30000) return null;
    const otra = imprime === 'k' ? A : 'k';
    const varCond = forma === 'abajo' ? A : 'k';
    const fin = run.estado;
    const errores = [
      h('RMP21-borde', variante(prog, q => { q.bloques[prog.bucle].cond[0] = BORDE[op]; }),
        `Leíste «${varCond} ${opTexto(op)} ${f(L)}» como si dijera «${varCond} ${opTexto(BORDE[op])} ${f(L)}». ${op === '>' || op === '<' ? `Con ${varCond} igual a ${f(L)}, «${opTexto(op)}» es falso` : `Con ${varCond} igual a ${f(L)}, «${opTexto(op)}» ya es verdadero`}: el borde cambia cuántas vueltas se dan.`),
      h('RMP20-una-vuelta-menos', variante(prog, null, { delta: -1 }),
        forma === 'abajo' ? `Saliste del bucle una vuelta antes. La pregunta se hace después de cada vuelta, y en la vuelta anterior todavía salía «No»: había que repetir.`
          : `Dejaste de repetir una vuelta antes. Con k = ${f(fin.k - p)} la condición «k ${opTexto(op)} ${f(L)}» todavía se cumple, así que esa vuelta también se hace.`),
      h('RMP20-una-vuelta-mas', variante(prog, null, { delta: +1 }),
        `Diste una vuelta de más. Apenas la pregunta manda salir, se sale y se imprime: no se vuelve a ${sub === 'producto' ? 'multiplicar' : 'sumar'}.`),
      h('RMP22-otra-variable', fin[otra], `Ese es el valor final de ${otra}, pero el bloque de salida dice «Imprimir ${imprime}».`),
      h('RMP20-orden', variante(prog, q => { q.bloques[forma === 'abajo' ? 2 : 3].ops.reverse(); }),
        orden === 'acum' ? `Aumentaste k antes de ${sub === 'producto' ? 'multiplicar' : 'sumar'}. En el rectángulo, primero cambia ${A} con el k de ese momento y recién después k aumenta.`
          : `${sub === 'producto' ? 'Multiplicaste' : 'Sumaste'} con el k de antes. En el rectángulo, primero k aumenta y ${A} usa ese k nuevo.`),
    ];
    const { variables, colores } = variablesDe(prog, { [A]: sub === 'producto' ? 'producto acumulado' : 'suma acumulada', k: 'contador' });
    const condT = plano(partesCond(prog.bloques[prog.bucle].cond));
    const figura = { svg: dibujar(prog, colores), alt: describir(prog) };
    const tabla = tablaTraza(prog.columnas, run.traza, colores, condT);
    const solucion = [
      ['Al empezar: ', v(A, `${A} = ${sub === 'producto' ? 1 : 0}`), ' y ', v('k', `k = ${k0}`), '.'],
      [forma === 'abajo' ? 'Cada vuelta cambia los dos valores y recién después pregunta. Valores al llegar a la pregunta: ' : 'Antes de cada vuelta se pregunta por k. Valores al llegar a la pregunta: ', trazaTexto(prog.columnas, run.traza), '.'],
      [forma === 'abajo' ? `Sale en la vuelta ${run.traza.length}, la primera en que «${condT.slice(1, -1)}» es verdadero.` : `La pregunta da «No» por primera vez con k = ${f(fin.k)}: ahí se sale.`,
        op === '>=' || op === '<=' ? ' Ojo con el borde: «≥» y «≤» incluyen la igualdad.' : ' Ojo con el borde: «>» y «<» no incluyen la igualdad.'],
      ['Se imprime ', v(imprime, `${imprime} = ${f(correcta)}`), '.'],
    ];
    return { datos, correcta, errores, variables, enunciado: INTRO(prog), pregunta: ['¿Qué valor se imprime?'], solucion, figura, figuraSolucion: tabla };
  };

  // ---- contador de lo impreso ----
  CONSTR.contador = function (rng) {
    const expr = rng.elegir(Object.keys(EXPR_X));
    const m = rng.elegir([3, 4, 5, 6, 7]);
    const p = rng.elegir([1, 1, 1, 2]);
    const a = rng.entero(expr === 'n2-n' ? 2 : 1, 9), vueltas = rng.entero(8, 12);
    const opFin = rng.elegir(['>', '>=']);
    const ultimoN = a + (vueltas - 1) * p;
    const b = opFin === '>' ? ultimoN : ultimoN + p;
    const pide = rng.elegir(['cuantos', 'cuantos', 'suma']);
    const datos = { tipo: 'contador', a, p, opFin, b, expr, m, pide };
    const prog = programa(datos), run = ejecutar(prog);
    const correcta = resolver(datos);
    const n0 = run.impresos.length;
    if (n0 < 2 || n0 > vueltas - 2) return null;
    const medir = r => (pide === 'cuantos' ? r.impresos.length : r.impresos.reduce((x, y) => x + y, 0));
    const correr = (cambio, op = {}) => { try { const q = copia(prog); if (cambio) cambio(q); return medir(ejecutar(q, op)); } catch (e) { return NaN; } };
    const xs = run.traza.map(r => r.x), ns = run.traza.map(r => r.n);
    const condN = ns.filter((n, i) => n % m === 0);
    const errores = [
      h('RMP21-borde', correr(q => { q.bloques[6].cond[0] = BORDE[opFin]; }),
        opFin === '>' ? `Cortaste cuando n llegó a ${b}. Pero «n > ${b}» es falso con n = ${b}: esa vuelta también se hace.`
          : `Hiciste también la vuelta con n = ${b}. Pero «n ≥ ${b}» ya es verdadero cuando n llega a ${b}: ahí se sale, sin calcular x.`),
      h('RMP20-una-vuelta-menos', correr(null, { delta: -1, bucle: 6 }), 'Dejaste afuera la última vuelta: la pregunta del final todavía daba «No» y había que repetir una vez más.'),
      h('RMP20-una-vuelta-mas', correr(null, { delta: +1, bucle: 6 }), 'Hiciste una vuelta de más: cuando la pregunta del final da «Sí», se termina.'),
      h('RMP22-todas-las-vueltas', pide === 'cuantos' ? xs.length : xs.reduce((s, x) => s + x, 0),
        `${pide === 'cuantos' ? 'Contaste' : 'Sumaste'} todos los valores de x, pero solo se imprimen los que son múltiplos de ${m}.`),
      h('RMP22-condicion-en-n', pide === 'cuantos' ? condN.length : run.traza.filter(r => r.n % m === 0).reduce((s, r) => s + r.x, 0),
        `Revisaste si n es múltiplo de ${m}, pero la pregunta del rombo es sobre x, que se calcula a partir de n.`),
    ];
    const { variables, colores } = variablesDe(prog, { n: 'contador', x: 'número calculado' });
    const condT = `¿x múltiplo de ${m}?`;
    const solucion = [
      ['Al empezar, ', v('n', `n = ${a}`), '. En cada vuelta se calcula ', v('x', 'x'), `, se imprime si es múltiplo de ${m}, y n aumenta en ${p}.`],
      ['Vueltas: ', trazaTexto(['n', 'x'], run.traza), '.'],
      [`La última vuelta es la de n = ${ns[ns.length - 1]}: después n pasa a ${ns[ns.length - 1] + p} y «${plano(partesCond(prog.bloques[6].cond)).slice(1, -1)}» da «Sí».`],
      ['Se imprimen: ', run.impresos.map(f).join(', '), '. ', pide === 'cuantos' ? `Son ${n0} números.` : `Su suma es ${f(correcta)}.`],
    ];
    return {
      datos, correcta, errores, variables, enunciado: INTRO(prog),
      pregunta: [pide === 'cuantos' ? '¿Cuántos números se imprimen en total?' : '¿Cuál es la suma de todos los números que se imprimen?'],
      solucion, figura: { svg: dibujar(prog, colores), alt: describir(prog) }, figuraSolucion: tablaTraza(['n', 'x'], run.traza, colores, condT),
    };
  };

  // ---- dos contadores ----
  CONSTR['dos-contadores'] = function (rng) {
    const sub = rng.elegir(['primo', 'primo', 'multiplo']);
    const a = sub === 'primo' ? rng.elegir([1, 1, 2, 3, 5, 7, 10, 12, 14, 20]) : rng.entero(1, 12);
    const largo = rng.entero(8, 12);
    const ultimoN = a + largo - 1;
    const dd = sub === 'multiplo' ? rng.elegir([3, 4, 5]) : null;
    const base = { tipo: 'dos-contadores', sub, a, opFin: rng.moneda() ? '>' : '>=', b: 0, d: dd, imprime: 'B-A' };
    base.b = base.opFin === '>' ? ultimoN : ultimoN + 1;
    // Que la resta impresa sea positiva.
    const prueba = ejecutar(programa(base)).estado;
    if (prueba.A === prueba.B) return null;
    base.imprime = prueba.B > prueba.A ? 'B-A' : 'A-B';
    const datos = base;
    const prog = programa(datos), run = ejecutar(prog), fin = run.estado;
    const correcta = ultimo(run);
    const resta = (A, B) => (datos.imprime === 'B-A' ? B - A : A - B);
    const ns = []; for (let n = a; datos.opFin === '>' ? n <= datos.b : n < datos.b; n++) ns.push(n);
    const errores = [];
    if (sub === 'primo') {
      if (ns.includes(1)) errores.push(h('RMP24-uno-primo', resta(fin.A + 1, fin.B - 1), 'Contaste el 1 como primo. Un primo tiene exactamente dos divisores, y el 1 tiene uno solo: va por la rama «No».'));
      const impares = ns.filter(n => n > 2 && n % 2 === 1 && !esPrimo(n));
      if (impares.length) errores.push(h('RMP24-impar-primo', resta(fin.A + impares.length, fin.B - impares.length), `Tomaste como primos a todos los impares, pero ${impares.slice(0, 3).join(', ')} ${impares.length === 1 ? 'no es primo' : 'no son primos'}: tienen otros divisores.`));
    }
    errores.push(
      h('RMP21-borde', variante(prog, q => { q.bloques[6].cond[0] = BORDE[datos.opFin]; }),
        datos.opFin === '>' ? `Te detuviste al llegar n a ${datos.b}, pero «n > ${datos.b}» es falso con n = ${datos.b}: ese número también se revisa.`
          : `Revisaste también n = ${datos.b}, pero «n ≥ ${datos.b}» ya es verdadero cuando n llega a ${datos.b}: se sale antes de revisarlo.`),
      h('RMP20-una-vuelta-menos', variante(prog, null, { delta: -1 }), 'Dejaste sin revisar el último número: la pregunta del final todavía daba «No» y había que dar una vuelta más.'),
      h('RMP20-una-vuelta-mas', variante(prog, null, { delta: +1 }), 'Revisaste un número de más: cuando la pregunta del final da «Sí», se sale del bucle.'),
      h('RMP22-un-contador', datos.imprime === 'B-A' ? fin.B : fin.A, `Ese es el valor final de ${datos.imprime === 'B-A' ? 'B' : 'A'}, pero se imprime la resta ${datos.imprime === 'B-A' ? 'B − A' : 'A − B'}.`),
    );
    const { variables, colores } = variablesDe(prog, { n: 'número que se revisa', A: 'contador A', B: 'contador B' });
    const solucion = [
      ['Se revisan los números ', v('n', `n = ${ns[0]}`), ` hasta n = ${ns[ns.length - 1]} (con n = ${ns[ns.length - 1] + 1} la pregunta del final da «Sí»).`],
      [sub === 'primo' ? `Primos entre ellos: ${ns.filter(esPrimo).join(', ') || 'ninguno'}. ` : `Múltiplos de ${dd}: ${ns.filter(n => n % dd === 0).join(', ')}. `,
        ...(sub === 'primo' && ns.includes(1) ? ['El 1 no es primo. '] : []),
        'Al final: ', v('A', `A = ${f(fin.A)}`), ' y ', v('B', `B = ${f(fin.B)}`), sub === 'multiplo' ? ' (A suma los múltiplos; B cuenta los demás).' : ' (A cuenta los primos; B, los demás).'],
      ['Se imprime ', ...(datos.imprime === 'B-A' ? [v('B', 'B'), ' − ', v('A', 'A')] : [v('A', 'A'), ' − ', v('B', 'B')]), ` = ${f(correcta)}.`],
    ];
    return {
      datos, correcta, errores, variables, enunciado: INTRO(prog), pregunta: ['¿Qué valor se imprime?'], solucion,
      // Con primos, la resta es chica: un error (el 1 como primo, los impares como primos) puede dar 0 o
      // un negativo, y el diagrama bien podría imprimirlo. Sin esto, los arranques en 1 o 2 nunca salían.
      negativos: sub === 'primo',
      figura: { svg: dibujar(prog, colores), alt: describir(prog) }, figuraSolucion: tablaTraza(['n', 'A', 'B'], run.traza, colores, null),
    };
  };

  // ---- descuentos según el precio ----
  CONSTR.descuentos = function (rng) {
    const T1 = rng.elegir([300, 400, 500, 600]), T2 = rng.elegir([100, 150, 200]);
    const a = rng.elegir([10, 20, 25, 30]), b = rng.elegir([5, 10, 20]), c = rng.elegir([5, 10, 15]);
    const E = rng.elegir([5, 8, 10, 12, 15]);
    const op1 = rng.elegir(['>', '>=']), op2 = rng.elegir(['>', '>=']);
    const caso = rng.elegir(['alta', 'alta', 'alta', 'borde1', 'borde1', 'borde2', 'media']);
    let Pp;
    if (caso === 'alta') Pp = T1 + 20 * rng.entero(1, 15);
    else if (caso === 'borde1') Pp = T1;
    else if (caso === 'borde2') Pp = T2;
    else Pp = T2 + 10 * rng.entero(1, (T1 - T2) / 10 - 1);
    const datos = { tipo: 'descuentos', P: Pp, T1, T2, op1, op2, a, b, c, E };
    const prog = programa(datos), correcta = resolver(datos);
    const fa = 1 - a / 100, fb = 1 - b / 100, fc = 1 - c / 100;
    const enAlta = op1 === '>' ? Pp > T1 : Pp >= T1, enMedia = !enAlta && (op2 === '>' ? Pp > T2 : Pp >= T2);
    const errores = [];
    if (enAlta) {
      errores.push(h('RMP23-un-descuento', redondo(Pp * fa + E), `Aplicaste solo el primer descuento de la rama. El rectángulo tiene dos asignaciones: después de D ← ${f(fa)} × P viene D ← ${f(fb)} × D, sobre el precio ya rebajado.`));
      errores.push({ id: 'AR1-suma-descuentos', valor: redondo(Pp * (1 - (a + b) / 100) + E), explicacion: `Sumaste los descuentos (${a} % + ${b} % = ${a + b} %). El segundo se aplica sobre D, que ya está rebajado, no sobre P.`, respaldo: 'parcial', fuente: RM });
    }
    const borde1 = Pp === T1, borde2 = Pp === T2;
    if (borde1 || borde2) {
      const q = copia(datos); if (borde1) q.op1 = BORDE[op1]; else q.op2 = BORDE[op2];
      const opx = borde1 ? op1 : op2, T = borde1 ? T1 : T2;
      errores.push(h('RMP21-borde', resolver(q), opx === '>'
        ? `Con P = ${T}, la pregunta «P > ${T}» da «No»: ${T} no es mayor que ${T}. Tomaste la rama del «Sí».`
        : `Con P = ${T}, la pregunta «P ≥ ${T}» da «Sí», porque ≥ incluye la igualdad. Tomaste la rama del «No».`));
    }
    const D = redondo(correcta - E);
    errores.push(h('RMP23-sin-envio', D, `Te quedaste con D, pero el bloque de salida imprime D + ${E}: falta sumar el envío.`));
    errores.push({ id: 'AR5-monto-descuento', valor: redondo(Pp - D), explicacion: 'Calculaste cuánto se descuenta, pero lo impreso es lo que se paga: D más el envío.', respaldo: 'hipotesis', fuente: null });
    const { variables, colores } = variablesDe(prog, { P: 'precio de lista', D: 'precio con descuento' });
    const solucion = [
      ['Se lee ', v('P', `P = ${Pp}`), '. ', `Primera pregunta: ¿${Pp} ${opTexto(op1)} ${T1}? ${enAlta ? 'Sí' : 'No'}.`,
        ...(enAlta ? [] : [` Segunda pregunta: ¿${Pp} ${opTexto(op2)} ${T2}? ${enMedia ? 'Sí' : 'No'}.`])],
      enAlta ? ['Rama del «Sí»: ', v('D', `D = ${f(fa)} × ${Pp} = ${soles(Pp * fa)}`), '; luego ', v('D', `D = ${f(fb)} × ${f(redondo(Pp * fa))} = ${soles(D)}`), '.']
        : enMedia ? ['Un solo descuento: ', v('D', `D = ${f(fc)} × ${Pp} = ${soles(D)}`), '.'] : ['Sin descuento: ', v('D', `D = ${soles(D)}`), '.'],
      ['Se imprime ', v('D', 'D'), ` + ${E} = ${soles(correcta)}.`],
    ];
    return {
      datos, correcta, errores, variables, texto: soles,
      enunciado: ['Una tienda de Juliaca calcula el cobro con este diagrama: ', v('P', 'P'), ' es el precio de lista en soles y lo impreso es lo que se paga, con el envío incluido. «D ← …» significa que ', v('D', 'D'), ' toma el valor de la derecha.'],
      pregunta: ['Si se ingresa ', v('P', `P = ${Pp}`), ', ¿qué se imprime?'], solucion, unidad: 'soles',
      figura: { svg: dibujar(prog, colores), alt: describir(prog) },
    };
  };

  // ---- acumular y sumar cifras ----
  CONSTR.cifras = function (rng) {
    const termino = rng.elegir(['k2', 'k2', 'k3', 'kk1']);
    const n = termino === 'k3' ? rng.entero(3, 6) : rng.entero(4, 9);
    const orden = rng.elegir(['acum', 'acum', 'cont']);
    const sub = rng.elegir(['una-vez', 'reducir']);
    const datos = { tipo: 'cifras', termino, n, orden, sub };
    const prog = programa(datos), run = ejecutar(prog);
    const S = run.traza[run.traza.length - 1].S;
    if (sub === 'reducir' && sumaCifras(S) < 10) return null;
    const correcta = ultimo(run);
    const errores = [
      h('RMP23-sin-cifras', S, sub === 'una-vez' ? `Ese es el valor de S al salir del bucle, pero falta el paso final: R es la suma de las cifras de S, y se imprime R.` : `Ese es S al salir del primer bucle. Falta el segundo: mientras S tenga dos cifras o más, se cambia por la suma de sus cifras.`),
      h('RMP20-una-vuelta-menos', variante(prog, null, { delta: -1 }), 'Saliste del primer bucle una vuelta antes: la pregunta «¿k > ' + n + '?» todavía daba «No».'),
      h('RMP20-una-vuelta-mas', variante(prog, null, { delta: +1 }), `Diste una vuelta de más en el primer bucle: cuando k pasa de ${n}, se sale.`),
      h('RMP20-orden', variante(prog, q => { q.bloques[2].ops.reverse(); }), orden === 'acum' ? 'Aumentaste k antes de sumar. En el rectángulo, S usa el k de ese momento y recién después k aumenta.' : 'Sumaste con el k de antes. En el rectángulo, primero k aumenta y S usa ese k nuevo.'),
    ];
    if (sub === 'reducir') errores.unshift(h('RMP20-reducir-una-vez', sumaCifras(S), `Sumaste las cifras una sola vez. Como ${sumaCifras(S)} todavía tiene dos cifras, «¿S ≥ 10?» da «Sí» y se vuelve a sumar.`));
    const { variables, colores } = variablesDe(prog, { S: 'suma acumulada', k: 'contador', R: 'suma de cifras' });
    const tt = { k2: 'k²', k3: 'k³', kk1: 'k × (k + 1)' }[termino];
    const reduc = []; let x = S; while (x >= 10) { const y = sumaCifras(x); reduc.push(`${x} → ${y}`); x = y; }
    const solucion = [
      [`En cada vuelta, S suma ${tt} y k aumenta en 1. Valores al llegar a la pregunta: `, trazaTexto(['S', 'k'], run.traza), '.'],
      [`Se sale cuando k pasa de ${n}: `, v('S', `S = ${f(S)}`), '.'],
      sub === 'una-vez' ? ['Paso final: ', v('R', `R = ${String(S).split('').join(' + ')} = ${correcta}`), '. Se imprime ', v('R', String(correcta)), '.']
        : ['Segundo bucle (suma de cifras hasta que quede una): ', reduc.join(', '), '. Se imprime ', v('S', String(correcta)), '.'],
    ];
    return {
      datos, correcta, errores, variables, enunciado: INTRO(prog), pregunta: ['¿Qué valor se imprime?'], solucion,
      figura: { svg: dibujar(prog, colores), alt: describir(prog) }, figuraSolucion: tablaTraza(['S', 'k'], run.traza, colores, `¿k > ${n}?`),
    };
  };

  // ---- potencias, cocientes y restos ----
  const pasosMitades = (N, regla) => { let n = N, c = 0; while (n !== 1 && c < 100) { n = n % 2 === 0 ? n / 2 : (regla === '3n+1' ? 3 * n + 1 : n + 1); c++; } return c; };
  CONSTR['potencias-div'] = function (rng) {
    const sub = rng.elegir(['base', 'mitades']);
    let datos;
    if (sub === 'base') {
      const b = rng.elegir([2, 3, 3, 4, 5]);
      const N = b === 2 ? rng.entero(40, 120) : b === 3 ? rng.entero(50, 240) : rng.entero(70, 400);
      datos = { tipo: 'potencias-div', sub, N, b, orden: rng.elegir(['acum', 'acum', 'cont']) };
    } else {
      const regla = rng.elegir(['3n+1', 'n+1']);
      const N = rng.entero(5, 90);
      const c = pasosMitades(N, regla);
      if (c < 4 || c > 9) return null;
      datos = { tipo: 'potencias-div', sub, N, regla };
    }
    const prog = programa(datos), run = ejecutar(prog);
    const correcta = ultimo(run);
    const { variables, colores } = variablesDe(prog, { n: 'número que cambia', S: 'suma acumulada' });
    let errores, solucion;
    if (sub === 'base') {
      const { b, N } = datos;
      let Q = 0; for (let n = N; n > 0; n = Math.floor(n / b)) Q += Math.floor(n / b);
      errores = [
        h('RMP20-una-vuelta-menos', variante(prog, null, { delta: -1 }), `Saliste cuando n quedó menor que ${b}, pero la pregunta es «¿n = 0?»: falta una vuelta, que suma el último resto.`),
        h('RMP22-cocientes', Q, 'Sumaste los cocientes. S acumula los restos; el cociente solo pasa a ser el nuevo n.'),
        h('RMP20-orden', variante(prog, q => { q.bloques[2].ops.reverse(); }), datos.orden === 'acum' ? 'Cambiaste n por el cociente antes de sacar el resto. En el rectángulo, primero se suma el resto del n de ese momento.' : 'Sacaste el resto del n de antes. En el rectángulo, primero n pasa a ser el cociente y el resto se saca de ese n nuevo.'),
        h('RMP20-una-vuelta-mas', variante(prog, null, { delta: +1 }), 'Diste una vuelta de más.'),
      ];
      solucion = [
        ['Al empezar, ', v('n', `n = ${N}`), ' y ', v('S', 'S = 0'), `. En cada vuelta ${datos.orden === 'acum' ? 'S suma el resto de n ÷ ' + b + ' y n pasa a ser el cociente' : 'n pasa a ser el cociente de n ÷ ' + b + ' y S suma el resto de ese n nuevo'}.`],
        ['Vueltas: ', trazaTexto(['n', 'S'], run.traza), '.'],
        ['Cuando n llega a 0 se sale. Se imprime ', v('S', `S = ${correcta}`), '.',
          ...(datos.orden === 'acum' ? [` (Es la suma de las cifras de ${N} escrito en base ${b}.)`] : [])],
      ];
    } else {
      const { N } = datos;
      errores = [
        h('RMP20-una-vuelta-menos', correcta - 1, 'Te detuviste antes de sumar el 1. Cuando n se vuelve 1, igual se suma a S y recién después la pregunta «¿n = 1?» da «Sí».'),
        h('RMP20-una-vuelta-mas', correcta + (datos.regla === '3n+1' ? 4 : 2), `Diste una vuelta de más: con n = 1 la pregunta «¿n = 1?» da «Sí» y se imprime; no se aplica otra vez la regla (1 → ${datos.regla === '3n+1' ? 4 : 2}).`),
        h('RMP20-orden', correcta - 1 + N, `Sumaste n antes de cambiarlo: así sumas ${N}, que en el diagrama no se suma, y dejas afuera el 1.`),
      ];
      solucion = [
        ['Al empezar, ', v('n', `n = ${N}`), ` y S = 0. Si n es par se divide entre 2; si es impar, se cambia por ${datos.regla === '3n+1' ? '3n + 1' : 'n + 1'}. Luego S suma el n nuevo.`],
        ['Valores de n: ', run.traza.map(r => r.n).join(' → '), '.'],
        ['S suma esos valores: ', run.traza.map(r => r.n).join(' + '), ' = ', v('S', String(correcta)), '. Se imprime ', v('S', String(correcta)), '.'],
      ];
    }
    return {
      datos, correcta, errores, variables, enunciado: INTRO(prog), pregunta: ['¿Qué valor se imprime?'], solucion,
      figura: { svg: dibujar(prog, colores), alt: describir(prog) }, figuraSolucion: tablaTraza(prog.columnas, run.traza, colores, plano(partesCond(prog.bloques[prog.bucle].cond))),
    };
  };

  // ---- suma de lo impreso (multiplicar, imprimir, dividir y probar) ----
  // Recorre el diagrama y devuelve lo impreso, los valores tras cada división y si todo fue entero.
  function correrImpresos(datos) {
    const prog = programa(datos);
    let r;
    try { r = ejecutar(prog, { entrada: prog.entrada }); } catch (e) { return null; }
    const divididos = r.traza.filter(x => x._i === 6).map(x => x.N);
    return { prog, r, divididos, entero: divididos.every(Number.isInteger) };
  }
  CONSTR.impresos = function (rng, fijo) {
    let datos = fijo;
    if (!datos) {
      const m = rng.elegir([2, 3, 5, 10, 10]), n0 = rng.entero(1, 9);
      const cand = [60, 100, 150, 200, 250, 300, 400, 500, 600, 800, 1000, 1500].filter(T => n0 * m <= T && n0 * m ** 3 > T);
      if (!cand.length) return null;
      datos = { tipo: 'impresos', n0, m, T: rng.elegir(cand), d: rng.elegir([2, 3, 4, 5, 6, 8, 10]), cond: rng.elegir(['par', 'par', 'mult3']), pide: rng.elegir(['cifras', 'cifras', 'suma']) };
    }
    const c = correrImpresos(datos);
    if (!c || !c.entero) return null;
    const { prog, r, divididos } = c;
    const total = r.impresos.reduce((a, b) => a + b, 0);
    if (!fijo && (r.impresos.length < 3 || r.impresos.length > 7 || total > 99999 || r.traza.length > 13)) return null;
    const g = x => (datos.pide === 'cifras' ? sumaCifras(x) : x);
    const correcta = g(total);
    const nNo = r.vueltas[4] || 0;
    if (!fijo && nNo < 1) return null;
    const pasa = r.impresos.findIndex(x => x > datos.T);
    const corr = (cambio, op = {}) => { try { const q = copia(prog); if (cambio) cambio(q); return g(ejecutar(q, { entrada: prog.entrada, ...op }).impresos.reduce((a, b) => a + b, 0)); } catch (e) { return NaN; } };
    const condT = datos.cond === 'par' ? 'es par' : 'es múltiplo de 3';
    const errores = [
      h('RMP106-cuenta-lo-no-impreso', g(total + divididos.reduce((a, b) => a + b, 0)),
        `Sumaste también ${divididos.length === 1 ? 'el valor que sale de dividir' : 'los valores que salen de dividir'} (${divididos.map(f).join(', ')}). Esos valores solo se prueban en la pregunta «¿N ${condT}?»: lo único que se imprime es lo que sale del bloque «Imprimir N», justo después de multiplicar.`),
      h('RMP108-sale-sin-probar', g(r.impresos.slice(0, pasa + 1).reduce((a, b) => a + b, 0)),
        `Terminaste apenas N pasó de ${f(datos.T)}. Después de dividir falta probar «¿N ${condT}?»: si da «No», el diagrama vuelve a multiplicar y se imprimen más números.`),
      h('RMP109-cuenta-el-ingreso', g(total + datos.n0), `Sumaste el ${datos.n0} que se ingresa. Ese número no se imprime: lo primero que se imprime es el resultado de multiplicarlo por ${datos.m}.`),
      h('RMP20-una-vuelta-menos', corr(null, { delta: -1, bucle: 4 }), 'Dejaste de repetir una vuelta antes: con la pregunta «¿N > ' + f(datos.T) + '?» en «No» había que volver a multiplicar.'),
      h('RMP20-una-vuelta-mas', corr(null, { delta: +1, bucle: 4 }), `Repetiste una vuelta de más: cuando N pasa de ${f(datos.T)} se sigue por «Sí» y no se multiplica otra vez.`),
    ];
    if (datos.pide === 'cifras') errores.unshift(h('RMP107-sin-sumar-cifras', total, 'Esa es la suma de los números impresos. Falta el último paso: la pregunta pide la suma de las cifras de esa suma.'));
    const { variables, colores } = variablesDe(prog, { N: 'número que cambia' });
    const imp = r.impresos;
    const pasos = [];
    r.traza.forEach(x => {
      if (x._i === 4) pasos.push(x._cond ? `${f(x.N)} pasa de ${f(datos.T)}: se divide entre ${datos.d}` : `${f(x.N)} no pasa de ${f(datos.T)}: se vuelve a multiplicar`);
      else if (x._i === 6) pasos.push(`${f(x.N)} ${datos.cond === 'par' ? (x._cond ? 'es par' : 'no es par') : (x._cond ? 'es múltiplo de 3' : 'no es múltiplo de 3')}: ${x._cond ? 'Fin' : 'se vuelve a multiplicar'}`);
    });
    const solucion = [
      ['Se ingresa ', v('N', `N = ${datos.n0}`), `. En cada vuelta N se multiplica por ${datos.m} y recién después se imprime.`],
      ['Paso a paso: ', pasos.join('; '), '.'],
      ['Números impresos: ', imp.map(f).join(', '), '. Su suma es ', imp.map(f).join(' + '), ` = ${f(total)}.`],
      datos.pide === 'cifras' ? [`Suma de las cifras de ${f(total)}: `, String(total).split('').join(' + '), ' = ', v('N', String(correcta)), '.'] : ['Respuesta: ', v('N', f(correcta)), '.'],
    ];
    const filas = r.traza.filter(x => x._imp !== undefined);
    return {
      datos, correcta, errores, variables,
      enunciado: [...INTRO(prog), ' Se ingresa el número ', v('N', String(datos.n0)), '. «Imprimir N» muestra el valor que tiene N en ese momento.'],
      pregunta: [datos.pide === 'cifras' ? 'Determina la suma de las cifras de la suma de todos los números impresos.' : '¿Cuál es la suma de todos los números impresos?'],
      solucion, figura: { svg: dibujar(prog, colores), alt: describir(prog) }, figuraSolucion: tablaTraza(['N'], filas, colores, null),
    };
  };

  // ---- dos bucles que vuelven a cajas distintas (potencias, divisiones y condiciones) ----
  CONSTR.bucles = function (rng, fijo) {
    let datos = fijo;
    if (!datos) {
      const K0 = rng.elegir([4, 6, 8, 10, 12, 14]), nA = rng.entero(1, 3);
      const Ks = [K0]; for (let i = 0; i < 3; i++) Ks.push(Ks[i] * Ks[i] / 2);
      const T = rng.moneda() ? Ks[nA - 1] : rng.entero(Ks[nA - 1] + 1, Ks[nA] - 1);
      const c = rng.entero(11, 99);
      datos = { tipo: 'bucles', N0: 2 * K0, T, c, p: rng.elegir([2, 3, 4, 5]), q: rng.elegir([1, 3, 5, 7, 9]), m: rng.elegir([2, 3, 4, 5]) };
    }
    const prog = programa(datos);
    let run;
    try { run = ejecutar(prog, { entrada: prog.entrada }); } catch (e) { return null; }
    const filas = run.traza;
    const ks = filas.map(x => x.K), ns = filas.map(x => x.N);
    if (!ks.every(k => Number.isInteger(k) && k > 0) || !ns.every(Number.isInteger)) return null;
    const correcta = ultimo(run), nA = filas.filter(x => x._i === 3 && !x._cond).length, nB = filas.filter(x => x._i === 6 && !x._cond).length;
    if (!fijo && (nA < 1 || nB < 1 || nB > 3 || correcta > 99999 || filas.length > 9)) return null;
    // K justo después de pasar la primera pregunta (K ← N − c), todavía sin probar si es múltiplo.
    const primeraSi = filas.find(x => x._i === 3 && x._cond), Kc = primeraSi.N - datos.c;
    const errores = [
      h('RMP108-sale-sin-probar', Kc, `Imprimiste K apenas salió de la primera pregunta. Después de K ← N − ${datos.c} falta probar «¿K es múltiplo de ${datos.m}?»: con K = ${f(Kc)} la respuesta es «No» y hay que seguir.`),
      h('RMP22-imprime-N', run.estado.N, 'Ese es el último valor de N, pero el bloque de salida dice «Imprimir K».'),
      h('RMP20-flecha-de-vuelta', variante(prog, q => { q.bloques[7].sig = 2; }),
        `La flecha que sale de N ← ${datos.p}K + ${datos.q} no vuelve a K ← N ÷ 2: entra en K ← N − ${datos.c}. La división entre 2 solo se repite en el primer bucle.`),
      h('RMP20-variable', variante(prog, q => { q.bloques[5].ops[0][1] = ['-', 'K', datos.c]; }),
        `Restaste ${datos.c} al K de antes. El bloque dice K ← N − ${datos.c}: se resta a N, el valor que se acaba de calcular.`),
      h('RMP20-una-vuelta-menos', variante(prog, null, { delta: -1 }), 'Saliste del primer bucle una vuelta antes: con «¿K > ' + f(datos.T) + '?» en «No» había que elevar al cuadrado y volver a dividir entre 2.'),
      h('RMP20-una-vuelta-mas', variante(prog, null, { delta: +1 }), `Elevaste al cuadrado una vez de más: apenas «¿K > ${f(datos.T)}?» da «Sí», se pasa al segundo bloque.`),
      h('RMP21-borde', variante(prog, q => { q.bloques[3].cond[0] = '>='; }), `Leíste «K > ${f(datos.T)}» como «K ≥ ${f(datos.T)}». Con K = ${f(datos.T)} la pregunta da «No»: ${f(datos.T)} no es mayor que ${f(datos.T)}.`),
    ];
    const { variables, colores } = variablesDe(prog, { N: 'número que cambia', K: 'resultado parcial' });
    const pasos = filas.map(x => (x._i === 3
      ? `K = ${f(x.K)} (con N = ${f(x.N)}): ${x._cond ? `«K > ${f(datos.T)}» es Sí, sigue K ← N − ${datos.c} = ${f(x.N - datos.c)}` : `«K > ${f(datos.T)}» es No, N ← K² = ${f(x.K * x.K)} y se vuelve a dividir entre 2`}`
      : `K = ${f(x.K)}: ${x._cond ? `es múltiplo de ${datos.m}, se imprime` : `no es múltiplo de ${datos.m}, N ← ${datos.p}K + ${datos.q} = ${f(datos.p * x.K + datos.q)} y se vuelve a K ← N − ${datos.c}`}`));
    const solucion = [
      ['Se ingresa ', v('N', `N = ${f(datos.N0)}`), ' y ', v('K', `K = ${f(datos.N0 / 2)}`), ' en la primera división. El primer bucle eleva al cuadrado y divide entre 2 mientras K no pase de ', f(datos.T), '; el segundo resta y prueba el múltiplo.'],
      ['Paso a paso: ', pasos.join('; '), '.'],
      ['Se imprime ', v('K', `K = ${f(correcta)}`), '.'],
    ];
    return {
      datos, correcta, errores, variables,
      enunciado: [...INTRO(prog), ' Se ingresa el número ', v('N', f(datos.N0)), '. «¿K es múltiplo de ' + datos.m + '?» pregunta si K se puede dividir exactamente entre ' + datos.m + '.'],
      pregunta: ['¿Qué valor de ', v('K', 'K'), ' se imprime al final?'],
      solucion, figura: { svg: dibujar(prog, colores), alt: describir(prog) }, figuraSolucion: tablaTraza(['N', 'K'], filas, colores, 'pregunta'),
    };
  };

  // ---- operador definido por una regla ----
  CONSTR.operador = function (rng) {
    const claves = Object.keys(REGLAS);
    const regla = rng.elegir(claves);
    const forma = rng.elegir(['izq', 'der', 'mixto']);
    let regla2 = null;
    if (forma === 'mixto') { regla2 = rng.elegir(claves.filter(c => c !== regla)); }
    const nums = rng.barajar([1, 2, 3, 4, 5, 6]).slice(0, 3);
    const [x, y, z] = nums;
    const datos = { tipo: 'operador', regla, forma, x, y, z, regla2 };
    const correcta = valorOperador(datos);
    if (Math.abs(correcta) > 400) return null;
    const o = (a, b) => operar(regla, a, b), o2 = (a, b) => operar(regla2, a, b);
    const R = REGLAS[regla].t, R2 = regla2 && REGLAS[regla2].t;
    const errores = [];
    let interno, txtExpr;
    if (forma === 'izq') {
      interno = o(x, y);
      errores.push(h('RMP25-otro-parentesis', o(x, o(y, z)), `Operaste primero ${y} ◇ ${z}, pero el paréntesis manda empezar por (${x} ◇ ${y}). En un operador inventado no se puede cambiar el agrupamiento.`));
      errores.push(h('RMP25-conmuta', o(z, o(y, x)), 'Cambiaste el orden de los operandos. En a ◇ b, a es el de la izquierda y b el de la derecha: la regla no es conmutativa.'));
      errores.push(h('RMP25-conmuta-afuera', o(z, interno), `En la operación de afuera pusiste ${z} como a. El resultado del paréntesis está a la izquierda, así que hace de a.`));
      txtExpr = [`(`, v('x', x), ' ◇ ', v('y', y), ') ◇ ', v('z', z)];
    } else if (forma === 'der') {
      interno = o(y, z);
      errores.push(h('RMP25-otro-parentesis', o(o(x, y), z), `Operaste de izquierda a derecha sin mirar el paréntesis: primero va (${y} ◇ ${z}), y su resultado hace de b.`));
      errores.push(h('RMP25-conmuta', o(o(z, y), x), 'Cambiaste el orden de los operandos. En a ◇ b, a es el de la izquierda y b el de la derecha: la regla no es conmutativa.'));
      errores.push(h('RMP25-conmuta-afuera', o(interno, x), `En la operación de afuera pusiste el resultado del paréntesis como a. Está a la derecha de ${x}, así que hace de b.`));
      txtExpr = [v('x', x), ' ◇ (', v('y', y), ' ◇ ', v('z', z), ')'];
    } else {
      interno = o(x, y);
      errores.push(h('RMP25-un-operador', o(interno, z), `Usaste la regla de ◇ también para ∗. Son dos operadores distintos: el de afuera es ∗, con su propia regla.`));
      errores.push(h('RMP25-operadores-cruzados', o(o2(x, y), z), 'Cruzaste los operadores: usaste la regla de ∗ en el paréntesis y la de ◇ afuera.'));
      errores.push(h('RMP25-conmuta', o2(z, o(y, x)), 'Cambiaste el orden de los operandos. En a ∗ b y en a ◇ b, a es el de la izquierda: estas reglas no son conmutativas.'));
      txtExpr = ['(', v('x', x), ' ◇ ', v('y', y), ') ∗ ', v('z', z)];
    }
    if (correcta === interno) return null; // el error «solo el paréntesis» daría la respuesta
    errores.push(h('RMP23-solo-parentesis', interno, 'Ese es solo el valor del paréntesis. Falta la operación de afuera.'));
    const variables = { x: { nombre: 'primer número', color: 'o' }, y: { nombre: 'segundo número', color: 'i' }, z: { nombre: 'tercer número', color: 'h' }, p: { nombre: 'valor del paréntesis', color: 'd' } };
    const enunciado = ['Se define la operación a ◇ b = ', R, ...(forma === 'mixto' ? [' y la operación a ∗ b = ', R2] : []), ' para números enteros.'];
    const pasoInterno = forma === 'der' ? [v('y', y), ' ◇ ', v('z', z)] : [v('x', x), ' ◇ ', v('y', y)];
    const [ia, ib] = forma === 'der' ? [y, z] : [x, y];
    const afuera = forma === 'izq' ? [interno, z, regla, '◇'] : forma === 'der' ? [x, interno, regla, '◇'] : [interno, z, regla2, '∗'];
    // En la lista «a = …, b = …» el valor va suelto; dentro de la operación, un negativo va entre paréntesis.
    const pT = v('p', f(interno)), pE = v('p', pn(interno));
    const [aT, bT] = forma === 'der' ? [v('x', x), pT] : [pT, v('z', z)];
    const [aE, bE] = forma === 'der' ? [v('x', x), pE] : [pE, v('z', z)];
    const solucion = [
      ['Primero el paréntesis: ', ...pasoInterno, ` = ${REGLAS[regla].s(ia, ib)} = `, v('p', f(interno)), '.'],
      ['Luego la operación de afuera, con a = ', aT, ' y b = ', bT, ': ', aE, ` ${afuera[3]} `, bE, ` = ${REGLAS[afuera[2]].s(afuera[0], afuera[1])} = ${f(correcta)}.`],
      ['La regla no es conmutativa: a es siempre el número de la izquierda y b el de la derecha.'],
    ];
    return { datos, correcta, errores, variables, enunciado, pregunta: ['Calcula ', ...txtExpr, '.'], solucion, negativos: true };
  };

  return { id: ID, titulo: 'Diagramas de flujo y operadores', generar, calc: { resolver, programa, ejecutar, evaluar, esPrimo, sumaCifras, operar, dibujar, describir } };
});
