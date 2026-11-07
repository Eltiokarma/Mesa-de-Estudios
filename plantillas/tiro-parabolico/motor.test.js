// Pruebas del motor de tiro parabólico y movimiento circular. Se corren desde la raíz con: node --test
//
// 1. Cada caso de casos.json, verificado con fracciones exactas y otro método, debe salir igual del
//    motor (regla 2 de CLAUDE.md).
// 2. Coherencia: la velocidad es la derivada de la posición (diferencias numéricas); la trayectoria es la
//    parábola y = y0 + x·tan θ − g·x²/(2·v0²·cos²θ); la rapidez al llegar sale también de la energía.
// 3. Lo que enseña la escena: el movimiento vertical no depende del horizontal (P1, P2); el avance
//    horizontal es igual cada segundo (P3); en la cima a = −g (C1); ángulos complementarios dan el mismo
//    alcance y 45° el máximo; en el MCU la aceleración apunta al centro; al soltarse, sigue tangente (D9).
//    Pared, MCUV con tres datos, transmisión y encuentros en la pista (0.2.0): la pared sale del mismo
//    proyectil; las diez combinaciones de tres datos del MCUV devuelven los otros dos; con faja la v es igual
//    y en el eje la ω; en la pista la separación se cierra justo en cada encuentro y nunca antes.
// 4. Errores de entrada.
// 5. Cada problema de papel.json coincide con el motor.

const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const fs = require('node:fs');
const motor = require('./motor.js');

const datos = JSON.parse(fs.readFileSync(path.join(__dirname, 'casos.json'), 'utf8'));
const TOL = datos.tolerancia;
function cerca(real, esperado, que, tol) {
  const t = tol === undefined ? TOL : tol;
  assert.ok(typeof real === 'number' && Math.abs(real - esperado) <= t * Math.max(1, Math.abs(esperado)), `${que}: el motor da ${real}, se esperaba ${esperado}`);
}
const leer = (o, k) => k.split('.').reduce((x, p) => (x === null || x === undefined ? undefined : x[p]), o);
function llamar(fn, args) {
  if (fn === 'estadoEn') return motor.proyectil(args[0]).estado(args[1]);
  if (fn === 'cuandoEn') return motor.proyectil(args[0]).cuando(args[1]);
  assert.equal(typeof motor[fn], 'function', `motor.${fn} no existe`);
  return motor[fn](...args);
}
function comprobar(fn, args, espera, que) {
  const r = llamar(fn, args);
  for (const [k, v] of Object.entries(espera)) {
    const x = k === 'valor' ? r : k === 'largo' ? r.length : leer(r, k);
    if (typeof v === 'number') cerca(x, v, `${que} · ${k}`);
    else assert.equal(x, v, `${que} · ${k}: el motor da ${x}, se esperaba ${v}`);
  }
}

// 1. casos.json
for (const c of datos.casos) test(c.nombre, () => {
  comprobar(c.fn, c.args, c.espera, c.nombre);
  for (const t of c.tambien || []) comprobar(t.fn || c.fn, t.args, t.espera, c.nombre);
});

// 2. Coherencia
const TIROS = [{ v0: 50, angulo: 37 }, { v0: 50, angulo: 53 }, { vx: 15, y0: 80 }, { v0: 25, angulo: 37, y0: 20 }, { v0: 10, angulo: -37, y0: 32 },
  { v0: 18, angulo: 62, y0: 4, exacto: true }, { v0: 7.5, angulo: 12, y0: 0.6, exacto: true }];
