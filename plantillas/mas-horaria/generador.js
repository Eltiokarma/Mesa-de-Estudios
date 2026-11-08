/*
 * Generador «La ecuación del resorte»: la ecuación horaria del MAS y dos osciladores de examen
 * (unidad fisica.oscilaciones). Formato "predicciones" (docs/arquitectura.md). Funciona en el
 * navegador (window.Generadores['mas-horaria']) y en Node (require). No usa ningún motor.
 *
 * Convención (se dice en cada enunciado): x(t) = A·sen(ωt + φ), con x positiva hacia la derecha
 * (hacia donde se estira el resorte), φ entre 0 y 2π y t en s. La velocidad es v = A·ω·cos(ωt + φ).
 *
 * Tipos y subtipos:
 *   leer/k            de la ecuación y la masa, la constante del resorte: k = m·ω².
 *   leer/x0           la posición inicial: x(0) = A·sen φ (no la amplitud).
 *   leer/periodo      con ω = nπ rad/s, el periodo T = 2π/ω.
 *   leer/frecuencia   con ω = nπ rad/s, la frecuencia f = ω/2π.
 *   escribir/extremo  se comprime (o estira) el resorte y se suelta: A y φ = 3π/2 (o π/2); ω de k y m
 *                     o del periodo. Respuesta de texto (armarTexto): «x = 0,05 sen(10t + 3π/2) m».
 *   escribir/centro   pasa por el equilibrio en t = 0 con rapidez dada, hacia la izquierda (φ = π) o
 *                     hacia la derecha (φ = 0): A = v0/ω.
 *   instante/x        la posición en un instante (ángulos múltiplos de π/6; raíces simplificadas).
 *   instante/v        la velocidad en un instante: A·ω·cos(ωt + φ), escrita con π.
 *   media/vm          la velocidad media entre dos instantes: Δx/Δt (no el promedio de velocidades).
 *   media/omega       x = A·sen(ωt) con ω desconocida y la velocidad media hasta que llega por primera
 *                     vez a x = A (o a x = A/2): se despeja ω.
 *   apilado/amplitud  bloque sobre otro bloque unido al resorte, piso liso: el de arriba no resbala
 *                     mientras ω²·A ≤ μs·g, así que A máx = μs·g·(m + M)/k.
 *   apilado/aceleracion  la mayor aceleración sin que resbale: μs·g (no depende de la frecuencia).
 *   flotante/periodo  cilindro que flota y oscila: la fuerza restauradora es el empuje extra,
 *                     k = ρ·g·S; T = 2π·√(m/k).
 *   flotante/masa     la masa del cilindro desde su periodo: m = k/ω².
 *
 * Errores: U7 (frecuencia usada como ω), PR1, PR2, PR3, PR4, PR7 y U3 de
 * docs/investigacion/fisica-calculo-transversal-ideas-erroneas.md (hipótesis). El informe de MAS
 * (docs/investigacion/momento-gravitacion-ondas-ideas-erroneas.md) solo documenta O1 a O4, que son
 * conceptuales (amplitud, masa y largo del péndulo) y no calzan con estas cuentas; los MAS-* son
 * hipótesis nuestras sacadas de la columna TRAMPA de los huecos (fase cero desde el extremo
 * negativo, amplitud como posición inicial, velocidad máxima por velocidad media, la frecuencia en
 * el bloque apilado).
 * Formato: en cada problema todas las alternativas van igual, con π (instante/v, flotante/periodo)
 * o en decimales (media/vm, media/omega), para que la forma no delate a la correcta.
 */
