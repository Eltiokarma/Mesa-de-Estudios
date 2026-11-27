// Oscilaciones, idea ciclo-y-amplitud: oráculo físico independiente y auditoría
// de las entradas visibles, cuentas, opciones, estados y geometría.
// No importa motores de producción para calcular valores esperados. El estado
// armónico se integra con RK4; los ciclos/distancias se reconstruyen por eventos.
'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const unidad = require('./oscilaciones.js');
const pieza = require('../../../nucleo/kit/piezas/fis-estatica.js');
const O = (() => {
'use strict';
const assert = require('node:assert/strict');
const EPS = 1e-9;
function finito(x, nombre) { assert.ok(Number.isFinite(x), `${nombre} debe ser finito`); return x; }
function positivo(x, nombre) { finito(x, nombre); assert.ok(x > 0, `${nombre} debe ser positivo`); return x; }
function cerca(a, b, mensaje, tol = 2e-9) {
  assert.ok(Math.abs(a - b) <= tol * Math.max(1, Math.abs(a), Math.abs(b)), `${mensaje}: ${a} frente a ${b}`);
}
function mcd(a, b) { a = a < 0n ? -a : a; b = b < 0n ? -b : b; while (b) [a, b] = [b, a % b]; return a || 1n; }
function fraccion(n, d = 1n) {
  n = BigInt(n); d = BigInt(d); assert.notEqual(d, 0n);
  if (d < 0n) { n = -n; d = -d; } const divisor = mcd(n, d);
  return { n: n / divisor, d: d / divisor };
}
function decimal(x) {
  finito(x, 'entrada decimal');
  const partes = String(x).toLowerCase().split('e'), exponente = Number(partes[1] || 0);
  const [entero, decimales = ''] = partes[0].split('.');
  let q = fraccion(BigInt(entero + decimales), 10n ** BigInt(decimales.length));
  q = exponente >= 0 ? fraccion(q.n * 10n ** BigInt(exponente), q.d) : fraccion(q.n, q.d * 10n ** BigInt(-exponente));
  return q;
}
const sumar = (a, b) => fraccion(a.n * b.d + b.n * a.d, a.d * b.d);
const restar = (a, b) => fraccion(a.n * b.d - b.n * a.d, a.d * b.d);
const dividir = (a, b) => fraccion(a.n * b.d, a.d * b.n);
const multiplicar = (a, b) => fraccion(a.n * b.n, a.d * b.d);
const numero = q => Number(q.n) / Number(q.d);

// Construye N intervalos iguales y N+1 marcas, incluidas ambas fronteras.
// El segundo camino halla la duración de un intervalo por bisección de su suma.
function medirPorConteo({ ciclos, duracion, inicio = 0 }) {
  assert.ok(Number.isInteger(ciclos) && ciclos > 0, 'El conteo exige un número entero positivo de ciclos completos.');
  positivo(duracion, 'duración'); finito(inicio, 'inicio');
  const delta = decimal(duracion), cantidad = fraccion(ciclos), intervalo = dividir(delta, cantidad);
  const marcas = [decimal(inicio)];
  for (let j = 0; j < ciclos; j++) marcas.push(sumar(marcas.at(-1), intervalo));
  const duraciones = marcas.slice(1).map((t, j) => restar(t, marcas[j]));
  const total = duraciones.reduce(sumar, fraccion(0));
  assert.deepEqual(total, delta);
  let lo = 0, hi = duracion;
  for (let k = 0; k < 80; k++) {
    const medio = (lo + hi) / 2; let repetido = 0;
    for (let j = 0; j < ciclos; j++) repetido += medio;
    if (repetido < duracion) lo = medio; else hi = medio;
  }
  const periodo = numero(duraciones[0]), frecuencia = numero(dividir(cantidad, total));
  cerca(periodo, (lo + hi) / 2, 'El reparto y la suma por bisección deben coincidir');
  cerca(periodo * frecuencia, 1, 'Un ciclo y la frecuencia corresponden a la misma duración');
  return { ciclos, marcas: marcas.map(numero), intervalos: duraciones.map(numero), T: periodo, f: frecuencia,
    exactos: { T: intervalo, f: dividir(cantidad, total) } };
}
function medirMarcas(marcas) {
  assert.ok(Array.isArray(marcas) && marcas.length >= 2, 'Se necesitan al menos dos marcas del mismo estado.');
  marcas.forEach(t => finito(t, 'marca temporal'));
  const intervalos = marcas.slice(1).map((t, j) => restar(decimal(t), decimal(marcas[j])));
  assert.ok(intervalos.every(q => q.n > 0n), 'Las marcas deben avanzar en el tiempo.');
  assert.ok(intervalos.every(q => q.n * intervalos[0].d === intervalos[0].n * q.d), 'Las marcas no tienen espaciado uniforme.');
  const duracion = numero(restar(decimal(marcas.at(-1)), decimal(marcas[0])));
  return medirPorConteo({ ciclos: marcas.length - 1, duracion, inicio: marcas[0] });
}

const memoria = new Map();
function estadoUnitario(fraccionCiclo) {
  const fase = ((fraccionCiclo % 1) + 1) % 1;
  const cuarto = Math.round(4 * fase);
  if (Math.abs(4 * fase - cuarto) <= 1e-11) {
    const k = cuarto % 4;
    return { u: [1, 0, -1, 0][k], du: [0, -1, 0, 1][k], fase };
  }
  const clave = fase.toPrecision(16);
  if (memoria.has(clave)) return memoria.get(clave);
  const theta = 2 * Math.PI * fase, pasos = Math.max(16, Math.ceil(theta / 0.003)), h = theta / pasos;
  let u = 1, du = 0;
  for (let k = 0; k < pasos; k++) {
    const a1 = du, b1 = -u;
    const a2 = du + h * b1 / 2, b2 = -(u + h * a1 / 2);
    const a3 = du + h * b2 / 2, b3 = -(u + h * a2 / 2);
    const a4 = du + h * b3, b4 = -(u + h * a3);
    u += h * (a1 + 2 * a2 + 2 * a3 + a4) / 6;
    du += h * (b1 + 2 * b2 + 2 * b3 + b4) / 6;
  }
  const estado = { u, du, fase }; memoria.set(clave, estado); return estado;
}
function estado(A, T, t) {
  positivo(A, 'amplitud'); positivo(T, 'período'); finito(t, 'instante');
  const u = estadoUnitario(t / T), x = A * u.u, sentido = Math.abs(u.du) < 1e-9 ? 0 : Math.sign(u.du);
  return { x, sentido, fase: u.fase, extremo: sentido === 0 ? Math.sign(u.u) : 0,
    vx: A * u.du * 2 * Math.PI / T };
}
function eventosCuartos(T, inicio, fin) {
  positivo(T, 'período'); finito(inicio, 'inicio'); finito(fin, 'fin'); assert.ok(fin >= inicio);
  const eventos = [], q = T / 4;
  for (let j = Math.ceil(inicio / q - EPS); j <= Math.floor(fin / q + EPS); j++) {
    const k = ((j % 4) + 4) % 4;
    eventos.push({ t: j * q, xRelativa: [1, 0, -1, 0][k],
      nombre: ['extremo-derecho', 'equilibrio-hacia-izquierda', 'extremo-izquierdo', 'equilibrio-hacia-derecha'][k],
      sentidoAntes: [1, -1, -1, 1][k], sentidoDespues: [-1, -1, 1, 1][k] });
  }
  return eventos;
}
function trayecto(A, T, inicio, fin) {
  positivo(A, 'amplitud'); positivo(T, 'período'); assert.ok(fin >= inicio, 'El intervalo debe avanzar.');
  const eventos = eventosCuartos(T, inicio, fin).filter(e => e.t > inicio + EPS && e.t < fin - EPS);
  const puntos = [inicio, ...eventos.map(e => e.t), fin].map(t => ({ t, x: estado(A, T, t).x }));
  const tramos = puntos.slice(1).map((p, j) => ({ desde: puntos[j], hasta: p, longitud: Math.abs(p.x - puntos[j].x) }));
  const distancia = tramos.reduce((s, p) => s + p.longitud, 0);
  return { distancia, desplazamiento: puntos.at(-1).x - puntos[0].x, tramos };
}
function repetirCuartos(A, cuartos, indiceInicial = 0) {
  positivo(A, 'amplitud'); assert.ok(Number.isInteger(cuartos) && cuartos >= 0);
  assert.ok(Number.isInteger(indiceInicial));
  const posiciones = [];
  for (let j = 0; j <= cuartos; j++) posiciones.push(A * [1, 0, -1, 0][((j + indiceInicial) % 4 + 4) % 4]);
  const distancias = posiciones.slice(1).map((x, j) => Math.abs(x - posiciones[j]));
  return { posiciones, distancia: distancias.reduce((s, x) => s + x, 0), desplazamiento: posiciones.at(-1) - posiciones[0] };
}
function mismoEstado(A, T, t1, t2) {
  const a = estado(A, T, t1), b = estado(A, T, t2);
  return Math.abs(a.x - b.x) < EPS * Math.max(1, A) && a.sentido === b.sentido;
}
function retornosCompletos(T, inicio, fin) {
  positivo(T, 'período'); assert.ok(fin >= inicio);
  const paso = decimal(T), limite = decimal(fin), eventos = [];
  let t = sumar(decimal(inicio), paso);
  while (t.n * limite.d <= limite.n * t.d) { eventos.push(numero(t)); t = sumar(t, paso); }
  return eventos;
}
function amplitudDesdeExtremos(izquierda, derecha) {
  finito(izquierda, 'extremo izquierdo'); finito(derecha, 'extremo derecho'); assert.ok(derecha > izquierda);
  const centro = numero(dividir(sumar(decimal(izquierda), decimal(derecha)), fraccion(2)));
  return { equilibrio: centro, A: numero(restar(decimal(derecha), decimal(centro))) };
}
function misionPrimeraLlegada({ A, T, t }, instanteObjetivo = 3) {
  positivo(A, 'amplitud'); positivo(T, 'período');
  const llegada = eventosCuartos(T, 0, T).find(e => e.nombre === 'extremo-izquierdo');
  return Math.abs(llegada.t - t) < EPS && Math.abs(t - instanteObjetivo) < EPS;
}
function grillaJuego({ amplitudes = Array.from({ length: 16 }, (_, k) => 5 + k), periodos = [2, 4, 6, 8], paso = 0.5, fin = 16 } = {}) {
  const estados = [];
  for (const A of amplitudes) for (const T of periodos) for (let j = 0; j <= Math.round(fin / paso); j++) {
    const t = j * paso, e = estado(A, T, t);
    estados.push({ A, T, t, ...e, cumpleExtremoIzquierdo: e.extremo === -1,
      primeraLlegadaIzquierda: Math.abs(t - T / 2) < EPS });
  }
  return estados;
}

// Una suma de intervalos y un conteo de eventos permiten contrastar los tipos
// sin copiar sus expresiones de resultado. Las operaciones equivocadas son
// deliberadas y se identifican por separado de la respuesta física.
function sumarVeces(cantidad, repeticiones) {
  assert.ok(Number.isInteger(repeticiones) && repeticiones >= 0);
  let q = fraccion(0); for (let n = 0; n < repeticiones; n++) q = sumar(q, decimal(cantidad)); return numero(q);
}
function porcion(total, partes) { return numero(dividir(decimal(total), decimal(partes))); }
function contarRecorrido(A, d) {
  let n = 0, camino = 0;
  while (camino < d - EPS && n < 100000) { camino += repetirCuartos(A, 4).distancia; n++; }
  cerca(camino, d, 'El recorrido corresponde a un número entero de ciclos'); return n;
}
function evaluarCaso(c) {
  const entradas = Object.fromEntries(Object.entries(c).filter(([k]) => !['valor', 'unidad', 'tipo'].includes(k)));
  let valor, errores, unidad, simbolos = {}, comprobaciones = [];
  switch (c.tipo) {
    case 'amplitud-extremos': {
      valor = amplitudDesdeExtremos(-c.A, c.A).A; unidad = 'cm';
      errores = [Math.abs(c.A - (-c.A)), -c.A, repetirCuartos(c.A, 4).distancia]; simbolos = { A: valor };
      break;
    }
    case 'amplitud': {
      const sistema = amplitudDesdeExtremos(c.izq, c.der); valor = sistema.A; unidad = 'cm';
      errores = [c.der - c.izq, c.der, c.der + c.izq]; simbolos = { A: valor };
      comprobaciones.push(['centro entre extremos', sistema.equilibrio > c.izq && sistema.equilibrio < c.der]); break;
    }
    case 'periodo': case 'frecuencia': {
      const medida = medirPorConteo({ ciclos: c.N, duracion: c.dt });
      valor = c.tipo === 'periodo' ? medida.T : medida.f; unidad = c.tipo === 'periodo' ? 's' : 'Hz';
      errores = c.tipo === 'periodo' ? [medida.f, c.dt, medida.T / 2] : [medida.T, 2 * medida.f, c.N];
      simbolos = { N: c.N, t: c.dt, T: medida.T, f: medida.f }; break;
    }
    case 'recorrido': {
      valor = repetirCuartos(c.A, 4 * c.N).distancia; unidad = 'cm';
      errores = [repetirCuartos(c.A, 2 * c.N).distancia, sumarVeces(c.A, c.N), 0]; simbolos = { A: c.A, N: c.N, d: valor }; break;
    }
    case 'posicion': {
      valor = estado(c.distancia, 4, 2).x; unidad = 'cm';
      errores = [c.distancia, 0, -sumarVeces(c.distancia, 2)]; simbolos = { x: valor }; break;
    }
    case 'tiempo': {
      valor = sumarVeces(c.T, c.N); unidad = 's';
      errores = [porcion(c.N, c.T), porcion(c.T, c.N), c.T]; simbolos = { t: valor, N: c.N, T: c.T }; break;
    }
    case 'ciclos': {
      valor = contarRecorrido(c.A, c.d); unidad = 'ciclos';
      errores = [porcion(c.d, repetirCuartos(c.A, 2).distancia), porcion(c.d, c.A), c.d]; simbolos = { A: c.A, d: c.d, N: valor }; break;
    }
    case 'centro': {
      const intervalo = c.final - c.inicio;
      valor = sumarVeces(intervalo, 2); unidad = 's';
      errores = [intervalo, porcion(intervalo, 2), sumarVeces(intervalo, 4)]; simbolos = { T: valor };
      const eventos = eventosCuartos(valor, valor / 4, 3 * valor / 4);
      comprobaciones.push(['cruces en sentidos contrarios', eventos[0].sentidoDespues === -eventos.at(-1).sentidoDespues]); break;
    }
    case 'minutos': {
      const tiempo = sumarVeces(60, c.min), T = porcion(1, c.f);
      valor = retornosCompletos(T, 0, tiempo).length; unidad = 'ciclos';
      errores = [c.f * c.min, porcion(tiempo, c.f), sumarVeces(valor, 2)]; simbolos = { N: valor, f: c.f, t: tiempo }; break;
    }
    case 'camino-tiempo': {
      valor = trayecto(c.A, c.T, 0, c.dt).distancia; unidad = 'cm';
      assert.ok(Number.isInteger(2 * c.dt / c.T), 'La distancia proporcional al tiempo solo se usa aquí en ciclos y medios ciclos.');
      errores = [valor / 2, c.A, trayecto(c.A, c.T, 0, c.dt).desplazamiento]; simbolos = { N: retornosCompletos(c.T, 0, c.dt).length, t: c.dt, T: c.T, A: c.A, d: valor };
      comprobaciones.push(['termina en un extremo', estado(c.A, c.T, c.dt).extremo !== 0]); break;
    }
    case 'marcas': {
      const medida = medirPorConteo({ ciclos: c.N - 1, duracion: c.final - c.inicio, inicio: c.inicio });
      valor = medida.T; unidad = 's'; errores = [porcion(c.final - c.inicio, c.N), porcion(c.final, c.N - 1), c.final - c.inicio];
      assert.equal(medida.marcas.length, c.N); simbolos = { T: valor }; break;
    }
    case 'recorrido-frecuencia': {
      const T = porcion(1, c.f), N = retornosCompletos(T, 0, c.dt).length;
      cerca(N * T, c.dt, 'El intervalo contiene ciclos completos');
      const distanciaCm = repetirCuartos(c.A, N * 4).distancia; valor = porcion(distanciaCm, 100); unidad = 'm';
      errores = [distanciaCm, porcion(valor, 2), porcion(c.A, 100)]; simbolos = { N, f: c.f, t: c.dt, A: c.A / 100, d: valor }; break;
    }
    case 'amplitud-recorrido': {
      const T = porcion(1, c.f), N = retornosCompletos(T, 0, c.dt).length;
      cerca(N * T, c.dt, 'El intervalo contiene ciclos completos');
      const recorridoUnitario = repetirCuartos(1, 4 * N).distancia;
      valor = porcion(c.d, recorridoUnitario); unidad = 'cm';
      errores = [porcion(c.d, 2 * N), porcion(c.d, N), porcion(c.d, 4)]; simbolos = { N, f: c.f, t: c.dt, A: valor, d: c.d }; break;
    }
    default: throw new Error('Tipo no cubierto por el oráculo: ' + c.tipo);
  }
  assert.ok(comprobaciones.every(([, cierto]) => cierto));
  return { tipo: c.tipo, entradas, valor, errores, unidad, simbolos, comprobaciones };
}

function calibrar() {
  const prediccion = medirPorConteo({ ciclos: 8, duracion: 4 });
  assert.equal(prediccion.T, 0.5); assert.equal(prediccion.f, 2); assert.equal(prediccion.marcas.length, 9);
  assert.deepEqual(prediccion.exactos.T, fraccion(1, 2));
  assert.deepEqual(medirMarcas([2, 2.5, 3, 3.5, 4]).intervalos, [0.5, 0.5, 0.5, 0.5]);
  assert.equal(medirMarcas([2, 2.5, 3, 3.5, 4]).ciclos, 4, 'Cinco marcas delimitan cuatro ciclos.');
  assert.equal(amplitudDesdeExtremos(-12, 12).A, 12);
  assert.deepEqual(amplitudDesdeExtremos(2, 10), { equilibrio: 6, A: 4 });
  for (let s = 0; s < 400; s++) {
    const A = (1 + s % 50) / 4, T = (2 + s % 31) / 2, ti = (s % 19) * T / 23;
    cerca(repetirCuartos(A, 4).distancia, 4 * A, 'Un ciclo suma cuatro tramos de amplitud');
    cerca(repetirCuartos(A, 2).distancia, 2 * A, 'Medio ciclo entre extremos');
    cerca(repetirCuartos(A, 1).distancia, A, 'Un cuarto de extremo a equilibrio');
    cerca(trayecto(A, T, ti, ti + T / 2).distancia, 2 * A, 'Medio período desde una fase cualquiera');
    cerca(trayecto(A, T, ti, ti + T).distancia, 4 * A, 'Un período desde una fase cualquiera');
    cerca(trayecto(A, T, ti, ti + T).desplazamiento, 0, 'El desplazamiento de un ciclo es nulo');
    assert.ok(mismoEstado(A, T, ti, ti + T));
    assert.equal(retornosCompletos(T, ti, ti + 2.25 * T).length, 2);
  }
  // Contrajemplo que impide generalizar distancia A a cualquier cuarto de período.
  const cuartoArbitrario = trayecto(10, 8, 1, 3);
  cerca(cuartoArbitrario.distancia, Math.sqrt(2) * 10, 'Cuarto de período con fase inicial T/8');
  assert.ok(Math.abs(cuartoArbitrario.distancia - 10) > 4);
  assert.ok(!mismoEstado(10, 8, 1, 7), 'La misma posición en sentidos opuestos no cierra un ciclo.');
  cerca(estado(10, 8, 1).x, estado(10, 8, 7).x, 'Contrajemplo de misma posición');
  const grilla = grillaJuego();
  assert.ok(grilla.every(e => Math.abs(e.x) <= e.A + EPS));
  assert.equal(grilla.filter(e => e.primeraLlegadaIzquierda).length, 16 * 4);
  assert.equal(grilla.filter(e => e.cumpleExtremoIzquierdo).length, 16 * (8 + 4 + 3 + 2));
  assert.ok(grilla.every(e => e.cumpleExtremoIzquierdo === (Number.isInteger(2 * e.t / e.T) && (2 * e.t / e.T) % 2 === 1)));
  assert.equal(grilla.filter(e => e.t === 0 && e.cumpleExtremoIzquierdo).length, 0);
  const mision = grilla.filter(e => misionPrimeraLlegada(e));
  assert.equal(mision.length, 16, 'La amplitud queda libre, pero la primera llegada debe ocurrir a los tres segundos.');
  assert.ok(mision.every(e => e.T === 6 && e.t === 3));
  assert.ok(!misionPrimeraLlegada({ A: 10, T: 2, t: 3 }), 'Una llegada posterior a los tres segundos no cumple la misión.');
  return { prediccion: { T: prediccion.T, f: prediccion.f, marcas: prediccion.marcas.length },
    semillas: 400, estadosJuego: grilla.length, extremosIzquierdos: grilla.filter(e => e.cumpleExtremoIzquierdo).length,
    primerasLlegadas: grilla.filter(e => e.primeraLlegadaIzquierda).length, estadosMision: mision.length, cuartoArbitrario: cuartoArbitrario.distancia };
}
return { fraccion, decimal, medirPorConteo, medirMarcas, estado, eventosCuartos, trayecto, repetirCuartos, evaluarCaso,
  mismoEstado, retornosCompletos, amplitudDesdeExtremos, misionPrimeraLlegada, grillaJuego, calibrar };

})();

