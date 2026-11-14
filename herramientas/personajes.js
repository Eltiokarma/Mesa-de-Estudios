#!/usr/bin/env node
/*
 * Respaldos SVG PROVISIONALES de los ocho compañeros de estudio (docs/personajes.md).
 * El arte final es de Gerson (su MCP e IA generativa, luego Rive); esto solo ocupa el hueco mientras tanto.
 *
 * Un solo generador para los ocho, a propósito: mismo esqueleto (cabeza, torso con prenda, dos brazos,
 * piernas cortas y pies), mismo contorno, mismos ojos y cejas. Cambian la cabeza, la cola, la prenda y la paleta.
 *
 *   node herramientas/personajes.js            escribe app/mascotas/<id>/respaldo.svg y mascota.json
 *   node herramientas/personajes.js --solo luma
 *
 * Capas que entiende nucleo/mascota.css: m-salto > m-todo > (m-cola, m-cuerpo, m-cabeza [m-oreja-i/d, m-ceja-i/d,
 * m-ojos-felices, m-ojos-abiertos], m-brazo). Cada parte animable tiene dos capas: la de afuera toma la pose y
 * la de adentro (.m-g) hace el gesto. Los centros de giro de cada personaje viajan como variables CSS en el <svg>.
 */
'use strict';
const fs = require('fs');
const path = require('path');

const C = '#3b2a52';          // contorno común: la tinta ciruela de la app y del gato
const f = n => +n.toFixed(2);

// Cápsula cónica: envolvente de dos círculos (hueso de un brazo, una pierna o una cola).
function capsula(x1, y1, x2, y2, r1, r2) {
  const dx = x2 - x1, dy = y2 - y1, d = Math.hypot(dx, dy), a = Math.atan2(dy, dx);
  const fi = Math.acos(Math.max(-1, Math.min(1, (r1 - r2) / d)));
  const p = (cx, cy, r, ang) => `${f(cx + r * Math.cos(ang))} ${f(cy + r * Math.sin(ang))}`;
  const grande2 = 2 * fi > Math.PI ? 1 : 0, grande1 = 2 * Math.PI - 2 * fi > Math.PI ? 1 : 0;
  return `M${p(x1, y1, r1, a + fi)}L${p(x2, y2, r2, a + fi)}A${f(r2)} ${f(r2)} 0 ${grande2} 0 ${p(x2, y2, r2, a - fi)}` +
    `L${p(x1, y1, r1, a - fi)}A${f(r1)} ${f(r1)} 0 ${grande1} 0 ${p(x1, y1, r1, a + fi)}Z`;
}

// Punta de ala de tres plumas al final de un brazo (cuervo y lechuza): h = centro de la mano, desde el hombro s.
function punta(s, h, largo = 8) {
  const L = Math.hypot(h[0] - s[0], h[1] - s[1]);
  const d = [(h[0] - s[0]) / L, (h[1] - s[1]) / L], n = [-d[1], d[0]];
  const q = (a, b) => `${f(h[0] + d[0] * a + n[0] * b)} ${f(h[1] + d[1] * a + n[1] * b)}`;
  return `M${q(-3, 5.2)}L${q(largo - 2, 4.4)}L${q(largo * 0.45, 1.6)}L${q(largo + 1, 0)}L${q(largo * 0.45, -1.6)}L${q(largo - 2, -4.4)}L${q(-3, -5.2)}Z`;
}

// Esqueleto común (unidades del viewBox 0 0 120 120; el piso en y = 109).
const E = {
  hombroI: [47, 61], manoI: [41.5, 87],
  hombroD: [73, 61], manoD: [78.5, 87],
  ojoI: [52.5, 36], ojoD: [67.5, 36],
  cuello: [60, 56],
};
const TORSO = 'M47 58C52 55 68 55 73 58C77 66 80 80 80 90C80 96 72 98 60 98C48 98 40 96 40 90C40 80 43 66 47 58Z';

const gr = (clase, cuerpo) => `<g class="${clase}"><g class="m-g">${cuerpo}</g></g>`;

// Partes compartidas ---------------------------------------------------------

