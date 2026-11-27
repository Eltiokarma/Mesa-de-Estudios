/*
 * Ondas mecánicas, etapa 19: una soga y sus marcas materiales, o una fila de anillos.
 * El perfil y todas las posiciones llegan calculados desde la unidad. La pieza no tiene
 * motor físico, azar ni reloj. Afirmación: el perfil y la marca se ven en una escala fija;
 * la posición de equilibrio de una porción material no viaja con la perturbación.
 *
 * datos = { modo: 'transversal'|'longitudinal', vista: { xMin, xMax, yMax }, alt,
 *   perfiles: [{ id, rol: 'resultante'|'aporte'|'envolvente', puntos: [[x,y],...], color, discontinua }],
 *   particulas: [{ id, xEquilibrio, x, y, destacada, color }],
 *   sensores: [{ id, x, activo, color }], frente: { x, color },
 *   mano: { lado: 'izquierda'|'derecha', y },
 *   regla: { color, marcas: [{ x, texto }] },
 *   cotas: [{ id, desdeX, hastaX, texto, color }],
 *   flechas: [{ id, de: [x,y], a: [x,y], color }],
 *   rotulos: [{ id, x, y, texto, color, ancla, tam, peso }], nota
 * }
 * Coordenadas físicas en metros; solo rotulos usa píxeles del lienzo. Todos los elementos
 * admiten desde/hasta para estado.corte. Una sola cota visible; nota y cota son excluyentes.
 * Las alturas transversales pueden estar ampliadas: la unidad lo declara en nota o leyenda.
 * Los rótulos usan trazo.rotulo sin parser propio; las ecuaciones van en nodos del núcleo.
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
  const W = 320, H = 260, M = 4, X0 = 24, X1 = 296, Y0 = 76, Y1 = 168, YC = 122;
  const REGLA_Y = 184, REGLA_TEXTO_Y = 202, COTA_Y = 220, COTA_TEXTO_Y = 238, NOTA_Y = 248;
  const n = T.n;
  const numero = (v, nombre) => {
    if (typeof v !== 'number' || !Number.isFinite(v)) throw new TypeError('fis-ondas-e19: ' + nombre + ' debe ser finito');
    return v;
  };
  const texto = (v, nombre) => {
    if (typeof v !== 'string' || /\b(?:true|false|undefined|NaN)\b|_/u.test(v)) throw new TypeError('fis-ondas-e19: ' + nombre + ' debe ser un texto visible válido');
    return v;
  };
  const color = (v, defecto) => {
    const c = v === undefined ? defecto : v;
    if (c !== undefined && !T.COLORES.includes(c)) throw new TypeError('fis-ondas-e19: color fuera del kit');
    return c;
  };
  const lista = (d, k) => {
    if (d[k] === undefined) return [];
    if (!Array.isArray(d[k])) throw new TypeError('fis-ondas-e19: ' + k + ' debe ser una lista');
    return d[k];
  };
  const identidad = (v, defecto) => {
    if (v === undefined) return defecto;
    if (typeof v !== 'string' || !v) throw new TypeError('fis-ondas-e19: id inválido');
    return v;
  };
  function cajaRotulo(id, x, y, contenido, o = {}) {
    texto(contenido, 'rótulo'); numero(x, 'x de rótulo'); numero(y, 'y de rótulo');
    const tam = o.tam === undefined ? 16 : numero(o.tam, 'tamaño de rótulo');
    const peso = o.peso === undefined ? 600 : numero(o.peso, 'peso de rótulo');
    const ancla = o.ancla || 'start';
    if (tam < 14 || !['start', 'middle', 'end'].includes(ancla)) throw new RangeError('fis-ondas-e19: tamaño o ancla de rótulo inválidos');
    const ancho = T.ancho(contenido, tam, peso);
    if (ancho > W - 2 * M) throw new RangeError('fis-ondas-e19: rótulo demasiado ancho');
    const xx = T.encajar(x, contenido, ancla, { tam, peso, min: M, max: W - M });
    const x0 = ancla === 'middle' ? xx - ancho / 2 : ancla === 'end' ? xx - ancho : xx;
    const b = { id, texto: contenido, color: color(o.color), x: xx, y, x0, x1: x0 + ancho, y0: y - tam * 0.78, y1: y + tam * 0.22, ancla, tam, peso };
    if (b.y0 < M || b.y1 > H - M) throw new RangeError('fis-ondas-e19: rótulo fuera del alto del lienzo');
    return b;
  }
  function geometria(datos, estado = {}) {
    if (!datos || typeof datos !== 'object' || !datos.vista) throw new TypeError('fis-ondas-e19: faltan datos o vista');
    if (!['transversal', 'longitudinal'].includes(datos.modo)) throw new TypeError('fis-ondas-e19: modo inválido');
    texto(datos.alt, 'descripción');
    const v = datos.vista, xmin = numero(v.xMin, 'xMin'), xmax = numero(v.xMax, 'xMax'), ymax = numero(v.yMax, 'yMax');
    if (!(xmax > xmin && ymax > 0)) throw new RangeError('fis-ondas-e19: ventana física inválida');
    const corte = estado.corte === undefined ? 0 : numero(estado.corte, 'corte');
    const ve = q => {
      const desde = q.desde === undefined ? 0 : numero(q.desde, 'desde');
      const hasta = q.hasta === undefined ? Infinity : numero(q.hasta, 'hasta');
      return desde <= corte && corte <= hasta;
    };
    const X = x => X0 + (numero(x, 'x') - xmin) * (X1 - X0) / (xmax - xmin);
    const Y = y => YC - numero(y, 'y') * (Y1 - Y0) / (2 * ymax);
    const Xi = px => xmin + (numero(px, 'px') - X0) * (xmax - xmin) / (X1 - X0);
    const Yi = py => (YC - numero(py, 'py')) * 2 * ymax / (Y1 - Y0);
    const lugar = (p, nombre) => {
      if (!Array.isArray(p) || p.length !== 2) throw new TypeError('fis-ondas-e19: ' + nombre + ' necesita dos coordenadas');
      const x = numero(p[0], nombre + '.x'), y = numero(p[1], nombre + '.y');
      if (x < xmin - 1e-10 || x > xmax + 1e-10 || Math.abs(y) > ymax + 1e-10) throw new RangeError('fis-ondas-e19: ' + nombre + ' fuera de la ventana física');
      return [X(x), Y(y)];
    };
    const rotulos = [], idsRotulos = new Set();
    const agregarRotulo = (id, x, y, t, o) => {
      if (idsRotulos.has(id)) throw new Error('fis-ondas-e19: id de rótulo repetido');
      idsRotulos.add(id); rotulos.push(cajaRotulo(id, x, y, t, o));
    };
    const perfiles = lista(datos, 'perfiles').filter(ve).map((p, i) => {
      const rol = p.rol || 'resultante';
      if (!['resultante', 'aporte', 'envolvente'].includes(rol) || !Array.isArray(p.puntos) || p.puntos.length < 2) throw new TypeError('fis-ondas-e19: perfil inválido');
      let anterior = -Infinity;
      const puntos = p.puntos.map(q => {
        const xy = lugar(q, 'punto del perfil');
        if (q[0] < anterior) throw new RangeError('fis-ondas-e19: perfil sin orden horizontal');
        anterior = q[0]; return xy;
      });
      if (p.discontinua !== undefined && typeof p.discontinua !== 'boolean') throw new TypeError('fis-ondas-e19: discontinua debe ser booleana');
      return { id: identidad(p.id, 'perfil-' + i), rol, puntos, color: color(p.color, 'i'), discontinua: p.discontinua === undefined ? rol !== 'resultante' : p.discontinua };
    });
    if (perfiles.filter(p => p.rol === 'resultante').length > 1) throw new RangeError('fis-ondas-e19: una sola cuerda resultante por vista');
    const particulas = lista(datos, 'particulas').filter(ve).map((p, i) => {
      const [x, y] = lugar([p.x, p.y], 'partícula'), [xEquilibrioPx] = lugar([p.xEquilibrio, 0], 'equilibrio de partícula');
      if (p.destacada !== undefined && typeof p.destacada !== 'boolean') throw new TypeError('fis-ondas-e19: destacada debe ser booleana');
      const radio = p.destacada ? 5 : 2.5, radioExterior = radio + (p.destacada ? 1.25 : 0.75);
      return { id: identidad(p.id, 'particula-' + i), xEquilibrioPx, x, y, radio, caja: { x0: x - radioExterior, x1: x + radioExterior, y0: y - radioExterior, y1: y + radioExterior }, destacada: !!p.destacada, color: color(p.color, p.destacada ? 'i' : undefined) };
    });
    const sensores = lista(datos, 'sensores').filter(ve).map((p, i) => {
      const [x] = lugar([p.x, 0], 'sensor');
      if (p.activo !== undefined && typeof p.activo !== 'boolean') throw new TypeError('fis-ondas-e19: activo debe ser booleano');
      return { id: identidad(p.id, 'sensor-' + i), x, activo: !!p.activo, color: color(p.color, 'd'), caja: { x0: x - 5, x1: x + 5, y0: 168, y1: 179 } };
    });
    let frente = null;
    if (datos.frente && ve(datos.frente)) {
      const [x] = lugar([datos.frente.x, 0], 'frente');
      frente = { x, desdeY: Y0, hastaY: Y1, color: color(datos.frente.color, 'o') };
    }
    let mano = null;
    if (datos.mano && ve(datos.mano)) {
      const m = datos.mano;
      if (!['izquierda', 'derecha'].includes(m.lado)) throw new TypeError('fis-ondas-e19: lado de mano inválido');
      const [x, y] = lugar([m.lado === 'izquierda' ? xmin : xmax, m.y], 'mano');
      mano = { lado: m.lado, contacto: [x, y], caja: { x0: m.lado === 'izquierda' ? 4 : 292, x1: m.lado === 'izquierda' ? 28 : 316, y0: y - 13, y1: y + 19 } };
    }
    let regla = null;
    if (datos.regla && ve(datos.regla)) {
      const c = color(datos.regla.color, 'd');
      if (!Array.isArray(datos.regla.marcas)) throw new TypeError('fis-ondas-e19: faltan marcas de regla');
      const marcas = datos.regla.marcas.map((p, i) => {
        const [x] = lugar([p.x, 0], 'marca de regla');
        agregarRotulo('regla-' + i, x, REGLA_TEXTO_Y, p.texto, { color: c, ancla: 'middle', tam: 14 });
        return { x, texto: p.texto };
      });
      regla = { marcas, color: c };
    }
    const cotas = lista(datos, 'cotas').filter(ve).map((p, i) => {
      const [x1] = lugar([p.desdeX, 0], 'inicio de cota'), [x2] = lugar([p.hastaX, 0], 'final de cota');
      const id = identidad(p.id, 'cota-' + i), c = color(p.color, 'd');
      if (!(x2 > x1)) throw new RangeError('fis-ondas-e19: la cota debe avanzar hacia la derecha');
      agregarRotulo('cota-' + id, (x1 + x2) / 2, COTA_TEXTO_Y, p.texto, { color: c, ancla: 'middle', tam: 14 });
      return { id, de: [x1, COTA_Y], a: [x2, COTA_Y], longitudPx: x2 - x1, color: c };
    });
    if (cotas.length > 1) throw new RangeError('fis-ondas-e19: una sola cota visible por pantalla');
    if (datos.nota !== undefined) {
      texto(datos.nota, 'nota');
      if (datos.nota) {
        if (cotas.length) throw new RangeError('fis-ondas-e19: la nota con cota va en la leyenda externa');
        agregarRotulo('nota', W / 2, NOTA_Y, datos.nota, { ancla: 'middle', tam: 14 });
      }
    }
    const flechas = lista(datos, 'flechas').filter(ve).map((p, i) => ({ id: identidad(p.id, 'flecha-' + i), de: lugar(p.de, 'cola de flecha'), a: lugar(p.a, 'punta de flecha'), color: color(p.color, 'o') }));
    for (const [i, p] of lista(datos, 'rotulos').filter(ve).entries()) agregarRotulo(identidad(p.id, 'rotulo-' + i), p.x, p.y, p.texto, p);
    return { W, H, modo: datos.modo, ventana: { x0: X0, x1: X1, y0: Y0, y1: Y1, equilibrioY: YC }, X, Y, Xi, Yi, perfiles, particulas, sensores, frente, mano, regla, cotas, flechas, rotulos };
  }
  const camino = p => p.map((q, i) => (i ? 'L' : 'M') + n(q[0]) + ' ' + n(q[1])).join('');
  function dibujarMano(m) {
    if (!m) return '';
    const y = m.contacto[1], reflejo = m.lado === 'derecha' ? 'translate(320 0) scale(-1 1)' : '';
    // Boceto de prueba: muñeca, palma y dedos sujetan el inicio de la soga.
    const forma = `M5 ${n(y + 17)}L5 ${n(y + 5)}L8 ${n(y + 3)}L8 ${n(y - 8)}Q8 ${n(y - 12)} 11 ${n(y - 12)}Q14 ${n(y - 12)} 14 ${n(y - 8)}L14 ${n(y - 4)}L23 ${n(y - 4)}Q27 ${n(y - 4)} 27 ${n(y)}Q27 ${n(y + 4)} 23 ${n(y + 4)}L20 ${n(y + 4)}L19 ${n(y + 12)}Q18 ${n(y + 18)} 12 ${n(y + 18)}Z`;
    return `<g class="kit-objeto" data-objeto="mano" data-prueba="si"${reflejo ? ` transform="${reflejo}"` : ''}><path d="${forma}" fill="var(--card)" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>${T.linea(18, y, 24, y, { grosor: 2 })}</g>`;
  }
  function dibujar(datos, estado = {}) {
    const g = geometria(datos, estado);
    let s = T.linea(X0, YC, X1, YC, { grosor: 1, discontinua: true, opacidad: 0.45 });
    for (const p of g.sensores) s += T.linea(p.x, Y0, p.x, Y1, { color: p.color, grosor: 1, discontinua: true, opacidad: 0.45 });
    if (g.frente) s += T.linea(g.frente.x, g.frente.desdeY, g.frente.x, g.frente.hastaY, { color: g.frente.color, grosor: 2, discontinua: true });
    if (g.modo === 'longitudinal') for (const p of g.particulas) s += T.linea(p.xEquilibrioPx, YC - 6, p.xEquilibrioPx, YC + 6, { grosor: 1, opacidad: 0.3 });
    for (const p of [...g.perfiles.filter(p => p.rol !== 'resultante'), ...g.perfiles.filter(p => p.rol === 'resultante')]) {
      const principal = p.rol === 'resultante';
      s += `<g class="kit-objeto" data-objeto="${principal ? 'soga' : 'perfil-auxiliar'}" data-prueba="si"><path d="${camino(p.puntos)}" fill="none" stroke="${T.color(p.color)}" stroke-width="${principal ? 3 : 1.5}" stroke-linecap="round" stroke-linejoin="round"${p.discontinua ? ' stroke-dasharray="5 4"' : ''}${principal ? '' : ' stroke-opacity="0.55"'}/></g>`;
    }
    for (const p of g.particulas) {
      const c = T.color(p.color), anillo = g.modo === 'longitudinal';
      s += `<g class="kit-objeto" data-objeto="${anillo ? 'anillo' : 'marca-material'}" data-prueba="si"><circle cx="${n(p.x)}" cy="${n(p.y)}" r="${n(p.radio)}" fill="${anillo ? 'var(--card)' : c}" stroke="${c}" stroke-width="${p.destacada ? 2.5 : 1.5}"/>${p.destacada ? `<circle cx="${n(p.x)}" cy="${n(p.y)}" r="1.5" fill="${anillo ? c : 'var(--card)'}"/>` : ''}</g>`;
    }
    s += dibujarMano(g.mano);
    for (const p of g.sensores) s += `<g class="kit-objeto" data-objeto="sensor" data-prueba="si"><rect x="${n(p.x - 4)}" y="169" width="8" height="9" rx="2" fill="${p.activo ? T.color(p.color) : 'var(--card)'}" stroke="${T.color(p.color)}" stroke-width="2"/></g>`;
    for (const f of g.flechas) if (Math.hypot(f.a[0] - f.de[0], f.a[1] - f.de[1]) > 0) s += T.flecha(f.de[0], f.de[1], f.a[0], f.a[1], { color: f.color, grosor: 2 });
    if (g.regla) s += T.eje(X0, X1, REGLA_Y, { marcas: g.regla.marcas.map(q => q.x), color: g.regla.color, alto: 5 });
    for (const c of g.cotas) s += T.cota(c.de[0], c.a[0], COTA_Y, { color: c.color });
    for (const r of g.rotulos) s += T.rotulo(r.x, r.y, r.texto, { color: r.color, ancla: r.ancla, tam: r.tam, peso: r.peso, min: M, max: W - M });
    return T.svg(W, H, s, { alt: alt(datos, estado) });
  }
  function alt(datos) { return texto(datos && datos.alt, 'descripción'); }
  return { id: 'fis-ondas-e19', dibujar, alt, geometria, constantes: { W, H, M, X0, X1, Y0, Y1, YC, REGLA_Y, REGLA_TEXTO_Y, COTA_Y, COTA_TEXTO_Y, NOTA_Y } };
});
