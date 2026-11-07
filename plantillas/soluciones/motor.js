/*
 * Motor de Soluciones: concentración, dilución, mezcla y solubilidad.
 *
 * Aquí vive toda la química de la plantilla (regla 1 de CLAUDE.md). No toca el
 * DOM: funciona igual en el navegador (window.MotorSolucion) y en Node
 * (require('./motor.js')), donde lo prueban casos.json y papel.json.
 *
 * Masas atómicas de academia: H = 1, C = 12, N = 14, O = 16, Na = 23, Mg = 24,
 * S = 32, Cl = 35,5, K = 39, Ca = 40.
 *
 * Unidades: masas en gramos, cantidades en mol y VOLÚMENES SIEMPRE EN mL (como vienen
 * en los problemas de admisión). La molaridad sale en mol/L: el motor pasa los mL a litros.
 *
 *   solucion({ soluto:'NaOH', g:20, mL:250 })            molaridad, % en masa, molalidad, fracción molar
 *   solucion({ soluto:'H2SO4', g:49, mL:500, theta:2 })  normalidad (N = M·θ)
 *   diluir(6, 50, 200)                                   C1·V1 = C2·V2
 *   mezclar([[2, 100], [1, 300]])                        mezcla de soluciones del mismo soluto
 *   sacar(1, 2000, 500)                                  sacar una parte: la concentración no cambia
 *   agregarSoluto(1, 500, 0.25)                          más soluto con el volumen fijo
 *   aplicar({ n, mL }, accion)                           los cuatro cambios del explorador
 *
 * Cada resultado trae un campo 'errores' con los valores que dan los errores típicos de
 * docs/investigacion/gases-soluciones-ideas-erroneas.md: son las opciones incorrectas de las predicciones.
 *
 * Modelo de "cuadros y puntos" (Raviolo y otros, 2004, citado por Raviolo y Farré, 2020): cada cuadro
 * es un volumen fijo de solución y cada punto, una cantidad fija de soluto. La concentración es
 * "puntos por cuadro". Una escala dice cuántos mL vale un cuadro y cuántos mol/L vale un punto por cuadro:
 *   modelo(0.3, 50, { mLporCuadro:25, MporPunto:0.5 }) → 2 cuadros, 24 puntos, 12 puntos por cuadro.
 * repartir() decide cuántos puntos tocan a cada cuadro (todos iguales, o con uno de diferencia cuando
 * no da exacto) y ubicar() los acomoda dentro de su cuadro con una semilla: siempre igual.
 *
 * SOLUBILIDAD (hueco SO13 y SO6, 7 nov 2026). Tablas declaradas en SOLUBILIDAD; entre dos filas se interpola
 * en línea recta y fuera de la tabla el motor no extrapola (da error). Son valores usuales de las tablas de los
 * textos de química general, redondeados; por contrastar con el CRC Handbook antes de publicar.
 *   KNO3 (g por 100 g de agua), T en °C: 0 13,3 · 10 20,9 · 20 31,6 · 30 45,8 · 40 63,9 · 50 85,5 · 60 110 · 70 138 · 80 169 · 90 202 · 100 246
 *   NaCl (g por 100 g de agua):          0 35,7 · 10 35,8 · 20 36,0 · 30 36,3 · 40 36,6 · 50 37,0 · 60 37,3 · 70 37,8 · 80 38,4 · 90 39,0 · 100 39,8
 *   CO2 (g por kg de agua con 1 atm de CO₂): 0 3,346 · 5 2,774 · 10 2,318 · 15 1,970 · 20 1,688 · 25 1,449 · 30 1,257 · 40 0,973 · 50 0,761 · 60 0,576
 *   solubilidad('KNO3', 20)                                → 31,6 (número: g por 100 g de agua; en gases, g/kg a 1 atm)
 *   curva('KNO3', 5)                                       → [[T, S], …] cada 5 °C de punta a punta de la tabla (para dibujar)
 *   tipoSolucion({ sustancia, g, gAgua:100, T })           g de soluto TODO DISUELTO en gAgua: S, cabe = S·gAgua/100, porCien = 100·g/gAgua,
 *       tipo 'insaturada' (g < cabe), 'saturada' (g = cabe, tolerancia 1e-9) o 'sobresaturada' (g > cabe), falta = cabe − g, exceso = g − cabe;
 *       errores.porSolucion: el tipo si se compara S con los g de soluto por 100 g de SOLUCIÓN (100·g/(g + gAgua)) en vez de por 100 g de agua.
 *   equilibrio({ sustancia, g, gAgua:100, T, sobresaturar })  g de soluto echados (disueltos o no) a T: cabe, disuelto = mín(g, cabe),
 *       solido = g − disuelto, tipo ('saturada' si queda sólido). Con sobresaturar: true (sin sólido ni cristalito) no cristaliza: todo disuelto.
 *   enfriar({ sustancia, g, gAgua:100, T1, T2, sinSemilla })  de T1 a T2 ≤ T1: cabe1, cabe2, solidoAntes = máx(0, g − cabe1),
 *       solidoDespues = máx(0, g − cabe2) (0 con sinSemilla), cristaliza = solidoDespues − solidoAntes, disueltoDespues, tipoAntes, tipoDespues
 *       (de la solución que queda: 'saturada' si hay sólido; con sinSemilla y g > cabe2, 'sobresaturada'), Tsat (T donde empieza a cristalizar,
 *       o null si no cristaliza); errores: laSolubilidad = cabe2 (toma lo que cabe a T2 como lo que cristaliza), restaSolubilidades =
 *       cabe1 − cabe2, nada = 0, tipoPorDiluida = 'insaturada' (SO13: "ya es diluida, entonces es insaturada").
 *   temperaturaSaturacion('KNO3', 80)                      → T (°C) en que la curva vale 80 g por 100 g de agua (null si no la corta)
 *   henry({ gas:'CO2', T, P, kgAgua:1 })                   ley de Henry con k declarada: k = S a 1 atm (tabla), S = k·P (g/kg), g = S·kgAgua;
 *       P en atm (presión parcial del gas); errores.presionInversa = k/P·kgAgua (SO6: más presión, menos gas).
 *   compararGasT({ gas, T1, T2, P, kgAgua })               g1 y g2 a la misma P; masEn = la T con más gas (o 'igual'); errores.masCaliente =
 *       la T mayor (SO6), errores.igual = 'igual' (cree que con la misma P la temperatura no cuenta).
 *   destapar({ gas, T, P1, P2, kgAgua })                   P2 por defecto P_AIRE.CO2 = 0,0004 atm (CO₂ del aire, aproximado): antes, despues
 *       (g disueltos con P1 y con P2), escapa = antes − despues; errores.noSale = 0, errores.presionInversa = g con k/P2 (gana gas).
 * CABECERA: líneas 1 a 58 (qué calcula, unidades, cuadros y puntos, tablas de solubilidad y las funciones del hueco SO13/SO6).
 */
