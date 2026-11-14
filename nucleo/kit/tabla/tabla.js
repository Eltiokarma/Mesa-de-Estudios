/*
 * Tabla viva (docs/pogil-v2-rive.md §7.3; decisión 20: primero se juega con la información). Pieza mayor del kit en
 * HTML: 118 cartas con texto que el lector de pantalla lee. No pregunta, no bloquea y no revela nada: el alumno juega.
 *
 *   const t = Kit.Tabla.montar(contenedor, { vista: 'tabla' | 'mesa', lente: 'nada', cartas: '20', fuentes: false, semilla });
 *   t.poner('mesa')            // 'tabla' (la de la IUPAC, para consultar) | 'mesa' (cartas sueltas para armar)
 *   t.abrir(true)              // abre o pliega los grupos 3 a 12 en la tabla (si no entra la tabla larga)
 *   t.lente('ei')              // qué muestra cada carta: nada | masa | ei | en | radio | clase | estado
 *   t.cartas('36')             // cuántas cartas hay en la mesa: '20' | '36' | '118' (se reparten mezcladas)
 *   t.mezclar()                // vuelve a mezclar las de la mesa
 *   t.mover(z, celda)          // lo mismo que arrastrar la carta z a esa celda de la mesa
 *   t.estado()                 // { vista, abierta, lente, cartas, seleccion, mesa, paso, larga }
 *
 * Qué puede hacer el alumno:
 *   - Mirar la tabla con una lente: cada carta se llena como barra (desde cero) o se pinta por familia.
 *   - Tocar una carta: ve su valor; tocar otra: ve las dos y la diferencia. «Ver todo» abre la carta completa.
 *   - En la mesa, arrastrar una carta a donde quiera. Si la suelta sobre otra, se mete ahí y las de después se corren.
 *     Sin arrastrar: tocar la carta, «Mover» y tocar el lugar (con teclado: Enter sobre la carta de destino).
 *
 * Movimiento (docs/diseno.md, «Tabla viva»):
 *   - Entre tabla y mesa, y al repartir: «paso» (900 ms) con «trasladar», escalonado 40 ms por renglón (máx. 5).
 *   - Lo que arrastra el dedo lo sigue uno a uno; al soltar, la carta llega a su celda en «corto» con «llegar» y las
 *     que se corren lo hacen en «medio» con «trasladar». Pliegue: «largo» al abrir, «medio» al plegar.
 *   - Las barras cambian en «medio» con «trasladar» (de un valor real a otro).
 *   - Con movimiento reducido no hay traslados: lo que cambia de lugar se funde («micro» fuera, «corto» dentro), y el
 *     arrastre sigue al dedo pero al soltar la carta aparece en su celda.
 * Datos: datos.js (CIAAW, NIST y PubChem). Posiciones: arreglos.js (tabla) y mesa.js (mesa). Valores: lentes.js.
 */