function brazo(lado, p) {
  const s = lado === 'i' ? E.hombroI : E.hombroD, h = lado === 'i' ? E.manoI : E.manoD;
  const w = [s[0] + (h[0] - s[0]) * 0.82, s[1] + (h[1] - s[1]) * 0.82];
  const manga = `<path d="${capsula(s[0], s[1], w[0], w[1], 5.6, 4.6)}" fill="${p.manga}"/>`;
  const mano = p.ala
    ? `<path d="${punta(s, h)}" fill="${p.ala}"/>`
    : `<circle cx="${h[0]}" cy="${h[1]}" r="4.9" fill="${p.mano}"/>`;
  return (p.ala ? mano + manga : manga + mano) + (p.puno ? p.puno(s, w) : '');
}

function piernas(p) {
  const pi = `<path d="${capsula(51, 92, 50.5, 103, 5.2, 4.6)}" fill="${p.pierna}"/><path d="${capsula(69, 92, 69.5, 103, 5.2, 4.6)}" fill="${p.pierna}"/>`;
  const pies = p.pies || `<ellipse cx="48.5" cy="105" rx="7.2" ry="4" fill="${p.pie}"/><ellipse cx="71.5" cy="105" rx="7.2" ry="4" fill="${p.pie}"/>`;
  return pi + pies;
}

// Ojos y cejas: iguales en los ocho (lo que cambia es el color sobre pelaje oscuro).
function ojos(p) {
  const [a, b] = [E.ojoI, E.ojoD];
  const tinta = p.ojo || C;
  const base = p.anillo ? `<circle cx="${a[0]}" cy="${a[1]}" r="4" fill="${p.anillo}" stroke="none"/><circle cx="${b[0]}" cy="${b[1]}" r="4" fill="${p.anillo}" stroke="none"/>` : '';
  const felices = `<g class="m-ojos-felices"><path d="M${a[0] - 3.2} ${a[1] + 1.2}q3.2-3.6 6.4 0M${b[0] - 3.2} ${b[1] + 1.2}q3.2-3.6 6.4 0" fill="none" stroke="${tinta}" stroke-width="2.4"/></g>`;
  const abiertos = `<g class="m-ojos-abiertos"><g class="m-g" stroke="none"><ellipse cx="${a[0]}" cy="${a[1]}" rx="2.7" ry="3.3" fill="${tinta}"/><ellipse cx="${b[0]}" cy="${b[1]}" rx="2.7" ry="3.3" fill="${tinta}"/></g></g>`;
  const cc = p.ceja || C, y = a[1] - 7;
  const cejas = gr('m-ceja-i', `<path d="M${a[0] - 3.8} ${y + 0.8}q3.6-2.4 7.4-0.6" fill="none" stroke="${cc}" stroke-width="2.4"/>`) +
    gr('m-ceja-d', `<path d="M${b[0] + 3.8} ${y + 0.8}q-3.6-2.4-7.4-0.6" fill="none" stroke="${cc}" stroke-width="2.4"/>`);
  return base + cejas + felices + abiertos;
}

// Los ocho ------------------------------------------------------------------
// Cada uno: paleta, cabeza (forma + cara), orejas (o nada), torso con prenda, mangas, manos, piernas, pies y cola.

const P = {};

