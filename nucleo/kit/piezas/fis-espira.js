/*
 * Pieza «fis-espira» (física, inducción electromagnética): tres montajes de la inducción con el trazo del kit.
 *   modo 'iman'           un imán a la izquierda y una espira vista de canto (sus dos cortes con ⊙ y ⊗)
 *   modo 'barra'          dos rieles con un foco, una barra que se desliza y la región de campo (⊗ o ⊙)
 *   modo 'transformador'  núcleo de hierro con dos bobinas de Np y Ns vueltas
 *
 * Afirmación de la figura: la corriente inducida aparece solo mientras el flujo cambia, y circula para oponerse
 * a ese cambio.
 *
 * Fidelidad: en 'barra' la regla de los rieles va en metros (una sola escala); la barra cae sobre su metro y el área
 * sombreada es la del circuito. El largo de las flechas de v solo dice el sentido. En 'iman', la cantidad de líneas
 * de campo que atraviesan la espira crece al acercar el imán (cualitativo, se declara en el alt).
 *
 * datos = {
 *   modo: 'iman' | 'barra' | 'transformador',
 *   colores: { B: 'i', v: 'o', I: 'h', e: 'd', Bi: 'd' },  // tokens de la unidad (regla 4); otro texto = tinta
 *   // iman
 *   iman: { x: 0..1, polo: 'N'|'S', mueve: 'acerca'|'aleja'|'quieto' },  // x: 0 lejos, 1 junto a la espira
 *   corriente: 'horario' | 'antihorario' | null,   // vista desde el imán (horario: ⊙ arriba, ⊗ abajo)
 *   inducido: 'izq' | 'der' | null,                // sentido del campo de la espira sobre el eje
 *   // barra
 *   barra: { largo: 10, x: 4, l: 0.5, sentido: 'entra'|'sale', v: 2, corriente: 'arriba'|'abajo'|null, brillo: 0..1 },
 *   // transformador
 *   bobinas: { np: 100, ns: 400, vp: '220 V', vs: '880 V', ac: true },
 *   rotulo: 'ε = 0,6 V'                             // texto opcional bajo la figura (lo calcula quien llama)
 * }
 * estado = { paso }: en 'iman' y 'transformador', lo explicado aparece por pasos y se queda (rastro):
 *   iman: 1 líneas de B · 2 campo inducido · 3 corriente; transformador: 1 Vp · 2 Vs. Sin paso, todo a la vista.
 * El dibujo es una función pura de (datos, estado).
 */