test('la velocidad es la derivada de la posición y la aceleración, la de la velocidad', () => {
  for (const o of TIROS) {
    const p = motor.proyectil(o), h = 1e-5;
    for (const f of [0.1, 0.35, 0.5, 0.8]) {
      const t = p.tVuelo * f, a = p.estado(t - h), b = p.estado(t + h), e = p.estado(t);
      cerca((b.x - a.x) / (2 * h), e.vx, `vx ${JSON.stringify(o)}`, 1e-6);
      cerca((b.y - a.y) / (2 * h), e.vy, `vy ${JSON.stringify(o)}`, 1e-6);
      cerca((b.vy - a.vy) / (2 * h), e.ay, `ay ${JSON.stringify(o)}`, 1e-6);
    }
  }
});
test('la trayectoria es la parábola y = y0 + x·tan θ − g·x²/(2·v0²·cos²θ)', () => {
  for (const o of TIROS) {
    const p = motor.proyectil(o);
    if (p.vx === 0) continue;
    for (const e of p.puntos(30)) {
      const x = e.x - p.x0, y = p.y0 + x * p.vy / p.vx - p.g * x * x / (2 * p.vx * p.vx);
      cerca(e.y, y, `parábola ${JSON.stringify(o)}`, 1e-9);
    }
    cerca(p.estado(p.tVuelo).y, 0, 'llega al suelo en tVuelo');
  }
});
test('la rapidez al llegar coincide con la conservación de la energía: v² = v0² + 2·g·y0', () => {
  for (const o of TIROS) {
    const p = motor.proyectil(o);
    cerca(p.vFinal.modulo ** 2, p.v0 ** 2 + 2 * p.g * p.y0, `energía ${JSON.stringify(o)}`, 1e-9);
  }
});

