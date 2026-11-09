// Usa Playwright cuando está disponible; no descarga navegadores ni paquetes.
const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const { pathToFileURL } = require('node:url');
const path = require('node:path');
const fs = require('node:fs');
(async () => {
  const qa = path.join(__dirname, '.qa'); fs.mkdirSync(qa, { recursive: true });
  const browser = await chromium.launch({ headless: true,
    ...(process.env.POLINOMIOS_BROWSER ? { executablePath: process.env.POLINOMIOS_BROWSER } : {}),
    timeout: 20000 });
  try {
    const page = await browser.newPage({ viewport: { width: 1200, height: 1000 } });
    const errors = []; page.on('pageerror', e => errors.push(e.message));
    await page.goto(pathToFileURL(path.join(__dirname, 'index.html')).href);
    assert.equal(await page.locator('#titulo').textContent(), 'Cada término tiene su grado');
    assert.equal(await page.locator('#solucion').isVisible(), false);
    assert.equal(await page.locator('#siguiente').isDisabled(), true);
    await page.locator('button[type=submit]').click();
    assert.equal(await page.locator('#solucion').isVisible(), false);
    await page.locator('#respuesta').fill('6'); await page.locator('button[type=submit]').click();
    assert.match(await page.locator('#feedback').textContent(), /coincide: 6/);
    assert.match(await page.locator('#resultado').textContent(), /Grado absoluto: 6/);
    await page.screenshot({ path: path.join(qa,'escritorio.png'), fullPage: true });
    await page.locator('#siguiente').click();
    assert.equal(await page.locator('#solucion').isVisible(), false);
    await page.locator('#respuesta').fill('5'); await page.locator('button[type=submit]').click();
    assert.match(await page.locator('#feedback').textContent(), /resultado es 4/);
    await page.locator('#siguiente').click();
    assert.equal(await page.locator('#solucion').isVisible(), false);
    await page.locator('#respuesta').fill('5'); await page.locator('button[type=submit]').click();
    assert.match(await page.locator('#feedback').textContent(), /coincide: 5/);
    assert.equal(await page.locator('#resultado tbody tr').count(), 13);
    assert.equal(await page.locator('#siguiente').isDisabled(), true);
    await page.locator('#anterior').click();
    assert.match(await page.locator('#feedback').textContent(), /Predijiste 5/);
    await page.setViewportSize({ width: 390, height: 844 });
    await page.screenshot({ path: path.join(qa,'celular.png'), fullPage: true });
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
    await page.goto(pathToFileURL(path.join(__dirname, 'papel.html')).href);
    assert.equal(await page.locator('article').count(), 5);
    assert.deepEqual(errors, []);
    console.log('Interfaz aprobada: bloqueo, tres actividades, persistencia de sesión, papel y ancho móvil.');
  } finally { await browser.close(); }
})().catch(e => { console.error(e.message); process.exitCode = 1; });
