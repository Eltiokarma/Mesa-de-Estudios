/*
 * Motor de Ácidos, bases y pH.
 *
 * Aquí vive toda la química de la plantilla (regla 1 de CLAUDE.md). No toca el DOM: funciona igual
 * en el navegador (window.MotorAcido) y en Node (require('./motor.js')), donde lo prueban casos.json
 * y papel.json.
 *
 * Constantes (25 °C):
 *   Kw = [H⁺]·[OH⁻] = 1,0 × 10⁻¹⁴, así que pH + pOH = 14. A otra temperatura Kw cambia: el motor no lo modela.
 *   pH = −log10[H⁺] y pOH = −log10[OH⁻], con Math.log10 (logaritmos exactos, no log 2 = 0,3 de academia).
 *   "H⁺" es la forma corta de H₃O⁺.
 *
 * Concentraciones en mol/L y volúmenes en mL (como en los problemas de admisión).
 *
 * Cómo se calcula el pH. Siempre con el balance de cargas completo, que incluye los H⁺ y OH⁻ del agua:
 *     [H⁺] + [cationes] = [OH⁻] + [aniones]
 * Con un ácido débil, [A⁻] = C·Ka/(Ka + [H⁺]); con una base débil, [BH⁺] = C·[H⁺]/([H⁺] + Kw/Kb). La función
 * es creciente en [H⁺], así que se resuelve por bisección sobre log[H⁺] (resolver()): no hay casos que fallen.
 * Por eso un ácido diluido nunca pasa de pH 7 y la neutralización exacta de fuerte con fuerte da pH 7.
 *
 * Además, cada resultado trae las cuentas de academia, para mostrarlas en los pasos:
 *   aprox       ácido fuerte: [H⁺] = θ·C; ácido débil: [H⁺] = √(Ka·C) (supone que se ioniza poco y olvida el agua).
 *   cuadratica  ácido débil sin el agua: x² + Ka·x − Ka·C = 0, x = (−Ka + √(Ka² + 4·Ka·C))/2.
 *   aproxValida la aproximación √(Ka·C) se acepta si la ionización que predice es de 5 % o menos. Falla
 *               cuando el ácido es muy diluido o su Ka es grande (C/Ka < 400, más o menos): ahí va la cuadrática.
 *   La cuadrática a su vez falla solo cuando [H⁺] se acerca a 10⁻⁷ (ácido muy diluido): ahí manda el agua,
 *   y el valor bueno es 'pH', que sale del balance completo.
 *
 * Convención de academia para H₂SO₄: se toma como diprótico fuerte (θ = 2: entrega sus dos H⁺). En la realidad
 * el segundo H⁺ no sale del todo (Ka₂ ≈ 10⁻²); los problemas de admisión lo ignoran y el motor también.
 * Bases con θ = 2: Ca(OH)₂ y Ba(OH)₂ entregan dos OH⁻ por fórmula.
 *
 *   solucion({ acido:0.01 })                     ácido fuerte (HCl): pH 2
 *   solucion({ acido:0.005, theta:2 })           ácido fuerte diprótico (H₂SO₄)
 *   solucion({ acido:0.2, Ka:2e-5 })             ácido débil
 *   solucion({ base:0.001 }) · ({ base:0.1, Kb:1.8e-5 }) · ({ neutro:0.1 })
 *   sustancia('NH3', 0.1)                        lo mismo con el catálogo SUSTANCIAS
 *   diluir({ acido:0.01 }, 100)                  diluir 100 veces (el volumen final es 100 veces el inicial)
 *   mezclar({ acido:{ C, mL, Ka, theta }, base:{ C, mL, Kb, theta } })   neutralización y exceso
 *   volumenEquivalencia({ C, mL, theta }, { C, theta })                  mL de base para neutralizar
 *   titulacion(acido, base, [0, 10, 20, 30])      pH después de cada volumen de base
 *   razonH(3, 5).veces                            cuántas veces más H⁺ tiene pH 3 que pH 5 (100)
 *   particulas(resultado, escala)                 cuántas partículas de cada especie ve una lupa
 *
 * Cada resultado trae un campo 'errores' con los valores que dan los errores típicos del informe
 * docs/investigacion/equilibrio-acidos-electroquimica-ideas-erroneas.md: son las opciones incorrectas.
 *
 * Modelo de partículas para la lupa. La lupa mira un volumen fijo; una 'escala' dice cuántos mol/L vale cada
 * partícula dibujada. Cada especie da [X]/escala partículas: H⁺, OH⁻, A⁻ (anión), HA (molécula entera),
 * M (catión de una base fuerte, como Na⁺), B y BH⁺ (base débil y su ácido conjugado) y N (molécula neutra,
 * como CH₃OH). Un ácido fuerte se ve todo roto (A⁻ + H⁺); uno débil, casi todo entero (HA). Concentrado y
 * diluido se ven en cuántas partículas caben en la lupa. Los conteos se redondean al entero más cercano para
 * dibujarlos, y 'exacto' avisa cuando hubo que redondear. ubicar() reparte puntos en el círculo con semilla.
 */
