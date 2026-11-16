/*
 * Pieza «fis-objeto» (16 nov 2026): los dibujos de los ejemplos resueltos (pestaña «Ejemplos», docs/teoria.md 4h).
 * Un objeto de la vida real con el dato del problema escrito junto a lo que mide. Dibujos de prueba (data-prueba):
 * Gerson decide después cuáles reemplaza (docs/plan-calidad.md, M4).
 *
 * datos = { objeto, color: 'o', …lo propio de cada objeto }
 *   cancha   { largo: '105 m' }                     una cancha de fútbol vista desde arriba, con su largo acotado
 *   bebe     { pantalla: '3,4 kg' }                 un bebé sobre una balanza con pantalla
 *   reloj    { minutos: 45, texto: '45 min' }       un reloj con el arco de los minutos pintado
 *   lapiz    { cm: 17.5 }                           un lápiz sobre una regla en cm con sus milímetros
 *   camion   { carga: '12 t' }                      un camión con la carga rotulada
 *   atleta   { distancia: '100 m', tiempo: '10 s' } una pista con un corredor, la distancia y un cronómetro
 *   caracol  { texto: '3 mm en cada segundo' }      un caracol sobre una regla
 *   corazon  { texto: '72 latidos en un minuto' }   un corazón con su pulso
 *   comparar { barras: [{ nombre, valor, texto, color }], titulo }   barras horizontales a una misma escala
 *   sol      { texto: '300 000 000 m en cada segundo' }  el Sol y un rayo de luz hacia la Tierra
 *   cabello  { texto: '70 μm' }                     un cabello visto con lupa, con su grosor acotado
 * Áreas y volúmenes (16 nov):
 *   terreno  { largo, ancho, texto, cuadrado }      una chacra con cerca vista desde arriba, sus lados acotados y su área en el centro
 *   botella  { texto: '2,5 L', nombre }             una botella con agua; lo que guarda, rotulado al costado
 *   tanque   { texto: '1,1 m³', nombre, altura }    el tanque de agua sobre el techo; con altura, una flecha desde el suelo
 *   jeringa  { ml: 2.5, max: 5, texto: '2,5 mL' }   una jeringa con su escala en mL y el líquido hasta el émbolo
 *   hoja     { ancho: '21 cm', alto: '29,7 cm', texto }   una hoja de cuaderno con ancho y alto acotados y su área
 *   piso     { largo, ancho, loseta, nx, ny }        el piso de un aula con nx × ny losetas y una loseta ampliada con su lado
 *   piscina  { largo, ancho, hondo }                 una piscina en perspectiva: una caja de agua con sus tres medidas
 *   bloque   { material: 'adobe'|'hielo', largo, ancho, alto, texto, nombre }   un bloque de material; texto: su densidad o su masa
 *   cano     { texto: '12 L/min', nombre }           un caño que llena un balde, con su caudal junto al chorro
 *   plano    { ancho: '8 cm', alto: '6 cm', escala: '1 : 50' }   el plano de un dormitorio, con puerta, ventana y su escala
 *   techo    { largo, ancho, lluvia: '12 mm' }       lluvia sobre un techo plano: la capa de agua encima, las medidas del techo
 *   lago     { nombre: 'Lago Titicaca', texto }      un lago visto desde arriba, con una isla y una balsa de totora
 * Análisis dimensional (16 nov):
 *   pendulo  { largo: 'ℓ', g: 'g', texto }          un péndulo con su largo junto al hilo y la flecha de la gravedad
 *   planetas { m1: 'm₁', m2: 'm₂', d: 'd', fuerza: 'F' }   dos masas que se atraen, con la distancia entre centros acotada
 *   caja     { masa: '40 kg', fuerza: 'F', aceleracion: 'a' }   una caja empujada sobre el piso, con F y a como flechas
 *   presion  { fuerza: 'F', area: 'A', texto }      una caja sobre el piso: su peso F encima y la presión repartida bajo su base A
 *   deposito { altura: 'h', texto: 'P', superficie: 'P₀', colorAltura }   un tanque visto por dentro: la profundidad h del punto del fondo
 *   viento   { v, fuerza, area, aire }               una combi de costado: el aire choca con su frente (A) y la frena (F)
 * Cada objeto nuevo lleva en su comentario la afirmación de su dibujo, en una línea.
 * estado = {} (sin pasos). Función pura de (datos, estado): sin ids, sin azar, sin reloj.
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
  const W = 320, H = 210;
  const n = T.n;
  const tinta = (o = {}) => `stroke="currentColor" stroke-width="${o.g || 2}" stroke-linejoin="round" stroke-linecap="round"`;
  const obj = (nombre, s) => `<g class="kit-objeto" data-objeto="${nombre}" data-prueba="si">${s}</g>`;
  const dato = (x, y, t, c, o = {}) => T.rotulo(x, y, t, Object.assign({ ancla: 'middle', tam: 16, peso: 800, color: c, min: 4, max: W - 4 }, o));

  // Cota vertical: línea con topes y el rótulo horizontal a un lado (lado: 'izq' | 'der'), centrado en su alto.
  const cotaV = (x, y1, y2, t, c, lado = 'izq') => {
    const col = T.color(c);
    let s = `<line x1="${n(x)}" y1="${n(y1)}" x2="${n(x)}" y2="${n(y2)}" stroke="${col}" stroke-width="2" stroke-linecap="round"/>`
      + `<line x1="${n(x - 6)}" y1="${n(y1)}" x2="${n(x + 6)}" y2="${n(y1)}" stroke="${col}" stroke-width="2" stroke-linecap="round"/>`
      + `<line x1="${n(x - 6)}" y1="${n(y2)}" x2="${n(x + 6)}" y2="${n(y2)}" stroke="${col}" stroke-width="2" stroke-linecap="round"/>`;
    if (t) s += T.rotulo(lado === 'izq' ? x - 10 : x + 10, (y1 + y2) / 2 + 6, t, { ancla: lado === 'izq' ? 'end' : 'start', tam: 16, peso: 600, color: c, min: 4, max: W - 4 });
    return s;
  };
  // Cota oblicua (la profundidad de una caja en perspectiva): línea con topes cortos perpendiculares.
  const cotaO = (x1, y1, x2, y2, c) => {
    const col = T.color(c), L = Math.hypot(x2 - x1, y2 - y1) || 1, px = -(y2 - y1) / L * 5, py = (x2 - x1) / L * 5;
    return `<line x1="${n(x1)}" y1="${n(y1)}" x2="${n(x2)}" y2="${n(y2)}" stroke="${col}" stroke-width="2" stroke-linecap="round"/>`
      + `<line x1="${n(x1 - px)}" y1="${n(y1 - py)}" x2="${n(x1 + px)}" y2="${n(y1 + py)}" stroke="${col}" stroke-width="2" stroke-linecap="round"/>`
      + `<line x1="${n(x2 - px)}" y1="${n(y2 - py)}" x2="${n(x2 + px)}" y2="${n(y2 + py)}" stroke="${col}" stroke-width="2" stroke-linecap="round"/>`;
  };
  // Caja en perspectiva caballera: frente (x, y, w, h) y fondo corrido (dx, dy), con un relleno por cara.
  const pts = ps => ps.map(p => `${n(p[0])} ${n(p[1])}`).join('L');
  function prisma(x, y, w, h, dx, dy, rel) {
    const cara = (ps, f) => `<path d="M${pts(ps)}Z" fill="${f[0]}" fill-opacity="${f[1]}" ${tinta()}/>`;
    return cara([[x, y], [x + w, y], [x + w + dx, y + dy], [x + dx, y + dy]], rel.arriba)
      + cara([[x + w, y], [x + w + dx, y + dy], [x + w + dx, y + h + dy], [x + w, y + h]], rel.lado)
      + cara([[x, y], [x + w, y], [x + w, y + h], [x, y + h]], rel.frente);
  }
  // Texto sobre una etiqueta del color de la tarjeta (se lee encima de cuadrículas y surcos).
  const etiqueta = (x, y, t, c, tam = 16) => {
    const w = T.ancho(t, tam, 800) + 12;
    return `<rect x="${n(x - w / 2)}" y="${n(y - tam - 1)}" width="${n(w)}" height="${n(tam + 8)}" rx="6" fill="var(--card)" stroke="${T.color(c)}" stroke-width="1.5"/>`
      + T.rotulo(x, y, t, { ancla: 'middle', tam, peso: 800, color: c, min: 4, max: W - 4 });
  };

  const OBJETOS = {
    cancha(d, c) {
      const x0 = 30, x1 = 290, y0 = 40, y1 = 150, mx = (x0 + x1) / 2, my = (y0 + y1) / 2;
      let s = `<rect x="${x0}" y="${y0}" width="${x1 - x0}" height="${y1 - y0}" rx="4" fill="var(--c-d)" fill-opacity="0.18" ${tinta()} fill-rule="evenodd"/>`;
      s += `<line x1="${mx}" y1="${y0}" x2="${mx}" y2="${y1}" ${tinta({ g: 1.5 })}/><circle cx="${mx}" cy="${my}" r="18" fill="none" ${tinta({ g: 1.5 })}/>`;
      for (const x of [x0, x1]) { const dx = x === x0 ? 1 : -1; s += `<rect x="${x === x0 ? x : x - 34}" y="${my - 30}" width="34" height="60" fill="none" ${tinta({ g: 1.5 })}/><rect x="${x === x0 ? x - 6 : x}" y="${my - 12}" width="6" height="24" fill="currentColor" fill-opacity="0.3" ${tinta({ g: 1.5 })}/>`; void dx; }
      s = obj('cancha', s);
      s += T.cota(x0, x1, y1 + 22, { texto: d.largo || '', color: c, lado: 'abajo' });
      return s;
    },
    bebe(d, c) {
      let s = `<rect x="70" y="120" width="180" height="46" rx="10" fill="var(--card)" ${tinta()}/>`;
      s += `<rect x="128" y="132" width="64" height="24" rx="4" fill="currentColor" fill-opacity="0.08" ${tinta({ g: 1.5 })}/>`;
      // bandeja y bebé envuelto
      s += `<path d="M80 120 Q160 96 240 120" fill="none" ${tinta()}/>`;
      s += `<ellipse cx="170" cy="96" rx="52" ry="18" fill="var(--c-i)" fill-opacity="0.18" ${tinta()}/>`;
      s += `<circle cx="112" cy="90" r="16" fill="var(--card)" ${tinta()}/><path d="M106 92 Q112 97 118 92" fill="none" ${tinta({ g: 1.5 })}/>`;
      s = obj('bebe', s);
      s += T.rotulo(160, 150, d.pantalla || '', { ancla: 'middle', tam: 16, peso: 800, color: c });
      return s;
    },
    reloj(d, c) {
      const cx = 160, cy = 98, r = 70, m = Math.max(0, Math.min(60, d.minutos || 0)), a = m / 60 * 2 * Math.PI;
      let s = `<circle cx="${cx}" cy="${cy}" r="${r}" fill="var(--card)" ${tinta({ g: 3 })}/>`;
      if (m > 0) {
        const x = cx + r * 0.86 * Math.sin(a), y = cy - r * 0.86 * Math.cos(a);
        s += m >= 60 ? `<circle cx="${cx}" cy="${cy}" r="${r * 0.86}" fill="${T.color(c)}" fill-opacity="0.25"/>`
          : `<path d="M${cx} ${cy}L${cx} ${n(cy - r * 0.86)}A${n(r * 0.86)} ${n(r * 0.86)} 0 ${m > 30 ? 1 : 0} 1 ${n(x)} ${n(y)}Z" fill="${T.color(c)}" fill-opacity="0.25"/>`;
      }
      for (let k = 0; k < 12; k++) { const b = k / 12 * 2 * Math.PI; s += `<line x1="${n(cx + r * 0.88 * Math.sin(b))}" y1="${n(cy - r * 0.88 * Math.cos(b))}" x2="${n(cx + r * Math.sin(b))}" y2="${n(cy - r * Math.cos(b))}" ${tinta({ g: k % 3 ? 1.5 : 3 })}/>`; }
      s += `<line x1="${cx}" y1="${cy}" x2="${cx}" y2="${cy - r * 0.78}" ${tinta({ g: 3 })}/><line x1="${cx}" y1="${cy}" x2="${n(cx + r * 0.78 * Math.sin(a))}" y2="${n(cy - r * 0.78 * Math.cos(a))}" stroke="${T.color(c)}" stroke-width="3" stroke-linecap="round"/>`;
      s += `<circle cx="${cx}" cy="${cy}" r="4" fill="currentColor"/>`;
      s = obj('reloj', s);
      s += dato(cx, H - 10, d.texto || '', c);
      return s;
    },
    lapiz(d, c) {
      const x0 = 30, cm = Math.max(1, Math.min(20, d.cm || 10)), pxcm = 260 / 20, y = 120;
      let s = `<rect x="${x0 - 6}" y="${y}" width="${20 * pxcm + 12}" height="44" rx="4" fill="var(--c-o)" fill-opacity="0.1" ${tinta()}/>`;
      for (let k = 0; k <= 200; k++) { const x = x0 + k * pxcm / 10, L = k % 10 === 0 ? 16 : k % 5 === 0 ? 11 : 6; s += `<line x1="${n(x)}" y1="${y}" x2="${n(x)}" y2="${y + L}" stroke="currentColor" stroke-width="${k % 10 === 0 ? 1.4 : 0.6}"/>`; }
      for (let k = 0; k <= 20; k += 5) s += T.rotulo(x0 + k * pxcm, y + 34, String(k), { ancla: 'middle', tam: 14 });
      const xf = x0 + cm * pxcm;
      s += `<path d="M${x0} ${y - 30}L${n(xf - 16)} ${y - 30}L${n(xf)} ${y - 21}L${n(xf - 16)} ${y - 12}L${x0} ${y - 12}Z" fill="var(--c-h)" fill-opacity="0.25" ${tinta()}/>`;
      s += `<path d="M${n(xf - 6)} ${y - 24}L${n(xf)} ${y - 21}L${n(xf - 6)} ${y - 18}Z" fill="currentColor"/><rect x="${x0}" y="${y - 30}" width="14" height="18" fill="var(--c-f)" fill-opacity="0.35" ${tinta({ g: 1.5 })}/>`;
      s = obj('lapiz', s);
      s += `<line x1="${n(xf)}" y1="${y - 8}" x2="${n(xf)}" y2="${y + 20}" stroke="${T.color(c)}" stroke-width="2" stroke-dasharray="3 3"/>`;
      s += dato(xf, y - 44, `${Kit.formatear(cm, 1)} cm`, c);
      return s;
    },
    camion(d, c) {
      let s = `<rect x="40" y="70" width="170" height="80" rx="6" fill="var(--c-o)" fill-opacity="0.14" ${tinta()}/>`;
      s += `<path d="M210 95 L258 95 L280 122 L280 150 L210 150 Z" fill="var(--card)" ${tinta()}/><path d="M220 103 L252 103 L268 122 L220 122 Z" fill="currentColor" fill-opacity="0.15" ${tinta({ g: 1.5 })}/>`;
      for (const x of [80, 172, 250]) s += `<circle cx="${x}" cy="158" r="14" fill="currentColor"/><circle cx="${x}" cy="158" r="5" fill="var(--card)"/>`;
      for (let k = 0; k < 6; k++) s += `<ellipse cx="${62 + k * 26}" cy="66" rx="14" ry="9" fill="var(--c-o)" fill-opacity="0.35" ${tinta({ g: 1.5 })}/>`;
      s = obj('camion', s);
      s += dato(125, 116, d.carga || '', c);
      return s;
    },
    atleta(d, c) {
      const y = 140;
      let s = `<rect x="10" y="${y}" width="300" height="26" rx="4" fill="var(--c-h)" fill-opacity="0.16"/><line x1="10" y1="${y + 13}" x2="310" y2="${y + 13}" stroke="currentColor" stroke-opacity="0.4" stroke-dasharray="8 8"/>`;
      s += `<line x1="24" y1="${y - 6}" x2="24" y2="${y + 32}" ${tinta({ g: 3 })}/><line x1="296" y1="${y - 6}" x2="296" y2="${y + 32}" ${tinta({ g: 3 })}/>`;
      // corredor
      const x = 170;
      s += `<circle cx="${x}" cy="${y - 62}" r="9" fill="var(--card)" ${tinta()}/><path d="M${x} ${y - 52}L${x - 4} ${y - 26}M${x - 4} ${y - 26}L${x + 10} ${y - 12}L${x + 4} ${y}M${x - 4} ${y - 26}L${x - 16} ${y - 10}L${x - 24} ${y - 6}M${x - 2} ${y - 46}L${x + 14} ${y - 34}M${x - 2} ${y - 46}L${x - 16} ${y - 36}" fill="none" ${tinta({ g: 3 })}/>`;
      // cronómetro
      s += `<circle cx="262" cy="52" r="20" fill="var(--card)" ${tinta()}/><rect x="257" y="26" width="10" height="6" rx="2" fill="currentColor"/><line x1="262" y1="52" x2="270" y2="40" ${tinta({ g: 2.5 })}/>`;
      s = obj('atleta', s);
      s += T.cota(24, 296, y + 46, { texto: d.distancia || '', color: c, lado: 'abajo' }).replace(/<text/, '<text dy="-2"');
      s += dato(262, 92, d.tiempo || '', c);   // el tiempo también es un dato: el color del enunciado (regla 4)
      return s;
    },
    caracol(d, c) {
      const y = 140;
      let s = `<line x1="20" y1="${y}" x2="300" y2="${y}" ${tinta()}/>`;
      for (let k = 0; k <= 28; k++) s += `<line x1="${20 + k * 10}" y1="${y}" x2="${20 + k * 10}" y2="${y + (k % 5 ? 6 : 12)}" stroke="currentColor" stroke-width="1"/>`;
      s += `<path d="M110 ${y}Q100 ${y - 8} 112 ${y - 14}L196 ${y - 14}Q214 ${y - 16} 214 ${y - 30}L210 ${y - 44}M206 ${y - 30}L198 ${y - 44}" fill="var(--c-d)" fill-opacity="0.2" ${tinta()}/>`;
      s += `<circle cx="150" cy="${y - 42}" r="30" fill="var(--c-o)" fill-opacity="0.22" ${tinta()}/><path d="M150 ${y - 42}m-14 0a14 14 0 1 0 14 -14a8 8 0 1 0 0 16" fill="none" ${tinta({ g: 1.5 })}/>`;
      s = obj('caracol', s);
      s += `<path d="M232 ${y - 26}L282 ${y - 26}" stroke="${T.color(c)}" stroke-width="3"/><path d="M282 ${y - 26}l-9 -5v10z" fill="${T.color(c)}"/>`;
      s += dato(W / 2, H - 14, d.texto || '', c);
      return s;
    },
    corazon(d, c) {
      let s = `<path d="M160 150 C 90 108 80 60 120 50 C 142 45 156 60 160 72 C 164 60 178 45 200 50 C 240 60 230 108 160 150 Z" fill="var(--c-h)" fill-opacity="0.3" ${tinta({ g: 2.5 })}/>`;
      s += `<path d="M30 110 L100 110 L112 86 L126 134 L138 100 L146 110 L200 110 L212 86 L226 134 L238 100 L246 110 L290 110" fill="none" stroke="${T.color(c)}" stroke-width="2.5" stroke-linejoin="round"/>`;
      s = obj('corazon', s);
      s += dato(W / 2, H - 22, d.texto || '', c);
      return s;
    },
    comparar(d) {
      const bs = (d.barras || []).slice(0, 3), max = Math.max(1, ...bs.map(b => b.valor || 0)), x0 = 20, L = 190;   // deja lugar para el número a la derecha
      let s = d.titulo ? T.rotulo(x0, 28, d.titulo, { tam: 14, peso: 700 }) : '';
      bs.forEach((b, k) => {
        const y = 50 + k * 54, w = L * (b.valor || 0) / max;
        s += T.rotulo(x0, y + 4, b.nombre || '', { tam: 14, peso: 700 });
        s += `<rect x="${x0}" y="${y + 12}" width="${n(Math.max(2, w))}" height="20" rx="4" fill="${T.color(b.color || 'o')}" fill-opacity="0.75"/>`;
        s += T.rotulo(x0 + w + 8, y + 28, b.texto || '', { tam: 15, peso: 800, color: b.color || 'o', max: W - 4 });
      });
      return s;
    },
    sol(d, c) {
      let s = `<circle cx="50" cy="100" r="34" fill="var(--c-o)" fill-opacity="0.45" ${tinta()}/>`;
      for (let k = 0; k < 10; k++) { const b = k / 10 * 2 * Math.PI; s += `<line x1="${n(50 + 40 * Math.cos(b))}" y1="${n(100 + 40 * Math.sin(b))}" x2="${n(50 + 50 * Math.cos(b))}" y2="${n(100 + 50 * Math.sin(b))}" ${tinta({ g: 2 })}/>`; }
      s += `<circle cx="282" cy="100" r="16" fill="var(--c-i)" fill-opacity="0.4" ${tinta()}/><path d="M270 96 Q282 90 292 98" fill="none" stroke="var(--c-d)" stroke-width="2"/>`;
      s = obj('sol', s);
      s += `<line x1="104" y1="100" x2="256" y2="100" stroke="${T.color(c)}" stroke-width="3" stroke-dasharray="10 6"/><path d="M262 100l-11 -6v12z" fill="${T.color(c)}"/>`;
      s += dato(W / 2, 182, d.texto || '', c, { tam: 15 });
      return s;
    },
    cabello(d, c) {
      let s = `<circle cx="150" cy="96" r="70" fill="var(--card)" ${tinta({ g: 3 })}/><path d="M200 146 L240 186" ${tinta({ g: 10 })}/>`;
      s += `<path d="M80 70 C 120 80 170 98 220 118 L 220 134 C 170 114 120 96 80 86 Z" fill="var(--c-f)" fill-opacity="0.3" ${tinta({ g: 1.5 })}/>`;
      s = obj('cabello', s);
      s += `<line x1="150" y1="62" x2="150" y2="110" stroke="${T.color(c)}" stroke-width="1.5"/><line x1="140" y1="${n(84)}" x2="160" y2="${n(84)}" stroke="${T.color(c)}" stroke-width="2"/><line x1="140" y1="${n(100)}" x2="160" y2="${n(100)}" stroke="${T.color(c)}" stroke-width="2"/>`;
      s += dato(150, 52, d.texto || '', c);
      return s;
    },
    // ---- Áreas y volúmenes (16 nov) ----
    // terreno: «la chacra es un rectángulo con cerca: su área es largo por ancho».
    terreno(d, c) {
      const cu = !!d.cuadrado, x0 = cu ? 112 : 92, x1 = cu ? 232 : 296, y0 = cu ? 16 : 20, y1 = cu ? 136 : 140;
      let s = `<rect x="${x0}" y="${y0}" width="${x1 - x0}" height="${y1 - y0}" fill="var(--c-d)" fill-opacity="0.16"/>`;
      for (let k = 1; (k * 12) < (y1 - y0); k++) s += `<line x1="${x0 + 8}" y1="${y0 + k * 12}" x2="${x1 - 8}" y2="${y0 + k * 12}" stroke="var(--c-d)" stroke-opacity="0.55" stroke-width="1.5" stroke-dasharray="10 5"/>`;
      // cerca: alambre en el borde y postes repartidos con índices enteros
      s += `<rect x="${x0}" y="${y0}" width="${x1 - x0}" height="${y1 - y0}" fill="none" ${tinta({ g: 1.5 })}/>`;
      const nx = Math.round((x1 - x0) / 24), ny = Math.round((y1 - y0) / 24);
      for (let k = 0; k <= nx; k++) for (const y of [y0, y1]) s += `<rect x="${n(x0 + k * (x1 - x0) / nx - 2.5)}" y="${n(y - 2.5)}" width="5" height="5" fill="currentColor"/>`;
      for (let k = 1; k < ny; k++) for (const x of [x0, x1]) s += `<rect x="${n(x - 2.5)}" y="${n(y0 + k * (y1 - y0) / ny - 2.5)}" width="5" height="5" fill="currentColor"/>`;
      s = obj('terreno', s);
      if (d.largo) s += T.cota(x0, x1, y1 + 16, { texto: d.largo, color: c, lado: 'abajo' });
      if (d.ancho) s += cotaV(x0 - 14, y0, y1, d.ancho, c, 'izq');
      if (d.texto) s += etiqueta((x0 + x1) / 2, (y0 + y1) / 2 + 6, d.texto, c);
      return s;
    },
    // botella: «lo que cabe en la botella es su volumen».
    botella(d, c) {
      const cx = 118;
      let s = `<rect x="${cx - 12}" y="14" width="24" height="16" rx="3" fill="currentColor" fill-opacity="0.35" ${tinta({ g: 1.5 })}/>`;
      s += `<path d="M${cx - 9} 30L${cx - 9} 46C${cx - 9} 62 ${cx - 32} 64 ${cx - 32} 84L${cx - 32} 180Q${cx - 32} 194 ${cx - 18} 194L${cx + 18} 194Q${cx + 32} 194 ${cx + 32} 180L${cx + 32} 84C${cx + 32} 64 ${cx + 9} 62 ${cx + 9} 46L${cx + 9} 30Z" fill="var(--card)" ${tinta()}/>`;
      s += `<path d="M${cx - 30} 92L${cx + 30} 92L${cx + 30} 180Q${cx + 30} 192 ${cx + 18} 192L${cx - 18} 192Q${cx - 30} 192 ${cx - 30} 180Z" fill="var(--c-i)" fill-opacity="0.25"/>`;
      s += `<line x1="${cx - 30}" y1="92" x2="${cx + 30}" y2="92" stroke="var(--c-i)" stroke-width="2"/>`;
      s += `<rect x="${cx - 32}" y="116" width="64" height="30" fill="currentColor" fill-opacity="0.08" ${tinta({ g: 1.5 })}/>`;
      s = obj('botella', s);
      s += `<line x1="${cx + 38}" y1="124" x2="${cx + 56}" y2="124" stroke="${T.color(c)}" stroke-width="2" stroke-linecap="round"/>`;
      s += T.rotulo(cx + 62, 130, d.texto || '', { tam: 16, peso: 800, color: c, min: 4, max: W - 4 });
      if (d.nombre) s += T.rotulo(cx + 62, 150, d.nombre, { tam: 14, min: 4, max: W - 4 });
      return s;
    },
    // tanque: «el tanque del techo guarda un volumen de agua» (con altura: «está a una altura h del suelo»).
    tanque(d, c) {
      const xa = d.altura ? 60 : 24;
      let s = `<rect x="${xa}" y="172" width="${296 - xa}" height="12" fill="currentColor" fill-opacity="0.16" ${tinta({ g: 1.5 })}/>`;
      s += `<rect x="${xa + 10}" y="184" width="${276 - xa}" height="20" fill="var(--c-o)" fill-opacity="0.1" ${tinta({ g: 1.5 })}/>`;
      for (let k = 0; k < 3; k++) s += `<rect x="${xa + 34 + k * 70}" y="189" width="26" height="12" fill="var(--c-i)" fill-opacity="0.18" ${tinta({ g: 1.2 })}/>`;
      s += `<rect x="104" y="160" width="92" height="12" fill="currentColor" fill-opacity="0.25" ${tinta({ g: 1.5 })}/>`;
      s += `<path d="M106 52L106 156Q150 168 194 156L194 52" fill="currentColor" fill-opacity="0.12" ${tinta()}/>`;
      s += `<ellipse cx="150" cy="52" rx="44" ry="10" fill="currentColor" fill-opacity="0.2" ${tinta()}/>`;
      s += `<ellipse cx="150" cy="46" rx="16" ry="5" fill="currentColor" fill-opacity="0.35" ${tinta({ g: 1.5 })}/>`;
      for (const y of [84, 112, 140]) s += `<path d="M106 ${y}Q150 ${y + 12} 194 ${y}" fill="none" ${tinta({ g: 1.2 })} stroke-opacity="0.6"/>`;
      s = obj('tanque', s);
      s += `<line x1="200" y1="104" x2="214" y2="104" stroke="${T.color(c)}" stroke-width="2" stroke-linecap="round"/>`;
      s += T.rotulo(220, 110, d.texto || '', { tam: 16, peso: 800, color: c, min: 4, max: W - 4 });
      if (d.nombre) s += T.rotulo(220, 130, d.nombre, { tam: 14, min: 4, max: W - 4 });
      if (d.altura) {
        s += `<line x1="40" y1="160" x2="104" y2="160" stroke="${T.color(c)}" stroke-width="1.5" stroke-dasharray="4 4"/>`;
        s += T.flecha(40, 204, 40, 162, { color: c, grosor: 2.5 });
        s += T.rotulo(30, 190, d.altura, { ancla: 'end', tam: 16, peso: 800, color: c, min: 4, max: W - 4 });
      }
      return s;
    },
    // jeringa: «el émbolo marca en la escala cuántos mL se cargaron».
    jeringa(d, c) {
      const max = Math.max(1, d.max || 5), ml = Math.max(0, Math.min(max, d.ml || 0)), x0 = 56, L = 120, xr = x0 + ml / max * L, y0 = 92, y1 = 124;
      let s = `<line x1="14" y1="108" x2="50" y2="108" ${tinta({ g: 2 })}/><rect x="48" y="101" width="8" height="14" fill="currentColor" fill-opacity="0.3" ${tinta({ g: 1.5 })}/>`;
      s += `<rect x="${x0}" y="${y0}" width="${L}" height="${y1 - y0}" fill="var(--card)" ${tinta()}/>`;
      if (ml > 0) s += `<rect x="${x0 + 1}" y="${y0 + 1}" width="${n(xr - x0 - 1)}" height="${y1 - y0 - 2}" fill="${T.color(c)}" fill-opacity="0.28"/>`;
      const marcas = Math.round(max * 2);
      for (let k = 0; k <= marcas; k++) { const x = x0 + k * L / marcas; s += `<line x1="${n(x)}" y1="${y0}" x2="${n(x)}" y2="${y0 + (k % 2 ? 6 : 11)}" stroke="currentColor" stroke-width="${k % 2 ? 1 : 1.5}"/>`; }
      for (let k = 0; k <= max; k++) s += T.rotulo(x0 + k * L / max, 146, String(k), { ancla: 'middle', tam: 14 });
      s += T.rotulo(x0 + L + 14, 146, 'mL', { tam: 14 });
      s += `<rect x="${x0 + L - 2}" y="84" width="6" height="48" rx="2" fill="currentColor" fill-opacity="0.3" ${tinta({ g: 1.5 })}/>`;
      const xt = xr + L + 4;
      s += `<rect x="${n(xr - 4)}" y="${y0 + 1}" width="8" height="${y1 - y0 - 2}" fill="currentColor" fill-opacity="0.6"/>`;
      s += `<rect x="${n(xr + 4)}" y="104" width="${n(xt - xr - 4)}" height="8" fill="currentColor" fill-opacity="0.15" ${tinta({ g: 1.5 })}/>`;
      s += `<rect x="${n(xt)}" y="90" width="6" height="36" rx="2" fill="currentColor" fill-opacity="0.4" ${tinta({ g: 1.5 })}/>`;
      s = obj('jeringa', s);
      s += `<line x1="${n(xr)}" y1="70" x2="${n(xr)}" y2="${y0}" stroke="${T.color(c)}" stroke-width="2" stroke-dasharray="3 3"/>`;
      s += dato((x0 + xr) / 2, 62, d.texto || '', c);
      return s;
    },
    // hoja: «el área de la hoja es lo que cubre: ancho por alto».
    hoja(d, c) {
      const x0 = 107, x1 = 213, y0 = 46, y1 = 196;
      let s = `<rect x="${x0}" y="${y0}" width="${x1 - x0}" height="${y1 - y0}" fill="var(--card)" ${tinta()}/>`;
      for (let k = 1; k <= 12; k++) s += `<line x1="${x0 + 6}" y1="${y0 + k * 11.5}" x2="${x1 - 6}" y2="${y0 + k * 11.5}" stroke="var(--c-i)" stroke-opacity="0.35" stroke-width="1"/>`;
      s += `<line x1="${x0 + 16}" y1="${y0 + 2}" x2="${x0 + 16}" y2="${y1 - 2}" stroke="var(--c-h)" stroke-opacity="0.45" stroke-width="1"/>`;
      s = obj('hoja', s);
      if (d.ancho) s += T.cota(x0, x1, 32, { texto: d.ancho, color: c, lado: 'arriba' });
      if (d.alto) s += cotaV(x1 + 14, y0, y1, d.alto, c, 'der');
      if (d.texto) s += etiqueta((x0 + x1) / 2, (y0 + y1) / 2 + 6, d.texto, c);
      return s;
    },
    // piso: «el piso del aula se cubre con losetas iguales: hay que contar cuántas caben».
    piso(d, c) {
      const nx = Math.max(1, Math.min(30, d.nx || 20)), ny = Math.max(1, Math.min(20, d.ny || 15));
      const lado = Math.min(180 / nx, 135 / ny), w = nx * lado, h = ny * lado, x0 = 308 - w, y0 = 14;
      let s = `<rect x="${n(x0)}" y="${y0}" width="${n(w)}" height="${n(h)}" fill="var(--c-f)" fill-opacity="0.08"/>`;
      for (let k = 1; k < nx; k++) s += `<line x1="${n(x0 + k * lado)}" y1="${y0}" x2="${n(x0 + k * lado)}" y2="${n(y0 + h)}" stroke="currentColor" stroke-width="0.8" stroke-opacity="0.45"/>`;
      for (let k = 1; k < ny; k++) s += `<line x1="${n(x0)}" y1="${n(y0 + k * lado)}" x2="${n(x0 + w)}" y2="${n(y0 + k * lado)}" stroke="currentColor" stroke-width="0.8" stroke-opacity="0.45"/>`;
      s += `<rect x="${n(x0)}" y="${n(y0 + h - lado)}" width="${n(lado)}" height="${n(lado)}" fill="${T.color(c)}" fill-opacity="0.6"/>`;
      s += `<rect x="${n(x0)}" y="${y0}" width="${n(w)}" height="${n(h)}" fill="none" ${tinta({ g: 2.5 })}/>`;
      // una loseta, ampliada, con su lado
      s += `<rect x="20" y="108" width="40" height="40" fill="${T.color(c)}" fill-opacity="0.35" ${tinta()}/>`;
      s += `<path d="M60 148L${n(x0)} ${n(y0 + h)}" fill="none" stroke="currentColor" stroke-width="1" stroke-dasharray="3 3" stroke-opacity="0.6"/>`;
      s = obj('piso', s);
      s += T.rotulo(40, 100, '1 loseta', { ancla: 'middle', tam: 14, min: 4, max: W - 4 });
      if (d.loseta) s += T.cota(20, 60, 160, { texto: d.loseta, color: c, lado: 'abajo' });
      if (d.largo) s += T.cota(x0, x0 + w, y0 + h + 13, { texto: d.largo, color: c, lado: 'abajo' });
      if (d.ancho) s += cotaV(x0 - 14, y0, y0 + h, d.ancho, c, 'izq');
      return s;
    },
    // piscina: «el agua de la piscina es una caja: largo por ancho por hondo».
    piscina(d, c) {
      const x = 70, y = 118, w = 180, h = 30, dx = 56, dy = -48;
      let s = prisma(x, y, w, h, dx, dy, { arriba: ['var(--c-i)', 0.32], lado: ['var(--c-i)', 0.14], frente: ['var(--c-i)', 0.22] });
      for (const k of [1, 3]) s += `<path d="M${x + 30 + k * 10} ${n(y + k * dy / 4)}Q${x + 60 + k * 10} ${n(y + k * dy / 4 - 5)} ${x + 90 + k * 10} ${n(y + k * dy / 4)}" fill="none" stroke="var(--card)" stroke-width="2" stroke-linecap="round"/>`;
      // corchera: la línea de boyas que separa los carriles, a lo largo de la piscina
      for (let k = 0; k <= 12; k++) s += `<circle cx="${n(x + dx / 2 + k * w / 12)}" cy="${n(y + dy / 2)}" r="3" fill="${k % 2 ? 'var(--c-h)' : 'var(--card)'}" stroke="currentColor" stroke-width="1"/>`;
      s = obj('piscina', s);
      if (d.largo) s += T.cota(x, x + w, y + h + 16, { texto: d.largo, color: c, lado: 'abajo' });
      if (d.hondo) s += cotaV(x - 14, y, y + h, d.hondo, c, 'izq');
      if (d.ancho) {
        s += cotaO(x - 12, y - 4, x + dx - 12, y + dy - 4, c);
        s += T.rotulo(x + dx / 2 - 20, y + dy / 2 - 4, d.ancho, { ancla: 'end', tam: 16, peso: 600, color: c, min: 4, max: W - 4 });
      }
      return s;
    },
    // bloque: «un bloque de material: su masa sale de su volumen y su densidad».
    bloque(d, c) {
      const hielo = d.material === 'hielo';
      const x = hielo ? 70 : 84, y = hielo ? 92 : 110, w = hielo ? 90 : 160, h = hielo ? 90 : 40, dx = hielo ? 40 : 48, dy = hielo ? -34 : -40;
      const tono = hielo ? 'var(--c-i)' : 'var(--c-o)';
      let s = prisma(x, y, w, h, dx, dy, { arriba: [tono, hielo ? 0.12 : 0.2], lado: [tono, hielo ? 0.24 : 0.4], frente: [tono, hielo ? 0.18 : 0.3] });
      if (hielo) {
        s += `<path d="M${x + 14} ${y + 20}L${x + 30} ${y + 12}M${x + 14} ${y + 34}L${x + 44} ${y + 18}M${x + w + 8} ${y + 8}L${x + w + 8} ${y + 40}" fill="none" stroke="var(--card)" stroke-width="3" stroke-linecap="round"/>`;
      } else {
        // pajitas del adobe: trazos cortos repartidos con índices enteros
        for (let k = 0; k < 8; k++) { const px = x + 12 + k * 19, py = y + 10 + (k * 7) % 22, a = k % 2 ? 6 : -6; s += `<line x1="${px}" y1="${py}" x2="${px + 9}" y2="${py + a}" stroke="currentColor" stroke-opacity="0.45" stroke-width="1.5" stroke-linecap="round"/>`; }
      }
      s = obj('bloque', s);
      if (d.largo) s += T.cota(x, x + w, y + h + 14, { texto: d.largo, color: c, lado: 'abajo' });
      if (d.alto) s += cotaV(x - 14, y, y + h, d.alto, c, 'izq');
      if (d.ancho) {
        s += cotaO(x - 10, y - 4, x + dx - 10, y + dy - 4, c);
        s += T.rotulo(x + dx / 2 - 18, y + dy / 2 - 2, d.ancho, { ancla: 'end', tam: 16, peso: 600, color: c, min: 4, max: W - 4 });
      }
      if (d.texto) s += hielo ? T.rotulo(x + w + dx + 12, y + h / 2 - 4, d.texto, { tam: 16, peso: 800, color: c, min: 4, max: W - 4 })
        : T.rotulo(x + w / 2 + dx, y + dy - 14, d.texto, { ancla: 'middle', tam: 16, peso: 800, color: c, min: 4, max: W - 4 });
      if (d.nombre) s += T.rotulo(x + w + dx + 12, y + h / 2 + 16, d.nombre, { tam: 14, min: 4, max: W - 4 });
      return s;
    },
    // cano: «del caño sale un chorro que llena el balde: un caudal, litros en cada minuto».
    cano(d, c) {
      let s = `<rect x="6" y="20" width="12" height="60" fill="currentColor" fill-opacity="0.15" ${tinta({ g: 1.5 })}/>`;
      s += `<path d="M18 34L120 34Q136 34 136 50L136 68L120 68L120 52Q120 48 116 48L18 48Z" fill="currentColor" fill-opacity="0.22" ${tinta()}/>`;
      s += `<path d="M76 34L76 22M64 20L88 20" fill="none" ${tinta({ g: 3 })}/>`;
      s += `<path d="M90 112Q128 70 166 112" fill="none" ${tinta({ g: 2 })}/>`;
      for (const dx of [-4, 0, 4]) s += `<path d="M${128 + dx} 70Q${131 + dx} 90 ${128 + dx} 108Q${125 + dx} 122 ${128 + dx} 134" fill="none" stroke="var(--c-i)" stroke-width="2" stroke-linecap="round"/>`;
      s += `<path d="M94 134L162 134L157 194L99 194Z" fill="var(--c-i)" fill-opacity="0.25"/>`;
      s += `<path d="M88 112L168 112L158 196L98 196Z" fill="none" ${tinta()}/>`;
      s = obj('cano', s);
      s += `<line x1="140" y1="96" x2="168" y2="96" stroke="${T.color(c)}" stroke-width="2" stroke-linecap="round"/>`;
      s += T.rotulo(174, 102, d.texto || '', { tam: 16, peso: 800, color: c, min: 4, max: W - 4 });
      if (d.nombre) s += T.rotulo(174, 122, d.nombre, { tam: 14, min: 4, max: W - 4 });
      return s;
    },
    // plano: «el plano es el cuarto achicado: cada largo real es 50 veces el del dibujo».
    plano(d, c) {
      const x0 = 70, x1 = 230, y0 = 26, y1 = 146;
      let s = `<rect x="${x0}" y="${y0}" width="${x1 - x0}" height="${y1 - y0}" fill="var(--c-o)" fill-opacity="0.06" stroke="currentColor" stroke-width="6" stroke-linejoin="miter"/>`;
      s += `<rect x="110" y="${y0 - 4}" width="44" height="8" fill="var(--card)"/><line x1="110" y1="${y0 - 2}" x2="154" y2="${y0 - 2}" ${tinta({ g: 1.2 })}/><line x1="110" y1="${y0 + 2}" x2="154" y2="${y0 + 2}" ${tinta({ g: 1.2 })}/>`;
      s += `<rect x="182" y="${y1 - 4}" width="28" height="8" fill="var(--card)"/><line x1="182" y1="${y1}" x2="182" y2="${y1 - 28}" ${tinta({ g: 1.5 })}/><path d="M182 ${y1 - 28}A28 28 0 0 1 210 ${y1}" fill="none" stroke="currentColor" stroke-width="1" stroke-dasharray="3 3"/>`;
      s += `<rect x="80" y="36" width="44" height="58" rx="3" fill="none" ${tinta({ g: 1.2 })} stroke-dasharray="4 3"/><rect x="86" y="40" width="32" height="12" rx="3" fill="none" ${tinta({ g: 1.2 })}/>`;
      s = obj('plano', s);
      if (d.ancho) s += T.cota(x0, x1, y1 + 16, { texto: d.ancho, color: c, lado: 'abajo' });
      if (d.alto) s += cotaV(x0 - 16, y0, y1, d.alto, c, 'izq');
      if (d.escala) {
        const t = `Escala ${d.escala}`, w = T.ancho(t, 14, 700) + 14;
        s += `<rect x="${n(312 - w)}" y="178" width="${n(w)}" height="24" rx="4" fill="none" stroke="${T.color(c)}" stroke-width="1.5"/>`;
        s += T.rotulo(305, 195, t, { ancla: 'end', tam: 14, peso: 700, color: c, min: 4, max: W - 4 });
      }
      return s;
    },
    // techo: «la lluvia deja sobre el techo una capa de agua de 12 mm de alto».
    techo(d, c) {
      const x = 62, y = 118, w = 160, dx = 52, dy = -44;
      let s = '';
      for (let j = 0; j < 4; j++) for (let i = 0; i < 9; i++) {
        const px = 120 + i * 21 + (j % 2) * 10, py = 12 + j * 13;
        if (j < 2 && px < 150) continue;
        s += `<line x1="${px}" y1="${py}" x2="${px - 4}" y2="${py + 8}" stroke="var(--c-i)" stroke-width="1.8" stroke-linecap="round"/>`;
      }
      s += `<path d="M${x + w - 8} ${y + 8}L${x + w + dx - 8} ${y + dy + 8}L${x + w + dx - 8} ${y + dy + 40}L${x + w - 8} ${y + 44}Z" fill="currentColor" fill-opacity="0.1" ${tinta({ g: 1.5 })}/>`;
      s += `<rect x="${x + 8}" y="${y + 8}" width="${w - 16}" height="36" fill="var(--c-o)" fill-opacity="0.1" ${tinta({ g: 1.5 })}/>`;
      s += `<rect x="${x + 70}" y="${y + 20}" width="18" height="24" fill="currentColor" fill-opacity="0.2" ${tinta({ g: 1.2 })}/><rect x="${x + 22}" y="${y + 16}" width="28" height="14" fill="var(--c-i)" fill-opacity="0.2" ${tinta({ g: 1.2 })}/>`;
      s += prisma(x, y, w, 8, dx, dy, { arriba: ['currentColor', 0.12], lado: ['currentColor', 0.25], frente: ['currentColor', 0.25] });
      s += `<path d="M${x + 3} ${y - 2}L${x + w - 3} ${y - 2}L${x + w + dx - 4} ${y + dy + 2}L${x + dx + 4} ${y + dy + 2}Z" fill="var(--c-i)" fill-opacity="0.4"/>`;
      s = obj('techo', s);
      if (d.lluvia) s += T.rotulo(8, 30, d.lluvia, { tam: 16, peso: 800, color: c, min: 4, max: W - 4 }) + T.rotulo(8, 48, 'de lluvia', { tam: 14, min: 4, max: W - 4 });
      if (d.largo) s += T.cota(x, x + w, y + 54, { texto: d.largo, color: c, lado: 'abajo' });
      if (d.ancho) {
        s += cotaO(x + w + 16, y + 8, x + w + dx + 16, y + dy + 8, c);
        s += T.rotulo(x + w + dx / 2 + 28, y + dy / 2 + 18, d.ancho, { tam: 16, peso: 600, color: c, min: 4, max: W - 4 });
      }
      return s;
    },
    // lago: «el lago Titicaca, visto desde arriba, guarda un volumen enorme de agua».
    lago(d, c) {
      let s = `<path d="M34 112C34 70 86 38 138 50C172 58 190 36 230 42C282 50 306 88 290 120C276 148 236 142 210 158C178 178 120 186 86 168C54 152 34 142 34 112Z" fill="var(--c-i)" fill-opacity="0.22" ${tinta()}/>`;
      s += `<path d="M78 76C86 66 102 66 104 76C106 86 86 90 78 76Z" fill="var(--c-d)" fill-opacity="0.35" ${tinta({ g: 1.5 })}/>`;
      // una balsa de totora
      s += `<path d="M234 108Q252 118 270 106Q261 101 252 102Q243 103 234 108Z" fill="var(--c-o)" fill-opacity="0.4" ${tinta({ g: 1.5 })}/>`;
      s = obj('lago', s);
      if (d.nombre) s += T.rotulo(166, 96, d.nombre, { ancla: 'middle', tam: 14, peso: 700, min: 4, max: W - 4 });
      if (d.texto) s += etiqueta(166, 128, d.texto, c);
      return s;
    },
    // ---- Análisis dimensional (16 nov) ----
    // pendulo: «el péndulo va y viene; su tiempo depende del largo ℓ y de g».
    pendulo(d, c) {
      const ox = 160, oy = 22, L = 132, a = 22 * Math.PI / 180, bx = ox + L * Math.sin(a), by = oy + L * Math.cos(a), gx = ox - L * Math.sin(a);
      let s = `<rect x="108" y="12" width="104" height="10" fill="currentColor" fill-opacity="0.25" ${tinta({ g: 1.5 })}/>`;
      s += `<path d="M${n(gx)} ${n(by)}A${L} ${L} 0 0 0 ${n(bx)} ${n(by)}" fill="none" stroke="currentColor" stroke-opacity="0.5" stroke-width="1.5" stroke-dasharray="4 4"/>`;
      s += `<line x1="${ox}" y1="${oy}" x2="${n(gx)}" y2="${n(by)}" stroke="currentColor" stroke-opacity="0.35" stroke-width="1.5" stroke-dasharray="4 4"/><circle cx="${n(gx)}" cy="${n(by)}" r="12" fill="none" stroke="currentColor" stroke-opacity="0.4" stroke-width="1.5" stroke-dasharray="4 3"/>`;
      s += `<line x1="${ox}" y1="${oy}" x2="${n(bx)}" y2="${n(by)}" stroke="${T.color(c)}" stroke-width="3" stroke-linecap="round"/>`;
      s += `<circle cx="${n(bx)}" cy="${n(by)}" r="12" fill="var(--c-f)" fill-opacity="0.35" ${tinta()}/><circle cx="${ox}" cy="${oy}" r="3.5" fill="currentColor"/>`;
      s = obj('pendulo', s);
      const mx = (ox + bx) / 2, my = (oy + by) / 2;
      if (d.largo) s += T.rotulo(mx + 14 * Math.cos(a), my - 14 * Math.sin(a) + 6, d.largo, { tam: 16, peso: 800, color: c, min: 4, max: W - 4 });
      if (d.g) { s += T.flecha(272, 92, 272, 150, { color: c, grosor: 3 }); s += T.rotulo(282, 128, d.g, { tam: 16, peso: 800, color: c, min: 4, max: W - 4 }); }
      if (d.texto) s += T.rotulo(W / 2, 194, d.texto, { ancla: 'middle', tam: 14, min: 4, max: W - 4 });
      return s;
    },
    // planetas: «dos masas separadas una distancia d se atraen con la misma fuerza F».
    planetas(d, c) {
      const x1 = 74, x2 = 252, y = 92;
      let s = `<circle cx="${x1}" cy="${y}" r="40" fill="var(--c-i)" fill-opacity="0.22" ${tinta()}/><path d="M${x1 - 26} ${y - 16}Q${x1 - 10} ${y - 30} ${x1 + 8} ${y - 22}Q${x1 + 18} ${y - 16} ${x1 + 24} ${y - 22}" fill="none" stroke="var(--c-d)" stroke-width="3" stroke-linecap="round"/>`;
      s += `<circle cx="${x2}" cy="${y}" r="22" fill="currentColor" fill-opacity="0.14" ${tinta()}/><circle cx="${x2 + 6}" cy="${y - 7}" r="4" fill="none" ${tinta({ g: 1.2 })}/>`;
      for (const x of [x1, x2]) s += `<line x1="${x}" y1="${x === x1 ? y + 42 : y + 24}" x2="${x}" y2="${y + 66}" stroke="currentColor" stroke-opacity="0.45" stroke-width="1" stroke-dasharray="3 3"/>`;
      s = obj('planetas', s);
      s += T.flecha(x1 + 44, y, x1 + 84, y, { color: 'i', grosor: 3 }) + T.flecha(x2 - 26, y, x2 - 66, y, { color: 'i', grosor: 3 });
      if (d.fuerza) s += T.rotulo(x1 + 64, y - 12, d.fuerza, { ancla: 'middle', tam: 16, peso: 800, color: 'i' }) + T.rotulo(x2 - 46, y - 12, d.fuerza, { ancla: 'middle', tam: 16, peso: 800, color: 'i' });
      s += T.rotulo(x1, y + 6, d.m1 || '', { ancla: 'middle', tam: 16, peso: 800, color: c });
      s += T.rotulo(x2, y + 6, d.m2 || '', { ancla: 'middle', tam: 15, peso: 800, color: c });
      if (d.d) s += T.cota(x1, x2, y + 66, { texto: d.d, color: c, lado: 'abajo' });
      return s;
    },
    // caja: «una fuerza F empuja una masa m y le da una aceleración a».
    caja(d, c) {
      let s = `<line x1="10" y1="164" x2="310" y2="164" ${tinta()}/>`;
      for (let k = 0; k < 15; k++) s += `<line x1="${16 + k * 20}" y1="166" x2="${8 + k * 20}" y2="176" stroke="currentColor" stroke-opacity="0.45" stroke-width="1.2"/>`;
      s += `<rect x="130" y="94" width="84" height="70" rx="3" fill="var(--c-o)" fill-opacity="0.14" ${tinta()}/>`;
      s += `<line x1="130" y1="117" x2="214" y2="117" ${tinta({ g: 1.2 })} stroke-opacity="0.5"/><line x1="130" y1="141" x2="214" y2="141" ${tinta({ g: 1.2 })} stroke-opacity="0.5"/>`;
      s = obj('caja', s);
      s += etiqueta(172, 136, d.masa || '', c);
      if (d.fuerza) s += T.flecha(36, 128, 124, 128, { color: c, grosor: 3 }) + T.rotulo(78, 116, d.fuerza, { ancla: 'middle', tam: 16, peso: 800, color: c });
      if (d.aceleracion) s += T.flecha(140, 74, 214, 74, { color: 'i', grosor: 3 }) + T.rotulo(224, 80, d.aceleracion, { tam: 16, peso: 800, color: 'i' });
      return s;
    },
    // presion: «el peso F de la caja se reparte sobre el área A de su base: eso es la presión».
    presion(d, c) {
      let s = `<line x1="10" y1="160" x2="310" y2="160" ${tinta()}/>`;
      s += `<rect x="110" y="84" width="100" height="76" rx="3" fill="var(--c-o)" fill-opacity="0.14" ${tinta()}/>`;
      s += `<line x1="110" y1="109" x2="210" y2="109" ${tinta({ g: 1.2 })} stroke-opacity="0.5"/><line x1="110" y1="134" x2="210" y2="134" ${tinta({ g: 1.2 })} stroke-opacity="0.5"/>`;
      s += `<line x1="111" y1="160" x2="209" y2="160" stroke="${T.color(c)}" stroke-width="5" stroke-linecap="butt"/>`;
      for (let k = 0; k < 5; k++) s += T.flecha(120 + k * 20, 166, 120 + k * 20, 188, { color: 'i', grosor: 2 });
      s = obj('presion', s);
      if (d.fuerza) s += T.flecha(160, 18, 160, 78, { color: c, grosor: 3 }) + T.rotulo(172, 54, d.fuerza, { tam: 16, peso: 800, color: c });
      if (d.area) s += `<line x1="212" y1="160" x2="226" y2="148" stroke="${T.color(c)}" stroke-width="2" stroke-linecap="round"/>` + T.rotulo(230, 148, d.area, { tam: 16, peso: 800, color: c, min: 4, max: W - 4 });
      if (d.texto) s += T.rotulo(224, 186, d.texto, { tam: 14, peso: 700, color: 'i', min: 4, max: W - 4 });
      return s;
    },
    // deposito: «en el fondo del tanque la presión depende de lo hondo que está el punto: h».
    deposito(d, c) {
      const cH = d.colorAltura || c;
      let s = `<rect x="72" y="62" width="176" height="116" fill="var(--c-i)" fill-opacity="0.24"/><line x1="72" y1="62" x2="248" y2="62" stroke="var(--c-i)" stroke-width="2"/>`;
      s += `<path d="M70 28L70 180L250 180L250 28" fill="none" ${tinta({ g: 3 })}/>`;
      s = obj('deposito', s);
      if (d.superficie) {
        for (const x of [104, 144]) s += T.flecha(x, 30, x, 58, { color: 'f', grosor: 2.5 });
        s += T.rotulo(156, 46, d.superficie, { tam: 16, peso: 800, color: 'f' });
      }
      s += `<circle cx="200" cy="172" r="5" fill="${T.color(c)}"/>`;
      if (d.texto) s += T.rotulo(188, 170, d.texto, { ancla: 'end', tam: 16, peso: 800, color: c });
      if (d.altura) s += cotaV(214, 62, 172, d.altura, cH, 'der');
      return s;
    },
    // viento: «el aire choca con el frente de la combi y la frena con una fuerza F».
    viento(d, c) {
      let s = `<line x1="10" y1="170" x2="310" y2="170" ${tinta({ g: 1.5 })}/>`;
      s += `<path d="M40 80Q40 72 48 72L188 72Q198 72 204 82L222 120L222 148Q222 154 216 154L46 154Q40 154 40 148Z" fill="var(--c-o)" fill-opacity="0.14" ${tinta()}/>`;
      for (let k = 0; k < 4; k++) s += `<rect x="${52 + k * 34}" y="82" width="26" height="24" rx="3" fill="var(--c-i)" fill-opacity="0.2" ${tinta({ g: 1.2 })}/>`;
      s += `<path d="M190 82L200 84L212 106L190 106Z" fill="var(--c-i)" fill-opacity="0.2" ${tinta({ g: 1.2 })}/>`;
      s += `<path d="M212 106L222 120L222 148Q222 154 216 154L212 154Z" fill="${T.color(c)}" fill-opacity="0.45"/>`;
      for (const x of [84, 186]) s += `<circle cx="${x}" cy="156" r="13" fill="currentColor"/><circle cx="${x}" cy="156" r="5" fill="var(--card)"/>`;
      for (let k = 0; k < 3; k++) { const y = 104 + k * 20; s += `<line x1="306" y1="${y}" x2="244" y2="${y}" stroke="var(--c-d)" stroke-width="2" stroke-linecap="round"/><path d="M236 ${y}l9 -5v10z" fill="var(--c-d)"/>`; }
      s = obj('viento', s);
      if (d.v) s += T.flecha(100, 56, 184, 56, { color: c, grosor: 3 }) + T.rotulo(192, 62, d.v, { tam: 16, peso: 800, color: c });
      if (d.fuerza) s += T.flecha(38, 116, 8, 116, { color: 'i', grosor: 3 }) + T.rotulo(20, 104, d.fuerza, { ancla: 'middle', tam: 16, peso: 800, color: 'i', min: 4 });
      if (d.area) s += `<line x1="214" y1="178" x2="217" y2="158" stroke="${T.color(c)}" stroke-width="2" stroke-linecap="round"/>` + T.rotulo(212, 194, d.area, { ancla: 'middle', tam: 14, peso: 700, color: c, min: 4, max: W - 4 });
      if (d.aire) s += T.rotulo(274, 92, d.aire, { ancla: 'middle', tam: 14, peso: 700, color: 'd', min: 4, max: W - 4 });
      return s;
    },
  };

  function dibujar(datos = {}, estado = {}) {
    void estado;
    const f = OBJETOS[datos.objeto], c = datos.color || 'o';
    return T.svg(W, H, f ? f(datos, c) : '', { alt: alt(datos) });
  }
  function alt(d = {}) {
    const txt = { cancha: `Una cancha de fútbol de ${d.largo || ''} de largo`, bebe: `Un bebé sobre una balanza que marca ${d.pantalla || ''}`,
      reloj: `Un reloj con ${d.texto || ''} pintados`, lapiz: `Un lápiz de ${Kit.formatear(d.cm || 0, 1)} cm sobre una regla`, camion: `Un camión con ${d.carga || ''} de carga`,
      atleta: `Un corredor en una pista de ${d.distancia || ''}; el cronómetro marca ${d.tiempo || ''}`, caracol: `Un caracol que avanza ${d.texto || ''}`,
      corazon: `Un corazón: ${d.texto || ''}`, comparar: `Comparación: ${(d.barras || []).map(b => `${b.nombre} ${b.texto}`).join('; ')}`,
      sol: `Un rayo de luz del Sol a la Tierra: ${d.texto || ''}`, cabello: `Un cabello visto con lupa: ${d.texto || ''} de grosor`,
      terreno: `Un terreno ${d.cuadrado ? 'cuadrado' : 'rectangular'} con cerca, visto desde arriba${d.largo ? `; largo: ${d.largo}` : ''}${d.ancho ? `; ancho: ${d.ancho}` : ''}${d.texto ? `; ${d.texto}` : ''}`,
      botella: `Una botella con agua: ${d.texto || ''}${d.nombre ? ` (${d.nombre})` : ''}`,
      tanque: `Un tanque de agua sobre el techo de una casa: ${d.texto || ''}${d.altura ? `; está a una altura ${d.altura}` : ''}`,
      jeringa: `Una jeringa con escala en mL, cargada con ${d.texto || ''}`,
      hoja: `Una hoja de cuaderno${d.ancho ? ` de ${d.ancho}` : ''}${d.alto ? ` por ${d.alto}` : ''}${d.texto ? `; área: ${d.texto}` : ''}`,
      piso: `El piso de un aula cubierto de losetas${d.largo ? `: ${d.largo}` : ''}${d.ancho ? ` por ${d.ancho}` : ''}${d.loseta ? `; cada loseta, ${d.loseta} de lado` : ''}`,
      piscina: `Una piscina llena de agua: ${d.largo || ''} de largo, ${d.ancho || ''} de ancho y ${d.hondo || ''} de hondo`,
      bloque: `Un bloque de ${d.material === 'hielo' ? 'hielo' : 'adobe'}${d.largo ? ` de ${d.largo} por ${d.ancho || ''} por ${d.alto || ''}` : ''}${d.texto ? `: ${d.texto}` : ''}`,
      cano: `Un caño que llena un balde: ${d.texto || ''}`,
      plano: `El plano de un dormitorio de ${d.ancho || ''} por ${d.alto || ''}${d.escala ? `, a escala ${d.escala}` : ''}`,
      techo: `Lluvia sobre el techo plano de una casa${d.lluvia ? `: ${d.lluvia}` : ''}${d.largo ? `; techo de ${d.largo} por ${d.ancho || ''}` : ''}`,
      lago: `${d.nombre || 'Un lago'} visto desde arriba: ${d.texto || ''}`,
      pendulo: `Un péndulo que va y viene, de largo ${d.largo || ''}${d.g ? `; la gravedad ${d.g} apunta hacia abajo` : ''}`,
      planetas: `Dos masas, ${d.m1 || ''} y ${d.m2 || ''}, separadas una distancia ${d.d || ''}, que se atraen${d.fuerza ? ` con fuerza ${d.fuerza}` : ''}`,
      caja: `Una caja de ${d.masa || ''} empujada por una fuerza ${d.fuerza || ''}${d.aceleracion ? `; acelera con ${d.aceleracion}` : ''}`,
      presion: `Una caja sobre el piso: su peso ${d.fuerza || ''} se reparte sobre el área ${d.area || ''} de su base`,
      deposito: `Un tanque con agua visto por dentro${d.superficie ? `; arriba, el aire empuja con ${d.superficie}` : ''}; en el fondo, la presión ${d.texto || ''}${d.altura ? `, a una profundidad ${d.altura}` : ''}`,
      viento: `Una combi que avanza${d.v ? ` con rapidez ${d.v}` : ''}; el aire choca con su frente${d.area ? ` (${d.area})` : ''}${d.fuerza ? ` y la frena con fuerza ${d.fuerza}` : ''}` }[d.objeto];
    return txt ? `${txt}.` : 'Un dibujo.';
  }

  return { id: 'fis-objeto', dibujar, alt, OBJETOS: Object.keys(OBJETOS), constantes: { W, H } };
});
