/*
 * Teoría interactiva: la puerta «Teoría» de la unidad (docs/teoria.md). Contrato con app/app.js:
 *   window.Teoria.vista(ctx, unidad)   ctx = { $app, cat, est, esc, guardar, registrar, marcarDia, cab }
 * La unidad del catálogo trae `teoria: { archivo, requiere }`. Aquí se cargan el kit, las piezas y el archivo de la
 * unidad (contenido/teoria/<curso>/<unidad>.js), que se registra con Teoria.unidad({...}) (nucleo/teoria.js).
 *
 * Cada idea recorre cinco momentos: juega → predice → mira → regla → ahora tú. Solo la predicción bloquea (regla 3);
 * antes se juega (decisión 20). El estado vive en est.teoria[unidad]; los eventos «teoria» van a la medición.
 * Rutas: #/unidad/<id>/teoria (la idea en curso), …/teoria/<idea>, …/teoria/laboratorio y …/teoria/ficha.
 *
 * Gesto directo (pedido de Gerson, 14 nov): el juego declara `arrastres`, manijas sobre la figura que el alumno arrastra;
 * cada arrastre mueve controles que también tienen − y + (nunca solo arrastre). La lupa amplía cualquier figura
 * (botones y pellizco). El laboratorio junta mesas de juego libre, sin preguntas, con «Guardar este caso» para comparar.
 */
