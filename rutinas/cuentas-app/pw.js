// Playwright: la app con cuentas contra el servidor falso (herramientas/servidor-falso.js), a 390 y 1366 px.
// Ingreso, cambio de contraseña obligatorio, práctica sin conexión y sincronización al volver la señal, cierre de
// sesión en una PC compartida y otro alumno en el mismo navegador sin mezclar datos, el panel del profesor y el
// del administrador. Además, que sin MESA_API la app siga en modo demostración, como antes.
// Uso: node rutinas/cuentas-app/pw.js (levanta solo los dos servidores). Capturas en $CAPTURAS o en la carpeta temporal.
const { chromium } = require('playwright');
const path = require('path');
const { spawn } = require('child_process');
const Falso = require('../../herramientas/servidor-falso');
const DIR = process.env.CAPTURAS || require('os').tmpdir();
const PUERTO = 4191, BASE = `http://localhost:${PUERTO}/app/`;
const ok = (c, m) => { if (!c) throw new Error('FALLA: ' + m); console.log('  ✓ ' + m); };
const espera = ms => new Promise(r => setTimeout(r, ms));

(async () => {
  const dev = spawn(process.execPath, [path.join(__dirname, '../../herramientas/servidor.js')], { env: { ...process.env, PORT: String(PUERTO) }, stdio: 'ignore' });
  await espera(700);
  const browser = await chromium.launch();
  try {
    for (const [w, h] of [[390, 844], [1366, 768]]) {
      console.log(`\n== ${w} px ==`);
      const foto = n => page.screenshot({ path: path.join(DIR, `cuentas-${n}-${w}.png`), fullPage: true });
      const desborde = () => page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
      const ls = k => page.evaluate(k => JSON.parse(localStorage.getItem(k) || 'null'), k);

      // ---- Sin servidor: modo demostración, igual que antes ----
      let ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 1, serviceWorkers: 'block' });
      let page = await ctx.newPage();
      await page.goto(BASE);
      await page.waitForSelector('.bienvenida #empezar');
      ok(!(await page.locator('#fIngreso').count()) && (await page.locator('#nombre').count()) === 1, 'sin MESA_API: bienvenida de siempre, con el nombre y sin ingreso');
      await page.click('[data-uni="uni"]'); await page.click('[data-grado="5"]'); await page.click('#empezar');
      await page.waitForSelector('.saludo');
      ok(await page.locator('.saludo a[href="#/otro"]').count() === 1, 'demostración: «Otro alumno en esta PC» sigue');
      await page.goto(BASE + '#/perfil'); await page.waitForSelector('#json');
      ok(await page.locator('#json').isVisible() && !(await page.locator('#salir').count()), 'demostración: descarga manual y sin «Cerrar sesión»');
      await ctx.close();

      // ---- Con servidor (falso) ----
      const f = Falso.crear();
      const api = await f.escuchar(0);
      ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 1, serviceWorkers: 'block', acceptDownloads: true });
      await ctx.route('**/app/config.js', r => r.fulfill({ contentType: 'text/javascript', body: `window.MESA_API = ${JSON.stringify(api)};` }));
      page = await ctx.newPage();
      const errores = []; page.on('pageerror', e => errores.push(e.message));
      await page.goto(BASE);
      await page.waitForSelector('#fIngreso');
      ok(page.url().endsWith('#/ingreso'), 'con servidor, la app pide el ingreso');
      ok(await page.locator('text=¿Olvidaste tu contraseña? Pídesela a tu profesor.').count() === 1 && await page.locator('#demo').count() === 1, 'aviso de la contraseña y «Probar sin cuenta»');
      ok(!(await desborde()), 'ingreso sin desborde');
      await foto('ingreso');
      await page.fill('#usuario', 'qroman26'); await page.fill('#clave', 'mala'); await page.click('#entrar');
      await page.waitForSelector('#error:not([hidden])');
      ok(/incorrect/.test(await page.textContent('#error')), 'contraseña mala: mensaje del servidor');
      await page.fill('#clave', 'abc234'); await page.click('#entrar');
      await page.waitForSelector('#fClave');
      ok(await page.locator('text=Elige tu contraseña').count() === 1, 'primer ingreso: cambio de contraseña obligatorio');
      await page.goto(BASE + '#/inicio'); await page.waitForSelector('#fClave');
      ok(page.url().endsWith('#/contrasena'), 'no se puede saltar el cambio');
      await foto('contrasena');
      await page.fill('#actual', 'abc234'); await page.fill('#nueva', 'abc'); await page.fill('#repite', 'abc'); await page.click('#guardarClave');
      ok(/6 caracteres/.test(await page.textContent('#error')), 'contraseña corta rechazada');
      await page.fill('#nueva', 'gatito9'); await page.fill('#repite', 'gatito9'); await page.click('#guardarClave');
      await page.waitForSelector('.bienvenida #empezar');
      ok(!(await page.locator('#nombre').count()) && /Ana Quispe/.test(await page.textContent('.bienvenida')), 'bienvenida: el nombre viene de la cuenta, pide universidad y grado');
      ok(f.datos.usuarios.qroman26.contrasena === 'gatito9', 'el servidor tiene la contraseña nueva');
      const todo = await page.evaluate(() => Object.values(localStorage).join('\n'));
      ok(!todo.includes('gatito9') && !todo.includes('abc234'), 'ninguna contraseña en localStorage');
      await page.click('[data-uni="unmsm"]'); await page.click('[data-grado="4"]'); await page.click('#empezar');
      await page.waitForSelector('.saludo');
      ok((await ls('lab-v1')).alumno === f.datos.usuarios.qroman26.alumno, 'est.alumno es el seudónimo del servidor');
      if (w >= 900) ok(await page.locator('.saludo [data-sync]').count() === 1 && await page.locator('.saludo a[href="#/salir"]').count() === 1, 'inicio: indicador y «Cerrar sesión» en vez de «Otro alumno»');
      await page.waitForFunction(() => /Guardado/.test((document.querySelector('[data-sync]') || document.body).textContent) || !document.querySelector('[data-sync]'));
      await foto('inicio');

      // ---- Práctica sin conexión ----
      await page.goto(BASE + '#/practica/analisis-dimensional');
      await page.waitForSelector('.alt');
      await page.waitForTimeout(500);
      await ctx.setOffline(true);
      for (let k = 0; k < 3; k++) { await page.waitForTimeout(500); await page.click('.alts .alt[data-letra="A"]'); }  // mini prueba de entrada
      await page.waitForSelector('text=Predice antes de ver la solución');
      for (let k = 0; k < 2; k++) {
        await page.waitForTimeout(500); await page.click('.alts .alt[data-letra="B"]');
        await page.waitForSelector('#retro .btn, #retro button'); await page.click('#retro button:has-text("Otro"), #retro .btn >> nth=0');
      }
      await page.goto(BASE + '#/perfil'); await page.waitForSelector('[data-sync]');
      await page.evaluate(() => window.dispatchEvent(new Event('visibilitychange')));
      await page.waitForFunction(() => /Pendiente de subir \(\d+\)/.test(document.querySelector('[data-sync]').textContent));
      const pend = await page.textContent('[data-sync]');
      ok(f.eventosDe('qroman26').length === 0, `sin conexión no sube nada (${pend})`);
      ok(!(await page.locator('#json').count()), 'con cuenta no hay descarga manual');
      ok(!(await desborde()), 'perfil sin desborde');
      await foto('perfil-pendiente');
      await ctx.setOffline(false);
      await page.waitForFunction(() => /Guardado/.test(document.querySelector('[data-sync]').textContent), null, { timeout: 15000 });
      const evAna = f.eventosDe('qroman26');
      ok(evAna.length === 3 && evAna.every(e => e.alumno === f.datos.usuarios.qroman26.alumno), `al volver la señal sube la cola (${evAna.length} eventos con el seudónimo)`);
      ok(f.estadoDe('qroman26').practica['analisis-dimensional'].hechos === 2, 'y el est con la práctica');
      await foto('perfil-guardado');

      // ---- Cerrar sesión en la PC compartida ----
      await page.click('#salir');
      await page.waitForSelector('#fIngreso');
      const quedan = await page.evaluate(() => ['lab-sesion-v1', 'lab-cuenta-v1', 'lab-subido-v1'].map(k => localStorage.getItem(k)));
      ok(quedan.every(x => x === null), 'cerrar sesión borra los tokens y la marca de la cuenta');
      ok(!JSON.stringify(await ls('lab-v1') || {}).includes('analisis-dimensional') && !(await ls('lab-medicion-v1') || []).some(e => e.alumno === f.datos.usuarios.qroman26.alumno), 'y el estado y la cola de Ana');

      // ---- Otro alumno en el mismo navegador ----
      await page.fill('#usuario', 'lmamani26'); await page.fill('#clave', 'xyz789'); await page.click('#entrar');
      await page.waitForSelector('.bienvenida #empezar');
      await page.click('[data-uni="uni"]'); await page.click('[data-grado="5"]'); await page.click('#empezar');
      await page.waitForSelector('.saludo');
      const e2 = await ls('lab-v1');
      ok(e2.alumno === f.datos.usuarios.lmamani26.alumno && !e2.practica['analisis-dimensional'] && e2.uni === 'uni', 'Luis empieza con lo suyo, sin nada de Ana');
      await page.goto(BASE + '#/perfil'); await page.waitForSelector('#salir');
      await page.waitForFunction(() => /Guardado/.test(document.querySelector('[data-sync]').textContent), null, { timeout: 15000 });
      ok(f.estadoDe('qroman26').uni === 'unmsm' && f.estadoDe('lmamani26').uni === 'uni', 'en el servidor cada uno con lo suyo');
      // Sin conexión, cerrar sesión avisa y no borra.
      await ctx.setOffline(true);
      await page.evaluate(() => { const e = JSON.parse(localStorage.getItem('lab-v1')); e.vistas['fisica.mruv'] = '2026-12-01'; localStorage.setItem('lab-v1', JSON.stringify(e)); });
      await page.click('#salir');
      await page.waitForSelector('#cerrarIgual');
      ok(/No se pudo subir todo/.test(await page.textContent('#app')) && (await ls('lab-sesion-v1')) !== null, 'sin conexión: avisa y no borra');
      await foto('salir-sin-conexion');
      await ctx.setOffline(false);
      await page.click('#reintentar');
      await page.waitForSelector('#fIngreso');
      ok(f.estadoDe('lmamani26').vistas['fisica.mruv'] === '2026-12-01', 'al reintentar con señal, sube y cierra');

      // ---- Profesor ----
      await page.fill('#usuario', 'profe'); await page.fill('#clave', 'profe123'); await page.click('#entrar');
      await page.waitForSelector('.panel-cab');
      await page.waitForSelector('[data-sec]');
      await page.waitForSelector('td.pruebas-al');
      ok(await page.locator('[data-sec]').count() === 2, 'panel: sus dos secciones');
      ok(/Ana Quispe/.test(await page.textContent('#app')) && /Luis Mamani/.test(await page.textContent('#app')), 'avance de 4.º A con sus alumnos');
      await page.click('[data-hab="fisica"][data-que="salida"]');
      await page.waitForSelector('[data-hab="fisica"][data-que="salida"].on');
      ok(f.datos.habilitaciones.s4a.salida.has('fisica'), 'abre la salida de física para 4.º A');
      await page.click('#recargar'); await page.waitForSelector('td.pruebas-al');
      ok(await page.locator('[data-hab="fisica"][data-que="salida"].on').count() === 1, 'al actualizar, el panel lee del servidor qué está abierto');
      page.once('dialog', d => d.accept());
      await page.click('[data-reiniciar="qroman26"]');
      await page.waitForSelector('.clave-nueva');
      const nueva = (await page.textContent('.clave-nueva')).trim();
      ok(nueva === f.datos.usuarios.qroman26.contrasena && f.datos.usuarios.qroman26.debe_cambiar, `reinicio: muestra la contraseña nueva (${nueva})`);
      ok(!(await page.locator('#csv').count()), 'el profesor no ve la carga de la lista');
      ok(!(await desborde()), 'panel sin desborde');
      await foto('panel-profesor');
      await page.click('a[href="#/salir"]'); await page.waitForSelector('#fIngreso');

      // ---- Ana vuelve con la contraseña reiniciada y recibe la salida abierta ----
      await page.fill('#usuario', 'qroman26'); await page.fill('#clave', nueva); await page.click('#entrar');
      await page.waitForSelector('#fClave');
      await page.fill('#actual', nueva); await page.fill('#nueva', 'gatito10'); await page.fill('#repite', 'gatito10'); await page.click('#guardarClave');
      await page.waitForSelector('.saludo');
      const e3 = await ls('lab-v1');
      ok(e3.salidaHabilitada.includes('fisica') && e3.practica['analisis-dimensional'].hechos === 2 && e3.uni === 'unmsm', 'Ana recupera su avance y ve la salida que abrió el profesor');
      await page.goto(BASE + '#/salir'); await page.waitForSelector('#fIngreso');

      // ---- Administrador del colegio ----
      await page.fill('#usuario', 'admin'); await page.fill('#clave', 'admin123'); await page.click('#entrar');
      await page.waitForSelector('#csv');
      await page.setInputFiles('#csv', { name: 'lista.csv', mimeType: 'text/csv', buffer: Buffer.from('apellidos,nombres,dni,grado,seccion\nTito Huanca,Juana,70000009,3,C\nRomán,Ana,70000001,4,A\n') });
      await page.click('#subirVer');
      await page.waitForSelector('text=1 nuevos, 1 actualizados');
      ok(await page.locator('td:has-text("jtito26")').count() === 1, 'admin: sube el CSV y ve usuario y contraseña de los nuevos');
      await page.setInputFiles('#csv', { name: 'lista.csv', mimeType: 'text/csv', buffer: Buffer.from('apellidos,nombres,dni,grado,seccion\nSoto,Mia,70000010,3,C\n') });
      const [pdf] = await Promise.all([page.waitForEvent('download'), page.click('#subirPdf')]);
      ok(/tarjetas-.*\.pdf$/.test(pdf.suggestedFilename()), `baja el PDF de tarjetas (${pdf.suggestedFilename()})`);
      const [ev] = await Promise.all([page.waitForEvent('download'), page.click('#eventos')]);
      const lista = JSON.parse(require('fs').readFileSync(await ev.path(), 'utf8'));
      ok(lista.length === f.datos.eventos.size && lista.every(e => !e.nombre), `descarga los eventos del colegio en JSON (${lista.length}, sin nombres)`);
      await foto('panel-admin');
      ok(!errores.length, 'sin errores de JavaScript' + (errores.length ? ': ' + errores.join(' | ') : ''));
      await ctx.close(); await f.cerrar();
    }
  } finally { await browser.close(); dev.kill(); }
  console.log('\nTodo bien.');
})().catch(e => { console.error(e); process.exit(1); });
