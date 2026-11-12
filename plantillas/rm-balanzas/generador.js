/*
 * Generador: balanzas con figuras y pesas.
 * Formato "predicciones" (docs/arquitectura.md). Funciona en el navegador
 * (window.Generadores['rm-balanzas']) y en Node (require).
 *
 * Una balanza se describe con { izq, der, estado }: izq y der son lo que hay en cada platillo ({ circulo: 2,
 * triangulo: 1, pesa: 40 }: figuras por cantidad y pesas en kg o g), y estado es 'equilibrio', 'izq-baja' (baja el
 * platillo izquierdo: pesa más) o 'der-baja'. Convención de cortes-pesadas: «el platillo del objeto» es donde está lo
 * que se pesa (una pesa ahí resta) y «el otro platillo» el de enfrente (una pesa ahí suma).
 *
 * Tipos y sus _datos:
 *   desigualdad   { tipo, balanzas, pide: 'max' | 'min', figura }   figuras de peso entero (kg); el mayor o el menor
 *                 peso posible de una figura.
 *   sustitucion   { tipo, balanzas, pregunta: { izq, figura } }      tres balanzas en equilibrio; ¿cuántas figuras de un
 *                 tipo equilibran lo que hay en izq?
 *   minimo-pesas  { tipo, valores: [v1, v2, v3], carga }             pesas de tres valores, tantas como haga falta de
 *                 cada uno, todas en el otro platillo; el menor número de pesas para equilibrar la carga.
 *   una-pesada    { tipo, base: 10 | 3, cantidad }                   una sola pesada con los dos platillos.
 *                 base 10: pesas de 1, 10, 100, 1000 y 10 000 g, tantas como haga falta; el menor número de pesas.
 *                 base 3: una pesa de cada una de 1, 3, 9, 27, 81 y 243 g; cuántas se usan.
 *   combinado     { tipo, balanzas, pide: { figura: cantidad } }     (nuevo, cierre-100) dos balanzas en equilibrio con
 *                 pesas de kg, una desequilibrada; con pesos enteros los tres pesos quedan fijos: el peso de una
 *                 combinación de figuras (por ejemplo dos esferas y un cubo).
 *
 * calc (funciones puras):
 *   pesoBalanza(lado, pesos)              peso de un platillo con los pesos dados ({ circulo: 6, … })
 *   desigualdad({ balanzas, pide, figura })   { respuesta, t: [tmin, tmax], coef: { figura: k } } con figura = k·t
 *   sustitucion({ balanzas, pregunta })        { respuesta, pesos (en la unidad de la figura pedida, fracciones [n, d]) }
 *   minimoPesas({ valores, carga })            { respuesta, uso: [x, y, z] }
 *   unaPesada({ base, cantidad })              { respuesta, otro: [pesas], junto: [pesas] }
 *   combinado({ balanzas, pide })              { respuesta, soluciones, valores }
 *
 * Errores (todos hipótesis; docs/clasificacion/trampas-admision-unmsm/rm-a.md fila 13 y los huecos de balanzas):
 *   RMP2-…    quedarse con la primera solución que aparece, sin minimizar ni maximizar
 *   RMP38-…   plantear mal las balanzas (tomar la desigualdad como igualdad, olvidar los enteros, sustituir a medias,
 *             invertir una razón, responder por otra figura)
 *   RMP39-…   usar un solo platillo, sin restar pesas
 *   RMP98-…   (cierre-100) ignorar la balanza desequilibrada y quedarse con una solución de las otras dos
 *   RMP99-…   (cierre-100) tomar el borde de la desigualdad como si se alcanzara
 *
 * Los tipos nuevos solo salen con semillas de práctica (texto que no sea entrada-… ni salida-…) y con semillas
 * numéricas desde 400, para que los casos ya verificados no cambien.
 */
