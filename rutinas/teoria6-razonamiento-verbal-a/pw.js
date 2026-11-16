// Recorre «Lee» y «Así se resuelve» de una idea (ronda 6) a 360 × 780, con `npm run dev` corriendo.
// Uso: node rutinas/teoria6-razonamiento-verbal-a/pw.js <unidad-corta> [idea|todas] [salida]
// Comprueba: abre en «Lee», el botón pasa de tarjeta en tarjeta y llega a «Juega»; «Ir directo a jugar» salta;
// en «Así se resuelve» el botón revela los pasos uno por uno, sale la respuesta y «Otro ejemplo» cambia el enunciado;
// sin errores de consola ni desborde. Deja capturas.
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const [uc, cual, sal = '/tmp/claude-0/rv6-capturas'] = process.argv.slice(2);
const U = `razonamiento-verbal.${uc}`, BASE = `http://localhost:${process.env.PORT || 4173}/app/`;
const def = require(path.resolve(__dirname, `../../contenido/teoria/razonamiento-verbal/${uc}.js`));
const ideas = !cual || cual === 'todas' ? def.ideas : def.ideas.filter(i => i.id === cual);
fs.mkdirSync(sal, { recursive: true });
(async () => {
  const b = await chromium.launch();
  const ok = [], mal = [], errores = [];
  const marca = (c, t) => (c ? ok : mal).push(t);
  async function pagina(est) {
    const ctx = await b.newContext({ viewport: { width: 360, height: 780 }, deviceScaleFactor: 1 });
    const p = await ctx.newPage();
    p.on('pageerror', e => errores.push(e.message));
    p.on('console', m => { if (m.type() === 'error') errores.push(m.text()); });
    await p.addInitScript(l => localStorage.setItem('lab-v1', JSON.stringify(l)), est);
    return p;
  }
  for (const idea of ideas) {
    const n = idea.lee.tarjetas.length, ruta = `${BASE}#/unidad/${U}/teoria/${idea.id}`;
    // Lee
    let p = await pagina({ uni: 'unmsm', grado: '5' });
    await p.goto(ruta); await p.waitForTimeout(1200);
    marca(await p.locator('.te-lee').count() === 1, `${idea.id}: abre en «Lee»`);
    await p.screenshot({ path: `${sal}/${uc}-${idea.id}-lee1.png` });
    for (let k = 1; k < n; k++) {
      await p.locator('.te-sig').click(); await p.waitForTimeout(700);
      const on = await p.locator('.te-lee-puntos span.on').evaluate(e => [...e.parentNode.children].indexOf(e));
      marca(on === k, `${idea.id}: el botón pasa a la tarjeta ${k + 1} (punto ${on + 1})`);
    }
    await p.screenshot({ path: `${sal}/${uc}-${idea.id}-lee${n}.png` });
    marca(/Juega/.test(await p.locator('.te-sig').innerText()), `${idea.id}: en la última tarjeta el botón dice «Juega»`);
    await p.locator('.te-sig').click(); await p.waitForTimeout(800);
    marca(await p.locator('.te-idea').getAttribute('data-m') === 'juega', `${idea.id}: el botón llega a «Juega»`);
    await p.context().close();
    p = await pagina({ uni: 'unmsm', grado: '5' });
    await p.goto(ruta); await p.waitForTimeout(1200);
    await p.locator('.te-lee-saltar').click(); await p.waitForTimeout(800);
    marca(await p.locator('.te-idea').getAttribute('data-m') === 'juega', `${idea.id}: «Ir directo a jugar» salta al juego`);
    marca(await p.evaluate(() => document.documentElement.scrollWidth) <= 360, `${idea.id}: sin desborde en «Lee»`);
    await p.context().close();
    // Así se resuelve
    p = await pagina({ uni: 'unmsm', grado: '5', teoria: { [U]: { ideas: { [idea.id]: { casos: 0, momento: 'resuelve' } } } } });
    await p.goto(ruta); await p.waitForTimeout(1200);
    const c0 = idea.resuelve.generar(0);
    marca(await p.locator('.te-res-paso').count() === 1, `${idea.id}: «Así se resuelve» abre con un paso`);
    for (let k = 2; k <= c0.pasos.length; k++) {
      await p.locator('.te-sig').click(); await p.waitForTimeout(300);
      marca(await p.locator('.te-res-paso').count() === k, `${idea.id}: el botón revela el paso ${k}`);
    }
    marca(await p.locator('.te-res-resp').count() === 1, `${idea.id}: sale la respuesta`);
    await p.locator('.te-res-acc').scrollIntoViewIfNeeded();
    await p.screenshot({ path: `${sal}/${uc}-${idea.id}-resuelve.png`, fullPage: true });
    const e1 = await p.locator('.te-res-enun').innerText();
    await p.locator('.te-res-otro').click(); await p.waitForTimeout(500);
    const e2 = await p.locator('.te-res-enun').innerText();
    marca(e1 !== e2, `${idea.id}: «Otro ejemplo» cambia el enunciado`);
    marca(await p.evaluate(() => document.documentElement.scrollWidth) <= 360, `${idea.id}: sin desborde en «Así se resuelve»`);
    await p.context().close();
  }
  for (const t of ok) console.log(`✓ ${t}`);
  for (const t of mal) console.log(`✗ ${t}`);
  console.log(errores.length ? `ERRORES: ${[...new Set(errores)].join(' | ')}` : 'sin errores de consola');
  await b.close();
  process.exit(mal.length || errores.length ? 1 : 0);
})();