P.luma = {
  nombre: 'Luma', animal: 'tortuga', curso: 'aritmetica',
  piel: '#8f9a6c', cara: '#dcdcb6', capa: '#66653a', placa: '#85844f', cardigan: '#efdfbd', peto: '#c9c58e',
  cola: p => `<path d="M76 99C82 99 88 101 91 104C86 105 80 105 76 104Z" fill="${p.piel}"/>`,
  atras: p => `<path d="M60 52C78 52 89 64 89 80C89 96 77 104 60 104C43 104 31 96 31 80C31 64 42 52 60 52Z" fill="${p.capa}"/>` +
    `<path d="M54 48h12v11h-12z" fill="${p.piel}"/>` +
    `<path d="M35 72C38 62 47 56 56 55M85 72C82 62 73 56 64 55M33 88C40 84 41 76 38 70M87 88C80 84 79 76 82 70" fill="none" stroke="${p.placa}" stroke-width="2.6"/>`,
  cabeza: p => `<path d="M60 21C70.5 21 77 28 77 36.5C77 45.5 70 51 60 51C50 51 43 45.5 43 36.5C43 28 49.5 21 60 21Z" fill="${p.piel}"/>` +
    `<path d="M48 43C50 39 70 39 72 43C73 49 67 52 60 52C53 52 47 49 48 43Z" fill="${p.cara}" stroke="none"/>` +
    `<circle cx="57.6" cy="42.2" r="1" fill="${C}" stroke="none"/><circle cx="62.4" cy="42.2" r="1" fill="${C}" stroke="none"/>` +
    `<path d="M54 46.5q6 3.4 12 0" fill="none" stroke-width="2.2"/>`,
  torso: p => `<path d="${TORSO}" fill="${p.cardigan}"/><path d="M54 57L60 74L66 57Z" fill="${p.peto}" stroke-width="2"/>` +
    `<circle cx="60" cy="81" r="1.3" fill="${C}" stroke="none"/><circle cx="60" cy="88" r="1.3" fill="${C}" stroke="none"/>`,
  brazo: p => ({ manga: p.cardigan, mano: p.piel }),
  pies: p => ({ pierna: p.piel, pie: p.piel, pies: `<ellipse cx="48.5" cy="105" rx="7.6" ry="4.2" fill="${p.piel}"/><ellipse cx="71.5" cy="105" rx="7.6" ry="4.2" fill="${p.piel}"/>` }),
};

P.nox = {
  nombre: 'Nox', animal: 'cuervo', curso: 'algebra',
  pluma: '#2e3136', pico: '#767a82', aro: '#ece6da', ceja: '#b6b9c0', mostaza: '#c9a23a', mostazaO: '#a8851f',
  ojosP: p => ({ anillo: p.aro, ceja: p.ceja }),
  cola: p => `<path d="M74 92L96 99L93 102L97 105L74 104Z" fill="${p.pluma}"/>`,
  atras: p => `<path d="M42 58C44 50 76 50 78 58C72 62 48 62 42 58Z" fill="${p.mostazaO}"/>`,
  cabeza: p => `<path d="M57 20L60 12L62 19L66 14L65 21Z" fill="${p.pluma}"/>` +
    `<path d="M60 19C71 19 78 26 78 36C78 47 70 53 60 53C50 53 42 47 42 36C42 26 49 19 60 19Z" fill="${p.pluma}"/>` +
    `<path d="M55 40.4C57 38.6 63 38.6 65 40.4L60 57Z" fill="${p.pico}" stroke-width="2.4"/><path d="M56.8 45.6L63.2 45.6" stroke-width="1.6"/>`,
  torso: p => `<path d="${TORSO}" fill="${p.mostaza}"/><path d="M60 59V96" stroke-width="2"/><path d="M44 90C52 93 68 93 76 90" fill="none" stroke="${p.mostazaO}" stroke-width="2"/>`,
  brazo: p => ({ manga: p.mostaza, ala: p.pluma }),
  pies: p => ({ pierna: p.pluma, pies: `<path d="M41 107C42 102 47 101 50 101C53 101 56 103 56 107Z" fill="${p.pico}"/><path d="M64 107C64 103 67 101 70 101C73 101 78 102 79 107Z" fill="${p.pico}"/>` }),
};

