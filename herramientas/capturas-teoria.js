#!/usr/bin/env node
/*
 * Capturas de la teoría de una unidad, para el lector en frío, el auditor y la galería de Gerson (docs/molde-unidad.md
 * §8; docs/metodo/unidad/). Necesita el servidor local (`node herramientas/servidor.js`, puerto 4173) y el Chromium del
 * entorno (Playwright).
 *
 *   node herramientas/capturas-teoria.js <unidad> <carpeta> [partes] [--oscuro] [--ancha] [--lector]
 *
 *   partes: momentos,ejemplos,glosario,laboratorio (por defecto, todas). momentos incluye «En el mundo» si la idea lo trae
 *   --oscuro   también en tema oscuro
 *   --ancha    también a 1280 × 860 (pantalla ancha); por defecto solo 390 × 844 (celular)
 *   --entera   momentos en página entera (figura y botones sin fijar): lo que lee el lector en frío
 *   --lector   copia aparte, en <carpeta>/lector/, las tarjetas n.º 3, 8 y 14 de cada idea (una por nivel), con nombres
 *              que no dicen la idea, para el lector en frío de los ejemplos
 *
 * Ejemplo: node herramientas/capturas-teoria.js fisica.vectores /tmp/cap --oscuro --lector
 * Lector en frío: node herramientas/capturas-teoria.js <unidad> <carpeta> momentos,ejemplos --entera --lector
 * Cada momento sale en una captura de la pantalla visible (no de página entera: la barra de abajo y la de acción son
 * fijas y en una captura de página entera quedan encima del contenido). Las tarjetas de ejemplos salen una por una.
 * Antes de empezar comprueba que <MESA_URL>/app/datos/catalogo.json responde 200 con JSON válido (reintenta unas veces);
 * si una pantalla muestra «No se pudo cargar el catálogo», para con error y no guarda esa captura.
 */
const path = require('path');
const fs = require('fs');

// El aviso que pinta app/app.js cuando no llega el catálogo (Etapa 6: salieron 35 capturas iguales de este aviso).
const AVISO_CATALOGO = /No se pudo cargar el catálogo/;
const muestraAvisoCatalogo = texto => AVISO_CATALOGO.test(String(texto || ''));

// Antes de abrir el navegador: <base>/app/datos/catalogo.json responde 200 con JSON válido. Reintenta unas veces (el
// servidor puede estar arrancando); si no, lanza un error que dice qué pasó y cómo arreglarlo.
async function comprobarCatalogo(base, { intentos = 5, espera = 1000, pedir = globalThis.fetch } = {}) {
  const url = `${base}/app/datos/catalogo.json`;
  let ultimo = '';
  for (let k = 1; k <= intentos; k++) {
    try {
      const r = await pedir(url);
      if (r.status !== 200) ultimo = `respondió ${r.status}`;
      else {
        const texto = await r.text();
        try { JSON.parse(texto); return true; } catch (e) { ultimo = `respondió 200 pero no es JSON válido (${e.message})`; }
      }
    } catch (e) { ultimo = `no respondió (${(e.cause && e.cause.code) || e.message})`; }
    if (k < intentos) await new Promise(r => setTimeout(r, espera));
  }
  throw new Error(`El catálogo no está disponible: ${url} ${ultimo} tras ${intentos} intentos. ¿Corre el servidor en ${base}? ` +
    `¿Existe app/datos/catalogo.json (npm run catalogo)? No saco capturas del aviso «No se pudo cargar el catálogo».`);
}

module.exports = { AVISO_CATALOGO, muestraAvisoCatalogo, comprobarCatalogo };
if (require.main !== module) return;

let chromium;
try { ({ chromium } = require('playwright')); } catch (e) { ({ chromium } = require('/opt/node22/lib/node_modules/playwright')); }

const [unidad, carpeta, ...resto] = process.argv.slice(2);
if (!unidad || !carpeta) { console.error('uso: node herramientas/capturas-teoria.js <unidad> <carpeta> [partes] [--oscuro] [--ancha] [--entera] [--lector]'); process.exit(1); }
const banderas = new Set(resto.filter(x => x.startsWith('--')));
const partes = new Set((resto.find(x => !x.startsWith('--')) || 'momentos,ejemplos,glosario,laboratorio').split(','));
const BASE = process.env.MESA_URL || 'http://localhost:4173';
// Los momentos, en el orden del lector (nucleo/teoria.js): «En el mundo» (28 nov) va después de la regla. El número del
// archivo es el lugar del momento en esa lista (…-5-regla, -6-mundo, -7-resuelve, -8-ahora-tu).
const MOMENTOS = require('../nucleo/teoria.js').MOMENTOS;

