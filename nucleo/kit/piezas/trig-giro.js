/*
 * Pieza «trig-giro» (19 nov 2026, etapa 5): cosas que giran, para la teoría de «Ángulo trigonométrico y sistemas de
 * medida» (contenido/teoria/trigonometria/angulo-trigonometrico.js). Dibujos de prueba (data-prueba): Gerson decide
 * después cuáles reemplaza (docs/plan-calidad.md, M4).
 *
 * Afirmación de la figura: el ángulo es el giro del objeto. El lado inicial es donde estaba su marca (punteado), el lado
 * final es donde quedó, y el arco con flecha dice el sentido y cuántas vueltas dio (más de una vuelta se abre en espiral).
 *
 * Fidelidad: el objeto se dibuja girado exactamente lo que dicen los giros; los ángulos, con su valor, positivos en
 * sentido antihorario. El lado inicial no tiene que ser el eje x (eso es la posición normal, otra unidad): cada objeto
 * tiene el suyo (el timón y el reloj, arriba; el transportador, a la derecha, donde está su cero).
 *
 * Objetos, vistos de frente o desde arriba; todos giran alrededor de su centro y tienen una marca:
 *   timon          el timón de una combi; la marca es una cinta en el aro, arriba cuando las llantas van derechas
 *   llave          la llave en cruz de un caño; la marca es el brazo pintado
 *   tapa           una tapa rosca; la marca es la flecha pintada en la tapa
 *   reloj          el reloj del aula; la marca es el minutero (horario: la hora que marca la aguja corta, que no se mueve)
 *   transportador  un transportador de vuelta entera con dos escalas: afuera, 360 grados sexagesimales (una rayita cada
 *                  10°); adentro, 400 grados centesimales (una rayita cada 10ᵍ). La marca es su aguja. El cero de las dos
 *                  escalas está a la derecha y crecen en sentido antihorario. El arco del giro va por dentro.
 *   rayos          figura de examen: rayos desde un vértice O, con sus letras, y arcos con flecha entre ellos
 *
 * datos = {
 *   objeto,
 *   inicial: 90,                       dirección del lado inicial en grados (0: derecha; 90: arriba). Por omisión, arriba
 *                                      (en el transportador, 0)
 *   giros: [{ mide: -270,              el giro, en grados con signo (antihorario +)
 *             de: 0,                   dónde empieza, en grados desde el lado inicial; por omisión, donde terminó el
 *                                      giro anterior (los giros se encadenan)
 *             texto: '−270°',          el rótulo (opcional); en: 'punta' | 'medio' | grados desde el lado inicial (dónde va)
 *             r: 98,                   radio del arco; color: 'h' (carmín, por omisión); punteado: true
 *             colorTexto: 'tinta',     el color del rótulo, si no es el del arco (lo que se pide va con «?» en tinta)
 *             total: true,             no mueve el objeto: es el resumen de otros giros (se dibuja desde el lado inicial)
 *             desde, hasta }],         pasos en que se ve (estado.paso)
 *   pos: -90 | [{ v, paso }],          cuánto está girado el objeto; por omisión, la suma de los giros que se ven
 *   rotulos: { inicial: 'lado inicial', final: 'lado final' },   nombres de los lados (opcional)
 *   nota: 'texto' | [{ t, paso }],     una línea arriba, al centro (opcional); notaColor
 *   horario: 2,                        solo el reloj: la hora de la aguja corta
 *   // solo «rayos»:
 *   vertice: 'O', rayos: [{ id: 'M', ang: 0, rotulo: 'M', largo }],
 *   giros: [{ de: 'M', a: 'N', sentido: 1 | -1, texto, r, en, color, desde, hasta }],   el arco va del rayo `de` al rayo `a`
 *   rectos: [['M', 'P']],              cuadradito del ángulo recto entre dos rayos
 * }
 * estado = { paso: 0..n, final }. Función pura de (datos, estado): sin ids, sin azar, sin reloj. Lienzo de 320 × 300.
 * Colores: currentColor (tinta) y var(--c-*); el halo de los rótulos, var(--card). El giro y su medida sexagesimal van en
 * carmín y la escala centesimal del transportador, en turquesa (regla de colores de la unidad); el objeto y los lados, en tinta.
 * Los rótulos buscan su sitio: junto a la punta de la flecha (o al medio del arco), corridos unos grados si ahí no caben
 * en el lienzo o pisarían una línea u otro rótulo.
 * Para las manijas: geometria(d, e) trae el centro, la posición de la marca y las líneas que un rótulo no debe pisar;
 * anguloDe(d, punto, { cerca }) da el giro del punto bajo el dedo (el más cercano a `cerca`, para pasar de la vuelta).
 */
