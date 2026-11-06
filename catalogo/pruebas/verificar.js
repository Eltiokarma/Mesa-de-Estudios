// Verificadores del banco de pruebas de entrada y salida (catalogo/pruebas/<curso>.json).
// Regla 1: la respuesta de cada ítem la calcula el motor de su plantilla, nunca se escribe a mano
// sin comprobar. Cada verificador recibe los motores y los datos del ítem (el campo "datos" de
// cada forma, los mismos números del enunciado) y devuelve:
//   { correcta, errores: { <código de error>: valor } }
// donde un valor numérico se compara con el "valor" de la opción y un texto, con su "clave"
// (o su "texto", si no tiene clave). Lo prueba catalogo/pruebas/pruebas.test.js.
// Aritmética no tiene motor propio (porcentajes-sucesivos es un generador que no expone sus
// cuentas): sus ítems se recalculan aquí con factores exactos, otro camino que el del generador.
'use strict';
const path = require('node:path');

const cache = {};
const motor = id => (cache[id] = cache[id] || require(path.join(__dirname, '..', '..', 'plantillas', id, 'motor.js')));
const PI = Math.PI;
// Número como lo escribe la app y el enunciado: coma decimal, signo menos tipográfico.
const num = x => { const r = Math.round(x * 1e6) / 1e6; return (r < 0 ? '−' : '') + String(Math.abs(r)).replace('.', ','); };
const menosGramos = g => Object.entries(g).sort((a, b) => a[1] - b[1])[0][0];
const punto = (x, y) => `(${num(x)}; ${num(y)})`;

