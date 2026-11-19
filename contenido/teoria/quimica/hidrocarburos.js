/*
 * Teoría de «Química orgánica: hidrocarburos» (quimica.hidrocarburos). Molde: docs/teoria.md y
 * contenido/teoria/quimica/materia-y-energia.js. Compañera: Bruna (castora), voz resolutiva y cálida.
 * Fuente del contenido: docs/teoria/matriz/quimica.json (unidad 16), su historia y las precisiones de Química del
 * expediente («el nombre no sale solo de la cadena más larga»; girar no crea isómeros). Errores:
 * docs/investigacion/quimica-materia-nomenclatura-organica-ideas-erroneas.md (HC1–HC4) y atomo-enlace (EN6). Los
 * QM- son hipótesis nuevas de esta unidad.
 *
 * Ficha de tarea (diseno-y-animacion)
 *   Promesa: leer una estructura de hidrocarburo por sus uniones: cuántos H, qué familia, si es isómero y qué reacción sufre.
 *   Persona y condiciones: postulante de 4.º–5.º, celular de 360 px, sin audio; ya sabe qué es un enlace covalente.
 *   Resultado observable: escribe la fórmula molecular de una cadena o anillo, decide si dos dibujos son la misma
 *     molécula o isómeros, reconoce cis/trans y clasifica adición, sustitución, eliminación y combustión.
 *   Orden de atención: 1.º la estructura (uniones) · 2.º la lectura con la fórmula · acción: cambiar la molécula · fondo: Bruna.
 *   Estados: juego sin tocar · casos probados · predicción · revelado · paso a paso · caso nuevo · acierto · «No sé».
 *   Duda que resuelve: ¿girar el dibujo crea otra molécula?, ¿por qué un anillo tiene menos H?, ¿toda unión suelta agua?
 *
 * Colores (regla 4): número de carbonos n turquesa c-i, número de H naranja c-o, enlace doble o triple rojo c-h,
 * ángulo verde c-d. Los átomos de las estructuras van en tinta salvo el enlace múltiple y la cadena resaltada.
 * Animación (decisión de Gerson, 15 nov: química se mueve sola): en cada idea un control «Conteo» (paso 1) avanza solo
 * y recorre la estructura como lo haría el dedo del alumno: los enlaces de cada carbono, los H de cada grupo, los
 * enlaces del anillo, la fila de carbonos, los grupos del doble enlace o el inventario de la reacción. Lo que se está
 * contando va en violeta c-f. Cada cuadro sale de la misma estructura (nada se escribe a mano); no se dibuja ningún
 * estado intermedio inventado ni dobles que «saltan» (EN6). La mesa 3D «El enlace que gira» gira φ sola, en cámara lenta.
 * Datos (no van al alumno): ángulos ideales 109,5°, 120° y 180°; longitudes C–C 154 pm, C=C 134 pm, benceno
 * 140 pm, C≡C 120 pm (OpenStax Organic Chemistry §1.8–1.9 y §15.2). Nombres según IUPAC 2013 (P-31, P-44),
 * comprobados a mano: 2-metilbutano, 2,2-dimetilpropano, but-2-eno, 2-metilbut-2-eno, butan-2-ol.
 */