(function (root, fabrica) {
  const motor = fabrica();
  if (typeof module === 'object' && module.exports) module.exports = motor;
  else root.MotorAcido = motor;
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  const KW = 1e-14;            // producto iónico del agua a 25 °C
  const PH_NEUTRO = 7;         // −log10(√Kw)
  const LIMITE_APROX = 0.05;   // la aproximación √(Ka·C) se acepta si la ionización es ≤ 5 %
  const log10 = Math.log10;
  const EPS = 1e-12;

  // Catálogo de sustancias. Constantes de tabla usuales a 25 °C, redondeadas.
  const SUSTANCIAS = Object.freeze({
    HCl:       { nombre: 'ácido clorhídrico', tipo: 'acido', anion: 'Cl⁻' },
    HNO3:      { nombre: 'ácido nítrico', tipo: 'acido', anion: 'NO₃⁻' },
    H2SO4:     { nombre: 'ácido sulfúrico', tipo: 'acido', theta: 2, anion: 'SO₄²⁻' },
    CH3COOH:   { nombre: 'ácido acético', tipo: 'acido', K: 1.8e-5, anion: 'CH₃COO⁻' },
    HF:        { nombre: 'ácido fluorhídrico', tipo: 'acido', K: 6.8e-4, anion: 'F⁻' },
    // El SO₂ no tiene H: en agua forma H₂SO₃, que suelta un H⁺ (primera ionización, Ka₁ ≈ 1,4 × 10⁻²).
    SO2:       { nombre: 'dióxido de azufre', tipo: 'acido', K: 1.4e-2, anion: 'HSO₃⁻' },
    NaOH:      { nombre: 'hidróxido de sodio', tipo: 'base', cation: 'Na⁺' },
    KOH:       { nombre: 'hidróxido de potasio', tipo: 'base', cation: 'K⁺' },
    'Ca(OH)2': { nombre: 'hidróxido de calcio', tipo: 'base', theta: 2, cation: 'Ca²⁺' },
    'Ba(OH)2': { nombre: 'hidróxido de bario', tipo: 'base', theta: 2, cation: 'Ba²⁺' },
    NH3:       { nombre: 'amoníaco', tipo: 'base', K: 1.8e-5, cation: 'NH₄⁺' },
    CH3OH:     { nombre: 'metanol', tipo: 'neutro' },
    NaCl:      { nombre: 'cloruro de sodio', tipo: 'neutro' },
  });

  // ---------- Validación ----------
  function numero(x, que, o) {
    o = o || {};
    const v = Number(x);
    if (x === null || x === undefined || x === '' || typeof x === 'boolean' || !Number.isFinite(v)) throw new Error(`${que}: falta un número`);
    if (o.positivo && !(v > 0)) throw new Error(`${que} debe ser mayor que cero`);
    if (!o.positivo && v < 0) throw new Error(`${que} no puede ser negativo`);
    return v;
  }
  function constante(K, que) {
    if (K === undefined || K === null || K === Infinity) return Infinity;   // sin constante: fuerte
    return numero(K, que, { positivo: true });
  }
  function theta(t) {
    if (t === undefined || t === null) return 1;
    const v = Number(t);
    if (!(Number.isInteger(v) && v > 0)) throw new Error('θ debe ser un entero positivo (H⁺ u OH⁻ que entrega cada fórmula)');
    return v;
  }

  // ---------- [H⁺], pH y compañía ----------
  function desdeH(H) {
    H = numero(H, '[H⁺]', { positivo: true });
    const OH = KW / H;
    return { H, OH, pH: -log10(H), pOH: -log10(OH) };
  }
  function desdePH(pH) {
    pH = numero(pH, 'el pH');   // pH negativo no se acepta: fuera de lo que se pregunta
    return desdeH(Math.pow(10, -pH));
  }
  // Cuántas veces más H⁺ tiene la solución de pH1 que la de pH2. Errores: escala lineal (resta o razón de pH).
  function razonH(pH1, pH2) {
    pH1 = numero(pH1, 'el primer pH'); pH2 = numero(pH2, 'el segundo pH');
    return {
      veces: Math.pow(10, pH2 - pH1),
      errores: { resta: pH2 - pH1, razonPH: pH1 > 0 ? pH2 / pH1 : undefined },
    };
  }

  // Balance de cargas: [H⁺] + θb·[cationes] = [OH⁻] + θa·[aniones]. Devuelve [H⁺] (mol/L).
  //   Ca, Ka, ta: ácido (Ka = Infinity si es fuerte; solo fuerte si θ > 1)
  //   Cb, Kb, tb: base (Kb = Infinity si es fuerte)
  function resolver(o) {
    o = o || {};
    const Ca = numero(o.Ca || 0, 'la concentración del ácido'), Cb = numero(o.Cb || 0, 'la concentración de la base');
    const Ka = constante(o.Ka, 'Ka'), Kb = constante(o.Kb, 'Kb');
    const ta = theta(o.ta), tb = theta(o.tb);
    if (ta > 1 && Ka !== Infinity) throw new Error('el motor solo trata ácidos polipróticos fuertes (como H₂SO₄ en los problemas de academia)');
    if (tb > 1 && Kb !== Infinity) throw new Error('el motor solo trata bases con θ > 1 si son fuertes');
    const KaConj = Kb === Infinity ? 0 : KW / Kb;   // Ka del ácido conjugado de la base débil
    const f = H => {
      const aniones = Ka === Infinity ? ta * Ca : Ca * Ka / (Ka + H);
      const cationes = Kb === Infinity ? tb * Cb : Cb * H / (H + KaConj);
      return H + cationes - KW / H - aniones;
    };
    let lo = -20, hi = 3;   // log10 [H⁺]
    if (f(Math.pow(10, hi)) < 0) throw new Error('concentración fuera de rango');
    for (let k = 0; k < 200; k++) {
      const m = (lo + hi) / 2;
      if (f(Math.pow(10, m)) > 0) hi = m; else lo = m;
      if (hi - lo < 1e-15) break;
    }
    return Math.pow(10, (lo + hi) / 2);
  }

  // Especies en solución (mol/L) a partir de [H⁺].
  function especies(H, o) {
    const Ca = o.Ca || 0, Cb = o.Cb || 0, Ka = constante(o.Ka), Kb = constante(o.Kb), ta = theta(o.ta), tb = theta(o.tb);
    const e = { H, OH: KW / H, A: 0, HA: 0, M: 0, B: 0, BH: 0, N: o.N || 0 };
    if (Ca > 0) {
      if (Ka === Infinity) e.A = Ca;                    // todo roto: una partícula de anión por fórmula (SO₄²⁻ lleva θ = 2)
      else { e.A = Ca * Ka / (Ka + H); e.HA = Ca - e.A; }
    }
    if (Cb > 0) {
      if (Kb === Infinity) e.M = Cb;                    // catión de la base fuerte (Na⁺, Ca²⁺)
      else { e.BH = Cb * H / (H + KW / Kb); e.B = Cb - e.BH; }
    }
    void ta; void tb;
    return e;
  }

  // ---------- Una solución ----------
  // o = { acido: C, Ka, theta } · { base: C, Kb, theta } · { neutro: C }
  function solucion(o) {
    o = o || {};
    const claves = ['acido', 'base', 'neutro'].filter(k => o[k] !== undefined);
    if (claves.length !== 1) throw new Error('indica una sola cosa disuelta: acido, base o neutro');
    const tipo = claves[0];
    const C = numero(o[tipo], tipo === 'acido' ? 'la concentración del ácido' : tipo === 'base' ? 'la concentración de la base' : 'la concentración', { positivo: true });
    const t = theta(o.theta);
    if (tipo === 'neutro') {
      const H = resolver({});
      return Object.assign(desdeH(H), { tipo, C, theta: 1, fuerte: false, ionizacion: 0, especies: especies(H, { N: C }), errores: {} });
    }
    const K = constante(tipo === 'acido' ? o.Ka : o.Kb, tipo === 'acido' ? 'Ka' : 'Kb');
    const fuerte = K === Infinity;
    const par = tipo === 'acido' ? { Ca: C, Ka: K, ta: t } : { Cb: C, Kb: K, tb: t };
    const H = resolver(par);
    const r = Object.assign(desdeH(H), { tipo, C, theta: t, fuerte, especies: especies(H, par), errores: {} });
    if (tipo === 'acido') r.Ka = K; else r.Kb = K;
    const e = r.especies;
    // fracción de fórmulas que se rompieron (ionización o grado de disociación)
    r.ionizacion = tipo === 'acido' ? (fuerte ? 1 : e.A / C) : (fuerte ? 1 : e.BH / C);

    // Lo que suelta el soluto: [H⁺] del ácido o [OH⁻] de la base, sin contar el agua (cuenta de academia)
    const lado = tipo === 'acido' ? 'H' : 'OH';
    const p = x => -log10(x), desdeLado = x => (tipo === 'acido' ? p(x) : 14 + log10(x));
    if (fuerte) {
      r.aprox = { [lado]: t * C, pH: desdeLado(t * C) };
      r.aprox.pOH = 14 - r.aprox.pH;
      r.errores.sinAgua = r.aprox.pH;                                 // olvida el agua: un ácido 10⁻⁸ M "tiene pH 8"
      if (t > 1) r.errores.sinTheta = desdeLado(C);                  // olvida los dos H⁺ (u OH⁻)
    } else {
      const x0 = Math.sqrt(K * C), xq = (-K + Math.sqrt(K * K + 4 * K * C)) / 2;
      r.aprox = { [lado]: x0, pH: desdeLado(x0), ionizacion: x0 / C };
      r.aprox.pOH = 14 - r.aprox.pH;
      r.cuadratica = { [lado]: xq, pH: desdeLado(xq), ionizacion: xq / C };
      r.cuadratica.pOH = 14 - r.cuadratica.pH;
      r.aproxValida = x0 / C <= LIMITE_APROX;
      r.errorAprox = (x0 - xq) / xq;                                  // error relativo de √(Ka·C) frente a la cuadrática
      r.errores.comoFuerte = desdeLado(C);                           // trata el débil como fuerte (0,2 M → pH 0,7)
    }
    // Logaritmo con el signo cambiado: [H⁺] = m·10⁻ᵏ da k + log m en vez de k − log m (HCl 0,002 M: 3,3 en vez de 2,7)
    const xs = r.aprox[lado], k = Math.ceil(-log10(xs) - 1e-12), m = xs * Math.pow(10, k);
    if (Math.abs(m - 1) > 1e-9) r.errores.signoLog = tipo === 'acido' ? k + log10(m) : 14 - (k + log10(m));
    if (tipo === 'base') r.errores.pOHcomoPH = r.pOH;                 // da −log[OH⁻] y no le resta de 14 (AB7)
    return r;
  }
  function sustancia(formula, C) {
    const s = SUSTANCIAS[formula];
    if (!s) throw new Error(`sustancia desconocida: ${formula}`);
    const o = { [s.tipo]: C };
    if (s.theta) o.theta = s.theta;
    if (s.K) o[s.tipo === 'acido' ? 'Ka' : 'Kb'] = s.K;
    return Object.assign(solucion(o), { formula, nombre: s.nombre });
  }

  // ---------- Diluir ----------
  // Se agrega agua hasta que el volumen sea 'factor' veces el inicial: la concentración baja 'factor' veces.
  function diluir(o, factor) {
    factor = numero(factor, 'el factor de dilución', { positivo: true });
    if (factor < 1) throw new Error('al diluir, el volumen final no puede ser menor que el inicial');
    const antes = solucion(o), tipo = antes.tipo;
    const o2 = Object.assign({}, o, { [tipo]: antes.C / factor });
    const despues = solucion(o2), lf = log10(factor);
    const r = { factor, antes, despues, dpH: despues.pH - antes.pH, errores: {} };
    const hacia = tipo === 'base' ? -1 : 1;                           // el ácido sube hacia 7; la base baja hacia 7
    r.errores.sinCambio = antes.pH;                                    // "sigue siendo el mismo ácido" (AB2)
    r.errores.alReves = antes.pH - hacia * lf;                         // "el diluido tiene menor pH" (AB5)
    r.errores.neutro = PH_NEUTRO;                                      // "con tanta agua se vuelve neutro"
    if (tipo !== 'neutro') r.errores.comoFuerte = antes.pH + hacia * lf; // sube log(factor), como uno fuerte sin agua
    if (antes.fuerte) r.errores.sinAgua = despues.aprox.pH;            // pasa de 7 si se olvida el agua
    if (!antes.fuerte && tipo !== 'neutro') {
      r.errores.todoIonizado = antes.errores.comoFuerte;               // −log C inicial: "se ioniza todo" (0,7 en el informe)
      r.errores.ionizacionIgual = antes.ionizacion;                    // "el grado de ionización no cambia"
    }
    return r;
  }

  // ---------- Mezclar ácido y base ----------
  // acido = { C, mL, Ka, theta }, base = { C, mL, Kb, theta }. Se cuentan los equivalentes (H⁺ y OH⁻ que pueden
  // entregar), se suman los volúmenes y el pH sale del balance de cargas con las concentraciones de la mezcla:
  // así sirve con exceso de ácido, con exceso de base, en la equivalencia y con un ácido o una base débil.
  function parte(x, que) {
    if (!x) throw new Error(`falta ${que}`);
    return { C: numero(x.C, `la concentración ${que === 'el ácido' ? 'del ácido' : 'de la base'}`), mL: numero(x.mL, `el volumen ${que === 'el ácido' ? 'del ácido' : 'de la base'}`),
      K: constante(que === 'el ácido' ? x.Ka : x.Kb, que === 'el ácido' ? 'Ka' : 'Kb'), t: theta(x.theta) };
  }
  function mezclar(o) {
    o = o || {};
    const a = parte(o.acido, 'el ácido'), b = parte(o.base, 'la base');
    const mL = a.mL + b.mL;
    if (!(mL > 0)) throw new Error('la mezcla no tiene volumen');
    const L = mL / 1000;
    const nA = a.C * a.mL / 1000, nB = b.C * b.mL / 1000;              // moles de fórmulas
    const eqA = nA * a.t, eqB = nB * b.t;                              // moles de H⁺ y de OH⁻ que pueden entregar
    const par = { Ca: nA / L, Ka: a.K, ta: a.t, Cb: nB / L, Kb: b.K, tb: b.t };
    const H = resolver(par);
    const r = Object.assign(desdeH(H), { mL, nAcido: nA, nBase: nB, eqAcido: eqA, eqBase: eqB, especies: especies(H, par) });
    const dif = eqA - eqB, tolEq = EPS * Math.max(eqA, eqB, 1e-30) * 1e3;
    r.sobra = Math.abs(dif) <= tolEq ? 'nada' : dif > 0 ? 'acido' : 'base';
    r.exceso = Math.abs(dif) <= tolEq ? 0 : Math.abs(dif);             // moles de H⁺ u OH⁻ que sobran
    r.equivalencia = r.sobra === 'nada';
    // [H⁺] u [OH⁻] del exceso, como en academia (solo tiene sentido si lo que sobra es fuerte)
    if (r.sobra === 'acido') r.excesoH = dif / L;
    if (r.sobra === 'base') r.excesoOH = -dif / L;
    r.errores = {
      siempreNeutro: PH_NEUTRO,                                        // "después de neutralizar queda neutra" (AB9)
      sinSumarVolumenes: r.sobra === 'acido' ? -log10(dif / (a.mL / 1000))
        : r.sobra === 'base' ? 14 + log10(-dif / (a.mL / 1000)) : undefined, // divide el exceso solo entre el volumen inicial
    };
    return r;
  }
  // mL de base que neutralizan el ácido: eq de ácido = eq de base.
  function volumenEquivalencia(acido, base) {
    const a = { C: numero(acido && acido.C, 'la concentración del ácido', { positivo: true }), mL: numero(acido && acido.mL, 'el volumen del ácido', { positivo: true }), t: theta(acido && acido.theta) };
    const b = { C: numero(base && base.C, 'la concentración de la base', { positivo: true }), t: theta(base && base.theta) };
    const mL = a.C * a.t * a.mL / (b.C * b.t);
    return { mL, eq: a.C * a.t * a.mL / 1000,
      errores: { sinTheta: a.C * a.mL / b.C, thetaAlReves: a.C * a.mL * a.t * a.t / (b.C * b.t) } }; // C₁V₁ = C₂V₂ sin los H⁺ (12,5 mL)
  }
  function titulacion(acido, base, volumenes) {
    if (!Array.isArray(volumenes) || !volumenes.length) throw new Error('faltan los volúmenes de base');
    return volumenes.map(v => {
      const mL = numero(v, 'el volumen de base');
      if (mL === 0) {
        const s = solucion({ acido: numero(acido && acido.C, 'la concentración del ácido', { positivo: true }), Ka: acido.Ka, theta: acido.theta });
        return { mL, pH: s.pH, H: s.H, sobra: 'acido' };
      }
      const m = mezclar({ acido, base: Object.assign({}, base, { mL }) });
      return { mL, pH: m.pH, H: m.H, sobra: m.sobra };
    });
  }

  // ---------- Partículas para la lupa ----------
  const TIPOS = ['H', 'OH', 'A', 'HA', 'M', 'B', 'BH', 'N'];
  // r: cualquier resultado con 'especies'. escala: mol/L que vale cada partícula de la lupa.
  function particulas(r, escala, opciones) {
    if (!r || !r.especies) throw new Error('faltan las especies de la solución');
    escala = numero(escala, 'la escala de la lupa', { positivo: true });
    const max = opciones && opciones.max !== undefined ? numero(opciones.max, 'el máximo de partículas', { positivo: true }) : Infinity;
    const esperado = {}, n = {};
    let exacto = true, recorte = false;
    for (const k of TIPOS) {
      const x = (r.especies[k] || 0) / escala;
      esperado[k] = x;
      let q = Math.round(x);
      if (Math.abs(x - q) > 1e-6) exacto = false;
      if (q > max) { q = max; recorte = true; }
      n[k] = q;
    }
    return { esperado, n, exacto, recorte, escala,
      formulas: ((r.especies.A || 0) + (r.especies.HA || 0) + (r.especies.M || 0) + (r.especies.B || 0) + (r.especies.BH || 0) + (r.especies.N || 0)) / escala };
  }
  // Escala para que la lupa encuadre 'meta' fórmulas de una solución de concentración C (mol/L por partícula).
  function escalaPara(C, meta) {
    C = numero(C, 'la concentración', { positivo: true }); meta = numero(meta, 'las fórmulas por lupa', { positivo: true });
    return C / meta;
  }

  // Azar con semilla (LCG de 32 bits) y reparto de k puntos en el círculo unidad, sin encimarse demasiado
  // (espiral de girasol con temblor). Siempre el mismo reparto con la misma semilla.
  function azar(sem) { let s = (sem >>> 0) || 1; return () => (s = (Math.imul(s, 1664525) + 1013904223) >>> 0) / 4294967296; }
  function ubicar(k, semilla) {
    k = numero(k, 'los puntos');
    if (!Number.isInteger(k)) throw new Error('los puntos se cuentan con enteros');
    const rnd = azar(semilla || 1), out = [], oro = Math.PI * (3 - Math.sqrt(5)), giro = rnd() * Math.PI * 2;
    for (let i = 0; i < k; i++) {
      const r = 0.86 * Math.sqrt((i + 0.5) / Math.max(k, 1)), a = i * oro + giro;
      const t = 0.35 / Math.sqrt(Math.max(k, 1));
      let x = r * Math.cos(a) + (rnd() - 0.5) * t, y = r * Math.sin(a) + (rnd() - 0.5) * t;
      const d = Math.hypot(x, y); if (d > 0.9) { x *= 0.9 / d; y *= 0.9 / d; }
      out.push({ x, y });
    }
    // barajar para que el orden no delate la espiral
    for (let i = out.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [out[i], out[j]] = [out[j], out[i]]; }
    return out;
  }

  return { KW, PH_NEUTRO, LIMITE_APROX, SUSTANCIAS, desdeH, desdePH, razonH, resolver, solucion, sustancia, diluir,
    mezclar, volumenEquivalencia, titulacion, particulas, escalaPara, azar, ubicar };
});
