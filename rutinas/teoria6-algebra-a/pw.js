// Recorre en Playwright, a 360 × 780, «Lee» y «Así se resuelve» de una idea (ronda 6, encargo teoria6-algebra-a).
// Uso, con `npm run dev` corriendo:  node rutinas/teoria6-algebra-a/pw.js <curso.unidad> [indice de idea, desde 0] [salida]
// 1) La idea abre en «Lee»: el botón pasa de tarjeta en tarjeta y «Ir directo a jugar» salta al juego.
// 2) Con momento 'resuelve' guardado: el botón revela los pasos uno por uno, sale la respuesta y «Otro ejemplo» cambia el enunciado.
const { chromium } = require('playwright');
const [U, ix = '0', sal = '/tmp/claude-0/teoria6-alg-a'] = process.argv.slice(2);
const [curso, uc] = U.split('.');
const BASE = `http://localhost:${process.env.PORT || 4173}/app/`;
const fs = require('fs'); fs.mkdirSync(sal, { recursive: true });
const def = require(`../../contenido/teoria/${curso}/${uc}.js`);
const idea = def.ideas[+ix];
const fallas = [];
const ok = (c, m) => { if (!c) fallas.push(m); console.log(`${c ? '✓' : '✗'} ${m}`); };
(async () => {
  const b = await chromium.launch();
  const nuevaPagina = async momento => {
    const p = await b.newPage({ viewport: { width: 360, height: 780 } });
    p._err = [];
    p.on('pageerror', e => p._err.push(e.message));
    p.on('console', m => { if (m.type() === 'error') p._err.push(m.text()); });
    await p.addInitScript(([u, i, mom]) => {
      const est = { uni: 'unmsm', grado: '5',
        temas: { [u]: { entrada: { fecha: '2026-11-16', aciertos: 0, total: 5, nose: 0, sabidas: [], expuesto: [] } } } };
      if (mom) est.teoria = { [u]: { ideas: { [i]: { momento: mom } } } };
      localStorage.setItem('lab-v1', JSON.stringify(est));
    }, [U, idea.id, momento]);
    await p.goto(`${BASE}#/unidad/${U}/teoria/${idea.id}`); await p.waitForTimeout(1200);
    return p;
  };
  // 1) Lee
  let p = await nuevaPagina(null);
  const n = idea.lee.tarjetas.length;
  ok(await p.locator('.te-lee').count() === 1, `abre en «Lee» (${n} tarjetas)`);
  await p.screenshot({ path: `${sal}/${uc}-${ix}-lee-1.png` });
  for (let k = 1; k < n; k++) {
    await p.locator('.te-sig').first().click().catch(() => {});
    await p.waitForTimeout(700);
    const on = await p.locator('.te-lee-puntos span').evaluateAll(xs => xs.findIndex(x => x.classList.contains('on')));
    ok(on === k, `el botón pasa a la tarjeta ${k + 1}`);
    await p.screenshot({ path: `${sal}/${uc}-${ix}-lee-${k + 1}.png` });
  }
  await p.locator('.te-lee-saltar').click(); await p.waitForTimeout(600);
  const mJ = await p.evaluate(() => { const r = document.querySelector('.te-sig').closest('[data-m]'); return r && r.dataset.m; });
  ok(await p.locator('.te-lee').count() === 0 && mJ === 'juega', `«Ir directo a jugar» salta al juego (momento ${mJ})`);
  await p.screenshot({ path: `${sal}/${uc}-${ix}-juega.png` });
  const e1 = p._err; await p.close();
  // 2) Así se resuelve
  p = await nuevaPagina('resuelve');
  ok(await p.locator('.te-res-enun').count() === 1, 'abre en «Así se resuelve»');
  const enun1 = await p.locator('.te-res-enun p').innerText();
  const sig = p.locator('.te-sig').first();
  let pasos = await p.locator('.te-res-paso').count();
  ok(pasos === 1, 'empieza con un paso');
  for (let k = 0; k < 8 && !(await p.locator('.te-res-resp').count()); k++) {
    await sig.click(); await p.waitForTimeout(300);
    const ahora = await p.locator('.te-res-paso').count();
    if (!(await p.locator('.te-res-resp').count())) ok(ahora === pasos + 1, `el botón revela el paso ${ahora}`);
    pasos = ahora;
  }
  ok(await p.locator('.te-res-resp').count() === 1, `sale la respuesta tras ${pasos} pasos: «${(await p.locator('.te-res-resp').innerText().catch(() => '')).replace(/\s+/g, ' ')}»`);
  await p.locator('.te-res-resp').scrollIntoViewIfNeeded();
  await p.screenshot({ path: `${sal}/${uc}-${ix}-resuelve.png`, fullPage: true });
  await p.locator('.te-res-otro').click(); await p.waitForTimeout(500);
  const enun2 = await p.locator('.te-res-enun p').innerText();
  ok(enun2 !== enun1, `«Otro ejemplo» cambia el enunciado («${enun1.slice(0, 60)}» → «${enun2.slice(0, 60)}»)`);
  const ancho = await p.evaluate(() => document.documentElement.scrollWidth);
  ok(ancho <= 360, `sin desborde horizontal (ancho ${ancho})`);
  const errs = e1.concat(p._err);
  ok(!errs.length, errs.length ? `errores de consola: ${errs.join(' | ')}` : 'sin errores de consola');
  await b.close();
  console.log(fallas.length ? `FALLAS: ${fallas.length}` : 'TODO BIEN');
  process.exit(fallas.length ? 1 : 0);
})();
