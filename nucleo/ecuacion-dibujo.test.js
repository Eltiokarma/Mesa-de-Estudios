// La raíz dibujada en un navegador de verdad (auditoría de Exponentes y radicales, A1, 18 nov): el índice chico y sobre
// la mitad del signo, el signo tan alto como lo de adentro y, en una raíz anidada, el de afuera más alto que el de adentro.
// Usa el Chromium de Playwright con app/estilos.css, sin servidor. Si no hay Playwright o Chromium, se salta.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const E = require('./ecuacion.js');

let chromium = null;
try { ({ chromium } = require('playwright')); } catch (e) {
  try { ({ chromium } = require('/opt/node22/lib/node_modules/playwright')); } catch (e2) { chromium = null; }
}

const css = fs.readFileSync(path.join(__dirname, '..', 'app', 'estilos.css'), 'utf8');
const n = { v: 'c-i', t: 'n' }, m = { v: 'c-o', t: 'm' };
// Las mismas formas que usa la idea 3 de Exponentes y radicales: la regla, sus datos y el ejemplo anidado; y una raíz
// simple sobre una fracción (el péndulo).
const CASOS = {
  regla: [{ sup: ['a', [{ frac: ['1', n] }]] }, ' = ', { raiz: ['a'], indice: n }],
  datos: ['a', { sup: ['', [m, '/', n]] }, ' = ', { raiz: [{ sup: ['a', m] }], indice: n }],
  anidada: [{ raiz: [{ raiz: ['x'], indice: '3' }] }],
  fraccion: ['T = 2π', { raiz: [{ frac: ['L', 'g'] }] }],
};

test('la raíz se dibuja bien en el navegador (regla grande y datos)', { skip: !chromium && 'sin Playwright' }, async t => {
  let nav;
  try { nav = await chromium.launch(fs.existsSync('/usr/bin/google-chrome') ? { executablePath: '/usr/bin/google-chrome' } : {}); } catch (e) { t.skip(`sin Chromium: ${e.message.split('\n')[0]}`); return; }
  try {
    const p = await nav.newPage({ viewport: { width: 390, height: 844 } });
    const bloque = (clase, id, partes) => `<div class="${clase}" id="${id}">${E.html(partes)}</div>`;
    await p.setContent(`<!doctype html><html><head><style>${css}</style></head><body>
      ${Object.entries(CASOS).map(([k, x]) => bloque('te-ec te-ec-grande', `g-${k}`, x)).join('')}
      <div class="te-datos"><ul>${Object.entries(CASOS).map(([k, x]) => `<li id="d-${k}">${E.html(x)}</li>`).join('')}</ul></div></body></html>`);
    const medir = id => p.evaluate(id => {
      const r = el => { const b = el.getBoundingClientRect(); return { top: b.top, bottom: b.bottom, left: b.left, right: b.right, h: b.height }; };
      const raices = [...document.querySelectorAll(`#${id} .ec-raiz`)];
      return raices.map(z => {
        const ind = z.querySelector(':scope > .ec-ind .ec-ind-n'), rad = z.querySelector(':scope > .ec-rad'), bajo = z.querySelector(':scope > .ec-bajo');
        return { ind: ind && r(ind), rad: r(rad), bajo: r(bajo), raiz: r(z),
          fInd: ind ? parseFloat(getComputedStyle(ind).fontSize) : null, fBajo: parseFloat(getComputedStyle(bajo).fontSize),
          svgH: rad.querySelector('svg').getBoundingClientRect().height };
      });
    }, id);
    for (const pre of ['g', 'd']) {
      for (const k of ['regla', 'datos']) {
        const [z] = await medir(`${pre}-${k}`);
        assert.ok(z.fInd <= 0.7 * z.fBajo + 0.01, `${pre}-${k}: el índice mide ${z.fInd}px, más de 0,7 de ${z.fBajo}px`);
        const mitad = (z.rad.top + z.rad.bottom) / 2;
        assert.ok(z.ind.bottom <= mitad + 2, `${pre}-${k}: la base del índice (${z.ind.bottom}) cae debajo de la mitad del signo (${mitad})`);
        assert.ok(z.ind.left < z.rad.left + z.rad.h, `${pre}-${k}: el índice no queda junto al signo`);
        assert.ok(z.ind.right > z.rad.left, `${pre}-${k}: el índice no se mete sobre el gancho del signo`);
      }
      // El signo es tan alto como lo de adentro (también sobre una fracción).
      for (const k of ['regla', 'fraccion']) for (const z of await medir(`${pre}-${k}`)) {
        assert.ok(Math.abs(z.rad.h - z.bajo.h) < 1.5, `${pre}-${k}: el signo mide ${z.rad.h}px y lo de adentro ${z.bajo.h}px`);
        assert.ok(z.svgH >= z.bajo.h - 2, `${pre}-${k}: el trazo del signo no llega abajo`);
      }
      // Anidada: la de afuera más alta que la de adentro, y la de adentro entera bajo la raya de afuera.
      const [afuera, adentro] = await medir(`${pre}-anidada`);
      assert.ok(afuera.rad.h > adentro.rad.h + 2, `${pre}: el signo de afuera (${afuera.rad.h}px) no es más alto que el de adentro (${adentro.rad.h}px)`);
      assert.ok(adentro.raiz.top >= afuera.bajo.top && adentro.raiz.left >= afuera.bajo.left - 0.5 && adentro.raiz.right <= afuera.bajo.right + 0.5,
        `${pre}: la raíz de adentro se sale de la raya de afuera`);
      assert.ok(adentro.ind.top > afuera.bajo.top, `${pre}: la raya de afuera tapa el índice de adentro`);
    }
  } finally { await nav.close(); }
});
