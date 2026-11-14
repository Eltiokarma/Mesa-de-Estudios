/*
 * Tabla viva, paso 1 (docs/pogil-v2-rive.md §7.3 y versión T de §9): la tabla plegada en el celular y el
 * reordenamiento de las cartas. Pieza mayor del kit en HTML (no SVG): 118 casillas con texto que el lector de
 * pantalla lee y que se buscan con el dedo.
 *
 *   const t = Kit.Tabla.montar(contenedor, { arreglo: 'tabla', abierta: false, fuentes: false, alCambiar(estado) {} });
 *   t.poner('filaMasa');      // 'tabla' | 'filaZ' | 'filaMasa'
 *   t.abrir(true);            // abre o pliega los grupos 3 a 12 (solo en 'tabla' y si no entra la tabla larga)
 *   t.estado()                // { arreglo, abierta, paso, columnas, larga }
 *   t.destruir()
 *
 * Movimiento (docs/diseno.md, «Tabla viva»):
 *   - Cada carta es el mismo nodo de un arreglo a otro (oficio Identidad). Solo se anima transform y opacity.
 *   - Reordenar es un paso de explicación: «paso» (900 ms) con «trasladar», escalonado por renglón de destino
 *     (40 ms, como mucho 5 escalones). Abrir el pliegue: «largo» (480) con «trasladar»; plegar, «medio» (320).
 *   - Se interrumpe sin saltos: una transición CSS nueva arranca desde la posición pintada.
 *   - Con movimiento reducido no hay traslados: la tabla se funde fuera («micro», irse), cambia y se funde dentro
 *     («corto», llegar).
 * Datos: nucleo/kit/tabla/datos.js (CIAAW 2024). Posiciones: nucleo/kit/tabla/arreglos.js.
 */
