#!/usr/bin/env node
/*
 * ¿Alguna ecuación de la teoría se corta o se sale del ancho en el celular? (pendiente de app del 18 nov)
 *
 * Recorre con Playwright las unidades con `calidad: 2` a 390 × 844 y, en «Mira» (paso por paso), «La regla», «Así se
 * resuelve» (todos los pasos de varios casos) y las tarjetas de «Ejemplos», mide cada ecuación: la línea de fórmula
 * (.te-ec), la lectura en vivo (.te-lectura) y todo renglón que lleve una fracción, una raíz, una llave o una ficha de
 * color. Lista cada una cuyo contenido es más ancho que su caja (scrollWidth > clientWidth), que se sale de la
 * pantalla o que queda recortada por una caja de más arriba. Una fórmula que no cabe y se puede deslizar también
 * cuenta: en el celular no se ve la barra y el alumno no sabe que sigue. Y la que cabe pero se parte en mal sitio
 * (revisiones de la Etapa 7, 19 nov: «lo que no sirve + (lo ⏎ pedido − 1)» y «pista → acepción → ⏎ reemplazo»): un
 * renglón que termina con un paréntesis abierto sin cerrar, con + − × ÷ · y el resto abajo, con una flecha que
 * encadena términos (no pasos: «3x = 90 → ⏎ x = 30» está bien), o con «=» (o «;» en una fórmula) y abajo solo un resto
 * corto, de hasta 8 letras («R = ⏎ 40 N»; partir una cadena larga después de un «=» está bien). Los
 * renglones se leen de las cajas de las letras; en la prosa con fichas, un paréntesis partido solo cuenta si adentro
 * hay una cuenta. También salen las que partió la app (partirLargas, abajo) porque no cabían: se leen, pero el
 * arreglo es del contenido (partir la cuenta en dos pasos o acortarla).
 *
 * Necesita el servidor local (`npm run dev`, puerto 4173; otro con MESA_URL) y el Chromium de Playwright. Tarda unos
 * minutos (cientos de pantallas), por eso no entra en `npm test`: se corre a mano antes de dar por buena una unidad.
 *
 *   node herramientas/ecuaciones-ancho.js                       todas las unidades con calidad: 2
 *   node herramientas/ecuaciones-ancho.js fisica.vectores ...   solo esas unidades (tengan la calidad que tengan)
 *     --todas             todas las unidades de contenido/teoria
 *     --momentos=a,b      por defecto mira,regla,resuelve,ejemplos; también lee, juega, predice y ahora-tu
 *     --ancho=390         ancho de la pantalla en px (alto fijo de 844)
 *     --casos=3           cuántos casos de «Así se resuelve» (y de «Ahora tú») se abren por idea
 *     --a-la-vez=4        pantallas abiertas a la vez
 *     --json=ruta         guarda la lista en JSON
 *     --capturas=carpeta  una captura de cada ecuación que no cabe
 *
 * Sale con código 1 si encontró alguna. Qué hacer con cada una: si es de la app (una regla de app/estilos.css, cómo
 * arma el renglón app/teoria.js o nucleo/ecuacion.js), se arregla ahí; si es del contenido (una fórmula larga sin un
 * «=» donde partir, una llave con nota ancha), se parte en dos pasos o se acorta en contenido/teoria/<curso>/<unidad>.js.
 *
 * La medición (medirPagina) se prueba aparte, sin servidor, en herramientas/ecuaciones-ancho.test.js.
 */
const path = require('path');
const fs = require('fs');

