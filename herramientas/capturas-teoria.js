#!/usr/bin/env node
/*
 * Capturas de la teoría de una unidad, para el lector en frío, el auditor y la galería de Gerson (docs/molde-unidad.md
 * §8; docs/metodo/unidad/). Necesita el servidor local (`node herramientas/servidor.js`, puerto 4173) y el Chromium del
 * entorno (Playwright).
 *
 *   node herramientas/capturas-teoria.js <unidad> <carpeta> [partes] [--oscuro] [--ancha] [--lector]
 *
 *   partes: momentos,ejemplos,glosario,laboratorio (por defecto, todas)
 *   --oscuro   también en tema oscuro
 *   --ancha    también a 1280 × 860 (pantalla ancha); por defecto solo 390 × 844 (celular)
 *   --lector   copia aparte, en <carpeta>/lector/, las tarjetas n.º 3, 8 y 14 de cada idea (una por nivel), con nombres
 *              que no dicen la idea, para el lector en frío de los ejemplos
 *
 * Ejemplo: node herramientas/capturas-teoria.js fisica.vectores /tmp/cap --oscuro --lector
 * Cada momento sale en una captura de la pantalla visible (no de página entera: la barra de abajo y la de acción son
 * fijas y en una captura de página entera quedan encima del contenido). Las tarjetas de ejemplos salen una por una.
 */
const path = require('path');
const fs = require('fs');
let chromium;
try { ({ chromium } = require('playwright')); } catch (e) { ({ chromium } = require('/opt/node22/lib/node_modules/playwright')); }

const [unidad, carpeta, ...resto] = process.argv.slice(2);
if (!unidad || !carpeta) { console.error('uso: node herramientas/capturas-teoria.js <unidad> <carpeta> [partes] [--oscuro] [--ancha] [--lector]'); process.exit(1); }
const banderas = new Set(resto.filter(x => x.startsWith('--')));
const partes = new Set((resto.find(x => !x.startsWith('--')) || 'momentos,ejemplos,glosario,laboratorio').split(','));
const BASE = process.env.MESA_URL || 'http://localhost:4173';
const MOMENTOS = ['lee', 'juega', 'predice', 'mira', 'regla', 'resuelve', 'ahora-tu'];
fs.mkdirSync(carpeta, { recursive: true });

// La unidad abierta: con su propio estado de teoría empezado, el mapa la deja entrar aunque su requisito no esté hecho.
const estado = teoria => ({ nombre: 'Ana', uni: 'unmsm', grado: '5', alumno: 'captura', vistas: {}, dias: [], teoria, pruebas: {}, prefs: { pistaGlo: 1 } });

async function abrir(ctx, ruta, teoria) {
  const p = await ctx.newPage();
  await p.addInitScript(e => localStorage.setItem('lab-v1', JSON.stringify(e)), estado(teoria));
  await p.goto(`${BASE}/app/#${ruta}`);
  await p.waitForTimeout(1500);
  await p.addStyleTag({ content: '#nav{display:none!important}' }).catch(() => {});
  return p;
}

(async () => {
  const navegador = await chromium.launch(fs.existsSync('/usr/bin/google-chrome') ? { executablePath: '/usr/bin/google-chrome' } : {});
  const errores = [];
  const temas = banderas.has('--oscuro') ? ['claro', 'oscuro'] : ['claro'];
  const tamanos = banderas.has('--ancha') ? [['cel', 390, 844], ['ancha', 1280, 860]] : [['cel', 390, 844]];
  // Ideas de la unidad: se leen del archivo de la teoría.
  const def = await (async () => {
    const ctx = await navegador.newContext();
    const p = await abrir(ctx, `/unidad/${unidad}/teoria`, { [unidad]: {} });
    const ideas = await p.evaluate(u => {
      const d = window.Teoria && window.Teoria.unidades && window.Teoria.unidades[u];
      return d ? d.ideas.map(i => ({ id: i.id, momentos: window.Teoria.momentosDe(i), ejemplos: (i.ejemplos || []).length })) : null;
    }, unidad).catch(() => null);
    await ctx.close();
    return ideas;
  })();
  if (!def) { console.error(`No encontré la teoría de ${unidad} en la app (¿corre el servidor en ${BASE}?).`); process.exit(1); }

  for (const tema of temas) for (const [tam, w, h] of tamanos) {
    const ctx = await navegador.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 2, colorScheme: tema === 'oscuro' ? 'dark' : 'light' });
    const pref = `${tema}-${tam}`;
    if (partes.has('momentos')) for (const idea of def) for (const m of idea.momentos.filter(x => MOMENTOS.includes(x))) {
      const p = await abrir(ctx, `/unidad/${unidad}/teoria/${idea.id}`, { [unidad]: { idea: idea.id, ideas: { [idea.id]: { momento: m } } } });
      p.on('pageerror', e => errores.push(`${idea.id}/${m}: ${e.message}`));
      await p.screenshot({ path: path.join(carpeta, `${pref}-${idea.id}-${MOMENTOS.indexOf(m) + 1}-${m}.png`) });
      await p.close();
    }
    // Para ejemplos, glosario y laboratorio basta con la primera idea empezada (abre el tema aunque falte el requisito).
    const empezada = { [unidad]: { idea: def[0].id, ideas: { [def[0].id]: { momento: 'lee' } } } };
    if (partes.has('ejemplos') && def.some(i => i.ejemplos)) {
      const p = await abrir(ctx, `/unidad/${unidad}/teoria/ejemplos`, empezada);
      await p.waitForSelector('.te-ej', { timeout: 20000 }).catch(() => errores.push('ejemplos: no aparecieron las tarjetas'));
      p.on('pageerror', e => errores.push(`ejemplos: ${e.message}`));
      for (const idea of def.filter(i => i.ejemplos)) {
        await p.click(`[data-ej="${idea.id}"]`).catch(() => {});
        await p.waitForTimeout(400);
        const tarjetas = await p.$$('.te-ej');
        for (const [k, t] of tarjetas.entries()) {
          await t.scrollIntoViewIfNeeded(); await p.waitForTimeout(150);
          const nombre = `${pref}-ej-${idea.id}-${String(k + 1).padStart(2, '0')}.png`;
          await t.screenshot({ path: path.join(carpeta, nombre) });
          if (banderas.has('--lector') && tema === 'claro' && tam === 'cel' && [2, 7, 13].includes(k)) {
            fs.mkdirSync(path.join(carpeta, 'lector'), { recursive: true });
            const n = fs.readdirSync(path.join(carpeta, 'lector')).length + 1;
            fs.copyFileSync(path.join(carpeta, nombre), path.join(carpeta, 'lector', `${String(n).padStart(2, '0')}.png`));
          }
        }
        const ancho = await p.evaluate(() => [...document.querySelectorAll('.te-ej *')].some(e => e.getBoundingClientRect().right > innerWidth + 1));
        if (ancho) errores.push(`ejemplos ${idea.id}: algo se sale a lo ancho`);
      }
      await p.close();
    }
    for (const parte of ['glosario', 'laboratorio'].filter(x => partes.has(x))) {
      const p = await abrir(ctx, `/unidad/${unidad}/teoria/${parte}`, empezada);
      await p.screenshot({ path: path.join(carpeta, `${pref}-${parte}.png`) });
      await p.close();
    }
    await ctx.close();
  }
  await navegador.close();
  console.log(`Capturas en ${carpeta}${errores.length ? `\nErrores:\n- ${errores.join('\n- ')}` : '\nSin errores de página.'}`);
})();
