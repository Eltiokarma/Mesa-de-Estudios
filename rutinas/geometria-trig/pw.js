// Prueba de pantalla de los generadores de la rutina de geometría y trigonometría, a 390 y 1366 px.
// Uso: node rutinas/geometria-trig/pw.js [carpeta-capturas] (servidor: node herramientas/servidor.js).
// Por generador y ancho: entra a la práctica, responde la prueba de entrada y un problema de práctica, y
// comprueba que no haya errores de página, que no haya desborde horizontal, que la cabecera no muestre la
// respuesta correcta y que, antes de elegir, no se vea la solución ni la retroalimentación.
const { chromium } = require('playwright');
const fs = require('fs');
const IDS = ['geo-revolucion', 'geo-troncos-prismas', 'geo-relaciones-metricas', 'geo-circunferencia-metrica',
  'geo-areas-circulares', 'geo-areas-triangulares', 'geo-proporcionalidad', 'geo-triangulos-notables', 'geo-poligonos',
  'geo-analitica', 'trig-angulos-verticales', 'trig-oblicuangulos', 'trig-ecuaciones', 'trig-extremos',
  'trig-identidades', 'trig-inversas', 'trig-polares'];
const out = process.argv[2] || null;
if (out) fs.mkdirSync(out, { recursive: true });
const URL = 'http://localhost:4173/app/';
(async () => {
  const b = await chromium.launch();
  const fallos = [];
  const ok = (c, m) => { if (!c) { fallos.push(m); console.log('FALLA ' + m); } };
  for (const w of [390, 1366]) for (const oscuro of [false, true]) {
    const ctx = await b.newContext({ viewport: { width: w, height: w < 900 ? 844 : 768 }, colorScheme: oscuro ? 'dark' : 'light' });
    await ctx.addInitScript(() => localStorage.setItem('lab-v1', JSON.stringify({ uni: 'unmsm', grado: 5, nombre: 'Prueba', alumno: 'prueba-pw' })));
    for (const id of IDS) {
      const p = await ctx.newPage();
      const errores = []; p.on('pageerror', e => errores.push(String(e)));
      p.on('console', m => { if (m.type() === 'error') errores.push(m.text()); });
      await p.goto(URL + '#/practica/' + id);
      await p.waitForSelector('.alt[data-letra]', { timeout: 15000 });
      const etq = `${id} ${w}${oscuro ? ' oscuro' : ''}`;
      // Prueba de entrada: tres preguntas, sin corrección.
      for (let k = 0; k < 3; k++) {
        await p.waitForSelector('.alt[data-letra]');
        const cab = await p.textContent('h1');
        ok(!(await p.$('#retro .retro, .sol')), `${etq}: entrada ${k + 1} sin solución a la vista`);
        await p.click('.alt[data-letra]');
        await p.waitForTimeout(150);
        ok(cab && cab.length > 5, `${etq}: cabecera vacía`);
      }
      // Práctica: antes de elegir no hay solución; después sí.
      await p.waitForSelector('.alt[data-letra]');
      const cab = (await p.textContent('h1')) || '';
      const alts = await p.$$eval('.alt[data-letra] span:last-child', xs => xs.map(x => x.textContent.trim()));
      ok(!alts.some(t => t.length > 2 && cab.includes(t)), `${etq}: la cabecera contiene una alternativa`);
      ok(!(await p.$('.sol')), `${etq}: solución visible antes de elegir`);
      const desborde = await p.evaluate(() => document.scrollingElement.scrollWidth - window.innerWidth);
      ok(desborde <= 1, `${etq}: desborde horizontal de ${desborde} px`);
      if (out && !oscuro) await p.screenshot({ path: `${out}/${id}-${w}.png`, fullPage: true });
      await p.click('.alt[data-letra]');
      await p.waitForSelector('.sol li', { timeout: 5000 });
      const desborde2 = await p.evaluate(() => document.scrollingElement.scrollWidth - window.innerWidth);
      ok(desborde2 <= 1, `${etq}: desborde con la solución de ${desborde2} px`);
      const texto = await p.textContent('#app');
      ok(!/\bnull\b|\bNaN\b|\bundefined\b/.test(texto), `${etq}: texto con null, NaN o undefined`);
      ok(errores.length === 0, `${etq}: errores ${errores.join(' | ')}`);
      await p.close();
    }
    await ctx.close();
  }
  await b.close();
  console.log(fallos.length ? `${fallos.length} fallas` : `todo bien: ${IDS.length} generadores × 2 anchos × 2 temas`);
  process.exit(fallos.length ? 1 : 0);
})();
