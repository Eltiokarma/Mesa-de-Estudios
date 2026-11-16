// Recorrido de la ronda 6 («Lee» y «Así se resuelve») a 360 × 780. Necesita npm run dev.
//   node rutinas/teoria6-aritmetica-b/pw.js <puerto> <carpeta-salida> <unidad> [idea]
// En la idea (la primera si no se da): abre en «Lee», el botón pasa de tarjeta en tarjeta, «Ir directo a jugar» salta al
// juego; en «Así se resuelve» el botón revela los pasos uno por uno, sale la respuesta y «Otro ejemplo» cambia el enunciado.
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');
const [puerto, salida, unidad, ideaPedida] = process.argv.slice(2);
fs.mkdirSync(salida, { recursive: true });
const espera = ms => new Promise(r => setTimeout(r, ms));
const def = require(path.join(process.cwd(), 'contenido/teoria', unidad.replace('.', '/') + '.js'));
const idea = ideaPedida ? def.ideas.find(i => i.id === ideaPedida) : def.ideas[0];
const corto = unidad.split('.')[1];
const mal = [];
const ok = (cond, msg) => { console.log(`${cond ? 'ok ' : 'MAL'} ${msg}`); if (!cond) mal.push(msg); };

async function contexto(b, momento) {
  const ctx = await b.newContext({ viewport: { width: 360, height: 780 }, deviceScaleFactor: 1 });
  await ctx.addInitScript(([u, i, m]) => {
    const est = { nombre: 'Prueba', uni: 'unmsm', grado: '5' };
    if (m) est.teoria = { [u]: { ideas: { [i]: { momento: m } } } };
    localStorage.setItem('lab-v1', JSON.stringify(est));
  }, [unidad, idea.id, momento]);
  return ctx;
}

(async () => {
  const b = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
  const url = `http://localhost:${puerto}/app/#/unidad/${unidad}/teoria/${idea.id}`;
  // 1. Lee
  let ctx = await contexto(b, null), p = await ctx.newPage();
  const errores = [];
  const oir = pg => { pg.on('pageerror', e => errores.push(e.message)); pg.on('console', m => { if (m.type() === 'error') errores.push(m.text()); }); };
  oir(p);
  await p.goto(url); await espera(1200);
  const nT = idea.lee.tarjetas.length;
  ok(await p.$('.te-lee') !== null, `${corto}/${idea.id}: abre en «Lee» (${nT} tarjetas)`);
  await p.screenshot({ path: path.join(salida, `${corto}-${idea.id}-lee1.png`) });
  for (let k = 1; k < nT; k++) {
    await p.click('.te-sig'); await espera(700);
    const on = await p.$$eval('.te-lee-puntos span', s => s.findIndex(x => x.classList.contains('on')));
    ok(on === k, `botón pasa a la tarjeta ${k + 1} (punto ${on + 1})`);
  }
  await p.screenshot({ path: path.join(salida, `${corto}-${idea.id}-lee-ultima.png`) });
  ok((await p.textContent('.te-sig')).includes('Juega'), 'en la última tarjeta el botón dice «Siguiente: Juega»');
  await p.reload(); await espera(1200);
  // al recargar quedó guardado el momento «lee» (no se pasó); saltar
  await p.click('.te-lee-saltar'); await espera(800);
  ok(await p.$('.te-lee') === null && (await p.textContent('.te-sig')).includes('Predice'), '«Ir directo a jugar» salta al juego');
  await p.screenshot({ path: path.join(salida, `${corto}-${idea.id}-juega.png`) });
  await ctx.close();
  // 2. Así se resuelve
  ctx = await contexto(b, 'resuelve'); p = await ctx.newPage(); oir(p);
  await p.goto(url); await espera(1200);
  const enun0 = await p.textContent('.te-res-enun').catch(() => '');
  ok(!!enun0, `abre en «Así se resuelve»: «${enun0.slice(0, 80)}»`);
  const nP = await p.evaluate(() => 0) + (idea.resuelve.generar(0).pasos.length);
  for (let k = 1; k < nP; k++) {
    const antes = await p.$$eval('.te-res-paso', s => s.length);
    await p.click('.te-sig'); await espera(400);
    const desp = await p.$$eval('.te-res-paso', s => s.length);
    ok(desp === antes + 1, `el botón revela el paso ${desp}`);
  }
  await p.screenshot({ path: path.join(salida, `${corto}-${idea.id}-resuelve.png`), fullPage: true });
  ok(await p.$('.te-res-resp') !== null, `sale la respuesta: «${(await p.textContent('.te-res-resp').catch(() => '')).trim()}»`);
  await p.click('.te-res-otro'); await espera(600);
  const enun1 = await p.textContent('.te-res-enun');
  ok(enun1 !== enun0, `«Otro ejemplo» cambia el enunciado: «${enun1.slice(0, 80)}»`);
  ok(errores.length === 0, `sin errores de consola${errores.length ? ': ' + errores.join(' | ') : ''}`);
  await ctx.close(); await b.close();
  process.exit(mal.length ? 1 : 0);
})();
