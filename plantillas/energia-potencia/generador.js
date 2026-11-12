/*
 * Generador «La bomba y el ascensor»: potencia, eficiencia y trabajo en problemas de admisión
 * (unidad fisica.trabajo-y-energia). Formato "predicciones" (docs/arquitectura.md). Funciona en el
 * navegador (window.Generadores['energia-potencia']) y en Node (require). No usa ningún motor.
 *
 * Tipos y subtipos:
 *   fv/horizontal   P = F·v a rapidez constante en un camino horizontal (fuerza dada o roce μ·m·g),
 *                   rapidez en km/h; respuesta en kW.
 *   fv/subida       un motor sube un carrito por una rampa con roce a rapidez constante:
 *                   P = (m·g·sen θ + μ·m·g·cos θ)·v; respuesta en W.
 *   fv/velocidad    la rapidez constante con que un tractor de potencia dada sube un remolque por
 *                   una cuesta con roce: v = P/(m·g·sen θ + μ·m·g·cos θ).
 *   fv/eficiencia   la fuerza del motor de un auto que consume P y rinde η, en el instante en que su
 *                   rapidez es v: F = η·P/v (la rapidez del instante, no la media del arranque).
 *   peso/grua       potencia contra el peso: P = m·g·h/t (tiempo a veces en minutos); en kW.
 *   peso/escalera   una persona sube escalones o una rampa: P = m·g·H/t, con H la altura que gana.
 *   bomba/util      potencia que una bomba entrega al agua: P = (m/t)·g·h, con m/t = ρ·caudal
 *                   (1 L de agua = 1 kg); caudal en L/min.
 *   bomba/consumida la misma bomba con pérdidas: P consumida = P útil/η, en kW o en HP (1 HP = 746 W,
 *                   se declara en el enunciado).
 *   pisos           trabajo del motor de un ascensor (o montacargas) que deja parte de su carga en
 *                   cada piso: suma de (M + carga del tramo)·g·h por tramo.
 *   rebotes/choque  la pelota pierde un p % de su energía en cada choque: h·(1 − p)^n.
 *   rebotes/tramo   pierde un p % de su energía en cada tramo (cada bajada y cada subida): h·(1 − p)^(2n).
 *   rebotes/rapidez pierde un p % de su rapidez en cada choque: la altura va con v², h·(1 − p)^(2n).
 *   cuerda/trabajo  collarín en una varilla horizontal lisa jalado con una cuerda que pasa por una
 *                   polea: W = F·(L1 − L2), lo que se acorta el tramo de cuerda entre polea y collarín.
 *   cuerda/rapidez  lo mismo, y desde el reposo la rapidez final: v = √(2W/m).
 *
 *   resorte/masa-efectiva  la misma pistola de resorte, comprimida igual, dispara bolitas de masa
 *                   distinta; el enunciado DA la masa efectiva M del resorte (la parte que se mueve
 *                   con la bolita). La energía guardada se reparte en ½·(m + M)·v², así que
 *                   v₂ = v₁·√((m₁ + M)/(m₂ + M)). Sale de la fila 2023-II (2 abr) #82 de San Marcos,
 *                   donde la clave de la academia ignora la masa efectiva que el enunciado da (con
 *                   ella la respuesta es otra). Este subtipo se elige con un azar aparte (1 de cada 24
 *                   semillas) para no mover las semillas de los demás tipos.
 *
 * Convenciones: g = 10 m/s², sen 37° = cos 53° = 0,6 y cos 37° = sen 53° = 0,8, agua con 1 kg por litro.
 * Las potencias que se piden son a rapidez constante (sin arranques ni frenadas), salvo fv/eficiencia.
 *
 * Errores: W15 (potencia confundida con energía) con respaldo parcial y la eficiencia que multiplica
 * (W15-multiplica) como hipótesis, de docs/investigacion/estatica-energia-ideas-erroneas.md; W1-largo
 * (mgh con el largo de la rampa), también hipótesis de ese informe; U1, U2, U3, U6 y PR1, PR3 de
 * docs/investigacion/fisica-calculo-transversal-ideas-erroneas.md (hipótesis); normal igual al peso y
 * rapidez media en P = F·v, de las trampas 7 y 13 de docs/clasificacion/trampas-admision-unmsm/fisica.md
 * (hipótesis). Los EP-* y EF-* son hipótesis nuestras, sacadas de la columna TRAMPA de los huecos.
 */
