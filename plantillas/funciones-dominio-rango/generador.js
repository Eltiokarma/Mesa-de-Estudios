/*
 * Generador «funciones-dominio-rango»: dominio, rango, composición, inyectividad, logaritmos y
 * modelos con funciones. Formato "predicciones" (docs/arquitectura.md); las respuestas que son
 * intervalos o expresiones van con armarTexto y una clave canónica («set:[2,5)U(5,Infinity)»).
 * Funciona en el navegador (window.Generadores['funciones-dominio-rango']) y en Node (require).
 *
 * Tipos (sub) → qué hueco cubre (campo «falta» de las filas del grupo):
 *   composicion (evaluar, despejar)    composición como cadena de dependencias: horas → producción → ganancia
 *   area-entero-abs (total, izquierda) graficar máximo entero junto a valor absoluto y medir la región entre ellas
 *   costo-recipiente (evaluar, formula) costo de un tanque sin tapa con volumen fijo, en función del ancho
 *   rango-exp-abs (sobre, rango)       rango de 2^(|x − a|) + c (o base 1/2), con dominio ℝ o restringido
 *   dominio-radicales (anidado, irracional) dominio con radicales anidados e inecuación irracional
 *   racional-simplificable (dominio, rango) raíz de un cociente que se simplifica: dominio y rango
 *   inyectiva-restringir (raiz, minimo) restringir el dominio para que una cuadrática (o su raíz) sea inyectiva
 *   clasificar-verbal                  situaciones verbales: inyectiva, sobreyectiva o biyectiva (V o F)
 *   monotonia-vf                       cuadrática restringida, rango de una racional y exponencial trasladada (V o F)
 *   log-entero (ingreso, cifras)       logaritmo decimal entero que fija el argumento; cifras de 2ⁿ o 3ⁿ
 *   logistico (incremento, limite)     modelo logístico con exponencial en el denominador
 *   dominio-log (base-crece, base-decrece) dominio de un logaritmo de otro logaritmo con base variable
 *
 * Notación: intervalos ⟨a; b], [a; +∞⟩, «[2; +∞⟩ − {5}», ℝ; coma decimal; signo «−».
 * Errores: códigos AL del informe docs/investigacion/algebra-funciones-ideas-erroneas.md (AL20, AL21,
 * AL22, AL27, AL28, AL31) y trampas 39 y 42 de docs/clasificacion/trampas-admision-unmsm/aritmetica-algebra.md
 * con ids nuevos (hipótesis). Ningún error de este módulo tiene un dato cuantitativo propio.
 */
