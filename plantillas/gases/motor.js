/*
 * Motor de Gases (nivel de partículas y ecuación de estado).
 *
 * Aquí vive toda la física y la química de la plantilla (regla 1 de CLAUDE.md). No toca el
 * DOM: funciona igual en el navegador (window.MotorGas) y en Node (require('./motor.js')),
 * donde lo prueban casos.json y papel.json.
 *
 * Datos de academia: R = 0,082 atm·L/(mol·K), T(K) = T(°C) + 273, 22,4 L/mol en condiciones
 * normales (1 atm y 0 °C). Masas molares de gases comunes en MASAS.
 *
 * Dos partes:
 *   1. Cálculo: ecuación de estado, cambios de estado, presión absoluta y manométrica, densidad,
 *      Dalton, Graham y el tubo donde dos gases se encuentran.
 *   2. Partículas: una caja con partículas que se mueven en línea recta y rebotan en las paredes,
 *      con rapidez proporcional a √(T/M). Cuenta los choques contra las paredes (la presión, en
 *      unidades de la escena) y las que salen por un agujero (efusión). Las partículas no cambian
 *      de tamaño con la temperatura: solo cambia su rapidez.
 */
(function (root, fabrica) {
  const motor = fabrica();
  if (typeof module === 'object' && module.exports) module.exports = motor;
  else root.MotorGas = motor;
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  const R = 0.082, K0 = 273, VM = 22.4;
  const MASAS = Object.freeze({ H2: 2, He: 4, CH4: 16, NH3: 17, N2: 28, O2: 32, Ar: 40, CO2: 44, SO2: 64, Cl2: 71, aire: 29 });
  const num = (x, que) => { const n = Number(x); if (!Number.isFinite(n)) throw new Error(`${que} inválido: ${x}`); return n; };
  const positivo = (x, que) => { const n = num(x, que); if (!(n > 0)) throw new Error(`${que} debe ser mayor que cero`); return n; };
  const kelvin = c => num(c, 'temperatura') + K0;
  const celsius = k => num(k, 'temperatura') - K0;
  function masaMolar(g) { if (typeof g === 'number') return g; const M = MASAS[g]; if (!M) throw new Error(`gas sin masa molar: ${g}`); return M; }

  // Ecuación de estado PV = nRT. Recibe tres de { P (atm), V (L), n (mol), T (K) } y halla el cuarto.
  function estado(o) {
    const faltan = ['P', 'V', 'n', 'T'].filter(k => o[k] === undefined);
    if (faltan.length !== 1) throw new Error('hay que dar exactamente tres de P, V, n y T');
    const r = {};
    for (const k of ['P', 'V', 'n', 'T']) if (o[k] !== undefined) r[k] = positivo(o[k], k);
    const f = faltan[0];
    if (f === 'P') r.P = r.n * R * r.T / r.V;
    if (f === 'V') r.V = r.n * R * r.T / r.P;
    if (f === 'n') r.n = r.P * r.V / (R * r.T);
    if (f === 'T') r.T = r.P * r.V / (r.n * R);
    return r;
  }

  // Cambio de estado de una misma muestra (o con n que cambia): P1·V1/(n1·T1) = P2·V2/(n2·T2).
  // inicial = { P, V, n, T }; final = lo mismo, con exactamente un dato que falta (lo que no se da y no cambia se copia del inicial
  // salvo el que se pide en 'busca').
  function cambio(inicial, final, busca) {
    const a = {}; for (const k of ['P', 'V', 'n', 'T']) a[k] = inicial[k] === undefined ? 1 : positivo(inicial[k], k + '1');
    const b = {}; for (const k of ['P', 'V', 'n', 'T']) if (k !== busca) b[k] = final[k] === undefined ? a[k] : positivo(final[k], k + '2');
    const cte = a.P * a.V / (a.n * a.T);
    if (busca === 'P') b.P = cte * b.n * b.T / b.V;
    else if (busca === 'V') b.V = cte * b.n * b.T / b.P;
    else if (busca === 'T') b.T = b.P * b.V / (cte * b.n);
    else if (busca === 'n') b.n = b.P * b.V / (cte * b.T);
    else throw new Error(`no sé buscar ${busca}`);
    return b;
  }

  // Presión absoluta y manométrica (atm). La ecuación de estado siempre va con la absoluta.
  const absoluta = (man, atm) => num(man, 'presión manométrica') + (atm === undefined ? 1 : num(atm, 'presión atmosférica'));
  const manometrica = (abs, atm) => num(abs, 'presión absoluta') - (atm === undefined ? 1 : num(atm, 'presión atmosférica'));

  // Tanque rígido que se calienta: manómetro antes y después, y los valores de dos errores típicos.
  function tanque(o) {
    const atm = o.Patm === undefined ? 1 : num(o.Patm, 'presión atmosférica');
    const P1 = absoluta(o.Pman1, atm), T1 = kelvin(o.T1C), T2 = kelvin(o.T2C);
    const P2 = P1 * T2 / T1;
    return { P1abs: P1, P2abs: P2, Pman2: manometrica(P2, atm),
      conManometrica: num(o.Pman1, 'presión manométrica') * T2 / T1,       // usa la manométrica en P/T constante
      conCelsiusAbs: P1 * num(o.T2C, 'T2') / num(o.T1C, 'T1') };          // usa °C
  }

  // Densidad de un gas (g/L): d = P·M/(R·T).
  function densidad(o) { return positivo(o.P, 'presión') * masaMolar(o.M) / (R * positivo(o.T, 'temperatura')); }
  function masaMolarDesdeDensidad(d, P, T) { return positivo(d, 'densidad') * R * positivo(T, 'temperatura') / positivo(P, 'presión'); }
  // En condiciones normales (1 atm, 0 °C), las academias usan 22,4 L/mol: d = M/22,4 y M = d·22,4.
  // (Con R = 0,082 y 273 K sale casi lo mismo, 1,4295 contra 1,4286 g/L para el O₂.)
  const volumenCN = n => num(n, 'moles') * VM;
  const densidadCN = M => masaMolar(M) / VM;
  const masaMolarCN = d => positivo(d, 'densidad') * VM;

  // Dalton: mezcla de gases con su masa (g) o sus moles; presión total dada. Devuelve moles, fracción molar
  // y presión parcial de cada uno.
  function dalton(componentes, Ptotal) {
    const lista = componentes.map(c => {
      const n = c.n !== undefined ? num(c.n, 'moles') : num(c.masa, 'masa') / masaMolar(c.M || c.gas);
      return { gas: c.gas || String(c.M), n };
    });
    const total = lista.reduce((s, c) => s + c.n, 0);
    if (!(total > 0)) throw new Error('la mezcla no tiene gas');
    const r = { nTotal: total, gases: {} };
    for (const c of lista) r.gases[c.gas] = { n: c.n, x: c.n / total, P: c.n / total * positivo(Ptotal, 'presión total') };
    return r;
  }

  // Graham: v1/v2 = √(M2/M1). Tubo de largo L con el gas 1 en un extremo y el 2 en el otro: se encuentran
  // a la distancia L·v1/(v1 + v2) del extremo del gas 1.
  function graham(M1, M2) { return Math.sqrt(masaMolar(M2) / masaMolar(M1)); }
  function encuentro(L, M1, M2) {
    const r = graham(M1, M2);
    return { razon: r, desde1: positivo(L, 'largo') * r / (r + 1), desde2: L / (r + 1),
      invertido: L / (r + 1), sinRaiz: L * (masaMolar(M2) / masaMolar(M1)) / (masaMolar(M2) / masaMolar(M1) + 1) };
  }

  // ---------- Partículas ----------
  // Azar con semilla (las partículas arrancan siempre igual).
  function azar(sem) { let s = (sem >>> 0) || 1; return () => (s = (s * 1664525 + 1013904223) >>> 0) / 4294967296; }
  // Rapidez de referencia de una partícula, en anchos de caja por segundo: crece con √(T/M).
  const rapidez = (T, M) => 0.35 * Math.sqrt(positivo(T, 'temperatura') / 300 * 32 / masaMolar(M));

  // Caja con especies de gas: [{ gas, n }]. ancho: largo horizontal de la caja (1 = normal; el émbolo lo cambia).
  // agujero: { y, alto } en la pared derecha, por donde las partículas salen y no vuelven (efusión).
  // Cada partícula lleva una dirección al azar y un factor de rapidez propio (distribución parecida a la de Maxwell).
  function caja(o) {
    const rnd = azar(o.semilla || 7), parts = [];
    for (const esp of o.especies) {
      for (let k = 0; k < esp.n; k++) {
        const ang = rnd() * 2 * Math.PI;
        // Factor de rapidez con forma de Maxwell en 2D (Rayleigh): √(−2 ln u)/√2·…, normalizado a media ≈ 1.
        const f = Math.sqrt(-2 * Math.log(1 - rnd() * 0.999)) / 1.2533;
        parts.push({ gas: esp.gas, x: rnd(), y: rnd(), dx: Math.cos(ang), dy: Math.sin(ang), f, fuera: false });
      }
    }
    const S = { parts, T: positivo(o.T || 300, 'temperatura'), ancho: o.ancho || 1, agujero: o.agujero || null,
      choques: 0, salieron: {}, t: 0 };
    S.v = p => rapidez(S.T, p.gas) * p.f;
    // Avanza dt segundos. Los choques contra las paredes se cuentan; las que pasan por el agujero salen.
    S.paso = function (dt) {
      for (const p of S.parts) {
        if (p.fuera) continue;
        const v = S.v(p);
        p.x += p.dx * v * dt / S.ancho; p.y += p.dy * v * dt;
        if (p.x < 0) { p.x = -p.x; p.dx = -p.dx; S.choques++; }
        if (p.x > 1) {
          if (S.agujero && Math.abs(p.y - S.agujero.y) < S.agujero.alto / 2) { p.fuera = true; S.salieron[p.gas] = (S.salieron[p.gas] || 0) + 1; continue; }
          p.x = 2 - p.x; p.dx = -p.dx; S.choques++;
        }
        if (p.y < 0) { p.y = -p.y; p.dy = -p.dy; S.choques++; }
        if (p.y > 1) { p.y = 2 - p.y; p.dy = -p.dy; S.choques++; }
      }
      S.t += dt;
    };
    // Si cambia la temperatura o el ancho, las partículas siguen donde están: solo cambia su rapidez o la caja.
    S.temperatura = T => { S.T = positivo(T, 'temperatura'); };
    S.anchura = a => { S.ancho = positivo(a, 'ancho'); };
    // Choques por segundo contra las paredes, en promedio: cada partícula va y vuelve entre las paredes
    // izquierda y derecha (separadas por 'ancho') y entre las de arriba y abajo (separadas por 1), así que
    // choca v·|dx|/ancho + v·|dy| veces por segundo. Es exacto en promedio (las partículas no chocan entre sí)
    // y crece con √T y con n: es la presión de la escena.
    S.tasaChoques = () => S.parts.filter(p => !p.fuera).reduce((t, p) => t + S.v(p) * (Math.abs(p.dx) / S.ancho + Math.abs(p.dy)), 0);
    S.quedan = gas => S.parts.filter(p => !p.fuera && (!gas || p.gas === gas)).length;
    return S;
  }

  return { R, K0, VM, MASAS, kelvin, celsius, masaMolar, estado, cambio, absoluta, manometrica, tanque, densidad,
    masaMolarDesdeDensidad, volumenCN, densidadCN, masaMolarCN, dalton, graham, encuentro, rapidez, caja };
});
