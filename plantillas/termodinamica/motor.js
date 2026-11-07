/*
 * Motor de termodinámica: gas ideal en el diagrama P-V, procesos, primera ley, ciclos, máquinas térmicas, Carnot y
 * refrigeradores.
 *
 * Aquí vive toda la física de la plantilla (regla 1 de CLAUDE.md). No toca el DOM: funciona igual en el navegador
 * (window.MotorTermodinamica) y en Node (require('./motor.js')), donde lo prueban casos.json y papel.json.
 *
 * Unidades. P·V tiene unidades de energía: con P en Pa y V en m³, o con P en kPa y V en L (1 kPa·L = 1 J), el trabajo,
 * el calor y la energía interna salen en joules. Las temperaturas, en kelvin; Carnot y juzgar aceptan
 * { unidad: 'C' } y pasan a kelvin con T = t + 273, como en las academias. R = 8,31 J/(mol·K) por defecto (se cambia
 * con { R }); casi nunca hace falta: si se da la temperatura inicial T1, el motor usa nR = P1·V1/T1.
 *
 * Gas ideal: monoatómico por defecto (Cv = 3/2 R, γ = 5/3); { gas: 'diatomico' } da Cv = 5/2 R y γ = 7/5, y { gamma }
 * fija otro. La energía interna solo depende de T: ΔU = n·Cv·ΔT = (Cv/R)·Δ(PV); para el monoatómico, (3/2)·nR·ΔT.
 *
 * Procesos (proceso): 'isobarico' (P fija), 'isocorico' (V fijo), 'isotermico' (T fija), 'adiabatico' (Q = 0,
 * P·V^γ fijo) y 'recta' (una recta en el diagrama P-V entre dos estados). El estado final se da con V2, P2, T2 o con
 * el calor Q que recibe el gas (isobárico, isocórico e isotérmico). Trabajo = área bajo la curva P-V, con signo:
 * positivo si el gas se expande (el gas empuja el émbolo), negativo si se comprime.
 *
 * Funciones:
 *   estado({ P, V, T, n, R, nR })         completa la que falta de P, V y T (o n) con P·V = nRT.
 *   proceso({ tipo, P1, V1, T1 | n, gas, V2 | P2 | T2 | Q })   un proceso: estados inicial y final, W, Q, ΔU, ΔT;
 *                                         en(s) da el estado y W, Q, ΔU parciales cuando se recorrió la fracción s
 *                                         (de 0 a 1) del proceso (en V; en P si es isocórico) y puntos(k), k + 1
 *                                         puntos de la curva para dibujarla.
 *   camino({ P1, V1, T1 | n, gas, tramos: [{ tipo, V2 | P2 | T2 | Q }] })   varios procesos seguidos. Suma W, Q y ΔU;
 *                                         si vuelve al estado inicial es un ciclo: ΔU = 0, Q neto = W neto = área
 *                                         encerrada; 'horario' (W > 0) es una máquina y 'antihorario' (W < 0), un
 *                                         refrigerador. Qabs es el calor que entra (suma de las partes con Q > 0;
 *                                         una 'recta' se parte donde su calor cambia de signo) y Qced el que sale.
 *   rectangulo({ Pa, Pb, Va, Vb, sentido, T1 | n, gas })   ciclo rectangular desde (Pa, Va), con Pa < Pb y Va < Vb.
 *   primeraLey({ Q, W, dU })              con dos de las tres, la tercera.
 *   maquina({ Qc, W | Qf })               eficiencia η = W/Qc y calor cedido Qf = Qc − W.
 *   carnot({ Tc, Tf, Qc, unidad })        η = 1 − Tf/Tc (en kelvin), W = η·Qc, Qf = Qc − W.
 *   carnotCiclo({ Tc, Tf, V1, V2, nR | n | Qc, gas })   el ciclo de Carnot en el diagrama P-V: dos isotermas (Tc al
 *                                         expandirse de V1 a V2, Tf al comprimirse) y dos adiabáticas.
 *   juzgar({ Qc, W, Qf, Tc, Tf, unidad }) ¿es posible una máquina propuesta? viola 'primera' (Qc ≠ W + Qf),
 *                                         'segunda' (η mayor que la de Carnot) o 'ninguna'.
 *   refrigerador({ Qf, W | Qc, Tc, Tf, unidad })   COP = Qf/W (calor sacado del foco frío por joule de trabajo).
 *   limites({ tipo, P1, V1, gas, Pmin, Pmax, Vmin, Vmax })   hasta dónde se puede llevar el estado final por la curva
 *                                         del proceso sin salir de la caja del diagrama (para el arrastre de la escena).
 *
 * Cada resultado trae 'errores': los números que salen de las ideas erróneas del informe
 * (docs/investigacion/fluidos-calor-termodinamica-ideas-erroneas.md, T3 a T15, y las hipótesis de su tabla
 * «Lo que no tiene respaldo»). La escena los usa para las opciones incorrectas.
 *
 * Convención de signos (la de las academias peruanas): Q > 0 si el gas recibe calor, W > 0 si el gas hace trabajo (se expande), Q = ΔU + W; P·V en J (Pa·m³ o kPa·L), T en K (t + 273), R = 8,31 J/(mol·K), gas monoatómico por defecto (Cv = 3R/2, γ = 5/3).
 */
