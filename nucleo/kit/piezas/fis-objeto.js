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
      s += dato(262, 92, d.tiempo || '', 'i');
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
      const bs = (d.barras || []).slice(0, 3), max = Math.max(1, ...bs.map(b => b.valor || 0)), x0 = 20, L = 220;
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
      sol: `Un rayo de luz del Sol a la Tierra: ${d.texto || ''}`, cabello: `Un cabello visto con lupa: ${d.texto || ''} de grosor` }[d.objeto];
    return txt ? `${txt}.` : 'Un dibujo.';
  }

  return { id: 'fis-objeto', dibujar, alt, OBJETOS: Object.keys(OBJETOS), constantes: { W, H } };
});
