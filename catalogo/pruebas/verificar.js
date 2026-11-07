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
    // Baja h sin roce desde el reposo (tobogán o columpio): la rapidez abajo solo depende de h.
    const E = motor('energia'), g = E.G, v = E.rapidez(d.h, 0, 0, g);
    return { correcta: v, errores: { 'energia-sin-raiz': 2 * g * d.h, 'energia-sin-mitad': Math.sqrt(g * d.h), 'energia-v-igual-gh': g * d.h } };
  },
  'fis-09': d => {
    const E = motor('optica-espejo-esferico'), im = E.imagen(d.o, d.f, 1), ds = E.describir(im);
    const lugar = !im.real ? 'detras' : im.i > 2 * d.f ? 'mas-alla-de-C' : im.i > d.f ? 'entre-F-y-C' : 'otra';
    return { correcta: `${lugar}|${ds.derecha ? 'derecha' : 'invertida'}|${ds.tamano}`,
      errores: { 'S1-en-la-superficie': 'superficie', 'S6-detras-como-lente': 'detras', 'S5-zona': 'entre-F-y-C|invertida|menor' } };
  },

  // fis-11 a fis-15: escenas de electricidad, magnetismo y física moderna (en "reserva": las formas tienen un tope de 10).
  'fis-11': d => {
    // Dos esferas que se tocan: la carga se reparte hasta igualar el potencial (motor contacto). Se pide la de la chica (1).
    // Las cargas van en nC: el reparto es proporcional, así que el motor (en µC) da la misma cuenta con los números en nC.
    const r = motor('electrostatica').contacto(d.Q1, d.R1cm / 100, d.Q2, d.R2cm / 100);
    if (!(d.R1cm < d.R2cm)) throw new Error('la esfera 1 debe ser la chica');
    return { correcta: r.Q1f, errores: { 'EL8-se-reparte-por-igual': r.errores.mitades, 'EL8-la-chica-se-queda-con-mas': r.errores.alReves.Q1f,
      'EL8-toda-pasa-a-la-grande': r.errores.todaPasa.Q1f } };
  },
  'fis-12': d => {
    // Punto medio entre dos cables con corrientes opuestas e iguales (ida y vuelta), separados d cm; en µT.
    const r = motor('magnetismo').puntoMedio(d.I, -d.I, d.dcm / 100), uT = x => x * 1e6;
    if (!r.seSuman) throw new Error('las corrientes deben ser opuestas');
    return { correcta: uT(r.B), errores: { 'MG5-opuestas-se-anulan': uT(r.errores.seAnulan),
      'MG-usa-la-distancia-entre-cables': uT(r.errores.distanciaEntreCables), 'MG-hilo-uno-sobre-d2': uT(r.errores.unoSobreD2) } };
  },
  'fis-13': d => {
    // Electroimán que se apaga: el flujo va de B·A a 0 (cara N: Φ > 0; cara S: Φ < 0) y Lenz da el sentido visto desde
    // él y el campo inducido. El enunciado pide el sentido visto desde detrás de la espira: el del motor, al revés.
    // La mano derecha invertida deja el sentido y da vuelta el campo (como en el paso 5 de la escena).
    const I = motor('induccion'), s = d.cara === 'N' ? 1 : -1, r = I.lenz(s * I.flujo(d.B0, d.A).Phi, 0);
    if (!r.refuerza) throw new Error('el flujo debe disminuir en valor absoluto (el campo inducido refuerza al del electroimán)');
    const atras = s => ({ horario: 'antihorario', antihorario: 'horario' }[s] || s), k = x => `${atras(x.sentido)}|${x.campoInducido}`;
    return { correcta: k(r), errores: { 'MG8-MG9-contra-el-campo': k(r.errores.contraElCampo),
      'MG-mano-derecha-invertida': `${atras(r.sentido)}|${r.errores.alReves.campoInducido}`, 'MG8-sin-corriente-al-alejar': k(r.errores.sinCorriente) } };
  },
  'fis-14': d => {
    // Dos luces sobre el mismo metal: la intensa bajo el umbral y la tenue sobre él (motor fotoelectrico, juego eV).
    const F = motor('fisica-moderna'), intensa = F.fotoelectrico(d.lIntensa, d.phi), tenue = F.fotoelectrico(d.lTenue, d.phi);
    if (intensa.emite || !tenue.emite || !(d.PIntensa > d.PTenue)) throw new Error('la luz intensa no debe arrancar electrones y la tenue sí');
    return { correcta: `solo-${F.region(d.lTenue).color}`, errores: { 'FM2-basta-subir-la-intensidad': `solo-${F.region(d.lIntensa).color}`,
      'FM2-intensidad-compensa-frecuencia': 'las-dos', 'FM-intensidad-minima': 'ninguna' } };
  },
  'fis-15': d => {
    // Luz de frecuencia f (en 10¹⁴ Hz) que entra a un medio de índice n: clave «rapidez|λ en nm redondeada|color» (la
    // región si λ/n cae fuera de lo visible; «cambia» si el error cambia la frecuencia y con ella el color).
    const O = motor('ondas-electromagneticas'), l0 = O.onda(d.f14 * 1e14, 'Hz').lambdaNm, r = O.medio(l0, d.n), e = r.errores;
    const v = x => `v${num(x / 1e8)}e8`, l = x => `l${Math.round(x)}`;
    const colorF = f => O.region(O.C / f).color;
    return { correcta: `${v(r.v)}|${l(r.lambdaNm)}|${r.color}`, errores: {
      'OE12-color-por-lambda-en-el-medio': `${v(e.cambiaColor.v)}|${l(e.cambiaColor.lambdaNm)}|${e.cambiaColor.color || O.region(e.cambiaColor.lambdaNm * 1e-9).region}`,
      'OE12-cambia-la-frecuencia': `${v(e.cambiaF.v)}|${l(e.cambiaF.lambdaNm)}|${colorF(e.cambiaF.f) === r.color ? r.color : 'cambia'}`,
      'OE-la-luz-siempre-va-a-c': `${v(e.nadaCambia.v)}|${l(e.nadaCambia.lambdaNm)}|${colorF(e.nadaCambia.f)}` } };
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
  // qui-11 a qui-17: escenas de química que no tenían ítems (en "reserva" del banco: las formas tienen un tope de 10).
  'qui-11': d => {
    // Al revés: de los electrones de un ion a su elemento. Se busca con el motor el Z cuyo ion da esos electrones
    // y esos neutrones; cada error es el Z cuyo error del motor da los mismos electrones. La clave es el símbolo.
    const T = motor('atomo-y-tabla'), m = d.ion.match(/^X\^(\d?)([+-])$/), carga = (m[1] ? Number(m[1]) : 1) * (m[2] === '+' ? 1 : -1);
    const buscar = (que) => {
      for (let Z = 1; Z <= 36; Z++) {
        let r; try { r = T.particulas({ Z, A: Z + d.neutrones, carga }); } catch { continue; }
        if (que(r)) return T.SIMBOLOS[Z];
      }
      throw new Error('ningún ion da esas partículas');
    };
    return { correcta: buscar(r => r.electrones === d.electrones), errores: {
      'carga-al-reves': buscar(r => r.errores['suma-carga-a-electrones'] === d.electrones),
      'ignora-la-carga': buscar(r => r.errores['ignora-la-carga'] === d.electrones) } };
  },
  'qui-12': d => {
    // Al revés: de los electrones de valencia de un ion XOₙ^q al aporte de X. La cuenta usa la valencia del O del
    // motor, y se comprueba que un elemento del motor con esa valencia da, en el Lewis, los electrones del enunciado.
    const E = motor('enlace'), m = d.formula.match(/^XO(\d)\^(\d?)([+-])$/), n = Number(m[1]), q = (m[2] ? Number(m[2]) : 1) * (m[3] === '+' ? 1 : -1);
    const vO = E.elemento('O').valencia;
    const vX = d.V - n * vO + q;
    const ok = Object.keys(E.DATOS).some(s => { if (E.elemento(s).valencia !== vX) return false;
      try { return E.lewis({ central: s, ligandos: Array(n).fill('O'), carga: q }).electrones === d.V; } catch { return false; } });
    if (!ok) throw new Error('ningún elemento del motor da ese ion');
    return { correcta: vX, errores: { 'ignora-la-carga': d.V - n * vO, 'carga-al-reves': d.V - n * vO - q } };
  },
  'qui-13': d => {
    // Combustión de un alcohol: O₂ por cada molécula de combustible (coeficientes del motor). Los errores salen del
    // motor por otros caminos: balancear el combustible sin su O, contar solo los O del CO₂ y dar átomos de O.
    const B = motor('balance-reacciones'), r = B.balancear(d.ecuacion), ec = B.ecuacion(d.ecuacion);
    const fs = [...ec.reactivos, ...ec.productos].map(t => t.f), k = f => r.coefs[fs.indexOf(f)];
    const comb = fs[0], at = B.especie(comb).atomos, oO2 = B.especie('O2').atomos.O;
    if (!at.O) throw new Error('el combustible debe tener oxígeno');
    const sinO = Object.entries(at).filter(([e]) => e !== 'O').map(([e, n]) => e + (n === 1 ? '' : n)).join('');
    const r2 = B.balancear(d.ecuacion.replace(comb, sinO));
    const porComb = k('O2') / k(comb);
    return { correcta: porComb, errores: {
      'olvida-el-O-del-combustible': r2.coefs[1] / r2.coefs[0],
      'solo-el-O-del-CO2': k('CO2') / k(comb) * B.especie('CO2').atomos.O / oO2,
      'cuenta-atomos-no-moleculas': porComb * oO2 } };
  },
  'qui-14': d => {
    // Gas recogido sobre agua: moléculas de vapor por cada 100 del gas seco = 100·Pv/(P − Pv) (Dalton). La Pv del
    // enunciado es la del motor (Antoine) redondeada a 0,1 mmHg; la cuenta usa la del enunciado.
    const r = motor('liquidos-y-solidos').gasSobreAgua(d.Ptotal, d.T);
    if (Math.abs(r.Pv - d.Pv) > 0.05) throw new Error(`la presión de vapor del enunciado (${d.Pv}) no es la del motor (${r.Pv})`);
    const seco = d.Ptotal - d.Pv, mitad = r.errores['reparte-a-medias'];
    return { correcta: 100 * d.Pv / seco, errores: { 'fraccion-sobre-la-total': 100 * d.Pv / d.Ptotal,
      'da-la-fraccion-del-otro-gas': 100 * seco / d.Ptotal, 'gas-agua-reparte-a-medias': 100 * mitad / (d.Ptotal - mitad) } };
  },
  'qui-15': d => {
    // Rendimiento con muestra impura. El teórico sale de la parte pura, con los coeficientes del motor de balance y
    // las masas molares del motor de rendimiento; se comprueba con R.pureza que la parte pura es la del motor.
    const R = motor('rendimiento-pureza'), Bm = motor('balance-reacciones'), b = Bm.balancear(d.ecuacion), ec = Bm.ecuacion(d.ecuacion);
    for (const [f, M] of Object.entries(d.masas)) if (R.masaMolar(f) !== M) throw new Error(`la masa molar de ${f} del enunciado no es la del motor`);
    const fs = [...ec.reactivos, ...ec.productos].map(t => t.f), reactivo = fs[0], kP = fs.indexOf(d.producto);
    const teo = m => m / R.masaMolar(reactivo) * b.coefs[kP] / b.coefs[0] * R.masaMolar(d.producto);
    const pura = R.pureza(d.muestra, d.pureza).pura, p = d.pureza / 100;
    const eta = 100 * d.real / teo(pura), sinP = 100 * d.real / teo(d.muestra);
    return { correcta: eta, errores: { 'olvida-pureza': sinP, 'multiplica-pureza': sinP * p, 'suma-porcentajes': sinP + 100 - d.pureza } };
  },
  'qui-16': d => {
    // Hidrólisis de un péptido cíclico: n uniones (las n − 1 de la cadena del motor más la que cierra el anillo),
    // un agua por unión, con la masa del agua del motor. El error de cadena lineal sale de hidrolisis del motor.
    const B = motor('biomoleculas'), agua = B.masa('H2O'), piezas = Array(d.n).fill('Gly');
    const lineal = B.hidrolisis(piezas, d.mol * B.peptido(piezas).M).gramosAgua;
    const uniones = B.enlacesCadena(d.n).enlaces + 1;
    return { correcta: d.mol * uniones * agua, errores: { 'cuenta-como-cadena-lineal': lineal, 'BMH7-un-agua': d.mol * agua, 'BM9-hidrolisis-sin-agua': 0 } };
  },
  'qui-17': d => {
    // Combustión completa con O₂ de sobra: los productos pesan el combustible más el O₂ que se gasta, no todo el O₂.
    const Q = motor('quimica-ambiente'), r = Q.balanzaCombustion(d.hc, d.masaComb, d.masaO2, 0, true);
    if (r.reparto.comb !== 0 || r.reparto.CO !== 0 || r.reparto.C !== 0 || !(r.reparto.O2 > 0)) throw new Error('la combustión debe ser completa y con O₂ de sobra');
    return { correcta: r.gases, errores: { 'ES15-suma-de-masas': d.masaComb + d.masaO2, 'productos-pesan-lo-del-combustible': d.masaComb,
      'olvida-el-agua': r.reparto.CO2 * Q.masaMolar({ C: 1, O: 2 }) } };
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

  'geo-10': d => { const r = motor('poligonos').poligono(d.n), e = r.errores.diagonales;
    return { correcta: r.diagonales, errores: { 'GE23-diagonales-con-lados': e.conLados, 'diagonales-contadas-dos-veces': e.sinDividir, 'diagonales-de-un-vertice': e.soloDesdeUnVertice } }; },
  'geo-11': d => { const r = motor('poligonos').poligono(d.n), e = r.errores.sumaInteriores;
    return { correcta: r.sumaInteriores, errores: { 'GE23-suma-180n': e.con180n, 'suma-siempre-360': e.siempre360, 'suma-n-menos-1-triangulos': e.conNmenos1 } }; },

  // ---------------- Trigonometría ----------------
  'tri-01': d => { const r = motor('cinta-radio').convertir({ R: d.R });
    return { correcta: r.S, errores: { 'TR1-lee-2-como-2pi': r.errores.leePiEnR, 'TR3-radian-como-grado': r.errores.radianComoGrado, 'factor-invertido': r.errores.factorInvertido } }; },
  'tri-03': d => { const r = motor('cinta-radio').sector({ r: d.r, theta: d.theta, unidad: 'sex' });
    return { correcta: r.L, errores: { 'TR4-arco-con-grados': r.errores.arcoConGrados, 'TR2-arco-igual-radio': r.errores.arcoIgualRadio, 'arco-sin-radio': r.errores.arcoSinRadio } }; },
  'tri-04': d => { const r = motor('cinta-radio').convertir({ S: d.S });
    return { correcta: r.C, errores: { 'centesimal-igual': r.errores.centesimalIgual, 'factor-centesimal-invertido': d.S * 9 / 10 } }; },
  'tri-05': d => { const r = motor('cinta-radio').escalarRadio({ r: d.r, theta: d.theta, unidad: 'sex' }, d.k);
    const c = (L, A) => `${num(L)}|${num(A)}`;
    return { correcta: c(r.razonL, r.razonA), errores: { 'GE1-area-como-lado': c(d.k, d.k), 'arco-depende-solo-del-angulo': c(1, 1), 'arco-igual-area-doble': c(1, d.k) } }; },
  'tri-06': d => { const r = motor('cinta-radio').vueltas({ r: d.r, d: d.dPi * PI });
    return { correcta: r.n, errores: { 'vueltas-sin-2pi': r.errores.sinDosPi, 'vueltas-perimetro-pi-r': r.errores.conPiR, 'vueltas-con-diametro': r.errores.conDiametro } }; },
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

  // ---------------- Aritmética: regla de tres, conteo y probabilidad, sucesiones ----------------
  'ari-09': d => { const r = motor('regla-de-tres').reglaDeTres({ tipo: 'inversa', a1: d.a1, b1: d.b1, a2: d.a2 });
    return { correcta: r.b2, errores: { 'AR8-inversa-como-directa': r.errores.comoDirecta, 'AR6-resta-lo-que-aumenta': r.errores.aditiva, 'no-cambia': r.errores.sinCambio } }; },
  'ari-10': d => { const r = motor('regla-de-tres').trabajo({ obreros: d.o1, horas: d.h1, dias: d.d1 }, { obreros: d.o2, horas: d.h2, dias: null });
    return { correcta: r.valor, errores: { 'AR9-olvida-horas': r.errores.olvidaHoras, 'AR9-horas-como-directa': r.errores.horasDirectas, 'AR8-todo-directo': r.errores.todoDirecta } }; },
  'ari-11': d => { const r = motor('probabilidad-dados').probabilidad({ dados: 2 }, { tipo: 'suma', valor: d.suma });
    return { correcta: r.valor, errores: { 'AR20-sumas-equiprobables': r.errores.sumasEquiprobables.valor, 'AR17-sin-orden': r.errores.sinOrden.valor, 'sin-orden-sobre-36': r.errores.sinOrdenSobreTotal.valor } }; },
  'ari-12': d => { const r = motor('probabilidad-dados').comite({ n: d.n, k: d.k });
    return { correcta: r.valor, errores: { 'AR17-variacion-en-vez-de-combinacion': r.errores.variacion, 'AR19-con-repeticion': r.errores.conRepeticion, 'producto-n-por-k': r.errores.producto } }; },
  'ari-13': d => { const r = motor('sucesiones').aritmetica({ a1: d.a1, r: d.a2 - d.a1, n: d.n });
    return { correcta: r.an, errores: { 'n-en-vez-de-n-menos-1': r.errores.nEnVezDeNmenos1, 'diferencia-como-termino': r.errores.diferenciaComoTermino, 'objeto-entero-desde-t1': r.errores.objetoEntero } }; },
  'ari-14': d => { const r = motor('sucesiones').sumaAritmetica({ a1: d.a1, r: d.a2 - d.a1, n: d.n });
    return { correcta: r.S, errores: { 'gauss-sin-dividir': r.errores.sinDividir, 'ultimo-por-n': r.errores.ultimoPorN, 'n-en-vez-de-n-menos-1': r.errores.nEnVezDeNmenos1 } }; },

  // ---------------- Álgebra: traductor de enunciados (y cuadrado-crece en reserva) ----------------
  'alg-09': d => { const r = motor('traductor-enunciados').porCada({ n: d.n, m: d.m, valorM: d.valorM, letraN: 'N', letraM: 'M' });
    return { correcta: r.N, errores: { 'AL1-invertida': r.errores.invertida.valor, 'AL3-por-cada-como-suma': r.errores.suma.valor, 'AR6-diferencia': r.errores.diferencia.valor, 'por-cada-sin-dividir': d.n * d.valorM } }; },
  'alg-10': d => {
    // «El k-ple de un número, disminuido en c, es r»: primero k·x, después − c.
    const T = motor('traductor-enunciados'), sol = ec => T.resolver(ec, 'x').soluciones[0];
    return { correcta: sol(`${d.k}x − ${d.c} = ${d.r}`), errores: { 'disminuido-agrupado': sol(`${d.k}(x − ${d.c}) = ${d.r}`), 'disminuido-al-reves': sol(`${d.c} − ${d.k}x = ${d.r}`), 'disminuido-como-suma': sol(`${d.k}x + ${d.c} = ${d.r}`) } };
  },
  'alg-11': d => { const r = motor('sucesiones').geometrica({ a1: d.a1, q: d.a2 / d.a1, n: d.n });
    return { correcta: r.an, errores: { 'n-en-vez-de-n-menos-1': r.errores.nEnVezDeNmenos1, 'razon-por-diferencia': r.errores.comoAritmetica, 'RM2-objeto-entero': r.errores.objetoEntero } }; },
  'alg-12': d => { const r = motor('sucesiones').sumaGeometrica({ a1: d.a1, q: d.a2 / d.a1, n: d.n });
    return { correcta: r.S, errores: { 'suma-geometrica-ultimo-termino': r.errores.ultimoTermino, 'suma-geometrica-sin-restar-uno': r.errores.sinRestarUno, 'suma-geometrica-como-aritmetica': r.errores.comoAritmetica } }; },
  'cc-01': d => { const r = motor('cuadrado-crece').binomioCuadradoX({ b: d.b });
    return { correcta: r.texto, errores: { 'AL8-cuadrado-sin-doble-producto': r.errores.sinDoble.texto, 'cuadrado-un-solo-rectangulo': r.errores.unSoloAB.texto, 'cuadrado-olvida-la-esquina': r.errores.sinB2.texto } }; },
  'cc-02': d => { const r = motor('cuadrado-crece').raizDeSuma({ p: d.p, q: d.q });
    return { correcta: r.valor, errores: { 'AL9-raiz-de-suma-como-suma-de-raices': r.errores.sumaDeRaices.valor, 'raiz-olvidada': r.errores.sinRaiz.valor, 'raiz-mezcla-con-producto': r.errores.productoDeRaices.valor } }; },

  // ---------------- Trigonometría: caso ambiguo y leyes de senos y cosenos ----------------
  'tri-09': d => { const r = motor('caso-ambiguo').casoAmbiguo({ A: d.A, a: d.a, b: d.b }), B = r.soluciones.map(x => Math.round(x.B));
    if (r.n !== 2) throw new Error('el ítem supone dos triángulos');
    return { correcta: B.join('|'), errores: { 'TR23-solo-calculadora': String(B[0]), 'a-menor-que-b-no-alcanza': 'ninguno' } }; },
  'tri-10': d => { const r = motor('caso-ambiguo').leyCosenos({ b: d.b, c: d.c, A: d.A });
    return { correcta: r.a, errores: { 'TR24-signo': r.errores.signoCambiado.a, 'TR24-sin-termino': r.errores.sinTermino.a, 'suma-de-lados': r.errores.sumaLados.a } }; },

  // ---------------- Razonamiento matemático ----------------
  'rm-01': d => { const r = motor('traductor-enunciados').moviles({ distancia: d.distancia, v1: d.v1, v2: d.v2, sentido: 'opuesto' });
    return { correcta: r.tiempo, errores: { 'RM4-resta-en-encuentro': r.errores.restaRapideces, 'promedio-rapideces': r.errores.promedio, 'solo-un-movil': r.errores.soloRapido } }; },
  'rm-02': d => { const r = motor('traductor-enunciados').edades({ valor: d.valor, tiempo: d.signo * d.anos, k: d.k });
    return { correcta: r.B, errores: { 'RM3-sin-tiempo': r.errores.sinTiempo, 'RM1-tiempo-a-uno': r.errores.soloConocida, 'RM1-tiempo-solo-incognita': r.errores.soloIncognita } }; },
  'rm-03': d => {
    const M = motor('probabilidad-dados'), r = M.siguiente({ caras: d.caras, historia: Array(d.racha).fill(1), valor: 1 });
    // Pregunta por la misma cara de la racha («misma») o por la otra («otra»): la falacia del jugador apunta al revés en cada caso.
    const negativa = d.pregunta === 'misma' ? 'menor' : 'mayor', positiva = negativa === 'menor' ? 'mayor' : 'menor';
    return { correcta: r.texto, errores: { 'AR22-recencia-negativa': negativa, 'recencia-positiva': positiva, 'racha-completa': r.errores.rachaCompleta.texto } };
  },
  'rm-04': d => { const r = motor('probabilidad-dados').circular(d.n);
    return { correcta: r.valor, errores: { 'circular-como-lineal': r.errores.lineal, 'circular-mitad': r.valor / 2 } }; },
  'rm-05': d => { const r = motor('regla-de-tres').engranajes({ dientes: d.dientes, vueltas1: d.vueltas });
    return { correcta: r.vueltas[r.vueltas.length - 1], errores: { 'RM5-mas-dientes-mas-vueltas': r.errores.directa, aditiva: r.errores.aditiva, 'mismas-vueltas': r.errores.iguales } }; },
  'rm-06': d => { const r = motor('regla-de-tres').engranajes({ dientes: d.dientes, vueltas1: d.vueltas });
    return { correcta: r.vueltas[r.vueltas.length - 1], errores: { 'solo-la-del-medio': r.errores.soloElAnterior, 'RM5-mas-dientes-mas-vueltas': r.errores.directa, 'mismas-vueltas': r.errores.iguales, 'da-la-del-medio': r.vueltas[1] } }; },
  'rm-07': d => { const S = motor('sucesiones'), r = S.desdeOtroTermino({ a1: d.t1, r: d.t2 - d.t1, m: d.m, n: d.n });
    if (Math.abs(r.am - d.tm) > 1e-9) throw new Error('el dato de la figura m no cuadra con la sucesión');
    return { correcta: r.an, errores: { 'RM2-objeto-entero': r.errores.objetoEntero, 'diferencia-como-termino': r.errores.diferenciaComoTermino, aditiva: r.errores.aditiva } }; },
  'rm-08': d => { const r = motor('sucesiones').segundoOrden({ terminos: d.terminos, k: d.k });
    return { correcta: r.ak, errores: { 'lineal-en-cuadratica': r.errores.comoLineal, 'repite-la-ultima-diferencia': r.errores.comoLinealUltima, 'RM2-objeto-entero': r.errores.objetoEntero } }; },

  // ---------------- Plantillas nuevas (7 nov 2026) ----------------
  'id-01': d => { const r = motor('identidades-trig').doble({ sen: d.sen, cuadrante: 1 }).cosDoble, e = r.errores;
    return { correcta: r.valor, errores: { 'ID8-olvida-el-dos': e.sinDos.valor, 'ID15-olvida-el-cuadrado': e.sinCuadrado.valor, 'ID7-cos-doble-como-pitagorica': e.pitagorica.valor } }; },
  'id-02': d => { const r = motor('identidades-trig').sumaTan({ ta: d.ta, tb: d.tb }), e = r.errores;
    return { correcta: r.valor, errores: { 'TR16-tangente-de-la-suma-lineal': e.lineal.valor, 'ID11-signo-del-denominador': e.signo.valor, 'ID6-producto-de-tangentes': e.producto.valor } }; },
  'el-01': d => { const r = motor('exponenciales-logaritmos').logProducto({ base: d.base, a: d.a, b: d.b }), e = r.errores;
    return { correcta: r.valor, errores: { 'AL10-log-producto-de-logs': e.productoDeLogs.valor, 'EL2-log-solo-del-primer-factor': e.precedencia.valor, 'EL1-log-da-el-numero': e.numero.valor } }; },
  'el-02': d => { const r = motor('exponenciales-logaritmos').ecuacionBases({ b1: d.b1, e1: d.e1, b2: d.b2, e2: d.e2 }), e = r.errores;
    if (r.soluciones.length !== 1) throw new Error('el ítem supone una sola solución');
    return { correcta: r.valor, errores: { 'AL32-iguala-exponentes-con-bases-distintas': e.igualaExponentes.valor, 'EL7-potencia-de-potencia-suma': e.potenciaComoSuma.valor } }; },
  'sol-01': d => { const r = motor('solidos').piramide({ base: { tipo: 'cuadrado', lado: d.lado }, h: d.h }), e = r.errores.volumen;
    return { correcta: r.volumen, errores: { 'GE20-sin-tercio': e.sinTercio, 'piramide-mitad-del-prisma': e.mitad, 'GE14-volumen-como-area-total': e.comoArea } }; },
  'sol-02': d => { const r = motor('solidos').esfera({ r: d.r }), e = r.errores.area;
    return { correcta: r.area, errores: { 'esfera-area-como-circulo': e.comoCirculo * PI, 'esfera-area-dos-circulos': e.dosCirculos * PI, 'GE19-diametro-como-radio': e.conDiametro * PI } }; },
  'ga-01': d => { const r = motor('geometria-analitica').distancia({ A: d.A, B: d.B }), e = r.errores;
    return { correcta: r.valor, errores: { 'distancia-sin-raiz': e.sinRaiz.valor, 'distancia-suma-catetos': e.sumaCatetos.valor, 'GE11-resta-cuadrados': e.restaCuadrados.valor } }; },
  'ga-02': d => { const r = motor('geometria-analitica').distanciaPuntoRecta({ P: d.P, L: d.L }), e = r.errores;
    return { correcta: r.valor, errores: { 'distancia-recta-sin-raiz': e.sinRaiz.valor, 'distancia-recta-sin-dividir': e.sinDenominador.valor, 'distancia-recta-sin-c': e.sinC.valor } }; },
  'fr-01': d => { const F = motor('fracciones'), r = F.sumar(d.f, d.g), v = x => x.n / x.d, e = r.errores;
    return { correcta: v(r.resultado), errores: { 'AR12-suma-numeradores-y-denominadores': v(e.sumaTodo), 'suma-numeradores-multiplica-denominadores': v(e.sumaNumMultDen), 'multiplica-en-vez-de-sumar': v(e.multiplica) } }; },
  'fr-02': d => { const r = motor('fracciones').coinciden(d.a, d.b);
    return { correcta: r.minutos, errores: { 'AR13-mcd-en-vez-de-mcm': r.errores.mcd, 'AR13-producto': r.errores.producto, suma: r.errores.suma } }; },

  'inv-01': d => { const r = motor('funciones-trig-inversas').arcoDe({ fn: 'sen', grados: d.grados }), e = r.errores;
    return { correcta: r.valor, errores: { 'IN3-se-cancelan-siempre': e.siempre.grados, 'TR14-cambia-de-funcion': e.complemento.grados, 'IN24-signo-al-reducir': e.signo.grados } }; },
  'inv-02': d => { const r = motor('funciones-trig-inversas').compuesta({ ext: 'sen', inv: 'tan', k: `${d.num}/${d.den}` }), e = r.errores;
    return { correcta: r.valor, errores: { 'IN8-cancela-funciones-distintas': e.cancela.valor, 'IN9-olvida-la-raiz': e.sinRaiz.valor, 'IN10-usa-la-reciproca': e.reciproca.valor } }; },
  'rm-09': d => { const r = motor('relojes-calendarios').angulo({ H: d.H, M: d.M }), e = r.errores;
    return { correcta: r.menor, errores: { 'AR7-horario-quieto': e.horarioQuieto, 'formula-signo-cambiado': e.signoCambiado, 'no-toma-el-menor-angulo': e.noMenor } }; },
  'rm-10': d => { const r = motor('relojes-calendarios').vuelveHoraCorrecta({ a: d.a, cada: d.cada }), e = r.erroresDias;
    return { correcta: r.dias, errores: { 'adelanto-hasta-24-horas': e.dia24, 'adelanto-por-hora-sin-el-cada': e.sinCada, 'adelanto-hasta-una-hora': e.unaHora } }; },

  // rm-11 a rm-19: escenas de razonamiento matemático que no tenían ítems (en "reserva": las formas tienen un tope de 10).
  'rm-11': d => {
    // Cerco con dos precios: 2·reja·x + 2·malla·y = presupuesto; el motor da el mayor producto x·y y el cuadrado que
    // reparte los metros por igual. Los otros dos errores salen del mismo motor con otros datos: un solo lado de cada
    // precio (reja·x + malla·y) y todo el cerco al precio caro (el cuadrado de ese perímetro).
    const M = motor('maximos-minimos'), r = M.productoMaximo({ a: 2 * d.reja, b: 2 * d.malla, total: d.presupuesto });
    const P = d.presupuesto / d.reja;
    return { correcta: r.producto, errores: { 'cuadrado-con-costos-distintos': r.errores.factoresIguales.producto,
      'costo-un-lado-de-cada-par': M.productoMaximo({ a: d.reja, b: d.malla, total: d.presupuesto }).producto,
      'costo-todo-al-precio-mayor': M.rectangulo({ perimetro: P, ancho: P / 4 }).area } };
  },
  'rm-12': d => {
    // Eje que no empieza en 0: el porcentaje sale de los valores; los errores, de las alturas dibujadas, de la base
    // equivocada (el mayor) y de tomar la diferencia como porcentaje.
    const r = motor('tablas-graficos').razonBarras({ a: d.a, b: d.b, inicio: d.inicio });
    return { correcta: r.porcentajeMas, errores: { 'eje-truncado-sobrante-dibujado': 100 * r.errores.sobranteDibujado,
      'AR3-porcentaje-sobre-el-mayor': 100 * (1 - r.errores.invertida), 'variacion-absoluta-por-porcentual': r.diferencia } };
  },
  'rm-13': d => {
    // Masas que se pesan con pesas en los dos platillos (el motor recorre los 3ⁿ acomodos).
    const r = motor('cortes-pesadas').masasMedibles({ pesas: [d.p1, d.p2, d.p3] });
    if (r.completo) throw new Error('el ítem supone pesas que dejan huecos');
    return { correcta: r.cuantas, errores: { 'balanza-sin-huecos': r.suma, 'balanza-un-solo-platillo': r.errores.unPlatillo, 'balanza-cuenta-acomodos': r.errores.cadaAcomodo } };
  },
  'rm-14': d => {
    // Rectángulo con dos entrantes: el perímetro del motor sale de los vértices; se comprueba que esos vértices son la
    // figura del enunciado (caja y área). Un solo entrante (el de arriba) sale de motor.muesca.
    const M = motor('trazos-rutas'), P = M.perimetro({ vertices: d.vertices });
    if (P.ancho !== d.ancho || P.alto !== d.alto || Math.abs(P.area - (d.ancho * d.alto - d.a1 * d.h1 - d.a2 * d.h2)) > 1e-9) throw new Error('los vértices no son la figura del enunciado');
    const una = M.perimetro(M.muesca({ ancho: d.ancho, alto: d.alto, desde: d.desde, hasta: d.desde + d.a1, profundidad: d.h1 }));
    return { correcta: P.perimetro, errores: { 'perimetro-entrante-como-rectangulo': P.errores.comoRectangulo, 'perimetro-un-solo-entrante': una.perimetro, 'GE4-area-por-perimetro': P.errores.area } };
  },
  'rm-15': d => {
    // Pasar por una esquina obligada: caminos hasta ella por caminos desde ella (porElCruce del motor).
    const r = motor('trazos-rutas').cerrarCruce({ m: d.m, n: d.n, x: d.x, y: d.y });
    return { correcta: r.porElCruce, errores: { 'parada-ignorada': r.total, 'parada-suma-los-tramos': r.hasta + r.desde, 'parada-como-cruce-cerrado': r.quedan } };
  },
  'rm-16': d => {
    // Pentágono con un número en cada vértice y en el medio de cada lado: el motor prueba todas las distribuciones.
    // La menor suma por borde; los números no empiezan en 1 (de paso en paso, desde..hasta).
    const numeros = []; for (let x = d.desde; x <= d.hasta; x += d.paso) numeros.push(x);
    const r = motor('arreglos-giros').sumaLado({ lados: d.lados, porLado: 3, numeros, extremo: 'minimo' });
    return { correcta: r.respuesta, errores: { 'arreglo-vertices-una-vez': r.errores.unaVez, 'arreglo-grandes-en-vertices': r.errores.alReves, 'arreglo-suma-de-vertices': r.errores.sumaVertices } };
  },
  'rm-17': d => {
    // Al revés: de las vueltas por dentro al radio del aro. Se busca con el motor el radio R (en pasos de r) que da esas
    // vueltas; cada error es el R cuyo error del motor da las mismas vueltas, y el diámetro del aro correcto.
    const A = motor('arreglos-giros');
    const buscar = que => {
      for (let k = 2; k <= 60; k++) { const R = k * d.r, x = A.rodarCirculo({ R, r: d.r, lado: 'dentro' }); if (Math.abs(que(x) - d.vueltas) < 1e-9) return R; }
      throw new Error('ningún aro da esas vueltas');
    };
    const R = buscar(x => x.vueltas);
    return { correcta: R, errores: { 'rueda-solo-el-borde-que-toca': buscar(x => x.contacto), 'rueda-por-dentro-como-por-fuera': buscar(x => x.errores.otroLado), 'GE19-diametro-como-radio': 2 * R } };
  },
  'rm-18': d => {
    // Regreso en línea recta: el motor sigue los giros; el regreso es el recorrido con cada tramo al revés.
    const T = motor('traslados-sucesos');
    const pasos = [['avanza', d.d1], [d.g1], ['avanza', d.d2], [d.g2], ['avanza', d.d3], [d.g3], ['avanza', d.d4]];
    const ida = T.caminarConGiros({ inicio: d.inicio, pasos }), vuelta = T.recorrido(ida.tramos.map(([r, c]) => [T.girar(r, 'D', 180), c]));
    const txt = (n, dir) => `${n} m hacia el ${dir}`, catetos = Math.abs(vuelta.x) + Math.abs(vuelta.y);
    return { correcta: txt(vuelta.exacto, vuelta.direccion), errores: { 'vuelta-da-la-ida': txt(ida.exacto, ida.direccion),
      'cardinal-suma-los-catetos': txt(catetos, vuelta.direccion), 'catetos-y-vuelta-da-la-ida': txt(catetos, ida.direccion) } };
  },
  'rm-19': d => {
    // Tres sucesos en un lapso: coinciden cada MCM; el motor lo comprueba minuto a minuto (comprobado). El error de
    // usar solo dos de los tres sale del mismo motor con dos intervalos.
    const T = motor('traslados-sucesos'), I = [d.a, d.b, d.c], fin = 60 * d.minutos;
    const r = T.vecesCoinciden({ intervalos: I, inicio: 0, fin });
    if (!r.comprobado || fin % r.mcm !== 0) throw new Error('el lapso debe terminar en una coincidencia');
    return { correcta: r.veces, errores: { 'coincidencias-sin-la-primera': r.errores.sinLaPrimera,
      'coincidencia-mcm-de-dos': T.vecesCoinciden({ intervalos: I.slice(0, 2), inicio: 0, fin }).veces, 'coincidencia-suma-de-intervalos': r.errores.conSuma } };
  },

  // ari-15 a ari-26: plantillas de aritmética sin ítems en las formas (en "reserva": las formas tienen un tope de 10).
  'ari-15': d => { const r = motor('numeracion').aDecimal(d.numeral, d.b), e = r.errores;
    return { correcta: r.valor, errores: { 'potencias-corridas': e.potenciasCorridas, 'suma-cifras-por-la-base': e.sumaCifrasPorBase, 'lee-como-decimal': e.comoDecimal } }; },
  'ari-16': d => { const r = motor('numeracion').baseDesconocida(d.numeral, d.v), e = r.errores;
    if (!r.existe) throw new Error('el numeral no vale eso en ninguna base');
    return { correcta: r.base, errores: { 'base-minima-como-respuesta': e.baseMinima, 'resta-los-numerales': e.restaNumerales, 'resta-las-unidades-y-no-divide': e.sinDividir } }; },
  'ari-17': d => { const r = motor('cuatro-operaciones').restaColumnas(String(d.minuendo), String(d.sustraendo), 10), e = r.errores;
    return { correcta: Number(r.texto), errores: { 'resta-el-menor-del-mayor': Number(e.menorDelMayor), 'presta-sin-descontar': Number(e.sinDescontar), 'ceros-que-prestan-quedan-en-10': Number(e.cerosComoB) } }; },
  'ari-18': d => { const r = motor('cuatro-operaciones').division(d.D, d.d), e = r.errores;
    if (r.exacta) throw new Error('la división debe ser inexacta');
    return { correcta: r.rExceso, errores: { 'residuo-por-exceso-igual-al-por-defecto': e.igualAlDefecto, 'resta-desde-el-residuo-maximo': e.divisorMenosUnoMenosR, 'suma-el-divisor-al-residuo': e.sumaElDivisor } }; },
  'ari-19': d => { const r = motor('potenciacion').menorMultiplicador(d.N, 3), e = r.errores;
    return { correcta: r.m, errores: { 'lo-hace-cuadrado-no-cubo': e.loHaceCuadrado, 'multiplica-por-lo-que-sobra': e.copiaExponente, 'multiplica-por-todos-los-primos': e.todosLosPrimos } }; },
  'ari-20': d => { const r = motor('potenciacion').cuadradosEntre(d.a, d.b), e = r.errores;
    return { correcta: r.cantidad, errores: { 'olvida-el-mas-uno': e.sinMasUno, 'cuenta-desde-1': e.desdeUno, 'raiz-de-la-diferencia': e.raizDiferencia } }; },
  'ari-21': d => { const r = motor('mezclas').precioMedio([{ cantidad: d.q1, precio: d.p1 }, { cantidad: d.q2, precio: d.p2 }]), e = r.errores;
    return { correcta: r.precioMedio, errores: { 'AR15-promedio-simple': e.promedioSimple, 'cruza-las-cantidades': e.cantidadesCruzadas, 'suma-los-precios': e.sumaValores } }; },
  'ari-22': d => { const r = motor('mezclas').aguaPara(d.V, d.g0, d.gf), e = r.errores;
    if (!r.posible) throw new Error(r.razon);
    return { correcta: r.agua, errores: { 'aspa-al-reves': e.aspaAlReves, 'resta-grados-como-litros': e.restaGrados, 'da-el-volumen-final': e.volumenFinal } }; },
  'ari-23': d => { const r = motor('conjuntos').interseccionPorComplemento(d.U, d.nA, d.nB, d.ninguno), e = r.errores;
    return { correcta: r.respuesta, errores: { 'olvida-a-los-que-no-estan-en-ninguno': e.olvidaLosDeFuera, 'da-los-que-estan-en-al-menos-uno': e.daLaUnion, 'da-los-que-estan-solo-en-el-otro': e.daSoloElOtro } }; },
  'ari-24': d => { const S = motor('conjuntos'), n = S.conjunto(d.elementos).length, r = S.cuantosSubconjuntos(n), e = r.errores;
    if (n !== d.elementos.length) throw new Error('el conjunto tiene elementos repetidos');
    return { correcta: r.subconjuntos, errores: { 'dos-por-cada-elemento': e.dosPorElemento[0], 'olvida-el-vacio': e.sinElVacio[0], 'cuenta-ordenamientos': e.permutaciones[0] } }; },
  'ari-25': d => { const r = motor('logica').negar(d.formula), e = r.errores;
    return { correcta: r.texto, errores: { 'niega-las-partes-sin-cambiar-el-conectivo': e.negaPartes, 'niega-solo-la-primera-y-cambia': e.niegaSoloPrimera, 'niega-solo-la-primera': e.niegaPrimeraSinCambiar } }; },
  'ari-26': d => {
    // Las filas en que el condicional es falso, como «V F» (p, q) y separadas por «|»; cada error, las filas que da su lectura errada.
    const r = motor('logica').filasFalsas(d.formula), e = r.errores, k = x => x.join('|');
    return { correcta: k(r.falsas), errores: { 'condicional-al-reves': k(e.alReves), 'antecedente-falso-hace-falsa-la-promesa': k(e.ambasFalsas), 'condicional-como-bicondicional': k(e.comoBicondicional) } };
  },

  // ari-27 y ari-28: razonamiento-numerico (en "reserva" mientras la plantilla no entre al catálogo).
  'ari-27': d => { const r = motor('razonamiento-numerico').corral(d.total, d.patas), e = r.errores;
    if (!r.posible) throw new Error(r.razon);
    return { correcta: r.respuesta, errores: { 'da-los-del-tipo-supuesto': e.daLosSupuestos, 'da-lo-que-falta-sin-dividir': e.faltanSinDividir, 'divide-entre-el-valor-del-otro-tipo': e.divideEntreElOtro } }; },
  'ari-28': d => {
    // Dos etapas de «la mitad y k más»; la vuelta y cada error salen del motor (mercado).
    const r = motor('razonamiento-numerico').mercado([{ op: 'gasta', parte: [1, 2], mas: d.k1 }, { op: 'gasta', parte: [1, 2], mas: d.k2 }], d.final), e = r.errores;
    return { correcta: r.respuesta, errores: { 'dobla-y-despues-devuelve': e.devuelveDespues, 'olvida-lo-que-gasto-de-mas': e.olvidaElExtra, 'resta-lo-que-gasto-de-mas': e.restaElExtra } };
  },

  // ---------------- Aritmética (cuentas exactas, ver arriba) ----------------
  'ari-01': d => { const f = (1 - d.a / 100) * (1 - d.b / 100);
    return { correcta: d.P * f, errores: { 'suma-descuentos': d.P * (1 - (d.a + d.b) / 100), 'monto-descuento': d.P * (1 - f), 'un-solo-descuento': d.P * (1 - Math.max(d.a, d.b) / 100) } }; },
  'ari-04': d => { const f = (1 + d.a / 100) * (1 - d.a / 100);
    return { correcta: d.P * f, errores: { 'se-compensan': d.P, 'solo-aumento': d.P * (1 + d.a / 100), 'monto-variacion': d.P - d.P * f } }; },
};

module.exports = { verificadores: V, num };