(function (root, fabrica) {
  const nodo = typeof module === 'object' && module.exports;
  const Kit = nodo ? require('../kit.js') : root.Kit;
  const T = nodo ? require('../trazo.js') : root.Kit.trazo;
  const api = fabrica(Kit, T);
  Kit.registrar(api);
  if (nodo) module.exports = api;
})(typeof self !== 'undefined' ? self : this, function (Kit, T) {
  'use strict';
  const W = 320, ALTO = 210;
  const BASE = { B: 'i', v: 'o', I: 'h', e: 'd', Bi: 'd' };
  const col = d => Object.assign({}, BASE, d.colores || {});

  // Punto (⊙, sale) o cruz (⊗, entra) en un círculo de radio r.
  function corte(x, y, sale, c, r = 7) {
    let s = `<circle cx="${T.n(x)}" cy="${T.n(y)}" r="${r}" fill="var(--card)" stroke="${T.color(c)}" stroke-width="${T.GROSOR.contorno}"/>`;
    if (sale) s += `<circle cx="${T.n(x)}" cy="${T.n(y)}" r="2.4" fill="${T.color(c)}"/>`;
    else { const k = r * 0.55; s += `<path d="M${T.n(x - k)} ${T.n(y - k)}L${T.n(x + k)} ${T.n(y + k)}M${T.n(x + k)} ${T.n(y - k)}L${T.n(x - k)} ${T.n(y + k)}" stroke="${T.color(c)}" stroke-width="2" stroke-linecap="round"/>`; }
    return s;
  }

  function iman(d, e = {}) {
    const ve = k => !Number.isFinite(e.paso) || e.paso >= k;
    const C = col(d), m = d.iman || {}, xr = Math.min(1, Math.max(0, m.x || 0));
    const EJE = 100, ESP = 236, R = 52;
    let s = T.linea(14, EJE, W - 8, EJE, { grosor: T.GROSOR.cuadricula, discontinua: true, opacidad: 0.6 });
    // Imán: barra de 70 px, su cara derecha entre 120 (lejos) y 196 (cerca).
    const cara = 120 + 76 * xr, x0 = cara - 70, polo = m.polo === 'S' ? 'S' : 'N', otro = polo === 'N' ? 'S' : 'N';
    s += `<g class="fis-iman"><rect x="${T.n(x0)}" y="${EJE - 16}" width="35" height="32" rx="4" fill="var(--card)" stroke="currentColor" stroke-width="2"/>`
      + `<rect x="${T.n(x0 + 35)}" y="${EJE - 16}" width="35" height="32" rx="4" fill="currentColor" fill-opacity="0.18" stroke="currentColor" stroke-width="2"/>`
      + T.rotulo(x0 + 17.5, EJE + 6, otro, { ancla: 'middle', peso: 700 }) + T.rotulo(x0 + 52.5, EJE + 6, polo, { ancla: 'middle', peso: 700 }) + '</g>';
    if (m.mueve === 'acerca' || m.mueve === 'aleja') {
      const sg = m.mueve === 'acerca' ? 1 : -1, y = EJE - 30, xc = x0 + 35;
      s += T.flecha(xc - sg * 18, y, xc + sg * 18, y, { grosor: T.GROSOR.variable, color: C.v });
      s += T.rotulo(xc, y - 10, m.mueve === 'acerca' ? 'se acerca' : 'se aleja', { ancla: 'middle', color: C.v, peso: 700 });
    } else s += T.rotulo(x0 + 35, EJE - 30, 'quieto', { ancla: 'middle', color: C.v, peso: 700 });
    // Líneas de campo del imán que llegan a la espira: más cuanto más cerca (1 a 5), en el color de B.
    const n = ve(1) ? 1 + Math.round(4 * xr) : 0, sale = polo === 'N';
    for (let k = 0; k < n; k++) {
      const dy = n === 1 ? 0 : (k / (n - 1) - 0.5) * 2 * (R - 12);
      const a = sale ? cara + 4 : ESP + 30, b = sale ? ESP + 30 : cara + 4;
      s += `<path d="M${T.n(a)} ${T.n(EJE + dy * 0.25)}Q${T.n((cara + ESP) / 2)} ${T.n(EJE + dy * 0.9)} ${T.n(b)} ${T.n(EJE + dy)}" fill="none" stroke="${T.color(C.B)}" stroke-width="2" stroke-linecap="round" opacity="0.75"/>`;
      const px = sale ? ESP + 30 : cara + 4, py = sale ? EJE + dy : EJE + dy * 0.25;
      s += `<path d="M${T.n(px)} ${T.n(py)}l${sale ? -8 : 8} -4l0 8z" fill="${T.color(C.B)}"/>`;
    }
    if (n) s += T.rotulo(ESP + 34, EJE - R - 8, 'B', { color: C.B, peso: 700 });
    // Espira de canto: elipse con sus dos cortes.
    s += `<ellipse cx="${ESP}" cy="${EJE}" rx="12" ry="${R}" fill="none" stroke="currentColor" stroke-width="2"/>`;
    if ((d.corriente === 'horario' || d.corriente === 'antihorario') && ve(3)) {
      const arriba = d.corriente === 'horario';
      s += corte(ESP, EJE - R, arriba, C.I) + corte(ESP, EJE + R, !arriba, C.I);
      s += T.rotulo(ESP + 12, EJE - R - 10, 'I', { color: C.I, peso: 700 });
    } else s += `<circle cx="${ESP}" cy="${EJE - R}" r="4" fill="currentColor"/><circle cx="${ESP}" cy="${EJE + R}" r="4" fill="currentColor"/>`;
    if ((d.inducido === 'izq' || d.inducido === 'der') && ve(2)) {
      const sg = d.inducido === 'der' ? 1 : -1;
      s += T.flecha(ESP - sg * 22, EJE, ESP + sg * 26, EJE, { grosor: T.GROSOR.variable, color: C.Bi });
      s += T.rotulo(ESP - 44, EJE + 24, 'B ind.', { ancla: 'middle', color: C.Bi, peso: 700 });
    }
    s += T.rotulo(ESP, EJE + R + 30, 'espira (de canto)', { ancla: 'middle', clase: 'kit-txt' });
    return s;
  }

  function barra(d) {
    const C = col(d), b = d.barra || {}, L = b.largo > 0 ? b.largo : 10;
    const X0 = 56, X1 = 300, ARR = 46, ABA = 146, X = x => X0 + (X1 - X0) * x / L;
    const xb = X(Math.min(L, Math.max(0, b.x || 0)));
    let s = '';
    // Región de campo: grilla de ⊗ o ⊙ en tinta clara del color de B.
    for (let gx = X0 + 14; gx < X1; gx += 30) for (let gy = ARR + 18; gy < ABA; gy += 26) {
      s += `<g opacity="0.55">${corte(gx, gy, b.sentido === 'sale', C.B, 5)}</g>`;
    }
    s += T.rotulo(4, 20, `B ${b.sentido === 'sale' ? 'sale (⊙)' : 'entra (⊗)'}`, { color: C.B, peso: 700 });
    // Área del circuito.
    s += `<rect x="${X0}" y="${ARR}" width="${T.n(xb - X0)}" height="${ABA - ARR}" fill="${T.color(C.B)}" fill-opacity="0.12"/>`;
    // Rieles y foco a la izquierda.
    s += T.linea(X0, ARR, X1, ARR, { grosor: T.GROSOR.contorno }) + T.linea(X0, ABA, X1, ABA, { grosor: T.GROSOR.contorno });
    s += T.linea(X0, ARR, X0, 80, { grosor: T.GROSOR.contorno }) + T.linea(X0, 112, X0, ABA, { grosor: T.GROSOR.contorno });
    const br = Math.min(1, Math.max(0, b.brillo || 0));
    s += `<circle cx="${X0}" cy="96" r="14" fill="${br > 0 ? T.color(C.e) : 'var(--card)'}" fill-opacity="${T.n(0.15 + 0.6 * br)}" stroke="currentColor" stroke-width="2"/>`;
    for (let k = 0; k < Math.round(4 * br); k++) { const a = Math.PI * (0.75 + k * 0.17); s += T.linea(X0 + 18 * Math.cos(a), 96 - 18 * Math.sin(a), X0 + 26 * Math.cos(a), 96 - 26 * Math.sin(a), { color: C.e }); }
    // Barra, su flecha de v y la corriente que la recorre.
    s += `<rect x="${T.n(xb - 4)}" y="${ARR - 8}" width="8" height="${ABA - ARR + 16}" rx="3" fill="currentColor"/>`;
    if (Number.isFinite(b.v) && b.v !== 0) {
      const sg = Math.sign(b.v);
      s += T.flecha(xb + sg * 8, ARR - 22, xb + sg * 38, ARR - 22, { grosor: T.GROSOR.variable, color: C.v });
      s += T.rotulo(xb + sg * 44, ARR - 17, 'v', { color: C.v, peso: 700, ancla: sg > 0 ? 'start' : 'end' });
    }
    if (b.corriente === 'arriba' || b.corriente === 'abajo') {
      const sg = b.corriente === 'arriba' ? -1 : 1, xm = xb + 14;
      s += T.flecha(xm, (ARR + ABA) / 2 - sg * 22, xm, (ARR + ABA) / 2 + sg * 22, { grosor: T.GROSOR.variable, color: C.I });
      s += T.rotulo(xm + 6, (ARR + ABA) / 2 + 5, 'I', { color: C.I, peso: 700 });
    }
    // Regla de metros bajo los rieles.
    const RY = ABA + 22, cada = L <= 10 ? 2 : 5;
    let rr = T.linea(X0, RY, X1, RY, { grosor: T.GROSOR.cuadricula });
    for (let m = 0; m <= L + 1e-9; m += cada) rr += T.linea(X(m), RY, X(m), RY + 6, { grosor: T.GROSOR.cuadricula }) + T.rotulo(X(m), RY + 22, Kit.formatear(m, 0), { ancla: 'middle', clase: 'kit-num' });
    s += `<g class="kit-regla">${rr}</g>`;
    if (Number.isFinite(b.l)) s += T.rotulo(xb - 10, (ARR + ABA) / 2 + 5, `ℓ = ${Kit.formatear(b.l, 2)} m`, { ancla: 'end', clase: 'kit-txt' });
    return s;
  }

  function transformador(d, e = {}) {
    const ve = k => !Number.isFinite(e.paso) || e.paso >= k;
    const C = col(d), b = d.bobinas || {};
    let s = `<rect x="112" y="40" width="96" height="120" rx="6" fill="none" stroke="currentColor" stroke-width="14" stroke-opacity="0.25"/>`;
    const bobina = (x, n, c) => {
      const k = Math.max(1, Math.min(12, Math.round(n / (Math.max(b.np || 1, b.ns || 1)) * 12)));
      let t = '';
      for (let i = 0; i < k; i++) { const y = 56 + i * (88 / Math.max(1, k - 1 || 1)); t += `<ellipse cx="${x}" cy="${T.n(k === 1 ? 100 : y)}" rx="16" ry="4" fill="none" stroke="${T.color(c)}" stroke-width="2.5"/>`; }
      return t;
    };
    s += bobina(112, b.np || 1, C.v) + bobina(208, b.ns || 1, C.I);
    s += T.linea(96, 56, 30, 56, { color: C.v }) + T.linea(96, 144, 30, 144, { color: C.v });
    s += T.linea(224, 56, 290, 56, { color: C.I }) + T.linea(224, 144, 290, 144, { color: C.I });
    s += T.rotulo(4, 104, `Np = ${Kit.formatear(b.np || 0, 0)}`, { color: C.v, peso: 700 });
    s += T.rotulo(316, 104, `Ns = ${Kit.formatear(b.ns || 0, 0)}`, { color: C.I, peso: 700, ancla: 'end' });
    if (b.vp && ve(1)) s += T.rotulo(30, 36, b.vp, { color: C.v, peso: 700 });
    if (b.vs && ve(2)) s += T.rotulo(290, 36, b.vs, { color: C.I, peso: 700, ancla: 'end' });
    s += T.rotulo(160, 186, b.ac === false ? 'corriente continua: el flujo no cambia' : 'corriente alterna: el flujo cambia', { ancla: 'middle', clase: 'kit-txt' });
    return s;
  }

  function dibujar(d, estado = {}) {
    const modo = d.modo || 'iman';
    let s = modo === 'barra' ? barra(d) : modo === 'transformador' ? transformador(d, estado) : iman(d, estado);
    if (d.rotulo) s += T.rotulo(W / 2, ALTO - 6, d.rotulo, { ancla: 'middle', peso: 700, color: col(d).e });
    return T.svg(W, ALTO, s, { alt: alt(d) });
  }

  function alt(d) {
    const modo = d.modo || 'iman';
    if (modo === 'barra') {
      const b = d.barra || {};
      return `Barra de ${Kit.formatear(b.l || 0, 2)} m que se desliza sobre dos rieles a ${Kit.formatear(b.v || 0, 1)} m/s en un campo que ${b.sentido === 'sale' ? 'sale' : 'entra'}; el área del circuito ${b.v ? 'cambia' : 'no cambia'}${b.corriente ? `; la corriente sube por la barra hacia ${b.corriente}` : '; no hay corriente'}.`;
    }
    if (modo === 'transformador') {
      const b = d.bobinas || {};
      return `Transformador con ${Kit.formatear(b.np || 0, 0)} vueltas en el primario y ${Kit.formatear(b.ns || 0, 0)} en el secundario${b.vp ? `; entra ${b.vp}` : ''}${b.vs ? ` y sale ${b.vs}` : ''}.`;
    }
    const m = d.iman || {};
    return `Imán con su polo ${m.polo === 'S' ? 'S' : 'N'} hacia una espira; el imán ${m.mueve === 'acerca' ? 'se acerca' : m.mueve === 'aleja' ? 'se aleja' : 'está quieto'}; más líneas de campo cruzan la espira cuanto más cerca está${d.corriente ? `; corriente inducida en sentido ${d.corriente} visto desde el imán` : '; sin corriente inducida'}${d.inducido ? `; el campo de la espira apunta hacia la ${d.inducido === 'izq' ? 'izquierda' : 'derecha'}` : ''}.`;
  }

  return { id: 'fis-espira', dibujar, alt, constantes: { W, ALTO } };
});
