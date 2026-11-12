/*
 * Generador: lo que se repite (ciclos, frecuencia de sucesos y razonamiento inductivo).
 * Formato "predicciones" (docs/arquitectura.md). Funciona en el navegador
 * (window.Generadores['rm-ciclos']) y en Node (require). No usa ningún motor.
 *
 * Tipos y su _datos (índices desde 0 salvo que se diga):
 *   canciones   { tipo, nombres: [..], dur: [min], s, m, T }  lista que se repite; a las 4:00 p. m. suena la
 *               canción s y lleva m minutos; ¿qué canción suena T minutos después? (respuesta: su nombre)
 *   pista       { tipo, n, d, s, k, sentido: 'horario'|'antihorario' }  n marcas numeradas 1..n en sentido
 *               horario, separadas d m; se parte de la marca s (1..n) y se corren k·d metros (respuesta: marca)
 *   fichas      { tipo, n, a, b, p, q, mismo }  tablero circular de n casillas (1..n); A en a avanza p en
 *               sentido horario; B en b avanza q (en el mismo sentido si mismo, si no al revés). Respuesta:
 *               la primera jugada t ≥ 1 al final de la cual están en la misma casilla.
 *   bloque      { tipo, bloque: 'cifras', pre: 'cifras' o '', pide: 'cifra'|'suma'|'ultimas', k, D }
 *               número que empieza con pre y sigue con el bloque repetido. cifra: la del lugar k;
 *               suma: suma de las D primeras cifras; ultimas: las dos últimas si el número tiene D cifras.
 *   unidades    { tipo, regla: 'producto'|'lineal', u1, u2, c1, c0, N }  producto: u(n) = unidades de
 *               u(n−1)·u(n−2); lineal: u(n+1) = unidades de c1·u(n) + c0. Respuesta: u(N).
 *   figuras     { tipo, forma: 'cuadrado'|'hexagono', p0, sp, d0, giro, sd, N }  el punto avanza sp vértices
 *               (+1 horario, −1 antihorario) y la flecha gira giro·45° con signo sd; figura N.
 *               Respuesta: clave 'p<vértice>f<dirección>' (vértices y direcciones desde arriba, en horario).
 *   espiral     { tipo, pide: 'rayo'|'perimetro', rayo: [dx, dy], m, N }  números en espiral (1 al centro,
 *               2 a su derecha, luego hacia arriba, en sentido antihorario). rayo: el m-ésimo número de la
 *               línea que sale del 1 en la dirección (dx, dy), sin contar el 1. perimetro: perímetro (en lados
 *               de casilla) de la región de las casillas 1 a N.
 *   avance      { tipo, pide: 'dias'|'hora', H, a, b, t1 }  sube a m y resbala b m por ciclo (día y noche, o
 *               una hora con t1 minutos de subida); el último tramo no resbala. dias: en qué día llega; hora:
 *               minutos desde el comienzo hasta llegar.
 *
 * calc: funciones puras que usa el generador (cada una por fórmula o residuo, no por simulación):
 *   cancion(d), marca(d), encuentro(d), cifraEn(bloque, pre, k), sumaCifras(bloque, pre, D),
 *   ultimas(bloque, pre, D), cicloUnidades(d) → { pre, periodo, terminos }, unidades(d), figura(d),
 *   numeroEn(x, y), posicionDe(n), perimetro(N), rayo(d), avance(d), resolver(d).
 *
 * Errores: RMP26 desfase del ciclo ignorado (empezar por el primero, olvidar los minutos ya sonados, sin
 * preperiodo, como si partieran juntos); RMP27 residuo mal leído (el 0 como el primero, la que terminó, el
 * sobrante como bloque completo o ignorado); RMP28 recorrido mal orientado (sentido al revés, el residuo
 * contado desde la derecha, la espiral tomada como una fila); RMP29 avance y retroceso mal combinados (todo entre el avance neto, el último ciclo completo);
 * RMP1 puntos contra intervalos (contar la posición de partida como un paso); RMP2 una coincidencia que no es
 * la primera; AR7 ilusión de linealidad (parcial, en la espiral). Todos hipótesis salvo AR7.
 */