// La unidad abierta: con su propio estado de teoría empezado, el mapa la deja entrar aunque su requisito no esté hecho.
// El estado sembrado ya trae hechas las migraciones del avance (nucleo/avance.js): si no, una migración que borra
// predicciones viejas (prediccionMRU, 18 nov) borraría también las que siembran las capturas de «Ejemplos».
const MARCAS = (() => { const e = {}; require('../nucleo/avance.js').migrar(e); return Object.fromEntries(Object.entries(e).filter(([, v]) => typeof v === 'number')); })();
const estado = teoria => Object.assign({}, MARCAS, { nombre: 'Ana', uni: 'unmsm', grado: '5', alumno: 'captura', vistas: {}, dias: [], teoria, pruebas: {}, prefs: { pistaGlo: 1 } });

async function abrir(ctx, ruta, teoria) {
  const p = await ctx.newPage();
  await p.addInitScript(e => localStorage.setItem('lab-v1', JSON.stringify(e)), estado(teoria));
  await p.goto(`${BASE}/app/#${ruta}`);
  // Espera a que la teoría termine de abrir (con la máquina cargada pasa de 1,5 s), con tope de 20 s.
  await p.waitForFunction(() => document.body && !/Abriendo la teoría|Cargando/.test(document.body.innerText) && document.querySelector('#app *'), null, { timeout: 20000 }).catch(() => {});
  await p.waitForTimeout(600);
  // Si la pantalla muestra el aviso del catálogo, no se guarda nada: se corta con un error claro.
  if (muestraAvisoCatalogo(await p.evaluate(() => document.body ? document.body.innerText : '').catch(() => ''))) {
    throw new Error(`La pantalla #${ruta} muestra «No se pudo cargar el catálogo»: no guardo su captura. Revisa que ${BASE}/app/datos/catalogo.json cargue en el navegador.`);
  }
  await p.addStyleTag({ content: '#nav{display:none!important}' }).catch(() => {});
  return p;
}

(async () => {
  await comprobarCatalogo(BASE);
  fs.mkdirSync(carpeta, { recursive: true });
  const navegador = await chromium.launch(fs.existsSync('/usr/bin/google-chrome') ? { executablePath: '/usr/bin/google-chrome' } : {});
  const errores = [];
  const temas = banderas.has('--oscuro') ? ['claro', 'oscuro'] : ['claro'];
  const tamanos = banderas.has('--ancha') ? [['cel', 390, 844], ['ancha', 1280, 860]] : [['cel', 390, 844]];
  // Ideas de la unidad: se leen del archivo de la teoría.
  const def = await (async () => {
    const ctx = await navegador.newContext();
    const p = await abrir(ctx, `/unidad/${unidad}/teoria`, { [unidad]: {} });
    // La teoría se carga aparte: se pregunta cada medio segundo, hasta 20 s.
    let ideas = null;
    for (let k = 0; k < 40 && !ideas; k++) {
      ideas = await p.evaluate(u => {
        const d = window.Teoria && window.Teoria.unidades && window.Teoria.unidades[u];
        return d ? d.ideas.map(i => ({ id: i.id, momentos: window.Teoria.momentosDe(i), ejemplos: (i.ejemplos || []).length,
          pred: i.predice && i.predice.opciones ? (i.predice.opciones.find(o => o.correcta) || i.predice.opciones[0]).id : null })) : null;
      }, unidad).catch(() => null);
      if (!ideas) await p.waitForTimeout(500);
    }
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
      // --entera: la página completa, con la figura y la barra de botones en su lugar (no pegadas), para el lector en frío.
      if (banderas.has('--entera')) await p.addStyleTag({ content: '.te-accion,.te-figcaja{position:static!important;box-shadow:none!important}' });
      await p.screenshot({ path: path.join(carpeta, `${pref}-${idea.id}-${MOMENTOS.indexOf(m) + 1}-${m}.png`), fullPage: banderas.has('--entera') });
      await p.close();
    }
    // Para ejemplos, glosario y laboratorio basta con la primera idea empezada (abre el tema aunque falte el requisito).
    const empezada = { [unidad]: { idea: def[0].id, ideas: { [def[0].id]: { momento: 'lee' } } } };
    // Los ejemplos de una idea se abren después de su «Predice» (18 nov): para verlos todos, el estado sembrado trae las
    // predicciones de la unidad ya respondidas.
    const predichas = { [unidad]: { idea: def[0].id, ideas: Object.fromEntries(def.map((i, k) => [i.id, Object.assign(k ? {} : { momento: 'lee' }, i.pred ? { prediccion: i.pred } : {})])) } };
    if (partes.has('ejemplos') && def.some(i => i.ejemplos)) {
      const p = await abrir(ctx, `/unidad/${unidad}/teoria/ejemplos`, predichas);
      await p.waitForSelector('.te-ej', { timeout: 20000 }).catch(() => errores.push('ejemplos: no aparecieron las tarjetas'));
      p.on('pageerror', e => errores.push(`ejemplos: ${e.message}`));
      for (const idea of def.filter(i => i.ejemplos)) {
        await p.click(`[data-ej="${idea.id}"]`).catch(() => {});
        await p.waitForTimeout(400);
        if (await p.$('.te-ej-bloq')) errores.push(`ejemplos ${idea.id}: salió el aviso «Primero haz la predicción», no las tarjetas`);
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
})().catch(e => { console.error(`capturas-teoria: ${e.message}`); process.exit(1); });