(function () {
  'use strict';
  const KIT_CSS = '/nucleo/kit/kit.css';
  const BASE = ['/nucleo/kit/kit.js', '/nucleo/kit/trazo.js', '/nucleo/kit/linea-tiempo.js', '/nucleo/ecuacion.js', '/nucleo/teoria.js'];
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
    const sub = decodeURIComponent(location.hash.split('/')[4] || '');   // #/unidad/<id>/teoria/<idea | ficha | laboratorio>
    $app.innerHTML = `<div class="card te-cargando" role="status">Abriendo la teoría…</div>`;
    const h = location.hash;
    cargarUnidad(u).then(def => {
      if (location.hash !== h) return;
      pintar(ctx, c, u, def, sub);
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
  function pintar(ctx, c, u, def, sub) {
    const { $app, esc } = ctx;
    const T = window.Teoria, E = window.Ecuacion, Kit = window.Kit;
    const st = estadoUnidad(ctx, u.id);
    const per = T.PERSONAJES[c.id] || { nombre: 'Tu compañero' };
    const ideas = def.ideas;
    const primeraPendiente = ideas.find(i => !hecha(st, i.id)) || ideas[ideas.length - 1];
    const ficha = sub === 'ficha', lab = sub === 'laboratorio';
    const idea = ficha || lab ? null : ideas.find(i => i.id === sub) || primeraPendiente;
    const n = ideas.filter(i => hecha(st, i.id)).length;

    const chip = (i, k) => {
      const on = idea && i.id === idea.id;
      return `<a class="te-chip${on ? ' on' : ''}${hecha(st, i.id) ? ' hecha' : ''}" href="#/unidad/${esc(u.id)}/teoria/${esc(i.id)}"${on ? ' aria-current="step"' : ''}>
        <span class="te-num" aria-hidden="true">${hecha(st, i.id) ? '✓' : k + 1}</span><span>${esc(i.titulo)}</span>${hecha(st, i.id) ? '<span class="lector"> (terminada)</span>' : ''}</a>`;
    };
    const cab = `${ctx.cab('Teoría')}
      <nav class="te-ideas" aria-label="Ideas de esta unidad">${ideas.map(chip).join('')}
        <a class="te-chip te-lab${lab ? ' on' : ''}" href="#/unidad/${esc(u.id)}/teoria/laboratorio"${lab ? ' aria-current="page"' : ''}>
        <span class="te-num" aria-hidden="true">⚗</span><span>Laboratorio</span></a>
        <a class="te-chip te-ficha${ficha ? ' on' : ''}" href="#/unidad/${esc(u.id)}/teoria/ficha"${ficha ? ' aria-current="page"' : ''}>
        <span class="te-num" aria-hidden="true">≡</span><span>Ficha de repaso</span></a></nav>
      <p class="sub te-avance">${n} de ${ideas.length} ideas terminadas</p>`;

    const figuraHTML = `<div class="te-figcaja"><figure class="te-fig kit-figura" aria-describedby="te-alt"></figure>
        <button type="button" class="te-zoom" aria-label="Ampliar la figura">${ICONO_LUPA}</button></div>
        <p class="lector" id="te-alt"></p>`;
    const vozHTML = `<div class="te-voz">
          <div class="mascota" data-mascota data-curso="${esc(c.id)}" aria-hidden="true"></div>
          <p class="te-dice" role="status"><b>${esc(per.nombre)}</b> <span></span></p>
        </div>`;

    if (ficha) { $app.innerHTML = cab + vistaFicha(); conectarLupas($app); return; }
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
    const actuar = (que, texto) => {
      const a = T.ACTUACION[que] || T.ACTUACION.juego;
      masc.dataset.expresion = a.expresion;
      try { if (window.Mascota) Mascota.pose(a.pose); } catch (e) { /* la app nunca espera a la mascota */ }
      if (texto !== undefined) dice.textContent = texto;
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
          actuar(e === 'nose' ? 'ayuda' : bien ? 'acierto' : 'error', voz(e === 'nose' ? 'nose' : bien ? 'acierto' : 'error'));
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
    ir(si.hecha ? 'regla' : si.momento || 'juega');

    // ---------- Piezas compartidas por las ideas y el laboratorio ----------
    function reglaHTML(r, foco) {
      return `<div class="te-regla"${foco ? ' data-foco tabindex="-1"' : ''}><p class="te-rtx">${esc(r.texto)}</p>
        ${r.ecuacion ? `<p class="te-ec te-ec-grande">${E.html(r.ecuacion)}</p>` : ''}
        <p class="te-cond"><b>Vale si</b> ${esc(String(r.condicion).replace(/^si\s+/i, ''))}</p></div>`;
    }

    function vistaFicha() {
      return `<section class="te-fichas">${ideas.map((i, k) => hecha(st, i.id)
        ? `<article class="card te-fic"><h2>${k + 1}. ${esc(i.titulo)}</h2>
            <div class="te-figcaja"><figure class="kit-figura te-fig te-fig-chica">${Kit.piezas[i.mira.pieza || i.pieza].dibujar(i.mira.datos, Object.assign({}, i.mira.base || {}, i.mira.pasos[i.mira.pasos.length - 1].estado || {}))}</figure>
            <button type="button" class="te-zoom" aria-label="Ampliar la figura de ${esc(i.titulo)}">${ICONO_LUPA}</button></div>
            ${reglaHTML(i.regla)}</article>`
        : `<article class="card te-fic pendiente"><h2>${k + 1}. ${esc(i.titulo)}</h2>
            <p class="sub">Se abre al terminar esta idea: primero juegas y predices.</p>
            <a class="btn borde" href="#/unidad/${esc(u.id)}/teoria/${esc(i.id)}">Ir a esta idea ›</a></article>`).join('')}</section>`;
    }

    // Laboratorio: elegir una mesa, jugar sin preguntas y guardar hasta 4 casos para compararlos lado a lado.
    function laboratorio() {
      const raizL = $app.querySelector('.te-labo');
      const q = s => raizL.querySelector(s);
      const mesas = mesasDe(def);
      const nav = q('.te-mesas'), figL = q('.te-fig'), zonaL = q('.te-zona'), regL = q('.te-registro');
      const mascL = q('[data-mascota]'), diceL = q('.te-dice span');
      try { if (window.Mascota) Mascota.pose('reposo'); } catch (e) { /* nada */ }
      mascL.dataset.expresion = 'E9';
      diceL.textContent = 'Aquí no hay preguntas. Prueba casos raros y compáralos.';
      conectarLupa(raizL);
      st.lab = st.lab || {};
      let actual = mesas.find(m => m.id === st.lab.mesa) || mesas[0], jg = null, guardados = [];
      const t0L = Date.now();
      const pintarNav = () => { nav.innerHTML = mesas.map(m => `<button type="button" class="te-ficha-op" data-mesa="${esc(m.id)}" aria-pressed="${m === actual}">${esc(m.titulo)}</button>`).join(''); };
      const pintarRegistro = () => {
        regL.innerHTML = guardados.length ? `<p class="te-etq">Casos guardados</p><div class="te-casos-g">${guardados.map((g, k) =>
          `<figure class="te-caso"><div class="kit-figura">${g.svg}</div><figcaption>${g.lectura}</figcaption>
            <button type="button" class="te-quitar" data-quitar="${k}" aria-label="Quitar el caso ${k + 1}">×</button></figure>`).join('')}</div>` : '';
      };
      const abrir = m => {
        if (jg) jg.destruir();
        actual = m; st.lab.mesa = m.id; ctx.guardar(); guardados = [];
        pintarNav(); pintarRegistro();
        jg = montarJuego(m, { fig: figL, zona: zonaL, lectura: q('.te-lectura'), alt: $app.querySelector('#te-alt'), piezaPorDefecto: m.pieza, alTocar: () => {} });
        const b = document.createElement('button'); b.type = 'button'; b.className = 'btn borde te-guardar'; b.textContent = 'Guardar este caso';
        zonaL.appendChild(b);
        b.onclick = () => {
          const svg = figL.innerHTML.replace(/<g class="te-manija[\s\S]*?<\/g>/g, '');
          if (guardados.length >= MAX_CASOS) guardados.shift();
          guardados.push({ svg, lectura: q('.te-lectura').innerHTML || esc(JSON.stringify(jg.valores())) });
          pintarRegistro();
          ctx.registrar({ tipo: 'teoria', unidad: u.id, idea: m.id, momento: 'laboratorio', casos: guardados.length, ms: Date.now() - t0L });
        };
      };
      nav.addEventListener('click', e => { const b = e.target.closest('[data-mesa]'); if (b) abrir(mesas.find(m => m.id === b.dataset.mesa)); });
      regL.addEventListener('click', e => { const b = e.target.closest('[data-quitar]'); if (b) { guardados.splice(+b.dataset.quitar, 1); pintarRegistro(); } });
      abrir(actual);
    }

    // El juego: controles con − y +, barra y opciones; manijas sobre la figura; lectura en vivo; casos distintos probados.
    function montarJuego(j, o) {
      const { fig: f, zona: z, lectura: lec } = o;
      const vals = T.inicio(j), probados = new Set();
      const ctr = j.controles || [], arr = j.arrastres || [];
      z.innerHTML = `<h3 class="lector" tabindex="-1">Juega</h3><p class="te-consigna">${esc(j.consigna)}</p>
        ${arr.length ? '<p class="te-pista"><span class="te-pista-m" aria-hidden="true"></span>Arrastra los círculos de la figura, o usa − y +.</p>' : ''}
        <div class="te-controles">${ctr.map(control).join('')}</div>
        ${o.minimo ? '<p class="sub te-casos" aria-live="polite"></p>' : ''}`;
      let tocado = false;
      const tocar = () => { if (!tocado) { tocado = true; o.alTocar(); } };
      const pintarJ = (contar = true) => {
        const P = Kit.piezas[j.pieza || o.piezaPorDefecto], dib = j.dibujo(vals);
        f.innerHTML = P.dibujar(dib.datos, dib.estado || {});
        if (o.alt) o.alt.textContent = P.alt(dib.datos);
        f.classList.toggle('con-manijas', arr.length > 0);
        ponerManijas();
        if (j.lectura) lec.innerHTML = E.html(j.lectura(vals));
        if (contar) probados.add(JSON.stringify(vals));
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

  window.Teoria = Object.assign(window.Teoria || {}, { vista });
})();
