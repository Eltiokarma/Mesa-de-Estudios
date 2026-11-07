/*
 * Motor de «Imanes, cables y cargas: campo y fuerza magnética».
 *
 * Aquí vive toda la física de la plantilla (regla 1 de CLAUDE.md). No toca el DOM: funciona igual en el
 * navegador (window.MotorMagnetismo) y en Node (require('./motor.js')), donde lo prueban casos.json y papel.json.
 *
 * Unidades (todo en SI): cargas q en C con su signo (protón +1,6 × 10⁻¹⁹ C, electrón −1,6 × 10⁻¹⁹ C), masas en kg,
 * velocidades en m/s, campo magnético B en T, corrientes I en A, distancias, radios y largos en m, fuerzas en N,
 * fuerza por unidad de largo en N/m, tiempos en s, frecuencia en Hz, ω en rad/s, ángulos en grados.
 * μ₀ = 4π × 10⁻⁷ T·m/A, así que μ₀/(2π) = 2 × 10⁻⁷ exacto. Masas redondas de academia: protón 1,6 × 10⁻²⁷ kg (para que
 * las cuentas salgan limpias; el valor real es 1,67 × 10⁻²⁷) y electrón 9,1 × 10⁻³¹ kg.
 * Ejes: x a la derecha, y hacia arriba, z sale de la pantalla (⊙); −z entra (⊗). Un vector es { x, y, z } (z puede
 * faltar: vale 0). Un hilo largo perpendicular a la pantalla es { I, x, y }: I > 0 sale (⊙), I < 0 entra (⊗).
 * Senos de academia: sen 37° = 3/5, sen 53° = 4/5, sen 30° = 1/2 (y sus suplementos), exactos (senGrados, cosGrados).
 * Lo que da "Pi" (Bpi) es el coeficiente de π: B = Bpi · π.
 *
 *   cruz(a, b), punto(a, b), anguloEntre(a, b)   producto vectorial, escalar y ángulo entre vectores (grados, 0 a 180)
 *   vectorAngulo(modulo, grados)       vector en el plano xy a 'grados' del eje x, con los senos de academia
 *   fuerzaCarga(q, v, B)               F = q·v×B (N, vector 3D): módulo |q|vB sen θ, θ entre v y B, hacia dónde va;
 *                                      cero si la carga está quieta o si v es paralela (o contraria) a B
 *   fuerzaModulo(q, v, B, theta)       el módulo |q|·v·B·sen θ con v (m/s), B (T) y θ (grados) sueltos
 *   movimientoCircular(q, m, v, B, theta)  carga con v ⊥ B (o a θ de B): radio r = m·v⊥/(|q|B) en m, periodo
 *                                      T = 2πm/(|q|B) en s (no depende de v), Tpi = T/π, f, ω, F, a centrípeta y,
 *                                      si θ ≠ 90°, el paso de la hélice (m)
 *   cambioVelocidad(q, m, v, B, f)     radio y periodo cuando la rapidez se multiplica por f: r × f, T igual
 *   trayectoria(q, m, v0, Bz, t, p0)   posición (m) y velocidad (m/s) en el instante t (s) de una carga que se mueve en
 *                                      el plano xy con B = Bz·ẑ (solución exacta, sin integrar); centro y sentido de giro
 *   trayectoriaPuntos(q, m, v0, Bz, tFin, n, p0)  n + 1 puntos de la trayectoria, para dibujarla
 *   campoHilo(I, d)                    B de un hilo largo a d metros: 2 × 10⁻⁷ · |I| / d (T); baja con 1/d
 *   cambioDistanciaHilo(I, d, f)       el campo del hilo cuando la distancia se multiplica por f: B / f
 *   campoHilos(hilos, punto)           B (vector, T) en un punto por superposición: cada hilo da vueltas a su alrededor
 *                                      (regla de la mano derecha: antihorario si sale, horario si entra)
 *   puntoMedio(I1, I2, d)              B en el punto medio entre dos hilos paralelos separados d: con corrientes
 *                                      opuestas los campos se suman; con iguales, se restan
 *   brujula(hilos, punto, Btierra)     hacia dónde apunta el norte de una brújula (grados): el campo total
 *   espira(I, R, N)                    B en el centro de una espira (o N espiras juntas) de radio R: μ₀NI/(2R) (T)
 *   solenoide(I, n)                    B dentro de un solenoide largo con n espiras por metro: μ₀·n·I (T)
 *   solenoideNL(I, N, L)               lo mismo con N espiras en L metros (n = N/L)
 *   cambioSolenoide(I, n, f)           el campo del solenoide cuando n se multiplica por f
 *   fuerzaConductor(I, L, B, theta)    F = B·I·L·sen θ (N) sobre un tramo recto de L metros a θ grados de B
 *   fuerzaConductorVector(I, L, B)     F = I·L×B (N, vector) con L = vector del tramo en el sentido de la corriente
 *   cambioAnguloConductor(I, L, B, t0, t1)  la fuerza al girar el conductor de t0 a t1 grados respecto de B
 *   cablesParalelos(I1, I2, d, L)      fuerza por unidad de largo 2 × 10⁻⁷ · |I1·I2| / d (N/m), LA MISMA sobre cada
 *                                      cable; con L (m), la fuerza total. Mismo sentido (I1·I2 > 0): se atraen;
 *                                      opuestos: se repelen. I con signo: el mismo signo es el mismo sentido
 *   campoIman(iman, punto)             campo de un imán de barra en el plano (modelo de dos polos), en T si se da
 *                                      iman.B0 = campo a una distancia iman.a del polo norte sobre su eje
 *   lineasIman(iman, n, caja)          líneas de campo del imán (salen del norte, entran al sur), para dibujarlas
 *   mapaHilos(hilos, caja, n)          flechitas del campo de los hilos en una cuadrícula, con intensidad relativa
 *
 * Cada resultado que alimenta una predicción trae un campo 'errores' con lo que da cada error típico (códigos de
 * docs/investigacion/electromagnetismo-moderna-ideas-erroneas.md: MG1 a MG6 y EL9; los demás son hipótesis nuestras):
 *   fuerzaCarga.errores:
 *     comoElCampo     MG2: la fuerza va en la dirección del campo: q·v·|B|·B̂ (vector). Con v contraria a B, frena.
 *     manoInvertida   regla de la mano derecha con dedos y pulgar cambiados: −F (vector).
 *     sinSigno        olvidar el signo de la carga (electrón): |q|·v×B (vector).
 *     enDireccionDeV  «la fuerza empuja hacia donde va la carga»: |q|vB·v̂ (vector).
 *     sinSeno         olvidar sen θ: |q|·v·B (módulo).
 *     anguloConHorizontal  MG3: usar el ángulo de v con el eje x (la horizontal) en vez del ángulo con B (módulo).
 *     imanEmpuja      MG1 y EL9: «el imán empuja a la carga aunque esté quieta» (verdadero si v = 0 y B ≠ 0).
 *   fuerzaModulo.errores: sinSeno = |q|vB; conCoseno = |q|vB·cos θ (MG3: el ángulo complementario).
 *   movimientoCircular.errores: radioSinMasa = v/(|q|B) (olvidar m); radioAlReves = |q|B/(m·v) (fórmula invertida).
 *   cambioVelocidad.errores: periodoCrece (T × f, «más rápido, vuelta más larga»), periodoBaja (T / f, «más rápido,
 *     vuelta más corta»), radioIgual (r sin cambio), radioCuadrado (r × f²).
 *   campoHilo.errores: unoSobreD2 = 2 × 10⁻⁷·|I|/d² (1/d² como Coulomb), comoEspira = μ₀|I|/(2d) (la fórmula de la
 *     espira), sinDosPi = μ₀|I|/d (olvidar el 2π).
 *   cambioDistanciaHilo.errores: cuadrado (B/f²), sinCambio (B), alReves (B·f).
 *   puntoMedio.errores: seAnulan = 0 (MG5: «dos efectos opuestos se cancelan»); distanciaEntreCables = el resultado
 *     usando d (y no d/2) para cada hilo; unoSobreD2 = con 1/d² en cada hilo; alReves = el resultado del otro caso
 *     (sumar si son iguales, restar si son opuestas).
 *   espira.errores: comoHilo = 2 × 10⁻⁷·N|I|/R; sinMedio = μ₀N|I|/R.
 *   cambioSolenoide.errores: sinCambio, mitad, cuadrado (B × f²).
 *   fuerzaConductor.errores: sinSeno = BIL; conCoseno = BIL·cos θ.
 *   cambioAnguloConductor.errores: sinCambio (F en t0), conCoseno (BIL cos t1), cero (0: «solo hay fuerza a 90°»).
 *   cablesParalelos.errores: masCorrienteMas (MG6: razón F sobre el de menor corriente / F sobre el de mayor que
 *     predice «el cable con más corriente empuja más» = |I mayor|/|I menor|; lo correcto es razon = 1);
 *     tipoAlReves (MG4: «corrientes opuestas se atraen, como cargas opuestas»: el tipo contrario);
 *     unoSobreD2 = 2 × 10⁻⁷·|I1·I2|/d².
 */
