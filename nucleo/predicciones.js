/*
 * Núcleo del formato "predicciones": arma las alternativas de un problema generado.
 * Regla 1: los valores los calcula el generador de cada módulo, nunca un modelo de lenguaje.
 * Regla 3: cada alternativa incorrecta sale de un error con nombre, explicación y respaldo
 * ("documentado", con fuente; "parcial", con un estudio indirecto o una sola fuente; o "hipotesis", que los datos del colegio confirmarán o no).
 * Funciona en el navegador (window.Predicciones) y en Node (require).
 */
(function (root, fabrica) {
  const api = fabrica();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.Predicciones = api;
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';
  const LETRAS = ['A', 'B', 'C', 'D', 'E'];

  // Número con coma decimal, como en los exámenes peruanos. Quita ceros sobrantes.
  function formatear(n, decimales = 2) {
    if (!Number.isFinite(n)) return String(n);
    const r = Math.round(n * 10 ** decimales) / 10 ** decimales;
    const fijo = Math.abs(r).toFixed(decimales);
    const [ent, dec] = (decimales > 0 ? fijo.replace(/0+$/, '').replace(/\.$/, '') : fijo).split('.');
    const miles = ent.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    return (r < 0 ? '−' : '') + miles + (dec ? ',' + dec : '');
  }

  // Un segmento de texto amarrado a una variable (regla 4: un color por variable).
  const v = (clave, texto) => ({ v: clave, t: String(texto) });

  // Raíz simplificada cuando x² es entero (o entero/4): 5√3, √26/2, −2√2. Si no, decimales.
  function radical(x, decimales = 2) {
    if (!Number.isFinite(x)) return String(x);
    const signo = x < 0 ? '−' : '', y = Math.abs(x);
    for (const d of [1, 2]) {
      const N = Math.round((y * d) ** 2);
      if (N > 0 && Math.abs((y * d) ** 2 - N) < 1e-6 * Math.max(1, N) && N < 1e7) {
        let a = 1, b = N;
        for (let k = 2; k * k <= b; k++) while (b % (k * k) === 0) { b /= k * k; a *= k; }
        if (d === 2 && a % 2 === 0) continue; // ya salió con d = 1
        const raiz = b === 1 ? String(a) : (a === 1 ? '' : a) + '√' + b;
        if (d === 2 && b === 1) continue;     // a/2 entero o decimal: mejor con coma
        return signo + raiz + (d === 2 ? '/2' : '');
      }
      if (y === 0) return '0';
    }
    return signo + formatear(y, decimales);
  }

  // Múltiplo de π escrito como en los exámenes: «π», «3π», «π/2», «4π/9», «−2π/3», con la unidad
  // detrás si se da («3π rad/s»). Busca x/π = p/q con q ≤ qmax; si no sale limpio, devuelve null.
  function pi(x, unidad = '', qmax = 12) {
    if (!Number.isFinite(x)) return null;
    const c = x / Math.PI;
    for (let q = 1; q <= qmax; q++) {
      const p = c * q, r = Math.round(p);
      if (Math.abs(p - r) < 1e-9 * Math.max(1, Math.abs(r))) {
        const a = Math.abs(r);
        const t = r === 0 ? '0' : (r < 0 ? '−' : '') + (a === 1 ? '' : formatear(a)) + 'π' + (q === 1 ? '' : '/' + q);
        return unidad ? `${t} ${unidad}` : t;
      }
    }
    return null;
  }

  /*
   * armar({ correcta, errores, rng, unidad, decimales, total, negativos, texto, formato, qmax })
   *   correcta: número
   *   errores: [{ id, valor, explicacion, respaldo: 'documentado'|'parcial'|'hipotesis', fuente }]
   *   negativos: si es true, acepta errores con valor cero o negativo (por defecto se descartan)
   *   texto: función opcional valor → texto (por ejemplo, radical); si falta, formatear + unidad
   *   formato: 'pi' escribe los valores como múltiplos de π con pi(valor, unidad, qmax) («3π rad/s»,
   *     «π/2 rad/s»); los errores que no salen limpios como múltiplo de π (denominador mayor que qmax,
   *     12 por defecto) se descartan, y si la correcta no sale limpia, armar lanza un error.
   *     Sin formato, armar se comporta como siempre. Un texto propio manda sobre el formato.
   * Devuelve [{ letra, valor, texto, correcta, error }], sin valores repetidos (comparados
   * ya redondeados, como los ve el alumno) y en un orden que depende solo de la semilla.
   */
  function armar({ correcta, errores, rng, unidad = '', decimales = 2, total = 5, negativos = false, texto = null, formato = null, qmax = 12 }) {
    const conPi = formato === 'pi';
    if (conPi && pi(correcta, '', qmax) === null) throw new Error(`armar: la correcta (${correcta}) no es un múltiplo limpio de π`);
    const txt = texto || (conPi ? (x => pi(x, unidad, qmax)) : (x => formatear(x, decimales) + (unidad ? ' ' + unidad : '')));
    const vistos = new Set([txt(correcta)]);
    const elegidas = [{ valor: correcta, texto: txt(correcta), correcta: true, error: null }];
    for (const e of errores) {
      if (elegidas.length >= total) break;
      if (!Number.isFinite(e.valor) || (!negativos && e.valor <= 0)) continue;
      if (conPi && pi(e.valor, '', qmax) === null) continue; // no se puede escribir como múltiplo de π
      const t = txt(e.valor);
      if (vistos.has(t)) continue; // el error coincide con otra alternativa: no distingue nada
      vistos.add(t);
      elegidas.push({ valor: e.valor, texto: t, correcta: false,
        error: { id: e.id, explicacion: e.explicacion, respaldo: e.respaldo, fuente: e.fuente || null } });
    }
    return rng.barajar(elegidas).map((a, i) => ({ letra: LETRAS[i], ...a }));
  }

  // ---------- Respuestas que no son un número (expresión pA + qB, vector, par) ----------
  // Fracciones exactas: { n, d } con d > 0 y reducidas. Aceptan enteros o pares [n, d].
  const mcd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a || 1; };
  function frac(n, d = 1) {
    if (Array.isArray(n)) [n, d] = n;
    else if (n && typeof n === 'object') ({ n, d } = n);
    if (!Number.isInteger(n) || !Number.isInteger(d) || d === 0) throw new Error(`frac: ${n}/${d} no es una fracción de enteros`);
    const g = mcd(n, d), s = d < 0 ? -1 : 1;
    return { n: s * n / g + 0, d: s * d / g };
  }
  // Texto con coma de exámenes peruanos y signo menos tipográfico: «2/3», «−1/2», «5».
  const textoFraccion = q => { const f = frac(q); return (f.n < 0 ? '−' : '') + Math.abs(f.n) + (f.d === 1 ? '' : '/' + f.d); };

  /*
   * combinacion(coefs, nombres) → { clave, texto }: la expresión c₁A + c₂B + … con coeficientes exactos.
   * Con denominador común d > 1 se escribe como en la academia: «(2A + B)/3»; si no, «2A − B».
   * Todos cero: «0» (el vector nulo). La clave es canónica: dos formas iguales tienen la misma clave.
   */
  function combinacion(coefs, nombres) {
    const fs = coefs.map(c => frac(c));
    const clave = 'comb:' + fs.map((f, i) => `${nombres[i]}=${f.n}/${f.d}`).join(',');
    const D = fs.reduce((a, f) => a * f.d / mcd(a, f.d), 1);
    const nums = fs.map(f => f.n * (D / f.d));
    let t = '';
    // Si hay términos positivos, van primero: «(2b − a)/2», no «(−a + 2b)/2».
    const orden = nums.map((n, i) => i).filter(i => nums[i] > 0).concat(nums.map((n, i) => i).filter(i => nums[i] < 0));
    orden.forEach(i => {
      const n = nums[i];
      const abs = Math.abs(n), termino = (abs === 1 ? '' : abs) + nombres[i];
      t += t === '' ? (n < 0 ? '−' : '') + termino : (n < 0 ? ' − ' : ' + ') + termino;
    });
    if (t === '') return { clave, texto: '0' };
    const varios = nums.filter(n => n !== 0).length > 1;
    if (D === 1) return { clave, texto: t };
    if (!varios) return { clave, texto: `${t}/${D}` };
    // Todos negativos: «−(u + w)/6», no «(−u − w)/6».
    if (nums.every(n => n <= 0)) return { clave, texto: '−' + combinacion(fs.map(f => frac(-f.n, f.d)), nombres).texto };
    return { clave, texto: `(${t})/${D}` };
  }
  // vector(comps) → { clave, texto }: «(3; −4)» o «(1/2; 0; −2)», con fracciones exactas.
  function vector(comps) {
    const fs = comps.map(c => frac(c));
    return { clave: 'vec:' + fs.map(f => `${f.n}/${f.d}`).join(','), texto: `(${fs.map(textoFraccion).join('; ')})` };
  }

  /*
   * armarTexto({ correcta: { clave, texto }, errores: [{ id, clave, texto, explicacion, respaldo, fuente }], rng, total })
   * Como armar, pero para respuestas que no son un número. Se compara por clave (forma canónica):
   * así dos formas equivalentes no salen como dos opciones. Si dos claves distintas se escriben igual,
   * lanza un error (el alumno no podría distinguirlas). Devuelve el formato de armar, con valor = clave.
   */
  function armarTexto({ correcta, errores, rng, total = 5 }) {
    const porClave = new Map([[correcta.clave, correcta.texto]]);
    const textos = new Map([[correcta.texto, correcta.clave]]);
    const elegidas = [{ valor: correcta.clave, texto: correcta.texto, correcta: true, error: null }];
    for (const e of errores) {
      if (elegidas.length >= total) break;
      if (!e || !e.clave || !e.texto) continue;
      if (porClave.has(e.clave)) continue; // el error da lo mismo que otra alternativa
      if (textos.has(e.texto)) throw new Error(`armarTexto: «${e.texto}» se escribe igual que otra opción con otra clave`);
      porClave.set(e.clave, e.texto); textos.set(e.texto, e.clave);
      elegidas.push({ valor: e.clave, texto: e.texto, correcta: false,
        error: { id: e.id, explicacion: e.explicacion, respaldo: e.respaldo, fuente: e.fuente || null } });
    }
    return rng.barajar(elegidas).map((a, i) => ({ letra: LETRAS[i], ...a }));
  }

  return { formatear, radical, pi, v, armar, LETRAS, frac, textoFraccion, combinacion, vector, armarTexto };
});