// 3. Lo que enseña la escena
test('P1 y P2: el tiempo de caída no depende de la velocidad horizontal', () => {
  for (const y0 of [5, 20, 80, 125]) {
    const t = motor.proyectil({ vx: 0, y0 }).tVuelo;
    for (const vx of [1, 15, 30, 300]) {
      const p = motor.proyectil({ vx, y0 });
      cerca(p.tVuelo, t, `vx = ${vx}, y0 = ${y0}`);
      for (const f of [0.2, 0.6, 0.9]) cerca(p.estado(t * f).y, motor.proyectil({ vx: 0, y0 }).estado(t * f).y, 'misma altura en cada instante');
    }
  }
});
test('P3: el avance horizontal es el mismo cada segundo; la caída, no', () => {
  const p = motor.proyectil({ vx: 15, y0: 80 });
  for (let t = 0; t < 3; t++) {
    cerca(p.estado(t + 1).x - p.estado(t).x, 15, `avance en el segundo ${t + 1}`);
    cerca(p.estado(t).y - p.estado(t + 1).y, 5 + 10 * t, `caída en el segundo ${t + 1}`);
  }
});
test('C1: en la cima vy = 0, la rapidez es vx y la aceleración sigue siendo −g', () => {
  for (const o of TIROS.filter(q => (q.angulo || 0) > 0)) {
    const p = motor.proyectil(o), e = p.estado(p.tSubida);
    cerca(e.vy, 0, 'vy en la cima'); cerca(e.v, p.vx, 'rapidez en la cima'); cerca(e.ay, -10, 'a en la cima'); cerca(e.y, p.H, 'altura máxima');
  }
});
test('desde el suelo, ángulos complementarios dan el mismo alcance y 45° da el máximo', () => {
  for (const v0 of [10, 30, 50]) {
    for (const a of [15, 20, 30, 37, 40]) cerca(motor.proyectil({ v0, angulo: a, exacto: true }).alcance, motor.proyectil({ v0, angulo: 90 - a, exacto: true }).alcance, `${a}° y ${90 - a}°`);
    const max = motor.alcanceMaximo(v0);
    for (let a = 5; a < 90; a += 2.5) assert.ok(motor.proyectil({ v0, angulo: a, exacto: true }).alcance <= max + 1e-9);
    cerca(motor.proyectil({ v0, angulo: 45 }).alcance, max, '45°');
  }
});
test('la masa no aparece: el motor no la pide ni la usa', () => {
  const a = motor.proyectil({ v0: 50, angulo: 37 }), b = motor.proyectil({ v0: 50, angulo: 37, m: 1000 });
  cerca(a.alcance, b.alcance, 'alcance'); cerca(a.tVuelo, b.tVuelo, 'tiempo');
});
test('MCU: ac = v²/r = ω²·r, y apunta al centro (Δv entre dos instantes cercanos)', () => {
  for (const o of [{ r: 2, v: 4 }, { r: 0.5, rpm: 120 }, { r: 50, v: 10 }, { r: 3, periodo: 2 }]) {
    const m = motor.mcu(o);
    cerca(m.ac, m.v ** 2 / m.r, 'v²/r'); cerca(m.ac, m.omega ** 2 * m.r, 'ω²r'); cerca(m.v, m.omega * m.r, 'v = ωr');
    // Δv/Δt en θ = 0: la velocidad pasa de (0, v) a (−v·sen ωh, v·cos ωh); el cambio apunta hacia −x, al centro.
    // Diferencia centrada: v(−h) = (v·sen ωh, v·cos ωh) y v(h) = (−v·sen ωh, v·cos ωh).
    const h = 1e-6, w = m.omega, ax = (-2 * m.v * Math.sin(w * h)) / (2 * h), ay = (m.v * Math.cos(w * h) - m.v * Math.cos(-w * h)) / (2 * h);
    cerca(ax, -m.ac, 'a hacia el centro', 1e-4); cerca(ay, 0, 'sin componente tangencial', 1e-4);
  }
});
test('D9: al soltarse sigue en línea recta tangente: la velocidad es perpendicular al radio y se aleja del círculo', () => {
  for (const theta of [0, 30, 90, 200]) for (const w of [3, -2]) {
    const s0 = motor.soltarDelCirculo({ r: 2, omega: w, theta, t: 0 });
    cerca(s0.suelta.x * s0.vx + s0.suelta.y * s0.vy, 0, 'tangente', 1e-9);
    let antes = 2;
    for (const t of [0.2, 0.5, 1, 2]) {
      const s = motor.soltarDelCirculo({ r: 2, omega: w, theta, t });
      cerca(s.distanciaAlCentro, Math.sqrt(4 + (w * 2 * t) ** 2), 'distancia al centro');
      assert.ok(s.distanciaAlCentro > antes); antes = s.distanciaAlCentro;
    }
  }
});
test('MCUV frenando: ω² = ω0² − 2·|α|·θ y a tParada, ω = 0', () => {
  const o = { r: 1, omega0: 10, alfa: -2 };
  for (const t of [1, 2.5, 4]) { const m = motor.mcuv(Object.assign({ t }, o)); cerca(m.omega ** 2, 100 - 4 * m.theta, `t = ${t}`); }
  cerca(motor.mcuv(Object.assign({ t: 5 }, o)).omega, 0, 'ω en tParada');
});
test('transmisión: con faja la rueda chica gira más rápido; en el eje, el borde grande va más rápido', () => {
  const f = motor.transmision({ r1: 0.1, r2: 0.3, omega1: 30, tipo: 'faja' }), e = motor.transmision({ r1: 0.3, r2: 0.5, omega1: 10, tipo: 'eje' });
  cerca(f.v1, f.v2, 'misma v'); assert.ok(f.omega2 < 30);
  cerca(e.omega2, 10, 'misma ω'); assert.ok(e.v2 > e.v1);
  assert.throws(() => motor.transmision({ r1: 1, r2: 1, omega1: 1, tipo: 'cadena' }), /faja/);
});
test('MCUV: el ángulo es el área bajo ω-t', () => {
  const o = { r: 0.5, omega0: 2, alfa: 1 };
  let area = 0; const n = 40000, T = 4;
  for (let k = 0; k < n; k++) area += motor.mcuv(Object.assign({ t: (k + 0.5) * T / n }, o)).omega * T / n;
  cerca(motor.mcuv(Object.assign({ t: T }, o)).theta, area, 'θ', 1e-6);
});

