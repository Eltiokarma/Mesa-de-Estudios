// Dibujos esquemáticos de las unidades (cáscara de la app, no escenas): uno por id de unidad, 160 × 120.
// Receta (docs/diseno.md, «Dibujos de unidad»):
// - Se dibujan sobre la lámina de la tarjeta (el pastel --cf del curso, igual en claro y en oscuro), así que el trazo
//   ciruela y los rellenos se leen igual en los dos temas.
// - Trazo del kit: 3 para lo que carga la idea, 2 para contornos y ejes; puntas y uniones redondas.
// - Colores: tinta ciruela, blanco, la base del curso (--cb) como acento y una mezcla media. Nunca los colores de
//   variables (--c-o, --c-i, --c-h, --c-d): esos son de las escenas.
// - Un acento por dibujo, en lo que dice de qué trata la unidad. Una línea de acento va «encamisada» (ciruela debajo),
//   porque la base del curso sobre su pastel no llega a 3:1.
// - Texto solo si es la clave (π, 37°, %, una cifra), de 16 o más unidades: en la tarjeta de 140 px se ve a 14 px.
// Cada curso vive en app/dibujos/<curso>.js y se registra con Dibujos.registrar(curso, { idUnidad: () => svgInterno }).
// Para agregar un curso: crear el archivo, sumarlo a CURSOS y a la CASCARA de app/sw.js (app.test.js lo comprueba).
(function (root) {
'use strict';
const D = root.Dibujos = root.Dibujos || {};
D.CURSOS = ['trigonometria', 'aritmetica', 'fisica', 'quimica', 'algebra'];
D.porCurso = D.porCurso || {};
D.registrar = (curso, mapa) => { D.porCurso[curso] = Object.assign(D.porCurso[curso] || {}, mapa); };

const n = x => String(Math.round(x * 100) / 100);
// Piezas: cada una devuelve un trozo de SVG. Las clases las pinta app/estilos.css (.dib …).
const P = D.piezas = {
  n,
  // Línea o polilínea. c: '' (trazo 3), 'd' (contorno 2), 'g' (guía 2 punteada), 'f' (fina 1,5).
  l: (pts, c = '') => `<path class="${c}" d="M${pts.map(([x, y]) => `${n(x)} ${n(y)}`).join('L')}"/>`,
  // Camino libre con clase de relleno: 'b' blanco, 'a' acento, 'm' media, '' sin relleno.
  p: (d, c = '') => `<path class="${c}" d="${d}"/>`,
  // Línea de acento encamisada.
  ac: d => `<path class="caja" d="${d}"/><path class="acl" d="${d}"/>`,
  c: (x, y, r, c = 'b') => `<circle class="${c}" cx="${n(x)}" cy="${n(y)}" r="${n(r)}"/>`,
  r: (x, y, w, h, c = 'b', rx = 3) => `<rect class="${c}" x="${n(x)}" y="${n(y)}" width="${n(w)}" height="${n(h)}" rx="${rx}"/>`,
  // Arco de circunferencia en grados, sentido matemático (antihorario en pantalla, y hacia arriba).
  arco: (cx, cy, r, a1, a2) => {
    const p = a => [cx + r * Math.cos(a * Math.PI / 180), cy - r * Math.sin(a * Math.PI / 180)];
    const [x1, y1] = p(a1), [x2, y2] = p(a2), grande = Math.abs(a2 - a1) > 180 ? 1 : 0, sentido = a2 > a1 ? 0 : 1;
    return `M${n(x1)} ${n(y1)}A${n(r)} ${n(r)} 0 ${grande} ${sentido} ${n(x2)} ${n(y2)}`;
  },
  // Punta de flecha rellena en (x, y) mirando hacia ang (grados, sentido de pantalla).
  punta: (x, y, ang, c = 'tn') => {
    const a = ang * Math.PI / 180, q = (dx, dy) => `${n(x + dx * Math.cos(a) - dy * Math.sin(a))} ${n(y + dx * Math.sin(a) + dy * Math.cos(a))}`;
    return `<path class="${c}" d="M${q(0, 0)}L${q(-9, 5)}L${q(-9, -5)}Z"/>`;
  },
  t: (x, y, s, tam = 17, ancla = 'middle') => `<text x="${n(x)}" y="${n(y)}" font-size="${tam}" text-anchor="${ancla}">${s}</text>`,
  // Ejes cartesianos con origen en (ox, oy).
  ejes: (ox, oy, x1 = 16, x2 = 148, y1 = 12, y2 = 108) => `<path class="d" d="M${x1} ${oy}H${x2}M${ox} ${y2}V${y1}"/>`,
  // Curva y = f(x) muestreada entre x1 y x2 (coordenadas de pantalla).
  curva: (f, x1, x2, paso = 2) => { const pts = []; for (let x = x1; x <= x2 + 1e-9; x += paso) pts.push([x, f(x)]); return 'M' + pts.map(([x, y]) => `${n(x)} ${n(y)}`).join('L'); },
};

// SVG completo de una unidad, o null si su curso no tiene dibujo para ella (la app pone la viñeta del curso).
D.svg = (curso, unidad, extra = '') => {
  const f = (D.porCurso[curso] || {})[unidad];
  if (!f) return null;
  return `<svg class="dib" viewBox="0 0 160 120" aria-hidden="true" ${extra}>${f(P)}</svg>`;
};
})(typeof self !== 'undefined' ? self : this);
