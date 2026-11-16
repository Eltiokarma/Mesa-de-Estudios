// Recorre «Lee» y «Así se resuelve» de una idea de química a 360 × 780 (ronda 6, docs/teoria.md §4e).
// Uso, con `npm run dev` corriendo:
//   node rutinas/teoria6-quimica-b/pw.js <unidad-corta> [idea] [salida]
// Ej.: node rutinas/teoria6-quimica-b/pw.js soluciones concentracion
// Comprueba: la idea abre en «Lee», el botón pasa de tarjeta en tarjeta, «Ir directo a jugar» salta al juego;
// en «Así se resuelve» el botón revela los pasos uno por uno, sale la respuesta y «Otro ejemplo» cambia el enunciado;
// sin errores de consola. Deja capturas para mirarlas.
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const [uc, ideaArg, sal = '/tmp/claude-0/quim6-capturas'] = process.argv.slice(2);
const CURSO = process.env.CURSO || 'quimica', U = `${CURSO}.${uc}`, BASE = `http://localhost:${process.env.PORT || 4173}/app/`;
const def = require(path.resolve(__dirname, `../../contenido/teoria/${CURSO}/${uc}.js`));
const idea = def.ideas.find(i => i.id === ideaArg) || def.ideas[0];
fs.mkdirSync(sal, { recursive: true });
(async () => {
  const b = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
  const ok = [], mal = [], errores = [];
  const marca = (c, t) => (c ? ok : mal).push(t);
  async function pagina(est) {
    const ctx = await b.newContext({ viewport: { width: 360, height: 780 }, reducedMotion: 'reduce' });
    const p = await ctx.newPage();
    p.on('pageerror', e => errores.push(e.message));
    p.on('console', m => { if (m.type() === 'error') errores.push(m.text()); });
    await p.addInitScript(l => localStorage.setItem('lab-v1', JSON.stringify(l)), est);
    await p.goto(`${BASE}#/unidad/${U}/teoria/${idea.id}`);
    await p.waitForTimeout(1500);
    return p;
  }
  const foto = (p, n) => p.screenshot({ path: `${sal}/${uc}-${idea.id}-${n}.png`, fullPage: true });
  // Lee
  const p = await pagina({ uni: 'unmsm', grado: '5' });
  const nT = idea.lee.tarjetas.length;
  marca(await p.locator('.te-lee').count() === 1, 'abre en «Lee»');
  marca(await p.locator('.te-lee-t').count() === nT, `${nT} tarjetas`);
  await foto(p, 'lee-1');
  const vis = async () => p.evaluate(() => { const f = document.querySelector('.te-lee'); const w = f.firstElementChild.getBoundingClientRect().width; return Math.round(f.scrollLeft / (w + 12)); });
  for (let k = 1; k < nT; k++) {
    await p.locator(".te-sig").click(); await p.waitForTimeout(700);
    marca(await vis() === k, `el botón pasa a la tarjeta ${k + 1}`);
  }
  await foto(p, 'lee-fin');
  marca(/Juega/.test(await p.locator('.te-sig').innerText()), 'en la última tarjeta el botón dice «Siguiente: Juega»');
  await p.locator('.te-lee-saltar').click(); await p.waitForTimeout(600);
  marca(await p.locator('.te-lee').count() === 0 && await p.evaluate(() => document.querySelector('[data-m]')?.dataset.m) === 'juega', '«Ir directo a jugar» salta al juego');
  await foto(p, 'juega');
  // Así se resuelve
  const est = { uni: 'unmsm', grado: '5', teoria: { [U]: { ideas: { [idea.id]: { momento: 'resuelve' } } } } };
  const q = await pagina(est);
  marca(await q.locator('.te-res-enun').count() === 1, 'abre en «Así se resuelve»');
  const enun1 = await q.locator('.te-res-enun p').innerText();
  const nP = (idea.resuelve.generar(0).pasos || []).length;
  marca(await q.locator('.te-res-paso').count() === 1, 'empieza con un paso');
  await foto(q, 'res-1');
  for (let k = 2; k <= nP; k++) {
    await q.locator('.te-sig').click(); await q.waitForTimeout(250);
    marca(await q.locator('.te-res-paso').count() === k, `revela el paso ${k}`);
  }
  marca(await q.locator('.te-res-resp').count() === 1, 'sale la respuesta');
  await foto(q, 'res-fin');
  await q.locator('.te-res-otro').click(); await q.waitForTimeout(400);
  const enun2 = await q.locator('.te-res-enun p').innerText();
  marca(enun1 !== enun2, `«Otro ejemplo» cambia el enunciado («${enun1.slice(0, 40)}» → «${enun2.slice(0, 40)}»)`);
  const ancho = await q.evaluate(() => document.documentElement.scrollWidth);
  marca(ancho <= 360, `sin desborde (ancho ${ancho})`);
  await foto(q, 'res-otro');
  for (const t of ok) console.log(`✓ ${t}`);
  for (const t of mal) console.log(`✗ ${t}`);
  console.log(errores.length ? `ERRORES: ${[...new Set(errores)].join(' | ')}` : 'sin errores de consola');
  await b.close();
  process.exit(mal.length || errores.length ? 1 : 0);
})();