// Pared, MCUV con tres datos, transmisión y encuentros (versión 0.2.0)
test('pared = proyectil: la altura, vy y v en la pared son las de estado(d/vx); energía, simetría y cima', () => {
  for (const o of TIROS) {
    const p = motor.proyectil(o);
    for (const f of [0.1, 0.3, 0.5, 0.7, 0.9]) {
      const d = p.alcance * f, w = motor.impactoPared(Object.assign({ d }, o)), e = p.estado(d / p.vx);
      assert.equal(w.choca, true, `choca ${JSON.stringify(o)} d = ${d}`);
      cerca(w.y, e.y, 'y'); cerca(w.vy, e.vy, 'vy'); cerca(w.v, e.v, 'v'); cerca(w.t, d / p.vx, 't');
      cerca(w.v ** 2, p.v0 ** 2 - 2 * p.g * (w.y - p.y0), 'energía', 1e-9);
      const d2 = 2 * w.xCima - d;
      if (d2 > 1e-6 && d2 < p.alcance - 1e-6) cerca(motor.impactoPared(Object.assign({ d: d2 }, o)).y, w.y, `simetría respecto de xCima ${JSON.stringify(o)}`, 1e-9);
    }
    for (const f of [1, 1.2, 3]) assert.equal(motor.impactoPared(Object.assign({ d: p.alcance * f }, o)).choca, false, 'más allá del alcance no choca');
    if (p.vy > 0) {
      const yc = motor.impactoPared(Object.assign({ d: p.vx * p.tSubida }, o));
      cerca(yc.y, p.H, 'en xCima la altura es H'); assert.equal(yc.fase, 'cima');
      for (let k = 1; k < 40; k++) assert.ok(motor.impactoPared(Object.assign({ d: p.alcance * k / 40 }, o)).y <= p.H + 1e-9, 'la altura más grande en la pared está en xCima');
    }
  }
});
test('pared: una pared más baja que el punto de impacto deja pasar al proyectil', () => {
  const w = motor.impactoPared({ v0: 50, angulo: 37, d: 160 });
  assert.equal(motor.impactoPared({ v0: 50, angulo: 37, d: 160, alto: w.y - 0.01 }).motivo, 'pasa-por-encima');
  assert.equal(motor.impactoPared({ v0: 50, angulo: 37, d: 160, alto: w.y + 0.01 }).choca, true);
});
const GIROS = [{ w0: 2, al: 1, t: 4 }, { w0: 10, al: -2, t: 3 }, { w0: 0, al: 3, t: 2 }, { w0: -4, al: 1, t: 2 }, { w0: 3, al: 0, t: 2 }];
test('MCUV con tres datos: las diez combinaciones devuelven los otros dos', () => {
  const NOMBRES = ['omega0', 'omega', 'alfa', 't', 'theta'];
  const combos = [];
  for (let a = 0; a < 5; a++) for (let b = a + 1; b < 5; b++) for (let c = b + 1; c < 5; c++) combos.push([a, b, c].map(k => NOMBRES[k]));
  assert.equal(combos.length, 10);
  for (const g of GIROS) {
    const real = { omega0: g.w0, omega: g.w0 + g.al * g.t, alfa: g.al, t: g.t, theta: g.w0 * g.t + g.al * g.t * g.t / 2 };
    for (const cb of combos) {
      if (g.al === 0 && cb.join() === 'omega0,omega,alfa') { assert.throws(() => motor.mcuvDatos({ omega0: real.omega0, omega: real.omega, alfa: 0 }), /no cambia/); continue; }
      const args = {}; cb.forEach(k => { args[k] = real[k]; });
      const m = motor.mcuvDatos(args);
      for (const k of NOMBRES) cerca(m[k], real[k], `${JSON.stringify(g)} con ${cb.join(', ')} · ${k}`, 1e-9);
      cerca(m.vueltas, real.theta / (2 * Math.PI), 'vueltas'); cerca(m.f, real.omega / (2 * Math.PI), 'f'); cerca(m.rpm0, real.omega0 * 60 / (2 * Math.PI), 'rpm0');
    }
  }
});
test('MCUV con tres datos: θ es el área bajo ω-t y ω² = ω0² + 2αθ', () => {
  for (const g of GIROS) {
    const m = motor.mcuvDatos({ omega0: g.w0, alfa: g.al, t: g.t });
    let area = 0; const n = 20000;
    for (let k = 0; k < n; k++) area += (m.omega0 + m.alfa * (k + 0.5) * g.t / n) * g.t / n;
    cerca(m.theta, area, `área ${JSON.stringify(g)}`, 1e-9);
    cerca(m.omega ** 2, m.omega0 ** 2 + 2 * m.alfa * m.theta, `ω² ${JSON.stringify(g)}`, 1e-9);
  }
  const m = motor.mcuvDatos({ f0: 2, f: 0, t: 4 });
  cerca(m.errores.vueltasRectanguloInicial, 2 * m.vueltas, 'el rectángulo es el doble del triángulo');
});
test('mcuv con frena: después de detenerse se queda quieta y nunca retrocede; sin frena, la ecuación sigue', () => {
  for (const o of [{ r: 0.3, omega0: 4 * Math.PI, alfa: -Math.PI }, { r: 1, omega0: 10, alfa: -2 }, { r: 2, omega0: -6, alfa: 1.5 }]) {
    const tp = motor.mcuv(Object.assign({ t: 0 }, o)).tParada;
    let antes = 0;
    for (let k = 0; k <= 60; k++) {
      const t = tp * 2 * k / 60, m = motor.mcuv(Object.assign({ t, frena: true }, o));
      assert.ok(Math.abs(m.theta) >= Math.abs(antes) - 1e-9, `no retrocede en t = ${t}`); antes = m.theta;
      if (t > tp + 1e-9) {
        assert.equal(m.omega, 0); cerca(m.theta, m.thetaParada, 'θ parada'); assert.equal(m.at, 0); assert.equal(m.a, 0);
        const libre = motor.mcuv(Object.assign({ t }, o));
        cerca(m.errores.thetaSinDetenerse, libre.theta, 'thetaSinDetenerse es la fórmula sin tope');
        assert.ok(Math.abs(libre.theta) < Math.abs(m.theta) + 1e-9, 'sin tope, la ecuación «retrocede»');
      } else cerca(m.omega, motor.mcuv(Object.assign({ t }, o)).omega, 'antes de detenerse, igual que sin frena');
    }
  }
});
test('transmisión: faja ω1·r1 = ω2·r2, eje v2/v1 = r2/r1, sentidos, y el tren multiplica las razones', () => {
  for (const [r1, r2] of [[0.12, 0.04], [0.1, 0.3], [0.05, 0.05], [0.2, 0.07]]) for (const f1 of [0.5, 1, 3]) {
    for (const tipo of ['faja', 'cruzada', 'engranaje']) {
      const m = motor.transmision({ r1, r2, f1, tipo });
      cerca(m.omega1 * r1, m.omega2 * r2, `${tipo}: misma v`);
      if (r2 < r1) assert.ok(m.omega2 > m.omega1, 'la chica gira más rápido');
      assert.equal(m.sentido2, tipo === 'faja' ? 1 : -1, `sentido con ${tipo}`);
    }
    const e = motor.transmision({ r1, r2, f1, tipo: 'eje' });
    cerca(e.v2 / e.v1, r2 / r1, 'eje: v proporcional al radio'); cerca(e.omega2, e.omega1, 'eje: misma ω'); assert.equal(e.sentido2, 1);
    cerca(motor.transmision({ r1, r2, v1: e.v1, tipo: 'eje' }).omega2, e.omega2, 'con v1 da lo mismo');
  }
  const tr = motor.tren({ f1: 1, ruedas: [{ r: 0.12 }, { r: 0.04, union: 'faja' }, { r: 0.3, union: 'eje' }, { r: 0.1, union: 'engranaje' }] });
  cerca(tr[3].omega, 2 * Math.PI * (0.12 / 0.04) * 1 * (0.3 / 0.1), 'producto de las razones');
  cerca(tr[2].v, 2 * Math.PI * 3 * 0.3, 'la rueda de atrás'); assert.deepEqual(tr.map(q => q.sentido), [1, 1, 1, -1]);
});
const CARRERAS = [{ L: 400, v1: 7, v2: 3, sentido: 'mismo' }, { L: 400, v1: 7, v2: 3, sentido: 'contrario', separacion: 200 },
  { L: 400, v1: 3, v2: 5, sentido: 'mismo', separacion: 100 }, { L: 250, v1: 2.5, v2: 6, sentido: 'contrario', separacion: 30 },
  { L: 300, v1: 6, v2: 1.5, sentido: 'mismo', separacion: 275 }, { L: 400, v1: 0, v2: 4, sentido: 'contrario', separacion: 120 }];