P.tilo = {
  nombre: 'Tilo', animal: 'gato bicolor', curso: 'fisica',
  negro: '#2b2932', blanco: '#f6f1e8', iris: '#e2b455', ceja: '#bdb6c6', oreja: '#7d6476', jersey: '#93abc6', bufanda: '#c98a2c',
  ojosP: p => ({ anillo: p.iris, ceja: p.ceja }),
  cola: p => `<path d="M76 99C92 102 102 92 99 76C98 71 102 68 105 71" fill="none" stroke="${C}" stroke-width="10"/>` +
    `<path d="M76 99C92 102 102 92 99 76C98 71 102 68 105 71" fill="none" stroke="${p.negro}" stroke-width="4.4"/>`,
  orejas: p => [`<path d="M42 31L43 9L57 21Z" fill="${p.negro}"/><path d="M45.5 25L46 15.5L52 21Z" fill="${p.oreja}" stroke="none"/>`,
    `<path d="M78 31L77 9L63 21Z" fill="${p.negro}"/><path d="M74.5 25L74 15.5L68 21Z" fill="${p.oreja}" stroke="none"/>`],
  cabeza: p => `<path d="M60 19C72 19 80 26 80 36C80 47 71 53 60 53C49 53 40 47 40 36C40 26 48 19 60 19Z" fill="${p.negro}"/>` +
    `<path d="M60 33C63 33 64 38 68 40C73 42 72 52 60 52C48 52 47 42 52 40C56 38 57 33 60 33Z" fill="${p.blanco}" stroke="none"/>` +
    `<path d="M57.6 42.6h4.8l-2.4 2.6z" fill="${C}" stroke="none"/><path d="M60 45v1.6M56.6 47.6q3.4 2 6.8 0" fill="none" stroke-width="1.8"/>` +
    `<path d="M40 41l-9-1M40.5 45l-9 2M80 41l9-1M79.5 45l9 2" stroke-width="1.8"/>`,
  torso: p => `<path d="${TORSO}" fill="${p.jersey}"/><path d="M44 89C52 92 68 92 76 89" fill="none" stroke-width="2"/>` +
    `<path d="M46 58C50 53 70 53 74 58C70 63 50 63 46 58Z" fill="${p.bufanda}"/><path d="M50 61L47 80L54 79L55 62Z" fill="${p.bufanda}" stroke-width="2.4"/>`,
  brazo: p => ({ manga: p.jersey, mano: p.blanco }),
  pies: p => ({ pierna: p.negro, pie: p.blanco }),
};

P.bruna = {
  nombre: 'Bruna', animal: 'castora', curso: 'quimica',
  pelo: '#8f5631', hocico: '#e2c29b', diente: '#fbf6ec', colaC: '#5b3f2e', linea: '#7c5d48', delantal: '#2e6a4c', camisa: '#efe6d2',
  cola: p => `<path d="M76 92C84 86 102 84 106 91C109 98 98 105 85 105C79 105 75 100 76 92Z" fill="${p.colaC}"/>` +
    `<path d="M86 89L91 103M95 87L99 101M83 96L104 93" fill="none" stroke="${p.linea}" stroke-width="2"/>`,
  orejas: p => [`<circle cx="44" cy="25" r="5.2" fill="${p.pelo}"/><circle cx="44" cy="25" r="2.2" fill="${p.colaC}" stroke="none"/>`,
    `<circle cx="76" cy="25" r="5.2" fill="${p.pelo}"/><circle cx="76" cy="25" r="2.2" fill="${p.colaC}" stroke="none"/>`],
  cabeza: p => `<path d="M60 19C73 19 80 27 80 37C80 47 71 54 60 54C49 54 40 47 40 37C40 27 47 19 60 19Z" fill="${p.pelo}"/>` +
    `<path d="M49 44C49 39 71 39 71 44C71 49 66 52 60 52C54 52 49 49 49 44Z" fill="${p.hocico}" stroke-width="2"/>` +
    `<rect x="56.6" y="47.6" width="6.8" height="6.4" rx="1.4" fill="${p.diente}" stroke-width="2"/><path d="M60 47.6v6.4" stroke-width="1.4"/>` +
    `<path d="M56.5 40.2C57.5 39.2 62.5 39.2 63.5 40.2C63.5 42.6 61.5 43.4 60 43.4C58.5 43.4 56.5 42.6 56.5 40.2Z" fill="${C}" stroke="none"/>`,
  torso: p => `<path d="${TORSO}" fill="${p.camisa}"/>` +
    `<path d="M52 66H68V75C74 75 78 78 78.6 86C79 92 76 96 60 96C44 96 41 92 41.4 86C42 78 46 75 52 75Z" fill="${p.delantal}" stroke-width="2.4"/>` +
    `<path d="M52.6 66L48.5 58.5M67.4 66L71.5 58.5" fill="none" stroke="${p.delantal}" stroke-width="2.6"/>`,
  brazo: p => ({ manga: p.camisa, mano: p.pelo }),
  pies: p => ({ pierna: p.pelo, pie: p.colaC }),
};