(function (root, fabrica) {
  const nodo = typeof module === 'object' && module.exports;
  const api = fabrica(nodo ? require('../../nucleo/azar.js') : root.Azar,
                      nodo ? require('../../nucleo/predicciones.js') : root.Predicciones);
  if (nodo) module.exports = api;
  else (root.Generadores = root.Generadores || {})[api.id] = api;
})(typeof self !== 'undefined' ? self : this, function (Azar, P) {
  'use strict';
  const UPR = 'docs/investigacion/fisica-calculo-transversal-ideas-erroneas.md';
  const h = (id, valor, explicacion, fuente = null) => ({ id, valor, explicacion, respaldo: 'hipotesis', fuente });
  const u = (id, valor, explicacion) => h(id, valor, explicacion, UPR);
  const f = (x, d = 2) => P.formatear(x, d);
  const v = P.v;
  const PI = Math.PI, G = 10;
  const limpio = (x, dec = 2) => Number.isFinite(x) && Math.abs(x * 10 ** dec - Math.round(x * 10 ** dec)) < 1e-6 && Math.abs(x) < 1e6;
  const CONV = ' Convención: x(t) = A·sen(ωt + φ), con x positiva hacia la derecha.';
  const VAR = { A: { nombre: 'amplitud', color: 'o' }, w: { nombre: 'frecuencia angular', color: 'i' }, ph: { nombre: 'fase inicial', color: 'h' }, x: { nombre: 'lo que se pide', color: 'd' } };

  // ωt escrito como en el examen: «5t», «4πt», «πt/2».
  function wt(w) {
    if (Number.isInteger(w)) return `${w === 1 ? '' : w}t`;
    const q = w / PI;
    for (let d = 1; d <= 12; d++) {
      const n = Math.round(q * d);
      if (Math.abs(q * d - n) < 1e-9) return `${n === 1 ? '' : n}πt${d === 1 ? '' : '/' + d}`;
    }
    return `${f(w)}t`;
  }
  const fase = ph => (Math.abs(ph) < 1e-12 ? '' : ` + ${P.pi(ph)}`);
  // La ecuación con cada parte de su color.
  const ecuacion = (A, w, ph, uA) => ['x = ', v('A', f(A)), ' sen(', v('w', wt(w)), ...(Math.abs(ph) < 1e-12 ? [] : [' + ', v('ph', P.pi(ph))]), `) ${uA}`];
  // Texto de una ecuación (para las alternativas de escribir).
  const ecTexto = (A, w, ph) => `x = ${f(A, 3)} sen(${wt(w)}${fase(ph)}) m`;
  const norm = ph => { let p = ph % (2 * PI); if (p < 0) p += 2 * PI; return Math.abs(p - 2 * PI) < 1e-9 ? 0 : p; };
  const clave = (A, w, ph) => `mas:${+A.toFixed(6)}|${+w.toFixed(6)}|${+(norm(ph) / PI).toFixed(6)}`;
  const ec = (A, w, ph) => ({ clave: clave(A, w, ph), texto: ecTexto(A, w, norm(ph)) });

  // Número con π cuando sale limpio («5π cm/s», «2π√3 cm/s», «−π cm/s»); si no, raíz o decimales.
  function conPi(unidad) {
    return x => {
      if (Math.abs(x) < 1e-12) return `0 ${unidad}`;
      const r = P.radical(x / PI);
      if (!r.includes(',')) {
        const m = r.match(/^(−?)(\d*)(√\d+)?(\/2)?$/);
        if (m) {
          const [, s, a, raiz, med] = m;
          const num = `${s}${a === '1' ? '' : a}π${raiz || ''}`;
          return `${num}${med || ''} ${unidad}`;
        }
      }
      return `${P.radical(x)} ${unidad}`;
    };
  }
  // Seno o coseno exacto de un múltiplo de π/6: «1/2», «−√3/2», «1».
  const trig = x => (Math.abs(Math.abs(x) - 0.5) < 1e-9 ? (x < 0 ? '−' : '') + '1/2' : P.radical(x));

  const TIPOS = [['leer', 'k'], ['leer', 'x0'], ['leer', 'x0'], ['leer', 'periodo'], ['leer', 'frecuencia'],
    ['escribir', 'extremo'], ['escribir', 'extremo'], ['escribir', 'extremo'], ['escribir', 'centro'], ['escribir', 'centro'],
    ['instante', 'x'], ['instante', 'v'], ['media', 'vm'], ['media', 'vm'], ['media', 'omega'], ['media', 'omega'],
    ['apilado', 'amplitud'], ['apilado', 'amplitud'], ['apilado', 'aceleracion'], ['flotante', 'periodo'], ['flotante', 'masa'], ['flotante', 'masa']];

  function generar(semilla) {
    const rng = Azar.crear('mas-horaria|' + semilla);
    const [tipo, sub] = rng.elegir(TIPOS);
    for (let intento = 0; intento < 5000; intento++) {
      const pr = construir(rng, semilla, tipo, sub);
      if (pr && pr.alternativas.length >= 4) return pr;
    }
    throw new Error('No se pudo generar un problema con 4 alternativas distintas');
  }

  function construir(rng, semilla, tipo, sub) {
    if (tipo === 'leer') return leer(rng, semilla, sub);
    if (tipo === 'escribir') return escribir(rng, semilla, sub);
    if (tipo === 'instante') return instante(rng, semilla, sub);
    if (tipo === 'media') return sub === 'vm' ? mediaVm(rng, semilla) : mediaOmega(rng, semilla);
    if (tipo === 'apilado') return apilado(rng, semilla, sub);
    return flotante(rng, semilla, sub);
  }

  function cerrar(rng, semilla, o) {
    const errores = o.errores.filter(e => e && Number.isFinite(e.valor) && (o.negativos || e.valor > 0))
      .map(e => (Math.abs(e.valor) < 1e-9 ? { ...e, valor: 0 } : e));
    const alternativas = P.armar({ correcta: o.correcta, errores, rng, unidad: o.unidad, texto: o.texto || null, negativos: !!o.negativos, formato: o.formato || null, qmax: o.qmax || 12 });
    return {
      id: `mas-horaria#${semilla}`, variables: o.variables || VAR, enunciado: o.enunciado, pregunta: o.pregunta, datos: '',
      alternativas, solucion: o.solucion, respuesta: { valor: o.correcta, unidad: o.unidad }, _datos: o.datos,
    };
  }

  const OBJ = [['Un bloque', 'el bloque'], ['Un carrito', 'el carrito'], ['Una esfera', 'la esfera']];

  // ---------------- leer ----------------
  function leer(rng, semilla, sub) {
    const [Obj, obj] = rng.elegir(OBJ);
    if (sub === 'k') {
      const A = rng.elegir([0.05, 0.1, 0.15, 0.2, 0.25, 0.3, 0.4, 0.5]), w = rng.elegir([2, 3, 4, 5, 6, 8, 10, 12, 20]), m = rng.elegir([0.1, 0.2, 0.25, 0.4, 0.5, 0.8, 1, 1.5, 2, 3, 4]);
      const ph = rng.elegir([0, PI / 6, PI / 3, PI / 2, PI, 3 * PI / 2]);
      const correcta = m * w * w;
      if (!limpio(correcta)) return null;
      const enunciado = [`${Obj} de ${f(m)} kg, unido a un resorte sobre un piso liso, oscila según `, ...ecuacion(A, w, ph, 'm'), ', con t en s.', CONV];
      const pregunta = ['¿Cuál es la ', v('x', 'constante del resorte'), '?'];
      const errores = [
        u('PR1-cuadrado', m * w, `Multiplicaste la masa por ω sin elevarla al cuadrado. De ω = √(k/m) sale k = m·ω² = ${f(m)} · ${w}².`),
        u('PR4-invierte', w * w / m, `Dividiste ω² entre la masa. De ω² = k/m sale k = m·ω²: la masa multiplica.`),
        h('MAS-fuerza-maxima', m * w * w * A, `Multiplicaste también por la amplitud: eso es la fuerza máxima del resorte, k·A. La constante es solo m·ω².`),
        u('PR3-medio', m * w * w / 2, `Pusiste un ½ que no va. ω = √(k/m), sin ½: k = m·ω².`),
      ];
      const solucion = [
        ['Comparando con x = A·sen(ωt + φ): ', v('w', `ω = ${w} rad/s`), '.'],
        ['En el resorte ω = √(k/m), así que ', v('x', 'k'), ` = m·ω² = ${f(m)} · ${w}² = `, v('x', `${f(correcta)} N/m`), '. La amplitud y la fase no intervienen.'],
      ];
      return cerrar(rng, semilla, { correcta, errores, unidad: 'N/m', enunciado, pregunta, solucion, datos: { tipo: 'leer', sub, A, w, fase: ph / PI, m } });
    }
    if (sub === 'x0') {
      const A = rng.elegir([2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 24, 30]), w = rng.elegir([2, 3, 4, 5, 6, 10, PI, 2 * PI, 4 * PI]);
      const ph = rng.elegir([1, 2, 3, 4, 5, 7, 8, 9, 10, 11].map(k => k * PI / 6));
      const correcta = A * Math.sin(ph);
      const enunciado = [`${Obj} oscila con MAS según `, ...ecuacion(A, w, ph, 'cm'), ', con t en s.', CONV];
      const pregunta = ['¿Cuál es la ', v('x', 'posición inicial'), ` ${obj === 'la esfera' ? 'de la esfera' : 'del ' + obj.slice(3)} (en t = 0)?`];
      const errores = [
        h('MAS-amplitud-como-x0', A, `Esa es la amplitud, la posición más lejana. En t = 0 la posición es A·sen φ: depende de la fase inicial, ${P.pi(ph)}.`),
        h('MAS-coseno', A * Math.cos(ph), `Usaste el coseno de la fase. La ecuación es con seno: x(0) = A·sen φ.`),
        h('MAS-signo', -correcta, `Te salió el signo cambiado. sen ${P.pi(ph)} es ${Math.sin(ph) > 0 ? 'positivo' : 'negativo'}: ${obj} empieza a la ${correcta > 0 ? 'derecha' : 'izquierda'} del equilibrio.`),
        h('MAS-seno-desde-cero', 0, `Supusiste que con seno siempre parte del equilibrio. Eso pasa solo si φ = 0; aquí φ = ${P.pi(ph)}.`),
      ];
      const solucion = [
        ['En t = 0: x(0) = ', v('A', 'A'), '·sen ', v('ph', 'φ'), ` = ${f(A)} · sen ${P.pi(ph)}.`],
        [`sen ${P.pi(ph)} = ${trig(Math.sin(ph))}, así que `, v('x', `x(0) = ${P.radical(correcta)} cm`), correcta > 0 ? ': a la derecha del equilibrio.' : ': a la izquierda del equilibrio.'],
      ];
      return cerrar(rng, semilla, { negativos: true, correcta, errores, unidad: 'cm', texto: x => `${P.radical(x)} cm`, enunciado, pregunta, solucion,
        datos: { tipo: 'leer', sub, A, w, fase: ph / PI } });
    }
    // periodo o frecuencia, con ω = nπ
    const n = rng.elegir([1, 2, 4, 5, 8, 10, 20]), w = n * PI, A = rng.elegir([0.02, 0.05, 0.1, 0.15, 0.2, 0.25, 0.3, 0.4, 0.5]);
    const ph = rng.elegir([0, PI / 6, PI / 4, PI / 3, PI / 2, 2 * PI / 3, PI, 4 * PI / 3, 3 * PI / 2, 5 * PI / 3]);
    const T = 2 / n, fr = n / 2;
    const enunciado = [`${Obj} oscila con MAS según `, ...ecuacion(A, w, ph, 'm'), ', con t en s.', CONV];
    let correcta, unidad, errores, pregunta, solucion;
    if (sub === 'periodo') {
      correcta = T; unidad = 's';
      pregunta = ['¿Cuál es su ', v('x', 'periodo'), '?'];
      errores = [
        u('PR7-frecuencia', fr, `Esa es la frecuencia, ${f(fr)} Hz: las oscilaciones por segundo. El periodo es lo que dura una oscilación, T = 1/f.`),
        u('PR7-medio-periodo', T / 2, `Te salió medio periodo: usaste T = π/ω. Una oscilación completa es una vuelta de 2π: T = 2π/ω.`),
        u('U7-f-como-omega', 1 / w, `Usaste T = 1/ω, como si ω fuera la frecuencia. ω va en rad/s: T = 2π/ω.`),
        h('MAS-sin-pi', 2 * PI / n, `Leíste ω = ${n} rad/s, sin el π. En la ecuación ω = ${n === 1 ? '' : n}π rad/s: T = 2π/(${n === 1 ? '' : n}π).`),
      ];
      solucion = [['Comparando: ', v('w', `ω = ${n === 1 ? '' : n}π rad/s`), '.'], [v('x', 'T'), ` = 2π/ω = 2π/(${n === 1 ? '' : n}π) = `, v('x', `${f(T)} s`), '.']];
    } else {
      correcta = fr; unidad = 'Hz';
      pregunta = ['¿Cuál es su ', v('x', 'frecuencia'), '?'];
      errores = [
        u('U7-omega-como-f', w, `Ese es el valor de ω (${n === 1 ? '' : n}π ≈ ${f(w)}). ω es la frecuencia angular, en rad/s; la frecuencia es f = ω/2π.`),
        h('MAS-coeficiente-de-pi', n, `Tomaste el ${n} que acompaña a π como la frecuencia. ω = 2π·f: f = ${n}π/2π = ${f(fr)} Hz.`),
        u('PR7-periodo', T, `Ese es el periodo, ${f(T)} s. La frecuencia es su inverso: f = 1/T.`),
        h('MAS-sin-pi', n / (2 * PI), `Leíste ω = ${n} rad/s, sin el π. En la ecuación ω = ${n === 1 ? '' : n}π rad/s: f = ω/2π.`),
      ];
      solucion = [['Comparando: ', v('w', `ω = ${n === 1 ? '' : n}π rad/s`), '.'], [v('x', 'f'), ` = ω/2π = ${n === 1 ? '' : n}π/2π = `, v('x', `${f(fr)} Hz`), '.']];
    }
    return cerrar(rng, semilla, { correcta, errores, unidad, enunciado, pregunta, solucion, datos: { tipo: 'leer', sub, A, w, fase: ph / PI } });
  }

  // ---------------- escribir (armarTexto) ----------------
  function escribir(rng, semilla, sub) {
    const conT = sub === 'extremo' && rng.entero(0, 2) === 0; // en «centro» la rapidez con π no sale limpia
    let w, m = null, k = null, T = null;
    if (conT) { T = rng.elegir([0.25, 0.4, 0.5, 1, 2]); w = 2 * PI / T; }
    else { w = rng.elegir([2, 3, 4, 5, 6, 8, 10, 20]); m = rng.elegir([0.1, 0.2, 0.25, 0.4, 0.5, 1, 2, 4]); k = m * w * w; if (!limpio(k)) return null; }
    const datoW = conT ? `Su periodo es de ${f(T)} s.` : `La masa es de ${f(m)} kg y la constante del resorte, ${f(k)} N/m.`;
    let x0, v0, enunciado, errores, ph, A;
    const malW = conT ? [u('U7-f-como-omega', 1 / T, 'Pusiste la frecuencia f = 1/T donde va ω. Dentro del seno va ω = 2π/T, en rad/s.')]
      : [u('PR2-raiz', k / m, 'Usaste ω = k/m, sin la raíz. En el resorte ω = √(k/m).')];
    if (sub === 'extremo') {
      const d = rng.elegir([2, 3, 4, 5, 6, 8, 10, 12, 15, 20, 25]); A = d / 100;
      const comprime = rng.entero(0, 2) > 0;
      x0 = comprime ? -A : A; v0 = 0; ph = comprime ? 3 * PI / 2 : PI / 2;
      enunciado = ['Un bloque unido a un resorte horizontal oscila sobre un piso liso. ', datoW, ` Se ${comprime ? 'comprime' : 'estira'} el resorte `, v('A', `${d} cm`), ` (el bloque queda a la ${comprime ? 'izquierda' : 'derecha'} del equilibrio) y en t = 0 se lo suelta desde el reposo.`, CONV];
      errores = [
        h('MAS-fase-cero', ec(A, w, 0), `Pusiste φ = 0, pero eso es partir del equilibrio. En t = 0 el bloque está en x = ${comprime ? '−' : ''}A: sen φ = ${comprime ? '−1' : '1'}, φ = ${P.pi(ph)}.`),
        h('MAS-signo-extremo', ec(A, w, comprime ? PI / 2 : 3 * PI / 2), comprime
          ? 'Con φ = π/2 el bloque empezaría en x = +A, estirado. Al comprimir el resorte queda a la izquierda: x(0) = −A, sen φ = −1, φ = 3π/2.'
          : 'Con φ = 3π/2 el bloque empezaría en x = −A, comprimido. Al estirar queda a la derecha: x(0) = +A, sen φ = 1, φ = π/2.'),
        h('MAS-fase-pi', ec(A, w, PI), `Con φ = π el bloque pasa por el equilibrio en t = 0. Aquí parte de un extremo, en reposo: sen φ = ${comprime ? '−1' : '1'}.`),
        h(malW[0].id, ec(A, malW[0].valor, ph), malW[0].explicacion),
        h('MAS-amplitud-doble', ec(2 * A, w, ph), `Tomaste como amplitud todo el recorrido de un extremo al otro. La amplitud es la distancia del equilibrio a un extremo: ${f(A, 3)} m.`),
      ];
      errores[3] = { ...errores[3], respaldo: malW[0].respaldo, fuente: malW[0].fuente };
    } else {
      const izq = rng.moneda();
      const Acm = rng.elegir([2, 3, 4, 5, 6, 8, 10, 12, 15, 20]); A = Acm / 100;
      const vel = A * w; if (!conT && !limpio(vel, 3)) return null;
      x0 = 0; v0 = izq ? -vel : vel; ph = izq ? PI : 0;
      enunciado = ['Un bloque unido a un resorte horizontal oscila sobre un piso liso. ', datoW, ' En t = 0 pasa por la posición de equilibrio ', v('ph', `moviéndose hacia la ${izq ? 'izquierda' : 'derecha'}`), ' con una ', v('A', `rapidez de ${conT ? P.pi(vel, 'm/s') || f(vel, 3) + ' m/s' : f(vel, 3) + ' m/s'}`), '.', CONV];
      errores = [
        h('MAS-sentido', ec(A, w, izq ? 0 : PI), izq ? 'Con φ = 0 pasaría por el equilibrio hacia la derecha (v = Aω cos 0 > 0). Hacia la izquierda la velocidad es negativa: cos φ = −1, φ = π.'
          : 'Con φ = π pasaría por el equilibrio hacia la izquierda (cos π = −1). Hacia la derecha la velocidad es positiva: φ = 0.'),
        h('MAS-fase-extremo', ec(A, w, izq ? 3 * PI / 2 : PI / 2), `Con φ = ${izq ? '3π/2' : 'π/2'} el bloque empezaría en un extremo, quieto. Aquí está en el equilibrio y se mueve: sen φ = 0.`),
        h('MAS-amplitud-por-omega', ec(A * w * w, w, ph), `Multiplicaste la rapidez por ω. En el equilibrio la rapidez es la máxima, v = A·ω, así que A = v/ω.`),
        h('MAS-rapidez-como-amplitud', ec(vel, w, ph), 'Tomaste la rapidez como amplitud. En el equilibrio la rapidez es la máxima, A·ω: la amplitud es v/ω.'),
        { ...malW[0], clave: ec(A, malW[0].valor, ph).clave, texto: ec(A, malW[0].valor, ph).texto },
      ];
    }
    // Las de h(...) con clave: el valor es el objeto de la ecuación.
    errores = errores.map(e => (e && e.valor && e.valor.clave ? { id: e.id, clave: e.valor.clave, texto: e.valor.texto, explicacion: e.explicacion, respaldo: e.respaldo, fuente: e.fuente } : e));
    const correcta = ec(A, w, ph);
    const alternativas = P.armarTexto({ correcta, errores: errores.filter(e => e && e.clave), rng });
    const pregunta = ['¿Cuál es la ', v('x', 'ecuación de posición'), ' del bloque, con 0 ≤ φ < 2π?'];
    const solucion = [
      [conT ? `ω = 2π/T = 2π/${f(T)} = ` : `ω = √(k/m) = √(${f(k)}/${f(m)}) = `, v('w', `${wt(w).replace('t', '')} rad/s`), '.'],
      sub === 'extremo'
        ? ['Se suelta desde el reposo en un extremo: la amplitud es lo que se ', x0 < 0 ? 'comprimió' : 'estiró', ', ', v('A', `A = ${f(A, 3)} m`), `, y x(0) = ${x0 < 0 ? '−' : '+'}A.`]
        : ['Pasa por el equilibrio con la rapidez máxima, A·ω: ', v('A', `A = v/ω = ${conT ? P.pi(Math.abs(v0)) : f(Math.abs(v0), 3)}/${conT ? P.pi(w) : f(w, 3)} = ${f(A, 3)} m`), '.'],
      sub === 'extremo'
        ? [`sen φ = ${x0 < 0 ? '−1' : '1'}, así que `, v('ph', `φ = ${P.pi(ph)}`), '.']
        : [`x(0) = 0 da sen φ = 0 (φ = 0 o π); como v(0) = A·ω·cos φ es ${v0 < 0 ? 'negativa' : 'positiva'}, `, v('ph', `φ = ${P.pi(ph) === '0' ? '0' : P.pi(ph)}`), '.'],
      ['Ecuación: ', v('x', correcta.texto), '.'],
    ];
    return {
      id: `mas-horaria#${semilla}`, variables: VAR, enunciado, pregunta, datos: '', alternativas, solucion,
      respuesta: { valor: correcta.clave, texto: correcta.texto, unidad: '' },
      _datos: { tipo: 'escribir', sub, m, k, T, x0, v0 },
    };
  }

  // ---------------- instante ----------------
  function instante(rng, semilla, sub) {
    const kk = rng.elegir([1, 2, 3, 6]), w = PI / kk;
    const A = 2 * kk * rng.entero(1, Math.floor(30 / (2 * kk)));
    const ph = rng.entero(0, 11) * PI / 6, t = rng.entero(1, 4);
    const arg = w * t + ph, s = Math.sin(arg), c = Math.cos(arg);
    const [Obj] = rng.elegir(OBJ);
    const enunciado = [`${Obj} oscila con MAS según `, ...ecuacion(A, w, ph, 'cm'), ', con t en s.', CONV];
    const ang = P.pi(norm(arg));
    if (sub === 'x') {
      if (Math.abs(s) < 1e-9) return null;
      const correcta = A * s;
      const pregunta = ['¿Cuál es su ', v('x', 'posición'), ` en t = ${t} s?`];
      const errores = [
        h('MAS-amplitud-como-x', A, `Esa es la amplitud. En t = ${t} s la posición es A·sen(ωt + φ), que casi nunca es A.`),
        h('MAS-coseno', A * c, 'Usaste coseno. La ecuación es con seno: x = A·sen(ωt + φ).'),
        h('MAS-sin-fase', A * Math.sin(w * t), `Olvidaste la fase inicial. Dentro del seno va ωt + φ, con φ = ${P.pi(ph)}.`),
        h('MAS-signo', -correcta, `Te salió el signo cambiado: sen ${ang} es ${s > 0 ? 'positivo' : 'negativo'}.`),
      ];
      const solucion = [
        ['Ángulo: ', v('w', 'ω'), `·${t} + `, v('ph', 'φ'), ` = ${P.pi(w * t)} + ${P.pi(ph)} = ${P.pi(arg)}${Math.abs(arg - norm(arg)) > 1e-9 ? ` (equivale a ${ang})` : ''}.`],
        [v('x', 'x'), ' = ', v('A', f(A)), ` · sen ${ang} = ${f(A)} · (${trig(s)}) = `, v('x', `${P.radical(correcta)} cm`), '.'],
      ];
      return cerrar(rng, semilla, { negativos: true, correcta, errores, unidad: 'cm', texto: x => `${P.radical(x)} cm`, enunciado, pregunta, solucion,
        datos: { tipo: 'instante', sub, A, w, fase: ph / PI, t } });
    }
    if (Math.abs(c) < 1e-9) return null;
    const correcta = A * w * c;
    const pregunta = ['¿Cuál es su ', v('x', 'velocidad'), ` en t = ${t} s? (Con signo: positiva hacia la derecha.)`];
    const errores = [
      h('MAS-vmax', A * w, `Esa es la rapidez máxima, A·ω, la que tiene al pasar por el equilibrio. En t = ${t} s la velocidad es A·ω·cos(ωt + φ).`),
      h('MAS-seno-en-v', A * w * s, 'Usaste seno en la velocidad. Si x = A·sen(ωt + φ), la velocidad es v = A·ω·cos(ωt + φ).'),
      h('MAS-sin-fase', A * w * Math.cos(w * t), `Olvidaste la fase inicial. Dentro del coseno va ωt + φ, con φ = ${P.pi(ph)}.`),
      h('MAS-signo', -correcta, `Te salió el signo cambiado: cos ${ang} es ${c > 0 ? 'positivo' : 'negativo'}.`),
    ];
    const solucion = [
      ['Ángulo: ', v('w', 'ω'), `·${t} + `, v('ph', 'φ'), ` = ${P.pi(arg)}${Math.abs(arg - norm(arg)) > 1e-9 ? ` (equivale a ${ang})` : ''}.`],
      [v('x', 'v'), ' = ', v('A', 'A'), '·', v('w', 'ω'), `·cos(ωt + φ) = ${f(A)} · ${P.pi(w)} · (${trig(c)}) = `, v('x', conPi('cm/s')(correcta)), '.'],
    ];
    return cerrar(rng, semilla, { negativos: true, correcta, errores, unidad: 'cm/s', texto: conPi('cm/s'), enunciado, pregunta, solucion,
      datos: { tipo: 'instante', sub, A, w, fase: ph / PI, t } });
  }

  // ---------------- media ----------------
  function mediaVm(rng, semilla) {
    const kk = rng.elegir([1, 2, 4]), w = PI / kk, paso = kk / 2;
    const A = rng.elegir([2, 3, 4, 5, 6, 8, 9, 10, 12, 15, 16, 18, 20, 24, 30]);
    const ph = rng.entero(0, 3) * PI / 2;
    const i1 = rng.entero(0, 3), i2 = i1 + rng.entero(1, 4);
    const t1 = i1 * paso, t2 = i2 * paso;
    if (!Number.isInteger(t1 * 2) || t2 > 12) return null;
    const X = t => A * Math.sin(w * t + ph), V = t => A * w * Math.cos(w * t + ph);
    const dx = X(t2) - X(t1), dt = t2 - t1;
    if (Math.abs(dx) < 1e-9) return null;
    const correcta = dx / dt;
    if (!limpio(correcta)) return null;
    const recorrido = A * (i2 - i1);            // cada paso es un cuarto de periodo: recorre A
    const [Obj] = rng.elegir(OBJ);
    const enunciado = [`${Obj} oscila con MAS según `, ...ecuacion(A, w, ph, 'cm'), ', con t en s.', CONV];
    const pregunta = ['¿Cuál es su ', v('x', 'velocidad media'), ` entre t = ${f(t1)} s y t = ${f(t2)} s? (Con signo: positiva hacia la derecha.)`];
    const errores = [
      h('MAS-vmax-por-media', A * w, 'Esa es la rapidez máxima, A·ω, la del paso por el equilibrio. La velocidad media es el desplazamiento entre el tiempo: Δx/Δt.'),
      h('MAS-promedio-velocidades', (V(t1) + V(t2)) / 2, 'Promediaste las velocidades de los dos instantes. Eso solo vale si la aceleración es constante, y en el MAS no lo es: la velocidad media es Δx/Δt.'),
      recorrido !== Math.abs(dx) ? h('MAS-recorrido-por-desplazamiento', (dx > 0 ? 1 : -1) * recorrido / dt, `Usaste lo que recorre (${f(recorrido)} cm, ida y vuelta). La velocidad media usa el desplazamiento: posición final menos inicial, ${f(dx)} cm.`) : null,
      t2 > 0 ? h('MAS-posicion-entre-tiempo', X(t2) / t2, `Dividiste la posición final entre el tiempo final. Hay que restar posiciones y tiempos: (x(${f(t2)}) − x(${f(t1)}))/(${f(t2)} − ${f(t1)}).`) : null,
      h('MAS-signo', -correcta, 'Restaste al revés: el desplazamiento es posición final menos inicial.'),
    ];
    const solucion = [
      [`x(${f(t1)}) = ${f(A)} · sen ${P.pi(norm(w * t1 + ph))} = ${f(X(t1))} cm y x(${f(t2)}) = ${f(A)} · sen ${P.pi(norm(w * t2 + ph))} = ${f(X(t2))} cm.`],
      [v('x', 'v media'), ` = Δx/Δt = (${f(X(t2))} − ${f(X(t1))})/(${f(t2)} − ${f(t1)}) = `, v('x', `${f(correcta)} cm/s`), '.'],
    ];
    // Todas en decimales: la correcta (Δx/Δt) no lleva π, así que las que llevan π tampoco se escriben con π.
    return cerrar(rng, semilla, { negativos: true, correcta, errores, unidad: 'cm/s', texto: x => `${f(x)} cm/s`, enunciado, pregunta, solucion,
      datos: { tipo: 'media', sub: 'vm', A, w, fase: ph / PI, t1, t2 } });
  }

  function mediaOmega(rng, semilla) {
    const c = rng.elegir([0.5, 1, 1.5, 2, 2.5, 3, 4, 5, 6]), w = c * PI;
    const A = rng.elegir([2, 3, 4, 5, 6, 8, 10, 12, 15, 16, 20, 24, 30]);
    const mitad = rng.moneda();
    const vm = mitad ? 3 * A * c : 2 * A * c;
    if (!limpio(vm)) return null;
    const [Obj, obj] = rng.elegir(OBJ);
    const meta = mitad ? 'A/2' : 'A';
    const enunciado = [`${Obj} oscila con MAS según x = `, v('A', f(A)), ' sen(', v('x', 'ω'), 't) cm, con ω desconocida y t en s. Desde t = 0 hasta el instante en que llega por primera vez a ',
      `x = ${mitad ? f(A / 2) : f(A)} cm${mitad ? ' (la mitad de la amplitud)' : ''}, su velocidad media es de ${f(vm)} cm/s.`];
    const pregunta = ['¿Cuál es el valor de ', v('x', 'ω'), '?'];
    const errores = [
      h('MAS-vmax-por-media', vm / A, 'Igualaste la velocidad media a la rapidez máxima, A·ω. La rapidez máxima solo la tiene al pasar por el equilibrio; la media es Δx/Δt.'),
      h('MAS-promedio-velocidades', mitad ? 2 * vm / (A * (1 + Math.sqrt(3) / 2)) : 2 * vm / A, 'Promediaste la velocidad inicial y la final. En el MAS la aceleración cambia, así que la media no es el promedio: es Δx/Δt.'),
      mitad ? h('MAS-cuarto-de-periodo', PI * vm / A, 'Tomaste T/4 como el tiempo hasta A/2. En un cuarto de periodo llega hasta A; hasta A/2 tarda menos: sen(ωt) = 1/2 da ωt = π/6, es decir, T/12.')
        : u('PR7-medio-periodo', PI * vm / A, 'Tomaste medio periodo como el tiempo hasta x = A. Del equilibrio al extremo es un cuarto de periodo: ωt = π/2.'),
      mitad ? h('MAS-angulo-coseno', 2 * PI * vm / (3 * A), 'Usaste ωt = π/3, el ángulo cuyo coseno es 1/2. Con x = A·sen(ωt), llegar a A/2 pide sen(ωt) = 1/2: ωt = π/6.') : null,
      u('U7-f-como-omega', w / (2 * PI), `Esa es la frecuencia f = ω/2π, en Hz. Te piden la frecuencia angular, ω = 2π·f.`),
    ];
    const solucion = [
      [`Llega a x = ${meta} cuando sen(ωt) = ${mitad ? '1/2' : '1'}: ωt = ${mitad ? 'π/6' : 'π/2'}, así que t = ${mitad ? 'π/(6ω)' : 'π/(2ω)'}.`],
      [`Velocidad media: ${mitad ? `(${f(A / 2)} cm)/(π/(6ω)) = 3·A·ω/π` : `(${f(A)} cm)/(π/(2ω)) = 2·A·ω/π`} = ${f(vm)} cm/s.`],
      [v('x', 'ω'), ` = ${mitad ? `π · ${f(vm)}/(3 · ${f(A)})` : `π · ${f(vm)}/(2 · ${f(A)})`} = ${P.pi(w)} ≈ `, v('x', `${f(w)} rad/s`), '.'],
    ];
    // Todas en decimales: el error más buscado (ω = v media/A) no lleva π.
    return cerrar(rng, semilla, { correcta: w, errores, unidad: 'rad/s', texto: x => `${f(x)} rad/s`, enunciado, pregunta, solucion,
      variables: { ...VAR, x: { nombre: 'frecuencia angular', color: 'd' } },
      datos: { tipo: 'media', sub: 'omega', A, vm, meta: mitad ? 0.5 : 1 } });
  }

  // ---------------- apilado ----------------
  function apilado(rng, semilla, sub) {
    const m = rng.elegir([0.5, 1, 1.5, 2]), M = rng.elegir([1, 1.5, 2, 3, 4]), mu = rng.elegir([0.2, 0.25, 0.3, 0.4, 0.5, 0.6]);
    const w = rng.elegir([4, 5, 10]), k = (m + M) * w * w;
    if (!limpio(k, 0)) return null;
    const VA = { A: { nombre: 'amplitud', color: 'o' }, w: { nombre: 'frecuencia angular', color: 'i' }, ph: { nombre: 'rozamiento estático', color: 'h' }, x: { nombre: 'lo que se pide', color: 'd' } };
    const enunciado = [`Un bloque de ${f(M)} kg, unido a un resorte horizontal de ${f(k)} N/m, oscila sobre un piso liso. Encima lleva otro bloque de ${f(m)} kg; el `,
      v('ph', `coeficiente de rozamiento estático entre los bloques es ${f(mu)}`), ' (g = 10 m/s²).'];
    if (sub === 'amplitud') {
      const correcta = mu * G * (m + M) / k * 100;
      if (!limpio(correcta, 1) || correcta > 30) return null;
      const pregunta = ['¿Cuál es la ', v('x', 'mayor amplitud'), ' con que pueden oscilar juntos, sin que el bloque de arriba resbale?'];
      const errores = [
        h('MAS-solo-arriba', mu * G * m / k * 100, 'Igualaste el rozamiento máximo con la fuerza del resorte, k·A. Pero el resorte acelera a los dos bloques; el rozamiento solo al de arriba. Lo que se iguala son las aceleraciones: μs·g = ω²·A con ω² = k/(m + M).'),
        h('MAS-sin-masa-de-arriba', mu * G * M / k * 100, 'Usaste solo la masa del bloque de abajo. El resorte mueve a los dos juntos: ω² = k/(m + M).'),
        u('PR1-cuadrado', mu * G / w * 100, `Dividiste entre ω sin elevar al cuadrado. La aceleración máxima es ω²·A: A = μs·g/ω², con ω = ${w} rad/s.`),
        h('MAS-sin-g', mu * (m + M) / k * 100, 'Te faltó la g. El rozamiento máximo es μs·m·g, y la aceleración que permite es μs·g.'),
      ];
      const solucion = [
        ['El de arriba se mueve solo por el rozamiento estático: su aceleración no puede pasar de ', v('ph', `μs·g = ${f(mu * G)} m/s²`), '.'],
        ['Los dos oscilan juntos: ', v('w', `ω² = k/(m + M) = ${f(k)}/${f(m + M)} = ${f(w * w)} (rad/s)²`), '. La aceleración máxima del MAS es ω²·A, en los extremos.'],
        [v('x', 'A máx'), ` = μs·g/ω² = ${f(mu * G)}/${f(w * w)} = ${f(correcta / 100, 4)} m = `, v('x', `${f(correcta)} cm`), '.'],
      ];
      return cerrar(rng, semilla, { correcta, errores, unidad: 'cm', variables: VA, enunciado, pregunta, solucion, datos: { tipo: 'apilado', sub, m, M, mu, k } });
    }
    const correcta = mu * G;
    const A0 = rng.elegir([1, 2, 3, 4, 5, 6, 8]), a0 = w * w * A0 / 100;   // con la amplitud de ahora no resbala
    if (!limpio(a0) || a0 >= correcta) return null;
    enunciado.push(' Ahora oscilan juntos con una ', v('A', `amplitud de ${A0} cm`), '.');
    const pregunta = ['Si se aumenta la amplitud, ¿cuál es la ', v('x', 'mayor aceleración'), ' que puede llegar a tener el sistema sin que el bloque de arriba resbale?'];
    const errores = [
      h('MAS-reparte-roce', mu * G * m / (m + M), 'Repartiste el rozamiento entre la masa de los dos. El rozamiento solo empuja al de arriba: a máx = μs·m·g/m = μs·g.'),
      h('MAS-masa-total', mu * G * (m + M) / m, 'Pusiste la masa de los dos sobre el rozamiento del de arriba. Para el bloque de arriba: μs·m·g = m·a, así que a = μs·g.'),
      h('MAS-con-frecuencia', a0, `Esa es la aceleración máxima con la amplitud de ahora, ω²·A = ${f(w * w)} · ${f(A0 / 100)}. Al aumentar la amplitud crece; el límite para que no resbale no depende de la amplitud ni de la frecuencia: lo pone el rozamiento, μs·g.`),
      h('MAS-g-sin-mu', G, 'Usaste g como aceleración máxima. El rozamiento estático solo da hasta μs·m·g, así que el límite es μs·g.'),
    ];
    const solucion = [
      ['Al bloque de arriba solo lo acelera el rozamiento estático, que vale como mucho ', v('ph', 'μs·m·g'), '.'],
      ['Con m·a ≤ μs·m·g, la masa se cancela: ', v('x', 'a máx'), ` = μs·g = ${f(mu)} · 10 = `, v('x', `${f(correcta)} m/s²`), '. La constante del resorte y la frecuencia no cambian este límite.'],
    ];
    return cerrar(rng, semilla, { correcta, errores, unidad: 'm/s²', variables: VA, enunciado, pregunta, solucion, datos: { tipo: 'apilado', sub, m, M, mu, k, A: A0 } });
  }

  // ---------------- flotante ----------------
  function flotante(rng, semilla, sub) {
    const liq = rng.elegir([['agua', 1000], ['agua', 1000], ['aceite', 800], ['glicerina', 1250]]);
    const rho = liq[1], S = rng.elegir([8, 10, 12, 15, 16, 18, 20, 24, 25, 30, 32, 36, 40, 45, 48, 50, 60, 64, 72, 75, 80, 90, 100, 120, 150]), n = rng.elegir([2, 3, 4, 5, 6, 8, 10, 12]);
    const k = rho * G * S / 10000, m = k / (n * n), T = 2 * PI / n;
    const sumergido = m / (rho * S / 10000);           // largo bajo el líquido en equilibrio, en m
    if (!limpio(k) || !limpio(m, 3) || m < 0.05 || sumergido < 0.02 || sumergido > 1.5) return null;
    const VF = { A: { nombre: 'sección', color: 'o' }, w: { nombre: 'masa', color: 'i' }, ph: { nombre: 'densidad del líquido', color: 'h' }, x: { nombre: 'lo que se pide', color: 'd' } };
    const [cuerpo, lastre] = m >= 2 ? rng.elegir([['Una boya cilíndrica', ''], ['Un tambor cilíndrico', ', con lastre,']])
      : rng.elegir([['Un tubo de ensayo', ', con perdigones en el fondo,'], ['Un frasco cilíndrico', ', con arena en el fondo,']]);
    const enunciado = [cuerpo, sub === 'periodo' ? [' de ', v('w', `${f(m, 3)} kg`)] : '', `${lastre} `, 'flota en posición vertical en ', v('ph', `${liq[0]} (${f(rho)} kg/m³)`),
      '. Su ', v('A', `sección es de ${f(S)} cm²`), '. Se empuja un poco hacia abajo y se suelta: oscila verticalmente', sub === 'masa' ? [' con un periodo de ', P.pi(T, 's'), ' (g = 10 m/s²).'] : ' (g = 10 m/s²).'].flat();
    const sm2 = S / 10000;
    const solBase = [
      ['Si se hunde una distancia y por debajo de su posición de equilibrio, el empuje crece en ρ·g·S·y. Esa fuerza extra lo devuelve, como un resorte de constante ', v('ph', 'ρ'), '·g·', v('A', 'S'),
        ` = ${f(rho)} · 10 · ${f(sm2, 4)} = ${f(k)} N/m (${f(S)} cm² = ${f(sm2, 4)} m²).`],
    ];
    if (sub === 'periodo') {
      const pregunta = ['¿Cuál es el ', v('x', 'periodo'), ' de su oscilación?'];
      const errores = [
        u('PR4-invierte', 2 * PI * Math.sqrt(k / m), 'Invertiste el cociente: el periodo es 2π·√(m/k). A más masa, oscila más lento.'),
        u('PR2-raiz', 2 * PI * m / k, 'Te faltó la raíz: T = 2π·√(m/k).'),
        u('U3-cm2', 2 * PI * Math.sqrt(m / (k * 100)), `Pasaste cm² a m² dividiendo entre 100. Un metro cuadrado tiene 10 000 cm²: ${f(S)} cm² = ${f(sm2, 4)} m².`),
        h('MAS-sin-dos', PI * Math.sqrt(m / k), 'Usaste T = π·√(m/k). Una oscilación completa es una vuelta de 2π: T = 2π·√(m/k).'),
        u('U3-sin-convertir', 2 * PI * Math.sqrt(m / (k * 10000)), `Usaste la sección en cm² sin pasarla a m². En k = ρ·g·S la sección va en m²: ${f(S)} cm² = ${f(sm2, 4)} m².`),
      ];
      const solucion = [...solBase, [v('x', 'T'), ' = 2π·√(', v('w', 'm'), `/k) = 2π·√(${f(m, 3)}/${f(k)}) = 2π/${n} = `, v('x', P.pi(T, 's')), '.']];
      // Todas con π: los errores que no salen como múltiplo limpio de π se descartan.
      return cerrar(rng, semilla, { correcta: T, errores, unidad: 's', formato: 'pi', qmax: 1000, variables: VF, enunciado, pregunta, solucion, datos: { tipo: 'flotante', sub, rho, S, m } });
    }
    const pregunta = ['¿Cuál es la ', v('x', 'masa'), ' del cuerpo?'];
    const errores = [
      u('PR7-medio-periodo', 4 * k / (n * n), `Usaste ω = π/T = ${f(n / 2)} rad/s. Una oscilación completa es una vuelta de 2π: ω = 2π/T = ${n} rad/s.`),
      u('PR1-cuadrado', k / n, `Dividiste entre ω sin elevarla al cuadrado. ω = 2π/T = ${n} rad/s y m = k/ω².`),
      u('U3-cm2', k * 100 / (n * n), `Pasaste cm² a m² dividiendo entre 100. ${f(S)} cm² = ${f(sm2, 4)} m² (se divide entre 10 000).`),
      h('MAS-sin-g', rho * sm2 / (n * n), 'Te faltó la g en la constante: el empuje extra es ρ·g·S·y, así que k = ρ·g·S.'),
    ];
    const solucion = [...solBase,
      ['Del periodo, ', P.pi(T, 's'), ': ', v('w', `ω = 2π/T = ${n} rad/s`), '.'],
      [v('x', 'm'), ` = k/ω² = ${f(k)}/${n * n} = `, v('x', `${f(m, 3)} kg`), '.']];
    return cerrar(rng, semilla, { correcta: m, errores, unidad: 'kg', texto: x => `${f(x, 3)} kg`, variables: VF, enunciado, pregunta, solucion, datos: { tipo: 'flotante', sub, rho, S, T } });
  }

  return { id: 'mas-horaria', titulo: 'La ecuación del resorte', generar };
});
