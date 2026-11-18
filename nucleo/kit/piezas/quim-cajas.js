/*
 * Pieza «quim-cajas» (sesión de teoría de Química): el diagrama de orbitales. Cada fila es un subnivel (1s, 2p…)
 * con una caja por orbital y los electrones como flechas de espín. Sirve para configuración electrónica, Pauli,
 * Hund, iones, paramagnetismo y la ubicación en la tabla.
 *
 * Afirmación de la figura: cada caja admite dos flechas opuestas, y los electrones solos (desapareados) se ven.
 *
 * Fidelidad: el número de flechas de cada fila es el de los datos. Si una fila no trae `flechas`, se llena como
 * dice Hund (una hacia arriba en cada caja, después las de abajo); si las trae, se dibujan tal cual (estados
 * excitados o errores que se muestran). Las que salen se dibujan discontinuas.
 *
 * datos = {
 *   filas: [{ nombre: '2p', e: 4, cajas: 3, flechas: [[1, 1], [1, 0], [1, 0]], sale: 0, desde, color }],
 *          // de arriba abajo, en el orden en que se escribe la configuración; sale: cuántas de las últimas
 *          // flechas se van (se dibujan discontinuas)
 *   desapareados: true,          // marca las cajas con una sola flecha
 *   rotulo,                      // debajo, por ejemplo «3 desapareados»
 *   alt
 * }
 * estado = { corte }. El alto depende solo de cuántas filas hay.
 *
 * Opción nueva (18 nov 2026, etapa 4, Estructura atómica rehecha): `paleta: 'zne'`. Lo de arriba no cambia para quien no
 * la pide. Con 'zne' van los colores del mapa aprobado (docs/etapa4/propuesta-quimica.md §8): las flechas son electrones
 * y van en violeta 'f'; la marca de los desapareados es una caja punteada en tinta (antes, naranja: el color de Z); el
 * rótulo va en tinta (o en el token de `rotuloColor`). Y suma, solo con 'zne':
 *   - cuenta: false            → sin la columna «6 e⁻» (cuando la cuenta es lo que se pide);
 *   - fila.oculto: true        → la cuenta de esa fila dice «? e⁻», en tinta;
 *   - ml: true                 → bajo cada caja, su mₗ (de −ℓ a +ℓ), en tinta; la fila crece para que quepa;
 *   - ultimos: [{ fila, caja, j, desde }] → un marco en tinta alrededor de una flecha (el último electrón; j = 0 la ↑);
 *   - fila.saleDesde           → las que salen se dibujan discontinuas recién desde ese corte («Mira»);
 *   - fila.llega: k            → las k últimas flechas de la fila llegaron (fondo violeta tenue: un anión);
 *   - fila.vacia: true         → la fila se dibuja sin flechas aunque traiga e (la pregunta es dónde van).
 * cuerpo(d, estado) da el contenido sin el <svg> (para que quim-objeto lo componga) y marcos(d, estado) las cajas de
 * textos y objetos, con las mismas cuentas del dibujo, para la prueba numérica de encuadre y rótulos.
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
  const W = 320, X0 = 64, TOP = 10, M = 4;
  // Lado de la caja: 32 px; si alguna fila tiene más de 5 orbitales (4f: 7), todas bajan a 26 para caber en 320.
  const cajasDe = f => f.cajas || (f.flechas ? f.flechas.length : 1);
  const ladoCaja = d => (Math.max(1, ...(d.filas || []).map(cajasDe)) > 5 ? 26 : 32);
  const zne = d => !!d && d.paleta === 'zne';
  const conMl = d => zne(d) && d.ml === true;
  // Alto de una fila: la caja y 8 de aire; con mₗ, 22 más para el número de abajo.
  const filaAlto = d => (conMl(d) ? ladoCaja(d) + 30 : 40);
  const signoMl = m => (m > 0 ? `+${m}` : m < 0 ? `−${-m}` : '0');

  // Hund: primero una flecha hacia arriba en cada caja, después las de abajo.
  function llenar(e, cajas) {
    const out = Array.from({ length: cajas }, () => [0, 0]);
    for (let k = 0; k < Math.min(e, 2 * cajas); k++) out[k % cajas][k < cajas ? 0 : 1] = 1;
    return out;
  }
  const flechasDe = f => (f.vacia ? Array.from({ length: cajasDe(f) }, () => [0, 0]) : f.flechas || llenar(f.e || 0, cajasDe(f)));
  // Orden de las flechas de una fila: las ↑ de izquierda a derecha y después las ↓ (el orden de llenado de Hund).
  function ordenDe(fl) {
    const o = [];
    for (let k = 0; k < fl.length; k++) if (fl[k][0]) o.push([k, 0]);
    for (let k = 0; k < fl.length; k++) if (fl[k][1]) o.push([k, 1]);
    return o;
  }

  function filaSVG(fila, i, d, corte) {
    const L = ladoCaja(d), y = TOP + i * filaAlto(d), z = zne(d);
    const nuevo = (fila.desde || 0) === corte && corte > 0 ? ' kit-nuevo kit-aparece' : '';
    const cajas = cajasDe(fila), fl = flechasDe(fila), orden = ordenDe(fl);
    const saleVe = (fila.saleDesde || 0) <= corte ? fila.sale || 0 : 0;
    const salen = new Set(orden.slice(orden.length - saleVe).map(([k, j]) => `${k}-${j}`));
    const llegan = new Set(z && fila.llega ? orden.slice(orden.length - fila.llega).map(([k, j]) => `${k}-${j}`) : []);
    const tinte = z ? 'var(--c-f)' : 'var(--c-i)';
    let s = T.rotulo(X0 - 12, y + L / 2 + 6, fila.nombre || '', { ancla: 'end', peso: 700, color: fila.color, min: M, max: W - M });
    for (let k = 0; k < cajas; k++) {
      const x = X0 + k * L;
      s += `<rect x="${T.n(x)}" y="${T.n(y)}" width="${L}" height="${L}" fill="none" stroke="currentColor" stroke-width="${T.GROSOR.contorno}"/>`;
      const enCaja = [0, 1].filter(j => fl[k][j] && !salen.has(`${k}-${j}`)).length;
      if (d.desapareados && enCaja === 1) {
        s += z ? `<rect x="${T.n(x + 3)}" y="${T.n(y + 3)}" width="${L - 6}" height="${L - 6}" rx="3" fill="currentColor" fill-opacity="0.08" stroke="currentColor" stroke-width="1.5" stroke-dasharray="3 2"/>`
          : `<rect x="${T.n(x + 3)}" y="${T.n(y + 3)}" width="${L - 6}" height="${L - 6}" rx="3" fill="var(--c-o)" fill-opacity="0.18" stroke="var(--c-o)" stroke-width="1.5" stroke-dasharray="3 2"/>`;
      }
      for (const j of [0, 1]) {
        if (!fl[k][j]) continue;
        const xx = x + Math.round(L * (j ? 0.66 : 0.34)), arriba = j === 0;
        const y1 = arriba ? y + L - 5 : y + 5, y2 = arriba ? y + 5 : y + L - 5;
        const sale = salen.has(`${k}-${j}`);
        if (llegan.has(`${k}-${j}`)) s += `<rect class="kit-llega" x="${xx - 6}" y="${T.n(y + 2)}" width="12" height="${L - 4}" rx="5" fill="var(--c-f)" fill-opacity="0.16"/>`;
        const linea = `<line x1="${xx}" y1="${T.n(y1)}" x2="${xx}" y2="${T.n(y2)}" stroke="${tinte}" stroke-width="2.5" stroke-linecap="round"${sale ? ' stroke-dasharray="3 3" stroke-opacity="0.6"' : ''}/>`;
        const pt = arriba ? `M${xx - 5} ${T.n(y2 + 7)}L${xx} ${T.n(y2)}L${xx + 5} ${T.n(y2 + 7)}` : `M${xx - 5} ${T.n(y2 - 7)}L${xx} ${T.n(y2)}L${xx + 5} ${T.n(y2 - 7)}`;
        s += linea + `<path d="${pt}" fill="none" stroke="${tinte}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"${sale ? ' stroke-opacity="0.6"' : ''}/>`;
      }
      if (conMl(d)) {
        const l = (cajas - 1) / 2;
        s += T.rotulo(x + L / 2, y + L + 18, signoMl(k - l), { ancla: 'middle', peso: 600, tam: 14, min: M, max: W - M });
      }
    }
    for (const u of (z && d.ultimos) || []) {
      if (u.fila !== i || (u.desde || 0) > corte) continue;
      const xx = X0 + u.caja * L + Math.round(L * (u.j ? 0.66 : 0.34));
      s += `<rect class="kit-ultimo" x="${xx - 7}" y="${T.n(y - 3)}" width="14" height="${L + 6}" rx="6" fill="none" stroke="currentColor" stroke-width="2"/>`;
    }
    if (!(z && d.cuenta === false)) {
      const e = orden.length - saleVe, txt = z && fila.oculto ? '? e⁻' : `${Kit.formatear(e, 0)} e⁻`;
      s += T.rotulo(X0 + cajas * L + 10, y + L / 2 + 6, txt, { peso: 600, clase: 'kit-num', min: M, max: W - M });
    }
    return `<g class="kit-fila${nuevo}">${s}</g>`;
  }

  function alto(d) { return TOP + (d.filas || []).length * filaAlto(d) + (d.rotulo ? 30 : 6); }

  // Geometría para el gesto directo (docs/teoria.md §4b): dónde cae cada caja y cada flecha, en px del viewBox.
  // caja(i, k): fila i (de arriba abajo), caja k; flecha(i, k, j): j = 0 la de arriba (↑), 1 la de abajo (↓).
  function geometria(d) {
    const lado = ladoCaja(d), fila = filaAlto(d);
    const caja = (i, k) => { const x = X0 + k * lado, y = TOP + i * fila; return { x, y, w: lado, h: lado, cx: x + lado / 2, cy: y + lado / 2 }; };
    const flecha = (i, k, j) => ({ x: X0 + k * lado + Math.round(lado * (j ? 0.66 : 0.34)), y: TOP + i * fila + lado / 2 });
    return { lado, x0: X0, top: TOP, fila, alto: alto(d), caja, flecha };
  }

  function cuerpo(d, estado = {}) {
    const corte = Math.max(0, estado.corte || 0);
    let s = '';
    (d.filas || []).forEach((f, i) => { if ((f.desde || 0) <= corte) s += filaSVG(f, i, d, corte); });
    if (d.rotulo) s += T.rotulo(X0, alto(d) - 10, d.rotulo, { peso: 700, color: zne(d) ? d.rotuloColor : d.desapareados ? 'o' : undefined, min: M, max: W - M });
    return s;
  }
  function dibujar(d, estado = {}) { return T.svg(W, alto(d), cuerpo(d, estado), { alt: alt(d) }); }

  // Cajas de los textos y de las cajas dibujadas (mismas cuentas que el dibujo), para las pruebas de encuadre y rótulos.
  // Los textos se dejan donde T.rotulo los encaja (min M, max W − M).
  function marcos(d, estado = {}) {
    const corte = Math.max(0, estado.corte || 0), L = ladoCaja(d), z = zne(d), textos = [], objetos = [];
    const caja = (que, txt, x, y, tam, peso, ancla) => {
      const w = T.ancho(txt, tam, peso), xx = T.encajar(x, txt, ancla, { tam, peso, min: M, max: W - M });
      const x0 = ancla === 'middle' ? xx - w / 2 : ancla === 'end' ? xx - w : xx;
      textos.push({ que, txt, x0, x1: x0 + w, y0: y - 0.78 * tam, y1: y + 0.22 * tam });
    };
    (d.filas || []).forEach((f, i) => {
      if ((f.desde || 0) > corte) return;
      const y = TOP + i * filaAlto(d), cajas = cajasDe(f), fl = flechasDe(f);
      if (f.nombre) caja('nombre', f.nombre, X0 - 12, y + L / 2 + 6, 16, 700, 'end');
      objetos.push({ que: 'cajas', x0: X0, x1: X0 + cajas * L, y0: y, y1: y + L });
      if (conMl(d)) for (let k = 0; k < cajas; k++) caja('ml', signoMl(k - (cajas - 1) / 2), X0 + k * L + L / 2, y + L + 18, 14, 600, 'middle');
      if (!(z && d.cuenta === false)) caja('cuenta', z && f.oculto ? '? e⁻' : `${ordenDe(fl).length - ((f.saleDesde || 0) <= corte ? f.sale || 0 : 0)} e⁻`, X0 + cajas * L + 10, y + L / 2 + 6, 16, 600, 'start');
    });
    if (d.rotulo) caja('rotulo', d.rotulo, X0, alto(d) - 10, 16, 700, 'start');
    return { W, H: alto(d), M, textos, objetos };
  }

  function alt(d) {
    if (d.alt) return d.alt;
    const fs = (d.filas || []).map(f => `${f.nombre}: ${f.vacia || (zne(d) && f.oculto) ? 'electrones sin contar («?»)' : `${Kit.formatear((f.flechas ? f.flechas.flat().reduce((a, b) => a + b, 0) : f.e || 0) - (f.sale || 0), 0)} electrones`} en ${cajasDe(f)} cajas`);
    return `Diagrama de orbitales: ${fs.join('; ')}${d.rotulo ? `. ${d.rotulo}` : ''}.`;
  }

  return { id: 'quim-cajas', dibujar, alt, llenar, geometria, cuerpo, marcos, alto, W };
});
