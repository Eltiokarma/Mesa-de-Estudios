/*
 * Generador «La carga que gira en el imán»: cargas y corrientes en un campo magnético uniforme
 * (unidad fisica.magnetismo). Formato "predicciones" (docs/arquitectura.md). Funciona en el navegador
 * (window.Generadores['carga-en-campo']) y en Node (require). No usa ningún motor.
 *
 * Tipos y subtipos:
 *   radio/radio        carga que entra perpendicular al campo: r = m·v/(|q|·B), en cm
 *   radio/cociente     dos iones iguales con distinta rapidez (r crece con v) o distinta energía
 *                      cinética (r crece con √K): la razón r₂/r₁
 *   periodo/periodo    T = 2π·m/(|q|·B), que no depende de la rapidez
 *   periodo/masa       la masa de una partícula que da n vueltas en un tiempo dado: f = n/t
 *   periodo/cambio     el periodo cuando se cambia la rapidez (no cambia) o el campo (T ∝ 1/B)
 *   helice/radio       velocidad oblicua al campo: hélice de radio m·v⊥/(|q|·B) (respuesta de texto:
 *                      forma de la trayectoria y radio)
 *   helice/paso        el paso de la hélice: v∥·T
 *   potencial/radio    la carga se acelera desde el reposo con una diferencia de potencial V
 *                      (|q|·V = ½·m·v²) y luego gira: el radio
 *   potencial/voltaje  la diferencia de potencial que da un radio pedido
 *   cruzados/campo     campos E y B cruzados que dejan pasar la carga sin desviarse: E = v·B
 *   cruzados/rapidez   la rapidez que pasa sin desviarse entre placas con ΔV y separación d: v = ΔV/(d·B)
 *   riel/fuerza        barra sobre rieles con una batería: I = ε/R y la fuerza que la mantiene quieta, B·I·L
 *   riel/aceleracion   la aceleración inicial de la barra suelta: B·I·L/m
 *   espira/voltaje     el voltaje que hay que aplicar a una espira para un campo dado en su centro:
 *                      B = µ0·I/(2R) con I = V/R_alambre
 *   espira/campo       el campo en el centro con un voltaje dado
 *
 * Convenciones: SI; los datos de cada partícula (masa y carga) se dan en el enunciado; µ0 = 4π × 10⁻⁷ T·m/A;
 * sen 37° = 3/5, sen 53° = 4/5. Números con tres cifras significativas y coma decimal; fuera de
 * 0,01 a 100 000 se escriben en notación científica. Los periodos y los pasos salen como múltiplos de π.
 * Distractores: entre 1/20 y 20 veces la correcta, salvo las trampas de unidades (los mT tomados como T,
 * los cm como m), que llegan a 1000 veces (decisión de Gerson, 12 nov 2026; P.enEscala).
 * Errores: U2 (mT pasado entre 100, mT como T, cm como m), U7, PR1 a PR7 (hipótesis, docs/investigacion/fisica-calculo-transversal-ideas-erroneas.md);
 * MG3 (parcial, docs/investigacion/electromagnetismo-moderna-ideas-erroneas.md); las trampas de los
 * solucionarios de San Marcos (docs/clasificacion/trampas-admision-unmsm/fisica.md, hipótesis): radio
 * inversamente proporcional a la rapidez, rapidez total en la hélice, olvidar Ohm en el riel, fórmula del
 * hilo en la espira; los demás, hipótesis nuestras con prefijo MG-.
 */
