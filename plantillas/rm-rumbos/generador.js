/*
 * Generador: rumbos con la brújula (razonamiento matemático, traslados y puntos cardinales).
 * Formato "predicciones" (docs/arquitectura.md). Funciona en el navegador
 * (window.Generadores['rm-rumbos']) y en Node (require). No usa ningún motor.
 *
 * Convención peruana de rumbos: «N 37° E» es 37° medidos desde el norte, girando hacia el este;
 * «S 53° O» es 53° desde el sur hacia el oeste. Los rumbos puros se escriben norte, este, sur y oeste
 * (los mismos nombres que la escena del guardia en plantillas/traslados-sucesos/). Triángulos notables de
 * academia: 37° y 53° con el 3-4-5, 45° con el √2, 30° y 60° con el 1-√3-2.
 *
 * Tipos y sus _datos:
 *   distancia  un móvil hace de 2 a 5 tramos; distancia final al punto de partida.
 *              { tipo, tramos: [{ rumbo, largo, largoTexto }], unidad }
 *   regreso    el mismo recorrido; rumbo para volver al inicio por el camino más corto (con la distancia
 *              o sin ella). { tipo, tramos, unidad, conDistancia }
 *   moviles    dos móviles salen a la vez del mismo punto; distancia entre ellos al cabo de t horas.
 *              { tipo, moviles: [{ rumbo, rapidez, rapidezTexto }], t }
 *   rapidez    lo mismo al revés: se da la separación final y la rapidez de uno; rapidez del otro.
 *              { tipo, rumbos: [r1, r2], v1, t, d2 (separación al cuadrado) }
 *   cuadrado   cuatro personas en las esquinas de una cancha cuadrada o rectangular (A, B, C, D en ese
 *              orden); se dan los rumbos de B y de D vistos desde A; rumbo de una a otra o desde el centro.
 *              { tipo, forma: 'cuadrado'|'rectangulo', AB, AD, rumboB, rumboD, desde, hacia }
 *   relativo   desde un punto P se dan dos lugares con su rumbo y distancia; rumbo de uno visto desde el
 *              otro, o la distancia entre ellos. { tipo, lugares: [{ rumbo, largo }], pide: 'rumbo'|'distancia' }
 *   (rumbo: texto como 'N 37° E' o 'norte'; largo: número, el de k√2 ya como decimal.)
 * La nota del rumbo dice qué triángulo notable usar (3-4-5, 1-1-√2, 1-√3-2). Se descartan los problemas cuyo
 * resultado cambia más de 2 % si 37° y 53° se toman como ángulos de verdad (desvioReal).
 *
 * Respuesta: distancias y rapideces como número (texto con P.radical); rumbos con P.armarTexto y clave
 * 'az:<grados desde el norte, en sentido horario>' (más '|d2:<distancia al cuadrado>' si va con la distancia).
 *
 * calc (funciones puras, sin azar):
 *   azimut(rumbo)              grados desde el norte en sentido horario ('S 53° O' → 233).
 *   rumboTexto(az)             lo inverso (233 → 'S 53° O'; 90 → 'este').
 *   recorrido(tramos)          tramos [{ rumbo, largo }] (largo número o texto 'k√2'): { este, norte, distancia,
 *                              distanciaTexto, rumbo (del fin visto desde el inicio, o null), regreso }.
 *   separacion(a, b, angulo)   distancia entre los extremos de dos tramos que salen del mismo punto.
 *   rumboEnCancha({ forma, AB, AD, rumboB, rumboD, desde, hacia })  rumbo de 'hacia' visto desde 'desde'.
 *
 * Errores (todos hipótesis; códigos propios RMP40 a RMP43 y AR5 de
 * docs/investigacion/aritmetica-razonamiento-ideas-erroneas.md):
 *   RMP40 medir o girar el ángulo desde el eje o hacia el lado equivocado (también: cambiar seno y coseno,
 *         el 3-4-5 al revés); RMP41 invertir el sentido (dar el rumbo desde el destino, o sumar posiciones
 *         en vez de restarlas); RMP42 sumar longitudes sin tener en cuenta la dirección (largos de los tramos,
 *         componentes sin restar las opuestas, en línea recta); RMP43 usar Pitágoras con un ángulo que no es
 *         recto; AR5 responder con un dato intermedio.
 */
