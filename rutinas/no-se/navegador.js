// Playwright: «No sé» en prueba de entrada, salida, práctica de un generador y lectura, a 390 y 1366 px.
const { chromium } = require('playwright');
const path = require('path');
// Uso: npm run dev (en otra terminal) y node rutinas/no-se/navegador.js. Capturas en $CAPTURAS o en la carpeta temporal.
const DIR = process.env.CAPTURAS || require('os').tmpdir(), BASE = 'http://localhost:4173/app/';
const ok = (c, m) => { if (!c) throw new Error('FALLA: ' + m); console.log('  ✓ ' + m); };

(async () => {
  const browser = await chromium.launch();
  for (const [w, h] of [[390, 844], [1366, 768]]) {
    console.log(`\n== ${w} px ==`);
    const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 1, serviceWorkers: 'block' });
    const page = await ctx.newPage();
    const errores = [];
    page.on('pageerror', e => errores.push(e.message));
    const alumno = `pw${w}`;
    await ctx.addInitScript(a => { if (!localStorage.getItem('lab-v1')) localStorage.setItem('lab-v1', JSON.stringify({ uni: 'uni', grado: '5', alumno: a, colegio: 'PW', vistas: {}, dias: [], practica: {}, pruebas: {}, salidaHabilitada: [], solucionesHabilitadas: [] })); }, alumno);
    const eventos = () => page.evaluate(() => JSON.parse(localStorage.getItem('lab-medicion-v1') || '[]'));
    const desborde = () => page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);

    // ---- Prueba de entrada de física ----
    await page.goto(BASE + '#/prueba/fisica/entrada');
    await page.waitForSelector('.prueba-intro #empezar');
    ok(await page.locator('.prueba-intro').innerText().then(t => t.includes('No sé')), 'la intro de la entrada pide marcar «No sé»');
    await page.click('#empezar');
    await page.waitForSelector('.alt.nose');
    const ultimo = await page.locator('.alts > .alt').last();
    ok(await ultimo.evaluate(b => b.classList.contains('nose') && !b.querySelector('.letra')), '«No sé» va al final y sin letra');
    ok(!(await desborde()), 'sin desborde horizontal');
    await page.screenshot({ path: path.join(DIR, `entrada-${w}.png`), fullPage: true });
    await page.click('.alt.nose');                         // 1: clic en «No sé»
    await page.waitForFunction(() => /Pregunta 2 de/.test(document.body.textContent));
    await page.keyboard.press('0');                        // 2: tecla 0
    await page.waitForFunction(() => /Pregunta 3 de/.test(document.body.textContent));
    await page.keyboard.press('n');                        // 3: tecla N
    for (let k = 4; ; k++) {
      await page.waitForTimeout(250);
      if (await page.locator('#alCurso').count()) break;
      await page.click('.alt[data-letra="A"]');
    }
    ok(!(await page.locator('#app').innerText()).match(/\d+\/\d+/), 'la entrada no muestra puntaje (sin retroalimentación)');
    let ev = await eventos();
    const itE = ev.filter(e => e.tipo === 'item' && e.fase === 'entrada' && e.curso === 'fisica');
    const prE = ev.find(e => e.tipo === 'prueba' && e.fase === 'entrada' && e.curso === 'fisica');
    ok(itE.filter(e => e.nose === true).length === 3 && itE.filter(e => e.nose).every(e => e.opcion === '' && e.error === '' && e.correcta === false), 'tres «No sé» registrados como nose, sin opción ni error');
    ok(prE.nose === 3 && prE.respuestas.startsWith('000'), `la prueba lleva nose = 3 y respuestas ${prE.respuestas}`);
    const st = await page.evaluate(() => JSON.parse(localStorage.getItem('lab-v1')).pruebas.fisica);
    ok(st.entrada.forma === st.orden[0], `la entrada usa la forma ${st.orden[0]} del orden ${st.orden}`);

    // ---- La salida sigue bloqueada sin el profesor ----
    await page.goto(BASE + '#/prueba/fisica/salida');
    await page.waitForFunction(() => /la abre tu profesor/.test(document.body.textContent));
    ok(true, 'la salida sigue bloqueada sin el enlace del profesor');
    ok(!(await eventos()).some(e => e.fase === 'salida'), 'sin eventos de salida');

    // ---- Prueba de salida abierta por el profesor ----
    await page.goto(BASE + '?salida=fisica#/prueba/fisica/salida');
    await page.waitForSelector('#empezar');
    await page.click('#empezar');
    await page.waitForSelector('.alt.nose');
    await page.screenshot({ path: path.join(DIR, `salida-${w}.png`), fullPage: true });
    await page.click('.alt.nose');
    for (;;) {
      await page.waitForTimeout(250);
      if (await page.locator('.resultado').count()) break;
      await page.keyboard.press('1');
    }
    ev = await eventos();
    const prS = ev.find(e => e.tipo === 'prueba' && e.fase === 'salida' && e.curso === 'fisica');
    const st2 = await page.evaluate(() => JSON.parse(localStorage.getItem('lab-v1')).pruebas.fisica);
    ok(prS && prS.nose === 1 && prS.respuestas[0] === '0', 'la salida registra su «No sé»');
    ok(st2.salida.forma === st2.orden[1] && st2.salida.forma !== st2.entrada.forma, `la salida usa la otra forma (${st2.salida.forma}); orden ${st2.orden} intacto`);

    // ---- Práctica de un generador ----
    await page.goto(BASE + '#/practica/porcentajes-sucesivos');
    await page.waitForSelector('.alt.nose');
    await page.click('.alt.nose');                      // entrada del módulo: «No sé»
    for (let k = 0; k < 2; k++) { await page.waitForTimeout(150); await page.click('.alt[data-letra="A"]'); }
    await page.waitForSelector('.alt.nose');
    ok((await page.locator('.solo-teclado').innerText()).includes('No sé'), 'el aviso de teclas menciona «No sé»');
    await page.keyboard.press('n');
    await page.waitForSelector('.retro.nose');
    ok(await page.locator('.alt.ok').count() === 1 && await page.locator('.alt.mal').count() === 0, 'muestra la correcta sin marcar error');
    ok(await page.locator('.sol li').count() > 0, 'muestra la solución paso a paso');
    ok(!(await desborde()), 'sin desborde horizontal en la práctica');
    await page.screenshot({ path: path.join(DIR, `practica-${w}.png`), fullPage: true });
    ev = await eventos();
    const pred = ev.filter(e => e.tipo === 'prediccion' && e.modulo === 'porcentajes-sucesivos');
    const prM = ev.find(e => e.tipo === 'prueba' && e.modulo === 'porcentajes-sucesivos' && e.fase === 'entrada');
    ok(pred.length === 1 && pred[0].nose === true && pred[0].correcta === false && pred[0].error === '', 'la predicción «No sé» se registra con nose');
    ok(prM.nose === 1 && prM.respuestas[0] === '0', 'la entrada del módulo cuenta su «No sé»');

    // ---- Lectura: prueba de entrada ----
    await page.goto(BASE + '#/lectura/lectura-verbal');
    await page.waitForSelector('#yaLei');
    await page.click('#yaLei');
    await page.waitForSelector('.lec-alts .alt.nose');
    ok(!(await desborde()), 'sin desborde horizontal en la lectura');
    await page.screenshot({ path: path.join(DIR, `lectura-${w}.png`), fullPage: true });
    await page.click('.lec-alts .alt.nose');
    await page.waitForFunction(() => /Pregunta 2 de/.test(document.body.textContent));
    await page.keyboard.press('0');
    for (;;) {
      await page.waitForTimeout(250);
      const n = await page.locator('.lec-alts .alt[data-letra="A"]:not(:disabled)').count();
      if (!n) break;
      await page.keyboard.press('a');
    }
    await page.waitForTimeout(300);
    ev = await eventos();
    const itL = ev.filter(e => e.tipo === 'item' && e.curso === 'razonamiento-verbal' && e.fase === 'entrada');
    const prL = ev.find(e => e.tipo === 'prueba' && e.curso === 'razonamiento-verbal' && e.fase === 'entrada');
    ok(itL.filter(e => e.nose).length === 2 && itL.filter(e => e.nose).every(e => e.opcion === '' && e.error === ''), 'lectura: dos «No sé» como nose');
    ok(prL && prL.nose === 2 && prL.respuestas.startsWith('00'), `lectura: la prueba lleva nose = 2 (${prL && prL.respuestas})`);
    ok(prL.forma === prL.orden[0], `lectura: forma ${prL.forma} según el orden ${prL.orden}`);
    ok(errores.length === 0, 'sin errores de JavaScript' + (errores.length ? ': ' + errores.join(' | ') : ''));
    await ctx.close();
  }
  await browser.close();
})().catch(e => { console.error(e.message); process.exit(1); });
