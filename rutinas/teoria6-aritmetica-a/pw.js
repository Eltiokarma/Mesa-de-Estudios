// Recorrido de la ronda 6 («Lee» y «Así se resuelve») a 360 × 780. Necesita npm run dev.
//   node rutinas/teoria6-aritmetica-a/pw.js <puerto> <carpeta-salida> <unidad> [idea]
// Abre la idea: comprueba que arranca en «Lee», que el botón pasa de tarjeta en tarjeta y que «Ir directo a jugar»
// salta al juego. Luego pone momento: 'resuelve': el botón revela los pasos uno por uno, sale la respuesta y
// «Otro ejemplo» cambia el enunciado. Reporta errores de consola. Guarda capturas.
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');
const [puerto, salida, unidad, ideaPedida] = process.argv.slice(2);
fs.mkdirSync(salida, { recursive: true });
const espera = ms => new Promise(r => setTimeout(r, ms));
const def = require(path.join(process.cwd(), 'contenido/teoria', unidad.replace('.', '/') + '.js'));
const idea = ideaPedida ? def.ideas.find(i => i.id === ideaPedida) : def.ideas[def.ideas.length - 1];
const corto = unidad.split('.')[1];
const malos = [];
const ok = (cond, txt) => { console.log(`${cond ? 'ok ' : 'MAL'} ${txt}`); if (!cond) malos.push(txt); };

(async () => {
  const b = await chromium.launch();
  const base = `http://localhost:${puerto}/app/#/unidad/${unidad}/teoria/${idea.id}`;
  const abrir = async momento => {
    const ctx = await b.newContext({ viewport: { width: 360, height: 780 }, deviceScaleFactor: 1 });
    await ctx.addInitScript(([u, i, m]) => {
      const est = { nombre: 'Prueba', uni: 'unmsm', grado: '5' };
      if (m) est.teoria = { [u]: { ideas: { [i]: { momento: m } } } };
      localStorage.setItem('lab-v1', JSON.stringify(est));
    }, [unidad, idea.id, momento]);
    const p = await ctx.newPage();
    const errores = [];
    p.on('pageerror', e => errores.push(e.message));
    p.on('console', m => { if (m.type() === 'error') errores.push(m.text()); });
    await p.goto(base); await espera(1200);
    return { ctx, p, errores };
  };
  const foto = (p, n) => p.screenshot({ path: path.join(salida, `${corto}-${idea.id}-${n}.png`), fullPage: true });

  // 1. Lee
  let { ctx, p, errores } = await abrir(null);
  const titulo = await p.$eval('.te-zona h3', e => e.textContent).catch(() => '');
  ok(titulo.trim() === 'Lee', `${corto}/${idea.id}: abre en «Lee» (${titulo.trim()})`);
  const nT = idea.lee.tarjetas.length;
  ok(await p.$$eval('.te-lee-t', e => e.length) === nT, `${nT} tarjetas`);
  await foto(p, 'lee-1');
  for (let k = 1; k < nT; k++) {
    await p.click('.te-sig'); await espera(1200);
    const on = await p.$$eval('.te-lee-puntos span', es => es.findIndex(e => e.classList.contains('on')));
    ok(on === k, `botón pasa a la tarjeta ${k + 1} (punto ${on + 1})`);
  }
  ok(/Juega/.test(await p.textContent('.te-sig')), 'en la última tarjeta el botón dice «Juega»');
  await foto(p, 'lee-fin');   // después: la captura de página completa mueve el carrusel
  await p.click('.te-lee-saltar'); await espera(800);
  const t2 = await p.$eval('.te-zona h3', e => e.textContent).catch(() => '');
  ok(/Juega/i.test(t2) || !!(await p.$('.te-control, .te-controles, input[type=range]')), `«Ir directo a jugar» salta al juego (${t2.trim()})`);
  await foto(p, 'juega');
  ok(!errores.length, 'sin errores de consola en Lee/Juega' + (errores.length ? ': ' + errores.join(' | ') : ''));
  await ctx.close();

  // 2. Así se resuelve
  ({ ctx, p, errores } = await abrir('resuelve'));
  const enun1 = await p.$eval('.te-res-enun p', e => e.textContent).catch(() => '');
  ok(!!enun1, `abre «Así se resuelve»: «${enun1.slice(0, 80)}»`);
  let n = await p.$$eval('.te-res-paso', e => e.length);
  ok(n === 1, 'empieza con 1 paso visible');
  await foto(p, 'res-1');
  let guard = 0;
  while (!(await p.$('.te-res-resp')) && guard++ < 8) {
    const antes = n;
    await p.click('.te-sig'); await espera(350);
    n = await p.$$eval('.te-res-paso', e => e.length);
    ok(n === antes + 1, `el botón revela el paso ${n}`);
  }
  ok(!!(await p.$('.te-res-resp')), `sale la respuesta: «${(await p.textContent('.te-res-resp').catch(() => '')).slice(0, 60)}»`);
  await foto(p, 'res-fin');
  await p.click('.te-res-otro'); await espera(400);
  const enun2 = await p.$eval('.te-res-enun p', e => e.textContent).catch(() => '');
  ok(enun2 && enun2 !== enun1, `«Otro ejemplo» cambia el enunciado: «${enun2.slice(0, 80)}»`);
  await foto(p, 'res-otro');
  ok(!errores.length, 'sin errores de consola en Así se resuelve' + (errores.length ? ': ' + errores.join(' | ') : ''));
  await ctx.close();
  await b.close();
  console.log(malos.length ? `FALLAS: ${malos.length}` : 'TODO OK');
  process.exit(malos.length ? 1 : 0);
})();
