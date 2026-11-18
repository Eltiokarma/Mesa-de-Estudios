/*
 * Teoría de «Triángulos y líneas notables» (geometria.triangulos), para 5.º de secundaria y preuniversitario. Molde:
 * docs/teoria.md y docs/molde-unidad.md. Fuente: docs/teoria/matriz/geometria.json (unidad 2); Elementos I.32 (suma de
 * ángulos) e I.20 (desigualdad). Compañera: Neri (nutria). Piezas: geo-objeto (la cartulina y el tijeral, dibujos de
 * prueba, y las figuras de examen, que trazan con geo-figura) y geo-figura (ideas 2 a 6, todavía sin rehacer).
 *
 * Etapa 4 del plan de calidad (18 nov): la propuesta aprobada por Gerson con todas sus recomendaciones
 * (docs/etapa4/propuesta-geometria.md) y docs/etapa4/decisiones.md, que manda. Seis ideas: suma-de-angulos,
 * angulo-exterior (nueva), isosceles (nueva), desigualdad, lineas-notables y angulo-de-bisectrices; se conservan los id de
 * las cuatro de antes. Fase 2 del método (docs/metodo/unidad/): la idea 1 está completa con el contrato «se entiende sin
 * profesor» (objeto en la primera pantalla, misión, leyenda, predicción con datos sin fórmula, «Mira», regla, «Así se
 * resuelve» distinto de «Ahora tú», «Ahora tú» con datos y de nivel examen, glosario con simple y tres ejemplos, y 15
 * ejemplos resueltos con las cuentas rehechas aparte: scratchpad e4-geo/cuentas-idea1.js). Las ideas 2 a 6 quedan con su
 * contenido de antes reacomodado (2: el exterior que antes era la predicción de la idea 1; 4 a 6: las de antes) o como
 * esqueleto (3: el isósceles); se escriben en la fase 3. Por eso la unidad todavía no declara calidad: 2; la idea 1 se
 * prueba sola contra el validador con calidad 2 (triangulos.test.js).
 * Controles de la idea 1 (decisión 6 de la propuesta): el juego mueve A con los ángulos b y c (de 5° en 5°), así los tres
 * rótulos suman siempre 180° exactos; ax y ay salen del juego. El avance guardado no se toca (el lector ignora los
 * valores de controles que ya no existen).
 *
 * REGLA DE COLORES DE LA UNIDAD (decisiones de la etapa 4; molde §5b: un color fijo por lo que cada cosa ES en la figura):
 *   - todo ángulo interior en carmín (h), con su arco y su letra; tres ángulos distintos se distinguen por 1, 2 o 3 arcos
 *     (1 en A, 2 en B, 3 en C) y sus copias y sus esquinas recortadas llevan los mismos arcos; dos ángulos iguales, los
 *     mismos arcos; en la mariposa (cuatro medidas de afuera), un arco en cada ángulo;
 *   - el ángulo exterior en turquesa (i), el compañero del interior (idea 2); los lados dados, naranja y turquesa (3 y 4);
 *     altura naranja, mediana turquesa, bisectriz carmín y mediatriz en tinta discontinua (idea 5);
 *   - en los ejercicios (ejemplos, «Así se resuelve», «Ahora tú»), todo ángulo dado en carmín y lo pedido con «?» en
 *     tinta; el violeta (f) solo en el texto del resuelto y en la respuesta, nunca en una figura ni en un enunciado;
 *   - el verde no se usa.
 *   La comprueba triangulos.test.js en todas las figuras y textos de la idea 1 (juego en toda su grilla, «Lee», predicción,
 *   «Mira», ejemplos, y «Así se resuelve» y «Ahora tú» en 400 semillas).
 * Notación (decisión 5): m∠A cuando el vértice tiene un solo ángulo en la figura; m∠BAC cuando tiene varios; x sin «°»
 * (m∠A = 2x + 10°, x = 20); nunca C(x) ni S(x), porque C es un vértice; los lados por sus letras (AB), sin la convención
 * a, b, c de Relaciones métricas.
 * Códigos de error: GE7 y GE8 (docs/investigacion/geometria-ideas-erroneas.md); GE-ANG1 viene de Segmentos y ángulos; los
 * GE-TRI, GE-RAZ, GE-DT, GE-ISO y GE-BIS son hipótesis de aula, sin medir (rutinas/teoria-geometria.md y el bloque de cada
 * idea); GE-TRI4 y GE-TRI5 son de la propuesta, GE-TRI6 a GE-TRI19 se agregan aquí (18 nov).
 *
 * Ficha de tarea (diseno-y-animacion):
 *   Promesa: justificar la suma de 180° y usarla para hallar ángulos, también con razones, con x y entre dos triángulos.
 *   Persona y condiciones: postulante de 5.º o de academia, celular de gama baja a 360 px, sin audio, quizás sin conexión.
 *   Resultado observable: halla el tercer ángulo, clasifica por ángulos sin ver el dibujo, resuelve ángulos en razón o
 *     con x, y la «mariposa» (dos triángulos opuestos por el vértice), diciendo por qué vale la suma.
 *   Orden de atención: 1.º la cartulina y sus tres ángulos · 2.º la misión · acción: mover la punta A · fondo: Neri.
 *   Estados: jugando (casos probados) · predicción sin elegir · comprobada · paso de «Mira» · regla · caso nuevo.
 *   Duda que resuelve: «¿por qué siempre 180°?»: las tres esquinas juntas llenan el borde recto de la regla.
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
  // Lo que vale una letra (x, k) es un número: sin «°» (decisiones, cuarta ronda de la etapa 3).
  const NUM = n => f(n);
  const cA = { v: 'c-o', t: 'A' }, cB = { v: 'c-i', t: 'B' }, cC = { v: 'c-d', t: 'C' };
  function azar(s) {
    let q = (s * 2654435761 + 12345) >>> 0;
    const r = () => { q = (q + 0x6D2B79F5) >>> 0; let z = q; z = Math.imul(z ^ (z >>> 15), z | 1); z ^= z + Math.imul(z ^ (z >>> 7), z | 61); return ((z ^ (z >>> 14)) >>> 0) / 4294967296; };
    r.ent = (lo, hi) => lo + Math.floor(r() * (hi - lo + 1));
    r.de = l => l[Math.floor(r() * l.length)];
    return r;
  }
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
  function conCuatro(caso, r) {
    for (let i = 0; i < 200; i++) { const c = caso(r); if (c && c.opciones.length >= 4) return c; }
    throw new Error(`${caso.name}: no salieron cuatro opciones distintas`);
  }
  // Triángulo con base BC horizontal y ángulos dados en B y C (en grados); devuelve los tres vértices.
  const porAngulos = (b, c, base = 6) => {
    const A = U.corte([0, 0], U.polar([0, 0], 1, b), [base, 0], U.polar([base, 0], 1, 180 - c));
    return { A, B: [0, 0], C: [base, 0] };
  };
  // Gesto directo (docs/teoria.md §4b): la manija vive en el viewBox de geo-figura; aPlano la vuelve coordenadas del
  // problema y el lector ajusta cada valor al paso y al rango de su control.
  const enPantalla = (datos, p) => G.aPantalla(datos, p);
  const alPlano = (datos, pt) => G.aPlano(datos, pt);
  const nombreAng = (a, b, c) => { const m = Math.max(a, b, c); return Math.abs(m - 90) < 0.5 ? 'rectángulo' : m > 90 ? 'obtusángulo' : 'acutángulo'; };
  const nombreLad = (x, y, z) => { const e = (p, q) => Math.abs(p - q) < 0.05; return e(x, y) && e(y, z) ? 'equilátero' : e(x, y) || e(y, z) || e(x, z) ? 'isósceles' : 'escaleno'; };

  // ---------- Ayudantes de las ideas rehechas (geo-objeto) ----------
  const GO = 'geo-objeto';
  const dH = t => ({ v: 'c-h', t }), dI = t => ({ v: 'c-i', t }), dF = t => ({ v: 'c-f', t });
  const SEP = '   ·   ';
  // Una relación que no se parte en dos líneas: sus espacios pasan a espacios duros.
  const junto = x => (typeof x === 'string' ? x.replace(/ /g, ' ') : Array.isArray(x) ? x.map(junto) : x);
  const fig = datos => ({ pieza: GO, datos, estado: {} });
  const RAD = Math.PI / 180;
  // Los vértices del triángulo de base BC = 6 con ángulos b en B y c en C (ley de senos; sirve también con 90° u obtusos).
  const vert = (b, c, L = 6) => ({ A: U.polar([0, 0], L * Math.sin(c * RAD) / Math.sin((b + c) * RAD), b), B: [0, 0], C: [L, 0] });
  // Una expresión con x: «2x + 10°», «x − 5°», «3x».
  const exp = (a, b) => `${a === 1 ? '' : a}x${b > 0 ? ` + ${b}°` : b < 0 ? ` − ${-b}°` : ''}`;
  const D_SUMA = 'En todo triángulo: m∠A + m∠B + m∠C = 180°.';
  const D_SUMA_O = 'En todo triángulo, los tres ángulos interiores suman 180°.';
  const D_CLASES = 'Acutángulo: tres ángulos agudos. Rectángulo: uno de 90°. Obtusángulo: uno de más de 90°.';
  const D_RECTO = 'El cuadradito marca un ángulo recto: 90°.';
  const D_OPUESTOS = 'Opuestos por el vértice: miden igual.';
  const D_ADY = 'Dos ángulos adyacentes en una recta suman 180°.';

  // Figura de examen: el triángulo ABC con base BC de 6, a escala (objeto «angulos» de geo-objeto, que pone los rótulos
  // donde no pisan los lados). rot = { A, B, C: { texto, color, marcas } }: sin entrada, sin arco; {} solo el arco.
  // Cada ángulo lleva mide (su valor), que triangulos.test.js compara con lo que se dibuja.
  function figT(b, c, rot = {}, o = {}) {
    const { A, B, C } = vert(b, c), med = { A: 180 - b - c, B: b, C: c };
    const lado = { A: (b - c) / 2 + 90, B: b / 2 + 180, C: -c / 2 };
    const LADOS = { A: ['B', 'C'], B: ['C', 'A'], C: ['A', 'B'] };
    const puntos = [{ id: 'A', x: A[0], y: A[1] }, { id: 'B', x: B[0], y: B[1] }, { id: 'C', x: C[0], y: C[1] }]
      .map(p => Object.assign(p, o.letras === false ? { sinPunto: true } : { rotulo: p.id, lado: lado[p.id], sinPunto: true }));
    const angulos = ['A', 'B', 'C'].filter(v => rot[v]).map(v => Object.assign({ en: v, de: LADOS[v][0], a: LADOS[v][1], radio: 20, holgura: 6, mide: med[v], marcas: rot[v].marcas || 1 },
      rot[v].texto !== undefined ? { texto: rot[v].texto } : {}, rot[v].color ? { color: rot[v].color } : {}));
    const xs = [A[0], 0, 6], ys = [A[1], 0];
    const figura = { alt: o.alt || `Triángulo ABC con ${f(180 - b - c)}° en A, ${f(b)}° en B y ${f(c)}° en C.`,
      vista: { x: [Math.min(...xs) - 0.95, Math.max(...xs) + 0.95], y: [Math.min(...ys) - 0.85, Math.max(...ys) + 0.8] }, alto: o.alto || 262,
      puntos, segmentos: [{ de: 'A', a: 'B' }, { de: 'B', a: 'C' }, { de: 'C', a: 'A' }], angulos };
    if (o.extra) o.extra(figura, { A, B, C });
    return { objeto: 'angulos', figura };
  }
  // La «mariposa»: AD y BC se cortan en O; triángulos AOB (a la izquierda) y COD (a la derecha), con m∠AOB = m∠COD.
  // rot = { A, B, C, D, O, O2: { texto, color } } (O: ∠AOB; O2: ∠COD).
  function figM(a, b, c, d, rot = {}, o = {}) {
    // Lados por ley de senos con AB = CD = 3,1: OA = AB·sen(b)/sen(φ), OB = AB·sen(a)/sen(φ), OC = CD·sen(d)/sen(φ), OD = CD·sen(c)/sen(φ).
    const phi = 180 - a - b, s = Math.sin(phi * RAD);
    const OA = 3.1 * Math.sin(b * RAD) / s, OB = 3.1 * Math.sin(a * RAD) / s, OC = 3.1 * Math.sin(d * RAD) / s, OD = 3.1 * Math.sin(c * RAD) / s;
    const P = { O: [0, 0], A: U.polar([0, 0], OA, 180 - phi / 2), B: U.polar([0, 0], OB, 180 + phi / 2), C: U.polar([0, 0], OC, phi / 2), D: U.polar([0, 0], OD, -phi / 2) };
    const dirDe = id => U.grados(Math.atan2(P[id][1], P[id][0]));
    const puntos = Object.entries(P).map(([id, p]) => ({ id, x: p[0], y: p[1], rotulo: id, lado: id === 'O' ? 90 : dirDe(id), sinPunto: true }));
    const LADOS = { A: ['B', 'O'], B: ['O', 'A'], C: ['O', 'D'], D: ['C', 'O'], O: ['A', 'B'], O2: ['C', 'D'] };
    const med = { A: a, B: b, C: c, D: d, O: phi, O2: phi };
    // Un solo arco en cada ángulo: en la mariposa hay cuatro medidas de afuera y los arcos 1, 2 y 3 no alcanzan.
    const ARC = { A: 1, B: 1, C: 1, D: 1, O: 1, O2: 1 };
    const angulos = Object.keys(LADOS).filter(v => rot[v]).map(v => Object.assign({ en: v === 'O2' ? 'O' : v, de: LADOS[v][0], a: LADOS[v][1], radio: 20, holgura: 6, mide: med[v], marcas: rot[v].marcas || ARC[v] },
      rot[v].texto !== undefined ? { texto: rot[v].texto } : {}, rot[v].color ? { color: rot[v].color } : {}));
    const xs = Object.values(P).map(p => p[0]), ys = Object.values(P).map(p => p[1]);
    return { objeto: 'angulos', figura: { alt: o.alt || `Los segmentos AD y BC se cortan en O y forman dos triángulos, AOB y COD, opuestos por el vértice O.`,
      vista: { x: [Math.min(...xs) - 0.75, Math.max(...xs) + 0.75], y: [Math.min(...ys) - 0.7, Math.max(...ys) + 0.7] }, alto: o.alto || 262,
      puntos, segmentos: [{ de: 'A', a: 'D' }, { de: 'B', a: 'C' }, { de: 'A', a: 'B' }, { de: 'C', a: 'D' }], angulos } };
  }

  function rotulosPropios(F, k = 0.72) {
    const { rot, vertice } = PO.rotulos(F), ids = [...new Set((F.figura.angulos || []).map(q => q.en))];
    return rot.every(z => {
      const cx = (z.caja.x0 + z.caja.x1) / 2, cy = (z.caja.y0 + z.caja.y1) / 2, d = id => { const v = vertice(id); return Math.hypot(cx - v[0], cy - v[1]); };
      return ids.every(id => id === z.an.en || d(z.an.en) < k * d(id));
    });
  }

  // ---------- Idea 1 (rehecha, 18 nov): suma de ángulos interiores ----------
  // Objeto de la primera pantalla: un triángulo de cartulina sobre la mesa, con una regla al lado (geo-objeto, cartulina;
  // dibujo de prueba). En «Lee», el tijeral de un techo (geo-objeto, tijeral).
  // Cambia: la punta A (los ángulos en B y C, de 5° en 5°). · Permanece: la base BC. · Progresa: los tres ángulos, que
  // siempre suman 180°. · Se reserva: dos ángulos obtusos (la predicción) y por qué pasa siempre (la paralela por A, en
  // «Mira»). · Debe verse: las tres esquinas juntas sobre el borde recto de la regla no dejan hueco ni se montan.
  // Colores (regla de la unidad, arriba): los tres interiores en carmín con 1, 2 y 3 arcos; en los ejercicios, lo dado
  // en carmín y lo pedido con «?» en tinta.
  // Errores (hipótesis, sin medir): GE-TRI4 (propuesta) cree que un tercer ángulo chico arregla dos obtusos; GE-TRI5
  // (propuesta) confunde la suma de los tres con una vuelta; GE-ANG1 (Segmentos) cree que el ángulo crece con el tamaño;
  // nuevos (18 nov): GE-TRI6 resta de 180° uno solo de los dos ángulos, GE-TRI7 da la suma de los dos y no lo que falta,
  // GE-TRI8 clasifica con los dos ángulos que ve sin calcular el tercero, GE-TRI9 llama rectángulo a uno que no tiene 90°,
  // GE-TRI10 llama obtusángulo a uno sin ángulo obtuso, GE-TRI11 cree que falta un dato, GE-TRI12 reparte 180° en tres
  // partes iguales, GE-TRI13 da un ángulo en vez de x, GE-TRI14 se queda en x cuando se pide el ángulo, GE-TRI15 pasa mal
  // los números al despejar, GE-TRI19 olvida juntar los números sueltos, GE-TRI16 copia el ángulo de la misma posición en la mariposa, GE-TRI17 suma los cuatro
  // ángulos de la mariposa como si fueran un triángulo, GE-TRI18 olvida el ángulo en O y completa 180° con un vecino;
  // GE-RAZ1 y GE-RAZ2 vienen de Segmentos (la otra parte, se queda en k).
  const BJ = 60, CJ = 50;                                   // el juego empieza con 70°, 60° y 50°
  const VJ = { x: [-0.9, 6.9], y: [-1.55, 6.15] };          // vista fija: la punta sigue al dedo (B y C de 40° a 60°)
  const AJ = (b, c) => ({ A: { texto: `${180 - b - c}°`, color: 'h' }, B: { texto: `${b}°`, color: 'h' }, C: { texto: `${c}°`, color: 'h' } });
  const figJ = (b, c) => ({ objeto: 'cartulina', b, c, angulos: AJ(b, c), vista: VJ, alto: 270, radio: 16, letraA: 0.25 });
  // «Mira»: la cartulina del juego (70°, 60° y 50°): se marcan los cortes, las esquinas van a la regla, vuelve la
  // cartulina entera con la paralela por A y, al final, las copias de B y C (alternos internos).
  const figMira = () => ({ objeto: 'cartulina', b: BJ, c: CJ, angulos: AJ(BJ, CJ), cortes: 1, recorte: 2, restaura: 3, paralela: 3, copias: 4 });
  // Predicción: las dos esquinas de Rosa, sueltas sobre la mesa; al revelar, juntas sobre el borde de la regla, se montan.
  const figPred = junta => ({ objeto: 'cartulina', triangulo: false, piezas: junta
    ? [{ en: 'regla', de: 80, a: 180, texto: '100°', marcas: 1 }, { en: 'regla', de: 0, a: 95, texto: '95°', marcas: 2 }]
    : [{ en: [0.3, 0.3], de: 15, a: 115, texto: '100°', marcas: 1 }, { en: [4.2, 0.1], de: 40, a: 135, texto: '95°', marcas: 2 }] });

  // Ejemplos resueltos de «Suma de ángulos interiores» (pestaña «Ejemplos»; molde §3). Cuentas rehechas con un script
  // aparte, sin el código de la unidad (scratchpad e4-geo/cuentas-idea1.js): 180 − 75 − 45 = 60; 180 − 90 − 38 = 52;
  // 180 − 35 − 35 = 110; 25 + 60 + 95 = 180, el mayor 95 > 90 (obtusángulo); 50 + 60 + 80 = 190 ≠ 180; 9k = 180, k = 20,
  // 4k = 80; 6x = 180, x = 30, 3x − 20 = 70; 3·m∠A = 180 − 66 = 114, m∠A = 38, m∠B = 76; m∠C = 180 − 130 = 50, m∠B =
  // 120 − 50 = 70; 180 − 48 − 37 = 95 (obtusángulo); 65 + 50 = 2x + x + 25, x = 30 (C = 60, D = 55, O = 65 en los dos);
  // 2k + 5k = 126, k = 18, 36 y 90 (rectángulo); 180 − 5x > 90, x < 18, el mayor entero 17; 3x + 2x + 15 = 50 + 65,
  // x = 20, m∠AOB = 180 − 60 − 55 = 65 (= 180 − 50 − 65); ∠ADB = 180 − 40 − 35 = 105, ∠ADC = 75, m∠DAC = 180 − 75 − 60
  // = 45 (y 35 + 45 = 80 = 180 − 40 − 60). En la mariposa, las expresiones con x van solo en el texto (la figura marca el
  // arco): rótulos largos en esos triángulos quedaban lejos de su vértice y no se sabía de quién eran. La figura muestra el planteamiento: lo que cada dato marca por sí solo; lo pedido con «?» en
  // tinta; ningún dibujo trae la respuesta.
  const EJ1 = [];
  // Nivel 1: un paso.
  EJ1.push({ nivel: 1, titulo: 'El ángulo que falta',
    figura: fig({ objeto: 'cartulina', b: 45, c: 60, angulos: { A: { texto: '75°', color: 'h' }, B: { texto: '45°', color: 'h' }, C: { texto: '?' } } }),
    enunciado: 'Ana recortó un triángulo de cartulina. Midió m∠A = 75° y m∠B = 45°. ¿Cuánto mide el ángulo C?',
    datos: [D_SUMA],
    solucion: [{ texto: 'Los tres suman 180°: a 180° le quito los dos que conozco.', ecuacion: junto(['m∠C = 180° − 75° − 45° = ', dF('60°')]) }],
    respuesta: ['m∠C = ', dF('60°')] });
  EJ1.push({ nivel: 1, titulo: 'Con un ángulo recto',
    figura: fig(figT(52, 90, { A: { texto: '38°', color: 'h' }, B: { texto: '?' }, C: { color: 'h' } })),
    enunciado: 'En el triángulo ABC, el ángulo C es recto y m∠A = 38°. ¿Cuánto mide el ángulo B?',
    datos: [D_SUMA, D_RECTO],
    solucion: [{ texto: 'El recto vale 90°. A 180° le quito 90° y 38°:', ecuacion: junto(['m∠B = 180° − 90° − 38° = ', dF('52°')]) }],
    respuesta: ['m∠B = ', dF('52°')] });
  EJ1.push({ nivel: 1, titulo: 'La punta del tijeral',
    figura: fig({ objeto: 'tijeral', b: 35, c: 35, angulos: { A: { texto: '?' }, B: { texto: '35°', color: 'h', marcas: 2 }, C: { texto: '35°', color: 'h', marcas: 2 } } }),
    enunciado: 'En un tijeral, cada viga inclinada forma 35° con la viga de abajo. ¿Cuánto mide el ángulo de arriba, entre las dos vigas inclinadas?',
    datos: [D_SUMA_O],
    solucion: [{ texto: 'Los tres ángulos del tijeral suman 180°; abajo hay dos de 35°.', ecuacion: junto(['180° − 35° − 35° = ', dF('110°')]) }],
    respuesta: ['El ángulo de arriba mide ', dF('110°')] });
  EJ1.push({ nivel: 1, titulo: '¿Qué clase de triángulo?',
    enunciado: 'Los ángulos de un triángulo miden 25°, 60° y 95°. ¿Qué clase de triángulo es, por sus ángulos?',
    datos: [D_CLASES],
    solucion: [{ texto: 'Me fijo en el ángulo mayor: 95° pasa de 90°, así que es obtuso.', ecuacion: junto('95° > 90°') }],
    respuesta: ['Es ', dF('obtusángulo')] });
  EJ1.push({ nivel: 1, titulo: '¿Son de un mismo triángulo?',
    figura: fig({ objeto: 'cartulina', triangulo: false, piezas: [{ en: [-0.3, 0], de: 65, a: 115, texto: '50°', marcas: 1 }, { en: [2.75, 0.25], de: 50, a: 110, texto: '60°', marcas: 2 }, { en: [5.85, 0], de: 60, a: 140, texto: '80°', marcas: 3 }] }),
    enunciado: 'Luis tiene tres esquinas recortadas de cartulina: de 50°, 60° y 80°. ¿Pueden ser las tres esquinas de un mismo triángulo?',
    datos: [D_SUMA_O],
    solucion: [{ texto: 'Sumo las tres esquinas:', ecuacion: junto('50° + 60° + 80° = 190°') }, { texto: 'Se pasan de 180°: juntas sobre una regla, se montarían.' }],
    respuesta: [dF('No'), ': suman 190°, no 180°'] });
  // Nivel 2: dos pasos.
  EJ1.push({ nivel: 2, titulo: 'Ángulos en razón 2 : 3 : 4',
    figura: fig(figT(60, 80, { A: { texto: '2k', color: 'h' }, B: { texto: '3k', color: 'h', marcas: 2 }, C: { texto: '4k', color: 'h', marcas: 3 } }, { alt: 'Triángulo ABC con ángulos 2k en A, 3k en B y 4k en C.' })),
    enunciado: 'Los ángulos A, B y C de un triángulo están en razón 2 : 3 : 4. ¿Cuánto mide el ángulo mayor?',
    datos: [D_SUMA, 'Razón 2 : 3 : 4: los ángulos miden 2k, 3k y 4k grados, con k los grados de una parte.'],
    solucion: [
      { texto: 'Las tres partes juntas son los 180°:', ecuacion: [junto('2k + 3k + 4k = 180'), '   →   ', junto('9k = 180'), '   →   ', junto('k = 20')] },
      { texto: 'El mayor tiene 4 partes de 20°:', ecuacion: junto(['m∠C = 4 · 20° = ', dF('80°')]) },
    ],
    respuesta: ['El mayor mide ', dF('80°')] });
  EJ1.push({ nivel: 2, titulo: 'Tres ángulos con x',
    figura: fig(figT(60, 50, { A: { texto: '3x − 20°', color: 'h' }, B: { texto: '2x', color: 'h', marcas: 2 }, C: { texto: 'x + 20°', color: 'h', marcas: 3 } }, { alt: 'Triángulo ABC con ángulos 3x − 20° en A, 2x en B y x + 20° en C.' })),
    enunciado: 'En el triángulo ABC, m∠A = 3x − 20°, m∠B = 2x y m∠C = x + 20°. ¿Cuánto mide el ángulo A?',
    datos: [D_SUMA],
    solucion: [
      { texto: 'Sumo las tres expresiones e igualo a 180°; los 20° se cancelan:', ecuacion: [junto('3x − 20° + 2x + x + 20° = 180°'), '   →   ', junto('6x = 180'), '   →   ', junto('x = 30')] },
      { texto: 'Reemplazo x en el ángulo A:', ecuacion: junto(['m∠A = 3 · 30 − 20° = ', dF('70°')]) },
    ],
    respuesta: ['m∠A = ', dF('70°')] });
  EJ1.push({ nivel: 2, titulo: 'Uno es el doble de otro',
    figura: fig(figT(76, 66, { A: {}, B: { texto: '?' }, C: { texto: '66°', color: 'h', marcas: 3 } })),
    enunciado: 'En el triángulo ABC, m∠C = 66° y el ángulo B mide el doble que el ángulo A. ¿Cuánto mide el ángulo B?',
    datos: [D_SUMA],
    solucion: [
      { texto: 'A y B se reparten lo que deja C, y B son dos partes de A: tres partes.', ecuacion: [junto('3 · m∠A = 180° − 66° = 114°'), '   →   ', junto('m∠A = 38°')] },
      { texto: 'B es el doble:', ecuacion: junto(['m∠B = 2 · 38° = ', dF('76°')]) },
    ],
    respuesta: ['m∠B = ', dF('76°')] });
  EJ1.push({ nivel: 2, titulo: 'Dos sumas de a dos',
    figura: fig(figT(70, 50, { A: {}, B: { texto: '?', marcas: 2 }, C: { marcas: 3 } })),
    enunciado: 'En el triángulo ABC, m∠A + m∠B = 130° y m∠B + m∠C = 120°. ¿Cuánto mide el ángulo B?',
    datos: [D_SUMA],
    solucion: [
      { texto: 'Si A y B suman 130°, para 180° falta C:', ecuacion: junto('m∠C = 180° − 130° = 50°') },
      { texto: 'Con C, saco B de la segunda suma:', ecuacion: junto(['m∠B = 120° − 50° = ', dF('70°')]) },
    ],
    respuesta: ['m∠B = ', dF('70°')] });
  EJ1.push({ nivel: 2, titulo: 'La clase, sin ver el tercero',
    enunciado: 'En el triángulo ABC, m∠A = 48° y m∠B = 37°. ¿Qué clase de triángulo es, por sus ángulos?',
    datos: [D_SUMA, D_CLASES],
    solucion: [
      { texto: 'Los dos que conozco son agudos, pero falta el tercero:', ecuacion: junto('m∠C = 180° − 48° − 37° = 95°') },
      { texto: 'El ángulo C pasa de 90°: es obtuso.' },
    ],
    respuesta: ['Es ', dF('obtusángulo')] });
  // Nivel 3: tipo examen.
  EJ1.push({ nivel: 3, titulo: 'La mariposa',
    figura: fig(figM(65, 50, 60, 55, { A: { texto: '65°', color: 'h' }, B: { texto: '50°', color: 'h' }, C: { color: 'h' }, D: { color: 'h' } })),
    enunciado: 'Los segmentos AD y BC se cortan en O. m∠A = 65°, m∠B = 50°, m∠C = 2x y m∠D = x + 25°. ¿Cuánto vale x?',
    datos: [D_SUMA_O, D_OPUESTOS],
    solucion: [
      { texto: 'Los ángulos en O son opuestos por el vértice: miden igual. En cada triángulo, lo que no es de O suma lo mismo:', ecuacion: junto('65° + 50° = 2x + x + 25°') },
      { texto: 'Despejo x:', ecuacion: [junto('3x = 90'), '   →   ', junto(['x = ', dF('30')])] },
    ],
    respuesta: ['x = ', dF('30')] });
  EJ1.push({ nivel: 3, titulo: 'Razón y clase',
    enunciado: 'Dos ángulos de un triángulo están en razón 2 : 5, y el tercero mide 54°. ¿Qué clase de triángulo es, por sus ángulos?',
    datos: [D_SUMA_O, 'Razón 2 : 5: los dos ángulos miden 2k y 5k grados.', D_CLASES],
    solucion: [
      { texto: 'Los dos se reparten lo que deja el de 54°:', ecuacion: [junto('2k + 5k = 180 − 54 = 126'), '   →   ', junto('k = 18')] },
      { texto: 'Miden 2 · 18° = 36° y 5 · 18° = 90°: uno es recto.' },
    ],
    respuesta: ['Es ', dF('rectángulo')] });
  EJ1.push({ nivel: 3, titulo: 'El mayor valor entero de x',
    enunciado: 'En el triángulo ABC, m∠A = 2x y m∠B = 3x, y el ángulo C es obtuso. ¿Cuál es el mayor valor entero de x?',
    datos: [D_SUMA, 'Un ángulo obtuso mide más de 90° y menos de 180°.'],
    solucion: [
      { texto: 'El ángulo C es lo que falta para 180°, y tiene que pasar de 90°:', ecuacion: [junto('m∠C = 180° − 5x > 90°'), '   →   ', junto('5x < 90')] },
      { texto: 'x tiene que ser menor que 18; con 18, C mediría justo 90°.', ecuacion: junto(['x < 18   →   x = ', dF('17')]) },
    ],
    respuesta: ['x = ', dF('17')] });
  EJ1.push({ nivel: 3, titulo: 'La mariposa: el ángulo en O',
    figura: fig(figM(60, 55, 50, 65, { A: { color: 'h' }, B: { color: 'h' }, C: { texto: '50°', color: 'h' }, D: { texto: '65°', color: 'h' }, O: { texto: '?' } })),
    enunciado: 'Los segmentos AD y BC se cortan en O. m∠A = 3x, m∠B = 2x + 15°, m∠C = 50° y m∠D = 65°. ¿Cuánto mide el ángulo AOB?',
    datos: [D_SUMA_O, D_OPUESTOS],
    solucion: [
      { texto: 'Opuestos por el vértice: los dos ángulos en O miden igual, así que A y B suman lo mismo que C y D:', ecuacion: [junto('3x + 2x + 15° = 50° + 65°'), '   →   ', junto('x = 20')] },
      { texto: 'Entonces m∠A = 60° y m∠B = 55°. En el triángulo AOB:', ecuacion: junto(['m∠AOB = 180° − 60° − 55° = ', dF('65°')]) },
    ],
    respuesta: ['m∠AOB = ', dF('65°')] });
  EJ1.push({ nivel: 3, titulo: 'Un segmento parte el triángulo',
    figura: fig(figT(40, 60, { B: { texto: '40°', color: 'h', marcas: 2 }, C: { texto: '60°', color: 'h', marcas: 3 } }, { alt: 'Triángulo ABC con el punto D en BC y el segmento AD.', extra: (F, V) => {
      const tAB = Math.atan2(V.B[1] - V.A[1], V.B[0] - V.A[0]), t = tAB + 35 * RAD, D = [V.A[0] - V.A[1] * Math.cos(t) / Math.sin(t), 0];
      F.puntos.push({ id: 'D', x: D[0], y: 0, rotulo: 'D', lado: -90, sinPunto: true });
      F.segmentos.push({ de: 'A', a: 'D' });
      F.angulos.push({ en: 'A', de: 'B', a: 'D', texto: '35°', color: 'h', mide: 35, radio: 22, holgura: 6 }, { en: 'A', de: 'D', a: 'C', texto: '?', mide: 45, radio: 30, holgura: 6 });
    } })),
    enunciado: 'En el triángulo ABC, D está en el lado BC. m∠B = 40°, m∠C = 60° y m∠BAD = 35°. ¿Cuánto mide el ángulo DAC?',
    datos: [D_SUMA_O, D_ADY],
    solucion: [
      { texto: 'En el triángulo ABD:', ecuacion: junto('m∠ADB = 180° − 40° − 35° = 105°') },
      { texto: 'ADB y ADC son adyacentes en la recta BC:', ecuacion: junto('m∠ADC = 180° − 105° = 75°') },
      { texto: 'En el triángulo ADC:', ecuacion: junto(['m∠DAC = 180° − 75° − 60° = ', dF('45°')]) },
    ],
    respuesta: ['m∠DAC = ', dF('45°')] });

  // «Ahora tú»: cinco tipos, uno por semilla (s % 5); todos con sus datos y cuatro opciones de errores distintos.
  const LETRAS = ['A', 'B', 'C'];
  // Tres ángulos múltiplos de 5, de 30° a 110°, distintos, que suman 180°.
  function tres(r, lo = 30, hi = 110) {
    // (Distintos: los arcos 1, 2 y 3 dicen que son tres medidas distintas.)
    for (;;) { const a = 5 * r.ent(lo / 5, hi / 5), b = 5 * r.ent(lo / 5, hi / 5), c = 180 - a - b; if (c >= lo && c <= hi && a !== b && b !== c && a !== c) return [a, b, c]; }
  }
  // Una figura sirve si sus rótulos caben (geo-objeto) y cada uno queda claramente más cerca de su vértice que de
  // cualquier otro vértice con ángulo marcado (en un ángulo cerrado el rótulo se aleja; si llega al medio del triángulo, ya no se sabe de quién es).
  const cabe = F => PO.escenaCabe(F) && rotulosPropios(F);
  // Tipo 0: el tercer ángulo.
  function casoTercero(r) {
    let v, pide, F;
    for (let k = 0; ; k++) {
      v = tres(r); pide = r.ent(0, 2);
      const rot = {}; LETRAS.forEach((L, i) => { rot[L] = i === pide ? { texto: '?', marcas: i + 1 } : { texto: `${v[i]}°`, color: 'h', marcas: i + 1 }; });
      F = figT(v[1], v[2], rot);
      if (cabe(F) || k > 200) break;
    }
    const L = LETRAS[pide], [p, q] = LETRAS.map((x, i) => i).filter(i => i !== pide).map(i => v[i]), dados = LETRAS.filter((x, i) => i !== pide);
    return {
      pregunta: `En el triángulo ABC, m∠${dados[0]} = ${p}° y m∠${dados[1]} = ${q}°. ¿Cuánto mide el ángulo ${L}?`,
      datos: [D_SUMA],
      dibujo: fig(F),
      opciones: opciones(v[pide], [
        { id: 'uno', valor: 180 - p, error: 'GE-TRI6', siFuera: 'Restar de 180° está bien; pero hay que quitar los dos ángulos que conoces, no uno.' },
        { id: 'suma', valor: p + q, error: 'GE-TRI7', siFuera: 'Sumar los dos que conoces es el primer paso; el tercero es lo que les falta para 180°.' },
        { id: 'vuelta', valor: 360 - p - q, error: 'GE-TRI5', siFuera: 'Una vuelta mide 360°, cierto; pero los tres ángulos de un triángulo suman 180°.' },
      ], gr),
      solucion: { texto: 'Lo que les falta a los dos para 180°.', ecuacion: junto(`m∠${L} = 180° − ${p}° − ${q}° = ${v[pide]}°`) },
    };
  }
  // Tipo 1: la clase por sus ángulos, sin figura (a escala, el dibujo la diría).
  const CLASE = { acu: 'Acutángulo', rect: 'Rectángulo', obt: 'Obtusángulo' };
  function casoClase(r) {
    const t = r.de(['acu', 'rect', 'obt']);
    const x = t === 'rect' ? 90 : t === 'acu' ? r.ent(60, 86) : r.ent(94, 130);
    let p; do { p = r.ent(15, 89); } while (180 - x - p < 15 || 180 - x - p > 89 || p === 180 - x - p);
    const q = 180 - x - p;
    const ops = [
      { id: 'acu', texto: CLASE.acu, error: 'GE-TRI8', siFuera: 'Los dos que conoces son agudos, es cierto; falta mirar el tercer ángulo.' },
      { id: 'rect', texto: CLASE.rect, error: 'GE-TRI9', siFuera: 'Sería rectángulo con un ángulo de 90°; calcula el tercero y compáralo con 90°.' },
      { id: 'obt', texto: CLASE.obt, error: 'GE-TRI10', siFuera: 'Sería obtusángulo si el tercero pasara de 90°; calcula cuánto mide.' },
      { id: 'nose', texto: 'No se sabe sin el tercer ángulo', error: 'GE-TRI11', siFuera: 'Faltaría un dato si la suma no fuera fija; con 180°, el tercero sale solo.' },
    ].map(o => (o.id === t ? { id: 'c', texto: o.texto, correcta: true } : o));
    return {
      pregunta: `En el triángulo ABC, m∠A = ${p}° y m∠B = ${q}°. ¿Qué clase de triángulo es, por sus ángulos?`,
      datos: [D_SUMA, D_CLASES],
      opciones: ops,
      solucion: { texto: `El tercero mide ${x}°: ${t === 'rect' ? 'es recto' : t === 'obt' ? 'pasa de 90°' : 'los tres son agudos'}.`, ecuacion: junto(`m∠C = 180° − ${p}° − ${q}° = ${x}°`) },
    };
  }
  // Tipo 2: ángulos en razón (las razones dan ángulos enteros de 24° o más).
  const RAZONES = [[2, 3, 4], [3, 4, 5], [2, 3, 5], [1, 2, 3], [3, 5, 7], [4, 5, 6], [3, 4, 8], [5, 6, 7], [2, 3, 7], [4, 5, 9], [3, 5, 10], [4, 7, 9], [5, 7, 8], [3, 4, 11]];
  const kTexto = p => (p === 1 ? 'k' : `${p}k`);
  function casoRazon(r) {
    let raz, orden, F, k;
    for (let i = 0; ; i++) {
      raz = r.de(RAZONES); orden = r.de([[0, 1, 2], [1, 2, 0], [2, 0, 1], [0, 2, 1], [2, 1, 0], [1, 0, 2]]);
      k = 180 / (raz[0] + raz[1] + raz[2]);
      const v = orden.map(j => raz[j] * k), rot = {};
      LETRAS.forEach((L, j) => { rot[L] = { texto: kTexto(raz[orden[j]]), color: 'h', marcas: j + 1 }; });
      F = figT(v[1], v[2], rot, { alt: `Triángulo ABC con ángulos ${LETRAS.map((L, j) => `${kTexto(raz[orden[j]])} en ${L}`).join(', ')}.` });
      if (cabe(F) || i > 200) break;
    }
    const mayor = r() < 0.5, p = mayor ? raz[2] : raz[0], otra = mayor ? raz[0] : raz[2];
    const [x, y, z] = orden.map(j => raz[j]);
    return {
      pregunta: `Los ángulos A, B y C de un triángulo están en razón ${x} : ${y} : ${z}. ¿Cuánto mide el ángulo ${mayor ? 'mayor' : 'menor'}?`,
      datos: [D_SUMA, `Razón ${x} : ${y} : ${z}: los ángulos miden ${kTexto(x)}, ${kTexto(y)} y ${kTexto(z)} grados.`],
      dibujo: fig(F),
      opciones: opciones(p * k, [
        { id: 'k', valor: k, error: 'GE-RAZ2', siFuera: `Hallar k = ${k} está bien: es una sola parte, de ${k}°. Ese ángulo tiene ${p}.` },
        { id: 'otra', valor: otra * k, error: 'GE-RAZ1', siFuera: `Repartir en partes está bien; pero esa medida es la del ángulo ${mayor ? 'menor' : 'mayor'}.` },
        { id: 'iguales', valor: 60, error: 'GE-TRI12', siFuera: '60° saldría si los tres fueran iguales; aquí cada uno tiene distintas partes.' },
      ], gr),
      solucion: { texto: `Hay ${raz[0] + raz[1] + raz[2]} partes en 180°.`, ecuacion: [junto(`${raz[0] + raz[1] + raz[2]}k = 180`), '   →   ', junto(`k = ${k}`), '   →   ', junto(`${p} · ${k}° = ${p * k}°`)] },
    };
  }
  // Tipo 3: los tres ángulos con x; se pide x o un ángulo.
  function casoX(r) {
    for (let i = 0; i < 4000; i++) {
      const x = r.ent(8, 30), v = tres(r, 45, 95), a = [r.ent(1, 3), r.ent(1, 4), r.ent(1, 3)], b = v.map((m, j) => m - a[j] * x);
      if (b.some(z => Math.abs(z) > 40) || b.every(z => z === 0)) continue;
      const SA = a[0] + a[1] + a[2], SB = b[0] + b[1] + b[2];
      if (SB === 0) continue;
      const rot = {}; LETRAS.forEach((L, j) => { rot[L] = { texto: exp(a[j], b[j]), color: 'h', marcas: j + 1 }; });
      const F = figT(v[1], v[2], rot, { alt: `Triángulo ABC con ángulos ${LETRAS.map((L, j) => `${exp(a[j], b[j])} en ${L}`).join(', ')}.` });
      if (!cabe(F)) continue;
      const pideX = r() < 0.5, j = r.ent(0, 2), L = LETRAS[j];
      const ent = n => (Number.isInteger(n) && n > 0 ? n : NaN);
      const ec = [junto(`${SA}x ${SB > 0 ? '+' : '−'} ${Math.abs(SB)}° = 180°`), '   →   ', junto(`${SA}x = ${180 - SB}`), '   →   ', junto(`x = ${x}`)];
      const base = { pregunta: `En el triángulo ABC, m∠A = ${exp(a[0], b[0])}, m∠B = ${exp(a[1], b[1])} y m∠C = ${exp(a[2], b[2])}. ${pideX ? '¿Cuánto vale x?' : `¿Cuánto mide el ángulo ${L}?`}`,
        datos: [D_SUMA], dibujo: fig(F) };
      const ops = pideX ? opciones(x, [
        { id: 'angulo', valor: v[j], error: 'GE-TRI13', siFuera: `${v[j]}° es lo que mide el ángulo ${L}; piden x, el número de las expresiones.` },
        { id: 'vuelta', valor: ent((360 - SB) / SA), error: 'GE-TRI5', siFuera: 'Igualar la suma es la idea; pero los tres suman 180°, no 360°.' },
        { id: 'signo', valor: ent((180 + SB) / SA), error: 'GE-TRI15', siFuera: 'Igualar a 180° está bien; al pasar los números al otro lado cambia su signo.' },
        { id: 'sin', valor: ent(180 / SA), error: 'GE-TRI19', siFuera: 'Juntar las x está bien; faltó juntar también los números sueltos.' },
      ], NUM) : opciones(v[j], [
        { id: 'x', valor: x, error: 'GE-TRI14', siFuera: `Hallar x = ${x} está bien; falta reemplazarlo en el ángulo ${L}.` },
        { id: 'otro', valor: v[(j + 1) % 3], error: 'GE-RAZ1', siFuera: `Esa es la medida del ángulo ${LETRAS[(j + 1) % 3]}; piden el ángulo ${L}.` },
        { id: 'resto', valor: 180 - v[j], error: 'GE-TRI7', siFuera: `${180 - v[j]}° es lo que suman los otros dos; piden el ángulo ${L}.` },
      ], gr);
      if (ops.length < 4) continue;
      return Object.assign(base, { opciones: ops,
        solucion: { texto: pideX ? 'Los tres suman 180°: igualo y despejo x.' : `Despejo x y lo reemplazo en el ángulo ${L}.`, ecuacion: pideX ? ec : [...ec, '   →   ', junto(`m∠${L} = ${v[j]}°`)] } });
    }
    throw new Error('casoX sin caso');
  }
  // Tipo 4 (examen): la mariposa; se dan tres de los cuatro ángulos de afuera y se pide el cuarto.
  const VECINO = { A: 'B', B: 'A', C: 'D', D: 'C' }, ENFRENTE = { A: 'C', B: 'D', C: 'A', D: 'B' };
  function casoMariposa(r) {
    for (let i = 0; i < 400; i++) {
      const a = 5 * r.ent(7, 19), b = 5 * r.ent(7, 19), phi = 180 - a - b;
      if (phi < 40 || phi > 100) continue;
      const c = 5 * r.ent(7, 19), d = a + b - c;
      if (d < 35 || d > 95 || c === a) continue;
      const val = { A: a, B: b, C: c, D: d }, L = r.de(['A', 'B', 'C', 'D']);
      const rot = {}; for (const k of ['A', 'B', 'C', 'D']) rot[k] = k === L ? { texto: '?' } : { texto: `${val[k]}°`, color: 'h' };
      const F = figM(a, b, c, d, rot);
      if (!cabe(F)) continue;
      const dados = ['A', 'B', 'C', 'D'].filter(k => k !== L), suma3 = dados.reduce((s, k) => s + val[k], 0);
      const ops = opciones(val[L], [
        { id: 'enfrente', valor: val[ENFRENTE[L]], error: 'GE-TRI16', siFuera: 'Los dos triángulos se parecen; pero solo los ángulos en O son iguales, no los de afuera.' },
        { id: 'cuatro', valor: 180 - suma3 > 0 ? 180 - suma3 : 360 - suma3, error: 'GE-TRI17', siFuera: 'Sumar todo es tentador; pero son dos triángulos, cada uno con sus 180°.' },
        { id: 'vecino', valor: 180 - val[VECINO[L]], error: 'GE-TRI18', siFuera: 'Completar 180° está bien; en ese triángulo también cuenta el ángulo en O.' },
      ], gr);
      if (ops.length < 4) continue;
      const [p1, p2] = L === 'A' || L === 'B' ? ['C', 'D'] : ['A', 'B'];
      return {
        pregunta: `Los segmentos AD y BC se cortan en O. ${dados.map(k => `m∠${k} = ${val[k]}°`).join(', ').replace(/, ([^,]*)$/, ' y $1')}. ¿Cuánto mide el ángulo ${L}?`,
        datos: [D_SUMA_O, D_OPUESTOS],
        dibujo: fig(F),
        opciones: ops,
        solucion: { texto: 'Los ángulos en O son iguales: los dos de afuera de cada triángulo suman lo mismo.', ecuacion: junto(`m∠${L} = ${val[p1]}° + ${val[p2]}° − ${val[VECINO[L]]}° = ${val[L]}°`) },
      };
    }
    throw new Error('casoMariposa sin caso');
  }

  const suma = {
    id: 'suma-de-angulos',
    titulo: 'Suma de ángulos interiores',
    pregunta: '¿Cuánto suman los ángulos de cualquier triángulo?',
    temas: ['Suma de ángulos internos y ángulo externo', 'Clasificación'],
    pieza: GO,
    aprendizaje: 'Los tres ángulos interiores de un triángulo suman 180°, sea cual sea su forma; por eso solo uno puede ser recto u obtuso.',
    actividad: 'Mover la punta de un triángulo de cartulina y comparar lo que suman sus tres ángulos.',
    // Lee: el tijeral, vértice, lado, ángulo interior y m∠, y las clases por ángulos. No dice cuánto suman ni que solo uno
    // puede ser obtuso (eso es el juego y la predicción).
    lee: {
      tarjetas: [
        { titulo: 'El tijeral de un techo', texto: 'Las vigas que sostienen un techo de calamina se arman en triángulos, llamados tijerales. Tres vigas clavadas en sus puntas no se deforman mientras sus lados no cambien de largo. Por eso los techos se arman con triángulos.',
          pieza: GO, dibujo: fig({ objeto: 'tijeral', b: 30, c: 30, alt: 'Tijeral de un techo: dos vigas inclinadas y una horizontal, clavadas en sus puntas, forman un triángulo; encima va la calamina.' }) },
        { titulo: 'Vértices, lados y ángulos', texto: 'Cada punta de la cartulina es un vértice: A, B y C. Sus lados son AB, BC y CA, y el triángulo se nombra △ABC. Entre dos lados vecinos queda un ángulo interior. m∠A se lee «la medida del ángulo A».',
          pieza: GO, dibujo: fig({ objeto: 'cartulina', b: BJ, c: CJ, angulos: { A: null, B: null, C: null } }) },
        { titulo: 'Tres clases por sus ángulos', texto: 'Por sus ángulos, un triángulo es acutángulo si sus tres ángulos son agudos, rectángulo si uno es recto (90°) y obtusángulo si uno es obtuso, de más de 90°. Los arcos dicen cuál es cuál: uno en A, dos en B y tres en C.',
          pieza: GO, dibujo: fig({ objeto: 'cartulina', b: BJ, c: CJ, angulos: { A: { color: 'h' }, B: { color: 'h' }, C: { color: 'h' } } }) },
        { titulo: 'Qué mirar al jugar', texto: 'Vas a mover la punta A; la base BC queda quieta. Arma triángulos bien distintos: uno alto y uno bajo y ancho. Mira los tres ángulos de cada uno y compara lo que suman.' },
      ],
    },
    ejemplos: EJ1,
    juega: {
      pieza: GO,
      consigna: 'Recortaste un triángulo de cartulina y lo pusiste sobre la mesa, junto a una regla. La base BC no se mueve.',
      mision: {
        texto: 'Mueve la punta A hasta que su ángulo mida lo mismo que los otros dos juntos.',
        logrado: v => 180 - v.b - v.c === v.b + v.c,
        bien: 'Listo: m∠A = 90°, lo mismo que m∠B + m∠C. Los tres juntos, 180°.',
      },
      voz: 'Estira la cartulina. ¿Qué cambia y qué se queda igual?',
      leyenda: [
        { s: 'A, B, C', t: 'las puntas de la cartulina; A se mueve' },
        { s: 'm∠A', t: 'la medida del ángulo en A' },
        { s: dH('carmín'), t: 'los tres ángulos de adentro' },
        { s: 'arcos', t: 'A uno, B dos y C tres' },
      ],
      controles: [
        { id: 'b', etiqueta: 'm∠B, el ángulo en B', min: 40, max: 60, paso: 5, inicio: BJ, unidad: '°', decimales: 0, color: 'c-h' },
        { id: 'c', etiqueta: 'm∠C, el ángulo en C', min: 40, max: 60, paso: 5, inicio: CJ, unidad: '°', decimales: 0, color: 'c-h' },
      ],
      dibujo: v => ({ datos: figJ(v.b, v.c), estado: {} }),
      // Gesto directo: se agarra la punta A; su lugar decide los ángulos en B y en C (el lector los ajusta de 5° en 5°).
      arrastres: [{ id: 'punta-a', etiqueta: 'punta A de la cartulina: decide los ángulos en B y en C', color: 'c-h',
        donde: v => PO.aPantalla(figJ(v.b, v.c), vert(v.b, v.c).A),
        mover: (pt, v) => { const q = PO.aPlano(figJ(v.b, v.c), pt), p = [q[0], Math.max(q[1], 0.05)]; return { b: U.angulo([0, 0], [6, 0], p), c: U.angulo([6, 0], [0, 0], p) }; } }],
      // La relación entera, sin «·» entre dos igualdades.
      lectura: v => [junto('m∠A + m∠B + m∠C = '), dH(`${180 - v.b - v.c}°`), ' + ', dH(`${v.b}°`), ' + ', dH(`${v.c}°`), ' = 180°'],
      minimo: 4,
    },
    predice: {
      pregunta: 'Rosa dice que recortó un triángulo de cartulina con dos ángulos obtusos: uno de 100° y otro de 95°. ¿Puede ser?',
      datos: ['Un ángulo obtuso mide más de 90° y menos de 180°.'],
      voz: 'Piensa en lo que viste al estirar la cartulina.',
      opciones: [
        { id: 'c', texto: 'No: esos dos ya suman más de 180°', correcta: true },
        { id: 'chico', texto: 'Sí, si el tercer ángulo es muy pequeño', error: 'GE-TRI4', siFuera: 'Un tercer ángulo chico ayudaría si faltara poco; pero estos dos solos ya se pasan de 180°.' },
        { id: 'grande', texto: 'Sí, si la cartulina es bien grande', error: 'GE-ANG1', siFuera: 'Una cartulina grande tiene lados más largos, es cierto; sus ángulos no crecen con el tamaño.' },
        { id: 'vuelta', texto: 'Sí: 100° + 95° no llega a 360°', error: 'GE-TRI5', siFuera: 'Sumar los dos es buena idea; pero el tope de los tres es 180°, no una vuelta.' },
      ],
      dibujo: fig(figPred(false)),
      revelar: fig(figPred(true)),
      coincide: 'Coincide: 100° + 95° = 195°. Juntas sobre la regla, las dos esquinas se montan: no queda lugar para un tercer ángulo.',
      noCoincide: 'Revisemos: 100° + 95° = 195°, más que los 180° del borde recto. Juntas, se montan.',
    },
    mira: {
      pieza: GO,
      datos: figMira(),
      voz: 'Avanza paso a paso: las tres esquinas van a la regla.',
      pasos: [
        { estado: { corte: 0 }, texto: 'La cartulina del juego tiene ángulos de 70°, 60° y 50°.', ecuacion: junto(['m∠A = ', dH('70°'), ', m∠B = ', dH('60°'), ', m∠C = ', dH('50°')]) },
        { estado: { corte: 1 }, texto: 'Cortamos sus tres esquinas por las líneas punteadas.' },
        { estado: { corte: 2 }, texto: 'Juntamos las tres esquinas sobre el borde recto de la regla.', ecuacion: junto('m∠B + m∠A + m∠C') },
        { estado: { corte: 2 }, texto: 'No dejan hueco ni se montan: llenan un ángulo llano.', ecuacion: junto([dH('60°'), ' + ', dH('70°'), ' + ', dH('50°'), ' = 180°']) },
        { estado: { corte: 3 }, texto: '¿Pasa con todo triángulo? Por A trazamos una paralela a BC.', ecuacion: junto('paralela a BC por A') },
        { estado: { corte: 4 }, texto: 'Alternos internos: junto a A aparecen copias de B y de C.', ecuacion: junto('m∠B + m∠A + m∠C = 180°') },
        { estado: { corte: 4 }, texto: 'Con 100° y 95° ya se pasan de 180°: no cabe un tercero.', ecuacion: junto('100° + 95° = 195° > 180°') },
      ],
    },
    regla: {
      texto: 'En todo triángulo, los tres ángulos interiores suman 180°, sea cual sea su forma o su tamaño. Por eso, si uno es recto u obtuso, los otros dos son agudos.',
      ecuacion: [{ llave: [junto('m∠A + m∠B + m∠C')], nota: 'los tres interiores', color: 'c-h' }, junto(' = 180°')],
      condicion: 'el triángulo está en un plano. Un triángulo es acutángulo, rectángulo u obtusángulo: tiene a lo más un ángulo recto u obtuso.',
      voz: 'La paralela por A dice por qué no falla nunca.',
      // Dibujo propio (docs/teoria.md 4i): la cartulina con la paralela por A y las copias de B y C, sin las esquinas en
      // la regla (al lado de la cartulina entera, el rótulo de la esquina del medio se leía como de la base).
      dibujo: { pieza: GO, datos: { objeto: 'cartulina', b: BJ, c: CJ, angulos: AJ(BJ, CJ), paralela: 0 }, estado: {} },
    },
    // Así se resuelve: un recto con una diferencia, o un ángulo que es el doble de otro. «Ahora tú» pide otras cosas: el
    // tercer ángulo, la clase, la razón, la x y la mariposa.
    resuelve: {
      pieza: GO,
      generar(s) {
        const r = azar(s + 900);
        if (s % 2 === 0) {
          const d = 2 * r.ent(4, 20), a = (90 + d) / 2, b = (90 - d) / 2;
          const F = figT(b, 90, { A: { texto: '?' }, B: { marcas: 2 }, C: { color: 'h' } });
          return {
            enunciado: `En el triángulo ABC, el ángulo C es recto y el ángulo A mide ${d}° más que el ángulo B. ¿Cuánto mide el ángulo A?`,
            datos: [D_SUMA, D_RECTO],
            dibujo: fig(F),
            pasos: [
              { tipo: 'pide', texto: 'Piden m∠A, uno de los dos ángulos agudos.' },
              { tipo: 'datos', texto: `El cuadradito en C marca 90°, y A le gana a B por ${d}°.` },
              { tipo: 'regla', texto: 'Los tres ángulos suman 180°; el recto se lleva 90° y quedan 90° para A y B.', ecuacion: [junto('m∠A + m∠B + 90° = 180°'), '   →   ', junto('m∠A + m∠B = 90°')] },
              { tipo: 'cuentas', texto: `Si a 90° le quito los ${d}° de ventaja, quedan dos partes iguales a m∠B.`, ecuacion: [junto(`2 · m∠B = 90° − ${d}° = ${90 - d}°`), '   →   ', junto(`m∠B = ${b}°`), SEP, junto(['m∠A = ', `${b}° + ${d}° = `, dF(`${a}°`)])] },
              { tipo: 'sentido', texto: `Compruebo: ${a}° + ${b}° + 90° = 180°, y ${a}° − ${b}° = ${d}°. Cuadra.` },
            ],
            respuesta: ['m∠A = ', dF(`${a}°`)],
          };
        }
        const a = 6 * r.ent(6, 17), c = (180 - a) / 3, b = 2 * c;
        const F = figT(b, c, { A: { texto: `${a}°`, color: 'h' }, B: { texto: '?', marcas: 2 }, C: { marcas: 3 } });
        return {
          enunciado: `En el triángulo ABC, m∠A = ${a}° y el ángulo B mide el doble que el ángulo C. ¿Cuánto mide el ángulo B?`,
          datos: [D_SUMA],
          dibujo: fig(F),
          pasos: [
            { tipo: 'pide', texto: 'Piden m∠B.' },
            { tipo: 'datos', texto: `Tengo m∠A = ${a}°, y B es el doble de C.` },
            { tipo: 'regla', texto: 'Los tres ángulos suman 180°: lo que no es de A se reparte entre B y C.', ecuacion: junto(`m∠B + m∠C = 180° − ${a}° = ${180 - a}°`) },
            { tipo: 'cuentas', texto: 'B son dos partes y C una: en total, tres partes iguales.', ecuacion: [junto(`3 · m∠C = ${180 - a}°`), '   →   ', junto(`m∠C = ${c}°`), SEP, junto(['m∠B = 2 · ', `${c}° = `, dF(`${b}°`)])] },
            { tipo: 'sentido', texto: `Compruebo: ${a}° + ${b}° + ${c}° = 180°, y ${b}° es el doble de ${c}°.` },
          ],
          respuesta: ['m∠B = ', dF(`${b}°`)],
        };
      },
    },
    ahoraTu: {
      pieza: GO,
      voz: 'Busca primero qué ángulos conoces y cuál falta.',
      generar(s) { return conCuatro([casoTercero, casoClase, casoRazon, casoX, casoMariposa][s % 5], azar(s + 7)); },
    },
  };

  // ---------- Idea 2 (nueva, esqueleto para la fase 3): el ángulo exterior ----------
  // Lo que antes era la predicción de la idea 1. Se rehace en la fase 3 con la plaza y el mototaxi (propuesta §2 y §3).
  // Colores ya con la regla de la unidad: interiores en carmín y el exterior en turquesa (en los ejercicios, en carmín).
  const exterior = (b, c, o = {}) => {
    const { A } = porAngulos(b, c), a = 180 - b - c;
    return {
      alt: o.alt || `Triángulo con ${a}° en A, ${b}° en B y ${c}° en C; el exterior en C mide ${a + b}°`,
      vista: o.vista || { x: [-1, 9.6], y: [-0.8, Math.max(A[1], 2) + 0.9] },
      puntos: [{ id: 'A', x: A[0], y: A[1], rotulo: 'A', lado: 90 }, { id: 'B', x: 0, y: 0, rotulo: 'B', lado: -120 }, { id: 'C', x: 6, y: 0, rotulo: 'C', lado: -90 },
        { id: 'D', x: 9, y: 0, rotulo: 'D', lado: -90 }],
      segmentos: [{ de: 'A', a: 'B' }, { de: 'B', a: 'C' }, { de: 'C', a: 'A' }, { de: 'C', a: 'D', discontinua: true }],
      angulos: [
        { en: 'A', de: 'B', a: 'C', color: 'h', texto: o.sinA ? undefined : `${a}°` },
        { en: 'B', de: 'C', a: 'A', color: 'h', texto: o.sinB ? undefined : `${b}°` },
        ...(o.sinC ? [] : [{ en: 'C', de: 'A', a: 'B', color: 'h', texto: `${c}°` }]),
        { en: 'C', de: 'D', a: 'A', color: o.extColor === undefined ? 'i' : o.extColor, radio: 20, texto: o.extTexto },
      ],
    };
  };
  const exteriorIdea = {
    id: 'angulo-exterior',
    titulo: 'El ángulo exterior',
    pregunta: '¿Cuánto gira un mototaxi en cada esquina de una plaza triangular?',
    temas: ['Suma de ángulos internos y ángulo externo'],
    pieza: 'geo-figura',
    aprendizaje: 'Un ángulo exterior mide lo que suman los dos interiores que no están a su lado, y los tres exteriores dan una vuelta: 360°.',
    actividad: 'Cambiar los ángulos de un triángulo y comparar el ángulo de afuera con los de adentro.',
    lee: {
      tarjetas: [
        { titulo: 'Adentro y afuera', texto: 'Cada vértice tiene un ángulo interior, entre sus dos lados. Si prolongas un lado más allá del vértice, aparece un ángulo exterior, por fuera de la figura: el exterior en C es ∠ACD.' },
        { titulo: 'Qué mirar', texto: 'Cambia los ángulos en B y en C. Compara el ángulo exterior en C con los dos interiores que no lo tocan, A y B.' },
      ],
    },
    juega: {
      consigna: 'Prolongamos el lado BC más allá de C, hasta D. Cambia los ángulos en B y en C.',
      mision: { texto: 'Cambia los ángulos hasta que el exterior en C mida 120°.', logrado: v => 180 - v.c === 120, bien: 'Listo: 120°, lo mismo que m∠A + m∠B.' },
      voz: 'Mira el ángulo de afuera y los dos de adentro que no lo tocan.',
      leyenda: [{ s: dH('carmín'), t: 'los ángulos interiores' }, { s: dI('turquesa'), t: 'el ángulo exterior en C, ∠ACD' }],
      controles: [
        { id: 'b', etiqueta: 'm∠B', min: 30, max: 70, paso: 10, inicio: 70, unidad: '°', decimales: 0, color: 'c-h' },
        { id: 'c', etiqueta: 'm∠C', min: 30, max: 70, paso: 10, inicio: 50, unidad: '°', decimales: 0, color: 'c-h' },
      ],
      dibujo: v => ({ datos: exterior(v.b, v.c, { extTexto: `${180 - v.c}°` }), estado: {} }),
      lectura: v => [junto('m∠ACD = 180° − '), dH(`${v.c}°`), ' = ', dI(`${180 - v.c}°`), junto(' = m∠A + m∠B')],
      minimo: 3,
    },
    predice: {
      pregunta: 'En el triángulo, m∠A = 50° y m∠B = 70°. Prolongamos el lado BC más allá de C. ¿Cuánto mide el ángulo exterior en C?',
      datos: ['m∠A = 50°', 'm∠B = 70°'],
      voz: 'Piensa en el ángulo de afuera antes de verlo.',
      opciones: [
        { id: 'c', texto: '120°', correcta: true },
        { id: 'interior', texto: '60°', error: 'GE-TRI1', siFuera: '60° es el ángulo interior en C. El exterior es su vecino en la recta.' },
        { id: 'llano', texto: '180°', error: 'GE-TRI2', siFuera: '180° mide toda la recta prolongada. El exterior es solo la parte de afuera.' },
        { id: 'suma3', texto: '110°', error: 'GE-TRI3', siFuera: '110° vendría de restar 70° de 180°: sería el exterior en B, no en C.' },
      ],
      dibujo: { datos: exterior(70, 60, { sinC: true, extTexto: '?', extColor: null }), estado: {} },
      revelar: { datos: exterior(70, 60, { extTexto: '120°' }), estado: {} },
      coincide: 'Coincide: el exterior en C mide m∠A + m∠B = 120°.',
    },
    mira: {
      datos: exterior(70, 60, { extTexto: '120°' }),
      voz: 'El exterior y el interior en C forman una recta.',
      pasos: [
        { estado: { corte: 0 }, texto: 'El exterior en C y el interior en C son adyacentes: suman 180°.', ecuacion: junto(['m∠ACD = 180° − ', dH('60°'), ' = ', dI('120°')]) },
        { estado: { corte: 0 }, texto: 'Los tres interiores suman 180°: A y B también suman 120°.', ecuacion: junto([dH('50°'), ' + ', dH('70°'), ' = ', dI('120°')]) },
      ],
    },
    regla: {
      texto: 'Un ángulo exterior es igual a la suma de los dos ángulos interiores que no están a su lado.',
      ecuacion: [junto('m∠ACD = '), { llave: [junto('m∠A + m∠B')], nota: 'los dos lejanos', color: 'c-h' }],
      condicion: 'el exterior se forma con un lado y la prolongación del otro, en el mismo vértice.',
      voz: 'Primero ubica el exterior; después, los dos que no lo tocan.',
    },
    ahoraTu: {
      voz: 'Ubica cuál es interior y cuál exterior antes de operar.',
      generar(s) {
        const r = azar(s), a = 5 * r.ent(6, 16), b = 5 * r.ent(6, 16), c = 180 - a - b;
        return {
          pregunta: `En el triángulo ABC, m∠A = ${a}° y m∠B = ${b}°. ¿Cuánto mide el ángulo exterior en C?`,
          datos: ['Un ángulo exterior es el que forma un lado con la prolongación del otro.', D_SUMA],
          dibujo: { datos: exterior(b, c, { sinC: true, extTexto: '?', extColor: null }), estado: {} },
          opciones: opciones(a + b, [
            { id: 'interior', valor: c, error: 'GE-TRI1', siFuera: `${c}° es el ángulo interior en C; el exterior es su vecino.` },
            { id: 'otro-ext', valor: 180 - b, error: 'GE-TRI3', siFuera: `${180 - b}° es el exterior en B, no en C.` },
            { id: 'resta', valor: Math.abs(a - b), error: 'GE-TRI2', siFuera: 'Restar A y B no da un ángulo de la figura; el exterior los suma.' },
          ], gr),
          solucion: { texto: 'El exterior en C suma los interiores A y B.', ecuacion: junto(`m∠ACD = ${a}° + ${b}° = ${a + b}°`) },
        };
      },
    },
  };

  // ---------- Idea 3 (nueva, esqueleto para la fase 3): triángulo isósceles y equilátero ----------
  // El compás abierto sobre la hoja: patas AB = AC = 12 cm (naranja), la raya BC entre sus puntas (tinta), la abertura θ
  // en A y α en cada pata con la raya (carmín). La predicción del techo (3 m, 4 m y una viga de 6 m) se rehace en la fase 3
  // con su objeto; aquí va a escala con la geo-figura.
  const compas = (t, o = {}) => {
    const A = [0, 0], L = 12, B = U.polar(A, L, -90 - t / 2), C = U.polar(A, L, -90 + t / 2), al = (180 - t) / 2, bc = U.dist(B, C);
    return {
      alt: `Compás abierto ${t}°: patas de 12 cm, la raya entre sus puntas mide ${f(bc)} cm y cada pata forma ${f(al)}° con ella`,
      vista: { x: [-10.5, 10.5], y: [-12.6, 1.6] },
      puntos: [{ id: 'A', x: A[0], y: A[1], rotulo: 'A', lado: 90 }, { id: 'B', x: B[0], y: B[1], rotulo: 'B', lado: -150 }, { id: 'C', x: C[0], y: C[1], rotulo: 'C', lado: -30 }],
      segmentos: [{ de: 'A', a: 'B', color: 'o', grosor: 'variable', marcas: 1 }, { de: 'A', a: 'C', color: 'o', grosor: 'variable', marcas: 1 }, { de: 'B', a: 'C', texto: o.sinBC ? undefined : `${f(bc)} cm` }],
      angulos: [{ en: 'A', de: 'B', a: 'C', color: 'h', texto: `${t}°`, radio: 30 },
        { en: 'B', de: 'C', a: 'A', color: 'h', marcas: 2, texto: o.sinAlfa ? undefined : `${f(al)}°` }, { en: 'C', de: 'A', a: 'B', color: 'h', marcas: 2, texto: o.sinAlfa ? undefined : `${f(al)}°` }],
    };
  };
  // El techo de la predicción: AB = 3 m, AC = 4 m sobre la viga BC = 6 m.
  const techo = revela => {
    const x = (9 - 16 + 36) / 12, y = Math.sqrt(9 - x * x), A = [x, y], b = U.angulo([0, 0], [6, 0], A), c = U.angulo([6, 0], [0, 0], A);
    return {
      alt: `Techo a dos aguas con un lado de 3 m y otro de 4 m sobre una viga de 6 m${revela ? `: el lado corto forma ${f(b, 0)}° con la viga y el largo, ${f(c, 0)}°` : ''}`,
      vista: { x: [-0.8, 6.8], y: [-0.8, 2.6] },
      puntos: [{ id: 'A', x, y, rotulo: 'A', lado: 90 }, { id: 'B', x: 0, y: 0, rotulo: 'B', lado: -120 }, { id: 'C', x: 6, y: 0, rotulo: 'C', lado: -60 }],
      segmentos: [{ de: 'A', a: 'B', color: 'o', grosor: 'variable', texto: '3 m' }, { de: 'A', a: 'C', color: 'i', grosor: 'variable', texto: '4 m' }, { de: 'B', a: 'C', texto: '6 m' }],
      angulos: revela ? [{ en: 'B', de: 'C', a: 'A', color: 'h', texto: `≈ ${f(b, 0)}°`, radio: 40 }, { en: 'C', de: 'A', a: 'B', color: 'h', marcas: 2, texto: `≈ ${f(c, 0)}°`, radio: 50 }] : [],
    };
  };
  const isosceles = {
    id: 'isosceles',
    titulo: 'Triángulo isósceles y equilátero',
    pregunta: '¿Qué ángulos son iguales cuando dos lados son iguales?',
    temas: ['Triángulo isósceles y equilátero', 'Relación entre lados y ángulos', 'Clasificación'],
    pieza: 'geo-figura',
    aprendizaje: 'Frente a lados iguales hay ángulos iguales, y al revés; frente al lado mayor, el ángulo mayor. Equilátero: tres ángulos de 60°.',
    actividad: 'Abrir un compás de patas iguales y comparar los ángulos de abajo.',
    lee: {
      tarjetas: [
        { titulo: 'Tres clases por sus lados', texto: 'Por sus lados, un triángulo es escaleno si sus tres lados miden distinto, isósceles si dos lados son iguales y equilátero si los tres son iguales. Las rayitas iguales marcan lados iguales.' },
        { titulo: 'El compás', texto: 'Las patas del compás miden lo mismo, 12 cm. Al abrirlo, sus puntas y la bisagra forman un triángulo isósceles: las patas son los lados iguales.' },
      ],
    },
    juega: {
      consigna: 'Las dos patas del compás miden 12 cm. Abre y cierra el compás sobre la hoja.',
      mision: { texto: 'Abre el compás hasta que sus puntas queden tan lejos como mide cada pata.', logrado: v => v.t === 60, bien: 'Puntas a 12 cm: tres lados iguales y tres ángulos de 60°.' },
      voz: 'Mira los dos ángulos de abajo mientras abres.',
      leyenda: [{ s: 'θ', t: 'la abertura del compás, en A' }, { s: 'α', t: 'cada pata con la raya' }, { s: { v: 'c-o', t: 'naranja' }, t: 'las patas, de 12 cm' }],
      controles: [{ id: 't', etiqueta: 'θ, la abertura', min: 20, max: 80, paso: 10, inicio: 40, unidad: '°', decimales: 0, color: 'c-h' }],
      dibujo: v => ({ datos: compas(v.t), estado: {} }),
      lectura: v => [junto('θ = '), dH(`${v.t}°`), junto(' arriba; abajo, α = '), dH(`${f((180 - v.t) / 2)}°`), ' y ', dH(`${f((180 - v.t) / 2)}°`)],
      minimo: 3,
    },
    predice: {
      pregunta: 'Un techo a dos aguas tiene sus lados distintos: uno de 3 m y otro de 4 m, sobre una viga de 6 m. ¿Qué lado queda más inclinado, es decir, forma el ángulo mayor con la viga?',
      datos: ['AB = 3 m', 'AC = 4 m', 'BC = 6 m'],
      voz: 'Mira qué lado queda frente a cada ángulo.',
      opciones: [
        { id: 'c', texto: 'El lado corto, el de 3 m', correcta: true },
        { id: 'largo', texto: 'El lado largo: más lado, más ángulo', error: 'GE-ISO1', siFuera: 'Más lado sí da más ángulo, pero el de enfrente, no el que está pegado.' },
        { id: 'iguales', texto: 'Los dos igual: suben al mismo punto', error: 'GE-ISO2', siFuera: 'Serían iguales si los lados midieran igual; aquí uno es más corto.' },
        { id: 'falta', texto: 'No se sabe sin medir la altura del techo', error: 'GE-ISO3', siFuera: 'La altura ayudaría a calcular; pero los tres lados ya deciden la forma.' },
      ],
      dibujo: { datos: techo(false), estado: {} },
      revelar: { datos: techo(true), estado: {} },
      coincide: 'Coincide: el lado corto forma unos 36° con la viga y el largo, unos 26°.',
    },
    mira: {
      datos: compas(40),
      voz: 'Patas iguales, ángulos iguales.',
      pasos: [
        { estado: { corte: 0 }, texto: 'Doblado por la mitad, una pata del compás cae sobre la otra.', ecuacion: junto('AB = AC') },
        { estado: { corte: 0 }, texto: 'Los dos ángulos de abajo coinciden: miden igual.', ecuacion: junto(['α = (180° − θ) ÷ 2 = ', dH('70°')]) },
      ],
    },
    regla: {
      texto: 'Frente a lados iguales hay ángulos iguales, y al revés. Frente al lado mayor está el ángulo mayor. En el equilátero, los tres ángulos miden 60°.',
      ecuacion: [junto('AB = AC  ⟺  m∠B = m∠C')],
      condicion: 'se compara cada lado con el ángulo que tiene enfrente, no con los que lo tocan.',
      voz: 'Lado y ángulo se miran de frente.',
    },
    ahoraTu: {
      voz: 'Ubica los lados iguales y mira qué ángulos tienen enfrente.',
      generar(s) {
        const r = azar(s), t = 2 * r.ent(10, 70), al = (180 - t) / 2, pideBase = s % 2 === 0;
        return {
          pregunta: pideBase ? `En el triángulo ABC, AB = AC y m∠A = ${t}°. ¿Cuánto mide el ángulo B?` : `En el triángulo ABC, AB = AC y m∠B = ${al}°. ¿Cuánto mide el ángulo A?`,
          datos: [D_SUMA, 'Frente a lados iguales hay ángulos iguales.'],
          opciones: opciones(pideBase ? al : t, pideBase ? [
            { id: 'todo', valor: 180 - t, error: 'GE-ISO4', siFuera: `${180 - t}° es lo que suman B y C juntos; cada uno es la mitad.` },
            { id: 'igual', valor: t, error: 'GE-ISO5', siFuera: 'El ángulo A está entre los lados iguales; los iguales son B y C.' },
            { id: 'recto', valor: 90 - t, error: 'GE-ISO6', siFuera: 'Restar de 90° sería de un ángulo recto; aquí se reparte lo que falta para 180°.' },
          ] : [
            { id: 'mitad', valor: 180 - al, error: 'GE-ISO4', siFuera: 'Hay dos ángulos de la base iguales: se restan los dos.' },
            { id: 'igual', valor: al, error: 'GE-ISO5', siFuera: 'B y C son los iguales; A es el que queda entre los lados iguales.' },
            { id: 'doble', valor: 2 * al, error: 'GE-ISO6', siFuera: `${2 * al}° suman B y C; A es lo que les falta para 180°.` },
          ], gr),
          solucion: { texto: 'B y C miden igual, y los tres suman 180°.', ecuacion: junto(pideBase ? `m∠B = (180° − ${t}°) ÷ 2 = ${al}°` : `m∠A = 180° − 2 · ${al}° = ${t}°`) },
        };
      },
    },
  };

  // ---------- Idea 4 (antes 2, sin rehacer): desigualdad triangular ----------
  // Cambia: el ángulo entre los lados de 5 y 8 · Permanece: esos dos lados · Progresa: el largo del tercer lado ·
  // Se reserva: los dos extremos aplastados (3 y 13) · Debe verse: en los extremos no hay triángulo, solo un segmento.
  const bisagra = (g, o = {}) => {
    const B = [0, 0], C = [8, 0], A = U.polar(B, 5, g);
    const x = U.dist(A, C);
    return {
      alt: o.alt || `Lados de 5 y 8 con ángulo de ${g}° entre ellos: el tercer lado mide ${f(x)}`,
      vista: { x: [-5.6, 8.6], y: [-0.8, 5.4] },
      puntos: [{ id: 'B', x: 0, y: 0, rotulo: 'B', lado: -90 }, { id: 'C', x: 8, y: 0, rotulo: 'C', lado: -90 }, { id: 'A', x: A[0], y: A[1], rotulo: 'A', color: 'o', lado: 90 },
        ...(o.extremos ? [{ id: 'A0', x: 5, y: 0, color: 'h', rotulo: 'x = 3', lado: -90, desde: o.extremos[0] }, { id: 'A1', x: -5, y: 0, color: 'h', rotulo: 'x = 13', lado: -90, desde: o.extremos[1] }] : [])],
      segmentos: [{ de: 'B', a: 'C', texto: '8', grosor: 'variable', color: 'i' }, { de: 'B', a: 'A', texto: '5', grosor: 'variable', color: 'o' },
        { de: 'A', a: 'C', color: 'h', texto: o.sinX ? 'x' : `x ≈ ${f(x)}` },
        ...(o.extremos ? [{ de: 'A1', a: 'C', color: 'h', discontinua: true, desde: o.extremos[1] }] : [])],
    };
  };
  // La bisagra de «Así se resuelve»: lados m ≤ M que se dan, ángulo de 70° en B; con extremos, los dos casos aplastados.
  const bisagraPQ = (m, M, o = {}) => {
    const A = U.polar([0, 0], m, 70), lo = M - m, hi = M + m;
    return {
      alt: o.extremos ? `Lados de ${m} y ${M}: cerrada, x mide ${lo}; abierta del todo, ${hi}. En los dos casos queda un segmento`
        : `Dos lados de ${m} y ${M} unidos en B; el tercer lado x está entre las puntas`,
      vista: { x: [-m - 1, M + 1], y: [-1, m + 1] },
      puntos: [{ id: 'B', x: 0, y: 0, rotulo: 'B', lado: -90 }, { id: 'C', x: M, y: 0, rotulo: 'C', lado: -90 }, { id: 'A', x: A[0], y: A[1], rotulo: 'A', color: 'o', lado: 90 },
        ...(o.extremos && lo > 0 ? [{ id: 'A0', x: m, y: 0, color: 'h', rotulo: `x = ${lo}`, lado: 90 }] : []),
        ...(o.extremos ? [{ id: 'A1', x: -m, y: 0, color: 'h', rotulo: `x = ${hi}`, lado: -90 }] : [])],
      segmentos: [{ de: 'B', a: 'C', texto: String(M), grosor: 'variable', color: 'i' }, { de: 'B', a: 'A', texto: String(m), grosor: 'variable', color: 'o' },
        { de: 'A', a: 'C', color: 'h', texto: 'x' },
        ...(o.extremos ? [{ de: 'A1', a: 'C', color: 'h', discontinua: true }] : [])],
    };
  };
  const desigualdad = {
    id: 'desigualdad',
    titulo: 'El tercer lado tiene límites',
    temas: ['Desigualdad triangular'],
    pieza: 'geo-figura',
    // Lee (fase 2): contexto y qué mirar. No da los límites ni dice qué pasa en ellos: eso es la predicción.
    lee: {
      tarjetas: [
        { titulo: 'Tres palitos', texto: 'Corta tres palitos de distinto largo y trata de armar un triángulo con ellos, punta con punta. Con algunos tríos la figura se cierra y con otros no. El juego te deja ver por qué.' },
        { titulo: 'La bisagra', texto: 'En el juego, los lados de 5 y 8 se unen en B, como las dos hojas de una bisagra. Al abrir el ángulo en B, cambia la distancia entre las puntas: ese es el tercer lado, x.' },
        { titulo: 'Qué mirar', texto: 'Abre y cierra la bisagra hasta los topes. Anota el x más corto y el más largo que ves, y fíjate en la forma de la figura cerca de esos topes.' },
      ],
    },
    juega: {
      consigna: 'Dos lados de 5 y 8 giran en B como bisagra. Abre y cierra el ángulo y mira cómo cambia el tercer lado x.',
      voz: 'Abre y cierra la bisagra. Fíjate en el x más corto y el más largo.',
      controles: [{ id: 'g', etiqueta: 'Ángulo en B', min: 15, max: 165, paso: 15, inicio: 60, unidad: '°', decimales: 0, color: 'c-o' }],
      dibujo: v => ({ datos: bisagra(v.g), estado: {} }),
      // Se agarra la punta A del lado de 5: gira alrededor de B, como la bisagra.
      arrastres: [{ id: 'punta-a', etiqueta: 'punta A de la bisagra', color: 'c-o',
        donde: v => enPantalla(bisagra(v.g), U.polar([0, 0], 5, v.g)),
        mover: (pt, v) => { const q = alPlano(bisagra(v.g), pt); return { g: U.grados(Math.atan2(q[1], q[0])) }; } }],
      lectura: v => [{ v: 'c-h', t: 'x' }, ` ≈ ${f(U.dist(U.polar([0, 0], 5, v.g), [8, 0]))}`],
      minimo: 4,
    },
    predice: {
      pregunta: 'Si la bisagra pudiera cerrarse del todo o abrirse del todo, ¿entre qué valores puede estar x para que haya triángulo?',
      voz: 'Imagina los dos extremos. ¿Queda un triángulo ahí?',
      opciones: [
        { id: 'c', texto: 'Entre 3 y 13, sin llegar a ninguno', correcta: true },
        { id: 'cerrado', texto: 'De 3 a 13, incluidos', error: 'GE-DT3', siFuera: 'En 3 y en 13 los lados sí existen, pero quedan sobre una recta: es un segmento, no un triángulo.' },
        { id: 'solo-sup', texto: 'Cualquier valor menor que 13', error: 'GE-DT2', siFuera: 'El límite de 13 está bien. Si x es muy chico, 5 y x no alcanzan a cubrir 8.' },
        { id: 'suma', texto: 'Solo 13', error: 'GE-DT1', siFuera: 'Sumar 5 + 8 da el límite de arriba. x puede tomar todo un rango.' },
      ],
      dibujo: { datos: bisagra(60, { sinX: true }), estado: {} },
      revelar: { datos: bisagra(60, { extremos: [0, 0], sinX: true, alt: 'Cerrada, x mide 3; abierta del todo, 13: en ambos casos los lados quedan en una recta' }), estado: {} },
      coincide: 'Coincide: 8 − 5 < x < 8 + 5. En los extremos el triángulo se aplasta.',
    },
    mira: {
      datos: bisagra(60, { extremos: [1, 2], sinX: true, alt: 'La bisagra cerrada da x = 3 y abierta da x = 13; entre ambos hay triángulo' }),
      voz: 'Mira los dos extremos: ahí el triángulo desaparece.',
      pasos: [
        { estado: { corte: 1 }, texto: 'Cerrada del todo, A cae sobre BC: x = 8 − 5.', ecuacion: [{ v: 'c-h', t: 'x' }, ' = 3: segmento, sin triángulo'] },
        { estado: { corte: 2 }, texto: 'Abierta del todo, A queda al otro lado: x = 8 + 5.', ecuacion: [{ v: 'c-h', t: 'x' }, ' = 13: otro segmento'] },
        { estado: { corte: 2 }, texto: 'Cualquier abertura intermedia da triángulo.', ecuacion: ['8 − 5 < ', { v: 'c-h', t: 'x' }, ' < 8 + 5'] },
      ],
    },
    regla: {
      texto: 'Cada lado de un triángulo es menor que la suma de los otros dos y mayor que su diferencia.',
      ecuacion: [{ llave: [{ abs: ['a − b'] }], nota: 'la diferencia', color: 'c-i' }, ' < ', { v: 'c-h', t: 'x' }, ' < ', { llave: ['a + b'], nota: 'la suma', color: 'c-o' }],
      condicion: 'las desigualdades son estrictas: con igualdad, los tres puntos quedan alineados y no hay triángulo.',
      voz: 'Los extremos no cuentan: ahí la figura es un segmento.',
    },
    // Así se resuelve (fase 2): el conteo de enteros de «Ahora tú», con otras semillas y la bisagra de esos lados.
    resuelve: {
      generar(s) {
        const r = azar(s + 900), p = r.ent(3, 12), q = r.ent(3, 12);
        const lo = Math.abs(p - q), hi = p + q, n = hi - lo - 1, m = Math.min(p, q), M = Math.max(p, q);
        const x = { v: 'c-h', t: 'x' };
        return {
          enunciado: [`Dos lados de un triángulo miden ${p} y ${q}. ¿Cuántos valores enteros puede tomar el tercer lado `, x, '?'],
          dibujo: { datos: bisagraPQ(m, M), estado: {} },
          pasos: [
            { tipo: 'pide', texto: ['Piden cuántos números enteros puede valer el tercer lado ', x, '.'] },
            { tipo: 'datos', texto: `Los otros dos lados miden ${p} y ${q}. El ángulo entre ellos no lo dan: puede ser cualquiera.` },
            { tipo: 'regla', texto: ['El tercer lado es más largo que la resta de los otros dos y más corto que su suma. Los bordes no valen.'],
              ecuacion: [{ abs: ['a − b'] }, ' < ', x, ' < a + b'] },
            { tipo: 'cuentas', texto: 'Calculo los dos bordes y cuento los enteros que quedan entre ellos, sin los bordes.',
              ecuacion: [`${lo} < `, x, ` < ${hi}   →   de ${lo + 1} a ${hi - 1}: ${n} enteros`], dibujo: { datos: bisagraPQ(m, M, { extremos: true }), estado: {} } },
            { tipo: 'sentido', texto: `Si x valiera ${hi}, el triángulo se aplastaría en un segmento: ${p} + ${q} = ${hi}. Por eso ${hi} no entra${lo > 0 ? `, ni ${lo}` : ''}.` },
          ],
          respuesta: [x, ` puede tomar ${n} valores enteros.`],
        };
      },
    },
    ahoraTu: {
      voz: 'Primero los dos límites; después cuenta los enteros entre ellos.',
      generar(s) {
        const r = azar(s), p = r.ent(3, 12), q = r.ent(3, 12);
        const lo = Math.abs(p - q), hi = p + q, n = hi - lo - 1;
        return {
          pregunta: [`Dos lados de un triángulo miden ${p} y ${q}. ¿Cuántos valores enteros puede tomar el tercer lado `, { v: 'c-h', t: 'x' }, '?'],
          opciones: opciones(n, [
            { id: 'cerrado', valor: n + 2, error: 'GE-DT3', siFuera: `Contar ${lo} y ${hi} sería cierto si los extremos dieran triángulo; ahí los puntos quedan alineados.` },
            { id: 'solo-sup', valor: hi - 1, error: 'GE-DT2', siFuera: 'El límite de arriba está bien; también hay uno de abajo: la diferencia.' },
            { id: 'uno', valor: n + 1, error: 'GE-DT3', siFuera: 'Eso incluye uno de los extremos; ninguno de los dos da triángulo.' },
          ], n => `${f(n, 0)}`),
          solucion: { texto: `x va de más de ${lo} a menos de ${hi}.`, ecuacion: [`${lo} < `, { v: 'c-h', t: 'x' }, ` < ${hi} → ${n} enteros`] },
        };
      },
    },
  };

  // ---------- Idea 5 (antes 3, sin rehacer): altura, mediana, bisectriz y mediatriz ----------
  // Cambia: la posición de A sobre BC · Permanece: la base BC · Progresa: dónde caen los pies de las tres cevianas ·
  // Se reserva: el obtusángulo (altura fuera) · Debe verse: cada línea se define por su condición, no por su aspecto.
  const notables = (ax, ay, o = {}) => {
    const A = [ax, ay], B = [0, 0], C = [6, 0];
    const H = [ax, 0], M = [3, 0];
    const c = U.dist(A, B), b = U.dist(A, C), D = [6 * c / (b + c), 0];
    const ve = o.ver || { h: 1, m: 1, b: 1 };
    const pasos = o.pasos || {};
    const P = [];
    if (ax < 0) P.push({ id: 'Bx', x: ax - 0.6, y: 0, sinPunto: true });
    return {
      alt: o.alt || `Desde A salen la altura (pie en x = ${f(ax)}), la mediana (al punto medio) y la bisectriz${ax < 0 ? '; la altura cae fuera, en la prolongación de CB' : ''}`,
      vista: { x: [-3, 7], y: [-1, 4.6] },
      puntos: [{ id: 'A', x: ax, y: ay, rotulo: 'A', lado: 90 }, { id: 'B', x: 0, y: 0, rotulo: 'B', lado: ax < 0 ? -60 : -120 }, { id: 'C', x: 6, y: 0, rotulo: 'C', lado: -60 },
        { id: 'H', x: H[0], y: 0, rotulo: ve.h ? 'H' : undefined, sinPunto: !ve.h, color: 'h', lado: -90, desde: pasos.h || 0 },
        { id: 'M', x: 3, y: 0, rotulo: ve.m ? 'M' : undefined, sinPunto: !ve.m, color: 'i', lado: -90, desde: pasos.m || 0 },
        { id: 'D', x: D[0], y: 0, rotulo: ve.b ? 'D' : undefined, sinPunto: !ve.b, color: 'o', lado: -90, desde: pasos.b || 0 },
        { id: 'Mz', x: 3, y: 4.2, sinPunto: true }, ...P],
      regiones: [{ puntos: ['A', 'B', 'C'], color: 'i', opacidad: 0.06 }],
      segmentos: [{ de: 'A', a: 'B' }, { de: 'B', a: 'C', marcas: 0 }, { de: 'C', a: 'A' },
        ...(ax < 0 && ve.h ? [{ de: 'B', a: 'H', discontinua: true, grosor: 'fino', desde: pasos.h || 0 }] : []),
        ...(ve.h ? [{ de: 'A', a: 'H', color: 'h', grosor: 'variable', desde: pasos.h || 0 }] : []),
        ...(ve.m ? [{ de: 'A', a: 'M', color: 'i', grosor: 'variable', desde: pasos.m || 0 }, { de: 'B', a: 'M', marcas: 1, color: 'i', desde: pasos.m || 0 }, { de: 'M', a: 'C', marcas: 1, color: 'i', desde: pasos.m || 0 }] : []),
        ...(ve.b ? [{ de: 'A', a: 'D', color: 'o', grosor: 'variable', desde: pasos.b || 0 }] : []),
        ...(ve.z ? [{ de: 'M', a: 'Mz', color: 'd', discontinua: true, desde: pasos.z || 0 }] : [])],
      angulos: [
        ...(ve.h ? [{ en: 'H', de: ax < 0 ? 'C' : 'C', a: 'A', color: 'h', desde: pasos.h || 0 }] : []),
        ...(ve.b ? [{ en: 'A', de: 'B', a: 'D', color: 'o', rayita: 1, radio: 30, desde: pasos.b || 0 }, { en: 'A', de: 'D', a: 'C', color: 'o', rayita: 1, radio: 30, desde: pasos.b || 0 }] : []),
        ...(ve.z ? [{ en: 'M', de: 'C', a: 'Mz', color: 'd', desde: pasos.z || 0 }] : []),
      ],
    };
  };
  const lineas = {
    id: 'lineas-notables',
    titulo: 'Cada línea, por su condición',
    temas: ['Líneas notables'],
    pieza: 'geo-figura',
    // Lee (fase 2): vocabulario y marcas. No dice dónde cae la altura en un obtusángulo: eso es la predicción.
    lee: {
      tarjetas: [
        { titulo: 'Cuatro líneas con nombre', texto: 'En un triángulo se trazan cuatro líneas especiales: la altura, la mediana, la bisectriz y la mediatriz. Se llaman líneas notables, y cada una cumple una condición distinta.' },
        { titulo: 'Las marcas', texto: 'En los dibujos de examen, dos rayitas iguales dicen «estos dos tramos miden lo mismo». Dos arcos iguales en un vértice dicen «estos ángulos son iguales». Un cuadradito marca un ángulo recto.' },
        { titulo: 'Qué mirar', texto: 'Mueve A de un lado a otro y sigue los tres pies sobre BC: el rojo de la altura, el turquesa de la mediana y el naranja de la bisectriz. Busca cuándo se juntan.' },
      ],
    },
    juega: {
      consigna: 'Desde A salen tres líneas: altura (roja), mediana (turquesa) y bisectriz (naranja). Mueve A y mira dónde cae cada pie.',
      voz: 'Mueve A. Busca cuándo las tres líneas coinciden.',
      controles: [{ id: 'ax', etiqueta: 'A a lo ancho', min: 1, max: 5, paso: 0.5, inicio: 1.5, unidad: '', decimales: 1 }],
      dibujo: v => ({ datos: notables(v.ax, 3.6), estado: {} }),
      // Se agarra A, que corre en una paralela a BC: la altura del triángulo no cambia.
      arrastres: [{ id: 'vertice-a', etiqueta: 'vértice A', color: 'c-o',
        donde: v => enPantalla(notables(v.ax, 3.6), [v.ax, 3.6]),
        mover: (pt, v) => ({ ax: alPlano(notables(v.ax, 3.6), pt)[0] }) }],
      lectura: v => [`Pies: H en ${f(v.ax)}   ·   M en 3   ·   D en ${f(6 * U.dist([v.ax, 3.6], [0, 0]) / (U.dist([v.ax, 3.6], [0, 0]) + U.dist([v.ax, 3.6], [6, 0])))}`],
      minimo: 4,
    },
    predice: {
      pregunta: 'Ahora A se corre a la izquierda de B: el ángulo B queda obtuso. ¿Dónde cae el pie de la altura trazada desde A?',
      voz: 'Recuerda qué exige una altura. Luego decide.',
      opciones: [
        { id: 'c', texto: 'Fuera del triángulo, en la prolongación de CB', correcta: true },
        { id: 'medio', texto: 'En el punto medio de BC', error: 'GE8', siFuera: 'El punto medio es el pie de la mediana. La altura busca el ángulo recto.' },
        { id: 'dentro', texto: 'Dentro de BC, aunque quede inclinada', error: 'GE7', siFuera: 'Dentro caería si B y C fueran agudos. La altura debe formar 90° con la recta BC.' },
        { id: 'en-b', texto: 'Justo en B: AB es la altura', error: 'GE7', siFuera: 'AB sería la altura si B midiera 90°. Aquí B es obtuso.' },
      ],
      dibujo: { datos: notables(-1.5, 3, { ver: {} }), estado: {} },
      revelar: { datos: notables(-1.5, 3, { ver: { h: 1 } }), estado: {} },
      coincide: 'Coincide: la altura llega perpendicular a la recta BC, fuera del lado.',
    },
    mira: {
      datos: notables(1.5, 3.6, { ver: { h: 1, m: 1, b: 1, z: 1 }, pasos: { h: 1, m: 2, b: 3, z: 4 }, alt: 'Altura, mediana y bisectriz desde A, y la mediatriz de BC: cuatro líneas distintas' }),
      voz: 'Una línea por paso. Cada una tiene su marca.',
      pasos: [
        { estado: { corte: 1 }, texto: 'Altura: forma 90° con la recta BC.', ecuacion: ['AH ⟂ BC'] },
        { estado: { corte: 2 }, texto: 'Mediana: llega al punto medio de BC.', ecuacion: ['BM = MC'] },
        { estado: { corte: 3 }, texto: 'Bisectriz: parte el ángulo A en dos iguales.', ecuacion: ['∠BAD = ∠DAC'] },
        { estado: { corte: 4 }, texto: 'Mediatriz: perpendicular a BC en su punto medio; no pasa por A.', ecuacion: ['mediatriz ⟂ BC en M'] },
      ],
    },
    regla: {
      texto: 'Altura: perpendicular a la recta del lado opuesto. Mediana: llega a su punto medio. Bisectriz: parte el ángulo en dos iguales. Mediatriz: perpendicular en el punto medio.',
      condicion: 'cada altura llega a la recta de su lado: en el obtusángulo, dos caen fuera del triángulo.',
      voz: 'Nombra cada línea por su marca, no por cómo luce.',
    },
    // Así se resuelve (fase 2): reconocer la línea por su marca, como en «Ahora tú», con la misma figura y otras semillas.
    resuelve: {
      generar(s) {
        const r = azar(s + 900), ax = r.de([-1.5, -1, 0.5, 1, 1.5, 2, 4, 4.5, 5, 6.5]), ay = r.de([2.5, 3, 3.5, 4]);
        const tipos = ['h', 'm', 'b', 'z'], t = tipos[s % 4];
        const nom = { h: 'altura', m: 'mediana', b: 'bisectriz', z: 'mediatriz' };
        const d = notables(ax, ay, { ver: { [t]: 1 } });
        d.alt = `Triángulo con una línea marcada: ${t === 'h' ? 'forma 90° con la recta del lado opuesto' : t === 'm' ? 'llega al punto medio del lado opuesto' : t === 'b' ? 'parte el ángulo del vértice en dos iguales' : 'es perpendicular a un lado en su punto medio'}`;
        if (t === 'h' && ax < 0) d.puntos.find(p => p.id === 'B').lado = -60;
        const nombres = r.de(['ABC', 'PQR', 'RST', 'XYZ', 'JKL', 'UVW']);
        d.puntos.forEach(p => { const k = 'ABC'.indexOf(p.id); if (k >= 0 && p.id.length === 1) p.rotulo = nombres[k]; });
        const [V, P, Q] = nombres, lado = P + Q;
        const fuera = t === 'h' && (ax < 0 || ax > 6);
        const marca = { h: `un cuadradito de ángulo recto donde llega a la recta ${lado}`, m: 'una rayita igual a cada lado de su pie', b: `dos arcos iguales en el vértice ${V}`, z: `un cuadradito de ángulo recto en el punto medio de ${lado}` };
        const descarte = {
          h: `No llega al punto medio ni parte el ángulo en dos. Es la altura${fuera ? ', aunque su pie caiga fuera del lado' : ''}.`,
          m: 'No forma un ángulo recto ni parte el ángulo del vértice: solo llega al punto medio. Es la mediana.',
          b: 'Su pie no está en el punto medio ni forma 90°: solo reparte el ángulo. Es la bisectriz.',
          z: `Forma 90° como una altura, pero no sale de ${V}: nace en el punto medio de ${lado}. Es la mediatriz.`,
        }[t];
        return {
          enunciado: `En el triángulo ${nombres}, mira las marcas de la línea de color. ¿Qué línea notable es?`,
          dibujo: { datos: d, estado: {} },
          pasos: [
            { tipo: 'pide', texto: 'Piden el nombre de la línea de color: altura, mediana, bisectriz o mediatriz.' },
            { tipo: 'datos', texto: `En la figura, la línea tiene ${marca[t]}.` },
            { tipo: 'regla', texto: 'Cada línea notable se reconoce por su condición, no por su aspecto. Por eso busco su marca: ángulo recto, rayitas iguales o arcos iguales.' },
            { tipo: 'aplica', texto: `Esa marca dice que la línea ${t === 'h' ? `forma 90° con la recta ${lado}` : t === 'm' ? `llega al punto medio de ${lado}` : t === 'b' ? `parte el ángulo ${V} en dos iguales` : `es perpendicular a ${lado} en su punto medio`}.`,
              ecuacion: [t === 'h' ? `altura ⟂ ${lado}` : t === 'm' ? `pie en el punto medio de ${lado}` : t === 'b' ? `dos ángulos iguales en ${V}` : `mediatriz ⟂ ${lado} en su punto medio`] },
            { tipo: 'sentido', texto: descarte },
          ],
          respuesta: `Es la ${nom[t]}.`,
        };
      },
    },
    ahoraTu: {
      voz: 'Busca la marca: ángulo recto, rayitas o arcos iguales.',
      generar(s) {
        const r = azar(s), ax = r.de([-1.5, -1, 0.5, 1, 1.5, 2, 4, 4.5, 5, 6.5]), ay = r.de([2.5, 3, 3.5, 4]);
        const tipos = ['h', 'm', 'b', 'z'], t = tipos[s % 4];
        const nom = { h: 'altura', m: 'mediana', b: 'bisectriz', z: 'mediatriz' };
        const marca = { h: 'un ángulo recto con la recta del lado opuesto', m: 'rayitas iguales a cada lado del pie', b: 'dos arcos iguales en el vértice', z: 'un ángulo recto en el punto medio, sin pasar por el vértice' };
        const d = notables(ax, ay, { ver: { [t]: 1 } });
        d.alt = `Triángulo con una línea marcada: ${t === 'h' ? 'forma 90° con la recta del lado opuesto' : t === 'm' ? 'llega al punto medio del lado opuesto' : t === 'b' ? 'parte el ángulo del vértice en dos iguales' : 'es perpendicular a un lado en su punto medio'}`;
        if (t === 'h' && ax < 0) d.puntos.find(p => p.id === 'B').lado = -60;
        const nombres = r.de(['ABC', 'PQR', 'RST', 'XYZ', 'JKL', 'UVW']);
        d.puntos.forEach(p => { const k = 'ABC'.indexOf(p.id); if (k >= 0 && p.id.length === 1) p.rotulo = nombres[k]; });
        return {
          pregunta: `En el triángulo ${nombres}, mira las marcas de la línea de color que sale de ${nombres[0]}. ¿Qué línea notable es?`,
          dibujo: { datos: d, estado: {} },
          opciones: [{ id: 'c', texto: nom[t], correcta: true }].concat(tipos.filter(k => k !== t).map(k => ({ id: k, texto: nom[k], error: t === 'h' || k === 'h' ? 'GE7' : 'GE8', siFuera: `Sería ${nom[k]} si tuviera ${marca[k]}.` }))),
          solucion: { texto: `Su marca es ${t === 'h' ? 'el ángulo recto en el pie' : t === 'm' ? 'el punto medio del lado opuesto' : t === 'b' ? 'la de dos ángulos iguales en el vértice' : 'el ángulo recto en el punto medio'}.`, ecuacion: [nom[t]] },
        };
      },
    },
  };

  // ---------- Idea 6 (antes 4, sin rehacer): ángulos formados por bisectrices ----------
  // Cambia: los ángulos B y C · Permanece: la base BC · Progresa: ∠BIC y ∠BEC frente a A ·
  // Se reserva: la bisectriz exterior en C · Debe verse: ∠BIC = 90° + A/2 y ∠BEC = A/2.
  const bis = (b, c, o = {}) => {
    const { A, B, C } = porAngulos(b, c, 6);
    const la = U.dist(B, C), lb = U.dist(A, C), lc = U.dist(A, B), s = la + lb + lc;
    const I = [(la * A[0] + lb * B[0] + lc * C[0]) / s, (la * A[1] + lb * B[1] + lc * C[1]) / s];
    const ext = U.polar(C, 1, (180 - c) / 2); // bisectriz exterior en C: entre CA y la prolongación de BC
    const E = U.corte(B, I, C, ext);
    const a = 180 - b - c, k = o.pasos || {};
    const conE = o.E && E && E[0] < 14;
    return {
      alt: o.alt || `Triángulo con A = ${a}°: las bisectrices interiores de B y C se cortan en I formando ${90 + a / 2}°${conE ? `; con la exterior en C forman ${a / 2}° en E` : ''}`,
      vista: o.E ? { x: [-0.6, 12], y: [-0.8, 6.8] } : { x: [-1.6, 7.6], y: [-0.6, 8.6] },
      puntos: [{ id: 'A', x: A[0], y: A[1], rotulo: 'A', lado: 90 }, { id: 'B', x: 0, y: 0, rotulo: 'B', lado: -120 }, { id: 'C', x: 6, y: 0, rotulo: 'C', lado: -60 },
        { id: 'I', x: I[0], y: I[1], rotulo: 'I', color: 'h', lado: -90 }, { id: 'Cx', x: o.E ? 11.5 : 6.5, y: 0, sinPunto: true },
        ...(conE ? [{ id: 'E', x: E[0], y: E[1], rotulo: 'E', color: 'h', lado: 60, desde: k.E || 0 }] : [])],
      regiones: [{ puntos: ['A', 'B', 'C'], color: 'i', opacidad: 0.06 }],
      segmentos: [{ de: 'A', a: 'B' }, { de: 'B', a: 'C' }, { de: 'C', a: 'A' },
        { de: 'B', a: 'I', color: 'i', grosor: 'fino', desde: k.I || 0 }, ...(conE ? [{ de: 'I', a: 'E', color: 'i', grosor: 'fino', desde: k.E || 0 }] : []), { de: 'C', a: 'I', color: 'd', grosor: 'fino', desde: k.I || 0 },
        ...(o.E ? [{ de: 'C', a: 'Cx', discontinua: true, grosor: 'fino' }] : []),
        ...(conE ? [{ de: 'C', a: 'E', color: 'd', discontinua: true, desde: k.E || 0 }] : [])],
      angulos: [
        { en: 'A', de: 'B', a: 'C', color: 'o', texto: `${a}°` },
        { en: 'B', de: 'C', a: 'I', color: 'i', rayita: 1, radio: 28, desde: k.I || 0 }, { en: 'B', de: 'I', a: 'A', color: 'i', rayita: 1, radio: 28, desde: k.I || 0 },
        { en: 'C', de: 'I', a: 'B', color: 'd', rayita: 2, radio: 24, desde: k.I || 0 }, { en: 'C', de: 'A', a: 'I', color: 'd', rayita: 2, radio: 24, desde: k.I || 0 },
        { en: 'I', de: 'B', a: 'C', color: 'h', texto: o.sinBIC ? undefined : `${90 + a / 2}°`, radio: 20, desde: k.BIC || 0 },
        ...(conE ? [{ en: 'E', de: 'B', a: 'C', color: 'h', texto: o.sinE ? undefined : `${a / 2}°`, radio: 30, desde: k.E2 || k.E || 0 }, { en: 'C', de: 'I', a: 'E', color: 'h', desde: k.E || 0 }] : []),
      ],
    };
  };
  // El ángulo BIC medido en la figura, con el punto I que calcula bis() (no con la fórmula).
  const anguloBIC = v => { const P = bis(v.b, v.c).puntos, I = P.find(p => p.id === 'I'); return U.angulo([I.x, I.y], [0, 0], [6, 0]); };
  let BIC_MAX = 0;   // el mayor de la grilla del juego (B y C de 40° a 70°, de 10° en 10°)
  for (let b = 40; b <= 70; b += 10) for (let c = 40; c <= 70; c += 10) BIC_MAX = Math.max(BIC_MAX, anguloBIC({ b, c }));
  const bisectrices = {
    id: 'angulo-de-bisectrices',
    titulo: 'El ángulo entre dos bisectrices',
    temas: ['Ángulos formados por bisectrices'],
    pieza: 'geo-figura',
    // Lee (fase 2): qué es una bisectriz y cuál es la exterior. No dice cuánto mide ∠BEC: eso es la predicción.
    lee: {
      tarjetas: [
        { titulo: 'Partir a la mitad', texto: 'Una bisectriz parte un ángulo en dos iguales. Si recortas un triángulo de papel y lo doblas juntando dos lados, el doblez marca la bisectriz del ángulo entre ellos.' },
        { titulo: 'Dos bisectrices que se cruzan', texto: 'Si trazas la bisectriz de B y la de C, se cortan dentro del triángulo en un punto llamado I, el incentro. Entre ellas se forma el ángulo BIC.' },
        { titulo: 'Adentro y afuera', texto: 'Cada vértice tiene dos bisectrices: la interior, que parte el ángulo de adentro, y la exterior, que parte el ángulo exterior, entre un lado y la prolongación del otro.' },
        { titulo: 'Qué mirar', texto: 'Cambia B y C, y fíjate en tres números a la vez: el ángulo A, el ángulo BIC y cómo se mueve uno cuando cambia el otro.' },
      ],
    },
    juega: {
      consigna: 'Las bisectrices de B y C se cortan en I. Cambia los ángulos B y C y compara el ángulo BIC con el ángulo A.',
      voz: 'Cambia B y C. Busca una relación entre BIC y A.',
      controles: [
        { id: 'b', etiqueta: 'B', min: 40, max: 70, paso: 10, inicio: 60, unidad: '°', decimales: 0, color: 'c-i' },
        { id: 'c', etiqueta: 'C', min: 40, max: 70, paso: 10, inicio: 50, unidad: '°', decimales: 0, color: 'c-d' },
      ],
      dibujo: v => ({ datos: bis(v.b, v.c), estado: {} }),
      // Se agarra A: su posición decide los ángulos B y C (de 10° en 10°).
      arrastres: [{ id: 'vertice-a', etiqueta: 'vértice A', color: 'c-o',
        donde: v => enPantalla(bis(v.b, v.c), porAngulos(v.b, v.c, 6).A),
        mover: (pt, v) => { const q = alPlano(bis(v.b, v.c), pt); return { b: U.angulo([0, 0], [6, 0], q), c: U.angulo([6, 0], [0, 0], q) }; } }],
      lectura: v => [cA, ` = ${180 - v.b - v.c}° · ∠BIC = ${90 + (180 - v.b - v.c) / 2}°`],
      minimo: 4,
    },
    predice: {
      pregunta: ['Con ', cA, ' = 60°, cambiamos la bisectriz de C por la exterior: corta a la bisectriz de B en E. ¿Cuánto mide el ángulo BEC?'],
      voz: 'La bisectriz cambió. Decide si la relación cambia también.',
      opciones: [
        { id: 'c', texto: '30°', correcta: true },
        { id: 'interior', texto: '120°', error: 'GE-BIS4', siFuera: '120° es ∠BIC, con las dos bisectrices interiores. En E una de ellas es exterior.' },
        { id: 'resta', texto: '60°', error: 'GE-BIS5', siFuera: '60° sería cierto si E viera el ángulo A completo. Recibe solo su mitad.' },
        { id: 'compl', texto: '90°', error: 'GE-BIS5', siFuera: 'Las bisectrices de C sí forman 90° entre sí; el ángulo en E es otro.' },
      ],
      dibujo: { datos: bis(70, 50, { E: true, sinE: true, sinBIC: true, alt: 'Triángulo con A = 60°: bisectriz interior de B y exterior de C se cortan en E' }), estado: {} },
      revelar: { datos: bis(70, 50, { E: true }), estado: {} },
      coincide: ['Coincide: ∠BEC = ', cA, '/2 = 30°.'],
    },
    mira: {
      datos: bis(70, 50, { E: true, pasos: { I: 1, BIC: 2, E: 3, E2: 4 } }),
      voz: 'Primero el interior; luego el exterior se apoya en él.',
      pasos: [
        { estado: { corte: 1 }, texto: 'Las bisectrices toman la mitad de B y la mitad de C.', ecuacion: [{ frac: [cB, '2'] }, ' + ', { frac: [cC, '2'] }, ' = ', { frac: [['180° − ', cA], '2'] }] },
        { estado: { corte: 2 }, texto: 'En el triángulo BIC, lo que falta para 180° es ∠BIC.', ecuacion: ['∠BIC = 180° − ', { frac: [[cB, ' + ', cC], '2'] }, ' = 90° + ', { frac: [cA, '2'] }] },
        { estado: { corte: 3 }, texto: 'Las dos bisectrices de C forman 90°.', ecuacion: ['∠ICE = 90°'] },
        { estado: { corte: 4 }, texto: 'En el triángulo ICE, el exterior en I es ∠BIC.', ecuacion: ['∠BEC = ∠BIC − 90° = ', { frac: [cA, '2'] }, ' = 30°'] },
      ],
    },
    regla: {
      texto: 'Las bisectrices interiores de B y C forman 90° + A/2. Si una es interior y la otra exterior, forman A/2.',
      ecuacion: ['∠BIC = 90° + ', { llave: [{ frac: [cA, '2'] }], nota: 'mitad de A', color: 'c-o' }, '   ·   ∠BEC = ', { frac: [cA, '2'] }],
      condicion: 'I está en las bisectrices interiores de B y C; E, en la interior de B y la exterior de C.',
      voz: 'Antes de aplicar, revisa qué bisectrices se cortan.',
    },
    // Así se resuelve (fase 2): el mismo corte de bisectrices de «Ahora tú», con la misma figura y otras semillas.
    resuelve: {
      generar(s) {
        const r = azar(s + 900), a = 10 * r.ent(3, 10), conE = s % 2 === 1;
        const b = 10 * r.ent(3, Math.min(10, (170 - a) / 10 - 3)), c = 180 - a - b;
        const d = bis(b, c, { E: conE, sinBIC: true, sinE: true });
        if (conE) d.angulos = d.angulos.filter(an => !(an.en === 'I'));
        const bien = conE ? a / 2 : 90 + a / 2, ang = conE ? '∠BEC' : '∠BIC';
        return {
          enunciado: conE ? ['En el triángulo ABC, ', cA, ` = ${a}°. La bisectriz interior de B y la exterior de C se cortan en E. ¿Cuánto mide ∠BEC?`]
            : ['En el triángulo ABC, ', cA, ` = ${a}°. Las bisectrices interiores de B y C se cortan en I. ¿Cuánto mide ∠BIC?`],
          dibujo: { datos: d, estado: {} },
          pasos: [
            { tipo: 'pide', texto: conE ? 'Piden ∠BEC. E está en la bisectriz interior de B y en la exterior de C.' : 'Piden ∠BIC. I está en las dos bisectrices interiores, la de B y la de C.' },
            { tipo: 'datos', texto: ['Solo conozco ', cA, ` = ${a}°. Los ángulos B y C no los dan.`] },
            { tipo: 'regla', texto: conE ? 'Cuando se cruzan una bisectriz interior y una exterior, el ángulo entre ellas es la mitad de A.' : 'Cuando se cruzan las dos bisectrices interiores, el ángulo entre ellas es 90° más la mitad de A.',
              ecuacion: conE ? ['∠BEC = ', { frac: [cA, '2'] }] : ['∠BIC = 90° + ', { frac: [cA, '2'] }] },
            { tipo: 'cuentas', texto: conE ? ['Saco la mitad de ', cA, '.'] : ['Saco la mitad de ', cA, ' y le sumo 90°.'],
              ecuacion: conE ? ['∠BEC = ', { frac: [`${a}°`, '2'] }, ` = ${bien}°`] : ['∠BIC = 90° + ', { frac: [`${a}°`, '2'] }, ` = 90° + ${a / 2}° = ${bien}°`] },
            { tipo: 'sentido', texto: conE ? `Pruebo con un caso: B = ${b}° y C = ${c}°. En el triángulo BEC, B da ${b / 2}° y C da ${c}° + ${(180 - c) / 2}°: queda 180° − ${b / 2}° − ${c + (180 - c) / 2}° = ${bien}°.`
              : `Pruebo con un caso: B = ${b}° y C = ${c}°. En el triángulo BIC quedan ${b / 2}° y ${c / 2}°: 180° − ${b / 2}° − ${c / 2}° = ${bien}°.` },
          ],
          respuesta: `${ang} = ${bien}°`,
        };
      },
    },
    ahoraTu: {
      voz: 'Mira qué bisectrices se cortan antes de elegir la fórmula.',
      generar(s) {
        const r = azar(s), a = 10 * r.ent(3, 10), conE = s % 2 === 1;
        const b = 10 * r.ent(3, Math.min(10, (170 - a) / 10 - 3)), c = 180 - a - b;
        const d = bis(b, c, { E: conE, sinBIC: true, sinE: true });
        if (conE) d.angulos = d.angulos.filter(an => !(an.en === 'I'));
        const bien = conE ? a / 2 : 90 + a / 2;
        return {
          pregunta: conE ? ['En el triángulo ABC, ', cA, ` = ${a}°. La bisectriz interior de B y la exterior de C se cortan en E. ¿Cuánto mide ∠BEC?`]
            : ['En el triángulo ABC, ', cA, ` = ${a}°. Las bisectrices interiores de B y C se cortan en I. ¿Cuánto mide ∠BIC?`],
          dibujo: { datos: d, estado: {} },
          opciones: opciones(bien, [
            { id: 'cambio', valor: conE ? 90 + a / 2 : a / 2, error: 'GE-BIS4', siFuera: conE ? 'Esa fórmula vale con dos bisectrices interiores; aquí una es exterior.' : 'A/2 vale con una bisectriz exterior; aquí las dos son interiores.' },
            { id: 'menos', valor: 90 - a / 2, error: 'GE-BIS5', siFuera: '90° − A/2 aparece con dos bisectrices exteriores, no en este corte.' },
            { id: 'sin-mitad', valor: conE ? a : 90 + a, error: 'GE-BIS5', siFuera: 'Falta la mitad: cada bisectriz toma solo la mitad de su ángulo.' },
          ], gr),
          solucion: { texto: conE ? 'Interior con exterior: la mitad de A.' : 'Dos interiores: 90° más la mitad de A.', ecuacion: conE ? ['∠BEC = ', { frac: [`${a}°`, '2'] }, ` = ${a / 2}°`] : ['∠BIC = 90° + ', { frac: [`${a}°`, '2'] }, ` = ${90 + a / 2}°`] },
        };
      },
    },
  };

  // ---------- Laboratorio: juego libre, sin preguntas ----------
  // Mesa 1, más rica que la idea 1 y la 5: se mueven A y C (la base cambia), y se elige qué línea notable sale de A.
  // Deja probar lo que las ideas no: el obtuso en C, el rectángulo exacto y el isósceles donde las líneas coinciden.
  const LIN = { h: 'altura', m: 'mediana', b: 'bisectriz', z: 'mediatriz' };
  const libre = (ax, ay, cx, linea) => {
    const A = [ax, ay], B = [0, 0], C = [cx, 0];
    const a = U.angulo(A, B, C), b = U.angulo(B, A, C), c = 180 - a - b;
    const lb = U.dist(A, C), lc = U.dist(A, B);
    const H = [ax, 0], M = [cx / 2, 0], D = [cx * lc / (lb + lc), 0];
    const todas = linea === 'todas', ve = k => todas || linea === k;
    const fuera = ax < 0 || ax > cx;
    return {
      alt: `Triángulo de ángulos A = ${f(a, 0)}°, B = ${f(b, 0)}° y C = ${f(c, 0)}°${ve('h') && fuera ? '; la altura desde A cae fuera del lado BC' : ''}`,
      vista: { x: [-2.6, 8.6], y: [-1, 6.4] },
      puntos: [{ id: 'A', x: ax, y: ay, rotulo: 'A', lado: 90 }, { id: 'B', x: 0, y: 0, rotulo: 'B', lado: -120 }, { id: 'C', x: cx, y: 0, rotulo: 'C', lado: -60 },
        { id: 'H', x: H[0], y: 0, sinPunto: !ve('h'), color: 'h' }, { id: 'M', x: M[0], y: 0, sinPunto: !(ve('m') || ve('z')), color: 'i' },
        { id: 'D', x: D[0], y: 0, sinPunto: !ve('b'), color: 'o' }, { id: 'Mz', x: M[0], y: 6, sinPunto: true }],
      regiones: [{ puntos: ['A', 'B', 'C'], color: 'i', opacidad: 0.06 }],
      segmentos: [{ de: 'A', a: 'B' }, { de: 'B', a: 'C' }, { de: 'C', a: 'A' },
        ...(ve('h') && fuera ? [{ de: ax < 0 ? 'B' : 'C', a: 'H', discontinua: true, grosor: 'fino' }] : []),
        ...(ve('h') ? [{ de: 'A', a: 'H', color: 'h', grosor: 'variable' }] : []),
        ...(ve('m') ? [{ de: 'A', a: 'M', color: 'i', grosor: 'variable' }, { de: 'B', a: 'M', marcas: 1, color: 'i' }, { de: 'M', a: 'C', marcas: 1, color: 'i' }] : []),
        ...(ve('b') ? [{ de: 'A', a: 'D', color: 'o', grosor: 'variable' }] : []),
        ...(ve('z') ? [{ de: 'M', a: 'Mz', color: 'd', discontinua: true }] : [])],
      angulos: [
        ...(linea === 'ninguna' ? [{ en: 'A', de: 'B', a: 'C', color: 'o', texto: gr(Math.round(a)) }, { en: 'B', de: 'C', a: 'A', color: 'i', texto: gr(Math.round(b)) }, { en: 'C', de: 'A', a: 'B', color: 'd', texto: gr(Math.round(c)) }] : []),
        ...(ve('h') && Math.abs(ay) > 0 ? [{ en: 'H', de: ax > cx ? 'B' : 'C', a: 'A', color: 'h' }] : []),
        ...(ve('b') ? [{ en: 'A', de: 'B', a: 'D', color: 'o', rayita: 1, radio: 30 }, { en: 'A', de: 'D', a: 'C', color: 'o', rayita: 1, radio: 30 }] : []),
        ...(ve('z') ? [{ en: 'M', de: 'C', a: 'Mz', color: 'd' }] : []),
      ],
    };
  };
  // Los tres ángulos del triángulo libre, como los calcula la figura (A, B y C).
  const angLibre = v => { const A = [v.ax, v.ay], C = [v.cx, 0], a = U.angulo(A, [0, 0], C), b = U.angulo([0, 0], A, C); return { a, b, c: 180 - a - b }; };
  let A_MAX = 0;   // el mayor ángulo A de la grilla de la mesa
  for (let i = 0; i <= 20; i++) for (let j = 0; j <= 11; j++) for (let k = 0; k <= 12; k++) A_MAX = Math.max(A_MAX, angLibre({ ax: -2 + i / 2, ay: 0.5 + j / 2, cx: 2 + k / 2 }).a);
  // Los pies de altura, mediana y bisectriz que dibuja libre(): coinciden cuando los tres caen en el mismo punto.
  const pies = v => { const P = libre(v.ax, v.ay, v.cx, 'todas').puntos, x = id => P.find(p => p.id === id).x; return [x('H'), x('M'), x('D')]; };
  const mesaLibre = {
    id: 'triangulo-libre', titulo: 'Triángulo libre', pieza: 'geo-figura',
    consigna: 'Arrastra A y C. Elige qué línea sale de A. Busca un obtuso en C, un rectángulo y un isósceles.',
    controles: [
      { id: 'ax', etiqueta: 'A a lo ancho', min: -2, max: 8, paso: 0.5, inicio: 2, unidad: '', decimales: 1 },
      { id: 'ay', etiqueta: 'A a lo alto', min: 0.5, max: 6, paso: 0.5, inicio: 4, unidad: '', decimales: 1 },
      { id: 'cx', etiqueta: 'C a lo ancho', min: 2, max: 8, paso: 0.5, inicio: 6, unidad: '', decimales: 1 },
      { id: 'linea', etiqueta: 'Desde A', opciones: [{ valor: 'ninguna', texto: 'ángulos' }, { valor: 'h', texto: 'altura' }, { valor: 'm', texto: 'mediana' }, { valor: 'b', texto: 'bisectriz' }, { valor: 'todas', texto: 'todas' }] },
    ],
    dibujo: v => ({ datos: libre(v.ax, v.ay, v.cx, v.linea), estado: {} }),
    arrastres: [
      { id: 'vertice-a', etiqueta: 'vértice A', color: 'c-o',
        donde: v => enPantalla(libre(v.ax, v.ay, v.cx, v.linea), [v.ax, v.ay]),
        mover: (pt, v) => { const q = alPlano(libre(v.ax, v.ay, v.cx, v.linea), pt); return { ax: q[0], ay: q[1] }; } },
      { id: 'vertice-c', etiqueta: 'vértice C', color: 'c-d',
        donde: v => enPantalla(libre(v.ax, v.ay, v.cx, v.linea), [v.cx, 0]),
        mover: (pt, v) => ({ cx: alPlano(libre(v.ax, v.ay, v.cx, v.linea), pt)[0] }) },
    ],
    lectura: v => {
      const A = [v.ax, v.ay], C = [v.cx, 0], a = U.angulo(A, [0, 0], C), b = U.angulo([0, 0], A, C), c = 180 - a - b;
      return [cA, ` ${gr(Math.round(a))}   ·   `, cB, ` ${gr(Math.round(b))}   ·   `, cC, ` ${gr(Math.round(c))}   ·   ${nombreAng(a, b, c)}`];
    },
    invitaciones: [
      { texto: 'Haz obtuso el ángulo C y mira, con «altura», dónde cae su pie.',
        logrado: v => angLibre(v).c > 90 + 1e-9 && v.linea === 'h',
        bien: 'Con C obtuso, la altura desde A cae fuera, en la prolongación.' },
      { texto: 'Consigue un triángulo rectángulo exacto, con el ángulo recto en B.',
        logrado: v => Math.abs(angLibre(v).b - 90) < 1e-9,
        bien: 'Recto en B: la altura desde A es el mismo lado AB.' },
      { texto: 'Elige «todas» y busca un triángulo donde las líneas notables coinciden.',
        logrado: v => { const [h, m, d] = pies(v); return v.linea === 'todas' && Math.abs(h - m) < 1e-9 && Math.abs(m - d) < 1e-9; },
        bien: 'Coinciden con AB = AC. ¿Lo garantiza el isósceles o solo este dibujo?' },
      { texto: 'Busca el ángulo A más grande que permite la mesa.',
        logrado: v => Math.abs(angLibre(v).a - A_MAX) < 1e-9,
        bien: 'Casi llano: A pegado a la base, y B y C casi nada.' },
      { texto: 'Guarda un acutángulo y un obtusángulo. Compara la suma de sus ángulos.',
        logrado: (v, gs) => { const n = c => { const x = angLibre(c); return nombreAng(x.a, x.b, x.c); };
          return gs.some(c => n(c) === 'acutángulo') && gs.some(c => n(c) === 'obtusángulo') && gs.some(c => c.ax === v.ax && c.ay === v.ay && c.cx === v.cx); },
        bien: 'Formas distintas, la misma suma: los 180° no dependen del dibujo.' },
    ],
  };
  // Mesa 2: la bisagra con los dos lados libres. La idea 4 fija 5 y 8; aquí se cambian, y el rango se lee en vivo.
  const bisagraLibre = (g, c, a) => {
    const B = [0, 0], C = [a, 0], A = U.polar(B, c, g), x = U.dist(A, C);
    return {
      alt: `Lados de ${f(c)} y ${f(a)} con ${f(g, 0)}° entre ellos: el tercer lado mide ${f(x)}, entre ${f(Math.abs(a - c))} y ${f(a + c)}`,
      vista: { x: [-6.6, 8.6], y: [-0.8, 6.6] },
      puntos: [{ id: 'B', x: 0, y: 0, rotulo: 'B', lado: -90 }, { id: 'C', x: a, y: 0, rotulo: 'C', lado: -90 }, { id: 'A', x: A[0], y: A[1], rotulo: 'A', color: 'o', lado: 90 },
        { id: 'P0', x: c, y: 0, sinPunto: true }, { id: 'P1', x: -c, y: 0, sinPunto: true }],
      arcos: [{ centro: [0, 0], r: c, de: 0, a: 180, color: 'o', grosor: 'fino' }],
      segmentos: [{ de: 'B', a: 'C', texto: f(a), grosor: 'variable', color: 'i' }, { de: 'B', a: 'A', texto: f(c), grosor: 'variable', color: 'o' },
        { de: 'A', a: 'C', color: 'h', texto: `x ≈ ${f(x)}` }],
    };
  };
  // El tercer lado x que dibuja bisagraLibre.
  const tercero = v => U.dist(U.polar([0, 0], v.c, v.g), [v.a, 0]);
  let X_MAX = 0;   // el mayor x de la grilla con triángulo de verdad (ángulo en B entre 0° y 180°, sin los extremos)
  for (let g = 5; g < 180; g += 5) for (let i = 0; i <= 10; i++) for (let j = 0; j <= 14; j++) X_MAX = Math.max(X_MAX, tercero({ g, c: 1 + i / 2, a: 1 + j / 2 }));
  const mesaBisagra = {
    id: 'bisagra-libre', titulo: 'Bisagra con lados libres', pieza: 'geo-figura',
    consigna: 'Arrastra A por su arco y C por la base. Cambia los dos lados y mira cuándo x roza sus límites.',
    controles: [
      { id: 'g', etiqueta: 'Ángulo en B', min: 0, max: 180, paso: 5, inicio: 60, unidad: '°', decimales: 0, color: 'c-o' },
      { id: 'c', etiqueta: 'Lado AB', min: 1, max: 6, paso: 0.5, inicio: 5, unidad: '', decimales: 1, color: 'c-o' },
      { id: 'a', etiqueta: 'Lado BC', min: 1, max: 8, paso: 0.5, inicio: 8, unidad: '', decimales: 1, color: 'c-i' },
    ],
    dibujo: v => ({ datos: bisagraLibre(v.g, v.c, v.a), estado: {} }),
    arrastres: [
      { id: 'punta-a', etiqueta: 'punta A', color: 'c-o',
        donde: v => enPantalla(bisagraLibre(v.g, v.c, v.a), U.polar([0, 0], v.c, v.g)),
        mover: (pt, v) => { const q = alPlano(bisagraLibre(v.g, v.c, v.a), pt), g = U.grados(Math.atan2(q[1], q[0])); return { g: g < -90 ? 180 : g < 0 ? 0 : g, c: Math.hypot(q[0], q[1]) }; } },
      { id: 'vertice-c', etiqueta: 'vértice C', color: 'c-i',
        donde: v => enPantalla(bisagraLibre(v.g, v.c, v.a), [v.a, 0]),
        mover: (pt, v) => ({ a: alPlano(bisagraLibre(v.g, v.c, v.a), pt)[0] }) },
    ],
    lectura: v => {
      const x = U.dist(U.polar([0, 0], v.c, v.g), [v.a, 0]), lo = Math.abs(v.a - v.c), hi = v.a + v.c;
      const plano = v.g === 0 || v.g === 180;
      return [`${f(lo)} < `, { v: 'c-h', t: 'x' }, ` < ${f(hi)}   ·   `, { v: 'c-h', t: 'x' }, ` ≈ ${f(x)}${plano ? ': segmento, sin triángulo' : ''}`];
    },
    invitaciones: [
      { texto: 'Haz que x toque un extremo de la desigualdad triangular: el triángulo se aplasta.',
        logrado: v => { const x = tercero(v); return Math.abs(x - Math.abs(v.a - v.c)) < 1e-9 || Math.abs(x - (v.a + v.c)) < 1e-9; },
        bien: 'En el extremo, x es la suma o la diferencia: puntos alineados, sin triángulo.' },
      { texto: 'Busca el x más largo que todavía forme triángulo.',
        logrado: v => v.g > 0 && v.g < 180 && Math.abs(tercero(v) - X_MAX) < 1e-9,
        bien: 'Se acerca a la suma de los lados, pero nunca la alcanza.' },
      { texto: 'Con AB y BC distintos, arma un isósceles: que x iguale a uno de ellos.',
        logrado: v => v.g > 0 && v.g < 180 && v.c !== v.a && nombreLad(v.c, v.a, tercero(v)) === 'isósceles',
        bien: 'Dos lados iguales. ¿Qué pasa con los ángulos frente a ellos?' },
      { texto: 'Guarda dos casos con los mismos lados y distinto ángulo en B. Compara x.',
        logrado: (v, gs) => gs.some(c => c.c === v.c && c.a === v.a && c.g !== v.g) && gs.some(c => c.c === v.c && c.a === v.a && c.g === v.g),
        bien: 'Mismos lados: a más abertura en B, más largo el tercer lado.' },
    ],
  };

  // Las ideas 4 a 6 conservan su contenido de antes (fase 3: se rehacen con sus objetos y la regla de colores). Aquí solo
  // cambian el título (propuesta §1), la pregunta del Resumen y lo que el alumno debe poder decir.
  Object.assign(desigualdad, { titulo: 'Desigualdad triangular', pregunta: '¿Con qué tres largos se puede armar un triángulo?',
    aprendizaje: 'Cada lado es menor que la suma de los otros dos y mayor que su diferencia; en los extremos no hay triángulo, solo un segmento.' });
  Object.assign(lineas, { titulo: 'Líneas notables', pregunta: '¿Cómo se distingue la altura de la mediana y la bisectriz?',
    aprendizaje: 'Cada línea notable se reconoce por su condición: la altura es perpendicular y puede caer fuera; mediana, bisectriz y altura coinciden solo en el isósceles.' });
  Object.assign(bisectrices, { titulo: 'Ángulos entre bisectrices', pregunta: '¿De qué depende el ángulo donde se cruzan dos bisectrices?',
    aprendizaje: 'Las bisectrices interiores de B y C forman 90° + m∠A/2; una interior y una exterior, m∠A/2: solo importa el ángulo A.' });

  return {
    unidad: 'geometria.triangulos',
    version: '0.3.0',
    estado: 'completa',
    requiere: ['/nucleo/kit/piezas/geo-figura.js', '/nucleo/kit/piezas/geo-objeto.js'],
    historia: {
      texto: 'En la proposición I.32 de los Elementos, la suma de los ángulos de un triángulo no se obtiene midiendo muchos dibujos: se traza una paralela y se comparan ángulos. El mismo argumento da el ángulo exterior. Una figura auxiliar se vuelve parte de la demostración.',
      pregunta: '¿Qué línea convierte una regularidad en una prueba?',
      fuente: { titulo: 'Euclides, Elementos I.32 (edición de D. E. Joyce)', url: 'https://math.clarku.edu/~djoyce/java/elements/bookI/propI32.html' },
    },
    // Glosario: las palabras que la unidad estrena (docs/teoria.md, 4d). Las de la idea 1 (triángulo, ángulo interior,
    // acutángulo, rectángulo y obtusángulo) ya traen simple y tres ejemplos; las demás los ganan en la fase 3. Ningún
    // simple ni ejemplo de la idea 1 dice cuánto suman los ángulos ni que solo uno puede ser obtuso (eso es la predicción).
    glosario: [
      { termino: 'triángulo', simbolo: '△', def: 'Figura cerrada de tres lados rectos que se juntan de dos en dos en tres vértices.',
        simple: 'Una figura de tres lados rectos y tres puntas, como un tijeral.',
        ejemplos: ['El tijeral de un techo es un triángulo de madera.', '△ABC tiene los vértices A, B y C, y los lados AB, BC y CA.', 'Una escuadra de dibujo tiene forma de triángulo.'],
        ver: ['ángulo interior', 'desigualdad triangular'] },
      { termino: 'ángulo interior', formas: ['ángulo interior', 'ángulos interiores', 'interiores', 'interior'],
        def: 'El que queda dentro de la figura, entre dos lados vecinos.',
        simple: 'La abertura de cada punta, por dentro de la figura.',
        ejemplos: ['En △ABC hay tres: el de A, el de B y el de C.', 'El de B queda entre los lados BA y BC.', 'En una escuadra de dibujo, uno de los tres es recto.'],
        ver: ['ángulo exterior'] },
      { termino: 'ángulo exterior', formas: ['ángulo exterior', 'ángulos exteriores'],
        def: 'El que forma un lado con la prolongación del lado vecino, por fuera de la figura.',
        ejemplo: `Con interiores de 50° y 70°, el exterior del tercer vértice mide ${50 + 70}°.`, ver: ['ángulo interior'] },
      { termino: 'desigualdad triangular', def: 'Cada lado es menor que la suma de los otros dos y mayor que su diferencia.',
        ejemplo: `Con lados 5 y 8, el tercero está entre ${8 - 5} y ${8 + 5}, sin llegar a ellos.` },
      { termino: 'acutángulo', def: 'Triángulo con sus tres ángulos agudos, de menos de 90°.',
        simple: 'Con sus tres puntas cerradas, todas de menos de 90°.',
        ejemplos: ['Con ángulos de 50°, 60° y 70°, es acutángulo.', 'Con 30°, 70° y 80°, también.', 'La cartulina del juego, al empezar, es acutángulo.'] },
      { termino: 'rectángulo', def: 'Con ángulos rectos: un triángulo con uno de 90°, o un cuadrilátero con los cuatro de 90°.',
        ejemplos: ['Una escuadra de dibujo es un triángulo rectángulo.', 'Con ángulos de 90°, 30° y 60°, el triángulo es rectángulo.', 'Una hoja de cuaderno es un rectángulo: sus cuatro esquinas miden 90°.'],
        ver: ['cuadrilátero'] },
      { termino: 'obtusángulo', def: 'Triángulo con un ángulo obtuso, de más de 90° y menos de 180°.',
        simple: 'Tiene una punta muy abierta, de más de 90°.',
        ejemplos: ['Con ángulos de 30°, 40° y 110°, es obtusángulo.', 'Un tijeral de techo bajo es obtusángulo: arriba pasa de 90°.', 'Con 20°, 35° y 125°, también.'] },
      { termino: 'escaleno', def: 'Triángulo con sus tres lados de medidas distintas.' },
      { termino: 'isósceles', def: 'Triángulo con dos lados iguales. Los ángulos frente a esos lados también son iguales.' },
      { termino: 'equilátero', def: 'Triángulo con sus tres lados iguales. Cada uno de sus ángulos mide 60°.' },
      { termino: 'perpendicular', simbolo: '⟂', def: 'Que corta a otra línea formando ángulos de 90°.' },
      { termino: 'altura', def: 'Segmento perpendicular que baja de un vértice o punto hasta la recta de enfrente. Mide la distancia a ella.',
        ver: ['pie', 'línea notable'] },
      { termino: 'mediana', def: 'Segmento que une un vértice del triángulo con el punto medio del lado opuesto.', ver: ['punto medio'] },
      { termino: 'mediatriz', def: 'Recta perpendicular a un segmento que pasa por su punto medio.', ver: ['perpendicular', 'punto medio'] },
      { termino: 'línea notable', formas: ['líneas notables', 'línea notable'],
        def: 'Cada línea especial del triángulo: altura, mediana, bisectriz o mediatriz. Se reconoce por su condición.',
        ver: ['altura', 'mediana', 'bisectriz', 'mediatriz', 'baricentro', 'incentro'] },
      { termino: 'pie', formas: ['pie', 'pies'], def: 'Punto donde una línea trazada desde un vértice llega al lado de enfrente o a su prolongación.' },
      { termino: 'prolongación', def: 'Lo que sigue de un segmento más allá de sus extremos, sobre la misma recta.' },
      { termino: 'lado opuesto', formas: ['lado opuesto', 'lados opuestos'], def: 'En un triángulo, el lado que no toca al vértice del que se habla.' },
      { termino: 'demostración', def: 'Razonamiento que prueba que algo vale en todos los casos, no solo en el dibujo.' },
      { termino: 'proposición', def: 'En los Elementos de Euclides, cada afirmación numerada que se enuncia y después se prueba.' },
    ],
    laboratorio: [mesaLibre, mesaBisagra, Object.assign({ id: 'bisectrices', titulo: 'Ángulo entre bisectrices', pieza: 'geo-figura',
      invitaciones: [
        { texto: 'Haz que el ángulo BIC mida justo 120°.',
          logrado: v => Math.abs(anguloBIC(v) - 120) < 1e-6,
          bien: 'BIC = 120° pide A = 60°. Hay varias parejas de B y C.' },
        { texto: 'Busca el ángulo BIC más grande de la mesa.',
          logrado: v => Math.abs(anguloBIC(v) - BIC_MAX) < 1e-6,
          bien: 'El mayor BIC sale con el mayor A: crecen juntos.' },
        { texto: 'Haz que B y C sean iguales y mira dónde queda I.',
          logrado: v => v.b === v.c,
          bien: 'Con B = C, I cae en la bisectriz de A, que también es altura.' },
        { texto: 'Guarda dos casos con el mismo ángulo A y distintos B y C.',
          logrado: (v, gs) => gs.some(c => c.b !== v.b && 180 - c.b - c.c === 180 - v.b - v.c) && gs.some(c => c.b === v.b && c.c === v.c),
          bien: 'Mismo A, mismo BIC: solo cuenta A, no cómo se reparten B y C.' },
      ] }, bisectrices.juega)],
    // A qué idea pertenece cada mesa del laboratorio (Gerson, 16 nov: el laboratorio se agrupa por idea). El triángulo libre
    // practica también la suma (su reto de comparar sumas; propuesta §7a). Una lista vacía: «Más mesas del tema».
    laboratorioIdeas: {
      'triangulo-libre': ['suma-de-angulos', 'lineas-notables'],
      'bisagra-libre': ['desigualdad'],
      'bisectrices': ['angulo-de-bisectrices'],
    },
    ideas: [suma, exteriorIdea, isosceles, desigualdad, lineas, bisectrices],
  };
});
