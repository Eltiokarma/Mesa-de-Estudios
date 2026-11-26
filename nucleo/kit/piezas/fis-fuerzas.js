/*
 * Pieza «fis-fuerzas» (16 nov 2026): objetos de la vida real con sus fuerzas, velocidades o desplazamientos, para los
 * ejemplos resueltos de Vectores (pestaña «Ejemplos», docs/teoria.md 4h). Dibujos de prueba (data-prueba): Gerson decide
 * después cuáles reemplaza (docs/plan-calidad.md, M4).
 *
 * Afirmación de la figura: la flecha sale del objeto que la siente, y su largo es su módulo en la misma escala que
 * las otras flechas del dibujo.
 *
 * Fidelidad: una sola escala (px por unidad) para todas las flechas de una figura; el ángulo dibujado es el de los
 * datos (antihorario desde +x, y hacia arriba). La escala sale sola: la flecha más larga mide unos `largo` px y todo
 * entra en el lienzo con 6 px de margen.
 *
 * datos = {
 *   objeto: 'caja' | 'nudo' | 'bote' | 'avion' | 'llave' | 'carretilla' | 'cuadras',
 *   flechas: [{ ang: 37, mod: 50,            // o a: [x, y] (unidades): la punta
 *               de: [x, y],                  // unidades, desde el punto de apoyo (para encadenar cola con punta)
 *               desde: 'punta' | [px, py],   // punto de apoyo: uno con nombre del objeto o px desde su centro
 *               color: 'o', rotulo: 'A', valor: '50 N', discontinua: false, rotuloEn: 0.55, lado: 1 | -1 }],
 *   angulos: [{ en: [x, y] | nombre, de: 0, a: 37, texto: '37°', color: 'h', radio: 24 }],  // grados, antihorario
 *   guias: [{ de: [x, y], a: [x, y], color }],                 // discontinuas, en unidades
 *   marcas: [{ en: [x, y], texto: 'Isla' }],                    // un punto con nombre, en unidades
 *   fuera: [{ en: [x, y] | nombre, sentido: 'sale' | 'entra', rotulo, color }],  // ⊙ y ⊗
 *   texto: '50 kg',                                             // escrito sobre el objeto (caja, carretilla, nudo)
 *   largo: 110,                                                 // px que mide la flecha más larga (tope)
 *   // propios de cada objeto:
 *   caja:       { rampa: 37 }                                   // la caja sobre una rampa de ese ángulo
 *   bote:       { rumbo: 90, orillas: false, ancho: 'Río de 80 m de ancho' }   // orillas: un río que corre a la derecha
 *   avion:      { rumbo: 90 }                                   // hacia dónde apunta la nariz
 *   llave:      { angLlave: 0, cota: 'r = 0,3 m' }              // punto con nombre: 'punta' (donde va la mano)
 *   carretilla: {}                                              // puntos con nombre: 'manijas', 'piso'
 *   cuadras:    { tramos: [{ dir: 'E'|'N'|'O'|'S', n: 3, color, rotulo, valor }], rejilla: true,
 *                 resultante: { rotulo: 'R', valor: '500 m' }, inicio: 'Paradero', fin: 'Casa', plaza: [i, j] }
 * }
 * Notación (17 nov, auditoría de Vectores): el rótulo puede traer la flecha de vector («A⃗»); con valor («A = 50 N»)
 * el valor es el módulo y la flecha se quita. «A_x» se dibuja con la x como subíndice (<tspan>); «ₓ» y «ᵧ» (una gamma)
 * pasan a esa forma. Si dos flechas terminan en el mismo punto (cola con punta), la de después se acorta 14 px en su
 * punta para que no se enciman, y el rótulo de un ángulo se aleja de las flechas que salen de su vértice.
 * estado = {} (sin pasos). Función pura de (datos, estado): sin ids, sin azar, sin reloj. Alto fijo (240).
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
  const W = 320, H = 240, M = 6, TAM = 15;
  const n = T.n;
  const rad = g => g * Math.PI / 180;
  const cosG = g => (((g % 180) + 180) % 180 === 90 ? 0 : Math.cos(rad(g)));
  const senG = g => (((g % 180) + 180) % 180 === 0 ? 0 : Math.sin(rad(g)));
  const tinta = (g = 2) => `stroke="currentColor" stroke-width="${g}" stroke-linejoin="round" stroke-linecap="round"`;
  const obj = (nombre, s) => `<g class="kit-objeto" data-objeto="${nombre}" data-prueba="si">${s}</g>`;
  // Un vector de unidades a px de pantalla (y hacia abajo): x = s·ux, y = −s·uy.
  const aPx = (u, s) => [u[0] * s, -u[1] * s];
  // Gira un punto (px) un ángulo antihorario visto en pantalla.
  const girar = (p, g) => { const c = cosG(g), sn = senG(g); return [p[0] * c + p[1] * sn, -p[0] * sn + p[1] * c]; };
  const camino = (pts, g, o = [0, 0]) => 'M' + pts.map(p => { const q = girar(p, g); return `${n(o[0] + q[0])} ${n(o[1] + q[1])}`; }).join('L') + 'Z';
  const DIR = { E: [1, 0], N: [0, 1], O: [-1, 0], S: [0, -1] };
  // Un color fijo por magnitud (docs/molde-unidad.md §5b, 17 nov): el primer tramo naranja, el segundo turquesa, el tercero
  // verde; el cuarto va en tinta (el carmín es del ángulo y el violeta, de la resultante, lo que se pide).
  const COLORES_TRAMO = ['o', 'i', 'd', 't'];

  // ---------- Los objetos ----------
  // forma(d) → { ext: [x0, y0, x1, y1] en px desde el centro, puntos: { nombre: [px, py] }, area?, abajo? }
  // fondo(d, g) y cuerpo(d, g): SVG; g = { ax, ay, s, P(u) → px absolutos }.
  const OBJETOS = {
    caja: {
      forma(d) {
        if (!Number.isFinite(d.rampa)) return { ext: [-34, -24, 34, 24], puntos: {}, piso: 24 };
        const r = rampa(d.rampa);
        return { ext: [Math.min(-30, r.bi[0]), Math.min(-30, r.ar[1]), Math.max(30, r.ar[0]), Math.max(30, r.bi[1] + 4)], puntos: {} };
      },
      fondo(d, g) {
        if (Number.isFinite(d.rampa)) {
          const r = rampa(d.rampa), P = q => [g.ax + q[0], g.ay + q[1]];
          const [a, b, c] = [P(r.bi), P(r.ar), P(r.bd)];
          let s = `<path d="M${n(a[0])} ${n(a[1])}L${n(b[0])} ${n(b[1])}L${n(c[0])} ${n(c[1])}Z" fill="currentColor" fill-opacity="0.07" ${tinta()}/>`;
          s += `<path d="M${n(a[0] + 30)} ${n(a[1])}A30 30 0 0 0 ${n(a[0] + 30 * cosG(d.rampa))} ${n(a[1] - 30 * senG(d.rampa))}" fill="none" ${tinta(1.5)}/>`;
          s += T.rotulo(a[0] + 36, a[1] - 6, `${Kit.formatear(d.rampa, 0)}°`, { tam: 14, peso: 700, min: 4, max: W - 4 });
          return obj('rampa', s);
        }
        return `<line class="kit-piso" x1="4" y1="${n(g.ay + 24)}" x2="${W - 4}" y2="${n(g.ay + 24)}" ${tinta()}/>`
          + `<line x1="4" y1="${n(g.ay + 28)}" x2="${W - 4}" y2="${n(g.ay + 28)}" stroke="currentColor" stroke-opacity="0.2" stroke-width="4"/>`;
      },
      cuerpo(d, g) {
        const r = Number.isFinite(d.rampa) ? d.rampa : 0, a = r ? 28 : 34, b = r ? 22 : 24;
        let s = `<path d="${camino([[-a, -b], [a, -b], [a, b], [-a, b]], r, [g.ax, g.ay])}" fill="var(--c-f)" fill-opacity="0.22" ${tinta()}/>`;
        s += `<path d="M${(() => { const p = girar([-a, -8], r), q = girar([a, -8], r); return `${n(g.ax + p[0])} ${n(g.ay + p[1])}L${n(g.ax + q[0])} ${n(g.ay + q[1])}`; })()}" stroke="currentColor" stroke-opacity="0.35" stroke-width="1.5"/>`;
        return obj('caja', s);
      },
      // El texto de la caja, abajo y del lado contrario a donde salen las flechas (no lo cruzan).
      texto: d => d.texto, textoEn: d => { const sx = (d.flechas || []).reduce((t, f) => t + (Number.isFinite(f.ang) ? cosG(f.ang) : 0), 0); return [Math.abs(sx) < 0.2 ? 0 : sx > 0 ? -12 : 12, 18]; },
      nombre: d => (Number.isFinite(d.rampa) ? `una caja sobre una rampa de ${Kit.formatear(d.rampa, 0)}°` : 'una caja sobre el piso'),
    },
    nudo: {
      forma: () => ({ ext: [-8, -8, 8, 8], puntos: {} }),
      fondo(d, g) {
        // Las cuerdas: una línea fina que sigue a cada flecha y se pasa un poco de su punta.
        let s = '';
        for (const f of g.fl) {
          if (f.f.desde || f.f.hasta || f.f.de || f.f.discontinua || f.f.cuerda === false) continue;
          const L = Math.hypot(f.p1[0] - f.p0[0], f.p1[1] - f.p0[1]); if (L < 1) continue;
          const ux = (f.p1[0] - f.p0[0]) / L, uy = (f.p1[1] - f.p0[1]) / L, e = Math.min(18, L * 0.25);
          s += `<line x1="${n(f.p0[0])}" y1="${n(f.p0[1])}" x2="${n(f.p1[0] + ux * e)}" y2="${n(f.p1[1] + uy * e)}" stroke="currentColor" stroke-opacity="0.45" stroke-width="5" stroke-linecap="round"/>`;
          // 26 nov (dibujos reconocibles): las hebras torcidas de la soga, en el tramo que asoma después de la punta.
          s += `<line x1="${n(f.p1[0] + ux * 2)}" y1="${n(f.p1[1] + uy * 2)}" x2="${n(f.p1[0] + ux * (e - 1))}" y2="${n(f.p1[1] + uy * (e - 1))}" stroke="var(--card)" stroke-opacity="0.7" stroke-width="5" stroke-dasharray="1.5 2.5"/>`;
        }
        return `<g class="kit-cuerdas">${s}</g>`;
      },
      // El nudo (26 nov, dibujos reconocibles): dos lazadas de soga cruzadas y apretadas, no un círculo con un punto.
      cuerpo: (d, g) => obj('nudo', `<ellipse cx="${n(g.ax - 2)}" cy="${n(g.ay)}" rx="8" ry="5" transform="rotate(35 ${n(g.ax - 2)} ${n(g.ay)})" fill="var(--card)" ${tinta(2.5)}/>`
        + `<ellipse cx="${n(g.ax + 2)}" cy="${n(g.ay)}" rx="8" ry="5" transform="rotate(-35 ${n(g.ax + 2)} ${n(g.ay)})" fill="var(--card)" ${tinta(2.5)}/>`
        + `<path d="M${n(g.ax - 4)} ${n(g.ay - 3)}L${n(g.ax + 4)} ${n(g.ay + 3)}" ${tinta(2)}/>`),
      nombre: () => 'un nudo donde se juntan las cuerdas',
    },
    bote: {
      forma: d => (d.orillas ? { ext: [-26, -26, 26, 26], puntos: {}, area: [M, 46, W - M, H - 30], abajo: true } : { ext: [-26, -26, 26, 26], puntos: {} }),
      fondo(d, g) {
        if (d.orillas) {
          const yb = Math.min(H - 6, g.ay + 28);
          let s = `<rect x="0" y="32" width="${W}" height="${n(yb - 32)}" fill="var(--c-i)" fill-opacity="0.12"/>`;
          for (let k = 0; k < 3; k++) { const y = 54 + k * ((yb - 64) / 2); s += `<path d="M${16 + k * 30} ${n(y)}q8 -5 16 0t16 0" fill="none" stroke="var(--c-i)" stroke-opacity="0.5" stroke-width="1.5"/>`; }
          s += `<rect x="0" y="0" width="${W}" height="32" fill="var(--c-d)" fill-opacity="0.2"/><line x1="0" y1="32" x2="${W}" y2="32" ${tinta()}/>`;
          s += `<rect x="0" y="${n(yb)}" width="${W}" height="${n(H - yb)}" fill="var(--c-d)" fill-opacity="0.2"/><line x1="0" y1="${n(yb)}" x2="${W}" y2="${n(yb)}" ${tinta()}/>`;
          if (d.ancho) {
            s += `<g class="kit-cota"><line x1="12" y1="34" x2="12" y2="${n(yb - 2)}" ${tinta(1.5)}/><line x1="7" y1="34" x2="17" y2="34" ${tinta(1.5)}/><line x1="7" y1="${n(yb - 2)}" x2="17" y2="${n(yb - 2)}" ${tinta(1.5)}/></g>`;
            s += T.rotulo(W / 2, 22, d.ancho, { ancla: 'middle', tam: 14, peso: 700, min: 4, max: W - 4 });
          }
          return obj('rio', s);
        }
        let s = `<rect x="2" y="2" width="${W - 4}" height="${H - 4}" rx="12" fill="var(--c-i)" fill-opacity="0.1"/>`;
        for (const [x, y] of [[40, 40], [250, 60], [60, 200], [270, 210], [160, 24]]) s += `<path d="M${x} ${y}q8 -5 16 0t16 0" fill="none" stroke="var(--c-i)" stroke-opacity="0.5" stroke-width="1.5"/>`;
        return obj('lago', s);
      },
      cuerpo(d, g) {
        const r = Number.isFinite(d.rumbo) ? d.rumbo : 90, o = [g.ax, g.ay];
        // 26 nov (dibujos reconocibles): el casco visto desde arriba, con la popa recta, los costados curvos hasta la
        // proa, la borda por dentro, dos bancas y los remos: un pentágono con una raya se leía como lápiz.
        const casco = [[-22, -6], [-20, -9], [-8, -10.5], [4, -9.5], [14, -6.5], [21, -3], [24, 0], [21, 3], [14, 6.5], [4, 9.5], [-8, 10.5], [-20, 9], [-22, 6]];
        let s = `<path d="${camino(casco.map(([x, y]) => [x, y * 1.25]), r, o)}" fill="var(--c-o)" fill-opacity="0.25" ${tinta()}/>`;
        s += `<path d="${camino(casco.map(([x, y]) => [x * 0.82 - 1, y * 0.85]), r, o)}" fill="none" stroke="currentColor" stroke-opacity="0.45" stroke-width="1.2"/>`;
        for (const x of [-10, 4]) s += `<path d="${camino([[x - 2, -9], [x + 2, -9], [x + 2, 9], [x - 2, 9]], r, o)}" fill="currentColor" fill-opacity="0.35"/>`;
        for (const sg of [-1, 1]) s += `<path d="${camino([[-6, sg * 11], [-4, sg * 20], [-1, sg * 26], [-3, sg * 27], [-6, sg * 21], [-8, sg * 12]], r, o)}" fill="currentColor" fill-opacity="0.2" stroke="currentColor" stroke-width="1.2" stroke-linejoin="round"/>`;
        return obj('bote', s);
      },
      nombre: d => (d.orillas ? 'un bote en un río que corre hacia la derecha' : 'un bote en el lago'),
    },
    avion: {
      forma: () => ({ ext: [-26, -26, 26, 26], puntos: {} }),
      cuerpo(d, g) {
        const r = Number.isFinite(d.rumbo) ? d.rumbo : ((d.flechas || [])[0] || {}).ang || 90, o = [g.ax, g.ay];
        const ala = s => [[6, 3 * s], [-6, 24 * s], [-12, 24 * s], [-6, 3 * s]], cola = s => [[-14, 2 * s], [-21, 10 * s], [-24, 10 * s], [-21, 2 * s]];
        let s = '';
        for (const k of [1, -1]) s += `<path d="${camino(ala(k), r, o)}" fill="var(--card)" ${tinta(1.5)}/><path d="${camino(cola(k), r, o)}" fill="var(--card)" ${tinta(1.5)}/>`;
        s += `<path d="${camino([[24, 0], [16, -4], [-20, -3], [-25, 0], [-20, 3], [16, 4]], r, o)}" fill="var(--c-f)" fill-opacity="0.35" ${tinta(1.5)}/>`;
        return obj('avion', `<g fill="var(--card)">${s}</g>`);
      },
      nombre: () => 'una avioneta vista desde arriba',
    },
    llave: {
      forma(d) {
        const L = 150, a = Number.isFinite(d.angLlave) ? d.angLlave : 0, p = [L * cosG(a), -L * senG(a)];
        return { ext: [Math.min(-18, p[0] - 8), Math.min(-18, p[1] - 10), Math.max(18, p[0] + 8), Math.max(18, p[1]) + (d.cota ? 34 : 10)], puntos: { punta: p, tuerca: [0, 0] } };
      },
      cuerpo(d, g) {
        const L = 150, a = Number.isFinite(d.angLlave) ? d.angLlave : 0, o = [g.ax, g.ay];
        const hex = Array.from({ length: 6 }, (_, k) => [11 * Math.cos(k * Math.PI / 3 + Math.PI / 6), 11 * Math.sin(k * Math.PI / 3 + Math.PI / 6)]);
        let s = `<path d="${camino([[14, -7], [L + 6, -7], [L + 6, 7], [14, 7]], a, o)}" fill="var(--c-f)" fill-opacity="0.3" ${tinta()}/>`;
        s += `<circle cx="${n(o[0])}" cy="${n(o[1])}" r="18" fill="var(--c-f)" fill-opacity="0.3" ${tinta()}/>`;
        s += `<path d="${camino(hex, 0, o)}" fill="var(--card)" ${tinta()}/><circle cx="${n(o[0])}" cy="${n(o[1])}" r="4" fill="currentColor"/>`;
        let out = obj('llave', s);
        if (d.cota) {
          // La cota del brazo: de la tuerca a la mano, por debajo del mango.
          const q0 = girar([0, 24], a), q1 = girar([L, 24], a), m = girar([L / 2, 44], a);
          out += `<g class="kit-cota"><line x1="${n(o[0] + q0[0])}" y1="${n(o[1] + q0[1])}" x2="${n(o[0] + q1[0])}" y2="${n(o[1] + q1[1])}" ${tinta(1.5)}/>`
            + [q0, q1].map(q => { const t0 = girar([0, -5], a), t1 = girar([0, 5], a); return `<line x1="${n(o[0] + q[0] + t0[0])}" y1="${n(o[1] + q[1] + t0[1])}" x2="${n(o[0] + q[0] + t1[0])}" y2="${n(o[1] + q[1] + t1[1])}" ${tinta(1.5)}/>`; }).join('')
            + T.rotulo(o[0] + m[0], o[1] + m[1], d.cota, { ancla: 'middle', tam: 14, peso: 700, min: 4, max: W - 4 }) + '</g>';
        }
        return out;
      },
      nombre: () => 'una llave que gira una tuerca',
    },
    carretilla: {
      forma: () => ({ ext: [-78, -22, 58, 34], puntos: { manijas: [-74, -16], piso: [-30, 52] }, piso: 32 }),
      fondo: (d, g) => `<line class="kit-piso" x1="4" y1="${n(g.ay + 32)}" x2="${W - 4}" y2="${n(g.ay + 32)}" ${tinta()}/>`
        + `<line x1="4" y1="${n(g.ay + 36)}" x2="${W - 4}" y2="${n(g.ay + 36)}" stroke="currentColor" stroke-opacity="0.2" stroke-width="4"/>`,
      cuerpo(d, g) {
        const x = g.ax, y = g.ay;
        let s = `<path d="M${n(x - 74)} ${n(y - 16)}L${n(x + 40)} ${n(y + 18)}" ${tinta(4)}/>`;
        s += `<path d="M${n(x - 32)} ${n(y - 18)}L${n(x + 38)} ${n(y - 18)}L${n(x + 26)} ${n(y + 8)}L${n(x - 20)} ${n(y + 8)}Z" fill="var(--c-o)" fill-opacity="0.25" ${tinta()}/>`;
        s += `<path d="M${n(x - 16)} ${n(y + 8)}L${n(x - 20)} ${n(y + 32)}" ${tinta(3)}/>`;
        s += `<circle cx="${n(x + 40)}" cy="${n(y + 18)}" r="14" fill="var(--card)" ${tinta(3)}/><circle cx="${n(x + 40)}" cy="${n(y + 18)}" r="3" fill="currentColor"/>`;
        return obj('carretilla', s);
      },
      texto: d => d.texto, textoEn: () => [4, 3],
      nombre: () => 'una carretilla',
    },
    cuadras: {
      forma: d => {
        const pts = puntosCuadras(d), fin = pts[pts.length - 1], cero = d.resultante && Math.hypot(fin[0], fin[1]) < 1e-9;
        const fl = flechasCuadras(d), tr = fl.filter(f => !f.resultante), marcas = [];
        if (d.inicio) marcas.push({ en: [0, 0], px: tr.length ? tr[0].desde : [0, 0], texto: d.inicio, izq: true });
        // La llegada se nombra delante de la punta del último tramo, en su misma línea (no encima de la flecha).
        if (d.fin && tr.length) marcas.push({ en: tr[tr.length - 1].a, px: tr[tr.length - 1].desde, texto: d.fin, delante: (d.tramos[d.tramos.length - 1] || {}).dir });
        if (cero) marcas.push({ en: [0, 0], texto: `${d.resultante.rotulo || 'R'} = 0`, izq: !d.inicio, abajo: !!d.inicio });
        return { ext: [-14, -14, 14, 14], puntos: {}, flechas: fl, marcas };
      },
      fondo(d, g) {
        const pts = puntosCuadras(d), xs = pts.map(p => p[0]), ys = pts.map(p => p[1]);
        let s = '';
        if (d.rejilla !== false) {
          const i0 = Math.min(...xs) - 1, i1 = Math.max(...xs) + 1, j0 = Math.min(...ys) - 1, j1 = Math.max(...ys) + 1;
          const X = i => g.ax + i * g.s, Y = j => g.ay - j * g.s, cl = (v, a, b) => Math.max(a, Math.min(b, v));
          for (let i = i0; i < i1; i++) for (let j = j0; j < j1; j++) {
            const e = Math.min(6, g.s * 0.16);   // la calle: ancha si la cuadra es grande, angosta si es chica
            const x0 = cl(X(i) + e, 2, W - 2), x1 = cl(X(i + 1) - e, 2, W - 2), y0 = cl(Y(j + 1) + e, 2, H - 2), y1 = cl(Y(j) - e, 2, H - 2);
            if (x1 - x0 < 4 || y1 - y0 < 4) continue;
            const plaza = Array.isArray(d.plaza) && d.plaza[0] === i && d.plaza[1] === j;
            s += `<rect x="${n(x0)}" y="${n(y0)}" width="${n(x1 - x0)}" height="${n(y1 - y0)}" rx="4" fill="currentColor" fill-opacity="${plaza ? 0.2 : 0.07}"/>`;
          }
          // La plaza, en tinta (17 nov): en verde quedaba pegada al primer tramo, naranja (0,010 con protanopía).
          if (Array.isArray(d.plaza)) s += T.rotulo(X(d.plaza[0] + 0.5), Y(d.plaza[1] + 0.5) + 5, 'Plaza', { ancla: 'middle', tam: 14, peso: 700, min: 4, max: W - 4 });
        } else {
          // Una sola calle: una franja a lo largo del recorrido.
          // La franja cubre todos los renglones del recorrido.
          const horiz = Math.max(...ys) === Math.min(...ys), qs = g.fl.flatMap(x => [x.p0, x.p1]);
          if (horiz) { const a = Math.max(4, Math.min(...qs.map(q => q[1])) - 16), b = Math.min(H - 4, Math.max(...qs.map(q => q[1])) + 16); s += `<rect x="4" y="${n(a)}" width="${W - 8}" height="${n(b - a)}" rx="8" fill="currentColor" fill-opacity="0.06"/>`; }
          else { const a = Math.max(4, Math.min(...qs.map(q => q[0])) - 16), b = Math.min(W - 4, Math.max(...qs.map(q => q[0])) + 16); s += `<rect x="${n(a)}" y="4" width="${n(b - a)}" height="${H - 8}" rx="8" fill="currentColor" fill-opacity="0.06"/>`; }
        }
        return `<g class="kit-calles">${s}</g>`;
      },
      cuerpo(d, g) {
        // Quien camina: una figura chica en la salida; la llegada, un alfiler.
        // La salida es la cola del primer tramo y la llegada, la punta del último (en una sola calle van en renglones).
        const tr = g.fl.filter(f => !f.f.resultante), [x, y] = tr.length ? tr[0].p0 : [g.ax, g.ay], [fx, fy] = tr.length ? tr[tr.length - 1].p1 : [x, y];
        // La salida, en tinta (17 nov): en verde quedaba pegada a la cola del primer tramo, naranja.
        let s = `<circle cx="${n(x)}" cy="${n(y)}" r="5" fill="currentColor" ${tinta(1.5)}/>`;
        if (Math.hypot(fx - x, fy - y) > 4) s += `<circle cx="${n(fx)}" cy="${n(fy)}" r="5" fill="var(--card)" ${tinta(2)}/><circle cx="${n(fx)}" cy="${n(fy)}" r="2" fill="currentColor"/>`;
        return obj('persona', s);
      },
      nombre: d => (d.rejilla === false ? 'un recorrido por una calle' : 'un recorrido por cuadras visto desde arriba'),
    },
  };

  // La rampa: el punto de apoyo de la caja y el triángulo, en px desde el centro de la caja.
  function rampa(gr) {
    const c = [22 * senG(gr), 22 * cosG(gr)], dir = [cosG(gr), -senG(gr)];
    const bi = [c[0] - 112 * dir[0], c[1] - 112 * dir[1]], ar = [c[0] + 70 * dir[0], c[1] + 70 * dir[1]];
    return { c, bi, ar, bd: [ar[0], bi[1]] };
  }
  function puntosCuadras(d) {
    const pts = [[0, 0]];
    for (const t of d.tramos || []) { const u = DIR[t.dir] || [0, 0], p = pts[pts.length - 1]; pts.push([p[0] + u[0] * t.n, p[1] + u[1] * t.n]); }
    return pts;
  }
  // Los tramos se vuelven flechas encadenadas; un tramo que vuelve por la misma calle va en un carril corrido.
  function flechasCuadras(d) {
    const pts = puntosCuadras(d), out = [], carriles = [];
    (d.tramos || []).forEach((t, k) => {
      const a = pts[k], b = pts[k + 1], hz = a[1] === b[1];
      const lo = hz ? Math.min(a[0], b[0]) : Math.min(a[1], b[1]), hi = hz ? Math.max(a[0], b[0]) : Math.max(a[1], b[1]), linea = hz ? a[1] : a[0];
      const ocup = carriles.filter(c => c.hz === hz && c.linea === linea && Math.min(hi, c.hi) - Math.max(lo, c.lo) > 1e-9).map(c => c.carril);
      let carril = 0; while (ocup.includes(carril)) carril++;
      carriles.push({ hz, linea, lo, hi, carril });
      // En una sola calle (sin rejilla) cada tramo va en su renglón, 28 px más abajo: los rótulos caben entre renglones.
      if (d.rejilla === false) carril = k;
      const paso = d.rejilla === false ? 28 : 9;
      out.push({ de: a, a: b, desde: hz ? [0, paso * carril] : [paso * carril, 0], color: t.color || COLORES_TRAMO[k % 4], rotulo: t.rotulo, valor: t.valor, rotuloEn: t.rotuloEn, lado: t.lado });
    });
    const fin = pts[pts.length - 1];
    if (d.resultante) {
      const r = d.resultante, cero = Math.hypot(fin[0], fin[1]) < 1e-9;
      const sep = d.rejilla === false ? 28 : 12;
      const recta = pts.every(p => p[1] === 0) ? [0, -sep] : pts.every(p => p[0] === 0) ? [-sep, 0] : [0, 0];
      if (!cero) out.push({ de: [0, 0], a: fin, desde: recta, color: 'f', rotulo: r.rotulo, valor: r.valor, rotuloEn: r.rotuloEn, lado: r.lado, resultante: true });
    }
    return out;
  }

  // ---------- Geometría ----------
  const punto = (en, P, s) => (typeof en === 'string' ? (P[en] || [0, 0]).slice() : Array.isArray(en) ? aPx(en, s) : [0, 0]);
  const desdePx = (desde, P) => (typeof desde === 'string' ? (P[desde] || [0, 0]) : Array.isArray(desde) ? desde : [0, 0]);
  const sinFlecha = t => String(t).replace(/\u20D7/g, '');
  // Si el valor es el vector mismo («40î − 30ĵ»), la flecha se queda.
  const textoFlecha = f => (f.rotulo ? (f.valor !== undefined && f.valor !== '' ? `${/[îĵ]|k̂/.test(String(f.valor)) ? f.rotulo : sinFlecha(f.rotulo)} = ${f.valor}` : f.rotulo) : '');
  // Subíndices de verdad en los <text>: «A_x» → A con la x más chica y más abajo; lo que sigue vuelve a la línea base.
  const SUB = /([A-Za-zÁÉÍÓÚáéíóúθτ\u20D7)])_([A-Za-z0-9]{1,3})/g;
  function conSubindices(svg) {
    return svg.replace(/(<text\b[^>]*>)([^<]*)(<\/text>)/g, (m, a, t, c) => {
      const t2 = t.replace(/ₓ/g, '_x').replace(/ᵧ/g, '_y');
      if (!SUB.test(t2)) return m;
      SUB.lastIndex = 0;
      let out = '', k = 0, abajo = false;
      t2.replace(SUB, (mm, l, sb, i) => {
        const antes = t2.slice(k, i) + l;
        out += abajo ? `<tspan dy="-.252em">${antes}</tspan>` : antes;
        out += `<tspan font-size="72%" dy=".35em">${sb}</tspan>`;
        abajo = true; k = i + mm.length; return mm;
      });
      const resto = t2.slice(k);
      if (resto) out += `<tspan dy="-.252em">${resto}</tspan>`;
      return a + out + c;
    });
  }
  const caja = (x, y, texto, ancla, tam = TAM) => {
    const w = T.ancho(texto, tam, 700), x0 = ancla === 'middle' ? x - w / 2 : ancla === 'end' ? x - w : x;
    return { x0, x1: x0 + w, y0: y - 12, y1: y + 4, x, y, texto, ancla };
  };
  const choca = (a, b, pad = 2) => a.x0 < b.x1 + pad && b.x0 < a.x1 + pad && a.y0 < b.y1 + pad && b.y0 < a.y1 + pad;
  const sobreTramo = (b, p, q) => {
    // ¿La caja del rótulo toca el trazo de p a q? (muestras a lo largo del trazo, con el medio grosor)
    for (let k = 0; k <= 12; k++) { const x = p[0] + (q[0] - p[0]) * k / 12, y = p[1] + (q[1] - p[1]) * k / 12; if (x > b.x0 - 3 && x < b.x1 + 3 && y > b.y0 - 3 && y < b.y1 + 3) return true; }
    return false;
  };

  // Arma todo con el centro del objeto en (0, 0) y una escala s; devuelve las piezas y su caja.
  function armar(d, F, s) {
    const P = F.puntos || {};
    const lista = F.flechas || d.flechas || [];
    const fl = lista.map(f => {
      const b = desdePx(f.desde, P), de = f.de || [0, 0];
      const u1 = Array.isArray(f.a) ? f.a : [de[0] + (f.mod || 0) * cosG(f.ang || 0), de[1] + (f.mod || 0) * senG(f.ang || 0)];
      let p0 = [b[0] + de[0] * s, b[1] - de[1] * s], p1 = [b[0] + u1[0] * s, b[1] - u1[1] * s];
      // hasta: la flecha termina en ese punto (una mano que empuja las manijas): se corre entera.
      if (f.hasta) { const h = desdePx(f.hasta, P), dx = h[0] - p1[0], dy = h[1] - p1[1]; p0 = [p0[0] + dx, p0[1] + dy]; p1 = h.slice(); }
      return { f, p0, p1 };
    });
    const cajas = [], obst = [];
    const [ex0, ey0, ex1, ey1] = F.ext;
    obst.push({ x0: ex0 + 4, y0: ey0 + 4, x1: ex1 - 4, y1: ey1 - 4 });
    // El piso (caja sin rampa y carretilla): una franja que ningún rótulo pisa.
    if (Number.isFinite(F.piso)) obst.push({ x0: -W, y0: F.piso - 3, x1: W, y1: F.piso + 3 });
    // Ángulos: el arco y su rótulo en la bisectriz, afuera del arco.
    const ang = (d.angulos || []).map(a => {
      const c = a.desde ? (() => { const b = desdePx(a.desde, P), u = aPx(a.en || [0, 0], s); return [b[0] + u[0], b[1] + u[1]]; })() : punto(a.en, P, s), r = a.radio || 24;
      let barrido = (((a.a - a.de) % 360) + 360) % 360; if (barrido === 0 && a.a !== a.de) barrido = 360;
      const mid = a.de + barrido / 2;
      let bx = null;
      if (a.texto) {
        // El rótulo va sobre el arco, en la dirección más lejos de las flechas que salen del vértice (no las pisa).
        const sal = fl.filter(x => Math.hypot(x.p0[0] - c[0], x.p0[1] - c[1]) < 2 && Math.hypot(x.p1[0] - x.p0[0], x.p1[1] - x.p0[1]) > 1)
          .map(x => Math.atan2(-(x.p1[1] - x.p0[1]), x.p1[0] - x.p0[0]) * 180 / Math.PI);
        const lejos = t => Math.min(180, ...sal.map(u => Math.abs(((t - u) % 360 + 540) % 360 - 180)));
        const mejor = [0.5, 0.3, 0.7, 0.2, 0.8].map(k => a.de + barrido * k).reduce((m0, t) => (lejos(t) > lejos(m0) + 8 ? t : m0), mid);
        const w = T.ancho(a.texto, 14, 700), ux = cosG(mejor), uy = -senG(mejor);
        const R = r + 8 + Math.abs(ux) * w / 2 + Math.abs(uy) * 8;
        bx = caja(c[0] + ux * R, c[1] + uy * R + 5, a.texto, 'middle', 14);
        cajas.push(bx);
      }
      return { a, c, r, barrido, bx };
    });
    const marcas = (F.marcas || []).concat(d.marcas || []).map(m => { const c = aPx(m.en, s), q = m.px || [0, 0]; c[0] += q[0]; c[1] += q[1]; const b = m.texto ? (m.delante === 'O' ? caja(c[0] - 10, c[1] + 5, m.texto, 'end', 14) : m.delante === 'E' ? caja(c[0] + 10, c[1] + 5, m.texto, 'start', 14) : m.delante === 'S' ? caja(c[0], c[1] + 24, m.texto, 'middle', 14) : m.delante === 'N' ? caja(c[0], c[1] - 10, m.texto, 'middle', 14) : m.abajo ? caja(c[0], c[1] + 24, m.texto, 'middle', 14) : m.izq ? caja(c[0] - 9, c[1] + 20, m.texto, 'end', 14) : caja(c[0] + 9, c[1] - 7, m.texto, 'start', 14)) : null; if (b) cajas.push(b); return { m, c, b }; });
    const fuera = (d.fuera || []).map(q => { const c = punto(q.en, P, s); const b = q.rotulo ? caja(c[0], c[1] - 19, q.rotulo, 'middle') : null; if (b) cajas.push(b); return { q, c, b }; });
    const centro = (() => {
      const ps = fl.flatMap(x => [x.p0, x.p1]); ps.push([0, 0]);
      return [ps.reduce((t, p) => t + p[0], 0) / ps.length, ps.reduce((t, p) => t + p[1], 0) / ps.length];
    })();
    // Rótulos de las flechas: junto a su tramo, del lado de afuera; si chocan, se prueba el otro lado y otro lugar.
    const rot = fl.map(x => {
      const t = textoFlecha(x.f); if (!t) return null;
      const L = Math.hypot(x.p1[0] - x.p0[0], x.p1[1] - x.p0[1]) || 1;
      let nx = -(x.p1[1] - x.p0[1]) / L, ny = (x.p1[0] - x.p0[0]) / L;
      const t0 = x.f.rotuloEn === undefined ? 0.55 : x.f.rotuloEn;
      const m0 = [x.p0[0] + (x.p1[0] - x.p0[0]) * t0, x.p0[1] + (x.p1[1] - x.p0[1]) * t0];
      const dd = (m0[0] - centro[0]) * nx + (m0[1] - centro[1]) * ny;
      if (Math.abs(dd) < 1) { if (Math.abs(ny) > 0.3 ? ny > 0 : nx < 0) { nx = -nx; ny = -ny; } } else if (dd < 0) { nx = -nx; ny = -ny; }
      if (x.f.lado === -1) { nx = -nx; ny = -ny; }
      const cand = [];
      const ts = x.f.rotuloEn === undefined ? [t0, 0.35, 0.75, 0.2, 0.9] : [t0, Math.max(0.1, t0 - 0.2), Math.min(0.95, t0 + 0.2)];
      // Primero pegado al trazo (12 px); si nada queda libre, un poco más afuera (24 px), antes de rendirse.
      for (const dist of [12, 24]) for (const lado of x.f.lado ? [1] : [1, -1]) for (const tt of ts) {
        const mx = x.p0[0] + (x.p1[0] - x.p0[0]) * tt, my = x.p0[1] + (x.p1[1] - x.p0[1]) * tt, kx = nx * lado, ky = ny * lado;
        const ancla = Math.abs(kx) < 0.35 ? 'middle' : kx > 0 ? 'start' : 'end';
        cand.push(caja(mx + kx * dist, my + ky * dist + 5 + (ky > 0.35 ? 6 : ky < -0.35 ? -3 : 0), t, ancla));
      }
      const libre = c => !cajas.some(b => choca(b, c)) && !obst.some(b => choca(b, c, 0)) && !fl.some(y => sobreTramo(c, y.p0, y.p1));
      const elegido = cand.find(libre) || cand.find(c => !cajas.some(b => choca(b, c)) && !obst.some(b => choca(b, c, 0))) || cand.find(c => !cajas.some(b => choca(b, c))) || cand[0];
      cajas.push(elegido);
      return Object.assign({ color: x.f.color }, elegido);
    });
    const guias = (d.guias || []).map(q => ({ q, p0: aPx(q.de, s), p1: aPx(q.a, s) }));
    // La caja de todo: objeto, flechas (con la punta y medio grosor), arcos, rótulos.
    let x0 = ex0, y0 = ey0, x1 = ex1, y1 = ey1;
    const mete = (x, y, r = 0) => { x0 = Math.min(x0, x - r); x1 = Math.max(x1, x + r); y0 = Math.min(y0, y - r); y1 = Math.max(y1, y + r); };
    for (const x of fl) { mete(...x.p0, 3); mete(...x.p1, 8); }
    for (const g of guias) { mete(...g.p0, 2); mete(...g.p1, 2); }
    for (const a of ang) mete(...a.c, a.r + 2);
    for (const q of fuera) mete(...q.c, 15);
    for (const m of marcas) mete(...m.c, 6);
    for (const b of cajas) if (b) { mete(b.x0, b.y0); mete(b.x1, b.y1); }
    return { s, fl, ang, rot, marcas, fuera, guias, caja: [x0, y0, x1, y1] };
  }

  const largoU = f => {
    const de = f.de || [0, 0], a = Array.isArray(f.a) ? f.a : [de[0] + (f.mod || 0) * cosG(f.ang || 0), de[1] + (f.mod || 0) * senG(f.ang || 0)];
    return Math.hypot(a[0] - de[0], a[1] - de[1]);
  };
  function geometria(d0 = {}) {
    const d = Object.assign({ flechas: [] }, d0), O = OBJETOS[d.objeto] || OBJETOS.nudo, F = O.forma(d);
    const lista = F.flechas || d.flechas;
    const mx = Math.max(1e-9, ...lista.map(largoU));
    const area = (F.area || [M, M, W - M, H - M]).slice();
    if (d.norte) area[2] = Math.min(area[2], W - 34);
    let s = (d.largo || (d.objeto === 'cuadras' ? 160 : 110)) / mx, g;
    if (d.objeto === 'cuadras' && d.rejilla !== false) s = Math.min(s, 64);
    for (let k = 0; k < 80; k++) {
      g = armar(d, F, s);
      const [x0, y0, x1, y1] = g.caja;
      if (x1 - x0 <= area[2] - area[0] && y1 - y0 <= area[3] - area[1]) break;
      s *= 0.95;
    }
    const [x0, y0, x1, y1] = g.caja;
    const ax = area[0] + (area[2] - area[0] - (x1 - x0)) / 2 - x0;
    const ay = F.abajo ? area[3] - y1 : area[1] + (area[3] - area[1] - (y1 - y0)) / 2 - y0;
    g.ax = ax; g.ay = ay; g.F = F; g.O = O; g.d = d;
    const mueve = b => (b ? Object.assign({}, b, { x0: b.x0 + ax, x1: b.x1 + ax, x: b.x + ax, y0: b.y0 + ay, y1: b.y1 + ay, y: b.y + ay }) : b);
    g.fl = g.fl.map(x => ({ f: x.f, p0: [x.p0[0] + ax, x.p0[1] + ay], p1: [x.p1[0] + ax, x.p1[1] + ay] }));
    g.rot = g.rot.map(mueve);
    g.ang = g.ang.map(a => Object.assign({}, a, { c: [a.c[0] + ax, a.c[1] + ay], bx: mueve(a.bx) }));
    g.marcas = g.marcas.map(m => Object.assign({}, m, { c: [m.c[0] + ax, m.c[1] + ay], b: mueve(m.b) }));
    g.fuera = g.fuera.map(q => Object.assign({}, q, { c: [q.c[0] + ax, q.c[1] + ay], b: mueve(q.b) }));
    g.guias = g.guias.map(q => Object.assign({}, q, { p0: [q.p0[0] + ax, q.p0[1] + ay], p1: [q.p1[0] + ax, q.p1[1] + ay] }));
    g.caja = [x0 + ax, y0 + ay, x1 + ax, y1 + ay];
    // Para el dibujo de cada objeto: los px de su centro y de un punto en unidades (y hacia arriba).
    g.P = u => [ax + u[0] * s, ay - u[1] * s];
    return g;
  }

  // Arco de un ángulo (antihorario, en grados). Con 90° va el cuadradito; con 180° o más se parte en dos arcos,
  // porque la bandera de arco largo no distingue un arco de 180° (comprobado en el checklist del kit).
  function arco(a) {
    const [cx, cy] = a.c, r = a.r, p = t => [cx + r * cosG(t), cy - r * senG(t)], c = T.color(a.a.color || 'h');
    if (Math.abs(a.barrido - 90) < 1e-6) {
      const q = 12, u = [cx + q * cosG(a.a.de), cy - q * senG(a.a.de)], v = [cx + q * cosG(a.a.de + 90), cy - q * senG(a.a.de + 90)];
      return `<path d="M${n(u[0])} ${n(u[1])}L${n(u[0] + v[0] - cx)} ${n(u[1] + v[1] - cy)}L${n(v[0])} ${n(v[1])}" fill="none" stroke="${c}" stroke-width="2" stroke-linejoin="round"/>`;
    }
    const tramos = a.barrido >= 179 ? [[a.a.de, a.a.de + a.barrido / 2], [a.a.de + a.barrido / 2, a.a.de + a.barrido]] : [[a.a.de, a.a.de + a.barrido]];
    return tramos.map(([t0, t1]) => { const [x0, y0] = p(t0), [x1, y1] = p(t1); return `<path d="M${n(x0)} ${n(y0)}A${r} ${r} 0 0 0 ${n(x1)} ${n(y1)}" fill="none" stroke="${c}" stroke-width="2" stroke-linecap="round"/>`; }).join('');
  }
  // Un rótulo con un fondo del color de la tarjeta: se lee encima del agua, las calles o una cuerda.
  const rotulo = (b, color, tam = TAM) => `<rect x="${n(b.x0 - 2)}" y="${n(b.y0)}" width="${n(b.x1 - b.x0 + 4)}" height="${n(b.y1 - b.y0 + 1)}" rx="3" fill="var(--card)" fill-opacity="0.85"/>`
    + T.rotulo(b.x, b.y, b.texto, { color, ancla: b.ancla, peso: 700, tam, min: 4, max: W - 4 });

  function dibujar(datos = {}, estado = {}) {
    void estado;
    const g = geometria(datos), d = g.d, O = g.O;
    let s = O.fondo ? O.fondo(d, g) : '';
    for (const q of g.guias) s += T.linea(q.p0[0], q.p0[1], q.p1[0], q.p1[1], { color: q.q.color, grosor: 2, discontinua: true, opacidad: 0.7 });
    s += O.cuerpo(d, g);
    if (O.texto && O.texto(d)) { const t = O.textoEn(d); s += T.rotulo(g.ax + t[0], g.ay + t[1], O.texto(d), { ancla: 'middle', tam: 14, peso: 800, min: 4, max: W - 4 }); }
    for (const a of g.ang) s += `<g class="kit-angulo">${arco(a)}</g>`;
    // Conectores de carril (cuadras): la vuelta por la misma calle se ve como una U.
    for (let k = 1; k < g.fl.length; k++) {
      const a = g.fl[k - 1], b = g.fl[k];
      if (a.f.resultante || b.f.resultante || d.objeto !== 'cuadras') continue;
      if (Math.hypot(a.p1[0] - b.p0[0], a.p1[1] - b.p0[1]) > 1) s += T.linea(a.p1[0], a.p1[1], b.p0[0], b.p0[1], { grosor: 1.5, discontinua: true, opacidad: 0.6 });
    }
    g.fl.forEach((x, i) => {
      const L = Math.hypot(x.p1[0] - x.p0[0], x.p1[1] - x.p0[1]);
      if (L < 1) return;
      // Dos flechas que terminan en el mismo punto: la de después acorta su punta 14 px (las puntas no se enciman).
      const junta = g.fl.slice(0, i).some(y => Math.hypot(y.p1[0] - x.p1[0], y.p1[1] - x.p1[1]) < 2 && Math.hypot(y.p1[0] - y.p0[0], y.p1[1] - y.p0[1]) >= 1);
      const k = junta && L > 40 ? (L - 14) / L : 1;
      let a = T.flecha(x.p0[0], x.p0[1], x.p0[0] + (x.p1[0] - x.p0[0]) * k, x.p0[1] + (x.p1[1] - x.p0[1]) * k, { color: x.f.color, grosor: 3 });
      if (x.f.discontinua) a = a.replace('stroke-linecap="round"/>', 'stroke-linecap="round" stroke-dasharray="6 5"/>').replace('<path ', '<path fill-opacity="0.6" ');
      s += `<g class="kit-vector">${a}</g>`;
    });
    for (const q of g.fuera) {
      const [x, y] = q.c, c = T.color(q.q.color || 'f');
      const marca = q.q.sentido === 'entra'
        ? `<path d="M${n(x - 6)} ${n(y - 6)}L${n(x + 6)} ${n(y + 6)}M${n(x + 6)} ${n(y - 6)}L${n(x - 6)} ${n(y + 6)}" stroke="${c}" stroke-width="3" stroke-linecap="round"/>`
        : `<circle cx="${n(x)}" cy="${n(y)}" r="4" fill="${c}"/>`;
      s += `<g class="kit-fuera"><circle cx="${n(x)}" cy="${n(y)}" r="12" fill="var(--card)" stroke="${c}" stroke-width="3"/>${marca}</g>`;
      if (q.b) s += rotulo(q.b, q.q.color || 'f');
    }
    for (const m of g.marcas) {
      s += `<circle cx="${n(m.c[0])}" cy="${n(m.c[1])}" r="4" fill="currentColor"/>`;
      if (m.b) s += rotulo(m.b, null, 14);
    }
    for (const a of g.ang) if (a.bx) s += rotulo(a.bx, a.a.color || 'h', 14);
    // El norte, arriba a la derecha (en su franja reservada): una flecha que apunta hacia arriba.
    if (d.norte) s += `<g class="kit-norte">${T.rotulo(W - 17, 24, 'N', { ancla: 'middle', tam: 14, peso: 800 })}${T.flecha(W - 17, 58, W - 17, 30, { grosor: 2 })}</g>`;
    for (const r of g.rot) if (r) s += rotulo(r, r.color);
    return conSubindices(T.svg(W, H, s, { alt: alt(datos) }));
  }

  function alt(d = {}) {
    const O = OBJETOS[d.objeto] || OBJETOS.nudo, F = O.forma(Object.assign({ flechas: [] }, d));
    const fl = (F.flechas || d.flechas || []).filter(f => f.rotulo).map(f => `${sinFlecha(f.rotulo).replace(/_/g, ' ').replace(/ₓ/g, ' x').replace(/ᵧ/g, ' y')}${f.valor ? ` de ${f.valor}` : ''}${Number.isFinite(f.ang) ? ` a ${Kit.formatear(f.ang, 0)}°` : ''}`);
    return `Dibujo de ${O.nombre(d)}${fl.length ? `, con flechas a escala: ${fl.join(', ')}` : ''}.`;
  }

  return { id: 'fis-fuerzas', dibujar, alt, geometria, OBJETOS: Object.keys(OBJETOS), constantes: { W, H, M } };
});
