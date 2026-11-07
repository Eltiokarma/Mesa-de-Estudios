/*
 * Motor de «La flecha en el plano»: números complejos. Potencias de i, forma binómica (suma, resta, producto,
 * conjugado, opuesto, cociente, igualdad), módulo, argumento, forma polar r cis θ, producto y cociente en polar,
 * De Moivre, raíces de números negativos y ecuación cuadrática con Δ < 0.
 *
 * Aquí vive toda la matemática de la plantilla (regla 1 de CLAUDE.md). No toca el DOM: funciona igual en el
 * navegador (window.MotorComplejos) y en Node (require('./motor.js')). Las cuentas son exactas: fracciones y
 * radicales de un solo término (k√m), con m sin factores cuadrados.
 *
 * CONVENCIONES
 *   Un complejo en forma binómica se da como { re, im }: z = re + im·i. Cada parte es un número (entero o decimal
 *   corto), un texto de fracción ('3/5', '−1/2') o de radical ('√3', '−2√3', '√3/2'). Las operaciones binómicas
 *   (sumar, restar, multiplicar, dividir) piden partes racionales; conjugado, opuesto, módulo, argumento y polar
 *   aceptan también radicales. Un complejo en forma polar se da como { r, theta }: r es el módulo (número, fracción
 *   o radical) y theta el argumento en grados sexagesimales (número). Los textos usan el signo menos tipográfico
 *   (−), la coma decimal y la notación de academia: '8 − i', '−3 + 2i', '2 cis 120°', '2 cis (−60°)', '√2 cis 45°'.
 *   El argumento principal va en ⟨−180°; 180°].
 *   Cada función que responde una predicción devuelve { …, texto, num, errores, coinciden }: num es el valor
 *   numérico { re, im } (para comparar), y 'errores' es un objeto cuyas claves son errores típicos; cada uno trae
 *   { texto, num, id, regla }. 'id' es CX1…CX7 o CX10…CX35 (CX8 y CX9 no existen; hipótesis nuestras,
 *   salvo CX17 y CX18, que son parciales: ver docs/investigacion/matematica-avanzada-ideas-erroneas.md), AL9 o
 *   AL11 (docs/investigacion/algebra-funciones-ideas-erroneas.md). Un error que con esos números da el mismo valor que la respuesta correcta
 *   NO va en 'errores': su clave va en la lista 'coinciden'. Un error que no se puede calcular con esos datos (por
 *   ejemplo, dividir parte por parte entre una parte 0) va en 'noAplica'.
 *
 * FUNCIONES EXPORTADAS
 *   texto({ re, im })               → texto binómico: texto({ re: 8, im: -1 }) = '8 − i'; { re: 0, im: 1 } → 'i';
 *                                     { re: -1, im: '√3' } → '−1 + √3 i'; { re: '1/2', im: '-3/2' } → '1/2 − (3/2)i';
 *                                     { re: 0, im: '√3/2' } → '(√3/2)i'.
 *   potenciaI({ n })                → iⁿ con n entero (también negativo). { texto: '1', 'i', '−1' o '−i', num,
 *                                     resto: n mod 4 en {0, 1, 2, 3}, vueltas: ⌊n/4⌋ (vueltas completas de 360°;
 *                                     negativas si n < 0), giro: 90·n (grados), errores (n ≥ 0): cuadradoPositivo
 *                                     (CX1: i² = 1, o sea i si n es impar y 1 si es par), cicloTres (CX2: i³ = i; solo
 *                                     si el resto es 3), cociente (CX3: usa i^⌊n/4⌋, el cociente en vez del resto),
 *                                     corrido (CX4: ciclo corrido, i⁰ = i: da i^(resto + 1)), nVeces (CX5: iⁿ = n·i),
 *                                     sigueI (CX6: i · i = i, o sea iⁿ = i para n ≥ 1, 1 para n = 0); errores (n < 0):
 *                                     comoPositivo (CX25: i^(−n) = iⁿ), seCancelan (CX26: da 1), soloSigno (CX27: da −1) }.
 *   sumar({ z, w }), restar({ z, w }) → { texto, num, valor: { re, im } (textos exactos de cada parte) }.
 *   opuesto({ z })                  → −z: { texto, num, valor }.
 *   conjugado({ z })                → z̄ = a − bi (reflejo en el eje real). { texto, num, valor, errores: cambiaReal
 *                                     (CX12: −a + bi), opuesto (CX13: −a − bi), intercambia (CX14: b − ai) }.
 *   multiplicar({ z, w })           → (a + bi)(c + di) = (ac − bd) + (ad + bc)i. { texto, num, valor, piezas: [ac,
 *                                     ad·i, bc·i, bd·i² ya hecho −bd], cada pieza { texto, num } (en ese orden),
 *                                     errores: partePorParte (CX7: ac + bd·i), cuadradoPositivo (CX1: i² = 1:
 *                                     (ac + bd) + (ad + bc)i), sigueI (CX6: i·i = i: ac + (ad + bc + bd)i) }.
 *   dividir({ z, w })               → z/w multiplicando arriba y abajo por w̄. { texto, num, valor, numerador: { texto,
 *                                     num } (z·w̄), denominador: { texto, num } (|w|² = c² + d²), errores:
 *                                     partePorParte (CX15: a/c + (b/d)i; noAplica si c o d es 0), sinDenominador
 *                                     (CX16: se queda con z·w̄), cuadradoPositivo (CX1: i² = 1 en el numerador, dividido
 *                                     entre c² + d²), porW (CX35: multiplica arriba por w y no por w̄: z·w/(c² + d²)) }.
 *                                     w = 0 lanza «división entre cero».
 *   iguales({ z, w })               → { valor: booleano (partes reales iguales y partes imaginarias iguales) }.
 *   modulo({ z })                   → |z| = √(a² + b²). { texto: '10', '2√2', num: { re: |z|, im: 0 }, valor: |z|
 *                                     (número), cuadrado: texto de a² + b², catetos: [|a|, |b|] (números), areas: [a²,
 *                                     b²] (números), errores: sumaPartes (AL9: |a| + |b|), raizDeSuma (CX10:
 *                                     √(|a| + |b|)), sinRaiz (CX11: a² + b², sin la raíz) }. Los errores de módulo
 *                                     traen num { re: valor, im: 0 }.
 *   argumento({ z })                → Arg z en ⟨−180°; 180°] (z ≠ 0). { grados (número), texto: '120°', positivo:
 *                                     grados en [0°; 360°⟩, cuadrante (1 a 4, o 0 si z está sobre un eje), num: { re:
 *                                     grados, im: 0 }, errores: arctanDirecto (CX17: arctan(b/a) sin mirar el
 *                                     cuadrante; noAplica si a = 0), referencia (CX18: el ángulo agudo con el eje real,
 *                                     sin signo) }.
 *   polar({ z })                    → r cis θ. { r: texto del módulo, theta: grados (argumento principal), texto:
 *                                     '2 cis 120°', num (z), errores (cada uno con el texto polar y su num binómico):
 *                                     arctanDirecto (CX17), referencia (CX18), sinRaiz (CX11: a² + b² como módulo) }.
 *   binomica({ r, theta })          → de polar a binómica: { re, im (números), texto (exacto si θ es notable: múltiplo
 *                                     de 30° o de 45°; si no, con dos decimales y coma), exacto: booleano, num }.
 *   textoPolar({ r, theta })        → '6 cis 35°', '2 cis (−60°)', 'cis 45°' (r = 1); grados no enteros con coma.
 *   productoPolar({ z, w })         → z, w en polar. { r: texto, theta: suma de los argumentos (sin reducir),
 *                                     principal: reducido a ⟨−180°; 180°], texto (polar, con theta), textoDecimal (igual,
 *                                     con el módulo en decimales: '4,6 cis 33°' en vez de '23/5 cis 33°'), num, errores:
 *                                     sumaModulos (CX19: r₁ + r₂), multiplicaArgumentos (CX20: θ₁·θ₂), restaArgumentos
 *                                     (CX21: θ₁ − θ₂) }.
 *   cocientePolar({ z, w })         → z/w en polar. { r, theta: θ₁ − θ₂, principal, texto, num, errores:
 *                                     sumaArgumentos (CX22: θ₁ + θ₂), restaModulos (CX23: r₁ − r₂; noAplica si
 *                                     r₁ − r₂ ≤ 0, porque un módulo negativo no existe), restaAlReves (CX24: θ₂ − θ₁) }.
 *   deMoivre({ z, n })              → zⁿ con z ≠ 0 binómico { re, im } y n entero cualquiera (negativo y 0 también:
 *                                     (1 + i)⁻² = −(1/2)i): rⁿ cis(nθ). { r: texto de rⁿ, theta: n·Arg z (sin reducir),
 *                                     principal: nθ reducido a ⟨−180°; 180°], polar: texto polar con theta, texto: texto
 *                                     binómico (exacto si nθ es notable), num, errores (con texto binómico): reparte
 *                                     (AL11: aⁿ + (bi)ⁿ, el exponente se reparte sobre la suma; se calcula también con
 *                                     partes radicales: (1 + √3 i)³ → 1 − 3√3 i; noAplica si una parte es 0 y n < 0),
 *                                     sinModulo (CX30: r cis(nθ), no eleva el módulo), porN (CX31: n·r cis(nθ),
 *                                     multiplica el módulo por n; noAplica si n ≤ 0) }.
 *   raizNegativa({ a, b })          → √(−a) · √(−b) con a, b enteros positivos. { texto: '−6', num, factores: ['2i',
 *                                     '3i'], errores: juntaRaices (CX28: √(ab), como si fueran positivos), sigueI (CX6:
 *                                     √a·√b·i), noExiste (CX29: 'no existe'; num null) }.
 *   cuadratica({ a, b, c })         → raíces de ax² + bx + c = 0 (a, b, c racionales, a ≠ 0). { delta: número, deltaTexto,
 *                                     raices: [{ texto, num }, …], texto: '2 ± 3i' (Δ < 0; sin parte real: '±3i', pegado),
 *                                     '−1 y 5' (Δ > 0 con raíces racionales), '1 ± √2' o '±√2' (Δ > 0 sin cuadrado
 *                                     perfecto), '3' (Δ = 0, raíz doble, errores {}),
 *                                     suma, producto (textos: −b/a y c/a), errores (solo si Δ < 0; num de la raíz con +):
 *                                     signoB (CX32: usa b en vez de −b), sinDividirIm (CX33: divide la parte real entre
 *                                     2a pero no la imaginaria), sinDividir (CX34: no divide nada entre 2a) }.
 *   giro({ z, grados, escala })     → punto de z girado 'grados' y multiplicado por 'escala' (números): { re, im }.
 *                                     Para dibujar (el producto por w gira Arg w y estira |w|).
 *   decimal(x, d)                   → número con coma decimal y a lo más d decimales (por defecto 2).
 */