P.neri = {
  nombre: 'Neri', animal: 'nutria', curso: 'geometria',
  pelo: '#7a5d45', crema: '#f0e2c8', oscuro: '#5f4938', chaleco: '#c0623d',
  cola: p => `<path d="${capsula(74, 98, 103, 104, 6.4, 2.6)}" fill="${p.pelo}"/>`,
  orejas: p => [`<circle cx="40.6" cy="33" r="3.6" fill="${p.pelo}"/>`, `<circle cx="79.4" cy="33" r="3.6" fill="${p.pelo}"/>`],
  cabeza: p => `<path d="M60 24C74 24 81 31 81 40C81 48 72 53 60 53C48 53 39 48 39 40C39 31 46 24 60 24Z" fill="${p.pelo}"/>` +
    `<path d="M42.4 39C45 34.4 52 35.6 60 38.6C68 35.6 75 34.4 77.6 39C80 46 71 52.4 60 52.4C49 52.4 40 46 42.4 39Z" fill="${p.crema}" stroke="none"/>` +
    `<path d="M56 41C56 39.2 64 39.2 64 41C64 43.2 61.6 44.6 60 44.6C58.4 44.6 56 43.2 56 41Z" fill="${C}" stroke="none"/>` +
    `<path d="M60 44.6v1.6M56.4 47.4q3.6 2.4 7.2 0" fill="none" stroke-width="1.8"/>` +
    `<path d="M48 45l-9-2M48.4 48.4l-8.6 1.6M72 45l9-2M71.6 48.4l8.6 1.6" stroke-width="1.6"/>`,
  torso: p => `<path d="${TORSO}" fill="${p.pelo}"/><path d="M60 60C67 60 70 70 70 80C70 91 66 96 60 96C54 96 50 91 50 80C50 70 53 60 60 60Z" fill="${p.crema}" stroke="none"/>` +
    `<path d="M47 58C50 56 53 56 55 57L51 96C46 96 40 95 40 90C40 80 43 66 47 58Z" fill="${p.chaleco}" stroke-width="2.4"/>` +
    `<path d="M73 58C70 56 67 56 65 57L69 96C74 96 80 95 80 90C80 80 77 66 73 58Z" fill="${p.chaleco}" stroke-width="2.4"/>`,
  brazo: p => ({ manga: p.pelo, mano: p.oscuro }),
  pies: p => ({ pierna: p.pelo, pie: p.oscuro }),
};

P.mara = {
  nombre: 'Mara', animal: 'coneja', curso: 'trigonometria',
  pelo: '#f2dfd3', interior: '#e2a59f', hocico: '#fbf2ec', nariz: '#b8737b', sueter: '#7c8749', punto: '#9aa660',
  cola: p => `<circle cx="80" cy="98" r="6.2" fill="${p.hocico}"/>`,
  orejas: p => [`<path d="M48 25C42 17 40 6 44 2.5C49 -1 55 12 55.5 23Z" fill="${p.pelo}"/><path d="M49 19C46 13 45 7 46.6 5.6C49 4.6 52 12 52.4 18.6Z" fill="${p.interior}" stroke="none"/>`,
    `<path d="M72 25C78 17 80 6 76 2.5C71 -1 65 12 64.5 23Z" fill="${p.pelo}"/><path d="M71 19C74 13 75 7 73.4 5.6C71 4.6 68 12 67.6 18.6Z" fill="${p.interior}" stroke="none"/>`],
  cabeza: p => `<path d="M60 21C72 21 79 28 79 38C79 48 71 54 60 54C49 54 41 48 41 38C41 28 48 21 60 21Z" fill="${p.pelo}"/>` +
    `<path d="M60 43C62.5 40.6 69 41 69 46C69 50.6 63.6 51.6 60 49.6C56.4 51.6 51 50.6 51 46C51 41 57.5 40.6 60 43Z" fill="${p.hocico}" stroke="none"/>` +
    `<path d="M57.8 42.2h4.4L60 44.6z" fill="${p.nariz}" stroke="none"/><path d="M60 44.6v2.2M57 48.4q1.5 1.2 3-1.6q1.5 2.8 3 1.6" fill="none" stroke-width="1.8"/>`,
  torso: p => `<path d="${TORSO}" fill="${p.sueter}"/><path d="M50 58.5C54 62 66 62 70 58.5" fill="none" stroke="${p.punto}" stroke-width="2.6"/>` +
    `<path d="M45 72L48 76L51 72M57 72L60 76L63 72M69 72L72 76L75 72M43 89C52 92 68 92 77 89" fill="none" stroke="${p.punto}" stroke-width="2"/>`,
  brazo: p => ({ manga: p.sueter, mano: p.pelo }),
  pies: p => ({ pierna: p.pelo, pies: `<ellipse cx="47.5" cy="105" rx="8.4" ry="4" fill="${p.pelo}"/><ellipse cx="72.5" cy="105" rx="8.4" ry="4" fill="${p.pelo}"/>` }),
};

