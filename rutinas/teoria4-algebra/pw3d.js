// Recorre una mesa 3D del laboratorio de álgebra (ronda 4, docs/3d.md §4) a 360 × 780 con swiftshader.
// Uso, con `npm run dev` corriendo:
//   node rutinas/teoria4-algebra/pw3d.js <unidad-corta> <mesa> [salida]
// Ej.: node rutinas/teoria4-algebra/pw3d.js exponentes-y-productos-notables cubo-se-abre
// Comprueba: el lienzo aparece · girar cambia la figura · «Vista inicial» la deja como al inicio · la lupa abre ·
// «Muéstrame» resuelve un reto · el caso guardado tiene miniatura. Deja capturas para mirarlas.
const { chromium } = require('playwright');
const fs = require('fs');
const [uc, mesa, sal = '/tmp/claude-0/alg4-capturas'] = process.argv.slice(2);
const U = `algebra.${uc}`, BASE = `http://localhost:${process.env.PORT || 4173}/app/`;
fs.mkdirSync(sal, { recursive: true });
(async () => {
  const b = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
  const p = await b.newPage({ viewport: { width: 360, height: 780 } });
  const errores = [], ok = [], mal = [];
  const marca = (c, t) => (c ? ok : mal).push(t);
  p.on('pageerror', e => errores.push(e.message));
  p.on('console', m => { if (m.type() === 'error') errores.push(m.text()); });
  await p.addInitScript(u => {
    localStorage.setItem('lab-v1', JSON.stringify({ uni: 'unmsm', grado: '5',
      temas: { [u]: { entrada: { fecha: '2026-11-15', aciertos: 0, total: 5, nose: 0, sabidas: [], expuesto: [] } } } }));
  }, U);
  await p.goto(`${BASE}#/unidad/${U}/teoria/laboratorio`); await p.waitForTimeout(1200);
  await p.locator(`[data-mesa="${mesa}"]`).click();
  const lienzo = p.locator('.te-labo .kit-3d-lienzo');
  await lienzo.waitFor({ timeout: 15000 }).catch(() => {});
  await p.waitForTimeout(800);
  marca(await lienzo.count(), 'el lienzo 3D aparece');
  await p.locator('.te-labo .te-fig').first().scrollIntoViewIfNeeded();
  await p.screenshot({ path: `${sal}/${mesa}-1-inicio.png` });
  await lienzo.evaluate(el => el.scrollIntoView({ block: 'center' })); await p.waitForTimeout(200);
  let nf = 0;
  const foto = async () => { const buf = await lienzo.screenshot(); fs.writeFileSync(`${sal}/${mesa}-lienzo-${++nf}.png`, buf); return buf.toString('base64'); };
  const a = await foto();
  const caja = await lienzo.boundingBox();
  await p.mouse.move(caja.x + caja.width / 2, caja.y + caja.height / 2);
  await p.mouse.down(); await p.mouse.move(caja.x + caja.width / 2 + 80, caja.y + caja.height / 2 + 30, { steps: 8 }); await p.mouse.up();
  await p.waitForTimeout(300);
  const g = await foto();
  marca(g !== a, 'girar cambia la figura');
  await p.screenshot({ path: `${sal}/${mesa}-2-girada.png` });
  await p.locator('.te-labo .kit-3d-inicio').click(); await p.waitForTimeout(300);
  marca(await foto() === a, '«Vista inicial» la deja como al inicio');
  const etq = await p.locator('.te-labo .kit-3d-etq').allInnerTexts();
  console.log(`rótulos: ${etq.join(' · ')}`);
  // La lupa
  await p.locator('.te-labo .te-zoom').first().click(); await p.waitForTimeout(600);
  marca(await p.locator('.te-lupa-viva .kit-3d-lienzo').count(), 'la lupa abre con el mismo lienzo');
  await p.screenshot({ path: `${sal}/${mesa}-3-lupa.png` });
  await p.locator('.te-lupa-cerrar').click(); await p.waitForTimeout(300);
  // «Muéstrame»: el primer reto que no pide casos guardados
  let visto = false;
  for (let k = 0; k < 6 && !visto; k++) {
    if (await p.locator('.te-pista').count()) { await p.locator('.te-pista').click(); await p.waitForTimeout(200); }
    if (await p.locator('.te-muestra').count()) { await p.locator('.te-muestra').click(); await p.waitForTimeout(700); visto = true; break; }
    await p.locator('.te-otra-idea').click(); await p.waitForTimeout(200);
  }
  const inv = (await p.locator('.te-invita').innerText()).replace(/\s+/g, ' ');
  marca(visto && /Lo viste con ayuda|Lo lograste/.test(inv), `«Muéstrame» resuelve un reto («${inv.slice(0, 90)}»)`);
  await p.locator('.te-labo .te-fig').first().scrollIntoViewIfNeeded();
  await p.screenshot({ path: `${sal}/${mesa}-4-muestrame.png` });
  // Guardar el caso: miniatura plana
  await p.locator('.te-guardar').click(); await p.waitForTimeout(500);
  marca(await p.locator('.te-caso .kit-figura svg').count(), 'el caso guardado tiene miniatura');
  await p.locator('.te-caso').first().scrollIntoViewIfNeeded();
  await p.screenshot({ path: `${sal}/${mesa}-5-caso.png` });
  const lect = await p.locator('.te-labo .te-lectura').innerText().catch(() => '');
  console.log(`lectura: ${lect.replace(/\s+/g, ' ')}`);
  const ancho = await p.evaluate(() => document.documentElement.scrollWidth);
  marca(ancho <= 360, `sin desborde horizontal (ancho ${ancho})`);
  for (const t of ok) console.log(`✓ ${t}`);
  for (const t of mal) console.log(`✗ ${t}`);
  console.log(errores.length ? `ERRORES: ${errores.join(' | ')}` : 'sin errores de consola');
  await b.close();
  process.exit(mal.length || errores.length ? 1 : 0);
})();
