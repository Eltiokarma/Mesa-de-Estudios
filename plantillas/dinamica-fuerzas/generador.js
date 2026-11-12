/*
 * Generador «La plataforma que gira»: fuerzas en dinámica, estática y gravitación que la escena de
 * dinámica no trabaja (huecos de la admisión de San Marcos, 2019-II a 2024-II).
 * Formato "predicciones" (docs/arquitectura.md). Funciona en el navegador
 * (window.Generadores['dinamica-fuerzas']) y en Node (require). No usa ningún motor.
 *
 * Tipos:
 *   plataforma    el roce estático es la fuerza centrípeta en una plataforma giratoria:
 *                 omega (ω máxima sin resbalar), mu (μs mínimo) y radio (distancia máxima al eje)
 *   motriz        el roce estático en las ruedas que empuja al vehículo: sentido (hacia dónde
 *                 apunta el roce en cada eje, armarTexto), cuales (qué ruedas son motrices,
 *                 armarTexto) y aceleracion (la máxima sin patinar)
 *   peralte       giro horizontal con la normal inclinada, sin roce: curva (rapidez de diseño de
 *                 una curva peraltada), cuenco (ω de una bolita en un cuenco semiesférico),
 *                 normal (la normal del cuenco) y embudo (rapidez dentro de un embudo)
 *   astro         masa contra peso en otro astro: aceleracion (la misma fuerza da la misma
 *                 aceleración en la Luna), peso (peso en un planeta de masa y radio dados) y
 *                 proposiciones (tres afirmaciones V/F sobre la Luna o la órbita, armarTexto)
 *   resorte       dos bloques unidos por un resorte, cada uno con su aceleración: instante (se
 *                 conoce la de B, se pide la de A) y estiramiento (se conoce el resorte, se pide la de B)
 *   tabla         cuatro cajas en reposo empujadas con F distinta, durante t distinto: cuál
 *                 alcanza más rapidez o cuál recorre más (armarTexto)
 *   escalera      escalera en pared lisa y piso con roce, con una persona encima: roce (el roce del
 *                 piso), reaccion (la reacción total del piso) y maximo (la altura máxima a la que sube)
 *   gravitatoria  dos esferas en línea: nulo (dónde se anula la fuerza sobre una tercera masa) y
 *                 neta (la fuerza neta en un punto)
 *
 * Convenciones: g = 10 m/s² en la Tierra; sen 37° = 3/5 y cos 37° = 4/5. Los ángulos de la escalera
 * se miden desde el piso; en el cuenco, desde la vertical; en el embudo, el semiángulo con el eje.
 * Errores: G1 (documentado); E8, E10, G3, G4-sin-radio, G4-mismo-peso, G8 y M8 llevados a la cuenta (parcial); PR1 y PR2
 * del informe transversal y los códigos DF-, ES- y GR- (hipótesis nuestras, de las trampas de la
 * admisión de San Marcos: docs/clasificacion/trampas-admision-unmsm/fisica.md, trampas 7, 23 y 29).
 */