P.faro = {
  nombre: 'Faro', animal: 'zorro', curso: 'razonamiento-matematico',
  pelo: '#c46f37', crema: '#f1e2c6', oscuro: '#3f2d2b', chaqueta: '#506579',
  cola: p => `<path d="M75 98C88 102 104 94 107 78C108 70 104 64 101 63C97 72 86 76 79 86Z" fill="${p.pelo}"/>` +
    `<path d="M107 78C108 70 104 64 101 63C99 68 97 71 94 73C98 76 104 78 107 78Z" fill="${p.crema}" stroke-width="2.4"/>`,
  orejas: p => [`<path d="M43 29L39.5 5L58 20Z" fill="${p.pelo}"/><path d="M41.2 16.6L39.5 5L47 11.5Z" fill="${p.oscuro}" stroke="none"/><path d="M45 25L43.6 15.4L52.6 21Z" fill="${p.crema}" stroke="none"/>`,
    `<path d="M77 29L80.5 5L62 20Z" fill="${p.pelo}"/><path d="M78.8 16.6L80.5 5L73 11.5Z" fill="${p.oscuro}" stroke="none"/><path d="M75 25L76.4 15.4L67.4 21Z" fill="${p.crema}" stroke="none"/>`],
  cabeza: p => `<path d="M60 19C72 19 79 26 80 35L85 42C77 45 69 52 60 53C51 52 43 45 35 42L40 35C41 26 48 19 60 19Z" fill="${p.pelo}"/>` +
    `<path d="M41 38.6C48 40 54 43 60 43C66 43 72 40 79 38.6L83.4 42.4C76 45.6 68.6 51.6 60 52.6C51.4 51.6 44 45.6 36.6 42.4Z" fill="${p.crema}" stroke="none"/>` +
    `<path d="M57.2 44.4C57.2 43 62.8 43 62.8 44.4C62.8 46 61 47 60 47C59 47 57.2 46 57.2 44.4Z" fill="${C}" stroke="none"/>` +
    `<path d="M60 47v1.4M56.4 49q3.6 2.2 7.2 0" fill="none" stroke-width="1.8"/>`,
  torso: p => `<path d="${TORSO}" fill="${p.chaqueta}"/><path d="M60 62V96" stroke-width="2"/>` +
    `<path d="M47 57C50 53 70 53 73 57L71 63C66 65 54 65 49 63Z" fill="${p.crema}" stroke-width="2.6"/>`,
  brazo: p => ({ manga: p.chaqueta, mano: p.oscuro }),
  pies: p => ({ pierna: p.oscuro, pie: p.oscuro }),
};

