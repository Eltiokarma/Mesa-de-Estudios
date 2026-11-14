// Recorre en Playwright, a 360 × 780, una idea con arrastre (arrastra de verdad con el mouse) y el laboratorio de una
// unidad de razonamiento verbal (guarda 2 casos por mesa). Uso, con `npm run dev` corriendo:
//   node rutinas/teoria2-razonamiento-verbal/pw.js <unidad-corta> <idea> <arrastre> <dx> <dy> [salida]
// Ej.: node rutinas/teoria2-razonamiento-verbal/pw.js compatibilidad cuatro-casillas frase 0 50
const { chromium } = require('playwright');
const [uc, idea, arr, dx = '0', dy = '40', sal = '/tmp/claude-0/rv-capturas'] = process.argv.slice(2);
const U = `razonamiento-verbal.${uc}`, BASE = `http://localhost:${process.env.PORT || 4173}/app/`;
const fs = require('fs'); fs.mkdirSync(sal, { recursive: true });
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 360, height: 780 } });
  const errores = [];
  p.on('pageerror', e => errores.push(e.message));
  p.on('console', m => { if (m.type() === 'error') errores.push(m.text()); });
  // El alumno de prueba se guarda antes de que cargue la app (salta la bienvenida y la prueba de entrada).
  await p.addInitScript(() => { sessionStorage.setItem('prueba-luego-razonamiento-verbal', '1'); if (!localStorage.getItem('lab-v1')) localStorage.setItem('lab-v1', JSON.stringify({ uni: 'unmsm', grado: '4', pruebas: { 'razonamiento-verbal': { enCurso: true } }, practica: { 'lectura-verbal': { entrada: { id: 'prueba', fecha: Date.now(), bien: 0 } } } })); });
  const ir = async h => { await p.goto(`${BASE}#${h}`); await p.waitForTimeout(800); };
  const arrastrar = async (sel, mx, my) => {
    const h = p.locator(sel).first();
    await h.scrollIntoViewIfNeeded();
    const c = await h.boundingBox();
    if (!c) return false;
    const x = c.x + c.width / 2, y = c.y + c.height / 2;
    await p.mouse.move(x, y); await p.mouse.down();
    for (let k = 1; k <= 8; k++) await p.mouse.move(x + mx * k / 8, y + my * k / 8);
    await p.mouse.up(); await p.waitForTimeout(250);
    return true;
  };
  const lectura = async () => (await p.locator('.te-lectura').first().innerText().catch(() => '')).replace(/\s+/g, ' ');
  if (idea && idea !== '-') {
    await ir(`/unidad/${U}/teoria/${idea}`);
    await p.screenshot({ path: `${sal}/${uc}-${idea}-0.png`, fullPage: true });
    const antes = await lectura();
    const ok = await arrastrar(`.te-manija[data-a="${arr}"]`, +dx, +dy);
    const despues = await lectura();
    await p.screenshot({ path: `${sal}/${uc}-${idea}-1.png` });
    console.log(`idea ${idea}: manija ${ok ? 'arrastrada' : 'NO ENCONTRADA'} · antes «${antes}» · después «${despues}»`);
  }
  await ir(`/unidad/${U}/teoria/laboratorio`);
  const mesas = await p.locator('[data-mesa]').count();
  for (let m = 0; m < mesas; m++) {
    await p.locator('[data-mesa]').nth(m).click(); await p.waitForTimeout(300);
    const id = await p.locator('[data-mesa]').nth(m).getAttribute('data-mesa');
    await p.locator('.te-guardar').click();
    const man = await p.locator('.te-labo .te-manija').count();
    if (man) await arrastrar('.te-labo .te-manija', +dx, +dy);
    else await p.locator('.te-labo .te-controles button[data-v][aria-pressed="false"]').first().click().catch(() => {});
    await p.locator('.te-guardar').click(); await p.waitForTimeout(200);
    const casos = await p.locator('.te-caso').count();
    await p.locator('.te-labo .te-fig').first().scrollIntoViewIfNeeded();
    await p.screenshot({ path: `${sal}/${uc}-lab-${id}.png` });
    await p.locator('.te-caso').first().scrollIntoViewIfNeeded().catch(() => {});
    await p.screenshot({ path: `${sal}/${uc}-lab-${id}-casos.png` });
    // ¿Algo se sale de los 360 px?
    const ancho = await p.evaluate(() => document.documentElement.scrollWidth);
    console.log(`mesa ${id}: ${man} manijas · ${casos} casos guardados · ancho ${ancho} · lectura «${await lectura()}»`);
  }
  console.log(errores.length ? `ERRORES: ${errores.join(' | ')}` : 'sin errores de consola');
  await b.close();
})();
