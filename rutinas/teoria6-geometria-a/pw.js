// Recorrido de «Lee» y «Así se resuelve» (ronda 6, docs/teoria.md §4e) a 360 × 780.
// Uso, con `npm run dev` corriendo (PORT=4173 por defecto):
//   node rutinas/teoria6-geometria-a/pw.js <unidad-corta> [salida] [idea]
// En la idea pedida (por defecto, la primera) comprueba:
//   · abre en «Lee», el botón grande pasa de tarjeta en tarjeta y «Ir directo a jugar» salta al juego;
//   · en «Así se resuelve» el botón revela los pasos uno por uno, sale la respuesta y «Otro ejemplo» cambia el enunciado;
//   · no hay errores de consola. Deja capturas en la carpeta de salida.
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const [uc, sal = '/tmp/claude-0/geo6-capturas', soloIdea] = process.argv.slice(2);
const U = `geometria.${uc}`, BASE = `http://localhost:${process.env.PORT || 4173}/app/`;
const def = require(path.resolve('contenido/teoria/geometria', `${uc}.js`));
const idea = def.ideas.find(i => !soloIdea || i.id === soloIdea);
fs.mkdirSync(sal, { recursive: true });
const ok = [], mal = [], errores = [];
const marca = (c, t) => (c ? ok : mal).push(t);
async function pagina(b, est) {
  const ctx = await b.newContext({ viewport: { width: 360, height: 780 } });
  const p = await ctx.newPage();
  p.on('pageerror', e => errores.push(e.message));
  p.on('console', m => { if (m.type() === 'error' && !/favicon|Failed to load resource/.test(m.text())) errores.push(m.text()); });
  await p.addInitScript(e => localStorage.setItem('lab-v1', JSON.stringify(e)), est);
  return { ctx, p };
}
(async () => {
  const b = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
  const hash = `#/unidad/${U}/teoria/${idea.id}`;
  // 1. Lee
  let { ctx, p } = await pagina(b, { uni: 'unmsm', grado: '5' });
  await p.goto(BASE + hash); await p.waitForTimeout(1500);
  const n = idea.lee.tarjetas.length;
  marca(await p.locator('.te-lee').count() === 1, `${idea.id}: abre en «Lee» (${n} tarjetas)`);
  await p.screenshot({ path: `${sal}/${uc}-lee-1.png` });
  for (let k = 1; k < n; k++) {
    await p.locator('.te-sig').click(); await p.waitForTimeout(700);
    const on = await p.locator('.te-lee-puntos span').evaluateAll(xs => xs.findIndex(x => x.classList.contains('on')));
    marca(on === k, `${idea.id}: el botón pasa a la tarjeta ${k + 1}`);
    await p.screenshot({ path: `${sal}/${uc}-lee-${k + 1}.png` });
  }
  marca(/Juega/.test(await p.locator('.te-sig').innerText()), `${idea.id}: en la última tarjeta el botón dice «Siguiente: Juega»`);
  await p.goto(BASE + '#/inicio'); await p.goto(BASE + hash); await p.waitForTimeout(1200);
  if (await p.locator('.te-lee-saltar').count()) {
    await p.locator('.te-lee-saltar').click(); await p.waitForTimeout(1000);
    marca(await p.locator('.te-lee').count() === 0 && await p.locator('.te-fig svg, .te-fig canvas').count() > 0, `${idea.id}: «Ir directo a jugar» salta al juego`);
    await p.screenshot({ path: `${sal}/${uc}-juega.png` });
  } else marca(false, `${idea.id}: no se encontró «Ir directo a jugar» (¿no abrió en Lee?)`);
  await ctx.close();
  // 2. Así se resuelve
  ({ ctx, p } = await pagina(b, { uni: 'unmsm', grado: '5', teoria: { [U]: { ideas: { [idea.id]: { casos: 9, momento: 'resuelve' } } } } }));
  await p.goto(BASE + hash); await p.waitForTimeout(1500);
  const enun1 = await p.locator('.te-res-enun p').innerText().catch(() => '');
  marca(!!enun1, `${idea.id}: abre «Así se resuelve» («${enun1.slice(0, 60)}»)`);
  const total = idea.resuelve.generar(0).pasos.length;
  for (let k = 2; k <= total; k++) {
    await p.locator('.te-sig').click(); await p.waitForTimeout(400);
    marca(await p.locator('.te-res-paso').count() === k, `${idea.id}: paso ${k} de ${total} revelado`);
    if (k === 2 || k === total) await p.screenshot({ path: `${sal}/${uc}-res-${k}.png`, fullPage: true });
  }
  marca(await p.locator('.te-res-resp').count() === 1, `${idea.id}: sale la respuesta`);
  await p.locator('.te-res-otro').click(); await p.waitForTimeout(500);
  const enun2 = await p.locator('.te-res-enun p').innerText().catch(() => '');
  marca(enun2 && enun2 !== enun1, `${idea.id}: «Otro ejemplo» cambia el enunciado («${enun2.slice(0, 60)}»)`);
  await p.screenshot({ path: `${sal}/${uc}-res-otro.png` });
  await ctx.close();
  for (const t of ok) console.log(`✓ ${t}`);
  for (const t of mal) console.log(`✗ ${t}`);
  console.log(errores.length ? `ERRORES: ${[...new Set(errores)].join(' | ')}` : 'sin errores de consola');
  await b.close();
  process.exit(mal.length || errores.length ? 1 : 0);
})();
