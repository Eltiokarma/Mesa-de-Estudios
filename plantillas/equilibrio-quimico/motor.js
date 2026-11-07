/*
 * Motor de Equilibrio químico (Kc, Kp, cociente Q, grado de reacción y Le Chatelier con partículas).
 *
 * Aquí vive toda la química de la plantilla (regla 1 de CLAUDE.md). No toca el DOM: funciona igual en
 * el navegador (window.MotorEquilibrio) y en Node (require('./motor.js')), donde lo prueban casos.json
 * y papel.json.
 *
 * Datos de academia: R = 0,082 atm·L/(mol·K) para Kp = Kc·(RT)^Δn; R = 8,314 J/(mol·K) solo para la
 * ecuación de van 't Hoff, que usa la escena para mover K con la temperatura.
 *
 * Dos partes:
 *   1. Cálculo: leer una ecuación ("2 SO2(g) + O2(g) = 2 SO3(g)"), Δn de gases, Q y Kc con
 *      concentraciones (los sólidos y líquidos puros no entran), Kp desde Kc y al revés, el equilibrio
 *      desde cantidades iniciales (a volumen fijo con Kc, o a presión total fija con Kp), el grado de
 *      reacción, el sentido en que avanza (Q contra K) y qué pasa al perturbar (agregar, quitar,
 *      comprimir o meter un gas que no reacciona). Algunas funciones devuelven además el resultado de
 *      un error típico (con moles en vez de concentraciones, Δn mal contado), para armar alternativas.
 *   2. Partículas: una caja con A ⇌ B o 2 A ⇌ B. Las dos reacciones ocurren todo el tiempo; su rapidez
 *      sale de la ley de acción de masas (directa = kd·[A] o kd·[A]², inversa = ki·[B]) con kd/ki = K.
 *      La cuenta de fondo es continua y las partículas la siguen de a una: cuando las dos rapideces son
 *      iguales, los cambios van en pares (uno de ida y uno de vuelta) y las cantidades no se mueven.
 *      Cada partícula dibujada es una porción de sustancia, no una molécula suelta.
 *   3. Gas que no reacciona (7 nov 2026): inerte() mete n moles de un gas que no reacciona a volumen fijo (ninguna
 *      concentración cambia y Q sigue igual a K) o a presión total fija (el volumen crece, todo se diluye y el
 *      equilibrio se corre hacia el lado con más moles de gas), con sus errores típicos; la caja hace lo mismo con
 *      inerte() y presionFija(). kp() trae además sus errores de Δn (sin Δn, signo al revés, un solo lado:
 *      soloProductos y soloReactivos usan como Δn la suma de coeficientes gaseosos de ese lado, con signo +).
 */
