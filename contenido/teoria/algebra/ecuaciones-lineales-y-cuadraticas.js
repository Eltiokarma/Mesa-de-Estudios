/*
 * Teoría de «Ecuaciones de primer y segundo grado» (algebra.ecuaciones-lineales-y-cuadraticas). Molde: docs/teoria.md.
 * Fuente del contenido: docs/teoria/matriz/algebra.json (unidad 4), expediente teoria-152-unidades (ficha de la unidad,
 * «Precisiones» de Álgebra y el microguion «dividir por x exige revisar x = 0») e historia-ecuaciones (pp. 57–68).
 * Errores: AL1, AL8, AL14, AL15, AL16 (docs/investigacion/algebra-funciones-ideas-erroneas.md) y TAL-* nuevos
 * (hipótesis de diseño, rutinas/teoria-algebra.md).
 * Colores (regla 4): la incógnita x naranja (c-o); k y b turquesa (c-i); c y el producto P rojo (c-h);
 * Δ y la suma S verde (c-d). Las pesas y los números van en tinta.
 *
 * Ficha de tarea (diseno-y-animacion):
 * Promesa · resolver una ecuación es hallar TODOS los valores que la hacen verdadera, y comprobarlos.
 * Persona y condiciones · 3.º de secundaria, celular de gama baja a 360 px, sin audio, en el aula o en casa.
 * Resultado observable · plantea, resuelve y sustituye todas las soluciones, también en casos degenerados (a = 0, Δ < 0, x = 0).
 * Orden de atención · 1.º la figura (balanza, recta, parábola, tabla) · 2.º lo que cambia en ella · acción: «Comprobar» · fondo: Nox.
 * Estados · juego sin tocar · casos probados · predicción elegida · revelado · paso a paso · caso nuevo · «No sé».
 * Duda que resuelve · por qué dividir entre x pierde la solución x = 0, y cuándo una ecuación no tiene solución o tiene todas.
 */