(function (root, fabrica) {
  const nodo = typeof module === 'object' && module.exports;
  const api = fabrica(nodo ? require('../../nucleo/azar.js') : root.Azar,
                      nodo ? require('../../nucleo/predicciones.js') : root.Predicciones);
  if (nodo) module.exports = api;
  else (root.Generadores = root.Generadores || {})[api.id] = api;
})(typeof self !== 'undefined' ? self : this, function (Azar, P) {
  'use strict';
  const ID = 'carga-en-campo';
  const TR = 'docs/investigacion/fisica-calculo-transversal-ideas-erroneas.md';
  const EM = 'docs/investigacion/electromagnetismo-moderna-ideas-erroneas.md';
  const TRA = 'docs/clasificacion/trampas-admision-unmsm/fisica.md';
  const h = (id, valor, explicacion, fuente = null) => ({ id, valor, explicacion, respaldo: 'hipotesis', fuente });
  const tr = (id, valor, explicacion) => h(id, valor, explicacion, TR);
  const ta = (id, valor, explicacion) => h(id, valor, explicacion, TRA);
  const c = P.v;
  const PI = Math.PI;
  const MU0 = 4 * PI * 1e-7;

  // ---------- Números ----------
  const SUP = { '-': '⁻', 0: '⁰', 1: '¹', 2: '²', 3: '³', 4: '⁴', 5: '⁵', 6: '⁶', 7: '⁷', 8: '⁸', 9: '⁹' };
  const pot = e => '10' + String(e).split('').map(d => SUP[d]).join('');
  function me(x) { // mantisa en [1, 10) y exponente
    const a = Math.abs(x);
    let e = Math.floor(Math.log10(a)), m = Math.round(a / 10 ** e * 1e9) / 1e9;
    if (m >= 10) { m /= 10; e++; }
    if (m < 1) { m *= 10; e--; }
    return [Math.sign(x) * m, e];
  }
  // Limpio: a lo más tres cifras significativas.
  const limpio = x => Number.isFinite(x) && x !== 0 && (m => Math.abs(m * 100 - Math.round(m * 100)) < 1e-6)(me(x)[0]);
  function num(x) {
    if (x === 0) return '0';
    let [m, e] = me(x), mr = Math.round(m * 100) / 100;
    if (Math.abs(mr) >= 10) { mr /= 10; e++; }
    if (e >= -2 && e <= 4) return P.formatear(mr * 10 ** e, Math.max(0, 2 - e));
    return `${P.formatear(mr, 2)} × ${pot(e)}`;
  }
  function textoPi(k) { // k·π
    const t = num(k), i = t.indexOf(' × ');
    const a = i < 0 ? t : t.slice(0, i), resto = i < 0 ? '' : t.slice(i);
    return (a === '1' ? '' : a === '−1' ? '−' : a) + 'π' + resto;
  }
  // El valor con su unidad; si es un múltiplo limpio de π, se escribe así («π × 10⁻⁷ s»).
  const txt = (x, u) => ((!limpio(x) && limpio(x / PI)) ? textoPi(x / PI) : num(x)) + (u ? ' ' + u : '');
  const exacto = x => limpio(x) || limpio(x / PI);
  // Razón: fracción si sale con denominador chico; si no, raíz simplificada.
  function razon(x) {
    for (let q = 1; q <= 100; q++) { const p = x * q; if (Math.abs(p - Math.round(p)) < 1e-9) return q === 1 ? String(Math.round(p)) : `${Math.round(p)}/${q}`; }
    return P.radical(x);
  }

  // ---------- Partículas (los datos van en el enunciado) ----------
  const PARTS = {
    proton: { id: 'proton', Un: 'Un protón', el: 'el protón', m: 1.6e-27, q: 1.6e-19, signo: '' },
    electron: { id: 'electron', Un: 'Un electrón', el: 'el electrón', m: 9.1e-31, q: 1.6e-19, signo: '−' },
    alfa: { id: 'alfa', Un: 'Una partícula alfa', el: 'la partícula alfa', m: 6.4e-27, q: 3.2e-19, signo: '' },
    deuteron: { id: 'deuteron', Un: 'Un deuterón', el: 'el deuterón', m: 3.2e-27, q: 1.6e-19, signo: '' },
  };
  const descr = p => `${p.Un} (masa ${num(p.m)} kg y carga ${p.signo}${num(p.q)} C)`;
  // conMT: true (mitad y mitad), false (solo teslas) o 'mT' (solo militeslas).
  function campoB(rng, conMT = true) {
    if (conMT === 'mT' || (conMT && rng.moneda())) {
      const mT = rng.elegir([2, 4, 5, 8, 10, 20, 25, 40, 50, 80, 100, 200, 250, 400, 500]);
      return { B: mT / 1000, mT: true, texto: `${num(mT)} mT` };
    }
    const B = rng.elegir([0.1, 0.2, 0.25, 0.4, 0.5, 0.8, 1, 2]);
    return { B, mT: false, texto: `${num(B)} T` };
  }
  // Para el electrón (9,1 × 10⁻³¹ kg), campos y rapideces que dan radios limpios.
  function datosElectron(rng) {
    const mT = rng.elegir([0.91, 1.82, 4.55, 9.1, 18.2]);
    return { b: { B: mT / 1000, mT: true, texto: `${num(mT)} mT` }, v: rng.elegir([0.8, 1.6, 3.2, 4.8, 8]) * 10 ** rng.elegir([6, 7]) };
  }
  const rapidez = (rng, exps) => rng.elegir([1, 1.5, 2, 2.5, 3, 4, 5, 6, 8]) * 10 ** rng.elegir(exps);
  const pasoMT = b => (b.mT ? [['El campo en teslas: ', c('B', `${b.texto} = ${num(b.B)} T`), '.']] : []);
  // Trampa de unidades (2027-I #84): los mT tomados como T, un factor 1000. Va como distractor U2 (P.enEscala la deja pasar).
  const mTcomoT = (b, valor, que, f) => (b.mT ? [tr('U2-mT', valor * f, `Pusiste ${b.texto} como si fueran ${num(b.B * 1000)} T. Mili es una milésima: ${b.texto} = ${num(b.B)} T. Con el campo mil veces más grande, ${que} sale mil veces ${f < 1 ? 'más chico' : 'más grande'}.`)] : []);

  // ---------- Armado ----------
  function generar(semilla) {
    const rng = Azar.crear(ID + '|' + semilla);
    const [tipo, sub] = rng.elegir([
      ['radio', 'radio'], ['radio', 'radio'], ['radio', 'cociente'], ['radio', 'cociente'],
      ['periodo', 'periodo'], ['periodo', 'periodo'], ['periodo', 'masa'], ['periodo', 'cambio'],
      ['helice', 'radio'], ['helice', 'radio'], ['helice', 'paso'],
      ['potencial', 'radio'], ['potencial', 'voltaje'], ['potencial', 'voltaje'],
      ['cruzados', 'campo'], ['cruzados', 'campo'], ['cruzados', 'rapidez'],
      ['riel', 'fuerza'], ['riel', 'fuerza'], ['riel', 'aceleracion'],
      ['espira', 'voltaje'], ['espira', 'voltaje'], ['espira', 'campo']]);
    for (let intento = 0; intento < 5000; intento++) {
      const pr = construir(rng, semilla, tipo, sub);
      if (pr && pr.alternativas.length >= 4) return pr;
    }
    throw new Error('No se pudo generar un problema con 4 alternativas distintas');
  }

  function construir(rng, semilla, tipo, sub) {
    if (tipo === 'radio') return sub === 'radio' ? radioSimple(rng, semilla) : cociente(rng, semilla);
    if (tipo === 'periodo') return sub === 'periodo' ? periodo(rng, semilla) : sub === 'masa' ? masa(rng, semilla) : cambio(rng, semilla);
    if (tipo === 'helice') return sub === 'radio' ? heliceRadio(rng, semilla) : helicePaso(rng, semilla);
    if (tipo === 'potencial') return potencial(rng, semilla, sub);
    if (tipo === 'cruzados') return sub === 'campo' ? cruzadosCampo(rng, semilla) : cruzadosRapidez(rng, semilla);
    if (tipo === 'riel') return riel(rng, semilla, sub);
    return espira(rng, semilla, sub);
  }

  function cerrar(rng, semilla, o) {
    if (!exacto(o.correcta)) return null;
    // Sin distractores absurdos: de 1/20 a 20 veces la correcta.
    // Las trampas de unidades (U1–U8, como los mT tomados como T) llegan a 1000 veces (P.enEscala).
    const errores = o.errores.filter(e => Number.isFinite(e.valor) && e.valor > 0 && P.enEscala(e.valor, o.correcta, e.id));
    // Formato parejo: si unas opciones salen como múltiplos de π y otras no, todas van en decimales.
    let texto = o.texto, solucion = o.solucion;
    if (texto !== razon) {
      const dec = x => num(x) + (o.unidad ? ' ' + o.unidad : '');
      const conPi = x => !limpio(x) && limpio(x / PI);
      const vistos = new Set([texto(o.correcta)]), vals = [o.correcta];
      for (const e of errores) { if (vals.length >= 5) break; const t = texto(e.valor); if (!vistos.has(t)) { vistos.add(t); vals.push(e.valor); } }
      if (vals.some(conPi) && !vals.every(conPi)) {
        texto = dec;
        if (conPi(o.correcta)) solucion = [...solucion, ['En decimales: ', c('x', dec(o.correcta)), '.']];
      }
    }
    const alternativas = P.armar({ correcta: o.correcta, errores, rng, texto });
    return {
      id: `${ID}#${semilla}`, variables: o.variables, enunciado: o.enunciado, pregunta: o.pregunta, datos: '',
      alternativas, solucion, respuesta: { valor: o.correcta, unidad: o.unidad }, _datos: o.datos,
    };
  }

  // ---- radio/radio ----
  function radioSimple(rng, semilla) {
    const p = PARTS[rng.elegir(['proton', 'proton', 'electron', 'alfa', 'deuteron'])];
    const { b, v } = p.id === 'electron' ? datosElectron(rng) : { b: campoB(rng), v: rapidez(rng, [5, 6]) };
    const r = p.m * v / (p.q * b.B), rc = r * 100;
    if (!limpio(rc) || rc < 0.5 || rc > 500) return null;
    const variables = { v: { nombre: 'rapidez', color: 'o' }, B: { nombre: 'campo magnético', color: 'i' }, x: { nombre: 'radio', color: 'd' } };
    const enunciado = [`${descr(p)} entra con una rapidez de `, c('v', `${num(v)} m/s`), ' a una región con un campo magnético uniforme de ', c('B', b.texto), ', perpendicular a su velocidad.'];
    const pregunta = ['¿Cuál es el ', c('x', 'radio'), ' de la circunferencia que describe?'];
    const errores = [
      tr('PR3-medio', rc / 2, 'Pusiste un ½ como en la energía cinética. La fuerza centrípeta es m·v²/r, sin ½: r = m·v/(|q|·B).'),
      h('MG-diametro', 2 * rc, 'Ese es el diámetro: la distancia entre el punto donde entra y el punto donde está después de media vuelta. El radio es m·v/(|q|·B), la mitad.'),
      h('MG-perimetro', 2 * PI * rc, 'Multiplicaste por 2π: eso es la longitud de la circunferencia, 2π·r. El radio es solo m·v/(|q|·B).'),
      ...mTcomoT(b, rc, 'el radio', 1 / 1000),
    ];
    const solucion = [
      ['La fuerza magnética, |q|·', c('v', 'v'), '·', c('B', 'B'), ', es la fuerza centrípeta: |q|·v·B = m·v²/r, así que ', c('x', 'r'), ' = m·', c('v', 'v'), '/(|q|·', c('B', 'B'), ').'],
      ...pasoMT(b),
      [c('x', 'r'), ` = (${num(p.m)} · ${num(v)}) / (${num(p.q)} · ${num(b.B)}) = ${num(r)} m = `, c('x', `${num(rc)} cm`), '.'],
    ];
    return cerrar(rng, semilla, { correcta: rc, errores, texto: x => txt(x, 'cm'), unidad: 'cm', variables, enunciado, pregunta, solucion,
      datos: { tipo: 'radio', sub: 'radio', particula: p.id, m: p.m, q: p.q, v, B: b.B, mT: b.mT } });
  }

  // ---- radio/cociente ----
  function cociente(rng, semilla) {
    const modo = rng.elegir(['v', 'v', 'K']);
    const ion = rng.elegir(['Dos iones idénticos', 'Dos protones', 'Dos iones de litio iguales']);
    const variables = { a: { nombre: modo === 'v' ? 'rapidez del primero' : 'energía del primero', color: 'o' }, b: { nombre: modo === 'v' ? 'rapidez del segundo' : 'energía del segundo', color: 'i' }, x: { nombre: 'razón de radios', color: 'd' } };
    const pregunta = ['¿Cuánto vale la ', c('x', 'razón r₂/r₁'), ' entre el radio de la trayectoria del segundo y el del primero?'];
    let correcta, errores, enunciado, solucion, datos;
    if (modo === 'v') {
      const [a, b] = rng.elegir([[1, 2], [1, 3], [2, 3], [2, 5], [1, 4], [3, 4], [2, 1], [3, 1], [3, 2], [4, 3], [5, 2], [4, 1]]);
      const e = rng.elegir([5, 6]), v1 = a * 10 ** e, v2 = b * 10 ** e;
      correcta = b / a;
      enunciado = [`${ion} entran a un espectrómetro de masas, perpendiculares al mismo campo magnético uniforme. El primero entra a `, c('a', `${num(v1)} m/s`), ' y el segundo a ', c('b', `${num(v2)} m/s`), '.'];
      errores = [
        ta('MG-radio-inverso', a / b, 'Hiciste el radio inversamente proporcional a la rapidez. Es al revés: r = m·v/(|q|·B), así que el más rápido gira en una circunferencia más grande.'),
        h('MG-radio-no-depende', 1, 'Lo que no depende de la rapidez es el periodo, no el radio. Con r = m·v/(|q|·B), el radio crece en la misma proporción que v.'),
        tr('PR1-cuadrado', (b / a) ** 2, 'Elevaste al cuadrado la razón de rapideces. El radio es proporcional a v, no a v².'),
        tr('PR2-raiz', Math.sqrt(b / a), 'Sacaste raíz a la razón de rapideces. El radio es proporcional a v: la razón de radios es la misma que la de rapideces.'),
      ];
      solucion = [
        ['Con la misma masa, la misma carga y el mismo campo, r = m·v/(|q|·B) es proporcional a v.'],
        [c('x', 'r₂/r₁'), ' = ', c('b', 'v₂'), '/', c('a', 'v₁'), ` = ${num(v2)}/${num(v1)} = `, c('x', razon(correcta)), '.'],
      ];
      datos = { tipo: 'radio', sub: 'cociente', modo, v1, v2 };
    } else {
      const [K1, K2] = rng.elegir([[1, 4], [1, 9], [4, 1], [2, 8], [1, 16], [4, 9], [9, 4], [3, 12], [2, 18], [4, 25], [9, 1], [8, 2]]);
      correcta = Math.sqrt(K2 / K1);
      enunciado = [`${ion} entran a un espectrómetro de masas, perpendiculares al mismo campo magnético uniforme. El primero tiene una energía cinética de `, c('a', `${K1} keV`), ' y el segundo, de ', c('b', `${K2} keV`), '.'];
      errores = [
        tr('PR2-raiz', K2 / K1, 'Tomaste el radio proporcional a la energía cinética. Como K = ½·m·v², la rapidez crece con la raíz de K, y el radio también: r = √(2·m·K)/(|q|·B).'),
        ta('MG-radio-inverso', Math.sqrt(K1 / K2), 'Invertiste la razón. El que tiene más energía va más rápido y gira en una circunferencia más grande.'),
        h('MG-radio-no-depende', 1, 'El radio sí depende de la energía: más energía, más rapidez y más radio. Lo que no depende de la rapidez es el periodo.'),
        tr('PR1-cuadrado', (K2 / K1) ** 2, 'Elevaste al cuadrado la razón de energías. Va al revés: el radio crece con la raíz de K.'),
        tr('PR2-raiz-inverso', K1 / K2, 'Invertiste la razón y te faltó la raíz: r crece con √K.'),
      ];
      solucion = [
        ['Con K = ½·m·v², la rapidez es v = √(2K/m), y r = m·v/(|q|·B) = √(2·m·K)/(|q|·B): el radio es proporcional a √K.'],
        [c('x', 'r₂/r₁'), ' = √(', c('b', `${K2}`), '/', c('a', `${K1}`), ') = ', c('x', razon(correcta)), '.'],
      ];
      datos = { tipo: 'radio', sub: 'cociente', modo, K1, K2 };
    }
    return cerrar(rng, semilla, { correcta, errores, texto: razon, unidad: '', variables, enunciado, pregunta, solucion, datos });
  }

  // ---- periodo/periodo ----
  function periodo(rng, semilla) {
    const p = PARTS[rng.elegir(['proton', 'proton', 'alfa', 'deuteron'])];
    const b = campoB(rng), v = rapidez(rng, [5, 6]);
    const T = 2 * PI * p.m / (p.q * b.B);
    const variables = { v: { nombre: 'rapidez', color: 'o' }, B: { nombre: 'campo magnético', color: 'i' }, x: { nombre: 'periodo', color: 'd' } };
    const enunciado = [`${descr(p)} entra con una rapidez de `, c('v', `${num(v)} m/s`), ' a una región con un campo magnético uniforme de ', c('B', b.texto), ', perpendicular a su velocidad, y describe una circunferencia.'];
    const pregunta = ['¿Cuál es el ', c('x', 'periodo'), ' de ese movimiento?'];
    const errores = [
      tr('U7-sin-2pi', p.m / (p.q * b.B), 'Calculaste m/(|q|·B), que es 1/ω. Una vuelta son 2π rad: T = 2π/ω = 2π·m/(|q|·B).'),
      tr('PR7-medio', PI * p.m / (p.q * b.B), 'Ese es el tiempo de media vuelta, π·m/(|q|·B). El periodo es una vuelta completa: el doble.'),
      h('PR7-doble', 2 * T, 'Te salió el doble: contaste dos veces el 2 de la vuelta. Una vuelta son 2π rad, y T = 2π·m/(|q|·B).'),
      ...mTcomoT(b, T, 'el periodo', 1 / 1000),
    ];
    const solucion = [
      ['De |q|·v·B = m·v²/r sale r = m·v/(|q|·B). Una vuelta mide 2π·r y se recorre con rapidez ', c('v', 'v'), ': T = 2π·r/v = 2π·m/(|q|·', c('B', 'B'), '). La rapidez se simplifica: el periodo no depende de ella.'],
      ...pasoMT(b),
      [c('x', 'T'), ` = 2π · ${num(p.m)} / (${num(p.q)} · ${num(b.B)}) = `, c('x', txt(T, 's')), '.'],
    ];
    return cerrar(rng, semilla, { correcta: T, errores, texto: x => txt(x, 's'), unidad: 's', variables, enunciado, pregunta, solucion,
      datos: { tipo: 'periodo', sub: 'periodo', particula: p.id, m: p.m, q: p.q, v, B: b.B, mT: b.mT } });
  }

  // ---- periodo/masa: de las vueltas en un tiempo ----
  function masa(rng, semilla) {
    const q = rng.elegir([1.6e-19, 1.6e-19, 3.2e-19, 4.8e-19]);
    const b = campoB(rng), n = rng.elegir([5, 10, 20]), k = rng.elegir([1, 2, 4, 5, 8, 10, 20]);
    const t = k * PI * 1e-6; // en s
    const m = q * b.B * t / (2 * PI * n);
    if (!limpio(m) || m < 1e-28 || m > 1e-24) return null;
    const variables = { n: { nombre: 'vueltas', color: 'o' }, t: { nombre: 'tiempo', color: 'h' }, B: { nombre: 'campo magnético', color: 'i' }, x: { nombre: 'masa', color: 'd' } };
    const enunciado = [`Una partícula con carga ${num(q)} C entra perpendicular a un campo magnético uniforme de `, c('B', b.texto), ' y da ', c('n', `${n} vueltas`), ' en ', c('t', `${k === 1 ? '' : k}π µs`), '.'];
    const pregunta = ['¿Cuál es la ', c('x', 'masa'), ' de la partícula?'];
    const errores = [
      tr('U7-f-como-omega', q * b.B * t / n, `Tomaste ${n} vueltas entre el tiempo como si fuera ω, en rad/s. Eso es la frecuencia f, en vueltas por segundo; ω = 2π·f.`),
      tr('PR7-tiempo-total', q * b.B * t / (2 * PI), `Usaste el tiempo de las ${n} vueltas como periodo. El periodo es lo que dura una sola vuelta: T = t/${n}.`),
      h('MG-sin-2', 2 * m, 'Te faltó el 2 de 2π: de T = 2π·m/(|q|·B) sale m = |q|·B·T/(2π), no |q|·B·T/π.'),
    ];
    const solucion = [
      ['El periodo es lo que dura una vuelta: T = ', c('t', `${k === 1 ? '' : k}π × 10⁻⁶ s`), ' / ', c('n', `${n}`), ` = ${txt(t / n, 's')}.`],
      ...pasoMT(b),
      ['De T = 2π·m/(|q|·', c('B', 'B'), '): ', c('x', 'm'), ` = |q|·B·T/(2π) = ${num(q)} · ${num(b.B)} · ${txt(t / n, '')}/(2π) = `, c('x', txt(m, 'kg')), '.'],
    ];
    return cerrar(rng, semilla, { correcta: m, errores, texto: x => txt(x, 'kg'), unidad: 'kg', variables, enunciado, pregunta, solucion,
      datos: { tipo: 'periodo', sub: 'masa', q, B: b.B, mT: b.mT, n, t } });
  }

  // ---- periodo/cambio: si cambia la rapidez o el campo ----
  function cambio(rng, semilla) {
    const p = PARTS[rng.elegir(['proton', 'electron', 'alfa'])];
    const modo = rng.elegir(['v', 'v', 'B']);
    const T0 = rng.elegir([12, 20, 24, 30, 36, 40, 60, 72, 80, 90, 120]);
    const k = rng.elegir([2, 3, 4]);
    const correcta = modo === 'v' ? T0 : T0 / k;
    const veces = { 2: 'el doble', 3: 'el triple', 4: 'el cuádruple' }[k];
    const variables = { T: { nombre: 'periodo inicial', color: 'o' }, k: { nombre: modo === 'v' ? 'cambio de rapidez' : 'cambio de campo', color: 'i' }, x: { nombre: 'periodo nuevo', color: 'd' } };
    const enunciado = [`${p.Un} entra perpendicular a un campo magnético uniforme y describe una circunferencia con un periodo de `, c('T', `${T0} ns`), '.'];
    const pregunta = modo === 'v'
      ? [`Si ${p.el} entrara al mismo campo con `, c('k', `${veces} de rapidez`), ', ¿cuál sería su ', c('x', 'periodo'), '?']
      : [`Si ${p.el} entrara con la misma rapidez a un campo con `, c('k', `${veces} de intensidad`), ', ¿cuál sería su ', c('x', 'periodo'), '?'];
    const errores = modo === 'v' ? [
      h('MG-periodo-con-v', T0 / k, `Pensaste que, al ir ${k} veces más rápido, da la vuelta en ${k} veces menos tiempo. Pero el radio también crece ${k} veces (r = m·v/(|q|·B)): recorre una circunferencia ${k} veces más larga, y el periodo no cambia.`),
      h('MG-periodo-crece-con-v', T0 * k, 'El periodo no crece con la rapidez. T = 2π·m/(|q|·B): no tiene v.'),
      tr('PR1-periodo-v2', T0 / (k * k), 'Dividiste entre el cuadrado del cambio de rapidez. El periodo no depende de la rapidez: ni de v ni de v².'),
      tr('PR2-periodo-raiz', T0 / Math.sqrt(k), 'Dividiste entre la raíz del cambio. El periodo no depende de la rapidez.'),
    ] : [
      tr('PR4-periodo-B', T0 * k, `Hiciste el periodo directamente proporcional al campo. Con más campo la fuerza es mayor, la trayectoria se curva más y la vuelta dura menos: T = 2π·m/(|q|·B) baja ${k} veces.`),
      h('MG-periodo-no-cambia', T0, 'Con la misma rapidez el periodo sí cambia si cambia el campo: T = 2π·m/(|q|·B) depende de B.'),
      tr('PR1-periodo-B2', T0 / (k * k), 'Dividiste entre el cuadrado. El periodo es inversamente proporcional a B, no a B².'),
      tr('PR2-periodo-raiz', T0 / Math.sqrt(k), 'Dividiste entre la raíz. El periodo es inversamente proporcional a B.'),
    ];
    const solucion = modo === 'v' ? [
      ['T = 2π·m/(|q|·B): depende de la masa, la carga y el campo, pero no de la rapidez. Al ir más rápido, el radio crece en la misma proporción y la vuelta dura lo mismo.'],
      [c('x', 'T'), ' = ', c('x', `${T0} ns`), ', igual que antes.'],
    ] : [
      ['T = 2π·m/(|q|·B) es inversamente proporcional al campo.'],
      [c('x', 'T'), ' = ', c('T', `${T0} ns`), ' / ', c('k', `${k}`), ' = ', c('x', `${num(correcta)} ns`), '.'],
    ];
    return cerrar(rng, semilla, { correcta, errores, texto: x => txt(x, 'ns'), unidad: 'ns', variables, enunciado, pregunta, solucion,
      datos: { tipo: 'periodo', sub: 'cambio', modo, particula: p.id, T0, k } });
  }

  // ---- hélice ----
  const SEN = { 30: 0.5, 37: 0.6, 53: 0.8 };
  const AYUDA = { 30: 'Usa sen 30° = 1/2 y cos 30° = √3/2.', 37: 'Usa sen 37° = 3/5 y cos 37° = 4/5.', 53: 'Usa sen 53° = 4/5 y cos 53° = 3/5.', 60: 'Usa sen 60° = √3/2 y cos 60° = 1/2.' };
  const COS = { 37: 0.8, 53: 0.6, 60: 0.5 };
  function heliceRadio(rng, semilla) {
    const p = PARTS[rng.elegir(['proton', 'proton', 'alfa', 'deuteron', 'electron'])];
    const th = rng.elegir([30, 37, 53]);
    const { b, v } = p.id === 'electron' ? datosElectron(rng) : { b: campoB(rng), v: rapidez(rng, [5, 6]) };
    const s = SEN[th], cs = th === 30 ? Math.sqrt(3) / 2 : COS[th];
    const r = p.m * v * s / (p.q * b.B) * 100, rTot = r / s, rCos = r / s * cs;
    if (!limpio(r) || !limpio(rTot) || r < 0.5 || rTot > 500) return null;
    const forma = (f, x) => ({ clave: `${f}:${Math.round(x * 1e6) / 1e6}`, texto: `${f === 'helice' ? 'Hélice' : 'Circunferencia'} de ${num(x)} cm de radio` });
    const variables = { v: { nombre: 'rapidez', color: 'o' }, th: { nombre: 'ángulo con el campo', color: 'h' }, B: { nombre: 'campo magnético', color: 'i' }, x: { nombre: 'trayectoria y radio', color: 'd' } };
    const enunciado = [`${descr(p)} entra con una rapidez de `, c('v', `${num(v)} m/s`), ' a una región con un campo magnético uniforme de ', c('B', b.texto), '. Su velocidad forma ', c('th', `${th}°`), ` con el campo. (${AYUDA[th]})`];
    const pregunta = ['¿Qué ', c('x', 'trayectoria'), ' describe y de qué ', c('x', 'radio'), '?'];
    const errores = [
      { id: 'MG-v-total', ...forma('circunferencia', rTot), respaldo: 'hipotesis', fuente: TRA, explicacion: 'Usaste la rapidez total y supusiste una circunferencia. Solo la parte de la velocidad perpendicular al campo hace girar; la parte paralela no siente fuerza y la lleva de avance: es una hélice con v⊥ = v·sen θ.' },
      { id: 'MG-v-total-helice', ...forma('helice', rTot), respaldo: 'hipotesis', fuente: TRA, explicacion: `La forma está bien, pero usaste la rapidez total para el radio. El radio sale de la componente perpendicular al campo: v⊥ = v·sen ${th}°.` },
      { id: 'MG-circulo-oblicuo', ...forma('circunferencia', r), respaldo: 'hipotesis', fuente: TRA, explicacion: 'El radio está bien, pero no es una circunferencia: la componente de la velocidad paralela al campo no siente fuerza y se mantiene, así que la carga avanza a lo largo del campo mientras gira. Es una hélice.' },
      { id: 'MG3-coseno', ...forma('helice', rCos), respaldo: 'hipotesis', fuente: EM, explicacion: `Tomaste la componente paralela al campo (v·cos ${th}°) en vez de la perpendicular. La que hace girar es la perpendicular al campo: v⊥ = v·sen ${th}°.` },
    ];
    const correcta = forma('helice', r);
    const alternativas = P.armarTexto({ correcta, errores, rng });
    const solucion = [
      ['Se descompone la velocidad: la parte paralela al campo, ', c('v', 'v'), `·cos ${th}°, no siente fuerza y se mantiene; la perpendicular, `, c('v', 'v⊥'), ' = v·sen ', c('th', `${th}°`), ` = ${num(v * s)} m/s, hace girar.`],
      ['Gira y avanza a la vez: la trayectoria es una hélice.'],
      ...pasoMT(b),
      [c('x', 'r'), ' = m·', c('v', 'v⊥'), '/(|q|·', c('B', 'B'), `) = ${num(p.m)} · ${num(v * s)} / (${num(p.q)} · ${num(b.B)}) = ${num(r / 100)} m = `, c('x', `${num(r)} cm`), '.'],
    ];
    return {
      id: `${ID}#${semilla}`, variables, enunciado, pregunta, datos: '', alternativas, solucion,
      respuesta: { valor: correcta.clave, unidad: 'cm' },
      _datos: { tipo: 'helice', sub: 'radio', particula: p.id, m: p.m, q: p.q, v, B: b.B, mT: b.mT, angulo: th },
    };
  }

  function helicePaso(rng, semilla) {
    const p = PARTS[rng.elegir(['proton', 'proton', 'alfa', 'deuteron'])];
    const th = rng.elegir([37, 53, 60]);
    const b = campoB(rng), v = rapidez(rng, [5, 6]);
    const cs = COS[th], s = th === 60 ? Math.sqrt(3) / 2 : SEN[th];
    const T = 2 * PI * p.m / (p.q * b.B), paso = v * cs * T * 100;
    if (!exacto(paso) || paso < 0.5 || paso / PI > 500) return null;
    const variables = { v: { nombre: 'rapidez', color: 'o' }, th: { nombre: 'ángulo con el campo', color: 'h' }, B: { nombre: 'campo magnético', color: 'i' }, x: { nombre: 'paso de la hélice', color: 'd' } };
    const enunciado = [`${descr(p)} entra con una rapidez de `, c('v', `${num(v)} m/s`), ' a una región con un campo magnético uniforme de ', c('B', b.texto), '. Su velocidad forma ', c('th', `${th}°`), ' con el campo, y describe una hélice. (', AYUDA[th], ')'];
    const pregunta = ['¿Cuál es el ', c('x', 'paso'), ' de la hélice, la distancia que avanza a lo largo del campo en cada vuelta?'];
    const errores = [
      h('MG3-seno', v * s * T * 100, `Usaste la componente perpendicular (v·sen ${th}°) para el avance. A lo largo del campo avanza con la componente paralela: v∥ = v·cos ${th}°.`, EM),
      ta('MG-v-total', v * T * 100, 'Usaste la rapidez total. Lo que avanza a lo largo del campo en una vuelta sale de la componente paralela: paso = v∥·T.'),
      tr('PR7-medio', v * cs * T * 50, 'Usaste el tiempo de media vuelta. El paso es lo que avanza en una vuelta completa: T = 2π·m/(|q|·B).'),
      h('MG-paso-perimetro', 2 * PI * p.m * v * s / (p.q * b.B) * 100, 'Calculaste la longitud de la circunferencia que se ve de frente, 2π·r. El paso es otra cosa: lo que avanza a lo largo del campo en una vuelta, v∥·T.'),
    ];
    const solucion = [
      ['La componente paralela al campo no cambia: ', c('v', 'v∥'), ' = v·cos ', c('th', `${th}°`), ` = ${num(v * cs)} m/s. La perpendicular hace girar.`],
      ...pasoMT(b),
      ['Una vuelta dura T = 2π·m/(|q|·', c('B', 'B'), `) = 2π · ${num(p.m)} / (${num(p.q)} · ${num(b.B)}) = ${txt(T, 's')} (no depende de la rapidez).`],
      [c('x', 'Paso'), ' = ', c('v', 'v∥'), `·T = ${num(v * cs)} · ${txt(T, 's')} = ${txt(paso / 100, 'm')} = `, c('x', txt(paso, 'cm')), '.'],
    ];
    return cerrar(rng, semilla, { correcta: paso, errores, texto: x => txt(x, 'cm'), unidad: 'cm', variables, enunciado, pregunta, solucion,
      datos: { tipo: 'helice', sub: 'paso', particula: p.id, m: p.m, q: p.q, v, B: b.B, mT: b.mT, angulo: th } });
  }

  // ---- potencial: se acelera con V y luego gira ----
  function potencial(rng, semilla, sub) {
    const p = PARTS[rng.elegir(['proton', 'deuteron', 'deuteron', 'alfa'])];
    const b = campoB(rng);
    const v = rng.elegir([1, 2, 3, 4, 5, 6, 8]) * 10 ** rng.elegir([5, 6]);
    const V = p.m * v * v / (2 * p.q), r = p.m * v / (p.q * b.B), rc = r * 100;
    if (!limpio(V) || !limpio(rc) || V < 10 || V > 1e6 || rc < 1 || rc > 300) return null;
    const variables = { V: { nombre: 'diferencia de potencial', color: 'o' }, B: { nombre: 'campo magnético', color: 'i' }, r: { nombre: 'radio', color: 'h' }, x: { nombre: 'lo que se pide', color: 'd' } };
    const intro = `${descr(p)} parte del reposo y se acelera con una diferencia de potencial`;
    const solV = ['Lo que gana en energía cinética es el trabajo del campo eléctrico: |q|·', c('V', 'V'), ' = ½·m·v².'];
    if (sub === 'radio') {
      const enunciado = [`${intro} de `, c('V', `${num(V)} V`), '. Luego entra perpendicular a un campo magnético uniforme de ', c('B', b.texto), '.'];
      const pregunta = ['¿Cuál es el ', c('x', 'radio'), ' de la circunferencia que describe en el campo magnético?'];
      const errores = [
        tr('PR3-sin-medio', rc / Math.SQRT2, 'Olvidaste el ½ de la energía cinética: con |q|·V = m·v², la rapidez sale √2 veces menor. Es |q|·V = ½·m·v².'),
        tr('PR3-doble-medio', rc * Math.SQRT2, 'Pusiste el ½ al otro lado: |q|·V = ½·m·v² da v = √(2|q|V/m), no √(4|q|V/m).'),
        h('MG-diametro', 2 * rc, 'Ese es el diámetro, la distancia a la que sale después de media vuelta. El radio es la mitad: m·v/(|q|·B).'),
      ];
      const solucion = [solV,
        ['v = √(2|q|V/m) = √(2 · ', `${num(p.q)} · `, c('V', num(V)), ` / ${num(p.m)}) = ${num(v)} m/s.`],
        ...pasoMT(b),
        [c('x', 'r'), ' = m·v/(|q|·', c('B', 'B'), `) = ${num(p.m)} · ${num(v)} / (${num(p.q)} · ${num(b.B)}) = ${num(r)} m = `, c('x', `${num(rc)} cm`), '.'],
      ];
      return cerrar(rng, semilla, { correcta: rc, errores, texto: x => txt(x, 'cm'), unidad: 'cm', variables, enunciado, pregunta, solucion,
        datos: { tipo: 'potencial', sub, particula: p.id, m: p.m, q: p.q, V, B: b.B, mT: b.mT } });
    }
    const diam = rng.moneda(); // en el espectrómetro se mide dónde choca: a 2r de la rendija
    const enunciado = diam
      ? [`${intro}. Luego entra por una rendija, perpendicular a un campo magnético uniforme de `, c('B', b.texto), ', da media vuelta y choca con la placa a ', c('r', `${num(2 * rc)} cm`), ' de la rendija.']
      : [`${intro}. Luego entra perpendicular a un campo magnético uniforme de `, c('B', b.texto), ' y describe una circunferencia de ', c('r', `${num(rc)} cm`), ' de radio.'];
    const pregunta = ['¿Qué ', c('x', 'diferencia de potencial'), ` ${p.Un.startsWith('Una') ? 'la' : 'lo'} aceleró?`];
    const errores = [
      ...(diam ? [tr('PR6-diametro', 4 * V, 'Usaste la distancia a la rendija como radio. Después de media vuelta la carga choca a un diámetro de la rendija: el radio es la mitad. Como r va al cuadrado, el error es de 4 veces.')] : []),
      tr('PR1-B-sin-cuadrado', V / b.B, 'Te faltó elevar el campo al cuadrado. V = |q|·B²·r²/(2m): r y B van al cuadrado.'),
      tr('PR3-sin-medio', 2 * V, 'Olvidaste el ½ de la energía cinética: |q|·V = ½·m·v², no m·v². Por eso te sale el doble.'),
      tr('PR3-doble-medio', V / 2, 'Pusiste el ½ dos veces. Es |q|·V = ½·m·v², con v = |q|·B·r/m.'),
      tr('PR1-sin-cuadrado', V / r, 'Te faltó elevar el radio al cuadrado. V = |q|·B²·r²/(2m): r y B van al cuadrado.'),
    ];
    const solucion = [
      ...(diam ? [['Choca después de media vuelta: la distancia a la rendija es el diámetro. ', c('r', `r = ${num(2 * rc)}/2 = ${num(rc)} cm`), '.']] : []),
      ['En el campo magnético, r = m·v/(|q|·B), así que la rapidez es v = |q|·', c('B', 'B'), '·', c('r', 'r'), '/m.'],
      ...pasoMT(b),
      [`v = ${num(p.q)} · ${num(b.B)} · ${num(r)} / ${num(p.m)} = ${num(v)} m/s.`],
      solV,
      [c('x', 'V'), ` = m·v²/(2|q|) = ${num(p.m)} · (${num(v)})² / (2 · ${num(p.q)}) = `, c('x', `${num(V)} V`), '.'],
    ];
    return cerrar(rng, semilla, { correcta: V, errores, texto: x => txt(x, 'V'), unidad: 'V', variables, enunciado, pregunta, solucion,
      datos: { tipo: 'potencial', sub, particula: p.id, m: p.m, q: p.q, r, diametro: diam, B: b.B, mT: b.mT } });
  }

  // ---- campos cruzados ----
  function cruzadosCampo(rng, semilla) {
    const p = PARTS[rng.elegir(['proton', 'electron', 'alfa', 'deuteron'])];
    const b = campoB(rng, rng.entero(0, 3) < 3 ? 'mT' : false); // casi siempre en mT, como en el examen
    const v = rapidez(rng, [4, 5, 6]);
    const dcm = rng.elegir([5, 8, 10]), d = dcm / 100;
    const pide = rng.elegir(['E', 'E', 'V']);
    const E = v * b.B, dV = E * d;
    const correcta = pide === 'E' ? E : dV;
    if (!limpio(E) || !limpio(dV) || E < 10 || E > 1e7) return null;
    const variables = { v: { nombre: 'rapidez', color: 'o' }, B: { nombre: 'campo magnético', color: 'i' }, d: { nombre: 'separación', color: 'h' }, x: { nombre: pide === 'E' ? 'campo eléctrico' : 'voltaje entre placas', color: 'd' } };
    const enunciado = [`${descr(p)} entra con una rapidez de `, c('v', `${num(v)} m/s`), ' entre dos placas paralelas separadas ', c('d', `${dcm} cm`), ', donde hay un campo magnético uniforme de ', c('B', b.texto), ' perpendicular a su velocidad. Las placas están conectadas a una fuente, que crea entre ellas un campo eléctrico perpendicular a los dos.'];
    const pregunta = pide === 'E'
      ? ['¿Qué ', c('x', 'campo eléctrico'), ` hace falta entre las placas para que ${p.el} pase sin desviarse?`]
      : ['¿Qué ', c('x', 'voltaje'), ` debe dar la fuente para que ${p.el} pase sin desviarse?`];
    const errores = [
      tr('PR3-medio', correcta / 2, 'Pusiste un ½ como en la energía cinética. Aquí se igualan dos fuerzas, |q|·E = |q|·v·B, y no hay ningún ½.'),
      h('MG-doble', 2 * correcta, 'Te salió el doble. Para que no se desvíe, la fuerza eléctrica tiene que ser igual a la magnética, no el doble: E = v·B.'),
      pide === 'E'
        ? h('MG-voltaje-por-campo', dV, 'Multiplicaste por la separación: eso es el voltaje entre las placas, ΔV = E·d. Se pide el campo, E = v·B.')
        : h('MG-campo-como-voltaje', E, 'Ese es el campo eléctrico, en V/m. El voltaje entre las placas es ese campo por la separación: ΔV = E·d.'),
    ];
    const u = pide === 'E' ? 'V/m' : 'V';
    const solucion = [
      ['Para que no se desvíe, la fuerza eléctrica y la magnética deben anularse: |q|·E = |q|·', c('v', 'v'), '·', c('B', 'B'), '. La carga se simplifica: E = v·B, sea cual sea la partícula.'],
      ...pasoMT(b),
      [pide === 'E' ? c('x', 'E') : 'E', ` = ${num(v)} · ${num(b.B)} = `, pide === 'E' ? c('x', `${num(E)} V/m`) : `${num(E)} V/m`, '.'],
      ...(pide === 'V' ? [['Entre placas paralelas, ', c('x', 'ΔV'), ' = E·', c('d', 'd'), ` = ${num(E)} · ${num(d)} = `, c('x', `${num(dV)} V`), '.']] : []),
    ];
    return cerrar(rng, semilla, { correcta, errores, texto: x => txt(x, u), unidad: u, variables, enunciado, pregunta, solucion,
      datos: { tipo: 'cruzados', sub: 'campo', pide, particula: p.id, v, d, B: b.B, mT: b.mT } });
  }

  function cruzadosRapidez(rng, semilla) {
    const b = campoB(rng);
    const dV = rng.elegir([50, 100, 120, 150, 200, 240, 300, 400, 500, 600, 800, 1000]);
    const dcm = rng.elegir([5, 8, 10]), d = dcm / 100;
    const v = dV / (d * b.B);
    if (!limpio(v) || v < 1e3 || v > 1e8) return null;
    const variables = { V: { nombre: 'voltaje entre placas', color: 'o' }, d: { nombre: 'separación', color: 'h' }, B: { nombre: 'campo magnético', color: 'i' }, x: { nombre: 'rapidez', color: 'd' } };
    const enunciado = ['Dos placas paralelas separadas ', c('d', `${dcm} cm`), ' están conectadas a ', c('V', `${dV} V`), '. Entre ellas hay, además, un campo magnético uniforme de ', c('B', b.texto), ', paralelo a las placas y perpendicular al campo eléctrico. Un haz de iones entra paralelo a las placas y perpendicular a los dos campos.'];
    const pregunta = ['¿Con qué ', c('x', 'rapidez'), ' pasan sin desviarse?'];
    const errores = [
      h('MG-voltaje-como-campo', dV / b.B, 'Usaste el voltaje como si fuera el campo eléctrico. Entre placas paralelas, E = ΔV/d: primero se divide entre la separación.'),
      tr('PR3-medio', v / 2, 'Pusiste un ½ como en la energía cinética. Aquí se igualan dos fuerzas, |q|·E = |q|·v·B: v = E/B.'),
      h('MG-doble', 2 * v, 'Te salió el doble. Sin desviarse, la fuerza eléctrica es igual a la magnética: v = E/B.'),
    ];
    const solucion = [
      ['El campo eléctrico entre las placas: E = ', c('V', 'ΔV'), '/', c('d', 'd'), ` = ${dV}/${num(d)} = ${num(dV / d)} V/m.`],
      ...pasoMT(b),
      ['Sin desviarse, |q|·E = |q|·v·B: ', c('x', 'v'), ' = E/', c('B', 'B'), ` = ${num(dV / d)}/${num(b.B)} = `, c('x', `${num(v)} m/s`), '.'],
    ];
    return cerrar(rng, semilla, { correcta: v, errores, texto: x => txt(x, 'm/s'), unidad: 'm/s', variables, enunciado, pregunta, solucion,
      datos: { tipo: 'cruzados', sub: 'rapidez', dV, d, B: b.B, mT: b.mT } });
  }

  // ---- riel: barra con corriente ----
  function riel(rng, semilla, sub) {
    const eps = rng.elegir([3, 6, 9, 12, 18, 24]), R = rng.elegir([1, 2, 3, 4, 6, 8, 12]);
    const Lcm = rng.elegir([10, 20, 25, 40, 50, 80]), L = Lcm / 100;
    const b = rng.moneda() ? { B: rng.elegir([0.2, 0.4, 0.5, 0.6, 0.8]), mT: false } : { B: rng.elegir([100, 200, 250, 400, 500, 600, 800]) / 1000, mT: true };
    b.texto = b.mT ? `${num(b.B * 1000)} mT` : `${num(b.B)} T`;
    const I = eps / R, F = b.B * I * L;
    if (!limpio(I) || !limpio(F)) return null;
    const variables = { e: { nombre: 'fem de la batería', color: 'o' }, R: { nombre: 'resistencia', color: 'h' }, B: { nombre: 'campo magnético', color: 'i' }, x: { nombre: 'lo que se pide', color: 'd' } };
    const base = ['Dos rieles horizontales, separados ', `${Lcm} cm`, ', están unidos por una batería de ', c('e', `${eps} V`), '. Sobre ellos se apoya una barra metálica, perpendicular a los rieles. La resistencia total del circuito es ', c('R', `${R} Ω`), ' y hay un campo magnético vertical uniforme de ', c('B', b.texto), '.'];
    const solI = ['Por la ley de Ohm, la corriente es I = ', c('e', 'ε'), '/', c('R', 'R'), ` = ${eps}/${R} = ${num(I)} A.`];
    const solF = ['La fuerza sobre la barra, perpendicular a ella y al campo: F = ', c('B', 'B'), `·I·L = ${num(b.B)} · ${num(I)} · ${num(L)} = ${num(F)} N.`];
    if (sub === 'fuerza') {
      const pregunta = ['¿Qué ', c('x', 'fuerza horizontal'), ' hay que aplicar a la barra para mantenerla quieta?'];
      const errores = [
        ta('MG-sin-ohm', b.B * eps * L, 'Usaste el voltaje de la batería como si fuera la corriente. Primero se calcula la corriente con la ley de Ohm: I = ε/R.'),
        h('MG-sin-L', F / L, 'Te faltó el largo de la barra. La fuerza sobre el conductor es B·I·L: depende de cuánto mide el tramo dentro del campo.'),
        tr('PR4-ohm', b.B * eps * R * L, 'Multiplicaste la fem por la resistencia. La ley de Ohm dice I = ε/R: más resistencia, menos corriente.'),
        h('MG-mitad', F / 2, 'Dividiste entre 2. La fuerza sobre un tramo recto perpendicular al campo es B·I·L, sin ningún medio.'),
        ...mTcomoT(b, F, 'la fuerza', 1000),
        tr('U2-cm', F * 100, `Usaste el largo en centímetros (${Lcm}) como si fueran metros. En F = B·I·L el largo va en metros: ${Lcm} cm = ${num(L)} m.`),
      ];
      const solucion = [solI, ...pasoMT(b), solF, ['Para que la barra siga quieta hay que aplicar una fuerza igual y opuesta: ', c('x', `${num(F)} N`), '.']];
      return cerrar(rng, semilla, { correcta: F, errores, texto: x => txt(x, 'N'), unidad: 'N', variables, enunciado: base, pregunta, solucion,
        datos: { tipo: 'riel', sub, eps, R, L, B: b.B, mT: b.mT } });
    }
    const mg = rng.elegir([10, 20, 25, 40, 50, 80, 100, 200]), m = mg / 1000;
    const a = F / m;
    if (!limpio(a) || a > 1000 || a < 0.1) return null;
    const enunciado = [...base, ` La barra tiene una masa de ${mg} g y puede deslizar sin rozamiento.`];
    const pregunta = ['Al cerrar el circuito, con la barra en reposo, ¿cuál es su ', c('x', 'aceleración'), '?'];
    const errores = [
      ta('MG-sin-ohm', b.B * eps * L / m, 'Usaste el voltaje de la batería como si fuera la corriente. Primero, I = ε/R.'),
      h('MG-sin-L', a / L, 'Te faltó el largo de la barra. La fuerza es B·I·L, y a = F/m.'),
      h('MG-mitad', a / 2, 'Dividiste entre 2. La fuerza sobre la barra es B·I·L, sin ningún medio, y a = F/m.'),
      tr('PR4-ohm', b.B * eps * R * L / m, 'Multiplicaste la fem por la resistencia. La ley de Ohm dice I = ε/R.'),
    ];
    const solucion = [solI, ...pasoMT(b), solF, ['Por la segunda ley de Newton, con la masa en kilogramos: ', c('x', 'a'), ` = F/m = ${num(F)}/${num(m)} = `, c('x', `${num(a)} m/s²`), '. (Al moverse, la barra induce una fem que reduce la corriente; justo al cerrar el circuito, todavía no.)']];
    return cerrar(rng, semilla, { correcta: a, errores, texto: x => txt(x, 'm/s²'), unidad: 'm/s²', variables, enunciado, pregunta, solucion,
      datos: { tipo: 'riel', sub, eps, R, L, B: b.B, mT: b.mT, m } });
  }

  // ---- espira: campo en el centro y ley de Ohm ----
  function espira(rng, semilla, sub) {
    const Rcm = rng.elegir([5, 10, 15, 20, 25, 30, 40, 50]), R = Rcm / 100;
    const diam = rng.moneda();
    const Ral = rng.elegir([0.2, 0.5, 1, 2, 3, 4, 5]);
    const variables = { R: { nombre: diam ? 'diámetro' : 'radio', color: 'h' }, Ral: { nombre: 'resistencia del alambre', color: 'i' }, x: { nombre: sub === 'voltaje' ? 'voltaje' : 'campo en el centro', color: 'd' } };
    if (sub === 'voltaje') variables.B = { nombre: 'campo en el centro', color: 'o' };
    else variables.V = { nombre: 'voltaje', color: 'o' };
    const tam = diam ? [' de ', c('R', `${2 * Rcm} cm`), ' de diámetro'] : [' de ', c('R', `${Rcm} cm`), ' de radio'];
    const intro = ['Una espira circular', ...tam, ' está hecha con un alambre de ', c('Ral', `${num(Ral)} Ω`), ' de resistencia. (µ0 = 4π × 10⁻⁷ T·m/A.)'];
    const pasoR = diam ? [['El radio es la mitad del diámetro: ', c('R', `R = ${Rcm} cm = ${num(R)} m`), '.']] : [['El radio en metros: ', c('R', `R = ${num(R)} m`), '.']];
    if (sub === 'voltaje') {
      const k = rng.elegir([1, 2, 4, 5, 8]), e = rng.elegir([-6, -5]);
      const B = k * PI * 10 ** e;
      const I = 2 * R * B / MU0, V = I * Ral;
      if (!limpio(V) || !limpio(I) || I < 0.1 || I > 100) return null;
      const enunciado = [...intro, ' Se conectan sus extremos a una fuente.'];
      const pregunta = ['¿Qué ', c('x', 'voltaje'), ' debe dar la fuente para que el campo magnético en el centro de la espira sea ', c('B', txt(B, 'T')), '?'];
      const errores = [
        ta('MG-hilo-en-espira', PI * V, 'Usaste la fórmula del hilo recto largo, µ0·I/(2π·d). En el centro de una espira circular el campo es µ0·I/(2R), sin π en el denominador.'),
        h('MG-espira-sin-2', V / 2, 'Usaste B = µ0·I/R. En el centro de la espira es µ0·I/(2R): la corriente que hace falta es el doble.'),
        ...(diam ? [tr('PR6-diametro', 2 * V, 'Usaste el diámetro como si fuera el radio. En B = µ0·I/(2R), R es el radio: la mitad del diámetro.')] : []),
        tr('PR4-ohm', I / Ral, 'Dividiste la corriente entre la resistencia. La ley de Ohm es V = I·R: se multiplica.'),
      ];
      const solucion = [...pasoR,
        ['En el centro de la espira, ', c('B', 'B'), ' = µ0·I/(2', c('R', 'R'), `). La corriente necesaria: I = 2R·B/µ0 = 2 · ${num(R)} · ${txt(B, '')}/(4π × 10⁻⁷) = ${num(I)} A.`],
        ['Por la ley de Ohm: ', c('x', 'V'), ' = I·', c('Ral', 'R'), ` = ${num(I)} · ${num(Ral)} = `, c('x', `${num(V)} V`), '.'],
      ];
      return cerrar(rng, semilla, { correcta: V, errores, texto: x => txt(x, 'V'), unidad: 'V', variables, enunciado, pregunta, solucion,
        datos: { tipo: 'espira', sub, R, diametro: diam, Ral, B } });
    }
    const V = rng.elegir([0.5, 1, 1.5, 2, 3, 4, 5, 6, 9, 10, 12]);
    const I = V / Ral, B = MU0 * I / (2 * R);
    if (!limpio(I) || !exacto(B) || I > 100) return null;
    const enunciado = [...intro, ' Sus extremos se conectan a una fuente de ', c('V', `${num(V)} V`), '.'];
    const pregunta = ['¿Cuál es el ', c('x', 'campo magnético'), ' en el centro de la espira?'];
    const errores = [
      ta('MG-hilo-en-espira', B / PI, 'Usaste la fórmula del hilo recto largo, µ0·I/(2π·d). En el centro de una espira circular es µ0·I/(2R), sin π en el denominador.'),
      h('MG-espira-sin-2', 2 * B, 'Usaste B = µ0·I/R. En el centro de la espira es µ0·I/(2R).'),
      ...(diam ? [tr('PR6-diametro', B / 2, 'Usaste el diámetro como si fuera el radio. En µ0·I/(2R), R es el radio.')] : []),
      tr('PR4-ohm', MU0 * V * Ral / (2 * R), 'Multiplicaste el voltaje por la resistencia. La ley de Ohm da I = V/R.'),
    ];
    const solucion = [...pasoR,
      ['Por la ley de Ohm, la corriente es I = ', c('V', 'V'), '/', c('Ral', 'R'), ` = ${num(V)}/${num(Ral)} = ${num(I)} A.`],
      ['En el centro de la espira: ', c('x', 'B'), ' = µ0·I/(2', c('R', 'R'), `) = 4π × 10⁻⁷ · ${num(I)} / (2 · ${num(R)}) = `, c('x', txt(B, 'T')), '.'],
    ];
    return cerrar(rng, semilla, { correcta: B, errores, texto: x => txt(x, 'T'), unidad: 'T', variables, enunciado, pregunta, solucion,
      datos: { tipo: 'espira', sub, R, diametro: diam, Ral, V } });
  }

  return { id: ID, generar, _num: num, _txt: txt };
});
