/*
 * Teoría interactiva: la puerta «Teoría» de la unidad (docs/teoria.md). Contrato con app/app.js:
 *   window.Teoria.vista(ctx, unidad)   ctx = { $app, cat, est, esc, guardar, registrar, marcarDia }
 * La unidad del catálogo trae `teoria: { archivo, requiere }`. Aquí se cargan el kit, las piezas y el archivo de la
 * unidad (contenido/teoria/<curso>/<unidad>.js), que se registra con Teoria.unidad({...}) (nucleo/teoria.js).
 *
 * Cada idea recorre cinco momentos: juega → predice → mira → regla → ahora tú. Solo la predicción bloquea (regla 3);
 * antes se juega (decisión 20). El estado vive en est.teoria[unidad]; los eventos «teoria» van a la medición.
 * Rutas: #/unidad/<id>/teoria (la idea en curso), …/teoria/<idea> y …/teoria/ficha (la ficha de repaso).
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
    const sub = decodeURIComponent(location.hash.split('/')[4] || '');   // #/unidad/<id>/teoria/<idea | ficha>
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

  // ---------- Pantalla ----------
  function pintar(ctx, c, u, def, sub) {
    const { $app, esc } = ctx;
    const T = window.Teoria, E = window.Ecuacion, Kit = window.Kit;
    const st = estadoUnidad(ctx, u.id);
    const per = T.PERSONAJES[c.id] || { nombre: 'Tu compañero' };
    const ideas = def.ideas;
    const primeraPendiente = ideas.find(i => !hecha(st, i.id)) || ideas[ideas.length - 1];
    const ficha = sub === 'ficha';
    const idea = ficha ? null : ideas.find(i => i.id === sub) || primeraPendiente;
    const n = ideas.filter(i => hecha(st, i.id)).length;

    const chip = (i, k) => {
      const on = idea && i.id === idea.id;
      return `<a class="te-chip${on ? ' on' : ''}${hecha(st, i.id) ? ' hecha' : ''}" href="#/unidad/${esc(u.id)}/teoria/${esc(i.id)}"${on ? ' aria-current="step"' : ''}>
        <span class="te-num" aria-hidden="true">${hecha(st, i.id) ? '✓' : k + 1}</span><span>${esc(i.titulo)}</span>${hecha(st, i.id) ? '<span class="lector"> (terminada)</span>' : ''}</a>`;
    };
    const cab = `${ctx.cab('Teoría')}
      <nav class="te-ideas" aria-label="Ideas de esta unidad">${ideas.map(chip).join('')}
        <a class="te-chip te-ficha${ficha ? ' on' : ''}" href="#/unidad/${esc(u.id)}/teoria/ficha"${ficha ? ' aria-current="page"' : ''}>
        <span class="te-num" aria-hidden="true">≡</span><span>Ficha de repaso</span></a></nav>
      <p class="sub te-avance">${n} de ${ideas.length} ideas terminadas</p>`;

    if (ficha) { $app.innerHTML = cab + vistaFicha(); return; }
    $app.innerHTML = cab + `${def.historia && idea === ideas[0] ? `<details class="card te-historia"><summary>¿De dónde sale esta idea?</summary>
        <p>${esc(def.historia.texto)}</p>${def.historia.pregunta ? `<p class="te-hpreg">${esc(def.historia.pregunta)}</p>` : ''}</details>` : ''}
      <section class="card te-idea" aria-labelledby="te-titulo">
        <h2 id="te-titulo">${esc(idea.titulo)}</h2>
        <ol class="te-momentos" aria-label="Momentos de esta idea">${T.MOMENTOS.map(m => `<li data-m="${m}">${NOMBRE_MOMENTO[m]}</li>`).join('')}</ol>
        <figure class="te-fig kit-figura" aria-describedby="te-alt"></figure>
        <p class="lector" id="te-alt"></p>
        <div class="te-lectura" aria-live="polite"></div>
        <div class="te-zona"></div>
        <div class="te-voz">
          <div class="mascota" data-mascota data-curso="${esc(c.id)}" aria-hidden="true"></div>
          <p class="te-dice" role="status"><b>${esc(per.nombre)}</b> <span></span></p>
        </div>
        <p class="te-aviso" role="alert"></p>
        <div class="te-accion"><button type="button" class="btn morado ancho te-sig"></button></div>
      </section>`;
    const raiz = $app.querySelector('.te-idea');
    const $ = s => raiz.querySelector(s);
    const fig = $('.te-fig'), zona = $('.te-zona'), lectura = $('.te-lectura'), dice = $('.te-dice span'), aviso = $('.te-aviso'), sig = $('.te-sig');
    const masc = $('[data-mascota]');
    const si = estadoIdea(st, idea.id);
    let lt = null, t0 = Date.now(), vals = T.inicio(idea.juega), probados = new Set(), caso = null, semilla = 0;

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
    const marcarMomento = m => {
      raiz.querySelectorAll('.te-momentos li').forEach(li => {
        const k = T.MOMENTOS.indexOf(li.dataset.m), j = T.MOMENTOS.indexOf(m);
        li.classList.toggle('on', k === j); li.classList.toggle('pasado', k < j);
        if (k === j) li.setAttribute('aria-current', 'step'); else li.removeAttribute('aria-current');
      });
    };
    const ir = m => {
      si.momento = m; ctx.guardar(); decir(''); lectura.textContent = '';
      if (lt) { lt.destruir(); lt = null; }
      marcarMomento(m);
      ({ juega, predice, mira, regla, 'ahora-tu': ahoraTu })[m]();
      const foco = zona.querySelector('h3,[data-foco]');
      if (foco && document.activeElement && document.activeElement !== document.body) foco.focus({ preventScroll: true });
    };
    const evento = (momento, extra) => ctx.registrar(Object.assign({ tipo: 'teoria', unidad: u.id, idea: idea.id, momento, ms: Date.now() - t0 }, extra));

    // 1. Juega: controles con − y + (nada pide arrastrar), lectura en vivo y conteo de casos distintos.
    function juega() {
      const j = idea.juega;
      actuar('consigna', j.voz || j.consigna);
      zona.innerHTML = `<h3 class="lector" tabindex="-1">Juega</h3><p class="te-consigna">${esc(j.consigna)}</p>
        <div class="te-controles">${(j.controles || []).map(control).join('')}</div>
        <p class="sub te-casos" aria-live="polite"></p>`;
      sig.textContent = 'Ya probé, sigo';
      const pintarJuego = () => {
        dibujar(j.dibujo(vals), j.pieza);
        if (j.lectura) lectura.innerHTML = E.html(j.lectura(vals));
        probados.add(JSON.stringify(vals));
        const faltan = Math.max(0, j.minimo - probados.size);
        zona.querySelector('.te-casos').textContent = faltan ? `Casos probados: ${probados.size} de ${j.minimo}` : `Casos probados: ${probados.size}`;
        for (const c of j.controles || []) {
          const el = zona.querySelector(`[data-c="${c.id}"]`);
          if (!el) continue;
          if (c.opciones) el.querySelectorAll('button').forEach(b => b.setAttribute('aria-pressed', String(String(vals[c.id]) === b.dataset.v)));
          else { el.querySelector('input').value = vals[c.id]; el.querySelector('output').innerHTML = valorControl(c, vals[c.id]); }
        }
      };
      zona.addEventListener('input', e => {
        const el = e.target.closest('[data-c]'); if (!el) return;
        const c = j.controles.find(x => x.id === el.dataset.c);
        vals[c.id] = T.ajustar(c, +e.target.value); pintarJuego(); primerToque();
      });
      zona.addEventListener('click', e => {
        const b = e.target.closest('button[data-paso],button[data-v]'); if (!b) return;
        const el = b.closest('[data-c]'); const c = j.controles.find(x => x.id === el.dataset.c);
        vals[c.id] = c.opciones ? c.opciones.find(o => String(o.valor) === b.dataset.v).valor : T.ajustar(c, vals[c.id] + (+b.dataset.paso) * c.paso);
        pintarJuego(); primerToque();
      });
      let tocado = false;
      const primerToque = () => { if (!tocado) { tocado = true; actuar('juego'); } };
      if (typeof j.montar === 'function') j.montar(zona.querySelector('.te-controles'), { valores: vals, pintar: v => { Object.assign(vals, v); pintarJuego(); primerToque(); } });
      pintarJuego();
      sig.onclick = () => {
        if (probados.size < j.minimo) { decir(`Prueba ${j.minimo - probados.size === 1 ? 'un caso más' : `${j.minimo - probados.size} casos más`} antes de seguir: cambia un valor.`); zona.querySelector('input,button').focus(); return; }
        evento('juego', { casos: probados.size });
        ir('predice');
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
    const valorControl = (c, v) => `${Kit.formatear(v, c.decimales === undefined ? 2 : c.decimales)}${c.unidad ? ` ${esc(c.unidad)}` : ''}`;

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
      actuar('prediccion', p.voz || 'Antes de mirar, ¿qué crees que pasa?');
      dibujar(p.dibujo, p.pieza);
      const ya = si.prediccion;
      zona.innerHTML = `<h3 class="te-preg" tabindex="-1">${E.html(p.pregunta)}</h3>${opcionesHTML(p.opciones)}<p class="te-fb" aria-live="polite"></p>`;
      const cual = elegir();
      const resolver = elegida => {
        const o = p.opciones.find(x => x.id === elegida);
        marcar(p.opciones, elegida);
        dibujar(p.revelar, p.pieza);
        const fb = zona.querySelector('.te-fb');
        if (o.correcta) { fb.innerHTML = E.html(p.coincide || 'Coincide con lo que pasa.'); actuar('coincide', 'Tu predicción coincide. Veamos por qué.'); }
        else { fb.innerHTML = `${E.html(o.siFuera)}`; actuar('no-coincide', p.noCoincide || 'No coincide. Miremos qué cambió.'); }
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
      actuar('mira', m.voz || 'Avanza paso a paso. Puedes volver atrás.');
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
      actuar('regla', r.voz || 'Esta es la regla. Fíjate cuándo vale.');
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
        actuar('ahora-tu', a.voz || 'Un caso nuevo, sin el juego.');
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
            <button type="button" class="btn borde te-otro">Otro caso</button>`;
          actuar(e === 'nose' ? 'ayuda' : bien ? 'acierto' : 'error', bien ? 'Bien resuelto.' : e === 'nose' ? 'Así se resuelve. Prueba otro caso.' : 'Revisa la solución y prueba otro caso.');
          evento('ahora-tu', { opcion: e, correcta: bien, error: (o && o.error) || null, nose: e === 'nose', semilla });
          si.semilla = ++semilla;
          if (bien) si.aciertos = (si.aciertos || 0) + 1;
          if (bien && !si.hecha) { si.hecha = true; ctx.marcarDia(); }
          ctx.guardar();
          fb.querySelector('.te-otro').onclick = nuevo;
          const k = ideas.indexOf(idea), siguiente = ideas[k + 1];
          if (si.hecha) {
            sig.textContent = siguiente ? 'Siguiente idea' : 'Ver la ficha de repaso';
            sig.onclick = () => { location.hash = `#/unidad/${u.id}/teoria/${siguiente ? siguiente.id : 'ficha'}`; };
            if (!siguiente && ideas.every(i => hecha(st, i.id))) { actuar('fin', 'Terminaste las ideas de esta unidad.'); evento('fin', {}); }
          } else { sig.textContent = 'Otro caso'; sig.onclick = nuevo; }
        };
      };
      nuevo();
    }

    function reglaHTML(r, foco) {
      return `<div class="te-regla"${foco ? ' data-foco tabindex="-1"' : ''}><p class="te-rtx">${esc(r.texto)}</p>
        ${r.ecuacion ? `<p class="te-ec te-ec-grande">${E.html(r.ecuacion)}</p>` : ''}
        <p class="te-cond"><b>Vale si</b> ${esc(String(r.condicion).replace(/^si\s+/i, ''))}</p></div>`;
    }

    function vistaFicha() {
      return `<section class="te-fichas">${ideas.map((i, k) => hecha(st, i.id)
        ? `<article class="card te-fic"><h2>${k + 1}. ${esc(i.titulo)}</h2>
            <figure class="kit-figura te-fig-chica">${pieza(i.mira.pieza).dibujar(i.mira.datos, Object.assign({}, i.mira.base || {}, i.mira.pasos[i.mira.pasos.length - 1].estado || {}))}</figure>
            ${reglaHTML(i.regla)}</article>`
        : `<article class="card te-fic pendiente"><h2>${k + 1}. ${esc(i.titulo)}</h2>
            <p class="sub">Se abre al terminar esta idea: primero juegas y predices.</p>
            <a class="btn borde" href="#/unidad/${esc(u.id)}/teoria/${esc(i.id)}">Ir a esta idea ›</a></article>`).join('')}</section>`;
    }

    // Arranque: el momento guardado (si ya predijo, no vuelve a predecir desde cero).
    actuar('llegada', idea.juega.voz || idea.juega.consigna);
    ir(si.hecha ? 'regla' : si.momento || 'juega');
  }

  window.Teoria = Object.assign(window.Teoria || {}, { vista });
})();
