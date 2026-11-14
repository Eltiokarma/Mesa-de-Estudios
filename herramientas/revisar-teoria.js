// Recorre una unidad de teoría a 360 × 780 (docs/teoria.md §4b): cada idea con arrastres (arrastra de verdad cada
// manija con el mouse) y cada mesa del laboratorio (arrastra y guarda 2 casos). Deja capturas y avisa si una manija
// no movió nada o si hubo error de página. Necesita el servidor: npm run dev (o PORT=… npm run dev).
//   node herramientas/revisar-teoria.js <puerto> <unidad> <carpeta-salida>
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');
const [puerto, unidad, salida] = process.argv.slice(2);
const def = require(path.join(process.cwd(), 'contenido/teoria', unidad.replace('.', '/') + '.js'));
fs.mkdirSync(salida, { recursive: true });

(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 360, height: 780 }, deviceScaleFactor: 1 });
  const curso = unidad.split('.')[0];
  await ctx.addInitScript(c => {
    if (!localStorage.getItem('lab-v1')) localStorage.setItem('lab-v1', JSON.stringify({ nombre: 'Prueba', uni: 'unmsm', grado: '4', pruebas: { [c]: { enCurso: true } } }));
  }, curso);
  const p = await ctx.newPage();
  const errores = [];
  p.on('pageerror', e => errores.push(e.message));
  const base = `http://localhost:${puerto}/app/#/unidad/${unidad}/teoria`;
  const lectura = () => p.$eval('.te-lectura', e => e.textContent).catch(() => '');
  // Estado visible: la lectura y la figura sin las manijas (una manija puede mover algo que la lectura no nombra).
  const estado = () => p.evaluate(() => { const s = document.querySelector('.te-manija') && document.querySelector('.te-manija').ownerSVGElement; return (document.querySelector('.te-lectura') || {}).textContent + (s ? s.outerHTML.replace(/<g class="te-manija[\s\S]*?<\/g>/g, '') : ''); });
  async function gesto(i, signo) {
    const m = (await p.$$('.te-manija'))[i];
    await m.scrollIntoViewIfNeeded();
    const bx = await m.boundingBox();
    const cx = bx.x + bx.width / 2, cy = bx.y + bx.height / 2;
    await p.mouse.move(cx, cy);
    await p.mouse.down();
    for (const [dx, dy] of [[15, -8], [35, -18], [60, -30]]) await p.mouse.move(cx + signo * dx, cy + signo * dy, { steps: 4 });
    await p.mouse.up();
  }
  async function arrastrar(etq) {
    const out = [];
    const n = (await p.$$('.te-manija')).length;
    for (let i = 0; i < n; i++) {
      const antes = await estado();
      await gesto(i, 1);
      let despues = await estado();
      if (despues === antes) { await gesto(i, -1); despues = await estado(); }
      out.push(`${etq} manija ${i + 1}: ${despues !== antes ? 'mueve' : 'NO MOVIÓ'} · ${await lectura()}`);
    }
    return out;
  }
  const log = [];
  for (const idea of def.ideas) {
    if (!(idea.juega.arrastres || []).length) { log.push(`${idea.id}: sin arrastre`); continue; }
    await p.goto(`${base}/${idea.id}`);
    await p.waitForSelector('.te-manija', { timeout: 8000 }).catch(() => log.push(`${idea.id}: NO HAY MANIJAS EN PANTALLA`));
    log.push(...await arrastrar(idea.id));
    await p.evaluate(() => window.scrollTo(0, 0));
    await p.screenshot({ path: path.join(salida, `idea-${idea.id}.png`), fullPage: true });
  }
  for (const mesa of def.laboratorio || []) {
    await p.goto(`${base}/laboratorio`);
    await p.waitForTimeout(400);
    const bt = await p.$(`[data-mesa="${mesa.id}"]`);
    if (bt) { await bt.click(); await p.waitForTimeout(200); }
    log.push(...await arrastrar(`lab ${mesa.id}`));
    await p.click('.te-guardar');
    const mas = await p.$$('.te-controles button[data-paso="1"]');
    if (mas.length) await mas[0].click();
    await p.click('.te-guardar');
    await p.screenshot({ path: path.join(salida, `lab-${mesa.id}.png`), fullPage: true });
  }
  log.push(errores.length ? 'ERRORES DE PÁGINA: ' + errores.join(' | ') : 'sin errores de página');
  console.log(log.join('\n'));
  await b.close();
})();