(function (root, fabrica) {
  const motor = fabrica();
  if (typeof module === 'object' && module.exports) module.exports = motor;
  else root.MotorSolucion = motor;
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  const MASAS = Object.freeze({ H: 1, C: 12, N: 14, O: 16, Na: 23, Mg: 24, S: 32, Cl: 35.5, K: 39, Ca: 40 });
  const EPS = 1e-9;

  // ---------- Fórmulas y masas molares ----------
  // Átomos de una fórmula: 'Ca(OH)2' → { Ca: 1, O: 2, H: 2 }. Acepta subíndices Unicode (H₂SO₄).
  function atomos(formula) {
    const f = String(formula).replace(/[₀-₉]/g, d => String('₀₁₂₃₄₅₆₇₈₉'.indexOf(d)));
    let i = 0;
    function grupo() {
      const r = {};
      while (i < f.length && f[i] !== ')') {
        let parte;
        if (f[i] === '(') { i++; parte = grupo(); if (f[i] !== ')') throw new Error(`fórmula mal cerrada: ${formula}`); i++; }
        else {
          const m = /^[A-Z][a-z]?/.exec(f.slice(i));
          if (!m) throw new Error(`fórmula inválida: ${formula}`);
          if (!(m[0] in MASAS)) throw new Error(`elemento sin masa atómica: ${m[0]}`);
          parte = { [m[0]]: 1 }; i += m[0].length;
        }
        const n = /^\d+/.exec(f.slice(i)); const k = n ? Number(n[0]) : 1; if (n) i += n[0].length;
        for (const [e, c] of Object.entries(parte)) r[e] = (r[e] || 0) + c * k;
      }
      return r;
    }
    if (!f) throw new Error('fórmula vacía');
    const r = grupo();
    if (i !== f.length) throw new Error(`fórmula inválida: ${formula}`);
    return r;
  }
  function masaMolar(formula) {
    return Object.entries(atomos(formula)).reduce((s, [e, n]) => s + MASAS[e] * n, 0);
  }

  // ---------- Validación ----------
  function numero(x, que, o) {
    o = o || {};
    const v = Number(x);
    if (x === null || x === undefined || x === '' || !Number.isFinite(v)) throw new Error(`${que}: falta un número`);
    if (o.positivo && !(v > 0)) throw new Error(`${que} debe ser mayor que cero`);
    if (!o.positivo && v < 0) throw new Error(`${que} no puede ser negativo`);
    return v;
  }
  const opcional = (x, que, o) => (x === undefined || x === null ? undefined : numero(x, que, o));

  // ---------- Una solución ----------
  // o = { soluto, g, n, mL, gSolvente, densidad (g/mL de solución), theta, solvente ('H2O') }.
  // Calcula todo lo que los datos permiten; lo que no, queda sin definir.
  function solucion(o) {
    o = o || {};
    const Mm = o.soluto ? masaMolar(o.soluto) : undefined;
    let g = opcional(o.g, 'la masa de soluto');
    let n = opcional(o.n, 'los moles de soluto');
    let mL = opcional(o.mL, 'el volumen de solución', { positivo: true });
    let gSolvente = opcional(o.gSolvente, 'la masa de solvente');
    const densidad = opcional(o.densidad, 'la densidad', { positivo: true });
    const theta = o.theta === undefined ? undefined : Number(o.theta);
    if (theta !== undefined && !(Number.isInteger(theta) && theta > 0)) throw new Error('θ debe ser un entero positivo (H⁺ u OH⁻ que entrega cada fórmula)');
    if (n === undefined && g !== undefined) { if (!Mm) throw new Error('para pasar gramos a moles hace falta el soluto'); n = g / Mm; }
    if (g === undefined && n !== undefined && Mm) g = n * Mm;
    if (n === undefined) throw new Error('falta la cantidad de soluto (g o n)');

    let gSolucion;
    if (gSolvente !== undefined) gSolucion = (g || 0) + gSolvente;
    else if (densidad !== undefined && mL !== undefined) {
      gSolucion = densidad * mL;
      if (g !== undefined) { gSolvente = gSolucion - g; if (gSolvente < -EPS) throw new Error('la masa de soluto supera a la de la solución'); }
    }
    if (mL === undefined && densidad !== undefined && gSolucion !== undefined) mL = gSolucion / densidad;

    const r = { soluto: o.soluto, masaMolar: Mm, n, g, mL, gSolvente, gSolucion, densidad, errores: {} };
    if (mL !== undefined) {
      r.L = mL / 1000;
      r.M = n / r.L;
      r.errores.molaridadEnMl = n / mL;                            // no pasa los mL a litros
      if (gSolvente !== undefined && gSolvente > 0) r.errores.molaridadConSolvente = n / (gSolvente / 1000); // toma el agua (1 g ≈ 1 mL) como volumen de solución
    }
    // % masa-volumen: gramos de soluto por cada 100 mL de solución. Solo pide g y mL (no la densidad).
    if (g !== undefined && mL !== undefined) r.pctMasaVolumen = 100 * g / mL;
    if (gSolucion !== undefined && g !== undefined) {
      r.pctMasa = 100 * g / gSolucion;
      if (gSolvente > 0) r.errores.pctSobreSolvente = 100 * g / gSolvente;        // divide entre el solvente
      if (densidad === undefined && mL !== undefined) r.densidad = gSolucion / mL;
    }
    if (gSolvente !== undefined && gSolvente > 0) {
      r.molalidad = n / (gSolvente / 1000);
      if (gSolucion !== undefined) r.errores.molalidadConSolucion = n / (gSolucion / 1000); // divide entre la solución
      const solvente = o.solvente || 'H2O';
      r.nSolvente = gSolvente / masaMolar(solvente);
      r.xSoluto = n / (n + r.nSolvente);
      r.xSolvente = r.nSolvente / (n + r.nSolvente);
      if (g !== undefined) r.errores.fraccionConMasas = g / (g + gSolvente);        // fracción molar con gramos
    }
    if (theta !== undefined) {
      r.theta = theta;
      r.eq = n * theta;                       // equivalentes: cada fórmula entrega θ H⁺ (u OH⁻)
      if (r.M !== undefined) {
        r.N = r.M * theta;
        r.errores.normalidadIgualM = r.M;     // N = M sin contar equivalentes (SO15)
        r.errores.normalidadDivide = r.M / theta;
        r.errores.normalidadDoble = r.M * theta * theta;
      }
    }
    return r;
  }

  // ---------- Cambios ----------
  // Dilución: V1 mL de solución C1 se llevan con agua hasta V2 mL. Los moles no cambian.
  function diluir(M1, mL1, mL2) {
    M1 = numero(M1, 'la concentración inicial'); mL1 = numero(mL1, 'el volumen inicial', { positivo: true });
    mL2 = numero(mL2, 'el volumen final', { positivo: true });
    if (mL2 < mL1 - EPS) throw new Error('al diluir, el volumen final no puede ser menor que el inicial');
    const n = M1 * mL1 / 1000, M2 = n / (mL2 / 1000), agua = mL2 - mL1;
    return {
      n, M1, mL1, M2, mL2, agua,
      errores: {
        sumaAgua: n / ((mL1 + mL2) / 1000),                    // toma el volumen final como agua agregada
        aguaComoFinal: agua > EPS ? n / (agua / 1000) : undefined, // toma el agua agregada como volumen final
        invertida: M1 * mL2 / mL1,                              // C1·V2/V1: la regla de tres al revés
        sinCambio: M1,
      },
    };
  }
  const diluirConAgua = (M1, mL1, mLagua) => diluir(M1, mL1, numero(mL1, 'el volumen inicial', { positivo: true }) + numero(mLagua, 'el agua agregada'));

  // Mezcla de soluciones del mismo soluto: lista de [M, mL]. Se suman moles y volúmenes.
  function mezclar(lista) {
    if (!Array.isArray(lista) || lista.length < 2) throw new Error('para mezclar hacen falta al menos dos soluciones');
    let n = 0, mL = 0, sumaM = 0;
    const partes = lista.map(([M, v], k) => {
      M = numero(M, `la concentración de la solución ${k + 1}`); v = numero(v, `el volumen de la solución ${k + 1}`, { positivo: true });
      const nk = M * v / 1000; n += nk; mL += v; sumaM += M;
      return { M, mL: v, n: nk };
    });
    const M = n / (mL / 1000);
    return {
      n, mL, M, partes,
      errores: {
        promedioSimple: sumaM / lista.length,   // promedia sin pesar por volumen
        sumaConcentraciones: sumaM,             // suma concentraciones como si fueran cantidades
        moles: n,                               // da los moles como si fueran la concentración
      },
    };
  }

  // Sacar mLs de una solución de M y mL. Lo que queda y lo que se saca tienen la misma concentración.
  function sacar(M, mL, mLs) {
    M = numero(M, 'la concentración'); mL = numero(mL, 'el volumen', { positivo: true }); mLs = numero(mLs, 'el volumen que se saca');
    if (mLs > mL + EPS) throw new Error('no se puede sacar más de lo que hay');
    const n = M * mL / 1000, ns = M * mLs / 1000, f = mLs / mL;
    const quedaV = mL - mLs;
    return {
      inicial: { n, mL, M },
      queda: { n: n - ns, mL: quedaV, M: quedaV > EPS ? M : undefined },
      sacado: { n: ns, mL: mLs, M: mLs > EPS ? M : undefined },
      fraccion: f,
      errores: {
        soloAgua: quedaV > EPS ? n / (quedaV / 1000) : undefined, // cree que solo se sacó agua: "aumenta" (SO10)
        proporcional: M * (1 - f),       // baja como la cantidad: trata M como n (SO7)
        loSacado: M * f,                 // regla de tres mal hecha (SO7)
      },
    };
  }

  // Agregar soluto a volumen constante (el modelo supone que el volumen de la solución no cambia).
  function agregarSoluto(M, mL, nExtra) {
    M = numero(M, 'la concentración'); mL = numero(mL, 'el volumen', { positivo: true }); nExtra = numero(nExtra, 'el soluto agregado');
    const n = M * mL / 1000 + nExtra;
    return { n, mL, M: n / (mL / 1000) };
  }

  // Volumen (mL) que ocupa una cantidad n a la concentración M: n y M fijos, V = n/M.
  function volumenPara(n, M) {
    n = numero(n, 'los moles'); M = numero(M, 'la concentración', { positivo: true });
    return n / M * 1000;
  }

  // Los cuatro cambios del explorador sobre un estado { n, mL }.
  // accion: { tipo:'soluto', n } · { tipo:'agua', mL } · { tipo:'sacar', mL } · { tipo:'mezclar', M, mL }.
  function aplicar(estado, accion) {
    const n0 = numero(estado && estado.n, 'los moles'), V0 = numero(estado && estado.mL, 'el volumen', { positivo: true });
    const a = accion || {};
    let n = n0, mL = V0;
    if (a.tipo === 'soluto') n = n0 + numero(a.n, 'el soluto agregado');
    else if (a.tipo === 'agua') mL = V0 + numero(a.mL, 'el agua agregada');
    else if (a.tipo === 'sacar') {
      const s = numero(a.mL, 'el volumen que se saca');
      if (s >= V0 - EPS) throw new Error('no se puede sacar toda la solución');
      n = n0 * (V0 - s) / V0; mL = V0 - s;
    } else if (a.tipo === 'mezclar') {
      const v = numero(a.mL, 'el volumen agregado', { positivo: true });
      n = n0 + numero(a.M, 'la concentración agregada') * v / 1000; mL = V0 + v;
    } else throw new Error(`cambio desconocido: ${a.tipo}`);
    const M0 = n0 / (V0 / 1000), M = n / (mL / 1000);
    const cmp = (x, y) => (Math.abs(x - y) <= EPS * Math.max(1, Math.abs(y)) ? 'igual' : x > y ? 'sube' : 'baja');
    return { n, mL, M, cambia: { n: cmp(n, n0), V: cmp(mL, V0), M: cmp(M, M0) } };
  }

  // ---------- Cuadros y puntos ----------
  function escalaValida(e) {
    if (!e) throw new Error('falta la escala del modelo');
    const mLporCuadro = numero(e.mLporCuadro, 'los mL por cuadro', { positivo: true });
    const MporPunto = numero(e.MporPunto, 'los mol/L por punto', { positivo: true });
    return { mLporCuadro, MporPunto, molPorPunto: MporPunto * mLporCuadro / 1000 };
  }
  const entero = (x, que) => {
    const k = Math.round(x);
    if (Math.abs(x - k) > 1e-6) throw new Error(`${que} no da un número entero en esta escala (${x})`);
    return k;
  };
  // Cuántos cuadros y cuántos puntos tiene una solución de n mol en mL mililitros.
  // Con { redondear: true } (para el explorador), el soluto que no da puntos enteros se dibuja con el entero
  // más cercano y 'exacto' dice si hubo que redondear. Los cuadros siempre deben ser enteros.
  function modelo(n, mL, escala, opciones) {
    const e = escalaValida(escala);
    n = numero(n, 'los moles'); mL = numero(mL, 'el volumen', { positivo: true });
    const cuadros = entero(mL / e.mLporCuadro, 'el volumen'), crudo = n / e.molPorPunto;
    const redondear = opciones && opciones.redondear;
    const puntos = redondear ? Math.round(crudo) : entero(crudo, 'el soluto');
    return { cuadros, puntos, puntosExactos: crudo, exacto: Math.abs(crudo - Math.round(crudo)) <= 1e-6,
      porCuadro: puntos / cuadros, M: n / (mL / 1000), molPorPunto: e.molPorPunto };
  }
  // Puntos que caen en una lupa del tamaño de un cuadro para una concentración M (puede no ser entero).
  const lupa = (M, escala) => numero(M, 'la concentración') / escalaValida(escala).MporPunto;

  // Azar con semilla (LCG de 32 bits): el mismo reparto cada vez.
  function azar(sem) { let s = (sem >>> 0) || 1; return () => (s = (Math.imul(s, 1664525) + 1013904223) >>> 0) / 4294967296; }
  function barajar(lista, rnd) {
    for (let i = lista.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [lista[i], lista[j]] = [lista[j], lista[i]]; }
    return lista;
  }
  // Cuántos puntos tocan a cada cuadro: todos reciben lo mismo y el resto se reparte de a uno.
  function repartir(puntos, cuadros, semilla) {
    puntos = numero(puntos, 'los puntos'); cuadros = numero(cuadros, 'los cuadros', { positivo: true });
    if (!Number.isInteger(puntos) || !Number.isInteger(cuadros)) throw new Error('los puntos y los cuadros se cuentan con enteros');
    const base = Math.floor(puntos / cuadros), resto = puntos - base * cuadros;
    const conteo = new Array(cuadros).fill(base);
    const orden = barajar([...Array(cuadros).keys()], azar(semilla || 1));
    for (let k = 0; k < resto; k++) conteo[orden[k]]++;
    return conteo;
  }
  // Lugar de cada punto: { c (cuadro), u, v } con u y v entre 0 y 1 dentro del cuadro.
  // Dentro de cada cuadro, los puntos se reparten en una cuadrícula chica con temblor: no se enciman.
  function ubicar(puntos, cuadros, semilla) {
    const conteo = repartir(puntos, cuadros, semilla), rnd = azar((semilla || 1) * 7919 + 13), out = [];
    conteo.forEach((k, c) => {
      if (!k) return;
      const lado = Math.ceil(Math.sqrt(k)), celdas = barajar([...Array(lado * lado).keys()], rnd);
      for (let j = 0; j < k; j++) {
        const cel = celdas[j], cx = (cel % lado + 0.5) / lado, cy = (Math.floor(cel / lado) + 0.5) / lado;
        const u = cx + (rnd() - 0.5) * 0.5 / lado, v = cy + (rnd() - 0.5) * 0.5 / lado;
        out.push({ c, u: Math.min(0.9, Math.max(0.1, u)), v: Math.min(0.9, Math.max(0.1, v)) });
      }
    });
    return out;
  }

  // ---------- Solubilidad: curvas, tipo de solución, cristalización y ley de Henry ----------
  const tabla = (T, S, o) => Object.freeze(Object.assign({ T: Object.freeze(T), S: Object.freeze(S) }, o));
  const SOLUBILIDAD = Object.freeze({
    KNO3: tabla([0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100], [13.3, 20.9, 31.6, 45.8, 63.9, 85.5, 110, 138, 169, 202, 246],
      { nombre: 'nitrato de potasio', formula: 'KNO₃', fase: 'solido', unidad: 'g por 100 g de agua' }),
    NaCl: tabla([0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100], [35.7, 35.8, 36.0, 36.3, 36.6, 37.0, 37.3, 37.8, 38.4, 39.0, 39.8],
      { nombre: 'cloruro de sodio', formula: 'NaCl', fase: 'solido', unidad: 'g por 100 g de agua' }),
    CO2: tabla([0, 5, 10, 15, 20, 25, 30, 40, 50, 60], [3.346, 2.774, 2.318, 1.970, 1.688, 1.449, 1.257, 0.973, 0.761, 0.576],
      { nombre: 'dióxido de carbono', formula: 'CO₂', fase: 'gas', unidad: 'g por kg de agua con 1 atm del gas' }),
  });
  const FUENTE_SOLUBILIDAD = 'Valores usuales de las tablas de los textos de química general, redondeados; por contrastar con el CRC Handbook.';
  const P_AIRE = Object.freeze({ CO2: 0.0004 }); // presión parcial aproximada del CO₂ en el aire (atm)

  function datosDe(sust, fase) {
    const d = SOLUBILIDAD[sust];
    if (!d) throw new Error(`sin tabla de solubilidad: ${sust}`);
    if (fase && d.fase !== fase) throw new Error(`${sust} no es un ${fase === 'gas' ? 'gas' : 'sólido'} en la tabla`);
    return d;
  }
  // Interpolación lineal entre dos filas de la tabla; fuera de la tabla, error.
  function solubilidad(sust, T) {
    const d = datosDe(sust); T = Number(T);
    if (!Number.isFinite(T)) throw new Error('la temperatura: falta un número');
    const t = d.T, n = t.length;
    if (T < t[0] - EPS || T > t[n - 1] + EPS) throw new Error(`la tabla de ${sust} va de ${t[0]} a ${t[n - 1]} °C`);
    for (let i = 0; i < n - 1; i++) {
      if (T <= t[i + 1] + EPS) {
        const f = (T - t[i]) / (t[i + 1] - t[i]);
        return d.S[i] + (d.S[i + 1] - d.S[i]) * Math.min(1, Math.max(0, f));
      }
    }
    return d.S[n - 1];
  }
  function curva(sust, paso) {
    const d = datosDe(sust), p = paso === undefined ? 1 : numero(paso, 'el paso', { positivo: true }), out = [];
    const t0 = d.T[0], t1 = d.T[d.T.length - 1];
    for (let T = t0; T < t1 - EPS; T += p) out.push([T, solubilidad(sust, T)]);
    out.push([t1, solubilidad(sust, t1)]);
    return out;
  }
  function clasificar(g, cabe) {
    if (Math.abs(g - cabe) <= EPS * Math.max(1, cabe)) return 'saturada';
    return g < cabe ? 'insaturada' : 'sobresaturada';
  }
  function tipoSolucion(o) {
    o = o || {};
    datosDe(o.sustancia, 'solido');
    const g = numero(o.g, 'la masa de soluto'), gAgua = numero(o.gAgua === undefined ? 100 : o.gAgua, 'la masa de agua', { positivo: true });
    const S = solubilidad(o.sustancia, o.T), cabe = S * gAgua / 100, tipo = clasificar(g, cabe);
    return { sustancia: o.sustancia, T: Number(o.T), S, gAgua, g, cabe, porCien: 100 * g / gAgua, tipo,
      falta: Math.max(0, cabe - g), exceso: Math.max(0, g - cabe),
      errores: { porSolucion: clasificar(100 * g / (g + gAgua), S) } };
  }
  function equilibrio(o) {
    o = o || {};
    datosDe(o.sustancia, 'solido');
    const g = numero(o.g, 'la masa de soluto'), gAgua = numero(o.gAgua === undefined ? 100 : o.gAgua, 'la masa de agua', { positivo: true });
    const S = solubilidad(o.sustancia, o.T), cabe = S * gAgua / 100;
    const disuelto = o.sobresaturar ? g : Math.min(g, cabe), solido = g - disuelto;
    return { T: Number(o.T), S, cabe, g, disuelto, solido, porCien: 100 * disuelto / gAgua,
      tipo: solido > EPS ? 'saturada' : clasificar(disuelto, cabe) };
  }
  function enfriar(o) {
    o = o || {};
    datosDe(o.sustancia, 'solido');
    const g = numero(o.g, 'la masa de soluto'), gAgua = numero(o.gAgua === undefined ? 100 : o.gAgua, 'la masa de agua', { positivo: true });
    const T1 = Number(o.T1), T2 = Number(o.T2);
    if (!(T2 <= T1 + EPS)) throw new Error('al enfriar, la temperatura final no puede ser mayor que la inicial');
    const cabe1 = solubilidad(o.sustancia, T1) * gAgua / 100, cabe2 = solubilidad(o.sustancia, T2) * gAgua / 100;
    const solidoAntes = Math.max(0, g - cabe1);
    const solidoDespues = o.sinSemilla && solidoAntes <= EPS ? 0 : Math.max(0, g - cabe2);
    const disueltoDespues = g - solidoDespues;
    const cristaliza = solidoDespues - solidoAntes;
    const tipoAntes = solidoAntes > EPS ? 'saturada' : clasificar(g, cabe1);
    const tipoDespues = solidoDespues > EPS ? 'saturada' : clasificar(disueltoDespues, cabe2);
    let Tsat = null;
    if (cristaliza > EPS) Tsat = solidoAntes > EPS ? T1 : temperaturaSaturacion(o.sustancia, 100 * g / gAgua);
    return { sustancia: o.sustancia, g, gAgua, T1, T2, cabe1, cabe2, solidoAntes, solidoDespues, cristaliza, disueltoDespues,
      tipoAntes, tipoDespues, Tsat,
      errores: { laSolubilidad: cabe2, restaSolubilidades: cabe1 - cabe2, nada: 0, tipoPorDiluida: 'insaturada' } };
  }
  // T en que la curva vale porCien (primer cruce de la tabla, de menor a mayor T); null si no la corta.
  function temperaturaSaturacion(sust, porCien) {
    const d = datosDe(sust), s = numero(porCien, 'la masa por 100 g de agua');
    for (let i = 0; i < d.T.length - 1; i++) {
      const a = d.S[i], b = d.S[i + 1];
      if ((s - a) * (s - b) <= 0 && a !== b) return d.T[i] + (s - a) / (b - a) * (d.T[i + 1] - d.T[i]);
      if (a === b && Math.abs(s - a) <= EPS) return d.T[i];
    }
    return null;
  }
  function henry(o) {
    o = o || {};
    datosDe(o.gas, 'gas');
    const P = numero(o.P, 'la presión del gas'), kg = numero(o.kgAgua === undefined ? 1 : o.kgAgua, 'la masa de agua', { positivo: true });
    const k = solubilidad(o.gas, o.T), S = k * P;
    return { gas: o.gas, T: Number(o.T), P, kgAgua: kg, k, S, g: S * kg,
      errores: { presionInversa: P > 0 ? k / P * kg : undefined } };
  }
  function compararGasT(o) {
    o = o || {};
    const a = henry({ gas: o.gas, T: o.T1, P: o.P, kgAgua: o.kgAgua }), b = henry({ gas: o.gas, T: o.T2, P: o.P, kgAgua: o.kgAgua });
    const masEn = Math.abs(a.g - b.g) <= EPS * Math.max(1, a.g) ? 'igual' : (a.g > b.g ? a.T : b.T);
    return { T1: a.T, T2: b.T, P: a.P, g1: a.g, g2: b.g, S1: a.S, S2: b.S, masEn,
      errores: { masCaliente: Math.max(a.T, b.T), igual: 'igual' } };
  }
  function destapar(o) {
    o = o || {};
    const P2 = o.P2 === undefined ? P_AIRE[o.gas] : o.P2;
    if (P2 === undefined) throw new Error(`falta la presión del ${o.gas} después de destapar`);
    const a = henry({ gas: o.gas, T: o.T, P: o.P1, kgAgua: o.kgAgua }), b = henry({ gas: o.gas, T: o.T, P: P2, kgAgua: o.kgAgua });
    if (b.P > a.P + EPS) throw new Error('al destapar, la presión del gas no sube');
    return { T: a.T, P1: a.P, P2: b.P, k: a.k, antes: a.g, despues: b.g, escapa: a.g - b.g,
      errores: { noSale: 0, presionInversa: b.errores.presionInversa } };
  }

  return { MASAS, atomos, masaMolar, solucion, diluir, diluirConAgua, mezclar, sacar, agregarSoluto, volumenPara, aplicar,
    modelo, lupa, repartir, ubicar, azar,
    SOLUBILIDAD, FUENTE_SOLUBILIDAD, P_AIRE, solubilidad, curva, tipoSolucion, equilibrio, enfriar, temperaturaSaturacion,
    henry, compararGasT, destapar };
});