(function (root, fabrica) {
  const motor = fabrica();
  if (typeof module === 'object' && module.exports) module.exports = motor;
  else root.MotorComplejos = motor;
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  const MENOS = '−';
  const GR = Math.PI / 180;
  const TOL = 1e-9;

  // ---------- Números exactos k·√m (k fracción, m entero sin cuadrados) ----------
  function mcd(a, b) { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a; }
  function R(n, d, m) {
    if (d === undefined) d = 1;
    if (m === undefined) m = 1;
    if (![n, d, m].every(Number.isSafeInteger)) throw new Error('números demasiado grandes para el motor');
    if (d === 0) throw new Error('división entre cero');
    if (m < 0) throw new Error('el radicando debe ser positivo');
    if (n === 0 || m === 0) return { n: 0, d: 1, m: 1 };
    for (let f = 2; f * f <= m; f++) while (m % (f * f) === 0) { m /= f * f; n *= f; }
    if (d < 0) { n = -n; d = -d; }
    const g = mcd(n, d) || 1;
    return { n: n / g + 0, d: d / g, m };
  }
  const CERO = R(0), UNO = R(1);
  const val = x => (x.n / x.d) * Math.sqrt(x.m);
  const esCero = x => x.n === 0;
  const racional = x => x.m === 1;
  const neg = x => R(-x.n, x.d, x.m);
  const abs = x => R(Math.abs(x.n), x.d, x.m);
  const mul = (x, y) => R(x.n * y.n, x.d * y.d, x.m * y.m);
  function inv(y) { if (esCero(y)) throw new Error('división entre cero'); return R(y.d, y.n * y.m, y.m); }
  const div = (x, y) => mul(x, inv(y));
  function sum(x, y) {
    if (esCero(x)) return y;
    if (esCero(y)) return x;
    if (x.m !== y.m) throw new Error('no se pueden sumar radicales distintos en forma exacta');
    return R(x.n * y.d + y.n * x.d, x.d * y.d, x.m);
  }
  const res = (x, y) => sum(x, neg(y));
  const igual = (x, y) => x.n === y.n && x.d === y.d && x.m === y.m;
  function pot(x, e) { let r = UNO; for (let k = 0; k < e; k++) r = mul(r, x); return r; }
  // raíz cuadrada exacta de un racional no negativo
  function raiz(x) {
    if (!racional(x)) throw new Error('raíz de un radical: fuera del alcance del motor');
    if (x.n < 0) throw new Error('raíz de un negativo');
    return R(1, x.d, x.n * x.d);
  }

  function aR(x, que) {
    que = que || 'la parte';
    if (x && typeof x === 'object' && 'n' in x && 'd' in x) return R(x.n, x.d, x.m || 1);
    if (typeof x === 'string') {
      const s = x.replace(/−/g, '-').replace(/\s+/g, '');
      let m = s.match(/^(-?\d+)(?:\/(\d+))?$/);
      if (m) return R(Number(m[1]), m[2] ? Number(m[2]) : 1);
      m = s.match(/^(-?)(\d*)√(\d+)(?:\/(\d+))?$/);
      if (m) return R((m[1] ? -1 : 1) * (m[2] ? Number(m[2]) : 1), m[4] ? Number(m[4]) : 1, Number(m[3]));
      throw new Error(`${que} debe ser un número, una fracción como 1/2 o un radical como √3`);
    }
    if (typeof x !== 'number' || !Number.isFinite(x)) throw new Error(`${que} debe ser un número`);
    for (let q = 1; q <= 1e6; q *= 10) { const p = Math.round(x * q); if (Math.abs(p / q - x) <= 1e-12 * Math.max(1, Math.abs(x))) return R(p, q); }
    throw new Error(`${que} debe ser exacto (entero, decimal corto, fracción o radical)`);
  }

  function decimal(x, d) {
    if (d === undefined) d = 2;
    const f = Math.pow(10, d);
    let v = Math.round(x * f) / f;
    if (Object.is(v, -0) || Math.abs(v) < 0.5 / f) v = 0;
    let t = String(Math.abs(v));
    if (/e/.test(t)) t = Math.abs(v).toFixed(d).replace(/0+$/, '').replace(/\.$/, '');
    return (v < 0 ? MENOS : '') + t.replace('.', ',');
  }
  // texto de un número exacto sin signo
  function txAbs(x) {
    const n = Math.abs(x.n), d = x.d;
    if (x.m === 1) return d === 1 ? String(n) : `${n}/${d}`;
    const c = n === 1 ? '' : String(n);
    return d === 1 ? `${c}√${x.m}` : `${c}√${x.m}/${d}`;
  }
  const tx = x => (x.n < 0 ? MENOS : '') + txAbs(x);

  // ---------- Complejos exactos { re, im } con partes R ----------
  function C(z, que) {
    que = que || 'z';
    if (!z || typeof z !== 'object' || !('re' in z) || !('im' in z)) throw new Error(`${que} debe ser { re, im }`);
    return { re: aR(z.re, `la parte real de ${que}`), im: aR(z.im, `la parte imaginaria de ${que}`) };
  }
  function soloRacional(z, que) { if (!racional(z.re) || !racional(z.im)) throw new Error(`${que || 'z'} debe tener partes racionales para esta operación`); return z; }
  // coeficiente de i (sin signo): 'i', '4i', '(3/2)i', '√3 i', '2√3 i'
  function txI(y) {
    const a = abs(y);
    if (igual(a, UNO)) return 'i';
    if (a.m === 1) return a.d === 1 ? `${a.n}i` : `(${a.n}/${a.d})i`;
    return a.d === 1 ? `${txAbs(a)} i` : `(${txAbs(a)})i`;
  }
  function textoC(z) {
    const { re, im } = z;
    if (esCero(im)) return tx(re);
    if (esCero(re)) return (im.n < 0 ? MENOS : '') + txI(im);
    return `${tx(re)} ${im.n < 0 ? MENOS : '+'} ${txI(im)}`;
  }
  const numC = z => ({ re: val(z.re) + 0, im: val(z.im) + 0 });
  const valorC = z => ({ re: tx(z.re), im: tx(z.im) });
  const salida = z => ({ texto: textoC(z), num: numC(z), valor: valorC(z) });
  const cMul = (z, w) => ({ re: res(mul(z.re, w.re), mul(z.im, w.im)), im: sum(mul(z.re, w.im), mul(z.im, w.re)) });
  // texto binómico de un par de números (no exactos)
  function textoNum(re, im, d) {
    const a = decimal(re, d), b = decimal(Math.abs(im), d), cero = t => t === '0';
    if (cero(decimal(im, d))) return a;
    const bi = b === '1' ? 'i' : `${b}i`;
    if (cero(a)) return (im < 0 ? MENOS : '') + bi;
    return `${a} ${im < 0 ? MENOS : '+'} ${bi}`;
  }

  const mismoNum = (p, q) => !!p && !!q && Math.abs(p.re - q.re) < TOL * Math.max(1, Math.abs(q.re)) && Math.abs(p.im - q.im) < TOL * Math.max(1, Math.abs(q.im));
  // Arma { errores, coinciden, noAplica }: cada candidato es [clave, id, regla, () => { texto, num }] o null si no aplica
  function errores(correcta, lista) {
    const out = { errores: {}, coinciden: [], noAplica: [] };
    for (const [k, id, regla, f] of lista) {
      let e;
      try { e = f(); } catch (err) { if (/división entre cero|no aplica/.test(err.message)) { out.noAplica.push(k); continue; } throw err; }
      if (e === null) { out.noAplica.push(k); continue; }
      if (e.num !== null && (mismoNum(e.num, correcta.num) || e.texto === correcta.texto)) { out.coinciden.push(k); continue; }
      out.errores[k] = Object.assign({ id, regla }, e);
    }
    return out;
  }

  // ---------- Potencias de i ----------
  const POT_I = [{ re: 1, im: 0, t: '1' }, { re: 0, im: 1, t: 'i' }, { re: -1, im: 0, t: '−1' }, { re: 0, im: -1, t: '−i' }];
  const iA = r => { const p = POT_I[((r % 4) + 4) % 4]; return { texto: p.t, num: { re: p.re, im: p.im } }; };
  function potenciaI(o) {
    const n = o && o.n;
    if (!Number.isSafeInteger(n)) throw new Error('n debe ser un número entero');
    const resto = ((n % 4) + 4) % 4, vueltas = Math.floor(n / 4);
    const base = Object.assign(iA(resto), { n, resto, vueltas, giro: 90 * n });
    const lista = n >= 0 ? [
      ['cuadradoPositivo', 'CX1', 'i² = 1: cada par de factores i da 1, así que iⁿ es i si n es impar y 1 si es par', () => iA(n % 2)],
      ['cicloTres', 'CX2', 'i³ = i: se toma el resto, pero se cree que i³ vale i', () => (resto === 3 ? iA(1) : null)],
      ['cociente', 'CX3', 'se usa el cociente de n entre 4 en lugar del resto', () => iA(vueltas)],
      ['corrido', 'CX4', 'ciclo corrido: se empieza con i⁰ = i, i¹ = −1, …', () => iA(resto + 1)],
      ['nVeces', 'CX5', 'el exponente pasa a multiplicar: iⁿ = n·i', () => ({ texto: n === 0 ? '0' : n === 1 ? 'i' : `${n}i`, num: { re: 0, im: n } })],
      ['sigueI', 'CX6', 'i · i = i: multiplicar i por sí misma no cambia nada', () => (n === 0 ? iA(0) : iA(1))],
    ] : [
      ['comoPositivo', 'CX25', 'el signo del exponente no cambia nada: i^(−n) = iⁿ (como 1/1 = 1)', () => iA(-n)],
      ['seCancelan', 'CX26', 'i^(−n) e iⁿ «se cancelan»: queda 1', () => iA(0)],
      ['soloSigno', 'CX27', 'el exponente negativo deja solo el signo: queda −1', () => iA(2)],
    ];
    return Object.assign(base, errores(base, lista));
  }

  // ---------- Forma binómica ----------
  function sumar(o) { const z = C(o.z, 'z'), w = C(o.w, 'w'); return salida({ re: sum(z.re, w.re), im: sum(z.im, w.im) }); }
  function restar(o) { const z = C(o.z, 'z'), w = C(o.w, 'w'); return salida({ re: res(z.re, w.re), im: res(z.im, w.im) }); }
  function opuesto(o) { const z = C(o.z); return salida({ re: neg(z.re), im: neg(z.im) }); }
  function conjugado(o) {
    const z = C(o.z), r = salida({ re: z.re, im: neg(z.im) });
    return Object.assign(r, errores(r, [
      ['cambiaReal', 'CX12', 'el conjugado cambia el signo de la parte real: −a + bi', () => salida({ re: neg(z.re), im: z.im })],
      ['opuesto', 'CX13', 'el conjugado cambia los dos signos (es el opuesto): −a − bi', () => salida({ re: neg(z.re), im: neg(z.im) })],
      ['intercambia', 'CX14', 'el conjugado intercambia las partes: b − ai', () => salida({ re: z.im, im: neg(z.re) })],
    ]));
  }
  function multiplicar(o) {
    const z = soloRacional(C(o.z, 'z'), 'z'), w = soloRacional(C(o.w, 'w'), 'w');
    const [a, b, c, d] = [z.re, z.im, w.re, w.im];
    const r = salida(cMul(z, w));
    r.piezas = [{ re: mul(a, c), im: CERO }, { re: CERO, im: mul(a, d) }, { re: CERO, im: mul(b, c) }, { re: neg(mul(b, d)), im: CERO }]
      .map(p => ({ texto: textoC(p), num: numC(p) }));
    return Object.assign(r, errores(r, [
      ['partePorParte', 'CX7', 'se multiplica parte por parte: (a + bi)(c + di) = ac + bd·i', () => salida({ re: mul(a, c), im: mul(b, d) })],
      ['cuadradoPositivo', 'CX1', 'i² = 1: el término bd·i² se suma en lugar de restarse', () => salida({ re: sum(mul(a, c), mul(b, d)), im: sum(mul(a, d), mul(b, c)) })],
      ['sigueI', 'CX6', 'i · i = i: el término bd·i² se queda con una i', () => salida({ re: mul(a, c), im: sum(sum(mul(a, d), mul(b, c)), mul(b, d)) })],
    ]));
  }
  function dividir(o) {
    const z = soloRacional(C(o.z, 'z'), 'z'), w = soloRacional(C(o.w, 'w'), 'w');
    const [a, b, c, d] = [z.re, z.im, w.re, w.im];
    const den = sum(mul(c, c), mul(d, d));
    if (esCero(den)) throw new Error('división entre cero');
    const nu = cMul(z, { re: c, im: neg(d) });
    const r = salida({ re: div(nu.re, den), im: div(nu.im, den) });
    r.numerador = { texto: textoC(nu), num: numC(nu) };
    r.denominador = { texto: tx(den), num: { re: val(den), im: 0 } };
    return Object.assign(r, errores(r, [
      ['partePorParte', 'CX15', 'se divide parte por parte: (a + bi)/(c + di) = a/c + (b/d)i', () => (esCero(c) || esCero(d) ? null : salida({ re: div(a, c), im: div(b, d) }))],
      ['sinDenominador', 'CX16', 'se multiplica arriba por el conjugado y se olvida dividir entre c² + d²', () => salida(nu)],
      ['cuadradoPositivo', 'CX1', 'i² = 1 en el numerador: (a + bi)(c − di) da (ac − bd) + (bc − ad)i', () => salida({ re: div(res(mul(a, c), mul(b, d)), den), im: div(nu.im, den) })],
      ['porW', 'CX35', 'se multiplica arriba por w y no por su conjugado w̄: z·w/(c² + d²)', () => { const m = cMul(z, w); return salida({ re: div(m.re, den), im: div(m.im, den) }); }],
    ]));
  }
  function iguales(o) { const z = C(o.z, 'z'), w = C(o.w, 'w'); return { valor: igual(z.re, w.re) && igual(z.im, w.im) }; }

  // ---------- Módulo, argumento, polar ----------
  const real = x => ({ re: x, im: 0 });
  function modulo(o) {
    const z = C(o.z), a2 = mul(z.re, z.re), b2 = mul(z.im, z.im), s = sum(a2, b2), r = raiz(s);
    const base = { texto: tx(r), valor: val(r), num: real(val(r)), cuadrado: tx(s), catetos: [Math.abs(val(z.re)), Math.abs(val(z.im))], areas: [val(a2), val(b2)] };
    const sumaAbs = () => { const A = abs(z.re), B = abs(z.im); return A.m === B.m ? sum(A, B) : null; };
    return Object.assign(base, errores(base, [
      ['sumaPartes', 'AL9', 'el módulo es la suma de las partes: |a + bi| = |a| + |b| (como √(a² + b²) = a + b)', () => { const t = sumaAbs(); return t ? { texto: tx(t), num: real(val(t)) } : { texto: `${txAbs(z.re)} + ${txAbs(z.im)}`, num: real(Math.abs(val(z.re)) + Math.abs(val(z.im))) }; }],
      ['raizDeSuma', 'CX10', 'el módulo es la raíz de la suma de las partes: √(|a| + |b|)', () => { const t = sumaAbs(); if (!t || !racional(t)) return null; const q = raiz(t); return { texto: tx(q), num: real(val(q)) }; }],
      ['sinRaiz', 'CX11', 'se suma a² + b² y se olvida sacar la raíz', () => ({ texto: tx(s), num: real(val(s)) })],
    ]));
  }
  function argGrados(re, im) {
    let g = Math.atan2(im, re) / GR;
    if (Math.abs(g - Math.round(g)) < 1e-9) g = Math.round(g);
    if (g <= -180) g += 360;
    return g + 0;
  }
  function textoGrados(g) { return `${decimal(g, 2)}°`; }
  function argumento(o) {
    const z = C(o.z), re = val(z.re), im = val(z.im);
    if (esCero(z.re) && esCero(z.im)) throw new Error('el argumento de 0 no está definido');
    const g = argGrados(re, im);
    const cuadrante = esCero(z.re) || esCero(z.im) ? 0 : re > 0 ? (im > 0 ? 1 : 4) : (im > 0 ? 2 : 3);
    const base = { grados: g, texto: textoGrados(g), positivo: g < 0 ? g + 360 : g, cuadrante, num: real(g) };
    const ang = x => ({ texto: textoGrados(x), num: real(x) });
    return Object.assign(base, errores(base, [
      ['arctanDirecto', 'CX17', 'Arg z = arctan(b/a), sin mirar en qué cuadrante está z', () => (esCero(z.re) ? null : ang(argGrados(1, im / re)))],
      ['referencia', 'CX18', 'se toma el ángulo agudo con el eje real, sin signo ni cuadrante', () => ang(argGrados(Math.abs(re), Math.abs(im)))],
    ]));
  }
  function polarTx(rt, g) { const t = g < 0 ? `(${textoGrados(g)})` : textoGrados(g); return rt === '1' ? `cis ${t}` : `${rt} cis ${t}`; }
  function textoPolar(o) {
    const r = aR(o.r, 'el módulo'), g = o.theta;
    if (typeof g !== 'number' || !Number.isFinite(g)) throw new Error('theta debe ser un número (grados)');
    return polarTx(tx(r), g);
  }
  // valor exacto de cos o sen en ángulos notables (múltiplos de 30° o de 45°)
  function notable(g) {
    const k = ((Math.round(g) % 360) + 360) % 360;
    if (Math.abs(g - Math.round(g)) > 1e-9 || (k % 30 && k % 45)) return null;
    const TAB = { 0: [UNO, CERO], 30: [R(1, 2, 3), R(1, 2)], 45: [R(1, 2, 2), R(1, 2, 2)], 60: [R(1, 2), R(1, 2, 3)], 90: [CERO, UNO] };
    const q = Math.floor(k / 90), resto = k % 90;
    let [c, s] = TAB[resto];
    for (let j = 0; j < q; j++) [c, s] = [neg(s), c];   // girar 90°: (c, s) → (−s, c)
    return [c, s];
  }
  function binomica(o) {
    const r = aR(o.r, 'el módulo'), g = o.theta;
    if (typeof g !== 'number' || !Number.isFinite(g)) throw new Error('theta debe ser un número (grados)');
    const N = notable(g);
    if (N) { const z = { re: mul(r, N[0]), im: mul(r, N[1]) }; return Object.assign({ re: val(z.re) + 0, im: val(z.im) + 0, exacto: true, texto: textoC(z) }, { num: numC(z) }); }
    const re = val(r) * Math.cos(g * GR), im = val(r) * Math.sin(g * GR);
    return { re, im, exacto: false, texto: textoNum(re, im, 2), num: { re, im } };
  }
  const polarSalida = (r, g) => ({ texto: textoPolar({ r, theta: g }), textoDecimal: polarTx(decimal(val(r), 2), g), num: binomica({ r, theta: g }).num });
  function polar(o) {
    const z = C(o.z), M = modulo({ z: o.z }), A = argumento({ z: o.z });
    const r = raiz(sum(mul(z.re, z.re), mul(z.im, z.im)));
    const base = { r: tx(r), theta: A.grados, texto: textoPolar({ r, theta: A.grados }), num: numC(z) };
    return Object.assign(base, errores(base, [
      ['arctanDirecto', 'CX17', 'Arg z = arctan(b/a), sin mirar en qué cuadrante está z', () => (esCero(z.re) ? null : polarSalida(r, argGrados(1, val(z.im) / val(z.re))))],
      ['referencia', 'CX18', 'se toma el ángulo agudo con el eje real, sin signo ni cuadrante', () => polarSalida(r, argGrados(Math.abs(val(z.re)), Math.abs(val(z.im))))],
      ['sinRaiz', 'CX11', 'se usa a² + b² como módulo, sin la raíz', () => polarSalida(aR(M.cuadrado), A.grados)],
    ]));
  }
  function P(x, que) {
    if (!x || typeof x !== 'object' || !('r' in x) || !('theta' in x)) throw new Error(`${que} debe ser { r, theta }`);
    const r = aR(x.r, `el módulo de ${que}`);
    if (r.n <= 0) throw new Error(`el módulo de ${que} debe ser positivo`);
    if (typeof x.theta !== 'number' || !Number.isFinite(x.theta)) throw new Error(`theta de ${que} debe ser un número (grados)`);
    return { r, g: x.theta };
  }
  function principal(g) { let p = ((g % 360) + 360) % 360; if (p > 180) p -= 360; return Math.round(p * 1e9) / 1e9 + 0; }
  function productoPolar(o) {
    const z = P(o.z, 'z'), w = P(o.w, 'w'), r = mul(z.r, w.r), g = z.g + w.g;
    const base = Object.assign({ r: tx(r), theta: g, principal: principal(g) }, polarSalida(r, g));
    return Object.assign(base, errores(base, [
      ['sumaModulos', 'CX19', 'los módulos se suman en lugar de multiplicarse', () => { if (z.r.m !== w.r.m) return null; return polarSalida(sum(z.r, w.r), g); }],
      ['multiplicaArgumentos', 'CX20', 'los argumentos se multiplican en lugar de sumarse', () => polarSalida(r, z.g * w.g)],
      ['restaArgumentos', 'CX21', 'los argumentos se restan (la regla del cociente)', () => polarSalida(r, z.g - w.g)],
    ]));
  }
  function cocientePolar(o) {
    const z = P(o.z, 'z'), w = P(o.w, 'w'), r = div(z.r, w.r), g = z.g - w.g;
    const base = Object.assign({ r: tx(r), theta: g, principal: principal(g) }, polarSalida(r, g));
    return Object.assign(base, errores(base, [
      ['sumaArgumentos', 'CX22', 'los argumentos se suman también al dividir', () => polarSalida(r, z.g + w.g)],
      ['restaModulos', 'CX23', 'los módulos se restan en lugar de dividirse', () => { if (z.r.m !== w.r.m) return null; const d = res(z.r, w.r); return d.n > 0 ? polarSalida(d, g) : null; }],
      ['restaAlReves', 'CX24', 'los argumentos se restan al revés: θ₂ − θ₁', () => polarSalida(r, w.g - z.g)],
    ]));
  }
  function deMoivre(o) {
    const n = o && o.n;
    if (!Number.isSafeInteger(n)) throw new Error('n debe ser un número entero');
    const z = C(o.z), A = argumento({ z: o.z }), r = raiz(sum(mul(z.re, z.re), mul(z.im, z.im))), g = n * A.grados;
    const potZ = (x, e) => (e >= 0 ? pot(x, e) : inv(pot(x, -e)));
    const rn = potZ(r, n), B = binomica({ r: rn, theta: g });
    const base = { r: tx(rn), theta: g, principal: principal(g), polar: textoPolar({ r: rn, theta: g }), texto: B.texto, num: B.num };
    const bin = (rr, gg) => { const b = binomica({ r: rr, theta: gg }); return { texto: b.texto, num: b.num }; };
    return Object.assign(base, errores(base, [
      ['reparte', 'AL11', 'el exponente se reparte sobre la suma: (a + bi)ⁿ = aⁿ + (bi)ⁿ', () => {
        if (n < 0 && (esCero(z.re) || esCero(z.im))) return null;
        const p = iA(n), bn = potZ(z.im, n), x = { re: sum(potZ(z.re, n), mul(bn, aR(p.num.re))), im: mul(bn, aR(p.num.im)) };
        return { texto: textoC(x), num: numC(x) }; }],
      ['sinModulo', 'CX30', 'se multiplica el argumento por n pero el módulo no se eleva', () => bin(r, g)],
      ['porN', 'CX31', 'el módulo se multiplica por n en lugar de elevarse a la n', () => (n <= 0 ? null : bin(mul(r, R(n)), g))],
    ]));
  }
  function raizNegativa(o) {
    const a = o && o.a, b = o && o.b;
    if (!Number.isSafeInteger(a) || !Number.isSafeInteger(b) || a <= 0 || b <= 0) throw new Error('a y b deben ser enteros positivos');
    const ra = R(1, 1, a), rb = R(1, 1, b), p = mul(ra, rb);
    const base = { texto: tx(neg(p)), num: real(-val(p)), factores: [txI(ra), txI(rb)] };
    return Object.assign(base, errores(base, [
      ['juntaRaices', 'CX28', 'se juntan las raíces como si fueran de positivos: √(−a)·√(−b) = √(ab)', () => ({ texto: tx(p), num: real(val(p)) })],
      ['sigueI', 'CX6', 'i · i = i: queda √a·√b·i', () => ({ texto: txI(p), num: { re: 0, im: val(p) } })],
      ['noExiste', 'CX29', 'un número negativo no tiene raíz (es cierto en los reales, no en los complejos)', () => ({ texto: 'no existe', num: null })],
    ]));
  }
  function cuadratica(o) {
    const a = aR(o.a, 'a'), b = aR(o.b, 'b'), c = aR(o.c, 'c');
    if (![a, b, c].every(racional)) throw new Error('a, b y c deben ser racionales');
    if (esCero(a)) throw new Error('a debe ser distinto de 0');
    const D = res(mul(b, b), mul(R(4), mul(a, c))), dos = mul(R(2), a), p = div(neg(b), dos);
    const base = { delta: val(D), deltaTexto: tx(D), suma: tx(div(neg(b), a)), producto: tx(div(c, a)) };
    const pm = (re, im) => (esCero(re) ? `±${txI(im)}` : `${tx(re)} ± ${txI(im)}`);
    if (D.n < 0) {
      const q = abs(div(raiz(neg(D)), dos));
      const z1 = { re: p, im: q }, z2 = { re: p, im: neg(q) };
      Object.assign(base, { raices: [{ texto: textoC(z1), num: numC(z1) }, { texto: textoC(z2), num: numC(z2) }], texto: pm(p, q), num: numC(z1) });
      const err = (re, im) => ({ texto: pm(re, im), num: numC({ re, im }) });
      return Object.assign(base, errores(base, [
        ['signoB', 'CX32', 'se usa b en lugar de −b en la fórmula', () => err(neg(p), q)],
        ['sinDividirIm', 'CX33', 'se divide la parte real entre 2a, pero no la parte imaginaria', () => err(p, raiz(neg(D)))],
        ['sinDividir', 'CX34', 'no se divide nada entre 2a: −b ± √Δ', () => err(neg(b), raiz(neg(D)))],
      ]));
    }
    if (D.n === 0) return Object.assign(base, { raices: [{ texto: tx(p), num: real(val(p)) }], texto: tx(p), num: real(val(p)), errores: {}, coinciden: [], noAplica: [] });
    const s = raiz(D);
    if (!racional(s)) {
      const q = abs(div(s, dos)), t = esCero(p) ? `±${txAbs(q)}` : `${tx(p)} ± ${txAbs(q)}`;
      const t1 = esCero(p) ? txAbs(q) : `${tx(p)} + ${txAbs(q)}`, t2 = esCero(p) ? MENOS + txAbs(q) : `${tx(p)} ${MENOS} ${txAbs(q)}`;
      return Object.assign(base, { raices: [{ texto: t1, num: real(val(p) + val(q)) }, { texto: t2, num: real(val(p) - val(q)) }], texto: t, num: real(val(p) + val(q)), errores: {}, coinciden: [], noAplica: [] });
    }
    const x1 = div(sum(neg(b), s), dos), x2 = div(res(neg(b), s), dos), [m, M] = val(x1) < val(x2) ? [x1, x2] : [x2, x1];
    return Object.assign(base, { raices: [{ texto: tx(m), num: real(val(m)) }, { texto: tx(M), num: real(val(M)) }], texto: `${tx(m)} y ${tx(M)}`, num: real(val(M)), errores: {}, coinciden: [], noAplica: [] });
  }
  function giro(o) {
    const g = (o.grados || 0) * GR, k = o.escala === undefined ? 1 : o.escala, x = Number(o.z.re), y = Number(o.z.im);
    return { re: k * (x * Math.cos(g) - y * Math.sin(g)), im: k * (x * Math.sin(g) + y * Math.cos(g)) };
  }

  return {
    texto: z => textoC(C(z)), potenciaI, sumar, restar, opuesto, conjugado, multiplicar, dividir, iguales,
    modulo, argumento, polar, binomica, textoPolar, productoPolar, cocientePolar, deMoivre, raizNegativa, cuadratica,
    giro, decimal,
  };
});
