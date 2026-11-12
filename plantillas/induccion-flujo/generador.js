/*
 * Generador «El flujo que va y vuelve»: flujo magnético, carga inducida y fem en bobinas y espiras
 * (unidad fisica.induccion-electromagnetica). Formato "predicciones" (docs/arquitectura.md). Funciona en
 * el navegador (window.Generadores['induccion-flujo']) y en Node (require). No usa ningún motor.
 *
 * Tipos y subtipos:
 *   carga/invertir      se invierte el campo (o la bobina gira media vuelta): ΔΦ = 2·B·A, Q = N·ΔΦ/R
 *   carga/anular        se apaga el campo, se saca la bobina o gira un cuarto de vuelta: ΔΦ = B·A
 *   armonico/expresion  espira que gira con ω constante: la expresión Φ(t) = B·A·cos ωt (empieza
 *                       perpendicular al campo) o B·A·sen ωt (empieza paralela) (respuesta de texto)
 *   armonico/instante   el flujo en un instante dado, con signo
 *   armonico/femmax     la fem máxima de una bobina que gira: N·B·A·ω, con la rapidez en rpm
 *   armonico/frecuencia la frecuencia de la fem inducida, de Φ(t) o de las rpm
 *   femmedia/campo      el campo cambia de B₁ a B₂ (o se invierte) en Δt: ε = N·|ΔΦ|/Δt
 *   femmedia/giro       la bobina gira 90° o 180° en Δt
 *
 * Convenciones: SI; las áreas se dan casi siempre en cm² (1 cm² = 10⁻⁴ m²) y los tiempos cortos en ms.
 * «Paralela al campo» quiere decir que el plano de la espira contiene las líneas de campo (flujo cero).
 * Números con tres cifras significativas y coma decimal; fuera de 0,01 a 100 000, en notación científica.
 * Distractores: solo los que quedan entre 1/20 y 20 veces la correcta (cm² entre 100 o ms como s dan
 * factores de 100 o 1000 y se descartan por absurdos; esas conversiones quedan en la solución).
 * Errores: U7, PR4, PR7 (hipótesis, docs/investigacion/fisica-calculo-transversal-ideas-erroneas.md);
 * MG10 (parcial, docs/investigacion/electromagnetismo-moderna-ideas-erroneas.md); las trampas de los
 * solucionarios de San Marcos (docs/clasificacion/trampas-admision-unmsm/fisica.md, hipótesis): ΔΦ = B·A al
 * invertir, fase cero con la espira paralela al campo; los demás, hipótesis nuestras con prefijo IN-.
 */
