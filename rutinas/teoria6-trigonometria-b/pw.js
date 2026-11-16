// Recorre en Playwright, a 360 × 780, «Lee» y «Así se resuelve» de una idea (ronda 6).
// Uso, con `npm run dev` corriendo:  node rutinas/teoria6-trigonometria-b/pw.js <curso.unidad> <idea> [salida]
// 1) abre la idea: debe empezar en «Lee»; el botón grande pasa de tarjeta en tarjeta; «Ir directo a jugar» salta al juego.
// 2) con momento 'resuelve' guardado: el botón revela los pasos uno por uno, sale la respuesta y «Otro ejemplo» cambia el enunciado.
const { chromium } = require('playwright');
const [U, ideaId, sal = '/tmp/claude-0/trig6b-capturas'] = process.argv.slice(2);
const BASE = `http://localhost:${process.env.PORT || 4173}/app/`;
const fs = require('fs'); fs.mkdirSync(sal, { recursive: true });
const [curso, uc] = U.split('.');
const def = require(`../../contenido/teoria/${curso}/${uc}.js`);
const idea = def.ideas.find(i => i.id === ideaId);
(async () => {
  const b = await chromium.launch();
  const errores = [];
  const pagina = async momento => {
    const ctx = await b.newContext({ viewport: { width: 360, height: 780 } });
    const p = await ctx.newPage();
    p.on('pageerror', e => errores.push(e.message));
    p.on('console', m => { if (m.type() === 'error') errores.push(m.text()); });
    await p.addInitScript(([u, i, m]) => {
      const est = { uni: 'unmsm', grado: '5' };
      if (m) est.teoria = { [u]: { ideas: { [i]: { momento: m } } } };
      localStorage.setItem('lab-v1', JSON.stringify(est));
    }, [U, ideaId, momento]);
    await p.goto(`${BASE}#/unidad/${U}/teoria/${ideaId}`); await p.waitForTimeout(1200);
    return { p, ctx };
  };
  const nombre = s => `${sal}/${uc}-${ideaId}-${s}.png`;
  // 1) Lee
  let { p, ctx } = await pagina(null);
  const enLee = await p.locator('.te-lee').count();
  const nT = await p.locator('.te-lee-t').count();
  await p.screenshot({ path: nombre('lee-1') });
  const textoSig = async () => (await p.locator('.te-lee-saltar').count()) ? (await p.evaluate(() => { const z = [...document.querySelectorAll('button')].find(b => /Siguiente/.test(b.textContent)); return z ? z.textContent : ''; })) : '';
  const clicSig = async () => { await p.evaluate(() => { const z = [...document.querySelectorAll('button')].find(b => /Siguiente|Paso \d/.test(b.textContent)); z.click(); }); await p.waitForTimeout(700); };
  const puntos = [];
  for (let k = 0; k < nT - 1; k++) { await clicSig(); puntos.push(await p.locator('.te-lee-puntos span.on').evaluate(e => [...e.parentNode.children].indexOf(e))); }
  await p.screenshot({ path: nombre(`lee-${nT}`) });
  const ultimo = await textoSig();
  await clicSig();
  const momentoActual = await p.evaluate(() => { const r = document.querySelector('[data-m]:not(li)'); return r ? r.dataset.m : ''; });
  await ctx.close();
  ({ p, ctx } = await pagina(null));
  await p.locator('.te-lee-saltar').click(); await p.waitForTimeout(700);
  const trasSalto = await p.evaluate(() => { const r = document.querySelector('[data-m]:not(li)'); return r ? r.dataset.m : ''; });
  await p.screenshot({ path: nombre('juega') });
  await ctx.close();
  console.log(`Lee: abre en Lee=${enLee > 0} · ${nT} tarjetas · puntos ${puntos.join(',')} · último botón «${ultimo.trim()}» → ${momentoActual} · saltar → ${trasSalto}`);
  // 2) Así se resuelve
  ({ p, ctx } = await pagina('resuelve'));
  const enun1 = (await p.locator('.te-res-enun p').innerText()).replace(/\s+/g, ' ');
  const conteos = [await p.locator('.te-res-paso').count()];
  await p.screenshot({ path: nombre('resuelve-1') });
  for (let k = 0; k < 8 && !(await p.locator('.te-res-resp').count()); k++) { await clicSig(); conteos.push(await p.locator('.te-res-paso').count()); }
  const resp = (await p.locator('.te-res-resp').innerText().catch(() => '')).replace(/\s+/g, ' ');
  await p.screenshot({ path: nombre('resuelve-fin'), fullPage: true });
  await p.locator('.te-res-otro').click(); await p.waitForTimeout(600);
  const enun2 = (await p.locator('.te-res-enun p').innerText()).replace(/\s+/g, ' ');
  const ancho = await p.evaluate(() => document.documentElement.scrollWidth);
  await ctx.close();
  console.log(`Resuelve: pasos ${conteos.join('→')} · «${resp}» · otro ejemplo cambia: ${enun1 !== enun2} · ancho ${ancho}`);
  console.log(`  1: ${enun1.slice(0, 140)}\n  2: ${enun2.slice(0, 140)}`);
  console.log(errores.length ? `ERRORES: ${errores.join(' | ')}` : 'sin errores de consola');
  await b.close();
})();
