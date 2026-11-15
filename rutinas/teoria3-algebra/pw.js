// Recorre en Playwright, a 360 × 780, el glosario y un reto del laboratorio de una unidad de álgebra (ronda 3).
// Uso, con `npm run dev` corriendo:
//   node rutinas/teoria3-algebra/pw.js <unidad-corta> <mesa> <reto (desde 1)> "<control=valor;…>" [palabra a buscar] [salida]
// Ej.: node rutinas/teoria3-algebra/pw.js logica-y-conjuntos tres-conjuntos 1 "n=12" cardinal
// 1) abre la primera idea y toca el primer término subrayado (la hoja); 2) abre …/teoria/glosario y busca la palabra;
// 3) en el laboratorio, elige la mesa y el reto, mueve los controles y comprueba que diga «✓ Lo lograste».
const { chromium } = require('playwright');
const [uc, mesa, reto = '1', ajustes = '', palabra = '', sal = '/tmp/claude-0/alg3-capturas'] = process.argv.slice(2);
const U = `algebra.${uc}`, BASE = `http://localhost:${process.env.PORT || 4173}/app/`;
const fs = require('fs'); fs.mkdirSync(sal, { recursive: true });
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 360, height: 780 } });
  const errores = [];
  p.on('pageerror', e => errores.push(e.message));
  p.on('console', m => { if (m.type() === 'error') errores.push(m.text()); });
  // Alumno de prueba con la prueba del tema hecha (encargo, «Reglas»): salta la bienvenida y la prueba de entrada.
  await p.addInitScript(u => {
    if (!localStorage.getItem('lab-v1')) localStorage.setItem('lab-v1', JSON.stringify({ uni: 'unmsm', grado: '4',
      temas: { [u]: { entrada: { fecha: '2026-11-15', aciertos: 0, total: 5, nose: 0, sabidas: [], expuesto: [] } } } }));
  }, U);
  const ir = async h => { await p.goto(`${BASE}#${h}`); await p.waitForTimeout(900); };
  const def = require(`../../contenido/teoria/algebra/${uc}.js`);
  // 1) La primera idea: el primer término subrayado abre la hoja.
  await ir(`/unidad/${U}/teoria/${def.ideas[0].id}`);
  const terms = await p.locator('.te-term:visible').count();
  if (terms) { await p.locator('.te-term:visible').first().scrollIntoViewIfNeeded(); await p.locator('.te-term:visible').first().click(); await p.waitForTimeout(400); }
  const hoja = await p.locator('.te-glosa').first().innerText().catch(() => '');
  await p.screenshot({ path: `${sal}/${uc}-hoja.png` });
  console.log(`idea ${def.ideas[0].id}: ${terms} términos subrayados · hoja «${hoja.replace(/\s+/g, ' ').slice(0, 120)}»`);
  // 2) El glosario del tema y la búsqueda.
  await ir(`/unidad/${U}/teoria/glosario`);
  const entradas = await p.locator('.te-glosa-li, .te-glo li, [data-glosa]').count();
  const busca = p.locator('.te-labo input[type="search"], input[type="search"]').first();
  if (palabra && await busca.count()) { await busca.fill(palabra); await p.waitForTimeout(400); }
  await p.screenshot({ path: `${sal}/${uc}-glosario.png`, fullPage: true });
  const ancho = await p.evaluate(() => document.documentElement.scrollWidth);
  console.log(`glosario: ${entradas} elementos tocables · búsqueda «${palabra}» · ancho ${ancho}`);
  // 3) El reto en el laboratorio.
  await ir(`/unidad/${U}/teoria/laboratorio`);
  await p.locator(`[data-mesa="${mesa}"]`).click(); await p.waitForTimeout(300);
  const m = def.laboratorio.find(x => x.id === mesa), objetivo = m.invitaciones[+reto - 1].texto;
  for (let k = 0; k < 7 && !(await p.locator('.te-invita-t').innerText()).includes(objetivo); k++) { await p.locator('.te-otra-idea').click(); await p.waitForTimeout(150); }
  for (const par of ajustes.split(';').filter(Boolean)) {
    const [id, val] = par.split('=');
    if (id === 'guardar') { await p.locator('.te-guardar').click(); await p.waitForTimeout(200); continue; }
    const c = p.locator(`.te-labo [data-c="${id}"]`);
    if (await c.locator('[data-v]').count()) await c.locator(`[data-v="${val}"]`).click();
    else await c.locator('input[type="range"]').evaluate((el, v) => { el.value = v; el.dispatchEvent(new Event('input', { bubbles: true })); el.dispatchEvent(new Event('change', { bubbles: true })); }, val);
    await p.waitForTimeout(150);
  }
  const inv = (await p.locator('.te-invita').innerText()).replace(/\s+/g, ' ');
  const dice = await p.locator('.te-labo .te-dice span').innerText().catch(() => '');
  await p.locator('.te-labo .te-fig').first().scrollIntoViewIfNeeded();
  await p.screenshot({ path: `${sal}/${uc}-reto-${mesa}-${reto}.png` });
  console.log(`reto ${mesa} ${reto}: ${inv.includes('Lo lograste') ? 'LOGRADO' : 'NO LOGRADO'} · «${inv.slice(0, 110)}» · Nox: «${dice}»`);
  console.log(errores.length ? `ERRORES: ${errores.join(' | ')}` : 'sin errores de consola');
  await b.close();
})();