test('ciclo y amplitud: 15 ejemplos, 800 casos, 528 estados y 400 cuadros con oráculo independiente', () => {
const idea = unidad.ideas.find(i => i.id === 'ciclo-y-amplitud');
assert.ok(idea, 'La unidad conserva la idea ciclo-y-amplitud.');
const propios = new Set(['oscilación', 'amplitud']);
const def = { glosario: unidad.glosario.filter(g => propios.has(g.termino)) };
assert.equal(def.glosario.length, 2, 'La idea estrena oscilación y amplitud; período/frecuencia se heredan.');
const errores = [], estadistica = { ejemplos: 0, resuelve: 0, ahoraTu: 0, ecuaciones: 0, opciones: 0, estadosGrilla: 0, cuadrosAnimados: 0, figuras: 0, sistemasRegla: 0, afirmacionesGlosario: 0 };
function cerca(a, b, contexto, tol = 2e-8) { assert.ok(Math.abs(a - b) <= tol * Math.max(1, Math.abs(a), Math.abs(b)), `${contexto}: ${a} frente a ${b}`); }
function verificar(sitio, f) { try { f(); } catch (e) { errores.push({ sitio, mensaje: e.message }); } }
function texto(n) {
  if (n == null) return ''; if (typeof n !== 'object') return String(n); if (Array.isArray(n)) return n.map(texto).join('');
  if ('t' in n) return texto(n.t); if ('negrita' in n) return texto(n.negrita);
  if (n.frac) return `(${texto(n.frac[0])})/(${texto(n.frac[1])})`;
  if (n.sup) return `(${texto(n.sup[0])})^(${texto(n.sup[1])})`;
  if (n.sub) return `${texto(n.sub[0])}_${texto(n.sub[1])}`;
  if (n.raiz) return `√(${texto(n.raiz)})`; return '';
}
function numeros(s) { return [...texto(s).replace(/−/g, '-').matchAll(/[+-]?\d+(?:[.,]\d+)?/g)].map(x => Number(x[0].replace(',', '.'))); }
function cantidad(s) { const n = numeros(s); assert.equal(n.length, 1, 'Cantidad con un solo valor: ' + texto(s)); return n[0]; }
function palabras(s) { return texto(s).trim().split(/\s+/).filter(Boolean).length; }
function limite(s, max, nombre) { assert.ok(palabras(s) <= max, `${nombre}: ${palabras(s)} palabras (máximo ${max}): ${texto(s)}`); }
function geometria(dibujo) {
  const d = dibujo.datos, g = pieza.geometria(d, dibujo.estado || {}), pisa = (a, b) => a.x0 < b.x1 && b.x0 < a.x1 && a.y0 < b.y1 && b.y0 < a.y1;
  for (const b of [...g.rotulos, ...g.objetos]) assert.ok(b.x0 >= 4 && b.x1 <= 316 && b.y0 >= 4 && b.y1 <= g.H - 4, `Margen: ${JSON.stringify(b)}`);
  for (let i = 0; i < g.rotulos.length; i++) {
    for (let j = i + 1; j < g.rotulos.length; j++) assert.ok(!pisa(g.rotulos[i], g.rotulos[j]), `Se pisan rótulos: ${g.rotulos[i].texto} / ${g.rotulos[j].texto}`);
    for (const obj of g.objetos) assert.ok(!pisa(g.rotulos[i], obj), `Rótulo sobre objeto: ${g.rotulos[i].texto}`);
    for (const li of d.lineas || []) {
      const b = g.rotulos[i];
      if (li.de[0] === li.a[0]) assert.ok(!(li.de[0] > b.x0 && li.de[0] < b.x1 && Math.min(li.de[1], li.a[1]) < b.y1 && Math.max(li.de[1], li.a[1]) > b.y0), `Guía sobre rótulo: ${b.texto}`);
    }
  }
  estadistica.figuras++;
}
function expresion(s, simbolos, c) {
  const frases = {
    'distancia del equilibrio a un extremo': simbolos.A,
    'distancia entre extremos': c.der === undefined ? 2 * c.A : c.der - c.izq,
    'distancia al equilibrio': c.distancia,
    'tiempo entre cruces consecutivos': c.final - c.inicio,
    'tiempo entre cruces': c.final - c.inicio,
    'número de intervalos': c.N - 1,
    'recorrido de un ciclo': Number.isFinite(simbolos.A) ? O.repetirCuartos(simbolos.A, 4).distancia : undefined,
    'tiempo transcurrido': c.final - c.inicio,
    'número de llegadas': c.N,
    'número de ciclos': c.N,
    'tiempo total': c.dt,
    'ciclos completos': Number.isFinite(c.T) && Number.isFinite(c.dt) ? O.retornosCompletos(c.T, 0, c.dt).length : undefined,
    'medio ciclo': Number.isFinite(c.T) && Number.isFinite(c.dt) ? O.eventosCuartos(c.T, 0, c.dt).filter(e => e.nombre === 'extremo-izquierdo').length - O.retornosCompletos(c.T, 0, c.dt).length : undefined,
    'recorrido': simbolos.d,
    'tiempo': c.final - c.inicio,
    'llegadas': c.N,
  };
  s = s.trim().replace(/[.,]$/, '');
  for (const [k, v] of Object.entries(frases)) if (s.includes(k)) { assert.ok(Number.isFinite(v), k); s = s.split(k).join(`(${v})`); }
  s = s.replace(/−/g, '-').replace(/[·×]/g, '*').replace(/÷/g, '/').replace(/,/g, '.').replace(/\b(cm|m|s|Hz|ciclos)\b/g, '').replace(/\^/g, '**');
  s = s.replace(/\b[A-Za-z]+\b/g, k => { assert.ok(k in simbolos, `Símbolo sin valor: ${k} en ${s}`); return `(${simbolos[k]})`; });
  assert.ok(/^[\d\s.+*/()\-]+$/.test(s), 'Expresión no reconocida: ' + s);
  const v = Function('"use strict";return (' + s + ')')(); assert.ok(Number.isFinite(v)); return v;
}
function ecuaciones(nodos, esperado, c) {
  for (const fila of nodos || []) if (fila.ecuacion) for (const linea of texto(fila.ecuacion).split(';')) {
    const partes = linea.split(/(=|≈)/).map(x => x.trim()); if (partes.length < 3) continue;
    const vals = [];
    for (let n = 0; n < partes.length; n += 2) vals.push(expresion(partes[n], esperado.simbolos, c));
    for (let n = 1; n < vals.length; n++) {
      if (partes[2 * n - 1] === '=') cerca(vals[n - 1], vals[n], `Igualdad escrita ${linea}`, 1e-10);
      else assert.ok(Math.abs(vals[n - 1] - vals[n]) <= 0.005001, `Aproximación ${linea}`);
      estadistica.ecuaciones++;
    }
  }
}
function comprobarOpciones(ops, e) {
  assert.equal(ops.length, 4); assert.equal(new Set(ops.map(o => texto(o.texto))).size, 4);
  const buenas = ops.filter(o => Math.abs(o.valor - e.valor) < 1e-10); assert.equal(buenas.length, 1); assert.equal(buenas[0].correcta, true);
  const calculados = [e.valor, ...e.errores];
  ops.forEach((o, i) => {
    cerca(o.valor, calculados[i], `Alternativa ${i}`); cerca(cantidad(o.texto), o.valor, 'Número visible de opción', 0.005 / Math.max(1, Math.abs(o.valor)) + 1e-10);
    assert.ok(texto(o.texto).includes(e.unidad)); limite(o.texto, 14, 'Opción');
    if (Math.abs(cantidad(o.texto) - o.valor) > 1e-9) assert.ok(texto(o.texto).includes('≈'), 'Una opción redondeada debe llevar ≈');
    if (i) { assert.ok(o.error); assert.ok(o.siFuera); limite(o.siFuera, 40, 'siFuera'); }
    estadistica.opciones++;
  });
}
function comprobarCaso(caso, clase, indice) {
  const c = caso.caso, e = O.evaluarCaso(c); cerca(c.valor, e.valor, 'Respuesta metadata'); assert.equal(c.unidad, e.unidad);
  const enunciado = caso.enunciado || caso.pregunta; limite(enunciado, 40, 'Enunciado');
  const visibles = numeros(enunciado);
  for (const [k, v] of Object.entries(e.entradas)) if (typeof v === 'number') assert.ok(visibles.some(x => Math.abs(x - v) < 1e-10), `Entrada ${k}=${v} ausente del enunciado: ${texto(enunciado)}`);
  assert.ok(caso.datos.length <= 6); caso.datos.forEach(d => limite(d, 22, 'Datos'));
  if (caso.respuesta) { cerca(cantidad(caso.respuesta), e.valor, 'Respuesta visible'); assert.ok(texto(caso.respuesta).includes(e.unidad)); limite(caso.respuesta, 14, 'Respuesta'); }
  const pasos = caso.pasos || (Array.isArray(caso.solucion) ? caso.solucion : [caso.solucion]);
  assert.ok(pasos.length <= (clase === 'resuelve' ? 6 : clase === 'ejemplos' ? 4 : 1));
  for (const p of pasos) limite(p.texto, clase === 'ahoraTu' ? 40 : 50, 'Paso');
  ecuaciones(pasos, e, c);
  if (caso.opciones) comprobarOpciones(caso.opciones, e);
  if (caso.alternativas) {
    assert.equal(caso.alternativas.length, 4); assert.equal(new Set(caso.alternativas).size, 4);
    const nums = caso.alternativas.map(cantidad); assert.equal(nums.filter(v => Math.abs(v - e.valor) < 1e-9).length, 1);
    for (const v of [e.valor, ...e.errores]) assert.ok(nums.some(n => Math.abs(n - v) <= 0.005001), `Alternativa ${v} ausente`);
    const cierre = texto(pasos.at(-1).texto);
    for (const alt of caso.alternativas.filter(a => Math.abs(cantidad(a) - e.valor) > 1e-8)) assert.ok(cierre.includes(alt), `El cierre no explica ${alt}`);
  }
  const dibujo = caso.figura || caso.dibujo;
  assert.ok(dibujo.datos.textos.some(t => /no está a escala/.test(t.texto)), 'Problema: se declara dibujo no a escala');
  assert.ok(!dibujo.datos.textos.some(t => /^x\s*[=≈]/.test(t.texto)), 'Problema: el montaje no revela posición solicitada');
  geometria(dibujo);
  estadistica[clase]++;
}
function comprobarEstado(val, animado = false) {
  const d = idea.juega.dibujo(val).datos, lectura = texto(idea.juega.lectura(val));
  const mt = lectura.match(/t\s*([=≈])\s*([\d.,]+)\s*s/); assert.ok(mt, lectura);
  const reloj = Number(mt[2].replace(',', '.'));
  assert.ok(Math.abs(reloj - val.t) <= 0.050001, 'El reloj representa el décimo más cercano al instante');
  const esperado = O.estado(val.A, val.T, reloj), caja = d.objetos.find(o => o.tipo === 'caja');
  cerca((caja.x - 178) / 4, esperado.x, 'Posición geométrica según reloj visible');
  const mx = lectura.match(/x\s*([=≈])\s*([−\-\d.,]+)\s*cm/); assert.ok(mx, lectura);
  const x = Number(mx[2].replace('−', '-').replace(',', '.'));
  assert.ok(Math.abs(x - esperado.x) <= 0.005001, 'Posición visible');
  if (Math.abs(x - esperado.x) > 1e-9) assert.equal(mx[1], '≈', 'Posición redondeada');
  const rotulo = d.textos.find(t => /^x\s*[=≈]/.test(t.texto)); assert.ok(rotulo);
  assert.equal(texto(rotulo.texto), mx[0], 'Dibujo y lectura comparten posición y redondeo');
  assert.equal(idea.juega.mision.logrado(val), O.misionPrimeraLlegada({ ...val, t: reloj }), 'Misión: primera llegada, reloj3s y A libre');
  geometria({ datos: d });
  estadistica[animado ? 'cuadrosAnimados' : 'estadosGrilla']++;
}
verificar('calibración independiente', () => O.calibrar());
verificar('contrato 15 ejemplos', () => { assert.equal(idea.ejemplos.length, 15); [1, 2, 3].forEach(n => assert.equal(idea.ejemplos.filter(e => e.nivel === n).length, 5)); });
idea.ejemplos.forEach((e, i) => verificar('ejemplo ' + (i + 1), () => comprobarCaso(e, 'ejemplos', i)));
for (const fase of ['resuelve', 'ahoraTu']) for (let s = 0; s < 400; s++) verificar(fase + ' semilla ' + s, () => comprobarCaso(idea[fase].generar(s), fase, s));
for (const val of O.grillaJuego({ amplitudes: [5, 10, 15, 20] })) verificar('grilla ' + JSON.stringify(val), () => comprobarEstado(val));
for (let s = 0; s < 400; s++) {
  const val = { A: [5, 10, 15, 20][s % 4], T: [2, 4, 6, 8][Math.floor(s / 4) % 4], t: Math.round((s * 977 % 1600000) / 100) / 1000 };
  verificar('animación ' + JSON.stringify(val), () => comprobarEstado(val, true));
}
verificar('predicción', () => { const T = O.medirPorConteo({ ciclos: 8, duracion: 4 }).T; comprobarOpciones(idea.predice.opciones, { valor: T, errores: [O.medirPorConteo({ ciclos: 16, duracion: 4 }).T, O.medirPorConteo({ ciclos: 4, duracion: 4 }).T, O.medirPorConteo({ ciclos: 8, duracion: 4 }).f], unidad: 's' }); });
verificar('Mira y figuras fijas', () => {
  ecuaciones(idea.mira.pasos.slice(0, 3), { simbolos: { T: 0.5, f: 2 } }, { N: 8, dt: 4 });
  idea.mira.pasos.forEach(p => limite(p.texto, 35, 'Mira'));
  idea.lee.tarjetas.filter(t => t.dibujo).forEach(t => geometria(t.dibujo));
  geometria(idea.predice.dibujo); geometria(idea.predice.revelar); geometria({ datos: idea.mira.datos }); geometria(idea.regla.dibujo);
});
for (let semilla = 0; semilla < 400; semilla++) verificar('Regla y afirmaciones ' + semilla, () => {
  const A = 1 + semilla % 29, N = 1 + semilla % 17, T = (2 + semilla % 31) / 4;
  const medida = O.medirPorConteo({ ciclos: N, duracion: N * T }), camino = O.repetirCuartos(A, N * 4);
  ecuaciones([{ ecuacion: idea.regla.ecuacion }], { simbolos: { T: medida.T, f: medida.f, N: medida.ciclos, t: medida.marcas.at(-1), A, d: camino.distancia } }, {});
  const mitad = O.eventosCuartos(T, T / 4, T * 3 / 4);
  ecuaciones(idea.mira.pasos.slice(3), { simbolos: { T, A } }, { inicio: mitad[0].t, final: mitad.at(-1).t, N: O.medirPorConteo({ ciclos: 2, duracion: 2 * T }).marcas.length });
  assert.equal(O.repetirCuartos(A, 4).desplazamiento, 0);
  cerca(O.trayecto(A, T, 0, T / 2).desplazamiento, -2 * A, 'Medio ciclo cambia de extremo y no anula desplazamiento');
  assert.ok(O.mismoEstado(A, T, T / 4, T * 5 / 4));
  assert.ok(!O.mismoEstado(A, T, T / 4, T * 3 / 4));
  estadistica.sistemasRegla++;
});
verificar('Afirmaciones numéricas del glosario', () => {
  const g = Object.fromEntries(def.glosario.map(g => [g.termino, g]));
  const [izq, der, A] = numeros(g.amplitud.ejemplos[0]); cerca(O.amplitudDesdeExtremos(izq, der).A, A, 'Glosario extremos');
  const [amplitud, separacion] = numeros(g.amplitud.ejemplos[1]); cerca(O.repetirCuartos(amplitud, 2).distancia, separacion, 'Glosario separación');
  estadistica.afirmacionesGlosario = 2;
  if (g['período']) {
    const [dt, periodo] = numeros(g['período'].ejemplos[0]); assert.ok(/dos ciclos/.test(g['período'].ejemplos[0])); cerca(O.medirPorConteo({ ciclos: 2, duracion: dt }).T, periodo, 'Glosario período');
    const [T, total] = numeros(g['período'].ejemplos[1]); assert.ok(/dos ciclos/.test(g['período'].ejemplos[1])); assert.equal(O.retornosCompletos(T, 0, total).length, 2);
    estadistica.afirmacionesGlosario += 2;
  }
  if (g.frecuencia) {
    const [frecuencia] = numeros(g.frecuencia.ejemplos[0]); assert.ok(/Tres ciclos en un segundo/.test(g.frecuencia.ejemplos[0])); cerca(O.medirPorConteo({ ciclos: 3, duracion: 1 }).f, frecuencia, 'Glosario frecuencia');
    const [f, N, t] = numeros(g.frecuencia.ejemplos[1]); cerca(O.medirPorConteo({ ciclos: N, duracion: t }).f, f, 'Glosario frecuencia por conteo');
    estadistica.afirmacionesGlosario += 2;
  }
});
verificar('presupuesto y glosario', () => {
  limite(idea.actividad, 16, 'Actividad'); limite(idea.aprendizaje, 25, 'Aprendizaje'); limite(idea.juega.mision.texto, 16, 'Misión'); limite(idea.juega.mision.bien, 16, 'Misión bien');
  limite(idea.regla.texto, 60, 'Regla'); limite(idea.regla.condicion, 45, 'Condición');
  idea.lee.tarjetas.forEach(t => limite(t.texto, 60, 'Lee')); idea.juega.leyenda.forEach(l => limite(l.t, 8, 'Leyenda'));
  def.glosario.forEach(g => { limite(g.simple, 14, 'Glosario simple'); limite(g.def, 20, 'Glosario definición'); assert.ok(g.ejemplos.length >= 3); g.ejemplos.forEach(e => limite(e, 20, 'Glosario ejemplo')); });
  const antes = JSON.stringify([def.glosario, idea.lee, idea.juega.consigna, idea.juega.voz, idea.juega.mision, idea.juega.leyenda]); assert.ok(!/0[,.]5\s*s/.test(antes), 'Nada anterior entrega T0,5s de la predicción');
});

assert.deepEqual(errores, [], 'La auditoría independiente encontró fallos: ' + JSON.stringify(errores.slice(0, 12)));
assert.equal(estadistica.ejemplos, 15);
assert.equal(estadistica.resuelve, 400);
assert.equal(estadistica.ahoraTu, 400);
assert.equal(estadistica.estadosGrilla, 528);
assert.equal(estadistica.cuadrosAnimados, 400);
assert.equal(estadistica.sistemasRegla, 400);
assert.equal(estadistica.afirmacionesGlosario, 2);
assert.ok(estadistica.ecuaciones >= 5000, 'Se evaluaron todas las igualdades de los casos y las fórmulas generales.');
assert.ok(estadistica.figuras >= 1700, 'Se comprobaron casos fijos, generados y animados.');
});