const V = {
  // ---------------- Física ----------------
  'fis-01': d => {
    const M = motor('mruv');
    return { correcta: M.pendiente(d.t1, d.x1, d.t2, d.x2),
      errores: { 'G2-altura-entre-tiempo': d.x2 / d.t2, 'G2-pendiente-es-altura': d.x2, 'G2-lee-el-eje': d.x1 } };
  },
  'fis-02': d => {
    // Velocidad en un instante después de la cima: v = v0 − g·t (el motor no deja que se quede arriba).
    const M = motor('mruv'), lv = M.lanzamientoVertical({ v0: d.v0 }), v = M.movil(lv.movil).v(d.t);
    if (!(d.t > lv.tSubida)) throw new Error('el instante debe ser después de la cima');
    const k = x => `${x < 0 ? 'abajo' : x > 0 ? 'arriba' : 'quieta'}-${num(Math.abs(x))}`;
    return { correcta: k(v), errores: { 'K3-aceleracion-en-sentido-del-movimiento': k(d.v0 + 10 * d.t),
      'C1-aceleracion-cero-en-la-cima': 'quieta-0', 'signo-de-la-velocidad': k(-v) } };
  },
  'fis-03': d => {
    const r = motor('dinamica').plano({ m: d.m, angulo: d.angulo, mus: 0, v0: 1 });
    return { correcta: r.N, errores: { 'N-igual-mg': r.errores.normalIgualPeso, 'sen-cos-cambiados': r.errores.senCosCambiados, 'normal-cero-si-se-mueve': r.errores.normalCero } };
  },
  'fis-04': d => {
    const r = motor('dinamica').empujon({ m: d.m, F: d.F, dur: d.dur, muk: 0 });
    const igual = [2, 5, 20].every(k => Math.abs(r.v(d.dur * k) - r.v(d.dur)) < 1e-9 && r.a(d.dur * k) === 0) && r.v(d.dur) > 0;
    return { correcta: igual ? 'misma' : 'cambia', errores: { 'D2-la-fuerza-se-gasta': 'frena', 'D1-movimiento-necesita-fuerza': 'para', 'sigue-acelerando': 'acelera' } };
  },
  'fis-05': d => {
    const r = motor('energia').potencia({ m: d.m, h: d.h, t: d.t, eficiencia: d.eficiencia / 100 });
    return { correcta: r.Pconsumida, errores: { 'ignora-eficiencia': r.Putil, 'multiplica-eficiencia': r.Putil * r.eficiencia, 'W15-energia-por-potencia': r.W } };
  },
  'fis-06': d => {
    const C = motor('calorimetria');
    const r = C.equilibrio([{ id: 'h', sustancia: 'agua', m: d.mHielo, T: 0, fase: 'hielo' }, { id: 'a', sustancia: 'agua', m: d.mAgua, T: d.TAgua }]);
    if (!(r.hielo > 0)) throw new Error('el ítem supone que queda hielo sin derretir');
    const Lf = C.CONSTANTES.Lf, Q = d.mAgua * d.TAgua;
    return { correcta: r.T, errores: {
      'Q7-olvida-calor-latente': Q / (d.mAgua + d.mHielo),               // mezcla como si fuera agua a 0 °C
      'Q4-promedio-simple': d.TAgua / 2,
      'Q8-no-revisa-si-alcanza': (Q - d.mHielo * Lf) / (d.mAgua + d.mHielo), // la ecuación de siempre, sin ver si alcanza
    } };
  },
  'fis-07': d => {
    // B1 en serie con un grupo en paralelo; se agrega una bombilla más al grupo.
    const M = motor('circuitos-cc');
    const c = cuarta => ({ tierra: 'n', ramas: [{ id: 'pila', tipo: 'pila', a: 'n', b: 'p', fem: d.fem, r: 0 },
      { id: 'B1', tipo: 'resistencia', a: 'p', b: 'y', R: d.R }, { id: 'B2', tipo: 'resistencia', a: 'y', b: 'n', R: d.R },
      { id: 'B3', tipo: 'resistencia', a: 'y', b: 'n', R: d.R }, { id: 'B4', tipo: 'resistencia', a: 'y', b: 'n', R: d.R, abierta: !cuarta }] });
    const antes = M.resolver(c(false)), despues = M.resolver(c(true));
    const cmp = (a, b) => (b > a + 1e-9 ? 'mas' : b < a - 1e-9 ? 'menos' : 'igual');
    return { correcta: `serie-${cmp(antes.ramas.B1.P, despues.ramas.B1.P)}|paralelo-${cmp(antes.ramas.B2.P, despues.ramas.B2.P)}`,
      errores: { 'C5-toda-la-corriente-a-B2': 'serie-igual|paralelo-menos', 'C5-bombilla-independiente': 'serie-igual|paralelo-igual', 'C1-pila-corriente-constante': 'serie-menos|paralelo-menos' } };
  },
  'fis-08': d => {
    const im = motor('optica-lente-delgada').imagen(d.o, d.f, 1);
    return { correcta: im.i, errores: { 'lente-suma-inversas': 1 / (1 / d.f + 1 / d.o), 'objeto-lejano-en-el-foco': d.f, 'imagen-espejo': d.o } };
  },
  'fis-10': d => {
    const r = motor('energia').rampaResorte({ m: d.m, h: d.h, k: 1 }), g = 10;
    return { correcta: r.v, errores: { 'energia-sin-raiz': 2 * g * d.h, 'energia-sin-mitad': Math.sqrt(g * d.h), 'energia-v-igual-gh': g * d.h } };
  },
  'fis-09': d => {
    const E = motor('optica-espejo-esferico'), im = E.imagen(d.o, d.f, 1), ds = E.describir(im);
    const lugar = !im.real ? 'detras' : im.i > 2 * d.f ? 'mas-alla-de-C' : im.i > d.f ? 'entre-F-y-C' : 'otra';
    return { correcta: `${lugar}|${ds.derecha ? 'derecha' : 'invertida'}|${ds.tamano}`,
      errores: { 'S1-en-la-superficie': 'superficie', 'S6-detras-como-lente': 'detras', 'S5-zona': 'entre-F-y-C|invertida|menor' } };
  },

  // ---------------- Química ----------------
  'qui-01': d => {
    const L = motor('limitante-particulas'), r = L.reaccion(d.reaccion);
    const lim = L.porParticulas(r, d.moleculas).limitantes;
    return { correcta: lim.join('+'), errores: { 'ES20-menor-cantidad': `${d.otro}-cantidad`, 'ES21-menor-coeficiente': `${d.otro}-coeficiente`, 'ES22-se-acaban-los-dos': 'los-dos' } };
  },
  'qui-02': d => {
    const L = motor('limitante-particulas'), r = L.reaccion(d.reaccion), res = L.porMasas(r, d.gramos);
    const [P] = r.productos, [cP, fP] = P;
    const [lim] = res.limitantes;
    if (menosGramos(d.gramos) === lim) throw new Error('el ítem debe tener el limitante con más gramos (así ES20 se distingue)');
    // ES20: se toma como limitante al reactivo con menos gramos.
    const menos = menosGramos(d.gramos), cMenos = r.reactivos.find(x => x[1] === menos)[0];
    return { correcta: res.forman[fP], errores: {
      'ES20-menor-cantidad': d.gramos[menos] / r.M[menos] / cMenos * cP * r.M[fP],
      'ES15-suma-de-masas': res.antes,
      'sin-coef-producto': d.gramos[lim] / r.M[lim] * r.M[fP],          // pasa a moles, pero usa 1 a 1 con el producto
    } };
  },
  'qui-03': d => {
    const t = motor('gases').tanque({ Pman1: d.Pman1, T1C: d.T1C, T2C: d.T2C });
    return { correcta: t.Pman2, errores: { 'usa-presion-manometrica': t.conManometrica, 'rigido-presion-fija': d.Pman1, 'usa-celsius': t.conCelsiusAbs - 1 } };
  },
  'qui-04': d => {
    const r = motor('soluciones').mezclar(d.soluciones.map(s => [s.M, s.mL]));
    return { correcta: r.M, errores: { 'mezcla-promedio-simple': r.errores.promedioSimple, 'SO7-suma-concentraciones': r.errores.sumaConcentraciones, 'SO7-moles-como-concentracion': r.errores.moles } };
  },
  'qui-05': d => {
    const r = motor('soluciones').solucion({ soluto: d.soluto, g: d.g, gSolvente: d.gAgua });
    return { correcta: r.pctMasa, errores: { 'pct-sobre-solvente': r.errores.pctSobreSolvente, 'confunde-soluto-solvente': 100 * d.gAgua / r.gSolucion } };
  },
  'qui-06': d => {
    const r = motor('equilibrio-quimico').perturbar('A(g) ⇌ B(g)', { moles: { A: d.A, B: d.B }, V: 1, K: d.K }, { agregar: { A: d.agregaA } });
    const k = (a, b) => `${num(a)}-${num(b)}`, total = d.A + d.B + d.agregaA;
    if (Math.abs(d.B / d.A - d.K) > 1e-9) throw new Error('el estado inicial no está en equilibrio');
    return { correcta: k(r.final.moles.A, r.final.moles.B), errores: {
      EQ3: k(r.instante.moles.A, r.instante.moles.B), EQ6: k(d.A, d.B + d.agregaA), EQ1: k(total / 2, total / 2) } };
  },
  'qui-07': d => {
    const r = motor('acidos-bases').razonH(d.pH1, d.pH2);
    return { correcta: r.veces, errores: { 'AB4-escala-lineal': r.errores.resta, 'AB4-razon-de-pH': r.errores.razonPH, 'AB5-mas-pH-mas-H': 1 / r.veces } };
  },
  'qui-09': d => {
    const K = motor('cinetica'), r = K.factor(d.ordenes, d.factores);
    const coef = K.factor(d.coeficientes, d.factores).valor; // CI9: los coeficientes de la ecuación como órdenes
    return { correcta: r.valor, errores: { 'orden-uno': r.sinExponentes, 'suma-factores': Object.values(d.factores).reduce((a, b) => a + b, 0), CI9: coef } };
  },
  'qui-10': d => {
    const n = d.tiempo / d.vidaMedia, r = motor('cinetica').fraccionQueda(n);
    if (!Number.isInteger(n)) throw new Error('el tiempo debe ser un número entero de vidas medias');
    return { correcta: 100 * r.valor, errores: { 'vidas-medias-restando': 100 * r.restando, 'vidas-medias-dividiendo': 100 * r.dividiendo, 'una-vida-media': 50 } };
  },
  'qui-08': d => {
    const C = motor('celda-galvanica'), p = C.pila(d.metal, 'Ag');
    if (Math.abs(p.Eanodo - d.Eanodo) > 1e-9 || Math.abs(p.Ecatodo - d.Ecatodo) > 1e-9) throw new Error('los potenciales del enunciado no son los del motor');
    return { correcta: p.E, errores: { 'fem-multiplica-coeficientes': p.errores.multiplicaCoeficientes, 'fem-suma-sin-cambiar-signo': p.errores.sumaSinCambiarSigno, 'fem-resta-al-reves': p.errores.restaAlReves } };
  },

  // ---------------- Geometría ----------------
  'geo-01': d => { const r = motor('ampliadora').segunMagnitud(d.area, d.k, 'area');
    return { correcta: r.resultado, errores: { 'GE1-area-como-lado': r.errores.lineal, 'GE2-cubo-en-area': r.errores.cubo } }; },
  'geo-02': d => { const r = motor('ampliadora').segunMagnitud(d.volumen, d.k, 'volumen');
    return { correcta: r.resultado, errores: { 'GE2-volumen-como-arista': r.errores.lineal, 'GE2-volumen-como-area': r.errores.cuadrado } }; },
  'geo-03': d => { const r = motor('ampliadora').conosParaLlenar(1, 1);
    // Del cono al cilindro: hacen falta r.conos conos para llenarlo.
    return { correcta: d.cono * r.conos, errores: { 'GE20-sin-tercio': d.cono * r.errores.sinTercio, 'cono-mitad': d.cono * r.errores.mitad, 'invierte-tercio': d.cono / r.conos } }; },
  'geo-04': d => {
    // B en el origen, C en el eje x, A sobre la prolongación de CB: la altura cae fuera.
    const pie = Math.sqrt(d.AB * d.AB - d.h * d.h), t = motor('triangulo-estira').triangulo({ x: -pie, y: d.h }, { x: 0, y: 0 }, { x: d.BC, y: 0 });
    if (t.tipoAngulo !== 'obtusángulo' || t.verticeObtuso !== 'B') throw new Error('el triángulo del ítem no es obtuso en B');
    return { correcta: t.area, errores: { 'area-sin-dividir-entre-2': t.errores.areaSinMitad, 'GE7-lado-como-altura': t.errores.areaConAB, 'base-prolongacion': pie * d.h / 2 } };
  },
  'geo-05': d => {
    // Triángulo rectángulo en B: la altura desde B cae sobre la hipotenusa AC.
    const T = motor('triangulo-estira'), A = { x: 0, y: d.c1 }, B = { x: 0, y: 0 }, C = { x: d.c2, y: 0 };
    if (T.triangulo(A, B, C).verticeRecto !== 'B') throw new Error('no es rectángulo en B');
    const h = T.altura(B, A, C), hip = Math.hypot(d.c1, d.c2), m = d.c1 * d.c1 / hip;
    return { correcta: h.longitud, errores: { 'GE18-promedio-catetos': (d.c1 + d.c2) / 2, 'GE8-altura-como-mediana': h.errores.hastaPuntoMedio, 'proyeccion-como-altura': m } };
  },
  'geo-06': () => {
    const T = motor('triangulo-estira'), A = { x: 1, y: 3 }, B = { x: 0, y: 0 }, C = { x: 5, y: 0 };
    const areas = [-4, 1.5, 3, 8, 20].map(dd => T.moverEnParalela(A, B, C, dd).area), a0 = T.triangulo(A, B, C).area;
    return { correcta: areas.every(a => Math.abs(a - a0) < 1e-9) ? 'igual' : 'cambia',
      errores: { 'GE6-acostado-mas-area': 'crece', 'GE6-acostado-menos-area': 'baja', 'GE6-isosceles-mas-area': 'maximo-isosceles' } };
  },
  'geo-07': d => { const r = motor('angulo-inscrito').inscrito(0, 2 * d.inscrito, d.inscrito + 180, 5);
    if (r.pEnArco !== 'mayor' || Math.abs(r.angulo - d.inscrito) > 1e-9) throw new Error('el inscrito del motor no es el del enunciado');
    return { correcta: r.central, errores: { 'GE15-inscrito-igual-central': r.angulo, 'GE15-inscrito-doble': r.angulo / 2 } }; },
  'geo-08': d => { const r = motor('angulo-inscrito').exterior(d.lejano, d.cercano);
    return { correcta: r.angulo, errores: { 'GE16-exterior-suma': r.errores.suma, 'GE16-exterior-sin-dividir': r.errores.sinDividir, 'exterior-mitad-del-cercano': d.cercano / 2 } }; },
  'geo-09': d => { const r = motor('angulo-inscrito').longitudArco(d.arco, d.r);
    return { correcta: r.longitud, errores: { 'GE19-diametro-como-radio': r.errores.conDiametro * PI, 'GE19-area-por-longitud': r.errores.areaSector * PI, 'GE19-pi-r': r.errores.mitadDelRadio * PI } }; },

  // ---------------- Trigonometría ----------------
  'tri-01': d => { const r = motor('cinta-radio').convertir({ R: d.R });
    return { correcta: r.S, errores: { 'TR1-lee-2-como-2pi': r.errores.leePiEnR, 'TR3-radian-como-grado': r.errores.radianComoGrado, 'factor-invertido': r.errores.factorInvertido } }; },
  'tri-02': d => { const r = motor('cinta-radio').convertir({ S: d.vueltas * 360 });
    return { correcta: r.R, errores: { 'TR5-vuelta-un-radian': d.vueltas, 'TR3-grados-como-radianes': r.errores.gradosComoRadianes, 'TR1-pi-es-la-vuelta': d.vueltas * PI } }; },
  'tri-03': d => { const r = motor('cinta-radio').sector({ r: d.r, theta: d.theta, unidad: 'sex' });
    return { correcta: r.L, errores: { 'TR4-arco-con-grados': r.errores.arcoConGrados, 'TR2-arco-igual-radio': r.errores.arcoIgualRadio, 'arco-sin-radio': r.errores.arcoSinRadio } }; },
  'tri-04': d => { const r = motor('cinta-radio').convertir({ S: d.S });
    return { correcta: r.C, errores: { 'centesimal-igual': r.errores.centesimalIgual, 'factor-centesimal-invertido': d.S * 9 / 10 } }; },
  'tri-05': d => { const r = motor('cinta-radio').escalarRadio({ r: d.r, theta: d.theta, unidad: 'sex' }, d.k);
    const c = (L, A) => `${num(L)}|${num(A)}`;
    return { correcta: c(r.razonL, r.razonA), errores: { 'GE1-area-como-lado': c(d.k, d.k), 'arco-depende-solo-del-angulo': c(1, 1), 'arco-igual-area-doble': c(1, d.k) } }; },
  'tri-06': d => { const r = motor('cinta-radio').vueltas({ r: d.r, d: d.dPi * PI });
    return { correcta: r.n, errores: { 'vueltas-sin-2pi': r.errores.sinDosPi, 'vueltas-perimetro-pi-r': r.errores.conPiR, 'vueltas-con-diametro': r.errores.conDiametro } }; },
  'tri-07': d => { const r = motor('cinta-radio').transmision({ r1: d.r1, r2: d.r2, n1: d.n1, union: 'faja' });
    return { correcta: r.n2, errores: { 'faja-mismas-vueltas': r.errores.mismoAngulo, 'RM5-mas-grande-mas-vueltas': r.errores.proporcional } }; },
  'tri-08': d => { const r = motor('cinta-radio').bicicleta({ plato: d.plato, pinon: d.pinon, rueda: d.rueda, vueltasPedal: d.pedal });
    return { correcta: r.vueltasRueda, errores: { 'bici-mismas-vueltas': r.errores.mismasVueltas, 'bici-invertido': r.errores.invertido, 'bici-faja-en-el-eje': r.errores.ejeComoFaja } }; },

  // ---------------- Álgebra ----------------
  'alg-01': d => { const r = motor('grafica-perillas').vertice({ base: 'cuadratica', a: 1, b: 1, h: d.h, k: d.k }), e = r.errores;
    return { correcta: punto(r.x, r.y), errores: { 'AL28-h-al-reves': punto(e.hAlReves.x, e.hAlReves.y), 'h-como-vertical': punto(e.hComoVertical.x, e.hComoVertical.y), 'h-k-cruzados': punto(e.hkCruzados.x, e.hkCruzados.y) } }; },
  'alg-02': d => { const r = motor('grafica-perillas').evaluarSuma({ base: 'cuadratica', a: 1, b: 1, h: 0, k: d.k }, d.x0, d.suma);
    if (d.fx0 !== d.x0 * d.x0 + d.k) throw new Error('el dato f(x0) del enunciado está mal');
    return { correcta: r.valor, errores: { 'AL27-suma-fuera': r.errores.sumaFuera, 'AL27-suma-de-partes': r.errores.sumaDePartes, 'AL8-cuadrado-por-partes': r.errores.cuadradoPorPartes } }; },
  'alg-03': d => { const r = motor('grafica-perillas').inversaEn({ base: 'lineal', a: d.m, b: 1, h: 0, k: d.n }, d.y);
    return { correcta: r.valor, errores: { 'AL29-inversa-como-reciproco': r.errores.reciproco, 'inversa-calcula-f': r.errores.directo, 'inversa-despeje-al-reves': r.errores.despejeAlReves } }; },
  'alg-04': d => { const r = motor('grafica-perillas').inversa({ base: 'lineal', a: d.m, b: 1, h: 0, k: d.n });
    return { correcta: r.texto, errores: { 'AL29-inversa-como-reciproco': r.errores.reciproco.texto, 'inversa-orden-sin-invertir': r.errores.ordenSinInvertir.texto, 'AL16-signo-mal': r.errores.signoMal.texto } }; },
  'alg-05': d => { const r = motor('grafica-perillas').inecuacionLineal(d.m, d.n, d.op, d.c);
    return { correcta: r.textoX, errores: { 'AL20-no-invierte': r.errores.sinInvertir.textoX, 'AL16-transpone-mal': r.errores.transponeMal.textoX, 'AL19-como-ecuacion': r.errores.comoEcuacion.textoX } }; },
  'alg-06': d => { const r = motor('grafica-perillas').inecuacionCuadratica(1, 0, -d.c, '<');
    return { correcta: r.texto, errores: { 'AL19-como-ecuacion': r.errores.comoEcuacion.texto, 'cuadratica-adentro-afuera': r.errores.alReves.texto } }; },
  'alg-07': d => { const r = motor('grafica-perillas').valorAbsoluto(d.c, d.r, '<');
    return { correcta: r.texto, errores: { 'AL22-quita-barras': r.errores.quitaBarras.texto, 'AL22-separa-barras': r.errores.separaBarras.texto, 'abs-adentro-afuera': r.errores.alReves.texto } }; },
  'alg-08': d => { const r = motor('grafica-perillas').compararRectas(d.L1, d.L2, d.x);
    const nombre = k => ({ A: 'L1', B: 'L2' }[k] || k);
    if (r.cruce.x !== d.cruce) throw new Error(`las rectas se cruzan en x = ${r.cruce.x}, no en ${d.cruce}`);
    return { correcta: nombre(r.masRapida), errores: { 'AL25-altura-como-pendiente': nombre(r.errores.alturaComoPendiente), 'intervalo-punto-cruce': 'iguales' } }; },

  // ---------------- Trigonometría en reserva (circunferencia-trig, todavía fuera del catálogo) ----------------
  'ct-01': d => { const r = motor('circunferencia-trig').reducir('cos', d.angulo);
    return { correcta: r.valor, errores: { 'TR11-TR12-abscisa-sin-signo': r.errores.sinSigno, 'TR14-cambia-de-razon': r.errores.cambiaRazon180, 'TR11-cruza-seno-coseno': r.errores.otraCoordenada } }; },
  'ct-02': d => { const r = motor('circunferencia-trig').senoidal({ fn: d.fn, A: d.A, B: d.B, unidad: 'sex' });
    return { correcta: r.periodo, errores: { 'TR18-periodo-por-B': r.errores.periodoPorB, 'TR18-periodo-igual-B': r.errores.periodoIgualB, 'periodo-con-amplitud': r.errores.periodoConAmplitud } }; },

  // ---------------- Aritmética (cuentas exactas, ver arriba) ----------------
  'ari-01': d => { const f = (1 - d.a / 100) * (1 - d.b / 100);
    return { correcta: d.P * f, errores: { 'suma-descuentos': d.P * (1 - (d.a + d.b) / 100), 'monto-descuento': d.P * (1 - f), 'un-solo-descuento': d.P * (1 - Math.max(d.a, d.b) / 100) } }; },
  'ari-02': d => { const f = (1 + d.a / 100) * (1 - d.b / 100);
    return { correcta: d.P * f, errores: { 'se-compensan': d.P * (1 + (d.a - d.b) / 100), 'solo-aumento': d.P * (1 + d.a / 100), 'monto-variacion': Math.abs(d.P - d.P * f) } }; },
  'ari-03': d => { const c = 100 * (d.despues - d.antes) / d.antes;
    return { correcta: c, errores: { AR3: 100 * (d.despues - d.antes) / d.despues, 'monto-variacion': d.despues - d.antes, 'lo-que-queda': 100 * d.despues / d.antes } }; },
  'ari-04': d => { const f = (1 + d.a / 100) * (1 - d.a / 100);
    return { correcta: d.P * f, errores: { 'se-compensan': d.P, 'solo-aumento': d.P * (1 + d.a / 100), 'monto-variacion': d.P - d.P * f } }; },
  'ari-05': d => { const f = (1 + d.a / 100) * (1 + d.b / 100);
    return { correcta: 100 * (f - 1), errores: { 'suma-descuentos': d.a + d.b, producto: d.a * d.b / 100, 'lo-que-queda': 100 * f } }; },
  'ari-06': d => { const f = 1 + d.signo * d.a / 100;
    return { correcta: 100 * Math.abs(1 / f - 1), errores: { AR3: d.a, 'lo-que-queda': 100 / f } }; },
  'ari-07': d => { const f = 1 + d.i / 100;
    return { correcta: d.C * f ** d.anos, errores: { AR16: d.C * (1 + d.anos * d.i / 100), 'monto-variacion': d.C * (f ** d.anos - 1), 'solo-aumento': d.C * f } }; },
  'ari-08': d => { const f = 1 + d.signo * d.a / 100, antes = d.final / f;
    return { correcta: antes, errores: { AR3: d.final * (1 - d.signo * d.a / 100), 'monto-variacion': Math.abs(d.final - antes) } }; },
};

module.exports = { verificadores: V, num };
