/*
 * Teoría interactiva: la puerta «Teoría» de la unidad (docs/teoria.md). Contrato con app/app.js:
 *   window.Teoria.vista(ctx, unidad)   ctx = { $app, cat, est, esc, guardar, registrar, marcarDia, cab }
 * La unidad del catálogo trae `teoria: { archivo, requiere }`. Aquí se cargan el kit, las piezas y el archivo de la
 * unidad (contenido/teoria/<curso>/<unidad>.js), que se registra con Teoria.unidad({...}) (nucleo/teoria.js).
 *
 * Cada idea recorre cinco momentos: juega → predice → mira → regla → ahora tú. Solo la predicción bloquea (regla 3);
 * antes se juega (decisión 20). El estado vive en est.teoria[unidad]; los eventos «teoria» van a la medición.
 * Rutas: #/unidad/<id>/teoria (la idea en curso), …/teoria/<idea>, …/teoria/laboratorio, …/teoria/ficha y …/teoria/glosario.
 *
 * Glosario (15 nov): los términos del glosario del curso (app/datos/glosario/<curso>.json, nucleo/glosario.js) se
 * marcan solos en el texto, la primera vez que salen en cada pantalla; al tocarlos abre una hoja con la definición y
 * de dónde viene (nuevo en este tema, o de otra unidad). Nunca en la prueba del tema ni en las opciones.
 *
 * Gesto directo (pedido de Gerson, 14 nov): el juego declara `arrastres`, manijas sobre la figura que el alumno arrastra;
 * cada arrastre mueve controles que también tienen − y + (nunca solo arrastre). La lupa amplía cualquier figura
 * (botones y pellizco). El laboratorio junta mesas de juego libre, sin preguntas, con «Guardar este caso» para comparar.
 */
