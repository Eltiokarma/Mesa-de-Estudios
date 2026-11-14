#!/usr/bin/env node
/*
 * Mide la tabla viva (nucleo/kit/tabla/probar.html) con Playwright, a 360 × 740:
 *   - lectura: tamaño en pantalla del símbolo y del Z, tamaño de la casilla y contraste WCAG (claro y oscuro);
 *   - cuadros por segundo al pasar de la tabla a la mesa, al mezclar 118 cartas, al cambiar de lente, al abrir el
 *     pliegue y al arrastrar una carta con el dedo, con la CPU frenada (CDP Emulation.setCPUThrottlingRate);
 *   - saltos: los controles no se mueven al cambiar de vista;
 *   - interrupción: cambiar de vista a media carrera no deja cartas fuera de su sitio;
 *   - movimiento reducido: ninguna carta pasa por posiciones intermedias.
 *
 *   npm run dev   (en otra terminal)
 *   node herramientas/medir-tabla.js [--freno 4] [--url http://localhost:4173]
 *
 * Usa el Chromium de escritorio con la CPU frenada: no reemplaza la prueba en un celular físico.
 */
'use strict';
const { chromium } = require('playwright');

const arg = (n, d) => { const i = process.argv.indexOf(n); return i > 0 ? process.argv[i + 1] : d; };
const FRENO = Number(arg('--freno', 4));
const BASE = arg('--url', 'http://localhost:4173');
const PAGINA = `${BASE}/nucleo/kit/tabla/probar.html`;

function lum([r, g, b]) {
  const f = c => { c /= 255; return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); };
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
}
const rgb = s => s.match(/[\d.]+/g).slice(0, 3).map(Number);
function contraste(a, b) { const [x, y] = [lum(rgb(a)), lum(rgb(b))].sort((m, n) => n - m); return (x + 0.05) / (y + 0.05); }

async function lectura(pagina) {
  return pagina.evaluate(() => {
    const c = document.querySelector('.tv-carta[data-z="26"]') || document.querySelector('.tv-carta');
    const vis = [...document.querySelectorAll('.tv-carta:not(.tv-guardada)')][0];
    const s = vis.querySelector('.tv-s'), z = vis.querySelector('.tv-z');
    const cs = getComputedStyle(vis), ss = getComputedStyle(s), zs = getComputedStyle(z);
    const fondo = getComputedStyle(document.body).backgroundColor;
    return { simboloPx: parseFloat(ss.fontSize), simboloPeso: ss.fontWeight, zPx: parseFloat(zs.fontSize),
      casilla: Math.round(vis.getBoundingClientRect().width * 10) / 10, alto: Math.round(vis.getBoundingClientRect().height * 10) / 10,
      tinta: ss.color, z: zs.color, carta: cs.backgroundColor, borde: cs.borderTopColor, fondo,
      periodo: getComputedStyle(document.querySelector('.tv-periodo')).color };
  });
}

// Junta los intervalos entre cuadros mientras dura una acción.
async function cuadros(pagina, accion, ms) {
  await pagina.evaluate(() => {
    // Cada corrida tiene su número: un bucle viejo que siga vivo no escribe en la lista nueva.
    const id = window.__id = (window.__id || 0) + 1;
    window.__dt = []; window.__corre = true;
    let ant = performance.now();
    const f = t => { if (id !== window.__id) return; window.__dt.push(t - ant); ant = t; if (window.__corre) requestAnimationFrame(f); };
    requestAnimationFrame(t => { ant = t; requestAnimationFrame(f); });
  });
  await accion();
  await pagina.waitForTimeout(ms);
  const dt = await pagina.evaluate(() => { window.__corre = false; return window.__dt; });
  // Los 3 primeros cuadros son el arranque (el navegador recalcula 118 cartas y crea sus transiciones): es la
  // espera entre el toque y el primer movimiento. El resto es el movimiento en sí.
  const arranque = dt.slice(0, 3), mov = dt.slice(3);
  const o = mov.slice().sort((a, b) => a - b);
  const q = p => o[Math.min(o.length - 1, Math.floor(p * o.length))];
  return { arranqueMaxMs: Math.round(Math.max(...arranque)), cuadros: mov.length, fpsMediana: Math.round(1000 / q(0.5)),
    p95ms: Math.round(q(0.95)), maxMs: Math.round(o[o.length - 1]), mayoresDe50: mov.filter(d => d > 50).length };
}

