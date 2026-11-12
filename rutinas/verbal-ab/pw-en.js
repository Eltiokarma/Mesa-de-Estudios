// Prueba de pantalla: un texto en inglés nuevo (preguntas con lang="en"), a 390 y 1366 px.
const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch(); let mal = 0;
  for (const w of [390, 1366]) {
    const ctx = await b.newContext({ viewport: { width: w, height: 844 } });
    await ctx.addInitScript(() => localStorage.setItem('lab-v1', JSON.stringify({ uni: 'unmsm', grado: 5, alumno: 'pw-en',
      practica: { 'lectura-ingles': { hechos: { t051: 1, t052: 1, t053: 1, t054: 1 } } } })));
    const p = await ctx.newPage(); const err = []; p.on('pageerror', e => err.push(String(e)));
    await p.goto('http://localhost:4173/app/#/lectura/lectura-ingles'); await p.waitForSelector('#yaLei');
    const t = await p.textContent('.lec-cab h1'); await p.click('#yaLei'); await p.waitForTimeout(300);
    for (let k = 0; k < 5; k++) {
      if (await p.$('.card.previo')) {
        const opc = await p.$$('.opc[data-v], .marcable');
        await opc[0].click(); await p.click('#confirmarPrevio'); await p.waitForSelector('.lec-alts');
      }
      const lang = await p.getAttribute('.preg', 'lang'), lalt = await p.getAttribute('.lec-alts', 'lang');
      console.log(w, t, k + 1, 'preg lang=', lang, 'alts lang=', lalt);
      if (lang !== 'en' || lalt !== 'en') mal++;
      if (k === 0) await p.screenshot({ path: __dirname + `/capturas/ingles-${w}.png`, fullPage: true });
      await (await p.$$('.lec-alts .alt'))[0].click(); await p.waitForTimeout(250);
      const s = await p.$('button:has-text("Siguiente"), button:has-text("siguiente")'); if (!s) break;
      await s.click(); await p.waitForTimeout(300);
    }
    if (err.length) { console.log(err); mal++; }
    const ancho = await p.evaluate(() => document.documentElement.scrollWidth);
    if (ancho > w) { console.log('desborde', ancho); mal++; }
  }
  await b.close(); console.log(mal ? 'FALLAS ' + mal : 'todo bien');
})();
