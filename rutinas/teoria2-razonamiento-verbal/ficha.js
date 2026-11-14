// Captura la ficha de una unidad de verbal (todas sus reglas con sus llaves) a 360 px.
//   PORT=4176 node rutinas/teoria2-razonamiento-verbal/ficha.js <unidad-corta> <carpeta>
const { chromium } = require('playwright');
const [uc, sal = '/tmp/claude-0/rv-capturas'] = process.argv.slice(2);
const BASE = `http://localhost:${process.env.PORT || 4173}/app/`;
require('fs').mkdirSync(sal, { recursive: true });
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 360, height: 780 } });
  // Las ideas se dan por hechas, para que la ficha muestre sus reglas.
  const def = require(`../../contenido/teoria/razonamiento-verbal/${uc}.js`);
  const teoria = { [def.unidad]: { ideas: Object.fromEntries(def.ideas.map(i => [i.id, { hecha: true }])) } };
  await p.addInitScript(t => { sessionStorage.setItem('prueba-luego-razonamiento-verbal', '1'); localStorage.setItem('lab-v1', JSON.stringify({ uni: 'unmsm', grado: '4', teoria: t, pruebas: { 'razonamiento-verbal': { enCurso: true } }, practica: { 'lectura-verbal': { entrada: { id: 'prueba', fecha: Date.now(), bien: 0 } } } })); }, teoria);
  await p.goto(`${BASE}#/unidad/razonamiento-verbal.${uc}/teoria/ficha`); await p.waitForTimeout(900);
  const n = await p.locator('.ec-llave').count();
  // ¿Alguna llave o ecuación pasa el borde derecho de la pantalla?
  const fuera = await p.evaluate(() => [...document.querySelectorAll('.ec-llave')].filter(e => e.getBoundingClientRect().right > 352).length);
  await p.screenshot({ path: `${sal}/${uc}-ficha.png`, fullPage: true });
  const anchos = await p.evaluate(() => [...document.querySelectorAll('body *')].filter(e => e.getBoundingClientRect().right > 362).slice(0, 3).map(e => e.className || e.tagName));
  if (anchos.length) console.log('más anchos que la pantalla:', anchos.join(' | '));
  console.log(`ficha ${uc}: ${n} llaves · llaves fuera del borde ${fuera} · ancho ${await p.evaluate(() => document.documentElement.scrollWidth)}`);
  await b.close();
})();
