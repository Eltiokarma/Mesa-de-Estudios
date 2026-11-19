/*
 * Pieza «fis-tiro» (19 nov 2026, «Movimiento parabólico», ideas A1 a A5; docs/etapa5/propuesta-fisica.md §2): algo que
 * sale de lado (A1, A2) o con ángulo (A3, A4) y cae, y un dron visto desde arriba (A5, vista «plano», más abajo). Todo es dibujo de prueba
 * (data-prueba): Gerson decide después cuáles reemplaza (docs/plan-calidad.md, M4).
 *
 * Afirmación de la figura (≤ 25 palabras): lanzada de lado, la piedra avanza lo mismo en cada medio segundo y cae cada
 * vez más: dos reglas, un solo reloj.
 *
 * La pieza calcula solo dónde está el objeto: x = v₀ · t de lado y h = ½ · g · t² hacia abajo (las dos cuentas de la
 * idea; los rótulos con números los trae quien llama). Función pura de (datos, estado): sin ids, sin azar, sin reloj.
 * Ancho 320; solo currentColor y var(--c-*). La escala es la misma de lado y hacia abajo (la trayectoria no se deforma).
 * geometria(datos, estado) devuelve las cajas de los rótulos y de los objetos y los puntos en píxeles, para las pruebas
 * de encuadre y de choques (fis-tiro.test.js).
 *
 * datos = {
 *   plataforma: 'pena' | 'mesa' | 'azotea' | 'muro' | 'avioneta',   de dónde sale (peña con lago, mesa, edificio, muro
 *                                                                   con caño, avioneta en vuelo)
 *   alto: 20, ancho: 42,          m: altura de salida sobre el piso y cuánto se ve de lado (fijan la escala)
 *   altoMax: 150,                 px: lo más que puede medir la caída en el dibujo (el juego usa 200: la figura, grande)
 *   v0: 15, g: 10, t: 1.2,        m/s, m/s², s: con qué rapidez sale, la gravedad y el instante que se dibuja
 *   cada: 0.5,                    s: deja un objeto tenue cada tanto (hasta t); 0 o sin él, ninguno
 *   sombras: true,                las marcas violetas de cada objeto tenue: en la regla del piso y en la de la pared
 *   camino: 'recorrido' | 'entero' | false,   la trayectoria: hasta t, entera (discontinua) o sin ella
 *   objeto: 'piedra' | 'pelota' | 'canica' | 'paquete' | 'agua',     con 'agua' el camino es el chorro
 *   flecha: { texto: '15 m/s' } | false,      la flecha de la velocidad de salida (naranja), sobre el borde
 *   regla: { paso: 10, numero: 10 } | false,  la regla de metros del piso, con el 0 bajo el punto de salida
 *   alturas: { paso: 5, numero: 5, tiempos: true } | false,   la regla de «cuánto ha caído» junto a la pared, con el 0
 *                                 arriba; tiempos: rotula en turquesa las marcas de cada segundo entero
 *   blanco: { en: 30, tipo: 'balsa' | 'marca', texto },   algo en el piso a esa distancia
 *   pared: { en: 40, alto: 45 },  otro edificio enfrente, a esa distancia
 *   otra: { texto: 'se suelta' }, una segunda piedra que se suelta a la vez (cae recta junto a la pared), con su rastro
 *   niveles: true,                una línea tenue por cada marca, de la pared al objeto: mismas alturas a la vez
 *   guias: true,                  dos líneas tenues del objeto de ahora a sus dos reglas, con su marca violeta en cada una
 *   cotaAlto: { texto: '20 m' },  la altura de salida acotada junto a la pared (violeta; '?' va en tinta)
 *   cotaAlcance: { texto: '?', hasta: 30 },   lo que avanza de lado, acotado bajo el piso
 *   cortes: [{ t: 0 }, { t: 1, niveles: true }, …]   para «Mira»: estado.corte elige qué se agrega a los datos
 * Con ángulo (A3, A4) y con flechas (A2):
 *   plataforma: 'piso' | 'manguera',          sale a ras del piso (alto: 0): una pelota pateada, el chorro de una manguera
 *   vx: 15, vy: 20,               m/s: las componentes de la salida (vy, positiva hacia arriba); reemplazan a v0
 *   techo: 25,                    m: lo más alto que entra en el dibujo (por omisión, la altura máxima del camino)
 *   alturas: { modo: 'sube', … }, la regla de la pared mide la altura sobre el piso (y), con el 0 abajo
 *   angulo: { texto: '53°' },     el arco del ángulo de lanzamiento, en tinta
 *   flechas: { en: [1, 2], kv: 2, vx, vy, v, textos: { vx: '15 m/s', vy: '20 m/s', v: '?' }, siempre },
 *                                 las flechas de la velocidad en esos instantes (los ya pasados; siempre: todos): las dos
 *                                 componentes, discontinuas, y la que arman, entera; vx, vy o v: false quita esa flecha
 *   gravedad: { en: [1, 2], texto: 'g' },     la flecha carmín de la gravedad en esos instantes
 *   otros: [{ vx, vy, texto }],   otros caminos enteros, discontinuos, para comparar
 *   cotaH: { texto: '?' },        la altura máxima acotada en lo más alto
 *   blanco: { tipo: 'planta' | 'arco', alto: 2.44, … }
 *   reloj: { texto: 't = 2,5 s' }, el instante, en turquesa, arriba a la derecha
 *   alt
 * }
 * Marcas con clase, para que la unidad compruebe que lo que nombra su leyenda se dibuja: fis-tenue (objetos tenues),
 * fis-sombra (marcas violetas), fis-camino, fis-nivel, fis-salida (la flecha de v₀), fis-comp (una componente de la
 * velocidad), fis-vel (la velocidad entera), fis-aceleracion (g), fis-angulo, fis-otro, fis-distancia.
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
  const W = 320, M = 4, TAM = 14;
  const RX = 40;            // la regla de «cuánto ha caído»
  const X0 = 96;            // el borde de donde sale
  const Y0 = 46;            // la altura de salida
  const XFIN = W - 12;      // hasta dónde llega el piso
  const ALTO_MAX = 150;     // píxeles que puede ocupar la caída
  const n = T.n;
  const fmt = (v, d = 2) => Kit.formatear(v, d);
  const lim = (v, a, b) => Math.min(b, Math.max(a, v));

  // Caja de un rótulo (y = línea base), ya encajado en [4, W − 4]: la misma que se dibuja.
  function caja(x, y, texto, o = {}) {
    const tam = o.tam || TAM, peso = o.peso || 400, ancla = o.ancla || 'start';
    const w = T.ancho(String(texto), tam, peso), xx = T.encajar(x, String(texto), ancla, { tam, peso, min: M, max: W - M });
    const izq = ancla === 'middle' ? xx - w / 2 : ancla === 'end' ? xx - w : xx;
    return { x0: izq, x1: izq + w, y0: y - tam * 0.78, y1: y + tam * 0.22, texto: String(texto), x: xx, y, ancla, tam, peso, color: o.color, tipo: o.tipo || 'rotulo' };
  }
  const pinta = b => T.rotulo(b.x, b.y, b.texto, { ancla: b.ancla, tam: b.tam, peso: b.peso, color: b.color, min: M, max: W - M });

  // Los datos del paso de «Mira» (estado.corte) encima de los de base.
  function datosDe(datos, estado) {
    const d = datos || {};
    if (!Array.isArray(d.cortes) || !d.cortes.length) return d;
    const k = lim(Math.round((estado && estado.corte) || 0), 0, d.cortes.length - 1);
    return Object.assign({}, d, d.cortes[k]);
  }

  // El objeto que vuela, centrado en (x, y); tenue: solo el contorno, más claro.
  function cuerpo(tipo, x, y, tenue, lleno) {
    const op = tenue ? ' stroke-opacity="0.34"' : '', g = tenue ? 1.5 : 2.5;
    const fill = tenue ? 'none' : lleno ? 'currentColor' : 'var(--card)', fo = lleno && !tenue ? ' fill-opacity="0.38"' : '';
    if (tipo === 'paquete') return `<rect x="${n(x - 6)}" y="${n(y - 6)}" width="12" height="12" rx="2" fill="${fill}"${fo} stroke="currentColor" stroke-width="${g}"${op}/>`
      + (tenue ? '' : `<path d="M${n(x)} ${n(y - 6)}V${n(y + 6)}M${n(x - 6)} ${n(y)}H${n(x + 6)}" stroke="currentColor" stroke-width="1.2"/>`);
    if (tipo === 'canica') return `<circle cx="${n(x)}" cy="${n(y)}" r="4.5" fill="${fill}"${fo} stroke="currentColor" stroke-width="${tenue ? 1.5 : 2}"${op}/>`;
    if (tipo === 'pelota') return `<circle cx="${n(x)}" cy="${n(y)}" r="6.5" fill="${fill}"${fo} stroke="currentColor" stroke-width="${g}"${op}/>`
      + (tenue ? '' : `<path d="M${n(x - 4.5)} ${n(y - 2)}Q${n(x)} ${n(y + 2.5)} ${n(x + 4.5)} ${n(y - 2)}" fill="none" stroke="currentColor" stroke-width="1.2"/>`);
    // piedra: un canto rodado, más ancho que alto (cuatro curvas, sin esquinas)
    return `<path d="M${n(x - 7)} ${n(y + 0.5)}C${n(x - 7)} ${n(y - 4)} ${n(x - 3)} ${n(y - 5.5)} ${n(x + 1)} ${n(y - 5.5)}C${n(x + 5)} ${n(y - 5.5)} ${n(x + 7)} ${n(y - 2.5)} ${n(x + 7)} ${n(y + 1)}`
      + `C${n(x + 7)} ${n(y + 4)} ${n(x + 3.5)} ${n(y + 5.5)} ${n(x - 0.5)} ${n(y + 5.5)}C${n(x - 4.5)} ${n(y + 5.5)} ${n(x - 7)} ${n(y + 4)} ${n(x - 7)} ${n(y + 0.5)}Z" fill="${fill}"${fo} stroke="currentColor" stroke-width="${g}" stroke-linejoin="round"${op}/>`;
  }
  const RADIO = { piedra: 7, pelota: 6.5, canica: 4.5, paquete: 6, agua: 0 };
  // Flecha de una componente de la velocidad: más fina y discontinua, en naranja.
  function flechaC(x1, y1, x2, y2) {
    const ang = Math.atan2(y2 - y1, x2 - x1), ca = Math.cos(ang), sa = Math.sin(ang);
    const p = (dx, dy) => `${n(x2 + dx * ca - dy * sa)} ${n(y2 + dx * sa + dy * ca)}`;
    return `<g class="fis-comp"><line x1="${n(x1)}" y1="${n(y1)}" x2="${n(x2 - ca * 6)}" y2="${n(y2 - sa * 6)}" stroke="var(--c-o)" stroke-width="2" stroke-dasharray="4 3"/>`
      + `<path d="M${p(0, 0)}L${p(-8, 4)}L${p(-8, -4)}Z" fill="var(--c-o)"/></g>`;
  }
  // Punta abierta (dos trazos) para la aceleración, en carmín: otra punta que la de la velocidad (como en fis-mruv).
  function flechaA(x1, y1, x2, y2) {
    const ang = Math.atan2(y2 - y1, x2 - x1), ca = Math.cos(ang), sa = Math.sin(ang);
    const p = (dx, dy) => `${n(x2 + dx * ca - dy * sa)} ${n(y2 + dx * sa + dy * ca)}`;
    return `<g class="fis-aceleracion"><line x1="${n(x1)}" y1="${n(y1)}" x2="${n(x2 - ca * 1.5)}" y2="${n(y2 - sa * 1.5)}" stroke="var(--c-h)" stroke-width="3" stroke-linecap="round"/>`
      + `<path d="M${p(-9, -6)}L${p(0, 0)}L${p(-9, 6)}" fill="none" stroke="var(--c-h)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></g>`;
  }

  // De dónde sale: cada plataforma ocupa de x = 46 a X0 (la avioneta, solo su silueta en el punto de salida).
  function plataforma(tipo, YF, XL, B, YP, ang) {
    const ink = 'currentColor';
    if (tipo === 'piso') return { s: '', caja: null };
    if (tipo === 'manguera') {
      // la manguera tendida en el piso y su boquilla, que apunta con el ángulo del chorro (el agua sale de su punta)
      const ca = Math.cos(ang), sa = Math.sin(ang);
      const s = `<path d="M${M + 2} ${n(YF - 2)}H${n(XL - 6)}" fill="none" stroke="${ink}" stroke-width="3" stroke-linecap="round"/>`
        + `<path d="M${n(XL - 6)} ${n(YF - 2)}L${n(XL + 8 * ca)} ${n(YP - 8 * sa)}" stroke="${ink}" stroke-width="6" stroke-linecap="round"/>`;
      return { s: `<g class="kit-objeto" data-objeto="manguera" data-prueba="si">${s}</g>`, caja: { nombre: 'manguera', x0: M + 2, x1: XL + 3, y0: YP - 4, y1: YF } };
    }
    if (tipo === 'avioneta') {
      // de costado: el morro a la derecha, el ala alta con su montante, el timón de cola, la hélice y una rueda
      const x = XL - 34, y = YP - 1;
      const s = `<path d="M${x - 30} ${y - 2}L${x - 6} ${y - 7}H${x + 10}C${x + 17} ${y - 7} ${x + 21} ${y - 4} ${x + 21} ${y}C${x + 21} ${y + 4} ${x + 15} ${y + 6} ${x + 8} ${y + 6}H${x - 8}L${x - 30} ${y + 1}Z" fill="var(--card)" stroke="${ink}" stroke-width="2" stroke-linejoin="round"/>`
        + `<path d="M${x - 29} ${y - 2}L${x - 34} ${y - 14}H${x - 26}L${x - 19} ${y - 4}" fill="var(--card)" stroke="${ink}" stroke-width="2" stroke-linejoin="round"/>`
        + `<path d="M${x - 10} ${y - 12}H${x + 14}" stroke="${ink}" stroke-width="4" stroke-linecap="round"/><path d="M${x + 2} ${y - 12}V${y - 7}" stroke="${ink}" stroke-width="1.5"/>`
        + `<path d="M${x + 5} ${y - 4}H${x + 13}" stroke="${ink}" stroke-width="1.5" stroke-linecap="round"/>`
        + `<path d="M${x + 23} ${y - 8}V${y + 8}" stroke="${ink}" stroke-width="2" stroke-linecap="round"/>`
        + `<path d="M${x + 4} ${y + 6}V${y + 9}" stroke="${ink}" stroke-width="1.5"/><circle cx="${x + 4}" cy="${y + 11}" r="2.5" fill="var(--card)" stroke="${ink}" stroke-width="1.5"/>`;
      return { s: `<g class="kit-objeto" data-objeto="avioneta" data-prueba="si">${s}</g>`, caja: { nombre: 'avioneta', x0: x - 34, x1: x + 24, y0: y - 14, y1: y + 14 } };
    }
    if (tipo === 'mesa') {
      const s = `<rect x="46" y="${YP + B}" width="${X0 - 46}" height="6" rx="2" fill="${ink}" fill-opacity="0.16" stroke="${ink}" stroke-width="2"/>`
        + `<path d="M54 ${YP + B + 6}V${n(YF)}M${X0 - 8} ${YP + B + 6}V${n(YF)}" stroke="${ink}" stroke-width="3" stroke-linecap="round"/>`;
      return { s: `<g class="kit-objeto" data-objeto="mesa" data-prueba="si">${s}</g>`, caja: { nombre: 'mesa', x0: 45, x1: X0 + 1, y0: YP + B - 1, y1: YF } };
    }
    if (tipo === 'azotea' || tipo === 'muro') {
      let s = `<rect x="46" y="${YP + B}" width="${X0 - 46}" height="${n(YF - YP - B)}" fill="${ink}" fill-opacity="0.06" stroke="${ink}" stroke-width="2"/>`;
      if (tipo === 'azotea') {
        s += `<line x1="42" y1="${YP + B}" x2="${X0 + 3}" y2="${YP + B}" stroke="${ink}" stroke-width="3" stroke-linecap="round"/>`;
        const pisos = Math.max(1, Math.min(6, Math.floor((YF - YP - 14) / 24)));
        for (let k = 0; k < pisos; k++) { const y = YP + 16 + k * (YF - YP - 20) / pisos; for (const x of [54, 74]) s += `<rect x="${x}" y="${n(y)}" width="13" height="10" rx="1.5" fill="${ink}" fill-opacity="0.18" stroke="${ink}" stroke-width="1.2"/>`; }
      } else {
        // el caño: un tubo corto que sale del muro a la altura de salida
        s += `<rect x="${X0 - 4}" y="${YP - 4}" width="12" height="8" rx="1.5" fill="var(--card)" stroke="${ink}" stroke-width="2"/>`;
      }
      return { s: `<g class="kit-objeto" data-objeto="${tipo}" data-prueba="si">${s}</g>`, caja: { nombre: tipo, x0: 42, x1: X0 + 8, y0: YP - 4, y1: YF } };
    }
    // peña: el borde arriba, la cara que baja al agua con un saliente, y unas matas de ichu en el borde
    const s = `<path d="M46 ${n(YF + 3)}V${YP + B}H${X0}C${X0 + 3} ${YP + B} ${X0 + 4} ${YP + B + 4} ${X0 + 1} ${YP + B + 8}C${X0 - 5} ${n(YP + (YF - YP) * 0.35)} ${X0 - 2} ${n(YP + (YF - YP) * 0.6)} ${X0 - 9} ${n(YF + 3)}Z" fill="${ink}" fill-opacity="0.09" stroke="none"/>`
      + `<path d="M46 ${YP + B}H${X0}C${X0 + 3} ${YP + B} ${X0 + 4} ${YP + B + 4} ${X0 + 1} ${YP + B + 8}C${X0 - 5} ${n(YP + (YF - YP) * 0.35)} ${X0 - 2} ${n(YP + (YF - YP) * 0.6)} ${X0 - 9} ${n(YF + 3)}" fill="none" stroke="${ink}" stroke-width="2" stroke-linecap="round"/>`
      + `<path d="M52 ${YP + B}l-2 -6M55 ${YP + B}l1 -7M58 ${YP + B}l3 -5M70 ${YP + B}l-2 -5M73 ${YP + B}l1 -6" stroke="${ink}" stroke-width="1.3" stroke-linecap="round" fill="none"/>`;
    return { s: `<g class="kit-objeto" data-objeto="pena" data-prueba="si">${s}</g>`, caja: { nombre: 'pena', x0: 46, x1: X0 + 4, y0: YP, y1: YF + 3 } };
  }

  // ---------- Vista «plano»: un dron sobre las calles, visto desde arriba (idea A5) ----------
  // Afirmación: dos coordenadas, x hacia el este e y hacia el norte, dicen dónde está; cada una avanza con su velocidad.
  // datos = { vista: 'plano', max: 80, paso: 10, numero: 20, vx, vy, ax, ay, x0, y0, t, cada: 1, sombras, camino, guias,
  //           antena: { x, y, texto }, linea: { texto } (de la plaza al dron: la distancia; '?' en tinta), origen: 'plaza' }
  function plano(d) {
    const max = d.max > 0 ? d.max : 80, paso = d.paso > 0 ? d.paso : 10, num = d.numero > 0 ? d.numero : 2 * paso;
    const XI = 44, YT = 36, k = (W - 16 - XI) / max, YB = YT + k * max;   // el dron (11 de radio) cabe en el borde
    const X = m => XI + k * m, Y = m => YB - k * m;
    const vx = d.vx || 0, vy = d.vy || 0, ax = d.ax || 0, ay = d.ay || 0, x0 = d.x0 || 0, y0 = d.y0 || 0;
    const pos = q => ({ x: x0 + vx * q + ax * q * q / 2, y: y0 + vy * q + ay * q * q / 2 });
    const dentro = q => { const p = pos(q); return p.x >= -1e-9 && p.x <= max + 1e-9 && p.y >= -1e-9 && p.y <= max + 1e-9; };
    // el reloj se detiene donde el dron saldría del mapa
    let t = Math.max(0, d.t === undefined ? 0 : d.t);
    if (!dentro(t)) { let a = 0, b = t; for (let i = 0; i < 40; i++) { const m = (a + b) / 2; if (dentro(m)) a = m; else b = m; } t = a; }
    const rot = [], objetos = [], sombras = [], puntos = [];
    let s = '', calles = '';
    for (let m = 0; m <= max + 1e-9; m += paso) {
      calles += `<line x1="${n(X(m))}" y1="${n(YT)}" x2="${n(X(m))}" y2="${n(YB)}" stroke="currentColor" stroke-width="${m ? 1 : 2}" stroke-opacity="${m ? 0.16 : 1}"/>`
        + `<line x1="${XI}" y1="${n(Y(m))}" x2="${n(X(max))}" y2="${n(Y(m))}" stroke="currentColor" stroke-width="${m ? 1 : 2}" stroke-opacity="${m ? 0.16 : 1}"/>`;
      if (Math.abs(m / num - Math.round(m / num)) < 1e-9) {
        rot.push(caja(X(m), YB + 18, fmt(m), { ancla: 'middle', tipo: 'numero' }));
        if (m) rot.push(caja(XI - 7, Y(m) + 5, fmt(m), { ancla: 'end', tipo: 'numero' }));
      }
    }
    s += `<g class="fis-calles">${calles}</g>`;
    rot.push(caja(W - M, YB + 36, 'x (m), al este', { ancla: 'end', peso: 700, color: 'f', tipo: 'nombre' }));
    rot.push(caja(M, YT - 12, 'y (m), al norte', { peso: 700, color: 'f', tipo: 'nombre' }));
    // la plaza, en el origen: un cuadrado con su pileta
    s += `<g class="kit-objeto" data-objeto="plaza" data-prueba="si"><rect x="${n(X(0) - 7)}" y="${n(Y(0) - 7)}" width="14" height="14" rx="2" fill="var(--card)" stroke="currentColor" stroke-width="2"/><circle cx="${n(X(0))}" cy="${n(Y(0))}" r="2.5" fill="currentColor"/></g>`;
    objetos.push({ nombre: 'plaza', x0: X(0) - 7, x1: X(0) + 7, y0: Y(0) - 7, y1: Y(0) + 7 });
    if (d.antena) {
      const axp = X(d.antena.x), ayp = Y(d.antena.y);
      s += `<g class="kit-objeto" data-objeto="antena" data-prueba="si"><path d="M${n(axp - 6)} ${n(ayp + 6)}L${n(axp)} ${n(ayp - 9)}L${n(axp + 6)} ${n(ayp + 6)}M${n(axp - 3.5)} ${n(ayp)}H${n(axp + 3.5)}" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/><circle cx="${n(axp)}" cy="${n(ayp - 11)}" r="2" fill="currentColor"/></g>`;
      objetos.push({ nombre: 'antena', x0: axp - 6, x1: axp + 6, y0: ayp - 13, y1: ayp + 6 });
      if (d.antena.texto) rot.push(caja(axp + 10, ayp - 8, d.antena.texto, { tipo: 'blanco' }));
    }
    const ahora = pos(t), px = X(ahora.x), py = Y(ahora.y);
    if (d.camino && t > 0) { let c = ''; for (let i = 0; i <= 30; i++) { const q = pos(t * i / 30); c += `${i ? 'L' : 'M'}${n(X(q.x))} ${n(Y(q.y))}`; } s += `<path class="fis-camino" d="${c}" fill="none" stroke="currentColor" stroke-width="1.5" stroke-opacity="0.55"/>`; }
    const cada = d.cada > 0 ? d.cada : 0;
    if (cada) for (let i = 1; i * cada <= t + 1e-9 && i < 60; i++) {
      const q = pos(i * cada), cx = X(q.x), cy = Y(q.y);
      puntos.push({ t: i * cada, x: cx, y: cy });
      if (Math.abs(i * cada - t) > 1e-9) s += `<circle class="fis-tenue" cx="${n(cx)}" cy="${n(cy)}" r="4" fill="none" stroke="currentColor" stroke-width="1.5" stroke-opacity="0.4"/>`;
      if (d.sombras) { s += `<circle class="fis-sombra" cx="${n(cx)}" cy="${n(YB)}" r="3" fill="var(--c-f)"/><circle class="fis-sombra" cx="${XI}" cy="${n(cy)}" r="3" fill="var(--c-f)"/>`; sombras.push({ eje: 'x', t: i * cada, x: cx, y: YB }, { eje: 'y', t: i * cada, x: XI, y: cy }); }
    }
    if (d.guias && t > 0) s += `<path class="fis-guia" d="M${n(px)} ${n(py)}V${n(YB)}M${n(px)} ${n(py)}H${XI}" fill="none" stroke="var(--c-f)" stroke-width="1.5" stroke-dasharray="4 4"/><circle class="fis-sombra" cx="${n(px)}" cy="${n(YB)}" r="3.5" fill="var(--c-f)"/><circle class="fis-sombra" cx="${XI}" cy="${n(py)}" r="3.5" fill="var(--c-f)"/>`;
    if (d.linea && t > 0) {
      const esQ = d.linea.texto === '?';
      s += `<line class="fis-distancia" x1="${n(X(x0))}" y1="${n(Y(y0))}" x2="${n(px)}" y2="${n(py)}" stroke="${esQ ? 'currentColor' : 'var(--c-f)'}" stroke-width="2.5" stroke-dasharray="6 4"/>`;
      if (d.linea.texto) rot.push(caja((X(x0) + px) / 2 - 8, (Y(y0) + py) / 2 - 6, d.linea.texto, { ancla: 'end', peso: 700, color: esQ ? undefined : 'f', tipo: 'cota' }));
    }
    // el dron: cuatro hélices en cruz
    s += `<g class="kit-objeto" data-objeto="dron" data-prueba="si"><path d="M${n(px - 7)} ${n(py - 7)}L${n(px + 7)} ${n(py + 7)}M${n(px + 7)} ${n(py - 7)}L${n(px - 7)} ${n(py + 7)}" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>`
      + [[-7, -7], [7, -7], [-7, 7], [7, 7]].map(([a, b]) => `<circle cx="${n(px + a)}" cy="${n(py + b)}" r="4" fill="var(--card)" stroke="currentColor" stroke-width="1.5"/>`).join('')
      + `<circle cx="${n(px)}" cy="${n(py)}" r="3" fill="currentColor"/></g>`;
    objetos.push({ nombre: 'dron', x0: px - 11, x1: px + 11, y0: py - 11, y1: py + 11 });
    if (d.flechas) {
      const kv = d.flechas.kv > 0 ? d.flechas.kv : 5, tx = d.flechas.textos || {}, wx = vx + ax * t, wy = vy + ay * t;
      if (Math.abs(wx * kv) >= 6) { s += flechaC(px, py, px + wx * kv, py); if (tx.vx) rot.push(caja(px + wx * kv + 5, py + 5, tx.vx, { peso: 700, color: tx.vx === '?' ? undefined : 'o', tipo: 'vel' })); }
      if (Math.abs(wy * kv) >= 6) { s += flechaC(px, py, px, py - wy * kv); if (tx.vy) rot.push(caja(px - 7, py - wy * kv + 8, tx.vy, { ancla: 'end', peso: 700, color: tx.vy === '?' ? undefined : 'o', tipo: 'vel' })); }
      if (d.flechas.v !== false) { s += T.flecha(px, py, px + wx * kv, py - wy * kv, { color: 'o', grosor: 3, clase: 'fis-vel' }); if (tx.v) rot.push(caja(px + wx * kv + 6, py - wy * kv - 4, tx.v, { peso: 700, color: tx.v === '?' ? undefined : 'o', tipo: 'vel' })); }
    }
    if (d.reloj && d.reloj.texto) rot.push(caja(W - M, 20, d.reloj.texto, { ancla: 'end', peso: 700, color: 'i', tipo: 'reloj' }));
    return { W, M, H: Math.round(YB + 44), s, rotulos: rot, objetos, puntos, sombras, X, Y, k, t, pos: ahora };
  }

  function geometria(datos, estado = {}) {
    const d = datosDe(datos, estado);
    if (d.vista === 'plano') return plano(d);
    const tipo = d.plataforma || 'pena', obj = d.objeto || 'piedra', rr = RADIO[obj] === undefined ? 7 : RADIO[obj];
    const esPiso = tipo === 'piso' || tipo === 'manguera';
    const alto = d.alto === undefined ? (esPiso ? 0 : 20) : Math.max(0, d.alto), ancho = d.ancho > 0 ? d.ancho : 42, g = d.g > 0 ? d.g : 10, v0 = d.v0 >= 0 ? d.v0 : 0;
    // la velocidad de salida: v0 de lado (tiro horizontal), o sus dos componentes (vy, positiva hacia arriba)
    const vx = d.vx !== undefined ? d.vx : v0, vy0 = d.vy !== undefined ? d.vy : 0;
    const cima = vy0 > 0 ? vy0 * vy0 / (2 * g) : 0, techo = d.techo > 0 ? d.techo : Math.max(alto + cima, 1e-6);
    // el objeto sale un poco delante del borde; si otra piedra se suelta a la vez, esa va pegada a la pared
    const XD = X0 + 9, XL = esPiso ? (d.alturas ? 60 : 28) : d.otra ? X0 + 28 : XD;
    const k = Math.min((XFIN - XL) / ancho, (d.altoMax > 0 ? d.altoMax : ALTO_MAX) / techo);
    // YF: el piso; YL: el nivel de salida; Yh(y): una altura sobre el piso; Y(h): lo que ha bajado desde la salida
    const YF = Y0 + k * techo, YL = Math.round((YF - k * alto) * 100) / 100;
    const X = m => XL + k * m, Yh = y => YF - k * y, Y = h => YL + k * h;
    const tCae = (vy0 + Math.sqrt(vy0 * vy0 + 2 * g * alto)) / g;
    // si hay una pared enfrente, el vuelo termina en ella
    const tFin = d.pared && vx > 0 && d.pared.en / vx < tCae ? d.pared.en / vx : tCae;
    const t = lim(d.t === undefined ? 0 : d.t, 0, tFin);
    const pos = q => ({ x: vx * q, h: g * q * q / 2 - vy0 * q });
    const angSalida = Math.atan2(vy0, vx);
    const rot = [], objetos = [], sombras = [];
    let s = '';

    // ---- el piso (o el agua) y su regla ----
    const esAgua = tipo === 'pena';
    if (esAgua) {
      let w = `M${X0 - 12} ${n(YF)}`;
      for (let x = X0 - 12; x < W - M - 1; x += 12) w += `q3 -2.4 6 0t6 0`;
      s += `<path class="fis-agua" d="${w}" fill="none" stroke="currentColor" stroke-width="1.5" stroke-opacity="0.75"/>`;
    } else s += `<line class="fis-piso" x1="${tipo === 'avioneta' || esPiso ? M + 2 : 40}" y1="${n(YF)}" x2="${W - M}" y2="${n(YF)}" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>`;
    if (d.regla) {
      const paso = d.regla.paso > 0 ? d.regla.paso : 10, num = d.regla.numero > 0 ? d.regla.numero : paso;
      let r = '';
      for (let m = 0; m <= ancho + 1e-9; m += paso) {
        const mm = Math.round(m * 1e6) / 1e6, esN = Math.abs(mm / num - Math.round(mm / num)) < 1e-9;
        r += `<line x1="${n(X(mm))}" y1="${n(YF)}" x2="${n(X(mm))}" y2="${n(YF + (esN ? 6 : 4))}" stroke="currentColor" stroke-width="1"/>`;
        if (esN) rot.push(caja(X(mm), YF + 20, fmt(mm), { ancla: 'middle', tipo: 'numero' }));
      }
      s += `<g class="kit-regla">${r}</g>`;
      rot.push(caja(W - M, YF + 38, 'x (m)', { ancla: 'end', peso: 700, color: 'f', tipo: 'nombre' }));
    }
    // ---- la regla de la pared: «cuánto ha caído» desde la salida (h, hacia abajo) o, con modo 'sube', la altura sobre el
    // piso (y, hacia arriba) ----
    if (d.alturas) {
      const paso = d.alturas.paso > 0 ? d.alturas.paso : 5, num = d.alturas.numero > 0 ? d.alturas.numero : paso, sube = d.alturas.modo === 'sube';
      const y1 = sube ? Y0 : YL, hasta = sube ? techo : alto, Ym = m => (sube ? Yh(m) : Y(m));
      let r = `<line x1="${RX}" y1="${n(y1)}" x2="${RX}" y2="${n(YF)}" stroke="currentColor" stroke-width="1.5"/>`;
      for (let m = 0; m <= hasta + 1e-9; m += paso) {
        const mm = Math.round(m * 1e6) / 1e6, esN = Math.abs(mm / num - Math.round(mm / num)) < 1e-9;
        r += `<line x1="${RX - (esN ? 6 : 4)}" y1="${n(Ym(mm))}" x2="${RX}" y2="${n(Ym(mm))}" stroke="currentColor" stroke-width="1"/>`;
        if (esN) rot.push(caja(RX - 9, Ym(mm) + 5, fmt(mm), { ancla: 'end', tipo: 'numero' }));
      }
      s += `<g class="kit-regla">${r}</g>`;
      rot.push(caja(M, y1 - 22, sube ? 'y (m)' : 'h (m)', { peso: 700, color: 'f', tipo: 'nombre' }));
    }
    // ---- de dónde sale, y la pared de enfrente ----
    const pl = plataforma(tipo, YF, XL, obj === 'agua' ? 6 : Math.round(rr), YL, angSalida);
    s += pl.s; if (pl.caja) objetos.push(pl.caja);
    if (d.pared) {
      const px = X(d.pared.en), py = Math.max(Y0 - 20, YF - k * (d.pared.alto || alto)), pw = Math.min(26, W - M - px);
      let b = `<rect x="${n(px)}" y="${n(py)}" width="${n(pw)}" height="${n(YF - py)}" fill="currentColor" fill-opacity="0.06" stroke="currentColor" stroke-width="2"/>`;
      for (let y = py + 10; y < YF - 16; y += 22) b += `<rect x="${n(px + 7)}" y="${n(y)}" width="12" height="9" rx="1.5" fill="currentColor" fill-opacity="0.18" stroke="currentColor" stroke-width="1.2"/>`;
      s += `<g class="kit-objeto" data-objeto="pared" data-prueba="si">${b}</g>`;
      objetos.push({ nombre: 'pared', x0: px, x1: px + pw, y0: py, y1: YF });
    }
    if (d.blanco) {
      const bx = X(d.blanco.en);
      if (d.blanco.tipo === 'planta') {
        // una mata: el tallo y tres hojas
        s += `<g class="kit-objeto" data-objeto="planta" data-prueba="si"><path d="M${n(bx)} ${n(YF)}V${n(YF - 13)}M${n(bx)} ${n(YF - 6)}q-8 -1 -9 -9q8 0 9 9M${n(bx)} ${n(YF - 8)}q8 -1 9 -9q-8 0 -9 9M${n(bx)} ${n(YF - 13)}q-4 -5 0 -10q4 5 0 10" fill="var(--card)" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round" stroke-linecap="round"/></g>`;
        objetos.push({ nombre: 'planta', x0: bx - 9, x1: bx + 9, y0: YF - 23, y1: YF });
      } else if (d.blanco.tipo === 'arco') {
        // el arco de fútbol, de costado: el poste con su travesaño (alto, en metros) y la red que cae hacia atrás
        const ya = YF - k * (d.blanco.alto > 0 ? d.blanco.alto : 2.44);
        s += `<g class="kit-objeto" data-objeto="arco" data-prueba="si"><path d="M${n(bx)} ${n(YF)}V${n(ya)}H${n(bx + 5)}" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M${n(bx + 5)} ${n(ya)}L${n(bx + 13)} ${n(YF)}" stroke="currentColor" stroke-width="1.2" stroke-dasharray="2 2"/></g>`;
        objetos.push({ nombre: 'arco', x0: bx - 1, x1: bx + 13, y0: ya - 1, y1: YF });
      } else if (d.blanco.tipo === 'marca') s += `<path class="fis-blanco" d="M${n(bx - 6)} ${n(YF - 6)}L${n(bx + 6)} ${n(YF + 6)}M${n(bx + 6)} ${n(YF - 6)}L${n(bx - 6)} ${n(YF + 6)}" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>`;
      else {
        // balsa de totora: una medialuna larga y baja de atados, con las dos puntas levantadas
        const y = YF - 1;
        s += `<g class="kit-objeto" data-objeto="balsa" data-prueba="si"><path d="M${n(bx - 22)} ${n(y - 10)}C${n(bx - 18)} ${n(y - 2)} ${n(bx - 11)} ${n(y)} ${n(bx)} ${n(y)}C${n(bx + 11)} ${n(y)} ${n(bx + 18)} ${n(y - 2)} ${n(bx + 22)} ${n(y - 10)}`
          + `C${n(bx + 16)} ${n(y - 5)} ${n(bx + 9)} ${n(y - 4.5)} ${n(bx)} ${n(y - 4.5)}C${n(bx - 9)} ${n(y - 4.5)} ${n(bx - 16)} ${n(y - 5)} ${n(bx - 22)} ${n(y - 10)}Z" fill="var(--card)" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>`
          + `<path d="M${n(bx - 12)} ${n(y - 4.7)}v3.6M${n(bx - 4)} ${n(y - 4.5)}v4.3M${n(bx + 4)} ${n(y - 4.5)}v4.3M${n(bx + 12)} ${n(y - 4.7)}v3.6" stroke="currentColor" stroke-width="1.1"/></g>`;
        objetos.push({ nombre: 'balsa', x0: bx - 22, x1: bx + 22, y0: y - 10, y1: y });
      }
      if (d.blanco.texto) rot.push(caja(bx, YF - (d.blanco.tipo === 'planta' ? 28 : d.blanco.tipo === 'arco' ? k * (d.blanco.alto > 0 ? d.blanco.alto : 2.44) + 8 : 16), d.blanco.texto, { ancla: 'middle', tipo: 'blanco' }));
    }

    // ---- las marcas de cada tanto: objetos tenues, sus sombras y sus niveles ----
    const cada = d.cada > 0 ? d.cada : 0, marcas = [];
    if (cada) for (let i = 0; i * cada <= t + 1e-9 && i < 60; i++) marcas.push(Math.round(i * cada * 1e6) / 1e6);
    if (d.niveles) for (const q of marcas) if (q > 0) {
      const p = pos(q);
      s += `<line class="fis-nivel" x1="${d.alturas ? RX : XD}" y1="${n(Y(p.h))}" x2="${n(X(p.x))}" y2="${n(Y(p.h))}" stroke="currentColor" stroke-width="1" stroke-dasharray="3 4" stroke-opacity="0.45"/>`;
    }
    // otros caminos, enteros y discontinuos, para comparar (otro ángulo, otra rapidez): [{ vx, vy, texto }]
    for (const o of d.otros || []) {
      const wy = o.vy || 0, wx = o.vx || 0, tf = (wy + Math.sqrt(wy * wy + 2 * g * alto)) / g;
      let p = '';
      for (let i = 0; i <= 40; i++) { const q = tf * i / 40; p += `${i ? 'L' : 'M'}${n(X(wx * q))} ${n(Y(g * q * q / 2 - wy * q))}`; }
      s += `<path class="fis-otro" d="${p}" fill="none" stroke="currentColor" stroke-width="${obj === 'agua' ? 2.5 : 1.5}" stroke-dasharray="5 4" stroke-opacity="0.6"/>`;
      if (o.texto) { const ta = Math.max(0, wy / g); rot.push(caja(X(wx * ta), Y(g * ta * ta / 2 - wy * ta) - 8, o.texto, { ancla: 'middle', tipo: 'otro' })); }
    }
    // el camino: entero (discontinuo) o lo ya recorrido; el chorro de agua, más grueso
    const camino = (hasta, extra) => {
      let p = '';
      for (let i = 0; i <= 40; i++) { const q = pos(hasta * i / 40); p += `${i ? 'L' : 'M'}${n(X(q.x))} ${n(Y(q.h))}`; }
      return `<path class="fis-camino" d="${p}" fill="none" stroke="currentColor"${extra}/>`;
    };
    if (obj === 'agua') s += camino(tFin, ' stroke-width="3.5" stroke-linecap="round" stroke-opacity="0.6"');
    else if (d.camino === 'entero') s += camino(tFin, ' stroke-width="1.5" stroke-dasharray="4 5" stroke-opacity="0.5"');
    else if (d.camino === 'recorrido' && t > 0) s += camino(t, ' stroke-width="1.5" stroke-opacity="0.55"');
    const puntos = [];
    for (const q of marcas) {
      const p = pos(q), cx = X(p.x), cy = Y(p.h);
      puntos.push({ t: q, x: cx, y: cy });
      if (Math.abs(q - t) > 1e-9 && obj !== 'agua') s += `<g class="fis-tenue">${cuerpo(obj, cx, cy, true)}${d.otra ? cuerpo('piedra', XD, cy, true) : ''}</g>`;
      if (d.sombras && q > 0) {
        if (d.regla) { s += `<circle class="fis-sombra" cx="${n(cx)}" cy="${n(YF)}" r="3" fill="var(--c-f)"/>`; sombras.push({ eje: 'x', t: q, x: cx, y: YF }); }
        if (d.alturas) { s += `<circle class="fis-sombra" cx="${RX}" cy="${n(cy)}" r="3" fill="var(--c-f)"/>`; sombras.push({ eje: 'h', t: q, x: RX, y: cy }); }
      }
      // el reloj de cada segundo entero, en turquesa, junto a su marca de la pared: debajo de su nivel (arriba, el borde
      // de la peña queda muy cerca del primero), salvo el que cae en el piso, que va encima
      if (d.alturas && d.alturas.tiempos && d.alturas.modo !== 'sube' && q > 0 && Math.abs(q - Math.round(q)) < 1e-9) rot.push(caja(RX + 9, cy > YF - 20 ? cy - 7 : cy + 16, `${fmt(q)} s`, { peso: 700, color: 'i', tipo: 'tiempo' }));
    }
    // ---- el objeto de ahora, la piedra que se suelta y la flecha de salida ----
    const ahora = pos(t), ax = X(ahora.x), ay = Y(ahora.h);
    let salida = null;
    if (d.guias && t > 0) {
      if (d.regla) { s += `<line class="fis-guia" x1="${n(ax)}" y1="${n(ay)}" x2="${n(ax)}" y2="${n(YF)}" stroke="var(--c-f)" stroke-width="1.5" stroke-dasharray="4 4"/><circle class="fis-sombra" cx="${n(ax)}" cy="${n(YF)}" r="3.5" fill="var(--c-f)"/>`; sombras.push({ eje: 'x', t, x: ax, y: YF }); }
      if (d.alturas) { s += `<line class="fis-guia" x1="${RX}" y1="${n(ay)}" x2="${n(ax)}" y2="${n(ay)}" stroke="var(--c-f)" stroke-width="1.5" stroke-dasharray="4 4"/><circle class="fis-sombra" cx="${RX}" cy="${n(ay)}" r="3.5" fill="var(--c-f)"/>`; sombras.push({ eje: 'h', t, x: RX, y: ay }); }
    }
    if (d.otra) {
      s += `<g class="kit-objeto" data-objeto="soltada" data-prueba="si">${cuerpo('piedra', XD, ay, false, true)}</g>`;
      objetos.push({ nombre: 'soltada', x0: XD - 7, x1: XD + 7, y0: ay - 5.5, y1: ay + 5.5 });
      // su rótulo, a la izquierda, sobre el borde (solo antes de soltarla: después ahí cae la piedra)
      if (d.otra.texto && t === 0) rot.push(caja(XD - 11, YL - 8, d.otra.texto, { ancla: 'end', tipo: 'otra' }));
    }
    if (obj !== 'agua') {
      s += `<g class="kit-objeto" data-objeto="${obj}" data-prueba="si">${cuerpo(obj, ax, ay, false)}</g>`;
      objetos.push({ nombre: obj, x0: ax - rr, x1: ax + rr, y0: ay - rr, y1: ay + rr });
    }
    if (d.flecha && vy0 === 0) {
      // 3 px por cada m/s (de 5 m/s en adelante el largo es proporcional: se arrastra su punta en el juego)
      const L = lim(vx * 3, 15, 66), fy = YL - 12, fx = XL - 2;
      salida = { x: fx + L, y: fy, x0: fx, kv: 3 };
      s += T.flecha(fx, fy, fx + L, fy, { color: 'o', grosor: 3, clase: 'fis-salida' });
      if (d.flecha.texto) rot.push(caja(fx, fy - 9, d.flecha.texto, { peso: 700, color: d.flecha.texto === '?' ? undefined : 'o', tipo: 'flecha' }));
    } else if (d.flecha) {
      // con ángulo: sale del objeto, a lo largo de la velocidad de salida; su rótulo, pasando la punta
      const ca = Math.cos(angSalida), sa = Math.sin(angSalida), L = lim(Math.hypot(vx, vy0) * 3, 30, 72);
      const x1 = XL + ca * (rr + 3), y1 = YL - sa * (rr + 3), x2 = x1 + ca * L, y2 = y1 - sa * L;
      salida = { x: x2, y: y2, x0: x1, y0: y1 };
      s += T.flecha(x1, y1, x2, y2, { color: 'o', grosor: 3, clase: 'fis-salida' });
      if (d.flecha.texto) rot.push(caja(x2, Math.max(y2 - 9, M + 12), d.flecha.texto, { ancla: 'middle', peso: 700, color: d.flecha.texto === '?' ? undefined : 'o', tipo: 'flecha' }));
    }
    // el ángulo de lanzamiento, en tinta: su arco desde la horizontal y su rótulo
    if (d.angulo && vy0 > 0) {
      const r = 24, a2 = angSalida / 2;
      s += `<path class="fis-angulo" d="M${n(XL)} ${n(YL)}H${n(XL + 42)}" stroke="currentColor" stroke-width="1" stroke-dasharray="3 3"/>`
        + `<path class="fis-angulo" d="M${n(XL + r)} ${n(YL)}A${r} ${r} 0 0 0 ${n(XL + r * Math.cos(angSalida))} ${n(YL - r * Math.sin(angSalida))}" fill="none" stroke="currentColor" stroke-width="1.5"/>`;
      if (d.angulo.texto) rot.push(caja(XL + (r + 8) * Math.cos(a2), YL - (r + 8) * Math.sin(a2) + 5, d.angulo.texto, { tipo: 'angulo' }));
    }
    // las flechas de la velocidad en los instantes pedidos: de lado y hacia arriba o abajo (componentes, discontinuas) y
    // la que arman las dos (entera); los rótulos, solo en el último instante dibujado
    if (d.flechas) {
      const F = d.flechas, kv = F.kv > 0 ? F.kv : 2, tx = F.textos || {};
      const veces = (Array.isArray(F.en) ? F.en : [t]).filter(q => F.siempre || q <= t + 1e-9);
      veces.forEach((q, i) => {
        const p = pos(q), cx = X(p.x), cy = Y(p.h), wy = vy0 - g * q, ex = cx + vx * kv, ey = cy - wy * kv, fin = i === veces.length - 1;
        const col = v => (v === '?' ? undefined : 'o');
        if (F.vx !== false && Math.abs(vx * kv) >= 6) { s += flechaC(cx, cy, ex, cy); if (fin && tx.vx) rot.push(caja(ex + 5, YF - cy < 14 ? cy - 7 : cy + 5, tx.vx, { peso: 700, color: col(tx.vx), tipo: 'vel' })); }   // a ras del piso, encima de la línea
        if (F.vy !== false && Math.abs(wy * kv) >= 6) {
          s += flechaC(cx, cy, cx, ey);
          // a la izquierda de la flecha; si ahí está la regla de la pared, a su derecha, más abajo que la punta
          // a la izquierda de la flecha; si ahí no cabe (la regla de la pared o el borde), sobre su punta (o bajo ella)
          if (fin && tx.vy) { const w = T.ancho(String(tx.vy), TAM, 700), x0 = cx - 7 - w;
            rot.push(x0 < (d.alturas ? RX + 8 : M) ? caja(cx, wy > 0 ? ey - 7 : ey + 16, tx.vy, { ancla: 'middle', peso: 700, color: col(tx.vy), tipo: 'vel' })
              : caja(cx - 7, ey + (wy < 0 ? 4 : 8), tx.vy, { ancla: 'end', peso: 700, color: col(tx.vy), tipo: 'vel' })); }
        }
        if (F.v !== false && Math.hypot(vx, wy) * kv >= 6) { s += T.flecha(cx, cy, ex, ey, { color: 'o', grosor: 3, clase: 'fis-vel' }); if (fin && tx.v) rot.push(caja(ex + 6, ey + (wy < 0 ? 14 : -4), tx.v, { peso: 700, color: col(tx.v), tipo: 'vel' })); }
      });
    }
    // la gravedad en los instantes pedidos: la misma flecha carmín, hacia abajo, con punta abierta
    if (d.gravedad) {
      const veces = (Array.isArray(d.gravedad.en) ? d.gravedad.en : [t]).filter(q => q <= t + 1e-9);
      veces.forEach((q, i) => {
        const p = pos(q), cx = X(p.x) - 14, cy = Y(p.h);
        s += flechaA(cx, cy - 4, cx, cy + 22);
        if (i === veces.length - 1 && d.gravedad.texto) rot.push(caja(cx - 7, cy + 14, d.gravedad.texto, { ancla: 'end', peso: 700, color: 'h', tipo: 'g' }));
      });
    }
    // ---- cotas de los ejemplos: la altura junto a la pared y lo que avanza bajo el piso ----
    if (d.cotaAlto) {
      const cx = tipo === 'avioneta' ? M + 22 : XL + 16, c = d.cotaAlto.texto === '?' ? 'currentColor' : 'var(--c-f)';
      // lo que se pide («?») va en tinta y con la línea discontinua, para que no se lea como otra pared
      s += `<path class="fis-cota" d="M${cx - 5} ${YL}H${cx + 5}M${cx - 5} ${n(YF)}H${cx + 5}" stroke="${c}" stroke-width="2" stroke-linecap="round" fill="none"/>`
        + `<path class="fis-cota" d="M${cx} ${YL}V${n(YF)}" stroke="${c}" stroke-width="2"${d.cotaAlto.texto === '?' ? ' stroke-dasharray="5 4"' : ' stroke-linecap="round"'} fill="none"/>`;
      rot.push(caja(cx + 8, (YL + YF) / 2 + 5, d.cotaAlto.texto, { peso: 700, color: d.cotaAlto.texto === '?' ? undefined : 'f', tipo: 'cota' }));
    }
    if (d.cotaAlcance) {
      const x2 = X(d.cotaAlcance.hasta > 0 ? d.cotaAlcance.hasta : ancho * 0.8), cy = YF + 14, c = d.cotaAlcance.texto === '?' ? 'currentColor' : 'var(--c-f)';
      s += `<path class="fis-cota" d="M${n(XL)} ${n(cy - 5)}V${n(cy + 5)}M${n(x2)} ${n(cy - 5)}V${n(cy + 5)}" stroke="${c}" stroke-width="2" stroke-linecap="round" fill="none"/>`
        + `<path class="fis-cota" d="M${n(XL)} ${n(cy)}H${n(x2)}" stroke="${c}" stroke-width="2"${d.cotaAlcance.texto === '?' ? ' stroke-dasharray="5 4"' : ' stroke-linecap="round"'} fill="none"/>`;
      rot.push(caja((XL + x2) / 2, cy + 20, d.cotaAlcance.texto, { ancla: 'middle', peso: 700, color: d.cotaAlcance.texto === '?' ? undefined : 'f', tipo: 'cota' }));
    }
    // la altura máxima, acotada en lo más alto del camino (del piso a la cima)
    if (d.cotaH && vy0 > 0) {
      const ta = vy0 / g, cx = X(vx * ta), yc = Yh(alto + cima), c = d.cotaH.texto === '?' ? 'currentColor' : 'var(--c-f)';
      s += `<path class="fis-cota" d="M${n(cx - 5)} ${n(yc)}H${n(cx + 5)}M${n(cx - 5)} ${n(YF)}H${n(cx + 5)}" stroke="${c}" stroke-width="2" stroke-linecap="round" fill="none"/>`
        + `<path class="fis-cota" d="M${n(cx)} ${n(yc)}V${n(YF)}" stroke="${c}" stroke-width="2"${d.cotaH.texto === '?' ? ' stroke-dasharray="5 4"' : ' stroke-linecap="round"'} fill="none"/>`;
      rot.push(caja(cx + 8, (yc + YF) / 2 + 5, d.cotaH.texto, { peso: 700, color: d.cotaH.texto === '?' ? undefined : 'f', tipo: 'cota' }));
    }
    // el reloj, arriba a la derecha: el instante que se dibuja, en turquesa (el texto lo trae quien llama)
    if (d.reloj && d.reloj.texto) rot.push(caja(W - M, 20, d.reloj.texto, { ancla: 'end', peso: 700, color: 'i', tipo: 'reloj' }));
    const H = Math.round(YF + (d.regla || d.cotaAlcance ? 46 : 14));
    return { W, M, H, s, rotulos: rot, objetos, puntos, sombras, X, Y, Yh, k, XL, XD, Y0, YL, YF, RX, t, tFin, tCae, salida };
  }

  // Subíndices de verdad en los rótulos (como en la pieza flechas): «v_x» se dibuja con la x más chica y más abajo.
  const SUB = /([A-Za-z])_([A-Za-z0-9]{1,3})/g;
  function conSubindices(svg) {
    return svg.replace(/(<text\b[^>]*>)([^<]*)(<\/text>)/g, (m, a, t, c) => {
      if (!SUB.test(t)) return m;
      SUB.lastIndex = 0;
      let out = '', k = 0, abajo = false;
      t.replace(SUB, (mm, l, sb, i) => {
        const antes = t.slice(k, i) + l;
        out += abajo ? `<tspan dy="-.252em">${antes}</tspan>` : antes;
        out += `<tspan font-size="72%" dy=".35em">${sb}</tspan>`;
        abajo = true; k = i + mm.length; return mm;
      });
      const resto = t.slice(k);
      if (resto) out += `<tspan dy="-.252em">${resto}</tspan>`;
      return a + out + c;
    });
  }
  function dibujar(datos, estado = {}) {
    const g = geometria(datos, estado);
    return conSubindices(T.svg(W, g.H, `<g data-prueba="si">${g.s}${g.rotulos.map(pinta).join('')}</g>`, { alt: alt(datos, estado) }));
  }
  function alt(datos, estado = {}) {
    const d = datosDe(datos, estado);
    if (d.alt) return d.alt;
    if (d.vista === 'plano') return `Un dron visto desde arriba, sobre las calles: sale de la plaza y avanza hacia el este y hacia el norte${d.antena ? '; más allá hay una antena' : ''}.`;
    if (d.plataforma === 'manguera') return 'El chorro de agua de una manguera, que sale con ángulo, sube y cae más allá en el piso.';
    if (d.plataforma === 'piso') return `${{ piedra: 'Una piedra', pelota: 'Una pelota', canica: 'Una canica', paquete: 'Un paquete', agua: 'Un chorro de agua' }[d.objeto || 'piedra']} sale del piso con ángulo, sube y vuelve a caer más allá.`;
    const de = { pena: 'una peña a orillas del lago', mesa: 'el borde de una mesa', azotea: 'la azotea de un edificio', muro: 'un caño en un muro', avioneta: 'una avioneta en vuelo' }[d.plataforma || 'pena'];
    const que = { piedra: 'Una piedra', pelota: 'Una pelota', canica: 'Una canica', paquete: 'Un paquete', agua: 'Un chorro de agua' }[d.objeto || 'piedra'];
    return `${que} sale ${d.vy ? 'con ángulo' : 'de lado'} desde ${de}${d.otra ? ', y otra piedra se suelta a la vez desde el mismo lugar' : ''}${d.blanco && (!d.blanco.tipo || d.blanco.tipo === 'balsa') ? '; en el agua flota una balsa de totora' : ''}.`;
  }

  return { id: 'fis-tiro', dibujar, alt, geometria, constantes: { W, M, RX, X0, Y0, XFIN, ALTO_MAX } };
});