async function cajas(pagina) {
  return pagina.evaluate(() => ['.tv-barra', '.tv-lentes', '.tv-fila-opc', '.tv-cuerpo'].map(s => {
    const r = document.querySelector(s).getBoundingClientRect(); return [s, Math.round(r.top), Math.round(r.left)];
  }));
}

(async () => {
  const navegador = await chromium.launch();
  const informe = {};

  for (const tema of ['claro', 'oscuro']) {
    const p = await navegador.newPage({ viewport: { width: 360, height: 740 } });
    await p.goto(`${PAGINA}?tema=${tema}`);
    await p.waitForTimeout(200);
    const l = await lectura(p);
    informe[`lectura ${tema}`] = { simboloPx: l.simboloPx, peso: l.simboloPeso, zPx: l.zPx, casilla: `${l.casilla} × ${l.alto}`,
      'símbolo/carta': contraste(l.tinta, l.carta).toFixed(2), 'Z/carta': contraste(l.z, l.carta).toFixed(2),
      'periodo/fondo': contraste(l.periodo, l.fondo).toFixed(2), 'borde/fondo': contraste(l.borde, l.fondo).toFixed(2),
      'carta/fondo': contraste(l.carta, l.fondo).toFixed(2) };
    await p.close();
  }

  // Cuadros por segundo con la CPU frenada.
  const p = await navegador.newPage({ viewport: { width: 360, height: 740 }, hasTouch: true });
  const cdp = await p.context().newCDPSession(p);
  await p.goto(`${PAGINA}?semilla=7`);
  await p.waitForTimeout(300);
  await cdp.send('Emulation.setCPUThrottlingRate', { rate: FRENO });
  const antes = await cajas(p);
  const fps = {};
  const api = f => () => p.evaluate(f);
  for (let vuelta = 1; vuelta <= 3; vuelta++) {
    fps[`tabla → mesa de 118 (${vuelta})`] = await cuadros(p, api(() => { window.tabla.cartas('118'); window.tabla.poner('mesa'); }), 1300);
    fps[`mezclar 118 (${vuelta})`] = await cuadros(p, api(() => { window.tabla.mezclar(); }), 1300);
    fps[`mesa → tabla (${vuelta})`] = await cuadros(p, api(() => { window.tabla.poner('tabla'); }), 1300);
    fps[`lente ionización (${vuelta})`] = await cuadros(p, api(() => { window.tabla.lente('ei'); }), 500);
    fps[`lente radio (${vuelta})`] = await cuadros(p, api(() => { window.tabla.lente('radio'); }), 500);
    fps[`abrir pliegue (${vuelta})`] = await cuadros(p, api(() => { window.tabla.abrir(true); }), 900);
    fps[`plegar (${vuelta})`] = await cuadros(p, api(() => { window.tabla.abrir(false); }), 700);
  }
  // Arrastre con el dedo en la mesa de 118: mantener, llevar la carta 12 celdas y soltar (las demás se corren).
  await p.evaluate(() => { window.tabla.lente('masa'); window.tabla.poner('mesa'); window.scrollTo(0, 0); });
  await p.waitForTimeout(1500);
  const centro = z => p.evaluate(z => { const r = document.querySelector(`.tv-carta[data-z="${z}"]`).getBoundingClientRect(); return [r.x + r.width / 2, r.y + r.height / 2]; }, z);
  const primera = await p.evaluate(() => window.tabla.estado().mesa.celdas[16]);
  const destino = await p.evaluate(() => window.tabla.estado().mesa.celdas[1]);
  const [x0, y0] = await centro(primera), [x1, y1] = await centro(destino);
  const toque = (tipo, x, y) => cdp.send('Input.dispatchTouchEvent', { type: tipo, touchPoints: tipo === 'touchEnd' ? [] : [{ x, y }] });
  fps['arrastrar (dedo)'] = await cuadros(p, async () => {
    await toque('touchStart', x0, y0);
    await p.waitForTimeout(300);
    for (let k = 1; k <= 30; k++) { await toque('touchMove', x0 + (x1 - x0) * k / 30, y0 + (y1 - y0) * k / 30); }
    await toque('touchEnd');
  }, 600);
  informe.arrastre = { carta: primera, quedoEnCelda: await p.evaluate(z => window.tabla.estado().mesa.celdas.indexOf(z), primera), esperada: 1 };
  await p.evaluate(() => window.tabla.poner('tabla'));
  await p.waitForTimeout(1500);
  const despues = await cajas(p);
  informe[`cuadros con la CPU ×${FRENO}`] = fps;
  const v = Object.values(fps);
  informe.resumen = { arranqueMaxMs: Math.max(...v.map(x => x.arranqueMaxMs)),
    arranqueMediana: v.map(x => x.arranqueMaxMs).sort((a, b) => a - b)[Math.floor(v.length / 2)],
    movimientoFpsMediana: Math.min(...v.map(x => x.fpsMediana)), movimientoMaxMs: Math.max(...v.map(x => x.maxMs)),
    movimientoMayoresDe50: v.reduce((a, x) => a + x.mayoresDe50, 0) };
  informe.saltos = antes.map((a, i) => ({ caja: a[0], dy: despues[i][1] - a[1], dx: despues[i][2] - a[2] }));

  // Interrupción: a 300 ms de ir a la mesa, volver a la tabla. Al final, cada carta donde dice su transform.
  await p.evaluate(() => window.tabla.poner('mesa'));
  await p.waitForTimeout(300);
  await p.evaluate(() => window.tabla.poner('tabla'));
  await p.waitForTimeout(1500);
  informe.interrupcion = await p.evaluate(() => {
    const malas = [...document.querySelectorAll('.tv-carta')].filter(c => {
      const m = new DOMMatrix(getComputedStyle(c).transform);
      const obj = new DOMMatrix(c.style.transform);
      return Math.abs(m.e - obj.e) > 0.5 || Math.abs(m.f - obj.f) > 0.5;
    }).length;
    return { vista: window.tabla.estado().vista, cartasFueraDeSitio: malas };
  });
  await cdp.send('Emulation.setCPUThrottlingRate', { rate: 1 });
  await p.close();

  // Movimiento reducido: una carta muestreada cada 16 ms solo toma la posición de partida o la de llegada.
  const r = await navegador.newPage({ viewport: { width: 360, height: 740 }, reducedMotion: 'reduce' });
  await r.goto(`${PAGINA}?semilla=7`);
  await r.waitForTimeout(200);
  const muestras = await r.evaluate(async () => {
    const c = document.querySelector('.tv-carta[data-z="11"]');
    const pos = () => { const m = new DOMMatrix(getComputedStyle(c).transform); return Math.round(m.e) + ',' + Math.round(m.f); };
    const vistas = new Set([pos()]);
    window.tabla.poner('mesa');
    const fin = performance.now() + 700;
    while (performance.now() < fin) { vistas.add(pos()); await new Promise(res => setTimeout(res, 16)); }
    return [...vistas];
  });
  informe['movimiento reducido: posiciones vistas del Na'] = muestras;
  await r.close();

  await navegador.close();
  console.log(JSON.stringify(informe, null, 2));
})().catch(e => { console.error(e); process.exit(1); });