test('pista: en cada tₙ la separación es 0 y entre dos encuentros nunca; periodo·vRel = L', () => {
  for (const o of CARRERAS) {
    let previo = 0;
    for (const n of [1, 2, 3, 4]) {
      const e = motor.encuentroPista(Object.assign({ n }, o)), s = e.estado(e.t);
      assert.ok(s.separacion < 1e-7 || s.separacion > e.L - 1e-7, `separación 0 en t${n} ${JSON.stringify(o)}`);
      assert.ok(Math.abs(s.a - s.b) < 1e-7 || Math.abs(Math.abs(s.a - s.b) - e.L) < 1e-7, 'a ≡ b');
      cerca(s.a, e.lugar, 'lugar', 1e-9);
      for (let k = 1; k < 200; k++) {
        const t = previo + (e.t - previo) * k / 200;
        assert.ok(e.estado(t).separacion > 1e-9, `separación > 0 entre encuentros, t = ${t}`);
      }
      if (n > 1) cerca(e.t - previo, e.periodo, 'tₙ − tₙ₋₁ = periodo');
      cerca(e.periodo * e.vRel, e.L, 'periodo·vRel = L');
      previo = e.t;
    }
  }
});
test('pista: contrario antes que mismo, cambiar los papeles, escalar L y la versión angular', () => {
  for (const o of CARRERAS) {
    const a = motor.encuentroPista(o);
    const otro = motor.encuentroPista(Object.assign({}, o, { sentido: o.sentido === 'mismo' ? 'contrario' : 'mismo' }));
    const [m, c] = o.sentido === 'mismo' ? [a, otro] : [otro, a];
    if (!m.nunca) assert.ok(c.t <= m.t + 1e-9, `contrario no tarda más que mismo ${JSON.stringify(o)}`);
    if (o.sentido === 'mismo') {
      const s0 = o.separacion || 0, b = motor.encuentroPista(Object.assign({}, o, { v1: o.v2, v2: o.v1, separacion: s0 ? o.L - s0 : 0 }));
      cerca(b.t, a.t, 'cambiar los papeles de A y B');
    }
    for (const k of [0.5, 3]) cerca(motor.encuentroPista(Object.assign({}, o, { L: o.L * k, v1: o.v1, v2: o.v2, separacion: (o.separacion || 0) * k })).t, a.t * k, 'L por k, t por k');
    const r = o.L / (2 * Math.PI), ang = motor.encuentroPista({ omega1: o.v1 / r, omega2: o.v2 / r, theta0: (o.separacion || 0) / o.L * 360, sentido: o.sentido });
    cerca(ang.t, a.t, 'angular y en metros dan el mismo t'); cerca(ang.lugarGrados, a.lugar / o.L * 360, 'mismo lugar', 1e-9);
    cerca(motor.encuentroPista(Object.assign({ r }, o, { L: undefined })).t, a.t, 'con r en vez de L');
  }
});