(function (root, fabrica) {
  const nodo = typeof module === 'object' && module.exports;
  const api = fabrica(nodo ? require('../../nucleo/azar.js') : root.Azar,
                      nodo ? require('../../nucleo/predicciones.js') : root.Predicciones);
  if (nodo) module.exports = api;
  else (root.Generadores = root.Generadores || {})[api.id] = api;
})(typeof self !== 'undefined' ? self : this, function (Azar, P) {
  'use strict';
  const ID = 'funciones-dominio-rango';
  const INFORME = 'docs/investigacion/algebra-funciones-ideas-erroneas.md';
  const v = P.v, F = x => P.formatear(x, 2);
  const TIPOS = ['composicion', 'area-entero-abs', 'costo-recipiente', 'rango-exp-abs', 'dominio-radicales',
    'racional-simplificable', 'inyectiva-restringir', 'clasificar-verbal', 'monotonia-vf', 'log-entero', 'logistico', 'dominio-log'];

  // Error numérico (armar) y de texto (armarTexto).
  const en = (id, valor, explicacion, respaldo = 'hipotesis', fuente = null) => ({ id, valor, explicacion, respaldo, fuente });
  const et = (id, r, explicacion, respaldo = 'hipotesis', fuente = null) => (r ? { id, clave: r.clave, texto: r.texto, explicacion, respaldo, fuente } : null);

  // ---------- Textos de expresiones ----------
  const SUP = { 0: '⁰', 1: '¹', 2: '²', 3: '³', 4: '⁴', 5: '⁵', 6: '⁶', 7: '⁷', 8: '⁸', 9: '⁹', '−': '⁻', '+': '⁺', x: 'ˣ', t: 'ᵗ', n: 'ⁿ', ' ': '' };
  const SUB = { 0: '₀', 1: '₁', 2: '₂', 3: '₃', 4: '₄', 5: '₅', 6: '₆', 7: '₇', 8: '₈', 9: '₉', '−': '₋', '+': '₊', x: 'ₓ', ' ': '', '(': '₍', ')': '₎' };
  const sup = s => [...String(s)].map(c => SUP[c] ?? c).join('');
  const sub = s => [...String(s)].map(c => SUB[c] ?? c).join('');
  // Polinomio en x con coeficientes de mayor a menor grado: [1, −5, 6] → «x² − 5x + 6».
  function poli(coefs) {
    const g0 = coefs.length - 1; let t = '';
    coefs.forEach((c, i) => {
      const g = g0 - i; if (!c) return;
      const a = Math.abs(c), lit = g === 0 ? String(a) : (a === 1 ? '' : a) + 'x' + (g > 1 ? sup(g) : '');
      t += t === '' ? (c < 0 ? '−' : '') + lit : (c < 0 ? ' − ' : ' + ') + lit;
    });
    return t || '0';
  }
  const xm = s => poli([1, -s]);           // x − s
  const mx = c => poli([-1, c]).replace(/^−x \+ (\d+)$/, '$1 − x').replace(/^−x − (\d+)$/, '−$1 − x').replace(/^−x$/, '−x'); // c − x
  const mas = c => (c === 0 ? '' : c > 0 ? ` + ${c}` : ` − ${-c}`);

  // ---------- Conjuntos de números reales (uniones de intervalos) ----------
  const INF = Infinity;
  const pz = (lo, hi, cl, cr) => ({ lo, hi, cl: lo === -INF ? false : !!cl, cr: hi === INF ? false : !!cr });
  function normal(ps) {
    const l = ps.filter(p => p.lo < p.hi || (p.lo === p.hi && p.cl && p.cr)).map(p => ({ ...p }))
      .sort((a, b) => a.lo - b.lo || (b.cl ? 1 : 0) - (a.cl ? 1 : 0));
    const out = [];
    for (const p of l) {
      const u = out[out.length - 1];
      if (u && (p.lo < u.hi || (p.lo === u.hi && (u.cr || p.cl)))) {
        if (p.hi > u.hi) { u.hi = p.hi; u.cr = p.cr; } else if (p.hi === u.hi) u.cr = u.cr || p.cr;
      } else out.push(p);
    }
    return out;
  }
  function inter(A, B) {
    const r = [];
    for (const a of A) for (const b of B) {
      const lo = Math.max(a.lo, b.lo), hi = Math.min(a.hi, b.hi);
      const cl = (a.lo === lo ? a.cl : true) && (b.lo === lo ? b.cl : true);
      const cr = (a.hi === hi ? a.cr : true) && (b.hi === hi ? b.cr : true);
      r.push(pz(lo, hi, cl, cr));
    }
    return normal(r);
  }
  function sinPunto(A, x) {
    const r = [];
    for (const a of A) {
      if (x < a.lo || x > a.hi || (x === a.lo && !a.cl) || (x === a.hi && !a.cr)) { r.push(a); continue; }
      r.push(pz(a.lo, x, a.cl, false), pz(x, a.hi, false, a.cr));
    }
    return normal(r);
  }
  const tn = x => (x === INF ? '+∞' : x === -INF ? '−∞' : P.formatear(x));
  function tPieza(p) {
    if (p.lo === p.hi) return `{${tn(p.lo)}}`;
    if (p.lo === -INF && p.hi === INF) return 'ℝ';
    return (p.cl ? '[' : '⟨') + tn(p.lo) + '; ' + tn(p.hi) + (p.cr ? ']' : '⟩');
  }
  // { clave, texto } de una unión de intervalos. Si los huecos son solo puntos: «[2; +∞⟩ − {5}».
  function conj(ps) {
    const s = normal(ps);
    const clave = 'set:' + s.map(p => `${p.cl ? '[' : '('}${p.lo},${p.hi}${p.cr ? ']' : ')'}`).join('U');
    if (!s.length) return { clave, texto: '∅' };
    let puntos = s.length > 1; const huecos = [];
    for (let i = 0; i + 1 < s.length; i++) {
      const a = s[i], b = s[i + 1];
      if (a.hi === b.lo && !a.cr && !b.cl && a.lo < a.hi && b.lo < b.hi) huecos.push(a.hi); else puntos = false;
    }
    const texto = puntos ? `${tPieza(pz(s[0].lo, s[s.length - 1].hi, s[0].cl, s[s.length - 1].cr))} − {${huecos.map(tn).join('; ')}}`
      : s.map(tPieza).join(' ∪ ');
    return { clave, texto };
  }
  const R = [pz(-INF, INF)];

  // ---------- Generación ----------
  function generar(semilla) {
    const rng = Azar.crear(`${ID}|` + semilla);
    const tipo = rng.elegir(TIPOS);
    for (let intento = 0; intento < 2000; intento++) {
      const d = SORTEO[tipo](rng);
      if (!d) continue;
      const pr = construir(d, rng, semilla);
      if (pr && pr.alternativas.length >= 4) return pr;
    }
    throw new Error('No se pudo generar un problema con 4 alternativas distintas');
  }

  // La respuesta de unos datos dados (para papel.json y para recalcular casos).
  function resolver(datos) {
    const o = ARMAR[datos.tipo](datos);
    return o.texto ? { valor: o.correcta.clave, texto: o.correcta.texto } : { valor: o.correcta, texto: F(o.correcta) + (o.unidad ? ' ' + o.unidad : '') };
  }

  function construir(d, rng, semilla) {
    const o = ARMAR[d.tipo](d);
    if (!o) return null;
    let alternativas, respuesta;
    if (o.texto) {
      alternativas = P.armarTexto({ correcta: o.correcta, errores: o.errores.filter(Boolean), rng });
      respuesta = { valor: o.correcta.clave, texto: o.correcta.texto, unidad: '' };
    } else {
      const limpio = x => Number.isFinite(x) && Math.abs(x * 100 - Math.round(x * 100)) < 1e-7;
      if (!limpio(o.correcta)) return null;
      alternativas = P.armar({ correcta: o.correcta, errores: o.errores.filter(e => limpio(e.valor)), rng, unidad: o.unidad || '', negativos: !!o.negativos, texto: o.fmt || null });
      respuesta = { valor: o.correcta, unidad: o.unidad || '' };
    }
    return { id: `${ID}#${semilla}`, variables: o.variables, enunciado: o.enunciado, pregunta: o.pregunta, datos: '',
      alternativas, solucion: o.solucion, respuesta, _datos: d };
  }

  const SORTEO = {}, ARMAR = {};

  // ===== composicion: horas → producción → ganancia =====
  SORTEO.composicion = rng => {
    const ctx = rng.elegir(['chompas', 'papa']), sub = rng.elegir(['evaluar', 'despejar']);
    const d = ctx === 'chompas'
      ? { a: rng.entero(3, 8), b: rng.entero(2, 10), p: rng.elegir([15, 20, 25, 30]), F: rng.elegir([50, 80, 100, 120]) }
      : { a: rng.entero(8, 15), b: rng.entero(5, 20), p: rng.elegir([2, 3, 4]), F: rng.elegir([10, 15, 20]) };
    const h0 = rng.entero(2, 8);
    const G = d.p * (d.a * h0 + d.b) - d.F;
    if (G <= 0) return null;
    return sub === 'evaluar' ? { tipo: 'composicion', sub, ctx, ...d, h0 } : { tipo: 'composicion', sub, ctx, ...d, G };
  };
  ARMAR.composicion = d => {
    const { a, b, p } = d, Fj = d.F, ch = d.ctx === 'chompas';
    const variables = { h: { nombre: ch ? 'horas de trabajo' : 'horas de venta', color: 'o' }, c: { nombre: ch ? 'chompas producidas' : 'kilos vendidos', color: 'i' }, G: { nombre: ch ? 'ganancia del día' : 'ingreso neto', color: 'h' } };
    const c = ch ? 'c' : 'k', h = ch ? 'h' : 't', Gn = ch ? 'G' : 'I';
    const fc = x => a * x + b, fG = y => p * y - Fj;
    const enunciado = ch
      ? ['En un taller de Juliaca, una máquina tejedora deja ', v('c', `${c}(${h}) = ${poli([a, b]).replace('x', h)}`), ' chompas listas después de ', v('h', `${h} horas`), ` de trabajo (${b} ya estaban tejidas al empezar). La `, v('G', 'ganancia del día'), ', en soles, cuando hay c chompas listas es ', v('G', `${Gn}(${c}) = ${p}${c} − ${Fj}`), ` (${Fj} soles son de luz y lana).`]
      : ['Una vendedora del mercado de Juliaca despacha ', v('c', `${c}(${h}) = ${poli([a, b]).replace('x', h)}`), ' kilos de papa en ', v('h', `${h} horas`), ` (${b} kg los entregó por pedido antes de abrir). Su `, v('G', 'ingreso neto'), ', en soles, por k kilos es ', v('G', `${Gn}(${c}) = ${p}${c} − ${Fj}`), ` (${Fj} soles son del sitio).`];
    if (d.sub === 'evaluar') {
      const h0 = d.h0, c0 = fc(h0), correcta = fG(c0);
      return { variables, enunciado, unidad: 'soles', correcta,
        pregunta: ['¿Cuánto vale ', v('G', `(${Gn}∘${c})(${h0})`), `, es decir, ${ch ? 'la ganancia del día' : 'el ingreso neto'} si ${ch ? 'la máquina trabaja' : 'vende durante'} `, v('h', `${h0} horas`), '?'],
        errores: [
          en('compone-saltando-eslabon', p * h0 - Fj, `Pusiste ${h0} directamente en ${Gn}, como si fueran ${ch ? 'chompas' : 'kilos'}. Primero hay que pasar las horas a ${ch ? 'chompas' : 'kilos'} con ${c}(${h}); recién eso entra en ${Gn}.`),
          en('responde-el-eslabon-intermedio', c0, `Ese es ${c}(${h0}) = ${c0}, ${ch ? 'las chompas' : 'los kilos'}. Falta el segundo paso: meter ese número en ${Gn}.`),
          en('compone-al-reves', fc(fG(h0)), `Compusiste al revés: calculaste ${c}(${Gn}(${h0})). En (${Gn}∘${c})(${h0}) primero actúa ${c}, la función de la derecha.`),
          en('olvida-el-costo-fijo', p * c0, `Te olvidaste de restar los ${Fj} soles fijos de ${Gn}.`),
          en('AL27', c0 * fG(h0), `Multiplicaste ${c}(${h0}) por ${Gn}(${h0}). Componer no es multiplicar: el resultado de ${c} entra en ${Gn}.`, 'hipotesis', INFORME),
        ],
        solucion: [
          ['Primero actúa ', v('c', c), ': ', v('c', `${c}(${h0}) = ${a}·${h0} + ${b} = ${c0}`), ch ? ' chompas.' : ' kilos.'],
          ['Ese número entra en ', v('G', Gn), ': ', v('G', `${Gn}(${c0}) = ${p}·${c0} − ${Fj} = ${F(correcta)}`), ' soles.'],
          ['(', v('G', `${Gn}∘${c}`), `)(${h0}) = `, v('G', `${F(correcta)} soles`), '.'],
        ] };
    }
    const G0 = d.G, c0 = (G0 + Fj) / p, correcta = (c0 - b) / a;
    return { variables, enunciado, unidad: 'horas', correcta,
      pregunta: ['¿Cuántas ', v('h', 'horas'), ` debe ${ch ? 'trabajar la máquina' : 'vender'} para que `, v('G', `(${Gn}∘${c})(${h}) = ${F(G0)}`), ' soles?'],
      errores: [
        en('deshace-solo-un-eslabon', c0, `Ese número son ${ch ? 'las chompas' : 'los kilos'} que dan ${G0} soles. Falta deshacer ${c}(${h}) para llegar a las horas.`),
        en('deshace-en-orden-equivocado', ((G0 - b) / a + Fj) / p, `Deshiciste las funciones en el orden equivocado. Se empieza por la última que actuó (${Gn}) y se termina con la primera (${c}).`),
        en('olvida-el-costo-fijo', (G0 / p - b) / a, `Te olvidaste de los ${Fj} soles fijos: ${p}${c} − ${Fj} = ${G0} da ${c} = (${G0} + ${Fj})/${p}.`),
        en('suma-en-vez-de-restar', (c0 + b) / a, `Al despejar ${a}${h} + ${b} = ${F(c0)}, sumaste ${b} en vez de restarlo.`),
      ],
      solucion: [
        ['Se deshace primero ', v('G', Gn), ': ', v('G', `${p}${c} − ${Fj} = ${G0}`), ' → ', v('c', `${c} = ${F(c0)}`), '.'],
        ['Luego ', v('c', c), ': ', v('c', `${a}${h} + ${b} = ${F(c0)}`), ' → ', v('h', `${h} = ${F(correcta)} horas`), '.'],
      ] };
  };

  // ===== area-entero-abs: región entre y = |x| y y = ⟦x⟧ en [−m; n] =====
  SORTEO['area-entero-abs'] = rng => ({ tipo: 'area-entero-abs', sub: rng.elegir(['total', 'izquierda']), m: rng.entero(1, 3), n: rng.entero(1, 4) });
  ARMAR['area-entero-abs'] = d => {
    const { m, n } = d, tot = d.sub === 'total';
    const izq = m * m + m / 2, der = n / 2;
    const correcta = tot ? izq + der : izq;
    const variables = { f: { nombre: 'f(x) = |x|', color: 'o' }, g: { nombre: 'g(x) = ⟦x⟧', color: 'i' }, A: { nombre: 'área pedida', color: 'h' } };
    const enunciado = ['Se grafican ', v('f', 'f(x) = |x|'), ' y ', v('g', 'g(x) = ⟦x⟧'), ' (máximo entero: el mayor entero que no pasa de x) en ', tot ? `[−${m}; ${n}]` : `[−${m}; 0]`, '.'];
    const pregunta = ['¿Cuál es el ', v('A', 'área'), ' de la región limitada por las dos gráficas', tot ? ` y las rectas x = −${m} y x = ${n}` : ` y las rectas x = −${m} y x = 0`, '?'];
    const ext = tot ? der : 0;
    const pasosIzq = [];
    for (let k = 1; k <= m; k++) pasosIzq.push(`en [−${k}; ${k === 1 ? 0 : '−' + (k - 1)}⟩, ⟦x⟧ = −${k} y la franja es un trapecio de bases ${k - 1} + ${k} = ${2 * k - 1} y ${k} + ${k} = ${2 * k}, área ${F(2 * k - 0.5)}`);
    return { variables, enunciado, pregunta, unidad: 'u²', correcta,
      errores: [
        en('max-entero-hacia-cero', correcta - m, 'Tomaste ⟦x⟧ como si cortara los decimales (⟦−1,5⟧ = −1). El máximo entero baja: ⟦−1,5⟧ = −2, el escalón está un piso más abajo en los negativos.'),
        en('AL22', ext + m / 2, 'Trataste |x| como x también en los negativos. Para x < 0, |x| = −x sube hacia la izquierda: la región se ensancha.', 'parcial', INFORME),
        en('olvida-bajo-el-eje', ext + m * m / 2, 'Contaste solo la parte de la región que está sobre el eje x. En los negativos ⟦x⟧ está bajo el eje y la región también ocupa esa parte.'),
        ...(tot ? [en('solo-una-parte', der, `Contaste solo la parte de la derecha (x ≥ 0). La región también va de x = −${m} a x = 0.`)] : []),
        en('area-bajo-abs', (tot ? n * n / 2 : 0) + m * m / 2, 'Calculaste el área bajo |x| y no restaste nada por g. La región va de una gráfica a la otra: su altura es |x| − ⟦x⟧.'),
      ],
      solucion: [
        ['La altura de la región en cada x es ', v('f', '|x|'), ' − ', v('g', '⟦x⟧'), ': para x ≥ 0 es x − ⟦x⟧ y para x < 0 es −x − ⟦x⟧.'],
        ...(tot ? [[`A la derecha, en cada [k; k + 1⟩ la región es un triángulo de base 1 y altura 1 (área 1/2): ${n} · 1/2 = ${F(der)}.`]] : []),
        [`A la izquierda, ${pasosIzq.join('; ')}. Suma: ${F(izq)}.`],
        [v('A', 'Área'), ' = ', v('A', `${F(correcta)} u²`), '.'],
      ] };
  };

  // ===== costo-recipiente: tanque sin tapa con volumen fijo =====
  SORTEO['costo-recipiente'] = rng => ({ tipo: 'costo-recipiente', sub: rng.elegir(['evaluar', 'formula']), k: rng.elegir([1, 2, 2, 3]), x: rng.entero(1, 3), h: rng.entero(1, 3),
    a: rng.elegir([40, 50, 60, 70, 80]), b: rng.elegir([20, 25, 30, 35, 40, 45]) });
  ARMAR['costo-recipiente'] = d => {
    const { k, x, a, b } = d, V = k * x * x * d.h;
    const forma = k === 1 ? 'base cuadrada' : `base rectangular cuyo largo es ${k === 2 ? 'el doble' : 'el triple'} del ancho`;
    const variables = { x: { nombre: 'ancho de la base', color: 'o' }, h: { nombre: 'altura', color: 'i' }, V: { nombre: 'volumen', color: 'd' }, C: { nombre: 'costo', color: 'h' } };
    const enunciado = ['Se construirá un tanque de concreto para riego, sin tapa, de ', forma, ' y ', v('V', `${V} m³`), ' de capacidad. El metro cuadrado de la base cuesta ', `${a} soles`, ' y el de las paredes, ', `${b} soles`, '.'];
    const paso1 = ['Con ancho ', v('x', 'x'), ` y largo ${k === 1 ? '' : k}x, la `, v('h', 'altura'), ' sale del volumen: ', v('h', `h = ${V}/(${k === 1 ? '' : k + '·'}x²)`), '.'];
    if (d.sub === 'evaluar') {
      const h = d.h, base = k * x * x, par = 2 * (1 + k) * x * h;
      const correcta = a * base + b * par;
      return { variables, enunciado, unidad: 'soles', correcta,
        pregunta: ['Si el ', v('x', `ancho es ${x} m`), ', ¿cuánto ', v('C', 'cuesta'), ' construirlo?'],
        errores: [
          en('incluye-tapa', correcta + a * base, 'Le pusiste tapa: sumaste dos veces el rectángulo de la base. El tanque no tiene tapa.'),
          en('cuatro-paredes-iguales', a * base + b * 4 * k * x * h, `Contaste cuatro paredes iguales a la más larga. Hay dos de ${x} m × ${h} m y dos de ${k * x} m × ${h} m.`),
          en('dos-paredes', a * base + b * par / 2, 'Contaste solo dos paredes (una de cada medida). Un tanque tiene cuatro: dos de cada medida.'),
          en('altura-sin-largo', a * base + b * 2 * (1 + k) * x * (V / (x * x)), `Hallaste la altura con V/x², como si la base fuera de ${x} × ${x}. La base mide ${x} × ${k * x}: h = V/(${k}x²).`),
          en('precios-cambiados', b * base + a * par, 'Cambiaste los precios: el de la base va con la base y el de las paredes con las paredes.'),
        ].filter(e => k > 1 || e.id !== 'altura-sin-largo'),
        solucion: [
          paso1,
          ['Con ', v('x', `x = ${x} m`), ': ', v('h', `h = ${V}/${base} = ${h} m`), '.'],
          [`Base: ${x} · ${k * x} = ${base} m², cuesta ${base} · ${a} = ${F(a * base)} soles. Paredes: 2(${x} · ${h}) + 2(${k * x} · ${h}) = ${par} m², cuestan ${par} · ${b} = ${F(b * par)} soles.`],
          [v('C', 'Costo'), ' = ', v('C', `${F(correcta)} soles`), '.'],
        ] };
    }
    const A = a * k, B = 2 * (1 + k) * b * V / k;
    const cx = (p, q) => ({ clave: `cx:${p}:${q}`, texto: `C(x) = ${p}x² + ${q}/x` });
    return { variables, enunciado, texto: true, correcta: cx(A, B),
      pregunta: ['¿Cuál es el ', v('C', 'costo'), ' en función del ', v('x', 'ancho x'), ' (en metros)?'],
      errores: [
        et('incluye-tapa', cx(2 * A, B), 'Le pusiste tapa: el término de la base salió doble. El tanque no tiene tapa.'),
        et('cuatro-paredes-iguales', cx(A, 4 * b * V), 'Contaste cuatro paredes iguales a la más larga. Hay dos de x por h y dos de largo por h.'),
        et('dos-paredes', cx(A, B / 2), 'Contaste solo dos paredes. Un tanque tiene cuatro: dos de cada medida.'),
        k > 1 ? et('altura-sin-largo', cx(A, B * k), `Hallaste la altura con V/x², como si la base fuera cuadrada. La base mide x por ${k}x: h = V/(${k}x²).`) : null,
        et('precios-cambiados', cx(b * k, 2 * (1 + k) * a * V / k), 'Cambiaste los precios: el de la base va con la base y el de las paredes con las paredes.'),
      ],
      solucion: [
        paso1,
        [`Base: ${k === 1 ? '' : k}x² m², cuesta ${a}·${k === 1 ? '' : k}x² = ${A}x². Paredes: 2·x·h + 2·${k === 1 ? '' : k}x·h = ${2 * (1 + k)}x·h = ${2 * (1 + k)}x · ${V}/(${k === 1 ? '' : k}x²) = ${2 * (1 + k) * V / k}/x m²; cuestan ${b} · ${2 * (1 + k) * V / k}/x = ${B}/x.`],
        [v('C', cx(A, B).texto), '.'],
      ] };
  };

  // ===== rango-exp-abs: f(x) = B^(|x − a|) + c =====
  SORTEO['rango-exp-abs'] = rng => {
    const sub = rng.elegir(['sobre', 'sobre', 'rango']);
    const a = rng.entero(-3, 4), c = rng.elegir([-3, -2, -1, 1, 2, 3, 4, 5]);
    if (sub === 'rango') return { tipo: 'rango-exp-abs', sub, base: rng.elegir(['2', '3', '1/2']), a, c };
    const base = rng.elegir([2, 3]), mx = base === 2 ? 4 : 3;
    const d1 = rng.entero(1, mx), d2 = rng.entero(1, mx);
    if (d1 === d2) return null;
    return { tipo: 'rango-exp-abs', sub, base: String(base), a, c, p: a - d1, q: a + d2 };
  };
  ARMAR['rango-exp-abs'] = d => {
    const { a, c } = d, bt = d.base, B = bt === '1/2' ? 0.5 : Number(bt);
    const ft = `${bt === '1/2' ? '(1/2)' : bt}^(|${xm(a)}|)${mas(c)}`;
    const f = x => B ** Math.abs(x - a) + c;
    const variables = { f: { nombre: 'la función f', color: 'o' }, u: { nombre: `|${xm(a)}|`, color: 'i' }, Rg: { nombre: 'rango', color: 'h' } };
    if (d.sub === 'sobre') {
      const { p, q } = d, m = 1 + c, n = B ** Math.max(a - p, q - a) + c, correcta = m + n;
      const g = x => B ** Math.abs(x + a) + c, du = [Math.abs(p + a), Math.abs(q + a)];
      const minR = (-a >= p && -a <= q) ? 0 : Math.min(...du);
      const errores = [
        en('extremos-en-los-bordes', f(p) + f(q), `Evaluaste solo en los bordes: f(${tn(p)}) y f(${tn(q)}). El mínimo está adentro, en x = ${tn(a)}, donde |${xm(a)}| = 0.`),
        en('AL22', B ** (p - a) + B ** (q - a) + 2 * c, `Trataste |${xm(a)}| como ${xm(a)}, sin el valor absoluto. Con las barras el exponente nunca es negativo: el menor valor de f es ${bt}⁰${mas(c)} = ${tn(m)}.`, 'parcial', INFORME),
        en('olvida-sumar-c', correcta - 2 * c, `Hallaste los extremos de ${bt}^(|${xm(a)}|) pero no les sumaste ${tn(c)}.`),
        en('exponente-cero-da-cero', c + n, `Tomaste ${bt}⁰ = 0. Toda base elevada a 0 da 1: el mínimo de f es 1${mas(c)} = ${tn(m)}.`),
      ];
      const gm = B ** minR + c, gM = B ** Math.max(...du) + c;
      if (gM < 1e4) errores.push(en('AL28', gm + gM, `Pusiste el vértice en x = ${tn(-a)}: |${xm(a)}| vale 0 en x = ${tn(a)}, no en x = ${tn(-a)}.`, 'parcial', INFORME));
      return { variables, unidad: '', negativos: true, correcta, errores,
        enunciado: ['La función ', v('f', `f: [${tn(p)}; ${tn(q)}] → [m; n]`), ', ', v('f', `f(x) = ${ft}`), ', es sobreyectiva.'],
        pregunta: ['¿Cuánto vale m + n?'],
        solucion: [
          ['Sobreyectiva quiere decir que [m; n] es el ', v('Rg', 'rango'), ' de f en ', `[${tn(p)}; ${tn(q)}]`, '.'],
          ['El exponente ', v('u', `|${xm(a)}|`), ` vale 0 en x = ${tn(a)} (que está en el intervalo) y crece al alejarse: llega a ${Math.max(a - p, q - a)} en x = ${tn(a - p > q - a ? p : q)}, el borde más lejano.`],
          [`Como la base es mayor que 1, f es mínima donde el exponente es mínimo: m = ${bt}⁰${mas(c)} = ${tn(m)}; y máxima en el borde más lejano: n = ${bt}${sup(Math.max(a - p, q - a))}${mas(c)} = ${tn(n)}.`],
          ['m + n = ', v('Rg', tn(correcta)), '.'],
        ] };
    }
    const crece = B > 1;
    const corr = crece ? conj([pz(1 + c, INF, true)]) : conj([pz(c, 1 + c, false, true)]);
    const errores = crece ? [
      et('rango-de-la-exponencial', conj([pz(c, INF, false)]), `Ese es el rango de ${bt}ˣ${mas(c)}, sin las barras. Con |${xm(a)}| ≥ 0 el exponente nunca baja de 0, y ${bt}⁰ = 1.`),
      et('excluye-el-minimo', conj([pz(1 + c, INF, false)]), `El valor ${tn(1 + c)} sí se alcanza: en x = ${tn(a)} el exponente es 0 y f = 1${mas(c)}.`),
      et('olvida-sumar-c', conj([pz(1, INF, true)]), `Ese es el rango de ${bt}^(|${xm(a)}|); falta sumar ${tn(c)} a todo.`),
      et('exponente-cero-da-cero', conj([pz(c, INF, true)]), `Tomaste ${bt}⁰ = 0. Toda base elevada a 0 da 1.`),
      et('base-mayor-decrece', conj([pz(c, 1 + c, false, true)]), `Con base ${bt} > 1, la función crece cuando crece el exponente: f no tiene tope por arriba.`),
    ] : [
      et('base-menor-crece', conj([pz(1 + c, INF, true)]), 'Con base 1/2, al crecer el exponente la potencia se achica: f no crece sin límite, se acerca a c por arriba.'),
      et('rango-de-la-exponencial', conj([pz(c, INF, false)]), `Ese es el rango de (1/2)ˣ${mas(c)}, sin las barras. Con |${xm(a)}| ≥ 0, (1/2)^(|${xm(a)}|) ≤ 1.`),
      et('asintota-cerrada', conj([pz(c, 1 + c, true, true)]), `El valor ${tn(c)} nunca se alcanza: (1/2)^(|${xm(a)}|) se acerca a 0 sin llegar.`),
      et('olvida-sumar-c', conj([pz(0, 1, false, true)]), `Ese es el rango de (1/2)^(|${xm(a)}|); falta sumar ${tn(c)} a todo.`),
    ];
    return { variables, texto: true, correcta: corr, errores,
      enunciado: ['Sea ', v('f', `f(x) = ${ft}`), ', con x ∈ ℝ.'],
      pregunta: ['¿Cuál es el ', v('Rg', 'rango'), ' de f?'],
      solucion: [
        ['El exponente ', v('u', `|${xm(a)}|`), ` toma todos los valores de [0; +∞⟩ (vale 0 en x = ${tn(a)}).`],
        crece ? [`Con base ${bt} > 1, ${bt}^u va de ${bt}⁰ = 1 hacia arriba sin tope: [1; +∞⟩.`]
          : ['Con base 1/2 < 1, (1/2)^u va de (1/2)⁰ = 1 hacia abajo, acercándose a 0 sin llegar: ⟨0; 1].'],
        [`Se suma ${tn(c)} a todo: `, v('Rg', corr.texto), '.'],
      ] };
  };

  // ===== dominio-radicales =====
  SORTEO['dominio-radicales'] = rng => {
    const sub = rng.elegir(['anidado', 'irracional']);
    if (sub === 'anidado') return { tipo: 'dominio-radicales', sub, a: rng.entero(-5, 6), c: rng.entero(2, 4), dentro: rng.moneda() };
    const r = rng.entero(2, 5);
    return { tipo: 'dominio-radicales', sub, r, s: rng.entero(-2, 4) };
  };
  ARMAR['dominio-radicales'] = d => {
    const variables = { ext: { nombre: 'radical exterior', color: 'o' }, int: { nombre: 'radical interior', color: 'i' }, D: { nombre: 'dominio', color: 'h' } };
    const pregunta = ['¿Cuál es el ', v('D', 'dominio'), ' de f?'];
    if (d.sub === 'anidado') {
      const { a, c } = d, c2 = c * c;
      if (d.dentro) {
        // f(x) = √(c − √(x − a)): x ≥ a y √(x − a) ≤ c.
        const corr = conj([pz(a, a + c2, true, true)]);
        return { variables, texto: true, correcta: corr, pregunta,
          enunciado: ['Sea ', v('ext', `f(x) = √(${c} − `), v('int', `√(${xm(a)})`), v('ext', ')'), '.'],
          errores: [
            et('olvida-radical-interior', conj([pz(-INF, a + c2, false, true)]), `Olvidaste que el radical interior también pide ${xm(a)} ≥ 0. Sin eso entran valores donde √(${xm(a)}) no existe.`),
            et('no-eleva-al-cuadrado', conj([pz(a, a + c, true, true)]), `De √(${xm(a)}) ≤ ${c} sale ${xm(a)} ≤ ${c2}: se elevan al cuadrado los dos lados (son positivos).`),
            et('solo-radical-interior', conj([pz(a, INF, true)]), `Pusiste solo la condición del radical interior. El exterior pide además ${c} − √(${xm(a)}) ≥ 0.`),
            et('excluye-donde-vale-cero', conj([pz(a, a + c2, true, false)]), `En x = ${tn(a + c2)}, f vale √0 = 0, que sí existe: el extremo va cerrado.`),
          ],
          solucion: [
            ['Radical interior: ', v('int', `${xm(a)} ≥ 0`), ` → x ≥ ${tn(a)}.`],
            ['Radical exterior: ', v('ext', `${c} − √(${xm(a)}) ≥ 0`), ` → √(${xm(a)}) ≤ ${c} → ${xm(a)} ≤ ${c2} → x ≤ ${tn(a + c2)}.`],
            ['Se intersecan: ', v('D', corr.texto), '.'],
          ] };
      }
      // f(x) = √(√(x − a) − c): √(x − a) ≥ c → x ≥ a + c².
      const corr = conj([pz(a + c2, INF, true)]);
      return { variables, texto: true, correcta: corr, pregunta,
        enunciado: ['Sea ', v('ext', 'f(x) = √('), v('int', `√(${xm(a)})`), v('ext', ` − ${c})`), '.'],
        errores: [
          et('no-eleva-al-cuadrado', conj([pz(a + c, INF, true)]), `De √(${xm(a)}) ≥ ${c} sale ${xm(a)} ≥ ${c2}: se elevan al cuadrado los dos lados.`),
          et('solo-radical-interior', conj([pz(a, INF, true)]), `Pusiste solo la condición del radical interior. El exterior pide además √(${xm(a)}) − ${c} ≥ 0.`),
          et('inecuacion-al-reves', conj([pz(a, a + c2, true, true)]), `Pediste √(${xm(a)}) ≤ ${c}, al revés: lo de adentro del radical exterior es √(${xm(a)}) − ${c} y debe ser ≥ 0.`),
          et('excluye-donde-vale-cero', conj([pz(a + c2, INF, false)]), `En x = ${tn(a + c2)}, f vale √0 = 0, que sí existe: el extremo va cerrado.`),
        ],
        solucion: [
          ['Radical interior: ', v('int', `${xm(a)} ≥ 0`), ` → x ≥ ${tn(a)}.`],
          ['Radical exterior: ', v('ext', `√(${xm(a)}) − ${c} ≥ 0`), ` → √(${xm(a)}) ≥ ${c} → ${xm(a)} ≥ ${c2} → x ≥ ${tn(a + c2)}.`],
          ['Se intersecan: ', v('D', corr.texto), '.'],
        ] };
    }
    // f(x) = √((x − s) − √(x − s + k)), k = r(r − 1). Con u = x − s: u ≥ 0 y u² ≥ u + k → u ≥ r.
    const { r, s } = d, k = r * (r - 1), r2 = 1 - r;
    const corr = conj([pz(r + s, INF, true)]);
    return { variables, texto: true, correcta: corr, pregunta,
      enunciado: ['Sea ', v('ext', `f(x) = √(${xm(s)} − `), v('int', `√(${xm(s - k)})`), v('ext', ')'), '.'],
      errores: [
        et('no-interseca', conj([pz(s - k, s + r2, true, true), pz(s + r, INF, true)]), `Elevaste al cuadrado sin pedir antes ${xm(s)} ≥ 0. Si ${xm(s)} es negativo no puede ser mayor o igual que una raíz: el trozo [${tn(s - k)}; ${tn(s + r2)}] no sirve.`),
        et('olvida-radical-interior', conj([pz(-INF, s + r2, false, true), pz(s + r, INF, true)]), `Te faltó la condición del radical interior, ${xm(s - k)} ≥ 0, y la de que ${xm(s)} ≥ 0 antes de elevar al cuadrado.`),
        et('solo-radical-interior', conj([pz(s - k, INF, true)]), `Pusiste solo la condición del radical interior. El exterior pide además ${xm(s)} ≥ √(${xm(s - k)}).`),
        et('signo-de-la-cuadratica-al-reves', conj([pz(Math.max(s, s + r2), s + r, true, true)]), `Tomaste el trozo entre las raíces de la cuadrática. Se pide u² − u − ${k} ≥ 0, que se cumple fuera de las raíces.`),
      ],
      solucion: [
        ['Llama u = ', xm(s), '. Radical interior: ', v('int', `u + ${k} ≥ 0`), '.'],
        ['Radical exterior: ', v('ext', `u ≥ √(u + ${k})`), `. Una raíz nunca es negativa, así que u ≥ 0; con eso se puede elevar al cuadrado: u² ≥ u + ${k}, (u − ${r})(u + ${-r2}) ≥ 0 → u ≤ ${tn(r2)} o u ≥ ${r}.`],
        [`Con u ≥ 0 queda u ≥ ${r}, es decir, ${xm(s)} ≥ ${r}: `, v('D', corr.texto), '.'],
      ] };
  };

  // ===== racional-simplificable: f(x) = √((x − a)(x − b)/(x − a)), a > b =====
  SORTEO['racional-simplificable'] = rng => {
    const b = rng.entero(-4, 5), dd = rng.elegir([1, 4, 9]);
    return { tipo: 'racional-simplificable', sub: rng.elegir(['dominio', 'rango']), a: b + dd, b };
  };
  ARMAR['racional-simplificable'] = d => {
    const { a, b } = d, s = Math.round(Math.sqrt(a - b));
    const num = poli([1, -(a + b), a * b]);
    const variables = { num: { nombre: 'numerador', color: 'o' }, den: { nombre: 'denominador', color: 'i' }, X: { nombre: 'lo que se pide', color: 'h' } };
    const enunciado = ['Sea ', 'f(x) = √[(', v('num', num), ')/(', v('den', xm(a)), ')].'];
    const pasos = [
      ['Se factoriza el numerador: ', v('num', `${num} = (${xm(a)})(${xm(b)})`), '.'],
      ['Si x ≠ ', tn(a), ' se simplifica: f(x) = √(', xm(b), '). Pero ', v('den', `x = ${tn(a)}`), ' sigue fuera: ahí el cociente original no existe.'],
    ];
    if (d.sub === 'dominio') {
      const corr = conj(sinPunto([pz(b, INF, true)], a));
      return { variables, enunciado, texto: true, correcta: corr,
        pregunta: ['¿Cuál es el ', v('X', 'dominio'), ' de f?'],
        errores: [
          et('AL21', conj([pz(b, INF, true)]), `Simplificaste (${xm(a)}) y te olvidaste de que en x = ${tn(a)} el denominador original vale 0: ese valor no entra.`, 'parcial', INFORME),
          et('excluye-donde-vale-cero', conj(sinPunto([pz(b, INF, false)], a)), `En x = ${tn(b)} el cociente vale 0 y √0 = 0 existe: ese extremo va cerrado.`),
          et('ignora-el-denominador', conj([pz(-INF, b, false, true), pz(a, INF, true)]), 'Estudiaste el signo del numerador solo. El signo del cociente depende también del denominador.'),
          et('solo-denominador', conj(sinPunto(R, a)), 'Solo quitaste donde el denominador vale 0. La raíz cuadrada pide además que el cociente no sea negativo.'),
        ],
        solucion: [...pasos,
          ['La raíz pide ', xm(b), ` ≥ 0 → x ≥ ${tn(b)}; y se quita x = ${tn(a)}: `, v('X', corr.texto), '.']] };
    }
    const corr = conj(sinPunto([pz(0, INF, true)], s));
    return { variables, enunciado, texto: true, correcta: corr,
      pregunta: ['¿Cuál es el ', v('X', 'rango'), ' de f?'],
      errores: [
        et('AL21', conj([pz(0, INF, true)]), `Ese es el rango de √(${xm(b)}). Pero x = ${tn(a)} no está en el dominio, y por eso el valor √${a - b} = ${s} tampoco sale.`, 'parcial', INFORME),
        et('excluye-x-en-el-rango', conj(sinPunto([pz(0, INF, true)], a)), `Quitaste del rango el número ${tn(a)}, que es el x excluido. Del rango se quita su imagen: √${a - b} = ${s}.`),
        et('olvida-la-raiz-en-el-rango', conj(sinPunto([pz(0, INF, true)], a - b)), `Quitaste ${a - b}, pero f saca raíz: el valor que falta es √${a - b} = ${s}.`),
        et('rango-abierto', conj(sinPunto([pz(0, INF, false)], s)), `En x = ${tn(b)}, f = √0 = 0: el 0 sí está en el rango.`),
      ],
      solucion: [...pasos,
        [`√(${xm(b)}) con x ≥ ${tn(b)} toma todos los valores de [0; +∞⟩, salvo el que daría x = ${tn(a)}: √(${a - b}) = ${s}.`],
        ['Rango: ', v('X', corr.texto), '.']] };
  };

  // ===== inyectiva-restringir =====
  SORTEO['inyectiva-restringir'] = rng => {
    const sub = rng.elegir(['raiz', 'minimo']);
    if (sub === 'raiz') {
      const h = rng.entero(1, 4), r = rng.entero(2, 5), der = rng.moneda();
      const q = der ? h + rng.entero(1, r) : h - rng.entero(1, r);
      return { tipo: 'inyectiva-restringir', sub, h, r, q };
    }
    const u = rng.entero(-5, 3), w = u + 2 * rng.entero(1, 4);
    return { tipo: 'inyectiva-restringir', sub, u, w, sentido: rng.elegir(['der', 'izq']) };
  };
  ARMAR['inyectiva-restringir'] = d => {
    const variables = { f: { nombre: 'la función', color: 'o' }, h: { nombre: 'abscisa del vértice', color: 'i' }, X: { nombre: 'lo que se pide', color: 'h' } };
    if (d.sub === 'raiz') {
      const { h, r, q } = d, der = q > h, c = r * r - h * h;
      const izqI = pz(h - r, h, true, true), derI = pz(h, h + r, true, true);
      const corr = conj([der ? derI : izqI]);
      return { variables, texto: true, correcta: corr,
        enunciado: ['Sea ', v('f', `f(x) = √(${poli([-1, 2 * h, c])})`), '.'],
        pregunta: ['¿Cuál es el mayor intervalo que contiene a x = ', tn(q), ' en el que f es inyectiva?'],
        errores: [
          et('todo-el-dominio', conj([pz(h - r, h + r, true, true)]), `Ese es todo el dominio. Ahí f no es inyectiva: f(${tn(h - 1)}) = f(${tn(h + 1)}), porque la gráfica es una semicircunferencia que sube y baja.`),
          et('otra-rama', conj([der ? izqI : derI]), `En ese tramo f sí es inyectiva, pero no contiene a x = ${tn(q)}.`),
          et('vertice-signo-cambiado', conj([der ? pz(-h, -h + r, true, true) : pz(-h - r, -h, true, true)]), `Pusiste el vértice en x = ${tn(-h)}. Al completar cuadrados, ${poli([-1, 2 * h, c])} = ${r * r} − (${xm(h)})²: el vértice está en x = ${h}.`),
          et('excluye-extremos', conj([der ? pz(h, h + r, false, false) : pz(h - r, h, false, false)]), 'Los extremos también entran: en ellos f existe y sigue sin repetir valores.'),
        ],
        solucion: [
          ['Se completan cuadrados: ', v('f', `${poli([-1, 2 * h, c])} = ${r * r} − (${xm(h)})²`), `. El dominio es [${tn(h - r)}; ${tn(h + r)}].`],
          ['La gráfica es media circunferencia de centro (', v('h', tn(h)), '; 0): sube hasta ', v('h', `x = ${h}`), ' y luego baja. Es inyectiva solo en un lado del vértice.'],
          [`x = ${tn(q)} está a la ${der ? 'derecha' : 'izquierda'} del vértice: `, v('X', corr.texto), '.'],
        ] };
    }
    const { u, w } = d, hv = (u + w) / 2, B = -(u + w), C = u * w, der = d.sentido === 'der';
    const dom = der ? '[a; +∞⟩' : '⟨−∞; a]';
    return { variables, unidad: '', negativos: true, correcta: hv,
      enunciado: ['La función ', v('f', `g(x) = ${poli([1, B, C])}`), ', con dominio ', dom, ', es inyectiva.'],
      pregunta: [`¿Cuál es el ${der ? 'menor' : 'mayor'} valor posible de `, v('X', 'a'), '?'],
      errores: [
        en(der ? 'raiz-como-extremo' : 'raiz-como-extremo', der ? w : u, `${tn(der ? w : u)} es una raíz de g, no el vértice. g es inyectiva desde el vértice, x = ${tn(hv)}, aunque ahí no corte al eje.`),
        en('raiz-como-extremo', der ? u : w, `${tn(der ? u : w)} es una raíz de g. Lo que separa la parte que baja de la que sube es el vértice.`),
        en('vertice-signo-cambiado', -hv, `El vértice de x² + bx + c está en x = −b/2. Tomaste b/2 y te salió con el signo cambiado.`),
        en('coeficiente-como-vertice', B, `Ese es el coeficiente de x. El vértice está en x = −b/2 = ${tn(hv)}.`),
        en('desde-cero', 0, 'La parábola no tiene por qué cambiar de sentido en x = 0. Cambia en su vértice.'),
      ],
      solucion: [
        ['Una parábola baja hasta su vértice y luego sube: es inyectiva solo a un lado de él.'],
        ['Vértice: ', v('h', `x = −(${tn(B)})/2 = ${tn(hv)}`), '.'],
        [der ? `En [a; +∞⟩ no debe haber parte que baje: a ≥ ${tn(hv)}. El menor es ` : `En ⟨−∞; a] no debe haber parte que suba: a ≤ ${tn(hv)}. El mayor es `, v('X', `a = ${tn(hv)}`), '.'],
      ] };
  };

  // ===== clasificar-verbal =====
  const SITUACIONES = ['combi', 'cumple', 'cuadrado', 'doble', 'mitad'];
  const PROPS = ['inyectiva', 'sobreyectiva', 'biyectiva'];
  SORTEO['clasificar-verbal'] = rng => {
    const tres = rng.barajar(SITUACIONES).slice(0, 3);
    const sits = tres.map(s => {
      const prop = rng.elegir(PROPS);
      if (s === 'combi') { const m = rng.elegir([12, 15, 20]); return { s, prop, m, n: rng.moneda() ? m : rng.entero(6, m - 1) }; }
      if (s === 'cumple') return { s, prop, n: rng.entero(25, 35), todos: rng.moneda() };
      if (s === 'cuadrado') return { s, prop, k: rng.entero(2, 3), exacta: rng.moneda() };
      if (s === 'doble') return { s, prop, n: rng.entero(5, 9), exacta: rng.moneda() };
      return { s, prop, k: rng.entero(20, 60) };
    });
    return { tipo: 'clasificar-verbal', sits };
  };
  // Tamaños del dominio (n) y de la llegada (m), e inyectividad y sobreyectividad por razonamiento.
  function propiedades(t) {
    if (t.s === 'combi') return { n: t.n, m: t.m, iny: true, sob: t.n === t.m };
    if (t.s === 'cumple') return { n: t.n, m: 12, iny: false, sob: t.todos };
    if (t.s === 'cuadrado') return { n: 2 * t.k + 1, m: t.exacta ? t.k + 1 : t.k * t.k + 1, iny: false, sob: t.exacta };
    if (t.s === 'doble') return { n: t.n, m: t.exacta ? t.n : 2 * t.n, iny: true, sob: t.exacta };
    return { n: 2 * t.k, m: t.k, iny: false, sob: true };
  }
  const valorProp = (q, prop) => (prop === 'inyectiva' ? q.iny : prop === 'sobreyectiva' ? q.sob : q.iny && q.sob);
  function textoSit(t, nom) {
    if (t.s === 'combi') return `En una combi de ${t.m} asientos viajan ${t.n} pasajeros, cada uno en un asiento distinto. La función ${nom} asigna a cada pasajero su asiento (conjunto de llegada: los ${t.m} asientos).`;
    if (t.s === 'cumple') return t.todos
      ? `En un aula de ${t.n} alumnos, en cada uno de los 12 meses cumple años al menos un alumno. La función ${nom} asigna a cada alumno el mes de su cumpleaños (llegada: los 12 meses).`
      : `En un taller de ${t.n} alumnos, todos cumplen años en marzo, abril o mayo. La función ${nom} asigna a cada alumno el mes de su cumpleaños (llegada: los 12 meses).`;
    if (t.s === 'cuadrado') {
      const A = []; for (let x = -t.k; x <= t.k; x++) A.push(tn(x));
      const B = t.exacta ? Array.from({ length: t.k + 1 }, (_, i) => i * i) : Array.from({ length: t.k * t.k + 1 }, (_, i) => i);
      return `La función ${nom}: A → B, ${nom}(x) = x², con A = {${A.join('; ')}} y B = {${B.join('; ')}}.`;
    }
    if (t.s === 'doble') return `La función ${nom} asigna a cada número del 1 al ${t.n} su doble; el conjunto de llegada es ${t.exacta ? `{2; 4; 6; …; ${2 * t.n}}` : `{1; 2; 3; …; ${2 * t.n}}`}.`;
    return `Un cuaderno tiene ${2 * t.k} páginas impresas en ${t.k} hojas (dos páginas por hoja). La función ${nom} asigna a cada página la hoja en que está (llegada: las ${t.k} hojas).`;
  }
  const vf = arr => arr.map(b => (b ? 'V' : 'F')).join('');
  const cvf = arr => ({ clave: 'vf:' + vf(arr), texto: vf(arr) });
  ARMAR['clasificar-verbal'] = d => {
    const noms = ['f', 'g', 'h'], rom = ['I', 'II', 'III'], cols = ['o', 'i', 'd'];
    const qs = d.sits.map(propiedades);
    const verdad = d.sits.map((t, i) => valorProp(qs[i], t.prop));
    const swap = d.sits.map((t, i) => valorProp(qs[i], t.prop === 'inyectiva' ? 'sobreyectiva' : t.prop === 'sobreyectiva' ? 'inyectiva' : 'biyectiva'));
    const una = d.sits.map((t, i) => (t.prop === 'biyectiva' ? qs[i].iny || qs[i].sob : verdad[i]));
    const cuenta = d.sits.map((t, i) => { const { n, m } = qs[i]; return t.prop === 'inyectiva' ? n <= m : t.prop === 'sobreyectiva' ? n >= m : n === m; });
    const funcion = d.sits.map((t, i) => (t.prop === 'inyectiva' ? true : t.prop === 'biyectiva' ? qs[i].sob : verdad[i]));
    const variables = { I: { nombre: 'función I', color: 'o' }, II: { nombre: 'función II', color: 'i' }, III: { nombre: 'función III', color: 'd' }, X: { nombre: 'respuesta', color: 'h' } };
    const enunciado = [];
    d.sits.forEach((t, i) => { enunciado.push(v(rom[i], `${rom[i]}.`), ' ', textoSit(t, noms[i]), ' ', v(rom[i], `Afirmación: ${noms[i]} es ${t.prop}.`), i < 2 ? ' ' : ''); });
    const corr = cvf(verdad);
    const razon = (t, q, nom) => {
      const iny = q.iny ? `dos elementos distintos nunca comparten imagen` : (t.s === 'cumple' ? `son ${t.n} alumnos y solo hay 12 meses: al menos dos comparten mes` : t.s === 'cuadrado' ? `${nom}(−1) = ${nom}(1) = 1` : `las páginas 1 y 2 están en la hoja 1`);
      const sob = q.sob ? 'todo elemento de la llegada es imagen de alguno' : (t.s === 'combi' ? `quedan ${t.m - t.n} asientos vacíos` : t.s === 'cumple' ? 'hay meses en que nadie cumple años' : t.s === 'cuadrado' ? 'el 2 de B no es cuadrado de ningún elemento de A' : 'los impares de la llegada no son el doble de nadie');
      return `${q.iny ? 'es inyectiva' : 'no es inyectiva'} (${iny}) y ${q.sob ? 'es sobreyectiva' : 'no es sobreyectiva'} (${sob})`;
    };
    return { variables, enunciado, texto: true, correcta: corr,
      pregunta: ['Indica la secuencia correcta de verdad (V) o falsedad (F) de I, II y III.'],
      errores: [
        et('confunde-inyectiva-con-sobreyectiva', cvf(swap), 'Cambiaste las definiciones. Inyectiva: dos elementos distintos del dominio no comparten imagen. Sobreyectiva: todo elemento del conjunto de llegada es imagen de alguno.'),
        et('biyectiva-con-una-basta', cvf(una), 'Biyectiva pide las dos cosas a la vez: inyectiva y sobreyectiva. Con una sola no basta.'),
        et('decide-por-cantidad', cvf(cuenta), 'Decidiste solo comparando cuántos elementos tiene cada conjunto. Hay que mirar la regla: que haya tantos elementos como en la llegada no asegura que no se repitan imágenes ni que no sobre nada.'),
        et('inyectiva-como-ser-funcion', cvf(funcion), 'Tomaste «inyectiva» como «cada elemento tiene una sola imagen», pero eso lo cumple toda función. Inyectiva pide que dos elementos distintos no lleguen a la misma imagen.'),
      ],
      solucion: [
        ...d.sits.map((t, i) => [v(rom[i], `${rom[i]}.`), ` ${noms[i]} ${razon(t, qs[i], noms[i])}. Entonces «${noms[i]} es ${t.prop}» es ${verdad[i] ? 'verdadera' : 'falsa'}.`]),
        ['Secuencia: ', v('X', corr.texto), '.'],
      ] };
  };

  // ===== monotonia-vf =====
  SORTEO['monotonia-vf'] = rng => {
    const u = rng.entero(-2, 3), w = u + 2 * rng.entero(1, 3), hv = (u + w) / 2;
    const dentro = rng.moneda();
    let p, q;
    if (dentro) { p = hv - rng.entero(1, 3); q = hv + rng.entero(1, 3); }
    else if (rng.moneda()) { p = hv + rng.entero(0, 2); q = p + rng.entero(2, 4); }
    else { q = hv - rng.entero(0, 2); p = q - rng.entero(2, 4); }
    const dd = rng.elegir([-3, -2, 2, 3, 4]), e = rng.elegir([-1, 1, 2, 3, 5]);
    if (e === -dd) return null;
    const p3 = rng.entero(-1, 1), q3 = p3 + rng.entero(2, 3), k = q3 + rng.entero(0, 1), m = rng.entero(-3, 5);
    return { tipo: 'monotonia-vf', u, w, p, q, d: dd, e, rangoUno: rng.moneda(), p3, q3, k, m, afirma: rng.elegir(['crece', 'decrece', 'min', 'max']) };
  };
  ARMAR['monotonia-vf'] = d => {
    const hv = (d.u + d.w) / 2, B = -(d.u + d.w), C = d.u * d.w;
    const V1 = !(d.p < hv && hv < d.q);
    const V2 = d.rangoUno;
    const t = x => 2 ** (d.k - x) + d.m, tp = t(d.p3), tq = t(d.q3);
    const V3 = d.afirma === 'decrece' || d.afirma === 'max';   // t decrece: máximo en p3, mínimo en q3
    const enun3 = d.afirma === 'crece' ? 't es creciente en ese intervalo.' : d.afirma === 'decrece' ? 't es decreciente en ese intervalo.'
      : d.afirma === 'min' ? `el valor mínimo de t es ${tn(tp)}.` : `el valor máximo de t es ${tn(tp)}.`;
    const variables = { I: { nombre: 'afirmación I', color: 'o' }, II: { nombre: 'afirmación II', color: 'i' }, III: { nombre: 'afirmación III', color: 'd' }, X: { nombre: 'respuesta', color: 'h' } };
    const expo = `${d.k === 0 ? '' : d.k}−x`.replace(/^−x$/, '−x');
    const tTxt = `t(x) = 2${sup(expo)}${mas(d.m)}`;
    const enunciado = [
      v('I', 'I.'), ` La función g(x) = ${poli([1, B, C])}, con x ∈ [${tn(d.p)}; ${tn(d.q)}], es inyectiva. `,
      v('II', 'II.'), ` El rango de r(x) = (${xm(-d.e)})/(${xm(d.d)}) es ℝ − {${d.rangoUno ? 1 : tn(d.d)}}. `,
      v('III', 'III.'), ` Si ${tTxt}, con x ∈ [${tn(d.p3)}; ${tn(d.q3)}], ${enun3}`,
    ];
    const verdad = [V1, V2, V3], corr = cvf(verdad);
    const flip = i => cvf(verdad.map((b, j) => (j === i ? !b : b)));
    return { variables, enunciado, texto: true, correcta: corr,
      pregunta: ['Indica la secuencia correcta de verdad (V) o falsedad (F).'],
      errores: [
        V1 ? et('cuadratica-nunca-inyectiva', flip(0), `Una cuadrática sí puede ser inyectiva si el intervalo queda a un solo lado del vértice. Aquí el vértice está en x = ${tn(hv)}, fuera de ⟨${tn(d.p)}; ${tn(d.q)}⟩.`)
          : et('intervalo-con-el-vertice', flip(0), `El intervalo contiene al vértice, x = ${tn(hv)}: g baja y luego sube, así que repite valores (g(${tn(hv - 1)}) = g(${tn(hv + 1)})). Restringir no basta si el vértice queda adentro.`),
        et('rango-excluye-el-valor-del-dominio', flip(1), `Del rango de r se excluye el valor al que se acerca r cuando x crece mucho (1, el cociente de los coeficientes de x), no el ${tn(d.d)} que se quita del dominio. Despejando x de y = r(x) se ve que y = 1 es el único valor imposible.`),
        et('base-mayor-que-uno-crece', flip(2), `La base es 2 > 1, pero el exponente es ${d.k} − x: cuando x crece, el exponente baja. t es decreciente, con su máximo en x = ${tn(d.p3)} y su mínimo en x = ${tn(d.q3)}.`),
      ],
      solucion: [
        [v('I', 'I.'), ` El vértice de g está en x = ${tn(hv)}. ${V1 ? 'Queda fuera del intervalo abierto, así que g solo sube o solo baja ahí: inyectiva. V.' : `Está dentro del intervalo: g(${tn(hv - 1)}) = g(${tn(hv + 1)}). No es inyectiva. F.`}`],
        [v('II', 'II.'), ` Con y = r(x): y(${xm(d.d)}) = ${xm(-d.e)} → x(y − 1) = ${poli([d.d, d.e]).replace('x', 'y')} → x = (${poli([d.d, d.e]).replace('x', 'y')})/(y − 1). Solo y = 1 no tiene x: rango ℝ − {1}. ${V2 ? 'V.' : 'F.'}`],
        [v('III', 'III.'), ` El exponente ${d.k} − x baja cuando x sube, así que t decrece: máximo t(${tn(d.p3)}) = ${tn(tp)} y mínimo t(${tn(d.q3)}) = ${tn(tq)}. ${V3 ? 'V.' : 'F.'}`],
        ['Secuencia: ', v('X', corr.texto), '.'],
      ] };
  };

  // ===== log-entero =====
  const LOGS = { 2: { txt: '0,3010', val: 0.3010 }, 3: { txt: '0,4771', val: 0.4771 } };
  SORTEO['log-entero'] = rng => {
    const sub = rng.elegir(['ingreso', 'cifras']);
    if (sub === 'ingreso') {
      const e = rng.entero(2, 4), A = rng.entero(e + 4, 15), N = 10 ** e;
      const L = rng.elegir([2, 3, 5]) * N / 10, U = rng.elegir([2, 3, 5, 8]) * N;
      return { tipo: 'log-entero', sub, A, L, U };
    }
    const base = rng.elegir([2, 3]), n = rng.entero(15, 60);
    const x = n * Math.log10(base), fr = x - Math.floor(x);
    if (fr < 0.02 || fr > 0.98 || Math.floor(n * LOGS[base].val) !== Math.floor(x)) return null;
    return { tipo: 'log-entero', sub, base, n };
  };
  ARMAR['log-entero'] = d => {
    if (d.sub === 'ingreso') {
      const { A, L, U } = d;
      let e = 0; while (10 ** (e + 1) < U) e++;
      const n = 10 ** e, Pr = A - e, correcta = n * Pr;
      const variables = { n: { nombre: 'cuadernos vendidos', color: 'o' }, Pr: { nombre: 'precio por cuaderno', color: 'i' }, I: { nombre: 'ingreso', color: 'h' } };
      return { variables, unidad: 'soles', correcta,
        enunciado: ['Una librería de Puno vende ', v('n', 'n cuadernos'), ' a un colegio y cobra por cada uno ', v('Pr', `P(n) = ${A} − log n`), ' soles. El colegio pide que el precio sea un número entero de soles, y el pedido tiene más de ', `${F(L)}`, ' y menos de ', `${F(U)}`, ' cuadernos.'],
        pregunta: ['¿Cuánto es el ', v('I', 'ingreso'), ' de la librería por ese pedido?'],
        errores: [
          en('responde-el-precio', Pr, `Ese es el precio de un cuaderno. El ingreso es el precio por la cantidad: ${F(n)} · ${Pr}.`),
          en('log-como-numero-de-cifras', n * (A - e - 1), `Tomaste log ${F(n)} como su número de cifras (${e + 1}). log ${F(n)} = ${e}, porque 10${sup(e)} = ${F(n)}.`),
          en('suma-el-logaritmo', n * (A + e), `Sumaste log n en vez de restarlo: P = ${A} − log n.`),
          en('log-como-cantidad', e * Pr, `Usaste ${e} (el logaritmo) como si fuera la cantidad de cuadernos. La cantidad es n = 10${sup(e)} = ${F(n)}.`),
          en('potencia-fuera-del-rango', 10 * n * (A - e - 1), `${F(10 * n)} también hace entero al logaritmo, pero no cumple «menos de ${F(U)} cuadernos».`),
        ],
        solucion: [
          ['P es entero solo si log n es entero, es decir, si ', v('n', 'n'), ' es una potencia de 10: 10, 100, 1 000, 10 000…'],
          [`Entre ${F(L)} y ${F(U)} la única es `, v('n', `n = ${F(n)}`), ', y ', v('Pr', `P = ${A} − ${e} = ${Pr}`), ' soles.'],
          [v('I', 'Ingreso'), ` = ${F(n)} · ${Pr} = `, v('I', `${F(correcta)} soles`), '.'],
        ] };
    }
    const { base, n } = d, lg = LOGS[base], x = n * lg.val, k = Math.floor(n * Math.log10(base)), correcta = k + 1;
    const variables = { N: { nombre: `${base}${sup(n)}`, color: 'o' }, L: { nombre: `log ${base}`, color: 'i' }, X: { nombre: 'número de cifras', color: 'h' } };
    return { variables, unidad: 'cifras', correcta, fmt: x => `${F(x)} ${x === 1 ? 'cifra' : 'cifras'}`,
      enunciado: ['Se sabe que ', v('L', `log ${base} ≈ ${lg.txt}`), '.'],
      pregunta: ['¿Cuántas ', v('X', 'cifras'), ' tiene ', v('N', `${base}${sup(n)}`), '?'],
      errores: [
        en('cifras-sin-sumar-uno', k, `${k} es la parte entera de log ${base}${sup(n)}. Un número con log entre ${k} y ${k + 1} está entre 10${sup(k)} (que ya tiene ${k + 1} cifras) y 10${sup(k + 1)}: tiene ${k + 1} cifras.`),
        en('cifras-como-exponente', n, `${n} cifras tendría 10${sup(n - 1)}, no ${base}${sup(n)}. Cada factor ${base} agrega menos de una cifra.`),
        en('redondea-hacia-arriba', k + 2, `Redondeaste ${F(x, 2)} hacia arriba y además sumaste 1. Las cifras son la parte entera del logaritmo más 1.`),
        en('AL31', 1, `Tomaste log(${base}${sup(n)}) como (log ${base})${sup(n)}, que es casi 0. La regla es log(${base}${sup(n)}) = ${n} · log ${base}.`, 'parcial', INFORME),
      ],
      solucion: [
        ['log ', v('N', `${base}${sup(n)}`), ` = ${n} · `, v('L', lg.txt), ` = ${P.formatear(x, 4)}.`],
        [`Entonces 10${sup(k)} ≤ ${base}${sup(n)} < 10${sup(k + 1)}: el número tiene la cantidad de cifras de 10${sup(k)}, que es ${k} + 1.`],
        [v('N', `${base}${sup(n)}`), ' tiene ', v('X', `${correcta} cifras`), '.'],
      ] };
  };

  // ===== logistico: P(t) = A/(c + d·b⁻ᵗ) =====
  const mcdE = (x, y) => { while (y) [x, y] = [y, x % y]; return x; };
  const mcmE = (x, y) => x / mcdE(x, y) * y;
  SORTEO.logistico = rng => {
    const sub = rng.elegir(['incremento', 'limite']), b = rng.elegir([2, 3]), t1 = rng.entero(1, b === 2 ? 3 : 2);
    const c = rng.elegir([1, 1, 2, 3, 4]), dd = rng.entero(3, 12);
    const bt = b ** t1, den1 = (c * bt + dd) / mcdE(bt, c * bt + dd);
    const base = mcmE(mcmE(c + dd, c), den1);
    const kmax = Math.floor(20000 / base);
    if (kmax < 1) return null;
    let A = 0;
    for (let i = 0; i < 20 && !A; i++) { const kk = rng.entero(1, kmax); if (base * kk >= 300) A = base * kk; }
    if (!A) return null;
    return { tipo: 'logistico', sub, ctx: rng.elegir(['truchas', 'noticia', 'cuyes']), A, c, d: dd, b, t1 };
  };
  ARMAR.logistico = d => {
    const { A, c, b, t1 } = d, dd = d.d, Pf = t => A / (c + dd * b ** (-t));
    const P0 = Pf(0), P1 = Math.round(Pf(t1)), lim = A / c;
    const ctx = { truchas: ['El número de truchas de una piscigranja en Puno', 'años', 'truchas'], noticia: ['El número de vecinos de un distrito que ya conocen una noticia', 'días', 'vecinos'], cuyes: ['El número de cuyes de una granja en Cusco', 'años', 'cuyes'] }[d.ctx];
    const variables = { t: { nombre: 'tiempo', color: 'o' }, P: { nombre: 'población', color: 'i' }, X: { nombre: 'lo que se pide', color: 'h' } };
    const den = `${c === 1 ? '1' : c} + ${dd}·${b}⁻ᵗ`;
    const enunciado = [`${ctx[0]} se modela con `, v('P', `P(t) = ${A}/(${den})`), ', donde ', v('t', 't'), ` se mide en ${ctx[1]} desde hoy.`];
    const pasoP0 = ['Hoy (', v('t', 't = 0'), `): ${b}⁰ = 1 y `, v('P', `P(0) = ${F(A)}/(${c} + ${dd}) = ${F(P0)}`), '.'];
    if (d.sub === 'incremento') {
      const correcta = P1 - P0;
      return { variables, enunciado, unidad: ctx[2], correcta,
        pregunta: ['¿En cuánto ', v('X', 'aumenta'), ' la población durante los primeros ', v('t', `${t1} ${t1 === 1 ? ctx[1].replace(/s$/, '') : ctx[1]}`), '?'],
        errores: [
          en('responde-el-final', P1, `Esa es la población a los ${t1} ${ctx[1]}, P(${t1}). Se pide cuánto aumentó: P(${t1}) − P(0).`),
          en('responde-el-inicio', P0, 'Esa es la población de hoy, P(0). Falta calcular P en el otro tiempo y restar.'),
          en('usa-el-limite', lim - P0, `Usaste el valor límite (${F(lim)}), al que la población se acerca después de mucho tiempo, no la de los ${t1} ${ctx[1]}.`),
          en('potencia-negativa-como-positiva', P0 - Pf(-t1), `Tomaste ${b}⁻ᵗ como ${b}ᵗ: la población te salió menor que la de hoy y restaste al revés. El exponente negativo da un número pequeño: ${b}${sup('−' + t1)} = 1/${b ** t1}.`),
        ],
        solucion: [
          pasoP0,
          ['A los ', v('t', `${t1} ${ctx[1]}`), `: ${b}${sup('−' + t1)} = 1/${b ** t1} y `, v('P', `P(${t1}) = ${F(A)}/(${c} + ${dd}/${b ** t1}) = ${F(A)} · ${b ** t1}/${c * b ** t1 + dd} = ${F(P1)}`), '.'],
          [v('X', 'Aumento'), ` = ${F(P1)} − ${F(P0)} = `, v('X', `${F(correcta)} ${ctx[2]}`), '.'],
        ] };
    }
    return { variables, enunciado, unidad: ctx[2], correcta: lim,
      pregunta: ['¿A qué valor ', v('X', 'se acerca'), ' la población cuando pasa mucho tiempo?'],
      errores: [
        en('limite-como-inicio', P0, `Ese es P(0), la población de hoy. Con t muy grande, ${b}⁻ᵗ se acerca a 0, no a 1.`),
        en('olvida-el-termino-constante', A, `Si ${b}⁻ᵗ → 0, el denominador se acerca a ${c}, no a 1: hay que dividir ${F(A)} entre ${c}.`),
        en('confunde-coeficientes', A / dd, `Dividiste entre ${dd}, el coeficiente de la potencia, que es justo el término que se apaga.`),
        en('evalua-en-un-tiempo', P1, `Ese es P(${t1}). Mucho tiempo quiere decir que t crece sin parar, y entonces ${b}⁻ᵗ → 0.`),
      ].filter(e => !(e.id === 'olvida-el-termino-constante' && c === 1)),
      solucion: [
        ['Cuando ', v('t', 't'), ` crece mucho, ${b}⁻ᵗ = 1/${b}ᵗ se hace muy pequeño: ${dd}·${b}⁻ᵗ → 0.`],
        ['El denominador se acerca a ', String(c), ': ', v('P', `P(t) → ${F(A)}/${c}`), ' = ', v('X', `${F(lim)} ${ctx[2]}`), '.'],
      ] };
  };

  // ===== dominio-log: logaritmo de un logaritmo, con base variable =====
  SORTEO['dominio-log'] = rng => {
    const a = rng.entero(-3, 4), c = a + rng.entero(4, 8);
    return { tipo: 'dominio-log', sub: rng.elegir(['base-crece', 'base-decrece']), a, c, bi: rng.elegir([2, 3]) };
  };
  ARMAR['dominio-log'] = d => {
    const { a, c, bi } = d, crece = d.sub === 'base-crece';
    const variables = { b: { nombre: 'base variable', color: 'o' }, ar: { nombre: 'logaritmo interior', color: 'i' }, D: { nombre: 'dominio', color: 'h' } };
    const baseT = crece ? xm(a) : mx(c), inT = crece ? mx(c) : xm(a);
    const enunciado = ['Sea f(x) = log', v('b', sub(`(${baseT})`)), '[', v('ar', `log${sub(bi)}(${inT})`), '].'];
    const pregunta = ['¿Cuál es el ', v('D', 'dominio'), ' de f?'];
    if (crece) {
      const corr = conj(sinPunto([pz(a, c - 1, false, false)], a + 1));
      return { variables, enunciado, pregunta, texto: true, correcta: corr,
        errores: [
          et('solo-argumento-positivo', conj(sinPunto([pz(a, c, false, false)], a + 1)), `Pediste solo ${inT} > 0. El argumento de f es log${sub(bi)}(${inT}), y es ese logaritmo el que debe ser positivo: ${inT} > 1.`),
          et('acepta-base-uno', conj([pz(a, c - 1, false, false)]), `La base no puede valer 1: ${xm(a)} ≠ 1, así que x = ${tn(a + 1)} se excluye.`),
          et('AL20', conj([pz(c - 1, INF, false)]), `De ${inT} > 1 sale x < ${tn(c - 1)}: al pasar −x se invierte el sentido de la desigualdad.`, 'hipotesis', INFORME),
          et('olvida-la-base', conj([pz(-INF, c - 1, false, false)]), `Falta la condición de la base: ${xm(a)} > 0 y ${xm(a)} ≠ 1.`),
        ],
        solucion: [
          ['Base: ', v('b', `${xm(a)} > 0`), ' y ', v('b', `${xm(a)} ≠ 1`), ` → x > ${tn(a)} y x ≠ ${tn(a + 1)}.`],
          ['Argumento de f: ', v('ar', `log${sub(bi)}(${inT}) > 0`), ` → ${inT} > 1 → x < ${tn(c - 1)} (esto ya incluye ${inT} > 0).`],
          ['Se intersecan: ', v('D', corr.texto), '.'],
        ] };
    }
    const corr = conj(sinPunto([pz(a + 1, c, false, false)], c - 1));
    return { variables, enunciado, pregunta, texto: true, correcta: corr,
      errores: [
        et('solo-argumento-positivo', conj(sinPunto([pz(a, c, false, false)], c - 1)), `Pediste solo ${inT} > 0. El argumento de f es log${sub(bi)}(${inT}), y es ese logaritmo el que debe ser positivo: ${inT} > 1.`),
        et('acepta-base-uno', conj([pz(a + 1, c, false, false)]), `La base no puede valer 1: ${mx(c)} ≠ 1, así que x = ${tn(c - 1)} se excluye.`),
        et('AL20', conj([pz(c, INF, false)]), `De ${mx(c)} > 0 sale x < ${tn(c)}: al pasar −x se invierte el sentido de la desigualdad.`, 'hipotesis', INFORME),
        et('olvida-la-base', conj([pz(a + 1, INF, false)]), `Falta la condición de la base: ${mx(c)} > 0 y ${mx(c)} ≠ 1.`),
      ],
      solucion: [
        ['Base: ', v('b', `${mx(c)} > 0`), ' y ', v('b', `${mx(c)} ≠ 1`), ` → x < ${tn(c)} y x ≠ ${tn(c - 1)}.`],
        ['Argumento de f: ', v('ar', `log${sub(bi)}(${inT}) > 0`), ` → ${inT} > 1 → x > ${tn(a + 1)}.`],
        ['Se intersecan: ', v('D', corr.texto), '.'],
      ] };
  };

  return { id: ID, titulo: 'Dominio, rango y composición de funciones', generar, resolver, TIPOS, _conj: { conj, pz, sinPunto, inter } };
});