P.iris = {
  nombre: 'Iris', animal: 'lechuza', curso: 'razonamiento-verbal',
  pluma: '#a87b55', disco: '#f4e8d4', pico: '#d6a85c', abrigo: '#403e46', capa: '#5b5862', panuelo: '#c9973a',
  cola: p => `<path d="M74 96L90 101L88 104L91 107L74 106Z" fill="${p.pluma}"/>`,
  cabeza: p => `<path d="M60 20C68 20 75 18.5 80.5 15.5C82 23 82 29 81.4 35C80.4 47 72 54 60 54C48 54 39.6 47 38.6 35C38 29 38 23 39.5 15.5C45 18.5 52 20 60 20Z" fill="${p.pluma}"/>` +
    `<path d="M60 26C64 21.5 74.5 22 76 30C77.6 40 70 49.6 60 51.6C50 49.6 42.4 40 44 30C45.5 22 56 21.5 60 26Z" fill="${p.disco}" stroke-width="2.2"/>` +
    `<path d="M57.4 41C57.4 39.4 62.6 39.4 62.6 41L60 46.4Z" fill="${p.pico}" stroke-width="2"/>`,
  torso: p => `<path d="${TORSO}" fill="${p.abrigo}"/>` +
    `<path d="M46.4 59C52 55 68 55 73.6 59C76 66 77.6 72 78 77C70 81 50 81 42 77C42.4 72 44 66 46.4 59Z" fill="${p.capa}" stroke-width="2.4"/>` +
    `<path d="M48 57C53 54 67 54 72 57L60 70Z" fill="${p.panuelo}" stroke-width="2.4"/>`,
  brazo: p => ({ manga: p.abrigo, ala: p.pluma }),
  pies: p => ({ pierna: p.abrigo, pies: `<path d="M42 107C43 102 47 101 50 101C53 101 56 103 56 107Z" fill="${p.pico}"/><path d="M64 107C64 103 67 101 70 101C73 101 77 102 78 107Z" fill="${p.pico}"/>` }),
};

// Centros de giro (unidades del viewBox) para nucleo/mascota.css. Las cejas giran en su centro.
const GIROS = {
  '--m-salto': '60px 108px', '--m-cabeza': '60px 56px', '--m-cola': '76px 99px',
  '--m-oreja-i': '48px 25px', '--m-oreja-d': '72px 25px', '--m-ojos': '60px 36px',
  '--m-ceja-i': '52.5px 29.4px', '--m-ceja-d': '67.5px 29.4px', '--m-brazo': '73px 61px',
};

function svg(id) {
  const p = P[id];
  const op = p.ojosP ? p.ojosP(p) : {};
  const bi = p.brazo(p), pp = p.pies(p);
  const orejas = p.orejas ? p.orejas(p) : ['', ''];
  const estilo = Object.entries(GIROS).map(([k, v]) => `${k}:${v}`).join(';');
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" class="m-svg m-compa" style="${estilo}" aria-hidden="true" focusable="false">
  <!-- ${p.nombre}, ${p.animal}: respaldo PROVISIONAL (lo genera herramientas/personajes.js; el arte final es de Gerson, en Rive).
       Mismo esqueleto que los otros siete compañeros; hoja de modelo en docs/personajes.md. -->
  <g class="m-salto">
    <g class="m-todo" stroke="${C}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
      ${gr('m-cola', p.cola(p))}
      <g class="m-cuerpo">
        ${p.atras ? p.atras(p) : ''}
        ${piernas(pp)}
        ${p.torso(p)}
        ${brazo('i', bi)}
      </g>
      <g class="m-cabeza"><g class="m-g">
        ${gr('m-oreja-i', orejas[0])}
        ${gr('m-oreja-d', orejas[1])}
        ${p.cabeza(p)}
        ${ojos(op)}
      </g></g>
      ${gr('m-brazo', brazo('d', bi))}
    </g>
  </g>
</svg>
`;
}

function ficha(id) {
  const p = P[id];
  return JSON.stringify({
    id, nombre: p.nombre, animal: p.animal,
    nota: `${p.nombre} (${p.animal}, compañero de ${p.curso}). Respaldo SVG PROVISIONAL, hecho por código (herramientas/personajes.js) para ocupar el hueco mientras no exista el .riv. El arte final es de Gerson (MCP e IA generativa, luego Rive): cuando llegue, se copia el .riv en esta carpeta y se pone su nombre en riv. Hoja de modelo en docs/personajes.md.`,
    provisional: true,
    riv: null,
    maquina: 'Mesa',
    entradas: { pose: 'pose', reducido: 'reducido' },
    respaldo: 'respaldo.svg',
  }, null, 2) + '\n';
}

module.exports = { P, svg, ficha, IDS: Object.keys(P) };

if (require.main === module) {
  const i = process.argv.indexOf('--solo');
  const ids = i > 0 ? [process.argv[i + 1]] : Object.keys(P);
  for (const id of ids) {
    const dir = path.join(__dirname, '..', 'app', 'mascotas', id);
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, 'respaldo.svg'), svg(id));
    fs.writeFileSync(path.join(dir, 'mascota.json'), ficha(id));
    console.log('escrito', id);
  }
}
