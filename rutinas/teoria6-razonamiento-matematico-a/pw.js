// Recorre en Playwright, a 360 × 780, los momentos «Lee» y «Así se resuelve» de una idea de razonamiento matemático (ronda 6).
// Uso, con `npm run dev` corriendo (PORT=… si no es 4173):
//   node rutinas/teoria6-razonamiento-matematico-a/pw.js <unidad-corta> [idea-id] [salida]
// 1) abre la idea en «Lee», pasa las tarjetas con el botón grande y comprueba que termina en «Juega»; vuelve a abrir y
//    prueba «Ir directo a jugar»; 2) con momento: 'resuelve', revela los pasos uno por uno, lee la respuesta y
//    toca «Otro ejemplo» (el enunciado debe cambiar). Imprime los errores de consola.
const { chromium } = require('playwright');
const path = require('path');
const [uc, ideaArg, sal = '/tmp/claude-0/rm6-capturas'] = process.argv.slice(2);
const CURSO = process.env.CURSO || 'razonamiento-matematico', U = `${CURSO}.${uc}`, BASE = `http://localhost:${process.env.PORT || 4173}/app/`;
const fs = require('fs'); fs.mkdirSync(sal, { recursive: true });
const def = require(path.join(__dirname, `../../contenido/teoria/${CURSO}/${uc}.js`));
const idea = ideaArg ? def.ideas.find(i => i.id === ideaArg) : def.ideas[0];
if (!idea) { console.error(`No hay idea «${ideaArg}» en ${uc}`); process.exit(1); }
const estado = momento => JSON.stringify({ uni: 'unmsm', grado: '5',
  temas: { [U]: { entrada: { fecha: '2026-11-16', aciertos: 0, total: 5, nose: 0, sabidas: [], expuesto: [] } } },
  teoria: momento ? { [U]: { ideas: { [idea.id]: { casos: 0, momento } } } } : {} });
(async () => {
  const b = await chromium.launch();
  const errores = [];
  const abrir = async momento => {
    const p = await b.newPage({ viewport: { width: 360, height: 780 } });
    p.on('pageerror', e => errores.push(e.message));
    p.on('console', m => { if (m.type() === 'error') errores.push(m.text()); });
    await p.addInitScript(s => { localStorage.setItem('lab-v1', s); }, estado(momento));
    await p.goto(`${BASE}#/unidad/${U}/teoria/${idea.id}`); await p.waitForTimeout(1200);
    return p;
  };
  let ok = true;
  const fallo = m => { ok = false; console.log(`FALLA: ${m}`); };

  // 1) Lee.
  let p = await abrir(null);
  const nT = await p.locator('.te-lee-t').count();
  if (!nT) fallo('no abrió en «Lee»');
  await p.screenshot({ path: `${sal}/${uc}-${idea.id}-lee-1.png` });
  const boton = p.getByRole('button', { name: /Siguiente tarjeta|Siguiente: Juega/ });
  for (let k = 1; k < nT; k++) { await boton.click(); await p.waitForTimeout(700); }
  await p.screenshot({ path: `${sal}/${uc}-${idea.id}-lee-ultima.png` });
  const etiq = await boton.innerText().catch(() => '');
  if (nT && !/Juega/.test(etiq)) fallo(`la última tarjeta no ofrece «Siguiente: Juega» (dice «${etiq}»)`);
  await boton.click(); await p.waitForTimeout(700);
  const enJuego = await p.locator('.te-lee-t').count() === 0;
  if (!enJuego) fallo('el botón de la última tarjeta no llevó al juego');
  console.log(`lee: ${nT} tarjetas · botón final «${etiq}» · ${enJuego ? 'pasó a Juega' : 'NO pasó a Juega'}`);
  await p.close();
  p = await abrir('lee');
  await p.getByRole('button', { name: 'Ir directo a jugar' }).click(); await p.waitForTimeout(700);
  const salto = await p.locator('.te-lee-t').count() === 0;
  if (!salto) fallo('«Ir directo a jugar» no saltó');
  await p.screenshot({ path: `${sal}/${uc}-${idea.id}-juega.png` });
  console.log(`«Ir directo a jugar»: ${salto ? 'saltó al juego' : 'NO saltó'}`);
  await p.close();

  // 2) Así se resuelve.
  p = await abrir('resuelve');
  const enun1 = (await p.locator('.te-res-enun p').innerText().catch(() => '')).replace(/\s+/g, ' ');
  if (!enun1) fallo('no abrió «Así se resuelve»');
  await p.screenshot({ path: `${sal}/${uc}-${idea.id}-resuelve-1.png` });
  const pasoBtn = p.getByRole('button', { name: /^Paso \d/ });
  let vistos = await p.locator('.te-res-paso').count();
  for (let k = 0; k < 8 && await pasoBtn.count(); k++) {
    await pasoBtn.click(); await p.waitForTimeout(350);
    const n = await p.locator('.te-res-paso').count();
    if (n !== vistos + 1) fallo(`el botón reveló ${n - vistos} pasos de golpe`);
    vistos = n;
  }
  const tipos = await p.locator('.te-res-paso').evaluateAll(ls => ls.map(l => l.dataset.tipo));
  const resp = (await p.locator('.te-res-resp').innerText().catch(() => '')).replace(/\s+/g, ' ');
  if (!resp) fallo('no salió la respuesta');
  await p.locator('.te-res-resp').scrollIntoViewIfNeeded().catch(() => {});
  await p.screenshot({ path: `${sal}/${uc}-${idea.id}-resuelve-fin.png`, fullPage: true });
  await p.getByRole('button', { name: 'Otro ejemplo' }).click(); await p.waitForTimeout(500);
  const enun2 = (await p.locator('.te-res-enun p').innerText().catch(() => '')).replace(/\s+/g, ' ');
  if (enun2 === enun1) fallo('«Otro ejemplo» no cambió el enunciado');
  await p.screenshot({ path: `${sal}/${uc}-${idea.id}-resuelve-otro.png` });
  const ancho = await p.evaluate(() => document.documentElement.scrollWidth);
  if (ancho > 362) fallo(`la página se sale de 360 px (${ancho})`);
  console.log(`resuelve: «${enun1.slice(0, 90)}» · pasos ${tipos.join(' > ')} · «${resp.slice(0, 80)}»`);
  console.log(`otro ejemplo: «${enun2.slice(0, 90)}» · ancho ${ancho}`);
  await p.close();
  if (errores.length) fallo(`errores de consola: ${errores.join(' | ')}`); else console.log('sin errores de consola');
  console.log(ok ? 'TODO BIEN' : 'HAY FALLAS');
  await b.close();
  process.exit(ok ? 0 : 1);
})();