(function (root, fabrica) {
  const def = fabrica(typeof module === 'object' && module.exports ? require('../../../nucleo/kit/kit.js') : root.Kit);
  if (typeof module === 'object' && module.exports) module.exports = def;
  else root.Teoria.unidad(def);
})(typeof self !== 'undefined' ? self : this, function (Kit) {
  'use strict';
  const f = (n, d = 2) => Kit.formatear(n, d);
  const x = { v: 'c-o', t: 'x' }, k = { v: 'c-i', t: 'k' }, b = { v: 'c-i', t: 'b' }, c = { v: 'c-h', t: 'c' };
  const D = { v: 'c-d', t: 'Δ' }, S = { v: 'c-d', t: 'S' }, P = { v: 'c-h', t: 'P' };
  const SUP = { 2: '²', 3: '³', 4: '⁴' };
  function azar(s) {
    let a = (s * 2654435761 + 12345) >>> 0;
    const r = () => { a = (a + 0x6D2B79F5) >>> 0; let z = a; z = Math.imul(z ^ (z >>> 15), z | 1); z ^= z + Math.imul(z ^ (z >>> 7), z | 61); return ((z ^ (z >>> 14)) >>> 0) / 4294967296; };
    r.ent = (lo, hi) => lo + Math.floor(r() * (hi - lo + 1));
    r.uno = l => l[Math.floor(r() * l.length)];
    return r;
  }
  // Opciones distintas por su texto: la correcta primero; un distractor que repite un texto se descarta.
  function distintas(ops, max = 4) {
    const vistos = new Set(), out = [];
    for (const o of ops) { const t = Kit.plano(o.texto); if (vistos.has(t) || /NaN|Infinity|undefined/.test(t)) continue; vistos.add(t); out.push(o); }
    // Si los distractores coinciden entre sí (raíces 0 o iguales), se completa con vecinos del valor correcto.
    const num = Number(String(Kit.plano(ops[0].texto)).replace('−', '-').replace(',', '.'));
    for (const dd of [1, -1, 2]) {
      if (out.length >= 3 || !Number.isFinite(num)) break;
      const t = f(num + dd);
      if (!vistos.has(t)) { vistos.add(t); out.push({ id: `v${dd}`, texto: t, error: 'TAL-CALCULO', siFuera: 'Ese valor queda cerca; rehaz la cuenta paso a paso con −b/a y c/a.' }); }
    }
    return out.slice(0, max);
  }
  const mcd = (p, q) => (q ? mcd(q, p % q) : Math.abs(p));
  // Fracción reducida como texto: «3», «−3/2».
  function fr(num, den) {
    if (den === 0) return 'no definido';
    if (den < 0) { num = -num; den = -den; }
    const g = mcd(Math.abs(num), den) || 1;
    return den / g === 1 ? f(num / g) : `${num < 0 ? '−' : ''}${Math.abs(num) / g}/${den / g}`;
  }
  // Polinomio en X con coeficientes de mayor a menor grado: [1, −5, 6] → x² − 5x + 6 (partes de ecuación).
  function poli(coefs, X = x) {
    const n = coefs.length - 1, out = [];
    coefs.forEach((a, i) => {
      if (!a) return;
      const e = n - i, abs = Math.abs(a);
      out.push(out.length ? (a < 0 ? ' − ' : ' + ') : (a < 0 ? '−' : ''));
      if (abs !== 1 || e === 0) out.push(f(abs));
      if (e >= 1) out.push(X);
      if (e >= 2) out.push(SUP[e]);
    });
    return out.length ? out : ['0'];
  }
  const poliTxt = coefs => Kit.plano(poli(coefs, 'x'));
  const mon = n => (n === 1 ? 'x' : `${f(n)}x`);   // «x», «3x» en texto plano
  const conjunto = l => (l.length ? `{${[...new Set(l)].sort((p, q) => p - q).map(v => f(v)).join('; ')}}` : '∅');
  // Muestrea una función en [a, b] y corta la curva donde sale de [ymin, ymax] (null corta la línea en la pieza ejes).
  function curva(fn, a, bb, ymin, ymax, n = 160) {
    const pts = [];
    let prev = null;
    for (let i = 0; i <= n; i++) {
      const xx = a + (bb - a) * i / n, yy = fn(xx);
      const dentro = yy >= ymin && yy <= ymax;
      if (prev) {
        const [px, py, pd] = prev;
        if (dentro !== pd) {
          const borde = (dentro ? py : yy) > ymax ? ymax : ymin;
          const t = (borde - py) / (yy - py), xc = px + (xx - px) * t;
          pts.push([xc, borde]);
          if (!dentro) pts.push(null);
        }
      }
      if (dentro) pts.push([xx, yy]);
      prev = [xx, yy, dentro];
    }
    return pts;
  }

  // ---------- Idea 1: lo mismo en los dos platillos ----------
  // Cambia: lo que se quita de cada platillo · Permanece: la balanza y el peso real de x (4 kg) · Progresa: la
  // ecuación que queda · Se reserva: 2x + 5 = 2x + 9, que nunca se equilibra · Debe verse: solo lo igual conserva el equilibrio.
  const COL1 = { x: 'o' };
  const vista1 = (qi, qd, qp) => ({
    izq: { x: 3 - qi, pesa: 4 - qp }, der: { x: 1 - qd, pesa: 12 - qp },
    quita: { izq: { x: qi, pesa: qp }, der: { x: qd, pesa: qp } },
  });
  const balanza = (vistas, pesos = { x: 4 }) => ({ unidad: 'kg', colores: COL1, incognitas: ['x'], pesos, balanzas: [], trabajo: vistas });
  const lado = (n, p) => (n ? [...(n === 1 ? [] : [f(n)]), x, ...(p ? [` + ${f(p)}`] : [])] : [f(p)]);
  const igualdad = (a1, b1, a2, b2) => [...lado(a1, b1), ' = ', ...lado(a2, b2)];
  const primerGrado = {
    id: 'balanza',
    titulo: 'Lo mismo en los dos platillos',
    temas: ['Ecuación de primer grado'],
    pieza: 'balanza',
    juega: {
      consigna: 'La balanza muestra 3x + 4 = x + 12, y cada caja x pesa lo mismo. Quita cajas o pesas y mira si sigue en equilibrio.',
      voz: 'Prueba quitar algo solo de un lado.',
      controles: [
        { id: 'qi', etiqueta: 'Quita x a la izquierda', min: 0, max: 1, paso: 1, inicio: 0, decimales: 0, color: 'c-o' },
        { id: 'qd', etiqueta: 'Quita x a la derecha', min: 0, max: 1, paso: 1, inicio: 0, decimales: 0, color: 'c-o' },
        { id: 'qp', etiqueta: 'Quita de cada lado', min: 0, max: 4, paso: 2, inicio: 0, unidad: 'kg', decimales: 0 },
      ],
      dibujo: v => ({ datos: balanza([vista1(v.qi, v.qd, v.qp)]), estado: { vista: 0 } }),
      lectura: v => {
        const l = 4 * (3 - v.qi) + 4 - v.qp, r = 4 * (1 - v.qd) + 12 - v.qp;
        return [...igualdad(3 - v.qi, 4 - v.qp, 1 - v.qd, 12 - v.qp), l === r ? ' · en equilibrio' : ' · se inclina'];
      },
      minimo: 3,
    },
    predice: {
      pregunta: ['En ', ...igualdad(2, 5, 2, 9), ' se quita 2', x, ' de cada lado. ¿Cuántas soluciones tiene la ecuación?'],
      opciones: [
        { id: 'c', texto: 'Ninguna', correcta: true },
        { id: 'resta', texto: ['Una: ', x, ' = 2'], error: 'TAL-RESTA', siFuera: 'x = 2 saldría de (9 − 5) ÷ 2, pero las x se cancelan: queda 5 = 9.' },
        { id: 'todas', texto: 'Todo número es solución', error: 'TAL-DEGENERADA', siFuera: 'Sería cierto si quedara 5 = 5. Queda 5 = 9, que nunca es verdad.' },
        { id: 'cero', texto: ['Una: ', x, ' = 0'], error: 'TAL-DEGENERADA', siFuera: 'Con x = 0 los lados pesan 5 y 9: tampoco se equilibran.' },
      ],
      dibujo: { datos: balanza([{ izq: { x: 2, pesa: 5 }, der: { x: 2, pesa: 9 }, traba: true }], null), estado: { vista: 0 } },
      revelar: { datos: balanza([{ izq: { pesa: 5 }, der: { pesa: 9 }, quita: { izq: { x: 2 }, der: { x: 2 } } }], null), estado: { vista: 0 } },
      coincide: 'Coincide: sin las x quedan 5 kg contra 9 kg, y eso no cambia con ningún valor de x.',
    },
    mira: {
      datos: balanza([
        { izq: { x: 3, pesa: 4 }, der: { x: 1, pesa: 12 } },
        { izq: { x: 2, pesa: 4 }, der: { pesa: 12 }, quita: { izq: { x: 1 }, der: { x: 1 } } },
        { izq: { x: 2 }, der: { pesa: 8 }, quita: { izq: { pesa: 4 }, der: { pesa: 4 } } },
        { izq: { x: 1 }, der: { pesa: 4 }, rotulo: [{ t: 'x = 4 kg', c: 'o' }] },
      ]),
      voz: 'Creo que conviene quitar primero las x de un lado.',
      pasos: [
        { estado: { vista: 0 }, texto: 'Empezamos en equilibrio: los dos lados pesan lo mismo.', ecuacion: igualdad(3, 4, 1, 12) },
        { estado: { vista: 1, nuevo: ['t'] }, texto: 'Se quita una x de cada lado: sigue en equilibrio.', ecuacion: igualdad(2, 4, 0, 12) },
        { estado: { vista: 2, nuevo: ['t'] }, texto: 'Se quitan 4 kg de cada lado.', ecuacion: igualdad(2, 0, 0, 8) },
        { estado: { vista: 3, nuevo: ['t'] }, texto: 'Se deja la mitad en cada platillo.', ecuacion: [x, ' = 8 ÷ 2 = 4'] },
        { estado: { vista: 3, final: true }, texto: 'Se comprueba en la ecuación original.', ecuacion: ['3 · 4 + 4 = 16   ·   4 + 12 = 16'] },
      ],
    },
    regla: {
      texto: 'Sumar o quitar lo mismo en los dos lados, o dividirlos entre un número no nulo, conserva las soluciones. Así, ax + b = 0 con a ≠ 0 da x = −b/a.',
      ecuacion: ['a', x, ' + b = 0  ⇒  ', x, ' = ', { frac: ['−b', 'a'] }],
      condicion: 'si a = 0, no hay solución cuando b ≠ 0, y todo número es solución cuando b = 0.',
    },
    ahoraTu: {
      generar(s) {
        const r = azar(s);
        if (s % 5 === 4) {
          // Caso degenerado: las x se cancelan.
          const a = r.ent(2, 5), b1 = r.ent(1, 9), igual = s % 10 === 9, b2 = igual ? b1 : b1 + r.ent(1, 6);
          return {
            pregunta: ['Resuelve ', ...igualdad(a, b1, a, b2), '.'],
            opciones: distintas([
              { id: 'c', texto: igual ? 'Todo número es solución' : 'No tiene solución', correcta: true },
              { id: 'otra', texto: igual ? 'No tiene solución' : 'Todo número es solución', error: 'TAL-DEGENERADA', siFuera: igual ? 'Sería así si quedaran números distintos; quedan iguales.' : `Sería así si quedara ${b1} = ${b1}; queda ${b1} = ${b2}.` },
              { id: 'cero', texto: [x, ' = 0'], error: 'TAL-DEGENERADA', siFuera: igual ? 'x = 0 sirve, pero también cualquier otro número.' : `Con x = 0 queda ${b1} = ${b2}: tampoco.` },
              { id: 'resta', texto: [x, ` = ${fr(b2 - b1, a)}`], error: 'TAL-RESTA', siFuera: 'Para despejar habría que dividir entre a − a = 0, y eso no se puede.' },
            ]),
            solucion: { texto: `Al quitar ${a}x de cada lado queda ${b1} = ${b2}, ${igual ? 'siempre verdadero' : 'nunca verdadero'}.`, ecuacion: [`${b1} = ${b2}`] },
          };
        }
        const a = r.ent(2, 6), cc = r.ent(0, a - 1), x0 = r.ent(1, 9), b1 = r.ent(0, 9), b2 = (a - cc) * x0 + b1;
        const dif = a - cc;
        return {
          pregunta: ['Resuelve ', ...igualdad(a, b1, cc, b2), '.'],
          dibujo: { datos: balanza([{ izq: { x: a, pesa: b1 }, der: { x: cc, pesa: b2 }, traba: true }], null), estado: { vista: 0 } },
          opciones: distintas([
            { id: 'c', texto: [x, ` = ${f(x0)}`], correcta: true },
            { id: 'signo', texto: [x, ` = ${fr(b2 + b1, dif)}`], error: 'AL16', siFuera: `Eso suma ${b1} al otro lado; al pasar, ${b1} cambia de signo.` },
            { id: 'suma-x', texto: [x, ` = ${fr(b2 - b1, a + cc)}`], error: 'AL16', siFuera: `Eso suma las x de los dos lados; ${cc ? `quitar ${mon(cc)} deja ${mon(dif)}` : 'no hay x a la derecha'}.` },
            { id: 'invertido', texto: [x, ` = ${fr(b1 - b2, dif)}`], error: 'TAL-SIGNO', siFuera: 'Eso resta al revés: la x queda positiva a la izquierda.' },
            { id: 'sin-dividir', texto: [x, ` = ${f(b2 - b1)}`], error: 'TAL-DIVIDE', siFuera: `Falta dividir entre ${dif}: eso es lo que pesan ${dif} cajas.` },
          ]),
          solucion: { texto: `${[cc ? `Se quita ${mon(cc)} de cada lado` : '', b1 ? `${cc ? 'y' : 'Se quitan'} ${b1} kg de cada lado` : ''].filter(Boolean).join(' ') || 'Se deja la x sola'}; luego se divide entre ${dif}.`, ecuacion: [f(dif), x, ` = ${f(b2 - b1)}  ⇒  `, x, ` = ${f(x0)}`] },
        };
      },
    },
  };

  // ---------- Idea 2: dividir entre x exige revisar x = 0 ----------
  // Microguion del expediente (ruta E + D). Cambia: el candidato y el coeficiente k · Permanece: la recta de
  // soluciones · Progresa: x² = 3x → x(x − 3) = 0 → dos ramas · Se reserva: la rama x = 0 que la división pierde
  // · Debe verse: dividir entre x deja un conjunto incompleto.
  const rectaSol = (elementos, extra = {}) => Object.assign({ min: -4, max: 6, paso: 1, decimales: 0, variable: 'x', color: 'o', filas: 2, elementos }, extra);
  const dividirX = {
    id: 'dividir-entre-x',
    titulo: 'Antes de dividir, revisa x = 0',
    temas: ['Ecuación cuadrática y discriminante'],
    pieza: 'recta',
    juega: {
      consigna: 'En x² = kx, elige k y prueba candidatos. El punto queda verde si los dos lados dan lo mismo; rojo y hueco si no.',
      voz: 'Prueba también x = 0 con cada k.',
      controles: [
        { id: 'k', etiqueta: 'k', color: 'c-i', opciones: [{ valor: -2, texto: '−2' }, { valor: 0, texto: '0' }, { valor: 4, texto: '4' }] },
        { id: 'x', etiqueta: 'Candidato x', color: 'c-o', min: -3, max: 5, paso: 1, inicio: 1, decimales: 0 },
      ],
      dibujo: v => {
        const ok = v.x * v.x === v.k * v.x;
        return { datos: rectaSol([{ tipo: 'punto', x: v.x, color: ok ? 'd' : 'h', abierto: !ok, rotulo: `${f(v.x * v.x)} y ${f(v.k * v.x)}` }], { alt: `Candidato x = ${v.x}: x² = ${v.x * v.x}, kx = ${v.k * v.x}` }), estado: {} };
      },
      lectura: v => [x, `² = ${f(v.x * v.x)} · `, k, x, ` = ${f(v.k * v.x)} · ${v.x * v.x === v.k * v.x ? 'iguales' : 'distintos'}`],
      minimo: 4,
    },
    predice: {
      pregunta: ['¿Qué conjunto contiene todas las soluciones de ', x, '² = 3', x, '?'],
      opciones: [
        { id: 'c', texto: '{0; 3}', correcta: true },
        { id: 'divide', texto: '{3}', error: 'AL15', siFuera: 'x = 3 sí funciona. También x = 0 hace iguales ambos lados: 0 = 0.' },
        { id: 'cero', texto: '{0}', error: 'TAL-RAMA', siFuera: 'x = 0 sí funciona. También x = 3 satisface la igualdad: 9 = 9.' },
        { id: 'opuestos', texto: '{−3; 3}', error: 'TAL-OPUESTO', siFuera: 'x = 3 sí funciona. Con x = −3, los lados dan 9 y −9.' },
      ],
      dibujo: { datos: rectaSol([]), estado: {} },
      revelar: { datos: rectaSol([{ tipo: 'punto', x: 0, color: 'd', rotulo: '0 = 0' }, { tipo: 'punto', x: 3, color: 'd', rotulo: '9 = 9' }, { tipo: 'punto', x: -3, color: 'h', abierto: true, rotulo: '9 ≠ −9', fila: 1 }]), estado: {} },
      coincide: 'Coincide: 0 y 3 hacen iguales los dos lados, y la factorización muestra que no hay otros.',
    },
    mira: {
      datos: rectaSol([
        { tipo: 'punto', x: 0, color: 'd', rotulo: 'x = 0', desde: 4 },
        { tipo: 'punto', x: 3, color: 'd', rotulo: 'x = 3', desde: 4 },
        { tipo: 'punto', x: 3, color: 'o', rotulo: 'dividir: solo 3', fila: 1, desde: 5 },
      ]),
      voz: 'Yo había comprimido ese paso. Abrámoslo.',
      pasos: [
        { estado: { corte: 1 }, texto: 'Buscamos todos los valores que hacen iguales ambos lados.', ecuacion: [x, '² = 3', x] },
        { estado: { corte: 2 }, texto: 'Restamos 3x en ambos lados: no cambia ninguna solución.', ecuacion: [x, '² − 3', x, ' = 0'] },
        { estado: { corte: 3 }, texto: 'Escribimos el factor común. Al multiplicar, vuelve x² − 3x.', ecuacion: [x, '(', x, ' − 3) = 0'] },
        { estado: { corte: 4 }, texto: 'Un producto es cero si algún factor es cero.', ecuacion: [x, ' = 0   o   ', x, ' − 3 = 0'] },
        { estado: { corte: 5 }, texto: 'Dividir entre x solo vale si x ≠ 0: así se pierde el 0.', ecuacion: [x, ' ≠ 0  ⇒  ', x, ' = 3;   ', x, ' = 0: 0 = 0 ✓'] },
      ],
    },
    regla: {
      texto: 'Antes de dividir entre una expresión, revisa el caso en que vale cero. Mejor lleva todo a un lado y factoriza: el producto es cero si algún factor lo es.',
      ecuacion: [x, '(', x, ' − 3) = 0  ⇔  ', x, ' = 0  o  ', x, ' = 3'],
      condicion: 'el otro lado es cero: AB = 5 no da A = 5 o B = 5. En x²/x = 3, x = 0 queda excluido.',
      voz: 'Ese valor queda fuera del dominio solo si el enunciado lo excluye.',
    },
    ahoraTu: {
      pieza: 'recta',
      generar(s) {
        const r = azar(s), tipo = s % 4;
        let pregunta, sol, dist, texto, ec;
        if (tipo === 0) {
          const kk = r.uno([-4, -3, -2, 2, 3, 5, 6]);
          pregunta = ['Resuelve ', x, `² = ${f(kk)}`, x, ' en los reales.'];
          sol = [0, kk]; texto = 'Se pasa todo a un lado y se saca x de factor común.';
          ec = [x, '(', x, ` − ${kk < 0 ? `(${f(kk)})` : f(kk)}) = 0`];
          dist = [[[kk], 'AL15', `x = ${f(kk)} sí funciona; también x = 0, que dividir entre x pierde.`], [[0], 'TAL-RAMA', `x = 0 sí funciona; también x = ${f(kk)}.`], [[-kk, kk], 'TAL-OPUESTO', `Con x = ${f(-kk)} los lados no coinciden.`]];
        } else if (tipo === 1) {
          const m = r.ent(2, 6), n = r.ent(1, 4), t = m + n;
          pregunta = ['Resuelve ', x, '(', x, ` − ${m}) = ${n === 1 ? '' : n}`, x, ' en los reales.'];
          sol = [0, t]; texto = `Se resta ${mon(n)}: x² − ${t}x = 0, y se factoriza.`;
          ec = [x, '(', x, ` − ${t}) = 0`];
          dist = [[[t], 'AL15', `x = ${t} sí funciona; también x = 0.`], [[0, m], 'TAL-RAMA', `Eso iguala x − ${m} a cero; falta restar ${mon(n)}.`], [[m, n], 'AL14', 'Los factores no están igualados a cero: primero se pasa todo a un lado.']];
        } else if (tipo === 2) {
          const p = r.ent(1, 4), q = r.ent(1, 3);
          pregunta = ['Resuelve (', x, ` − ${p})² = ${q === 1 ? '' : q}(`, x, ` − ${p}) en los reales.`];
          sol = [p, p + q]; texto = `Dividir entre x − ${p} pierde x = ${p}; se factoriza (x − ${p}).`;
          ec = ['(', x, ` − ${p})(`, x, ` − ${p + q}) = 0`];
          dist = [[[p + q], 'AL15', `x = ${p + q} sí funciona; también x = ${p}, que anula el factor.`], [[p], 'TAL-RAMA', `x = ${p} sí funciona; también x = ${p + q}.`], [[0, p + q], 'TAL-RAMA', `x = 0 no cumple: (${f(-p)})² = ${p * p} y ${q === 1 ? '' : q}(${f(-p)}) = ${f(-q * p)}.`]];
        } else {
          const kk = r.uno([2, 3, 4, 5, -2, -3]);
          pregunta = ['Resuelve ', x, '²/', x, ` = ${f(kk)} en los reales.`];
          sol = [kk]; texto = 'x = 0 anula el denominador: no está en el dominio.';
          ec = ['dominio ', x, ' ≠ 0;   ', x, ` = ${f(kk)}`];
          dist = [[[0, kk], 'TAL-DOMINIO', 'x = 0 haría cero el denominador; la expresión original no existe ahí.'], [[], 'TAL-DOMINIO', `x = ${f(kk)} cumple: ${f(kk * kk)}/${f(kk)} = ${f(kk)}.`], [[-kk, kk], 'TAL-OPUESTO', `Con x = ${f(-kk)} el cociente vale ${f(-kk)}.`]];
        }
        return {
          pregunta,
          dibujo: { datos: rectaSol([]), estado: {} },
          opciones: distintas([{ id: 'c', texto: conjunto(sol), correcta: true }, ...dist.map(([l, e, sf], i) => ({ id: `d${i}`, texto: conjunto(l), error: e, siFuera: sf }))]),
          solucion: { texto, ecuacion: ec, dibujo: { datos: rectaSol(sol.map(v => ({ tipo: 'punto', x: v, color: 'd', rotulo: f(v) })), { min: Math.min(-4, ...sol) - 1, max: Math.max(6, ...sol) + 1 }), estado: {} } },
        };
      },
    },
  };

  // ---------- Idea 3: Δ cuenta los cortes ----------
  // Cambia: b y c de la parábola · Permanece: los ejes y a = 1 · Progresa: Δ y los puntos de corte · Se reserva:
  // un caso con a = 2 que no corta · Debe verse: el signo de Δ dice si la parábola corta, toca o no toca el eje.
  const EJES3 = { x: { min: -6, max: 6, paso: 1, cada: 2, nombre: 'x', decimales: 0, color: 'o' }, y: { min: -6, max: 10, paso: 2, nombre: 'y', decimales: 0 } };
  const raices = (a, bb, cc) => { const d = bb * bb - 4 * a * cc; if (d < 0) return []; if (d === 0) return [-bb / (2 * a)]; const q = Math.sqrt(d); return [(-bb - q) / (2 * a), (-bb + q) / (2 * a)]; };
  const parabola = (a, bb, cc, extra = {}) => Object.assign({}, EJES3, {
    curvas: [{ puntos: curva(z => a * z * z + bb * z + cc, -6, 6, -6, 10), color: 'i' }],
    puntos: raices(a, bb, cc).map(z => ({ x: z, y: 0, color: 'o', rotulo: f(z) })),
    alt: `Parábola y = ${poliTxt([a, bb, cc])}: ${raices(a, bb, cc).length} cortes con el eje x`,
  }, extra);
  const cuantas = d => (d > 0 ? 'dos raíces reales' : d === 0 ? 'una raíz doble' : 'ninguna raíz real');
  const discriminante = {
    id: 'discriminante',
    titulo: 'El discriminante cuenta los cortes',
    temas: ['Ecuación cuadrática y discriminante', 'Interpretación geométrica'],
    pieza: 'ejes',
    juega: {
      consigna: 'Mueve b y c en y = x² + bx + c. Los puntos naranjas son las raíces: donde la parábola toca el eje x.',
      voz: 'Busca una parábola que solo toque el eje.',
      controles: [
        { id: 'b', etiqueta: 'b', color: 'c-i', min: -4, max: 4, paso: 1, inicio: -2, decimales: 0 },
        { id: 'c', etiqueta: 'c', color: 'c-h', min: -4, max: 5, paso: 1, inicio: -3, decimales: 0 },
      ],
      dibujo: v => ({ datos: parabola(1, v.b, v.c), estado: {} }),
      lectura: v => { const d = v.b * v.b - 4 * v.c; return [D, ` = ${f(d)}: ${cuantas(d)}`]; },
      minimo: 4,
    },
    predice: {
      pregunta: ['¿Cuántas raíces reales tiene 2', x, '² − 4', x, ' + 3 = 0?'],
      opciones: [
        { id: 'c', texto: 'Ninguna raíz real', correcta: true },
        { id: 'dos', texto: 'Dos raíces reales', error: 'TAL-DELTA-SIGNO', siFuera: 'Sería así si Δ fuera positivo. Δ = 16 − 4 · 2 · 3 = −8.' },
        { id: 'una', texto: 'Una raíz doble', error: 'TAL-DELTA-CERO', siFuera: 'Sería así con Δ = 0. Aquí Δ = 16 − 24 = −8.' },
      ],
      dibujo: { datos: Object.assign({}, EJES3, { curvas: [], alt: 'Ejes sin gráfica' }), estado: {} },
      revelar: { datos: parabola(2, -4, 3, { puntos: [{ x: 1, y: 1, color: 'i', rotulo: 'vértice (1; 1)', guias: true }] }), estado: {} },
      coincide: 'Coincide: Δ = −8 < 0 y la parábola queda toda sobre el eje x.',
    },
    mira: {
      datos: Object.assign({}, EJES3, {
        curvas: [{ puntos: curva(z => z * z - 2 * z - 3, -6, 6, -6, 10), color: 'i' }],
        puntos: [{ x: 1, y: -4, color: 'i', rotulo: '(1; −4)', guias: true, desde: 2 }, { x: -1, y: 0, color: 'o', rotulo: '−1', desde: 3 }, { x: 3, y: 0, color: 'o', rotulo: '3', desde: 3 }],
        alt: 'Parábola y = x² − 2x − 3 con vértice (1; −4) y raíces −1 y 3',
      }),
      pasos: [
        { estado: { corte: 1 }, texto: 'Resolvemos x² − 2x − 3 = 0 completando el cuadrado.', ecuacion: [x, '² − 2', x, ' = 3'] },
        { estado: { corte: 2 }, texto: 'Sumamos 1 a los dos lados: queda un cuadrado.', ecuacion: ['(', x, ' − 1)² = 4'] },
        { estado: { corte: 3 }, texto: 'Un número al cuadrado da 4 si vale 2 o −2.', ecuacion: [x, ' − 1 = ±2  ⇒  ', x, ' = 3  o  ', x, ' = −1'] },
        { estado: { corte: 3 }, texto: 'Ese 4 es Δ/4: Δ positivo, dos cortes.', ecuacion: [D, ' = (−2)² − 4 · 1 · (−3) = 16'] },
      ],
    },
    regla: {
      texto: 'En ax² + bx + c = 0 (a ≠ 0), Δ = b² − 4ac decide: dos raíces reales si Δ > 0, una doble si Δ = 0, ninguna real si Δ < 0.',
      ecuacion: [x, ' = ', { frac: [['−', b, ' ± ', { raiz: [b, '² − 4a', c] }], '2a'] }],
      condicion: 'a ≠ 0. Si Δ < 0 la parábola no corta el eje x, aunque haya dos raíces complejas que la gráfica no muestra.',
    },
    ahoraTu: {
      generar(s) {
        const r = azar(s), t = s % 3, a = r.ent(1, 3);
        let bb, cc;
        if (t === 0) { const r1 = r.ent(-4, 2), r2 = r1 + r.ent(1, 5); bb = -a * (r1 + r2); cc = a * r1 * r2; }
        else if (t === 1) { const r0 = r.uno([-3, -2, -1, 1, 2, 3]); bb = -2 * a * r0; cc = a * r0 * r0; }
        else { bb = r.ent(-4, 4); cc = Math.floor(bb * bb / (4 * a)) + r.ent(1, 3); }
        const d = bb * bb - 4 * a * cc, mal = bb * bb + 4 * a * cc;
        const OP = { dos: 'Dos raíces reales', una: 'Una raíz doble', ninguna: 'Ninguna raíz real' };
        const bien = d > 0 ? 'dos' : d === 0 ? 'una' : 'ninguna';
        const cuenta = `Δ = ${f(bb * bb)} − ${f(4 * a * cc)} = ${f(d)}`.replace('− −', '+ ');
        const sf = id => (id === 'dos' ? `Sería así si Δ > 0; ${cuenta}.` : id === 'una' ? `Sería así si Δ = 0; ${cuenta}.` : `Sería así si Δ < 0; ${cuenta}.`);
        const rs = raices(a, bb, cc);
        return {
          pregunta: ['¿Cuántas raíces reales tiene ', ...poli([a, bb, cc]), ' = 0?'],
          opciones: [{ id: bien, texto: OP[bien], correcta: true }, ...Object.keys(OP).filter(id => id !== bien).map(id => ({ id, texto: OP[id], error: Math.sign(mal) === (id === 'dos' ? 1 : id === 'una' ? 0 : -1) ? 'TAL-DELTA-SIGNO' : 'TAL-DELTA', siFuera: sf(id) }))],
          solucion: { texto: `Δ = b² − 4ac: ${cuenta.replace('Δ = ', '')}.`, ecuacion: [D, ` = ${f(d)}`, ...(rs.length ? ['  ⇒  ', x, ` = ${rs.map(z => f(z)).join(' o ')}`] : [])], dibujo: { datos: parabola(a, bb, cc), estado: {} } },
        };
      },
    },
  };

  // ---------- Idea 4: suma y producto sin resolver ----------
  // Cambia: las dos raíces · Permanece: la forma x² − Sx + P · Progresa: S y P que se leen en los coeficientes
  // · Se reserva: a = 2, que obliga a dividir · Debe verse: S = −b/a y P = c/a.
  const EJES4 = { x: { min: -5, max: 6, paso: 1, nombre: 'x', decimales: 0, color: 'o' }, y: { min: -8, max: 10, paso: 2, nombre: 'y', decimales: 0 } };
  const vieta = {
    id: 'suma-producto',
    titulo: 'Suma y producto sin resolver',
    temas: ['Propiedades de las raíces'],
    pieza: 'ejes',
    juega: {
      consigna: 'Elige dos raíces. La parábola y = (x − r)(x − s) pasa por ellas; mira su ecuación desarrollada en la lectura.',
      voz: 'Compara los coeficientes con la suma y el producto.',
      controles: [
        { id: 'r', etiqueta: 'r', color: 'c-o', min: -3, max: 4, paso: 1, inicio: 1, decimales: 0 },
        { id: 's', etiqueta: 's', color: 'c-o', min: -3, max: 4, paso: 1, inicio: 3, decimales: 0 },
      ],
      dibujo: v => ({
        datos: Object.assign({}, EJES4, {
          curvas: [{ puntos: curva(z => (z - v.r) * (z - v.s), -5, 6, -8, 10), color: 'i' }],
          puntos: [...new Set([v.r, v.s])].map(z => ({ x: z, y: 0, color: 'o', rotulo: f(z) })),
          alt: `Parábola y = ${poliTxt([1, -(v.r + v.s), v.r * v.s])} con raíces ${v.r} y ${v.s}`,
        }), estado: {},
      }),
      lectura: v => ['y = ', ...poli([1, -(v.r + v.s), v.r * v.s]), ' · ', S, ` = ${f(v.r + v.s)} · `, P, ` = ${f(v.r * v.s)}`],
      minimo: 3,
    },
    predice: {
      pregunta: ['En 2', x, '² − 10', x, ' + 12 = 0, ¿cuánto suman las dos raíces?'],
      pieza: 'alg-tabla',
      opciones: [
        { id: 'c', texto: '5', correcta: true },
        { id: 'normaliza', texto: '10', error: 'TAL-NORMALIZA', siFuera: '10 sería cierto si a fuera 1. Con a = 2 se divide: −(−10)/2 = 5.' },
        { id: 'signo', texto: '−5', error: 'TAL-SIGNO-SUMA', siFuera: 'La suma es −b/a: el signo de b se cambia. −(−10)/2 = 5.' },
        { id: 'producto', texto: '6', error: 'TAL-PRODUCTO', siFuera: '6 es el producto, c/a = 12/2. La suma usa b.' },
      ],
      dibujo: { datos: { columnas: ['a', 'b', 'c', 'suma', 'producto'], colorCol: [null, 'i', 'h', 'd', 'h'], filas: [['2', '−10', '12', { t: '?', fuerte: true }, { t: '?', fuerte: true }]] }, estado: {} },
      revelar: { datos: { columnas: ['a', 'b', 'c', 'suma', 'producto'], colorCol: [null, 'i', 'h', 'd', 'h'], filas: [['2', '−10', '12', { t: '5', fuerte: true }, { t: '6', fuerte: true }]], pie: 'raíces 2 y 3: 2 + 3 = 5, 2 · 3 = 6' }, estado: {} },
      coincide: 'Coincide: dividida entre 2 queda x² − 5x + 6, con raíces 2 y 3.',
    },
    mira: {
      pieza: 'alg-tabla',
      datos: {
        columnas: ['', 'a', 'b', 'c', '−b/a', 'c/a'], colorCol: [null, null, 'i', 'h', 'd', 'h'],
        filas: [
          [{ t: 'x² − 5x + 6', desde: 1 }, { t: '1', desde: 1 }, { t: '−5', desde: 1 }, { t: '6', desde: 1 }, { t: '5', desde: 3, fuerte: true }, { t: '6', desde: 3, fuerte: true }],
          [{ t: '2x² − 10x + 12', desde: 4 }, { t: '2', desde: 4 }, { t: '−10', desde: 4 }, { t: '12', desde: 4 }, { t: '5', desde: 5, fuerte: true }, { t: '6', desde: 5, fuerte: true }],
        ],
        pie: '', alt: 'Tabla: en x² − 5x + 6 y en 2x² − 10x + 12, −b/a = 5 y c/a = 6',
      },
      pasos: [
        { estado: { corte: 1 }, texto: 'Con raíces 2 y 3, la ecuación es (x − 2)(x − 3) = 0.', ecuacion: ['(', x, ' − 2)(', x, ' − 3) = ', x, '² − 5', x, ' + 6'] },
        { estado: { corte: 2 }, texto: 'Al multiplicar, el término en x lleva la suma con signo menos.', ecuacion: [x, '² − (2 + 3)', x, ' + 2 · 3'] },
        { estado: { corte: 3 }, texto: 'Por eso la suma es −b y el producto es c, cuando a = 1.', ecuacion: [S, ' = 5   ·   ', P, ' = 6'] },
        { estado: { corte: 4 }, texto: 'Multiplicar todo por 2 no cambia las raíces, pero sí a, b y c.', ecuacion: ['2', x, '² − 10', x, ' + 12 = 0'] },
        { estado: { corte: 5 }, texto: 'Dividiendo entre a se recuperan la suma y el producto.', ecuacion: [S, ' = ', { frac: ['10', '2'] }, ' = 5   ·   ', P, ' = ', { frac: ['12', '2'] }, ' = 6'] },
      ],
    },
    regla: {
      texto: 'Si r y s son las raíces de ax² + bx + c = 0, su suma es −b/a y su producto, c/a. No hace falta resolver la ecuación para conocerlos.',
      ecuacion: [S, ' = ', { frac: [['−', b], 'a'] }, '   ·   ', P, ' = ', { frac: [c, 'a'] }],
      condicion: 'a ≠ 0. Vale también si las raíces son complejas; una raíz doble se cuenta dos veces.',
    },
    ahoraTu: {
      generar(s) {
        const r = azar(s), a = r.ent(1, 3);
        let r1 = r.ent(-4, 5), r2 = r.ent(-4, 5);
        if (r1 === 0 && r2 === 0) r2 = 2;
        const bb = -a * (r1 + r2), cc = a * r1 * r2, Sm = r1 + r2, Pm = r1 * r2;
        const pide = ['suma', 'producto', 'cuadrados'][s % 3];
        const ec = ['Las raíces de ', ...poli([a, bb, cc]), ' = 0 son r y s. '];
        if (pide === 'suma') return {
          pregunta: [...ec, '¿Cuánto vale r + s?'],
          opciones: distintas([
            { id: 'c', texto: f(Sm), correcta: true },
            { id: 'sin-a', texto: f(-bb), error: 'TAL-NORMALIZA', siFuera: `Eso es −b sin dividir entre a = ${a}.` },
            { id: 'signo', texto: f(-Sm), error: 'TAL-SIGNO-SUMA', siFuera: 'La suma es −b/a: falta cambiar el signo de b.' },
            { id: 'prod', texto: f(Pm), error: 'TAL-PRODUCTO', siFuera: 'Eso es el producto, c/a.' },
            { id: 'b', texto: f(bb), error: 'TAL-SIGNO-SUMA', siFuera: 'Eso es b, sin el signo menos ni la división entre a.' },
          ]),
          solucion: { texto: 'La suma de raíces es −b/a.', ecuacion: [S, ` = −(${f(bb)})/${a} = ${f(Sm)}`] },
        };
        if (pide === 'producto') return {
          pregunta: [...ec, '¿Cuánto vale r · s?'],
          opciones: distintas([
            { id: 'c', texto: f(Pm), correcta: true },
            { id: 'sin-a', texto: f(cc), error: 'TAL-NORMALIZA', siFuera: `Eso es c sin dividir entre a = ${a}.` },
            { id: 'signo', texto: f(-Pm), error: 'TAL-SIGNO-SUMA', siFuera: 'El producto es c/a, sin cambio de signo.' },
            { id: 'suma', texto: f(Sm), error: 'TAL-PRODUCTO', siFuera: 'Eso es la suma, −b/a.' },
            { id: 'mas1', texto: f(Pm + 1), error: 'TAL-PRODUCTO', siFuera: 'El producto es exactamente c/a.' },
          ]),
          solucion: { texto: 'El producto de raíces es c/a.', ecuacion: [P, ` = ${f(cc)}/${a} = ${f(Pm)}`] },
        };
        const q = Sm * Sm - 2 * Pm;
        return {
          pregunta: [...ec, '¿Cuánto vale r² + s²?'],
          opciones: distintas([
            { id: 'c', texto: f(q), correcta: true },
            { id: 'binomio', texto: f(Sm * Sm), error: 'AL8', siFuera: `Eso es (r + s)²; le falta restar 2rs = ${f(2 * Pm)}.` },
            { id: 'mas', texto: f(Sm * Sm + 2 * Pm), error: 'AL8', siFuera: 'El doble producto se resta: (r + s)² − 2rs.' },
            { id: 'una', texto: f(Sm * Sm - Pm), error: 'AL8', siFuera: 'Se resta 2rs, no rs.' },
            { id: 'suma', texto: f(Sm), error: 'TAL-PRODUCTO', siFuera: 'Eso es r + s, no la suma de cuadrados.' },
          ]),
          solucion: { texto: `Con suma ${f(Sm)} y producto ${f(Pm)}: (r + s)² − 2rs.`, ecuacion: [`${Sm < 0 ? `(${f(Sm)})` : f(Sm)}² − 2 · ${Pm < 0 ? `(${f(Pm)})` : f(Pm)} = ${f(q)}`] },
        };
      },
    },
  };

  // ---------- Idea 5: la letra es un número ----------
  // Cambia: S y P en el aula · Permanece: la frase «6 estudiantes por profesor» · Progresa: qué ecuación se
  // cumple · Se reserva: el orden de las palabras que lleva a 6S = P · Debe verse: S = 6P, porque S es una cantidad.
  const Sx = { v: 'c-o', t: 'S' }, Px = { v: 'c-i', t: 'P' };
  const marca = ok => ({ t: ok ? '✓' : '✗', color: ok ? 'd' : 'h', fuerte: true });
  const planteo = {
    id: 'planteo',
    titulo: 'La letra es un número',
    temas: ['Planteo de ecuaciones'],
    pieza: 'alg-tabla',
    juega: {
      consigna: 'En un aula hay 6 estudiantes por cada profesor. S es el número de estudiantes y P el de profesores. ¿Qué ecuación se cumple?',
      voz: 'Prueba varios números y mira cuál ecuación acierta.',
      controles: [
        { id: 'P', etiqueta: 'P', color: 'c-i', min: 1, max: 5, paso: 1, inicio: 1, decimales: 0 },
        { id: 'S', etiqueta: 'S', color: 'c-o', min: 6, max: 30, paso: 6, inicio: 6, decimales: 0 },
      ],
      dibujo: v => ({ datos: { columnas: ['S', 'P', 'S = 6P', '6S = P'], colorCol: ['o', 'i'], filas: [[f(v.S), f(v.P), marca(v.S === 6 * v.P), marca(6 * v.S === v.P)]], pie: v.S === 6 * v.P ? '6 estudiantes por profesor' : `${f(v.S / v.P)} estudiantes por profesor` }, estado: {} }),
      lectura: v => [Sx, ` = ${f(v.S)}, `, Px, ` = ${f(v.P)}: ${f(v.S / v.P, 1)} por profesor`],
      minimo: 3,
    },
    predice: {
      pregunta: 'En un taller hay 4 alumnos por cada computadora. Si A es el número de alumnos y C el de computadoras, ¿qué ecuación es correcta?',
      opciones: [
        { id: 'c', texto: 'A = 4C', correcta: true },
        { id: 'inversion', texto: '4A = C', error: 'AL1', siFuera: '4A = C sigue el orden de las palabras; con 8 alumnos daría 32 computadoras.' },
        { id: 'suma', texto: 'A + 4 = C', error: 'AL3', siFuera: 'Eso diría que hay 4 computadoras más que alumnos.' },
        { id: 'iguales', texto: '4A = 4C', error: 'AL2', siFuera: 'Eso diría que hay tantos alumnos como computadoras.' },
      ],
      dibujo: { datos: { columnas: ['A', 'C', 'A = 4C', '4A = C'], filas: [['8', '2', { t: '?', desde: 1 }, { t: '?', desde: 1 }]] }, estado: {} },
      revelar: { datos: { columnas: ['A', 'C', 'A = 4C', '4A = C'], filas: [['8', '2', marca(true), marca(false)], ['12', '3', marca(true), marca(false)]], pie: '4 alumnos por computadora' }, estado: {} },
      coincide: 'Coincide: A cuenta alumnos, y hay 4 veces más alumnos que computadoras.',
    },
    mira: {
      datos: {
        columnas: ['hoy', 'en 12 años', 'si x = 12'], rotulosFila: ['Hijo', 'Madre'],
        filas: [[{ t: 'x', color: 'o', desde: 1, fuerte: true }, { t: 'x + 12', desde: 2 }, { t: '12 → 24', desde: 4 }], [{ t: '3x', desde: 1 }, { t: '3x + 12', desde: 2 }, { t: '36 → 48', desde: 4, fuerte: true }]],
        alt: 'Tabla de edades: hijo x y madre 3x hoy; en 12 años, x + 12 y 3x + 12; con x = 12, 24 y 48',
      },
      voz: 'Primero digo qué número es x. Después escribo.',
      pasos: [
        { estado: { corte: 1 }, texto: 'La madre tiene el triple de años que su hijo; x: años del hijo.', ecuacion: ['hijo: ', x, '   ·   madre: 3', x] },
        { estado: { corte: 2 }, texto: 'En 12 años, los dos suman 12.', ecuacion: [x, ' + 12   ·   3', x, ' + 12'] },
        { estado: { corte: 2 }, texto: 'Entonces la madre tendrá el doble que el hijo.', ecuacion: ['3', x, ' + 12 = 2(', x, ' + 12)'] },
        { estado: { corte: 3 }, texto: 'Se resuelve: 3x + 12 = 2x + 24.', ecuacion: [x, ' = 12'] },
        { estado: { corte: 4 }, texto: 'Se comprueba en el enunciado: hoy 12 y 36; luego 24 y 48.', ecuacion: ['48 = 2 · 24 ✓'] },
      ],
    },
    regla: {
      texto: 'Primero se dice qué cantidad representa la letra. Cada frase se vuelve una igualdad entre cantidades, y la respuesta se comprueba en el enunciado.',
      ecuacion: ['6 estudiantes por profesor  ⇒  ', Sx, ' = 6', Px],
      condicion: 'la letra es un número (cuántos estudiantes), no una etiqueta («estudiante»); la solución debe tener sentido en el problema.',
    },
    ahoraTu: {
      pieza: 'alg-tabla',
      generar(s) {
        const r = azar(s);
        if (s % 2 === 0) {
          // Edades: la madre tiene k veces la edad del hijo; dentro de n años tendrá m veces.
          const kk = r.ent(3, 5), m = r.ent(2, kk - 1), base = r.ent(2, 5) * (m - 1), xx = base, n = xx * (kk - m) / (m - 1);
          return {
            pregunta: `Una madre tiene ${kk} veces la edad de su hijo. Dentro de ${n} años tendrá ${m} veces la edad que él tenga entonces. ¿Cuántos años tiene hoy el hijo?`,
            opciones: distintas([
              { id: 'c', texto: `${xx} años`, correcta: true },
              { id: 'futuro', texto: `${xx + n} años`, error: 'TAL-TIEMPO', siFuera: `Esa es la edad del hijo dentro de ${n} años; se pide la de hoy.` },
              { id: 'madre', texto: `${kk * xx} años`, error: 'AL3', siFuera: 'Esa es la edad de la madre hoy.' },
              { id: 'parentesis', texto: `${fr(m * n, kk - m)} años`, error: 'TAL-PARENTESIS', siFuera: `Falta sumar ${n} a la edad de la madre también.` },
            ]),
            solucion: { texto: `Con x la edad del hijo hoy: ${kk}x + ${n} = ${m}(x + ${n}).`, ecuacion: [x, ` = ${xx}  ·  comprobación: ${kk * xx + n} = ${m} · ${xx + n}`] },
          };
        }
        // Tres números consecutivos que suman N.
        const a0 = r.ent(4, 40), N = 3 * a0 + 3;
        return {
          pregunta: `Tres números enteros consecutivos suman ${N}. ¿Cuál es el menor?`,
          opciones: distintas([
            { id: 'c', texto: f(a0), correcta: true },
            { id: 'medio', texto: f(a0 + 1), error: 'TAL-INCOGNITA', siFuera: `${a0 + 1} es el del medio: N ÷ 3. El menor es uno menos.` },
            { id: 'mayor', texto: f(a0 + 2), error: 'TAL-INCOGNITA', siFuera: 'Ese es el mayor de los tres.' },
            { id: 'sin-uno', texto: f(Math.round(N / 3) - 3), error: 'TAL-PLANTEO', siFuera: 'Con x el menor, los otros son x + 1 y x + 2.' },
          ]),
          solucion: { texto: 'Con x el menor: x + (x + 1) + (x + 2) = 3x + 3.', ecuacion: ['3', x, ` + 3 = ${N}  ⇒  `, x, ` = ${a0}`], dibujo: { datos: { columnas: ['x', 'x + 1', 'x + 2', 'suma'], colorCol: ['o'], filas: [[f(a0), f(a0 + 1), f(a0 + 2), { t: f(N), fuerte: true }]] }, estado: {} } },
        };
      },
    },
  };

  return {
    unidad: 'algebra.ecuaciones-lineales-y-cuadraticas',
    version: '0.1.0',
    estado: 'completa',
    requiere: ['/nucleo/kit/piezas/balanza.js', '/nucleo/kit/piezas/recta.js', '/nucleo/kit/piezas/ejes.js', '/nucleo/kit/piezas/alg-tabla.js'],
    historia: {
      texto: 'Las tablillas babilónicas ya resolvían problemas que hoy escribimos como ecuaciones cuadráticas. Siglos después, al-Juarismi ordenó los casos con coeficientes positivos y los justificó completando cuadrados con figuras. Aceptar las soluciones negativas y escribir con símbolos permitió juntar esos casos en una sola fórmula. Completar el cuadrado explica la fórmula; comprobar las soluciones decide cuáles responden al problema.',
      pregunta: '¿Cómo sabes que no te falta ninguna solución?',
      fuente: { titulo: 'O’Connor y Robertson, Quadratic, cubic and quartic equations — MacTutor', url: 'https://mathshistory.st-andrews.ac.uk/HistTopics/Quadratic_etc_equations/' },
    },
    ideas: [primerGrado, dividirX, discriminante, vieta, planteo],
  };
});
