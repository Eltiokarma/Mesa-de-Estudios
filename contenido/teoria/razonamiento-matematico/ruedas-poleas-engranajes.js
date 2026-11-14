/*
 * Teoría de «Ruedas, poleas y engranajes» (razonamiento-matematico.ruedas-poleas-engranajes).
 * Fuente: docs/teoria/matriz/razonamiento-matematico.json (unidad 12); historia: mecanismo de Anticitera (Freeth y otros, 2006).
 * Precisión: en contacto o con faja coinciden las rapideces del borde; en un mismo eje coinciden las vueltas.
 * Colores (regla 4): rueda A naranja (c-o), rueda B turquesa (c-i), rueda C verde (c-d), la faja rojo (c-h).
 * Compañero: Faro (zorro). Códigos: RM5, RME26, RME27, RME28 (existentes); RMT-RUE-* nuevos (hipótesis).
 *
 * Ficha de tarea (diseno-y-animacion):
 *   Promesa: saber qué comparten dos ruedas según cómo se unen: dientes que pasan, borde de la faja o el eje.
 *   Persona y condiciones: postulante de 3.º a 5.º, celular de gama baja, sin conexión.
 *   Resultado observable: calcula vueltas y sentidos en engranajes, fajas y ejes comunes, también en cadenas de ruedas.
 *   Orden de atención: 1.º las ruedas con su flecha de giro · 2.º la lectura de vueltas · acción principal fija.
 *   Estados: juego sin tocar · casos probados · predicción respondida · paso de Mira · caso nuevo resuelto o «No sé».
 *   Duda que resuelve: «¿la rueda grande da más vueltas o menos?».
 */
