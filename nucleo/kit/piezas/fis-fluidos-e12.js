/* Pieza exclusiva de fisica.fluidos, etapa 12. Solo convierte datos visibles a geometría.
 * La teoría calcula la física. Escalas explícitas; texto, flechas y líneas del Kit. */
(function (root, fabrica) {
  const nodo = typeof module === 'object' && module.exports;
  const Kit = nodo ? require('../kit.js') : root.Kit, T = nodo ? require('../trazo.js') : root.Kit.trazo;
  const api = fabrica(T); Kit.registrar(api); if (nodo) module.exports = api;
})(typeof self !== 'undefined' ? self : this, function (T) {
  'use strict';
  const W = 320, M = 4, BASE = 242, EJE = 166, TAM = 14;
  const tipos = ['vasos', 'prensa', 'tubo-u', 'barometro', 'flujo'];
  const finito = (x, nombre) => { if (!Number.isFinite(x)) throw new Error(`${nombre}: se necesita un número finito`); return x; };
  const positivo = (x, nombre) => { if (!(Number.isFinite(x) && x > 0)) throw new Error(`${nombre}: se necesita un número positivo`); return x; };
  const entre = (x, a, b, nombre) => { finito(x, nombre); if (x < a - 1e-9 || x > b + 1e-9) throw new Error(`${nombre}: fuera del rango ${a}…${b}`); return x; };
  const ve = (x, paso) => (x.desde === undefined || paso >= x.desde) && (x.hasta === undefined || paso <= x.hasta);
  const caja = (id, x0, y0, x1, y1, tipo, solido = false) => ({ id, x0: Math.min(x0, x1), y0: Math.min(y0, y1), x1: Math.max(x0, x1), y1: Math.max(y0, y1), tipo, solido });
  const tono = x => { if (x !== undefined && ![1, 2, 3].includes(x)) throw new Error('tono: 1, 2 o 3'); return ({ 1: .14, 2: .28, 3: .42 })[x || 1]; };
  function datosDe(datos, estado) {
    if (estado.datos === undefined) return datos || {};
    if (!estado.datos || typeof estado.datos !== 'object' || Array.isArray(estado.datos)) throw new Error('estado.datos: reemplazo completo de la escena');
    return estado.datos;
  }
  function geometria(datos, estado = {}) {
    const d = datosDe(datos, estado), modo = d.modo === undefined ? 'medida' : d.modo;
    if (!tipos.includes(d.tipo)) throw new Error('tipo no admitido por fis-fluidos-e12');
    if (!['medida', 'esquema'].includes(modo)) throw new Error('modo: medida o esquema');
    const H = d.alto === undefined ? 360 : entre(d.alto, 340, 480, 'alto'), esq = modo === 'esquema';
    const paso = estado.paso === undefined ? 0 : finito(estado.paso, 'paso');
    const escala = k => positivo((d.escala || {})[k], `escala.${k}`);
    const Y = y => BASE - finito(y, 'altura') * escala('vertical'), Yi = y => (BASE - finito(y, 'coordenada')) / escala('vertical');
    const g = { W, H, M, modo, rotulos: [], objetos: [], segmentos: [], flechas: [], referencias: {}, superficies: [], Y, Yi, s: '' };
    const refs = g.referencias;
    function ref(id, x, y, extra = {}) { if (!id || refs[id]) throw new Error(`Referencia repetida o vacía: ${id}`); refs[id] = { x, y, ...extra }; return refs[id]; }
    function linea(id, a, b, o = {}) { g.segmentos.push({ id, de: a, a: b, tipo: o.tipo || 'contorno', grosor: o.grosor || 2 }); g.s += T.linea(...a, ...b, { color: o.color, grosor: o.grosor || 2, discontinua: !!o.discontinua, opacidad: o.opacidad }); }
    function poligono(pts, relleno = 'currentColor', opacidad = .14) { g.s += `<path d="M${pts.map(p => T.n(p[0]) + ' ' + T.n(p[1])).join('L')}Z" fill="${relleno}" fill-opacity="${opacidad}" stroke="none"/>`; }
    function contorno(id, pts, cerrar = false) { for (let i = 1; i < pts.length; i++) linea(id + '-' + i, pts[i - 1], pts[i]); if (cerrar) linea(id + '-cierre', pts.at(-1), pts[0]); }
    function rect(id, x, y, w, h, solido = false) { const pts = [[x, y], [x + w, y], [x + w, y + h], [x, y + h]]; poligono(pts, 'var(--card)', 1); contorno(id, pts, true); g.objetos.push(caja(id, x, y, x + w, y + h, 'rectangulo', solido)); }
    function rotulo(id, x, y, texto, color, ancla = 'middle', peso = 600) {
      if (texto === undefined || texto === null || texto === '') return;
      if (typeof texto !== 'string') throw new Error(`Rótulo ${id}: texto plano; las fórmulas van fuera del SVG`);
      if (!['start', 'middle', 'end'].includes(ancla)) throw new Error('rotulo.ancla inválida');
      const ancho = T.ancho(texto, TAM, peso), x0 = ancla === 'middle' ? x - ancho / 2 : ancla === 'end' ? x - ancho : x;
      g.rotulos.push({ id, texto, color, x, y, ancla, peso, tam: TAM, x0, x1: x0 + ancho, y0: y - TAM * .78, y1: y + TAM * .22 });
    }
    function bloque(v, b, cx, nivel, capas) {
      if (!b || !ve(b, paso)) return;
      if (b.inmersion !== undefined && !['completa', 'parcial', 'fuera'].includes(b.inmersion)) throw new Error('bloque.inmersion: completa, parcial o fuera');
      if (b.forma !== undefined && !['regular', 'ancho'].includes(b.forma)) throw new Error('bloque.forma: regular o ancho');
      const ancho = esq ? b.forma === 'ancho' ? 78 : 52 : positivo(b.ancho, 'bloque.ancho') * escala('transversal'), alto = esq ? b.forma === 'ancho' ? 44 : 62 : positivo(b.alto, 'bloque.alto') * escala('vertical');
      const superficie = esq ? BASE - 96 : Y(nivel);
      const base = esq ? b.inmersion === 'completa' ? BASE - 8 : b.inmersion === 'fuera' ? superficie - 8 : superficie + alto * .58 : Y(finito(b.base, 'bloque.base')), top = base - alto, id = b.id || 'bloque-' + v.id;
      rect(id, cx - ancho / 2, top, ancho, alto, true);
      ref(id, cx, (top + base) / 2, { izq: cx - ancho / 2, der: cx + ancho / 2, arriba: top, abajo: base });
      for (const c of capas) {
        const desde = Math.max(top, c.superior), hasta = Math.min(base, c.inferior);
        if (hasta > desde) poligono([[cx - ancho / 2, desde], [cx + ancho / 2, desde], [cx + ancho / 2, hasta], [cx - ancho / 2, hasta]], 'currentColor', c.opacidad);
      }
      if (b.soporte !== undefined && !['superior', 'inferior', 'ninguno'].includes(b.soporte)) throw new Error('bloque.soporte inválido');
      if (b.soporte === 'superior') { rect(id + '-soporte', cx - 17, 20, 34, 18, true); linea(id + '-cuerda', [cx, 38], [cx, top]); }
      if (b.soporte === 'inferior') { linea(id + '-cuerda', [cx, base], [cx, BASE]); linea(id + '-anclaje', [cx - 9, BASE], [cx + 9, BASE], { grosor: 4 }); }
      if (!esq && b.base < 0) throw new Error('bloque.base: no puede quedar bajo el fondo');
    }
    if (d.tipo === 'vasos') {
      if (!Array.isArray(d.vasos) || d.vasos.length < 1 || d.vasos.length > 3) throw new Error('vasos: entre uno y tres');
      d.vasos.forEach((v, i) => {
        const id = v.id || 'vaso-' + (i + 1), cx = W * (i + .5) / d.vasos.length;
        const alto = esq ? 160 : positivo(v.alto, 'vaso.alto') * escala('vertical');
        const wb = esq ? (d.vasos.length === 1 ? 132 : 54) : positivo(v.ancho, 'vaso.ancho') * escala('transversal');
        const wt = esq ? wb : (v.anchoSuperior === undefined ? v.ancho : positivo(v.anchoSuperior, 'vaso.anchoSuperior')) * escala('transversal');
        if (v.capas !== undefined && (!Array.isArray(v.capas) || v.capas.length < 1 || v.capas.length > 3)) throw new Error('vaso.capas: entre una y tres');
        const total = v.capas && !esq ? v.capas.reduce((a, c) => a + positivo(c.alto, 'capa.alto'), 0) : v.nivel;
        const top = BASE - alto, nivel = esq ? undefined : entre(total, 0, v.alto, 'vaso.nivel');
        if (!esq && v.capas && v.nivel !== undefined && Math.abs(v.nivel - total) > 1e-10) throw new Error('vaso.nivel: debe coincidir con la suma de capas');
        const yn = esq ? BASE - alto * .6 : Y(nivel), wn = wb + (wt - wb) * (BASE - yn) / alto;
        let anterior = BASE, acumulado = 0;
        const capas = (v.capas || [{ alto: nivel, tono: v.tono }]).map((c, j, todas) => {
          if (!esq) acumulado += c.alto;
          const yy = esq ? BASE - alto * .6 * (j + 1) / todas.length : Y(acumulado);
          const w0 = wb + (wt - wb) * (BASE - anterior) / alto, w1 = wb + (wt - wb) * (BASE - yy) / alto, opacidad = tono(c.tono);
          poligono([[cx - w0 / 2, anterior], [cx + w0 / 2, anterior], [cx + w1 / 2, yy], [cx - w1 / 2, yy]], 'currentColor', opacidad);
          linea(id + '-superficie-' + j, [cx - w1 / 2, yy], [cx + w1 / 2, yy], { tipo: 'superficie', opacidad: .75 });
          if (v.capas) ref('interfaz-' + id + '-' + (j + 1), cx, yy);
          const capa = { superior: yy, inferior: anterior, opacidad }; anterior = yy; return capa;
        });
        const salida = v.salida && ve(v.salida, paso) ? v.salida : null;
        if (salida && salida.lado !== undefined && !['izq', 'der'].includes(salida.lado)) throw new Error('salida.lado: izq o der');
        const ladoSalida = salida && salida.lado === 'izq' ? -1 : 1;
        const ys = salida ? esq ? BASE - alto * .3 : Y(entre(salida.altura, 0, v.alto, 'salida.altura')) : undefined;
        if (salida && (ys < top + 5 || ys > BASE - 5)) throw new Error('La salida debe quedar dentro de la pared lateral');
        const paredX = (y, lado) => cx + lado * (wb + (wt - wb) * (BASE - y) / alto) / 2;
        for (const lado of [-1, 1]) {
          if (!salida || lado !== ladoSalida) linea(id + '-pared-' + lado, [paredX(top, lado), top], [paredX(BASE, lado), BASE]);
          else {
            linea(id + '-pared-superior', [paredX(top, lado), top], [paredX(ys - 4, lado), ys - 4]);
            linea(id + '-pared-inferior', [paredX(ys + 4, lado), ys + 4], [paredX(BASE, lado), BASE]);
            for (const y of [ys - 4, ys + 4]) linea(id + '-salida-' + y, [paredX(y, lado), y], [paredX(ys, lado) + lado * 18, y]);
            ref(salida.id || 'salida-' + id, paredX(ys, lado) + lado * 18, ys);
          }
        }
        linea(id + '-fondo', [cx - wb / 2, BASE], [cx + wb / 2, BASE]);
        if (v.tapa !== undefined && ![false, true, 'arriba', 'fondo'].includes(v.tapa)) throw new Error('vaso.tapa: arriba, fondo, true o false');
        const tapaFondo = v.tapa === 'fondo';
        if (v.tapa) linea(id + '-tapa', [cx - (tapaFondo ? wb : wt) / 2, tapaFondo ? BASE : top], [cx + (tapaFondo ? wb : wt) / 2, tapaFondo ? BASE : top], { grosor: 4 });
        if (v.cerrado !== undefined && typeof v.cerrado !== 'boolean') throw new Error('vaso.cerrado: booleano');
        if (v.cerrado && (tapaFondo || !v.tapa)) linea(id + '-cierre-superior', [cx - wt / 2, top], [cx + wt / 2, top], { grosor: 2 });
        const lados = { izq: cx - Math.max(wb, wt) / 2, der: cx + Math.max(wb, wt) / 2, arriba: top, abajo: BASE };
        ref(id, cx, BASE - alto / 2, lados); ref('superficie-' + id, cx, yn, lados); ref('fondo-' + id, cx, BASE, lados);
        if (v.tapa) ref('tapa-' + id, cx, tapaFondo ? BASE : top, lados);
        g.objetos.push(caja(id, lados.izq, top, lados.der, BASE, 'vaso'));
        g.superficies.push({ id, y: yn, nivel }); bloque({ ...v, id }, v.bloque, cx, nivel, capas);
      });
    } else if (d.tipo === 'prensa') {
      const p = d.prensa || {}, ps = p.pistones;
      if (!Array.isArray(ps) || ps.length < 1 || ps.length > 2) throw new Error('prensa.pistones: uno o dos');
      if (p.conectados !== undefined && typeof p.conectados !== 'boolean') throw new Error('prensa.conectados: booleano');
      const conectados = ps.length === 2 && p.conectados !== false, prof = esq ? 1 : positivo(p.profundidad, 'prensa.profundidad');
      const xs = ps.length === 1 ? [160] : [76, 244];
      const caras = ps.map((q, i) => ({ q, h: esq ? (q.tamano === 'pequeno' ? 44 : q.tamano === 'grande' ? 88 : 64) : positivo(q.area, 'piston.area') / prof * escala('transversal'), x: xs[i] + (esq || q.recorrido === undefined ? 0 : finito(q.recorrido, 'piston.recorrido') * escala('axial')) }));
      if (conectados) {
        const [a, b] = caras; if (b.x - a.x < 70) throw new Error('prensa: separación de pistones menor que 70 px');
        const pts = [[a.x, EJE - a.h / 2], [a.x + 35, EJE - a.h / 2], [b.x - 35, EJE - b.h / 2], [b.x, EJE - b.h / 2], [b.x, EJE + b.h / 2], [b.x - 35, EJE + b.h / 2], [a.x + 35, EJE + a.h / 2], [a.x, EJE + a.h / 2]];
        poligono(pts); contorno('prensa-superior', pts.slice(0, 4)); contorno('prensa-inferior', pts.slice(4));
      }
      caras.forEach(({ q, h, x }, i) => {
        const id = q.id || 'piston-' + (i + 1);
        if (!conectados) { const pts = [[x, EJE - h / 2], [x + 45, EJE - h / 2], [x + 45, EJE + h / 2], [x, EJE + h / 2]]; poligono(pts); contorno(id + '-cilindro', pts); }
        rect(id, x - 4, EJE - h / 2, 8, h, true);
        ref(id, x, EJE, { izq: x - 4, der: x + 4, arriba: EJE - h / 2, abajo: EJE + h / 2, alturaCara: h });
        if (!esq && q.recorrido !== undefined) ref('inicio-' + id, xs[i], EJE);
      });
    }
    if (d.tipo === 'tubo-u') {
      const u = d.tuboU || {};
      if (!Array.isArray(u.ramas) || u.ramas.length !== 2) throw new Error('tuboU.ramas: exactamente dos');
      const w = esq ? 26 : positivo(u.ancho, 'tuboU.ancho') * escala('transversal');
      const top = esq ? 58 : Y(positivo(u.alto, 'tuboU.alto')), xs = [85, 235];
      poligono([[xs[0] - w / 2, BASE - 4], [xs[1] + w / 2, BASE - 4], [xs[1] + w / 2, BASE + 14], [xs[0] - w / 2, BASE + 14]], 'currentColor', .18);
      contorno('u-exterior', [[xs[0] - w / 2, top], [xs[0] - w / 2, BASE + 14], [xs[1] + w / 2, BASE + 14], [xs[1] + w / 2, top]]);
      contorno('u-interior', [[xs[0] + w / 2, top], [xs[0] + w / 2, BASE - 4], [xs[1] - w / 2, BASE - 4], [xs[1] - w / 2, top]]);
      u.ramas.forEach((r, i) => {
        const id = r.id || 'rama-' + (i + 1), x = xs[i];
        if (!Array.isArray(r.capas) || !r.capas.length || r.capas.length > 3) throw new Error('rama.capas: entre una y tres');
        let h = 0, y = BASE;
        r.capas.forEach((c, j) => {
          h += esq ? 1 : positivo(c.alto, 'capa.alto'); if (!esq) entre(h, 0, u.alto, 'altura acumulada de capas');
          const yy = esq ? BASE - (j + 1) * 112 / r.capas.length : Y(h);
          poligono([[x - w / 2, y], [x + w / 2, y], [x + w / 2, yy], [x - w / 2, yy]], 'currentColor', tono(c.tono));
          linea(id + '-interfaz-' + j, [x - w / 2, yy], [x + w / 2, yy], { tipo: 'superficie', opacidad: .7 });
          ref('interfaz-' + id + '-' + (j + 1), x, yy); y = yy;
        });
        if (r.cerrada === true) linea(id + '-tapa', [x - w / 2, top], [x + w / 2, top]);
        const lados = { izq: x - w / 2, der: x + w / 2, arriba: top, abajo: BASE };
        ref(id, x, (top + BASE) / 2, lados); ref('superficie-' + id, x, y, lados); ref('fondo-' + id, x, BASE, lados);
        g.superficies.push({ id, y, nivel: esq ? undefined : h });
      });
    } else if (d.tipo === 'barometro') {
      const b = d.barometro || {}, x = 160;
      const w = esq ? 24 : positivo(b.ancho, 'barometro.ancho') * escala('transversal');
      const top = esq ? 58 : Y(positivo(b.alto, 'barometro.alto')), sup = esq ? 122 : Y(entre(b.columna, 0, b.alto, 'barometro.columna'));
      poligono([[100, BASE], [220, BASE], [220, BASE + 20], [100, BASE + 20]], 'currentColor', .32);
      contorno('cubeta', [[96, BASE - 10], [96, BASE + 22], [224, BASE + 22], [224, BASE - 10]]);
      linea('superficie-cubeta', [100, BASE], [220, BASE], { tipo: 'superficie' });
      poligono([[x - w / 2, BASE + 10], [x + w / 2, BASE + 10], [x + w / 2, sup], [x - w / 2, sup]], 'currentColor', .32);
      contorno('tubo-cerrado', [[x - w / 2, BASE + 10], [x - w / 2, top], [x + w / 2, top], [x + w / 2, BASE + 10]]);
      linea('superficie-columna', [x - w / 2, sup], [x + w / 2, sup], { tipo: 'superficie' });
      const lados = { izq: x - w / 2, der: x + w / 2, arriba: top, abajo: BASE + 10 };
      ref('cubeta', x, BASE, lados); ref('columna', x, sup, lados); ref('camara', x, (top + sup) / 2, lados);
      if (b.camara !== undefined && !['vacio', 'gas'].includes(b.camara)) throw new Error('barometro.camara: vacio o gas');
      if (b.camara) rotulo('camara', x + w / 2 + 12, (top + sup) / 2 + 4, b.camara === 'vacio' ? 'Vacío' : 'Gas', undefined, 'start');
      g.objetos.push(caja('barometro', x - w / 2, top, x + w / 2, BASE + 10, 'tubo'));
    } else if (d.tipo === 'flujo') {
      const f = d.flujo || {};
      if (!['prismatico', 'circular'].includes(f.forma)) throw new Error('flujo.forma: prismatico o circular explícito');
      if (!Array.isArray(f.secciones) || f.secciones.length !== 2) throw new Error('flujo.secciones: exactamente dos');
      const alto = q => {
        if (esq) return q.tamano === 'pequeno' ? 38 : q.tamano === 'grande' ? 76 : 56;
        const A = positivo(q.area, 'seccion.area');
        return (f.forma === 'circular' ? 2 * Math.sqrt(A / Math.PI) : A / positivo(f.profundidad, 'flujo.profundidad')) * escala('transversal');
      };
      const a = f.secciones[0], b = f.secciones[1], ha = alto(a), hb = alto(b);
      const ya = esq || a.z === undefined ? EJE : EJE - finito(a.z, 'seccion.z') * escala('vertical');
      const yb = esq || b.z === undefined ? EJE : EJE - finito(b.z, 'seccion.z') * escala('vertical');
      const sup = [[24, ya - ha / 2], [116, ya - ha / 2], [204, yb - hb / 2], [296, yb - hb / 2]], inf = [[296, yb + hb / 2], [204, yb + hb / 2], [116, ya + ha / 2], [24, ya + ha / 2]];
      poligono([...sup, ...inf]); contorno('flujo-arriba', sup); contorno('flujo-abajo', inf);
      [a, b].forEach((q, i) => {
        const x = i ? 250 : 70, y = i ? yb : ya, h = i ? hb : ha, id = q.id || 'seccion-' + (i + 1);
        ref(id, x, y, { arriba: y - h / 2, abajo: y + h / 2, alturaCara: h });
        if (q.columna !== undefined) {
          if (esq) throw new Error('Omitir columnas de presión en esquema');
          const yy = y - positivo(q.columna, 'seccion.columna') * escala('vertical');
          if (yy >= y - h / 2 - 8) throw new Error('La columna dada debe sobresalir del conducto');
          linea(id + '-toma-i', [x - 5, y - h / 2], [x - 5, yy - 8]); linea(id + '-toma-d', [x + 5, y - h / 2], [x + 5, yy - 8]);
          linea(id + '-columna', [x, y - h / 2], [x, yy], { grosor: 4, opacidad: .35 }); ref('columna-' + id, x, yy);
        }
      });
    }
    for (const p of d.puntos || []) {
      if (!ve(p, paso)) continue;
      const v = refs[p.recipiente]; if (!v) throw new Error('Punto: recipiente o rama desconocido');
      const y = esq ? BASE - 60 : Y(finito(p.altura, 'punto.altura')); if (y < v.arriba || y > v.abajo) throw new Error('Punto fuera de su recipiente');
      const id = p.id || 'punto-' + (g.objetos.length + 1), x = v.x;
      ref(id, x, y); g.s += `<circle cx="${T.n(x)}" cy="${T.n(y)}" r="3.5" fill="${T.color(p.color || 'i')}"/>`;
      g.objetos.push(caja(id, x - 3.5, y - 3.5, x + 3.5, y + 3.5, 'punto', true));
      if (p.texto) rotulo('rotulo-' + id, x + 9, y - 5, p.texto, p.color || 'i', 'start');
    }
    for (const c of d.cotas || []) {
      if (!ve(c, paso)) continue;
      const a = refs[c.de], b = refs[c.a]; if (!a || !b) throw new Error('Cota: referencias desconocidas');
      const id = c.id || 'cota-' + g.segmentos.length, sep = c.separacion === undefined ? 26 : entre(c.separacion, 12, 70, 'cota.separacion');
      if (c.eje === 'x') {
        const y = Math.max(a.y, b.y) + sep; linea(id, [a.x, y], [b.x, y], { color: c.color || 'd', tipo: 'cota' });
        for (const x of [a.x, b.x]) linea(id + '-tope-' + x, [x, y - 4], [x, y + 4], { color: c.color || 'd', tipo: 'cota' });
        rotulo(id, (a.x + b.x) / 2, y + 20, c.texto, c.color || 'd');
      } else {
        if (c.eje !== undefined && c.eje !== 'y') throw new Error('cota.eje: x o y');
        const lado = c.lado === 'izq' ? -1 : 1, extremos = [a.x, b.x, a.izq, a.der, b.izq, b.der].filter(Number.isFinite);
        const x = (lado < 0 ? Math.min(...extremos) : Math.max(...extremos)) + lado * sep;
        linea(id, [x, a.y], [x, b.y], { color: c.color || 'd', tipo: 'cota' });
        for (const y of [a.y, b.y]) linea(id + '-tope-' + y, [x - 4, y], [x + 4, y], { color: c.color || 'd', tipo: 'cota' });
        rotulo(id, x + lado * 8, (a.y + b.y) / 2 + 4, c.texto, c.color || 'd', lado < 0 ? 'end' : 'start');
      }
    }
    for (const f of d.flechas || []) {
      if (!ve(f, paso)) continue;
      const p = refs[f.ref]; if (!p) throw new Error('Flecha: referencia desconocida');
      const clase = f.clase || 'fuerza', sentido = f.sentido === undefined ? 1 : f.sentido;
      if (![1, -1].includes(sentido) || !['fuerza', 'rapidez'].includes(clase)) throw new Error('Flecha: sentido o clase inválidos');
      const cualitativa = f.cualitativa === true; if (esq && !cualitativa) throw new Error('Las flechas de esquema deben ser cualitativas');
      const L = cualitativa ? 32 : entre(f.magnitud, 0, Infinity, 'flecha.magnitud') * escala(clase); if (L === 0) continue;
      if (L < 16) throw new Error('Flecha menor que 16 px: escoger escala fija adecuada u omitirla');
      const eje = f.eje || 'x'; if (!['x', 'y'].includes(eje)) throw new Error('flecha.eje: x o y');
      if (f.anclaje !== undefined && !['entra', 'sale', 'centro'].includes(f.anclaje)) throw new Error('flecha.anclaje inválido');
      const sale = f.anclaje === 'sale', centro = f.anclaje === 'centro', u = eje === 'x' ? [sentido, 0] : [0, -sentido];
      const t0 = centro ? -L / 2 : sale ? 8 : -8 - L, t1 = centro ? L / 2 : sale ? 8 + L : -8;
      const a = [p.x + u[0] * t0, p.y + u[1] * t0], b = [p.x + u[0] * t1, p.y + u[1] * t1], normal = [-u[1], u[0]];
      const punta = [b, [b[0] - u[0] * 12 + normal[0] * 6, b[1] - u[1] * 12 + normal[1] * 6], [b[0] - u[0] * 12 - normal[0] * 6, b[1] - u[1] * 12 - normal[1] * 6]];
      g.flechas.push({ id: f.id || 'flecha-' + g.flechas.length, de: a, a: b, punta, grosor: 2, magnitud: cualitativa ? undefined : f.magnitud, cualitativa, clase });
      g.s += T.flecha(...a, ...b, { color: f.color || (clase === 'rapidez' ? 'o' : 'h'), grosor: 2 });
    }
    for (const r of d.rotulos || []) {
      if (!ve(r, paso)) continue; const p = r.ref ? refs[r.ref] : null; if (r.ref && !p) throw new Error('Rótulo: referencia desconocida');
      const fila = r.fila === undefined ? 0 : entre(r.fila, 0, 2, 'rotulo.fila'); if (!Number.isInteger(fila)) throw new Error('rotulo.fila: entero');
      rotulo(r.id || 'rotulo-' + g.rotulos.length, r.x === undefined ? p ? p.x : W / 2 : finito(r.x, 'rotulo.x'), r.y === undefined ? 286 + fila * 22 : finito(r.y, 'rotulo.y'), r.texto, r.color, r.ancla || 'middle', r.peso || 600);
    }
    if (esq) rotulo('sin-escala', W / 2, H - 10, 'Esquema sin escala', undefined, 'middle', 400);
    for (const b of [...g.objetos, ...g.rotulos]) if (b.x0 < M || b.y0 < M || b.x1 > W - M || b.y1 > H - M) throw new Error(`Fuera del marco: ${b.id}`);
    for (const s of g.segmentos) for (const p of [s.de, s.a]) if (p[0] < M + s.grosor / 2 || p[0] > W - M - s.grosor / 2 || p[1] < M + s.grosor / 2 || p[1] > H - M - s.grosor / 2) throw new Error(`Trazo fuera del marco: ${s.id}`);
    for (const f of g.flechas) for (const p of [f.de, f.a, ...f.punta]) if (p[0] < M + 1 || p[0] > W - M - 1 || p[1] < M + 1 || p[1] > H - M - 1) throw new Error(`Flecha fuera del marco: ${f.id}`);
    return g;
  }
  function alt(datos, estado = {}) {
    const d = datosDe(datos, estado); if (d.alt !== undefined) { if (typeof d.alt !== 'string') throw new Error('alt debe ser texto'); return d.alt; }
    const nombres = { vasos: 'Recipientes con líquido y datos señalados.', prensa: 'Caras de pistones horizontales a una misma altura.', 'tubo-u': 'Tubo en U con sus ramas y niveles indicados.', barometro: 'Tubo cerrado sobre una cubeta abierta.', flujo: 'Conducto con dos secciones indicadas.' };
    return (nombres[d.tipo] || 'Esquema de fluidos.') + (d.modo === 'esquema' ? ' Esquema sin escala.' : '');
  }
  function dibujar(datos, estado = {}) { const g = geometria(datos, estado), textos = g.rotulos.map(r => T.rotulo(r.x, r.y, r.texto, { ancla: r.ancla, color: r.color, peso: r.peso, tam: r.tam, min: M, max: W - M })).join(''); return T.svg(W, g.H, '<g data-prueba="si">' + g.s + textos + '</g>', { alt: alt(datos, estado) }); }
  return { id: 'fis-fluidos-e12', dibujar, geometria, alt, constantes: { W, M, BASE, EJE, TAM } };
});