(function (root, fabrica) {
  const nodo = typeof module === 'object' && module.exports;
  const api = fabrica(nodo ? require('../../nucleo/azar.js') : root.Azar,
                      nodo ? require('../../nucleo/predicciones.js') : root.Predicciones);
  if (nodo) module.exports = api;
  else (root.Generadores = root.Generadores || {})[api.id] = api;
})(typeof self !== 'undefined' ? self : this, function (Azar, P) {
  'use strict';
  const ID = 'rm-rumbos';
  const RM = 'docs/investigacion/aritmetica-razonamiento-ideas-erroneas.md';
  const h = (id, valor, explicacion, fuente = null) => ({ id, valor, explicacion, respaldo: 'hipotesis', fuente });
  const ht = (id, r, explicacion) => (r ? { id, clave: r.clave, texto: r.texto, explicacion, respaldo: 'hipotesis', fuente: null } : null);
  const v = P.v;
  const S3 = Math.sqrt(3), S2 = Math.SQRT2;

  // ---------- rumbos y ángulos ----------
  const CARD = { 0: 'norte', 90: 'este', 180: 'sur', 270: 'oeste' };
  const NOTABLES = [30, 37, 45, 53, 60];
  const norm = a => ((Math.round(a) % 360) + 360) % 360;
  function rumboTexto(az) {
    az = norm(az);
    if (CARD[az] !== undefined) return CARD[az];
    if (az < 90) return `N ${az}° E`;
    if (az < 180) return `S ${180 - az}° E`;
    if (az < 270) return `S ${az - 180}° O`;
    return `N ${360 - az}° O`;
  }
  function azimut(r) {
    const t = String(r).trim().toLowerCase();
    for (const [az, n] of Object.entries(CARD)) if (t === n) return Number(az);
    const m = /^([ns])\s*(\d+)°\s*([eo])$/.exec(t);
    if (!m) throw new Error(`rumbo no válido: ${r}`);
    const th = Number(m[2]);
    if (m[1] === 'n') return norm(m[3] === 'e' ? th : 360 - th);
    return norm(m[3] === 'e' ? 180 - th : 180 + th);
  }
  // Ángulo con el eje norte-sur (0 a 90) y signos: az → { th, sE, sN }.
  function partes(az) {
    az = norm(az);
    if (az <= 90) return { th: az, sE: 1, sN: 1 };
    if (az <= 180) return { th: 180 - az, sE: 1, sN: -1 };
    if (az <= 270) return { th: az - 180, sE: -1, sN: -1 };
    return { th: 360 - az, sE: -1, sN: 1 };
  }
  const desdePartes = (th, sE, sN) => norm(sN > 0 ? (sE > 0 ? th : 360 - th) : (sE > 0 ? 180 - th : 180 + th));
  // El mismo rumbo con el ángulo medido desde el otro eje (N 37° E → N 53° E).
  const otroEje = az => { const { th, sE, sN } = partes(az); return th === 0 || th === 90 ? null : desdePartes(90 - th, sE, sN); };
  const textoDir = az => { const t = rumboTexto(az); return CARD[norm(az)] !== undefined ? t[0].toUpperCase() + t.slice(1) : t; };
  const dir = az => ({ clave: `az:${norm(az)}`, texto: textoDir(az) });

  // ---------- números exactos a + b√3 (los tramos de 45° dan enteros) ----------
  // Un tramo de 37°/53° mide 5k; uno de 45°, k√2; uno de 30°/60°, 2k; uno puro, k.
  const val = ([a, b]) => a + b * S3;
  const puro = ([a, b]) => a === 0 || b === 0;
  const cuad = ([a, b]) => a * a + 3 * b * b;      // solo si es puro
  const mas = (x, y) => [x[0] + y[0], x[1] + y[1]];
  const por = (k, x) => [k * x[0], k * x[1]];
  const absP = x => (val(x) < 0 ? por(-1, x) : x);
  // Componentes [este, norte] de un tramo: { th, sE, sN, k }.
  function comp({ th, sE, sN, k }) {
    let e, n;
    if (th === 0) { e = [0, 0]; n = [k, 0]; }
    else if (th === 90) { e = [k, 0]; n = [0, 0]; }
    else if (th === 37) { e = [3 * k, 0]; n = [4 * k, 0]; }
    else if (th === 53) { e = [4 * k, 0]; n = [3 * k, 0]; }
    else if (th === 45) { e = [k, 0]; n = [k, 0]; }
    else if (th === 30) { e = [k, 0]; n = [0, k]; }
    else if (th === 60) { e = [0, k]; n = [k, 0]; }
    return { e: por(sE, e), n: por(sN, n) };
  }
  const largoDe = ({ th, k }) => (th === 37 || th === 53 ? 5 * k : th === 45 ? k * S2 : th === 30 || th === 60 ? 2 * k : k);
  const largoTxt = ({ th, k }) => (th === 37 || th === 53 ? `${5 * k}` : th === 45 ? `${k === 1 ? '' : k}√2` : th === 30 || th === 60 ? `${2 * k}` : `${k}`);
  // Rumbo de un vector exacto con componentes puras: solo si el ángulo es notable (o puro).
  function rumboDe(e, n) {
    if (!puro(e) || !puro(n)) return null;
    const E = cuad(e), N = cuad(n);
    if (E === 0 && N === 0) return null;
    const sE = val(e) >= 0 ? 1 : -1, sN = val(n) >= 0 ? 1 : -1;
    if (E === 0) return sN > 0 ? 0 : 180;
    if (N === 0) return sE > 0 ? 90 : 270;
    const tab = [[30, 1, 3], [37, 9, 16], [45, 1, 1], [53, 16, 9], [60, 3, 1]]; // E/N = p/q
    for (const [th, p, q] of tab) if (E * q === N * p) return desdePartes(th, sE, sN);
    return null;
  }
  // ¿Se escribe limpio como entero o a√m con m pequeño?
  function limpio(x) {
    if (!Number.isFinite(x) || x <= 1e-9 || x > 400) return false;
    const N = x * x, r = Math.round(N);
    if (Math.abs(N - r) > 1e-6 * Math.max(1, r)) return false;
    let m = r;
    for (let k = 2; k * k <= m; k++) while (m % (k * k) === 0) m /= k * k;
    return [1, 2, 3, 5].includes(m);
  }
  const rad = x => P.radical(x);
  const ctxt = x => { const [a, b] = absP(x); return b === 0 ? `${a}` : `${b === 1 ? '' : b}√3`; };
  const sq = x => (x[1] === 0 ? `${ctxt(x)}²` : `(${ctxt(x)})²`);

  // ---------- figuras ----------
  const W = 340, H = 230;
  function rosa(centro) {
    const cx = 170, cy = 112, R = 78;
    const t = (x, y, s, extra = '') => `<text x="${x}" y="${y}" font-size="16" text-anchor="middle" fill="currentColor"${extra}>${P.xml(s)}</text>`;
    const a = 20 * Math.PI / 180, ex = cx + R * Math.sin(a), ey = cy - R * Math.cos(a);
    const arco = `M ${cx} ${cy - 34} A 34 34 0 0 1 ${(cx + 34 * Math.sin(a)).toFixed(1)} ${(cy - 34 * Math.cos(a)).toFixed(1)}`;
    return `<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" font-family="inherit">`
      + `<circle cx="${cx}" cy="${cy}" r="${R}" fill="none" stroke="var(--line)" stroke-width="1.5"/>`
      + `<line x1="${cx}" y1="${cy - R}" x2="${cx}" y2="${cy + R}" stroke="currentColor" stroke-width="1.5"/>`
      + `<line x1="${cx - R}" y1="${cy}" x2="${cx + R}" y2="${cy}" stroke="currentColor" stroke-width="1.5"/>`
      + [45, 135, 225, 315].map(g => { const r = g * Math.PI / 180; return `<line x1="${(cx + (R - 10) * Math.sin(r)).toFixed(1)}" y1="${(cy - (R - 10) * Math.cos(r)).toFixed(1)}" x2="${(cx + R * Math.sin(r)).toFixed(1)}" y2="${(cy - R * Math.cos(r)).toFixed(1)}" stroke="var(--muted)" stroke-width="1.5"/>`; }).join('')
      + t(cx, cy - R - 8, 'N', ' font-weight="700"') + t(cx, cy + R + 20, 'S', ' font-weight="700"')
      + t(cx + R + 14, cy + 6, 'E', ' font-weight="700"') + t(cx - R - 14, cy + 6, 'O', ' font-weight="700"')
      + `<line x1="${cx}" y1="${cy}" x2="${ex.toFixed(1)}" y2="${ey.toFixed(1)}" stroke="var(--muted)" stroke-width="2" stroke-dasharray="5 4"/>`
      + `<path d="${arco}" fill="none" stroke="var(--muted)" stroke-width="1.5"/>`
      + `<text x="${(ex + 6).toFixed(1)}" y="${(ey + 2).toFixed(1)}" font-size="14" fill="var(--muted)">${P.xml('N 20° E')}</text>`
      + `<circle cx="${cx}" cy="${cy}" r="5" fill="currentColor"/>`
      + `<text x="${cx - 8}" y="${cy + 22}" font-size="14" text-anchor="end" fill="currentColor">${P.xml(centro)}</text>`
      + '</svg>';
  }
  const altRosa = centro => `Rosa de los vientos: el norte (N) arriba, el sur (S) abajo, el este (E) a la derecha y el oeste (O) a la izquierda. `
    + `Como ejemplo de la convención, una flecha punteada marca el rumbo N 20° E: 20° medidos desde el norte, girando hacia el este. En el centro está ${centro}.`;

  // Dibujo de puntos y segmentos ya calculados (x = este, y = norte), escalado para caber.
  function lamina(puntos, trazos, nota) {
    const xs = puntos.map(p => p.x), ys = puntos.map(p => p.y);
    const minX = Math.min(...xs), maxX = Math.max(...xs), minY = Math.min(...ys), maxY = Math.max(...ys);
    const esc = Math.min(260 / Math.max(1e-9, maxX - minX || 1), 160 / Math.max(1e-9, maxY - minY || 1), 40);
    const X = x => (40 + (x - minX) * esc + (260 - (maxX - minX) * esc) / 2).toFixed(1);
    const Y = y => (30 + (maxY - y) * esc + (160 - (maxY - minY) * esc) / 2).toFixed(1);
    let s = `<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" font-family="inherit">`;
    s += `<line x1="318" y1="44" x2="318" y2="14" stroke="currentColor" stroke-width="1.5"/><path d="M 313 22 L 318 12 L 323 22 Z" fill="currentColor"/><text x="318" y="60" font-size="14" text-anchor="middle" fill="currentColor">N</text>`;
    for (const tr of trazos) {
      const dash = tr.punteado ? ' stroke-dasharray="5 4"' : '';
      s += `<line x1="${X(tr.a.x)}" y1="${Y(tr.a.y)}" x2="${X(tr.b.x)}" y2="${Y(tr.b.y)}" stroke="${tr.color || 'currentColor'}" stroke-width="${tr.grueso ? 3 : 2}"${dash}/>`;
    }
    // Cada rótulo va hacia afuera, lejos del centro de la figura, para que no lo tapen las líneas.
    const cX = puntos.reduce((a, p) => a + Number(X(p.x)), 0) / puntos.length, cY = puntos.reduce((a, p) => a + Number(Y(p.y)), 0) / puntos.length;
    for (const p of puntos) {
      const px = Number(X(p.x)), py = Number(Y(p.y));
      s += `<circle cx="${px.toFixed(1)}" cy="${py.toFixed(1)}" r="4" fill="${p.color || 'currentColor'}"/>`;
      if (!p.rotulo) continue;
      let ux = px - cX, uy = py - cY;
      const n = Math.hypot(ux, uy);
      if (n < 8) {
        // En el centro: hacia el lado contrario de las líneas que salen del punto.
        ux = 0; uy = 0;
        for (const tr of trazos) for (const [p1, p2] of [[tr.a, tr.b], [tr.b, tr.a]]) {
          if (Math.abs(p1.x - p.x) < 1e-9 && Math.abs(p1.y - p.y) < 1e-9) { ux -= Number(X(p2.x)) - px; uy -= Number(Y(p2.y)) - py; }
        }
        const m = Math.hypot(ux, uy);
        if (m < 1e-9) { ux = 0.7; uy = -0.7; } else { ux /= m; uy /= m; }
      } else { ux /= n; uy /= n; }
      const tx = Math.min(W - 4, Math.max(4, px + 12 * ux)), ty = Math.min(H - 22, Math.max(14, py + 12 * uy + 5));
      const anc = ux > 0.35 ? 'start' : ux < -0.35 ? 'end' : 'middle';
      s += `<text x="${tx.toFixed(1)}" y="${ty.toFixed(1)}" font-size="14" text-anchor="${anc}" fill="currentColor">${P.xml(p.rotulo)}</text>`;
    }
    if (nota) s += `<text x="12" y="${H - 10}" font-size="14" fill="var(--muted)">${P.xml(nota)}</text>`;
    return s + '</svg>';
  }

  // ---------- datos de los tramos ----------
  function tramoAzar(rng, maxK) {
    const tipoT = rng.elegir(['puro', 'puro', 'puro', '37', '37', '37', '45', '30']);
    let th, k;
    if (tipoT === 'puro') { th = rng.elegir([0, 90]); k = rng.entero(2, 20); }
    else if (tipoT === '37') { th = rng.elegir([37, 53]); k = rng.entero(1, maxK); }
    else if (tipoT === '45') { th = 45; k = rng.entero(1, 6); }
    else { th = rng.elegir([30, 60]); k = rng.entero(1, 6); }
    const sE = rng.moneda() ? 1 : -1, sN = rng.moneda() ? 1 : -1;
    const t = { th, sE: th === 0 ? 1 : sE, sN: th === 90 ? 1 : sN, k };
    if (th === 0) t.sN = sN; if (th === 90) t.sE = sE;
    t.az = desdePartes(th, t.sE, t.sN);
    return t;
  }
  const datoTramo = t => ({ rumbo: rumboTexto(t.az), largo: largoDe(t), largoTexto: largoTxt(t) });
  function suma(tramos, f = t => t) {
    let e = [0, 0], n = [0, 0];
    for (const t of tramos) { const c = comp(f(t)); e = mas(e, c.e); n = mas(n, c.n); }
    return { e, n };
  }
  const intercambio = t => (t.th === 37 ? { ...t, th: 53 } : t.th === 53 ? { ...t, th: 37 } : t.th === 30 ? { ...t, th: 60 } : t.th === 60 ? { ...t, th: 30 } : t);
  const distExacta = ({ e, n }) => (puro(e) && puro(n) ? Math.sqrt(cuad(e) + cuad(n)) : NaN);
  const d2De = ({ e, n }) => cuad(e) + cuad(n);

  // Colores por tipo (regla 4: un color por variable, máximo 4). En los móviles, la rapidez y el tiempo
  // van con colores distintos y los recorridos quedan sin color; en «rapidez», el tiempo queda sin color.
  const variables = { L: { nombre: 'longitudes', color: 'o' }, r: { nombre: 'rumbos', color: 'i' }, x: { nombre: 'lo que se pide', color: 'd' } };
  const VAR_MOV = { t: { nombre: 'tiempo', color: 'o' }, r: { nombre: 'rumbos', color: 'i' }, v: { nombre: 'rapideces', color: 'h' }, x: { nombre: 'lo que se pide', color: 'd' } };
  const VAR_RAP = { L: { nombre: 'separación', color: 'o' }, r: { nombre: 'rumbos', color: 'i' }, v: { nombre: 'rapidez de A', color: 'h' }, x: { nombre: 'lo que se pide', color: 'd' } };
  // Nota del rumbo, con los triángulos notables que hacen falta (ths: ángulos con el eje que aparecen).
  function convencion(ths) {
    const l = [];
    if (ths.some(x => x === 37 || x === 53)) l.push(['3-4-5', 'para 37° y 53°']);
    if (ths.some(x => x === 45)) l.push(['1-1-√2', 'para 45°']);
    if (ths.some(x => x === 30 || x === 60)) l.push(['1-√3-2', 'para 30° y 60°']);
    const nota = !l.length ? '' : l.length === 1 ? ` Usa el triángulo notable ${l[0][0]} ${l[0][1]}.`
      : ` Usa los triángulos notables ${l.slice(0, -1).map(x => x.join(' ')).join(', ')} y ${l[l.length - 1].join(' ')}.`;
    return ` (Un rumbo como N 20° E se mide desde el norte, girando 20° hacia el este.${nota})`;
  }
  const SUJETOS = [
    { quien: 'Una lancha', sale: 'sale del muelle de Puno', lugar: 'el muelle', u: 'km' },
    { quien: 'Una avioneta', sale: 'despega del aeródromo', lugar: 'el aeródromo', u: 'km' },
    { quien: 'Un ciclista', sale: 'sale de la plaza de Juliaca', lugar: 'la plaza', u: 'km' },
    { quien: 'Una brigada de rescate', sale: 'sale de su campamento', lugar: 'el campamento', u: 'km' },
    { quien: 'Un dron', sale: 'despega del patio del colegio', lugar: 'el colegio', u: 'm' },
    { quien: 'Un pastor', sale: 'sale de su cabaña', lugar: 'la cabaña', u: 'km' },
  ];

  function enunTramos(tramos, u) {
    const seg = [];
    tramos.forEach((t, i) => {
      const r = rumboTexto(t.az);
      seg.push(i === 0 ? ' Recorre ' : i === tramos.length - 1 ? ' y, por último, ' : ', luego ');
      seg.push(v('L', `${largoTxt(t)} ${u}`));
      seg.push(t.th === 0 || t.th === 90 ? ' hacia el ' : ' con rumbo ');
      seg.push(v('r', r));
    });
    seg.push('.');
    return seg;
  }
  function pasosTramos(tramos, u) {
    const pasos = [['Descompón cada tramo en su parte este-oeste y su parte norte-sur. Con 37° y 53° usa el triángulo 3-4-5; con 45°, los dos catetos iguales (k√2 → k y k); con 30° y 60°, el triángulo 1-√3-2. El cateto que está junto al ángulo, sobre el eje norte-sur, es el de la parte norte-sur.']];
    tramos.forEach((t, i) => {
      const c = comp(t), r = rumboTexto(t.az);
      const partesT = [];
      if (val(c.e) !== 0) partesT.push(`${ctxt(c.e)} ${u} al ${val(c.e) > 0 ? 'este' : 'oeste'}`);
      if (val(c.n) !== 0) partesT.push(`${ctxt(c.n)} ${u} al ${val(c.n) > 0 ? 'norte' : 'sur'}`);
      pasos.push([`Tramo ${i + 1}: `, v('L', `${largoTxt(t)} ${u}`), ' al ', v('r', r), ` → ${partesT.join(' y ')}.`]);
    });
    return pasos;
  }
  const signo = (x, pos, neg, u) => (val(x) === 0 ? `0 ${u}` : `${ctxt(x)} ${u} al ${val(x) > 0 ? pos : neg}`);
  // Una posición (o un desplazamiento) con sus dos partes, sin nombrar la que es cero.
  const pos = (e, n, u) => { const l = []; if (val(e) !== 0) l.push(signo(e, 'este', 'oeste', u)); if (val(n) !== 0) l.push(signo(n, 'norte', 'sur', u)); return l.length ? l.join(' y ') : 'en el mismo punto'; };
  const sumaTxt = (lista, u) => lista.map((x, i) => { const s = val(x) < 0 ? '−' : '+'; return (i === 0 ? (s === '−' ? '−' : '') : ` ${s} `) + ctxt(x); }).join('') + ` ${u}`;

  function figuraRecorrido(tramos, u, extra) {
    const pts = [{ x: 0, y: 0, rotulo: 'inicio' }];
    let x = 0, y = 0;
    const trazos = [];
    tramos.forEach((t, i) => {
      const c = comp(t), nx = x + val(c.e), ny = y + val(c.n);
      trazos.push({ a: { x, y }, b: { x: nx, y: ny }, color: 'var(--c-o)' });
      x = nx; y = ny;
      pts.push({ x, y, rotulo: i === tramos.length - 1 ? 'fin' : String(i + 1) });
    });
    trazos.push({ a: { x: 0, y: 0 }, b: { x, y: 0 }, color: 'var(--muted)', punteado: true });
    trazos.push({ a: { x, y: 0 }, b: { x, y }, color: 'var(--muted)', punteado: true });
    trazos.push({ a: { x: 0, y: 0 }, b: { x, y }, color: 'var(--c-d)', grueso: true });
    pts[pts.length - 1].color = 'var(--c-d)';
    return lamina(pts, trazos, extra);
  }

  function generar(semilla) {
    const rng = Azar.crear(ID + '|' + semilla);
    // Las pruebas de entrada y salida usan formas paralelas: el mismo tipo en entrada-k y salida-k.
    const FIJO = { 1: 'distancia', 2: 'regreso', 3: 'cuadrado' };
    const m = /^(entrada|salida)-([123])$/.exec(String(semilla));
    const tipo = m ? FIJO[m[2]] : rng.elegir(['distancia', 'distancia', 'regreso', 'regreso', 'moviles', 'rapidez', 'cuadrado', 'cuadrado', 'relativo']);
    for (let intento = 0; intento < 4000; intento++) {
      const pr = construir(rng, semilla, tipo);
      if (pr && pr.alternativas.length >= 4 && desvioReal(pr._datos) <= 0.02) return pr;
    }
    throw new Error('No se pudo generar un problema con 4 alternativas distintas');
  }
  // Qué tanto cambia el resultado si 37° y 53° se toman como ángulos de verdad (y no con el 3-4-5):
  // diferencia relativa del vector resultado (o de la rapidez). Se descartan los problemas con más de 2 %.
  function desvioReal(d) {
    const pv = (r, L) => { const z = azimut(r) * Math.PI / 180; return [L * Math.sin(z), L * Math.cos(z)]; };
    const pa = (r, L) => vecRumbo(r, L);
    const dif = f => { const A = f(pa), R = f(pv), n = Math.hypot(A[0], A[1]); return n < 1e-9 ? 0 : Math.hypot(R[0] - A[0], R[1] - A[1]) / n; };
    if (d.tipo === 'distancia' || d.tipo === 'regreso') return dif(g => d.tramos.reduce((s, t) => { const [x, y] = g(t.rumbo, t.largo); return [s[0] + x, s[1] + y]; }, [0, 0]));
    if (d.tipo === 'moviles') return dif(g => { const [A, B] = d.moviles.map(m => g(m.rumbo, m.rapidez * d.t)); return [A[0] - B[0], A[1] - B[1]]; });
    if (d.tipo === 'relativo') return dif(g => { const [A, B] = d.lugares.map(l => g(l.rumbo, l.largo)); return [B[0] - A[0], B[1] - A[1]]; });
    if (d.tipo === 'rapidez') {
      const a = d.v1 * d.t, Dg = Math.abs(azimut(d.rumbos[0]) - azimut(d.rumbos[1])), D = Math.min(Dg, 360 - Dg);
      const bOf = c => a * c + Math.sqrt(a * a * c * c - a * a + d.d2);
      const ca = COS[D] ? COS[D][0] / COS[D][1] : Math.cos(D * Math.PI / 180);
      const A = bOf(ca), R = bOf(Math.cos(D * Math.PI / 180));
      return Math.abs(R - A) / A;
    }
    return 0;
  }
  function construir(rng, semilla, tipo) {
    if (tipo === 'distancia' || tipo === 'regreso') return recorridoP(rng, semilla, tipo);
    if (tipo === 'moviles') return moviles(rng, semilla);
    if (tipo === 'rapidez') return rapidez(rng, semilla);
    if (tipo === 'cuadrado') return cancha(rng, semilla);
    return relativo(rng, semilla);
  }
  // «de el» → «del» y «a el» → «al» en todos los textos armados con nombres de lugares.
  const contraer = t => String(t).replace(/\bde el\b/g, 'del').replace(/\ba el\b/g, 'al').replace(/\bDe el\b/g, 'Del');
  const contraerSeg = l => l.map(x => (typeof x === 'string' ? contraer(x) : { ...x, t: contraer(x.t) }));
  function cerrar(semilla, o) {
    o.enunciado = contraerSeg(o.enunciado); o.pregunta = contraerSeg(o.pregunta); o.solucion = o.solucion.map(contraerSeg);
    for (const f of [o.figura, o.figuraSolucion]) if (f) f.alt = contraer(f.alt);
    o.alternativas = o.alternativas.map(a => (a.error ? { ...a, error: { ...a.error, explicacion: contraer(a.error.explicacion) } } : a));
    return {
      id: `${ID}#${semilla}`, variables: o.variables || variables, enunciado: o.enunciado, pregunta: o.pregunta, datos: '',
      figura: o.figura, figuraSolucion: o.figuraSolucion,
      alternativas: o.alternativas, solucion: o.solucion, respuesta: { valor: o.valor, unidad: o.unidad || '' }, _datos: o.datos,
    };
  }
  const armarNum = (rng, correcta, errores, u) => P.armar({ correcta, errores: errores.filter(e => limpio(e.valor)), rng, texto: x => `${rad(x)} ${u}` });

  // ---------- distancia y regreso ----------
  function recorridoP(rng, semilla, tipo) {
    const m = rng.elegir([2, 2, 3, 3, 4, 5]);
    const tramos = [];
    for (let i = 0; i < m; i++) tramos.push(tramoAzar(rng, m > 3 ? 3 : 4));
    // Tramos seguidos con el mismo rumbo o que se deshacen no aportan.
    for (let i = 1; i < m; i++) if (tramos[i].az === tramos[i - 1].az || norm(tramos[i].az - tramos[i - 1].az) === 180) return null;
    if (!tramos.some(t => t.th !== 0 && t.th !== 90)) return null;
    const S = suma(tramos);
    const d = distExacta(S);
    if (!limpio(d)) return null;
    const suj = rng.elegir(SUJETOS), u = suj.u;
    const E = S.e, N = S.n;
    const azFin0 = rumboDe(E, N);
    const ths = tramos.map(t => t.th).concat(tipo === 'regreso' && azFin0 !== null ? [partes(azFin0).th] : []);
    const enunciado = [`${suj.quien} ${suj.sale}.`, ...enunTramos(tramos, u), convencion(ths)];
    const pasos = pasosTramos(tramos, u);
    pasos.push(['Suma con signo (este y norte positivos; oeste y sur, negativos): este-oeste ', `${sumaTxt(tramos.map(t => comp(t).e).filter(x => val(x) !== 0), u)} = ${signo(E, 'este', 'oeste', u)}; norte-sur `,
      `${sumaTxt(tramos.map(t => comp(t).n).filter(x => val(x) !== 0), u)} = ${signo(N, 'norte', 'sur', u)}.`]);
    const pasoD = val(E) === 0 || val(N) === 0 ? ['Solo queda una de las dos partes: la distancia es ', v('x', `${rad(d)} ${u}`), '.']
      : ['Las dos partes forman un ángulo recto: distancia = √(', `${sq(E)} + ${sq(N)}`, ') = ', v('x', `${rad(d)} ${u}`), '.'];
    const datosTr = tramos.map(datoTramo);
    const sumaL = tramos.reduce((s, t) => s + largoDe(t), 0);
    const sinRestar = { e: tramos.reduce((s, t) => mas(s, absP(comp(t).e)), [0, 0]), n: tramos.reduce((s, t) => mas(s, absP(comp(t).n)), [0, 0]) };
    const S345 = suma(tramos, intercambio);
    const hay345 = tramos.some(t => [30, 37, 53, 60].includes(t.th));
    const figura = { svg: rosa(suj.lugar), alt: altRosa(`el punto de partida (${suj.lugar})`) };
    const descTr = tramos.map((t, i) => `tramo ${i + 1}, ${largoTxt(t)} ${u} al ${rumboTexto(t.az)}`).join('; ');

    if (tipo === 'distancia') {
      const errores = [
        h('RMP42-suma-tramos', sumaL, `Sumaste los largos de los tramos. Esa es la distancia recorrida por el camino; la pregunta pide la distancia en línea recta entre el final y el inicio, que sale de sumar las partes este-oeste y norte-sur con su signo.`),
        h('RMP42-sin-restar-opuestas', distExacta(sinRestar), 'Sumaste todas las partes como si fueran del mismo lado. Lo que se avanza al sur se resta de lo que se avanza al norte, y lo del oeste se resta de lo del este.'),
        h('RMP42-suma-componentes', puro(E) && puro(N) && E[1] === 0 && N[1] === 0 ? Math.abs(val(E)) + Math.abs(val(N)) : NaN, `Sumaste la parte este-oeste y la parte norte-sur. Son los catetos de un triángulo rectángulo: la distancia es la hipotenusa, √(${sq(E)} + ${sq(N)}).`),
      ];
      if (hay345) errores.push(h('RMP40-345-al-reves', distExacta(S345), 'Cambiaste el seno y el coseno: pusiste sobre el eje norte-sur el cateto opuesto al ángulo. El ángulo de un rumbo se mide desde el norte o el sur, así que el cateto junto al ángulo es la parte norte-sur (en N 37° E con 5 km: 4 km al norte y 3 km al este).'));
      const alternativas = armarNum(rng, d, errores, u);
      return cerrar(semilla, {
        enunciado, pregunta: [`¿A qué distancia del punto de partida termina?`], figura,
        figuraSolucion: { svg: figuraRecorrido(tramos, u), alt: `Recorrido dibujado: ${descTr}. Las partes netas son ${pos(E, N, u)} (punteadas); la línea gruesa une el inicio con el fin y mide ${rad(d)} ${u}.` },
        alternativas, solucion: [...pasos, pasoD], valor: d, unidad: u,
        datos: { tipo, tramos: datosTr, unidad: u },
      });
    }
    // regreso: el rumbo de −(E, N)
    const azFin = rumboDe(E, N);
    if (azFin === null) return null;
    const azR = norm(azFin + 180);
    const conDistancia = rng.moneda();
    const mk = (az, dd) => (az === null || az === undefined || !Number.isFinite(dd) ? null
      : conDistancia ? { clave: `az:${norm(az)}|d2:${Math.round(dd * dd)}`, texto: `${rad(dd)} ${u} al ${rumboTexto(az)}` } : dir(az));
    const correcta = mk(azR, d);
    const eje = otroEje(azR);
    const az345 = rumboDe(S345.e, S345.n), azSin = rumboDe(sinRestar.e, sinRestar.n);
    const errores = [
      ht('RMP41-desde-el-inicio', mk(azFin, d), `Ese es el rumbo en que quedó el final visto desde el inicio. Para regresar hay que ir al revés: el rumbo opuesto, ${rumboTexto(azR)}.`),
      eje === null ? null : ht('RMP40-eje', mk(eje, d), `Mediste el ángulo desde el eje equivocado. El rumbo se mide desde el norte o el sur: con ${ctxt(absP(E))} ${u} al ${val(E) > 0 ? 'oeste' : 'este'} y ${ctxt(absP(N))} ${u} al ${val(N) > 0 ? 'sur' : 'norte'} de regreso, el ángulo con el eje norte-sur es ${partes(azR).th}°.`),
      eje === null ? null : ht('RMP41-RMP40-al-reves-y-eje', mk(otroEje(azFin), d), 'Diste el rumbo del final visto desde el inicio y, además, mediste el ángulo desde el eje este-oeste. Para volver se va al revés, y el ángulo se mide desde el norte o el sur.'),
      hay345 && az345 !== null ? ht('RMP40-345-al-reves', mk(norm(az345 + 180), distExacta(S345)), 'Cambiaste el seno y el coseno en algún tramo: el cateto junto al ángulo del rumbo es la parte norte-sur, no la este-oeste.') : null,
      azSin !== null ? ht('RMP42-sin-restar-opuestas', mk(norm(azSin + 180), distExacta(sinRestar)), 'Sumaste todas las partes como si fueran del mismo lado. Lo que se avanza al sur se resta de lo del norte, y lo del oeste, de lo del este.') : null,
    ];
    if (conDistancia) {
      errores.push(limpio(sumaL) ? ht('RMP42-suma-tramos', mk(azR, sumaL), 'El rumbo está bien, pero sumaste los largos de los tramos. El camino más corto de regreso es la línea recta, más corta que todo lo recorrido.') : null);
    }
    const alternativas = P.armarTexto({ correcta, errores: errores.filter(Boolean), rng });
    const pasoR = ['Para volver hay que deshacer lo neto: ir ', `${ctxt(absP(E))} ${u} al ${val(E) > 0 ? 'oeste' : 'este'}`.replace(/^0 .*/, ''), val(N) !== 0 && val(E) !== 0 ? ' y ' : '',
      val(N) !== 0 ? `${ctxt(absP(N))} ${u} al ${val(N) > 0 ? 'sur' : 'norte'}` : '',
      partes(azR).th % 90 === 0 ? '.' : `. El ángulo con el eje norte-sur sale del triángulo notable de esos catetos: ${partes(azR).th}°.`];
    return cerrar(semilla, {
      enunciado, pregunta: [conDistancia ? '¿Qué distancia y qué rumbo debe seguir para regresar al punto de partida por el camino más corto?' : '¿Qué rumbo debe seguir para regresar al punto de partida por el camino más corto?'],
      figura,
      figuraSolucion: { svg: figuraRecorrido(tramos, u), alt: `Recorrido dibujado: ${descTr}. Las partes netas son ${pos(E, N, u)} (punteadas); la línea gruesa une el inicio con el fin. Para volver se recorre esa línea del fin al inicio: ${rad(d)} ${u} al ${rumboTexto(azR)}.` },
      alternativas, solucion: [...pasos, ...(conDistancia ? [pasoD] : []), pasoR, ['Rumbo de regreso: ', v('x', conDistancia ? correcta.texto : rumboTexto(azR)), '.']],
      valor: correcta.clave, datos: { tipo, tramos: datosTr, unidad: u, conDistancia },
    });
  }

  // ---------- dos móviles ----------
  function movilAzar(rng, t) {
    const tipoT = rng.elegir(['puro', '37', '37', '45', '30']);
    let th, vel, vtxt, k;
    if (tipoT === 'puro') { th = rng.elegir([0, 90]); vel = rng.entero(3, 30); k = vel * t; vtxt = `${vel}`; }
    else if (tipoT === '37') { th = rng.elegir([37, 53]); vel = 5 * rng.entero(1, 6); k = vel * t / 5; vtxt = `${vel}`; }
    else if (tipoT === '45') { th = 45; const q = rng.entero(1, 8); vel = q * S2; k = q * t; vtxt = `${q === 1 ? '' : q}√2`; }
    else { th = rng.elegir([30, 60]); vel = 2 * rng.entero(2, 12); k = vel * t / 2; vtxt = `${vel}`; }
    const sE = rng.moneda() ? 1 : -1, sN = rng.moneda() ? 1 : -1;
    const az = desdePartes(th, sE, sN);
    const pt = partes(az);
    return { th: pt.th, sE: pt.sE, sN: pt.sN, k, az, vel, vtxt };
  }
  const QUIENES = [
    { par: 'Dos lanchas', sale: 'salen a la vez del muelle de Puno', lugar: 'el muelle' },
    { par: 'Dos ciclistas', sale: 'salen a la vez de la plaza de Ayaviri', lugar: 'la plaza' },
    { par: 'Dos camiones', sale: 'salen a la vez del mercado mayorista', lugar: 'el mercado' },
  ];
  function moviles(rng, semilla) {
    const t = rng.elegir([2, 3, 4]);
    const a = movilAzar(rng, t), b = movilAzar(rng, t);
    const ang = Math.min(norm(a.az - b.az), 360 - norm(a.az - b.az));
    if (ang === 0 || ang === 180 || ang < 30) return null;
    const ca = comp(a), cb = comp(b);
    const D = { e: mas(ca.e, por(-1, cb.e)), n: mas(ca.n, por(-1, cb.n)) };
    const d = distExacta(D);
    if (!limpio(d)) return null;
    const La = largoDe(a), Lb = largoDe(b);
    const qq = rng.elegir(QUIENES);
    const enunciado = [`${qq.par}, A y B, ${qq.sale}. A va con rumbo `, v('r', rumboTexto(a.az)), ' a ', v('v', `${a.vtxt} km/h`), ' y B con rumbo ', v('r', rumboTexto(b.az)), ' a ', v('v', `${b.vtxt} km/h`), ', los dos en línea recta.', convencion([a.th, b.th])];
    const pregunta = ['¿Qué distancia los separa al cabo de ', v('t', `${t} horas`), '?'];
    const D345 = (() => { const x = comp(intercambio(a)), y = comp(intercambio(b)); return { e: mas(x.e, por(-1, y.e)), n: mas(x.n, por(-1, y.n)) }; })();
    const errores = [
      h('RMP42-suma-recorridos', La + Lb, 'Sumaste lo que recorrió cada uno, como si se alejaran en sentidos opuestos sobre una misma recta. Los rumbos no son opuestos: hay que componer las posiciones.'),
      h('RMP42-resta-recorridos', Math.abs(La - Lb), 'Restaste los recorridos, como si fueran en la misma dirección. Sus rumbos son distintos: la separación sale de restar las posiciones por partes este-oeste y norte-sur.'),
      ang !== 90 ? h('RMP43-angulo-recto', Math.sqrt(La * La + Lb * Lb), `Usaste Pitágoras con los dos recorridos, pero entre sus rumbos hay ${ang}°, no 90°.`) : null,
      (a.th % 90 !== 0 || b.th % 90 !== 0) && [30, 37, 53, 60].some(x => x === a.th || x === b.th) ? h('RMP40-345-al-reves', distExacta(D345), 'Cambiaste el seno y el coseno: el cateto junto al ángulo del rumbo va sobre el eje norte-sur.') : null,
      h('AR5-dato-intermedio', d / t, `Esa es la separación al cabo de una hora. Al cabo de ${t} horas cada uno recorrió ${t} veces más.`, RM),
    ].filter(Boolean);
    const alternativas = armarNum(rng, d, errores, 'km');
    const pasos = [
      ['Lo que recorre cada uno en ', v('t', `${t} h`), ': A, ', v('v', a.vtxt), ' · ', v('t', `${t}`), ` = ${largoTxt(a)} km; B, `, v('v', b.vtxt), ' · ', v('t', `${t}`), ` = ${largoTxt(b)} km.`],
      ['A queda a ', `${pos(ca.e, ca.n, 'km')}`, ' del punto de partida; B, a ', `${pos(cb.e, cb.n, 'km')}.`],
      ['Diferencia de posiciones: ', `${pos(D.e, D.n, 'km')}`, ' (de B hacia A).'],
      ['Separación: √(', `${sq(D.e)} + ${sq(D.n)}`, ') = ', v('x', `${rad(d)} km`), '.'],
    ];
    const pa = { x: val(ca.e), y: val(ca.n) }, pb = { x: val(cb.e), y: val(cb.n) };
    return cerrar(semilla, {
      enunciado, pregunta, figura: { svg: rosa(qq.lugar), alt: altRosa(`el punto de salida (${qq.lugar})`) },
      figuraSolucion: { svg: lamina([{ x: 0, y: 0, rotulo: 'salida' }, { ...pa, rotulo: 'A' }, { ...pb, rotulo: 'B' }], [{ a: { x: 0, y: 0 }, b: pa, color: 'var(--c-o)' }, { a: { x: 0, y: 0 }, b: pb, color: 'var(--c-o)' }, { a: pa, b: pb, color: 'var(--c-d)', grueso: true }]),
        alt: `Desde la salida, A recorre ${largoTxt(a)} km al ${rumboTexto(a.az)} y B recorre ${largoTxt(b)} km al ${rumboTexto(b.az)}; entre sus rumbos hay ${ang}°. La línea gruesa une A con B y mide ${rad(d)} km.` },
      alternativas, solucion: pasos, valor: d, unidad: 'km', variables: VAR_MOV,
      datos: { tipo: 'moviles', moviles: [a, b].map(m => ({ rumbo: rumboTexto(m.az), rapidez: m.vel, rapidezTexto: m.vtxt })), t },
    });
  }

  // ---------- rapidez a partir de la separación ----------
  const COS = { 90: [0, 1], 120: [-1, 2], 127: [-3, 5], 143: [-4, 5] };
  const AZN = (() => { const l = [0, 90, 180, 270]; for (const th of NOTABLES) for (const sE of [1, -1]) for (const sN of [1, -1]) l.push(desdePartes(th, sE, sN)); return [...new Set(l)].sort((x, y) => x - y); })();
  const PARES = (() => {
    const l = [];
    for (const D of [90, 120, 127, 143]) {
      const [p, q] = COS[D];
      for (let v1 = 4; v1 <= 40; v1++) for (let v2 = 4; v2 <= 40; v2++) {
        if (v1 === v2) continue;
        const Q = v1 * v1 + v2 * v2 - 2 * v1 * v2 * p / q;
        if (Math.abs(Q - Math.round(Q)) > 1e-9) continue;
        if (!limpio(Math.sqrt(Q))) continue;
        const s = Math.round(Math.sqrt(Q));
        if (s * s !== Math.round(Q) && D === 90) continue; // con 90°, solo ternas pitagóricas
        l.push({ D, v1, v2, Q: Math.round(Q) });
      }
    }
    return l;
  })();
  // Ley de cosenos despejada: b² + (2|p|a/q)·b + (a² − d²) = 0, factorizada con la raíz b y la negativa.
  function despeje(D, p, q, a, b, d, d2) {
    const c = 2 * -p * a, K = a * a - d2;            // q·b² + c·b + q·K = 0
    const cosT = `cos ${D}° = −${-p}/${q}`;
    const ini = ['Ley de cosenos (', cosT, '): ', v('L', `(${rad(d)})²`), ` = ${a}² + b² − 2·${a}·b·(−${-p}/${q}) = ${a * a} + b² + ${c % q === 0 ? `${c / q}b` : `${c}b/${q}`}`];
    const sgK = K < 0 ? `− ${-K}` : `+ ${K}`;
    if (c % q === 0) {
      const R = c / q + b;                             // la otra raíz es −R
      return [...ini, ` → b² + ${c / q}b ${sgK} = 0 → (b − ${b})(b + ${R}) = 0 → b = ${b} km (la otra raíz es negativa).`];
    }
    const qR = c + q * b;
    return [...ini, `. Por ${q}: ${q}b² + ${c}b ${q * K < 0 ? `− ${-q * K}` : `+ ${q * K}`} = 0 → (b − ${b})(${q}b + ${qR}) = 0 → b = ${b} km (la otra raíz es negativa).`];
  }
  function rapidez(rng, semilla) {
    const pr = rng.elegir(PARES);
    const t = rng.elegir([2, 3, 4, 5]);
    const az1 = rng.elegir(AZN);
    const cands = AZN.filter(z => Math.min(norm(z - az1), 360 - norm(z - az1)) === pr.D);
    if (!cands.length) return null;
    const az2 = rng.elegir(cands);
    const a = pr.v1 * t, b = pr.v2 * t, d2 = pr.Q * t * t, d = Math.sqrt(d2);
    const qq = rng.elegir(QUIENES);
    const enunciado = [`${qq.par}, A y B, ${qq.sale}. A va con rumbo `, v('r', rumboTexto(az1)), ' a ', v('v', `${pr.v1} km/h`), ' y B con rumbo ', v('r', rumboTexto(az2)), `, los dos en línea recta y con rapidez constante. Al cabo de ${t} horas están a `, v('L', `${rad(d)} km`), ' uno del otro.',
      convencion([partes(az1).th, partes(az2).th, ...(pr.D === 127 || pr.D === 143 ? [37] : pr.D === 120 ? [60] : [])])];
    const errores = [
      pr.D !== 90 && d > a ? h('RMP43-angulo-recto', Math.sqrt(d2 - a * a) / t, `Usaste Pitágoras, pero entre los rumbos hay ${pr.D}°, no 90°. Con ese ángulo va la ley de cosenos (o las componentes).`) : null,
      d > a ? h('RMP42-en-linea', (d - a) / t, 'Restaste el recorrido de A de la separación, como si se alejaran en sentidos opuestos sobre una recta. Sus rumbos forman otro ángulo.') : null,
      h('AR5-dato-intermedio', b, `Ese es lo que recorrió B en ${t} horas, no su rapidez: falta dividir entre el tiempo.`, RM),
      h('AR5-rapidez-de-separacion', d / t, 'Dividiste la separación entre el tiempo: eso da lo que se alejan uno del otro cada hora, no la rapidez de B.', RM),
      h('RMP42-suma-rapideces', (d + a) / t, 'Sumaste el recorrido de A a la separación, como si los dos fueran en la misma dirección y B le sacara ventaja. Sus rumbos forman un ángulo: el recorrido de B sale del triángulo con ese ángulo.'),
    ].filter(Boolean);
    const alternativas = armarNum(rng, pr.v2, errores, 'km/h');
    const [p, q] = COS[pr.D];
    const pasos = [
      ['Entre los rumbos ', v('r', rumboTexto(az1)), ' y ', v('r', rumboTexto(az2)), ` hay ${pr.D}°.`],
      ['A recorre ', v('v', `${pr.v1}`), ` · ${t} = ${a} km. Si B recorre b km, la separación es el tercer lado del triángulo con esos dos lados y ${pr.D}° entre ellos.`],
      pr.D === 90 ? ['Pitágoras: ', v('L', `(${rad(d)})²`), ` = ${a}² + b², así que b² = ${d2} − ${a * a} = ${b * b} y b = ${b} km.`]
        : despeje(pr.D, p, q, a, b, d, d2),
      ['Rapidez de B: ', `${b} ÷ ${t} = `, v('x', `${pr.v2} km/h`), '.'],
    ];
    const ua = { x: Math.sin(az1 * Math.PI / 180) * a, y: Math.cos(az1 * Math.PI / 180) * a };
    const ub = { x: Math.sin(az2 * Math.PI / 180) * b, y: Math.cos(az2 * Math.PI / 180) * b };
    return cerrar(semilla, {
      enunciado, pregunta: ['¿Cuál es la rapidez de B?'], figura: { svg: rosa(qq.lugar), alt: altRosa(`el punto de salida (${qq.lugar})`) },
      figuraSolucion: { svg: lamina([{ x: 0, y: 0, rotulo: 'salida' }, { ...ua, rotulo: 'A' }, { ...ub, rotulo: 'B' }], [{ a: { x: 0, y: 0 }, b: ua, color: 'var(--c-o)' }, { a: { x: 0, y: 0 }, b: ub, color: 'var(--c-o)' }, { a: ua, b: ub, color: 'var(--c-d)', grueso: true }]),
        alt: `Desde la salida, A recorre ${a} km al ${rumboTexto(az1)} y B recorre ${b} km al ${rumboTexto(az2)}; entre los dos rumbos hay ${pr.D}°. La línea gruesa une A con B y mide ${rad(d)} km.` },
      alternativas, solucion: pasos, valor: pr.v2, unidad: 'km/h', variables: VAR_RAP,
      datos: { tipo: 'rapidez', rumbos: [rumboTexto(az1), rumboTexto(az2)], v1: pr.v1, t, d2 },
    });
  }

  // ---------- cuatro personas en las esquinas de una cancha ----------
  const PERSONAS = { A: 'Ana', B: 'Beto', C: 'Carla', D: 'Diego', O: 'el poste' };
  const COORD = (p, q) => ({ A: [0, 0], B: [p, 0], C: [p, q], D: [0, q], O: [p / 2, q / 2] });
  // Ángulo de (x, y) medido desde AB hacia AD (en el marco de la cancha), con 3-4-5 exacto.
  function anguloMarco(x, y) {
    const X = Math.abs(x), Y = Math.abs(y);
    let base;
    if (Y < 1e-9) base = 0; else if (X < 1e-9) base = 90;
    else { const r = Y / X; base = Math.abs(r - 1) < 1e-9 ? 45 : Math.abs(r - 3 / 4) < 1e-9 ? 37 : Math.abs(r - 4 / 3) < 1e-9 ? 53 : null; }
    if (base === null) return null;
    if (x >= -1e-9 && y >= -1e-9) return base;
    if (x < 0 && y >= -1e-9) return 180 - base;
    if (x < 0 && y < 0) return 180 + base;
    return 360 - base;
  }
  function rumboEnCancha({ forma, AB, AD, rumboB, rumboD, desde, hacia }) {
    const phi = azimut(rumboB), psi = azimut(rumboD);
    const s = norm(psi - phi) === 90 ? 1 : norm(phi - psi) === 90 ? -1 : 0;
    if (!s) throw new Error('B y D deben estar a 90° vistos desde A');
    const c = COORD(AB, forma === 'cuadrado' ? AB : AD);
    const al = anguloMarco(c[hacia][0] - c[desde][0], c[hacia][1] - c[desde][1]);
    return al === null ? null : rumboTexto(phi + s * al);
  }
  const PARES_C = [['A', 'C'], ['C', 'A'], ['B', 'D'], ['D', 'B'], ['O', 'A'], ['O', 'B'], ['O', 'C'], ['O', 'D'], ['A', 'O'], ['B', 'O'], ['C', 'O'], ['D', 'O']];
  function cancha(rng, semilla) {
    const forma = rng.elegir(['cuadrado', 'cuadrado', 'rectangulo']);
    const u = rng.elegir([10, 20]);
    const [AB, AD] = forma === 'cuadrado' ? [3 * u, 3 * u] : rng.elegir([[4 * u, 3 * u], [3 * u, 4 * u]]);
    const [desde, hacia] = rng.elegir(PARES_C);
    const s = rng.moneda() ? 1 : -1;
    const c = COORD(AB, AD);
    const dx = c[hacia][0] - c[desde][0], dy = c[hacia][1] - c[desde][1];
    const al = anguloMarco(dx, dy);
    const azAns = rng.elegir(AZN.filter(z => partes(z).th % 90 !== 0));
    const phi = norm(azAns - s * al), psi = norm(phi + s * 90);
    if (partes(phi).th % 90 === 0 || partes(psi).th % 90 === 0) return null;
    if (NOTABLES.includes(partes(phi).th) && rng.moneda()) return null; // casi siempre, datos que no son notables
    const eje = otroEje(azAns);
    const nom = x => PERSONAS[x];
    const lugar = forma === 'cuadrado' ? `una cancha cuadrada de ${AB} m de lado` : `una cancha rectangular, con ${AB} m de ${nom('A')} a ${nom('B')} y ${AD} m de ${nom('A')} a ${nom('D')}`;
    const enunciado = [`${nom('A')}, ${nom('B')}, ${nom('C')} y ${nom('D')} están parados en las esquinas de ${lugar}, en ese orden (${nom('A')} y ${nom('C')} están en esquinas opuestas). Vistos desde ${nom('A')}, ${nom('B')} está al `,
      v('r', rumboTexto(phi)), ` y ${nom('D')} está al `, v('r', rumboTexto(psi)), '.', ...(desde === 'O' || hacia === 'O' ? [' En el centro de la cancha hay un poste.'] : []), convencion([forma === 'cuadrado' ? 45 : 37])];
    const pregunta = [`¿Qué rumbo debe seguir ${desde === 'O' ? 'alguien que está junto al poste' : nom(desde)} para ir en línea recta hacia ${hacia === 'O' ? 'el poste' : nom(hacia)}?`];
    const intercambiado = forma === 'rectangulo' ? anguloMarco(dx * AD / AB, dy * AB / AD) : null;
    const errores = [
      ht('RMP41-al-reves', dir(azAns + 180), `Diste el rumbo para ir de ${hacia === 'O' ? 'el poste' : nom(hacia)} hacia ${desde === 'O' ? 'el poste' : nom(desde)}: el sentido contrario.`),
      eje === null ? null : ht('RMP40-eje', dir(eje), `Mediste el ángulo desde el eje este-oeste. En la notación de rumbos, el ángulo se mide desde el norte o el sur: el correcto mide ${partes(azAns).th}° desde el ${partes(azAns).sN > 0 ? 'norte' : 'sur'}.`),
      ht('RMP40-lado-contrario', dir(phi - s * al), `Giraste los ${al > 180 ? 360 - al : al}° hacia el lado equivocado. Vistos desde ${nom('A')}, para pasar de ${nom('B')} a ${nom('D')} se gira ${s > 0 ? 'en sentido horario' : 'en sentido antihorario'}; eso decide hacia dónde se abre la cancha.`),
      intercambiado !== null && intercambiado !== al ? ht('RMP40-345-al-reves', dir(phi + s * intercambiado), 'Usaste el 3-4-5 al revés: el ángulo de la diagonal con el lado mayor es 37°, y con el lado menor, 53°.') : null,
      ht('AR5-dato-intermedio', dir(phi), `Ese es el rumbo de ${nom('B')} visto desde ${nom('A')}, un dato del problema, no el que se pide.`),
    ].filter(Boolean);
    const alternativas = P.armarTexto({ correcta: dir(azAns), errores, rng });
    const alR = al > 180 ? 360 - al : al;
    const pasos = [
      [`Desde ${nom('A')}, ${nom('B')} está al `, v('r', rumboTexto(phi)), ` y ${nom('D')} al `, v('r', rumboTexto(psi)), `: para pasar de la dirección de ${nom('B')} a la de ${nom('D')} se gira 90° ${s > 0 ? 'en sentido horario' : 'en sentido antihorario'}.`],
      [`Dentro de la cancha, el segmento de ${desde === 'O' ? 'el poste' : nom(desde)} a ${hacia === 'O' ? 'el poste' : nom(hacia)} avanza ${f2(Math.abs(dx))} m en la dirección de ${nom('A')} a ${nom('B')} ${dx < 0 ? '(hacia atrás)' : ''} y ${f2(Math.abs(dy))} m en la de ${nom('A')} a ${nom('D')} ${dy < 0 ? '(hacia atrás)' : ''}.`.replace(/ {2,}/g, ' ').replace(/ \./, '.'),
        forma === 'cuadrado' ? ' En un cuadrado, la diagonal forma 45° con los lados.' : ' Con lados 4 y 3 (triángulo 3-4-5), la diagonal forma 37° con el lado mayor y 53° con el menor.'],
      [`Así, su dirección está girada ${alR}° desde la de ${nom('A')} a ${nom('B')}${alR > 90 ? ` (180° − ${180 - alR}°, porque se sale de ${desde === 'O' ? 'el poste' : nom(desde)} hacia atrás por el lado de ${nom('A')} a ${nom('B')})` : ''}`, al === alR ? `, hacia el lado de ${nom('D')}` : `, hacia el lado contrario a ${nom('D')}`, `: ${rumboTexto(phi)} girado ${alR}° → `, v('x', rumboTexto(azAns)), '.'],
    ];
    const az2v = (az, L) => ({ x: Math.sin(az * Math.PI / 180) * L, y: Math.cos(az * Math.PI / 180) * L });
    const pB = az2v(phi, AB), pD = az2v(psi, AD), pC = { x: pB.x + pD.x, y: pB.y + pD.y }, pO = { x: pC.x / 2, y: pC.y / 2 };
    const pts = { A: { x: 0, y: 0 }, B: pB, C: pC, D: pD, O: pO };
    const lista = ['A', 'B', 'C', 'D'].map(k => ({ ...pts[k], rotulo: k }));
    if (desde === 'O' || hacia === 'O') lista.push({ ...pO, rotulo: 'poste' });
    const tr = [['A', 'B'], ['B', 'C'], ['C', 'D'], ['D', 'A']].map(([x, y]) => ({ a: pts[x], b: pts[y], color: 'currentColor' }));
    tr.push({ a: pts[desde], b: pts[hacia], color: 'var(--c-d)', grueso: true });
    return cerrar(semilla, {
      enunciado, pregunta, figura: { svg: rosa('Ana'), alt: altRosa('Ana, en la esquina A') },
      figuraSolucion: { svg: lamina(lista, tr), alt: `La cancha dibujada con el norte arriba: A (Ana), B (Beto) al ${rumboTexto(phi)} de A, D (Diego) al ${rumboTexto(psi)} de A y C (Carla) en la esquina opuesta a A${desde === 'O' || hacia === 'O' ? ', con el poste en el centro' : ''}. La línea gruesa va de ${desde === 'O' ? 'el poste' : desde} a ${hacia === 'O' ? 'el poste' : hacia}, con rumbo ${rumboTexto(azAns)}.` },
      alternativas, solucion: pasos, valor: dir(azAns).clave,
      datos: { tipo: 'cuadrado', forma, AB, AD, rumboB: rumboTexto(phi), rumboD: rumboTexto(psi), desde, hacia },
    });
  }
  const f2 = x => P.formatear(x, 2);

  // ---------- dos lugares vistos desde un punto ----------
  const LUGARES = [
    { P: 'el puerto', a: 'el faro', b: 'la isla' },
    { P: 'la plaza del pueblo', a: 'la posta', b: 'el colegio' },
    { P: 'el campamento', a: 'el mirador', b: 'la laguna' },
    { P: 'la estación', a: 'el molino', b: 'la granja' },
  ];
  function relativo(rng, semilla) {
    const a = tramoAzar(rng, 4), b = tramoAzar(rng, 4);
    if (a.th % 90 === 0 && b.th % 90 === 0) return null;
    const ang = Math.min(norm(a.az - b.az), 360 - norm(a.az - b.az));
    if (ang === 0 || ang === 180) return null;
    const ca = comp(a), cb = comp(b);
    const D = { e: mas(cb.e, por(-1, ca.e)), n: mas(cb.n, por(-1, ca.n)) };   // de a hacia b
    const pide = rng.elegir(['rumbo', 'rumbo', 'distancia']);
    const L = rng.elegir(LUGARES);
    const u = 'km';
    const enunciado = [`Desde ${L.P}, ${L.a} está a `, v('L', `${largoTxt(a)} ${u}`), ' al ', v('r', rumboTexto(a.az)), ` y ${L.b} está a `, v('L', `${largoTxt(b)} ${u}`), ' al ', v('r', rumboTexto(b.az)), '.', null];
    const La = largoDe(a), Lb = largoDe(b);
    const pasos = [
      [`Posición de ${L.a}: `, `${pos(ca.e, ca.n, u)} de ${L.P}.`],
      [`Posición de ${L.b}: `, `${pos(cb.e, cb.n, u)} de ${L.P}.`],
      [`Para ir de ${L.a} a ${L.b} se resta (${L.b} menos ${L.a}): `, `${pos(D.e, D.n, u)}.`],
    ];
    const pa = { x: val(ca.e), y: val(ca.n) }, pb = { x: val(cb.e), y: val(cb.n) };
    const figS = lamina([{ x: 0, y: 0, rotulo: 'P' }, { ...pa, rotulo: 'a' }, { ...pb, rotulo: 'b' }], [{ a: { x: 0, y: 0 }, b: pa, color: 'var(--c-o)' }, { a: { x: 0, y: 0 }, b: pb, color: 'var(--c-o)' }, { a: pa, b: pb, color: 'var(--c-d)', grueso: true }],
      `P: ${L.P}; a: ${L.a}; b: ${L.b}`);
    const Ssum = { e: mas(ca.e, cb.e), n: mas(ca.n, cb.n) };
    const D345 = (() => { const x = comp(intercambio(a)), y = comp(intercambio(b)); return { e: mas(y.e, por(-1, x.e)), n: mas(y.n, por(-1, x.n)) }; })();
    const hay345 = [30, 37, 53, 60].includes(a.th) || [30, 37, 53, 60].includes(b.th);
    const azD = rumboDe(D.e, D.n);
    enunciado[enunciado.length - 1] = convencion([a.th, b.th, ...(pide === 'rumbo' && azD !== null ? [partes(azD).th] : [])]);
    if (pide === 'distancia') {
      const d = distExacta(D);
      if (!limpio(d)) return null;
      const errores = [
        h('RMP42-suma-distancias', La + Lb, `Sumaste las dos distancias desde ${L.P}. Solo valdría si estuvieran en rumbos opuestos; aquí hay que restar las posiciones por partes.`),
        h('RMP42-resta-distancias', Math.abs(La - Lb), 'Restaste las dos distancias, como si estuvieran en la misma dirección. Están en rumbos distintos.'),
        ang !== 90 ? h('RMP43-angulo-recto', Math.sqrt(La * La + Lb * Lb), `Usaste Pitágoras con las dos distancias, pero entre sus rumbos hay ${ang}°, no 90°.`) : null,
        h('RMP41-suma-posiciones', distExacta(Ssum), 'Sumaste las dos posiciones en vez de restarlas. La distancia entre dos lugares sale de la diferencia de sus posiciones.'),
        hay345 ? h('RMP40-345-al-reves', distExacta(D345), 'Cambiaste el seno y el coseno: el cateto junto al ángulo del rumbo va sobre el eje norte-sur.') : null,
      ].filter(Boolean);
      const alternativas = armarNum(rng, d, errores, u);
      return cerrar(semilla, {
        enunciado, pregunta: [`¿Qué distancia hay entre ${L.a} y ${L.b}?`], figura: { svg: rosa('P'), alt: altRosa(`${L.P} (P)`) },
        figuraSolucion: { svg: figS, alt: `Desde P (${L.P}): ${L.a} a ${largoTxt(a)} km al ${rumboTexto(a.az)} y ${L.b} a ${largoTxt(b)} km al ${rumboTexto(b.az)}. La línea gruesa une los dos lugares y mide ${rad(d)} km.` },
        alternativas, solucion: [...pasos, ['Distancia: √(', `${sq(D.e)} + ${sq(D.n)}`, ') = ', v('x', `${rad(d)} ${u}`), '.']], valor: d, unidad: u,
        datos: { tipo: 'relativo', lugares: [{ rumbo: rumboTexto(a.az), largo: La }, { rumbo: rumboTexto(b.az), largo: Lb }], pide },
      });
    }
    const az = rumboDe(D.e, D.n);
    if (az === null || partes(az).th % 90 === 0 && rng.moneda()) return null;
    const eje = otroEje(az), azS = rumboDe(Ssum.e, Ssum.n), az345 = hay345 ? rumboDe(D345.e, D345.n) : null;
    const errores = [
      ht('RMP41-al-reves', dir(az + 180), `Ese es el rumbo para ir de ${L.b} a ${L.a}. Se pide el de ${L.a} hacia ${L.b}: el opuesto.`),
      eje === null ? null : ht('RMP40-eje', dir(eje), `Mediste el ángulo desde el eje este-oeste. En los rumbos, el ángulo se mide desde el norte o el sur.`),
      azS === null ? null : ht('RMP41-suma-posiciones', dir(azS), 'Sumaste las dos posiciones en vez de restarlas: para ir de un lugar a otro se resta la posición de partida de la de llegada.'),
      az345 === null ? null : ht('RMP40-345-al-reves', dir(az345), 'Cambiaste el seno y el coseno: el cateto junto al ángulo del rumbo va sobre el eje norte-sur.'),
      eje === null ? null : ht('RMP41-RMP40-al-reves-y-eje', dir(otroEje(az + 180)), 'Diste el rumbo al revés (de la llegada a la salida) y, además, mediste el ángulo desde el eje este-oeste.'),
    ].filter(Boolean);
    const alternativas = P.armarTexto({ correcta: dir(az), errores, rng });
    const th = partes(az).th;
    return cerrar(semilla, {
      enunciado, pregunta: [`¿Qué rumbo hay que seguir para ir en línea recta desde ${L.a} hasta ${L.b}?`], figura: { svg: rosa('P'), alt: altRosa(`${L.P} (P)`) },
      figuraSolucion: { svg: figS, alt: `Desde P (${L.P}): ${L.a} a ${largoTxt(a)} km al ${rumboTexto(a.az)} y ${L.b} a ${largoTxt(b)} km al ${rumboTexto(b.az)}. La línea gruesa va de ${L.a} a ${L.b}, con rumbo ${rumboTexto(az)}.` },
      alternativas, solucion: [...pasos, [th % 90 === 0 ? 'Solo queda una parte: el rumbo es ' : `Los catetos de ese avance forman el triángulo notable de ${th}° con el eje norte-sur: el rumbo es `, v('x', rumboTexto(az)), '.']],
      valor: dir(az).clave,
      datos: { tipo: 'relativo', lugares: [{ rumbo: rumboTexto(a.az), largo: La }, { rumbo: rumboTexto(b.az), largo: Lb }], pide },
    });
  }

  // ---------- calc: funciones puras para el papel y las pruebas ----------
  const SENCOS = { 0: [0, 1], 30: [0.5, S3 / 2], 37: [0.6, 0.8], 45: [S2 / 2, S2 / 2], 53: [0.8, 0.6], 60: [S3 / 2, 0.5], 90: [1, 0] };
  const leerLargo = L => { if (typeof L === 'number') return L; const m = /^(\d*)√(\d+)$/.exec(String(L)); if (m) return (m[1] ? Number(m[1]) : 1) * Math.sqrt(Number(m[2])); return Number(L); };
  function vecRumbo(r, L) {
    const { th, sE, sN } = partes(azimut(r));
    if (!SENCOS[th]) throw new Error(`ángulo no notable: ${r}`);
    return [sE * L * SENCOS[th][0], sN * L * SENCOS[th][1]];
  }
  function rumboNum(e, n) {
    if (Math.abs(e) < 1e-9 && Math.abs(n) < 1e-9) return null;
    for (const [th, [s, c]] of Object.entries(SENCOS)) {
      if (Math.abs(Math.abs(e) * c - Math.abs(n) * s) < 1e-9 * Math.max(1, Math.abs(e), Math.abs(n))) return rumboTexto(desdePartes(Number(th), e >= -1e-12 ? 1 : -1, n >= -1e-12 ? 1 : -1));
    }
    return null;
  }
  function recorrido(tramos) {
    let e = 0, n = 0;
    for (const t of tramos) { const [a, b] = vecRumbo(t.rumbo, leerLargo(t.largo)); e += a; n += b; }
    const d = Math.hypot(e, n);
    const r = rumboNum(e, n);
    return { este: e, norte: n, distancia: d, distanciaTexto: P.radical(d), rumbo: r, regreso: r === null ? null : rumboTexto(azimut(r) + 180) };
  }
  const separacion = (a, b, angulo) => Math.sqrt(Math.max(0, a * a + b * b - 2 * a * b * (COS[angulo] ? COS[angulo][0] / COS[angulo][1] : Math.cos(angulo * Math.PI / 180))));

  return { id: ID, titulo: 'Rumbos con la brújula', generar, calc: { azimut, rumboTexto, recorrido, separacion, rumboEnCancha } };
});
