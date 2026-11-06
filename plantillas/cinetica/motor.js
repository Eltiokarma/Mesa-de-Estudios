/*
 * Motor de Cinética química (rapidez de reacción, ley de velocidad, orden, vida media, Arrhenius y choques).
 *
 * Aquí vive toda la química de la plantilla (regla 1 de CLAUDE.md). No toca el DOM: funciona igual en
 * el navegador (window.MotorCinetica) y en Node (require('./motor.js')), donde lo prueban casos.json
 * y papel.json.
 *
 * Datos: R = 8,314 J/(mol·K); T(K) = T(°C) + 273; ln 2 ≈ 0,693.
 *
 * Dos partes:
 *   1. Cálculo: ley de velocidad v = k·[A]^m·[B]^n, órdenes y k desde una tabla de velocidades iniciales,
 *      cuánto cambia v al cambiar las concentraciones, leyes integradas de orden 0, 1 y 2, vida media,
 *      Arrhenius (k a otra temperatura y Ea desde dos k), la regla de academia "cada 10 °C se duplica"
 *      y el perfil de energía (Ea de ida y de vuelta, ΔH; el catalizador baja las dos Ea y no cambia ΔH).
 *      Algunas funciones devuelven además el resultado de un error típico, para armar alternativas.
 *   2. Partículas: una caja con discos A y B que se mueven y chocan de verdad (choques elásticos). Un choque
 *      A–B forma C solo si la energía del choque a lo largo de la línea de centros alcanza Ea y si B llega
 *      por el lado reactivo de A (orientación). Con la distribución de rapideces de Maxwell, la fracción de
 *      choques A–B eficaces es p·e^(−Ea/RT), con p la fracción de orientaciones buenas: así lo dice la
 *      teoría de colisiones, y en dos dimensiones da lo mismo. Cada disco es una porción, no una molécula.
 */