(function (root, fabrica) {
  const motor = fabrica();
  if (typeof module === 'object' && module.exports) module.exports = motor;
  else root.MotorEquilibrio = motor;
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  const R = 0.082, RJ = 8.314;
  const num = (x, que) => { const n = Number(x); if (!Number.isFinite(n)) throw new Error(`${que} inválido: ${x}`); return n; };
  const positivo = (x, que) => { const n = num(x, que); if (!(n > 0)) throw new Error(`${que} debe ser mayor que cero`); return n; };
  const noNegativo = (x, que) => { const n = num(x, que); if (n < 0) throw new Error(`${que} no puede ser negativo`); return n; };

  // ---------- Ecuaciones ----------
  // "2 SO2(g) + O2(g) = 2 SO3(g)" (también vale ⇌ o <=>). Sin estado entre paréntesis se toma (g).
  // Devuelve { reactivos: [{ sp, coef, estado }], productos: [...] }. Un objeto ya leído pasa tal cual.
  function leer(ec) {
    if (ec && typeof ec === 'object') return ec;
    const lados = String(ec).split(/⇌|<=>|=/);
    if (lados.length !== 2) throw new Error(`ecuación sin "=" o con más de uno: ${ec}`);
    const lado = t => t.split(/\s\+\s/).map(s => s.trim()).filter(Boolean).map(s => {
      const m = s.match(/^(\d+(?:[.,]\d+)?(?:\/\d+)?)?\s*([^()\s]+)\s*(?:\((g|s|l|ac)\))?$/);
      if (!m) throw new Error(`no entiendo la especie: ${s}`);
      let coef = 1;
      if (m[1]) { const [a, b] = m[1].replace(',', '.').split('/'); coef = b ? Number(a) / Number(b) : Number(a); }
      return { sp: m[2], coef, estado: m[3] || 'g' };
    });
    const r = { reactivos: lado(lados[0]), productos: lado(lados[1]) };
    if (!r.reactivos.length || !r.productos.length) throw new Error(`falta un lado de la ecuación: ${ec}`);
    return r;
  }
  const especies = e => [...e.reactivos.map(x => ({ ...x, nu: -x.coef })), ...e.productos.map(x => ({ ...x, nu: x.coef }))];
  const cuenta = x => x.estado === 'g' || x.estado === 'ac'; // solo gases y disueltos entran en K

  // Δn = moles de gas de los productos − moles de gas de los reactivos (los sólidos y líquidos no cuentan).
  function deltaN(ec) { const e = leer(ec); return especies(e).filter(x => x.estado === 'g').reduce((s, x) => s + x.nu, 0); }

  // Cociente de reacción con concentraciones (mol/L) o presiones parciales (atm): Π productos^coef / Π reactivos^coef.
  // Los sólidos y líquidos puros no entran. Si falta un reactivo, Q es infinito; si falta un producto, 0.
  function cociente(ec, valores) {
    const e = leer(ec); let lnQ = 0;
    for (const x of especies(e)) {
      if (!cuenta(x)) continue;
      const c = valores[x.sp];
      if (c === undefined) throw new Error(`falta el valor de ${x.sp}`);
      const v = noNegativo(c, x.sp);
      if (v === 0) { if (x.nu < 0) return Infinity; return 0; }
      lnQ += x.nu * Math.log(v);
    }
    return Math.exp(lnQ);
  }

  // Kc (o Q) desde moles y volumen. Devuelve también lo que da con moles en vez de concentraciones (error típico).
  function constante(ec, o) {
    const V = positivo(o.V, 'volumen'), conc = {};
    for (const [k, n] of Object.entries(o.moles)) conc[k] = noNegativo(n, k) / V;
    return { valor: cociente(ec, conc), conMoles: cociente(ec, o.moles), conc, deltaN: deltaN(ec) };
  }

  // Kp = Kc·(RT)^Δn, y los errores típicos: usar la suma de coeficientes de los productos como si fuera Δn,
  // o dividir en vez de multiplicar.
  function kp(ec, Kc, T) {
    const RT = R * positivo(T, 'temperatura'), dn = deltaN(ec), k = positivo(Kc, 'Kc');
    const prod = leer(ec).productos.filter(x => x.estado === 'g').reduce((s, x) => s + x.coef, 0);
    const reac = leer(ec).reactivos.filter(x => x.estado === 'g').reduce((s, x) => s + x.coef, 0);
    return { valor: k * Math.pow(RT, dn), RT, deltaN: dn, soloProductos: k * Math.pow(RT, prod), dividido: k / Math.pow(RT, dn),
      // Lo que da cada Δn mal contado: sin Δn (Kp = Kc), con el signo al revés (igual que dividir), o con los moles
      // de gas de un solo lado.
      errores: { sinDeltaN: k, signo: k * Math.pow(RT, -dn), soloProductos: k * Math.pow(RT, prod), soloReactivos: k * Math.pow(RT, reac) } };
  }
  function kc(ec, Kp, T) { const RT = R * positivo(T, 'temperatura'), dn = deltaN(ec); return { valor: positivo(Kp, 'Kp') / Math.pow(RT, dn), RT, deltaN: dn }; }

  // Operaciones con ecuaciones: invertir la ecuación da 1/K; multiplicar los coeficientes por f da K^f;
  // sumar ecuaciones multiplica sus K.
  const invertir = K => 1 / positivo(K, 'K');
  const escalar = (K, f) => Math.pow(positivo(K, 'K'), num(f, 'factor'));
  const sumar = Ks => Ks.reduce((p, K) => p * positivo(K, 'K'), 1);

  // Sentido en que avanza la reacción: Q < K hacia los productos (directa), Q > K hacia los reactivos (inversa).
  function sentido(Q, K) {
    const k = positivo(K, 'K');
    if (Q === Infinity) return 'inversa';
    if (Math.abs(Q - k) <= 1e-9 * k) return 'equilibrio';
    return Q < k ? 'directa' : 'inversa';
  }

  // Avance ξ (mol) que cumple Q(ξ) = K, por bisección sobre ln Q − ln K (crece con ξ).
  // moles(ξ) = n0 + ν·ξ; el avance queda entre los límites donde alguna especie se acaba.
  function avance(e, n0, lnQde, K) {
    let lo = -Infinity, hi = Infinity;
    for (const x of especies(e)) {
      const n = noNegativo(n0[x.sp] || 0, x.sp);
      if (x.nu < 0) hi = Math.min(hi, n / -x.nu); else lo = Math.max(lo, -n / x.nu);
    }
    if (!(hi > lo)) throw new Error('no hay sustancia suficiente para que la reacción avance en ningún sentido');
    const lnK = Math.log(positivo(K, 'K'));
    let a = lo, b = hi;
    for (let i = 0; i < 300; i++) {
      const m = (a + b) / 2;
      if (m === a || m === b) break;
      const f = lnQde(m) - lnK;
      if (f > 0) b = m; else a = m;
    }
    return { xi: (a + b) / 2, min: lo, max: hi };
  }
  const molesCon = (e, n0, xi) => { const r = {}; for (const x of especies(e)) r[x.sp] = (n0[x.sp] || 0) + x.nu * xi; return r; };
  // Grado de reacción: lo que avanzó la directa sobre lo máximo que podía avanzar (fracción del reactivo limitante
  // que reaccionó). Si avanza al revés, se mide sobre lo máximo que podía avanzar la inversa y sale negativo.
  const grado = (r) => r.xi >= 0 ? (r.max === Infinity ? null : r.xi / r.max) : (r.min === -Infinity ? null : -r.xi / r.min);

  // Equilibrio a volumen fijo: o = { moles: { sp: n0 }, V, K (Kc) }.
  function equilibrio(ec, o) {
    const e = leer(ec), V = positivo(o.V, 'volumen'), n0 = o.moles;
    const lnQ = xi => {
      let s = 0;
      for (const x of especies(e)) if (cuenta(x)) {
        const n = (n0[x.sp] || 0) + x.nu * xi;
        s += x.nu * (n > 0 ? Math.log(n / V) : -745);
      }
      return s;
    };
    const r = avance(e, n0, lnQ, o.K), moles = molesCon(e, n0, r.xi), conc = {};
    for (const x of especies(e)) if (cuenta(x)) conc[x.sp] = moles[x.sp] / V; // los sólidos y líquidos no tienen concentración en K
    const Q0 = cociente(e, Object.fromEntries(Object.keys(moles).map(k => [k, (n0[k] || 0) / V])));
    return { xi: r.xi, moles, conc, grado: grado(r), sentido: sentido(Q0, o.K), Q0 };
  }

  // Equilibrio a presión total fija (con Kp y presiones parciales): o = { moles, P (atm), K (Kp) }.
  // pᵢ = xᵢ·P, con xᵢ la fracción molar entre los gases. Sirve para la disociación con grado α.
  function equilibrioP(ec, o) {
    const e = leer(ec), P = positivo(o.P, 'presión'), n0 = o.moles;
    const gases = especies(e).filter(x => x.estado === 'g');
    const otros = noNegativo(o.inerte || 0, 'gas inerte');
    const lnQ = xi => {
      const nt = gases.reduce((s, x) => s + (n0[x.sp] || 0) + x.nu * xi, 0) + otros;
      let s = 0;
      for (const x of gases) { const n = (n0[x.sp] || 0) + x.nu * xi; s += x.nu * (n > 0 ? Math.log(n / nt * P) : -745); }
      return s;
    };
    const r = avance(e, n0, lnQ, o.K), moles = molesCon(e, n0, r.xi);
    const nt = gases.reduce((s, x) => s + moles[x.sp], 0) + otros, presiones = {}, fracciones = {};
    for (const x of gases) { fracciones[x.sp] = moles[x.sp] / nt; presiones[x.sp] = fracciones[x.sp] * P; }
    return { xi: r.xi, moles, nTotal: nt, fracciones, presiones, grado: grado(r) };
  }

  // Perturbar un equilibrio a volumen fijo. o = { moles (del equilibrio), V, K }; cambio = { agregar: { sp: n },
  // quitar: { sp: n }, V: volumen nuevo, inerte: moles de un gas que no reacciona (a volumen fijo) }.
  // Devuelve el instante después del cambio (moles, concentraciones y Q), el sentido y el nuevo equilibrio.
  function perturbar(ec, o, cambio) {
    const e = leer(ec), moles = { ...o.moles };
    for (const [k, n] of Object.entries(cambio.agregar || {})) moles[k] = (moles[k] || 0) + noNegativo(n, k);
    for (const [k, n] of Object.entries(cambio.quitar || {})) {
      moles[k] = (moles[k] || 0) - noNegativo(n, k);
      if (moles[k] < -1e-12) throw new Error(`no se puede quitar más ${k} del que hay`);
      moles[k] = Math.max(0, moles[k]);
    }
    const V = cambio.V === undefined ? positivo(o.V, 'volumen') : positivo(cambio.V, 'volumen nuevo');
    // Un gas que no reacciona, a volumen fijo, no cambia ninguna concentración: no entra en Q.
    const conc = {}; for (const [k, n] of Object.entries(moles)) conc[k] = n / V;
    const Q = cociente(e, conc), final = equilibrio(e, { moles, V, K: o.K });
    return { instante: { moles, conc, Q }, sentido: sentido(Q, o.K), final };
  }

  // Meter n moles de un gas que no reacciona a un equilibrio. o = { moles (del equilibrio), V, K (Kc), inerte (el que
  // ya había, opcional) }; cond = 'V' (volumen fijo) o 'P' (presión total fija, a la misma temperatura).
  // A volumen fijo, el gas nuevo sube la presión total pero no cambia ninguna concentración: Q sigue igual a K.
  // A presión total fija, el volumen crece en proporción a los moles de gas (V = n·RT/P): todas las concentraciones
  // bajan a la vez y, si Δn ≠ 0, el equilibrio se corre hacia el lado con más moles de gas. El equilibrio nuevo se
  // resuelve con equilibrioP usando c = n/V (moles de gas por litro, fija) en el lugar de P y Kc en el de Kp.
  // errores: comoComprimir = lo que dice quien solo ve "entra gas, sube la presión" (hacia el lado con menos moles
  // de gas); sinEfecto = "no reacciona, no pasa nada"; otraCondicion = lo que pasaría con la otra condición.
  function inerte(ec, o, n, cond) {
    const e = leer(ec), V = positivo(o.V, 'volumen'), nI = noNegativo(n, 'gas inerte'), antes = noNegativo(o.inerte || 0, 'gas inerte');
    if (cond !== 'V' && cond !== 'P') throw new Error(`condición desconocida: ${cond} (usa 'V' o 'P')`);
    const moles = { ...o.moles }, gases = especies(e).filter(x => x.estado === 'g');
    const nt0 = gases.reduce((s, x) => s + noNegativo(moles[x.sp] || 0, x.sp), 0) + antes;
    if (!(nt0 > 0)) throw new Error('no hay gas en el recipiente');
    const c = nt0 / V, V1 = cond === 'V' ? V : (nt0 + nI) / c;
    const conc = {}; for (const x of especies(e)) if (cuenta(x)) conc[x.sp] = (moles[x.sp] || 0) / V1;
    const Q = cociente(e, conc), sen = sentido(Q, o.K);
    let final;
    if (cond === 'V') { const r = equilibrio(e, { moles, V, K: o.K }); final = { xi: r.xi, moles: r.moles, V, conc: r.conc }; }
    else {
      const r = equilibrioP(e, { moles, P: c, K: o.K, inerte: antes + nI }), Vf = r.nTotal / c, cf = {};
      for (const x of especies(e)) if (cuenta(x)) cf[x.sp] = r.moles[x.sp] / Vf;
      final = { xi: r.xi, moles: r.moles, V: Vf, conc: cf };
    }
    const dn = deltaN(e), comoComprimir = dn < 0 ? 'directa' : dn > 0 ? 'inversa' : 'equilibrio';
    const otra = cond === 'V' ? sentido(cociente(e, Object.fromEntries(Object.entries(conc).map(([k, v]) => [k, v * nt0 / (nt0 + nI)]))), o.K) : 'equilibrio';
    return { instante: { moles, V: V1, conc, Q, factorP: cond === 'V' ? (nt0 + nI) / nt0 : 1 }, sentido: sen, final, deltaN: dn,
      errores: { comoComprimir, sinEfecto: 'equilibrio', otraCondicion: otra } };
  }

  // K a otra temperatura (van 't Hoff): ln(K₂/K₁) = −(ΔH/R)·(1/T₂ − 1/T₁), con ΔH en J/mol.
  // ΔH < 0 (exotérmica): al calentar, K baja. ΔH > 0 (endotérmica): al calentar, K sube.
  function vantHoff(K1, T1, dH, T2) {
    return positivo(K1, 'K') * Math.exp(-num(dH, 'ΔH') / RJ * (1 / positivo(T2, 'temperatura') - 1 / positivo(T1, 'temperatura')));
  }

  // ---------- Partículas ----------
  // Las reacciones de la escena. AB: A ⇌ B con Kc = 4 a 300 K, exotérmica; ΔH elegido para que a 400 K
  // Kc = 3/2 (ΔH = −1200·R·ln(8/3) ≈ −9,8 kJ/mol). A2B: 2 X ⇌ Y con Kc = 1/8 (en porciones por litro), sin calor.
  // Ea: energía de activación de la directa (J/mol). Con Arrhenius, al calentar las dos reacciones se hacen más rápidas,
  // pero la que absorbe calor (la inversa de una exotérmica, con Ea − ΔH) se acelera más: por eso K baja.
  // Por dentro, la caja llama 'A' al reactivo y 'B' al producto; hacia afuera usa los nombres de cada reacción.
  const ESCENAS = Object.freeze({
    AB: Object.freeze({ ec: 'A(g) = B(g)', a: 'A', b: 'B', nu: 1, K300: 4, dH: -1200 * RJ * Math.log(8 / 3), Ea: 5000, ki: 0.25 }),
    A2B: Object.freeze({ ec: '2 X(g) = Y(g)', a: 'X', b: 'Y', nu: 2, K300: 1 / 8, dH: 0, Ea: 0, ki: 0.5 }),
  });
  const Kescena = (tipo, T) => { const s = ESCENAS[tipo]; return s.dH ? vantHoff(s.K300, 300, s.dH, T) : s.K300; };

  function azar(sem) { let s = (sem >>> 0) || 1; return () => (s = (s * 1664525 + 1013904223) >>> 0) / 4294967296; }

  // Caja de 'V' litros (el ancho del dibujo sigue a V). o = { tipo: 'AB' | 'A2B', nA (reactivo), nB (producto), V, T, semilla }.
  function caja(o) {
    const tipo = o.tipo || 'AB', esc = ESCENAS[tipo];
    if (!esc) throw new Error(`reacción de escena desconocida: ${tipo}`);
    const rnd = azar(o.semilla || 11), RAP = 0.12;
    const nueva = (t, x, y) => { const a = rnd() * 2 * Math.PI; return { tipo: t, x: x === undefined ? rnd() : x, y: y === undefined ? rnd() : y, dx: Math.cos(a), dy: Math.sin(a), cambio: -9 }; };
    const rol = n => { if (n === esc.a || n === 'A') return 'A'; if (n === esc.b || n === 'B') return 'B'; throw new Error(`especie desconocida: ${n}`); };
    const S = { tipo, ec: esc.ec, nombres: { A: esc.a, B: esc.b }, nu: esc.nu, parts: [], V: positivo(o.V || 1, 'volumen'), T: positivo(o.T || 300, 'temperatura'),
      cat: 1, t: 0, eventos: [], historial: [], marcas: [], nI: 0, presion: null };
    for (let k = 0; k < noNegativo(o.nA || 0, 'nA'); k++) S.parts.push(nueva('A'));
    for (let k = 0; k < noNegativo(o.nB || 0, 'nB'); k++) S.parts.push(nueva('B'));
    const contar = t => S.parts.filter(p => p.tipo === t).length;
    // Cuenta continua de fondo y la cuenta entera de las partículas, desde el último cambio hecho a mano.
    let nAc, nBc, xiC, xiE, accD, accI;
    const reiniciar = () => { nAc = contar('A'); nBc = contar('B'); xiC = 0; xiE = 0; accD = 0; accI = 0; };
    reiniciar();
    S.K = () => Kescena(tipo, S.T);
    S.ki = () => esc.ki * S.cat * Math.exp(-(esc.Ea - esc.dH) / RJ * (1 / S.T - 1 / 300));
    S.kd = () => S.K() * S.ki();
    // Rapidez de cada reacción, en cambios por segundo en toda la caja.
    const rapideces = (a, b) => ({ d: S.kd() * Math.pow(a / S.V, esc.nu) * S.V, i: S.ki() * (b / S.V) * S.V });
    S.rapidez = () => { const r = rapideces(nAc, nBc); return { directa: r.d, inversa: r.i }; };

    const elegir = t => { const l = S.parts.filter(p => p.tipo === t); return l.length ? l[Math.floor(rnd() * l.length)] : null; };
    function directa() {
      if (contar('A') < esc.nu) return false;
      const p = elegir('A');
      if (esc.nu === 1) { p.tipo = 'B'; p.cambio = S.t; }
      else {
        // 2 A → B: la A elegida se une con la A más cercana, en el punto medio.
        let q = null, dq = Infinity;
        for (const r of S.parts) if (r !== p && r.tipo === 'A') { const d = (r.x - p.x) ** 2 + (r.y - p.y) ** 2; if (d < dq) { dq = d; q = r; } }
        S.parts.splice(S.parts.indexOf(q), 1);
        p.tipo = 'B'; p.x = (p.x + q.x) / 2; p.y = (p.y + q.y) / 2; p.cambio = S.t;
      }
      S.eventos.push({ t: S.t, s: 'directa' }); return true;
    }
    function inversa() {
      const p = elegir('B'); if (!p) return false;
      p.tipo = 'A'; p.cambio = S.t;
      if (esc.nu === 2) { const q = nueva('A', Math.min(1, Math.max(0, p.x + 0.03)), Math.min(1, Math.max(0, p.y + 0.03))); q.dx = -p.dx; q.dy = -p.dy; q.cambio = S.t; S.parts.push(q); }
      S.eventos.push({ t: S.t, s: 'inversa' }); return true;
    }

    S.paso = function (dt) {
      dt = positivo(dt, 'paso');
      for (const p of S.parts) {
        p.x += p.dx * RAP * dt / S.V; p.y += p.dy * RAP * dt;
        if (p.x < 0) { p.x = -p.x; p.dx = -p.dx; } if (p.x > 1) { p.x = 2 - p.x; p.dx = -p.dx; }
        if (p.y < 0) { p.y = -p.y; p.dy = -p.dy; } if (p.y > 1) { p.y = 2 - p.y; p.dy = -p.dy; }
      }
      const sub = Math.max(1, Math.ceil(dt / 0.004)), h = dt / sub;
      for (let k = 0; k < sub; k++) {
        // A presión total fija, el volumen sigue a los moles de gas (la cuenta continua más el gas que no reacciona).
        if (S.presion) S.V = (nAc + nBc + S.nI) / S.presion;
        const r = rapideces(nAc, nBc);
        let d = (r.d - r.i) * h;
        d = Math.max(-nBc, Math.min(nAc / esc.nu, d));
        nAc -= esc.nu * d; nBc += d; xiC += d; accD += r.d * h; accI += r.i * h;
        if (S.presion) S.V = (nAc + nBc + S.nI) / S.presion;
        S.t += h;
        // Cambios en pares (ida y vuelta) mientras las dos rapideces lo permitan: no mueven las cantidades.
        while (accD >= 1 && accI >= 1 && contar('A') >= esc.nu && contar('B') >= 1) { directa(); inversa(); accD -= 1; accI -= 1; }
        // Y lo que falte para seguir a la cuenta continua, de a uno.
        const meta = Math.round(xiC);
        while (xiE < meta && directa()) { xiE++; accD -= 1; }
        while (xiE > meta && inversa()) { xiE--; accI -= 1; }
      }
      const corte = S.t - 30; while (S.eventos.length && S.eventos[0].t < corte) S.eventos.shift();
      const ult = S.historial[S.historial.length - 1];
      if (!ult || S.t - ult.t >= 0.1) {
        const r = rapideces(nAc, nBc);
        S.historial.push({ t: S.t, a: nAc / S.V, b: nBc / S.V, na: contar('A'), nb: contar('B'), directa: r.d, inversa: r.i, K: S.K(), cat: S.cat });
        if (S.historial.length > 900) S.historial.shift();
      }
    };
    // Cambios de cada sentido en el último segundo (o en 'ventana' segundos).
    S.cambios = (ventana) => { const v = ventana || 1, d = S.eventos.filter(e => e.t > S.t - v); return { directa: d.filter(e => e.s === 'directa').length, inversa: d.filter(e => e.s === 'inversa').length }; };
    S.cuenta = () => ({ [esc.a]: contar('A'), [esc.b]: contar('B') });
    S.Q = () => cociente(esc.ec, { [esc.a]: contar('A') / S.V, [esc.b]: contar('B') / S.V });
    // Equilibrio exacto desde lo que hay ahora en la caja (el motor de cálculo, no las partículas).
    // A presión total fija, con equilibrioP y los moles de gas por litro en el lugar de P.
    S.equilibrio = () => {
      const c = S.cuenta();
      if (S.presion) return equilibrioP(esc.ec, { moles: c, P: S.presion, K: S.K(), inerte: S.nI }).moles;
      return equilibrio(esc.ec, { moles: c, V: S.V, K: S.K() }).moles;
    };
    // Cambios hechos a mano: la cuenta de fondo arranca de lo que hay.
    const marca = q => S.marcas.push({ t: S.t, que: q });
    S.agregar = (t, n) => { for (let k = 0; k < noNegativo(n, 'cantidad'); k++) { const p = nueva(rol(t), rnd(), rnd() * 0.15); p.cambio = S.t; S.parts.push(p); } reiniciar(); marca(`+${n} ${t}`); };
    S.quitar = (t, n) => { for (let k = 0; k < noNegativo(n, 'cantidad'); k++) { const p = elegir(rol(t)); if (p) S.parts.splice(S.parts.indexOf(p), 1); } reiniciar(); marca(`−${n} ${t}`); };
    S.volumen = V => { S.V = positivo(V, 'volumen'); marca('V'); };
    S.temperatura = T => { S.T = positivo(T, 'temperatura'); marca('T'); };
    // Gas que no reacciona: porciones de tipo 'I' que se mueven con las demás y no entran en Q ni en las rapideces.
    // Con la presión fija, el volumen crece en el acto; si no, la caja es rígida y nada cambia.
    S.inerte = n => {
      for (let k = 0; k < noNegativo(n, 'cantidad'); k++) { const p = nueva('I', rnd(), rnd() * 0.15); p.cambio = S.t; S.parts.push(p); }
      S.nI += n; if (S.presion) S.V = (contar('A') + contar('B') + S.nI) / S.presion;
      reiniciar(); marca(`+${n} inerte`);
    };
    // Moles de gas por litro, con el gas que no reacciona (proporcional a la presión total: P = (n/V)·RT), y las
    // presiones parciales en atm si cada porción es 1 mol: p = [i]·RT.
    S.gasPorLitro = () => (contar('A') + contar('B') + S.nI) / S.V;
    S.presiones = () => ({ [esc.a]: contar('A') / S.V * R * S.T, [esc.b]: contar('B') / S.V * R * S.T });
    // Émbolo libre: la presión total queda fija en la de este momento (moles de gas por litro).
    S.presionFija = on => { S.presion = on ? (contar('A') + contar('B') + S.nI) / S.V : null; marca('P'); };
    S.catalizador = f => { S.cat = f ? (f === true ? 3 : positivo(f, 'catalizador')) : 1; marca('cat'); };
    return S;
  }

  return { R, RJ, leer, deltaN, cociente, constante, kp, kc, invertir, escalar, sumar, sentido, equilibrio, equilibrioP,
    perturbar, inerte, vantHoff, ESCENAS, Kescena, caja };
});
