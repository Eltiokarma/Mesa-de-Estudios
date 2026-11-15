// Recorrido de la ronda 3 (glosario y retos) a 360 × 780. Necesita npm run dev.
//   node rutinas/teoria3-fisica/pw.js <puerto> <carpeta-salida> <unidad> [más unidades…]
// Por unidad: abre la primera idea y toca el primer término subrayado (captura de la hoja); abre el glosario del tema
// y busca una palabra; en cada mesa con retos busca, con el mismo logrado, un caso que cumpla el primer reto de un
// argumento, lo pone con los controles reales (rango o botones) y comprueba que diga «✓ Lo lograste».
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');
const [puerto, salida, ...unidades] = process.argv.slice(2);
fs.mkdirSync(salida, { recursive: true });
const T = require(path.join(process.cwd(), 'nucleo/teoria.js'));

function grilla(ctr) {
  const dom = ctr.map(c => c.opciones ? c.opciones.map(o => o.valor)
    : Array.from({ length: Math.floor((c.max - c.min) / c.paso + 1e-9) + 1 }, (_, k) => T.ajustar(c, c.min + k * c.paso)));
  const total = dom.reduce((n, d) => n * d.length, 1);
  const out = [];
  for (let i = 0; i < Math.min(total, 200000); i++) { let idx = i; const v = {}; ctr.forEach((c, k) => { v[c.id] = dom[k][idx % dom[k].length]; idx = Math.floor(idx / dom[k].length); }); out.push(v); }
  return out;
}

(async () => {
  const b = await chromium.launch();
  const log = [];
  for (const unidad of unidades) {
    const def = require(path.join(process.cwd(), 'contenido/teoria', unidad.replace('.', '/') + '.js'));
    const ctx = await b.newContext({ viewport: { width: 360, height: 780 }, deviceScaleFactor: 1 });
    await ctx.addInitScript(u => {
      if (!localStorage.getItem('lab-v1')) localStorage.setItem('lab-v1', JSON.stringify({ nombre: 'Prueba', uni: 'unmsm', grado: '4',
        temas: { [u]: { entrada: { fecha: '2026-11-15', aciertos: 0, total: 5, nose: 0, sabidas: [], expuesto: [] } } } }));
    }, unidad);
    const p = await ctx.newPage();
    const errores = [];
    p.on('pageerror', e => errores.push(e.message));
    const base = `http://localhost:${puerto}/app/#/unidad/${unidad}/teoria`;
    const corto = unidad.split('.')[1];
    // 1. Un término subrayado en la primera idea.
    await p.goto(`${base}/${def.ideas[0].id}`);
    await p.waitForTimeout(900);
    const terms = await p.$$eval('.te-term', bs => bs.map(x => x.textContent));
    log.push(`${unidad}: términos marcados en la idea 1: ${terms.join(', ') || 'NINGUNO'}`);
    const t = await p.$('.te-term');
    if (t) {
      await t.scrollIntoViewIfNeeded(); await t.click(); await p.waitForTimeout(400);
      const h = await p.$eval('.te-glosa', e => e.innerText.replace(/\s+/g, ' ').slice(0, 160)).catch(() => 'SIN HOJA');
      log.push(`  hoja: ${h}`);
      await p.screenshot({ path: path.join(salida, `${corto}-hoja.png`) });
    }
    // 2. El glosario del tema, con una búsqueda.
    await p.goto(`${base}/glosario`);
    await p.waitForTimeout(700);
    const n = await p.$$eval('.te-glo-item', x => x.length).catch(() => 0);
    await p.screenshot({ path: path.join(salida, `${corto}-glosario.png`), fullPage: true });
    const busca = await p.$('input[type="search"], .te-glo-buscar input, input');
    if (busca && def.glosario && def.glosario[0]) {
      await busca.fill(def.glosario[0].termino.slice(0, 5)); await p.waitForTimeout(400);
      await p.screenshot({ path: path.join(salida, `${corto}-glosario-busca.png`), fullPage: true });
    }
    log.push(`  glosario: ${n} fichas; búsqueda «${def.glosario && def.glosario[0] ? def.glosario[0].termino.slice(0, 5) : ''}»`);
    // 3. Un reto por mesa.
    for (const mesa of T.mesasDe ? T.mesasDe(def) : def.laboratorio || []) {
      const inv = (mesa.invitaciones || []);
      const k = inv.findIndex(x => x.logrado.length < 2);
      if (k < 0) { log.push(`  mesa ${mesa.id}: sin reto de un argumento`); continue; }
      const meta = grilla(mesa.controles || []).find(v => inv[k].logrado(v, []) === true);
      await p.goto(`${base}/laboratorio`);
      await p.waitForTimeout(600);
      const bt = await p.$(`[data-mesa="${mesa.id}"]`);
      if (bt) { await bt.click(); await p.waitForTimeout(300); }
      // «Otro reto» hasta llegar al k.
      for (let i = 0; i < k; i++) { const o = await p.$('.te-invita .te-otra-idea'); if (o) { await o.click(); await p.waitForTimeout(150); } }
      for (const c of mesa.controles || []) {
        if (c.opciones) { const bo = await p.$(`.te-control[data-c="${c.id}"] button[data-v="${meta[c.id]}"]`); if (bo) await bo.click(); }
        else await p.$eval(`#te-c-${c.id}`, (el, v) => { el.value = v; el.dispatchEvent(new Event('input', { bubbles: true })); }, meta[c.id]);
        await p.waitForTimeout(80);
      }
      await p.waitForTimeout(300);
      const etq = await p.$eval('.te-invita', e => e.innerText.replace(/\s+/g, ' ')).catch(() => 'SIN TARJETA');
      const dice = await p.$eval('.te-dice span', e => e.textContent).catch(() => '');
      log.push(`  mesa ${mesa.id} reto ${k + 1} con ${JSON.stringify(meta)}: ${etq.includes('✓ Lo lograste') ? 'LOGRADO' : 'NO: ' + etq} · Tilo: ${dice}`);
      await p.screenshot({ path: path.join(salida, `${corto}-lab-${mesa.id}.png`), fullPage: true });
    }
    log.push(errores.length ? '  ERRORES DE PÁGINA: ' + errores.join(' | ') : '  sin errores de página');
    await ctx.close();
  }
  console.log(log.join('\n'));
  await b.close();
})();