// Corre dentro de la página. Devuelve las ecuaciones que no caben o se parten en mal sitio: [{ donde, texto, tipo,
// contenido, caja, sobra, corte? }]; corte, en las partidas, es el final del renglón ⏎ el comienzo del siguiente.
function medirEnPagina() {
  const TOL = 1;   // px de holgura: los anchos se redondean
  const raiz = document.querySelector('#app') || document.body;
  const estilo = el => getComputedStyle(el);
  const enLinea = el => /^(inline|contents|ruby)$/.test(estilo(el).display);
  const visible = el => el.getClientRects().length > 0 && el.clientWidth > 0 && estilo(el).visibility !== 'hidden';
  const bloqueDe = el => { let b = el.parentElement; while (b && b !== raiz && (enLinea(b) || /^inline-/.test(estilo(b).display))) b = b.parentElement; return b || raiz; };
  // Candidatas: la línea de fórmula y la lectura en vivo; y el renglón (bloque más cercano) de cada pieza de ecuación.
  const lineas = new Set(raiz.querySelectorAll('.te-ec, .te-lectura'));
  const candidatas = new Set(lineas);
  for (const pieza of raiz.querySelectorAll('.ec-frac, .ec-raiz, .ec-llave, .ec-vec, .ec-par, .ec-abs, .ec-tacha, .ec-raya, .ec-sup, .ec-sub, .var')) {
    if (pieza.closest('.te-ec, .te-lectura')) continue;
    candidatas.add(bloqueDe(pieza));
  }
  const texto = el => (el.innerText || el.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 160);
  const donde = el => {
    const partes = [];
    const ej = el.closest('.te-ej');
    if (ej) {
      const n = ej.querySelector('.te-ej-n'), t = ej.querySelector('h4');
      partes.push(`ejemplo ${n ? n.textContent.trim() : '?'}${t ? ` «${t.textContent.trim()}»` : ''}`);
      partes.push(el.closest('.te-ej-sol') ? 'resuelto' : el.closest('.te-ej-alt') ? 'alternativas' : el.closest('.te-datos') ? 'datos'
        : el.closest('.te-ej-resp') ? 'respuesta' : el.closest('.te-ej-enun') ? 'enunciado' : 'tarjeta');
    }
    const paso = el.closest('.te-res-paso');
    if (paso) partes.push(`paso ${[...paso.parentElement.children].indexOf(paso) + 1}`);
    else if (el.closest('.te-res-enun')) partes.push(el.closest('.te-datos') ? 'datos del caso' : 'enunciado del caso');
    else if (el.closest('.te-res-resp')) partes.push('respuesta del caso');
    const tarjeta = el.closest('.te-lee-t');
    if (tarjeta) partes.push(`tarjeta ${[...tarjeta.parentElement.children].indexOf(tarjeta) + 1}`);
    if (el.closest('.te-regla')) partes.push(el.classList.contains('te-ec') ? 'ecuación de la regla' : 'texto de la regla');
    if (el.closest('.alt, .alts')) partes.push('opciones');
    if (el.classList.contains('te-lectura')) partes.push('lectura en vivo');
    if (!partes.length && el.closest('.te-datos')) partes.push('datos');
    return partes.join(', ');
  };
  // Hasta dónde llega lo que se lee: las letras y las piezas que no se parten. El relleno de una ficha de color que
  // parte en varios renglones (.var.largo repite su relleno en cada renglón) puede pasar 2 a 4 px del borde sin que se
  // corte ninguna letra: eso no cuenta.
  const loQueSeLee = el => {
    let izq = Infinity, der = -Infinity;
    const r = document.createRange(), w = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    for (let n = w.nextNode(); n; n = w.nextNode()) {
      if (!n.nodeValue.trim()) continue;
      r.selectNodeContents(n);
      for (const c of r.getClientRects()) if (c.width > 0) { izq = Math.min(izq, c.left); der = Math.max(der, c.right); }
    }
    for (const a of el.querySelectorAll('svg, img, .ec-frac, .ec-raiz, .ec-llave')) { const c = a.getBoundingClientRect(); if (c.width > 0) { izq = Math.min(izq, c.left); der = Math.max(der, c.right); } }
    return { izq, der };
  };
  const fuera = [];
  for (const el of candidatas) {
    if (!visible(el)) continue;
    const r = el.getBoundingClientRect(), problemas = [];
    // 1. El contenido es más ancho que su caja.
    const sobra = el.scrollWidth - el.clientWidth, leido = loQueSeLee(el);
    const dentro = r.left + el.clientLeft - el.scrollLeft;   // borde izquierdo de la caja, por dentro
    if (sobra > TOL && (leido.der > dentro + el.clientWidth + TOL || leido.izq < dentro - TOL)) {
      const ox = estilo(el).overflowX;
      problemas.push({ tipo: ox === 'visible' ? 'se sale de su caja' : /auto|scroll/.test(ox) ? 'no cabe: hay que deslizarla' : 'cortada', contenido: el.scrollWidth, caja: el.clientWidth, sobra });
    }
    // 2. Una caja de más arriba la recorta, o la deja fuera de la pantalla. Un carrusel (tarjetas de «Lee») no cuenta
    // si la ecuación cabe entera en su ancho: se llega a ella deslizando la tarjeta.
    let enCarrusel = false;
    for (let a = el.parentElement; a && a !== document.documentElement; a = a.parentElement) {
      const ox = estilo(a).overflowX;
      if (ox === 'visible') continue;
      const ra = a.getBoundingClientRect(), desliza = /auto|scroll/.test(ox) && a.scrollWidth > a.clientWidth + TOL;
      if (desliza && r.width <= a.clientWidth + TOL) { enCarrusel = true; continue; }
      const corte = Math.max(r.right - (ra.left + a.clientLeft + a.clientWidth), ra.left + a.clientLeft - r.left);
      if (corte > TOL && !enCarrusel) problemas.push({ tipo: desliza ? 'no cabe: hay que deslizar la caja que la contiene' : 'recortada por una caja de arriba', contenido: Math.round(r.width), caja: a.clientWidth, sobra: Math.round(corte) });
    }
    const sale = Math.max(r.right - document.documentElement.clientWidth, -r.left);
    if (sale > TOL && !enCarrusel) problemas.push({ tipo: 'se sale de la pantalla', contenido: Math.round(r.width), caja: document.documentElement.clientWidth, sobra: Math.round(sale) });
    // 3. Cabe, pero el renglón se parte en mal sitio (revisiones de la Etapa 7): dentro de un paréntesis, o después de
    // un signo o una flecha con el resto abajo. Solo si no hay algo peor (lo que no cabe se anota primero).
    if (!problemas.length) { const p = partida(el); if (p) problemas.push(p); }
    if (!problemas.length) continue;
    const peor = problemas.sort((a, b) => b.sobra - a.sobra)[0];
    el.setAttribute('data-ec-ancho', String(fuera.length));
    fuera.push(Object.assign({ donde: donde(el), texto: texto(el), linea: lineas.has(el) }, peor));
  }
  return { total: [...candidatas].filter(visible).length, fuera };

  // Los renglones como se ven: cada letra con su caja, y cada pieza que no se parte (fracción, raíz, llave, ficha en
  // inline-block, dibujo) como una sola. Un renglón nuevo empieza cuando la pieza siguiente vuelve a la izquierda y
  // queda debajo de la anterior. Un bloque adentro (el separador de la regla grande, un <br>) es un corte a propósito:
  // no cuenta. La letra va con { l, r, t, b, c, sep, sup }; sep marca el « · » que separa dos relaciones (.ec-sep) y
  // sup, lo que va arriba o abajo (la carga de un ion, Cl⁻, no es un signo menos).
  function piezas(el) {
    const out = [], rg = document.createRange();
    let forz = false;
    const poner = (c, x) => { if (c && c.width > 0) { out.push(Object.assign({ l: c.left, r: c.right, t: c.top, b: c.bottom, forz }, x)); forz = false; } };
    const recorrer = (nodo, sep, sup) => {
      for (const n of nodo.childNodes) {
        if (n.nodeType === 3) {
          let i = 0;
          for (const ch of n.nodeValue) {
            if (!/\s/.test(ch)) { rg.setStart(n, i); rg.setEnd(n, i + ch.length); poner(rg.getClientRects()[0], { c: ch, sep, sup }); }
            i += ch.length;
          }
        } else if (n.nodeType === 1) {
          const d = estilo(n).display;
          if (d === 'none') continue;
          if (n.tagName === 'BR') { forz = true; continue; }
          if (/^(svg|img)$/i.test(n.tagName) || /^inline-/.test(d)) poner(n.getBoundingClientRect(), { c: '', atomo: (n.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 14) || '▭', sep });
          else if (/^(inline|contents|ruby)$/.test(d)) recorrer(n, sep || n.classList.contains('ec-sep'), sup || /^(SUP|SUB)$/.test(n.tagName));
          else forz = true;
        }
      }
    };
    recorrer(el, false, false);
    return out;
  }
  function partida(el) {
    const formula = !!el.closest('.te-ec, .te-lectura');
    // Dentro de una cuenta (+ − × ÷ ·) el corte siempre cuenta: la app los deja pegados y solo los suelta cuando el
    // renglón no cabe. Después de un «=» (o de un «;» en una fórmula) se parte una cadena larga, y está bien; cuenta si
    // lo que baja es un resto corto (hasta 8 letras antes de una coma, un punto, dos puntos o el final): «R = ⏎ 40 N»,
    // «A = ⏎ 50 N a 37°, …», «x = 3; ⏎ y = 4». El «;» de la prosa es puntuación. La flecha que encadena pasos
    // («3x = 90 → ⏎ x = 30») es buen sitio para partir; la que encadena términos («pista → acepción → ⏎ reemplazo»), no:
    // cuenta si lo que baja, hasta la flecha siguiente, no trae un =, <, >.
    const SIGNO = /^[+−×÷·]$/, FLECHA = /^[→⇒]$/, RELACION = formula ? /^[=;]$/ : /^=$/;
    const ps = piezas(el);
    if (ps.length < 2) return null;
    const termino = k => {
      for (let i = k; i < ps.length; i++) {
        const x = ps[i];
        if (i > k && (x.forz || x.sep)) break;
        if (!x.atomo && FLECHA.test(x.c)) break;
        if (!x.atomo && /^[=<>≤≥≠≈]$/.test(x.c)) return false;
      }
      return true;
    };
    const corto = k => {
      let n = 0;
      for (let i = k; i < ps.length; i++) {
        const x = ps[i], sig = ps[i + 1];
        if (i > k && (x.forz || x.sep)) break;
        if (!x.atomo && /^[,.;:]$/.test(x.c) && (!sig || sig.forz || sig.l - x.r > 2)) break;
        n += x.atomo ? 3 : 1;
        if (n > 8) return false;
      }
      return true;
    };
    const trozo = (a, b) => ps.slice(Math.max(0, a), b).map((p, k, xs) => (k && p.l - xs[k - 1].r > 2 ? ' ' : '') + (p.atomo ? `[${p.atomo}]` : p.c)).join('');
    const abiertos = [];   // índices de los ( y [ sin cerrar
    for (let k = 1; k < ps.length; k++) {
      const a = ps[k - 1], p = ps[k];
      if (!a.atomo && !a.sep) { if (/[([]/.test(a.c)) abiertos.push(k - 1); else if (/[)\]]/.test(a.c)) abiertos.pop(); }
      if (p.forz || !(p.l < a.r - 2 && p.t >= a.b - 4)) continue;
      // Hay corte de renglón entre a y p.
      const corte = `${trozo(k - 24, k)} ⏎ ${trozo(k, k + 16)}`;
      // En la prosa, un paréntesis que se parte es normal («(como el agua)»): solo cuenta si adentro hay una cuenta.
      const ab = abiertos[abiertos.length - 1];
      if (ab !== undefined && (formula || ps.slice(ab + 1, k).some(x => x.atomo || /[=+−×÷·/→]/.test(x.c))))
        return { tipo: 'partida dentro de un paréntesis', corte, contenido: el.scrollWidth, caja: el.clientWidth, sobra: 0 };
      if (!a.atomo && !a.sep && !a.sup && (SIGNO.test(a.c) || FLECHA.test(a.c) && termino(k) || RELACION.test(a.c) && corto(k))) return { tipo: `partida después de «${a.c}»`, corte, contenido: el.scrollWidth, caja: el.clientWidth, sobra: 0 };
    }
    return null;
  }
}