(function () {
  'use strict';
  const KIT_CSS = '/nucleo/kit/kit.css';
  const BASE = ['/nucleo/kit/kit.js', '/nucleo/kit/trazo.js', '/nucleo/kit/linea-tiempo.js', '/nucleo/ecuacion.js', '/nucleo/glosario.js', '/nucleo/teoria.js'];
  const cargados = {};
  const cargar = src => cargados[src] || (cargados[src] = new Promise((ok, mal) => {
    const s = document.createElement('script'); s.src = src; s.async = false;
    s.onload = ok; s.onerror = () => { delete cargados[src]; s.remove(); mal(new Error('No se pudo cargar ' + src)); };
    document.head.appendChild(s);
  }));
  let estilo = null;
  const cargarEstilo = () => estilo || (estilo = new Promise(ok => {
    const l = document.createElement('link'); l.rel = 'stylesheet'; l.href = KIT_CSS; l.onload = ok; l.onerror = ok; document.head.appendChild(l);
  }));
  const NOMBRE_MOMENTO = { juega: 'Juega', predice: 'Predice', mira: 'Mira', regla: 'La regla', 'ahora-tu': 'Ahora tú' };
  const reducido = () => window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  const ICONO_LUPA = '<svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6" fill="none" stroke="currentColor" stroke-width="2"/><path d="M15 15l5 5M10.5 8v5M8 10.5h5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';
  const MAX_CASOS = 4;

  // Glosario del curso: se pide una vez y queda en memoria (el service worker lo guarda para usarlo sin conexión).
  const glosarios = {};
  const glosarioDe = curso => glosarios[curso] || (glosarios[curso] = fetch(`/app/datos/glosario/${curso}.json`)
    .then(r => (r.ok ? r.json() : { entradas: [] })).catch(() => { delete glosarios[curso]; return { entradas: [] }; }));

  async function cargarUnidad(u) {
    await cargarEstilo();
    for (const s of BASE) await cargar(s);                     // en orden: kit → trazo → … → teoria
    await Promise.all((u.teoria.requiere || []).map(cargar));
    await cargar(u.teoria.archivo);
    const def = window.Teoria.unidades[u.id];
    if (!def) throw new Error('El archivo de teoría no registró la unidad');
    return def;
  }

  function vista(ctx, u) {
    const { $app, esc } = ctx;
    const c = ctx.cat.cursos.find(x => x.unidades.some(y => y.id === u.id));
    const sub = ctx.sub || decodeURIComponent(location.hash.split('/')[4] || '');   // #/unidad/<id>/teoria/<idea | ficha | laboratorio>
    $app.innerHTML = `<div class="card te-cargando" role="status">Abriendo la teoría…</div>`;
    const h = location.hash;
    Promise.all([cargarUnidad(u), glosarioDe(c.id)]).then(([def, glos]) => {
      if (location.hash !== h) return;
      pintar(ctx, c, u, def, sub, glos);
    }, () => {
      if (location.hash !== h) return;
      $app.innerHTML = `<div class="card"><h2>No se pudo abrir la teoría</h2>
        <p>Revisa tu conexión y vuelve a intentarlo. Si ya la habías abierto antes, funciona sin internet.</p>
        <a class="btn morado" href="#/unidad/${esc(u.id)}">Volver a la unidad</a></div>`;
    });
  }

  // ---------- Estado del alumno ----------
  function estadoUnidad(ctx, id) {
    const est = ctx.est;
    est.teoria = est.teoria || {};
    return est.teoria[id] || (est.teoria[id] = { ideas: {} });
  }
  const estadoIdea = (st, id) => st.ideas[id] || (st.ideas[id] = { momento: 'juega', casos: 0 });
  const hecha = (st, id) => !!(st.ideas[id] && st.ideas[id].hecha);

  // Mesas del laboratorio: las que trae la unidad o, si no trae, el juego de cada idea (sin mínimo ni preguntas).
  const mesasDe = def => (def.laboratorio && def.laboratorio.length ? def.laboratorio
    : def.ideas.map(i => Object.assign({ id: i.id, titulo: i.titulo, pieza: i.juega.pieza || i.pieza }, i.juega)));

  // ---------- Lupa: la figura ampliada, con − y + y pellizco con dos dedos ----------
  const PASOS_ZOOM = [1, 1.5, 2, 3, 4];
  function abrirLupa(svgHTML, alt, origen) {
    const capa = document.createElement('div');
    capa.className = 'te-lupa';
    capa.setAttribute('role', 'dialog'); capa.setAttribute('aria-modal', 'true'); capa.setAttribute('aria-label', 'Figura ampliada');
    capa.innerHTML = `<div class="te-lupa-barra">
        <button type="button" class="te-mm" data-z="-1" aria-label="Alejar">−</button>
        <output class="te-lupa-n" aria-live="polite">100 %</output>
        <button type="button" class="te-mm" data-z="1" aria-label="Acercar">+</button>
        <button type="button" class="btn borde te-lupa-cerrar">Cerrar</button></div>
      <div class="te-lupa-area" tabindex="0" aria-label="${(alt || '').replace(/"/g, '&quot;')}"><div class="te-lupa-lienzo kit-figura">${svgHTML}</div></div>`;
    document.body.appendChild(capa);
    document.body.classList.add('con-lupa');
    const area = capa.querySelector('.te-lupa-area'), lienzo = capa.querySelector('.te-lupa-lienzo'), svg = lienzo.querySelector('svg');
    if (svg) { svg.removeAttribute('width'); svg.removeAttribute('height'); svg.querySelectorAll('.te-manija').forEach(m => m.remove()); }
    let escala = 1;
    const base = () => Math.min(area.clientWidth - 16, 900);
    const fijar = (e, foco) => {
      const vieja = escala;
      escala = Math.max(1, Math.min(4, e));
      const cx = foco ? foco.x : area.clientWidth / 2, cy = foco ? foco.y : area.clientHeight / 2;
      const px = (area.scrollLeft + cx) / vieja, py = (area.scrollTop + cy) / vieja;
      lienzo.style.width = `${Math.round(base() * escala)}px`;
      area.scrollLeft = px * escala - cx; area.scrollTop = py * escala - cy;
      capa.querySelector('.te-lupa-n').textContent = `${Math.round(escala * 100)} %`;
    };
    fijar(1);
    const cerrar = () => { capa.remove(); document.body.classList.remove('con-lupa'); document.removeEventListener('keydown', tecla); if (origen) origen.focus(); };
    const tecla = e => { if (e.key === 'Escape') cerrar(); };
    document.addEventListener('keydown', tecla);
    capa.querySelector('.te-lupa-cerrar').onclick = cerrar;
    capa.addEventListener('click', e => {
      const b = e.target.closest('[data-z]'); if (!b) return;
      const i = PASOS_ZOOM.findIndex(z => z >= escala - 1e-9);
      fijar(PASOS_ZOOM[Math.max(0, Math.min(PASOS_ZOOM.length - 1, (b.dataset.z === '1' ? (PASOS_ZOOM[i] > escala + 1e-9 ? i : i + 1) : i - 1)))]);
    });
    // Pellizco: con dos dedos, la escala sigue la distancia entre ellos; con uno, se desplaza (scroll nativo).
    const dedos = new Map(); let inicio = null;
    area.addEventListener('pointerdown', e => { dedos.set(e.pointerId, e); if (dedos.size === 2) { const [a, b] = [...dedos.values()]; inicio = { d: Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY), e: escala }; } });
    area.addEventListener('pointermove', e => {
      if (!dedos.has(e.pointerId)) return;
      dedos.set(e.pointerId, e);
      if (dedos.size === 2 && inicio) {
        const [a, b] = [...dedos.values()], r = area.getBoundingClientRect();
        fijar(inicio.e * Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY) / (inicio.d || 1), { x: (a.clientX + b.clientX) / 2 - r.left, y: (a.clientY + b.clientY) / 2 - r.top });
      }
    });
    const soltar = e => { dedos.delete(e.pointerId); if (dedos.size < 2) inicio = null; };
    area.addEventListener('pointerup', soltar); area.addEventListener('pointercancel', soltar);
    area.addEventListener('wheel', e => { if (!e.ctrlKey) return; e.preventDefault(); const r = area.getBoundingClientRect(); fijar(escala * (e.deltaY < 0 ? 1.1 : 0.9), { x: e.clientX - r.left, y: e.clientY - r.top }); }, { passive: false });
    capa.querySelector('.te-lupa-cerrar').focus();
  }

  // ---------- Pantalla ----------
  // La hoja del glosario se abre desde cualquier pantalla de la teoría; la última pantalla pintada dice qué abrir.
  let glosaActual = null;
  document.addEventListener('click', e => {
    const b = e.target.closest && e.target.closest('.te-term,[data-glosa]');
    if (b && glosaActual) { e.preventDefault(); glosaActual(b.dataset.term || b.dataset.glosa, b); return; }
    const capa = document.querySelector('.te-glosa');
    if (capa && !capa.hidden && (e.target.closest('.te-glosa-x') || !e.target.closest('.te-glosa'))) cerrarGlosa();
  });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') cerrarGlosa(); });
  window.addEventListener('hashchange', () => cerrarGlosa(false));
  let glosaVuelta = null;
  function cerrarGlosa(devolverFoco = true) {
    const capa = document.querySelector('.te-glosa');
    if (!capa || capa.hidden) return;
    capa.hidden = true;
    if (devolverFoco && glosaVuelta && glosaVuelta.isConnected) glosaVuelta.focus();
    glosaVuelta = null;
  }

  function pintar(ctx, c, u, def, sub, glos) {
    const { $app, esc } = ctx;
    const T = window.Teoria, E = window.Ecuacion, Kit = window.Kit;
    const st = estadoUnidad(ctx, u.id);
    const per = T.PERSONAJES[c.id] || { nombre: 'Tu compañero' };
    const ideas = def.ideas;
    // Calibración (prueba de entrada del tema, Teoria.entrada): las ideas acertadas ahí empiezan por la regla.
    const sabidas = new Set((((ctx.est.temas || {})[u.id] || {}).entrada || {}).sabidas || []);
    const primeraPendiente = ideas.find(i => !hecha(st, i.id) && !sabidas.has(i.id)) || ideas.find(i => !hecha(st, i.id)) || ideas[ideas.length - 1];
    const ficha = sub === 'ficha', lab = sub === 'laboratorio', glosa = sub === 'glosario';
    const idea = ficha || lab || glosa ? null : ideas.find(i => i.id === sub) || primeraPendiente;

    // ---------- Glosario: términos tocables y hoja con la definición ----------
    const G = window.Glosario;
    const entradas = (G && glos && glos.entradas) || [];
    const porClave = new Map(entradas.map(e => [G.clave(e.termino), e]));
    const aqui = entradas.filter(e => e.aparece.includes(u.id));
    const buscadorG = aqui.length ? G.buscador(aqui) : null;
    const origen = e => (e.en === u.id ? 'Nuevo en este tema'
      : (ctx.est.teoria || {})[e.en] ? `Lo viste en «${e.enNombre}»` : `Se explica en «${e.enNombre}»`);
    // No se marca dentro de botones, opciones, ecuaciones, títulos, la lectura en vivo ni lo que dice el compañero.
    const NO_MARCAR = 'button,a,input,textarea,select,label,output,svg,h1,h2,h3,.alts,.var,[class*="ec-"],.te-term,.te-momentos,.te-dice,.te-lectura,.te-glosa,.te-casos';
    function marcarTerminos(el) {
      if (!buscadorG || !el) return;
      // Un término se marca una vez por pantalla: la primera vez que sale entre lo que se ve ahora.
      const usados = new Set([...el.querySelectorAll('.te-term')].map(b => b.dataset.term));
      const tw = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, { acceptNode: n => (n.nodeValue.trim() && n.parentElement
        && !n.parentElement.closest(NO_MARCAR) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT) });
      const nodos = [];
      for (let n = tw.nextNode(); n; n = tw.nextNode()) nodos.push(n);
      for (const n of nodos) {
        const txt = n.nodeValue, ms = G.marcas(txt, aqui, usados, buscadorG);
        if (!ms.length) continue;
        const frag = document.createDocumentFragment();
        let k = 0;
        for (const m of ms) {
          frag.append(txt.slice(k, m.inicio));
          const b = document.createElement('button');
          b.type = 'button'; b.className = 'te-term'; b.dataset.term = m.clave; b.setAttribute('aria-haspopup', 'dialog');
          b.textContent = txt.slice(m.inicio, m.fin);
          frag.append(b); k = m.fin;
        }
        frag.append(txt.slice(k));
        n.replaceWith(frag);
      }
    }
    // Lo que se pinta después (pasos de «Mira», preguntas, consignas) también se marca.
    function vigilar(el) {
      if (!buscadorG || !el || !window.MutationObserver) return;
      const OPC = { childList: true, subtree: true };
      let pend = false;
      const ob = new MutationObserver(() => {
        if (pend) return;
        pend = true;
        requestAnimationFrame(() => { pend = false; ob.disconnect(); if (el.isConnected) { marcarTerminos(el); ob.observe(el, OPC); } });
      });
      marcarTerminos(el); ob.observe(el, OPC);
    }
    glosaActual = (k, desde) => {
      const e = porClave.get(k); if (!e) return;
      let capa = document.querySelector('.te-glosa');
      if (!capa) {
        capa = document.createElement('div'); capa.className = 'te-glosa'; capa.setAttribute('role', 'dialog');
        document.body.appendChild(capa);
      }
      const ver = (e.ver || []).map(v => porClave.get(G.clave(v))).filter(Boolean);
      capa.setAttribute('aria-label', `Qué significa ${e.termino}`);
      capa.innerHTML = `<div class="te-glosa-cab"><p class="te-glosa-origen">${esc(origen(e))}</p>
          <button type="button" class="te-glosa-x" aria-label="Cerrar">×</button></div>
        <h3 class="te-glosa-t" tabindex="-1">${esc(e.termino)}</h3>
        ${e.simbolo || e.medida ? `<p class="te-glosa-sm">${e.simbolo ? `Símbolo <b class="ec-letra">${esc(e.simbolo)}</b>` : ''}${e.simbolo && e.medida ? ' · ' : ''}${e.medida ? `se mide en <b>${esc(e.medida)}</b>` : ''}</p>` : ''}
        <p class="te-glosa-d">${esc(e.def)}</p>
        ${e.ejemplo ? `<p class="te-glosa-e"><span>Ejemplo</span> ${esc(e.ejemplo)}</p>` : ''}
        ${ver.length ? `<p class="te-glosa-ver"><span>Ver también</span> ${ver.map(v => `<button type="button" class="te-ficha-op" data-glosa="${esc(G.clave(v.termino))}">${esc(v.termino)}</button>`).join(' ')}</p>` : ''}
        ${glosa ? '' : `<a class="te-glosa-todo" href="#/unidad/${esc(u.id)}/teoria/glosario">Todo el glosario del tema ›</a>`}`;
      capa.hidden = false;
      if (!glosaVuelta || !desde.closest('.te-glosa')) glosaVuelta = desde;
      capa.querySelector('.te-glosa-t').focus({ preventScroll: true });
      ctx.registrar({ tipo: 'teoria', unidad: u.id, momento: 'glosario', termino: e.termino });
    };
    const n = ideas.filter(i => hecha(st, i.id)).length;

    const chip = (i, k) => {
      const on = idea && i.id === idea.id;
      return `<a class="te-chip${on ? ' on' : ''}${hecha(st, i.id) ? ' hecha' : sabidas.has(i.id) ? ' sabida' : ''}" href="#/unidad/${esc(u.id)}/teoria/${esc(i.id)}"${on ? ' aria-current="step"' : ''}>
        <span class="te-num" aria-hidden="true">${hecha(st, i.id) ? '✓' : k + 1}</span><span>${esc(i.titulo)}</span>${hecha(st, i.id) ? '<span class="lector"> (terminada)</span>' : sabidas.has(i.id) ? '<span class="lector"> (la acertaste en la prueba de entrada)</span>' : ''}</a>`;
    };
    const cab = ctx.muestra ? ctx.cab() : `${ctx.cab('Teoría')}
      <nav class="te-ideas" aria-label="Ideas de esta unidad">${ideas.map(chip).join('')}
        <a class="te-chip te-lab${lab ? ' on' : ''}" href="#/unidad/${esc(u.id)}/teoria/laboratorio"${lab ? ' aria-current="page"' : ''}>
        <span class="te-num" aria-hidden="true">⚗</span><span>Laboratorio</span></a>
        <a class="te-chip te-ficha${ficha ? ' on' : ''}" href="#/unidad/${esc(u.id)}/teoria/ficha"${ficha ? ' aria-current="page"' : ''}>
        <span class="te-num" aria-hidden="true">≡</span><span>Ficha de repaso</span></a>
        ${aqui.length ? `<a class="te-chip te-glo-chip${glosa ? ' on' : ''}" href="#/unidad/${esc(u.id)}/teoria/glosario"${glosa ? ' aria-current="page"' : ''}>
        <span class="te-num" aria-hidden="true">Aa</span><span>Glosario</span></a>` : ''}</nav>
      <p class="sub te-avance">${n} de ${ideas.length} ideas terminadas${sabidas.size ? ` · en la prueba de entrada acertaste ${sabidas.size}` : ''}</p>`;

    const figuraHTML = `<div class="te-figcaja"><figure class="te-fig kit-figura" aria-describedby="te-alt"></figure>
        <div class="te-figbarra"><button type="button" class="te-zoom" aria-label="Ampliar la figura">${ICONO_LUPA}</button></div></div>
        <p class="lector" id="te-alt"></p>`;
    const vozHTML = `<div class="te-voz">
          <div class="mascota" data-mascota data-curso="${esc(c.id)}" aria-hidden="true"></div>
          <p class="te-dice" role="status"><b>${esc(per.nombre)}</b> <span></span></p>
        </div>`;

    if (ficha) { $app.innerHTML = cab + vistaFicha(); conectarLupas($app); vigilar($app.querySelector('.te-fichas')); return; }
    if (glosa) { $app.innerHTML = cab + vistaGlosario(); return conectarGlosario(); }
    if (lab) { $app.innerHTML = cab + `<section class="card te-idea te-labo" aria-labelledby="te-titulo" data-m="juega">
        <h2 id="te-titulo">Laboratorio</h2>
        <p class="sub te-labo-sub">Juega libre: nada se califica. Guarda casos para compararlos.</p>
        <nav class="te-mesas" aria-label="Mesas del laboratorio"></nav>
        ${figuraHTML}<div class="te-lectura" aria-live="polite"></div><div class="te-zona"></div>
        <div class="te-registro" aria-label="Casos guardados"></div>${vozHTML}</section>`;
      return laboratorio();
    }
    $app.innerHTML = cab + `${def.historia && idea === ideas[0] ? `<details class="card te-historia"><summary>¿De dónde sale esta idea?</summary>
        <p>${esc(def.historia.texto)}</p>${def.historia.pregunta ? `<p class="te-hpreg">${esc(def.historia.pregunta)}</p>` : ''}</details>` : ''}
      <section class="card te-idea" aria-labelledby="te-titulo">
        <h2 id="te-titulo">${esc(idea.titulo)}</h2>
        <ol class="te-momentos" aria-label="Momentos de esta idea">${T.MOMENTOS.map(m => `<li data-m="${m}">${NOMBRE_MOMENTO[m]}</li>`).join('')}</ol>
        ${figuraHTML}
        <div class="te-lectura" aria-live="polite"></div>
        <div class="te-zona"></div>
        ${vozHTML}
        <p class="te-aviso" role="alert"></p>
        <div class="te-accion"><button type="button" class="btn morado ancho te-sig"></button></div>
      </section>`;
    const raiz = $app.querySelector('.te-idea');
    const $ = s => raiz.querySelector(s);
    const fig = $('.te-fig'), zona = $('.te-zona'), lectura = $('.te-lectura'), dice = $('.te-dice span'), aviso = $('.te-aviso'), sig = $('.te-sig');
    const masc = $('[data-mascota]');
    const si = estadoIdea(st, idea.id);
    let lt = null, t0 = Date.now(), caso = null, semilla = 0;

    const pieza = nombre => Kit.piezas[nombre || idea.pieza];
    const dibujar = (dib, nombre) => {
      const P = pieza(nombre);
      fig.innerHTML = P.dibujar(dib.datos, dib.estado || {});
      $('#te-alt').textContent = P.alt(dib.datos);
    };
    // Preferencias del alumno (Perfil): compañero discreto (habla solo para ayudar) y sin festejos (no celebra).
    const prefs = ctx.est.prefs || {};
    const ESENCIAL = new Set(['no-coincide', 'error', 'ayuda', 'fin']);
    const actuar = (que, texto) => {
      const a = T.ACTUACION[que] || T.ACTUACION.juego;
      masc.dataset.expresion = a.expresion;
      const pose = prefs.sinFestejo && (a.pose === 'celebra' || a.pose === 'hito') ? 'reposo' : a.pose;
      try { if (window.Mascota) Mascota.pose(pose); } catch (e) { /* la app nunca espera a la mascota */ }
      if (texto !== undefined) dice.textContent = prefs.discreto && !ESENCIAL.has(que) ? '' : texto;
    };
    const decir = t => { aviso.textContent = t || ''; };
    // Lo que dice el compañero cuando la unidad no trae su propia línea (su voz de la guía, nucleo/teoria.js).
    const voz = k => (per.voces && per.voces[k]) || '';
    // La respuesta a lo que el alumno hizo tiene que quedar a la vista, no debajo de la barra fija de la acción.
    const mostrar = el => requestAnimationFrame(() => el.scrollIntoView({ block: 'nearest', behavior: reducido() ? 'auto' : 'smooth' }));
    const marcarMomento = m => {
      raiz.querySelectorAll('.te-momentos li').forEach(li => {
        const k = T.MOMENTOS.indexOf(li.dataset.m), j = T.MOMENTOS.indexOf(m);
        li.classList.toggle('on', k === j); li.classList.toggle('pasado', k < j);
        if (k === j) li.setAttribute('aria-current', 'step'); else li.removeAttribute('aria-current');
      });
    };
    let juego = null;
    const ir = m => {
      si.momento = m; ctx.guardar(); decir(''); lectura.textContent = ''; raiz.dataset.m = m;
      if (lt) { lt.destruir(); lt = null; }
      if (juego) { juego.destruir(); juego = null; }
      marcarMomento(m);
      ({ juega, predice, mira, regla, 'ahora-tu': ahoraTu })[m]();
      const foco = zona.querySelector('h3,[data-foco]');
      if (foco && document.activeElement && document.activeElement !== document.body) foco.focus({ preventScroll: true });
    };
    const evento = (momento, extra) => ctx.registrar(Object.assign({ tipo: 'teoria', unidad: u.id, idea: idea.id, momento, ms: Date.now() - t0 }, extra));
    conectarLupa(raiz);
    vigilar(zona);
    vigilar($app.querySelector('.te-historia'));

    // 1. Juega: arrastrar sobre la figura o usar − y +; lectura en vivo y conteo de casos distintos.
    function juega() {
      const j = idea.juega;
      actuar('consigna', j.voz || j.consigna);
      juego = montarJuego(j, { fig, zona, lectura, alt: $('#te-alt'), piezaPorDefecto: idea.pieza, alTocar: () => actuar('juego'), minimo: j.minimo });
      sig.textContent = 'Ya probé, sigo';
      sig.onclick = () => {
        const p = juego.probados();
        if (p < j.minimo) { decir(`Prueba ${j.minimo - p === 1 ? 'un caso más' : `${j.minimo - p} casos más`} antes de seguir: cambia un valor.`); (zona.querySelector('input,button') || sig).focus(); return; }
        evento('juego', { casos: p });
        ir('predice');
      };
    }

    // Opciones como botones .alt (los mismos de la práctica): elegir y después «Comprobar».
    function opcionesHTML(ops, nose) {
      return `<div class="alts" role="radiogroup" aria-label="Opciones">${ops.map((o, k) =>
        `<button type="button" class="alt" role="radio" aria-checked="false" data-op="${esc(o.id)}"><span class="letra">${'ABCDE'[k]}</span><span>${E.html(o.texto)}</span></button>`).join('')}
        ${nose ? '<button type="button" class="alt nose" data-op="nose">No sé</button>' : ''}</div>`;
    }
    function elegir(onElegir) {
      let elegida = null;
      zona.querySelector('.alts').addEventListener('click', e => {
        const b = e.target.closest('.alt'); if (!b || b.disabled) return;
        elegida = b.dataset.op;
        zona.querySelectorAll('.alt').forEach(x => { const on = x === b; x.classList.toggle('on', on); if (x.getAttribute('role') === 'radio') x.setAttribute('aria-checked', String(on)); });
        decir('');
        if (onElegir) onElegir(elegida);
      });
      return () => elegida;
    }
    function marcar(ops, elegida) {
      zona.querySelectorAll('.alt').forEach(x => {
        x.disabled = true; x.classList.remove('on');
        const o = ops.find(y => y.id === x.dataset.op);
        if (o && o.correcta) x.classList.add('ok');
        else if (x.dataset.op === elegida) x.classList.add('mal');
      });
    }

    // 2. Predice: una pregunta neutra; al comprobar, la figura muestra lo que pasa de verdad.
    function predice() {
      const p = idea.predice;
      actuar('prediccion', p.voz || voz('prediccion'));
      dibujar(p.dibujo, p.pieza);
      const ya = si.prediccion;
      zona.innerHTML = `<h3 class="te-preg" tabindex="-1">${E.html(p.pregunta)}</h3>${opcionesHTML(p.opciones)}<p class="te-fb" aria-live="polite"></p>`;
      const cual = elegir();
      const resolver = elegida => {
        const o = p.opciones.find(x => x.id === elegida);
        marcar(p.opciones, elegida);
        dibujar(p.revelar, p.pieza);
        if (!ya) { fig.classList.remove('te-revela'); void fig.offsetWidth; fig.classList.add('te-revela'); }
        const fb = zona.querySelector('.te-fb');
        if (o.correcta) { fb.innerHTML = E.html(p.coincide || 'Coincide con lo que pasa.'); actuar('coincide', voz('coincide')); }
        else { fb.innerHTML = `${E.html(o.siFuera)}`; actuar('no-coincide', p.noCoincide || voz('noCoincide')); }
        mostrar(fb);
        sig.textContent = 'Ver por qué';
        sig.onclick = () => ir('mira');
      };
      if (ya) { const b = zona.querySelector(`[data-op="${CSS.escape(ya)}"]`); if (b) b.classList.add('on'); resolver(ya); return; }
      sig.textContent = 'Comprobar';
      sig.onclick = () => {
        const e = cual();
        if (!e) { decir('Elige una opción para comprobar.'); zona.querySelector('.alt').focus(); return; }
        const o = p.opciones.find(x => x.id === e);
        si.prediccion = e; ctx.guardar();
        evento('prediccion', { opcion: e, correcta: !!o.correcta, error: o.error || null });
        resolver(e);
      };
    }

    // 3. Mira: la explicación es una línea de tiempo de la figura (la del kit, la misma de la práctica).
    function mira() {
      const m = idea.mira;
      actuar('mira', m.voz || voz('mira'));
      zona.innerHTML = `<h3 class="lector" tabindex="-1">Mira</h3><div class="te-tiempo"></div><div class="te-paso" aria-live="polite"></div>`;
      const P = pieza(m.pieza);
      $('#te-alt').textContent = P.alt(m.datos);
      lt = Kit.lineaTiempo.montar(zona.querySelector('.te-tiempo'), {
        pieza: P, datos: m.datos, pasos: m.pasos, base: m.base, figura: fig, pie: zona.querySelector('.te-paso'), inicio: 1,
        textoPaso: paso => `<p>${E.html(paso.texto)}</p>${paso.ecuacion ? `<p class="te-ec">${E.html(paso.ecuacion)}</p>` : ''}`,
      });
      sig.textContent = 'Ver la regla';
      sig.onclick = () => ir('regla');
    }

    // 4. La regla: texto corto, ecuación con el hilo de color y la condición que la hace verdadera.
    function regla() {
      const r = idea.regla, m = idea.mira;
      actuar('regla', r.voz || voz('regla'));
      const P = pieza(m.pieza);
      fig.innerHTML = P.dibujar(m.datos, Object.assign({}, m.base || {}, m.pasos[m.pasos.length - 1].estado || {}));
      $('#te-alt').textContent = P.alt(m.datos);
      zona.innerHTML = reglaHTML(r, true);
      sig.textContent = 'Ahora tú';
      sig.onclick = () => ir('ahora-tu');
    }

    // 5. Ahora tú: un caso nuevo (semilla), sin la ayuda del juego. «Otro caso» da otro; se puede pedir ayuda con «No sé».
    function ahoraTu() {
      const a = idea.ahoraTu;
      semilla = (si.semilla || 0);
      const nuevo = () => {
        caso = a.generar(semilla);
        const ops = T.barajar(caso.opciones, semilla + 7);
        actuar('ahora-tu', a.voz || voz('ahora'));
        if (caso.dibujo) dibujar(caso.dibujo, a.pieza); else { fig.innerHTML = ''; $('#te-alt').textContent = ''; }
        zona.innerHTML = `<h3 class="te-preg" tabindex="-1">${E.html(caso.pregunta)}</h3>${opcionesHTML(ops, true)}<div class="te-fb" aria-live="polite"></div>`;
        const cual = elegir();
        sig.textContent = 'Comprobar';
        sig.onclick = () => {
          const e = cual();
          if (!e) { decir('Elige una opción, o «No sé» para ver cómo se resuelve.'); zona.querySelector('.alt').focus(); return; }
          const o = ops.find(x => x.id === e), bien = !!(o && o.correcta);
          marcar(ops, e);
          if (caso.solucion.dibujo) dibujar(caso.solucion.dibujo, a.pieza);
          const fb = zona.querySelector('.te-fb');
          fb.innerHTML = `${o && !bien ? `<p>${E.html(o.siFuera)}</p>` : ''}<p class="te-sol">${E.html(caso.solucion.texto)}</p>${caso.solucion.ecuacion ? `<p class="te-ec">${E.html(caso.solucion.ecuacion)}</p>` : ''}
            ${si.hecha || bien ? '<button type="button" class="btn borde te-otro">Otro caso</button>' : ''}`;
          // Ayuda graduada: el primer error trae su explicación y la solución; dos seguidos (o «No sé» dos veces)
          // cambian la ayuda: volver a la explicación paso a paso o jugar libre en el laboratorio, sin castigo.
          si.seguidos = bien ? 0 : (si.seguidos || 0) + 1;
          if (si.seguidos >= 2) {
            actuar('ayuda', voz('ayuda2'));
            fb.insertAdjacentHTML('beforeend', `<div class="te-ayuda2"><button type="button" class="btn borde" data-ir="mira">Volver a la explicación</button>
              <a class="btn borde" href="#/unidad/${esc(u.id)}/teoria/laboratorio">Jugar en el laboratorio</a></div>`);
            fb.querySelector('[data-ir="mira"]').onclick = () => ir('mira');
          } else actuar(e === 'nose' ? 'ayuda' : bien ? 'acierto' : 'error', voz(e === 'nose' ? 'nose' : bien ? 'acierto' : 'error'));
          mostrar(fb);
          evento('ahora-tu', { opcion: e, correcta: bien, error: (o && o.error) || null, nose: e === 'nose', semilla });
          si.semilla = ++semilla;
          if (bien) si.aciertos = (si.aciertos || 0) + 1;
          if (bien && !si.hecha) { si.hecha = true; ctx.marcarDia(); }
          ctx.guardar();
          if (fb.querySelector('.te-otro')) fb.querySelector('.te-otro').onclick = nuevo;
          const k = ideas.indexOf(idea), siguiente = ideas[k + 1];
          if (si.hecha) {
            sig.textContent = siguiente ? 'Siguiente idea' : 'Ver la ficha de repaso';
            sig.onclick = () => { location.hash = `#/unidad/${u.id}/teoria/${siguiente ? siguiente.id : 'ficha'}`; };
            if (!siguiente && ideas.every(i => hecha(st, i.id))) { actuar('fin', voz('fin')); evento('fin', {}); }
          } else { sig.textContent = 'Otro caso'; sig.onclick = nuevo; }
        };
      };
      nuevo();
    }

    // Arranque: el momento guardado (si ya predijo, no vuelve a predecir desde cero).
    actuar('llegada', idea.juega.voz || idea.juega.consigna);
    // Idea acertada en la prueba de entrada y sin empezar: va directo a la regla, con la opción de jugar igual.
    const yaSabia = sabidas.has(idea.id) && !si.hecha && !si.prediccion && (si.momento || 'juega') === 'juega';
    if (yaSabia) {
      const aviso = document.createElement('p');
      aviso.className = 'te-calibra';
      aviso.innerHTML = 'En la prueba de entrada acertaste esta idea: ve a la regla y a «Ahora tú». <button type="button" class="btn borde">Jugar desde el inicio</button>';
      raiz.insertBefore(aviso, raiz.querySelector('.te-momentos').nextSibling);
      aviso.querySelector('button').onclick = () => { aviso.remove(); ir('juega'); };
    }
    ir(si.hecha || yaSabia ? 'regla' : si.momento || 'juega');

    // ---------- Piezas compartidas por las ideas y el laboratorio ----------
    function reglaHTML(r, foco) {
      return `<div class="te-regla"${foco ? ' data-foco tabindex="-1"' : ''}><p class="te-rtx">${esc(r.texto)}</p>
        ${r.ecuacion ? `<p class="te-ec te-ec-grande">${E.html(r.ecuacion)}</p>` : ''}
        <p class="te-cond"><b>Vale si</b> ${esc(String(r.condicion).replace(/^si\s+/i, ''))}</p></div>`;
    }

    // Glosario del tema: las palabras nuevas de esta unidad, las que vienen de otras y una búsqueda en todo el curso.
    function vistaGlosario() {
      const propias = aqui.filter(e => e.en === u.id), otras = aqui.filter(e => e.en !== u.id);
      const item = e => `<article class="te-glo-item">
          <h3>${esc(e.termino)}${e.simbolo ? ` <span class="te-glo-sim ec-letra">${esc(e.simbolo)}</span>` : ''}</h3>
          <p>${esc(e.def)}</p>
          ${e.medida ? `<p class="sub">Se mide en ${esc(e.medida)}.</p>` : ''}
          ${e.ejemplo ? `<p class="te-glosa-e"><span>Ejemplo</span> ${esc(e.ejemplo)}</p>` : ''}
          ${e.en !== u.id ? `<p class="sub te-glo-de">${esc(origen(e))}</p>` : ''}</article>`;
      return `<section class="card te-glo" aria-labelledby="te-glo-t">
          <h2 id="te-glo-t">Glosario del tema</h2>
          <p class="sub">Las palabras de este tema, dichas en simple. En la teoría, toca una palabra subrayada para ver qué significa.</p>
          ${propias.length ? `<h3 class="te-glo-sec">Nuevas en este tema · ${propias.length}</h3>${propias.map(item).join('')}` : ''}
          ${otras.length ? `<h3 class="te-glo-sec">Vienen de otros temas · ${otras.length}</h3>${otras.map(item).join('')}` : ''}
          ${aqui.length ? '' : '<p>Este tema todavía no tiene glosario.</p>'}
        </section>
        <section class="card te-glo" aria-labelledby="te-glo-b">
          <h2 id="te-glo-b">Buscar en todo ${esc(c.nombre)}</h2>
          <label class="sub" for="te-glo-q">Escribe una palabra que no entiendas</label>
          <input id="te-glo-q" type="search" class="te-glo-q" autocomplete="off" spellcheck="false">
          <div class="te-glo-res" role="status"></div>
        </section>`;
    }
    function conectarGlosario() {
      const q = $app.querySelector('.te-glo-q'), res = $app.querySelector('.te-glo-res');
      const pintarRes = () => {
        const k = G ? G.clave(q.value) : '';
        if (!k) { res.innerHTML = `<p class="sub">${entradas.length} palabras en el glosario de ${esc(c.nombre)}.</p>`; return; }
        const hall = entradas.filter(e => G.clave(e.termino).includes(k) || e.formas.some(f => G.clave(f).includes(k)))
          .concat(entradas.filter(e => !G.clave(e.termino).includes(k) && G.clave(e.def).includes(k))).slice(0, 20);
        res.innerHTML = hall.length ? hall.map(e => `<article class="te-glo-item"><h3>${esc(e.termino)}</h3><p>${esc(e.def)}</p>
            <p class="sub te-glo-de">${e.en === u.id ? 'De este tema' : `Del tema «${esc(e.enNombre)}»`}</p></article>`).join('')
          : '<p>Esa palabra no está en el glosario de este curso todavía. Pregúntale a tu profesor y anótala.</p>';
      };
      q.addEventListener('input', pintarRes);
      pintarRes();
    }

    function vistaFicha() {
      return `<section class="te-fichas">${ideas.map((i, k) => hecha(st, i.id)
        ? `<article class="card te-fic"><h2>${k + 1}. ${esc(i.titulo)}</h2>
            <div class="te-figcaja"><figure class="kit-figura te-fig te-fig-chica">${Kit.piezas[i.mira.pieza || i.pieza].dibujar(i.mira.datos, Object.assign({}, i.mira.base || {}, i.mira.pasos[i.mira.pasos.length - 1].estado || {}))}</figure>
            <div class="te-figbarra"><button type="button" class="te-zoom" aria-label="Ampliar la figura de ${esc(i.titulo)}">${ICONO_LUPA}</button></div></div>
            ${reglaHTML(i.regla)}</article>`
        : `<article class="card te-fic pendiente"><h2>${k + 1}. ${esc(i.titulo)}</h2>
            <p class="sub">Se abre al terminar esta idea: primero juegas y predices.</p>
            <a class="btn borde" href="#/unidad/${esc(u.id)}/teoria/${esc(i.id)}">Ir a esta idea ›</a></article>`).join('')}</section>`;
    }

    // Laboratorio: elegir una mesa, jugar sin preguntas y guardar hasta 4 casos para compararlos lado a lado.
    /*
     * Laboratorio con colección propia (pedido de Gerson y de los «8 alumnos», 15 nov). Los casos guardados viven en
     * est.coleccion (este celular; con cuenta viajan con el estado, sin reglas de unión todavía: docs/recorrido.md):
     *   { id, unidad, mesa, valores, nombre, fecha, version }
     * La figura se reconstruye siempre con el motor (mesa.dibujo(valores)), nunca se guarda el dibujo. Tope: 6 por mesa
     * y 40 en total; lleno, se pide elegir cuál reemplazar. Quitar deja «Deshacer» en el mismo lugar.
     */
    function laboratorio() {
      const raizL = $app.querySelector('.te-labo');
      const q = s => raizL.querySelector(s);
      const mesas = mesasDe(def);
      const nav = q('.te-mesas'), figL = q('.te-fig'), zonaL = q('.te-zona'), regL = q('.te-registro');
      const mascL = q('[data-mascota]'), diceL = q('.te-dice span');
      try { if (window.Mascota) Mascota.pose('reposo'); } catch (e) { /* nada */ }
      mascL.dataset.expresion = 'E9';
      diceL.textContent = 'Aquí no hay preguntas. Prueba casos raros y guarda los que te gusten.';
      conectarLupa(raizL);
      vigilar(zonaL);
      st.lab = st.lab || {};
      st.lab.logradas = st.lab.logradas || {};
      const est = ctx.est;
      est.coleccion = Array.isArray(est.coleccion) ? est.coleccion : [];
      const MAX_MESA = 6, MAX_TOTAL = 40;
      const pedido = sessionStorage.getItem('abrir-caso'); sessionStorage.removeItem('abrir-caso');
      const casoPedido = pedido && est.coleccion.find(x => x.id === pedido && x.unidad === u.id);
      let actual = mesas.find(m => m.id === (casoPedido ? casoPedido.mesa : st.lab.mesa)) || mesas[0], jg = null, quitado = null, reemplazar = false;
      const t0L = Date.now();
      const deMesa = () => est.coleccion.filter(x => x.unidad === u.id && x.mesa === actual.id);
      const lecturaDe = v => { try { return actual.lectura ? E.html(actual.lectura(v)) : ''; } catch (e) { return ''; } };
      const dibujoDe = v => { const P = Kit.piezas[actual.pieza]; const d = actual.dibujo(v); return P.dibujar(d.datos, d.estado || {}); };
      const pintarNav = () => { nav.innerHTML = mesas.map(m => `<button type="button" class="te-ficha-op" data-mesa="${esc(m.id)}" aria-pressed="${m === actual}">${esc(m.titulo)}</button>`).join(''); };
      // Invitaciones: un reto a la vez; su `logrado(valores, guardados)` lo comprueba el motor de la mesa (regla 1).
      const logradas = () => st.lab.logradas[actual.id] || (st.lab.logradas[actual.id] = []);
      const invK = () => { const inv = actual.invitaciones || []; return inv.length ? (st.lab.inv || 0) % inv.length : -1; };
      const textoInv = x => (typeof x === 'string' ? x : x.texto);
      const invitacion = () => {
        const inv = actual.invitaciones || [], k = invK();
        if (k < 0) return '';
        const ya = logradas().includes(k), cuenta = `${logradas().length} de ${inv.length}`;
        return `<div class="te-invita${ya ? ' logrado' : ''}" role="status"><p><span class="te-invita-etq">${ya ? '✓ Lo lograste' : 'Reto'} · ${cuenta}</span>
          <span class="te-invita-t">${esc(textoInv(inv[k]))}</span></p>
          ${inv.length > 1 ? '<button type="button" class="btn borde te-otra-idea">Otro reto</button>' : ''}</div>`;
      };
      const comprobarInv = v => {
        const inv = actual.invitaciones || [], k = invK();
        if (k < 0 || logradas().includes(k) || typeof inv[k] !== 'object' || typeof inv[k].logrado !== 'function') return;
        let ok = false;
        try { ok = inv[k].logrado(v, deMesa().map(x => x.valores)) === true; } catch (e) { ok = false; }
        if (!ok) return;
        logradas().push(k); ctx.guardar();
        const p = zonaL.querySelector('.te-invita'); if (p) p.outerHTML = invitacion();
        diceL.textContent = inv[k].bien || '¡Lo lograste!';
        const prefs = ctx.est.prefs || {};
        mascL.dataset.expresion = 'E7';
        try { if (window.Mascota) Mascota.pose(prefs.sinFestejo ? 'reposo' : 'celebra'); } catch (e) { /* nada */ }
        ctx.registrar({ tipo: 'teoria', unidad: u.id, idea: actual.id, momento: 'invitacion', invitacion: k, ms: Date.now() - t0L });
      };
      const pintarRegistro = () => {
        const casos = deMesa();
        regL.innerHTML = `${quitado ? `<p class="te-deshacer" role="status">Quitaste «${esc(quitado.nombre)}». <button type="button" class="btn borde" data-deshacer>Deshacer</button></p>` : ''}
          ${casos.length ? `<p class="te-etq">Tus casos de esta mesa · ${casos.length} de ${MAX_MESA}</p>
          <div class="te-casos-g">${casos.map(cs => `<figure class="te-caso${reemplazar ? ' elegir' : ''}">
              <div class="kit-figura">${dibujoDe(cs.valores)}</div>
              <figcaption><input class="te-nombre" data-renombrar="${esc(cs.id)}" value="${esc(cs.nombre)}" aria-label="Nombre del caso" maxlength="40"><span class="te-caso-l">${lecturaDe(cs.valores)}</span></figcaption>
              <div class="te-caso-acc">${reemplazar ? `<button type="button" class="btn morado" data-reemplazar="${esc(cs.id)}">Reemplazar este</button>`
                : `<button type="button" class="btn borde" data-abrir-caso="${esc(cs.id)}">Abrir</button><button type="button" class="btn borde" data-quitar="${esc(cs.id)}" aria-label="Quitar ${esc(cs.nombre)}">Quitar</button>`}</div>
            </figure>`).join('')}</div>` : '<p class="sub">Los casos que guardes quedan aquí, con su nombre, para volver a ellos otro día.</p>'}`;
      };
      const guardarCaso = (sobre) => {
        const v = jg.valores(), n = est.coleccion.filter(x => x.unidad === u.id && x.mesa === actual.id).length;
        const caso = { id: 'c' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6), unidad: u.id, mesa: actual.id, valores: v,
          nombre: `Caso ${n + 1}`, fecha: new Date().toLocaleDateString('en-CA'), version: def.version };
        if (sobre) { const k = est.coleccion.findIndex(x => x.id === sobre); est.coleccion.splice(k, 1, Object.assign(caso, { nombre: est.coleccion[k].nombre })); }
        else est.coleccion.push(caso);
        reemplazar = false; quitado = null; ctx.guardar();
        pintarRegistro();
        const aviso = q('.te-guardado'); if (aviso) aviso.textContent = `«${caso.nombre}» quedó guardado en este celular.`;
        diceL.textContent = 'Quedó guardado. Ponle nombre si quieres.';
        ctx.registrar({ tipo: 'teoria', unidad: u.id, idea: actual.id, momento: 'laboratorio', casos: deMesa().length, ms: Date.now() - t0L });
        comprobarInv(v);
      };
      const abrir = (m, valores) => {
        if (jg) jg.destruir();
        actual = m; st.lab.mesa = m.id; ctx.guardar(); quitado = null; reemplazar = false;
        pintarNav();
        jg = montarJuego(m, { fig: figL, zona: zonaL, lectura: q('.te-lectura'), alt: $app.querySelector('#te-alt'), piezaPorDefecto: m.pieza, alTocar: () => {}, valores, reiniciar: true,
          alCambiar: v => comprobarInv(v) });
        zonaL.insertAdjacentHTML('afterbegin', invitacion());
        zonaL.insertAdjacentHTML('beforeend', '<div class="te-labo-acc"><button type="button" class="btn morado te-guardar">Guardar este caso</button></div><p class="sub te-guardado" role="status"></p>');
        pintarRegistro();
      };
      nav.addEventListener('click', e => { const b = e.target.closest('[data-mesa]'); if (b) abrir(mesas.find(m => m.id === b.dataset.mesa)); });
      zonaL.addEventListener('click', e => {
        if (e.target.closest('.te-otra-idea')) {
          // El siguiente reto que falta; si ya están todos, el siguiente sin más.
          const inv = actual.invitaciones || [], hechas = logradas();
          let k = invK();
          for (let n = 0; n < inv.length; n++) { k = (k + 1) % inv.length; if (!hechas.includes(k) || hechas.length >= inv.length) break; }
          st.lab.inv = k; ctx.guardar();
          const p = zonaL.querySelector('.te-invita'); if (p) p.outerHTML = invitacion();
          comprobarInv(jg.valores());
          return;
        }
        if (!e.target.closest('.te-guardar')) return;
        if (deMesa().length >= MAX_MESA || est.coleccion.length >= MAX_TOTAL) {
          reemplazar = true; pintarRegistro();
          q('.te-guardado').textContent = deMesa().length >= MAX_MESA ? `Ya tienes ${MAX_MESA} casos en esta mesa: elige cuál reemplazar.` : 'Tu colección está llena: elige cuál reemplazar.';
          return;
        }
        guardarCaso();
      });
      regL.addEventListener('click', e => {
        const ab = e.target.closest('[data-abrir-caso]'), qu = e.target.closest('[data-quitar]'), re = e.target.closest('[data-reemplazar]'), de = e.target.closest('[data-deshacer]');
        if (ab) { const cs = est.coleccion.find(x => x.id === ab.dataset.abrirCaso); jg.fijar(cs.valores); diceL.textContent = `Volviste a «${cs.nombre}».`; figL.scrollIntoView({ block: 'nearest' }); }
        if (qu) { const k = est.coleccion.findIndex(x => x.id === qu.dataset.quitar); quitado = Object.assign({ k }, est.coleccion[k]); est.coleccion.splice(k, 1); ctx.guardar(); pintarRegistro(); const d = regL.querySelector('[data-deshacer]'); if (d) d.focus(); }
        if (re) guardarCaso(re.dataset.reemplazar);
        if (de && quitado) { const { k, ...cs } = quitado; est.coleccion.splice(Math.min(k, est.coleccion.length), 0, cs); quitado = null; ctx.guardar(); pintarRegistro(); }
      });
      regL.addEventListener('change', e => {
        const r = e.target.closest('[data-renombrar]'); if (!r) return;
        const cs = est.coleccion.find(x => x.id === r.dataset.renombrar);
        if (cs) { cs.nombre = r.value.trim().slice(0, 40) || cs.nombre; r.value = cs.nombre; ctx.guardar(); }
      });
      abrir(actual, casoPedido ? casoPedido.valores : undefined);
      if (casoPedido) diceL.textContent = `Tu caso «${casoPedido.nombre}» está como lo dejaste.`;
    }

    // El juego: controles con − y +, barra y opciones; manijas sobre la figura; lectura en vivo; casos distintos probados.
    function montarJuego(j, o) {
      const { fig: f, zona: z, lectura: lec } = o;
      const vals = Object.assign(T.inicio(j), o.valores || {}), probados = new Set();
      const ctr = j.controles || [], arr = j.arrastres || [];
      z.innerHTML = `<h3 class="lector" tabindex="-1">Juega</h3><p class="te-consigna">${esc(j.consigna)}</p>
        ${arr.length ? '<p class="te-pista"><span class="te-pista-m" aria-hidden="true"></span>Arrastra los círculos de la figura, o usa − y +.</p>' : ''}
        <div class="te-controles">${ctr.map(control).join('')}</div>
        ${ctr.length ? '<button type="button" class="btn borde te-reinicio">Volver al inicio</button>' : ''}
        ${o.minimo ? '<p class="sub te-casos" aria-live="polite"></p>' : ''}`;
      let tocado = false;
      const tocar = () => { if (!tocado) { tocado = true; o.alTocar(); } };
      const pintarJ = (contar = true) => {
        const P = Kit.piezas[j.pieza || o.piezaPorDefecto], dib = j.dibujo(vals);
        f.innerHTML = P.dibujar(dib.datos, dib.estado || {});
        if (o.alt) o.alt.textContent = P.alt(dib.datos);
        f.classList.toggle('con-manijas', arr.length > 0);
        // Una figura muy alta no se queda fija al bajar: taparía la consigna y los controles.
        const caja = f.closest('.te-figcaja');
        if (caja) requestAnimationFrame(() => caja.classList.toggle('alta', f.getBoundingClientRect().height > innerHeight * 0.42));
        ponerManijas();
        if (j.lectura) lec.innerHTML = E.html(j.lectura(vals));
        if (contar) probados.add(JSON.stringify(vals));
        if (contar && o.alCambiar) o.alCambiar(Object.assign({}, vals));
        const cas = z.querySelector('.te-casos');
        if (cas) cas.textContent = probados.size < o.minimo ? `Casos probados: ${probados.size} de ${o.minimo}` : `Casos probados: ${probados.size}`;
        for (const c of ctr) {
          const el = z.querySelector(`[data-c="${c.id}"]`);
          if (!el) continue;
          if (c.opciones) el.querySelectorAll('button').forEach(b => b.setAttribute('aria-pressed', String(String(vals[c.id]) === b.dataset.v)));
          else { el.querySelector('input').value = vals[c.id]; el.querySelector('output').innerHTML = valorControl(c, vals[c.id]); }
        }
      };
      // Manijas: un anillo visible de 18 px dentro de una zona de toque de 44 px, en coordenadas de la figura.
      function ponerManijas() {
        const svg = f.querySelector('svg');
        if (!svg || !arr.length) return;
        const NS = 'http://www.w3.org/2000/svg';
        for (const a of arr) {
          const p = a.donde(vals);
          const g = document.createElementNS(NS, 'g');
          g.setAttribute('class', `te-manija${arrastrando && arrastrando.a === a ? ' activa' : ''}`);
          g.setAttribute('data-a', a.id);
          g.setAttribute('transform', `translate(${p.x} ${p.y})`);
          if (a.color) g.style.setProperty('--manija', `var(--${a.color})`);
          g.innerHTML = '<circle class="te-manija-toque" r="22"/><circle class="te-manija-halo" r="13"/><circle class="te-manija-anillo" r="9"/>';
          svg.appendChild(g);
        }
      }
      let arrastrando = null;
      const punto = e => {
        const svg = f.querySelector('svg'), m = svg && svg.getScreenCTM();
        if (!m) return null;
        const pt = new DOMPoint(e.clientX, e.clientY).matrixTransform(m.inverse());
        return { x: pt.x, y: pt.y };
      };
      const aplicar = cambio => {
        let cambio_ = false;
        for (const [k, v] of Object.entries(cambio || {})) {
          const c = ctr.find(x => x.id === k); if (!c) continue;
          const nv = T.ajustar(c, v);
          if (nv !== vals[k]) { vals[k] = nv; cambio_ = true; }
        }
        return cambio_;
      };
      const abajo = e => {
        const g = e.target.closest && e.target.closest('.te-manija'); if (!g) return;
        const a = arr.find(x => x.id === g.getAttribute('data-a')); if (!a) return;
        e.preventDefault();
        arrastrando = { a, id: e.pointerId };
        f.setPointerCapture(e.pointerId);
        f.classList.add('arrastrando');
        g.classList.add('activa');
        tocar();
      };
      const mueve = e => {
        if (!arrastrando || e.pointerId !== arrastrando.id) return;
        const p = punto(e); if (!p) return;
        if (aplicar(arrastrando.a.mover(p, Object.assign({}, vals)))) pintarJ(false);
      };
      const arriba = e => {
        if (!arrastrando || e.pointerId !== arrastrando.id) return;
        arrastrando = null; f.classList.remove('arrastrando');
        pintarJ(true);
      };
      // Con el dedo sobre una manija, la página no se desplaza (sí en el resto de la figura).
      const sinScroll = e => { if (e.target.closest && e.target.closest('.te-manija')) e.preventDefault(); };
      f.addEventListener('pointerdown', abajo); f.addEventListener('pointermove', mueve);
      f.addEventListener('pointerup', arriba); f.addEventListener('pointercancel', arriba);
      f.addEventListener('touchstart', sinScroll, { passive: false });
      const enInput = e => {
        const el = e.target.closest('[data-c]'); if (!el) return;
        const c = ctr.find(x => x.id === el.dataset.c);
        vals[c.id] = T.ajustar(c, +e.target.value); pintarJ(); tocar();
      };
      const enClick = e => {
        if (e.target.closest('.te-reinicio')) { Object.assign(vals, T.inicio(j)); pintarJ(); return; }
        const b = e.target.closest('button[data-paso],button[data-v]'); if (!b) return;
        const el = b.closest('[data-c]'); const c = ctr.find(x => x.id === el.dataset.c);
        vals[c.id] = c.opciones ? c.opciones.find(x => String(x.valor) === b.dataset.v).valor : T.ajustar(c, vals[c.id] + (+b.dataset.paso) * c.paso);
        pintarJ(); tocar();
      };
      z.addEventListener('input', enInput); z.addEventListener('click', enClick);
      if (typeof j.montar === 'function') j.montar(z.querySelector('.te-controles'), { valores: vals, pintar: v => { Object.assign(vals, v); pintarJ(); tocar(); } });
      pintarJ();
      return {
        probados: () => probados.size,
        valores: () => Object.assign({}, vals),
        fijar(v) { for (const c of ctr) if (v && v[c.id] !== undefined) vals[c.id] = T.ajustar(c, v[c.id]); pintarJ(); },
        destruir() {
          f.removeEventListener('pointerdown', abajo); f.removeEventListener('pointermove', mueve);
          f.removeEventListener('pointerup', arriba); f.removeEventListener('pointercancel', arriba);
          f.removeEventListener('touchstart', sinScroll); f.classList.remove('con-manijas', 'arrastrando');
          z.removeEventListener('input', enInput); z.removeEventListener('click', enClick);
        },
      };
    }
    function control(c) {
      if (c.opciones) return `<div class="te-control te-opc" data-c="${esc(c.id)}" role="group" aria-label="${esc(c.etiqueta)}"><span class="te-etq">${esc(c.etiqueta)}</span>
        ${c.opciones.map(o => `<button type="button" class="te-ficha-op" data-v="${esc(o.valor)}" aria-pressed="false">${esc(o.texto)}</button>`).join('')}</div>`;
      return `<div class="te-control" data-c="${esc(c.id)}">
        <label class="te-etq" for="te-c-${esc(c.id)}">${c.color ? `<span class="var ${esc(c.color)}">${esc(c.etiqueta)}</span>` : esc(c.etiqueta)}</label>
        <button type="button" class="te-mm" data-paso="-1" aria-label="Menos ${esc(c.etiqueta)}">−</button>
        <input id="te-c-${esc(c.id)}" type="range" min="${c.min}" max="${c.max}" step="${c.paso}" value="${c.inicio}">
        <button type="button" class="te-mm" data-paso="1" aria-label="Más ${esc(c.etiqueta)}">+</button>
        <output for="te-c-${esc(c.id)}"></output></div>`;
    }
    function valorControl(c, v) { return `${Kit.formatear(v, c.decimales === undefined ? 2 : c.decimales)}${c.unidad ? ` ${esc(c.unidad)}` : ''}`; }

    // Botón de lupa de cada figura: amplía lo que se ve en ese momento.
    function conectarLupa(el) {
      el.addEventListener('click', e => {
        const b = e.target.closest('.te-zoom'); if (!b) return;
        const caja = b.closest('.te-figcaja'), f = caja && caja.querySelector('.te-fig');
        if (!f || !f.querySelector('svg')) return;
        abrirLupa(f.innerHTML, (f.querySelector('svg').getAttribute('aria-label') || ''), b);
      });
    }
    function conectarLupas(el) { conectarLupa(el); }
  }


  /*
   * Prueba de entrada del tema (decisión de Gerson, 14 nov): obligatoria antes de la teoría, los ejercicios y el
   * simulacro de cada unidad; el laboratorio queda libre. Una pregunta por idea, sacada de su «Ahora tú» con una semilla
   * propia (500 + k), sin retroalimentación y con «No sé». El resultado calibra la teoría: las ideas acertadas empiezan
   * por la regla. Se puede salir y volver: queda en est.temas[unidad].enCurso. Eventos: «tema-item» y «tema».
   */
  function entrada(ctx, u) {
    const { $app, esc } = ctx;
    const c = ctx.cat.cursos.find(x => x.unidades.some(y => y.id === u.id));
    $app.innerHTML = `<div class="card te-cargando" role="status">Preparando la prueba del tema…</div>`;
    const h = location.hash;
    cargarUnidad(u).then(def => { if (location.hash === h) pintarEntrada(ctx, c, u, def); },
      () => { if (location.hash === h) $app.innerHTML = `<div class="card"><h2>No se pudo abrir la prueba</h2><p>Revisa tu conexión y vuelve a intentarlo.</p><a class="btn morado" href="#/unidad/${esc(u.id)}">Volver a la unidad</a></div>`; });
  }

  function pintarEntrada(ctx, c, u, def) {
    const { $app, esc, est } = ctx;
    const T = window.Teoria, E = window.Ecuacion;
    est.temas = est.temas || {};
    const tm = est.temas[u.id] = est.temas[u.id] || {};
    const destino = sessionStorage.getItem('tema-destino-' + u.id) || `#/unidad/${u.id}/teoria`;
    const per = T.PERSONAJES[c.id] || { nombre: 'Tu compañero' };
    // Las preguntas salen siempre iguales para este alumno y esta unidad (semilla fija): retomar no las cambia.
    const preguntas = def.ideas.map((idea, k) => {
      const caso = idea.ahoraTu.generar(500 + k);
      return { idea, caso, ops: T.barajar(caso.opciones, 900 + k) };
    });
    if (tm.entrada) { location.hash = destino; return; }
    const en = tm.enCurso = tm.enCurso || { i: 0, resp: preguntas.map(() => null) };
    const t0 = Date.now();
    let tP = Date.now();
    const cab = ctx.cab('Prueba del tema');

    function intro() {
      $app.innerHTML = `${cab}<section class="card te-entrada">
        <span class="etq-p">Antes de estudiar ${esc(u.nombre)}</span>
        <h2>${preguntas.length} preguntas cortas, una por idea</h2>
        <ul class="temas-l"><li>No es nota: sirve para ajustar el tema a lo que ya sabes.</li>
          <li>Lo que aciertes empieza directo en la regla; lo demás, jugando.</li>
          <li>Si no sabes, marca «No sé»: ayuda más que adivinar.</li>
          <li>Puedes salir y volver: se guarda donde quedaste.</li></ul>
        <p class="sub">El laboratorio de la unidad está libre: puedes jugar ahí antes, si quieres.</p>
        <div class="te-voz"><div class="mascota" data-mascota data-curso="${esc(c.id)}" aria-hidden="true"></div>
          <p class="te-dice"><b>${esc(per.nombre)}</b> <span>${esc((per.voces && per.voces.prediccion) || '')}</span></p></div>
        <div class="acciones-prueba"><button type="button" class="btn morado" id="te-empezar">${en.i || en.resp.some(Boolean) ? `Seguir en la pregunta ${en.i + 1}` : 'Empezar'}</button>
          <a class="btn borde" href="#/unidad/${esc(u.id)}/teoria/laboratorio">Ir al laboratorio</a></div></section>`;
      $app.querySelector('#te-empezar').onclick = () => { tP = Date.now(); pregunta(); };
    }
    function pregunta() {
      const q = preguntas[en.i], ultima = en.i === preguntas.length - 1;
      $app.innerHTML = `${cab}<section class="card te-entrada">
        <div class="ex-puntos" aria-hidden="true">${preguntas.map((_, k) => `<span class="${k === en.i ? 'aqui' : ''}${en.resp[k] ? ' resp' : ''}"></span>`).join('')}</div>
        <div class="etq-p">Pregunta ${en.i + 1} de ${preguntas.length} · ${esc(q.idea.titulo)}</div>
        ${q.caso.dibujo ? `<figure class="te-fig kit-figura">${window.Kit.piezas[q.idea.ahoraTu.pieza || q.idea.pieza].dibujar(q.caso.dibujo.datos, q.caso.dibujo.estado || {})}</figure>` : ''}
        <h3 class="te-preg">${E.html(q.caso.pregunta)}</h3>
        <div class="alts" role="radiogroup" aria-label="Opciones">${q.ops.map((o, k) => `<button type="button" class="alt${en.resp[en.i] === o.id ? ' on' : ''}" role="radio" aria-checked="${en.resp[en.i] === o.id}" data-op="${esc(o.id)}"><span class="letra">${'ABCDE'[k]}</span><span>${E.html(o.texto)}</span></button>`).join('')}
          <button type="button" class="alt nose${en.resp[en.i] === 'nose' ? ' on' : ''}" data-op="nose">No sé</button></div>
        <p class="te-aviso" role="alert"></p>
        <div class="ex-nav"><button type="button" class="btn borde" id="te-ant"${en.i ? '' : ' style="visibility:hidden"'}>‹ Anterior</button>
          <button type="button" class="btn morado" id="te-sig">${ultima ? 'Terminar' : 'Siguiente ›'}</button></div></section>`;
      $app.querySelector('.alts').onclick = e => {
        const b = e.target.closest('.alt'); if (!b) return;
        en.resp[en.i] = b.dataset.op; ctx.guardar();
        $app.querySelectorAll('.alt').forEach(x => { const on = x === b; x.classList.toggle('on', on); if (x.getAttribute('role') === 'radio') x.setAttribute('aria-checked', String(on)); });
        $app.querySelector('.te-aviso').textContent = '';
      };
      $app.querySelector('#te-ant').onclick = () => { en.i--; ctx.guardar(); window.scrollTo(0, 0); pregunta(); };
      $app.querySelector('#te-sig').onclick = () => {
        if (!en.resp[en.i]) { $app.querySelector('.te-aviso').textContent = 'Elige una opción o «No sé».'; return; }
        if (ultima) return terminar();
        en.i++; ctx.guardar(); window.scrollTo(0, 0); pregunta();
      };
    }
    function terminar() {
      const sabidas = [], filas = [];
      let aciertos = 0, nose = 0;
      preguntas.forEach((q, k) => {
        const r = en.resp[k], o = q.ops.find(x => x.id === r), bien = !!(o && o.correcta);
        if (bien) { aciertos++; sabidas.push(q.idea.id); }
        if (r === 'nose') nose++;
        filas.push({ idea: q.idea.id, opcion: r, correcta: bien, error: (o && !bien && o.error) || null });
      });
      // Primero se guarda el resultado y después se registran los eventos: si se corta entre los dos, no se duplica.
      const expuesto = !!((est.vistas || {})[u.id] || ((est.teoria || {})[u.id] || {}).lab);
      tm.entrada = { fecha: new Date().toLocaleDateString('en-CA'), aciertos, total: preguntas.length, nose, sabidas, expuesto };
      delete tm.enCurso; ctx.guardar();
      filas.forEach(f => ctx.registrar(Object.assign({ tipo: 'tema-item', fase: 'entrada', unidad: u.id }, f)));
      ctx.registrar({ tipo: 'tema', fase: 'entrada', unidad: u.id, aciertos, total: preguntas.length, nose, expuesto, ms: Date.now() - t0 });
      $app.innerHTML = `${cab}<section class="card te-entrada">
        <span class="etq-p">Prueba del tema lista</span>
        <h2>${aciertos} de ${preguntas.length} ideas ya las tienes</h2>
        <ul class="te-calib">${def.ideas.map(i => `<li class="${sabidas.includes(i.id) ? 'si' : 'no'}"><span aria-hidden="true">${sabidas.includes(i.id) ? '✓' : '○'}</span> ${esc(i.titulo)} <span class="sub">${sabidas.includes(i.id) ? 'empiezas por la regla' : 'empiezas jugando'}</span></li>`).join('')}</ul>
        <a class="btn morado" href="${esc(destino)}">Seguir</a></section>`;
      sessionStorage.removeItem('tema-destino-' + u.id);
    }
    intro();
  }

  window.Teoria = Object.assign(window.Teoria || {}, { vista, entrada });
})();