(function (root) {
  'use strict';
  const Kit = root.Kit = root.Kit || {};
  const { ELEMENTOS, FUENTES } = Kit.tablaDatos;
  const A = Kit.tablaArreglos, M = Kit.tablaMesa, L = Kit.tablaLentes;

  const T = { micro: 120, corto: 200, medio: 320, largo: 480, paso: 900 };
  const CURVA = { trasladar: 'cubic-bezier(0.4, 0, 0.2, 1)', llegar: 'cubic-bezier(0, 0, 0.2, 1)', irse: 'cubic-bezier(0.4, 0, 1, 1)' };
  const ESCALON = 40, MAX_ESCALONES = 5;
  const CABEZA = 18;         // franja de arriba con los grupos (px)
  const PASO_MIN = 36, PASO_MAX = 48, PASO_MESA = 40;
  const ESPERA_TOQUE = 220;  // ms quieto antes de agarrar una carta con el dedo (antes, el dedo desplaza la página)
  const ROMANOS = ['', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII'];
  const CONJUNTOS = { '20': 20, '36': 36, '118': 118 };
  const TXT_CONJUNTO = { '20': '1 a 20', '36': '1 a 36', '118': 'Todas' };

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

  // Qué dice la carta completa («Ver todo»). «sin dato» solo en las propiedades sin valor con fuente (decisión 9).
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
    for (const lente of ['ei', 'en', 'radio', 'clase', 'estado']) lineas.push({ k: L.LENTES[lente].largo, v: L.valor(Z, lente).texto, propiedad: true });
    if (e.otros) lineas.push({ k: 'También se llama', v: e.otros.join(', ') });
    const fuentes = [e.peso !== undefined ? FUENTES.peso : FUENTES.masico, FUENTES.ei, 'electronegatividad, radio, clase y estado: PubChem (por verificar)',
      'nombre: ' + FUENTES.nombre.charAt(0).toLowerCase() + FUENTES.nombre.slice(1)];
    return { titulo: `${e.simbolo} · ${e.nombre}`, Z, lineas, fuente: fuentes.join('. ') + '.' };
  }

  function montar(raiz, opciones = {}) {
    let vista = opciones.vista === 'mesa' ? 'mesa' : 'tabla';
    let abierta = !!opciones.abierta;
    let lente = L.LENTES[opciones.lente] ? opciones.lente : 'nada';
    let conjunto = CONJUNTOS[opciones.cartas] ? String(opciones.cartas) : '20';
    let semilla = Number.isInteger(opciones.semilla) ? opciones.semilla : (Date.now() % 100000) + 1;
    let mesa = null, seleccion = [], moviendo = null;
    let turno = 0, actual = null, top = 0, paso = PASO_MESA, columnas = 8, larga = false, primera = true;
    let enfocada = 1, origenHoja = null, scrollVisto = 0;
    const previo = [];

    // ---------- Estructura ----------
    const vistas = {};
    const barra = el('div', 'tv-barra', { role: 'group', 'aria-label': 'Vista' });
    for (const [id, txt, largo] of [['tabla', 'Tabla', 'Tabla periódica'], ['mesa', 'Mesa', 'Mesa para armar con las cartas']]) {
      const b = el('button', 'tv-opcion', { type: 'button', 'aria-pressed': 'false', 'aria-label': largo, texto: txt });
      b.addEventListener('click', () => poner(id));
      vistas[id] = b; barra.append(b);
    }
    const lentesBtn = {};
    const filaLentes = el('div', 'tv-lentes', { role: 'group', 'aria-label': 'Qué muestra cada carta' });
    for (const id of L.ORDEN) {
      const b = el('button', 'tv-chip', { type: 'button', 'aria-pressed': 'false', 'aria-label': `Mostrar: ${L.LENTES[id].largo}`, texto: L.LENTES[id].nombre });
      b.addEventListener('click', () => ponerLente(id));
      lentesBtn[id] = b; filaLentes.append(b);
    }
    const leyenda = el('p', 'tv-leyenda');

    // Fila de opciones: el pliegue en la tabla, el reparto en la mesa (misma altura: nada salta).
    const pliegaBtn = el('button', 'tv-pliega', { type: 'button', 'aria-expanded': 'false' });
    pliegaBtn.addEventListener('click', () => abrir(!abierta));
    const conjuntoBtn = {};
    const opcMesa = el('div', 'tv-opc-mesa', { role: 'group', 'aria-label': 'Cartas en la mesa' });
    for (const id of Object.keys(CONJUNTOS)) {
      const b = el('button', 'tv-chip', { type: 'button', 'aria-pressed': 'false', 'aria-label': `Cartas ${TXT_CONJUNTO[id]}`, texto: TXT_CONJUNTO[id] });
      b.addEventListener('click', () => ponerCartas(id));
      conjuntoBtn[id] = b; opcMesa.append(b);
    }
    const mezclarBtn = el('button', 'tv-chip tv-mezclar', { type: 'button', texto: 'Mezclar' });
    mezclarBtn.addEventListener('click', () => mezclar());
    opcMesa.append(mezclarBtn);
    const filaOpc = el('div', 'tv-fila-opc', {}, [pliegaBtn, opcMesa]);

    const canal = el('div', 'tv-canal', { 'aria-hidden': 'true' });
    const lienzo = el('div', 'tv-lienzo', { role: 'group', 'aria-label': 'Elementos' });
    const marco = el('div', 'tv-marco', {}, [lienzo]);
    const cuerpo = el('div', 'tv-cuerpo', {}, [canal, marco]);
    marco.addEventListener('scroll', () => { scrollVisto = marco.scrollLeft; }, { passive: true });
    const franja = el('div', 'tv-franja', { 'aria-hidden': 'true' }, [el('span', '', { texto: '3–12' })]);
    franja.addEventListener('click', () => abrir(true));
    const destinoMarca = el('div', 'tv-destino', { 'aria-hidden': 'true' });
    lienzo.append(franja, destinoMarca);

    const cartas = [null];
    for (const e of ELEMENTOS) {
      const barraV = el('span', 'tv-bar', { 'aria-hidden': 'true' });
      const c = el('button', 'tv-carta', { type: 'button', 'data-z': e.Z, tabindex: '-1', 'aria-pressed': 'false' },
        [barraV, el('span', 'tv-z', { 'aria-hidden': 'true', texto: String(e.Z) }), el('span', 'tv-v', { 'aria-hidden': 'true' }),
          el('span', 'tv-s', { 'aria-hidden': 'true', texto: e.simbolo })]);
      cartas.push(c); lienzo.append(c);
    }
    const rotulos = el('div', 'tv-rotulos', { 'aria-hidden': 'true' });
    lienzo.append(rotulos);

    // Panel: lo que el alumno tocó (alto reservado desde la primera pintura).
    const panelTexto = el('div', 'tv-panel-texto');
    const verBtn = el('button', 'tv-chip', { type: 'button', texto: 'Ver todo' });
    const moverBtn = el('button', 'tv-chip', { type: 'button', texto: 'Mover' });
    const soltarBtn = el('button', 'tv-chip', { type: 'button', texto: 'Soltar selección' });
    verBtn.addEventListener('click', () => { const z = seleccion[seleccion.length - 1]; if (z) mostrarFicha(z, cartas[z]); });
    moverBtn.addEventListener('click', () => { if (moviendo) { moviendo = null; } else if (seleccion.length) { moviendo = seleccion[seleccion.length - 1]; } pintarPanel(); });
    soltarBtn.addEventListener('click', () => { seleccion = []; moviendo = null; pintarSeleccion(); pintarPanel(); });
    const panel = el('div', 'tv-panel', {}, [panelTexto, el('div', 'tv-panel-botones', {}, [verBtn, moverBtn, soltarBtn])]);
    const estado = el('p', 'tv-estado tv-solo-lector', { role: 'status', 'aria-live': 'polite' });

    // Carta completa: hoja de abajo (dialog modal: atrapa el foco y se cierra con Escape).
    const hoja = el('dialog', 'tv-hoja', { 'aria-labelledby': 'tv-hoja-titulo' });
    const hojaTitulo = el('h2', 'tv-hoja-titulo', { id: 'tv-hoja-titulo' });
    const hojaZ = el('p', 'tv-hoja-z');
    const hojaLista = el('dl', 'tv-hoja-lista');
    const hojaFuente = el('p', 'tv-fuente');   // para quien revisa; el alumno no la ve salvo { fuentes: true }
    hojaFuente.hidden = !opciones.fuentes;
    const cerrar = el('button', 'tv-cerrar', { type: 'button', texto: 'Cerrar' });
    cerrar.addEventListener('click', () => cerrarFicha());
    hoja.addEventListener('cancel', ev => { ev.preventDefault(); cerrarFicha(); });
    hoja.addEventListener('click', ev => { if (ev.target === hoja) cerrarFicha(); });
    hoja.append(el('div', 'tv-hoja-caja', {}, [hojaTitulo, hojaZ, hojaLista, hojaFuente, cerrar]));

    const raizTv = el('div', 'tv', {}, [barra, filaLentes, leyenda, filaOpc, cuerpo, panel, estado, hoja]);
    raiz.append(raizTv);

    // ---------- Medidas y posiciones ----------
    function medir() {
      const disp = Math.max(0, marco.clientWidth);
      const pLarga = Math.floor(disp / 18);
      larga = pLarga >= PASO_MIN;
      if (vista === 'tabla') {
        const pPlegada = Math.floor(disp / (8 + A.ANCHO_PLIEGUE));
        paso = Math.min(PASO_MAX, larga ? pLarga : Math.max(PASO_MIN, pPlegada));
      } else {
        columnas = Math.max(8, Math.min(18, Math.floor(disp / PASO_MESA)));
        paso = Math.min(PASO_MAX, Math.max(PASO_MIN, Math.floor(disp / columnas)));
      }
    }

    const enMesa = () => { const n = CONJUNTOS[conjunto]; return Array.from({ length: n }, (_, i) => i + 1); };
    function asegurarMesa() {
      if (!mesa) mesa = M.crear(enMesa(), { columnas, semilla });
      else if (mesa.columnas !== columnas) mesa = M.reancho(mesa, columnas);
    }

    function calcular() {
      medir();
      if (vista === 'tabla') return A.tabla({ abierta: larga || abierta });
      asegurarMesa();
      const r = { pos: [null], columnas: [], filas: [], huecos: [], rotulos: [], pliegue: null, ancho: mesa.columnas, alto: M.filas(mesa) };
      for (let z = 1; z <= 118; z++) {
        const i = M.donde(mesa, z);
        if (i >= 0) r.pos.push({ ...M.lugar(mesa, i), visible: true });
        else { const a = actual && actual.pos[z]; r.pos.push({ x: a ? a.x : 0, y: a ? a.y : 0, visible: false }); }
      }
      return r;
    }

    // ---------- Pintar ----------
    function colocar(r, duracion, curva = CURVA.trasladar, escalonar = true, excepto = null) {
      const conMov = duracion > 0;
      top = r.columnas.length ? CABEZA : 0;
      const ancho = Math.ceil(r.ancho * paso), alto = Math.ceil(top + r.alto * paso);
      lienzo.style.setProperty('--tv-paso', paso + 'px');
      lienzo.style.width = ancho + 'px';
      const altoAntes = parseFloat(lienzo.style.height) || 0;
      lienzo.style.height = Math.max(alto, conMov ? altoAntes : 0) + 'px';
      const t = turno;
      if (conMov) setTimeout(() => { if (t === turno) lienzo.style.height = alto + 'px'; }, duracion + MAX_ESCALONES * ESCALON + 50);

      // Solo se escribe lo que cambia: con 118 cartas, cada escritura de más cuesta en el primer cuadro.
      for (let z = 1; z <= 118; z++) {
        const p = r.pos[z], c = cartas[z], antes = previo[z] || {};
        const tr = `translate(${p.x * paso}px, ${top + p.y * paso}px)${p.visible ? '' : ' scale(0.4)'}`;
        const mueve = tr !== antes.tr || p.visible !== antes.visible;
        const retardo = escalonar ? Math.min(Math.floor(p.y), MAX_ESCALONES) * ESCALON : 0;
        const d = z === excepto ? T.corto : duracion, cv = z === excepto ? CURVA.llegar : curva;
        const tx = conMov && mueve ? `transform ${d}ms ${cv} ${retardo}ms, opacity ${d}ms ${cv} ${retardo}ms` : (conMov ? antes.tx : 'none');
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
      franja.hidden = !r.pliegue;
      if (r.pliegue) {
        franja.style.transform = `translate(${r.pliegue.x * paso}px, ${top}px)`;
        franja.style.width = r.pliegue.ancho * paso + 'px';
        franja.style.height = r.pliegue.alto * paso + 'px';
      }
      rotulos.replaceChildren(
        ...r.columnas.map(c => el('span', 'tv-col', { style: `transform:translate(${c.x * paso}px,0);width:${paso}px`, texto: c.texto })),
        ...r.huecos.map(h => el('span', 'tv-hueco', { style: `transform:translate(${h.x * paso}px,${top + h.y * paso}px)` },
          h.texto.split('–').map((x, i) => el('span', '', { texto: i === 0 ? x + '–' : x }))))
      );
      canal.replaceChildren(...r.filas.map(f => el('span', 'tv-periodo',
        { style: `transform:translateY(${top + f.y * paso}px);height:${paso}px`, texto: f.texto })));
      canal.style.height = alto + 'px';
    }

    // Lente: valor en la carta, barra desde cero, tinte de familia, «—» si no hay dato.
    function pintarLente() {
      leyenda.textContent = textoLeyenda();
      raizTv.dataset.lente = lente;
      for (let z = 1; z <= 118; z++) {
        const c = cartas[z], v = L.valor(z, lente), e = ELEMENTOS[z - 1];
        c.querySelector('.tv-v').textContent = v.corto;
        c.querySelector('.tv-bar').style.transform = `scaleY(${v.fraccion === null ? 0 : v.fraccion})`;
        c.dataset.tipo = v.tipo || '';
        c.dataset.grupo = v.grupo || '';
        c.classList.toggle('tv-sd', v.sinDato);
        const dice = lente === 'nada' ? '' : `, ${L.LENTES[lente].largo.toLowerCase()}: ${v.texto}`;
        c.setAttribute('aria-label', `${e.nombre}, ${e.simbolo}, número atómico ${e.Z}${dice}`);
      }
      for (const [id, b] of Object.entries(lentesBtn)) b.setAttribute('aria-pressed', String(id === lente));
    }

    function textoLeyenda() {
      switch (lente) {
        case 'nada': return 'Elige qué muestra cada carta.';
        case 'masa': return 'Masa atómica (u). [ ]: número másico, sin masa estándar.';
        case 'ei': return 'Energía de ionización (kJ/mol). Rayado: no medido. —: sin dato.';
        case 'en': return 'Electronegatividad, escala de Pauling. —: sin dato.';
        case 'radio': return 'Radio de van der Waals (pm). —: sin dato.';
        case 'clase': return 'Metal, semimetal, no metal o gas noble. —: sin dato.';
        case 'estado': return 'Sólido, líquido o gas a 25 °C. —: sin dato.';
      }
      return '';
    }

    function pintarSeleccion() {
      for (let z = 1; z <= 118; z++) {
        const sel = seleccion.includes(z);
        if ((cartas[z].getAttribute('aria-pressed') === 'true') !== sel) cartas[z].setAttribute('aria-pressed', String(sel));
        cartas[z].classList.toggle('tv-moviendo', z === moviendo);
      }
    }

    function linea(z) {
      const e = ELEMENTOS[z - 1];
      const l = lente === 'nada' ? 'masa' : lente;
      return `${e.simbolo} · ${e.nombre} — ${L.LENTES[l].largo}: ${L.valor(z, l).texto}`;
    }

    function pintarPanel() {
      pintarSeleccion();
      let partes = [];
      if (moviendo) partes = [`Toca el lugar donde va ${ELEMENTOS[moviendo - 1].simbolo}.`];
      else if (!seleccion.length) partes = [vista === 'mesa' ? 'Arrastra las cartas para armar tus filas. Toca una para ver sus datos.' : 'Toca una carta para ver sus datos; toca otra para compararlas.'];
      else {
        partes = seleccion.map(linea);
        if (seleccion.length === 2) {
          const d = L.comparar(seleccion[0], seleccion[1], lente === 'nada' ? 'masa' : lente);
          if (d) partes.push(d + '.');
        }
      }
      panelTexto.replaceChildren(...partes.map(p => el('p', '', { texto: p })));
      verBtn.style.visibility = seleccion.length && !moviendo ? 'visible' : 'hidden';
      moverBtn.style.visibility = vista === 'mesa' && seleccion.length ? 'visible' : 'hidden';
      moverBtn.textContent = moviendo ? 'Cancelar' : 'Mover';
      soltarBtn.style.visibility = seleccion.length && !moviendo ? 'visible' : 'hidden';
      for (const b of [verBtn, moverBtn, soltarBtn]) b.disabled = b.style.visibility === 'hidden';
    }

    function controles() {
      for (const [id, b] of Object.entries(vistas)) b.setAttribute('aria-pressed', String(id === vista));
      const verPliega = vista === 'tabla' && !larga;
      pliegaBtn.style.visibility = verPliega ? 'visible' : 'hidden';
      pliegaBtn.disabled = !verPliega;
      pliegaBtn.setAttribute('aria-expanded', String(abierta));
      pliegaBtn.textContent = abierta ? 'Plegar los grupos 3 a 12' : 'Abrir los grupos 3 a 12';
      opcMesa.hidden = vista !== 'mesa';
      for (const [id, b] of Object.entries(conjuntoBtn)) b.setAttribute('aria-pressed', String(id === conjunto));
      raizTv.dataset.vista = vista;
    }

    function anunciar(extra) {
      let t = vista === 'tabla' ? 'Tabla periódica' + (larga ? ', completa' : abierta ? ', con los grupos 3 a 12 abiertos' : ', plegada: grupos 1, 2 y 13 a 18')
        : `Mesa con ${CONJUNTOS[conjunto]} cartas mezcladas`;
      if (lente !== 'nada') t += `. Muestra: ${L.LENTES[lente].largo.toLowerCase()}`;
      estado.textContent = t + (extra ? '. ' + extra : '') + '.';
    }

    function aplicar(duracion, extra, excepto) {
      turno++;
      const t = turno;
      const r = calcular();
      actual = r;
      controles();
      anunciar(extra);
      pintarPanel();
      if (opciones.alCambiar && !primera) opciones.alCambiar(api.estado());
      if (primera || duracion === 0) { primera = false; colocar(r, 0); return Promise.resolve(); }
      if (reducido()) {
        const fuera = lienzo.animate([{ opacity: 1 }, { opacity: 0 }], { duration: T.micro, easing: CURVA.irse, fill: 'forwards' });
        return fuera.finished.then(() => {
          if (t !== turno) return;
          colocar(r, 0);
          fuera.cancel();
          return lienzo.animate([{ opacity: 0 }, { opacity: 1 }], { duration: T.corto, easing: CURVA.llegar }).finished;
        }).catch(() => {});
      }
      const escalonar = duracion >= T.paso;
      colocar(r, duracion, CURVA.trasladar, escalonar, excepto);
      return new Promise(res => setTimeout(res, duracion + (escalonar ? MAX_ESCALONES * ESCALON : 0)));
    }

    function poner(id) {
      if (!['tabla', 'mesa'].includes(id)) throw new Error(`Tabla: vista desconocida ${id}`);
      if (id === vista) return Promise.resolve();
      vista = id; moviendo = null;
      const p = aplicar(T.paso);
      llevarVista();
      return p;
    }
    function abrir(si) {
      if (vista !== 'tabla' || larga || si === abierta) return Promise.resolve();
      abierta = !!si;
      const p = aplicar(abierta ? T.largo : T.medio);
      llevarVista();
      return p;
    }
    function ponerLente(id) {
      if (!L.LENTES[id]) throw new Error(`Tabla: lente desconocida ${id}`);
      lente = id;
      pintarLente(); pintarPanel(); anunciar();
    }
    function repartir() {
      semilla = (semilla * 48271) % 2147483647 || 1;
      mesa = M.crear(enMesa(), { columnas, semilla });
      seleccion = seleccion.filter(z => z <= CONJUNTOS[conjunto]); moviendo = null;
      return aplicar(T.paso);
    }
    function ponerCartas(id) {
      if (!CONJUNTOS[id]) throw new Error(`Tabla: cartas ${id}`);
      if (id === conjunto && mesa) return Promise.resolve();
      conjunto = id;
      return repartir();
    }
    function mezclar() { return vista === 'mesa' ? repartir() : Promise.resolve(); }
    function mover(z, celda) {
      if (vista !== 'mesa') return Promise.resolve();
      mesa = M.mover(mesa, z, celda);
      moviendo = null;
      return aplicar(T.medio, `${ELEMENTOS[z - 1].simbolo} quedó en la fila ${Math.floor(M.donde(mesa, z) / mesa.columnas) + 1}`, z);
    }

    function llevarVista() {
      const destino = vista === 'tabla' && abierta && !larga ? 2 * paso : 0;
      if (scrollVisto !== destino) { marco.scrollLeft = destino; scrollVisto = destino; }
    }

    // ---------- Tocar: seleccionar, comparar, mover sin arrastrar ----------
    let tragarClic = false;
    function tocarCarta(z) {
      if (moviendo && vista === 'mesa') {
        if (z !== moviendo) return mover(moviendo, M.donde(mesa, z));
        moviendo = null; pintarPanel(); return;
      }
      if (seleccion.includes(z)) seleccion = seleccion.filter(x => x !== z);
      else seleccion = [...seleccion, z].slice(-2);
      enfocar(z);
      pintarPanel();
    }
    lienzo.addEventListener('click', ev => {
      if (tragarClic) { tragarClic = false; return; }
      const c = ev.target.closest('.tv-carta');
      if (c) return tocarCarta(Number(c.dataset.z));
      if (moviendo && vista === 'mesa') {
        const celda = celdaEn(ev.clientX, ev.clientY);
        if (celda !== null) mover(moviendo, celda);
      }
    });

    function celdaEn(cx, cy) {
      const b = lienzo.getBoundingClientRect();
      const x = Math.floor((cx - b.left) / paso), y = Math.floor((cy - b.top - top) / paso);
      if (y < 0 || !mesa) return null;
      return Math.max(0, y) * mesa.columnas + Math.max(0, Math.min(mesa.columnas - 1, x));
    }

    // ---------- Arrastrar en la mesa: sigue al dedo uno a uno ----------
    let arr = null;   // { z, id, x0, y0, tx, ty, armado, arrastrando, timer, tipo }
    lienzo.addEventListener('pointerdown', ev => {
      if (vista !== 'mesa' || ev.button > 0) return;
      const c = ev.target.closest('.tv-carta');
      if (!c || c.disabled) return;
      const z = Number(c.dataset.z), p = actual.pos[z];
      arr = { z, id: ev.pointerId, x0: ev.clientX, y0: ev.clientY, tx: p.x * paso, ty: top + p.y * paso,
        armado: ev.pointerType === 'mouse', arrastrando: false, tipo: ev.pointerType };
      if (!arr.armado) arr.timer = setTimeout(() => { if (arr) { arr.armado = true; cartas[z].classList.add('tv-lista'); } }, ESPERA_TOQUE);
    });
    lienzo.addEventListener('pointermove', ev => {
      if (!arr || ev.pointerId !== arr.id) return;
      const dx = ev.clientX - arr.x0, dy = ev.clientY - arr.y0;
      if (!arr.arrastrando) {
        const lejos = Math.hypot(dx, dy) > (arr.tipo === 'mouse' ? 4 : 8);
        if (!lejos) return;
        if (!arr.armado) { cancelarArrastre(); return; }   // el dedo se movió antes de tiempo: era un desplazamiento
        arr.arrastrando = true;
        try { lienzo.setPointerCapture(arr.id); } catch (_) { /* sin captura, igual sigue */ }
        const c = cartas[arr.z];
        c.classList.add('tv-arrastrada');
        c.style.transition = 'none';
        previo[arr.z].tx = 'none';
        destinoMarca.hidden = false;
        bucleBorde();
      }
      const c = cartas[arr.z];
      const tr = `translate(${arr.tx + dx}px, ${arr.ty + dy}px)`;
      c.style.transform = tr; previo[arr.z].tr = tr;
      arr.cx = ev.clientX; arr.cy = ev.clientY;
      const celda = celdaEn(ev.clientX, ev.clientY);
      arr.celda = celda;
      if (celda !== null) {
        const l = M.lugar(mesa, celda);
        destinoMarca.style.transform = `translate(${l.x * paso}px, ${top + l.y * paso}px)`;
      }
    });
    // Mientras se arrastra, el dedo no desplaza la página (escucha no pasiva).
    lienzo.addEventListener('touchmove', ev => { if (arr && arr.arrastrando) ev.preventDefault(); }, { passive: false });
    function bucleBorde() {
      if (!arr || !arr.arrastrando) return;
      const h = root.innerHeight || 0, y = arr.cy;
      if (y !== undefined && h) {
        if (y < 56) root.scrollBy(0, -8); else if (y > h - 56) root.scrollBy(0, 8);
      }
      requestAnimationFrame(bucleBorde);
    }
    function cancelarArrastre() {
      if (!arr) return;
      clearTimeout(arr.timer);
      cartas[arr.z].classList.remove('tv-lista', 'tv-arrastrada');
      destinoMarca.hidden = true;
      arr = null;
    }
    lienzo.addEventListener('pointerup', ev => {
      if (!arr || ev.pointerId !== arr.id) return;
      const a = arr;
      cancelarArrastre();
      if (!a.arrastrando) return;   // fue un toque: lo atiende el clic
      tragarClic = true;
      setTimeout(() => { tragarClic = false; }, 0);
      if (a.celda === null || a.celda === undefined) { aplicar(T.corto); return; }
      mover(a.z, a.celda);
    });
    lienzo.addEventListener('pointercancel', () => {
      const a = arr;
      cancelarArrastre();
      if (a && a.arrastrando) aplicar(T.corto);
    });
    lienzo.addEventListener('contextmenu', ev => { if (vista === 'mesa') ev.preventDefault(); });

    // ---------- Carta completa ----------
    function mostrarFicha(Z, origen) {
      const f = ficha(Z);
      hojaTitulo.textContent = f.titulo;
      hojaZ.textContent = `Número atómico ${f.Z}`;
      hojaLista.replaceChildren(...f.lineas.flatMap(l => [el('dt', '', { texto: l.k }), el('dd', '', { texto: l.v })]));
      hojaFuente.textContent = f.fuente;
      origenHoja = origen;
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
    function enfocar(Z, llevar) {
      if (cartas[enfocada]) cartas[enfocada].tabIndex = -1;
      enfocada = Z;
      cartas[Z].tabIndex = 0;
      if (llevar) cartas[Z].focus();
    }
    lienzo.addEventListener('keydown', ev => {
      if (ev.key === 'Escape' && moviendo) { moviendo = null; pintarPanel(); return; }
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
        const d = avance + (Math.abs(dx * dir[1]) + Math.abs(dy * dir[0])) * 3;
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
    destinoMarca.hidden = true;
    aplicar(0);
    pintarLente();
    enfocar(vista === 'mesa' ? (mesa.celdas.find(z => z !== null) || 1) : 1);
    if (ro) ro.observe(marco);

    const api = {
      poner, abrir, lente: ponerLente, cartas: ponerCartas, mezclar, mover,
      seleccionar(z) { tocarCarta(z); },
      estado: () => ({ vista, abierta: vista === 'tabla' && (abierta || larga), lente, cartas: conjunto, seleccion: seleccion.slice(),
        moviendo, mesa: mesa && { columnas: mesa.columnas, celdas: mesa.celdas.slice() }, paso, larga }),
      destruir() { if (ro) ro.disconnect(); raizTv.remove(); }
    };
    return api;
  }

  Kit.Tabla = { montar, ficha };
})(typeof self !== 'undefined' ? self : this);
