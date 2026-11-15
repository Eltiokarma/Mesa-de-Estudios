// Recorre la animación automática de una unidad (ronda 5, docs/3d.md §6) a 360 × 780 con swiftshader.
// Uso, con `npm run dev` corriendo:
//   node rutinas/teoria5-quimica-b/pw-anim.js <unidad-corta> [salida]
// Ej.: node rutinas/teoria5-quimica-b/pw-anim.js soluciones
// En cada idea y en la primera mesa comprueba: hay «⏸ Pausa» · la lectura (o la figura) cambia sola en 700 ms ·
// «⏸ Pausa» la congela · con movimiento reducido arranca quieta. Deja capturas de dos momentos para mirarlas.
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const [uc, sal = '/tmp/claude-0/quim5-capturas'] = process.argv.slice(2);
const U = `quimica.${uc}`, BASE = `http://localhost:${process.env.PORT || 4173}/app/`;
const def = require(path.resolve(__dirname, `../../contenido/teoria/quimica/${uc}.js`));
fs.mkdirSync(sal, { recursive: true });
const lab = { uni: 'unmsm', grado: '5' };
(async () => {
  const b = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
  const ok = [], mal = [], errores = [];
  const marca = (c, t) => (c ? ok : mal).push(t);
  async function pagina(reducido) {
    const ctx = await b.newContext({ viewport: { width: 360, height: 780 }, reducedMotion: reducido ? 'reduce' : 'no-preference' });
    const p = await ctx.newPage();
    p.on('pageerror', e => errores.push(e.message));
    p.on('console', m => { if (m.type() === 'error') errores.push(m.text()); });
    await p.addInitScript(l => localStorage.setItem('lab-v1', JSON.stringify(l)), lab);
    return p;
  }
  const foto = async (p, sel) => {
    const lec = await p.locator(`${sel} .te-lectura`).first().innerText().catch(() => '');
    const fig = await p.locator(`${sel} .te-fig`).first().innerHTML().catch(() => '');
    return { lec: lec.replace(/\s+/g, ' '), fig };
  };
  const p = await pagina(false), q = await pagina(true);
  const blancos = [...def.ideas.map(i => ({ id: i.id, sel: '.te-idea', ruta: i.id })), { id: `labo-${def.laboratorio[0].id}`, sel: '.te-labo', ruta: 'laboratorio' }];
  for (const x of blancos) {
    await p.goto(`${BASE}#/unidad/${U}/teoria/${x.ruta}`); await p.waitForTimeout(1500);
    await p.locator(`${x.sel} .te-fig`).first().scrollIntoViewIfNeeded().catch(() => {});
    await p.waitForTimeout(300);
    const play = p.locator('.te-play').first();
    const hay = await play.count();
    marca(hay, `${x.id}: hay botón de pausa`);
    if (!hay) continue;
    const a = await foto(p, x.sel);
    await p.screenshot({ path: `${sal}/${uc}-${x.id}-1.png` });
    await p.waitForTimeout(700);
    const b2 = await foto(p, x.sel);
    await p.screenshot({ path: `${sal}/${uc}-${x.id}-2.png` });
    marca(a.lec !== b2.lec, `${x.id}: la lectura cambia sola («${a.lec.slice(0, 50)}» → «${b2.lec.slice(0, 50)}»)`);
    marca(a.fig !== b2.fig || /kit-3d/.test(a.fig), `${x.id}: la figura cambia sola`);
    await play.click(); await p.waitForTimeout(150);
    const c = await foto(p, x.sel); await p.waitForTimeout(700); const d = await foto(p, x.sel);
    marca(c.lec === d.lec && c.fig === d.fig && /Seguir/.test(await play.innerText()), `${x.id}: «⏸ Pausa» la congela`);
    await q.goto(`${BASE}#/unidad/${U}/teoria/${x.ruta}`); await q.waitForTimeout(1500);
    await q.locator(`${x.sel} .te-fig`).first().scrollIntoViewIfNeeded().catch(() => {});
    const e = await foto(q, x.sel); await q.waitForTimeout(700); const g = await foto(q, x.sel);
    marca(e.lec === g.lec && e.fig === g.fig && /Seguir/.test(await q.locator('.te-play').first().innerText().catch(() => '')), `${x.id}: con movimiento reducido arranca quieta`);
    const ancho = await p.evaluate(() => document.documentElement.scrollWidth);
    marca(ancho <= 360, `${x.id}: sin desborde (ancho ${ancho})`);
  }
  for (const t of ok) console.log(`✓ ${t}`);
  for (const t of mal) console.log(`✗ ${t}`);
  console.log(errores.length ? `ERRORES: ${[...new Set(errores)].join(' | ')}` : 'sin errores de consola');
  await b.close();
  process.exit(mal.length || errores.length ? 1 : 0);
})();
