/*
 * Teoría de «Congruencia de triángulos» (geometria.congruencia), para 5.º de secundaria y preuniversitario. Molde:
 * docs/teoria.md y docs/molde-unidad.md. Fuente: docs/teoria/matriz/geometria.json (unidad 3); Elementos I.4 (LAL por
 * superposición) y I.8 (LLL). Compañera: Neri (nutria). Piezas: geo-objeto (la escena «armazon», dibujos de prueba: el
 * tijeral que se arma en el piso del taller, la cometa, los banderines sobre la mesa de costura, el mapa de los caseríos
 * con su pozo, el tijeral con su listón, la escalera en la esquina y las escuadras; y las figuras de examen) y geo-figura
 * (tres mesas del laboratorio).
 *
 * Etapa 5 del plan de calidad (19 nov): docs/etapa5/propuesta-geometria.md (Gerson delegó el criterio; revisa después).
 * Seis ideas: criterios, partes-correspondientes (nueva), mediatriz-bisectriz, base-media, mediana-hipotenusa y
 * notables; se conservan los id de las cinco de antes, los de sus controles y los de las tres mesas.
 * Fase 2 (19 nov): la idea 1 completa (Lee, Juega con misión, Predice, Mira, La regla, Así se resuelve, Ahora tú, 15
 * ejemplos y su glosario). Fase 3 (19 nov): las ideas 2 a 6 completas, con el mismo contrato; las pruebas de la base media
 * y de la mediana a la hipotenusa sin paralelogramo, rectángulo ni circunferencia; cinco mesas, una por idea (salvo la 2).
 * La práctica es plantillas/geo-congruencia (tipos por idea). La unidad lleva calidad: 2 desde el 19 nov, después del
 * lector en frío y del auditor.
 * Cuentas de los 90 ejemplos rehechas aparte, por coordenadas y sin el código de la unidad (scratchpad e5-geometria/
 * cuentas.py y cuentas_fase3.py), y las de «Ahora tú» y «Así se resuelve», leyendo el enunciado, en congruencia.test.js.
 *
 * REGLA DE COLORES DE LA UNIDAD (la de Triángulos, llevada a dos triángulos; molde §5b: un color fijo por lo que cada
 * cosa ES en la figura):
 *   - el primer lado dado y su pareja en el otro triángulo, naranja (o), con una rayita si lleva llave; el segundo lado
 *     dado y su pareja, turquesa (i), con dos rayitas (también la viga que gira en la trampa LLA y la circunferencia que
 *     recorre su punta); el tercer lado, la viga que cierra, lo que no es dato y las líneas auxiliares, en tinta;
 *   - todo ángulo dado en carmín (h), con 1, 2 o 3 arcos (1 en A y D, 2 en B y E, 3 en C y F);
 *   - lo pedido con «?» en tinta; el violeta (f) solo en el texto del resuelto y en la respuesta, nunca en una figura ni
 *     en un enunciado; el verde no se usa;
 *   - las marcas de igualdad van siempre sobre una llave, nunca sobre el lado.
 *   La comprueba congruencia.test.js en todas las figuras y textos de las seis ideas. Por idea (propuesta §6): en la 2,
 *   los lados que se emparejan van en tinta (el color no da la pareja); en la 3, PA y PH naranja, PB y PK turquesa, y la
 *   mediatriz y la bisectriz punteadas en tinta; en la 4, MN naranja y BC turquesa; en la 5, la mediana CM turquesa; en la
 *   6, el cateto menor naranja, el mayor turquesa y la hipotenusa en tinta. Un ángulo cuyo rótulo no cabe junto a su
 *   vértice va solo con su arco, y su valor, en el enunciado (decisión 16).
 * Notación: m∠A (m∠BAC si el vértice tiene varios ángulos); x sin «°» (AC = 3x − 4, x = 7); el segundo triángulo es DEF
 * y △ABC ≅ △DEF empareja A con D, B con E y C con F; LAL, ALA, LLL, LLA y AAA como en los libros («Lee» avisa que esa A
 * no es el punto A); todo largo con su unidad. Donde la figura tiene puntos A, B, C, ningún resuelto nombra una
 * alternativa por su letra.
 * Rango del juego de la idea 1 (decisión 10 de la propuesta): m∠A de 40° a 120°, de 10° en 10°, empezando en 100° (antes
 * 20° a 150°, desde 60°): fuera de ahí los rótulos pisan las vigas a 390 px. El id del control (t) no cambia.
 * Códigos de error (todos hipótesis de aula, sin medir; rutinas/teoria-geometria.md): GE-CON1 toma LLA por LAL; GE-CON2
 * cree que el lado no alcanza; GE-CON3 confunde las siglas o empareja por el orden de las letras; GE-CON4 cree que los
 * ángulos solos fijan el tamaño; GE-CON5 cree que dos lados bastan; GE-CON16 cree que salen muchos; GE-CON25 no cuenta
 * cuántos lados y ángulos hay; GE-CON26 desconfía de un criterio que sí se cumple; GE-CON27 cree que cualquier ángulo
 * sirve; GE-CON28 cree que LLA siempre da dos; GE-CON29 no cuenta el lado común ni los opuestos por el vértice;
 * GE-CON30 da x y no la medida; GE-CON31 suma las dos medidas iguales; GE-TRI15 (de Triángulos) pasa mal los números.
 *
 * Ficha de tarea (diseno-y-animacion):
 *   Promesa: saber qué tres medidas fijan un triángulo (LAL, ALA, LLL) y cuáles no (LLA, AAA), y usar la congruencia para
 *     pasar una medida de un triángulo a otro.
 *   Persona y condiciones: postulante de 5.º o de academia, celular de gama baja a 360 px, sin audio, quizás sin conexión.
 *   Resultado observable: dice qué criterio asegura la congruencia o por qué los datos no bastan, halla el dato que
 *     falta, cuenta cuántos triángulos da LLA y usa el lado común o los opuestos por el vértice.
 *   Orden de atención: 1.º el tijeral y la silueta · 2.º la misión · acción: girar la viga AC · fondo: Neri.
 *   Estados: jugando (casos probados) · predicción sin elegir · comprobada · paso de «Mira» · regla · caso nuevo.
 *   Duda que resuelve: «¿con dos lados y un ángulo ya está?»: depende de dónde quede el ángulo.
 */
(function (root, fabrica) {
  const nodo = typeof module === 'object' && module.exports;
  const def = nodo ? fabrica(require('../../../nucleo/kit/kit.js'), require('../../../nucleo/kit/piezas/geo-figura.js'), require('../../../nucleo/kit/piezas/geo-objeto.js'))
    : fabrica(root.Kit, root.Kit.piezas['geo-figura'], root.Kit.piezas['geo-objeto']);
  if (nodo) module.exports = def;
  else root.Teoria.unidad(def);
})(typeof self !== 'undefined' ? self : this, function (Kit, G, PO) {
  'use strict';
  const U = G.util;
  const f = (n, d = 1) => Kit.formatear(n, d);
  const gr = n => `${f(n)}°`;
  // Lo que vale una letra (x) es un número: sin «°» ni unidad.
  const NUM = n => f(n);
  function azar(s) {
    let q = (s * 2654435761 + 12345) >>> 0;
    const r = () => { q = (q + 0x6D2B79F5) >>> 0; let z = q; z = Math.imul(z ^ (z >>> 15), z | 1); z ^= z + Math.imul(z ^ (z >>> 7), z | 61); return ((z ^ (z >>> 14)) >>> 0) / 4294967296; };
    r.ent = (lo, hi) => lo + Math.floor(r() * (hi - lo + 1));
    r.de = l => l[Math.floor(r() * l.length)];
    return r;
  }
  // Gesto directo (docs/teoria.md §4b): la manija vive en el viewBox de geo-figura; aPlano la vuelve coordenadas del
  // problema y el lector ajusta cada valor al paso y al rango de su control.
  const enPantalla = (datos, p) => G.aPantalla(datos, p);
  const alPlano = (datos, pt) => G.aPlano(datos, pt);
  function opciones(correcta, distractores, fmt, n = 4) {
    const vistos = new Set([fmt(correcta)]);
    const ops = [{ id: 'c', texto: fmt(correcta), correcta: true }];
    for (const d of distractores) {
      const txt = fmt(d.valor);
      if (vistos.has(txt) || !Number.isFinite(d.valor) || d.valor <= 0) continue;
      vistos.add(txt);
      ops.push({ id: d.id, texto: txt, error: d.error, siFuera: d.siFuera });
    }
    return ops.slice(0, n);
  }
  // Cuatro opciones siempre en «Ahora tú»: si dos errores coinciden por los números, se arma otro caso con el mismo azar.
  // (Auditoría del 19 nov, M3: «Ahora tú» no repite un ejemplo de su idea; vetadas: las firmas de sus ejemplos.)
  const firmaDe = t => { const q = Kit.plano(t); return `${(q.match(/\d+(?:,\d+)?/g) || []).join(' ')}|${((q.match(/¿[^?]*\?/g) || []).pop() || '').replace(/\d+(?:,\d+)?/g, '#')}`; };
  const firmasDe = ejs => new Set(ejs.map(e => firmaDe(e.enunciado)));
  function conCuatro(caso, r, vetadas) {
    for (let i = 0; i < 200; i++) { const c = caso(r); if (c && c.opciones.length >= 4 && !(vetadas && vetadas.has(firmaDe(c.pregunta)))) return c; }
    throw new Error(`${caso.name}: no salieron cuatro opciones distintas`);
  }

  // ---------- Ayudantes de las ideas rehechas (geo-objeto) ----------
  const GO = 'geo-objeto';
  const dO = t => ({ v: 'c-o', t }), dI = t => ({ v: 'c-i', t }), dH = t => ({ v: 'c-h', t }), dF = t => ({ v: 'c-f', t });
  // Entre dos igualdades, «y» o una flecha (un «·» se leía como otra igualdad; auditoría de Triángulos, B2).
  const Y = '   y   ', FL = '   →   ';
  // Una relación que no se parte en dos líneas: sus espacios pasan a espacios duros.
  const junto = x => (typeof x === 'string' ? x.replace(/ /g, ' ') : Array.isArray(x) ? x.map(junto) : x);
  const fig = (datos, estado = {}) => ({ pieza: GO, datos, estado });
  const RAD = Math.PI / 180;
  const D_CRIT = 'Criterios de congruencia: LAL (el ángulo entre los dos lados), ALA (el lado entre los dos ángulos) y LLL.';
  const D_NO = 'LLA (el ángulo no queda entre los dos lados) y AAA no aseguran la congruencia.';
  const D_SEIS = 'En triángulos congruentes, las seis medidas coinciden, una por una.';
  const D_SUMA = 'En todo triángulo, los tres ángulos interiores suman 180°.';
  const D_OPUESTOS = 'Opuestos por el vértice: miden igual.';
  const D_ALT = 'Alternos internos entre paralelas: miden igual.';
  const D_COMUN = 'Un lado que es de los dos triángulos (lado común) mide lo mismo en los dos.';
  const D_ADY = 'Dos ángulos adyacentes en una recta suman 180°.';

  // Figura de examen (objeto «angulos» de geo-objeto, que pone los rótulos de los ángulos donde no pisan los lados): uno o
  // varios triángulos a escala. Cada triángulo: tri('ABC', [pA, pB, pC], { ang, lados }).
  //   ang:   { A: { texto, color, marcas } }      el arco de ese vértice (sin texto, solo el arco; sin color, en tinta)
  //   lados: { AB: { texto, color, llave: 1..3, dist, en } }   la medida de un lado (afuera) o su marca sobre una llave;
  //          grueso: true lo traza grueso en tinta (un tercer lado dado) y fino: true, fino y punteado (un lado que no es dato)
  // Cada ángulo lleva mide (lo que mide de verdad en el dibujo); congruencia.test.js lo compara con su rótulo.
  function tri(nom, P, o = {}) {
    const ids = nom.split(''), pos = {}; ids.forEach((id, k) => { pos[id] = P[k]; });
    const otros = v => ids.filter(x => x !== v), tercero = L => ids.find(x => !L.includes(x));
    const puntos = ids.map(id => Object.assign({ id, x: pos[id][0], y: pos[id][1], sinPunto: true }, o.letras === false ? {} : { rotulo: id, lado: 90 }));
    const lados = o.lados || {}, cl = L => (lados[L] || lados[L[1] + L[0]] || {});
    const segmentos = [[0, 1], [1, 2], [2, 0]].map(([p, q]) => { const L = ids[p] + ids[q], x = cl(L); return Object.assign({ de: ids[p], a: ids[q] }, x.color ? { color: x.color, grosor: 'variable' } : x.grueso ? { grosor: 'variable' } : x.fino ? { discontinua: true, grosor: 'fino' } : {}); });
    const angulos = Object.entries(o.ang || {}).map(([v, x]) => Object.assign({ en: v, de: otros(v)[0], a: otros(v)[1], radio: x.radio || 20, holgura: 6, marcas: x.marcas || 1,
      mide: U.angulo(pos[v], pos[otros(v)[0]], pos[otros(v)[1]]) }, x.texto !== undefined ? { texto: x.texto } : {}, x.color ? { color: x.color } : {}));
    const llaves = [], ladosRot = [];
    for (const [L, x] of Object.entries(lados)) {
      const base = { de: L[0], a: L[1], ref: tercero(L) };
      if (x.llave) llaves.push(Object.assign({}, base, { marcas: x.llave }, x.color ? { color: x.color } : {}, x.dist ? { dist: x.dist } : {}));
      if (x.texto !== undefined) ladosRot.push(Object.assign({}, base, { texto: x.texto, dist: x.dist === undefined ? 6 : x.dist }, x.color ? { color: x.color } : {}, x.en !== undefined ? { en: x.en } : {}));
    }
    return { puntos, segmentos, angulos, llaves, ladosRot };
  }
  // Junta las partes en una figura de examen; los puntos y los lados repetidos (un lado común) van una sola vez.
  function figura(partes, o = {}) {
    const fg = { alt: o.alt, alto: o.alto || 240, puntos: [], segmentos: [], angulos: [] }, llaves = [], ladosRot = [];
    const clave = sg => [sg.de, sg.a].sort().join('');
    for (const p of partes) {
      for (const q of p.puntos || []) if (!fg.puntos.some(x => x.id === q.id)) fg.puntos.push(q);
      for (const sg of p.segmentos || []) { const k = fg.segmentos.findIndex(x => clave(x) === clave(sg)); if (k < 0) fg.segmentos.push(sg); else if (sg.color && !fg.segmentos[k].color) fg.segmentos[k] = sg; }
      fg.angulos.push(...(p.angulos || [])); llaves.push(...(p.llaves || [])); ladosRot.push(...(p.ladosRot || []));
    }
    if (o.arcos) fg.arcos = o.arcos;
    const xs = fg.puntos.map(q => q.x), ys = fg.puntos.map(q => q.y), w = Math.max(...xs) - Math.min(...xs), h = Math.max(...ys) - Math.min(...ys);
    const mx = o.mx === undefined ? 0.16 * Math.max(w, 1.3 * h) : o.mx, my = o.my === undefined ? mx : o.my;
    fg.vista = o.vista || { x: [Math.min(...xs) - mx, Math.max(...xs) + mx], y: [Math.min(...ys) - my - (o.abajo || 0), Math.max(...ys) + my] };
    PO.acomodarLetras(fg, fg.puntos.filter(q => q.rotulo).map(q => q.id), o.evita || {});
    return Object.assign({ objeto: 'angulos', figura: fg }, llaves.length ? { llaves } : {}, ladosRot.length ? { ladosRot } : {}, o.libres ? { libres: o.libres } : {}, o.sinEscala ? { sinEscala: true } : {});
  }
  // El triángulo con AB = c sobre la horizontal, AC = b y el ángulo A (en grados) entre ellos.
  const porLAL = (c, b, a) => [[0, 0], [c, 0], U.polar([0, 0], b, a)];
  // Con AB = c y los ángulos en A y en B.
  const porALA = (c, a, b) => [[0, 0], [c, 0], U.polar([0, 0], c * Math.sin(b * RAD) / Math.sin((a + b) * RAD), a)];
  // Con los tres lados: AB = c, AC = b y BC = a.
  const porLLL = (c, b, a) => { const x = (c * c + b * b - a * a) / (2 * c); return [[0, 0], [c, 0], [x, Math.sqrt(Math.max(0, b * b - x * x))]]; };
  // Mueve un triángulo: lo gira (grados, alrededor de su primer vértice), lo voltea (espejo: sí) y lo traslada.
  const mover = (P, o = {}) => P.map(p => {
    const x0 = p[0] - P[0][0], y0 = (o.espejo ? -1 : 1) * (p[1] - P[0][1]), c = Math.cos((o.giro || 0) * RAD), s = Math.sin((o.giro || 0) * RAD);
    return [P[0][0] + x0 * c - y0 * s + (o.dx || 0), P[0][1] + x0 * s + y0 * c + (o.dy || 0)];
  });
  // Una figura sirve si sus rótulos caben (geo-objeto) y cada rótulo de ángulo queda claramente más cerca de su vértice
  // que de cualquier otro vértice con ángulo marcado (regla de Triángulos).
  function rotulosPropios(F, k = 0.8) {
    const { rot, vertice } = PO.rotulos(F), ids = [...new Set((F.figura.angulos || []).map(q => q.en))];
    return rot.every(z => {
      const cx = (z.caja.x0 + z.caja.x1) / 2, cy = (z.caja.y0 + z.caja.y1) / 2, d = id => { const v = vertice(id); return Math.hypot(cx - v[0], cy - v[1]); };
      return ids.every(id => id === z.an.en || d(z.an.en) < k * d(id));
    });
  }
  const cabe = F => PO.escenaCabe(F) && rotulosPropios(F);
  // Sin escala (auditoría del 19 nov, M2): una figura cuyo ángulo pedido se mediría con transportador se estira en
  // vertical (k), se marca sinEscala y el enunciado lo dice (NO_ESC). Las paralelas y los puntos medios se conservan;
  // los ángulos, no (a propósito). Los `mide` se rehacen con el dibujo nuevo.
  const NO_ESC = ' El dibujo no está a escala.';
  function torcer(F, k = 1.45) {
    const fg = F.figura, y0 = Math.min(...fg.puntos.map(q => q.y)), sube = y => y0 + (y - y0) * k;
    fg.puntos.forEach(q => { q.y = sube(q.y); });
    if (fg.vista) fg.vista = { x: fg.vista.x, y: [sube(fg.vista.y[0]), sube(fg.vista.y[1])] };
    const pos = Object.fromEntries(fg.puntos.map(q => [q.id, [q.x, q.y]]));
    (fg.angulos || []).forEach(a => { if (pos[a.en] && pos[a.de] && pos[a.a]) a.mide = U.angulo(pos[a.en], pos[a.de], pos[a.a]); });
    PO.acomodarLetras(fg, fg.puntos.filter(q => q.rotulo).map(q => q.id));
    return Object.assign(F, { sinEscala: true });
  }
  const ARC = { A: 1, B: 2, C: 3, D: 1, E: 2, F: 3 };
  const aH = (v, texto) => Object.assign({ color: 'h', marcas: ARC[v] || 1 }, texto !== undefined ? { texto } : {});

  // ---------- Idea 1 (rehecha, 19 nov): criterios de congruencia ----------
  // Objeto de la primera pantalla: un tijeral que se arma en el piso del taller, sobre la silueta del primero marcada
  // con tiza (geo-objeto, armazon; dibujo de prueba). El modelo: AB = 8 m, AC = 5 m y 60° entre ellas; cierra BC = 7 m
  // (ley de cosenos: 64 + 25 − 40 = 49).
  // Cambia: el ángulo en A (gira la viga AC). · Permanece: las vigas AB y AC. · Progresa: la viga que cierra, BC, una
  // medida por cada ángulo. · Se reserva: el ángulo fuera de las dos vigas (LLA: la predicción) y las otras dos maneras
  // de fijar el tijeral (ALA y LLL, en «Mira»). · Debe verse: con 60° el tijeral calza sobre la silueta, y solo con 60°.
  const AB = 8, AC = 5, T0 = 60;
  const VJ = { x: [-3.5, 9.2], y: [-1.6, 5.7] };            // vista fija: la punta C sigue al dedo
  const pC = t => U.polar([0, 0], AC, t);
  const largoBC = t => U.dist(pC(t), [AB, 0]);
  const entero = x => Math.abs(x - Math.round(x)) < 1e-9;
  const mBC = t => (entero(largoBC(t)) ? `${f(largoBC(t))} m` : `≈ ${f(largoBC(t))} m`);
  const vigasT = [{ de: 'A', a: 'B' }, { de: 'A', a: 'C' }, { de: 'B', a: 'C' }];
  // El tijeral del juego: AB fija, AC gira en A y BC cierra. o.silueta: false la quita; o.medidas: false, sin rótulos.
  function figJ(t, o = {}) {
    const C = pC(t), fg = { alt: `Un tijeral que se arma en el piso del taller: la viga AB mide 8 m, la viga AC mide 5 m y forman ${f(t)}° en A; la viga que cierra, BC, mide ${mBC(t)}${o.silueta === false ? '' : `. Debajo, la silueta del modelo marcada con tiza, que ${t === T0 ? 'calza' : 'no calza'} con el tijeral`}.`,
      vista: o.vista || VJ, alto: o.alto || 262,
      // (lejos: las vigas tienen ancho; la letra se aleja 4 px más para no tocar la tabla.)
      puntos: [{ id: 'A', x: 0, y: 0, rotulo: 'A', lado: 200, lejos: 4, sinPunto: true }, { id: 'B', x: AB, y: 0, rotulo: 'B', lado: -30, lejos: 4, sinPunto: true }, { id: 'C', x: C[0], y: C[1], rotulo: 'C', lado: 90, lejos: 4, sinPunto: true }],
      segmentos: [{ de: 'A', a: 'B', color: 'o', grosor: 'variable' }, { de: 'A', a: 'C', color: 'i', grosor: 'variable' }, { de: 'B', a: 'C' }],
      angulos: o.angulos || [{ en: 'A', de: 'B', a: 'C', texto: `${f(t)}°`, color: 'h', radio: 16, holgura: 11, mide: t }] };
    PO.acomodarLetras(fg, ['A', 'B', 'C']);
    return Object.assign({ objeto: 'armazon', tipo: 'taller', figura: fg, vigas: vigasT, pernos: ['A', 'B', 'C'] },
      o.silueta === false ? {} : { silueta: { puntos: [[0, 0], [AB, 0], pC(T0)] } },
      o.manija === false ? {} : { manija: 'C' },
      o.medidas === false ? {} : { ladosRot: [{ de: 'A', a: 'B', texto: '8 m', color: 'o', ref: 'C', dist: 9 }, { de: 'A', a: 'C', texto: '5 m', color: 'i', ref: 'B', dist: 9 }, { de: 'B', a: 'C', texto: o.bc === undefined ? mBC(t) : o.bc, ref: 'A', dist: 9 }] });
  }
  // «Lee»: dos tijerales iguales, uno al lado del otro (sin letras ni medidas), y el tijeral con sus seis medidas.
  const figDos = () => {
    const T1 = porLAL(4.8, 3, 60), T2 = mover(T1, { dx: 6.2 });
    const pts = (P, n) => P.map((p, k) => ({ id: `${n}${k}`, x: p[0], y: p[1], sinPunto: true }));
    const sgs = n => [[0, 1], [0, 2], [1, 2]].map(([p, q]) => ({ de: `${n}${p}`, a: `${n}${q}` }));
    return { objeto: 'armazon', tipo: 'taller', vigas: sgs('p').concat(sgs('q')), pernos: ['p0', 'p1', 'p2', 'q0', 'q1', 'q2'],
      figura: { alt: 'Dos tijerales iguales sobre el piso del taller, uno al lado del otro: tienen la misma forma y el mismo tamaño.', vista: { x: [-0.7, 11.7], y: [-0.9, 3.4] }, alto: 150,
        puntos: pts(T1, 'p').concat(pts(T2, 'q')), segmentos: sgs('p').concat(sgs('q')), angulos: [] } };
  };
  const figSeis = () => {
    const d = figJ(T0, { silueta: false, manija: false, bc: '7 m', vista: { x: [-1.6, 9.6], y: [-1.7, 5.5] },
      angulos: [{ en: 'A', de: 'B', a: 'C', color: 'h', radio: 20, marcas: 1, mide: 60 }, { en: 'B', de: 'C', a: 'A', color: 'h', radio: 24, marcas: 2, mide: U.angulo([AB, 0], pC(T0), [0, 0]) },
        { en: 'C', de: 'A', a: 'B', color: 'h', radio: 18, marcas: 3, mide: U.angulo(pC(T0), [0, 0], [AB, 0]) }] });
    d.figura.alt = 'Un tijeral ABC con sus seis medidas: los lados AB = 8 m, AC = 5 m y BC = 7 m, y sus tres ángulos, con un arco en A, dos en B y tres en C.';
    return d;
  };

  // La trampa LLA y las tres maneras que sí fijan el tijeral, en una sola figura con cortes (Predice, su revelado y
  // «Mira»). AB = 8 m; la línea de AC sale de A a 30°; la viga de 5 m gira en B. Como sen 30° = 1/2, B queda a 4 m de
  // la línea, y la circunferencia de radio 5 m la corta a 3 m a cada lado del pie (3-4-5): AC₁ = 4√3 − 3 y AC₂ = 4√3 + 3.
  //   corte 0: AB, la línea y la viga de 5 m suelta en el piso · 1: la circunferencia de centro B · 2: C₁ y C₂ · 3: las
  //   dos vigas BC₁ y BC₂ · 4: LAL (AC a 60°: BC cierra con 7 m) · 5: ALA (60° en A y unos 38° en B: dos líneas) · 6: LLL
  //   (5 m desde A y 7 m desde B: dos arcos).
  const A_LLA = 30, R_LLA = 5;
  const PIE = AB * Math.cos(A_LLA * RAD), DIST_B = AB * Math.sin(A_LLA * RAD), MEDIA = Math.sqrt(R_LLA * R_LLA - DIST_B * DIST_B);
  const AC1 = PIE - MEDIA, AC2 = PIE + MEDIA;
  const ANG_B = U.angulo([AB, 0], pC(T0), [0, 0]);            // ≈ 38,2°
  function figLLA(o = {}) {
    const C1 = U.polar([0, 0], AC1, A_LLA), C2 = U.polar([0, 0], AC2, A_LLA), R = U.polar([0, 0], 11.2, A_LLA), C = pC(T0);
    const Ra = U.polar([0, 0], 6.6, T0), Rb = U.polar([AB, 0], 8.9, 180 - ANG_B);
    const gB = p => U.grados(Math.atan2(p[1], p[0] - AB));
    // C aparece tres veces en el mismo lugar (LAL, ALA y LLL): su letra va donde no pisa lo que se ve en cada paso.
    const pc = (id, o2) => Object.assign({ id, x: C[0], y: C[1], rotulo: 'C' }, o2);
    const fg = { alt: o.alt || 'En el piso del taller, la viga AB de 8 m y la línea por donde irá la viga AC, a 30° de AB. La viga de 5 m gira alrededor de B: su punta recorre una circunferencia que corta la línea en dos puntos, C₁ y C₂. Salen dos tijerales distintos.',
      vista: { x: [-1.3, 10.9], y: [-2.75, 6.0] }, alto: 262,
      puntos: [{ id: 'A', x: 0, y: 0, rotulo: 'A', lado: 215, lejos: 4, sinPunto: true }, { id: 'B', x: AB, y: 0, rotulo: 'B', lado: -40, lejos: 4, sinPunto: true },
        { id: 'R', x: R[0], y: R[1], sinPunto: true }, { id: 'S1', x: 1.6, y: -1.75, sinPunto: true }, { id: 'S2', x: 6.6, y: -1.75, sinPunto: true },
        { id: 'C1', x: C1[0], y: C1[1], rotulo: 'C₁', lado: 140, lejos: 6, color: 'i', desde: 2, hasta: 3 }, { id: 'C2', x: C2[0], y: C2[1], rotulo: 'C₂', lado: 100, lejos: 5, color: 'i', desde: 2, hasta: 3 },
        pc('C', { lado: 100, lejos: 3, sinPunto: true, desde: 4, hasta: 4 }), pc('Cb', { lado: 190, lejos: 2, desde: 5, hasta: 5 }), pc('Cc', { lado: 100, lejos: 5, sinPunto: true, desde: 6 }),
        { id: 'Ra', x: Ra[0], y: Ra[1], sinPunto: true }, { id: 'Rb', x: Rb[0], y: Rb[1], sinPunto: true }],
      segmentos: [{ de: 'A', a: 'B', color: 'o', grosor: 'variable' }, { de: 'A', a: 'R', discontinua: true, grosor: 'fino', hasta: 3 },
        { de: 'S1', a: 'S2', color: 'i', grosor: 'variable', hasta: 0 },
        { de: 'B', a: 'C1', color: 'i', grosor: 'variable', desde: 3, hasta: 3 }, { de: 'B', a: 'C2', color: 'i', grosor: 'variable', desde: 3, hasta: 3 },
        { de: 'A', a: 'C', color: 'i', grosor: 'variable', desde: 4, hasta: 4 }, { de: 'B', a: 'C', desde: 4, hasta: 4 },
        { de: 'A', a: 'Ra', discontinua: true, grosor: 'fino', desde: 5, hasta: 5 }, { de: 'B', a: 'Rb', discontinua: true, grosor: 'fino', desde: 5, hasta: 5 },
        { de: 'A', a: 'Cc', color: 'i', grosor: 'variable', desde: 6 }, { de: 'B', a: 'Cc', desde: 6 }],
      arcos: [{ centro: 'B', r: R_LLA, de: gB(C2) - 16, a: gB(C1) + 14, color: 'i', discontinua: true, desde: 1, hasta: 3 },
        { centro: 'A', r: AC, de: T0 - 34, a: T0 + 30, color: 'i', discontinua: true, desde: 6 }, { centro: 'B', r: 7, de: gB(C) - 22, a: gB(C) + 20, discontinua: true, desde: 6 }],
      angulos: [{ en: 'A', de: 'B', a: 'R', texto: '30°', color: 'h', radio: 24, holgura: 11, mide: A_LLA, hasta: 2 },
        { en: 'A', de: 'B', a: 'R', color: 'h', radio: 24, mide: A_LLA, desde: 3, hasta: 3 },   // con las dos vigas puestas, solo el arco: el rótulo no cabe
        { en: 'A', de: 'B', a: 'C', texto: '60°', color: 'h', radio: 16, holgura: 11, mide: T0, desde: 4, hasta: 5 },
        { en: 'B', de: 'C', a: 'A', color: 'h', radio: 24, marcas: 2, mide: ANG_B, desde: 5, hasta: 5 }] };   // «≈ 38°» va en la ecuación del paso: junto al 60° no cabía
    return { objeto: 'armazon', tipo: 'taller', figura: fg, pernos: ['A', 'B', 'C', 'Cc'],
      vigas: [{ de: 'A', a: 'B' }, { de: 'S1', a: 'S2', hasta: 0 }, { de: 'B', a: 'C1', desde: 3, hasta: 3 }, { de: 'B', a: 'C2', desde: 3, hasta: 3 },
        { de: 'A', a: 'C', desde: 4, hasta: 4 }, { de: 'B', a: 'C', desde: 4, hasta: 4 }, { de: 'A', a: 'Cc', desde: 6 }, { de: 'B', a: 'Cc', desde: 6 }],
      ladosRot: [{ de: 'A', a: 'B', texto: '8 m', color: 'o', ref: [4, 3], dist: 9 }, { de: 'S1', a: 'S2', texto: '5 m', color: 'i', ref: [4, 3], dist: 9, hasta: 0 },
        { de: 'B', a: 'C1', texto: '5 m', color: 'i', ref: [5, -3], dist: 9, en: 0.42, desde: 3, hasta: 3 }, { de: 'B', a: 'C2', texto: '5 m', color: 'i', ref: [0, 3], dist: 9, desde: 3, hasta: 3 },
        { de: 'A', a: 'C', texto: '5 m', color: 'i', ref: 'B', dist: 9, desde: 4, hasta: 4 }, { de: 'B', a: 'C', texto: '7 m', ref: 'A', dist: 9, desde: 4, hasta: 4 },
        { de: 'A', a: 'Cc', texto: '5 m', color: 'i', ref: 'B', dist: 9, desde: 6 }, { de: 'B', a: 'Cc', texto: '7 m', ref: 'A', dist: 9, desde: 6 }] };
  }
  const LLA = figLLA();

  // Figuras de los ejercicios de la idea 1. Cuando la pregunta es si los datos bastan, se dibuja UN solo triángulo con
  // los datos marcados: dos triángulos iguales dirían «sí» y dos distintos, «no» (molde §3: el dibujo no da la respuesta).
  const cm = n => `${f(n)} cm`;
  // El triángulo ABC con sus datos: P = [pA, pB, pC]; lados y ang, como en tri().
  const unT = (P, ang, lados, o = {}) => figura([tri('ABC', P, { ang, lados })], Object.assign({ alto: 230 }, o));
  // AB y la recta por donde irá AC (sin C): la figura de «¿cuántos triángulos salen?».
  function figRecta(c, a, o = {}) {
    const R = U.polar([0, 0], c * 1.25, a);
    return { objeto: 'angulos', ladosRot: [{ de: 'A', a: 'B', texto: o.ab || cm(c), color: 'o', ref: 'R', dist: 6 }],
      figura: { alt: `El lado AB, de ${f(c)} ${o.u || 'cm'}, y la recta que sale de A formando ${f(a)}° con AB: en ella irá el lado AC. Falta ubicar el punto C.`, alto: 200,
        vista: { x: [-0.14 * c, 1.22 * c], y: [-0.2 * c, R[1] + 0.1 * c] },
        puntos: [{ id: 'A', x: 0, y: 0, rotulo: 'A', lado: 200, sinPunto: true }, { id: 'B', x: c, y: 0, rotulo: 'B', lado: -40 }, { id: 'R', x: R[0], y: R[1], sinPunto: true }],
        segmentos: [{ de: 'A', a: 'B', color: 'o', grosor: 'variable' }, { de: 'A', a: 'R', discontinua: true, grosor: 'fino' }],
        angulos: [{ en: 'A', de: 'B', a: 'R', texto: `${f(a)}°`, color: 'h', radio: 24, holgura: 6, mide: a }] } };
  }
  // La cometa ABCD con su varilla central AC: AB = AD y CB = CD (medio ancho w; A a p de la línea BD y C a q).
  function figCometa(w, p, q, o = {}) {
    const P = { A: [0, p], B: [-w, 0], C: [0, -q], D: [w, 0] };
    const lados = o.lados || {};
    const fg = { alt: o.alt || 'Una cometa ABCD con una varilla central AC: los bordes AB y AD miden lo mismo, y los bordes CB y CD también.', alto: o.alto || 262,
      vista: o.vista || { x: [-w * 2.1, w * 2.1], y: [-q - 0.3 * (p + q), p + 0.14 * (p + q)] },
      puntos: [{ id: 'A', x: 0, y: p, rotulo: 'A', lado: 90, sinPunto: true }, { id: 'B', x: -w, y: 0, rotulo: 'B', lado: 180, sinPunto: true }, { id: 'C', x: 0, y: -q, rotulo: 'C', lado: 200, sinPunto: true }, { id: 'D', x: w, y: 0, rotulo: 'D', lado: 0, sinPunto: true }],
      segmentos: [{ de: 'A', a: 'B', color: 'o', grosor: 'variable' }, { de: 'A', a: 'D', color: 'o', grosor: 'variable' }, { de: 'C', a: 'B', color: 'i', grosor: 'variable' }, { de: 'C', a: 'D', color: 'i', grosor: 'variable' }, { de: 'A', a: 'C' }],
      angulos: [] };
    const med = (de, a, ref, k) => (lados[k] ? [{ de, a, ref, texto: lados[k], color: k[0] === 'A' ? 'o' : 'i', dist: 6 }] : []);
    return Object.assign({ objeto: 'armazon', tipo: 'cometa', figura: fg, vigas: [{ de: 'A', a: 'C' }], papel: ['A', 'B', 'C', 'D'] }, o.cola === false ? {} : { cola: 'C' },
      { ladosRot: [...med('A', 'B', 'D', 'AB'), ...med('A', 'D', 'B', 'AD'), ...med('C', 'B', 'D', 'CB'), ...med('C', 'D', 'B', 'CD')] },
      o.llaves ? { llaves: [{ de: 'A', a: 'B', marcas: 1, color: 'o', ref: 'D' }, { de: 'A', a: 'D', marcas: 1, color: 'o', ref: 'B' }, { de: 'C', a: 'B', marcas: 2, color: 'i', ref: 'D' }, { de: 'C', a: 'D', marcas: 2, color: 'i', ref: 'B' }] } : {});
  }
  // El cuadrilátero ABCD con la diagonal AC (figura de examen de la cometa): marcas según lo que se da.
  //   que: 'LLL' (AB = AD y CB = CD), 'LAL' (AB = AD y los ángulos en A) o 'ALA' (los ángulos en A y los ángulos en C).
  function figDiagonal(w, p, q, que) {
    const P = { A: [0, p], B: [-w, 0], C: [0, -q], D: [w, 0] }, ps = id => P[id];
    const pt = (id, lado) => ({ id, x: P[id][0], y: P[id][1], rotulo: id, lado, sinPunto: true });
    const an = (en, de, a, rayita) => ({ en, de, a, color: 'h', radio: 26, holgura: 6, rayita, mide: U.angulo(ps(en), ps(de), ps(a)) });
    const fg = { alt: `El cuadrilátero ABCD con su diagonal AC, que lo parte en los triángulos ABC y ADC${que === 'LLL' ? ': AB = AD y CB = CD' : que === 'LAL' ? ': AB = AD, y AC parte el ángulo A en dos iguales' : ': AC parte el ángulo A en dos iguales, y también el ángulo C'}.`, alto: 250,
      vista: { x: [-w * 1.9, w * 1.9], y: [-q - 0.16 * (p + q), p + 0.16 * (p + q)] },
      puntos: [pt('A', 90), pt('B', 180), pt('C', -90), pt('D', 0)],
      segmentos: [{ de: 'A', a: 'B' }, { de: 'A', a: 'D' }, { de: 'C', a: 'B' }, { de: 'C', a: 'D' }, { de: 'A', a: 'C' }],
      angulos: que === 'LLL' ? [] : que === 'LAL' ? [an('A', 'B', 'C', 1), an('A', 'C', 'D', 1)] : [an('A', 'B', 'C', 1), an('A', 'C', 'D', 1), an('C', 'A', 'B', 2), an('C', 'D', 'A', 2)] };
    if (que !== 'ALA') { fg.segmentos[0] = { de: 'A', a: 'B', color: 'o', grosor: 'variable' }; fg.segmentos[1] = { de: 'A', a: 'D', color: 'o', grosor: 'variable' }; }
    if (que === 'LLL') { fg.segmentos[2] = { de: 'C', a: 'B', color: 'i', grosor: 'variable' }; fg.segmentos[3] = { de: 'C', a: 'D', color: 'i', grosor: 'variable' }; }
    const llaves = que === 'ALA' ? [] : [{ de: 'A', a: 'B', marcas: 1, color: 'o', ref: 'D' }, { de: 'A', a: 'D', marcas: 1, color: 'o', ref: 'B' }]
      .concat(que === 'LLL' ? [{ de: 'C', a: 'B', marcas: 2, color: 'i', ref: 'D' }, { de: 'C', a: 'D', marcas: 2, color: 'i', ref: 'B' }] : []);
    return Object.assign({ objeto: 'angulos', figura: fg }, llaves.length ? { llaves } : {});
  }
  // El cruce: AD y BC se cortan en O; triángulos AOB (a la izquierda) y DOC (a la derecha). oa = OA = OD, ob = OB = OC;
  // fi, el ángulo AOB. o.lados: { OA, OD, OB, OC, AB, CD: texto }; o.llaves: marcas en vez de medidas; o.ang: { A, D, B, C }.
  function figCruce(oa, ob, fi, o = {}) {
    const P = { O: [0, 0], A: U.polar([0, 0], oa, 180 - fi / 2), B: U.polar([0, 0], ob, 180 + fi / 2), D: U.polar([0, 0], o.od || oa, -fi / 2), C: U.polar([0, 0], o.oc || ob, fi / 2) };
    const dir = id => U.grados(Math.atan2(P[id][1], P[id][0]));
    const fg = { alt: o.alt || 'Los segmentos AD y BC se cortan en O y forman dos triángulos, AOB y DOC, opuestos por el vértice O.', alto: o.alto || 236,
      puntos: Object.keys(P).map(id => ({ id, x: P[id][0], y: P[id][1], rotulo: id, lado: id === 'O' ? 90 : dir(id), sinPunto: true })),
      segmentos: [{ de: 'A', a: 'D' }, { de: 'B', a: 'C' }, { de: 'A', a: 'B' }, { de: 'C', a: 'D' }], angulos: [] };
    const LADOS = { A: ['B', 'O'], B: ['O', 'A'], C: ['O', 'D'], D: ['C', 'O'] };
    for (const [v, x] of Object.entries(o.ang || {})) fg.angulos.push(Object.assign({ en: v, de: LADOS[v][0], a: LADOS[v][1], radio: 20, holgura: 6, marcas: x.marcas || 1, mide: U.angulo(P[v], P[LADOS[v][0]], P[LADOS[v][1]]) }, x.texto !== undefined ? { texto: x.texto } : {}, x.color ? { color: x.color } : {}));
    const xs = Object.values(P).map(p => p[0]), ys = Object.values(P).map(p => p[1]), m = 0.17 * (Math.max(...xs) - Math.min(...xs));
    fg.vista = { x: [Math.min(...xs) - m, Math.max(...xs) + m], y: [Math.min(...ys) - m, Math.max(...ys) + m] };
    const REF = { OA: 'B', OB: 'A', OD: 'C', OC: 'D', AB: 'O', CD: 'O' }, COL = { OA: 'o', OD: 'o', OB: 'i', OC: 'i' }, ladosRot = [], llaves = [];
    for (const [k, t] of Object.entries(o.lados || {})) ladosRot.push(Object.assign({ de: k[0], a: k[1], ref: REF[k], texto: t, dist: 5 }, COL[k] ? { color: COL[k] } : {}, o.paralelas && !COL[k] ? { en: 0.24 } : {}));
    for (const [k, n] of Object.entries(o.llaves || {})) llaves.push(Object.assign({ de: k[0], a: k[1], ref: REF[k], marcas: n }, COL[k] ? { color: COL[k] } : {}));
    for (const sg of [['O', 'A'], ['O', 'D'], ['O', 'B'], ['O', 'C']]) { const k = sg.join(''); if ((o.lados || {})[k] || (o.llaves || {})[k]) fg.segmentos.push({ de: sg[0], a: sg[1], color: COL[k], grosor: 'variable' }); }
    if (o.paralelas) { fg.segmentos[2] = { de: 'A', a: 'B', paralela: 1 }; fg.segmentos[3] = { de: 'C', a: 'D', paralela: 1 }; }
    return Object.assign({ objeto: 'angulos', figura: fg }, ladosRot.length ? { ladosRot } : {}, llaves.length ? { llaves } : {});
  }

  // El tijeral con su poste (ejemplo 15), como figura de examen y SIN escala: se dibuja con 45° en B y en C (el dato es
  // 35° y la respuesta, 55°), para que la respuesta no se pueda medir con transportador.
  function figPoste() {
    const P = [[3, 3], [0, 0], [6, 0]];
    const F = figura([tri('ABC', P, { ang: { B: aH('B', '35°') }, lados: { AB: { llave: 1, color: 'o' }, AC: { llave: 1, color: 'o' } } }),
      { puntos: [{ id: 'M', x: 3, y: 0, rotulo: 'M', lado: 270, sinPunto: true }], segmentos: [{ de: 'A', a: 'M' }],
        angulos: [{ en: 'A', de: 'B', a: 'M', texto: '?', radio: 24, holgura: 6, marcas: 1 }],
        llaves: [{ de: 'B', a: 'M', marcas: 2, color: 'i', ref: 'A' }, { de: 'M', a: 'C', marcas: 2, color: 'i', ref: 'A' }] }],
    { sinEscala: true, alto: 220, mx: 1.0, my: 0.8, abajo: 0.5, alt: 'Triángulo ABC, sin escala, con AB = AC y el segmento AM, que baja de A al punto medio M de BC. El ángulo en B mide 35° y el ángulo BAM lleva «?».' });
    return F;
  }

  // Ejemplos resueltos de «Criterios de congruencia» (pestaña «Ejemplos»; molde §3). Cuentas rehechas con un script
  // aparte, por coordenadas y sin el código de la unidad (scratchpad e5-geometria/cuentas.py): 8 m, 60° y 5 m en los dos
  // (LAL; el tercer lado, 7 m en los dos); 6 cm entre 50° y 70° (ALA; el tercero, 60°); 4, 5 y 6 cm (LLL; 4 + 5 > 6);
  // dos escuadras de 30°, 60° y 90° (AAA no fija el tamaño); 7 cm, 5 cm y 40° frente al lado de 5 cm (LLA: 7·sen 40° ≈
  // 4,5 < 5 < 7, salen dos); 180 − 50 − 60 = 70 (AAL pasa a ALA); AB y AC forman el ángulo A; cometa de 30 cm y 50 cm
  // (LLL con AC común); cruce con 3 m y 4 m (LAL, opuestos por el vértice); AB = 10 m y 30°: B a 5 m de la línea, 5 < 6
  // < 10, dos tijerales; 3x − 4 = x + 10, x = 7, AC = 17 cm; con AB = DE y BC = EF, m∠A = m∠D da LLA (no asegura) y los
  // otros cuatro datos dan LAL o LLL; AB = 12 cm y 30°: B a 6 cm, dos triángulos con BC de 7 a 11 cm, 5 valores enteros;
  // paralelas: ALA, OB = OC, 2x + 1 = x + 4, x = 3, OB = 7 cm y BC = 14 cm; tijeral con AB = AC y M medio: LLL, ∠AMB =
  // ∠AMC = 90°, m∠BAM = 180 − 90 − 35 = 55°. La figura muestra el planteamiento: lo que cada dato marca por sí solo; lo
  // pedido con «?» en tinta; ningún dibujo trae la respuesta.
  const EJ1 = [];
  EJ1.push({ nivel: 1, titulo: 'Dos vigas y su ángulo',
    figura: fig((() => { const d = figJ(T0, { silueta: false, manija: false, bc: '', vista: { x: [-1.6, 9.6], y: [-1.7, 5.5] } });
      d.figura.alt = 'Un tijeral ABC en el piso del taller: la viga AB, de 8 m, y la viga AC, de 5 m, forman un ángulo de 60° en A. El otro tijeral, DEF, tiene esas mismas tres medidas.'; return d; })()),
    enunciado: 'Un tijeral tiene vigas AB = 8 m y AC = 5 m, con 60° entre ellas. Otro tiene DE = 8 m y DF = 5 m, con 60° entre ellas. ¿Son congruentes? ¿Por qué criterio?',
    datos: [D_CRIT],
    solucion: [{ texto: 'En los dos, el ángulo de 60° queda entre el lado de 8 m y el de 5 m: lado, ángulo, lado.', ecuacion: junto(['AB = DE,   m∠A = m∠D,   AC = DF']) }],
    respuesta: ['Sí, por ', dF('LAL')] });
  EJ1.push({ nivel: 1, titulo: 'Un lado entre dos ángulos',
    figura: fig(unT(porALA(6, 50, 70), { A: aH('A', '50°'), B: aH('B', '70°') }, { AB: { texto: '6 cm', color: 'o' } }, { alt: 'Triángulo ABC con el lado AB de 6 cm entre un ángulo de 50° en A y otro de 70° en B. El triángulo DEF tiene esas mismas tres medidas.' })),
    enunciado: 'En △ABC, AB = 6 cm, m∠A = 50° y m∠B = 70°. En △DEF, DE = 6 cm, m∠D = 50° y m∠E = 70°. ¿Son congruentes? ¿Por qué criterio?',
    datos: [D_CRIT],
    solucion: [{ texto: 'El lado de 6 cm va de un ángulo dado al otro, en los dos triángulos: ángulo, lado, ángulo.', ecuacion: junto(['m∠A = m∠D,   AB = DE,   m∠B = m∠E']) }],
    respuesta: ['Sí, por ', dF('ALA')] });
  EJ1.push({ nivel: 1, titulo: 'Tres lados iguales',
    figura: fig(unT(porLLL(6, 4, 5), {}, { AB: { texto: '6 cm', color: 'o' }, AC: { texto: '4 cm', color: 'i' }, BC: { texto: '5 cm' } }, { alt: 'Un banderín triangular ABC con lados de 6 cm, 4 cm y 5 cm. El otro banderín tiene esos mismos tres lados.' })),
    enunciado: 'Rosa corta dos banderines de tela. Cada uno tiene lados de 4 cm, 5 cm y 6 cm. Sin medir ningún ángulo, ¿puede asegurar que son congruentes?',
    datos: [D_CRIT],
    solucion: [{ texto: 'Los tres lados de uno miden lo mismo que los tres del otro: lado, lado, lado. Los ángulos salen iguales solos.' }],
    respuesta: ['Sí, por ', dF('LLL')] });
  EJ1.push({ nivel: 1, titulo: 'Dos escuadras',
    enunciado: 'Dos escuadras de dibujo tienen ángulos de 30°, 60° y 90°. ¿Eso asegura que las dos escuadras son congruentes?',
    datos: [D_CRIT, D_NO],
    solucion: [{ texto: 'Tres ángulos iguales (AAA) dan la misma forma, pero no el tamaño: hay escuadras de 30° y 60° chicas y grandes.' },
      { texto: 'Para asegurar la congruencia falta al menos un lado igual.' }],
    respuesta: [dF('No'), ': AAA no fija el tamaño'] });
  EJ1.push({ nivel: 1, titulo: 'El ángulo fuera de lugar',
    figura: fig(unT(porLAL(7, 7 * Math.cos(40 * RAD) + Math.sqrt(25 - (7 * Math.sin(40 * RAD)) ** 2), 40), { A: aH('A', '40°') }, { AB: { texto: '7 cm', color: 'o' }, BC: { texto: '5 cm', color: 'i' } },
      { alt: 'Triángulo ABC con AB de 7 cm, BC de 5 cm y un ángulo de 40° en A: el ángulo no queda entre los dos lados dados. El triángulo DEF tiene esas mismas tres medidas.' })),
    enunciado: 'En △ABC, AB = 7 cm, BC = 5 cm y m∠A = 40°. En △DEF, DE = 7 cm, EF = 5 cm y m∠D = 40°. ¿Esos datos aseguran que son congruentes?',
    datos: [D_CRIT, D_NO],
    solucion: [{ texto: 'Los lados dados son AB y BC, y se juntan en B. El ángulo dado está en A: no queda entre ellos.' },
      { texto: 'Es lado, lado, ángulo (LLA): no asegura la congruencia.' }],
    respuesta: [dF('No'), ': es LLA, no LAL'] });

  EJ1.push({ nivel: 2, titulo: 'Dos ángulos y otro lado',
    figura: fig(unT(porALA(8, 50, 70), { A: aH('A', '50°'), C: aH('C', '60°') }, { AB: { texto: '8 cm', color: 'o' } }, { alt: 'Triángulo ABC con AB de 8 cm, un ángulo de 50° en A y otro de 60° en C. El triángulo DEF tiene esas mismas tres medidas.' })),
    enunciado: 'En △ABC y △DEF: m∠A = m∠D = 50°, m∠C = m∠F = 60° y AB = DE = 8 cm. ¿Son congruentes? ¿Por qué criterio?',
    datos: [D_CRIT, D_SUMA],
    solucion: [{ texto: 'AB no queda entre los ángulos A y C. Saco el tercer ángulo, que es el mismo en los dos:', ecuacion: junto('m∠B = m∠E = 180° − 50° − 60° = 70°') },
      { texto: 'Ahora AB queda entre los ángulos A y B, y DE entre D y E: ángulo, lado, ángulo.' }],
    respuesta: ['Sí, por ', dF('ALA'), ', con m∠B = m∠E = 70°'] });
  EJ1.push({ nivel: 2, titulo: '¿Qué ángulo falta?',
    figura: fig(unT(porLAL(8, 6, 55), { A: { marcas: 1 }, B: { marcas: 2 }, C: { marcas: 3 } }, { AB: { llave: 1, color: 'o' }, AC: { llave: 2, color: 'i' } },
      { alt: 'Triángulo ABC con los lados AB y AC marcados como dato y sus tres ángulos sin medida: un arco en A, dos en B y tres en C.', abajo: 1.2 })),
    enunciado: 'En △ABC y △DEF se sabe que AB = DE y AC = DF. ¿Qué pareja de ángulos iguales hace falta para asegurar la congruencia por LAL?',
    datos: [D_CRIT],
    solucion: [{ texto: 'LAL pide el ángulo que forman los dos lados dados. AB y AC se juntan en A; DE y DF, en D.' },
      { texto: 'Con el ángulo B o el C quedaría LLA, que no asegura nada.' }],
    respuesta: ['Falta ', dF('m∠A = m∠D')] });
  EJ1.push({ nivel: 2, titulo: 'La cometa',
    figura: fig(figCometa(24, 18, Math.sqrt(2500 - 576), { lados: { AB: '30 cm', AD: '30 cm', CB: '50 cm', CD: '50 cm' } })),
    enunciado: 'Una cometa ABCD tiene una varilla central AC. Sus bordes miden AB = AD = 30 cm y CB = CD = 50 cm. ¿Por qué criterio △ABC ≅ △ADC?',
    datos: [D_CRIT, D_COMUN],
    solucion: [{ texto: 'Hay dos parejas de lados iguales a la vista. La tercera es la varilla AC, que es lado de los dos triángulos.', ecuacion: junto('AB = AD,   CB = CD,   AC = AC') },
      { texto: 'Tres lados iguales: lado, lado, lado.' }],
    respuesta: ['Por ', dF('LLL'), ', con AC lado de los dos'] });
  EJ1.push({ nivel: 2, titulo: 'Dos sogas que se cruzan',
    figura: fig(figCruce(3, 4, 70, { lados: { OA: '3 m', OD: '3 m', OB: '4 m', OC: '4 m' }, alt: 'Dos sogas, AD y BC, se cruzan en O. OA y OD miden 3 m; OB y OC miden 4 m. Se forman los triángulos AOB y DOC.' })),
    enunciado: 'Dos sogas tensas, AD y BC, se cruzan en O. OA = OD = 3 m y OB = OC = 4 m. ¿Por qué criterio △AOB ≅ △DOC?',
    datos: [D_CRIT, D_OPUESTOS],
    solucion: [{ texto: 'Los ángulos AOB y DOC son opuestos por el vértice: miden igual. Y cada uno queda entre los dos lados dados.', ecuacion: junto('OA = OD,   m∠AOB = m∠DOC,   OB = OC') }],
    respuesta: ['Por ', dF('LAL')] });
  EJ1.push({ nivel: 2, titulo: 'Contar tijerales',
    figura: fig(figRecta(10, 30, { ab: '10 m', u: 'm' })),
    enunciado: 'Para un tijeral se dan AB = 10 m, m∠A = 30° y BC = 6 m. La punta B queda a 5 m de la línea donde irá AC. ¿Cuántos tijerales distintos salen?',
    datos: ['C es un punto de la línea de AC que queda a 6 m de B.', 'Es el caso LLA: el ángulo A no queda entre AB y BC.'],
    solucion: [{ texto: 'La viga BC gira en B. Mide más que los 5 m que hay de B a la línea: la alcanza.', ecuacion: junto('6 m > 5 m') },
      { texto: 'Y mide menos que AB: toca la línea en dos puntos, a un lado y al otro del punto más cercano a B.', ecuacion: junto('6 m < 10 m') }],
    respuesta: ['Salen ', dF('dos'), ' tijerales distintos'] });

  EJ1.push({ nivel: 3, titulo: 'Congruentes con x',
    figura: fig(unT(porLAL(8, 6.2, 52), { A: aH('A') }, { AB: { llave: 1, color: 'o' }, AC: { texto: '3x − 4', color: 'i', dist: 6 } },
      { alt: 'Triángulo ABC con el lado AB marcado como dato, el ángulo A marcado como dato y el lado AC, que mide 3x − 4. En el triángulo DEF, el lado DF mide x + 10.', abajo: 1.2 })),
    enunciado: 'En △ABC y △DEF: AB = DE y m∠A = m∠D. Además, AC = 3x − 4 y DF = x + 10, en centímetros. Para que sean congruentes por LAL, ¿cuánto debe medir AC?',
    alternativas: ['7 cm', '14 cm', '17 cm', '21 cm', '24 cm'],
    datos: [D_CRIT],
    solucion: [{ texto: 'LAL pide que los dos lados que forman el ángulo sean iguales: ya está AB = DE; falta AC = DF.', ecuacion: [junto('3x − 4 = x + 10'), FL, junto('2x = 14'), FL, junto('x = 7')] },
      { texto: 'Piden AC, no x: reemplazo.', ecuacion: junto(['AC = 3 · 7 − 4 = ', dF('17 cm')]) },
      { texto: 'Compruebo con el otro: DF = 7 + 10 = 17 cm. Cuadra.' },
      { texto: 'Las otras salen de errores: 7 cm es x; 14 cm, 2x; 21 cm olvida restar 4; 24 cm suma 7 y 17.' }],
    respuesta: ['AC = ', dF('17 cm')] });
  EJ1.push({ nivel: 3, titulo: 'El dato que no sirve',
    figura: fig(unT(porLLL(8, 5.5, 6), {}, { AB: { llave: 1, color: 'o' }, BC: { llave: 2, color: 'i' } }, { alt: 'Triángulo ABC con los lados AB y BC marcados como dato; los dos se juntan en B. En el triángulo DEF, los lados DE y EF miden lo mismo que ellos.', abajo: 1.2 })),
    enunciado: 'En △ABC y △DEF se sabe que AB = DE y BC = EF. ¿Cuál de estos datos, agregado a esos dos, NO asegura que los triángulos sean congruentes?',
    alternativas: ['m∠B = m∠E', 'AC = DF', 'm∠B = m∠E = 90°', 'm∠A = m∠D', 'Los dos tienen el mismo perímetro'],
    datos: [D_CRIT, D_NO],
    solucion: [{ texto: 'AB y BC se juntan en B: con m∠B = m∠E hay LAL, mida lo que mida ese ángulo; también con m∠B = m∠E = 90°.' },
      { texto: 'Con AC = DF hay LLL. Y con el mismo perímetro, el tercer lado también sale igual: otra vez LLL.' },
      { texto: 'El ángulo A queda frente a BC, fuera de los dos lados dados: es LLA.' }],
    respuesta: ['No asegura: ', dF('m∠A = m∠D')] });
  EJ1.push({ nivel: 3, titulo: 'El lado que gira',
    figura: fig(figRecta(12, 30)),
    enunciado: 'Se dibuja AB = 12 cm y una recta que sale de A a 30° de AB; C va en esa recta. ¿Para cuántos valores enteros de BC, en centímetros, salen dos triángulos ABC distintos?',
    alternativas: ['5', '6', '7', '11', '12'],
    datos: ['B queda a 6 cm de esa recta, medido en perpendicular.', 'C queda en la recta, a BC de B.'],
    solucion: [{ texto: 'BC gira en B. Para tocar la recta en dos puntos tiene que medir más que lo que hay de B a ella.', ecuacion: junto('BC > 6 cm') },
      { texto: 'Y menos que AB: si no, uno de los dos puntos cae del otro lado de A, fuera del ángulo.', ecuacion: junto('BC < 12 cm') },
      { texto: 'Los enteros entre 6 y 12, sin contarlos: 7, 8, 9, 10 y 11.' },
      { texto: 'Con 6 cm o con 12 cm sale un solo triángulo. Contarlos da 6 o 7 valores; contar desde 1 da 11 o 12.' }],
    respuesta: ['Para ', dF('5'), ' valores'] });
  EJ1.push({ nivel: 3, titulo: 'Paralelas y un cruce',
    // Sin escala: a escala, BC se podría medir con regla contra los 6 cm de AB.
    figura: fig(Object.assign(figCruce(4.4, 3.5, 86, { paralelas: true, lados: { AB: '6 cm', CD: '6 cm', OB: '2x + 1', OC: 'x + 4' },
      alt: 'Sin escala: los segmentos AD y BC se cortan en O. AB y CD son paralelos y miden 6 cm cada uno. OB mide 2x + 1 y OC mide x + 4.' }), { sinEscala: true })),
    enunciado: 'AB y CD son paralelos y miden 6 cm cada uno. AD y BC se cortan en O. Si OB = 2x + 1 y OC = x + 4, en centímetros, ¿cuánto mide BC? El dibujo no está a escala.',
    alternativas: ['3 cm', '6 cm', '7 cm', '12 cm', '14 cm'],
    datos: [D_CRIT, D_ALT, D_SEIS],
    solucion: [{ texto: 'Por las paralelas, los ángulos en A y en D son alternos internos, y los de B y C también.', ecuacion: junto('m∠A = m∠D   y   m∠B = m∠C') },
      { texto: 'AB queda entre A y B; CD, entre D y C: por ALA, △AOB ≅ △DOC. OB y OC están frente a ángulos iguales.', ecuacion: [junto('2x + 1 = x + 4'), FL, junto('x = 3')] },
      { texto: 'OB = OC = 7 cm, y BC es la suma de los dos.', ecuacion: junto(['BC = 7 + 7 = ', dF('14 cm')]) },
      { texto: 'Las otras: 3 cm confunde x con una medida; 6 cm copia AB; 7 cm es solo OB; 12 cm suma AB y CD.' }],
    respuesta: ['BC = ', dF('14 cm')] });
  EJ1.push({ nivel: 3, titulo: 'El tijeral y su poste',
    figura: fig(figPoste()),
    enunciado: 'En un tijeral ABC, AB = AC. Un poste AM baja de A al punto medio M de BC. Si m∠B = 35°, ¿cuánto mide el ángulo BAM? El dibujo no está a escala.',
    alternativas: ['35°', '55°', '70°', '90°', '110°'],
    datos: [D_CRIT, D_SEIS, D_ADY, D_SUMA],
    solucion: [{ texto: 'AB = AC, BM = MC y AM es de los dos: por LLL, △ABM ≅ △ACM.' },
      { texto: 'Entonces los ángulos AMB y AMC son iguales. Juntos forman una recta: cada uno es recto.', ecuacion: junto('m∠AMB = 180° ÷ 2 = 90°') },
      { texto: 'En △ABM ya tengo dos ángulos.', ecuacion: junto(['m∠BAM = 180° − 90° − 35° = ', dF('55°')]) },
      { texto: 'Las otras: 35° copia el ángulo B; 70° lo duplica; 90° es el ángulo en M; 110° es el ángulo A entero.' }],
    respuesta: ['m∠BAM = ', dF('55°')] });

  // «Ahora tú»: cinco tipos, uno por semilla (s % 5); todos con sus datos y cuatro opciones de errores distintos.
  const TODOS = ['LAL', 'ALA', 'LLL'], NINGUNO = 'Ninguno: esos datos no bastan';
  // Qué pasaría con cada opción equivocada, según el caso de verdad: [código, siFuera].
  const SI_FUERA = {
    LAL: { ALA: ['GE-CON3', 'ALA sería con dos ángulos y el lado entre ellos; aquí hay dos lados y un ángulo.'], LLL: ['GE-CON25', 'LLL sería con los tres lados; aquí se dan dos lados y un ángulo.'], no: ['GE-CON26', 'No bastarían si el ángulo quedara fuera de los dos lados; aquí queda entre ellos.'] },
    ALA: { LAL: ['GE-CON3', 'LAL sería con dos lados y el ángulo entre ellos; aquí hay dos ángulos y un lado.'], LLL: ['GE-CON25', 'LLL sería con los tres lados; aquí se da uno solo.'], no: ['GE-CON26', 'No bastarían tres ángulos solos; aquí hay además un lado, entre los dos ángulos.'] },
    LLL: { LAL: ['GE-CON25', 'LAL lleva un ángulo; aquí los tres datos son lados.'], ALA: ['GE-CON3', 'ALA lleva dos ángulos; aquí no se da ninguno.'], no: ['GE-CON26', 'No bastarían dos lados solos; con los tres, el triángulo ya no se deforma.'] },
    LLA: { LAL: ['GE-CON1', 'Dos lados y un ángulo, sí; pero LAL pide el ángulo entre ellos, y aquí queda frente a uno.'], ALA: ['GE-CON3', 'ALA lleva dos ángulos; aquí hay uno solo.'], LLL: ['GE-CON25', 'LLL lleva tres lados; aquí hay dos lados y un ángulo.'] },
    AAA: { ALA: ['GE-CON4', 'Hay ángulos iguales, sí; pero ALA pide además un lado igual entre ellos.'], LAL: ['GE-CON25', 'LAL lleva dos lados; aquí no se da ninguno.'], LLL: ['GE-CON3', 'LLL son tres lados; aquí los tres datos son ángulos.'] },
  };
  const opsCriterio = k => {
    const bien = TODOS.includes(k) ? k : NINGUNO, sf = SI_FUERA[k];
    return [{ id: 'c', texto: bien, correcta: true }].concat(TODOS.filter(x => x !== k).map(x => ({ id: x.toLowerCase(), texto: x, error: sf[x][0], siFuera: sf[x][1] })),
      TODOS.includes(k) ? [{ id: 'no', texto: NINGUNO, error: sf.no[0], siFuera: sf.no[1] }] : []);
  };
  // Tipo 0: nombrar el criterio (o decir que no bastan), con un solo triángulo y sus datos marcados.
  function casoCriterio(r) {
    for (let i = 0; i < 400; i++) {
      const k = r.de(['LAL', 'ALA', 'LLL', 'LLA', 'AAA']);
      let P, datos, ang = {}, lados = {}, sol;
      if (k === 'LAL') {
        const c = r.ent(6, 9), b = r.ent(4, 8), a = 5 * r.ent(9, 16);
        if (b === c) continue;
        P = porLAL(c, b, a); ang = { A: aH('A', gr(a)) }; lados = { AB: { texto: cm(c), color: 'o' }, AC: { texto: cm(b), color: 'i' } };
        datos = [`AB = DE = ${cm(c)}`, `m∠A = m∠D = ${a}°`, `AC = DF = ${cm(b)}`]; sol = 'El ángulo A queda entre los lados AB y AC: lado, ángulo, lado.';
      } else if (k === 'ALA') {
        const c = r.ent(6, 9), a = 5 * r.ent(8, 14), b = 5 * r.ent(8, 14);
        if (a + b > 125 || a === b) continue;
        P = porALA(c, a, b); ang = { A: aH('A', gr(a)), B: aH('B', gr(b)) }; lados = { AB: { texto: cm(c), color: 'o' } };
        datos = [`m∠A = m∠D = ${a}°`, `AB = DE = ${cm(c)}`, `m∠B = m∠E = ${b}°`]; sol = 'El lado AB va del ángulo A al ángulo B: ángulo, lado, ángulo.';
      } else if (k === 'LLL') {
        const c = r.ent(7, 9), b = r.ent(4, 8), a = r.ent(4, 8);
        if (a + b < c + 2 || a === b) continue;
        P = porLLL(c, b, a); lados = { AB: { texto: cm(c), color: 'o' }, AC: { texto: cm(b), color: 'i' }, BC: { texto: cm(a) } };
        datos = [`AB = DE = ${cm(c)}`, `BC = EF = ${cm(a)}`, `AC = DF = ${cm(b)}`]; sol = 'Se dan los tres lados, cada uno igual a su pareja: lado, lado, lado.';
      } else if (k === 'LLA') {
        const c = r.ent(7, 9), a = 5 * r.ent(6, 9), h = c * Math.sin(a * RAD), bc = r.ent(Math.floor(h) + 1, c - 1);
        if (bc <= h + 0.4) continue;
        P = porLAL(c, c * Math.cos(a * RAD) + Math.sqrt(bc * bc - h * h), a); ang = { A: aH('A', gr(a)) }; lados = { AB: { texto: cm(c), color: 'o' }, BC: { texto: cm(bc), color: 'i' } };
        datos = [`AB = DE = ${cm(c)}`, `BC = EF = ${cm(bc)}`, `m∠A = m∠D = ${a}°`]; sol = 'El ángulo A queda frente a BC, no entre AB y BC: es LLA, y no basta.';
      } else {
        const a = 5 * r.ent(8, 14), b = 5 * r.ent(8, 14), c = 180 - a - b;
        if (c < 40 || a === b || b === c || a === c) continue;
        P = porALA(7, a, b); ang = { A: aH('A', gr(a)), B: aH('B', gr(b)), C: aH('C', gr(c)) };
        datos = [`m∠A = m∠D = ${a}°`, `m∠B = m∠E = ${b}°`, `m∠C = m∠F = ${c}°`]; sol = 'Tres ángulos y ningún lado (AAA): misma forma, pero el tamaño queda libre.';
      }
      const F = unT(P, ang, lados, { alt: `Triángulo ABC con estos datos marcados: ${datos.map(t => t.replace(/ = (m∠)?[DEF]{1,2} = /, ' = ')).join('; ')}. El triángulo DEF tiene esas mismas tres medidas.` });
      if (!cabe(F)) continue;
      return { pregunta: `En △ABC y △DEF se sabe: ${datos.join('; ')}. ¿Qué criterio asegura que son congruentes?`,
        datos: [D_CRIT, D_NO], dibujo: fig(F), opciones: opsCriterio(k),
        solucion: { texto: sol, ecuacion: junto(TODOS.includes(k) ? `△ABC ≅ △DEF por ${k}` : `${k}: no es criterio`) } };
    }
    throw new Error('casoCriterio sin caso');
  }
  // Tipo 1: con dos lados dados, qué ángulo hace falta.
  const FORMAS = [[8, 6, 55], [8, 5, 70], [7, 6, 48], [8, 7, 62]];
  function casoFalta(r) {
    const [L1, L2, V] = r.de([['AB', 'AC', 'A'], ['AB', 'BC', 'B'], ['AC', 'BC', 'C']]);
    const par = { A: 'D', B: 'E', C: 'F' }, otro = L => L.split('').map(x => par[x]).join('');
    const malo = r.de(['A', 'B', 'C'].filter(x => x !== V)), frente = ['AB', 'AC', 'BC'].find(L => !L.includes(malo));
    const [c, b, a] = r.de(FORMAS);
    const F = unT(porLAL(c, b, a), {}, { [L1]: { llave: 1, color: 'o' }, [L2]: { llave: 2, color: 'i' } },
      { alt: `Triángulo ABC con los lados ${L1} y ${L2} marcados como dato; los dos se juntan en ${V}. En el triángulo DEF, ${otro(L1)} y ${otro(L2)} miden lo mismo que ellos.`, abajo: 1.2 });
    return { pregunta: `En △ABC y △DEF se sabe que ${L1} = ${otro(L1)} y ${L2} = ${otro(L2)}. ¿Qué dato más asegura que son congruentes?`,
      datos: [D_CRIT, D_NO], dibujo: fig(F),
      opciones: [{ id: 'c', texto: `m∠${V} = m∠${par[V]}`, correcta: true },
        { id: 'frente', texto: `m∠${malo} = m∠${par[malo]}`, error: 'GE-CON1', siFuera: `Un ángulo hace falta, sí; pero ese queda frente a ${frente}, fuera de los dos lados dados: sería LLA.` },
        { id: 'cualquiera', texto: 'Cualquier pareja de ángulos iguales', error: 'GE-CON27', siFuera: 'Hace falta un ángulo, sí; pero solo sirve el que forman los dos lados dados.' },
        { id: 'basta', texto: 'Ninguno: con dos lados iguales ya basta', error: 'GE-CON5', siFuera: 'Dos lados iguales ayudan; pero entre ellos el ángulo puede abrirse o cerrarse, como la viga del juego.' }],
      solucion: { texto: `${L1} y ${L2} se juntan en ${V}; sus parejas, en ${par[V]}. Con ese ángulo igual queda LAL.`, ecuacion: junto(`m∠${V} = m∠${par[V]}`) } };
  }
  // Tipo 2: cuántos triángulos da LLA con 30° (B queda a AB/2 de la recta).
  function casoCuantos(r) {
    const c = 2 * r.ent(4, 8), h = c / 2, cat = r.ent(0, 2), bc = cat === 0 ? r.ent(2, h - 1) : cat === 1 ? h : r.ent(h + 1, c - 1);
    const TXT = ['Ninguno', 'Uno solo', 'Dos', 'Muchos: tantos como se quiera'];
    const sf = [
      { 1: ['GE-CON1', `Saldría uno solo con BC = ${h} cm justos; con ${bc} cm, la punta no llega a la recta.`], 2: ['GE-CON28', `Saldrían dos con BC entre ${h} cm y ${c} cm; con ${bc} cm no llega a la recta.`] },
      { 0: ['GE-CON2', `No saldría ninguno con BC menor que ${h} cm; con ${h} cm justos, llega.`], 2: ['GE-CON28', `Saldrían dos si BC pasara de ${h} cm; con ${h} cm justos, apenas toca la recta.`] },
      { 0: ['GE-CON2', `No saldría ninguno con BC menor que ${h} cm; con ${bc} cm, alcanza la recta.`], 1: ['GE-CON1', 'Saldría uno solo con el ángulo entre los dos lados (LAL); aquí queda frente a BC.'] },
    ][cat];
    const ops = TXT.map((t, k) => (k === cat ? { id: 'c', texto: t, correcta: true }
      : k === 3 ? { id: 'muchos', texto: t, error: 'GE-CON16', siFuera: 'El lado BC puede girar, sí; pero C tiene que caer justo en la recta.' }
        : { id: ['cero', 'uno', 'dos'][k], texto: t, error: sf[k][0], siFuera: sf[k][1] }));
    return { pregunta: `Se quiere armar un triángulo con AB = ${c} cm, m∠A = 30° y BC = ${bc} cm. ¿Cuántos triángulos distintos salen?`,
      datos: [`B queda a ${h} cm de la recta donde irá el lado AC, medido en perpendicular.`, 'C es un punto de esa recta, a BC de B.'],
      dibujo: fig(figRecta(c, 30)), opciones: ops,
      solucion: { texto: cat === 0 ? `BC mide menos que lo que hay de B a la recta: no la alcanza.` : cat === 1 ? 'BC mide justo lo que hay de B a la recta: la toca en un solo punto.'
        : 'BC pasa lo que hay de B a la recta y es menor que AB: dos puntos.', ecuacion: junto(cat === 0 ? `${bc} cm < ${h} cm` : cat === 1 ? `${bc} cm = ${h} cm` : `${h} cm < ${bc} cm < ${c} cm`) } };
  }
  // Tipo 3: el tercer dato no está escrito: un lado común o dos ángulos opuestos por el vértice.
  function casoComun(r) {
    const que = r.de(['d-LLL', 'd-LAL', 'd-ALA', 'x-LAL', 'x-ALA']), k = que.slice(2);
    let F, dados, tercero, sol, tri2;
    if (que[0] === 'd') {
      const [w, p, q] = r.de([[3, 2.4, 5], [3.2, 3, 5.4], [2.8, 2, 4.6]]);
      F = figDiagonal(w, p, q, k); tri2 = '△ABC ≅ △ADC';
      dados = k === 'LLL' ? 'AB = AD y CB = CD' : k === 'LAL' ? 'AB = AD y m∠BAC = m∠DAC' : 'm∠BAC = m∠DAC y m∠BCA = m∠DCA';
      tercero = 'el tercero es AC, que es lado de los dos triángulos';
      sol = k === 'LLL' ? 'AC es lado de los dos: con AB = AD y CB = CD, son tres lados.' : k === 'LAL' ? 'AC es lado de los dos, y el ángulo dado queda entre AB y AC.' : 'AC es lado de los dos y queda entre los dos ángulos dados.';
    } else {
      const [oa, ob, fi] = r.de([[3, 4, 70], [3.4, 4.2, 80], [3, 3.8, 64]]);
      F = k === 'LAL' ? figCruce(oa, ob, fi, { llaves: { OA: 1, OD: 1, OB: 2, OC: 2 } }) : figCruce(oa, ob, fi, { llaves: { OA: 1, OD: 1 }, ang: { A: { color: 'h' }, D: { color: 'h' } } });
      tri2 = '△AOB ≅ △DOC';
      dados = k === 'LAL' ? 'AD y BC se cortan en O, con OA = OD y OB = OC' : 'AD y BC se cortan en O, con OA = OD y m∠A = m∠D';
      tercero = 'el tercero son los ángulos en O, opuestos por el vértice';
      sol = k === 'LAL' ? 'Los ángulos en O son opuestos por el vértice y quedan entre los lados dados.' : 'Los ángulos en O son opuestos por el vértice: OA queda entre dos ángulos iguales.';
    }
    const sf = { LAL: { ALA: ['GE-CON3', 'ALA lleva dos parejas de ángulos; aquí hay dos de lados y una de ángulos.'], LLL: ['GE-CON25', 'LLL lleva tres parejas de lados; aquí una de las tres es de ángulos.'] },
      ALA: { LAL: ['GE-CON3', 'LAL lleva dos parejas de lados; aquí hay una de lados y dos de ángulos.'], LLL: ['GE-CON25', 'LLL lleva tres parejas de lados; aquí hay una sola.'] },
      LLL: { LAL: ['GE-CON25', 'LAL lleva una pareja de ángulos; aquí las tres son de lados.'], ALA: ['GE-CON3', 'ALA lleva dos parejas de ángulos; aquí no hay ninguna.'] } }[k];
    return { pregunta: `En la figura, ${dados}. ¿Por qué criterio ${tri2}?`,
      datos: [D_CRIT, D_COMUN, D_OPUESTOS], dibujo: fig(F),
      opciones: [{ id: 'c', texto: k, correcta: true }].concat(TODOS.filter(x => x !== k).map(x => ({ id: x.toLowerCase(), texto: x, error: sf[x][0], siFuera: sf[x][1] })),
        [{ id: 'no', texto: 'Ninguno: solo hay dos datos iguales', error: 'GE-CON29', siFuera: `Escritos hay dos datos, sí; ${tercero}.` }]),
      solucion: { texto: sol, ecuacion: junto(`${tri2} por ${k}`) } };
  }
  // Tipo 4 (examen): por el criterio son congruentes; la medida que falta sale de igualar dos expresiones con x.
  function casoX(r) {
    for (let i = 0; i < 400; i++) {
      const k = r.de(['LAL', 'ALA']), x = r.ent(3, 9), p = r.ent(2, 4), q = r.ent(1, 9), v = p * x - q, s = v - x;
      if (v < 6 || s < 2 || q === s) continue;
      const ex1 = `${p}x − ${q}`, ex2 = `x + ${s}`;
      const dados = k === 'LAL' ? 'AB = DE, m∠A = m∠D y AC = DF' : 'm∠A = m∠D, AB = DE y m∠B = m∠E';
      const [n1, n2] = k === 'LAL' ? ['BC', 'EF'] : ['AC', 'DF'];
      const xMal = (s - q) / (p - 1);
      const ops = opciones(v, [
        { id: 'x', valor: x, error: 'GE-CON30', siFuera: `Hallar x = ${x} está bien; falta reemplazarlo para tener ${n1}.` },
        { id: 'suma', valor: 2 * v, error: 'GE-CON31', siFuera: `Eso suma ${n1} y ${n2}; cada uno mide la mitad.` },
        { id: 'signo', valor: Number.isInteger(xMal) && xMal > 0 ? p * xMal - q : NaN, error: 'GE-TRI15', siFuera: 'Igualar las dos expresiones está bien; al pasar un número al otro lado cambia su signo.' },
        // (Auditoría del 19 nov, M14: el error de verdad, reemplazar x y olvidar el número que se resta.)
        { id: 'otro', valor: v + q, error: 'GE-TRI15', siFuera: `Reemplazar x = ${x} está bien; falta restar ${q}: ${p} · ${x} − ${q}.` },
      ], cm);
      if (ops.length < 4) continue;
      const P = porLAL(8, 6.2, 54);
      const F = k === 'LAL' ? unT(P, { A: aH('A') }, { AB: { llave: 1, color: 'o' }, AC: { llave: 2, color: 'i' }, BC: { texto: ex1 } }, { abajo: 1.2 })
        : unT(P, { A: aH('A'), B: aH('B') }, { AB: { llave: 1, color: 'o' }, AC: { texto: ex1 } }, { abajo: 1.2 });
      F.figura.alt = `Triángulo ABC con estos datos marcados: ${k === 'LAL' ? 'los lados AB y AC y el ángulo A' : 'el lado AB y los ángulos A y B'}; el lado ${n1} mide ${ex1}. En el triángulo DEF, el lado ${n2} mide ${ex2}.`;
      if (!cabe(F)) continue;
      return { pregunta: `En △ABC y △DEF: ${dados}. Además, ${n1} = ${ex1} y ${n2} = ${ex2}, en centímetros. ¿Cuánto mide ${n1}?`,
        datos: [D_CRIT, D_SEIS], dibujo: fig(F), opciones: ops,
        solucion: { texto: `Por ${k} son congruentes: ${n1} y ${n2} miden lo mismo.`, ecuacion: [junto(`${ex1} = ${ex2}`), FL, junto(`x = ${x}`), FL, junto(`${n1} = ${cm(v)}`)] } };
    }
    throw new Error('casoX sin caso');
  }

  // «La regla»: el mismo triángulo tres veces, cada vez con las tres medidas de un criterio marcadas.
  // (Dos filas: arriba LAL y ALA, abajo LLL. Así cada triángulo mide unos 135 px de ancho a 390 px; en una fila eran 85.)
  function figRegla() {
    const TR = porLAL(5, 4.2, 65), NOM = ['LAL', 'ALA', 'LLL'], no = { fino: true }, pos = [[0, 5.3], [5.7, 5.3], [2.85, 0]];
    const T = k => mover(TR, { dx: pos[k][0], dy: pos[k][1] });
    const partes = [
      tri('PQR', T(0), { letras: false, ang: { P: { color: 'h', marcas: 1, radio: 20 } }, lados: { PQ: { color: 'o' }, PR: { color: 'i' }, QR: no } }),
      tri('STU', T(1), { letras: false, ang: { S: { color: 'h', marcas: 1, radio: 20 }, T: { color: 'h', marcas: 2, radio: 20 } }, lados: { ST: { color: 'o' }, SU: no, TU: no } }),
      tri('VWX', T(2), { letras: false, lados: { VW: { color: 'o' }, VX: { color: 'i' }, WX: { grueso: true } } }),
      { puntos: NOM.map((t, k) => ({ id: `n${k}`, x: 2.5 + pos[k][0], y: pos[k][1], sinPunto: true })) }];
    return figura(partes, { alto: 290, vista: { x: [-0.3, 10.9], y: [-1.4, 9.6] }, libres: NOM.map((t, k) => ({ en: `n${k}`, dir: 270, dist: 8, texto: t })),
      alt: 'El mismo triángulo tres veces; lo que se da va con trazo grueso y lo demás, punteado. Arriba, a la izquierda, dos lados y el ángulo entre ellos: LAL. Arriba, a la derecha, un lado y los dos ángulos de sus puntas: ALA. Abajo, los tres lados: LLL.' });
  }

  const criterios = {
    id: 'criterios',
    titulo: 'Criterios de congruencia',
    pregunta: '¿Qué tres medidas bastan para copiar un triángulo?',
    temas: ['Criterios LAL, ALA y LLL'],
    pieza: GO,
    aprendizaje: 'Dos triángulos son congruentes si coinciden en LAL, ALA o LLL: tres medidas bien ubicadas fijan el triángulo; LLA y AAA no bastan.',
    actividad: 'Girar una viga hasta que tu tijeral calce sobre la silueta del modelo.',
    // Lee: qué es congruente, las seis medidas, ≅ y cómo se leen L y A. No dice cuántos tijerales da LLA (eso es la
    // predicción) ni que LAL, ALA y LLL bastan (eso es el juego y «Mira»).
    lee: {
      tarjetas: [
        { titulo: 'Tijerales iguales', texto: 'El techo de un taller descansa sobre varios tijerales, uno detrás de otro, y todos tienen que salir iguales: puesto uno sobre otro, calzan sin que sobre nada. Dos figuras así, de igual forma y tamaño, se llaman congruentes.',
          pieza: GO, dibujo: fig(figDos()) },
        { titulo: 'Seis medidas', texto: 'Un triángulo tiene seis medidas: tres lados y tres ángulos. Si △ABC y △DEF son congruentes, las seis coinciden una por una, y se escribe △ABC ≅ △DEF. Los arcos dicen qué ángulo es cuál: uno en A, dos en B y tres en C.',
          pieza: GO, dibujo: fig(figSeis()) },
        { titulo: 'L de lado, A de ángulo', texto: 'Para copiar un tijeral no hacen falta las seis medidas. Las que se pasan se nombran con letras: L es un lado y A, un ángulo. LAL se lee «lado, ángulo, lado»: el ángulo, entre los dos lados. Esa A no es el punto A.' },
        { titulo: 'Qué mirar al jugar', texto: 'Las vigas AB y AC ya están cortadas como las del modelo. Vas a girar AC alrededor de A, arrastrando la punta C o con el control. Mira cuánto mide la viga que cierra, BC, con cada ángulo.' },
      ],
    },
    ejemplos: EJ1,
    juega: {
      pieza: GO,
      consigna: 'Don Julián arma un tijeral igual al modelo marcado con tiza. Las vigas AB (8 m) y AC (5 m) ya están cortadas iguales.',
      mision: {
        texto: 'Gira la viga AC (arrastra C o usa el control) hasta que calce sobre la silueta.',
        logrado: v => v.t === T0,
        bien: 'Calza: con 60° entre las dos vigas, BC mide 7 m, igual que el modelo.',
      },
      voz: 'Abre y cierra las vigas. ¿Qué le pasa a la tercera?',
      leyenda: [
        { s: 'A, B, C', t: 'las puntas del tijeral; C se arrastra' },
        { s: dO('AB'), t: 'la viga de abajo, fija' },
        { s: dI('AC'), t: 'la viga que gira en A' },
        { s: 'BC', t: 'la viga que cierra el tijeral' },
        { s: dH('m∠A'), t: 'el ángulo entre AB y AC' },
        { s: 'silueta gris', t: 'el modelo, marcado con tiza' },
      ],
      controles: [{ id: 't', etiqueta: 'm∠A, el ángulo entre AB y AC', min: 40, max: 120, paso: 10, inicio: 100, unidad: '°', decimales: 0, color: 'c-h' }],
      dibujo: v => ({ datos: figJ(v.t), estado: {} }),
      // Gesto directo: se agarra la punta C; gira alrededor de A con la viga AC de 5 m (el lector ajusta el ángulo de 10° en 10°).
      arrastres: [{ id: 'vertice-c', etiqueta: 'punta C del tijeral: gira la viga AC alrededor de A', color: 'c-i',
        donde: v => PO.aPantalla(figJ(v.t), pC(v.t)),
        mover: (pt, v) => { const q = PO.aPlano(figJ(v.t), pt); return { t: U.grados(Math.atan2(Math.max(q[1], 0.05), q[0])) }; } }],
      // La relación entera: con ese ángulo, cuánto mide la tercera viga, junto a la del modelo.
      lectura: v => [dH(junto(`m∠A = ${v.t}°`)), junto(`: BC ${entero(largoBC(v.t)) ? '=' : '≈'} ${f(largoBC(v.t))} m`), junto('; el modelo, BC = 7 m')],
      minimo: 4,
    },
    predice: {
      pregunta: 'Don Julián dicta por teléfono otro tijeral: AB = 8 m, m∠A = 30° y BC = 5 m. Ahora la viga de 5 m es BC: va de B a la línea punteada. ¿Cuántos tijerales distintos se pueden armar con ellas?',
      datos: ['El ángulo A lo forman la viga AB y la línea punteada, donde irá la viga AC.', 'La punta B queda a 4 m de esa línea.'],
      voz: 'Es la misma viga de 5 m, pero ahora sale de B.',
      opciones: [
        { id: 'c', texto: 'Dos tijerales distintos', correcta: true },
        { id: 'uno', texto: 'Uno solo: dos lados y un ángulo fijan el triángulo', error: 'GE-CON1', siFuera: 'Sería uno con el ángulo entre las dos vigas, como en el juego; aquí el ángulo no toca a BC.' },
        { id: 'cero', texto: 'Ninguno: la viga de 5 m no alcanza', error: 'GE-CON2', siFuera: 'No alcanzaría si midiera menos de 4 m, lo que hay de B a la línea; mide 5 m.' },
        { id: 'muchos', texto: 'Muchos: la viga de 5 m puede quedar en cualquier parte', error: 'GE-CON16', siFuera: 'Puede girar alrededor de B, es cierto; pero su punta tiene que caer justo sobre la línea.' },
      ],
      dibujo: fig(LLA, { corte: 0 }),
      revelar: fig(LLA, { corte: 3 }),
      coincide: 'Coincide: al girar en B, la punta de la viga de 5 m toca la línea en dos lugares. Salen dos tijerales distintos.',
      noCoincide: 'Revisemos: al girar en B, la punta de la viga de 5 m toca la línea en dos lugares, C₁ y C₂.',
    },
    mira: {
      pieza: GO,
      datos: LLA,
      voz: 'Paso a paso: ¿en cuántos lugares puede caer la punta C?',
      pasos: [
        { estado: { corte: 0 }, texto: 'La viga AB y la línea de AC, a 30° de ella, quedan fijas.', ecuacion: junto(['AB = ', dO('8 m'), Y, 'm∠A = ', dH('30°')]) },
        { estado: { corte: 1 }, texto: 'La viga de 5 m gira en B: su punta recorre una circunferencia.', ecuacion: junto(['BC = ', dI('5 m')]) },
        { estado: { corte: 2 }, texto: 'La circunferencia corta la línea en dos puntos: C₁ y C₂.' },
        { estado: { corte: 3 }, texto: 'Salen dos tijerales distintos con las mismas tres medidas: LLA no basta.', ecuacion: junto(`AC₁ ≈ ${f(AC1)} m   y   AC₂ ≈ ${f(AC2)} m`) },
        { estado: { corte: 4 }, texto: 'Con el ángulo entre las dos vigas (LAL), C tiene un solo lugar.', ecuacion: junto([dO('8 m'), ',   ', dH('60°'), ',   ', dI('5 m'), FL, 'BC = 7 m']) },
        { estado: { corte: 5 }, texto: 'Con un lado y sus dos ángulos (ALA), las líneas se cruzan una vez.', ecuacion: junto([dH('60°'), ',   ', dO('8 m'), ',   ', dH('≈ 38°')]) },
        { estado: { corte: 6 }, texto: 'Con los tres lados (LLL), las circunferencias se cruzan arriba en un solo punto.', ecuacion: junto([dO('8 m'), ',   ', dI('5 m'), ',   7 m']) },
      ],
    },
    regla: {
      // (Auditoría del 19 nov, M5: la regla dice el caso del lado fuera de los dos ángulos y por qué LLA y AAA no bastan.)
      texto: 'Son congruentes si coinciden en LAL (el ángulo entre los dos lados), ALA (el lado entre los dos ángulos) o LLL; con dos ángulos, el tercero sale solo.',
      ecuacion: [junto('LAL, ALA o LLL'), '   ⇒   ', junto('△ABC ≅ △DEF')],
      // El lector la muestra tras «Vale si».
      condicion: 'cada medida igual, en el mismo lugar; así coinciden las seis. LLA no basta: dos lugares posibles. AAA tampoco: falta el tamaño.',
      voz: 'Antes de nombrar el criterio, mira dónde queda el ángulo.',
      // Dibujo propio (docs/teoria.md 4i): el mismo tijeral tres veces, cada vez con las tres medidas de un criterio.
      dibujo: { pieza: GO, datos: figRegla(), estado: {} },
    },
    // Así se resuelve: dos ángulos y un lado que no está entre ellos (sale ALA con el tercer ángulo), o un ángulo igual
    // que en el segundo triángulo está en otro vértice. «Ahora tú» pide otras cosas: nombrar el criterio, el dato que
    // falta, cuántos triángulos da LLA, el lado común y la medida con x.
    resuelve: {
      pieza: GO,
      generar(s) {
        const r = azar(s + 900);
        if (s % 2 === 0) {
          let a, c, b, F0, F1;
          for (let i = 0; ; i++) {
            a = 5 * r.ent(8, 14); c = 5 * r.ent(8, 14); b = 180 - a - c;
            const P = porALA(8, a, b);
            F0 = unT(P, { A: aH('A', gr(a)), C: aH('C', gr(c)) }, { AB: { texto: cm(8), color: 'o' } }, { alt: `Triángulo ABC con AB de 8 cm, un ángulo de ${a}° en A y otro de ${c}° en C. El triángulo DEF tiene esas mismas tres medidas.` });
            F1 = unT(P, { A: aH('A', gr(a)), B: aH('B', gr(b)), C: aH('C', gr(c)) }, { AB: { texto: cm(8), color: 'o' } }, { alt: `Triángulo ABC con AB de 8 cm entre un ángulo de ${a}° en A y otro de ${b}° en B; el ángulo en C mide ${c}°.` });
            // (M3: sin el caso del ejemplo «Dos ángulos y otro lado», 50° y 60°.)
            if ((b >= 45 && a !== c && a !== b && b !== c && !(a === 50 && c === 60) && cabe(F0) && cabe(F1)) || i > 300) break;
          }
          return {
            enunciado: `En △ABC y △DEF: m∠A = m∠D = ${a}°, m∠C = m∠F = ${c}° y AB = DE = 8 cm. ¿Son congruentes? ¿Por qué criterio?`,
            datos: [D_CRIT, D_SUMA],
            dibujo: fig(F0),
            pasos: [
              { tipo: 'pide', texto: 'Piden decidir si △ABC ≅ △DEF y decir con qué criterio.' },
              { tipo: 'datos', texto: 'Dos parejas de ángulos iguales y una de lados. El lado AB sale del ángulo A, pero no llega al C.' },
              { tipo: 'regla', texto: 'Con dos ángulos sirve ALA, si el lado está entre ellos. Y dos ángulos fijan el tercero: los tres suman 180°.', ecuacion: junto('m∠A + m∠B + m∠C = 180°') },
              { tipo: 'cuentas', texto: 'Saco el tercer ángulo. Sale el mismo en los dos triángulos, porque los otros dos son iguales.', ecuacion: junto(['m∠B = m∠E = ', `180° − ${a}° − ${c}° = `, dF(`${b}°`)]), dibujo: fig(F1) },
              { tipo: 'aplica', texto: 'Ahora AB queda entre los ángulos A y B, y DE entre D y E: ángulo, lado, ángulo.' },
              { tipo: 'sentido', texto: 'Tiene sentido: dos ángulos iguales dan la misma forma, y un lado igual en el mismo lugar fija el tamaño.' },
            ],
            respuesta: ['Sí, por ', dF('ALA'), junto(`, con m∠B = m∠E = ${b}°`)],
          };
        }
        let c, b, a, F;
        for (let i = 0; ; i++) {
          c = r.ent(5, 8); b = c + r.ent(2, 4); a = 5 * r.ent(8, 13);
          F = unT(porLAL(c, b, a), { A: aH('A', gr(a)) }, { AB: { texto: cm(c), color: 'o' }, AC: { texto: cm(b), color: 'i' } }, { alt: `Triángulo ABC con AB de ${c} cm y AC de ${b} cm, que forman un ángulo de ${a}° en A. El triángulo DEF no se dibuja.` });
          if (cabe(F) || i > 300) break;
        }
        return {
          enunciado: `En △ABC: AB = ${c} cm, AC = ${b} cm y m∠A = ${a}°. En △DEF: DE = ${c} cm, DF = ${b} cm y m∠E = ${a}°. ¿Asegura LAL que son congruentes?`,
          datos: [D_CRIT, D_NO],
          dibujo: fig(F),
          pasos: [
            { tipo: 'pide', texto: 'Piden decidir si esos datos aseguran la congruencia por LAL.' },
            { tipo: 'datos', texto: `Dos lados de uno miden lo mismo que dos del otro, y hay un ángulo de ${a}° en cada triángulo: en A y en E.` },
            { tipo: 'regla', texto: 'LAL pide que el ángulo igual sea el que forman los dos lados iguales, en los dos triángulos.' },
            { tipo: 'aplica', texto: 'En △ABC, AB y AC forman el ángulo A: bien. En △DEF, DE y DF forman el ángulo D, y el dato es el ángulo E.' },
            { tipo: 'sentido', texto: 'El ángulo E queda frente a DF, no entre DE y DF: en △DEF los datos son lado, lado, ángulo (LLA).' },
          ],
          respuesta: [dF('No'), ': en △DEF el ángulo dado no está entre DE y DF'],
        };
      },
    },
    ahoraTu: {
      pieza: GO,
      voz: 'Ubica primero cada dato: ¿qué lado toca a qué ángulo?',
      generar(s) { return conCuatro([casoCriterio, casoFalta, casoCuantos, casoComun, casoX][s % 5], azar(s + 7), firmasDe(EJ1)); },
    },
  };

  // ---------- Idea 2 (fase 3, 19 nov): lados y ángulos correspondientes ----------
  // Objeto de la primera pantalla: dos banderines de tela cortados con el mismo molde, sobre la mesa de costura (geo-objeto,
  // armazon de tipo 'costura'; dibujo de prueba). Lados de 24 cm, 15 cm y 21 cm (60°, unos 38° y unos 82°: el tijeral
  // 8-5-7 por 3). Cambia: el giro y la cara del banderín DEF. · Permanece: el banderín ABC y los arcos de cada ángulo.
  // · Progresa: qué punta de DEF cae sobre cada punta de ABC. · Se reserva: el lado que mide lo mismo que otro (la
  // predicción y «Mira»). · Debe verse: frente a ángulos iguales quedan lados iguales, estén donde estén.
  // Colores (propuesta §6): en esta idea los lados van en tinta, con su medida (si las parejas compartieran color, el
  // color daría la respuesta); los ángulos, en carmín con 1, 2 o 3 arcos; lo pedido, «?» en tinta.
  const BAN = porLLL(24, 15, 21), CEN = [(BAN[0][0] + BAN[1][0] + BAN[2][0]) / 3, (BAN[0][1] + BAN[1][1] + BAN[2][1]) / 3];
  const GIRO_OK = 60, SEP = 39, V2 = { x: [-3, 66], y: [CEN[1] - 16.5, CEN[1] + 16.5] };
  const arcos3 = ids => Object.fromEntries(ids.split('').map((v, k) => [v, { color: 'h', marcas: k + 1, radio: 15 }]));
  // El banderín suelto: el modelo, volteado si está «de frente», girado y corrido a la derecha.
  const copia = (giro, cara) => BAN.map(p => {
    const x0 = p[0] - CEN[0], y0 = (cara === 'vuelta' ? 1 : -1) * (p[1] - CEN[1]), t = (giro - GIRO_OK) * RAD;
    return [CEN[0] + SEP + x0 * Math.cos(t) - y0 * Math.sin(t), CEN[1] + x0 * Math.sin(t) + y0 * Math.cos(t)];
  });
  const calza = v => v.giro === GIRO_OK && v.cara === 'vuelta';
  // La tela: cada triángulo de la figura va con su pieza de papel (tela) sobre la mesa de costura.
  const tela = (F, piezas) => Object.assign(F, { objeto: 'armazon', tipo: 'costura', papel: piezas });
  const figBan = (giro, cara, o = {}) => tela(figura([tri('ABC', BAN, { ang: arcos3('ABC'), lados: o.lados || {} }), tri(o.nombres || 'DEF', copia(giro, cara), { ang: arcos3(o.nombres || 'DEF'), lados: o.lados2 || {} })],
    { vista: V2, alto: 190, alt: o.alt || `Dos banderines de tela del mismo molde sobre la mesa de costura, ABC y DEF, con uno, dos y tres arcos en sus ángulos. El segundo está ${cara === 'vuelta' ? '' : 'volteado y '}girado ${f((giro - GIRO_OK + 360) % 360)}° respecto del primero${calza({ giro, cara }) ? ': quedó igual que él' : ''}.` }),
  [['A', 'B', 'C'], (o.nombres || 'DEF').split('')]);
  // Qué punta de DEF queda sobre cada punta de ABC si se lleva el banderín suelto encima del otro (la pareja de menor
  // distancia total entre las seis posibles).
  const PERM6 = ['DEF', 'DFE', 'EDF', 'EFD', 'FDE', 'FED'];
  function encima(v) {
    const Q = copia(v.giro, v.cara).map(p => [p[0] - SEP, p[1]]), idx = { D: 0, E: 1, F: 2 };
    let mejor = null, dm = Infinity;
    for (const p of PERM6) { const d = [0, 1, 2].reduce((s, k) => s + U.dist(BAN[k], Q[idx[p[k]]]), 0); if (d < dm - 1e-9) { dm = d; mejor = p; } }
    return mejor;
  }
  // Predicción: en la copia, el ángulo de tres arcos es D (△ABC ≅ △EFD) y el lado de abajo es DF.
  const GIRO_P = GIRO_OK - U.angulo(BAN[1], BAN[2], BAN[0]);
  const figPred2 = (o = {}) => {
    const F = figBan(GIRO_P, 'frente', { nombres: 'EFD', lados: o.sinAB ? {} : { AB: { texto: '24 cm', dist: 6 } }, lados2: o.lados2 });
    F.figura.alt = o.alt || 'Dos banderines congruentes en distinta posición. En el banderín ABC, el lado AB, de 24 cm, queda frente al ángulo C, de tres arcos. En el banderín DEF, girado y volteado, el ángulo de tres arcos está en D.';
    return F;
  };
  // «Mira»: el mismo dibujo, con el lado de enfrente de D marcado con «?» y después con su medida.
  const MIRA2 = (() => {
    const F = figPred2({ sinAB: true, alt: 'Los dos banderines congruentes. En ABC, el lado de 24 cm queda frente al ángulo C, de tres arcos. En DEF, el ángulo de tres arcos es D y el lado de enfrente, EF, mide también 24 cm.' });
    F.ladosRot = (F.ladosRot || []).concat({ de: 'A', a: 'B', ref: 'C', texto: '24 cm', dist: 6, desde: 1 }, { de: 'E', a: 'F', ref: 'D', texto: '?', dist: 6, desde: 2, hasta: 3 }, { de: 'E', a: 'F', ref: 'D', texto: '24 cm', dist: 6, desde: 4 });
    return F;
  })();

  // La regla de la idea: el par del juego (D, E y F con uno, dos y tres arcos, como A, B y C), con AB = DE = 24 cm: la
  // misma congruencia que escribe la ecuación, △ABC ≅ △DEF.
  const FIG_REGLA2 = (() => {
    const F = figBan(150, 'frente', { lados: { AB: { texto: '24 cm', dist: 6 } }, lados2: { DE: { texto: '24 cm', dist: 6 } } });
    F.figura.alt = 'Los dos banderines del mismo molde, ABC y DEF: A y D con un arco, B y E con dos, C y F con tres. Frente a C, AB mide 24 cm; frente a F, DE también mide 24 cm.';
    return F;
  })();

  // Dos triángulos congruentes: ABC (puntos P) y su copia movida (giro, espejo, dx, dy), con los nombres nom (la imagen de
  // A, B y C, en ese orden). o.ang1 / o.ang2: los ángulos de cada uno (claves: letras); o.lados1 / o.lados2: sus lados.
  function dosTri(P, nom, mov, o = {}) {
    return figura([tri('ABC', P, { ang: o.ang1 || {}, lados: o.lados1 || {} }), tri(nom, mover(P, mov), { ang: o.ang2 || {}, lados: o.lados2 || {} })], Object.assign({ alto: 210 }, o.fig || {}));
  }
  // Arcos de las parejas: el ángulo de ABC con k arcos y su pareja en la copia (la k-ésima letra de nom) con los mismos.
  const arcosDe = (nom, texto = {}) => ({ ang1: Object.fromEntries(['A', 'B', 'C'].map((v, k) => [v, Object.assign({ color: 'h', marcas: k + 1, radio: 15 }, texto[v] !== undefined ? { texto: texto[v] } : {})])),
    ang2: Object.fromEntries(nom.split('').map((v, k) => [v, Object.assign({ color: 'h', marcas: k + 1, radio: 15 }, texto[v] !== undefined ? { texto: texto[v] } : {})])) });
  // El lado de ABC que está «en el mismo lugar del dibujo» que un lado de la copia (por la dirección de su punto medio
  // desde el centro de su triángulo): el error GE-CON17.
  function mismoLugar(P, Q, nom, lado2) {
    const cen = T => [(T[0][0] + T[1][0] + T[2][0]) / 3, (T[0][1] + T[1][1] + T[2][1]) / 3];
    const dir = (T, i, j) => { const c = cen(T), m = U.medio(T[i], T[j]); return Math.atan2(m[1] - c[1], m[0] - c[0]); };
    const i2 = nom.indexOf(lado2[0]), j2 = nom.indexOf(lado2[1]), d2 = dir(Q, i2, j2);
    let mejor = null, dm = Infinity;
    for (const [i, j] of [[0, 1], [1, 2], [0, 2]]) { const d = Math.abs(Math.atan2(Math.sin(dir(P, i, j) - d2), Math.cos(dir(P, i, j) - d2))); if (d < dm) { dm = d; mejor = 'ABC'[i] + 'ABC'[j]; } }
    return mejor;
  }
  const parDe = (nom, L) => L.split('').map(x => nom['ABC'.indexOf(x)]).join('');   // el lado de la copia que va con L
  const deParDe = (nom, L2) => L2.split('').map(x => 'ABC'[nom.indexOf(x)]).join('');
  const ordenar = L => L.split('').sort().join('');
  const opuesto = L => 'ABC'.split('').find(x => !L.includes(x));
  const D_PAR = 'En triángulos congruentes, frente a ángulos iguales hay lados iguales, y frente a lados iguales, ángulos iguales.';
  const D_ORDEN = 'En △ABC ≅ △DEF las letras van en orden: A con D, B con E y C con F.';
  const D_ORDEN2 = 'En una congruencia escrita, las letras van en orden: primera con primera, segunda con segunda, tercera con tercera.';
  const D_ARCOS = 'Los ángulos con la misma cantidad de arcos miden igual; los lados con las mismas rayitas, también.';
  const D_ISO = 'En un triángulo isósceles, los ángulos de la base miden igual.';
  const FORMAS2 = [[9, 7, 6], [8, 6, 7], [10, 7, 8], [9, 8, 5], [8, 5, 7]];   // AB, AC, BC (cm)
  const MOV2 = [{ giro: 180, espejo: false }, { giro: 120, espejo: true }, { giro: 200, espejo: true }, { giro: 70, espejo: false }, { giro: 250, espejo: false }, { giro: 0, espejo: true }];
  // Coloca la copia a la derecha del modelo, sin tocarlo.
  function aLaDerecha(P, m) {
    const Q = mover(P, m), x1 = Math.max(...P.map(p => p[0])), q0 = Math.min(...Q.map(p => p[0])), cy = (Math.min(...P.map(p => p[1])) + Math.max(...P.map(p => p[1]))) / 2, qy = (Math.min(...Q.map(p => p[1])) + Math.max(...Q.map(p => p[1]))) / 2;
    return Object.assign({}, m, { dx: x1 - q0 + (m.sep || 3), dy: cy - qy });
  }

  // Tipo 0 de «Ahora tú»: la congruencia escrita en otro orden; el lado que va con otro (sin figura: lo dicen las letras).
  function casoOrden(r) {
    for (let i = 0; i < 400; i++) {
      const perm = r.de(PERM6.slice(1)), c = r.ent(6, 12), a = r.ent(5, 11), b = r.ent(4, 10);
      if (new Set([a, b, c]).size < 3 || a + b <= c || a + c <= b || b + c <= a) continue;
      const med = { AB: c, BC: a, AC: b };
      const corr = { [ordenar(perm[0] + perm[1])]: 'AB', [ordenar(perm[1] + perm[2])]: 'BC', [ordenar(perm[0] + perm[2])]: 'AC' };
      const alfa = { DE: 'AB', EF: 'BC', DF: 'AC' }, pide = r.de(['DE', 'EF', 'DF']);
      if (corr[pide] === alfa[pide]) continue;
      const tercero = ['AB', 'BC', 'AC'].find(L => L !== corr[pide] && L !== alfa[pide]);
      return { pregunta: `△ABC ≅ △${perm}, con AB = ${c} cm, BC = ${a} cm y AC = ${b} cm. ¿Cuánto mide ${pide}?`,
        datos: [D_ORDEN2],
        opciones: [{ id: 'c', texto: `${med[corr[pide]]} cm`, correcta: true },
          { id: 'alfa', texto: `${med[alfa[pide]]} cm`, error: 'GE-CON3', siFuera: `Eso mide ${alfa[pide]}; ${pide} iría con ${alfa[pide]} si la congruencia fuera △ABC ≅ △DEF.` },
          { id: 'otro', texto: `${med[tercero]} cm`, error: 'GE-CON32', siFuera: `Eso mide ${tercero}; busca qué letras de △ABC están en el lugar de las de ${pide}.` },
          { id: 'nose', texto: 'No se puede saber sin la figura', error: 'GE-CON18', siFuera: 'Haría falta la figura si la congruencia no dijera el orden; el orden de las letras ya lo dice.' }],
        solucion: { texto: `Por el orden de las letras, ${pide} va con ${corr[pide]}: miden lo mismo.`, ecuacion: junto(`${pide} = ${corr[pide]} = ${med[corr[pide]]} cm`) } };
    }
    throw new Error('casoOrden sin caso');
  }
  // Tipo 1: dos triángulos congruentes en distinta posición, con sus arcos; el lado de la copia frente a un ángulo.
  function casoFrente(r) {
    for (let i = 0; i < 400; i++) {
      const [c, b, a] = r.de(FORMAS2), nom = r.de(PERM6), m = r.de(MOV2), P = porLLL(c, b, a), mov = aLaDerecha(P, Object.assign({ sep: 4.5 }, m)), Q = mover(P, mov);
      const k = r.ent(0, 2), V = 'ABC'[k], L = ['BC', 'AC', 'AB'][k], L2 = parDe(nom, L), med = { AB: c, AC: b, BC: a };
      const lugar = mismoLugar(P, Q, nom, L2);
      if (ordenar(lugar) === ordenar(L)) continue;
      const otro = ['AB', 'AC', 'BC'].find(x => x !== L && ordenar(x) !== ordenar(lugar));
      const F = dosTri(P, nom, mov, Object.assign(arcosDe(nom), { lados1: { AB: { texto: cm(c), dist: 5 }, AC: { texto: cm(b), dist: 5 }, BC: { texto: cm(a), dist: 5 } },
        lados2: { [L2]: { texto: '?', dist: 5 } }, fig: { alt: `Dos triángulos congruentes en distinta posición, ABC y ${nom.split('').join('')}, con uno, dos y tres arcos en sus ángulos. ABC tiene lados AB = ${cm(c)}, AC = ${cm(b)} y BC = ${cm(a)}. En el otro, el lado ${L2} lleva «?».` } }));
      if (!cabe(F)) continue;
      const nArc = k + 1, arcTxt = ['un arco', 'dos arcos', 'tres arcos'][k];
      return { pregunta: `Los triángulos ABC y ${nom.split('').sort().join('')} son congruentes; los arcos marcan los ángulos iguales. ¿Cuánto mide ${ordenar(L2)}?`,
        datos: [D_ARCOS, D_PAR], dibujo: fig(F),
        opciones: [{ id: 'c', texto: cm(med[L]), correcta: true },
          { id: 'lugar', texto: cm(med[ordenar(lugar)] || med[lugar]), error: 'GE-CON17', siFuera: `Está en el mismo lugar del dibujo, sí; pero el triángulo está ${m.espejo ? 'volteado y ' : ''}girado: manda el ángulo de enfrente.` },
          { id: 'junto', texto: cm(med[otro]), error: 'GE-CON33', siFuera: `Ese lado llega al ángulo de ${arcTxt}; el que va con ${ordenar(L2)} es el de enfrente de ese ángulo.` },
          { id: 'nose', texto: 'No se sabe sin medir', error: 'GE-CON18', siFuera: 'Haría falta medir si no fueran congruentes; los arcos ya dicen las parejas.' }],
        solucion: { texto: `${ordenar(L2)} queda frente al ángulo de ${arcTxt}, ${nom[k]}. En ABC, frente a ${V} (${arcTxt}) está ${L}.`, ecuacion: junto(`${ordenar(L2)} = ${L} = ${cm(med[L])}`) }, _n: nArc };
    }
    throw new Error('casoFrente sin caso');
  }
  // Tipo 2: frente a lados iguales, ángulos iguales. ABC con dos ángulos dados y los lados con 1, 2 o 3 rayitas; se pide
  // el ángulo de la copia frente a un lado (a veces es el tercero: sale de la suma de 180°).
  function casoAngulo(r) {
    for (let i = 0; i < 400; i++) {
      const A = 5 * r.ent(8, 16), B = 5 * r.ent(8, 16), Cg = 180 - A - B;
      if (Cg < 35 || new Set([A, B, Cg]).size < 3) continue;
      const P0 = porALA(8, A, B), nom = r.de(PERM6), m = r.de(MOV2);
      const val = { A, B, C: Cg }, dados = r.de([['A', 'B'], ['A', 'C'], ['B', 'C']]), k = r.ent(0, 2), V = 'ABC'[k], V2 = nom[k];
      // (Auditoría del 19 nov, M2: si lo pedido es la pareja del ángulo que no se da, el dibujo va con otros ángulos y sin
      // escala: si no, se mediría con transportador.)
      const sinEsc = !dados.includes(V), P = sinEsc ? porALA(8, A <= 70 ? A + 15 : A - 15, B <= 70 ? B + 10 : B - 10) : P0, mov = aLaDerecha(P, m), Q = mover(P, mov);
      const lad = { AB: U.dist(P[0], P[1]), AC: U.dist(P[0], P[2]), BC: U.dist(P[1], P[2]) };
      const orden = Object.keys(lad).sort((x, y) => lad[x] - lad[y]), raya = Object.fromEntries(orden.map((L, k) => [L, k + 1]));
      const L = ['BC', 'AC', 'AB'][k], L2 = parDe(nom, L);
      const ang1 = Object.fromEntries(dados.map(v => [v, { color: 'h', texto: gr(val[v]), radio: 18, marcas: 1 }]));
      const lados1 = Object.fromEntries(Object.keys(raya).map(x => [x, { llave: raya[x] }])), lados2 = Object.fromEntries(Object.keys(raya).map(x => [parDe(nom, x), { llave: raya[x] }]));
      const F = dosTri(P, nom, mov, { ang1, ang2: { [V2]: { texto: '?', radio: 18 } }, lados1, lados2, fig: { alt: `Dos triángulos congruentes en distinta posición, ABC y el otro, con sus lados marcados con una, dos y tres rayitas: lados con las mismas rayitas miden igual. En ABC, ${dados.map(v => `m∠${v} = ${val[v]}°`).join(' y ')}. En el otro, el ángulo ${V2} lleva «?».`, mx: 1.6 } });
      if (sinEsc) F.sinEscala = true;
      if (!cabe(F)) continue;
      const lugarV = (() => { const L0 = mismoLugar(P, Q, nom, ordenar(L2)); return opuesto(ordenar(L0)); })();
      const resto = ['A', 'B', 'C'].filter(v => v !== V);
      const malJunto = dados.includes(resto[0]) ? resto[0] : resto[1];
      const opts = [{ id: 'c', texto: gr(val[V]), correcta: true }];
      const usados = new Set([val[V]]);
      const pon = (id, valor, error, siFuera) => { if (!usados.has(valor) && valor > 0 && valor < 180) { usados.add(valor); opts.push({ id, texto: gr(valor), error, siFuera }); } };
      if (lugarV !== V) pon('lugar', val[lugarV], 'GE-CON17', 'Está en el mismo lugar del dibujo, sí; pero manda el lado de enfrente, con sus rayitas.');
      pon('junto', val[malJunto], 'GE-CON33', `Ese ángulo toca el lado ${ordenar(L2)}; el que va con ${V2} está frente al lado de las mismas rayitas.`);
      pon('suple', 180 - val[V], 'GE-CON34', 'Buscar la pareja está bien; pero el ángulo igual mide lo mismo, no lo que le falta para 180°.');
      pon('suma', dados.reduce((s, v) => s + val[v], 0), 'GE-TRI5', 'Sumar está bien para el tercer ángulo; pero falta restarle esa suma a 180°.');
      if (opts.length < 4 || new Set(opts.map(o => o.error).filter(Boolean)).size < 3) continue;
      return { pregunta: `Los triángulos ABC y ${nom.split('').sort().join('')} son congruentes; las rayitas marcan los lados iguales. En ABC, ${dados.map(v => `m∠${v} = ${val[v]}°`).join(' y ')}. ¿Cuánto mide el ángulo ${V2}?${sinEsc ? NO_ESC : ''}`,
        datos: [D_ARCOS, D_PAR, D_SUMA], dibujo: fig(F), opciones: opts.slice(0, 4),
        solucion: { texto: `${V2} queda frente a ${ordenar(L2)}; su pareja en ABC es ${L}, frente a ${V}.${dados.includes(V) ? '' : ` m∠${V} = 180° − ${dados.map(v => `${val[v]}°`).join(' − ')}.`}`, ecuacion: junto(`m∠${V2} = m∠${V} = ${val[V]}°`) } };
    }
    throw new Error('casoAngulo sin caso');
  }
  // Tipo 3 (examen): dos segmentos que se cruzan en O (opuestos por el vértice y LAL); el lado que va con otro, con x.
  function casoCruce(r) {
    for (let i = 0; i < 400; i++) {
      const x = r.ent(3, 9), p = r.ent(2, 4), q = r.ent(1, 9), v = p * x - q, s = v - x;
      if (v < 6 || s < 2 || q === s || v > 30) continue;
      const ex1 = `${p}x − ${q}`, ex2 = `x + ${s}`, [oa, ob, fi] = r.de([[3, 4, 70], [3.4, 4.2, 80], [3, 3.8, 64]]);
      const F = figCruce(oa, ob, fi, { llaves: { OA: 1, OD: 1, OB: 2, OC: 2 }, lados: { AB: ex1, CD: ex2 }, alt: `Los segmentos AD y BC se cortan en O, con OA = OD y OB = OC. El lado AB mide ${ex1} y el lado CD, ${ex2}.` });
      if (!PO.escenaCabe(F)) continue;
      const ops = opciones(v, [
        { id: 'x', valor: x, error: 'GE-CON30', siFuera: `Hallar x = ${x} está bien; falta reemplazarlo para tener AB.` },
        { id: 'suma', valor: 2 * v, error: 'GE-CON31', siFuera: 'Eso suma AB y CD; cada uno mide la mitad.' },
        // (Auditoría del 19 nov, M14: el error de verdad, reemplazar x y olvidar el número que se resta.)
        { id: 'otro', valor: v + q, error: 'GE-TRI15', siFuera: `Reemplazar x = ${x} está bien; falta restar ${q}: ${p} · ${x} − ${q}.` },
        { id: 'signo', valor: p * ((s - q) / (p - 1)) - q, error: 'GE-TRI15', siFuera: 'Igualar está bien; al pasar un número al otro lado cambia su signo.' },
      ].filter(d => Number.isInteger(d.valor)), cm);
      if (ops.length < 4) continue;
      return { pregunta: `AD y BC se cortan en O, con OA = OD y OB = OC. Si AB = ${ex1} y CD = ${ex2}, en centímetros, ¿cuánto mide AB?`,
        datos: [D_CRIT, D_OPUESTOS, D_PAR], dibujo: fig(F), opciones: ops,
        solucion: { texto: 'Por LAL (los ángulos en O son opuestos), △AOB ≅ △DOC. AB y CD quedan frente a esos ángulos: miden igual.', ecuacion: [junto(`${ex1} = ${ex2}`), FL, junto(`x = ${x}`), FL, junto(`AB = ${cm(v)}`)] } };
    }
    throw new Error('casoCruce sin caso');
  }
  // Tipo 4 (examen, como San Marcos 2022 y 2025-I): un isósceles ABC (AB = AC) con D y E en BC, BD = CE. △ABD ≅ △ACE
  // (LAL) da AD = AE: △ADE también es isósceles. Con m∠DAE se pide m∠ADE.
  function figIsoDE(b, h, d, o = {}) {
    const P = { A: [0, h], B: [-b, 0], C: [b, 0], D: [-b + d, 0], E: [b - d, 0] };
    const pt = (id, lado) => ({ id, x: P[id][0], y: P[id][1], rotulo: id, lado, sinPunto: true });
    const fg = { alt: o.alt, alto: o.alto || 220, vista: { x: [-b - 0.18 * b, b + 0.18 * b], y: [-0.45 * h, h + 0.16 * h] },
      puntos: [pt('A', 90), pt('B', 200), pt('C', -20), pt('D', -90), pt('E', -90)],
      segmentos: [{ de: 'A', a: 'B' }, { de: 'A', a: 'C' }, { de: 'B', a: 'C' }, { de: 'A', a: 'D' }, { de: 'A', a: 'E' }],
      angulos: (o.ang || []).map(a => Object.assign({ radio: 22, holgura: 6, marcas: 1, mide: U.angulo(P[a.en], P[a.de], P[a.a]) }, a)) };
    return Object.assign({ objeto: 'angulos', figura: fg, llaves: [{ de: 'A', a: 'B', marcas: 1, ref: 'C' }, { de: 'A', a: 'C', marcas: 1, ref: 'B' }, { de: 'B', a: 'D', marcas: 2, ref: 'A', dist: 9 }, { de: 'E', a: 'C', marcas: 2, ref: 'A', dist: 9 }] }, o.sinEscala ? { sinEscala: true } : {});
  }
  function casoIso(r) {
    for (let i = 0; i < 400; i++) {
      const t = 10 * r.ent(2, 8), x = (180 - t) / 2;
      // A escala: AD = AE con ∠DAE = t. Se toma h = 4 y la base del isósceles más ancha que DE.
      // (M2: se dibuja con otro ángulo en A, para que ADE no se mida con transportador.)
      const h = 4, e = h * Math.tan((t <= 40 ? t + 30 : t - 30) / 2 * RAD), b = e + r.de([1.6, 2.2, 2.8]);
      const F = figIsoDE(b, h, b - e, { ang: [{ en: 'A', de: 'D', a: 'E', texto: gr(t), color: 'h', radio: 26 }, { en: 'D', de: 'E', a: 'A', texto: '?', radio: 20 }],
        alt: `Triángulo isósceles ABC con AB = AC; D y E están en BC, con BD = EC. El ángulo DAE mide ${t}° y el ángulo ADE lleva «?».` });
      if (!cabe(F)) continue;
      const ops = opciones(x, [
        { id: 'copia', valor: t, error: 'GE-CON35', siFuera: `Ver D y E iguales está bien; pero ${t}° es el ángulo de A, no el de D.` },
        { id: 'exterior', valor: 180 - x, error: 'GE-CON34', siFuera: `Hallar ${x}° en △ADE está bien; ${180 - x}° es su vecino, el ángulo ADB.` },
        { id: 'mitad', valor: t / 2, error: 'GE-CON36', siFuera: 'Partir en dos está bien en un isósceles; pero se parte lo que falta para 180°, no el ángulo A.' },
        { id: 'resta', valor: 180 - t, error: 'GE-TRI5', siFuera: `Restar de 180° está bien; ${180 - t}° es lo que suman los dos iguales: falta partirlo.` },
      ], gr);
      if (ops.length < 4) continue;
      F.sinEscala = true;
      return { pregunta: `En el triángulo ABC, AB = AC. D y E están en BC, con BD = EC. Si m∠DAE = ${t}°, ¿cuánto mide el ángulo ADE?${NO_ESC}`,
        datos: [D_CRIT, D_ISO, D_PAR, D_SUMA], dibujo: fig(F), opciones: ops,
        solucion: { texto: 'Por LAL (AB = AC, m∠B = m∠C, BD = CE), △ABD ≅ △ACE: AD = AE, y △ADE es isósceles.', ecuacion: junto(`m∠ADE = (180° − ${t}°) ÷ 2 = ${gr(x)}`) } };
    }
    throw new Error('casoIso sin caso');
  }

  // Ejemplos resueltos de «Lados y ángulos correspondientes» (molde §3). Cuentas rehechas aparte (scratchpad
  // e5-geometria/cuentas2.py): las parejas por el orden de las letras y por los arcos; 2x + 3 = 15, x = 6; 7 + 9 + 8 =
  // 24; 3x − 2 = x + 8, x = 5, AB = 13 cm; (180 − 30) ÷ 2 = 75; 35° + 50° = 85°; AD = 2 · 4 = 8 y 7 + 9 + 8 = 24 cm;
  // m∠APH = 90 − 65 = 25 y 2 · 25 = 50°. La figura trae los datos; lo pedido, con «?» en tinta.
  const P_B = porLLL(8, 5, 7);
  const EJ2 = [];
  EJ2.push({ nivel: 1, titulo: 'El orden de las letras',
    enunciado: '△ABC ≅ △DEF. Si BC = 21 cm, ¿cuánto mide EF?',
    datos: [D_ORDEN],
    solucion: [{ texto: 'B va con E y C va con F: el lado BC va con el lado EF.', ecuacion: junto('EF = BC') }],
    respuesta: ['EF = ', dF('21 cm')] });
  EJ2.push({ nivel: 1, titulo: 'Otro orden',
    enunciado: '△ABC ≅ △EDF. ¿Qué lado de △EDF mide lo mismo que AB?',
    datos: [D_ORDEN2],
    solucion: [{ texto: 'A va con E y B va con D: el lado AB va con el lado ED, aunque no sea el de las primeras letras del abecedario.', ecuacion: junto('A ↔ E,   B ↔ D') }],
    respuesta: ['El lado ', dF('ED')] });
  EJ2.push({ nivel: 1, titulo: 'El ángulo que le toca',
    enunciado: '△ABC ≅ △DEF y m∠B = 70°. ¿Cuánto mide el ángulo E?',
    datos: [D_ORDEN],
    solucion: [{ texto: 'B es la segunda letra de △ABC y E, la segunda de △DEF: son ángulos correspondientes.', ecuacion: junto('m∠E = m∠B') }],
    respuesta: ['m∠E = ', dF('70°')] });
  EJ2.push({ nivel: 1, titulo: 'Frente al ángulo',
    figura: fig((() => { const F = figBan(GIRO_P, 'frente', { nombres: 'EFD', lados: { AC: { texto: '15 cm', dist: 6 } }, lados2: { DE: { texto: '?', dist: 6 } } });
      F.figura.alt = 'Dos banderines de tela del mismo molde en distinta posición, con uno, dos y tres arcos en sus ángulos. En ABC, el lado AC mide 15 cm y queda frente al ángulo B, de dos arcos. En DEF, el lado DE lleva «?».'; return F; })()),
    enunciado: 'Rosa cortó dos banderines con el mismo molde. En el primero, AC = 15 cm. ¿Cuánto mide DE en el segundo?',
    datos: [D_ARCOS],
    solucion: [{ texto: 'AC queda frente al ángulo B, de dos arcos. En el segundo, el de dos arcos es F, y frente a F está DE.' }],
    respuesta: ['DE = ', dF('15 cm')] });
  EJ2.push({ nivel: 1, titulo: 'Frente al lado',
    figura: fig((() => { const P = porALA(8, 70, 50), mov = aLaDerecha(P, { giro: 180 }), nom = 'DEF';
      const F = dosTri(P, nom, mov, { ang1: { C: { color: 'h', texto: '60°', radio: 18 } }, ang2: { F: { texto: '?', radio: 18 } }, lados1: { AB: { llave: 3 }, AC: { llave: 2 }, BC: { llave: 1 } }, lados2: { DE: { llave: 3 }, DF: { llave: 2 }, EF: { llave: 1 } },
        fig: { mx: 1.6, alt: 'Dos triángulos congruentes, ABC y DEF, el segundo dado vuelta. Sus lados llevan una, dos y tres rayitas: AB y DE tres, AC y DF dos, BC y EF una. En ABC, el ángulo C mide 60°; en DEF, el ángulo F lleva «?».' } });
      return F; })()),
    enunciado: 'En la figura, los lados con las mismas rayitas miden igual. Si m∠C = 60°, ¿cuánto mide el ángulo F?',
    datos: [D_ARCOS, D_PAR],
    solucion: [{ texto: 'C queda frente a AB, de tres rayitas. En DEF, el lado de tres rayitas es DE, y frente a DE está F.' }],
    respuesta: ['m∠F = ', dF('60°')] });

  EJ2.push({ nivel: 2, titulo: 'Un lado con x',
    enunciado: '△ABC ≅ △DEF, con AB = 2x + 3 y DE = 15 cm. ¿Cuánto vale x?',
    datos: [D_ORDEN, 'Lo que vale x es un número: AB = 2x + 3 está en centímetros.'],
    solucion: [{ texto: 'AB va con DE: miden igual. Igualo y despejo.', ecuacion: [junto('2x + 3 = 15'), FL, junto('2x = 12'), FL, junto(['x = ', dF('6')])] },
      { texto: 'Compruebo: AB = 2 · 6 + 3 = 15 cm, igual que DE.' }],
    respuesta: ['x = ', dF('6')] });
  EJ2.push({ nivel: 2, titulo: 'Escribir la congruencia',
    figura: fig((() => { const P = porLLL(8, 6, 7), nom = 'FDE', mov = aLaDerecha(P, { giro: 150, espejo: true });
      return dosTri(P, nom, mov, Object.assign(arcosDe(nom), { fig: { alt: 'Dos triángulos congruentes en distinta posición. El ángulo de un arco está en A y en F; el de dos arcos, en B y en D; el de tres arcos, en C y en E.' } })); })()),
    enunciado: 'Los dos triángulos son congruentes y los arcos marcan los ángulos iguales. ¿Cómo se escribe la congruencia, empezando por △ABC?',
    datos: [D_ARCOS, 'En una congruencia, las letras van en orden: cada vértice, en el mismo lugar que su pareja.'],
    solucion: [{ texto: 'Busco la pareja de cada vértice por sus arcos: A (un arco) con F, B (dos) con D y C (tres) con E.', ecuacion: junto('A ↔ F,   B ↔ D,   C ↔ E') },
      { texto: 'Escribo las parejas en el mismo orden.' }],
    respuesta: [dF('△ABC ≅ △FDE')] });
  EJ2.push({ nivel: 2, titulo: 'La cometa',
    figura: fig((() => { const w = 4, p = 1.8, q = w * Math.tan((80 - U.grados(Math.atan2(p, w))) * RAD);   // (lector B: con p = 3 parecía un rombo)
      const F = figCometa(w, p, q, { llaves: true, cola: false, alt: 'Una cometa ABCD con su varilla central AC: AB = AD (una rayita) y CB = CD (dos rayitas). El ángulo ABC mide 80° y el ángulo ADC lleva «?».' });
      const B = [-w, 0], A = [0, p], C = [0, -q];
      F.figura.angulos = [{ en: 'B', de: 'A', a: 'C', texto: '80°', color: 'h', radio: 18, holgura: 6, mide: U.angulo(B, A, C) }, { en: 'D', de: 'C', a: 'A', texto: '?', radio: 18, holgura: 6 }];
      return F; })()),
    enunciado: 'En la cometa ABCD, AB = AD y CB = CD, y la varilla AC es lado de los triángulos ABC y ADC. Si m∠ABC = 80°, ¿cuánto mide el ángulo ADC?',
    datos: [D_CRIT, D_COMUN, D_PAR],
    solucion: [{ texto: 'AB = AD, CB = CD y AC es de los dos: por LLL, △ABC ≅ △ADC.' },
      { texto: 'El ángulo ABC queda frente a AC en un triángulo, y ADC, frente a AC en el otro: son pareja.', ecuacion: junto('m∠ADC = m∠ABC') }],
    respuesta: ['m∠ADC = ', dF('80°')] });
  EJ2.push({ nivel: 2, titulo: 'Dos sogas que se cruzan',
    figura: fig(figCruce(3, 4, 90, { lados: { OA: '3 m', OD: '3 m', OB: '4 m', OC: '4 m', AB: '5 m', CD: '?' }, alt: 'Dos sogas, AD y BC, se cruzan en O. OA y OD miden 3 m; OB y OC, 4 m. El lado AB mide 5 m y el lado CD lleva «?».' })),
    enunciado: 'Dos sogas tensas, AD y BC, se cruzan en O, con OA = OD = 3 m y OB = OC = 4 m. Si AB = 5 m, ¿cuánto mide CD?',
    datos: [D_CRIT, D_OPUESTOS, D_PAR],
    solucion: [{ texto: 'Los ángulos en O son opuestos por el vértice y quedan entre los lados dados: por LAL, △AOB ≅ △DOC.' },
      { texto: 'AB y CD quedan frente a los ángulos en O, que son iguales: AB y CD son pareja.', ecuacion: junto('CD = AB') }],
    respuesta: ['CD = ', dF('5 m')] });
  EJ2.push({ nivel: 2, titulo: 'El perímetro de la copia',
    enunciado: '△ABC ≅ △DEF, con AB = 7 cm, BC = 9 cm y DF = 8 cm. ¿Cuánto mide el perímetro de △DEF?',
    datos: [D_ORDEN, 'El perímetro de un triángulo es la suma de sus tres lados.'],
    solucion: [{ texto: 'DE va con AB y EF va con BC: DE = 7 cm y EF = 9 cm. DF ya es dato.' },
      { texto: 'Sumo los tres lados de △DEF.', ecuacion: junto(['7 + 9 + 8 = ', dF('24 cm')]) }],
    respuesta: ['Perímetro = ', dF('24 cm')] });

  EJ2.push({ nivel: 3, titulo: 'El cruce con x',
    figura: fig(figCruce(3.4, 4.2, 80, { llaves: { OA: 1, OD: 1, OB: 2, OC: 2 }, lados: { AB: '3x − 2', CD: 'x + 8' }, alt: 'Los segmentos AD y BC se cortan en O, con OA = OD y OB = OC. El lado AB mide 3x − 2 y el lado CD, x + 8.' })),
    enunciado: 'AD y BC se cortan en O, con OA = OD y OB = OC. Si AB = 3x − 2 y CD = x + 8, en centímetros, ¿cuánto mide AB?',
    alternativas: ['5 cm', '10 cm', '15 cm', '26 cm', '13 cm'],
    datos: [D_CRIT, D_OPUESTOS, D_PAR],
    solucion: [{ texto: 'Por LAL (los ángulos en O son opuestos por el vértice), △AOB ≅ △DOC. AB y CD están frente a ellos: miden igual.', ecuacion: [junto('3x − 2 = x + 8'), FL, junto('x = 5')] },
      { texto: 'Piden AB, no x.', ecuacion: junto(['AB = 3 · 5 − 2 = ', dF('13 cm')]) },
      { texto: 'Compruebo: CD = 5 + 8 = 13 cm.' },
      { texto: 'Las otras: 5 cm es x; 10 cm es 2x; 15 cm olvida restar 2; 26 cm suma AB y CD.' }],
    respuesta: ['AB = ', dF('13 cm')] });
  EJ2.push({ nivel: 3, titulo: 'Un isósceles dentro de otro',
    figura: fig((() => { const h = 4, e = h * Math.tan(40 * RAD), b = e + 2.6;
      return Object.assign(figIsoDE(b, h, b - e, { ang: [{ en: 'A', de: 'D', a: 'E', texto: '50°', color: 'h', radio: 30 }, { en: 'D', de: 'E', a: 'A', texto: '?', radio: 16 }],
        alt: 'Triángulo isósceles ABC con AB = AC; D y E están en BC, con BD = EC. El ángulo DAE mide 50° y el ángulo ADE lleva «?». El dibujo no está a escala.' }), { sinEscala: true }); })()),
    enunciado: 'En el triángulo ABC, AB = AC. D y E están en BC, con BD = EC. Si m∠DAE = 50°, ¿cuánto mide el ángulo ADE? El dibujo no está a escala.',
    alternativas: ['65°', '25°', '50°', '115°', '130°'],
    datos: [D_CRIT, D_ISO, D_PAR, D_SUMA],
    solucion: [{ texto: 'AB = AC, m∠B = m∠C (isósceles) y BD = CE: por LAL, △ABD ≅ △ACE.' },
      { texto: 'AD y AE quedan frente a los ángulos iguales B y C: AD = AE. Entonces △ADE es isósceles.' },
      { texto: 'Sus dos ángulos iguales se reparten lo que deja el de 50°.', ecuacion: junto(['m∠ADE = (180° − 50°) ÷ 2 = ', dF('65°')]) },
      { texto: 'Las otras: 25° parte el ángulo de A; 50° lo copia; 115° es el vecino ADB; 130° es la suma de los dos iguales.' }],
    respuesta: ['m∠ADE = ', dF('65°')] });
  EJ2.push({ nivel: 3, titulo: 'Lados opuestos iguales',
    figura: fig((() => { const A = [0, 0], C = [8, 0], B = U.polar(A, 8 * Math.sin(50 * RAD) / Math.sin(95 * RAD), 35), D = [A[0] + C[0] - B[0], A[1] + C[1] - B[1]], P = { A, B, C, D };
      const pt = (id, lado) => ({ id, x: P[id][0], y: P[id][1], rotulo: id, lado, sinPunto: true });
      const fg = { alto: 220, alt: 'Cuadrilátero ABCD con su diagonal AC: AB = CD (una rayita) y BC = DA (dos rayitas). El ángulo BAC (un arco) mide 35° y el ángulo ACB (dos arcos), 50°.',
        puntos: [pt('A', 180), pt('B', 90), pt('C', 0), pt('D', -90)], segmentos: [{ de: 'A', a: 'B' }, { de: 'B', a: 'C' }, { de: 'C', a: 'D' }, { de: 'D', a: 'A' }, { de: 'A', a: 'C' }],
        angulos: [{ en: 'A', de: 'C', a: 'B', color: 'h', radio: 26, holgura: 6, mide: U.angulo(A, C, B) }, { en: 'C', de: 'B', a: 'A', color: 'h', radio: 26, holgura: 6, marcas: 2, mide: U.angulo(C, B, A) }] };
      const xs = [A, B, C, D].map(q => q[0]), ys = [A, B, C, D].map(q => q[1]);
      fg.vista = { x: [Math.min(...xs) - 1.3, Math.max(...xs) + 1.3], y: [Math.min(...ys) - 1, Math.max(...ys) + 1] };
      PO.acomodarLetras(fg, ['A', 'B', 'C', 'D']);
      return { objeto: 'angulos', figura: fg, llaves: [{ de: 'A', a: 'B', marcas: 1, ref: 'C' }, { de: 'C', a: 'D', marcas: 1, ref: 'A' }, { de: 'B', a: 'C', marcas: 2, ref: 'A' }, { de: 'D', a: 'A', marcas: 2, ref: 'C' }] }; })()),
    enunciado: 'En el cuadrilátero ABCD, AB = CD y BC = DA, y se traza la diagonal AC. Si m∠BAC = 35° y m∠ACB = 50°, ¿cuánto mide el ángulo BAD?',
    alternativas: ['50°', '95°', '100°', '85°', '130°'],
    datos: [D_CRIT, D_COMUN, D_PAR],
    solucion: [{ texto: 'AB = CD, BC = DA y AC es de los dos: por LLL, △ABC ≅ △CDA, con A ↔ C, B ↔ D y C ↔ A. (ABCD es un paralelogramo: se explica más adelante.)' },
      { texto: 'El ángulo ACB está frente a AB; su pareja, frente a CD, es el ángulo CAD.', ecuacion: junto('m∠CAD = m∠ACB = 50°') },
      { texto: 'El ángulo BAD junta los dos que hay en A.', ecuacion: junto(['m∠BAD = 35° + 50° = ', dF('85°')]) },
      { texto: 'Las otras: 50° es solo una parte; 95° y 130° restan de 180°; 100° duplica el de 50°.' }],
    respuesta: ['m∠BAD = ', dF('85°')] });
  EJ2.push({ nivel: 3, titulo: 'La mediana que se alarga',
    figura: fig((() => { const A = [1.8, 3.6], B = [0, 0], C = [8, 0], M = U.medio(B, C), D = [2 * M[0] - A[0], 2 * M[1] - A[1]];
      const pt = (id, p, lado) => ({ id, x: p[0], y: p[1], rotulo: id, lado, sinPunto: true });
      const fg = { alto: 260, vista: { x: [-1.6, 9.6], y: [-4.5, 4.6] }, alt: 'Triángulo ABC con M, punto medio de BC. AM se alarga hasta D, con MD = AM. AB = 9 cm, AC = 7 cm, AM = 4 cm y se traza CD.',
        puntos: [pt('A', A, 90), pt('B', B, 200), pt('C', C, -10), Object.assign(pt('M', M, 240), { lejos: 3 }), pt('D', D, -90)],
        segmentos: [{ de: 'A', a: 'B' }, { de: 'A', a: 'C' }, { de: 'B', a: 'C' }, { de: 'A', a: 'M' }, { de: 'M', a: 'D' }, { de: 'C', a: 'D' }], angulos: [] };
      PO.acomodarLetras(fg, ['A', 'B', 'C', 'D']);
      return { objeto: 'angulos', figura: fg, sinEscala: true, llaves: [{ de: 'B', a: 'M', marcas: 1, ref: 'D' }, { de: 'M', a: 'C', marcas: 1, ref: 'D' }, { de: 'A', a: 'M', marcas: 2, ref: 'C' }, { de: 'M', a: 'D', marcas: 2, ref: 'B' }],
        ladosRot: [{ de: 'A', a: 'B', texto: '9 cm', ref: 'C', dist: 6 }, { de: 'A', a: 'C', texto: '7 cm', ref: 'B', dist: 6 }] }; })()),
    enunciado: 'En △ABC, M es el punto medio de BC. AM = 4 cm se alarga hasta D, con MD = AM. Si AB = 9 cm y AC = 7 cm, ¿cuánto mide el perímetro de △ACD? El dibujo no está a escala.',
    alternativas: ['16 cm', '24 cm', '20 cm', '22 cm', '33 cm'],
    datos: [D_CRIT, D_OPUESTOS, D_PAR, 'El perímetro de un triángulo es la suma de sus tres lados.'],
    solucion: [{ texto: 'BM = MC, AM = MD y los ángulos en M son opuestos: por LAL, △AMB ≅ △DMC.' },
      { texto: 'CD queda frente al ángulo en M, como AB: CD = AB = 9 cm. Y AD = AM + MD.', ecuacion: junto('AD = 4 + 4 = 8 cm') },
      { texto: 'Sumo los lados de △ACD.', ecuacion: junto(['7 + 9 + 8 = ', dF('24 cm')]) },
      { texto: 'Las otras: 16 cm olvida AD; 20 cm toma AD = 4 cm; 22 cm empareja CD con AC; 33 cm suma también AB.' }],
    respuesta: ['Perímetro = ', dF('24 cm')] });
  EJ2.push({ nivel: 3, titulo: 'El poste y sus dos cables',
    figura: fig((() => { const P = [0, 5.4], H = [0, 0], A = [-4.4, 0], B = [4.4, 0];
      const pt = (id, p, lado) => ({ id, x: p[0], y: p[1], rotulo: id, lado, sinPunto: true });
      const fg = { alto: 230, vista: { x: [-5.6, 5.6], y: [-1.3, 6.3] }, alt: 'Un poste PH vertical sobre el piso, con dos cables PA y PB hasta el piso, a lados opuestos; HA = HB. El cable PA forma 65° con el piso (arco en A) y el ángulo APB lleva «?». El dibujo no está a escala.',
        puntos: [pt('P', P, 90), pt('H', H, -90), pt('A', A, 200), pt('B', B, -20)],
        segmentos: [{ de: 'A', a: 'B' }, { de: 'P', a: 'H' }, { de: 'P', a: 'A' }, { de: 'P', a: 'B' }],
        angulos: [{ en: 'H', de: 'B', a: 'P' }, { en: 'A', de: 'B', a: 'P', color: 'h', radio: 22, holgura: 6 }, { en: 'P', de: 'A', a: 'B', texto: '?', radio: 22, holgura: 6 }] };
      return { objeto: 'angulos', figura: fg, sinEscala: true, llaves: [{ de: 'A', a: 'H', marcas: 1, ref: 'P', dist: 9 }, { de: 'H', a: 'B', marcas: 1, ref: 'P', dist: 9 }] }; })()),
    enunciado: 'Un poste PH está vertical. Dos cables, PA y PB, llegan al piso a lados opuestos, con HA = HB. Si PA forma 65° con el piso, ¿cuánto mide el ángulo APB? El dibujo no está a escala.',
    alternativas: ['25°', '65°', '50°', '115°', '130°'],
    datos: [D_CRIT, D_COMUN, D_PAR, D_SUMA],
    solucion: [{ texto: 'HA = HB, los ángulos en H son rectos y PH es de los dos: por LAL, △PHA ≅ △PHB.' },
      { texto: 'En △PHA ya hay 90° y 65°.', ecuacion: junto('m∠APH = 180° − 90° − 65° = 25°') },
      { texto: 'Su pareja, el ángulo BPH, mide igual. APB junta los dos.', ecuacion: junto(['m∠APB = 2 · 25° = ', dF('50°')]) },
      { texto: 'Las otras: 25° es solo la mitad; 65° copia el del piso; 115° es lo que le falta al de 65° para 180°; 130° lo duplica.' }],
    respuesta: ['m∠APB = ', dF('50°')] });

  const correspondientes = {
    id: 'partes-correspondientes',
    titulo: 'Lados y ángulos correspondientes',
    pregunta: '¿Qué lado de un triángulo le toca a cada lado de su copia?',
    temas: ['Lados y ángulos correspondientes'],
    pieza: GO,
    aprendizaje: 'En triángulos congruentes, frente a ángulos iguales hay lados iguales, y al revés; se emparejan por sus marcas, no por su posición.',
    actividad: 'Girar y voltear un banderín hasta que calce sobre otro del mismo molde.',
    // Lee: el mismo molde, qué es una parte correspondiente y cómo se escriben las parejas. No dice que la pareja de un
    // lado es el que queda frente al ángulo igual (eso es la predicción y la regla).
    lee: {
      tarjetas: [
        { titulo: 'El mismo molde', texto: 'Rosa corta banderines de tela con un mismo molde. Al colgarlos, unos quedan girados y otros dados vuelta, pero todos son congruentes: si pones uno sobre otro, calzan.',
          pieza: GO, dibujo: fig(figBan(150, 'frente', { alt: 'Dos banderines de tela del mismo molde sobre la mesa de costura, ABC y DEF; el segundo está girado y volteado. Los dos tienen un ángulo de un arco, uno de dos y uno de tres.' })) },
        { titulo: 'Partes correspondientes', texto: 'Al poner un banderín sobre el otro, cada lado cae sobre un lado y cada ángulo sobre un ángulo: son partes correspondientes, y miden igual. Los arcos dicen qué ángulo va con cuál.' },
        { titulo: 'Las letras en orden', texto: 'Si se escribe △ABC ≅ △DEF, el orden dice las parejas: A con D, B con E y C con F. Si no está escrito, mandan las marcas del dibujo, no las letras.' },
        { titulo: 'Qué mirar al jugar', texto: 'Vas a girar y voltear el banderín DEF hasta que calce sobre ABC. Mira qué punta cae sobre cada punta y dónde quedan sus arcos.' },
      ],
    },
    ejemplos: EJ2,
    juega: {
      pieza: GO,
      consigna: 'Los banderines ABC y DEF salieron del mismo molde. El segundo quedó girado y dado vuelta sobre la mesa de costura.',
      mision: {
        texto: 'Gira y voltea el banderín DEF hasta que calce sobre ABC: cada arco con su igual.',
        logrado: v => calza(v),
        bien: 'Calza: D sobre A, E sobre B, F sobre C; cada ángulo sobre su igual.',
      },
      voz: 'Mira los arcos: te dicen qué punta va con cuál.',
      leyenda: [
        { s: 'A, B, C', t: 'las puntas del banderín fijo' },
        { s: 'D, E, F', t: 'las puntas del banderín que mueves' },
        { s: dH('arcos'), t: 'uno, dos o tres: ángulos iguales' },
      ],
      controles: [
        { id: 'giro', etiqueta: 'Giro del banderín DEF', min: 0, max: 330, paso: 30, inicio: 150, unidad: '°', decimales: 0 },
        { id: 'cara', etiqueta: 'Cara del banderín DEF', opciones: [{ valor: 'frente', texto: 'Como está' }, { valor: 'vuelta', texto: 'Dado vuelta' }], inicio: 'frente' },
      ],
      dibujo: v => ({ datos: figBan(v.giro, v.cara), estado: {} }),
      // La relación: qué punta de DEF caería sobre cada punta de ABC si se lo pone encima.
      // (Auditoría del 19 nov, M1: la lectura dice que es lo que pasaría con ese giro, y si calza o no.)
      lectura: v => { const p = encima(v); return [junto(calza(v) ? 'D sobre A, E sobre B, F sobre C: cada arco con su igual' : `Caería ${p[0]} en A, ${p[1]} en B, ${p[2]} en C: no calza`)]; },
      minimo: 4,
    },
    predice: {
      pregunta: 'Otros dos banderines del mismo molde; en el segundo, las letras quedaron en otro orden. En ABC, el lado de 24 cm queda frente al ángulo de tres arcos. En DEF, ¿qué lado mide 24 cm?',
      datos: ['Los ángulos con la misma cantidad de arcos miden igual.'],
      voz: 'No te fíes de la posición: mira las marcas.',
      opciones: [
        { id: 'c', texto: 'EF, el que queda frente al ángulo de tres arcos', correcta: true },
        { id: 'abajo', texto: 'DF, el de abajo, como AB en el primero', error: 'GE-CON17', siFuera: 'Sería el de abajo si los dos estuvieran en la misma posición; este está girado y volteado.' },
        { id: 'letras', texto: 'DE, porque en el primero era AB', error: 'GE-CON3', siFuera: 'Valdría si D fuera la pareja de A y E la de B; aquí los arcos dicen otra cosa.' },
        { id: 'nose', texto: 'No se sabe sin medir el banderín', error: 'GE-CON18', siFuera: 'Haría falta medir si no fueran del mismo molde; como lo son, los arcos alcanzan.' },
      ],
      dibujo: fig(figPred2()),
      revelar: fig(MIRA2, { corte: 4 }),
      coincide: 'Coincide: en DEF, el ángulo de tres arcos está en D, y enfrente queda EF, de 24 cm.',
      noCoincide: 'Revisemos: en DEF, el ángulo de tres arcos está en D. El lado de enfrente, EF, mide 24 cm.',
    },
    mira: {
      pieza: GO,
      datos: MIRA2,
      voz: 'Busca primero el ángulo; después, el lado de enfrente.',
      pasos: [
        { estado: { corte: 0 }, texto: 'Cada banderín tiene ángulos de uno, dos y tres arcos.' },
        { estado: { corte: 1 }, texto: 'En ABC, el lado de 24 cm está frente a C, de tres arcos.', ecuacion: junto('AB = 24 cm, frente a C') },
        { estado: { corte: 2 }, texto: 'En DEF, el de tres arcos es D. El lado de enfrente es EF.' },
        { estado: { corte: 3 }, texto: 'Volteado y girado, D cae sobre C y EF cae sobre AB.', ecuacion: junto('E ↔ A,   F ↔ B,   D ↔ C') },
        { estado: { corte: 4 }, texto: 'EF mide 24 cm. Escrita en orden, la congruencia es △ABC ≅ △EFD.', ecuacion: junto('EF = AB = 24 cm') },
      ],
    },
    regla: {
      texto: 'En triángulos congruentes, frente a ángulos iguales hay lados iguales, y frente a lados iguales, ángulos iguales. Se emparejan por sus marcas, no por su posición en el dibujo.',
      ecuacion: [junto('△ABC ≅ △DEF'), FL, junto('AB = DE,   BC = EF,   AC = DF')],
      condicion: 'los triángulos son congruentes. En △ABC ≅ △DEF, las letras van en orden: A con D, B con E y C con F.',
      voz: 'Primero la pareja de cada ángulo; los lados salen solos.',
      // La regla con su propio dibujo, en el orden de su ecuación (auditoría del 19 nov, A2): los banderines del juego,
      // con D, E y F de uno, dos y tres arcos, y AB = DE = 24 cm.
      dibujo: { pieza: GO, datos: FIG_REGLA2, estado: {} },
    },
    // Así se resuelve: un ángulo con x en una congruencia escrita en otro orden (se iguala con su pareja y se halla otro
    // ángulo con la suma de 180°). «Ahora tú» pide lados por el orden de las letras, lados y ángulos por las marcas, el
    // cruce con x y la congruencia más isósceles.
    resuelve: {
      generar(s) {
        const r = azar(s + 900);
        for (let i = 0; ; i++) {
          const perm = r.de(PERM6.slice(1)), x = r.ent(12, 30), p = r.ent(2, 3), q = 5 * r.ent(1, 4), A = p * x - q, Bv = 5 * r.ent(8, 14), s2 = A - x;
          if (A < 30 || A > 100 || s2 < 5 || A + Bv > 150 || A === Bv || i > 400) { if (i <= 400) continue; }
          const Cv = 180 - A - Bv, parA = perm[0], parB = perm[1], parC = perm[2];
          const ex1 = `${p}x − ${q}°`, ex2 = `x + ${s2}°`;
          return {
            enunciado: `△ABC ≅ △${perm}. Si m∠A = ${ex1}, m∠${parA} = ${ex2} y m∠${parB} = ${Bv}°, ¿cuánto mide el ángulo ${parC}?`,
            datos: [D_ORDEN2, D_SUMA],
            pasos: [
              { tipo: 'pide', texto: `Piden m∠${parC}, un ángulo de △${perm}.` },
              { tipo: 'datos', texto: `El ángulo A tiene una expresión con x, igual que su pareja ${parA}. El ángulo ${parB} ya se sabe.` },
              { tipo: 'regla', texto: `Por el orden de las letras, A va con ${parA}, B con ${parB} y C con ${parC}. Las parejas miden igual.`, ecuacion: junto(`m∠A = m∠${parA}`) },
              { tipo: 'cuentas', texto: 'Igualo las dos expresiones y despejo x. Después hallo el ángulo A.', ecuacion: [junto(`${p}x − ${q} = x + ${s2}`), FL, junto(`x = ${x}`), FL, junto(`m∠A = ${A}°`)] },
              { tipo: 'aplica', texto: `En △${perm} ya tengo dos ángulos: m∠${parA} = ${A}° y m∠${parB} = ${Bv}°. El tercero es lo que falta para 180°.`, ecuacion: junto(['m∠', parC, ` = 180° − ${A}° − ${Bv}° = `, dF(`${Cv}°`)]) },
              { tipo: 'sentido', texto: `Tiene sentido: m∠${parC} es la pareja de m∠C, y en △ABC también suman 180°.` },
            ],
            respuesta: [`m∠${parC} = `, dF(`${Cv}°`)],
          };
        }
      },
    },
    ahoraTu: {
      pieza: GO,
      voz: 'Busca la pareja de cada parte por sus marcas o por el orden de las letras.',
      generar(s) { return conCuatro([casoOrden, casoFrente, casoAngulo, casoCruce, casoIso][s % 5], azar(s + 7), firmasDe(EJ2)); },
    },
  };

  // ---------- Idea 3 (fase 3, 19 nov): mediatriz y bisectriz ----------
  // Objeto de la primera pantalla: dos caseríos, A y B, a 6 km uno del otro, y el pozo P que hay que poner igual de lejos
  // de los dos (geo-objeto, armazon de tipo 'mapa'; dibujo de prueba). La predicción: una antena sobre la bisectriz del
  // ángulo de 60° que forman dos carreteras. Cambia: la posición del pozo P. · Permanece: los caseríos y la mediatriz de
  // AB, punteada. · Progresa: PA y PB, y cuál es mayor. · Se reserva: la bisectriz (la predicción y «Mira»). · Debe
  // verse: PA = PB justo cuando P está sobre la mediatriz.
  // Colores (propuesta §6): PA y PH naranja; PB y PK turquesa; los ángulos (las dos mitades de la bisectriz, con su
  // rayita) en carmín; AB, la mediatriz y la bisectriz, en tinta (las dos líneas, punteadas); lo pedido, «?» en tinta.
  const km = n => `${f(n)} km`;
  const VM = { x: [-4.6, 4.6], y: [-4.9, 4.9] };
  const dPA = v => U.dist([v.dx, v.y], [-3, 0]), dPB = v => U.dist([v.dx, v.y], [3, 0]);
  const igual = (a, b) => Math.abs(a - b) < 1e-9;
  const kmV = d => (entero(d) ? `${f(d)} km` : `≈ ${f(d)} km`);
  // El mapa del juego: los caseríos A y B, su mediatriz punteada y el pozo P con los dos caminos.
  function figMapa(v, o = {}) {
    const P = [v.dx, v.y], arriba = v.y >= 0;
    const fg = { alt: o.alt || `Mapa con dos caseríos, A y B, a 6 km; la mediatriz de AB va punteada. El pozo P queda a ${kmV(dPA(v))} de A y a ${kmV(dPB(v))} de B${igual(dPA(v), dPB(v)) ? ': sobre la mediatriz' : ''}.`,
      vista: o.vista || VM, alto: o.alto || 280,
      puntos: [{ id: 'A', x: -3, y: 0, rotulo: 'A', lado: 180, lejos: 6, sinPunto: true }, { id: 'B', x: 3, y: 0, rotulo: 'B', lado: 0, lejos: 6, sinPunto: true },
        { id: 'M', x: 0, y: 0, rotulo: 'M', lado: arriba ? 235 : 125, lejos: 7, sinPunto: true }, { id: 'P', x: P[0], y: P[1], rotulo: 'P', lado: arriba ? 90 : -90, lejos: 6, sinPunto: true },
        { id: 'Z1', x: 0, y: -4.7, sinPunto: true }, { id: 'Z2', x: 0, y: 4.7, sinPunto: true }],
      segmentos: [{ de: 'A', a: 'B' }, { de: 'Z1', a: 'Z2', discontinua: true, grosor: 'fino' },
        { de: 'P', a: 'A', color: 'o', grosor: 'variable' }, { de: 'P', a: 'B', color: 'i', grosor: 'variable' }],
      angulos: [{ en: 'M', de: 'B', a: arriba ? 'Z1' : 'Z2', radio: 9 }] };
    // (M va en el cuadrante libre: el ángulo recto queda del lado de B y lejos de P; los caminos, del lado de P.)
    PO.acomodarLetras(fg, ['A', 'B', 'P'], { P: [90, -90, 270] });
    const lados = o.lados || [{ de: 'P', a: 'A', texto: kmV(dPA(v)), color: 'o', ref: 'B', dist: 7 }, { de: 'P', a: 'B', texto: kmV(dPB(v)), color: 'i', ref: 'A', dist: 7 }];
    const F = Object.assign({ objeto: 'armazon', tipo: 'mapa', figura: fg, casas: ['A', 'B'], pozo: 'P', ladosRot: lados.filter(x => x.texto !== '') },
      o.manija === false ? {} : { manija: 'P' }, o.llaves === false ? {} : { llaves: [{ de: 'A', a: 'M', marcas: 1, ref: arriba ? 'Z2' : 'Z1', dist: 9 }, { de: 'M', a: 'B', marcas: 1, ref: arriba ? 'Z2' : 'Z1', dist: 9 }] });
    // En el juego, si las medidas no caben junto a los caminos (P muy cerca de AB), van solo en la lectura.
    if (!o.lados && !PO.escenaCabe(F)) F.ladosRot = [];
    return F;
  }
  // Dos carreteras rectas que salen de O formando el ángulo al (grados) y un punto P sobre su bisectriz, a op de O. H y K
  // son los pies de las perpendiculares de P a cada carretera. o.cortes: { pk, p } (desde qué corte va PK y los ángulos
  // en P); o.ph, o.pk, o.op: textos de PH, PK y OP; o.mitad: el rótulo de cada mitad del ángulo en O.
  function figBis(al, op, o = {}) {
    const O = [0, 0], X = [op * 1.25, 0], Y = U.polar(O, op * 1.25, al), P = U.polar(O, op, al / 2), H = U.pie(P, O, X), K = U.pie(P, O, Y), c = o.cortes || {};
    const R = U.polar(O, op * 1.2, al / 2);
    if (o.sinP) return { objeto: 'angulos', figura: { alt: o.alt, alto: 200, vista: { x: [-0.12 * op, op * 1.35], y: [-0.12 * op, Y[1] + 0.12 * op] }, puntos: [{ id: 'O', x: 0, y: 0, rotulo: 'O', lado: 200, sinPunto: true }, { id: 'X', x: X[0], y: 0, sinPunto: true }, { id: 'Y', x: Y[0], y: Y[1], sinPunto: true }, { id: 'R', x: R[0], y: R[1], sinPunto: true }],
      segmentos: [{ de: 'O', a: 'X', grosor: 'variable' }, { de: 'O', a: 'Y', grosor: 'variable' }, { de: 'O', a: 'R', discontinua: true, grosor: 'fino' }],
      angulos: [{ en: 'O', de: 'X', a: 'R', color: 'h', radio: 40, rayita: 1, mide: al / 2 }, { en: 'O', de: 'R', a: 'Y', color: 'h', radio: 40, rayita: 1, mide: al / 2 }] } };
    const fg = { alt: o.alt, alto: o.alto || 240,
      puntos: [{ id: 'O', x: 0, y: 0, rotulo: 'O', lado: 200, sinPunto: true }, { id: 'X', x: X[0], y: X[1], sinPunto: true }, { id: 'Y', x: Y[0], y: Y[1], sinPunto: true },
        { id: 'R', x: R[0], y: R[1], sinPunto: true }, { id: 'P', x: P[0], y: P[1], rotulo: 'P', lado: al / 2, lejos: 2, sinPunto: !o.punto },
        { id: 'H', x: H[0], y: H[1], rotulo: 'H', lado: -90, sinPunto: true }, { id: 'K', x: K[0], y: K[1], rotulo: 'K', lado: al + 90, sinPunto: true, desde: c.pk || 0 }],
      segmentos: [{ de: 'O', a: 'X', grosor: 'variable' }, { de: 'O', a: 'Y', grosor: 'variable' }, { de: 'O', a: 'R', discontinua: true, grosor: 'fino' },
        { de: 'P', a: 'H', color: 'o', grosor: 'variable' }, { de: 'P', a: 'K', color: 'i', grosor: 'variable', desde: c.pk || 0 }],
      angulos: [{ en: 'O', de: 'X', a: 'P', color: 'h', radio: o.radioO || 40, holgura: 6, rayita: 1, mide: al / 2, texto: o.mitad },
        { en: 'O', de: 'P', a: 'Y', color: 'h', radio: o.radioO || 40, holgura: 6, rayita: 1, mide: al / 2, texto: o.mitad },
        { en: 'H', de: 'P', a: 'O', radio: 9 }, { en: 'K', de: 'O', a: 'P', radio: 9, desde: c.pk || 0 },
        ...(c.p !== undefined ? [{ en: 'P', de: 'O', a: 'H', color: 'h', marcas: 2, radio: 16, holgura: 6, mide: 90 - al / 2, desde: c.p, texto: o.angP }, { en: 'P', de: 'K', a: 'O', color: 'h', marcas: 2, radio: 16, holgura: 6, mide: 90 - al / 2, desde: c.p, texto: o.angP }] : [])] };
    PO.acomodarLetras(fg, ['P'], { P: [al / 2, al / 2 + 180] });
    const xs = [O, X, Y, P, H, K, R].map(q => q[0]), ys = [O, X, Y, P, H, K, R].map(q => q[1]), m = 0.13 * op;
    fg.vista = { x: [Math.min(...xs) - m, Math.max(...xs) + m], y: [Math.min(...ys) - m, Math.max(...ys) + m] };
    const lados = [];
    if (o.ph !== undefined) lados.push({ de: 'P', a: 'H', texto: o.ph, color: 'o', ref: 'O', dist: 5 });
    if (o.pk !== undefined) lados.push(Object.assign({ de: 'P', a: 'K', texto: o.pk, color: 'i', ref: 'O', dist: 5 }, o.pkDesde !== undefined ? { desde: o.pkDesde } : {}, o.pk2 ? { hasta: o.pk2Desde - 1 } : {}), ...(o.pk2 ? [{ de: 'P', a: 'K', texto: o.pk2, color: 'i', ref: 'O', dist: 5, desde: o.pk2Desde }] : []));
    if (o.op !== undefined) lados.push({ de: 'O', a: 'P', texto: o.op, ref: 'K', dist: 5, en: 0.62 });
    return Object.assign({ objeto: o.mapa ? 'armazon' : 'angulos', figura: fg }, o.mapa ? { tipo: 'mapa' } : {}, lados.length ? { ladosRot: lados } : {});
  }
  // Un triángulo ABC con la mediatriz de AC (punteada, por su punto medio N) que corta BC en P, y el segmento PA.
  function figTriMed(c, b, a, o = {}) {
    // BC horizontal (B en el origen) y A arriba, con AB = c y AC = b.
    const x = (a * a + c * c - b * b) / (2 * a), A = [x, Math.sqrt(Math.max(0, c * c - x * x))], B = [0, 0], C = [a, 0];
    const N = U.medio(A, C), u0 = [-(C[1] - A[1]), C[0] - A[0]], l = Math.hypot(...u0), u = [u0[0] / l, u0[1] / l];
    // Corte de la mediatriz (N + t·u) con BC (y = 0).
    const t = -N[1] / u[1], P = [N[0] + t * u[0], 0], s = P[0] / a, sg = Math.sign(t);
    const Z = [N[0] - u[0] * sg * 1.1, N[1] - u[1] * sg * 1.1], Z2 = [P[0] + u[0] * sg * 0.9, P[1] + u[1] * sg * 0.9];
    const pt = (id, p, lado) => ({ id, x: p[0], y: p[1], rotulo: id, lado, sinPunto: true });
    const fg = { alt: o.alt, alto: o.alto || 230,
      puntos: [pt('A', A, 90), pt('B', B, 200), pt('C', C, -20), pt('N', N, 0), pt('P', P, -90), { id: 'Z', x: Z[0], y: Z[1], sinPunto: true }, { id: 'Z2', x: Z2[0], y: Z2[1], sinPunto: true }],
      segmentos: [{ de: 'A', a: 'B' }, { de: 'B', a: 'C' }, { de: 'A', a: 'C' }, { de: 'Z', a: 'Z2', discontinua: true, grosor: 'fino' }, { de: 'P', a: 'A', color: 'o', grosor: 'variable' }],
      angulos: (o.ang || []).map(q => Object.assign({ radio: 20, holgura: 6, marcas: 1 }, q)) };
    fg.angulos.push({ en: 'N', de: 'C', a: 'Z', radio: 8 });
    const xs = fg.puntos.map(q => q.x), ys = fg.puntos.map(q => q.y), w = Math.max(...xs) - Math.min(...xs);
    fg.vista = { x: [Math.min(...xs) - 0.14 * w, Math.max(...xs) + 0.14 * w], y: [Math.min(...ys) - 0.14 * w, Math.max(...ys) + 0.1 * w] };
    const du = U.grados(Math.atan2(u[1], u[0]));
    PO.acomodarLetras(fg, ['A', 'B', 'C', 'P'], { P: [du, du + 180, 0, 180] });
    // N va dentro del triángulo PNC, entre NC y NP: afuera están el ángulo recto y las llaves.
    const bis = (p, q) => { const a1 = Math.atan2(p[1] - N[1], p[0] - N[0]), a2 = Math.atan2(q[1] - N[1], q[0] - N[0]); return U.grados(Math.atan2(Math.sin(a1) + Math.sin(a2), Math.cos(a1) + Math.cos(a2))); };
    Object.assign(fg.puntos.find(q => q.id === 'N'), { lado: bis(C, P), lejos: 2 });
    for (const an of fg.angulos) if (an.mide === undefined && an.en !== 'N') an.mide = U.angulo(...['en', 'de', 'a'].map(k => ({ A, B, C, P, N }[an[k]])));
    return { fig: Object.assign({ objeto: 'angulos', figura: fg, llaves: [{ de: 'A', a: 'N', marcas: 1, ref: 'B', dist: 9 }, { de: 'N', a: 'C', marcas: 1, ref: 'B', dist: 9 }] }, o.lados ? { ladosRot: o.lados } : {}), s, P };
  }
  // El ángulo A partido por su bisectriz; la perpendicular desde C a la bisectriz la corta en H y llega a AB en D.
  function figPerpBis(c, b, al, o = {}) {
    const A = [0, 0], B = [c, 0], C = U.polar(A, b, al), D = [b, 0], H = U.medio(C, D), R = U.polar(A, Math.max(c, b) * 0.95, al / 2);
    const pt = (id, p, lado) => ({ id, x: p[0], y: p[1], rotulo: id, lado, sinPunto: true });
    const fg = { alt: o.alt, alto: o.alto || 220, puntos: [pt('A', A, 200), pt('B', B, -20), pt('C', C, 90), pt('D', D, -90), pt('H', H, al / 2 - 90), { id: 'R', x: R[0], y: R[1], sinPunto: true }],
      segmentos: [{ de: 'A', a: 'B' }, { de: 'A', a: 'C' }, { de: 'B', a: 'C' }, { de: 'A', a: 'R', discontinua: true, grosor: 'fino' }, { de: 'C', a: 'D' }],
      angulos: [{ en: 'A', de: 'B', a: 'R', color: 'h', radio: 30, holgura: 6, rayita: 1, mide: al / 2 }, { en: 'A', de: 'R', a: 'C', color: 'h', radio: 30, holgura: 6, rayita: 1, mide: al / 2 }, { en: 'H', de: 'C', a: 'A', radio: 8 }] };
    const xs = fg.puntos.map(q => q.x), ys = fg.puntos.map(q => q.y), w = Math.max(...xs) - Math.min(...xs);
    fg.vista = { x: [Math.min(...xs) - 0.12 * w, Math.max(...xs) + 0.12 * w], y: [Math.min(...ys) - 0.16 * w, Math.max(...ys) + 0.12 * w] };
    PO.acomodarLetras(fg, ['A', 'B', 'C', 'D']);
    // H va entre HD y HA, cerca de AB: el ángulo recto está entre HC y HA, y BC pasa del otro lado.
    const dir = p => Math.atan2(p[1] - H[1], p[0] - H[0]), a1 = dir(D), a2 = dir(A);
    Object.assign(fg.puntos.find(q => q.id === 'H'), { lado: U.grados(Math.atan2(Math.sin(a1) + Math.sin(a2), Math.cos(a1) + Math.cos(a2))), lejos: 2 });
    return Object.assign({ objeto: 'angulos', figura: fg }, o.lados ? { ladosRot: o.lados } : {});
  }
  // P sobre la mediatriz de AB (AB horizontal; M su punto medio): el isósceles APB, con m∠PAB = th.
  function figIsoMed(th, o = {}) {
    const A = [-4, 0], B = [4, 0], P = [0, 4 * Math.tan(th * RAD)], M = [0, 0];
    const pt = (id, p, lado) => ({ id, x: p[0], y: p[1], rotulo: id, lado, sinPunto: true });
    const fg = { alt: o.alt, alto: o.alto || 220, vista: { x: [-5.2, 5.2], y: [-1.5, P[1] + 0.9] },
      puntos: [pt('A', A, 200), pt('B', B, -20), pt('P', P, 90), pt('M', M, -60), { id: 'Z', x: 0, y: -1.2, sinPunto: true }],
      segmentos: [{ de: 'A', a: 'B' }, { de: 'P', a: 'A', color: 'o', grosor: 'variable' }, { de: 'P', a: 'B', color: 'i', grosor: 'variable' }, { de: 'P', a: 'Z', discontinua: true, grosor: 'fino' }],
      angulos: (o.ang || []).map(x => Object.assign({ radio: 20, holgura: 6, marcas: 1, mide: U.angulo(...['en', 'de', 'a'].map(k => ({ A, B, P, M }[x[k]]))) }, x)) };
    PO.acomodarLetras(fg, ['A', 'B', 'P', 'M']);
    return Object.assign({ objeto: 'angulos', figura: fg, llaves: [{ de: 'A', a: 'M', marcas: 1, ref: 'P', dist: 9 }, { de: 'M', a: 'B', marcas: 1, ref: 'P', dist: 9 }] }, o.lados ? { ladosRot: o.lados } : {});
  }
  const D_MED = 'Mediatriz de un segmento: la recta perpendicular a él por su punto medio.';
  const D_BIS = 'Bisectriz de un ángulo: la recta que lo parte en dos ángulos iguales.';
  const D_DIST = 'La distancia de un punto a una recta se mide por la perpendicular.';
  const D_PER = 'El perímetro de un triángulo es la suma de sus tres lados.';
  const D_TEO = 'Todo punto de la mediatriz de un segmento equidista de sus extremos; todo punto de la bisectriz, de los lados del ángulo.';
  const D_REC = 'Y al revés: si un punto equidista de A y de B, está en la mediatriz de AB.';
  const D_RECB = 'Y al revés: si un punto del interior del ángulo equidista de sus lados, está en la bisectriz.';
  // La figura de la mediatriz con las dos distancias rotuladas (expresiones): P arriba, a ytop de AB.
  const figMedX = (t1, t2, alt) => figMapa({ dx: 0, y: 4 }, { manija: false, alt, lados: [{ de: 'P', a: 'A', texto: t1, color: 'o', ref: 'B', dist: 7 }, { de: 'P', a: 'B', texto: t2, color: 'i', ref: 'A', dist: 7 }] });
  const sinMapa = F => Object.assign(F, { objeto: 'angulos', casas: undefined, pozo: undefined, tipo: undefined });
  const exLin = (a, b) => `${a}x ${b < 0 ? '−' : '+'} ${Math.abs(b)}`;
  // «Ahora tú», tipos 0 y 1: igualar las dos distancias (mediatriz o bisectriz) y dar la medida, no x.
  function casoIgualar(r, med) {
    for (let i = 0; i < 400; i++) {
      const x = r.ent(2, 9), a1 = r.ent(2, 5), a2 = r.ent(1, 4), v = r.ent(8, 20) + Math.max(a1, a2) * x;
      if (a1 === a2) continue;
      const b1 = v - a1 * x, b2 = v - a2 * x, e1 = exLin(a1, b1), e2 = a2 === 1 ? `x ${b2 < 0 ? '−' : '+'} ${Math.abs(b2)}` : exLin(a2, b2);
      if (v > 60) continue;
      const F = med ? sinMapa(figMedX(e1, e2, `P está en la mediatriz de AB: PA mide ${e1} y PB, ${e2}.`))
        : figBis(60, 5, { ph: e1, pk: e2, alt: `P está en la bisectriz del ángulo O. Sus distancias a los lados, PH y PK, miden ${e1} y ${e2}.` });
      if (!PO.escenaCabe(F)) continue;
      const D1 = med ? 'PA' : 'PH', D2 = med ? 'PB' : 'PK';
      const ops = opciones(v, [
        { id: 'x', valor: x, error: 'GE-CON30', siFuera: `Hallar x = ${x} está bien; falta reemplazarlo en ${D1}.` },
        { id: 'suma', valor: 2 * v, error: 'GE-CON31', siFuera: `Eso suma ${D1} y ${D2}; cada una mide la mitad.` },
        { id: 'otro', valor: b1 > 0 ? v - b1 : NaN, error: 'GE-CON8', siFuera: `Reemplazar x = ${x} está bien; falta sumar ${b1}: ${a1 === 1 ? '' : a1 + ' · '}${x} + ${b1}.` },
        { id: 'signo', valor: a1 * ((b2 + b1) / (a1 - a2)) + b1, error: 'GE-TRI15', siFuera: 'Igualar está bien; al pasar un número al otro lado cambia su signo.' },
      ].filter(d => Number.isInteger(d.valor)), cm);
      if (ops.length < 4) continue;
      return { pregunta: med ? `P está en la mediatriz de AB, con PA = ${e1} y PB = ${e2}, en centímetros. ¿Cuánto mide PA?`
        : `P está en la bisectriz del ángulo O. Sus distancias a los lados son PH = ${e1} y PK = ${e2}, en centímetros. ¿Cuánto mide PH?`,
        datos: [med ? D_MED : D_BIS, D_DIST, D_TEO], dibujo: fig(F), opciones: ops,
        solucion: { texto: med ? 'En la mediatriz, PA = PB: se igualan.' : 'En la bisectriz, las distancias a los lados son iguales: se igualan.', ecuacion: [junto(`${e1} = ${e2}`), FL, junto(`x = ${x}`), FL, junto(`${D1} = ${cm(v)}`)] } };
    }
    throw new Error('casoIgualar sin caso');
  }
  // Tipo 2: la mediatriz de AC corta BC en P; el perímetro de △ABP es AB + BC (PA = PC).
  function casoPerimetro(r) {
    for (let i = 0; i < 400; i++) {
      const c = r.ent(5, 9), a = r.ent(8, 13), b = r.ent(6, 11);
      if (a + b <= c + 1 || a + c <= b + 1 || b + c <= a + 1 || new Set([a, b, c]).size < 3) continue;
      const T0 = figTriMed(c, b, a), T = figTriMed(c, b, a, { lados: [{ de: 'A', a: 'B', texto: cm(c), dist: 6 }, { de: 'B', a: 'C', texto: cm(a), dist: 6, en: T0.s < 0.5 ? 0.75 : 0.25 }],
        alt: `Triángulo ABC con AB = ${cm(c)} y BC = ${cm(a)}; AC mide ${cm(b)}. La mediatriz de AC, punteada, pasa por su punto medio N y corta BC en P; se traza PA.` });
      if (T.s < 0.15 || T.s > 0.85 || !cabe(T.fig)) continue;
      const v = a + c;
      const ops = opciones(v, [
        { id: 'todo', valor: a + b + c, error: 'GE-CON37', siFuera: 'Sumar lados está bien; pero AC no es lado de △ABP: su lado PA mide lo que PC.' },
        { id: 'medio', valor: c + a / 2 + b / 2, error: 'GE-CON38', siFuera: 'Ver PA = PC está bien; pero P no es el punto medio de BC: BP + PC = BC.' },
        { id: 'sinAB', valor: a, error: 'GE-CON39', siFuera: 'BP + PA = BC está bien; falta sumar el tercer lado, AB.' },
        { id: 'conAC', valor: c + a + b / 2, error: 'GE-CON40', siFuera: 'Sumar AB y BC está bien; PA no es la mitad de AC: es igual a PC.' },
      ], cm);
      if (ops.length < 4) continue;
      return { pregunta: `En △ABC, AB = ${cm(c)}, BC = ${cm(a)} y AC = ${cm(b)}. La mediatriz de AC corta BC en P. ¿Cuánto mide el perímetro de △ABP?`,
        datos: [D_MED, D_TEO, D_PER], dibujo: fig(T.fig), opciones: ops,
        solucion: { texto: 'P está en la mediatriz de AC: PA = PC. Entonces BP + PA = BP + PC = BC.', ecuacion: junto(`AB + BP + PA = ${c} + ${a} = ${cm(v)}`) } };
    }
    throw new Error('casoPerimetro sin caso');
  }
  // Tipo 3 (examen, como San Marcos 2027-I): la perpendicular desde C a la bisectriz de A llega a AB en D; △AHD ≅ △AHC
  // (ALA, con AH de los dos) da AD = AC. Se pide BD = AB − AC.
  function casoPerpBis(r) {
    for (let i = 0; i < 400; i++) {
      const c = r.ent(10, 16), b = r.ent(5, c - 3), al = 10 * r.ent(5, 9);
      const F = figPerpBis(c, b, al, { lados: [{ de: 'A', a: 'C', texto: cm(b), ref: 'B', dist: 6 }], alt: `Triángulo ABC con AB = ${cm(c)} y AC = ${cm(b)}. La bisectriz del ángulo A va punteada; la perpendicular desde C a ella la corta en H y llega a AB en D.` });
      F.ladosRot.push({ de: 'A', a: 'B', texto: cm(c), ref: 'C', dist: 16 });
      if (!cabe(F)) continue;
      const v = c - b;
      const ops = opciones(v, [
        { id: 'ac', valor: b, error: 'GE-CON41', siFuera: `Ver que AD = AC está bien; pero ${cm(b)} es AD, no BD.` },
        { id: 'mitad', valor: v / 2, error: 'GE-CON42', siFuera: 'Restar AB − AC está bien; H es el punto medio de CD, no de BD.' },
        { id: 'suma', valor: c + b, error: 'GE-TRI15', siFuera: 'Usar AB y AC está bien; BD es lo que le sobra a AB, se resta.' },
        { id: 'mitadAB', valor: c / 2, error: 'GE-CON9', siFuera: 'D no es el punto medio de AB: está a AC de A.' },
      ].filter(d => Number.isInteger(d.valor * 2)), cm);
      if (ops.length < 4) continue;
      return { pregunta: `En △ABC, AB = ${cm(c)} y AC = ${cm(b)}. Desde C se traza la perpendicular a la bisectriz del ángulo A: la corta en H y llega a AB en D. ¿Cuánto mide BD?`,
        datos: [D_BIS, D_CRIT, D_SUMA, 'En triángulos congruentes, los lados correspondientes miden igual.'], dibujo: fig(F), opciones: ops,
        solucion: { texto: 'En △AHD y △AHC: ángulos iguales en A, rectos en H y AH de los dos: ALA. Así AD = AC.', ecuacion: junto(`BD = ${c} − ${b} = ${cm(v)}`) } };
    }
    throw new Error('casoPerpBis sin caso');
  }
  // Tipo 4: P equidista de A y de B, con m∠PAB = th; se pide m∠APB (el isósceles: 180 − 2·th).
  function casoIsoMed(r) {
    for (let i = 0; i < 400; i++) {
      const th = 5 * r.ent(7, 11), v = 180 - 2 * th;
      // (M2: estirada en vertical y sin escala, para que APB no se mida con transportador.)
      const F = figIsoMed(th, { ang: [{ en: 'A', de: 'B', a: 'P', texto: gr(th), color: 'h' }, { en: 'P', de: 'A', a: 'B', texto: '?', radio: 18 }],
        alt: `P está a la misma distancia de A y de B (PA = PB); M es el punto medio de AB y la mediatriz va punteada. El ángulo PAB mide ${th}° y el ángulo APB lleva «?».` });
      if (!cabe(torcer(F, th <= 45 ? 1.5 : 0.7))) continue;
      const ops = opciones(v, [
        { id: 'copia', valor: th, error: 'GE-CON35', siFuera: `Ver el isósceles está bien; ${th}° es un ángulo de la base, no el de P.` },
        { id: 'una', valor: 180 - th, error: 'GE-TRI5', siFuera: `Restar de 180° está bien; falta restar también el ángulo B, que mide ${th}°.` },
        { id: 'mitad', valor: 90 - th, error: 'GE-CON43', siFuera: `Eso mide el ángulo APM, la mitad: la mediatriz parte el ángulo de P en dos.` },
        { id: 'doble', valor: 2 * th, error: 'GE-CON34', siFuera: 'Sumar los dos ángulos de la base está bien; el de P es lo que les falta para 180°.' },
      ], gr);
      if (ops.length < 4) continue;
      F.sinEscala = true;
      return { pregunta: `P equidista de A y de B. Si m∠PAB = ${th}°, ¿cuánto mide el ángulo APB?${NO_ESC}`,
        datos: [D_REC, D_ISO, D_SUMA], dibujo: fig(F), opciones: ops,
        solucion: { texto: `PA = PB: △APB es isósceles y m∠PBA = ${th}°.`, ecuacion: junto(`m∠APB = 180° − 2 · ${th}° = ${gr(v)}`) } };
    }
    throw new Error('casoIsoMed sin caso');
  }

  // Ejemplos resueltos de «Mediatriz y bisectriz» (molde §3). Cuentas rehechas aparte (scratchpad e5-geometria/
  // cuentas3.py): PB = PA = 5 km; PK = PH = 3 km; 4 m < 5 m; 80 ÷ 2 = 40; 2x + 3 = 15, x = 6; 3x − 1 = x + 7, x = 4,
  // PH = 11 cm; 180 − 2·35 = 110; 90 − 35 = 55; 6 + 9 = 15; 14 − 9 = 5; 2x + 1 = x + 4, x = 3, 7 cm; 2·35 = 70; 60 + 3c
  // = 180, c = 40; 360 − 64 − 180 = 116 (dos triángulos de 58°).
  const EJ3 = [];
  EJ3.push({ nivel: 1, titulo: 'El pozo de los caseríos',
    figura: fig(figMapa({ dx: 0, y: 4 }, { manija: false, lados: [{ de: 'P', a: 'A', texto: '5 km', color: 'o', ref: 'B', dist: 7 }, { de: 'P', a: 'B', texto: '?', color: 'i', ref: 'A', dist: 7 }],
      alt: 'Mapa con los caseríos A y B y la mediatriz de AB, punteada. El pozo P está sobre la mediatriz, a 5 km de A; el camino PB lleva «?».' })),
    enunciado: 'El pozo P está sobre la mediatriz del camino AB que une dos caseríos. Si P queda a 5 km de A, ¿a cuánto queda de B?',
    datos: [D_MED, D_TEO],
    solucion: [{ texto: 'Todo punto de la mediatriz de AB está igual de lejos de A que de B.', ecuacion: junto('PB = PA') }],
    respuesta: ['PB = ', dF('5 km')] });
  EJ3.push({ nivel: 1, titulo: 'La antena y las carreteras',
    figura: fig(figBis(70, 6, { ph: '3 km', pk: '?', mapa: true, alt: 'Dos carreteras rectas salen de O. La antena P está sobre la bisectriz del ángulo, punteada. PH, el camino más corto a una carretera, mide 3 km; PK, a la otra, lleva «?».' })),
    enunciado: 'Dos carreteras rectas salen del cruce O. Una antena P está sobre la bisectriz del ángulo que forman, a 3 km de una carretera. ¿A cuánto queda de la otra?',
    datos: [D_BIS, D_DIST, D_TEO],
    solucion: [{ texto: 'Todo punto de la bisectriz está igual de lejos de los dos lados del ángulo, medido en perpendicular.', ecuacion: junto('PK = PH') }],
    respuesta: ['PK = ', dF('3 km')] });
  EJ3.push({ nivel: 1, titulo: 'El camino más corto',
    figura: fig((() => { const P = [1.5, 4], H = [1.5, 0], Q = [4.5, 0], Z0 = [-1.5, 0], Z1 = [6, 0];
      const fg = { alto: 200, vista: { x: [-2, 6.5], y: [-1.2, 5] }, alt: 'Una carretera recta y la casa P. Dos caminos rectos van de P a la carretera: PH, de 4 m, llega en ángulo recto, y PQ, de 5 m, llega inclinado.',
        puntos: [{ id: 'P', x: P[0], y: P[1], rotulo: 'P', lado: 90, sinPunto: true }, { id: 'H', x: H[0], y: H[1], rotulo: 'H', lado: -90, sinPunto: true }, { id: 'Q', x: Q[0], y: Q[1], rotulo: 'Q', lado: -90, sinPunto: true }, { id: 'Z0', x: Z0[0], y: 0, sinPunto: true }, { id: 'Z1', x: Z1[0], y: 0, sinPunto: true }],
        segmentos: [{ de: 'Z0', a: 'Z1', grosor: 'variable' }, { de: 'P', a: 'H', color: 'o', grosor: 'variable' }, { de: 'P', a: 'Q', color: 'i', grosor: 'variable' }], angulos: [{ en: 'H', de: 'Q', a: 'P', radio: 9 }] };
      return { objeto: 'angulos', figura: fg, ladosRot: [{ de: 'P', a: 'H', texto: '4 m', color: 'o', ref: 'Q', dist: 6 }, { de: 'P', a: 'Q', texto: '5 m', color: 'i', ref: 'H', dist: 6 }] }; })()),
    enunciado: 'De la casa P a una carretera recta salen dos caminos rectos: PH, de 4 m, llega en ángulo recto, y PQ, de 5 m, llega inclinado. ¿Cuál es la distancia de P a la carretera?',
    datos: [D_DIST],
    solucion: [{ texto: 'La distancia a una recta es el camino más corto, el perpendicular: PH. El inclinado siempre es más largo.', ecuacion: junto('4 m < 5 m') }],
    respuesta: ['La distancia es ', dF('4 m')] });
  EJ3.push({ nivel: 1, titulo: '¿Está en la mediatriz?',
    figura: fig(sinMapa(figMapa({ dx: 0, y: 3.5 }, { manija: false, llaves: false, lados: [{ de: 'P', a: 'A', texto: '7 cm', color: 'o', ref: 'B', dist: 7 }, { de: 'P', a: 'B', texto: '7 cm', color: 'i', ref: 'A', dist: 7 }],
      alt: 'Un segmento AB con su mediatriz punteada y un punto P a 7 cm de A y a 7 cm de B.' }))),
    enunciado: 'Un punto P está a 7 cm de A y a 7 cm de B. ¿Está P en la mediatriz de AB?',
    datos: [D_MED, D_REC],
    solucion: [{ texto: 'P equidista de A y de B. Por el recíproco, todo punto que equidista de A y de B está en la mediatriz.' }],
    respuesta: [dF('Sí'), ': equidista de A y de B'] });
  EJ3.push({ nivel: 1, titulo: 'Las dos mitades',
    figura: fig(figBis(80, 6, { sinP: true, alt: 'Un ángulo O de 80° con su bisectriz punteada, que lo parte en dos ángulos marcados con una rayita.' })),
    enunciado: 'La bisectriz de un ángulo de 80° lo parte en dos. ¿Cuánto mide cada parte?',
    datos: [D_BIS],
    solucion: [{ texto: 'Las dos partes son iguales y juntas forman el ángulo de 80°.', ecuacion: junto(['80° ÷ 2 = ', dF('40°')]) }],
    respuesta: ['Cada parte mide ', dF('40°')] });

  EJ3.push({ nivel: 2, titulo: 'Igualar en la mediatriz',
    figura: fig(sinMapa(figMedX('2x + 3', '15 cm', 'P está en la mediatriz de AB: PA mide 2x + 3 y PB, 15 cm.'))),
    enunciado: 'P está en la mediatriz de AB, con PA = 2x + 3 y PB = 15, en centímetros. ¿Cuánto vale x?',
    datos: [D_MED, D_TEO],
    solucion: [{ texto: 'En la mediatriz, PA = PB. Igualo y despejo.', ecuacion: [junto('2x + 3 = 15'), FL, junto('2x = 12'), FL, junto(['x = ', dF('6')])] },
      { texto: 'Compruebo: PA = 2 · 6 + 3 = 15 cm.' }],
    respuesta: ['x = ', dF('6')] });
  EJ3.push({ nivel: 2, titulo: 'Igualar en la bisectriz',
    figura: fig(figBis(60, 5, { ph: '3x − 1', pk: 'x + 7', alt: 'P está en la bisectriz del ángulo O. PH, su distancia a un lado, mide 3x − 1; PK, al otro, x + 7.' })),
    enunciado: 'P está en la bisectriz del ángulo O. Sus distancias a los lados son PH = 3x − 1 y PK = x + 7, en centímetros. ¿Cuánto mide PH?',
    datos: [D_BIS, D_DIST, D_TEO],
    solucion: [{ texto: 'En la bisectriz, PH = PK.', ecuacion: [junto('3x − 1 = x + 7'), FL, junto('2x = 8'), FL, junto('x = 4')] },
      { texto: 'Piden PH, no x.', ecuacion: junto(['PH = 3 · 4 − 1 = ', dF('11 cm')]) }],
    respuesta: ['PH = ', dF('11 cm')] });
  EJ3.push({ nivel: 2, titulo: 'El isósceles de la mediatriz',
    figura: fig(Object.assign(figIsoMed(55, { ang: [{ en: 'A', de: 'B', a: 'P', texto: '40°', color: 'h' }, { en: 'P', de: 'A', a: 'B', texto: '?', radio: 18 }],
      alt: 'P está en la mediatriz de AB, punteada; M es el punto medio de AB. El ángulo PAB mide 40° y el ángulo APB lleva «?». El dibujo no está a escala.' }), { sinEscala: true })),
    enunciado: 'P está en la mediatriz de AB. Si m∠PAB = 40°, ¿cuánto mide el ángulo APB? El dibujo no está a escala.',
    datos: [D_TEO, D_ISO, D_SUMA],
    solucion: [{ texto: 'PA = PB: △APB es isósceles y sus ángulos en A y en B miden 40°.' },
      { texto: 'El ángulo de P es lo que falta para 180°.', ecuacion: junto(['m∠APB = 180° − 40° − 40° = ', dF('100°')]) }],
    respuesta: ['m∠APB = ', dF('100°')] });
  EJ3.push({ nivel: 2, titulo: 'El ángulo en la antena',
    figura: fig(figBis(70, 6, { cortes: { p: 0 }, angP: undefined, alt: 'Un ángulo O de 70° partido por su bisectriz en dos de 35°. Desde P, en la bisectriz, PH llega en ángulo recto a un lado; el ángulo OPH lleva dos arcos.' })),
    enunciado: 'P está en la bisectriz de un ángulo O de 70°, y PH es su distancia a uno de los lados. ¿Cuánto mide el ángulo OPH?',
    datos: [D_BIS, D_DIST, D_SUMA],
    solucion: [{ texto: 'La bisectriz deja 35° en O. PH es perpendicular al lado: en H hay 90°.' },
      { texto: 'En △OHP, el tercer ángulo es lo que falta para 180°.', ecuacion: junto(['m∠OPH = 180° − 90° − 35° = ', dF('55°')]) }],
    respuesta: ['m∠OPH = ', dF('55°')] });
  EJ3.push({ nivel: 2, titulo: 'El perímetro con la mediatriz',
    figura: fig(figTriMed(6, 7, 9, { lados: [{ de: 'A', a: 'B', texto: '6 cm', dist: 6 }, { de: 'B', a: 'C', texto: '9 cm', dist: 6, en: figTriMed(6, 7, 9).s < 0.5 ? 0.75 : 0.25 }], alt: 'Triángulo ABC con AB = 6 cm y BC = 9 cm. La mediatriz de AC, punteada, pasa por su punto medio N y corta BC en P; se traza PA.' }).fig),
    enunciado: 'En △ABC, AB = 6 cm y BC = 9 cm. La mediatriz de AC corta BC en P. ¿Cuánto mide el perímetro de △ABP?',
    datos: [D_MED, D_TEO, D_PER],
    solucion: [{ texto: 'P está en la mediatriz de AC: PA = PC. Así, BP + PA = BP + PC = BC.' },
      { texto: 'El perímetro de △ABP suma AB, BP y PA.', ecuacion: junto(['6 + 9 = ', dF('15 cm')]) }],
    respuesta: ['Perímetro = ', dF('15 cm')] });

  EJ3.push({ nivel: 3, titulo: 'La perpendicular a la bisectriz',
    figura: fig(figPerpBis(14, 9, 60, { lados: [{ de: 'A', a: 'C', texto: '9 cm', ref: 'B', dist: 6 }, { de: 'A', a: 'B', texto: '14 cm', ref: 'C', dist: 16 }], alt: 'Triángulo ABC con AB = 14 cm y AC = 9 cm. La bisectriz del ángulo A va punteada; la perpendicular desde C a ella la corta en H y llega a AB en D.' })),
    enunciado: 'En △ABC, AB = 14 cm y AC = 9 cm. Desde C se traza la perpendicular a la bisectriz del ángulo A: la corta en H y llega a AB en D. ¿Cuánto mide BD?',
    alternativas: ['2,5 cm', '5 cm', '7 cm', '9 cm', '23 cm'],
    datos: [D_BIS, D_CRIT, D_SUMA, 'En triángulos congruentes, los lados correspondientes miden igual.'],
    solucion: [{ texto: 'En △AHD y △AHC: las mitades del ángulo A son iguales, los dos tienen 90° en H y AH es de los dos: ALA.' },
      { texto: 'AD y AC quedan frente a los ángulos rectos: AD = AC = 9 cm.', ecuacion: junto(['BD = 14 − 9 = ', dF('5 cm')]) },
      { texto: 'Las otras: 2,5 cm parte BD en dos; 7 cm es la mitad de AB; 9 cm es AD; 23 cm suma AB y AC.' }],
    respuesta: ['BD = ', dF('5 cm')] });
  EJ3.push({ nivel: 3, titulo: 'Dos bisectrices',
    figura: fig((() => { const B = [0, 0], C = [9, 0], A = [3.2, 5.6], bi = (V, P1, P2) => { const u1 = [P1[0] - V[0], P1[1] - V[1]], u2 = [P2[0] - V[0], P2[1] - V[1]], l1 = Math.hypot(...u1), l2 = Math.hypot(...u2); return [u1[0] / l1 + u2[0] / l2, u1[1] / l1 + u2[1] / l2]; };
      // I: el corte de las bisectrices de B y C (el punto que equidista de los tres lados).
      const db = bi(B, A, C), dc = bi(C, A, B), t = ((C[0] - B[0]) * dc[1] - (C[1] - B[1]) * dc[0]) / (db[0] * dc[1] - db[1] * dc[0]), I = [B[0] + t * db[0], B[1] + t * db[1]];
      const H = U.pie(I, A, B), K = U.pie(I, A, C), pt = (id, p, lado) => ({ id, x: p[0], y: p[1], rotulo: id, lado, sinPunto: true });
      const fg = { alto: 240, vista: { x: [-1.4, 10.4], y: [-1.2, 6.6] }, alt: 'Triángulo ABC. Las bisectrices de B y de C, punteadas, se cortan en P. PH (naranja) es la distancia de P al lado AB y PK (turquesa), al lado AC.',
        puntos: [pt('A', A, 90), pt('B', B, 200), pt('C', C, -20), pt('P', I, -90), pt('H', H, 160), pt('K', K, 30)],
        segmentos: [{ de: 'A', a: 'B' }, { de: 'B', a: 'C' }, { de: 'A', a: 'C' }, { de: 'B', a: 'P', discontinua: true, grosor: 'fino' }, { de: 'C', a: 'P', discontinua: true, grosor: 'fino' }, { de: 'P', a: 'H', color: 'o', grosor: 'variable' }, { de: 'P', a: 'K', color: 'i', grosor: 'variable' }],
        angulos: [{ en: 'B', de: 'C', a: 'P', color: 'h', radio: 30, rayita: 1, mide: U.angulo(B, C, I) }, { en: 'B', de: 'P', a: 'A', color: 'h', radio: 30, rayita: 1, mide: U.angulo(B, I, A) }, { en: 'C', de: 'P', a: 'B', color: 'h', radio: 30, rayita: 2, mide: U.angulo(C, I, B) }, { en: 'C', de: 'A', a: 'P', color: 'h', radio: 30, rayita: 2, mide: U.angulo(C, A, I) }, { en: 'H', de: 'B', a: 'P', radio: 8 }, { en: 'K', de: 'P', a: 'C', radio: 8 }] };
      PO.acomodarLetras(fg, ['A', 'B', 'C', 'P', 'H', 'K']);
      return { objeto: 'angulos', figura: fg }; })()),
    enunciado: 'En △ABC, las bisectrices de B y de C se cortan en P. La distancia de P al lado AB es 2x + 1 y al lado AC, x + 4, en centímetros. ¿Cuánto mide la distancia de P al lado BC?',
    alternativas: ['3 cm', '7 cm', '8 cm', '10 cm', '14 cm'],
    datos: [D_BIS, D_DIST, D_TEO],
    solucion: [{ texto: 'P está en la bisectriz de B: equidista de AB y de BC. Y en la de C: equidista de BC y de AC.' },
      { texto: 'Entonces las tres distancias son iguales: la de AB es igual a la de AC.', ecuacion: [junto('2x + 1 = x + 4'), FL, junto('x = 3')] },
      { texto: 'La distancia a BC es esa misma medida.', ecuacion: junto(['2 · 3 + 1 = ', dF('7 cm')]) },
      { texto: 'Las otras: 3 cm es x; 8 cm hace 2 · (3 + 1), sumando antes de multiplicar; 10 cm suma x y la distancia; 14 cm suma dos distancias.' }],
    respuesta: ['La distancia es ', dF('7 cm')] });
  EJ3.push({ nivel: 3, titulo: 'La mediatriz y el exterior',
    // (M2: dibujado con 50° en C, no 35°, y sin escala: así APB no se mide con transportador.)
    figura: fig(Object.assign(figTriMed(Math.sqrt(9.5 * 9.5 + 49 - 133 * Math.cos(50 * RAD)), 7, 9.5, { ang: [{ en: 'C', de: 'A', a: 'B', color: 'h', radio: 24 }, { en: 'P', de: 'A', a: 'B', texto: '?', radio: 16 }],
      alt: 'Triángulo ABC; la mediatriz de AC, punteada, corta BC en P y se traza PA. El ángulo C, de 35°, lleva su arco y el ángulo APB, «?». El dibujo no está a escala.' }).fig, { sinEscala: true })),
    enunciado: 'En △ABC, la mediatriz de AC corta BC en P y se traza PA. Si m∠C = 35°, ¿cuánto mide el ángulo APB? El dibujo no está a escala.',
    alternativas: ['35°', '55°', '110°', '145°', '70°'],
    datos: [D_TEO, D_ISO, 'Un ángulo exterior de un triángulo mide lo que suman los dos interiores que no están a su lado.'],
    solucion: [{ texto: 'P está en la mediatriz de AC: PA = PC. △APC es isósceles: m∠PAC = m∠C = 35°.' },
      { texto: 'El ángulo APB es exterior de △APC, junto a P.', ecuacion: junto(['m∠APB = 35° + 35° = ', dF('70°')]) },
      { texto: 'Las otras: 35° copia el ángulo C; 55° usa 90° − 35°; 110° es el ángulo APC; 145° resta 35° de 180°.' }],
    respuesta: ['m∠APB = ', dF('70°')] });
  EJ3.push({ nivel: 3, titulo: 'Bisectriz y mediatriz juntas',
    figura: fig((() => { const B = [0, 0], C = [8, 0], g = 40 * RAD, A = U.polar(B, 8 * Math.sin(g) / Math.sin(Math.PI - 3 * g), 80), D = [C[0] + (A[0] - C[0]) * 0, 0];
      // D: donde la bisectriz de B corta AC.
      const db = [Math.cos(40 * RAD), Math.sin(40 * RAD)], u = [A[0] - C[0], A[1] - C[1]], t = ((C[0] - B[0]) * u[1] - (C[1] - B[1]) * u[0]) / (db[0] * u[1] - db[1] * u[0]), Dp = [t * db[0], t * db[1]];
      const pt = (id, p, lado) => ({ id, x: p[0], y: p[1], rotulo: id, lado, sinPunto: true });
      const fg = { alto: 240, alt: 'Triángulo ABC con el ángulo A de 60°. La bisectriz de B corta AC en D, y DB = DC (una rayita). El ángulo C lleva «?».',
        puntos: [pt('A', A, 90), pt('B', B, 200), pt('C', C, -20), pt('D', Dp, 40)],
        segmentos: [{ de: 'A', a: 'B' }, { de: 'B', a: 'C' }, { de: 'A', a: 'C' }, { de: 'B', a: 'D' }],
        angulos: [{ en: 'A', de: 'B', a: 'C', texto: '60°', color: 'h', radio: 20, mide: U.angulo(A, B, C) }, { en: 'B', de: 'C', a: 'D', color: 'h', radio: 34, rayita: 1, mide: 40 }, { en: 'B', de: 'D', a: 'A', color: 'h', radio: 34, rayita: 1, mide: 40 }, { en: 'C', de: 'A', a: 'B', texto: '?', radio: 22 }] };
      const xs = [A, B, C].map(q => q[0]), ys = [A, B, C].map(q => q[1]);
      fg.vista = { x: [Math.min(...xs) - 1.4, Math.max(...xs) + 1.4], y: [-1.2, Math.max(...ys) + 1] };
      PO.acomodarLetras(fg, ['A', 'B', 'C', 'D']);
      return torcer({ objeto: 'angulos', figura: fg, llaves: [{ de: 'B', a: 'D', marcas: 1, ref: 'A', dist: 9 }, { de: 'D', a: 'C', marcas: 1, ref: 'B', dist: 9 }] }, 1.5); })()),
    enunciado: 'En △ABC, m∠A = 60°. La bisectriz del ángulo B corta AC en D, y D está en la mediatriz de BC. ¿Cuánto mide el ángulo C? El dibujo no está a escala.',
    alternativas: ['30°', '40°', '60°', '80°', '120°'],
    datos: [D_BIS, D_TEO, D_ISO, D_SUMA],
    solucion: [{ texto: 'D está en la mediatriz de BC: DB = DC, y △DBC es isósceles: m∠DBC = m∠C.' },
      { texto: 'La bisectriz parte B en dos iguales: m∠B = 2 · m∠C. Con m∠C = x, los tres ángulos suman 180°.', ecuacion: [junto('60 + 2x + x = 180'), FL, junto('x = 40')] },
      { texto: 'Entonces m∠C = 40° y m∠B = 80°.', ecuacion: junto(['m∠C = ', dF('40°')]) },
      { texto: 'Las otras: 30° toma m∠B como el triple de m∠C; 60° copia el ángulo A; 80° es el ángulo B; 120° suma B y C.' }],
    respuesta: ['m∠C = ', dF('40°')] });
  EJ3.push({ nivel: 3, titulo: 'Igual de lejos de dos carreteras',
    figura: fig(figBis(64, 6, { ph: '4 km', pk: '4 km', cortes: { p: 0 }, mapa: true, alt: 'Dos carreteras salen del cruce O formando 64°. La antena P, entre ellas, queda a 4 km de cada una (PH y PK). Se traza OP, punteada; los ángulos OPH y OPK llevan dos arcos.' })),
    enunciado: 'Dos carreteras rectas salen del cruce O formando 64°. Una antena P, entre ellas, queda a 4 km de cada carretera; PH y PK son esas distancias. ¿Cuánto mide el ángulo HPK?',
    alternativas: ['32°', '58°', '64°', '128°', '116°'],
    datos: [D_DIST, D_RECB, D_SUMA],
    solucion: [{ texto: 'P equidista de los dos lados: está en la bisectriz. Cada mitad del ángulo O mide 32°.' },
      { texto: 'En △OHP, con 90° en H, el ángulo OPH es lo que falta para 180°. En △OKP, igual.', ecuacion: junto('m∠OPH = m∠OPK = 180° − 90° − 32° = 58°') },
      { texto: 'El ángulo HPK junta los dos.', ecuacion: junto(['m∠HPK = 2 · 58° = ', dF('116°')]) },
      { texto: 'Las otras: 32° es la mitad de O; 58° es solo una parte; 64° copia el ángulo O; 128° lo duplica.' }],
    respuesta: ['m∠HPK = ', dF('116°')] });

  const lugares = {
    id: 'mediatriz-bisectriz',
    titulo: 'Mediatriz y bisectriz',
    pregunta: '¿Dónde están los puntos igual de lejos de dos lugares?',
    temas: ['Teorema de la mediatriz y de la bisectriz'],
    pieza: GO,
    aprendizaje: 'Todo punto de la mediatriz equidista de los extremos del segmento; todo punto de la bisectriz, de los lados del ángulo, medido en perpendicular.',
    actividad: 'Mover un pozo hasta que quede igual de lejos de dos caseríos.',
    // Lee: equidistar, la mediatriz y la distancia a una recta. No dice qué pasa con un punto de la bisectriz (eso es la
    // predicción).
    lee: {
      tarjetas: [
        { titulo: 'Igual de lejos', texto: 'Los caseríos A y B, a 6 km uno del otro, quieren abrir un pozo P que quede igual de lejos de los dos. Estar a la misma distancia de dos lugares se dice equidistar.',
          pieza: GO, dibujo: fig(figMapa({ dx: 1.5, y: 2 }, { manija: false, alt: 'Mapa con dos caseríos, A y B, a 6 km, y la mediatriz de AB punteada. El pozo P está fuera de ella: más cerca de B que de A.' })) },
        { titulo: 'La mediatriz', texto: 'La mediatriz de AB es la recta perpendicular a AB que pasa por su punto medio M. En el mapa va punteada, con el ángulo recto en M.' },
        { titulo: 'La distancia a una recta', texto: 'La distancia de un punto a una carretera recta es el camino más corto hasta ella: el que llega en ángulo recto, en perpendicular. Un camino inclinado siempre es más largo.' },
        { titulo: 'Qué mirar al jugar', texto: 'Mueve el pozo P, arrastrándolo o con los controles. Compara PA y PB cuando P está sobre la línea punteada y cuando sale de ella.' },
      ],
    },
    ejemplos: EJ3,
    juega: {
      pieza: GO,
      consigna: 'Los caseríos A y B están a 6 km uno del otro, y el pozo P tiene que servir a los dos.',
      mision: {
        texto: 'Lleva el pozo P a 5 km de A y a 5 km de B.',
        logrado: v => igual(dPA(v), 5) && igual(dPB(v), 5),
        bien: 'PA = PB = 5 km: el pozo quedó en la mediatriz.',
      },
      voz: 'Sube y corre el pozo. ¿Dónde quedan iguales los dos caminos?',
      leyenda: [
        { s: 'A, B', t: 'los caseríos' },
        { s: 'P', t: 'el pozo; se arrastra' },
        { s: dO('PA'), t: 'el camino del pozo a A' },
        { s: dI('PB'), t: 'el camino del pozo a B' },
        { s: 'línea punteada', t: 'la mediatriz de AB' },
        { s: 'M', t: 'el punto medio de AB' },
      ],
      controles: [
        { id: 'dx', etiqueta: 'P a los lados de M, en km', min: -2.5, max: 2.5, paso: 0.5, inicio: 1.5, unidad: 'km', decimales: 1 },
        { id: 'y', etiqueta: 'P a lo alto, sobre AB, en km', min: 1, max: 5, paso: 1, inicio: 2, unidad: 'km', decimales: 0 },
      ],
      dibujo: v => ({ datos: figMapa(v), estado: {} }),
      arrastres: [{ id: 'pozo-p', etiqueta: 'pozo P', color: 'c-h',
        donde: v => PO.aPantalla(figMapa(v), [v.dx, v.y]),
        mover: (pt, v) => { const q = PO.aPlano(figMapa(v), pt); return { dx: q[0], y: q[1] }; } }],
      lectura: v => { const a = dPA(v), b = dPB(v);
        return igual(a, b) ? [dO('PA'), ' = ', dI('PB'), junto(` ${entero(a) ? '=' : '≈'} ${km(a)}: igual de lejos de A y de B`)]
          : [dO(junto(`PA ${entero(a) ? '=' : '≈'} ${km(a)}`)), ' y ', dI(junto(`PB ${entero(b) ? '=' : '≈'} ${km(b)}`)), junto(`: más cerca de ${a < b ? 'A' : 'B'}`)]; },
      minimo: 4,
    },
    predice: {
      pregunta: 'Dos carreteras rectas se cruzan en O y forman 60°. Una antena P está sobre la bisectriz de ese ángulo, a 5 km de O, y queda a 2,5 km de una carretera. ¿A cuánto queda de la otra?',
      datos: [D_DIST, 'La bisectriz parte el ángulo de 60° en dos de 30°.'],
      voz: 'Piensa cómo se mide la distancia a una carretera.',
      opciones: [
        { id: 'c', texto: 'A 2,5 km', correcta: true },
        { id: 'op', texto: 'A 5 km, lo mismo que hasta el cruce', error: 'GE-CON6', siFuera: 'Los 5 km van hasta O, el cruce. La distancia a una carretera se mide en perpendicular.' },
        { id: 'depende', texto: 'Depende de hacia dónde se mida', error: 'GE-CON19', siFuera: 'Hacia un punto cualquiera sí cambia; la distancia es el camino perpendicular, y ese es uno solo.' },
        { id: 'tramo', texto: 'A unos 4,3 km', error: 'GE-CON7', siFuera: 'Unos 4,3 km mide OH, el tramo sobre la carretera; la distancia es la perpendicular desde P.' },
      ],
      dibujo: fig(figBis(60, 5, { ph: '2,5 km', pk: '?', op: '5 km', mapa: true, alt: 'Dos carreteras salen del cruce O formando 60°; su bisectriz va punteada. La antena P está en ella, a 5 km de O. PH, el camino perpendicular a una carretera, mide 2,5 km; PK, a la otra, lleva «?».' })),
      revelar: fig(figBis(60, 5, { ph: '2,5 km', pk: '2,5 km', op: '5 km', mapa: true, alt: 'La antena P sobre la bisectriz: PH y PK, sus caminos perpendiculares a las dos carreteras, miden 2,5 km cada uno.' })),
      coincide: 'Coincide: PK también mide 2,5 km. Los triángulos OHP y OKP son congruentes.',
      noCoincide: 'Revisemos: medida en perpendicular, la antena queda a 2,5 km de las dos carreteras.',
    },
    mira: {
      pieza: GO,
      datos: figBis(60, 5, { ph: '2,5 km', pk: '?', pkDesde: 1, pk2: '2,5 km', pk2Desde: 4, op: '5 km', mapa: true, cortes: { pk: 1, p: 2 },
        alt: 'Las carreteras forman 60° en O y la bisectriz las parte en dos de 30°. Los triángulos OHP y OKP tienen 90° en H y en K, 60° en P y el lado OP de los dos: son congruentes, y PK = PH = 2,5 km.' }),
      voz: 'Compara los dos triángulos rectángulos, pieza por pieza.',
      pasos: [
        { estado: { corte: 0 }, texto: 'La antena está en la bisectriz: las dos mitades del ángulo miden 30°.', ecuacion: junto(['60° ÷ 2 = ', dH('30°')]) },
        { estado: { corte: 1 }, texto: 'Los caminos más cortos a cada carretera, PH y PK, llegan en ángulo recto.' },
        { estado: { corte: 2 }, texto: 'En △OHP y △OKP, el tercer ángulo también es igual.', ecuacion: junto(['m∠OPH = m∠OPK = 180° − 90° − 30° = ', dH('60°')]) },
        { estado: { corte: 3 }, texto: 'OP es de los dos, entre 30° y 60°: por ALA, son congruentes.' },
        { estado: { corte: 4 }, texto: 'PH y PK quedan frente a los ángulos de 30°: miden igual.', ecuacion: junto([dI('PK'), ' = ', dO('PH'), ' = 2,5 km']) },
      ],
    },
    regla: {
      texto: 'Todo punto de la mediatriz de AB equidista de A y de B. Todo punto de la bisectriz de un ángulo equidista de sus lados, en perpendicular. Y al revés.',
      ecuacion: [{ llave: [dO('PA'), ' = ', dI('PB')], nota: 'en la mediatriz', color: 'c-o' }, Y, { llave: [dO('PH'), ' = ', dI('PK')], nota: 'en la bisectriz', color: 'c-i' }],
      condicion: 'al revés, quien equidista de A y B, en la mediatriz; quien equidista de los lados dentro del ángulo, en la bisectriz.',
      voz: 'Equidistar se mide con perpendiculares, no a ojo.',
      // (Auditoría del 19 nov, M9: la bisectriz ya tiene su dibujo en «Mira»; la regla muestra la mediatriz, con A, B y P.)
      dibujo: { pieza: GO, datos: figMapa({ dx: 0, y: 4 }, { manija: false, alt: 'El pozo P sobre la mediatriz de AB, punteada: PA = PB = 5 km.' }), estado: {} },
    },
    // Así se resuelve: los recíprocos (P equidista de los lados: m∠POX es la mitad de O; o P en la mediatriz con el ángulo
    // de P dado: el de la base). «Ahora tú» pide igualar las dos distancias, el perímetro con la mediatriz, la
    // perpendicular a la bisectriz y el ángulo de P en la mediatriz.
    resuelve: {
      pieza: GO,
      generar(s) {
        const r = azar(s + 900);
        if (s % 2 === 0) {
          const al = 2 * r.ent(25, 40), d = r.ent(2, 6);
          const F = figBis(al, 6, { ph: km(d), pk: km(d), mapa: true, alt: `Dos carreteras salen del cruce O formando ${al}°. La antena P, entre ellas, queda a ${km(d)} de cada una. OP va punteada.` });
          return {
            enunciado: `Dos carreteras rectas salen del cruce O formando ${al}°. Una antena P, entre ellas, queda a ${km(d)} de cada carretera. ¿Qué ángulo forma OP con cada carretera?`,
            datos: [D_DIST, D_RECB],
            dibujo: fig(F),
            pasos: [
              { tipo: 'pide', texto: 'Piden el ángulo entre OP y una carretera, en O.' },
              { tipo: 'datos', texto: `P está a ${km(d)} de las dos carreteras, medido en perpendicular. Las carreteras forman ${al}°.` },
              { tipo: 'regla', texto: 'Un punto del interior que equidista de los dos lados de un ángulo está en su bisectriz (el recíproco).' },
              { tipo: 'aplica', texto: 'Entonces OP es la bisectriz: parte el ángulo O en dos iguales.', ecuacion: junto(['m∠HOP = m∠KOP = ', `${al}° ÷ 2 = `, dF(`${al / 2}°`)]) },
              { tipo: 'sentido', texto: `Tiene sentido: las dos mitades juntas dan los ${al}° del cruce.` },
            ],
            respuesta: ['Forma ', dF(`${al / 2}°`), ' con cada una'],
          };
        }
        let th, F;
        for (let i = 0; ; i++) { th = 5 * r.ent(7, 11); F = Object.assign(figIsoMed(th <= 45 ? th + 15 : th - 15, { ang: [{ en: 'P', de: 'A', a: 'B', texto: gr(180 - 2 * th), color: 'h', radio: 18 }, { en: 'A', de: 'B', a: 'P', texto: '?' }], alt: `P está en la mediatriz de AB, punteada. El ángulo APB mide ${180 - 2 * th}° y el ángulo PAB lleva «?». El dibujo no está a escala.` }), { sinEscala: true }); if (cabe(F) || i > 200) break; }
        return {
          enunciado: `P está en la mediatriz de AB y m∠APB = ${180 - 2 * th}°. ¿Cuánto mide el ángulo PAB?${NO_ESC}`,
          datos: [D_TEO, D_ISO, D_SUMA],
          dibujo: fig(F),
          pasos: [
            { tipo: 'pide', texto: 'Piden m∠PAB, un ángulo de la base del triángulo APB.' },
            { tipo: 'datos', texto: `P está en la mediatriz de AB, y el ángulo de P mide ${180 - 2 * th}°.` },
            { tipo: 'regla', texto: 'Un punto de la mediatriz equidista de A y de B: PA = PB, y △APB es isósceles. Sus ángulos de la base son iguales.' },
            { tipo: 'cuentas', texto: 'Los dos ángulos de la base se reparten lo que deja el de P.', ecuacion: junto(['m∠PAB = ', `(180° − ${180 - 2 * th}°) ÷ 2 = `, dF(`${th}°`)]) },
            { tipo: 'sentido', texto: `Compruebo: ${th}° + ${th}° + ${180 - 2 * th}° = 180°.` },
          ],
          respuesta: ['m∠PAB = ', dF(`${th}°`)],
        };
      },
    },
    ahoraTu: {
      pieza: GO,
      voz: 'Primero, ¿qué distancias son iguales? Después, las cuentas.',
      generar(s) { return conCuatro([r => casoIgualar(r, true), r => casoIgualar(r, false), casoPerimetro, casoPerpBis, casoIsoMed][s % 5], azar(s + 7), firmasDe(EJ3)); },
    },
  };

  // ---------- Idea 4 (fase 3, 19 nov): base media del triángulo ----------
  // Objeto de la primera pantalla: un tijeral con su listón, el nudillo que une la mitad de una viga inclinada con la mitad
  // de la otra (geo-objeto, armazon de tipo 'taller'; dibujo de prueba). B y C son los apoyos, a 8 m; A, la cumbrera.
  // Cambia: la cumbrera A. · Permanece: la viga de abajo, BC = 8 m. · Progresa: la altura del listón; su largo no cambia.
  // · Se reserva: el recíproco (la paralela por un punto medio llega al otro: la predicción) y la prueba con dos
  // congruencias (sin paralelogramo: «Mira»). · Debe verse: MN = 4 m y paralelo a BC, sea cual sea la forma.
  // Colores (propuesta §6): MN, la base media, naranja; BC, el lado con que se compara, turquesa; las vigas inclinadas, la
  // prolongación y lo que no es dato, en tinta; los ángulos iguales de «Mira», en carmín con 1, 2 o 3 arcos.
  const BC4 = 8;
  // El triángulo de lados BC = a, AC = b y AB = c, con B en el origen y C a la derecha: [A, B, C].
  const porLados = (a, b, c) => { const x = (a * a + c * c - b * b) / (2 * a); return [[x, Math.sqrt(Math.max(0, c * c - x * x))], [0, 0], [a, 0]]; };
  // Figura de la base media. A, B, C: vértices; o.medios: qué puntos medios van ('M' de AB, 'N' de AC, 'P' de BC, 'Q' de
  // AM, 'R' de AN); o.segs: segmentos extra [de, a, opciones]; o.lados: ladosRot; o.llaves: true pone las rayitas de los
  // puntos medios; o.ang: ángulos; o.objeto: 'taller' lo arma como tijeral.
  function figBase(A, B, C, o = {}) {
    const M = U.medio(A, B), N = U.medio(A, C), P = U.medio(B, C), Q = U.medio(A, M), R = U.medio(A, N);
    const pos = Object.assign({ A, B, C, M, N, P, Q, R }, o.mas || {}), md = o.medios || ['M', 'N'];
    const pt = (id, lado) => ({ id, x: pos[id][0], y: pos[id][1], rotulo: id, lado, sinPunto: true });
    const fg = { alt: o.alt, alto: o.alto || 250, puntos: [pt('A', 90), pt('B', 200), pt('C', -20)].concat(md.map(id => pt(id, 0))),
      segmentos: [{ de: 'A', a: 'B' }, { de: 'A', a: 'C' }, Object.assign({ de: 'B', a: 'C' }, o.bcColor === false ? {} : { color: 'i', grosor: 'variable' }, o.paralelas ? { paralela: 1 } : {})]
        .concat((o.segs || []).map(([de, a, x]) => Object.assign({ de, a }, x || {}))),
      angulos: (o.ang || []).map(x => Object.assign({ radio: 20, holgura: 6, marcas: 1, mide: U.angulo(pos[x.en], pos[x.de], pos[x.a]) }, x)) };
    const xs = [A, B, C].map(q => q[0]), ys = [A, B, C].map(q => q[1]), w = Math.max(...xs) - Math.min(...xs), h = Math.max(...ys) - Math.min(...ys);
    const m = o.margen || 0.12 * Math.max(w, 1.2 * h);
    fg.vista = o.vista || { x: [Math.min(...xs) - m, Math.max(...xs) + m], y: [Math.min(...ys) - m * (o.abajo || 1), Math.max(...ys) + m * 0.8] };
    PO.acomodarLetras(fg, fg.puntos.map(q => q.id));
    // M y N van adentro, entre la base media y el lado de abajo: afuera están las llaves de sus mitades.
    const entre = (V, p, q) => { const a1 = Math.atan2(p[1] - V[1], p[0] - V[0]), a2 = Math.atan2(q[1] - V[1], q[0] - V[0]); return U.grados(Math.atan2(Math.sin(a1) + Math.sin(a2), Math.cos(a1) + Math.cos(a2))); };
    void entre;
    // Las letras de los puntos medios van afuera, en perpendicular a su lado y más lejos: pasan las tablas del tijeral y
    // quedan en el hueco entre las dos llaves de sus mitades. La de A, sobre la cumbrera.
    const fuera = (V, P1, P2, ref) => { const u = [P2[0] - P1[0], P2[1] - P1[1]], nn = [-u[1], u[0]], s = Math.sign(nn[0] * (V[0] - ref[0]) + nn[1] * (V[1] - ref[1])) || 1; return U.grados(Math.atan2(s * nn[1], s * nn[0])); };
    for (const [id, V, P1, P2, ref] of [['M', M, A, B, C], ['N', N, A, C, B], ['P', P, B, C, A], ['Q', Q, A, B, C], ['R', R, A, C, B]]) { const pt0 = fg.puntos.find(x => x.id === id); if (pt0) Object.assign(pt0, { lado: fuera(V, P1, P2, ref), lejos: o.llaves === false ? 4 : 11 }); }
    if (o.taller) Object.assign(fg.puntos.find(x => x.id === 'A'), { lado: 90, lejos: 7 });
    const ll = [];
    if (o.llaves !== false) {
      if (md.includes('M')) ll.push({ de: 'A', a: 'M', marcas: 1, ref: 'C' }, { de: 'M', a: 'B', marcas: 1, ref: 'C' });
      if (md.includes('N')) ll.push({ de: 'A', a: 'N', marcas: 2, ref: 'B' }, { de: 'N', a: 'C', marcas: 2, ref: 'B' });
      if (md.includes('P')) ll.push({ de: 'B', a: 'P', marcas: 3, ref: 'A' }, { de: 'P', a: 'C', marcas: 3, ref: 'A' });
    }
    // La medida de un lado que lleva las llaves de sus mitades va más afuera, pasando las llaves.
    const conLlave = { AB: md.includes('M'), AC: md.includes('N'), BC: md.includes('P') };
    const lados = (o.lados || []).map(t => (o.llaves !== false && conLlave[[t.de, t.a].sort().join('')] ? Object.assign({}, t, { dist: Math.max(t.dist || 6, 19) }, t.en === undefined ? { en: 0.25 } : {}) : t));
    const F = Object.assign({ objeto: 'angulos', figura: fg }, ll.length ? { llaves: ll } : {}, lados.length ? { ladosRot: lados } : {}, o.sinEscala ? { sinEscala: true } : {});
    if (o.taller) Object.assign(F, { objeto: 'armazon', tipo: 'taller', vigas: [{ de: 'A', a: 'B' }, { de: 'A', a: 'C' }, { de: 'B', a: 'C' }, { de: 'M', a: 'N' }], pernos: ['A', 'B', 'C', 'M', 'N'] });
    return F;
  }
  const MN_O = { color: 'o', grosor: 'variable' };
  // El tijeral del juego: A en (ax, ay), B y C a 8 m; el listón MN y sus medidas.
  function figListon(v, o = {}) {
    const A = [v.ax, v.ay], F = figBase(A, [0, 0], [BC4, 0], { taller: true, paralelas: true, segs: [['M', 'N', Object.assign({ paralela: 1 }, MN_O)]], vista: { x: [-1.5, 9.5], y: [-1.6, 6.9] }, alto: 262,
      lados: o.lados || [{ de: 'B', a: 'C', texto: '8 m', color: 'i', ref: 'A', dist: 10 }],
      alt: o.alt || `Un tijeral con la cumbrera A a ${f(v.ay)} m de alto; B y C, los apoyos, están a 8 m. El listón MN une la mitad de las dos vigas inclinadas: mide 4 m, va paralelo a BC y queda a ${f(v.ay / 2)} m del piso.` });
    return Object.assign(F, o.manija === false ? {} : { manija: 'A' });
  }
  // La prueba de «Mira» (sin paralelogramo), sobre el tijeral de 5 m, 7 m y 8 m: D sale de alargar MN con ND = MN.
  const [A4, B4, C4] = porLados(8, 7, 5), M4 = U.medio(A4, B4), N4 = U.medio(A4, C4), D4 = [2 * N4[0] - M4[0], 2 * N4[1] - M4[1]];
  const MIRA4 = (() => {
    const F = figBase(A4, B4, C4, { mas: { D: D4 }, paralelas: false, vista: { x: [-1.2, 10.4], y: [-1.5, 5.4] }, alto: 240,
      segs: [['M', 'N', MN_O], ['N', 'D', { discontinua: true, desde: 1 }], ['C', 'D', { desde: 1 }], ['M', 'C', { discontinua: true, grosor: 'fino', desde: 4 }]],
      lados: [{ de: 'B', a: 'C', texto: '8 m', color: 'i', ref: 'A', dist: 7 }],
      ang: [{ en: 'N', de: 'A', a: 'M', color: 'h', radio: 16, desde: 2, hasta: 3 }, { en: 'N', de: 'C', a: 'D', color: 'h', radio: 16, desde: 2, hasta: 3 },
        { en: 'A', de: 'B', a: 'C', color: 'h', marcas: 2, radio: 18, desde: 3, hasta: 3 }, { en: 'C', de: 'A', a: 'D', color: 'h', marcas: 2, radio: 18, desde: 3, hasta: 3 },
        { en: 'M', de: 'B', a: 'C', color: 'h', marcas: 3, radio: 18, desde: 4, hasta: 4 }, { en: 'C', de: 'D', a: 'M', color: 'h', marcas: 3, radio: 18, desde: 4, hasta: 4 }],
      alt: 'El tijeral ABC con M y N, la mitad de AB y de AC. MN se alarga hasta D, con ND = MN, y se traza CD: el triángulo CND copia al ANM, y el triángulo CDM copia al MBC. Así MD = BC, y MN es la mitad de BC.' });
    F.figura.puntos.push({ id: 'D', x: D4[0], y: D4[1], rotulo: 'D', lado: 0, sinPunto: true, desde: 1 });
    // N, entre NA y ND (arriba): abajo van NC y el alargue.
    const dN = p => Math.atan2(p[1] - N4[1], p[0] - N4[0]), a1 = dN(A4), a2 = dN(D4);
    Object.assign(F.figura.puntos.find(q => q.id === 'N'), { lado: U.grados(Math.atan2(Math.sin(a1) + Math.sin(a2), Math.cos(a1) + Math.cos(a2))), lejos: 4 });
    F.llaves.push({ de: 'M', a: 'N', marcas: 3, ref: 'B', color: 'o', desde: 1 }, { de: 'N', a: 'D', marcas: 3, ref: 'B', color: 'o', desde: 1 });
    return F;
  })();
  const D_BM = 'Base media: el segmento que une los puntos medios de dos lados de un triángulo.';
  const D_TBM = 'La base media es paralela al tercer lado y mide su mitad.';
  const D_RBM = 'La paralela al tercer lado que sale de un punto medio llega al punto medio del otro lado.';
  const D_COR = 'Entre paralelas cortadas por una secante, los ángulos correspondientes miden igual.';
  const D_CONJ = 'Entre paralelas, los conjugados internos suman 180°.';
  // Un triángulo con lados enteros distintos que cierre (para los tipos de «Ahora tú»).
  // (BC = a abajo; A queda alta y sobre la base: ni chato ni muy corrido a un lado.)
  function lados3(r, lo, hi) {
    for (;;) {
      const a = r.ent(lo, hi), b = r.ent(lo, hi), c = r.ent(lo, hi);
      if (new Set([a, b, c]).size < 3 || a + b <= c + 1 || a + c <= b + 1 || b + c <= a + 1) continue;
      const [A] = porLados(a, b, c);
      if (A[1] >= 0.5 * a && A[1] <= 0.95 * a && A[0] > 0.15 * a && A[0] < 0.85 * a) return [a, b, c];
    }
  }
  // Tipo 0: la base media o el lado, uno a partir del otro.
  function casoMitad(r) {
    for (let i = 0; i < 400; i++) {
      const [a, b, c] = lados3(r, 5, 12), alReves = r.ent(0, 1) === 1, bc = alReves ? 2 * r.ent(3, 9) + r.de([0, 1]) : 2 * r.ent(3, 9), mn = bc / 2;
      const [A, B, C] = porLados(bc, b * bc / a, c * bc / a);
      const F = figBase(A, B, C, { paralelas: true, segs: [['M', 'N', Object.assign({ paralela: 1 }, MN_O)]], lados: [{ de: 'M', a: 'N', texto: alReves ? cm(mn) : '?', color: 'o', ref: 'A', dist: 8 }, { de: 'B', a: 'C', texto: alReves ? '?' : cm(bc), color: 'i', ref: 'A', dist: 6 }],
        alt: `Triángulo ABC con M y N, puntos medios de AB y AC. ${alReves ? `La base media MN mide ${cm(mn)}; BC lleva «?».` : `BC mide ${cm(bc)}; la base media MN lleva «?».`}` });
      if (!cabe(F)) continue;
      const v = alReves ? bc : mn, base = alReves ? mn : bc;
      const ops = opciones(v, [
        { id: 'igual', valor: base, error: 'GE-CON10', siFuera: `Ver que MN y BC son paralelos está bien; pero no miden lo mismo: MN es la mitad.` },
        { id: 'reves', valor: alReves ? mn / 2 : bc * 2, error: 'GE-CON11', siFuera: alReves ? 'Usar la mitad está bien; pero aquí la mitad es MN, y se pide BC: se duplica.' : 'Usar el doble está bien al revés; aquí se pide MN, la mitad de BC.' },
        // (Auditoría del 19 nov, M14: un tercio no salía de ningún paso; partir dos veces sí: la base media de la base media.)
        { id: 'cuarto', valor: alReves ? mn * 4 : bc / 4, error: 'GE-CON21', siFuera: alReves ? 'Duplicar está bien una vez; BC es el doble de MN, no su cuádruple.' : 'Partir en dos está bien una vez; MN ya es la mitad de BC, no su cuarta parte.' },
        { id: 'resta', valor: alReves ? mn + 2 : bc - 2, error: 'GE-CON44', siFuera: 'Comparar MN con BC está bien; la relación es la mitad, no una resta.' },
      ], cm);
      if (ops.length < 4) continue;
      return { pregunta: alReves ? `En △ABC, M y N son los puntos medios de AB y AC, y MN = ${cm(mn)}. ¿Cuánto mide BC?` : `En △ABC, M y N son los puntos medios de AB y AC, y BC = ${cm(bc)}. ¿Cuánto mide MN?`,
        datos: [D_BM, D_TBM], dibujo: fig(F), opciones: ops,
        solucion: { texto: 'MN es la base media: mide la mitad de BC.', ecuacion: junto(alReves ? `BC = 2 · ${f(mn)} = ${cm(bc)}` : `MN = ${bc} ÷ 2 = ${cm(mn)}`) } };
    }
    throw new Error('casoMitad sin caso');
  }
  // Tipo 1: el recíproco: la paralela por M llega a la mitad de AC.
  function casoReciproco(r) {
    for (let i = 0; i < 400; i++) {
      const [a, b, c] = lados3(r, 6, 13), pideNC = r.ent(0, 1) === 1, [A, B, C] = porLados(a, b, c);
      const F = figBase(A, B, C, { medios: ['M'], paralelas: true, segs: [['M', 'X', Object.assign({ paralela: 1 }, MN_O)]], lados: [{ de: 'A', a: 'C', texto: cm(b), ref: 'B', dist: 6, en: 0.22 }],
        alt: `Triángulo ABC con M, punto medio de AB. Desde M sale una paralela a BC que llega a AC; AC mide ${cm(b)}.` });
      const N = U.medio(A, C); F.figura.puntos.push({ id: 'X', x: N[0], y: N[1], rotulo: 'N', lado: U.grados(Math.atan2(N[1] - B[1], N[0] - B[0])), lejos: 4, sinPunto: true });
      if (!cabe(F)) continue;
      const v = b / 2;
      const ops = opciones(v, [
        { id: 'am', valor: c / 2, error: 'GE-CON20', siFuera: 'Ver que N es especial está bien; pero AN es la mitad de AC, no la de AB.' },
        { id: 'entero', valor: b, error: 'GE-CON45', siFuera: `${cm(b)} es AC entero; N lo parte en dos.` },
        { id: 'tercio', valor: b / 3, error: 'GE-CON21', siFuera: 'Partir AC está bien; pero la paralela por el punto medio lo parte en mitades.' },
        { id: 'bc', valor: a / 2, error: 'GE-CON10', siFuera: `${cm(a / 2)} sería MN, la mitad de BC; se pide un tramo de AC.` },
      ], cm);
      if (ops.length < 4) continue;
      // (M14: AB va en el enunciado, porque un distractor es su mitad.)
      return { pregunta: `En △ABC, M es el punto medio de AB, AB = ${cm(c)} y AC = ${cm(b)}. Por M se traza una paralela a BC, que corta AC en N. ¿Cuánto mide ${pideNC ? 'NC' : 'AN'}?`,
        datos: [D_BM, D_RBM], dibujo: fig(F), opciones: ops,
        solucion: { texto: 'La paralela a BC por el punto medio de AB llega al punto medio de AC.', ecuacion: junto(`${pideNC ? 'NC' : 'AN'} = ${b} ÷ 2 = ${cm(v)}`) } };
    }
    throw new Error('casoReciproco sin caso');
  }
  // Tipo 2: con x: MN = x + p y BC = qx − s; MN = BC ÷ 2.
  function casoBaseX(r) {
    for (let i = 0; i < 400; i++) {
      const x = r.ent(3, 12), p = r.ent(1, 6), q = r.ent(3, 4), mn = x + p, bc = 2 * mn, s = q * x - bc;
      if (s < 1 || s > 15) continue;
      const e1 = `x + ${p}`, e2 = `${q}x − ${s}`, [A, B, C] = porLados(8, r.de([6, 7]), r.de([5, 6]));
      const F = figBase(A, B, C, { paralelas: true, segs: [['M', 'N', Object.assign({ paralela: 1 }, MN_O)]], lados: [{ de: 'M', a: 'N', texto: e1, color: 'o', ref: 'A', dist: 8 }, { de: 'B', a: 'C', texto: e2, color: 'i', ref: 'A', dist: 6 }],
        alt: `Triángulo ABC con M y N, puntos medios de AB y AC. La base media MN mide ${e1} y BC, ${e2}.` });
      if (!cabe(F)) continue;
      const xMal = (s + p) / (q - 1);
      const ops = opciones(mn, [
        { id: 'x', valor: x, error: 'GE-CON30', siFuera: `Hallar x = ${x} está bien; falta reemplazarlo en MN.` },
        { id: 'bc', valor: bc, error: 'GE-CON11', siFuera: `${cm(bc)} es BC; MN es la mitad.` },
        { id: 'igual', valor: Number.isInteger(xMal) ? xMal + p : NaN, error: 'GE-CON10', siFuera: 'Igualar MN con BC olvida que MN es la mitad: se iguala el doble de MN con BC.' },
        { id: 'signo', valor: Number.isInteger((s + p) / (q - 2)) ? (s + p) / (q - 2) + p : NaN, error: 'GE-TRI15', siFuera: `Duplicar MN está bien; pero el doble de x + ${p} es 2x + ${2 * p}: el número también se duplica.` },
      ], cm);
      if (ops.length < 4) continue;
      return { pregunta: `En △ABC, M y N son los puntos medios de AB y AC. Si MN = ${e1} y BC = ${e2}, en centímetros, ¿cuánto mide MN?`,
        datos: [D_BM, D_TBM], dibujo: fig(F), opciones: ops,
        solucion: { texto: 'BC mide el doble de MN.', ecuacion: [junto(`${q}x − ${s} = 2(x + ${p})`), FL, junto(`x = ${x}`), FL, junto(`MN = ${cm(mn)}`)] } };
    }
    throw new Error('casoBaseX sin caso');
  }
  // Tipo 3: el triángulo de los tres puntos medios: su perímetro es la mitad (o al revés).
  function casoMedial(r) {
    for (let i = 0; i < 400; i++) {
      const [a, b, c] = lados3(r, 4, 12).map(x => 2 * x), alReves = r.ent(0, 2) === 2, k = alReves ? 0.5 : 1, [A, B, C] = porLados(a * k, b * k, c * k);
      const Mv = U.medio(A, B), Nv = U.medio(A, C), Pv = U.medio(B, C);
      const lados = alReves ? [{ de: 'M', a: 'N', texto: cm(a / 4), color: 'o', ref: 'P', dist: 4 }, { de: 'N', a: 'P', texto: cm(c / 4), color: 'o', ref: 'M', dist: 4 }, { de: 'P', a: 'M', texto: cm(b / 4), color: 'o', ref: 'N', dist: 4 }]
        : [{ de: 'B', a: 'C', texto: cm(a), color: 'i', ref: 'A', dist: 6 }, { de: 'A', a: 'C', texto: cm(b), ref: 'B', dist: 6 }, { de: 'A', a: 'B', texto: cm(c), ref: 'C', dist: 6 }];
      const F = figBase(A, B, C, { medios: ['M', 'N', 'P'], llaves: !alReves, segs: [['M', 'N', MN_O], ['N', 'P', MN_O], ['P', 'M', MN_O]], lados,
        alt: alReves ? `Los puntos medios M, N y P de los lados de △ABC forman un triángulo de lados ${cm(a / 4)}, ${cm(c / 4)} y ${cm(b / 4)}.` : `Triángulo ABC de lados ${cm(a)}, ${cm(b)} y ${cm(c)}; sus puntos medios M, N y P forman otro triángulo.` });
      void Mv; void Nv; void Pv;
      if (!cabe(F)) continue;
      const per = a + b + c, v = alReves ? per / 2 : per / 2;
      const ops = opciones(v, [
        { id: 'igual', valor: alReves ? per / 4 : per, error: 'GE-CON10', siFuera: alReves ? 'Sumar los tres lados está bien; ese es el perímetro de MNP: el de ABC es el doble.' : 'Sumar los tres lados está bien; ese es el perímetro de ABC, y MNP tiene lados de la mitad.' },
        { id: 'reves', valor: alReves ? per / 8 : per / 4, error: 'GE-CON11', siFuera: 'Usar la mitad está bien; pero se aplica una sola vez.' },
        { id: 'tercio', valor: alReves ? 3 * per / 4 : per / 3, error: 'GE-CON21', siFuera: 'Cada lado del triángulo de los puntos medios es la mitad de un lado; no un tercio.' },
        { id: 'doble', valor: alReves ? per : 2 * per, error: 'GE-CON46', siFuera: 'Relacionar los dos perímetros está bien; revisa cuál es el doble del otro.' },
      ], cm);
      if (ops.length < 4) continue;
      return { pregunta: alReves ? `Los puntos medios M, N y P de los lados de △ABC forman un triángulo de lados ${cm(a / 4)}, ${cm(c / 4)} y ${cm(b / 4)}. ¿Cuánto mide el perímetro de △ABC?`
        : `△ABC tiene lados de ${cm(a)}, ${cm(b)} y ${cm(c)}. M, N y P son los puntos medios de sus lados. ¿Cuánto mide el perímetro de △MNP?`,
        datos: [D_BM, D_TBM, D_PER], dibujo: fig(F), opciones: ops,
        solucion: { texto: 'Cada lado de △MNP es una base media: mide la mitad del lado de enfrente.', ecuacion: junto(alReves ? `2 · (${f(a / 4)} + ${f(c / 4)} + ${f(b / 4)}) = ${cm(v)}` : `(${a} + ${b} + ${c}) ÷ 2 = ${cm(v)}`) } };
    }
    throw new Error('casoMedial sin caso');
  }
  // Tipo 4 (examen, como San Marcos 2026-II): dos bases medias seguidas: Q y R, la mitad de AM y de AN; QR = BC ÷ 4.
  function casoDosBases(r) {
    for (let i = 0; i < 400; i++) {
      const bc = 4 * r.ent(3, 9), pideMN = r.ent(0, 3) === 0, [A, B, C] = porLados(9, r.de([7, 8]), r.de([6, 7]));
      const F = figBase(A, B, C, { medios: ['M', 'N', 'Q', 'R'], llaves: false, paralelas: true, segs: [['M', 'N', Object.assign({ paralela: 1 }, MN_O)], ['Q', 'R']], lados: [{ de: 'B', a: 'C', texto: cm(bc), color: 'i', ref: 'A', dist: 6 }, { de: 'Q', a: 'R', texto: '?', ref: 'A', dist: 4 }],
        alt: `Triángulo ABC con BC = ${cm(bc)}. M y N son los puntos medios de AB y AC; Q y R, los de AM y AN. El segmento QR lleva «?».` });
      if (!cabe(F)) continue;
      const v = bc / 4;
      const ops = opciones(v, [
        { id: 'mn', valor: bc / 2, error: 'GE-CON47', siFuera: `${cm(bc / 2)} es MN, la primera base media; QR es la base media de △AMN.` },
        { id: 'tercio', valor: bc / 3, error: 'GE-CON21', siFuera: 'Partir BC está bien; pero dos mitades seguidas dan la cuarta parte.' },
        { id: 'resta', valor: bc / 2 - 1, error: 'GE-CON44', siFuera: 'Usar MN está bien; QR es su mitad, no MN menos algo.' },
        { id: 'octavo', valor: bc / 8, error: 'GE-CON11', siFuera: 'Ir de mitad en mitad está bien; pero son dos mitades, no tres.' },
      ], cm);
      if (ops.length < 4) continue;
      void pideMN;
      return { pregunta: `En △ABC, BC = ${cm(bc)}. M y N son los puntos medios de AB y AC; Q y R, los puntos medios de AM y AN. ¿Cuánto mide QR?`,
        datos: [D_BM, D_TBM], dibujo: fig(F), opciones: ops,
        solucion: { texto: `En △ABC, MN = ${cm(bc / 2)}. En △AMN, QR es base media: la mitad de MN.`, ecuacion: junto(`QR = ${f(bc / 2)} ÷ 2 = ${cm(v)}`) } };
    }
    throw new Error('casoDosBases sin caso');
  }
  // Tipo 5: la base media es paralela: m∠AMN = m∠B (correspondientes).
  function casoAnguloBM(r) {
    for (let i = 0; i < 400; i++) {
      const Bg = 5 * r.ent(9, 15), Cg = 5 * r.ent(8, 14), Ag = 180 - Bg - Cg;
      if (Ag < 35 || new Set([Ag, Bg, Cg]).size < 3) continue;
      const B = [0, 0], C = [8, 0], A = U.polar(B, 8 * Math.sin(Cg * RAD) / Math.sin(Ag * RAD), Bg);
      const F = figBase(A, B, C, { paralelas: true, segs: [['M', 'N', Object.assign({ paralela: 1 }, MN_O)]], ang: [{ en: 'B', de: 'C', a: 'A', color: 'h', texto: gr(Bg), radio: 16 }, { en: 'M', de: 'N', a: 'A', texto: '?', radio: 16 }],
        alt: `Triángulo ABC con M y N, puntos medios de AB y AC. El ángulo B mide ${Bg}° y el ángulo AMN lleva «?».` });
      if (!cabe(F)) continue;
      const ops = opciones(Bg, [
        { id: 'suple', valor: 180 - Bg, error: 'GE-CON34', siFuera: `Usar las paralelas está bien; ${180 - Bg}° es el vecino BMN, no AMN.` },
        { id: 'mitad', valor: Bg / 2, error: 'GE-CON36', siFuera: 'La base media parte los lados en dos, no los ángulos.' },
        { id: 'mc', valor: Cg, error: 'GE-CON48', siFuera: `${Cg}° es m∠C: le toca a ANM, el ángulo de N.` },
        { id: 'ma', valor: Ag, error: 'GE-CON49', siFuera: `${Ag}° es m∠A; AMN es el ángulo de M.` },
      ], gr);
      if (ops.length < 4) continue;
      // (M14: m∠C va en el enunciado, porque un distractor es m∠C.)
      return { pregunta: `En △ABC, m∠B = ${Bg}° y m∠C = ${Cg}°. M y N son los puntos medios de AB y AC. ¿Cuánto mide el ángulo AMN?`,
        datos: [D_BM, D_TBM, D_COR], dibujo: fig(F), opciones: ops,
        solucion: { texto: 'MN es paralela a BC y AB las corta: AMN y ABC son correspondientes.', ecuacion: junto(`m∠AMN = m∠B = ${gr(Bg)}`) } };
    }
    throw new Error('casoAnguloBM sin caso');
  }

  // Ejemplos resueltos de «Base media del triángulo» (molde §3). Cuentas rehechas aparte (scratchpad e5-geometria/
  // cuentas4.py): 8 ÷ 2 = 4; 2 · 3,5 = 7; 10 ÷ 2 = 5; 62° (correspondientes); 12 ÷ 2 = 6; 2(2x + 1) = 18, x = 4; (8 + 10
  // + 12) ÷ 2 = 15; 2(3 + 4 + 5) = 24; 180 − 50 − 70 = 60; 24 ÷ 4 = 6; 2(x + 3) = 3x − 4, x = 10, MN = 13; 5 + 14 + 6 + 7
  // = 32; AD = 10, DC = 6, HM = 3; 70° (el ángulo C); 48 ÷ 4 = 12.
  const T578 = porLados(8, 7, 5);
  const EJ4 = [];
  EJ4.push({ nivel: 1, titulo: 'El listón del tijeral',
    figura: fig(figListon({ ax: 3, ay: 5 }, { manija: false, lados: [{ de: 'M', a: 'N', texto: '?', color: 'o', ref: 'A', dist: 11 }, { de: 'B', a: 'C', texto: '8 m', color: 'i', ref: 'A', dist: 10 }],
      alt: 'Un tijeral con la viga de abajo BC de 8 m. El listón MN une la mitad de las dos vigas inclinadas, M y N, y lleva «?».' })),
    enunciado: 'El listón MN de un tijeral une la mitad de las dos vigas inclinadas, AB y AC. Si la viga de abajo mide BC = 8 m, ¿cuánto mide el listón?',
    datos: [D_BM, D_TBM],
    solucion: [{ texto: 'MN une los puntos medios de AB y AC: es la base media, y mide la mitad de BC.', ecuacion: junto(['MN = 8 ÷ 2 = ', dF('4 m')]) }],
    respuesta: ['MN = ', dF('4 m')] });
  EJ4.push({ nivel: 1, titulo: 'De la base media al lado',
    figura: fig(figBase(...T578, { paralelas: true, segs: [['M', 'N', Object.assign({ paralela: 1 }, MN_O)]], lados: [{ de: 'M', a: 'N', texto: '3,5 cm', color: 'o', ref: 'A', dist: 8 }, { de: 'B', a: 'C', texto: '?', color: 'i', ref: 'A', dist: 6 }], alt: 'Triángulo ABC con M y N, puntos medios de AB y AC. La base media MN mide 3,5 cm; BC lleva «?».' })),
    enunciado: 'En △ABC, M y N son los puntos medios de AB y AC, y MN = 3,5 cm. ¿Cuánto mide BC?',
    datos: [D_BM, D_TBM],
    solucion: [{ texto: 'MN es la mitad de BC: BC es el doble de MN.', ecuacion: junto(['BC = 2 · 3,5 = ', dF('7 cm')]) }],
    respuesta: ['BC = ', dF('7 cm')] });
  EJ4.push({ nivel: 1, titulo: 'La paralela por el punto medio',
    figura: fig((() => { const F = figBase(...porLados(9, 10, 7), { medios: ['M'], paralelas: true, segs: [['M', 'X', Object.assign({ paralela: 1 }, MN_O)]], lados: [{ de: 'A', a: 'C', texto: '10 cm', ref: 'B', dist: 6, en: 0.22 }], alt: 'Triángulo ABC con M, punto medio de AB. Desde M sale una paralela a BC que corta AC en N; AC mide 10 cm.' });
      const [A, B, C] = porLados(9, 10, 7), N = U.medio(A, C); F.figura.puntos.push({ id: 'X', x: N[0], y: N[1], rotulo: 'N', lado: U.grados(Math.atan2(N[1] - B[1], N[0] - B[0])), lejos: 4, sinPunto: true }); return F; })()),
    enunciado: 'En △ABC, M es el punto medio de AB y AC = 10 cm. La paralela a BC que sale de M corta AC en N. ¿Cuánto mide AN?',
    datos: [D_BM, D_RBM],
    solucion: [{ texto: 'La paralela a BC por el punto medio de AB llega al punto medio de AC.', ecuacion: junto(['AN = 10 ÷ 2 = ', dF('5 cm')]) }],
    respuesta: ['AN = ', dF('5 cm')] });
  EJ4.push({ nivel: 1, titulo: 'Un ángulo que se copia',
    figura: fig((() => { const B = [0, 0], C = [8, 0], A = U.polar(B, 8 * Math.sin(58 * RAD) / Math.sin(60 * RAD), 62);
      return figBase(A, B, C, { paralelas: true, segs: [['M', 'N', Object.assign({ paralela: 1 }, MN_O)]], ang: [{ en: 'B', de: 'C', a: 'A', color: 'h', texto: '62°' }, { en: 'M', de: 'N', a: 'A', texto: '?', radio: 18 }], alt: 'Triángulo ABC con M y N, puntos medios de AB y AC. El ángulo B mide 62° y el ángulo AMN lleva «?».' }); })()),
    enunciado: 'En △ABC, M y N son los puntos medios de AB y AC, y m∠B = 62°. ¿Cuánto mide el ángulo AMN?',
    datos: [D_TBM, D_COR],
    solucion: [{ texto: 'MN es paralela a BC, y AB las corta: AMN y ABC son correspondientes.', ecuacion: junto('m∠AMN = m∠B') }],
    respuesta: ['m∠AMN = ', dF('62°')] });
  EJ4.push({ nivel: 1, titulo: '¿Con qué lado se compara?',
    figura: fig(figBase(...porLados(9, 12, 7), { medios: ['M', 'P'], segs: [['M', 'P', Object.assign({ paralela: 1 }, MN_O)]], bcColor: false, lados: [{ de: 'A', a: 'C', texto: '12 cm', color: 'i', ref: 'B', dist: 6 }, { de: 'M', a: 'P', texto: '?', color: 'o', ref: 'B', dist: 5 }], alt: 'Triángulo ABC con M, punto medio de AB, y P, punto medio de BC. AC mide 12 cm y MP lleva «?».' })),
    enunciado: 'En △ABC, M es el punto medio de AB y P, el de BC. Si AC = 12 cm, ¿cuánto mide MP?',
    datos: [D_BM, D_TBM],
    solucion: [{ texto: 'MP une los puntos medios de AB y BC: el tercer lado, el que no toca, es AC.', ecuacion: junto(['MP = 12 ÷ 2 = ', dF('6 cm')]) }],
    respuesta: ['MP = ', dF('6 cm')] });

  EJ4.push({ nivel: 2, titulo: 'La base media con x',
    figura: fig(figBase(...T578, { paralelas: true, segs: [['M', 'N', Object.assign({ paralela: 1 }, MN_O)]], lados: [{ de: 'M', a: 'N', texto: '2x + 1', color: 'o', ref: 'A', dist: 8 }, { de: 'B', a: 'C', texto: '18 cm', color: 'i', ref: 'A', dist: 6 }], alt: 'Triángulo ABC con M y N, puntos medios de AB y AC. MN mide 2x + 1 y BC, 18 cm.' })),
    enunciado: 'En △ABC, M y N son los puntos medios de AB y AC. Si MN = 2x + 1, en centímetros, y BC = 18 cm, ¿cuánto vale x?',
    datos: [D_BM, D_TBM],
    solucion: [{ texto: 'BC es el doble de MN.', ecuacion: [junto('2(2x + 1) = 18'), FL, junto('2x + 1 = 9'), FL, junto(['x = ', dF('4')])] },
      { texto: 'Compruebo: MN = 9 cm, la mitad de 18 cm.' }],
    respuesta: ['x = ', dF('4')] });
  EJ4.push({ nivel: 2, titulo: 'El triángulo de los puntos medios',
    figura: fig(figBase(...porLados(12, 10, 8), { medios: ['M', 'N', 'P'], segs: [['M', 'N', MN_O], ['N', 'P', MN_O], ['P', 'M', MN_O]], lados: [{ de: 'B', a: 'C', texto: '12 cm', color: 'i', ref: 'A', dist: 6, en: 0.25 }, { de: 'A', a: 'C', texto: '10 cm', ref: 'B', dist: 6 }, { de: 'A', a: 'B', texto: '8 cm', ref: 'C', dist: 6 }], alt: 'Triángulo ABC de lados 12 cm, 10 cm y 8 cm; sus puntos medios M, N y P forman otro triángulo.' })),
    enunciado: '△ABC tiene lados de 8 cm, 10 cm y 12 cm. M, N y P son los puntos medios de sus lados. ¿Cuánto mide el perímetro de △MNP?',
    datos: [D_BM, D_TBM, D_PER],
    solucion: [{ texto: 'Cada lado de △MNP es una base media: mide la mitad de un lado de △ABC.', ecuacion: junto('4 cm,   5 cm   y   6 cm') },
      { texto: 'Sumo los tres.', ecuacion: junto(['4 + 5 + 6 = ', dF('15 cm')]) }],
    respuesta: ['Perímetro = ', dF('15 cm')] });
  EJ4.push({ nivel: 2, titulo: 'Del triángulo chico al grande',
    enunciado: 'Los puntos medios de los lados de un triángulo forman otro de lados 3 cm, 4 cm y 5 cm. ¿Cuánto mide el perímetro del triángulo grande?',
    datos: [D_BM, D_TBM, D_PER],
    solucion: [{ texto: 'Cada lado del chico es la mitad de un lado del grande: el grande tiene lados de 6 cm, 8 cm y 10 cm.' },
      { texto: 'Sumo los tres.', ecuacion: junto(['6 + 8 + 10 = ', dF('24 cm')]) }],
    respuesta: ['Perímetro = ', dF('24 cm')] });
  EJ4.push({ nivel: 2, titulo: 'El ángulo de N',
    figura: fig((() => { const B = [0, 0], C = [8, 0], A = U.polar(B, 8 * Math.sin(60 * RAD) / Math.sin(50 * RAD), 70);
      return torcer(figBase(A, B, C, { paralelas: true, segs: [['M', 'N', Object.assign({ paralela: 1 }, MN_O)]], ang: [{ en: 'A', de: 'B', a: 'C', color: 'h' }, { en: 'B', de: 'C', a: 'A', color: 'h', texto: '70°', marcas: 2 }, { en: 'N', de: 'A', a: 'M', texto: '?', radio: 18 }], alt: 'Triángulo ABC con M y N, puntos medios de AB y AC. El ángulo A, de 50°, lleva su arco; el B mide 70°, y el ángulo ANM lleva «?». El dibujo no está a escala.' }), 1.5); })()),
    enunciado: 'En △ABC, m∠A = 50° y m∠B = 70°. M y N son los puntos medios de AB y AC. ¿Cuánto mide el ángulo ANM? El dibujo no está a escala.',
    datos: [D_SUMA, D_TBM, D_COR],
    solucion: [{ texto: 'Primero el ángulo C, con la suma de 180°.', ecuacion: junto('m∠C = 180° − 50° − 70° = 60°') },
      { texto: 'MN ∥ BC y AC las corta: ANM y ACB son correspondientes.', ecuacion: junto(['m∠ANM = m∠C = ', dF('60°')]) }],
    respuesta: ['m∠ANM = ', dF('60°')] });
  EJ4.push({ nivel: 2, titulo: 'Dos bases medias seguidas',
    figura: fig(figBase(...porLados(9, 8, 6), { medios: ['M', 'N', 'Q', 'R'], llaves: false, paralelas: true, segs: [['M', 'N', Object.assign({ paralela: 1 }, MN_O)], ['Q', 'R']], lados: [{ de: 'B', a: 'C', texto: '24 cm', color: 'i', ref: 'A', dist: 6 }, { de: 'Q', a: 'R', texto: '?', ref: 'A', dist: 4 }], alt: 'Triángulo ABC con BC = 24 cm. M y N son los puntos medios de AB y AC; Q y R, los de AM y AN. QR lleva «?».' })),
    enunciado: 'En △ABC, BC = 24 cm. M y N son los puntos medios de AB y AC; Q y R, los de AM y AN. ¿Cuánto mide QR?',
    datos: [D_BM, D_TBM],
    solucion: [{ texto: 'MN es la base media de △ABC.', ecuacion: junto('MN = 24 ÷ 2 = 12 cm') },
      { texto: 'QR es la base media de △AMN: la mitad de MN.', ecuacion: junto(['QR = 12 ÷ 2 = ', dF('6 cm')]) }],
    respuesta: ['QR = ', dF('6 cm')] });

  EJ4.push({ nivel: 3, titulo: 'Con x en los dos',
    figura: fig(figBase(...T578, { paralelas: true, segs: [['M', 'N', Object.assign({ paralela: 1 }, MN_O)]], lados: [{ de: 'M', a: 'N', texto: 'x + 3', color: 'o', ref: 'A', dist: 8 }, { de: 'B', a: 'C', texto: '3x − 4', color: 'i', ref: 'A', dist: 6 }], alt: 'Triángulo ABC con M y N, puntos medios de AB y AC. MN mide x + 3 y BC, 3x − 4.' })),
    enunciado: 'En △ABC, M y N son los puntos medios de AB y AC. Si MN = x + 3 y BC = 3x − 4, en centímetros, ¿cuánto mide MN?',
    alternativas: ['10 cm', '13 cm', '26 cm', '6,5 cm', '5,2 cm'],
    datos: [D_BM, D_TBM],
    solucion: [{ texto: 'BC es el doble de MN.', ecuacion: [junto('3x − 4 = 2(x + 3)'), FL, junto('3x − 4 = 2x + 6'), FL, junto('x = 10')] },
      { texto: 'Piden MN, no x.', ecuacion: junto(['MN = 10 + 3 = ', dF('13 cm')]) },
      { texto: 'Compruebo: BC = 3 · 10 − 4 = 26 cm, el doble.' },
      { texto: 'Las otras: 10 cm es x; 26 cm es BC; 6,5 cm iguala MN con BC; 5,2 cm pone el doble en el lado equivocado.' }],
    respuesta: ['MN = ', dF('13 cm')] });
  EJ4.push({ nivel: 3, titulo: 'El trozo que queda abajo',
    figura: fig(figBase(...porLados(14, 12, 10), { paralelas: true, segs: [['M', 'N', Object.assign({ paralela: 1 }, MN_O)]], lados: [{ de: 'M', a: 'N', texto: '7 cm', color: 'o', ref: 'A', dist: 8 }, { de: 'A', a: 'B', texto: '10 cm', ref: 'C', dist: 6 }, { de: 'A', a: 'C', texto: '12 cm', ref: 'B', dist: 6 }], alt: 'Triángulo ABC con M y N, puntos medios de AB y AC. AB mide 10 cm, AC 12 cm y la base media MN, 7 cm. Debajo de MN queda la figura MBCN.' })),
    enunciado: 'En △ABC, AB = 10 cm y AC = 12 cm. M y N son los puntos medios de AB y AC, y MN = 7 cm. ¿Cuánto mide el perímetro de la figura MBCN?',
    alternativas: ['18 cm', '25 cm', '32 cm', '36 cm', '43 cm'],
    datos: [D_BM, D_TBM, 'El perímetro de una figura es la suma de los lados que la rodean.'],
    solucion: [{ texto: 'MB y NC son mitades: MB = 5 cm y NC = 6 cm. BC es el doble de MN: 14 cm.' },
      { texto: 'MBCN está rodeada por MB, BC, CN y NM.', ecuacion: junto(['5 + 14 + 6 + 7 = ', dF('32 cm')]) },
      { texto: 'Las otras: 18 cm olvida BC; 25 cm olvida MN; 36 cm es el perímetro de ABC; 43 cm le suma MN.' }],
    respuesta: ['Perímetro = ', dF('32 cm')] });
  EJ4.push({ nivel: 3, titulo: 'La perpendicular a la bisectriz',
    figura: fig((() => { const A = [0, 0], B = U.polar(A, 10, 64), C = [16, 0], D = U.polar(A, 10, 0), H = U.medio(B, D), Mx = U.medio(B, C), R = U.polar(A, 15, 32);
      const pt = (id, p, lado) => ({ id, x: p[0], y: p[1], rotulo: id, lado, sinPunto: true });
      const fg = { alto: 220, alt: 'Triángulo ABC con AB = 10 cm y AC = 16 cm. La bisectriz del ángulo A va punteada; desde B, la perpendicular a ella la corta en H y llega a AC en D. M es el punto medio de BC y se traza HM.',
        puntos: [pt('A', A, 200), pt('B', B, 90), pt('C', C, -20), pt('D', D, -90), pt('H', H, 0), pt('M', Mx, 40), { id: 'R', x: R[0], y: R[1], sinPunto: true }],
        segmentos: [{ de: 'A', a: 'B' }, { de: 'A', a: 'C' }, { de: 'B', a: 'C' }, { de: 'A', a: 'R', discontinua: true, grosor: 'fino' }, { de: 'B', a: 'D' }, Object.assign({ de: 'H', a: 'M' }, MN_O)],
        angulos: [{ en: 'A', de: 'C', a: 'R', color: 'h', radio: 34, rayita: 1, mide: 32 }, { en: 'A', de: 'R', a: 'B', color: 'h', radio: 34, rayita: 1, mide: 32 }, { en: 'H', de: 'B', a: 'A', radio: 8 }] };
      fg.vista = { x: [-1.6, 17.6], y: [-2, 10.4] };
      PO.acomodarLetras(fg, ['A', 'B', 'C', 'D']);
      // H entre HD y HA (cerca de AC); M afuera de BC.
      const dH = p => Math.atan2(p[1] - H[1], p[0] - H[0]), h1 = dH(D), h2 = dH(A);
      Object.assign(fg.puntos.find(q => q.id === 'H'), { lado: U.grados(Math.atan2(Math.sin(h1) + Math.sin(h2), Math.cos(h1) + Math.cos(h2))), lejos: 2 });
      Object.assign(fg.puntos.find(q => q.id === 'M'), { lado: U.grados(Math.atan2(Mx[1] - A[1], Mx[0] - A[0])), lejos: 4 });
      return { objeto: 'angulos', figura: fg, ladosRot: [{ de: 'A', a: 'B', texto: '10 cm', ref: 'C', dist: 6 }, { de: 'A', a: 'C', texto: '16 cm', ref: 'B', dist: 14 } ] }; })()),
    enunciado: 'En △ABC, AB = 10 cm y AC = 16 cm. La perpendicular desde B a la bisectriz del ángulo A la corta en H y llega a AC en D. M es el punto medio de BC. ¿Cuánto mide HM?',
    alternativas: ['3 cm', '5 cm', '6 cm', '8 cm', '13 cm'],
    datos: [D_BIS, D_CRIT, D_BM, D_TBM],
    solucion: [{ texto: '△AHB ≅ △AHD por ALA (mitades iguales, rectos en H y AH común): AD = AB = 10 cm y BH = HD.' },
      { texto: 'H es el punto medio de BD y M, el de BC: HM es base media de △BDC.', ecuacion: junto('DC = 16 − 10 = 6 cm') },
      { texto: 'HM mide la mitad de DC.', ecuacion: junto(['HM = 6 ÷ 2 = ', dF('3 cm')]) },
      { texto: 'Las otras: 6 cm es DC entero; 5 cm parte AB; 8 cm parte AC; 13 cm parte la suma de AB y AC.' }],
    respuesta: ['HM = ', dF('3 cm')] });
  EJ4.push({ nivel: 3, titulo: 'Los ángulos del triángulo chico',
    figura: fig((() => { const B = [0, 0], C = [9, 0], A = U.polar(B, 9 * Math.sin(70 * RAD) / Math.sin(50 * RAD), 60);
      return torcer(figBase(A, B, C, { medios: ['M', 'N', 'P'], segs: [['M', 'N', MN_O], ['N', 'P', MN_O], ['P', 'M', MN_O]], ang: [{ en: 'A', de: 'B', a: 'C', color: 'h' }, { en: 'B', de: 'C', a: 'A', color: 'h', marcas: 2 }, { en: 'M', de: 'P', a: 'N', texto: '?', radio: 16 }],
        alt: 'Triángulo ABC con m∠A = 50° (un arco) y m∠B = 60° (dos arcos). M, N y P son los puntos medios de AB, AC y BC; el ángulo NMP del triángulo de los puntos medios lleva «?». El dibujo no está a escala.' }), 1.5); })()),
    enunciado: 'En △ABC, m∠A = 50° y m∠B = 60°. M, N y P son los puntos medios de AB, AC y BC. ¿Cuánto mide el ángulo NMP? El dibujo no está a escala.',
    alternativas: ['50°', '60°', '70°', '110°', '120°'],
    datos: [D_SUMA, D_TBM, D_COR],
    solucion: [{ texto: 'MN ∥ BC, así que m∠AMN = m∠B = 60°. MP ∥ AC, así que m∠BMP = m∠A = 50°.' },
      { texto: 'En M, los tres ángulos juntos forman una recta.', ecuacion: junto(['m∠NMP = 180° − 60° − 50° = ', dF('70°')]) },
      { texto: 'Es igual a m∠C: el triángulo chico copia los ángulos del grande.' },
      { texto: 'Las otras: 50° y 60° son los ángulos A y B; 110° suma A y B; 120° es lo que le falta a B para 180°.' }],
    respuesta: ['m∠NMP = ', dF('70°')] });
  EJ4.push({ nivel: 3, titulo: 'Tres triángulos encajados',
    enunciado: 'Un triángulo tiene 48 cm de perímetro. Los puntos medios de sus lados forman un segundo triángulo, y los puntos medios del segundo, un tercero. ¿Cuánto mide el perímetro del tercero?',
    alternativas: ['6 cm', '16 cm', '24 cm', '12 cm', '96 cm'],
    datos: [D_BM, D_TBM, D_PER],
    solucion: [{ texto: 'Cada lado del segundo es la mitad de un lado del primero: su perímetro es la mitad.', ecuacion: junto('48 ÷ 2 = 24 cm') },
      { texto: 'El tercero se arma igual sobre el segundo.', ecuacion: junto(['24 ÷ 2 = ', dF('12 cm')]) },
      { texto: 'Las otras: 24 cm es el segundo; 16 cm divide entre 3; 6 cm parte una vez de más; 96 cm duplica en vez de partir.' }],
    respuesta: ['Perímetro = ', dF('12 cm')] });

  const baseMedia = {
    id: 'base-media',
    titulo: 'Base media del triángulo',
    pregunta: '¿Cuánto mide el listón que une la mitad de dos vigas?',
    temas: ['Teorema de la base media'],
    pieza: GO,
    aprendizaje: 'El segmento que une los puntos medios de dos lados es paralelo al tercero y mide su mitad, sea cual sea la forma del triángulo.',
    actividad: 'Mover la cumbrera de un tijeral y mirar su listón.',
    // Lee: punto medio, base media (el nombre) y el listón del tijeral. No dice dónde llega una paralela que sale de un
    // punto medio (eso es la predicción).
    lee: {
      tarjetas: [
        { titulo: 'El listón del tijeral', texto: 'Muchos tijerales llevan un listón que une la mitad de una viga inclinada con la mitad de la otra. Lo sostiene todo: las vigas no se abren ni se cierran.',
          pieza: GO, dibujo: fig(figListon({ ax: 3, ay: 5 }, { manija: false, lados: [], alt: 'Un tijeral ABC sobre el piso del taller. El listón MN une la mitad de la viga AB con la mitad de la viga AC.' })) },
        { titulo: 'La base media', texto: 'En un triángulo, el segmento que une los puntos medios de dos lados se llama base media. El tercer lado, el que no toca, es el lado con que se compara.' },
        { titulo: 'Las rayitas', texto: 'En las figuras, M y N son puntos medios: AM y MB llevan una rayita (miden igual), y AN y NC, dos. Las flechitas marcan dos segmentos paralelos.' },
        { titulo: 'Qué mirar al jugar', texto: 'Vas a mover la cumbrera A, arrastrándola o con los controles. M y N la siguen y quedan a media altura de A. Mira cuánto mide el listón y hacia dónde apunta.' },
      ],
    },
    ejemplos: EJ4,
    juega: {
      pieza: GO,
      consigna: 'Las paredes del taller están a 8 m: B y C son los apoyos. M y N son la mitad de cada viga inclinada.',
      mision: {
        texto: 'Mueve la cumbrera A hasta que el listón MN quede a 2 m del piso.',
        logrado: v => v.ay === 4,
        bien: 'MN, a 2 m del piso, sigue en 4 m: la mitad de BC.',
      },
      voz: 'Sube, baja y corre la cumbrera. ¿Qué cambia en el listón?',
      leyenda: [
        { s: 'A', t: 'la cumbrera; se arrastra' },
        { s: 'B, C', t: 'los apoyos sobre las paredes' },
        { s: 'M, N', t: 'la mitad de cada viga inclinada' },
        { s: dO('MN'), t: 'el listón' },
        { s: dI('BC'), t: 'la viga de abajo' },
        { s: 'flechitas', t: 'MN y BC son paralelos' },
      ],
      controles: [
        { id: 'ax', etiqueta: 'Cumbrera A a lo ancho, en m', min: 0, max: 8, paso: 1, inicio: 2, unidad: 'm', decimales: 0 },
        { id: 'ay', etiqueta: 'Cumbrera A a lo alto, en m', min: 3, max: 6, paso: 1, inicio: 5, unidad: 'm', decimales: 0 },
      ],
      dibujo: v => ({ datos: figListon(v), estado: {} }),
      arrastres: [{ id: 'vertice-a', etiqueta: 'cumbrera A', color: 'c-o',
        donde: v => PO.aPantalla(figListon(v), [v.ax, v.ay]),
        mover: (pt, v) => { const q = PO.aPlano(figListon(v), pt); return { ax: q[0], ay: q[1] }; } }],
      // (Auditoría del 19 nov, M11: «A 1,5 m del piso» se leía como la altura del punto A.)
      lectura: v => [dO('MN'), ' = 4 m = ', dI('BC'), junto(` ÷ 2, a ${f(v.ay / 2)} m del piso`)],
      minimo: 3,
    },
    predice: {
      pregunta: 'El carpintero quiere otro listón: sale de M, la mitad de la viga AB, y va paralelo a la viga de abajo, BC. ¿A qué punto de la viga AC llega?',
      datos: ['Las vigas miden 5 m (AB), 7 m (AC) y 8 m (BC).', 'M es el punto medio de AB, a 2,5 m de A.'],
      voz: 'Ya viste la ida. ¿Vale también el camino de vuelta?',
      opciones: [
        { id: 'c', texto: 'A su punto medio, a 3,5 m de A', correcta: true },
        { id: 'copia', texto: 'A 2,5 m de A, lo mismo que AM', error: 'GE-CON20', siFuera: 'Llegaría a 2,5 m si las dos vigas midieran igual; AC mide 7 m: se parte en mitades.' },
        { id: 'depende', texto: 'Depende de la forma del tijeral', error: 'GE-CON9', siFuera: 'La forma cambia los largos, sí; pero la paralela por el punto medio siempre llega al otro punto medio.' },
        { id: 'tercio', texto: 'A un tercio de la viga, cerca de A', error: 'GE-CON21', siFuera: 'Un tercio saldría si M estuviera a un tercio de AB. Está en la mitad.' },
      ],
      dibujo: fig((() => { const F = figBase(A4, B4, C4, { taller: true, medios: ['M'], paralelas: true, segs: [['M', 'X', Object.assign({ paralela: 1, discontinua: true }, MN_O)]], vista: { x: [-1.2, 9.2], y: [-1.5, 5.4] }, alto: 240,
        alt: 'Un tijeral ABC con AB = 5 m, AC = 7 m y BC = 8 m; M es la mitad de AB. Desde M sale, punteado, un listón paralelo a BC que llega a la viga AC en un punto que lleva «?».' });
        F.vigas = F.vigas.filter(x => x.de !== 'M'); F.pernos = ['A', 'B', 'C', 'M'];
        F.figura.puntos.push({ id: 'X', x: N4[0], y: N4[1], rotulo: '?', lado: U.grados(Math.atan2(N4[1] - B4[1], N4[0] - B4[0])) - 10, lejos: 11, sinPunto: true }); return F; })()),
      revelar: fig(figListon({ ax: A4[0], ay: A4[1] }, { manija: false, lados: [{ de: 'A', a: 'N', texto: '3,5 m', ref: 'B', dist: 20 }, { de: 'N', a: 'C', texto: '3,5 m', ref: 'B', dist: 20 }], alt: 'El listón paralelo a BC que sale de M llega a N, la mitad de AC: AN = NC = 3,5 m.' })),
      coincide: 'Coincide: llega a N, la mitad de AC, a 3,5 m de A. Es la base media.',
      noCoincide: 'Revisemos: la paralela a BC por M llega a N, la mitad de AC: AN = 3,5 m.',
    },
    mira: {
      pieza: GO,
      datos: MIRA4,
      voz: 'Dos copias de triángulos hacen la prueba, sin medir.',
      pasos: [
        { estado: { corte: 0 }, texto: 'M y N son la mitad de las vigas AB y AC.' },
        { estado: { corte: 1 }, texto: 'Alargo MN hasta D, con ND = MN, y trazo CD.' },
        { estado: { corte: 2 }, texto: '△ANM ≅ △CND por LAL: AN = NC, ángulos opuestos en N, NM = ND.' },
        { estado: { corte: 3 }, texto: 'CD = AM = MB. Ángulos iguales en A y C: CD ∥ AB.' },
        { estado: { corte: 4 }, texto: '△MBC ≅ △CDM por LAL: MB = CD, ángulos alternos y MC de los dos.' },
        { estado: { corte: 5 }, texto: 'Así MD = BC y MD ∥ BC. MN es la mitad de MD.', ecuacion: junto([dO('MN'), ' = ', dI('BC'), ' ÷ 2 = 4 m']) },
        { estado: { corte: 6 }, texto: 'Por M pasa una sola paralela a BC: llega a N, mitad de AC.', ecuacion: junto('AN = 7 ÷ 2 = 3,5 m') },
      ],
    },
    regla: {
      texto: 'El segmento que une los puntos medios de dos lados es paralelo al tercer lado y mide su mitad. Al revés, la paralela por un punto medio llega al otro.',
      ecuacion: [{ llave: [dO('MN')], nota: 'base media', color: 'c-o' }, ' = ', { frac: [dI('BC'), '2'] }, Y, junto('MN ∥ BC')],
      condicion: 'M y N son puntos medios de dos lados del mismo triángulo; MN se compara con el lado que no toca.',
      voz: 'Primero ubica los puntos medios; después, el lado que no tocan.',
      dibujo: { pieza: GO, datos: figListon({ ax: 2.5, ay: 4 }, { manija: false, alt: 'El tijeral con su listón MN: une la mitad de AB y la mitad de AC, mide 4 m, la mitad de BC = 8 m, y va paralelo a BC.' }), estado: {} },
    },
    // Así se resuelve: el ángulo de N del lado de abajo (conjugados internos: m∠MNC = 180° − m∠C) o el perímetro de △AMN.
    // «Ahora tú» pide la base media o el lado, el recíproco, la base media con x, el triángulo de los puntos medios, dos
    // bases medias seguidas y el ángulo AMN.
    resuelve: {
      pieza: GO,
      generar(s) {
        const r = azar(s + 900);
        if (s % 2 === 0) {
          let Cg, Bg, F;
          for (let i = 0; ; i++) { Cg = 5 * r.ent(9, 14); Bg = 5 * r.ent(9, 14); const Ag = 180 - Bg - Cg, B = [0, 0], C = [8, 0], A = U.polar(B, 8 * Math.sin(Cg * RAD) / Math.sin(Ag * RAD), Bg);
            F = figBase(A, B, C, { paralelas: true, segs: [['M', 'N', Object.assign({ paralela: 1 }, MN_O)]], ang: [{ en: 'C', de: 'A', a: 'B', color: 'h', texto: gr(Cg) }, { en: 'N', de: 'M', a: 'C', texto: '?', radio: 18 }], alt: `Triángulo ABC con M y N, puntos medios de AB y AC. El ángulo C mide ${Cg}° y el ángulo MNC lleva «?».` });
            if ((Ag >= 40 && cabe(F)) || i > 200) break; }
          return {
            enunciado: `En △ABC, M y N son los puntos medios de AB y AC, y m∠C = ${Cg}°. ¿Cuánto mide el ángulo MNC?${NO_ESC}`,
            datos: [D_TBM, D_CONJ],
            dibujo: fig(torcer(F, 1.5)),
            pasos: [
              { tipo: 'pide', texto: 'Piden m∠MNC, el ángulo de N que mira hacia abajo, hacia BC.' },
              { tipo: 'datos', texto: `M y N son puntos medios, y m∠C = ${Cg}°.` },
              { tipo: 'regla', texto: 'La base media MN es paralela a BC. Entre paralelas cortadas por AC, los conjugados internos MNC y NCB suman 180°.' },
              { tipo: 'cuentas', texto: 'Resto de 180° el ángulo C.', ecuacion: junto(['m∠MNC = ', `180° − ${Cg}° = `, dF(`${180 - Cg}°`)]) },
              { tipo: 'sentido', texto: `Tiene sentido: el ángulo ANM mide ${Cg}°, y con MNC forma una recta.` },
            ],
            respuesta: ['m∠MNC = ', dF(`${180 - Cg}°`)],
          };
        }
        let a, b, c, F;
        for (let i = 0; ; i++) { [a, b, c] = lados3(r, 5, 12); F = figBase(...porLados(a, b, c), { paralelas: true, segs: [['M', 'N', Object.assign({ paralela: 1 }, MN_O)]], lados: [{ de: 'B', a: 'C', texto: cm(a), color: 'i', ref: 'A', dist: 6 }, { de: 'A', a: 'C', texto: cm(b), ref: 'B', dist: 6 }, { de: 'A', a: 'B', texto: cm(c), ref: 'C', dist: 6 }],
          alt: `Triángulo ABC de lados BC = ${cm(a)}, AC = ${cm(b)} y AB = ${cm(c)}, con M y N, puntos medios de AB y AC.` }); if (cabe(F) || i > 200) break; }
        return {
          enunciado: `En △ABC, AB = ${cm(c)}, AC = ${cm(b)} y BC = ${cm(a)}. M y N son los puntos medios de AB y AC. ¿Cuánto mide el perímetro de △AMN?`,
          datos: [D_BM, D_TBM, D_PER],
          dibujo: fig(F),
          pasos: [
            { tipo: 'pide', texto: 'Piden el perímetro del triángulo de arriba, AMN.' },
            { tipo: 'datos', texto: `Sus lados son AM, AN y MN. AM es la mitad de AB, y AN, la mitad de AC.` },
            { tipo: 'regla', texto: 'MN es la base media: mide la mitad del tercer lado, BC.' },
            { tipo: 'cuentas', texto: 'Cada lado de △AMN es la mitad de un lado de △ABC.', ecuacion: junto(['AM + AN + MN = ', `${f(c / 2)} + ${f(b / 2)} + ${f(a / 2)} = `, dF(cm((a + b + c) / 2))]) },
            { tipo: 'sentido', texto: `Es la mitad del perímetro de △ABC, que mide ${cm(a + b + c)}.` },
          ],
          respuesta: ['Perímetro = ', dF(cm((a + b + c) / 2))],
        };
      },
    },
    ahoraTu: {
      pieza: GO,
      voz: 'Ubica los puntos medios y el lado que no tocan.',
      generar(s) { return conCuatro([casoMitad, casoReciproco, casoBaseX, casoMedial, casoDosBases, casoAnguloBM][s % 6], azar(s + 7), firmasDe(EJ4)); },
    },
  };

  // ---------- Idea 5 (fase 3, 19 nov): mediana relativa a la hipotenusa ----------
  // Objeto de la primera pantalla: una escalera de 4 m que resbala con la punta en la pared y el pie en el piso (geo-objeto,
  // armazon de tipo 'escalera'; dibujo de prueba). C es la esquina de pared y piso (el ángulo recto), A la punta, B el pie
  // y M la mitad de la escalera. Cambia: el ángulo de la escalera con el piso. · Permanece: AB = 4 m y el recto en C.
  // · Progresa: dónde queda el pie; CM no cambia. · Se reserva: la pared inclinada (la predicción) y la prueba con base
  // media y mediatriz, sin rectángulos ni circunferencias («Mira»). · Debe verse: CM = MA = MB = 2 m siempre.
  // Colores (propuesta §6): la mediana CM, turquesa (como en Triángulos); el recto en C y los ángulos que se copian, en
  // carmín; la escalera AB, la pared y el piso, en tinta; lo pedido, «?» en tinta.
  const L5 = 4;
  // Prueba lugares para un rótulo de lado (de qué lado y a qué altura del tramo) hasta que la figura quepa.
  function acomodarRotulo(F, k, refs, ens) {
    if (!F.ladosRot || !F.ladosRot[k] || PO.escenaCabe(F)) return F;
    const t0 = Object.assign({}, F.ladosRot[k]);
    for (const ref of refs) for (const en of ens) { F.ladosRot[k] = Object.assign({}, t0, { ref, en }); if (PO.escenaCabe(F)) return F; }
    F.ladosRot.splice(k, 1); return F;   // si no cabe en ningún lugar, la medida va solo en el texto
  }
  const pieB = fi => L5 * Math.cos(fi * RAD), puntaA = fi => L5 * Math.sin(fi * RAD);
  const mV = d => (entero(d) ? `${f(d)} m` : `≈ ${f(d)} m`);
  // La escalera en la esquina: C en el origen, la pared hacia arriba (o inclinada, con o.pared en grados) y el piso a la
  // derecha. A en la pared, B en el piso, AB = L. o.cm: rótulo de CM; o.cb: del pie; o.mira: los cortes de la prueba.
  function figEscalera(A, B, o = {}) {
    const C = [0, 0], M = U.medio(A, B), N = U.medio(C, A), W = U.polar(C, Math.hypot(...A) + 0.6, o.pared || 90), F0 = [o.vista ? o.vista.x[1] - 0.3 : Math.max(B[0], 3.6) + 0.6, 0];
    const pt = (id, p, lado, x) => Object.assign({ id, x: p[0], y: p[1], rotulo: id, lado, sinPunto: true }, x || {});
    const mi = o.mira || {};
    const fg = { alt: o.alt, alto: o.alto || 262, vista: o.vista || { x: [-1.4, 4.9], y: [-0.9, 4.6] },
      puntos: [pt('C', C, 225), pt('A', A, (() => { const a1 = (o.pared || 90) * RAD, a2 = Math.atan2(B[1] - A[1], B[0] - A[0]); return U.grados(Math.atan2(Math.sin(a1) + Math.sin(a2), Math.cos(a1) + Math.cos(a2))); })(), { lejos: 6 }), pt('B', B, U.grados(Math.atan2(A[1] - B[1], A[0] - B[0])) / 2, { lejos: 6 }), pt('M', M, 45, { lejos: 11 }), { id: 'W', x: W[0], y: W[1], sinPunto: true }, { id: 'F', x: F0[0], y: 0, sinPunto: true },
        ...(mi.N !== undefined ? [pt('N', N, 180, { desde: mi.N })] : [])],
      segmentos: [{ de: 'C', a: 'W', grosor: 'variable' }, { de: 'C', a: 'F', grosor: 'variable' }, { de: 'A', a: 'B' },
        Object.assign({ de: 'C', a: 'M', color: 'i', grosor: 'variable' }, mi.CM !== undefined ? { desde: mi.CM } : {}),
        ...(mi.N !== undefined ? [{ de: 'M', a: 'N', discontinua: true, desde: mi.N }] : [])],
      angulos: [Object.assign({ en: 'C', de: 'F', a: 'W', color: 'h', radio: o.pared && o.pared !== 90 ? 16 : 11, mide: o.pared || 90 }, o.pared && o.pared !== 90 ? { texto: o.angC } : {}),
        ...(mi.recto !== undefined ? [{ en: 'N', de: 'M', a: 'C', radio: 8, desde: mi.recto }] : [])] };
    PO.acomodarLetras(fg, ['C'].concat(mi.N !== undefined ? ['N'] : []), { C: [45] });
    // (M10: junto a A, «4 m» se leía como la medida de A; el rótulo dice el lado.)
    const lados = [{ de: 'A', a: 'B', texto: o.ab === undefined ? `AB = ${f(Math.hypot(A[0] - B[0], A[1] - B[1]))} m` : o.ab, ref: 'C', dist: 14, en: o.ab === undefined ? 0.3 : 0.2 }];
    if (o.cm !== undefined) lados.push(Object.assign({ de: 'C', a: 'M', texto: o.cm, color: 'i', ref: o.pared && o.pared > 90 ? 'A' : 'B', dist: 5, en: 0.62 }, o.cmDesde ? { desde: o.cmDesde } : {}));
    if (o.cb !== undefined) lados.push({ de: 'C', a: 'B', texto: o.cb, ref: 'A', dist: 16, en: 0.4 });
    const F = Object.assign({ objeto: 'armazon', tipo: 'escalera', figura: fg, escalera: { de: 'A', a: 'B' }, muros: [{ de: 'C', a: 'W', lado: -1 }, { de: 'C', a: 'F', lado: -1 }],
      ladosRot: lados.filter(x => x.texto !== '') }, o.manija === false ? {} : { manija: 'B' },
    mi.N !== undefined ? { llaves: [{ de: 'C', a: 'N', marcas: 2, ref: 'M', desde: mi.N, dist: 16 }, { de: 'N', a: 'A', marcas: 2, ref: 'M', desde: mi.N, dist: 16 }] } : {});
    const k = F.ladosRot.findIndex(t => t.de === 'C' && t.a === 'M');
    if (k >= 0) acomodarRotulo(F, k, ['B', 'A'], [0.62, 0.75, 0.85, 0.5]);
    const j = F.ladosRot.findIndex(t => t.de === 'C' && t.a === 'B');
    if (j >= 0) acomodarRotulo(F, j, ['A'], [0.4, 0.25, 0.15]);
    // «AB = 4 m» donde quepa junto a la escalera; si no cabe en ningún lugar, «4 m» junto a A, como antes.
    if (o.ab === undefined && !PO.escenaCabe(F)) {
      const t0 = Object.assign({}, F.ladosRot[0]); let ok = false;
      for (const [en, dist] of [[0.35, 14], [0.3, 20], [0.85, 14], [0.2, 26], [0.4, 26], [0.8, 26], [0.15, 26], [0.9, 26]]) { F.ladosRot[0] = Object.assign({}, t0, { en, dist }); if (PO.escenaCabe(F)) { ok = true; break; } }
      if (!ok) F.ladosRot[0] = Object.assign({}, t0, { texto: t0.texto.replace('AB = ', ''), en: 0.2 });
    }
    return F;
  }
  const figJ5 = (fi, o = {}) => figEscalera([0, puntaA(fi)], [pieB(fi), 0], Object.assign({ cm: '2 m', cb: mV(pieB(fi)),
    alt: `Una escalera de 4 m apoyada en la pared, con el pie a ${mV(pieB(fi))} de la esquina C. M es la mitad de la escalera; CM, de la esquina a esa mitad, mide 2 m.` }, o));
  // La pared inclinada de la predicción: forma 110° con el piso; el pie B a 2 m de la esquina y AB = 4 m.
  const P110 = (() => { const k = Math.cos(110 * RAD), t = (2 * 2 * k + Math.sqrt(16 * k * k - 4 * (4 - 16))) / 2; return { A: U.polar([0, 0], t, 110), B: [2, 0] }; })();
  const CM110 = U.dist([0, 0], U.medio(P110.A, P110.B));
  // Figura de examen: el triángulo rectángulo ACB con la hipotenusa AB abajo (A a la izquierda), C arriba y M, su punto
  // medio. a: el ángulo en A (grados); h: la hipotenusa en el dibujo. o.altura: traza la altura CH (punteada).
  function figRect(a, o = {}) {
    const h = o.h || 10, A = [-h / 2, 0], B = [h / 2, 0], C = U.polar(A, h * Math.cos(a * RAD), a), M = [0, 0], H = [C[0], 0];
    const pos = { A, B, C, M, H };
    const pt = (id, lado) => ({ id, x: pos[id][0], y: pos[id][1], rotulo: id, lado, sinPunto: true });
    const fg = { alt: o.alt, alto: o.alto || 220, vista: { x: [-h / 2 - 0.12 * h, h / 2 + 0.12 * h], y: [-0.26 * h, C[1] + 0.12 * h] },
      puntos: [pt('A', 200), pt('B', -20), pt('C', 90), pt('M', -90)].concat(o.altura ? [pt('H', -90)] : []),
      segmentos: [{ de: 'A', a: 'B' }, { de: 'A', a: 'C' }, { de: 'B', a: 'C' }, Object.assign({ de: 'C', a: 'M' }, o.sinCM ? { discontinua: true, grosor: 'fino' } : { color: 'i', grosor: 'variable' })].concat(o.altura ? [{ de: 'C', a: 'H', discontinua: true, grosor: 'fino' }] : []),
      angulos: [{ en: 'C', de: 'A', a: 'B', color: o.rectoPedido ? undefined : 'h', radio: 12, mide: 90, texto: o.rectoPedido ? '?' : undefined, arcoRecto: !!o.rectoPedido }]
        .concat(o.altura ? [{ en: 'H', de: 'B', a: 'C', radio: 8 }] : [])
        .concat((o.ang || []).map(x => Object.assign({ radio: 22, holgura: 6, marcas: 1, mide: U.angulo(pos[x.en], pos[x.de], pos[x.a]) }, x))) };
    PO.acomodarLetras(fg, fg.puntos.map(q => q.id));
    // Si se da la medida de AB, va sola debajo de AB (sin las llaves de sus mitades, que la pisaban; M lo dice la letra).
    const conAB = (o.lados || []).some(t => t.de === 'A' && t.a === 'B'), lados = (o.lados || []).map(t => (t.de === 'A' && t.a === 'B' ? Object.assign({}, t, { dist: 7, en: 0.75 }, /=/.test(String(t.texto)) ? {} : { texto: `AB = ${t.texto}` }) : t));
    // (Auditoría del 19 nov, M10: junto a MB, «14 cm» se leía como MB; el rótulo dice qué lado mide: «AB = 14 cm».)
    const F = Object.assign({ objeto: 'angulos', figura: fg }, conAB || o.altura ? {} : { llaves: [{ de: 'A', a: 'M', marcas: 1, ref: 'C', dist: 9 }, { de: 'M', a: 'B', marcas: 1, ref: 'C', dist: 9 }] }, lados.length ? { ladosRot: lados } : {}, o.sinEscala ? { sinEscala: true } : {});
    const k = lados.findIndex(t => t.de === 'C' && t.a === 'M');
    if (k >= 0) acomodarRotulo(F, k, ['B', 'A'], [0.5, 0.65, 0.8, 0.35]);
    // «AB = …» donde quepa a lo largo de AB; si no cabe, la medida sola, como antes.
    const q = (F.ladosRot || []).findIndex(t => t.de === 'A' && t.a === 'B');
    if (q >= 0 && !PO.escenaCabe(F)) {
      const t0 = Object.assign({}, F.ladosRot[q]); let ok = false;
      for (const en of [0.25, 0.85, 0.15, 0.6, 0.4]) { F.ladosRot[q] = Object.assign({}, t0, { en }); if (PO.escenaCabe(F)) { ok = true; break; } }
      if (!ok) F.ladosRot[q] = Object.assign({}, t0, { texto: String(t0.texto).replace('AB = ', '') });
    }
    return F;
  }
  const D_MEDIANA = 'Mediana: el segmento que va de un vértice al punto medio del lado de enfrente.';
  const D_MH = 'En un triángulo rectángulo, la mediana relativa a la hipotenusa mide la mitad de ella: MA = MB = MC.';
  const D_HIP = 'En un triángulo rectángulo, la hipotenusa es el lado de enfrente del ángulo recto; es el lado mayor.';
  const D_EXT = 'Un ángulo exterior de un triángulo mide lo que suman los dos interiores que no están a su lado.';
  // Tipo 0: la mediana a partir de la hipotenusa, o al revés.
  function casoMediana(r) {
    for (let i = 0; i < 400; i++) {
      const alReves = r.ent(0, 1) === 1, ab = alReves ? 2 * r.ent(3, 12) + r.de([0, 1]) : 2 * r.ent(3, 12), cmv = ab / 2, a = 5 * r.ent(6, 12);
      const F = figRect(a, { lados: [{ de: 'C', a: 'M', texto: alReves ? cm(cmv) : '?', color: 'i', ref: 'A', dist: 5 }, { de: 'A', a: 'B', texto: alReves ? '?' : cm(ab), ref: 'C', dist: 31 }],
        alt: `Triángulo ABC con el ángulo recto en C y M, punto medio de la hipotenusa AB. ${alReves ? `La mediana CM mide ${cm(cmv)}; AB lleva «?».` : `AB mide ${cm(ab)}; la mediana CM lleva «?».`}` });
      if (!cabe(F)) continue;
      const v = alReves ? ab : cmv, dado = alReves ? cmv : ab;
      const ops = opciones(v, [
        { id: 'igual', valor: dado, error: 'GE-CON13', siFuera: 'Ver que CM llega al punto medio está bien; pero no mide lo mismo que AB: es la mitad.' },
        { id: 'reves', valor: alReves ? cmv / 2 : ab * 2, error: 'GE-CON11', siFuera: alReves ? 'Usar la mitad está bien; aquí la mitad es CM, y AB es el doble.' : 'Usar el doble está bien al revés; aquí CM es la mitad de AB.' },
        { id: 'cuarto', valor: alReves ? cmv * 4 : ab / 4, error: 'GE-CON53', siFuera: alReves ? 'Duplicar está bien una vez; AB es el doble de CM, no su cuádruple.' : 'Partir en dos está bien una vez; CM ya es la mitad de AB, no su cuarta parte.' },
        { id: 'resta', valor: alReves ? cmv + 2 : ab - 2, error: 'GE-CON44', siFuera: 'Comparar CM con AB está bien; la relación es la mitad, no una resta.' },
      ], cm);
      if (ops.length < 4) continue;
      return { pregunta: alReves ? `En △ABC, recto en C, M es el punto medio de la hipotenusa AB y CM = ${cm(cmv)}. ¿Cuánto mide AB?` : `En △ABC, recto en C, M es el punto medio de la hipotenusa AB = ${cm(ab)}. ¿Cuánto mide CM?`,
        datos: [D_MEDIANA, D_MH], dibujo: fig(F), opciones: ops,
        solucion: { texto: 'CM es la mediana relativa a la hipotenusa: mide la mitad de AB.', ecuacion: junto(alReves ? `AB = 2 · ${f(cmv)} = ${cm(ab)}` : `CM = ${ab} ÷ 2 = ${cm(cmv)}`) } };
    }
    throw new Error('casoMediana sin caso');
  }
  // Tipo 1: los dos isósceles: con m∠A (o m∠B), el ángulo que CM forma con un cateto.
  function casoIsoAng(r) {
    for (let i = 0; i < 400; i++) {
      const a = r.ent(20, 70), conA = r.ent(0, 1) === 1, pide = r.de(['ACM', 'BCM']);
      if (a === 45) continue;
      const v = pide === 'ACM' ? a : 90 - a, dadoV = conA ? 'A' : 'B', dadoVal = conA ? a : 90 - a;
      const ang = [conA ? { en: 'A', de: 'B', a: 'C', color: 'h', texto: gr(a), radio: 20 } : { en: 'B', de: 'C', a: 'A', color: 'h', texto: gr(90 - a), radio: 20 },
        pide === 'ACM' ? { en: 'C', de: 'A', a: 'M', texto: '?', radio: 24 } : { en: 'C', de: 'M', a: 'B', texto: '?', radio: 24 }];
      // (M2: se dibuja con otro ángulo en A, para que lo pedido no se mida con transportador.)
      const F = figRect(a <= 45 ? a + 14 : a - 14, { sinEscala: true, ang, alt: `Triángulo ABC con el ángulo recto en C y la mediana CM. El ángulo ${dadoV} mide ${dadoVal}° y el ángulo ${pide} lleva «?». El dibujo no está a escala.` });
      if (!cabe(F)) continue;
      const ops = opciones(v, [
        { id: 'comp', valor: 90 - v, error: 'GE-CON54', siFuera: `Ver un isósceles está bien; pero ${pide} copia el ángulo del otro extremo, el de ${pide === 'ACM' ? 'A' : 'B'}.` },
        { id: 'mitad', valor: 45, error: 'GE-CON55', siFuera: 'CM no es bisectriz: no parte el recto en dos iguales, salvo si los catetos son iguales.' },
        { id: 'doble', valor: 2 * dadoVal, error: 'GE-CON56', siFuera: `${2 * dadoVal}° es el ángulo exterior en M; ${pide} es un ángulo en C.` },
        { id: 'resto', valor: 180 - 2 * v, error: 'GE-CON57', siFuera: 'Eso mide el ángulo de M en el isósceles; se pide el de C.' },
      ].filter(d => d.valor > 0 && d.valor < 180), gr);
      if (ops.length < 4) continue;
      return { pregunta: `En △ABC, recto en C, M es el punto medio de la hipotenusa AB. Si m∠${dadoV} = ${dadoVal}°, ¿cuánto mide el ángulo ${pide}?${NO_ESC}`,
        datos: [D_MH, D_ISO, D_SUMA], dibujo: fig(F), opciones: ops,
        solucion: { texto: `MC = M${pide[0]}: △${pide[0]}MC es isósceles y copia el ángulo de ${pide[0]}.`, ecuacion: junto(`m∠${pide} = m∠${pide[0]} = ${gr(v)}`) } };
    }
    throw new Error('casoIsoAng sin caso');
  }
  // Tipo 2: con x: CM = x + p y AB = qx − s; AB = 2·CM.
  function casoMedX(r) {
    for (let i = 0; i < 400; i++) {
      const x = r.ent(3, 12), p = r.ent(1, 6), q = r.ent(3, 4), mv = x + p, ab = 2 * mv, s = q * x - ab;
      if (s < 1 || s > 15) continue;
      const e1 = `x + ${p}`, e2 = `${q}x − ${s}`;
      const F = figRect(r.de([35, 40, 50, 55]), { lados: [{ de: 'C', a: 'M', texto: e1, color: 'i', ref: 'A', dist: 5 }, { de: 'A', a: 'B', texto: e2, ref: 'C', dist: 31 }], alt: `Triángulo ABC recto en C con la mediana CM, que mide ${e1}; la hipotenusa AB mide ${e2}.` });
      if (!cabe(F)) continue;
      const xMal = (s + p) / (q - 1);
      const ops = opciones(mv, [
        { id: 'x', valor: x, error: 'GE-CON30', siFuera: `Hallar x = ${x} está bien; falta reemplazarlo en CM.` },
        { id: 'ab', valor: ab, error: 'GE-CON11', siFuera: `${cm(ab)} es AB; CM es la mitad.` },
        { id: 'igual', valor: Number.isInteger(xMal) ? xMal + p : NaN, error: 'GE-CON13', siFuera: 'Igualar CM con AB olvida que CM es la mitad: el doble de CM es AB.' },
        { id: 'otro', valor: Number.isInteger((s + p) / (q - 2)) ? (s + p) / (q - 2) + p : NaN, error: 'GE-TRI15', siFuera: `Duplicar CM está bien; pero el doble de x + ${p} es 2x + ${2 * p}: el número también se duplica.` },
      ], cm);
      if (ops.length < 4) continue;
      return { pregunta: `En △ABC, recto en C, CM es la mediana relativa a la hipotenusa. Si CM = ${e1} y AB = ${e2}, en centímetros, ¿cuánto mide CM?`,
        datos: [D_MEDIANA, D_MH], dibujo: fig(F), opciones: ops,
        solucion: { texto: 'AB mide el doble de CM.', ecuacion: [junto(`${q}x − ${s} = 2(x + ${p})`), FL, junto(`x = ${x}`), FL, junto(`CM = ${cm(mv)}`)] } };
    }
    throw new Error('casoMedX sin caso');
  }
  // Tipo 3 (examen): el ángulo entre la mediana CM y la altura CH: |m∠A − m∠B|.
  function casoMedAltura(r) {
    for (let i = 0; i < 400; i++) {
      const a = r.ent(15, 40), b = 90 - a, v = b - a;
      const F = figRect(a, { altura: true, ang: [{ en: 'A', de: 'B', a: 'C', color: 'h', radio: 26 }, { en: 'C', de: 'M', a: 'H', radio: 40 }], alt: `Triángulo ABC recto en C, con m∠A = ${a}° (su arco). CM es la mediana a la hipotenusa y CH, la altura, punteada. El ángulo MCH, el pedido, lleva un arco en tinta.` });
      if (!cabe(F)) continue;
      const ops = opciones(v, [
        { id: 'a', valor: a, error: 'GE-CON54', siFuera: `${a}° es m∠ACM; MCH es lo que queda entre la mediana y la altura.` },
        { id: 'b', valor: b, error: 'GE-CON58', siFuera: `${b}° es el ángulo B; falta restarle lo que copia la mediana.` },
        { id: 'mitad', valor: v / 2, error: 'GE-CON55', siFuera: 'Restar los ángulos está bien; no se parte en dos.' },
        { id: 'suma', valor: 90 - 2 * a + 2 * a === v ? NaN : 2 * a, error: 'GE-CON56', siFuera: `${2 * a}° es el ángulo exterior en M; se pide un ángulo en C.` },
      ].filter(d => Number.isFinite(d.valor) && d.valor > 0), gr);
      if (ops.length < 4) continue;
      return { pregunta: `En △ABC, recto en C, m∠A = ${a}°. CM es la mediana relativa a la hipotenusa y CH, la altura. ¿Cuánto mide el ángulo MCH?`,
        datos: [D_MH, D_ISO, D_SUMA, 'Altura: el segmento perpendicular desde un vértice al lado de enfrente.'], dibujo: fig(F), opciones: ops,
        solucion: { texto: `MC = MA: m∠ACM = ${a}°. En △ACH, m∠ACH = 90° − ${a}° = ${b}°.`, ecuacion: junto(`m∠MCH = ${b}° − ${a}° = ${gr(v)}`) } };
    }
    throw new Error('casoMedAltura sin caso');
  }
  // Tipo 4 (examen, como San Marcos 2023-II): el mayor valor entero de un cateto si CM = k: el cateto es menor que AB.
  function casoEntero(r) {
    for (let i = 0; i < 400; i++) {
      const k = r.ent(4, 12), ab = 2 * k, v = ab - 1, a = r.de([30, 35, 40]);
      const F = figRect(a, { lados: [{ de: 'C', a: 'M', texto: cm(k), color: 'i', ref: 'A', dist: 5 }, { de: 'A', a: 'C', texto: '?', ref: 'B', dist: 5 }], alt: `Triángulo ABC recto en C con la mediana CM de ${cm(k)}. El cateto AC lleva «?».` });
      if (!cabe(F)) continue;
      const ops = opciones(v, [
        { id: 'limite', valor: ab, error: 'GE-CON50', siFuera: `${cm(ab)} es AB, la hipotenusa: un cateto es menor, no igual.` },
        { id: 'cm', valor: k, error: 'GE-CON51', siFuera: `${cm(k)} es CM; el cateto puede ser más largo que la mediana.` },
        { id: 'cm1', valor: k - 1, error: 'GE-CON52', siFuera: 'Usar «menor que» está bien; pero el tope es AB, no CM.' },
        { id: 'suma', valor: 3 * k - 1, error: 'GE-DT15', siFuera: 'Sumar lados da un tope de la desigualdad; el que manda aquí es AB, la hipotenusa.' },
      ], cm);
      if (ops.length < 4) continue;
      return { pregunta: `En △ABC, recto en C, la mediana relativa a la hipotenusa mide CM = ${cm(k)}. Si AC mide un número entero de centímetros, ¿cuál es su mayor valor posible?`,
        datos: [D_MH, D_HIP], dibujo: fig(F), opciones: ops,
        solucion: { texto: `AB = 2 · ${k} = ${cm(ab)}. AC es un cateto: menor que AB, nunca igual.`, ecuacion: junto(`AC < ${ab} cm   →   AC = ${cm(v)}`) } };
    }
    throw new Error('casoEntero sin caso');
  }

  // Ejemplos resueltos de «Mediana relativa a la hipotenusa» (molde §3). Cuentas rehechas aparte (scratchpad
  // e5-geometria/cuentas5.py): 4 ÷ 2 = 2; 2 · 6,5 = 13; 12 ÷ 2 = 6; 30°; 50°; 2(x + 2) = 3x − 1, x = 5; 2 · 25 = 50; 5 + 5
  // + 6 = 16; 5 ÷ 2 = 2,5; 3a = 90, a = 30; 64 − 26 = 38; AB = 10, AC < 10, 9; 3x = 90 − (2x + 5), x = 17, 39°; 5 + 3 + 4
  // = 12; CB = 3 = CM = MB: equilátero, 60° en B y 30° en A.
  const EJ5 = [];
  EJ5.push({ nivel: 1, titulo: 'La escalera y su mitad',
    figura: fig(figJ5(50, { manija: false, cm: '?', cb: '', alt: 'Una escalera AB de 4 m apoyada en la pared; C es la esquina de pared y piso. M es la mitad de la escalera y CM lleva «?».' })),
    enunciado: 'Una escalera AB de 4 m está apoyada en una pared vertical; C es la esquina de la pared con el piso y M, la mitad de la escalera. ¿Cuánto mide CM?',
    datos: [D_MEDIANA, D_MH],
    solucion: [{ texto: 'La pared y el piso forman un ángulo recto en C: CM es la mediana relativa a la hipotenusa AB.', ecuacion: junto(['CM = 4 ÷ 2 = ', dF('2 m')]) }],
    respuesta: ['CM = ', dF('2 m')] });
  EJ5.push({ nivel: 1, titulo: 'De la mediana a la hipotenusa',
    figura: fig(figRect(37, { lados: [{ de: 'C', a: 'M', texto: '6,5 cm', color: 'i', ref: 'A', dist: 5 }, { de: 'A', a: 'B', texto: '?', ref: 'C', dist: 24, en: 0.75 }], alt: 'Triángulo ABC recto en C con la mediana CM de 6,5 cm; la hipotenusa AB lleva «?».' })),
    enunciado: 'En △ABC, recto en C, la mediana relativa a la hipotenusa mide CM = 6,5 cm. ¿Cuánto mide la hipotenusa AB?',
    datos: [D_MEDIANA, D_MH],
    solucion: [{ texto: 'CM es la mitad de AB: AB es el doble de CM.', ecuacion: junto(['AB = 2 · 6,5 = ', dF('13 cm')]) }],
    respuesta: ['AB = ', dF('13 cm')] });
  EJ5.push({ nivel: 1, titulo: 'Tres distancias iguales',
    figura: fig(figRect(30, { lados: [{ de: 'A', a: 'B', texto: '12 cm', ref: 'C', dist: 31 }], alt: 'Triángulo ABC recto en C con la hipotenusa AB de 12 cm y su punto medio M; se traza CM.' })),
    enunciado: 'En △ABC, recto en C, la hipotenusa mide AB = 12 cm y M es su punto medio. ¿Cuánto miden MA, MB y MC?',
    datos: [D_MH],
    solucion: [{ texto: 'M parte AB en dos de 6 cm, y la mediana CM mide lo mismo: la mitad de la hipotenusa.', ecuacion: junto('MA = MB = MC = 12 ÷ 2') }],
    respuesta: ['Los tres miden ', dF('6 cm')] });
  EJ5.push({ nivel: 1, titulo: 'Un isósceles en la escalera',
    figura: fig(figRect(30, { ang: [{ en: 'A', de: 'B', a: 'C', color: 'h', texto: '30°' }, { en: 'C', de: 'A', a: 'M', texto: '?', radio: 24 }], alt: 'Triángulo ABC recto en C con la mediana CM. El ángulo A mide 30° y el ángulo ACM lleva «?».' })),
    enunciado: 'En △ABC, recto en C, M es el punto medio de la hipotenusa AB. Si m∠A = 30°, ¿cuánto mide el ángulo ACM?',
    datos: [D_MH, D_ISO],
    solucion: [{ texto: 'MC = MA: △AMC es isósceles, y sus ángulos en A y en C son iguales.', ecuacion: junto('m∠ACM = m∠A') }],
    respuesta: ['m∠ACM = ', dF('30°')] });
  EJ5.push({ nivel: 1, titulo: 'El otro isósceles',
    figura: fig(figRect(40, { ang: [{ en: 'B', de: 'C', a: 'A', color: 'h', texto: '50°' }, { en: 'C', de: 'M', a: 'B', texto: '?', radio: 24 }], alt: 'Triángulo ABC recto en C con la mediana CM. El ángulo B mide 50° y el ángulo BCM lleva «?».' })),
    enunciado: 'En △ABC, recto en C, M es el punto medio de la hipotenusa AB. Si m∠B = 50°, ¿cuánto mide el ángulo BCM?',
    datos: [D_MH, D_ISO],
    solucion: [{ texto: 'MC = MB: △BMC es isósceles, y sus ángulos en B y en C son iguales.', ecuacion: junto('m∠BCM = m∠B') }],
    respuesta: ['m∠BCM = ', dF('50°')] });

  EJ5.push({ nivel: 2, titulo: 'La mediana con x',
    figura: fig(figRect(40, { lados: [{ de: 'C', a: 'M', texto: 'x + 2', color: 'i', ref: 'A', dist: 5 }, { de: 'A', a: 'B', texto: '3x − 1', ref: 'C', dist: 31 }], alt: 'Triángulo ABC recto en C con la mediana CM de x + 2 y la hipotenusa AB de 3x − 1.' })),
    enunciado: 'En △ABC, recto en C, CM es la mediana relativa a la hipotenusa. Si CM = x + 2 y AB = 3x − 1, en centímetros, ¿cuánto vale x?',
    datos: [D_MEDIANA, D_MH],
    solucion: [{ texto: 'AB es el doble de CM.', ecuacion: [junto('3x − 1 = 2(x + 2)'), FL, junto('3x − 1 = 2x + 4'), FL, junto(['x = ', dF('5')])] },
      { texto: 'Compruebo: CM = 7 cm y AB = 14 cm.' }],
    respuesta: ['x = ', dF('5')] });
  EJ5.push({ nivel: 2, titulo: 'El ángulo en M',
    figura: fig(figRect(36, { sinEscala: true, ang: [{ en: 'A', de: 'B', a: 'C', color: 'h', radio: 26 }, { en: 'M', de: 'B', a: 'C', texto: '?', radio: 18 }], alt: 'Triángulo ABC recto en C con la mediana CM. El ángulo A, de 25°, lleva su arco, y el ángulo BMC lleva «?». El dibujo no está a escala.' })),
    enunciado: 'En △ABC, recto en C, M es el punto medio de la hipotenusa AB y m∠A = 25°. ¿Cuánto mide el ángulo BMC? El dibujo no está a escala.',
    datos: [D_MH, D_ISO, D_EXT],
    solucion: [{ texto: 'MC = MA: en △AMC, m∠ACM = m∠A = 25°.' },
      { texto: 'BMC es exterior de △AMC, junto a M.', ecuacion: junto(['m∠BMC = 25° + 25° = ', dF('50°')]) }],
    respuesta: ['m∠BMC = ', dF('50°')] });
  EJ5.push({ nivel: 2, titulo: 'El perímetro de un isósceles',
    figura: fig(figRect(U.grados(Math.acos(0.6)), { lados: [{ de: 'A', a: 'B', texto: '10 cm', ref: 'C', dist: 31 }, { de: 'A', a: 'C', texto: '6 cm', ref: 'B', dist: 5 }], alt: 'Triángulo ABC recto en C con la hipotenusa AB de 10 cm, el cateto AC de 6 cm y la mediana CM.' })),
    enunciado: 'En △ABC, recto en C, AB = 10 cm y AC = 6 cm. M es el punto medio de AB. ¿Cuánto mide el perímetro de △AMC?',
    datos: [D_MH, D_PER],
    solucion: [{ texto: 'MA = 5 cm, la mitad de AB, y MC también: la mediana mide la mitad de la hipotenusa.' },
      { texto: 'Sumo los tres lados de △AMC.', ecuacion: junto(['5 + 5 + 6 = ', dF('16 cm')]) }],
    respuesta: ['Perímetro = ', dF('16 cm')] });
  EJ5.push({ nivel: 2, titulo: 'El gato en la escalera',
    figura: fig(figJ5(35, { manija: false, ab: '5 m', cm: '?', cb: '', alt: 'Una escalera AB de 5 m resbala por la pared; C es la esquina. Un gato está en M, la mitad de la escalera; CM lleva «?».' })),
    enunciado: 'Un gato está sentado en la mitad M de una escalera de 5 m que resbala con la punta en la pared y el pie en el piso. ¿A qué distancia queda de la esquina C mientras resbala?',
    datos: [D_MEDIANA, D_MH],
    solucion: [{ texto: 'En cada posición, pared y piso forman un ángulo recto: CM es la mediana relativa a la hipotenusa AB.' },
      { texto: 'Mide siempre la mitad de la escalera.', ecuacion: junto(['CM = 5 ÷ 2 = ', dF('2,5 m')]) }],
    respuesta: ['Siempre a ', dF('2,5 m')] });
  EJ5.push({ nivel: 2, titulo: 'Un ángulo doble que el otro',
    figura: fig(figRect(40, { sinEscala: true, ang: [{ en: 'C', de: 'A', a: 'M', color: 'h', radio: 24 }, { en: 'C', de: 'M', a: 'B', color: 'h', marcas: 2, radio: 30 }, { en: 'A', de: 'B', a: 'C', texto: '?', radio: 26 }], alt: 'Triángulo ABC recto en C con la mediana CM, que parte el recto en dos: el ángulo BCM es el doble del ACM. El ángulo A lleva «?». El dibujo no está a escala.' })),
    enunciado: 'En △ABC, recto en C, la mediana CM parte el ángulo recto en dos, y m∠BCM es el doble de m∠ACM. ¿Cuánto mide el ángulo A? El dibujo no está a escala.',
    datos: [D_MH, D_ISO],
    solucion: [{ texto: 'Con m∠ACM = x, el recto es x + 2x.', ecuacion: [junto('3x = 90'), FL, junto('x = 30')] },
      { texto: 'MC = MA: el isósceles AMC copia el ángulo de A.', ecuacion: junto(['m∠A = m∠ACM = ', dF('30°')]) }],
    respuesta: ['m∠A = ', dF('30°')] });

  EJ5.push({ nivel: 3, titulo: 'Mediana y altura',
    figura: fig(figRect(26, { altura: true, ang: [{ en: 'A', de: 'B', a: 'C', color: 'h', radio: 26 }, { en: 'C', de: 'M', a: 'H', radio: 40 }], alt: 'Triángulo ABC recto en C, con m∠A = 26° (su arco). CM es la mediana a la hipotenusa y CH, la altura, punteada. El ángulo MCH, el pedido, lleva un arco en tinta.' })),
    enunciado: 'En △ABC, recto en C, m∠A = 26°. CM es la mediana relativa a la hipotenusa y CH, la altura. ¿Cuánto mide el ángulo MCH?',
    alternativas: ['19°', '26°', '38°', '52°', '64°'],
    datos: [D_MH, D_ISO, D_SUMA, 'Altura: el segmento perpendicular desde un vértice al lado de enfrente.'],
    solucion: [{ texto: 'MC = MA: el isósceles AMC copia el ángulo de A.', ecuacion: junto('m∠ACM = 26°') },
      { texto: 'En △ACH, recto en H, el ángulo en C es lo que falta para 180°.', ecuacion: junto('m∠ACH = 180° − 90° − 26° = 64°') },
      { texto: 'MCH es lo que queda entre los dos.', ecuacion: junto(['m∠MCH = 64° − 26° = ', dF('38°')]) },
      { texto: 'Las otras: 19° parte la resta en dos; 26° es el ángulo ACM; 52° es el exterior en M; 64° es el ángulo ACH.' }],
    respuesta: ['m∠MCH = ', dF('38°')] });
  EJ5.push({ nivel: 3, titulo: 'El mayor cateto entero',
    figura: fig(figRect(35, { lados: [{ de: 'C', a: 'M', texto: '5 cm', color: 'i', ref: 'A', dist: 5 }, { de: 'A', a: 'C', texto: '?', ref: 'B', dist: 5 }], alt: 'Triángulo ABC recto en C con la mediana CM de 5 cm. El cateto AC lleva «?».' })),
    enunciado: 'En △ABC, recto en C, la mediana relativa a la hipotenusa mide CM = 5 cm. Si AC mide un número entero de centímetros, ¿cuál es su mayor valor posible?',
    alternativas: ['4 cm', '5 cm', '9 cm', '10 cm', '14 cm'],
    datos: [D_MH, D_HIP],
    solucion: [{ texto: 'La hipotenusa mide el doble de la mediana.', ecuacion: junto('AB = 2 · 5 = 10 cm') },
      { texto: 'AC es un cateto: es menor que la hipotenusa, nunca igual.', ecuacion: junto('AC < 10 cm') },
      { texto: 'El mayor entero menor que 10 es 9.', ecuacion: junto(['AC = ', dF('9 cm')]) },
      { texto: 'Las otras: 10 cm es el valor límite, AB; 5 cm y 4 cm toman CM como tope; 14 cm suma el cateto de 9 cm y la mediana.' }],
    respuesta: ['AC = ', dF('9 cm')] });
  EJ5.push({ nivel: 3, titulo: 'Un ángulo con x',
    figura: fig(figRect(39, { ang: [{ en: 'A', de: 'B', a: 'C', color: 'h', radio: 26 }, { en: 'C', de: 'M', a: 'B', color: 'h', marcas: 2, radio: 26 }], alt: 'Triángulo ABC recto en C con la mediana CM. El ángulo A mide 2x + 5° y el ángulo MCB, 3x.' })),
    enunciado: 'En △ABC, recto en C, CM es la mediana relativa a la hipotenusa. Si m∠A = 2x + 5° y m∠MCB = 3x, ¿cuánto mide el ángulo A?',
    alternativas: ['17°', '39°', '45°', '51°', '34°'],
    datos: [D_MH, D_ISO, D_SUMA],
    solucion: [{ texto: 'MC = MB: m∠MCB = m∠B. Y en △ABC, m∠A + m∠B = 90°.', ecuacion: junto('2x + 5 + 3x = 90') },
      { texto: 'Despejo x.', ecuacion: [junto('5x = 85'), FL, junto('x = 17')] },
      { texto: 'Reemplazo en el ángulo A.', ecuacion: junto(['m∠A = 2 · 17 + 5 = ', dF('39°')]) },
      { texto: 'Las otras: 17° es x; 51° es el ángulo B; 45° parte el recto en dos; 34° olvida sumar 5.' }],
    respuesta: ['m∠A = ', dF('39°')] });
  EJ5.push({ nivel: 3, titulo: 'Base media y mediana',
    figura: fig((() => { const F = figRect(U.grados(Math.acos(0.6)), { lados: [{ de: 'A', a: 'C', texto: '6 cm', ref: 'B', dist: 5 }], alt: 'Triángulo ABC recto en C, con AC = 6 cm y CB = 8 cm. M es el punto medio de AB y N, el de CB; se trazan CM y MN.' });
      const C = F.figura.puntos.find(q => q.id === 'C'), B = F.figura.puntos.find(q => q.id === 'B'), N = U.medio([C.x, C.y], [B.x, B.y]);
      F.figura.puntos.push({ id: 'N', x: N[0], y: N[1], rotulo: 'N', lado: 45, sinPunto: true }); F.figura.segmentos.push({ de: 'M', a: 'N', color: 'o', grosor: 'variable' });
      F.ladosRot.push({ de: 'C', a: 'B', texto: '8 cm', ref: 'A', dist: 18 }); F.llaves.push({ de: 'C', a: 'N', marcas: 2, ref: 'A' }, { de: 'N', a: 'B', marcas: 2, ref: 'A' });
      PO.acomodarLetras(F.figura, ['A', 'B', 'C', 'M', 'N']); return F; })()),
    enunciado: 'En △ABC, recto en C, AC = 6 cm y CB = 8 cm, y la hipotenusa mide 10 cm. M es el punto medio de AB y N, el de CB. ¿Cuánto mide el perímetro de △CMN?',
    alternativas: ['12 cm', '14 cm', '15 cm', '16 cm', '24 cm'],
    datos: [D_MH, D_TBM, D_PER],
    solucion: [{ texto: 'CM es la mediana a la hipotenusa: CM = 10 ÷ 2 = 5 cm. Y CN = 8 ÷ 2 = 4 cm.' },
      { texto: 'MN une los puntos medios de AB y CB: es base media y mide la mitad de AC.', ecuacion: junto('MN = 6 ÷ 2 = 3 cm') },
      { texto: 'Sumo los tres lados de △CMN.', ecuacion: junto(['5 + 3 + 4 = ', dF('12 cm')]) },
      { texto: 'Las otras: 14 cm toma MN = 5 cm; 15 cm no parte AC; 16 cm usa CN = 8 cm; 24 cm es el perímetro de ABC.' }],
    respuesta: ['Perímetro = ', dF('12 cm')] });
  EJ5.push({ nivel: 3, titulo: 'El pie a la mitad',
    figura: fig(figJ5(60, { manija: false, ab: '6 m', cm: '', cb: '3 m', alt: 'Una escalera AB de 6 m apoyada en la pared, con el pie B a 3 m de la esquina C. M es la mitad de la escalera.' })),
    enunciado: 'Una escalera AB de 6 m está apoyada en una pared vertical, con el pie B a 3 m de la esquina C. ¿Qué ángulo forma la escalera con la pared?',
    alternativas: ['30°', '45°', '60°', '90°', '120°'],
    datos: [D_MH, 'Un triángulo con los tres lados iguales (equilátero) tiene sus tres ángulos de 60°.', D_SUMA],
    solucion: [{ texto: 'CM es la mediana a la hipotenusa: CM = MB = 3 m. Y CB = 3 m también.' },
      { texto: '△CMB tiene los tres lados de 3 m: es equilátero, y m∠B = 60°.' },
      { texto: 'En △ACB, recto en C, el ángulo en A, el de la escalera con la pared, es lo que falta.', ecuacion: junto(['m∠A = 180° − 90° − 60° = ', dF('30°')]) },
      { texto: 'Las otras: 60° es el ángulo con el piso; 45° parte el recto; 90° es el de la esquina; 120° es el exterior en M.' }],
    respuesta: ['m∠BAC = ', dF('30°')] });

  const medianaHip = {
    id: 'mediana-hipotenusa',
    titulo: 'Mediana relativa a la hipotenusa',
    pregunta: '¿Qué distancia no cambia cuando una escalera resbala por la pared?',
    temas: ['Mediana relativa a la hipotenusa'],
    pieza: GO,
    aprendizaje: 'En un triángulo rectángulo, la mediana a la hipotenusa mide la mitad de ella y lo parte en dos triángulos isósceles.',
    actividad: 'Deslizar una escalera por la pared y mirar la distancia de la esquina a su mitad.',
    // Lee: hipotenusa y cateto, la mediana relativa a la hipotenusa (el nombre) y la escalera. No dice cuánto mide CM.
    lee: {
      tarjetas: [
        { titulo: 'La escalera en la esquina', texto: 'Una escalera apoyada en la pared forma, con la pared y el piso, un triángulo rectángulo: el ángulo recto está en la esquina C. La escalera, AB, es el lado de enfrente de ese ángulo.',
          pieza: GO, dibujo: fig(figJ5(40, { manija: false, cm: '', cb: '', alt: 'Una escalera AB apoyada en la pared; C es la esquina de pared y piso, con el ángulo recto. M es la mitad de la escalera y se traza CM.' })) },
        { titulo: 'Hipotenusa y catetos', texto: 'En un triángulo rectángulo, el lado de enfrente del ángulo recto se llama hipotenusa y es el más largo. Los otros dos, los que forman el recto, son los catetos.' },
        { titulo: 'La mediana', texto: 'La mediana relativa a la hipotenusa va del vértice del recto, C, a M, el punto medio de la hipotenusa. En la escalera: de la esquina a la mitad de la escalera.' },
        { titulo: 'Qué mirar al jugar', texto: 'Vas a deslizar la escalera, arrastrando su pie B o con el control. Mira dónde queda el pie y cuánto mide CM en cada posición.' },
      ],
    },
    ejemplos: EJ5,
    juega: {
      pieza: GO,
      consigna: 'Una escalera de 4 m resbala con la punta en la pared y el pie en el piso. C es la esquina.',
      mision: {
        texto: 'Deslízala hasta que el pie B quede a 2 m de la esquina C.',
        logrado: v => v.fi === 60,
        bien: 'Pie a 2 m: CM = MB = CB = 2 m, la mitad de la escalera.',
      },
      voz: 'Desliza la escalera. ¿Qué medida no cambia?',
      leyenda: [
        { s: 'A', t: 'la punta, en la pared' },
        { s: 'B', t: 'el pie, en el piso; se arrastra' },
        { s: 'C', t: 'la esquina de pared y piso' },
        { s: 'M', t: 'la mitad de la escalera' },
        { s: dI('CM'), t: 'de la esquina a la mitad' },
        { s: dH('cuadradito'), t: 'el ángulo recto en C' },
      ],
      controles: [{ id: 'fi', etiqueta: 'Ángulo de la escalera con el piso', min: 20, max: 70, paso: 10, inicio: 30, unidad: '°', decimales: 0, color: 'c-h' }],
      dibujo: v => ({ datos: figJ5(v.fi), estado: {} }),
      arrastres: [{ id: 'pie-b', etiqueta: 'pie B de la escalera', color: 'c-i',
        donde: v => PO.aPantalla(figJ5(v.fi), [pieB(v.fi), 0]),
        mover: (pt, v) => { const q = PO.aPlano(figJ5(v.fi), pt); return { fi: U.grados(Math.acos(Math.max(-1, Math.min(1, q[0] / L5)))) }; } }],
      lectura: v => [junto(`Pie a ${mV(pieB(v.fi)).replace('≈ ', '')}: `), dI('CM'), junto(' = 2 m, la mitad de AB')],
      minimo: 3,
    },
    predice: {
      pregunta: 'Ahora la pared está inclinada hacia afuera y forma con el piso un ángulo de 110°. La escalera de 4 m sigue apoyada en los dos. ¿Cuánto mide CM, de la esquina a la mitad de la escalera?',
      datos: ['AB = 4 m.', 'M es el punto medio de AB.'],
      voz: 'Ya viste la esquina recta. ¿Y si no es recta?',
      opciones: [
        { id: 'c', texto: 'Menos de 2 m', correcta: true },
        { id: 'igual', texto: '2 m, como siempre', error: 'GE-CON12', siFuera: 'Mediría 2 m si la esquina fuera recta; con 110°, la mitad queda más cerca de C.' },
        { id: 'mas', texto: 'Más de 2 m', error: 'GE-CON22', siFuera: 'Pasaría de 2 m con una esquina más cerrada que el recto; esta es más abierta.' },
        { id: 'falta', texto: 'No se puede saber sin el ángulo exacto', error: 'GE-CON23', siFuera: 'Para el número exacto faltaría más; para comparar con 2 m basta saber que la esquina pasa de 90°.' },
      ],
      dibujo: fig(figEscalera(P110.A, P110.B, { pared: 110, cm: '?', manija: false, vista: { x: [-1.8, 3.6], y: [-0.9, 3.4] }, alt: 'La pared inclinada hacia afuera forma 110° con el piso en la esquina C. La escalera AB, de 4 m, se apoya en los dos; M es su mitad y CM lleva «?».' })),
      revelar: fig(figEscalera(P110.A, P110.B, { pared: 110, cm: `≈ ${f(CM110)} m`, manija: false, vista: { x: [-1.8, 3.6], y: [-0.9, 3.4] }, alt: `Con la pared a 110°, la escalera de 4 m deja la mitad M a unos ${f(CM110)} m de la esquina: menos de 2 m.` })),
      // (Auditoría del 19 nov, M15: el número es el del dibujo, con el pie a 2 m; con 110°, CM queda bajo 2 m en toda posición.)
      coincide: `Coincide: en el dibujo, con el pie a 2 m, CM mide unos ${f(CM110)} m, menos que la mitad de la escalera.`,
      noCoincide: `Revisemos: en el dibujo, con el pie a 2 m, CM mide unos ${f(CM110)} m. Solo con la esquina recta mide 2 m.`,
    },
    mira: {
      pieza: GO,
      datos: figJ5(50, { manija: false, cm: '2 m', cmDesde: 5, cb: '', mira: { N: 1, recto: 2 }, alt: 'La escalera AB de 4 m con la esquina recta en C. Por M, la paralela al piso llega a N, la mitad de la pared CA, y es perpendicular a ella: es su mediatriz. Así MC = MA = 2 m.' }),
      voz: 'Sin medir: base media y mediatriz, dos ideas que ya tienes.',
      pasos: [
        { estado: { corte: 0 }, texto: 'AB mide 4 m y M es su mitad; la esquina C es recta.' },
        { estado: { corte: 1 }, texto: 'Por M trazo la paralela al piso: llega a N, la mitad de CA.' },
        { estado: { corte: 2 }, texto: 'El piso es perpendicular a la pared; MN, su paralela, también.' },
        { estado: { corte: 3 }, texto: 'MN pasa por la mitad de CA y es perpendicular: es su mediatriz.' },
        { estado: { corte: 4 }, texto: 'M está en la mediatriz de CA: MC = MA.', ecuacion: junto('MC = MA = 4 ÷ 2 = 2 m') },
        { estado: { corte: 5 }, texto: 'Y MA = MB: la mediana CM mide la mitad de la escalera.', ecuacion: junto([dI('CM'), ' = AB ÷ 2 = 2 m']) },
      ],
    },
    regla: {
      texto: 'En un triángulo rectángulo, la mediana relativa a la hipotenusa mide la mitad de ella: MA = MB = MC. Por eso lo parte en dos triángulos isósceles.',
      ecuacion: [{ llave: [dI('CM')], nota: 'mediana', color: 'c-i' }, ' = ', { frac: ['AB', '2'] }, Y, junto('MA = MB = MC')],
      condicion: 'el ángulo en C es recto. Si es más abierto, CM mide menos que AB ÷ 2; si es más cerrado, más.',
      voz: 'Antes de usarla, busca el ángulo recto.',
      dibujo: { pieza: GO, datos: figJ5(50, { manija: false, cb: '', alt: 'La escalera AB de 4 m en la esquina recta C: la mediana CM mide 2 m, igual que MA y MB.' }), estado: {} },
    },
    // Así se resuelve: el ángulo en M que deja un isósceles (m∠BMC = 2·m∠A, el exterior) o el perímetro de △BMC. «Ahora
    // tú» pide la mediana o la hipotenusa, los ángulos que copia la mediana, la mediana con x, el ángulo entre la mediana y
    // la altura y el mayor cateto entero.
    resuelve: {
      pieza: GO,
      generar(s) {
        const r = azar(s + 900);
        if (s % 2 === 0) {
          let a, F;
          // (M2: el dibujo, con otro ángulo en A y sin escala; M3: sin el caso del ejemplo «El ángulo en M», de 25°.)
          for (let i = 0; ; i++) { a = r.ent(18, 40); F = figRect(a + 12, { sinEscala: true, ang: [{ en: 'A', de: 'B', a: 'C', color: 'h', radio: 26 }, { en: 'M', de: 'B', a: 'C', texto: '?', radio: 18 }], alt: `Triángulo ABC recto en C con la mediana CM. El ángulo A, de ${a}°, lleva su arco, y el ángulo BMC lleva «?». El dibujo no está a escala.` }); if ((cabe(F) && a !== 25) || i > 200) break; }
          return {
            enunciado: `En △ABC, recto en C, M es el punto medio de la hipotenusa AB y m∠A = ${a}°. ¿Cuánto mide el ángulo BMC?${NO_ESC}`,
            datos: [D_MH, D_ISO, D_EXT],
            dibujo: fig(F),
            pasos: [
              { tipo: 'pide', texto: 'Piden m∠BMC, el ángulo que forma la mediana con la hipotenusa, del lado de B.' },
              { tipo: 'datos', texto: `El triángulo es recto en C, M es el punto medio de AB y m∠A = ${a}°.` },
              { tipo: 'regla', texto: 'La mediana a la hipotenusa mide la mitad de ella: MC = MA, y △AMC es isósceles. Y un ángulo exterior suma los dos interiores lejanos.' },
              { tipo: 'cuentas', texto: `En △AMC, m∠ACM = m∠A = ${a}°. BMC es su exterior en M.`, ecuacion: junto(['m∠BMC = ', `${a}° + ${a}° = `, dF(`${2 * a}°`)]) },
              { tipo: 'sentido', texto: `Tiene sentido: con su vecino AMC, de ${180 - 2 * a}°, forma la recta AB.` },
            ],
            respuesta: ['m∠BMC = ', dF(`${2 * a}°`)],
          };
        }
        const [ab, cb] = r.de([[10, 6], [10, 8], [26, 10], [26, 24], [20, 12], [20, 16], [30, 18], [13, 5]]), a = U.grados(Math.asin(cb / ab));
        const F = figRect(a, { lados: [{ de: 'A', a: 'B', texto: cm(ab), ref: 'C', dist: 31 }, { de: 'C', a: 'B', texto: cm(cb), ref: 'A', dist: 5 }], alt: `Triángulo ABC recto en C con la hipotenusa AB de ${cm(ab)}, el cateto CB de ${cm(cb)} y la mediana CM.` });
        return {
          enunciado: `En △ABC, recto en C, AB = ${cm(ab)} y CB = ${cm(cb)}. M es el punto medio de AB. ¿Cuánto mide el perímetro de △BMC?`,
          datos: [D_MH, D_PER],
          dibujo: fig(F),
          pasos: [
            { tipo: 'pide', texto: 'Piden el perímetro de △BMC: la suma de MB, MC y CB.' },
            { tipo: 'datos', texto: `La hipotenusa mide ${cm(ab)}, el cateto CB, ${cm(cb)}, y M es la mitad de AB.` },
            { tipo: 'regla', texto: 'La mediana relativa a la hipotenusa mide la mitad de ella: MC = MB = AB ÷ 2.' },
            { tipo: 'cuentas', texto: `MB = MC = ${cm(ab / 2)}. Sumo los tres lados.`, ecuacion: junto(['MB + MC + CB = ', `${f(ab / 2)} + ${f(ab / 2)} + ${cb} = `, dF(cm(ab + cb))]) },
            { tipo: 'sentido', texto: 'Tiene sentido: MB + MC es la hipotenusa entera, porque cada uno es su mitad.' },
          ],
          respuesta: ['Perímetro = ', dF(cm(ab + cb))],
        };
      },
    },
    ahoraTu: {
      pieza: GO,
      voz: 'Busca el ángulo recto y el punto medio de la hipotenusa.',
      generar(s) { return conCuatro([casoMediana, casoIsoAng, casoMedX, casoMedAltura, casoEntero][s % 5], azar(s + 7), firmasDe(EJ5)); },
    },
  };

  // ---------- Idea 6 (fase 3, 19 nov): triángulos rectángulos notables ----------
  // Objeto de la primera pantalla: las escuadras del juego de geometría (geo-objeto, armazon de tipo 'escuadras'; dibujo de
  // prueba), que crecen sin cambiar de forma. C es la esquina recta; el cateto menor va en naranja, el mayor en turquesa
  // y la hipotenusa en tinta. Cambia: la escuadra y su tamaño k. · Permanece: sus ángulos. · Progresa: los tres bordes,
  // múltiplos de k. · Se reserva: la escuadra de 45° (la predicción) y por qué sus lados son esos (medio cuadrado; medio
  // equilátero en la regla). · Debe verse: en la de 30° y 60°, el borde corto mide la mitad del largo.
  // Pitágoras va como dato (lo enseña Relaciones métricas); 37° y 53° son aproximados (36,87° y 53,13°: convención del
  // examen). Colores (propuesta §6): cateto menor naranja, cateto mayor turquesa, hipotenusa en tinta, ángulos en carmín.
  const S3 = Math.sqrt(3), S2 = Math.SQRT2;
  // Un lado como «a√r» (r = 1, 2 o 3) y su valor.
  const rad = (a, r) => (r === 1 ? f(a, 2) : `${a === 1 ? '' : f(a, 2)}√${r}`);
  const cmR = (a, r) => `${rad(a, r)} cm`;
  const NOT = {
    '30-60': { ang: [30, 60], lados: k => [[k, 1], [k, 3], [2 * k, 1]], nombre: '30° y 60°' },
    '45-45': { ang: [45, 45], lados: k => [[k, 1], [k, 1], [k, 2]], nombre: '45° y 45°' },
    '37-53': { ang: [37, 53], lados: k => [[3 * k, 1], [4 * k, 1], [5 * k, 1]], nombre: '37° y 53°' },
  };
  const val = ([a, r]) => a * Math.sqrt(r);
  // La escuadra (o el triángulo de examen): C, la esquina recta, en el origen; A arriba, en el cateto menor (CA, naranja);
  // B a la derecha, en el cateto mayor (CB, turquesa). o.textos: [CA, CB, AB] (sin texto: '' ); o.angulos: rótulos de
  // los ángulos agudos en B y en A (frente al menor y frente al mayor); o.examen: sin la escuadra de plástico.
  function figNot(tipo, k, o = {}) {
    const N = NOT[tipo], [m0, M0] = N.lados(k).map(val), [m, M] = o.alReves ? [M0, m0] : [m0, M0], A = [0, m], B = [M, 0], C = [0, 0];
    const pt = (id, p, lado) => ({ id, x: p[0], y: p[1], rotulo: id, lado, sinPunto: true });
    const w = Math.max(M, m), mg = 0.17 * w;
    const fg = { alt: o.alt, alto: o.alto || 230, vista: o.vista || { x: [-mg * 1.1, M + mg], y: [-mg * 1.1, m + mg * 0.8] },
      puntos: o.letras === false ? [{ id: 'A', x: A[0], y: A[1], sinPunto: true }, { id: 'B', x: B[0], y: B[1], sinPunto: true }, { id: 'C', x: 0, y: 0, sinPunto: true }] : [pt('A', A, 135), pt('B', B, -45), pt('C', C, 225)],
      segmentos: [{ de: 'C', a: 'A', color: o.alReves ? 'i' : 'o', grosor: 'variable' }, { de: 'C', a: 'B', color: o.alReves ? 'o' : 'i', grosor: 'variable' }, { de: 'A', a: 'B' }].concat(o.segs || []),
      angulos: [{ en: 'C', de: 'B', a: 'A', color: 'h', radio: 12, mide: 90 }].concat(o.sinAng ? [] : [
        Object.assign({ en: 'B', de: 'A', a: 'C', color: 'h', radio: o.radioB || 26, holgura: 6, marcas: o.alReves ? 2 : 1, mide: U.angulo(B, A, C) }, o.angB !== undefined ? { texto: o.angB } : { texto: `${N.ang[o.alReves ? 1 : 0]}°` }),
        Object.assign({ en: 'A', de: 'C', a: 'B', color: 'h', radio: 22, holgura: 6, marcas: tipo === '45-45' || o.alReves ? 1 : 2, mide: U.angulo(A, C, B) }, o.angA !== undefined ? { texto: o.angA } : { texto: `${N.ang[o.alReves ? 0 : 1]}°` })]).concat(o.angs || []) };
    if (o.mas) for (const q of o.mas) fg.puntos.push(q);
    if (o.letras !== false) PO.acomodarLetras(fg, ['A', 'B', 'C'].concat((o.mas || []).filter(q => q.rotulo).map(q => q.id)));
    const t = o.textos || [];
    const lados = [{ de: 'C', a: 'A', texto: t[0], color: o.alReves ? 'i' : 'o', ref: 'B', dist: 6 }, { de: 'C', a: 'B', texto: t[1], color: o.alReves ? 'o' : 'i', ref: 'A', dist: 6 }, Object.assign({ de: 'A', a: 'B', texto: t[2], ref: 'C', dist: 6 }, o.abDentro ? { hasta: 0 } : {})].filter(x => x.texto);
    const F = Object.assign({ objeto: o.examen ? 'angulos' : 'armazon', figura: fg }, lados.length ? { ladosRot: lados } : {}, o.examen ? {} : { tipo: 'escuadras', escuadras: [{ puntos: ['A', 'B', 'C'] }] }, o.extra || {});
    return F;
  }
  // El juego: la escuadra de tipo y tamaño k (en cm), con sus tres bordes.
  const bordes = (tipo, k) => NOT[tipo].lados(k).map(([a, r]) => (r === 1 ? `${f(a, 2)} cm` : `${rad(a, r)} cm`));
  const figJ6 = v => figNot(v.tipo, v.k, { textos: bordes(v.tipo, v.k), alto: 240,
    alt: `La escuadra de ${NOT[v.tipo].nombre} con k = ${v.k}: bordes de ${bordes(v.tipo, v.k).join(', ')}. La esquina recta está en C.` });
  const D_PIT = 'En un triángulo rectángulo, el cuadrado de la hipotenusa es la suma de los cuadrados de los catetos: 3² + 4² = 5².';
  const D_N30 = 'Notable de 30° y 60°: catetos k (frente a 30°) y k√3; hipotenusa 2k.';
  const D_N45 = 'Notable de 45° y 45°: catetos k y k; hipotenusa k√2.';
  const D_N37 = 'Notable de 37° y 53° (convención del examen): catetos 3k (frente a 37°) y 4k; hipotenusa 5k.';
  const D_RAIZ = '√2 ≈ 1,41 y √3 ≈ 1,73; además, 10 ÷ √2 = 5√2.';
  const DN = { '30-60': D_N30, '45-45': D_N45, '37-53': D_N37 };
  // Una opción de texto con su error.
  const opT = (id, texto, error, siFuera) => ({ id, texto, error, siFuera });
  // Tipo 0: completar un lado del de 45° o del de 30° y 60°.
  function casoCompletar(r) {
    for (let i = 0; i < 400; i++) {
      const tipo = r.de(['30-60', '45-45']), k = r.ent(2, 12), L = NOT[tipo].lados(k), nom = ['el cateto menor CA', 'el cateto mayor CB', 'la hipotenusa AB'];
      const dado = r.ent(0, 2), pide = r.de([0, 1, 2].filter(x => x !== dado && !(tipo === '45-45' && x + dado === 1)));
      if (tipo === '45-45') { nom[0] = 'el cateto CA'; nom[1] = 'el cateto CB'; }
      const txt = l => cmR(l[0], l[1]), ok = txt(L[pide]);
      let ops;
      if (tipo === '45-45') {
        if (pide === 2) ops = [opT('c', ok), opT('copia', txt(L[0]), 'GE-CON59', 'Ver los catetos iguales está bien; la hipotenusa es más larga: k√2.'), opT('raiz3', cmR(k, 3), 'GE-CON24', 'k√3 es el cateto mayor del de 30° y 60°; aquí la hipotenusa es k√2.'), opT('doble', cmR(2 * k, 1), 'GE-CON14', '2k es la hipotenusa del de 30° y 60°; en el de 45°, k√2.')];
        else ops = [opT('c', ok), opT('mitad', cmR(k / 2, 2), 'GE-CON14', 'La mitad vale frente a 30°; en el de 45°, el cateto es la hipotenusa ÷ √2.'), opT('por', cmR(2 * k, 1), 'GE-CON15', 'Multiplicar por √2 da la hipotenusa desde un cateto; aquí se va al revés: se divide.'), opT('raiz3', cmR(k, 3), 'GE-CON24', 'k√3 es del notable de 30° y 60°; el de 45° tiene catetos iguales.')];
      } else {
        const tabla = {
          '0-2': [opT('raiz', cmR(k, 3), 'GE-CON24', 'k√3 es el otro cateto; la hipotenusa, frente al recto, es 2k.'), opT('r2', cmR(k, 2), 'GE-CON60', 'k√2 es la hipotenusa del de 45°; en el de 30° y 60°, 2k.'), opT('mitad', cmR(k / 2, 1), 'GE-CON15', 'Dividir da un lado más corto; la hipotenusa es el lado mayor.')],
          '2-0': [opT('raiz', cmR(k, 3), 'GE-CON24', 'k√3 es el cateto frente a 60°; el de frente a 30° mide la mitad de la hipotenusa.'), opT('r2', cmR(k, 2), 'GE-CON60', 'k√2 saldría en el de 45°; aquí el corto es la mitad.'), opT('doble', cmR(4 * k, 1), 'GE-CON15', 'Duplicar da un lado más largo que la hipotenusa, y ningún cateto lo es.')],
          '0-1': [opT('doble', cmR(2 * k, 1), 'GE-CON14', '2k es la hipotenusa; el cateto frente a 60° es k√3.'), opT('r2', cmR(k, 2), 'GE-CON60', 'k√2 es del de 45°; aquí el cateto mayor es k√3.'), opT('mitad', cmR(k / 2, 3), 'GE-CON61', 'Dividir entre 2 da menos que el cateto menor; el mayor es k√3.')],
          '1-0': [opT('mitad', cmR(k / 2, 3), 'GE-CON61', 'Partir en dos sirve con la hipotenusa; desde k√3 el cateto menor es k.'), opT('por3', cmR(3 * k, 1), 'GE-CON15', 'Multiplicar por √3 otra vez da 3k; se divide entre √3.'), opT('doble', cmR(2 * k, 1), 'GE-CON14', '2k es la hipotenusa, no el cateto menor.')],
          '1-2': [opT('dos3', cmR(2 * k, 3), 'GE-CON62', 'Duplicar está bien para la hipotenusa, pero desde el cateto menor k, no desde k√3.'), opT('k', cmR(k, 1), 'GE-CON61', 'k es el cateto menor; la hipotenusa es 2k.'), opT('r2', cmR(k, 2), 'GE-CON60', 'k√2 es del de 45°.')],
          '2-1': [opT('mitad', cmR(k, 1), 'GE-CON14', 'La mitad de la hipotenusa es el cateto frente a 30°, el menor; el mayor es k√3.'), opT('r2', cmR(k, 2), 'GE-CON60', 'k√2 es del de 45°; aquí el mayor es k√3.'), opT('dos3', cmR(2 * k, 3), 'GE-CON62', 'Eso es la hipotenusa por √3; el cateto mayor es su mitad por √3.')],
        }[`${dado}-${pide}`];
        ops = [opT('c', ok)].concat(tabla);
      }
      if (new Set(ops.map(o => o.texto)).size < 4) continue;
      ops = ops.map((o, j) => (j === 0 ? { id: 'c', texto: o.texto, correcta: true } : o));
      const textos = ['', '', '']; textos[dado] = txt(L[dado]); textos[pide] = '?';
      const F = figNot(tipo, k, { examen: true, textos, alt: `Triángulo rectángulo de ${NOT[tipo].nombre}, recto en C. ${nom[dado][0].toUpperCase() + nom[dado].slice(1)} mide ${txt(L[dado])}; ${nom[pide]} lleva «?».` });
      if (!cabe(F)) continue;
      return { pregunta: `En un triángulo rectángulo de ${NOT[tipo].nombre}, recto en C, ${nom[dado]} mide ${txt(L[dado])}. ¿Cuánto mide ${nom[pide]}?`,
        datos: [D_N30, D_N45], dibujo: fig(F), opciones: ops,
        solucion: { texto: `Es el notable de ${NOT[tipo].nombre}: ${tipo === '45-45' ? 'k, k y k√2' : 'k, k√3 y 2k'}, con k = ${f(k, 2)}.`, ecuacion: junto(`${nom[pide].split(' ').pop()} = ${ok}`) } };
    }
    throw new Error('casoCompletar sin caso');
  }
  // Tipo 1: el de 37° y 53°, con números enteros (un cable, una rampa, una escalera).
  function casoN37(r) {
    for (let i = 0; i < 400; i++) {
      const k0 = r.ent(2, 8), cosa = r.de(['cable', 'rampa', 'escalera']), pide = r.de(['alto', 'piso']);
      // Medidas creíbles (auditoría del 19 nov, M4): escalera de 5 m o 10 m, rampa de hasta 20 m, cable de hasta 40 m.
      const k = cosa === 'escalera' ? 1 + (k0 % 2) : cosa === 'rampa' ? 1 + (k0 % 4) : k0, [m, M, h] = [3 * k, 4 * k, 5 * k];
      // El ángulo con el piso: 37° (alto = 3k) o 53° (alto = 4k).
      const ang = r.de([37, 53]), alto = ang === 37 ? m : M, piso = ang === 37 ? M : m, v = pide === 'alto' ? alto : piso;
      const otro = pide === 'alto' ? piso : alto;
      const ops = opciones(v, [
        { id: 'otro', valor: otro, error: 'GE-CON63', siFuera: `${otro} m es el otro cateto: frente a 37° va 3k y frente a 53°, 4k.` },
        { id: 'hip', valor: h, error: 'GE-CON64', siFuera: `${h} m es el largo ${cosa === 'cable' ? 'del cable' : cosa === 'rampa' ? 'de la rampa' : 'de la escalera'}, la hipotenusa.` },
        { id: 'mitad', valor: h / 2, error: 'GE-CON14', siFuera: 'La mitad de la hipotenusa vale frente a 30°, no frente a 37° ni 53°.' },
        { id: 'resta', valor: h - otro, error: 'GE-CON65', siFuera: 'Los lados no se restan: guardan la razón 3 : 4 : 5.' },
      ], n => `${f(n)} m`);
      if (ops.length < 4) continue;
      const sujeto = { cable: 'Un cable tenso va de la punta de un poste al piso', rampa: 'Una rampa recta sube desde el piso', escalera: 'Una escalera está apoyada en una pared' }[cosa];
      const preg = { cable: ['¿Cuánto mide el poste?', '¿A qué distancia del poste llega al piso?'], rampa: ['¿A qué altura llega?', '¿Cuánto avanza por el piso?'], escalera: ['¿A qué altura de la pared llega?', '¿A qué distancia de la pared queda su pie?'] }[cosa][pide === 'alto' ? 0 : 1];
      return { pregunta: `${sujeto}, mide ${h} m y forma ${ang}° con el piso. ${preg}`,
        datos: [D_N37, 'El ángulo de 90° está entre el piso y la vertical.'], opciones: ops,
        solucion: { texto: `Es el notable de 37° y 53° con 5k = ${h} m: k = ${k}. Frente a ${pide === 'alto' ? ang : 90 - ang}° va ${v === m ? '3k' : '4k'}.`, ecuacion: junto(`${v === m ? '3' : '4'} · ${k} = ${v} m`) } };
    }
    throw new Error('casoN37 sin caso');
  }
  // Tipo 2: ¿qué notable es? (o ninguno) por sus tres lados.
  function casoCual(r) {
    const k = r.ent(2, 7), cual = r.de(['37-53', '30-60', '45-45', 'no']);
    const lados = { '37-53': [`${3 * k} cm`, `${4 * k} cm`, `${5 * k} cm`], '30-60': [`${k} cm`, cmR(k, 3), `${2 * k} cm`], '45-45': [`${k} cm`, `${k} cm`, cmR(k, 2)], no: [`${5 * k} cm`, `${12 * k} cm`, `${13 * k} cm`] }[cual];
    const T = { '37-53': '37° y 53°', '30-60': '30° y 60°', '45-45': '45° y 45°', no: 'Ninguno: no es notable' };
    const SF = {
      '37-53': ['GE-CON66', 'Ese tiene lados proporcionales a 3, 4 y 5.'], '30-60': ['GE-CON67', 'Ese tiene hipotenusa doble del cateto menor y un cateto con √3.'],
      '45-45': ['GE-CON68', 'Ese tiene catetos iguales e hipotenusa con √2.'], no: ['GE-CON69', 'Estos lados sí siguen una de las tres razones.'] };
    const opts = [{ id: 'c', texto: T[cual], correcta: true }].concat(Object.keys(T).filter(x => x !== cual).map(x => ({ id: x.replace('-', ''), texto: T[x], error: SF[x][0], siFuera: cual === 'no' && x !== 'no' ? `${SF[x][1]} Estos no.` : SF[x][1] })));
    return { pregunta: `Un triángulo rectángulo tiene lados de ${lados.join(', ')}. ¿Qué ángulos agudos tiene?`,
      datos: [D_N30, D_N45, D_N37], opciones: opts,
      solucion: { texto: cual === 'no' ? `Entre ${k} quedan 5, 12 y 13: no siguen ninguna de las tres razones.` : `Los lados siguen la razón del de ${T[cual]}, con k = ${k}.`, ecuacion: junto(cual === 'no' ? '5 : 12 : 13' : { '37-53': '3k : 4k : 5k', '30-60': 'k : k√3 : 2k', '45-45': 'k : k : k√2' }[cual]) } };
  }
  // Tipo 3 (examen): el isósceles de 120°: la altura lo parte en dos notables de 30° y 60°; BC = L√3.
  function figIso120(L, o = {}) {
    const A = [0, L / 2], B = [-L * S3 / 2, 0], C = [L * S3 / 2, 0], H = [0, 0];
    const pt = (id, p, lado) => ({ id, x: p[0], y: p[1], rotulo: id, lado, sinPunto: true });
    const fg = { alt: o.alt, alto: o.alto || 200, vista: { x: [-L * 1.02, L * 1.02], y: [-L * 0.32, L * 0.72] },
      puntos: [pt('A', A, 90), pt('B', B, 200), pt('C', C, -20)].concat(o.altura ? [pt('H', H, -90)] : []),
      segmentos: [{ de: 'A', a: 'B' }, { de: 'A', a: 'C' }, { de: 'B', a: 'C' }].concat(o.altura ? [{ de: 'A', a: 'H', discontinua: true, grosor: 'fino' }] : []),
      angulos: [{ en: 'A', de: 'B', a: 'C', color: 'h', texto: '120°', radio: 18, holgura: 6, mide: 120 }].concat(o.altura ? [{ en: 'H', de: 'C', a: 'A', radio: 8 }] : []) };
    return Object.assign({ objeto: 'angulos', figura: fg, llaves: [{ de: 'A', a: 'B', marcas: 1, ref: 'C' }, { de: 'A', a: 'C', marcas: 1, ref: 'B' }], ladosRot: [{ de: 'B', a: 'C', texto: '?', ref: 'A', dist: 7 }].concat(o.lados || []) });
  }
  function casoIso120(r) {
    for (let i = 0; i < 400; i++) {
      const L = 2 * r.ent(2, 9), F = figIso120(L, { lados: [{ de: 'A', a: 'B', texto: `${L} cm`, ref: 'C', dist: 19 }], alt: `Triángulo isósceles ABC con AB = AC = ${L} cm y el ángulo A de 120°. BC lleva «?».` });
      if (!cabe(F)) continue;
      const ops = [{ id: 'c', texto: cmR(L, 3), correcta: true },
        opT('mitad', cmR(L / 2, 3), 'GE-CON70', `Eso es BH, la mitad; BC es el doble: ${cmR(L, 3)}.`),
        opT('doble', cmR(2 * L, 1), 'GE-CON71', 'Sumar AB y AC da más que BC: la desigualdad triangular lo impide.'),
        opT('r2', cmR(L, 2), 'GE-CON60', 'k√2 es del de 45°; la altura deja dos de 30° y 60°.')];
      return { pregunta: `En el triángulo ABC, AB = AC = ${L} cm y m∠A = 120°. ¿Cuánto mide BC?`,
        datos: [D_ISO, D_SUMA, D_N30, 'En un isósceles, la altura desde el vértice de los lados iguales cae en el punto medio de la base.'], dibujo: fig(F), opciones: ops,
        solucion: { texto: `La altura AH deja dos de 30° y 60°, con hipotenusa ${L} cm: BH = ${cmR(L / 2, 3)}.`, ecuacion: junto(`BC = 2 · BH = ${cmR(L, 3)}`) } };
    }
    throw new Error('casoIso120 sin caso');
  }
  // Tipo 4 (examen, como San Marcos 2024-II): la altura BH parte △ABC (m∠A = 45° y m∠C = 37° o 53°) en dos notables.
  function figAltura(aA, aC, h, o = {}) {
    const H = [0, 0], B = [0, h], A = [-h / Math.tan(aA * RAD), 0], C = [h / Math.tan(aC * RAD), 0];
    const pt = (id, p, lado) => ({ id, x: p[0], y: p[1], rotulo: id, lado, sinPunto: true });
    const w = C[0] - A[0];
    const fg = { alt: o.alt, alto: o.alto || 210, vista: { x: [A[0] - 0.1 * w, C[0] + 0.1 * w], y: [-0.2 * w, h + 0.1 * w] },
      puntos: [pt('A', A, 200), pt('B', B, 90), pt('C', C, -20), pt('H', H, -90)],
      segmentos: [{ de: 'A', a: 'B' }, { de: 'B', a: 'C' }, { de: 'A', a: 'C' }, { de: 'B', a: 'H', color: 'o', grosor: 'variable' }],
      // (Los ángulos de A y de C van con su arco y su valor en el enunciado: sus rótulos no cabían cerca de su vértice.)
      angulos: [{ en: 'A', de: 'H', a: 'B', color: 'h', radio: 22, holgura: 6, mide: aA }, { en: 'C', de: 'B', a: 'H', color: 'h', radio: 22, holgura: 6, marcas: 2, mide: U.angulo(C, B, H) }, { en: 'H', de: 'C', a: 'B', radio: 9 }] };
    // La medida de BH va en el enunciado: en el dibujo, junto a la altura, empujaba los rótulos de A y de C.
    return Object.assign({ objeto: 'angulos', figura: fg, ladosRot: [{ de: 'A', a: 'C', texto: '?', ref: 'B', dist: 18, en: 0.3 }] });
  }
  function casoAltura(r) {
    for (let i = 0; i < 400; i++) {
      const aC = r.de([37, 53]), k = r.ent(2, 6), h = aC === 37 ? 3 * k : 4 * k, hc = aC === 37 ? 4 * k : 3 * k, v = h + hc;
      const F = figAltura(45, aC, h, { alt: `Triángulo ABC con m∠A = 45° y m∠C = ${aC}°. La altura BH (naranja) mide ${h} cm; AC lleva «?».` });
      if (!cabe(F)) continue;
      const ops = opciones(v, [
        { id: 'solo', valor: hc, error: 'GE-CON72', siFuera: `${hc} cm es solo HC; falta AH, que en el de 45° mide lo que BH.` },
        { id: 'otro', valor: h + 5 * k, error: 'GE-CON64', siFuera: `Ese valor usa la hipotenusa BC, ${5 * k} cm, en vez de HC.` },
        { id: 'cambia', valor: h + (aC === 37 ? 3 * h / 4 : 4 * h / 3), error: 'GE-CON63', siFuera: 'Frente a 37° va 3k y frente a 53°, 4k: revisa cuál cateto es BH.' },
        { id: 'doble', valor: 2 * h, error: 'GE-CON73', siFuera: 'AH = BH está bien; pero el otro triángulo es de 37° y 53°: HC no mide lo que BH.' },
      ].filter(d => Number.isInteger(d.valor)), n => `${f(n)} cm`);
      if (ops.length < 4) continue;
      return { pregunta: `En el triángulo ABC, m∠A = 45° y m∠C = ${aC}°. La altura BH mide ${h} cm. ¿Cuánto mide AC?`,
        datos: [D_N45, D_N37], dibujo: fig(F), opciones: ops,
        solucion: { texto: `△AHB es de 45°: AH = BH = ${h} cm. En △CHB, de 37° y 53°, HC = ${hc} cm.`, ecuacion: junto(`AC = ${h} + ${hc} = ${v} cm`) } };
    }
    throw new Error('casoAltura sin caso');
  }

  // Ejemplos resueltos de «Triángulos rectángulos notables» (molde §3). Cuentas rehechas aparte (scratchpad e5-geometria/
  // cuentas6.py): 6√2; 14 ÷ 2 = 7; 9 = 3k, k = 3, 5k = 15; 9 ÷ 2 = 4,5; 12 : 16 : 20 = 3 : 4 : 5; 5√3 = k√3, 2k = 10;
  // 8 ÷ √2 = 4√2; 10 = 5k, 4k = 8; 6, 8 → 10; 10 ÷ 2 · √3 = 5√3; 15 = 5k, 3k = 9; 12 + 16 = 28; 2 · 4√3 = 8√3; BD = 12,
  // AB = 16, AD = 4; CB = 8 = CM = MB, 24.
  const EJ6 = [];
  EJ6.push({ nivel: 1, titulo: 'La escuadra de 45°',
    figura: fig(figNot('45-45', 6, { textos: ['6 cm', '6 cm', '?'], alt: 'Una escuadra de 45° con sus dos bordes cortos, CA y CB, de 6 cm; el borde largo AB lleva «?».' })),
    enunciado: 'Una escuadra de 45° tiene sus dos bordes cortos de 6 cm. ¿Cuánto mide su borde largo?',
    datos: [D_N45],
    solucion: [{ texto: 'Es el notable de 45° y 45° con k = 6: la hipotenusa es k√2.', ecuacion: junto(['AB = ', dF('6√2 cm')]) }],
    respuesta: ['AB = ', dF('6√2 cm'), ', unos 8,5 cm'] });
  EJ6.push({ nivel: 1, titulo: 'La escuadra de 30° y 60°',
    figura: fig(figNot('30-60', 7, { textos: ['?', '', '14 cm'], alt: 'Una escuadra de 30° y 60° con el borde largo AB de 14 cm; el borde corto CA, frente a 30°, lleva «?».' })),
    enunciado: 'El borde largo de una escuadra de 30° y 60° mide 14 cm. ¿Cuánto mide el borde corto, frente al ángulo de 30°?',
    datos: [D_N30],
    solucion: [{ texto: 'La hipotenusa es 2k: k = 7. El cateto frente a 30° mide k, la mitad de la hipotenusa.', ecuacion: junto(['CA = 14 ÷ 2 = ', dF('7 cm')]) }],
    respuesta: ['CA = ', dF('7 cm')] });
  EJ6.push({ nivel: 1, titulo: 'El de 37° y 53°',
    figura: fig(figNot('37-53', 3, { examen: true, textos: ['9 cm', '', '?'], alt: 'Triángulo rectángulo de 37° y 53°, recto en C. El cateto CA, frente a 37°, mide 9 cm; la hipotenusa AB lleva «?».' })),
    enunciado: 'En un triángulo rectángulo de 37° y 53°, el cateto frente a 37° mide 9 cm. ¿Cuánto mide la hipotenusa?',
    datos: [D_N37],
    solucion: [{ texto: 'El cateto frente a 37° es 3k: k = 3. La hipotenusa es 5k.', ecuacion: junto(['AB = 5 · 3 = ', dF('15 cm')]) }],
    respuesta: ['AB = ', dF('15 cm')] });
  EJ6.push({ nivel: 1, titulo: 'Frente al ángulo de 30°',
    figura: fig(figNot('30-60', 4.5, { examen: true, textos: ['?', '', '9 cm'], alt: 'Triángulo rectángulo de 30° y 60°, recto en C, con la hipotenusa AB de 9 cm; el cateto CA, frente a 30°, lleva «?».' })),
    enunciado: 'En un triángulo rectángulo de 30° y 60°, la hipotenusa mide 9 cm. ¿Cuánto mide el cateto frente a 30°?',
    datos: [D_N30],
    solucion: [{ texto: 'Frente a 30° va k, y la hipotenusa es 2k: el cateto es su mitad.', ecuacion: junto(['9 ÷ 2 = ', dF('4,5 cm')]) }],
    respuesta: ['CA = ', dF('4,5 cm')] });
  EJ6.push({ nivel: 1, titulo: '¿Qué notable es?',
    enunciado: 'Un triángulo rectángulo tiene lados de 12 cm, 16 cm y 20 cm. ¿Qué ángulos agudos tiene?',
    datos: [D_N30, D_N45, D_N37],
    solucion: [{ texto: 'Divido los tres lados entre 4: quedan 3, 4 y 5. Es la razón 3k, 4k y 5k, con k = 4.', ecuacion: junto('12 : 16 : 20 = 3 : 4 : 5') }],
    respuesta: [dF('37° y 53°'), ' (aproximados)'] });

  EJ6.push({ nivel: 2, titulo: 'Desde el cateto mayor',
    figura: fig(figNot('30-60', 5, { examen: true, textos: ['', '5√3 cm', '?'], alt: 'Triángulo rectángulo de 30° y 60°, recto en C. El cateto mayor CB mide 5√3 cm; la hipotenusa AB lleva «?».' })),
    enunciado: 'En un triángulo rectángulo de 30° y 60°, el cateto mayor mide 5√3 cm. ¿Cuánto mide la hipotenusa?',
    datos: [D_N30],
    solucion: [{ texto: 'El cateto mayor es k√3: comparando, k = 5.', ecuacion: junto('k√3 = 5√3   →   k = 5') },
      { texto: 'La hipotenusa es 2k.', ecuacion: junto(['AB = 2 · 5 = ', dF('10 cm')]) }],
    respuesta: ['AB = ', dF('10 cm')] });
  EJ6.push({ nivel: 2, titulo: 'Desde la hipotenusa',
    figura: fig(figNot('45-45', 4 * S2, { examen: true, textos: ['?', '', '8 cm'], alt: 'Triángulo rectángulo de 45° y 45°, recto en C, con la hipotenusa AB de 8 cm; el cateto CA lleva «?».' })),
    enunciado: 'En un triángulo rectángulo de 45° y 45°, la hipotenusa mide 8 cm. ¿Cuánto mide cada cateto?',
    datos: [D_N45, 'Dividir entre √2 es multiplicar por √2 y dividir entre 2.'],
    solucion: [{ texto: 'La hipotenusa es k√2 = 8 cm: el cateto k es la hipotenusa entre √2.', ecuacion: junto('k = 8 ÷ √2 = 8√2 ÷ 2') },
      { texto: 'Simplifico.', ecuacion: junto(['k = ', dF('4√2 cm')]) }],
    respuesta: ['Cada cateto mide ', dF('4√2 cm'), ', unos 5,7 cm'] });
  EJ6.push({ nivel: 2, titulo: 'La escalera a 53°',
    figura: fig(figNot('37-53', 2, { examen: true, alReves: true, angA: '', angB: '', textos: ['?', '', '10 m'], alt: 'Una escalera AB de 10 m apoyada en la pared CA; forma 53° con el piso en B (dos arcos). La altura CA lleva «?».' })),
    enunciado: 'Una escalera de 10 m está apoyada en una pared y forma 53° con el piso. ¿A qué altura de la pared llega?',
    datos: [D_N37, 'El ángulo de 90° está entre el piso y la pared.'],
    solucion: [{ texto: 'Es el notable de 37° y 53° con hipotenusa 5k = 10 m: k = 2.' },
      { texto: 'La altura queda frente al ángulo de 53° con el piso: le toca 4k.', ecuacion: junto(['4 · 2 = ', dF('8 m')]) }],
    respuesta: ['Llega a ', dF('8 m')] });
  EJ6.push({ nivel: 2, titulo: 'La cinta del albañil',
    figura: fig(figNot('37-53', 2, { examen: true, sinAng: true, textos: ['6 m', '8 m', '?'], alt: 'La esquina C de una obra: un lado de 6 m y otro de 8 m forman el ángulo recto; la diagonal AB lleva «?».' })),
    enunciado: 'Para sacar una esquina recta, un albañil marca 6 m en una pared y 8 m en la otra. ¿Cuánto debe medir la diagonal entre las dos marcas?',
    datos: [D_N37, D_PIT],
    solucion: [{ texto: '6 y 8 son 3k y 4k con k = 2: la hipotenusa es 5k.', ecuacion: junto('5 · 2 = 10') },
      { texto: 'Compruebo con Pitágoras.', ecuacion: junto(['6² + 8² = 36 + 64 = 100 = 10²']) }],
    respuesta: ['La diagonal mide ', dF('10 m')] });
  EJ6.push({ nivel: 2, titulo: 'Medio equilátero',
    figura: fig((() => { const L = 10, A = [0, L * S3 / 2], B = [-L / 2, 0], C = [L / 2, 0], H = [0, 0];
      const pt = (id, p, lado) => ({ id, x: p[0], y: p[1], rotulo: id, lado, sinPunto: true });
      const fg = { alto: 220, vista: { x: [-6.6, 6.6], y: [-1.6, 9.8] }, alt: 'Triángulo equilátero ABC de lado 10 cm con la altura AH, que cae en el punto medio de BC.',
        puntos: [pt('A', A, 90), pt('B', B, 200), pt('C', C, -20), pt('H', H, -90)],
        segmentos: [{ de: 'A', a: 'B' }, { de: 'A', a: 'C' }, { de: 'B', a: 'C' }, { de: 'A', a: 'H', color: 'i', grosor: 'variable' }],
        angulos: [{ en: 'H', de: 'C', a: 'A', radio: 9 }, { en: 'B', de: 'C', a: 'A', color: 'h', radio: 22, holgura: 6, mide: 60 }] };
      return { objeto: 'angulos', figura: fg, ladosRot: [{ de: 'A', a: 'B', texto: '10 cm', ref: 'C', dist: 6 }, { de: 'A', a: 'H', texto: '?', color: 'i', ref: 'C', dist: 5 }] }; })()),
    enunciado: 'Un triángulo equilátero tiene lados de 10 cm. ¿Cuánto mide su altura?',
    datos: [D_N30, 'En un triángulo equilátero, la altura cae en el punto medio del lado.'],
    solucion: [{ texto: 'La altura AH lo parte en dos notables de 30° y 60°, con hipotenusa AB = 10 cm: k = 5 (BH).' },
      { texto: 'La altura es el cateto frente a 60°: k√3.', ecuacion: junto(['AH = ', dF('5√3 cm')]) }],
    respuesta: ['AH = ', dF('5√3 cm'), ', unos 8,7 cm'] });

  EJ6.push({ nivel: 3, titulo: 'El cable del poste',
    figura: fig(figNot('37-53', 3, { examen: true, textos: ['?', '', '15 m'], alt: 'Un poste CA vertical y un cable tenso AB de 15 m, que forma 37° con el piso en B. La altura CA lleva «?».' })),
    enunciado: 'Un cable tenso de 15 m va de la punta de un poste vertical al piso y forma 37° con el piso. ¿Cuánto mide el poste?',
    alternativas: ['7,5 m', '9 m', '12 m', '15 m', '20 m'],
    datos: [D_N37, 'El poste es vertical: forma 90° con el piso.'],
    solucion: [{ texto: 'Poste, piso y cable forman el notable de 37° y 53°. El cable es la hipotenusa: 5k = 15 m, k = 3.' },
      { texto: 'El poste queda frente al ángulo de 37°: le toca 3k.', ecuacion: junto(['CA = 3 · 3 = ', dF('9 m')]) },
      { texto: 'Las otras: 7,5 m usa la mitad, que va frente a 30°; 12 m es el piso; 15 m es el cable; 20 m hace 3k = 15.' }],
    respuesta: ['El poste mide ', dF('9 m')] });
  EJ6.push({ nivel: 3, titulo: 'La altura que parte en dos',
    figura: fig(figAltura(45, 37, 12, { alt: 'Triángulo ABC con m∠A = 45° y m∠C = 37°. La altura BH (naranja) mide 12 cm; AC lleva «?».' })),
    enunciado: 'En el triángulo ABC, m∠A = 45° y m∠C = 37°. La altura BH mide 12 cm. ¿Cuánto mide AC?',
    alternativas: ['16 cm', '21 cm', '24 cm', '28 cm', '32 cm'],
    datos: [D_N45, D_N37],
    solucion: [{ texto: '△AHB es de 45° y 45°: AH = BH = 12 cm.' },
      { texto: '△CHB es de 37° y 53°: BH, frente a 37°, es 3k = 12, k = 4. HC = 4k.', ecuacion: junto('HC = 4 · 4 = 16 cm') },
      { texto: 'AC junta las dos partes.', ecuacion: junto(['AC = 12 + 16 = ', dF('28 cm')]) },
      { texto: 'Las otras: 16 cm es solo HC; 21 cm cambia 3k por 4k; 24 cm toma HC = BH; 32 cm usa la hipotenusa BC, 20 cm.' }],
    respuesta: ['AC = ', dF('28 cm')] });
  EJ6.push({ nivel: 3, titulo: 'El isósceles de 120°',
    figura: fig(figIso120(8, { lados: [{ de: 'A', a: 'B', texto: '8 cm', ref: 'C', dist: 19 }], alt: 'Triángulo isósceles ABC con AB = AC = 8 cm y el ángulo A de 120°. BC lleva «?».' })),
    enunciado: 'En el triángulo ABC, AB = AC = 8 cm y m∠A = 120°. ¿Cuánto mide BC?',
    alternativas: ['4√3 cm', '8√2 cm', '16 cm', '8√3 cm', '12 cm'],
    datos: [D_ISO, D_SUMA, D_N30, 'En un isósceles, la altura desde el vértice de los lados iguales cae en el punto medio de la base.'],
    solucion: [{ texto: 'Los ángulos B y C miden (180° − 120°) ÷ 2 = 30°. La altura AH cae en el punto medio de BC.' },
      { texto: '△AHB es de 30° y 60°, con hipotenusa AB = 8 cm = 2k: k = 4 = AH, y BH = k√3 = 4√3 cm.' },
      { texto: 'BC es el doble de BH.', ecuacion: junto(['BC = 2 · 4√3 = ', dF('8√3 cm')]) },
      { texto: 'Las otras: 4√3 cm es solo BH; 8√2 cm usa el de 45°; 16 cm suma AB y AC; 12 cm suma AH y AB.' }],
    respuesta: ['BC = ', dF('8√3 cm')] });
  EJ6.push({ nivel: 3, titulo: 'Dos notables seguidos',
    figura: fig((() => { const B = [0, 0], C = [12, 0], A = [0, 16], D = [0, 12];
      const pt = (id, p, lado) => ({ id, x: p[0], y: p[1], rotulo: id, lado, sinPunto: true });
      const fg = { alto: 240, vista: { x: [-3.2, 14.6], y: [-2.6, 17.6] }, alt: 'Triángulo ABC recto en B, con BC = 12 m. D está en AB. El ángulo BCD mide 45° y el ángulo BCA, 53°. AD lleva «?».',
        puntos: [pt('A', A, 135), pt('B', B, 225), pt('C', C, -45), pt('D', D, 180)],
        segmentos: [{ de: 'A', a: 'B' }, { de: 'B', a: 'C', color: 'o', grosor: 'variable' }, { de: 'A', a: 'C' }, { de: 'D', a: 'C' }],
        angulos: [{ en: 'B', de: 'C', a: 'A', color: 'h', radio: 12, mide: 90 }, { en: 'C', de: 'D', a: 'B', color: 'h', radio: 44, holgura: 6, mide: 45 }, { en: 'C', de: 'A', a: 'B', color: 'h', radio: 28, holgura: 6, marcas: 2, mide: U.angulo(C, A, B) }] };
      return { objeto: 'angulos', figura: fg, ladosRot: [{ de: 'B', a: 'C', texto: '12 m', color: 'o', ref: 'A', dist: 6 }, { de: 'A', a: 'D', texto: '?', ref: 'C', dist: 6 }] }; })()),
    enunciado: 'En △ABC, recto en B, BC = 12 m. D está en AB, con m∠BCD = 45° y m∠BCA = 53°. ¿Cuánto mide AD?',
    alternativas: ['4 m', '8 m', '9 m', '12 m', '16 m'],
    datos: [D_N45, D_N37],
    solucion: [{ texto: '△DBC es de 45° y 45°: BD = BC = 12 m.' },
      { texto: '△ABC es de 37° y 53°, con BC frente a 37°: BC = 3k = 12, k = 4. AB = 4k.', ecuacion: junto('AB = 4 · 4 = 16 m') },
      { texto: 'AD es lo que le sobra a AB.', ecuacion: junto(['AD = 16 − 12 = ', dF('4 m')]) },
      { texto: 'Las otras: 16 m es AB entero; 12 m es BD; 9 m es AB con BC = 4k, sin restar; 8 m es la mitad de AB.' }],
    respuesta: ['AD = ', dF('4 m')] });
  EJ6.push({ nivel: 3, titulo: 'La mediana del de 30°',
    figura: fig(figRect(30, { lados: [{ de: 'A', a: 'B', texto: '16 cm', ref: 'C', dist: 7 }], ang: [{ en: 'A', de: 'B', a: 'C', color: 'h', radio: 26 }], alt: 'Triángulo ABC recto en C, con el ángulo A de 30° (su arco) y la hipotenusa AB de 16 cm. M es el punto medio de AB y se traza CM.' })),
    enunciado: 'En △ABC, recto en C, m∠A = 30° y la hipotenusa mide AB = 16 cm. M es el punto medio de AB. ¿Cuánto mide el perímetro de △CMB?',
    alternativas: ['16 cm', '8√3 cm', '32 cm', '20 cm', '24 cm'],
    datos: [D_N30, D_MH, D_PER],
    solucion: [{ texto: 'CB queda frente a 30°: es k, la mitad de la hipotenusa.', ecuacion: junto('CB = 16 ÷ 2 = 8 cm') },
      { texto: 'CM es la mediana a la hipotenusa y MB es la mitad de AB: los dos miden 8 cm.' },
      { texto: 'Sumo los tres lados de △CMB.', ecuacion: junto(['8 + 8 + 8 = ', dF('24 cm')]) },
      { texto: 'Las otras: 16 cm olvida un lado; 8√3 cm es el cateto AC; 32 cm toma CM = 16 cm, la hipotenusa entera; 20 cm toma CM = 4 cm.' }],
    respuesta: ['Perímetro = ', dF('24 cm')] });

  // «La regla»: las tres escuadras, cada una con sus lados en k.
  function figRegla6() {
    // Dos filas para que cada escuadra se vea grande a 390 px: arriba la de 45° y la de 30° y 60°; abajo, la de 37° y 53°.
    const partes = [], pos = [[0, 4.4], [4.6, 4.4], [2.1, 0]], tipos = ['45-45', '30-60', '37-53'], esc = [3, 2, 1];
    const lados = [], escs = [], arcos = [], libres = [];
    tipos.forEach((tp, j) => {
      const [m, M] = NOT[tp].lados(esc[j]).map(val), C = pos[j], A = [C[0], C[1] + m], B = [C[0] + M, C[1]], id = x => `${x}${j}`;
      partes.push({ puntos: [{ id: id('A'), x: A[0], y: A[1], sinPunto: true }, { id: id('B'), x: B[0], y: B[1], sinPunto: true }, { id: id('C'), x: C[0], y: C[1], sinPunto: true }],
        segmentos: [{ de: id('C'), a: id('A'), color: 'o', grosor: 'variable' }, { de: id('C'), a: id('B'), color: 'i', grosor: 'variable' }, { de: id('A'), a: id('B') }] });
      arcos.push({ en: id('C'), de: id('B'), a: id('A'), color: 'h', radio: 9, mide: 90 });
      // (Auditoría del 19 nov, M12: los ángulos de cada escuadra, escritos encima de ella; como arcos con número no caben en
      // escuadras tan chicas.)
      libres.push(Object.assign({ dist: 5, texto: { '45-45': '45° y 45°', '30-60': '30° y 60°', '37-53': '37° y 53°' }[tp], color: 'h' }, tp === '37-53' ? { en: id('C'), dir: 270 } : { en: id('A'), dir: 90 }));
      const T = { '45-45': ['k', 'k', 'k√2'], '30-60': ['k', 'k√3', '2k'], '37-53': ['3k', '4k', '5k'] }[tp];
      lados.push({ de: id('C'), a: id('A'), texto: T[0], color: 'o', ref: id('B'), dist: 5 }, { de: id('C'), a: id('B'), texto: T[1], color: 'i', ref: id('A'), dist: 5 }, { de: id('A'), a: id('B'), texto: T[2], ref: id('C'), dist: 5 });
      escs.push({ puntos: [id('A'), id('B'), id('C')] });
    });
    const fg = { alt: 'Las tres escuadras notables, con la esquina recta abajo a la izquierda: la de 45° con lados k, k y k√2; la de 30° y 60° con k, k√3 y 2k; y la de 37° y 53° con 3k, 4k y 5k.', alto: 290,
      vista: { x: [-1.1, 9.1], y: [-1.2, 7.9] }, puntos: partes.flatMap(p => p.puntos), segmentos: partes.flatMap(p => p.segmentos), angulos: arcos };
    return { objeto: 'armazon', tipo: 'escuadras', figura: fg, escuadras: escs, ladosRot: lados, libres };
  }

  const notables = {
    id: 'notables',
    titulo: 'Triángulos rectángulos notables',
    pregunta: '¿Cómo se sacan los lados de una escuadra con solo uno?',
    temas: ['Triángulos rectángulos notables'],
    pieza: GO,
    aprendizaje: 'Un notable de 45°, de 30° y 60° o de 37° y 53° tiene sus lados en razón fija: con uno se sacan los otros.',
    actividad: 'Elegir una escuadra y su tamaño hasta que sus bordes midan lo pedido.',
    // Lee: las escuadras, la letra k, Pitágoras como dato y la cinta del albañil. No da los lados de la escuadra de 45°
    // (es la predicción).
    lee: {
      tarjetas: [
        { titulo: 'Las escuadras', texto: 'Las escuadras del juego de geometría son triángulos rectángulos con ángulos fijos: 30° y 60° una, 45° y 45° la otra. Hay un tercer notable, de 37° y 53°. Sus lados guardan siempre la misma razón.',
          pieza: GO, dibujo: fig(figNot('30-60', 3, { alt: 'Una escuadra de 30° y 60° del juego de geometría, con la esquina recta en C.' })) },
        { titulo: 'La letra k', texto: 'En un notable, cada lado se escribe como un múltiplo de un mismo número k. Si la escuadra crece al doble, k también: la forma no cambia, solo el tamaño.' },
        { titulo: 'Pitágoras, como dato', texto: 'En todo triángulo rectángulo, el cuadrado de la hipotenusa es la suma de los cuadrados de los catetos: 3² + 4² = 9 + 16 = 25 = 5². Lo verás probado en Relaciones métricas.' },
        { titulo: 'Qué mirar al jugar', texto: 'Vas a elegir la escuadra y cambiar k. Mira cuánto mide cada borde y qué múltiplo de k es. Los 37° y 53° son aproximados: lo usa el examen.' },
      ],
    },
    ejemplos: EJ6,
    juega: {
      pieza: GO,
      consigna: 'Cada escuadra crece sin cambiar de forma: k dice su tamaño, en centímetros.',
      mision: {
        texto: 'Elige escuadra y tamaño k: borde largo de 10 cm y corto de 5 cm.',
        logrado: v => v.tipo === '30-60' && v.k === 5,
        bien: 'En la de 30° y 60°, el borde corto mide la mitad del largo.',
      },
      voz: 'Cambia k. ¿Qué borde crece más rápido?',
      leyenda: [
        { s: 'C', t: 'la esquina recta' },
        { s: dO('CA'), t: 'el borde corto (cateto menor)' },
        { s: dI('CB'), t: 'el otro borde de la esquina' },
        { s: 'AB', t: 'el borde largo (hipotenusa)' },
        { s: 'k', t: 'el número que multiplica a cada borde' },
      ],
      controles: [
        { id: 'tipo', etiqueta: 'Escuadra', opciones: [{ valor: '37-53', texto: '37° y 53°' }, { valor: '30-60', texto: '30° y 60°' }], inicio: '37-53' },
        { id: 'k', etiqueta: 'Tamaño k', min: 1, max: 6, paso: 1, inicio: 2, unidad: '', decimales: 0 },
      ],
      dibujo: v => ({ datos: figJ6(v), estado: {} }),
      lectura: v => [junto(`Con k = ${v.k}: `), dO(bordes(v.tipo, v.k)[0]), ', ', dI(bordes(v.tipo, v.k)[1]), junto(` y ${bordes(v.tipo, v.k)[2]}`)],
      minimo: 4,
    },
    predice: {
      pregunta: 'Una escuadra de 45° y 45° tiene el borde largo de 10 cm. ¿Cuánto mide cada borde corto?',
      datos: ['√2 ≈ 1,41.', D_PIT],
      voz: 'Es otra escuadra. Piensa qué figura arman dos iguales.',
      opciones: [
        { id: 'c', texto: '5√2 cm, unos 7,1 cm', correcta: true },
        { id: 'mitad', texto: '5 cm, la mitad', error: 'GE-CON14', siFuera: 'La mitad vale frente a 30°, en la otra escuadra; en la de 45°, los cortos miden más.' },
        { id: 'raiz3', texto: '5√3 cm', error: 'GE-CON24', siFuera: '5√3 cm es el borde mayor de la escuadra de 30° y 60° con 10 cm de largo.' },
        { id: 'diez', texto: '10√2 cm', error: 'GE-CON15', siFuera: 'Saldría 10√2 cm si los cortos midieran 10 cm; aquí el largo es 10 cm y se divide.' },
      ],
      dibujo: fig(figNot('45-45', 5 * S2, { textos: ['?', '?', '10 cm'], alt: 'Una escuadra de 45° y 45° con el borde largo AB de 10 cm; los dos bordes cortos llevan «?».' })),
      revelar: fig(figNot('45-45', 5 * S2, { textos: ['5√2 cm', '5√2 cm', '10 cm'], alt: 'La escuadra de 45°: bordes cortos de 5√2 cm, unos 7,1 cm, y borde largo de 10 cm.' })),
      coincide: 'Coincide: cada borde corto mide 5√2 cm, unos 7,1 cm.',
      noCoincide: 'Revisemos: en la de 45°, cada borde corto mide 10 ÷ √2 = 5√2 cm, unos 7,1 cm.',
    },
    mira: {
      pieza: GO,
      datos: (() => { const k = 5 * S2, F = figNot('45-45', k, { textos: ['k', 'k', '10 cm'], abDentro: 'Q', vista: { x: [-1.4, 8.7], y: [-1.4, 8.7] }, alto: 250,
        mas: [{ id: 'Q', x: k, y: k, sinPunto: true, desde: 1 }], segs: [{ de: 'A', a: 'Q', discontinua: true, desde: 1 }, { de: 'Q', a: 'B', discontinua: true, desde: 1 }],
        alt: 'La escuadra de 45° con catetos k e hipotenusa de 10 cm. Otra escuadra igual, pegada por el borde largo, completa un cuadrado de lado k: la hipotenusa es su diagonal.' });
        F.escuadras.push({ puntos: ['A', 'Q', 'B'], desde: 1 }); return F; })(),
      voz: 'Dos escuadras iguales arman una figura que ya conoces.',
      pasos: [
        { estado: { corte: 0 }, texto: 'La escuadra de 45° tiene dos bordes cortos iguales: los llamo k.' },
        { estado: { corte: 1 }, texto: 'Otra igual, pegada por el borde largo, completa un cuadrado de lado k.' },
        { estado: { corte: 1 }, texto: 'El borde largo es la diagonal. Por Pitágoras, su cuadrado es 2k².', ecuacion: junto('AB² = k² + k² = 2k²   →   AB = k√2') },
        { estado: { corte: 1 }, texto: 'Con AB = 10 cm, k es 10 entre √2.', ecuacion: junto(['k = 10 ÷ √2 = 5√2 cm ≈ 7,1 cm']) },
        { estado: { corte: 1 }, texto: 'Dos de 30° y 60° arman un equilátero: el corto es medio lado.', ecuacion: junto('k,   k√3,   2k') },
      ],
    },
    regla: {
      texto: 'Lados de los notables: 45° y 45°, k, k y k√2; 30° y 60°, k frente a 30°, k√3 y 2k; 37° y 53°, 3k, 4k y 5k.',
      ecuacion: [{ llave: [junto('k : k : k√2')], nota: '45° y 45°', color: 'c-o' }, '      ', { llave: [junto('k : k√3 : 2k')], nota: '30° y 60°', color: 'c-o' }, '      ', { llave: [junto('3k : 4k : 5k')], nota: '37° y 53°', color: 'c-o' }],
      condicion: 'el triángulo es rectángulo. El de 37° y 53° es aproximado (36,87° y 53,13°): es la convención del examen.',
      voz: 'Reconoce el notable por sus ángulos, no por su posición.',
      dibujo: { pieza: GO, datos: figRegla6(), estado: {} },
    },
    // Así se resuelve: el perímetro de un notable a partir de un lado. «Ahora tú» pide completar un lado, el de 37° y 53°
    // con cosas del mundo, qué notable es, el isósceles de 120° y la altura que parte en dos notables.
    resuelve: {
      pieza: GO,
      generar(s) {
        const r = azar(s + 900);
        if (s % 2 === 0) {
          const k = r.ent(2, 9), h = 2 * k;
          const F = figNot('30-60', k, { examen: true, textos: ['', '', `${h} cm`], alt: `Triángulo rectángulo de 30° y 60°, recto en C, con la hipotenusa AB de ${h} cm.` });
          return {
            enunciado: `En un triángulo rectángulo de 30° y 60°, la hipotenusa mide ${h} cm. ¿Cuánto mide su perímetro?`,
            datos: [D_N30, D_PER],
            dibujo: fig(F),
            pasos: [
              { tipo: 'pide', texto: 'Piden el perímetro: la suma de los tres lados.' },
              { tipo: 'datos', texto: `Se sabe la hipotenusa, ${h} cm, y los ángulos: 30°, 60° y 90°.` },
              { tipo: 'regla', texto: 'En el notable de 30° y 60°, los lados son k (frente a 30°), k√3 (frente a 60°) y 2k (la hipotenusa).' },
              { tipo: 'cuentas', texto: `2k = ${h} cm: k = ${k}. Los catetos miden ${k} cm y ${k}√3 cm.`, ecuacion: junto(['perímetro = ', `${k} + ${k}√3 + ${h} = `, dF(`${3 * k} + ${k}√3 cm`)]) },
              { tipo: 'sentido', texto: `Unos ${f(3 * k + k * S3)} cm: un poco más que el doble de la hipotenusa.` },
            ],
            respuesta: ['Perímetro = ', dF(`${3 * k} + ${k}√3 cm`)],
          };
        }
        const k = r.ent(2, 9), dado = r.de([0, 1]), L = [3 * k, 4 * k][dado];
        const textos = ['', '', '']; textos[dado] = `${L} cm`;
        const F = figNot('37-53', k, { examen: true, textos, alt: `Triángulo rectángulo de 37° y 53°, recto en C, con el cateto ${dado === 0 ? 'CA, frente a 37°,' : 'CB, frente a 53°,'} de ${L} cm.` });
        return {
          enunciado: `En un triángulo rectángulo de 37° y 53°, el cateto frente a ${dado === 0 ? 37 : 53}° mide ${L} cm. ¿Cuánto mide su perímetro?`,
          datos: [D_N37, D_PER],
          dibujo: fig(F),
          pasos: [
            { tipo: 'pide', texto: 'Piden el perímetro: la suma de los tres lados.' },
            { tipo: 'datos', texto: `Un cateto mide ${L} cm, y está frente a ${dado === 0 ? 37 : 53}°.` },
            { tipo: 'regla', texto: 'En el notable de 37° y 53°, los lados son 3k (frente a 37°), 4k (frente a 53°) y 5k (la hipotenusa).' },
            { tipo: 'cuentas', texto: `${dado === 0 ? '3k' : '4k'} = ${L}: k = ${k}. Los tres lados suman 12k.`, ecuacion: junto(['perímetro = ', `${3 * k} + ${4 * k} + ${5 * k} = `, dF(`${12 * k} cm`)]) },
            { tipo: 'sentido', texto: `Compruebo con Pitágoras: ${3 * k}² + ${4 * k}² = ${25 * k * k} = ${5 * k}².` },
          ],
          respuesta: ['Perímetro = ', dF(`${12 * k} cm`)],
        };
      },
    },
    ahoraTu: {
      pieza: GO,
      voz: 'Primero los ángulos: ¿qué notable es? Después, el valor de k.',
      generar(s) { return conCuatro([casoCompletar, casoN37, casoCual, casoIso120, casoAltura][s % 5], azar(s + 7), firmasDe(EJ6)); },
    },
  };

  // ---------- Laboratorio: juego libre, sin preguntas (una mesa por idea; colores de su idea) ----------
  // Mesa 1, más rica que la idea 1: la circunferencia de LLA con el ángulo A y el lado BC libres. La idea solo deja jugar
  // LAL y muestra LLA en un caso fijo; aquí se buscan los tres finales: ninguno, uno o dos triángulos. Colores de la idea
  // 1: AB naranja, el lado que gira y su circunferencia turquesa, el ángulo A carmín.
  const VLLA = { x: [-3.6, 13], y: [-1, 9.6] };
  const llaLibre = (g, a) => {
    const c = Math.cos(U.rad(g)), disc = 49 * c * c - (49 - a * a);
    const ts = disc < -1e-9 ? [] : [7 * c - Math.sqrt(Math.max(disc, 0)), 7 * c + Math.sqrt(Math.max(disc, 0))].filter(t => t > 1e-6);
    const sol = [...new Set(ts.map(t => t.toFixed(6)))].map(Number);
    const L = Math.min(11, 9.4 / Math.sin(U.rad(g)), g > 90 ? 3.4 / Math.abs(c) : Infinity), R = U.polar([0, 0], L, g);
    const Cs = sol.map(t => U.polar([0, 0], t, g));
    return {
      alt: `AB = 7 cm, ángulo A de ${g}° y BC = ${f(a)} cm: ${sol.length === 0 ? 'la circunferencia no alcanza el lado, no hay triángulo' : sol.length === 1 ? 'un solo triángulo' : 'dos triángulos distintos'}`,
      vista: VLLA,
      puntos: [{ id: 'A', x: 0, y: 0, rotulo: 'A', lado: -120 }, { id: 'B', x: 7, y: 0, rotulo: 'B', lado: -60 }, { id: 'R', x: R[0], y: R[1], sinPunto: true },
        ...Cs.map((C, i) => ({ id: `C${i}`, x: C[0], y: C[1], rotulo: Cs.length > 1 ? `C${'₁₂'[i]}` : 'C', color: 'i', lado: g + 90 }))],
      circulos: [{ centro: 'B', r: a, color: 'i', discontinua: true }],
      segmentos: [{ de: 'A', a: 'B', texto: '7 cm', color: 'o', grosor: 'variable' }, { de: 'A', a: 'R', grosor: 'fino', discontinua: true },
        ...Cs.map((C, i) => ({ de: 'B', a: `C${i}`, color: 'i', grosor: 'variable' }))],
      regiones: Cs.map((C, i) => ({ puntos: ['A', 'B', `C${i}`], opacidad: 0.06 })),
      angulos: [{ en: 'A', de: 'B', a: 'R', color: 'h', texto: `${g}°` }],
    };
  };
  const cuantos = (g, a) => llaLibre(g, a).puntos.length - 3;
  const mesaLLA = {
    id: 'compas-lla', titulo: 'La circunferencia de LLA', pieza: 'geo-figura',
    consigna: 'Gira el lado que sale de A y abre la circunferencia punteada de centro B. Busca cero, uno y dos triángulos con los mismos datos.',
    controles: [
      { id: 'g', etiqueta: 'm∠A', min: 20, max: 120, paso: 5, inicio: 40, unidad: '°', decimales: 0, color: 'c-h' },
      { id: 'a', etiqueta: 'BC, en cm', min: 2, max: 9, paso: 0.5, inicio: 5, unidad: 'cm', decimales: 1, color: 'c-i' },
    ],
    dibujo: v => ({ datos: llaLibre(v.g, v.a), estado: {} }),
    arrastres: [
      { id: 'lado-a', etiqueta: 'lado que sale de A', color: 'c-h',
        donde: v => enPantalla(llaLibre(v.g, v.a), U.polar([0, 0], 5, v.g)),
        mover: (pt, v) => { const q = alPlano(llaLibre(v.g, v.a), pt); return { g: U.grados(Math.atan2(Math.max(q[1], 0.01), q[0])) }; } },
      { id: 'compas', etiqueta: 'radio de la circunferencia', color: 'c-i',
        donde: v => enPantalla(llaLibre(v.g, v.a), [7, v.a]),
        mover: (pt, v) => { const q = alPlano(llaLibre(v.g, v.a), pt); return { a: Math.hypot(q[0] - 7, q[1]) }; } },
    ],
    lectura: v => { const n = cuantos(v.g, v.a); return [dH(junto(`m∠A = ${v.g}°`)), ' y ', dI(junto(`BC = ${f(v.a)} cm`)), junto(`: ${['ningún triángulo', 'un triángulo', 'dos triángulos'][n]}`)]; },
    // Retos comprobados con cuantos(), que cuenta los cortes de la circunferencia que dibuja llaLibre().
    invitaciones: [
      { texto: 'Achica la circunferencia hasta que no alcance el lado: ningún triángulo.',
        logrado: v => cuantos(v.g, v.a) === 0, bien: 'BC no llega al lado de A: con esos datos no hay triángulo.' },
      { texto: 'Busca el caso en que la circunferencia apenas toca el lado: un solo triángulo.',
        logrado: v => cuantos(v.g, v.a) === 1 && v.a < 7, bien: 'Lo toca en un punto: ahí LLA da uno solo. ¿Y si la abres un poco?' },
      { texto: 'Con m∠A = 40°, busca el BC más corto que ya da dos triángulos.',
        logrado: v => v.g === 40 && cuantos(v.g, v.a) === 2 && v.a === BC_DOS_40, bien: 'Apenas pasa lo que hay de B al lado: la circunferencia corta dos veces.' },
      { texto: 'Haz obtuso el ángulo A y consigue un triángulo.',
        logrado: v => v.g > 90 && cuantos(v.g, v.a) === 1, bien: 'Con A obtuso, la circunferencia corta una sola vez: ahí LLA sí fija el triángulo.' },
      { texto: 'Guarda dos casos con el mismo ángulo A y distinto número de triángulos.',
        logrado: (v, gs) => gs.some(c => c.g === v.g && cuantos(c.g, c.a) !== cuantos(v.g, v.a)) && gs.some(c => c.g === v.g && c.a === v.a),
        bien: 'Mismo ángulo, otro BC, otro final: LLA no es criterio.' },
    ],
  };
  const BC_DOS_40 = Array.from({ length: 15 }, (_, k) => 2 + k / 2).find(a => cuantos(40, a) === 2);

  // Mesa 2 (idea 2): los banderines con giros de 15° en 15° y las dos caras.
  const mesaBanderines = {
    id: 'banderines', titulo: 'Los banderines del mismo molde', pieza: GO,
    consigna: 'Gira y voltea el banderín DEF como quieras. Mira qué punta cae sobre cada punta de ABC.',
    controles: [
      { id: 'giro', etiqueta: 'Giro del banderín DEF', min: 0, max: 330, paso: 30, inicio: 0, unidad: '°', decimales: 0 },
      { id: 'cara', etiqueta: 'Cara del banderín DEF', opciones: [{ valor: 'frente', texto: 'Como está' }, { valor: 'vuelta', texto: 'Dado vuelta' }], inicio: 'frente' },
    ],
    dibujo: v => ({ datos: figBan(v.giro, v.cara), estado: {} }),
    lectura: v => { const p = encima(v); return [junto(`Puesto encima: ${p[0]} sobre A, ${p[1]} sobre B, ${p[2]} sobre C`)]; },
    invitaciones: [
      { texto: 'Haz que el banderín DEF calce sobre ABC: cada arco sobre su igual.', logrado: v => calza(v), bien: 'D sobre A, E sobre B y F sobre C: △ABC ≅ △DEF.' },
      { texto: 'Sin darlo vuelta, busca el giro que deja D sobre A.', logrado: v => v.cara === 'frente' && encima(v)[0] === 'D', bien: 'D cae sobre A, pero E y F no calzan: falta darlo vuelta.' },
      { texto: 'Busca una posición en la que ninguna punta caiga sobre su pareja.', logrado: v => encima(v).split('').every((x, k) => x !== 'DEF'[k]), bien: 'Ninguna calza: la posición no dice qué lado va con cuál; los arcos sí.' },
    ],
  };
  // Mesa 3 (idea 3): el pozo libre, con los dos caminos.
  const mesaPozo = {
    id: 'pozo', titulo: 'El pozo entre dos caseríos', pieza: GO,
    consigna: 'Mueve el pozo P a cualquier lugar. Compara los caminos PA y PB.',
    controles: [
      { id: 'dx', etiqueta: 'P a los lados de M, en km', min: -2.5, max: 2.5, paso: 0.5, inicio: -1, unidad: 'km', decimales: 1 },
      { id: 'y', etiqueta: 'P a lo alto, sobre AB, en km', min: 1, max: 5, paso: 1, inicio: 3, unidad: 'km', decimales: 0 },
    ],
    dibujo: v => ({ datos: figMapa(v), estado: {} }),
    arrastres: [{ id: 'pozo-p', etiqueta: 'pozo P', color: 'c-h', donde: v => PO.aPantalla(figMapa(v), [v.dx, v.y]), mover: (pt, v) => { const q = PO.aPlano(figMapa(v), pt); return { dx: q[0], y: q[1] }; } }],
    lectura: v => lugares.juega.lectura(v),
    invitaciones: [
      { texto: 'Pon el pozo igual de lejos de A y de B, a más de 5 km.', logrado: v => igual(dPA(v), dPB(v)) && dPA(v) > 5, bien: 'Más arriba, en la misma mediatriz: igual de lejos de los dos.' },
      { texto: 'Busca el lugar igual de lejos de A y de B más cercano a los dos.', logrado: v => v.dx === 0 && v.y === 1, bien: 'En la mediatriz, lo más bajo que deja la mesa: a unos 3,2 km.' },
      { texto: 'Pon el pozo más cerca de B que de A, a menos de 3 km.', logrado: v => dPB(v) < 3 && dPA(v) > dPB(v), bien: 'Del lado de B de la mediatriz, todo queda más cerca de B.' },
      { texto: 'Guarda dos lugares con PA = PB, uno alto y otro bajo. ¿Dónde están los dos?',
        logrado: (v, gs) => gs.some(c => igual(dPA(c), dPB(c)) && c.y >= 4) && gs.some(c => igual(dPA(c), dPB(c)) && c.y <= 2) && gs.some(c => c.dx === v.dx && c.y === v.y),
        bien: 'Los dos están sobre la mediatriz de AB.' },
    ],
  };
  // Mesa 4 (idea 4): la base media con la base BC que también cambia y A en un rango más amplio. MN naranja, BC turquesa.
  const baseLibre = (ax, ay, cx) => {
    const A = [ax, ay], M = U.medio(A, [0, 0]), N = U.medio(A, [cx, 0]);
    return {
      alt: `M y N, puntos medios de AB y AC: MN mide ${f(cx / 2)} m, la mitad de BC = ${f(cx)} m`,
      vista: { x: [-3.4, 12.4], y: [-0.8, 6.4] },
      puntos: [{ id: 'A', x: ax, y: ay, rotulo: 'A', lado: 90 }, { id: 'B', x: 0, y: 0, rotulo: 'B', lado: -120 }, { id: 'C', x: cx, y: 0, rotulo: 'C', lado: -60 },
        { id: 'M', x: M[0], y: M[1], rotulo: 'M', lado: 160 }, { id: 'N', x: N[0], y: N[1], rotulo: 'N', lado: 20 }],
      regiones: [{ puntos: ['A', 'B', 'C'], opacidad: 0.05 }],
      segmentos: [{ de: 'A', a: 'M', marcas: 1 }, { de: 'M', a: 'B', marcas: 1 }, { de: 'A', a: 'N', marcas: 2 }, { de: 'N', a: 'C', marcas: 2 },
        { de: 'B', a: 'C', color: 'i', grosor: 'variable', texto: `${f(cx)} m`, paralela: 1 }, { de: 'M', a: 'N', color: 'o', grosor: 'variable', texto: `${f(cx / 2)} m`, paralela: 1 }],
    };
  };
  const baseMN = v => { const P = baseLibre(v.ax, v.ay, v.cx).puntos, M = P.find(p => p.id === 'M'), N = P.find(p => p.id === 'N'); return U.dist([M.x, M.y], [N.x, N.y]); };
  const mesaBase = {
    id: 'base-libre', titulo: 'Base media con base libre', pieza: 'geo-figura',
    consigna: 'Arrastra A y también C. Estira la base y deforma el triángulo: mira qué parte de BC es MN.',
    controles: [
      { id: 'ax', etiqueta: 'A a lo ancho, en m', min: -3, max: 12, paso: 0.5, inicio: 3, unidad: 'm', decimales: 1 },
      { id: 'ay', etiqueta: 'A a lo alto, en m', min: 1, max: 6, paso: 0.5, inicio: 4, unidad: 'm', decimales: 1 },
      { id: 'cx', etiqueta: 'BC, en m', min: 2, max: 12, paso: 1, inicio: 8, unidad: 'm', decimales: 0, color: 'c-i' },
    ],
    dibujo: v => ({ datos: baseLibre(v.ax, v.ay, v.cx), estado: {} }),
    arrastres: [
      { id: 'vertice-a', etiqueta: 'vértice A', color: 'c-o', donde: v => enPantalla(baseLibre(v.ax, v.ay, v.cx), [v.ax, v.ay]), mover: (pt, v) => { const q = alPlano(baseLibre(v.ax, v.ay, v.cx), pt); return { ax: q[0], ay: q[1] }; } },
      { id: 'vertice-c', etiqueta: 'vértice C', color: 'c-i', donde: v => enPantalla(baseLibre(v.ax, v.ay, v.cx), [v.cx, 0]), mover: (pt, v) => ({ cx: alPlano(baseLibre(v.ax, v.ay, v.cx), pt)[0] }) },
    ],
    lectura: v => [dO(junto(`MN = ${f(v.cx / 2)} m`)), junto(', la mitad de '), dI(junto(`BC = ${f(v.cx)} m`))],
    invitaciones: [
      { texto: 'Haz que la base media MN mida justo 3 m.', logrado: v => Math.abs(baseMN(v) - 3) < 1e-9, bien: 'MN = 3 m pide BC = 6 m, quede donde quede A.' },
      { texto: 'Busca la base media más larga que permite la mesa.', logrado: v => Math.abs(baseMN(v) - baseMN({ ax: 0, ay: 1, cx: mesaBase.controles[2].max })) < 1e-9, bien: 'La más larga sale con la base más larga. A no ayuda.' },
      { texto: 'Lleva A más allá de C, hasta que el triángulo quede obtuso en C.', logrado: v => v.ax > v.cx, bien: 'Obtuso y todo, MN sigue midiendo la mitad de BC.' },
      { texto: 'Guarda dos casos con la misma BC y A muy lejos. Compara MN.',
        logrado: (v, gs) => gs.some(c => c.cx === v.cx && Math.abs(c.ax - v.ax) >= 4) && gs.some(c => c.ax === v.ax && c.ay === v.ay && c.cx === v.cx), bien: 'Misma BC, misma MN: la posición de A no entra en la cuenta.' },
    ],
  };
  // Mesa 5 (idea 5): C libre, dentro y fuera de la esquina recta. La hipotenusa AB = 10 m fija; CM turquesa, el ángulo C
  // carmín. (La circunferencia punteada es de otro tema: aquí solo marca dónde el ángulo en C es recto.)
  const semiLibre = (cx, cy) => {
    const C = [cx, cy], ang = U.angulo(C, [-5, 0], [5, 0]);
    return { alt: `C en (${f(cx)}; ${f(cy)}): ángulo en C de ${f(ang, 0)}° y mediana CM de ${f(Math.hypot(cx, cy))} m`, vista: { x: [-5.8, 5.8], y: [-1.6, 7.6] },
      puntos: [{ id: 'A', x: -5, y: 0, rotulo: 'A', lado: 180 }, { id: 'B', x: 5, y: 0, rotulo: 'B', lado: 0 }, { id: 'M', x: 0, y: 0, rotulo: 'M', lado: -90 }, { id: 'C', x: cx, y: cy, rotulo: 'C', lado: 90 }],
      // (Auditoría del 19 nov, M13: sin la circunferencia de diámetro AB, que es de Circunferencia; se compara el ángulo en C
      // con CM.)
      segmentos: [{ de: 'A', a: 'B' }, { de: 'A', a: 'C' }, { de: 'B', a: 'C' }, { de: 'C', a: 'M', color: 'i', grosor: 'variable' }],
      angulos: [{ en: 'C', de: 'A', a: 'B', color: 'h', texto: `${f(ang, 0)}°` }] };
  };
  const anguloC = v => U.angulo([v.cx, v.cy], [-5, 0], [5, 0]);
  const medianaCM = v => U.dist([v.cx, v.cy], U.medio([-5, 0], [5, 0]));
  let C_MAX = 0;
  for (let i = 0; i <= 18; i++) for (let j = 0; j <= 13; j++) C_MAX = Math.max(C_MAX, anguloC({ cx: -4.5 + i / 2, cy: 0.5 + j / 2 }));
  const mesaSemi = {
    id: 'c-libre', titulo: 'La esquina que se abre', pieza: 'geo-figura',
    consigna: 'Arrastra C, con AB = 10 m fija. Compara el ángulo en C con la mediana CM.',
    controles: [
      { id: 'cx', etiqueta: 'C a lo ancho, en m', min: -4.5, max: 4.5, paso: 0.5, inicio: 3, unidad: 'm', decimales: 1 },
      { id: 'cy', etiqueta: 'C a lo alto, en m', min: 0.5, max: 7, paso: 0.5, inicio: 4, unidad: 'm', decimales: 1 },
    ],
    dibujo: v => ({ datos: semiLibre(v.cx, v.cy), estado: {} }),
    arrastres: [{ id: 'vertice-c', etiqueta: 'vértice C', color: 'c-i', donde: v => enPantalla(semiLibre(v.cx, v.cy), [v.cx, v.cy]), mover: (pt, v) => { const q = alPlano(semiLibre(v.cx, v.cy), pt); return { cx: q[0], cy: q[1] }; } }],
    lectura: v => [dH(junto(`m∠C = ${f(anguloC(v), 0)}°`)), ' y ', dI(junto(`CM = ${f(medianaCM(v))} m`)), junto('; AB ÷ 2 = 5 m')],
    invitaciones: [
      { texto: 'Busca otro lugar de C donde la mediana CM mida justo 5 m.', logrado: v => Math.abs(medianaCM(v) - 5) < 1e-9 && !(v.cx === 3 && v.cy === 4), bien: 'CM = 5 m y m∠C = 90°: C está en la circunferencia de diámetro AB.' },
      { texto: 'Aleja C hasta que el ángulo en C quede agudo.', logrado: v => anguloC(v) < 90 - 1e-9, bien: 'Ángulo agudo y CM mayor que 5 m.' },
      { texto: 'Haz el ángulo en C lo más abierto que permite la mesa.', logrado: v => Math.abs(anguloC(v) - C_MAX) < 1e-9, bien: 'Pegado a AB, el ángulo casi llega a 180° y CM se encoge.' },
      { texto: 'Guarda un caso con CM menor que 5 m y otro mayor. Compara sus ángulos.',
        logrado: (v, gs) => gs.some(c => medianaCM(c) < 5 - 1e-9) && gs.some(c => medianaCM(c) > 5 + 1e-9) && gs.some(c => c.cx === v.cx && c.cy === v.cy), bien: 'CM menor: ángulo obtuso; CM mayor: agudo. Solo con 90°, la mitad.' },
    ],
  };
  // Mesa 6 (idea 6): las escuadras, con la de 45° también.
  const mesaEscuadras = {
    id: 'escuadras', titulo: 'Las escuadras que crecen', pieza: GO,
    consigna: 'Elige una de las tres escuadras y cambia su tamaño k. Mira sus bordes.',
    controles: [
      { id: 'tipo', etiqueta: 'Escuadra', opciones: [{ valor: '45-45', texto: '45° y 45°' }, { valor: '30-60', texto: '30° y 60°' }, { valor: '37-53', texto: '37° y 53°' }], inicio: '45-45' },
      { id: 'k', etiqueta: 'Tamaño k', min: 1, max: 6, paso: 1, inicio: 1, unidad: '', decimales: 0 },
    ],
    dibujo: v => ({ datos: figJ6(v), estado: {} }),
    lectura: v => notables.juega.lectura(v),
    invitaciones: [
      { texto: 'Arma una escuadra de 45° con el borde largo de unos 7,1 cm.', logrado: v => v.tipo === '45-45' && v.k === 5, bien: '5√2 cm, unos 7,1 cm: los bordes cortos miden 5 cm.' },
      { texto: 'Haz que un borde corto mida 9 cm.', logrado: v => v.tipo === '37-53' && v.k === 3, bien: 'Solo la de 37° y 53° lo logra aquí: 3k = 9 con k = 3.' },
      { texto: 'Guarda dos escuadras distintas con el mismo borde largo de 10 cm.',
        logrado: (v, gs) => gs.some(c => c.tipo === '30-60' && c.k === 5) && gs.some(c => c.tipo === '37-53' && c.k === 2) && gs.some(c => c.tipo === v.tipo && c.k === v.k), bien: 'Mismo borde largo, otros bordes cortos: los ángulos mandan.' },
    ],
  };

  return {
    unidad: 'geometria.congruencia',
    version: '0.5.0',
    // Pasó el lector en frío y el auditor (19 nov): calidad 2, y el validador común lo exige.
    calidad: 2,
    estado: 'completa',
    requiere: ['/nucleo/kit/piezas/geo-figura.js', '/nucleo/kit/piezas/geo-objeto.js'],
    historia: {
      texto: 'La proposición I.4 de los Elementos justifica el criterio lado, ángulo, lado superponiendo un triángulo sobre otro. Los comentarios modernos señalan que el texto no había declarado axiomas para ese movimiento. La pregunta sigue viva: qué datos garantizan una única forma y por qué el movimiento conserva lo necesario.',
      pregunta: '¿Qué datos bastan para que no haya dos triángulos distintos?',
      fuente: { titulo: 'Euclides, Elementos I.4 (edición de D. E. Joyce)', url: 'https://math.clarku.edu/~djoyce/java/elements/bookI/propI4.html' },
    },
    // La tabla de letras de la unidad (molde §0.4; propuesta §5): la usa el validador para las letras de los datos.
    letras: { k: 'el tamaño de un notable: lo que mide su cateto menor, o la tercera parte en el de 37° y 53°', x: 'lo que se pide, un número' },
    // Glosario: las palabras que la unidad estrena (docs/teoria.md, 4d), de 2 a 4 con `simple` por idea (cada término va
    // en la primera idea que lo usa). Ninguno da la respuesta de una predicción: LLA no dice cuántos triángulos salen,
    // «partes correspondientes» no dice que la pareja es la de enfrente, «distancia» no dice qué pasa en la bisectriz,
    // «base media» no dice adónde llega la paralela, «hipotenusa» no dice cuánto mide la mediana y «Pitágoras» no da los
    // lados de la escuadra de 45°.
    glosario: [
      { termino: 'congruente', simbolo: '≅', formas: ['congruentes', 'congruente', 'congruencia'],
        def: 'Igual en forma y en tamaño: una figura calza exacto sobre la otra.',
        simple: 'Dos figuras que calzan una sobre otra, como dos tijerales del mismo techo.',
        ejemplos: ['Dos hojas del mismo cuaderno: una tapa justo a la otra.', '△ABC ≅ △DEF: sus seis medidas coinciden, una por una.', 'Una foto y su ampliación no lo son: cambia el tamaño.'],
        ver: ['criterio'] },
      { termino: 'criterio', formas: ['criterio', 'criterios'],
        def: 'Grupo mínimo de datos iguales que asegura que dos triángulos son iguales en forma y tamaño.',
        simple: 'Las tres medidas que alcanzan para copiar un triángulo sin dudas.',
        ejemplos: ['LAL, ALA y LLL son los tres de este tema.', 'Tres ángulos iguales no lo son: no dicen el tamaño.', 'Si se cumple uno, las otras tres medidas también coinciden.'],
        ver: ['LAL', 'ALA', 'LLL', 'LLA'] },
      { termino: 'LAL', def: 'Lado, ángulo, lado: dos lados iguales y el ángulo que queda entre ellos.',
        simple: 'Dos lados y la abertura entre ellos, como dos vigas y su ángulo.',
        ejemplos: ['AB = DE, m∠A = m∠D y AC = DF.', 'Dos vigas de 8 m y 5 m con 60° entre ellas.', 'Si el ángulo no queda entre los dos lados, ya no es este criterio.'], ver: ['criterio'] },
      { termino: 'ALA', def: 'Ángulo, lado, ángulo: dos ángulos iguales y el lado que queda entre ellos.',
        simple: 'Un lado y los dos ángulos que nacen en sus puntas.',
        ejemplos: ['m∠A = m∠D, AB = DE y m∠B = m∠E.', 'Una viga de 8 m con 60° en una punta y 40° en la otra.', 'Con dos ángulos y otro lado, primero se saca el tercer ángulo.'], ver: ['criterio'] },
      { termino: 'LLL', def: 'Lado, lado, lado: los tres lados iguales, uno a uno.',
        ejemplos: ['AB = DE, BC = EF y AC = DF.', 'Dos banderines de 4 cm, 5 cm y 6 cm.', 'Por eso un tijeral clavado en sus tres puntas no se deforma.'], ver: ['criterio'] },
      // La definición no dice cuántos triángulos salen: esa es la predicción de la idea 1 (auditoría de Triángulos, B8).
      { termino: 'LLA', def: 'Lado, lado, ángulo: dos lados y un ángulo que no queda entre ellos. No es un criterio.',
        ejemplos: ['AB = DE, BC = EF y m∠A = m∠D: el ángulo A no toca a BC.', 'Se lee «lado, lado, ángulo».', 'No hay que confundirlo con LAL, donde el ángulo va en medio.'], ver: ['criterio'] },
      // «circunferencia», «radio» y «diámetro» se mudaron a Circunferencia (19 nov, etapa 7; pendiente de la Etapa 5), y
      // «paralelogramo», a Polígonos y cuadriláteros (etapa 6): aquí el lector los marca «se explica en…».
      // Idea 2. No dice que la pareja de un lado es el lado de enfrente del ángulo igual (es la predicción).
      { termino: 'partes correspondientes', formas: ['partes correspondientes', 'parte correspondiente'],
        def: 'En dos figuras congruentes, el lado o ángulo de una que cae sobre otro de la otra al superponerlas.',
        simple: 'Las parejas que se tapan cuando pones una figura sobre su copia.',
        ejemplos: ['En △ABC ≅ △DEF, A y D son partes correspondientes.', 'Al poner un banderín sobre otro del mismo molde, cada punta tapa a su pareja.', 'Las partes correspondientes miden igual.'] },
      { termino: 'dado vuelta', formas: ['dado vuelta', 'volteado', 'volteada', 'voltea', 'voltear'],
        def: 'Una figura dada vuelta, como una hoja, queda como su imagen en un espejo.',
        simple: 'Como un banderín al que le miras el revés.',
        ejemplos: ['La letra b dada vuelta se ve como d.', 'Un banderín dado vuelta sigue siendo congruente con el otro.', 'Girar no da vuelta una figura; voltearla, sí.'] },
      { termino: 'diagonal', formas: ['diagonal', 'diagonales'], def: 'Segmento que une dos vértices no vecinos de una figura.',
        ejemplos: ['En un cuadrado ABCD, AC es una diagonal.', 'La varilla larga de una cometa va de punta a punta: es una diagonal.', 'Un triángulo no tiene diagonales.'] },
      // Idea 3. «Distancia» dice cómo se mide (en perpendicular), no lo que pasa en una bisectriz (la predicción).
      { termino: 'distancia', formas: ['distancia', 'distancias'],
        def: 'Largo del camino más corto. De un punto a una recta, se mide por la perpendicular.',
        simple: 'El camino más corto; hasta una recta, el que llega en ángulo recto.',
        ejemplos: ['De tu casa a la avenida recta, la distancia es el camino que la cruza en ángulo recto.', 'Un camino inclinado a la misma avenida es más largo.', 'La distancia de A a B es lo que mide el segmento AB.'], ver: ['perpendicular'] },
      { termino: 'equidistar', formas: ['equidistar', 'equidista', 'equidistan', 'equidistantes'],
        def: 'Estar a la misma distancia de dos puntos o de dos líneas.',
        simple: 'Quedar igual de lejos de dos cosas.',
        ejemplos: ['Un paradero a 2 km de un colegio y a 2 km del otro equidista de los dos.', 'El punto medio de AB equidista de A y de B.', 'Si estás más cerca de uno, ya no equidistas.'], ver: ['mediatriz', 'bisectriz'] },
      // Idea 4. «Base media» es el nombre; no dice adónde llega una paralela por un punto medio (la predicción).
      { termino: 'base media', formas: ['base media', 'bases medias'],
        def: 'Segmento que une los puntos medios de dos lados de un triángulo.',
        simple: 'El listón que une la mitad de dos vigas de un tijeral.',
        ejemplos: ['En △ABC, si M y N son los puntos medios de AB y AC, MN es una base media.', 'Un triángulo tiene tres bases medias.', 'Juntas forman el triángulo de los puntos medios.'], ver: ['punto medio'] },
      { termino: 'cumbrera', def: 'La punta de arriba de un tijeral, donde se juntan las dos vigas inclinadas.',
        simple: 'El punto más alto del techo a dos aguas.',
        ejemplos: ['En el tijeral ABC, A es la cumbrera.', 'Si la cumbrera sube, las vigas inclinadas se alargan.', 'La viga de abajo va de pared a pared, lejos de la cumbrera.'] },
      // Idea 5. No dice cuánto mide la mediana (es la regla) ni qué pasa con la esquina inclinada (la predicción).
      { termino: 'hipotenusa', def: 'En un triángulo rectángulo, el lado opuesto al ángulo de 90°. Es el más largo.',
        simple: 'En la escalera apoyada en la pared, la escalera misma.',
        ejemplos: ['En △ABC recto en C, la hipotenusa es AB.', 'Es el lado mayor de un triángulo rectángulo.', 'En una escuadra, es el borde largo.'], ver: ['cateto', 'Pitágoras'] },
      { termino: 'cateto', formas: ['cateto', 'catetos'], def: 'Cada uno de los dos lados que forman el ángulo de 90° en un triángulo rectángulo.',
        simple: 'Cada borde de la esquina recta: la pared y el piso, en la escalera.',
        ejemplos: ['En △ABC recto en C, los catetos son CA y CB.', 'Un cateto siempre es menor que la hipotenusa.', 'En una escuadra, son los dos bordes cortos.'], ver: ['hipotenusa'] },
      // Idea 6. «Pitágoras» va con 3, 4 y 5, no con la escuadra de 45° (la predicción).
      { termino: 'triángulo rectángulo notable', formas: ['triángulo rectángulo notable', 'triángulos rectángulos notables', 'rectángulos notables', 'rectángulo notable', 'notable', 'notables'],
        def: 'Triángulo rectángulo de ángulos agudos 30° y 60°, 45° y 45°, o 37° y 53°: sus lados guardan razones fijas.',
        simple: 'Una escuadra: con sus ángulos se saben sus lados.',
        ejemplos: ['La escuadra de 30° y 60° del juego de geometría.', 'El 3-4-5 de la cinta del albañil, el de 37° y 53°.', 'Si crece al doble, sus lados también, y la razón no cambia.'] },
      { termino: 'Pitágoras', formas: ['teorema de Pitágoras', 'Pitágoras'],
        def: 'En un triángulo rectángulo, la suma de los cuadrados de los catetos es el cuadrado de la hipotenusa.',
        simple: 'La cuenta que dice si una esquina es recta: 3² + 4² = 5².',
        ejemplos: ['3² + 4² = 9 + 16 = 25 = 5².', '6² + 8² = 100 = 10².', 'Se prueba en Relaciones métricas; aquí es un dato.'], ver: ['hipotenusa', 'cateto'] },
      { termino: 'razón', def: 'Cociente entre dos medidas: dice cuántas veces cabe una en la otra.',
        ejemplos: ['Lados de 6 y 3: la razón es 6 : 3 = 2.', 'En 3k, 4k y 5k, la razón 3 : 4 : 5 no cambia con k.', 'Dos medidas iguales están en razón 1.'] },
      { termino: 'axioma', formas: ['axioma', 'axiomas'], def: 'Afirmación que se acepta sin probarla y sirve de punto de partida para probar lo demás.',
        ejemplos: ['«Por dos puntos pasa una sola recta» es un axioma de Euclides.', 'Los axiomas no se demuestran: se aceptan.', 'De pocos axiomas sale toda la geometría del colegio.'] },
    ],
    // (Tope de 5 mesas: la de los banderines queda fuera; la idea 2 ya gira y voltea el banderín en su juego.)
    laboratorio: [mesaLLA, mesaPozo, mesaBase, mesaSemi, mesaEscuadras],
    // A qué idea pertenece cada mesa del laboratorio (Gerson, 16 nov: el laboratorio se agrupa por idea).
    laboratorioIdeas: {
      'compas-lla': ['criterios'],
      pozo: ['mediatriz-bisectriz'],
      'base-libre': ['base-media'],
      'c-libre': ['mediana-hipotenusa'],
      escuadras: ['notables'],
    },
    ideas: [criterios, correspondientes, lugares, baseMedia, medianaHip, notables],
  };
});
