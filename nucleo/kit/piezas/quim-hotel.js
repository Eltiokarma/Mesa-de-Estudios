/*
 * Pieza «quim-hotel» (18 nov 2026, etapa 4 de química, Estructura atómica, ideas 3 y 4): el hotel del electrón, una
 * analogía que «Lee» presenta con su dibujo antes del juego (docs/plan-calidad.md, punto 6). Dibujo de prueba
 * (data-prueba; Gerson decide después si lo reemplaza, docs/plan-calidad.md M4).
 *
 * Afirmación de la figura: el átomo es un edificio de pisos (niveles n); cada piso tiene un pasillo más que el de abajo
 * (subniveles s, p, d, f); cada pasillo, cuartos dobles (orbitales), y en cada cuarto caben dos huéspedes (electrones,
 * con su flecha de espín). Con `precios`, la puerta de cada pasillo dice cuánto cuesta entrar: n + ℓ, en soles.
 *
 * Reusa la geometría de quim-cajas: cada pasillo es una fila de cajas, y las flechas se llenan como dice Hund si la fila
 * no trae `flechas`. Colores del mapa aprobado (docs/etapa4/propuesta-quimica.md §8): los huéspedes (electrones) en
 * violeta 'f'; el edificio, los nombres, los precios y n, ℓ en tinta; sin verde ni paleta de elementos.
 *
 * datos = {
 *   filas: [{ nombre: '3d', e, flechas?, oculto?, tenue?, vacia?, marca?, desde, precio? }],  // el orden no importa: se agrupan
 *          // por piso (n, del nombre) de arriba abajo y, dentro del piso, el ℓ mayor arriba. oculto: la cuenta dice
 *          // «? e⁻»; tenue: el pasillo se ve apagado (todavía no se usa); vacia: sin flechas; precio: '?' para ocultarlo; marca: fondo tenue detrás del pasillo
 *   precios: true,            // la puerta de cada pasillo dice «S/ n + ℓ»
 *   cuenta: true,             // a la derecha, cuántos huéspedes hay en el pasillo
 *   piso: 3,                  // el piso que se marca (fondo tenue)
 *   titulo,                   // en el techo; por omisión, «Hotel del electrón»
 *   rotulo, alt
 * }
 * estado = { corte } (filas con desde). Función pura de (datos, estado): sin ids, sin azar, sin reloj.
 * geometria(datos, estado) → { W, H, M, textos, objetos }: las cajas con las mismas cuentas del dibujo, para la prueba
 * numérica de encuadre y rótulos (docs/molde-unidad.md §6).
 */