(function (root, fabrica) {
  const motor = fabrica();
  if (typeof module === 'object' && module.exports) module.exports = motor;
  else root.MotorMagnetismo = motor;
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  const MU0 = 4 * Math.PI * 1e-7;   // T·m/A
  const KM = 2e-7;                   // μ₀/(2π), exacto
  const E_CARGA = 1.6e-19;           // C
  const M_PROTON = 1.6e-27;          // kg (redondo de academia)
  const M_ELECTRON = 9.1e-31;        // kg
  const TOL = 1e-9;
  const GRADOS = 180 / Math.PI;

  function numero(x, que) {
    if (typeof x !== 'number' || !Number.isFinite(x)) throw new Error(`${que} debe ser un número`);
    return x;
  }
  function positivo(x, que) {
    numero(x, que);
    if (!(x > 0)) throw new Error(`${que} debe ser mayor que cero`);
    return x;
  }
  function noCero(x, que) {
    numero(x, que);
    if (x === 0) throw new Error(`${que} debe ser distinta de cero`);
    return x;
  }
  // Redondea a 12 cifras significativas (1,2000000000000002 → 1,2) para mostrar y comparar.
  const limpio = x => (x === 0 ? 0 : Number(x.toPrecision(12)) + 0);
  function vec(v, que) {
    if (!v || typeof v !== 'object') throw new Error(`${que} debe ser un vector { x, y, z }`);
    const z = v.z === undefined ? 0 : v.z;
    numero(v.x, `${que} (x)`); numero(v.y, `${que} (y)`); numero(z, `${que} (z)`);
    return { x: v.x, y: v.y, z };
  }
  const mod = v => Math.hypot(v.x, v.y, v.z || 0);
  const esc = (v, k) => ({ x: v.x * k, y: v.y * k, z: (v.z || 0) * k });
  const vLimpio = v => ({ x: limpio(v.x), y: limpio(v.y), z: limpio(v.z || 0) });
  function cruz(a, b) {
    a = vec(a, 'el primer vector'); b = vec(b, 'el segundo vector');
    return { x: a.y * b.z - a.z * b.y, y: a.z * b.x - a.x * b.z, z: a.x * b.y - a.y * b.x };
  }
  function punto(a, b) { a = vec(a, 'el primer vector'); b = vec(b, 'el segundo vector'); return a.x * b.x + a.y * b.y + a.z * b.z; }
  function anguloEntre(a, b) {
    const ma = mod(vec(a, 'el primer vector')), mb = mod(vec(b, 'el segundo vector'));
    if (!ma || !mb) throw new Error('los dos vectores deben ser distintos de cero');
    const c = Math.max(-1, Math.min(1, punto(a, b) / (ma * mb)));
    return limpio(Math.acos(c) * GRADOS);
  }

  // Senos de academia exactos (37° y 53° como 3/5 y 4/5); los demás ángulos, con Math.sin.
  const NOTABLES = { 0: 0, 30: 0.5, 37: 0.6, 53: 0.8, 60: Math.sqrt(3) / 2, 45: Math.SQRT1_2, 90: 1 };
  function senGrados(t) {
    numero(t, 'el ángulo');
    let a = ((t % 360) + 360) % 360, s = 1;
    if (a > 180) { a -= 180; s = -1; }
    if (a > 90) a = 180 - a;
    const n = NOTABLES[Math.round(a * 1e9) / 1e9];
    return n === undefined ? s * Math.sin(a / GRADOS) : s * n;
  }
  const cosGrados = t => senGrados(90 - t);
  function vectorAngulo(m, t) { numero(m, 'el módulo'); return { x: limpio(m * cosGrados(t)), y: limpio(m * senGrados(t)), z: 0 }; }

  // Nombre de la dirección de un vector (el eje que más pesa), en palabras de la escena.
  function sentido(v) {
    const ax = Math.abs(v.x), ay = Math.abs(v.y), az = Math.abs(v.z || 0), m = Math.max(ax, ay, az);
    if (m === 0) return 'ninguno';
    if (m === ax) return v.x > 0 ? 'derecha' : 'izquierda';
    if (m === ay) return v.y > 0 ? 'arriba' : 'abajo';
    return v.z > 0 ? 'sale' : 'entra';
  }

  // ---------- Fuerza sobre una carga que se mueve ----------
  function fuerzaCarga(q, v, B) {
    numero(q, 'la carga q'); v = vec(v, 'la velocidad v'); B = vec(B, 'el campo B');
    const mv = mod(v), mB = mod(B);
    let F = esc(cruz(v, B), q);
    const escala = Math.abs(q) * mv * mB;
    if (mod(F) <= TOL * escala) F = { x: 0, y: 0, z: 0 };
    const sen = mv && mB ? Math.min(1, mod(cruz(v, B)) / (mv * mB)) : 0;
    const theta = mv && mB ? anguloEntre(v, B) : null;
    const Fl = vLimpio(F), m = limpio(mod(F));
    const alfaH = mv ? Math.acos(Math.max(-1, Math.min(1, Math.abs(v.x) / mv))) : 0;   // ángulo de v con la horizontal (eje x)
    const Bhat = mB ? esc(B, 1 / mB) : { x: 0, y: 0, z: 0 }, vhat = mv ? esc(v, 1 / mv) : { x: 0, y: 0, z: 0 };
    return {
      F: Fl, modulo: m, theta, sen: limpio(sen), sentido: sentido(Fl),
      quieta: mv === 0, paralela: mv > 0 && mB > 0 && m === 0,
      // F es perpendicular a v y a B (el trabajo de F es cero: la rapidez no cambia)
      perpendicular: Math.abs(punto(F, v)) <= TOL * Math.max(1e-300, m * mv) && Math.abs(punto(F, B)) <= TOL * Math.max(1e-300, m * mB),
      errores: {
        comoElCampo: vLimpio(esc(Bhat, q * mv * mB)),                     // MG2
        manoInvertida: vLimpio(esc(F, -1)),                               // dedos y pulgar cambiados
        sinSigno: vLimpio(esc(cruz(v, B), Math.abs(q))),                  // olvidar el signo (electrón)
        enDireccionDeV: vLimpio(esc(vhat, escala)),                       // «empuja hacia donde va»
        sinSeno: limpio(escala),                                          // olvidar sen θ
        anguloConHorizontal: limpio(escala * Math.sin(alfaH)),            // MG3
        imanEmpuja: mv === 0 && mB > 0,                                   // MG1, EL9
      },
    };
  }
  function fuerzaModulo(q, v, B, theta) {
    numero(q, 'la carga q'); numero(v, 'la rapidez v'); numero(B, 'el campo B'); numero(theta, 'el ángulo θ');
    const base = Math.abs(q) * Math.abs(v) * Math.abs(B);
    return {
      F: limpio(base * Math.abs(senGrados(theta))), sen: limpio(senGrados(theta)),
      errores: { sinSeno: limpio(base), conCoseno: limpio(base * Math.abs(cosGrados(theta))) },
    };
  }

  // ---------- Movimiento circular ----------
  function movimientoCircular(q, m, v, B, theta) {
    noCero(q, 'la carga q'); positivo(m, 'la masa m'); positivo(v, 'la rapidez v'); positivo(B, 'el campo B');
    const t = theta === undefined ? 90 : numero(theta, 'el ángulo θ');
    const vp = v * Math.abs(senGrados(t)), vl = v * cosGrados(t);
    if (vp === 0) throw new Error('si v es paralela a B no hay fuerza: la carga sigue en línea recta');
    const aq = Math.abs(q);
    const T = 2 * Math.PI * m / (aq * B);
    const r = m * vp / (aq * B);
    const res = {
      r: limpio(r), T: limpio(T), Tpi: limpio(2 * m / (aq * B)), f: limpio(1 / T), omega: limpio(aq * B / m),
      F: limpio(aq * vp * B), a: limpio(aq * vp * B / m), vPerp: limpio(vp), vParalela: limpio(vl),
      errores: { radioSinMasa: limpio(vp / (aq * B)), radioAlReves: limpio(aq * B / (m * vp)) },
    };
    if (t !== 90) res.paso = limpio(Math.abs(vl) * T);
    return res;
  }
  function cambioVelocidad(q, m, v, B, f) {
    positivo(f, 'el factor');
    const a = movimientoCircular(q, m, v, B), b = movimientoCircular(q, m, v * f, B);
    return {
      r0: a.r, r1: b.r, T0: a.T, T1: b.T, Tpi0: a.Tpi, Tpi1: b.Tpi, razonR: limpio(f), razonT: 1,
      errores: { periodoCrece: limpio(a.T * f), periodoBaja: limpio(a.T / f), radioIgual: a.r, radioCuadrado: limpio(a.r * f * f) },
    };
  }
  // Movimiento en el plano xy con B = Bz·ẑ. Con w = vx + i·vy: dw/dt = −iω·w, ω = q·Bz/m, así que
  // w(t) = w0·e^(−iωt) y z(t) = z0 + (i·w0/ω)(e^(−iωt) − 1). ω > 0: giro horario; ω < 0: antihorario.
  function trayectoria(q, m, v0, Bz, t, p0) {
    noCero(q, 'la carga q'); positivo(m, 'la masa m'); v0 = vec(v0, 'la velocidad v0'); numero(Bz, 'el campo Bz'); numero(t, 'el tiempo t');
    const P = p0 ? vec(p0, 'el punto de partida') : { x: 0, y: 0, z: 0 };
    if (v0.z) throw new Error('la velocidad debe estar en el plano xy');
    if (Bz === 0) return { x: limpio(P.x + v0.x * t), y: limpio(P.y + v0.y * t), vx: v0.x, vy: v0.y, centro: null, sentido: 'recta' };
    const w = q * Bz / m, c = Math.cos(w * t), s = Math.sin(w * t);
    // e^(−iωt) = c − i·s
    const vx = v0.x * c + v0.y * s, vy = v0.y * c - v0.x * s;
    // (i·w0/ω)(e − 1): i·w0 = −vy0 + i·vx0
    const ax = -v0.y / w, ay = v0.x / w, ex = c - 1, ey = -s;
    const x = P.x + ax * ex - ay * ey, y = P.y + ax * ey + ay * ex;
    // lo que es cero salvo el redondeo (1e-12 del radio o de la rapidez) se deja en cero
    const R = Math.hypot(ax, ay), v = Math.hypot(v0.x, v0.y), z = (a, s) => (Math.abs(a) <= 1e-12 * s ? 0 : limpio(a));
    return {
      x: z(x, R + Math.abs(P.x)), y: z(y, R + Math.abs(P.y)), vx: z(vx, v), vy: z(vy, v),
      centro: { x: limpio(P.x - ax), y: limpio(P.y - ay) },
      sentido: w > 0 ? 'horario' : 'antihorario',
    };
  }
  function trayectoriaPuntos(q, m, v0, Bz, tFin, n, p0) {
    const N = n || 60, pts = [];
    for (let k = 0; k <= N; k++) { const r = trayectoria(q, m, v0, Bz, tFin * k / N, p0); pts.push({ x: r.x, y: r.y }); }
    return pts;
  }

  // ---------- Campo de corrientes ----------
  function campoHilo(I, d) {
    noCero(I, 'la corriente I'); positivo(d, 'la distancia d');
    const a = Math.abs(I);
    return {
      B: limpio(KM * a / d),
      errores: { unoSobreD2: limpio(KM * a / (d * d)), comoEspira: limpio(MU0 * a / (2 * d)), sinDosPi: limpio(MU0 * a / d) },
    };
  }
  function cambioDistanciaHilo(I, d, f) {
    positivo(f, 'el factor');
    const a = campoHilo(I, d), b = campoHilo(I, d * f);
    return { B0: a.B, B1: b.B, d1: limpio(d * f), razon: limpio(1 / f),
      errores: { cuadrado: limpio(a.B / (f * f)), sinCambio: a.B, alReves: limpio(a.B * f) } };
  }
  function hilo(h, k) {
    if (!h || typeof h !== 'object') throw new Error(`el hilo ${k + 1} debe ser { I, x, y }`);
    noCero(h.I, `la corriente del hilo ${k + 1}`); numero(h.x, `el hilo ${k + 1} (x)`); numero(h.y, `el hilo ${k + 1} (y)`);
    return { I: h.I, x: h.x, y: h.y };
  }
  function listaHilos(hs) {
    if (!Array.isArray(hs) || !hs.length) throw new Error('hace falta una lista de hilos');
    return hs.map(hilo);
  }
  function punto2(p) {
    let x, y;
    if (Array.isArray(p)) { x = p[0]; y = p[1]; } else if (p && typeof p === 'object') { x = p.x; y = p.y; }
    numero(x, 'el punto (x)'); numero(y, 'el punto (y)');
    return { x, y };
  }
  // B de un hilo en P: 2 × 10⁻⁷·I/d en la dirección ẑ × r̂ (con el signo de I): da vueltas alrededor del hilo.
  function parteHilo(h, P) {
    const dx = P.x - h.x, dy = P.y - h.y, d = Math.hypot(dx, dy);
    if (d < 1e-12) throw new Error('el punto no puede estar sobre un hilo');
    const k = KM * h.I / (d * d);
    return { x: -dy * k, y: dx * k, modulo: Math.abs(KM * h.I / d), d };
  }
  function campoHilos(hilos, p) {
    const hs = listaHilos(hilos), P = punto2(p);
    const partes = hs.map(h => parteHilo(h, P));
    let x = 0, y = 0; for (const q of partes) { x += q.x; y += q.y; }
    const e = Math.max(...partes.map(q => q.modulo));
    if (Math.hypot(x, y) <= TOL * e) { x = 0; y = 0; }
    const m = limpio(Math.hypot(x, y)), ms = partes.map(q => q.modulo).sort((a, b) => b - a);
    const ang = a => { const t = Math.atan2(a.y, a.x) * GRADOS; return limpio(t < 0 ? t + 360 : t); };
    return {
      x: limpio(x), y: limpio(y), modulo: m, angulo: m ? ang({ x, y }) : 0,
      partes: partes.map(q => ({ x: limpio(q.x), y: limpio(q.y), modulo: limpio(q.modulo), d: limpio(q.d), angulo: ang(q) })),
      errores: { sumaModulos: limpio(ms.reduce((s, q) => s + q, 0)), restaModulos: limpio(Math.abs(ms[0] - ms.slice(1).reduce((s, q) => s + q, 0))) },
    };
  }
  function puntoMedio(I1, I2, d) {
    noCero(I1, 'I1'); noCero(I2, 'I2'); positivo(d, 'la distancia d');
    const hs = [{ I: I1, x: -d / 2, y: 0 }, { I: I2, x: d / 2, y: 0 }];
    const r = campoHilos(hs, { x: 0, y: 0 });
    const opuestas = I1 * I2 < 0, a = Math.abs(I1), b = Math.abs(I2);
    const comb = (k1, k2, sumar) => limpio(sumar ? k1 + k2 : Math.abs(k1 - k2));
    return {
      B: r.modulo, Bx: r.x, By: r.y, sentido: r.modulo ? (r.y > 0 ? 'arriba' : 'abajo') : 'ninguno',
      B1: r.partes[0].modulo, B2: r.partes[1].modulo, seSuman: opuestas,
      errores: {
        seAnulan: 0,                                                                      // MG5
        distanciaEntreCables: comb(KM * a / d, KM * b / d, opuestas),                     // d en vez de d/2
        unoSobreD2: comb(KM * a / (d * d / 4), KM * b / (d * d / 4), opuestas),           // 1/d²
        alReves: comb(KM * a / (d / 2), KM * b / (d / 2), !opuestas),                     // sumar y restar cambiados
      },
    };
  }
  function brujula(hilos, p, Bt) {
    const r = campoHilos(hilos, p);
    let x = r.x, y = r.y;
    if (Bt) { const t = vec(Bt, 'el campo de la Tierra'); x += t.x; y += t.y; }
    if (Math.hypot(x, y) === 0) return { angulo: null, B: 0 };
    const a = Math.atan2(y, x) * GRADOS;
    return { angulo: limpio(a < 0 ? a + 360 : a), B: limpio(Math.hypot(x, y)) };
  }
  function espira(I, R, N) {
    noCero(I, 'la corriente I'); positivo(R, 'el radio R');
    const n = N === undefined ? 1 : positivo(N, 'el número de espiras N'), a = Math.abs(I);
    return {
      B: limpio(MU0 * n * a / (2 * R)), Bpi: limpio(2e-7 * n * a / R),
      sentido: I > 0 ? 'sale' : 'entra',        // corriente antihoraria (vista de frente): B sale en el centro
      errores: { comoHilo: limpio(KM * n * a / R), sinMedio: limpio(MU0 * n * a / R) },
    };
  }
  function solenoide(I, n) {
    noCero(I, 'la corriente I'); positivo(n, 'las espiras por metro n');
    const a = Math.abs(I);
    return { B: limpio(MU0 * n * a), Bpi: limpio(4e-7 * n * a), n };
  }
  function solenoideNL(I, N, L) { positivo(N, 'el número de espiras N'); positivo(L, 'el largo L'); return solenoide(I, N / L); }
  function cambioSolenoide(I, n, f) {
    positivo(f, 'el factor');
    const a = solenoide(I, n), b = solenoide(I, n * f);
    return { B0: a.B, B1: b.B, Bpi0: a.Bpi, Bpi1: b.Bpi, razon: limpio(f),
      errores: { sinCambio: a.Bpi, mitad: limpio(a.Bpi / f), cuadrado: limpio(a.Bpi * f * f) } };
  }

  // ---------- Fuerza sobre conductores ----------
  function fuerzaConductor(I, L, B, theta) {
    numero(I, 'la corriente I'); positivo(L, 'el largo L'); numero(B, 'el campo B');
    const t = theta === undefined ? 90 : numero(theta, 'el ángulo θ');
    const base = Math.abs(I) * L * Math.abs(B);
    return { F: limpio(base * Math.abs(senGrados(t))), sen: limpio(Math.abs(senGrados(t))),
      errores: { sinSeno: limpio(base), conCoseno: limpio(base * Math.abs(cosGrados(t))) } };
  }
  function fuerzaConductorVector(I, L, B) {
    numero(I, 'la corriente I');
    const F = esc(cruz(L, B), I), Fl = vLimpio(F);
    return { F: Fl, modulo: limpio(mod(F)), sentido: sentido(Fl), theta: mod(vec(L, 'L')) && mod(vec(B, 'B')) ? anguloEntre(L, B) : null };
  }
  function cambioAnguloConductor(I, L, B, t0, t1) {
    const a = fuerzaConductor(I, L, B, t0), b = fuerzaConductor(I, L, B, t1);
    return { F0: a.F, F1: b.F, razon: a.F ? limpio(b.F / a.F) : null,
      errores: { sinCambio: a.F, conCoseno: b.errores.conCoseno, cero: 0 } };
  }
  function cablesParalelos(I1, I2, d, L) {
    noCero(I1, 'I1'); noCero(I2, 'I2'); positivo(d, 'la distancia d');
    const largo = L === undefined ? 1 : positivo(L, 'el largo L');
    const a = Math.abs(I1), b = Math.abs(I2), pl = KM * a * b / d;
    const tipo = I1 * I2 > 0 ? 'atraccion' : 'repulsion';
    return {
      porLargo: limpio(pl), F: limpio(pl * largo), sobre1: limpio(pl * largo), sobre2: limpio(pl * largo), razon: 1, tipo,
      // campo de cada cable donde está el otro: distintos; F = I·L·B sale igual en los dos
      B1en2: limpio(KM * a / d), B2en1: limpio(KM * b / d),
      errores: {
        masCorrienteMas: limpio(Math.max(a, b) / Math.min(a, b)),       // MG6
        tipoAlReves: tipo === 'atraccion' ? 'repulsion' : 'atraccion',  // MG4
        unoSobreD2: limpio(KM * a * b / (d * d) * largo),
      },
    };
  }

  // ---------- Imán de barra (para dibujar y para el paso 1) ----------
  // iman = { x, y, largo, ang (grados, del sur al norte), B0, a }: polo norte en la punta del lado 'ang'. Modelo de dos
  // polos: B ∝ r̂N/rN² − r̂S/rS². Si se da B0, el campo se escala para valer B0 a la distancia a del norte sobre el eje.
  function polos(im) {
    const L = im.largo || 0.2, t = (im.ang || 0) / GRADOS, ux = Math.cos(t), uy = Math.sin(t);
    return { N: { x: im.x + ux * L / 2, y: im.y + uy * L / 2 }, S: { x: im.x - ux * L / 2, y: im.y - uy * L / 2 }, ux, uy, L };
  }
  function campoImanCrudo(pl, P) {
    let x = 0, y = 0;
    for (const [Q, s] of [[pl.N, 1], [pl.S, -1]]) {
      const dx = P.x - Q.x, dy = P.y - Q.y, r = Math.hypot(dx, dy);
      if (r < 1e-9) return null;
      x += s * dx / (r * r * r); y += s * dy / (r * r * r);
    }
    return { x, y };
  }
  function campoIman(im, p) {
    if (!im || typeof im !== 'object') throw new Error('falta el imán { x, y, largo, ang }');
    numero(im.x, 'el imán (x)'); numero(im.y, 'el imán (y)');
    const pl = polos(im), P = punto2(p), c = campoImanCrudo(pl, P);
    if (!c) throw new Error('el punto no puede estar sobre un polo');
    let k = 1;
    if (im.B0 !== undefined) {
      const a = im.a || 0.05, ref = campoImanCrudo(pl, { x: pl.N.x + pl.ux * a, y: pl.N.y + pl.uy * a });
      k = im.B0 / Math.hypot(ref.x, ref.y);
    }
    const x = c.x * k, y = c.y * k;
    return { x: limpio(x), y: limpio(y), z: 0, modulo: limpio(Math.hypot(x, y)) };
  }
  function lineasIman(im, n, caja) {
    const pl = polos(im), N = n || 10, lineas = [];
    const r0 = Math.max(0.004, pl.L * 0.04), h = pl.L * 0.012;
    const dentro = P => !caja || (P.x > caja.x0 && P.x < caja.x1 && P.y > caja.y0 && P.y < caja.y1);
    for (let k = 0; k < N; k++) {
      // salen del norte hacia afuera, repartidas en un abanico (sin la que va por dentro del imán)
      const a = Math.atan2(pl.uy, pl.ux) + (k + 0.5) / N * 2 * Math.PI;
      let P = { x: pl.N.x + r0 * Math.cos(a), y: pl.N.y + r0 * Math.sin(a) };
      if ((P.x - pl.N.x) * pl.ux + (P.y - pl.N.y) * pl.uy < -r0 * 0.7) continue;
      const pts = [P];
      for (let j = 0; j < 900; j++) {
        const f = c => { const b = campoImanCrudo(pl, c); if (!b) return null; const m = Math.hypot(b.x, b.y); return { x: b.x / m, y: b.y / m }; };
        const d1 = f(P); if (!d1) break;
        const M = { x: P.x + d1.x * h / 2, y: P.y + d1.y * h / 2 }, d2 = f(M); if (!d2) break;
        P = { x: P.x + d2.x * h, y: P.y + d2.y * h };
        pts.push(P);
        if (Math.hypot(P.x - pl.S.x, P.y - pl.S.y) < r0 || !dentro(P)) break;
      }
      lineas.push(pts.map(q => ({ x: limpio(q.x), y: limpio(q.y) })));
    }
    return lineas;
  }
  function mapaHilos(hilos, caja, n, o) {
    const hs = listaHilos(hilos); o = o || {};
    if (!caja || !(caja.x1 > caja.x0) || !(caja.y1 > caja.y0)) throw new Error('la caja debe tener x0 < x1 e y0 < y1');
    const N = n === undefined ? 12 : n, paso = (caja.x1 - caja.x0) / N, evitar = o.evitar === undefined ? paso * 0.6 : o.evitar;
    const pts = [];
    for (let y = caja.y0 + paso / 2; y < caja.y1; y += paso)
      for (let x = caja.x0 + paso / 2; x < caja.x1; x += paso) {
        if (hs.some(h => Math.hypot(x - h.x, y - h.y) < evitar)) continue;
        const B = campoHilos(hs, { x, y });
        pts.push({ x: limpio(x), y: limpio(y), Bx: B.x, By: B.y, modulo: B.modulo, ux: B.modulo ? B.x / B.modulo : 0, uy: B.modulo ? B.y / B.modulo : 0 });
      }
    const logs = pts.filter(p => p.modulo > 0).map(p => Math.log10(p.modulo));
    const hi = logs.length ? Math.max(...logs) : 0, lo = hi - (o.decadas || 1.5);
    for (const p of pts) p.nivel = p.modulo > 0 ? Math.max(0, Math.min(1, (Math.log10(p.modulo) - lo) / (hi - lo))) : 0;
    return { paso: limpio(paso), puntos: pts };
  }

  // Azar con semilla (pruebas).
  function azar(sem) { let s = (sem >>> 0) || 1; return () => (s = (Math.imul(s, 1664525) + 1013904223) >>> 0) / 4294967296; }

  return {
    MU0, KM, E_CARGA, M_PROTON, M_ELECTRON, TOL,
    cruz, punto, anguloEntre, senGrados, cosGrados, vectorAngulo, sentido,
    fuerzaCarga, fuerzaModulo, movimientoCircular, cambioVelocidad, trayectoria, trayectoriaPuntos,
    campoHilo, cambioDistanciaHilo, campoHilos, puntoMedio, brujula, espira, solenoide, solenoideNL, cambioSolenoide,
    fuerzaConductor, fuerzaConductorVector, cambioAnguloConductor, cablesParalelos,
    campoIman, lineasIman, mapaHilos, azar,
  };
});