(function (root, fabrica) {
  const nodo = typeof module === 'object' && module.exports;
  const api = fabrica(nodo ? require('../../nucleo/azar.js') : root.Azar,
                      nodo ? require('../../nucleo/predicciones.js') : root.Predicciones);
  if (nodo) module.exports = api;
  else (root.Generadores = root.Generadores || {})[api.id] = api;
})(typeof self !== 'undefined' ? self : this, function (Azar, P) {
  'use strict';
  const DIN = 'docs/investigacion/dinamica-ideas-erroneas.md';
  const EST = 'docs/investigacion/estatica-energia-ideas-erroneas.md';
  const GRA = 'docs/investigacion/momento-gravitacion-ondas-ideas-erroneas.md';
  const TRV = 'docs/investigacion/fisica-calculo-transversal-ideas-erroneas.md';
  const TRA = 'docs/clasificacion/trampas-admision-unmsm/fisica.md';
  const g = 10;
  const h = (id, valor, explicacion, fuente = TRA) => ({ id, valor, explicacion, respaldo: 'hipotesis', fuente });
  const pa = (id, valor, explicacion, fuente) => ({ id, valor, explicacion, respaldo: 'parcial', fuente });
  const doc = (id, valor, explicacion, fuente) => ({ id, valor, explicacion, respaldo: 'documentado', fuente });
  // Errores de armarTexto: la «valor» es la clave y va con su texto.
  const ht = (id, clave, texto, explicacion, respaldo = 'hipotesis', fuente = TRA) => ({ id, clave, texto, explicacion, respaldo, fuente });
  const f = (x, d = 2) => P.formatear(x, d);
  const v = P.v;
  const decs = x => { for (let k = 0; k <= 6; k++) if (limpio(x, k)) return k; return 99; };
  const limpio = (x, dec = 2) => Number.isFinite(x) && Math.abs(x * 10 ** dec - Math.round(x * 10 ** dec)) < 1e-6 && Math.abs(x) < 1e6;
  const TRIG = { 37: { s: 0.6, c: 0.8, t: 0.75 }, 53: { s: 0.8, c: 0.6, t: 4 / 3 }, 60: { s: Math.sqrt(3) / 2, c: 0.5, t: Math.sqrt(3) } };
  const NOTABLES = 'Usa sen 37° = 3/5 y cos 37° = 4/5 (sen 53° = 4/5, cos 53° = 3/5)';
  let notables = NOTABLES;

  function generar(semilla) {
    const rng = Azar.crear('dinamica-fuerzas|' + semilla);
    const [tipo, sub] = rng.elegir([
      ['plataforma', 'omega'], ['plataforma', 'mu'], ['plataforma', 'radio'], ['plataforma', 'radio'],
      ['motriz', 'sentido'], ['motriz', 'cuales'], ['motriz', 'aceleracion'],
      ['peralte', 'curva'], ['peralte', 'cuenco'], ['peralte', 'cuenco'], ['peralte', 'normal'], ['peralte', 'embudo'],
      ['astro', 'aceleracion'], ['astro', 'peso'], ['astro', 'proposiciones'], ['astro', 'proposiciones'],
      ['resorte', 'instante'], ['resorte', 'instante'], ['resorte', 'estiramiento'],
      ['tabla', 'rapidez'], ['tabla', 'rapidez'], ['tabla', 'distancia'],
      ['escalera', 'roce'], ['escalera', 'roce'], ['escalera', 'reaccion'], ['escalera', 'maximo'],
      ['gravitatoria', 'nulo'], ['gravitatoria', 'nulo'], ['gravitatoria', 'neta']]);
    for (let intento = 0; intento < 5000; intento++) {
      const pr = CONSTRUIR[tipo](rng, semilla, sub);
      if (pr && pr.alternativas.length >= 4) return pr;
    }
    // Respaldo (no debería pasar): un tipo que siempre sale.
    for (let intento = 0; intento < 5000; intento++) {
      const pr = CONSTRUIR.tabla(rng, semilla, 'rapidez');
      if (pr && pr.alternativas.length >= 4) return pr;
    }
    throw new Error('No se pudo generar un problema con 4 alternativas distintas');
  }

  function cerrar(rng, semilla, o) {
    let alternativas, respuesta;
    if (o.textual) {
      alternativas = P.armarTexto({ correcta: o.correcta, errores: o.errores, rng });
      respuesta = { valor: o.correcta.clave, texto: o.correcta.texto, unidad: '' };
    } else {
      const dec = o.decimales ?? 2;
      const txt = x => f(x, dec) + (o.unidad ? ' ' + o.unidad : '');
      // Las incorrectas no pueden delatarse: ni con más decimales (hasta 1 si la correcta tiene 0 o 1; nunca más de 2) ni fuera de escala
      // (entre 1/20 y 20 veces la correcta, y dentro del rango físico del problema si lo hay).
      const maxDec = Math.min(decs(o.correcta) <= 1 ? 1 : 2, dec);
      const errores = o.errores.filter(e => {
        if (!Number.isFinite(e.valor) || (!o.negativos && e.valor <= 0) || decs(e.valor) > maxDec) return false;
        const r = Math.abs(e.valor) / Math.abs(o.correcta);
        if (!(r >= 1 / 20 && r <= 20) && !P.enEscala(e.valor, o.correcta, e.id)) return false; // U1–U8 hasta 1000 veces
        return !o.rango || (e.valor >= o.rango[0] && e.valor <= o.rango[1]);
      });
      // Primero las que tienen a lo más los decimales de la correcta: así casi nunca se nota cuál es.
      const dc = decs(o.correcta);
      errores.sort((a, b) => (decs(a.valor) > dc) - (decs(b.valor) > dc));
      const parejas = errores.filter(e => decs(e.valor) <= dc);
      if (parejas.length >= 3) errores.splice(0, errores.length, ...parejas);
      alternativas = P.armar({ correcta: o.correcta, errores, rng, texto: txt });
      respuesta = { valor: o.correcta, unidad: o.unidad };
    }
    return {
      id: `dinamica-fuerzas#${semilla}`, variables: o.variables, enunciado: o.enunciado, pregunta: o.pregunta, datos: '',
      alternativas, solucion: o.solucion, respuesta, _datos: o.datos,
    };
  }

  // ---------------- plataforma: el roce estático hace de fuerza centrípeta ----------------
  const OBJ_PLAT = [
    { Obj: 'Un niño está parado sobre un juego giratorio del parque', obj: 'el niño', de: 'del niño', a: 'al niño', pl: 'el juego', dpl: 'del juego', moneda: false },
    { Obj: 'Una caja de mangos descansa sobre una plataforma giratoria de la feria', obj: 'la caja', de: 'de la caja', a: 'a la caja', pl: 'la plataforma', dpl: 'de la plataforma', moneda: false },
    { Obj: 'Una vendedora está parada sobre la plataforma giratoria de un carrusel de la feria', obj: 'la vendedora', de: 'de la vendedora', a: 'a la vendedora', pl: 'la plataforma', dpl: 'de la plataforma', moneda: false },
    { Obj: 'Un perro se echa sobre un juego giratorio del parque', obj: 'el perro', de: 'del perro', a: 'al perro', pl: 'el juego', dpl: 'del juego', moneda: false },
    { Obj: 'Una moneda descansa sobre el plato de un tocadiscos', obj: 'la moneda', de: 'de la moneda', a: 'a la moneda', pl: 'el plato', dpl: 'del plato', moneda: true },
  ];
  function plataforma(rng, semilla, sub) {
    const o = rng.elegir(OBJ_PLAT);
    const om = sub === 'omega';
    const w = om ? rng.elegir(o.moneda ? [2, 4, 6] : [1, 2, 3, 4, 6]) : rng.elegir(o.moneda ? [2, 2.5, 3, 4, 5, 6] : [0.5, 1, 1.5, 2, 2.5, 3, 4]);
    const mu = rng.elegir(om ? [0.16, 0.25, 0.36, 0.64] : [0.16, 0.2, 0.24, 0.25, 0.3, 0.32, 0.36, 0.4, 0.45, 0.48, 0.5, 0.6, 0.64, 0.72, 0.75, 0.8]);
    const r = +(mu * g / (w * w)).toFixed(6);
    if (!limpio(r) || (o.moneda ? (r < 0.03 || r > 0.1) : (r < 0.3 || r > 2.5))) return null;
    // Radio del plato o de la plataforma: k veces la distancia del objeto al eje.
    const Rp = +(r * (om ? 4 : rng.elegir([2, 2.5, 3, 4]))).toFixed(6);
    if (!limpio(Rp) || Rp > (o.moneda ? 0.2 : 6)) return null;
    const diam = 2 * Rp, uDiam = o.moneda ? `${f(diam * 100)} cm` : `${f(diam)} m`;
    const VAR = { w: { nombre: 'rapidez angular', color: 'o' }, r: { nombre: 'distancia al eje', color: 'i' }, mu: { nombre: 'coeficiente de rozamiento estático', color: 'h' }, x: { nombre: 'lo que se pide', color: 'd' } };
    const base = [`${o.Obj}, de ${uDiam} de diámetro. `];
    const Pl = o.pl[0].toUpperCase() + o.pl.slice(1);
    const ley = ['Lo único que empuja ', o.a, ' hacia el centro es el roce estático del piso: hace de fuerza centrípeta, f = m·', v('w', 'ω'), '²·', v('r', 'r'), '.'];
    const tope = ['El roce estático tiene un tope: ', v('mu', 'μs'), '·m·g. Justo antes de resbalar, m·', v('w', 'ω'), '²·', v('r', 'r'), ' = ', v('mu', 'μs'), '·m·g, y la masa se cancela.'];
    let enunciado, pregunta, correcta, errores, solucion, unidad;
    if (sub === 'omega') {
      correcta = w; unidad = 'rad/s';
      enunciado = [...base, `${o.obj[0].toUpperCase() + o.obj.slice(1)} está a `, v('r', `${f(r)} m`), ' del eje, y el coeficiente de rozamiento estático con el piso es ', v('mu', f(mu)), `. ${Pl} empieza a girar cada vez más rápido (g = 10 m/s²).`];
      pregunta = ['¿Cuál es la ', v('x', 'máxima rapidez angular'), ` con la que puede girar sin que ${o.obj} resbale?`];
      errores = [
        h('PR2-raiz', mu * g / r, `Te olvidaste la raíz: μs·g/r = ${f(mu * g / r)} es ω², no ω. Hay que sacarle la raíz cuadrada.`, TRV),
        h('DF-sin-mu', Math.sqrt(g / r), 'Igualaste la fuerza centrípeta al peso entero, m·g. El roce estático no llega al peso: su tope es μs·m·g.'),
        h('DF-v-por-omega', Math.sqrt(mu * g * r), `√(μs·g·r) es la rapidez máxima del punto, en m/s, no la rapidez angular. Como v = ω·r, ω = v/r.`),
        h('DF-radio-de-la-plataforma', Math.sqrt(mu * g / Rp), `Usaste el radio ${o.dpl} (${f(Rp)} m). La fuerza que hace falta depende de la distancia ${o.de} al eje, ${f(r)} m: ese es el radio de su circunferencia.`),
        h('DF-despeje-invertido', Math.sqrt(r / (mu * g)), 'Despejaste al revés: de ω²·r = μs·g sale ω² = μs·g/r, con el radio abajo.'),
      ];
      solucion = [ley, tope, [v('x', 'ω'), ' = √(', v('mu', 'μs'), '·g/', v('r', 'r'), `) = √(${f(mu)} · 10 / ${f(r)}) = √${f(mu * g / r)} = `, v('x', `${f(w)} rad/s`), '.']];
    } else if (sub === 'mu') {
      correcta = mu; unidad = '';
      enunciado = [...base, `${o.obj[0].toUpperCase() + o.obj.slice(1)} está a `, v('r', `${f(r)} m`), ` del eje, y ${o.pl} gira con una rapidez angular de `, v('w', `${f(w)} rad/s`), ' (g = 10 m/s²).'];
      pregunta = ['¿Cuál es el ', v('x', 'menor coeficiente de rozamiento estático'), ` que hace falta para que ${o.obj} no resbale?`];
      errores = [
        h('PR1-cuadrado', w * r / g, `Pusiste ω sin elevarla al cuadrado. La fuerza centrípeta es m·ω²·r.`, TRV),
        h('DF-despeje-invertido', g / (w * w * r), 'Despejaste al revés: de μs·g = ω²·r sale μs = ω²·r/g.'),
        h('DF-radio-de-la-plataforma', w * w * Rp / g, `Usaste el radio ${o.dpl} (${f(Rp)} m). Lo que cuenta es la distancia ${o.de} al eje, ${f(r)} m.`),
        h('DF-sin-g', w * w * r, 'Te faltó dividir entre g: el tope del roce es μs·m·g, así que μs = ω²·r/g.'),
        h('DF-sin-radio', w * w / g, `Te olvidaste de la distancia al eje: la fuerza que hace falta es m·ω²·r, con r = ${f(r)} m.`),
      ];
      solucion = [ley, tope, [v('x', 'μs'), ' = ', v('w', 'ω'), '²·', v('r', 'r'), `/g = ${f(w)}² · ${f(r)} / 10 = `, v('x', f(mu)), '.']];
    } else {
      correcta = r; unidad = 'm';
      enunciado = [...base, 'Gira con una rapidez angular de ', v('w', `${f(w)} rad/s`), `, y el coeficiente de rozamiento estático entre ${o.obj} y el piso es `, v('mu', f(mu)), ' (g = 10 m/s²).'];
      pregunta = ['¿A qué ', v('x', 'distancia máxima del eje'), ` puede estar ${o.obj} sin resbalar?`];
      errores = [
        h('PR1-cuadrado', mu * g / w, 'Pusiste ω sin elevarla al cuadrado. La fuerza centrípeta es m·ω²·r.', TRV),
        h('DF-radio-invertido', w * w / (mu * g), 'Invertiste la relación: de ω²·r = μs·g sale r = μs·g/ω². A ω fija, la fuerza que hace falta crece con r.'),
        h('DF-sin-mu', g / (w * w), 'Igualaste la fuerza centrípeta al peso entero. El roce estático solo llega hasta μs·m·g.'),
        h('DF-borde-mas-seguro', Rp, `Respondiste con el borde, como si lejos del eje hiciera falta menos fuerza. Con la misma ω, la fuerza que hace falta, m·ω²·r, crece con r: lejos del eje resbala antes.`),
      ];
      solucion = [ley, tope, ['A ω fija, la fuerza que hace falta crece con la distancia al eje: hay una distancia máxima.'],
        [v('x', 'r'), ' = ', v('mu', 'μs'), '·g/', v('w', 'ω'), `² = ${f(mu)} · 10 / ${f(w)}² = `, v('x', `${f(r)} m`), '.']];
    }
    const rango = sub === 'mu' ? [0, 1.5] : sub === 'radio' ? [0, Rp] : null;
    return cerrar(rng, semilla, { correcta, errores, unidad, rango, variables: VAR, enunciado, pregunta, solucion,
      datos: { tipo: 'plataforma', sub, objeto: OBJ_PLAT.indexOf(o), w, r, mu, radioPlataforma: Rp } });
  }

  // ---------------- motriz: el roce del piso sobre las ruedas ----------------
  const VEH = [
    { n: 'Un auto tiene tracción trasera: el motor hace girar solo las ruedas traseras', motriz: 'T', bici: false },
    { n: 'Un auto tiene tracción delantera: el motor hace girar solo las ruedas delanteras', motriz: 'D', bici: false },
    { n: 'Una combi tiene tracción trasera: el motor hace girar solo las ruedas traseras', motriz: 'T', bici: false },
    { n: 'Un taxi tiene tracción delantera: el motor hace girar solo las ruedas delanteras', motriz: 'D', bici: false },
    { n: 'Un camión de carga tiene tracción trasera: el motor hace girar solo las ruedas traseras', motriz: 'T', bici: false },
    { n: 'Una ciclista va en bicicleta: los pedales hacen girar solo la rueda trasera', motriz: 'T', bici: true },
    { n: 'Un repartidor va en bicicleta: los pedales hacen girar solo la rueda trasera', motriz: 'T', bici: true },
  ];
  const sentido = s => (s > 0 ? 'hacia adelante' : 'hacia atrás');
  function claveSentido(D, T, bici) {
    const pl = bici ? '' : 's';
    return { clave: `D${D > 0 ? '+' : '-'}T${T > 0 ? '+' : '-'}`, texto: `Delantera${pl}: ${sentido(D)}; trasera${pl}: ${sentido(T)}` };
  }
  function motriz(rng, semilla, sub) {
    if (sub === 'aceleracion') return motrizAceleracion(rng, semilla);
    const VAR = { D: { nombre: 'ruedas delanteras', color: 'o' }, T: { nombre: 'ruedas traseras', color: 'i' }, x: { nombre: 'lo que se pide', color: 'd' } };
    if (sub === 'sentido') {
      const veh = rng.elegir(VEH), frena = rng.elegir([false, false, true]);
      const pl = veh.bici ? 'la rueda' : 'las ruedas', ruedas = veh.bici ? 'la rueda delantera y sobre la trasera' : 'las ruedas delanteras y sobre las traseras';
      const mD = veh.motriz === 'D' ? 1 : -1, mT = -mD; // sentido del roce al acelerar
      const C = frena ? claveSentido(-1, -1, veh.bici) : claveSentido(mD, mT, veh.bici);
      const enunciado = [veh.n, frena ? `. Avanza por una pista horizontal y frena ${veh.bici ? 'con los dos frenos' : 'con los frenos de las cuatro ruedas'}, sin que ninguna rueda patine.` : '. Arranca y acelera hacia adelante por una pista horizontal, sin que ninguna rueda patine.'];
      const pregunta = ['¿Hacia dónde apunta la ', v('x', 'fuerza de rozamiento'), ` que el piso ejerce sobre ${ruedas}?`];
      let errores;
      if (!frena) {
        errores = [
          ht('DF-roce-se-opone', ...Object.values(claveSentido(-1, -1, veh.bici)), `Pusiste las dos hacia atrás, como si el roce siempre frenara al vehículo. ${veh.bici ? 'La rueda trasera' : 'Las ruedas motrices'} empuja${veh.bici ? '' : 'n'} el piso hacia atrás, y el piso ${veh.bici ? 'la' : 'las'} empuja hacia adelante: ese roce estático es la fuerza que acelera al vehículo.`),
          ht('DF-todas-empujan', ...Object.values(claveSentido(1, 1, veh.bici)), `Pusiste las dos hacia adelante. Solo ${veh.motriz === 'D' ? 'las delanteras' : (veh.bici ? 'la trasera' : 'las traseras')} reciben el giro del motor. ${veh.bici ? 'La otra rueda' : 'Las otras'} ruedan libres y el piso las frena un poco: su roce apunta hacia atrás.`),
          ht('DF-motriz-cambiada', ...Object.values(claveSentido(-mD, -mT, veh.bici)), `Cambiaste los ejes: el roce hacia adelante va en ${veh.bici ? 'la rueda' : 'las ruedas'} que mueve el motor, ${veh.motriz === 'D' ? 'las delanteras' : (veh.bici ? 'la trasera' : 'las traseras')}.`),
        ];
      } else {
        errores = [
          ht('DF-patron-de-arranque', ...Object.values(claveSentido(mD, mT, veh.bici)), 'Usaste lo que pasa al arrancar. Al frenar, todas las ruedas frenadas empujan el piso hacia adelante, y el piso las empuja hacia atrás.'),
          ht('DF-todas-empujan', ...Object.values(claveSentido(1, 1, veh.bici)), 'Pusiste el roce hacia donde va el vehículo. Si frena, la fuerza neta va hacia atrás, y la única fuerza horizontal es el roce del piso.'),
          ht('DF-motriz-cambiada', ...Object.values(claveSentido(-mD, -mT, veh.bici)), 'Usaste el arranque con los ejes cambiados. Al frenar con todas las ruedas, el roce va hacia atrás en todas.'),
        ];
      }
      const solucion = frena
        ? [['Al frenar, cada rueda frenada tiende a deslizarse hacia adelante sobre el piso. El roce estático se opone a ese deslizamiento: apunta ', v('x', 'hacia atrás'), ' en todas.'],
           ['Es la única fuerza horizontal, y por eso el vehículo pierde rapidez.']]
        : [['La rueda que mueve el motor empuja el piso hacia atrás. Por la tercera ley, el piso la empuja ', v('x', 'hacia adelante'), ': ese roce estático es lo que acelera al vehículo.'],
           [veh.bici ? 'La otra rueda' : 'Las otras ruedas', ' giran libres: el piso tiene que hacerlas girar, y su roce apunta ', v('x', 'hacia atrás'), ' (y es más chico).'],
           ['Respuesta: ', v(veh.motriz === 'D' ? 'D' : 'T', veh.motriz === 'D' ? (veh.bici ? 'delantera' : 'delanteras') : (veh.bici ? 'trasera' : 'traseras')), ' hacia adelante; ', veh.motriz === 'D' ? (veh.bici ? 'trasera' : 'traseras') : (veh.bici ? 'delantera' : 'delanteras'), ' hacia atrás.']];
      return cerrar(rng, semilla, { textual: true, correcta: C, errores, variables: VAR, enunciado, pregunta, solucion,
        datos: { tipo: 'motriz', sub, motriz: veh.motriz, bici: veh.bici, frena, vehiculo: VEH.indexOf(veh) } });
    }
    // cuales: del sentido del roce a las ruedas motrices.
    const caso = rng.elegir(['D', 'T', 'T', 'cuatro']);
    const sD = caso === 'T' ? -1 : 1, sT = caso === 'D' ? -1 : 1;
    const OP = { D: 'Las delanteras', T: 'Las traseras', cuatro: 'Las cuatro', nada: 'No se puede saber: el rozamiento siempre se opone al movimiento' };
    const C = { clave: 'motriz:' + caso, texto: OP[caso] };
    const iv = rng.entero(0, 4), veh = ['Una camioneta', 'Un auto', 'Una combi', 'Un camión de carga', 'Un jeep'][iv];
    const enunciado = [`${veh} acelera hacia adelante por una pista horizontal, sin que patine ninguna rueda. Un sensor mide que el rozamiento del piso sobre las `, v('D', 'ruedas delanteras'), ` apunta ${sentido(sD)} y sobre las `, v('T', 'ruedas traseras'), `, ${sentido(sT)}.`];
    const pregunta = ['¿Cuáles son las ', v('x', 'ruedas motrices'), ' (las que hace girar el motor)?'];
    const errores = [];
    for (const k of ['D', 'T', 'cuatro']) {
      if (k === caso) continue;
      errores.push(ht(k === 'cuatro' ? 'DF-todas-empujan' : 'DF-motriz-cambiada', 'motriz:' + k, OP[k],
        k === 'cuatro' ? 'Si las cuatro fueran motrices, el piso empujaría a las cuatro hacia adelante. Una rueda con roce hacia atrás gira libre: el piso la frena un poco.'
          : `Las ruedas motrices son las que reciben roce hacia adelante: empujan el piso hacia atrás y el piso las empuja hacia adelante. Las que tienen roce hacia atrás ruedan libres.`));
    }
    errores.push(ht('DF-roce-se-opone', 'motriz:nada', OP.nada, 'El rozamiento se opone al deslizamiento entre la rueda y el piso, no al movimiento del vehículo. En las ruedas motrices apunta hacia adelante: es la fuerza que acelera al vehículo.'));
    const solucion = [['La rueda que mueve el motor empuja el piso hacia atrás, y el piso la empuja hacia adelante. Una rueda libre recibe un roce hacia atrás.'],
      ['Con roce hacia adelante en ', caso === 'cuatro' ? 'las cuatro' : (caso === 'D' ? 'las delanteras' : 'las traseras'), ': ', v('x', OP[caso].toLowerCase()), ' son motrices.']];
    return cerrar(rng, semilla, { textual: true, correcta: C, errores, variables: VAR, enunciado, pregunta, solucion,
      datos: { tipo: 'motriz', sub, sD, sT, vehiculo: iv } });
  }
  function motrizAceleracion(rng, semilla) {
    const delantera = rng.moneda();
    const fr = rng.elegir([0.4, 0.5, 0.6, 0.7]), mus = rng.elegir([0.5, 0.6, 0.7, 0.8, 0.9]), muk = rng.elegir([0.3, 0.4, 0.5].filter(x => x < mus));
    const m = rng.elegir([1200, 1500, 2000, 2500]);
    const a = mus * fr * g;
    if (!limpio(a)) return null;
    const eje = delantera ? 'delanteras' : 'traseras', otro = delantera ? 'traseras' : 'delanteras';
    const VAR = { mus: { nombre: 'coeficiente estático', color: 'o' }, muk: { nombre: 'coeficiente cinético', color: 'i' }, N: { nombre: 'peso sobre las ruedas motrices', color: 'h' }, x: { nombre: 'aceleración máxima', color: 'd' } };
    const enunciado = [delantera ? 'Un auto' : 'Una combi', ` de ${f(m)} kg tiene tracción ${delantera ? 'delantera' : 'trasera'}: el motor hace girar solo las ruedas ${eje}. Sobre esas ruedas descansa el `, v('N', `${f(fr * 100)} %`), ' del peso. Entre las llantas y la pista horizontal, el coeficiente de rozamiento estático es ', v('mus', f(mus)), ' y el cinético, ', v('muk', f(muk)), ' (g = 10 m/s²).'];
    const pregunta = ['¿Cuál es la ', v('x', 'máxima aceleración'), ' con la que puede arrancar sin que patinen las ruedas?'];
    const errores = [
      h('DF-todo-el-peso', mus * g, `Usaste el peso entero. Solo las ruedas ${eje} empujan, y el roce que el piso les puede dar depende de la normal sobre ellas: el ${f(fr * 100)} % del peso.`),
      h('DF-cinetico-por-estatico', muk * fr * g, 'Usaste el coeficiente cinético. Si las ruedas no patinan, no resbalan sobre el piso: el roce es estático, con tope μs·N.'),
      h('DF-eje-equivocado', mus * (1 - fr) * g, `Usaste la normal de las ruedas ${otro}. Esas ruedan libres; las que empujan son las ${eje}.`),
      h('DF-cinetico-por-estatico', muk * g, 'Usaste el coeficiente cinético y el peso entero. Sin patinar, el roce es estático, y solo actúa sobre las ruedas motrices.'),
    ];
    const solucion = [
      [`La única fuerza horizontal que empuja al vehículo hacia adelante es el roce estático del piso sobre las ruedas ${eje}.`],
      ['Su tope es ', v('mus', 'μs'), '·', v('N', 'N'), ` = ${f(mus)} · ${f(fr)}·m·g.`],
      [v('x', 'a'), ` = f/m = ${f(mus)} · ${f(fr)} · 10 = `, v('x', `${f(a)} m/s²`), ' (la masa se cancela).'],
    ];
    return cerrar(rng, semilla, { correcta: a, errores, unidad: 'm/s²', variables: VAR, enunciado, pregunta, solucion,
      datos: { tipo: 'motriz', sub: 'aceleracion', m, fraccion: fr, mus, muk } });
  }

  // ---------------- peralte: giro horizontal con la normal inclinada ----------------
  // Se pide la longitud (radio de la curva, radio del cuenco, altura en el embudo) y no la rapidez:
  // así las respuestas y los errores típicos salen sin raíces, igual de redondos.
  const BOLITAS = ['Una bolita', 'Una canica', 'Una arveja seca', 'Una cuenta de collar', 'Una esferita de acero'];
  const NOMBRE = ['bolita', 'canica', 'arveja', 'cuenta', 'esferita'];
  const CUENCOS = ['un cuenco semiesférico', 'una olla semiesférica', 'una fuente semiesférica', 'una taza semiesférica'];
  function peralte(rng, semilla, sub) {
    const ib = rng.entero(0, BOLITAS.length - 1), ic = rng.entero(0, CUENCOS.length - 1), Bol = BOLITAS[ib], bol = NOMBRE[ib], cuenco = CUENCOS[ic];
    const th = sub === 'cuenco' ? 37 : rng.elegir([37, 53]), T = TRIG[th];
    notables = th === 60 ? 'Usa sen 60° = √3/2 y cos 60° = 1/2' : NOTABLES;
    if (sub === 'curva') {
      const vel = rng.elegir([6, 9, 12, 15, 18, 20, 21, 24, 27, 30]);
      const r = vel * vel / (g * T.t);
      if (!limpio(r, 1) || r < 8 || r > 150) return null;
      const veh = rng.elegir(['una combi', 'un camión', 'un bus interprovincial', 'una moto']);
      const lugar = rng.elegir(['En la carretera a Juliaca', 'En la Panamericana Sur', 'En la subida a Ticlio', 'En la vía a Cusco']);
      const VAR = { v: { nombre: 'rapidez', color: 'i' }, th: { nombre: 'ángulo del peralte', color: 'o' }, x: { nombre: 'radio de la curva', color: 'd' } };
      const enunciado = [`${lugar}, una curva tiene la pista inclinada (peraltada) `, v('th', `${th}°`), ` respecto a la horizontal. Está diseñada para que ${veh} la tome a `, v('v', `${f(vel)} m/s`), ` sin necesitar nada de rozamiento. ${notables}; g = 10 m/s².`];
      const pregunta = ['¿Qué ', v('x', 'radio'), ' tiene la curva?'];
      const errores = [
        h('PR1-cuadrado', vel / (g * T.t), 'Pusiste la rapidez sin elevarla al cuadrado: la fuerza centrípeta es m·v²/r.', TRV),
        h('DF-seno-por-tangente', vel * vel / (g * T.s), 'Usaste sen θ. Con N·cos θ = m·g y N·sen θ = m·v²/r, al dividir queda tan θ = v²/(r·g).'),
        h('DF-tangente-invertida', vel * vel * T.t / g, 'Cambiaste las componentes de la normal: la vertical (N·cos θ) sostiene el peso y la horizontal (N·sen θ) es la centrípeta. Queda tan θ = v²/(r·g), no 1/tan θ.'),
        h('DF-coseno', vel * vel / (g * T.c), 'Usaste cos θ. Al dividir las dos ecuaciones de la normal queda tan θ = v²/(r·g).'),
        h('DF-sin-angulo', vel * vel / g, 'Te olvidaste del ángulo, como si la normal sola hiciera de centrípeta. Al dividir las ecuaciones de la normal queda tan θ = v²/(r·g).'),
      ];
      const solucion = [
        ['Sin roce, sobre el vehículo solo actúan el peso y la normal, que es perpendicular a la pista inclinada ', v('th', `${th}°`), '.'],
        ['Vertical: N·cos θ = m·g. Horizontal, hacia el centro: N·sen θ = m·', v('v', 'v'), '²/r. Dividiendo: tan θ = v²/(r·g).'],
        [v('x', 'r'), ' = ', v('v', 'v'), '²/(g·tan ', v('th', 'θ'), `) = ${f(vel)}² / (10 · ${th === 37 ? '3/4' : '4/3'}) = `, v('x', `${f(r)} m`), '.'],
      ];
      return cerrar(rng, semilla, { correcta: r, errores, unidad: 'm', variables: VAR, enunciado, pregunta, solucion,
        datos: { tipo: 'peralte', sub, v: vel, angulo: th } });
    }
    if (sub === 'cuenco') {
      const w = rng.elegir([5, 10]);
      const R = g / (w * w * T.c);
      if (!limpio(R, 3) || R < 0.1 || R > 2.5) return null;
      const VAR = { w: { nombre: 'rapidez angular', color: 'i' }, th: { nombre: 'ángulo con la vertical', color: 'o' }, x: { nombre: 'radio del recipiente', color: 'd' } };
      const enunciado = [`${Bol} gira sin rozamiento por dentro de ${cuenco}, en una circunferencia horizontal, con una rapidez angular de `, v('w', `${f(w)} rad/s`), `. El radio del recipiente que llega a la ${bol} forma `, v('th', `${th}°`), ` con la vertical. ${notables}; g = 10 m/s².`];
      const pregunta = ['¿Cuál es el ', v('x', 'radio del recipiente'), '?'];
      const errores = [
        h('DF-radio-de-la-esfera', g * T.t / (w * w), `Tomaste el radio del recipiente como radio de giro. La ${bol} gira en una circunferencia de radio r = R·sen θ, más chica que el cuenco.`),
        h('DF-seno-coseno', g / (w * w * T.s), 'Cambiaste seno y coseno. La componente vertical de la normal es N·cos θ, porque θ se mide desde la vertical.'),
        h('PR1-cuadrado', g / (w * T.c), 'Pusiste ω sin elevarla al cuadrado: la centrípeta es m·ω²·r.', TRV),
        h('DF-sin-angulo', g / (w * w), `Ese es R·cos θ, la profundidad del plano de giro bajo el centro del recipiente. El radio es R = ${f(g / (w * w))}/cos θ.`),
      ];
      const solucion = [
        [`La normal apunta hacia el centro del recipiente, a lo largo del radio que llega a la ${bol}. El radio de giro es r = R·sen `, v('th', 'θ'), ', no R.'],
        ['Horizontal: N·sen θ = m·', v('w', 'ω'), '²·R·sen θ, así que N = m·ω²·R. Vertical: N·cos θ = m·g. Dividiendo: ω² = g/(R·cos θ).'],
        [v('x', 'R'), ' = g/(', v('w', 'ω'), '²·cos ', v('th', 'θ'), `) = 10/(${f(w)}² · ${f(T.c)}) = `, v('x', `${f(R, 3)} m`), '.'],
      ];
      return cerrar(rng, semilla, { correcta: R, errores, unidad: 'm', decimales: 3, variables: VAR, enunciado, pregunta, solucion,
        datos: { tipo: 'peralte', sub, w, angulo: th, contexto: [ib, ic] } });
    }
    if (sub === 'normal') {
      const VAR = { R: { nombre: 'radio del recipiente', color: 'i' }, th: { nombre: 'ángulo con la vertical', color: 'o' }, m: { nombre: 'masa', color: 'h' }, x: { nombre: 'fuerza normal', color: 'd' } };
      const m = rng.elegir([0.3, 0.6, 0.9, 1.2, 1.5, 1.8, 2.4, 3]);
      const N = m * g / T.c;
      if (!limpio(N)) return null;
      const R = rng.elegir([0.2, 0.25, 0.3, 0.4, 0.5, 0.6, 0.8, 1]);
      const enunciado = [`${Bol} de `, v('m', `${f(m)} kg`), ` gira sin rozamiento por dentro de ${cuenco} de `, v('R', `${f(R)} m`), ` de radio, en una circunferencia horizontal. El radio del recipiente que llega a la ${bol} forma `, v('th', `${th}°`), ` con la vertical. ${notables}; g = 10 m/s².`];
      const pregunta = ['¿Cuánto vale la ', v('x', 'fuerza normal'), ` del recipiente sobre la ${bol}?`];
      const errores = [
        h('DF-normal-igual-peso', m * g, 'Igualaste la normal al peso. La normal está inclinada: solo su componente vertical, N·cos θ, equilibra el peso, así que N es mayor que m·g.', TRA),
        h('DF-seno-coseno', m * g * T.c, 'Multiplicaste el peso por cos θ, como en un plano inclinado. Aquí es al revés: N·cos θ = m·g, así que N = m·g/cos θ.'),
        h('DF-seno-coseno', m * g / T.s, 'Usaste sen θ. Como θ se mide desde la vertical, la componente vertical de la normal es N·cos θ.'),
        h('DF-centripeta-por-normal', m * g * T.t, 'Esa es la fuerza centrípeta, la componente horizontal de la normal (m·g·tan θ). La normal entera es la hipotenusa.'),
      ];
      const solucion = [
        [`Sobre la ${bol} actúan el peso (vertical) y la normal (a lo largo del radio, hacia el centro del recipiente). No hay «fuerza centrífuga»: la centrípeta es la parte horizontal de la normal.`],
        ['Vertical: N·cos ', v('th', 'θ'), ' = ', v('m', 'm'), '·g.'],
        [v('x', 'N'), ` = ${f(m)} · 10 / ${f(T.c)} = `, v('x', `${f(N)} N`), '.'],
      ];
      return cerrar(rng, semilla, { correcta: N, errores, unidad: 'N', variables: VAR, enunciado, pregunta, solucion,
        datos: { tipo: 'peralte', sub, m, R, angulo: th, contexto: [ib, ic] } });
    }
    // embudo: la pared forma α con el eje vertical; se da la rapidez y se pide la altura sobre el vértice.
    const vel = rng.elegir([1, 1.5, 2, 2.5, 3, 3.5, 4, 5, 6]);
    const hh = vel * vel / g;
    if (!limpio(hh, 3)) return null;
    const VAR = { v: { nombre: 'rapidez', color: 'i' }, th: { nombre: 'semiángulo del embudo', color: 'o' }, x: { nombre: 'altura sobre el vértice', color: 'd' } };
    const enunciado = [`${Bol} gira sin rozamiento por dentro de un embudo con el eje vertical y el vértice abajo. La pared forma `, v('th', `${th}°`), ' con el eje. Describe una circunferencia horizontal con una rapidez de ', v('v', `${f(vel)} m/s`), `. ${notables}; g = 10 m/s².`];
    const pregunta = ['¿A qué ', v('x', 'altura sobre el vértice'), ` gira la ${bol}?`];
    const errores = [
      h('DF-radio-por-altura', hh * T.t, 'Ese es el radio de giro, r = h·tan α, no la altura. La altura sale de v² = g·h.'),
      h('DF-caida-libre', vel * vel / (2 * g), `Usaste v² = 2·g·h, la rapidez de una caída desde esa altura. La ${bol} no cae: gira a altura fija, y su rapidez sale de las fuerzas.`),
      h('PR1-cuadrado', vel / g, 'Pusiste la rapidez sin elevarla al cuadrado: h = v²/g.', TRV),
      h('DF-tangente-invertida', hh / (T.t * T.t), 'Cambiaste las componentes de la normal. Su parte vertical sostiene el peso y su parte horizontal es la centrípeta.'),
    ];
    const solucion = [
      ['La normal es perpendicular a la pared: si la pared forma ', v('th', 'α'), ' con la vertical, la normal forma α con la horizontal.'],
      ['Vertical: N·sen α = m·g. Horizontal: N·cos α = m·v²/r. Dividiendo: v² = r·g/tan α.'],
      ['El radio de giro es r = h·tan α, así que ', v('v', 'v'), '² = g·h: el ángulo se cancela.'],
      [v('x', 'h'), ` = ${f(vel)}² / 10 = `, v('x', `${f(hh, 3)} m`), '.'],
    ];
    return cerrar(rng, semilla, { correcta: hh, errores, unidad: 'm', decimales: 3, variables: VAR, enunciado, pregunta, solucion,
      datos: { tipo: 'peralte', sub, v: vel, angulo: th, contexto: [ib, 0] } });
  }

  // ---------------- astro: masa contra peso ----------------
  const ROM = ['I', 'II', 'III'];
  const LUNA = [
    { id: 'L-masa', t: 'La masa del astronauta en la Luna es menor que en la Tierra.', v: false, cod: 'G4-masa-cambia', r: 'hipotesis', fu: TRA,
      e: 'La masa mide cuánta inercia tiene el cuerpo y no depende del lugar. Lo que baja en la Luna es el peso, m·g.' },
    { id: 'L-peso', t: 'En la Luna, el peso del astronauta es menor que en la Tierra.', v: true, cod: 'G4-peso-igual', r: 'hipotesis', fu: TRA,
      e: 'El peso es m·g, y la gravedad en la Luna es unas seis veces menor: el peso sí baja.' },
    { id: 'L-empujar', t: 'Sobre un piso liso, con la misma fuerza horizontal, una caja acelera lo mismo en la Luna que en la Tierra.', v: true, cod: 'G4-misma-fuerza-acelera-mas', r: 'hipotesis', fu: TRA,
      e: 'a = F/m y la masa es la misma en los dos lugares: la misma fuerza da la misma aceleración. En un empuje horizontal sin roce, la gravedad no entra.' },
    { id: 'L-levantar', t: 'En la Luna hace falta menos fuerza para sostener una caja quieta en el aire que en la Tierra.', v: true, cod: 'G4-peso-igual', r: 'hipotesis', fu: TRA,
      e: 'Para sostenerla quieta hay que equilibrar su peso, m·g, y en la Luna g es menor.' },
    { id: 'L-frenar', t: 'En la Luna, frenar un carrito que rueda sin rozamiento por un riel horizontal exige menos fuerza (con la misma rapidez y el mismo tiempo de frenado).', v: false, cod: 'G4-inercia-cambia', r: 'hipotesis', fu: TRA,
      e: 'Frenarlo depende de su inercia, es decir, de su masa, que no cambia. Con la misma rapidez y el mismo tiempo, hace falta la misma fuerza.' },
    { id: 'L-balanza', t: 'Una balanza de platillos, que compara con pesas, da la misma lectura en la Luna que en la Tierra.', v: true, cod: 'G4-masa-cambia', r: 'hipotesis', fu: TRA,
      e: 'La balanza de platillos compara masas: la caja y las pesas pesan menos en la misma proporción, así que se equilibran con las mismas pesas.' },
  ];
  const ORBITA = [
    { id: 'O-sin-gravedad', t: 'En la estación espacial en órbita, el astronauta flota porque allí no hay gravedad.', v: false, cod: 'G1-no-hay-gravedad', r: 'documentado', fu: GRA,
      e: 'A unos 400 km de altura, la gravedad de la Tierra todavía es casi el 90 % de la del suelo. Flota porque él y la estación caen juntos alrededor de la Tierra.' },
    { id: 'O-masa', t: 'En órbita, la masa del astronauta es la misma que en la Tierra.', v: true, cod: 'G4-masa-cambia', r: 'hipotesis', fu: TRA,
      e: 'La masa no depende del lugar: es la misma en el suelo, en la Luna y en órbita.' },
    { id: 'O-atrae', t: 'En órbita, la Tierra sigue atrayendo al astronauta.', v: true, cod: 'G1-no-hay-gravedad', r: 'documentado', fu: GRA,
      e: 'Esa atracción es la que curva su camino alrededor de la Tierra: sin ella, seguiría en línea recta.' },
    { id: 'O-balanza', t: 'Si se para sobre una balanza de resorte dentro de la estación, la balanza marca cero.', v: true, cod: 'G8-balanza', r: 'parcial', fu: GRA,
      e: 'La balanza y el astronauta caen juntos: no se aprietan uno contra otro, y la balanza marca cero, como en un ascensor en caída libre.' },
    { id: 'O-empujar', t: 'Dentro de la estación, darle a una caja la misma aceleración que en un piso liso de la Tierra exige menos fuerza.', v: false, cod: 'G4-misma-fuerza-acelera-mas', r: 'hipotesis', fu: TRA,
      e: 'a = F/m y la masa no cambia: para la misma aceleración hace falta la misma fuerza, también en órbita.' },
  ];
  const VF = b => (b ? 'V' : 'F');
  function astro(rng, semilla, sub) {
    if (sub === 'proposiciones') {
      const lugar = rng.elegir(['luna', 'orbita']);
      const pool = lugar === 'luna' ? LUNA : ORBITA;
      const elegidas = rng.barajar(pool).slice(0, 3);
      const patron = elegidas.map(s => VF(s.v)).join('');
      const VAR = { x: { nombre: 'valor de verdad', color: 'd' } };
      const enunciado = [lugar === 'luna' ? 'Un astronauta viaja de la Tierra a la Luna. ' : 'Un astronauta pasa de la Tierra a la estación espacial, que orbita a unos 400 km de altura. ',
        'Indica si cada afirmación es verdadera (V) o falsa (F). ', ...elegidas.map((s, i) => `${ROM[i]}. ${s.t} `)];
      const pregunta = ['¿Cuál es la ', v('x', 'secuencia correcta'), '?'];
      const errores = elegidas.map((s, i) => {
        const p = elegidas.map((x, j) => VF(j === i ? !x.v : x.v)).join('');
        return ht(s.cod, 'vf:' + p, p, `La ${ROM[i]} es ${s.v ? 'verdadera' : 'falsa'}. ${s.e}`, s.r, s.fu);
      });
      const p2 = elegidas.map((x, j) => VF(j < 2 ? !x.v : x.v)).join('');
      errores.push(ht(elegidas[0].cod, 'vf:' + p2, p2, `La I es ${elegidas[0].v ? 'verdadera' : 'falsa'}. ${elegidas[0].e} Y la II es ${elegidas[1].v ? 'verdadera' : 'falsa'}. ${elegidas[1].e}`, elegidas[0].r, elegidas[0].fu));
      const solucion = [['La masa no depende del lugar; el peso (m·g, la atracción del astro) sí.'],
        ...elegidas.map((s, i) => [`${ROM[i]}: `, v('x', VF(s.v)), `. ${s.e}`]),
        ['Secuencia: ', v('x', patron), '.']];
      return cerrar(rng, semilla, { textual: true, correcta: { clave: 'vf:' + patron, texto: patron }, errores, variables: VAR, enunciado, pregunta, solucion,
        datos: { tipo: 'astro', sub, lugar, afirmaciones: elegidas.map(s => s.id) } });
    }
    if (sub === 'aceleracion') {
      const [lugar, gA, toma] = rng.elegir([['la Luna', 1.6, ''], ['Marte', 4, ' (redondeada)']]);
      const a = rng.elegir([0.8, 1.2, 1.6, 2.4, 3.2, 4.8]), m = rng.elegir([5, 10, 15, 20, 25, 30, 40, 50]);
      const F = m * a;
      const [cosa, la] = rng.elegir([['un carrito', 'el carrito'], ['una caja con muestras', 'la caja'], ['un trineo con herramientas', 'el trineo'], ['un robot apagado', 'el robot']]);
      const VAR = { F: { nombre: 'fuerza', color: 'o' }, m: { nombre: 'masa', color: 'i' }, gA: { nombre: 'gravedad del astro', color: 'h' }, x: { nombre: 'aceleración', color: 'd' } };
      const enunciado = [`En una base en ${lugar}, una astronauta empuja ${cosa} de `, v('m', `${f(m)} kg`), ' sobre un piso horizontal sin rozamiento, con una fuerza horizontal de ', v('F', `${f(F)} N`), `. La gravedad en ${lugar} es `, v('gA', `${f(gA)} m/s²`), `${toma} y en la Tierra, 10 m/s².`];
      const pregunta = ['¿Qué ', v('x', 'aceleración'), ` tiene ${la}?`];
      const errores = [
        h('G4-misma-fuerza-acelera-mas', a * g / gA, 'Creíste que, con menos gravedad, la misma fuerza acelera más. El empuje es horizontal y sin roce: solo cuenta la masa, que es la misma que en la Tierra. a = F/m.'),
        h('G4-misma-fuerza-acelera-mas', a * gA / g, `Corregiste la aceleración por la gravedad de ${lugar}. La masa no cambia y la gravedad no entra en un empuje horizontal sin roce: a = F/m.`),
        h('DF-fuerza-entre-peso', F / (m * gA), `Dividiste la fuerza entre el peso en ${lugar}. La segunda ley usa la masa, no el peso: a = F/m.`),
        h('DF-fuerza-entre-peso', F / (m * g), 'Dividiste la fuerza entre el peso en la Tierra. La segunda ley usa la masa: a = F/m.'),
        h('DF-resta-gravedad', a - gA, 'Le restaste la gravedad del lugar. El peso es vertical y lo cancela la normal: no frena un empuje horizontal.'),
        h('DF-suma-gravedad', a + gA, 'Le sumaste la gravedad del lugar. El peso es vertical y lo cancela la normal: no ayuda a un empuje horizontal.'),
      ];
      const solucion = [['El riel es horizontal y sin roce: el peso y la normal se cancelan, y la única fuerza que acelera es el empuje.'],
        ['La masa es la misma en la Tierra y en ', lugar, ': el dato de ', v('gA', 'g'), ' no hace falta.'],
        [v('x', 'a'), ' = ', v('F', 'F'), '/', v('m', 'm'), ` = ${f(F)} / ${f(m)} = `, v('x', `${f(a)} m/s²`), '.']];
      return cerrar(rng, semilla, { correcta: a, errores, unidad: 'm/s²', variables: VAR, enunciado, pregunta, solucion,
        datos: { tipo: 'astro', sub, F, m, gAstro: gA, cosa: la } });
    }
    // peso en un planeta con k veces la masa y q veces el radio de la Tierra
    const k = rng.elegir([2, 3, 4, 6, 8, 9, 16]), q = rng.elegir([2, 3, 0.5, 4]);
    const m = rng.elegir([50, 60, 70, 80]);
    const W = m * g * k / (q * q);
    if (!limpio(W) || W === m * g || W / m > 40 || W / m < 1) return null;
    const VAR = { k: { nombre: 'veces la masa de la Tierra', color: 'o' }, q: { nombre: 'veces el radio de la Tierra', color: 'i' }, m: { nombre: 'masa', color: 'h' }, x: { nombre: 'peso', color: 'd' } };
    const enunciado = ['Un planeta tiene ', v('k', `${f(k)} veces`), ' la masa de la Tierra y un radio ', v('q', `${f(q)} veces`), ' el de la Tierra. Una astronauta de ', v('m', `${f(m)} kg`), ' llega a su superficie (en la Tierra, g = 10 m/s²).'];
    const pregunta = ['¿Cuál es su ', v('x', 'peso'), ' en ese planeta?'];
    const errores = [
      pa('G3-sin-cuadrado', m * g * k / q, `Dividiste entre el radio sin elevarlo al cuadrado. La gravedad en la superficie es g = G·M/R²: con un radio ${f(q)} veces, se divide entre ${f(q * q)}.`, GRA),
      pa('G4-sin-radio', m * g * k, 'Te olvidaste del radio. La gravedad en la superficie depende de la masa y del radio del planeta: g = G·M/R².', GRA),
      pa('G4-mismo-peso', m * g, 'Diste el peso en la Tierra. La masa no cambia, pero el peso es m·g y g cambia de planeta a planeta.', GRA),
      h('G4-invertido', m * g * q * q / k, 'Invertiste la proporción: g crece con la masa del planeta y baja con el cuadrado del radio, g = G·M/R².'),
      h('G4-masa-por-peso', m, 'Ese número es la masa, en kg. El peso es una fuerza: m·g, en newtons.'),
    ];
    const solucion = [['La masa de la astronauta no cambia. Su peso es m·g, y g en la superficie es G·M/R².'],
      ['g del planeta = 10 · ', v('k', f(k)), ' / ', v('q', f(q)), `² = ${f(g * k / (q * q))} m/s².`],
      [v('x', 'Peso'), ' = ', v('m', f(m)), ` · ${f(g * k / (q * q))} = `, v('x', `${f(W)} N`), '.']];
    return cerrar(rng, semilla, { correcta: W, errores, unidad: 'N', variables: VAR, enunciado, pregunta, solucion,
      datos: { tipo: 'astro', sub, k, q, m } });
  }

  // ---------------- resorte: dos bloques unidos por un resorte ----------------
  function resorte(rng, semilla, sub) {
    const mA = sub === 'instante' ? rng.elegir([1, 2, 4, 5]) : rng.entero(1, 5), mB = rng.entero(1, 6), mu = rng.elegir([0, 0.1, 0.2, 0.25]);
    const piso = mu ? [`un piso horizontal; el coeficiente de rozamiento cinético con cada bloque es ${f(mu)}`] : ['un piso horizontal liso'];
    const VAR = { F: { nombre: 'fuerza aplicada', color: 'o' }, aB: { nombre: 'aceleración de B', color: 'i' }, Fr: { nombre: 'fuerza del resorte', color: 'h' }, x: { nombre: 'lo que se pide', color: 'd' } };
    if (sub === 'instante') {
      const aB = rng.elegir([0.5, 1, 1.5, 2, 2.5, 3]), aA = rng.elegir([0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 5, 6]);
      if (aA === aB) return null;
      const Fr = mB * (aB + mu * g);
      const F = mA * (aA + mu * g) + Fr;
      if (!limpio(F)) return null;
      const enunciado = [`Dos bloques, A de ${f(mA)} kg y B de ${f(mB)} kg, están unidos por un resorte de masa despreciable sobre `, ...piso, '. Se tira de A con una fuerza horizontal constante de ', v('F', `${f(F)} N`), ', alejándolo de B (g = 10 m/s²). En cierto instante los dos avanzan, el resorte está estirado y B tiene una aceleración de ', v('aB', `${f(aB)} m/s²`), '.'];
      const pregunta = ['¿Cuál es la ', v('x', 'aceleración de A'), ' en ese instante?'];
      const errores = [
        h('DF-misma-aceleracion', aB, 'Supusiste que los dos bloques aceleran igual. Un resorte se estira y se encoge: no los obliga a moverse juntos. Cada bloque tiene su propia fuerza neta.'),
        h('DF-como-sistema', (F - mu * (mA + mB) * g) / (mA + mB), 'Trataste los dos bloques como uno solo. Eso vale si van con la misma aceleración, y aquí no: hay que tomar cada bloque por separado.'),
        h('DF-sin-roce-en-B', (F - mB * aB - mu * mA * g) / mA, 'Para la fuerza del resorte usaste solo m_B·a_B. Sobre B también actúa el roce: F_resorte − μ·m_B·g = m_B·a_B.'),
        h('DF-sin-roce-en-A', (F - Fr) / mA, 'Te olvidaste del roce sobre A: F − F_resorte − μ·m_A·g = m_A·a_A.'),
        h('DF-sin-resorte', (F - mu * mA * g) / mA, 'Te olvidaste de que el resorte estirado tira de A hacia atrás, con la misma fuerza con que tira de B hacia adelante.'),
      ];
      const solucion = [
        ['Cada bloque por separado. Sobre B, la única fuerza que lo empuja hacia adelante es el resorte: ', v('Fr', 'F_res'), ' − μ·m_B·g = m_B·', v('aB', 'a_B'), '.'],
        [v('Fr', 'F_res'), ` = ${f(mB)} · (${f(aB)} + ${f(mu * g)}) = `, v('Fr', `${f(Fr)} N`), '.'],
        ['Sobre A: ', v('F', 'F'), ' − ', v('Fr', 'F_res'), ' − μ·m_A·g = m_A·a_A, así que ', v('x', 'a_A'), ` = (${f(F)} − ${f(Fr)} − ${f(mu * mA * g)}) / ${f(mA)} = `, v('x', `${f(aA)} m/s²`), '.'],
      ];
      return cerrar(rng, semilla, { correcta: aA, errores, unidad: 'm/s²', variables: VAR, enunciado, pregunta, solucion,
        datos: { tipo: 'resorte', sub, mA, mB, mu, F, aB } });
    }
    // estiramiento: se conocen k y el estiramiento; se pide la aceleración de B.
    const k = rng.elegir([100, 200, 250, 400, 500]), xcm = rng.elegir([2, 4, 5, 8, 10]);
    const Fr = k * xcm / 100, aB = (Fr - mu * mB * g) / mB;
    if (!limpio(aB) || aB <= 0) return null;
    const aA = rng.entero(1, 6), F = mA * (aA + mu * g) + Fr;
    if (!limpio(F) || Math.abs(aA - aB) < 1e-9) return null;
    VAR.k = { nombre: 'constante del resorte', color: 'i' };
    const enunciado = [`Dos bloques, A de ${f(mA)} kg y B de ${f(mB)} kg, están unidos por un resorte de constante `, v('k', `${f(k)} N/m`), ' sobre ', ...piso, '. Se tira de A con una fuerza horizontal constante de ', v('F', `${f(F)} N`), ', alejándolo de B (g = 10 m/s²). En cierto instante los dos avanzan y el resorte está estirado ', v('k', `${f(xcm)} cm`), '.'];
    const pregunta = ['¿Cuál es la ', v('x', 'aceleración de B'), ' en ese instante?'];
    const errores = [
      h('DF-como-sistema', (F - mu * (mA + mB) * g) / (mA + mB), 'Trataste los dos bloques como uno solo. Unidos por un resorte, cada uno puede tener otra aceleración: a B solo lo empuja el resorte.'),
      h('DF-fuerza-se-transmite', (F - mu * mB * g) / mB, 'Pusiste la fuerza aplicada sobre B. A B no lo toca la mano: lo jala el resorte, con k·x.'),
      h('U2-cm', (k * xcm / 10 - mu * mB * g) / mB, `Pasaste los centímetros a metros dividiendo entre 10. Como 1 m = 100 cm, ${f(xcm)} cm = ${f(xcm / 100)} m.`, TRV),
      h('DF-sin-roce-en-B', Fr / mB, 'Te olvidaste del roce sobre B: k·x − μ·m_B·g = m_B·a_B.'),
    ];
    const solucion = [
      ['A B solo lo jala el resorte: ', v('Fr', 'F_res'), ' = ', v('k', 'k·x'), ` = ${f(k)} · ${f(xcm / 100)} = `, v('Fr', `${f(Fr)} N`), '. La fuerza de la mano actúa sobre A, no sobre B.'],
      [v('x', 'a_B'), ` = (${f(Fr)} − ${f(mu * mB * g)}) / ${f(mB)} = `, v('x', `${f(aB)} m/s²`), '.'],
    ];
    return cerrar(rng, semilla, { correcta: aB, errores, unidad: 'm/s²', variables: VAR, enunciado, pregunta, solucion,
      datos: { tipo: 'resorte', sub, mA, mB, mu, F, k, x: xcm / 100 } });
  }

  // ---------------- tabla: cuatro cajas empujadas desde el reposo ----------------
  function tabla(rng, semilla, sub) {
    const cajas = [1, 2, 3, 4].map(() => ({ F: rng.elegir([10, 15, 20, 30, 40, 50, 60]), m: rng.entero(2, 10), t: rng.entero(1, 8) }));
    const vel = c => c.F * c.t / c.m, dist = c => c.F * c.t * c.t / (2 * c.m);
    const arg = (fn, signo = 1) => {
      const vals = cajas.map(c => signo * fn(c)), max = Math.max(...vals);
      const idx = vals.map((x, i) => (Math.abs(x - max) < 1e-9 ? i : -1)).filter(i => i >= 0);
      return idx.length === 1 ? idx[0] : -1;
    };
    const objetivo = sub === 'rapidez' ? vel : dist;
    const ok = arg(objetivo);
    if (ok < 0) return null;
    const criterios = [
      ['DF-mayor-fuerza', arg(c => c.F), 'Elegiste la caja con más fuerza. La fuerza sola no decide: importan también su masa y cuánto tiempo la empujan.', 'hipotesis', TRA],
      ['DF-menor-masa', arg(c => c.m, -1), 'Elegiste la caja más liviana. La masa sola no decide: importan también la fuerza y el tiempo.', 'hipotesis', TRA],
      ['DF-mayor-tiempo', arg(c => c.t), 'Elegiste la caja que empujan más tiempo. El tiempo solo no decide: importan también la fuerza y la masa.', 'hipotesis', TRA],
      ['DF-sin-tiempo', arg(c => c.F / c.m), 'Elegiste la de mayor aceleración (F/m), sin mirar cuánto dura el empuje. Con la misma aceleración, gana más rapidez la que acelera más tiempo.', 'hipotesis', TRA],
      ['M8-sin-masa', arg(c => c.F * c.t), sub === 'rapidez' ? 'Elegiste la de mayor F·t, que es el impulso: la cantidad de movimiento que gana. La rapidez es ese impulso dividido entre la masa.'
        : 'Elegiste la de mayor F·t, el impulso, sin mirar la masa. La distancia es d = ½·(F/m)·t²: depende de la masa y del cuadrado del tiempo.', 'parcial', GRA],
    ];
    if (sub === 'distancia') criterios.unshift(['DF-rapidez-por-distancia', arg(vel), 'Elegiste la que termina más rápido. La distancia depende de t²: d = ½·(F/m)·t², y una caja que acelera menos pero más tiempo puede recorrer más.', 'hipotesis', TRA]);
    const nombre = i => `La caja ${i + 1}`;
    const errores = [], usados = new Set([ok]);
    for (const [id, i, e, r, fu] of criterios) {
      if (i < 0 || usados.has(i)) continue;
      usados.add(i);
      errores.push(ht(id, 'caja:' + (i + 1), nombre(i), e, r, fu));
    }
    if (errores.length < 3) return null;
    const VAR = { F: { nombre: 'fuerza', color: 'o' }, m: { nombre: 'masa', color: 'i' }, t: { nombre: 'tiempo', color: 'h' }, x: { nombre: 'lo que se pide', color: 'd' } };
    const enunciado = ['Cuatro cajas están en reposo sobre una pista de hielo (sin rozamiento). A cada una la empujan con una fuerza horizontal constante durante un tiempo, y después la sueltan.',
      ...cajas.flatMap((c, i) => [` Caja ${i + 1}: fuerza de `, v('F', `${f(c.F)} N`), ', masa de ', v('m', `${f(c.m)} kg`), ', empujada durante ', v('t', `${f(c.t)} s`), '.'])];
    const pregunta = sub === 'rapidez' ? ['¿Cuál de las cajas alcanza la ', v('x', 'mayor rapidez'), '?'] : ['¿Cuál de las cajas ', v('x', 'recorre más distancia'), ' mientras la empujan?'];
    const solucion = [
      ['Cada caja parte del reposo con aceleración a = ', v('F', 'F'), '/', v('m', 'm'), sub === 'rapidez' ? '. Su rapidez final es v = a·t = ' : '. Mientras la empujan recorre d = ½·a·t² = ', sub === 'rapidez' ? 'F·t/m.' : 'F·t²/(2m).'],
      cajas.map((c, i) => `caja ${i + 1}: ${f(objetivo(c))} ${sub === 'rapidez' ? 'm/s' : 'm'}`).join('; ') + '.',
      ['Gana ', v('x', `la caja ${ok + 1}`), '.'],
    ].map(x => (Array.isArray(x) ? x : [x]));
    return cerrar(rng, semilla, { textual: true, correcta: { clave: 'caja:' + (ok + 1), texto: nombre(ok) }, errores, variables: VAR, enunciado, pregunta, solucion,
      datos: { tipo: 'tabla', sub, cajas } });
  }

  // ---------------- escalera: pared lisa, piso con roce, persona encima ----------------
  // Combinaciones con respuestas limpias, armadas una sola vez.
  const ESC = { roce: [], reaccion: [], maximo: [] };
  (function () {
    for (const th of [37, 53]) for (const L of [2.5, 3, 4, 5, 6]) for (const M of [10, 15, 20, 30]) for (const m of [40, 50, 60, 70, 80])
      for (const fr of [0.25, 0.5, 0.75, 1 / 3, 2 / 3]) {
        const T = TRIG[th], d = L * fr;
        if (!limpio(d)) continue;
        const N = (M + m) * g, fz = g * (T.c / T.s) * (M / 2 + m * fr);
        if (!limpio(fz)) continue;
        for (const mu of [0.3, 0.4, 0.5, 0.6, 0.8]) if (fz < mu * N - 1) ESC.roce.push({ th, L, M, m, d, mu });
        const R = Math.hypot(N, fz);
        if (limpio(R)) ESC.reaccion.push({ th, L, M, m, d });
      }
    for (const th of [37, 53]) for (const L of [3, 4, 5, 6, 8, 10]) for (const M of [10, 15, 20, 25, 30]) for (const m of [40, 50, 60, 70, 75, 80])
      for (const mu of [0.2, 0.25, 0.3, 0.4, 0.5]) {
        const T = TRIG[th], d = L * (mu * (M + m) * T.t - M / 2) / m;
        if (d > 0.15 * L && d < 0.95 * L && limpio(d * T.s)) ESC.maximo.push({ th, L, M, m, mu });
      }
  })();
  function escalera(rng, semilla, sub) {
    const c = rng.elegir(ESC[sub]), T = TRIG[c.th], cot = T.c / T.s;
    const VAR = { M: { nombre: 'masa de la escalera', color: 'o' }, m: { nombre: 'masa de la persona', color: 'i' }, d: { nombre: 'posición de la persona', color: 'h' }, x: { nombre: 'lo que se pide', color: 'd' } };
    const base = [`Una escalera uniforme de ${f(c.L)} m y `, v('M', `${f(c.M)} kg`), ` está apoyada en una pared lisa (sin rozamiento) y forma ${c.th}° con el piso, que sí tiene rozamiento. Una persona de `, v('m', `${f(c.m)} kg`), ' sube por ella'];
    const pie = ['Momentos respecto al pie de la escalera (ahí el roce y la normal del piso no hacen momento). La pared, lisa, solo empuja horizontal: su brazo es la altura del apoyo, L·sen θ. Los pesos tienen por brazo la distancia horizontal: L/2·cos θ y d·cos θ.'];
    if (sub === 'roce') {
      const fz = g * cot * (c.M / 2 + c.m * c.d / c.L), N = (c.M + c.m) * g;
      const enunciado = [...base, ' y se detiene a ', v('d', `${f(c.d)} m`), ' del pie, medidos a lo largo de la escalera. El coeficiente de rozamiento estático con el piso es ', v('f', f(c.mu)), `. ${notables}; g = 10 m/s². Todo está quieto.`];
      const pregunta = ['¿Cuánto vale la ', v('x', 'fuerza de rozamiento'), ' del piso sobre la escalera?'];
      const errores = [
        pa('E10-roce-maximo', c.mu * N, `Calculaste μs·N, el tope del roce estático. Si nada resbala, el roce vale lo que hace falta para el equilibrio, que aquí es menos que ese tope.`, EST),
        h('ES-tan-por-cot', g * T.t * (c.M / 2 + c.m * c.d / c.L), 'Cambiaste seno y coseno en los brazos. El brazo de la pared es la altura, L·sen θ, y el de cada peso es la distancia horizontal, con cos θ.', EST),
        h('ES-sin-peso-escalera', g * cot * (c.m * c.d / c.L), 'Te olvidaste del peso de la escalera, que actúa en su punto medio.', EST),
        h('ES-peso-en-el-extremo', g * cot * (c.M + c.m * c.d / c.L), 'Pusiste el peso de la escalera en su extremo. En una escalera uniforme actúa en el punto medio, a L/2.', EST),
        h('ES-persona-arriba', g * cot * (c.M / 2 + c.m), 'Pusiste a la persona en lo alto de la escalera. Está a d del pie: su brazo es d·cos θ.', EST),
      ];
      const solucion = [pie,
        ['N_pared·L·sen θ = ', v('M', 'M'), '·g·(L/2)·cos θ + ', v('m', 'm'), '·g·', v('d', 'd'), `·cos θ, así que N_pared = ${f(fz)} N.`],
        ['En horizontal solo están el roce del piso y la pared: ', v('x', 'f'), ' = N_pared = ', v('x', `${f(fz)} N`), `, menos que el tope μs·N = ${f(c.mu * N)} N: no resbala.`]];
      return cerrar(rng, semilla, { correcta: fz, errores, unidad: 'N', variables: VAR, enunciado, pregunta, solucion,
        datos: { tipo: 'escalera', sub, angulo: c.th, L: c.L, M: c.M, m: c.m, d: c.d, mu: c.mu } });
    }
    if (sub === 'reaccion') {
      const fz = g * cot * (c.M / 2 + c.m * c.d / c.L), N = (c.M + c.m) * g, R = Math.hypot(N, fz);
      const fzSwap = g * T.t * (c.M / 2 + c.m * c.d / c.L);
      const enunciado = [...base, ' y se detiene a ', v('d', `${f(c.d)} m`), ` del pie, medidos a lo largo de la escalera. ${notables}; g = 10 m/s². Todo está quieto.`];
      const pregunta = ['¿Cuánto vale la ', v('x', 'reacción total del piso'), ' (la normal y el roce juntos) sobre la escalera?'];
      const errores = [
        pa('E8-suma-escalar', N + fz, 'Sumaste la normal y el roce como números. Son perpendiculares: se suman como vectores, R = √(N² + f²).', EST),
        h('ES-solo-normal', N, 'Diste solo la normal del piso. La reacción del piso incluye también el roce, que es horizontal.', EST),
        h('ES-solo-roce', fz, 'Diste solo el roce del piso. La reacción del piso también incluye la normal, que sostiene los dos pesos.', EST),
        h('ES-resta-escalar', N - fz, 'Restaste la normal y el roce como números. Son perpendiculares: se suman como vectores, R = √(N² + f²).', EST),
        h('ES-tan-por-cot', Math.hypot(N, fzSwap), 'Cambiaste seno y coseno en los brazos al calcular el roce. El brazo de la pared es la altura, L·sen θ.', EST),
        h('ES-sin-peso-escalera', Math.hypot(c.m * g, g * cot * c.m * c.d / c.L), 'Te olvidaste del peso de la escalera, en la normal y en los momentos.', EST),
      ];
      const solucion = [
        ['Vertical: la normal del piso sostiene los dos pesos, N = (', v('M', f(c.M)), ' + ', v('m', f(c.m)), `) · 10 = ${f(N)} N.`],
        pie,
        [`Así N_pared = ${f(fz)} N y, en horizontal, el roce del piso vale lo mismo: f = ${f(fz)} N.`],
        [v('x', 'R'), ` = √(${f(N)}² + ${f(fz)}²) = `, v('x', `${f(R)} N`), '.']];
      return cerrar(rng, semilla, { correcta: R, errores, unidad: 'N', variables: VAR, enunciado, pregunta, solucion,
        datos: { tipo: 'escalera', sub, angulo: c.th, L: c.L, M: c.M, m: c.m, d: c.d } });
    }
    // maximo: ¿hasta qué altura puede subir sin que resbale?
    const N = (c.M + c.m) * g;
    const dist = mu => c.L * (mu * (c.M + c.m) * T.t - c.M / 2) / c.m;
    const d = dist(c.mu), alt = d * T.s;
    const dSwap = c.L * (c.mu * (c.M + c.m) * cot - c.M / 2) / c.m;
    const enunciado = [...base, `. El coeficiente de rozamiento estático con el piso es ${f(c.mu)}. ${notables}; g = 10 m/s².`];
    const pregunta = ['¿Hasta qué ', v('x', 'altura sobre el piso'), ' pueden llegar sus pies sin que la escalera resbale?'];
    const errores = [
      h('ES-distancia-por-altura', d, `Ese es el tramo recorrido a lo largo de la escalera (${f(d)} m). La altura sobre el piso es ese tramo por sen θ.`, EST),
      h('ES-tan-por-cot', dSwap * T.s, 'Cambiaste seno y coseno en los brazos. El brazo de la pared es la altura, L·sen θ, y el de cada peso, la distancia horizontal, con cos θ.', EST),
      h('ES-sin-peso-escalera', c.L * c.mu * T.t * T.s, 'Te olvidaste de la escalera: su peso aumenta la normal del piso y también hace momento.', EST),
      h('ES-normal-solo-persona', c.L * (c.mu * c.m * T.t - c.M / 2) / c.m * T.s, 'Para la normal del piso usaste solo el peso de la persona. El piso sostiene a la persona y a la escalera.', EST),
      h('ES-coseno-altura', d * T.c, 'Proyectaste el tramo con cos θ. Como θ se mide desde el piso, la altura es d·sen θ.', EST),
    ];
    const solucion = [
      ['Normal del piso: sostiene los dos pesos, N = (', v('M', f(c.M)), ' + ', v('m', f(c.m)), `) · 10 = ${f(N)} N. Justo antes de resbalar, el roce llega a su tope: f = μs·N = ${f(c.mu * N)} N = N_pared.`],
      pie,
      [`${f(c.mu * N)} · ${f(c.L)} · sen θ = `, v('M', f(c.M)), `·10·(${f(c.L)}/2)·cos θ + `, v('m', f(c.m)), '·10·', v('d', 'd'), '·cos θ, así que ', v('d', `d = ${f(d)} m`), ' a lo largo de la escalera.'],
      [v('x', 'Altura'), ' = ', v('d', 'd'), `·sen ${c.th}° = ${f(d)} · ${f(T.s)} = `, v('x', `${f(alt)} m`), '.']];
    return cerrar(rng, semilla, { correcta: alt, errores, unidad: 'm', variables: VAR, enunciado, pregunta, solucion,
      datos: { tipo: 'escalera', sub, angulo: c.th, L: c.L, M: c.M, m: c.m, mu: c.mu } });
  }

  // ---------------- gravitatoria: dos esferas en línea ----------------
  function gravitatoria(rng, semilla, sub) {
    const VAR = { MA: { nombre: 'masa de A', color: 'o' }, MB: { nombre: 'masa de B', color: 'i' }, d: { nombre: 'distancia entre los centros', color: 'h' }, x: { nombre: 'lo que se pide', color: 'd' } };
    if (sub === 'nulo') {
      const [k2, kr] = rng.elegir([[4, 2], [4, 2], [9, 3], [9, 3], [16, 4], [9 / 4, 1.5], [25 / 4, 2.5]]);
      const s = rng.elegir([1, 2, 3, 4, 5, 8]);
      const MA = kr % 1 ? 4 * s : s, MB = MA * k2;
      // Con kr = 2 o 3 la distancia es múltiplo de (1 + kr)·(1 + kr²): así también salen redondos los errores.
      const d = kr === 2 ? rng.elegir([1.5, 4.5, 7.5, 10.5]) : kr === 3 ? rng.elegir([2, 6, 10, 14]) : rng.elegir([0.6, 0.9, 1.2, 1.5, 2, 2.4, 3, 3.5, 4, 5, 6, 7]);
      const desdeA = rng.moneda();
      const xA = d / (1 + kr), correcta = desdeA ? xA : d - xA;
      if (!limpio(correcta) || !limpio(MB)) return null;
      const sinRaizA = d / (1 + k2);
      const enunciado = ['Dos esferas, A de ', v('MA', `${f(MA)} kg`), ' y B de ', v('MB', `${f(MB)} kg`), ', tienen sus centros a ', v('d', `${f(d)} m`), ' uno del otro. Una bolita se coloca en la recta que los une, entre las dos. Solo cuentan sus atracciones gravitatorias.'];
      const pregunta = ['¿A qué distancia ', v(desdeA ? 'MA' : 'MB', desdeA ? 'del centro de A' : 'del centro de B'), ' la ', v('x', 'fuerza gravitatoria neta'), ' sobre la bolita es cero?'];
      const errores = [
        h('PR1-gravedad', desdeA ? sinRaizA : d - sinRaizA, `Usaste la razón de masas sin sacar la raíz (o la distancia sin el cuadrado). La fuerza va con M/r²: (r_B/r_A)² = ${f(k2)}, así que r_B/r_A = ${f(kr)}.`, TRV),
        h('GR-esfera-equivocada', desdeA ? d - xA : xA, `Mediste desde la otra esfera. El punto queda más cerca de la esfera de menos masa (A), a ${f(xA)} m de A.`),
        h('GR-esfera-equivocada', desdeA ? d - sinRaizA : sinRaizA, 'Mediste desde la otra esfera y además usaste la razón de masas sin raíz.'),
        h('GR-punto-medio', d / 2, 'Pusiste el punto en el medio. Con masas distintas, el punto de fuerza nula está más cerca de la esfera de menos masa.'),
      ];
      const solucion = [
        ['En ese punto, las dos atracciones se igualan: G·', v('MA', 'M_A'), '·m/r_A² = G·', v('MB', 'M_B'), '·m/r_B².'],
        [`(r_B/r_A)² = M_B/M_A = ${f(k2)}, así que r_B = ${f(kr)}·r_A. Con r_A + r_B = `, v('d', f(d)), `: r_A = ${f(d)} / ${f(1 + kr)} = ${f(xA)} m y r_B = ${f(d - xA)} m.`],
        ['Distancia pedida: ', v('x', `${f(correcta)} m`), '.']];
      return cerrar(rng, semilla, { correcta, errores, unidad: 'm', variables: VAR, enunciado, pregunta, solucion,
        datos: { tipo: 'gravitatoria', sub, MA, MB, d, desdeA } });
    }
    // neta: la fuerza neta sobre una bolita en P, entre las esferas o fuera de ellas.
    const fuera = rng.elegir([false, false, true]);
    const q = rng.elegir([2, 3, 4, 8, 9, 0.5]);
    const rA = rng.entero(1, 4), sep = rng.entero(2, 6);
    const rB = fuera ? rA + sep : sep - rA;
    if (rB <= 0) return null;
    const FA = 100 * rng.elegir([4, 8, 9, 12, 16, 18, 24, 36, 48, 50, 72]);
    const FB = FA * q * rA * rA / (rB * rB);
    const neta = fuera ? FA + FB : Math.abs(FA - FB);
    if (!limpio(FB) || neta < 1e-9 || !limpio(neta)) return null;
    const MA = 1, MB = q, d = sep; // masas en unidades de M; distancias en decenas de miles de km
    const km = x => `${f(x * 10000)} km`;
    const FBlin = FA * q * rA / rB, FBinv = FA * q * rB * rB / (rA * rA), FBsinM = FA * rA * rA / (rB * rB);
    const comb = x => (fuera ? FA + x : Math.abs(FA - x));
    VAR.d = { nombre: 'atracción de A', color: 'h' };
    const masaB = q === 0.5 ? 'M/2' : `${f(q)}M`;
    const enunciado = ['Dos planetas, A de masa ', v('MA', 'M'), ' y B de masa ', v('MB', masaB), `, tienen sus centros a ${km(d)} uno del otro. Una nave está en la recta que los une, `,
      fuera ? 'por fuera, del lado de A: ' : 'entre los dos: ', `a ${km(rA)} de A y a ${km(rB)} de B. El planeta A la atrae con `, v('d', `${f(FA)} N`), '.'];
    const pregunta = ['¿Cuánto vale la ', v('x', 'fuerza gravitatoria neta'), ' sobre la nave?'];
    const errores = [
      h('PR1-gravedad', comb(FBlin), 'Escalaste la fuerza de B con la distancia sin elevarla al cuadrado. La fuerza va con M/r².', TRV),
      h('GR-suma-escalar', fuera ? Math.abs(FA - FB) : FA + FB, fuera ? 'Restaste las fuerzas. Por fuera, A y B quedan del mismo lado de la nave: las dos tiran hacia el mismo sentido y se suman.' : 'Sumaste las fuerzas. Entre los planetas, A tira hacia un lado y B hacia el otro: se restan.'),
      h('GR-razon-invertida', comb(FBinv), 'Invertiste la razón de distancias: más lejos, la fuerza es menor. F_B = F_A·(M_B/M_A)·(r_A/r_B)².'),
      h('GR-sin-masa', comb(FBsinM), 'Te olvidaste de que B tiene otra masa: la fuerza también es proporcional a la masa que atrae.'),
      h('GR-solo-A', FA, 'Diste solo la atracción de A. La nave también siente la de B.'),
    ];
    const solucion = [
      ['La atracción va con M/r². Comparada con la de A: F_B = ', v('d', 'F_A'), '·(', v('MB', 'M_B'), '/', v('MA', 'M_A'), `)·(r_A/r_B)² = ${f(FA)} · ${f(q)} · (${f(rA)}/${f(rB)})² = ${f(FB)} N.`],
      [fuera ? 'Por fuera, los dos tiran hacia el mismo lado: se suman.' : 'Entre los planetas, tiran hacia lados opuestos: se restan.'],
      [v('x', 'F_neta'), ' = ', v('x', `${f(neta)} N`), '.']];
    return cerrar(rng, semilla, { correcta: neta, errores, unidad: 'N', variables: VAR, enunciado, pregunta, solucion,
      datos: { tipo: 'gravitatoria', sub, MA, MB, d, rA, rB, FA, fuera } });
  }

  const CONSTRUIR = { plataforma, motriz, peralte, astro, resorte, tabla, escalera, gravitatoria };
  return { id: 'dinamica-fuerzas', titulo: 'La plataforma que gira', generar };
});
