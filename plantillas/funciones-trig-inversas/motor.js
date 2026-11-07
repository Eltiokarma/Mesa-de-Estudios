/*
 * Motor de «La ventana principal»: funciones trigonométricas inversas (arcsen, arccos, arctan y arccot).
 *
 * Aquí vive toda la matemática de la plantilla (regla 1 de CLAUDE.md). No toca el DOM: funciona igual en el
 * navegador (window.MotorInvTrig) y en Node (require('./motor.js')), donde lo prueban casos.json y papel.json.
 *
 * Números de entrada (k, a, b): número de JS o texto exacto de un solo término n√r/d: '1/2', '−√3/2', '√2/2',
 * '3/5', '-1', '2√2/3', '0,3' (coma o punto decimal). Los ángulos se dan y se devuelven así:
 *   { grados, rad, texto, textoG, textoRad, exacto, academia, gradosReal }
 *   grados: medida sexagesimal (la de academia si es de academia); rad: valor en radianes (el real siempre);
 *   texto: en radianes con π ('−π/6', '2π/3') si es notable de verdad, en grados ('37°', '127°') si es de academia
 *   y aproximado ('≈ 0,30 rad') si no es notable; textoG: en grados ('30°', '≈ 17,46°'); textoRad: siempre con π
 *   si es exacto ('37π/180'). Convención de academia: arcsen(3/5) = 37°, arcsen(4/5) = 53°, arcsen(7/25) = 16°,
 *   arcsen(24/25) = 74° (y las tangentes 3/4, 4/3, 7/24 y 24/7). El ángulo de verdad es 36,87°, 53,13°, 16,26° y
 *   73,74°: academia: true y gradosReal lo dicen. Rangos principales: arcsen [−π/2; π/2], arccos [0; π],
 *   arctan ⟨−π/2; π/2⟩, arccot ⟨0; π⟩.
 *
 *   exacto(t)                          el número: { valor, texto, exacto } (texto con signo menos tipográfico)
 *   arco({ fn, k })                    fn 'sen' | 'cos' | 'tan' | 'cot': el ángulo principal arcfn(k), su rango y
 *                                      dominio, y 'errores' (ángulos que dan los errores típicos). Si k está fuera
 *                                      del dominio: { existe: false, motivo }. Con fn 'sec' | 'csc': arcsec k =
 *                                      arccos(1/k), rango [0; π] − {π/2}; arccsc k = arcsen(1/k), rango
 *                                      [−π/2; π/2] − {0}; |k| ≥ 1; sin errores típicos (solo el papel).
 *   cortes({ fn, k, desde, hasta })    todos los ángulos θ en [desde; hasta⟩ (grados) con fn θ = k, en orden, cuál
 *                                      es el principal (principal: true), 'cuantos', 'texto' ('π/6 y 5π/6') y, para
 *                                      el seno, errores con listas ('una', 'sinSigno', 'comoCoseno': los de
 *                                      cos θ = k).
 *   arcoDe({ fn, grados })             arcfn(fn φ) con φ en grados: el ángulo principal (texto en grados), 'igual'
 *                                      (si φ ya estaba en el rango) y errores. Si fn φ no existe: { existe: false }.
 *   ventana({ fn, desde, hasta })      fn 'sen' | 'cos': ¿el tramo [desde; hasta] (grados) sirve de rango para la
 *                                      inversa? { inyectiva, cubre, sirve, min, max, repetido: { k, cortes } | null,
 *                                      falta: { k } | null }.
 *   compuesta({ ext, inv, k })         ext(arc_inv(k)) con el triángulo rectángulo: ext en sen, cos, tan, cot, sec,
 *                                      csc; inv en sen, cos, tan. { valor, texto, angulo, lados: { op, ady, hip }
 *                                      (hipotenusa 1 o cateto 1), enteros: { op, ady, hip } (los mismos lados por
 *                                      el menor factor que los deja sin denominador), errores }.
 *   dominio({ fn, a, b })              valores de x para los que existe arcfn(a·x + b): { de, a, texto '[0; 1]'
 *                                      (o 'ℝ'), errores }.
 *   dentro({ fn, a, b, x })            u = a·x + b y si arcfn(u) existe: { u, dentro }.
 *   sumaSenCos({ k })                  arcsen k + arccos k = π/2: { valor, texto, decimal '≈ 1,57 rad', arcsen,
 *                                      arccos, errores } (cada error con valor y decimal).
 *   notacion({ fn, k })                fn⁻¹(k) leído bien (el ángulo, en rad) y mal: { valor, decimal, errores }.
 *   sumaTan({ a, b })                  arctan a + arctan b con a, b racionales: { valor, texto, textoArctan,
 *                                      producto (a·b), vectores { u, v } y direccion (los puntos de cuadrícula
 *                                      (1; a)·d y (1; b)·d y su producto como giro), angulo, errores }.
 *   muestras({ fn, desde, hasta, n, inversa, tope })  puntos para dibujar: tramos [[x, y], …]; directa: x = θ en
 *                                      rad entre desde y hasta (grados), y = fn θ (la tangente se corta en |y| ≤
 *                                      tope); inversa: x = k, y = arcfn k en rad (k entre desde y hasta si fn es
 *                                      tan o cot; si no, entre −1 y 1).
 *   punto(g)                           el punto (cos g; sen g) de la circunferencia de radio 1 (g en grados), para dibujar.
 *   textoRad(g), textoGrados(g), decimal(x, cifras)   formatos: 150 → '5π/6' y '150°'; 0.3 → '0,3'.
 *   RANGO, ERRORES                     los rangos principales y el catálogo de errores típicos.
 *
 * Cada resultado que es la respuesta de una predicción trae 'errores': nombre → { id, valor, texto, … } con lo que
 * dan los errores típicos de docs/investigacion/trigonometria-ideas-erroneas.md (TR12, TR14 y TR22; el informe casi
 * no trata las inversas, así que todos son hipótesis o extensiones) y los nuestros (IN1 a IN29, hipótesis). Un
 * error que en ese caso da lo mismo que la respuesta correcta se quita y su nombre queda en 'coinciden'; uno que da
 * lo mismo que otro error anterior se quita y queda en 'repetidos' (la escena no muestra dos opciones iguales). El
 * error IN18 (rango cerrado de arctan) solo se genera con |k| ≥ 10.
 */
