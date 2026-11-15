// Recorrido de la ronda 5 (animación automática) a 360 × 780. Necesita npm run dev.
//   node rutinas/teoria5-fisica-b/pw.js <puerto> <carpeta-salida> <unidad> [más unidades…]
// En cada idea (momento «Juega») y en la primera mesa del laboratorio: la lectura cambia sola entre dos momentos
// (700 ms), «⏸ Pausa» la congela, y con movimiento reducido arranca quieta («▶ Seguir»). Guarda capturas.
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');
const [puerto, salida, ...unidades] = process.argv.slice(2);
fs.mkdirSync(salida, { recursive: true });
const espera = ms => new Promise(r => setTimeout(r, ms));

async function revisar(p, nombre, archivo, reducido) {
  const lec = () => p.$eval('.te-lectura', e => e.textContent).catch(() => '');
  const play = await p.$('.te-play');
  if (!play) return `${nombre}: SIN CONTROL ANIMADO`;
  const r0 = await play.textContent();
  const a = await lec(); await espera(700); const b = await lec();
  if (reducido) return `${nombre}: reducido ${r0.trim() === '▶ Seguir' && a === b ? 'QUIETA ok' : 'MAL (' + r0 + ')'}`;
  await p.screenshot({ path: path.join(salida, archivo + '-a.png'), fullPage: false });
  const cambia = a !== b;
  await play.click(); await espera(100);
  const c = await lec(); await espera(700); const d = await lec();
  const congela = c === d;
  await p.screenshot({ path: path.join(salida, archivo + '-b.png'), fullPage: false });
  return `${nombre}: ${cambia ? 'cambia ok' : 'NO CAMBIA'} · ${congela ? 'pausa ok' : 'PAUSA NO CONGELA'} · «${b.slice(0, 70)}»`;
}

(async () => {
  const b = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
  for (const unidad of unidades) {
    const def = require(path.join(process.cwd(), 'contenido/teoria', unidad.replace('.', '/') + '.js'));
    const corto = unidad.split('.')[1];
    for (const reducido of [false, true]) {
      const ctx = await b.newContext({ viewport: { width: 360, height: 780 }, deviceScaleFactor: 1, reducedMotion: reducido ? 'reduce' : 'no-preference' });
      await ctx.addInitScript(() => {
        if (!localStorage.getItem('lab-v1')) localStorage.setItem('lab-v1', JSON.stringify({ nombre: 'Prueba', uni: 'unmsm', grado: '5' }));
      });
      const p = await ctx.newPage();
      const errores = [];
      p.on('pageerror', e => errores.push(e.message));
      const base = `http://localhost:${puerto}/app/#/unidad/${unidad}/teoria`;
      for (const idea of def.ideas) {
        await p.goto(`${base}/${idea.id}`); await espera(900);
        await p.evaluate(() => { const f = document.querySelector('.te-fig'); if (f) { f.scrollIntoView({ block: 'start' }); scrollBy(0, -40); } });
        console.log(await revisar(p, `${corto}/${idea.id}`, `${corto}-${idea.id}`, reducido));
      }
      const mesa = (def.laboratorio || [])[0];
      if (mesa) {
        await p.goto(`${base}/laboratorio`); await espera(1500);
        await p.evaluate(() => { const f = document.querySelector('.te-fig'); if (f) { f.scrollIntoView({ block: 'start' }); scrollBy(0, -40); } });
        console.log(await revisar(p, `${corto}/lab:${mesa.id}`, `${corto}-lab-${mesa.id}`, reducido));
      }
      if (errores.length) console.log('  ERRORES DE PÁGINA: ' + errores.join(' | '));
      await ctx.close();
    }
  }
  await b.close();
})();
