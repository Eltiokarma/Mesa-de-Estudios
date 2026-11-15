// Recorre en Playwright, a 360 × 780, el glosario y los retos de unidades de química (ronda 3 de la teoría).
// Con `npm run dev` corriendo:  node rutinas/teoria3-quimica/pw.js <unidad-corta> [más…]
// Por unidad: abre la primera idea y toca el primer término subrayado (captura de la hoja); abre el glosario del tema
// y busca una palabra; en cada mesa del laboratorio busca con el motor un caso que cumpla el primer reto de un
// argumento, lo pone con los controles reales y comprueba que diga «✓ Lo lograste».
const path = require('path');
const fs = require('fs');
const { chromium } = require('playwright');
const RAIZ = path.join(__dirname, '..', '..');
const SAL = process.env.SAL || '/tmp/claude-0/quimica-capturas';
const BASE = `http://localhost:${process.env.PORT || 4173}/app/`;
fs.mkdirSync(SAL, { recursive: true });

function grilla(ctr) {
  const dom = ctr.map(c => c.opciones ? c.opciones.map(o => o.valor)
    : Array.from({ length: Math.floor((c.max - c.min) / c.paso + 1e-9) + 1 }, (_, k) => +(c.min + k * c.paso).toFixed(6)));
  const total = dom.reduce((n, d) => n * d.length, 1), out = [];
  for (let i = 0; i < Math.min(total, 20000); i++) { let idx = i; const v = {}; ctr.forEach((c, k) => { v[c.id] = dom[k][idx % dom[k].length]; idx = Math.floor(idx / dom[k].length); }); out.push(v); }
  return out;
}

(async () => {
  const unidades = process.argv.slice(2);
  const b = await chromium.launch();
  for (const uc of unidades) {
    const U = `quimica.${uc}`;
    const def = require(path.join(RAIZ, 'contenido', 'teoria', 'quimica', `${uc}.js`));
    for (const r of def.requiere || []) require(path.join(RAIZ, r));
    const p = await b.newPage({ viewport: { width: 360, height: 780 } });
    const errores = [];
    p.on('pageerror', e => errores.push(e.message));
    p.on('console', m => { if (m.type() === 'error') errores.push(m.text()); });
    const entrada = { fecha: '2026-11-15', aciertos: 0, total: 5, nose: 0, sabidas: [], expuesto: [] };
    await p.addInitScript(([u, e]) => { if (!localStorage.getItem('lab-v1')) localStorage.setItem('lab-v1', JSON.stringify({ uni: 'unmsm', grado: '4', temas: { [u]: { entrada: e } } })); }, [U, entrada]);
    const ir = async h => { await p.goto(`${BASE}#${h}`); await p.waitForTimeout(900); };
    // 1. Una idea: el primer término subrayado y su hoja.
    await ir(`/unidad/${U}/teoria/${def.ideas[0].id}`);
    const terms = await p.locator('.te-term').count();
    let hoja = '';
    if (terms) {
      await p.locator('.te-term').first().scrollIntoViewIfNeeded();
      await p.locator('.te-term').first().click(); await p.waitForTimeout(300);
      hoja = (await p.locator('.te-glosa').first().innerText().catch(() => '')).replace(/\s+/g, ' ').slice(0, 90);
      await p.screenshot({ path: `${SAL}/${uc}-hoja.png` });
    }
    console.log(`${uc}: ${terms} términos subrayados en «${def.ideas[0].id}» · hoja «${hoja}»`);
    // 2. El glosario del tema y una búsqueda.
    await ir(`/unidad/${U}/teoria/glosario`);
    const art = await p.locator('.te-glo article').count();
    const palabra = (def.glosario[1] || def.glosario[0]).termino;
    await p.fill('#te-glo-q', palabra.slice(0, 6)); await p.waitForTimeout(300);
    await p.screenshot({ path: `${SAL}/${uc}-glosario.png`, fullPage: true });
    console.log(`   glosario: ${art} fichas · búsqueda «${palabra.slice(0, 6)}»`);
    // 3. Cada mesa: el primer reto de un argumento, cumplido con los controles reales.
    await ir(`/unidad/${U}/teoria/laboratorio`);
    for (const mesa of def.laboratorio || []) {
      await p.locator(`[data-mesa="${mesa.id}"]`).click(); await p.waitForTimeout(300);
      const inv = mesa.invitaciones || [];
      const k = inv.findIndex(x => x.logrado.length < 2);
      if (k < 0) { console.log(`   mesa ${mesa.id}: sin reto de un argumento`); continue; }
      const caso = grilla(mesa.controles).find(v => inv[k].logrado(v, []));
      // Llegar al reto k con «Otro reto».
      for (let n = 0; n < 8; n++) {
        const t = await p.locator('.te-invita-t').innerText().catch(() => '');
        if (t.trim() === inv[k].texto) break;
        await p.locator('.te-invita .te-otra-idea').click(); await p.waitForTimeout(150);
      }
      for (const c of mesa.controles) {
        const cont = p.locator(`.te-labo [data-c="${c.id}"]`);
        if (c.opciones) await cont.locator(`button[data-v="${caso[c.id]}"]`).click();
        else await cont.locator('input').evaluate((el, v) => { el.value = v; el.dispatchEvent(new Event('input', { bubbles: true })); }, String(caso[c.id]));
        await p.waitForTimeout(120);
      }
      const etq = (await p.locator('.te-invita-etq').innerText().catch(() => '')).trim();
      const dice = (await p.locator('.te-dice span').first().innerText().catch(() => '')).trim();
      await p.locator('.te-invita').scrollIntoViewIfNeeded().catch(() => {});
      await p.screenshot({ path: `${SAL}/${uc}-lab-${mesa.id}.png` });
      const ancho = await p.evaluate(() => document.documentElement.scrollWidth);
      console.log(`   mesa ${mesa.id}: reto ${k + 1} «${inv[k].texto}» con ${JSON.stringify(caso)} → «${etq}» · «${dice}» · ancho ${ancho}`);
    }
    console.log(errores.length ? `   ERRORES: ${errores.join(' | ')}` : '   sin errores de consola');
    await p.close();
  }
  await b.close();
})();
