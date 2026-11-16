// Ronda 6 (copiado del fork de conectores). Uso, con npm run dev corriendo: node rutinas/teoria6-razonamiento-verbal-a/desborde.js <unidad-corta>
// node desborde.js <unidad-corta>: con cada semilla 0..11 de «Así se resuelve», revela todos los pasos y busca
// pasos cuyo contenido se salga de la tarjeta (scrollWidth > clientWidth o un hijo más ancho que el paso).
const { chromium } = require(require.resolve('playwright', { paths: ['/opt/node22/lib/node_modules', process.cwd()] }));
const path = require('path');
const [uc] = process.argv.slice(2);
const U = `razonamiento-verbal.${uc}`, BASE = `http://localhost:${process.env.PORT || 4173}/app/`;
const def = require(path.resolve(`contenido/teoria/razonamiento-verbal/${uc}.js`));
(async () => {
  const b = await chromium.launch();
  let malos = 0;
  for (const idea of def.ideas) for (let s = 0; s < 12; s++) {
    const ctx = await b.newContext({ viewport: { width: 360, height: 780 } });
    const p = await ctx.newPage();
    await p.addInitScript(l => localStorage.setItem('lab-v1', JSON.stringify(l)), { uni: 'unmsm', grado: '5', teoria: { [U]: { ideas: { [idea.id]: { casos: 0, momento: 'resuelve', resuelve: s } } } } });
    await p.goto(`${BASE}#/unidad/${U}/teoria/${idea.id}`); await p.waitForTimeout(700);
    await p.locator('.te-res-todo').click(); await p.waitForTimeout(200);
    const fuera = await p.evaluate(() => [...document.querySelectorAll('.te-res-paso, .te-res-enun, .te-res-resp')].filter(el => {
      const r = el.getBoundingClientRect();
      return [...el.querySelectorAll('*')].some(h => h.getBoundingClientRect().right > r.right + 1);
    }).map(el => el.innerText.slice(0, 60)));
    if (fuera.length) { malos++; console.log(`✗ ${idea.id} s=${s}: ${fuera.join(' | ')}`); }
    await ctx.close();
  }
  console.log(malos ? `${malos} casos con desborde` : 'sin desborde en 12 semillas por idea');
  await b.close();
})();