(function (root, fabrica) {
  const nodo = typeof module === 'object' && module.exports;
  const api = fabrica(nodo ? require('../../nucleo/azar.js') : root.Azar,
                      nodo ? require('../../nucleo/predicciones.js') : root.Predicciones);
  if (nodo) module.exports = api;
  else (root.Generadores = root.Generadores || {})[api.id] = api;
})(typeof self !== 'undefined' ? self : this, function (Azar, P) {
  'use strict';
  const ID = 'rm-balanzas';
  const h = (id, valor, explicacion) => ({ id, valor, explicacion, respaldo: 'hipotesis', fuente: null });
  const v = P.v, x = P.xml;
  const f = (n, d = 2) => P.formatear(n, d);
  const lista = l => l.length <= 1 ? l.join('') : l.slice(0, -1).join(', ') + ' y ' + l[l.length - 1];
  const FIGS = ['circulo', 'triangulo', 'cuadrado', 'rombo'];
  const NOMBRE = { circulo: ['círculo', 'círculos'], triangulo: ['triángulo', 'triángulos'], cuadrado: ['cuadrado', 'cuadrados'], rombo: ['rombo', 'rombos'] };
  const COLOR = { circulo: 'o', triangulo: 'i', cuadrado: 'h', rombo: 'd' };
  const peso = (lado, pesos) => pesoBalanza(lado, pesos);
  const mcd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a || 1; };

  // ======================= cálculo (regla 1) =======================
  function pesoBalanza(lado, pesos) { let s = 0; for (const [k, n] of Object.entries(lado)) s += k === 'pesa' ? n : n * pesos[k]; return s; }

  // Las dos primeras balanzas (en equilibrio) dejan todas las figuras como múltiplos de un mismo t entero; las demás
  // (desequilibradas) acotan t. Se recorre t = 1, 2, 3… y se guardan los que cumplen todo.
  function desigualdad({ balanzas, pide, figura }) {
    const coef = coeficientes(balanzas.filter(b => b.estado === 'equilibrio'));
    const ok = [];
    for (let t = 1; t <= 1000; t++) {
      const pesos = {}; for (const k in coef) pesos[k] = coef[k] * t;
      if (balanzas.every(b => cumple(b, pesos))) ok.push(t);
    }
    if (!ok.length || ok[ok.length - 1] === 1000) return { respuesta: null };
    const t = [ok[0], ok[ok.length - 1]];
    return { respuesta: coef[figura] * (pide === 'max' ? t[1] : t[0]), t, coef };
  }
  function cumple(b, pesos) {
    const I = pesoBalanza(b.izq, pesos), D = pesoBalanza(b.der, pesos);
    return b.estado === 'equilibrio' ? I === D : b.estado === 'izq-baja' ? I > D : D > I;
  }
  // Pesos enteros más chicos que cumplen las balanzas en equilibrio: núcleo de la matriz (izq − der) por eliminación,
  // con la última figura libre; se escala hasta que todos sean enteros. Si la solución no es única (salvo la escala) o
  // algún peso no es positivo, devuelve {}.
  function coeficientes(eqs) {
    const figs = FIGS.filter(k => eqs.some(b => b.izq[k] || b.der[k]));
    const M = eqs.map(b => figs.map(k => (b.izq[k] || 0) - (b.der[k] || 0)));
    const n = figs.length, piv = [];
    let fila = 0;
    for (let col = 0; col < n && fila < M.length; col++) {
      const r = M.findIndex((row, i) => i >= fila && Math.abs(row[col]) > 1e-12);
      if (r < 0) continue;
      [M[fila], M[r]] = [M[r], M[fila]];
      for (let i = 0; i < M.length; i++) if (i !== fila) { const c = M[i][col] / M[fila][col]; for (let j = 0; j < n; j++) M[i][j] -= c * M[fila][j]; }
      piv.push(col); fila++;
    }
    if (piv.length !== n - 1) return {};
    const libre = [...Array(n).keys()].find(c => !piv.includes(c));
    const w = new Array(n).fill(0); w[libre] = 1;
    piv.forEach((col, i) => { w[col] = -M[i][libre] / M[i][col]; });
    let esc = 0;
    for (let k = 1; k <= 2000 && !esc; k++) if (w.every(z => Math.abs(z * k - Math.round(z * k)) < 1e-9)) esc = k;
    if (!esc) return {};
    const ent = w.map(z => Math.round(z * esc));
    if (ent.some(z => z <= 0)) return {};
    const g = ent.reduce(mcd);
    const r = {}; figs.forEach((k, i) => { r[k] = ent[i] / g; });
    return r;
  }

  // Sustitución: con pesos enteros proporcionales (los más chicos), cuántas figuras pedidas equilibran lo de izq.
  function sustitucion({ balanzas, pregunta }) {
    const w = coeficientes(balanzas);
    const total = pesoBalanza(pregunta.izq, w);
    return { respuesta: total / w[pregunta.figura], pesos: w };
  }

  // Cambio de monedas con las pesas: menor número de pesas (programación dinámica).
  function minimoPesas({ valores, carga }) {
    const best = new Array(carga + 1).fill(Infinity), de = new Array(carga + 1).fill(-1);
    best[0] = 0;
    for (let s = 1; s <= carga; s++) for (let i = 0; i < valores.length; i++) {
      const vv = valores[i];
      if (vv <= s && best[s - vv] + 1 < best[s]) { best[s] = best[s - vv] + 1; de[s] = i; }
    }
    if (!Number.isFinite(best[carga])) return { respuesta: null };
    const uso = valores.map(() => 0);
    for (let s = carga; s > 0; s -= valores[de[s]]) uso[de[s]]++;
    return { respuesta: best[carga], uso };
  }

  // Una pesada con los dos platillos.
  function unaPesada({ base, cantidad }) {
    if (base === 3) {
      // ternario balanceado: cada pesa va al otro platillo (+1), al del objeto (−1) o fuera (0)
      const otro = [], junto = [];
      let n = cantidad, p = 1;
      while (n) { let r = n % 3; n = Math.floor(n / 3); if (r === 2) { junto.push(p); n += 1; } else if (r === 1) otro.push(p); p *= 3; }
      return { respuesta: otro.length + junto.length, otro, junto };
    }
    // base 10: en cada cifra (más lo que se lleva) se ponen d pesas en el otro platillo, o 10 − d en el del objeto
    // y se lleva 1. Programación dinámica con lo que se lleva (0 o 1).
    const cifras = String(cantidad).split('').reverse().map(Number);
    let estados = [{ c: 0, n: 0, otro: [], junto: [] }, null];
    for (let i = 0; i < cifras.length; i++) {
      const sig = [null, null], pot = 10 ** i;
      for (const e of estados) {
        if (!e) continue;
        const d = cifras[i] + e.c;
        const ops = [[d % 10, 0, d === 10 ? 1 : 0], [10 - d, 1, 1]].filter(o => o[0] >= 0 && o[0] <= 10);
        for (const [k, lado, lleva] of ops) {
          const nuevo = { c: lleva, n: e.n + k, otro: e.otro.slice(), junto: e.junto.slice() };
          for (let j = 0; j < k; j++) (lado ? nuevo.junto : nuevo.otro).push(pot);
          if (!sig[lleva] || nuevo.n < sig[lleva].n) sig[lleva] = nuevo;
        }
      }
      estados = sig;
    }
    const fin = [estados[0], estados[1] && { ...estados[1], n: estados[1].n + 1, otro: estados[1].otro.concat([10 ** cifras.length]) }].filter(Boolean)
      .sort((a, b) => a.n - b.n)[0];
    return { respuesta: fin.n, otro: fin.otro.sort((a, b) => b - a), junto: fin.junto.sort((a, b) => b - a) };
  }

  // Todas las asignaciones de pesos enteros (1 a tope) a las figuras que cumplen las balanzas dadas.
  function soluciones(balanzas, tope) {
    const figs = FIGS.filter(k => balanzas.some(b => b.izq[k] || b.der[k])), res = [], w = {};
    (function rec(i) {
      if (i === figs.length) { if (balanzas.every(b => cumple(b, w))) res.push({ ...w }); return; }
      for (let t = 1; t <= tope; t++) { w[figs[i]] = t; rec(i + 1); }
    })(0);
    return res;
  }
  // Peso de una combinación de figuras ({ esfera: 2, cubo: 1 }). La respuesta existe si todas las soluciones enteras
  // dan el mismo valor y ninguna toca el tope (si no, el peso no estaría acotado).
  function combinado({ balanzas, pide, tope = 40 }) {
    const TOPE = tope, sols = soluciones(balanzas, TOPE);
    const valor = w => Object.entries(pide).reduce((t, [k, n]) => t + n * w[k], 0);
    const vals = [...new Set(sols.map(valor))];
    const acotado = sols.every(w => Object.values(w).every(z => z < TOPE));
    return { respuesta: sols.length && acotado && vals.length === 1 ? vals[0] : null, soluciones: sols, valores: vals };
  }

  const calc = { pesoBalanza, desigualdad, sustitucion, minimoPesas, unaPesada, coeficientes, soluciones, combinado };

  // ======================= figura =======================
  function forma(tipo, cx, base) {
    const c = `style="fill:var(--c-${COLOR[tipo]});stroke:currentColor" stroke-width="1.2"`;
    if (tipo === 'circulo') return `<circle cx="${cx}" cy="${base - 9}" r="8.5" ${c}/>`;
    if (tipo === 'cuadrado') return `<rect x="${cx - 8.5}" y="${base - 17}" width="17" height="17" ${c}/>`;
    if (tipo === 'triangulo') return `<polygon points="${cx - 9.5},${base} ${cx + 9.5},${base} ${cx},${base - 17}" ${c}/>`;
    return `<polygon points="${cx},${base - 19} ${cx + 9},${base - 9.5} ${cx},${base} ${cx - 9},${base - 9.5}" ${c}/>`;
  }
  function itemsDe(lado, unidad) {
    const it = [];
    for (const k of FIGS) for (let i = 0; i < (lado[k] || 0); i++) it.push({ t: k, w: 21 });
    if (lado.pesa) it.push({ t: 'pesa', w: 16 + 8.5 * `${lado.pesa} ${unidad}`.length });
    return it;
  }
  function dibujarPlatillo(items, cx, base, unidad) {
    // Todo en una sola fila, dentro del triángulo de las cuerdas: si no cabe en 108 px, se achica (hasta 6 figuras).
    const total = items.reduce((a, b) => a + b.w, 0), k = total > 108 ? 108 / total : 1;
    let s = '';
    [items].forEach(fila => {
      let xx = cx - total * k / 2; const yb = base - 1;
      for (const it0 of fila) {
        const it = { ...it0, w: it0.w * k };
        if (it.t === 'pesa') {
          const txt = `${items.find(z => z.t === 'pesa').etiqueta}`;
          s += `<rect x="${xx + 1}" y="${yb - 19}" width="${it.w - 2}" height="19" rx="3" style="fill:var(--card);stroke:currentColor" stroke-width="1.5"/>`;
          s += `<text x="${xx + it.w / 2}" y="${yb - 5}" text-anchor="middle" font-size="14">${x(txt)}</text>`;
        } else {
          const c0 = xx + it.w / 2;
          s += k === 1 ? forma(it.t, c0, yb) : `<g transform="translate(${c0} ${yb}) scale(${+k.toFixed(3)}) translate(${-c0} ${-yb})">${forma(it.t, c0, yb)}</g>`;
        }
        xx += it.w;
      }
    });
    return s;
  }
  function figuraBalanzas(balanzas, unidad) {
    const alto = 128, colg = 70, medio = 70;   // alto de cada balanza, largo de las cuerdas y medio ancho del platillo
    let s = `<svg viewBox="0 0 380 ${balanzas.length * alto + 6}" xmlns="http://www.w3.org/2000/svg">`;
    balanzas.forEach((b, i) => {
      // El travesaño se inclina y los platillos suben y bajan con él (el que pesa más queda abajo).
      const y0 = i * alto + 4, eje = y0 + 34, inc = b.estado === 'izq-baja' ? 14 : b.estado === 'der-baja' ? -14 : 0;
      const xl = 78, xr = 302, yl = eje + inc, yr = eje - inc;
      s += `<text x="8" y="${y0 + 16}" font-size="14" style="fill:var(--muted)">${x(`${i + 1}.`)}</text>`;
      s += `<line x1="190" y1="${eje}" x2="190" y2="${y0 + 120}" style="stroke:currentColor" stroke-width="3"/>`;
      s += `<line x1="160" y1="${y0 + 120}" x2="220" y2="${y0 + 120}" style="stroke:currentColor" stroke-width="3"/>`;
      s += `<line x1="${xl}" y1="${yl}" x2="${xr}" y2="${yr}" style="stroke:currentColor" stroke-width="3" stroke-linecap="round"/>`;
      s += `<circle cx="190" cy="${eje}" r="4" style="fill:currentColor"/>`;
      for (const [cx, yy, lado] of [[xl, yl, b.izq], [xr, yr, b.der]]) {
        const base = yy + colg;
        s += `<line x1="${cx}" y1="${yy}" x2="${cx - medio}" y2="${base}" style="stroke:var(--muted)" stroke-width="1"/>`;
        s += `<line x1="${cx}" y1="${yy}" x2="${cx + medio}" y2="${base}" style="stroke:var(--muted)" stroke-width="1"/>`;
        s += `<line x1="${cx - medio}" y1="${base}" x2="${cx + medio}" y2="${base}" style="stroke:currentColor" stroke-width="3" stroke-linecap="round"/>`;
        const items = itemsDe(lado, unidad);
        if (lado.pesa) items.find(z => z.t === 'pesa').etiqueta = `${lado.pesa} ${unidad}`;
        s += dibujarPlatillo(items, cx, base, unidad);
      }
    });
    return s + '</svg>';
  }
  function ladoTexto(lado, unidad) {
    const p = FIGS.filter(k => lado[k]).map(k => `${lado[k]} ${NOMBRE[k][lado[k] === 1 ? 0 : 1]}`);
    if (lado.pesa) p.push(`una pesa de ${lado.pesa} ${unidad}`);
    return lista(p) || 'nada';
  }
  const ESTADO = { equilibrio: 'en equilibrio', 'izq-baja': 'baja el platillo izquierdo', 'der-baja': 'baja el platillo derecho' };
  function balanzaTexto(b, i, unidad) { return `Balanza ${i + 1} (${ESTADO[b.estado]}): a la izquierda, ${ladoTexto(b.izq, unidad)}; a la derecha, ${ladoTexto(b.der, unidad)}.`; }
  function altBalanzas(bs, unidad) { return bs.map((b, i) => balanzaTexto(b, i, unidad)).join(' '); }
  const nf = (k, n) => `${n} ${NOMBRE[k][n === 1 ? 0 : 1]}`;

  // ======================= redacción =======================
  const TIPOS = ['desigualdad', 'sustitucion', 'minimo-pesas', 'una-pesada'];
  const conNuevos = s => (typeof s === 'number' ? s >= 400 : !/^(entrada|salida)-/.test(s));
  function generar(semilla) {
    const rng = Azar.crear(ID + '|' + semilla);
    let tipo = rng.elegir(TIPOS);
    if (conNuevos(semilla)) { const lado = Azar.crear(ID + '+nuevos|' + semilla); if (lado.sig() < 0.3) tipo = 'combinado'; }
    for (let intento = 0; intento < 100; intento++) {
      const p = construir(rng, semilla, tipo);
      if (p && p.alternativas.length >= 4) return p;
    }
    throw new Error('No se pudo generar un problema con 4 alternativas distintas');
  }
  function construir(rng, semilla, tipo) {
    return { desigualdad: tDesigualdad, sustitucion: tSustitucion, 'minimo-pesas': tMinimoPesas, 'una-pesada': tUnaPesada, combinado: tCombinado }[tipo](rng, semilla);
  }
  function cerrar(rng, semilla, o) {
    const u = o.unidad || '';
    const alternativas = P.armar({ correcta: o.correcta, errores: o.errores.filter(e => e && Number.isFinite(e.valor)), rng,
      texto: o.formato || (y => f(y) + (u ? ' ' + (y === 1 && o.singular ? o.singular : u) : '')) });
    const p = { id: `${ID}#${semilla}`, variables: o.variables, enunciado: o.enunciado, pregunta: o.pregunta, datos: '',
      alternativas, solucion: o.solucion, respuesta: { valor: o.correcta, unidad: u }, _datos: o.datos };
    if (o.figura) p.figura = o.figura;
    return p;
  }
  const varsFig = figs => { const r = {}; for (const k of figs) r[k] = { nombre: 'peso del ' + NOMBRE[k][0], color: COLOR[k] }; return r; };
  // Texto de un platillo con cada figura en su color: «2 círculos, 1 cuadrado y una pesa de 40 kg».
  const ladoV = (lado, unidad) => {
    const partes = FIGS.filter(k => lado[k]).map(k => [v(k, nf(k, lado[k]))]);
    if (lado.pesa) partes.push([`una pesa de ${lado.pesa} ${unidad}`]);
    const out = [];
    partes.forEach((pz, i) => { out.push(...pz); if (i < partes.length - 2) out.push(', '); else if (i === partes.length - 2) out.push(' y '); });
    return out.length ? out : ['nada'];
  };

  // ---------- desigualdad ----------
  function tDesigualdad(rng, semilla) {
    const [p, q] = rng.elegir([[2, 3], [3, 2], [3, 4], [4, 3], [1, 2], [2, 1], [1, 3], [3, 1], [2, 5], [5, 2], [3, 5]]);
    // círculo = p·t, triángulo = q·t, de la balanza 1: q círculos = p triángulos
    const al = rng.entero(0, 2), be = rng.entero(al === 0 ? 1 : 0, 2);
    const r = al * p + be * q;
    if (r === p || r === q || (al + be < 2)) return null;
    const coef = { circulo: p, triangulo: q, cuadrado: r };
    const b1 = { izq: { circulo: q }, der: { triangulo: p }, estado: 'equilibrio' };
    const b2 = { izq: { cuadrado: 1 }, der: {}, estado: 'equilibrio' };
    if (al) b2.der.circulo = al; if (be) b2.der.triangulo = be;
    // desigualdad de arriba: figuras (una o dos clases) pesan menos que una pesa W
    const combo = () => { const ks = rng.barajar(['circulo', 'triangulo', 'cuadrado']).slice(0, rng.entero(1, 2)); const c = {}; for (const k of ks) c[k] = rng.entero(1, 3); return c; };
    const cA = combo(), KA = Object.keys(cA).reduce((s, k) => s + cA[k] * coef[k], 0);
    const tmax = rng.entero(3, 12), WA = KA * tmax + rng.entero(1, KA);
    const bA = rng.moneda() ? { izq: cA, der: { pesa: WA }, estado: 'der-baja' } : { izq: { pesa: WA }, der: cA, estado: 'izq-baja' };
    const conAbajo = rng.moneda();
    const balanzas = [b1, b2, bA];
    if (conAbajo) {
      const cB = combo(), KB = Object.keys(cB).reduce((s, k) => s + cB[k] * coef[k], 0);
      const tmin = rng.entero(2, tmax - 1), WB = KB * (tmin - 1) + rng.entero(0, KB - 1);
      if (WB <= 0) return null;
      balanzas.push(rng.moneda() ? { izq: cB, der: { pesa: WB }, estado: 'izq-baja' } : { izq: { pesa: WB }, der: cB, estado: 'der-baja' });
    }
    const orden = [0, 1].concat(rng.barajar(balanzas.slice(2).map((_, i) => i + 2)));
    const bs = orden.map(i => balanzas[i]);
    const pide = conAbajo && rng.moneda() ? 'min' : 'max';
    const figura = rng.elegir(['circulo', 'triangulo', 'cuadrado']);
    const datos = { tipo: 'desigualdad', balanzas: bs, pide, figura };
    const R = desigualdad(datos);
    if (R.respuesta === null || R.t[0] === R.t[1]) return null;
    const res = R.respuesta, cF = R.coef[figura];
    // la desigualdad que decide la respuesta y su borde real
    const desq = bs.filter(b => b.estado !== 'equilibrio').map(b => {
      const figLado = b.izq.pesa ? b.der : b.izq, W = b.izq.pesa || b.der.pesa;
      const K = Object.keys(figLado).reduce((s, k) => s + figLado[k] * R.coef[k], 0);
      const figsBajan = (b.estado === 'izq-baja') === !b.izq.pesa;
      return { b, W, K, arriba: !figsBajan };
    });
    const decide = desq.find(z => z.arriba === (pide === 'max'));
    const borde = cF * decide.W / decide.K;
    const otra = rng.elegir(['circulo', 'triangulo', 'cuadrado'].filter(k => k !== figura));
    const errores = [
      pide === 'max'
        ? h('RMP38-sin-enteros', Math.ceil(borde) - 1, `Ese es el mayor entero por debajo de ${f(borde)}, pero el ${NOMBRE[figura][0]} siempre pesa un múltiplo de ${cF} (todas las figuras son múltiplos de una misma medida): ese valor no se puede.`)
        : h('RMP38-sin-enteros', Math.floor(borde) + 1, `Ese es el menor entero por encima de ${f(borde)}, pero el ${NOMBRE[figura][0]} siempre pesa un múltiplo de ${cF} (todas las figuras son múltiplos de una misma medida): ese valor no se puede.`),
      // Si el borde no es entero se muestra «unos 65,1 kg»; si redondeado parece entero, se descarta (se confundiría).
      Number.isInteger(borde) || Math.abs(borde - Math.round(borde)) >= 0.05 ? h('RMP38-igualdad', borde, 'Tomaste la balanza que no está en equilibrio como si lo estuviera. Al bajar un platillo, ese lado pesa más: es una desigualdad estricta, y el borde no se alcanza.') : null,
      h('RMP2-sin-optimizar', cF * (pide === 'max' ? R.t[0] : R.t[1]), pide === 'max' ? 'Ese peso sí es posible, pero no es el mayor: hay valores más grandes que también cumplen todas las balanzas.' : 'Ese peso sí es posible, pero no es el menor: hay valores más chicos que también cumplen todas las balanzas.'),
      h('RMP38-otra-figura', R.coef[otra] * (pide === 'max' ? R.t[1] : R.t[0]), `Ese es el ${pide === 'max' ? 'mayor' : 'menor'} peso del ${NOMBRE[otra][0]}, no del ${NOMBRE[figura][0]}.`),
    ];
    const vars = varsFig(['circulo', 'triangulo', 'cuadrado']);
    const enunciado = ['Cada figura pesa un número entero de kilogramos, y figuras iguales pesan lo mismo. Mira las balanzas:'];
    bs.forEach((b, i) => enunciado.push(` (${i + 1}) ${ESTADO[b.estado][0].toUpperCase() + ESTADO[b.estado].slice(1)}: a la izquierda, `, ...ladoV(b.izq, 'kg'), '; a la derecha, ', ...ladoV(b.der, 'kg'), '.'));
    const pregunta = [`¿Cuál es el ${pide === 'max' ? 'mayor' : 'menor'} peso posible de un `, v(figura, NOMBRE[figura][0]), '?'];
    const tt = 't';
    const lin = k => (R.coef[k] === 1 ? tt : `${R.coef[k]}${tt}`);
    const solucion = [
      ['De la balanza 1: ', v('circulo', nf('circulo', q)), ' = ', v('triangulo', nf('triangulo', p)), `, así que un círculo pesa ${p} parte${p === 1 ? '' : 's'} y un triángulo ${q} parte${q === 1 ? '' : 's'} iguales: `, v('circulo', `círculo = ${lin('circulo')}`), ', ', v('triangulo', `triángulo = ${lin('triangulo')}`), ', con t entero (los pesos son enteros).'],
      ['De la balanza 2: ', v('cuadrado', `cuadrado = ${lin('cuadrado')}`), '.'],
      ...desq.map(z => [`Balanza ${bs.indexOf(z.b) + 1}: las figuras pesan ${z.K}t y la pesa ${z.W} kg; ${z.arriba ? `baja la pesa, así que ${z.K}t < ${z.W} y t < ${f(z.W / z.K)}` : `bajan las figuras, así que ${z.K}t > ${z.W} y t > ${f(z.W / z.K)}`}.`]),
      [`Con t entero: t va de ${R.t[0]} a ${R.t[1]}. El ${pide === 'max' ? 'mayor' : 'menor'} peso del `, v(figura, NOMBRE[figura][0]), ` es ${cF} × ${pide === 'max' ? R.t[1] : R.t[0]} = ${f(res)} kg.`],
    ];
    return cerrar(rng, semilla, { correcta: res, errores, enunciado, pregunta, solucion, variables: vars, datos, unidad: 'kg',
      formato: y => Number.isInteger(y) ? `${f(y)} kg` : `unos ${f(y, 1)} kg`,
      figura: { svg: figuraBalanzas(bs, 'kg'), alt: altBalanzas(bs, 'kg') } });
  }

  // ---------- sustitución ----------
  // Plantillas de balanza que expresan una figura nueva con las ya conocidas.
  function tSustitucion(rng, semilla) {
    const orden = rng.barajar(FIGS.slice());       // orden[0] la más liviana … orden[3] la más pesada
    const w = {}; w[orden[0]] = rng.entero(1, 3);
    const bs = [], conocidas = [orden[0]];
    for (let i = 1; i < 4; i++) {
      const nueva = orden[i], forma0 = rng.entero(0, 2);
      let b = null;
      if (forma0 === 0 || conocidas.length < 2) {
        // m · nueva = n · vieja, con la nueva más pesada
        const vieja = rng.elegir(conocidas), m = rng.entero(1, 3), n = rng.entero(m + 1, m + 3);
        if ((n * w[vieja]) % m) return null;
        w[nueva] = n * w[vieja] / m;
        b = { izq: { [nueva]: m }, der: { [vieja]: n }, estado: 'equilibrio' };
      } else if (forma0 === 1) {
        // nueva = vieja1 + k·vieja2
        const [a1, a2] = rng.barajar(conocidas).slice(0, 2), k = rng.entero(1, 2);
        w[nueva] = w[a1] + k * w[a2];
        b = { izq: { [nueva]: 1 }, der: { [a1]: 1, [a2]: k }, estado: 'equilibrio' };
      } else {
        // nueva + vieja1 = n · vieja2
        const [a1, a2] = rng.barajar(conocidas).slice(0, 2), n = rng.entero(2, 4);
        w[nueva] = n * w[a2] - w[a1];
        if (w[nueva] <= Math.max(...conocidas.map(c => w[c]))) return null;
        b = { izq: { [nueva]: 1, [a1]: 1 }, der: { [a2]: n }, estado: 'equilibrio' };
      }
      if (rng.moneda()) b = { izq: b.der, der: b.izq, estado: 'equilibrio' };
      bs.push(b); conocidas.push(nueva);
    }
    const pesada = orden[3], liviana = orden[0], k = rng.entero(1, 3);
    const izq = { [pesada]: k };
    if (rng.moneda()) izq[orden[rng.entero(1, 2)]] = rng.entero(1, 2);
    const total = pesoBalanza(izq, w);
    if (total % w[liviana]) return null;
    const pregunta0 = { izq, figura: liviana };
    const bsOrden = rng.barajar(bs);
    const datos = { tipo: 'sustitucion', balanzas: bsOrden, pregunta: pregunta0 };
    const R = sustitucion(datos), res = R.respuesta;
    if (!Number.isInteger(res) || res > 80) return null;
    const W = R.pesos;
    if (Object.keys(W).length !== 4 || Object.values(W).some(z => z > 40)) return null;
    // errores
    const enUnidades = (pesos) => pesoBalanza(izq, pesos) / pesos[liviana];
    const errores = [];
    // invertir la razón de una balanza m·X = n·Y
    const razon = bs.find(b => Object.keys(b.izq).length === 1 && Object.keys(b.der).length === 1);
    if (razon) {
      const [X] = Object.keys(razon.izq), [Y] = Object.keys(razon.der), m = razon.izq[X], n = razon.der[Y];
      const mal = recalcPesos(bs.map(b => (b === razon ? { izq: { [X]: n }, der: { [Y]: m }, estado: 'equilibrio' } : b)));
      if (mal) errores.push(h('RMP38-razon-invertida', enUnidades(mal), `Invertiste una razón: ${nf(X, m)} ${m === 1 ? 'equilibra' : 'equilibran'} a ${nf(Y, n)}, así que un ${NOMBRE[X][0]} pesa lo que ${P.textoFraccion(P.frac(n, m))} ${NOMBRE[Y][n === m ? 0 : 1]}, no lo que ${P.textoFraccion(P.frac(m, n))}.`));
    }
    // sustituir a medias: en una balanza con dos figuras de un lado, se olvida una
    const doble = bs.find(b => Object.keys(b.izq).length + Object.keys(b.der).length === 3);
    if (doble) {
      const ladoDos = Object.keys(doble.izq).length === 2 ? 'izq' : 'der';
      const ks = Object.keys(doble[ladoDos]).filter(kk => kk !== conocidaNueva(doble, orden));
      if (ks.length) {
        const quita = ks[ks.length - 1];
        const lado = { ...doble[ladoDos] }; delete lado[quita];
        const mod = { ...doble, [ladoDos]: lado };
        const mal = recalcPesos(bs.map(b => (b === doble ? mod : b)));
        if (mal) errores.push(h('RMP38-sumar-sin-sustituir', enUnidades(mal), `En una balanza hay dos clases de figuras en un platillo y reemplazaste solo una: el ${NOMBRE[quita][0]} también pesa y hay que sustituirlo.`));
      }
    }
    // a medio camino: la respuesta en otra figura
    const intermedia = orden[1];
    errores.push(h('RMP38-a-medio-camino', pesoBalanza(izq, W) / W[intermedia], `Ese es el número de ${NOMBRE[intermedia][1]} que equilibran, no de ${NOMBRE[liviana][1]}: falta un paso de sustitución.`));
    errores.push(h('RMP38-sin-multiplicar', W[pesada] / W[liviana] + (Object.keys(izq).length > 1 ? pesoBalanza(Object.fromEntries(Object.entries(izq).filter(([kk]) => kk !== pesada)), W) / W[liviana] : 0), `Ese es el valor para un solo ${NOMBRE[pesada][0]}; en el platillo hay ${k}.`));
    if (k === 1) errores.pop();
    errores.push(h('RMP38-uno-de-mas', res + 1, 'Te pasaste por uno. Vuelve a sumar el peso de todo el platillo en unidades de la figura pedida.'));
    const vars = varsFig(FIGS);
    const enunciado = ['Figuras iguales pesan lo mismo. Las tres balanzas están en equilibrio:'];
    bsOrden.forEach((b, i) => enunciado.push(` (${i + 1}) a la izquierda, `, ...ladoV(b.izq, 'kg'), '; a la derecha, ', ...ladoV(b.der, 'kg'), '.'));
    const pregunta = ['¿Cuántos ', v(liviana, NOMBRE[liviana][1]), ' equilibran a ', ...ladoV(izq, 'kg'), '?'];
    // solución: pesos relativos, de la más liviana a la más pesada
    const un = W[liviana];
    const enL = kk => P.textoFraccion(P.frac(W[kk], un));
    const pasos = [[`Toma como medida el `, v(liviana, NOMBRE[liviana][0]), '. Cada balanza dice cuánto pesa una figura nueva con las que ya conoces:']];
    for (let i = 1; i < 4; i++) {
      const kk = orden[i], b = bs[i - 1], ib = bsOrden.indexOf(b) + 1;
      pasos.push([`Balanza ${ib}: `, ...ladoV(b.izq, 'kg'), ' = ', ...ladoV(b.der, 'kg'), ' → ', v(kk, `1 ${NOMBRE[kk][0]} = ${enL(kk)} ${NOMBRE[liviana][W[kk] === un ? 0 : 1]}`), '.']);
    }
    pasos.push(['Platillo pedido: ', ...ladoV(izq, 'kg'), ` = ${Object.keys(izq).map(kk => `${izq[kk]} × ${enL(kk)}`).join(' + ')} = `, v(liviana, `${res} ${NOMBRE[liviana][res === 1 ? 0 : 1]}`), '.']);
    return cerrar(rng, semilla, { correcta: res, errores, enunciado, pregunta, solucion: pasos, variables: vars, datos, unidad: NOMBRE[liviana][1], singular: NOMBRE[liviana][0],
      figura: { svg: figuraBalanzas(bsOrden, 'kg'), alt: altBalanzas(bsOrden, 'kg') } });
  }
  // La figura que cada balanza define (la más pesada de las que aparecen, según el orden).
  function conocidaNueva(b, orden) { const ks = Object.keys(b.izq).concat(Object.keys(b.der)); return ks.sort((a, c) => orden.indexOf(c) - orden.indexOf(a))[0]; }
  function recalcPesos(bs) {
    const w = coeficientes(bs);
    return Object.keys(w).length === 4 ? w : null;
  }

  // ---------- mínimo de pesas ----------
  function tMinimoPesas(rng, semilla) {
    const valores = rng.elegir([[3, 5, 7], [2, 5, 9], [4, 7, 10], [5, 8, 13], [3, 7, 11], [4, 9, 11], [5, 7, 12], [3, 8, 13], [6, 9, 14], [5, 9, 16]]);
    const carga = rng.entero(25, 110);
    const datos = { tipo: 'minimo-pesas', valores, carga };
    const R = minimoPesas(datos);
    if (R.respuesta === null) return null;
    const [a, b, c] = valores;
    // primera solución: tantas de la mayor como se pueda, luego de la del medio, y se va bajando hasta que cierre
    let primera = null;
    for (let z = Math.floor(carga / c); z >= 0 && !primera; z--) for (let y = Math.floor((carga - z * c) / b); y >= 0 && !primera; y--) {
      const resto = carga - z * c - y * b; if (resto % a === 0) primera = [resto / a, y, z];
    }
    const sinMayor = minimoPesas({ valores: [a, b], carga }).respuesta;
    const errores = [
      primera ? h('RMP2-primera', primera[0] + primera[1] + primera[2], `Empezaste con todas las pesas de ${c} kg que caben y te quedaste con la primera combinación que cerró (${primera[2]} de ${c}, ${primera[1]} de ${b} y ${primera[0]} de ${a}). Hay otra con menos pesas.`) : null,
      h('RMP38-sin-exactitud', Math.ceil(carga / c), `Dividiste ${carga} entre ${c} y redondeaste, pero con esa cantidad de pesas no se llega a ${carga} kg exactos con estos valores.`),
      sinMayor !== null ? h('RMP2-sin-la-mayor', sinMayor, `Esa es la mejor forma sin usar la pesa de ${c} kg. Usándola se necesitan menos pesas.`) : null,
      h('RMP2-una-de-mas', R.respuesta + 1, 'Encontraste una combinación que funciona, pero hay otra con una pesa menos.'),
    ].filter(Boolean);
    const vars = { v: { nombre: 'valores de las pesas', color: 'o' }, W: { nombre: 'carga', color: 'i' } };
    const enunciado = ['En una tienda de Puno hay pesas de ', v('v', `${a} kg, ${b} kg y ${c} kg`), ', tantas como se quiera de cada valor. En un platillo de la balanza se pone un saco de ', v('W', `${carga} kg`), ' y en el otro solo pesas.'];
    const pregunta = ['¿Cuántas pesas se necesitan como mínimo para equilibrar la balanza?'];
    const [x0, y0, z0] = R.uso;
    const solucion = [
      ['Se busca ', `${a}x + ${b}y + ${c}z = `, v('W', `${carga}`), ' con x + y + z lo más chico posible. Conviene usar muchas pesas grandes, pero la suma debe salir exacta.'],
      [`Prueba con z (pesas de ${c}) de mayor a menor y, para cada una, completa con ${b} y ${a}; anota las que cierran y cuenta pesas en cada una.`],
      [`La mejor: ${z0} de ${c} kg, ${y0} de ${b} kg y ${x0} de ${a} kg: ${z0 * c} + ${y0 * b} + ${x0 * a} = ${carga}, con ${f(R.respuesta)} pesas. ${(R.respuesta - 1) * c < carga ? `No puede haber menos: ${R.respuesta - 1} pesas pesan a lo más ${R.respuesta - 1} × ${c} = ${(R.respuesta - 1) * c} kg, que no llega.` : `No puede haber menos: si revisas las combinaciones de ${R.respuesta - 1} pesas o menos, ninguna suma justo ${carga}.`}`],
    ];
    return cerrar(rng, semilla, { correcta: R.respuesta, errores, enunciado, pregunta, solucion, variables: vars, datos, unidad: 'pesas', singular: 'pesa',
      figura: { svg: figuraBalanzas([{ izq: { pesa: carga }, der: {}, estado: 'izq-baja' }], 'kg'), alt: `Una balanza con un saco de ${carga} kg en el platillo izquierdo y el derecho vacío; baja el izquierdo.` } });
  }

  // ---------- una sola pesada ----------
  function tUnaPesada(rng, semilla) {
    const base = rng.elegir([10, 10, 3]);
    const cantidad = base === 10 ? rng.entero(180, 9900) : rng.entero(20, 360);
    const datos = { tipo: 'una-pesada', base, cantidad };
    const R = unaPesada(datos);
    const vars = { Q: { nombre: 'cantidad que se pesa', color: 'o' } };
    if (base === 10) {
      const cifras = String(cantidad).split('').map(Number);
      const unPlatillo = cifras.reduce((a, b) => a + b, 0);
      const k = cifras.length, compl = 10 ** k - cantidad;
      const complemento = 1 + String(compl).split('').reduce((a, b) => a + +b, 0);
      const cifraXcifra = cifras.reduce((a, d) => a + Math.min(d, 10 - d), 0);
      const errores = [
        h('RMP39-un-platillo', unPlatillo, `Pusiste todas las pesas en el otro platillo (una por cada unidad de cada cifra). Con pesas en el platillo del arroz, que restan, se ahorran muchas.`),
        h('RMP2-complemento', complemento, `Pusiste una pesa de ${f(10 ** k, 0)} g y completaste con el resto (${f(compl, 0)} g) junto al arroz. Funciona, pero no es lo mínimo: conviene decidir cifra por cifra.`),
        h('RMP39-cifra-por-cifra', cifraXcifra, cifraXcifra > R.respuesta
          ? 'Elegiste en cada cifra lo menor entre sumar o restar, sin contar lo que te llevas. Aquí lo que se lleva ayuda: la cifra siguiente sube y se resta con menos pesas.'
          : 'Elegiste en cada cifra lo menor entre sumar o restar, pero restar en una cifra cambia la cifra de al lado (te llevas 1). Hay que contarlo.'),
        h('RMP2-una-de-mas', R.respuesta + 1, 'Encontraste una forma que funciona, pero hay otra con una pesa menos.'),
      ];
      const enunciado = ['Se quiere pesar ', v('Q', `${f(cantidad, 0)} g`), ' de arroz en una sola pesada con una balanza de dos platillos. Hay pesas de 1 g, 10 g, 100 g, 1 000 g y 10 000 g, tantas como se quiera de cada una, y se pueden poner pesas en los dos platillos: en el platillo del arroz o en el otro.'];
      const pregunta = ['¿Cuántas pesas se necesitan como mínimo?'];
      const agrupa = l => { const m = {}; for (const z of l) m[z] = (m[z] || 0) + 1; return Object.keys(m).map(Number).sort((a, b) => b - a).map(z => `${m[z]} de ${f(z, 0)} g`); };
      const solucion = [
        ['Las pesas del otro platillo suman y las del platillo del arroz restan: otro − junto al arroz = ', v('Q', `${f(cantidad, 0)}`), '.'],
        ['Cifra por cifra, desde las unidades: con una cifra chica conviene sumar esas pesas; con una cifra grande (7, 8, 9) conviene poner 10 − cifra pesas junto al arroz y llevar 1 a la cifra siguiente. Se comparan las dos opciones contando lo que se lleva.'],
        [`Lo mejor: en el otro platillo ${lista(agrupa(R.otro)) || 'ninguna'}; junto al arroz ${lista(agrupa(R.junto)) || 'ninguna'}. Comprobación: ${f(R.otro.reduce((a, b) => a + b, 0), 0)} − ${f(R.junto.reduce((a, b) => a + b, 0), 0)} = ${f(cantidad, 0)}. Total: ${f(R.respuesta)} pesas.`],
      ];
      return cerrar(rng, semilla, { correcta: R.respuesta, errores, enunciado, pregunta, solucion, variables: vars, datos, unidad: 'pesas', singular: 'pesa' });
    }
    if (cantidad > 364) return null;
    const POT = [1, 3, 9, 27, 81, 243];
    const tern = []; for (let n = cantidad; n; n = Math.floor(n / 3)) tern.push(n % 3);
    const sumaCif = tern.reduce((a, b) => a + b, 0);
    const errores = [
      h('RMP39-un-platillo', sumaCif, `Escribiste ${cantidad} en base 3 y contaste sus cifras como pesas en un solo platillo; pero hay una sola pesa de cada valor, y una cifra 2 pediría repetir. Con los dos platillos, un 2 se cambia por «3 − 1».`),
      h('RMP39-solo-otro', R.otro.length, 'Contaste solo las pesas del otro platillo; las que van junto al objeto también se usan.'),
      h('RMP2-todas', POT.indexOf(Math.max(...R.otro, ...R.junto)) + 1, 'Pensaste que se usan todas las pesas hasta la mayor que hace falta, pero algunas quedan fuera de la balanza.'),
      h('RMP2-una-de-mas', R.respuesta + 1, 'Te sobró una pesa: cada pesa va en un platillo o queda fuera, y la forma es única.'),
    ];
    const enunciado = ['Se tiene una sola pesa de cada uno de estos valores: 1 g, 3 g, 9 g, 27 g, 81 g y 243 g. Se quiere pesar exactamente ', v('Q', `${cantidad} g`), ' de azúcar en una sola pesada; las pesas pueden ir en el otro platillo o en el mismo platillo que el azúcar.'];
    const pregunta = ['¿Cuántas pesas se usan en total en la balanza?'];
    const solucion = [
      ['Cada pesa va en el otro platillo (suma), junto al azúcar (resta) o fuera. Se escribe ', v('Q', `${cantidad}`), ' con cifras 1, 0 y −1 en base 3.'],
      [`Se divide entre 3 una y otra vez: resto 0 → la pesa queda fuera; resto 1 → va al otro platillo; resto 2 → va junto al azúcar (es 3 − 1) y se suma 1 al cociente.`],
      [`Otro platillo: ${lista(R.otro.map(z => `${z} g`))}. Junto al azúcar: ${R.junto.length ? lista(R.junto.map(z => `${z} g`)) : 'ninguna'}. Comprobación: ${R.otro.reduce((a, b) => a + b, 0)} − ${R.junto.reduce((a, b) => a + b, 0)} = ${cantidad}. Se usan ${f(R.respuesta)} pesas.`],
    ];
    return cerrar(rng, semilla, { correcta: R.respuesta, errores, enunciado, pregunta, solucion, variables: vars, datos, unidad: 'pesas', singular: 'pesa' });
  }

  // ---------- peso combinado (nuevo) ----------
  // Balanza 1: X + Y = Z + p1; balanza 2: Y + Z = X + p2 (al sumarlas, 2Y = p1 + p2); balanza 3, desequilibrada,
  // acota X. Con pesos enteros positivos las tres figuras quedan fijas. Se sortean pesos hasta que así sea.
  function tCombinado(rng, semilla) {
    for (let i = 0; i < 400; i++) { const p = tCombinadoUno(rng, semilla); if (p && p.alternativas.length >= 4) return p; }
    return null;
  }
  function tCombinadoUno(rng, semilla) {
    const [fx, fy, fz] = rng.barajar(['circulo', 'triangulo', 'cuadrado']);
    const wx = rng.entero(1, 7), wy = rng.entero(2, 9), wz = rng.entero(1, 9), W = { [fx]: wx, [fy]: wy, [fz]: wz };
    const p1 = wx + wy - wz, p2 = wz + wy - wx;
    if (p1 < 1 || p2 < 1 || wx === wz) return null;
    const dos = (a, b) => (rng.moneda() ? { izq: a, der: b } : { izq: b, der: a });
    const b1 = { ...dos({ [fx]: 1, [fy]: 1 }, { [fz]: 1, pesa: p1 }), estado: 'equilibrio' };
    const b2 = { ...dos({ [fz]: 1, [fy]: 1 }, { [fx]: 1, pesa: p2 }), estado: 'equilibrio' };
    // balanza 3: una pesa y algunas figuras en un lado, otras figuras (a veces repetidas) en el otro
    const combo = () => { const c = {}; for (const k of rng.barajar([fx, fy, fz]).slice(0, rng.entero(1, 2))) c[k] = rng.entero(1, 2); return c; };
    const L = combo(), R = combo();
    if (rng.moneda()) L.pesa = rng.entero(1, 12); else R.pesa = rng.entero(1, 12);
    const I = peso(L, W), D = peso(R, W);
    if (I === D) return null;
    const b3 = { izq: L, der: R, estado: I > D ? 'izq-baja' : 'der-baja' };
    const bs = [b1, b2, b3];
    const pide = {}; for (const k of rng.barajar([fx, fy, fz]).slice(0, 2)) pide[k] = rng.entero(1, 2);
    if (!pide[fx] && !pide[fz]) return null;
    const datos = { tipo: 'combinado', balanzas: bs, pide };
    const R3 = combinado({ ...datos, tope: 16 }), r = R3.respuesta;
    if (r === null || R3.soluciones.length !== 1) return null;
    if (combinado(datos).respuesta !== r) return null;
    const sin3 = combinado({ balanzas: [b1, b2], pide, tope: 16 });
    if (sin3.valores.length < 2) return null;        // la balanza 3 tiene que hacer falta
    // errores con nombre
    const valor = w => Object.entries(pide).reduce((t, [k, n]) => t + n * w[k], 0);
    const otras = sin3.soluciones.filter(w => !R3.soluciones.some(u => FIGS.every(k => u[k] === w[k]))).map(valor);
    const sinTercera = otras.find(z => z !== r);
    const igual = combinado({ balanzas: [b1, b2, { ...b3, estado: 'equilibrio' }], pide, tope: 16 });
    const ult = Object.keys(pide).pop();
    const nomPide = lista(Object.keys(pide).map(k => nf(k, pide[k])));
    const errores = [
      sinTercera !== undefined ? h('RMP98-sin-la-tercera', sinTercera, 'Resolviste solo con las dos balanzas en equilibrio y tomaste uno de los pesos que las cumplen. La tercera balanza, desequilibrada, descarta esos pesos: hay que usarla.') : null,
      igual.respuesta !== null && igual.respuesta !== r ? h('RMP99-borde', igual.respuesta, 'Tomaste la balanza desequilibrada como si estuviera en equilibrio. Al bajar un platillo ese lado pesa más: es una desigualdad estricta y el borde no se alcanza.') : null,
      h('RMP38-otra-combinacion', r - W[ult], `Ese es el peso de una combinación distinta: te faltó contar un ${NOMBRE[ult][0]} de los que se piden.`),
      h('RMP38-una-sola', Object.keys(pide).reduce((t, k) => t + W[k], 0), `Contaste cada figura una sola vez: la pregunta pide ${nomPide}.`),
      h('RMP38-suma-pesas', p1 + p2, 'Sumaste las dos pesas de las balanzas en equilibrio. Esos kilogramos no son el peso de lo que se pide: hay que hallar el peso de cada figura.'),
    ];
    const vars = varsFig([fx, fy, fz]);
    const enunciado = ['Cada figura pesa un número entero de kilogramos, y figuras iguales pesan lo mismo. Mira las balanzas:'];
    bs.forEach((b, i) => enunciado.push(` (${i + 1}) ${ESTADO[b.estado][0].toUpperCase() + ESTADO[b.estado].slice(1)}: a la izquierda, `, ...ladoV(b.izq, 'kg'), '; a la derecha, ', ...ladoV(b.der, 'kg'), '.'));
    const pregunta = ['¿Cuántos kilogramos pesan juntos ', ...Object.keys(pide).flatMap((k, i, a) => [v(k, nf(k, pide[k])), i < a.length - 2 ? ', ' : i === a.length - 2 ? ' y ' : '']), '?'];
    // la balanza 3 en términos de X: cada peso es αX + β (X = fx, Y = wy fijo por 2Y = p1 + p2, Z = X + Y − p1)
    const ab = { [fx]: [1, 0], [fy]: [0, wy], [fz]: [1, wy - p1] };
    const lin = lado => Object.entries(lado).reduce((t, [k, n]) => k === 'pesa' ? [t[0], t[1] + n] : [t[0] + n * ab[k][0], t[1] + n * ab[k][1]], [0, 0]);
    const lI = lin(L), lD = lin(R), A = lI[0] - lD[0], B = lI[1] - lD[1];
    const mayor = b3.estado === 'izq-baja' ? 1 : -1;   // (izq − der) debe ser > 0 si baja la izquierda
    const termX = (a, b) => `${a === 0 ? '' : (a === 1 ? 'X' : a === -1 ? '−X' : `${a}X`)}${a === 0 ? `${b}` : b === 0 ? '' : b > 0 ? ` + ${b}` : ` − ${-b}`}`;
    const nX = nf(fx, 1).split(' ')[1];
    const solucion = [
      [`Balanza 1: X + Y = Z + ${p1}. Balanza 2: Y + Z = X + ${p2}, con X = peso del ${nX}, Y = peso del ${NOMBRE[fy][0]} y Z = peso del ${NOMBRE[fz][0]}.`],
      [`Al sumarlas, X y Z se cancelan: 2Y = ${p1} + ${p2} = ${p1 + p2}, así que Y = ${wy} kg. De la balanza 1, Z = X + ${wy} − ${p1} = ${termX(1, wy - p1)}.`],
      [`Balanza 3: queda ${termX(A, B)} ${mayor > 0 ? '>' : '<'} 0 (${b3.estado === 'izq-baja' ? 'baja la izquierda' : 'baja la derecha'}). Con X entero y Z positivo, la única posibilidad es X = ${wx}, y entonces Z = ${wz}.`],
      [`Pesos: ${NOMBRE[fx][0]} ${wx} kg, ${NOMBRE[fy][0]} ${wy} kg, ${NOMBRE[fz][0]} ${wz} kg. Piden ${nomPide}: ${Object.keys(pide).map(k => `${pide[k]} × ${W[k]}`).join(' + ')} = ${f(r)} kg.`],
    ];
    return cerrar(rng, semilla, { correcta: r, errores, enunciado, pregunta, solucion, variables: vars, datos, unidad: 'kg',
      figura: { svg: figuraBalanzas(bs, 'kg'), alt: altBalanzas(bs, 'kg') } });
  }

  return { id: ID, titulo: 'Balanzas, figuras y pesas', generar, calc };
});