(function (root, fabrica) {
  const motor = fabrica();
  if (typeof module === 'object' && module.exports) module.exports = motor;
  else root.MotorTermodinamica = motor;
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  const R_DEF = 8.31;
  const KELVIN = 273;
  const EPS = 1e-9;
  const num = (x, que) => { const n = Number(x); if (x === null || x === undefined || x === '' || !Number.isFinite(n)) throw new Error(`${que} inválido: ${x}`); return n; };
  const pos = (x, que) => { const n = num(x, que); if (!(n > 0)) throw new Error(`${que} debe ser mayor que cero: ${x}`); return n; };
  const limpio = x => (Math.abs(x) < EPS * Math.max(1, Math.abs(x)) || Math.abs(x) < 1e-12 ? 0 : x);
  const def = x => x !== undefined && x !== null;
  const casi = (a, b) => Math.abs(a - b) <= 1e-9 * Math.max(1, Math.abs(a), Math.abs(b));

  // ---------- Gas ----------
  // cv y cp en unidades de R (monoatómico: 3/2 y 5/2).
  function gasDe(o) {
    let gamma;
    if (def(o.gamma)) gamma = num(o.gamma, 'γ');
    else if (!o.gas || o.gas === 'monoatomico') gamma = 5 / 3;
    else if (o.gas === 'diatomico') gamma = 7 / 5;
    else throw new Error(`gas desconocido: ${o.gas}`);
    if (!(gamma > 1)) throw new Error(`γ debe ser mayor que 1: ${gamma}`);
    const cv = 1 / (gamma - 1);
    return { gamma, cv, cp: cv + 1 };
  }
  const Rde = o => (def(o.R) ? pos(o.R, 'R') : R_DEF);
  // nR del gas (J/K): de T1, de n o dado. Null si no se sabe (entonces no hay temperaturas, pero sí W, Q y ΔU).
  function nRde(o, P1, V1) {
    if (def(o.nR)) return pos(o.nR, 'nR');
    if (def(o.T1)) return P1 * V1 / pos(o.T1, 'temperatura inicial');
    if (def(o.n)) return pos(o.n, 'n') * Rde(o);
    return null;
  }
  const Tde = (P, V, nR) => (nR ? P * V / nR : null);

  function estado(o) {
    const R = Rde(o);
    const nR = def(o.nR) ? pos(o.nR, 'nR') : def(o.n) ? pos(o.n, 'n') * R : null;
    const tiene = ['P', 'V', 'T'].filter(k => def(o[k]));
    if (nR !== null) {
      if (tiene.length !== 2) throw new Error('con n, da dos de P, V y T');
      const P = def(o.P) ? pos(o.P, 'P') : nR * pos(o.T, 'T') / pos(o.V, 'V');
      const V = def(o.V) ? pos(o.V, 'V') : nR * pos(o.T, 'T') / P;
      const T = def(o.T) ? pos(o.T, 'T') : P * V / nR;
      return { P, V, T, nR, n: nR / R, R };
    }
    if (tiene.length !== 3) throw new Error('faltan datos: da n y dos de P, V y T, o las tres');
    const P = pos(o.P, 'P'), V = pos(o.V, 'V'), T = pos(o.T, 'T');
    return { P, V, T, nR: P * V / T, n: P * V / T / R, R };
  }

  // ---------- Un proceso ----------
  const TIPOS = ['isobarico', 'isocorico', 'isotermico', 'adiabatico', 'recta'];
  function proceso(o) {
    if (!TIPOS.includes(o.tipo)) throw new Error(`tipo de proceso desconocido: ${o.tipo}`);
    const g = gasDe(o), P1 = pos(o.P1, 'presión inicial'), V1 = pos(o.V1, 'volumen inicial');
    const nR = nRde(o, P1, V1), T1 = Tde(P1, V1, nR);
    const dados = ['V2', 'P2', 'T2', 'Q'].filter(k => def(o[k]));
    const pideT = () => { if (!nR) throw new Error('para usar T2 hace falta la temperatura inicial T1 o n'); return pos(o.T2, 'temperatura final'); };
    let P2, V2;
    const t = o.tipo;
    if (t === 'recta') {
      if (!def(o.P2) || !def(o.V2)) throw new Error('la recta necesita P2 y V2');
      P2 = pos(o.P2, 'presión final'); V2 = pos(o.V2, 'volumen final');
    } else {
      if (dados.length !== 1) throw new Error(`da una sola de V2, P2, T2 o Q para el proceso ${t}`);
      if (t === 'isobarico') {
        P2 = P1;
        if (def(o.V2)) V2 = pos(o.V2, 'volumen final');
        else if (def(o.T2)) V2 = V1 * pideT() / T1;
        else if (def(o.Q)) V2 = V1 + num(o.Q, 'Q') / (g.cp * P1);
        else throw new Error('en el isobárico la presión no cambia: da V2, T2 o Q');
      } else if (t === 'isocorico') {
        V2 = V1;
        if (def(o.P2)) P2 = pos(o.P2, 'presión final');
        else if (def(o.T2)) P2 = P1 * pideT() / T1;
        else if (def(o.Q)) P2 = P1 + num(o.Q, 'Q') / (g.cv * V1);
        else throw new Error('en el isocórico el volumen no cambia: da P2, T2 o Q');
      } else if (t === 'isotermico') {
        if (def(o.V2)) V2 = pos(o.V2, 'volumen final');
        else if (def(o.P2)) V2 = P1 * V1 / pos(o.P2, 'presión final');
        else if (def(o.Q)) V2 = V1 * Math.exp(num(o.Q, 'Q') / (P1 * V1));
        else throw new Error('en el isotérmico la temperatura no cambia: da V2, P2 o Q');
        P2 = P1 * V1 / V2;
      } else {
        if (def(o.V2)) V2 = pos(o.V2, 'volumen final');
        else if (def(o.P2)) V2 = V1 * Math.pow(P1 / pos(o.P2, 'presión final'), 1 / g.gamma);
        else if (def(o.T2)) V2 = V1 * Math.pow(T1 / pideT(), 1 / (g.gamma - 1));
        else throw new Error('en el adiabático no entra ni sale calor: da V2, P2 o T2');
        P2 = P1 * Math.pow(V1 / V2, g.gamma);
      }
      if (!(P2 > 0) || !(V2 > 0)) throw new Error('el estado final no es posible (presión o volumen no positivos)');
    }
    // Estado cuando se recorrió la fracción s del proceso (V lineal en s; P lineal si es isocórico o recta).
    const PV = s => {
      if (t === 'isocorico') return { P: P1 + (P2 - P1) * s, V: V1 };
      const V = V1 + (V2 - V1) * s;
      if (t === 'isobarico') return { P: P1, V };
      if (t === 'isotermico') return { P: P1 * V1 / V, V };
      if (t === 'adiabatico') return { P: P1 * Math.pow(V1 / V, g.gamma), V };
      return { P: P1 + (P2 - P1) * s, V };
    };
    const trabajo = ({ P, V }) => {
      if (t === 'isobarico') return P1 * (V - V1);
      if (t === 'isocorico') return 0;
      if (t === 'isotermico') return P1 * V1 * Math.log(V / V1);
      if (t === 'adiabatico') return (P1 * V1 - P * V) / (g.gamma - 1);
      return (P1 + P) / 2 * (V - V1);
    };
    const en = s => {
      s = Math.max(0, Math.min(1, num(s, 'fracción')));
      const e = PV(s), W = limpio(trabajo(e)), dU = t === 'isotermico' ? 0 : limpio(g.cv * (e.P * e.V - P1 * V1));
      return { P: e.P, V: e.V, T: Tde(e.P, e.V, nR), W, dU, Q: t === 'adiabatico' ? 0 : limpio(dU + W) };
    };
    const fin = en(1);
    const W = fin.W, dU = fin.dU, Q = fin.Q;
    const T2 = Tde(P2, V2, nR);
    const sentido = V2 > V1 + EPS * V1 ? 'expansion' : V2 < V1 - EPS * V1 ? 'compresion' : 'volumen-fijo';
    // Calor que entra y que sale. Solo la recta puede cambiar de signo a la mitad: dQ/dV = cv·(P + V·m) + P, lineal en V.
    let Qabs = Math.max(Q, 0), Qced = Math.max(-Q, 0);
    if (t === 'recta' && Math.abs(V2 - V1) > EPS) {
      const m = (P2 - P1) / (V2 - V1), Pde = V => P1 + m * (V - V1);
      // cv·(P1 + m(V − V1) + m·V) + P1 + m(V − V1) = 0 → V*
      const a = g.cv * 2 * m + m, b = (g.cv + 1) * (P1 - m * V1);
      const Vx = Math.abs(a) > EPS ? -b / a : null;
      if (Vx !== null && Vx > Math.min(V1, V2) + EPS && Vx < Math.max(V1, V2) - EPS) {
        const Px = Pde(Vx), q1 = g.cv * (Px * Vx - P1 * V1) + (P1 + Px) / 2 * (Vx - V1), q2 = Q - q1;
        Qabs = Math.max(q1, 0) + Math.max(q2, 0); Qced = Math.max(-q1, 0) + Math.max(-q2, 0);
      }
    }
    const errores = {
      dUigualQ: Q,                 // T8: todo el calor se vuelve energía interna (se olvida el trabajo)
      dUsumaW: limpio(Q + W),      // T9: el trabajo con el signo cambiado (ΔU = Q + W)
      dUcero: 0,                   // reducción funcional: «no cambia la presión (o T), no cambia U»
      QigualdU: dU,                // el calor sin el trabajo
      trabajoSigno: limpio(-W),    // T9: trabajo hecho sobre el gas en vez del hecho por el gas
      trabajoCero: 0
    };
    if (t === 'isobarico') errores.trabajoPV = P1 * V2;                  // P·V en vez de P·ΔV
    if (t === 'isocorico') errores.trabajoVdP = limpio(V1 * (P2 - P1));  // el área a la izquierda de la curva
    if (t === 'isotermico') { errores.calorCero = 0; errores.trabajoComoIsobarico = limpio(P1 * (V2 - V1)); }  // T11
    if (t === 'adiabatico' && nR) {
      errores.Tigual = T1;                       // T4: aislado, entonces T no cambia
      errores.TproporcionalP = T1 * P2 / P1;     // T3: T crece como P, como si V no cambiara
      errores.TproporcionalV = T1 * V2 / V1;     // T3: T va con V, como si P no cambiara
    }
    const puntos = k => {
      k = Math.max(1, Math.round(k || 40));
      return Array.from({ length: k + 1 }, (_, i) => PV(i / k));
    };
    return { tipo: t, gas: g, nR, inicial: { P: P1, V: V1, T: T1 }, final: { P: P2, V: V2, T: T2 },
      W, Q, dU, dT: nR ? limpio(T2 - T1) : null, Qabs: limpio(Qabs), Qced: limpio(Qced), sentido, en, puntos, errores };
  }

  // ---------- Varios procesos seguidos ----------
  function camino(o) {
    if (!Array.isArray(o.tramos) || !o.tramos.length) throw new Error('el camino necesita al menos un tramo');
    const P1 = pos(o.P1, 'presión inicial'), V1 = pos(o.V1, 'volumen inicial');
    const nR = nRde(o, P1, V1);
    const base = { gas: o.gas, gamma: o.gamma };
    let P = P1, V = V1;
    const tramos = o.tramos.map((q, i) => {
      const args = Object.assign({}, base, q, { P1: P, V1: V });
      if (nR) args.nR = nR;
      delete args.T1; delete args.n;
      const r = proceso(args);
      P = r.final.P; V = r.final.V;
      r.indice = i;
      return r;
    });
    const suma = k => limpio(tramos.reduce((s, r) => s + r[k], 0));
    const W = suma('W'), Q = suma('Q'), dU = suma('dU');
    const cerrado = casi(P, P1) && casi(V, V1);
    const res = { tramos, W, Q, dU, nR, inicial: tramos[0].inicial, final: tramos[tramos.length - 1].final, cerrado,
      Qabs: suma('Qabs'), Qced: suma('Qced'),
      // Estado al recorrer la fracción s de todo el camino (cada tramo vale lo mismo).
      en: s => {
        s = Math.max(0, Math.min(1, num(s, 'fracción')));
        const k = Math.min(tramos.length - 1, Math.floor(s * tramos.length)), f = s * tramos.length - k;
        const e = tramos[k].en(f), antes = tramos.slice(0, k);
        const acum = key => limpio(antes.reduce((a, r) => a + r[key], 0) + e[key]);
        return { tramo: k, P: e.P, V: e.V, T: e.T, W: acum('W'), Q: acum('Q'), dU: acum('dU') };
      },
      puntos: k => tramos.flatMap((r, i) => r.puntos(k).slice(i ? 1 : 0)) };
    const absW = tramos.reduce((s, r) => s + Math.abs(r.W), 0);
    const mayorW = tramos.reduce((m, r) => Math.max(m, Math.abs(r.W)), 0);
    res.errores = { trabajoCero: 0, calorCero: 0, sumaAreas: limpio(absW), trabajoTramoMayor: limpio(mayorW), trabajoSigno: limpio(-W),
      dUigualQ: Q, dUsumaW: limpio(Q + W) };
    if (cerrado) {
      res.dU = 0;
      res.sentido = W > EPS ? 'horario' : W < -EPS ? 'antihorario' : 'ninguno';
      res.tipo = W > EPS ? 'maquina' : W < -EPS ? 'refrigerador' : 'ninguno';
      res.eficiencia = W > EPS && res.Qabs > 0 ? W / res.Qabs : null;
      res.cop = W < -EPS ? res.Qabs / -W : null;
      Object.assign(res.errores, {
        eficienciaConQced: W > EPS && res.Qced > 0 ? W / res.Qced : null,   // divide entre el calor que sale
        eficienciaQcedQabs: res.Qabs > 0 ? res.Qced / res.Qabs : null        // Qf/Qc en vez de W/Qc
      });
    }
    return res;
  }

  function rectangulo(o) {
    const Pa = pos(o.Pa, 'presión baja'), Pb = pos(o.Pb, 'presión alta'), Va = pos(o.Va, 'volumen chico'), Vb = pos(o.Vb, 'volumen grande');
    if (!(Pb > Pa) || !(Vb > Va)) throw new Error('el rectángulo pide Pa < Pb y Va < Vb');
    const sentido = o.sentido || 'horario';
    if (sentido !== 'horario' && sentido !== 'antihorario') throw new Error(`sentido desconocido: ${sentido}`);
    const tramos = sentido === 'horario'
      ? [{ tipo: 'isocorico', P2: Pb }, { tipo: 'isobarico', V2: Vb }, { tipo: 'isocorico', P2: Pa }, { tipo: 'isobarico', V2: Va }]
      : [{ tipo: 'isobarico', V2: Vb }, { tipo: 'isocorico', P2: Pb }, { tipo: 'isobarico', V2: Va }, { tipo: 'isocorico', P2: Pa }];
    const r = camino({ P1: Pa, V1: Va, T1: o.T1, n: o.n, R: o.R, nR: o.nR, gas: o.gas, gamma: o.gamma, tramos });
    r.area = (Pb - Pa) * (Vb - Va);
    return r;
  }

  // ---------- Primera ley ----------
  function primeraLey(o) {
    const dados = ['Q', 'W', 'dU'].filter(k => def(o[k]));
    if (dados.length !== 2) throw new Error('da dos de Q, W y ΔU');
    if (!def(o.dU)) {
      const Q = num(o.Q, 'Q'), W = num(o.W, 'W');
      return { Q, W, dU: limpio(Q - W), errores: { olvidaTrabajo: Q, signoCambiado: limpio(Q + W), restaAlReves: limpio(W - Q) } };
    }
    if (!def(o.Q)) {
      const dU = num(o.dU, 'ΔU'), W = num(o.W, 'W');
      return { Q: limpio(dU + W), W, dU, errores: { olvidaTrabajo: dU, signoCambiado: limpio(dU - W) } };
    }
    const Q = num(o.Q, 'Q'), dU = num(o.dU, 'ΔU');
    return { Q, W: limpio(Q - dU), dU, errores: { signoCambiado: limpio(dU - Q), olvidaEnergiaInterna: Q } };
  }

  // ---------- Máquinas ----------
  const aK = (T, unidad, que) => {
    const t = num(T, que);
    if (!unidad || unidad === 'K') { if (!(t > 0)) throw new Error(`${que} debe ser mayor que 0 K: ${T}`); return t; }
    if (unidad === 'C') { if (!(t + KELVIN > 0)) throw new Error(`${que} bajo el cero absoluto: ${T}`); return t + KELVIN; }
    throw new Error(`unidad desconocida: ${unidad}`);
  };
  function focos(o) {
    const Tc = aK(o.Tc, o.unidad, 'temperatura del foco caliente'), Tf = aK(o.Tf, o.unidad, 'temperatura del foco frío');
    if (!(Tc > Tf)) throw new Error('el foco caliente debe estar más caliente que el frío');
    return { Tc, Tf, tc: Tc - KELVIN, tf: Tf - KELVIN };
  }
  function maquina(o) {
    const Qc = pos(o.Qc, 'calor que recibe');
    if (def(o.W) === def(o.Qf)) throw new Error('da W o Qf (uno solo)');
    const W = def(o.W) ? num(o.W, 'W') : Qc - num(o.Qf, 'Qf'), Qf = Qc - W;
    return { Qc, W, Qf, eta: W / Qc, errores: { WsobreQf: Qf > 0 ? W / Qf : null, QfsobreQc: Qf / Qc, QcsobreW: W ? Qc / W : null } };
  }
  function carnot(o) {
    const f = focos(o), eta = 1 - f.Tf / f.Tc;
    const r = Object.assign(f, { eta });
    const conC = f.tc !== 0 ? 1 - f.tf / f.tc : null;
    r.errores = { celsius: conC, invertida: f.Tf / f.Tc, cien: 1, diferenciaSobreFrio: (f.Tc - f.Tf) / f.Tf };
    if (def(o.Qc)) {
      const Qc = pos(o.Qc, 'calor que recibe');
      Object.assign(r, { Qc, W: eta * Qc, Qf: Qc - eta * Qc });
      r.errores.Wcelsius = conC === null ? null : conC * Qc;
      r.errores.Winvertida = Qc * f.Tf / f.Tc;
    }
    return r;
  }
  function carnotCiclo(o) {
    const f = focos(o), g = gasDe(o), V1 = pos(o.V1, 'volumen inicial'), V2 = pos(o.V2, 'volumen al final de la isoterma');
    if (!(V2 > V1)) throw new Error('en la isoterma caliente el gas se expande: V2 > V1');
    let nR;
    if (def(o.nR)) nR = pos(o.nR, 'nR');
    else if (def(o.n)) nR = pos(o.n, 'n') * Rde(o);
    else if (def(o.Qc)) nR = pos(o.Qc, 'calor que recibe') / (f.Tc * Math.log(V2 / V1));
    else throw new Error('da nR, n o Qc');
    const P1 = nR * f.Tc / V1;
    const r = camino({ P1, V1, nR, gamma: g.gamma, tramos: [
      { tipo: 'isotermico', V2 }, { tipo: 'adiabatico', T2: f.Tf },
      { tipo: 'isotermico', V2: V1 * Math.pow(f.Tc / f.Tf, g.cv) }, { tipo: 'adiabatico', T2: f.Tc }] });
    r.Tc = f.Tc; r.Tf = f.Tf;
    r.Qc = r.tramos[0].Q; r.Qf = -r.tramos[2].Q;
    r.etaCarnot = 1 - f.Tf / f.Tc;
    r.vertices = r.tramos.map(q => q.inicial);
    return r;
  }
  function juzgar(o) {
    const f = focos(o), Qc = pos(o.Qc, 'calor que recibe'), W = num(o.W, 'W');
    const Qf = def(o.Qf) ? num(o.Qf, 'Qf') : Qc - W;
    const eta = W / Qc, etaCarnot = 1 - f.Tf / f.Tc;
    const veredicto = lim => (!casi(Qc, W + Qf) ? 'primera' : eta > lim + EPS ? 'segunda' : 'ninguna');
    const viola = veredicto(etaCarnot);
    const conC = f.tc > 0 ? 1 - f.tf / f.tc : null;
    return { Qc, W, Qf, eta, etaCarnot, Tc: f.Tc, Tf: f.Tf, viola, posible: viola === 'ninguna',
      errores: { etaCelsius: conC, conCelsius: conC === null ? null : veredicto(conC), sinSegundaLey: veredicto(1) } };
  }
  function refrigerador(o) {
    const Qf = pos(o.Qf, 'calor sacado del foco frío');
    if (def(o.W) === def(o.Qc)) throw new Error('da W o Qc (uno solo)');
    const W = def(o.W) ? pos(o.W, 'W') : pos(o.Qc, 'Qc') - Qf;
    if (!(W > 0)) throw new Error('un refrigerador necesita trabajo: Qc > Qf');
    const r = { Qf, W, Qc: Qf + W, cop: Qf / W, errores: { copInvertido: W / Qf, copConQc: (Qf + W) / W } };
    if (def(o.Tc) && def(o.Tf)) {
      const f = focos(o);
      r.copCarnot = f.Tf / (f.Tc - f.Tf);
      r.posible = r.cop <= r.copCarnot + EPS;
      r.errores.copCarnotCelsius = f.tc !== f.tf ? f.tf / (f.tc - f.tf) : null;
      r.errores.copCarnotInvertido = (f.Tc - f.Tf) / f.Tf;
    }
    return r;
  }

  // ---------- Límites para el arrastre ----------
  function limites(o) {
    if (!TIPOS.includes(o.tipo) || o.tipo === 'recta') throw new Error(`tipo de proceso sin límites: ${o.tipo}`);
    const g = gasDe(o), P1 = pos(o.P1, 'presión inicial'), V1 = pos(o.V1, 'volumen inicial');
    const Pmin = pos(o.Pmin, 'Pmin'), Pmax = pos(o.Pmax, 'Pmax'), Vmin = pos(o.Vmin, 'Vmin'), Vmax = pos(o.Vmax, 'Vmax');
    if (o.tipo === 'isocorico') return { variable: 'P', min: Pmin, max: Pmax };
    if (o.tipo === 'isobarico') return { variable: 'V', min: Vmin, max: Vmax };
    const k = o.tipo === 'isotermico' ? 1 : g.gamma;
    // P = P1·(V1/V)^k  →  V = V1·(P1/P)^(1/k)
    const Vde = P => V1 * Math.pow(P1 / P, 1 / k);
    return { variable: 'V', min: Math.max(Vmin, Vde(Pmax)), max: Math.min(Vmax, Vde(Pmin)) };
  }

  return { R: R_DEF, KELVIN, gasDe, estado, proceso, camino, rectangulo, primeraLey, maquina, carnot, carnotCiclo, juzgar, refrigerador, limites };
});