(function (root) {
  'use strict';
  const Kit = root.Kit = root.Kit || {};
  const { ELEMENTOS, FUENTES } = Kit.tablaDatos;
  const A = Kit.tablaArreglos;

  const T = { micro: 120, corto: 200, medio: 320, largo: 480, paso: 900 };
  const CURVA = { trasladar: 'cubic-bezier(0.4, 0, 0.2, 1)', llegar: 'cubic-bezier(0, 0, 0.2, 1)', irse: 'cubic-bezier(0.4, 0, 1, 1)' };
  const ESCALON = 40, MAX_ESCALONES = 5;
  const CANAL = 16;          // canal de la izquierda con los periodos (px)
  const CABEZA = 18;         // franja de arriba con los grupos (px)
  const PASO_MIN = 36, PASO_MAX = 48, PASO_FILA = 40;
  const ROMANOS = ['', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII'];
  const ETIQUETA = { tabla: 'Tabla', filaZ: 'Por Z', filaMasa: 'Por masa' };
  const LARGA = { tabla: 'Tabla periódica', filaZ: 'Fila por número atómico', filaMasa: 'Fila por peso atómico' };

  const reducido = () => root.matchMedia && root.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const coma = s => String(s).replace(/, /g, '; ').replace(/\./g, ',');
  function grupoAB(g) {
    if (g <= 2) return ROMANOS[g] + 'A';
    if (g >= 13) return ROMANOS[g - 10] + 'A';
    if (g <= 7) return ROMANOS[g] + 'B';
    if (g <= 10) return 'VIIIB';
    return ROMANOS[g - 10] + 'B';
  }
  const mayus = s => s.charAt(0).toUpperCase() + s.slice(1);

  function el(tag, clase, attrs = {}, hijos = []) {
    const n = document.createElement(tag);
    if (clase) n.className = clase;
    for (const [k, v] of Object.entries(attrs)) {
      if (k === 'texto') n.textContent = v;
      else if (v !== null && v !== undefined) n.setAttribute(k, v);
    }
    for (const h of hijos) n.append(h);
    return n;
  }

  // Qué dice la carta completa (también lo usa la prueba de la página).
  function ficha(Z) {
    const e = ELEMENTOS[Z - 1], u = A.ubicacion(Z);
    const lineas = [];
    if (e.peso !== undefined) {
      lineas.push({ k: 'Peso atómico estándar', v: `${coma(e.pesoTexto)} ± ${coma(String(e.incertidumbre))}` });
      lineas.push({ k: 'Valor completo', v: coma(e.estandar) });
    } else {
      lineas.push({ k: 'Peso atómico estándar', v: 'No tiene: la CIAAW no lo asigna' });
      const m = e.masico.map(n => `[${n}]`).join(' o ');
      lineas.push({ k: 'Número másico del isótopo más estable', v: e.masico.length > 1 ? `${m} (no se distinguen)` : m });
    }
    const lugar = u.serie
      ? `Periodo ${u.periodo} · ${mayus(u.serie)}, en la fila aparte`
      : `Periodo ${u.periodo} · Grupo ${u.grupo} (${grupoAB(u.grupo)}) · Bloque ${u.bloque}`;
    lineas.push({ k: 'En la tabla', v: lugar });
    if (e.otros) lineas.push({ k: 'También se llama', v: e.otros.join(', ') });
    return { titulo: `${e.simbolo} · ${e.nombre}`, Z, lineas,
      fuente: `${e.peso !== undefined ? FUENTES.peso : FUENTES.masico}. Nombre: ${FUENTES.nombre.charAt(0).toLowerCase() + FUENTES.nombre.slice(1)}.` };
  }

  function montar(raiz, opciones = {}) {
    let arreglo = opciones.arreglo || 'tabla';
    let abierta = !!opciones.abierta;
    let turno = 0, actual = null, paso = PASO_FILA, columnas = 8, larga = false, primera = true;
    let enfocada = 1, origenHoja = null;
    const previo = [];   // lo último escrito en cada carta
    let scrollVisto = 0;

    // ---------- Estructura ----------
    const botones = {};
    const barra = el('div', 'tv-barra', { role: 'group', 'aria-label': 'Cómo se ordenan las cartas' });
    for (const id of ['tabla', 'filaZ', 'filaMasa']) {
      const b = el('button', 'tv-opcion', { type: 'button', 'aria-pressed': 'false', 'aria-label': LARGA[id], texto: ETIQUETA[id] });
      b.addEventListener('click', () => poner(id));
      botones[id] = b; barra.append(b);
    }
    const pliegaBtn = el('button', 'tv-pliega', { type: 'button', 'aria-expanded': 'false' });
    pliegaBtn.addEventListener('click', () => abrir(!abierta));
    const canal = el('div', 'tv-canal', { 'aria-hidden': 'true' });
    const lienzo = el('div', 'tv-lienzo', { role: 'group', 'aria-label': 'Elementos' });
    const marco = el('div', 'tv-marco', {}, [lienzo]);
    const cuerpo = el('div', 'tv-cuerpo', {}, [canal, marco]);
    marco.addEventListener('scroll', () => { scrollVisto = marco.scrollLeft; }, { passive: true });
    const estado = el('p', 'tv-estado', { role: 'status', 'aria-live': 'polite' });
    const franja = el('div', 'tv-franja', { 'aria-hidden': 'true' }, [el('span', '', { texto: '3–12' })]);
    franja.addEventListener('click', () => abrir(true));
    lienzo.append(franja);

    const cartas = [null];
    for (const e of ELEMENTOS) {
      const c = el('button', 'tv-carta', { type: 'button', 'data-z': e.Z, tabindex: '-1',
        'aria-label': `${e.nombre}, ${e.simbolo}, número atómico ${e.Z}` },
        [el('span', 'tv-z', { 'aria-hidden': 'true', texto: String(e.Z) }), el('span', 'tv-s', { 'aria-hidden': 'true', texto: e.simbolo })]);
      c.addEventListener('click', () => mostrarFicha(e.Z, c));
      cartas.push(c); lienzo.append(c);
    }
    const rotulos = el('div', 'tv-rotulos', { 'aria-hidden': 'true' });
    lienzo.append(rotulos);

    // Carta completa: hoja de abajo (dialog modal: atrapa el foco y se cierra con Escape).
    const hoja = el('dialog', 'tv-hoja', { 'aria-labelledby': 'tv-hoja-titulo' });
    const hojaTitulo = el('h2', 'tv-hoja-titulo', { id: 'tv-hoja-titulo' });
    const hojaZ = el('p', 'tv-hoja-z');
    const hojaLista = el('dl', 'tv-hoja-lista');
    // La fuente es para quien revisa (como .fuente en las escenas): el alumno no la ve salvo { fuentes: true }.
    const hojaFuente = el('p', 'tv-fuente');
    hojaFuente.hidden = !opciones.fuentes;
    const cerrar = el('button', 'tv-cerrar', { type: 'button', texto: 'Cerrar' });
    cerrar.addEventListener('click', () => cerrarFicha());
    hoja.addEventListener('cancel', ev => { ev.preventDefault(); cerrarFicha(); });
    hoja.addEventListener('click', ev => { if (ev.target === hoja) cerrarFicha(); });
    hoja.append(el('div', 'tv-hoja-caja', {}, [hojaTitulo, hojaZ, hojaLista, hojaFuente, cerrar]));

    const raizTv = el('div', 'tv', {}, [barra, el('div', 'tv-fila-pliega', {}, [pliegaBtn]), cuerpo, estado, hoja]);
    raiz.append(raizTv);

    // ---------- Medidas ----------
    function medir() {
      const disp = Math.max(0, marco.clientWidth);
      const pLarga = Math.floor(disp / 18);
      larga = pLarga >= PASO_MIN;
      const pPlegada = Math.floor(disp / (8 + A.ANCHO_PLIEGUE));
      if (arreglo === 'tabla') paso = Math.min(PASO_MAX, larga ? pLarga : Math.max(PASO_MIN, pPlegada));
      else paso = PASO_FILA;
      columnas = Math.max(8, Math.min(18, Math.floor(disp / PASO_FILA)));
    }

    function calcular() {
      medir();
      const abiertaReal = larga || abierta;
      return arreglo === 'tabla' ? A.tabla({ abierta: abiertaReal }) : A.arreglo(arreglo, { columnas });
    }

    // ---------- Pintar ----------
    function colocar(r, conMovimiento, duracion) {
      const top = r.columnas.length ? CABEZA : 0;
      const ancho = Math.ceil(r.ancho * paso), alto = Math.ceil(top + r.alto * paso);
      lienzo.style.setProperty('--tv-paso', paso + 'px');
      lienzo.style.width = ancho + 'px';
      // Alto: crece de inmediato; se achica cuando terminó el movimiento (nada salta bajo las cartas que viajan).
      const altoAntes = parseFloat(lienzo.style.height) || 0;
      lienzo.style.height = Math.max(alto, conMovimiento ? altoAntes : 0) + 'px';
      const t = turno;
      const maxRetardo = MAX_ESCALONES * ESCALON;
      if (conMovimiento) setTimeout(() => { if (t === turno) lienzo.style.height = alto + 'px'; }, duracion + maxRetardo + 50);

      // Solo se escribe lo que cambia: con 118 cartas, cada escritura de más cuesta en el primer cuadro.
      for (let z = 1; z <= 118; z++) {
        const p = r.pos[z], c = cartas[z], antes = previo[z] || {};
        const x = p.x * paso, y = top + p.y * paso;
        const tr = `translate(${x}px, ${y}px)${p.visible ? '' : ' scale(0.4)'}`;
        const mueve = tr !== antes.tr || p.visible !== antes.visible;
        const tx = conMovimiento && mueve
          ? `transform ${duracion}ms ${CURVA.trasladar} ${Math.min(Math.floor(p.y), MAX_ESCALONES) * ESCALON}ms, opacity ${duracion}ms ${CURVA.trasladar} ${Math.min(Math.floor(p.y), MAX_ESCALONES) * ESCALON}ms`
          : (conMovimiento ? antes.tx : 'none');
        if (tx !== antes.tx) c.style.transition = tx;
        if (tr !== antes.tr) c.style.transform = tr;
        if (p.visible !== antes.visible) {
          c.style.opacity = p.visible ? '1' : '0';
          c.classList.toggle('tv-guardada', !p.visible);
          if (p.visible) c.removeAttribute('aria-hidden'); else c.setAttribute('aria-hidden', 'true');
          c.disabled = !p.visible;
        }
        previo[z] = { tr, tx, visible: p.visible };
      }
      // Pliegue, rótulos, huecos y periodos.
      franja.hidden = !r.pliegue;
      if (r.pliegue) {
        franja.style.transform = `translate(${r.pliegue.x * paso}px, ${top}px)`;
        franja.style.width = r.pliegue.ancho * paso + 'px';
        franja.style.height = r.pliegue.alto * paso + 'px';
      }
      rotulos.replaceChildren(
        ...r.columnas.map(c => el('span', 'tv-col', { style: `transform:translate(${c.x * paso}px,0);width:${paso}px`, texto: c.texto })),
        ...r.huecos.map(h => el('span', 'tv-hueco', { style: `transform:translate(${h.x * paso}px,${top + h.y * paso}px)` },
          h.texto.split('–').map((t, i) => el('span', '', { texto: i === 0 ? t + '–' : t })))),
        ...r.rotulos.map(t => el('span', 'tv-tramo', { style: `transform:translate(${t.x * paso}px,${top + t.y * paso}px);width:${t.ancho * paso}px`, texto: t.texto }))
      );
      canal.replaceChildren(...r.filas.map(f => el('span', 'tv-periodo',
        { style: `transform:translateY(${top + f.y * paso}px);height:${paso}px`, texto: f.texto })));
      canal.style.height = alto + 'px';
      if (conMovimiento && !reducido()) {
        rotulos.animate([{ opacity: 0 }, { opacity: 1 }], { duration: T.corto, delay: duracion, easing: CURVA.llegar, fill: 'backwards' });
      }
    }

    function anunciar() {
      let t = LARGA[arreglo];
      if (arreglo === 'tabla') t += larga ? ', completa' : abierta ? ', con los grupos 3 a 12 abiertos' : ', plegada: grupos 1, 2 y 13 a 18';
      if (arreglo === 'filaMasa') t += '; los 34 sin peso atómico estándar van aparte';
      estado.textContent = t + '.';
    }

    function controles() {
      for (const [id, b] of Object.entries(botones)) b.setAttribute('aria-pressed', String(id === arreglo));
      const verPliega = arreglo === 'tabla' && !larga;
      pliegaBtn.style.visibility = verPliega ? 'visible' : 'hidden';
      pliegaBtn.disabled = !verPliega;
      pliegaBtn.setAttribute('aria-expanded', String(abierta));
      pliegaBtn.textContent = abierta ? 'Plegar los grupos 3 a 12' : 'Abrir los grupos 3 a 12';
      raizTv.dataset.arreglo = arreglo;
    }

    function aplicar(duracion) {
      turno++;
      const t = turno;
      const r = calcular();
      actual = r;
      controles();
      anunciar();
      if (opciones.alCambiar && !primera) opciones.alCambiar(api.estado());
      if (primera || duracion === 0) { primera = false; colocar(r, false, 0); return Promise.resolve(); }
      if (reducido()) {
        // Sin traslados: se funde fuera, cambia, se funde dentro.
        const fuera = lienzo.animate([{ opacity: 1 }, { opacity: 0 }], { duration: T.micro, easing: CURVA.irse, fill: 'forwards' });
        return fuera.finished.then(() => {
          if (t !== turno) return;
          colocar(r, false, 0);
          fuera.cancel();
          return lienzo.animate([{ opacity: 0 }, { opacity: 1 }], { duration: T.corto, easing: CURVA.llegar }).finished;
        }).catch(() => {});
      }
      colocar(r, true, duracion);
      return new Promise(res => setTimeout(res, duracion + MAX_ESCALONES * ESCALON));
    }

    function poner(id) {
      if (!['tabla', 'filaZ', 'filaMasa'].includes(id)) throw new Error(`Tabla: arreglo desconocido ${id}`);
      if (id === arreglo) return Promise.resolve();
      arreglo = id;
      const p = aplicar(T.paso);
      llevarVista();
      return p;
    }

    function abrir(si) {
      if (arreglo !== 'tabla' || larga || si === abierta) return Promise.resolve();
      abierta = !!si;
      const p = aplicar(abierta ? T.largo : T.medio);
      llevarVista();
      return p;
    }

    // Al abrir en el celular, el marco se corre hasta el bloque d (sin animar: el movimiento lo hacen las cartas).
    function llevarVista() {
      // Escribir scrollLeft fuerza un diseño en el acto (43 ms con la CPU ×4): solo si cambia.
      const destino = arreglo === 'tabla' && abierta && !larga ? 2 * paso : 0;
      // Leerlo también fuerza el diseño: se lleva la cuenta con el evento scroll.
      if (scrollVisto !== destino) { marco.scrollLeft = destino; scrollVisto = destino; }
    }

    // ---------- Carta completa ----------
    function mostrarFicha(Z, origen) {
      const f = ficha(Z);
      hojaTitulo.textContent = f.titulo;
      hojaZ.textContent = `Número atómico ${f.Z}`;
      hojaLista.replaceChildren(...f.lineas.flatMap(l => [el('dt', '', { texto: l.k }), el('dd', '', { texto: l.v })]));
      hojaFuente.textContent = f.fuente;
      origenHoja = origen;
      enfocar(Z);
      hoja.classList.remove('tv-saliendo');
      if (typeof hoja.showModal === 'function') hoja.showModal(); else hoja.setAttribute('open', '');
      cerrar.focus();
    }
    function cerrarFicha() {
      if (!hoja.open) return;
      const fin = () => { hoja.classList.remove('tv-saliendo'); if (hoja.open) hoja.close(); if (origenHoja) origenHoja.focus(); };
      if (reducido() || !hoja.animate) return fin();
      hoja.classList.add('tv-saliendo');
      setTimeout(fin, T.corto);
    }

    // ---------- Teclado: una sola carta en el orden de tabulación; las flechas se mueven por posición ----------
    function enfocar(Z, mover) {
      if (cartas[enfocada]) cartas[enfocada].tabIndex = -1;
      enfocada = Z;
      cartas[Z].tabIndex = 0;
      if (mover) cartas[Z].focus();
    }
    lienzo.addEventListener('keydown', ev => {
      const dir = { ArrowRight: [1, 0], ArrowLeft: [-1, 0], ArrowDown: [0, 1], ArrowUp: [0, -1] }[ev.key];
      if (!dir || !actual) return;
      ev.preventDefault();
      const a = actual.pos[enfocada];
      let mejor = null, dMejor = Infinity;
      for (let z = 1; z <= 118; z++) {
        const p = actual.pos[z];
        if (!p.visible || z === enfocada) continue;
        const dx = p.x - a.x, dy = p.y - a.y;
        const avance = dx * dir[0] + dy * dir[1];
        if (avance < 0.5) continue;
        const lado = Math.abs(dx * dir[1]) + Math.abs(dy * dir[0]);
        const d = avance + lado * 3;
        if (d < dMejor) { dMejor = d; mejor = z; }
      }
      if (mejor) enfocar(mejor, true);
    });
    lienzo.addEventListener('focusin', ev => { const z = Number(ev.target.dataset && ev.target.dataset.z); if (z) enfocar(z); });

    // ---------- Arranque y cambios de tamaño ----------
    let anchoVisto = 0;
    const ro = typeof ResizeObserver === 'function' ? new ResizeObserver(() => {
      if (Math.abs(marco.clientWidth - anchoVisto) < 1) return;
      anchoVisto = marco.clientWidth;
      aplicar(0); llevarVista();
    }) : null;
    anchoVisto = marco.clientWidth;
    aplicar(0);
    enfocar(1);
    if (ro) ro.observe(marco);

    const api = {
      poner, abrir,
      estado: () => ({ arreglo, abierta: arreglo === 'tabla' && (abierta || larga), paso, columnas, larga }),
      destruir() { if (ro) ro.disconnect(); raizTv.remove(); }
    };
    return api;
  }

  Kit.Tabla = { montar, ficha };
})(typeof self !== 'undefined' ? self : this);
