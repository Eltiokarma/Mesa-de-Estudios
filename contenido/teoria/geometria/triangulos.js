/*
 * Teoría de «Triángulos y líneas notables» (geometria.triangulos), para 5.º de secundaria y preuniversitario. Molde:
 * docs/teoria.md y docs/molde-unidad.md. Fuente: docs/teoria/matriz/geometria.json (unidad 2); Elementos I.32 (suma de
 * ángulos) e I.20 (desigualdad). Compañera: Neri (nutria). Pieza: geo-objeto, con sus dibujos de prueba (la cartulina y
 * el tijeral; la plaza con el mototaxi; el compás y el techo a dos aguas; la lámpara de escritorio; el caserío junto a la
 * carretera; el parque con la pileta) y las figuras de examen, que trazan con geo-figura.
 *
 * Etapa 4 del plan de calidad (18 nov): la propuesta aprobada por Gerson con todas sus recomendaciones
 * (docs/etapa4/propuesta-geometria.md) y docs/etapa4/decisiones.md, que manda. Seis ideas: suma-de-angulos,
 * angulo-exterior (nueva), isosceles (nueva), desigualdad, lineas-notables y angulo-de-bisectrices; se conservan los id de
 * las cuatro de antes y los de las tres mesas. Fase 2: la idea 1 (visto bueno de Gerson, segunda ronda del 18 nov). Fase 3
 * (18 nov, noche): las ideas 2 a 6 con el contrato «se entiende sin profesor» completo; la unidad declara calidad: 2.
 * Cuentas de los 75 ejemplos nuevos rehechas aparte (scratchpad f3-geo/cuentas.js) y las de «Ahora tú», leyendo el
 * enunciado, en triangulos.test.js.
 * Ronda 2 del lector en frío (18 nov, noche): la consigna y la misión de las ideas 1, 2 y 6 dicen que A se arrastra o se
 * mueve con los controles; los ejemplos del tijeral, la señal, «Partir el ángulo» y «La mediana que mide la mitad» van sin
 * escala (sinEscala, con «El dibujo no está a escala.» y ningún ángulo dibujado que mida la respuesta); las tres reglas de
 * la idea 6 dicen qué es I, E y Q, y Q llega en «Lee» y en «Mira». Cuentas en scratchpad cor2-geo-cuentas/cuentas.py.
 * Rangos de los juegos que cambian de la propuesta (para que los rótulos quepan y no se lean como de otro vértice, a 390
 * px): plaza B y C de 50° a 70° (no 30° a 80°); compás de 40° a 80° (no de 20°); lámpara de 45° a 150° (no 15° a 165°),
 * con la misión en «más de 62 cm» (62,9 cm a 150°); parque B y C de 50° a 70°. En el juego del parque, m∠A y m∠BIC se
 * leen en la lectura; en el de la lámpara, la abertura del codo en su control.
 * Ángulos en cuñas angostas (las de ABD y ACD en la punta de flecha, ∠BEC, ∠HAF dado, los ángulos B y C enteros junto a
 * sus bisectrices): llevan su arco y su valor va en el enunciado, como las expresiones de la mariposa de la idea 1 (un
 * rótulo en una cuña angosta queda lejos de su vértice y se lee como de otro).
 * Controles de la idea 1 (decisión 6 de la propuesta): el juego mueve A con los ángulos b y c (de 5° en 5°), así los tres
 * rótulos suman siempre 180° exactos; ax y ay salen del juego. El avance guardado no se toca (el lector ignora los
 * valores de controles que ya no existen).
 *
 * REGLA DE COLORES DE LA UNIDAD (decisiones de la etapa 4; molde §5b: un color fijo por lo que cada cosa ES en la figura):
 *   - todo ángulo interior en carmín (h), con su arco y su letra; tres ángulos distintos se distinguen por 1, 2 o 3 arcos
 *     (1 en A, 2 en B, 3 en C) y sus copias y sus esquinas recortadas llevan los mismos arcos; dos ángulos iguales, los
 *     mismos arcos; en la mariposa (cuatro medidas de afuera), un arco en cada ángulo;
 *   - el ángulo exterior en turquesa (i), el compañero del interior (ideas 2 y 6: el giro del mototaxi; el exterior en C,
 *     su bisectriz y sus mitades); los lados dados, naranja y turquesa (ideas 3 y 4: la pata y el lado corto del techo en
 *     naranja, el lado largo en turquesa; el brazo de abajo naranja y el de arriba turquesa); altura naranja, mediana
 *     turquesa, bisectriz carmín y mediatriz en tinta discontinua (idea 5);
 *   - en los ejercicios (ejemplos, «Así se resuelve», «Ahora tú»), todo ángulo dado en carmín (también un exterior) y lo
 *     pedido con «?» en tinta; en la idea 5, las cevianas en tinta: la línea se reconoce por su marca, no por su color;
 *     el violeta (f) solo en el texto del resuelto y en la respuesta, nunca en una figura ni en un enunciado;
 *   - el verde no se usa.
 *   La comprueba triangulos.test.js en todas las figuras y textos de las seis ideas (juego en toda su grilla, «Lee»,
 *   predicción, «Mira», regla, ejemplos, y «Así se resuelve» y «Ahora tú» en 400 semillas).
 * Notación (decisión 5): m∠A cuando el vértice tiene un solo ángulo en la figura; m∠BAC cuando tiene varios; x sin «°»
 * (m∠A = 2x + 10°, x = 20); nunca C(x) ni S(x), porque C es un vértice; los lados por sus letras (AB), sin la convención
 * a, b, c de Relaciones métricas.
 * Códigos de error: GE7 y GE8 (docs/investigacion/geometria-ideas-erroneas.md; GE7 se parte en GE7-a y GE7-b); GE-ANG1
 * viene de Segmentos y ángulos; los GE-TRI, GE-RAZ, GE-EXT, GE-ISO, GE-DT, GE-LN y GE-BIS son hipótesis de aula, sin
 * medir (rutinas/teoria-geometria.md, el informe de geometría, sección «Triángulos (18 nov)», y el bloque de cada idea).
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
  const SEP = '   ·   ';                // solo en la ecuación de «La regla», que lo parte en renglones (ecuacion.js)
  // Entre dos igualdades fuera de la regla, «y» (un «·» se leía como otra igualdad; auditoría, B2).
  const Y = '   y   ', COMA = ',   ';
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
  // 2k + 5k = 126, k = 18, 36 y 90 (rectángulo); 180 − 5x > 90, x < 18, el mayor entero 17; 3x + 2x + 15 = x + 25 + 70,
  // x = 20, m∠AOB = 180 − 60 − 55 = 65 (= 180 − 45 − 70; correcciones del 18 nov, rehecho en scratchpad cor-geo); ∠ADB = 180 − 40 − 35 = 105, ∠ADC = 75, m∠DAC = 180 − 75 − 60
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
    // Sin escala (lector en frío, ronda 2: con transportador se medía la respuesta): abajo se dibujan 40°, arriba 100°.
    figura: fig({ objeto: 'tijeral', b: 40, c: 40, sinEscala: true, alt: 'Tijeral de un techo, sin escala: dos vigas inclinadas y una horizontal; cada inclinada forma 35° con la de abajo y el ángulo de arriba lleva «?».',
      angulos: { A: { texto: '?' }, B: { texto: '35°', color: 'h', marcas: 2 }, C: { texto: '35°', color: 'h', marcas: 2 } } }),
    enunciado: 'En un tijeral, cada viga inclinada forma 35° con la viga de abajo. ¿Cuánto mide el ángulo de arriba, entre las dos vigas inclinadas? El dibujo no está a escala.',
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
      { texto: 'El mayor tiene 4 partes de 20°:', ecuacion: junto(['m∠C = 4 · 20 = ', dF('80°')]) },
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
      { texto: 'A es una parte y B, dos: entre los dos son tres partes, que se reparten lo que deja C.', ecuacion: [junto('3 · m∠A = 180° − 66° = 114°'), '   →   ', junto('m∠A = 38°')] },
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
  // (Auditoría, M10: con C y D numéricos, ∠COD salía en un paso; ahora C también va con x y la x hace falta.)
  EJ1.push({ nivel: 3, titulo: 'La mariposa: el ángulo en O',
    figura: fig(figM(60, 55, 45, 70, { A: { color: 'h' }, B: { color: 'h' }, C: { color: 'h' }, D: { texto: '70°', color: 'h' }, O: { texto: '?' } })),
    enunciado: 'Los segmentos AD y BC se cortan en O. m∠A = 3x, m∠B = 2x + 15°, m∠C = x + 25° y m∠D = 70°. ¿Cuánto mide el ángulo AOB?',
    datos: [D_SUMA_O, D_OPUESTOS],
    solucion: [
      { texto: 'Opuestos por el vértice: los dos ángulos en O miden igual, así que A y B suman lo mismo que C y D:', ecuacion: [junto('3x + 2x + 15° = x + 25° + 70°'), '   →   ', junto('5x + 15° = x + 95°'), '   →   ', junto('4x = 80'), '   →   ', junto('x = 20')] },
      { texto: 'Entonces m∠A = 60° y m∠B = 55°. En el triángulo AOB:', ecuacion: junto(['m∠AOB = 180° − 60° − 55° = ', dF('65°')]) },
      { texto: 'Compruebo en COD: m∠C = 45°, y 45° + 70° + 65° = 180°.' },
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
      solucion: { texto: `Hay ${raz[0] + raz[1] + raz[2]} partes en 180°.`, ecuacion: [junto(`${raz[0] + raz[1] + raz[2]}k = 180`), '   →   ', junto(`k = ${k}`), '   →   ', junto(`${p} · ${k} = ${p * k}°`)] },
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
        { titulo: 'Qué mirar al jugar', texto: 'Vas a mover la punta A, arrastrándola o con los controles de B y C; la base BC queda quieta. Arma triángulos bien distintos: uno alto y otro bajo y ancho. Compara lo que suman sus tres ángulos.' },
      ],
    },
    ejemplos: EJ1,
    juega: {
      pieza: GO,
      consigna: 'La cartulina está junto a una regla, con la base BC fija. La punta A se arrastra o se mueve con los controles.',
      mision: {
        texto: `Arrastra la punta A, o usa los controles, hasta que ${junto('m∠A = m∠B + m∠C')}.`,
        logrado: v => 180 - v.b - v.c === v.b + v.c,
        bien: 'Listo: m∠A = 90°, lo mismo que m∠B + m∠C. Los tres juntos, 180°.',
      },
      voz: 'Estira la cartulina. ¿Qué cambia y qué se queda igual?',
      leyenda: [
        { s: 'A, B, C', t: 'las puntas de la cartulina; A se arrastra' },
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
      pregunta: 'Rosa recortó dos esquinas de cartulina, una de 100° y otra de 95°, para armar un triángulo con las dos. ¿Puede existir ese triángulo?',
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
      condicion: 'el triángulo está en un plano, como una hoja, no en una pelota. A lo más un ángulo es recto u obtuso.',
      // Por qué las copias miden igual (lector en frío, ronda 2): alternos internos entre la paralela y BC.
      voz: 'Junto a A se copian B y C: son alternos internos entre paralelas.',
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
              { tipo: 'cuentas', texto: `Si a 90° le quito los ${d}° de ventaja, quedan dos partes iguales a m∠B.`, ecuacion: [junto(`2 · m∠B = 90° − ${d}° = ${90 - d}°`), '   →   ', junto(`m∠B = ${b}°`), Y, junto(['m∠A = ', `${b}° + ${d}° = `, dF(`${a}°`)])] },
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
            { tipo: 'cuentas', texto: 'B son dos partes y C una: en total, tres partes iguales.', ecuacion: [junto(`3 · m∠C = ${180 - a}°`), '   →   ', junto(`m∠C = ${c}°`), Y, junto(['m∠B = 2 · ', `${c}° = `, dF(`${b}°`)])] },
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

  // ---------- Ayudantes de las ideas 2 a 6 (fase 3, 18 nov) ----------
  const dO = t => ({ v: 'c-o', t });
  // Una figura de geo-objeto sirve si sus rótulos caben y cada rótulo de ángulo queda claramente más cerca de su vértice
  // que de otro vértice con ángulo marcado (vale para cualquier escena, no solo la figura de examen).
  function propios(F, k = 0.85) {
    const R = PO.rotulos(F), ids = [...new Set((R.fig.angulos || []).map(q => q.en))];
    return R.rot.every(z => {
      const cx = (z.caja.x0 + z.caja.x1) / 2, cy = (z.caja.y0 + z.caja.y1) / 2, d = id => { const v = R.vertice(id); return Math.hypot(cx - v[0], cy - v[1]); };
      return ids.every(id => id === z.an.en || d(z.an.en) < k * d(id));
    });
  }
  const sirve = F => PO.escenaCabe(F) && propios(F);
  const LET = ['A', 'B', 'C'];
  const fmtCm = n => `${f(n)} cm`;
  // La figura de examen de un triángulo con sus exteriores: la plaza sin calles (examen: true).
  const TRI = (b, c, o = {}) => Object.assign({ objeto: 'plaza', examen: true, b, c }, o);
  const t = (x, color = 'h', o = {}) => Object.assign({ texto: x, color }, o);     // un ángulo dado (carmín) o con «?» (sin color)
  const pide = (o = {}) => Object.assign({ texto: '?' }, o);

  const D_EXT = 'Un ángulo exterior mide lo que suman los dos ángulos interiores que no están a su lado.';
  const D_EXT3 = 'Los tres ángulos exteriores de un triángulo, uno en cada vértice, suman 360°.';
  const D_EXTDEF = 'El ángulo exterior en C, ∠ACD, lo forman el lado CA y la prolongación de BC.';

  // ---------- Idea 2 (rehecha, 18 nov): el ángulo exterior ----------
  // Objeto de la primera pantalla: una plaza triangular vista desde arriba y el mototaxi que la rodea (geo-objeto, plaza;
  // dibujo de prueba). Cambia: la esquina A (los ángulos en B y C, de 10° en 10°). · Permanece: las calles BC y su
  // prolongación hasta D. · Progresa: el giro del mototaxi en C, que siempre suma los ángulos de A y B. · Se reserva: la
  // suma de los tres giros (la predicción) y por qué el giro suma A y B (en «Mira»). · Debe verse: el giro en C y el
  // ángulo de adentro en C forman una recta.
  // Colores (regla de la unidad): interiores en carmín (1, 2 y 3 arcos), el giro (exterior) en turquesa; en los
  // ejercicios, todo ángulo dado en carmín (también un exterior) y lo pedido con «?» en tinta.
  // Errores (hipótesis, sin medir; rutinas/teoria-geometria.md): GE-EXT1 iguala la suma de los exteriores a 180°, GE-EXT2
  // cuenta 180° en cada vértice (540°), GE-EXT3 cree que la suma depende de la forma (propuesta); nuevos (18 nov): GE-EXT4
  // da el interior del mismo vértice en vez del exterior, GE-EXT5 resta de 180° un solo ángulo lejano, GE-EXT6 resta los
  // dos lejanos en vez de sumarlos, GE-EXT7 suma el exterior con un interior en vez de restar, GE-EXT8 iguala a 180° la
  // suma de los dos lejanos y el exterior, GE-EXT9 da uno de los interiores en vez del exterior pedido, GE-EXT10 en la
  // punta de flecha suma solo dos de los tres ángulos, GE-EXT11 toma el ángulo de afuera de la punta (360° menos la
  // suma), GE-EXT12 cree que el ángulo de la punta es lo que suman los ángulos B y C del triángulo grande; de la idea 1,
  // GE-TRI13, GE-TRI14 y GE-TRI15 (x por ángulo, ángulo por x, signo al despejar).
  const VJ2 = { x: [-1.0, 9.0], y: [-1.15, 8.95] };
  const AJ2 = (b, c) => ({ A: t(`${180 - b - c}°`), B: t(`${b}°`), C: t(`${c}°`) });
  const figJ2 = (b, c) => ({ objeto: 'plaza', b, c, radio: 14, angulos: AJ2(b, c), exteriores: { C: t(`${180 - c}°`, 'i') }, mototaxi: true, vista: VJ2, alto: 270, manija: 'A' });
  // Predicción y «Mira»: la plaza de 50°, 60° y 70° (A, B y C) con los tres giros.
  const PRED2 = (rev, o = {}) => Object.assign({ objeto: 'plaza', b: 60, c: 70, prolonga: 1.6, alto: 270, angulos: { A: t('50°'), B: t('60°'), C: t('70°') },
    exteriores: rev ? { A: t('130°', 'i'), B: t('120°', 'i'), C: t('110°', 'i') } : { A: pide(), B: pide(), C: pide() } }, o);
  // El cóncavo (punta de flecha): D dentro del triángulo ABC, con ∠ABD = p y ∠ACD = q. Devuelve la figura de examen.
  // Los ángulos ABD y ACD son cuñas angostas: llevan su arco (uno y dos) y su valor va en el enunciado, como las
  // expresiones de la mariposa (un rótulo en una cuña angosta queda lejos de su vértice y se lee como de D).
  function flecha(b, c, p, q, rot, o = {}) {
    const { A } = vert(b, c), D = U.corte([0, 0], U.polar([0, 0], 1, b - p), [6, 0], U.polar([6, 0], 1, 180 - c + q));
    const pts = [{ id: 'D', x: D[0], y: D[1], rotulo: 'D', lado: 90, sinPunto: true }];
    const segs = [{ de: 'B', a: 'D' }, { de: 'D', a: 'C' }];
    const angs = [];
    if (rot.p) angs.push(Object.assign({ en: 'B', de: 'D', a: 'A', radio: 34, holgura: 6, mide: p }, rot.p));
    if (rot.q) angs.push(Object.assign({ en: 'C', de: 'A', a: 'D', radio: 34, holgura: 6, mide: q, marcas: 2 }, rot.q));
    if (rot.D) angs.push(Object.assign({ en: 'D', de: 'B', a: 'C', radio: 12, holgura: 5, mide: 180 - (b - p) - (c - q), marcas: 3 }, rot.D));
    if (o.P) {
      // La prolongación de BD hasta el lado AC, en P (la que usa el resuelto).
      const P = U.corte([0, 0], D, A, [6, 0]);
      pts.push({ id: 'P', x: P[0], y: P[1], rotulo: 'P', lado: 90 - c, sinPunto: true });
      segs.push({ de: 'D', a: 'P', discontinua: true, grosor: 'fino' });
    }
    const { A: AA } = vert(b, c);
    return TRI(b, c, { angulos: { A: rot.A || {}, B: null, C: null }, masPuntos: pts, masSegmentos: segs, masAngulos: angs, alto: 262, vista: { x: [-0.7, 6.7], y: [-0.85, AA[1] + 0.75] },
      alt: o.alt || 'Triángulo ABC con un punto D adentro, unido a B y a C: la figura ABDC tiene forma de punta de flecha.' });
  }
  // La antena AB sobre el techo y dos cables, a C y a D (ejemplo de nivel 3).
  function antena() {
    const h = 3, C = [h / Math.tan(60 * RAD), 0], D = [h / Math.tan(30 * RAD), 0];
    return { objeto: 'angulos', figura: { alt: 'Una antena vertical AB sobre el techo plano; dos cables van de la punta A al techo, a C y a D, más lejos.',
      vista: { x: [-0.9, D[0] + 0.9], y: [-0.85, h + 0.8] }, alto: 240,
      puntos: [{ id: 'A', x: 0, y: h, rotulo: 'A', lado: 135, sinPunto: true }, { id: 'B', x: 0, y: 0, rotulo: 'B', lado: 225, sinPunto: true }, { id: 'C', x: C[0], y: 0, rotulo: 'C', lado: -90, sinPunto: true }, { id: 'D', x: D[0], y: 0, rotulo: 'D', lado: -60, sinPunto: true }],
      segmentos: [{ de: 'A', a: 'B', grosor: 'variable' }, { de: 'B', a: 'D' }, { de: 'A', a: 'C' }, { de: 'A', a: 'D' }],
      angulos: [{ en: 'C', de: 'A', a: 'B', texto: '60°', color: 'h', radio: 22, holgura: 6 }, { en: 'D', de: 'A', a: 'C', color: 'h', radio: 30, holgura: 6, marcas: 2, mide: 30 },
        { en: 'A', de: 'C', a: 'D', texto: '?', radio: 40, holgura: 6, mide: 30 }] } };
  }
  // Una ceviana AD del lado BC que forma ∠BAD = p con AB (para «dos triángulos encadenados»).
  function conCeviana(b, c, p) {
    const { A } = vert(b, c), D = U.corte(A, U.polar(A, 1, 180 + b + p), [0, 0], [6, 0]);
    return { D, puntos: [{ id: 'D', x: D[0], y: 0, rotulo: 'D', lado: -90, sinPunto: true }], segmentos: [{ de: 'A', a: 'D' }] };
  }

  // Ejemplos resueltos de «El ángulo exterior» (molde §3). Cuentas rehechas con un script aparte, sin el código de la
  // unidad (scratchpad f3-geo/cuentas.js): 55 + 65 = 120; 180 − 72 = 108; 360 − 140 − 100 = 120; 35 + 90 = 125;
  // 130 − 75 = 55; 5x = 125, x = 25; 180 − 115 = 65, 180 − 135 = 45, 180 − 65 − 45 = 70; 3A = A + 50, A = 25, 75;
  // 12k = 360, k = 30, 180 − 90 = 90; 6x + 30 = 180, x = 25, 110; 50 + 35 = 85, 85 + 30 = 115; 3x = x + 70, x = 35,
  // 180 − 105 = 75; 12x + 60 = 360, x = 25, 180 − 105 = 75; 60 + 35 = 95, 180 − 95 − 45 = 40; 60 − 30 = 30.
  const EJ2 = [];
  EJ2.push({ nivel: 1, titulo: 'El giro en una esquina',
    figura: fig({ objeto: 'plaza', b: 65, c: 60, angulos: { A: t('55°'), B: t('65°'), C: null }, exteriores: { C: pide() }, mototaxi: true }),
    enunciado: 'Un mototaxi rodea una plaza triangular. En la esquina A la plaza mide 55° y en la esquina B, 65°. ¿Cuánto gira el mototaxi al doblar en la esquina C?',
    datos: [D_EXT],
    solucion: [{ texto: 'El giro en C es el ángulo exterior en C: suma los dos ángulos de la plaza que no están en C.', ecuacion: junto(['m∠ACD = 55° + 65° = ', dF('120°')]) }],
    respuesta: ['Gira ', dF('120°')] });
  EJ2.push({ nivel: 1, titulo: 'Del interior al exterior',
    figura: fig(TRI(50, 72, { angulos: { A: null, B: null, C: t('72°') }, exteriores: { C: pide() } })),
    enunciado: 'En el triángulo ABC, el ángulo C mide 72°. Se prolonga el lado BC más allá de C, hasta D. ¿Cuánto mide el ángulo ACD?',
    datos: [D_ADY],
    solucion: [{ texto: 'ACD y ACB forman una recta: suman 180°.', ecuacion: junto(['m∠ACD = 180° − 72° = ', dF('108°')]) }],
    respuesta: ['m∠ACD = ', dF('108°')] });
  EJ2.push({ nivel: 1, titulo: 'El último giro',
    figura: fig({ objeto: 'plaza', b: 80, c: 60, prolonga: 1.6, letraD: false, angulos: { A: null, B: null, C: null }, exteriores: { A: t('140°'), B: t('100°'), C: pide() } }),
    enunciado: 'El mototaxi da una vuelta a la plaza: gira 140° en la esquina A y 100° en la esquina B. ¿Cuánto gira en la esquina C?',
    datos: [D_EXT3],
    solucion: [{ texto: 'Los tres giros dan una vuelta completa: 360°. Le quito los dos que conozco.', ecuacion: junto(['360° − 140° − 100° = ', dF('120°')]) }],
    respuesta: ['Gira ', dF('120°'), ' en C'] });
  EJ2.push({ nivel: 1, titulo: 'Exterior con un ángulo recto',
    figura: fig(TRI(90, 55, { angulos: { A: t('35°'), B: { color: 'h' }, C: null }, exteriores: { C: pide() } })),
    enunciado: 'En el triángulo ABC, el ángulo B es recto y m∠A = 35°. Se prolonga BC más allá de C, hasta D. ¿Cuánto mide el ángulo ACD?',
    datos: [D_EXT, D_RECTO],
    solucion: [{ texto: 'El exterior en C suma los dos interiores lejanos: el de A y el recto de B.', ecuacion: junto(['m∠ACD = 35° + 90° = ', dF('125°')]) }],
    respuesta: ['m∠ACD = ', dF('125°')] });
  EJ2.push({ nivel: 1, titulo: 'El interior que falta',
    figura: fig(TRI(55, 50, { angulos: { A: t('75°'), B: pide(), C: null }, exteriores: { C: t('130°') } })),
    enunciado: 'En el triángulo ABC, el ángulo exterior ACD mide 130° y m∠A = 75°. ¿Cuánto mide el ángulo B?',
    datos: [D_EXT],
    solucion: [{ texto: 'A y B juntos dan el exterior, 130°. Le quito el de A:', ecuacion: junto(['m∠B = 130° − 75° = ', dF('55°')]) }],
    respuesta: ['m∠B = ', dF('55°')] });
  EJ2.push({ nivel: 2, titulo: 'Exterior con x',
    figura: fig(TRI(75, 55, { angulos: { A: t('2x', 'h', { mide: 50 }), B: t('3x'), C: null }, exteriores: { C: t('125°') } })),
    enunciado: 'En el triángulo ABC, m∠A = 2x, m∠B = 3x y el ángulo exterior ACD mide 125°. ¿Cuánto vale x?',
    datos: [D_EXT],
    solucion: [
      { texto: 'El exterior en C suma los dos interiores lejanos, A y B:', ecuacion: [junto('2x + 3x = 125'), '   →   ', junto('5x = 125'), '   →   ', junto(['x = ', dF('25')])] },
      { texto: 'Compruebo: m∠A = 50° y m∠B = 75°; juntos, 125°.' },
    ],
    respuesta: ['x = ', dF('25')] });
  EJ2.push({ nivel: 2, titulo: 'Dos exteriores',
    figura: fig(TRI(65, 45, { prolonga: 1.8, angulos: { A: pide(), B: null, C: null }, exteriores: { B: t('115°'), C: t('135°') } })),
    enunciado: 'En el triángulo ABC, el ángulo exterior en B mide 115° y el exterior en C mide 135°. ¿Cuánto mide el ángulo A?',
    datos: [D_ADY, D_SUMA],
    solucion: [
      { texto: 'Cada interior es lo que le falta a su exterior para 180°:', ecuacion: [junto('m∠B = 180° − 115° = 65°'), Y, junto('m∠C = 180° − 135° = 45°')] },
      { texto: 'Los tres interiores suman 180°:', ecuacion: junto(['m∠A = 180° − 65° − 45° = ', dF('70°')]) },
    ],
    respuesta: ['m∠A = ', dF('70°')] });
  EJ2.push({ nivel: 2, titulo: 'El triple de un ángulo',
    figura: fig(TRI(50, 105, { angulos: { A: {}, B: t('50°'), C: null }, exteriores: { C: pide() } })),
    enunciado: 'En el triángulo ABC, el ángulo exterior ACD mide el triple del ángulo A, y m∠B = 50°. ¿Cuánto mide el ángulo ACD?',
    datos: [D_EXT],
    solucion: [
      { texto: 'El exterior es A + B, y también es 3 veces A:', ecuacion: [junto('3 · m∠A = m∠A + 50°'), '   →   ', junto('2 · m∠A = 50°'), '   →   ', junto('m∠A = 25°')] },
      { texto: 'El exterior es el triple:', ecuacion: junto(['m∠ACD = 3 · 25° = ', dF('75°')]) },
    ],
    respuesta: ['m∠ACD = ', dF('75°')] });
  EJ2.push({ nivel: 2, titulo: 'Exteriores en razón 3 : 4 : 5',
    enunciado: 'Los tres ángulos exteriores de un triángulo, uno en cada vértice, están en razón 3 : 4 : 5. ¿Cuánto mide el mayor ángulo interior?',
    datos: [D_EXT3, 'Razón 3 : 4 : 5: los exteriores miden 3k, 4k y 5k grados.', D_ADY],
    solucion: [
      { texto: 'Los tres exteriores suman 360°:', ecuacion: [junto('3k + 4k + 5k = 360'), '   →   ', junto('12k = 360'), '   →   ', junto('k = 30')] },
      { texto: 'Miden 90°, 120° y 150°. El mayor interior está junto al menor exterior:', ecuacion: junto(['180° − 90° = ', dF('90°')]) },
    ],
    respuesta: ['Mide ', dF('90°')] });
  EJ2.push({ nivel: 2, titulo: 'El giro con x',
    figura: fig({ objeto: 'plaza', b: 60, c: 70, angulos: { A: null, B: null, C: t('2x + 20°', 'h', { mide: 70 }) }, exteriores: { C: t('4x + 10°', 'h', { mide: 110 }) }, mototaxi: true }),
    enunciado: 'En la esquina C de la plaza, el mototaxi gira 4x + 10° y el ángulo de la plaza mide 2x + 20°. ¿Cuánto gira el mototaxi en C?',
    datos: [D_ADY],
    solucion: [
      { texto: 'El giro y el ángulo de la plaza forman una recta:', ecuacion: [junto('4x + 10° + 2x + 20° = 180°'), '   →   ', junto('6x = 150'), '   →   ', junto('x = 25')] },
      { texto: 'Reemplazo x en el giro:', ecuacion: junto(['4 · 25 + 10° = ', dF('110°')]) },
    ],
    respuesta: ['Gira ', dF('110°')] });
  EJ2.push({ nivel: 3, titulo: 'La punta de flecha',
    figura: fig(flecha(65, 65, 35, 30, { A: t('50°'), p: { color: 'h' }, q: { color: 'h' }, D: pide() }, { P: true })),
    enunciado: 'En la figura, D está dentro del triángulo ABC. m∠BAC = 50°, m∠ABD = 35° y m∠ACD = 30°. ¿Cuánto mide el ángulo BDC?',
    datos: [D_EXT],
    solucion: [
      { texto: 'Prolongo BD hasta el lado AC, en P. ∠BPC es exterior del triángulo ABP:', ecuacion: junto('m∠BPC = 50° + 35° = 85°') },
      { texto: '∠BDC es exterior del triángulo DPC:', ecuacion: junto(['m∠BDC = 85° + 30° = ', dF('115°')]) },
      { texto: 'Es la suma de los tres ángulos: 50° + 35° + 30°.' },
    ],
    respuesta: ['m∠BDC = ', dF('115°')] });
  EJ2.push({ nivel: 3, titulo: 'Exterior e interior con x',
    figura: fig(TRI(40, 75, { angulos: { A: t('x + 30°', 'h', { mide: 65 }), B: t('40°'), C: pide() }, exteriores: { C: t('3x', 'h', { mide: 105 }) } })),
    enunciado: 'En el triángulo ABC, D está en la prolongación de BC. m∠ACD = 3x, m∠A = x + 30° y m∠B = 40°. ¿Cuánto mide el ángulo ACB?',
    datos: [D_EXT, D_ADY],
    solucion: [
      { texto: 'El exterior en C suma A y B:', ecuacion: [junto('3x = x + 30° + 40°'), '   →   ', junto('2x = 70'), '   →   ', junto('x = 35')] },
      { texto: 'Entonces m∠ACD = 105°, y ACB es su vecino en la recta:', ecuacion: junto(['m∠ACB = 180° − 105° = ', dF('75°')]) },
    ],
    respuesta: ['m∠ACB = ', dF('75°')] });
  EJ2.push({ nivel: 3, titulo: 'Tres exteriores con x',
    figura: fig(TRI(60, 75, { prolonga: 1.7, alto: 270, angulos: { A: null, B: null, C: pide() }, exteriores: { A: t('5x + 10°', 'h', { mide: 135 }), B: t('4x + 20°', 'h', { mide: 120 }), C: t('3x + 30°', 'h', { mide: 105 }) } })),
    enunciado: 'Los ángulos exteriores de un triángulo ABC miden 5x + 10° en A, 4x + 20° en B y 3x + 30° en C. ¿Cuánto mide el ángulo interior en C?',
    datos: [D_EXT3, D_ADY],
    solucion: [
      { texto: 'Los tres exteriores suman 360°:', ecuacion: [junto('12x + 60° = 360°'), '   →   ', junto('12x = 300'), '   →   ', junto('x = 25')] },
      { texto: 'El exterior en C mide 3 · 25 + 30° = 105°. El interior es su vecino en la recta:', ecuacion: junto(['180° − 105° = ', dF('75°')]) },
    ],
    respuesta: ['El interior en C mide ', dF('75°')] });
  EJ2.push({ nivel: 3, titulo: 'Dos triángulos encadenados',
    figura: (() => { const cv = conCeviana(60, 45, 35); return fig(TRI(60, 45, { angulos: { A: null, B: t('60°'), C: t('45°') }, masPuntos: cv.puntos, masSegmentos: cv.segmentos,
      // El 35° de BAD va solo en el enunciado (cuña angosta: su rótulo bajaba hasta el 60° de B; lector en frío, ronda 2).
      masAngulos: [{ en: 'A', de: 'B', a: 'D', color: 'h', radio: 26, holgura: 6, mide: 35 }, { en: 'A', de: 'D', a: 'C', texto: '?', radio: 36, holgura: 6, mide: 40 }] })); })(),
    enunciado: 'En el triángulo ABC, D está en el lado BC. m∠B = 60°, m∠BAD = 35° y m∠C = 45°. ¿Cuánto mide el ángulo DAC?',
    datos: [D_EXT, D_SUMA_O],
    solucion: [
      { texto: '∠ADC es exterior del triángulo ABD: suma sus dos interiores lejanos.', ecuacion: junto('m∠ADC = 60° + 35° = 95°') },
      { texto: 'En el triángulo ADC, los tres suman 180°:', ecuacion: junto(['m∠DAC = 180° − 95° − 45° = ', dF('40°')]) },
    ],
    respuesta: ['m∠DAC = ', dF('40°')] });
  EJ2.push({ nivel: 3, titulo: 'La antena y sus dos cables',
    figura: fig(antena()),
    enunciado: 'Una antena vertical AB está sobre un techo plano. Un cable va de A a C y forma 60° con el techo; otro va de A a D, más lejos, y forma 30°. ¿Qué ángulo forman los cables en A?',
    datos: [D_EXT],
    solucion: [
      { texto: 'En el triángulo ACD, el ángulo de 60° en C es exterior: está entre CA y la prolongación de DC.', ecuacion: junto('60° = m∠CAD + 30°') },
      { texto: 'Despejo el ángulo en A:', ecuacion: junto(['m∠CAD = 60° − 30° = ', dF('30°')]) },
    ],
    respuesta: ['Forman ', dF('30°')] });

  // «Ahora tú» de la idea 2: cinco tipos, uno por semilla (s % 5).
  // Dos ángulos múltiplos de 5 y el tercero, cada uno entre lo y hi.
  function dosDe(r, lo, hi) { for (;;) { const a = 5 * r.ent(lo / 5, hi / 5), b = 5 * r.ent(lo / 5, hi / 5), c = 180 - a - b; if (c >= lo && c <= hi && a !== b) return [a, b, c]; } }
  function casoExt(r) {
    for (let i = 0; i < 400; i++) {
      const [a, b, c] = dosDe(r, 30, 95), F = TRI(b, c, { angulos: { A: t(`${a}°`), B: t(`${b}°`), C: {} }, exteriores: { C: pide() } });
      if (!sirve(F)) continue;
      return { pregunta: `En el triángulo ABC, m∠A = ${a}° y m∠B = ${b}°. Se prolonga BC más allá de C, hasta D. ¿Cuánto mide el ángulo ACD?`,
        datos: [D_EXT, D_ADY], dibujo: fig(F),
        opciones: opciones(a + b, [
          { id: 'interior', valor: c, error: 'GE-EXT4', siFuera: `${c}° es el ángulo de adentro en C; el exterior es su vecino en la recta.` },
          { id: 'uno', valor: 180 - b, error: 'GE-EXT5', siFuera: 'Restar de 180° sirve con el interior de C; con un ángulo lejano no.' },
          { id: 'resta', valor: Math.abs(a - b), error: 'GE-EXT6', siFuera: 'Usar los dos ángulos lejanos está bien; el exterior los suma, no los resta.' },
        ], gr),
        solucion: { texto: 'El exterior en C suma los interiores A y B.', ecuacion: junto(`m∠ACD = ${a}° + ${b}° = ${a + b}°`) } };
    }
    throw new Error('casoExt');
  }
  // Una expresión con x: «2x + 10°», «x − 5°», «3x» (exp, de la idea 1).
  function casoExtX(r) {
    for (let i = 0; i < 4000; i++) {
      const x = r.ent(10, 30), aA = r.ent(1, 3), aB = r.ent(1, 2), aE = aA + aB + r.ent(1, 2), bA = 5 * r.ent(-2, 6), bB = 5 * r.ent(-2, 6);
      const A = aA * x + bA, B = aB * x + bB, E = A + B, bE = E - aE * x, C = 180 - E;
      if (A < 20 || B < 20 || C < 20 || Math.abs(bE) > 60 || bE % 5 !== 0) continue;
      const F = TRI(B, C, { angulos: { A: t(exp(aA, bA), 'h', { mide: A }), B: t(exp(aB, bB), 'h', { mide: B }), C: {} }, exteriores: { C: t(exp(aE, bE), 'h', { mide: E }) } });
      if (!sirve(F)) continue;
      const pideX = r() < 0.5, ent = n => (Number.isInteger(n) && n > 0 ? n : NaN);
      const SA = aA + aB, SB = bA + bB;
      const ops = pideX ? opciones(x, [
        { id: 'llano', valor: ent((180 - SB - bE) / (SA + aE)), error: 'GE-EXT8', siFuera: 'Igualar es la idea; pero el exterior es igual a A + B, no suma 180° con ellos.' },
        { id: 'signo', valor: ent((bE + SB) / (aE - SA)), error: 'GE-TRI15', siFuera: 'Igualar el exterior con A + B está bien; al pasar los números, cambia su signo.' },
        { id: 'angulo', valor: E, error: 'GE-TRI13', siFuera: `${E}° es lo que mide el exterior; piden x, el número de las expresiones.` },
      ], NUM) : opciones(E, [
        { id: 'x', valor: x, error: 'GE-TRI14', siFuera: `Hallar x = ${x} está bien; falta reemplazarlo en la expresión del exterior.` },
        { id: 'interior', valor: C, error: 'GE-EXT4', siFuera: `${C}° es el ángulo de adentro en C; piden el exterior, su vecino.` },
        { id: 'lejano', valor: A, error: 'GE-EXT9', siFuera: `${A}° mide el ángulo A, uno de los dos que se suman; piden el exterior.` },
      ], gr);
      if (ops.length < 4) continue;
      const ec = [junto(`${exp(aE, bE)} = ${exp(aA, bA)} + ${exp(aB, bB)}`), '   →   ', junto(`x = ${x}`)];
      return { pregunta: `En el triángulo ABC, D está en la prolongación de BC. m∠A = ${exp(aA, bA)}, m∠B = ${exp(aB, bB)} y m∠ACD = ${exp(aE, bE)}. ${pideX ? '¿Cuánto vale x?' : '¿Cuánto mide el ángulo ACD?'}`,
        datos: [D_EXT], dibujo: fig(F), opciones: ops,
        solucion: { texto: pideX ? 'El exterior es igual a A + B: igualo y despejo.' : 'Igualo el exterior con A + B, despejo x y reemplazo.', ecuacion: pideX ? ec : [...ec, '   →   ', junto(`m∠ACD = ${E}°`)] } };
    }
    throw new Error('casoExtX');
  }
  function casoIntDesdeExt(r) {
    for (let i = 0; i < 400; i++) {
      const [a, b, c] = dosDe(r, 30, 95), e = a + b, F = TRI(b, c, { angulos: { A: t(`${a}°`), B: pide(), C: {} }, exteriores: { C: t(`${e}°`) } });
      if (!sirve(F)) continue;
      const ops = opciones(b, [
        { id: 'suma', valor: e + a, error: 'GE-EXT7', siFuera: 'El exterior y A se relacionan, cierto; pero A + B = exterior: hay que restar.' },
        { id: 'interior', valor: c, error: 'GE-EXT4', siFuera: `${c}° es el ángulo de adentro en C; piden el ángulo B.` },
        { id: 'uno', valor: 180 - a, error: 'GE-EXT5', siFuera: 'Restar de 180° sirve entre vecinos en una recta; A y B no lo son.' },
      ], gr);
      if (ops.length < 4) continue;
      return { pregunta: `En el triángulo ABC, el ángulo exterior ACD mide ${e}° y m∠A = ${a}°. ¿Cuánto mide el ángulo B?`,
        datos: [D_EXT, D_ADY], dibujo: fig(F), opciones: ops,
        solucion: { texto: 'A + B es el exterior: le quito el de A.', ecuacion: junto(`m∠B = ${e}° − ${a}° = ${b}°`) } };
    }
    throw new Error('casoIntDesdeExt');
  }
  function casoTresExt(r) {
    for (let i = 0; i < 400; i++) {
      const [a, b, c] = dosDe(r, 35, 90), eA = 180 - a, eB = 180 - b, eC = 180 - c;
      const F = TRI(b, c, { prolonga: 1.6, alto: 270, angulos: { A: null, B: null, C: null }, exteriores: { A: t(`${eA}°`), B: t(`${eB}°`), C: pide() } });
      if (!sirve(F)) continue;
      const ops = opciones(eC, [
        { id: 'iguales', valor: 120, error: 'GE-EXT13', siFuera: '120° saldría si los tres giros fueran iguales; aquí cada uno mide distinto.' },
        { id: 'llanos', valor: 540 - eA - eB, error: 'GE-EXT2', siFuera: 'Cada exterior con su interior da 180°; pero los tres exteriores solos suman 360°.' },
        { id: 'interior', valor: c, error: 'GE-EXT4', siFuera: `${c}° es el ángulo de adentro en C; piden el exterior.` },
      ], gr);
      if (ops.length < 4) continue;
      return { pregunta: `En el triángulo ABC, el ángulo exterior en A mide ${eA}° y el exterior en B mide ${eB}°. ¿Cuánto mide el ángulo exterior en C?`,
        datos: [D_EXT3], dibujo: fig(F), opciones: ops,
        solucion: { texto: 'Los tres exteriores dan una vuelta: 360°.', ecuacion: junto(`360° − ${eA}° − ${eB}° = ${eC}°`) } };
    }
    throw new Error('casoTresExt');
  }
  function casoFlecha(r) {
    for (let i = 0; i < 4000; i++) {
      const a = 5 * r.ent(10, 12), p = 5 * r.ent(6, 8), q = 5 * r.ent(6, 8);
      if (p === q || a + p + q > 130) continue;
      const b = 5 * r.ent((p + 30) / 5, 20), c = 180 - a - b;
      if (c < q + 30 || b > 100 || c > 100) continue;
      const F = flecha(b, c, p, q, { A: t(`${a}°`), p: { color: 'h' }, q: { color: 'h' }, D: pide() });
      if (!sirve(F)) continue;
      const x = a + p + q;
      const ops = opciones(x, [
        { id: 'dos', valor: a + p, error: 'GE-EXT10', siFuera: 'Usar el exterior está bien; el ángulo en D suma los tres ángulos, no dos.' },
        { id: 'afuera', valor: 360 - x, error: 'GE-EXT11', siFuera: `${360 - x}° es el ángulo de afuera de la punta; piden el de adentro, ∠BDC.` },
        { id: 'grande', valor: 180 - a, error: 'GE-EXT12', siFuera: `${180 - a}° suman B y C en el triángulo grande; D no es un vértice de ese triángulo.` },
      ], gr);
      if (ops.length < 4) continue;
      return { pregunta: `En la figura, D está dentro del triángulo ABC. m∠BAC = ${a}°, m∠ABD = ${p}° y m∠ACD = ${q}°. ¿Cuánto mide el ángulo BDC?`,
        datos: [D_EXT, D_SUMA_O], dibujo: fig(F), opciones: ops,
        solucion: { texto: 'Con dos exteriores seguidos, el ángulo en D suma los tres.', ecuacion: junto(`m∠BDC = ${a}° + ${p}° + ${q}° = ${x}°`) } };
    }
    throw new Error('casoFlecha');
  }

  const exteriorIdea = {
    id: 'angulo-exterior',
    titulo: 'El ángulo exterior',
    pregunta: '¿Cuánto gira un mototaxi en cada esquina de una plaza triangular?',
    temas: ['Suma de ángulos internos y ángulo externo'],
    pieza: GO,
    aprendizaje: 'Un ángulo exterior mide lo que suman los dos interiores que no están a su lado, y los tres exteriores dan una vuelta: 360°.',
    actividad: 'Mover una esquina de la plaza y comparar el giro del mototaxi con los de adentro.',
    // Lee: la plaza, la prolongación y el ángulo exterior. No dice cuánto mide el giro ni cuánto suman los tres (eso es el
    // juego y la predicción).
    lee: {
      tarjetas: [
        { titulo: 'La plaza y el mototaxi', texto: 'La plaza tiene forma de triángulo: sus esquinas son A, B y C, y sus lados son calles. Un mototaxi la rodea siempre en el mismo sentido, y en cada esquina dobla para tomar la calle siguiente.',
          pieza: GO, dibujo: fig({ objeto: 'plaza', b: 70, c: 50, angulos: { A: null, B: null, C: null }, mototaxi: true }) },
        { titulo: 'El ángulo de afuera', texto: 'Si en C no doblara, seguiría de largo por la calle BC: esa es la prolongación de BC, hasta D. Lo que gira al doblar es el ángulo entre esa prolongación y la calle CA. Es el ángulo exterior en C: ∠ACD.',
          pieza: GO, dibujo: fig({ objeto: 'plaza', b: 70, c: 50, angulos: { A: null, B: null, C: {} }, exteriores: { C: {} }, mototaxi: true }) },
        { titulo: 'Nombres de tres letras', texto: 'Si un vértice tiene más de un ángulo, se nombra con tres letras y la del medio es el vértice: ∠BAC es el interior en A, entre AB y AC. Prolongando el otro lado sale un exterior igual: se cuenta uno por vértice.' },
        { titulo: 'Qué mirar al jugar', texto: 'Vas a mover la esquina A, arrastrándola o con los controles de B y C; B y C se quedan en su sitio. Mira cuánto gira el mototaxi en C y compáralo con los ángulos de adentro en A y en B.' },
      ],
    },
    ejemplos: EJ2,
    juega: {
      pieza: GO,
      consigna: 'El mototaxi rodea la plaza y dobla en cada esquina. B y C quedan fijas; A se arrastra o se mueve con los controles.',
      mision: {
        texto: 'Arrastra la esquina A, o usa los controles, hasta que el mototaxi gire 120° en C.',
        logrado: v => 180 - v.c === 120,
        bien: 'Listo: gira 120° en C, lo mismo que m∠A + m∠B juntos.',
      },
      voz: 'Mira el giro en C. ¿Con qué ángulos de adentro coincide?',
      leyenda: [
        { s: 'A, B, C', t: 'las esquinas de la plaza; A se arrastra' },
        { s: dH('carmín'), t: 'los ángulos de adentro de la plaza' },
        { s: dI('∠ACD'), t: 'el giro del mototaxi en C' },
        { s: 'D', t: 'la calle BC, de largo después de C' },
      ],
      controles: [
        { id: 'b', etiqueta: 'm∠B, la esquina B', min: 50, max: 70, paso: 10, inicio: 70, unidad: '°', decimales: 0, color: 'c-h' },
        { id: 'c', etiqueta: 'm∠C, la esquina C', min: 50, max: 70, paso: 10, inicio: 50, unidad: '°', decimales: 0, color: 'c-h' },
      ],
      dibujo: v => ({ datos: figJ2(v.b, v.c), estado: {} }),
      arrastres: [{ id: 'esquina-a', etiqueta: 'esquina A de la plaza: decide los ángulos en B y en C', color: 'c-h',
        donde: v => PO.aPantalla(figJ2(v.b, v.c), vert(v.b, v.c).A),
        mover: (pt, v) => { const q = PO.aPlano(figJ2(v.b, v.c), pt), p = [q[0], Math.max(q[1], 0.05)]; return { b: U.angulo([0, 0], [6, 0], p), c: U.angulo([6, 0], [0, 0], p) }; } }],
      lectura: v => [junto('Giro en C = m∠A + m∠B = '), dH(`${180 - v.b - v.c}°`), ' + ', dH(`${v.b}°`), ' = ', dI(`${180 - v.c}°`)],
      minimo: 3,
    },
    predice: {
      pregunta: 'El mototaxi da una vuelta completa a la plaza y vuelve a su esquina mirando hacia donde salió. ¿Cuánto giró en total, sumando sus tres giros?',
      datos: ['Los ángulos de la plaza miden 50° en A, 60° en B y 70° en C.', 'El giro en una esquina es el ángulo entre la calle que deja de seguir y la que toma.'],
      voz: 'Piensa en los tres giros antes de sumar.',
      opciones: [
        { id: 'c', texto: '360°', correcta: true },
        { id: 'plaza', texto: '180°: lo mismo que suman los ángulos de la plaza', error: 'GE-EXT1', siFuera: 'Hay una suma fija, es cierto; pero los giros son los de afuera, no los de la plaza.' },
        { id: 'llanos', texto: '540°: 180° en cada esquina', error: 'GE-EXT2', siFuera: 'Cada giro forma 180° con su ángulo de adentro; el giro solo es una parte.' },
        { id: 'forma', texto: 'Depende de la forma de la plaza', error: 'GE-EXT3', siFuera: 'Cada giro sí cambia con la forma; lo que suman los tres no cambia.' },
      ],
      dibujo: fig(PRED2(false)),
      revelar: fig(PRED2(true)),
      coincide: 'Coincide: 130° + 120° + 110° = 360°. Con tres giros, el mototaxi da una vuelta entera.',
      noCoincide: 'Revisemos: los giros miden 130°, 120° y 110°; juntos, 360°: una vuelta entera.',
    },
    mira: {
      pieza: GO,
      datos: PRED2(true, { exteriores: { A: t('130°', 'i', { desde: 1 }), B: t('120°', 'i', { desde: 1 }), C: t('110°', 'i') } }),
      voz: 'Primero un giro; después, los tres.',
      pasos: [
        { estado: { corte: 0 }, texto: 'En C, el giro y el ángulo de adentro forman una recta: suman 180°.', ecuacion: junto(['m∠ACD = 180° − ', dH('70°'), ' = ', dI('110°')]) },
        { estado: { corte: 0 }, texto: 'Los tres de adentro suman 180°: A y B juntos también dan 110°.', ecuacion: junto([dH('50°'), ' + ', dH('60°'), ' = ', dI('110°')]) },
        { estado: { corte: 1 }, texto: 'Lo mismo en A y en B: cada giro es 180° menos su ángulo.', ecuacion: junto([dI('130°'), ' + ', dI('120°'), ' + ', dI('110°'), ' = 360°']) },
        { estado: { corte: 1 }, texto: 'Tres rectas son 540°; los ángulos de adentro se llevan 180°. Quedan 360°.', ecuacion: junto('3 · 180° − 180° = 360°') },
      ],
    },
    regla: {
      texto: 'Un ángulo exterior mide lo que suman los dos ángulos interiores que no están a su lado. Los tres exteriores, uno en cada vértice, suman 360°.',
      ecuacion: [{ llave: [junto('m∠ACD')], nota: 'exterior en C', color: 'c-i' }, junto(' = m∠BAC + m∠ABC'), SEP, junto('m∠ACD + m∠BAE + m∠CBF = 360°')],
      condicion: 'lo forman un lado y la prolongación del otro. Cada vértice tiene dos, iguales (opuestos por el vértice): se cuenta uno.',
      voz: 'Ubica el exterior y busca los dos interiores que no lo tocan.',
      // Dibujo propio (docs/teoria.md 4i): la plaza con los tres exteriores y sus letras D, E y F, como en la ecuación.
      dibujo: { pieza: GO, datos: PRED2(true, { exteriores: { A: {}, B: {}, C: {} }, angulos: { A: {}, B: {}, C: {} }, letraE: true, letraF: true }), estado: {} },
    },
    // Así se resuelve: un exterior que es el triple de un interior, o dos exteriores que dan el tercer interior. «Ahora
    // tú» pide otras cosas: el exterior directo, con x, un interior desde el exterior, la suma de los tres y la flecha.
    resuelve: {
      pieza: GO,
      generar(s) {
        const r = azar(s + 900);
        if (s % 2 === 0) {
          const a = 5 * r.ent(5, 8), b = 2 * a, e = 3 * a, c = 180 - e;
          const F = TRI(b, c, { angulos: { A: pide(), B: {}, C: null }, exteriores: { C: t(`${e}°`) } });
          return {
            enunciado: `En el triángulo ABC, el ángulo exterior ACD mide ${e}° y el ángulo B mide el doble que el ángulo A. ¿Cuánto mide el ángulo A?`,
            datos: [D_EXT],
            dibujo: fig(F),
            pasos: [
              { tipo: 'pide', texto: 'Piden m∠A, uno de los dos interiores que no están junto al exterior.' },
              { tipo: 'datos', texto: `El exterior en C mide ${e}°, y B es el doble de A.` },
              { tipo: 'regla', texto: 'El exterior en C es la suma de los interiores A y B.', ecuacion: junto(`m∠A + m∠B = ${e}°`) },
              { tipo: 'cuentas', texto: 'B son dos partes de A: entre los dos, tres partes iguales a A.', ecuacion: [junto(`3 · m∠A = ${e}°`), '   →   ', junto(['m∠A = ', dF(`${a}°`)])] },
              { tipo: 'sentido', texto: `Compruebo: m∠B = ${b}°, y ${a}° + ${b}° = ${e}°. El interior en C mide ${c}°; los tres suman 180°.` },
            ],
            respuesta: ['m∠A = ', dF(`${a}°`)],
          };
        }
        const [a, b, c] = dosDe(r, 35, 85), eB = 180 - b, eC = 180 - c;
        const F = TRI(b, c, { prolonga: 1.8, angulos: { A: pide(), B: null, C: null }, exteriores: { B: t(`${eB}°`), C: t(`${eC}°`) } });
        return {
          enunciado: `En el triángulo ABC, el ángulo exterior en B mide ${eB}° y el exterior en C mide ${eC}°. ¿Cuánto mide el ángulo A?`,
          datos: [D_ADY, D_SUMA],
          dibujo: fig(F),
          pasos: [
            { tipo: 'pide', texto: 'Piden m∠A, el interior del vértice que no tiene exterior en la figura.' },
            { tipo: 'datos', texto: `Tengo dos exteriores: ${eB}° en B y ${eC}° en C.` },
            { tipo: 'regla', texto: 'Cada exterior y su interior forman una recta: 180°. Después, los tres interiores suman 180°.' },
            { tipo: 'cuentas', texto: 'Saco los interiores de B y de C, y después el de A.', ecuacion: [junto(`m∠B = ${b}°`), COMA, junto(`m∠C = ${c}°`), Y, junto(['m∠A = 180° − ', `${b}° − ${c}° = `, dF(`${a}°`)])] },
            { tipo: 'sentido', texto: `Compruebo con la otra regla: el exterior en B, ${eB}°, es m∠A + m∠C = ${a}° + ${c}°.` },
          ],
          respuesta: ['m∠A = ', dF(`${a}°`)],
        };
      },
    },
    ahoraTu: {
      pieza: GO,
      voz: 'Ubica cuál es el exterior y cuáles son los dos interiores lejanos.',
      generar(s) { return conCuatro([casoExt, casoExtX, casoIntDesdeExt, casoTresExt, casoFlecha][s % 5], azar(s + 7)); },
    },
  };

  // ---------- Idea 3 (nueva, 18 nov): triángulo isósceles y equilátero ----------
  // Objeto de la primera pantalla: el compás abierto sobre la hoja (geo-objeto, compas; dibujo de prueba), con la raya
  // entre sus puntas. En «Predice» y «Mira», un techo a dos aguas con un lado más largo (geo-objeto, tijeral con lados).
  // Cambia: la abertura θ (de 10° en 10°). · Permanece: las patas de 12 cm. · Progresa: los dos ángulos de abajo, siempre
  // iguales, y la raya BC frente a θ. · Se reserva: qué pasa con lados distintos (el techo, la predicción). · Debe verse:
  // con la raya igual a las patas, tres lados iguales y tres ángulos de 60°.
  // Colores: los ángulos en carmín (θ con un arco, los dos α con dos); las patas en naranja con su rayita sobre una llave;
  // en el techo, el lado corto naranja y el largo turquesa; la raya y la viga en tinta.
  // Errores (hipótesis, sin medir): GE-ISO1 toma el ángulo pegado al lado y no el de enfrente, GE-ISO2 supone el techo
  // simétrico, GE-ISO3 cree que falta un dato (propuesta); nuevos (18 nov): GE-ISO4 no divide entre los dos ángulos de la
  // base, GE-ISO5 iguala el ángulo de la punta con los de la base, GE-ISO6 resta de 90° sin partir, GE-ISO7 resta de 180°
  // un solo ángulo de la base, GE-ISO8 da lo que suman los dos de la base, GE-ISO9 da x en vez del lado, GE-ISO10 iguala
  // los lados que tocan a los ángulos iguales y no los de enfrente, GE-ISO11 da el tercer lado, GE-ISO12 invierte la
  // relación (lado mayor frente al ángulo menor), GE-ISO13 en la cadena copia el ángulo de C en A, GE-ISO14 toma el
  // ángulo de D que no es del triángulo ABD, GE-ISO15 duplica dos veces.
  const VJ3 = { x: [-9.2, 9.2], y: [-13.5, 2.6] };
  const bc3 = th => 2 * 12 * Math.sin(th / 2 * RAD);
  const cm3 = th => (Math.abs(bc3(th) - Math.round(bc3(th))) < 1e-9 ? `${f(bc3(th))} cm` : `≈ ${f(bc3(th), 1)} cm`);
  const ALFA = { radio: 14, holgura: 3 };
  const figJ3 = th => ({ objeto: 'compas', t: th, vista: VJ3, alto: 262, manija: 'C', raya: { texto: cm3(th) },
    angulos: { A: t(`${th}°`), B: Object.assign(t(`${(180 - th) / 2}°`), ALFA), C: Object.assign(t(`${(180 - th) / 2}°`), ALFA) } });
  // El techo de la predicción: AB = 3 m (naranja), AC = 4 m (turquesa) sobre la viga BC = 6 m. Sus ángulos con la viga:
  // 36,34° en B y 26,38° en C (ley de cosenos, rehecho aparte); se rotulan redondeados.
  const TECHO = [3, 4, 6];
  const TX = (9 - 16 + 36) / 12, TY = Math.sqrt(9 - TX * TX), T_A = [TX, TY], T_C = [6, 0];
  const T_B = U.angulo([0, 0], T_C, T_A), T_Cang = U.angulo(T_C, T_A, [0, 0]);
  const T_D = [TX + (6 - TX) * 3 / 4, TY / 4];                       // en AC, con AD = 3 m = AB
  const figTecho = (o = {}) => Object.assign({ objeto: 'tijeral', lados: TECHO, letras: true, colores: { AB: 'o', AC: 'i' }, medidas: { AB: '3 m', AC: '4 m', BC: '6 m' }, alto: 230 }, o);
  // «Mira»: el punto D en AC con AD = AB (desde el corte 1); ABD isósceles (2); ∠ADB exterior de DBC (3); los ángulos (4).
  const ABD = (180 - U.angulo(T_A, [0, 0], T_C)) / 2;
  const miraTecho = () => figTecho({ medidas: undefined, alto: 236,
    ladosRot: [{ de: 'A', a: 'B', texto: '3 m', color: 'o', dist: 13, hasta: 0 }, { de: 'A', a: 'C', texto: '4 m', color: 'i', dist: 13, hasta: 0 }, { de: 'B', a: 'C', texto: '6 m', dist: 22 }],
    llaves: [{ de: 'A', a: 'B', marcas: 1, dist: 15, desde: 1 }, { de: 'A', a: 'D', marcas: 1, dist: 15, desde: 1 }],
    masPuntos: [{ id: 'D', x: T_D[0], y: T_D[1], desde: 1, sinPunto: true }], libres: [{ en: 'D', dir: 75, dist: 22, texto: 'D', desde: 1 }],
    masSegmentos: [{ de: 'B', a: 'D', desde: 1 }],
    masAngulos: [
      { en: 'B', de: 'D', a: 'A', radio: 44, holgura: 8, marcas: 2, mide: ABD, color: 'h', desde: 2 },
      { en: 'D', de: 'A', a: 'B', radio: 16, holgura: 6, marcas: 2, mide: ABD, color: 'h', desde: 2 },
      { en: 'C', de: 'A', a: 'B', radio: 40, holgura: 9, marcas: 3, mide: T_Cang, color: 'h', desde: 3, hasta: 3 },
      { en: 'C', de: 'A', a: 'B', radio: 40, holgura: 9, marcas: 3, mide: T_Cang, color: 'h', desde: 4 },
      { en: 'B', de: 'C', a: 'A', radio: 28, holgura: 9, marcas: 1, mide: T_B, color: 'h', desde: 3, hasta: 3 },
      { en: 'B', de: 'C', a: 'A', radio: 28, holgura: 9, marcas: 1, mide: T_B, color: 'h', desde: 4 },
    ] });
  // Isósceles con AB = AC (vértice A): la figura de examen con las llaves de los lados iguales.
  const LL_AB_AC = [{ de: 'A', a: 'B', marcas: 1 }, { de: 'A', a: 'C', marcas: 1 }];
  const ISO = (base, o = {}) => TRI(base, base, Object.assign({ llaves: LL_AB_AC }, o));
  // La cadena AB = BD = DC, con D en AC y m∠C = c (ejemplo y «Ahora tú»): B en (0, 0) y C en (6, 0).
  function cadena(c, rot, o = {}) {
    const u = [Math.cos((180 - c) * RAD), Math.sin((180 - c) * RAD)], L = 6, s = L / (2 * Math.cos(c * RAD));
    const D = [L + s * u[0], s * u[1]], tA = L * Math.cos(c * RAD) + Math.sqrt(Math.max(0, L * L * Math.cos(c * RAD) ** 2 - L * L + s * s)), A = [L + tA * u[0], tA * u[1]];
    const P = { A, B: [0, 0], C: [L, 0], D };
    const puntos = [{ id: 'A', x: A[0], y: A[1], rotulo: 'A', lado: 110, sinPunto: true }, { id: 'B', x: 0, y: 0, rotulo: 'B', lado: 240, sinPunto: true }, { id: 'C', x: L, y: 0, rotulo: 'C', lado: -30, sinPunto: true }, { id: 'D', x: D[0], y: D[1], rotulo: 'D', lado: 90 - c, sinPunto: true }];
    const angulos = [];
    if (rot.C) angulos.push(Object.assign({ en: 'C', de: 'D', a: 'B', radio: 30, holgura: 6, mide: c, marcas: 1 }, rot.C));
    if (rot.A) angulos.push(Object.assign({ en: 'A', de: 'B', a: 'D', radio: 22, holgura: 6, mide: 2 * c, marcas: 2 }, rot.A));
    if (rot.ABC) angulos.push(Object.assign({ en: 'B', de: 'C', a: 'A', radio: 24, holgura: 6, mide: 180 - 3 * c, marcas: 3 }, rot.ABC));
    const xs = Object.values(P).map(p => p[0]), ys = Object.values(P).map(p => p[1]);
    return { objeto: 'angulos', llaves: [{ de: 'A', a: 'B', marcas: 1 }, { de: 'B', a: 'D', marcas: 1, ref: 'C' }, { de: 'D', a: 'C', marcas: 1, ref: 'B' }],
      figura: { alt: o.alt || 'Triángulo ABC con D en el lado AC; los tramos AB, BD y DC miden lo mismo.',
        vista: { x: [Math.min(...xs) - 0.9, Math.max(...xs) + 0.9], y: [Math.min(...ys) - 0.9, Math.max(...ys) + 0.9] }, alto: 250,
        puntos, segmentos: [{ de: 'A', a: 'B' }, { de: 'B', a: 'C' }, { de: 'C', a: 'A' }, { de: 'B', a: 'D' }], angulos } };
  }

  // Ejemplos resueltos de «Triángulo isósceles y equilátero». Cuentas rehechas aparte (scratchpad f3-geo/cuentas.js):
  // (180 − 50)/2 = 65; la base: 52 y 52; 180/3 = 60; AC = AB = 7; C = 180 − 40 − 65 = 75, el mayor frente a C: AB;
  // 4x + 40 = 180, x = 35, 55; C = 180 − 115 = 65, A = 180 − 130 = 50; 3x − 2 = x + 10, x = 6, AB = 16; 5x + 45 = 180,
  // x = 27: 54, 54 y 72; B = 50, C = 60, A = 70: BC > AB > AC; DC = DA = 7, BC = 11; C = 25: A = 50, ABC = 105;
  // ACD = 120, CAD = 30, BAD = 90; 4x = 2x + 50, x = 25, B = C = 50, A = 80; 2x + 2 = 3x − 4, x = 6, AB = 14, C = 55.
  const EJ3 = [];
  EJ3.push({ nivel: 1, titulo: 'El ángulo de una pata',
    figura: fig({ objeto: 'compas', t: 50, raya: {}, angulos: { A: t('50°'), B: Object.assign(pide(), ALFA), C: ALFA } }),
    enunciado: 'Las dos patas de un compás miden lo mismo. Lo abres 50° y apoyas sus puntas en la hoja. ¿Qué ángulo forma cada pata con la raya entre sus puntas?',
    datos: [D_SUMA_O, 'Frente a lados iguales hay ángulos iguales.'],
    solucion: [{ texto: 'Los dos ángulos de abajo son iguales y se reparten lo que deja la abertura:', ecuacion: junto(['(180° − 50°) ÷ 2 = ', dF('65°')]) }],
    respuesta: ['Cada pata forma ', dF('65°')] });
  EJ3.push({ nivel: 1, titulo: 'El otro ángulo de la base',
    figura: fig(ISO(52, { angulos: { A: null, B: t('52°', 'h', { marcas: 2 }), C: pide({ marcas: 2 }) } })),
    enunciado: 'En el triángulo ABC, AB = AC y m∠B = 52°. ¿Cuánto mide el ángulo C?',
    datos: ['Frente a lados iguales hay ángulos iguales.'],
    solucion: [{ texto: 'C está frente a AB y B frente a AC. Como AB = AC, esos ángulos son iguales.', ecuacion: junto(['m∠C = m∠B = ', dF('52°')]) }],
    respuesta: ['m∠C = ', dF('52°')] });
  EJ3.push({ nivel: 1, titulo: 'La señal de tránsito',
    // Sin escala (lector en frío, ronda 2: el equilátero a escala daba los 60° a simple vista): 80°, 50° y 50°.
    figura: fig(TRI(50, 50, { sinEscala: true, alt: 'Triángulo ABC, sin escala, con sus tres lados marcados con la misma rayita; el ángulo A lleva «?».',
      llaves: [{ de: 'A', a: 'B', marcas: 1 }, { de: 'A', a: 'C', marcas: 1 }, { de: 'B', a: 'C', marcas: 1 }], angulos: { A: pide({ marcas: 1 }), B: { marcas: 1 }, C: { marcas: 1 } } })),
    enunciado: 'Una señal de tránsito tiene forma de triángulo con sus tres lados iguales. ¿Cuánto mide cada uno de sus ángulos? El dibujo no está a escala.',
    datos: [D_SUMA_O, 'Frente a lados iguales hay ángulos iguales.'],
    solucion: [{ texto: 'Tres lados iguales dan tres ángulos iguales, que se reparten 180°:', ecuacion: junto(['180° ÷ 3 = ', dF('60°')]) }],
    respuesta: ['Cada ángulo mide ', dF('60°')] });
  EJ3.push({ nivel: 1, titulo: 'Ángulos iguales, lados iguales',
    figura: fig(TRI(40, 40, { angulos: { A: null, B: t('40°', 'h', { marcas: 2 }), C: t('40°', 'h', { marcas: 2 }) }, ladosRot: [{ de: 'A', a: 'B', texto: '7 cm' }, { de: 'A', a: 'C', texto: '?' }] })),
    enunciado: 'En el triángulo ABC, m∠B = m∠C = 40° y AB = 7 cm. ¿Cuánto mide AC?',
    datos: ['Frente a ángulos iguales hay lados iguales.'],
    solucion: [{ texto: 'AC está frente al ángulo B y AB frente al ángulo C. Si los ángulos son iguales, esos lados también.', ecuacion: junto(['AC = AB = ', dF('7 cm')]) }],
    respuesta: ['AC = ', dF('7 cm')] });
  // Sin figura (auditoría, M5): a escala, el dibujo diría cuál lado es el mayor (como el tipo «orden» del generador).
  EJ3.push({ nivel: 1, titulo: '¿Cuál es el lado mayor?',
    enunciado: 'Los ángulos de un triángulo ABC miden 40° en A, 65° en B y 75° en C. ¿Cuál es su lado mayor?',
    datos: ['Frente al ángulo mayor está el lado mayor.', 'Lado opuesto de un vértice: el que no lo toca.'],
    solucion: [{ texto: 'El ángulo mayor es el de C, 75°. Su lado opuesto, el que no toca a C, es AB.', ecuacion: junto('75° > 65° > 40°   →   AB > AC > BC') }],
    respuesta: ['El lado mayor es ', dF('AB')] });
  EJ3.push({ nivel: 2, titulo: 'La base desde la punta',
    figura: fig(ISO(55, { angulos: { A: t('2x', 'h', { mide: 70 }), B: t('x + 20°', 'h', { marcas: 2, mide: 55 }), C: { marcas: 2 } } })),
    enunciado: 'En el triángulo ABC, AB = AC, m∠A = 2x y m∠B = x + 20°. ¿Cuánto mide el ángulo B?',
    datos: [D_SUMA, 'Frente a lados iguales hay ángulos iguales.'],
    solucion: [
      { texto: 'C mide lo mismo que B. Sumo los tres e igualo a 180°:', ecuacion: [junto('2x + 2(x + 20°) = 180°'), '   →   ', junto('4x = 140'), '   →   ', junto('x = 35')] },
      { texto: 'Reemplazo x en B:', ecuacion: junto(['m∠B = 35 + 20° = ', dF('55°')]) },
    ],
    respuesta: ['m∠B = ', dF('55°')] });
  EJ3.push({ nivel: 2, titulo: 'Isósceles con un exterior',
    figura: fig(ISO(65, { angulos: { A: pide(), B: { marcas: 2 }, C: null }, exteriores: { C: t('115°') } })),
    enunciado: 'En el triángulo ABC, AB = AC. Se prolonga BC más allá de C, hasta D, y el ángulo ACD mide 115°. ¿Cuánto mide el ángulo A?',
    datos: [D_ADY, D_SUMA, 'Frente a lados iguales hay ángulos iguales.'],
    solucion: [
      { texto: 'ACB es vecino de ACD en la recta, y B mide lo mismo que C:', ecuacion: [junto('m∠C = 180° − 115° = 65°'), Y, junto('m∠B = 65°')] },
      { texto: 'Lo que queda para A:', ecuacion: junto(['m∠A = 180° − 2 · 65° = ', dF('50°')]) },
    ],
    respuesta: ['m∠A = ', dF('50°')] });
  EJ3.push({ nivel: 2, titulo: 'Dos lados con x',
    figura: fig(TRI(55, 55, { angulos: { A: null, B: { marcas: 2 }, C: { marcas: 2 } }, ladosRot: [{ de: 'A', a: 'B', texto: '(3x − 2) cm' }, { de: 'A', a: 'C', texto: '(x + 10) cm' }] })),
    enunciado: 'En el triángulo ABC, m∠B = m∠C, AB = (3x − 2) cm y AC = (x + 10) cm. ¿Cuánto mide AB?',
    datos: ['Frente a ángulos iguales hay lados iguales.'],
    solucion: [
      { texto: 'Los lados frente a B y frente a C, AC y AB, son iguales:', ecuacion: [junto('3x − 2 = x + 10'), '   →   ', junto('2x = 12'), '   →   ', junto('x = 6')] },
      { texto: 'Reemplazo:', ecuacion: junto(['AB = 3 · 6 − 2 = ', dF('16 cm')]) },
    ],
    respuesta: ['AB = ', dF('16 cm')] });
  EJ3.push({ nivel: 2, titulo: 'Dos clases a la vez',
    enunciado: 'Los ángulos de un triángulo miden 2x, 2x y x + 45°. ¿Qué clase de triángulo es, por sus lados y por sus ángulos?',
    datos: [D_SUMA_O, 'Frente a ángulos iguales hay lados iguales.', D_CLASES],
    solucion: [
      { texto: 'Sumo e igualo a 180°:', ecuacion: [junto('5x + 45° = 180°'), '   →   ', junto('x = 27')] },
      { texto: 'Miden 54°, 54° y 72°: dos ángulos iguales (dos lados iguales) y los tres agudos.' },
    ],
    respuesta: ['Es ', dF('isósceles y acutángulo')] });
  EJ3.push({ nivel: 2, titulo: 'Ordenar los tres lados',
    enunciado: 'En el triángulo ABC, m∠A = 70° y el ángulo exterior en B mide 130°. Ordena sus tres lados de mayor a menor.',
    datos: [D_ADY, D_SUMA, 'Frente al ángulo mayor está el lado mayor.'],
    solucion: [
      { texto: 'Saco los otros dos ángulos:', ecuacion: [junto('m∠B = 180° − 130° = 50°'), Y, junto('m∠C = 180° − 70° − 50° = 60°')] },
      { texto: 'Cada lado sigue a su ángulo opuesto: BC frente a A, AB frente a C, AC frente a B.', ecuacion: junto(['70° > 60° > 50°   →   ', dF('BC > AB > AC')]) },
    ],
    respuesta: [dF('BC > AB > AC')] });
  EJ3.push({ nivel: 3, titulo: 'El corte que forma un isósceles',
    figura: (() => { const D = [4, 0], A = [4 + 7 * Math.cos(110 * RAD), 7 * Math.sin(110 * RAD)];
      return fig({ objeto: 'angulos', ladosRot: [{ de: 'B', a: 'D', texto: '4 cm', dist: 8, ref: 'A' }, { de: 'D', a: 'A', texto: '7 cm', ref: 'B', en: 0.35 }],
        figura: { alt: 'Triángulo ABC con D en el lado BC; el ángulo DAC mide lo mismo que el ángulo C.', vista: { x: [-0.9, 11.9], y: [-1.7, A[1] + 0.9] }, alto: 240,
          puntos: [{ id: 'A', x: A[0], y: A[1], rotulo: 'A', lado: 100, sinPunto: true }, { id: 'B', x: 0, y: 0, rotulo: 'B', lado: 200, sinPunto: true }, { id: 'C', x: 11, y: 0, rotulo: 'C', lado: -20, sinPunto: true }, { id: 'D', x: 4, y: 0, rotulo: 'D', lado: -90, sinPunto: true }],
          segmentos: [{ de: 'A', a: 'B' }, { de: 'B', a: 'C' }, { de: 'C', a: 'A' }, { de: 'A', a: 'D' }],
          angulos: [{ en: 'A', de: 'D', a: 'C', radio: 34, marcas: 2, mide: 35 }, { en: 'C', de: 'A', a: 'D', radio: 44, marcas: 2, mide: 35 }] } }); })(),
    enunciado: 'En el triángulo ABC, D está en el lado BC y m∠DAC = m∠C. Además, BD = 4 cm y AD = 7 cm. ¿Cuánto mide BC?',
    datos: ['Frente a ángulos iguales hay lados iguales.', 'Si D está entre B y C: BC = BD + DC.'],
    solucion: [
      { texto: 'En el triángulo ADC, los ángulos en A y en C son iguales: sus lados opuestos, DC y DA, también.', ecuacion: junto('DC = DA = 7 cm') },
      { texto: 'BC junta los dos tramos:', ecuacion: junto(['BC = 4 + 7 = ', dF('11 cm')]) },
    ],
    respuesta: ['BC = ', dF('11 cm')] });
  EJ3.push({ nivel: 3, titulo: 'La cadena de isósceles',
    figura: fig(cadena(25, { C: t('25°'), ABC: pide() })),
    enunciado: 'En el triángulo ABC, D está en el lado AC y AB = BD = DC. Si m∠C = 25°, ¿cuánto mide el ángulo ABC?',
    datos: ['Frente a lados iguales hay ángulos iguales.', D_EXT, D_SUMA],
    solucion: [
      { texto: 'BD = DC: en △BDC, ∠DBC = ∠C = 25°. ∠ADB es exterior de △BDC:', ecuacion: junto('m∠ADB = 25° + 25° = 50°') },
      { texto: 'AB = BD: en △ABD, el ángulo A es igual a ∠ADB.', ecuacion: junto('m∠A = 50°') },
      { texto: 'En △ABC, lo que queda para B:', ecuacion: junto(['m∠ABC = 180° − 50° − 25° = ', dF('105°')]) },
    ],
    respuesta: ['m∠ABC = ', dF('105°')] });
  EJ3.push({ nivel: 3, titulo: 'Equilátero con una prolongación',
    figura: fig({ objeto: 'angulos', llaves: [{ de: 'A', a: 'B', marcas: 1 }, { de: 'B', a: 'C', marcas: 1, ref: 'A' }, { de: 'C', a: 'A', marcas: 1, ref: 'B' }, { de: 'C', a: 'D', marcas: 1, ref: 'A' }],
      figura: { alt: 'Triángulo equilátero ABC; se prolonga BC hasta D, con CD igual al lado, y se une A con D.', vista: { x: [-0.9, 12.9], y: [-1.2, 6.1] }, alto: 220,
        puntos: [{ id: 'A', x: 3, y: 3 * Math.sqrt(3), rotulo: 'A', lado: 100, sinPunto: true }, { id: 'B', x: 0, y: 0, rotulo: 'B', lado: 200, sinPunto: true }, { id: 'C', x: 6, y: 0, rotulo: 'C', lado: -90, sinPunto: true }, { id: 'D', x: 12, y: 0, rotulo: 'D', lado: -20, sinPunto: true }],
        segmentos: [{ de: 'A', a: 'B' }, { de: 'B', a: 'C' }, { de: 'C', a: 'A' }, { de: 'C', a: 'D' }, { de: 'A', a: 'D' }],
        angulos: [{ en: 'A', de: 'B', a: 'D', texto: '?', radio: 30, holgura: 6, mide: 90, arcoRecto: true }] } }),
    enunciado: 'El triángulo ABC es equilátero. Se prolonga BC más allá de C, hasta D, con CD = CA. ¿Cuánto mide el ángulo BAD?',
    datos: ['Equilátero: tres lados iguales y tres ángulos de 60°.', 'Frente a lados iguales hay ángulos iguales.', D_ADY, D_SUMA_O],
    solucion: [
      { texto: '∠ACD es vecino del ángulo de 60° en C: mide 120°. △ACD es isósceles (CD = CA):', ecuacion: junto('m∠CAD = (180° − 120°) ÷ 2 = 30°') },
      { texto: 'El ángulo BAD junta el de 60° del equilátero y el de 30°:', ecuacion: junto(['m∠BAD = 60° + 30° = ', dF('90°')]) },
    ],
    respuesta: ['m∠BAD = ', dF('90°')] });
  EJ3.push({ nivel: 3, titulo: 'Isósceles con x afuera',
    // La llave de AB va por dentro: por fuera, el arco del exterior 4x la tocaba (lector en frío, ronda 2).
    figura: fig(ISO(50, { prolonga: 2.2, llaves: [{ de: 'A', a: 'B', marcas: 1, ref: 'E', dist: 10 }, { de: 'A', a: 'C', marcas: 1 }], angulos: { A: pide(), B: { marcas: 2, color: 'h' }, C: { marcas: 2 } }, exteriores: { A: t('4x', 'h', { mide: 100 }) }, letraE: true })),
    enunciado: 'En el triángulo ABC, AB = AC. Se prolonga CA más allá de A, hasta E; m∠BAE = 4x y m∠B = x + 25°. ¿Cuánto mide el ángulo BAC?',
    datos: [D_EXT, 'Frente a lados iguales hay ángulos iguales.', D_ADY],
    solucion: [
      { texto: 'El exterior en A suma B y C, que son iguales:', ecuacion: [junto('4x = 2(x + 25°)'), '   →   ', junto('4x = 2x + 50°'), '   →   ', junto('2x = 50'), '   →   ', junto('x = 25')] },
      { texto: 'El exterior mide 100°; BAC es su vecino en la recta:', ecuacion: junto(['m∠BAC = 180° − 100° = ', dF('80°')]) },
    ],
    respuesta: ['m∠BAC = ', dF('80°')] });
  EJ3.push({ nivel: 3, titulo: 'Un lado con x',
    enunciado: 'En el triángulo ABC, m∠A = 70°, m∠B = 55°, AC = (2x + 2) cm y AB = (3x − 4) cm. ¿Cuánto mide AB, y cuál es el lado mayor?',
    datos: [D_SUMA, 'Frente a ángulos iguales hay lados iguales.', 'Frente al ángulo mayor está el lado mayor.'],
    solucion: [
      { texto: 'm∠C = 180° − 70° − 55° = 55°, igual que B. Sus lados opuestos son iguales:', ecuacion: [junto('3x − 4 = 2x + 2'), '   →   ', junto('x = 6'), '   →   ', junto('AB = 14 cm')] },
      { texto: 'El ángulo mayor es A, 70°: su lado opuesto, BC, es el mayor.' },
    ],
    respuesta: [dF('AB = 14 cm'), '; el mayor es ', dF('BC')] });

  // «Ahora tú» de la idea 3: cinco tipos, uno por semilla (s % 5).
  const D_ISO = 'Frente a lados iguales hay ángulos iguales, y frente a ángulos iguales, lados iguales.';
  function casoBase(r) {
    for (let i = 0; i < 400; i++) {
      const th = 2 * r.ent(10, 60), al = (180 - th) / 2, F = ISO(al, { angulos: { A: t(`${th}°`), B: pide({ marcas: 2 }), C: { marcas: 2 } } });
      if (!sirve(F)) continue;
      const ops = opciones(al, [
        { id: 'juntos', valor: 180 - th, error: 'GE-ISO4', siFuera: `${180 - th}° es lo que suman B y C juntos; cada uno es la mitad.` },
        { id: 'igual', valor: th, error: 'GE-ISO5', siFuera: 'El ángulo A está entre los lados iguales; los iguales son B y C.' },
        { id: 'recto', valor: 90 - th, error: 'GE-ISO6', siFuera: 'Partir en dos es la idea; también hay que partir A: 90° − m∠A ÷ 2.' },
      ], gr);
      if (ops.length < 4) continue;
      return { pregunta: `En el triángulo ABC, AB = AC y m∠A = ${th}°. ¿Cuánto mide el ángulo B?`, datos: [D_SUMA, D_ISO], dibujo: fig(F), opciones: ops,
        solucion: { texto: 'B y C son iguales y se reparten lo que deja A.', ecuacion: junto(`m∠B = (180° − ${th}°) ÷ 2 = ${al}°`) } };
    }
    throw new Error('casoBase');
  }
  function casoPunta(r) {
    for (let i = 0; i < 400; i++) {
      const al = r.ent(25, 80), th = 180 - 2 * al, F = ISO(al, { angulos: { A: pide(), B: t(`${al}°`, 'h', { marcas: 2 }), C: { marcas: 2 } } });
      if (!sirve(F)) continue;
      const ops = opciones(th, [
        { id: 'uno', valor: 180 - al, error: 'GE-ISO7', siFuera: 'Restar de 180° está bien; pero hay dos ángulos de la base iguales: se restan los dos.' },
        { id: 'igual', valor: al, error: 'GE-ISO5', siFuera: 'B y C son los iguales; A es el que queda entre los lados iguales.' },
        { id: 'doble', valor: 2 * al, error: 'GE-ISO8', siFuera: `${2 * al}° suman B y C; A es lo que les falta para 180°.` },
      ], gr);
      if (ops.length < 4) continue;
      return { pregunta: `En el triángulo ABC, AB = AC y m∠B = ${al}°. ¿Cuánto mide el ángulo A?`, datos: [D_SUMA, D_ISO], dibujo: fig(F), opciones: ops,
        solucion: { texto: 'C mide lo mismo que B; A es lo que les falta para 180°.', ecuacion: junto(`m∠A = 180° − 2 · ${al}° = ${th}°`) } };
    }
    throw new Error('casoPunta');
  }
  function casoReciproco(r) {
    for (let i = 0; i < 400; i++) {
      const x = r.ent(3, 9), p = r.ent(2, 4), q = r.ent(1, p - 1), k = r.ent(1, 8), AB = p * x - k, mAC = AB - q * x;
      if (AB <= 4 || mAC < -9) continue;
      const AC = `${q === 1 ? '' : q}x${mAC >= 0 ? ` + ${mAC}` : ` − ${-mAC}`}`, ABt = `${p}x − ${k}`;
      const bc = r.ent(3, 2 * AB - 2), BCx = r.ent(1, 2), bcK = bc - BCx * x;
      if (bc === AB) continue;
      const BC = `${BCx === 1 ? '' : BCx}x${bcK >= 0 ? ` + ${bcK}` : ` − ${-bcK}`}`, b = U.grados(Math.acos(bc / (2 * AB)));
      const xMal = p !== BCx ? (k + bcK) / (p - BCx) : NaN, abMal = p * xMal - k;
      const F = TRI(b, b, { angulos: { A: null, B: { marcas: 2 }, C: { marcas: 2 } } });
      if (!sirve(F)) continue;
      const ops = opciones(AB, [
        { id: 'x', valor: x, error: 'GE-ISO9', siFuera: `x = ${x} está bien; falta reemplazarlo en AB.` },
        { id: 'tocan', valor: Number.isInteger(xMal) && xMal > 0 ? abMal : NaN, error: 'GE-ISO10', siFuera: 'Igualar dos lados es la idea; pero los iguales son los opuestos a B y C: AC y AB.' },
        { id: 'bc', valor: bc, error: 'GE-ISO11', siFuera: `${bc} cm mide BC; piden AB.` },
      ], fmtCm);
      if (ops.length < 4) continue;
      return { pregunta: `En el triángulo ABC, m∠B = m∠C. AB = (${ABt}) cm, AC = (${AC}) cm y BC = (${BC}) cm. ¿Cuánto mide AB?`,
        datos: [D_ISO], dibujo: fig(F), opciones: ops,
        solucion: { texto: 'AB y AC están frente a C y frente a B: son iguales.', ecuacion: [junto(`${ABt} = ${AC}`), '   →   ', junto(`x = ${x}`), '   →   ', junto(`AB = ${AB} cm`)] } };
    }
    throw new Error('casoReciproco');
  }
  const OPUESTO = { A: 'BC', B: 'AC', C: 'AB' };
  function casoOrden(r) {
    for (let i = 0; i < 400; i++) {
      const [a, b, c] = dosDe(r, 35, 95);
      if (new Set([a, b, c]).size < 3) continue;
      const m = { A: a, B: b, C: c }, orden = LET.slice().sort((x, y) => m[y] - m[x]);
      // Sin figura (auditoría, M5): a escala diría cuál es el lado mayor; el generador hace este tipo igual.
      const ops = [
        { id: 'c', texto: OPUESTO[orden[0]], correcta: true },
        { id: 'pegado', texto: OPUESTO[orden[1]], error: 'GE-ISO1', siFuera: `${OPUESTO[orden[1]]} toca al ángulo mayor; pero el lado mayor es el que queda enfrente.` },
        { id: 'menor', texto: OPUESTO[orden[2]], error: 'GE-ISO12', siFuera: `${OPUESTO[orden[2]]} está frente al ángulo menor: es el lado menor.` },
        { id: 'falta', texto: 'No se sabe sin medir los lados', error: 'GE-ISO3', siFuera: 'Medir confirmaría; pero los ángulos ya ordenan los lados.' },
      ];
      return { pregunta: `En el triángulo ABC, m∠A = ${a}° y m∠B = ${b}°. ¿Cuál es su lado mayor?`, datos: [D_SUMA, 'Frente al ángulo mayor está el lado mayor.'], opciones: ops,
        solucion: { texto: `m∠C = ${c}°. El ángulo mayor está en ${orden[0]}; su lado opuesto es el mayor.`, ecuacion: junto(`m∠${orden[0]} = ${m[orden[0]]}°   →   ${OPUESTO[orden[0]]}`) } };
    }
    throw new Error('casoOrden');
  }
  function casoCadena(r) {
    for (let i = 0; i < 400; i++) {
      const c = 5 * r.ent(3, 8), pideA = r() < 0.5, F = cadena(c, pideA ? { C: t(`${c}°`), A: pide() } : { C: t(`${c}°`), ABC: pide() });
      if (!sirve(F)) continue;
      const ops = pideA ? opciones(2 * c, [
        { id: 'copia', valor: c, error: 'GE-ISO13', siFuera: 'C y ∠DBC son iguales, cierto; A se compara con ∠ADB, no con C.' },
        { id: 'otro', valor: 180 - 2 * c, error: 'GE-ISO14', siFuera: `${180 - 2 * c}° mide ∠BDC; A es igual a ∠ADB, su vecino en la recta.` },
        { id: 'doble', valor: 4 * c, error: 'GE-ISO15', siFuera: 'Duplicar una vez está bien (el exterior); la segunda vez sobra.' },
      ], gr) : opciones(180 - 3 * c, [
        { id: 'abd', valor: 180 - 4 * c, error: 'GE-ISO14', siFuera: `${180 - 4 * c}° mide ∠ABD; falta sumarle ∠DBC.` },
        { id: 'a', valor: 2 * c, error: 'GE-ISO13', siFuera: `${2 * c}° es lo que mide el ángulo A; piden el ángulo ABC.` },
        { id: 'simple', valor: 180 - 2 * c, error: 'GE-ISO15', siFuera: 'Restar de 180° está bien; pero A mide el doble de C, no lo mismo.' },
      ], gr);
      if (ops.length < 4) continue;
      return { pregunta: `En el triángulo ABC, D está en el lado AC y AB = BD = DC. Si m∠C = ${c}°, ¿cuánto mide el ángulo ${pideA ? 'A' : 'ABC'}?`,
        datos: [D_ISO, D_EXT, D_SUMA], dibujo: fig(F), opciones: ops,
        solucion: { texto: `∠DBC = ${c}°; ∠ADB = ${2 * c}° (exterior); m∠A = ∠ADB.`, ecuacion: pideA ? junto(`m∠A = ${c}° + ${c}° = ${2 * c}°`) : junto(`m∠ABC = 180° − ${2 * c}° − ${c}° = ${180 - 3 * c}°`) } };
    }
    throw new Error('casoCadena');
  }

  const isosceles = {
    id: 'isosceles',
    titulo: 'Triángulo isósceles y equilátero',
    pregunta: '¿Qué ángulos son iguales cuando dos lados son iguales?',
    temas: ['Triángulo isósceles y equilátero', 'Relación entre lados y ángulos', 'Clasificación'],
    pieza: GO,
    aprendizaje: 'Frente a lados iguales hay ángulos iguales, y al revés; frente al lado mayor, el ángulo mayor. Equilátero: tres ángulos de 60°.',
    actividad: 'Abrir un compás de patas iguales y comparar los dos ángulos de abajo.',
    // Lee: las clases por lados y el compás. No dice qué pasa con los ángulos de abajo (eso es el juego) ni qué lado del
    // techo queda más inclinado (la predicción).
    lee: {
      tarjetas: [
        { titulo: 'Tres clases por sus lados', texto: 'Por sus lados, un triángulo es escaleno si sus tres lados miden distinto, isósceles si tiene dos lados iguales y equilátero si tiene los tres iguales. Una misma rayita sobre la llave de dos lados dice que esos lados miden igual.',
          pieza: GO, dibujo: fig(TRI(70, 70, { llaves: LL_AB_AC, angulos: { A: null, B: null, C: null } })) },
        { titulo: 'El compás', texto: 'Las dos patas del compás miden 12 cm. Con sus puntas sobre la hoja, la bisagra A y las puntas B y C forman un triángulo isósceles. θ es la abertura en A, y α, el ángulo de cada pata con la raya BC.',
          pieza: GO, dibujo: fig({ objeto: 'compas', t: 60, raya: {}, angulos: { A: {}, B: ALFA, C: ALFA } }) },
        { titulo: 'Qué mirar al jugar', texto: 'Abre y cierra el compás. Compara los dos ángulos de abajo entre sí, y mira cuánto mide la raya BC frente a lo que mide cada pata.' },
      ],
    },
    ejemplos: EJ3,
    juega: {
      pieza: GO,
      consigna: 'Las dos patas del compás miden 12 cm. Lo abres sobre la hoja y marcas la raya BC entre sus puntas.',
      mision: { texto: 'Abre el compás hasta que la raya BC mida lo mismo que cada pata.', logrado: v => v.t === 60, bien: 'Listo: BC = 12 cm. Tres lados iguales y tres ángulos de 60°.' },
      voz: 'Mira los dos ángulos de abajo mientras abres.',
      leyenda: [
        { s: 'A', t: 'la bisagra del compás' },
        { s: 'B, C', t: 'las puntas: B, la aguja; C, el lápiz' },
        { s: dH('θ'), t: 'la abertura del compás, en A' },
        { s: dH('α (en B y C)'), t: 'el ángulo de cada pata con la raya' },
        { s: dO('naranja'), t: 'las dos patas, iguales: la misma rayita' },
      ],
      controles: [{ id: 't', etiqueta: 'θ, la abertura', min: 40, max: 80, paso: 10, inicio: 40, unidad: '°', decimales: 0, color: 'c-h' }],
      dibujo: v => ({ datos: figJ3(v.t), estado: {} }),
      // Gesto directo: se agarra la punta C (el lápiz); su ángulo con la vertical es la mitad de la abertura.
      arrastres: [{ id: 'punta-c', etiqueta: 'punta C del compás: abre o cierra la abertura', color: 'c-o',
        donde: v => PO.aPantalla(figJ3(v.t), U.polar([0, 0], 12, -90 + v.t / 2)),
        mover: (pt, v) => { const q = PO.aPlano(figJ3(v.t), pt); return { t: 2 * Math.abs(U.grados(Math.atan2(q[0], -q[1]))) }; } }],
      lectura: v => [dH('α'), ' = ', dH(`${(180 - v.t) / 2}°`), junto(' en B y en C; θ = '), dH(`${v.t}°`), junto(`; BC ${cm3(v.t).startsWith('≈') ? '' : '= '}${cm3(v.t)}`)],
      minimo: 3,
    },
    predice: {
      pregunta: 'En un techo a dos aguas, AB y AC suben desde la viga BC. AB forma m∠B con la viga, y AC forma m∠C. ¿Cuál de los dos sube más empinado? El dibujo no está a escala.',
      datos: ['AB = 3 m', 'AC = 4 m', 'BC = 6 m'],
      voz: 'Mira qué lado queda frente a cada ángulo.',
      opciones: [
        { id: 'c', texto: 'El lado corto, AB, de 3 m', correcta: true },
        { id: 'largo', texto: 'El lado largo: más lado, más ángulo', error: 'GE-ISO1', siFuera: 'Más lado sí da más ángulo, pero el de enfrente, no el que está pegado.' },
        { id: 'iguales', texto: 'Los dos igual: suben al mismo punto', error: 'GE-ISO2', siFuera: 'Serían iguales si los dos lados midieran lo mismo; aquí uno es más corto.' },
        { id: 'falta', texto: 'No se sabe sin saber qué tan alto es el techo', error: 'GE-ISO3', siFuera: 'Esa medida ayudaría a calcular; pero los tres lados ya deciden la forma.' },
      ],
      // Sin escala (auditoría, M5): a escala se veía a ojo qué lado sube más empinado. Al revelar, el techo de verdad.
      dibujo: fig(figTecho({ lados: [3.6, 3.6, 6] })),
      revelar: fig(figTecho({ angulos: { B: { color: 'h', marcas: 1 }, C: { color: 'h', marcas: 2 } } })),
      coincide: 'Coincide: AB forma unos 36° con la viga y AC, unos 26°. El ángulo de 36° está frente al lado de 4 m.',
      noCoincide: 'Revisemos: AB forma unos 36° con la viga y AC, unos 26°. El mayor está frente al lado mayor.',
    },
    mira: {
      pieza: GO,
      datos: miraTecho(),
      voz: 'Para comparar, armamos un isósceles dentro del techo.',
      pasos: [
        { estado: { corte: 0 }, texto: 'En el techo, AC (4 m) es más largo que AB (3 m).', ecuacion: junto([dI('AC'), ' > ', dO('AB')]) },
        { estado: { corte: 1 }, texto: 'Marcamos D en AC, con AD = 3 m: lo mismo que AB.', ecuacion: junto('AD = AB = 3 m') },
        { estado: { corte: 2 }, texto: 'ABD es isósceles: doblado por la mitad, sus ángulos en B y D coinciden.', ecuacion: junto('m∠ABD = m∠ADB') },
        { estado: { corte: 3 }, texto: '∠ADB es exterior del triángulo DBC: mide más que el ángulo C.', ecuacion: junto('m∠ADB = m∠DBC + m∠C > m∠C') },
        { estado: { corte: 3 }, texto: 'Y el ángulo B entero es más grande que ∠ABD.', ecuacion: junto('m∠B > m∠ABD = m∠ADB > m∠C') },
        { estado: { corte: 4 }, texto: 'Frente al lado mayor, AC, está el ángulo mayor, B.', ecuacion: junto([dI('AC'), ' > ', dO('AB'), '   →   ', dH('m∠B'), ' > ', dH('m∠C')]) },
      ],
    },
    regla: {
      texto: 'Frente a lados iguales, ángulos iguales; frente al lado mayor, el ángulo mayor. El equilátero tiene tres ángulos de 60°. ⟺ se lee «vale en los dos sentidos».',
      ecuacion: [junto('AB = AC  ⟺  m∠C = m∠B'), SEP, junto('AC > AB  ⟺  m∠B > m∠C')],
      condicion: 'cada lado se compara con el ángulo que tiene enfrente, su lado opuesto, no con los dos ángulos que lo tocan.',
      voz: 'Lado y ángulo se miran de frente.',
      dibujo: { pieza: GO, datos: TRI(65, 65, { llaves: LL_AB_AC, angulos: { A: {}, B: { marcas: 2 }, C: { marcas: 2 } } }), estado: {} },
    },
    // Así se resuelve: el ángulo de la punta que le gana a los de la base por una diferencia, o el exterior de un
    // isósceles. «Ahora tú» pide la base, la punta, el recíproco, el lado mayor y la cadena.
    resuelve: {
      pieza: GO,
      generar(s) {
        const r = azar(s + 900);
        if (s % 2 === 0) {
          const k = r.ent(2, 12), d = 3 * k, b = 60 - k, a = b + d;
          const F = ISO(b, { angulos: { A: pide(), B: { marcas: 2 }, C: { marcas: 2 } } });
          return {
            enunciado: `En el triángulo ABC, AB = AC y el ángulo A mide ${d}° más que el ángulo B. ¿Cuánto mide el ángulo A?`,
            datos: [D_SUMA, D_ISO], dibujo: fig(F),
            pasos: [
              { tipo: 'pide', texto: 'Piden m∠A, el ángulo entre los dos lados iguales.' },
              { tipo: 'datos', texto: `AB = AC, y A le gana a B por ${d}°.` },
              { tipo: 'regla', texto: 'Frente a lados iguales, ángulos iguales: C mide lo mismo que B. Los tres suman 180°.', ecuacion: junto(`m∠B + m∠B + (m∠B + ${d}°) = 180°`) },
              { tipo: 'cuentas', texto: `Tres veces B más ${d}° dan 180°.`, ecuacion: [junto(`3 · m∠B = ${180 - d}°`), '   →   ', junto(`m∠B = ${b}°`), Y, junto(['m∠A = ', `${b}° + ${d}° = `, dF(`${a}°`)])] },
              { tipo: 'sentido', texto: `Compruebo: ${a}° + ${b}° + ${b}° = 180°.` },
            ],
            respuesta: ['m∠A = ', dF(`${a}°`)],
          };
        }
        const b = 5 * r.ent(7, 16), e = 180 - b, a = 180 - 2 * b;
        const F = ISO(b, { angulos: { A: pide(), B: { marcas: 2 }, C: null }, exteriores: { C: t(`${e}°`) } });
        return {
          enunciado: `En el triángulo ABC, AB = AC y el ángulo exterior ACD mide ${e}°. ¿Cuánto mide el ángulo A?`,
          datos: [D_ADY, D_SUMA, D_ISO], dibujo: fig(F),
          pasos: [
            { tipo: 'pide', texto: 'Piden m∠A, el ángulo entre los lados iguales.' },
            { tipo: 'datos', texto: `AB = AC, y el exterior en C mide ${e}°.` },
            { tipo: 'regla', texto: 'El interior en C es vecino del exterior; B es igual a C porque AB = AC.' },
            { tipo: 'cuentas', texto: 'Primero C y B; después, lo que queda para A.', ecuacion: [junto(`m∠C = m∠B = 180° − ${e}° = ${b}°`), Y, junto(['m∠A = 180° − 2 · ', `${b}° = `, dF(`${a}°`)])] },
            { tipo: 'sentido', texto: `Compruebo con el exterior: m∠A + m∠B = ${a}° + ${b}° = ${e}°.` },
          ],
          respuesta: ['m∠A = ', dF(`${a}°`)],
        };
      },
    },
    ahoraTu: {
      pieza: GO,
      voz: 'Ubica los lados iguales y mira qué ángulos tienen enfrente.',
      generar(s) { return conCuatro([casoBase, casoPunta, casoReciproco, casoOrden, casoCadena][s % 5], azar(s + 7)); },
    },
  };

  // ---------- Idea 4 (rehecha, 18 nov): desigualdad triangular ----------
  // Objeto de la primera pantalla: una lámpara de escritorio de brazo articulado, de costado (geo-objeto, lampara; dibujo
  // de prueba). Cambia: la abertura del codo (de 15° en 15°). · Permanece: los brazos de 40 cm y 25 cm. · Progresa: AC,
  // de la base a la cabeza. · Se reserva: los dos extremos, cerrado y estirado del todo (la predicción). · Debe verse: en
  // los extremos, base, codo y cabeza quedan en una recta: no hay triángulo.
  // Colores: el brazo de abajo (primer lado dado) naranja, el de arriba turquesa, AC en tinta discontinua, el codo en
  // carmín; en los ejercicios, los lados dados con su medida y lo pedido con «?» o x, en tinta.
  // Errores (hipótesis, sin medir): GE-DT1 toma la suma como único valor, GE-DT2 olvida el límite de abajo, GE-DT3 cuenta
  // los extremos (la trampa de San Marcos 2026-I); nuevos (18 nov): GE-DT4 cuenta uno solo de los extremos, GE-DT5
  // confunde el máximo con el mínimo, GE-DT6 cree que el tercer lado no pasa del mayor, GE-DT7 repite el lado corto en el
  // isósceles, GE-DT8 suma solo los dos lados dados, GE-DT9 cree que el isósceles admite las dos formas, GE-DT10 suma o
  // resta solo un par de lados, GE-DT11 en la diagonal usa un solo triángulo, GE-DT12 junta los dos rangos en vez de
  // cruzarlos, GE-DT13 cree que con el mayor menor que la suma de los otros no alcanza.
  const VJ4 = { x: [-8.5, 47.5], y: [-5.2, 57] };
  const acDe = (g, p = 40, q = 25) => Math.sqrt(p * p + q * q - 2 * p * q * Math.cos(g * RAD));
  // El codo lleva su arco; su abertura se lee en el control (con 105° a 135°, su rótulo tocaba AC).
  const figJ4 = g => ({ objeto: 'lampara', g, vista: VJ4, angulos: { B: { radio: 14 } }, lados: { CB: { texto: '40 cm' }, BA: { texto: '25 cm', en: 0.38 }, AC: { texto: `≈ ${f(acDe(g), 1)} cm`, en: 0.62 } } });
  const D_DT = 'Desigualdad triangular: cada lado es menor que la suma de los otros dos y mayor que su diferencia.';
  const D_DT_TRIO = 'Tres largos forman triángulo si el mayor es menor que la suma de los otros dos.';
  const D_ISO_L = 'Isósceles: dos de sus tres lados miden igual.';
  // Tres palitos sueltos, uno debajo de otro, a escala (ejemplos de nivel 1): se ven sus largos, no si se cierran. En tinta:
  // ningún palito es «el primer dato» (lector en frío: el naranja y el turquesa de los palitos no decían nada).
  function palitos(ls) {
    const M = Math.max(...ls), sp = 0.17 * (M + 1.2), puntos = [], segmentos = [], ladosRot = [];
    ls.forEach((L, i) => {
      const y = -sp * i;
      puntos.push({ id: `p${i}`, x: 0, y }, { id: `q${i}`, x: L, y });
      segmentos.push({ de: `p${i}`, a: `q${i}`, grosor: 'variable' });
      ladosRot.push({ de: `p${i}`, a: `q${i}`, texto: `${f(L)} cm`, ref: [L / 2, y - 1], dist: 4, en: 0.5 });
    });
    return { objeto: 'angulos', ladosRot, figura: { alt: `Palitos sueltos de ${ls.map(f).join(' cm, ')} cm, uno debajo de otro, a escala.`,
      vista: { x: [-0.6, M + 0.6], y: [-sp * (ls.length - 1) - 0.4 * sp, 0.85 * sp] }, alto: 40 + 46 * ls.length, puntos, segmentos, angulos: [] } };
  }
  // Un triángulo con dos lados dados (p y q, en cm) unidos en B con 70°, y el tercero, x, por averiguar.
  function dosLados(p, q, o = {}) {
    const A = U.polar([0, 0], p, 70), C = [q, 0];
    return { objeto: 'angulos', ladosRot: [{ de: 'B', a: 'A', texto: o.tp || `${f(p)} cm`, color: 'o' }, { de: 'B', a: 'C', texto: o.tq || `${f(q)} cm`, color: 'i' }, { de: 'A', a: 'C', texto: o.tx || 'x' }],
      figura: { alt: o.alt || `Triángulo con dos lados de ${f(p)} cm y ${f(q)} cm; el tercero, x, une sus puntas.`, vista: vistaPs([A, [0, 0], C], 1.4), alto: 230,
        puntos: [{ id: 'A', x: A[0], y: A[1], rotulo: 'A', lado: 100, sinPunto: true }, { id: 'B', x: 0, y: 0, rotulo: 'B', lado: 210, sinPunto: true }, { id: 'C', x: q, y: 0, rotulo: 'C', lado: -30, sinPunto: true }],
        segmentos: [{ de: 'B', a: 'A', color: 'o', grosor: 'variable' }, { de: 'B', a: 'C', color: 'i', grosor: 'variable' }, { de: 'A', a: 'C', discontinua: true }], angulos: [] } };
  }
  const vistaPs = (ps, m) => { const xs = ps.map(p => p[0]), ys = ps.map(p => p[1]); return { x: [Math.min(...xs) - m, Math.max(...xs) + m], y: [Math.min(...ys) - m, Math.max(...ys) + m] }; };
  // El cuadrilátero ABCD con su diagonal AC (de largo x0, solo para dibujarlo): ABC abajo de AC y ACD arriba.
  function cuadri(a, b, c, d, x0) {
    const A = [0, 0], C = [x0, 0], ang = (p, q, r) => Math.acos((p * p + q * q - r * r) / (2 * p * q)) / RAD;
    const B = U.polar(A, a, -ang(a, x0, b)), D = U.polar(A, d, ang(d, x0, c));
    const P = { A, B, C, D }, lab = { A: 180, B: -90, C: 0, D: 90 };
    return { objeto: 'angulos', ladosRot: [{ de: 'A', a: 'B', texto: `${a} cm` }, { de: 'B', a: 'C', texto: `${b} cm` }, { de: 'C', a: 'D', texto: `${c} cm` }, { de: 'D', a: 'A', texto: `${d} cm` }, { de: 'A', a: 'C', texto: 'x', dist: 4, ref: Math.abs(B[1]) > Math.abs(D[1]) ? 'D' : 'B', en: 0.62 }],
      figura: { alt: `Cuadrilátero ABCD de lados ${a}, ${b}, ${c} y ${d} cm, con la diagonal AC.`, vista: vistaPs(Object.values(P), 1.5), alto: 250,
        puntos: Object.entries(P).map(([id, p]) => ({ id, x: p[0], y: p[1], rotulo: id, lado: lab[id], sinPunto: true })),
        segmentos: [{ de: 'A', a: 'B' }, { de: 'B', a: 'C' }, { de: 'C', a: 'D' }, { de: 'D', a: 'A' }, { de: 'A', a: 'C', discontinua: true }], angulos: [] } };
  }
  // Un punto P dentro del triángulo, a distancias PB = p y PC = q (en cm) de dos vértices; BC se dibuja con 0,85·(p + q),
  // lejos del tope, y A queda justo encima de P: así P cae adentro y su letra, arriba, no toca AB ni AC.
  function puntoDentro(p = 5, q = 7) {
    const L = 0.85 * (p + q), x = (p * p - q * q + L * L) / (2 * L), P = [x, Math.sqrt(Math.max(0.01, p * p - x * x))];
    const B = [0, 0], C = [L, 0], A = [x, P[1] + Math.max(3.6, 0.45 * L)];
    return { objeto: 'angulos', ladosRot: [{ de: 'P', a: 'B', texto: `${f(p)} cm`, ref: 'A', dist: 4 }, { de: 'P', a: 'C', texto: `${f(q)} cm`, ref: 'A', dist: 4 }, { de: 'B', a: 'C', texto: '?', ref: 'A', dist: 6 }],
      figura: { alt: 'Triángulo ABC con un punto P adentro, unido a B y a C.', vista: vistaPs([A, B, C], 1.1), alto: 240,
        puntos: [{ id: 'A', x: A[0], y: A[1], rotulo: 'A', lado: 90, sinPunto: true }, { id: 'B', x: 0, y: 0, rotulo: 'B', lado: 210, sinPunto: true }, { id: 'C', x: C[0], y: 0, rotulo: 'C', lado: -30, sinPunto: true }, { id: 'P', x: P[0], y: P[1], rotulo: 'P', lado: 90 }],
        segmentos: [{ de: 'A', a: 'B' }, { de: 'B', a: 'C' }, { de: 'C', a: 'A' }, { de: 'P', a: 'B', color: 'o' }, { de: 'P', a: 'C', color: 'i' }], angulos: [] } };
  }

  // Ejemplos resueltos de «Desigualdad triangular». Cuentas rehechas aparte (scratchpad f3-geo/cuentas.js): 3 + 4 = 7 < 8;
  // 5 + 7 = 12 > 11; 30 − 18 = 12 y 30 + 18 = 48; 4 + 6 = 10, no pasa; 6 + 9 − 1 = 14; 5 < x < 19: 13 enteros; 9, 9 y 4:
  // 22; 3 < x + 2 < 13, x de 2 a 10: 9; 4 y 10: el tercero de 7 en adelante, 21; 5 < x < 11 y par: 6, 8 y 10; diagonal:
  // 3 < x < 13 y 3 < x < 15, de 4 a 12: 9; x de 3 a 6: 4; BC < 12: 11; palitos de 2 a 6: 7 tríos; perímetro 20: base 2, 4,
  // 6 u 8: 4.
  const EJ4 = [];
  EJ4.push({ nivel: 1, titulo: '¿Se arma el triángulo?',
    figura: fig(palitos([8, 4, 3])),
    enunciado: 'Rosa tiene tres palitos de 3 cm, 4 cm y 8 cm. ¿Puede armar un triángulo juntándolos punta con punta?',
    datos: [D_DT_TRIO],
    solucion: [{ texto: 'Comparo el mayor con la suma de los otros dos:', ecuacion: junto('3 + 4 = 7 < 8') }, { texto: 'Los dos cortos no alcanzan a cubrir el largo: no se cierra.' }],
    respuesta: [dF('No'), ': 3 + 4 no llega a 8'] });
  EJ4.push({ nivel: 1, titulo: 'Con 5, 7 y 11',
    figura: fig(palitos([11, 7, 5])),
    enunciado: '¿Se puede armar un triángulo con palitos de 5 cm, 7 cm y 11 cm?',
    datos: [D_DT_TRIO],
    solucion: [{ texto: 'El mayor, 11 cm, frente a la suma de los otros dos:', ecuacion: junto('5 + 7 = 12 > 11') }, { texto: 'Los dos cortos sí alcanzan: el triángulo se cierra.' }],
    respuesta: [dF('Sí'), ': 5 + 7 pasa de 11'] });
  EJ4.push({ nivel: 1, titulo: 'Los límites de una lámpara',
    figura: fig({ objeto: 'lampara', CB: 30, BA: 18, g: 80, angulos: { B: null }, vista: { x: [-8, 37], y: [-5, 32] }, lados: { CB: { texto: '30 cm' }, BA: { texto: '18 cm' }, AC: { texto: '?', en: 0.6 } } }),
    enunciado: 'Una lámpara tiene un brazo de abajo de 30 cm y uno de arriba de 18 cm. ¿Entre qué valores puede estar AC, de la base a la cabeza, si forman triángulo?',
    datos: [D_DT],
    solucion: [{ texto: 'AC queda entre la diferencia y la suma de los brazos, sin llegar a ninguna:', ecuacion: junto(['30 − 18 < AC < 30 + 18   →   ', dF('12 cm < AC < 48 cm')]) }],
    respuesta: ['Entre ', dF('12 cm'), ' y ', dF('48 cm'), ', sin llegar a ellos'] });
  EJ4.push({ nivel: 1, titulo: 'El caso justo',
    figura: fig(palitos([10, 6, 4])),
    enunciado: '¿Se puede armar un triángulo con palitos de 4 cm, 6 cm y 10 cm?',
    datos: [D_DT_TRIO],
    solucion: [{ texto: 'La suma de los dos cortos es justo el largo:', ecuacion: junto('4 + 6 = 10') }, { texto: 'Juntos quedan alineados sobre el largo: es un segmento, no un triángulo.' }],
    respuesta: [dF('No'), ': quedan alineados'] });
  EJ4.push({ nivel: 1, titulo: 'El mayor valor entero',
    figura: fig(dosLados(6, 9)),
    enunciado: 'Dos lados de un triángulo miden 6 cm y 9 cm. Si el tercero, x, mide un número entero de cm, ¿cuál es su mayor valor?',
    datos: [D_DT],
    solucion: [{ texto: 'x tiene que ser menor que 6 + 9 = 15. El mayor entero menor que 15:', ecuacion: junto(['x < 15   →   x = ', dF('14 cm')]) }],
    respuesta: ['x = ', dF('14 cm')] });
  EJ4.push({ nivel: 2, titulo: '¿Cuántos valores enteros?',
    figura: fig(dosLados(7, 12)),
    enunciado: 'Dos lados de un triángulo miden 7 cm y 12 cm. ¿Cuántos valores enteros, en cm, puede tomar el tercer lado x?',
    datos: [D_DT],
    solucion: [
      { texto: 'Los dos límites:', ecuacion: junto('12 − 7 < x < 12 + 7   →   5 < x < 19') },
      { texto: 'Los enteros van de 6 a 18, sin los bordes:', ecuacion: junto(['18 − 6 + 1 = ', dF('13')]) },
    ],
    respuesta: [dF('13'), ' valores'] });
  EJ4.push({ nivel: 2, titulo: 'Isósceles de 4 y 9',
    figura: fig(palitos([9, 4])),
    enunciado: 'Un triángulo isósceles tiene un lado de 4 cm y otro de 9 cm. ¿Cuánto mide su perímetro?',
    datos: [D_ISO_L, D_DT_TRIO],
    solucion: [
      { texto: 'El tercer lado repite a uno de los dos. Con 4, 4 y 9 no se cierra:', ecuacion: junto('4 + 4 = 8 < 9') },
      { texto: 'Tiene que ser 9, 9 y 4 (9 + 4 > 9):', ecuacion: junto(['9 + 9 + 4 = ', dF('22 cm')]) },
    ],
    respuesta: ['Perímetro: ', dF('22 cm')] });
  EJ4.push({ nivel: 2, titulo: 'Un lado con x',
    figura: fig(dosLados(5, 8, { tx: '(x + 2) cm', alt: 'Triángulo con lados de 5 cm, 8 cm y x + 2 cm.' })),
    enunciado: 'Los lados de un triángulo miden 5 cm, 8 cm y (x + 2) cm. ¿Cuántos valores enteros puede tomar x?',
    datos: [D_DT],
    solucion: [
      { texto: 'El lado x + 2 queda entre 8 − 5 y 8 + 5:', ecuacion: [junto('3 < x + 2 < 13'), '   →   ', junto('1 < x < 11')] },
      { texto: 'Los enteros de 2 a 10, contando los dos extremos:', ecuacion: junto(['10 − 2 + 1 = ', dF('9')]) },
    ],
    respuesta: [dF('9'), ' valores'] });
  EJ4.push({ nivel: 2, titulo: 'El menor perímetro entero',
    figura: fig(dosLados(4, 10)),
    enunciado: 'Dos lados de un triángulo miden 4 cm y 10 cm, y el tercero mide un número entero de cm. ¿Cuál es el menor perímetro posible?',
    datos: [D_DT, 'Perímetro: la suma de los tres lados.'],
    solucion: [
      { texto: 'El tercero pasa de 10 − 4 = 6: el menor entero es 7.', ecuacion: junto('6 < x   →   x = 7') },
      { texto: 'Sumo los tres:', ecuacion: junto(['4 + 10 + 7 = ', dF('21 cm')]) },
    ],
    respuesta: ['Perímetro: ', dF('21 cm')] });
  EJ4.push({ nivel: 2, titulo: 'El tercer lado es par',
    figura: fig(dosLados(3, 8)),
    enunciado: 'Dos lados de un triángulo miden 3 cm y 8 cm, y el tercero mide un número par de cm. ¿Cuántos triángulos distintos se pueden armar?',
    datos: [D_DT],
    solucion: [
      { texto: 'Los límites del tercer lado:', ecuacion: junto('8 − 3 < x < 8 + 3   →   5 < x < 11') },
      { texto: 'Los pares entre 5 y 11 son 6, 8 y 10.' },
    ],
    respuesta: [dF('3'), ' triángulos'] });
  EJ4.push({ nivel: 3, titulo: 'La diagonal del cuadrilátero',
    figura: fig(cuadri(5, 8, 6, 9, 8)),
    enunciado: 'En el cuadrilátero ABCD, AB = 5 cm, BC = 8 cm, CD = 6 cm y DA = 9 cm. ¿Cuántos valores enteros puede tomar la diagonal AC?',
    datos: [D_DT],
    solucion: [
      { texto: 'AC es lado de dos triángulos: ABC y ACD.', ecuacion: [junto('ABC: 3 < x < 13'), Y, junto('ACD: 3 < x < 15')] },
      { texto: 'Tiene que cumplir los dos a la vez: 3 < x < 13. Los enteros van de 4 a 12:', ecuacion: junto(['12 − 4 + 1 = ', dF('9')]) },
    ],
    respuesta: [dF('9'), ' valores'] });
  EJ4.push({ nivel: 3, titulo: 'Tres lados con x',
    enunciado: 'Los lados de un triángulo miden x, x + 3 y 10 − x, en cm. ¿Cuántos valores enteros puede tomar x?',
    datos: [D_DT],
    solucion: [
      { texto: 'Cada lado es menor que la suma de los otros dos:', ecuacion: [junto('10 − x < 2x + 3'), COMA, junto('x + 3 < 10'), Y, junto('x < 13')] },
      { texto: 'Queda 7/3 < x < 7: los enteros 3, 4, 5 y 6.' },
    ],
    respuesta: [dF('4'), ' valores'] });
  EJ4.push({ nivel: 3, titulo: 'Un punto dentro del triángulo',
    figura: fig(puntoDentro()),
    enunciado: 'P está dentro del triángulo ABC, con PB = 5 cm y PC = 7 cm. Si BC mide un número entero de cm, ¿cuál es su mayor valor?',
    datos: [D_DT],
    solucion: [
      { texto: 'B, P y C forman un triángulo: BC es menor que PB + PC.', ecuacion: junto('BC < 5 + 7 = 12') },
      { texto: 'Con BC = 12, P quedaría sobre BC, no adentro. El mayor entero menor que 12:', ecuacion: junto(['BC = ', dF('11 cm')]) },
    ],
    respuesta: ['BC = ', dF('11 cm')] });
  EJ4.push({ nivel: 3, titulo: 'Cinco palitos',
    figura: fig(palitos([6, 5, 4, 3, 2])),
    enunciado: 'Hay cinco palitos de 2, 3, 4, 5 y 6 cm. ¿Cuántos triángulos distintos se arman eligiendo tres de ellos?',
    datos: [D_DT_TRIO],
    solucion: [
      { texto: 'Con el 2 van dos de los otros cuatro: seis tríos. Sirven tres; en los demás, 2 más el del medio no supera al mayor.', ecuacion: [junto('2, 3, 4 ✓   2, 4, 5 ✓   2, 5, 6 ✓'), '      ', junto('2, 3, 5 ✗   2, 3, 6 ✗   2, 4, 6 ✗')] },
      { texto: 'Sin el 2 hay cuatro tríos, y sirven todos:', ecuacion: junto('3, 4, 5 ✓   3, 4, 6 ✓   3, 5, 6 ✓   4, 5, 6 ✓') },
      { texto: 'Junto los que sirven:', ecuacion: junto(['3 tríos + 4 tríos = ', dF('7')]) },
    ],
    respuesta: [dF('7'), ' triángulos'] });
  EJ4.push({ nivel: 3, titulo: 'Isósceles de perímetro 20',
    enunciado: 'Un triángulo isósceles tiene 20 cm de perímetro y sus lados miden números enteros de cm. ¿Cuántos triángulos distintos hay?',
    datos: [D_ISO_L, D_DT_TRIO],
    solucion: [
      { texto: 'Con lados a, a y una base b: 2a + b = 20, así que b es par.' },
      { texto: 'La base tiene que ser menor que a + a = 20 − b: b < 10. Sirven b = 2, 4, 6 y 8.', ecuacion: junto('b < 20 − b   →   b < 10') },
    ],
    respuesta: [dF('4'), ' triángulos'] });

  // «Ahora tú» de la idea 4: cinco tipos (s % 5).
  function dos(r) { for (;;) { const p = r.ent(3, 14), q = r.ent(3, 14); if (p !== q && Math.max(p, q) <= 3 * Math.min(p, q)) return [p, q]; } }
  function casoCuantos(r) {
    let p, q; do { [p, q] = dos(r); } while (!sirve(dosLados(p, q)));
    const _ = 0, lo = Math.abs(p - q), hi = p + q, n = hi - lo - 1;
    return { pregunta: `Dos lados de un triángulo miden ${p} cm y ${q} cm. ¿Cuántos valores enteros, en cm, puede tomar el tercer lado x?`, datos: [D_DT], dibujo: fig(dosLados(p, q)),
      opciones: opciones(n, [
        { id: 'bordes', valor: n + 2, error: 'GE-DT3', siFuera: `Contar ${lo} y ${hi} serviría si los extremos dieran triángulo; ahí los puntos quedan alineados.` },
        { id: 'arriba', valor: hi - 1, error: 'GE-DT2', siFuera: 'El límite de arriba está bien; también hay uno de abajo: la diferencia.' },
        { id: 'uno', valor: n + 1, error: 'GE-DT4', siFuera: 'Eso incluye uno de los extremos; ninguno de los dos da triángulo.' },
      ], n => `${f(n, 0)} valores`),
      solucion: { texto: `x va de más de ${lo} a menos de ${hi}.`, ecuacion: junto(`${lo} < x < ${hi}   →   ${n} enteros`) } };
  }
  function casoMax(r) {
    let p, q; do { [p, q] = dos(r); } while (!sirve(dosLados(p, q)));
    const _ = 0, hi = p + q;
    return { pregunta: `Dos lados de un triángulo miden ${p} cm y ${q} cm. Si el tercero, x, mide un número entero de cm, ¿cuál es su mayor valor?`, datos: [D_DT], dibujo: fig(dosLados(p, q)),
      opciones: opciones(hi - 1, [
        { id: 'suma', valor: hi, error: 'GE-DT3', siFuera: `Con ${hi} cm los tres puntos quedan alineados: es un segmento, no un triángulo.` },
        { id: 'min', valor: Math.abs(p - q) + 1, error: 'GE-DT5', siFuera: 'Ese es el menor entero posible; piden el mayor.' },
        { id: 'mayor', valor: Math.max(p, q), error: 'GE-DT6', siFuera: 'El tercer lado sí puede pasar al mayor de los otros dos; el tope es su suma.' },
      ], fmtCm),
      solucion: { texto: `x < ${p} + ${q} = ${hi}: el mayor entero es uno menos.`, ecuacion: junto(`x = ${hi - 1} cm`) } };
  }
  function casoMin(r) {
    let p, q; do { [p, q] = dos(r); } while (!sirve(dosLados(p, q)));
    const _ = 0, lo = Math.abs(p - q);
    return { pregunta: `Dos lados de un triángulo miden ${p} cm y ${q} cm. Si el tercero, x, mide un número entero de cm, ¿cuál es su menor valor?`, datos: [D_DT], dibujo: fig(dosLados(p, q)),
      opciones: opciones(lo + 1, [
        { id: 'resta', valor: lo, error: 'GE-DT3', siFuera: `Con ${lo} cm los tres puntos quedan alineados: no hay triángulo.` },
        { id: 'uno', valor: 1, error: 'GE-DT2', siFuera: 'Cualquier largo positivo no sirve: el tercer lado pasa de la diferencia.' },
        { id: 'max', valor: p + q - 1, error: 'GE-DT5', siFuera: 'Ese es el mayor entero posible; piden el menor.' },
      ], fmtCm),
      solucion: { texto: `x > ${Math.max(p, q)} − ${Math.min(p, q)} = ${lo}: el menor entero es uno más.`, ecuacion: junto(`x = ${lo + 1} cm`) } };
  }
  function casoIsoDT(r) {
    for (;;) {
      const a = r.ent(2, 7), b = r.ent(2 * a, 2 * a + 7);
      if (!sirve(palitos([b, a]))) continue;
      const ops = [
        { id: 'c', texto: `${2 * b + a} cm`, correcta: true },
        { id: 'corto', texto: `${2 * a + b} cm`, error: 'GE-DT7', siFuera: `Repetir un lado está bien; pero ${a} + ${a} no alcanza a ${b}: se repite el largo.` },
        { id: 'dos', texto: `${a + b} cm`, error: 'GE-DT8', siFuera: 'Sumar los lados está bien; el perímetro lleva también el lado que se repite.' },
        { id: 'ambos', texto: `${2 * a + b} cm o ${2 * b + a} cm`, error: 'GE-DT9', siFuera: `Las dos formas existirían si ${a} + ${a} pasara de ${b}; aquí una no se cierra.` },
      ];
      return { pregunta: `Un triángulo isósceles tiene un lado de ${a} cm y otro de ${b} cm. ¿Cuánto mide su perímetro?`, datos: [D_ISO_L, D_DT_TRIO], dibujo: fig(palitos([b, a])), opciones: ops,
        solucion: { texto: `${a}, ${a} y ${b} no se cierran (${2 * a} ≤ ${b}): son ${b}, ${b} y ${a}.`, ecuacion: junto(`${b} + ${b} + ${a} = ${2 * b + a} cm`) } };
    }
  }
  function casoDiagonal(r) {
    for (let i = 0; i < 400; i++) {
      const a = r.ent(3, 10), b = r.ent(3, 12), c = r.ent(3, 10), d = r.ent(3, 12);
      const lo = Math.max(Math.abs(a - b), Math.abs(c - d)), hi = Math.min(a + b, c + d), n = hi - lo - 1;
      if (n < 3 || Math.abs(a - b) === Math.abs(c - d) || a + b === c + d) continue;
      const n1 = a + b - Math.abs(a - b) - 1, n2 = Math.max(a + b, c + d) - Math.min(Math.abs(a - b), Math.abs(c - d)) - 1;
      const ops = opciones(n, [
        { id: 'uno', valor: n1 === n ? c + d - Math.abs(c - d) - 1 : n1, error: 'GE-DT11', siFuera: 'Ese conteo vale para un solo triángulo; AC también es lado del otro.' },
        { id: 'union', valor: n2, error: 'GE-DT12', siFuera: 'Juntar los dos rangos no basta: AC tiene que cumplir los dos a la vez.' },
        { id: 'bordes', valor: n + 2, error: 'GE-DT3', siFuera: `En ${lo} o en ${hi} uno de los triángulos se aplasta: los bordes no cuentan.` },
      ], v => `${f(v, 0)} valores`);
      if (ops.length < 4 || !sirve(cuadri(a, b, c, d, (lo + hi) / 2))) continue;
      return { pregunta: `En el cuadrilátero ABCD, AB = ${a} cm, BC = ${b} cm, CD = ${c} cm y DA = ${d} cm. ¿Cuántos valores enteros puede tomar la diagonal AC?`,
        datos: [D_DT], dibujo: fig(cuadri(a, b, c, d, (lo + hi) / 2)), opciones: ops,
        solucion: { texto: 'AC cumple a la vez los límites de ABC y de ACD.', ecuacion: junto(`${lo} < AC < ${hi}   →   ${n} enteros`) } };
    }
    throw new Error('casoDiagonal');
  }

  const desigualdad = {
    id: 'desigualdad',
    titulo: 'Desigualdad triangular',
    pregunta: '¿Con qué tres largos se puede armar un triángulo?',
    temas: ['Desigualdad triangular'],
    pieza: GO,
    aprendizaje: 'Cada lado es menor que la suma de los otros dos y mayor que su diferencia; en los extremos no hay triángulo, solo un segmento.',
    actividad: 'Abrir y cerrar el codo de una lámpara y ver cuánto se aleja su cabeza.',
    // Lee: la lámpara y sus partes, y los palitos. No dice entre qué valores queda AC ni qué pasa en los extremos (eso es
    // la predicción).
    lee: {
      tarjetas: [
        { titulo: 'La lámpara de escritorio', texto: 'La lámpara tiene dos brazos unidos en un codo: el de abajo, CB, mide 40 cm, y el de arriba, BA, 25 cm. C es la base, B el codo y A la cabeza. AC, de la base a la cabeza, es el tercer lado.',
          pieza: GO, dibujo: fig({ objeto: 'lampara', g: 105, angulos: { B: {} }, lados: { CB: { texto: '40 cm' }, BA: { texto: '25 cm' } } }) },
        { titulo: 'Tres palitos', texto: 'Con tres palitos puestos punta con punta se puede armar un triángulo. Con algunos tríos la figura se cierra y con otros no. El juego te deja ver por qué.',
          pieza: GO, dibujo: fig(palitos([7, 5, 4])) },
        { titulo: 'Qué mirar al jugar', texto: 'Abre y cierra el codo hasta los topes. Fíjate cuánto mide AC cuando el codo está casi cerrado y cuando está casi estirado.' },
      ],
    },
    ejemplos: EJ4,
    juega: {
      pieza: GO,
      consigna: 'Los brazos de la lámpara miden 40 cm y 25 cm. La base C queda quieta; abres o cierras el codo B.',
      mision: { texto: 'Estira el codo hasta que la cabeza quede a más de 62 cm de la base.', logrado: v => acDe(v.g) > 62, bien: 'Listo: 62,9 cm. Se acerca a 40 + 25 = 65 cm, pero no llega.' },
      voz: 'Abre y cierra el codo. ¿Cuánto puede alejarse la cabeza?',
      leyenda: [
        { s: 'C, B, A', t: 'la base, el codo y la cabeza' },
        { s: dO('CB'), t: 'el brazo de abajo, de 40 cm' },
        { s: dI('BA'), t: 'el brazo de arriba, de 25 cm' },
        { s: 'AC', t: 'de la base a la cabeza' },
        { s: dH('m∠B'), t: 'la abertura del codo' },
      ],
      controles: [{ id: 'g', etiqueta: 'm∠B, la abertura del codo', min: 45, max: 150, paso: 15, inicio: 105, unidad: '°', decimales: 0, color: 'c-h' }],
      dibujo: v => ({ datos: figJ4(v.g), estado: {} }),
      // Gesto directo: se agarra la cabeza A; gira alrededor del codo B.
      arrastres: [{ id: 'cabeza-a', etiqueta: 'cabeza A de la lámpara: abre o cierra el codo', color: 'c-i',
        donde: v => PO.aPantalla(figJ4(v.g), U.polar(U.polar([0, 0], 40, 65), 25, 245 + v.g)),
        mover: (pt, v) => { const q = PO.aPlano(figJ4(v.g), pt), B = U.polar([0, 0], 40, 65); let a = U.grados(Math.atan2(q[1] - B[1], q[0] - B[0])) - 245; a = ((a % 360) + 360) % 360; return { g: a > 270 ? 0 : Math.min(a, 180) }; } }],
      lectura: v => [junto('AC ≈ '), `${f(acDe(v.g), 1)} cm`, junto(', menos que 40 + 25 = 65 cm')],
      minimo: 4,
    },
    predice: {
      pregunta: 'Imagina que el codo de la lámpara pudiera cerrarse del todo y estirarse del todo. ¿Entre qué valores puede estar AC para que base, codo y cabeza formen un triángulo?',
      datos: ['CB = 40 cm', 'BA = 25 cm'],
      voz: 'Imagina los dos extremos. ¿Queda un triángulo ahí?',
      opciones: [
        { id: 'c', texto: 'Entre 15 cm y 65 cm, sin llegar a ninguno', correcta: true },
        { id: 'cerrado', texto: 'De 15 cm a 65 cm, los dos incluidos', error: 'GE-DT3', siFuera: 'En 15 y en 65 los brazos sí existen, pero quedan en una recta: es un segmento.' },
        { id: 'arriba', texto: 'Cualquier valor menor que 65 cm', error: 'GE-DT2', siFuera: 'El tope de 65 cm está bien; pero AC tampoco baja de 40 − 25 = 15 cm.' },
        { id: 'suma', texto: 'Solo 65 cm', error: 'GE-DT1', siFuera: 'Sumar 40 + 25 da el tope de arriba; AC puede tomar todo un rango.' },
      ],
      dibujo: fig({ objeto: 'lampara', g: 105, angulos: { B: {} }, lados: { CB: { texto: '40 cm' }, BA: { texto: '25 cm' }, AC: { texto: '?', en: 0.6 } } }),
      revelar: fig({ objeto: 'lampara', g: 105, ac: false, angulos: { B: {} }, lados: { CB: { texto: '40 cm', en: 0.78 }, BA: { texto: '25 cm' } }, extremos: 0, textoExtremos: ['AC = 15 cm', 'AC = 65 cm'] }),
      coincide: 'Coincide: 40 − 25 < AC < 40 + 25. En los extremos, base, codo y cabeza quedan en una recta: no hay triángulo.',
      noCoincide: 'Revisemos: cerrado del todo, AC = 15 cm; estirado del todo, 65 cm. En los dos, un segmento sin triángulo.',
    },
    mira: {
      pieza: GO,
      datos: { objeto: 'lampara', g: 105, ac: false, angulos: { B: {} }, lados: { CB: { texto: '40 cm', en: 0.78 }, BA: { texto: '25 cm' } }, extremos: 1, textoExtremos: ['AC = 15 cm', 'AC = 65 cm'] },
      voz: 'Mira los dos extremos: ahí el triángulo desaparece.',
      pasos: [
        { estado: { corte: 0 }, texto: 'La lámpara del juego, con el codo abierto a 105°.', ecuacion: junto(['CB = ', dO('40 cm'), ', BA = ', dI('25 cm')]) },
        { estado: { corte: 1 }, texto: 'Cerrado del todo, la cabeza cae sobre CB, en el punto hueco.', ecuacion: junto('AC = 40 − 25 = 15 cm: un segmento') },
        { estado: { corte: 1 }, texto: 'Estirado del todo, A sigue la recta de CB.', ecuacion: junto('AC = 40 + 25 = 65 cm: otro segmento') },
        { estado: { corte: 1 }, texto: 'Ir de C a A por el codo es más largo que ir directo.', ecuacion: junto('AC < CB + BA') },
        { estado: { corte: 1 }, texto: 'Toda abertura entre los dos extremos deja un triángulo de verdad.', ecuacion: junto('40 − 25 < AC < 40 + 25') },
      ],
    },
    regla: {
      texto: 'Cada lado de un triángulo es menor que la suma de los otros dos y mayor que su diferencia. En los extremos, los tres puntos quedan alineados: no hay triángulo.',
      ecuacion: [{ llave: [dO('CB'), ' − ', dI('BA')], nota: 'la diferencia' }, junto(' < AC < '), { llave: [dO('CB'), ' + ', dI('BA')], nota: 'la suma' }],
      condicion: 'las desigualdades son estrictas. Para tres largos, basta que el mayor sea menor que la suma de los otros dos.',
      voz: 'Los extremos no cuentan: ahí la figura es un segmento.',
    },
    // Así se resuelve: ¿forman triángulo tres largos?, o el punto interior. «Ahora tú» pide el conteo, el máximo,
    // el mínimo, el isósceles y la diagonal.
    resuelve: {
      pieza: GO,
      generar(s) {
        const r = azar(s + 900);
        if (s % 2 === 0) {
          let a, b, c;
          do { a = r.ent(2, 9); b = r.ent(a + 1, 12); c = r.ent(b + 1, 20); } while (c === a + b);
          const si = a + b > c;
          return {
            enunciado: `¿Se puede armar un triángulo con palitos de ${a} cm, ${b} cm y ${c} cm?`,
            datos: [D_DT_TRIO], dibujo: fig(palitos([c, b, a])),
            pasos: [
              { tipo: 'pide', texto: 'Piden si los tres palitos se cierran en un triángulo.' },
              { tipo: 'datos', texto: `Los largos son ${a}, ${b} y ${c} cm; el mayor es ${c} cm.` },
              { tipo: 'regla', texto: 'Basta comparar el mayor con la suma de los otros dos: si la suma pasa al mayor, se cierra.' },
              { tipo: 'cuentas', texto: 'Sumo los dos cortos y comparo.', ecuacion: junto(`${a} + ${b} = ${a + b} ${si ? '>' : '<'} ${c}`) },
              { tipo: 'sentido', texto: si ? `Los otros dos casos también valen: ${a} + ${c} > ${b} y ${b} + ${c} > ${a}. Con el mayor alcanza.` : `Por más que los gires, ${a} y ${b} juntos no cubren ${c} cm.` },
            ],
            respuesta: si ? [dF('Sí'), ' se puede'] : [dF('No'), ' se puede'],
          };
        }
        let p, q; do { [p, q] = dos(r); } while (!sirve(puntoDentro(p, q)));
        const x = p + q - 1;
        return {
          enunciado: `P está dentro del triángulo ABC, con PB = ${p} cm y PC = ${q} cm. Si BC mide un número entero de cm, ¿cuál es su mayor valor?`,
          datos: [D_DT], dibujo: fig(puntoDentro(p, q)),
          pasos: [
            { tipo: 'pide', texto: 'Piden el mayor valor entero de BC.' },
            { tipo: 'datos', texto: `P está adentro, a ${p} cm de B y a ${q} cm de C.` },
            { tipo: 'regla', texto: 'B, P y C forman un triángulo: BC es menor que la suma de PB y PC.', ecuacion: junto(`BC < ${p} + ${q} = ${p + q}`) },
            { tipo: 'cuentas', texto: `El mayor entero menor que ${p + q}:`, ecuacion: junto(['BC = ', dF(`${x} cm`)]) },
            { tipo: 'sentido', texto: `Con BC = ${p + q} cm, P quedaría sobre BC, no adentro del triángulo.` },
          ],
          respuesta: ['BC = ', dF(`${x} cm`)],
        };
      },
    },
    ahoraTu: {
      pieza: GO,
      voz: 'Primero los dos límites; después mira qué piden.',
      generar(s) { return conCuatro([casoCuantos, casoMax, casoMin, casoIsoDT, casoDiagonal][s % 5], azar(s + 7)); },
    },
  };

  // ---------- Idea 5 (rehecha, 18 nov): líneas notables ----------
  // Objeto de la primera pantalla: un caserío junto a una carretera recta con dos paraderos (geo-objeto, caserio; dibujo
  // de prueba). Cambia: dónde queda el caserío, en paralelo a la carretera (de 0,5 km en 0,5 km). · Permanece: los
  // paraderos B y C, a 6 km. · Progresa: los pies H, F y M de los tres caminos. · Se reserva: el caserío más allá de B, con
  // el ángulo B obtuso (la predicción). · Debe verse: las tres líneas se juntan solo cuando AB = AC.
  // Colores: altura naranja con su cuadradito, mediana turquesa con la rayita de sus dos mitades sobre llaves, bisectriz
  // carmín con sus dos arcos, mediatriz en tinta discontinua (solo como definición). En los ejercicios, la línea que hay
  // que reconocer, y toda ceviana, va en tinta: se lee por su marca, no por su color; lo dado en carmín.
  // Errores: GE7 (la altura siempre cae dentro o es un lado) y GE8 (altura, mediana y bisectriz son la misma línea) tienen
  // datos (docs/investigacion/geometria-ideas-erroneas.md); GE7 se parte en GE7-a (dentro, inclinada) y GE7-b (un lado
  // como altura). Hipótesis nuevas (18 nov): GE-LN1 llama altura a cualquier línea que baja de un vértice, GE-LN2 llama
  // bisectriz a cualquier línea que sale de un vértice, GE-LN3 llama mediatriz a la que forma 90° aunque salga de un
  // vértice, GE-LN4 cree que en un rectángulo o un acutángulo la altura cae fuera, GE-LN5 copia el ángulo B en ∠BAH,
  // GE-LN6 da ∠ABH (el suplemento) en vez de ∠BAH, GE-LN7 parte el ángulo en dos como si fuera bisectriz, GE-LN8 usa el
  // ángulo A entero y no su mitad, GE-LN9 da el ángulo del otro lado del pie (∠AFB), GE-LN10 cree que la bisectriz forma
  // 90° con el lado, GE-LN11 no divide entre dos la diferencia de B y C, GE-LN12 promedia B y C, GE-LN13 se queda en ∠BAH.
  const AY5 = 3.6, VJ5 = { x: [-3.1, 7.6], y: [-1.95, 5.0] };
  const LIN5 = { h: { color: 'o' }, m: { color: 'i' }, b: { color: 'h' } };
  const figJ5 = ax => ({ objeto: 'caserio', ax, ay: AY5, lineas: LIN5, vista: VJ5, manija: 'A' });
  const NOM5 = { h: 'altura', m: 'mediana', b: 'bisectriz', z: 'mediatriz' };
  // La figura de examen de un triángulo de base BC = 6 con ángulos b y c, con cevianas desde A (caserío sin carretera).
  // La vista va justa al triángulo (y al pie de la altura, si cae fuera); más abajo si hay llaves o medidas bajo BC.
  const vistaCev = (A, abajo) => { const xs = [A[0], 0, 6]; return { x: [Math.min(...xs) - 0.6, Math.max(...xs) + 0.6], y: [abajo ? -2.5 : -1.0, A[1] + 0.75] }; };
  const CEV = (b, c, o = {}) => { const { A } = vert(b, c); return Object.assign({ objeto: 'caserio', examen: true, ax: A[0], ay: A[1], vista: vistaCev(A, o.ladosRot || (o.lineas && (o.lineas.m || o.lineas.z))) }, o); };
  const D_ALT = 'Altura: va del vértice a la recta del lado opuesto y forma 90° con ella.';
  const D_MED = 'Mediana: va del vértice al punto medio del lado opuesto.';
  const D_BIS = 'Bisectriz: parte el ángulo del vértice en dos ángulos iguales.';
  const D_MZ = 'Mediatriz de un segmento: la recta perpendicular a él que pasa por su punto medio.';
  const D_MARCAS = 'Marcas: cuadradito = 90°; rayitas iguales = tramos iguales; arcos iguales = ángulos iguales.';

  // Ejemplos resueltos de «Líneas notables». Cuentas rehechas aparte (scratchpad f3-geo/cuentas.js): 6 ÷ 2 = 3; 70 ÷ 2 =
  // 35; 180 − 90 − 52 = 38; 6 ÷ 2 = 3; 3x − 1 = x + 7, x = 4, BC = 22; 2x + 5 = 3x − 10, x = 15, 70; 180 − 120 = 60,
  // 90 − 60 = 30; B = C = 50, A = 80; A = 80, BAF = 40, AFC = 60 + 40 = 100; A = 70, BAF = 35, BAH = 10, HAF = 25;
  // A = 40, ABF = 35, BFC = 75; ABH: 85 − 3x, BAF: 85 − 2x, la resta da x = 25, A = 180 − 80 − 30 = 70; AM = BM = MC:
  // 35 + 35 + 2C = 180, C = 55, A = 35 + 55 = 90; ABH = 180 − 3x, 90 + 180 − 3x + x = 180, x = 45, B = 135. Las del 18 nov
  // (ejemplos 13 y 15) rehechas por coordenadas en scratchpad cor-geo-cuentas/cuentas.js.
  const EJ5 = [];
  EJ5.push({ nivel: 1, titulo: '¿Qué camino es?',
    figura: fig({ objeto: 'caserio', ax: 4.2, ay: 3.4, lineas: { h: {} } }),
    enunciado: 'Del caserío A sale un camino recto hasta la carretera BC. En su pie lleva un cuadradito. ¿Qué línea notable es ese camino?',
    datos: [D_MARCAS, D_ALT, D_MED, D_BIS],
    solucion: [{ texto: 'El cuadradito dice que el camino llega formando 90° con la carretera. Esa es la condición de la altura.' }],
    respuesta: ['Es la ', dF('altura')] });
  EJ5.push({ nivel: 1, titulo: 'Al punto medio',
    figura: fig({ objeto: 'caserio', ax: 1.6, ay: 3.4, lineas: { m: {} } }),
    enunciado: 'Los paraderos B y C están a 6 km uno del otro. El camino AM del caserío es la mediana. ¿A qué distancia de B está M?',
    datos: [D_MED],
    solucion: [{ texto: 'La mediana llega al punto medio: parte el tramo BC en dos mitades iguales.', ecuacion: junto(['BM = 6 ÷ 2 = ', dF('3 km')]) }],
    respuesta: ['BM = ', dF('3 km')] });
  EJ5.push({ nivel: 1, titulo: 'Partir el ángulo',
    // Sin escala (lector en frío, ronda 2: con transportador salía la mitad): A se dibuja de 100°. El 70° va fuera del
    // ángulo, con su nombre: dentro, caía en la mitad FAC y se leía como de esa mitad.
    figura: fig(CEV(45, 35, { sinEscala: true, alt: 'Triángulo ABC, sin escala; AF parte el ángulo A en dos ángulos iguales y m∠BAC = 70°.',
      angulos: { A: { color: 'h', radio: 40 } }, lineas: { b: {} }, libres: [{ en: 'A', dir: 160, dist: 30, texto: 'm∠BAC = 70°', color: 'h' }] })),
    enunciado: 'En el triángulo ABC, m∠BAC = 70° y AF es la bisectriz del ángulo A. ¿Cuánto mide el ángulo BAF? El dibujo no está a escala.',
    datos: [D_BIS],
    solucion: [{ texto: 'La bisectriz deja dos ángulos iguales: cada uno es la mitad.', ecuacion: junto(['m∠BAF = 70° ÷ 2 = ', dF('35°')]) }],
    respuesta: ['m∠BAF = ', dF('35°')] });
  EJ5.push({ nivel: 1, titulo: 'La altura y un ángulo',
    figura: fig(CEV(52, 60, { angulos: { B: t('52°') }, lineas: { h: {} }, masAngulos: [{ en: 'A', de: 'B', a: 'H', texto: '?', radio: 30, holgura: 6, mide: 38 }] })),
    enunciado: 'En el triángulo ABC, AH es la altura y m∠B = 52°. ¿Cuánto mide el ángulo BAH?',
    datos: [D_ALT, D_SUMA_O],
    solucion: [{ texto: 'El triángulo ABH tiene un ángulo de 90° en H. A 180° le quito 90° y 52°:', ecuacion: junto(['m∠BAH = 180° − 90° − 52° = ', dF('38°')]) }],
    respuesta: ['m∠BAH = ', dF('38°')] });
  EJ5.push({ nivel: 1, titulo: 'Donde corta la mediatriz',
    figura: fig({ objeto: 'caserio', examen: true, ax: 1.1, ay: 3.2, lineas: { z: {} }, letras: { M: 'P' } }),
    enunciado: 'En el triángulo ABC, el lado BC mide 6 cm. La mediatriz de BC corta a BC en el punto P. ¿A qué distancia de B está P?',
    datos: [D_MZ],
    solucion: [{ texto: 'La mediatriz pasa por el punto medio de BC: P lo parte en dos mitades iguales.', ecuacion: junto(['BP = 6 ÷ 2 = ', dF('3 cm')]) }],
    respuesta: ['BP = ', dF('3 cm')] });
  EJ5.push({ nivel: 2, titulo: 'Mediana con x',
    figura: fig(CEV(55, 65, { lineas: { m: {} }, ladosRot: [{ de: 'B', a: 'M', texto: '3x − 1', ref: 'A', dist: 48 }, { de: 'M', a: 'C', texto: 'x + 7', ref: 'A', dist: 48 }] })),
    enunciado: 'En el triángulo ABC, AM es la mediana del lado BC. BM = (3x − 1) cm y MC = (x + 7) cm. ¿Cuánto mide BC?',
    datos: [D_MED],
    solucion: [
      { texto: 'M es el punto medio: las dos mitades son iguales.', ecuacion: [junto('3x − 1 = x + 7'), '   →   ', junto('2x = 8'), '   →   ', junto('x = 4')] },
      { texto: 'Cada mitad mide 11 cm:', ecuacion: junto(['BC = 2 · 11 = ', dF('22 cm')]) },
    ],
    respuesta: ['BC = ', dF('22 cm')] });
  EJ5.push({ nivel: 2, titulo: 'Bisectriz con x',
    figura: fig(CEV(50, 60, { lineas: { b: { arcos: 'h' } } })),
    enunciado: 'En el triángulo ABC, AF es la bisectriz del ángulo A. m∠BAF = 2x + 5° y m∠FAC = 3x − 10°. ¿Cuánto mide el ángulo BAC?',
    datos: [D_BIS],
    solucion: [
      { texto: 'Las dos mitades son iguales:', ecuacion: [junto('2x + 5° = 3x − 10°'), '   →   ', junto('x = 15')] },
      { texto: 'Cada mitad mide 35°; el ángulo entero, el doble:', ecuacion: junto(['m∠BAC = 2 · 35° = ', dF('70°')]) },
    ],
    respuesta: ['m∠BAC = ', dF('70°')] });
  EJ5.push({ nivel: 2, titulo: 'La altura que cae fuera',
    figura: fig(CEV(120, 25, { angulos: { B: t('120°', 'h', { radio: 14 }) }, lineas: { h: {} }, masAngulos: [{ en: 'A', de: 'H', a: 'B', texto: '?', radio: 40, holgura: 6, mide: 30 }] })),
    enunciado: 'En el triángulo ABC, m∠B = 120°. La altura desde A cae en H, en la prolongación de CB. ¿Cuánto mide el ángulo BAH?',
    datos: [D_ALT, D_ADY, D_SUMA_O],
    solucion: [
      { texto: 'En la recta CH, el ángulo ABH es vecino del de 120°:', ecuacion: junto('m∠ABH = 180° − 120° = 60°') },
      { texto: 'En el triángulo ABH, con 90° en H:', ecuacion: junto(['m∠BAH = 180° − 90° − 60° = ', dF('30°')]) },
    ],
    respuesta: ['m∠BAH = ', dF('30°')] });
  EJ5.push({ nivel: 2, titulo: 'Altura y bisectriz a la vez',
    figura: fig(CEV(50, 50, { angulos: { B: t('50°') }, lineas: { h: {}, b: {} } })),
    enunciado: 'En el triángulo ABC, la altura desde A también es la bisectriz del ángulo A. Si m∠B = 50°, ¿cuánto mide el ángulo BAC?',
    datos: [D_ALT, D_BIS, D_SUMA_O],
    solucion: [
      { texto: 'Los triángulos ABH y ACH tienen 90° en H y la misma mitad de A: también B y C son iguales.', ecuacion: junto('m∠C = m∠B = 50°') },
      { texto: 'Lo que queda para A:', ecuacion: junto(['m∠BAC = 180° − 50° − 50° = ', dF('80°')]) },
    ],
    respuesta: ['m∠BAC = ', dF('80°')] });
  EJ5.push({ nivel: 2, titulo: 'El ángulo en el pie',
    figura: fig(CEV(60, 40, { angulos: { B: t('60°'), C: t('40°', 'h', { radio: 26 }) }, lineas: { b: {} }, masAngulos: [{ en: 'F', de: 'C', a: 'A', texto: '?', radio: 18, holgura: 6, mide: 100 }] })),
    enunciado: 'En el triángulo ABC, m∠B = 60°, m∠C = 40° y AF es la bisectriz del ángulo A. ¿Cuánto mide el ángulo AFC?',
    datos: [D_SUMA, D_BIS, D_EXT],
    solucion: [
      { texto: 'm∠A = 180° − 60° − 40° = 80°; la bisectriz deja 40° a cada lado.', ecuacion: junto('m∠BAF = 40°') },
      { texto: '∠AFC es exterior del triángulo ABF:', ecuacion: junto(['m∠AFC = 60° + 40° = ', dF('100°')]) },
    ],
    respuesta: ['m∠AFC = ', dF('100°')] });
  EJ5.push({ nivel: 3, titulo: 'Entre la altura y la bisectriz',
    figura: fig(CEV(80, 30, { angulos: { B: { radio: 14, color: 'h' }, C: t('30°', 'h', { radio: 30 }) }, lineas: { h: {}, b: {} }, masAngulos: [{ en: 'A', de: 'H', a: 'F', texto: '?', radio: 30, holgura: 4, mide: 25 }] })),
    enunciado: 'En el triángulo ABC, m∠B = 80° y m∠C = 30°. AH es la altura y AF la bisectriz del ángulo A. ¿Cuánto mide el ángulo HAF?',
    datos: [D_SUMA, D_ALT, D_BIS],
    solucion: [
      { texto: 'm∠A = 70°: la bisectriz deja ∠BAF = 35°. En el triángulo ABH:', ecuacion: junto('m∠BAH = 180° − 90° − 80° = 10°') },
      { texto: 'La altura queda entre AB y la bisectriz:', ecuacion: junto(['m∠HAF = 35° − 10° = ', dF('25°')]) },
    ],
    respuesta: ['m∠HAF = ', dF('25°')] });
  EJ5.push({ nivel: 3, titulo: 'La bisectriz en el isósceles',
    figura: (() => { const { A } = vert(70, 70), F = U.corte([0, 0], U.polar([0, 0], 1, 35), A, [6, 0]);
      return fig(TRI(70, 70, { llaves: LL_AB_AC, angulos: { A: null, B: null, C: null }, masPuntos: [{ id: 'F', x: F[0], y: F[1], rotulo: 'F', lado: 150, sinPunto: true }], masSegmentos: [{ de: 'B', a: 'F' }],
        masAngulos: [{ en: 'B', de: 'C', a: 'F', radio: 32, rayita: 1, mide: 35 }, { en: 'B', de: 'F', a: 'A', radio: 32, rayita: 1, mide: 35 }, { en: 'B', de: 'C', a: 'A', color: 'h', radio: 48, holgura: 6, mide: 70 }, { en: 'F', de: 'C', a: 'B', texto: '?', radio: 18, holgura: 6, mide: 75 }] })); })(),
    enunciado: 'En el triángulo ABC, AB = AC y m∠B = 70°. La bisectriz del ángulo B corta al lado AC en F. ¿Cuánto mide el ángulo BFC?',
    datos: ['Frente a lados iguales hay ángulos iguales.', D_SUMA, D_BIS, D_EXT],
    solucion: [
      { texto: 'C mide lo mismo que B, 70°; queda m∠A = 40°. La bisectriz deja ∠ABF = 35°.' },
      { texto: '∠BFC es exterior del triángulo ABF:', ecuacion: junto(['m∠BFC = 40° + 35° = ', dF('75°')]) },
    ],
    respuesta: ['m∠BFC = ', dF('75°')] });
  EJ5.push({ nivel: 3, titulo: 'Altura, bisectriz y x',
    figura: fig(CEV(80, 30, { angulos: { B: { radio: 14, color: 'h' }, C: t('x + 5°', 'h', { radio: 30, mide: 30 }) }, lineas: { h: {}, b: {} }, masAngulos: [{ en: 'A', de: 'H', a: 'F', color: 'h', radio: 30, holgura: 4, mide: 25 }] })),
    enunciado: 'En el triángulo ABC, m∠B = 3x + 5° y m∠C = x + 5°. El ángulo entre la altura AH y la bisectriz AF mide 25°. ¿Cuánto mide el ángulo BAC?',
    datos: [D_SUMA, D_ALT, D_BIS],
    solucion: [
      { texto: 'En el triángulo ABH, con 90° en H:', ecuacion: junto('m∠BAH = 180° − 90° − (3x + 5°) = 85° − 3x') },
      { texto: 'Lo que dejan B y C para A, y su mitad con la bisectriz:', ecuacion: [junto('m∠A = 170° − 4x'), '   →   ', junto('m∠BAF = 85° − 2x')] },
      { texto: 'El ángulo HAF va de la altura a la bisectriz:', ecuacion: [junto('(85° − 2x) − (85° − 3x) = 25°'), '   →   ', junto('x = 25')] },
      { texto: 'm∠B = 80° y m∠C = 30°:', ecuacion: junto(['m∠BAC = 180° − 80° − 30° = ', dF('70°')]) },
    ],
    respuesta: ['m∠BAC = ', dF('70°')] });
  // Con figura sin escala (lector en frío, ronda 2: sin dibujo no se veía qué ángulo está frente a qué lado; a escala,
  // A se vería recto): B de 35° y C de 75°, así A se dibuja de 70°; AM, BM y MC con la misma rayita.
  EJ5.push({ nivel: 3, titulo: 'La mediana que mide la mitad',
    figura: fig(CEV(35, 75, { sinEscala: true, alt: 'Triángulo ABC, sin escala; AM llega al punto medio M de BC, y AM, BM y MC llevan la misma rayita.',
      angulos: { B: t('35°') }, lineas: { m: {} }, llaves: [{ de: 'A', a: 'M', marcas: 1, ref: 'C' }] })),
    enunciado: 'En el triángulo ABC, AM es la mediana del lado BC y mide lo mismo que BM. Si m∠B = 35°, ¿cuánto mide el ángulo BAC? El dibujo no está a escala.',
    datos: [D_MED, 'Frente a lados iguales hay ángulos iguales.', D_SUMA],
    solucion: [
      { texto: 'M es el punto medio: BM = MC. Con AM = BM, los tres tramos AM, BM y MC miden igual.' },
      { texto: 'En △ABM, AM = BM: ∠BAM mide lo mismo que B. En △AMC, AM = MC: ∠MAC mide lo mismo que C.', ecuacion: junto('m∠BAM = 35°   y   m∠MAC = m∠C') },
      { texto: 'Los tres ángulos de ABC suman 180°, con m∠BAC = 35° + m∠C:', ecuacion: [junto('35° + 35° + 2 · m∠C = 180°'), '   →   ', junto('2 · m∠C = 110°'), '   →   ', junto('m∠C = 55°')] },
      { texto: 'El ángulo A junta las dos partes:', ecuacion: junto(['m∠BAC = 35° + 55° = ', dF('90°')]) },
    ],
    respuesta: ['m∠BAC = ', dF('90°')] });
  EJ5.push({ nivel: 3, titulo: 'Altura fuera, con x',
    figura: fig(CEV(135, 25, { angulos: { B: t('3x', 'h', { mide: 135, radio: 16, holgura: 8 }) }, lineas: { h: {} }, masAngulos: [{ en: 'A', de: 'H', a: 'B', texto: 'x', color: 'h', radio: 40, holgura: 6, mide: 45 }] })),
    enunciado: 'En el triángulo ABC, el ángulo B es obtuso y mide 3x. La altura desde A cae en H, fuera de BC, y m∠BAH = x. ¿Cuánto mide el ángulo B?',
    datos: [D_ALT, D_ADY, D_SUMA_O],
    solucion: [
      { texto: 'En la recta CH, m∠ABH = 180° − 3x. En el triángulo ABH, con 90° en H:', ecuacion: [junto('90° + 180° − 3x + x = 180°'), '   →   ', junto('2x = 90'), '   →   ', junto('x = 45')] },
      { texto: 'Reemplazo:', ecuacion: junto(['m∠B = 3 · 45 = ', dF('135°')]) },
    ],
    respuesta: ['m∠B = ', dF('135°')] });

  // «Ahora tú» de la idea 5: cinco tipos (s % 5).
  const NOMBRES5 = ['ABC', 'PQR', 'RST', 'MNP', 'JKL', 'UVW'];
  const MAL5 = {
    h: 'Sale de un vértice, como una altura; pero la altura lleva el cuadradito de 90° en su pie.',
    m: 'Llega al lado de enfrente, como una mediana; pero la mediana lleva la misma rayita en sus dos mitades.',
    b: 'Sale de un vértice, como una bisectriz; pero la bisectriz lleva dos arcos iguales en ese vértice.',
    z: 'Forma 90°, como una mediatriz; pero la mediatriz nace en el punto medio, no en un vértice.',
  };
  const COD5 = { h: 'GE-LN1', m: 'GE8', b: 'GE-LN2', z: 'GE-LN3' };
  function casoReconocer(r) {
    for (let i = 0; i < 400; i++) {
      const tipo = r.de(['h', 'm', 'b', 'z']), nom = r.de(NOMBRES5), ax = r.de([-1.5, -1, 0.5, 1, 1.5, 2, 4, 4.5, 5, 6.5, 7]), ay = r.de([2.4, 3, 3.6]);
      if (tipo === 'h' && Math.abs(ax - 3) < 0.6) continue;
      if (tipo !== 'h' && (ax < 0 || ax > 6)) continue;
      const letras = { A: nom[0], B: nom[1], C: nom[2], H: null, M: null, F: null };
      const F = { objeto: 'caserio', examen: true, ax, ay, letras, lineas: { [tipo]: tipo === 'z' ? { solida: true } : {} }, vista: { x: [-2.4, 8.2], y: [-1.95, 4.3] } };
      if (!sirve(F)) continue;
      const ops = [{ id: 'c', texto: NOM5[tipo], correcta: true }].concat(['h', 'm', 'b', 'z'].filter(k => k !== tipo).map(k => ({ id: k, texto: NOM5[k], error: COD5[k],
        siFuera: tipo === 'z' && k === 'h' ? 'Forma 90°, como una altura; pero no sale de un vértice: nace en el punto medio.' : tipo === 'h' && k === 'z' ? 'Forma 90°, como una mediatriz; pero sale de un vértice y no llega al punto medio.' : MAL5[k] })));
      return { pregunta: `En el triángulo ${nom}, mira las marcas de la línea que se trazó. ¿Qué línea notable es?`, datos: [D_MARCAS], dibujo: fig(F), opciones: ops,
        solucion: { texto: `Su marca: ${tipo === 'h' ? 'el cuadradito de 90° en su pie' : tipo === 'm' ? 'la misma rayita en las dos mitades del lado' : tipo === 'b' ? 'dos arcos iguales en el vértice' : 'el cuadradito en el punto medio del lado'}.`, ecuacion: [NOM5[tipo]] } };
    }
    throw new Error('casoReconocer');
  }
  function casoDonde(r) {
    for (let i = 0; i < 400; i++) {
      const k = r.ent(0, 2), b = k === 0 ? 5 * r.ent(20, 28) : k === 1 ? 90 : 5 * r.ent(8, 16), c = 5 * r.ent(5, Math.min(16, (175 - b) / 5 - 1));
      if (180 - b - c < 20) continue;
      const F = CEV(b, c, { angulos: { B: b === 90 ? { color: 'h' } : t(`${b}°`, 'h', { radio: 16, holgura: 4 }), C: t(`${c}°`, 'h', { radio: 26 }) } });
      if (!sirve(F)) continue;
      const O = { dentro: 'Dentro del lado BC', fuera: 'Fuera, en la prolongación de CB', enB: 'Justo en B: AB es la altura', medio: 'En el punto medio de BC' };
      const bien = k === 0 ? 'fuera' : k === 1 ? 'enB' : 'dentro';
      const SF = {
        dentro: { error: 'GE7-a', siFuera: 'Dentro caería si B y C fueran agudos; la altura tiene que formar 90° con la recta BC.' },
        fuera: { error: 'GE-LN4', siFuera: 'Fuera caería si B fuera obtuso; aquí la perpendicular llega al lado mismo.' },
        enB: { error: 'GE7-b', siFuera: 'AB sería la altura si B midiera 90°; aquí no mide eso.' },
        medio: { error: 'GE8', siFuera: 'El punto medio es el pie de la mediana; la altura busca el ángulo recto.' },
      };
      const ops = [{ id: 'c', texto: O[bien], correcta: true }].concat(['dentro', 'fuera', 'enB', 'medio'].filter(x => x !== bien).map(x => Object.assign({ id: x, texto: O[x] }, SF[x])));
      return { pregunta: `En el triángulo ABC, m∠B = ${b}° y m∠C = ${c}°. ¿Dónde cae el pie de la altura trazada desde A?`, datos: [D_ALT, D_CLASES], dibujo: fig(F), opciones: ops,
        solucion: { texto: k === 0 ? 'B es obtuso: la perpendicular desde A llega a la recta BC más allá de B.' : k === 1 ? 'B mide 90°: el lado AB ya es perpendicular a BC.' : 'B y C son agudos: la perpendicular cae entre B y C.', ecuacion: junto(`m∠B = ${b}°`) } };
    }
    throw new Error('casoDonde');
  }
  function casoBAH(r) {
    for (let i = 0; i < 400; i++) {
      const obt = r() < 0.4, b = obt ? 5 * r.ent(23, 27) : 5 * r.ent(7, 13), c = 5 * r.ent(5, 10), x = obt ? b - 90 : 90 - b;
      if (180 - b - c < 15) continue;
      const F = CEV(b, c, { angulos: { B: t(`${b}°`, 'h', { radio: 14, holgura: 3 }) }, lineas: { h: {} }, masAngulos: [{ en: 'A', de: obt ? 'H' : 'B', a: obt ? 'B' : 'H', texto: '?', radio: 36, holgura: 5, mide: x }] });
      if (!sirve(F)) continue;
      const ops = opciones(x, [
        { id: 'copia', valor: b, error: 'GE-LN5', siFuera: `${b}° es el ángulo B; ∠BAH es otro ángulo del triángulo ABH.` },
        { id: 'sup', valor: 180 - b, error: 'GE-LN6', siFuera: obt ? `${180 - b}° es ∠ABH; falta restarlo junto con los 90° de H.` : 'Restar de 180° está bien; también hay que quitar los 90° de H.' },
        { id: 'mitad', valor: (180 - b) / 2, error: 'GE-LN7', siFuera: 'Partir en dos sirve con una bisectriz; la altura forma 90° en su pie.' },
      ], gr);
      if (ops.length < 4) continue;
      return { pregunta: `En el triángulo ABC, m∠B = ${b}° y AH es la altura desde A${obt ? ', que cae fuera de BC, más allá de B' : ''}. ¿Cuánto mide el ángulo BAH?`,
        datos: [D_ALT, D_ADY, D_SUMA_O], dibujo: fig(F), opciones: ops,
        solucion: { texto: obt ? `En la recta, m∠ABH = ${180 - b}°; en ABH, con 90° en H:` : 'En el triángulo ABH, con 90° en H:', ecuacion: junto(obt ? `m∠BAH = 180° − 90° − ${180 - b}° = ${x}°` : `m∠BAH = 180° − 90° − ${b}° = ${x}°`) } };
    }
    throw new Error('casoBAH');
  }
  function casoAFC(r) {
    for (let i = 0; i < 400; i++) {
      const b = 5 * r.ent(11, 16), c = 5 * r.ent(6, 10), a = 180 - b - c;
      if (a < 30 || a % 2 || b < c + 10) continue;
      const x = b + a / 2;
      const F = CEV(b, c, { angulos: { B: t(`${b}°`, 'h', { radio: 16, holgura: 4 }), C: t(`${c}°`, 'h', { radio: 26 }) }, lineas: { b: {} }, masAngulos: [{ en: 'F', de: 'C', a: 'A', texto: '?', radio: 18, holgura: 5, mide: x }] });
      if (!sirve(F)) continue;
      const ops = opciones(x, [
        { id: 'entero', valor: b + a, error: 'GE-LN8', siFuera: 'Usar el exterior de ABF está bien; ahí entra la mitad de A, no el ángulo entero.' },
        { id: 'otro', valor: c + a / 2, error: 'GE-LN9', siFuera: `${c + a / 2}° mide ∠AFB, el del otro lado del pie; piden ∠AFC.` },
        { id: 'recto', valor: 90, error: 'GE-LN10', siFuera: '90° sería si la bisectriz fuera también altura; eso pasa solo si AB = AC.' },
      ], gr);
      if (ops.length < 4) continue;
      return { pregunta: `En el triángulo ABC, m∠B = ${b}°, m∠C = ${c}° y AF es la bisectriz del ángulo A. ¿Cuánto mide el ángulo AFC?`,
        datos: [D_SUMA, D_BIS, D_EXT], dibujo: fig(F), opciones: ops,
        solucion: { texto: `m∠A = ${a}°; la bisectriz deja ${a / 2}°. ∠AFC es exterior de ABF.`, ecuacion: junto(`m∠AFC = ${b}° + ${a / 2}° = ${x}°`) } };
    }
    throw new Error('casoAFC');
  }
  function casoHAF(r) {
    for (let i = 0; i < 400; i++) {
      const b = 5 * r.ent(16, 17), c = 5 * r.ent(4, 7), a = 180 - b - c;
      if (b - c < 50 || (b - c) % 10 || a < 20) continue;
      const x = (b - c) / 2;
      const F = CEV(b, c, { angulos: { B: { radio: 14, color: 'h' }, C: t(`${c}°`, 'h', { radio: 26 }) }, lineas: { h: {}, b: {} }, masAngulos: [{ en: 'A', de: 'H', a: 'F', texto: '?', radio: 30, holgura: 4, mide: x }] });
      if (!sirve(F)) continue;
      const ops = opciones(x, [
        { id: 'sin', valor: b - c, error: 'GE-LN11', siFuera: 'Restar B y C es el camino; el resultado todavía se parte entre dos.' },
        { id: 'prom', valor: (b + c) / 2, error: 'GE-LN12', siFuera: 'Partir entre dos está bien; pero lo que se parte es la diferencia de B y C.' },
        { id: 'bah', valor: 90 - b, error: 'GE-LN13', siFuera: `${90 - b}° mide ∠BAH; falta compararlo con la mitad de A.` },
      ], gr);
      if (ops.length < 4) continue;
      return { pregunta: `En el triángulo ABC, m∠B = ${b}° y m∠C = ${c}°. AH es la altura y AF la bisectriz del ángulo A. ¿Cuánto mide el ángulo HAF?`,
        datos: [D_SUMA, D_ALT, D_BIS], dibujo: fig(F), opciones: ops,
        solucion: { texto: `∠BAF = ${a / 2}° y ∠BAH = ${90 - b}°; HAF es lo que va de uno al otro.`, ecuacion: junto(`m∠HAF = ${a / 2}° − ${90 - b}° = ${x}°`) } };
    }
    throw new Error('casoHAF');
  }

  const lineas = {
    id: 'lineas-notables',
    titulo: 'Líneas notables',
    pregunta: '¿Cómo se distingue la altura de la mediana y la bisectriz?',
    temas: ['Líneas notables'],
    pieza: GO,
    aprendizaje: 'Cada línea notable se reconoce por su condición: la altura es perpendicular y puede caer fuera; mediana, bisectriz y altura coinciden solo en el isósceles.',
    actividad: 'Mover un caserío junto a la carretera y seguir dónde llegan sus tres caminos.',
    // Lee: los caminos y sus nombres, las marcas y la mediatriz. No dice dónde cae la altura con un ángulo obtuso (la
    // predicción) ni cuándo coinciden las tres (el juego).
    lee: {
      tarjetas: [
        { titulo: 'El caserío y la carretera', texto: 'El caserío A queda a un lado de una carretera recta con dos paraderos, B y C. Del caserío salen caminos rectos hasta la carretera. Donde cada camino llega a la carretera está su pie.',
          pieza: GO, dibujo: fig({ objeto: 'caserio', ax: 1.5, ay: AY5 }) },
        { titulo: 'Tres caminos con nombre', texto: 'La altura llega a la carretera formando 90°: es perpendicular a ella. La mediana llega al punto medio del tramo BC. La bisectriz parte el ángulo en A en dos ángulos iguales.',
          pieza: GO, dibujo: fig(figJ5(1.5)) },
        { titulo: 'Las marcas y la mediatriz', texto: 'Un cuadradito marca 90°; la misma rayita sobre dos llaves, dos tramos iguales; dos arcos iguales, dos ángulos iguales. La mediatriz de BC es la recta perpendicular a BC por su punto medio: no sale de A.',
          pieza: GO, dibujo: fig({ objeto: 'caserio', ax: 1.5, ay: AY5, lineas: { z: {} } }) },
        { titulo: 'Qué mirar al jugar', texto: 'Mueve el caserío a lo largo de su camino de arriba. Sigue los tres pies sobre la carretera y busca cuándo se juntan.' },
      ],
    },
    ejemplos: EJ5,
    juega: {
      pieza: GO,
      consigna: 'Del caserío A salen tres caminos rectos a la carretera; los paraderos B y C están a 6 km uno del otro.',
      mision: { texto: 'Mueve el caserío hasta que la altura y la mediana sean un solo camino.', logrado: v => v.ax === 3, bien: 'Un solo camino cuando AB = AC; la bisectriz también coincide.' },
      voz: 'Mueve el caserío. ¿Cuándo se juntan los tres caminos?',
      leyenda: [
        { s: dO('altura'), t: 'llega a la carretera formando 90°, en H' },
        { s: dI('mediana'), t: 'llega al punto medio M de BC' },
        { s: dH('bisectriz'), t: 'parte el ángulo A; su pie es F' },
        { s: 'B, C', t: 'los paraderos, a 6 km uno del otro' },
      ],
      controles: [{ id: 'ax', etiqueta: 'el caserío, a lo largo (km desde B)', min: 1, max: 5, paso: 0.5, inicio: 1, unidad: 'km', decimales: 1, color: 'c-o' }],
      dibujo: v => ({ datos: figJ5(v.ax), estado: {} }),
      // Gesto directo: se agarra el caserío, que corre en paralelo a la carretera.
      arrastres: [{ id: 'caserio-a', etiqueta: 'el caserío A: se mueve en paralelo a la carretera', color: 'c-o',
        donde: v => PO.aPantalla(figJ5(v.ax), [v.ax, AY5]),
        mover: (pt, v) => ({ ax: PO.aPlano(figJ5(v.ax), pt)[0] }) }],
      lectura: v => (Math.abs(v.ax - 3) < 1e-9 ? [junto('H, M y F en el mismo punto: AB = AC')] : [junto(`H a ${f(Math.abs(v.ax - 3))} km de M; F queda entre los dos`)]),
      minimo: 4,
    },
    predice: {
      pregunta: 'Otro caserío queda más allá del paradero B, a un lado de la carretera, y el ángulo en B queda obtuso. ¿Dónde llega la altura trazada desde A?',
      datos: ['La altura va de A a la recta BC y forma 90° con ella.', 'm∠B = 120°'],
      voz: 'Recuerda qué pide una altura. Luego decide.',
      opciones: [
        { id: 'c', texto: 'Fuera del tramo BC, en la carretera más allá de B', correcta: true },
        { id: 'medio', texto: 'Al punto medio del tramo BC', error: 'GE8', siFuera: 'El punto medio es el pie de la mediana; la altura busca el ángulo recto.' },
        { id: 'dentro', texto: 'Dentro del tramo BC, aunque quede inclinada', error: 'GE7-a', siFuera: 'Dentro caería si B y C fueran agudos; la altura tiene que formar 90° con la carretera.' },
        { id: 'en-b', texto: 'Justo en B: el camino AB es la altura', error: 'GE7-b', siFuera: 'AB sería la altura si B midiera 90°; aquí B pasa de 90°.' },
      ],
      dibujo: fig({ objeto: 'caserio', ax: -3.6 / Math.tan(60 * RAD), ay: 3.6, angulos: { B: t('120°', 'h', { radio: 14 }) } }),
      revelar: fig({ objeto: 'caserio', ax: -3.6 / Math.tan(60 * RAD), ay: 3.6, angulos: { B: t('120°', 'h', { radio: 14 }) }, lineas: { h: { color: 'o' } } }),
      coincide: 'Coincide: la altura llega a la carretera formando 90°, pero fuera del tramo BC, más allá de B.',
      noCoincide: 'Revisemos: para formar 90° con la carretera, el camino tiene que llegar más allá de B, fuera del tramo.',
    },
    mira: {
      pieza: GO,
      datos: { objeto: 'caserio', ax: 1.5, ay: AY5, lineas: { h: { color: 'o', desde: 1 }, m: { color: 'i', desde: 2 }, b: { color: 'h', desde: 3 }, z: { desde: 4 } } },
      voz: 'Una línea por paso. Cada una tiene su marca.',
      pasos: [
        { estado: { corte: 1 }, texto: 'Altura: el camino que forma 90° con la carretera. Llega a H.', ecuacion: junto([dO('AH'), ' ⟂ BC']) },
        { estado: { corte: 2 }, texto: 'Mediana: llega al punto medio M del tramo BC.', ecuacion: junto('BM = MC = 3 km') },
        { estado: { corte: 3 }, texto: 'Bisectriz: parte el ángulo en A en dos iguales. Llega a F.', ecuacion: junto([dH('m∠BAF'), ' = ', dH('m∠FAC')]) },
        { estado: { corte: 4 }, texto: 'Mediatriz: perpendicular a BC en M. No sale del caserío.', ecuacion: junto('mediatriz ⟂ BC, por M') },
        { estado: { corte: 4 }, texto: 'Las tres de A llegan a puntos distintos: H, F y M.', ecuacion: junto('AB ≠ AC') },
      ],
    },
    regla: {
      texto: 'La altura forma 90° con la recta del lado opuesto y puede caer fuera. La mediana llega al punto medio; la bisectriz parte el ángulo. Coinciden solo en el isósceles.',
      ecuacion: [junto([dO('AH'), ' ⟂ BC']), SEP, junto([dI('BM'), ' = ', dI('MC')]), SEP, junto([dH('m∠BAF'), ' = ', dH('m∠FAC')])],
      condicion: 'coinciden solo si AB = AC. La mediatriz, perpendicular a BC por su punto medio M, no sale de un vértice.',
      voz: 'Reconoce cada línea por su marca: cuadradito, rayitas o arcos iguales.',
      // Dibujo propio (docs/teoria.md 4i): el caserío a la misma distancia de B y de C (AB = AC, dos rayitas): la altura,
      // la mediana y la bisectriz son un solo camino, con las tres marcas, y sus pies se juntan (H = M = F).
      dibujo: { pieza: GO, datos: { objeto: 'caserio', ax: 3, ay: AY5, lineas: LIN5, llaves: [{ de: 'A', a: 'B', marcas: 2 }, { de: 'A', a: 'C', marcas: 2 }] }, estado: {} },
    },
    // Así se resuelve: la bisectriz con x y la mediana con x. «Ahora tú» pide reconocer la línea, dónde cae la altura,
    // ∠BAH, ∠AFC y el ángulo entre la altura y la bisectriz.
    resuelve: {
      pieza: GO,
      generar(s) {
        const r = azar(s + 900);
        if (s % 2 === 0) {
          for (;;) {
            const x = r.ent(8, 20), p = r.ent(2, 4), q = p + r.ent(1, 2), k = 5 * r.ent(1, 6), half = p * x + k, m = q * x - half;
            if (half < 15 || half > 65 || m <= 0 || m % 5) continue;
            const A = 2 * half, b = 5 * r.ent(6, Math.min(16, (175 - A) / 5)), c = 180 - A - b;
            if (c < 20) continue;
            const F = CEV(b, c, { lineas: { b: {} } });
            return {
              enunciado: `En el triángulo ABC, AF es la bisectriz del ángulo A. m∠BAF = ${exp(p, k)} y m∠FAC = ${exp(q, -m)}. ¿Cuánto mide el ángulo BAC?`,
              datos: [D_BIS], dibujo: fig(F),
              pasos: [
                { tipo: 'pide', texto: 'Piden el ángulo A entero, el que la bisectriz parte en dos.' },
                { tipo: 'datos', texto: 'Tengo las dos mitades escritas con x.' },
                { tipo: 'regla', texto: 'La bisectriz deja dos ángulos iguales: igualo las dos mitades.', ecuacion: junto(`${exp(p, k)} = ${exp(q, -m)}`) },
                { tipo: 'cuentas', texto: `Despejo x; cada mitad mide ${half}°.`, ecuacion: [junto(`x = ${x}`), Y, junto(['m∠BAC = 2 · ', `${half}° = `, dF(`${A}°`)])] },
                { tipo: 'sentido', texto: `Compruebo: ${q} · ${x} − ${m}° = ${half}°, igual que la otra mitad.` },
              ],
              respuesta: ['m∠BAC = ', dF(`${A}°`)],
            };
          }
        }
        for (;;) {
          const x = r.ent(3, 12), p = r.ent(2, 4), q = r.ent(1, p - 1), k = r.ent(1, 6), half = p * x - k, m = half - q * x;
          if (half < 6 || m < 1) continue;
          const F = CEV(60, 50, { lineas: { m: {} }, ladosRot: [{ de: 'B', a: 'M', texto: `${p}x − ${k}`, ref: 'A', dist: 48 }, { de: 'M', a: 'C', texto: `${q === 1 ? '' : q}x + ${m}`, ref: 'A', dist: 48 }] });
          return {
            enunciado: `En el triángulo ABC, AM es la mediana del lado BC. BM = (${p}x − ${k}) cm y MC = (${q === 1 ? '' : q}x + ${m}) cm. ¿Cuánto mide BC?`,
            datos: [D_MED], dibujo: fig(F),
            pasos: [
              { tipo: 'pide', texto: 'Piden el lado BC entero, el que la mediana parte por la mitad.' },
              { tipo: 'datos', texto: 'Tengo las dos mitades, BM y MC, escritas con x.' },
              { tipo: 'regla', texto: 'La mediana llega al punto medio: BM = MC.', ecuacion: junto(`${p}x − ${k} = ${q === 1 ? '' : q}x + ${m}`) },
              { tipo: 'cuentas', texto: `Despejo x; cada mitad mide ${half} cm.`, ecuacion: [junto(`x = ${x}`), Y, junto(['BC = 2 · ', `${half} = `, dF(`${2 * half} cm`)])] },
              { tipo: 'sentido', texto: `Compruebo: ${q === 1 ? '' : `${q} · `}${x} + ${m} = ${half}, igual que BM.` },
            ],
            respuesta: ['BC = ', dF(`${2 * half} cm`)],
          };
        }
      },
    },
    ahoraTu: {
      pieza: GO,
      voz: 'Busca la marca: cuadradito, rayitas o arcos iguales.',
      generar(s) { return conCuatro([casoReconocer, casoDonde, casoBAH, casoAFC, casoHAF][s % 5], azar(s + 7)); },
    },
  };

  // ---------- Idea 6 (rehecha, 18 nov): ángulos entre bisectrices ----------
  // Objeto de la primera pantalla: un parque triangular con dos caminos que se cruzan en la pileta (geo-objeto, parque;
  // dibujo de prueba). I y E son cruces de caminos; sus nombres: incentro (Proporcionalidad y semejanza, que lo define en el
  // glosario) y excentro (Puntos notables).
  // Cambia: la esquina A (los ángulos en B y C, de 10° en 10°). · Permanece: la base BC. · Progresa: m∠BIC, que solo
  // sigue a m∠A. · Se reserva: el camino que parte el ángulo exterior en C (la predicción). · Debe verse: con el mismo
  // m∠A, el mismo m∠BIC, aunque B y C se repartan distinto.
  // Colores: m∠A y las bisectrices interiores de B y C, con sus mitades (una rayita en B, dos en C), en carmín; el
  // exterior en C, su bisectriz y sus mitades (tres rayitas), en turquesa; ∠BIC y ∠BEC en tinta («?» en los ejercicios).
  // Errores (hipótesis, sin medir): GE-BIS4 usa la regla de las dos interiores donde una es exterior (o al revés),
  // GE-BIS5-a toma el ángulo A entero, GE-BIS5-b cree que dos bisectrices de C dan 90° en E (propuesta); nuevos (18 nov):
  // GE-BIS6 suma 90° sin partir A, GE-BIS7 usa la regla de dos exteriores, GE-BIS8 no divide en la de dos exteriores,
  // GE-BIS9 se queda en lo que suman las mitades de B y C, GE-BIS10 usa B y C en vez de A, GE-BIS11 olvida duplicar en el
  // inverso, GE-BIS12 da el suplemento en el inverso, GE-BIS13 divide en vez de duplicar.
  const VJ6 = { x: [-0.9, 6.9], y: [-1.15, 8.75] };
  // En el juego, m∠A y m∠BIC se leen en la lectura, debajo: con A de 80°, su rótulo bajaba hasta la pileta.
  const figJ6 = (b, c) => ({ objeto: 'parque', b, c, angulos: { A: {} }, BIC: {}, vista: VJ6, alto: 270, manija: 'A' });
  const D_BIS2 = 'Cada bisectriz parte su ángulo en dos ángulos iguales.';
  // Con paréntesis: «90° − m∠A ÷ 2» se leía como (90° − m∠A) ÷ 2 (lector en frío, tarjeta 16). Iguales en el generador.
  const D_BIC = 'I es el cruce de las bisectrices interiores de B y de C: m∠BIC = 90° + (m∠A ÷ 2).';
  const D_BEC = 'E es el cruce de la bisectriz interior de B con la exterior de C: m∠BEC = m∠A ÷ 2.';
  const D_BQC = 'Q es el cruce de las bisectrices exteriores de B y de C: m∠BQC = 90° − (m∠A ÷ 2).';
  const PQ = (b, c, o = {}) => Object.assign({ objeto: 'parque', examen: true, b, c }, o);
  // Con B y C dados y sus bisectrices trazadas, la figura marca sus mitades (una rayita en B, dos en C) y los valores van
  // en el enunciado: el rótulo del ángulo entero cae sobre su propia bisectriz (como las expresiones de la mariposa).
  const enteros = () => [];
  // Dos bisectrices exteriores, de B y de C, que se cortan en Q, debajo de BC (figura de examen).
  function exteriores2(b, c, rot = {}) {
    const { A } = vert(b, c), B = [0, 0], C = [6, 0], Q = U.corte(B, U.polar(B, 1, b / 2 - 90), C, U.polar(C, 1, -90 - c / 2));
    const F = U.polar(B, 2.2, 180 + b), Gp = U.polar(C, 2.2, -c);
    const pts = { A, B, C, Q, F, G: Gp }, lab = { A: 90, B: 180, C: 0, Q: -90 };
    const xs = Object.values(pts).map(p => p[0]), ys = Object.values(pts).map(p => p[1]);
    return { objeto: 'angulos', figura: PO.acomodarLetras({ alt: 'Triángulo ABC; las bisectrices de los ángulos exteriores en B y en C se cortan en Q, debajo de BC.',
      vista: { x: [Math.min(...xs) - 0.8, Math.max(...xs) + 0.8], y: [Math.min(...ys) - 0.8, Math.max(...ys) + 0.8] }, alto: 262,
      puntos: Object.entries(pts).map(([id, p]) => Object.assign({ id, x: p[0], y: p[1], sinPunto: true }, lab[id] !== undefined ? { rotulo: id, lado: lab[id] } : {})),
      segmentos: [{ de: 'A', a: 'B' }, { de: 'B', a: 'C' }, { de: 'C', a: 'A' }, { de: 'B', a: 'F', discontinua: true, grosor: 'fino' }, { de: 'C', a: 'G', discontinua: true, grosor: 'fino' }, { de: 'B', a: 'Q', color: 'i' }, { de: 'C', a: 'Q', color: 'i' }],
      // rot.A: null, sin el arco de A; rot.B y rot.C: los interiores de B y de C, si el ejercicio los da.
      angulos: [...(rot.A === null ? [] : [Object.assign({ en: 'A', de: 'B', a: 'C', radio: 20, holgura: 6, mide: 180 - b - c }, rot.A || { color: 'h' })]),
        // Interiores a radio 14 y mitades de los exteriores a 30 y 32: a 18 y 26/22 se encimaban (lector en frío, ronda 2).
        ...(rot.B ? [Object.assign({ en: 'B', de: 'C', a: 'A', radio: 14, holgura: 6, mide: b, marcas: 2 }, rot.B)] : []),
        ...(rot.C ? [Object.assign({ en: 'C', de: 'A', a: 'B', radio: 14, holgura: 6, mide: c, marcas: 3 }, rot.C)] : []),
        { en: 'B', de: 'C', a: 'Q', radio: 30, rayita: 1, color: 'i', mide: 90 - b / 2 }, { en: 'B', de: 'Q', a: 'F', radio: 30, rayita: 1, color: 'i', mide: 90 - b / 2 },
        { en: 'C', de: 'G', a: 'Q', radio: 32, rayita: 2, color: 'i', mide: 90 - c / 2 }, { en: 'C', de: 'Q', a: 'B', radio: 32, rayita: 2, color: 'i', mide: 90 - c / 2 },
        Object.assign({ en: 'Q', de: 'B', a: 'C', radio: 20, holgura: 6, mide: (b + c) / 2 }, rot.Q || {})] }, ['A', 'B', 'C', 'Q']) };
  }

  // Ejemplos resueltos de «Ángulos entre bisectrices». Cuentas rehechas aparte (scratchpad f3-geo/cuentas.js): 90 + 25 =
  // 115; 70 ÷ 2 = 35; 90 − 35 = 55; las dos de C: 90; 64 ÷ 2 = 32; 180 − 40 − 30 = 110; 2(130 − 90) = 80; 2 · 27 = 54;
  // 90 + x = 3x + 30, x = 30; A = 2(135 − 90) = 90; ACD = 130, A = 60, BEC = 30; A = 50, BIC = 115; (90 + A/2) + A/2 =
  // 150, A = 60; exteriores de 110 y 130, mitades 55 y 65, BQC = 60 (= 90 − 30); 4x − 10 = 3x + 20, x = 30, C = 70, BIC =
  // 180 − 30 − 35 = 115 (= 90 + 25). Las nuevas del 18 nov, por coordenadas en scratchpad cor-geo-cuentas/cuentas.js.
  const EJ6 = [];
  // La idea enseña a elegir la regla: los ejercicios que usan una traen las tres (auditoría, M2; Gerson, 18 nov). Los que
  // se resuelven con las mitades y la suma (con B y C, dos de nivel 3) no traen ninguna: ahí se deduce el cruce.
  const R3 = [D_BIC, D_BEC, D_BQC];
  // Las dos bisectrices de C, solas (B4: sin la de B ni E): la interior hasta AB y la exterior, que parte ∠ACD.
  function dosDeC(b, c) {
    const { A } = vert(b, c), B = [0, 0], C = [6, 0], D = [8.6, 0];
    const P = U.corte(C, U.polar(C, 1, 180 - c / 2), A, B), R = U.polar(C, 3.0, 90 - c / 2);
    const figura = PO.acomodarLetras({ alt: 'Triángulo ABC; BC se prolonga hasta D. Desde C salen la bisectriz del ángulo interior en C y la del ángulo exterior ACD.',
      vista: vistaPs([A, B, C, D, R], 0.9), alto: 250,
      puntos: [{ id: 'A', x: A[0], y: A[1], rotulo: 'A', lado: 90, sinPunto: true }, { id: 'B', x: 0, y: 0, rotulo: 'B', lado: 200, sinPunto: true }, { id: 'C', x: 6, y: 0, rotulo: 'C', lado: -90, sinPunto: true },
        { id: 'D', x: D[0], y: 0, rotulo: 'D', lado: -90, sinPunto: true }, { id: 'P', x: P[0], y: P[1], sinPunto: true }, { id: 'R', x: R[0], y: R[1], sinPunto: true }],
      segmentos: [{ de: 'A', a: 'B' }, { de: 'B', a: 'C' }, { de: 'C', a: 'A' }, { de: 'C', a: 'D', discontinua: true, grosor: 'fino' }, { de: 'C', a: 'P', color: 'h' }, { de: 'C', a: 'R', color: 'i' }],
      angulos: [{ en: 'C', de: 'A', a: 'P', radio: 24, rayita: 2, color: 'h', mide: c / 2 }, { en: 'C', de: 'P', a: 'B', radio: 24, rayita: 2, color: 'h', mide: c / 2 },
        { en: 'C', de: 'D', a: 'R', radio: 34, rayita: 3, color: 'i', mide: 90 - c / 2 }, { en: 'C', de: 'R', a: 'A', radio: 34, rayita: 3, color: 'i', mide: 90 - c / 2 },
        { en: 'C', de: 'R', a: 'P', texto: '?', radio: 16, holgura: 6, mide: 90, arcoRecto: true }] }, ['A', 'B', 'C', 'D']);
    return { objeto: 'angulos', figura };
  }
  // El cruce I de las dos interiores, con el exterior en C dado con x (nivel 3, sin las reglas): la plaza de examen.
  function cruceConExterior(b, c, tA, tE) {
    const { A } = vert(b, c), B = [0, 0], C = [6, 0], la = 6, lb = U.dist(A, C), lc = U.dist(A, B), s = la + lb + lc;
    const I = [(la * A[0] + lb * B[0] + lc * C[0]) / s, (la * A[1] + lb * B[1] + lc * C[1]) / s], dirIB = U.grados(Math.atan2(B[1] - I[1], B[0] - I[0]));
    // tA: el rótulo de A, o null (solo su arco, en carmín: su valor va en el enunciado; el rótulo quedaba junto a I).
    return TRI(b, c, { angulos: { A: tA ? t(tA, 'h', { mide: 180 - b - c }) : { color: 'h' }, B: null, C: null }, exteriores: { C: t(tE, 'h', { mide: 180 - c }) },
      masPuntos: [{ id: 'I', x: I[0], y: I[1], rotulo: 'I', lado: dirIB - 62, sinPunto: true }], masSegmentos: [{ de: 'B', a: 'I', color: 'h' }, { de: 'C', a: 'I', color: 'h' }],
      masAngulos: [{ en: 'B', de: 'C', a: 'I', radio: 32, rayita: 1, color: 'h', mide: b / 2 }, { en: 'B', de: 'I', a: 'A', radio: 32, rayita: 1, color: 'h', mide: b / 2 },
        { en: 'C', de: 'I', a: 'B', radio: 24, rayita: 2, color: 'h', mide: c / 2 }, { en: 'C', de: 'A', a: 'I', radio: 24, rayita: 2, color: 'h', mide: c / 2 },
        { en: 'I', de: 'B', a: 'C', texto: '?', radio: 12, holgura: 4, mide: 90 + (180 - b - c) / 2 }],
      alt: 'Triángulo ABC; BC se prolonga hasta D. Las bisectrices interiores de B y de C se cortan en I.' });
  }
  // Nivel 1: un paso (elegir la regla y reemplazar, o una sola bisectriz).
  EJ6.push({ nivel: 1, titulo: 'La pileta del parque',
    figura: fig({ objeto: 'parque', b: 70, c: 60, angulos: { A: t('50°') }, BIC: pide() }),
    enunciado: 'En un parque triangular ABC, m∠A = 50°. Los caminos que parten las esquinas B y C en mitades iguales se cruzan en la pileta I. ¿Cuánto mide el ángulo BIC?',
    datos: R3,
    solucion: [{ texto: 'Las dos son bisectrices interiores: 90° más la mitad de A.', ecuacion: junto(['m∠BIC = 90° + (50° ÷ 2) = ', dF('115°')]) }],
    respuesta: ['m∠BIC = ', dF('115°')] });
  EJ6.push({ nivel: 1, titulo: 'Una interior y una exterior',
    figura: fig(PQ(60, 50, { I: false, E: 0, mitades: { B: true, Ce: true }, angulos: { A: t('70°') }, BEC: pide() })),
    enunciado: 'En el triángulo ABC, m∠A = 70°. La bisectriz interior de B y la bisectriz exterior de C se cortan en E. ¿Cuánto mide el ángulo BEC?',
    datos: R3,
    solucion: [{ texto: 'Interior con exterior: la mitad de A.', ecuacion: junto(['m∠BEC = 70° ÷ 2 = ', dF('35°')]) }],
    respuesta: ['m∠BEC = ', dF('35°')] });
  EJ6.push({ nivel: 1, titulo: 'Dos exteriores',
    figura: fig(exteriores2(55, 55, { A: t('70°'), Q: pide() })),
    enunciado: 'En el triángulo ABC, m∠A = 70°. Las bisectrices de los ángulos exteriores en B y en C se cortan en Q. ¿Cuánto mide el ángulo BQC?',
    datos: R3,
    solucion: [{ texto: 'Dos exteriores: 90° menos la mitad de A.', ecuacion: junto(['m∠BQC = 90° − (70° ÷ 2) = ', dF('55°')]) }],
    respuesta: ['m∠BQC = ', dF('55°')] });
  EJ6.push({ nivel: 1, titulo: 'Las dos bisectrices de C',
    figura: fig(dosDeC(70, 50)),
    enunciado: 'En C, la bisectriz interior parte el ángulo ACB y la exterior parte el ángulo ACD. ¿Qué ángulo forman entre ellas?',
    datos: [D_BIS2, D_ADY],
    solucion: [
      { texto: 'El interior y el exterior en C suman 180°; cada bisectriz toma la mitad del suyo.', ecuacion: junto(['(m∠ACB + m∠ACD) ÷ 2 = 180° ÷ 2 = ', dF('90°')]) },
    ],
    respuesta: ['Forman ', dF('90°')] });
  EJ6.push({ nivel: 1, titulo: 'La mitad de una esquina',
    figura: fig({ objeto: 'parque', b: 64, c: 56, angulos: { A: null, B: t('64°', 'h', { radio: 46 }) }, mitades: { B: true }, BIC: undefined,
      masAngulos: [] }),
    enunciado: 'En el parque, la esquina B mide 64° y el camino que sale de B la parte en dos ángulos iguales. ¿Cuánto mide el ángulo IBC?',
    datos: [D_BIS2],
    solucion: [{ texto: 'El camino es la bisectriz de B: deja dos mitades iguales.', ecuacion: junto(['m∠IBC = 64° ÷ 2 = ', dF('32°')]) }],
    respuesta: ['m∠IBC = ', dF('32°')] });
  // Nivel 2: dos pasos (las mitades y la suma, o la regla al revés).
  EJ6.push({ nivel: 2, titulo: 'Con B y C',
    figura: fig(PQ(80, 60, { angulos: {}, BIC: pide(), masAngulos: enteros(80, 60) })),
    enunciado: 'En el triángulo ABC, m∠B = 80° y m∠C = 60°. Las bisectrices interiores de B y C se cortan en I. ¿Cuánto mide el ángulo BIC?',
    datos: [D_BIS2, D_SUMA_O],
    solucion: [
      { texto: 'En el triángulo BIC quedan las mitades: 40° en B y 30° en C.' },
      { texto: 'Lo que falta para 180°:', ecuacion: junto(['m∠BIC = 180° − 40° − 30° = ', dF('110°')]) },
    ],
    respuesta: ['m∠BIC = ', dF('110°')] });
  EJ6.push({ nivel: 2, titulo: 'Del cruce al ángulo A',
    figura: fig(PQ(55, 45, { angulos: { A: pide() }, BIC: t('130°') })),
    enunciado: 'En el triángulo ABC, las bisectrices interiores de B y C se cortan en I y m∠BIC = 130°. ¿Cuánto mide el ángulo A?',
    datos: R3,
    solucion: [
      { texto: 'Uso la regla de dos interiores al revés: lo que pasa de 90° es la mitad de A.', ecuacion: junto('130° = 90° + (m∠A ÷ 2)   →   m∠A ÷ 2 = 40°') },
      { texto: 'El ángulo entero:', ecuacion: junto(['m∠A = 2 · 40° = ', dF('80°')]) },
    ],
    respuesta: ['m∠A = ', dF('80°')] });
  EJ6.push({ nivel: 2, titulo: 'De E al ángulo A',
    figura: fig(PQ(66, 60, { I: false, E: 0, mitades: { B: true, Ce: true }, angulos: { A: pide() }, BEC: { color: 'h' } })),
    enunciado: 'En el triángulo ABC, la bisectriz interior de B y la exterior de C se cortan en E, con m∠BEC = 27°. ¿Cuánto mide el ángulo A?',
    datos: R3,
    solucion: [
      { texto: 'Una interior y una exterior: el ángulo en E es la mitad de A.', ecuacion: junto('27° = m∠A ÷ 2') },
      { texto: 'A es el doble:', ecuacion: junto(['m∠A = 2 · 27° = ', dF('54°')]) },
    ],
    respuesta: ['m∠A = ', dF('54°')] });
  EJ6.push({ nivel: 2, titulo: 'El cruce con x',
    figura: fig(PQ(65, 55, { angulos: { A: t('2x', 'h', { mide: 60 }) }, BIC: t('3x + 30°', 'h', { mide: 120 }) })),
    enunciado: 'En el triángulo ABC, m∠A = 2x. Las bisectrices interiores de B y C se cortan en I, y m∠BIC = 3x + 30°. ¿Cuánto vale x?',
    datos: R3,
    solucion: [
      { texto: 'Dos interiores: 90° más la mitad de A, que es x. Igualo:', ecuacion: [junto('90° + x = 3x + 30°'), '   →   ', junto('2x = 60'), '   →   ', junto(['x = ', dF('30')])] },
      { texto: 'Compruebo: m∠A = 60° y m∠BIC = 120° = 90° + 30°.' },
    ],
    respuesta: ['x = ', dF('30')] });
  // Sin figura: a escala, el ángulo A se vería recto (auditoría, M5; lector en frío, tarjeta 18). Pasa del nivel 3 al 2 (M2).
  EJ6.push({ nivel: 2, titulo: 'El cruce y la clase',
    enunciado: 'En el triángulo ABC, las bisectrices interiores de B y C se cortan en I, y m∠BIC = 135°. ¿Qué clase de triángulo es ABC, por sus ángulos?',
    datos: [...R3, D_CLASES],
    solucion: [
      { texto: 'La regla de dos interiores, al revés:', ecuacion: [junto('135° = 90° + (m∠A ÷ 2)'), '   →   ', junto('m∠A ÷ 2 = 45°'), '   →   ', junto('m∠A = 90°')] },
      { texto: 'Tiene un ángulo recto.' },
    ],
    respuesta: ['Es ', dF('rectángulo')] });
  // Nivel 3: tipo examen. Dos de ellos sin las reglas: el cruce se deduce con las mitades y la suma (M2).
  EJ6.push({ nivel: 3, titulo: 'Un exterior y su bisectriz',
    figura: fig(PQ(70, 50, { I: false, E: 0, mitades: { B: true, Ce: true }, angulos: { A: null, B: t('70°', 'h', { radio: 46 }) }, BEC: pide(), masAngulos: [{ en: 'C', de: 'D', a: 'A', texto: '130°', color: 'h', radio: 44, holgura: 6, mide: 130, centro: true }] })),
    enunciado: 'En el triángulo ABC, m∠B = 70° y el ángulo exterior ACD mide 130°. La bisectriz interior de B y la exterior de C se cortan en E. ¿Cuánto mide ∠BEC?',
    datos: [D_EXT, ...R3],
    solucion: [
      { texto: 'El exterior en C suma A y B:', ecuacion: junto('130° = m∠A + 70°   →   m∠A = 60°') },
      { texto: 'Interior con exterior: en E, la mitad de A.', ecuacion: junto(['m∠BEC = 60° ÷ 2 = ', dF('30°')]) },
    ],
    respuesta: ['m∠BEC = ', dF('30°')] });
  EJ6.push({ nivel: 3, titulo: 'Isósceles con su pileta',
    figura: fig(PQ(65, 65, { llaves: LL_AB_AC, angulos: { A: null, B: { marcas: 2, color: 'h' } }, BIC: pide() })),
    enunciado: 'En el triángulo ABC, AB = AC y m∠B = 65°. Las bisectrices interiores de B y C se cortan en I. ¿Cuánto mide el ángulo BIC?',
    datos: ['Frente a lados iguales hay ángulos iguales.', D_SUMA, ...R3],
    solucion: [
      { texto: 'C mide lo mismo que B, 65°; queda m∠A = 180° − 130° = 50°.' },
      { texto: 'Dos interiores:', ecuacion: junto(['m∠BIC = 90° + (50° ÷ 2) = ', dF('115°')]) },
    ],
    respuesta: ['m∠BIC = ', dF('115°')] });
  EJ6.push({ nivel: 3, titulo: 'La suma de dos cruces',
    figura: fig(PQ(70, 50, { E: 0, mitades: { B: true }, angulos: { A: pide() }, BIC: {}, BEC: {} })),
    enunciado: 'En el triángulo ABC, I es el cruce de las bisectrices interiores de B y C, y E el de la interior de B con la exterior de C. Si m∠BIC + m∠BEC = 150°, ¿cuánto mide el ángulo A?',
    datos: R3,
    solucion: [
      { texto: 'Escribo los dos con A y sumo:', ecuacion: [junto('90° + (m∠A ÷ 2) + (m∠A ÷ 2) = 150°'), '   →   ', junto('m∠A = 60°')] },
      { texto: 'Compruebo: 120° + 30° = 150°.' },
    ],
    respuesta: ['m∠A = ', dF('60°')] });
  EJ6.push({ nivel: 3, titulo: 'Dos exteriores, sin la regla',
    figura: fig(exteriores2(70, 50, { A: null, B: { color: 'h' }, C: { color: 'h' }, Q: pide() })),
    enunciado: 'En el triángulo ABC, m∠B = 70° y m∠C = 50°. Las bisectrices de los ángulos exteriores en B y en C se cortan en Q. ¿Cuánto mide el ángulo BQC?',
    datos: [D_ADY, D_BIS2, D_SUMA_O],
    solucion: [
      { texto: 'Los exteriores miden 180° − 70° = 110° en B y 180° − 50° = 130° en C. Cada bisectriz toma la mitad:', ecuacion: junto('m∠QBC = 55°   y   m∠QCB = 65°') },
      { texto: 'En el triángulo BQC:', ecuacion: junto(['m∠BQC = 180° − 55° − 65° = ', dF('60°')]) },
      { texto: 'Compruebo con la regla: m∠A = 60° y 90° − (60° ÷ 2) = 60°.' },
    ],
    respuesta: ['m∠BQC = ', dF('60°')] });
  EJ6.push({ nivel: 3, titulo: 'El cruce, con exterior y x',
    figura: fig(cruceConExterior(60, 70, null, '4x − 10°')),
    enunciado: 'En el triángulo ABC, m∠A = x + 20°, m∠B = 2x y el ángulo exterior ACD mide 4x − 10°. Las bisectrices interiores de B y C se cortan en I. ¿Cuánto mide el ángulo BIC?',
    datos: [D_EXT, D_ADY, D_BIS2, D_SUMA_O],
    solucion: [
      { texto: 'El exterior en C suma A y B:', ecuacion: [junto('4x − 10° = x + 20° + 2x'), '   →   ', junto('x = 30')] },
      { texto: 'm∠B = 60° y el exterior mide 110°; el interior en C es su vecino en la recta:', ecuacion: junto('m∠C = 180° − 110° = 70°') },
      { texto: 'En el triángulo BIC quedan las mitades, 30° y 35°:', ecuacion: junto(['m∠BIC = 180° − 30° − 35° = ', dF('115°')]) },
    ],
    respuesta: ['m∠BIC = ', dF('115°')] });

  // «Ahora tú» de la idea 6: cinco tipos (s % 5).
  function bc6(r, a) { for (;;) { const b = 10 * r.ent(3, 10); const c = 180 - a - b; if (c >= 30 && c <= 100 && b <= 100) return [b, c]; } }
  function casoBIC(r) {
    for (let i = 0; i < 400; i++) {
      const a = 10 * r.ent(3, 10), [b, c] = bc6(r, a), F = PQ(b, c, { angulos: { A: t(`${a}°`) }, BIC: pide() });
      if (!sirve(F)) continue;
      return { pregunta: `En el triángulo ABC, m∠A = ${a}°. Las bisectrices interiores de B y C se cortan en I. ¿Cuánto mide el ángulo BIC?`, datos: R3, dibujo: fig(F),
        opciones: opciones(90 + a / 2, [
          { id: 'cambio', valor: a / 2, error: 'GE-BIS4', siFuera: 'La mitad de A vale con una bisectriz exterior; aquí las dos son interiores.' },
          { id: 'entero', valor: 90 + a, error: 'GE-BIS6', siFuera: 'Sumar 90° está bien; cada bisectriz deja solo la mitad: va la mitad de A.' },
          { id: 'menos', valor: 90 - a / 2, error: 'GE-BIS7', siFuera: '90° menos la mitad de A vale con dos bisectrices exteriores.' },
        ], gr),
        solucion: { texto: 'Dos interiores: 90° más la mitad de A.', ecuacion: junto(`m∠BIC = 90° + (${a}° ÷ 2) = ${90 + a / 2}°`) } };
    }
    throw new Error('casoBIC');
  }
  function casoBEC(r) {
    for (let i = 0; i < 400; i++) {
      const a = 10 * r.ent(3, 9), [b, c] = bc6(r, a), F = PQ(b, c, { I: false, E: 0, mitades: { B: true, Ce: true }, angulos: { A: t(`${a}°`) }, BEC: pide() });
      if (!sirve(F)) continue;
      return { pregunta: `En el triángulo ABC, m∠A = ${a}°. La bisectriz interior de B y la exterior de C se cortan en E. ¿Cuánto mide el ángulo BEC?`, datos: R3, dibujo: fig(F),
        opciones: opciones(a / 2, [
          { id: 'cambio', valor: 90 + a / 2, error: 'GE-BIS4', siFuera: 'Esa regla vale con dos bisectrices interiores; aquí la de C es exterior.' },
          { id: 'entero', valor: a, error: 'GE-BIS5-a', siFuera: `${a}° sería si E viera el ángulo A completo; recibe solo su mitad.` },
          { id: 'recto', valor: 90, error: 'GE-BIS5-b', siFuera: 'Las dos bisectrices de C sí forman 90° entre ellas; el ángulo en E es otro.' },
        ], gr),
        solucion: { texto: 'Interior con exterior: la mitad de A.', ecuacion: junto(`m∠BEC = ${a}° ÷ 2 = ${a / 2}°`) } };
    }
    throw new Error('casoBEC');
  }
  function casoBQC(r) {
    for (let i = 0; i < 400; i++) {
      const a = 10 * r.ent(3, 9), [b, c] = bc6(r, a), F = exteriores2(b, c, { A: t(`${a}°`), Q: pide() });
      if (!sirve(F)) continue;
      return { pregunta: `En el triángulo ABC, m∠A = ${a}°. Las bisectrices de los ángulos exteriores en B y en C se cortan en Q. ¿Cuánto mide el ángulo BQC?`, datos: R3, dibujo: fig(F),
        opciones: opciones(90 - a / 2, [
          { id: 'cambio', valor: 90 + a / 2, error: 'GE-BIS7', siFuera: '90° más la mitad de A vale con dos bisectrices interiores; aquí son exteriores.' },
          { id: 'mitad', valor: a / 2, error: 'GE-BIS4', siFuera: 'La mitad de A vale con una interior y una exterior; aquí las dos son exteriores.' },
          { id: 'sin', valor: 180 - a, error: 'GE-BIS8', siFuera: 'Restar de 180° es parecido; pero la regla es 90° menos la mitad de A.' },
        ], gr),
        solucion: { texto: 'Dos exteriores: 90° menos la mitad de A.', ecuacion: junto(`m∠BQC = 90° − (${a}° ÷ 2) = ${90 - a / 2}°`) } };
    }
    throw new Error('casoBQC');
  }
  function casoBICbc(r) {
    for (let i = 0; i < 400; i++) {
      const b = 10 * r.ent(5, 8), c = 10 * r.ent(5, 8);
      if (b + c > 150 || b === c) continue;
      const x = 180 - (b + c) / 2, F = PQ(b, c, { angulos: {}, BIC: pide(), masAngulos: enteros(b, c) });
      if (!sirve(F)) continue;
      return { pregunta: `En el triángulo ABC, m∠B = ${b}° y m∠C = ${c}°. Las bisectrices interiores de B y C se cortan en I. ¿Cuánto mide el ángulo BIC?`, datos: [D_BIS2, D_SUMA_O], dibujo: fig(F),
        opciones: opciones(x, [
          { id: 'mitades', valor: (b + c) / 2, error: 'GE-BIS9', siFuera: `${(b + c) / 2}° suman las dos mitades; ∠BIC es lo que les falta para 180°.` },
          { id: 'a', valor: 180 - b - c, error: 'GE-BIS5-a', siFuera: `${180 - b - c}° mide el ángulo A; I ve otro ángulo.` },
          { id: 'bc', valor: 90 + (b + c) / 2, error: 'GE-BIS10', siFuera: 'La regla de 90° va con la mitad de A, no con la mitad de B + C.' },
        ], gr),
        solucion: { texto: 'En BIC quedan las mitades de B y C; lo que falta para 180° es ∠BIC.', ecuacion: junto(`m∠BIC = 180° − ${b / 2}° − ${c / 2}° = ${x}°`) } };
    }
    throw new Error('casoBICbc');
  }
  function casoInverso(r) {
    for (let i = 0; i < 400; i++) {
      const a = 2 * r.ent(15, 50), th = 90 + a / 2, [b, c] = [(180 - a) / 2 + 5 * r.ent(-3, 3), 0];
      const cc = 180 - a - b;
      if (cc < 25 || b < 25) continue;
      const F = PQ(b, cc, { angulos: { A: pide() }, BIC: t(`${th}°`) });
      if (!sirve(F)) continue;
      return { pregunta: `En el triángulo ABC, las bisectrices interiores de B y C se cortan en I, y m∠BIC = ${th}°. ¿Cuánto mide el ángulo A?`, datos: R3, dibujo: fig(F),
        opciones: opciones(a, [
          { id: 'mitad', valor: th - 90, error: 'GE-BIS11', siFuera: `${th - 90}° es la mitad de A; falta duplicarlo.` },
          { id: 'sup', valor: 180 - th, error: 'GE-BIS12', siFuera: 'Restar de 180° daría el vecino de ∠BIC; la regla dice lo que pasa de 90°.' },
          { id: 'divide', valor: (th - 90) / 2, error: 'GE-BIS13', siFuera: 'Lo que pasa de 90° ya es la mitad de A: se duplica, no se divide.' },
        ], gr),
        solucion: { texto: 'Lo que pasa de 90° es la mitad de A.', ecuacion: junto(`${th}° − 90° = ${th - 90}°   →   m∠A = ${a}°`) } };
    }
    throw new Error('casoInverso');
  }

  const bisectrices = {
    id: 'angulo-de-bisectrices',
    titulo: 'Ángulos entre bisectrices',
    pregunta: '¿De qué depende el ángulo donde se cruzan dos bisectrices?',
    temas: ['Ángulos formados por bisectrices'],
    pieza: GO,
    aprendizaje: 'Las bisectrices interiores de B y C forman 90° + m∠A/2; una interior y una exterior, m∠A/2: solo importa el ángulo A.',
    actividad: 'Cambiar dos esquinas de un parque y medir el ángulo donde se cruzan sus caminos.',
    // Lee: el parque, la bisectriz interior y la exterior, y los nombres que vienen después. No dice cuánto mide ∠BIC ni
    // ∠BEC (el juego y la predicción).
    lee: {
      tarjetas: [
        { titulo: 'El parque y la pileta', texto: 'Un parque tiene forma de triángulo ABC. Desde las esquinas B y C sale un camino que parte esa esquina en dos ángulos iguales: cada camino es una bisectriz. Los dos caminos se cruzan en I, donde está la pileta.',
          pieza: GO, dibujo: fig({ objeto: 'parque', b: 60, c: 50, angulos: { A: {} } }) },
        { titulo: 'Adentro y afuera', texto: 'Cada esquina tiene dos bisectrices: la bisectriz interior parte el ángulo de adentro, y la bisectriz exterior, el ángulo exterior. Una interior y una exterior se cruzan fuera del parque, en E; las dos exteriores de B y de C, en Q.',
          pieza: GO, dibujo: fig({ objeto: 'parque', b: 70, c: 50, I: false, E: 0, mitades: { B: true, Ce: true }, angulos: { A: {} } }) },
        { titulo: 'Nombres que vienen después', texto: 'El cruce I se llama incentro y se explica en Proporcionalidad y semejanza. El cruce E de la otra figura se llama excentro y se explica en Puntos notables. Aquí son solo cruces de caminos, con sus ángulos.' },
        { titulo: 'Qué mirar al jugar', texto: 'Arrastra la esquina A, o cambia B y C con los controles. Fíjate en m∠A y en el ángulo BIC de la pileta, y en cómo cambia uno cuando cambia el otro.' },
      ],
    },
    ejemplos: EJ6,
    juega: {
      pieza: GO,
      consigna: 'Los caminos parten B y C en mitades iguales y se cruzan en la pileta I. A se arrastra o se mueve con los controles.',
      mision: { texto: 'Arrastra la esquina A, o usa los controles, hasta que los caminos se crucen en 120°.', logrado: v => v.b + v.c === 120, bien: 'Listo: 120° = 90° + 60° ÷ 2. A mide 60°, sea cual sea B.' },
      voz: 'Mueve A. ¿De qué depende el ángulo en la pileta?',
      leyenda: [
        { s: 'I', t: 'la pileta, donde se cruzan los caminos' },
        { s: dH('m∠A'), t: 'el ángulo del parque en A' },
        { s: 'rayitas', t: 'mitades iguales de B y de C' },
        { s: 'm∠BIC', t: 'el ángulo entre los caminos, en I' },
      ],
      controles: [
        { id: 'b', etiqueta: 'm∠B, la esquina B', min: 50, max: 70, paso: 10, inicio: 60, unidad: '°', decimales: 0, color: 'c-h' },
        { id: 'c', etiqueta: 'm∠C, la esquina C', min: 50, max: 70, paso: 10, inicio: 50, unidad: '°', decimales: 0, color: 'c-h' },
      ],
      dibujo: v => ({ datos: figJ6(v.b, v.c), estado: {} }),
      arrastres: [{ id: 'esquina-a', etiqueta: 'esquina A del parque: decide los ángulos en B y en C', color: 'c-h',
        donde: v => PO.aPantalla(figJ6(v.b, v.c), vert(v.b, v.c).A),
        mover: (pt, v) => { const q = PO.aPlano(figJ6(v.b, v.c), pt), p = [q[0], Math.max(q[1], 0.05)]; return { b: U.angulo([0, 0], [6, 0], p), c: U.angulo([6, 0], [0, 0], p) }; } }],
      lectura: v => { const a = 180 - v.b - v.c; return [junto('m∠BIC = 180° − '), dH(`${v.b / 2}°`), ' − ', dH(`${v.c / 2}°`), junto(` = ${180 - v.b / 2 - v.c / 2}°; m∠A = `), dH(`${a}°`)]; },
      minimo: 3,
    },
    predice: {
      pregunta: 'En otro parque, el camino de C parte el ángulo exterior en C, entre la calle CA y la prolongación de BC. Cruza al camino de B en E. ¿Qué ángulo forman en E?',
      datos: ['m∠A = 60°', 'Cada camino parte su ángulo en dos ángulos iguales.'],
      voz: 'Una bisectriz cambió. ¿Cambia también la relación?',
      opciones: [
        { id: 'c', texto: '30°', correcta: true },
        { id: 'interior', texto: '120°', error: 'GE-BIS4', siFuera: '120° es ∠BIC, con las dos bisectrices interiores. En E, una de ellas es exterior.' },
        { id: 'entero', texto: '60°', error: 'GE-BIS5-a', siFuera: '60° sería si E viera el ángulo A entero; recibe solo su mitad.' },
        { id: 'recto', texto: '90°', error: 'GE-BIS5-b', siFuera: 'Las dos bisectrices de C sí forman 90° entre ellas; el ángulo en E es otro.' },
      ],
      dibujo: fig({ objeto: 'parque', b: 70, c: 50, I: false, E: 0, mitades: { B: true, Ce: true }, angulos: { A: t('60°') }, BEC: pide() }),
      revelar: fig({ objeto: 'parque', b: 70, c: 50, I: false, E: 0, mitades: { B: true, Ce: true }, angulos: { A: t('60°') }, BEC: { color: 'h' } }),
      coincide: 'Coincide: m∠BEC = m∠A ÷ 2 = 30°, sea cual sea la forma del parque.',
      noCoincide: 'Revisemos: en E llega solo la mitad de A: 60° ÷ 2 = 30°.',
    },
    mira: {
      pieza: GO,
      datos: { objeto: 'parque', b: 65, c: 55, I: 1, E: 3, Q: 5, mitades: { B: true, C: true, Ce: true }, angulos: { A: { color: 'h' } }, BIC: { texto: '120°', desde: 2 }, ICE: { desde: 3, arcoRecto: true }, BEC: { color: 'h', desde: 4 }, BQC: { desde: 6 }, alto: 350 },
      // Q llega en «Mira» (lector en frío, ronda 2: aparecía de golpe en la regla): las dos exteriores y el triángulo BQC.
      voz: 'Primero la pileta; después, los dos cruces de afuera.',
      pasos: [
        { estado: { corte: 1 }, texto: 'Los caminos toman la mitad de B y la mitad de C.', ecuacion: [{ frac: ['m∠B', '2'] }, ' + ', { frac: ['m∠C', '2'] }, ' = ', { frac: ['180° − m∠A', '2'] }] },
        { estado: { corte: 2 }, texto: 'En el triángulo BIC, lo que falta para 180° es m∠BIC.', ecuacion: [junto('m∠BIC = 180° − '), { frac: ['m∠B + m∠C', '2'] }, junto(' = 90° + '), { frac: ['m∠A', '2'] }] },
        { estado: { corte: 3 }, texto: 'Las dos bisectrices de C, interior y exterior, forman 90°.', ecuacion: junto('m∠ICE = 90°') },
        { estado: { corte: 4 }, texto: 'En el triángulo ICE, m∠BIC es exterior: suma 90° y m∠BEC.', ecuacion: [junto('m∠BEC = m∠BIC − 90° = '), { frac: ['m∠A', '2'] }] },
        { estado: { corte: 5 }, texto: 'Las exteriores de B y de C se cruzan en Q, debajo de BC.', ecuacion: [junto('m∠QBC = '), { frac: ['180° − m∠B', '2'] }, Y, junto('m∠QCB = '), { frac: ['180° − m∠C', '2'] }] },
        { estado: { corte: 6 }, texto: 'En el triángulo BQC, lo que falta para 180° es m∠BQC.', ecuacion: [junto('m∠BQC = '), { frac: ['m∠B + m∠C', '2'] }, junto(' = 90° − '), { frac: ['m∠A', '2'] }] },
        { estado: { corte: 6 }, texto: 'Con m∠A = 60°: 120° en I, 30° en E y 60° en Q.', ecuacion: junto(['m∠BIC = 120°', COMA, 'm∠BEC = 30°', Y, 'm∠BQC = 60°']) },
      ],
    },
    regla: {
      texto: 'Bisectrices interiores de B y C, cruce I: 90° más la mitad de m∠A. Interior con exterior, cruce E: la mitad. Dos exteriores, cruce Q: 90° menos esa mitad.',
      ecuacion: [junto('m∠BIC = 90° + '), { frac: [dH('m∠A'), '2'] }, SEP, junto('m∠BEC = '), { frac: [dH('m∠A'), '2'] }, SEP, junto('m∠BQC = 90° − '), { frac: [dH('m∠A'), '2'] }],
      condicion: 'solo cuentan qué bisectrices se cruzan y cuánto mide A: no importa cómo se reparten B y C.',
      voz: 'Antes de aplicar, revisa qué bisectrices se cruzan.',
      // Dibujo propio (docs/teoria.md 4i; auditoría, M4): los tres cruces que nombra la ecuación, I, E y Q, con m∠A = 60°
      // (120° en I, 30° en E y 60° en Q). El 30° de E faltaba (lector en frío, ronda 2): en la cuña angosta de E su rótulo
      // quedaba más cerca de I, así que va suelto, con su nombre, arriba de E.
      // m∠A va como rótulo suelto, a la izquierda de A: dentro del ángulo, su rótulo bajaba hasta I (como en el juego).
      dibujo: { pieza: GO, datos: { objeto: 'parque', b: 65, c: 55, I: 0, E: 0, Q: 0, mitades: {}, angulos: { A: { color: 'h' } }, libres: [{ en: 'A', dir: 165, dist: 24, texto: 'm∠A = 60°', color: 'h' }, { en: 'E', dir: 20, dist: 40, texto: 'm∠BEC = 30°' }],
        BIC: { texto: '120°' }, BEC: {}, BQC: { texto: '60°' }, pileta: false, alto: 350 }, estado: {} },
    },
    // Así se resuelve: el cruce E con x y el cruce I con x, con las tres reglas en los datos. «Ahora tú» pide ∠BIC, ∠BEC,
    // ∠BQC, ∠BIC desde B y C, y el inverso desde I.
    resuelve: {
      pieza: GO,
      generar(s) {
        const r = azar(s + 900);
        if (s % 2 === 0) {
          // El cruce E con x (B7: antes era el inverso de «Ahora tú» con un paso más): m∠A = 3x + u y m∠BEC = x + w,
          // con 3x + u = 2(x + w).
          for (;;) {
            const x = r.ent(15, 35), u = 5 * r.ent(-5, 4);
            if ((x + u) % 2) continue;
            const w = (x + u) / 2, a = 3 * x + u;
            if (a < 40 || a > 120 || w < 5 || w > 30) continue;
            const b = (180 - a) / 2 + 5 * r.ent(-1, 1), cc = 180 - a - b;
            if (b < 25 || cc < 25) continue;
            const ea = exp(3, u), eb = exp(1, w);
            const F = PQ(b, cc, { I: false, E: 0, mitades: { B: true, Ce: true }, angulos: { A: t(ea, 'h', { mide: a }) }, BEC: { color: 'h' } });
            if (!sirve(F)) continue;
            return {
              enunciado: `En el triángulo ABC, m∠A = ${ea}. La bisectriz interior de B y la exterior de C se cortan en E, y m∠BEC = ${eb}. ¿Cuánto mide el ángulo A?`,
              datos: R3, dibujo: fig(F),
              pasos: [
                { tipo: 'pide', texto: 'Piden m∠A; para eso hay que hallar x.' },
                { tipo: 'datos', texto: `m∠A = ${ea} y m∠BEC = ${eb}, el cruce de una interior con una exterior.` },
                { tipo: 'regla', texto: 'Interior de B con exterior de C: m∠BEC es la mitad de m∠A. Entonces A es el doble de BEC.', ecuacion: junto(`${ea} = 2(${eb})`) },
                { tipo: 'cuentas', texto: 'Despejo x y reemplazo en A.', ecuacion: [junto(`x = ${x}`), Y, junto(['m∠A = ', `3 · ${x}${u > 0 ? ` + ${u}°` : u < 0 ? ` − ${-u}°` : ''} = `, dF(`${a}°`)])] },
                { tipo: 'sentido', texto: `Compruebo: m∠BEC = ${x} + ${w}° = ${a / 2}°, la mitad de ${a}°.` },
              ],
              respuesta: ['m∠A = ', dF(`${a}°`)],
            };
          }
        }
        for (;;) {
          const k = 1, x = r.ent(20, 35), a = 2 * k * x, q = 90 + k * x - (k + 1) * x;
          if (a < 30 || a > 140 || q < 20) continue;
          const b = (180 - a) / 2 + 5 * r.ent(-2, 2), cc = 180 - a - b;
          if (b < 20 || cc < 20) continue;
          const bic = 90 + a / 2, ea = exp(2 * k, 0), eb = exp(k + 1, q);
          const F = PQ(b, cc, { angulos: { A: t(ea, 'h', { mide: a }) }, BIC: { color: 'h' } });
          return {
            enunciado: `En el triángulo ABC, m∠A = ${ea}. Las bisectrices interiores de B y C se cortan en I, y m∠BIC = ${eb}. ¿Cuánto mide el ángulo A?`,
            datos: R3, dibujo: fig(F),
            pasos: [
              { tipo: 'pide', texto: 'Piden m∠A; para eso hay que hallar x.' },
              { tipo: 'datos', texto: `m∠A = ${ea} y m∠BIC = ${eb}.` },
              { tipo: 'regla', texto: `Dos bisectrices interiores: m∠BIC = 90° + (m∠A ÷ 2). La mitad de ${ea} es ${exp(k, 0)}.`, ecuacion: junto(`90° + ${exp(k, 0)} = ${eb}`) },
              { tipo: 'cuentas', texto: 'Despejo x y reemplazo en A.', ecuacion: [junto(`x = ${x}`), Y, junto(['m∠A = ', `${2 * k} · ${x} = `, dF(`${a}°`)])] },
              { tipo: 'sentido', texto: `Compruebo: m∠BIC = ${k + 1} · ${x} + ${q}° = ${bic}° = 90° + ${a / 2}°.` },
            ],
            respuesta: ['m∠A = ', dF(`${a}°`)],
          };
        }
      },
    },
    ahoraTu: {
      pieza: GO,
      voz: 'Mira qué bisectrices se cortan antes de elegir la regla.',
      generar(s) { return conCuatro([casoBIC, casoBEC, casoBQC, casoBICbc, casoInverso][s % 5], azar(s + 7)); },
    },
  };

  // La mesa «Ángulo entre bisectrices» del laboratorio: el parque del juego de la idea 6, sin la misión (en el laboratorio
  // nada se califica). Conserva su id y los de sus controles (b y c).
  const bicDe = v => 90 + (180 - v.b - v.c) / 2;
  let BIC_MAX = 0;   // el mayor de la grilla de la mesa (B y C de 50° a 70°, de 10° en 10°)
  for (let b = 50; b <= 70; b += 10) for (let c = 50; c <= 70; c += 10) BIC_MAX = Math.max(BIC_MAX, bicDe({ b, c }));
  const mesaBisectrices = {
    id: 'bisectrices', titulo: 'Ángulo entre bisectrices', pieza: GO,
    consigna: bisectrices.juega.consigna, controles: bisectrices.juega.controles, dibujo: bisectrices.juega.dibujo,
    arrastres: bisectrices.juega.arrastres, lectura: bisectrices.juega.lectura,
    invitaciones: [
      { texto: 'Haz que el ángulo BIC mida justo 120°.', logrado: v => bicDe(v) === 120, bien: 'BIC = 120° pide A = 60°. Hay varias parejas de B y C.' },
      { texto: 'Busca el ángulo BIC más grande de la mesa.', logrado: v => bicDe(v) === BIC_MAX, bien: 'El mayor BIC sale con el mayor A: crecen juntos.' },
      { texto: 'Haz que B y C sean iguales y mira dónde queda I.', logrado: v => v.b === v.c, bien: 'Con B = C, I cae en la línea de A al punto medio de BC.' },
      { texto: 'Guarda dos casos con el mismo ángulo A y distintos B y C.',
        logrado: (v, gs) => gs.some(c => c.b !== v.b && 180 - c.b - c.c === 180 - v.b - v.c) && gs.some(c => c.b === v.b && c.c === v.c),
        bien: 'Mismo A, mismo BIC: solo cuenta A, no cómo se reparten B y C.' },
    ],
  };

  // ---------- Laboratorio: juego libre, sin preguntas ----------
  // Mesa 1, más rica que la idea 1 y la 5: se mueven A y C (la base cambia), y se elige qué línea notable sale de A.
  // Deja probar lo que las ideas no: el obtuso en C, el rectángulo exacto y el isósceles donde las líneas coinciden.
  // Colores de la idea 5, que es la que practica (auditoría, M7): altura naranja, mediana turquesa, bisectriz carmín (su
  // pie es F) y mediatriz en tinta discontinua; los tres ángulos en carmín con 1, 2 y 3 arcos, como en la idea 1. Sin verde.
  const LIN = { h: 'altura', m: 'mediana', b: 'bisectriz', z: 'mediatriz' };
  const libre = (ax, ay, cx, linea) => {
    const A = [ax, ay], B = [0, 0], C = [cx, 0];
    const a = U.angulo(A, B, C), b = U.angulo(B, A, C), c = 180 - a - b;
    const lb = U.dist(A, C), lc = U.dist(A, B);
    const H = [ax, 0], M = [cx / 2, 0], F = [cx * lc / (lb + lc), 0];
    const todas = linea === 'todas', ve = k => todas || linea === k;
    const fuera = ax < 0 || ax > cx;
    return {
      alt: `Triángulo de ángulos A = ${f(a, 0)}°, B = ${f(b, 0)}° y C = ${f(c, 0)}°${ve('h') && fuera ? '; la altura desde A cae fuera del lado BC' : ''}`,
      vista: { x: [-2.6, 8.6], y: [-1, 6.4] },
      puntos: [{ id: 'A', x: ax, y: ay, rotulo: 'A', lado: 90 }, { id: 'B', x: 0, y: 0, rotulo: 'B', lado: -120 }, { id: 'C', x: cx, y: 0, rotulo: 'C', lado: -60 },
        { id: 'H', x: H[0], y: 0, sinPunto: !ve('h'), color: 'o' }, { id: 'M', x: M[0], y: 0, sinPunto: !(ve('m') || ve('z')), color: 'i' },
        { id: 'F', x: F[0], y: 0, sinPunto: !ve('b'), color: 'h' }, { id: 'Mz', x: M[0], y: 6, sinPunto: true }],
      regiones: [{ puntos: ['A', 'B', 'C'], color: 'i', opacidad: 0.06 }],
      segmentos: [{ de: 'A', a: 'B' }, { de: 'B', a: 'C' }, { de: 'C', a: 'A' },
        ...(ve('h') && fuera ? [{ de: ax < 0 ? 'B' : 'C', a: 'H', discontinua: true, grosor: 'fino' }] : []),
        ...(ve('h') ? [{ de: 'A', a: 'H', color: 'o', grosor: 'variable' }] : []),
        ...(ve('m') ? [{ de: 'A', a: 'M', color: 'i', grosor: 'variable' }, { de: 'B', a: 'M', marcas: 1, color: 'i' }, { de: 'M', a: 'C', marcas: 1, color: 'i' }] : []),
        ...(ve('b') ? [{ de: 'A', a: 'F', color: 'h', grosor: 'variable' }] : []),
        ...(ve('z') ? [{ de: 'M', a: 'Mz', discontinua: true }] : [])],
      angulos: [
        ...(linea === 'ninguna' ? [{ en: 'A', de: 'B', a: 'C', color: 'h', marcas: 1, texto: gr(Math.round(a)) }, { en: 'B', de: 'C', a: 'A', color: 'h', marcas: 2, texto: gr(Math.round(b)) }, { en: 'C', de: 'A', a: 'B', color: 'h', marcas: 3, texto: gr(Math.round(c)) }] : []),
        ...(ve('h') && Math.abs(ay) > 0 ? [{ en: 'H', de: ax > cx ? 'B' : 'C', a: 'A', color: 'o' }] : []),
        ...(ve('b') ? [{ en: 'A', de: 'B', a: 'F', color: 'h', rayita: 1, radio: 30 }, { en: 'A', de: 'F', a: 'C', color: 'h', rayita: 1, radio: 30 }] : []),
        ...(ve('z') ? [{ en: 'M', de: 'C', a: 'Mz' }] : []),
      ],
    };
  };
  // Los tres ángulos del triángulo libre, como los calcula la figura (A, B y C).
  const angLibre = v => { const A = [v.ax, v.ay], C = [v.cx, 0], a = U.angulo(A, [0, 0], C), b = U.angulo([0, 0], A, C); return { a, b, c: 180 - a - b }; };
  let A_MAX = 0;   // el mayor ángulo A de la grilla de la mesa
  for (let i = 0; i <= 20; i++) for (let j = 0; j <= 11; j++) for (let k = 0; k <= 12; k++) A_MAX = Math.max(A_MAX, angLibre({ ax: -2 + i / 2, ay: 0.5 + j / 2, cx: 2 + k / 2 }).a);
  // Los pies de altura, mediana y bisectriz que dibuja libre(): coinciden cuando los tres caen en el mismo punto.
  const pies = v => { const P = libre(v.ax, v.ay, v.cx, 'todas').puntos, x = id => P.find(p => p.id === id).x; return [x('H'), x('M'), x('F')]; };
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
      { id: 'vertice-a', etiqueta: 'vértice A',
        donde: v => enPantalla(libre(v.ax, v.ay, v.cx, v.linea), [v.ax, v.ay]),
        mover: (pt, v) => { const q = alPlano(libre(v.ax, v.ay, v.cx, v.linea), pt); return { ax: q[0], ay: q[1] }; } },
      { id: 'vertice-c', etiqueta: 'vértice C',
        donde: v => enPantalla(libre(v.ax, v.ay, v.cx, v.linea), [v.cx, 0]),
        mover: (pt, v) => ({ cx: alPlano(libre(v.ax, v.ay, v.cx, v.linea), pt)[0] }) },
    ],
    // La relación entera, sin «·» entre dos igualdades: las tres medidas y la clase que dan.
    lectura: v => {
      const { a, b, c } = angLibre(v);
      return [junto('m∠A = '), dH(gr(Math.round(a))), ', ', junto('m∠B = '), dH(gr(Math.round(b))), ' y ', junto('m∠C = '), dH(gr(Math.round(c))), `: ${nombreAng(a, b, c)}`];
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
  // Mesa 2: la lámpara con los dos brazos libres (la idea 4 fija 40 cm y 25 cm; aquí se cambian, y el rango se lee en
  // vivo). Colores de la idea 4 (auditoría, M7): el brazo de abajo, BC, naranja; el de arriba, AB, turquesa; el codo B en
  // carmín; x, de la base a la cabeza, en tinta. Los brazos van en cm; el dibujo, en decímetros (1 unidad = 10 cm).
  const bisagraLibre = (g, c, a) => {
    const B = [0, 0], C = [a / 10, 0], A = U.polar(B, c / 10, g), x = 10 * U.dist(A, C);
    return {
      alt: `Brazos de ${f(c)} cm y ${f(a)} cm con ${f(g, 0)}° en el codo: de la base a la cabeza hay ${f(x)} cm, entre ${f(Math.abs(a - c))} cm y ${f(a + c)} cm`,
      vista: { x: [-6.6, 8.6], y: [-0.8, 6.6] },
      puntos: [{ id: 'B', x: 0, y: 0, rotulo: 'B', lado: -90 }, { id: 'C', x: a / 10, y: 0, rotulo: 'C', lado: -90 }, { id: 'A', x: A[0], y: A[1], rotulo: 'A', color: 'i', lado: 90 },
        { id: 'P0', x: c / 10, y: 0, sinPunto: true }, { id: 'P1', x: -c / 10, y: 0, sinPunto: true }],
      arcos: [{ centro: [0, 0], r: c / 10, de: 0, a: 180, color: 'i', grosor: 'fino' }],
      segmentos: [{ de: 'B', a: 'C', texto: `${f(a)} cm`, grosor: 'variable', color: 'o' }, { de: 'B', a: 'A', texto: `${f(c)} cm`, grosor: 'variable', color: 'i' },
        { de: 'A', a: 'C', texto: `x ≈ ${f(x)} cm` }],
      angulos: g > 0 && g < 180 ? [{ en: 'B', de: 'C', a: 'A', color: 'h' }] : [],
    };
  };
  // El tercer lado x que dibuja bisagraLibre, en cm.
  const tercero = v => U.dist(U.polar([0, 0], v.c, v.g), [v.a, 0]);
  let X_MAX = 0;   // el mayor x de la grilla con triángulo de verdad (ángulo en B entre 0° y 180°, sin los extremos)
  for (let g = 5; g < 180; g += 5) for (let i = 0; i <= 10; i++) for (let j = 0; j <= 14; j++) X_MAX = Math.max(X_MAX, tercero({ g, c: 10 + 5 * i, a: 10 + 5 * j }));
  const mesaBisagra = {
    id: 'bisagra-libre', titulo: 'Lámpara con brazos libres', pieza: 'geo-figura',
    consigna: 'Los brazos AB y BC de una lámpara se unen en el codo B. Arrastra A y C, y mira cuándo x roza sus límites.',
    controles: [
      { id: 'g', etiqueta: 'm∠B, la abertura del codo', min: 0, max: 180, paso: 5, inicio: 60, unidad: '°', decimales: 0, color: 'c-h' },
      { id: 'c', etiqueta: 'AB, el brazo de arriba', min: 10, max: 60, paso: 5, inicio: 50, unidad: 'cm', decimales: 0, color: 'c-i' },
      { id: 'a', etiqueta: 'BC, el brazo de abajo', min: 10, max: 80, paso: 5, inicio: 80, unidad: 'cm', decimales: 0, color: 'c-o' },
    ],
    dibujo: v => ({ datos: bisagraLibre(v.g, v.c, v.a), estado: {} }),
    arrastres: [
      { id: 'punta-a', etiqueta: 'la cabeza A', color: 'c-i',
        donde: v => enPantalla(bisagraLibre(v.g, v.c, v.a), U.polar([0, 0], v.c / 10, v.g)),
        mover: (pt, v) => { const q = alPlano(bisagraLibre(v.g, v.c, v.a), pt), g = U.grados(Math.atan2(q[1], q[0])); return { g: g < -90 ? 180 : g < 0 ? 0 : g, c: 10 * Math.hypot(q[0], q[1]) }; } },
      { id: 'vertice-c', etiqueta: 'la base C', color: 'c-o',
        donde: v => enPantalla(bisagraLibre(v.g, v.c, v.a), [v.a / 10, 0]),
        mover: (pt, v) => ({ a: 10 * alPlano(bisagraLibre(v.g, v.c, v.a), pt)[0] }) },
    ],
    // La relación entera, sin «·»: x entre la diferencia y la suma de los brazos.
    lectura: v => {
      const x = tercero(v), lo = Math.abs(v.a - v.c), hi = v.a + v.c;
      return v.g === 0 || v.g === 180 ? [junto(`x = ${f(x)} cm`), ': los puntos quedan alineados, sin triángulo']
        : [junto(`${f(lo)} cm < x ≈ ${f(x)} cm < ${f(hi)} cm`)];
    },
    invitaciones: [
      { texto: 'Haz que x toque un extremo de la desigualdad triangular: el triángulo se aplasta.',
        logrado: v => { const x = tercero(v); return Math.abs(x - Math.abs(v.a - v.c)) < 1e-9 || Math.abs(x - (v.a + v.c)) < 1e-9; },
        bien: 'En el extremo, x es la suma o la diferencia: puntos alineados, sin triángulo.' },
      { texto: 'Busca el x más largo que todavía forme triángulo.',
        logrado: v => v.g > 0 && v.g < 180 && Math.abs(tercero(v) - X_MAX) < 1e-9,
        bien: 'Se acerca a la suma de los brazos, pero nunca la alcanza.' },
      { texto: 'Con AB y BC distintos, arma un isósceles: que x iguale a uno de ellos.',
        logrado: v => v.g > 0 && v.g < 180 && v.c !== v.a && nombreLad(v.c / 10, v.a / 10, tercero(v) / 10) === 'isósceles',
        bien: 'Dos lados iguales. ¿Qué pasa con los ángulos frente a ellos?' },
      { texto: 'Guarda dos casos con los mismos brazos y distinto ángulo en B. Compara x.',
        logrado: (v, gs) => gs.some(c => c.c === v.c && c.a === v.a && c.g !== v.g) && gs.some(c => c.c === v.c && c.a === v.a && c.g === v.g),
        bien: 'Mismos brazos: a más abertura en B, más largo el tercer lado.' },
    ],
  };

  // En un ejercicio (ejemplos, «Así se resuelve» y «Ahora tú»), un arco sin dato ni pregunta va en tinta: el carmín dice
  // «esto es un dato» (auditoría, M6; geo-objeto, ejercicio: true). Un dato sin rótulo lo pide con color: 'h'.
  const enEjercicio = dib => { if (dib && dib.datos && typeof dib.datos === 'object') dib.datos.ejercicio = true; return dib; };
  for (const i of [suma, exteriorIdea, isosceles, desigualdad, lineas, bisectrices]) {
    for (const e of i.ejemplos) enEjercicio(e.figura);
    const at = i.ahoraTu.generar, rs = i.resuelve.generar;
    i.ahoraTu.generar = s => { const a = at(s); enEjercicio(a.dibujo); return a; };
    i.resuelve.generar = s => { const r = rs(s); enEjercicio(r.dibujo); return r; };
  }

  return {
    unidad: 'geometria.triangulos',
    version: '0.4.0',
    estado: 'completa',
    calidad: 2,
    requiere: ['/nucleo/kit/piezas/geo-figura.js', '/nucleo/kit/piezas/geo-objeto.js'],
    historia: {
      texto: 'En la proposición I.32 de los Elementos, la suma de los ángulos de un triángulo no se obtiene midiendo muchos dibujos: se traza una paralela y se comparan ángulos. El mismo argumento da el ángulo exterior. Una figura auxiliar se vuelve parte de la demostración.',
      pregunta: '¿Qué línea convierte una regularidad en una prueba?',
      fuente: { titulo: 'Euclides, Elementos I.32 (edición de D. E. Joyce)', url: 'https://math.clarku.edu/~djoyce/java/elements/bookI/propI32.html' },
    },
    // Glosario: las palabras que la unidad estrena (docs/teoria.md, 4d). Cada idea estrena de 2 a 4 con simple y tres
    // ejemplos: la 1, triángulo, ángulo interior, acutángulo y obtusángulo; la 2, ángulo exterior y prolongación; la 3,
    // escaleno, isósceles, equilátero y lado opuesto; la 4, desigualdad triangular y alineados; la 5, altura, mediana,
    // mediatriz y pie; la 6, bisectriz interior y exterior. Ningún simple ni ejemplo dice la respuesta de una predicción
    // (cuánto suman los ángulos o los giros, qué lado del techo queda más inclinado, los límites de AC, dónde cae la
    // altura con un ángulo obtuso, cuánto mide ∠BEC). «incentro» (Proporcionalidad y semejanza) y «excentro» (Puntos
    // notables) no se definen aquí: el lector los marca con «Se explica en…».
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
        simple: 'Lo que gira un mototaxi al doblar en una esquina de la plaza.',
        ejemplos: ['En la plaza, el giro en la esquina C es ∠ACD.', 'Con 70° adentro en C, el de afuera mide 110°: juntos forman una recta.', 'Cada vértice tiene dos, iguales: uno por cada lado que se prolonga. Se cuenta uno.'],
        ver: ['ángulo interior', 'prolongación'] },
      { termino: 'prolongación', def: 'Lo que sigue de un segmento más allá de sus extremos, sobre la misma recta.',
        simple: 'La calle que sigue de largo después de la esquina.',
        ejemplos: ['BC prolongado más allá de C llega a D.', 'Las líneas punteadas de la plaza son prolongaciones de sus lados.', 'Un lado y su prolongación forman una sola recta.'] },
      { termino: 'escaleno', def: 'Triángulo con sus tres lados de medidas distintas.',
        simple: 'Con tres lados de largos distintos: ninguno repite a otro.',
        ejemplos: ['El techo de 3 m, 4 m y 6 m.', 'Un triángulo de 5 cm, 7 cm y 9 cm.', 'Sus tres ángulos también miden distinto.'] },
      { termino: 'isósceles', def: 'Triángulo que tiene dos lados de igual medida.',
        simple: 'Con dos lados del mismo largo, como las patas de un compás.',
        ejemplos: ['El compás abierto: sus dos patas miden 12 cm.', 'Un triángulo de lados 9 cm, 9 cm y 4 cm.', 'Si AB = AC, el vértice A queda entre los lados iguales.'],
        ver: ['equilátero', 'escaleno'] },
      { termino: 'equilátero', def: 'Triángulo con sus tres lados de igual medida.',
        simple: 'Con los tres lados del mismo largo, como una señal de tránsito.',
        ejemplos: ['Un triángulo de lados 5 cm, 5 cm y 5 cm.', 'Una señal de «Ceda el paso».', 'Sus tres ángulos miden lo mismo.'] },
      { termino: 'lado opuesto', formas: ['lado opuesto', 'lados opuestos'], def: 'En un triángulo, el lado que no toca al vértice del que se habla.',
        simple: 'El lado de enfrente de una esquina, el que no la toca.',
        ejemplos: ['El lado opuesto a A es BC.', 'En △ABC, el lado opuesto a C es AB.', 'Cada vértice tiene uno: hay tres.'] },
      { termino: 'desigualdad triangular', def: 'Cada lado de un triángulo es menor que la suma de los otros dos y mayor que su diferencia.',
        simple: 'La regla que dice con qué tres largos se cierra un triángulo.',
        ejemplos: ['Con palitos de 3 cm, 4 cm y 8 cm no se arma un triángulo.', 'Con 5 cm, 7 cm y 11 cm sí se arma.', 'Vale para los tres lados a la vez.'] },
      { termino: 'alineados', formas: ['alineados', 'alineado', 'alineadas', 'alineada'], def: 'Puntos que están sobre una misma recta.',
        simple: 'Puestos en fila, sobre una sola línea recta.',
        ejemplos: ['Tres paraderos de una carretera recta.', 'B, C y D, con D en la prolongación de BC.', 'Los postes de luz de una avenida recta.'] },
      { termino: 'acutángulo', def: 'Triángulo con sus tres ángulos agudos, de menos de 90°.',
        simple: 'Con sus tres puntas cerradas, todas de menos de 90°.',
        ejemplos: ['Con ángulos de 50°, 60° y 70°, es acutángulo.', 'Con 30°, 70° y 80°, también.', 'La cartulina del juego, al empezar, es acutángulo.'] },
      { termino: 'rectángulo', def: 'Con ángulos rectos: un triángulo con uno de 90°, o un cuadrilátero con los cuatro de 90°.',
        ejemplos: ['Una escuadra de dibujo es un triángulo rectángulo.', 'Con ángulos de 90°, 30° y 60°, el triángulo es rectángulo.', 'Una hoja de cuaderno es un rectángulo: sus cuatro esquinas miden 90°.'],
        ver: ['cuadrilátero'] },
      { termino: 'obtusángulo', def: 'Triángulo con un ángulo obtuso, de más de 90° y menos de 180°.',
        simple: 'Tiene una punta muy abierta, de más de 90°.',
        ejemplos: ['Con ángulos de 30°, 40° y 110°, es obtusángulo.', 'Un tijeral de techo bajo es obtusángulo: arriba pasa de 90°.', 'Con 20°, 35° y 125°, también.'] },
      { termino: 'perpendicular', simbolo: '⟂', def: 'Que corta a otra línea formando ángulos de 90°.',
        ejemplos: ['AH ⟂ BC: AH corta a BC formando 90°.', 'Las esquinas de una hoja de cuaderno son de lados perpendiculares.', 'La mediatriz es perpendicular a su segmento.'] },
      { termino: 'altura', def: 'Segmento que va de un vértice a la recta del lado opuesto y forma 90° con ella.',
        simple: 'Camino derecho de una punta que llega en cruz a la recta de enfrente.',
        ejemplos: ['El camino del caserío que llega a la carretera formando 90°.', 'Se marca con un cuadradito en su pie.', 'Un triángulo tiene tres, una desde cada vértice.'],
        ver: ['pie', 'línea notable'] },
      { termino: 'mediana', def: 'Segmento que une un vértice del triángulo con el punto medio del lado opuesto.',
        simple: 'El camino desde una punta hasta la mitad del lado de enfrente.',
        ejemplos: ['El camino del caserío al punto M, a 3 km de cada paradero.', 'Las dos mitades del lado llevan la misma rayita.', 'Un triángulo tiene tres medianas.'],
        ver: ['punto medio'] },
      { termino: 'mediatriz', def: 'Recta perpendicular a un segmento que pasa por su punto medio.',
        simple: 'La línea que corta un tramo justo por la mitad, en cruz.',
        ejemplos: ['La mediatriz de BC pasa por M y forma 90° con BC.', 'No tiene que pasar por ningún vértice.', 'En los dibujos de la teoría va punteada, en tinta.'],
        ver: ['perpendicular', 'punto medio'] },
      { termino: 'línea notable', formas: ['líneas notables', 'línea notable'],
        def: 'Cada línea especial del triángulo: altura, mediana, bisectriz o mediatriz. Se reconoce por su condición.',
        ejemplos: ['La altura se reconoce por su ángulo de 90°.', 'La mediana, por llegar al punto medio.', 'La bisectriz, por sus dos ángulos iguales.'],
        ver: ['altura', 'mediana', 'bisectriz', 'mediatriz', 'baricentro', 'incentro'] },
      { termino: 'pie', formas: ['pie', 'pies'], def: 'Punto donde una línea trazada desde un vértice llega a la recta del lado de enfrente.',
        simple: 'El punto donde un camino toca la carretera.',
        ejemplos: ['H es el pie de la altura.', 'M es el pie de la mediana.', 'F es el pie de la bisectriz.'] },
      { termino: 'bisectriz interior', formas: ['bisectriz interior', 'bisectrices interiores'],
        def: 'La que parte en dos ángulos iguales el ángulo de adentro de un vértice.',
        simple: 'El camino que parte una esquina del parque por la mitad, hacia adentro.',
        ejemplos: ['El camino de B a la pileta.', 'Las de B y de C se cruzan en I.', 'Deja la misma rayita en sus dos mitades.'],
        ver: ['bisectriz', 'bisectriz exterior'] },
      { termino: 'bisectriz exterior', formas: ['bisectriz exterior', 'bisectrices exteriores'],
        def: 'La que parte en dos ángulos iguales el ángulo exterior de un vértice.',
        simple: 'La que parte por la mitad el ángulo de afuera de una esquina.',
        ejemplos: ['La de C parte el ángulo ACD.', 'Sale del vértice hacia fuera del triángulo.', 'Cada vértice tiene una.'],
        ver: ['bisectriz interior', 'ángulo exterior'] },
      { termino: 'demostración', def: 'Razonamiento que prueba que algo vale en todos los casos, no solo en el dibujo.',
        ejemplos: ['Una figura auxiliar, como una paralela, puede ser parte de una prueba.', 'Medir cien triángulos no es una prueba; razonar sí.', 'Euclides prueba cada proposición con las anteriores.'] },
      { termino: 'proposición', def: 'En los Elementos de Euclides, cada afirmación numerada que se enuncia y después se prueba.',
        ejemplos: ['La proposición I.32 trata de los ángulos del triángulo.', 'Cada una se prueba con las que vienen antes.', 'El libro I de los Elementos tiene 48.'] },
    ],
    laboratorio: [mesaLibre, mesaBisagra, mesaBisectrices],
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
