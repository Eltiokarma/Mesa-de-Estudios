// Recorrido de la ronda 6 («Lee» y «Así se resuelve») a 360 × 780. Necesita npm run dev.
//   node rutinas/teoria6-fisica-b/pw.js <puerto> <carpeta-salida> <unidad> [idea]
// Sin idea, recorre todas las ideas de la unidad. En cada una comprueba:
//   · abre en «Lee», el botón pasa de tarjeta en tarjeta hasta «Siguiente: Juega» y «Ir directo a jugar» salta al juego;
//   · en «Así se resuelve» (momento: 'resuelve' en est.teoria[unidad].ideas[idea]), el botón revela los pasos uno a uno,
//     sale la respuesta y «Otro ejemplo» cambia el enunciado;
//   · no hay errores de consola ni de página. Guarda capturas.
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');
const [puerto, salida, unidad, soloIdea] = process.argv.slice(2);
fs.mkdirSync(salida, { recursive: true });
const espera = ms => new Promise(r => setTimeout(r, ms));

(async () => {
  const def = require(path.join(process.cwd(), 'contenido/teoria', unidad.replace('.', '/') + '.js'));
  const corto = unidad.split('.')[1];
  const b = await chromium.launch();
  let fallas = 0;
  const mal = m => { fallas++; console.log('  MAL: ' + m); };
  for (const idea of def.ideas.filter(i => !soloIdea || i.id === soloIdea)) {
    for (const momento of ['lee', 'resuelve']) {
      const ctx = await b.newContext({ viewport: { width: 360, height: 780 }, deviceScaleFactor: 1, reducedMotion: 'reduce' });
      await ctx.addInitScript(([u, i, m]) => {
        localStorage.setItem('lab-v1', JSON.stringify({ nombre: 'Prueba', uni: 'unmsm', grado: '5',
          teoria: { [u]: { ideas: m === 'resuelve' ? { [i]: { momento: 'resuelve' } } : {} } } }));
      }, [unidad, idea.id, momento]);
      const p = await ctx.newPage();
      const errores = [];
      p.on('pageerror', e => errores.push(e.message));
      p.on('console', m => { if (m.type() === 'error') errores.push(m.text()); });
      await p.goto(`http://localhost:${puerto}/app/#/unidad/${unidad}/teoria/${idea.id}`); await espera(900);
      const nombre = `${corto}/${idea.id}/${momento}`;
      const sig = () => p.$eval('.te-sig', e => e.textContent.trim());
      if (momento === 'lee') {
        const n = await p.$$eval('.te-lee-t', ts => ts.length);
        if (!n) { mal(`${nombre}: no abre en «Lee»`); await ctx.close(); continue; }
        await p.screenshot({ path: path.join(salida, `${corto}-${idea.id}-lee.png`) });
        let k = 1;
        while ((await sig()) === 'Siguiente tarjeta ›' && k < 6) { await p.click('.te-sig'); await espera(700); k++; }
        if (k !== n) mal(`${nombre}: el botón pasó ${k} tarjetas de ${n}`);
        if ((await sig()) !== 'Siguiente: Juega ›') mal(`${nombre}: la última tarjeta no lleva a Juega («${await sig()}»)`);
        await p.screenshot({ path: path.join(salida, `${corto}-${idea.id}-lee-ultima.png`) });
        await p.click('.te-lee-saltar'); await espera(600);
        const m = await p.$eval('.te-raiz, [data-m]', e => e.dataset.m).catch(() => '?');
        if (m !== 'juega') mal(`${nombre}: «Ir directo a jugar» dejó el momento en ${m}`);
        console.log(`${nombre}: ${n} tarjetas · ${m}`);
      } else {
        const enun = () => p.$eval('.te-res-enun p', e => e.textContent).catch(() => '');
        const e0 = await enun();
        if (!e0) { mal(`${nombre}: no abre en «Así se resuelve»`); await ctx.close(); continue; }
        const total = idea.resuelve.generar(0).pasos.length;
        let vistos = await p.$$eval('.te-res-paso', l => l.length), k = 0;
        if (vistos !== 1) mal(`${nombre}: arranca con ${vistos} pasos`);
        while (!(await p.$('.te-res-resp')) && k < 8) {
          await p.click('.te-sig'); await espera(250); k++;
          const v = await p.$$eval('.te-res-paso', l => l.length);
          if (v !== vistos + 1) mal(`${nombre}: el botón pasó de ${vistos} a ${v} pasos`);
          vistos = v;
        }
        if (vistos !== total) mal(`${nombre}: se vieron ${vistos} pasos de ${total}`);
        const resp = await p.$eval('.te-res-resp', e => e.textContent).catch(() => '');
        if (!resp) mal(`${nombre}: no sale la respuesta`);
        await p.screenshot({ path: path.join(salida, `${corto}-${idea.id}-resuelve.png`), fullPage: true });
        await p.click('.te-res-otro'); await espera(300);
        const e1 = await enun();
        if (e1 === e0) mal(`${nombre}: «Otro ejemplo» no cambió el enunciado`);
        console.log(`${nombre}: ${vistos} pasos · ${resp.slice(0, 60)} · otro: ${e1 !== e0 ? 'cambia' : 'IGUAL'}`);
      }
      if (errores.length) mal(`${nombre}: errores de consola: ${errores.join(' | ')}`);
      await ctx.close();
    }
  }
  await b.close();
  console.log(fallas ? `${fallas} FALLAS` : 'todo ok');
  process.exit(fallas ? 1 : 0);
})();