(function (root, fabrica) {
  const nodo = typeof module === 'object' && module.exports;
  const api = fabrica(nodo ? require('../../nucleo/azar.js') : root.Azar,
                      nodo ? require('../../nucleo/predicciones.js') : root.Predicciones);
  if (nodo) module.exports = api;
  else (root.Generadores = root.Generadores || {})[api.id] = api;
})(typeof self !== 'undefined' ? self : this, function (Azar, P) {
  'use strict';
  const ID = 'induccion-flujo';
  const TR = 'docs/investigacion/fisica-calculo-transversal-ideas-erroneas.md';
  const EM = 'docs/investigacion/electromagnetismo-moderna-ideas-erroneas.md';
  const TRA = 'docs/clasificacion/trampas-admision-unmsm/fisica.md';
  const h = (id, valor, explicacion, fuente = null) => ({ id, valor, explicacion, respaldo: 'hipotesis', fuente });
  const tr = (id, valor, explicacion) => h(id, valor, explicacion, TR);
  const ta = (id, valor, explicacion) => h(id, valor, explicacion, TRA);
  const pa = (id, valor, explicacion) => ({ id, valor, explicacion, respaldo: 'parcial', fuente: EM });
  const c = P.v;
  const PI = Math.PI;

  // ---------- Números ----------
  const SUP = { '-': '⁻', 0: '⁰', 1: '¹', 2: '²', 3: '³', 4: '⁴', 5: '⁵', 6: '⁶', 7: '⁷', 8: '⁸', 9: '⁹' };
  const pot = e => '10' + String(e).split('').map(d => SUP[d]).join('');
  function me(x) {
    const a = Math.abs(x);
    let e = Math.floor(Math.log10(a)), m = Math.round(a / 10 ** e * 1e9) / 1e9;
    if (m >= 10) { m /= 10; e++; }
    if (m < 1) { m *= 10; e--; }
    return [Math.sign(x) * m, e];
  }
  const limpio = x => Number.isFinite(x) && x !== 0 && (m => Math.abs(m * 100 - Math.round(m * 100)) < 1e-6)(me(x)[0]);
  function num(x) {
    if (x === 0) return '0';
    let [m, e] = me(x), mr = Math.round(m * 100) / 100;
    if (Math.abs(mr) >= 10) { mr /= 10; e++; }
    if (e >= -2 && e <= 4) return P.formatear(mr * 10 ** e, Math.max(0, 2 - e));
    return `${P.formatear(mr, 2)} × ${pot(e)}`;
  }
  function textoPi(k) {
    const t = num(k), i = t.indexOf(' × ');
    const a = i < 0 ? t : t.slice(0, i), resto = i < 0 ? '' : t.slice(i);
    return (a === '1' ? '' : a === '−1' ? '−' : a) + 'π' + resto;
  }
  const txt = (x, u) => ((!limpio(x) && limpio(x / PI)) ? textoPi(x / PI) : num(x)) + (u ? ' ' + u : '');
  const exacto = x => limpio(x) || limpio(x / PI);
  function fraccion(x) { // «1/30», «5/12», «2»
    for (let q = 1; q <= 400; q++) { const p = x * q; if (Math.abs(p - Math.round(p)) < 1e-9) return q === 1 ? String(Math.round(p)) : `${Math.round(p)}/${q}`; }
    return num(x);
  }

  // Área: casi siempre en cm².
  function area(rng) {
    if (rng.entero(0, 3) < 3) { const cm2 = rng.elegir([10, 20, 25, 40, 50, 80, 100, 200, 400, 500]); return { A: cm2 / 1e4, cm2: true, texto: `${cm2} cm²` }; }
    const A = rng.elegir([0.01, 0.02, 0.04, 0.05, 0.1, 0.2]); return { A, cm2: false, texto: `${num(A)} m²` };
  }
  const pasoA = a => (a.cm2 ? [['El área en m²: ', c('A', `${a.texto} = ${num(a.A)} m²`), ' (1 cm² = 10⁻⁴ m²).']] : []);
  // (Pasar cm² a m² entre 100 da un factor 100: esa opción sería absurda; la conversión queda en la solución.)

  // ---------- Armado ----------
  function generar(semilla) {
    const rng = Azar.crear(ID + '|' + semilla);
    const [tipo, sub] = rng.elegir([
      ['carga', 'invertir'], ['carga', 'invertir'], ['carga', 'invertir'], ['carga', 'anular'], ['carga', 'anular'],
      ['armonico', 'expresion'], ['armonico', 'expresion'], ['armonico', 'expresion'], ['armonico', 'instante'], ['armonico', 'instante'],
      ['armonico', 'femmax'], ['armonico', 'femmax'], ['armonico', 'frecuencia'], ['armonico', 'frecuencia'],
      ['femmedia', 'campo'], ['femmedia', 'campo'], ['femmedia', 'giro']]);
    for (let intento = 0; intento < 5000; intento++) {
      const pr = construir(rng, semilla, tipo, sub);
      if (pr && pr.alternativas.length >= 4) return pr;
    }
    throw new Error('No se pudo generar un problema con 4 alternativas distintas');
  }

  function construir(rng, semilla, tipo, sub) {
    if (tipo === 'carga') return carga(rng, semilla, sub);
    if (tipo === 'armonico') return sub === 'expresion' ? expresion(rng, semilla) : sub === 'instante' ? instante(rng, semilla) : sub === 'femmax' ? femmax(rng, semilla) : frecuencia(rng, semilla);
    return femmedia(rng, semilla, sub);
  }

  function cerrar(rng, semilla, o) {
    if (!exacto(o.correcta)) return null;
    // Sin distractores absurdos: de 1/20 a 20 veces la correcta (en valor absoluto).
    const ok = e => { if (!Number.isFinite(e.valor) || !(o.negativos ? Math.abs(e.valor) > 1e-12 : e.valor > 0)) return false;
      const r = Math.abs(e.valor / o.correcta); return r >= 1 / 20 && r <= 20; };
    const alternativas = P.armar({ correcta: o.correcta, errores: o.errores.filter(ok), rng, texto: o.texto, negativos: !!o.negativos });
    return {
      id: `${ID}#${semilla}`, variables: o.variables, enunciado: o.enunciado, pregunta: o.pregunta, datos: '',
      alternativas, solucion: o.solucion, respuesta: { valor: o.correcta, unidad: o.unidad }, _datos: o.datos,
    };
  }

  // ---- carga: Q = N·ΔΦ/R ----
  const COMO = {
    campo: 'el campo se invierte: queda con el mismo valor, pero en sentido contrario',
    giro180: 'la bobina gira media vuelta (180°)',
    apaga: 'el campo se apaga',
    saca: 'la bobina se saca por completo del campo',
    giro90: 'la bobina gira un cuarto de vuelta, hasta quedar paralela al campo',
  };
  function carga(rng, semilla, sub) {
    const modo = sub === 'invertir' ? rng.elegir(['campo', 'campo', 'giro180']) : rng.elegir(['apaga', 'saca', 'giro90']);
    const N = rng.elegir([5, 10, 20, 50, 100, 200, 250, 500]), a = area(rng);
    const B = rng.elegir([0.1, 0.2, 0.25, 0.4, 0.5, 0.8, 1]), R = rng.elegir([2, 4, 5, 8, 10, 20, 25, 50]);
    const dt = rng.elegir([0.1, 0.2, 0.5, 2]);
    const k = sub === 'invertir' ? 2 : 1;
    const dPhi = k * B * a.A, Q = N * dPhi / R * 1000; // en mC
    if (!limpio(Q) || Q < 0.01 || Q > 1e4) return null;
    const variables = { B: { nombre: 'campo magnético', color: 'o' }, A: { nombre: 'área', color: 'i' }, R: { nombre: 'resistencia', color: 'h' }, x: { nombre: 'carga', color: 'd' } };
    const enunciado = ['Una bobina de ', `${N} espiras`, ', cada una de ', c('A', a.texto), ' de área, está cerrada sobre sí misma y su resistencia total es ', c('R', `${R} Ω`), '. Está en un campo magnético uniforme de ', c('B', `${num(B)} T`), `, perpendicular al plano de las espiras. En ${num(dt)} s, ${COMO[modo]}.`];
    const pregunta = ['¿Qué ', c('x', 'carga total'), ' circula por la bobina?'];
    const errores = [
      ...(sub === 'invertir'
        ? [ta('IN-sin-invertir', Q / 2, modo === 'campo'
          ? 'Tomaste el cambio de flujo como B·A. El flujo pasa de +B·A a −B·A: el cambio es 2·B·A, porque primero baja hasta cero y luego sigue bajando hasta −B·A.'
          : 'Tomaste el cambio de flujo como B·A. Al girar media vuelta, las líneas que entraban por una cara ahora entran por la otra: el flujo pasa de +B·A a −B·A y cambia 2·B·A.')]
        : [h('IN-doble', 2 * Q, modo === 'giro90'
          ? 'Tomaste el cambio de flujo como 2·B·A. Con la espira paralela al campo el flujo queda en cero: pasa de B·A a 0 y cambia B·A.'
          : 'Tomaste el cambio de flujo como 2·B·A. Aquí el flujo solo baja a cero, no se invierte: cambia B·A.')]),
      h('IN-sin-N', Q / N, `Olvidaste multiplicar por el número de espiras. Cada una de las ${N} espiras aporta su cambio de flujo: Q = N·ΔΦ/R.`),
      h('IN-sin-R', Q * R, 'Te faltó dividir entre la resistencia. N·ΔΦ es el cambio total de flujo de la bobina, en webers; la carga es Q = N·ΔΦ/R.'),
      h('IN-corriente-por-carga', Q / dt, `Dividiste entre el tiempo: eso da una corriente media, no una carga. La carga inducida no depende de lo rápido que cambie el flujo: Q = N·ΔΦ/R.`),
      tr('PR4-R', Q * R * R, 'Multiplicaste por la resistencia. Más resistencia deja pasar menos carga: Q = N·ΔΦ/R.'),
    ];
    const solucion = [
      ...pasoA(a),
      [sub === 'invertir' ? 'El flujo por espira pasa de +B·A a −B·A: ' : 'El flujo por espira pasa de B·A a 0: ', 'ΔΦ = ', k === 2 ? '2·' : '', c('B', 'B'), '·', c('A', 'A'), ` = ${k === 2 ? '2 · ' : ''}${num(B)} · ${num(a.A)} = ${num(dPhi)} Wb.`],
      ['La fem media es N·ΔΦ/Δt y la corriente media, esa fem entre R. La carga es corriente por tiempo, y el tiempo se simplifica: Q = N·ΔΦ/', c('R', 'R'), '.'],
      [c('x', 'Q'), ` = ${N} · ${num(dPhi)} / ${R} = ${num(Q / 1000)} C = `, c('x', `${num(Q)} mC`), '.'],
    ];
    return cerrar(rng, semilla, { correcta: Q, errores, texto: x => txt(x, 'mC'), unidad: 'mC', variables, enunciado, pregunta, solucion,
      datos: { tipo: 'carga', sub, modo, N, A: a.A, cm2: a.cm2, B, R, dt } });
  }

  // ---- giro: cómo se da la rapidez ----
  function giro(rng, conRadS = true) {
    const forma = rng.elegir(conRadS ? ['rpm', 'rpm', 'rps', 'rad'] : ['rpm', 'rpm', 'rps']);
    if (forma === 'rpm') { const rpm = rng.elegir([60, 120, 150, 180, 240, 300, 600, 900, 1200]); return { forma, rpm, w: 2 * PI * rpm / 60, texto: `${rpm} rpm` }; }
    if (forma === 'rps') { const f = rng.elegir([2, 3, 5, 10, 20, 25, 50, 60]); return { forma, f, w: 2 * PI * f, texto: `${f} vueltas por segundo` }; }
    const k = rng.elegir([2, 4, 5, 6, 8, 10, 20, 40, 100]); return { forma, w: k * PI, texto: `${textoPi(k)} rad/s` };
  }
  const pasoW = g => (g.forma === 'rad' ? [] : g.forma === 'rpm'
    ? [['La rapidez angular: ', c('w', `${g.texto}`), ` son ${vueltas(g.rpm / 60)} por segundo, y cada vuelta son 2π rad: ω = 2π · ${num(g.rpm / 60)} = ${textoPi(g.w / PI)} rad/s.`]]
    : [['La rapidez angular: cada vuelta son 2π rad, así que ω = 2π · ', c('w', `${g.f}`), ` = ${textoPi(g.w / PI)} rad/s.`]]);
  const vueltas = n => (n === 1 ? '1 vuelta' : `${num(n)} vueltas`);
  const fGiro = g => (g.forma === 'rpm' ? g.rpm / 60 : g.forma === 'rps' ? g.f : null);
  const ARRANQUE = {
    perpendicular: 'En t = 0, el plano de la espira es perpendicular al campo.',
    paralelo: 'En t = 0, el plano de la espira es paralelo a las líneas de campo, y gira de modo que el flujo empieza a aumentar.',
  };
  // Φ(t) escrito como en los exámenes: «Φ = 0,02·sen(10πt) Wb».
  const wTexto = w => (limpio(w / PI) && !limpio(w) ? textoPi(w / PI) : num(w));
  const expr = (fn, amp, w) => ({ clave: `${fn}:${Math.round(amp * 1e9) / 1e9}:${Math.round(w * 1e9) / 1e9}`, texto: `Φ = ${num(amp)}·${fn}(${wTexto(w)}t) Wb` });

  function expresion(rng, semilla) {
    const a = area(rng), B = rng.elegir([0.1, 0.2, 0.4, 0.5, 0.8, 1, 1.5, 2]), g = giro(rng);
    const inicio = rng.elegir(['paralelo', 'paralelo', 'perpendicular']);
    const amp = B * a.A;
    if (!limpio(amp) || amp < 1e-4) return null;
    const fn = inicio === 'paralelo' ? 'sen' : 'cos', otra = fn === 'sen' ? 'cos' : 'sen';
    const variables = { B: { nombre: 'campo magnético', color: 'o' }, A: { nombre: 'área', color: 'i' }, w: { nombre: 'rapidez de giro', color: 'h' }, x: { nombre: 'flujo', color: 'd' } };
    const enunciado = ['Una espira de ', c('A', a.texto), ' de área gira con rapidez constante de ', c('w', g.texto), ' en un campo magnético uniforme de ', c('B', `${num(B)} T`), ', alrededor de un eje perpendicular al campo. ', ARRANQUE[inicio]];
    const pregunta = ['¿Qué expresión da el ', c('x', 'flujo magnético'), ' a través de la espira en función del tiempo (t en s)?'];
    const f = fGiro(g);
    const errores = [
      { id: 'IN-fase-cero', ...expr(otra, amp, g.w), respaldo: 'hipotesis', fuente: TRA, explicacion: inicio === 'paralelo'
        ? 'Usaste el coseno, que vale 1 en t = 0. Pero en t = 0 la espira es paralela al campo: no la atraviesa ninguna línea y el flujo es cero. Una función que empieza en cero y sube es el seno.'
        : 'Usaste el seno, que vale 0 en t = 0. Pero en t = 0 la espira es perpendicular al campo y el flujo es el máximo, B·A. Una función que empieza en su máximo es el coseno.' },
      ...(f !== null ? [{ id: 'U7-f-como-omega', ...expr(fn, amp, f), respaldo: 'hipotesis', fuente: TR, explicacion: `Pusiste la frecuencia (${vueltas(f)} por segundo) donde va la rapidez angular. Dentro del seno o del coseno va ω en rad/s: ω = 2π·f.` }] : []),
      ...(g.forma === 'rpm' ? [{ id: 'U7-rpm', ...expr(fn, amp, g.rpm), respaldo: 'hipotesis', fuente: TR, explicacion: 'Pusiste las rpm directamente como si fueran rad/s. Hay que pasar a vueltas por segundo (entre 60) y a radianes (por 2π).' }] : []),
      { id: 'IN-fase-cero-U7', ...expr(otra, amp, f !== null ? f : g.w / PI), respaldo: 'hipotesis', fuente: TRA, explicacion: `Hay dos errores: la función (en t = 0 el flujo ${inicio === 'paralelo' ? 'es cero: va seno' : 'es máximo: va coseno'}) y lo que va dentro, que es ω en rad/s.` },
      { id: 'IN-amplitud-doble', ...expr(fn, 2 * amp, g.w), respaldo: 'hipotesis', fuente: null, explicacion: 'Pusiste 2·B·A como amplitud. El flujo va de +B·A a −B·A: su valor máximo es B·A; 2·B·A es lo que cambia en media vuelta.' },
    ];
    const correcta = expr(fn, amp, g.w);
    const alternativas = P.armarTexto({ correcta, errores, rng });
    const solucion = [
      ...pasoA(a),
      ['El flujo máximo, con la espira perpendicular al campo: ', c('B', 'B'), '·', c('A', 'A'), ` = ${num(B)} · ${num(a.A)} = ${num(amp)} Wb.`],
      ...pasoW(g),
      [inicio === 'paralelo'
        ? 'En t = 0 la espira es paralela al campo: el flujo es cero y empieza a aumentar. Eso es un seno: '
        : 'En t = 0 la espira es perpendicular al campo: el flujo es máximo. Eso es un coseno: ', c('x', correcta.texto), '.'],
    ];
    return {
      id: `${ID}#${semilla}`, variables, enunciado, pregunta, datos: '', alternativas, solucion,
      respuesta: { valor: correcta.clave, unidad: 'Wb' },
      _datos: { tipo: 'armonico', sub: 'expresion', inicio, A: a.A, cm2: a.cm2, B, forma: g.forma, rpm: g.rpm || null, f: g.f || null, w: g.w },
    };
  }

  function instante(rng, semilla) {
    const a = area(rng), B = rng.elegir([0.1, 0.2, 0.4, 0.5, 0.8, 1, 2]), g = giro(rng, false);
    const inicio = rng.elegir(['paralelo', 'perpendicular']);
    const fn = inicio === 'paralelo' ? Math.sin : Math.cos, otra = inicio === 'paralelo' ? Math.cos : Math.sin;
    const j = rng.elegir(inicio === 'paralelo' ? [1, 3, 5, 7, 9, 11] : [2, 4, 6, 8, 10]);
    const ang = j * PI / 6, t = ang / g.w;
    const amp = B * a.A * 1000; // mWb
    const correcta = amp * fn(ang);
    if (!limpio(correcta) || !limpio(amp)) return null;
    const variables = { B: { nombre: 'campo magnético', color: 'o' }, A: { nombre: 'área', color: 'i' }, w: { nombre: 'rapidez de giro', color: 'h' }, x: { nombre: 'flujo', color: 'd' } };
    const tTxt = `${fraccion(t)} s`;
    const enunciado = ['Una espira de ', c('A', a.texto), ' de área gira con rapidez constante de ', c('w', g.texto), ' en un campo magnético uniforme de ', c('B', `${num(B)} T`), ', alrededor de un eje perpendicular al campo. ', ARRANQUE[inicio]];
    const pregunta = ['¿Cuánto vale el ', c('x', 'flujo magnético'), ` a través de la espira en t = ${tTxt}? (Con signo: negativo si las líneas la atraviesan por la otra cara.)`];
    const f = fGiro(g);
    const errores = [
      ta('IN-fase-cero', amp * otra(ang), inicio === 'paralelo'
        ? 'Usaste Φ = B·A·cos ωt, que vale B·A en t = 0. Pero en t = 0 la espira es paralela al campo y el flujo es cero: Φ = B·A·sen ωt.'
        : 'Usaste Φ = B·A·sen ωt, que vale 0 en t = 0. Pero en t = 0 la espira es perpendicular al campo y el flujo es máximo: Φ = B·A·cos ωt.'),
      h('IN-flujo-max', amp, 'Ese es el flujo máximo, B·A, cuando la espira es perpendicular al campo. En ese instante la espira está inclinada: hay que multiplicar por el seno o el coseno de ω·t.'),
      h('IN-signo', -correcta, 'Te salió el signo cambiado. Revisa en qué parte de la vuelta está la espira: después de un cuarto de vuelta desde la posición perpendicular, las líneas empiezan a entrar por la otra cara y el flujo es negativo.'),
      ...(g.forma === 'rpm' ? [tr('U7-rpm', amp * fn(g.rpm * t), 'Usaste las rpm como si fueran rad/s dentro del seno o del coseno. Primero se pasa: ω = 2π·(rpm/60).')] : []),
      tr('U7-f-como-omega', amp * fn(f * t), `Usaste la frecuencia (${vueltas(f)} por segundo) como si fuera ω. El ángulo girado es ω·t con ω = 2π·f.`),
    ];
    const angTxt = { 1: 'π/6', 2: 'π/3', 3: 'π/2', 4: '2π/3', 5: '5π/6', 6: 'π', 7: '7π/6', 8: '4π/3', 9: '3π/2', 10: '5π/3', 11: '11π/6' }[j];
    const solucion = [
      ...pasoA(a),
      ...pasoW(g),
      [inicio === 'paralelo' ? 'En t = 0 el flujo es cero y empieza a crecer: Φ = ' : 'En t = 0 el flujo es máximo: Φ = ', c('B', 'B'), '·', c('A', 'A'), inicio === 'paralelo' ? '·sen ωt.' : '·cos ωt.'],
      [`En t = ${tTxt}, la espira giró ω·t = ${textoPi(g.w / PI)} · ${fraccion(t)} = ${angTxt} rad.`],
      [c('x', 'Φ'), ` = ${num(B)} · ${num(a.A)} · ${inicio === 'paralelo' ? 'sen' : 'cos'}(${angTxt}) = `, c('x', `${num(correcta)} mWb`), '.'],
    ];
    return cerrar(rng, semilla, { negativos: true, correcta, errores, texto: x => txt(x, 'mWb'), unidad: 'mWb', variables, enunciado, pregunta, solucion,
      datos: { tipo: 'armonico', sub: 'instante', inicio, A: a.A, cm2: a.cm2, B, forma: g.forma, rpm: g.rpm || null, f: g.f || null, t } });
  }

  function femmax(rng, semilla) {
    const N = rng.elegir([5, 10, 20, 50, 100, 200, 500]), a = area(rng), B = rng.elegir([0.1, 0.2, 0.4, 0.5, 0.8, 1]);
    const g = giro(rng, false);
    if (g.forma === 'rps' && rng.moneda()) return null; // más rpm, que es la trampa
    const eps = N * B * a.A * g.w;
    if (!exacto(eps) || eps < 0.01 || eps / PI > 1e4) return null;
    const variables = { B: { nombre: 'campo magnético', color: 'o' }, A: { nombre: 'área', color: 'i' }, w: { nombre: 'rapidez de giro', color: 'h' }, x: { nombre: 'fem máxima', color: 'd' } };
    const enunciado = ['Un generador tiene una bobina de ', `${N} espiras`, ', cada una de ', c('A', a.texto), ' de área, que gira a ', c('w', g.texto), ' en un campo magnético uniforme de ', c('B', `${num(B)} T`), ', alrededor de un eje perpendicular al campo.'];
    const pregunta = ['¿Cuál es la ', c('x', 'fem máxima'), ' que se induce en la bobina?'];
    const f = fGiro(g);
    const errores = [
      ...(g.forma === 'rpm' ? [tr('U7-rpm', N * B * a.A * g.rpm, 'Usaste las rpm como si fueran rad/s. Primero se pasa: ω = 2π·(rpm/60).')] : []),
      tr('U7-sin-2pi', N * B * a.A * f, `Usaste ${vueltas(f)} por segundo como ω. Cada vuelta son 2π rad: ω = 2π·f.`),
      h('IN-sin-N', B * a.A * g.w, `Calculaste la fem de una sola espira. Las ${N} espiras están en serie y sus fem se suman: ε = N·B·A·ω.`),
      h('IN-media-por-max', 2 * eps / PI, 'Esa es la fem media en media vuelta, 2·N·B·A·ω/π. La máxima es N·B·A·ω, cuando la espira está paralela al campo y el flujo cambia más rápido.'),
      h('IN-flujo-por-fem', N * B * a.A, 'Ese es el flujo máximo de la bobina, N·B·A, en webers. La fem es lo rápido que cambia el flujo: hay que multiplicar por ω.'),
    ];
    const solucion = [
      ...pasoA(a),
      ...pasoW(g),
      ['Con Φ = N·B·A·cos ωt, la fem es ε = N·B·A·ω·sen ωt; su máximo es ', c('x', 'ε'), ' = N·', c('B', 'B'), '·', c('A', 'A'), '·', c('w', 'ω'), '.'],
      [c('x', 'ε'), ` = ${N} · ${num(B)} · ${num(a.A)} · ${textoPi(g.w / PI)} = `, c('x', txt(eps, 'V')), '.'],
    ];
    return cerrar(rng, semilla, { correcta: eps, errores, texto: x => txt(x, 'V'), unidad: 'V', variables, enunciado, pregunta, solucion,
      datos: { tipo: 'armonico', sub: 'femmax', N, A: a.A, cm2: a.cm2, B, forma: g.forma, rpm: g.rpm || null, f: g.f || null } });
  }

  function frecuencia(rng, semilla) {
    const modo = rng.elegir(['phi', 'rpm']);
    const variables = { w: { nombre: 'rapidez de giro', color: 'h' }, x: { nombre: 'frecuencia', color: 'd' } };
    const pregunta = ['¿Cuál es la ', c('x', 'frecuencia'), ' de la fem inducida?'];
    if (modo === 'phi') {
      const k = rng.elegir([4, 6, 8, 10, 20, 40, 50, 100, 120]), amp = rng.elegir([0.01, 0.02, 0.05, 0.1, 0.2, 0.4]);
      const correcta = k / 2;
      const enunciado = ['El flujo magnético a través de una espira que gira en un campo uniforme es ', `Φ = ${num(amp)}·cos(`, c('w', `${textoPi(k)}t`), ') Wb, con t en segundos.'];
      const errores = [
        tr('U7-omega-como-f', k * PI, `Tomaste ${textoPi(k)} rad/s, que es ω, como la frecuencia. La frecuencia es f = ω/(2π).`),
        tr('U7-sin-pi', k, `Tomaste el número que acompaña a πt como la frecuencia. ω = ${textoPi(k)} rad/s, y f = ω/(2π): hay que dividir entre 2.`),
        tr('U7-pi-sobra', k * PI / 2, `Dividiste entre 2 pero dejaste la π. ω = ${textoPi(k)} rad/s, y f = ω/(2π): la π también se simplifica.`),
        tr('PR7-periodo', 2 / k, `Ese es el periodo, T = 2π/ω = ${fraccion(2 / k)} s. La frecuencia es su inverso: las vueltas por segundo.`),
      ];
      const solucion = [
        ['En Φ = Φ₀·cos ωt, lo que acompaña a t es la rapidez angular: ', c('w', `ω = ${textoPi(k)} rad/s`), '. La fem tiene la misma frecuencia que el giro.'],
        [c('x', 'f'), ` = ω/(2π) = ${textoPi(k)}/(2π) = `, c('x', `${num(correcta)} Hz`), '.'],
      ];
      return cerrar(rng, semilla, { correcta, errores, texto: x => txt(x, 'Hz'), unidad: 'Hz', variables, enunciado, pregunta, solucion,
        datos: { tipo: 'armonico', sub: 'frecuencia', modo, k, amp } });
    }
    const rpm = rng.elegir([120, 180, 300, 360, 600, 900, 1200, 1500, 1800, 3000, 3600]);
    const correcta = rpm / 60;
    const enunciado = ['La bobina de un generador gira a ', c('w', `${rpm} rpm`), ' en un campo magnético uniforme.'];
    const errores = [
      tr('U7-rpm', rpm, 'Usaste las rpm como hertz. Las rpm son vueltas por minuto; los hertz, por segundo: se divide entre 60.'),
      tr('U7-omega-como-f', 2 * PI * rpm / 60, 'Calculaste ω = 2π·f, en rad/s. La frecuencia es solo las vueltas por segundo.'),
      tr('PR7-periodo', 60 / rpm, 'Ese es el periodo, lo que dura una vuelta en segundos. La frecuencia es su inverso.'),
      tr('U7-pi', PI * rpm / 60, 'Multiplicaste las vueltas por segundo por π. La frecuencia es solo las vueltas por segundo, sin π.'),
      h('IN-medio-ciclo', rpm / 120, 'Pensaste que la fem hace un ciclo cada dos vueltas. Hace un ciclo completo en cada vuelta: sube, baja y vuelve.'),
      h('IN-dos-picos', rpm / 30, 'Contaste el máximo y el mínimo de la fem como dos ciclos. En una vuelta la fem hace un solo ciclo completo.'),
    ];
    const solucion = [
      ['La fem cambia al ritmo del giro: un ciclo por vuelta.'],
      [c('x', 'f'), ' = ', c('w', `${rpm} vueltas`), ' / 60 s = ', c('x', `${num(correcta)} Hz`), '.'],
    ];
    return cerrar(rng, semilla, { correcta, errores, texto: x => txt(x, 'Hz'), unidad: 'Hz', variables, enunciado, pregunta, solucion,
      datos: { tipo: 'armonico', sub: 'frecuencia', modo, rpm } });
  }

  // ---- fem media: ε = N·|ΔΦ|/Δt ----
  function femmedia(rng, semilla, sub) {
    const N = rng.elegir([5, 10, 20, 10, 20, 50, 100, 200]), a = area(rng);
    const ms = rng.elegir([10, 20, 25, 40, 50, 100, 200]), dt = ms / 1000;
    const variables = { B: { nombre: 'campo magnético', color: 'o' }, A: { nombre: 'área', color: 'i' }, t: { nombre: 'tiempo', color: 'h' }, x: { nombre: 'fem media', color: 'd' } };
    const pregunta = ['¿Cuál es la ', c('x', 'fem media'), ' inducida en la bobina?'];
    const intro = ['Una bobina de ', `${N} espiras`, ', cada una de ', c('A', a.texto), ' de área, '];
    let dB, enunciado, errores, solucion, datos;
    if (sub === 'campo') {
      const modo = rng.elegir(['sube', 'baja', 'invierte', 'invierte']);
      let B1 = rng.elegir([0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.8]), B2 = rng.elegir([0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.8, 1]);
      if (modo === 'sube' && B2 <= B1) return null;
      if (modo === 'baja' && B2 >= B1) return null;
      dB = modo === 'invierte' ? B1 + B2 : Math.abs(B2 - B1);
      const cambio = modo === 'invierte'
        ? [' pasa de ', c('B', `${num(B1)} T`), ' a ', c('B', `${num(B2)} T`), ' pero en sentido contrario,']
        : [' pasa de ', c('B', `${num(B1)} T`), ' a ', c('B', `${num(B2)} T`), ', sin cambiar de sentido,'];
      enunciado = [...intro, 'está en un campo magnético uniforme perpendicular al plano de las espiras. El campo', ...cambio, ' en ', c('t', `${ms} ms`), '.'];
      const eps = N * dB * a.A / dt;
      errores = [
        pa('MG10-final', N * B2 * a.A / dt, 'Usaste el flujo final en lugar de su cambio. La fem depende de cuánto cambia el flujo: ΔΦ = Φ final − Φ inicial.'),
        pa('MG10-inicial', N * B1 * a.A / dt, 'Usaste el flujo inicial en lugar de su cambio. La fem depende de cuánto cambia el flujo: ΔΦ = Φ final − Φ inicial.'),
        modo === 'invierte'
          ? ta('IN-sin-invertir', N * Math.abs(B2 - B1) * a.A / dt, `Restaste los valores sin tener en cuenta que el campo cambió de sentido. Si el flujo pasa de +${num(B1 * a.A)} Wb a −${num(B2 * a.A)} Wb, el cambio es la suma: (B₁ + B₂)·A.`)
          : h('IN-suma', N * (B1 + B2) * a.A / dt, 'Sumaste los dos campos. Si no cambia de sentido, el cambio de flujo es la diferencia: |B₂ − B₁|·A.'),
        h('IN-sin-N', dB * a.A / dt, `Calculaste la fem de una sola espira. Las ${N} espiras suman sus fem: ε = N·|ΔΦ|/Δt.`),
      ];
      solucion = [
        ...pasoA(a),
        [modo === 'invierte' ? 'El flujo por espira pasa de +B₁·A a −B₂·A: |ΔΦ| = (' : 'El flujo por espira cambia |ΔΦ| = |', c('B', 'B₂'), modo === 'invierte' ? ' + ' : ' − ', c('B', 'B₁'), modo === 'invierte' ? ')·' : '|·', c('A', 'A'), ` = ${num(dB)} · ${num(a.A)} = ${num(dB * a.A)} Wb.`],
        [c('x', 'ε'), ' = N·|ΔΦ|/', c('t', 'Δt'), ` = ${N} · ${num(dB * a.A)} / ${num(dt)} = `, c('x', `${num(eps)} V`), '.'],
      ];
      datos = { tipo: 'femmedia', sub, modo, N, A: a.A, cm2: a.cm2, B1, B2, dt };
      return cerrar(rng, semilla, { correcta: eps, errores, texto: x => txt(x, 'V'), unidad: 'V', variables, enunciado, pregunta, solucion, datos });
    }
    const modo = rng.elegir([90, 180]);
    const B = rng.elegir([0.1, 0.2, 0.25, 0.4, 0.5, 0.8, 1]);
    const k = modo === 180 ? 2 : 1, eps = N * k * B * a.A / dt;
    enunciado = [...intro, 'está en un campo magnético uniforme de ', c('B', `${num(B)} T`), ', perpendicular al plano de las espiras. En ', c('t', `${ms} ms`),
      modo === 90 ? ' gira un cuarto de vuelta, hasta que su plano queda paralelo al campo.' : ' gira media vuelta.'];
    errores = [
      modo === 90
        ? h('IN-doble', 2 * eps, 'Tomaste el cambio de flujo como 2·B·A. Con el plano paralelo al campo, el flujo final es cero: cambia B·A.')
        : ta('IN-sin-invertir', eps / 2, 'Tomaste el cambio de flujo como B·A. Tras media vuelta las líneas entran por la otra cara: el flujo pasa de +B·A a −B·A y cambia 2·B·A.'),
      h('IN-sin-N', eps / N, `Calculaste la fem de una sola espira. Las ${N} espiras suman sus fem.`),
      h('IN-max-por-media', eps * PI / 2, 'Calculaste la fem máxima, N·B·A·ω, con la rapidez angular de ese giro. Se pide la fem media: el cambio de flujo dividido entre el tiempo, N·|ΔΦ|/Δt.'),
      ...(modo === 180 ? [pa('MG10-final', N * B * a.A / dt, 'Usaste solo el valor del flujo final (B·A) y no su cambio. Al final las líneas entran por la otra cara: de +B·A a −B·A, el cambio es 2·B·A.')] : []),
    ];
    solucion = [
      ...pasoA(a),
      [modo === 90 ? 'El flujo por espira pasa de B·A a 0: |ΔΦ| = ' : 'El flujo por espira pasa de +B·A a −B·A: |ΔΦ| = 2·', c('B', 'B'), '·', c('A', 'A'), ` = ${k === 2 ? '2 · ' : ''}${num(B)} · ${num(a.A)} = ${num(k * B * a.A)} Wb.`],
      [c('x', 'ε'), ' = N·|ΔΦ|/', c('t', 'Δt'), ` = ${N} · ${num(k * B * a.A)} / ${num(dt)} = `, c('x', `${num(eps)} V`), '.'],
    ];
    datos = { tipo: 'femmedia', sub, modo, N, A: a.A, cm2: a.cm2, B, dt };
    return cerrar(rng, semilla, { correcta: eps, errores, texto: x => txt(x, 'V'), unidad: 'V', variables, enunciado, pregunta, solucion, datos });
  }

  return { id: ID, generar };
});