// Mide la página abierta. Devuelve { total, fuera }.
async function medirPagina(pagina) { return pagina.evaluate(medirEnPagina); }

module.exports = { medirPagina, medirEnPagina };

if (require.main === module) (async () => {
  let chromium;
  try { ({ chromium } = require('playwright')); } catch (e) { ({ chromium } = require('/opt/node22/lib/node_modules/playwright')); }
  const RAIZ = path.join(__dirname, '..');
  const BASE = process.env.MESA_URL || 'http://localhost:4173';
  const args = process.argv.slice(2);
  const op = (n, d) => { const a = args.find(x => x.startsWith(`--${n}=`)); return a ? a.slice(n.length + 3) : d; };
  const ANCHO = +op('ancho', 390), CASOS = +op('casos', 3), A_LA_VEZ = +op('a-la-vez', 4);
  const MOMENTOS = op('momentos', 'mira,regla,resuelve,ejemplos').split(',');
  const capturas = op('capturas', '');
  if (capturas) fs.mkdirSync(capturas, { recursive: true });

  // Unidades: las que se piden, o las de contenido/teoria con calidad: 2 (o todas con --todas).
  const dir = path.join(RAIZ, 'contenido', 'teoria');
  const todas = fs.readdirSync(dir, { withFileTypes: true }).filter(d => d.isDirectory()).flatMap(c =>
    fs.readdirSync(path.join(dir, c.name)).filter(f => f.endsWith('.js') && !f.endsWith('.test.js')).map(f => ({ id: `${c.name}.${f.slice(0, -3)}`, archivo: path.join(dir, c.name, f) })));
  const pedidas = args.filter(x => !x.startsWith('--'));
  const unidades = pedidas.length ? pedidas : todas.filter(u => args.includes('--todas') || /\bcalidad:\s*2\b/.test(fs.readFileSync(u.archivo, 'utf8'))).map(u => u.id);
  if (!unidades.length) { console.error('No hay unidades que revisar.'); process.exit(2); }

  // El mismo estado sembrado de herramientas/capturas-teoria.js: la unidad abierta en la idea y el momento pedidos.
  const MARCAS = (() => { const e = {}; require('../nucleo/avance.js').migrar(e); return Object.fromEntries(Object.entries(e).filter(([, v]) => typeof v === 'number')); })();
  const estado = teoria => Object.assign({}, MARCAS, { nombre: 'Ana', uni: 'unmsm', grado: '5', alumno: 'ancho', vistas: {}, dias: [], teoria, pruebas: {}, prefs: { pistaGlo: 1 } });
  async function abrir(ctx, ruta, teoria) {
    const p = await ctx.newPage();
    await p.addInitScript(e => localStorage.setItem('lab-v1', JSON.stringify(e)), estado(teoria));
    // Con la máquina cargada el servidor puede tardar: un segundo intento antes de dar la pantalla por perdida.
    await p.goto(`${BASE}/app/#${ruta}`).catch(() => p.goto(`${BASE}/app/#${ruta}`));
    await p.waitForFunction(() => document.body && !/Abriendo la teoría|Cargando/.test(document.body.innerText) && document.querySelector('#app *'), null, { timeout: 20000 }).catch(() => {});
    await p.waitForTimeout(400);
    return p;
  }

  const navegador = await chromium.launch();
  const hallazgos = [], avisos = [];
  let medidas = 0, pantallas = 0;
  async function medir(p, unidad, idea, momento, detalle) {
    const r = await medirPagina(p);
    medidas += r.total; pantallas++;
    for (const [k, f] of r.fuera.entries()) {
      const h = Object.assign({ unidad, idea, momento, detalle: [detalle, f.donde].filter(Boolean).join(', ') }, f);
      delete h.donde;
      // La misma ecuación se ve en varios pasos de la misma pantalla: se anota una vez.
      if (hallazgos.some(x => x.unidad === unidad && x.idea === idea && x.momento === momento && x.texto === h.texto && x.detalle.replace(/^(paso|caso) \d+(, )?/, '') === h.detalle.replace(/^(paso|caso) \d+(, )?/, ''))) continue;
      if (capturas) {
        h.captura = path.join(capturas, `${unidad}-${idea}-${momento}-${hallazgos.length + 1}.png`);
        const el = await p.$(`[data-ec-ancho="${k}"]`);
        if (el) { await el.scrollIntoViewIfNeeded().catch(() => {}); await p.screenshot({ path: h.captura }).catch(() => {}); }
      }
      hallazgos.push(h);
    }
    await p.evaluate(() => document.querySelectorAll('[data-ec-ancho]').forEach(x => x.removeAttribute('data-ec-ancho')));
  }

  async function revisar(unidad) {
    const ctx = await navegador.newContext({ viewport: { width: ANCHO, height: 844 } });
    try {
      // Las ideas de la unidad, leídas de la app (la teoría se carga aparte: se pregunta hasta 20 s).
      const p0 = await abrir(ctx, `/unidad/${unidad}/teoria`, { [unidad]: {} });
      let ideas = null;
      for (let k = 0; k < 40 && !ideas; k++) {
        ideas = await p0.evaluate(u => {
          const d = window.Teoria && window.Teoria.unidades && window.Teoria.unidades[u];
          return d ? d.ideas.map(i => ({ id: i.id, momentos: window.Teoria.momentosDe(i), ejemplos: (i.ejemplos || []).length,
            pred: i.predice && i.predice.opciones ? (i.predice.opciones.find(o => o.correcta) || i.predice.opciones[0]).id : null })) : null;
        }, unidad).catch(() => null);
        if (!ideas) await p0.waitForTimeout(500);
      }
      await p0.close();
      if (!ideas) { avisos.push(`${unidad}: no se pudo abrir su teoría (¿corre el servidor en ${BASE}?)`); return; }

      for (const idea of ideas) for (const m of idea.momentos.filter(x => MOMENTOS.includes(x))) try {
        // Con la máquina cargada la idea puede tardar en pintarse: se espera hasta 10 s más y, si no abrió, se prueba una
        // vez más con una pantalla nueva antes de darla por perdida (y anotarla en los avisos).
        let p = null, abrio = null;
        for (let intento = 1; intento <= 2 && abrio !== m; intento++) {
          if (p) await p.close();
          p = await abrir(ctx, `/unidad/${unidad}/teoria/${idea.id}`, { [unidad]: { idea: idea.id, ideas: { [idea.id]: Object.assign({ momento: m }, m === 'juega' || m === 'lee' || !idea.pred ? {} : { prediccion: idea.pred }) } } });
          await p.waitForFunction(x => { const e = document.querySelector('.te-idea'); return e && e.dataset.m === x; }, m, { timeout: 10000 }).catch(() => {});
          abrio = await p.evaluate(() => { const e = document.querySelector('.te-idea'); return e ? e.dataset.m : null; }).catch(() => null);
        }
        if (abrio !== m) { avisos.push(`${unidad} ${idea.id}: no abrió en «${m}» en dos intentos (abrió en «${abrio}»)`); await p.close(); continue; }
        p.on('pageerror', e => avisos.push(`${unidad} ${idea.id} ${m}: error de página: ${e.message}`));
        if (m === 'mira') {
          // Paso por paso con el botón grande, hasta que ofrece pasar a la regla.
          for (let k = 1; k <= 40; k++) {
            await medir(p, unidad, idea.id, m, `paso ${k}`);
            if (!/^Paso \d+ de \d+/.test(await p.textContent('.te-sig'))) break;
            await p.click('.te-sig'); await p.waitForTimeout(250);
          }
        } else if (m === 'resuelve') {
          for (let k = 1; k <= CASOS; k++) {
            const todo = await p.$('.te-res-todo');
            if (todo) { await todo.click(); await p.waitForTimeout(150); }
            await medir(p, unidad, idea.id, m, `caso ${k}`);
            const otro = await p.$('.te-res-otro');
            if (!otro) break;
            await otro.click(); await p.waitForTimeout(150);
          }
        } else if (m === 'ahora-tu') {
          for (let k = 1; k <= CASOS; k++) {
            await medir(p, unidad, idea.id, m, `caso ${k}`);
            const alt = await p.$('.te-zona .alt:not(.nose)');
            if (!alt) break;
            await alt.click(); await p.click('.te-sig'); await p.waitForTimeout(250);
            await medir(p, unidad, idea.id, m, `caso ${k}, corregido`);
            const otro = await p.$('.te-otro, [data-otro]');
            if (!otro) break;
            await otro.click(); await p.waitForTimeout(200);
          }
        } else await medir(p, unidad, idea.id, m, '');
        await p.close();
      } catch (e) { avisos.push(`${unidad} ${idea.id} ${m}: no se pudo revisar (${e.message.split('\n')[0]})`); }

      // Ejemplos: se abren con la predicción de cada idea ya respondida (si no, sale «Primero haz la predicción»).
      if (MOMENTOS.includes('ejemplos') && ideas.some(i => i.ejemplos)) {
        const predichas = { [unidad]: { idea: ideas[0].id, ideas: Object.fromEntries(ideas.map((i, k) => [i.id, Object.assign(k ? {} : { momento: 'lee' }, i.pred ? { prediccion: i.pred } : {})])) } };
        const p = await abrir(ctx, `/unidad/${unidad}/teoria/ejemplos`, predichas);
        p.on('pageerror', e => avisos.push(`${unidad} ejemplos: error de página: ${e.message}`));
        await p.waitForSelector('.te-ej', { timeout: 20000 }).catch(() => avisos.push(`${unidad}: no aparecieron las tarjetas de ejemplos`));
        for (const idea of ideas.filter(i => i.ejemplos)) {
          await p.click(`[data-ej="${idea.id}"]`).catch(() => {});
          await p.waitForTimeout(300);
          if (await p.$('.te-ej-bloq')) { avisos.push(`${unidad} ${idea.id}: los ejemplos salieron bloqueados`); continue; }
          const n = (await p.$$('.te-ej')).length;
          if (n !== idea.ejemplos) avisos.push(`${unidad} ${idea.id}: se ven ${n} tarjetas de ${idea.ejemplos}`);
          await medir(p, unidad, idea.id, 'ejemplos', '');
        }
        await p.close();
      }
    } finally { await ctx.close(); }
  }

  // Varias unidades a la vez.
  const cola = unidades.slice();
  const t0 = Date.now();
  await Promise.all(Array.from({ length: Math.min(A_LA_VEZ, cola.length) }, async () => {
    for (let u = cola.shift(); u; u = cola.shift()) {
      await revisar(u).catch(e => avisos.push(`${u}: no se pudo revisar (${e.message.split('\n')[0]})`));
      // «Todo cabe» solo si se pudo mirar todo: una pantalla que no abrió no es una pantalla que cabe.
      const n = hallazgos.filter(h => h.unidad === u).length, sin = new Set(avisos.filter(a => a.startsWith(u + ' ') || a.startsWith(u + ':'))).size;
      console.error(`· ${u}: ${n ? `${n} que no caben o se parten mal` : sin ? 'sin hallazgos' : 'todo cabe'}${sin ? `, pero ${sin} ${sin === 1 ? 'aviso' : 'avisos'}: no se revisó completa` : ''}`);
    }
  }));
  await navegador.close();

  hallazgos.sort((a, b) => (a.unidad + a.idea + a.momento).localeCompare(b.unidad + b.idea + b.momento));
  const NOMBRE = { lee: 'Lee', juega: 'Juega', predice: 'Predice', mira: 'Mira', regla: 'La regla', resuelve: 'Así se resuelve', 'ahora-tu': 'Ahora tú', ejemplos: 'Ejemplos' };
  console.log(`Ecuaciones a ${ANCHO} px: ${unidades.length} unidades, ${pantallas} pantallas, ${medidas} renglones medidos en ${Math.round((Date.now() - t0) / 1000)} s.`);
  if (!hallazgos.length) console.log(avisos.length ? 'No se encontró ninguna que no quepa ni que se parta mal, pero el barrido no está completo (ver los avisos).' : 'Ninguna ecuación se corta, se sale del ancho ni se parte en mal sitio.');
  else {
    const partidas = hallazgos.filter(h => h.corte).length;
    console.log(`${hallazgos.length - partidas} no caben y ${partidas} se parten en mal sitio:\n`);
    for (const h of hallazgos) console.log(`- ${h.unidad} · ${h.idea} · ${NOMBRE[h.momento] || h.momento}${h.detalle ? ` (${h.detalle})` : ''}\n    «${h.texto}»\n    ${h.corte ? `${h.tipo}: «${h.corte}»` : `${h.tipo}: ${h.contenido} px en ${h.caja} px (sobran ${h.sobra} px)`}${h.captura ? `\n    ${h.captura}` : ''}`);
  }
  if (hallazgos.length) {
    const porTipo = {};
    for (const h of hallazgos) porTipo[h.tipo] = (porTipo[h.tipo] || 0) + 1;
    console.log(`\nPor tipo: ${Object.entries(porTipo).sort((a, b) => b[1] - a[1]).map(([t, n]) => `${t}: ${n}`).join(' · ')}`);
  }
  if (avisos.length) console.log(`\nAvisos (lo que no se pudo revisar; mientras haya, el barrido no vale como completo):\n- ${[...new Set(avisos)].join('\n- ')}`);
  const json = op('json', '');
  if (json) fs.writeFileSync(json, JSON.stringify({ ancho: ANCHO, unidades, pantallas, medidas, hallazgos, avisos: [...new Set(avisos)] }, null, 2));
  process.exit(hallazgos.length ? 1 : avisos.length ? 3 : 0);
})();