(function (root, fabrica) {
  const nodo = typeof module === 'object' && module.exports;
  // El motor de plantillas/hidrocarburos da las posiciones 3D de la mesa «El enlace que gira» (conformacion).
  const def = nodo ? fabrica(require('../../../nucleo/kit/kit.js'), require('../../../plantillas/hidrocarburos/motor.js'))
    : fabrica(root.Kit, root.MotorHidrocarburos);
  if (nodo) module.exports = def;
  else root.Teoria.unidad(def);
})(typeof self !== 'undefined' ? self : this, function (Kit, MH) {
  'use strict';
  const f = (n, d = 2) => Kit.formatear(n, d);
  const nC = { v: 'c-i', t: 'n' };
  function azar(s) {
    let q = (s * 2654435761 + 12345) >>> 0;
    const r = () => { q = (q + 0x6D2B79F5) >>> 0; let z = q; z = Math.imul(z ^ (z >>> 15), z | 1); z ^= z + Math.imul(z ^ (z >>> 7), z | 61); return ((z ^ (z >>> 14)) >>> 0) / 4294967296; };
    r.ent = (lo, hi) => lo + Math.floor(r() * (hi - lo + 1));
    r.de = l => l[Math.floor(r() * l.length)];
    r.mezcla = l => { const x = l.slice(); for (let i = x.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [x[i], x[j]] = [x[j], x[i]]; } return x; };
    return r;
  }
  function opciones(correcta, distractores, fmt) {
    const vistos = new Set([fmt(correcta)]);
    const ops = [{ id: 'c', texto: fmt(correcta), correcta: true }];
    for (const d of distractores) {
      const txt = fmt(d.valor);
      if (vistos.has(txt) || d.valor === null || d.valor === undefined || (typeof d.valor === 'number' && !Number.isFinite(d.valor))) continue;
      vistos.add(txt);
      ops.push({ id: d.id, texto: txt, error: d.error, siFuera: d.siFuera });
    }
    return ops.slice(0, 4);
  }
  const SUB = '₀₁₂₃₄₅₆₇₈₉';
  const sb = n => String(n).split('').map(d => SUB[d]).join('');
  const formula = (c, h) => `C${c > 1 ? sb(c) : ''}H${h > 1 ? sb(h) : ''}`;

  // Gesto directo (docs/teoria.md §4b). La pieza recentra la figura con todo lo que trae, así que cada punto se
  // calcula con el encuadre del dibujo del valor actual. Con un control de opciones, la manija elige la opción cuya
  // manija (dibujada en su propio encuadre) queda más cerca del dedo: sobre su propio punto, devuelve la misma.
  const QM = () => Kit.piezas['quim-molecula'];
  // La manija va 22 px hacia afuera del átomo (lejos del centro de la figura) para no tapar su rótulo.
  const enFigura = (dib, id) => {
    const d = dib.datos, g = QM().encuadre(d), a = d.atomos.find(x => x.id === id);
    const x = g.X(a.x), y = g.Y(a.y), vx = x - 160, vy = y - g.alto / 2, L = Math.hypot(vx, vy);
    return L < 1 ? { x, y: y + 22 } : { x: x + 22 * vx / L, y: y + 22 * vy / L };
  };
  const cercana = (valores, donde, pt, val, id, medida) => {
    const dist = medida || ((p, q) => Math.hypot(p.x - q.x, p.y - q.y));
    let mejor = valores[0], dm = Infinity;
    for (const o of valores) { const dd = dist(donde(Object.assign({}, val, { [id]: o })), pt); if (dd < dm - 1e-9) { dm = dd; mejor = o; } }
    return mejor;
  };

  // ---------- Estructuras: nodos [id, texto, x, y, color] y enlaces [a, b, orden, color] ----------
  // Coordenadas en unidades de la pieza quim-molecula (y hacia abajo). `mover` las traslada y les da prefijo y paso.
  function mover(est, dx, dy, pref, extra = {}) {
    return {
      atomos: est.n.map(([id, t, x, y, color]) => Object.assign({ id: pref + id, t, x: x + dx, y: y + dy }, color ? { color } : {}, extra)),
      enlaces: est.e.map(([a, b, orden, color]) => Object.assign({ a: pref + a, b: pref + b, orden: orden || 1 }, color ? { color } : {}, extra)),
    };
  }
  function figura(partes, extra = {}) {
    const d = Object.assign({ atomos: [], enlaces: [], escala: 40 }, extra);
    for (const p of partes) { d.atomos.push(...p.atomos); d.enlaces.push(...p.enlaces); }
    return { datos: d, estado: {} };
  }
  const ang = (g, r = 1) => [r * Math.cos(g * Math.PI / 180), r * Math.sin(g * Math.PI / 180)];

  // Fórmulas desarrolladas de C₂: el ángulo dibujado es el real (proyección plana), 0° = hacia el otro carbono.
  function dos(tipo) {
    const L = 1.3, n = [['c1', 'C', 0, 0], ['c2', 'C', L, 0]], e = [['c1', 'c2', { etano: 1, eteno: 2, etino: 3 }[tipo], tipo === 'etano' ? null : 'h']];
    const a = { etano: [109.5, -109.5, 180], eteno: [120, -120], etino: [180] }[tipo];
    a.forEach((g, k) => { const [x, y] = ang(g, 0.95); n.push([`h1${k}`, 'H', x, y]); e.push(['c1', `h1${k}`]); n.push([`h2${k}`, 'H', L - x, y]); e.push(['c2', `h2${k}`]); });
    return { n, e };
  }
  const C2 = {
    etano: { f: 'C₂H₆', lee: 'C₂H₆: solo enlaces simples · sp³ · 109,5°', ang: '109,5°', hib: 'sp³' },
    eteno: { f: 'C₂H₄', lee: 'C₂H₄: un enlace doble · sp² · 120°', ang: '120°', hib: 'sp²' },
    etino: { f: 'C₂H₂', lee: 'C₂H₂: un enlace triple · sp · 180°', ang: '180°', hib: 'sp' },
  };
  function vistaC2(tipo, conAngulo = true) {
    const p = mover(dos(tipo), 0, 0, '');
    const ex = { escala: 52, alto: 170 };
    if (conAngulo && tipo !== 'etino') ex.angulos = [{ en: 'c1', de: 'c2', a: 'h10', texto: C2[tipo].ang, color: 'd' }];
    if (tipo === 'etino') ex.textos = [{ x: 0.65, y: 0.75, t: '180°', color: 'd' }];
    return figura([p], ex);
  }
  // La manija del enlace C–C: sobre el punto medio del enlace, más arriba cuantas más líneas tiene.
  const ORDEN_C2 = { etano: 1, eteno: 2, etino: 3 };
  const manijaC2 = val => { const g = QM().encuadre(vistaC2(val.t).datos); return { x: g.X(0.65), y: g.Y(0) - 14 - 18 * (ORDEN_C2[val.t] - 1) }; };

  // ---------- Animación: el conteo que avanza solo ----------
  // Un control «Conteo» de paso 1 avanza 1,5 pasos por segundo; durante la animación llega con decimales, así que el
  // paso del recorrido es su parte entera, dando la vuelta cuando se acaba la lista (fase).
  const conteo = max => ({ id: 'r', etiqueta: 'Conteo', color: 'c-f', min: 0, max, paso: 1, inicio: 0, unidad: '', decimales: 0, auto: { velocidad: 1.5 } });
  const fase = (r, n) => Math.floor((r || 0) + 1e-9) % n;
  const SIN = 99;                                   // desde: 99 deja un rótulo armado pero oculto (el encuadre no salta)
  // Idea 1: los enlaces de cada carbono, uno por uno (los H primero, después el enlace C–C, que vale su orden).
  function cuentaC2(tipo) {
    const d = dos(tipo), pasos = [];
    for (const c of ['c1', 'c2']) {
      let suma = 0;
      for (const e of [...d.e.filter(x => x[0] === c && x[1] !== 'c1' && x[1] !== 'c2'), d.e[0]]) {
        suma += e[2] || 1; pasos.push({ c, e, suma });
      }
    }
    pasos.push({ fin: true });
    return { d, pasos };
  }
  function vistaC2Viva(val) {
    const fig = vistaC2(val.t), { d, pasos } = cuentaC2(val.t), k = fase(val.r, pasos.length), p = pasos[k];
    const pos = new Map(d.n.map(([id, , x, y]) => [id, [x, y]]));
    // Rótulo con la suma de cada enlace: afuera de su H, o sobre el enlace C–C del lado del carbono que se cuenta.
    // Visibles solo los ya contados del carbono que se mira.
    fig.datos.textos = (fig.datos.textos || []).concat(pasos.filter(q => !q.fin).map((q, j) => {
      const [c, o, orden] = q.e, C = pos.get(c), O = pos.get(o), L = Math.hypot(O[0] - C[0], O[1] - C[1]) || 1;
      const esCC = o === 'c2', xy = esCC ? [q.c === 'c1' ? 0.22 : 1.08, -0.5] : [O[0] + 0.42 * (O[0] - C[0]) / L, O[1] + 0.42 * (O[1] - C[1]) / L];
      const t = (orden || 1) > 1 ? Array.from({ length: orden }, (_, i) => q.suma - orden + 1 + i).join('·') : String(q.suma);
      return { x: xy[0], y: xy[1], t, color: 'f', desde: !p.fin && q.c === p.c && j <= k ? 0 : SIN };
    }));
    if (!p.fin) fig.datos.resaltos = [{ atomos: [p.c], color: 'f' }];
    return { fig, p };
  }

  // ---------- Idea 1: cuatro enlaces por carbono; la forma sale de los enlaces múltiples ----------
  // Cambia: el enlace entre los dos carbonos · Permanece: dos carbonos y la regla de cuatro enlaces · Progresa: simple,
  // doble, triple: menos H y ángulo más abierto · Se reserva: el propeno, donde cada carbono tiene su propia forma ·
  // Debe verse: que cada C siempre suma cuatro enlaces.
  function propeno(angulos) {
    const n = [['a', 'C', 0, 0], ['b', 'C', 1.3, 0], ['c', 'C', 1.95, 1.13]];
    const e = [['a', 'b', 2, 'h'], ['b', 'c']];
    n.push(['ha', 'H', -0.65, -0.82], ['hb', 'H', -0.65, 0.82], ['hc', 'H', 1.95, -0.82]);
    e.push(['a', 'ha'], ['a', 'hb'], ['b', 'hc']);
    // Carbono del CH₃: su vecino b está a −120°; dos H a 109,5° de ese enlace (dibujados con su ángulo real) y el
    // tercero en proyección.
    for (const [id, g] of [['h3', -10.5], ['h1', 130.5], ['h2', 60]]) { const [x, y] = ang(g, 0.95); n.push([id, 'H', 1.95 + x, 1.13 + y]); }
    e.push(['c', 'h1'], ['c', 'h2'], ['c', 'h3']);
    const extra = { escala: 44, alto: 200 };
    if (angulos) extra.angulos = [{ en: 'c', de: 'b', a: 'h3', texto: '109,5°', color: 'd' }, { en: 'a', de: 'b', a: 'ha', texto: '120°', color: 'd' }];
    return figura([mover({ n, e }, 0, 0, '')], extra);
  }
  // Fórmula de una cadena abierta con un solo enlace múltiple: la usan «Ahora tú» y «Así se resuelve».
  const EXTRA_FAM = { alcano: 0, alqueno: 1, alquino: 2 };
  const hFamilia = (tipo, n) => 2 * n + 2 - 2 * EXTRA_FAM[tipo];
  const DESC_FAM = { alcano: 'solo enlaces simples', alqueno: 'un solo enlace doble', alquino: 'un solo enlace triple' };
  const ecFamilia = tipo => ['C', { sub: ['', [nC]] }, 'H', { sub: ['', { alcano: ['2', nC, ' + 2'], alqueno: ['2', nC], alquino: ['2', nC, ' − 2'] }[tipo]] }];
  const carbono = {
    id: 'carbono-enlaces',
    titulo: 'Cuatro enlaces por carbono',
    temas: ['El carbono e hibridación', 'Alcanos, alquenos y alquinos'],
    pieza: 'quim-molecula',
    // Lee (fase 2): contexto y vocabulario. No dice qué forma toma cada carbono del propeno (eso es la predicción).
    lee: {
      tarjetas: [
        { titulo: 'Lo que arde en casa', texto: 'El gas del balón de cocina es sobre todo propano y butano. Son hidrocarburos: compuestos hechos solo de carbono e hidrógeno. El petróleo y el gas natural también lo son.' },
        { titulo: 'Líneas que se cuentan', texto: 'En el dibujo, cada línea es un enlace. Dos líneas entre los mismos átomos forman un enlace doble, y tres, un enlace triple. El doble cuenta como dos enlaces al sumar.',
          ecuacion: ['C–C · C=C · C≡C'] },
        { titulo: 'Qué mirar al jugar', texto: 'El conteo recorre un carbono a la vez. Cambia el enlace C–C y fíjate en dos cosas: cuántos H quedan y qué pasa con el ángulo verde.' },
      ],
    },
    juega: {
      consigna: 'El conteo recorre los enlaces de cada carbono solo. Cambia el enlace C–C y mira: siempre llega a 4, y el ángulo se abre.',
      voz: 'Cuenta los enlaces de un carbono: el doble vale dos.',
      controles: [{ id: 't', etiqueta: 'Enlace C–C', opciones: [{ valor: 'etano', texto: 'Simple' }, { valor: 'eteno', texto: 'Doble' }, { valor: 'etino', texto: 'Triple' }] }, conteo(9)],
      dibujo: val => vistaC2Viva(val).fig,
      lectura: val => { const { p } = vistaC2Viva(val), c = C2[val.t];
        return [p.fin ? `Cada C: 4 enlaces · ${c.f} · ${c.hib} · ${c.ang}` : `C ${p.c === 'c1' ? 'izquierdo' : 'derecho'}: lleva ${p.suma} ${p.suma === 1 ? 'enlace' : 'enlaces'} · ${c.f} · ${c.ang}`]; },
      minimo: 3,
      // Se agarra el enlace C–C y se tira hacia arriba: cada tramo suma una línea al enlace (simple, doble, triple).
      // Responden los H, que bajan de 6 a 4 y a 2, y el ángulo, que se abre de 109,5° a 120° y a 180°.
      arrastres: [{ id: 'enlace', etiqueta: 'enlace C–C: tira hacia arriba para sumar líneas', color: 'c-h',
        donde: manijaC2,
        mover: (pt, val) => ({ t: cercana(Object.keys(C2), manijaC2, pt, val, 't') }) }],
    },
    predice: {
      pregunta: 'En el propeno, CH₂=CH–CH₃, un carbono tiene enlace doble y el del CH₃ solo simples. ¿Qué ángulo hay alrededor del carbono del CH₃?',
      voz: 'Mira cada carbono por separado.',
      opciones: [
        { id: 'c', texto: '109,5°, como en el etano', correcta: true },
        { id: 'toda', texto: '120°: el doble enlace manda en toda la molécula', error: 'QM-HIBRIDA-TODO', siFuera: '120° vale para los dos carbonos del doble enlace. El del CH₃ solo tiene enlaces simples.' },
        { id: 'plano', texto: '90°, como se ve en el papel', error: 'EN8', siFuera: 'En el papel puede verse así. La forma real sale de cuatro enlaces separados en el espacio.' },
        { id: 'lineal', texto: '180°', error: 'QM-HIBRIDA-TODO', siFuera: '180° sería con un enlace triple en ese carbono.' },
      ],
      dibujo: propeno(false),
      revelar: propeno(true),
      coincide: 'Coincide: cada carbono toma su forma según sus propios enlaces.',
      noCoincide: 'El carbono del CH₃ solo tiene simples: 109,5°, aunque su vecino tenga un doble.',
    },
    mira: {
      datos: (() => {
        const ps = [mover(dos('etano'), 0, 0, 'a', { desde: 1 }), mover(dos('eteno'), 0, 2.4, 'b', { desde: 2 }), mover(dos('etino'), 0, 4.6, 'c', { desde: 3 })];
        return figura(ps, {
          escala: 36,
          textos: [{ x: 4.4, y: 0, t: 'C₂H₆ · sp³', desde: 1, color: 'o' }, { x: 4.4, y: 2.4, t: 'C₂H₄ · sp²', desde: 2, color: 'o' }, { x: 4.4, y: 4.6, t: 'C₂H₂ · sp', desde: 3, color: 'o' }],
        }).datos;
      })(),
      voz: 'Comparemos las tres moléculas, carbono por carbono.',
      pasos: [
        { estado: { corte: 1 }, texto: 'Solo simples: cada C tiene 4 vecinos a 109,5°. Alcano.', ecuacion: ['C', { sub: ['', [nC]] }, 'H', { sub: ['', ['2', nC, ' + 2']] }] },
        { estado: { corte: 2 }, texto: 'Un doble: el C tiene 3 vecinos a 120°. Alqueno, dos H menos.', ecuacion: ['C', { sub: ['', [nC]] }, 'H', { sub: ['', ['2', nC]] }] },
        { estado: { corte: 3 }, texto: 'Un triple: 2 vecinos en línea, a 180°. Alquino, otros dos H menos.', ecuacion: ['C', { sub: ['', [nC]] }, 'H', { sub: ['', ['2', nC, ' − 2']] }] },
        { estado: { corte: 3 }, texto: 'En los tres, cada carbono suma cuatro enlaces.' },
      ],
    },
    regla: {
      texto: 'Cada carbono forma cuatro enlaces. Con solo simples queda sp³ (109,5°); con un doble, sp² (120°); con un triple, sp (180°). Cada enlace extra quita dos H.',
      ecuacion: [
        { llave: ['C', { sub: ['', [nC]] }, 'H', { sub: ['', ['2', nC, ' + 2']] }], nota: 'alcano: simples' }, '   ·   ',
        { llave: ['C', { sub: ['', [nC]] }, 'H', { sub: ['', ['2', nC]] }], nota: 'alqueno: un doble', color: 'c-h' }, '   ·   ',
        { llave: ['C', { sub: ['', [nC]] }, 'H', { sub: ['', ['2', nC, ' − 2']] }], nota: 'alquino: un triple', color: 'c-h' },
      ],
      condicion: 'las fórmulas generales valen para cadenas abiertas con un solo doble o triple. La hibridación se decide carbono por carbono.',
      voz: 'Primero los enlaces de cada carbono; la forma viene sola.',
    },
    // Así se resuelve (fase 2): el mismo problema de «Ahora tú» (fórmula de una cadena abierta), con otras semillas.
    resuelve: {
      generar(s) {
        const r = azar(s + 900), n = r.ent(3, 9), tipo = ['alcano', 'alqueno', 'alquino'][r.ent(0, 2)];
        const h = hFamilia(tipo, n), desc = DESC_FAM[tipo], extra = EXTRA_FAM[tipo], u = n - 1 + extra;
        const cuenta = { alcano: `2 · ${n} + 2`, alqueno: `2 · ${n}`, alquino: `2 · ${n} − 2` }[tipo];
        return {
          enunciado: ['Una cadena abierta de ', nC, ` = ${n} carbonos tiene ${desc}. ¿Cuál es su fórmula molecular?`],
          pasos: [
            { tipo: 'pide', texto: 'Piden la fórmula molecular: cuántos átomos de C y cuántos de H tiene la cadena.' },
            { tipo: 'datos', texto: ['Hay ', nC, ` = ${n} carbonos en cadena abierta, con ${desc}.`] },
            { tipo: 'regla', texto: 'Cada carbono forma cuatro enlaces. Con solo simples, la cadena lleva 2n + 2 H. Cada línea extra entre carbonos ocupa dos lugares y quita dos H.',
              ecuacion: ecFamilia(tipo) },
            { tipo: 'cuentas', texto: ['Es un ', tipo, ': reemplazo ', nC, ` = ${n} en su fórmula.`], ecuacion: [`H = ${cuenta} = ${h}   →   ${formula(n, h)}`] },
            { tipo: 'sentido', texto: `Compruebo con los enlaces: los ${n} carbonos ponen 4 cada uno. Los H usan ${h} y las ${u} líneas entre carbonos usan dos lugares cada una.`,
              ecuacion: [`4 · ${n} = ${h} + 2 · ${u} = ${4 * n}`] },
          ],
          respuesta: `${formula(n, h)}, un ${tipo}`,
        };
      },
    },
    ahoraTu: {
      voz: 'Cuenta los carbonos y fíjate en el enlace.',
      generar(s) {
        const r = azar(s), n = r.ent(3, 9), tipo = ['alcano', 'alqueno', 'alquino'][s % 3];
        const h = hFamilia(tipo, n);
        const desc = DESC_FAM[tipo];
        return {
          pregunta: ['Una cadena abierta de ', nC, ` = ${n} carbonos tiene ${desc}. ¿Cuál es su fórmula molecular?`],
          opciones: opciones(h, [
            { id: 'alcano', valor: 2 * n + 2, error: 'QM-FORMULA-GENERAL', siFuera: 'Esa es la fórmula con solo enlaces simples. Cada enlace extra quita dos H.' },
            { id: 'alqueno', valor: 2 * n, error: 'QM-FORMULA-GENERAL', siFuera: 'Esa corresponde a un solo enlace doble (o a un anillo).' },
            { id: 'alquino', valor: 2 * n - 2, error: 'QM-FORMULA-GENERAL', siFuera: 'Esa corresponde a un solo enlace triple.' },
            { id: 'cuatro', valor: 4 * n, error: 'QM-4H', siFuera: 'Eso da 4 H a cada carbono. Los enlaces entre carbonos también ocupan lugares.' },
          ], hh => formula(n, hh)),
          solucion: { texto: `Con ${desc}, la familia es ${tipo}.`, ecuacion: [{ alcano: 'CₙH₂ₙ₊₂', alqueno: 'CₙH₂ₙ', alquino: 'CₙH₂ₙ₋₂' }[tipo], ` → ${formula(n, h)}`] },
        };
      },
    },
  };

  // ---------- Fórmulas semidesarrolladas: cadenas y anillos ----------
  const zig = (ts, dx = 1.15, dy = 0.6) => ({ n: ts.map((t, i) => [`k${i}`, t, i * dx, i % 2 ? dy : 0]), e: ts.slice(1).map((_, i) => [`k${i}`, `k${i + 1}`]) });
  function anillo(ts, lado = 1.25, ordenes = []) {
    const k = ts.length, R = lado / (2 * Math.sin(Math.PI / k)), g0 = -90 + (k % 2 ? 0 : 180 / k);
    return { n: ts.map((t, i) => { const [x, y] = ang(g0 + 360 * i / k, R); return [`r${i}`, t, x, y]; }), e: ts.map((_, i) => [`r${i}`, `r${(i + 1) % k}`, ordenes[i] || 1, ordenes[i] > 1 ? 'h' : null]) };
  }
  // Desarrolladas de C₄ (todas las uniones y todos los H).
  function desarrollada(tipo) {
    if (tipo === 'lineal') {
      const n = [], e = [];
      for (let i = 0; i < 4; i++) { n.push([`c${i}`, 'C', i * 1.2, 0], [`a${i}`, 'H', i * 1.2, -0.95], [`b${i}`, 'H', i * 1.2, 0.95]); e.push([`c${i}`, `a${i}`], [`c${i}`, `b${i}`]); if (i) e.push([`c${i - 1}`, `c${i}`]); }
      n.push(['hi', 'H', -0.95, 0], ['hd', 'H', 3.6 + 0.95, 0]); e.push(['c0', 'hi'], ['c3', 'hd']);
      return { n, e };
    }
    if (tipo === 'ramificada') {
      const n = [['c', 'C', 1.2, 0], ['i', 'C', 0, 0], ['d', 'C', 2.4, 0], ['b', 'C', 1.2, 1.2], ['hc', 'H', 1.2, -0.95]], e = [['c', 'i'], ['c', 'd'], ['c', 'b'], ['c', 'hc']];
      n.push(['i1', 'H', -0.95, 0], ['i2', 'H', 0, -0.95], ['i3', 'H', -0.55, 0.8], ['d1', 'H', 3.35, 0], ['d2', 'H', 2.4, -0.95], ['d3', 'H', 2.95, 0.8], ['b1', 'H', 0.3, 1.4], ['b2', 'H', 2.1, 1.4], ['b3', 'H', 1.2, 2.15]);
      e.push(['i', 'i1'], ['i', 'i2'], ['i', 'i3'], ['d', 'd1'], ['d', 'd2'], ['d', 'd3'], ['b', 'b1'], ['b', 'b2'], ['b', 'b3']);
      return { n, e };
    }
    const n = [['c0', 'C', 0, 0], ['c1', 'C', 1.3, 0], ['c2', 'C', 1.3, 1.3], ['c3', 'C', 0, 1.3]], e = [['c0', 'c1'], ['c1', 'c2'], ['c2', 'c3'], ['c3', 'c0']];
    [[-1, -1], [1, -1], [1, 1], [-1, 1]].forEach(([dx, dy], i) => {
      const [, , x, y] = n[i];
      n.push([`h${i}a`, 'H', x + dx * 0.85, y], [`h${i}b`, 'H', x, y + dy * 0.85]);
      e.push([`c${i}`, `h${i}a`], [`c${i}`, `h${i}b`]);
    });
    return { n, e };
  }
  const SEMI = {
    lineal: zig(['CH₃', 'CH₂', 'CH₂', 'CH₃']),
    ramificada: { n: [['k0', 'CH₃', 0, 0], ['k1', 'CH', 1.15, 0], ['k2', 'CH₃', 2.3, 0], ['k3', 'CH₃', 1.15, 1.1]], e: [['k0', 'k1'], ['k1', 'k2'], ['k1', 'k3']] },
    ciclica: anillo(['CH₂', 'CH₂', 'CH₂', 'CH₂'], 1.35),
  };
  const vistaCadena = val => figura([mover(val.f === 'des' ? desarrollada(val.c) : SEMI[val.c], 0, 0, '')], { escala: val.f === 'des' ? 40 : 44, alto: 200 });
  // El carbono que se mueve en cada estructura: el extremo de la cadena, la rama o el que cierra el anillo.
  const EXTREMO = { semi: { lineal: 'k3', ramificada: 'k3', ciclica: 'r3' }, des: { lineal: 'c3', ramificada: 'b', ciclica: 'c3' } };
  const CADENA = { lineal: ['C₄H₁₀', 'cadena lineal'], ramificada: ['C₄H₁₀', 'cadena ramificada'], ciclica: ['C₄H₈', 'cadena cerrada (anillo)'] };
  // Animación: el conteo pasa por cada carbono y suma sus H (los del grupo, o los átomos H unidos a él en la desarrollada).
  const DIG = s => [...String(s)].reduce((a, ch) => a * 10 + SUB.indexOf(ch), 0);
  const hDeGrupo = t => { const m = /^C(H([₀-₉]*))?$/.exec(t); return m && m[1] ? (m[2] ? DIG(m[2]) : 1) : 0; };
  function sumaH(est) {
    const pasos = [];
    let suma = 0;
    for (const [id, t] of est.n) {
      if (!/^C/.test(t)) continue;
      const hs = t === 'C' ? est.e.filter(e => e.includes(id)).map(e => (e[0] === id ? e[1] : e[0])).filter(o => est.n.find(x => x[0] === o)[1] === 'H') : [];
      const h = t === 'C' ? hs.length : hDeGrupo(t);
      suma += h; pasos.push({ id, h, suma, atomos: [id, ...hs] });
    }
    pasos.push({ fin: true, suma });
    return pasos;
  }
  const estCadena = val => (val.f === 'des' ? desarrollada(val.c) : SEMI[val.c]);
  function vistaCadenaViva(val) {
    const fig = vistaCadena(val), pasos = sumaH(estCadena(val)), p = pasos[fase(val.r, pasos.length)];
    if (!p.fin) fig.datos.resaltos = [{ atomos: p.atomos, color: 'f' }];
    return { fig, p };
  }
  // Estructura al azar de la idea 2 (la usan «Ahora tú» y «Así se resuelve»): anillo de CH₂, cadena con una rama
  // en el carbono 2 o cadena lineal, de 3 a 6 carbonos.
  function cadenaAzar(r, cic) {
    const n = r.ent(3, 6);
    let est, h, ram = false;
    if (cic) { est = anillo(Array(n).fill('CH₂')); h = 2 * n; }
    else if (n >= 4 && r() < 0.5) { const ts = ['CH₃', 'CH', ...Array(n - 4).fill('CH₂'), 'CH₃']; est = zig(ts); est.n.push(['m', 'CH₃', 1.15, 1.6]); est.e.push(['k1', 'm']); h = 2 * n + 2; ram = true; }
    else { est = zig(['CH₃', ...Array(n - 2).fill('CH₂'), 'CH₃']); h = 2 * n + 2; }
    return { n, est, h, ram };
  }
  const formulas = {
    id: 'formulas-cadenas',
    titulo: 'Una molécula, varias fórmulas',
    temas: ['Tipos de fórmulas y cadenas', 'Cicloalcanos'],
    pieza: 'quim-molecula',
    // Lee (fase 2): los tres tipos de fórmula y de cadena. No dice cuántos H tiene un anillo (eso es la predicción).
    lee: {
      tarjetas: [
        { titulo: 'Tres maneras de escribir', texto: 'El butano del encendedor se puede escribir C₄H₁₀, que solo cuenta átomos. También CH₃–CH₂–CH₂–CH₃, que muestra los grupos, o con cada enlace dibujado.',
          ecuacion: ['molecular · semidesarrollada · desarrollada'] },
        { titulo: 'Tres formas de cadena', texto: 'Los carbonos pueden ir en fila, en una cadena lineal; con ramas que cuelgan, en una cadena ramificada; o cerrados en anillo. Al anillo se le pone «ciclo» delante: ciclobutano.' },
        { titulo: 'Qué mirar al jugar', texto: 'El conteo suma los H grupo por grupo. Cambia de fórmula y mira si el total cambia. Después compara la cadena abierta con el anillo.' },
      ],
    },
    juega: {
      consigna: 'El conteo suma los H carbono por carbono, solo. Elige cadena y fórmula: ¿el total cambia al escribirla de otra forma? ¿Y en el anillo?',
      voz: 'Las dos fórmulas dicen lo mismo; una lo dice más corto.',
      controles: [
        { id: 'c', etiqueta: 'Cadena', opciones: [{ valor: 'lineal', texto: 'Lineal' }, { valor: 'ramificada', texto: 'Ramificada' }, { valor: 'ciclica', texto: 'Anillo' }] },
        { id: 'f', etiqueta: 'Fórmula', opciones: [{ valor: 'semi', texto: 'Semidesarrollada' }, { valor: 'des', texto: 'Desarrollada' }] },
        conteo(5),
      ],
      dibujo: val => vistaCadenaViva(val).fig,
      lectura: val => { const { p } = vistaCadenaViva(val);
        return [p.fin ? `${CADENA[val.c][0]} · ${CADENA[val.c][1]}` : `Este carbono: +${p.h} H · van ${p.suma} H`]; },
      minimo: 4,
      // Se agarra el último carbono: a la derecha deja la cadena lineal, bajo el del medio la vuelve rama y junto
      // al primero cierra el anillo. Responde la fórmula de la lectura: el anillo pierde dos H.
      arrastres: [{ id: 'extremo', etiqueta: 'último carbono: estíralo, cuélgalo o ciérralo', color: 'c-i',
        donde: val => enFigura(vistaCadena(val), EXTREMO[val.f][val.c]),
        mover: (pt, val) => ({ c: cercana(['lineal', 'ramificada', 'ciclica'], v => enFigura(vistaCadena(v), EXTREMO[v.f][v.c]), pt, val, 'c') }) }],
    },
    predice: {
      pregunta: 'Unes los dos extremos del pentano (CH₃–CH₂–CH₂–CH₂–CH₃, C₅H₁₂) y formas un anillo con solo enlaces simples, el ciclopentano. ¿Cuál es su fórmula molecular?',
      voz: 'Piensa qué tiene que soltar cada extremo para unirse.',
      opciones: [
        { id: 'c', texto: 'C₅H₁₀', correcta: true },
        { id: 'igual', texto: 'C₅H₁₂, como el pentano', error: 'QM-ANILLO', siFuera: 'Los carbonos son los mismos, cierto. Pero cada extremo suelta un H para unirse con el otro.' },
        { id: 'cuatro', texto: 'C₅H₈', error: 'QM-ANILLO', siFuera: 'C₅H₈ sería un anillo con además un enlace doble. Cerrar el anillo quita solo dos H.' },
        { id: 'uno', texto: 'C₅H₅', error: 'QM-4H', siFuera: 'Un H por carbono dejaría carbonos con tres enlaces. Cada CH₂ del anillo lleva dos H.' },
      ],
      dibujo: figura([mover(zig(['CH₃', 'CH₂', 'CH₂', 'CH₂', 'CH₃']), 0, 0, '')], { escala: 44, alto: 190 }),
      revelar: figura([mover(anillo(['CH₂', 'CH₂', 'CH₂', 'CH₂', 'CH₂']), 0, 0, '')], { escala: 44, alto: 190, textos: [{ x: 0, y: 0.15, t: 'C₅H₁₀', color: 'o' }] }),
      coincide: 'Coincide: el anillo tiene dos H menos que la cadena abierta.',
      noCoincide: 'Cada extremo suelta un H para cerrar el anillo: C₅H₁₂ pasa a C₅H₁₀.',
    },
    mira: {
      datos: figura([
        mover(zig(['CH₃', 'CH₂', 'CH₂', 'CH₃']), -1.7, 0, 'a', { desde: 1, hasta: 2 }),
        mover(anillo(['CH₂', 'CH₂', 'CH₂', 'CH₂'], 1.35), 0, 2.6, 'b', { desde: 3 }),
      ], {
        escala: 44,
        textos: [
          { x: 0, y: -0.9, t: 'butano: C₄H₁₀', color: 'o', desde: 1, hasta: 2 },
          { x: -1.7, y: 1.3, t: '−1 H', color: 'o', desde: 2, hasta: 2 }, { x: 1.75, y: 1.3, t: '−1 H', color: 'o', desde: 2, hasta: 2 },
          { x: 0, y: 2.6, t: 'C₄H₈', color: 'o', desde: 3 },
        ],
      }).datos,
      voz: 'Sigamos el inventario de H mientras se cierra el anillo.',
      pasos: [
        { estado: { corte: 1 }, texto: 'Butano: cuatro carbonos en cadena abierta, 10 H.', ecuacion: ['CH₃–CH₂–CH₂–CH₃ = C₄H₁₀'] },
        { estado: { corte: 2 }, texto: 'Para unirse, cada extremo suelta un H.', ecuacion: ['10 − 2 = 8 H'] },
        { estado: { corte: 3 }, texto: 'El anillo: cuatro CH₂, todos iguales. Ciclobutano.', ecuacion: ['C₄H₈ = CₙH₂ₙ'] },
        { estado: { corte: 3 }, texto: 'C₄H₈ también es la fórmula de un buteno: la fórmula sola no distingue.' },
      ],
    },
    regla: {
      texto: 'La fórmula molecular cuenta átomos; la semidesarrollada y la desarrollada muestran las uniones. Cerrar una cadena en anillo quita dos H: un cicloalcano es CₙH₂ₙ.',
      ecuacion: [{ llave: ['C', { sub: ['', [nC]] }, 'H', { sub: ['', ['2', nC, ' + 2']] }], nota: 'cadena abierta' }, ' → ', { llave: ['C', { sub: ['', [nC]] }, 'H', { sub: ['', ['2', nC]] }], nota: 'un anillo' }],
      condicion: 'anillos con solo enlaces simples. La fórmula molecular sola no distingue un anillo de un doble enlace: C₄H₈ puede ser ambos.',
      voz: 'Cuenta los H de cada carbono y súmalos.',
    },
    // Así se resuelve (fase 2): la misma estructura al azar de «Ahora tú» (cadenaAzar), con otras semillas.
    resuelve: {
      generar(s) {
        const r = azar(s + 900), cic = s % 3 === 1, { n, est, h, ram } = cadenaAzar(r, cic);
        const hs = est.n.map(x => hDeGrupo(x[1])), dib = figura([mover(est, 0, 0, '')], { escala: 42, alto: 190 });
        const forma = cic ? 'cerrados en anillo' : ram ? 'en cadena abierta con una rama' : 'en cadena abierta, sin ramas';
        return {
          enunciado: `¿Cuál es la fórmula molecular de esta estructura de ${n} carbonos ${cic ? 'en anillo' : 'en cadena abierta'}?`,
          dibujo: dib,
          pasos: [
            { tipo: 'pide', texto: 'Piden la fórmula molecular: el total de átomos de C y de H de la estructura.' },
            { tipo: 'datos', texto: ['Hay ', nC, ` = ${n} grupos con carbono, ${forma}.`] },
            { tipo: 'regla', texto: 'Cada grupo trae sus H escritos: CH₃ tiene 3, CH₂ tiene 2 y CH tiene 1. La fórmula molecular junta todos los C y todos los H.' },
            { tipo: 'cuentas', texto: 'Sumo los H grupo por grupo, en el orden del dibujo.', ecuacion: [`H = ${hs.join(' + ')} = ${h}   →   ${formula(n, h)}`],
              dibujo: figura([mover(est, 0, 0, '')], { escala: 42, alto: 190, resaltos: [{ atomos: est.n.map(x => x[0]), color: 'o' }] }) },
            { tipo: 'sentido', texto: cic ? ['Con la fórmula del anillo, 2 · ', nC, ` = ${2 * n} H: coincide con la suma.`] : ['Con la fórmula de la cadena abierta, 2 · ', nC, ` + 2 = ${2 * n + 2} H: coincide con la suma.`],
              ecuacion: [cic ? 'CₙH₂ₙ' : 'CₙH₂ₙ₊₂', ` → ${formula(n, h)}`] },
          ],
          respuesta: formula(n, h),
        };
      },
    },
    ahoraTu: {
      voz: 'Suma los H de cada grupo.',
      generar(s) {
        const r = azar(s), cic = s % 2 === 1, { n, est, h } = cadenaAzar(r, cic);
        return {
          pregunta: '¿Cuál es la fórmula molecular de esta estructura?',
          dibujo: figura([mover(est, 0, 0, '')], { escala: 42, alto: 190 }),
          opciones: opciones(h, [
            { id: 'abierta', valor: cic ? 2 * n + 2 : 2 * n, error: 'QM-ANILLO', siFuera: cic ? 'Esa sería la cadena abierta. El anillo tiene dos H menos.' : 'Esa sería con un anillo o un doble. Aquí la cadena está abierta, solo con simples.' },
            { id: 'cuatro', valor: 4 * n, error: 'QM-4H', siFuera: 'Eso da 4 H a cada carbono. Los enlaces entre carbonos ocupan lugares.' },
            { id: 'dos', valor: 2 * n - 2, error: 'QM-FORMULA-GENERAL', siFuera: 'Esa tendría un enlace triple o dos anillos. Aquí no los hay.' },
          ], hh => formula(n, hh)),
          solucion: { texto: `Hay ${n} carbonos; sumando los H de cada grupo salen ${h}.`, ecuacion: [formula(n, h), cic ? ' = CₙH₂ₙ (anillo)' : ' = CₙH₂ₙ₊₂'] },
        };
      },
    },
  };

  // ---------- Idea 3: el benceno, un anillo con los dobles repartidos ----------
  // Cambia: la estructura que se mira · Permanece: el hexágono de seis carbonos · Progresa: de dos fórmulas con
  // dobles alternados a una sola molécula con enlaces iguales · Se reserva: la medida de los enlaces (140 pm) · Debe
  // verse: que las dos fórmulas de Kekulé solo cambian dónde se dibujan los dobles.
  const BENZ_A = [2, 1, 2, 1, 2, 1], BENZ_B = [1, 2, 1, 2, 1, 2];
  const ANILLOS = {
    'kekule-a': { est: anillo(Array(6).fill('CH'), 1.2, BENZ_A), lee: 'C₆H₆, benceno: tres dobles alternados en todo el anillo.', arom: true, nombre: 'benceno' },
    'kekule-b': { est: anillo(Array(6).fill('CH'), 1.2, BENZ_B), lee: 'C₆H₆: los mismos átomos, dobles dibujados en el otro lugar.', arom: true, nombre: 'benceno' },
    tolueno: { est: (() => { const a = anillo(['C', 'CH', 'CH', 'CH', 'CH', 'CH'], 1.2, BENZ_A); a.n.push(['m', 'CH₃', 0, -2.35]); a.e.push(['r0', 'm']); return a; })(), lee: 'C₇H₈, tolueno: benceno con un CH₃. Aromático.', arom: true, nombre: 'tolueno' },
    ciclohexano: { est: anillo(Array(6).fill('CH₂'), 1.2), lee: 'C₆H₁₂, ciclohexano: solo simples. Anillo, pero no aromático.', arom: false, nombre: 'ciclohexano' },
    ciclohexeno: { est: anillo(['CH', 'CH', 'CH₂', 'CH₂', 'CH₂', 'CH₂'], 1.2, [2]), lee: 'C₆H₁₀, ciclohexeno: un solo doble. No aromático.', arom: false, nombre: 'ciclohexeno' },
  };
  const vistaAnillo = (k, extra = {}) => figura([mover(ANILLOS[k].est, 0, 0, '')], Object.assign({ escala: 44, alto: 220 }, extra));
  // Animación: el conteo da la vuelta al anillo enlace por enlace y compara cada uno con el anterior. Los dobles no se
  // mueven nunca (moverlos actuaría EN6): solo avanza la marca violeta.
  function vueltaAnillo(k) {
    const anillo6 = ANILLOS[k].est.e.filter(e => /^r/.test(e[0]) && /^r/.test(e[1])), o = e => e[2] || 1;
    return [...anillo6.map((e, i) => ({ e, i, doble: o(e) === 2, alterna: o(e) !== o(anillo6[(i + 5) % 6]) })), { fin: true }];
  }
  function vistaAnilloViva(val) {
    const pasos = vueltaAnillo(val.k), p = pasos[fase(val.r, pasos.length)];
    return { fig: vistaAnillo(val.k, p.fin ? {} : { resaltos: [{ atomos: [p.e[0], p.e[1]], color: 'f' }] }), p };
  }
  const aromatico = {
    id: 'aromaticos',
    titulo: 'El benceno y sus dobles repartidos',
    temas: ['Aromáticos'],
    pieza: 'quim-molecula',
    // Lee (fase 2): contexto y vocabulario del anillo. No dice cómo son los enlaces del benceno real (la predicción).
    lee: {
      tarjetas: [
        { titulo: 'Un anillo famoso', texto: 'El benceno, C₆H₆, es un anillo de seis carbonos que viene en el petróleo. De él se fabrican plásticos como el tecnopor, tintes y medicinas. Es tóxico: no hay que respirarlo.' },
        { titulo: 'Aromático no es perfume', texto: 'La palabra «aromático» nació porque los primeros compuestos de este tipo tenían olor fuerte. Hoy, en química, nombra un tipo especial de anillo, no un olor.' },
        { titulo: 'Qué mirar al jugar', texto: 'El conteo da la vuelta al anillo enlace por enlace. En cada anillo, fíjate cuántos dobles hay y si cada doble queda entre dos simples.' },
      ],
    },
    juega: {
      consigna: 'El conteo da la vuelta al anillo, enlace por enlace. Compara anillos: ¿cada doble va entre dos simples en toda la vuelta?',
      voz: 'Compara dónde van los dobles, no la forma del anillo.',
      controles: [{ id: 'k', etiqueta: 'Anillo', opciones: Object.keys(ANILLOS).map(k => ({ valor: k, texto: { 'kekule-a': 'Benceno A', 'kekule-b': 'Benceno B', tolueno: 'Tolueno', ciclohexano: 'Ciclohexano', ciclohexeno: 'Ciclohexeno' }[k] })) }, conteo(7)],
      dibujo: val => vistaAnilloViva(val).fig,
      lectura: val => { const { p } = vistaAnilloViva(val);
        return [p.fin ? ANILLOS[val.k].lee : `Enlace ${p.i + 1} de 6: ${p.doble ? 'doble' : 'simple'} · ${p.alterna ? 'alterna' : 'no alterna'}`]; },
      minimo: 3,
      // Sin arrastre, a propósito: lo natural sería deslizar un doble por el anillo, y eso actúa justo la idea
      // errónea EN6 («los dobles saltan de lugar»). Las cinco opciones son moléculas distintas: se eligen.
    },
    predice: {
      pregunta: 'El benceno se dibuja con tres enlaces dobles y tres simples. Si se miden los seis enlaces C–C de la molécula real, ¿qué se encuentra?',
      voz: 'Antes de medir, decide qué esperas.',
      opciones: [
        { id: 'c', texto: 'Los seis miden lo mismo, entre simple y doble', correcta: true },
        { id: 'tres', texto: 'Tres cortos (dobles) y tres largos (simples)', error: 'EN6', siFuera: 'Así se dibuja una fórmula de Kekulé. La molécula real reparte los dobles en todo el anillo.' },
        { id: 'alterna', texto: 'Cambian de largo, porque los dobles saltan de lugar', error: 'EN6', siFuera: 'Las dos fórmulas no se turnan en el tiempo: describen juntas una sola molécula que no cambia.' },
      ],
      dibujo: vistaAnillo('kekule-a'),
      revelar: vistaAnillo('kekule-a', { textos: [{ x: 0, y: 1.95, t: 'los 6 enlaces: 140 pm', color: 'h' }] }),
      coincide: 'Coincide: los seis enlaces miden 140 pm.',
      noCoincide: 'Medidos, los seis enlaces son iguales: 140 pm.',
    },
    mira: {
      datos: figura([mover(ANILLOS['kekule-a'].est, 0, 0, 'a', { desde: 1 }), mover(ANILLOS['kekule-b'].est, 0, 3.6, 'b', { desde: 2 })], {
        escala: 40,
        flechas: [{ de: [0, 1.25], a: [0, 2.35], doble: true, desde: 2 }],
        textos: [{ x: 0, y: 5.2, t: 'C–C del anillo real: 140 pm', color: 'h', desde: 3 }],
      }).datos,
      voz: 'Comparemos las dos fórmulas lado a lado.',
      pasos: [
        { estado: { corte: 1 }, texto: 'Fórmula de Kekulé: dobles y simples alternados.', ecuacion: ['C₆H₆'] },
        { estado: { corte: 2 }, texto: 'La otra fórmula: mismos átomos, dobles en el otro lugar.', ecuacion: ['A ↔ B (resonancia)'] },
        { estado: { corte: 3 }, texto: 'La molécula real no es A ni B: los seis enlaces son iguales.', ecuacion: ['154 pm > 140 pm > 134 pm'] },
        { estado: { corte: 3 }, texto: 'Ese reparto en todo el anillo es lo que se llama aromático.' },
      ],
    },
    regla: {
      texto: 'En el benceno, los electrones de los tres dobles se reparten por todo el anillo: las dos fórmulas describen una sola molécula, con seis enlaces iguales.',
      ecuacion: [{ llave: ['154'], nota: 'simple' }, ' > ', { llave: ['140'], nota: 'benceno', color: 'c-h' }, ' > ', { llave: ['134'], nota: 'doble' }, '\u00a0pm'],
      condicion: 'aromático exige un anillo plano con dobles alternados en todo el ciclo. No significa «con olor» ni vale para cualquier anillo.',
      voz: 'Un anillo no basta: mira si los dobles alternan en toda la vuelta.',
    },
    // Así se resuelve (fase 2): el mismo caso de «Ahora tú» (¿es aromático?), recorriendo el anillo con vueltaAnillo.
    resuelve: {
      generar(s) {
        const r = azar(s + 900), ks = ['kekule-a', 'tolueno', 'ciclohexano', 'ciclohexeno', 'kekule-b'], k = ks[r.ent(0, ks.length - 1)], a = ANILLOS[k];
        const vuelta = vueltaAnillo(k).filter(p => !p.fin), dobles = vuelta.filter(p => p.doble).length, alterna = vuelta.every(p => p.alterna);
        const seguidos = vuelta.filter(p => !p.doble && !p.alterna).length, [fm] = a.lee.split(/[,:]/);
        const anilloIds = a.est.n.filter(x => /^r/.test(x[0])).map(x => x[0]);
        return {
          enunciado: `¿El ${a.nombre}, ${fm}, es aromático?`,
          dibujo: vistaAnillo(k),
          pasos: [
            { tipo: 'pide', texto: `Piden decidir si el ${a.nombre} es aromático.` },
            { tipo: 'datos', texto: `Es un anillo de seis carbonos ${dobles === 0 ? 'sin enlaces dobles' : 'con '}${dobles === 0 ? '' : dobles === 1 ? 'un enlace doble' : `${dobles} enlaces dobles`}${k === 'tolueno' ? ' y un CH₃ unido afuera' : ''}.` },
            { tipo: 'regla', texto: 'Tener anillo no basta. Es aromático si, al dar la vuelta completa, cada doble queda entre dos simples, como en el benceno.' },
            { tipo: 'aplica', texto: alterna ? 'Doy la vuelta enlace por enlace: los seis alternan, doble y simple, sin cortarse.' : `Doy la vuelta enlace por enlace: hay ${seguidos} ${seguidos === 1 ? 'simple que sigue' : 'simples que siguen'} a otro simple. La alternancia se corta.`,
              ecuacion: [vuelta.map(p => (p.doble ? '=' : '–')).join(' ')], dibujo: vistaAnillo(k, { resaltos: [{ atomos: anilloIds, color: 'f' }] }) },
            { tipo: 'sentido', texto: alterna ? `Cuadra: tiene tres dobles en seis enlaces, como el benceno${k === 'tolueno' ? '; el CH₃ va afuera y no corta la vuelta' : ''}.` : `Cuadra: un anillo aromático de seis carbonos lleva tres dobles, y este ${dobles === 0 ? 'no tiene ninguno' : 'tiene solo uno'}.` },
          ],
          respuesta: `${alterna ? 'Sí' : 'No'}: el ${a.nombre} ${alterna ? 'es' : 'no es'} aromático`,
        };
      },
    },
    ahoraTu: {
      voz: 'Recorre el anillo enlace por enlace.',
      generar(s) {
        const r = azar(s), ks = ['kekule-a', 'tolueno', 'ciclohexano', 'ciclohexeno', 'kekule-b'], k = ks[s % ks.length], a = ANILLOS[k];
        const si = { id: 'si', texto: 'Aromático: dobles alternados en toda la vuelta' };
        const no = { id: 'no', texto: 'No aromático: no alterna dobles en toda la vuelta' };
        const anillo6 = { id: 'anillo', texto: 'Aromático, porque es un anillo de seis', error: 'QM-ANILLO-AROM', siFuera: 'Tener anillo no basta. Sería aromático si los dobles alternaran en toda la vuelta.' };
        const extra = { id: 'extra', texto: 'No aromático, porque lleva un grupo extra', error: 'QM-ANILLO-AROM', siFuera: 'Un grupo unido al anillo no lo cambia: el anillo sigue alternando dobles.' };
        let ops;
        if (a.arom) ops = [Object.assign({ correcta: true }, si), Object.assign({ error: 'QM-ANILLO-AROM', siFuera: 'Sería así si faltara un doble en la vuelta. Aquí alternan en todo el anillo.' }, no), extra];
        else ops = [Object.assign({ correcta: true }, no), Object.assign({ error: 'QM-ANILLO-AROM', siFuera: 'Sería aromático si alternara dobles en toda la vuelta. Aquí faltan dobles.' }, si), anillo6];
        return {
          pregunta: `¿El ${a.nombre} es aromático?`,
          dibujo: vistaAnillo(k),
          opciones: r.mezcla(ops),
          solucion: { texto: a.arom ? 'Tiene tres dobles alternados en todo el anillo.' : 'Su anillo tiene enlaces simples que cortan la alternancia.', ecuacion: [a.lee.split(':')[0]] },
        };
      },
    },
  };

  // ---------- Idea 4: isómeros estructurales: mismas piezas, otras uniones ----------
  // Cambia: la estructura de C₅H₁₂ · Permanece: el inventario C₅H₁₂ · Progresa: de 5 en fila a 4 + 1 y a 3 + 2 ·
  // Se reserva: el pentano doblado, que es el mismo pentano · Debe verse: qué carbono se une con cuál.
  const EST = {
    pentano: zig(['CH₃', 'CH₂', 'CH₂', 'CH₂', 'CH₃']),
    'pentano-doblado': { n: [['k0', 'CH₃', 0, 0], ['k1', 'CH₂', 1.15, 0], ['k2', 'CH₂', 2.3, 0], ['k3', 'CH₂', 2.3, 1.15], ['k4', 'CH₃', 1.15, 1.15]], e: [['k0', 'k1'], ['k1', 'k2'], ['k2', 'k3'], ['k3', 'k4']] },
    metilbutano: { n: [['k0', 'CH₃', 0, 0], ['k1', 'CH', 1.15, 0.6], ['k2', 'CH₂', 2.3, 0], ['k3', 'CH₃', 3.45, 0.6], ['m', 'CH₃', 1.15, 1.75]], e: [['k0', 'k1'], ['k1', 'k2'], ['k2', 'k3'], ['k1', 'm']] },
    dimetilpropano: { n: [['k0', 'CH₃', 0, 0.6], ['k1', 'C', 1.15, 0.6], ['k2', 'CH₃', 2.3, 0.6], ['m1', 'CH₃', 1.15, -0.55], ['m2', 'CH₃', 1.15, 1.75]], e: [['k0', 'k1'], ['k1', 'k2'], ['k1', 'm1'], ['k1', 'm2']] },
    butano: zig(['CH₃', 'CH₂', 'CH₂', 'CH₃']),
    'butano-doblado': { n: [['k0', 'CH₃', 0, 0], ['k1', 'CH₂', 1.15, 0], ['k2', 'CH₂', 1.15, 1.15], ['k3', 'CH₃', 2.3, 1.15]], e: [['k0', 'k1'], ['k1', 'k2'], ['k2', 'k3']] },
    isobutano: SEMI.ramificada,
    propano: zig(['CH₃', 'CH₂', 'CH₃']),
    '1-cloropropano': zig(['CH₂Cl', 'CH₂', 'CH₃']),
    '2-cloropropano': { n: [['k0', 'CH₃', 0, 0], ['k1', 'CH', 1.15, 0], ['k2', 'CH₃', 2.3, 0], ['x', 'Cl', 1.15, 1.1]], e: [['k0', 'k1'], ['k1', 'k2'], ['k1', 'x']] },
    'metilbutano-espejo': { n: [['k0', 'CH₃', 3.45, 0], ['k1', 'CH', 2.3, 0.6], ['k2', 'CH₂', 1.15, 0], ['k3', 'CH₃', 0, 0.6], ['m', 'CH₃', 2.3, 1.75]], e: [['k0', 'k1'], ['k1', 'k2'], ['k2', 'k3'], ['k1', 'm']] },
  };
  const C5 = {
    pentano: { lee: 'C₅H₁₂: los cinco carbonos en una sola fila.', fila: ['k0', 'k1', 'k2', 'k3', 'k4'], mueve: 'k4' },
    metilbutano: { lee: 'C₅H₁₂: cuatro en fila y una rama de un carbono.', fila: ['k0', 'k1', 'k2', 'k3'], mueve: 'm' },
    dimetilpropano: { lee: 'C₅H₁₂: tres en fila y dos ramas en el centro.', fila: ['k0', 'k1', 'k2'], mueve: 'm1' },
  };
  const vistaC5 = val => figura([mover(EST[val.k], 0, 0, '')], { escala: 44, alto: 190, resaltos: [{ atomos: C5[val.k].fila, color: 'i' }] });
  // Animación: el conteo sigue la fila más larga carbono por carbono; la marca crece hasta cubrirla.
  function vistaC5Viva(val) {
    const fila = C5[val.k].fila, k = fase(val.r, fila.length + 1), fig = vistaC5(val);
    if (k < fila.length) fig.datos.resaltos = [{ atomos: fila.slice(0, k + 1), color: 'f' }];
    return { fig, k, fila };
  }
  // Pares de «Ahora tú» y «Así se resuelve»: A, B y la relación esperada (resuelve la recalcula con las cuentas).
  const PARES_ISO = [
    ['butano', 'butano-doblado', 'misma'], ['butano', 'isobutano', 'isomeros'], ['pentano', 'metilbutano', 'isomeros'],
    ['pentano', 'pentano-doblado', 'misma'], ['propano', 'butano', 'distinta'], ['1-cloropropano', '2-cloropropano', 'isomeros'],
    ['metilbutano', 'metilbutano-espejo', 'misma'], ['isobutano', 'dimetilpropano', 'distinta'],
  ];
  // Inventario de una estructura: suma los átomos de cada rótulo (CH₃, CH₂Cl, Cl…).
  const inventarioEst = est => est.n.reduce((acc, [, t]) => { for (const [el, k] of Object.entries(atomosDe(t))) acc[el] = (acc[el] || 0) + k; return acc; }, {});
  const formulaAt = inv => ['C', 'H', 'Cl'].filter(e => inv[e]).map(e => e + (inv[e] > 1 ? sb(inv[e]) : '')).join('');
  // La fila de carbonos más larga (camino simple en el grafo de los carbonos) y dónde va el Cl, si hay.
  const esC = t => /^C(?!l)/.test(t);
  function filaIds(est) {
    const cs = est.n.filter(x => esC(x[1])).map(x => x[0]), vec = id => est.e.filter(e => e.includes(id)).map(e => (e[0] === id ? e[1] : e[0])).filter(o => cs.includes(o));
    let mejor = [];
    const anda = camino => { if (camino.length > mejor.length) mejor = camino; for (const o of vec(camino[camino.length - 1])) if (!camino.includes(o)) anda([...camino, o]); };
    cs.forEach(c => anda([c]));
    return mejor;
  }
  function clEn(est) {
    const cs = est.n.filter(x => esC(x[1])).map(x => x[0]), conCl = est.n.find(x => /Cl/.test(x[1]));
    if (!conCl) return null;
    const c = esC(conCl[1]) ? conCl[0] : est.e.filter(e => e.includes(conCl[0])).map(e => (e[0] === conCl[0] ? e[1] : e[0]))[0];
    const vecinosC = est.e.filter(e => e.includes(c)).map(e => (e[0] === c ? e[1] : e[0])).filter(o => cs.includes(o)).length;
    return vecinosC === 1 ? 'a un carbono del extremo' : 'al carbono del medio';
  }
  const isomeros = {
    id: 'isomeros-estructurales',
    titulo: 'Mismos átomos, otras uniones',
    temas: ['Isomería estructural y geométrica'],
    pieza: 'quim-molecula',
    // Lee (fase 2): qué es un isómero y qué es la fila de carbonos. No dice si doblar el dibujo cambia la molécula.
    lee: {
      tarjetas: [
        { titulo: 'Misma fórmula, otra sustancia', texto: 'El gas de los encendedores puede traer butano o isobutano. Los dos son C₄H₁₀, pero el butano hierve cerca de 0 °C y el isobutano, cerca de −12 °C. Se llaman isómeros.' },
        { titulo: 'La fila y las ramas', texto: 'En una estructura, la fila es la cadena de carbonos unidos uno tras otro. Lo que cuelga de un carbono de la fila es una rama: CH₃ es una rama de un carbono.' },
        { titulo: 'Qué mirar al jugar', texto: 'Las tres estructuras del juego son C₅H₁₂. El conteo sigue la fila más larga carbono por carbono: mira cuántos carbonos tiene en cada una.' },
      ],
    },
    juega: {
      consigna: 'Las tres son C₅H₁₂. El conteo sigue sola la fila de carbonos más larga: mira cómo se acorta al cambiar las uniones.',
      voz: 'Sigue las uniones con el dedo, carbono por carbono.',
      controles: [{ id: 'k', etiqueta: 'Estructura', opciones: [{ valor: 'pentano', texto: 'Pentano' }, { valor: 'metilbutano', texto: '2-metilbutano' }, { valor: 'dimetilpropano', texto: '2,2-dimetilpropano' }] }, conteo(6)],
      dibujo: val => vistaC5Viva(val).fig,
      lectura: val => { const { k, fila } = vistaC5Viva(val);
        return [k < fila.length ? `Fila de ${k + 1} ${k ? 'carbonos' : 'carbono'} · C₅H₁₂` : C5[val.k].lee]; },
      minimo: 3,
      // Se agarra un carbono y se cambia de vecino: al final de la fila es pentano, colgado abajo del carbono 2 es
      // 2-metilbutano, arriba de él es 2,2-dimetilpropano. Responde la fila resaltada, que se acorta: 5, 4, 3.
      arrastres: [{ id: 'carbono', etiqueta: 'carbono que cambia de vecino', color: 'c-i',
        donde: val => enFigura(vistaC5(val), C5[val.k].mueve),
        mover: (pt, val) => ({ k: cercana(Object.keys(C5), v => enFigura(vistaC5(v), C5[v.k].mueve), pt, val, 'k') }) }],
    },
    predice: {
      pregunta: 'Esta figura es el pentano dibujado con la cadena doblada. Comparada con el pentano en fila, ¿qué es?',
      voz: 'Compara uniones, no la forma del dibujo.',
      opciones: [
        { id: 'c', texto: 'La misma molécula, dibujada de otra forma', correcta: true },
        { id: 'isomero', texto: 'Un isómero estructural, porque cambió la forma', error: 'QM-GIRO', siFuera: 'Sería isómero si cambiara qué carbono se une con cuál. Aquí la fila sigue siendo de cinco.' },
        { id: 'otra', texto: 'Otro compuesto, con otra fórmula molecular', error: 'HC1', siFuera: 'Sería otro compuesto si cambiara el número de átomos. Sigue siendo C₅H₁₂.' },
      ],
      dibujo: figura([mover(EST['pentano-doblado'], 0, 0, '')], { escala: 44, alto: 190 }),
      revelar: figura([mover(EST['pentano-doblado'], 0, 0, '')], { escala: 44, alto: 190, resaltos: [{ atomos: ['k0', 'k1', 'k2', 'k3', 'k4'], color: 'i', texto: 'cinco en fila' }] }),
      coincide: 'Coincide: las uniones son las mismas, aunque el dibujo se doble.',
      noCoincide: 'Siguiendo las uniones salen cinco carbonos en fila: es el mismo pentano.',
    },
    mira: {
      datos: figura([mover(EST.pentano, 0, 0, 'a', { desde: 1 }), mover(EST.metilbutano, -0.1, 2.0, 'b', { desde: 2 }), mover(EST.dimetilpropano, 0.5, 5.3, 'c', { desde: 3 })], {
        escala: 40,
        resaltos: [{ atomos: ['ak0', 'ak1', 'ak2', 'ak3', 'ak4'], color: 'i', desde: 1 }, { atomos: ['bk0', 'bk1', 'bk2', 'bk3'], color: 'i', desde: 2 }, { atomos: ['ck0', 'ck1', 'ck2'], color: 'i', desde: 3 }],
      }).datos,
      voz: 'Busquemos la fila más larga en cada una.',
      pasos: [
        { estado: { corte: 1 }, texto: 'Pentano: los cinco carbonos en una sola fila.', ecuacion: ['C₅H₁₂'] },
        { estado: { corte: 2 }, texto: '2-metilbutano: fila de cuatro y una rama en el carbono 2.', ecuacion: ['C₅H₁₂'] },
        { estado: { corte: 3 }, texto: '2,2-dimetilpropano: fila de tres y dos ramas en el carbono 2.', ecuacion: ['C₅H₁₂'] },
        { estado: { corte: 3 }, texto: 'Misma fórmula, otras uniones: son tres isómeros estructurales.' },
      ],
    },
    regla: {
      texto: 'Isómeros estructurales: misma fórmula molecular y distintas uniones entre átomos. Girar o doblar el dibujo no cambia ninguna unión: es la misma molécula.',
      ecuacion: [{ llave: ['C₅H₁₂'], nota: 'misma fórmula' }, ' → ', { llave: ['3 estructuras'], nota: 'otras uniones', color: 'c-i' }],
      condicion: 'se comparan uniones, no la forma del dibujo. Para nombrar, la cadena principal sigue reglas IUPAC, no solo su largo.',
      voz: 'Si las uniones coinciden, es la misma molécula.',
    },
    // Así se resuelve (fase 2): un par de «Ahora tú» (PARES_ISO), resuelto contando átomos (inventarioEst) y
    // comparando uniones (mismasUniones, filaIds). La relación sale de esas cuentas, no de la tabla.
    resuelve: {
      generar(s) {
        const r = azar(s + 900), [a, b] = PARES_ISO[r.ent(0, PARES_ISO.length - 1)], A = EST[a], B = EST[b];
        const ia = inventarioEst(A), ib = inventarioEst(B), fa = formulaAt(ia), fb = formulaAt(ib);
        const rel = fa !== fb ? 'distinta' : mismasUniones(A, B) ? 'misma' : 'isomeros';
        const la = filaIds(A).length, lb = filaIds(B).length, dondeA = clEn(A), dondeB = clEn(B);
        const dib = (extra = {}) => figura([mover(A, 0, 0, 'a'), mover(B, 0, 2.7, 'b')], Object.assign({ escala: 42, alto: 270, textos: [{ x: -1.0, y: 0.3, t: 'A', peso: 700 }, { x: -1.0, y: 3.0, t: 'B', peso: 700 }] }, extra));
        const aplica = rel === 'distinta' ? `Las fórmulas no coinciden: B tiene ${ib.C > ia.C ? 'más' : 'menos'} carbonos que A. No hace falta mirar uniones.`
          : rel === 'misma' ? `Sigo las uniones: las dos tienen una fila de ${la} carbonos ${ia.C > la ? 'con la misma rama en el mismo carbono' : 'sin ramas'}. Solo cambió el dibujo.`
            : la !== lb ? `Sigo las uniones: la fila más larga de A tiene ${la} carbonos y la de B, ${lb}. Las uniones cambian.`
              : `Las dos filas tienen ${la} carbonos, pero el Cl va unido ${dondeA} en A y ${dondeB} en B. Las uniones cambian.`;
        const sentido = { misma: `Cuadra: misma fórmula, ${fa}, y mismas uniones. Doblar o voltear el dibujo no rompe ningún enlace.`,
          isomeros: `Cuadra: los dos son ${fa}. Mismos átomos con otras uniones: eso es un isómero, no otro dibujo.`,
          distinta: `Cuadra: los isómeros tienen los mismos átomos, y ${fa} no es ${fb}. Son compuestos distintos.` }[rel];
        return {
          enunciado: `Compara la estructura A, de ${ia.C} carbonos, con la B, de ${ib.C}. ¿Son la misma molécula, isómeros o compuestos con distinta fórmula?`,
          dibujo: dib(),
          pasos: [
            { tipo: 'pide', texto: 'Piden la relación entre A y B: misma molécula, isómeros o compuestos con distinta fórmula.' },
            { tipo: 'datos', texto: 'Cuento los átomos de cada grupo, en A y en B.', ecuacion: [`A: ${fa}   ·   B: ${fb}`] },
            { tipo: 'regla', texto: 'Primero comparo fórmulas: si cambian, son compuestos distintos. Si coinciden, sigo las uniones: mismas uniones, misma molécula; otras uniones, isómeros.' },
            { tipo: 'aplica', texto: aplica, ecuacion: [rel === 'distinta' ? `${fa} ≠ ${fb}` : `fila de A: ${la}   ·   fila de B: ${lb}`],
              dibujo: dib({ resaltos: [{ atomos: filaIds(A).map(id => `a${id}`), color: 'i' }, { atomos: filaIds(B).map(id => `b${id}`), color: 'i' }] }) },
            { tipo: 'sentido', texto: sentido },
          ],
          respuesta: { misma: 'La misma molécula, dibujada de otra forma', isomeros: 'Son isómeros estructurales', distinta: 'Compuestos con distinta fórmula molecular' }[rel],
        };
      },
    },
    ahoraTu: {
      voz: 'Cuenta átomos primero; después compara uniones.',
      generar(s) {
        const PARES = PARES_ISO;
        const r = azar(s), [a, b, rel] = PARES[s % PARES.length];
        const textos = {
          misma: ['La misma molécula', 'Las uniones de A y B son las mismas; solo cambia el dibujo.'],
          isomeros: ['Isómeros estructurales', 'Tienen la misma fórmula molecular y otras uniones.'],
          distinta: ['Compuestos con distinta fórmula', 'Tienen distinto número de átomos.'],
        };
        const si = {
          misma: 'Sería la misma si cada carbono tuviera los mismos vecinos en A y en B.',
          isomeros: 'Serían isómeros si tuvieran los mismos átomos con otras uniones.',
          distinta: 'Sería otro compuesto si el número de átomos fuera distinto.',
        };
        const err = { misma: 'QM-GIRO', isomeros: 'HC1', distinta: 'HC1' };
        const ops = r.mezcla(Object.keys(textos).map(k => (k === rel ? { id: 'c', texto: textos[k][0], correcta: true } : { id: k, texto: textos[k][0], error: err[rel], siFuera: si[k] })));
        return {
          pregunta: 'Compara las estructuras A y B. ¿Qué relación hay entre ellas?',
          dibujo: figura([mover(EST[a], 0, 0, 'a'), mover(EST[b], 0, 2.7, 'b')], { escala: 42, alto: 270, textos: [{ x: -1.0, y: 0.3, t: 'A', peso: 700 }, { x: -1.0, y: 3.0, t: 'B', peso: 700 }] }),
          opciones: ops,
          solucion: { texto: textos[rel][1], ecuacion: [textos[rel][0]] },
        };
      },
    },
  };

  // ---------- Idea 5: cis, trans y la imagen en el espejo ----------
  // Cambia: los grupos de cada carbono del doble enlace · Permanece: el doble enlace, que no deja girar · Progresa:
  // de cis/trans a un carbono con cuatro grupos distintos · Se reserva: el espejo, al final · Debe verse: si cada C
  // del doble lleva dos grupos distintos.
  function alqueno(g, dobleColor = 'h') {
    // g = [arriba-izq, abajo-izq, arriba-der, abajo-der]
    const n = [['a', 'C', 0, 0], ['b', 'C', 1.3, 0], ['g0', g[0], -0.7, -0.85], ['g1', g[1], -0.7, 0.85], ['g2', g[2], 2.0, -0.85], ['g3', g[3], 2.0, 0.85]];
    return { n, e: [['a', 'b', 2, dobleColor], ['a', 'g0'], ['a', 'g1'], ['b', 'g2'], ['b', 'g3']] };
  }
  const ALQ = {
    cis: { g: ['CH₃', 'H', 'CH₃', 'H'], lee: 'cis-but-2-eno: los dos CH₃ del mismo lado.', nombre: 'but-2-eno', tiene: true },
    trans: { g: ['CH₃', 'H', 'H', 'CH₃'], lee: 'trans-but-2-eno: los CH₃ en lados opuestos.', nombre: 'but-2-eno', tiene: true },
    'but-1-eno': { g: ['H', 'H', 'CH₂CH₃', 'H'], lee: 'but-1-eno: un C del doble tiene dos H iguales.', nombre: 'but-1-eno', tiene: false },
  };
  // Animación: el conteo revisa los dos grupos de cada carbono del doble enlace y, si hay cis/trans, dónde quedan
  // los CH₃. Todo sale de la lista de grupos g (el mismo dato que dibuja la molécula).
  function revisaAlq(k) {
    const g = ALQ[k].g, dist = (a, b) => (a !== b ? 'distintos' : 'iguales');
    const pasos = [
      { atomos: ['g0', 'g1'], lee: `C izquierdo: ${g[0]} y ${g[1]}, ${dist(g[0], g[1])}` },
      { atomos: ['g2', 'g3'], lee: `C derecho: ${g[2]} y ${g[3]}, ${dist(g[2], g[3])}` },
    ];
    if (g[0] !== g[1] && g[2] !== g[3]) {
      const j = g[2] === g[0] ? 'g2' : 'g3';
      pasos.push({ atomos: ['g0'], y: [j], lee: j === 'g2' ? `Los ${g[0]}, del mismo lado: cis` : `Los ${g[0]}, en lados opuestos: trans` });
    } else pasos.push({ atomos: g[0] === g[1] ? ['g0', 'g1'] : ['g2', 'g3'], lee: 'Un C con dos grupos iguales: sin cis ni trans' });
    pasos.push({ fin: true, lee: ALQ[k].lee });
    return pasos;
  }
  const vistaAlqViva = val => {
    const pasos = revisaAlq(val.k), p = pasos[fase(val.r, pasos.length)];
    return { fig: figura([mover(alqueno(ALQ[val.k].g), 0, 0, '')], Object.assign({ escala: 48, alto: 170 }, p.fin ? {} : { resaltos: [{ atomos: p.atomos, color: 'f' }, ...(p.y ? [{ atomos: p.y, color: 'f' }] : [])] })), p };
  };
  const QUIRAL = (izq) => {
    const s = izq ? 1 : -1;
    return { n: [['c', 'C', 0, 0], ['h', 'H', 0, -1.0], ['oh', 'OH', s * 1.1, 0], ['m', 'CH₃', 0, 1.0], ['e', 'CH₂CH₃', -s * 1.7, 0]], e: [['c', 'h'], ['c', 'oh'], ['c', 'm'], ['c', 'e']] };
  };
  // Alquenos de «Ahora tú» y «Así se resuelve»: nombre, grupos [arriba-izq, abajo-izq, arriba-der, abajo-der] y si
  // tiene cis/trans (resuelve lo recalcula comparando los grupos).
  const ALQS_CT = [
    ['but-2-eno', ['CH₃', 'H', 'CH₃', 'H'], true], ['but-1-eno', ['H', 'H', 'CH₂CH₃', 'H'], false], ['propeno', ['H', 'H', 'CH₃', 'H'], false],
    ['pent-2-eno', ['CH₃', 'H', 'CH₂CH₃', 'H'], true], ['2-metilbut-2-eno', ['CH₃', 'CH₃', 'CH₃', 'H'], false], ['1,2-dicloroeteno', ['Cl', 'H', 'Cl', 'H'], true],
    ['1,1-dicloroeteno', ['Cl', 'Cl', 'H', 'H'], false],
  ];
  const geometrica = {
    id: 'cis-trans-optica',
    titulo: 'Cis, trans y el espejo',
    temas: ['Isomería estructural y geométrica', 'Isomería óptica (solo San Marcos)'],
    pieza: 'quim-molecula',
    // Lee (fase 2): qué significan cis y trans, y el espejo. No dice si el doble enlace deja girar (la predicción).
    lee: {
      tarjetas: [
        { titulo: 'Arriba y abajo', texto: 'En el dibujo de un alqueno, cada carbono del doble enlace lleva dos grupos: uno arriba y otro abajo. Así se ve de qué lado queda cada grupo.' },
        { titulo: 'Dos palabras del latín', texto: '«Cis» quiere decir «de este lado» y «trans», «al otro lado», como en «transandino», lo que cruza los Andes. En química dicen dónde quedan dos grupos iguales.' },
        { titulo: 'Tu mano en el espejo', texto: 'Tu mano izquierda es la imagen en el espejo de la derecha, y no encajan una sobre otra. Algunas moléculas son así: se llaman quirales.' },
        { titulo: 'Qué mirar al jugar', texto: 'El conteo revisa los dos grupos de cada carbono del doble. Fíjate si son distintos o iguales, y de qué lado quedan los CH₃.' },
      ],
    },
    juega: {
      consigna: 'El conteo revisa solo los dos grupos de cada carbono del doble enlace. Cambia la molécula y mira dónde quedan los CH₃.',
      voz: 'Mira los dos grupos de cada carbono del doble enlace.',
      controles: [{ id: 'k', etiqueta: 'Molécula', opciones: [{ valor: 'cis', texto: 'cis-but-2-eno' }, { valor: 'trans', texto: 'trans-but-2-eno' }, { valor: 'but-1-eno', texto: 'but-1-eno' }] }, conteo(4)],
      dibujo: val => vistaAlqViva(val).fig,
      lectura: val => [vistaAlqViva(val).p.lee],
      minimo: 3,
      // Sin arrastre, a propósito: pasar un CH₃ de arriba abajo con el dedo actúa el giro alrededor del doble enlace,
      // que la predicción enseña que no ocurre (QM-GIRO-DOBLE). Cis y trans se eligen como moléculas distintas.
    },
    predice: {
      pregunta: 'A temperatura ambiente, ¿puede el cis-but-2-eno volverse trans solo con girar sus carbonos alrededor del doble enlace?',
      voz: 'Piensa en qué deja girar y qué no.',
      opciones: [
        { id: 'c', texto: 'No: el doble enlace no deja girar; son dos isómeros', correcta: true },
        { id: 'gira', texto: 'Sí: girar nunca crea isómeros', error: 'QM-GIRO-DOBLE', siFuera: 'Girar no crea isómeros en un enlace simple. El doble no gira sin romperse.' },
        { id: 'dibujo', texto: 'Sí: cis y trans son el mismo dibujo volteado', error: 'QM-GIRO-DOBLE', siFuera: 'Voltear toda la molécula no cambia nada, cierto. Pero cis no se vuelve trans así.' },
      ],
      dibujo: figura([mover(alqueno(ALQ.cis.g), 0, 0, '')], { escala: 48, alto: 170 }),
      revelar: figura([mover(alqueno(ALQ.cis.g), 0, 0, 'a'), mover(alqueno(ALQ.trans.g), 4.3, 0, 'b')], { escala: 30, alto: 170, textos: [{ x: 0.65, y: 1.5, t: 'cis' }, { x: 4.95, y: 1.5, t: 'trans' }, { x: 2.8, y: -1.35, t: 'el doble no gira', color: 'h' }] }),
      coincide: 'Coincide: el doble enlace fija a los grupos en su lado.',
      noCoincide: 'Para pasar de cis a trans habría que romper el doble enlace: no basta girar.',
    },
    mira: {
      datos: figura([
        mover(alqueno(ALQ.cis.g), 0, 0, 'a', { desde: 1 }), mover(alqueno(ALQ.trans.g), 4.3, 0, 'b', { desde: 1 }),
        mover(QUIRAL(true), 1.0, 3.4, 'c', { desde: 3 }), mover(QUIRAL(false), 4.6, 3.4, 'd', { desde: 3 }),
      ], {
        escala: 34,
        textos: [{ x: 0.65, y: 1.5, t: 'cis', desde: 1 }, { x: 4.95, y: 1.5, t: 'trans', desde: 1 }, { x: 2.8, y: 2.3, t: 'espejo', desde: 3 }],
        flechas: [{ de: [2.8, 2.6], a: [2.8, 4.4], doble: true, desde: 3 }],
        resaltos: [{ atomos: ['ag0', 'ag1'], color: 'd', desde: 2 }, { atomos: ['ag2', 'ag3'], color: 'd', desde: 2 }],
      }).datos,
      voz: 'Revisemos qué condición tiene cada caso.',
      pasos: [
        { estado: { corte: 1 }, texto: 'cis y trans: los mismos átomos y las mismas uniones.', ecuacion: ['C₄H₈'] },
        { estado: { corte: 2 }, texto: 'Cada C del doble lleva dos grupos distintos: CH₃ y H.', ecuacion: ['CH₃ ≠ H en los dos carbonos'] },
        { estado: { corte: 3 }, texto: 'Butan-2-ol: un C con cuatro grupos distintos, y su espejo.', ecuacion: ['H, OH, CH₃, CH₂CH₃'] },
        { estado: { corte: 3 }, texto: 'En el espacio, esas dos versiones no se superponen: isómeros ópticos.' },
      ],
    },
    regla: {
      texto: 'Hay cis y trans si cada carbono del doble enlace lleva dos grupos distintos. Un carbono con cuatro grupos distintos suele dar dos isómeros ópticos, uno espejo del otro.',
      ecuacion: ['cis: mismo lado', '   ·   ', 'trans: lados opuestos'],
      condicion: '«cuatro grupos distintos» es una guía, no un criterio universal: decide que la molécula y su espejo no se superpongan.',
      voz: 'Revisa los dos grupos de cada carbono antes de decidir.',
    },
    // Así se resuelve (fase 2): un alqueno de «Ahora tú» (ALQS_CT); la respuesta sale de comparar sus grupos.
    resuelve: {
      generar(s) {
        const r = azar(s + 900), [nom, g] = ALQS_CT[r.ent(0, ALQS_CT.length - 1)], izq = g[0] !== g[1], der = g[2] !== g[3], tiene = izq && der;
        const dib = (extra = {}) => figura([mover(alqueno(g), 0, 0, '')], Object.assign({ escala: 48, alto: 170 }, extra));
        const cual = !izq ? 'izquierdo' : 'derecho', rep = !izq ? g[0] : g[2];
        return {
          enunciado: `¿El ${nom} tiene isómeros cis y trans?`,
          dibujo: dib(),
          pasos: [
            { tipo: 'pide', texto: `Piden saber si el ${nom} puede existir como cis y como trans.` },
            { tipo: 'datos', texto: `El carbono izquierdo del doble lleva ${g[0]} y ${g[1]}; el derecho, ${g[2]} y ${g[3]}.` },
            { tipo: 'regla', texto: 'Hay cis y trans solo si los dos carbonos del doble llevan, cada uno, dos grupos distintos. Basta un carbono con dos grupos iguales para que no haya.' },
            { tipo: 'aplica', texto: tiene ? 'El izquierdo tiene dos grupos distintos, y el derecho también: se cumple en los dos carbonos.' : `El carbono ${cual} lleva dos ${rep} iguales: la condición falla ahí.`,
              ecuacion: [`${g[0]} ${izq ? '≠' : '='} ${g[1]}   ·   ${g[2]} ${der ? '≠' : '='} ${g[3]}`],
              dibujo: dib({ resaltos: [{ atomos: ['g0', 'g1'], color: 'f' }, { atomos: ['g2', 'g3'], color: 'f' }] }) },
            { tipo: 'sentido', texto: tiene ? 'Compruebo: si cambio de lado los dos grupos de un carbono, sale otra molécula, que no se superpone con esta.'
              : `Compruebo: si cambio de lado los dos grupos del carbono ${cual}, el dibujo queda igual. Es la misma molécula.` },
          ],
          respuesta: tiene ? `Sí: el ${nom} tiene cis y trans` : `No: el ${nom} no tiene cis ni trans`,
        };
      },
    },
    ahoraTu: {
      voz: 'Revisa los grupos de cada carbono.',
      generar(s) {
        const r = azar(s);
        const ALQS = ALQS_CT;
        const [nom, g, tiene] = ALQS[s % ALQS.length];
        const si = { id: 'si', texto: 'Sí: cada C del doble tiene dos grupos distintos' };
        const no = { id: 'no', texto: 'No: un C del doble tiene dos grupos iguales' };
        const todo = { id: 'todo', texto: 'Sí: todo doble enlace los tiene', error: 'HC4', siFuera: 'Sería así si cada C del doble llevara dos grupos distintos. Revisa los dos grupos de cada uno.' };
        const ops = tiene
          ? [Object.assign({ correcta: true }, si), Object.assign({ error: 'HC4', siFuera: 'Sería así si un carbono tuviera dos grupos iguales. Aquí cada uno tiene dos distintos.' }, no)]
          : [Object.assign({ correcta: true }, no), Object.assign({ error: 'HC4', siFuera: 'Sería así si cada carbono tuviera dos grupos distintos. Aquí uno repite grupo.' }, si), todo];
        return {
          pregunta: `¿El ${nom} tiene isómeros cis y trans?`,
          dibujo: figura([mover(alqueno(g), 0, 0, '')], { escala: 48, alto: 170 }),
          opciones: r.mezcla(ops),
          solucion: { texto: tiene ? 'Cada carbono del doble lleva dos grupos distintos.' : 'Un carbono del doble lleva dos grupos iguales: no hay cis ni trans.', ecuacion: [`${g[0]}, ${g[1]} | ${g[2]}, ${g[3]}`] },
        };
      },
    },
  };

  // ---------- Idea 6: adición, sustitución, eliminación y combustión ----------
  // Cambia: la reacción · Permanece: reactivos arriba, productos abajo, flecha entre ambos · Progresa: qué enlace se
  // abre, qué átomo se cambia, qué sale · Se reserva: la adición de agua, que la consume y no la suelta · Debe verse:
  // si los productos son una sola molécula o varias.
  // Ancho aproximado de un rótulo, en unidades de la figura (escala 36): para que «+» no pise a nadie.
  const medio = t => 0.12 * String(t).length + 0.2;
  function fila(partes, y, pref, extra) {
    // partes: estructuras y '+', en orden; cada estructura empieza donde terminó el rótulo anterior.
    const out = []; let x = 0, k = 0; const textos = [];
    for (const p of partes) {
      if (p === '+') { textos.push(Object.assign({ x: x + 0.3, y, t: '+', peso: 700 }, extra)); x += 0.6; continue; }
      const izq = Math.min(...p.n.map(a => a[2] - medio(a[1]))), der = Math.max(...p.n.map(a => a[2] + medio(a[1])));
      out.push(mover(p, x - izq, y, `${pref}${k++}`, extra)); x += der - izq;
    }
    return { partes: out, textos, ancho: x };
  }
  const M = {
    eteno: { n: [['a', 'CH₂', 0, 0], ['b', 'CH₂', 1.3, 0]], e: [['a', 'b', 2, 'h']] },
    etano: { n: [['a', 'CH₃', 0, 0], ['b', 'CH₃', 1.3, 0]], e: [['a', 'b']] },
    h2: { n: [['a', 'H', 0, 0], ['b', 'H', 0.8, 0]], e: [['a', 'b']] },
    agua: { n: [['a', 'H', 0, 0], ['o', 'O', 0.8, 0], ['b', 'H', 1.6, 0]], e: [['a', 'o'], ['o', 'b']] },
    etanol: { n: [['a', 'CH₃', 0, 0], ['b', 'CH₂', 1.3, 0], ['c', 'OH', 2.5, 0]], e: [['a', 'b'], ['b', 'c']] },
    metano: { n: [['a', 'CH₄', 0, 0]], e: [] },
    cl2: { n: [['a', 'Cl', 0, 0], ['b', 'Cl', 0.95, 0]], e: [['a', 'b']] },
    clorometano: { n: [['a', 'CH₃', 0, 0], ['b', 'Cl', 1.1, 0]], e: [['a', 'b']] },
    hcl: { n: [['a', 'H', 0, 0], ['b', 'Cl', 0.85, 0]], e: [['a', 'b']] },
    o2: { n: [['a', '2 O₂', 0, 0]], e: [] },
    co2: { n: [['a', 'CO₂', 0, 0]], e: [] },
    agua2: { n: [['a', '2 H₂O', 0, 0]], e: [] },
  };
  const REAC = {
    adicion: { r: [M.eteno, '+', M.h2], p: [M.etano], lee: 'Adición: el doble se abre y todo queda en una molécula.' },
    sustitucion: { r: [M.metano, '+', M.cl2], p: [M.clorometano, '+', M.hcl], lee: 'Sustitución: un H sale y un Cl toma su lugar.' },
    eliminacion: { r: [M.etanol], p: [M.eteno, '+', M.agua], lee: 'Eliminación: salen H y OH vecinos; se forma un doble.' },
    combustion: { r: [M.metano, '+', M.o2], p: [M.co2, '+', M.agua2], lee: 'Combustión: el carbono termina en CO₂ y el hidrógeno en agua.' },
  };
  function reaccion(k, conProductos = true, extra = {}) {
    const R = fila(REAC[k].r, 0, 'r', {}), P = fila(REAC[k].p, 2.4, 'p', conProductos ? {} : { desde: 99 });
    const desplaza = (fl, dx) => fl.partes.forEach(p => p.atomos.forEach(a => { a.x += dx; })) || fl.textos.forEach(t => { t.x += dx; });
    const W = Math.max(R.ancho, P.ancho);
    desplaza(R, (W - R.ancho) / 2); desplaza(P, (W - P.ancho) / 2);
    const fig = figura([...R.partes, ...P.partes], Object.assign({ escala: 36, alto: 190, flechas: [{ de: [W / 2, 0.55], a: [W / 2, 1.85] }], textos: [...R.textos, ...P.textos] }, extra));
    return fig;
  }
  // Animación: el conteo hace el inventario de la reacción, elemento por elemento (arriba contra abajo) y al final
  // cuenta moléculas. Los números salen de los rótulos que se dibujan (coeficiente y subíndices), no de una tabla.
  const atomosDe = t => {
    const m = /^(\d+)\s+(.*)$/.exec(t), k = m ? +m[1] : 1, out = {};
    for (const [, el, n] of (m ? m[2] : t).matchAll(/([A-Z][a-z]?)([₀-₉]*)/g)) out[el] = (out[el] || 0) + k * (n ? DIG(n) : 1);
    return out;
  };
  const coef = t => { const m = /^(\d+)\s/.exec(t); return m ? +m[1] : 1; };
  const lado = partes => {
    const tot = {}, mol = []; let n = 0;
    partes.filter(x => x !== '+').forEach(est => {
      const c = {};
      for (const [, t] of est.n) for (const [el, k] of Object.entries(atomosDe(t))) c[el] = (c[el] || 0) + k;
      for (const [el, k] of Object.entries(c)) tot[el] = (tot[el] || 0) + k;
      mol.push(c); n += est.n.length === 1 ? coef(est.n[0][1]) : 1;
    });
    return { tot, mol, n };
  };
  function inventario(k) {
    const R = lado(REAC[k].r), P = lado(REAC[k].p), pasos = [];
    for (const el of ['C', 'H', 'O', 'Cl'].filter(x => R.tot[x] || P.tot[x])) {
      const marca = (L, pref) => L.mol.map((c, i) => (c[el] ? { atomos: REAC[k][pref === 'r' ? 'r' : 'p'].filter(x => x !== '+')[i].n.map(([id]) => `${pref}${i}${id}`), color: 'f' } : null)).filter(Boolean);
      pasos.push({ lee: `${el}: ${R.tot[el] || 0} arriba, ${P.tot[el] || 0} abajo`, resaltos: [...marca(R, 'r'), ...marca(P, 'p')] });
    }
    pasos.push({ lee: `Moléculas: ${R.n} arriba, ${P.n} abajo`, resaltos: [] });
    pasos.push({ fin: true, lee: REAC[k].lee, resaltos: [] });
    return pasos;
  }
  const reaccionViva = val => {
    const pasos = inventario(val.k), p = pasos[fase(val.r, pasos.length)];
    return { fig: reaccion(val.k, true, p.resaltos.length ? { resaltos: p.resaltos } : {}), p };
  };
  // Casos de «Ahora tú» y «Así se resuelve»: la ecuación y su tipo.
  const CASOS_REAC = [
    ['CH₂=CH₂ + Br₂ → CH₂Br–CH₂Br', 'adicion'], ['C₂H₆ + Cl₂ → C₂H₅Cl + HCl', 'sustitucion'],
    ['CH₃–CH₂Br + KOH → CH₂=CH₂ + KBr + H₂O', 'eliminacion'], ['C₃H₈ + 5 O₂ → 3 CO₂ + 4 H₂O', 'combustion'],
    ['HC≡CH + 2 H₂ → CH₃–CH₃', 'adicion'], ['C₆H₆ + Br₂ → C₆H₅Br + HBr', 'sustitucion'],
    ['CH₃–CH(OH)–CH₃ → CH₂=CH–CH₃ + H₂O', 'eliminacion'], ['CH₂=CH₂ + H₂O → CH₃–CH₂OH', 'adicion'],
    ['2 C₄H₁₀ + 13 O₂ → 8 CO₂ + 10 H₂O', 'combustion'],
  ];
  const NOM_REAC = { adicion: 'Adición', sustitucion: 'Sustitución', eliminacion: 'Eliminación', combustion: 'Combustión' };
  const PORQUE_REAC = {
    adicion: 'Un enlace múltiple se abre y los átomos que llegan quedan en el producto.',
    sustitucion: 'Un H sale con el halógeno y otro átomo ocupa su lugar.',
    eliminacion: 'Salen dos grupos de carbonos vecinos y aparece un enlace doble.',
    combustion: 'Con O₂ suficiente, el carbono pasa a CO₂ y el hidrógeno a agua.',
  };
  // Inventario de un lado de una ecuación escrita: «2 C₄H₁₀ + 13 O₂», «CH₃–CH(OH)–CH₃». Los guiones, los
  // dobles y los paréntesis sin subíndice no cambian la cuenta.
  function ladoEc(txt) {
    const tot = {}; let mol = 0;
    for (const term of txt.split(' + ')) {
      const m = /^(\d+)\s+(.*)$/.exec(term.trim()), k = m ? +m[1] : 1, limpio = (m ? m[2] : term.trim()).replace(/[=–≡()]/g, '');
      mol += k;
      for (const [, el, n] of limpio.matchAll(/([A-Z][a-z]?)([₀-₉]*)/g)) tot[el] = (tot[el] || 0) + k * (n ? DIG(n) : 1);
    }
    return { tot, mol };
  }
  const reacciones = {
    id: 'reacciones-organicas',
    titulo: 'Qué enlace cambia en la reacción',
    temas: ['Tipos de reacciones orgánicas'],
    pieza: 'quim-molecula',
    // Lee (fase 2): contexto y nombres de las reacciones. No dice qué sale en cada una (la predicción es la adición de agua).
    lee: {
      tarjetas: [
        { titulo: 'Reacciones de todos los días', texto: 'Cuando prendes la cocina, el gas se quema con el oxígeno del aire. Y en una fábrica, millones de moléculas de eteno se unen para formar el plástico de las bolsas.' },
        { titulo: 'Cuatro nombres', texto: 'Las reacciones de los hidrocarburos se agrupan por lo que les pasa a sus enlaces: adición, sustitución, eliminación y combustión. En el juego hay un ejemplo de cada una.' },
        { titulo: 'Qué mirar al jugar', texto: 'Arriba van los reactivos y abajo, los productos. El conteo compara los dos lados átomo por átomo; al final, fíjate si abajo queda una molécula o varias.' },
      ],
    },
    juega: {
      consigna: 'Arriba, los reactivos; abajo, los productos. El conteo hace solo el inventario, átomo por átomo. Elige una reacción: ¿qué enlace cambia y qué sale?',
      voz: 'Haz el inventario: ¿los productos son una molécula o varias?',
      controles: [{ id: 'k', etiqueta: 'Reacción', opciones: [{ valor: 'adicion', texto: 'Adición' }, { valor: 'sustitucion', texto: 'Sustitución' }, { valor: 'eliminacion', texto: 'Eliminación' }, { valor: 'combustion', texto: 'Combustión' }] }, conteo(5)],
      dibujo: val => reaccionViva(val).fig,
      lectura: val => [reaccionViva(val).p.lee],
      minimo: 3,
      // Sin arrastre: las cuatro opciones son reacciones distintas, con otros reactivos; no hay una variable continua
      // ni un átomo que, al moverlo, lleve de una a otra.
    },
    predice: {
      pregunta: 'El eteno reacciona con agua (CH₂=CH₂ + H₂O) y se forma etanol. ¿Sale alguna molécula pequeña en esta unión?',
      voz: 'Haz el inventario de átomos antes de responder.',
      opciones: [
        { id: 'c', texto: 'No: el agua entra entera y no sale nada', correcta: true },
        { id: 'agua', texto: 'Sí: sale agua, como en toda unión', error: 'QM-AGUA', siFuera: 'Algunas uniones sueltan agua, como la de un ácido con un alcohol. Esta es una adición: no sale nada.' },
        { id: 'h2', texto: 'Sí: sale H₂ del doble enlace', error: 'QM-ADICION', siFuera: 'Saldría algo en una eliminación. Aquí el doble se abre y recibe átomos.' },
      ],
      dibujo: (() => { const R = fila([M.eteno, '+', M.agua], 0, 'r', {}); return figura(R.partes, { escala: 36, alto: 190, textos: R.textos, flechas: [{ de: [R.ancho / 2, 0.55], a: [R.ancho / 2, 1.85] }] }); })(),
      revelar: (() => {
        const R = fila([M.eteno, '+', M.agua], 0, 'r', {}), P = fila([{ n: [['a', 'CH₃', 0, 0], ['b', 'CH₂', 1.3, 0], ['c', 'OH', 2.5, 0]], e: [['a', 'b'], ['b', 'c']] }], 2.4, 'p', {});
        P.partes.forEach(p => p.atomos.forEach(a => { a.x += (R.ancho - P.ancho) / 2; }));
        return figura([...R.partes, ...P.partes], { escala: 36, alto: 190, textos: [...R.textos, { x: R.ancho / 2, y: 3.2, t: 'C₂H₆O: nada sobra', color: 'o' }], flechas: [{ de: [R.ancho / 2, 0.55], a: [R.ancho / 2, 1.85] }] });
      })(),
      coincide: 'Coincide: es una adición; todos los átomos quedan en el etanol.',
      noCoincide: 'Inventario: C₂H₄ + H₂O = C₂H₆O. No sobra ningún átomo.',
    },
    mira: {
      datos: (() => {
        const f1 = reaccion('adicion');
        const d = f1.datos;
        d.atomos.forEach(a => { a.desde = a.id.startsWith('p') ? 3 : a.id.startsWith('r1') ? 2 : 1; });
        d.enlaces.forEach(e => { e.desde = e.a.startsWith('p') ? 3 : e.a.startsWith('r1') ? 2 : 1; });
        d.textos.forEach(t => { t.desde = 2; });
        d.flechas.forEach(fl => { fl.desde = 3; });
        d.textos.push({ x: 1.6, y: 3.2, t: 'C₂H₄ + H₂ = C₂H₆', color: 'o', desde: 4 });
        return d;
      })(),
      voz: 'Sigamos el enlace doble paso a paso.',
      pasos: [
        { estado: { corte: 1 }, texto: 'El eteno tiene un enlace doble entre sus carbonos.', ecuacion: ['CH₂=CH₂'] },
        { estado: { corte: 2 }, texto: 'Llega una molécula de H₂.', ecuacion: ['CH₂=CH₂ + H₂'] },
        { estado: { corte: 3 }, texto: 'El doble se abre y cada carbono recibe un H.', ecuacion: ['→ CH₃–CH₃'] },
        { estado: { corte: 4 }, texto: 'Inventario: todos los átomos quedan en una sola molécula.', ecuacion: ['C₂H₄ + H₂ → C₂H₆'] },
      ],
    },
    regla: {
      texto: 'Adición: un doble o triple se abre y todo queda en una molécula. Sustitución: un átomo sale y otro toma su lugar. Eliminación: salen átomos vecinos; queda un doble.',
      ecuacion: [{ llave: ['CH₂=CH₂'], nota: 'doble enlace', color: 'c-h' }, ' + H₂ → ', { llave: ['CH₃–CH₃'], nota: 'una molécula' }],
      condicion: 'la ecuación da el balance global, no el camino; necesita condiciones (calor, luz o catalizador). La combustión es una oxidación completa.',
      voz: 'Mira qué entra, qué sale y qué enlace cambia.',
    },
    // Así se resuelve (fase 2): una ecuación de «Ahora tú» (CASOS_REAC), con el inventario calculado de la ecuación.
    resuelve: {
      generar(s) {
        const r = azar(s + 900), [ec, tipo] = CASOS_REAC[r.ent(0, CASOS_REAC.length - 1)], [izq, der] = ec.split(' → ');
        const L = ladoEc(izq), R = ladoEc(der), els = ['C', 'H', 'O', 'Cl', 'Br', 'K'].filter(e => L.tot[e] || R.tot[e]);
        const conO2 = /\bO₂/.test(izq) && !/H₂O/.test(izq);
        return {
          enunciado: `¿Qué tipo de reacción es ${ec}?`,
          pasos: [
            { tipo: 'pide', texto: 'Piden el tipo de reacción: qué les pasa a los enlaces del compuesto orgánico.' },
            { tipo: 'datos', texto: `Entran ${L.mol} ${L.mol === 1 ? 'molécula' : 'moléculas'} y salen ${R.mol}${conO2 ? '. Entre los reactivos hay O₂' : ''}.`, ecuacion: [ec] },
            { tipo: 'regla', texto: 'Si un doble o triple se abre y todo queda junto, es adición. Si un átomo cambia por otro, sustitución. Si aparece un doble, eliminación. Con O₂, combustión.' },
            { tipo: 'aplica', texto: PORQUE_REAC[tipo], ecuacion: [`→ ${NOM_REAC[tipo]}`] },
            { tipo: 'sentido', texto: 'Hago el inventario de los dos lados: ningún átomo aparece ni desaparece.', ecuacion: [els.map(e => `${e}: ${L.tot[e] || 0} = ${R.tot[e] || 0}`).join('   ·   ')] },
          ],
          respuesta: `Es una ${NOM_REAC[tipo].toLowerCase()}`,
        };
      },
    },
    ahoraTu: {
      voz: 'Compara reactivos y productos.',
      generar(s) {
        const CASOS = CASOS_REAC;
        const r = azar(s), [ec, tipo] = CASOS[s % CASOS.length];
        const nom = NOM_REAC;
        const si = {
          adicion: 'Sería adición si un doble o triple se abriera y todo quedara en una molécula.',
          sustitucion: 'Sería sustitución si un átomo saliera y otro tomara su lugar.',
          eliminacion: 'Sería eliminación si salieran átomos vecinos y se formara un doble.',
          combustion: 'Sería combustión si reaccionara con O₂ y diera CO₂ y agua.',
        };
        const porque = PORQUE_REAC;
        const ops = r.mezcla(Object.keys(nom).map(k => (k === tipo ? { id: 'c', texto: nom[k], correcta: true } : { id: k, texto: nom[k], error: k === 'adicion' && tipo === 'eliminacion' ? 'QM-AGUA' : 'QM-REACCION', siFuera: si[k] })));
        return {
          pregunta: `¿Qué tipo de reacción es ${ec}?`,
          opciones: ops,
          solucion: { texto: porque[tipo], ecuacion: [nom[tipo]] },
        };
      },
    },
  };


  // ---------- Laboratorio ----------
  // Mesa 1: una cadena de 1 a 8 carbonos que se alarga arrastrando su extremo, con simple, doble o triple en el
  // primer enlace, abierta o cerrada en anillo. Los H de cada carbono los calcula el código (4 menos sus enlaces)
  // y también los casos raros: sin enlace C–C no hay doble; un anillo pide 3 carbonos; un triple en anillo, 8.
  const GRUPO = h => (h ? `CH${h > 1 ? sb(h) : ''}` : 'C');
  const NOM_E = { 1: 'simples', 2: 'un doble', 3: 'un triple' };
  const FAM = { abierta: { 1: 'alcano', 2: 'alqueno', 3: 'alquino' }, anillo: { 1: 'cicloalcano', 2: 'cicloalqueno', 3: 'cicloalquino' } };
  function cadenaLab(val) {
    const n = val.n, o = +val.e, quiereAnillo = val.forma === 'anillo';
    const anillo = quiereAnillo && n >= 3, noCabe = anillo && o === 3 && n < 8, orden = n === 1 || noCabe ? 1 : o;
    const enl = [];
    for (let i = 0; i + 1 < n; i++) enl.push([i, i + 1, i === 0 ? orden : 1]);
    if (anillo) enl.push([n - 1, 0, 1]);
    const usa = Array(n).fill(0);
    enl.forEach(([a, b, k]) => { usa[a] += k; usa[b] += k; });
    const h = usa.map(u => 4 - u), H = h.reduce((a, b) => a + b, 0);
    let pos;
    if (anillo) {
      const R = 1.25 / (2 * Math.sin(Math.PI / n)), g0 = -90 + (n % 2 ? 0 : 180 / n);
      pos = h.map((_, i) => ang(g0 + 360 * i / n, R));
    } else {
      pos = h.map((_, i) => [i * 1.15, i % 2 ? 0.6 : 0]);
      if (orden === 3 && n >= 3) pos[0] = [2 * pos[1][0] - pos[2][0], 2 * pos[1][1] - pos[2][1]];   // el triple va en línea: 180°
    }
    const est = { n: h.map((hh, i) => [`k${i}`, n === 1 ? 'CH₄' : GRUPO(hh), pos[i][0], pos[i][1]]), e: enl.map(([a, b, k]) => [`k${a}`, `k${b}`, k, k > 1 ? 'h' : null]) };
    const aviso = n === 1 && o > 1 ? `sin enlace C–C no hay ${o === 2 ? 'doble' : 'triple'}`
      : quiereAnillo && n < 3 ? 'un anillo pide 3 carbonos'
      : noCabe ? 'el triple pide 180°: no cabe' : '';
    const ymax = Math.max(...pos.map(q => q[1]));
    const xs = pos.map(q => q[0]), xm = (Math.min(...xs) + Math.max(...xs)) / 2;
    const dib = figura([mover(est, 0, 0, '')], { escala: 34, alto: 230, textos: aviso ? [{ x: xm, y: ymax + 1.1, t: aviso, color: 'h' }] : [] });
    return { dib, n, H, orden, anillo, aviso, fam: FAM[anillo ? 'anillo' : 'abierta'][orden] };
  }
  const lecturaCadena = val => {
    const c = cadenaLab(val), o = +val.e;
    if (c.n === 1 && o > 1) return [nC, ` = 1 · ${NOM_E[o]} → sin enlace C–C: CH₄, metano`];
    if (val.forma === 'anillo' && c.n < 3) return [nC, ` = ${c.n} · anillo → pide 3 carbonos; queda ${formula(c.n, c.H)}`];
    if (c.anillo && o === 3 && c.n < 8) return [nC, ` = ${c.n} · un triple · anillo → no cabe: pide 180°`];
    return [nC, ` = ${c.n} · ${c.n === 1 ? 'sin enlace C–C' : NOM_E[c.orden]} · ${c.anillo ? 'anillo' : 'abierta'} → ${formula(c.n, c.H)}, ${c.n === 1 ? 'metano' : c.fam}`];
  };
  const extremoLab = val => enFigura(cadenaLab(val).dib, `k${val.n - 1}`);
  // Mesa 2: dos estructuras lado a lado. La fórmula se cuenta de los grupos y la relación la decide el código
  // comparando uniones (todas las formas de emparejar átomos de A con los de B), no la forma del dibujo.
  const LADO = ['butano', 'butano-doblado', 'isobutano', 'pentano', 'pentano-doblado', 'metilbutano', 'metilbutano-espejo', 'dimetilpropano'];
  const NOM_LADO = { butano: 'Butano', 'butano-doblado': 'Butano doblado', isobutano: 'Metilpropano', pentano: 'Pentano', 'pentano-doblado': 'Pentano doblado', metilbutano: '2-metilbutano', 'metilbutano-espejo': '2-metilbutano volteado', dimetilpropano: '2,2-dimetilpropano' };
  const cuenta = est => est.n.reduce((acc, [, t]) => { const m = /^C(H([₀-₉]*))?$/.exec(t); acc.c += 1; acc.h += m && m[1] ? (m[2] ? DIG(m[2]) : 1) : 0; return acc; }, { c: 0, h: 0 });
  function permutaciones(k) {
    if (k <= 1) return [[0]];
    const out = [];
    for (const p of permutaciones(k - 1)) for (let i = 0; i <= p.length; i++) out.push([...p.slice(0, i), k - 1, ...p.slice(i)]);
    return out;
  }
  function mismasUniones(A, B) {
    if (A.n.length !== B.n.length || A.e.length !== B.e.length) return false;
    const ia = A.n.map(x => x[0]), ib = B.n.map(x => x[0]);
    const ea = new Set(A.e.map(([a, b]) => [ia.indexOf(a), ia.indexOf(b)].sort().join()));
    return permutaciones(A.n.length).some(p => A.n.every((x, i) => x[1] === B.n[p[i]][1])
      && B.e.every(([a, b]) => { const x = p.indexOf(ib.indexOf(a)), y = p.indexOf(ib.indexOf(b)); return ea.has([x, y].sort().join()); }));
  }
  function relacion(a, b) {
    const ca = cuenta(EST[a]), cb = cuenta(EST[b]);
    const rel = ca.c !== cb.c || ca.h !== cb.h ? 'otro compuesto' : mismasUniones(EST[a], EST[b]) ? 'la misma molécula' : 'isómeros';
    return { fa: formula(ca.c, ca.h), fb: formula(cb.c, cb.h), rel };
  }

  // Mesa 3D «El enlace que gira»: la molécula de la pieza quim-molecula-3d sale entera del motor (conformacion).
  const NOMBRE_CONF = { etano: 'Etano', butano: 'Butano', 'cis-but-2-eno': 'cis-but-2-eno', 'trans-but-2-eno': 'trans-but-2-eno' };
  const MIRAR = [{ giro: 20, inclinacion: 18 }, { giro: -84, inclinacion: 6 }];   // de costado · a lo largo del enlace C–C
  const conf3d = v => {
    const c = MH.conformacion(v.mol, v.phi);
    return { datos: { atomos: c.atomos, enlaces: c.enlaces, pares: [], total: null, vista: MIRAR[v.mir] }, estado: { dipolos: false, pares: false } };
  };
  const phiV = { v: 'c-d', t: 'φ' };
  // Mesa 3D «El espejo que no encaja»: la molécula y su copia en el espejo, del motor (espejo); escala 0,6 para que
  // quepan las dos lado a lado.
  const espejo3d = v => {
    const e = MH.espejo(v.mol, v.g);
    return { datos: { atomos: e.atomos, enlaces: e.enlaces, pares: [], total: null, vista: { giro: 0, inclinacion: 15 }, escala: 0.6, simbolos: true }, estado: { dipolos: false, pares: false } };
  };

  return {
    unidad: 'quimica.hidrocarburos',
    version: '0.2.0',
    estado: 'completa',
    requiere: ['/nucleo/kit/piezas/quim-molecula.js', '/plantillas/hidrocarburos/motor.js', '/nucleo/elementos.js', '/nucleo/kit/piezas/quim-molecula-3d.js'],
    historia: {
      texto: 'Conocer la composición de una sustancia orgánica no bastaba para explicar sus propiedades: dos sustancias podían tener la misma fórmula y comportarse distinto. En 1874, van ’t Hoff propuso que los cuatro enlaces del carbono apuntan a los vértices de un tetraedro. Esa idea espacial ayudó a explicar los isómeros. Las fórmulas de cadenas que usamos hoy recogen esa historia.',
      pregunta: '¿Cómo pueden dos sustancias tener la misma fórmula y ser distintas?',
      fuente: { titulo: 'OpenStax, Organic Chemistry, §3.4 y §5.2', url: 'https://openstax.org/books/organic-chemistry/pages/3-4-naming-alkanes' },
    },
    // Laboratorio (docs/teoria.md §4b): sin preguntas. Las dos 3D (el enlace que gira y el espejo que no encaja) van primero. La de la cadena es más rica que los juegos: junta fórmula
    // general, familias y anillos, con n de 1 a 8 y los casos que la idea no deja probar. La cuarta compara dos
    // estructuras cualesquiera. La lectura dice entradas y resultado, para que un caso guardado se lea solo.
    glosario: [
      { termino: 'hidrocarburo', def: 'Compuesto formado solo por átomos de carbono e hidrógeno, como el metano o el benceno.',
        ejemplo: 'El propano, C₃H₈, es el gas de muchos balones de cocina.', ver: ['alcano'] },
      { termino: 'alcano', def: 'Hidrocarburo de cadena abierta con solo enlaces simples entre carbonos. Fórmula general CₙH₂ₙ₊₂.',
        ejemplo: 'Con 4 carbonos: 2 · 4 + 2 = 10 H, el butano C₄H₁₀.', ver: ['alqueno', 'cicloalcano'] },
      { termino: 'alqueno', def: 'Hidrocarburo de cadena abierta con un enlace doble entre carbonos. Si tiene uno solo: CₙH₂ₙ.',
        ejemplo: 'Eteno, C₂H₄: dos H menos que el etano, C₂H₆.', ver: ['alcano', 'alquino'] },
      { termino: 'alquino', def: 'Hidrocarburo de cadena abierta con un enlace triple entre carbonos. Si tiene uno solo: CₙH₂ₙ₋₂.',
        ejemplo: 'Etino o acetileno, C₂H₂: el gas de los sopletes.', ver: ['alqueno'] },
      { termino: 'cicloalcano', def: 'Hidrocarburo de enlaces simples con los carbonos cerrados en anillo: CₙH₂ₙ, dos H menos que el alcano.',
        ejemplo: 'Ciclohexano, C₆H₁₂: misma fórmula que un hexeno.', ver: ['alcano', 'isómero'] },
      // «hibridación» se define desde el 19 nov en Geometría molecular y fuerzas intermoleculares (quimica.geometria-molecular).
      { termino: 'aromático', def: 'Compuesto con un anillo como el del benceno, con enlaces dobles repartidos por todo el anillo.',
        formas: ['aromático', 'aromáticos', 'aromática', 'aromáticas'], ver: ['benceno'] },
      { termino: 'benceno', simbolo: 'C₆H₆', def: 'Anillo de seis carbonos con sus tres enlaces dobles repartidos por igual entre los seis.',
        ejemplo: 'Sus seis enlaces C–C miden lo mismo: 140 pm.', ver: ['aromático'] },
      { termino: 'cadena principal', def: 'Cadena de carbonos que da la base del nombre; se elige con las reglas IUPAC, no solo por largo.',
        formas: ['cadena principal', 'cadenas principales'] },
      { termino: 'isómero', def: 'Compuesto con la misma fórmula molecular que otro, pero con sus átomos unidos o ubicados de otra forma.',
        ejemplo: 'Butano y metilpropano: los dos son C₄H₁₀.', formas: ['isómero', 'isómeros', 'isomería'], ver: ['fórmula molecular'] },
      { termino: 'cis', def: 'Isómero con dos grupos iguales del mismo lado del enlace doble.',
        ejemplo: 'cis-but-2-eno: sus dos CH₃ van del mismo lado.', ver: ['trans'] },
      { termino: 'trans', def: 'Isómero con dos grupos iguales en lados opuestos del enlace doble.',
        ejemplo: 'trans-but-2-eno: sus dos CH₃ van en lados opuestos.', ver: ['cis'] },
      { termino: 'isómero óptico', def: 'Cada una de dos moléculas que son imagen en el espejo una de otra y no se pueden superponer.',
        formas: ['isómeros ópticos', 'isómero óptico'], ver: ['isómero'] },
      { termino: 'adición', def: 'Reacción en que se abre un enlace doble o triple y se unen átomos nuevos a esos carbonos.',
        ejemplo: 'Eteno + H₂ → etano: C₂H₄ gana dos H.', ver: ['sustitución'] },
      { termino: 'sustitución', def: 'Reacción en que un átomo de la molécula sale y otro ocupa su lugar.',
        ejemplo: 'CH₄ + Cl₂ → CH₃Cl + HCl: un H cambia por Cl.', ver: ['adición'] },
      { termino: 'eliminación', def: 'Reacción en que salen dos grupos de carbonos vecinos y entre esos carbonos queda un enlace doble.',
        ejemplo: 'CH₃–CH₂Br + KOH → CH₂=CH₂ + KBr + H₂O.', ver: ['adición'] },
      { termino: 'conformación', formas: ['conformación', 'conformaciones'],
        def: 'Cada forma que toma una molécula al girar sus enlaces simples, sin romper ninguno.',
        ejemplo: 'El butano anti y el gauche son la misma molécula.', ver: ['isómero'] },
      { termino: 'eclipsada', formas: ['eclipsada', 'eclipsadas', 'eclipsado'],
        def: 'Conformación en la que, mirando a lo largo del enlace C–C, los átomos de adelante tapan a los de atrás.',
        ver: ['alternada'] },
      { termino: 'alternada', formas: ['alternada', 'alternadas'],
        def: 'Conformación en la que los átomos de adelante caen entre los de atrás, a 60°: la más cómoda.',
        ver: ['eclipsada'] },
      { termino: 'anti', def: 'Conformación alternada del butano con sus dos CH₃ opuestos, a 180°: la más estable.', ver: ['gauche'] },
      { termino: 'gauche', def: 'Conformación alternada del butano con sus dos CH₃ a 60°, vecinos.', ver: ['anti'] },
      { termino: 'quiral', formas: ['quiral', 'quirales'],
        def: 'Que no encaja con su imagen en un espejo, por más que se la gire.',
        ejemplo: 'El CHFClBr, y también tu mano.', ver: ['isómero óptico'] },
    ],
    laboratorio: [
      {
        // Exploración libre en 3D (decisión de Gerson, 15 nov: sin predicciones; los retos son invitaciones).
        // Posiciones, φ, forma y distancia entre los CH₃ salen del motor de plantillas/hidrocarburos (conformacion).
        id: 'enlace-que-gira', titulo: 'El enlace que gira', pieza: 'quim-molecula-3d',
        consigna: 'En cámara lenta, φ gira sola la mitad de atrás alrededor del enlace C–C. Prueba el butano y mira la distancia entre sus CH₃.',
        controles: [
          { id: 'mol', etiqueta: 'Molécula', opciones: Object.keys(MH.CONFORMABLES).map(k => ({ valor: k, texto: NOMBRE_CONF[k] })) },
          // Animación: φ va y vuelve solo (30° por segundo; la molécula real gira miles de millones de veces más rápido).
          // La pieza mueve los átomos ya armados (forma y mover de quim-molecula-3d): no rearma la escena en cada cuadro.
          { id: 'phi', etiqueta: 'φ', color: 'c-d', min: 0, max: 330, paso: 30, inicio: 60, unidad: '°', decimales: 0, auto: { velocidad: 30, modo: 'rebota' } },
          { id: 'mir', etiqueta: 'Mirar', opciones: [{ valor: 0, texto: 'De costado' }, { valor: 1, texto: 'A lo largo del enlace' }] },
        ],
        dibujo: v => conf3d(v),
        lectura: v => {
          const c = MH.conformacion(v.mol, v.phi);
          if (!c.gira) return [phiV, ` = ${f(v.phi, 0)}° · ${c.isomero}: el doble no gira · CH₃ a ${f(c.distancia, 0)} pm`];
          return [phiV, ` = ${f(c.phi, 0)}°: ${c.nombre || c.forma}${c.mol === 'butano' ? `, CH₃ a ${f(c.distancia, 0)} pm` : ''}`];
        },
        // Retos comprobados con el mismo motor que arma la molécula (docs/teoria.md §4d).
        invitaciones: [
          { texto: 'Gira el butano hasta dejar sus dos CH₃ lo más lejos posible.',
            logrado: v => v.mol === 'butano' && Math.abs(MH.conformacion('butano', v.phi).distancia - MH.distanciaMaxima('butano')) < 1e-9,
            bien: 'Anti: los CH₃ opuestos. Es la conformación más estable del butano.',
            pista: 'Mira a lo largo del enlace y gira hasta que los CH₃ queden opuestos.' },
          { texto: 'Deja el etano eclipsado y míralo a lo largo del enlace: cada H tapa a otro.',
            logrado: v => v.mol === 'etano' && v.mir === 1 && MH.conformacion('etano', v.phi).forma === 'eclipsada',
            bien: 'Eclipsada: los H se estorban. Gira 60° y quedan alternados.',
            pista: 'Elige «A lo largo del enlace» y gira φ de 30 en 30.' },
          { texto: 'Busca una conformación gauche del butano: sus CH₃ alternados pero vecinos.',
            logrado: v => v.mol === 'butano' && MH.conformacion('butano', v.phi).nombre === 'gauche',
            bien: 'Gauche: alternada, con los CH₃ a 60°. Un poco menos estable que anti.',
            pista: 'Prueba el butano con φ = 60° o φ = 300°.' },
          { texto: 'Guarda el cis-but-2-eno con dos valores distintos de φ y compara.',
            logrado: (v, guardados) => guardados.some(a => guardados.some(b => a.mol === 'cis-but-2-eno' && b.mol === 'cis-but-2-eno' && a.phi !== b.phi)),
            bien: 'Nada cambió: el doble enlace no gira. Habría que romperlo.',
            pista: 'Guarda un caso, mueve φ sin cambiar de molécula y guarda otro.' },
          { texto: 'Guarda el cis y el trans del but-2-eno, y compara sus CH₃.',
            logrado: (v, guardados) => ['cis-but-2-eno', 'trans-but-2-eno'].every(m => guardados.some(a => a.mol === m)),
            bien: 'Ningún giro lleva de uno al otro: son isómeros, no conformaciones.',
            pista: 'Guarda el cis, cambia al trans y guárdalo también.' },
        ],
      },
      {
        // Segunda mesa 3D (exploración libre): la molécula y su imagen en el espejo; encaja o no lo dice el motor.
        id: 'espejo-no-encaja', titulo: 'El espejo que no encaja', pieza: 'quim-molecula-3d',
        consigna: 'A la izquierda, la molécula; a la derecha, su imagen en un espejo. Gira la copia y busca que encaje con la original.',
        controles: [
          { id: 'mol', etiqueta: 'Molécula', opciones: Object.keys(MH.ESPEJOS).map(k => ({ valor: k, texto: MH.ESPEJOS[k].texto })) },
          { id: 'g', etiqueta: 'Giro de la copia', min: 0, max: 330, paso: 30, inicio: 0, unidad: '°', decimales: 0 },
        ],
        dibujo: v => espejo3d(v),
        lectura: v => { const e = MH.espejo(v.mol, v.g); return [`${e.texto}, copia a ${e.giro}°: ${e.encaja ? 'encaja con la original' : 'no encaja'}`]; },
        // Retos comprobados con el mismo motor que arma las dos moléculas (docs/teoria.md §4d).
        invitaciones: [
          { texto: 'Gira la copia del espejo hasta que encaje con la original.',
            logrado: v => MH.espejo(v.mol, v.g).encaja,
            bien: 'Encajó: esa molécula y su espejo son la misma. No tiene isómeros ópticos.',
            pista: 'Con CHFCl₂, gira la copia de 30 en 30 y mira la lectura.' },
          { texto: 'Busca la molécula cuyo espejo no encaja con ningún giro.',
            logrado: v => MH.espejo(v.mol, v.g).quiral,
            bien: 'Es quiral: cuatro átomos distintos en el carbono. Su espejo es un isómero óptico.',
            pista: 'Busca la que tiene cuatro átomos distintos alrededor del carbono.' },
          { texto: 'Guarda la copia del CHFClBr con dos giros distintos. ¿Encaja alguna?',
            logrado: (v, guardados) => guardados.some(a => guardados.some(b => a.mol === 'CHFClBr' && b.mol === 'CHFClBr' && a.g !== b.g)),
            bien: 'Ninguna encaja: como tu mano izquierda y tu mano derecha.',
            pista: 'Guarda un caso del CHFClBr, gira la copia y guarda otro.' },
          { texto: 'Guarda una molécula que encaje con su espejo y otra que no pueda.',
            logrado: (v, guardados) => guardados.some(a => MH.espejo(a.mol, a.g).encaja) && guardados.some(b => MH.espejo(b.mol, b.g).quiral),
            bien: 'La clave está en el carbono: tres átomos distintos o cuatro.',
            pista: 'Guarda el CHFCl₂ girado hasta encajar y después el CHFClBr.' },
        ],
      },
      {
        id: 'cadena-que-crece', titulo: 'La cadena que crece', pieza: 'quim-molecula',
        consigna: 'Arrastra el último carbono para alargar la cadena. Cambia el primer enlace y ciérrala en anillo. Busca qué no se puede armar.',
        controles: [
          { id: 'n', etiqueta: 'Carbonos', color: 'c-i', min: 1, max: 8, paso: 1, inicio: 4, unidad: '', decimales: 0 },
          { id: 'e', etiqueta: 'Primer enlace', opciones: [{ valor: '1', texto: 'Simple' }, { valor: '2', texto: 'Doble' }, { valor: '3', texto: 'Triple' }] },
          { id: 'forma', etiqueta: 'Cadena', opciones: [{ valor: 'abierta', texto: 'Abierta' }, { valor: 'anillo', texto: 'Anillo' }] },
        ],
        dibujo: val => cadenaLab(val).dib,
        lectura: lecturaCadena,
        // Se agarra el último carbono: en la cadena abierta, más a la derecha es más largo; en el anillo, más lejos del
        // centro es un anillo más grande. Responden los H de cada grupo y la fórmula de la lectura.
        arrastres: [{ id: 'extremo', etiqueta: 'último carbono: arrástralo para alargar', color: 'c-i',
          donde: extremoLab,
          mover: (pt, val) => {
            // La pieza centra la figura en (160, alto/2): en el anillo cuenta la distancia del dedo a ese centro.
            const radio = q => Math.hypot(q.x - 160, q.y - 115);
            if (val.forma === 'anillo' && val.n >= 3) return { n: cercana([3, 4, 5, 6, 7, 8], extremoLab, pt, val, 'n', (q, p) => Math.abs(radio(q) - radio(p))) };
            return { n: cercana([1, 2, 3, 4, 5, 6, 7, 8], extremoLab, pt, val, 'n') };
          } }],
        invitaciones: [
          { texto: 'Consigue un hidrocarburo con exactamente 12 hidrógenos.',
            logrado: val => { const c = cadenaLab(val); return !c.aviso && c.H === 12; },
            bien: 'Pentano, un alqueno o un anillo: más de un camino a 12 H.' },
          { texto: 'Busca el anillo más chico que acepte un enlace triple.',
            logrado: val => { const c = cadenaLab(val), menos = cadenaLab(Object.assign({}, val, { n: val.n - 1 })); return c.anillo && c.orden === 3 && menos.orden !== 3; },
            bien: 'Ocho carbonos: el triple pide 180° y solo un anillo grande lo estira.' },
          { texto: 'Pide un enlace doble o triple donde no puede haberlo.',
            logrado: val => cadenaLab(val).n === 1 && +val.e > 1,
            bien: 'Sin enlace C–C no hay doble. ¿Desde cuántos carbonos se puede?' },
          { texto: 'Guarda un alqueno y un cicloalcano con la misma fórmula.',
            logrado: (val, guardados) => { const c = cadenaLab(val);
              return guardados.some(g => { const d = cadenaLab(g); return d.n === c.n && d.H === c.H && [d.fam, c.fam].sort().join() === 'alqueno,cicloalcano'; }); },
            bien: 'Cerrar el anillo cuesta dos H, igual que un enlace doble.' },
          { texto: 'Guarda dos alcanos seguidos: ¿cuántos H suma cada carbono nuevo?',
            logrado: (val, guardados) => { const c = cadenaLab(val);
              return c.fam === 'alcano' && guardados.some(g => { const d = cadenaLab(g); return d.fam === 'alcano' && Math.abs(d.n - c.n) === 1; }); },
            bien: 'Cada CH₂ nuevo suma dos H: por eso queda CₙH₂ₙ₊₂.' },
        ],
      },
      {
        id: 'a-contra-b', titulo: 'Dos estructuras lado a lado', pieza: 'quim-molecula',
        consigna: 'Elige A y B. Cuenta sus átomos y sigue sus uniones: ¿la misma molécula, isómeros u otro compuesto?',
        controles: [
          { id: 'a', etiqueta: 'A', opciones: LADO.map(k => ({ valor: k, texto: NOM_LADO[k] })) },
          { id: 'b', etiqueta: 'B', opciones: LADO.map(k => ({ valor: k, texto: NOM_LADO[k] })) },
        ],
        dibujo: val => figura([mover(EST[val.a], 0, 0, 'a'), mover(EST[val.b], 0, 2.7, 'b')], { escala: 40, alto: 280, textos: [{ x: -1.0, y: 0.3, t: 'A', peso: 700 }, { x: -1.0, y: 3.0, t: 'B', peso: 700 }] }),
        lectura: val => { const r = relacion(val.a, val.b); return [`A: ${r.fa} · B: ${r.fb} → ${r.rel}`]; },
        // Sin arrastre: A y B son estructuras de una lista; elegirlas no tiene una variable que agarrar.
        invitaciones: [
          { texto: 'Pon frente a frente dos estructuras que sean isómeros.',
            logrado: val => relacion(val.a, val.b).rel === 'isómeros',
            bien: 'Misma fórmula, otras uniones: eso es un isómero, no el dibujo.' },
          { texto: 'Busca dos dibujos distintos que sean la misma molécula.',
            logrado: val => val.a !== val.b && relacion(val.a, val.b).rel === 'la misma molécula',
            bien: 'Doblar o voltear el dibujo no cambia ninguna unión.' },
          { texto: 'Junta el pentano con su isómero de más ramas.',
            logrado: val => { const ramas = k => EST[k].n.filter(x => x[1] === 'CH₃').length - 2;
              const r = relacion(val.a, val.b), c5 = LADO.filter(k => cuenta(EST[k]).c === 5);
              return r.rel === 'isómeros' && Math.max(ramas(val.a), ramas(val.b)) === Math.max(...c5.map(ramas)) && Math.min(ramas(val.a), ramas(val.b)) === 0; },
            bien: 'Dos metilos en un solo carbono: C₅H₁₂ igual, otra sustancia.' },
          { texto: 'Elige dos estructuras que ni siquiera sean isómeros.',
            logrado: val => relacion(val.a, val.b).rel === 'otro compuesto',
            bien: 'Si la fórmula cambia, ya no hay isomería posible.' },
        ],
      },
    ],
    // A qué idea pertenece cada mesa del laboratorio (Gerson, 16 nov: el laboratorio se agrupa por idea). Una lista vacía:
    // la mesa no practica ninguna idea de la unidad y va en «Más mesas del tema».
    laboratorioIdeas: {
      'enlace-que-gira': [],
      'espejo-no-encaja': ['cis-trans-optica'],
      'cadena-que-crece': ['carbono-enlaces', 'formulas-cadenas'],
      'a-contra-b': ['isomeros-estructurales'],
    },
    ideas: [carbono, formulas, aromatico, isomeros, geometrica, reacciones],
  };
});
