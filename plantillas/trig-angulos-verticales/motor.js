/*
 * Motor del campo con la torre (15 nov 2026, ronda 4 del 3D): una torre vertical en un piso plano y observadores
 * ubicados por su rumbo y su distancia al pie. Lo usan la pieza viva trig-campo-3d (nucleo/kit/piezas/) y las mesas
 * 3D de trigonometria.triangulos-rectangulos y trigonometria.triangulos-oblicuangulos (regla 1: la pieza solo dibuja).
 *
 * Convenciones:
 *   - Acimut az en grados, desde el norte y en el sentido del reloj: 0 norte, 90 este, 180 sur, 270 oeste.
 *   - Coordenadas del piso { este, norte }; la altura va aparte. El pie de la torre es el origen.
 *   - El rumbo se escribe como en el examen: un ángulo de 0° a 90° desde el norte o el sur, hacia el este o el oeste
 *     (N 30° E, S 45° O). Los puntos cardinales exactos se escriben solos: N, E, S, O.
 *
 * API (Node: require; navegador: window.MotorCampo):
 *   rumbo(az) → { texto, desde: 'N'|'S'|'', angulo, hacia: 'E'|'O'|'' }
 *   punto(az, d) → { este, norte }
 *   separacion(az1, az2) → ángulo en el pie entre las dos direcciones, de 0° a 180°
 *   elevacion(h, d, ojo = 0) → ángulo de elevación (grados) de la punta vista desde un ojo a la altura ojo
 *   campo({ h, ojo = 0, obs: [{ id, az, d }] }) →
 *     { h, ojo, obs: [{ id, az, d, este, norte, elev, visual, rumbo }],
 *       pares: [{ de, a, angulo, distancia, cosenos }] }      // distancia por coordenadas; cosenos, por la ley de cosenos
 */
(function (root, fabrica) {
  const motor = fabrica();
  if (typeof module === 'object' && module.exports) module.exports = motor;
  else root.MotorCampo = motor;
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';
  const RAD = Math.PI / 180, GRA = 180 / Math.PI, EPS = 1e-9;
  const norm = az => ((az % 360) + 360) % 360;
  const redondo = x => Math.abs(x - Math.round(x)) < 1e-9 ? Math.round(x) : x;

  function rumbo(az) {
    const a = norm(az);
    const cardinal = { 0: 'N', 90: 'E', 180: 'S', 270: 'O' }[redondo(a)];
    if (cardinal) return { texto: cardinal, desde: '', angulo: 0, hacia: '' };
    const desde = a < 90 || a > 270 ? 'N' : 'S';
    const hacia = a < 180 ? 'E' : 'O';
    const angulo = redondo(desde === 'N' ? (a < 90 ? a : 360 - a) : Math.abs(180 - a));
    const g = Number.isInteger(angulo) ? String(angulo) : String(Math.round(angulo * 10) / 10).replace('.', ',');
    return { texto: `${desde} ${g}° ${hacia}`, desde, angulo, hacia };
  }
  const punto = (az, d) => ({ este: d * Math.sin(az * RAD), norte: d * Math.cos(az * RAD) });
  function separacion(az1, az2) {
    const s = Math.abs(norm(az1) - norm(az2));
    return redondo(s > 180 ? 360 - s : s);
  }
  function elevacion(h, d, ojo = 0) {
    if (!(d > 0)) throw new Error('la distancia al pie debe ser positiva');
    return Math.atan2(h - ojo, d) * GRA;
  }
  function campo(o) {
    const h = Number(o.h), ojo = Number(o.ojo || 0);
    if (!(h > 0)) throw new Error('la torre debe tener altura positiva');
    if (!(ojo >= 0) || ojo >= h) throw new Error('el ojo va entre el piso y la punta');
    const obs = (o.obs || []).map((x, k) => {
      const p = punto(x.az, x.d);
      return { id: x.id || String.fromCharCode(65 + k), az: norm(x.az), d: x.d, este: p.este, norte: p.norte,
        elev: elevacion(h, x.d, ojo), visual: Math.hypot(x.d, h - ojo), rumbo: rumbo(x.az) };
    });
    const pares = [];
    for (let i = 0; i < obs.length; i++) for (let j = i + 1; j < obs.length; j++) {
      const p = obs[i], q = obs[j], ang = separacion(p.az, q.az);
      const c2 = p.d * p.d + q.d * q.d - 2 * p.d * q.d * Math.cos(ang * RAD);
      pares.push({ de: p.id, a: q.id, angulo: ang, distancia: Math.hypot(p.este - q.este, p.norte - q.norte), cosenos: Math.sqrt(Math.max(0, c2)) });
    }
    return { h, ojo, obs, pares };
  }
  return { rumbo, punto, separacion, elevacion, campo, EPS };
});