// 4. Errores de entrada
test('errores de entrada', () => {
  assert.throws(() => motor.proyectil({ v0: 10, angulo: 120 }), /−90° a 90°/);
  assert.throws(() => motor.proyectil({ v0: 10, angulo: -20 }), /hacia arriba/);
  assert.throws(() => motor.proyectil({ vx: 5, y0: -3 }), /negativo/);
  assert.throws(() => motor.proyectil({ v0: 'rápido', angulo: 30 }), /inválido/);
  assert.throws(() => motor.mcu({ r: 2 }), /falta/);
  assert.throws(() => motor.mcu({ r: 0, v: 3 }), /mayor que cero/);
  assert.throws(() => motor.mcuv({ r: 1, omega0: 1, alfa: 1, t: -1 }), /negativo/);
  assert.throws(() => motor.impactoPared({ v0: 50, angulo: 37, d: 0 }), /mayor que cero/);
  assert.throws(() => motor.impactoPared({ v0: 50, angulo: 37, d: -5 }), /mayor que cero/);
  assert.throws(() => motor.impactoPared({ v0: 10, angulo: 90, d: 5 }), /velocidad horizontal/);
  assert.throws(() => motor.mcuvDatos({ f0: 2, f: 0 }), /exactamente tres/);
  assert.throws(() => motor.mcuvDatos({ f0: 2, f: 0, t: 4, alfa: -1 }), /exactamente tres/);
  assert.throws(() => motor.mcuvDatos({ f0: 2, t: 4, theta: 3, vueltas: 1 }), /no las dos/);
  assert.throws(() => motor.mcuvDatos({ f0: 2, alfa: -Math.PI, vueltas: 5 }), /se detiene antes: solo gira 4 vueltas/);
  assert.throws(() => motor.mcuvDatos({ f0: 2, f: 2, alfa: 1 }), /no llega|no cambia/);
  assert.throws(() => motor.mcuvDatos({ f0: 2, f: 0, t: 0 }), /mayor que cero/);
  assert.throws(() => motor.encuentroPista({ L: 400, v1: 7, v2: 3, sentido: 'opuesto' }), /mismo/);
  assert.throws(() => motor.encuentroPista({ L: 400, v1: 7, v2: 3, sentido: 'mismo', separacion: 400 }), /una vuelta/);
  assert.throws(() => motor.encuentroPista({ L: 400, v1: -7, v2: 3, sentido: 'mismo' }), /negativas/);
  assert.throws(() => motor.encuentroPista({ L: 400, v1: 7, v2: 3, sentido: 'mismo', n: 0 }), /1, 2, 3/);
  assert.throws(() => motor.encuentroPista({ L: 400, v1: 7, v2: 3, sentido: 'mismo', n: 1.5 }), /1, 2, 3/);
  assert.throws(() => motor.transmision({ r1: 0.1, r2: 0.2, tipo: 'faja' }), /falta/);
  assert.throws(() => motor.transmision({ r1: 0.1, r2: 0.2, f1: 1, v1: 2, tipo: 'faja' }), /no las dos/);
});