(function (root, fabrica) {
  const nodo = typeof module === 'object' && module.exports;
  const api = fabrica(nodo ? require('../../nucleo/azar.js') : root.Azar,
                      nodo ? require('../../nucleo/predicciones.js') : root.Predicciones);
  if (nodo) module.exports = api;
  else (root.Generadores = root.Generadores || {})[api.id] = api;
})(typeof self !== 'undefined' ? self : this, function (Azar, P) {
  'use strict';
  const ENE = 'docs/investigacion/estatica-energia-ideas-erroneas.md';
  const UPR = 'docs/investigacion/fisica-calculo-transversal-ideas-erroneas.md';
  const TRA = 'docs/clasificacion/trampas-admision-unmsm/fisica.md';
  const h = (id, valor, explicacion, fuente = null) => ({ id, valor, explicacion, respaldo: 'hipotesis', fuente });
  const pa = (id, valor, explicacion) => ({ id, valor, explicacion, respaldo: 'parcial', fuente: ENE });
  const u = (id, valor, explicacion) => h(id, valor, explicacion, UPR);
  const f = (x, d = 2) => P.formatear(x, d);
  const v = P.v;
  const G = 10;
  const limpio = (x, dec = 2) => Number.isFinite(x) && x > 0 && Math.abs(x * 10 ** dec - Math.round(x * 10 ** dec)) < 1e-6 && x < 1e7;
  const TRIG = { 37: [0.6, 0.8], 53: [0.8, 0.6] };
  const notaAng = a => ` (sen ${a}° = ${f(TRIG[a][0])} y cos ${a}° = ${f(TRIG[a][1])}; g = 10 m/s²)`;
  const pct = p => `${f(p * 100)} %`;

  const TIPOS = [['fv', 'horizontal'], ['fv', 'horizontal'], ['fv', 'subida'], ['fv', 'subida'], ['fv', 'velocidad'], ['fv', 'velocidad'],
    ['fv', 'eficiencia'], ['fv', 'eficiencia'], ['peso', 'grua'], ['peso', 'grua'], ['peso', 'escalera'], ['peso', 'escalera'],
    ['bomba', 'util'], ['bomba', 'util'], ['bomba', 'consumida'], ['bomba', 'consumida'], ['pisos', null], ['pisos', null],
    ['rebotes', 'choque'], ['rebotes', 'tramo'], ['rebotes', 'rapidez'], ['cuerda', 'trabajo'], ['cuerda', 'rapidez']];

  function generar(semilla) {
    if (Azar.crear('energia-potencia-resorte|' + semilla).entero(1, 24) === 1) {
      const rr = Azar.crear('energia-potencia|resorte|' + semilla);
      for (let intento = 0; intento < 5000; intento++) {
        const pr = resorte(rr, semilla);
        if (pr && pr.alternativas.length >= 4) return pr;
      }
      throw new Error('No se pudo generar un problema de resorte con 4 alternativas distintas');
    }
    const rng = Azar.crear('energia-potencia|' + semilla);
    const [tipo, sub] = rng.elegir(TIPOS);
    for (let intento = 0; intento < 5000; intento++) {
      const pr = construir(rng, semilla, tipo, sub);
      if (pr && pr.alternativas.length >= 4) return pr;
    }
    throw new Error(`No se pudo generar un problema con 4 alternativas distintas (${tipo}/${sub})`);
  }

  function construir(rng, semilla, tipo, sub) {
    if (tipo === 'fv') return { horizontal: fvHorizontal, subida: fvSubida, velocidad: fvVelocidad, eficiencia: fvEficiencia }[sub](rng, semilla);
    if (tipo === 'peso') return sub === 'grua' ? grua(rng, semilla) : escalera(rng, semilla);
    if (tipo === 'bomba') return bomba(rng, semilla, sub);
    if (tipo === 'pisos') return pisos(rng, semilla);
    if (tipo === 'rebotes') return rebotes(rng, semilla, sub);
    return cuerda(rng, semilla, sub);
  }

  // Sin distractores absurdos: entre 1/20 y 20 veces la correcta (en valor absoluto); el cero se deja
  // donde tiene sentido físico (parte del equilibrio, está quieto).
  const creible = (x, c) => Number.isFinite(x) && (Math.abs(x) < 1e-9 || (Math.abs(x) >= Math.abs(c) / 20 * (1 + 1e-9) && Math.abs(x) <= Math.abs(c) * 20 * (1 - 1e-9)));

  function cerrar(rng, semilla, o) {
    const errores = o.errores.filter(e => e && creible(e.valor, o.correcta) && Number.isFinite(e.valor) && e.valor > 0 && e.valor < 1e8);
    const alternativas = P.armar({ correcta: o.correcta, errores, rng, unidad: o.unidad, decimales: 2 });
    return {
      id: `energia-potencia#${semilla}`, variables: o.variables, enunciado: o.enunciado, pregunta: o.pregunta, datos: '',
      alternativas, solucion: o.solucion, respuesta: { valor: o.correcta, unidad: o.unidad }, _datos: o.datos,
    };
  }

  // ---------------- fv: P = F·v ----------------
  const VFV = { F: { nombre: 'fuerza del motor', color: 'o' }, v: { nombre: 'rapidez', color: 'i' }, R: { nombre: 'fuerzas que se oponen', color: 'h' }, x: { nombre: 'lo que se pide', color: 'd' } };

  function fvHorizontal(rng, semilla) {
    const conMu = rng.moneda();
    const vk = conMu ? rng.elegir([9, 10.8, 14.4, 18, 21.6, 27, 36]) : rng.elegir([18, 27, 36, 45, 54, 63, 72, 81, 90]), vs = vk / 3.6; // un tractor no va a 72 km/h
    let F, m = null, mu = null, enunciado;
    if (conMu) {
      m = rng.elegir([300, 400, 500, 600, 800, 1000, 1200, 1500]); mu = rng.elegir([0.05, 0.1, 0.15, 0.2, 0.25, 0.3, 0.4]);
      F = mu * m * G;
      enunciado = [`Un tractor arrastra una carreta de ${f(m)} kg por un camino horizontal, con una cuerda horizontal, a una `, v('v', `rapidez constante de ${vk} km/h`),
        `. El coeficiente de rozamiento entre la carreta y el camino es ${f(mu)} (g = 10 m/s²).`];
    } else {
      F = rng.elegir([300, 400, 500, 600, 750, 800, 900, 1000, 1200, 1500, 1800, 2000, 2500]);
      enunciado = ['Una grúa remolca un auto averiado por una pista horizontal, a una ', v('v', `rapidez constante de ${vk} km/h`),
        '. El cable va horizontal y jala al auto con una ', v('F', `fuerza de ${f(F)} N`), '.'];
    }
    const correcta = F * vs / 1000;
    if (!limpio(correcta)) return null;
    const pregunta = ['¿Qué ', v('x', 'potencia'), ` entrega ${conMu ? 'el tractor a la carreta' : 'la grúa al auto'}, en kW?`];
    const errores = [
      u('U1-kmh', F * vk / 1000, `Multiplicaste la fuerza por la rapidez en km/h. En P = F·v la rapidez va en m/s: ${vk} km/h = ${vk}/3,6 = ${f(vs)} m/s.`),
      u('U1-al-reves', F * vk * 3.6 / 1000, `Multiplicaste ${vk} por 3,6. Para pasar de km/h a m/s se divide entre 3,6: ${vk} km/h = ${f(vs)} m/s.`),
      u('U2-kilo', F * vs, `Esa es la potencia en watts (${f(F * vs)} W). Te la piden en kilowatts: 1 kW = 1000 W, así que se divide entre 1000.`),
      pa('W15-fuerza', F / 1000, `Diste la fuerza (${f(F)} N) como si fuera la potencia. La potencia es la fuerza por la rapidez: P = F·v, con v = ${f(vs)} m/s.`),
      u('U1-m-por-minuto', F * vk * 1000 / 60 / 1000, `Pasaste ${vk} km/h a metros por minuto (${f(vk * 1000 / 60)} m/min). En P = F·v la rapidez va en metros por segundo: ${f(vs)} m/s.`),
    ];
    if (conMu) {
      errores.unshift(h('EP-peso-como-fuerza', m * G * vs / 1000, `Usaste el peso de la carreta (${f(m * G)} N) como la fuerza de la cuerda. En un camino horizontal a rapidez constante, la cuerda solo tiene que igualar al rozamiento: μ·m·g = ${f(F)} N.`));
      errores.splice(2, 0, h('EP-sin-g', mu * m * vs / 1000, `Tomaste μ·m = ${f(mu * m)} como el rozamiento, sin multiplicar por g. El rozamiento es μ·m·g = ${f(F)} N.`));
    }
    const solucion = [
      ['Rapidez en m/s: ', v('v', `v = ${vk}/3,6 = ${f(vs)} m/s`), '.'],
      conMu ? ['A rapidez constante la fuerza neta es cero: la cuerda iguala al rozamiento, ', v('F', `F = μ·m·g = ${f(mu)} · ${f(m)} · 10 = ${f(F)} N`), '.']
        : ['La fuerza del cable es ', v('F', `F = ${f(F)} N`), ' (va en la misma dirección que el movimiento).'],
      [v('x', 'P'), ' = ', v('F', 'F'), '·', v('v', 'v'), ` = ${f(F)} · ${f(vs)} = ${f(F * vs)} W = `, v('x', `${f(correcta)} kW`), '.'],
    ];
    return cerrar(rng, semilla, { correcta, errores, unidad: 'kW', variables: VFV, enunciado, pregunta, solucion,
      datos: { tipo: 'fv', sub: 'horizontal', F, m, mu, vkmh: vk } });
  }

  // Datos de la rampa: ángulo, masa, μ; devuelve las fuerzas.
  function rampa(rng, masas) {
    const ang = rng.elegir([37, 53]), [s, c] = TRIG[ang];
    const m = rng.elegir(masas), mu = rng.elegir([0.2, 0.25, 0.4, 0.5]);
    return { ang, s, c, m, mu, Fp: m * G * s, Fr: mu * m * G * c, Nmal: mu * m * G };
  }

  function fvSubida(rng, semilla) {
    const r = rampa(rng, [50, 80, 100, 150, 200, 250, 300]);
    const enKmh = rng.entero(0, 2) === 0;
    const vs = enKmh ? rng.elegir([0.5, 1, 1.5, 2, 2.5, 3]) : rng.elegir([0.5, 0.8, 1, 1.2, 1.5, 2, 2.5, 3, 4]);
    const vk = vs * 3.6, Fm = r.Fp + r.Fr, correcta = Fm * vs;
    if (!limpio(correcta, 0)) return null;
    const enunciado = [`Un motor sube un carrito con arena de ${f(r.m)} kg por una rampa inclinada ${r.ang}°, jalándolo con un cable paralelo a la rampa, a una `,
      v('v', `rapidez constante de ${enKmh ? f(vk) + ' km/h' : f(vs) + ' m/s'}`), `. El coeficiente de rozamiento entre el carrito y la rampa es ${f(r.mu)}${notaAng(r.ang)}.`];
    const pregunta = ['¿Qué ', v('x', 'potencia'), ' desarrolla el motor, en W?'];
    const errores = [
      h('EP-sin-roce', r.Fp * vs, `Solo venciste la parte del peso a lo largo de la rampa (${f(r.Fp)} N). El rozamiento también se opone a la subida: el cable debe vencer las dos, m·g·sen θ + μ·m·g·cos θ.`),
      h('EP-sin-componente', r.Fr * vs, `Solo venciste el rozamiento (${f(r.Fr)} N). Al subir, la parte del peso a lo largo de la rampa, m·g·sen θ = ${f(r.Fp)} N, también tira hacia abajo.`),
      h('EP-normal-peso', (r.Fp + r.Nmal) * vs, `Tomaste la normal igual al peso (${f(r.m * G)} N). En la rampa la normal es m·g·cos θ = ${f(r.m * G * r.c)} N, así que el rozamiento vale ${f(r.Fr)} N.`, TRA),
      enKmh ? u('U1-kmh', Fm * vk, `Usaste la rapidez en km/h. En P = F·v va en m/s: ${f(vk)} km/h = ${f(vs)} m/s.`) : null,
      h('EP-seno-coseno', (r.m * G * r.c + r.mu * r.m * G * r.s) * vs, `Cambiaste seno y coseno. La parte del peso a lo largo de la rampa es m·g·sen θ y la normal es m·g·cos θ.`),
    ];
    const solucion = [
      ['A rapidez constante, la fuerza del cable iguala a las que se oponen: la parte del peso a lo largo de la rampa, ', v('R', `m·g·sen ${r.ang}° = ${f(r.Fp)} N`),
        ', y el rozamiento, ', v('R', `μ·m·g·cos ${r.ang}° = ${f(r.Fr)} N`), '.'],
      [v('F', `F = ${f(r.Fp)} + ${f(r.Fr)} = ${f(Fm)} N`), enKmh ? `; la rapidez es ${f(vk)}/3,6 = ${f(vs)} m/s.` : '.'],
      [v('x', 'P'), ' = ', v('F', 'F'), '·', v('v', 'v'), ` = ${f(Fm)} · ${f(vs)} = `, v('x', `${f(correcta)} W`), '.'],
    ];
    return cerrar(rng, semilla, { correcta, errores, unidad: 'W', variables: VFV, enunciado, pregunta, solucion,
      datos: { tipo: 'fv', sub: 'subida', m: r.m, ang: r.ang, mu: r.mu, v: vs, enKmh } });
  }

  function fvVelocidad(rng, semilla) {
    const r = rampa(rng, [400, 500, 600, 750, 800, 1000, 1200, 1500, 1800, 2000, 2500]);
    const Fm = r.Fp + r.Fr, Pw = rng.elegir([6, 8, 9, 10, 12, 15, 16, 18, 20, 24, 25, 30, 36, 40, 45, 48, 50, 60, 72, 80, 90]) * 1000;
    const correcta = Pw / Fm, exacto = limpio(correcta);  // la rapidez no siempre sale redonda: así no se delata
    if (correcta < 0.8 || correcta > 12) return null;
    const enunciado = [`Un tractor sube un remolque de ${f(r.m)} kg por un camino inclinado ${r.ang}°, jalándolo con un cable paralelo al camino. El coeficiente de rozamiento entre el remolque y el camino es ${f(r.mu)}. El tractor entrega al remolque una `,
      v('F', `potencia de ${f(Pw / 1000)} kW`), `${notaAng(r.ang)}.`];
    const pregunta = ['¿Con qué ', v('x', 'rapidez constante'), ` sube el remolque${exacto ? '' : ', aproximadamente'}?`];
    const errores = [
      h('EP-sin-componente', Pw / r.Fr, `Dividiste solo entre el rozamiento (${f(r.Fr)} N). Al subir, la parte del peso a lo largo del camino (${f(r.Fp)} N) también se opone: el cable vence las dos.`),
      h('EP-sin-roce', Pw / r.Fp, `Dividiste solo entre la parte del peso a lo largo del camino (${f(r.Fp)} N). El rozamiento (${f(r.Fr)} N) también se opone a la subida.`),
      h('EP-normal-peso', Pw / (r.Fp + r.Nmal), `Tomaste la normal igual al peso. En el camino inclinado la normal es m·g·cos θ = ${f(r.m * G * r.c)} N y el rozamiento ${f(r.Fr)} N.`, TRA),
      h('EP-peso-como-fuerza', Pw / (r.m * G), `Dividiste entre el peso entero (${f(r.m * G)} N), como si el remolque subiera en vertical. En la cuesta el cable vence m·g·sen θ más el rozamiento.`),
      h('EP-seno-coseno', Pw / (r.m * G * r.c + r.mu * r.m * G * r.s), 'Cambiaste seno y coseno. La parte del peso a lo largo del camino es m·g·sen θ y la normal es m·g·cos θ.'),
    ];
    const solucion = [
      ['Fuerzas que se oponen: ', v('R', `m·g·sen ${r.ang}° = ${f(r.Fp)} N`), ' y ', v('R', `μ·m·g·cos ${r.ang}° = ${f(r.Fr)} N`), `. A rapidez constante, el cable jala con ${f(Fm)} N.`],
      ['De P = F·v: ', v('x', 'v'), ' = ', v('F', 'P'), `/F = ${f(Pw)}/${f(Fm)} ${exacto ? '=' : '≈'} `, v('x', `${f(correcta)} m/s`), '.'],
    ];
    return cerrar(rng, semilla, { correcta, errores, unidad: 'm/s', variables: { ...VFV, F: { nombre: 'potencia', color: 'o' } }, enunciado, pregunta, solucion,
      datos: { tipo: 'fv', sub: 'velocidad', m: r.m, ang: r.ang, mu: r.mu, P: Pw } });
  }

  function fvEficiencia(rng, semilla) {
    const Pc = rng.elegir([20, 24, 30, 36, 40, 45, 48, 50, 60, 72, 75, 80, 90, 100, 120]), eta = rng.elegir([0.5, 0.6, 0.7, 0.75, 0.8, 0.85, 0.9]);
    const vk = rng.elegir([18, 36, 54, 72, 90, 108]), vs = vk / 3.6;
    const correcta = eta * Pc * 1000 / vs;
    if (!limpio(correcta, 0)) return null;
    const [veh, Veh] = rng.elegir([['un auto', 'El auto'], ['una combi', 'La combi'], ['un camión', 'El camión'], ['una mototaxi', 'La mototaxi']]);
    if (veh === 'una mototaxi' && Pc > 30) return null;
    const enunciado = [`El motor de ${veh} `, v('F', `consume ${f(Pc)} kW`), ` y su rendimiento es de ${pct(eta)}. ${Veh} parte del reposo y acelera por una pista horizontal. En el instante en que su `,
      v('v', `rapidez es ${vk} km/h`), ', el motor trabaja con esa potencia.'];
    const pregunta = ['¿Qué ', v('x', 'fuerza'), ` impulsa ${veh.replace(/^un /, 'al ').replace(/^una /, 'a la ')} en ese instante?`];
    const errores = [
      h('EP-rapidez-media', 2 * correcta, `Usaste la rapidez media del arranque (${f(vs / 2)} m/s, la mitad). En P = F·v va la rapidez del instante: la potencia de ese momento con la rapidez de ese momento, ${f(vs)} m/s.`, TRA),
      h('EF-sin-rendimiento', Pc * 1000 / vs, `Usaste toda la potencia que consume el motor. Solo el ${pct(eta)} se convierte en trabajo útil: P útil = ${f(eta)} · ${f(Pc)} kW = ${f(eta * Pc)} kW.`),
      h('W15-eficiencia-al-reves', Pc * 1000 / (eta * vs), `Dividiste entre el rendimiento. La potencia útil es menor que la consumida: se multiplica, P útil = η·P consumida.`, ENE),
      u('U1-kmh', eta * Pc * 1000 / vk, `Dividiste entre la rapidez en km/h. En P = F·v va en m/s: ${vk} km/h = ${f(vs)} m/s.`),
    ];
    const solucion = [
      ['Potencia útil: ', v('F', `P = ${f(eta)} · ${f(Pc)} kW = ${f(eta * Pc)} kW = ${f(eta * Pc * 1000)} W`), '. Rapidez del instante: ', v('v', `${vk}/3,6 = ${f(vs)} m/s`), '.'],
      ['P = F·v vale en cada instante, con la rapidez de ese instante: ', v('x', 'F'), ' = ', v('F', 'P'), '/', v('v', 'v'), ` = ${f(eta * Pc * 1000)}/${f(vs)} = `, v('x', `${f(correcta)} N`), '.'],
    ];
    return cerrar(rng, semilla, { correcta, errores, unidad: 'N', variables: { ...VFV, F: { nombre: 'potencia', color: 'o' } }, enunciado, pregunta, solucion,
      datos: { tipo: 'fv', sub: 'eficiencia', Pc, eta, vkmh: vk } });
  }

  // ---------------- peso: P = m·g·h/t ----------------
  const VPE = { m: { nombre: 'masa', color: 'o' }, hh: { nombre: 'altura que gana', color: 'i' }, t: { nombre: 'tiempo', color: 'h' }, x: { nombre: 'potencia', color: 'd' } };

  function grua(rng, semilla) {
    const m = rng.elegir([120, 150, 200, 250, 300, 400, 450, 500, 600, 750, 800, 900, 1000, 1200, 1500]);
    const H = rng.elegir([4, 5, 6, 8, 9, 10, 12, 15, 16, 18, 20, 24, 25, 30, 36, 40]);
    const enMin = rng.entero(0, 2) === 0;
    const tmin = enMin ? rng.elegir([0.5, 1, 1.5, 2]) : null;
    const ts = enMin ? tmin * 60 : rng.elegir([4, 5, 6, 8, 10, 12, 15, 20, 30]);
    const correcta = m * G * H / ts / 1000;
    if (!limpio(correcta)) return null;
    const [obj, quien] = rng.elegir([['un balde con concreto', 'Una grúa de construcción'], ['una jaula con mineral', 'El winche de una mina'], ['una carga de ladrillos', 'El motor de un montacargas']]);
    const tTexto = enMin ? `${f(tmin)} ${tmin === 1 ? 'minuto' : 'minutos'}` : `${f(ts)} s`;
    const enunciado = [`${quien} sube ${obj} de `, v('m', `${f(m)} kg`), ' una ', v('hh', `altura de ${f(H)} m`), ' en ', v('t', tTexto), ', a rapidez constante (g = 10 m/s²).'];
    const pregunta = ['¿Qué ', v('x', 'potencia'), ' desarrolla, en kW?'];
    const W = m * G * H;
    const errores = [
      pa('W15-energia', W / 1000, `Calculaste el trabajo, m·g·h = ${f(W)} J, y lo diste como potencia. La potencia es ese trabajo dividido entre el tiempo que toma.`),
      enMin ? u('U6-minutos', W / tmin / 1000, `Dividiste entre ${f(tmin)} sin pasar a segundos. ${tTexto} son ${f(ts)} s.`) : null,
      h('W15-por-tiempo', W * ts / 1000, `Multiplicaste el trabajo por el tiempo. La potencia es trabajo por segundo: se divide, P = W/t.`, ENE),
      h('EP-sin-g', m * H / ts / 1000, `Usaste la masa en lugar del peso. La fuerza que hay que vencer es el peso, m·g = ${f(m * G)} N.`),
      u('U2-kilo', W / ts, `Esa es la potencia en watts. En kilowatts se divide entre 1000: ${f(W / ts)} W = ${f(correcta)} kW.`),
    ];
    const solucion = [
      ['A rapidez constante, la fuerza del cable iguala al peso: el trabajo es ', v('m', 'm'), '·g·', v('hh', 'h'), ` = ${f(m)} · 10 · ${f(H)} = ${f(W)} J.`],
      [v('x', 'P'), ' = W/', v('t', 't'), ` = ${f(W)}/${f(ts)} = ${f(W / ts)} W = `, v('x', `${f(correcta)} kW`), enMin ? ` (${tTexto} = ${f(ts)} s).` : '.'],
    ];
    return cerrar(rng, semilla, { correcta, errores, unidad: 'kW', variables: VPE, enunciado, pregunta, solucion,
      datos: { tipo: 'peso', sub: 'grua', m, h: H, t: ts } });
  }

  function escalera(rng, semilla) {
    const m = rng.elegir([45, 50, 55, 60, 65, 70, 75, 80]);
    const conEsc = rng.moneda();
    let H, enunciado, errores, ts = rng.elegir([6, 8, 10, 12, 15, 16, 20, 24, 25, 30]);
    let datos;
    if (conEsc) {
      const n = rng.elegir([12, 15, 16, 18, 20, 24, 25, 30, 40]), e = rng.elegir([15, 16, 18, 20, 25]);
      H = n * e / 100;
      enunciado = ['Una postulante de ', v('m', `${f(m)} kg`), ` sube corriendo una escalera de ${n} escalones, cada uno de `, v('hh', `${e} cm de alto`), ', en ', v('t', `${f(ts)} s`), ' (g = 10 m/s²).'];
      errores = [
        u('U2-centi', m * G * n * e / ts, `Usaste la altura en centímetros. ${n} escalones de ${e} cm suben ${n * e} cm = ${f(H)} m.`),
        h('EP-un-escalon', m * G * (e / 100) / ts, `Usaste la altura de un solo escalón. En total sube ${n} escalones: ${f(H)} m.`),
        pa('W15-energia', m * G * H, `Calculaste el trabajo, m·g·h = ${f(m * G * H)} J. La potencia es ese trabajo entre el tiempo.`),
        h('EP-sin-g', m * H / ts, 'Usaste la masa en lugar del peso: la fuerza que vence es m·g.'),
      ];
      datos = { tipo: 'peso', sub: 'escalera', m, escalones: n, e, t: ts };
    } else {
      const k = rng.elegir([2, 3, 4, 5]); const L = 5 * k; H = 3 * k;
      enunciado = ['Un vendedor de ', v('m', `${f(m)} kg`), ` sube a pie por una rampa recta de ${f(L)} m de largo que lo deja `, v('hh', `${f(H)} m más arriba`), '. Tarda ', v('t', `${f(ts)} s`), ' y avanza con rapidez constante (g = 10 m/s²).'];
      errores = [
        h('W1-largo', m * G * L / ts, `Usaste el largo de la rampa (${f(L)} m) como altura. Contra el peso solo cuenta lo que sube en vertical: ${f(H)} m.`, ENE),
        pa('W15-energia', m * G * H, `Calculaste el trabajo, m·g·h = ${f(m * G * H)} J. La potencia es ese trabajo entre el tiempo.`),
        h('EP-sin-g', m * H / ts, 'Usaste la masa en lugar del peso: la fuerza que vence es m·g.'),
        h('W15-por-tiempo', m * G * H * ts, 'Multiplicaste el trabajo por el tiempo. La potencia es trabajo por segundo: P = W/t.', ENE),
      ];
      datos = { tipo: 'peso', sub: 'escalera', m, largo: L, H, t: ts };
    }
    const correcta = m * G * H / ts;
    if (!limpio(correcta)) return null;
    const pregunta = ['¿Qué ', v('x', 'potencia media'), ' desarrolla contra su peso?'];
    const solucion = [
      [conEsc ? `Altura que gana: ${datos.escalones} · ${datos.e} cm = ` : 'Altura que gana (la vertical, no el largo de la rampa): ', v('hh', `h = ${f(H)} m`), '.'],
      ['Trabajo contra el peso: ', v('m', 'm'), '·g·', v('hh', 'h'), ` = ${f(m)} · 10 · ${f(H)} = ${f(m * G * H)} J.`],
      [v('x', 'P'), ' = W/', v('t', 't'), ` = ${f(m * G * H)}/${f(ts)} = `, v('x', `${f(correcta)} W`), '.'],
    ];
    return cerrar(rng, semilla, { correcta, errores, unidad: 'W', variables: VPE, enunciado, pregunta, solucion, datos });
  }

  // ---------------- bomba: P = (m/t)·g·h ----------------
  const VBO = { q: { nombre: 'caudal', color: 'o' }, hh: { nombre: 'altura', color: 'i' }, e: { nombre: 'rendimiento', color: 'h' }, x: { nombre: 'potencia', color: 'd' } };

  function bomba(rng, semilla, sub) {
    const consumida = sub === 'consumida';
    const Q = consumida ? rng.elegir([240, 300, 360, 480, 600, 720, 900, 1200, 1500, 1800, 2400]) : rng.elegir([60, 120, 180, 240, 300, 360, 420, 480, 600, 720, 900]);
    const H = rng.elegir([4, 5, 6, 8, 9, 10, 12, 15, 16, 18, 20, 24, 25, 30, 40]);
    const mt = Q / 60, Pu = mt * G * H;
    const surtidor = !consumida && rng.moneda();
    const prof = surtidor || consumida ? null : rng.entero(2, H - 2);
    let enunciado, pregunta, errores, correcta, unidad, solucion, datos;
    const masa = [`En un segundo pasan ${f(Q)}/60 = ${f(mt)} L, que son `, v('q', `${f(mt)} kg de agua por segundo`), ' (1 L de agua = 1 kg).'];
    if (!consumida) {
      correcta = Pu; unidad = 'W';
      if (!limpio(correcta)) return null;
      enunciado = surtidor
        ? ['La bomba de una pileta impulsa ', v('q', `${f(Q)} litros de agua por minuto`), ' y lanza un chorro vertical que sube ', v('hh', `${f(H)} m`), ' por encima de la boquilla. Considera solo la energía que necesita el agua para subir esos metros, sin el aire (g = 10 m/s²).']
        : ['Una bomba sube agua desde el fondo de un pozo de ', v('hh', `${f(prof)} m de profundidad`), ' hasta un tanque que está ', v('hh', `${f(H - prof)} m por encima del suelo`), ', con un ', v('q', `caudal de ${f(Q)} litros por minuto`), ' (g = 10 m/s²).'];
      pregunta = ['¿Qué ', v('x', 'potencia'), ' entrega la bomba al agua?'];
      errores = [
        surtidor ? h('EP-medio-altura', Pu / 2, 'Usaste la mitad de la altura, como si el agua subiera en promedio h/2. Cada kilo de agua que sale llega hasta la altura del chorro: gana m·g·h entero.')
          : h('EP-solo-tanque', mt * G * (H - prof), `Usaste solo la altura del tanque sobre el suelo. El agua sale del fondo del pozo: sube ${f(prof)} + ${f(H - prof)} = ${f(H)} m.`),
        surtidor ? h('EP-por-rapidez', mt * Math.sqrt(2 * G * H), `Calculaste la rapidez de salida, √(2gh) = ${f(Math.sqrt(2 * G * H))} m/s, y la multiplicaste por la masa por segundo. Eso no es una potencia: la bomba da a cada kilo la energía m·g·h por segundo.`)
          : h('EP-solo-pozo', mt * G * prof, `Usaste solo la profundidad del pozo. El tanque está además ${f(H - prof)} m sobre el suelo: en total sube ${f(H)} m.`),
        u('U3-litros', Pu * 10, `Pasaste litros a metros cúbicos dividiendo entre 100. Un metro cúbico tiene 1000 litros; más simple: 1 L de agua es 1 kg.`),
        h('EP-sin-g', mt * H, 'Usaste la masa por segundo sin multiplicar por g. La bomba vence el peso del agua: P = (m/t)·g·h.'),
      ];
      solucion = [masa, ...(surtidor ? [] : [['Altura que sube el agua: ', v('hh', `${f(prof)} + ${f(H - prof)} = ${f(H)} m`), '.']]), [v('x', 'P'), ' = (m/t)·g·', v('hh', 'h'), ` = ${f(mt)} · 10 · ${f(H)} = `, v('x', `${f(correcta)} W`), '.']];
      datos = { tipo: 'bomba', sub, Q, h: H, contexto: surtidor ? 'surtidor' : 'pozo', profundidad: prof };
    } else {
      const p = rng.elegir([0.2, 0.25, 0.4, 0.5]), eta = 1 - p, Pin = Pu / eta;
      const hp = rng.moneda();
      if (!limpio(Pin / 1000, 1)) return null;
      unidad = hp ? 'HP' : 'kW';
      const conv = hp ? 746 : 1000;
      correcta = Pin / conv;
      enunciado = ['Una bomba sube agua desde el fondo de un pozo hasta la superficie, ', v('hh', `${f(H)} m más arriba`), ', con un ', v('q', `caudal de ${f(Q)} litros por minuto`), '. En el motor y las tuberías se ',
        v('e', `pierde el ${pct(p)}`), ` de la energía que consume la bomba (g = 10 m/s²${hp ? '; 1 HP = 746 W' : ''}).`];
      pregunta = ['¿Qué ', v('x', 'potencia consume'), ` la bomba${hp ? ', aproximadamente,' : ','} en ${unidad}?`];
      errores = [
        h('W15-multiplica', Pu * eta / conv, `Multiplicaste la potencia útil por el rendimiento. Lo consumido es más que lo útil: P consumida = P útil/η = ${f(Pu)}/${f(eta)}.`, ENE),
        h('EF-sin-rendimiento', Pu / conv, `Esa es la potencia útil, la que recibe el agua. La bomba consume más, porque pierde el ${pct(p)}: se divide entre ${f(eta)}.`),
        h('EF-suma-perdida', Pu * (1 + p) / conv, `Le sumaste el ${pct(p)} a la potencia útil. La pérdida es un porcentaje de lo que se consume, no de lo útil: útil = ${f(eta)} · consumida.`),
        hp ? h('EF-hp-como-kw', Pin / 1000, `Esos son kilowatts. Un HP son 746 W, no 1000: ${f(Pin)} W / 746.`) : null,
        u('U6-minutos', Pin * 60 / conv, `Usaste los ${f(Q)} litros de un minuto como si pasaran en un segundo: pasan ${f(mt)} kg por segundo.`),
      ];
      solucion = [masa,
        ['Potencia útil: (m/t)·g·', v('hh', 'h'), ` = ${f(mt)} · 10 · ${f(H)} = ${f(Pu)} W.`],
        ['Si se pierde el ', v('e', pct(p)), ', lo útil es el ', v('e', `${pct(eta)} (η = ${f(eta)})`), ' de lo consumido: ', v('x', 'P consumida'), ` = ${f(Pu)}/${f(eta)} = ${f(Pin)} W`,
          hp ? [' = ', v('x', `${f(Pin)}/746 ≈ ${f(correcta)} HP`), '.'] : [' = ', v('x', `${f(correcta)} kW`), '.']].flat(),
      ];
      datos = { tipo: 'bomba', sub, Q, h: H, perdida: p, unidad };
    }
    return cerrar(rng, semilla, { correcta, errores, unidad, variables: VBO, enunciado, pregunta, solucion, datos });
  }

  // ---------------- pisos: carga que cambia en cada tramo ----------------
  function pisos(rng, semilla) {
    const personas = rng.moneda();
    const M = personas ? rng.elegir([300, 400, 500, 600]) : rng.elegir([150, 200, 250, 300]);
    const mp = personas ? rng.elegir([60, 70, 75, 80]) : rng.elegir([25, 50]);
    const k = personas ? rng.elegir([1, 2, 3]) : rng.elegir([4, 5, 6, 8, 10]);
    const T = rng.elegir([3, 4, 5]), n = k * T, hp = rng.elegir([3, 3.5, 4]);
    let W = 0;
    for (let j = 0; j < T; j++) W += (M + (n - j * k) * mp) * G * hp;
    const correcta = W / 1000;
    if (!limpio(correcta)) return null;
    const VAR = { M: { nombre: 'masa de la cabina', color: 'o' }, c: { nombre: 'carga', color: 'i' }, hh: { nombre: 'altura de un piso', color: 'h' }, x: { nombre: 'trabajo del motor', color: 'd' } };
    const quien = personas ? `${n} personas de ${mp} kg cada una` : `${n} sacos de arroz de ${mp} kg cada uno`;
    const baja = personas ? `bajan ${k} ${k === 1 ? 'persona' : 'personas'}` : `se descargan ${k} sacos`;
    const enunciado = [personas ? 'Un ascensor de ' : 'Un montacargas de ', v('M', `${f(M)} kg`), ' sube desde el primer piso con ', v('c', quien),
      `. En cada piso que sigue ${baja}, hasta que en el piso ${T + 1} queda vacío. Cada piso mide `, v('hh', `${f(hp)} m de alto`), '. Sube siempre a rapidez constante (desprecia los arranques y las frenadas; g = 10 m/s²).'];
    const pregunta = ['¿Cuánto ', v('x', 'trabajo'), ` hace el motor desde el primer piso hasta el piso ${T + 1}, en kJ?`];
    const sinCab = (W - M * G * hp * T) / 1000;
    const errores = [
      h('EP-carga-inicial', (M + n * mp) * G * hp * T / 1000, `Usaste la carga inicial en todo el recorrido. En cada piso ${baja}: en cada tramo el motor sube menos masa que en el anterior.`),
      h('EP-sin-cabina', sinCab, `Solo subiste la carga. La cabina de ${f(M)} kg también sube todos los pisos, y el motor también la vence.`),
      h('EP-carga-final', (M + k * mp) * G * hp * T / 1000, `Usaste la carga del último tramo en todo el recorrido. En los primeros tramos va más llena.`),
      h('EP-solo-cabina', M * G * hp * T / 1000, `Solo subiste la cabina vacía. La carga también pesa, y en cada tramo hay que vencer la que va dentro.`),
    ];
    const tramos = [];
    for (let j = 0; j < T; j++) tramos.push(f(M + (n - j * k) * mp));
    const solucion = [
      [`Hay ${T} tramos de un piso. En cada uno el motor vence el peso de lo que va dentro: la cabina más la `, v('c', 'carga de ese tramo'), '.'],
      [`Masas por tramo: ${tramos.join(' kg, ')} kg.`],
      [v('x', 'W'), ' = (', tramos.join(' + '), ') · 10 · ', v('hh', f(hp)), ` = ${f(W)} J = `, v('x', `${f(correcta)} kJ`), '.'],
    ];
    return cerrar(rng, semilla, { correcta, errores, unidad: 'kJ', variables: VAR, enunciado, pregunta, solucion,
      datos: { tipo: 'pisos', M, carga: mp, cantidad: n, porPiso: k, h: hp } });
  }

  // ---------------- rebotes ----------------
  function rebotes(rng, semilla, sub) {
    const H = rng.elegir([2, 3, 4, 5, 6, 8, 10, 12, 15, 16, 18, 20, 24, 25, 30, 32, 40, 45, 50, 60, 64, 75, 80, 100, 125, 128, 160, 200, 250]);
    const n = rng.elegir([2, 3]), p = sub === 'rapidez' ? rng.elegir([0.1, 0.2, 0.3, 0.4, 0.5]) : rng.elegir([0.1, 0.2, 0.25, 0.3, 0.36, 0.4, 0.5, 0.6, 0.75]);
    const q = 1 - p, exp = sub === 'choque' ? n : 2 * n;
    const correcta = H * q ** exp;
    const exacto = limpio(correcta);                   // si no sale con dos decimales, se pide aproximada
    if (!exacto && correcta < 0.5) return null;
    const ord = n === 2 ? 'segundo' : 'tercer';
    const VAR = { hh: { nombre: 'altura inicial', color: 'o' }, p: { nombre: 'pérdida', color: 'h' }, x: { nombre: 'altura final', color: 'd' } };
    const regla = {
      choque: ['En cada choque con el piso pierde el ', v('p', `${pct(p)} de su energía`), '; en el aire no pierde nada.'],
      tramo: ['Por el aire, en cada tramo (cada bajada y cada subida) pierde el ', v('p', `${pct(p)} de la energía`), ' que tenía al empezar ese tramo; los choques no le quitan energía.'],
      rapidez: ['En cada choque con el piso sale con una rapidez un ', v('p', `${pct(p)} menor`), ' que la rapidez con que llegó; en el aire no pierde nada.'],
    }[sub];
    const enunciado = ['Se suelta una pelota desde ', v('hh', `${f(H)} m de altura`), '. ', ...regla];
    const pregunta = ['¿Hasta qué ', v('x', 'altura'), ` sube después del ${ord} rebote${exacto ? '' : ', aproximadamente'}?`];
    const errores = sub === 'choque' ? [
      h('EP-resta-lineal', H * (1 - n * p), `Restaste ${n} veces el ${pct(p)} de la altura inicial. Cada pérdida es un porcentaje de lo que quedaba, no de lo inicial: se multiplica ${n} veces por ${f(q)}.`),
      h('EP-una-vez', H * q, `Aplicaste la pérdida una sola vez. Hasta el ${ord} rebote hay ${n} choques, y en cada uno queda el ${pct(q)}.`),
      h('EP-choque-de-mas', H * q ** (n + 1), `Contaste un choque de más. Hasta el ${ord} rebote la pelota choca ${n} veces con el piso.`),
      h('EP-pierde-por-queda', H * p ** n, `Multiplicaste por lo que se pierde (${f(p)}). En cada choque queda el ${pct(q)}: se multiplica por ${f(q)}.`),
    ] : sub === 'tramo' ? [
      h('EP-una-por-rebote', H * q ** n, `Aplicaste la pérdida una vez por rebote. Cada rebote tiene dos tramos (bajada y subida): hasta el ${ord} rebote hay ${2 * n} tramos.`),
      h('EP-tramo-de-menos', H * q ** (2 * n - 1), `Te faltó un tramo. Hasta subir después del ${ord} rebote, la pelota baja ${n} veces y sube ${n} veces: ${2 * n} tramos.`),
      h('EP-resta-lineal', H * (1 - 2 * n * p), `Restaste ${2 * n} veces el ${pct(p)} de la altura inicial. Cada pérdida es un porcentaje de lo que quedaba: se multiplica ${2 * n} veces por ${f(q)}.`),
      h('EP-pierde-por-queda', H * p ** (2 * n), `Multiplicaste por lo que se pierde. En cada tramo queda el ${pct(q)}.`),
    ] : [
      u('PR1-cuadrado', H * q ** n, `Multiplicaste la altura por ${f(q)} en cada choque, como si bajara lo mismo que la rapidez. La altura va con el cuadrado de la rapidez (h = v²/2g): en cada choque queda multiplicada por ${f(q)}² = ${f(q * q, 4)}.`),
      h('EP-resta-lineal', H * (1 - n * p), `Restaste ${n} veces el ${pct(p)} de la altura. La pérdida es de rapidez, y cada una es un porcentaje de lo que quedaba.`),
      h('EP-choque-de-mas', H * q ** (2 * n + 2), `Contaste un choque de más. Hasta el ${ord} rebote la pelota choca ${n} veces con el piso: el factor ${f(q * q, 4)} se aplica ${n} veces.`),
      h('EP-pierde-por-queda', H * p ** (2 * n), 'Multiplicaste por lo que se pierde. En cada choque queda la rapidez multiplicada por ' + f(q) + '.'),
    ];
    const solucion = sub === 'choque' ? [
      ['La altura a la que sube es proporcional a su energía (Ep = m·g·h). En cada choque queda el ', v('p', `${pct(q)}`), ' de la energía.'],
      [`Hasta el ${ord} rebote hay ${n} choques: `, v('x', 'h'), ' = ', v('hh', f(H)), ` · ${f(q)}^${n} ${exacto ? '=' : '≈'} `, v('x', `${f(correcta)} m`), '.'],
    ] : sub === 'tramo' ? [
      ['La altura es proporcional a la energía. En cada tramo queda el ', v('p', pct(q)), '.'],
      [`Hasta subir después del ${ord} rebote hay ${n} bajadas y ${n} subidas, ${2 * n} tramos: `, v('x', 'h'), ' = ', v('hh', f(H)), ` · ${f(q)}^${2 * n} ${exacto ? '=' : '≈'} `, v('x', `${f(correcta)} m`), '.'],
    ] : [
      ['La altura va con el cuadrado de la rapidez (h = v²/2g). Si la rapidez queda multiplicada por ', v('p', f(q)), `, la altura queda multiplicada por ${f(q)}² = ${f(q * q, 4)}.`],
      [`Con ${n} choques: `, v('x', 'h'), ' = ', v('hh', f(H)), ` · ${f(q * q, 4)}^${n} ${exacto ? '=' : '≈'} `, v('x', `${f(correcta)} m`), '.'],
    ];
    return cerrar(rng, semilla, { correcta, errores, unidad: 'm', variables: VAR, enunciado, pregunta, solucion,
      datos: { tipo: 'rebotes', sub, h: H, p, n } });
  }

  // ---------------- cuerda: el extremo que se desplaza ----------------
  // Alturas de la polea sobre la varilla y distancias horizontales con hipotenusa exacta.
  const GEOM = [[0.3, [0.4, 0]], [0.6, [0.8, 0.45, 0]], [0.8, [1.5, 0.6, 0]], [1.2, [1.6, 0.9, 0.5, 0]], [1.5, [3.6, 2, 0.8, 0]], [2.4, [3.2, 1.8, 1, 0.7, 0]]];
  function cuerda(rng, semilla, sub) {
    const [b, xs] = rng.elegir(GEOM);
    const i = rng.entero(0, xs.length - 2), j = rng.entero(i + 1, xs.length - 1);
    const x1 = xs[i], x2 = xs[j];
    const L1 = Math.hypot(b, x1), L2 = Math.hypot(b, x2), dL = L1 - L2;
    let F, m = null, correcta, unidad;
    const VAR = { F: { nombre: 'fuerza en la cuerda', color: 'o' }, L: { nombre: 'largo del tramo de cuerda', color: 'i' }, dx: { nombre: 'desplazamiento del collarín', color: 'h' }, x: { nombre: 'lo que se pide', color: 'd' } };
    if (sub === 'trabajo') {
      F = rng.elegir([10, 12, 15, 18, 20, 24, 25, 30, 35, 40, 45, 50, 60, 70, 75, 80, 90, 100, 120]);
      correcta = F * dL; unidad = 'J';
      if (!limpio(correcta)) return null;
    } else {
      m = rng.elegir([0.5, 1, 1.5, 2, 2.5, 3, 4, 5]);
      F = rng.elegir([5, 8, 10, 12, 15, 20, 24, 25, 30, 40, 50, 60, 80]);
      correcta = Math.sqrt(2 * F * dL / m); unidad = 'm/s';   // casi nunca redonda: así no se delata
      if (correcta < 0.5 || correcta > 15) return null;
    }
    const W = F * dL;
    const fin = x2 === 0 ? 'hasta quedar justo debajo de la polea' : `hasta quedar a ${f(x2)} m de esa vertical`;
    const enunciado = [sub === 'rapidez' ? `Un collarín de ${f(m)} kg, en reposo, ` : 'Un collarín ', 'puede deslizarse por una varilla horizontal lisa. Una cuerda atada al collarín sube hasta una polea pequeña, fija ',
      `${f(b)} m por encima de la varilla, y su otro extremo cuelga libre. Al inicio, el collarín está a ${f(x1)} m (en horizontal) de la vertical de la polea. Se jala el extremo libre con una `,
      v('F', `fuerza constante de ${f(F)} N`), `, y el collarín avanza ${fin}. La cuerda no se estira y la polea no tiene roce.`];
    const pregunta = sub === 'trabajo' ? ['¿Cuánto ', v('x', 'trabajo'), ' hace la fuerza en ese recorrido?'] : ['¿Con qué ', v('x', 'rapidez'), ` llega el collarín a esa posición${limpio(correcta) ? '' : ', aproximadamente'}?`];
    const Wmal = [
      ['EP-desplazamiento-collarin', F * (x1 - x2), `Multiplicaste la fuerza por lo que avanza el collarín (${f(x1 - x2)} m). La fuerza actúa en el extremo libre, que baja lo que se acorta el tramo de cuerda entre la polea y el collarín: ${f(L1)} − ${f(L2)} = ${f(dL)} m.`],
      ['EP-cuerda-entera', F * L1, `Multiplicaste la fuerza por todo el tramo inicial de cuerda (${f(L1)} m). El extremo no recorre todo ese tramo: solo lo que se acorta, ${f(dL)} m.`],
      ['EP-componente-inicial', F * (x1 / L1) * (x1 - x2), `Tomaste la parte horizontal de la fuerza al inicio y la multiplicaste por el avance del collarín. El ángulo de la cuerda cambia en el camino; más simple: la fuerza hace F por lo que baja el extremo, ${f(dL)} m.`],
    ];
    let errores;
    if (sub === 'trabajo') errores = Wmal.map(([id, val, ex]) => h(id, val, ex));
    else {
      errores = Wmal.map(([id, val, ex]) => h(id, Math.sqrt(2 * val / m), ex));
      errores.splice(1, 0, u('PR3-medio', Math.sqrt(W / m), `Te faltó el ½ de la energía cinética: W = ½·m·v², así que v = √(2W/m).`));
    }
    const solucion = [
      ['Tramo de cuerda entre la polea y el collarín: al inicio ', v('L', `√(${f(b)}² + ${f(x1)}²) = ${f(L1)} m`), '; al final ', v('L', x2 === 0 ? `${f(L2)} m` : `√(${f(b)}² + ${f(x2)}²) = ${f(L2)} m`), '.'],
      [`El extremo libre baja lo que se acorta ese tramo: ${f(L1)} − ${f(L2)} = ${f(dL)} m (no los `, v('dx', `${f(x1 - x2)} m`), ' que avanza el collarín).'],
      sub === 'trabajo'
        ? [v('x', 'W'), ' = ', v('F', 'F'), ` · ${f(dL)} = `, v('x', `${f(correcta)} J`), '.']
        : [`Trabajo de la fuerza: W = ${f(F)} · ${f(dL)} = ${f(W)} J. La varilla es lisa y horizontal: todo va a energía cinética, W = ½·m·v², así que `, v('x', 'v'), ` = √(2 · ${f(W)}/${f(m)}) ${limpio(correcta) ? '=' : '≈'} `, v('x', `${f(correcta)} m/s`), '.'],
    ];
    return cerrar(rng, semilla, { correcta, errores, unidad, variables: VAR, enunciado, pregunta, solucion,
      datos: { tipo: 'cuerda', sub, b, x1, x2, F, m } });
  }

  // ---------------- resorte con masa efectiva ----------------
  // La masa efectiva M del resorte se mueve con la bolita al soltarse: la energía guardada (igual en los dos
  // disparos, porque el resorte se comprime lo mismo) es ½·(m + M)·v². Se buscan masas con razón cuadrada.
  function resorte(rng, semilla) {
    const m1 = rng.elegir([10, 12, 15, 16, 20, 24, 25, 30, 36, 40, 45, 48, 50, 60]);
    const M = m1 * rng.elegir([1, 2, 3, 3, 4, 5]);           // como en el examen: M es un múltiplo de m₁
    const k = rng.elegir([[1, 2], [2, 3], [3, 4], [4, 5], [3, 5], [2, 5], [1, 3], [4, 3], [3, 2]]);
    const [a, b] = k;                                     // v₂/v₁ = a/b ⇒ (m₁ + M)/(m₂ + M) = a²/b²
    const m2 = (m1 + M) * b * b / (a * a) - M;
    if (!(m2 > 0) || Math.abs(m2 - Math.round(m2)) > 1e-9 || m2 === m1 || m2 > 600) return null;
    const v1 = rng.elegir([3, 4, 5, 6, 8, 9, 10, 12, 15, 18, 20, 24, 30]);
    const correcta = v1 * a / b;
    if (!limpio(correcta)) return null;
    const VAR = { m: { nombre: 'masa de la bolita', color: 'o' }, M: { nombre: 'masa efectiva del resorte', color: 'h' }, vv: { nombre: 'rapidez de salida', color: 'i' }, x: { nombre: 'rapidez que se pide', color: 'd' } };
    const enunciado = ['El mecanismo de una pistola de juguete es un resorte que se comprime y, al apretar el gatillo, se suelta y empuja una bolita. Una bolita de ',
      v('m', `${f(m1)} g`), ' sale a ', v('vv', `${f(v1)} m/s`), '. La ', v('M', `masa efectiva del resorte es ${f(M)} g`),
      ' (al soltarse, esa parte del resorte se mueve junto con la bolita). No hay rozamiento y el resorte se comprime siempre lo mismo.'];
    const pregunta = ['¿Con qué ', v('x', 'rapidez'), ' saldría una bolita de ', v('m', `${f(m2)} g`), '?'];
    const errores = [
      h('EP-sin-masa-efectiva', v1 * Math.sqrt(m1 / m2), `Repartiste la energía solo entre las bolitas: ½·${f(m1)}·${f(v1)}² = ½·${f(m2)}·v². La masa efectiva del resorte (${f(M)} g) también se lleva energía cinética en los dos disparos: va sumada a cada bolita.`, TRA),
      h('EP-sin-raiz', v1 * (m1 + M) / (m2 + M), `Te faltó la raíz: la energía va con v², así que la rapidez cambia con la raíz de la razón de masas, √(${f(m1 + M)}/${f(m2 + M)}).`),
      h('EP-cantidad-movimiento', v1 * m1 / m2, `Igualaste cantidades de movimiento (${f(m1)}·${f(v1)} = ${f(m2)}·v). Lo que se conserva es la energía del resorte comprimido, que se reparte en ½·(m + M)·v².`),
      h('EP-razon-al-reves', v1 * Math.sqrt((m2 + M) / (m1 + M)), `Invertiste la razón: con más masa total la rapidez baja. v₂ = v₁·√((m₁ + M)/(m₂ + M)).`),
      h('EP-masa-efectiva-una-vez', v1 * Math.sqrt((m1 + M) / m2), `Sumaste la masa efectiva solo en el primer disparo. El resorte también se mueve en el segundo: es ${f(m2)} + ${f(M)} = ${f(m2 + M)} g.`),
    ];
    const solucion = [
      ['El resorte se comprime lo mismo: guarda la misma energía en los dos disparos. Al soltarse, esa energía se va en la bolita y en la ', v('M', 'masa efectiva del resorte'), ', que se mueven juntas: E = ½·(m + M)·v².'],
      ['Primer disparo: E = ½·(', v('m', f(m1)), ' + ', v('M', f(M)), ')·', v('vv', f(v1)), '². Segundo: E = ½·(', v('m', f(m2)), ' + ', v('M', f(M)), ')·', v('x', 'v'), '².'],
      ['Se igualan: ', v('x', 'v'), ' = ', v('vv', f(v1)), `·√(${f(m1 + M)}/${f(m2 + M)}) = ${f(v1)}·${a}/${b} = `, v('x', `${f(correcta)} m/s`), '. (Las masas se pueden dejar en gramos: solo importa su razón).'],
    ];
    return cerrar(rng, semilla, { correcta, errores, unidad: 'm/s', variables: VAR, enunciado, pregunta, solucion,
      datos: { tipo: 'resorte', sub: 'masa-efectiva', m1, M, m2, v1 } });
  }

  return { id: 'energia-potencia', titulo: 'La bomba y el ascensor', generar };
});