(function (root, fabrica) {
  const def = fabrica(typeof module === 'object' && module.exports ? require('../../../nucleo/kit/kit.js') : root.Kit);
  if (typeof module === 'object' && module.exports) module.exports = def;
  else root.Teoria.unidad(def);
})(typeof self !== 'undefined' ? self : this, function (Kit) {
  'use strict';
  const f = (n, d = 2) => Kit.formatear(n, d);
  const zA = { sub: [{ v: 'c-o', t: 'z' }, 'A'] }, zB = { sub: [{ v: 'c-i', t: 'z' }, 'B'] }, nA = { sub: [{ v: 'c-o', t: 'n' }, 'A'] }, nB = { sub: [{ v: 'c-i', t: 'n' }, 'B'] };
  const rA = { sub: [{ v: 'c-o', t: 'r' }, 'A'] }, rB = { sub: [{ v: 'c-i', t: 'r' }, 'B'] };
  function azar(s) {
    let q = (s * 2654435761 + 12345) >>> 0;
    const r = () => { q = (q + 0x6D2B79F5) >>> 0; let z = q; z = Math.imul(z ^ (z >>> 15), z | 1); z ^= z + Math.imul(z ^ (z >>> 7), z | 61); return ((z ^ (z >>> 14)) >>> 0) / 4294967296; };
    r.ent = (lo, hi) => lo + Math.floor(r() * (hi - lo + 1));
    r.elegir = xs => xs[Math.floor(r() * xs.length)];
    return r;
  }
  function opcionesTexto(correcta, distractores) {
    const vistos = new Set([correcta]);
    const ops = [{ id: 'c', texto: correcta, correcta: true }];
    for (const x of distractores) { if (!x.texto || vistos.has(x.texto) || ops.length >= 4) continue; vistos.add(x.texto); ops.push(x); }
    return ops;
  }
  const nC = { sub: [{ v: 'c-d', t: 'n' }, 'C'] };
  // Gesto directo (docs/teoria.md §4b): las manijas van arriba de cada rueda (el centro no se mueve en vertical), en el
  // lienzo de rm-plano; el radio se lee como la distancia del dedo al eje de la rueda.
  const PLANO = () => Kit.piezas['rm-plano'];
  const enPx = (datos, ux, uy) => { const g = PLANO().geometria(datos); return { x: g.X(ux), y: g.Y(uy) }; };
  const aU = (datos, pt) => { const g = PLANO().geometria(datos); return { x: (pt.x - g.X(0)) / g.k, y: (pt.y - g.Y(0)) / g.k }; };
  const manijaRueda = (id, etiqueta, color, hacer, i, ctl, aValor) => ({ id, etiqueta, color,
    donde: val => { const d = hacer(val), c = d.circulos[i]; return enPx(d, c.x, c.y - c.r); },
    mover: (pt, val) => { const d = hacer(val), c = d.circulos[i]; return { [ctl]: aValor(c.y - aU(d, pt).y, val) }; } });
  const v = x => `${f(x, 2)} ${Math.abs(x - 1) < 1e-9 ? 'vuelta' : 'vueltas'}`;
  const sentido = s => (s > 0 ? 'horario' : 'antihorario');

  // ---------- Idea 1: engranajes en contacto ----------
  // Cambia: los dientes de B · Permanece: A con 20 dientes y 6 vueltas · Progresa: las vueltas de B · Se reserva: la
  // cadena de tres engranajes · Debe verse: pasan los mismos dientes por el punto de contacto; el sentido se invierte.
  const K = 20;   // dientes por unidad de radio
  function engranajes(lista, extra = {}) {
    // lista: [{ z, n, color, nombre }], en contacto de izquierda a derecha, centrados.
    const rs = lista.map(g => g.z / (extra.K || K)), gap = 0.22;
    const ancho = rs.reduce((m, r, i) => m + 2 * r + (i ? gap : 0), 0);
    let x = 5 - ancho / 2;
    const circulos = lista.map((g, i) => {
      const r = rs[i]; x += r;
      const c = { x, y: 2.6, r, dientes: g.z, color: g.color, giro: i % 2 ? -1 : 1, rotulo: g.nombre, en: [x, 2.6 + 0.15] };
      x += r + gap; return c;
    });
    return {
      ancho: 10, alto: 6.2, circulos,
      textos: lista.map((g, i) => ({ x: circulos[i].x, y: extra.escalonado ? 4.75 + 0.65 * i : i % 2 ? 6.05 : 5.3, t: `${g.z} d · ${g.n === null ? '?' : f(g.n, 2)} v`, color: g.color })),
      pie: extra.pie,
    };
  }
  // En el juego, escala más grande (13 dientes por unidad): B de 10 dientes se puede agarrar.
  const dosEngranajes = val => engranajes([{ z: 20, n: 6, color: 'o', nombre: 'A' }, { z: val.z, n: 120 / val.z, color: 'i', nombre: 'B' }], { K: 13 });
  const contacto = {
    id: 'engranajes',
    titulo: 'Engranajes: pasan los mismos dientes',
    temas: ['Engranajes en contacto', 'Número de vueltas'],
    pieza: 'rm-plano',
    juega: {
      consigna: 'El engranaje A tiene 20 dientes y da 6 vueltas. Cambia los dientes de B y mira cuántas vueltas da y hacia dónde.',
      voz: 'Por el punto de contacto pasan los mismos dientes de A que de B.',
      controles: [{ id: 'z', etiqueta: 'Dientes de B', min: 10, max: 40, paso: 10, inicio: 10, decimales: 0, color: 'c-i' }],
      dibujo: val => ({ datos: dosEngranajes(val), estado: {} }),
      lectura: val => [nB, ` = 20 · 6 / ${val.z} = ${f(120 / val.z, 2)} vueltas, al revés`],
      minimo: 3,
      // Agranda B desde su borde de arriba: más dientes, menos vueltas.
      arrastres: [manijaRueda('borde-b', 'tamaño del engranaje B', 'c-i', dosEngranajes, 1, 'z', r => r * 13)],
    },
    predice: {
      pregunta: 'Tres engranajes en fila: A (20 dientes) da 6 vueltas en sentido horario, B tiene 10 dientes y C tiene 40. ¿Cuántas vueltas da C y hacia dónde?',
      opciones: [
        { id: 'c', texto: '3 vueltas, en sentido horario', correcta: true },
        { id: 'contrario', texto: '3 vueltas, en sentido antihorario', error: 'RME26', siFuera: 'B invierte el giro y C lo vuelve a invertir: C gira como A.' },
        { id: 'b', texto: '12 vueltas, en sentido horario', error: 'RM5', siFuera: '12 son las vueltas de B. C tiene más dientes que A: da menos vueltas.' },
        { id: 'mas', texto: '24 vueltas, en sentido horario', error: 'RM5', siFuera: 'Más dientes no da más vueltas: los dientes y las vueltas se compensan.' },
      ],
      dibujo: { datos: engranajes([{ z: 20, n: 6, color: 'o', nombre: 'A' }, { z: 10, n: null, color: 'i', nombre: 'B' }, { z: 40, n: null, color: 'd', nombre: 'C' }]), estado: {} },
      revelar: { datos: engranajes([{ z: 20, n: 6, color: 'o', nombre: 'A' }, { z: 10, n: 12, color: 'i', nombre: 'B' }, { z: 40, n: 3, color: 'd', nombre: 'C' }], { pie: 'Pasan 120 dientes por cada contacto' }), estado: {} },
      coincide: 'Coincide: por cada contacto pasan 120 dientes; C, con 40, da 3 vueltas y gira como A.',
    },
    mira: {
      datos: engranajes([{ z: 20, n: 6, color: 'o', nombre: 'A' }, { z: 10, n: 12, color: 'i', nombre: 'B' }, { z: 40, n: 3, color: 'd', nombre: 'C' }]),
      pasos: [
        { estado: { corte: 0 }, texto: 'A da 6 vueltas de 20 dientes: pasan 120 dientes.', ecuacion: [zA, ' · ', nA, ' = 20 · 6 = 120'] },
        { estado: { corte: 0 }, texto: 'B recibe los mismos 120 dientes: 12 vueltas, al revés.', ecuacion: [nB, ' = 120 / 10 = 12'] },
        { estado: { corte: 0 }, texto: 'C recibe 120 dientes de B: 3 vueltas, otra vez al revés.', ecuacion: ['120 / 40 = 3'] },
      ],
    },
    regla: {
      texto: 'En dos engranajes en contacto pasan los mismos dientes: dientes por vueltas es igual en ambos. Cada contacto invierte el sentido de giro.',
      ecuacion: [{ llave: [zA, ' · ', nA], nota: 'dientes que pasan', color: 'c-o' }, ' = ', { llave: [zB, ' · ', nB], nota: 'los mismos', color: 'c-i' }],
      condicion: 'los dientes encajan sin resbalar y los engranajes se tocan por fuera; en contacto interior no se invierte el sentido.',
    },
    ahoraTu: {
      pieza: 'rm-plano',
      voz: 'Calcula los dientes que pasan por cada contacto.',
      generar(s) {
        const r = azar(s), za = r.elegir([12, 15, 20, 24, 30]), na = r.ent(2, 8), zb = r.elegir([10, 12, 15, 20, 30, 40]), zc = r.elegir([10, 15, 20, 24, 40, 60]);
        const tres = s % 2 === 1, D = za * na, nc = tres ? D / zc : D / zb, sig = tres ? 1 : -1;
        const nombre = tres ? 'C' : 'B';
        const bien = `${v(nc)}, ${sentido(sig)}`;
        return {
          pregunta: tres
            ? `Tres engranajes en fila: A (${za} dientes) da ${na} vueltas en sentido horario, B tiene ${zb} y C tiene ${zc} dientes. ¿Cuántas vueltas da C y hacia dónde?`
            : `Un engranaje A de ${za} dientes da ${na} vueltas en sentido horario y mueve a B, de ${zb} dientes. ¿Cuántas vueltas da B y hacia dónde?`,
          dibujo: { datos: engranajes(tres ? [{ z: za, n: na, color: 'o', nombre: 'A' }, { z: zb, n: null, color: 'i', nombre: 'B' }, { z: zc, n: null, color: 'd', nombre: 'C' }] : [{ z: za, n: na, color: 'o', nombre: 'A' }, { z: zb, n: null, color: 'i', nombre: 'B' }]), estado: {} },
          opciones: opcionesTexto(bien, [
            { id: 'sent', texto: `${v(nc)}, ${sentido(-sig)}`, error: 'RME26', siFuera: 'Cada contacto invierte el sentido; cuenta los contactos.' },
            { id: 'directa', texto: `${v(na * (tres ? zc : zb) / za)}, ${sentido(sig)}`, error: 'RM5', siFuera: 'Más dientes, menos vueltas: la relación es inversa.' },
            { id: 'igual', texto: `${v(na)}, ${sentido(sig)}`, error: 'RMT-RUE-1', siFuera: 'Dientes distintos no dan las mismas vueltas.' },
          ]),
          solucion: { texto: `Pasan ${za} · ${na} = ${D} dientes por cada contacto.`, ecuacion: [`${nombre}: ${D} / ${tres ? zc : zb} = ${f(nc, 2)} vueltas`] },
        };
      },
    },
  };

  // ---------- Idea 2: ruedas unidas por una faja ----------
  // Cambia: el radio de B y el tipo de faja · Permanece: A de radio 3 cm con 4 vueltas · Progresa: las vueltas de B ·
  // Se reserva: la faja cruzada, que invierte · Debe verse: la faja lleva el mismo largo de borde en las dos ruedas.
  function faja(ra, rb, cruzada, extra = {}) {
    const k = extra.escala || 2.1 / Math.max(ra, rb), xa = 2.6, xb = 7.4, y = 2.6, RA = ra * k, RB = rb * k;
    const lineas = cruzada
      ? [{ de: [xa, y - RA], a: [xb, y + RB], color: 'h', grosor: 'variable' }, { de: [xa, y + RA], a: [xb, y - RB], color: 'h', grosor: 'variable' }]
      : [{ de: [xa, y - RA], a: [xb, y - RB], color: 'h', grosor: 'variable' }, { de: [xa, y + RA], a: [xb, y + RB], color: 'h', grosor: 'variable' }];
    return {
      ancho: 10, alto: 6.2, k,
      circulos: [{ x: xa, y, r: RA, color: 'o', giro: 1, rotulo: 'A', en: [xa, y + 0.15] }, { x: xb, y, r: RB, color: 'i', giro: cruzada ? -1 : 1, rotulo: 'B', en: [xb, y + 0.15] }],
      lineas,
      textos: [{ x: xa, y: 5.25, t: `r = ${f(ra)} cm`, color: 'o' }, { x: xb, y: 5.25, t: `r = ${f(rb)} cm`, color: 'i' }],
      pie: extra.pie,
    };
  }
  const fajaJuego = val => faja(3, val.rb, val.c === 'cruzada', { escala: 0.35 });
  const fajas = {
    id: 'faja',
    titulo: 'La faja lleva el mismo borde',
    temas: ['Ruedas unidas por faja', 'Número de vueltas'],
    pieza: 'rm-plano',
    juega: {
      consigna: 'A, de 3 cm de radio, da 4 vueltas y mueve a B con una faja. Cambia el radio de B y la faja.',
      voz: 'Mira también hacia dónde gira B con la faja cruzada.',
      controles: [
        { id: 'rb', etiqueta: 'Radio de B', min: 2, max: 6, paso: 1, inicio: 6, unidad: 'cm', decimales: 0, color: 'c-i' },
        { id: 'c', etiqueta: 'Faja', opciones: [{ valor: 'abierta', texto: 'Abierta' }, { valor: 'cruzada', texto: 'Cruzada' }] },
      ],
      dibujo: val => ({ datos: fajaJuego(val), estado: {} }),
      lectura: val => [nB, ` = 3 · 4 / ${val.rb} = ${f(12 / val.rb, 2)} v, ${val.c === 'cruzada' ? 'al revés' : 'igual que A'}`],
      minimo: 3,
      // Agranda o achica B desde su borde de arriba (a escala fija, para que A no cambie de tamaño).
      arrastres: [manijaRueda('borde-b', 'radio de la rueda B', 'c-i', fajaJuego, 1, 'rb', r => r / 0.35)],
    },
    predice: {
      pregunta: 'Dos ruedas unidas por una faja abierta: A tiene 10 cm de radio y B, 4 cm. A da 2 vueltas. ¿Cuántas vueltas da B?',
      opciones: [
        { id: 'igual', texto: '2 vueltas', error: 'RME28', siFuera: 'Iguales serían con el mismo radio. La faja iguala el largo de borde, no las vueltas.' },
        { id: 'menos', texto: '0,8 vueltas', error: 'RM5', siFuera: 'La rueda chica tiene que girar más para enrollar el mismo largo.' },
        { id: 'c', texto: '5 vueltas', correcta: true },
      ],
      dibujo: { datos: faja(10, 4, false), estado: {} },
      revelar: { datos: faja(10, 4, false, { pie: 'La faja avanza 40π cm en cada rueda' }), estado: {} },
      coincide: 'Coincide: la faja avanza 40π cm; en B, con borde de 8π cm, eso son 5 vueltas.',
    },
    mira: {
      datos: faja(10, 4, false),
      pasos: [
        { estado: { corte: 0 }, texto: 'En 2 vueltas, el borde de A avanza 2 · 2π · 10 cm.', ecuacion: ['largo = 40π cm'] },
        { estado: { corte: 0 }, texto: 'La faja lleva ese mismo largo al borde de B.', ecuacion: [rA, ' · ', nA, ' = ', rB, ' · ', nB] },
        { estado: { corte: 0 }, texto: 'B, de 4 cm, necesita 5 vueltas.', ecuacion: [nB, ' = 10 · 2 / 4 = 5'] },
      ],
    },
    regla: {
      texto: 'Con una faja, los bordes de las dos ruedas avanzan el mismo largo: radio por vueltas es igual. La faja abierta conserva el sentido; la cruzada lo invierte.',
      ecuacion: [{ llave: [rA, ' · ', nA], nota: 'borde que avanza', color: 'c-o' }, ' = ', { llave: [rB, ' · ', nB], nota: 'el mismo', color: 'c-i' }],
      condicion: 'la faja no resbala ni se estira; con dientes, se usa el número de dientes en lugar del radio.',
    },
    ahoraTu: {
      pieza: 'rm-plano',
      voz: 'Iguala los largos de borde.',
      generar(s) {
        const r = azar(s), ra = r.ent(2, 9), rb = r.elegir([2, 3, 4, 5, 6, 7, 8, 9].filter(x => x !== ra)), na = r.ent(2, 9), cruz = s % 3 === 2;
        const nb = ra * na / rb, bien = `${v(nb)}, ${cruz ? 'en sentido contrario' : 'en el mismo sentido'}`;
        return {
          pregunta: `Dos ruedas unidas por una faja ${cruz ? 'cruzada' : 'abierta'}: A tiene ${ra} cm de radio y da ${na} vueltas; B tiene ${rb} cm. ¿Cuántas vueltas da B y hacia dónde?`,
          dibujo: { datos: faja(ra, rb, cruz), estado: {} },
          opciones: opcionesTexto(bien, [
            { id: 'sent', texto: `${v(nb)}, ${cruz ? 'en el mismo sentido' : 'en sentido contrario'}`, error: 'RME26', siFuera: cruz ? 'La faja cruzada invierte el giro.' : 'La faja abierta conserva el giro.' },
            { id: 'inv', texto: `${v(rb * na / ra)}, ${cruz ? 'en sentido contrario' : 'en el mismo sentido'}`, error: 'RM5', siFuera: 'La rueda chica gira más; la proporción es inversa.' },
            { id: 'igual', texto: `${v(na)}, ${cruz ? 'en sentido contrario' : 'en el mismo sentido'}`, error: 'RME28', siFuera: 'La faja iguala el largo de borde, no las vueltas.' },
          ]),
          solucion: { texto: 'El largo de borde es el mismo en las dos ruedas.', ecuacion: [nB, ` = ${ra} · ${na} / ${rb} = ${f(nb, 2)}`] },
        };
      },
    },
  };

  // ---------- Idea 3: ruedas en un mismo eje ----------
  // Cambia: el radio de la rueda pegada a B · Permanece: A, B y la faja · Progresa: el largo que avanza el borde de C ·
  // Se reserva: un sistema de tres ruedas · Debe verse: en el mismo eje se comparten vueltas, no largos de borde.
  function sistema(rc, extra = {}) {
    const d = faja(3, 6, false, { escala: 0.35 });
    d.circulos.push({ x: 7.4, y: 2.6, r: rc * d.k, color: 'd', relleno: 0.25, rotulo: 'C', en: [7.4 - rc * d.k - 0.3, 2.6 + 0.15] });
    d.circulos[1].rotulo = 'B'; d.circulos[1].en = [7.4 + 1.5, 2.6 - 1.5];
    d.textos.push({ x: 7.4, y: 5.95, t: `C: ${f(rc)} cm, eje de B`, color: 'd' });
    d.pie = extra.pie;
    return d;
  }
  const eje = {
    id: 'mismo-eje',
    titulo: 'En un mismo eje, mismas vueltas',
    temas: ['Ruedas en un mismo eje', 'Número de vueltas'],
    pieza: 'rm-plano',
    juega: {
      consigna: 'A (3 cm) da 4 vueltas y mueve con faja a B (6 cm). C gira pegada a B, en su eje. Cambia C.',
      voz: 'C y B giran juntas: compara sus vueltas y sus bordes.',
      controles: [{ id: 'rc', etiqueta: 'Radio de C', min: 1, max: 5, paso: 1, inicio: 1, unidad: 'cm', decimales: 0, color: 'c-d' }],
      dibujo: val => ({ datos: sistema(val.rc), estado: {} }),
      lectura: val => [`B y C: 2 vueltas`, '   ·   ', `borde de C: ${f(2 * 2 * val.rc)}π cm`],
      minimo: 3,
      // Agranda C desde su borde de arriba: B no cambia, las vueltas tampoco; solo el borde de C.
      arrastres: [manijaRueda('borde-c', 'radio de la rueda C', 'c-d', val => sistema(val.rc), 2, 'rc', r => r / 0.35)],
    },
    predice: {
      pregunta: 'En ese sistema, C tiene 5 cm de radio y una cuerda enrollada en su borde. ¿Cuántos centímetros de cuerda enrolla mientras A da 4 vueltas?',
      opciones: [
        { id: 'a', texto: '24π cm', error: 'RME27', siFuera: '24π es lo que avanza el borde de A y de B. C comparte vueltas con B, no borde.' },
        { id: 'c', texto: '20π cm', correcta: true },
        { id: 'cuatro', texto: '40π cm', error: 'RMT-RUE-2', siFuera: '40π usa las 4 vueltas de A; C da las mismas vueltas que B.' },
      ],
      dibujo: { datos: sistema(5), estado: {} },
      revelar: { datos: sistema(5, { pie: 'C: 2 vueltas · 2π · 5 = 20π cm' }), estado: {} },
      coincide: 'Coincide: B da 2 vueltas, C también, y su borde de 10π cm avanza dos veces.',
    },
    mira: {
      datos: sistema(5),
      pasos: [
        { estado: { corte: 0 }, texto: 'Faja: 3 · 4 = 6 · nB, así que B da 2 vueltas.', ecuacion: [nB, ' = 2'] },
        { estado: { corte: 0 }, texto: 'C está en el mismo eje: también da 2 vueltas.', ecuacion: [nC, ' = ', nB, ' = 2'] },
        { estado: { corte: 0 }, texto: 'Su borde avanza 2 vueltas de 2π · 5 cm.', ecuacion: ['2 · 2π · 5 = 20π cm'] },
      ],
    },
    regla: {
      texto: 'Las ruedas fijas en un mismo eje dan las mismas vueltas. El largo que avanza el borde de cada una depende de su radio.',
      ecuacion: ['mismo eje: ', nB, ' = ', nC, '   ·   ', 'largo = ', { llave: ['2π · r'], nota: 'una vuelta', color: 'c-d' }, ' · n'],
      condicion: 'las ruedas están pegadas al eje y giran juntas; si una gira suelta sobre el eje, no se aplica.',
    },
    ahoraTu: {
      voz: 'Separa lo que pasa por la faja de lo que pasa por el eje.',
      generar(s) {
        const r = azar(s), ra = r.ent(2, 5), kk = r.ent(2, 3), rb = ra * kk, nb = r.ent(1, 4), nA_ = nb * kk, rc = r.ent(1, 9);
        const largo = 2 * rc * nb;
        return {
          pregunta: `A (${ra} cm) da ${nA_} vueltas y mueve con faja a B (${rb} cm). C, de ${rc} cm, está en el mismo eje que B. ¿Cuánto avanza el borde de C?`,
          opciones: opcionesTexto(`${f(largo)}π cm`, [
            { id: 'a', texto: `${f(2 * ra * nA_)}π cm`, error: 'RME27', siFuera: 'Ese es el borde de A y de B; C comparte vueltas con B, no borde.' },
            { id: 'na', texto: `${f(2 * rc * nA_)}π cm`, error: 'RMT-RUE-2', siFuera: 'C no da las vueltas de A, sino las de B.' },
            { id: 'radio', texto: `${f(rc * nb)}π cm`, error: 'RMT-RUE-3', siFuera: 'Una vuelta avanza 2πr, no πr.' },
          ]),
          solucion: { texto: `B da ${ra} · ${nA_} / ${rb} = ${f(nb, 2)} vueltas, y C también.`, ecuacion: [`2π · ${rc} · ${f(nb, 2)} = ${f(largo)}π cm`] },
        };
      },
    },
  };
  
  // ---------- Laboratorio: juego libre, sin preguntas ----------
  // Mesa 1: tren de tres engranajes con los tres tamaños libres: el del medio cambia sus vueltas, pero no las de C.
  const KL = 22;
  const tren = val => {
    const D = val.za * 6;
    return engranajes([{ z: val.za, n: 6, color: 'o', nombre: 'A' }, { z: val.zb, n: D / val.zb, color: 'i', nombre: 'B' }, { z: val.zc, n: D / val.zc, color: 'd', nombre: 'C' }], { K: KL, escalonado: true, pie: `Pasan ${D} dientes por cada contacto` });
  };
  const mesaTren = {
    id: 'tren-de-engranajes', titulo: 'Tren de tres engranajes', pieza: 'rm-plano',
    consigna: 'A da 6 vueltas. Agranda o achica cada engranaje desde arriba. Mira qué cambia en C cuando solo tocas B.',
    controles: [
      { id: 'za', etiqueta: 'Dientes de A', min: 10, max: 35, paso: 5, inicio: 20, decimales: 0, color: 'c-o' },
      { id: 'zb', etiqueta: 'Dientes de B', min: 10, max: 35, paso: 5, inicio: 10, decimales: 0, color: 'c-i' },
      { id: 'zc', etiqueta: 'Dientes de C', min: 10, max: 35, paso: 5, inicio: 30, decimales: 0, color: 'c-d' },
    ],
    dibujo: val => ({ datos: tren(val), estado: {} }),
    lectura: val => [nB, ` = ${f(val.za * 6 / val.zb, 2)}`, '   ·   ', nC, ` = ${f(val.za * 6 / val.zc, 2)}, igual que A`],
    arrastres: [['a', 'za', 'c-o', 0], ['b', 'zb', 'c-i', 1], ['c', 'zc', 'c-d', 2]].map(([id, ctl, color, i]) =>
      manijaRueda('borde-' + id, `tamaño del engranaje ${id.toUpperCase()}`, color, tren, i, ctl, r => r * KL)),
  };
  // Mesa 2: faja libre: los dos radios, las vueltas de A y el tipo de faja.
  const EF = 0.3;
  const fajaLibre = val => faja(val.ra, val.rb, val.c === 'cruzada', { escala: EF });
  const mesaFaja = {
    id: 'faja-libre', titulo: 'Faja a tu gusto', pieza: 'rm-plano',
    consigna: 'Cambia los dos radios desde arriba, las vueltas de A y la faja. Busca dos ruedas que den las mismas vueltas.',
    controles: [
      { id: 'ra', etiqueta: 'Radio de A', min: 1, max: 7, paso: 1, inicio: 6, unidad: 'cm', decimales: 0, color: 'c-o' },
      { id: 'rb', etiqueta: 'Radio de B', min: 1, max: 7, paso: 1, inicio: 2, unidad: 'cm', decimales: 0, color: 'c-i' },
      { id: 'na', etiqueta: 'Vueltas de A', min: 1, max: 6, paso: 1, inicio: 2, decimales: 0, color: 'c-o' },
      { id: 'c', etiqueta: 'Faja', opciones: [{ valor: 'abierta', texto: 'Abierta' }, { valor: 'cruzada', texto: 'Cruzada' }] },
    ],
    dibujo: val => ({ datos: fajaLibre(val), estado: {} }),
    lectura: val => [`A: ${v(val.na)}`, '   ·   ', `B: ${v(val.ra * val.na / val.rb)}, ${val.c === 'cruzada' ? 'al revés' : 'igual que A'}`],
    arrastres: [
      manijaRueda('borde-a', 'radio de la rueda A', 'c-o', fajaLibre, 0, 'ra', r => r / EF),
      manijaRueda('borde-b', 'radio de la rueda B', 'c-i', fajaLibre, 1, 'rb', r => r / EF),
    ],
  };

  return {
    unidad: 'razonamiento-matematico.ruedas-poleas-engranajes',
    // Laboratorio: tren de tres engranajes con los tres tamaños libres y la faja con los dos radios libres.
    laboratorio: [mesaTren, mesaFaja],
    version: '0.2.0',
    estado: 'completa',
    requiere: ['/nucleo/kit/piezas/rm-plano.js'],
    historia: {
      texto: 'El mecanismo de Anticitera, de fines del siglo II a. C., usaba engranajes de bronce para representar ciclos del cielo. En 2006, Freeth y su equipo estudiaron sus fragmentos con tomografías para reconstruir qué hacía. Aquí simplificamos a ruedas ideales y preguntamos qué comparten dos ruedas unidas.',
      pregunta: '¿Qué comparten dos ruedas que se tocan?',
      fuente: { titulo: 'Freeth et al. (2006), Decoding the Antikythera Mechanism · Nature', url: 'https://www.nature.com/articles/nature05357' },
    },
    ideas: [contacto, fajas, eje],
  };
});
