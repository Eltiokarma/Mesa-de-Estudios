// Recorrido de la animación automática (ronda 5, docs/3d.md §6) a 360 × 780, con swiftshader.
// Uso, con `npm run dev` corriendo (PORT=4173 por defecto):
//   node rutinas/teoria5-fisica-a/pw-anim.js <unidad-corta> [salida] [ideas,separadas,por,coma]
// Para cada idea pedida (por defecto, todas) y la primera mesa del laboratorio comprueba:
//   · la lectura cambia sola entre dos momentos (700 ms) · «⏸ Pausa» la congela · con movimiento reducido arranca quieta.
// Deja capturas (dos momentos por pantalla) en la carpeta de salida.
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const [uc, sal = '/tmp/claude-0/fis5-capturas', soloIdeas] = process.argv.slice(2);
const U = `fisica.${uc}`, BASE = `http://localhost:${process.env.PORT || 4173}/app/`;
const def = require(path.resolve('contenido/teoria/fisica', `${uc}.js`));
const ideas = def.ideas.map(i => i.id).filter(id => !soloIdeas || soloIdeas.split(',').includes(id));
fs.mkdirSync(sal, { recursive: true });
const ok = [], mal = [], errores = [];
const marca = (c, t) => (c ? ok : mal).push(t);
const espera = ms => new Promise(r => setTimeout(r, ms));
async function pagina(b, reducido) {
  const ctx = await b.newContext({ viewport: { width: 360, height: 780 }, reducedMotion: reducido ? 'reduce' : 'no-preference' });
  const p = await ctx.newPage();
  p.on('pageerror', e => errores.push(e.message));
  p.on('console', m => { if (m.type() === 'error' && !/favicon|Failed to load resource/.test(m.text())) errores.push(m.text()); });
  await p.addInitScript(() => localStorage.setItem('lab-v1', JSON.stringify({ uni: 'unmsm', grado: '5' })));
  return { ctx, p };
}
const leer = p => p.locator('.te-idea .te-lectura').first().innerText().catch(() => '');
async function revisar(b, nombre, hash, esLab) {
  const { ctx, p } = await pagina(b, false);
  await p.goto(`${BASE}#${hash}`); await p.waitForTimeout(1500);
  if (esLab) { await p.locator('[data-mesa]').first().click(); await p.waitForTimeout(1500); }
  await p.locator('.te-fig').first().evaluate(el => el.scrollIntoView({ block: 'center' })).catch(() => {}); await p.waitForTimeout(200);
  const play = p.locator('.te-play');
  const hay = await play.count();
  marca(hay, `${nombre}: tiene control animado («⏸ Pausa»)`);
  if (!hay) { await p.screenshot({ path: `${sal}/${nombre}-sin.png` }); await ctx.close(); return; }
  const l1 = await leer(p); await p.screenshot({ path: `${sal}/${nombre}-a.png` });
  await p.waitForTimeout(700);
  const l2 = await leer(p); await p.screenshot({ path: `${sal}/${nombre}-b.png` });
  marca(l1 !== l2, `${nombre}: la lectura cambia sola («${l1.replace(/\s+/g, ' ').slice(0, 50)}» → «${l2.replace(/\s+/g, ' ').slice(0, 50)}»)`);
  await play.first().click(); await p.waitForTimeout(150);
  const l3 = await leer(p); await p.waitForTimeout(700); const l4 = await leer(p);
  marca(l3 === l4 && /Seguir/.test(await play.first().innerText()), `${nombre}: «⏸ Pausa» la congela`);
  await ctx.close();
  const r = await pagina(b, true);
  await r.p.goto(`${BASE}#${hash}`); await r.p.waitForTimeout(1500);
  if (esLab) { await r.p.locator('[data-mesa]').first().click(); await r.p.waitForTimeout(1500); }
  const m1 = await leer(r.p); await r.p.waitForTimeout(700); const m2 = await leer(r.p);
  marca(m1 === m2 && /Seguir/.test(await r.p.locator('.te-play').first().innerText().catch(() => '')), `${nombre}: con movimiento reducido arranca quieta`);
  await r.ctx.close();
}
(async () => {
  const b = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
  for (const id of ideas) await revisar(b, id, `/unidad/${U}/teoria/${id}`, false);
  if (!soloIdeas || soloIdeas.split(',').includes('lab')) await revisar(b, `lab-${def.laboratorio[0].id}`, `/unidad/${U}/teoria/laboratorio`, true);
  for (const t of ok) console.log(`✓ ${t}`);
  for (const t of mal) console.log(`✗ ${t}`);
  console.log(errores.length ? `ERRORES: ${[...new Set(errores)].join(' | ')}` : 'sin errores de consola');
  await b.close();
  process.exit(mal.length || errores.length ? 1 : 0);
})();