(function (root, fabrica) {
  const motor = fabrica();
  if (typeof module === 'object' && module.exports) module.exports = motor;
  else root.MotorCinetica = motor;
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  const R = 8.314, K0 = 273;
  const num = (x, que) => { const n = Number(x); if (!Number.isFinite(n)) throw new Error(`${que} inválido: ${x}`); return n; };
  const positivo = (x, que) => { const n = num(x, que); if (!(n > 0)) throw new Error(`${que} debe ser mayor que cero`); return n; };
  const noNegativo = (x, que) => { const n = num(x, que); if (n < 0) throw new Error(`${que} no puede ser negativo`); return n; };
  const kelvin = c => num(c, 'temperatura') + K0;

  // ---------- Ley de velocidad ----------
  // ley = { k, ordenes: { A: m, B: n } }; conc = { A: [A], B: [B] } en mol/L. Devuelve v en mol/(L·s).
  function velocidad(ley, conc) {
    let v = positivo(ley.k, 'k');
    for (const [sp, m] of Object.entries(ley.ordenes)) {
      if (conc[sp] === undefined) throw new Error(`falta la concentración de ${sp}`);
      v *= Math.pow(noNegativo(conc[sp], sp), num(m, `orden de ${sp}`));
    }
    return v;
  }
  // Por cuánto se multiplica v si cada concentración se multiplica por su factor: Π fᵢ^orden.
  // También: lo que da si se toman los órdenes como 1 (sumar o multiplicar los factores sin exponente).
  function factor(ordenes, factores) {
    let f = 1, sinExp = 1;
    for (const [sp, m] of Object.entries(ordenes)) {
      const x = factores[sp] === undefined ? 1 : positivo(factores[sp], `factor de ${sp}`);
      f *= Math.pow(x, num(m, `orden de ${sp}`)); sinExp *= x;
    }
    return { valor: f, sinExponentes: sinExp };
  }
  const ordenTotal = ordenes => Object.values(ordenes).reduce((s, m) => s + num(m, 'orden'), 0);
  // Unidades de k para un orden total n: (mol/L)^(1−n)·s⁻¹. Se devuelve el exponente de mol/L.
  const unidadesK = n => ({ exponenteM: 1 - num(n, 'orden'), texto: unidadesTexto(1 - n) });
  function unidadesTexto(e) {
    if (e === 0) return 's⁻¹';
    if (e === 1) return 'mol/(L·s)';
    if (e === -1) return 'L/(mol·s)';
    const sup = n => String(n).replace(/[0-9.]/g, d => '⁰¹²³⁴⁵⁶⁷⁸⁹'[d] || '·');
    return e < 0 ? `L${sup(-e)}/(mol${sup(-e)}·s)` : `mol${sup(e)}/(L${sup(e)}·s)`;
  }

  // Método de las velocidades iniciales. exps = [{ conc: { A, B }, v }]. Para cada especie busca dos experimentos
  // donde solo ella cambia y despeja el orden: m = log(v₂/v₁)/log(c₂/c₁). Redondea a entero o medio si está a
  // menos de 1e-6. Devuelve órdenes, orden total, k (promedio de todos los experimentos) y las unidades.
  // Error típico que se devuelve: tomar como orden el cociente v₂/v₁ dividido entre c₂/c₁ (proporción directa).
  function ordenes(exps) {
    if (!Array.isArray(exps) || exps.length < 2) throw new Error('hacen falta al menos dos experimentos');
    const especies = Object.keys(exps[0].conc), r = {}, proporcion = {};
    for (const sp of especies) {
      let hallado = false;
      for (let i = 0; i < exps.length && !hallado; i++) for (let j = 0; j < exps.length && !hallado; j++) {
        if (i === j) continue;
        const a = exps[i], b = exps[j];
        if (a.conc[sp] === b.conc[sp]) continue;
        if (!especies.every(o => o === sp || a.conc[o] === b.conc[o])) continue;
        const fc = positivo(b.conc[sp], sp) / positivo(a.conc[sp], sp), fv = positivo(b.v, 'v') / positivo(a.v, 'v');
        let m = Math.log(fv) / Math.log(fc);
        const redondo = Math.round(m * 2) / 2;
        if (Math.abs(m - redondo) < 1e-6) m = redondo;
        r[sp] = m; proporcion[sp] = fv / fc; hallado = true;
      }
      if (!hallado) throw new Error(`no hay dos experimentos donde solo cambie ${sp}`);
    }
    const ks = exps.map(e => e.v / velocidad({ k: 1, ordenes: r }, e.conc));
    const k = ks.reduce((s, x) => s + x, 0) / ks.length, n = ordenTotal(r);
    return { ordenes: r, ordenTotal: n, k, unidades: unidadesK(n).texto, proporcion };
  }

  // ---------- Leyes integradas y vida media (A → productos, v = k·[A]^n) ----------
  // Orden 0: [A] = [A]₀ − k·t (hasta cero). Orden 1: [A] = [A]₀·e^(−k·t). Orden 2: 1/[A] = 1/[A]₀ + k·t.
  function concentracion(orden, k, C0, t) {
    const kk = positivo(k, 'k'), c0 = positivo(C0, 'concentración inicial'), tt = noNegativo(t, 'tiempo');
    if (orden === 0) return Math.max(0, c0 - kk * tt);
    if (orden === 1) return c0 * Math.exp(-kk * tt);
    if (orden === 2) return 1 / (1 / c0 + kk * tt);
    throw new Error(`orden no soportado: ${orden}`);
  }
  function tiempo(orden, k, C0, C) {
    const kk = positivo(k, 'k'), c0 = positivo(C0, 'concentración inicial'), c = positivo(C, 'concentración final');
    if (c > c0) throw new Error('la concentración final no puede ser mayor que la inicial');
    if (orden === 0) return (c0 - c) / kk;
    if (orden === 1) return Math.log(c0 / c) / kk;
    if (orden === 2) return (1 / c - 1 / c0) / kk;
    throw new Error(`orden no soportado: ${orden}`);
  }
  // Vida media: orden 0, [A]₀/(2k); orden 1, ln 2/k (no depende de [A]₀); orden 2, 1/(k·[A]₀).
  function vidaMedia(orden, k, C0) {
    const kk = positivo(k, 'k');
    if (orden === 1) return Math.LN2 / kk;
    const c0 = positivo(C0, 'concentración inicial');
    if (orden === 0) return c0 / (2 * kk);
    if (orden === 2) return 1 / (kk * c0);
    throw new Error(`orden no soportado: ${orden}`);
  }
  // Primer orden por vidas medias: después de n vidas medias queda (1/2)^n. Error típico: creer que en dos vidas
  // medias se acaba todo (restar la mitad dos veces) o que queda 1/(2n).
  function fraccionQueda(n) { const x = noNegativo(n, 'vidas medias'); return { valor: Math.pow(0.5, x), restando: Math.max(0, 1 - x / 2), dividiendo: x ? 1 / (2 * x) : 1 }; }

  // ---------- Temperatura ----------
  // Arrhenius: k = A·e^(−Ea/RT). Razón k₂/k₁ = e^(−Ea/R·(1/T₂ − 1/T₁)).
  const arrhenius = (A, Ea, T) => positivo(A, 'A') * Math.exp(-noNegativo(Ea, 'Ea') / (R * positivo(T, 'temperatura')));
  const razonK = (Ea, T1, T2) => Math.exp(-noNegativo(Ea, 'Ea') / R * (1 / positivo(T2, 'temperatura') - 1 / positivo(T1, 'temperatura')));
  function energiaActivacion(k1, T1, k2, T2) {
    const t1 = positivo(T1, 'T₁'), t2 = positivo(T2, 'T₂');
    if (t1 === t2) throw new Error('las dos temperaturas deben ser distintas');
    return R * Math.log(positivo(k2, 'k₂') / positivo(k1, 'k₁')) / (1 / t1 - 1 / t2);
  }
  // Regla de academia (Van 't Hoff): por cada 10 °C la velocidad se multiplica por 'q' (2 si no se dice). Error típico:
  // multiplicar por q una sola vez, o por q·(ΔT/10) en vez de q^(ΔT/10).
  function regla10(dT, q) {
    const d = num(dT, 'ΔT'), qq = q === undefined ? 2 : positivo(q, 'factor');
    return { valor: Math.pow(qq, d / 10), lineal: qq * d / 10 };
  }
  // Fracción de choques con energía suficiente (a lo largo de la línea de centros): e^(−Ea/RT).
  const fraccionEficaz = (Ea, T) => Math.exp(-noNegativo(Ea, 'Ea') / (R * positivo(T, 'temperatura')));

  // Perfil de energía. Ea (ida), ΔH; con catalizador, la Ea de ida pasa a EaCat (el catalizador baja la barrera
  // por igual en los dos sentidos). Devuelve las Ea de vuelta y la altura del complejo activado sobre los reactivos.
  function perfil(o) {
    const Ea = noNegativo(o.Ea, 'Ea'), dH = num(o.dH, 'ΔH');
    if (Ea < dH) throw new Error('la Ea de ida no puede ser menor que ΔH');
    const r = { Ea, dH, EaVuelta: Ea - dH, tipo: dH < 0 ? 'exotérmica' : dH > 0 ? 'endotérmica' : 'neutra' };
    if (o.EaCat !== undefined) {
      const c = noNegativo(o.EaCat, 'Ea con catalizador');
      if (c > Ea) throw new Error('un catalizador no sube la barrera');
      if (c < dH) throw new Error('la Ea con catalizador no puede ser menor que ΔH');
      r.EaCat = c; r.EaVueltaCat = c - dH; r.dHCat = dH; r.baja = Ea - c;
    }
    return r;
  }

  // ---------- Partículas ----------
  function azar(sem) { let s = (sem >>> 0) || 1; return () => (s = (s * 1664525 + 1013904223) >>> 0) / 4294967296; }
  function gauss(rnd) { const u = 1 - rnd(), v = rnd(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); }

  // Caja cuadrada de lado 1. o = { nA, nB, T (K), Ea (J/mol), MA, MB (g/mol), orientacion (true: B debe llegar por
  // el lado reactivo de A, que abarca 1/3 de la vuelta), reaccionar (false: solo cuenta, para medir), radio, semilla }.
  // Las rapideces son las reales escaladas: ESC convierte m/s en lados de caja por segundo.
  function caja(o) {
    const rnd = azar(o.semilla || 13), ESC = o.escala || 1 / 1000;
    const S = { parts: [], T: positivo(o.T || 300, 'temperatura'), Ea: noNegativo(o.Ea === undefined ? 5000 : o.Ea, 'Ea'),
      cat: null, orientacion: o.orientacion !== false, reaccionar: o.reaccionar !== false,
      MA: positivo(o.MA || 30, 'masa de A'), MB: positivo(o.MB || 30, 'masa de B'), r: positivo(o.radio || 0.03, 'radio'),
      t: 0, cuenta: { choques: 0, choquesAB: 0, eficaces: 0, sinEnergia: 0, malOrientados: 0 }, eventos: [], historial: [] };
    const APERTURA = Math.PI / 3; // medio ángulo del lado reactivo: ±60° → 1/3 de las orientaciones
    S.p = () => (S.orientacion ? APERTURA / Math.PI : 1);
    const masa = t => (t === 'A' ? S.MA : t === 'B' ? S.MB : S.MA + S.MB);
    // Velocidad térmica: cada componente con desviación √(RT/M) (M en kg/mol), en m/s.
    const termica = t => { const s = Math.sqrt(R * S.T / (masa(t) / 1000)); return [s * gauss(rnd), s * gauss(rnd)]; };
    const radio = p => (p.tipo === 'C' ? S.r * 1.4 : S.r);
    // Un lugar libre al azar: se prueba hasta 60 veces uno que no se encime con nadie (si la caja está muy llena, el último).
    function libre(rad) {
      let x, y;
      for (let k = 0; k < 60; k++) {
        x = rad + rnd() * (1 - 2 * rad); y = rad + rnd() * (1 - 2 * rad);
        if (S.parts.every(q => (q.x - x) ** 2 + (q.y - y) ** 2 >= (rad + radio(q)) ** 2)) break;
      }
      return [x, y];
    }
    function nueva(t, x, y) {
      const [vx, vy] = termica(t);
      if (x === undefined) [x, y] = libre(S.r);
      return { tipo: t, x, y,
        vx, vy, ang: rnd() * 2 * Math.PI, giro: (rnd() - 0.5) * 2, cambio: -9 };
    }
    for (let k = 0; k < noNegativo(o.nA || 0, 'nA'); k++) S.parts.push(nueva('A'));
    for (let k = 0; k < noNegativo(o.nB || 0, 'nB'); k++) S.parts.push(nueva('B'));
    S.EaEfectiva = () => (S.cat === null ? S.Ea : S.cat);

    // ¿Reacciona el choque entre a (A) y b (B), con normal n (de a hacia b) y velocidad relativa normal vn > 0?
    function decide(a, b, nx, ny, vn) {
      const mu = (masa(a.tipo) * masa(b.tipo)) / (masa(a.tipo) + masa(b.tipo)) / 1000; // kg/mol
      const E = 0.5 * mu * vn * vn; // J/mol
      const pa = a.tipo === 'A' ? a : b, sx = pa === a ? nx : -nx, sy = pa === a ? ny : -ny; // hacia el otro
      let d = Math.atan2(sy, sx) - pa.ang; d = Math.atan2(Math.sin(d), Math.cos(d));
      const bien = !S.orientacion || Math.abs(d) <= APERTURA;
      const energia = E >= S.EaEfectiva();
      S.cuenta.choquesAB++;
      if (!energia) S.cuenta.sinEnergia++;
      else if (!bien) S.cuenta.malOrientados++;
      else S.cuenta.eficaces++;
      S.eventos.push({ t: S.t, tipo: energia && bien ? 'eficaz' : (energia ? 'orientacion' : 'energia'), x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 });
      return energia && bien;
    }

    S.paso = function (dt) {
      dt = positivo(dt, 'paso');
      // Subpaso que se achica con la rapidez (∝ √T): cada disco avanza poco entre una revisión de choques y la siguiente.
      const sub = Math.max(1, Math.ceil(dt / (0.0035 * Math.sqrt(300 / S.T)))), h = dt / sub;
      for (let s = 0; s < sub; s++) {
        for (const p of S.parts) {
          p.x += p.vx * ESC * h; p.y += p.vy * ESC * h; p.ang += p.giro * h;
          const r = radio(p);
          if (p.x < r) { p.x = 2 * r - p.x; p.vx = Math.abs(p.vx); } if (p.x > 1 - r) { p.x = 2 * (1 - r) - p.x; p.vx = -Math.abs(p.vx); }
          if (p.y < r) { p.y = 2 * r - p.y; p.vy = Math.abs(p.vy); } if (p.y > 1 - r) { p.y = 2 * (1 - r) - p.y; p.vy = -Math.abs(p.vy); }
        }
        const quitar = new Set(), nuevas = [];
        for (let i = 0; i < S.parts.length; i++) {
          const a = S.parts[i]; if (quitar.has(a)) continue;
          for (let j = i + 1; j < S.parts.length; j++) {
            const b = S.parts[j]; if (quitar.has(b)) continue;
            const dx = b.x - a.x, dy = b.y - a.y, d2 = dx * dx + dy * dy, rr = radio(a) + radio(b);
            if (d2 >= rr * rr || d2 === 0) continue;
            // Los discos ya se enciman: se busca el instante de contacto (τ segundos antes), para usar la normal y la
            // rapidez relativa de ese momento. Si no, los choques se miden tarde y de lado, y salen con menos energía.
            const wx = (b.vx - a.vx) * ESC, wy = (b.vy - a.vy) * ESC, w2 = wx * wx + wy * wy, dw = dx * wx + dy * wy;
            if (dw >= 0 || w2 === 0) continue; // no se acercan
            let tau = (dw + Math.sqrt(dw * dw - w2 * (d2 - rr * rr))) / w2; // dw < 0: retroceder separa
            tau = Math.min(Math.max(tau, 0), h);
            const cx = dx + wx * tau, cy = dy + wy * tau, cd = Math.hypot(cx, cy) || rr;
            const nx = cx / cd, ny = cy / cd;
            const vn = (a.vx - b.vx) * nx + (a.vy - b.vy) * ny; // > 0 si se acercan
            if (vn <= 0) continue;
            S.cuenta.choques++;
            const ab = (a.tipo === 'A' && b.tipo === 'B') || (a.tipo === 'B' && b.tipo === 'A');
            if (ab && decide(a, b, nx, ny, vn) && S.reaccionar) {
              // Se forma C en el punto medio. Nace con una velocidad térmica (la energía del choque no se pierde:
              // la reacción libera calor y el termostato de la caja lo saca), así la caja no se enfría al reaccionar.
              const [vx, vy] = termica('C');
              const c = { tipo: 'C', x: (a.x + b.x) / 2, y: (a.y + b.y) / 2, vx, vy,
                ang: a.tipo === 'A' ? a.ang : b.ang, giro: (rnd() - 0.5) * 2, cambio: S.t };
              quitar.add(a); quitar.add(b); nuevas.push(c);
              break;
            }
            // Choque elástico entre discos: se vuelve al contacto, se cambian las velocidades y se avanza τ otra vez.
            const ma = masa(a.tipo), mb = masa(b.tipo), J = 2 * vn / (ma + mb);
            a.x -= a.vx * ESC * tau; a.y -= a.vy * ESC * tau; b.x -= b.vx * ESC * tau; b.y -= b.vy * ESC * tau;
            a.vx -= J * mb * nx; a.vy -= J * mb * ny; b.vx += J * ma * nx; b.vy += J * ma * ny;
            a.x += a.vx * ESC * tau; a.y += a.vy * ESC * tau; b.x += b.vx * ESC * tau; b.y += b.vy * ESC * tau;
            // Si un tercer choque los dejó todavía encimados, se separan a lo largo de la normal (sin tocar las velocidades),
            // para que no cuenten después choques falsos y suaves.
            const ex = b.x - a.x, ey = b.y - a.y, e = Math.hypot(ex, ey);
            if (e < rr && e > 0) { const s2 = (rr - e) / 2; a.x -= ex / e * s2; a.y -= ey / e * s2; b.x += ex / e * s2; b.y += ey / e * s2; }
            for (const p of [a, b]) { const r = radio(p); p.x = Math.min(1 - r, Math.max(r, p.x)); p.y = Math.min(1 - r, Math.max(r, p.y)); }
          }
        }
        if (quitar.size) { S.parts = S.parts.filter(p => !quitar.has(p)); S.parts.push(...nuevas); }
        // Termostato (Andersen): cada partícula recibe de vez en cuando una velocidad nueva a la temperatura de la caja,
        // como si chocara con las paredes. Así la temperatura no se va aunque se gasten los choques más fuertes.
        for (const p of S.parts) if (rnd() < 0.8 * h) { const [vx, vy] = termica(p.tipo); p.vx = vx; p.vy = vy; }
        S.t += h;
      }
      const corte = S.t - 30; while (S.eventos.length && S.eventos[0].t < corte) S.eventos.shift();
      const ult = S.historial[S.historial.length - 1];
      if (!ult || S.t - ult.t >= 0.25) {
        const c = S.contar();
        S.historial.push({ t: S.t, A: c.A, B: c.B, C: c.C, T: S.T, cat: S.cat !== null });
        if (S.historial.length > 800) S.historial.shift();
      }
    };
    S.contar = () => { const c = { A: 0, B: 0, C: 0 }; for (const p of S.parts) c[p.tipo]++; return c; };
    // Choques A–B del último intervalo, separados por lo que les faltó.
    S.ultimos = (ventana) => {
      const v = ventana || 1, l = S.eventos.filter(e => e.t > S.t - v);
      return { choquesAB: l.length, eficaces: l.filter(e => e.tipo === 'eficaz').length,
        sinEnergia: l.filter(e => e.tipo === 'energia').length, malOrientados: l.filter(e => e.tipo === 'orientacion').length };
    };
    // Lo que predice la teoría para esta caja: fracción de choques A–B eficaces.
    S.fraccionTeorica = () => S.p() * fraccionEficaz(S.EaEfectiva(), S.T);
    // Energía media de traslación por mol (J/mol): en 2D, R·T.
    S.energiaMedia = () => S.parts.reduce((s, p) => s + 0.5 * masa(p.tipo) / 1000 * (p.vx * p.vx + p.vy * p.vy), 0) / Math.max(1, S.parts.length);
    // Cambios a mano.
    S.temperatura = T => {
      const nuevoT = positivo(T, 'temperatura'), f = Math.sqrt(nuevoT / S.T);
      for (const p of S.parts) { p.vx *= f; p.vy *= f; }
      S.T = nuevoT;
    };
    S.catalizador = Ea => { S.cat = Ea === null || Ea === false || Ea === undefined ? null : noNegativo(Ea, 'Ea con catalizador'); };
    S.agregar = (t, n) => { if (t !== 'A' && t !== 'B') throw new Error(`solo se agrega A o B: ${t}`); for (let k = 0; k < noNegativo(n, 'cantidad'); k++) { const p = nueva(t); p.cambio = S.t; S.parts.push(p); } };
    S.reiniciarCuenta = () => { S.cuenta = { choques: 0, choquesAB: 0, eficaces: 0, sinEnergia: 0, malOrientados: 0 }; S.eventos = []; };
    return S;
  }

  return { R, K0, kelvin, velocidad, factor, ordenTotal, unidadesK, ordenes, concentracion, tiempo, vidaMedia, fraccionQueda,
    arrhenius, razonK, energiaActivacion, regla10, fraccionEficaz, perfil, caja };
});