(function (root, fabrica) {
  const nodo = typeof module === 'object' && module.exports;
  const Kit = nodo ? require('../kit.js') : root.Kit;
  const T = nodo ? require('../trazo.js') : root.Kit.trazo;
  const api = fabrica(Kit, T);
  Kit.registrar(api);
  if (nodo) module.exports = api;
})(typeof self !== 'undefined' ? self : this, function (Kit, T) {
  'use strict';
  const W = 320, H = 300, M = 4, C = [160, 150], RAD = Math.PI / 180;
  const K = 1.22;         // tamaño de los objetos: el timón mide 84 de radio y es lo más grande de la figura
  const RA = 98;          // radio donde empieza el arco de un objeto
  const PASO_ESPIRAL = 9; // lo que se abre el arco por cada vuelta, cuando pasa de una (20 en total, como mucho)
  const TAM = 16;
  const OBJETOS = ['timon', 'llave', 'tapa', 'reloj', 'transportador', 'rayos'];
  const RADIO = { timon: 69 * K, llave: 67 * K, tapa: 65 * K, reloj: 72 * K, transportador: 96 };
  const MARCA = { timon: 62 * K, llave: 58 * K, tapa: 46 * K, reloj: 52 * K, transportador: 78 };
  const n = T.n;
  const f = x => Kit.formatear(x, 2);
  const pt = (r, a, c = C) => [c[0] + r * Math.cos(a * RAD), c[1] - r * Math.sin(a * RAD)];
  const tinta = (g = 2, op) => `fill="none" stroke="currentColor" stroke-width="${g}" stroke-linejoin="round" stroke-linecap="round"${op !== undefined ? ` stroke-opacity="${op}"` : ''}`;
  const linea = (p, q, attrs) => `<line x1="${n(p[0])}" y1="${n(p[1])}" x2="${n(q[0])}" y2="${n(q[1])}" ${attrs}/>`;
  const poli = (ps, attrs, cerrar = true) => `<path d="M${ps.map(p => `${n(p[0])} ${n(p[1])}`).join('L')}${cerrar ? 'Z' : ''}" ${attrs}/>`;
  const circulo = (c, r, attrs) => `<circle cx="${n(c[0])}" cy="${n(c[1])}" r="${n(r)}" ${attrs}/>`;
  // Barra entre dos radios, en la dirección a, de semiancho w: sus cuatro esquinas.
  const barra = (r0, r1, a, w) => {
    const u = [Math.cos(a * RAD), -Math.sin(a * RAD)], v = [-u[1], u[0]];
    const q = (r, s) => [C[0] + u[0] * r + v[0] * s * w, C[1] + u[1] * r + v[1] * s * w];
    return [q(r0, -1), q(r1, -1), q(r1, 1), q(r0, 1)];
  };
  // El último valor cuyo paso ya llegó (un valor suelto vale siempre).
  const enPaso = (x, e) => {
    if (!Array.isArray(x)) return x;
    const p = e && e.final ? Infinity : (e && e.paso) || 0;
    let v;
    for (const it of x) if ((it.paso || 0) <= p) v = it.t !== undefined ? it.t : it.v;
    return v;
  };
  const visible = (g, e) => {
    if (e && e.final) return g.hasta === undefined || g.hasta === Infinity;
    const p = (e && e.paso) || 0;
    return (g.desde === undefined || g.desde <= p) && (g.hasta === undefined || g.hasta >= p);
  };
  // ¿El segmento p–q cruza la caja de centro (x, y), ancho w y alto h, agrandada en e? Recorte de Liang-Barsky.
  function cruza(p, q, b, e = 1.5) {
    const x0 = b.x - b.w / 2 - e, x1 = b.x + b.w / 2 + e, y0 = b.y - b.h / 2 - e, y1 = b.y + b.h / 2 + e;
    let t0 = 0, t1 = 1;
    const dx = q[0] - p[0], dy = q[1] - p[1];
    for (const [pp, qq] of [[-dx, p[0] - x0], [dx, x1 - p[0]], [-dy, p[1] - y0], [dy, y1 - p[1]]]) {
      if (pp === 0) { if (qq < 0) return false; continue; }
      const r = qq / pp;
      if (pp < 0) { if (r > t1) return false; if (r > t0) t0 = r; } else { if (r < t0) return false; if (r < t1) t1 = r; }
    }
    return true;
  }
  const sePisan = (a, b) => Math.abs(a.x - b.x) < (a.w + b.w) / 2 + 2 && Math.abs(a.y - b.y) < (a.h + b.h) / 2 + 1;

  // ---------- Los objetos: cada uno se dibuja con su marca en la dirección a ----------
  const k = x => x * K;
  function timon(a) {
    let s = circulo(C, k(62), `fill="none" stroke="currentColor" stroke-width="${n(k(12))}" stroke-opacity="0.16"`) + circulo(C, k(68), tinta(2)) + circulo(C, k(56), tinta(2));
    for (const g of [90, 180, 270]) s += poli(barra(k(16), k(56), a + g, k(5)), 'fill="currentColor" fill-opacity="0.16" stroke="currentColor" stroke-width="2" stroke-linejoin="round"');
    s += circulo(C, k(17), 'fill="var(--card)" stroke="currentColor" stroke-width="2"') + circulo(C, k(5), 'fill="currentColor" fill-opacity="0.5"');
    // El lado final: del centro a la cinta.
    s += linea(pt(k(17), a), pt(k(55), a), tinta(2));
    // La cinta, atravesada en el aro.
    s += poli(barra(k(54.5), k(69.5), a, k(5.5)), 'fill="currentColor" stroke="var(--card)" stroke-width="1.5" stroke-linejoin="round"');
    return s;
  }
  function llave(a) {
    let s = circulo(C, k(27), 'fill="currentColor" fill-opacity="0.1" stroke="currentColor" stroke-width="2"');
    for (const g of [90, 180, 270, 0]) {
      s += poli(barra(k(9), k(56), a + g, k(6.5)), 'fill="var(--card)" stroke="currentColor" stroke-width="2" stroke-linejoin="round"');
      s += circulo(pt(k(58), a + g), k(9), g === 0 ? 'fill="currentColor" stroke="var(--card)" stroke-width="1.5"' : 'fill="var(--card)" stroke="currentColor" stroke-width="2"');
    }
    s += circulo(C, k(8), 'fill="var(--card)" stroke="currentColor" stroke-width="2"');
    return s;
  }
  function tapa(a) {
    let s = circulo(C, k(58), 'fill="currentColor" fill-opacity="0.1" stroke="currentColor" stroke-width="2"');
    for (let g = 0; g < 24; g++) s += linea(pt(k(58), a + 7.5 + g * 15), pt(k(65) - 1, a + 7.5 + g * 15), tinta(2));
    s += circulo(C, k(44), tinta(1, 0.6));
    // La flecha pintada en la tapa: un triángulo que apunta hacia fuera.
    const u = pt(k(52), a), b = barra(k(26), k(26), a, k(9));
    s += poli([u, b[0], b[3]], 'fill="currentColor" stroke="var(--card)" stroke-width="1.5" stroke-linejoin="round"');
    return s;
  }
  function reloj(a, d, girado) {
    let s = circulo(C, k(70), 'fill="none" stroke="currentColor" stroke-width="4" stroke-opacity="0.45"') + circulo(C, k(66), 'fill="var(--card)" stroke="currentColor" stroke-width="2"');
    for (let g = 0; g < 12; g++) s += linea(pt(k(g % 3 ? 59 : 55), g * 30), pt(k(63), g * 30), tinta(g % 3 ? 1.5 : 3));
    if (Number.isFinite(d.horario)) s += linea(C, pt(k(32), 90 - 30 * d.horario), tinta(5));
    // El minutero donde empezó, punteado, si ya giró.
    if (girado) s += linea(C, pt(k(52), d.inicial === undefined ? 90 : d.inicial), 'stroke="currentColor" stroke-width="2" stroke-dasharray="4 5" stroke-linecap="round" stroke-opacity="0.7"');
    s += linea(C, pt(k(52), a), tinta(3.5)) + circulo(C, 4.5, 'fill="currentColor"');
    return s;
  }
  // El transportador: dos anillos de rayitas y su aguja. Los números de los cuartos de vuelta van afuera, uno sobre otro.
  const CUARTOS = [[0, '0°', '0ᵍ'], [90, '90°', '100ᵍ'], [180, '180°', '200ᵍ'], [270, '270°', '300ᵍ']];
  function cuartos() {
    const out = [];
    for (const [a, s, c] of CUARTOS) {
      const u = [Math.cos(a * RAD), -Math.sin(a * RAD)], w = Math.max(T.ancho(s, 14, 600), T.ancho(c, 14, 600)), h = 15;
      const dist = 101 + Math.abs(u[0]) * w / 2 + Math.abs(u[1]) * h, cx = C[0] + u[0] * dist, cy = C[1] + u[1] * dist;
      out.push({ x: cx, y: cy - h / 2, w: T.ancho(s, 14, 600), h, texto: s, color: 'h', tam: 14 }, { x: cx, y: cy + h / 2, w: T.ancho(c, 14, 600), h, texto: c, color: 'i', tam: 14 });
    }
    return out;
  }
  function transportador(a) {
    let s = circulo(C, 96, 'fill="currentColor" fill-opacity="0.05" stroke="currentColor" stroke-width="2"') + circulo(C, 72, tinta(1, 0.5));
    for (let g = 0; g < 36; g++) s += linea(pt(g % 9 ? 88 : 83, g * 10), pt(95, g * 10), `stroke="var(--c-h)" stroke-width="${g % 9 ? 1.5 : 3}" stroke-linecap="round"`);
    for (let g = 0; g < 40; g++) s += linea(pt(g % 10 ? 65 : 60, g * 9), pt(71, g * 9), `stroke="var(--c-i)" stroke-width="${g % 10 ? 1.5 : 3}" stroke-linecap="round"`);
    // La aguja, con su punta entre los dos anillos.
    s += linea(C, pt(78, a), tinta(3)) + circulo(C, 5, 'fill="currentColor"');
    return s;
  }
  const CUERPO = { timon, llave, tapa, reloj, transportador };

  // ---------- Los giros ----------
  // Puntos del arco que va de a0 a a0 + mide (grados), con radio r0; si pasa de una vuelta, en espiral hacia fuera.
  function arco(c, r0, a0, mide, espiral = true) {
    const vueltas = Math.abs(mide) / 360, paso = espiral && vueltas > 1 ? Math.min(PASO_ESPIRAL, 20 / vueltas) : 0, s = Math.sign(mide) || 1;
    const rEn = t => r0 + paso * Math.abs(t) / 360;
    const fin = a0 + mide, rFin = rEn(mide);
    // La línea termina un poco antes de la punta de la flecha (la punta mide 10).
    const corta = Math.min(Math.abs(mide) / 2, 9 / (rFin * RAD));
    const N = Math.max(2, Math.ceil((Math.abs(mide) - corta) / 5));
    const ps = [];
    for (let i = 0; i <= N; i++) { const t = s * (Math.abs(mide) - corta) * i / N; ps.push(pt(rEn(t), a0 + t, c)); }
    const punta = pt(rFin, fin, c), base = ps[ps.length - 1];
    const L = Math.hypot(punta[0] - base[0], punta[1] - base[1]) || 1, u = [(punta[0] - base[0]) / L, (punta[1] - base[1]) / L], v = [-u[1], u[0]];
    const B = [punta[0] - u[0] * 10, punta[1] - u[1] * 10];
    const cabeza = [punta, [B[0] + v[0] * 5, B[1] + v[1] * 5], [B[0] - v[0] * 5, B[1] - v[1] * 5]];
    return { ps, cabeza, fin, rFin, rEn };
  }
  // Caja de un rótulo centrado a `dist` del centro c en la dirección a (hacia fuera, o hacia dentro con hacia = −1).
  function caja(c, a, dist, texto, hacia = 1, tam = TAM) {
    const w = T.ancho(texto, tam, 600), h = tam * 1.05, u = [Math.cos(a * RAD), -Math.sin(a * RAD)];
    const ext = Math.abs(u[0]) * w / 2 + Math.abs(u[1]) * h / 2;
    return { x: c[0] + u[0] * (dist + hacia * ext), y: c[1] + u[1] * (dist + hacia * ext), w, h, texto, tam };
  }
  const cabe = b => b.x - b.w / 2 >= M + 2 && b.x + b.w / 2 <= W - M - 2 && b.y - b.h / 2 >= M + 2 && b.y + b.h / 2 <= H - M - 2;
  const alLienzo = b => Object.assign(b, { x: Math.min(W - M - 2 - b.w / 2, Math.max(M + 2 + b.w / 2, b.x)), y: Math.min(H - M - 2 - b.h / 2, Math.max(M + 2 + b.h / 2, b.y)) });
  // El primer sitio, entre los candidatos, donde el rótulo cabe sin pisar una línea ni otro rótulo; si ninguno, el primero.
  function sitio(candidatos, lineas, puestos) {
    for (const b of candidatos) if (cabe(b) && !lineas.some(([p, q]) => cruza(p, q, b)) && !puestos.some(o => sePisan(o, b))) return b;
    return alLienzo(candidatos[0]);
  }
  const rotulo = (b, color) => T.rotulo(b.x, b.y + (b.tam || TAM) * 0.28, b.texto, { ancla: 'middle', peso: 600, color, tam: b.tam || TAM, min: M, max: W - M })
    .replace('<text ', '<text stroke="var(--card)" stroke-width="4" stroke-linejoin="round" paint-order="stroke" ');

  // Todo lo que se calcula de (datos, estado): lo usan dibujar, las manijas y la prueba de encuadre.
  function geometria(d = {}, e = {}) {
    const objeto = OBJETOS.includes(d.objeto) ? d.objeto : 'timon';
    const esRayos = objeto === 'rayos', esTransp = objeto === 'transportador';
    const c = C, ini = esRayos ? 0 : d.inicial === undefined ? (esTransp ? 0 : 90) : d.inicial;
    const rayos = esRayos ? (d.rayos || []).map(r => ({ id: r.id, ang: r.ang, rotulo: r.rotulo === undefined ? r.id : r.rotulo, largo: r.largo || 108 })) : [];
    const angDe = id => { const r = rayos.find(x => x.id === id); return r ? r.ang : 0; };
    const lineas = [], arcos = [];
    let cursor = 0, suma = 0;
    for (const g of d.giros || []) {
      let a0, mide;
      if (esRayos) {
        a0 = angDe(g.de);
        const dif = ((angDe(g.a) - a0) % 360 + 360) % 360;
        mide = (g.sentido || 1) > 0 ? (dif || 360) : -((360 - dif) % 360 || 360);
      } else {
        mide = g.mide || 0;
        a0 = ini + (g.total ? 0 : g.de !== undefined ? g.de : cursor);
        if (!g.total) cursor = (g.de !== undefined ? g.de : cursor) + mide;
      }
      const ve = visible(g, e);
      if (ve && !g.total && !esRayos) suma += mide;
      if (!ve || !mide) continue;
      // En el transportador, un giro de casi una vuelta deja poco sitio libre para su rótulo: el arco va más afuera y el
      // rótulo, dentro de él, del lado contrario a la aguja.
      const casiVuelta = esTransp && g.en === undefined && 360 - Math.abs(mide) < 70;
      const A = arco(c, g.r || (esRayos ? 40 : esTransp ? (casiVuelta ? 52 : 34) : RA), a0, mide, !esTransp);
      arcos.push({ g, A, b: null, a0, mide });
      for (let i = 1; i < A.ps.length; i++) lineas.push([A.ps[i - 1], A.ps[i]]);
      lineas.push([A.ps[A.ps.length - 1], A.cabeza[0]]);
    }
    const posDada = enPaso(d.pos, e);
    const pos = esRayos ? 0 : Number.isFinite(posDada) ? posDada : suma;
    const radio = esRayos ? 0 : RADIO[objeto];
    const mismo = (x, y) => Math.abs((((x - y) % 360) + 540) % 360 - 180) < 1e-6;
    // Radio donde termina el arco que llega a la marca (el lado final se alarga hasta él) y donde nace el primero.
    const rFinal = esTransp ? 0 : arcos.reduce((m, x) => (mismo(x.A.fin, ini + pos) ? Math.max(m, x.A.rFin) : m), 0);
    const rInicial = esTransp ? 0 : arcos.reduce((m, x) => (mismo(x.a0, ini) ? Math.max(m, x.g.r || RA) : m), 0);
    // El lado inicial, punteado: de la marca del objeto hacia fuera, hasta pasar el arco. Se ve desde que hay un giro.
    // Desde cerca del centro (revisión de la sesión, 19 nov: corto, no se leía como el lado de un ángulo).
    const ladoIni = !esRayos && !esTransp && rInicial ? [pt(objeto === 'reloj' ? MARCA.reloj - 8 : k(19), ini), pt(rInicial + 14, ini)] : null;
    if (!esRayos) {
      // El contorno del objeto, como polígono de 36 lados, para que ningún rótulo lo pise.
      for (let g = 0; g < 36; g++) lineas.push([pt(radio, g * 10), pt(radio, g * 10 + 10)]);
      if (ladoIni) lineas.push(ladoIni);
      if (rFinal) lineas.push([pt(radio, ini + pos), pt(rFinal, ini + pos)]);
      if (esTransp) lineas.push([c, pt(78, ini + pos)]);
    } else for (const r of rayos) lineas.push([c, pt(r.largo, r.ang)]);
    // --- Rótulos: primero los fijos (letras, números del transportador, nota); después, los de los giros ---
    const fijos = [], nombres = [];
    if (esTransp) fijos.push(...cuartos());
    if (esRayos) {
      for (const r of rayos) if (r.rotulo) nombres.push(alLienzo(caja(c, r.ang, r.largo + 5, r.rotulo)));
      if (d.vertice !== '' && rayos.length) {
        // La letra del vértice va en el hueco más ancho entre dos rayos, cerca del centro.
        const as = rayos.map(r => ((r.ang % 360) + 360) % 360).sort((x, y) => x - y);
        let mejor = 0, gap = -1;
        for (let i = 0; i < as.length; i++) { const sig = i + 1 < as.length ? as[i + 1] : as[0] + 360; if (sig - as[i] > gap) { gap = sig - as[i]; mejor = as[i] + (sig - as[i]) / 2; } }
        nombres.push(caja(c, mejor, 7, d.vertice || 'O'));
      }
    }
    const nota = enPaso(d.nota, e);
    const cajaNota = nota ? { x: W / 2, y: M + 2 + TAM * 0.55, w: T.ancho(String(nota), TAM, 600), h: TAM * 1.05, texto: String(nota), tam: TAM } : null;
    const puestos = fijos.concat(nombres, cajaNota ? [cajaNota] : []);
    if (!esRayos && d.rotulos) {
      const s1 = Math.sign(((d.giros || [])[0] || {}).mide || 1);
      if (d.rotulos.inicial) {
        // Junto a la punta del lado inicial, del lado contrario al primer giro, para no pisar su arco.
        const w = T.ancho(d.rotulos.inicial, TAM, 600), h = TAM * 1.05, p = pt(Math.max(rInicial, RA) + 4, ini), dir = ini - 90 * s1;
        const b = alLienzo({ x: p[0] + Math.cos(dir * RAD) * (w / 2 + 8), y: p[1] - Math.sin(dir * RAD) * (w / 2 + 8), w, h, texto: d.rotulos.inicial, tam: TAM });
        nombres.push(b); puestos.push(b);
      }
      if (d.rotulos.final) { const b = sitio([0, 12, -12, 24, -24, 36, -36].map(o => caja(c, ini + pos + o * s1, Math.max(rFinal, radio) + 9, d.rotulos.final)), lineas, puestos); nombres.push(b); puestos.push(b); }
    }
    for (const x of arcos) {
      const texto = enPaso(x.g.texto, e);
      if (!texto) continue;
      const g = x.g, A = x.A, s = Math.sign(x.mide), dentro = g.dentro ? -1 : 1;
      const en = g.en === undefined ? (esTransp ? 'libre' : esRayos ? 'medio' : 'punta') : g.en;
      if (en === 'libre') {
        // En el transportador el rótulo va dentro, cerca del centro, en el sector que el giro deja libre; si el giro es
        // de casi una vuelta, dentro del arco, del lado contrario a la aguja.
        const libre = x.a0 + x.mide + s * (360 - Math.abs(x.mide)) / 2;
        const cand = 360 - Math.abs(x.mide) < 70
          ? [0, 20, -20, 40, -40].flatMap(o => [3, 6].map(dd => caja(c, x.a0 + x.mide + 180 + o, dd, String(texto), 1, 14)))
          : [0, 15, -15, 30, -30, 45, -45, 60, -60].map(o => caja(c, libre + o, 16, String(texto), 1));
        x.b = sitio(cand, lineas, puestos);
        puestos.push(x.b);
        continue;
      }
      const a = en === 'punta' ? A.fin : en === 'medio' ? x.a0 + x.mide / 2 : ini + en;
      const r = en === 'punta' ? A.rFin : A.rEn(Math.min(Math.abs(x.mide), Math.abs(a - x.a0)));
      // Candidatos: en su sitio y corridos de 12° en 12°; en la punta, primero hacia delante (donde ya no hay arco).
      const corr = en === 'punta' ? [0, 12, -12, 24, -24, 36, -36, 48, -48, 60, -60] : [0, 10, -10, 20, -20, 30, -30, 40, -40];
      x.b = sitio(corr.map(o => caja(c, a + o * s, r + dentro * 9, String(texto), dentro)), lineas, puestos);
      puestos.push(x.b);
    }
    const cajas = arcos.filter(x => x.b).map(x => x.b).concat(nombres, fijos, cajaNota ? [cajaNota] : []);
    return { objeto, c, ini, pos, radio, rayos, arcos, lineas, cajas, nombres, fijos, cajaNota, rFinal, rInicial, ladoIni, marca: esRayos ? c : pt(MARCA[objeto], ini + pos) };
  }

  function dibujar(datos = {}, estado = {}) {
    const d = datos, g = geometria(d, estado);
    let s = '';
    if (g.objeto === 'rayos') {
      for (const [p, q] of d.rectos || []) {
        const a = (g.rayos.find(r => r.id === p) || {}).ang || 0, b = (g.rayos.find(r => r.id === q) || {}).ang || 0, L = 11;
        s += poli([pt(L, a), [pt(L, a)[0] + pt(L, b)[0] - C[0], pt(L, a)[1] + pt(L, b)[1] - C[1]], pt(L, b)], tinta(1.5), false);
      }
      for (const r of g.rayos) s += linea(C, pt(r.largo, r.ang), tinta(2));
      s += circulo(C, 3, 'fill="currentColor"');
    } else {
      const cuerpo = CUERPO[g.objeto](g.ini + g.pos, d, Math.abs(g.pos) > 1e-9);
      s += `<g class="kit-objeto" data-objeto="${g.objeto}" data-prueba="si">${cuerpo}</g>`;
      // Lado inicial, punteado y con halo (cruza el aro del objeto); lado final, hasta donde termina el arco.
      if (g.ladoIni) s += linea(g.ladoIni[0], g.ladoIni[1], 'stroke="var(--card)" stroke-width="5" stroke-linecap="round"') + linea(g.ladoIni[0], g.ladoIni[1], 'stroke="currentColor" stroke-width="2.5" stroke-dasharray="5 5" stroke-linecap="round"');
      if (g.rFinal) s += linea(pt(g.radio, g.ini + g.pos), pt(g.rFinal, g.ini + g.pos), tinta(2));
    }
    for (const x of g.arcos) {
      const col = T.color(x.g.color === undefined ? 'h' : x.g.color);
      s += poli(x.A.ps, `fill="none" stroke="${col}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"${x.g.punteado ? ' stroke-dasharray="6 5"' : ''}`, false);
      s += poli(x.A.cabeza, `fill="${col}" stroke="${col}" stroke-width="1.5" stroke-linejoin="round"`);
    }
    for (const b of g.fijos) s += rotulo(b, b.color);
    for (const x of g.arcos) if (x.b) s += rotulo(x.b, x.g.colorTexto !== undefined ? x.g.colorTexto : x.g.color === undefined ? 'h' : x.g.color);
    for (const b of g.nombres) s += rotulo(b);
    if (g.cajaNota) s += rotulo(g.cajaNota, d.notaColor);
    return T.svg(W, H, s, { alt: alt(d) });
  }

  const sentido = m => (m > 0 ? 'antihorario' : 'horario');
  const NOMBRE = { timon: 'Timón de una combi con una cinta en el aro', llave: 'Llave en cruz de un caño, con un brazo pintado', tapa: 'Tapa rosca vista desde arriba, con una flecha pintada', reloj: 'Reloj de pared con su minutero',
    transportador: 'Transportador de vuelta entera con dos escalas, la de afuera en grados sexagesimales y la de adentro en grados centesimales, y su aguja' };
  function alt(d = {}) {
    if (d.alt) return d.alt;
    const g = geometria(d, { final: true });
    if (g.objeto === 'rayos') {
      const v = d.vertice || 'O';
      return `Rayos ${g.rayos.map(r => v + r.rotulo).join(', ')} desde el vértice ${v}` + (g.arcos.length ? ', con ' + g.arcos.map(x => `un ángulo ${sentido(x.mide)} de ${v}${x.g.de} a ${v}${x.g.a}${x.b ? ` rotulado ${x.b.texto}` : ''}`).join(' y ') : '') + '.';
    }
    const partes = g.arcos.map(x => `un giro ${sentido(x.mide)}${x.b ? ` rotulado ${x.b.texto}` : ` de ${f(Math.abs(x.mide))} grados`}`);
    return `${NOMBRE[g.objeto]}${partes.length ? `: ${partes.join(' y ')}, desde ${g.objeto === 'transportador' ? 'el cero' : 'el lado inicial punteado'}` : ', en su posición inicial'}.`;
  }

  // El giro (en grados desde el lado inicial) del punto bajo el dedo; con `cerca`, la vuelta más próxima a ese valor.
  function anguloDe(d, p, o = {}) {
    const g = geometria(d, {}), a = Math.atan2(g.c[1] - p.y, p.x - g.c[0]) / RAD - g.ini;
    const cerca = o.cerca === undefined ? 0 : o.cerca;
    return a + 360 * Math.round((cerca - a) / 360);
  }

  return { id: 'trig-giro', dibujar, alt, geometria, anguloDe, OBJETOS, constantes: { W, H, M, C, RA } };
});
