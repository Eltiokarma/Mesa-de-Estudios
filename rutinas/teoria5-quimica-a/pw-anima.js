// Recorre la animación automática (docs/3d.md §6) de unidades de química, a 360 × 780.
// Con `npm run dev` corriendo:  node rutinas/teoria5-quimica-a/pw-anima.js <unidad-corta> [más…]
// Por idea y por la primera mesa: la lectura cambia sola en 700 ms, «⏸ Pausa» la congela y, con movimiento
// reducido, arranca quieta. Deja capturas en $SAL.
const path = require('path');
const fs = require('fs');
const { chromium } = require('playwright');
const RAIZ = path.join(__dirname, '..', '..');
const SAL = process.env.SAL || '/tmp/claude-0/quimica-a-capturas';
const BASE = `http://localhost:${process.env.PORT || 4173}/app/`;
fs.mkdirSync(SAL, { recursive: true });

async function revisar(p, nombre, conPausa) {
  const lec = p.locator('.te-lectura').first();
  await p.waitForTimeout(500);
  const a = (await lec.innerText()).trim();
  await p.waitForTimeout(700);
  const b = (await lec.innerText()).trim();
  const play = p.locator('.te-play').first();
  const hay = await play.count();
  const rot = hay ? (await play.innerText()).trim() : '(sin botón)';
  let congela = null;
  if (conPausa && hay) {
    await p.addStyleTag({ content: '.te-sig,.te-acc,.te-accion{visibility:hidden!important}' }).catch(() => {});
    const fig = p.locator('.te-fig').first();
    await fig.scrollIntoViewIfNeeded().catch(() => {});
    await fig.screenshot({ path: `${SAL}/${nombre}.png` }).catch(() => p.screenshot({ path: `${SAL}/${nombre}.png` }));
    await play.click();
    await p.waitForTimeout(200);
    const c = (await lec.innerText()).trim();
    await p.waitForTimeout(700);
    const d = (await lec.innerText()).trim();
    congela = c === d;
    await play.click();
  }
  return { cambia: a !== b, a, b, rot, congela };
}

(async () => {
  const unidades = process.argv.slice(2);
  const br = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
  let fallas = 0;
  for (const uc of unidades) {
    const U = `quimica.${uc}`;
    const def = require(path.join(RAIZ, 'contenido', 'teoria', 'quimica', `${uc}.js`));
    for (const mov of [false, true]) {
      const ctx = await br.newContext({ viewport: { width: 360, height: 780 }, reducedMotion: mov ? 'reduce' : 'no-preference' });
      const p = await ctx.newPage();
      const errores = [];
      p.on('pageerror', e => errores.push(e.message));
      p.on('console', m => { if (m.type() === 'error') errores.push(m.text()); });
      await p.addInitScript(() => { if (!localStorage.getItem('lab-v1')) localStorage.setItem('lab-v1', JSON.stringify({ uni: 'unmsm', grado: '5' })); });
      const lugares = def.ideas.map(i => ({ h: `/unidad/${U}/teoria/${i.id}`, n: `${uc}-${i.id}` }));
      lugares.push({ h: `/unidad/${U}/teoria/laboratorio`, n: `${uc}-lab-${(def.laboratorio || [{ id: '?' }])[0].id}` });
      for (const l of lugares) {
        await p.goto(`${BASE}#${l.h}`); await p.waitForTimeout(1200);
        const r = await revisar(p, l.n + (mov ? '-quieta' : ''), !mov);
        const ok = mov ? (!r.cambia && /Seguir/.test(r.rot)) : (r.cambia && r.congela && /Pausa/.test(r.rot));
        if (!ok) fallas++;
        console.log(`${ok ? 'ok ' : 'MAL'} ${mov ? '[reducido] ' : ''}${l.n}: cambia=${r.cambia} congela=${r.congela} botón «${r.rot}» · «${r.a.slice(0, 60)}» → «${r.b.slice(0, 60)}»`);
      }
      if (errores.length) { fallas++; console.log('   errores:', errores.slice(0, 5).join(' | ')); }
      await ctx.close();
    }
  }
  await br.close();
  console.log(fallas ? `${fallas} con problemas` : 'todo bien');
  process.exitCode = fallas ? 1 : 0;
})();
