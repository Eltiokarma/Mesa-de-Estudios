// Recorrido de la ronda 6 («Lee» y «Así se resuelve») a 360 × 780. Necesita npm run dev.
//   node rutinas/teoria6-razonamiento-matematico-b/pw.js <puerto> <carpeta-salida> <unidad> [idea]
// Sin idea, recorre todas las ideas de la unidad. En cada una comprueba: abre en «Lee», el botón pasa de tarjeta en
// tarjeta, «Ir directo a jugar» salta al juego; en «Así se resuelve» el botón revela los pasos uno por uno, sale la
// respuesta y «Otro ejemplo» cambia el enunciado; sin errores de consola. Guarda capturas.
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');
const [puerto, salida, unidad, soloIdea] = process.argv.slice(2);
fs.mkdirSync(salida, { recursive: true });
const espera = ms => new Promise(r => setTimeout(r, ms));

(async () => {
  const b = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
  const def = require(path.join(process.cwd(), 'contenido/teoria', unidad.replace('.', '/') + '.js'));
  const corto = unidad.split('.')[1];
  let malas = 0;
  for (const idea of def.ideas.filter(i => !soloIdea || i.id === soloIdea)) {
    const nom = `${corto}/${idea.id}`, arch = `${corto}-${idea.id}`;
    const fallas = [];
    if (!idea.lee || !idea.resuelve) { malas++; console.log(`${nom}: MAL · falta ${!idea.lee ? 'lee' : ''} ${!idea.resuelve ? 'resuelve' : ''}`); continue; }
    for (const momento of ['lee', 'resuelve']) {
      const ctx = await b.newContext({ viewport: { width: 360, height: 780 }, deviceScaleFactor: 1, reducedMotion: 'reduce' });
      await ctx.addInitScript(([u, i, m]) => {
        const est = { nombre: 'Prueba', uni: 'unmsm', grado: '5' };
        if (m === 'resuelve') est.teoria = { [u]: { ideas: { [i]: { momento: 'resuelve' } } } };
        localStorage.setItem('lab-v1', JSON.stringify(est));
      }, [unidad, idea.id, momento]);
      const p = await ctx.newPage();
      const errores = [];
      p.on('pageerror', e => errores.push(e.message));
      p.on('console', m => { if (m.type() === 'error') errores.push(m.text()); });
      await p.goto(`http://localhost:${puerto}/app/#/unidad/${unidad}/teoria/${idea.id}`); await espera(1000);
      const m = await p.$eval('section.te-idea', e => e.dataset.m).catch(() => null);
      if (momento === 'lee') {
        if (m !== 'lee') fallas.push(`no abre en Lee (abre en ${m})`);
        const n = (idea.lee && idea.lee.tarjetas.length) || 0;
        await p.screenshot({ path: path.join(salida, `${arch}-lee-1.png`) });
        for (let k = 1; k < n; k++) {
          await p.click('.te-sig').catch(() => {});
          await espera(400);
          const pt = await p.$$eval('.te-lee-puntos span', ss => ss.findIndex(s => s.classList.contains('on')));
          if (pt !== k) fallas.push(`tarjeta ${k + 1}: el punto activo es ${pt + 1}`);
        }
        await p.screenshot({ path: path.join(salida, `${arch}-lee-${n}.png`) });
        await p.click('.te-lee-saltar');
        await espera(500);
        const m2 = await p.$eval('section.te-idea', e => e.dataset.m).catch(() => null);
        if (m2 !== 'juega') fallas.push(`«Ir directo a jugar» lleva a ${m2}`);
      } else {
        if (m !== 'resuelve') fallas.push(`no abre en resuelve (abre en ${m})`);
        const enun1 = await p.$eval('.te-res-enun', e => e.textContent).catch(() => '');
        let pasos = await p.$$eval('.te-res-paso', l => l.length);
        if (pasos !== 1) fallas.push(`empieza con ${pasos} pasos`);
        for (let g = 0; g < 8 && !(await p.$('.te-res-resp')); g++) {
          await p.click('.te-sig'); await espera(300);
          const ahora = await p.$$eval('.te-res-paso', l => l.length);
          if (ahora !== pasos + 1) fallas.push(`el botón pasó de ${pasos} a ${ahora} pasos`);
          pasos = ahora;
        }
        if (!(await p.$('.te-res-resp'))) fallas.push('no sale la respuesta');
        await p.screenshot({ path: path.join(salida, `${arch}-resuelve.png`), fullPage: true });
        await p.click('.te-res-otro'); await espera(400);
        const enun2 = await p.$eval('.te-res-enun', e => e.textContent).catch(() => '');
        if (enun1 === enun2) fallas.push('«Otro ejemplo» no cambia el enunciado');
        await p.screenshot({ path: path.join(salida, `${arch}-resuelve-otro.png`) });
      }
      if (errores.length) fallas.push(`${momento}: errores de consola: ${errores.join(' | ')}`);
      await ctx.close();
    }
    if (fallas.length) malas++;
    console.log(`${nom}: ${fallas.length ? 'MAL · ' + fallas.join(' · ') : 'ok'}`);
  }
  await b.close();
  process.exitCode = malas ? 1 : 0;
})();