(function (root, fabrica) {
  const motor = fabrica();
  if (typeof module === 'object' && module.exports) module.exports = motor;
  else root.MotorInvTrig = motor;
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  const GR = Math.PI / 180, TOL = 1e-9;

  const ERRORES = {
    TR12: 'el seno como distancia sin signo: cuenta los ángulos de seno −k como si fueran de seno k, o quita el signo',
    TR14: 'en la reducción cambia de función: sen(180° − x) = cos x',
    TR22: 'una sola solución: la que da la calculadora',
    IN1: 'da otro ángulo con la misma razón, fuera del rango principal',
    IN2: 'arccos(−k) = −arccos k (usa la regla del arcsen)',
    IN3: 'arcsen(sen θ) = θ siempre, sin mirar el rango',
    IN4: 'da el ángulo positivo, una vuelta más (2π + θ), en vez del negativo del rango',
    IN5: 'lee sen⁻¹k como 1/sen k (la cosecante)',
    IN6: 'aplica el ⁻¹ al número: sen⁻¹(1/2) = 2',
    IN7: 'confunde arcsen con arccos (da el ángulo complementario)',
    IN8: 'cos(arcsen k) = k: cancela funciones distintas',
    IN9: 'olvida la raíz del cateto que falta (da 1 − k²)',
    IN10: 'usa la recíproca (hipotenusa entre cateto)',
    IN11: 'arcsen k + arccos k = π (los cree suplementarios)',
    IN12: 'arcsen k + arccos k = 0 (cree que arccos k = −arcsen k)',
    IN13: 'arccos k = arcsen k (los trata como iguales)',
    IN14: 'copia el dominio [−1; 1] sin despejar x',
    IN15: 'al despejar cambia el signo de b',
    IN16: 'no divide entre a al despejar',
    IN17: 'cualquier tramo continuo sirve de ventana (no revisa que no repita ni que llegue a todos los valores)',
    IN18: 'el rango de arctan es cerrado: arctan llega a ±π/2',
    IN19: 'arccot k = arctan(1/k) también con k negativo',
    IN20: 'mezcla grados y radianes',
    IN21: 'arctan a + arctan b = arctan(a + b)',
    IN22: 'tan(α + β) con + en el denominador',
    IN23: 'arctan a + arctan b = arctan(a · b)',
    IN24: 'al reducir pone un signo que no va: sen(180° − x) = −sen x',
    IN25: 'trata al coseno como impar: cos(−x) = −cos x',
    IN26: 'confunde arctan con arccot',
    IN27: 'olvida sumar π cuando a·b > 1',
    IN28: 'quiere una vuelta entera como ventana',
    IN29: 'le pone a la respuesta el signo de k'
  };

  const RANGO = {
    sen: { de: -90, a: 90, abierto: false, texto: '[−π/2; π/2]', dominio: '[−1; 1]' },
    cos: { de: 0, a: 180, abierto: false, texto: '[0; π]', dominio: '[−1; 1]' },
    tan: { de: -90, a: 90, abierto: true, texto: '⟨−π/2; π/2⟩', dominio: 'ℝ' },
    cot: { de: 0, a: 180, abierto: true, texto: '⟨0; π⟩', dominio: 'ℝ' }
  };
  const RANGO2 = {
    sec: { texto: '[0; π] − {π/2}', dominio: '⟨−∞; −1] ∪ [1; +∞⟩' },
    csc: { texto: '[−π/2; π/2] − {0}', dominio: '⟨−∞; −1] ∪ [1; +∞⟩' }
  };
  const FN = ['sen', 'cos', 'tan', 'cot'];
  function fnValida(fn, lista) {
    if (!(lista || FN).includes(fn)) throw new Error(`función '${fn}' desconocida (usa ${(lista || FN).join(', ')})`);
    return fn;
  }
  function numero(x, que) {
    if (typeof x !== 'number' || !Number.isFinite(x)) throw new Error(`${que} debe ser un número`);
    return x;
  }

  // ---------- Formatos ----------
  const menos = s => String(s).replace(/-/g, '−');
  function decimal(x, cifras) {
    const c = cifras === undefined ? 2 : cifras, p = Math.pow(10, c), r = Math.round(x * p) / p + 0;
    const [e, f] = String(Math.abs(r)).split('.');
    return (r < 0 ? '−' : '') + e + (f ? ',' + f : '');
  }
  // ≈ con cifras fijas, salvo que el número sea exacto con esas cifras (entonces sin ≈ y sin ceros de más)
  function aprox(x, cifras) {
    const c = cifras === undefined ? 2 : cifras, p = Math.pow(10, c);
    if (Math.abs(Math.round(x * p) - x * p) < 1e-9) return decimal(x, c);
    const r = (Math.round(x * p) / p + 0).toFixed(c);
    return '≈ ' + (r.startsWith('-') ? '−' + r.slice(1) : r).replace('.', ',');
  }

  // ---------- Números exactos de un solo término: n·√r/d ----------
  function mcd(a, b) { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a; }
  function mcm(a, b) { return a / mcd(a, b) * b; }
  function T(n, d, r) {
    if (d === undefined) d = 1; if (r === undefined) r = 1;
    if (d === 0) throw new Error('denominador cero');
    if (n === 0) return { n: 0, d: 1, r: 1 };
    if (d < 0) { n = -n; d = -d; }
    let s = 1, t = r;
    for (let p = 2; p * p <= t; p++) while (t % (p * p) === 0) { t /= p * p; s *= p; }
    n *= s; const g = mcd(n, d) || 1;
    return { n: n / g, d: d / g, r: t };
  }
  const tVal = a => a.n * Math.sqrt(a.r) / a.d + 0;
  const tNeg = a => T(-a.n, a.d, a.r);
  const tAbs = a => T(Math.abs(a.n), a.d, a.r);
  const tMul = (a, b) => T(a.n * b.n, a.d * b.d, a.r * b.r);
  function tDiv(a, b) {   // (n1√r1/d1)/(n2√r2/d2) = n1 d2 √(r1 r2) / (d1 n2 r2)
    if (b.n === 0) throw new Error('división entre cero');
    return T(a.n * b.d, a.d * b.n * b.r, a.r * b.r);
  }
  const tEq = (a, b) => a.n === b.n && a.d === b.d && a.r === b.r;
  // racional p/q como término
  const R = (p, q) => T(p, q === undefined ? 1 : q, 1);
  const tCuadrado = a => R(a.n * a.n * a.r, a.d * a.d);            // racional
  function tRaiz(q) {   // √(p/q) de un racional ≥ 0
    if (q.r !== 1) throw new Error('raíz de un número no racional');
    if (q.n < 0) throw new Error('raíz de un negativo');
    if (q.n === 0) return T(0);
    return T(1, q.d, q.n * q.d);
  }
  const tMas = (a, b) => { if (a.r !== 1 || b.r !== 1) throw new Error('suma de radicales'); return R(a.n * b.d + b.n * a.d, a.d * b.d); };
  const tMenos = (a, b) => tMas(a, tNeg(b));
  function tTexto(a) {
    if (a.n === 0) return '0';
    const m = Math.abs(a.n), cuerpo = a.r === 1 ? String(m) : (m === 1 ? '' : m) + '√' + a.r;
    return (a.n < 0 ? '−' : '') + cuerpo + (a.d === 1 ? '' : '/' + a.d);
  }
  // Lee un número: devuelve { t (término exacto) | null, valor, texto, exacto }
  function leer(x) {
    if (x && typeof x === 'object' && 'valor' in x) x = x.t ? tTexto(x.t) : x.valor;
    if (typeof x === 'number') {
      numero(x, 'el número');
      for (let q = 1; q <= 1000; q++) { const p = Math.round(x * q); if (Math.abs(p / q - x) < 1e-12) { const t = R(p, q); return { t, valor: tVal(t), texto: tTexto(t), exacto: true }; } }
      return { t: null, valor: x, texto: aprox(x, 4), exacto: false };
    }
    if (typeof x !== 'string') throw new Error('se esperaba un número o un texto como \'1/2\' o \'−√3/2\'');
    const s = x.trim().replace(/−/g, '-').replace(/\s+/g, '');
    if (/^-?\d+[.,]\d+$/.test(s)) return Object.assign(leer(Number(s.replace(',', '.'))), { texto: menos(s.replace('.', ',')) });
    const m = s.match(/^(-?)(\d*)(?:√(\d+))?(?:\/(\d+))?$/);
    if (!m || (m[2] === '' && m[3] === undefined)) throw new Error(`'${x}' no es un número exacto (usa '1/2', '−√3/2', '2√2/3')`);
    const n = (m[1] ? -1 : 1) * (m[2] === '' ? 1 : Number(m[2])), r = m[3] ? Number(m[3]) : 1, d = m[4] ? Number(m[4]) : 1;
    if (d === 0) throw new Error('denominador cero');
    const t = T(n, d, r);
    return { t, valor: tVal(t), texto: tTexto(t), exacto: true };
  }
  function exacto(x) { const L = leer(x); return { valor: L.valor, texto: L.texto, exacto: L.exacto }; }
  function racional(x, que) {
    const L = leer(x);
    if (!L.exacto || L.t.r !== 1) throw new Error(`${que} debe ser racional ('1/2', '3', '-2/3')`);
    return L.t;
  }

  // ---------- Ángulos ----------
  function textoRad(g) {
    const n0 = Math.round(g);
    if (Math.abs(g - n0) > 1e-9) throw new Error('textoRad pide grados enteros');
    const f = R(n0, 180), m = Math.abs(f.n), s = f.n < 0 ? '−' : '';
    if (f.n === 0) return '0';
    return s + (m === 1 ? '' : m) + 'π' + (f.d === 1 ? '' : '/' + f.d);
  }
  const textoGrados = g => (Math.abs(g - Math.round(g)) < 1e-9 ? menos(Math.round(g) + 0) + '°' : aprox(g, 2) + '°');
  const ACAD = { 37: 36.86989764584402, 53: 53.13010235415598, 16: 16.260204708311957, 74: 73.73979529168804 };
  // Ángulo exacto en grados enteros. real: grados de verdad (si es de academia).
  function angG(g, academia, real) {
    g = Math.round(g) + 0;
    const gr = academia ? real : g;
    return { grados: g, rad: gr * GR, texto: academia ? textoGrados(g) : textoRad(g), textoG: textoGrados(g), textoRad: textoRad(g),
      exacto: true, academia: !!academia, gradosReal: gr };
  }
  // Ángulo no notable, desde radianes
  function angR(rad) {
    const g = rad / GR;
    return { grados: g, rad, texto: aprox(rad, 2) + ' rad', textoG: textoGrados(g), textoRad: aprox(rad, 2), exacto: false, academia: false, gradosReal: g };
  }
  // Un ángulo derivado de otro (θ) por una regla en grados: si θ es exacto, exacto; si no, numérico.
  function derivar(base, f) {
    if (base.exacto) {
      const g = f(base.grados);
      // la versión real sale de la misma regla aplicada a los grados de verdad
      return angG(g, base.academia, base.academia ? f(base.gradosReal) : g);
    }
    return angR(f(base.grados) * GR);
  }

  // Tablas de valores notables (en el primer cuadrante): grados → texto. Las de academia van aparte.
  const TSEN = { 0: '0', 30: '1/2', 45: '√2/2', 60: '√3/2', 90: '1', 37: '3/5', 53: '4/5', 16: '7/25', 74: '24/25' };
  const TTAN = { 0: '0', 30: '√3/3', 45: '1', 60: '√3', 37: '3/4', 53: '4/3', 16: '7/24', 74: '24/7' };
  const TSEN_T = Object.entries(TSEN).map(([g, t]) => [Number(g), leer(t).t]);
  const TTAN_T = Object.entries(TTAN).map(([g, t]) => [Number(g), leer(t).t]);
  function buscar(tabla, t) { const a = tAbs(t); for (const [g, v] of tabla) if (tEq(v, a)) return g; return null; }
  const esAcad = g => Object.prototype.hasOwnProperty.call(ACAD, Math.abs(g));
  // el ángulo principal, exacto si se puede
  function principal(fn, L) {
    const v = L.valor, s = Math.sign(v);
    const real = { sen: Math.asin(v), cos: Math.acos(v), tan: Math.atan(v), cot: Math.PI / 2 - Math.atan(v) }[fn];
    if (L.exacto) {
      const g0 = buscar(fn === 'sen' || fn === 'cos' ? TSEN_T : TTAN_T, L.t);
      if (g0 !== null) {
        const ac = esAcad(g0), r0 = ac ? ACAD[g0] : g0;
        const regla = { sen: x => s * x, cos: x => 90 - s * x, tan: x => s * x, cot: x => 90 - s * x }[fn];
        return angG(regla(g0), ac, regla(r0));
      }
    }
    return angR(real);
  }

  // Errores: lista [nombre, id, ángulo]; quita los que coinciden con la correcta ('coinciden') y los que dan lo
  // mismo que un error anterior de la lista ('repetidos': no hay dos opciones iguales).
  function armarErrores(correcta, lista, valorDe) {
    const val = valorDe || (a => a.rad), errores = {}, coinciden = [], repetidos = [];
    for (const [nombre, id, x] of lista) {
      if (x === null || x === undefined) continue;
      if (Math.abs(val(x) - val(correcta)) < 1e-9) coinciden.push(nombre);
      else if (Object.values(errores).some(e => Math.abs(val(e) - val(x)) < 1e-9)) repetidos.push(nombre);
      else errores[nombre] = Object.assign({ id }, x, x.valor === undefined && x.rad !== undefined ? { valor: x.rad } : {});
    }
    return { errores, coinciden, repetidos };
  }

  function arco(o) {
    if (o && (o.fn === 'sec' || o.fn === 'csc')) return arcoRecip(o);
    const fn = fnValida(o && o.fn), L = leer(o.k);
    const base = { fn, k: L.texto, rango: RANGO[fn].texto, dominio: RANGO[fn].dominio };
    if ((fn === 'sen' || fn === 'cos') && Math.abs(L.valor) > 1 + TOL)
      return Object.assign(base, { existe: false, motivo: `${L.texto} está fuera de [−1; 1]: ningún ángulo tiene ${fn === 'sen' ? 'seno' : 'coseno'} ${L.texto}`, errores: {}, coinciden: [] });
    const A = principal(fn, L), neg = L.valor < 0;
    const d = f => derivar(A, f);
    let lista;
    if (fn === 'sen') lista = [
      ['fueraDelRango', 'IN1', d(g => 180 - g)],
      ['vueltaPositiva', 'IN4', d(g => (neg ? 360 + g : g))],
      ['sinSigno', 'TR12', d(g => Math.abs(g))],
      ['comoCoseno', 'IN7', d(g => 90 - g)]];
    else if (fn === 'cos') lista = [
      ['negativo', 'IN2', d(g => (neg ? g - 180 : g))],
      ['fueraDelRango', 'IN1', d(g => 360 - g)],
      ['sinSigno', 'TR12', d(g => (neg ? 180 - g : g))],
      ['comoSeno', 'IN7', d(g => 90 - g)]];
    else if (fn === 'tan') {
      const t = Math.sign(L.valor) || 1;
      lista = [
        ['fueraDelRango', 'IN1', d(g => g + 180)],
        ['vueltaPositiva', 'IN4', d(g => (neg ? 360 + g : g))],
        ['sinSigno', 'TR12', d(g => Math.abs(g))],
        ['comoCot', 'IN26', d(g => 90 - g)],
        ['rangoCerrado', 'IN18', Math.abs(L.valor) >= 10 ? angG(90 * t, false, 90 * t) : null],   // solo con |k| grande
        ['mezcla', 'IN20', angR(A.rad * GR)]];   // el número de radianes leído como grados
    } else lista = [
      ['arctanInverso', 'IN19', L.valor === 0 ? null : d(g => (neg ? g - 180 : g))],
      ['sinSigno', 'TR12', d(g => (neg ? 180 - g : g))],
      ['fueraDelRango', 'IN1', d(g => g + 180)],
      ['comoTan', 'IN26', d(g => 90 - g)]];
    const E = armarErrores(A, lista);
    return Object.assign(base, { existe: true, angulo: A, valor: A.rad, texto: A.texto, textoG: A.textoG, exacto: A.exacto, academia: A.academia }, E);
  }

  // arcsec k = arccos(1/k) y arccsc k = arcsen(1/k), con |k| ≥ 1 (solo para el papel; sin errores típicos)
  function arcoRecip(o) {
    const fn = o.fn, L = leer(o.k), R2 = RANGO2[fn];
    const base = { fn, k: L.texto, rango: R2.texto, dominio: R2.dominio, errores: {}, coinciden: [], repetidos: [] };
    if (Math.abs(L.valor) < 1 - TOL) return Object.assign(base, { existe: false, motivo: `${L.texto} está entre −1 y 1: ningún ángulo tiene ${fn === 'sec' ? 'secante' : 'cosecante'} ${L.texto}` });
    const inv = L.exacto ? tTexto(tDiv(R(1), L.t)) : 1 / L.valor;
    const A = arco({ fn: fn === 'sec' ? 'cos' : 'sen', k: inv }).angulo;
    return Object.assign(base, { existe: true, angulo: A, valor: A.rad, texto: A.texto, textoG: A.textoG, exacto: A.exacto, academia: A.academia, recipro: exacto(inv).texto });
  }

  // ---------- Todos los cortes de una recta horizontal con la gráfica ----------
  function listaTexto(xs) {
    const t = xs.map(a => a.texto);
    if (t.length <= 1) return t.join('');
    return t.slice(0, -1).join(', ') + ' y ' + t[t.length - 1];
  }
  function familia(fn, A, desde, hasta) {
    const g = A.grados, out = [];
    const semillas = fn === 'sen' ? [g, 180 - g] : fn === 'cos' ? [g, -g] : [g];
    const paso = fn === 'sen' || fn === 'cos' ? 360 : 180;
    for (const s of semillas) {
      let x = s - paso * Math.ceil((s - desde) / paso + 1);
      for (; x < hasta - 1e-9; x += paso) if (x >= desde - 1e-9) out.push(x);
    }
    const uniq = [];
    for (const x of out.sort((p, q) => p - q)) if (!uniq.length || Math.abs(uniq[uniq.length - 1] - x) > 1e-7) uniq.push(x);
    return uniq.map(x => (A.exacto ? angG(x, A.academia, x) : angR(x * GR)));
  }
  function cortes(o) {
    const fn = fnValida(o && o.fn), desde = numero(o.desde, 'desde'), hasta = numero(o.hasta, 'hasta');
    if (!(hasta > desde)) throw new Error('hasta debe ser mayor que desde');
    const P = arco({ fn, k: o.k });
    if (!P.existe) return { fn, k: P.k, existe: false, lista: [], cuantos: 0, texto: '', motivo: P.motivo, errores: {}, coinciden: [] };
    const A = P.angulo;
    // para los de academia, los grados de verdad de cada corte se recalculan con la misma simetría
    const lista = familia(fn, A, desde, hasta).map(x => Object.assign(x, { principal: Math.abs(x.grados - A.grados) < 1e-9 }));
    if (A.academia) for (const x of lista) {
      const n = fn === 'sen' || fn === 'cos' ? 360 : 180, gR = A.gradosReal, g = A.grados;
      const k = Math.round((x.grados - g) / n);
      const directo = Math.abs(x.grados - (g + k * n)) < 1e-9;
      const real = directo ? gR + k * n : (fn === 'sen' ? 180 - gR : -gR) + Math.round((x.grados - (fn === 'sen' ? 180 - g : -g)) / n) * n;
      x.gradosReal = real; x.rad = real * GR;
    }
    const r = { fn, k: P.k, existe: true, principal: A, lista, cuantos: lista.length, texto: listaTexto(lista) };
    const errores = {}, coinciden = [];
    if (fn === 'sen' && !o.sinErrores) {
      const pos = lista.filter(x => x.grados >= desde);
      const cand = {
        una: { id: 'TR22', lista: pos.slice(0, 1) },
        sinSigno: { id: 'TR12', lista: (() => { const Q = cortes({ fn, k: tTexto(tNeg(leer(o.k).t || R(0))), desde, hasta, sinErrores: true }); return lista.concat(leer(o.k).valor === 0 ? [] : Q.lista).sort((p, q) => p.grados - q.grados); })() },
        comoCoseno: { id: 'IN7', lista: cortes({ fn: 'cos', k: o.k, desde, hasta, sinErrores: true }).lista }
      };
      if (!leer(o.k).exacto) delete cand.sinSigno;
      for (const [k, e] of Object.entries(cand)) {
        const texto = listaTexto(e.lista);
        if (texto === r.texto) coinciden.push(k);
        else errores[k] = { id: e.id, lista: e.lista, cuantos: e.lista.length, texto };
      }
    }
    return Object.assign(r, { errores, coinciden });
  }

  // ---------- arcfn(fn φ) ----------
  const mod = (a, n) => ((a % n) + n) % n;
  function arcoDe(o) {
    const fn = fnValida(o && o.fn), phi = numero(o.grados, 'grados');
    let th;
    if (fn === 'sen') { const g = mod(phi + 90, 360) - 90; th = g <= 90 ? g : 180 - g; }
    else if (fn === 'cos') { const g = mod(phi, 360); th = g <= 180 ? g : 360 - g; }
    else if (fn === 'tan') { th = mod(phi + 90, 180) - 90; if (Math.abs(th + 90) < 1e-9) return { fn, grados: phi, existe: false, motivo: `tan ${textoGrados(phi)} no existe`, errores: {}, coinciden: [] }; }
    else { th = mod(phi, 180); if (Math.abs(th) < 1e-9) return { fn, grados: phi, existe: false, motivo: `cot ${textoGrados(phi)} no existe`, errores: {}, coinciden: [] }; }
    const entero = Math.abs(phi - Math.round(phi)) < 1e-9;
    const mk = g => (entero ? angG(g) : angR(g * GR));
    const A = mk(th);
    const lista = fn === 'sen' ? [['siempre', 'IN3', mk(phi)], ['complemento', 'TR14', mk(90 - th)], ['signo', 'IN24', mk(-th)]]
      : fn === 'cos' ? [['siempre', 'IN3', mk(phi)], ['vuelta', 'IN4', mk(mod(phi, 360))], ['impar', 'IN25', mk(180 - th)]]
      : fn === 'tan' ? [['siempre', 'IN3', mk(phi)], ['sinSigno', 'TR12', mk(Math.abs(th))], ['vuelta', 'IN4', mk(th < 0 ? th + 360 : th)]]
      : [['siempre', 'IN3', mk(phi)], ['fueraDelRango', 'IN1', mk(th + 180)]];
    const E = armarErrores(A, lista);
    // en esta función el texto principal va en grados (como el dato)
    for (const e of Object.values(E.errores)) { e.textoR = e.texto; e.texto = e.textoG; }
    return Object.assign({ fn, grados: phi, existe: true, angulo: A, valor: A.grados, texto: A.textoG, textoRad: A.textoRad,
      igual: Math.abs(A.grados - phi) < 1e-9, razon: { sen: Math.sin, cos: Math.cos, tan: Math.tan, cot: x => 1 / Math.tan(x) }[fn](phi * GR) }, E);
  }

  // ---------- ¿Este tramo sirve de ventana? ----------
  function ventana(o) {
    const fn = fnValida(o && o.fn, ['sen', 'cos']), desde = numero(o.desde, 'desde'), hasta = numero(o.hasta, 'hasta');
    if (!(hasta > desde)) throw new Error('hasta debe ser mayor que desde');
    const f = g => (fn === 'sen' ? Math.sin(g * GR) : Math.cos(g * GR));
    // la derivada (cos o −sen) no puede cambiar de signo dentro del tramo: los extremos están en múltiplos de 180 (cos: de 180 desde 0; sen: 90 + 180n)
    const crit = [];
    const c0 = fn === 'sen' ? 90 : 0;
    for (let x = c0 + 180 * Math.ceil((desde - c0) / 180); x <= hasta + 1e-9; x += 180) crit.push(x);
    const interiores = crit.filter(x => x > desde + 1e-9 && x < hasta - 1e-9);
    const inyectiva = interiores.length === 0;
    const vals = [f(desde), f(hasta)].concat(crit.filter(x => x >= desde - 1e-9 && x <= hasta + 1e-9).map(f));
    const min = Math.min(...vals) + 0, max = Math.max(...vals) + 0;
    const cubre = min <= -1 + 1e-9 && max >= 1 - 1e-9;
    let repetido = null, falta = null;
    if (!inyectiva) {
      for (const k of ['1/2', '-1/2', '√2/2', '-√2/2', '√3/2', '-√3/2', '0']) {
        const C = cortes({ fn, k, desde, hasta: hasta + 1e-7 });
        if (C.cuantos >= 2) { repetido = { k: leer(k).texto, cortes: C.lista.map(x => x.textoG) }; break; }
      }
    }
    if (!cubre) {
      for (const k of ['-1/2', '1/2', '-1', '1', '-√2/2', '√2/2']) {
        const v = leer(k).valor;
        if (v < min - 1e-9 || v > max + 1e-9) { falta = { k: leer(k).texto }; break; }
      }
    }
    return { fn, desde, hasta, inyectiva, cubre, sirve: inyectiva && cubre, min, max, repetido, falta };
  }

  // ---------- Compuestas con el triángulo ----------
  const EXT = ['sen', 'cos', 'tan', 'cot', 'sec', 'csc'];
  function compuesta(o) {
    const ext = fnValida(o && o.ext, EXT), inv = fnValida(o.inv, ['sen', 'cos', 'tan']);
    const L = leer(o.k);
    const A = arco({ fn: inv, k: o.k });
    if (!A.existe) return { ext, inv, k: L.texto, existe: false, motivo: A.motivo, errores: {}, coinciden: [] };
    if (!L.exacto) throw new Error('compuesta pide k exacto (\'3/5\', \'−√2/2\')');
    const k = L.t, uno = R(1);
    let op, ady, hip, raiz;   // raiz: el lado que sale con Pitágoras
    if (inv === 'sen') { op = k; hip = uno; ady = tRaiz(tMenos(uno, tCuadrado(k))); raiz = 'ady'; }
    else if (inv === 'cos') { ady = k; hip = uno; op = tRaiz(tMenos(uno, tCuadrado(k))); raiz = 'op'; }
    else { op = k; ady = uno; hip = tRaiz(tMas(uno, tCuadrado(k))); raiz = 'hip'; }
    const lados = { op, ady, hip };
    const razon = (S, e) => {
      const p = { sen: ['op', 'hip'], cos: ['ady', 'hip'], tan: ['op', 'ady'], cot: ['ady', 'op'], sec: ['hip', 'ady'], csc: ['hip', 'op'] }[e];
      if (S[p[1]].n === 0) return null;
      return tDiv(S[p[0]], S[p[1]]);
    };
    const v = razon(lados, ext);
    const base = { ext, inv, k: L.texto, angulo: A.angulo,
      lados: { op: { valor: tVal(op), texto: tTexto(op) }, ady: { valor: tVal(ady), texto: tTexto(ady) }, hip: { valor: tVal(hip), texto: tTexto(hip) } }, raiz };
    // los lados sin denominadores (3, 4, 5): por el mcm de los denominadores
    const m = [op, ady, hip].reduce((s, x) => mcm(s, x.d), 1);
    base.enteros = { op: tTexto(tMul(op, R(m))), ady: tTexto(tMul(ady, R(m))), hip: tTexto(tMul(hip, R(m))), factor: m };
    if (!v) return Object.assign(base, { existe: false, motivo: `${ext} no existe: el cateto del denominador vale 0`, errores: {}, coinciden: [] });
    const num = t => ({ valor: tVal(t), texto: tTexto(t) });
    const lista = [];
    if (ext !== inv) lista.push(['cancela', 'IN8', num(k)]);
    // sin raíz: el lado de Pitágoras queda como su cuadrado (1 − k² o 1 + k²)
    const usaRaiz = { sen: ['op', 'hip'], cos: ['ady', 'hip'], tan: ['op', 'ady'], cot: ['ady', 'op'], sec: ['hip', 'ady'], csc: ['hip', 'op'] }[ext].includes(raiz);
    if (usaRaiz) { const S = Object.assign({}, lados, { [raiz]: tCuadrado(lados[raiz]) }); const w = razon(S, ext); if (w) lista.push(['sinRaiz', 'IN9', num(w)]); }
    if (v.n !== 0) lista.push(['reciproca', 'IN10', num(tDiv(uno, v))]);
    if (k.n < 0) lista.push(['signoDeK', 'IN29', num(v.n > 0 ? tNeg(v) : v)]);
    const E = armarErrores(num(v), lista, x => x.valor);
    return Object.assign(base, { existe: true, valor: tVal(v), texto: tTexto(v) }, E);
  }

  // ---------- Dominio de arcfn(a·x + b) ----------
  function intervalo(p, q) { const [x, y] = tVal(p) <= tVal(q) ? [p, q] : [q, p]; return { de: tVal(x), a: tVal(y), texto: `[${tTexto(x)}; ${tTexto(y)}]` }; }
  function dominio(o) {
    const fn = fnValida(o && o.fn), a = racional(o.a, 'a'), b = racional(o.b === undefined ? 0 : o.b, 'b');
    if (a.n === 0) throw new Error('a no puede ser 0');
    if (fn === 'tan' || fn === 'cot') return { fn, de: -Infinity, a: Infinity, texto: 'ℝ', errores: {}, coinciden: [] };
    const uno = R(1), m1 = R(-1);
    const I = intervalo(tDiv(tMenos(m1, b), a), tDiv(tMenos(uno, b), a));
    const lista = [['copia', 'IN14', intervalo(m1, uno)], ['signoB', 'IN15', intervalo(tDiv(tMas(m1, b), a), tDiv(tMas(uno, b), a))],
      ['sinDividir', 'IN16', intervalo(tMenos(m1, b), tMenos(uno, b))]];
    const errores = {}, coinciden = [], repetidos = [];
    for (const [k, id, J] of lista) {
      if (J.texto === I.texto) coinciden.push(k);
      else if (Object.values(errores).some(e => e.texto === J.texto)) repetidos.push(k);
      else errores[k] = Object.assign({ id }, J); }
    const m = Math.abs(a.n), ax = (a.n < 0 ? '−' : '') + (m === 1 ? '' : m) + 'x' + (a.d === 1 ? '' : '/' + a.d);
    return Object.assign({ fn, expresion: ax + (b.n === 0 ? '' : (b.n < 0 ? ' − ' : ' + ') + tTexto(tAbs(b))) }, I, { errores, coinciden, repetidos });
  }
  function dentro(o) {
    const fn = fnValida(o && o.fn), a = racional(o.a, 'a'), b = racional(o.b === undefined ? 0 : o.b, 'b'), x = numero(o.x, 'x');
    const u = tVal(a) * x + tVal(b) + 0;
    return { u, dentro: fn === 'tan' || fn === 'cot' ? true : Math.abs(u) <= 1 + 1e-12 };
  }

  // ---------- arcsen k + arccos k ----------
  const dRad = x => (Math.abs(x) < 1e-12 ? '0 rad' : aprox(x, 2) + ' rad');
  function sumaSenCos(o) {
    const L = leer(o && o.k);
    if (Math.abs(L.valor) > 1 + TOL) throw new Error('k debe estar entre −1 y 1');
    const S = arco({ fn: 'sen', k: o.k }), C = arco({ fn: 'cos', k: o.k });
    const v = S.angulo.rad + C.angulo.rad;
    const ok = { valor: v, decimal: dRad(v) };
    const lista = [['suplementarios', 'IN11', { valor: Math.PI, decimal: dRad(Math.PI), texto: 'π' }],
      ['seAnulan', 'IN12', { valor: 0, decimal: dRad(0), texto: '0' }],
      ['iguales', 'IN13', { valor: 2 * S.angulo.rad, decimal: dRad(2 * S.angulo.rad), texto: `2 arcsen ${L.texto.replace('.', ',')}` }]];
    const E = armarErrores(ok, lista, x => x.valor);
    return Object.assign({ k: L.texto, valor: v, texto: 'π/2', decimal: ok.decimal, arcsen: S.angulo, arccos: C.angulo }, E);
  }

  // ---------- sen⁻¹ k: el ángulo, no un recíproco ----------
  function notacion(o) {
    const fn = fnValida(o && o.fn, ['sen', 'cos', 'tan']), L = leer(o.k);
    const A = arco({ fn, k: o.k });
    if (!A.existe) throw new Error(A.motivo);
    const v = A.angulo.rad, dec = x => (Math.abs(x - Math.round(x)) < 1e-12 ? menos(Math.round(x) + 0) : aprox(x, 2));
    const directa = { sen: Math.sin, cos: Math.cos, tan: Math.tan }[fn](L.valor);
    const otra = arco({ fn: { sen: 'cos', cos: 'sen', tan: 'cot' }[fn], k: o.k }).angulo.rad;
    const lista = [['reciprocoNumero', 'IN6', L.valor === 0 ? null : { valor: 1 / L.valor, decimal: dec(1 / L.valor) }],
      ['reciprocaFuncion', 'IN5', directa === 0 ? null : { valor: 1 / directa, decimal: dec(1 / directa) }],
      ['otraInversa', 'IN7', { valor: otra, decimal: dec(otra) }]];
    const E = armarErrores({ valor: v }, lista, x => x.valor);
    return Object.assign({ fn, k: L.texto, valor: v, decimal: dec(v), angulo: A.angulo }, E);
  }

  // ---------- arctan a + arctan b ----------
  function sumaTan(o) {
    const a = racional(o && o.a, 'a'), b = racional(o.b, 'b');
    const p = tMul(a, b), pv = tVal(p), real = Math.atan(tVal(a)) + Math.atan(tVal(b));
    const ang = t => principal('tan', { t, valor: tVal(t), exacto: true });
    const arcT = t => `arctan(${tTexto(t)})`;
    let A, textoArctan;
    if (Math.abs(pv - 1) < 1e-12) { A = angG(tVal(a) > 0 ? 90 : -90); textoArctan = A.texto; }
    else {
      const t = tDiv(tMas(a, b), tMenos(R(1), p)), base = ang(t);
      const corr = pv > 1 ? (tVal(a) > 0 ? 180 : -180) : 0;
      A = corr ? derivar(base, g => g + corr) : base;
      textoArctan = corr ? `${corr > 0 ? 'π + ' : '−π + '}${arcT(t)}` : arcT(t);
    }
    if (Math.abs(A.rad - real) > 1e-9) {   // de academia (37°, 53°…): el valor de verdad manda en 'valor'
      A = Object.assign({}, A, { rad: real, gradosReal: real / GR });
    }
    const err = (t, extra) => Object.assign({ valor: Math.atan(tVal(t)) + (extra || 0), textoArctan: arcT(t) }, { texto: ang(t).texto });
    const lista = [['lineal', 'IN21', err(tMas(a, b))], ['signoDen', 'IN22', tMas(R(1), p).n === 0 ? null : err(tDiv(tMas(a, b), tMas(R(1), p)))], ['producto', 'IN23', err(p)]];
    if (pv > 1) { const t = tDiv(tMas(a, b), tMenos(R(1), p)); lista.push(['sinCorreccion', 'IN27', err(t)]); }
    const E = armarErrores({ valor: real }, lista, x => x.valor);
    const u = [a.d, a.n], v = [b.d, b.n];
    return Object.assign({ a: tTexto(a), b: tTexto(b), producto: tTexto(p), valor: real, texto: A.texto, textoArctan, angulo: A,
      vectores: { u, v }, direccion: [u[0] * v[0] - u[1] * v[1], u[1] * v[0] + u[0] * v[1]] }, E);
  }

  // ---------- Puntos para dibujar ----------
  function muestras(o) {
    const fn = fnValida(o && o.fn), n = Math.max(8, Math.round(o.n || 240)), tope = o.tope || 4;
    const tramos = [];
    if (o.inversa) {
      const lo = fn === 'sen' || fn === 'cos' ? -1 : numero(o.desde, 'desde'), hi = fn === 'sen' || fn === 'cos' ? 1 : numero(o.hasta, 'hasta');
      const f = { sen: Math.asin, cos: Math.acos, tan: Math.atan, cot: k => Math.PI / 2 - Math.atan(k) }[fn];
      const t = [];
      for (let i = 0; i <= n; i++) { const k = lo + (hi - lo) * i / n; t.push([k, f(fn === 'sen' || fn === 'cos' ? Math.max(-1, Math.min(1, k)) : k)]); }
      tramos.push(t);
      return { fn, inversa: true, tramos };
    }
    const desde = numero(o.desde, 'desde'), hasta = numero(o.hasta, 'hasta');
    const f = { sen: Math.sin, cos: Math.cos, tan: Math.tan, cot: x => Math.cos(x) / Math.sin(x) }[fn];
    let t = [];
    if (fn === 'sen' || fn === 'cos') { for (let i = 0; i <= n; i++) { const x = (desde + (hasta - desde) * i / n) * GR; t.push([x, f(x)]); } tramos.push(t); }
    else {
      // asíntotas: tan en 90 + 180n, cot en 180n
      const c0 = fn === 'tan' ? 90 : 0, cortesA = [];
      for (let x = c0 + 180 * Math.ceil((desde - c0) / 180); x <= hasta; x += 180) cortesA.push(x);
      const bordes = [desde].concat(cortesA, [hasta]);
      for (let j = 0; j < bordes.length - 1; j++) {
        const a0 = bordes[j], a1 = bordes[j + 1]; if (a1 - a0 < 1e-9) continue;
        t = []; const m = Math.max(8, Math.round(n * (a1 - a0) / (hasta - desde)));
        for (let i = 0; i <= m; i++) {
          const g = a0 + (a1 - a0) * i / m;
          if (cortesA.some(c => Math.abs(c - g) < 1e-9)) continue;
          const y = f(g * GR); if (Math.abs(y) <= tope) t.push([g * GR, y]);
        }
        if (t.length > 1) tramos.push(t);
      }
    }
    return { fn, inversa: false, tramos };
  }

  function punto(g) { numero(g, 'el ángulo'); return { x: Math.cos(g * GR) + 0, y: Math.sin(g * GR) + 0 }; }

  return { ERRORES, RANGO, RANGO2, exacto, punto, arco, cortes, arcoDe, ventana, compuesta, dominio, dentro, sumaSenCos, notacion, sumaTan, muestras,
    textoRad, textoGrados, decimal };
});