(function (root, fabrica) {
  const nodo = typeof module === 'object' && module.exports;
  const Kit = nodo ? require('../kit.js') : root.Kit;
  const T = nodo ? require('../trazo.js') : root.Kit.trazo;
  if (nodo) require('./quim-cajas.js');
  const api = fabrica(Kit, T);
  Kit.registrar(api);
  if (nodo) module.exports = api;
})(typeof self !== 'undefined' ? self : this, function (Kit, T) {
  'use strict';
  const W = 320, M = 4, TECHO = 40, X0 = 100, PAD = 5, n = T.n;
  const LETRA = 'spdf';
  const cajasDe = f => f.cajas || (f.flechas ? f.flechas.length : 2 * LETRA.indexOf(String(f.nombre).slice(-1)) + 1);
  const nDe = f => parseInt(f.nombre, 10), lDe = f => LETRA.indexOf(String(f.nombre).slice(-1));
  const C = () => Kit.piezas['quim-cajas'];
  // Lado de la caja: lo que entra entre X0 y la columna de la derecha (precio y cuenta), sin pasar de 28.
  function medidas(d) {
    const max = Math.max(1, ...(d.filas || []).map(cajasDe));
    const der = (d.precios ? 34 : 0) + (d.cuenta ? 50 : 0) + 8;
    const lado = Math.min(28, Math.floor((W - 12 - X0 - der) / max));
    return { lado, fila: lado + 8 };
  }
  // Pisos de arriba abajo; en cada piso, los pasillos de ℓ mayor arriba.
  function pisos(d) {
    const porN = new Map();
    (d.filas || []).forEach((f, i) => { const k = nDe(f); if (!porN.has(k)) porN.set(k, []); porN.get(k).push(Object.assign({ i }, f)); });
    return [...porN.keys()].sort((a, b) => b - a).map(k => ({ n: k, filas: porN.get(k).sort((a, b) => lDe(b) - lDe(a)) }));
  }
  function plano(d) {
    const { lado, fila } = medidas(d), out = [];
    let y = TECHO;
    for (const p of pisos(d)) {
      const y0 = y, filas = p.filas.map((f, k) => ({ f, y: y0 + PAD + k * fila }));
      y = y0 + PAD + p.filas.length * fila + PAD;
      out.push({ n: p.n, y0, y1: y, filas });
      y += 2;
    }
    return { lado, fila, pisos: out, base: y, H: y + (d.rotulo ? 30 : 6) };
  }
  const precioTxt = f => (f.precio === '?' ? 'S/ ?' : `S/ ${nDe(f) + lDe(f)}`);

  function dibujar(d, estado = {}) {
    const corte = Math.max(0, estado.corte || 0), P = plano(d), { lado } = P;
    const titulo = d.titulo === undefined ? 'Hotel del electrón' : d.titulo;
    let s = `<g class="kit-objeto" data-objeto="hotel" data-prueba="si">`;
    // Techo a dos aguas con el letrero, y las paredes del edificio.
    s += `<path d="M8 ${TECHO}L30 8H290L312 ${TECHO}Z" fill="currentColor" fill-opacity="0.08" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>`;
    if (titulo) s += T.rotulo(W / 2, 30, titulo, { ancla: 'middle', peso: 700, tam: 16, min: M, max: W - M });
    s += `<rect x="8" y="${TECHO}" width="304" height="${n(P.base - TECHO)}" fill="none" stroke="currentColor" stroke-width="2"/>`;
    for (const p of P.pisos) {
      if (d.piso === p.n) s += `<rect x="9" y="${n(p.y0)}" width="302" height="${n(p.y1 - p.y0)}" fill="currentColor" fill-opacity="0.07"/>`;
      s += `<line x1="8" y1="${n(p.y1 + 1)}" x2="312" y2="${n(p.y1 + 1)}" stroke="currentColor" stroke-width="2.5"/>`;
      s += T.rotulo(16, (p.y0 + p.y1) / 2 + 5, `Piso ${p.n}`, { peso: 700, tam: 14, min: M, max: W - M });
    }
    s += '</g>';
    // Los pasillos: una fila de quim-cajas cada uno (paleta 'zne', sin cuenta: la cuenta la pone el hotel).
    for (const p of P.pisos) for (const { f, y } of p.filas) {
      if ((f.desde || 0) > corte) continue;
      const nuevo = (f.desde || 0) === corte && corte > 0 ? ' kit-nuevo kit-aparece' : '';
      const fila = { nombre: '', e: f.e, cajas: cajasDe(f), flechas: f.flechas, vacia: f.vacia };
      const dentro = C().cuerpo({ paleta: 'zne', cuenta: false, filas: [fila] });
      // quim-cajas pone su fila en x = 64, y = 10 con lado 32 (o 26): se lleva a X0, y con la escala del hotel.
      const g = C().geometria({ filas: [fila] }), k = lado / g.lado;
      let t = f.marca ? `<rect class="kit-marca" x="${X0 - 34}" y="${n(y - 3)}" width="${n(cajasDe(f) * lado + 40)}" height="${lado + 6}" rx="6" fill="currentColor" fill-opacity="0.12"/>` : '';
      t += `<g transform="translate(${n(X0 - g.x0 * k)} ${n(y - g.top * k)}) scale(${n(k)})">${dentro}</g>`;
      t += T.rotulo(X0 - 8, y + lado / 2 + 6, f.nombre, { ancla: 'end', peso: 700, min: M, max: W - M });
      let x = X0 + cajasDe(f) * lado + 8;
      if (d.precios) { t += T.rotulo(x, y + lado / 2 + 5, precioTxt(f), { peso: 700, tam: 14, min: M, max: W - M }); x += 34; }
      if (d.cuenta) t += T.rotulo(x, y + lado / 2 + 6, f.oculto ? '? e⁻' : `${Kit.formatear(electrones(f), 0)} e⁻`, { peso: 600, clase: 'kit-num', min: M, max: W - M });
      s += `<g class="kit-fila${nuevo}"${f.tenue ? ' opacity="0.4"' : ''}>${t}</g>`;
    }
    if (d.rotulo) s += T.rotulo(16, P.H - 10, d.rotulo, { peso: 700, min: M, max: W - M, color: d.rotuloColor });
    return T.svg(W, P.H, s, { alt: alt(d) });
  }
  const electrones = f => (f.vacia ? 0 : f.flechas ? f.flechas.flat().reduce((a, b) => a + b, 0) : f.e || 0);

  function geometria(d, estado = {}) {
    const corte = Math.max(0, estado.corte || 0), P = plano(d), { lado } = P, textos = [], objetos = [];
    const caja = (que, txt, x, y, tam, peso, ancla = 'start') => {
      const w = T.ancho(txt, tam, peso), xx = T.encajar(x, txt, ancla, { tam, peso, min: M, max: W - M });
      const x0 = ancla === 'middle' ? xx - w / 2 : ancla === 'end' ? xx - w : xx;
      textos.push({ que, txt, x0, x1: x0 + w, y0: y - 0.78 * tam, y1: y + 0.22 * tam });
    };
    const titulo = d.titulo === undefined ? 'Hotel del electrón' : d.titulo;
    if (titulo) caja('titulo', titulo, W / 2, 30, 16, 700, 'middle');
    objetos.push({ que: 'edificio', x0: 7, x1: 313, y0: 7, y1: P.base + 1, marco: true });
    for (const p of P.pisos) {
      caja('piso', `Piso ${p.n}`, 16, (p.y0 + p.y1) / 2 + 5, 14, 700);
      for (const { f, y } of p.filas) {
        if ((f.desde || 0) > corte) continue;
        caja('nombre', f.nombre, X0 - 8, y + lado / 2 + 6, 16, 700, 'end');
        objetos.push({ que: 'cajas', x0: X0, x1: X0 + cajasDe(f) * lado, y0: y, y1: y + lado });
        let x = X0 + cajasDe(f) * lado + 8;
        if (d.precios) { caja('precio', precioTxt(f), x, y + lado / 2 + 5, 14, 700); x += 34; }
        if (d.cuenta) caja('cuenta', f.oculto ? '? e⁻' : `${electrones(f)} e⁻`, x, y + lado / 2 + 6, 16, 600);
      }
    }
    if (d.rotulo) caja('rotulo', d.rotulo, 16, P.H - 10, 16, 700);
    return { W, H: P.H, M, textos, objetos, base: P.base };
  }

  function alt(d) {
    if (d.alt) return d.alt;
    const ps = pisos(d).map(p => `piso ${p.n}: ${p.filas.map(f => `pasillo ${f.nombre} con ${cajasDe(f)} ${cajasDe(f) === 1 ? 'cuarto' : 'cuartos'} y ${f.oculto || f.vacia ? 'huéspedes sin contar («?»)' : `${electrones(f)} ${electrones(f) === 1 ? 'huésped' : 'huéspedes'}`}${d.precios ? `, precio ${f.precio === '?' ? '«?»' : nDe(f) + lDe(f)}` : ''}`).join('; ')}`);
    return `Hotel del electrón (analogía: piso = nivel, pasillo = subnivel, cuarto doble = orbital, huésped = electrón). ${ps.join('. ')}.${d.rotulo ? ` ${d.rotulo}.` : ''}`;
  }

  return { id: 'quim-hotel', dibujar, alt, geometria, constantes: { W, M, X0, TECHO } };
});
