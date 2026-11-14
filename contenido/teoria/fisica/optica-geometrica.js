/*
 * Teoría de «Óptica geométrica» (fisica.optica-geometrica). Molde: contenido/teoria/fisica/movimiento-rectilineo.js.
 * Fuente del contenido: docs/teoria/matriz/fisica.json (unidad 19), precisiones de física del expediente («la imagen
 * cambia de lado al cruzar el foco» solo para lente convergente con objeto real; en el foco no hay imagen finita),
 * docs/investigacion/electromagnetismo-moderna-ideas-erroneas.md (R1–R7), optica-ideas-erroneas.md y
 * optica-espejos-esfericos.md. Los motores de plantillas/optica-* sirven solo para contrastar cuentas.
 * Colores (regla 4): θ₁ naranja (c-o), θ₂ turquesa (c-i), dₒ rojo (c-h), dᵢ verde (c-d), f turquesa (c-i).
 *   θ₂ y f comparten turquesa, pero nunca en la misma idea (las dos primeras usan ángulos; las otras, el banco).
 * Estado: completa (14 nov 2026): seis ideas, una por tema del catálogo.
 * Códigos de error nuevos (hipótesis, sin dato propio): SN-SUPERFICIE, SN-REFRACTA, SN-DOBLE, RT-SIEMPRE, RT-RASANTE,
 * EP-MITAD, EP-FIJA, EP-TOTAL, EP-ENTERO, OP-VIRTUAL, OP-SIEMPRE-REAL, OP-PLANO, OP-SIGNO, OP-RESTA, OP-MITAD,
 * FAB-AIRE, FAB-INVERSA, FAB-DIVERGE, P-CM, P-INVERSA.
 *
 * Ficha de tarea (diseno-y-animacion):
 *   Promesa: seis relaciones de la luz que se desvía y se refleja, jugadas antes de preguntarlas.
 *   Persona y condiciones: postulante de 5.º, celular de gama baja a 360 px, a veces sin conexión.
 *   Resultado observable: aplica Snell con ángulos desde la normal, ubica una imagen con 1/f y calcula una potencia.
 *   Orden de atención: 1.º la figura (frontera o banco) · 2.º la lectura en vivo · acción: botón fijo · fondo: Tilo.
 *   Estados: juego sin tocar · predicción pendiente · coincide / no coincide · paso de mira · caso nuevo · «No sé».
 *   Duda que resuelve: ¿dónde está la imagen, y por qué se puede ver aunque sea virtual?
 */