(function (root, fabrica) {
  const nodo = typeof module === 'object' && module.exports;
  const api = fabrica(nodo ? require('../../nucleo/azar.js') : root.Azar,
                      nodo ? require('../../nucleo/predicciones.js') : root.Predicciones);
  if (nodo) module.exports = api;
  else (root.Generadores = root.Generadores || {})[api.id] = api;
})(typeof self !== 'undefined' ? self : this, function (Azar, P) {
  'use strict';
  const ID = 'rm-ciclos';
  const RM = 'docs/investigacion/aritmetica-razonamiento-ideas-erroneas.md';
  const h = (id, valor, explicacion) => ({ id, valor, explicacion, respaldo: 'hipotesis', fuente: null });
  const ht = (id, clave, texto, explicacion) => ({ id, clave, texto, explicacion, respaldo: 'hipotesis', fuente: null });
  const f = x => P.formatear(x, 2);
  const v = P.v;
  const xml = P.xml;
  const mod = (a, n) => ((a % n) + n) % n;
  const gcd = (a, b) => (b ? gcd(b, a % b) : Math.abs(a));
  const ORD = n => `${n}.ª`;

  // ---------------- Cálculos (por residuo o fórmula) ----------------
  // canción que suena: posición en el ciclo = minutos antes de la canción s + m + T, módulo la duración total.
  function posCancion(d, conOffset = true, conMinutos = true) {
    const C = d.dur.reduce((a, b) => a + b, 0);
    const antes = conOffset ? d.dur.slice(0, d.s).reduce((a, b) => a + b, 0) : 0;
    return mod(antes + (conMinutos ? d.m : 0) + d.T, C);
  }
  function cancionEn(dur, pos) { let acc = 0; for (let i = 0; i < dur.length; i++) { if (pos < acc + dur[i]) return i; acc += dur[i]; } return 0; }
  const cancion = (d, a, b) => cancionEn(d.dur, posCancion(d, a, b)) + 1;
  const enBorde = d => { const pos = posCancion(d); let acc = 0; for (const x of d.dur) { if (pos === acc) return true; acc += x; } return false; };

  const marca = d => mod(d.s - 1 + (d.sentido === 'horario' ? 1 : -1) * d.k, d.n) + 1;

  // Primera jugada t ≥ 1 con a + p·t ≡ b ± q·t (mod n): (p ∓ q)·t ≡ b − a.
  function encuentro(d) {
    const dv = mod(d.p - (d.mismo ? d.q : -d.q), d.n), dx = mod(d.b - d.a, d.n);
    if (dx === 0) return d.n / gcd(dv, d.n);
    const g = gcd(dv, d.n);
    if (dv === 0 || dx % g !== 0) return null;
    const n2 = d.n / g, a2 = (dv / g) % n2, b2 = (dx / g) % n2;
    let inv = 1; for (let x = 1; x <= n2; x++) if ((a2 * x) % n2 === 1 % n2) { inv = x; break; }
    const t = (b2 * inv) % n2;
    return t === 0 ? n2 : t;
  }

  const digitos = s => s.split('').map(Number);
  function cifraEn(bloque, pre, k) {
    if (k <= pre.length) return Number(pre[k - 1]);
    const r = mod(k - pre.length, bloque.length);
    return Number(bloque[(r === 0 ? bloque.length : r) - 1]);
  }
  function sumaCifras(bloque, pre, D) {
    const L = bloque.length, resto = D - pre.length;
    const q = Math.floor(resto / L), r = resto % L;
    const sb = digitos(bloque).reduce((a, b) => a + b, 0);
    return digitos(pre).reduce((a, b) => a + b, 0) + q * sb + digitos(bloque.slice(0, r)).reduce((a, b) => a + b, 0);
  }
  const ultimas = (bloque, pre, D) => 10 * cifraEn(bloque, pre, D - 1) + cifraEn(bloque, pre, D);

  // Sucesión de unidades: se busca el primer estado repetido (el estado es el par o el último término).
  function cicloUnidades(d) {
    const t = d.regla === 'producto' ? [d.u1, d.u2] : [d.u1];
    const sig = () => (d.regla === 'producto' ? (t[t.length - 1] * t[t.length - 2]) % 10 : (d.c1 * t[t.length - 1] + d.c0) % 10);
    const estado = i => (d.regla === 'producto' ? `${t[i]},${t[i + 1]}` : `${t[i]}`);
    const visto = new Map();
    for (let i = 0; i < 200; i++) {
      while (t.length < i + 2) t.push(sig());
      const e = estado(i);
      if (visto.has(e)) { const j = visto.get(e); return { pre: j, periodo: i - j, terminos: t.slice(0, i + 1) }; }
      visto.set(e, i);
    }
    throw new Error('sin ciclo');
  }
  function unidades(d) {
    const c = cicloUnidades(d);
    if (d.N <= c.pre) return c.terminos[d.N - 1];
    const r = mod(d.N - c.pre, c.periodo);
    return c.terminos[c.pre + (r === 0 ? c.periodo : r) - 1];
  }

  const VERT = { cuadrado: 4, hexagono: 6 };
  function figura(d, k = d.N - 1, sp = d.sp, sd = d.sd) {
    const V = VERT[d.forma];
    return { p: mod(d.p0 + sp * k, V), f: mod(d.d0 + sd * d.giro * k, 8) };
  }
  const claveFig = x => `p${x.p}f${x.f}`;

  // Espiral: número en (x, y) y posición del número n, por anillos.
  function numeroEn(x, y) {
    const k = Math.max(Math.abs(x), Math.abs(y));
    if (k === 0) return 1;
    const b = (2 * k - 1) ** 2;
    if (x === k && y > -k) return b + (y + k);
    if (y === k) return b + 2 * k + (k - x);
    if (x === -k) return b + 4 * k + (k - y);
    return b + 6 * k + (x + k);
  }
  function posicionDe(n) {
    if (n === 1) return [0, 0];
    let k = 1; while ((2 * k + 1) ** 2 < n) k++;
    const b = (2 * k - 1) ** 2, o = n - b;
    if (o <= 2 * k) return [k, o - k];
    if (o <= 4 * k) return [k - (o - 2 * k), k];
    if (o <= 6 * k) return [-k, k - (o - 4 * k)];
    return [o - 6 * k - k, -k];
  }
  // Perímetro de las casillas 1..N: la región es ortogonalmente convexa, así que mide lo mismo que el rectángulo que la encierra.
  function perimetro(N) {
    let x0 = 0, x1 = 0, y0 = 0, y1 = 0;
    for (let n = 1; n <= N; n++) { const [x, y] = posicionDe(n); x0 = Math.min(x0, x); x1 = Math.max(x1, x); y0 = Math.min(y0, y); y1 = Math.max(y1, y); }
    return 2 * ((x1 - x0 + 1) + (y1 - y0 + 1));
  }
  const rayo = (dx, dy, m) => numeroEn(dx * m, dy * m);

  // Avance y retroceso: el día k en que llega es el primero con (k − 1)(a − b) + a ≥ H.
  function avance(d) {
    const k = d.H <= d.a ? 1 : Math.ceil((d.H - d.a) / (d.a - d.b)) + 1;
    if (d.pide === 'dias') return k;
    const falta = d.H - (k - 1) * (d.a - d.b);
    return (k - 1) * 60 + falta * d.t1 / d.a;
  }

  function resolver(d) {
    switch (d.tipo) {
      case 'canciones': return d.nombres[cancion(d, true, true) - 1];
      case 'pista': return marca(d);
      case 'fichas': return encuentro(d);
      case 'bloque': return d.pide === 'cifra' ? cifraEn(d.bloque, d.pre, d.k) : d.pide === 'suma' ? sumaCifras(d.bloque, d.pre, d.D) : ultimas(d.bloque, d.pre, d.D);
      case 'unidades': return unidades(d);
      case 'figuras': return claveFig(figura(d));
      case 'espiral': return d.pide === 'rayo' ? rayo(d.rayo[0], d.rayo[1], d.m) : perimetro(d.N);
      case 'avance': return avance(d);
    }
    throw new Error('tipo desconocido: ' + d.tipo);
  }

  // ---------------- Generación ----------------
  const TIPOS = ['canciones', 'pista', 'fichas', 'bloque', 'unidades', 'figuras', 'espiral', 'avance'];
  function generar(semilla) {
    const rng = Azar.crear(`${ID}|${semilla}`);
    const tipo = rng.elegir(TIPOS);
    for (let intento = 0; intento < 500; intento++) {
      const o = CONSTR[tipo](rng);
      if (!o) continue;
      const alternativas = o.textos
        ? P.armarTexto({ correcta: o.correcta, errores: o.errores, rng })
        : P.armar({ correcta: o.correcta, errores: o.errores, rng, negativos: true, texto: o.texto });
      if (alternativas.length < 4) continue;
      const p = {
        id: `${ID}#${semilla}`, variables: o.variables, enunciado: o.enunciado, pregunta: o.pregunta, datos: '',
        alternativas, solucion: o.solucion, respuesta: { valor: o.textos ? o.correcta.clave : o.correcta, unidad: o.unidad || '' }, _datos: o.datos,
      };
      if (o.figura) p.figura = o.figura;
      if (o.figuraSolucion) p.figuraSolucion = o.figuraSolucion;
      return p;
    }
    throw new Error('No se pudo generar un problema con 4 alternativas distintas');
  }
  const CONSTR = {};

  // Hora del reloj a partir de una hora base (en minutos desde la medianoche).
  function reloj(min) {
    const t = mod(Math.round(min), 24 * 60), hh = Math.floor(t / 60), mm = t % 60;
    const h12 = hh % 12 === 0 ? 12 : hh % 12;
    return `${h12}:${String(mm).padStart(2, '0')} ${hh < 12 ? 'a. m.' : 'p. m.'}`;
  }

  // ---- canciones ----
  const NOMBRES = ['Huaino', 'Morenada', 'Diablada', 'Saya', 'Tuntuna', 'Marinera', 'Cumbia', 'Carnaval', 'Tondero'];
  CONSTR.canciones = function (rng) {
    const n = rng.entero(4, 6);
    const nombres = rng.barajar(NOMBRES).slice(0, n);
    const dur = nombres.map(() => rng.entero(2, 6));
    const s = rng.entero(1, n - 1);
    const m = rng.elegir([0, 0, 1, 2, 3].filter(x => x < dur[s]));
    const T = rng.entero(70, 230);
    const d = { tipo: 'canciones', nombres, dur, s, m, T };
    if (enBorde(d)) return null;
    const C = dur.reduce((a, b) => a + b, 0);
    const idx = cancion(d) - 1;
    const op = i => ({ clave: nombres[i], texto: nombres[i] });
    const errores = [
      ht('RMP26-desde-el-primero', nombres[cancion(d, false, false) - 1], nombres[cancion(d, false, false) - 1],
        `Contaste los ${T} minutos desde el comienzo de la lista (${nombres[0]}). A las 4:00 p. m. ya sonaba ${nombres[s]}: el ciclo empieza ahí, no en la primera canción.`),
      ht('RMP27-la-que-termino', nombres[mod(idx - 1, n)], nombres[mod(idx - 1, n)],
        `Esa es la canción que ya terminó. Al dividir entre ${C}, el residuo cae dentro de ${nombres[idx]}: es la que está sonando.`),
      ht('RMP27-la-siguiente', nombres[mod(idx + 1, n)], nombres[mod(idx + 1, n)],
        `Esa canción todavía no empieza: el residuo cae dentro de ${nombres[idx]}, que aún no termina.`),
    ];
    if (m > 0) {
      const j = cancion(d, true, false) - 1;
      errores.splice(1, 0, ht('RMP26-sin-minutos', nombres[j], nombres[j], `Olvidaste que a las 4:00 p. m. ${nombres[s]} ya llevaba ${m} min sonando. Esos minutos también cuentan para el desfase.`));
    }
    const antes = dur.slice(0, s).reduce((a, b) => a + b, 0);
    const pos = posCancion(d);
    const acum = []; let a = 0; for (let i = 0; i < n; i++) { acum.push(`${nombres[i]}: ${a} a ${a + dur[i]}`); a += dur[i]; }
    const variables = { s: { nombre: 'canción de partida', color: 'o' }, m: { nombre: 'minutos ya sonados', color: 'i' }, T: { nombre: 'tiempo transcurrido', color: 'h' }, C: { nombre: 'duración de la lista', color: 'd' } };
    const hora = 16 * 60 + T;
    return {
      datos: d, textos: true, correcta: op(idx), errores, variables,
      enunciado: ['En una combi de Juliaca suena siempre la misma lista de canciones, en este orden y sin pausas: ',
        nombres.map((x, i) => `${x} (${dur[i]} min)`).join(', '), '; al terminar la última vuelve a empezar la primera. A las 4:00 p. m. ',
        ...(m === 0 ? ['empieza a sonar ', v('s', nombres[s])] : [v('s', nombres[s]), ' lleva ', v('m', `${m} min`), ' sonando']), '.'],
      pregunta: [`¿Qué canción suena a las ${reloj(hora)}?`],
      solucion: [
        ['Una vuelta de la lista dura ', v('C', `${C} min`), '. Se cuentan los minutos desde el comienzo de la lista: ', acum.join('; '), '.'],
        ['A las 4:00 p. m. la lista va en el minuto ', ...(m ? [`${antes} + `, v('m', String(m)), ` = ${antes + m}`] : [String(antes)]), ' (dentro de ', v('s', nombres[s]), ').'],
        [`De 4:00 p. m. a ${reloj(hora)} pasan `, v('T', `${T} min`), `. Minuto de la lista: ${antes + m} + ${T} = ${antes + m + T}; al dividir entre ${C} el residuo es ${pos}.`],
        [`El minuto ${pos} cae dentro de ${nombres[idx]}: es la canción que suena.`],
      ],
    };
  };

  // ---- pista circular ----
  function svgCirculo(n, marcas, extra = '') {
    const cx = 190, cy = 150, R = 105, out = [];
    out.push(`<circle cx="${cx}" cy="${cy}" r="${R}" style="fill:none;stroke:currentColor;stroke-width:2"/>`);
    for (let i = 0; i < n; i++) {
      const ang = -Math.PI / 2 + 2 * Math.PI * i / n;
      const x = cx + R * Math.cos(ang), y = cy + R * Math.sin(ang);
      const lx = cx + (R + 22) * Math.cos(ang), ly = cy + (R + 22) * Math.sin(ang) + 6;
      const est = marcas[i + 1] ? `style="fill:var(--c-${marcas[i + 1]});stroke:currentColor"` : 'style="fill:var(--card);stroke:currentColor"';
      out.push(`<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${marcas[i + 1] ? 8 : 5}" ${est}/>`);
      out.push(`<text x="${lx.toFixed(1)}" y="${ly.toFixed(1)}" text-anchor="middle" font-size="16" style="fill:currentColor">${i + 1}</text>`);
    }
    return `<svg viewBox="0 0 380 300" xmlns="http://www.w3.org/2000/svg">${out.join('')}${extra}</svg>`;
  }
  // Flecha curva al centro que muestra el sentido.
  function flechaSentido(horario, color) {
    const cx = 190, cy = 150, r = 40;
    const a0 = -Math.PI / 2 - 0.9, a1 = -Math.PI / 2 + 0.9;
    const [s, e] = horario ? [a0, a1] : [a1, a0];
    const p = a => [cx + r * Math.cos(a), cy + r * Math.sin(a)];
    const [x0, y0] = p(s), [x1, y1] = p(e);
    const dir = horario ? 1 : -1;
    const tx = -Math.sin(e) * dir, ty = Math.cos(e) * dir;
    const hx = x1 + tx * 0, hy = y1 + ty * 0;
    const ax = hx - tx * 10 + ty * 6, ay = hy - ty * 10 - tx * 6, bx = hx - tx * 10 - ty * 6, by = hy - ty * 10 + tx * 6;
    return `<path d="M${x0.toFixed(1)},${y0.toFixed(1)} A${r},${r} 0 0 ${horario ? 1 : 0} ${x1.toFixed(1)},${y1.toFixed(1)}" style="fill:none;stroke:var(--c-${color});stroke-width:3"/>` +
      `<polygon points="${hx.toFixed(1)},${hy.toFixed(1)} ${ax.toFixed(1)},${ay.toFixed(1)} ${bx.toFixed(1)},${by.toFixed(1)}" style="fill:var(--c-${color})"/>` +
      `<text x="${cx}" y="${cy + 12}" text-anchor="middle" font-size="15" style="fill:var(--c-${color})">${horario ? 'horario' : 'antihorario'}</text>`;
  }
  CONSTR.pista = function (rng) {
    const n = rng.entero(6, 12), d = rng.elegir([10, 20, 25, 40, 50]);
    const s = rng.entero(1, n), sentido = rng.elegir(['horario', 'antihorario']);
    const cero = rng.sig() < 0.2;
    const vueltas = rng.entero(2, 9);
    const k = vueltas * n + (cero ? 0 : rng.entero(1, n - 1));
    const datos = { tipo: 'pista', n, d, s, k, sentido };
    const correcta = marca(datos), r = k % n;
    const otro = sentido === 'horario' ? 'antihorario' : 'horario';
    const errores = [
      h('RMP28-sentido', marca({ ...datos, sentido: otro }), `Avanzaste en sentido ${otro}. Las marcas están numeradas en sentido horario, y el atleta corre en sentido ${sentido}: ${sentido === 'horario' ? 'los números suben' : 'los números bajan'}.`),
      h('RMP26-desde-el-primero', marca({ ...datos, s: 1 }), `Contaste los tramos desde la marca 1, pero el atleta parte de la marca ${s}.`),
      h('RMP1-cuenta-la-partida', marca({ ...datos, k: k - 1 }), `Contaste la marca de salida como el primer tramo. Cada tramo de ${d} m va de una marca a la siguiente: ${k} tramos llevan ${k} marcas más allá, no ${k - 1}.`),
    ];
    if (r === 0) errores.unshift(h('RMP27-residuo-cero', marca({ ...datos, k: 1 }), `El residuo es 0: el atleta da vueltas completas y termina donde empezó, en la marca ${s}. Tomaste el residuo 0 como si fuera un tramo.`));
    else errores.push(h('RMP27-con-el-cociente', marca({ ...datos, k: Math.floor(k / n) }), `Avanzaste tantas marcas como vueltas completas (${Math.floor(k / n)}). Las vueltas completas no cambian la marca; lo que cuenta es el residuo, ${r}.`));
    const variables = { s: { nombre: 'marca de salida', color: 'o' }, d: { nombre: 'separación', color: 'i' }, D: { nombre: 'distancia', color: 'h' }, sen: { nombre: 'sentido', color: 'd' } };
    const D = k * d;
    const figura = {
      svg: svgCirculo(n, { [s]: 'o' }, flechaSentido(sentido === 'horario', 'd')),
      alt: `Circunferencia con ${n} marcas equidistantes numeradas del 1 al ${n} en sentido horario, con el 1 arriba. La marca ${s}, de salida, está resaltada. En el centro, una flecha curva indica el sentido ${sentido}.`,
    };
    return {
      datos, correcta, errores, variables, texto: x => `Marca ${x}`, figura,
      enunciado: [`Una pista circular del estadio de Puno tiene ${n} marcas equidistantes, numeradas del 1 al ${n} en sentido horario; entre dos marcas vecinas hay `, v('d', `${d} m`),
        '. Un atleta parte de la ', v('s', `marca ${s}`), ' y corre ', v('D', `${f(D)} m`), ' en sentido ', v('sen', sentido), '.'],
      pregunta: ['¿En qué marca termina?'],
      solucion: [
        ['Tramos entre marcas: ', v('D', f(D)), ' ÷ ', v('d', String(d)), ` = ${k}.`],
        [`Una vuelta son ${n} tramos: ${k} = ${n} × ${Math.floor(k / n)} + ${r}. Las vueltas completas lo devuelven a la misma marca; ${r === 1 ? 'queda 1 tramo' : `quedan ${r} tramos`}.`],
        [r === 0 ? ['Residuo 0: termina en la marca de salida, la ', v('s', String(s)), '.'].flat()
          : ['Desde la ', v('s', `marca ${s}`), `, ${r} ${r === 1 ? 'tramo' : 'tramos'} en sentido `, v('sen', sentido), ` (${sentido === 'horario' ? 'los números suben' : 'los números bajan'}, y después de ${sentido === 'horario' ? n + ' viene 1' : '1 viene ' + n}): marca ${correcta}.`]].flat(),
      ],
    };
  };

  // ---- fichas en un tablero circular ----
  CONSTR.fichas = function (rng) {
    const n = rng.entero(8, 15), a = rng.entero(1, n);
    let b = rng.entero(1, n); if (b === a) return null;
    const p = rng.entero(1, 5), q = rng.entero(1, 5), mismo = rng.moneda();
    if (mismo && p === q) return null;
    const datos = { tipo: 'fichas', n, a, b, p, q, mismo };
    const t = encuentro(datos);
    if (!t || t < 3 || t > 20) return null;
    const errores = [];
    const otro = encuentro({ ...datos, mismo: !mismo });
    if (otro) errores.push(h('RMP28-sentido', otro, mismo ? 'Moviste B en sentido contrario al de A. Las dos fichas avanzan en sentido horario.' : 'Moviste las dos fichas en el mismo sentido. B avanza en sentido antihorario, al revés que A.'));
    const dv = mod(p - (mismo ? q : -q), n);
    errores.push(h('RMP26-como-si-partieran-juntas', n / gcd(dv, n), `Esa es la jugada en que coincidirían si hubieran partido de la misma casilla. Parten de casillas distintas (${a} y ${b}): hay que descontar esa separación.`));
    errores.push(h('RMP2-no-es-la-primera', t + n / gcd(dv, n), 'En esa jugada sí coinciden, pero no es la primera vez: ya coincidieron antes.'));
    errores.push(h('RMP1-cuenta-la-partida', t - 1, 'Contaste la posición inicial como la jugada 1. La jugada 1 es el primer movimiento.'));
    const variables = { A: { nombre: 'ficha A', color: 'o' }, B: { nombre: 'ficha B', color: 'i' }, p: { nombre: 'avance de A', color: 'h' }, q: { nombre: 'avance de B', color: 'd' } };
    const pos = (x0, paso, j) => mod(x0 - 1 + paso * j, n) + 1;
    const tabla = []; for (let j = 0; j <= t; j++) tabla.push(`${j}: A en ${pos(a, p, j)}, B en ${pos(b, mismo ? q : -q, j)}`);
    const figura = {
      svg: svgCirculo(n, { [a]: 'o', [b]: 'i' }, `<text x="190" y="140" text-anchor="middle" font-size="16" style="fill:var(--c-o)">A en ${a}</text><text x="190" y="165" text-anchor="middle" font-size="16" style="fill:var(--c-i)">B en ${b}</text>`),
      alt: `Tablero circular de ${n} casillas numeradas del 1 al ${n} en sentido horario, con el 1 arriba. La ficha A está en la casilla ${a} y la ficha B en la casilla ${b}.`,
    };
    return {
      datos, correcta: t, errores, variables, figura, texto: x => `${x} ${x === 1 ? 'jugada' : 'jugadas'}`,
      enunciado: [`Un tablero circular tiene ${n} casillas numeradas del 1 al ${n} en sentido horario. La `, v('A', `ficha A`), ` está en la casilla ${a} y la `, v('B', 'ficha B'), ` en la casilla ${b}. En cada jugada se mueven las dos a la vez: A avanza `, v('p', `${p} ${p === 1 ? 'casilla' : 'casillas'}`), ' en sentido horario y B avanza ', v('q', `${q} ${q === 1 ? 'casilla' : 'casillas'}`), ` en sentido ${mismo ? 'horario' : 'antihorario'}. Solo cuenta dónde quedan al terminar cada jugada.`],
      pregunta: ['¿Al final de qué jugada quedan por primera vez en la misma casilla?'],
      solucion: [
        [`Mide la separación de A hacia B en sentido horario: al comienzo es ${mod(b - a, n)} casillas. En cada jugada `,
          !mismo ? `A avanza ${p} y B viene ${q} hacia A, así que la separación baja ${p} + ${q} = ${p + q}` : p > q ? `A avanza ${p} y B se aleja ${q}, así que la separación baja ${p} − ${q} = ${p - q}` : `B se aleja ${q} y A solo avanza ${p}, así que la separación sube ${q - p}`,
          `; en un tablero de ${n} casillas, eso es bajar ${dv === 1 ? '1 casilla' : dv + ' casillas'} por jugada (módulo ${n}).`],
        [`Coinciden cuando la separación llega a 0: cuando ${dv} × t deja residuo ${mod(b - a, n)} al dividir entre ${n}.`],
        ['Jugada por jugada: ', tabla.join('; '), '.'],
        [`La primera vez que quedan juntas es al final de la jugada ${t}.`],
      ],
    };
  };

  // ---- número formado por un bloque repetido ----
  CONSTR.bloque = function (rng) {
    const L = rng.entero(3, 5);
    const bloque = rng.barajar([1, 2, 3, 4, 5, 6, 7, 8, 9]).slice(0, L).join('');
    const pre = rng.moneda() ? '' : rng.barajar([1, 2, 3, 4, 5, 6, 7, 8, 9].filter(x => !bloque.includes(String(x)))).slice(0, rng.entero(1, 2)).join('');
    const pide = rng.elegir(['cifra', 'suma', 'ultimas']);
    const k = rng.entero(60, 300), D = rng.entero(40, 150);
    const cero = rng.sig() < 0.25;
    const datos = { tipo: 'bloque', bloque, pre, pide, k: pide === 'cifra' ? k : 0, D: pide === 'cifra' ? 0 : D };
    if (cero) { // un residuo 0 a propósito
      if (pide === 'cifra') datos.k = pre.length + L * rng.entero(15, 60); else datos.D = pre.length + L * rng.entero(10, 30);
    }
    const correcta = resolver(datos);
    const muestra = pre + bloque.repeat(3);
    const errores = [];
    const lp = pre.length;
    const variables = { b: { nombre: 'bloque que se repite', color: 'o' }, k: { nombre: 'lugar o cantidad de cifras', color: 'i' }, pre: { nombre: 'cifras del comienzo', color: 'h' } };
    const enunciado = [lp ? `Un número empieza con ${lp === 1 ? 'la cifra' : 'las cifras'} ` : 'Un número se escribe repitiendo el bloque ', ...(lp ? [v('pre', pre), ' y sigue con el bloque ', v('b', bloque), ' repetido una y otra vez'] : [v('b', bloque), ' una y otra vez']), `, sin espacios: ${muestra}…`];
    let pregunta, solucion;
    if (pide === 'cifra') {
      const kk = datos.k, r = mod(kk - lp, L);
      if (lp) errores.push(h('RMP26-sin-preperiodo', cifraEn(bloque, '', kk), `Dividiste ${kk} entre ${L} como si el bloque empezara en la primera cifra. ${lp === 1 ? `La primera cifra (${pre}) no es parte del bloque: hay que restarla` : `Las ${lp} primeras (${pre}) no son parte del bloque: hay que restarlas`} antes de dividir.`));
      if (r === 0) errores.push(h('RMP27-residuo-cero', Number(bloque[0]), `Con residuo 0, la cifra es la última del bloque (${bloque[L - 1]}), no la primera: el lugar ${kk} cierra un bloque completo.`));
      errores.push(h('RMP28-desde-la-derecha', Number(bloque[L - 1 - ((r === 0 ? L : r) - 1)]), `Contaste el residuo desde el final del bloque. El residuo ${r === 0 ? L : r} indica el lugar dentro del bloque contado desde su primera cifra.`));
      errores.push(h('RMP27-con-el-cociente', Number(bloque[mod(Math.floor((kk - lp) / L), L)]), `Usaste el cociente (${Math.floor((kk - lp) / L)}) para ubicarte en el bloque. El cociente dice cuántos bloques completos hay; el lugar dentro del bloque lo da el residuo.`));
      errores.push(h('RMP1-un-lugar-corrido', cifraEn(bloque, pre, kk + 1), `Te corriste un lugar: esa es la cifra del lugar ${kk + 1}.`));
      pregunta = ['¿Qué cifra ocupa el lugar ', v('k', String(kk)), '?'];
      solucion = [
        [lp ? `${lp === 1 ? 'La primera cifra' : `Las ${lp} primeras cifras`} (` : 'El bloque ', ...(lp ? [v('pre', pre), `) ${lp === 1 ? 'va' : 'van'} antes del bloque: quedan ${kk} − ${lp} = ${kk - lp} lugares dentro de la parte que se repite. El bloque `] : []), v('b', bloque), ` tiene ${L} cifras.`],
        [`${kk - lp} = ${L} × ${Math.floor((kk - lp) / L)} + ${r}.`, r === 0 ? ' Residuo 0: el lugar cierra un bloque completo, así que es la última cifra del bloque.' : ` Residuo ${r}: es la cifra ${r} del bloque.`],
        [`La cifra es ${correcta}.`],
      ];
    } else if (pide === 'suma') {
      const DD = datos.D, resto = DD - lp, q = Math.floor(resto / L), r = resto % L;
      const sb = digitos(bloque).reduce((x, y) => x + y, 0), sp = digitos(pre).reduce((x, y) => x + y, 0);
      if (r > 0) {
        errores.push(h('RMP27-bloque-completo', sp + (q + 1) * sb, `Tomaste el sobrante de ${r === 1 ? '1 cifra' : r + ' cifras'} como un bloque completo. Del último bloque solo se escribe${r === 1 ? ' su primera cifra' : 'n sus primeras ' + r + ' cifras'}.`));
        errores.push(h('RMP27-sin-sobrante', sp + q * sb, `Te quedaste con los ${q} bloques completos y olvidaste ${r === 1 ? 'la cifra que sobra' : 'las ' + r + ' cifras que sobran'} al final.`));
        errores.push(h('RMP28-desde-la-derecha', sp + q * sb + digitos(bloque.slice(L - r)).reduce((x, y) => x + y, 0), `Tomaste ${r === 1 ? 'la cifra' : 'las ' + r + ' cifras'} del sobrante desde el final del bloque. El bloque incompleto empieza por su primera cifra: ${bloque.slice(0, r)}.`));
      }
      if (lp) errores.push(h('RMP26-sin-preperiodo', sumaCifras(bloque, '', DD), `Repartiste las ${DD} cifras en bloques desde el comienzo, pero ${lp === 1 ? `la primera cifra (${pre}) no es parte del bloque` : `las ${lp} primeras (${pre}) no son parte del bloque`}.`));
      pregunta = ['¿Cuál es la suma de las primeras ', v('k', String(DD)), ' cifras del número?'];
      solucion = [
        lp ? [lp === 1 ? 'Primero la cifra del comienzo, ' : 'Primero las cifras del comienzo: ', v('pre', pre), `${lp === 1 ? '' : ` suman ${sp}`}; quedan ${DD} − ${lp} = ${resto} cifras.`] : [`Hay ${resto} cifras en total.`],
        [`${resto} = ${L} × ${q} + ${r}: son ${q} bloques completos`, r ? ` y ${r === 1 ? 'sobra la primera cifra' : 'sobran las ' + r + ' primeras cifras'} del bloque (${bloque.slice(0, r)}).` : ', sin sobrante.'],
        ['Cada bloque ', v('b', bloque), ` suma ${sb}. Total: ${lp ? sp + ' + ' : ''}${q} × ${sb}${r ? ' + ' + digitos(bloque.slice(0, r)).join(' + ') : ''} = ${correcta}.`],
      ];
    } else {
      const DD = datos.D, resto = DD - lp, r = resto % L;
      if (r !== 0) errores.push(h('RMP27-bloque-completo', Number(bloque.slice(-2)), `Supusiste que el número termina con un bloque completo. ${resto} no es múltiplo de ${L}: el último bloque queda cortado después de ${r} ${r === 1 ? 'cifra' : 'cifras'}.`));
      if (lp) errores.push(h('RMP26-sin-preperiodo', ultimas(bloque, '', DD), `Dividiste ${DD} entre ${L} sin quitar ${lp === 1 ? `la cifra del comienzo (${pre}), que no es parte` : `las cifras del comienzo (${pre}), que no son parte`} del bloque.`));
      errores.push(h('RMP1-un-lugar-corrido', ultimas(bloque, pre, DD + 1), 'Te corriste un lugar: esas serían las dos últimas cifras si el número tuviera una cifra más.'));
      errores.push(h('RMP1-un-lugar-menos', ultimas(bloque, pre, DD - 1), 'Te corriste un lugar: esas serían las dos últimas cifras si el número tuviera una cifra menos.'));
      if (r === 0) errores.push(h('RMP27-residuo-cero', Number(bloque.slice(0, 2)), `Con residuo 0 el número termina justo con un bloque completo: sus últimas cifras son las del final del bloque, no las del comienzo.`));
      pregunta = ['Si el número tiene ', v('k', String(DD)), ' cifras, ¿cuáles son sus dos últimas cifras? (Escríbelas como un número de dos cifras.)'];
      solucion = [
        lp ? [lp === 1 ? 'Sin la cifra del comienzo (' : 'Sin las cifras del comienzo (', v('pre', pre), `) quedan ${DD} − ${lp} = ${resto} cifras de la parte que se repite.`] : [`Las ${resto} cifras son todas de la parte que se repite.`],
        [`${resto} = ${L} × ${Math.floor(resto / L)} + ${r}.`, r === 0 ? ' Residuo 0: termina con un bloque completo.' : ` Residuo ${r}: el último bloque se corta después de su cifra ${r}.`],
        ['Las dos últimas cifras son ', String(correcta).padStart(2, '0'), '.'],
      ];
    }
    return { datos, correcta, errores, variables, enunciado, pregunta, solucion };
  };

  // ---- cifra de las unidades ----
  CONSTR.unidades = function (rng) {
    const regla = rng.elegir(['producto', 'lineal']);
    const datos = regla === 'producto'
      ? { tipo: 'unidades', regla, u1: rng.entero(2, 9), u2: rng.entero(2, 9), c1: null, c0: null, N: rng.entero(40, 200) }
      : { tipo: 'unidades', regla, u1: rng.entero(0, 9), u2: null, c1: rng.elegir([2, 4, 6, 8]), c0: rng.entero(1, 9), N: rng.entero(40, 200) };
    const c = cicloUnidades(datos);
    if (c.pre < 1 || c.pre > 3 || c.periodo < 2 || c.periodo > 6) return null;
    const correcta = unidades(datos), T = c.terminos;
    const r = mod(datos.N - c.pre, c.periodo);
    const ciclo = T.slice(c.pre, c.pre + c.periodo);
    const errores = [
      h('RMP26-sin-preperiodo', T[mod(datos.N - 1, c.periodo)], `Contaste el período desde el primer término. ${c.pre === 1 ? 'El primer término no forma parte del ciclo' : `Los ${c.pre} primeros términos no forman parte del ciclo`}: el ciclo (${ciclo.join(', ')}) empieza en el término ${c.pre + 1}, y hay que descontar${c.pre === 1 ? 'lo' : 'los'} antes de dividir.`),
      h('RMP26-periodo-con-preperiodo', T[mod(datos.N - 1, c.pre + c.periodo)], `Tomaste como período los ${c.pre + c.periodo} primeros términos. El período es solo lo que se repite: ${ciclo.join(', ')} (${c.periodo} términos).`),
    ];
    if (r === 0) errores.unshift(h('RMP27-residuo-cero', ciclo[0], `Con residuo 0 el término cierra un ciclo completo: es el último del ciclo (${ciclo[c.periodo - 1]}), no el primero.`));
    else errores.push(h('RMP1-un-lugar-corrido', ciclo[r % c.periodo], `Te corriste un lugar dentro del ciclo: el residuo ${r} indica el término ${r} del ciclo, contando el primero como 1.`));
    const ic = (r === 0 ? c.periodo : r) - 1;
    errores.push(h('RMP1-un-lugar-menos', ciclo[mod(ic - 1, c.periodo)], `Te quedaste un lugar antes dentro del ciclo: ${r === 0 ? 'con residuo 0 el término es el último del ciclo' : `el residuo ${r} indica el término ${r} del ciclo`}.`));
    const variables = { u: { nombre: 'primeros términos', color: 'o' }, N: { nombre: 'lugar pedido', color: 'i' }, P: { nombre: 'período', color: 'h' } };
    const regTxt = regla === 'producto'
      ? 'desde el tercero, cada término es la cifra de las unidades del producto de los dos anteriores'
      : `cada término es la cifra de las unidades del número ${datos.c1} × (término anterior) + ${datos.c0}`;
    return {
      datos, correcta, errores, variables,
      enunciado: ['En una sucesión, ', regla === 'producto' ? ['los dos primeros términos son ', v('u', `${datos.u1} y ${datos.u2}`)].flat() : ['el primer término es ', v('u', String(datos.u1))].flat(), `, y ${regTxt}.`].flat(),
      pregunta: ['¿Cuál es el término del lugar ', v('N', String(datos.N)), '?'],
      solucion: [
        ['Primeros términos: ', T.slice(0, c.pre + c.periodo + 2).join(', '), ', …'],
        [`${c.pre === 1 ? 'El primer término no forma parte del ciclo' : `Los ${c.pre} primeros términos no forman parte del ciclo`} (preperíodo). Desde el término ${c.pre + 1} se repite el ciclo ${ciclo.join(', ')}, de `, v('P', `${c.periodo} términos`), '.'],
        [`Lugares dentro de la parte que se repite: `, v('N', String(datos.N)), ` − ${c.pre} = ${datos.N - c.pre} = ${c.periodo} × ${Math.floor((datos.N - c.pre) / c.periodo)} + ${r}.`, r === 0 ? ' Residuo 0: es el último del ciclo.' : ` Residuo ${r}: es el término ${r} del ciclo.`],
        [`El término pedido es ${correcta}.`],
      ],
    };
  };

  // ---- serie de figuras ----
  const NOM_V = { cuadrado: ['arriba a la izquierda', 'arriba a la derecha', 'abajo a la derecha', 'abajo a la izquierda'],
    hexagono: ['arriba', 'arriba a la derecha', 'abajo a la derecha', 'abajo', 'abajo a la izquierda', 'arriba a la izquierda'] };
  const NOM_F = ['hacia arriba', 'hacia arriba a la derecha', 'hacia la derecha', 'hacia abajo a la derecha', 'hacia abajo', 'hacia abajo a la izquierda', 'hacia la izquierda', 'hacia arriba a la izquierda'];
  const textoFig = (forma, x) => `Punto ${NOM_V[forma][x.p]}; flecha ${NOM_F[x.f]}`;
  function dibujoFigura(forma, x, ox, etiqueta) {
    const cx = ox + 45, cy = 55, out = [];
    let vs;
    if (forma === 'cuadrado') vs = [[-30, -30], [30, -30], [30, 30], [-30, 30]];
    else vs = [0, 1, 2, 3, 4, 5].map(i => { const a = -Math.PI / 2 + i * Math.PI / 3; return [34 * Math.cos(a), 34 * Math.sin(a)]; });
    out.push(`<polygon points="${vs.map(([a, b]) => `${(cx + a).toFixed(1)},${(cy + b).toFixed(1)}`).join(' ')}" style="fill:var(--card);stroke:currentColor;stroke-width:2"/>`);
    const [px, py] = vs[x.p];
    out.push(`<circle cx="${(cx + px).toFixed(1)}" cy="${(cy + py).toFixed(1)}" r="7" style="fill:var(--c-o)"/>`);
    const ang = -Math.PI / 2 + x.f * Math.PI / 4, L = 18;
    const ex = cx + L * Math.cos(ang), ey = cy + L * Math.sin(ang), sx = cx - L * Math.cos(ang), sy = cy - L * Math.sin(ang);
    const ux = Math.cos(ang), uy = Math.sin(ang);
    out.push(`<line x1="${sx.toFixed(1)}" y1="${sy.toFixed(1)}" x2="${(ex - ux * 6).toFixed(1)}" y2="${(ey - uy * 6).toFixed(1)}" style="stroke:var(--c-i);stroke-width:3"/>`);
    out.push(`<polygon points="${ex.toFixed(1)},${ey.toFixed(1)} ${(ex - ux * 10 - uy * 6).toFixed(1)},${(ey - uy * 10 + ux * 6).toFixed(1)} ${(ex - ux * 10 + uy * 6).toFixed(1)},${(ey - uy * 10 - ux * 6).toFixed(1)}" style="fill:var(--c-i)"/>`);
    out.push(`<text x="${cx}" y="112" text-anchor="middle" font-size="15" style="fill:currentColor">${xml(etiqueta)}</text>`);
    return out.join('');
  }
  CONSTR.figuras = function (rng) {
    const forma = rng.elegir(['cuadrado', 'cuadrado', 'hexagono']);
    const V = VERT[forma];
    const datos = { tipo: 'figuras', forma, p0: rng.entero(0, V - 1), sp: rng.elegir([1, -1]) * rng.elegir([1, 1, 2].filter(x => x < V / 2 || V === 6)),
      d0: rng.entero(0, 7), giro: rng.elegir([1, 2, 3]), sd: rng.elegir([1, -1]), N: rng.entero(20, 150) };
    if (forma === 'cuadrado' && Math.abs(datos.sp) === 2) return null;
    const x = figura(datos), k = datos.N - 1;
    const op = y => ({ clave: claveFig(y), texto: textoFig(forma, y) });
    const Pp = V / gcd(Math.abs(datos.sp), V), Pf = 8 / gcd(datos.giro, 8);
    const errores = [
      { ...ht('RMP1-cuenta-la-partida', '', '', `Hiciste ${datos.N} movimientos. Hasta la figura ${datos.N} hay ${k} movimientos: la figura 1 es la de partida.`), ...op(figura(datos, datos.N)) },
      { ...ht('RMP28-sentido-flecha', '', '', `Giraste la flecha al revés. Mira las primeras figuras: gira en sentido ${datos.sd > 0 ? 'horario' : 'antihorario'}.`), ...op(figura(datos, k, datos.sp, -datos.sd)) },
      { ...ht('RMP28-sentido-punto', '', '', `Moviste el punto al revés. En las primeras figuras avanza en sentido ${datos.sp > 0 ? 'horario' : 'antihorario'}.`), ...op(figura(datos, k, -datos.sp, datos.sd)) },
    ];
    const rp = datos.N % Pp, rf = datos.N % Pf;
    if (rp === 0 || rf === 0) {
      const y = { p: rp === 0 ? datos.p0 : x.p, f: rf === 0 ? datos.d0 : x.f };
      errores.unshift({ ...ht('RMP27-residuo-cero', '', '', `Dividiste ${datos.N} entre el período y, con residuo 0, tomaste la primera figura. Con residuo 0 toca la última figura del ciclo, no la primera.`), ...op(y) });
    }
    errores.push({ ...ht('RMP28-sentido', '', '', 'Moviste los dos elementos al revés. Fíjate en el sentido de cada uno en las primeras figuras.'), ...op(figura(datos, k, -datos.sp, -datos.sd)) });
    const svg = `<svg viewBox="0 0 400 125" xmlns="http://www.w3.org/2000/svg">${[0, 1, 2, 3].map(i => dibujoFigura(forma, figura(datos, i), 8 + i * 98, `Figura ${i + 1}`)).join('')}</svg>`;
    const alt = `Serie de figuras: ${forma === 'cuadrado' ? 'un cuadrado' : 'un hexágono con un vértice arriba'} con un punto en un vértice y una flecha en el centro. ` +
      [0, 1, 2, 3].map(i => `Figura ${i + 1}: ${textoFig(forma, figura(datos, i)).toLowerCase()}.`).join(' ');
    const variables = { pt: { nombre: 'punto', color: 'o' }, fl: { nombre: 'flecha', color: 'i' }, N: { nombre: 'lugar pedido', color: 'h' } };
    const kp = mod(k, Pp), kf = mod(k, Pf);
    return {
      datos, textos: true, correcta: op(x), errores, variables, figura: { svg, alt },
      enunciado: ['En la serie de figuras, el ', v('pt', 'punto'), ' y la ', v('fl', 'flecha'), ' cambian siempre de la misma manera de una figura a la siguiente.'],
      pregunta: ['¿Cómo es la figura ', v('N', String(datos.N)), '?'],
      solucion: [
        ['De una figura a la siguiente, el ', v('pt', 'punto'), ` avanza ${Math.abs(datos.sp)} ${Math.abs(datos.sp) === 1 ? 'vértice' : 'vértices'} en sentido ${datos.sp > 0 ? 'horario' : 'antihorario'} (vuelve a su lugar cada ${Pp} figuras) y la `, v('fl', 'flecha'), ` gira ${45 * datos.giro}° en sentido ${datos.sd > 0 ? 'horario' : 'antihorario'} (vuelve cada ${Pf} figuras).`],
        ['Hasta la figura ', v('N', String(datos.N)), ` hay ${datos.N} − 1 = ${k} movimientos.`],
        [`Punto: ${k} = ${Pp} × ${Math.floor(k / Pp)} + ${kp}, así que está como en la figura ${kp + 1}. Flecha: ${k} = ${Pf} × ${Math.floor(k / Pf)} + ${kf}, así que está como en la figura ${kf + 1}.`],
        [`Figura ${datos.N}: ${textoFig(forma, x).toLowerCase()}.`],
      ],
    };
  };

  // ---- espiral numérica ----
  const RAYOS = [[1, 0, 'hacia la derecha'], [0, 1, 'hacia arriba'], [-1, 0, 'hacia la izquierda'], [0, -1, 'hacia abajo'],
    [1, 1, 'en diagonal hacia arriba a la derecha'], [-1, 1, 'en diagonal hacia arriba a la izquierda'], [-1, -1, 'en diagonal hacia abajo a la izquierda'], [1, -1, 'en diagonal hacia abajo a la derecha']];
  function svgEspiral(resaltar, sombra) {
    const c = 52, out = [], ox = 60, oy = 10;
    for (let y = 2; y >= -2; y--) for (let x = -2; x <= 2; x++) {
      const n = numeroEn(x, y), X = ox + (x + 2) * c, Y = oy + (2 - y) * c;
      const col = resaltar.has(n) ? 'var(--c-o)' : sombra && n <= sombra ? 'var(--c-h)' : 'var(--card)';
      out.push(`<rect x="${X}" y="${Y}" width="${c}" height="${c}" style="fill:${col};fill-opacity:${col === 'var(--card)' ? 1 : 0.35};stroke:currentColor"/>`);
      out.push(`<text x="${X + c / 2}" y="${Y + c / 2 + 6}" text-anchor="middle" font-size="17" style="fill:currentColor${resaltar.has(n) ? ';font-weight:bold' : ''}">${n}</text>`);
    }
    return `<svg viewBox="0 0 380 280" xmlns="http://www.w3.org/2000/svg">${out.join('')}</svg>`;
  }
  const poli = (B, C) => `4j²${B === 0 ? '' : (B > 0 ? ' + ' : ' − ') + (Math.abs(B) === 1 ? '' : Math.abs(B)) + 'j'}${C === 0 ? '' : (C > 0 ? ' + ' : ' − ') + Math.abs(C)}`;
  const altEspiral = 'Cuadrícula de 5 por 5 con los números del 1 al 25 escritos en espiral. Filas de arriba hacia abajo: ' +
    [2, 1, 0, -1, -2].map(y => [-2, -1, 0, 1, 2].map(x => numeroEn(x, y)).join(', ')).join('; ') + '.';
  CONSTR.espiral = function (rng) {
    const pide = rng.elegir(['rayo', 'rayo', 'perimetro']);
    const variables = { r: { nombre: 'línea o región', color: 'o' }, m: { nombre: 'lugar o último número', color: 'i' }, e: { nombre: 'ejemplo', color: 'h' } };
    const base = ['Se escriben los números naturales en espiral sobre una cuadrícula: el 1 en el centro, el 2 a su derecha, y luego se sigue dando vueltas en sentido antihorario (el 3 arriba del 2, el 4 a la izquierda del 3, …), como en la figura.'];
    if (pide === 'rayo') {
      const [dx, dy, nom] = rng.elegir(RAYOS);
      const m = rng.entero(8, 20);
      const datos = { tipo: 'espiral', pide, rayo: [dx, dy], m, N: 0 };
      const a = j => rayo(dx, dy, j), correcta = a(m);
      const errores = [
        { id: 'AR7-primera-diferencia', valor: a(1) + (m - 1) * (a(2) - a(1)), explicacion: `Supusiste que los números de la línea crecen siempre lo mismo (${a(2) - a(1)}). Cada vuelta de la espiral es 8 casillas más larga que la anterior, así que los saltos crecen de 8 en 8.`, respaldo: 'parcial', fuente: RM },
        { id: 'AR7-ultima-diferencia', valor: a(3) + (m - 3) * (a(3) - a(2)), explicacion: `Seguiste sumando el último salto (${a(3) - a(2)}) como si fuera fijo. Los saltos aumentan 8 en cada vuelta.`, respaldo: 'parcial', fuente: RM },
        h('RMP1-cuenta-el-uno', a(m - 1), `Contaste el 1 como el primer número de la línea. El primero es el vecino del 1, así que te quedaste un lugar antes.`),
        h('RMP1-un-lugar-mas', a(m + 1), 'Te pasaste un lugar: ese es el siguiente número de la línea.'),
      ];
      const dif = [a(2) - a(1), a(3) - a(2), a(4) - a(3)];
      return {
        datos, correcta, errores, variables,
        figura: { svg: svgEspiral(new Set([1, a(1), a(2)]), 0), alt: altEspiral + ` Resaltados: el 1, el ${a(1)} y el ${a(2)}, que están en línea ${nom} desde el 1.` },
        enunciado: [...base, ' Desde el 1, en línea ', v('r', nom), `, están los números ${a(1)}, ${a(2)}, ${a(3)}, …`],
        pregunta: ['Sin contar el 1, ¿qué número ocupa el lugar ', v('m', String(m)), ' de esa línea?'],
        solucion: [
          [`Los primeros números de la línea son ${a(1)}, ${a(2)}, ${a(3)}, ${a(4)}. Saltos: ${dif.join(', ')}. Cada salto es 8 más que el anterior, porque cada vuelta de la espiral tiene 8 casillas más.`],
          [`Con saltos que crecen de 8 en 8, el número del lugar j es de segundo grado: ${poli(a(2) - a(1) - 12, a(1) - 4 - (a(2) - a(1) - 12))}. Comprueba: con j = 1 da ${a(1)} y con j = 2 da ${a(2)}.`],
          ['Para j = ', v('m', String(m)), `: ${correcta}.`],
        ],
      };
    }
    const N = rng.entero(30, 160);
    const datos = { tipo: 'espiral', pide, rayo: null, m: 0, N };
    const correcta = perimetro(N);
    let rect = 1; for (let j = 1; j <= N; j++) { const s = Math.floor(Math.sqrt(j)); if (s * s === j || s * (s + 1) === j) rect = j; }
    const errores = [
      h('RMP1-lados-compartidos', 4 * N, 'Sumaste los 4 lados de cada casilla. Los lados que comparten dos casillas sombreadas quedan adentro y no son parte del perímetro.'),
      { id: 'AR7-de-uno-en-uno', valor: 12 + (N - 9), explicacion: 'Supusiste que el perímetro crece de uno en uno con cada casilla. Muchas casillas nuevas tapan un lado y agregan otro, y el perímetro no cambia; solo crece al empezar un lado nuevo de la espiral.', respaldo: 'parcial', fuente: RM },
      h('RMP28-como-recta', 2 * N + 2, `Calculaste como si las ${N} casillas estuvieran en fila. En la espiral se amontonan alrededor del 1 y comparten muchos más lados.`),
    ];
    if (rect !== N) errores.push(h('RMP27-sin-sobrante', perimetro(rect), `Ese es el perímetro hasta el ${rect}, donde la región es un rectángulo. Las casillas del ${rect + 1} al ${N} empiezan otro lado y lo agrandan.`));
    let x0 = 0, x1 = 0, y0 = 0, y1 = 0; for (let n = 1; n <= N; n++) { const [x, y] = posicionDe(n); x0 = Math.min(x0, x); x1 = Math.max(x1, x); y0 = Math.min(y0, y); y1 = Math.max(y1, y); }
    const ancho = x1 - x0 + 1, alto = y1 - y0 + 1;
    return {
      datos, correcta, errores, variables, texto: x => `${f(x)} cm`, unidad: 'cm',
      figura: { svg: svgEspiral(new Set(), 9), alt: altEspiral + ' Están sombreadas las casillas del 1 al 9, que forman un cuadrado de 3 por 3.' },
      enunciado: [...base, ' Cada casilla es un cuadrado de 1 cm de lado. Si se sombrean las casillas del 1 al ', v('e', '9'), ', la región sombreada es un cuadrado de 3 por 3, de ', v('e', '12 cm'), ' de perímetro.'],
      pregunta: ['Si se sombrean las casillas del 1 al ', v('m', String(N)), ', ¿cuál es el perímetro de la región sombreada?'],
      solucion: [
        [`Al recorrer la espiral, la región sombreada siempre es un rectángulo, a veces con una fila o columna incompleta pegada a un lado. Hasta el ${rect} es un rectángulo completo.`],
        [`La región del 1 al `, v('m', String(N)), ` cabe justa en un rectángulo de ${ancho} por ${alto} casillas${rect === N ? ' (es ese rectángulo)' : `: las casillas del ${rect + 1} al ${N} forman una fila o columna incompleta pegada a un lado`}.`],
        [rect === N ? '' : 'Una fila incompleta pegada a un lado agrega 2 cm al perímetro, igual que si estuviera completa: el perímetro es el del rectángulo que encierra la región. ',
          `Perímetro: 2 × (${ancho} + ${alto}) = ${correcta} cm.`],
      ],
    };
  };

  // ---- avance y retroceso ----
  const SUBEN = [
    ['Un caracol sube por un poste de ', 'De día sube ', ' y de noche resbala ', 'Empieza a subir el día 1 por la mañana desde el pie del poste.', 'a la punta del poste'],
    ['Una rana sale de un pozo de ', 'De día trepa ', ' y de noche resbala ', 'Empieza a trepar el día 1 por la mañana desde el fondo.', 'al borde del pozo'],
    ['Un gusano sube por una caña de la chacra de ', 'De día sube ', ' y de noche baja ', 'Empieza el día 1 por la mañana desde el suelo.', 'a la punta de la caña'],
  ];
  CONSTR.avance = function (rng) {
    const pide = rng.elegir(['dias', 'hora']);
    const a = rng.entero(3, 7), b = rng.entero(1, a - 1);
    const t1 = pide === 'hora' ? a * rng.elegir([5, 6, 8]) : null;
    if (t1 && t1 >= 60) return null;
    const H = pide === 'hora' ? rng.entero(3 * a, 7 * a) : rng.entero(4 * a, 12 * a);
    const datos = { tipo: 'avance', pide, H, a, b, t1 };
    const k = avance({ ...datos, pide: 'dias' });
    if (k < 4 || k > (pide === 'hora' ? 9 : 25)) return null;
    const neto = Math.ceil(H / (a - b));
    const variables = { H: { nombre: 'altura', color: 'o' }, a: { nombre: 'lo que sube', color: 'i' }, b: { nombre: 'lo que baja', color: 'h' }, t: { nombre: 'tiempo de subida', color: 'd' } };
    const falta = H - (k - 1) * (a - b);
    if (pide === 'dias') {
      const [ini, sube, baja, empieza, meta] = rng.elegir(SUBEN);
      const errores = [
        h('RMP29-avance-neto', neto, `Dividiste toda la altura entre el avance neto (${a} − ${b} = ${a - b} m por día). El último día llega arriba antes de que llegue la noche: ese día no resbala.`),
        h('RMP1-cuenta-noches', k - 1, `Contaste las noches, no los días. Después de ${k - 1} noches le falta un día más de subida.`),
        h('RMP29-sin-retroceso', Math.ceil(H / a), 'Olvidaste que cada noche resbala. Solo el último día no retrocede.'),
        h('RMP29-un-dia-de-mas', k + 1, `Diste un día de más: el día ${k} ya llega ${meta}.`),
      ];
      return {
        datos, correcta: k, errores, variables, texto: x => `El día ${x}`,
        enunciado: [ini, v('H', `${H} m`), ' de alto. ', sube, v('a', `${a} m`), baja, v('b', `${b} m`), `. ${empieza}`],
        pregunta: [`¿Qué día llega ${meta}?`],
        solucion: [
          ['Cada día completo (con su noche) avanza ', v('a', String(a)), ' − ', v('b', String(b)), ` = ${a - b} m. Pero el día en que llega no resbala.`],
          ['Le basta estar a ', v('a', `${a} m`), ' o menos de la meta al amanecer: ', v('H', String(H)), ' − ', v('a', String(a)), ` = ${H - a} m. Con ${a - b} m por día eso pide ${H - a} ÷ ${a - b} → ${k - 1} ${k - 1 === 1 ? 'día con su noche' : 'días con sus noches'} (redondeando hacia arriba).`],
          [`Al amanecer del día ${k} está a ${(k - 1) * (a - b)} m y ese día sube ${a} m: llega. Respuesta: el día ${k}.`],
        ],
      };
    }
    const correcta = avance(datos);
    const base = 8 * 60;
    const errores = [
      h('RMP29-avance-neto', neto * 60, `Dividiste toda la altura entre el avance neto por hora (${a - b} m). En la última hora llega arriba mientras sube y ya no resbala.`),
      h('RMP29-ultima-hora-completa', k * 60, 'Contaste la última hora completa. Llega antes de que termine la subida de esa hora, y ahí se detiene la cuenta.'),
      h('RMP29-subida-completa', (k - 1) * 60 + t1, `Contaste los ${t1} minutos de subida completos en la última hora. Solo le faltaban ${falta} m, y a ${t1 / a} min por metro tarda ${falta * t1 / a} min.`),
      h('RMP1-inicio-de-la-hora', (k - 1) * 60, 'Esa es la hora en que empieza la última subida, no la hora en que llega.'),
    ];
    return {
      datos, correcta, errores, variables, texto: x => reloj(base + x),
      enunciado: ['Un obrero sube con una cuerda por la pared de un pozo de ', v('H', `${H} m`), '. Cada hora hace lo mismo: durante los primeros ', v('t', `${t1} min`), ' sube ', v('a', `${a} m`),
        ' (a ritmo parejo) y en los minutos que quedan de esa hora descansa y resbala ', v('b', `${b} m`), '. Empieza a las 8:00 a. m. desde el fondo.'],
      pregunta: ['¿A qué hora llega al borde del pozo?'],
      solucion: [
        ['Cada hora completa avanza ', v('a', String(a)), ' − ', v('b', String(b)), ` = ${a - b} m, pero en la última hora llega mientras sube y ya no resbala.`],
        [`Le basta empezar una hora estando a ${a} m o menos del borde: ${H} − ${a} = ${H - a} m, que con ${a - b} m por hora pide ${k - 1} ${k - 1 === 1 ? 'hora completa' : 'horas completas'}. A las ${reloj(base + (k - 1) * 60)} está a ${(k - 1) * (a - b)} m del fondo.`],
        ['Le faltan ', `${falta} m`, '. Sube ', v('a', `${a} m`), ' en ', v('t', `${t1} min`), `, o sea ${t1 / a} min por metro: tarda ${falta} × ${t1 / a} = ${falta * t1 / a} min.`],
        [`Llega a las ${reloj(base + correcta)} (${correcta} min después de empezar).`],
      ],
    };
  };

  return {
    id: ID, titulo: 'Lo que se repite', generar,
    calc: { resolver, cancion: d => cancion(d), marca, encuentro, cifraEn, sumaCifras, ultimas, cicloUnidades, unidades, figura: d => claveFig(figura(d)), numeroEn, posicionDe, perimetro, rayo, avance, reloj },
  };
});
