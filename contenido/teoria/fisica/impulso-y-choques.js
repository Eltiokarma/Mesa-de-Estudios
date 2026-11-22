/*
 * Teoría de «Impulso, cantidad de movimiento y choques» (fisica.impulso-y-choques). Molde de docs/teoria.md;
 * forma copiada de contenido/teoria/fisica/movimiento-rectilineo.js.
 * Fuente del contenido: docs/teoria/matriz/fisica.json (unidad 8), precisiones de física del expediente y
 * docs/investigacion/momento-gravitacion-ondas-ideas-erroneas.md (códigos M1–M9).
 * Colores (regla 4): v naranja (c-o), p y Δp turquesa (c-i), F rojo (c-h), t verde (c-d). Masa, K y e van en tinta.
 * Estado: completa (14 nov 2026): cinco ideas que cubren los seis temas del catálogo.
 * Códigos nuevos (hipótesis, sin fuente empírica): IMP-PICO, IMP-TRI, IMP-M, IMP-MISMA, P-PESADO, P-INVERSA,
 * CH-MITAD, CH-REPOSO, CH-CUARTO, CH-E-ALTURA, CH-E-PERDIDA, CH-E-INV, CM-MEDIO, CM-PESADO, CM-SIN-PESO.
 *
 * Ficha de tarea (diseno-y-animacion):
 *   Promesa: ver que en un choque cambian las velocidades pero la suma de las flechas m·v se mantiene.
 *   Persona y condiciones: postulante de 4.º y 5.º, celular de gama baja a 360 px, a veces sin conexión.
 *   Resultado observable: calcula un impulso como área, una velocidad tras un choque, e y un centro de masa.
 *   Orden de atención: 1.º las flechas o el área · 2.º la lectura en vivo · acción: el botón fijo · fondo: Tilo.
 *   Estados: juego sin tocar · predicción pendiente · coincide / no coincide · paso de mira · caso nuevo · «No sé».
 *   Duda que resuelve: ¿qué se conserva en un choque y qué se pierde?
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


  // Etapa 9, entrega parcial: cantidad de movimiento antes de estudiar su cambio.
  // Colores fijos de esta idea: masa f, velocidad o, cantidad de movimiento i.
  // Las otras cinco ideas conservan su versión anterior hasta la revisión de Gerson.
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
      if (a.vx) flechas.push({ de: [x, y + 60], ang: a.vx > 0 ? 0 : 180, largo: 80 * Math.abs(a.vx) / maxV, color: 'o' });
      const verP = (revelar || a.dadoP) && a.px != null;
      textos.push({ x: 12, y: y + 86, texto: verP ? `p_x = ${cmFmt(a.px)} kg·m/s` : 'p⃗ = ?', color: verP ? 'i' : 'tinta' });
      if (verP && a.px) flechas.push({ de: [x, y + 103], ang: a.px > 0 ? 0 : 180, largo: 80 * Math.abs(a.px) / maxP, color: 'i', discontinua: true });
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
      if (tipo === 'carga') { tx[0].texto = `m_c = ${cmFmt(c.mc)} kg`; tx[0].color = 'f'; tx.push({ x: 12, y: 178, texto: `m_L = ${cmFmt(c.ml)} kg`, color: 'f' }); dibujo.datos.alto = 200; }
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
    { nivel: 2, titulo: 'La rapidez del medidor', tipo: 'kmh', m: 3, kmh: 18 },
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
  // Familias separadas: resuelve usa masas 9/11/13, Ahora tú 2/4/6/8.
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
    resuelve: { pieza: 'fis-estatica', generar: s => cmGenerar(s, true) },
    ahoraTu: { pieza: 'fis-estatica', generar: s => cmGenerar(s, false) },
  };

  // ---------- Idea antigua 1: el área de F–t es el impulso ----------
  // Cambia: el pico de la fuerza y su duración · Permanece: la pelota de 0,5 kg, en reposo al inicio ·
  // Progresa: el área bajo la curva, que se pinta · Se reserva: dos golpes de distinta forma con la misma área ·
  // Debe verse: que lo que cambia la velocidad es el área, no el pico.
  const M1 = 0.5;
  const ejeFt = (tmax, fmax) => ({
    x: { min: 0, max: tmax, paso: 0.1, cada: 1, nombre: 't', unidad: 's', decimales: 1, color: 'd' },
    y: { min: 0, max: fmax, paso: 10, nombre: 'F', unidad: 'N', decimales: 0, color: 'h' },
  });
  const pulso = (Fm, T, t0 = 0) => [[t0, 0], [t0 + T / 2, Fm], [t0 + T, 0]];
  // El golpe del juego: triángulo de pico Fm y duración T, con su área (el impulso) rotulada.
  const areaGolpe = (Fm, T, forma = 'tri') => (forma === 'rect' ? Fm * T : Fm * T / 2);
  const golpe = (Fm, T, forma = 'tri', fmax = 50) => {
    const pts = forma === 'rect' ? [[0, 0], [0, Fm], [T, Fm], [T, 0]] : pulso(Fm, T);
    const J = areaGolpe(Fm, T, forma);
    return Object.assign(ejeFt(0.6, fmax), { curvas: [{ puntos: pts, color: 'h' }], areas: [{ puntos: pts, color: 'i', rotulo: `${f(J)} N·s` }] });
  };
  // Animación (decisión de Gerson, 15 nov: física se mueve sola). El golpe ocurre en cámara lenta: t avanza 0,15 s
  // por segundo de pantalla. F(t) es la misma forma del golpe; el área hasta t, J(t), sale de integrar esa forma en
  // fórmula cerrada (regla 1), y v(t) = J(t) / m porque la pelota estaba quieta.
  const fuerzaEn = (Fm, T, tt, forma = 'tri') => {
    if (tt < 0 || tt > T) return 0;
    return forma === 'rect' ? Fm : (tt <= T / 2 ? 2 * Fm * tt / T : 2 * Fm * (T - tt) / T);
  };
  const impulsoHasta = (Fm, T, tt, forma = 'tri') => {
    const u = Math.max(0, Math.min(tt, T));
    if (forma === 'rect') return Fm * u;
    return u <= T / 2 ? Fm * u * u / T : Fm * T / 2 - Fm * (T - u) * (T - u) / T;
  };
  const golpeT = (Fm, T, tt, forma = 'tri', fmax = 50) => {
    const u = Math.max(0, Math.min(tt, T)), Ju = impulsoHasta(Fm, T, tt, forma);
    const pts = forma === 'rect' ? [[0, Fm], [u, Fm]] : [[0, 0], ...(u > T / 2 ? [[T / 2, Fm]] : []), [u, fuerzaEn(Fm, T, u, forma)]];
    const d = golpe(Fm, T, forma, fmax);
    d.areas = u > 0 ? [{ puntos: pts, color: 'i', rotulo: Ju >= 0.5 ? `${f(Ju)} N·s` : '' }] : [];
    d.puntos = [{ x: tt, y: fuerzaEn(Fm, T, tt, forma), color: 'h', guias: true }];
    return d;
  };
  const impulso = {
    id: 'impulso',
    titulo: 'El área de F–t empuja',
    temas: ['Impulso', 'Cantidad de movimiento'],
    pieza: 'ejes',
    juega: {
      consigna: 'Una raqueta golpea una pelota quieta de 0,5 kg, en cámara lenta. Mira cómo se llena el área. Cambia el pico y la duración.',
      voz: 'Mira el área sombreada y la rapidez con que sale la pelota.',
      controles: [
        { id: 'F', etiqueta: 'F máx', color: 'c-h', min: 10, max: 50, paso: 10, inicio: 30, unidad: 'N', decimales: 0 },
        { id: 'T', etiqueta: 'Δt', color: 'c-d', min: 0.1, max: 0.5, paso: 0.1, inicio: 0.2, unidad: 's', decimales: 1 },
        { id: 't', etiqueta: 't', color: 'c-d', min: 0, max: 0.6, paso: 0.01, inicio: 0, unidad: 's', decimales: 2, auto: { velocidad: 0.15, modo: 'repite' } },
      ],
      dibujo: val => ({ datos: golpeT(val.F, val.T, val.t), estado: {} }),
      lectura: val => { const J = impulsoHasta(val.F, val.T, val.t); return [t, ` = ${f(val.t)} s · J = ${f(J)} N·s · `, v, ` = ${f(J / M1)} m/s`]; },
      minimo: 3,
      // Arrastra el pico (qué tan fuerte) o el final del golpe (cuánto dura); el área responde.
      arrastres: [
        { id: 'pico', etiqueta: 'pico de la fuerza', color: 'c-h',
          donde: val => { const g = PZ('ejes').geometria(golpe(val.F, val.T)); return { x: g.X(val.T / 2), y: g.Y(val.F) }; },
          mover: (pt, val) => ({ F: PZ('ejes').geometria(golpe(val.F, val.T)).Yi(pt.y) }) },
        { id: 'fin', etiqueta: 'final del golpe', color: 'c-d',
          donde: val => { const g = PZ('ejes').geometria(golpe(val.F, val.T)); return { x: g.X(val.T), y: g.Y(0) }; },
          mover: (pt, val) => ({ T: PZ('ejes').geometria(golpe(val.F, val.T)).Xi(pt.x) }) },
      ],
    },
    predice: {
      pregunta: 'La misma pelota llega igual de rápido y se detiene contra una pared dura o contra un colchón, que tarda más en frenarla. Con el colchón, la fuerza máxima…',
      opciones: [
        { id: 'c', texto: 'es menor: el mismo impulso repartido en más tiempo', correcta: true },
        { id: 'misma', texto: 'es la misma: el cambio de velocidad es igual', error: 'IMP-MISMA', siFuera: 'El cambio de p sí es igual. Pero ese cambio es el área: más ancho, menos alto.' },
        { id: 'menor-imp', texto: 'es menor porque el colchón da menos impulso', error: 'M7', siFuera: 'Que duela menos es cierto. Pero el impulso es el mismo: en los dos casos se detiene.' },
        { id: 'mayor', texto: 'es mayor, porque actúa durante más tiempo', error: 'IMP-PICO', siFuera: 'Más tiempo sí da más impulso si la fuerza no baja. Aquí el impulso está fijo.' },
      ],
      dibujo: { datos: Object.assign(ejeFt(0.6, 50), { curvas: [{ puntos: pulso(40, 0.15), color: 'h', rotulo: 'pared', en: [0.09, 40] }] }), estado: {} },
      revelar: { datos: Object.assign(ejeFt(0.6, 50), {
        curvas: [{ puntos: pulso(40, 0.15), color: 'h', rotulo: 'pared', en: [0.09, 40] }, { puntos: pulso(12, 0.5, 0.05), color: 'h', rotulo: 'colchón', en: [0.32, 16] }],
        areas: [{ puntos: pulso(40, 0.15), color: 'i', rotulo: '3 N·s' }, { puntos: pulso(12, 0.5, 0.05), color: 'i', rotulo: '3 N·s' }],
      }), estado: {} },
      coincide: 'Coincide: las dos áreas valen 3 N·s; la del colchón es más baja y más ancha.',
    },
    mira: {
      datos: Object.assign(ejeFt(0.6, 50), {
        curvas: [{ puntos: pulso(40, 0.3), color: 'h' }],
        puntos: [{ x: 0.15, y: 40, color: 'h', rotulo: '40 N', guias: true, desde: 1 }],
        areas: [{ puntos: pulso(40, 0.3), color: 'i', rotulo: '6 N·s', desde: 2 }],
      }),
      pasos: [
        { estado: { corte: 1 }, texto: 'El golpe sube hasta 40 N y dura 0,3 s.', ecuacion: [{ sub: [F, 'máx'] }, ' = 40 N', '   ·   ', dt, ' = 0,3 s'] },
        { estado: { corte: 2 }, texto: 'El impulso es el área del triángulo.', ecuacion: ['J = ½ · 40 · 0,3 = 6 N·s'] },
        { estado: { corte: 2 }, texto: 'Ese impulso es el cambio de la cantidad de movimiento.', ecuacion: [dp, ' = J = 6 kg·m/s'] },
        { estado: { corte: 2 }, texto: 'La pelota de 0,5 kg estaba quieta: sale a 12 m/s.', ecuacion: [v, ' = ', { frac: [dp, 'm'] }, ' = ', { frac: ['6', '0,5'] }, ' = 12 m/s'] },
      ],
    },
    regla: {
      texto: 'La cantidad de movimiento es p = m·v. El impulso de la fuerza neta es el área bajo F–t, y es igual al cambio de p.',
      ecuacion: [p, ' = m', v, '   ·   ', 'J = ', { llave: [F, ' · ', dt], nota: 'área bajo F–t', color: 'c-h' }, ' = ', { llave: [dp], nota: 'cambio de p', color: 'c-i' }],
      condicion: 'F es la fuerza neta. Si F cambia en el tiempo, se usa el área con signo, no el pico.',
    },
    ahoraTu: {
      generar(s) {
        const r = azar(s), tri = s % 2 === 0, Fm = r.ent(2, 8) * 10, T = r.ent(1, 4) / 10, m = r.de([0.2, 0.4, 0.5, 1, 2]);
        const J = tri ? Fm * T / 2 : Fm * T, vf = J / m;
        const forma = tri ? [[0, 0], [T / 2, Fm], [T, 0]] : [[0, 0], [0, Fm], [T, Fm], [T, 0]];
        const datos = Object.assign(ejeFt(0.6, 80), { curvas: [{ puntos: forma, color: 'h' }], puntos: [{ x: tri ? T / 2 : T / 2, y: Fm, color: 'h', rotulo: `${f(Fm)} N` }] });
        return {
          pregunta: ['Un cuerpo de ', f(m), ` kg está quieto. Recibe el golpe de la gráfica, que dura ${f(T, 1)} s. ¿Con qué rapidez sale?`],
          dibujo: { datos, estado: {} },
          opciones: opciones(vf, [
            { id: 'tri', valor: tri ? Fm * T / m : Fm * T / 2 / m, error: tri ? 'IMP-TRI' : 'IMP-PICO', siFuera: tri ? 'Eso toma el rectángulo completo; el área del triángulo es la mitad.' : 'Eso toma la mitad del área, como si fuera un triángulo.' },
            { id: 'sin-m', valor: J, error: 'IMP-M', siFuera: 'Ese número es el impulso. Falta dividir entre la masa.' },
            { id: 'por-m', valor: J * m, error: 'IMP-M', siFuera: 'Eso multiplica por la masa; Δv = J / m.' },
          ], n => `${f(n)} m/s`),
          solucion: {
            texto: tri ? 'El área es un triángulo; luego se divide entre la masa.' : 'El área es un rectángulo; luego se divide entre la masa.',
            ecuacion: ['J = ', tri ? `½ · ${f(Fm)} · ${f(T, 1)}` : `${f(Fm)} · ${f(T, 1)}`, ` = ${f(J)} N·s`, '   ·   ', v, ` = ${f(J)} / ${f(m)} = ${f(vf)} m/s`],
            dibujo: { datos: Object.assign({}, datos, { areas: [{ puntos: forma, color: 'i', rotulo: `${f(J)} N·s` }] }), estado: {} },
          },
        };
      },
    },
  };

  // ---------- Idea 2: lo que uno gana, el otro lo pierde (conservación de p) ----------
  // Cambia: las masas de los dos carritos · Permanece: el resorte, que da 6 N·s a cada uno en sentidos opuestos ·
  // Progresa: las dos flechas de v, que crecen distinto · Se reserva: la suma con signo, que siempre da 0 ·
  // Debe verse: flechas de v distintas, pero m·v iguales y opuestas.
  const J0 = 6, LR = 12;
  const PEG = L => 48 * L / 270; // un carrito de la pieza fis-riel mide 46 px de 270: así se dibujan pegados
  const explosion = (mA, mB, conNotas = true) => {
    const vA = -J0 / mA, vB = J0 / mB;
    return {
      largo: LR, escalaV: 7, colores: { v: 'o' },
      filas: [
        { rotulo: 'Antes', nota: conNotas ? 'p total = 0' : '', carros: [{ x: 5, m: mA, v: 0, rotulo: 'A' }, { x: 5 + PEG(LR), m: mB, v: 0, rotulo: 'B', variante: 'b' }] },
        { rotulo: 'Después', desde: 1, nota: conNotas ? `${f(mA * vA)} + ${f(mB * vB)} = 0` : '', carros: [{ x: Math.max(1, 5 + vA * 0.6), m: mA, v: vA, rotulo: 'A' }, { x: Math.min(11, 5 + PEG(LR) + vB * 0.6), m: mB, v: vB, rotulo: 'B', variante: 'b' }] },
      ],
    };
  };
  // Animación: el resorte suelta a los carritos en t = 0,2 s y cada uno sigue con su velocidad: x = x₀ + v·(t − 0,2).
  // En cámara lenta (0,2 s por segundo de pantalla). La p total, que se lee en vivo, sigue en 0.
  const SUELTA = 0.2;
  const explosionT = (mA, mB, tt) => {
    const d = explosion(mA, mB), s = Math.max(0, tt - SUELTA), vA = s > 0 ? -J0 / mA : 0, vB = s > 0 ? J0 / mB : 0;
    d.filas[1] = { rotulo: 'Ahora', nota: `p total = ${f(mA * vA + mB * vB)}`, carros: [{ x: 5 + (-J0 / mA) * s, m: mA, v: vA, rotulo: 'A' }, { x: 5 + PEG(LR) + (J0 / mB) * s, m: mB, v: vB, rotulo: 'B', variante: 'b' }] };
    return d;
  };
  const conservacion = {
    id: 'conservacion',
    titulo: 'Lo que uno gana, otro pierde',
    temas: ['Conservación de la cantidad de movimiento', 'Cantidad de movimiento'],
    pieza: 'fis-riel',
    juega: {
      consigna: 'Dos carritos quietos tienen un resorte apretado entre ellos. Se suelta y los separa, en cámara lenta. Elige sus masas y compara.',
      voz: 'Compara las flechas de velocidad con las masas.',
      controles: [
        { id: 'mA', etiqueta: 'masa de A', min: 1, max: 4, paso: 1, inicio: 2, unidad: 'kg', decimales: 0 },
        { id: 'mB', etiqueta: 'masa de B', min: 1, max: 4, paso: 1, inicio: 1, unidad: 'kg', decimales: 0 },
        { id: 't', etiqueta: 't', color: 'c-d', min: 0, max: 0.8, paso: 0.02, inicio: 0, unidad: 's', decimales: 2, auto: { velocidad: 0.2, modo: 'repite' } },
      ],
      dibujo: val => ({ datos: explosionT(val.mA, val.mB, val.t), estado: { corte: 1 } }),
      lectura: val => { const s = val.t > SUELTA; return [t, ` = ${f(val.t)} s · `, { sub: [p, 'A'] }, ` = ${s ? f(-J0) : 0} · `, { sub: [p, 'B'] }, ` = ${s ? '+' + f(J0) : 0} · total 0`]; },
      minimo: 3,
    },
    predice: {
      pregunta: 'Un carrito de 3 kg y otro de 1 kg, quietos, se separan con un resorte. El de 1 kg sale a 6 m/s hacia la derecha. ¿Y el de 3 kg?',
      opciones: [
        { id: 'c', texto: '2 m/s hacia la izquierda', correcta: true },
        { id: 'igual', texto: '6 m/s hacia la izquierda', error: 'M8', siFuera: 'El empujón sí es igual para los dos. Pero con 3 kg, el mismo empujón da menos rapidez.' },
        { id: 'por', texto: '18 m/s hacia la izquierda', error: 'P-INVERSA', siFuera: 'La masa sí entra en la cuenta. Pero más masa da menos velocidad: se divide.' },
        { id: 'quieto', texto: 'Se queda quieto: es más pesado', error: 'P-PESADO', siFuera: 'Se moverá menos, eso es cierto. Pero el resorte también lo empuja a él.' },
      ],
      dibujo: { datos: { largo: LR, escalaV: 7, colores: { v: 'o' }, filas: [{ rotulo: 'Antes', carros: [{ x: 5, m: 3, v: 0, rotulo: 'A' }, { x: 5 + PEG(LR), m: 1, v: 0, rotulo: 'B', variante: 'b' }] }, { rotulo: 'Después', desde: 1, carros: [{ x: 9, m: 1, v: 6, rotulo: 'B', variante: 'b' }] }] }, estado: { corte: 1 } },
      revelar: { datos: { largo: LR, escalaV: 7, colores: { v: 'o' }, filas: [{ rotulo: 'Antes', nota: 'p total = 0', carros: [{ x: 5, m: 3, v: 0, rotulo: 'A' }, { x: 5 + PEG(LR), m: 1, v: 0, rotulo: 'B', variante: 'b' }] }, { rotulo: 'Después', nota: '3·(−2) + 1·6 = 0', carros: [{ x: 3.7, m: 3, v: -2, rotulo: 'A' }, { x: 9, m: 1, v: 6, rotulo: 'B', variante: 'b' }] }] }, estado: { corte: 1 } },
      coincide: 'Coincide: 3 kg por 2 m/s hacia un lado es lo mismo que 1 kg por 6 m/s hacia el otro.',
    },
    mira: {
      pieza: 'fis-riel',
      datos: explosion(3, 1),
      pasos: [
        { estado: { corte: 0 }, texto: 'Antes, los dos están quietos: la cantidad de movimiento total es 0.', ecuacion: [{ sub: [p, 'total'] }, ' = 0'] },
        { estado: { corte: 1 }, texto: 'El resorte empuja a cada uno con el mismo impulso, en sentidos opuestos.', ecuacion: [{ sub: [p, 'A'] }, ' = −6', '   ·   ', { sub: [p, 'B'] }, ' = +6 kg·m/s'] },
        { estado: { corte: 1 }, texto: 'Cada velocidad sale de dividir entre su masa.', ecuacion: [{ sub: [v, 'A'] }, ' = −6/3 = −2 m/s', '   ·   ', { sub: [v, 'B'] }, ' = 6/1 = 6 m/s'] },
        { estado: { corte: 1 }, texto: 'La suma con signo sigue siendo 0.', ecuacion: ['3 · (−2) + 1 · 6 = 0'] },
      ],
    },
    regla: {
      texto: 'En un sistema aislado, sin impulso externo, la cantidad de movimiento total se conserva: la suma de m·v, con signo, es la misma antes y después.',
      ecuacion: [{ llave: [{ sub: ['m', 'A'] }, { sub: [v, 'A'] }, ' + ', { sub: ['m', 'B'] }, { sub: [v, 'B'] }], nota: 'antes', color: 'c-i' }, ' = ', { llave: [{ sub: ['m', 'A'] }, { sub: [v, "A'"] }, ' + ', { sub: ['m', 'B'] }, { sub: [v, "B'"] }], nota: 'después', color: 'c-i' }],
      condicion: 'el impulso de las fuerzas externas es nulo o despreciable en ese intervalo. Las velocidades llevan signo.',
    },
    ahoraTu: {
      pieza: 'fis-riel',
      generar(s) {
        const r = azar(s), mA = r.ent(1, 4), mB = r.ent(1, 4), vA = r.de([2, 3, 4, 5, 6]);
        const vf = mA * vA / (mA + mB);
        const fila = (rot, cs, desde) => ({ rotulo: rot, desde, carros: cs });
        const antes = fila('Antes', [{ x: 2, m: mA, v: vA, rotulo: 'A' }, { x: 7, m: mB, v: 0, rotulo: 'B', variante: 'b' }], 0);
        return {
          pregunta: `El carrito A choca con B, que está quieto, y salen pegados. ¿Con qué velocidad se mueven juntos?`,
          dibujo: { datos: { largo: 10, escalaV: 8, colores: { v: 'o' }, filas: [antes] }, estado: {} },
          opciones: opciones(vf, [
            { id: 'mitad', valor: vA / 2, error: 'CH-MITAD', siFuera: 'La mitad sería cierta si las dos masas fueran iguales.' },
            { id: 'igual', valor: vA, error: 'M1', siFuera: 'Esa rapidez dejaría más cantidad de movimiento que la que había.' },
            { id: 'cociente', valor: mA * vA / mB, error: 'P-INVERSA', siFuera: 'Eso divide solo entre B; ahora se mueven las dos masas juntas.' },
            { id: 'cero', valor: 0, error: 'CH-REPOSO', siFuera: 'Pegarse no es detenerse: la cantidad de movimiento sigue ahí.' },
          ], n => `${f(n)} m/s`),
          solucion: {
            texto: 'La cantidad de movimiento de A se reparte entre las dos masas juntas.',
            ecuacion: [v, ` = ${f(mA)} · ${f(vA)} / (${f(mA)} + ${f(mB)}) = ${f(vf)} m/s`],
            dibujo: { datos: { largo: 10, escalaV: 8, colores: { v: 'o' }, filas: [antes, fila('Después', [{ x: 5, m: mA, v: vf, rotulo: 'A' }, { x: 5 + PEG(10), m: mB, v: vf, rotulo: 'B', variante: 'b' }], 1)] }, estado: { corte: 1 } },
          },
        };
      },
    },
  };

  // ---------- Idea 3: elástico e inelástico ----------
  // Cambia: qué tan elástico es el choque (e) y la masa de B · Permanece: A de 2 kg a 4 m/s; p total = 8 kg·m/s ·
  // Progresa: la energía cinética que queda · Se reserva: el choque en que salen pegados ·
  // Debe verse: p igual en todos los choques; K igual solo en el elástico.
  const MA = 2, VA = 4;
  const choque = (e, mB) => {
    const vA2 = (MA - e * mB) * VA / (MA + mB), vB2 = (1 + e) * MA * VA / (MA + mB);
    return { vA2, vB2, K0: MA * VA * VA / 2, K1: MA * vA2 * vA2 / 2 + mB * vB2 * vB2 / 2 };
  };
  const rielChoque = (e, mB, notas = true) => {
    const c = choque(e, mB);
    const pegados = e === 0;
    return {
      largo: 10, escalaV: 8, colores: { v: 'o' },
      filas: [
        { rotulo: 'Antes', nota: notas ? `K = ${f(c.K0)} J` : '', carros: [{ x: 2, m: MA, v: VA, rotulo: 'A' }, { x: 5.5, m: mB, v: 0, rotulo: 'B', variante: 'b' }] },
        { rotulo: 'Después', desde: 1, nota: notas ? `K = ${f(c.K1)} J` : '', carros: pegados
          ? [{ x: 6.4, m: MA, v: c.vA2, rotulo: 'A' }, { x: 6.4 + PEG(10), m: mB, v: c.vB2, rotulo: 'B', variante: 'b' }]
          : [{ x: 4.5 + c.vA2 * 0.3, m: MA, v: c.vA2, rotulo: 'A' }, { x: 6.5 + c.vB2 * 0.4, m: mB, v: c.vB2, rotulo: 'B', variante: 'b' }] },
      ],
    };
  };
  // Animación: A sale de x = 2 m hacia B (quieto en 5,5 m); se tocan cuando A llega a 5,5 m − un carrito, en
  // tc = (5,5 − 2 − largo del carrito) / 4 s. Antes de tc, x = x₀ + v·t; después, cada uno sigue con la velocidad que
  // dan p y e (choque()). En cámara lenta: 0,25 s por segundo de pantalla. K se lee en vivo; p no cambia.
  const XA3 = 2, XB3 = 5.5, TC3 = (XB3 - PEG(10) - XA3) / VA;
  const enChoque3 = (e, mB, tt) => {
    const c = choque(e, mB), s = tt - TC3;
    if (s < 0) return { xA: XA3 + VA * tt, xB: XB3, vA: VA, vB: 0, K: c.K0 };
    return { xA: XB3 - PEG(10) + c.vA2 * s, xB: XB3 + c.vB2 * s, vA: c.vA2, vB: c.vB2, K: c.K1 };
  };
  const rielChoqueT = (e, mB, tt) => {
    const d = rielChoque(e, mB), q = enChoque3(e, mB, tt);
    d.filas[1] = { rotulo: 'Ahora', nota: `K = ${f(q.K)} J`, carros: [{ x: q.xA, m: MA, v: q.vA, rotulo: 'A' }, { x: q.xB, m: mB, v: q.vB, rotulo: 'B', variante: 'b' }] };
    return d;
  };
  const elastico = {
    id: 'elastico-inelastico',
    titulo: 'La energía cinética puede perderse',
    temas: ['Choques elásticos e inelásticos', 'Conservación de la cantidad de movimiento'],
    pieza: 'fis-riel',
    juega: {
      consigna: 'A (2 kg, 4 m/s) choca con B, quieto, en cámara lenta. Elige la masa de B y qué tan elástico es el choque.',
      voz: 'Lee la energía cinética antes y después, y la suma de m·v.',
      controles: [
        { id: 'e', etiqueta: 'elástico (e)', min: 0, max: 1, paso: 0.25, inicio: 0.5, decimales: 2 },
        { id: 'mB', etiqueta: 'masa de B', min: 1, max: 4, paso: 1, inicio: 2, unidad: 'kg', decimales: 0 },
        { id: 't', etiqueta: 't', color: 'c-d', min: 0, max: 1, paso: 0.02, inicio: 0, unidad: 's', decimales: 2, auto: { velocidad: 0.25, modo: 'repite' } },
      ],
      dibujo: val => ({ datos: rielChoqueT(val.e, val.mB, val.t), estado: { corte: 1 } }),
      lectura: val => { const q = enChoque3(val.e, val.mB, val.t); return [t, ` = ${f(val.t)} s · `, p, ` = ${f(MA * q.vA + val.mB * q.vB)} · K = ${f(q.K)} J`]; },
      minimo: 3,
    },
    predice: {
      pregunta: 'Dos carritos iguales de 2 kg: A va a 4 m/s, choca con B quieto y salen pegados. ¿Cuánta energía cinética queda después del choque?',
      opciones: [
        { id: 'c', texto: '8 J', correcta: true },
        { id: 'toda', texto: '16 J, la misma de antes', error: 'M1', siFuera: 'Lo de antes y después sí se conserva para p. La energía cinética, aquí, no.' },
        { id: 'nada', texto: '0 J: quedan quietos', error: 'CH-REPOSO', siFuera: 'Se pierde energía, eso es cierto. Pero siguen moviéndose juntos a 2 m/s.' },
        { id: 'cuarto', texto: '4 J', error: 'CH-CUARTO', siFuera: 'Eso usa 2 m/s con una sola masa. Ahora se mueven los 4 kg.' },
      ],
      dibujo: { datos: rielChoque(0, 2, false), estado: { corte: 0 } },
      revelar: { datos: rielChoque(0, 2, true), estado: { corte: 1 } },
      coincide: 'Coincide: salen a 2 m/s los 4 kg; ½ · 4 · 2² = 8 J. La otra mitad se volvió calor y deformación.',
    },
    mira: {
      pieza: 'fis-riel',
      datos: rielChoque(0, 2),
      pasos: [
        { estado: { corte: 0 }, texto: 'Antes: 2 kg a 4 m/s.', ecuacion: [p, ' = 2 · 4 = 8 kg·m/s', '   ·   ', 'K = ½ · 2 · ', { sup: ['4', '2'] }, ' = 16 J'] },
        { estado: { corte: 1 }, texto: 'Salen pegados (perfectamente inelástico): los 4 kg comparten la cantidad de movimiento.', ecuacion: [v, ' = 8 / 4 = 2 m/s'] },
        { estado: { corte: 1 }, texto: 'La energía cinética después es la mitad.', ecuacion: ['K = ½ · 4 · ', { sup: ['2', '2'] }, ' = 8 J'] },
        { estado: { corte: 1 }, texto: 'Elástico (e = 1): A se detiene y B sale con los 16 J.', ecuacion: ['e = 1:   ', { sub: [v, "A'"] }, ' = 0', '   ·   ', { sub: [v, "B'"] }, ' = 4 m/s'] },
      ],
    },
    regla: {
      texto: 'En todo choque aislado se conserva p. La energía cinética se conserva solo en el choque elástico; en el inelástico, parte pasa a calor y deformación.',
      ecuacion: ['K = ½ m', { sup: [v, '2'] }, '   ·   ', { sub: [p, 'antes'] }, ' = ', { sub: [p, 'después'] }],
      condicion: 'el choque es breve y sin impulso externo. Salir pegados es el caso más inelástico, y no implica quedar quietos.',
    },
    ahoraTu: {
      pieza: 'fis-riel',
      generar(s) {
        const r = azar(s), mA = r.ent(1, 4), mB = r.ent(1, 4), vA = r.de([2, 4, 6]);
        const vf = mA * vA / (mA + mB), K0 = mA * vA * vA / 2, K1 = (mA + mB) * vf * vf / 2;
        return {
          pregunta: `A, de ${f(mA)} kg, va a ${f(vA)} m/s y choca con B, de ${f(mB)} kg, quieto. Salen pegados. ¿Cuánta energía cinética se pierde en el choque?`,
          dibujo: { datos: { largo: 10, escalaV: 8, colores: { v: 'o' }, filas: [{ rotulo: 'Antes', carros: [{ x: 2, m: mA, v: vA, rotulo: 'A' }, { x: 6, m: mB, v: 0, rotulo: 'B', variante: 'b' }] }] }, estado: {} },
          opciones: opciones(K0 - K1, [
            { id: 'nada', valor: 0, error: 'M1', siFuera: 'No perder nada sería cierto en un choque elástico. Pegados, sí se pierde.' },
            { id: 'toda', valor: K0, error: 'CH-REPOSO', siFuera: 'Perderla toda sería cierto si quedaran quietos; siguen moviéndose.' },
            { id: 'queda', valor: K1, error: 'CH-QUEDA', siFuera: 'Esa es la energía que queda, no la que se pierde.' },
          ], n => `${f(n)} J`),
          solucion: {
            texto: 'Primero la velocidad común con p; luego se restan las energías.',
            ecuacion: [v, ` = ${f(mA * vA)}/${f(mA + mB)} = ${f(vf)} m/s`, '   ·   ', `${f(K0)} − ${f(K1)} = ${f(K0 - K1)} J`],
          },
        };
      },
    },
  };

  // ---------- Idea 4: el coeficiente de restitución ----------
  // Cambia: qué tan elástica es la pelota (e) · Permanece: la altura de 20 m desde la que cae y g ·
  // Progresa: la altura del rebote, que crece como e² · Se reserva: la comparación de rapideces en el suelo ·
  // Debe verse: e compara rapideces, no alturas; la altura cambia con e².
  const H = 20, G = 10, VH = Math.sqrt(2 * G * H);
  const torreRebote = e => ({
    datos: { alto: 20, colores: { y: 'i', v: 'o', a: 'd' }, g: false, pelotas: [
      { y: H, v: -VH, marcas: [H], rotulo: 'cae' },
      { y: e * e * H, v: e * VH, marcas: [e * e * H], rotulo: 'sube' },
    ] }, estado: {},
  });
  // Animación: la pelota cae y rebota sola, a velocidad real. Cada tramo es un tiro vertical en fórmula cerrada:
  // cae 2 s desde 20 m; en el rebote n sale a uₙ = eⁿ · 20 m/s y vuela 2uₙ/g (regla 1). Las marcas son las alturas
  // que ya alcanzó: 20, 20e², 20e⁴…
  const enRebote = (e, tt) => {
    const caida = Math.sqrt(2 * H / G);
    if (tt <= caida) return { y: H - G * tt * tt / 2, v: -G * tt, n: 0, u: 0, cimas: [H] };
    let ini = caida, u = VH, n = 0;
    const cimas = [H];
    while (n < 60) {
      n += 1; u *= e;
      const vuelo = 2 * u / G;
      if (u < 0.05) return { y: 0, v: 0, n, u, cimas };
      const s = tt - ini;
      if (s <= vuelo) { if (s >= u / G) cimas.push(u * u / (2 * G)); return { y: Math.max(0, u * s - G * s * s / 2), v: u - G * s, n, u, cimas }; }
      cimas.push(u * u / (2 * G)); ini += vuelo;
    }
    return { y: 0, v: 0, n, u, cimas };
  };
  const torreReboteT = (e, tt) => {
    const d = torreRebote(e), q = enRebote(e, tt);
    d.datos.pelotas[0] = { y: q.y, v: q.v, marcas: q.cimas, rotulo: 'pelota' };
    d.datos.pelotas[1] = Object.assign({}, d.datos.pelotas[1], { rotulo: 'rebote 1' });
    return d;
  };
  const restitucion = {
    id: 'restitucion',
    titulo: 'e compara rapideces',
    temas: ['Coeficiente de restitución'],
    pieza: 'torre',
    juega: {
      consigna: 'Una pelota cae desde 20 m y rebota sola. Elige qué tan elástica es y compara la rapidez con que llega y con que sale.',
      voz: 'Compara las dos flechas de velocidad: la de llegada y la de salida.',
      controles: [
        { id: 'e', etiqueta: 'e', min: 0.2, max: 1, paso: 0.1, inicio: 0.6, decimales: 1 },
        { id: 't', etiqueta: 't', color: 'c-d', min: 0, max: 8, paso: 0.05, inicio: 0, unidad: 's', decimales: 2, auto: { velocidad: 1, modo: 'repite' } },
      ],
      dibujo: val => torreReboteT(val.e, val.t),
      lectura: val => {
        const q = enRebote(val.e, val.t);
        return [`y = ${f(q.y, 1)}\u00a0m · `, v, ` = ${f(q.v, 1)}\u00a0m/s · `, q.n ? `salió a ${f(q.u, 1)}\u00a0m/s` : 'aún no rebota'];
      },
      minimo: 3,
      // Arrastra la pelota que sube: su altura es e²·20 m, así que la manija da e = √(h / 20).
      arrastres: [
        { id: 'rebote', etiqueta: 'altura del rebote', color: 'c-i',
          donde: val => ({ x: PZ('torre').constantes.COLUMNAS[1], y: PZ('torre').escala(torreRebote(val.e).datos, val.e * val.e * H) - 8 }),
          mover: (pt, val) => {
            const h = inversa(y => PZ('torre').escala(torreRebote(val.e).datos, y), 0, 20)(pt.y + 8);
            return { e: Math.sqrt(Math.max(0, h) / H) };
          } },
      ],
    },
    predice: {
      pregunta: 'Una pelota cae desde 20 m y, después del rebote, sube solo hasta 5 m. ¿Cuál es su coeficiente de restitución e?',
      opciones: [
        { id: 'c', texto: '0,5', correcta: true },
        { id: 'altura', texto: '0,25', error: 'CH-E-ALTURA', siFuera: '5/20 compara alturas. e compara rapideces, y la altura va con la rapidez al cuadrado.' },
        { id: 'perdida', texto: '0,75', error: 'CH-E-PERDIDA', siFuera: 'Eso mide cuánta altura perdió, no cuánta rapidez conserva.' },
        { id: 'inv', texto: '4', error: 'CH-E-INV', siFuera: 'e compara la salida con la llegada, así que nunca pasa de 1.' },
      ],
      dibujo: { datos: { alto: 20, colores: { y: 'i', v: 'o', a: 'd' }, g: false, pelotas: [{ y: H, marcas: [H], rotulo: 'cae' }, { y: 5, marcas: [5], rotulo: 'sube' }] }, estado: {} },
      revelar: { datos: { alto: 20, colores: { y: 'i', v: 'o', a: 'd' }, g: false, pelotas: [{ y: H, v: -VH, marcas: [H], rotulo: 'llega' }, { y: 5, v: 10, marcas: [5], rotulo: 'sale' }] }, estado: {} },
      coincide: 'Coincide: llega a 20 m/s y sale a 10 m/s. La mitad de la rapidez da la cuarta parte de la altura.',
    },
    // Hallazgo 9: el juego muestra la torre (alturas) y «Mira» pasa a v–t a propósito: e compara rapideces, que la
    // torre no deja leer; el área del triángulo devuelve la altura del rebote que se vio en la torre.
    mira: {
      pieza: 'ejes',
      datos: {
        x: { min: 0, max: 3, paso: 0.5, cada: 2, nombre: 't', unidad: 's', decimales: 1, color: 'd' },
        y: { min: -20, max: 20, paso: 10, nombre: 'v', unidad: 'm/s', decimales: 0, color: 'o' },
        curvas: [{ puntos: [[0, 0], [2, -20]], color: 'o', desde: 1 }, { puntos: [[2, 10], [3, 0]], color: 'o', desde: 2 }],
        puntos: [{ x: 2, y: -20, color: 'o', rotulo: '−20 m/s', desde: 1 }, { x: 2, y: 10, color: 'o', rotulo: '+10 m/s', desde: 2 }],
        areas: [{ puntos: [[2, 10], [3, 0]], color: 'i', rotulo: '5 m', desde: 4 }],
      },
      pasos: [
        { estado: { corte: 1 }, texto: 'Cae 20 m: llega al suelo a 20 m/s hacia abajo.', ecuacion: [v, ' = √(2 · 10 · 20) = 20 m/s'] },
        { estado: { corte: 2 }, texto: 'En el rebote la velocidad salta: sale a 10 m/s hacia arriba.', ecuacion: [{ sub: [v, 'sale'] }, ' = 10 m/s'] },
        { estado: { corte: 3 }, texto: 'e compara la rapidez con que se separa y con la que se acercaba.', ecuacion: ['e = ', { frac: ['10', '20'] }, ' = 0,5'] },
        { estado: { corte: 4 }, texto: 'Sube el área del triángulo: 5 m, la cuarta parte.', ecuacion: ['h = ½ · 10 · 1 = 5 m = ', { sup: ['e', '2'] }, ' · 20'] },
      ],
    },
    regla: {
      texto: 'El coeficiente de restitución compara la rapidez con que los cuerpos se separan con la rapidez con que se acercaban. En un rebote, la altura cambia con e².',
      ecuacion: ['e = ', { frac: [{ sub: [v, 'separación'] }, { sub: [v, 'acercamiento'] }] }, '   ·   ', { frac: ['h', 'H'] }, ' = ', { sup: ['e', '2'] }],
      condicion: '0 ≤ e ≤ 1: e = 1 es elástico y e = 0 salen juntos. Para la altura: suelo quieto y sin aire.',
    },
    ahoraTu: {
      generar(s) {
        const r = azar(s);
        if (s % 2 === 0) {
          const e = r.de([0.4, 0.5, 0.6, 0.8, 0.9]), Hh = r.de([5, 10, 20, 25, 40]), h = e * e * Hh;
          return {
            pregunta: `Una pelota se suelta desde ${f(Hh)} m y rebota hasta ${f(h, 2)} m. ¿Cuál es el coeficiente de restitución?`,
            dibujo: { datos: { alto: Math.max(20, Math.ceil(Hh / 10) * 10), colores: { y: 'i', v: 'o', a: 'd' }, g: false, pelotas: [{ y: Hh, marcas: [Hh], rotulo: 'cae' }, { y: h, marcas: [h], rotulo: 'sube' }] }, estado: {} },
            opciones: opciones(e, [
              { id: 'altura', valor: h / Hh, error: 'CH-E-ALTURA', siFuera: 'Eso compara alturas; e compara rapideces: falta la raíz.' },
              { id: 'perdida', valor: 1 - h / Hh, error: 'CH-E-PERDIDA', siFuera: 'Eso es la fracción de altura que se perdió.' },
              { id: 'perd-raiz', valor: 1 - e, error: 'CH-E-PERDIDA', siFuera: 'Esa es la fracción de rapidez que se perdió, no la que queda.' },
            ], n => f(n, 2)),
            solucion: { texto: 'La altura va con e²: se saca la raíz del cociente.', ecuacion: ['e = √(', f(h, 2), ' / ', f(Hh), ') = ', f(e, 2)] },
          };
        }
        const vA = r.de([4, 5, 6, 8]), vB = r.de([1, 2]), e = r.de([0.25, 0.5, 0.75]);
        const ac = vA - vB, sep = e * ac;
        return {
          pregunta: `A va a ${f(vA)} m/s y alcanza a B, que va a ${f(vB)} m/s en el mismo sentido. Después del choque, B se aleja de A a ${f(sep, 2)} m/s más que A. ¿Cuánto vale e?`,
          opciones: opciones(e, [
            { id: 'sin-rel', valor: sep / vA, error: 'CH-E-REL', siFuera: 'Eso usa la rapidez de A sola; el acercamiento era vA − vB.' },
            { id: 'inv', valor: ac / sep, error: 'CH-E-INV', siFuera: 'Ese cociente está al revés: e no pasa de 1.' },
            { id: 'suma', valor: sep / (vA + vB), error: 'VR-SUMA', siFuera: 'Sumar sirve si iban uno hacia el otro; aquí iban al mismo lado.' },
          ], n => f(n, 2)),
          solucion: { texto: 'Se acercaban a vA − vB; se separan a lo que dice el enunciado.', ecuacion: ['e = ', f(sep, 2), ' / (', f(vA), ' − ', f(vB), ') = ', f(e, 2)] },
        };
      },
    },
  };

  // ---------- Idea 5: el centro de masa ----------
  // Cambia: las dos masas · Permanece: sus lugares (0 y 8 m) · Progresa: el punto del centro de masa, que se corre
  // hacia la mayor · Se reserva: la separación por un resorte, que mueve los carritos y no el centro ·
  // Debe verse: el centro de masa es un promedio pesado y no se mueve sin impulso externo.
  const rectaCM = (cs, xc, o = {}) => ({
    min: o.min !== undefined ? o.min : -2, max: o.max !== undefined ? o.max : 12, paso: 1, cada: 2, sufijo: ' m', decimales: 2, filas: 2,
    elementos: [
      ...cs.map(c => ({ tipo: 'punto', x: c.x, rotulo: `${f(c.m)} kg`, fila: 1, desde: c.desde || 0 })),
      ...(xc === null ? [] : [{ tipo: 'punto', x: xc, color: 'i', rotulo: o.rot || `centro ${f(xc)} m`, fila: 0, desde: o.desdeC || 0 }]),
    ],
  });
  const xcm = cs => cs.reduce((s, c) => s + c.m * c.x, 0) / cs.reduce((s, c) => s + c.m, 0);
  const m01 = m => Math.round(m * 10) / 10;
  const centro = {
    id: 'centro-masa',
    titulo: 'El centro de masa queda',
    temas: ['Centro de masa', 'Conservación de la cantidad de movimiento'],
    pieza: 'recta',
    juega: {
      consigna: 'Una masa está en x = 0 y otra en x = 8 m. La segunda crece y decrece sola: mira hacia dónde se corre el centro.',
      voz: 'Fíjate hacia cuál de las dos se corre el centro.',
      controles: [
        { id: 'm1', etiqueta: 'masa en 0', min: 1, max: 5, paso: 1, inicio: 1, unidad: 'kg', decimales: 0 },
        { id: 'm2', etiqueta: 'masa en 8 m', min: 1, max: 5, paso: 1, inicio: 3, unidad: 'kg', decimales: 0, auto: { velocidad: 1, modo: 'rebota' } },
      ],
      // Animación: la masa en 8 m barre de 1 a 5 kg y vuelve (de a 0,1 kg); el centro sale de la misma cuenta.
      dibujo: val => { const cs = [{ x: 0, m: val.m1 }, { x: 8, m: m01(val.m2) }]; return { datos: rectaCM(cs, xcm(cs)), estado: {} }; },
      lectura: val => [`Con ${f(m01(val.m2), 1)} kg en 8 m: centro en x = ${f(8 * m01(val.m2) / (val.m1 + m01(val.m2)))} m`],
      minimo: 3,
    },
    predice: {
      pregunta: 'Un carrito de 3 kg en x = 0 y otro de 1 kg en x = 8 m, quietos, se separan empujados por un resorte entre ellos. Mientras se alejan, ¿dónde está su centro de masa?',
      opciones: [
        { id: 'c', texto: 'Sigue en x = 2 m', correcta: true },
        { id: 'medio', texto: 'En x = 4 m, el punto medio', error: 'CM-MEDIO', siFuera: 'El punto medio sería cierto con masas iguales. Aquí pesa más el de x = 0.' },
        { id: 'pesado', texto: 'Se mueve junto con el carrito pesado', error: 'CM-PESADO', siFuera: 'El pesado sí lo atrae hacia su lado. Pero el liviano se aleja más rápido.' },
        { id: 'liviano', texto: 'Se corre hacia el carrito liviano, que va más rápido', error: 'CM-SIN-PESO', siFuera: 'El liviano va más rápido, cierto. Pero pesa menos en el promedio.' },
      ],
      dibujo: { datos: rectaCM([{ x: 0, m: 3 }, { x: 8, m: 1 }], null), estado: {} },
      revelar: { datos: rectaCM([{ x: -1.5, m: 3 }, { x: 12, m: 1 }], 2, { rot: 'centro: sigue en 2 m', min: -2, max: 12 }), estado: {} },
      coincide: 'Coincide: el de 3 kg retrocede 1,5 m y el de 1 kg avanza 4,5 m; el promedio pesado no cambia.',
    },
    mira: {
      pieza: 'recta',
      datos: rectaCM([{ x: 0, m: 3 }, { x: 8, m: 1 }], 2, { desdeC: 3, rot: '2 m' }),
      pasos: [
        { estado: { corte: 1 }, texto: 'Cada masa cuenta según cuánto pesa y dónde está.', ecuacion: ['3 · 0 = 0', '   ·   ', '1 · 8 = 8'] },
        { estado: { corte: 2 }, texto: 'Se suman los productos y se divide entre la masa total.', ecuacion: [{ sub: ['x', 'cm'] }, ' = ', { frac: ['0 + 8', '3 + 1'] }] },
        { estado: { corte: 3 }, texto: 'El centro queda en 2 m: más cerca de la masa mayor.', ecuacion: [{ sub: ['x', 'cm'] }, ' = 2 m'] },
        { estado: { corte: 3 }, texto: 'El resorte es una fuerza interna: los carritos se mueven, el centro no.', ecuacion: [{ sub: [p, 'total'] }, ' = 0   →   ', { sub: [v, 'cm'] }, ' = 0'] },
      ],
    },
    regla: {
      texto: 'El centro de masa es el promedio de las posiciones pesado por las masas. Sin impulso externo, se mueve con velocidad constante, o sigue quieto.',
      ecuacion: [{ sub: ['x', 'cm'] }, ' = ', { frac: [{ llave: [{ sub: ['m', '1'] }, { sub: ['x', '1'] }, ' + ', { sub: ['m', '2'] }, { sub: ['x', '2'] }], nota: 'masa por posición', arriba: true }, { llave: [{ sub: ['m', '1'] }, ' + ', { sub: ['m', '2'] }], nota: 'masa total' }] }],
      condicion: 'todas las posiciones se miden desde el mismo origen; cada cuerpo se ubica en su propio centro.',
    },
    ahoraTu: {
      pieza: 'recta',
      generar(s) {
        const r = azar(s);
        const cs = [{ x: 0, m: r.ent(1, 4) }, { x: r.ent(2, 4) * 2, m: r.ent(1, 4) }, { x: r.ent(5, 6) * 2, m: r.ent(1, 4) }];
        const xc = xcm(cs), med = (cs[0].x + cs[1].x + cs[2].x) / 3, M = cs.reduce((a, c) => a + c.m, 0);
        const suma = cs.reduce((a, c) => a + c.m * c.x, 0);
        return {
          pregunta: `Tres masas están sobre una regla: ${cs.map(c => `${f(c.m)} kg en x = ${f(c.x)} m`).join(', ')}. ¿Dónde está su centro de masa?`,
          dibujo: { datos: rectaCM(cs, null, { min: -1, max: 13 }), estado: {} },
          opciones: opciones(xc, [
            { id: 'medio', valor: med, error: 'CM-MEDIO', siFuera: 'El promedio simple sirve si las tres masas son iguales.' },
            { id: 'sin-div', valor: suma / 3, error: 'CM-SIN-PESO', siFuera: 'Eso divide entre 3 cuerpos; se divide entre la masa total.' },
            { id: 'suma', valor: suma, error: 'CM-SIN-PESO', siFuera: 'Esa es la suma de m·x; falta dividir entre la masa total.' },
          ], n => `${f(n)} m`),
          solucion: {
            texto: 'Suma de masa por posición, entre la masa total.',
            ecuacion: [{ sub: ['x', 'cm'] }, ` = ${f(suma)} / ${f(M)} = ${f(xc)} m`],
            dibujo: { datos: rectaCM(cs, xc, { min: -1, max: 13 }), estado: {} },
          },
        };
      },
    },
  };

  // ---------- Laboratorio ----------
  // Choque libre: A y B con masa y velocidad propias (B puede venir de frente) y cualquier e. Las velocidades de
  // después salen de conservar p y de la definición de e (choque frontal en una recta).
  const choqueLibre = val => {
    const M = val.mA + val.mB, P0 = val.mA * val.vA + val.mB * val.vB, ac = val.vA - val.vB;
    if (ac <= 0) return { choca: false, vA2: val.vA, vB2: val.vB, P0, K0: 0, K1: 0 };
    const vA2 = (P0 - val.mB * val.e * ac) / M, vB2 = (P0 + val.mA * val.e * ac) / M;
    const K = (a, b) => (val.mA * a * a + val.mB * b * b) / 2;
    return { choca: true, vA2, vB2, P0, K0: K(val.vA, val.vB), K1: K(vA2, vB2) };
  };
  const XA0 = 2, XB0 = 6;
  const rielLibre = val => {
    const c = choqueLibre(val), d0 = { largo: 10, escalaV: 5, colores: { v: 'o' } };
    const pegados = c.choca && val.e === 0;
    const xa = Math.max(1.5, Math.min(5, 3.5 + 0.3 * c.vA2));
    const xb = pegados ? PZ('fis-riel').pegado(d0, xa) : Math.max(PZ('fis-riel').pegado(d0, xa) + 0.3, Math.min(8.5, 6.5 + 0.3 * c.vB2));
    return Object.assign(d0, { filas: [
      { rotulo: 'Antes', nota: `p = ${f(c.P0)}`, carros: [{ x: XA0, m: val.mA, v: val.vA, rotulo: 'A' }, { x: XB0, m: val.mB, v: val.vB, rotulo: 'B', variante: 'b' }] },
      { rotulo: 'Después', nota: c.choca ? `p = ${f(c.vA2 * val.mA + c.vB2 * val.mB)}` : 'no chocan', carros: [{ x: xa, m: val.mA, v: c.vA2, rotulo: 'A' }, { x: xb, m: val.mB, v: c.vB2, rotulo: 'B', variante: 'b' }] },
    ] });
  };
  // Centro de masa libre: las dos masas se arrastran por la regla.
  const cmLibre = val => { const cs = [{ x: val.x1, m: val.m1 }, { x: val.x2, m: val.m2 }]; return rectaCM(cs, xcm(cs), { min: -2, max: 12 }); };
  // Para los retos: la misma cuenta que dibuja cada mesa. `guardado` dice si el caso actual ya se guardó.
  const salidaGolpe = val => areaGolpe(val.F, val.T, val.forma) / val.m;
  const xcmLibre = val => xcm([{ x: val.x1, m: val.m1 }, { x: val.x2, m: val.m2 }]);
  const guardado = (val, gs, claves) => gs.some(g => claves.every(c => g[c] === val[c]));
  // La mayor pérdida de energía cinética que dan los controles del choque libre (pegados, e = 0), calculada una vez.
  let perdidaMax = null;
  const PERDIDA_MAX = () => {
    if (perdidaMax === null) {
      perdidaMax = 0;
      for (let vA = 1; vA <= 6; vA++) for (let vB = -3; vB <= 3; vB++) for (let mA = 1; mA <= 4; mA++) for (let mB = 1; mB <= 4; mB++) {
        const c = choqueLibre({ vA, vB, mA, mB, e: 0 });
        if (c.choca) perdidaMax = Math.max(perdidaMax, c.K0 - c.K1);
      }
    }
    return perdidaMax;
  };

  return {
    unidad: 'fisica.impulso-y-choques',
    version: '0.3.0',
    // Entrega parcial: idea cantidad-movimiento rehecha; las cinco siguientes esperan revisión.
    letras: { m: 'masa total', m_c: 'masa del carrito vacío', m_L: 'masa de la carga', m_A: 'masa de A', m_B: 'masa de B', v: 'rapidez', v_x: 'componente horizontal de velocidad', v_A: 'velocidad de A', v_B: 'velocidad de B', p: 'módulo de cantidad de movimiento', p_x: 'componente horizontal de cantidad de movimiento', p_A: 'cantidad de movimiento de A', p_B: 'cantidad de movimiento de B', A: 'carrito A', B: 'carrito B', x: 'eje horizontal', t: 'instante del ensayo' },
    estado: 'completa',
    requiere: ['/nucleo/kit/piezas/fis-estatica.js', '/nucleo/kit/piezas/ejes.js', '/nucleo/kit/piezas/fis-riel.js', '/nucleo/kit/piezas/torre.js', '/nucleo/kit/piezas/recta.js'],
    // Glosario del tema (docs/teoria.md, 4d): las palabras que esta unidad estrena en el curso.
    glosario: [
      { termino: 'impulso', simbolo: 'J', medida: 'N·s', def: 'Efecto de una fuerza que actúa durante un tiempo: el área bajo la gráfica F–t.',
        ejemplo: 'Golpe triangular de 40 N que dura 0,3 s: J = ½ · 40 · 0,3 = 6 N·s.', ver: ['cantidad de movimiento'] },
      { termino: 'cantidad de movimiento', simbolo: 'p⃗', medida: 'kg·m/s',
        def: 'Magnitud vectorial que permite comparar el movimiento de cuerpos considerando su masa y su velocidad.',
        simple: 'Una forma de describir el movimiento teniendo en cuenta lo que se mueve.',
        ejemplos: ['Se estudia en carritos con distintas cargas.', 'Se registra para una pelota que viaja por el aire.', 'Se expresa en kilogramos metro por segundo.'], ver: ['velocidad'] },
      { termino: 'kilogramo metro por segundo', simbolo: 'kg·m/s', formas: ['kilogramo metro por segundo', 'kilogramos metro por segundo'],
        def: 'Unidad del Sistema Internacional para expresar la cantidad de movimiento.',
        simple: 'La unidad que acompaña al valor de la cantidad de movimiento.',
        ejemplos: ['El módulo puede registrarse como 22 kg·m/s.', 'Una componente puede registrarse como −15 kg·m/s.', 'La unidad acompaña también a un valor de 0 kg·m/s.'] },
      { termino: 'sistema aislado', def: 'Grupo de cuerpos sobre el que nada de afuera influye: solo actúan entre ellos.',
        ver: ['fuerza externa', 'cantidad de movimiento'] },
      { termino: 'fuerza interna', formas: ['fuerza interna', 'fuerzas internas'], def: 'Fuerza que un cuerpo del grupo hace sobre otro del mismo grupo. No cambia la cantidad de movimiento total.',
        ejemplo: 'El resorte entre dos carritos los separa, pero su p total sigue en 0.', ver: ['fuerza externa'] },
      { termino: 'fuerza externa', formas: ['fuerza externa', 'fuerzas externas', 'impulso externo'], def: 'Fuerza que algo de fuera del grupo hace sobre él. Su impulso sí cambia la cantidad de movimiento total.',
        ver: ['fuerza interna', 'sistema aislado'] },
      { termino: 'centro de masa', simbolo: 'xcm', medida: 'm', def: 'Punto promedio de las posiciones de un grupo de cuerpos, donde cada uno pesa según su masa.',
        ejemplo: '3 kg en 0 y 1 kg en 8 m: xcm = 8 / 4 = 2 m.' },
      { termino: 'choque elástico', formas: ['choque elástico', 'choques elásticos'], def: 'Choque en el que la energía cinética total de después es igual a la de antes; e = 1.',
        ejemplo: '2 kg a 4 m/s contra 2 kg quieto: A se detiene y B sale a 4 m/s.', ver: ['coeficiente de restitución'] },
      { termino: 'choque inelástico', formas: ['choque inelástico', 'choques inelásticos', 'inelástico', 'inelásticos'], def: 'Choque en el que parte de la energía cinética se vuelve calor y deformación; e es menor que 1.',
        ver: ['choque elástico', 'choque perfectamente inelástico'] },
      { termino: 'choque perfectamente inelástico', formas: ['choque perfectamente inelástico', 'perfectamente inelástico'], def: 'Choque en el que los cuerpos salen pegados, con una sola velocidad; e = 0.',
        ejemplo: '2 kg a 4 m/s se pega a 2 kg quieto: salen juntos a 2 m/s.', ver: ['choque inelástico'] },
      { termino: 'coeficiente de restitución', simbolo: 'e', def: 'Cociente entre la rapidez con que dos cuerpos se separan y la rapidez con que se acercaban.',
        ejemplo: 'Llega al suelo a 20 m/s y rebota a 10 m/s: e = 0,5.', ver: ['choque elástico'] },
    ],
    // Laboratorio: juego libre, sin preguntas. Cada mesa suelta lo que su idea deja fijo: la masa y la forma del
    // golpe, la velocidad de los dos carritos (también de frente) y el lugar de cada masa.
    laboratorio: [
      {
        id: 'golpe-libre', titulo: 'Golpes de dos formas', pieza: 'ejes',
        consigna: 'El golpe corre solo, en cámara lenta. Elige forma, pico, duración y masa. Busca dos golpes distintos con el mismo impulso.',
        controles: [
          { id: 'forma', etiqueta: 'Forma', opciones: [{ valor: 'tri', texto: 'triángulo' }, { valor: 'rect', texto: 'rectángulo' }] },
          { id: 'F', etiqueta: 'F máx', color: 'c-h', min: 10, max: 50, paso: 5, inicio: 30, unidad: 'N', decimales: 0 },
          { id: 'T', etiqueta: 'Δt', color: 'c-d', min: 0.1, max: 0.5, paso: 0.05, inicio: 0.2, unidad: 's', decimales: 2 },
          { id: 'm', etiqueta: 'masa', min: 0.25, max: 2, paso: 0.25, inicio: 0.5, unidad: 'kg', decimales: 2 },
          { id: 't', etiqueta: 't', color: 'c-d', min: 0, max: 0.6, paso: 0.02, inicio: 0, unidad: 's', decimales: 2, auto: { velocidad: 0.15, modo: 'repite' } },
        ],
        dibujo: val => ({ datos: golpeT(val.F, val.T, val.t, val.forma), estado: {} }),
        lectura: val => { const J = impulsoHasta(val.F, val.T, val.t, val.forma); return [t, ` = ${f(val.t)}\u00a0s: J = ${f(J)}\u00a0N·s → `, v, ` = ${f(J / val.m)}\u00a0m/s`]; },
        arrastres: [
          { id: 'pico', etiqueta: 'altura de la fuerza', color: 'c-h',
            donde: val => { const g = PZ('ejes').geometria(golpe(val.F, val.T, val.forma)); return { x: g.X(val.T / 2), y: g.Y(val.F) }; },
            mover: (pt, val) => ({ F: PZ('ejes').geometria(golpe(val.F, val.T, val.forma)).Yi(pt.y) }) },
          { id: 'fin', etiqueta: 'final del golpe', color: 'c-d',
            donde: val => { const g = PZ('ejes').geometria(golpe(val.F, val.T, val.forma)); return { x: g.X(val.T), y: g.Y(0) }; },
            mover: (pt, val) => ({ T: PZ('ejes').geometria(golpe(val.F, val.T, val.forma)).Xi(pt.x) }) },
        ],
        invitaciones: [
          { texto: 'Guarda un triángulo y un rectángulo que den el mismo impulso.',
            logrado: (val, guardados) => guardado(val, guardados, ['forma', 'F', 'T', 'm'])
              && guardados.some(g => g.forma !== val.forma && Math.abs(areaGolpe(g.F, g.T, g.forma) - areaGolpe(val.F, val.T, val.forma)) < 1e-9),
            bien: 'Formas distintas, la misma área: cuenta el impulso, no el dibujo.' },
          { texto: 'Haz que la pelota salga justo a 20 m/s.',
            logrado: val => Math.abs(salidaGolpe(val) - 20) < 1e-9,
            bien: 'Hay varias maneras: más masa pide más área. ¿Encontraste otra?' },
          { texto: 'Con un golpe triangular, consigue la mayor rapidez de salida.',
            logrado: val => val.forma === 'tri' && salidaGolpe(val) >= salidaGolpe({ forma: 'tri', F: 50, T: 0.5, m: 0.25 }) - 1e-9,
            bien: 'Pico alto, golpe largo y masa chica. ¿Cuál de las tres pesa más?' },
          { texto: 'Pausa el golpe justo cuando lleva la mitad de su impulso.',
            logrado: val => { const J = areaGolpe(val.F, val.T, val.forma), Jt = impulsoHasta(val.F, val.T, val.t, val.forma); return val.t > 0 && Math.abs(Jt - J / 2) <= 0.02 * J; },
            bien: 'La mitad del área llega a la mitad del golpe: es simétrico.',
            pista: 'Mira el número de J y ajusta t con − y + hasta la mitad.' },
          { texto: 'Con solo 10 N de pico, lanza la pelota a más de 5 m/s.',
            logrado: val => val.F === 10 && salidaGolpe(val) > 5,
            bien: 'Una fuerza chica que dura más también empuja mucho.' },
        ],
      },
      {
        id: 'choque-libre', titulo: 'Choque frontal libre', pieza: 'fis-riel',
        consigna: 'Arrastra las flechas de velocidad de A y B (B puede venir de frente). Elige masas y qué tan elástico es.',
        // e va primero: así el validador, que prueba los retos de dos casos guardados con los primeros 160 de la
        // grilla, alcanza a comparar el mismo choque elástico y pegado (los ids no cambian).
        controles: [
          { id: 'e', etiqueta: 'elástico (e)', min: 0, max: 1, paso: 0.25, inicio: 1, decimales: 2 },
          { id: 'vA', etiqueta: 'v de A', color: 'c-o', min: 1, max: 6, paso: 1, inicio: 4, unidad: 'm/s', decimales: 0 },
          { id: 'vB', etiqueta: 'v de B', color: 'c-o', min: -3, max: 3, paso: 1, inicio: -2, unidad: 'm/s', decimales: 0 },
          { id: 'mA', etiqueta: 'masa de A', min: 1, max: 4, paso: 1, inicio: 2, unidad: 'kg', decimales: 0 },
          { id: 'mB', etiqueta: 'masa de B', min: 1, max: 4, paso: 1, inicio: 1, unidad: 'kg', decimales: 0 },
        ],
        dibujo: val => ({ datos: rielLibre(val), estado: {} }),
        lectura: val => {
          const c = choqueLibre(val);
          return c.choca ? [`e = ${f(val.e)}: `, p, ` = ${f(c.P0)} antes y después · K: ${f(c.K0)} → ${f(c.K1)}\u00a0J`] : ['B va más rápido que A: no chocan'];
        },
        arrastres: [
          { id: 'flecha-a', etiqueta: 'velocidad de A', color: 'c-o',
            donde: val => PZ('fis-riel').punta(rielLibre(val), 0, { x: XA0, v: val.vA }),
            mover: (pt, val) => ({ vA: PZ('fis-riel').velocidadDe(rielLibre(val), XA0, pt.x) }) },
          { id: 'flecha-b', etiqueta: 'velocidad de B', color: 'c-o',
            donde: val => PZ('fis-riel').punta(rielLibre(val), 0, { x: XB0, v: val.vB }),
            mover: (pt, val) => ({ vB: PZ('fis-riel').velocidadDe(rielLibre(val), XB0, pt.x) }) },
        ],
        invitaciones: [
          { texto: 'Haz que choquen y los dos queden quietos después.',
            logrado: val => { const c = choqueLibre(val); return c.choca && Math.abs(c.vA2) < 1e-9 && Math.abs(c.vB2) < 1e-9; },
            bien: 'La p total ya era cero: pegados, no les queda con qué moverse.' },
          { texto: 'Consigue que A y B intercambien sus velocidades al chocar.',
            logrado: val => { const c = choqueLibre(val); return c.choca && Math.abs(c.vA2 - val.vB) < 1e-9 && Math.abs(c.vB2 - val.vA) < 1e-9; },
            bien: 'Masas iguales y choque elástico: cada uno sale con la del otro.' },
          { texto: 'Busca el choque que más energía cinética pierde.',
            logrado: val => { const c = choqueLibre(val); return c.choca && c.K0 - c.K1 >= PERDIDA_MAX() - 1e-9; },
            bien: 'De frente, rápidos y pegados. Aun así, p no cambió.' },
          { texto: 'Guarda el mismo choque elástico y pegado. Compara p y K.',
            logrado: (val, guardados) => choqueLibre(val).choca && guardado(val, guardados, ['vA', 'vB', 'mA', 'mB', 'e'])
              && guardados.some(g => g.vA === val.vA && g.vB === val.vB && g.mA === val.mA && g.mB === val.mB && g.e + val.e === 1 && g.e * val.e === 0),
            bien: 'La p es la misma en los dos; K solo se quedó en el elástico.' },
        ],
      },
      {
        id: 'centro-libre', titulo: 'Masas que se mueven', pieza: 'recta',
        consigna: 'Arrastra cada masa por la regla y cambia cuánto pesa. Mira hacia dónde se corre el centro de masa.',
        controles: [
          { id: 'x1', etiqueta: 'lugar de 1', min: -2, max: 4, paso: 1, inicio: 0, unidad: 'm', decimales: 0 },
          { id: 'm1', etiqueta: 'masa 1', min: 1, max: 6, paso: 1, inicio: 3, unidad: 'kg', decimales: 0 },
          { id: 'x2', etiqueta: 'lugar de 2', min: 5, max: 12, paso: 1, inicio: 8, unidad: 'm', decimales: 0 },
          { id: 'm2', etiqueta: 'masa 2', min: 1, max: 6, paso: 1, inicio: 1, unidad: 'kg', decimales: 0 },
        ],
        dibujo: val => ({ datos: cmLibre(val), estado: {} }),
        lectura: val => [`${f(val.m1)} kg en ${f(val.x1)} · ${f(val.m2)} kg en ${f(val.x2)} → centro ${f(xcm([{ x: val.x1, m: val.m1 }, { x: val.x2, m: val.m2 }]))}\u00a0m`],
        arrastres: ['1', '2'].map(n => ({
          id: `masa-${n}`, etiqueta: `masa ${n}`,
          donde: val => { const g = PZ('recta').geometria(cmLibre(val)); return { x: g.x(val['x' + n]), y: g.filaY(1) }; },
          mover: (pt, val) => ({ ['x' + n]: inversa(PZ('recta').geometria(cmLibre(val)).x, -2, 12)(pt.x) }),
        })),
        invitaciones: [
          { texto: 'Pon el centro de masa justo en x = 5 m.',
            logrado: val => Math.abs(xcmLibre(val) - 5) < 1e-9,
            bien: 'Hay muchas maneras. ¿Las masas eran iguales en la tuya?' },
          { texto: 'Lleva el centro de masa lo más a la derecha que puedas.',
            logrado: val => xcmLibre(val) >= xcmLibre({ x1: 4, m1: 1, x2: 12, m2: 6 }) - 1e-9,
            bien: 'Todo lo pesado a la derecha. Igual no llega hasta la masa 2.' },
          { texto: 'Haz que el centro quede tres veces más cerca de la masa 2.',
            logrado: val => Math.abs((xcmLibre(val) - val.x1) - 3 * (val.x2 - xcmLibre(val))) < 1e-9,
            bien: 'La masa 2 es el triple: el centro se le acerca tres veces más.' },
          { texto: 'Guarda dos casos con masas distintas y el centro en el mismo punto.',
            logrado: (val, guardados) => guardado(val, guardados, ['x1', 'm1', 'x2', 'm2'])
              && guardados.some(g => (g.m1 !== val.m1 || g.m2 !== val.m2) && Math.abs(xcmLibre(g) - xcmLibre(val)) < 1e-9),
            bien: 'Menos masa más lejos equilibra más masa más cerca.' },
        ],
      },
    ],
    historia: {
      texto: 'En 1668 y 1669, la Royal Society de Londres recibió trabajos sobre choques de Wren y de Huygens. No todos los choques se comportaban igual, y había que separar lo que siempre se conserva de lo que a veces se pierde. Esa distinción es la de esta unidad.',
      pregunta: '¿Qué queda igual cuando dos cosas chocan?',
      fuente: { titulo: 'Royal Society — Picture Library (Wren y Huygens sobre choques)', url: 'https://pictures.royalsociety.org/image-rs-16018' },
    },
    // A qué idea pertenece cada mesa del laboratorio (Gerson, 16 nov: el laboratorio se agrupa por idea). Una lista vacía:
    // la mesa no practica ninguna idea de la unidad y va en «Más mesas del tema».
    laboratorioIdeas: {
      'golpe-libre': ['impulso'],
      'choque-libre': ['elastico-inelastico'],
      'centro-libre': ['centro-masa'],
    },
    ideas: [cantidad, impulso, conservacion, elastico, restitucion, centro],
  };
});