(function (root, fabrica) {
  const def = fabrica(typeof module === 'object' && module.exports ? require('../../../nucleo/kit/kit.js') : root.Kit);
  if (typeof module === 'object' && module.exports) module.exports = def;
  else root.Teoria.unidad(def);
})(typeof self !== 'undefined' ? self : this, function (Kit) {
  'use strict';
  const f = (n, d = 2) => Kit.formatear(n, d);
  const t1 = { sub: [{ v: 'c-o', t: 'θ' }, '1'] }, t2 = { sub: [{ v: 'c-i', t: 'θ' }, '2'] }, tc = { sub: [{ v: 'c-o', t: 'θ' }, 'c'] };
  const dO = { sub: [{ v: 'c-h', t: 'd' }, 'o'] }, dI = { sub: [{ v: 'c-d', t: 'd' }, 'i'] }, fF = { v: 'c-i', t: 'f' };
  const n1 = { sub: ['n', '1'] }, n2 = { sub: ['n', '2'] };
  const COL = { o: 'h', i: 'd', f: 'i', r: 'tinta' };
  const rad = g => g * Math.PI / 180, grad = r => r * 180 / Math.PI;
  const sen = g => ({ 30: 0.5, 37: 0.6, 45: Math.SQRT1_2, 53: 0.8, 60: Math.sqrt(3) / 2 })[g] || Math.sin(rad(g));
  function azar(s) {
    let q = (s * 2654435761 + 12345) >>> 0;
    const r = () => { q = (q + 0x6D2B79F5) >>> 0; let z = q; z = Math.imul(z ^ (z >>> 15), z | 1); z ^= z + Math.imul(z ^ (z >>> 7), z | 61); return ((z ^ (z >>> 14)) >>> 0) / 4294967296; };
    r.ent = (lo, hi) => lo + Math.floor(r() * (hi - lo + 1));
    r.de = xs => xs[Math.floor(r() * xs.length)];
    return r;
  }
  function opciones(correcta, distractores, fmt, ok = () => true) {
    const vistos = new Set([fmt(correcta)]);
    const ops = [{ id: 'c', texto: fmt(correcta), correcta: true }];
    for (const d of distractores) {
      if (!Number.isFinite(d.valor) || !ok(d.valor)) continue;
      const txt = fmt(d.valor);
      if (vistos.has(txt)) continue;
      vistos.add(txt);
      ops.push({ id: d.id, texto: txt, error: d.error, siFuera: d.siFuera });
    }
    return ops.slice(0, 4);
  }
  const MEDIOS = { agua: 1.33, vidrio: 1.5, diamante: 2.42 };
  const refracta = (na, nb, a) => { const s = na * Math.sin(rad(a)) / nb; return s > 1 ? null : grad(Math.asin(s)); };

  // ---------- Idea 1: Snell, ángulos desde la normal ----------
  // Cambia: el ángulo de incidencia y el medio de abajo · Permanece: el aire arriba y la normal punteada ·
  // Progresa: el rayo refractado que se acerca a la normal · Se reserva: el rayo reflejado (copia al incidente) ·
  // Debe verse: todos los ángulos se miden desde la normal, y el producto n sen θ se conserva.
  const interfaz = (nb, nombre, a, o = {}) => {
    const b = refracta(1, nb, a);
    return { datos: { n1: 1, n2: nb, nombre1: 'aire', nombre2: nombre, t1: a, t2: b, reflejado: !!o.reflejado, rotulos: { t1: `θ₁ = ${f(a, 0)}°`, t2: o.sinT2 ? undefined : `θ₂ = ${f(b, 1)}°`, r: o.reflejado ? `${f(a, 0)}°` : undefined } }, estado: {} };
  };
  const snell = {
    id: 'snell',
    titulo: 'Snell: desde la normal',
    temas: ['Reflexión y refracción'],
    pieza: 'fis-interfaz',
    juega: {
      consigna: 'Un rayo pasa del aire a otro medio. Cambia su ángulo, medido desde la normal punteada, y el medio de abajo.',
      voz: 'Compara los dos ángulos cuando el medio es más denso.',
      controles: [
        { id: 'a', etiqueta: 'θ₁', color: 'c-o', min: 0, max: 80, paso: 10, inicio: 40, unidad: '°', decimales: 0 },
        { id: 'm', etiqueta: 'Medio', opciones: Object.keys(MEDIOS).map(k => ({ valor: k, texto: k })) },
      ],
      dibujo: val => interfaz(MEDIOS[val.m], val.m, val.a),
      lectura: val => [t2, ` = ${f(refracta(1, MEDIOS[val.m], val.a), 1)}° (n = ${f(MEDIOS[val.m], 2)})`],
      minimo: 3,
    },
    predice: {
      pregunta: 'Además de entrar al vidrio, una parte de la luz rebota en la superficie. Si el rayo llega a 40° de la normal, ¿con qué ángulo rebota?',
      opciones: [
        { id: 'c', texto: '40° de la normal', correcta: true },
        { id: 'sup', texto: '50° de la normal', error: 'SN-SUPERFICIE', siFuera: '50° es el ángulo con la superficie. Los ángulos de la óptica se miden desde la normal.' },
        { id: 'refr', texto: `${f(refracta(1, 1.5, 40), 1)}° de la normal`, error: 'SN-REFRACTA', siFuera: 'Ese es el ángulo del rayo que entra al vidrio. El que rebota no cambia de medio.' },
        { id: 'doble', texto: '80° de la normal', error: 'SN-DOBLE', siFuera: '80° es el ángulo entre el rayo que llega y el que rebota, no con la normal.' },
      ],
      dibujo: interfaz(1.5, 'vidrio', 40),
      revelar: interfaz(1.5, 'vidrio', 40, { reflejado: true }),
      coincide: 'Coincide: el rayo reflejado forma con la normal el mismo ángulo que el incidente.',
    },
    mira: {
      datos: Object.assign(interfaz(4 / 3, 'agua', 53, { reflejado: true }).datos, { n2: 1.33, rotulos: { t1: 'θ₁ = 53°', t2: 'θ₂ = 37°', r: '53°' } }),
      pasos: [
        { estado: { paso: 1 }, texto: 'El rayo llega a 53° de la normal desde el aire.', ecuacion: [n1, ' sen ', t1, ' = 1 · 0,8 = 0,8'] },
        { estado: { paso: 2 }, texto: 'Una parte rebota con el mismo ángulo.', ecuacion: ['θ reflejado = ', t1, ' = 53°'] },
        { estado: { paso: 3 }, texto: 'La que entra al agua conserva n · sen θ.', ecuacion: ['sen ', t2, ' = ', { frac: ['0,8', '4/3'] }, ' = 0,6'] },
        { estado: { paso: 3 }, texto: 'En el medio más denso, el rayo se acerca a la normal.', ecuacion: [t2, ' = 37° < ', t1] },
      ],
    },
    regla: {
      texto: 'El rayo reflejado sale con el mismo ángulo que llega. El refractado cumple la ley de Snell; los ángulos se miden desde la normal.',
      ecuacion: [n1, ' sen ', t1, ' = ', n2, ' sen ', t2],
      condicion: 'la frontera es lisa. Al entrar a un medio de mayor n, se acerca a la normal; a 0°, no se desvía.',
    },
    ahoraTu: {
      pieza: 'fis-interfaz',
      generar(s) {
        const r = azar(s), [nom, nb, nbTxt] = r.de([['agua', 4 / 3, '4/3'], ['vidrio', 1.5, '1,5'], ['un plástico', 1.25, '1,25'], ['diamante', 2.5, '2,5']]);
        const a = r.de([30, 37, 53, 60]), sa = sen(a), s2 = sa / nb;
        return {
          pregunta: [`Un rayo pasa del aire a ${nom} (n = ${nbTxt}) con `, t1, ` = ${f(a, 0)}° (sen ${f(a, 0)}° = ${f(sa, 3)}). ¿Cuánto vale sen `, t2, '?'],
          dibujo: Object.assign(interfaz(nb, nom, a, { sinT2: true }), {}),
          opciones: opciones(s2, [
            { id: 'inv', valor: sa * nb, error: 'R3', siFuera: 'Eso multiplica por n: el rayo se alejaría de la normal al entrar.' },
            { id: 'igual', valor: sa, error: 'R1', siFuera: 'Así sería si el rayo no se desviara; aquí cambia de medio.' },
            { id: 'cos', valor: Math.cos(rad(a)) / nb, error: 'SN-SUPERFICIE', siFuera: 'Eso usa el ángulo con la superficie, no con la normal.' },
          ], x => f(x, 3), x => x <= 1),
          solucion: { texto: 'n · sen θ se conserva al cruzar.', ecuacion: ['sen ', t2, ` = ${f(sa, 3)} / ${nbTxt} = ${f(s2, 3)}`], dibujo: interfaz(nb, nom, a) },
        };
      },
    },
  };

  // ---------- Idea 2: reflexión total ----------
  // Cambia: el ángulo dentro del medio denso y el material · Permanece: el aire abajo y la normal ·
  // Progresa: el refractado que se tumba hacia la frontera · Se reserva: pasar el ángulo crítico (no sale nada) ·
  // Debe verse: solo de mayor a menor índice, y solo pasado θc, la luz queda atrapada.
  const total = (nom, n, a, rot = true) => {
    const b = refracta(n, 1, a), c = grad(Math.asin(1 / n));
    return { datos: { n1: n, n2: 1, nombre1: nom, nombre2: 'aire', t1: a, t2: b, reflejado: true, critico: c, rotulos: { t1: `θ₁ = ${f(a, 0)}°`, t2: b === null || !rot ? undefined : `θ₂ = ${f(b, 1)}°`, c: rot ? `θc = ${f(c, 1)}°` : 'θc' } }, estado: {} };
  };
  const totalIdea = {
    id: 'reflexion-total',
    titulo: 'Luz atrapada: reflexión total',
    temas: ['Reflexión total'],
    pieza: 'fis-interfaz',
    juega: {
      consigna: 'Ahora la luz va de un material denso al aire. Sube el ángulo y mira qué le pasa al rayo que sale.',
      voz: 'Fíjate en la línea roja punteada: es el ángulo crítico.',
      controles: [
        { id: 'a', etiqueta: 'θ₁', color: 'c-o', min: 0, max: 40, paso: 5, inicio: 20, unidad: '°', decimales: 0 },
        { id: 'm', etiqueta: 'Material', opciones: [{ valor: 'vidrio', texto: 'vidrio' }, { valor: 'diamante', texto: 'diamante' }] },
      ],
      dibujo: val => total(val.m, MEDIOS[val.m], val.a),
      lectura: val => { const b = refracta(MEDIOS[val.m], 1, val.a); return b === null ? ['No sale: se refleja toda'] : [t2, ` = ${f(b, 1)}°: se aleja de la normal`]; },
      minimo: 3,
    },
    predice: {
      pregunta: 'En el fondo de una piscina, una linterna apunta hacia arriba con 60° desde la normal de la superficie. El ángulo crítico del agua es 48,8°. ¿Sale la luz al aire?',
      opciones: [
        { id: 'c', texto: 'No: se refleja toda hacia el agua', correcta: true },
        { id: 'acerca', texto: 'Sí, y se acerca a la normal', error: 'R3', siFuera: 'Acercarse a la normal pasa al entrar a un medio más denso. Al aire, se aleja.' },
        { id: 'siempre', texto: 'Sí: algo de luz siempre sale', error: 'RT-SIEMPRE', siFuera: 'Por debajo del ángulo crítico, sí sale algo. Pasado θc, no sale nada.' },
        { id: 'rasante', texto: 'Sale rasante, pegada a la superficie', error: 'RT-RASANTE', siFuera: 'Eso pasa justo en el ángulo crítico. A 60°, ya no hay rayo que salga.' },
      ],
      dibujo: (() => { const d = total('agua', 1.33, 60, false); d.datos.reflejado = false; d.datos.t2 = 0; d.datos.rotulos.t2 = undefined; return { datos: Object.assign({}, d.datos, { t2: null, reflejado: false }), estado: { paso: 1 } }; })(),
      revelar: total('agua', 1.33, 60),
      coincide: 'Coincide: pasado el ángulo crítico, la frontera funciona como un espejo perfecto.',
    },
    mira: {
      datos: total('vidrio', 1.5, 50).datos,
      pasos: [
        { estado: { paso: 1 }, texto: 'La luz va del vidrio al aire: al salir, se aleja de la normal.', ecuacion: ['1,5 sen ', t1, ' = 1 · sen ', t2] },
        { estado: { paso: 1 }, texto: 'El ángulo crítico es el que deja salir el rayo a 90°.', ecuacion: ['sen ', tc, ' = ', { frac: ['1', '1,5'] }, ' → ', tc, ' = 41,8°'] },
        { estado: { paso: 3 }, texto: 'A 50°, Snell pediría sen θ₂ = 1,15: no existe ese ángulo.', ecuacion: ['1,5 · sen 50° = 1,15 > 1'] },
        { estado: { paso: 3 }, texto: 'Toda la luz se refleja dentro del vidrio.', ecuacion: [t1, ' > ', tc, ' → reflexión total'] },
      ],
    },
    regla: {
      texto: 'Cuando la luz va hacia un medio de menor índice, pasado el ángulo crítico no sale: se refleja toda.',
      ecuacion: ['sen ', tc, ' = ', { frac: [n2, n1] }],
      condicion: 'la luz va de mayor a menor índice (n₁ > n₂) y el ángulo de incidencia supera θc.',
    },
    ahoraTu: {
      pieza: 'fis-interfaz',
      generar(s) {
        const r = azar(s), [nom, n, nTxt] = r.de([['vidrio', 1.5, '1,5'], ['diamante', 2.5, '2,5'], ['agua', 4 / 3, '4/3'], ['un plástico', 1.25, '1,25']]);
        const c = grad(Math.asin(1 / n));
        if (s % 2 === 0) {
          return {
            pregunta: `Luz que viaja dentro de ${nom} (n = ${nTxt}) llega a una frontera con el aire. ¿Cuánto vale el seno de su ángulo crítico?`,
            opciones: opciones(1 / n, [
              { id: 'inv', valor: n, error: 'RT-SIEMPRE', siFuera: 'Eso es n₁/n₂; un seno no puede pasar de 1.' },
              { id: 'resta', valor: 1 - 1 / n, error: 'RT-RASANTE', siFuera: 'Eso resta; el seno del crítico es n₂/n₁.' },
              { id: 'cos', valor: Math.sqrt(1 - 1 / (n * n)), error: 'SN-SUPERFICIE', siFuera: 'Ese es el coseno del crítico: el ángulo con la superficie.' },
            ], x => f(x, 3), x => x > 0),
            solucion: { texto: 'n₂ entre n₁, con el aire como n₂ = 1.', ecuacion: ['sen ', tc, ` = 1 / ${nTxt} = ${f(1 / n, 3)} → `, tc, ` = ${f(c, 1)}°`], dibujo: total(nom, n, Math.max(5, Math.round(c / 5) * 5)) },
          };
        }
        const a = r.de([20, 30, 40, 50, 60].filter(x => Math.abs(x - c) > 3));
        const sale = a < c;
        return {
          pregunta: `Dentro de ${nom} (n = ${nTxt}, θc = ${f(c, 1)}°), la luz llega al aire con ${f(a, 0)}° desde la normal. ¿Qué le pasa?`,
          dibujo: { datos: Object.assign({}, total(nom, n, a, false).datos, { t2: null, reflejado: false, critico: null }), estado: { paso: 1 } },
          opciones: [
            { id: 'c', texto: sale ? 'Sale, alejándose de la normal' : 'No sale: se refleja toda', correcta: true },
            { id: 'otro', texto: sale ? 'No sale: se refleja toda' : 'Sale, alejándose de la normal', error: sale ? 'RT-RASANTE' : 'RT-SIEMPRE', siFuera: sale ? 'Eso pasa por encima de θc; aquí el ángulo es menor.' : 'Eso pasa por debajo de θc; aquí lo supera.' },
            { id: 'acerca', texto: 'Sale, acercándose a la normal', error: 'R3', siFuera: 'Al pasar a un medio menos denso, el rayo se aleja de la normal.' },
          ],
          solucion: { texto: sale ? 'Su ángulo es menor que el crítico.' : 'Su ángulo supera el crítico.', ecuacion: [`${f(a, 0)}° ${sale ? '<' : '>'} `, tc, ` = ${f(c, 1)}°`], dibujo: total(nom, n, a) },
        };
      },
    },
  };

  // ---------- Idea 3: el espejo plano ----------
  // Cambia: la distancia del objeto al espejo · Permanece: el tamaño del objeto y el espejo ·
  // Progresa: los dos rayos que rebotan y sus prolongaciones detrás · Se reserva: alejarse (la imagen se aleja el doble de ti) ·
  // Debe verse: la imagen está tan detrás como el objeto delante, del mismo tamaño y derecha.
  const plano = (d0, h = 3, alc = 16, conImg = true) => ({ datos: { tipo: 'espejo-plano', alcance: alc, alto: 6, colores: COL, objeto: { d: d0, h }, imagen: conImg ? { d: -d0, h } : null, rayos: conImg ? ['paralelo', 'centro'] : [], rotulos: { o: `${f(d0, 0)} cm`, i: conImg ? `${f(d0, 0)} cm detrás` : undefined } }, estado: {} });
  const planoIdea = {
    id: 'espejo-plano',
    titulo: 'El espejo plano copia distancias',
    temas: ['Espejos planos'],
    pieza: 'fis-banco-optico',
    juega: {
      consigna: 'Una vela está frente a un espejo plano. Muévela y mira dónde se cruzan las prolongaciones de los rayos que rebotan.',
      voz: 'Compara la distancia de la vela con la de su imagen.',
      controles: [{ id: 'd', etiqueta: 'dₒ', color: 'c-h', min: 2, max: 10, paso: 2, inicio: 6, unidad: 'cm', decimales: 0 }],
      dibujo: val => plano(val.d),
      lectura: val => [dI, ` = ${f(val.d, 0)} cm detrás · vela–imagen = ${f(2 * val.d, 0)} cm`],
      minimo: 3,
    },
    predice: {
      pregunta: 'Una vela está a 6 cm de un espejo plano. La alejas 4 cm más del espejo. ¿Cuánto aumenta la distancia entre la vela y su imagen?',
      opciones: [
        { id: 'c', texto: '8 cm', correcta: true },
        { id: 'mitad', texto: '4 cm', error: 'EP-MITAD', siFuera: '4 cm se aleja la vela del espejo. La imagen también se aleja 4 cm, al otro lado.' },
        { id: 'fija', texto: 'Nada: la imagen está en el espejo', error: 'EP-FIJA', siFuera: 'La imagen parece pegada al vidrio, pero se forma detrás, tan lejos como la vela.' },
        { id: 'total', texto: '20 cm', error: 'EP-TOTAL', siFuera: '20 cm es la distancia nueva entre vela e imagen; aumentó desde 12 cm.' },
      ],
      dibujo: plano(6, 3, 16, false),
      revelar: plano(10, 3, 16, true),
      coincide: 'Coincide: la imagen se aleja 4 cm detrás mientras la vela se aleja 4 cm delante.',
    },
    mira: {
      datos: plano(6).datos,
      pasos: [
        { estado: { paso: 1 }, texto: 'Un rayo que llega perpendicular vuelve sobre sí mismo.', ecuacion: ['ángulo = 0°'] },
        { estado: { paso: 2 }, texto: 'Otro rebota en el espejo con el mismo ángulo.', ecuacion: ['θ reflejado = θ incidente'] },
        { estado: { paso: 2 }, texto: 'Detrás, sus prolongaciones se cruzan a 6 cm: ahí la ve el ojo.', ecuacion: [dI, ' = ', dO, ' = 6 cm'] },
      ],
    },
    regla: {
      texto: 'Un espejo plano forma una imagen virtual, derecha y del mismo tamaño, tan detrás del espejo como el objeto está delante.',
      ecuacion: [dI, ' = ', dO, '   ·   tamaño de la imagen = tamaño del objeto'],
      condicion: 'las distancias se miden perpendiculares al espejo. La imagen es virtual: la forman prolongaciones, y el ojo la ve.',
    },
    ahoraTu: {
      pieza: 'fis-banco-optico',
      generar(s) {
        const r = azar(s), tipo = s % 3;
        if (tipo === 0) {
          const d0 = r.ent(2, 8), dd = r.ent(1, 5);
          return {
            pregunta: `Un objeto está a ${f(d0, 0)} m de un espejo plano y se aleja ${f(dd, 0)} m más. ¿A qué distancia queda de su imagen?`,
            opciones: opciones(2 * (d0 + dd), [
              { id: 'uno', valor: d0 + dd, error: 'EP-MITAD', siFuera: 'Esa es la distancia al espejo; la imagen está otro tanto detrás.' },
              { id: 'cambio', valor: 2 * dd, error: 'EP-TOTAL', siFuera: 'Eso es cuánto aumentó, no la distancia nueva.' },
              { id: 'viejo', valor: 2 * d0, error: 'EP-FIJA', siFuera: 'Esa era la distancia antes de alejarse.' },
            ], x => `${f(x, 0)} m`),
            solucion: { texto: 'La imagen está tan detrás como el objeto delante.', ecuacion: [`2 · (${f(d0, 0)} + ${f(dd, 0)}) = ${f(2 * (d0 + dd), 0)} m`] },
          };
        }
        if (tipo === 1) {
          const H = r.de([150, 160, 170, 180]);
          return {
            pregunta: `Una persona de ${f(H, 0)} cm quiere verse entera en un espejo plano colgado en la pared. ¿Qué alto mínimo necesita el espejo?`,
            opciones: opciones(H / 2, [
              { id: 'entero', valor: H, error: 'EP-ENTERO', siFuera: 'Parece que hace falta todo el alto, pero el rayo de los pies rebota a media altura.' },
              { id: 'doble', valor: 2 * H, error: 'EP-TOTAL', siFuera: 'Eso usa la distancia a la imagen; el espejo está a la mitad.' },
              { id: 'cuarto', valor: H / 4, error: 'EP-MITAD', siFuera: 'Eso divide dos veces entre 2.' },
            ], x => `${f(x, 0)} cm`),
            solucion: { texto: 'Cada rayo rebota a medio camino entre el ojo y el punto que mira.', ecuacion: [`${f(H, 0)} / 2 = ${f(H / 2, 0)} cm`] },
          };
        }
        const d0 = r.ent(2, 9), h = r.ent(2, 4);
        return {
          pregunta: [`Un objeto de ${f(h, 0)} cm está a `, dO, ` = ${f(d0, 0)} cm de un espejo plano. ¿Dónde y de qué tamaño es su imagen?`],
          dibujo: plano(d0, h, 16, false),
          opciones: [
            { id: 'c', texto: `${f(d0, 0)} cm detrás, de ${f(h, 0)} cm`, correcta: true },
            { id: 'mitad', texto: `${f(d0 / 2, 1)} cm detrás, de ${f(h, 0)} cm`, error: 'EP-MITAD', siFuera: 'La imagen no está a mitad de camino: está a la misma distancia.' },
            { id: 'en', texto: `En el espejo, de ${f(h / 2, 1)} cm`, error: 'EP-FIJA', siFuera: 'La imagen parece pegada al vidrio, pero está detrás y del mismo tamaño.' },
          ],
          solucion: { texto: 'Misma distancia detrás, mismo tamaño.', ecuacion: [dI, ` = ${f(d0, 0)} cm`], dibujo: plano(d0, h) },
        };
      },
    },
  };

  // ---------- Idea 4: espejo cóncavo y la ecuación de espejos ----------
  // Cambia: la distancia del objeto · Permanece: f = 8 cm y el tamaño del objeto ·
  // Progresa: los tres rayos principales, uno por paso, hasta la imagen · Se reserva: el objeto dentro del foco (imagen virtual) ·
  // Debe verse: la imagen está en el cruce de los rayos, y la ecuación da ese mismo lugar.
  const FC = 8;
  const imgEsp = (fv, d0, h) => { const di = 1 / (1 / fv - 1 / d0); return { d: di, h: -h * di / d0 }; };
  const espejo = (fv, d0, h = 2, o = {}) => {
    // alcance 38 cm y alto 4 cm: el objeto de 2 cm ocupa media figura y la imagen virtual cabe detrás.
    const im = imgEsp(fv, d0, h);
    return { datos: { tipo: 'espejo', f: fv, alcance: o.alcance || 38, alto: o.alto || 4.4, colores: COL, objeto: { d: d0, h }, imagen: o.sinImg ? null : im, rayos: o.sinImg ? [] : ['paralelo', 'centro', 'foco'], rotulos: { o: 'objeto', i: o.sinImg ? undefined : 'imagen' } }, estado: {} };
  };
  const concavo = {
    id: 'espejo-concavo',
    titulo: 'Espejos curvos: 1/f',
    temas: ['Espejos esféricos'],
    pieza: 'fis-banco-optico',
    juega: {
      consigna: 'Un objeto frente a un espejo cóncavo de f = 8 cm. Muévelo y mira dónde se cruzan los rayos que rebotan.',
      voz: 'Acércalo al foco y mira el tamaño de la imagen.',
      controles: [{ id: 'd', etiqueta: 'dₒ', color: 'c-h', min: 12, max: 36, paso: 6, inicio: 24, unidad: 'cm', decimales: 0 }],
      dibujo: val => espejo(FC, val.d),
      lectura: val => { const im = imgEsp(FC, val.d, 2); return [dI, ` = ${f(im.d, 1)} cm · m = ${f(-im.d / val.d, 2)}`]; },
      minimo: 3,
    },
    predice: {
      pregunta: 'Ahora el objeto está a 4 cm del mismo espejo cóncavo (f = 8 cm), más cerca que el foco. ¿Cómo es su imagen?',
      opciones: [
        { id: 'c', texto: 'Virtual, derecha y más grande, detrás del espejo', correcta: true },
        { id: 'nada', texto: 'No hay imagen: no se forma en una pantalla', error: 'OP-VIRTUAL', siFuera: 'En una pantalla no aparece, es cierto. Pero el ojo sí la ve: es virtual.' },
        { id: 'real', texto: 'Real e invertida, delante del espejo', error: 'OP-SIEMPRE-REAL', siFuera: 'Así es más allá del foco. Dentro del foco, los rayos reflejados se separan.' },
        { id: 'plano', texto: 'Igual que en un espejo plano', error: 'OP-PLANO', siFuera: 'Es derecha y virtual como en el plano, pero el espejo curvo la agranda.' },
      ],
      dibujo: espejo(FC, 4, 2, { sinImg: true }),
      revelar: espejo(FC, 4, 2),
      coincide: 'Coincide: así funcionan los espejos de aumento para maquillarse o afeitarse.',
    },
    mira: {
      datos: espejo(FC, 24).datos,
      pasos: [
        { estado: { paso: 1 }, texto: 'El rayo paralelo al eje rebota pasando por el foco.', ecuacion: [fF, ' = 8 cm'] },
        { estado: { paso: 2 }, texto: 'El que llega al vértice rebota simétrico respecto del eje.', ecuacion: [dO, ' = 24 cm'] },
        { estado: { paso: 3 }, texto: 'El que pasa por el foco vuelve paralelo. Se cruzan en la imagen.', ecuacion: [{ frac: ['1', fF] }, ' = ', { frac: ['1', dO] }, ' + ', { frac: ['1', dI] }] },
        { estado: { paso: 3 }, texto: 'La imagen queda a 12 cm, real, invertida y de la mitad.', ecuacion: [dI, ' = 12 cm   ·   m = −', { frac: ['12', '24'] }, ' = −0,5'] },
      ],
    },
    regla: {
      texto: 'En un espejo esférico, objeto, imagen y foco cumplen la ecuación de espejos; el aumento compara tamaños.',
      ecuacion: [{ frac: ['1', fF] }, ' = ', { frac: ['1', dO] }, ' + ', { frac: ['1', dI] }, '   ·   m = −', { frac: [dI, dO] }, '   ·   ', fF, ' = R/2'],
      condicion: 'rayos cerca del eje. dᵢ > 0: real, delante; dᵢ < 0: virtual, detrás. Cóncavo f > 0, convexo f < 0.',
    },
    ahoraTu: {
      pieza: 'fis-banco-optico',
      generar(s) {
        const r = azar(s), conv = s % 3 === 2, fv = (conv ? -1 : 1) * r.de([6, 10, 12, 15, 20]);
        let d0 = r.de([5, 10, 15, 20, 30, 60]);
        if (Math.abs(d0 - fv) < 1e-9) d0 += 5;
        const im = imgEsp(fv, d0, 2), di = im.d;
        const fmt = x => `${f(Math.abs(x), 1)} cm, ${x > 0 ? 'real' : 'virtual'}`;
        return {
          pregunta: [`Un objeto está a `, dO, ` = ${f(d0, 0)} cm de un espejo ${conv ? 'convexo' : 'cóncavo'} con |`, fF, `| = ${f(Math.abs(fv), 0)} cm. ¿Dónde se forma su imagen?`],
          dibujo: espejo(fv, d0, 2, { sinImg: true, alcance: Math.max(20, d0 * 1.15), alto: 4.4 }),
          opciones: opciones(di, [
            { id: 'signo', valor: 1 / (1 / fv + 1 / d0), error: 'OP-SIGNO', siFuera: 'Eso suma 1/f y 1/dₒ; hay que restar 1/dₒ de 1/f.' },
            { id: 'resta', valor: d0 - fv, error: 'OP-RESTA', siFuera: 'Las distancias no se restan: se restan sus inversas.' },
            { id: 'fsigno', valor: 1 / (-1 / fv - 1 / d0), error: 'OP-SIGNO', siFuera: 'Eso usa el signo de f al revés.' },
            { id: 'mitad', valor: d0 / 2, error: 'OP-MITAD', siFuera: 'Eso divide dₒ entre 2: confunde f con R.' },
          ], fmt),
          solucion: { texto: 'Se despeja 1/dᵢ = 1/f − 1/dₒ.', ecuacion: [{ frac: ['1', dI] }, ` = ${f(1 / fv, 4)} − ${f(1 / d0, 4)} → `, dI, ` = ${f(di, 1)} cm`], dibujo: espejo(fv, d0, 2, { alcance: Math.max(20, d0 * 1.15, Math.abs(im.d) * (im.d < 0 ? 1.85 : 1.15)), alto: Math.max(4.4, Math.abs(im.h) * 1.2) }) },
        };
      },
    },
  };

  // ---------- Idea 5: lentes delgadas ----------
  // Cambia: la distancia del objeto a una lente de f = 10 cm · Permanece: f y el tamaño del objeto ·
  // Progresa: rayos principales e imagen · Se reserva: tapar media lente (la imagen sigue entera, más tenue) ·
  // Debe verse: todos los rayos de la punta llegan a la punta de la imagen; cada uno no lleva un pedazo.
  const FL = 10;
  const lente = (fv, d0, h = 3, o = {}) => {
    const im = imgEsp(fv, d0, h);
    return { datos: { tipo: 'lente', f: fv, alcance: o.alcance || 40, alto: o.alto || 6, colores: COL, objeto: { d: d0, h }, imagen: o.sinImg ? null : im, rayos: o.sinImg || o.tapa ? [] : (fv > 0 ? ['paralelo', 'centro', 'foco'] : ['paralelo', 'centro']), tapa: !!o.tapa, rotulos: { o: 'objeto', i: o.sinImg ? undefined : 'imagen' } }, estado: {} };
  };
  const lenteIdea = {
    id: 'lente-delgada',
    titulo: 'Lentes: todos llegan juntos',
    temas: ['Lentes delgadas'],
    pieza: 'fis-banco-optico',
    juega: {
      consigna: 'Un objeto frente a una lente convergente de f = 10 cm. Muévelo y mira dónde se cruzan los rayos al otro lado.',
      voz: 'Mira qué pasa con la imagen al acercar el objeto al foco.',
      controles: [{ id: 'd', etiqueta: 'dₒ', color: 'c-h', min: 15, max: 40, paso: 5, inicio: 30, unidad: 'cm', decimales: 0 }],
      dibujo: val => lente(FL, val.d),
      lectura: val => { const im = imgEsp(FL, val.d, 3); return [dI, ` = ${f(im.d, 1)} cm · m = ${f(-im.d / val.d, 2)}`]; },
      minimo: 3,
    },
    predice: {
      pregunta: 'Con el objeto a 25 cm, tapas con un cartón la mitad de arriba de la lente. ¿Qué pasa con la imagen en la pantalla?',
      opciones: [
        { id: 'c', texto: 'Se ve entera, pero más tenue', correcta: true },
        { id: 'mitad', texto: 'Desaparece la mitad de la imagen', error: 'OP-MITAD', siFuera: 'Así sería si cada rayo llevara un pedazo. Cada punto manda luz por toda la lente.' },
        { id: 'nada', texto: 'Desaparece toda la imagen', error: 'OP-VIRTUAL', siFuera: 'Sin lente no habría imagen. Media lente todavía junta los rayos.' },
        { id: 'igual', texto: 'No cambia nada', error: 'OP-MITAD', siFuera: 'La forma no cambia, es cierto. Pero llega la mitad de la luz.' },
      ],
      dibujo: lente(FL, 25, 3, { sinImg: true }),
      revelar: lente(FL, 25, 3, { tapa: true }),
      coincide: 'Coincide: los rayos que pasan por la mitad de abajo también llegan a la punta de la imagen.',
    },
    mira: {
      datos: lente(FL, 30).datos,
      pasos: [
        { estado: { paso: 1 }, texto: 'El rayo paralelo al eje sale pasando por el foco del otro lado.', ecuacion: [fF, ' = 10 cm'] },
        { estado: { paso: 2 }, texto: 'El que pasa por el centro de la lente sigue recto.', ecuacion: [dO, ' = 30 cm'] },
        { estado: { paso: 3 }, texto: 'El que pasa por el primer foco sale paralelo. Se cruzan en la imagen.', ecuacion: [{ frac: ['1', dI] }, ' = ', { frac: ['1', '10'] }, ' − ', { frac: ['1', '30'] }, ' → ', dI, ' = 15 cm'] },
        { estado: { paso: 3 }, texto: 'Es real, invertida y de la mitad del tamaño.', ecuacion: ['m = −', { frac: ['15', '30'] }, ' = −0,5'] },
      ],
    },
    regla: {
      texto: 'En una lente delgada, objeto, imagen y foco cumplen la misma ecuación que los espejos. Todos los rayos de un punto llegan al mismo punto de la imagen.',
      ecuacion: [{ frac: ['1', fF] }, ' = ', { frac: ['1', dO] }, ' + ', { frac: ['1', dI] }, '   ·   m = −', { frac: [dI, dO] }],
      condicion: 'lente delgada y rayos cerca del eje. Convergente f > 0; divergente f < 0. dᵢ < 0: imagen virtual, del lado del objeto.',
    },
    ahoraTu: {
      pieza: 'fis-banco-optico',
      generar(s) {
        const r = azar(s), div = s % 3 === 2, fv = (div ? -1 : 1) * r.de([5, 10, 12, 20]);
        let d0 = r.de([4, 8, 15, 20, 30, 60]);
        if (Math.abs(d0 - fv) < 1e-9) d0 += 2;
        const im = imgEsp(fv, d0, 3), di = im.d, pide = s % 2 ? 'm' : 'd';
        if (pide === 'm') {
          const m = -di / d0;
          return {
            pregunta: [`Una lente ${div ? 'divergente' : 'convergente'} con |`, fF, `| = ${f(Math.abs(fv), 0)} cm tiene un objeto a `, dO, ` = ${f(d0, 0)} cm. Su imagen está a `, dI, ` = ${f(di, 1)} cm. ¿Cuánto vale el aumento?`],
            opciones: opciones(m, [
              { id: 'signo', valor: di / d0, error: 'OP-SIGNO', siFuera: 'Ese es el tamaño relativo, pero el signo dice si se invierte: m = −dᵢ/dₒ.' },
              { id: 'inv', valor: -d0 / di, error: 'OP-SIGNO', siFuera: 'Eso divide al revés: es dᵢ sobre dₒ.' },
              { id: 'f', valor: -fv / d0, error: 'OP-RESTA', siFuera: 'Eso usa f en vez de la distancia de la imagen.' },
            ], x => f(x, 2)),
            solucion: { texto: 'Imagen sobre objeto, con signo menos.', ecuacion: [`m = −(${f(di, 1)}) / ${f(d0, 0)} = ${f(m, 2)}`] },
          };
        }
        const fmt = x => `${f(Math.abs(x), 1)} cm, ${x > 0 ? 'real' : 'virtual'}`;
        return {
          pregunta: [`Un objeto está a `, dO, ` = ${f(d0, 0)} cm de una lente ${div ? 'divergente' : 'convergente'} con |`, fF, `| = ${f(Math.abs(fv), 0)} cm. ¿Dónde se forma su imagen?`],
          dibujo: lente(fv, d0, 3, { sinImg: true, alcance: Math.max(20, d0 * 1.15) }),
          opciones: opciones(di, [
            { id: 'signo', valor: 1 / (1 / fv + 1 / d0), error: 'OP-SIGNO', siFuera: 'Eso suma 1/f y 1/dₒ; hay que restar.' },
            { id: 'resta', valor: d0 - fv, error: 'OP-RESTA', siFuera: 'Las distancias no se restan: se restan sus inversas.' },
            { id: 'fsigno', valor: 1 / (-1 / fv - 1 / d0), error: 'OP-SIGNO', siFuera: 'Eso usa el signo de f al revés.' },
          ], fmt),
          solucion: { texto: 'Se despeja 1/dᵢ = 1/f − 1/dₒ.', ecuacion: [dI, ` = ${f(di, 1)} cm`], dibujo: lente(fv, d0, 3, { alcance: Math.max(20, d0 * 1.15, Math.abs(im.d) * 1.15), alto: Math.max(6, Math.abs(im.h) * 1.2) }) },
        };
      },
    },
  };

  // ---------- Idea 6: fabricante y potencia ----------
  // Cambia: el radio de las caras y el índice del vidrio · Permanece: la lente biconvexa simétrica y el haz paralelo ·
  // Progresa: el punto donde el haz converge (F) · Se reserva: la lente bajo el agua (f se alarga) ·
  // Debe verse: más curvatura o más índice acercan el foco; la potencia en dioptrías usa f en metros.
  const fFab = (n, R, nm = 1) => 1 / ((n / nm - 1) * (2 / R));
  const haz = (fv, R, alc = 40) => ({ datos: { tipo: 'lente', f: fv, alcance: alc, alto: 6, colores: COL, haz: [4, 2, -2, -4], grosor: Math.min(1, 10 / R), rotulos: { f: `f = ${f(fv, 1)} cm` } }, estado: {} });
  const fab = {
    id: 'fabricante',
    titulo: 'Curvatura, índice y dioptrías',
    temas: ['Ecuación del fabricante y potencia de una lente'],
    pieza: 'fis-banco-optico',
    juega: {
      consigna: 'Un haz paralelo atraviesa una lente biconvexa en el aire. Cambia el radio de sus caras y el índice del vidrio.',
      voz: 'Mira dónde se juntan los rayos cuando la lente se curva más.',
      controles: [
        { id: 'R', etiqueta: 'R', min: 10, max: 40, paso: 10, inicio: 20, unidad: 'cm', decimales: 0 },
        { id: 'n', etiqueta: 'n', min: 1.4, max: 1.8, paso: 0.1, inicio: 1.5, unidad: '', decimales: 1 },
      ],
      dibujo: val => haz(fFab(val.n, val.R), val.R, 45),
      lectura: val => { const fv = fFab(val.n, val.R); return [fF, ` = ${f(fv, 1)} cm · P = ${f(100 / fv, 1)} D`]; },
      minimo: 3,
    },
    predice: {
      pregunta: ['Una lupa de vidrio (n = 1,5) tiene ', fF, ' = 10 cm en el aire. La sumerges en agua (n = 1,33). ¿Qué pasa con su distancia focal?'],
      opciones: [
        { id: 'c', texto: `Se alarga: unos ${f(10 * 0.5 / (1.5 / 1.33 - 1), 0)} cm`, correcta: true },
        { id: 'igual', texto: 'Sigue en 10 cm', error: 'FAB-AIRE', siFuera: 'Sería cierto si f dependiera solo de la forma. También depende del medio que la rodea.' },
        { id: 'corta', texto: `Se acorta: unos ${f(10 / 1.33, 1)} cm`, error: 'FAB-INVERSA', siFuera: 'Dividir entre 1,33 acorta. Pero el agua se parece más al vidrio: la lente desvía menos.' },
        { id: 'div', texto: 'Se vuelve divergente', error: 'FAB-DIVERGE', siFuera: 'Eso pasaría si el agua tuviera más índice que el vidrio.' },
      ],
      dibujo: haz(10, 10, 45),
      revelar: { datos: Object.assign(haz(10 * 0.5 / (1.5 / 1.33 - 1), 10, 45).datos, { alcance: 45 }), estado: {} },
      coincide: 'Coincide: con un índice relativo menor, la lente desvía menos y el foco se va más lejos.',
    },
    mira: {
      datos: haz(20, 20, 45).datos,
      pasos: [
        { estado: { paso: 1 }, texto: 'Vidrio de n = 1,5 con caras de radio 20 cm, en el aire.', ecuacion: [{ sub: ['R', '1'] }, ' = 20 cm   ·   ', { sub: ['R', '2'] }, ' = −20 cm'] },
        { estado: { paso: 1 }, texto: 'La ecuación del fabricante da el foco.', ecuacion: [{ frac: ['1', fF] }, ' = (1,5 − 1)(', { frac: ['1', '20'] }, ' + ', { frac: ['1', '20'] }, ') = ', { frac: ['1', '20'] }] },
        { estado: { paso: 1 }, texto: 'La potencia usa f en metros: 0,2 m.', ecuacion: ['P = ', { frac: ['1', '0,2 m'] }, ' = 5 D'] },
      ],
    },
    regla: {
      texto: 'La distancia focal sale del índice y de los radios de las caras. La potencia es su inversa, en dioptrías.',
      ecuacion: [{ frac: ['1', fF] }, ' = (n − 1)(', { frac: ['1', { sub: ['R', '1'] }] }, ' − ', { frac: ['1', { sub: ['R', '2'] }] }, ')   ·   P = ', { frac: ['1', fF] }],
      condicion: 'lente delgada en el aire (en otro medio, n es el índice relativo). f en metros para P en dioptrías.',
    },
    ahoraTu: {
      generar(s) {
        const r = azar(s);
        if (s % 2 === 0) {
          const fc = r.de([10, 20, 25, 40, 50, -25, -50]), P = 100 / fc;
          return {
            pregunta: ['Una lente tiene ', fF, ` = ${f(fc, 0)} cm. ¿Cuál es su potencia?`],
            opciones: opciones(P, [
              { id: 'cm', valor: 1 / fc, error: 'P-CM', siFuera: 'Eso usa f en centímetros; la dioptría pide metros.' },
              { id: 'inv', valor: fc / 100, error: 'P-INVERSA', siFuera: 'Ese es f en metros; la potencia es su inversa.' },
              { id: 'signo', valor: -P, error: 'OP-SIGNO', siFuera: 'El signo de P sigue al de f: convergente positiva.' },
            ], x => `${f(x, 2)} D`),
            solucion: { texto: 'Inversa de f en metros.', ecuacion: [`P = 1 / ${f(fc / 100, 2)} m = ${f(P, 2)} D`] },
          };
        }
        const n = r.de([1.4, 1.5, 1.6, 1.8]), R = r.de([10, 15, 20, 30, 40]), fv = fFab(n, R);
        return {
          pregunta: [`Una lente biconvexa simétrica de vidrio (n = ${f(n, 1)}) tiene caras de radio ${f(R, 0)} cm. ¿Cuánto vale `, fF, ' en el aire?'],
          dibujo: haz(fv, R, Math.max(30, fv * 1.3)),
          opciones: opciones(fv, [
            { id: 'una', valor: 1 / ((n - 1) / R), error: 'FAB-AIRE', siFuera: 'Eso cuenta una sola cara; la luz se desvía en las dos.' },
            { id: 'sin-1', valor: 1 / (n * 2 / R), error: 'FAB-INVERSA', siFuera: 'Eso usa n en vez de n − 1.' },
            { id: 'resta', valor: R / 2, error: 'OP-MITAD', siFuera: 'R/2 vale para espejos; en lentes manda el vidrio.' },
          ], x => `${f(x, 1)} cm`, x => x > 0),
          solucion: { texto: 'Con R₂ = −R₁ las dos caras suman.', ecuacion: [{ frac: ['1', fF] }, ` = (${f(n - 1, 1)})(2 / ${f(R, 0)}) → `, fF, ` = ${f(fv, 1)} cm`] },
        };
      },
    },
  };

  return {
    unidad: 'fisica.optica-geometrica',
    version: '0.1.0',
    estado: 'completa',
    requiere: ['/nucleo/kit/piezas/fis-interfaz.js', '/nucleo/kit/piezas/fis-banco-optico.js'],
    historia: {
      texto: 'Explicar la visión obligaba a separar lo que hace el ojo de lo que hace la luz. En el siglo XI, Ibn al-Haytham combinó geometría y experimentos para estudiar reflexión y refracción, discutiendo a los autores griegos. Su Libro de óptica se tradujo al latín y siguió leyéndose siglos después.',
      pregunta: '¿Cómo probarías que la luz va del objeto al ojo y no al revés?',
      fuente: { titulo: 'UNESCO — Ibn al-Haytham’s scientific method', url: 'https://www.unesco.org/en/articles/ibn-al-haythams-scientific-method' },
    },
    ideas: [snell, totalIdea, planoIdea, concavo, lenteIdea, fab],
  };
});
