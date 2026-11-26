/**
 * Impulso, cantidad de movimiento y choques — etapa 9.
 * Seis ideas, ejercicios propios y física determinística; revisión de Gerson pendiente.
 * Fuentes: OpenStax, University Physics vol. 1, capítulo 9; MIT OCW 2.003J, Lecture 6.
 * Los errores específicos de estos ejercicios son hipótesis didácticas, no prevalencias medidas.
 * Colores fijos: masa violeta; velocidad naranja; cantidad de movimiento e impulso turquesa;
 * fuerza carmín; tiempo verde; posición, energía y coeficiente de restitución en tinta.
 * En una recta se usan componentes con signo; el módulo y la rapidez no llevan signo.
 * Las pruebas independientes recalculan cada respuesta y distractor en 400 semillas.
 */
(function (root, fabrica) {
  const def = fabrica(typeof module === 'object' && module.exports ? require('../../../nucleo/kit/kit.js') : root.Kit);
  if (typeof module === 'object' && module.exports) module.exports = def;
  else root.Teoria.unidad(def);
})(typeof self !== 'undefined' ? self : this, function (Kit) {
  'use strict';
  const f = (n, d = 2) => Kit.formatear(n, d);
  const v = { v: 'c-o', t: 'v' }, p = { v: 'c-i', t: 'p' }, F = { v: 'c-h', t: 'F' }, t = { v: 'c-d', t: 't' };
  const dp = ['Δ', p], dt = ['Δ', t];
  function azar(s) {
    let q = (s * 2654435761 + 12345) >>> 0;
    const r = () => { q = (q + 0x6D2B79F5) >>> 0; let z = q; z = Math.imul(z ^ (z >>> 15), z | 1); z ^= z + Math.imul(z ^ (z >>> 7), z | 61); return ((z ^ (z >>> 14)) >>> 0) / 4294967296; };
    r.ent = (lo, hi) => lo + Math.floor(r() * (hi - lo + 1));
    r.de = xs => xs[Math.floor(r() * xs.length)];
    return r;
  }
  function opciones(correcta, distractores, fmt) {
    const vistos = new Set([fmt(correcta)]);
    const ops = [{ id: 'c', texto: fmt(correcta), correcta: true }];
    for (const d of distractores) {
      const txt = fmt(d.valor);
      if (vistos.has(txt) || !Number.isFinite(d.valor)) continue;
      vistos.add(txt);
      ops.push({ id: d.id, texto: txt, error: d.error, siFuera: d.siFuera });
    }
    return ops.slice(0, 4);
  }
  // Gesto directo (docs/teoria.md §4b): la manija vive en las coordenadas de la figura y mover la convierte en valores
  // con la inversa lineal de la escala de la pieza; el lector ajusta cada valor al paso y al rango de su control.
  const inversa = (escala, a, b) => px => a + (px - escala(a)) * (b - a) / (escala(b) - escala(a));
  const PZ = id => Kit.piezas[id];
  // Subíndices escritos como «m_A», «v_B,f» o «x_CM(t)» dentro de Datos, ecuaciones y textos: el lector de la teoría no
  // los convierte, así que se pasan a nodos { sub } con el color de su magnitud (auditoría, 26 nov). Las figuras no se
  // tocan: la pieza fis-estatica dibuja sus propios subíndices.
  const NOTA = /([A-Za-zΔμ])_([A-Za-z0-9]+(?:,[A-Za-z0-9]+)*(?:\([A-Za-z0-9]+\))?)/g;
  const NOTA_COLOR = { m: 'f', v: 'o', u: 'o', p: 'i', P: 'i', I: 'i', F: 'h', t: 'd' };
  function notaTexto(s) {
    NOTA.lastIndex = 0;
    if (!NOTA.test(s)) return s;
    const out = []; let k = 0;
    s.replace(NOTA, (mm, l, sb, i) => {
      if (i > k) out.push(s.slice(k, i));
      out.push({ sub: [NOTA_COLOR[l] ? { v: `c-${NOTA_COLOR[l]}`, t: l } : l, sb] });
      k = i + mm.length; return mm;
    });
    if (k < s.length) out.push(s.slice(k));
    return out;
  }
  const NO_NOTAR = new Set(['dibujo', 'figura', 'revelar', 'verificacion', 'opciones', 'alternativas', 'controles', 'testigo', 'id', 'titulo', 'error', 'v', 't']);
  function notar(x, clave) {
    if (typeof x === 'string') return notaTexto(x);
    if (Array.isArray(x)) return x.map(y => notar(y));
    if (typeof x === 'function') return (clave === 'generar' || clave === 'lectura') ? (...a) => notar(x(...a)) : x;
    if (!x || typeof x !== 'object') return x;
    const out = {};
    for (const [k, y] of Object.entries(x)) out[k] = NO_NOTAR.has(k) || (x.pieza && (k === 'datos' || k === 'estado')) ? y : notar(y, k);
    return out;
  }


  // Cantidad de movimiento, base de las cinco ideas siguientes.
  const cmFmt = n => Kit.formatear(n, 3);
  const cmN = n => n < 0 ? `(${cmFmt(n)})` : cmFmt(n);
  const cmQ = (color, texto) => ({ v: `c-${color}`, t: String(texto) });
  const cmM = cmQ('f', 'm'), cmV = cmQ('o', 'v'), cmP = cmQ('i', 'p');
  const cmSub = (a, b) => ({ sub: [a, b] });
  const cmVX = cmSub(cmV, 'x'), cmPX = cmSub(cmP, 'x');
  const cmVec = a => ({ vec: [a] });
  const cmDatos = [
    [cmVec(cmP), ' = ', cmM, ' · ', cmVec(cmV)],
    [cmPX, ' = ', cmM, ' · ', cmVX],
    [cmP, ' = |', cmPX, '|; el módulo no lleva signo.'],
    'El eje x es horizontal; la derecha es positiva. La masa incluye el carrito y su carga.',
  ];
  const cmMS = 'm/s', cmPS = 'kg·m/s';
  const cmExacto = x => Number.isFinite(x) && Math.abs(x * 1000 - Math.round(x * 1000)) < 1e-7;
  const cmRed = x => Math.round(x * 1e9) / 1e9;
  const cmPar = (m, vx) => ({ m, vx, px: cmRed(m * vx) });
  function cmFigura(filas, revelar = false, reloj = 0) {
    const objetos = [], flechas = [], textos = [], lineas = [];
    const maxV = Math.max(4, ...filas.map(a => Math.abs(a.vx || 0)));
    const maxP = Math.max(16, ...filas.map(a => Math.abs(a.px || 0)));
    filas.forEach((a, k) => {
      const y = k * 160, x = 210 + (a.animar ? 6 * a.vx * reloj : 0);
      objetos.push({ tipo: 'carrito', x, y: y + 140, w: 70, h: 24, texto: a.nombre || 'Carrito', mango: 0 });
      textos.push({ x: 12, y: y + 18, texto: a.m == null ? 'm = ?' : `m = ${cmFmt(a.m)} kg`, color: a.m == null ? 'tinta' : 'f' });
      textos.push({ x: 308, y: y + 18, texto: a.nombre || 'Carrito', ancla: 'end' });
      textos.push({ x: 12, y: y + 42, texto: a.vx == null ? 'v_x = ?' : `v_x = ${cmFmt(a.vx)} m/s`, color: a.vx == null ? 'tinta' : 'o' });
      if (a.vx) flechas.push({ de: [x, y + 32], ang: a.vx > 0 ? 0 : 180, largo: Math.max(18, 80 * Math.abs(a.vx) / maxV), color: 'o' });
      const verP = (revelar || a.dadoP) && a.px != null;
      textos.push({ x: 12, y: y + 86, texto: verP ? `p_x = ${cmFmt(a.px)} kg·m/s` : 'p⃗ = ?', color: verP ? 'i' : 'tinta' });
      if (verP && a.px) flechas.push({ de: [x, y + 72], ang: a.px > 0 ? 0 : 180, largo: Math.max(18, 80 * Math.abs(a.px) / maxP), color: 'i', discontinua: true });
      lineas.push({ de: [160, y + 145], a: [308, y + 145] });
      textos.push({ x: 12, y: y + 151, texto: 'Derecha: +', tam: 11 });
    });
    return { pieza: 'fis-estatica', datos: { alto: Math.max(180, filas.length * 160), objetos, flechas, textos, lineas,
      alt: filas.map(a => `${a.nombre || 'Carrito de laboratorio'}; ${a.m == null ? 'masa por hallar' : `masa ${cmFmt(a.m)} kg`}; ${a.vx == null ? 'velocidad por hallar' : `velocidad ${cmFmt(a.vx)} m/s`}; ${(revelar || a.dadoP) && a.px != null ? `componente de cantidad de movimiento ${cmFmt(a.px)} kg·m/s` : 'cantidad de movimiento por hallar'}.`).join(' ') }, estado: {} };
  }
  // Cada error registra la operación errónea; no se inventa una opción por proximidad.
  function cantidadCaso(c) {
    let m = c.m, vx = c.vx, px = c.px, resultado, unidad = cmPS, color = 'i', simbolo = cmPX;
    let enunciado, solucion = [], errores = [], filas;
    const datos = cmDatos.slice();
    const add = (id, valor, frase) => errores.push({ id, valor: cmRed(valor), error: `CM-${id.toUpperCase()}`, siFuera: `${frase} Así sale ${cmFmt(valor)} ${unidad}.` });
    const tipo = c.tipo;
    if (['gramos', 'modulo'].includes(tipo)) { m = c.g / 1000; datos.push('1 kg = 1000 g.'); }
    if (['kmh', 'carga', 'modulo'].includes(tipo)) { vx = cmRed(c.kmh / 3.6); datos.push('1 km = 1000 m; 1 h = 3600 s.'); }
    if (tipo === 'carga') { m = c.mc + c.ml; datos.push([cmM, ' = ', cmSub(cmM, 'c'), ' + ', cmSub(cmM, 'L'), ' (carrito más carga).']); }
    if (['velocidad', 'velocidad-kmh'].includes(tipo)) {
      vx = px / m;
      const factor = tipo === 'velocidad-kmh' ? 3.6 : 1;
      resultado = cmRed(vx * factor); unidad = factor === 1 ? cmMS : 'km/h'; color = 'o'; simbolo = cmVX;
      if (factor !== 1) datos.push('1 km = 1000 m; 1 h = 3600 s.');
      enunciado = ['Un carrito de laboratorio de ', cmQ('f', `${cmFmt(m)} kg`), ' tiene ', cmPX, ' = ', cmQ('i', `${cmFmt(px)} kg·m/s`), '. ¿Cuál es su componente de velocidad ', cmVX, ` en ${unidad}?`];
      solucion.push({ texto: 'Despejamos la velocidad: la cantidad de movimiento se divide entre la masa.', ecuacion: [cmVX, ` = ${cmN(px)} ÷ ${cmFmt(m)} = `, cmQ('o', `${cmFmt(vx)} m/s`)] });
      if (factor !== 1) solucion.push({ texto: 'Convertimos metros por segundo a kilómetros por hora.', ecuacion: [cmVX, ` = ${cmN(vx)} · 3600 ÷ 1000 = `, cmQ('o', `${cmFmt(resultado)} km/h`)] });
      filas = [{ nombre: 'Carrito', m, vx: null, px, dadoP: true }];
      add('producto', px * m * factor, 'Bien usar la masa; multiplicaste en vez de dividir.');
      add('signo', -resultado, 'Bien el módulo; invertiste el sentido.');
      add('masa-doble', px / (2 * m) * factor, 'Bien dividir; contaste dos veces la masa.');
      add('sin-dividir', px * factor, 'Bien convertir; falta dividir entre la masa.');
    } else if (tipo === 'masa') {
      m = px / vx; resultado = cmRed(m); unidad = 'kg'; color = 'f'; simbolo = cmM;
      enunciado = ['Un carrito tiene ', cmPX, ' = ', cmQ('i', `${cmFmt(px)} kg·m/s`), ' y ', cmVX, ' = ', cmQ('o', `${cmFmt(vx)} m/s`), '. ¿Cuál es su masa total?'];
      solucion.push({ texto: 'La masa se obtiene dividiendo la componente de cantidad de movimiento entre la componente de velocidad.', ecuacion: [cmM, ` = ${cmN(px)} ÷ ${cmN(vx)} = `, cmQ('f', `${cmFmt(m)} kg`)] });
      filas = [{ nombre: 'Carrito', m: null, vx, px, dadoP: true }];
      add('producto', px * vx, 'Bien usar la velocidad; multiplicaste en vez de dividir.');
      add('signo', -m, 'Bien el cociente; añadiste un signo negativo a la masa.');
      add('cuadrado', px / (vx * vx), 'Bien dividir; elevaste la velocidad al cuadrado.');
      add('sin-velocidad', Math.abs(px), 'Bien tomar el módulo; falta dividir entre la rapidez.');
    } else if (tipo === 'igualar') {
      const pa = cmRed(c.ma * c.va), vb = pa / c.mb, factor = c.salidaKmh ? 3.6 : 1;
      resultado = cmRed(vb * factor); unidad = factor === 1 ? cmMS : 'km/h'; color = 'o'; simbolo = cmSub(cmV, 'B,x');
      datos.push('A y B nombran los carritos; sus masas totales son m_A y m_B.');
      if (factor !== 1) datos.push('1 km = 1000 m; 1 h = 3600 s.');
      enunciado = ['El carrito A tiene ', cmQ('f', `${cmFmt(c.ma)} kg`), ' y ', cmVX, ' = ', cmQ('o', `${cmFmt(c.va)} m/s`), '. B tiene ', cmQ('f', `${cmFmt(c.mb)} kg`), '. ¿Qué componente de velocidad necesita B, ', `en ${unidad}, para tener igual cantidad de movimiento vectorial?`];
      solucion.push({ texto: 'Primero calculamos la componente de cantidad de movimiento de A.', ecuacion: [cmSub(cmP, 'A,x'), ` = ${cmFmt(c.ma)} · ${cmN(c.va)} = `, cmQ('i', `${cmFmt(pa)} kg·m/s`)] });
      solucion.push({ texto: 'B debe tener esa misma componente; dividimos entre su masa.', ecuacion: [cmSub(cmV, 'B,x'), ` = ${cmN(pa)} ÷ ${cmFmt(c.mb)} = `, cmQ('o', `${cmFmt(vb)} m/s`)] });
      if (factor !== 1) solucion.push({ texto: 'Expresamos el resultado en la unidad pedida.', ecuacion: [cmSub(cmV, 'B,x'), ` = ${cmN(vb)} · 3600 ÷ 1000 = `, cmQ('o', `${cmFmt(resultado)} km/h`)] });
      filas = [{ nombre: 'A', ...cmPar(c.ma, c.va) }, { nombre: 'B', m: c.mb, vx: null }];
      add('misma', c.va * factor, 'Bien conservar el sentido; copiaste la velocidad con masas distintas.');
      add('inversa', c.va * c.mb / c.ma * factor, 'Bien comparar masas; invertiste su razón.');
      add('signo', -resultado, 'Bien el módulo; el vector necesita también el mismo sentido.');
      add('sin-dividir', c.ma * c.va * factor, 'Bien hallar la cantidad de movimiento; falta dividir entre la masa de B.');
      if (factor !== 1) add('sin-convertir', vb, 'Bien la velocidad en m/s; falta convertir a km/h.');
    } else {
      px = cmRed(m * vx); resultado = tipo === 'modulo' ? Math.abs(px) : px;
      if (tipo === 'modulo') simbolo = cmP;
      if (tipo === 'carga') enunciado = ['Un carrito vacío de ', cmQ('f', `${cmFmt(c.mc)} kg`), ' transporta ', cmQ('f', `${cmFmt(c.ml)} kg`), ' de carga con ', cmVX, ' = ', cmQ('o', `${cmFmt(c.kmh)} km/h`), '. ¿Cuál es ', cmPX, ' del conjunto?'];
      else enunciado = ['Un carrito de laboratorio tiene una masa total de ', cmQ('f', `${cmFmt(c.g == null ? m : c.g)} ${c.g == null ? 'kg' : 'g'}`), ' y ', cmVX, ' = ', cmQ('o', `${cmFmt(c.kmh == null ? vx : c.kmh)} ${c.kmh == null ? 'm/s' : 'km/h'}`), '. ¿Cuál es ', tipo === 'modulo' ? ['el módulo ', cmP] : ['su componente ', cmPX], '?'];
      if (tipo === 'carga') solucion.push({ texto: 'La masa total incluye el carrito y la carga.', ecuacion: [cmM, ` = ${cmFmt(c.mc)} + ${cmFmt(c.ml)} = `, cmQ('f', `${cmFmt(m)} kg`)] });
      if (c.g != null) solucion.push({ texto: 'Expresamos la masa en kilogramos.', ecuacion: [cmM, ` = ${cmFmt(c.g)} ÷ 1000 = `, cmQ('f', `${cmFmt(m)} kg`)] });
      if (c.kmh != null) solucion.push({ texto: 'Convertimos kilómetros por hora a metros por segundo, manteniendo el signo.', ecuacion: [cmVX, ` = ${cmN(c.kmh)} · 1000 ÷ 3600 = `, cmQ('o', `${cmFmt(vx)} m/s`)] });
      solucion.push({ texto: tipo === 'modulo' ? 'El módulo usa la rapidez, sin signo: no cambia por ir hacia la izquierda.' : 'Multiplicamos la masa por la componente de velocidad. El signo indica el sentido.',
        ecuacion: [simbolo, ` = ${cmFmt(m)} · ${cmN(tipo === 'modulo' ? Math.abs(vx) : vx)} = `, cmQ('i', `${cmFmt(resultado)} kg·m/s`)] });
      filas = [{ nombre: 'Carrito', m: c.g == null && tipo !== 'carga' ? m : null, vx: c.kmh == null ? vx : null }];
      // En ejemplos con conversiones, la figura no adelanta sus resultados: rótulos originales se agregan abajo.
      if (tipo === 'carga') {
        add('sin-carga', c.mc * vx, 'Bien la velocidad; dejaste fuera la carga.');
        add('sin-carro', c.ml * vx, 'Bien la carga; falta la masa del carrito.');
      }
      if (tipo === 'gramos') add('sin-convertir', c.g * vx, 'Bien multiplicar; usaste gramos como si fueran kilogramos.');
      if (['kmh', 'carga', 'modulo'].includes(tipo)) add('sin-convertir', m * (tipo === 'modulo' ? Math.abs(c.kmh) : c.kmh), 'Bien la masa; falta convertir km/h a m/s.');
      if (tipo === 'modulo') add('sin-gramos', c.g * Math.abs(vx), 'Bien convertir la velocidad; falta convertir gramos a kilogramos.');
      add('signo', tipo === 'modulo' ? px : -px, tipo === 'modulo' ? 'Bien la componente; el módulo no lleva signo.' : 'Bien el módulo; invertiste el sentido.');
      add('sin-masa', tipo === 'modulo' ? Math.abs(vx) : vx, 'Bien leer la velocidad; falta multiplicar por la masa.');
      add('suma', m + (tipo === 'modulo' ? Math.abs(vx) : vx), 'Bien elegir los datos; sumaste sus números en vez de multiplicarlos.');
      add('cuadrado', m * vx * vx, 'Bien usar masa y velocidad; elevaste la velocidad al cuadrado.');
      add('doble', 2 * px, 'Bien multiplicar; contaste dos veces la masa.');
    }
    const dibujo = cmFigura(filas);
    if (c.g != null || c.kmh != null || tipo === 'carga') {
      const tx = dibujo.datos.textos;
      if (c.g != null) { tx[0].texto = `m = ${cmFmt(c.g)} g`; tx[0].color = 'f'; }
      if (tipo === 'carga') { tx[0].texto = `m_c = ${cmFmt(c.mc)} kg`; tx[0].color = 'f'; tx.push({ x: 12, y: 64, texto: `m_L = ${cmFmt(c.ml)} kg`, color: 'f' }); }
      if (c.kmh != null) { tx[2].texto = `v_x = ${cmFmt(c.kmh)} km/h`; tx[2].color = 'o'; }
      dibujo.datos.alt = 'Carrito de laboratorio con los datos originales de masa y velocidad indicados en el enunciado; la cantidad de movimiento está por hallar.';
    }
    const vistos = new Set([cmFmt(resultado)]);
    errores = errores.filter(e => {
      if (!cmExacto(e.valor) || vistos.has(cmFmt(e.valor))) return false;
      vistos.add(cmFmt(e.valor)); return true;
    });
    return { enunciado, datos, dibujo, solucion, resultado, unidad, color, errores,
      respuesta: [simbolo, ' = ', cmQ(color, `${cmFmt(resultado)} ${unidad}`)], verificacion: { ...c } };
  }
  const CASOS_EJEMPLOS_CANTIDAD = [
    { nivel: 1, titulo: 'El carrito hacia la derecha', tipo: 'directo', m: 3, vx: 4 },
    { nivel: 1, titulo: 'El carrito hacia la izquierda', tipo: 'directo', m: 5, vx: -2 },
    { nivel: 1, titulo: 'El carrito detenido', tipo: 'directo', m: 4, vx: 0 },
    { nivel: 1, titulo: 'La velocidad que falta', tipo: 'velocidad', m: 6, px: -24 },
    { nivel: 1, titulo: 'La masa que falta', tipo: 'masa', px: 35, vx: 5 },
    { nivel: 2, titulo: 'Masa medida en gramos', tipo: 'gramos', g: 2500, vx: 3 },
    { nivel: 2, titulo: 'Gramos y movimiento hacia atrás', tipo: 'gramos', g: 3200, vx: -2.5 },
    { nivel: 2, titulo: 'Velocidad en kilómetros por hora', tipo: 'kmh', m: 3, kmh: 18 },
    { nivel: 2, titulo: 'La conversión conserva el sentido', tipo: 'kmh', m: 2.5, kmh: -14.4 },
    { nivel: 2, titulo: 'La velocidad en otra unidad', tipo: 'velocidad-kmh', m: 6, px: -15 },
    { nivel: 3, titulo: 'El carrito lleva una carga', tipo: 'carga', mc: 3, ml: 5, kmh: 10.8, posicionCorrecta: 0 },
    { nivel: 3, titulo: 'Igual cantidad, masas distintas', tipo: 'igualar', ma: 6, va: -3, mb: 4, posicionCorrecta: 1 },
    { nivel: 3, titulo: 'El módulo con dos conversiones', tipo: 'modulo', g: 7500, kmh: -25.2, posicionCorrecta: 2 },
    { nivel: 3, titulo: 'La carga viaja hacia atrás', tipo: 'carga', mc: 2.5, ml: 7.5, kmh: -21.6, posicionCorrecta: 3 },
    { nivel: 3, titulo: 'Igualar y convertir la velocidad', tipo: 'igualar', ma: 8, va: 3.5, mb: 4, salidaKmh: true, posicionCorrecta: 4 },
  ];
  // Cuentas contrastadas por separado: conversión racional 5/18 y 18/5; ver prueba propia de la unidad.
  function erroresExamenCantidad(c) {
    if (c.tipo === 'carga') {
      const m = c.mc + c.ml, u = c.kmh / 3.6;
      return [{ valor: c.ml * u, causa: 'omite el carrito' }, { valor: c.mc * u, causa: 'omite la carga' }, { valor: m * c.kmh, causa: 'no convierte km/h' }, c.kmh < 0 ? { valor: Math.abs(m * u), causa: 'borra el signo' } : { valor: m, causa: 'omite la velocidad' }];
    }
    if (c.tipo === 'modulo') {
      const m = c.g / 1000, u = c.kmh / 3.6;
      return [{ valor: m * u, causa: 'confunde módulo y componente' }, { valor: m * Math.abs(c.kmh), causa: 'no convierte km/h' }, { valor: c.g * Math.abs(u), causa: 'no convierte gramos' }, { valor: Math.abs(u), causa: 'omite la masa' }];
    }
    const u = c.ma * c.va / c.mb;
    if (c.salidaKmh) return [{ valor: u, causa: 'no convierte a km/h' }, { valor: c.va * 3.6, causa: 'copia la velocidad inicial' }, { valor: c.ma * c.va * 3.6, causa: 'omite dividir entre masa' }, { valor: c.va * c.mb / c.ma * 3.6, causa: 'invierte la razón' }];
    return [{ valor: Math.abs(u), causa: 'borra el signo' }, { valor: c.va, causa: 'copia la velocidad inicial' }, { valor: c.va * c.mb / c.ma, causa: 'invierte la razón' }, { valor: c.ma * c.va, causa: 'omite dividir entre masa' }];
  }
  const EJEMPLOS_CANTIDAD = CASOS_EJEMPLOS_CANTIDAD.map(c => {
    const b = cantidadCaso(c);
    const e = { nivel: c.nivel, titulo: c.titulo, enunciado: b.enunciado, datos: b.datos, figura: b.dibujo, solucion: b.solucion.slice(), respuesta: b.respuesta, verificacion: c };
    if (c.nivel === 3) {
      const errores = erroresExamenCantidad(c), valores = errores.map(x => x.valor);
      valores.splice(c.posicionCorrecta, 0, b.resultado);
      e.alternativas = valores.map(x => `${cmFmt(x)} ${b.unidad}`);
      if (new Set(e.alternativas).size !== 5) throw new Error(`Alternativas repetidas: ${c.titulo}`);
      e.solucion.push({ texto: errores.map(x => `${cmFmt(x.valor)}: ${x.causa}.`).join(' ') });
    }
    return e;
  });
  // Familias separadas: resuelve usa masas 9/11/13, Ahora tú 2/4/6/8. En cada idea, «Así se resuelve» entra con la
  // semilla corrida en uno (s + 1): así su primer caso es de otro tipo que el primero de «Ahora tú» (auditoría, 26 nov).
  function cmGenerar(s, resuelto) {
    const r = azar(s + (resuelto ? 1900 : 5100)), k = ((s % 6) + 6) % 6;
    let c, b;
    for (let intento = 0; intento < 100; intento++) {
      const m = r.de(resuelto ? [9, 11, 13] : [2, 4, 6, 8]), u = r.de([-5, -4, -3, 2, 3, 4, 5]);
      if (k === 0) c = { tipo: 'directo', m, vx: u };
      if (k === 1) c = { tipo: 'gramos', g: m * 1000 + (resuelto ? 250 : 500), vx: u };
      if (k === 2) c = { tipo: 'velocidad-kmh', m, px: m * u };
      if (k === 3) c = { tipo: 'carga', mc: m, ml: resuelto ? 2.25 : 1.25, kmh: cmRed(u * 3.6) };
      if (k === 4) c = { tipo: 'igualar', ma: m, va: u, mb: m / 2, salidaKmh: true };
      if (k === 5) c = { tipo: 'modulo', g: (m + (resuelto ? 0.25 : 0.5)) * 1000, kmh: cmRed(-Math.abs(u) * 3.6) };
      b = cantidadCaso(c);
      const repite = CASOS_EJEMPLOS_CANTIDAD.some(e => e.tipo === c.tipo && Object.keys(c).every(a => c[a] === e[a]));
      if (b.errores.length >= 3 && !repite && cmExacto(b.resultado)) break;
    }
    if (!b || b.errores.length < 3) throw new Error('Cantidad de movimiento: faltan errores distintos.');
    if (resuelto) return {
      enunciado: b.enunciado, datos: b.datos, dibujo: b.dibujo, respuesta: b.respuesta, verificacion: c,
      pasos: [
        { tipo: 'pide', texto: 'Piden una magnitud del carrito, con su unidad y el signo cuando corresponde.' },
        { tipo: 'regla', texto: 'La cantidad de movimiento es masa por velocidad; al despejar mantenemos el sentido del eje.', ecuacion: [cmPX, ' = ', cmM, ' · ', cmVX] },
        ...b.solucion.map(paso => ({ tipo: 'cuentas', ...paso })),
        { tipo: 'sentido', texto: ['El signo ubica el sentido sobre el eje. La masa y el módulo de la cantidad de movimiento son no negativos.'] },
      ],
    };
    const ult = b.solucion[b.solucion.length - 1];
    let cuenta = ult.ecuacion;
    const fin = cmQ(b.color, `${cmFmt(b.resultado)} ${b.unidad}`);
    if (c.tipo === 'gramos') cuenta = [cmPX, ` = (${cmFmt(c.g)} ÷ 1000) · ${cmN(c.vx)} = `, fin];
    if (c.tipo === 'velocidad-kmh') cuenta = [cmVX, ` = (${cmN(c.px)} ÷ ${cmFmt(c.m)}) · 3,6 = `, fin];
    if (c.tipo === 'carga') cuenta = [cmPX, ` = (${cmFmt(c.mc)} + ${cmFmt(c.ml)}) · (${cmN(c.kmh)} ÷ 3,6) = `, fin];
    if (c.tipo === 'igualar') cuenta = [cmSub(cmV, 'B,x'), ` = (${cmFmt(c.ma)} · ${cmN(c.va)} ÷ ${cmFmt(c.mb)}) · 3,6 = `, fin];
    if (c.tipo === 'modulo') cuenta = [cmP, ` = (${cmFmt(c.g)} ÷ 1000) · (${cmFmt(Math.abs(c.kmh))} ÷ 3,6) = `, fin];
    return { pregunta: b.enunciado, datos: b.datos, dibujo: b.dibujo, verificacion: c,
      opciones: [{ id: 'c', texto: `${cmFmt(b.resultado)} ${b.unidad}`, correcta: true }, ...b.errores.slice(0, 3).map(e => ({ id: e.id, texto: `${cmFmt(e.valor)} ${b.unidad}`, error: e.error, siFuera: e.siFuera }))],
      solucion: { texto: 'Convertimos las unidades y usamos masa por velocidad. Para hallar una velocidad, despejamos antes de convertir el resultado.', ecuacion: cuenta },
    };
  }
  const cmReferencia = cmPar(2, 3), cmPredicho = cmPar(4, -1.5);
  const cmPredTexto = x => `${cmFmt(Math.abs(x))} kg·m/s hacia la ${x < 0 ? 'izquierda' : 'derecha'}`;
  const cantidad = {
    id: 'cantidad-movimiento', titulo: 'Cantidad de movimiento',
    pregunta: '¿Basta con la rapidez para comparar cómo se mueven dos carritos?',
    aprendizaje: 'La masa y la rapidez influyen juntas; carritos con distintas masas pueden tener igual cantidad de movimiento.',
    actividad: 'Comparar dos carritos y ajustar la masa y la rapidez del segundo.',
    temas: ['Cantidad de movimiento'], pieza: 'fis-estatica',
    lee: { tarjetas: [
      { titulo: 'Carrito y carga', texto: ['Estos son carritos de laboratorio. La masa ', cmM, ' incluye el carrito y su carga. Los números son datos de un ensayo ideal, vistos desde el suelo.'],
        dibujo: cmFigura([{ nombre: 'A', m: 2, vx: 3 }, { nombre: 'B', m: 1, vx: 1 }]) },
      { titulo: 'Rapidez y sentido', texto: ['La velocidad lleva una flecha: ', cmVec(cmV), '. En esta pista usamos su componente ', cmVX, ': positiva hacia la derecha y negativa hacia la izquierda. La rapidez es su módulo, sin signo.'] },
      { titulo: 'Otra forma de describir movimiento', texto: ['La cantidad de movimiento se escribe ', cmVec(cmP), '. La medimos en kilogramos metro por segundo (kg·m/s). En el juego compararás su indicador al cambiar la masa y la rapidez.'] },
    ] },
    ejemplos: EJEMPLOS_CANTIDAD,
    juega: {
      consigna: 'Dos carritos avanzan por pistas paralelas. A mantiene su masa y rapidez; tú eliges las de B.',
      voz: 'Prueba distintas masas y rapideces. Los indicadores cambian junto al carrito.',
      controles: [
        { id: 'mB', etiqueta: 'Masa total de B', color: 'c-f', min: 1, max: 4, paso: 1, inicio: 1, unidad: 'kg', decimales: 0 },
        { id: 'vB', etiqueta: 'Rapidez de B hacia la derecha', color: 'c-o', min: 1, max: 4, paso: 1, inicio: 1, unidad: 'm/s', decimales: 0 },
        { id: 't', etiqueta: 'Reloj del ensayo; se repite', min: 0, max: 1, paso: 0.05, inicio: 0, unidad: 's', decimales: 2, auto: { velocidad: 0.25, modo: 'repite' } },
      ],
      mision: { texto: 'Iguala la cantidad de movimiento de A usando una masa distinta.',
        logrado: a => a.mB !== cmReferencia.m && a.mB * a.vB === cmReferencia.px,
        testigo: [{ mB: 3, vB: 2, t: 0 }],
        bien: 'Los indicadores coinciden aunque las masas y las rapideces son distintas.' },
      dibujo: a => cmFigura([{ nombre: 'A', ...cmReferencia, animar: true }, { nombre: 'B', ...cmPar(a.mB, a.vB), animar: true }], true, a.t),
      lectura: a => ['A: ', cmQ('i', `${cmFmt(cmReferencia.px)} kg·m/s`), '; B: ', cmQ('i', `${cmFmt(a.mB * a.vB)} kg·m/s`), '. ', a.mB * a.vB === cmReferencia.px ? 'Coinciden.' : 'Todavía difieren.'],
      leyenda: [
        { s: cmM, t: 'masa total del carrito, en kilogramos' },
        { s: cmVX, t: 'componente horizontal de velocidad; derecha positiva' },
        { s: cmPX, t: 'componente horizontal de cantidad de movimiento' },
        { s: 'flechas', t: 'una escala para cada magnitud' },
        { s: 'kg·m/s', t: 'kilogramo metro por segundo' },
      ], minimo: 2,
    },
    predice: {
      pregunta: 'A avanza hacia la derecha. B tiene el doble de masa, la mitad de rapidez y va a la izquierda. ¿Cuál es la cantidad de movimiento de B?',
      datos: ['A: 2 kg y 3 m/s hacia la derecha.', 'B: 4 kg y 1,5 m/s hacia la izquierda.'],
      dibujo: cmFigura([{ nombre: 'A', ...cmReferencia }, { nombre: 'B', ...cmPredicho }]),
      revelar: cmFigura([{ nombre: 'A', ...cmReferencia }, { nombre: 'B', ...cmPredicho }], true),
      opciones: [
        { id: 'c', texto: cmPredTexto(cmPredicho.px), correcta: true },
        { id: 'ignora-sentido', texto: cmPredTexto(-cmPredicho.px), error: 'CM-VECTOR', siFuera: 'Bien el módulo; mantuviste el sentido de A, pero B se mueve hacia la izquierda.' },
        { id: 'solo-masa', texto: cmPredTexto(-2 * cmReferencia.px), error: 'CM-MASA', siFuera: `Bien duplicar la masa; ignoraste la menor rapidez. Así obtienes ${cmFmt(2 * cmReferencia.px)} kg·m/s.` },
        { id: 'solo-rapidez', texto: cmPredTexto(-cmReferencia.px / 2), error: 'CM-RAPIDEZ', siFuera: `Bien reducir la rapidez; ignoraste la mayor masa. Así obtienes ${cmFmt(cmReferencia.px / 2)} kg·m/s.` },
      ],
      coincide: 'Los módulos coinciden, pero los sentidos son opuestos. Las cantidades de movimiento vectoriales son distintas.',
    },
    mira: {
      pieza: 'fis-estatica',
      datos: { alto: 320, cortes: [
        cmFigura([{ nombre: 'A', ...cmReferencia }, { nombre: 'B', ...cmPredicho }]).datos,
        cmFigura([{ nombre: 'A', ...cmReferencia, dadoP: true }, { nombre: 'B', ...cmPredicho }]).datos,
        cmFigura([{ nombre: 'A', ...cmReferencia }, { nombre: 'B', ...cmPredicho }], true).datos,
      ], alt: 'Dos carritos con sentidos de movimiento opuestos.' },
      pasos: [
        { estado: { corte: 0 }, texto: 'Elegimos derecha positiva: la velocidad de B lleva signo negativo.', ecuacion: [cmSub(cmV, 'B,x'), ' = −1,5 m/s'] },
        { estado: { corte: 1 }, texto: 'Multiplicamos masa por velocidad para describir el movimiento de A.', ecuacion: [cmSub(cmP, 'A,x'), ` = 2 · 3 = ${cmFmt(cmReferencia.px)} kg·m/s`] },
        { estado: { corte: 2 }, texto: 'Para B, la masa es positiva y la velocidad negativa.', ecuacion: [cmSub(cmP, 'B,x'), ` = 4 · (−1,5) = ${cmFmt(cmPredicho.px)} kg·m/s`] },
        { estado: { corte: 2 }, texto: 'Igual tamaño no significa igual vector: aquí los sentidos son opuestos.', ecuacion: [cmP, ` = |${cmFmt(cmPredicho.px)}| = ${cmFmt(Math.abs(cmPredicho.px))} kg·m/s`] },
      ],
    },
    regla: {
      texto: 'Multiplica la masa total por la velocidad. En una recta, la componente conserva el signo; el módulo no. Puedes despejar masa o velocidad, usando unidades compatibles.',
      ecuacion: [cmVec(cmP), ' = ', cmM, ' · ', cmVec(cmV)],
      condicion: 'La masa es positiva; pₓ = m·vₓ y p = |pₓ|. Todas las velocidades se miden desde el mismo observador.',
      voz: 'Primero identifica el cuerpo completo, las unidades y el sentido del movimiento.',
      dibujo: cmFigura([{ nombre: 'Carrito', ...cmPar(3, -2) }], true),
    },
    resuelve: { pieza: 'fis-estatica', generar: s => cmGenerar(s + 1, true) },
    ahoraTu: { pieza: 'fis-estatica', generar: s => cmGenerar(s, false) },
  };

  
  // Etapa 9: impulso y sistema. Datos didácticos; motores puros y determinísticos.
  // Colores: masa f; velocidad o; cantidad de movimiento e impulso i; fuerza h; tiempo d.
  const icFmt = n => Kit.formatear(n, 3);
  const icN = n => n < 0 ? `(${icFmt(n)})` : icFmt(n);
  const icQ = (color, texto) => ({ v: `c-${color}`, t: String(texto) });
  const icSub = (base, sub) => ({ sub: [base, sub] });
  const icVec = base => ({ vec: [base] });
  const icM = icQ('f', 'm'), icV = icQ('o', 'v'), icP = icQ('i', 'p'), icI = icQ('i', 'I');
  const icIX = icSub(icI, 'x'), icVX = icSub(icV, 'x'), icF = icSub(icQ('h', 'F'), 'x');
  const icFM = icSub(icQ('h', 'F'), 'media,x'), icFP = icSub(icQ('h', 'F'), 'p,x');
  const icDT = [ 'Δ', icQ('d', 't') ];
  const icPT = icSub(icQ('i', 'P'), 'total,x'), icIE = icSub(icI, 'ext,x');
  const icRed = x => Math.round(x * 1e9) / 1e9;
  const icExacto = x => Number.isFinite(x) && Math.abs(1000 * x - Math.round(1000 * x)) < 1e-7;
  const icValor = (x, unidad, color) => icQ(color, `${icFmt(x)} ${unidad}`);
  const icEje = 'El eje x es horizontal; la derecha es positiva. La masa incluye todo el cuerpo indicado.';
  // Herramientas, no el atajo del caso (auditoría, 26 nov): el área con signo y las dos áreas entre las que se elige.
  const icAreas = [[icIX, ' = área con signo bajo la gráfica de ', icF, ' frente a t.'], 'Área de un rectángulo: base · altura. Área de un triángulo: base · altura ÷ 2.'];
  function icError(lista, id, valor, causa, unidad) {
    lista.push({ id, valor: icRed(valor), error: `IC-${id.toUpperCase()}`, siFuera: `${causa} Así sale ${icFmt(valor)} ${unidad}.` });
  }
  function icErroresUnicos(caso) {
    const vistos = new Set([icFmt(caso.resultado)]);
    return caso.errores.filter(e => {
      const s = icFmt(e.valor);
      if (!icExacto(e.valor) || vistos.has(s)) return false;
      vistos.add(s); return true;
    });
  }
  function icOpciones(caso, cantidad = 3) {
    return [{ id: 'c', texto: `${icFmt(caso.resultado)} ${caso.unidad}`, correcta: true }, ...icErroresUnicos(caso).slice(0, cantidad).map(e => ({
      id: e.id, texto: `${icFmt(e.valor)} ${caso.unidad}`, error: e.error, siFuera: e.siFuera,
    }))];
  }

  // Pelota en una guía y registro de fuerza neta. Los datos pedidos no se dibujan.
  function icImpFigura(c, revelar = false, reloj = 0) {
    const m = c.g == null ? c.m : c.g / 1000, vi = c.vi, vf = c.vf;
    const dt = c.ms == null ? c.dt : c.ms / 1000;
    const pulsos = c.tipo === 'tramos' ? [{ F: c.F1, dt: c.dt1 }, { F: c.F2, dt: c.dt2 }]
      : c.F != null && dt != null ? [{ F: c.F, dt, tri: c.forma === 'tri' || c.tipo.includes('tri') }] : [];
    if (pulsos.length && !c.juego) {
      const T = pulsos.reduce((s, p) => s + p.dt, 0), max = Math.max(1, ...pulsos.map(p => Math.abs(p.F)));
      const curvas = [], areas = []; let inicio = 0;
      for (const p of pulsos) {
        const fin = inicio + p.dt, puntos = p.tri ? [[inicio, 0], [(inicio + fin) / 2, p.F], [fin, 0]] : [[inicio, 0], [inicio, p.F], [fin, p.F], [fin, 0]];
        curvas.push({ puntos, color: 'h' }); areas.push({ puntos, color: 'i' }); inicio = fin;
      }
      return { pieza: 'ejes', datos: { ajustado: true,
        x: { min: 0, max: T, paso: T / 4, nombre: 't', unidad: 's', color: 'd', decimales: 3 },
        y: { min: pulsos.some(p => p.F < 0) ? -max : 0, max: pulsos.some(p => p.F > 0) ? max : 0, paso: max / 2, nombre: 'Fₓ', unidad: 'N', color: 'h' }, curvas, areas }, estado: {} };
    }
    const alto = 200, textos = [], objetos = [], flechas = [], lineas = [];
    textos.push({ x: 12, y: 18, texto: m == null ? 'Pelota en una guía' : `m = ${icFmt(c.g == null ? m : c.g)} ${c.g == null ? 'kg' : 'g'}`, color: m == null ? 'tinta' : 'f' });
    textos.push({ x: 308, y: 18, texto: 'Derecha: +', ancla: 'end' });
    const pos = c.juego ? 64 + 12 * (4 * reloj + c.F * reloj * reloj) : 80;
    objetos.push({ tipo: 'pelota', x: pos, y: 112, r: 12 }, { tipo: 'pelota', x: 242, y: 112, r: 12 });
    lineas.push({ de: [38, 126], a: [114, 126], discontinua: false }, { de: [202, 126], a: [286, 126], discontinua: false });
    const velocidadAhora = c.juego ? vi + c.F / m * reloj : vi;
    textos.push({ x: 80, y: 46, texto: c.juego ? 'Durante el pulso' : 'Antes', ancla: 'middle' }, { x: 242, y: 46, texto: c.juego ? 'Al terminar' : 'Después', ancla: 'middle' });
    textos.push({ x: 80, y: 70, texto: vi == null ? 'v_i,x = ?' : `${c.juego ? 'v_x' : 'v_i,x'} = ${icFmt(velocidadAhora)} m/s`, color: vi == null ? 'tinta' : 'o', ancla: 'middle' });
    const mostrarFinal = vf != null && (revelar || !['final', 'tramos'].includes(c.tipo));
    textos.push({ x: 242, y: 70, texto: mostrarFinal ? `v_f,x = ${icFmt(vf)} m/s` : 'v_f,x = ?', color: mostrarFinal ? 'o' : 'tinta', ancla: 'middle' });
    const escalaV = 48 / Math.max(1, Math.abs(velocidadAhora || 0), mostrarFinal ? Math.abs(vf) : 0);
    if (velocidadAhora) flechas.push({ de: [80, 88], ang: velocidadAhora > 0 ? 0 : 180, largo: Math.max(16, escalaV * Math.abs(velocidadAhora)), color: 'o' });
    if (mostrarFinal && vf) flechas.push({ de: [242, 88], ang: vf > 0 ? 0 : 180, largo: Math.max(16, escalaV * Math.abs(vf)), color: 'o' });
    if (c.juego) {
      textos.push({ x: 12, y: 154, texto: `Impulso del pulso: I_x = ${icFmt(c.F * c.dt)} N·s`, color: 'i' });
      textos.push({ x: 12, y: 185, texto: `F_x = ${icFmt(c.F)} N`, color: 'h' });
      flechas.push({ de: [290, 181], ang: c.F > 0 ? 0 : 180, largo: 24, color: 'h' });
    }
    return { pieza: 'fis-estatica', datos: { alto, objetos, flechas, textos, lineas,
      alt: `Pelota en una guía horizontal. ${vi == null ? 'Velocidad inicial no indicada.' : `Llega con componente ${icFmt(vi)} m/s.`} ${mostrarFinal ? `Termina con ${icFmt(vf)} m/s.` : 'Velocidad final por hallar.'} ${pulsos.length ? 'El registro muestra las fuerzas y duraciones dadas, sin calcular el impulso.' : 'Se comparan los estados indicados.'}` }, estado: {} };
  }

  function icImpCaso(c) {
    const tipo = c.tipo, m = c.g == null ? c.m : c.g / 1000, dt = c.ms == null ? c.dt : c.ms / 1000;
    const vi = c.vi, vf = c.vf, delta = vf == null ? null : vf - vi;
    const tri = tipo.includes('tri') || c.forma === 'tri';
    let I = tipo === 'tramos' ? c.F1 * c.dt1 + c.F2 * c.dt2 : c.F != null && dt != null ? c.F * dt * (tri ? 0.5 : 1) : m * delta;
    let resultado = I, unidad = 'N·s', color = 'i', simbolo = icIX, enunciado, solucion = [], errores = [];
    const datos = [icEje, [icIX, ' = ', icM, ' · (', icSub(icV, 'f,x'), ' − ', icSub(icV, 'i,x'), ')'], [icIX, ' = ', icFM, ' · ', icDT], '1 N·s = 1 kg·m/s.'];
    const add = (id, v, causa) => icError(errores, id, v, causa, unidad);
    if (tipo === 'rect' || tipo === 'tri') {
      enunciado = [`La fuerza neta sobre una pelota tiene un pulso ${tri ? 'triangular, con pico de' : 'rectangular de'} `, icValor(c.F, 'N', 'h'), ' durante ', icValor(dt, 's', 'd'), '. ¿Cuál es su impulso horizontal?'];
      datos.push(...icAreas);
      solucion.push({ texto: tri ? 'El área triangular es la mitad del rectángulo de igual base y altura.' : 'El área del rectángulo es fuerza por duración; conservamos el signo.', ecuacion: [icIX, ` = ${icN(c.F)} · ${icFmt(dt)}${tri ? ' ÷ 2' : ''} = `, icValor(I, unidad, color)] });
      add('signo', -I, 'Bien el área; invertiste su signo.');
      add('sin-tiempo', c.F, 'Bien leer la fuerza; falta considerar la duración.');
      add('divide-tiempo', c.F / dt, 'Bien usar ambos datos; dividiste entre la duración.');
      add('doble', 2 * I, tri ? 'Bien la base y la altura; tomaste todo el rectángulo.' : 'Bien el producto; contaste dos pulsos iguales.');
      add('mitad', I / 2, tri ? 'Bien reconocer el triángulo; dividiste entre dos otra vez.' : 'Bien el área; tomaste la mitad de un rectángulo.');
    } else if (tipo === 'cambio' || tipo === 'fuerza' || tipo === 'fuerza-ms') {
      I = m * delta;
      if (tipo !== 'cambio') { resultado = I / dt; unidad = 'N'; color = 'h'; simbolo = icFM; }
      else resultado = I;
      enunciado = ['Una pelota de ', icValor(c.g == null ? m : c.g, c.g == null ? 'kg' : 'g', 'f'), ' pasa de ', icValor(vi, 'm/s', 'o'), ' a ', icValor(vf, 'm/s', 'o'),
        tipo === 'cambio' ? '. ¿Cuál es el impulso neto horizontal?' : [' en ', icValor(c.ms == null ? dt : c.ms, c.ms == null ? 's' : 'ms', 'd'), '. ¿Cuál es la fuerza neta media horizontal?']];
      if (c.g != null || c.ms != null) { datos.push('1 kg = 1000 g; 1 s = 1000 ms.'); solucion.push({ texto: 'Convertimos la masa a kilogramos y la duración a segundos.', ecuacion: [icM, ` = ${icFmt(c.g)} ÷ 1000 = ${icFmt(m)} kg; Δt = ${icFmt(c.ms)} ÷ 1000 = ${icFmt(dt)} s`] }); }
      solucion.push({ texto: 'Restamos velocidad final menos inicial, incluyendo los signos.', ecuacion: [icIX, ` = ${icFmt(m)} · (${icN(vf)} − ${icN(vi)}) = `, icValor(I, 'N·s', 'i')] });
      if (tipo !== 'cambio') solucion.push({ texto: 'La fuerza media produce ese impulso durante todo el intervalo.', ecuacion: [icFM, ` = ${icN(I)} ÷ ${icFmt(dt)} = `, icValor(resultado, unidad, color)] });
      const divisor = tipo === 'cambio' ? 1 : dt;
      add('signo', -resultado, 'Bien restar las velocidades; cambiaste el orden.');
      add('sin-masa', delta / divisor, 'Bien el cambio de velocidad; falta la masa.');
      add('suma-velocidades', m * (vf + vi) / divisor, 'Bien usar ambos estados; sumaste sus velocidades.');
      add('solo-final', m * vf / divisor, 'Bien usar el estado final; olvidaste el inicial.');
      add('doble-masa', 2 * resultado, 'Bien el procedimiento; contaste dos veces la masa.');
      if (tipo !== 'cambio') { add('sin-duracion', I, 'Bien hallar el impulso; falta dividir entre la duración.'); add('multiplica-duracion', I * dt, 'Bien hallar el impulso; multiplicaste por la duración.'); }
    } else if (tipo === 'final' || tipo === 'tramos') {
      resultado = vi + I / m; unidad = 'm/s'; color = 'o'; simbolo = icSub(icV, 'f,x');
      if (tipo === 'tramos') {
        enunciado = ['Una pelota de ', icValor(m, 'kg', 'f'), ' llega con ', icValor(vi, 'm/s', 'o'), '. Recibe ', icValor(c.F1, 'N', 'h'), ' durante ', icValor(c.dt1, 's', 'd'), ' y luego ', icValor(c.F2, 'N', 'h'), ' durante ', icValor(c.dt2, 's', 'd'), '. ¿Cuál es su velocidad final horizontal?'];
        datos.push('Cada fuerza neta es constante en su tramo; los impulsos se suman con signo.');
        solucion.push({ texto: 'Sumamos los impulsos de los dos tramos, con sus signos.', ecuacion: [icIX, ` = ${icN(c.F1)} · ${icFmt(c.dt1)} + ${icN(c.F2)} · ${icFmt(c.dt2)} = `, icValor(I, 'N·s', 'i')] });
        add('solo-primero', vi + c.F1 * c.dt1 / m, 'Bien calcular el primer pulso; falta el segundo.');
        add('solo-segundo', vi + c.F2 * c.dt2 / m, 'Bien calcular el segundo pulso; falta el primero.');
        add('modulos', vi + (Math.abs(c.F1 * c.dt1) + Math.abs(c.F2 * c.dt2)) / m, 'Bien las áreas; sumaste módulos sin sus signos.');
      } else {
        enunciado = ['Una pelota de ', icValor(m, 'kg', 'f'), ' llega con ', icValor(vi, 'm/s', 'o'), `. La fuerza neta forma un pulso ${tri ? 'triangular' : 'rectangular'} de `, icValor(c.F, 'N', 'h'), ' y ', icValor(dt, 's', 'd'), '. ¿Cuál es su velocidad final horizontal?'];
        datos.push(...icAreas);
        solucion.push({ texto: 'Calculamos el impulso como el área con signo del pulso.', ecuacion: [icIX, ` = ${icN(c.F)} · ${icFmt(dt)}${tri ? ' ÷ 2' : ''} = `, icValor(I, 'N·s', 'i')] });
        if (tri) add('rectangulo', vi + 2 * I / m, 'Bien la fuerza máxima; tomaste el rectángulo completo.');
      }
      solucion.push({ texto: 'Dividimos el impulso entre la masa y lo sumamos a la velocidad inicial.', ecuacion: [simbolo, ` = ${icN(vi)} + ${icN(I)} ÷ ${icFmt(m)} = `, icValor(resultado, unidad, color)] });
      add('sin-masa', vi + I, 'Bien incluir la velocidad inicial; falta dividir el impulso entre masa.');
      add('sin-inicial', I / m, 'Bien hallar el cambio; falta la velocidad inicial.');
      add('resta-impulso', vi - I / m, 'Bien dividir entre masa; restaste el cambio en vez de sumarlo.');
      add('doble-impulso', vi + 2 * I / m, 'Bien el procedimiento; contaste dos veces el impulso.');
    } else if (tipo === 'tiempo' || tipo === 'tiempo-tri') {
      I = m * delta; resultado = I / c.F * (tri ? 2 : 1); unidad = 's'; color = 'd'; simbolo = icDT;
      enunciado = ['Una pelota de ', icValor(m, 'kg', 'f'), ' pasa de ', icValor(vi, 'm/s', 'o'), ' a ', icValor(vf, 'm/s', 'o'), ` con un pulso ${tri ? 'triangular' : 'rectangular'} de `, icValor(c.F, 'N', 'h'), '. ¿Cuánto dura el pulso?'];
      datos.push(...icAreas);
      solucion.push({ texto: 'El impulso necesario sale de los estados inicial y final.', ecuacion: [icIX, ` = ${icFmt(m)} · (${icN(vf)} − ${icN(vi)}) = `, icValor(I, 'N·s', 'i')] });
      solucion.push({ texto: tri ? 'La mitad de fuerza máxima por duración debe dar ese impulso.' : 'Despejamos la duración del producto fuerza por tiempo.', ecuacion: [icDT, ` = ${tri ? '2 · ' : ''}${icN(I)} ÷ ${icN(c.F)} = `, icValor(resultado, unidad, color)] });
      add('signo', -resultado, 'Bien el tamaño; una duración no puede ser negativa.');
      add('sin-masa', delta / c.F * (tri ? 2 : 1), 'Bien el cambio de velocidad; falta multiplicar por masa.');
      add('inversa', c.F / I, 'Bien usar fuerza e impulso; invertiste el cociente.');
      add('doble', 2 * resultado, 'Bien despejar; duplicaste otra vez la duración.');
      add('mitad', resultado / 2, tri ? 'Bien usar el área; olvidaste que el pulso es triangular.' : 'Bien despejar; redujiste a la mitad un pulso rectangular.');
    } else throw new Error('Tipo de impulso no reconocido: ' + tipo);
    resultado = icRed(resultado);
    const dibujo = icImpFigura(c);
    return { enunciado, datos, dibujo, solucion, respuesta: [simbolo, ' = ', icValor(resultado, unidad, color)], resultado, unidad, color, errores, verificacion: { familia: 'impulso', ...c } };
  }

  // Dos cuerpos del MISMO sistema, antes y después; las velocidades pedidas se omiten.
  function icSistemaFigura(c, revelar = false, reloj = 0) {
    const textos = [], objetos = [], flechas = [], lineas = [];
    const convertir = c.enKmh ? 1 / 3.6 : 1;
    const ma = c.gA == null ? c.mA : c.gA / 1000;
    const uA = c.uA == null ? 0 : c.uA * convertir, uB = c.uB == null ? 0 : c.uB * convertir;
    const vA = c.vA == null ? null : c.vA * convertir, vB = c.vB;
    const total = (a, b) => ma * a + c.mB * b;
    const filas = [{ nombre: 'Antes', a: uA, b: uB, verTotal: c.juego }, { nombre: 'Después', a: vA, b: revelar ? vB : c.dadoVB ? vB : null, verTotal: c.juego }];
    const escalaV = 40 / Math.max(1, ...filas.flatMap(f => [Math.abs(f.a || 0), Math.abs(f.b || 0)]));
    filas.forEach((fila, k) => {
      const y = 180 * k;
      textos.push({ x: 12, y: y + 18, texto: fila.nombre });
      lineas.push({ de: [10, y + 26], a: [310, y + 26] }, { de: [10, y + 26], a: [10, y + 184] }, { de: [310, y + 26], a: [310, y + 184] }, { de: [10, y + 184], a: [310, y + 184] });
      for (const [nombre, base, masa, velocidad] of [['A', 84, ma, fila.a], ['B', 236, c.mB, fila.b]]) {
        const desplazar = c.juego && k === 0 ? (nombre === 'A' ? 1 : -1) * 60 * (c.compresion || 0.1) : 0;
        const x = base + desplazar + (c.juego && k === 1 ? 6 * (velocidad || 0) * reloj : 0);
        objetos.push({ tipo: 'carrito', x, y: y + 134, w: 56, h: 24, texto: nombre, mango: 0 });
        textos.push({ x: base, y: y + 47, texto: `m_${nombre} = ${icFmt(nombre === 'A' && c.gA != null ? c.gA : masa)} ${nombre === 'A' && c.gA != null ? 'g' : 'kg'}`, color: 'f', ancla: 'middle' });
        textos.push({ x: base, y: y + 73, texto: velocidad == null ? `v_${nombre},x = ?` : `v_${nombre},x = ${icFmt(c.enKmh ? velocidad / convertir : velocidad)} ${c.enKmh ? 'km/h' : 'm/s'}`, color: velocidad == null ? 'tinta' : 'o', ancla: 'middle' });
        if (velocidad) flechas.push({ de: [x, y + 86], ang: velocidad > 0 ? 0 : 180, largo: Math.max(16, escalaV * Math.abs(velocidad)), color: 'o' });
        if (c.juego) textos.push({ x: base, y: y + 156, texto: `p_${nombre},x = ${icFmt(masa * velocidad)} kg·m/s`, color: 'i', ancla: 'middle' });
      }
      if ((c.juego || c.resorte) && k === 0) objetos.push({ tipo: 'resorte', de: [118 + 60 * (c.compresion || 0.1), y + 116], a: [202 - 60 * (c.compresion || 0.1), y + 116], vueltas: 6, ancho: 6 });
      if (fila.verTotal) textos.push({ x: 160, y: y + 177, texto: `P_total,x = ${icFmt(total(fila.a, fila.b))} kg·m/s`, color: 'i', ancla: 'middle' });
    });
    return { pieza: 'fis-estatica', datos: { alto: 380, objetos, flechas, textos, lineas,
      alt: 'Dos carritos dentro de un sistema señalado, antes y después. Las etiquetas muestran solo las masas y velocidades dadas; las incógnitas llevan un signo de interrogación.' }, estado: {} };
  }
  function icSistemaCaso(c) {
    const tipo = c.tipo, k = c.enKmh ? 1 / 3.6 : 1;
    const ma = c.gA == null ? c.mA : c.gA / 1000, mb = c.mB;
    const ua = (c.uA || 0) * k, ub = (c.uB || 0) * k, va = c.vA == null ? null : c.vA * k;
    const pi = ma * ua + mb * ub + (c.mC || 0) * (c.uC || 0);
    const ie = c.Fext == null ? (c.Iext || 0) : c.Fext * c.dt;
    let resultado, unidad = 'm/s', color = 'o', simbolo = icSub(icV, 'B,x'), enunciado, solucion = [], errores = [];
    const datos = [icEje, [icPT, ' = m_A·v_A,x + m_B·v_B,x (suma del sistema).'], [icSub(icQ('i', 'P'), 'f,x'), ' − ', icSub(icQ('i', 'P'), 'i,x'), ' = ', icIE], 'A y B nombran los carritos; i y f indican los estados inicial y final.'];
    const add = (id, v, causa) => icError(errores, id, v, causa, unidad);
    const masas = ['A tiene ', icValor(c.gA == null ? ma : c.gA, c.gA == null ? 'kg' : 'g', 'f'), ' y B, ', icValor(mb, 'kg', 'f'), '. '];
    if (tipo === 'total') {
      resultado = pi; unidad = 'kg·m/s'; color = 'i'; simbolo = icPT;
      enunciado = [...masas, 'En el mismo instante, sus velocidades horizontales son ', icValor(ua, 'm/s', 'o'), ' y ', icValor(ub, 'm/s', 'o'), '. ¿Cuál es la cantidad de movimiento horizontal total?'];
      solucion.push({ texto: 'Calculamos cada componente y las sumamos con sus signos.', ecuacion: [icPT, ` = ${icFmt(ma)} · ${icN(ua)} + ${icFmt(mb)} · ${icN(ub)} = `, icValor(resultado, unidad, color)] });
      add('modulos', Math.abs(ma * ua) + Math.abs(mb * ub), 'Bien las masas; sumaste módulos en vez de componentes.');
      add('sin-masas', ua + ub, 'Bien los sentidos; sumaste velocidades sin las masas.');
      add('solo-a', ma * ua, 'Bien calcular A; falta la contribución de B.');
      add('solo-b', mb * ub, 'Bien calcular B; falta la contribución de A.');
      add('signo', -pi, 'Bien los productos; invertiste el sentido del total.');
      add('masas-cruzadas', ma * ub + mb * ua, 'Bien usar dos masas; cambiaste sus velocidades de cuerpo.');
    } else if (tipo === 'diagnostico' || tipo === 'fuerza-sistema') {
      const pf = ma * va + mb * c.vB;
      resultado = pf - pi;
      unidad = tipo === 'diagnostico' ? 'N·s' : 'N'; color = tipo === 'diagnostico' ? 'i' : 'h'; simbolo = tipo === 'diagnostico' ? icIE : icSub(icQ('h', 'F'), 'ext,media,x');
      if (tipo === 'fuerza-sistema') resultado /= c.dt;
      enunciado = [...masas, 'Antes: ', icValor(ua, 'm/s', 'o'), ' y ', icValor(ub, 'm/s', 'o'), '; después: ', icValor(va, 'm/s', 'o'), ' y ', icValor(c.vB, 'm/s', 'o'), ', respectivamente. ',
        tipo === 'diagnostico' ? '¿Cuál fue el impulso externo horizontal sobre el sistema?' : ['El cambio dura ', icValor(c.dt, 's', 'd'), '. ¿Cuál fue la fuerza externa media horizontal?']];
      if (tipo === 'fuerza-sistema') datos.push([icIE, ' = F_ext,media,x · Δt.']);
      solucion.push({ texto: 'Calculamos la suma al inicio y al final para los mismos cuerpos.', ecuacion: [`P_i,x = ${icFmt(ma)} · ${icN(ua)} + ${icFmt(mb)} · ${icN(ub)} = ${icFmt(pi)} kg·m/s; P_f,x = ${icFmt(ma)} · ${icN(va)} + ${icFmt(mb)} · ${icN(c.vB)} = ${icFmt(pf)} kg·m/s`] });
      solucion.push({ texto: 'La diferencia entre los totales es el impulso externo, no el de un solo carrito.', ecuacion: [icIE, ` = ${icN(pf)} − ${icN(pi)} = ${icFmt(pf - pi)} N·s`] });
      if (tipo === 'fuerza-sistema') solucion.push({ texto: 'Dividimos el impulso externo entre la duración.', ecuacion: [simbolo, ` = ${icN(pf - pi)} ÷ ${icFmt(c.dt)} = `, icValor(resultado, unidad, color)] });
      const d = tipo === 'diagnostico' ? 1 : c.dt;
      add('signo', -resultado, 'Bien comparar estados; restaste inicial menos final.');
      add('solo-final', pf / d, 'Bien hallar el total final; falta restar el inicial.');
      add('solo-a', ma * (va - ua) / d, 'Bien el cambio de A; falta el de B.');
      add('suma-estados', (pf + pi) / d, 'Bien los totales; sumaste en vez de restar.');
      add('doble', 2 * resultado, 'Bien el balance; contaste dos veces su diferencia.');
    } else {
      const esTres = tipo === 'tres', aporte = ma * va + (esTres ? mb * c.vB : 0), divisor = esTres ? c.mC : mb;
      resultado = (pi + ie - aporte) / divisor;
      if (esTres) simbolo = icSub(icV, 'C,x');
      if (tipo === 'retroceso' || tipo === 'retroceso-gramos') {
        enunciado = [...masas, 'Estaban en reposo. Un resorte los separa sin impulso externo horizontal apreciable. A sale con ', icValor(va, 'm/s', 'o'), '. ¿Con qué velocidad horizontal sale B?'];
      } else if (esTres) {
        enunciado = ['Tres carritos A, B y C tienen masas ', icQ('f', `${icFmt(ma)}, ${icFmt(mb)} y ${icFmt(c.mC)} kg`), '. Antes llevan ', icQ('o', `${icFmt(ua)}, ${icFmt(ub)} y ${icFmt(c.uC)} m/s`), '. Después, A lleva ', icValor(va, 'm/s', 'o'), ' y B ', icValor(c.vB, 'm/s', 'o'), '. ¿Qué velocidad horizontal tiene C?'];
        datos[1] = [icPT, ' = m_A·v_A,x + m_B·v_B,x + m_C·v_C,x.'];
        datos[3] = 'A, B y C nombran los carritos; i y f indican los estados inicial y final.';
        datos.push('El impulso externo horizontal sobre los tres carritos es despreciable.');
      } else {
        enunciado = [...masas, 'Antes llevan ', icValor(c.uA, c.enKmh ? 'km/h' : 'm/s', 'o'), ' y ', icValor(c.uB, c.enKmh ? 'km/h' : 'm/s', 'o'), '. Después, A lleva ', icValor(c.vA, c.enKmh ? 'km/h' : 'm/s', 'o'), '. ',
          c.Fext != null ? ['La fuerza externa neta es ', icValor(c.Fext, 'N', 'h'), ' durante ', icValor(c.dt, 's', 'd'), '. '] : c.Iext != null ? ['El impulso externo es ', icValor(c.Iext, 'N·s', 'i'), '. '] : 'El impulso externo horizontal es despreciable. ', '¿Qué velocidad horizontal final tiene B?'];
      }
      if (c.gA != null) { datos.push('1 kg = 1000 g.'); solucion.push({ texto: 'Expresamos la masa de A en kilogramos.', ecuacion: [`m_A = ${icFmt(c.gA)} ÷ 1000 = ${icFmt(ma)} kg`] }); }
      if (c.enKmh) { datos.push('1 km = 1000 m; 1 h = 3600 s.'); solucion.push({ texto: 'Convertimos las tres velocidades dadas a metros por segundo.', ecuacion: [`u_A,x = ${icN(c.uA)} ÷ 3,6 = ${icFmt(ua)} m/s; u_B,x = ${icN(c.uB)} ÷ 3,6 = ${icFmt(ub)} m/s; v_A,x = ${icN(c.vA)} ÷ 3,6 = ${icFmt(va)} m/s`] }); }
      if (c.Fext != null) datos.push('La fuerza externa neta es constante: I_ext,x = F_ext,x · Δt.');
      const cuentaI = `${icFmt(ma)} · ${icN(ua)} + ${icFmt(mb)} · ${icN(ub)}${esTres ? ` + ${icFmt(c.mC)} · ${icN(c.uC)}` : ''}`;
      if (ie === 0) solucion.push({ texto: 'Sumamos las cantidades de movimiento antes del cambio. Sin impulso externo apreciable, el total final es el mismo.', ecuacion: [`P_f,x = P_i,x = ${cuentaI} = ${icFmt(pi)} kg·m/s`] });
      else solucion.push({ texto: 'Sumamos las cantidades de movimiento antes del cambio.', ecuacion: [`P_i,x = ${cuentaI} = ${icFmt(pi)} kg·m/s`] },
        { texto: 'Sumamos al total inicial el impulso externo que entra al sistema.', ecuacion: [`P_f,x = ${icN(pi)} + ${icN(ie)} = ${icFmt(pi + ie)} kg·m/s`] });
      const cuentaAporte = esTres ? `(${icFmt(ma)} · ${icN(va)} + ${icFmt(mb)} · ${icN(c.vB)})` : `${icFmt(ma)} · ${icN(va)}`;
      solucion.push({ texto: esTres ? 'Al total final le restamos lo que aportan A y B después, y dividimos entre la masa de C.' : 'Al total final le restamos lo que aporta A después, y dividimos entre la masa de B.', ecuacion: [simbolo, ` = (${icN(pi + ie)} − ${cuentaAporte}) ÷ ${icFmt(divisor)} = `, icValor(resultado, unidad, color)] });
      add('signo', -resultado, 'Bien el tamaño; invertiste el sentido de la velocidad.');
      add('sin-dividir', pi + ie - aporte, 'Bien hallar la componente pendiente; falta dividir entre masa.');
      add('suma-conocido', (pi + ie + aporte) / divisor, 'Bien el total; sumaste la contribución conocida en vez de restarla.');
      add('misma', va, 'Bien leer la velocidad de A; no tiene que repetirse en el otro cuerpo.');
      add('sin-externo', (pi - aporte) / divisor, 'Bien el balance interno; omitiste el impulso externo.');
      add('total-cero', -aporte / divisor, 'Bien compensar; supusiste que el total inicial siempre es cero.');
      add('aporte-doble', (pi + ie - 2 * aporte) / divisor, 'Bien el total; restaste dos veces la contribución conocida.');
      add('masa-doble', resultado / 2, 'Bien despejar; contaste dos veces la masa del cuerpo buscado.');
      if (esTres) add('sin-b', (pi - ma * va) / divisor, 'Bien la contribución de A; falta la de B.');
    }
    resultado = icRed(resultado);
    const dibujo = icSistemaFigura({ ...c, dadoVB: tipo === 'diagnostico' || tipo === 'fuerza-sistema' });
    if (tipo === 'total') dibujo.datos = { ...dibujo.datos, alto: 192, objetos: dibujo.datos.objetos.filter(o => o.y < 180), flechas: dibujo.datos.flechas.filter(o => o.de[1] < 180), textos: dibujo.datos.textos.filter(o => o.y < 180), lineas: dibujo.datos.lineas.filter(o => o.de[1] < 190 && o.a[1] < 190) };
    // El esquema de dos cuerpos no puede representar un problema de tres.
    if (tipo === 'tres') { dibujo.datos.objetos = [{ tipo: 'carrito', x: 60, y: 125, w: 48, h: 22, texto: 'A', mango: 0 }, { tipo: 'carrito', x: 160, y: 125, w: 48, h: 22, texto: 'B', mango: 0 }, { tipo: 'carrito', x: 260, y: 125, w: 48, h: 22, texto: 'C', mango: 0 }]; dibujo.datos.alto = 180; dibujo.datos.flechas = []; dibujo.datos.lineas = []; dibujo.datos.textos = [{ x: 160, y: 24, texto: 'Sistema: los tres carritos', ancla: 'middle' }, { x: 160, y: 157, texto: 'v_C,x = ?', ancla: 'middle' }]; dibujo.datos.alt = 'Los tres carritos A, B y C dentro del sistema. La velocidad de C está por hallar; los datos están en el enunciado.'; }
    return { enunciado, datos, dibujo, solucion, respuesta: [simbolo, ' = ', icValor(resultado, unidad, color)], resultado, unidad, color, errores, verificacion: { familia: 'sistema', ...c } };
  }

  const icImpEjCasos = [
    { nivel: 1, titulo: 'Un pulso rectangular', tipo: 'rect', F: 6, dt: 0.4 },
    { nivel: 1, titulo: 'El impulso hacia la izquierda', tipo: 'rect', F: -8, dt: 0.25 },
    { nivel: 1, titulo: 'Un pulso triangular', tipo: 'tri', F: 12, dt: 0.5 },
    { nivel: 1, titulo: 'La pelota empieza a moverse', tipo: 'cambio', m: 0.4, vi: 0, vf: 5 },
    { nivel: 1, titulo: 'La pelota se detiene', tipo: 'cambio', m: 0.5, vi: 3, vf: 0 },
    { nivel: 2, titulo: 'La pelota cambia de sentido', tipo: 'cambio', m: 0.25, vi: 4, vf: -6 },
    { nivel: 2, titulo: 'La fuerza media del frenado', tipo: 'fuerza', m: 0.5, vi: 6, vf: 0, dt: 0.3 },
    { nivel: 2, titulo: 'La velocidad después del pulso', tipo: 'final', m: 0.4, vi: 2, F: 6, dt: 0.2 },
    { nivel: 2, titulo: 'La duración necesaria', tipo: 'tiempo', m: 0.5, vi: 4, vf: 0, F: -5 },
    { nivel: 2, titulo: 'El impulso invierte el movimiento', tipo: 'final', m: 0.6, vi: -1, F: 12, dt: 0.1 },
    { nivel: 3, titulo: 'El triángulo cambia la velocidad', tipo: 'final', forma: 'tri', m: 0.5, vi: -2, F: 10, dt: 0.4 },
    { nivel: 3, titulo: 'Dos tramos de frenado', tipo: 'tramos', m: 0.4, vi: 5, F1: -8, dt1: 0.2, F2: -4, dt2: 0.1 },
    { nivel: 3, titulo: 'Gramos, milisegundos y rebote', tipo: 'fuerza-ms', g: 300, vi: 5, vf: -3, ms: 150 },
    { nivel: 3, titulo: 'Pulsos en sentidos contrarios', tipo: 'tramos', m: 0.5, vi: -4, F1: 10, dt1: 0.3, F2: -5, dt2: 0.1 },
    { nivel: 3, titulo: 'Duración de un pulso triangular', tipo: 'tiempo-tri', m: 0.25, vi: 6, vf: -2, F: -10 },
  ];
  const icSisEjCasos = [
    { nivel: 1, titulo: 'Dos carritos hacia la derecha', tipo: 'total', mA: 3, uA: 4, mB: 2, uB: 3 },
    { nivel: 1, titulo: 'El total tiene sentido', tipo: 'total', mA: 3, uA: 2, mB: 2, uB: -4 },
    { nivel: 1, titulo: 'Un carrito está quieto', tipo: 'total', mA: 2, uA: -3, mB: 4, uB: 0 },
    { nivel: 1, titulo: 'El resorte separa los carritos', tipo: 'retroceso', mA: 1, mB: 3, vA: -6 },
    { nivel: 1, titulo: 'El carrito pesado sale despacio', tipo: 'retroceso', mA: 2, mB: 4, vA: 4 },
    { nivel: 2, titulo: 'Los dos ya se movían', tipo: 'desconocida', mA: 2, uA: 5, mB: 4, uB: -1, vA: 1 },
    { nivel: 2, titulo: 'A se detiene después', tipo: 'desconocida', mA: 3, uA: -2, mB: 2, uB: 5, vA: 0 },
    { nivel: 2, titulo: 'Entra impulso al sistema', tipo: 'externo', mA: 2, uA: 3, mB: 3, uB: 0, vA: 1, Iext: 2 },
    { nivel: 2, titulo: 'El total permite comprobar', tipo: 'diagnostico', mA: 2, uA: 3, mB: 4, uB: 0, vA: 1, vB: 2 },
    { nivel: 2, titulo: 'La masa viene en gramos', tipo: 'retroceso-gramos', gA: 500, mB: 2, vA: -8 },
    { nivel: 3, titulo: 'Tres cuerpos, un sistema', tipo: 'tres', mA: 2, uA: 3, mB: 3, uB: -2, mC: 1, uC: 0, vA: -1, vB: 1 },
    { nivel: 3, titulo: 'Una fuerza externa durante un intervalo', tipo: 'pulso', mA: 2, uA: 4, mB: 3, uB: -1, vA: 2, Fext: 5, dt: 0.4 },
    { nivel: 3, titulo: 'Velocidades en kilómetros por hora', tipo: 'desconocida', enKmh: true, mA: 3, uA: 18, mB: 2, uB: -10.8, vA: 7.2 },
    { nivel: 3, titulo: 'El total no empieza en cero', tipo: 'tres', mA: 1, uA: 5, mB: 2, uB: -1, mC: 3, uC: 0, vA: -2, vB: 1 },
    { nivel: 3, titulo: 'Medir la fuerza sobre el sistema', tipo: 'fuerza-sistema', mA: 2, uA: 4, mB: 3, uB: -2, vA: 1, vB: 2, dt: 0.5 },
  ];
  function icEjemplos(casos, motor) {
    let letra = 0;
    return casos.map(c => {
      const b = motor(c), e = { nivel: c.nivel, titulo: c.titulo, enunciado: b.enunciado, datos: b.datos, figura: b.dibujo, solucion: b.solucion.slice(), respuesta: b.respuesta, verificacion: b.verificacion };
      if (c.nivel === 3) {
        const errores = icErroresUnicos(b).slice(0, 4);
        if (errores.length !== 4) throw new Error('Faltan errores distintos: ' + c.titulo);
        const opciones = errores.map(x => `${icFmt(x.valor)} ${b.unidad}`);
        opciones.splice(letra++, 0, `${icFmt(b.resultado)} ${b.unidad}`); e.alternativas = opciones;
        e.solucion.push({ texto: errores.map(x => `${icFmt(x.valor)}: ${x.siFuera.split(' Así sale ')[0].replace(/^Bien [^;]+; /, '')}`).join(' ') });
      }
      return e;
    });
  }
  const icImpEjemplos = icEjemplos(icImpEjCasos, icImpCaso);
  const icSisEjemplos = icEjemplos(icSisEjCasos, icSistemaCaso);

  // Bancos separados por intervalo de masas/velocidades; no dependen del reloj ni de Math.random.
  function icImpGenerar(semilla, resuelto) {
    const tipos = ['cambio', 'fuerza', 'final', 'tramos', 'fuerza-ms', 'tiempo-tri'];
    const tipo = tipos[Math.abs(semilla) % tipos.length], k = 1 + Math.floor(Math.abs(semilla) / tipos.length) % 9;
    const m = (resuelto ? 1 : 0.25) + k * 0.25, vi = resuelto ? -7 : 7;
    let c;
    if (tipo === 'cambio') c = { tipo, m, vi, vf: resuelto ? 2 : -2 };
    if (tipo === 'fuerza') c = { tipo, m, vi, vf: resuelto ? 1 : -1, dt: [0.1, 0.2, 0.25, 0.4, 0.5][k % 5] };
    if (tipo === 'final') c = { tipo, forma: k % 2 ? 'tri' : 'rect', m: resuelto ? 1 : 0.5, vi, F: (resuelto ? 4 : -4) * k, dt: 0.25 };
    if (tipo === 'tramos') c = { tipo, m: resuelto ? 1 : 0.5, vi, F1: (resuelto ? 4 : -4) * k, dt1: 0.25, F2: resuelto ? -4 : 4, dt2: 0.125 };
    if (tipo === 'fuerza-ms') c = { tipo, g: (resuelto ? 1200 : 600) + k * 100, vi, vf: resuelto ? 3 : -3, ms: [100, 200, 250, 400, 500][k % 5] };
    if (tipo === 'tiempo-tri') c = { tipo, m, vi, vf: resuelto ? 1 : -1, F: resuelto ? 16 : -16 };
    return icImpCaso(c);
  }
  function icSisGenerar(semilla, resuelto) {
    const tipos = ['total', 'retroceso', 'desconocida', 'externo', 'diagnostico', 'tres', 'fuerza-sistema'];
    const tipo = tipos[Math.abs(semilla) % tipos.length], k = 1 + Math.floor(Math.abs(semilla) / tipos.length) % 11;
    const mA = resuelto ? 6 : 5, mB = 2, uA = resuelto ? -4 : 4, uB = resuelto ? 1 : -1, vA = resuelto ? -k : k;
    let c = { tipo, mA, mB, uA, uB, vA };
    if (tipo === 'retroceso') c = { tipo, mA, mB, vA };
    if (tipo === 'externo') c.Iext = resuelto ? -2 * k : 2 * k;
    if (tipo === 'diagnostico' || tipo === 'fuerza-sistema') c.vB = resuelto ? 3 : -3;
    if (tipo === 'tres') c = { tipo, mA, mB, mC: 2, uA, uB, uC: 0, vA, vB: resuelto ? 2 : -2 };
    if (tipo === 'fuerza-sistema') c.dt = 0.5;
    return icSistemaCaso(c);
  }
  function icResuelve(b) {
    return { enunciado: b.enunciado, datos: b.datos, dibujo: b.dibujo, respuesta: b.respuesta, verificacion: b.verificacion,
      pasos: [{ tipo: 'pide', texto: b.verificacion.familia === 'impulso' ? 'Identificamos la magnitud que se pide y el cuerpo al que pertenece.' : 'Identificamos la magnitud que se pide y el sistema al que pertenece.' },
        { tipo: 'regla', texto: b.verificacion.familia === 'impulso' ? 'El impulso neto es el cambio de cantidad de movimiento.' : 'La suma del sistema cambia según el impulso que recibe desde fuera.' },
        ...b.solucion.map(s => ({ tipo: 'cuentas', ...s })),
        { tipo: 'sentido', texto: b.unidad === 's' ? 'La duración es positiva; el signo del impulso lo da la fuerza.' : 'El signo indica el sentido horizontal. No sustituimos una componente por su módulo.' }] };
  }
  function icAhora(b) {
    return { pregunta: b.enunciado, datos: b.datos, dibujo: b.dibujo, opciones: icOpciones(b), verificacion: b.verificacion,
      solucion: { texto: 'El balance usa los signos y las unidades del mismo eje.', ecuacion: [icCuentaDirecta(b.verificacion), ' = ', icValor(b.resultado, b.unidad, b.color)] } };
  }
  // La solución breve conserva todos los datos originales, incluidas las conversiones.
  function icCuentaDirecta(c) {
    const n = icN, m = c.g == null ? n(c.m) : `(${n(c.g)} ÷ 1000)`, dt = c.ms == null ? n(c.dt) : `(${n(c.ms)} ÷ 1000)`;
    if (c.familia === 'impulso') {
      const delta = `(${n(c.vf)} − ${n(c.vi)})`, tri = c.tipo.includes('tri') || c.forma === 'tri';
      const I = c.tipo === 'tramos' ? `${n(c.F1)} · ${n(c.dt1)} + ${n(c.F2)} · ${n(c.dt2)}`
        : c.F != null && c.dt != null ? `${n(c.F)} · ${dt}${tri ? ' ÷ 2' : ''}` : `${m} · ${delta}`;
      if (c.tipo === 'final' || c.tipo === 'tramos') return `${n(c.vi)} + (${I}) ÷ ${m}`;
      if (c.tipo.startsWith('fuerza')) return `(${I}) ÷ ${dt}`;
      if (c.tipo.startsWith('tiempo')) return `${tri ? '2 · ' : ''}${m} · ${delta} ÷ ${n(c.F)}`;
      return I;
    }
    const ma = c.gA == null ? n(c.mA) : `(${n(c.gA)} ÷ 1000)`, mb = n(c.mB);
    const velocidad = v => c.enKmh ? `(${n(v || 0)} ÷ 3,6)` : n(v || 0);
    const pi = `${ma} · ${velocidad(c.uA)} + ${mb} · ${velocidad(c.uB)}${c.tipo === 'tres' ? ` + ${n(c.mC)} · ${velocidad(c.uC)}` : ''}`;
    if (c.tipo === 'total') return pi;
    const pf = `${ma} · ${velocidad(c.vA)} + ${mb} · ${velocidad(c.vB)}`;
    if (c.tipo === 'diagnostico' || c.tipo === 'fuerza-sistema') return `(${pf} − (${pi}))${c.tipo === 'fuerza-sistema' ? ` ÷ ${n(c.dt)}` : ''}`;
    const ie = c.Fext != null ? `${n(c.Fext)} · ${n(c.dt)}` : n(c.Iext || 0);
    const conocido = `${ma} · ${velocidad(c.vA)}${c.tipo === 'tres' ? ` + ${mb} · ${velocidad(c.vB)}` : ''}`;
    return `((${pi}) + ${ie} − (${conocido})) ÷ ${n(c.tipo === 'tres' ? c.mC : c.mB)}`;
  }
  const icImpJuego = val => { const tt = Math.min(0.5, Math.max(0, val.t)), vf = 4 + val.F; return icImpFigura({ juego: true, tipo: 'final', m: 0.5, vi: 4, vf, F: val.F, dt: 0.5 }, true, tt); };
  const icResorteVel = compresion => Math.sqrt(400 * compresion * compresion / (2 + 2));
  const icSisJuego = val => { const v = icResorteVel(val.c); return icSistemaFigura({ juego: true, compresion: val.c, mA: 2, mB: 2, uA: 0, uB: 0, vA: -v, vB: v }, true, val.t); };
  const icImpPredI = 0.5 * (0 - 8), icImpPredFA = icImpPredI / 0.2, icImpPredFB = icImpPredI / 0.4;
  const icSisPredVB = -(1 * -3) / 3;
  function icImpMira(paso) {
    const d = icImpFigura({ tipo: 'fuerza', m: 0.5, vi: 8, vf: 0, dt: 0.4 }, true).datos;
    d.alto = 250;
    d.textos.push({ x: 160, y: 182, texto: `I_x = ${icFmt(icImpPredI)} N·s`, color: 'i', ancla: 'middle' });
    if (paso > 0) d.textos.push({ x: 160, y: 210, texto: `A: F_media,x = ${icFmt(icImpPredFA)} N`, color: 'h', ancla: 'middle' });
    if (paso > 1) d.textos.push({ x: 160, y: 238, texto: `B: F_media,x = ${icFmt(icImpPredFB)} N`, color: 'h', ancla: 'middle' });
    return d;
  }

  // Choques y restitución. Los datos son ensayos didácticos, no mediciones reales.
  // m: violeta; v: naranja; p e I: turquesa; F: carmín; t: verde; energía y e: tinta.
  const crQ = (c, s) => c === 'tinta' ? String(s) : ({ v: `c-${c}`, t: String(s) });
  const crS = (s, sub) => ({ sub: [s, sub] });
  const crM = crQ('f', 'm'), crV = crQ('o', 'v'), crP = crQ('i', 'P');
  const crEC = { sub: ['E', 'C'] }, crH = 'h', crE = 'e';
  const crF = n => Kit.formatear(n, 3);
  // Las alternativas no llevan «≈»: si solo una lo llevaba, delataba cuál era (auditoría, 26 nov). La respuesta sí lo lleva.
  const sinAprox = t => String(t).replace(/^≈ /, '');
  const crExacto = n => Math.abs(n * 1000 - Math.round(n * 1000)) < 1e-8;
  const crN = n => n < 0 ? `(${crF(n)})` : crF(n);
  const crValor = (n, u = '') => `${crExacto(n) ? '' : '≈ '}${crF(n)}${u ? ` ${u}` : ''}`;
  const crIgual = (s, cuenta, n, u, color = 'o', aproximar = false) =>
    [s, ' = ', cuenta, crExacto(n) && !aproximar ? ' = ' : ' ≈ ', crQ(color, `${crF(n)} ${u}`.trim())];
  const crRespuesta = (s, n, u, color) => [s, crExacto(n) ? ' = ' : ' ≈ ', crQ(color, `${crF(n)} ${u}`.trim())];
  const crPlano = x => Array.isArray(x) ? x.map(crPlano).join('') : x && typeof x === 'object'
    ? x.t !== undefined ? x.t : x.sub ? crPlano(x.sub[0]) + '_' + crPlano(x.sub[1])
      : x.sup ? crPlano(x.sup[0]) + '^' + crPlano(x.sup[1]) : x.frac ? '(' + crPlano(x.frac[0]) + ')/(' + crPlano(x.frac[1]) + ')' : ''
    : String(x == null ? '' : x);
  const crCond = 'Impulso externo horizontal despreciable durante el choque; derecha positiva.';
  const crDatosP = [crS(crM, 'A'), '·', crS(crV, 'A,i'), ' + ', crS(crM, 'B'), '·', crS(crV, 'B,i'), ' = (', crS(crM, 'A'), ' + ', crS(crM, 'B'), ')·', crS(crV, 'f')];
  const crDatosK = [crEC, ' = ½·', crM, '·', { sup: [crV, '2'] }, '; para dos cuerpos se suman sus energías.'];
  const crDatosE = [crE, ' = ', { frac: [[crS(crV, 'B,f'), ' − ', crS(crV, 'A,f')], [crS(crV, 'A,i'), ' − ', crS(crV, 'B,i')]] }];
  function crUnion(c) {
    const M = c.a + c.b, P = c.a * c.u + c.b * c.w, V = P / M;
    const Ki = (c.a * c.u * c.u + c.b * c.w * c.w) / 2, Kf = M * V * V / 2;
    return { M, P, V, Ki, Kf, perdida: Ki - Kf };
  }
  function crImpacto(c, e = 1) {
    const M = c.a + c.b, P = c.a * c.u + c.b * c.w, r = e * (c.u - c.w);
    return { va: (P - c.b * r) / M, vb: (P + c.a * r) / M, P, M, r };
  }
  // Cada fila separa rótulos, flechas y objeto. La incógnita nunca aparece a escala.
  function crCarros(c, estado = {}) {
    // Una sola pista: A a la izquierda y B a la derecha, como en el choque (lector en frío, 26 nov: en dos pistas no
    // parecía que chocaran). Los rótulos van sobre cada carrito.
    const despues = !!estado.despues, unido = !!estado.unido, reloj = estado.reloj || 0;
    const ins = despues ? 'f' : 'i';
    const filas = despues ? (unido ? [{ nombre: 'Conjunto', m: c.a + c.b, v: estado.va, x: 160, w: 104, sim: 'v_f' }]
      : [{ nombre: 'A', m: c.a, v: estado.va, x: 84, w: 60, sim: 'v_A,f' }, { nombre: 'B', m: c.b, v: estado.vb, x: 236, w: 60, sim: 'v_B,f' }])
      : [{ nombre: 'A', m: c.a, v: c.u, x: 84, w: 60, sim: `v_A,${ins}` }, { nombre: 'B', m: c.b, v: c.w, x: 236, w: 60, sim: `v_B,${ins}` }];
    const maxV = Math.max(4, ...filas.map(x => Math.abs(x.v || 0)));
    const objetos = [], textos = [], flechas = [], lineas = [{ de: [8, 150], a: [312, 150] }];
    filas.forEach(x => {
      const cx = x.x + 3 * (x.v || 0) * reloj;
      textos.push({ x: x.x, y: 22, texto: `${x.nombre}: ${crF(x.m)} kg`, color: 'f', ancla: 'middle' });
      textos.push({ x: x.x, y: 48, texto: x.v == null ? `${x.sim} = ?` : `${x.sim} = ${crF(x.v)} m/s`, color: x.v == null ? 'tinta' : 'o', ancla: 'middle' });
      if (x.v) flechas.push({ de: [cx, 78], largo: Math.max(18, 60 * Math.abs(x.v) / maxV), ang: x.v > 0 ? 0 : 180, color: 'o' });
      objetos.push({ tipo: 'carrito', x: cx, y: 148, w: x.w, h: 24, mango: 0, texto: x.nombre });
    });
    textos.push({ x: 12, y: 176, texto: despues ? 'Después del impacto' : 'Antes del impacto', tam: 11 });
    textos.push({ x: 12, y: 200, texto: estado.extra || 'Derecha positiva; dibujo sin escala.', tam: 11 });
    return { pieza: 'fis-estatica', datos: { alto: 210, objetos, textos, flechas, lineas,
      alt: `${despues ? 'Después' : 'Antes'}, en la misma pista: ${filas.map(x => `carrito ${x.nombre}, masa ${crF(x.m)} kg, ${x.v == null ? 'velocidad por hallar' : `velocidad horizontal ${crF(x.v)} m/s`}`).join('; ')}. Dibujo sin escala.` }, estado: {} };
  }
  function crPelota(H, h, estado = {}) {
    // El piso, la altura de caída H y la de rebote h se marcan con cotas (lector en frío, 26 nov: la pelota flotaba y no
    // se veía dónde estaban H ni h). La cota de h solo es proporcional cuando el valor ya se muestra.
    const t = estado.reloj || 0, mostrar = estado.revelar && h != null;
    const piso = 182, arriba = 40, yh = piso - (piso - arriba) * (mostrar ? Math.min(1, h / H) : 0.5);
    const r = 12, y = estado.rebota ? piso - r - (piso - r - (yh + r)) * 4 * t * (1 - t) : arriba + r + (piso - arriba - 2 * r) * t * t;
    const textos = [{ x: 12, y: 30, texto: `H = ${crF(H)} m` }, { x: 12, y: 56, texto: mostrar ? `h = ${crF(h)} m` : 'h = ?' },
      { x: 12, y: 82, texto: estado.e == null ? 'e = ?' : `e = ${crF(estado.e)}` },
      { x: 166, y: (piso + arriba) / 2 + 5, texto: 'H', ancla: 'end' }, { x: 304, y: piso - yh < 30 ? yh - 6 : (piso + yh) / 2 + 5, texto: 'h', ancla: 'end' },
      { x: 12, y: 206, texto: 'Alturas del centro, desde el contacto.', tam: 11 }, { x: 12, y: 226, texto: 'Dibujo sin escala.', tam: 11 }];
    const lineas = [{ de: [120, piso], a: [312, piso] },
      { de: [174, arriba], a: [174, piso], discontinua: true }, { de: [168, arriba], a: [180, arriba] },
      { de: [284, yh], a: [284, piso], discontinua: true }, { de: [278, yh], a: [290, yh] }];
    return { pieza: 'fis-estatica', datos: { alto: 236, objetos: [{ tipo: 'pelota', x: 230, y, r }], textos, lineas,
      alt: `Pelota sobre un piso fijo. Altura de caída H = ${crF(H)} m; ${mostrar ? `altura de rebote h = ${crF(h)} m` : 'altura de rebote por hallar'}. Las cotas marcan las alturas del centro desde el contacto. Dibujo sin escala.` }, estado: {} };
  }
  function crJuegoUnion(s) {
    const q = crUnion({ a: 2, b: s.b, u: s.u, w: 0 }), despues = s.t >= 0.8;
    // El reloj es progreso normalizado, no segundos. El mismo cambio de escala
    // temporal se aplica a ambos tramos: antes u; después V.
    const avance = despues ? 170 * (s.t - 0.8) * q.V / s.u : 0;
    const xA = despues ? 201 + avance : 65 + 170 * s.t, xB = 245 + avance;
    const textos = [{ x: 12, y: 20, texto: 'm_A = 2 kg', color: 'f' }, { x: 180, y: 20, texto: `m_B = ${crF(s.b)} kg`, color: 'f' },
      { x: 12, y: 48, texto: despues ? `v_f ${crExacto(q.V) ? '=' : '≈'} ${crF(q.V)} m/s` : `v_A,i = ${crF(s.u)} m/s`, color: 'o' },
      { x: 12, y: 74, texto: despues ? 'Los acoples quedan unidos.' : 'B está inicialmente quieto.' },
      { x: 12, y: 192, texto: `E_C inicial: ${crValor(q.Ki, 'J')}` },
      { x: 12, y: 218, texto: `E_C final: ${crValor(q.Kf, 'J')}` },
      { x: 12, y: 242, texto: 'Derecha positiva; dibujo sin escala.', tam: 11 }];
    const flechas = [{ de: [despues ? (xA + xB) / 2 : xA, 105], ang: 0,
      largo: Math.max(18, (despues ? q.V : s.u) * 9), color: 'o' }];
    return { pieza: 'fis-estatica', datos: { alto: 255, textos, flechas,
      objetos: [{ tipo: 'carrito', x: xA, y: 160, w: 44, h: 22, mango: 0, texto: 'A' }, { tipo: 'carrito', x: xB, y: 160, w: 44, h: 22, mango: 0, texto: 'B' }],
      lineas: [{ de: [12, 165], a: [308, 165] }], alt: `${despues ? 'Los carritos avanzan unidos' : 'A se acerca a B, inicialmente quieto'}. A tiene 2 kg y B ${crF(s.b)} kg. Derecha positiva. Dibujo sin escala.` }, estado: {} };
  }
  function crCaso(c) {
    const errores = [], pasos = [];
    let resultado, unidad = 'm/s', color = 'o', simbolo = crS(crV, 'f'), enunciado, dibujo;
    let datos = [], motivo;
    const agrega = (id, valor, frase) => {
      if (Number.isFinite(valor)) errores.push({ id, valor, error: `CH-${id.toUpperCase()}`, siFuera: `${frase} Sale ${crValor(valor, unidad)}.` });
    };
    const eq = (texto, ecuacion) => pasos.push({ texto, ecuacion });
    if (['union', 'perdida', 'subida', 'frenado'].includes(c.tipo)) {
      const q = crUnion(c), nP = `${crF(c.a)}·${crN(c.u)} + ${crF(c.b)}·${crN(c.w)}`;
      datos = [crCond, crDatosP, 'A y B son los carritos; i indica antes y f después del choque.'];
      const entrada = ['A, de ', crQ('f', `${crF(c.a)} kg`), ', llega con ', crQ('o', `${crF(c.u)} m/s`), '; B, de ', crQ('f', `${crF(c.b)} kg`), ', con ', crQ('o', `${crF(c.w)} m/s`), '. Quedan unidos. '];
      dibujo = crCarros(c, { extra: c.tipo === 'subida' ? 'Luego suben por una rampa lisa.' : c.tipo === 'frenado' ? 'Frenan en una pista horizontal rugosa.' : 'Los acoples quedan unidos.' });
      eq('La cantidad de movimiento total fija la velocidad conjunta.', crIgual(crS(crV, 'f'), `(${nP}) ÷ ${crF(q.M)}`, q.V, 'm/s'));
      if (c.tipo === 'union') {
        resultado = q.V; enunciado = [...entrada, '¿Cuál es su velocidad conjunta?'];
        motivo = 'El signo indica el sentido; ambos carritos comparten esta velocidad.';
        agrega('sin-b', c.a * c.u / q.M, 'Bien sumar masas; omitiste el movimiento de B.');
        agrega('rapideces', (c.a * Math.abs(c.u) + c.b * Math.abs(c.w)) / q.M, 'Bien ponderar masas; sumaste rapideces sin sentidos.');
        agrega('solo-masa-a', q.P / c.a, 'Bien sumar cantidades de movimiento; dividiste entre una sola masa.');
        agrega('promedio', (c.u + c.w) / 2, 'Bien considerar ambas velocidades; calculaste su promedio simple.');
        agrega('sin-dividir', q.P, 'Bien sumar cantidades de movimiento; falta dividir entre la masa total.');
        agrega('signo', -q.V, 'Bien el módulo; invertiste el sentido final.');
        agrega('doble-masa', q.P / (2 * q.M), 'Bien sumar masas; duplicaste el divisor.');
      } else if (c.tipo === 'perdida') {
        resultado = q.perdida; unidad = 'J'; color = 'tinta'; simbolo = 'E_transformada';
        enunciado = [...entrada, '¿Cuánta energía cinética se transforma durante el choque?'];
        datos.push(crDatosK);
        eq('Sumamos las energías cinéticas anteriores al choque.', crIgual(crS(crEC, 'i'), `½·${crF(c.a)}·${crN(c.u)}² + ½·${crF(c.b)}·${crN(c.w)}²`, q.Ki, 'J', 'tinta'));
        eq('La energía que falta ya no es energía cinética del conjunto.', crIgual(simbolo, `${crF(q.Ki)} − ½·${crF(q.M)}·${crN(q.V)}²`, resultado, 'J', 'tinta', !crExacto(q.V)));
        motivo = 'La cantidad de movimiento se conserva; parte de la energía cinética cambia de forma.';
        agrega('energia-inicial', q.Ki, 'Bien hallar la energía inicial; no restaste la final.');
        agrega('energia-final', q.Kf, 'Bien hallar la energía final; preguntan por la transformada.');
        agrega('resta-invertida', -q.perdida, 'Bien comparar energías; invertiste la resta.');
        agrega('masa-total-relativa', q.M * (c.u - c.w) ** 2 / 2, 'Bien usar la rapidez relativa; usaste toda la masa.');
        agrega('solo-a-relativa', c.a * (c.u - c.w) ** 2 / 2, 'Bien usar la rapidez relativa; omitiste la masa receptora.');
      } else {
        const g = 10, factor = c.tipo === 'frenado' ? c.mu : 1;
        resultado = q.V * q.V / (2 * g * factor); unidad = 'm'; color = 'tinta'; simbolo = c.tipo === 'subida' ? 'h' : 'd';
        enunciado = [...entrada, c.tipo === 'subida' ? 'Luego ascienden sin rozamiento. ¿Qué altura máxima alcanzan?' : `Luego frenan con μ = ${crF(c.mu)}. ¿Qué distancia recorren hasta detenerse?`];
        datos.push(c.tipo === 'frenado' ? 'g = 10 m/s² (aproximación). Con ruedas bloqueadas, los carritos deslizan sobre una pista horizontal.' : 'g = 10 m/s² (aproximación del ejercicio).');
        datos.push(c.tipo === 'subida' ? '½·M·v_f² = M·g·h, después del choque; M es la masa conjunta.' : '½·M·v_f² = μ·M·g·d; M es la masa conjunta y μ, el coeficiente de rozamiento cinético.');
        eq(c.tipo === 'subida' ? 'Después del choque, la energía cinética se transforma en energía potencial.' : 'Después del choque, el rozamiento retira la energía cinética restante.',
          crIgual(simbolo, `${crN(q.V)}² ÷ (2·${crF(g)}${factor !== 1 ? `·${crF(factor)}` : ''})`, resultado, 'm', 'tinta', !crExacto(q.V)));
        motivo = 'Se separan dos intervalos: el impacto y el movimiento posterior.';
        agrega('velocidad-llegada', c.u * c.u / (2 * g * factor), 'Bien usar energía después; conservaste la velocidad de llegada.');
        agrega('sin-mitad', q.V * q.V / (g * factor), 'Bien elevar la velocidad; omitiste el factor dos.');
        agrega('sin-cuadrado', Math.abs(q.V) / (2 * g * factor), 'Bien usar la velocidad conjunta; faltó elevarla al cuadrado.');
        agrega('energia-antes', q.Ki / (q.M * g * factor), 'Bien convertir energía; conservaste la energía cinética durante la adhesión.');
        agrega('masa-extra', q.V * q.V / (2 * q.M * g * factor), 'Bien incluir ambas masas; faltó cancelarlas en la ecuación.');
        if (factor !== 1) agrega('sin-roce', q.V * q.V / (2 * g), 'Bien separar el impacto; omitiste el coeficiente de rozamiento.');
      }
    } else if (['elastico-a', 'elastico-b', 'restitucion-a', 'restitucion-b'].includes(c.tipo)) {
      const esE = c.tipo.startsWith('elastico'), e = esE ? 1 : c.e, q = crImpacto(c, e), esA = c.tipo.endsWith('-a');
      resultado = esA ? q.va : q.vb; simbolo = crS(crV, esA ? 'A,f' : 'B,f');
      enunciado = ['A, de ', crQ('f', `${crF(c.a)} kg`), ', lleva ', crQ('o', `${crF(c.u)} m/s`), '; B, de ', crQ('f', `${crF(c.b)} kg`), ', lleva ', crQ('o', `${crF(c.w)} m/s`), `. Chocan ${esE ? 'elásticamente' : `con e = ${crF(e)}`}. ¿Qué velocidad final tiene ${esA ? 'A' : 'B'}?`];
      dibujo = crCarros(c);
      datos = [crCond, 'A está a la izquierda de B; i indica antes y f después.',
        'm_A·v_A,i + m_B·v_B,i = m_A·v_A,f + m_B·v_B,f.',
        esE ? 'Choque elástico frontal: v_B,f − v_A,f = v_A,i − v_B,i.' : crDatosE];
      eq('La cantidad de movimiento total se conserva en el choque.', crIgual(crS(crP, 'total,x'), `${crF(c.a)}·${crN(c.u)} + ${crF(c.b)}·${crN(c.w)}`, q.P, 'kg·m/s', 'i'));
      eq(esE ? 'En el choque elástico, se separan con la rapidez relativa con que se acercaban.' : 'La separación final es e veces el acercamiento inicial.', crIgual([crS(crV, 'B,f'), ' − ', crS(crV, 'A,f')], `${esE ? '' : `${crF(e)}·`}(${crN(c.u)} − ${crN(c.w)})`, q.r, 'm/s'));
      const expr = esA ? `(${crF(q.P)} − ${crF(c.b)}·${crF(q.r)}) ÷ ${crF(q.M)}` : `(${crF(q.P)} + ${crF(c.a)}·${crF(q.r)}) ÷ ${crF(q.M)}`;
      eq(esA ? `Reemplazamos v_B,f = v_A,f + ${crF(q.r)} en ${crF(q.P)} = ${crF(c.a)}·v_A,f + ${crF(c.b)}·v_B,f y despejamos v_A,f.`
        : `Reemplazamos v_A,f = v_B,f − ${crF(q.r)} en ${crF(q.P)} = ${crF(c.a)}·v_A,f + ${crF(c.b)}·v_B,f y despejamos v_B,f.`, crIgual(simbolo, expr, resultado, unidad));
      motivo = 'La solución corresponde a cuerpos que se separan después de acercarse.';
      const union = q.P / q.M;
      agrega('adhesion', union, 'Bien conservar cantidad de movimiento; impusiste una velocidad común.');
      agrega('intercambio', esA ? q.vb : q.va, 'Bien hallar ambas salidas; intercambiaste los cuerpos.');
      agrega('sin-interaccion', esA ? c.u : c.w, 'Bien conservar el total; elegiste la solución sin interacción.');
      agrega('piso-fijo', esA ? -e * c.u : e * c.u, 'Bien usar el rebote; trataste al otro carrito como piso fijo.');
      agrega('signo-final', -resultado, 'Bien el módulo; invertiste el sentido final.');
      if (!esE) agrega('elasticidad', esA ? crImpacto(c, 1).va : crImpacto(c, 1).vb, 'Bien conservar cantidad de movimiento; supusiste elasticidad perfecta.');
      else agrega('media-separacion', esA ? (q.P - c.b * q.r / 2) / q.M : (q.P + c.a * q.r / 2) / q.M, 'Bien usar la separación; redujiste su rapidez a la mitad.');
    } else if (c.tipo === 'e-relativo') {
      resultado = (c.vb - c.va) / (c.u - c.w); unidad = ''; color = 'tinta'; simbolo = crE;
      enunciado = [`Antes del choque, A lleva ${crF(c.u)} m/s y B ${crF(c.w)} m/s. Después, llevan ${crF(c.va)} m/s y ${crF(c.vb)} m/s, respectivamente. ¿Cuál es el coeficiente de restitución?`];
      datos = ['A está a la izquierda de B; derecha positiva. i indica antes y f después.', crDatosE];
      dibujo = crCarros({ a: c.a || 1, b: c.b || 2, u: c.u, w: c.w }, { extra: `Después: A ${crF(c.va)}; B ${crF(c.vb)} m/s.` });
      eq('Restamos velocidades del mismo observador antes de formar el cociente.', crIgual(crE, `(${crN(c.vb)} − ${crN(c.va)}) ÷ (${crN(c.u)} − ${crN(c.w)})`, resultado, '', 'tinta'));
      motivo = 'El cociente no tiene unidad y corresponde a un impacto pasivo.';
      agrega('velocidad-sola', c.vb / c.u, 'Bien formar un cociente; usaste velocidades de cuerpos distintos.');
      agrega('otro-cuerpo', Math.abs(c.va / c.u), 'Bien comparar antes y después; omitiste el movimiento de B.');
      agrega('inversa', 1 / resultado, 'Bien hallar las rapideces relativas; invertiste el cociente.');
      agrega('suma-llegadas', (c.vb - c.va) / (c.u + c.w), 'Bien hallar la separación; sumaste las velocidades de llegada.');
      agrega('orden-resta', -resultado, 'Bien hallar los módulos; invertiste solo una resta.');
    } else if (c.tipo === 'salida-pared') {
      resultado = c.e * c.U; simbolo = 'v_rebote';
      enunciado = [`Una pelota llega perpendicularmente a una pared fija con rapidez ${crF(c.U)} m/s. El impacto tiene e = ${crF(c.e)}. ¿Con qué rapidez se separa?`];
      datos = ['Pared fija; impacto perpendicular.', 'v_rebote = e·v_llegada; ambas v representan rapideces.'];
      dibujo = crPelota(1, null, { e: c.e });
      // La figura específica muestra pared vertical y no alturas que el ejercicio no usa.
      dibujo = { pieza: 'fis-estatica', datos: { alto: 170, paredes: [{ x: 286, y0: 35, y1: 140 }], objetos: [{ tipo: 'pelota', x: 212, y: 110, r: 12 }], flechas: [{ de: [190, 65], ang: 0, largo: 70, color: 'o' }], textos: [{ x: 12, y: 22, texto: `Llegada: ${crF(c.U)} m/s`, color: 'o' }, { x: 12, y: 48, texto: `e = ${crF(c.e)}` }, { x: 12, y: 150, texto: 'Rapidez de rebote: ?' }], alt: `Pelota que llega a una pared fija con rapidez ${crF(c.U)} m/s. Rapidez de rebote por hallar.` }, estado: {} };
      eq('Con la pared fija, la rapidez relativa coincide con la de la pelota.', crIgual(simbolo, `${crF(c.e)}·${crF(c.U)}`, resultado, unidad));
      motivo = 'La pelota sale en sentido contrario; se pregunta por la rapidez, sin signo.';
      agrega('complemento', (1 - c.e) * c.U, 'Bien usar la llegada; multiplicaste por el complemento de e.');
      agrega('inversa-e', c.U / c.e, 'Bien usar el coeficiente; dividiste en vez de multiplicar.');
      agrega('e-cuadrado', c.e * c.e * c.U, 'Bien usar restitución; elevaste el coeficiente al cuadrado.');
      agrega('sin-restitucion', c.U, 'Bien identificar la llegada; supusiste un rebote perfectamente elástico.');
      agrega('suma-e', (1 + c.e) * c.U, 'Bien usar e; sumaste llegada y salida.');
    } else if (['altura', 'e-altura', 'rebote-tiempo'].includes(c.tipo)) {
      const g = 10, e = c.tipo === 'e-altura' ? Math.sqrt(c.h / c.H) : c.e;
      const U = Math.sqrt(2 * g * c.H), Vr = e * U, h = e * e * c.H;
      datos = ['Caída desde reposo; piso fijo y aire despreciable.', 'H y h son alturas del centro sobre el mismo nivel de contacto.', 'g = 10 m/s² (aproximación del ejercicio).'];
      dibujo = crPelota(c.H, null, { e: c.tipo === 'e-altura' ? undefined : e });
      if (c.tipo === 'e-altura') {
        resultado = e; unidad = ''; color = 'tinta'; simbolo = crE;
        enunciado = [`Una pelota cae desde ${crF(c.H)} m y rebota hasta ${crF(c.h)} m. ¿Cuál es el coeficiente de restitución con ese piso?`];
        datos.push('h = e²·H.');
        dibujo = crPelota(c.H, c.h, { revelar: true });
        eq('La razón de alturas es el cuadrado del coeficiente.', crIgual(crE, `√(${crF(c.h)} ÷ ${crF(c.H)})`, resultado, '', 'tinta'));
        motivo = 'Para pasar de alturas a rapideces se necesita la raíz cuadrada.';
        agrega('sin-raiz', c.h / c.H, 'Bien dividir alturas; omitiste la raíz cuadrada.');
        agrega('alturas-invertidas', c.H / c.h, 'Bien comparar alturas; invertiste el cociente y omitiste la raíz.');
        agrega('raiz-invertida', Math.sqrt(c.H / c.h), 'Bien usar raíz; invertiste la razón de alturas.');
        agrega('fraccion-perdida', 1 - c.h / c.H, 'Bien comparar alturas; calculaste la fracción de energía transformada.');
        agrega('complemento-e', 1 - resultado, 'Bien hallar la raíz; tomaste el complemento del coeficiente.');
      } else if (c.tipo === 'altura') {
        resultado = h; unidad = 'm'; color = 'tinta'; simbolo = crH;
        enunciado = [`Una pelota cae desde ${crF(c.H)} m sobre un piso con e = ${crF(c.e)}. ¿Qué altura máxima alcanza después del primer rebote?`];
        datos.push('h = e²·H.');
        eq('La altura depende del cuadrado de la rapidez de rebote.', crIgual(crH, `${crF(e)}²·${crF(c.H)}`, resultado, 'm', 'tinta'));
        motivo = 'Este vínculo entre alturas requiere el mismo piso fijo y ninguna resistencia del aire.';
        agrega('e-lineal', e * c.H, 'Bien usar el coeficiente; faltó elevarlo al cuadrado.');
        agrega('altura-inversa', c.H / (e * e), 'Bien elevar e; dividiste en vez de multiplicar.');
        agrega('altura-perdida', (1 - e * e) * c.H, 'Bien comparar alturas; calculaste cuánto disminuye la altura.');
        agrega('complemento-altura', (1 - e) * c.H, 'Bien usar H; usaste el complemento lineal de e.');
        agrega('doble-altura', 2 * e * e * c.H, 'Bien elevar e; conservaste un factor dos que se cancela.');
      } else {
        resultado = 2 * Vr / g; unidad = 's'; color = 'd'; simbolo = 't_vuelo';
        enunciado = [`Una pelota cae desde ${crF(c.H)} m y rebota con e = ${crF(c.e)}. Desde que se separa del piso, ¿cuánto demora en volver a tocarlo?`];
        dibujo.datos.textos[1].texto = 't_vuelo = ?';
        dibujo.datos.alt = `Pelota que cae desde el reposo a ${crF(c.H)} m sobre un piso fijo, con coeficiente de restitución ${crF(c.e)}. El tiempo de vuelo desde el primer rebote hasta el siguiente contacto está por hallar. Dibujo sin escala.`;
        datos.push('v_llegada² = 2·g·H; v_rebote = e·v_llegada.', 't_vuelo = 2·v_rebote/g.');
        eq('La caída determina la rapidez con que la pelota llega al piso.', crIgual('v_llegada', `√(2·${g}·${crF(c.H)})`, U, 'm/s'));
        eq('El impacto fija la rapidez con que inicia el nuevo vuelo.', crIgual('v_rebote', `${crF(e)}·${crF(U)}`, Vr, 'm/s', 'o', !crExacto(U)));
        eq('Subir y bajar hasta el mismo nivel requiere dos veces el tiempo de ascenso.', crIgual(simbolo, `2·${crF(Vr)} ÷ ${g}`, resultado, 's', 'd', !crExacto(Vr)));
        motivo = 'El intervalo empieza al separarse del piso; no incluye la caída inicial.';
        agrega('solo-subida', Vr / g, 'Bien calcular el ascenso; falta sumar el descenso.');
        agrega('caida-inicial', U / g, 'Bien usar caída libre; calculaste el intervalo anterior al impacto.');
        agrega('tiempo-con-e2', 2 * e * e * U / g, 'Bien usar restitución; aplicaste e al cuadrado al tiempo.');
        agrega('sin-perdida', 2 * U / g, 'Bien contar ida y vuelta; omitiste el efecto del impacto.');
        agrega('dos-gravedades', 2 * Vr / (g * g), 'Bien formar el tiempo; dividiste dos veces entre g.');
      }
    } else throw new Error(`Tipo de choque desconocido: ${c.tipo}`);
    const vistos = new Set([crValor(resultado, unidad)]), distintos = [];
    for (const e of errores) {
      const texto = crValor(e.valor, unidad);
      if (!vistos.has(texto) && Math.abs(e.valor - resultado) > 1e-9) { vistos.add(texto); distintos.push({ ...e, texto }); }
    }
    return { ...c, resultado, unidad, color, simbolo, enunciado, datos, dibujo, pasos, motivo,
      respuesta: crRespuesta(simbolo, resultado, unidad, color), errores: distintos, verificacion: { ...c } };
  }
  function crEjemplo(c, i) {
    const q = crCaso(c), nivel = i < 5 ? 1 : i < 10 ? 2 : 3;
    const solucion = q.pasos.slice(), out = { nivel, titulo: c.titulo, enunciado: q.enunciado, datos: q.datos, figura: q.dibujo, solucion, respuesta: q.respuesta, verificacion: q.verificacion };
    if (nivel === 3) {
      if (q.errores.length < 4) throw new Error(`Faltan alternativas distintas: ${c.tipo}/${i}`);
      const vals = q.errores.slice(0, 4).map(e => sinAprox(e.texto)); vals.splice(i - 10, 0, sinAprox(crValor(q.resultado, q.unidad)));
      out.alternativas = vals;
      solucion.push({ texto: 'Las demás: ' + q.errores.slice(0, 4).map(e => `${crValor(e.valor)} (${crErrorCorto[e.id]})`).join('; ') + '.' });
    }
    return out;
  }
  const crErrorCorto = {
    'velocidad-llegada': 'velocidad anterior', 'sin-mitad': 'omite el dos', 'sin-cuadrado': 'omite el cuadrado', 'energia-antes': 'conserva energía durante adhesión',
    'masa-extra': 'masa sin cancelar', 'sin-roce': 'omite rozamiento', 'energia-inicial': 'solo energía inicial', 'energia-final': 'solo energía final',
    'resta-invertida': 'resta invertida', 'masa-total-relativa': 'usa masa total', 'solo-a-relativa': 'solo masa de A',
    'solo-subida': 'solo el ascenso', 'caida-inicial': 'caída anterior', 'tiempo-con-e2': 'tiempo con e²', 'sin-perdida': 'omite el impacto',
    'dos-gravedades': 'divide dos veces', adhesion: 'supone unión', intercambio: 'intercambia cuerpos', 'sin-interaccion': 'omite la interacción',
    'piso-fijo': 'multiplica e por la llegada de A, como si el otro carrito fuera un piso fijo', 'signo-final': 'sentido invertido', elasticidad: 'supone elasticidad perfecta', 'media-separacion': 'reduce separación',
  };
  const crEjChoquesDatos = [
    { tipo: 'union', a: 1, b: 3, u: 8, w: 0, titulo: 'Un receptor quieto' },
    { tipo: 'union', a: 2, b: 4, u: 5, w: 2, titulo: 'Llegan por el mismo sentido' },
    { tipo: 'union', a: 3, b: 2, u: 4, w: -1, titulo: 'Velocidades con signo' },
    { tipo: 'elastico-a', a: 1, b: 3, u: 6, w: 0, titulo: 'El carrito liviano rebota' },
    { tipo: 'elastico-b', a: 3, b: 1, u: 4, w: 0, titulo: 'El receptor sale' },
    { tipo: 'perdida', a: 2, b: 3, u: 5, w: 0, titulo: 'Energía que cambia de forma' },
    { tipo: 'perdida', a: 3, b: 1, u: 4, w: -4, titulo: 'Impacto de frente' },
    { tipo: 'elastico-a', a: 2, b: 3, u: 7, w: 2, titulo: 'Receptor que ya avanzaba' },
    { tipo: 'elastico-b', a: 4, b: 1, u: 3, w: -2, titulo: 'Sentidos contrarios' },
    { tipo: 'perdida', a: 1.5, b: 2.5, u: 6, w: 2, titulo: 'Masas decimales' },
    { tipo: 'subida', a: 2, b: 6, u: 12, w: 0, titulo: 'Adhesión y subida' },
    { tipo: 'frenado', a: 3, b: 2, u: 5, w: 0, mu: 0.3, titulo: 'Adhesión y pista rugosa' },
    { tipo: 'subida', a: 4, b: 2, u: 9, w: -3, titulo: 'Choque frontal antes de subir' },
    { tipo: 'frenado', a: 1, b: 3, u: 10, w: 2, mu: 0.2, titulo: 'Choque antes del frenado' },
    { tipo: 'perdida', a: 2, b: 5, u: 9, w: -2.2, titulo: 'Balance de energía del impacto' },
  ];
  const crEjRestDatos = [
    { tipo: 'salida-pared', U: 8, e: 0.75, titulo: 'Pelota contra pared fija' },
    { tipo: 'salida-pared', U: 5, e: 0.4, titulo: 'Otra rapidez de rebote' },
    { tipo: 'altura', H: 4, e: 0.5, titulo: 'Primer rebote vertical' },
    { tipo: 'altura', H: 2, e: 0.8, titulo: 'Altura con restitución parcial' },
    { tipo: 'e-altura', H: 5, h: 1.25, titulo: 'Encontrar el coeficiente' },
    { tipo: 'e-relativo', a: 1, b: 2, u: 8, w: 2, va: 2, vb: 5, titulo: 'Ambos cuerpos se movían' },
    { tipo: 'restitucion-a', a: 2, b: 3, u: 6, w: 1, e: 0.5, titulo: 'Dos ecuaciones para una salida' },
    { tipo: 'restitucion-b', a: 3, b: 1, u: 5, w: -1, e: 0.5, titulo: 'Llegadas en sentidos contrarios' },
    { tipo: 'e-altura', H: 3.2, h: 0.8, titulo: 'Dos alturas decimales' },
    { tipo: 'e-relativo', a: 2, b: 1, u: 5, w: -1, va: 2, vb: 5, titulo: 'Separación y acercamiento' },
    { tipo: 'rebote-tiempo', H: 1.25, e: 0.6, titulo: 'El tiempo del nuevo vuelo' },
    { tipo: 'rebote-tiempo', H: 5, e: 0.4, titulo: 'El reloj empieza después' },
    { tipo: 'restitucion-a', a: 2, b: 5, u: 7, w: -2, e: 0.75, titulo: 'Restitución con masas distintas' },
    { tipo: 'restitucion-b', a: 5, b: 2, u: 4, w: -3, e: 0.25, titulo: 'Cantidad total y separación' },
    { tipo: 'rebote-tiempo', H: 11.25, e: 0.8, titulo: 'Caída, impacto y nuevo vuelo' },
  ];
  const crEjChoques = crEjChoquesDatos.map(crEjemplo), crEjRest = crEjRestDatos.map(crEjemplo);
  function crEntrada(idea, semilla, resuelto) {
    const k = Math.abs(Math.trunc(semilla)) % 6, n = Math.floor(Math.abs(semilla) / 6) % 7;
    // Listas disjuntas: masas semienteras en Resuelve y enteras en Ahora tú.
    const a = (resuelto ? 0.5 : 1) + Math.floor(n / 3), b = 3 * a;
    let c;
    if (idea === 4) {
      const tipos = ['union', 'perdida', 'elastico-a', 'elastico-b', 'subida', 'frenado'];
      const w = k === 0 || k === 4 ? 0 : -1, vf = 0.5 + 0.5 * (n % 3);
      c = { tipo: tipos[k], a, b, u: 4 * vf - 3 * w, w, mu: 0.25 };
    } else {
      const tipos = ['salida-pared', 'altura', 'e-altura', 'restitucion-a', 'restitucion-b', 'rebote-tiempo'];
      const H = resuelto ? 0.8 + 0.05 * n : 1.8 + 0.05 * n;
      c = k === 0 ? { tipo: tipos[k], U: (resuelto ? 11.5 : 13) + n, e: 0.6 }
        : k === 1 ? { tipo: tipos[k], H, e: 0.6 }
        : k === 2 ? { tipo: tipos[k], H, h: H * 0.36 }
        : k === 5 ? { tipo: tipos[k], H: ((resuelto ? 3 : 4) + 2 * (n % 4)) ** 2 / 20, e: resuelto ? 0.7 : 0.6 }
        : { tipo: tipos[k], a, b, u: 5 + 2 * (n % 3), w: -1, e: 0.6 };
    }
    // El primer intento es el caso usual; si coinciden errores numéricos se desplaza un dato.
    for (let intento = 0; intento < 20; intento++) {
      const q = crCaso(c);
      if (q.errores.length >= 4) return q;
      c = { ...c, ...(c.a ? { u: c.u + 0.25 } : c.U ? { U: c.U + 0.25 } : { H: c.H + 0.05, ...(c.h ? { h: (c.H + 0.05) * 0.36 } : {}) }) };
    }
    throw new Error('No se logró un caso con errores distintos.');
  }
  function crResuelve(idea, semilla) {
    const q = crEntrada(idea, semilla, true);
    const pide = q.tipo === 'perdida' ? 'Piden cuánta energía cinética se transforma durante el impacto.'
      : q.tipo === 'subida' ? 'Piden la altura máxima que alcanzan después de unirse.'
      : q.tipo === 'frenado' ? 'Piden cuánto recorren los carritos unidos antes de detenerse.'
      : q.tipo === 'rebote-tiempo' ? 'Piden el tiempo desde la salida del piso hasta el siguiente contacto.'
      : q.tipo === 'altura' ? 'Piden la altura máxima del primer rebote.'
      : ['e-altura', 'e-relativo'].includes(q.tipo) ? 'Piden el coeficiente de restitución, que no tiene unidad.'
      : q.tipo === 'salida-pared' ? 'Piden la rapidez con que la pelota abandona la pared.'
      : 'Piden la componente horizontal de la velocidad final indicada.';
    const regla = ['union', 'perdida', 'subida', 'frenado'].includes(q.tipo)
      ? 'Durante la unión conservamos cantidad de movimiento. La energía se compara por separado, en el intervalo correspondiente.'
      : q.tipo.includes('elastico') || q.tipo.startsWith('restitucion-')
        ? 'Usamos conservación de cantidad de movimiento y la relación entre las velocidades relativas.'
        : q.tipo === 'rebote-tiempo' ? 'Separamos caída, impacto y nuevo vuelo. El coeficiente relaciona las rapideces en el contacto.'
          : q.tipo === 'e-altura' || q.tipo === 'altura' ? 'La altura depende del cuadrado de la rapidez; el piso permanece fijo.'
            : 'Comparamos la rapidez relativa de salida con la de llegada.';
    return { enunciado: q.enunciado, datos: q.datos, dibujo: q.dibujo, verificacion: q.verificacion,
      pasos: [{ tipo: 'pide', texto: pide },
        { tipo: 'regla', texto: regla },
        ...q.pasos.map(p => ({ tipo: 'cuentas', ...p })),
        { tipo: 'sentido', texto: 'La respuesta corresponde al intervalo y al cuerpo que pregunta el enunciado.' }], respuesta: q.respuesta };
  }
  function crAhora(idea, semilla) {
    const q = crEntrada(idea, semilla, false);
    let explicacion = q.pasos[0].texto;
    if (['perdida', 'subida', 'frenado'].includes(q.tipo)) {
      const u = crUnion(q);
      explicacion = `Por conservación, la velocidad conjunta es ${crValor(u.V, 'm/s')}. Después aplicamos el balance de energía.`;
    } else if (q.tipo.includes('elastico') || q.tipo.startsWith('restitucion-')) {
      const r = crImpacto(q, q.tipo.startsWith('elastico') ? 1 : q.e);
      explicacion = `Cantidad total: ${crValor(r.P, 'kg·m/s')}; separación relativa: ${crValor(r.r, 'm/s')}. Despejamos la velocidad pedida.`;
    } else if (q.tipo === 'rebote-tiempo') {
      const U = Math.sqrt(20 * q.H);
      explicacion = `Llega con ${crValor(U, 'm/s')} y sale con ${crValor(q.e * U, 'm/s')}. Contamos ascenso y descenso.`;
    }
    return { pregunta: q.enunciado, datos: q.datos, dibujo: q.dibujo, verificacion: q.verificacion,
      opciones: [{ id: 'c', texto: sinAprox(crValor(q.resultado, q.unidad)), correcta: true }, ...q.errores.slice(0, 3).map(e => ({ id: e.id, texto: sinAprox(e.texto), error: e.error, siFuera: e.siFuera }))],
      solucion: { texto: explicacion, ecuacion: q.pasos.at(-1).ecuacion } };
  }

  // Centro de masa: datos didácticos de carritos. Las masas permanecen constantes.
  // Posición en tinta; masa violeta; velocidad naranja; cantidad de movimiento turquesa.
  const ctFmt = n => Kit.formatear(n, 3);
  const ctQ = (c, texto) => c === 'tinta' ? { negrita: String(texto) } : { v: `c-${c}`, t: String(texto) };
  const ctSub = (a, b) => ({ sub: [a, b] });
  const ctX = ctSub('x', 'CM'), ctV = ctSub(ctQ('o', 'v'), 'CM,x');
  const ctM = ctQ('f', 'm'), ctMt = ctSub(ctM, 'total');
  const ctExacto = n => Math.abs(n * 1000 - Math.round(n * 1000)) < 1e-7;
  const ctSigno = n => n < 0 ? `(${ctFmt(n)})` : ctFmt(n);
  const ctAprox = n => ctExacto(n) ? ' = ' : ' ≈ ';
  const ctValor = (n, u) => `${ctExacto(n) ? '' : '≈ '}${ctFmt(n)} ${u}`;
  const ctSuma = a => a.reduce((s, x) => s + x, 0);
  const ctPonderado = (m, x) => ctSuma(m.map((z, i) => z * x[i])) / ctSuma(m);
  const ctProductos = (m, x) => m.map((z, i) => `${ctFmt(z)} · ${ctSigno(x[i])}`).join(' + ');
  const ctFraccion = (m, x) => ({ frac: [ctProductos(m, x), m.map(ctFmt).join(' + ')] });

  // Cada fila contiene un carrito real de laboratorio. Las posiciones se rotulan;
  // la figura de un ejercicio no permite medir la incógnita con una regla.
  function ctFigura(c, revelar = false) {
    const n = c.masas.length, textos = [], objetos = [], lineas = [];
    // Cada carrito en su pista; su lugar de izquierda a derecha sigue el orden de las posiciones (lector en frío, 26 nov:
    // en la misma columna no se veía que B estuviera más a la derecha). Sin escala: la incógnita no se mide.
    const pos = c.posiciones || c.masas.map((_, i) => i);
    const orden = pos.map((p, i) => p == null ? Infinity : p);
    const rango = i => orden.filter(q => q < orden[i]).length + orden.slice(0, i).filter(q => q === orden[i]).length;
    const flechas = [];
    c.masas.forEach((masa, i) => {
      const y = i * 96, nombre = ['A', 'B', 'C'][i], cx = n === 1 ? 240 : 196 + rango(i) * 84 / (n - 1);
      objetos.push({ tipo: 'carrito', x: cx, y: y + 80, w: 56, h: 22, texto: nombre, mango: 0 });
      lineas.push({ de: [160, y + 84], a: [312, y + 84] });
      if (c.velocidades && c.velocidades[i]) flechas.push({ de: [cx, y + 34], ang: c.velocidades[i] > 0 ? 0 : 180, largo: Math.max(16, 9 * Math.abs(c.velocidades[i])), color: 'o' });
      textos.push({ x: 12, y: y + 22, texto: `m_${nombre} = ${masa == null ? '?' : ctFmt(masa)} ${c.unidadM || 'kg'}`, color: masa == null ? 'tinta' : 'f' });
      if (c.posiciones) textos.push({ x: 12, y: y + 46, texto: `x_${nombre} = ${c.posiciones[i] == null ? '?' : ctFmt(c.posiciones[i])} ${c.unidadX || 'm'}` });
      if (c.velocidades) textos.push({ x: 12, y: y + 70, texto: `${c.velocidadesIniciales ? 'Antes: ' : ''}v_${nombre + ',x'} = ${ctFmt(c.velocidades[i])} m/s`, color: 'o' });
    });
    textos.push({ x: 12, y: n * 96 + 15, texto: 'Derecha positiva; origen común.', tam: 11 });
    textos.push({ x: 12, y: n * 96 + 38, texto: 'El dibujo no está a escala.', tam: 11 });
    if (c.objetivo != null) textos.push({ x: 12, y: n * 96 + 61, texto: `x_CM = ${ctFmt(c.objetivo)} m` });
    if (c.tiempo != null) textos.push({ x: 202, y: n * 96 + 61, texto: `t = ${ctFmt(c.tiempo)} s`, color: 'd' });
    if (c.velocidadesIniciales) textos.push({ x: 12, y: n * 96 + 61, texto: 'Velocidades antes de separarse.', tam: 11 });
    if (revelar && c.resultado != null) textos.push({ x: 12, y: n * 96 + 84, texto: `${c.simbolo || 'x_CM'}${ctAprox(c.resultado)}${ctFmt(c.resultado)} ${c.unidad || 'm'}`, color: c.color || 'tinta' });
    return { pieza: 'fis-estatica', datos: { alto: n * 96 + (revelar ? 110 : 88), objetos, textos, lineas, flechas,
      alt: 'Carritos A, B y, si aparece, C. Las etiquetas muestran solamente las masas, posiciones y velocidades dadas; las incógnitas llevan signo de interrogación.' + (c.velocidadesIniciales ? ' Las velocidades individuales corresponden al instante anterior a la separación.' : '') }, estado: {} };
  }
  function ctEscenaJuego(a) {
    const centro = a.mB * a.xB / (2 + a.mB);
    const escala = x => 40 + 40 * x;
    return { pieza: 'fis-estatica', datos: { alto: 248,
      objetos: [
        { tipo: 'carrito', x: escala(0), y: 98, w: 54, h: 22, texto: 'A', mango: 0 },
        { tipo: 'carrito', x: escala(a.xB), y: 152, w: 54, h: 22, texto: 'B', mango: 0 },
      ],
      textos: [
        { x: 12, y: 22, texto: 'm_A = 2 kg', color: 'f' },
        { x: 172, y: 22, texto: `m_B = ${ctFmt(a.mB)} kg`, color: 'f' },
        { x: 12, y: 45, texto: 'x_A = 0 m' },
        { x: 172, y: 45, texto: `x_B = ${ctFmt(a.xB)} m` },
        { x: escala(centro), y: 175, texto: 'CM', ancla: 'middle' },
        ...[0, 2, 4, 6].map(x => ({ x: escala(x), y: 218, texto: `${x} m`, ancla: 'middle', tam: 11 })),
        { x: 12, y: 242, texto: 'Marca de llegada: 4 m.', tam: 11 },
      ],
      lineas: [
        { de: [8, 104], a: [309, 104] }, { de: [8, 158], a: [309, 158] },
        { de: [escala(0), 196], a: [escala(6), 196] },
        ...[0, 2, 4, 6].map(x => ({ de: [escala(x), 190], a: [escala(x), 202] })),
        { de: [escala(centro), 181], a: [escala(centro), 188], discontinua: true },
      ], alt: `Dos carritos con masas 2 kg y ${ctFmt(a.mB)} kg, ubicados en 0 m y ${ctFmt(a.xB)} m. El centro de masa está en ${ctFmt(centro)} m.` }, estado: {} };
  }

  function ctCaso(c) {
    const m = c.masas.map(x => x == null ? null : x / (c.unidadM === 'g' ? 1000 : 1));
    const x = c.posiciones && c.posiciones.map(x => x == null ? null : x / (c.unidadX === 'cm' ? 100 : 1));
    const v = c.velocidades, total = ctSuma(m), solucion = [], errores = [];
    let resultado, simbolo = ctX, unidad = 'm', color = 'tinta', pregunta;
    const add = (id, valor, texto) => errores.push({ id, valor, error: `CENTRO-${id.toUpperCase()}`, siFuera: `Bien ${texto} Sale ${ctValor(valor, unidad)}.` });
    const datos = c.masas.map((z, i) => {
      const nom = ['A', 'B', 'C'][i];
      return [`${nom}: `, ctSub(ctM, nom), ` = ${z == null ? '?' : ctFmt(z)} ${c.unidadM || 'kg'}`,
        ...(c.posiciones ? [`, x_${nom} = ${c.posiciones[i] == null ? '?' : ctFmt(c.posiciones[i])} ${c.unidadX || 'm'}`] : []),
        ...(v ? [', ', ctSub(ctQ('o', 'v'), nom + ',x'), ` = ${ctFmt(v[i])} m/s`] : []), '.'];
    });
    const eqPos = [ctX, ' = ', { frac: [m.map((_, i) => [`m_${['A', 'B', 'C'][i]}·x_${['A', 'B', 'C'][i]}`]).join('+'), m.map((_, i) => `m_${['A', 'B', 'C'][i]}`).join('+')] }];
    const eqVel = [ctV, ' = ', { frac: [m.map((_, i) => `m_${['A', 'B', 'C'][i]}·v_${['A', 'B', 'C'][i] + ',x'}`).join('+'), ctMt] }];
    if (c.tipo === 'velocidad') {
      resultado = ctPonderado(m, v); unidad = 'm/s'; color = 'o'; simbolo = ctV;
      pregunta = `A tiene ${ctFmt(c.masas[0])} ${c.unidadM || 'kg'} y B, ${ctFmt(c.masas[1])} ${c.unidadM || 'kg'}. Con las velocidades indicadas, ¿cuál es la componente de velocidad de su centro de masa?`;
      datos.push(eqVel);
      solucion.push({ texto: 'Cada velocidad participa según su masa. Dividimos la suma de cantidades de movimiento entre la masa total.', ecuacion: [ctV, ' = ', ctFraccion(m, v), ctAprox(resultado), ctQ('o', ctFmt(resultado) + ' m/s')] });
      add('media-simple', ctSuma(v) / m.length, 'usar todas las velocidades; las promediaste sin considerar las masas.');
      add('sin-divisor', ctSuma(m.map((z, i) => z * v[i])), 'sumar las cantidades de movimiento; omitiste dividir entre la masa total.');
      add('doble-masa', resultado / 2, 'ponderar las velocidades; contaste dos veces la masa total.');
      add('signo', -resultado, 'usar el módulo; invertiste el sentido.');
      add('masa-intercambiada', ctPonderado(m.slice().reverse(), v), 'ponderar; intercambiaste las masas de los carritos.');
    } else if (c.tipo === 'masa-faltante') {
      resultado = m[0] * (c.objetivo - x[0]) / (x[1] - c.objetivo); unidad = 'kg'; color = 'f'; simbolo = ctSub(ctM, 'B');
      pregunta = `A tiene ${ctFmt(c.masas[0])} ${c.unidadM || 'kg'}. El centro de masa de ambos carritos está en ${ctFmt(c.objetivo)} m. ¿Qué masa tiene B?`;
      datos.push([ctX, ` = ${ctFmt(c.objetivo)} m; derecha positiva.`], eqPos);
      solucion.push({ texto: 'Igualamos los aportes a ambos lados del centro de masa y despejamos la masa desconocida.', ecuacion: [ctSub(ctM, 'B'), ' = ', { frac: [`${ctFmt(m[0])} · (${ctFmt(c.objetivo)} − ${ctSigno(x[0])})`, `${ctFmt(x[1])} − ${ctFmt(c.objetivo)}`] }, ctAprox(resultado), ctQ('f', ctFmt(resultado) + ' kg')] });
      add('razon-inversa', m[0] * (x[1] - c.objetivo) / (c.objetivo - x[0]), 'comparar las distancias; invertiste su cociente.');
      add('sin-distancias', m[0], 'identificar dos cuerpos; supusiste masas iguales sin comprobar las distancias.');
      add('sin-restar', m[0] * c.objetivo / x[1], 'usar posiciones; omitiste las distancias respecto al centro de masa.');
      add('sin-divisor', m[0] * (c.objetivo - x[0]), 'calcular el numerador; omitiste dividir entre la distancia de B.');
      add('doble-masa', resultado * 2, 'plantear la proporción; contaste dos veces la masa de A.');
    } else if (c.tipo === 'posicion-faltante') {
      resultado = (total * c.objetivo - m[0] * x[0]) / m[1]; simbolo = ctSub('x', 'B');
      pregunta = `A tiene ${ctFmt(c.masas[0])} kg y B, ${ctFmt(c.masas[1])} kg. Su centro de masa está en ${ctFmt(c.objetivo)} m. ¿En qué posición debe estar B?`;
      datos.push([ctX, ` = ${ctFmt(c.objetivo)} m; derecha positiva.`], eqPos);
      solucion.push({ texto: 'Multiplicamos por la masa total, restamos el aporte de A y dividimos entre la masa de B.', ecuacion: [simbolo, ' = ', { frac: [`(${ctFmt(m[0])} + ${ctFmt(m[1])}) · ${ctSigno(c.objetivo)} − ${ctFmt(m[0])} · ${ctSigno(x[0])}`, ctFmt(m[1])] }, ctAprox(resultado), ctQ('tinta', ctFmt(resultado) + ' m')] });
      add('media-simple', 2 * c.objetivo - x[0], 'usar la posición central; supusiste masas iguales.');
      add('sin-restar', total * c.objetivo / m[1], 'multiplicar por la masa total; omitiste restar el aporte de A.');
      add('sin-divisor', total * c.objetivo - m[0] * x[0], 'restar el aporte de A; omitiste dividir entre la masa de B.');
      add('masa-intercambiada', (total * c.objetivo - m[1] * x[0]) / m[0], 'despejar una posición; intercambiaste las masas.');
      add('signo', -resultado, 'hallar la distancia; invertiste el sentido de la posición.');
    } else if (c.tipo === 'evolucion') {
      const xc = ctPonderado(m, x), vc = ctPonderado(m, v);
      resultado = xc + vc * c.tiempo;
      pregunta = `La fuerza externa horizontal neta sobre ${m.length === 3 ? 'tres' : 'dos'} carritos es nula durante todo el intervalo; A tiene ${ctFmt(c.masas[0])} kg. ¿Dónde estará su centro de masa después de ${ctFmt(c.tiempo)} s?`;
      datos.push(eqPos, eqVel);
      datos.push([ctSub('x', 'CM(t)'), ' = ', ctSub('x', 'CM(0)'), ' + ', ctV, '·t; derecha positiva.']);
      solucion.push({ texto: 'Primero ubicamos el centro de masa al comenzar el intervalo.', ecuacion: [ctSub('x', 'CM(0)'), ' = ', ctFraccion(m, x), ctAprox(xc), ctQ('tinta', ctFmt(xc) + ' m')] });
      solucion.push({ texto: 'Luego obtenemos su velocidad. La fuerza externa neta nula la mantiene constante durante el intervalo.', ecuacion: [ctV, ' = ', ctFraccion(m, v), ctAprox(vc), ctQ('o', ctFmt(vc) + ' m/s')] });
      solucion.push({ texto: 'Sumamos a la posición inicial el avance durante el tiempo dado; calculamos sin redondear los valores intermedios.', ecuacion: [ctSub('x', 'CM(t)'), ' = ', ctSub('x', 'CM(0)'), ' + ', ctV, ` · ${ctFmt(c.tiempo)}`, ctAprox(resultado), ctQ('tinta', ctFmt(resultado) + ' m')] });
      add('media-simple', ctSuma(x) / m.length + ctSuma(v) / m.length * c.tiempo, 'incluir posición y tiempo; promediaste sin ponderar por las masas.');
      add('sin-origen', vc * c.tiempo, 'calcular el avance; omitiste sumar la posición inicial.');
      add('sin-tiempo', xc + vc, 'sumar posición y avance; usaste un segundo en vez del intervalo dado.');
      add('signo', xc - vc * c.tiempo, 'calcular el avance; cambiaste su signo.');
      add('sin-divisor', xc + ctSuma(m.map((z, i) => z * v[i])) * c.tiempo, 'sumar las cantidades de movimiento; faltó dividir para hallar la velocidad.');
    } else {
      resultado = ctPonderado(m, x);
      pregunta = `${m.length === 3 ? 'Tres' : 'Dos'} carritos ocupan las posiciones indicadas; A tiene ${ctFmt(c.masas[0])} ${c.unidadM || 'kg'} y B, ${ctFmt(c.masas[1])} ${c.unidadM || 'kg'}. ¿Dónde está su centro de masa, en metros?`;
      datos.push(eqPos);
      solucion.push({ texto: x.includes(0) ? 'Multiplicamos cada posición por su masa y dividimos la suma entre toda la masa, incluida la situada en el origen.' : 'Multiplicamos cada posición por su masa y dividimos la suma entre toda la masa.', ecuacion: [ctX, ' = ', ctFraccion(m, x), ctAprox(resultado), ctQ('tinta', ctFmt(resultado) + ' m')] });
      add('media-simple', ctSuma(x) / m.length, 'usar todas las posiciones; las promediaste sin considerar las masas.');
      add('sin-divisor', ctSuma(m.map((z, i) => z * x[i])), 'sumar los productos; omitiste dividir entre la masa total.');
      add('doble-masa', resultado / 2, 'sumar los productos; contaste dos veces la masa total.');
      add('masa-intercambiada', ctPonderado(m.slice().reverse(), x), 'ponderar las posiciones; intercambiaste las masas de los extremos.');
      add('sin-origen', ctSuma(m.map((z, i) => z * x[i])) / ctSuma(m.filter((_, i) => x[i] !== 0)), 'sumar los productos; quitaste del denominador la masa situada en el origen.');
      add('signo', -resultado, 'hallar la distancia; invertiste el sentido de la posición.');
    }
    if (c.unidadM === 'g' || c.unidadX === 'cm') {
      datos.push(c.unidadM === 'g' && c.unidadX === 'cm' ? '1 kg = 1000 g; 1 m = 100 cm.' : c.unidadM === 'g' ? '1 kg = 1000 g.' : '1 m = 100 cm.');
      solucion.unshift({ texto: 'Convertimos las medidas antes de sustituir; todas las posiciones usan el mismo origen.', ecuacion: [
        c.unidadM === 'g' ? m.map((z, i) => `${ctFmt(c.masas[i])} g = ${ctFmt(z)} kg`).join('; ') : '',
        c.unidadM === 'g' && c.unidadX === 'cm' ? '; ' : '',
        c.unidadX === 'cm' ? x.filter(z => z != null).map((z, i) => `${ctFmt(c.posiciones[i])} cm = ${ctFmt(z)} m`).join('; ') : '',
      ] });
    }
    if (datos.length < 6 && !datos.some(d => typeof d === 'string' && d.includes('derecha'))) datos.push(`${m.length === 3 ? 'A, B y C' : 'A y B'} nombran carritos. Las posiciones usan el mismo origen y la derecha es positiva.`);
    const vistos = new Set([ctFmt(resultado)]);
    const distintos = errores.filter(e => {
      const t = ctFmt(e.valor);
      if (!Number.isFinite(e.valor) || vistos.has(t)) return false;
      vistos.add(t); return true;
    });
    return { pregunta, datos, solucion, resultado, simbolo, unidad, color, errores: distintos,
      dibujo: ctFigura(c), respuesta: [simbolo, ctAprox(resultado), ctQ(color, `${ctFmt(resultado)} ${unidad}`)], verificacion: JSON.parse(JSON.stringify(c)) };
  }

  const CT_CASOS = [
    { tipo: 'posicion', nivel: 1, titulo: 'Dos masas iguales', masas: [2, 2], posiciones: [0, 4] },
    { tipo: 'posicion', nivel: 1, titulo: 'Más masa a la derecha', masas: [1, 3], posiciones: [0, 4] },
    { tipo: 'posicion', nivel: 1, titulo: 'Una posición negativa', masas: [3, 1], posiciones: [-2, 6] },
    { tipo: 'velocidad', nivel: 1, titulo: 'Velocidades en el mismo sentido', masas: [2, 4], velocidades: [1, 4] },
    { tipo: 'velocidad', nivel: 1, titulo: 'Velocidades de sentidos contrarios', masas: [3, 2], velocidades: [4, -1] },
    { tipo: 'posicion', nivel: 2, titulo: 'Posiciones medidas en centímetros', masas: [2, 3], posiciones: [-100, 400], unidadX: 'cm' },
    { tipo: 'posicion', nivel: 2, titulo: 'Masas medidas en gramos', masas: [1500, 2500], posiciones: [1, 5], unidadM: 'g' },
    { tipo: 'posicion-faltante', nivel: 2, titulo: 'La posición que falta', masas: [2, 3], posiciones: [1, null], objetivo: 4 },
    { tipo: 'masa-faltante', nivel: 2, titulo: 'La masa que falta', masas: [2, null], posiciones: [0, 6], objetivo: 4 },
    { tipo: 'posicion', nivel: 2, titulo: 'Tres carritos en una pista', masas: [1, 2, 3], posiciones: [0, 2, 4] },
    { tipo: 'evolucion', nivel: 3, titulo: 'Posición después de avanzar', masas: [2, 4], posiciones: [1, 4], velocidades: [4, 1], tiempo: 3, posicionCorrecta: 0 },
    { tipo: 'posicion', nivel: 3, titulo: 'Tres carritos y dos conversiones', masas: [1000, 2000, 3000], posiciones: [-200, 100, 400], unidadM: 'g', unidadX: 'cm', posicionCorrecta: 1 },
    { tipo: 'evolucion', nivel: 3, titulo: 'Centro que avanza hacia atrás', masas: [3, 1], posiciones: [-1, 5], velocidades: [-3, 1], tiempo: 2, posicionCorrecta: 2 },
    { tipo: 'masa-faltante', nivel: 3, titulo: 'Inferir masa desde dos mediciones', masas: [2.5, null], posiciones: [-200, 600], unidadX: 'cm', objetivo: 3, posicionCorrecta: 3 },
    { tipo: 'evolucion', nivel: 3, titulo: 'Tres movimientos y una posición', masas: [1, 2, 3], posiciones: [0, 2, 4], velocidades: [4, 2, -1], tiempo: 3, posicionCorrecta: 4 },
  ];
  const CT_EJEMPLOS = CT_CASOS.map(c => {
    const b = ctCaso(c), e = { nivel: c.nivel, titulo: c.titulo, enunciado: b.pregunta, datos: b.datos,
      figura: b.dibujo, solucion: b.solucion.slice(), respuesta: b.respuesta, verificacion: b.verificacion };
    if (c.nivel === 3) {
      const errores = b.errores.slice(0, 4), valores = errores.map(e => e.valor);
      if (errores.length !== 4) throw new Error('Centro de masa: faltan distractores de examen para ' + c.titulo);
      valores.splice(c.posicionCorrecta, 0, b.resultado);
      e.alternativas = valores.map(v => sinAprox(ctValor(v, b.unidad)));
      const causas = { 'media-simple': 'ignora las masas', 'sin-origen': 'omite la posición inicial', 'sin-tiempo': 'supone un segundo',
        signo: 'invierte el sentido', 'sin-divisor': 'omite la división', 'doble-masa': 'duplica la masa total',
        'masa-intercambiada': 'intercambia las masas', 'razon-inversa': 'invierte el cociente', 'sin-distancias': 'iguala ambas masas', 'sin-restar': 'omite una resta' };
      e.solucion.push({ texto: errores.map(x => `${ctValor(x.valor, b.unidad)} ${causas[x.id]}.`).join(' ') });
    }
    return e;
  });

  function ctGenerar(semilla, resuelto) {
    const r = azar(semilla + (resuelto ? 44000 : 55000));
    const tipos = ['posicion', 'velocidad', 'posicion-faltante', 'masa-faltante', 'evolucion', 'posicion'];
    const tipo = tipos[((semilla % tipos.length) + tipos.length) % tipos.length];
    let c, b;
    for (let intento = 0; intento < 120; intento++) {
      const m = r.de(resuelto ? [9, 11, 13] : [4, 6, 8]);
      const a = r.de(resuelto ? [0.25, 1.25, 2.25] : [0.5, 1.5, 2.5]);
      c = { tipo, masas: [m, 2], posiciones: [a, a + r.de([3, 4, 5])] };
      if (tipo === 'velocidad') { delete c.posiciones; c.velocidades = [r.de([-4, -3, 2, 3]), r.de([-2, 1, 4])]; }
      if (tipo === 'posicion-faltante') { c.posiciones[1] = null; c.objetivo = a + r.de([1.5, 2.5]); }
      if (tipo === 'masa-faltante') { c.masas[1] = null; c.objetivo = a + 2; }
      if (tipo === 'evolucion') { c.velocidades = [r.de([-3, -2, 2, 3]), r.de([-1, 1, 4])]; c.tiempo = r.de([2, 3, 4]); }
      if (tipo === 'posicion' && semilla % tipos.length === 5) { c.masas.push(3); c.posiciones.push(a + 6); }
      b = ctCaso(c);
      if (b.errores.length >= 3 && Number.isFinite(b.resultado)) break;
    }
    if (!b || b.errores.length < 3) throw new Error('Centro de masa: faltan alternativas distintas.');
    if (resuelto) return { enunciado: b.pregunta, datos: b.datos, dibujo: b.dibujo, respuesta: b.respuesta, verificacion: c,
      pasos: [
        { tipo: 'pide', texto: { velocidad: 'Piden la velocidad del centro de masa, con su signo.', 'masa-faltante': 'Piden la masa de B que deja el centro de masa en la marca dada.', 'posicion-faltante': 'Piden dónde debe estar B para que el centro de masa quede en la marca dada.', evolucion: 'Piden dónde estará el centro de masa después del tiempo dado.' }[c.tipo] || 'Piden la posición del centro de masa, con el origen y el sentido del eje.' },
        { tipo: 'regla', texto: 'El promedio ponderado usa la masa de cada carrito. Toda la masa participa en el denominador.' },
        ...b.solucion.map(p => ({ tipo: 'cuentas', ...p })),
        { tipo: 'sentido', texto: c.tipo === 'masa-faltante' ? 'La masa hallada es positiva y sitúa el centro entre los dos carritos.' : c.tipo === 'velocidad' ? 'El signo de la velocidad indica el sentido del movimiento sobre el eje.' : 'Una posición puede ser negativa; el signo indica su lado respecto al origen.' },
      ] };
    const textoSolucion = c.tipo === 'evolucion'
      ? `La posición inicial${ctAprox(ctPonderado(c.masas, c.posiciones))}${ctFmt(ctPonderado(c.masas, c.posiciones))} m; la velocidad${ctAprox(ctPonderado(c.masas, c.velocidades))}${ctFmt(ctPonderado(c.masas, c.velocidades))} m/s. Sumamos el avance.`
      : 'Ponderamos cada dato por su masa y usamos el mismo origen. Después despejamos o aplicamos el intervalo pedido.';
    return { pregunta: b.pregunta, datos: b.datos, dibujo: b.dibujo, verificacion: c,
      opciones: [{ id: 'c', texto: sinAprox(ctValor(b.resultado, b.unidad)), correcta: true }, ...b.errores.slice(0, 3).map(e => ({ id: e.id, texto: sinAprox(ctValor(e.valor, b.unidad)), error: e.error, siFuera: e.siFuera }))],
      solucion: { texto: textoSolucion, ecuacion: b.solucion[b.solucion.length - 1].ecuacion } };
  }
  const ctPred = { masas: [2, 4], posiciones: [0, 6], velocidades: [3, 3], velocidadesIniciales: true };
  const ctPredVelocidad = ctPonderado(ctPred.masas, ctPred.velocidades);


  const ideasEtapa9 = [cantidad, {
      id: 'impulso', titulo: 'Impulso: fuerza durante un intervalo',
      pregunta: '¿Cómo cambia el movimiento mientras actúa una fuerza?',
      aprendizaje: 'El impulso neto cambia la cantidad de movimiento; el mismo cambio puede ocurrir con distintas fuerzas medias y duraciones.',
      actividad: 'Aplicar una fuerza durante un intervalo fijo y observar cómo termina una pelota.',
      temas: ['Impulso'], pieza: 'fis-estatica',
      lee: { tarjetas: [
        { titulo: 'Una pelota en una guía', texto: ['Una pelota se mueve por una guía horizontal. Un dispositivo le aplica una fuerza neta durante medio segundo. Podemos cambiar esa fuerza y observar cómo termina el movimiento. Son datos didácticos de un ensayo ideal.'], dibujo: icImpJuego({ F: -2, t: 0 }) },
        { titulo: 'Mientras actúa la fuerza', texto: ['El impulso ', icVec(icI), ' describe la acción de una fuerza durante un intervalo. Es vectorial y se mide en newtons segundo (N·s). Aquí seguimos su componente horizontal ', icIX, ', con derecha positiva.'] },
        { titulo: 'Fuerza media y fuerza máxima', texto: ['Una fuerza puede variar durante el contacto. Su fuerza media ', icFM, ' representa el efecto de todo el intervalo. No tiene por qué ser su valor máximo. La duración se escribe ', icDT, ', en segundos.'] },
      ] },
      ejemplos: icImpEjemplos,
      juega: {
        consigna: 'La pelota de 0,5 kg llega a 4 m/s hacia la derecha. El dispositivo aplica la fuerza elegida durante 0,5 s.',
        voz: 'El dispositivo puede frenar la pelota y luego impulsarla hacia el otro lado.',
        controles: [
          { id: 'F', etiqueta: 'Fuerza neta horizontal (negativa: hacia la izquierda)', color: 'c-h', min: -8, max: -2, paso: 1, inicio: -2, unidad: 'N', decimales: 0 },
          { id: 't', etiqueta: 'Tiempo t del pulso; se repite', color: 'c-d', min: 0, max: 0.5, paso: 0.025, inicio: 0, unidad: 's', decimales: 3, auto: { velocidad: 0.125, modo: 'repite' } },
        ],
        mision: { texto: 'Consigue que la pelota termine en reposo.', logrado: a => 4 + a.F === 0, testigo: [{ F: -4, t: 0.5 }], bien: 'La velocidad final llega a cero: la pelota termina en reposo.' },
        dibujo: icImpJuego,
        lectura: a => ['Final: ', icValor(4 + a.F, 'm/s', 'o'), '. ', 4 + a.F === 0 ? 'Queda en reposo.' : 4 + a.F > 0 ? 'Avanza hacia la derecha.' : 'Retrocede hacia la izquierda.'],
        leyenda: [
          { s: icM, t: 'masa de la pelota, en kilogramos' }, { s: icVX, t: 'velocidad horizontal; derecha positiva' },
          { s: icF, t: 'fuerza neta horizontal aplicada, en newtons' }, { s: icIX, t: 'impulso de esa fuerza durante el intervalo' },
          { s: icQ('d', 't'), t: 'tiempo transcurrido, en segundos' },
        ], minimo: 2,
      },
      predice: {
        pregunta: 'Dos dispositivos detienen pelotas iguales desde la misma velocidad. B tarda el doble que A. ¿Cuál es la fuerza neta media horizontal de B?',
        datos: ['Cada pelota tiene 0,5 kg y pasa de +8 m/s a reposo.', 'A tarda 0,2 s; B tarda 0,4 s.', 'El eje x es horizontal y positivo hacia la derecha.'],
        dibujo: icImpFigura({ tipo: 'fuerza', m: 0.5, vi: 8, vf: 0, dt: 0.4 }),
        revelar: icImpFigura({ tipo: 'rect', m: 0.5, vi: 8, vf: 0, F: icImpPredFB, dt: 0.4 }),
        opciones: [
          { id: 'c', texto: `${icFmt(icImpPredFB)} N`, correcta: true },
          { id: 'mismo-tiempo', texto: `${icFmt(icImpPredFA)} N`, error: 'IC-PRED-TIEMPO', siFuera: `Bien el cambio de movimiento; usaste 0,2 s. Así sale ${icFmt(icImpPredFA)} N.` },
          { id: 'doble-fuerza', texto: `${icFmt(2 * icImpPredFA)} N`, error: 'IC-PRED-DOBLE', siFuera: `Bien reconocer el doble de tiempo; duplicaste la fuerza de A. Así sale ${icFmt(2 * icImpPredFA)} N.` },
          { id: 'signo', texto: `${icFmt(-icImpPredFB)} N`, error: 'IC-PRED-SIGNO', siFuera: `Bien el módulo; invertiste el sentido de la fuerza. Así sale ${icFmt(-icImpPredFB)} N.` },
        ],
        coincide: 'B necesita la mitad del módulo de fuerza media. El impulso es el mismo porque ambas pelotas tienen iguales estados inicial y final.',
      },
      mira: {
        pieza: 'fis-estatica', datos: { alto: 240, cortes: [icImpMira(0), icImpMira(1), icImpMira(2)], alt: 'Una pelota se detiene; se comparan dos duraciones y sus fuerzas medias.' },
        pasos: [
          { estado: { corte: 0 }, texto: 'Las dos pelotas tienen el mismo cambio de cantidad de movimiento.', ecuacion: [icIX, ` = 0,5 · (0 − 8) = ${icFmt(icImpPredI)} N·s`] },
          { estado: { corte: 1 }, texto: 'En A, dividimos ese impulso entre dos décimas de segundo.', ecuacion: [icSub(icQ('h', 'F'), 'media,A,x'), ` = ${icN(icImpPredI)} ÷ 0,2 = ${icFmt(icImpPredFA)} N`] },
          { estado: { corte: 2 }, texto: 'B reparte el mismo impulso durante un intervalo doble.', ecuacion: [icSub(icQ('h', 'F'), 'media,B,x'), ` = ${icN(icImpPredI)} ÷ 0,4 = ${icFmt(icImpPredFB)} N`] },
          { estado: { corte: 2 }, texto: 'El signo indica izquierda. Comparamos fuerzas medias, sin asegurar nada sobre sus máximos.' },
        ],
      },
      regla: {
        texto: 'El impulso de la fuerza neta es el cambio de cantidad de movimiento. También es el área con signo bajo la gráfica de fuerza frente al tiempo.',
        ecuacion: [icIX, ' = Δ', icSub(icP, 'x'), ' = ', icM, ' · (', icSub(icV, 'f,x'), ' − ', icSub(icV, 'i,x'), ') = ', icFM, ' · ', icDT],
        condicion: 'La masa es constante. El área bajo el eje es negativa. Solo una fuerza constante coincide siempre con su fuerza media.',
        voz: 'El cambio usa velocidad final menos inicial. Un rebote puede cambiar el sentido.',
        dibujo: icImpFigura({ tipo: 'tri', F: 8, dt: 0.5 }),
      },
      resuelve: { pieza: 'fis-estatica', generar: s => icResuelve(icImpGenerar(s + 1, true)) },
      ahoraTu: { pieza: 'fis-estatica', generar: s => icAhora(icImpGenerar(s, false)) },
    },
    {
      id: 'conservacion', titulo: 'La cantidad de movimiento del sistema',
      pregunta: '¿Qué se mantiene cuando dos cuerpos se empujan entre sí?',
      aprendizaje: 'La suma de cantidades de movimiento cambia por el impulso externo; las fuerzas internas redistribuyen el movimiento entre los cuerpos.',
      actividad: 'Liberar dos carritos mediante un resorte y observar cada movimiento y la suma del sistema.',
      temas: ['Conservación de la cantidad de movimiento'], pieza: 'fis-estatica',
      lee: { tarjetas: [
        { titulo: 'Elegir qué queda dentro', texto: ['Los dos carritos y el resorte forman nuestro sistema. El resorte tiene masa despreciable. La línea punteada marca el grupo que vamos a estudiar; no es una pared ni ejerce fuerza.'], dibujo: icSistemaFigura({ mA: 2, mB: 2, uA: 0, uB: 0, resorte: true }) },
        { titulo: 'Fuerzas dentro y fuera', texto: ['La fuerza que el resorte ejerce sobre un carrito es interna a este sistema. Una mano que empujara desde fuera produciría una fuerza externa. Clasificar una fuerza depende del grupo que elegimos.'] },
        { titulo: 'Una suma con signos', texto: ['La cantidad de movimiento total, en la horizontal, se escribe ', icPT, '. Es la suma de las componentes de todos los cuerpos incluidos. El impulso externo horizontal se escribe ', icIE, '. En la guía, la derecha es positiva.'] },
      ] },
      ejemplos: icSisEjemplos,
      juega: {
        consigna: 'Dos carritos iguales parten del reposo. Cambia la compresión del resorte y observa cómo salen al liberarlo en una guía sin fricción.',
        voz: 'El resorte tiene masa despreciable. El impulso externo horizontal es despreciable.',
        controles: [
          { id: 'c', etiqueta: 'Compresión c del resorte', min: 0.1, max: 0.3, paso: 0.1, inicio: 0.1, unidad: 'm', decimales: 1 },
          { id: 't', etiqueta: 'Tiempo t después de la separación', color: 'c-d', min: 0, max: 1, paso: 0.05, inicio: 0, unidad: 's', decimales: 2, auto: { velocidad: 0.25, modo: 'repite' } },
        ],
        mision: { texto: 'Consigue que ambos carritos salgan con rapidez de 2 m/s.', logrado: a => Math.abs(icResorteVel(a.c) - 2) < 1e-9, testigo: [{ c: 0.2, t: 0 }], bien: 'Ambos tienen la rapidez pedida y se alejan en sentidos opuestos.' },
        dibujo: icSisJuego,
        lectura: a => { const v = icResorteVel(a.c); return ['Salen en sentidos opuestos; el total es ', icValor(2 * -v + 2 * v, 'kg·m/s', 'i'), '.']; },
        leyenda: [
          { s: icM, t: 'masa de cada carrito, en kilogramos' }, { s: icVX, t: 'componente horizontal de velocidad' },
          { s: icSub(icP, 'x'), t: 'cantidad de movimiento horizontal de cada carrito' }, { s: icPT, t: 'suma horizontal de los cuerpos del sistema' },
          { s: icQ('d', 't'), t: 'tiempo después de la separación' }, { s: 'c', t: 'compresión del resorte antes de liberarlo' },
        ], minimo: 2,
      },
      predice: {
        pregunta: 'Ahora los carritos tienen masas distintas. Parten del reposo y el resorte los separa. A sale hacia la izquierda. ¿Cuál es la velocidad horizontal de B?',
        datos: ['A tiene 1 kg y sale con −3 m/s.', 'B tiene 3 kg; el resorte tiene masa despreciable.', 'El impulso externo horizontal es despreciable; derecha positiva.'],
        dibujo: icSistemaFigura({ mA: 1, mB: 3, uA: 0, uB: 0, vA: -3, resorte: true }),
        revelar: icSistemaFigura({ mA: 1, mB: 3, uA: 0, uB: 0, vA: -3, vB: icSisPredVB, resorte: true }, true),
        opciones: [
          { id: 'c', texto: `${icFmt(icSisPredVB)} m/s`, correcta: true },
          { id: 'misma-rapidez', texto: '3 m/s', error: 'IC-PRED-IGUALES', siFuera: 'Bien usar sentidos opuestos; copiaste la rapidez de A sin considerar la masa de B.' },
          { id: 'signo', texto: `${icFmt(-icSisPredVB)} m/s`, error: 'IC-PRED-SENTIDO', siFuera: 'Bien el módulo; pusiste ambos movimientos hacia la izquierda. Así el total ya no sería cero.' },
          { id: 'proporcional', texto: '9 m/s', error: 'IC-PRED-PROPORCIONAL', siFuera: 'Bien comparar masas; multiplicaste 3 por 3 en vez de dividir. Así sale 9 m/s.' },
        ],
        coincide: 'B sale más despacio hacia la derecha. Sus 3 kg compensan el movimiento de A, de menor masa, hacia la izquierda.',
      },
      mira: {
        pieza: 'fis-estatica', datos: { alto: 380, cortes: [icSistemaFigura({ mA: 1, mB: 3, uA: 0, uB: 0, vA: -3, resorte: true }).datos, icSistemaFigura({ mA: 1, mB: 3, uA: 0, uB: 0, vA: -3, vB: icSisPredVB, resorte: true }, true).datos], alt: 'Dos carritos parten del reposo y se separan con masas diferentes.' },
        pasos: [
          { estado: { corte: 0 }, texto: 'Al inicio, todos los cuerpos del sistema están en reposo.', ecuacion: [icSub(icQ('i', 'P'), 'i,x'), ' = 1 · 0 + 3 · 0 = 0 kg·m/s'] },
          { estado: { corte: 0 }, texto: 'El impulso externo despreciable mantiene el mismo total entre los dos estados.', ecuacion: [icSub(icQ('i', 'P'), 'f,x'), ' − ', icSub(icQ('i', 'P'), 'i,x'), ' = 0'] },
          { estado: { corte: 1 }, texto: 'A aporta una componente negativa. B debe aportar igual magnitud con signo positivo.', ecuacion: ['0 = 1 · (−3) + 3 · ', icSub(icV, 'B,x')] },
          { estado: { corte: 1 }, texto: 'Dividimos la contribución que falta entre la masa de B.', ecuacion: [icSub(icV, 'B,x'), ` = (0 − (−3)) ÷ 3 = ${icFmt(icSisPredVB)} m/s`] },
        ],
      },
      regla: {
        texto: 'Suma las cantidades de movimiento de los mismos cuerpos antes y después. El impulso externo cambia esa suma. Sin impulso externo neto, el total se conserva entre ambos estados.',
        ecuacion: [icSub(icQ('i', 'P'), 'f,x'), ' − ', icSub(icQ('i', 'P'), 'i,x'), ' = ', icIE],
        condicion: 'El sistema es el mismo en ambos estados. Las fuerzas internas se cancelan en la suma, no en cada cuerpo por separado.',
        voz: 'Conservar el total no obliga a conservar la velocidad ni la cantidad de movimiento de cada cuerpo.',
        dibujo: icSistemaFigura({ mA: 2, mB: 4, uA: 0, uB: 0, vA: -4, vB: 2, resorte: true }, true),
      },
      resuelve: { pieza: 'fis-estatica', generar: s => icResuelve(icSisGenerar(s + 1, true)) },
      ahoraTu: { pieza: 'fis-estatica', generar: s => icAhora(icSisGenerar(s, false)) },
    },
{
      id: 'elastico-inelastico', titulo: 'Choques y energía cinética',
      pregunta: '¿Qué se conserva cuando dos carritos quedan unidos?',
      aprendizaje: 'En un choque aislado se conserva la cantidad de movimiento; la energía cinética puede transformarse.',
      actividad: 'Cambiar la llegada y la masa receptora de dos carritos con acoples.',
      temas: ['Choques elásticos e inelásticos'], pieza: 'fis-estatica',
      lee: { tarjetas: [
        { titulo: 'Dos carritos con acoples', texto: 'Estos carritos llevan acoples que quedan unidos al encontrarse. Comparamos los instantes inmediatamente anterior y posterior al impacto. Las velocidades horizontales son componentes con signo; la derecha es positiva.', dibujo: crCarros({ a: 2, b: 2, u: 3, w: 0 }) },
        { titulo: 'Dos balances diferentes', texto: 'Ya sabemos sumar cantidades de movimiento. También podemos comparar la energía cinética total antes y después. Observa ambos balances en el mismo ensayo.' },
        { titulo: 'El entorno del ensayo', texto: 'El rozamiento horizontal y el impulso externo son despreciables durante el contacto. El modelo representa un choque perfectamente inelástico: los carritos permanecen unidos.' },
      ] },
      ejemplos: crEjChoques,
      juega: {
        consigna: 'Un carrito de 2 kg alcanza a otro quieto y queda unido a él. Elige la llegada y la masa receptora.',
        voz: 'Compara la velocidad conjunta y la energía cinética antes y después.',
        controles: [
          { id: 'u', etiqueta: 'Velocidad de llegada de A', color: 'c-o', min: 2, max: 6, paso: 1, inicio: 3, unidad: 'm/s', decimales: 0 },
          { id: 'b', etiqueta: 'Masa del carrito B', color: 'c-f', min: 1, max: 4, paso: 1, inicio: 2, unidad: 'kg', decimales: 0 },
          { id: 't', etiqueta: 'Avance de la animación', min: 0, max: 1, paso: 0.05, inicio: 0, decimales: 2, auto: { velocidad: 0.2, modo: 'repite' } },
        ],
        mision: { texto: 'Consigue que los carritos unidos avancen a 3 m/s.', logrado: s => Math.abs(crUnion({ a: 2, b: s.b, u: s.u, w: 0 }).V - 3) < 1e-9,
          testigo: [{ b: 2, u: 6, t: 0.5 }], bien: 'La velocidad conjunta alcanzó la marca. Compara ahora las energías del mismo ensayo.' },
        dibujo: crJuegoUnion,
        lectura: s => { const q = crUnion({ a: 2, b: s.b, u: s.u, w: 0 }); return ['Velocidad conjunta: ', crQ('o', crValor(q.V, 'm/s')), '. La energía cinética disminuye.']; },
        leyenda: [{ s: crM, t: 'masa de cada carrito' }, { s: [crS(crV, 'A,i'), ' y ', crS(crV, 'f')], t: 'componentes horizontales antes y después' },
          { s: crEC, t: 'energía cinética total, en joules' }, { s: 'A y B', t: 'nombres de los carritos' }], minimo: 2,
      },
      predice: (() => {
        const c = { a: 2, b: 4, u: 6, w: -1.5 }, q = crUnion(c);
        const mal = [
          { id: 'rapideces', valor: (c.a * c.u + c.b * Math.abs(c.w)) / q.M, error: 'CH-RAPIDECES', siFuera: `Bien sumar aportes; trataste la llegada izquierda como positiva. Sale ${crF((c.a * c.u + c.b * Math.abs(c.w)) / q.M)} m/s.` },
          { id: 'sin-b', valor: c.a * c.u / q.M, error: 'CH-SIN-B', siFuera: `Bien sumar masas; omitiste el movimiento del receptor. Sale ${crF(c.a * c.u / q.M)} m/s.` },
          // Antes «energia» (≈ 3,674 m/s): era la única opción con «≈» y se descartaba por su forma (lector en frío, 26 nov).
          { id: 'promedio', valor: (c.u + c.w) / 2, error: 'CH-PROMEDIO', siFuera: `Bien usar las dos velocidades con su signo; las promediaste sin tener en cuenta las masas. Sale ${crF((c.u + c.w) / 2)} m/s.` },
        ];
        return { pregunta: 'Ahora B viene hacia A. Después de unirse, ¿qué velocidad horizontal tiene el conjunto?',
          datos: ['A: 2 kg y 6 m/s hacia la derecha.', 'B: 4 kg y 1,5 m/s hacia la izquierda.', 'Impulso externo horizontal despreciable; derecha positiva.'], dibujo: crCarros(c),
          revelar: crCarros(c, { despues: true, unido: true, va: q.V, extra: `E_C: ${crF(q.Ki)} J antes; ${crF(q.Kf)} J después.` }),
          opciones: [{ id: 'c', texto: crValor(q.V, 'm/s'), correcta: true }, ...mal.map(x => ({ ...x, texto: crValor(x.valor, 'm/s') }))],
          coincide: 'La llegada de B aporta cantidad de movimiento negativa. El conjunto avanza más lento y transforma energía cinética.' };
      })(),
      mira: {
        pieza: 'fis-estatica', datos: { alto: 210, cortes: [
          { ...crCarros({ a: 2, b: 4, u: 6, w: -1.5 }).datos, alto: 210 },
          { ...crCarros({ a: 2, b: 4, u: 6, w: -1.5 }, { despues: true, unido: true, va: 1 }).datos, alto: 210 },
          { ...crCarros({ a: 2, b: 4, u: 6, w: -1.5 }, { despues: true, unido: true, va: 1, extra: 'E_C final: 3 J.' }).datos, alto: 210 },
          { ...crCarros({ a: 2, b: 4, u: 6, w: -1.5 }, { despues: true, unido: true, va: 1, extra: 'Energía transformada: 37,5 J.' }).datos, alto: 210 },
        ] },
        pasos: [
          { estado: { corte: 0 }, texto: 'Los aportes tienen signos contrarios; primero se suman.', ecuacion: crIgual(crS(crP, 'total,x'), '2·6 + 4·(−1,5)', crUnion({ a: 2, b: 4, u: 6, w: -1.5 }).P, 'kg·m/s', 'i') },
          { estado: { corte: 1 }, texto: 'Después, toda la masa comparte una velocidad.', ecuacion: crIgual(crS(crV, 'f'), '6 ÷ (2 + 4)', crUnion({ a: 2, b: 4, u: 6, w: -1.5 }).V, 'm/s') },
          { estado: { corte: 2 }, texto: 'La energía cinética restante se calcula después del impacto.', ecuacion: crIgual(crS(crEC, 'f'), '½·6·1²', crUnion({ a: 2, b: 4, u: 6, w: -1.5 }).Kf, 'J', 'tinta') },
          { estado: { corte: 3 }, texto: 'La diferencia cambia a otras formas de energía.', ecuacion: crIgual('E_transformada', '40,5 − 3', crUnion({ a: 2, b: 4, u: 6, w: -1.5 }).perdida, 'J', 'tinta') },
        ],
      },
      regla: {
        texto: 'Conserva cantidad de movimiento durante el impacto. Un choque elástico conserva también energía cinética; una adhesión no. Separa el impacto de una subida o un frenado posterior.',
        ecuacion: [crS(crP, 'total,i'), ' = ', crS(crP, 'total,f')],
        condicion: 'Impulso externo despreciable durante el contacto. En un choque elástico frontal, se separan con la rapidez relativa con que se acercaban.',
        voz: 'Decide primero qué intervalo analizas y qué tipo de choque representa.',
        dibujo: crCarros({ a: 2, b: 4, u: 6, w: -1.5 }, { despues: true, unido: true, va: 1, extra: 'Cantidad total: 6 kg·m/s.' }),
      },
      resuelve: { pieza: 'fis-estatica', generar: s => crResuelve(4, s + 1) },
      ahoraTu: { pieza: 'fis-estatica', generar: s => crAhora(4, s) },
    },
    {
      id: 'restitucion', titulo: 'Coeficiente de restitución',
      pregunta: '¿Cómo se compara la separación con el acercamiento durante un choque?',
      aprendizaje: 'La restitución relaciona velocidades relativas; con piso fijo y sin aire, la altura de rebote depende de su cuadrado.',
      actividad: 'Elegir un coeficiente y observar el rebote de una pelota sobre un piso fijo.',
      temas: ['Coeficiente de restitución'], pieza: 'fis-estatica',
      lee: { tarjetas: [
        { titulo: 'La pelota y el piso', texto: 'Una pelota cae desde el reposo. El piso permanece fijo y despreciamos la resistencia del aire. Medimos las alturas de su centro desde el nivel donde toca el piso.', dibujo: crPelota(4, null, { e: 0.5 }) },
        { titulo: 'Una cifra para el impacto', texto: 'El coeficiente de restitución, e, es la rapidez con que los cuerpos se separan tras el contacto dividida entre la rapidez con que se acercaban. Con el piso fijo: salida de la pelota entre llegada. No tiene unidad; va de 0 a 1.' },
        { titulo: 'Antes y después del contacto', texto: 'Observa la llegada y la salida sobre la línea del impacto. Compara las velocidades de ambos cuerpos desde un mismo observador.' },
      ] },
      ejemplos: crEjRest,
      juega: {
        consigna: 'La pelota cae desde 4 m sobre un piso fijo. Elige el coeficiente y observa su vuelo después del rebote.',
        voz: 'Compara la altura de caída con la alcanzada después del contacto.',
        controles: [
          { id: 'e', etiqueta: 'Coeficiente de restitución', opciones: [{ valor: 0.25, texto: '0,25' }, { valor: 0.5, texto: '0,5' }, { valor: 0.75, texto: '0,75' }, { valor: 1, texto: '1' }], inicio: 0.5 },
          { id: 't', etiqueta: 'Avance del vuelo después del rebote', min: 0, max: 1, paso: 0.05, inicio: 0, decimales: 2, auto: { velocidad: 0.2, modo: 'repite' } },
        ],
        mision: { texto: 'Haz que la pelota alcance una altura de 2,25 m.', logrado: s => Math.abs(4 * s.e * s.e - 2.25) < 1e-9,
          testigo: [{ e: 0.75, t: 0.5 }], bien: 'La altura del rebote llegó a la marca. Compárala con la caída inicial.' },
        dibujo: s => crPelota(4, 4 * s.e * s.e, { e: s.e, revelar: true, rebota: true, reloj: s.t }),
        lectura: s => `Altura inicial: 4 m; después alcanza ${crF(4 * s.e * s.e)} m.`,
        leyenda: [{ s: 'H', t: 'altura inicial sobre el contacto' }, { s: 'h', t: 'altura máxima después del rebote' }, { s: 'e', t: 'coeficiente de restitución, sin unidad' }], minimo: 2,
      },
      predice: (() => {
        const c = { a: 1, b: 1, u: 10, w: 5, va: 5.5, vb: 9.5 }, e = (c.vb - c.va) / (c.u - c.w);
        return { pregunta: 'Ahora chocan dos carritos que ya avanzaban. ¿Cuál es el coeficiente de restitución de este impacto?',
          datos: ['Antes: A lleva 10 m/s y B 5 m/s hacia la derecha.', 'Después: A lleva 5,5 m/s y B 9,5 m/s hacia la derecha.', 'A está a la izquierda de B; velocidades medidas desde el suelo.'],
          dibujo: crCarros(c, { extra: 'Después: A 5,5 m/s; B 9,5 m/s.' }),
          revelar: crCarros(c, { despues: true, va: c.va, vb: c.vb, extra: `Coeficiente: ${crF(e)}.` }),
          opciones: [
            { id: 'c', texto: crValor(e), correcta: true },
            { id: 'velocidad-sola', texto: crValor(c.vb / c.u), error: 'CH-VELOCIDAD-SOLA', siFuera: `Bien formar un cociente; dividiste velocidades aisladas. Sale ${crValor(c.vb / c.u)}.` },
            { id: 'otro-cuerpo', texto: crValor(c.va / c.u), error: 'CH-OTRO-CUERPO', siFuera: `Bien comparar antes y después; omitiste al receptor. Sale ${crValor(c.va / c.u)}.` },
            { id: 'inversa', texto: crValor(1 / e), error: 'CH-INVERSA', siFuera: `Bien hallar las rapideces relativas; invertiste el cociente. Sale ${crValor(1 / e)}.` },
          ],
          coincide: 'Los carritos se acercaban a 10 − 5 = 5 m/s y se separan a 9,5 − 5,5 = 4 m/s. Su cociente es 0,8: no se dividen velocidades sueltas.' };
      })(),
      mira: {
        pieza: 'fis-estatica', datos: { alto: 236, cortes: [
          { ...crCarros({ a: 1, b: 1, u: 10, w: 5 }).datos, alto: 236 },
          { ...crCarros({ a: 1, b: 1, u: 10, w: 5 }, { despues: true, va: 5.5, vb: 9.5 }).datos, alto: 236 },
          { ...crCarros({ a: 1, b: 1, u: 10, w: 5 }, { despues: true, va: 5.5, vb: 9.5, extra: 'Se separan a 4 m/s.' }).datos, alto: 236 },
          { ...crPelota(3, 0.75, { e: 0.5, revelar: true }).datos, alto: 236 },
        ] },
        pasos: [
          { estado: { corte: 0 }, texto: 'A alcanza a B: restamos sus velocidades para medir cuán rápido se acercan.', ecuacion: ['v_acercamiento = 10 − 5 = ', crQ('o', '5 m/s')] },
          { estado: { corte: 1 }, texto: 'Después del impacto, B va adelante: restamos en el orden de la separación.', ecuacion: ['v_separacion = 9,5 − 5,5 = ', crQ('o', '4 m/s')] },
          { estado: { corte: 2 }, texto: 'El cociente usa esas dos rapideces relativas, no la velocidad suelta de un carrito.', ecuacion: ['e = 4 ÷ 5 = 0,8'] },
          { estado: { corte: 3 }, texto: 'Con piso fijo, la razón de alturas depende del cuadrado de e.', ecuacion: ['h/H = e²'] },
        ],
      },
      regla: {
        texto: 'Divide la rapidez de separación entre la de acercamiento. Con la conservación de la cantidad de movimiento, da ambas velocidades finales. Con piso fijo y sin aire, h = e²·H.',
        ecuacion: crDatosE,
        condicion: 'Choque frontal, sin empuje externo, entre cuerpos que se acercaban. Para alturas: caída desde el reposo, piso fijo, sin aire.',
        voz: 'Con otro cuerpo móvil, resta velocidades del mismo observador antes de dividir.',
        dibujo: crCarros({ a: 1, b: 1, u: 10, w: 5 }, { despues: true, va: 5.5, vb: 9.5, extra: 'Acercamiento: 5 m/s. Separación: 4 m/s.' }),
      },
      resuelve: { pieza: 'fis-estatica', generar: s => crResuelve(5, s + 1) },
      ahoraTu: { pieza: 'fis-estatica', generar: s => crAhora(5, s) },
    },
{
    id: 'centro-masa', titulo: 'Centro de masa',
    pregunta: '¿Cómo resumimos la posición y el movimiento de varios cuerpos?',
    aprendizaje: 'La masa pondera las posiciones y velocidades; el centro puede moverse aunque los cuerpos se separen.',
    actividad: 'Cambiar la masa y la posición de un carrito para ubicar un punto del conjunto.',
    temas: ['Centro de masa'], pieza: 'fis-estatica',
    lee: { tarjetas: [
      { titulo: 'Dos carritos, una referencia', texto: 'Cada carrito tiene su masa concentrada en el punto que marca su posición. El origen es la misma marca para los dos; derecha es el sentido positivo.', dibujo: ctFigura({ masas: [2, 1], posiciones: [0, 2] }) },
      { titulo: 'Un punto del conjunto', texto: ['El centro de masa es un punto asociado al reparto de masa; no hace falta colocar un objeto allí. Su posición horizontal se representa por ', ctX, '.'] },
      { titulo: 'Un promedio con participación distinta', texto: 'Un promedio ponderado permite que cada posición participe según su masa. Mueve B y cambia su carga; observa dónde queda la marca CM.' },
    ] },
    juega: {
      consigna: 'Dos carritos ocupan una pista. Cambia la carga y la posición de B para acercar la marca CM al objetivo.',
      voz: 'Observa qué cambia al mover B y qué cambia al agregar masa.',
      controles: [
        { id: 'mB', etiqueta: 'Masa de B', min: 1, max: 4, paso: 1, inicio: 1, unidad: 'kg', decimales: 0, color: 'c-f' },
        { id: 'xB', etiqueta: 'Posición de B', min: 2, max: 6, paso: 1, inicio: 2, unidad: 'm', decimales: 0 },
      ],
      mision: { texto: 'Coloca el centro de masa en la marca de 4 m.', logrado: a => Math.abs(a.mB * a.xB / (2 + a.mB) - 4) < 1e-10,
        testigo: [{ mB: 4, xB: 6 }], bien: 'La marca CM coincide con el objetivo de la pista.' },
      dibujo: ctEscenaJuego,
      lectura: a => [ctX, ctAprox(a.mB * a.xB / (2 + a.mB)), ctQ('tinta', `${ctFmt(a.mB * a.xB / (2 + a.mB))} m`), ': queda entre ambos carritos.'],
      leyenda: [
        { s: ctM, t: 'masa del carrito, incluida su carga' },
        { s: 'x', t: 'posición desde el origen común' },
        { s: 'CM', t: 'centro de masa de ambos carritos' },
        { s: 'A y B', t: 'nombres de los dos carritos' },
      ], minimo: 2,
    },
    predice: {
      pregunta: 'Ahora ambos carritos avanzan juntos. Un resorte los separa. ¿Cuál es la velocidad del centro de masa inmediatamente después?',
      datos: ['A tiene 2 kg y B, 4 kg.', 'Antes de separarse, ambos avanzan a 3 m/s hacia la derecha.', 'Fuerza externa horizontal neta nula durante todo el ensayo.', 'Resorte de masa despreciable; sistema formado por los dos carritos.'],
      dibujo: ctFigura(ctPred),
      revelar: ctFigura({ ...ctPred, resultado: ctPredVelocidad, simbolo: 'v_CM,x', unidad: 'm/s', color: 'o' }, true),
      opciones: [
        { id: 'c', texto: `${ctFmt(ctPredVelocidad)} m/s hacia la derecha`, correcta: true },
        { id: 'reposo', texto: '0 m/s: queda en reposo', error: 'CENTRO-REPOSO', siFuera: 'Bien reconocer fuerzas internas; borraste el movimiento inicial del conjunto. Así obtuviste 0 m/s.' },
        { id: 'suma-velocidades', texto: `${ctFmt(ctSuma(ctPred.velocidades))} m/s hacia la derecha`, error: 'CENTRO-SUMA-VELOCIDADES', siFuera: `Bien considerar ambos carritos; sumaste sus velocidades. Eso da ${ctFmt(ctSuma(ctPred.velocidades))} m/s.` },
        { id: 'doble-masa', texto: `${ctFmt(ctPredVelocidad / 2)} m/s hacia la derecha`, error: 'CENTRO-DOBLE-MASA', siFuera: `Bien ponderar; dividiste entre el doble de la masa total. Eso da ${ctFmt(ctPredVelocidad / 2)} m/s.` },
      ],
      coincide: 'El resorte cambia las velocidades individuales. La cantidad de movimiento total y la masa total conservan sus valores.',
    },
    mira: { pieza: 'fis-estatica', datos: { alto: 302, cortes: [ctFigura(ctPred).datos, ctFigura({ ...ctPred, resultado: ctPredVelocidad, simbolo: 'v_CM,x', unidad: 'm/s', color: 'o' }, true).datos], alt: 'Los dos carritos avanzaban hacia la derecha antes de separarse.' },
      pasos: [
        { estado: { corte: 0 }, texto: 'Incluimos la masa de los dos carritos.', ecuacion: [ctMt, ` = 2 + 4 = ${ctFmt(ctSuma(ctPred.masas))} kg`] },
        { estado: { corte: 0 }, texto: 'Sumamos sus cantidades de movimiento con el mismo sentido positivo.', ecuacion: [ctSub(ctQ('i', 'P'), 'total,x'), ` = 2 · 3 + 4 · 3 = ${ctFmt(ctSuma(ctPred.masas) * ctPredVelocidad)} kg·m/s`] },
        { estado: { corte: 1 }, texto: 'El total, dividido entre la masa total, da la velocidad del centro.', ecuacion: [ctV, ' = ', { frac: [ctFmt(ctSuma(ctPred.masas) * ctPredVelocidad), ctFmt(ctSuma(ctPred.masas))] }, ` = ${ctFmt(ctPredVelocidad)} m/s`] },
        { estado: { corte: 1 }, texto: 'Sin fuerza externa neta, separar los carritos no cambia esta velocidad.', ecuacion: [ctV, ` = ${ctFmt(ctPredVelocidad)} m/s`] },
      ],
    },
    regla: {
      texto: 'Pondera posiciones y velocidades por sus masas. Divide entre la masa total. Sin fuerza externa neta, el centro mantiene su velocidad.',
      ecuacion: [ctX, ' = ', { frac: [[ctSub(ctM, 'A'), '·', ctSub('x', 'A'), ' + ', ctSub(ctM, 'B'), '·', ctSub('x', 'B')], [ctSub(ctM, 'A'), ' + ', ctSub(ctM, 'B')]] }],
      condicion: 'Masas constantes y positivas; mismo origen. Para tres cuerpos se agrega el tercer producto y su masa.',
      voz: 'La masa situada en el origen también forma parte del denominador.',
      dibujo: { pieza: 'fis-estatica', datos: { alto: 184, textos: [
        { x: 12, y: 26, texto: 'v_CM,x = P_total,x / m_total', tam: 14 },
        { x: 12, y: 52, texto: 'P_total,x: cantidad de movimiento total', color: 'i', tam: 11 },
        { x: 12, y: 72, texto: 'm_total: masa de todos los carritos', color: 'f', tam: 11 },
        { x: 12, y: 104, texto: 'Sin fuerza externa horizontal neta:', tam: 12 },
        { x: 12, y: 132, texto: 'x_CM(t) = x_CM(0) + v_CM,x · t', tam: 14 },
        { x: 12, y: 164, texto: 't: tiempo desde las posiciones iniciales.', color: 'd', tam: 11 },
      ], alt: 'La velocidad del centro es el total de cantidad de movimiento dividido entre la masa total. Con fuerza externa neta nula, su posición cambia uniformemente.' }, estado: {} },
    },
    ejemplos: CT_EJEMPLOS,
    resuelve: { pieza: 'fis-estatica', generar: s => ctGenerar(s + 1, true) },
    ahoraTu: { pieza: 'fis-estatica', generar: s => ctGenerar(s, false) },
  }];
  // Mesas libres posteriores: la misma física que las ideas, sin bloquear la exploración.
  const mesaDe = (id, titulo, ideaId) => {
    const idea = ideasEtapa9.find(i => i.id === ideaId), j = idea.juega;
    return { id, titulo, pieza: idea.pieza, consigna: j.consigna, controles: j.controles,
      dibujo: j.dibujo, lectura: notar(j.lectura, 'lectura'), leyenda: j.leyenda,
      invitaciones: [{ texto: j.mision.texto, logrado: j.mision.logrado,
        bien: j.mision.bien, testigo: j.mision.testigo }] };
  };
  return {
    unidad: 'fisica.impulso-y-choques', version: '0.4.0', calidad: 2, estado: 'completa',
    letras: {
  "m": "masa total del cuerpo o conjunto señalado",
  "m_c": "masa del carrito vacío",
  "m_L": "masa de la carga",
  "m_A": "masa del carrito A",
  "m_B": "masa del carrito B",
  "v": "rapidez; las velocidades con subíndices de cuerpo e instante son componentes con signo",
  "v_x": "componente horizontal de velocidad",
  "v_A": "velocidad de A",
  "v_B": "velocidad de B",
  "p": "módulo de cantidad de movimiento; p_x es su componente horizontal con signo",
  "p_x": "componente horizontal de cantidad de movimiento",
  "p_A": "cantidad de movimiento de A",
  "p_B": "cantidad de movimiento de B",
  "A": "primer carrito",
  "B": "segundo carrito",
  "x": "posición horizontal respecto al origen indicado",
  "t": "tiempo",
  "I": "impulso",
  "I_x": "componente horizontal de impulso",
  "I_ext,x": "impulso externo horizontal",
  "F": "fuerza neta",
  "F_x": "componente horizontal de fuerza neta",
  "F_media,x": "fuerza neta media horizontal",
  "F_p,x": "valor extremo del pulso triangular de fuerza",
  "F_ext,x": "fuerza externa neta horizontal",
  "F_ext,media,x": "fuerza externa neta media horizontal",
  "Δt": "duración del intervalo",
  "P": "cantidad de movimiento total del sistema",
  "P_total,x": "componente horizontal de cantidad de movimiento total",
  "P_i,x": "cantidad de movimiento total horizontal inicial",
  "P_f,x": "cantidad de movimiento total horizontal final",
  "u": "velocidad inicial",
  "v_i,x": "velocidad horizontal inicial",
  "v_f,x": "velocidad horizontal final",
  "C": "tercer carrito",
  "M": "masa total de los dos carritos",
  "v_A,i": "componente horizontal de velocidad de A antes del impacto",
  "v_B,i": "componente horizontal de velocidad de B antes del impacto",
  "v_A,f": "componente horizontal de velocidad de A después del impacto",
  "v_B,f": "componente horizontal de velocidad de B después del impacto",
  "v_f": "componente horizontal de velocidad conjunta",
  "E_C": "energía cinética",
  "E_transformada": "energía cinética transformada durante el impacto",
  "e": "coeficiente de restitución",
  "H": "altura de caída desde el nivel del contacto",
  "h": "altura sobre el nivel de referencia indicado en cada caso",
  "g": "magnitud de la aceleración de gravedad",
  "μ": "coeficiente de rozamiento cinético",
  "d": "distancia de frenado posterior",
  "v_llegada": "rapidez inmediatamente antes del impacto",
  "v_rebote": "rapidez inmediatamente después del impacto",
  "t_vuelo": "duración del vuelo posterior al rebote",
  "v_acercamiento": "rapidez relativa antes del impacto",
  "v_separacion": "rapidez relativa después del impacto",
  "i": "instante anterior al impacto",
  "f": "instante posterior al impacto",
  "x_CM": "posición del centro de masa",
  "v_CM,x": "componente horizontal de velocidad del centro de masa",
  "m_total": "masa total del sistema",
  "c": "compresión del resorte"
},
    requiere: ["/nucleo/kit/piezas/fis-estatica.js","/nucleo/kit/piezas/ejes.js"],
    glosario: [
  {
    "termino": "cantidad de movimiento",
    "simbolo": "p⃗",
    "medida": "kg·m/s",
    "def": "Magnitud vectorial que permite comparar el movimiento de cuerpos considerando su masa y su velocidad.",
    "simple": "Una forma de describir el movimiento teniendo en cuenta lo que se mueve.",
    "ejemplos": [
      "Se estudia en carritos con distintas cargas.",
      "Se registra para una pelota que viaja por el aire.",
      "Se expresa en kilogramos metro por segundo."
    ],
    "ver": [
      "velocidad"
    ]
  },
  {
    "termino": "kilogramo metro por segundo",
    "simbolo": "kg·m/s",
    "formas": [
      "kilogramo metro por segundo",
      "kilogramos metro por segundo"
    ],
    "def": "Unidad del Sistema Internacional para expresar la cantidad de movimiento.",
    "simple": "La unidad que acompaña al valor de la cantidad de movimiento.",
    "ejemplos": [
      "El módulo puede registrarse como 22 kg·m/s.",
      "Una componente puede registrarse como −15 kg·m/s.",
      "La unidad acompaña también a un valor de 0 kg·m/s."
    ]
  },
  {
    "termino": "impulso",
    "simbolo": "I⃗",
    "medida": "N·s",
    "idea": "impulso",
    "simple": "La acción de una fuerza durante un intervalo.",
    "def": "Magnitud vectorial que describe la acción de una fuerza durante un intervalo.",
    "ejemplos": [
      "Un golpe breve aplica impulso a una pelota.",
      "Una fuerza aplicada durante una décima de segundo tiene un intervalo definido.",
      "La componente horizontal del impulso puede apuntar a la izquierda o a la derecha."
    ]
  },
  {
    "termino": "fuerza media",
    "simbolo": "F_media",
    "medida": "N",
    "idea": "impulso",
    "simple": "Una fuerza que representa el efecto de todo el intervalo.",
    "def": "Fuerza constante equivalente al efecto acumulado durante un intervalo; no indica por sí sola el mayor valor alcanzado.",
    "ejemplos": [
      "Una fuerza constante de 6 N tiene fuerza media de 6 N.",
      "Durante un golpe, la fuerza puede crecer y después disminuir.",
      "Dos registros pueden tener la misma fuerza media y distintos máximos."
    ]
  },
  {
    "termino": "duración",
    "simbolo": "Δt",
    "medida": "s",
    "idea": "impulso",
    "simple": "El tiempo que pasa entre el inicio y el final.",
    "def": "Tiempo transcurrido entre el inicio y el final de un intervalo, expresado en segundos en el Sistema Internacional.",
    "ejemplos": [
      "De 1 s a 4 s transcurren 3 s.",
      "Un pulso puede durar 0,1 s.",
      "Un contacto de 50 ms dura cinco centésimas de segundo."
    ]
  },
  {
    "termino": "sistema",
    "formas": [
      "sistema",
      "sistema de cuerpos"
    ],
    "idea": "conservacion",
    "simple": "El grupo de cuerpos que elegimos estudiar juntos.",
    "def": "Conjunto de cuerpos incluidos en el análisis; su frontera distingue lo que está dentro y lo que queda fuera.",
    "ejemplos": [
      "Dos carritos y su resorte pueden formar un sistema.",
      "Podemos elegir como sistema solo uno de los carritos.",
      "La mano queda fuera si el sistema contiene únicamente los dos carritos."
    ]
  },
  {
    "termino": "fuerza interna",
    "formas": [
      "fuerza interna",
      "fuerzas internas"
    ],
    "idea": "conservacion",
    "simple": "Una fuerza entre dos cuerpos del grupo elegido.",
    "def": "Fuerza que un cuerpo del sistema ejerce sobre otro cuerpo del mismo sistema.",
    "ejemplos": [
      "El resorte empuja al carrito dentro del sistema carrito y resorte.",
      "El carrito también ejerce fuerza sobre el resorte.",
      "Una interacción entre dos carritos es interna si ambos están incluidos."
    ]
  },
  {
    "termino": "impulso externo",
    "simbolo": "I_ext",
    "formas": [
      "impulso externo"
    ],
    "idea": "conservacion",
    "simple": "La acción que llega desde fuera del grupo durante un intervalo.",
    "def": "Impulso de las fuerzas ejercidas por cuerpos ajenos al sistema durante un intervalo definido.",
    "ejemplos": [
      "Una mano fuera del sistema empuja un carrito.",
      "La fricción de una pista ajena al sistema produce impulso externo.",
      "El soporte puede ejercer una fuerza externa vertical aunque estudiemos el movimiento horizontal."
    ]
  },
  {
    "termino": "cantidad de movimiento total",
    "simbolo": "P_total",
    "medida": "kg·m/s",
    "idea": "conservacion",
    "simple": "La suma del movimiento de todos los cuerpos incluidos.",
    "def": "Suma vectorial de las cantidades de movimiento de los cuerpos del sistema, medidas desde el mismo observador.",
    "ejemplos": [
      "En un sistema de tres carritos se incluyen las tres contribuciones.",
      "Una componente hacia la izquierda se suma con signo negativo si derecha es positiva.",
      "Un carrito en reposo aporta una cantidad de movimiento nula."
    ]
  },
  {
    "termino": "choque perfectamente inelástico",
    "formas": [
      "choque perfectamente inelástico",
      "choques perfectamente inelásticos",
      "adhesión"
    ],
    "simple": "Un encuentro en el que los cuerpos quedan unidos.",
    "def": "Modelo de choque en el que los cuerpos permanecen unidos después del contacto.",
    "ejemplos": [
      "Dos carritos se unen mediante sus acoples.",
      "Una bolita queda incrustada en un bloque.",
      "Un paquete cae dentro de un carrito y permanece allí."
    ]
  },
  {
    "termino": "choque elástico",
    "formas": [
      "choque elástico",
      "choques elásticos",
      "elásticamente"
    ],
    "simple": "Un impacto ideal que permite comparar la energía cinética total.",
    "def": "Choque ideal en el que la energía cinética total conserva su valor entre los instantes anterior y posterior.",
    "ejemplos": [
      "Se estudian dos carritos con topes elásticos ideales.",
      "Las masas pueden ser distintas.",
      "Cada carrito puede cambiar su velocidad."
    ]
  },
  {
    "termino": "coeficiente de restitución",
    "simbolo": "e",
    "simple": "Una cifra para describir la llegada y la salida del contacto.",
    "def": "Número que compara las rapideces relativas de separación y acercamiento a lo largo de la línea del impacto.",
    "ejemplos": [
      "Se registra para una pelota y un piso fijo.",
      "Se registra para dos carritos que chocan de frente.",
      "Es un número sin unidad."
    ]
  },
  {
    "termino": "rapidez relativa",
    "formas": [
      "rapidez relativa",
      "rapideces relativas"
    ],
    "simple": "Qué tan rápido cambia la distancia entre dos cuerpos.",
    "def": "Módulo de la velocidad de un cuerpo respecto del otro, medido en una misma dirección.",
    "ejemplos": [
      "Una bicicleta se acerca a otra que también avanza.",
      "Dos carritos se separan después de un encuentro.",
      "Una pelota se acerca a una pared inmóvil."
    ]
  },
  {
    "termino": "línea del impacto",
    "formas": [
      "línea del impacto"
    ],
    "simple": "La dirección donde se compara la llegada con la salida.",
    "def": "Dirección normal al contacto sobre la que se relacionan las velocidades en el modelo de impacto frontal.",
    "ejemplos": [
      "Una pelota llega perpendicularmente a una pared.",
      "Dos carritos chocan sobre una misma pista recta.",
      "Una pelota cae verticalmente sobre un piso horizontal."
    ]
  },
  {
    "termino": "centro de masa",
    "simbolo": "x_CM",
    "def": "Punto que resume el reparto de masa mediante posiciones ponderadas; puede estar donde no hay material.",
    "simple": "Un punto que resume dónde está repartida la masa.",
    "ejemplos": [
      "Puede ubicarse entre dos carritos separados.",
      "Se estudia al distribuir cargas en una plataforma.",
      "Su posición se mide desde un origen elegido."
    ]
  },
  {
    "termino": "promedio ponderado",
    "formas": [
      "promedio ponderado",
      "ponderado",
      "ponderar",
      "pondera"
    ],
    "def": "Media en la que cada valor participa con una cantidad asignada; aquí, la masa.",
    "simple": "Un promedio donde no todos los datos cuentan por igual.",
    "ejemplos": [
      "Las posiciones participan según las masas de los cuerpos.",
      "Una carga mayor da más participación a su posición.",
      "Dos cargas iguales dan la misma participación a sus posiciones."
    ]
  }
],
    laboratorio: [
      mesaDe('impulso-paleta', 'Paleta y pelota', 'impulso'),
      mesaDe('choques-acoplados', 'Carritos con acople', 'elastico-inelastico'),
      mesaDe('centro-posiciones', 'Carritos sobre la pista', 'centro-masa'),
    ],
    laboratorioIdeas: { 'impulso-paleta': ['impulso'], 'choques-acoplados': ['elastico-inelastico'], 'centro-posiciones': ['centro-masa'] },
    historia: {
      texto: 'Una pelota llega a una paleta y cambia su movimiento. Para estudiar ese intervalo elegimos primero el cuerpo o conjunto de cuerpos. Después comparamos las velocidades antes y después, y revisamos qué fuerzas actúan desde afuera. En un choque también distinguimos la energía cinética de la energía total: una parte puede convertirse en deformación o calor.',
      pregunta: '¿Qué cambia cuando ampliamos el sistema que estamos estudiando?',
      fuente: { titulo: 'OpenStax: Impulse and Collisions', url: 'https://openstax.org/books/university-physics-volume-1/pages/9-2-impulse-and-collisions' }
    },
    ideas: ideasEtapa9.map(i => notar(i)),
  };
});
