#!/usr/bin/env node
/*
 * Hojas de revisión de los ocho compañeros (respaldos provisionales), con el nucleo/mascota.css real:
 *   docs/referencias/personajes-respaldo.png   comparativa: grande, 72 px, 40 px y grises, con nombres
 *   docs/referencias/personajes-poses.png      las ocho poses del repertorio de cada uno, a 72 px
 *   docs/referencias/personajes-ciegas.png     a ciegas: numerados, sin nombres ni cursos («¿qué animal es?»)
 *   docs/referencias/personajes-jerarquia.png  hoja de jerarquía: normal, miniatura, grises y silueta
 * Uso: node herramientas/personajes-hoja.js [carpeta de salida]
 */
'use strict';
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');
const { P, svg, IDS } = require('./personajes.js');

const RAIZ = path.join(__dirname, '..');
const SALIDA = process.argv[2] || path.join(RAIZ, 'docs', 'referencias');
const css = fs.readFileSync(path.join(RAIZ, 'nucleo', 'mascota.css'), 'utf8');
const POSES = ['reposo', 'saluda', 'senala', 'espera', 'celebra', 'acompana', 'ayuda', 'hito'];
// Orden a ciegas fijo (no alfabético ni por curso), para que la hoja se pueda repetir igual.
const CIEGAS = ['neri', 'faro', 'iris', 'luma', 'tilo', 'bruna', 'mara', 'nox'];

const m = (id, pose, px, extra = '') =>
  `<div class="mascota" data-reducido data-pose="${pose}" style="width:${px}px;height:${px}px;${extra}">${svg(id)}</div>`;

const base = `<style>${css}
  body { margin: 0; background: #fbf3ec; font: 14px/1.3 system-ui, sans-serif; color: #2d2340; }
  .hoja { padding: 20px; display: inline-block; }
  h1 { font-size: 18px; margin: 0 0 4px; } p.n { margin: 0 0 14px; color: #5e5270; font-size: 12px; }
  table { border-collapse: collapse; } td, th { padding: 6px 10px; text-align: center; vertical-align: bottom; }
  th { font-weight: 600; font-size: 12px; color: #5e5270; }
  .gris { filter: grayscale(1); } .sil svg * { fill: #2d2340 !important; stroke: #2d2340 !important; }
  .mini { image-rendering: pixelated; }
</style>`;

function comparativa() {
  const fila = (titulo, celdas) => `<tr><th>${titulo}</th>${celdas}</tr>`;
  return `${base}<div class="hoja"><h1>Los ocho compañeros · respaldo SVG provisional</h1>
  <p class="n">Arte final: Gerson (en Rive). Fila de arriba a 120 px; luego al tamaño de la app (72 px), al mínimo (40 px) y en grises.</p>
  <table>
  ${fila('', IDS.map(id => `<th>${P[id].nombre}<br>${P[id].animal}</th>`).join(''))}
  ${fila('120 px', IDS.map(id => `<td>${m(id, 'saluda', 120)}</td>`).join(''))}
  ${fila('72 px', IDS.map(id => `<td>${m(id, 'reposo', 72)}</td>`).join(''))}
  ${fila('40 px', IDS.map(id => `<td>${m(id, 'reposo', 40)}</td>`).join(''))}
  ${fila('grises 72', IDS.map(id => `<td class="gris">${m(id, 'senala', 72)}</td>`).join(''))}
  ${fila('grises 40', IDS.map(id => `<td class="gris">${m(id, 'senala', 40)}</td>`).join(''))}
  </table></div>`;
}

function poses() {
  return `${base}<div class="hoja"><h1>Repertorio cerrado: ocho poses a 72 px</h1>
  <p class="n">Estado final de cada pose (lo que se ve con movimiento reducido). data-pose sin tilde: señala = senala, acompaña = acompana.</p>
  <table><tr><th></th>${POSES.map(p => `<th>${p}</th>`).join('')}</tr>
  ${IDS.map(id => `<tr><th>${P[id].nombre}</th>${POSES.map(p => `<td>${m(id, p, 72)}</td>`).join('')}</tr>`).join('')}
  </table></div>`;
}

function ciegas() {
  return `${base}<div class="hoja"><h1>¿Qué animal es cada uno?</h1>
  <p class="n">Muéstrala sin decir nada más. Anota la respuesta de cada número.</p>
  <table><tr>${CIEGAS.map((id, i) => `<td>${m(id, 'reposo', 110)}<br><b>${i + 1}</b></td>`).join('')}</tr>
  <tr>${CIEGAS.map(id => `<td>${m(id, 'reposo', 48)}</td>`).join('')}</tr></table></div>`;
}

function jerarquia() {
  return `${base}<div class="hoja"><h1>Hoja de jerarquía</h1>
  <p class="n">Normal, miniatura (24 px ampliada sin suavizar, en la imagen aparte), grises y silueta sin detalles.</p>
  <table><tr><th></th>${IDS.map(id => `<th>${P[id].nombre}</th>`).join('')}</tr>
  <tr><th>normal</th>${IDS.map(id => `<td>${m(id, 'reposo', 96)}</td>`).join('')}</tr>
  <tr><th>grises</th>${IDS.map(id => `<td class="gris">${m(id, 'reposo', 96)}</td>`).join('')}</tr>
  <tr><th>silueta</th>${IDS.map(id => `<td class="sil">${m(id, 'reposo', 96)}</td>`).join('')}</tr>
  </table></div>`;
}

async function foto(page, html, archivo, escala) {
  await page.setContent(html);
  await page.waitForTimeout(50);
  const hoja = await page.$('.hoja');
  await hoja.screenshot({ path: archivo });
  console.log('escrita', path.relative(RAIZ, archivo), escala ? `(×${escala})` : '');
}

(async () => {
  fs.mkdirSync(SALIDA, { recursive: true });
  const nav = await chromium.launch();
  const page = await nav.newPage({ deviceScaleFactor: 2, viewport: { width: 1400, height: 900 } });
  await foto(page, comparativa(), path.join(SALIDA, 'personajes-respaldo.png'), 2);
  await foto(page, poses(), path.join(SALIDA, 'personajes-poses.png'), 2);
  await foto(page, ciegas(), path.join(SALIDA, 'personajes-ciegas.png'), 2);
  await foto(page, jerarquia(), path.join(SALIDA, 'personajes-jerarquia.png'), 2);
  // Miniatura honesta: 24 px reales a escala 1, para ampliarla sin suavizar al mirarla.
  const chica = await nav.newPage({ deviceScaleFactor: 1, viewport: { width: 600, height: 200 } });
  await foto(chica, `${base}<div class="hoja">${IDS.map(id => m(id, 'reposo', 24, 'margin:2px')).join('')}</div>`,
    path.join(SALIDA, 'personajes-miniatura.png'));
  await nav.close();
})();