// 5. Problemas de papel (regla 6)
const rutaPapel = path.join(__dirname, 'papel.json');
const papel = fs.existsSync(rutaPapel) ? JSON.parse(fs.readFileSync(rutaPapel, 'utf8')) : null;
test('papel.json: entre 5 y 10 problemas, con respuesta, pasos y verificación', () => {
  assert.ok(papel, 'falta papel.json');
  assert.ok(papel.titulo && papel.indicacion);
  assert.ok(papel.problemas.length >= 5 && papel.problemas.length <= 10);
  const ids = new Set();
  for (const p of papel.problemas) {
    assert.ok(p.id && !ids.has(p.id)); ids.add(p.id);
    assert.ok(p.enunciado && p.respuesta && Array.isArray(p.pasos) && p.pasos.length, `${p.id}: falta texto`);
    assert.ok(Array.isArray(p.verificar) && p.verificar.length, `${p.id}: falta verificar`);
    assert.ok(!/<[a-z]/i.test(p.enunciado + p.respuesta + p.pasos.join('')), `${p.id}: la app muestra texto plano, sin HTML`);
  }
});
for (const p of (papel && papel.problemas) || []) test(`papel ${p.id}: la respuesta coincide con el motor`, () => {
  for (const v of p.verificar) comprobar(v.fn, v.args, v.espera, p.id);
});
