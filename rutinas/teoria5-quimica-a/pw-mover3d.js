// Comprueba que las mesas 3D animadas no rearman la escena en cada cuadro (docs/3d.md §6, regla 6): envuelve
// spec.construir y spec.mover de Kit.vivo3d.montar, vuelve a montar la mesa y cuenta durante 3 s de animación.
// node rutinas/teoria5-quimica-a/pw-mover3d.js   (con npm run dev corriendo)
const { chromium } = require('playwright');
const BASE = `http://localhost:${process.env.PORT || 4173}/app/`;
const MESAS = [['estructura-atomica', 'nube-orbital'], ['enlace-quimico', 'molecula-gira'], ['liquidos-y-solidos', 'celda-se-repite']];
(async () => {
  const b = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
  let mal = 0;
  for (const [u, mesa] of MESAS) {
    const p = await b.newPage({ viewport: { width: 360, height: 780 } });
    await p.addInitScript(() => localStorage.setItem('lab-v1', JSON.stringify({ uni: 'unmsm', grado: '5' })));
    await p.goto(`${BASE}#/unidad/quimica.${u}/teoria/laboratorio`); await p.waitForTimeout(2500);
    await p.evaluate(() => {
      window.__cuenta = { construir: 0, mover: 0 };
      const orig = Kit.vivo3d.montar;
      Kit.vivo3d.montar = (el, spec, op) => {
        const s = Object.assign({}, spec, {
          construir: (...a) => { window.__cuenta.construir++; return spec.construir(...a); },
          mover: spec.mover && ((...a) => { window.__cuenta.mover++; return spec.mover(...a); }),
        });
        return orig(el, s, op);
      };
    });
    // Volver a montar la mesa con el envoltorio: otra mesa y de vuelta.
    const botones = p.locator('[data-mesa]');
    await botones.nth(1).click(); await p.waitForTimeout(600);
    await p.locator(`[data-mesa="${mesa}"]`).click(); await p.waitForTimeout(2500);
    const a = await p.evaluate(() => Object.assign({}, window.__cuenta));
    await p.waitForTimeout(3000);
    const c = await p.evaluate(() => Object.assign({}, window.__cuenta));
    const ok = c.construir === a.construir && c.mover > a.mover + 20;
    if (!ok) mal++;
    console.log(`${ok ? 'ok ' : 'MAL'} ${u}/${mesa}: en 3 s, construir ${c.construir - a.construir} veces, mover ${c.mover - a.mover} veces (antes: ${a.construir} construir)`);
    await p.close();
  }
  await b.close();
  process.exitCode = mal ? 1 : 0;
})();
