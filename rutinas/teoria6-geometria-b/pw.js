// Recorre «Lee» y «Así se resuelve» de una idea a 360 × 780 (encargo teoria6-geometria-b).
//   node rutinas/teoria6-geometria-b/pw.js <puerto> <unidad> <idea> <carpeta-capturas>
// Comprueba: abre en «Lee», el botón pasa tarjetas, «Ir directo a jugar» salta al juego; en «Así se resuelve» los pasos
// salen uno por uno, aparece la respuesta y «Otro ejemplo» cambia el enunciado; sin errores de consola.
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const [puerto, unidad, idea, salida] = process.argv.slice(2);
fs.mkdirSync(salida, { recursive: true });
const fallas = [];
const ok = (c, m) => { if (!c) fallas.push(m); };
(async () => {
  const b = await chromium.launch();
  const url = `http://localhost:${puerto}/app/#/unidad/${unidad}/teoria/${idea}`;
  const abrir = async momento => {
    const ctx = await b.newContext({ viewport: { width: 360, height: 780 }, deviceScaleFactor: 1 });
    await ctx.addInitScript(([u, i, m]) => {
      const est = { nombre: 'Prueba', uni: 'unmsm', grado: '5', teoria: {} };
      if (m) est.teoria[u] = { ideas: { [i]: { casos: 0, momento: m } } };
      localStorage.setItem('lab-v1', JSON.stringify(est));
    }, [unidad, idea, momento]);
    const p = await ctx.newPage();
    p.on('pageerror', e => fallas.push('pageerror: ' + e.message));
    p.on('console', m => { if (m.type() === 'error') fallas.push('console: ' + m.text()); });
    await p.goto(url); await p.waitForSelector('.te-idea', { timeout: 15000 }); await p.waitForTimeout(500);
    return { ctx, p };
  };
  const tag = `${unidad.split('.')[1]}-${idea}`;
  // Lee
  let { ctx, p } = await abrir(null);
  const n = await p.$$eval('.te-lee-t', xs => xs.length).catch(() => 0);
  ok(n >= 2 && n <= 4, `Lee: ${n} tarjetas (o no abrió en Lee)`);
  await p.screenshot({ path: path.join(salida, `${tag}-lee-1.png`), fullPage: true });
  for (let k = 1; k < n; k++) {
    const antes = await p.$eval('.te-lee', e => e.scrollLeft);
    await p.click('.te-sig'); await p.waitForTimeout(700);
    const desp = await p.$eval('.te-lee', e => e.scrollLeft);
    ok(desp > antes, `Lee: el botón no pasó a la tarjeta ${k + 1}`);
    // El texto del botón se lee antes de la captura: la captura de página completa puede mover el carrusel.
    if (k === n - 1) {
      ok(/Juega/.test(await p.$eval('.te-sig', e => e.textContent)), 'Lee: el botón no dice «Siguiente: Juega» al final');
      await p.screenshot({ path: path.join(salida, `${tag}-lee-${k + 1}.png`), fullPage: true });
    }
  }
  await ctx.close();
  ({ ctx, p } = await abrir(null));
  await p.click('.te-lee-saltar'); await p.waitForTimeout(500);
  ok((await p.$eval('.te-idea', e => e.dataset.m)) === 'juega', '«Ir directo a jugar» no saltó al juego');
  await ctx.close();
  // Así se resuelve
  ({ ctx, p } = await abrir('resuelve'));
  ok(!!(await p.$('.te-res-enun')), 'Resuelve: no abrió en «Así se resuelve»');
  const enun1 = await p.$eval('.te-res-enun p', e => e.textContent).catch(() => '');
  let pasos = await p.$$eval('.te-res-paso', xs => xs.length).catch(() => 0);
  ok(pasos === 1, `Resuelve: arranca con ${pasos} pasos visibles`);
  for (let k = 0; k < 8 && !(await p.$('.te-res-resp')); k++) {
    await p.click('.te-sig'); await p.waitForTimeout(250);
    const ahora = await p.$$eval('.te-res-paso', xs => xs.length);
    ok(ahora === pasos + 1, `Resuelve: el botón no reveló un paso (${pasos} → ${ahora})`); pasos = ahora;
    if (k === 1) await p.screenshot({ path: path.join(salida, `${tag}-res-medio.png`), fullPage: true });
  }
  ok(!!(await p.$('.te-res-resp')), 'Resuelve: no salió la respuesta');
  await p.screenshot({ path: path.join(salida, `${tag}-res-fin.png`), fullPage: true });
  await p.click('.te-res-otro'); await p.waitForTimeout(400);
  const enun2 = await p.$eval('.te-res-enun p', e => e.textContent).catch(() => '');
  ok(enun2 && enun2 !== enun1, '«Otro ejemplo» no cambió el enunciado');
  await ctx.close(); await b.close();
  console.log(fallas.length ? `FALLA ${unidad} ${idea}:\n - ` + fallas.join('\n - ') : `OK ${unidad} ${idea} (${n} tarjetas, ${pasos} pasos)`);
  process.exit(fallas.length ? 1 : 0);
})();
