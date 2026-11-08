// Prueba de pantalla: par A/B (textos-dialecticos), a 390 y 1366 px.
const { chromium } = require('playwright');
const fs = require('fs');
const out = __dirname + '/capturas';
fs.mkdirSync(out, { recursive: true });
const URL = 'http://localhost:4173/app/';
const modulo = process.argv[2] || 'textos-dialecticos';
(async () => {
  const b = await chromium.launch();
  const fallos = [];
  const ok = (c, m) => { if (!c) fallos.push(m); console.log((c ? 'ok    ' : 'FALLA ') + m); };
  for (const w of [390, 1366]) {
    const ctx = await b.newContext({ viewport: { width: w, height: w < 900 ? 844 : 800 } });
    await ctx.addInitScript(() => localStorage.setItem('lab-v1', JSON.stringify({ uni: 'unmsm', grado: 5, nombre: 'Prueba', alumno: 'prueba-pw' })));
    const p = await ctx.newPage();
    const errores = []; p.on('pageerror', e => errores.push(String(e)));
    await p.goto(URL + '#/lectura/' + modulo); await p.waitForSelector('#yaLei', { timeout: 10000 });
    const cab = await p.textContent('.lec-cab');
    if (modulo === 'textos-dialecticos') ok((await p.$$('h2.lec-autor')).length === 2, `${w}: dos rótulos de autor`);
    await p.screenshot({ path: `${out}/${modulo}-leer-${w}.png` });
    await p.click('#yaLei');
    let vistas = 0;
    for (let k = 0; k < 6; k++) {
      await p.waitForTimeout(300);
      const previo = await p.$('.card.previo');
      if (previo) {
        ok(!(await p.$('.lec-alts')), `${w}: pregunta ${k + 1}: alternativas bloqueadas por el previo`);
        const opc = await p.$$('.opc[data-v]');
        if (opc.length) {
          if (vistas === 1) await p.screenshot({ path: `${out}/${modulo}-previo-${w}.png` });
          await opc[0].click(); await p.click('#confirmarPrevio'); await p.waitForSelector('.lec-alts');
        } else break;
      }
      const alts = await p.$$('.lec-alts .alt');
      if (!alts.length) break;
      vistas++;
      const textos = await p.$$eval('.lec-alts .alt span:last-child', xs => xs.map(x => x.textContent.trim()));
      ok(!textos.some(t => cab.includes(t)), `${w}: pregunta ${k + 1}: la cabecera no muestra ninguna alternativa`);
      await alts[0].click(); await p.waitForTimeout(300);
      if (vistas === 1) await p.screenshot({ path: `${out}/${modulo}-explicacion-${w}.png`, fullPage: true });
      const sig = await p.$('button:has-text("Siguiente"), button:has-text("siguiente")');
      if (!sig) break;
      await sig.click();
    }
    ok(vistas >= 2, `${w}: recorrió ${vistas} preguntas`);
    const ancho = await p.evaluate(() => document.documentElement.scrollWidth);
    ok(ancho <= w, `${w}: sin desborde horizontal (${ancho})`);
    ok(!errores.length, `${w}: sin errores de JS ${errores.join(' | ')}`);
    await p.close();
  }
  await b.close();
  console.log(fallos.length ? `${fallos.length} fallas` : 'todo bien');
  process.exit(fallos.length ? 1 : 0);
})();
