// Recorrido de la ronda 6 («Lee» y «Así se resuelve») a 360 × 780. Necesita npm run dev.
//   node rutinas/teoria6-razonamiento-verbal-b/pw.js <puerto> <carpeta-salida> <unidad> [idea]
// Idea (por defecto la primera): abre en «Lee», el botón pasa de tarjeta en tarjeta, «Ir directo a jugar» salta al juego;
// con momento 'resuelve', el botón revela los pasos uno por uno, sale la respuesta y «Otro ejemplo» cambia el enunciado.
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');
const [puerto, salida, unidad, ideaArg] = process.argv.slice(2);
fs.mkdirSync(salida, { recursive: true });
const espera = ms => new Promise(r => setTimeout(r, ms));
const def = require(path.join(process.cwd(), 'contenido/teoria', unidad.replace('.', '/') + '.js'));
const idea = ideaArg ? def.ideas.find(i => i.id === ideaArg) : def.ideas[0];
const corto = unidad.split('.')[1];
const ok = (c, m) => { console.log(`${c ? 'ok ' : 'MAL'} ${m}`); if (!c) process.exitCode = 1; };

(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 360, height: 780 }, deviceScaleFactor: 1 });
  await ctx.addInitScript(([u, i]) => {
    if (location.protocol === 'about:') return;
    if (sessionStorage.getItem('fase') === 'resuelve') {
      const e = JSON.parse(localStorage.getItem('lab-v1') || '{}');
      e.teoria = e.teoria || {}; e.teoria[u] = e.teoria[u] || { ideas: {} }; e.teoria[u].ideas = e.teoria[u].ideas || {};
      e.teoria[u].ideas[i] = Object.assign(e.teoria[u].ideas[i] || {}, { momento: 'resuelve' });
      localStorage.setItem('lab-v1', JSON.stringify(e));
    } else if (!localStorage.getItem('lab-v1')) localStorage.setItem('lab-v1', JSON.stringify({ nombre: 'Prueba', uni: 'unmsm', grado: '5' }));
  }, [unidad, idea.id]);
  const p = await ctx.newPage();
  const errores = [];
  p.on('pageerror', e => errores.push(e.message));
  p.on('console', m => { if (m.type() === 'error') errores.push(m.text()); });
  const url = `http://localhost:${puerto}/app/#/unidad/${unidad}/teoria/${idea.id}`;
  await p.goto(url); await espera(1200);
  const n = idea.lee.tarjetas.length;
  ok(await p.$('.te-lee'), `${corto}/${idea.id}: abre en «Lee» (${n} tarjetas)`);
  await p.screenshot({ path: path.join(salida, `${corto}-lee-1.png`) });
  for (let k = 1; k < n; k++) {
    await p.click('.te-sig'); await espera(700);
    const on = await p.$$eval('.te-lee-puntos span', xs => xs.findIndex(x => x.classList.contains('on')));
    ok(on === k, `botón pasa a la tarjeta ${k + 1} (punto ${on + 1})`);
    await p.screenshot({ path: path.join(salida, `${corto}-lee-${k + 1}.png`) });
  }
  ok((await p.textContent('.te-sig')).includes('Juega'), 'en la última tarjeta el botón dice «Siguiente: Juega»');
  await p.click('.te-lee-saltar'); await espera(800);
  ok(!(await p.$('.te-lee')) && (await p.textContent('.te-sig')).includes('Predice'), '«Ir directo a jugar» salta al juego');
  await p.screenshot({ path: path.join(salida, `${corto}-juega.png`) });

  await p.evaluate(() => sessionStorage.setItem('fase', 'resuelve'));
  await p.goto('about:blank'); await p.goto(url); await espera(1200);
  ok(await p.$('.te-res-enun'), 'abre en «Así se resuelve»');
  const enun1 = await p.textContent('.te-res-enun');
  let pasos = await p.$$eval('.te-res-paso', xs => xs.length);
  ok(pasos === 1, `empieza con 1 paso visible`);
  await p.screenshot({ path: path.join(salida, `${corto}-res-1.png`) });
  let guardia = 0;
  while (!(await p.$('.te-res-resp')) && guardia++ < 8) {
    await p.click('.te-sig'); await espera(400);
    const m = await p.$$eval('.te-res-paso', xs => xs.length);
    ok(m === pasos + 1, `el botón revela el paso ${m}`); pasos = m;
  }
  ok(await p.$('.te-res-resp'), `sale la respuesta tras ${pasos} pasos: «${(await p.textContent('.te-res-resp')).trim()}»`);
  await p.evaluate(() => scrollTo(0, 0));
  await p.screenshot({ path: path.join(salida, `${corto}-res-fin.png`), fullPage: true });
  await p.click('.te-res-otro'); await espera(500);
  const enun2 = await p.textContent('.te-res-enun');
  ok(enun2 !== enun1, `«Otro ejemplo» cambia el enunciado`);
  await p.screenshot({ path: path.join(salida, `${corto}-res-otro.png`) });
  ok(errores.length === 0, `sin errores de consola${errores.length ? ': ' + errores.join(' | ') : ''}`);
  await b.close();
})();
