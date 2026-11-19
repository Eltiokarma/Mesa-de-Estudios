const test = require('node:test');
const assert = require('node:assert/strict');
const A = require('./avance.js');

const U = { id: 'fisica.mru', teoria: { ideas: 2 } };
const base = () => ({ alumno: 'a1', vistas: {}, marcadas: {}, teoria: {}, examenes: {}, repaso: {} });

test('avance: abrir una unidad es visita, no estudio', () => {
  const est = base(); est.vistas[U.id] = '2026-11-14';
  const r = A.nivel(est, U, A.indice([], 'a1'));
  assert.equal(r.nivel, 0); assert.equal(r.nombre, 'Visitada');
  assert.equal(A.estudiadas(est, [U], {}), 0);
});

test('avance: sin nada, «sin empezar»', () => {
  assert.equal(A.nivel(base(), U, {}).nivel, -1);
});

test('avance: la estudié con la teoría completa o marcándola', () => {
  const est = base();
  est.teoria[U.id] = { ideas: { a: { hecha: true } } };
  assert.equal(A.nivel(est, U, {}).nivel, 0, 'una de dos ideas no basta');
  est.teoria[U.id].ideas.b = { hecha: true };
  assert.equal(A.nivel(est, U, {}).nivel, 1);
  const e2 = base(); e2.marcadas[U.id] = '2026-11-14';
  assert.equal(A.nivel(e2, U, {}).nivel, 1);
});

test('avance: con ayuda cuenta aciertos con retroalimentación del mismo alumno', () => {
  const ev = [
    { alumno: 'a1', unidad: U.id, tipo: 'prediccion', correcta: true },
    { alumno: 'a1', unidad: U.id, tipo: 'teoria', momento: 'ahora-tu', correcta: true },
    { alumno: 'otro', unidad: U.id, tipo: 'prediccion', correcta: true },
    { alumno: 'a1', unidad: U.id, tipo: 'prediccion', correcta: false },
  ];
  assert.equal(A.nivel(base(), U, A.indice(ev, 'a1')).nivel, 0, 'dos aciertos propios no bastan');
  ev.push({ alumno: 'a1', unidad: U.id, tipo: 'previo', correcta: true });
  assert.equal(A.nivel(base(), U, A.indice(ev, 'a1')).nivel, 2);
});

test('avance: sin ayuda con 4 de 5 en el simulacro, y la recuerdo con el repaso otro día', () => {
  const est = base();
  est.examenes[U.id] = { ultimo: { aciertos: 3, total: 5 } };
  assert.equal(A.nivel(est, U, {}).nivel, 0);
  est.examenes[U.id].ultimo.aciertos = 4;
  assert.equal(A.nivel(est, U, {}).nivel, 3);
  est.repaso[U.id] = { desde: '2026-11-10', ultimo: '2026-11-10', aciertos: 1 };
  assert.equal(A.nivel(est, U, {}).nivel, 3, 'el mismo día no es recordar');
  est.repaso[U.id].ultimo = '2026-11-14';
  assert.equal(A.nivel(est, U, {}).nivel, 4);
  assert.equal(A.nivel(est, U, {}).falta, '');
});

test('avance: migrar deja las visitas, crea marcadas y se hace una sola vez', () => {
  const est = { vistas: { x: '2026-11-01' } };
  assert.equal(A.migrar(est), true);
  assert.deepEqual(est.vistas, { x: '2026-11-01' });
  assert.deepEqual(est.marcadas, {});
  assert.equal(A.migrar(est), false);
});

test('al partir «Magnitudes y vectores», el avance de los vectores pasa a fisica.vectores', () => {
  const est = { avanceV: 1, vistas: { 'fisica.magnitudes-y-vectores': '2026-11-10' }, marcadas: { 'fisica.magnitudes-y-vectores': '2026-11-11' },
    teoria: { 'fisica.magnitudes-y-vectores': { idea: 'resultante', ideas: { unidades: { hecha: true }, resultante: { hecha: true }, componentes: { casos: 2 } } } },
    coleccion: [{ id: 'c1', unidad: 'fisica.magnitudes-y-vectores', mesa: 'suma-libre' }, { id: 'c2', unidad: 'fisica.magnitudes-y-vectores', mesa: 'otra' }] };
  assert.equal(A.migrar(est), true);
  assert.deepEqual(Object.keys(est.teoria['fisica.magnitudes-y-vectores'].ideas), ['unidades']);
  assert.deepEqual(est.teoria['fisica.vectores'].ideas, { resultante: { hecha: true }, componentes: { casos: 2 } });
  assert.equal(est.teoria['fisica.vectores'].idea, 'resultante');
  assert.equal(est.coleccion[0].unidad, 'fisica.vectores');
  assert.equal(est.coleccion[1].unidad, 'fisica.magnitudes-y-vectores');
  assert.equal(est.vistas['fisica.vectores'], '2026-11-10');
  assert.equal(est.marcadas['fisica.vectores'], '2026-11-11', '«Ya la estudié» incluía los vectores');
  assert.equal(A.migrar(est), false, 'la segunda vez no cambia nada');
});

test('al partir «Exponentes, radicales y productos notables», el avance de los productos pasa a algebra.productos-notables', () => {
  const V = 'algebra.exponentes-y-productos-notables', N = 'algebra.productos-notables';
  const est = { avanceV: 1, partidoV: 1, vistas: { [V]: '2026-11-12' }, marcadas: { [V]: '2026-11-13' },
    teoria: { [V]: { idea: 'racionalizar', ideas: { 'leyes-exponentes': { hecha: true }, radicales: { casos: 3 }, 'cuadrado-suma': { hecha: true }, racionalizar: { casos: 1 } } } },
    coleccion: [{ id: 'c1', unidad: V, mesa: 'cubo-se-abre' }, { id: 'c2', unidad: V, mesa: 'rectangulo-x-p-q' }, { id: 'c3', unidad: V, mesa: 'exponentes-con-signo' }],
    glosario: { [V]: { potencia: 'sabe', conjugado: 'repasa', 'producto notable': 'sabe' } } };
  assert.equal(A.migrar(est), true);
  assert.deepEqual(Object.keys(est.teoria[V].ideas).sort(), ['leyes-exponentes', 'radicales']);
  assert.deepEqual(est.teoria[N].ideas, { 'cuadrado-suma': { hecha: true }, racionalizar: { casos: 1 } });
  assert.equal(est.teoria[N].idea, 'racionalizar', 'la idea en curso se va con su unidad');
  assert.equal(est.teoria[V].idea, undefined);
  assert.deepEqual(est.coleccion.map(c => c.unidad), [N, N, V], 'las mesas del cubo y del rectángulo se van; la de exponentes se queda');
  assert.deepEqual(est.glosario[V], { potencia: 'sabe' });
  assert.deepEqual(est.glosario[N], { conjugado: 'repasa', 'producto notable': 'sabe' });
  assert.equal(est.vistas[N], '2026-11-12');
  assert.equal(est.marcadas[N], '2026-11-13', '«Ya la estudié» incluía los productos notables');
  assert.equal(A.migrar(est), false, 'la segunda vez no cambia nada');
  // Quien nunca abrió la unidad: solo queda la marca.
  const nuevo = { avanceV: 1, partidoV: 1 };
  assert.equal(A.migrar(nuevo), true);
  assert.equal(nuevo.partidoExp, 1);
  assert.equal(nuevo.teoria, undefined);
});

test('al partir «MRU, MRUV y caída libre», el avance del MRUV y la caída libre pasa a fisica.mruv-y-caida-libre', () => {
  const V = 'fisica.movimiento-rectilineo', N = 'fisica.mruv-y-caida-libre';
  const est = { avanceV: 1, partidoV: 1, partidoExp: 1, vistas: { [V]: '2026-11-12' }, marcadas: { [V]: '2026-11-13' },
    teoria: { [V]: { idea: 'caida-libre', ideas: { mru: { hecha: true }, 'desplazamiento-distancia': { casos: 2 }, encuentro: { casos: 1 },
      'pendiente-aceleracion': { hecha: true, prediccion: 'c' }, 'caida-libre': { casos: 3 } } } },
    coleccion: [{ id: 'c1', unidad: V, mesa: 'pista-libre' }, { id: 'c2', unidad: V, mesa: 'ida-vuelta' }, { id: 'c3', unidad: V, mesa: 'recta-vt' },
      { id: 'c4', unidad: V, mesa: 'encuentro-libre' }],
    glosario: { [V]: { posicion: 'sabe', aceleracion: 'repasa', 'caida libre': 'sabe', gravedad: 'sabe', 'velocidad relativa': 'repasa' } } };
  assert.equal(A.migrar(est), true);
  assert.deepEqual(Object.keys(est.teoria[V].ideas).sort(), ['desplazamiento-distancia', 'encuentro', 'mru']);
  // La predicción vieja de pendiente-aceleracion (sin huella) se borra: la idea cambió de Predice (marca reinicioVT).
  assert.deepEqual(est.teoria[N].ideas, { 'pendiente-aceleracion': { hecha: true }, 'caida-libre': { casos: 3 } });
  assert.equal(est.teoria[N].idea, 'caida-libre', 'la idea en curso se va con su unidad');
  assert.equal(est.teoria[V].idea, undefined);
  assert.deepEqual(est.coleccion.map(c => c.unidad), [N, N, N, V], 'la pista, la ida y vuelta en v–t y la recta v–t se van; el encuentro se queda');
  assert.deepEqual(est.glosario[V], { posicion: 'sabe', 'velocidad relativa': 'repasa' });
  assert.deepEqual(est.glosario[N], { aceleracion: 'repasa', 'caida libre': 'sabe', gravedad: 'sabe' });
  assert.equal(est.vistas[N], '2026-11-12');
  assert.equal(est.marcadas[N], '2026-11-13', '«Ya la estudié» incluía el MRUV y la caída libre');
  assert.equal(A.migrar(est), false, 'la segunda vez no cambia nada');
  // Quien nunca abrió la unidad: solo queda la marca.
  const nuevo = { avanceV: 1, partidoV: 1, partidoExp: 1 };
  assert.equal(A.migrar(nuevo), true);
  assert.equal(nuevo.partidoMRU, 1);
  assert.equal(nuevo.teoria, undefined);
});

test('MRU: las predicciones guardadas sin huella de las ideas rehechas se borran una vez (marca prediccionMRU)', () => {
  const V = 'fisica.movimiento-rectilineo';
  // Quien entró ayer: partidoMRU ya corrió. Sus predicciones de mru y encuentro son de antes de la huella (sin
  // prediccionDe): pudo responder la pregunta vieja. La de desplazamiento-distancia ya trae huella: la revisa la app.
  const est = { avanceV: 1, partidoV: 1, partidoExp: 1, partidoMRU: 1, mudadoSum: 1,
    teoria: { [V]: { idea: 'encuentro', ideas: {
      mru: { hecha: true, prediccion: 'c', momento: 'regla' },
      'desplazamiento-distancia': { prediccion: 'promedio', prediccionDe: 'abc123', casos: 2 },
      encuentro: { prediccion: 'resta', casos: 1 },
      'grafica-xt': { prediccion: 'c' } } } } };
  assert.equal(A.migrar(est), true);
  assert.equal(est.prediccionMRU, 1);
  const ideas = est.teoria[V].ideas;
  assert.deepEqual(ideas.mru, { hecha: true, momento: 'regla' }, 'se borra aunque fuera la «c»: la pregunta cambió');
  assert.deepEqual(ideas.encuentro, { casos: 1 }, 'una opción que ya no existe, también');
  assert.deepEqual(ideas['desplazamiento-distancia'], { prediccion: 'promedio', prediccionDe: 'abc123', casos: 2 }, 'con huella: la app decide');
  assert.deepEqual(ideas['grafica-xt'], { prediccion: 'c' }, 'una idea nueva no se toca');
  assert.equal(est.teoria[V].idea, 'encuentro');
  // Una sola vez: lo que responda después, sin huella o con ella, se queda.
  ideas.mru.prediccion = 'c';
  assert.equal(A.migrar(est), false);
  assert.equal(ideas.mru.prediccion, 'c');
  // Quien nunca abrió la unidad: solo quedan las marcas. Quien llega de antes de la partición: las dos corren juntas.
  const nuevo = { avanceV: 1, partidoV: 1, partidoExp: 1, partidoMRU: 1, mudadoSum: 1 };
  assert.equal(A.migrar(nuevo), true);
  assert.equal(nuevo.prediccionMRU, 1);
  assert.equal(nuevo.teoria, undefined);
  const viejo = { avanceV: 1, partidoV: 1, partidoExp: 1, teoria: { [V]: { ideas: { mru: { prediccion: 'suma' }, 'caida-libre': { prediccion: 'c' } } } } };
  assert.equal(A.migrar(viejo), true);
  assert.deepEqual(viejo.teoria[V].ideas, { mru: {} });
  assert.deepEqual(viejo.teoria['fisica.mruv-y-caida-libre'].ideas, { 'caida-libre': { prediccion: 'c' } }, 'lo que se fue no se toca');
});

test('al mudar las sumatorias a «Sucesiones y series», su idea y su mesa pasan allá; la visita y «Ya la estudié» no', () => {
  const V = 'aritmetica.cuatro-operaciones', N = 'aritmetica.sucesiones-y-series';
  const est = { avanceV: 1, partidoV: 1, partidoExp: 1, partidoMRU: 1, vistas: { [V]: '2026-11-12' }, marcadas: { [V]: '2026-11-13' },
    teoria: { [V]: { idea: 'sumatorias', ideas: { 'otras-bases': { hecha: true, prediccion: 'c' }, complemento: { casos: 2, prediccion: 'nueves' }, 'defecto-exceso': { prediccion: 'igual' }, sumatorias: { hecha: true, prediccion: 'sin-mitad', momento: 'regla' } } } },
    coleccion: [{ id: 'c1', unidad: V, mesa: 'escaleras-a-z' }, { id: 'c2', unidad: V, mesa: 'restos-grandes' }],
    glosario: { [V]: { sumatoria: 'sabe', sumandos: 'repasa', llevada: 'sabe' } } };
  assert.equal(A.migrar(est), true);
  assert.deepEqual(Object.keys(est.teoria[V].ideas).sort(), ['complemento', 'defecto-exceso', 'otras-bases']);
  // El complemento se rehízo con otras opciones: una predicción con una opción que ya no existe se borra; una que existe
  // (la de la división, ya hecha con la versión nueva) y la de la llevada (la misma pregunta) se quedan.
  assert.deepEqual(est.teoria[V].ideas.complemento, { casos: 2 });
  assert.equal(est.teoria[V].ideas['defecto-exceso'].prediccion, 'igual');
  assert.equal(est.teoria[V].ideas['otras-bases'].prediccion, 'c');
  // La idea cambia de nombre y no lleva su predicción (era otra pregunta): las opciones de allá son otras.
  assert.deepEqual(est.teoria[N].ideas, { 'suma-rectangulo': { hecha: true, momento: 'regla' } });
  assert.equal(est.teoria[N].idea, 'suma-rectangulo', 'la idea en curso se va con su unidad');
  assert.equal(est.teoria[V].idea, undefined);
  assert.deepEqual(est.coleccion.map(c => c.unidad), [N, V], 'la mesa de las escaleras se va; la de los restos se queda');
  assert.deepEqual(est.glosario[V], { sumandos: 'repasa', llevada: 'sabe' });
  assert.deepEqual(est.glosario[N], { sumatoria: 'sabe' });
  assert.equal(est.vistas[N], undefined, 'abrir Las cuatro operaciones no es visitar Sucesiones');
  assert.equal(est.marcadas[N], undefined, '«Ya la estudié» de Las cuatro operaciones no vale para Sucesiones');
  assert.equal(A.migrar(est), false, 'la segunda vez no cambia nada');
  // Quien ya iba por Sucesiones: lo suyo se queda (la idea, su predicción y la idea en curso).
  const ya = { avanceV: 1, partidoV: 1, partidoExp: 1, partidoMRU: 1,
    teoria: { [V]: { idea: 'sumatorias', ideas: { sumatorias: { hecha: true, prediccion: 'c' } } }, [N]: { idea: 'progresion-geometrica', ideas: { 'suma-rectangulo': { casos: 1, prediccion: 'entero' } } } } };
  assert.equal(A.migrar(ya), true);
  assert.deepEqual(ya.teoria[N].ideas, { 'suma-rectangulo': { casos: 1, prediccion: 'entero' } });
  assert.equal(ya.teoria[N].idea, 'progresion-geometrica');
  assert.deepEqual(ya.teoria[V].ideas, {});
  // Quien nunca abrió la unidad: solo queda la marca.
  const nuevo = { avanceV: 1, partidoV: 1, partidoExp: 1, partidoMRU: 1 };
  assert.equal(A.migrar(nuevo), true);
  assert.equal(nuevo.mudadoSum, 1);
  assert.equal(nuevo.teoria, undefined);
});

// Auditoría de Las cuatro operaciones, B9: quien había terminado las 6 ideas de antes no pierde «La estudié» al pasar a
// 7 ideas (sumatorias se fue; prestamo y cifras-ocultas son nuevas), ni se le cierran las unidades que la piden.
test('mudanza de las sumatorias: quien terminó las 6 ideas viejas conserva la visita y «La estudié»; las nuevas quedan por hacer', () => {
  const V = 'aritmetica.cuatro-operaciones', N = 'aritmetica.sucesiones-y-series';
  const CO = { id: V, teoria: { ideas: 7 } };
  const VIEJAS = ['otras-bases', 'sumatorias', 'complemento', 'multiplicar-partes', 'defecto-exceso', 'cifras-producto'];
  const hechas = ids => Object.fromEntries(ids.map(id => [id, { hecha: true }]));
  const antes = () => ({ avanceV: 1, partidoV: 1, partidoExp: 1, partidoMRU: 1, prediccionMRU: 1, vistas: { [V]: '2026-11-10' }, marcadas: {},
    teoria: { [V]: { ideas: hechas(VIEJAS) } } });
  // Antes de la mudanza: la tenía estudiada (6 de 6).
  const e0 = antes();
  assert.ok(A.teoriaCompleta(e0, { id: V, teoria: { ideas: 6 } }));
  assert.equal(A.migrar(e0), true);
  assert.deepEqual(Object.keys(e0.teoria[V].ideas).sort(), ['cifras-producto', 'complemento', 'defecto-exceso', 'multiplicar-partes', 'otras-bases']);
  assert.equal(A.teoriaCompleta(e0, CO), false, 'las dos ideas nuevas quedan por hacer');
  assert.equal(e0.marcadas[V], '2026-11-10', '«La estudié», con la fecha de su visita');
  assert.equal(e0.vistas[V], '2026-11-10', 'la visita se queda');
  assert.equal(A.nivel(e0, CO, {}).nivel, 1, 'sigue en «La estudié»: lo que la pide no se cierra');
  assert.equal(e0.marcadas[N], undefined, 'no vale para Sucesiones');
  assert.equal(A.migrar(e0), false, 'una sola vez');
  // Quien ya había migrado con la versión de antes (mudadoSum sin estudiadaSum): la sumatoria está allá, con su nombre nuevo.
  const e1 = { avanceV: 1, partidoV: 1, partidoExp: 1, partidoMRU: 1, prediccionMRU: 1, mudadoSum: 1, vistas: {}, marcadas: {},
    teoria: { [V]: { ideas: hechas(VIEJAS.filter(x => x !== 'sumatorias')) }, [N]: { ideas: { 'suma-rectangulo': { hecha: true } } } } };
  assert.equal(A.migrar(e1), true);
  assert.equal(e1.marcadas[V], '2026-11-18');
  assert.equal(A.nivel(e1, CO, {}).nivel, 1);
  // A quien le faltaba una idea vieja no se le marca nada: no la tenía estudiada.
  const e2 = antes(); delete e2.teoria[V].ideas.complemento;
  A.migrar(e2);
  assert.equal(e2.marcadas[V], undefined);
  assert.equal(A.nivel(e2, CO, {}).nivel, 0, 'sigue visitada');
  // Si ya la había marcado él mismo, su fecha se queda.
  const e3 = antes(); e3.marcadas[V] = '2026-11-12';
  A.migrar(e3);
  assert.equal(e3.marcadas[V], '2026-11-12');
});

test('migrar: la predicción vieja de pendiente-aceleracion (sin huella) se borra una sola vez', () => {
  const U = 'fisica.mruv-y-caida-libre';
  const est = { avanceV: 1, partidoV: 1, partidoExp: 1, partidoMRU: 1, prediccionMRU: 1, mudadoSum: 1, estudiadaSum: 1,
    teoria: { [U]: { ideas: { 'pendiente-aceleracion': { prediccion: 'c', hecha: true }, 'caida-libre': { prediccion: 'c' } } } } };
  assert.equal(A.migrar(est), true);
  assert.equal(est.teoria[U].ideas['pendiente-aceleracion'].prediccion, undefined);
  assert.equal(est.teoria[U].ideas['pendiente-aceleracion'].hecha, true);
  assert.equal(est.teoria[U].ideas['caida-libre'].prediccion, 'c', 'caida-libre no cambió de pregunta');
  est.teoria[U].ideas['pendiente-aceleracion'] = { prediccion: 'c', prediccionDe: 'x1' };
  assert.equal(A.migrar(est), false);
  assert.equal(est.teoria[U].ideas['pendiente-aceleracion'].prediccion, 'c', 'la respuesta nueva, con huella, se queda');
});

// 19 nov (etapa 5, docs/etapa5/propuesta-quimica.md): «Tabla periódica» se parte. Radio, ionización y
// electronegatividad, las dos mesas y sus palabras pasan a quimica.propiedades-periodicas (partidoTP).
test('Tabla periódica partida: las ideas de propiedades, las mesas y sus palabras pasan a Propiedades periódicas', () => {
  const V = 'quimica.tabla-periodica', N = 'quimica.propiedades-periodicas';
  const est = { avanceV: 1, vistas: { [V]: '2026-11-12' }, marcadas: {},
    teoria: { [V]: { idea: 'energia-ionizacion', ideas: {
      'periodos-grupos-bloques': { hecha: true, prediccion: 'masa' },
      'ubicacion-lewis': { hecha: true, prediccion: 'c', prediccionDe: 'h1' },
      'radio-atomico-ionico': { hecha: true, prediccion: 'c' },
      'energia-ionizacion': { prediccion: 'o', casos: 2 } } } },
    coleccion: [{ unidad: V, mesa: 'tres-propiedades', valores: { z: 11 } }, { unidad: V, mesa: 'otra' }],
    glosario: { [V]: { 'radio atomico': 'sabe', periodo: 'repasa' } } };
  assert.equal(A.migrar(est), true);
  assert.equal(est.partidoTP, 1); assert.equal(est.prediccionTP, 1); assert.equal(est.estudiadaTP, 1);
  // La idea 1 conserva su id con otra pregunta: su predicción sin huella se borra; la de la idea 2 (con huella) se queda.
  assert.deepEqual(est.teoria[V].ideas, { 'periodos-grupos-bloques': { hecha: true }, 'ubicacion-lewis': { hecha: true, prediccion: 'c', prediccionDe: 'h1' } });
  assert.equal(est.teoria[V].idea, undefined);
  // Lo que se fue no se toca, salvo la predicción sin huella de `energia-ionizacion`, que cambió de pregunta en la fase 3
  // (del N y el O al P y el S): se borra una vez (prediccionTP2). La del radio (misma pregunta, mismos ids) se queda.
  assert.deepEqual(est.teoria[N].ideas, { 'radio-atomico-ionico': { hecha: true, prediccion: 'c' }, 'energia-ionizacion': { casos: 2 } });
  assert.equal(est.prediccionTP2, 1);
  assert.equal(est.teoria[N].idea, 'energia-ionizacion');
  assert.deepEqual(est.coleccion.map(c => c.unidad), [N, V]);
  assert.deepEqual(est.glosario, { [V]: { periodo: 'repasa' }, [N]: { 'radio atomico': 'sabe' } });
  assert.equal(est.vistas[N], '2026-11-12');
  assert.equal(est.marcadas[V], undefined, 'no había terminado las cinco ideas de antes');
  assert.equal(A.migrar(est), false, 'la segunda vez no cambia nada');
  // Quien había terminado las cinco ideas de antes conserva «Ya la estudié» en las dos unidades (estudiadaTP).
  const hecho = { avanceV: 1, vistas: { [V]: '2026-11-10' }, marcadas: {},
    teoria: { [V]: { ideas: Object.fromEntries(['periodos-grupos-bloques', 'ubicacion-lewis', 'radio-atomico-ionico', 'energia-ionizacion', 'electronegatividad'].map(i => [i, { hecha: true }])) } } };
  assert.equal(A.migrar(hecho), true);
  assert.equal(hecho.marcadas[V], '2026-11-10');
  assert.equal(hecho.marcadas[N], '2026-11-10');
  assert.deepEqual(Object.keys(hecho.teoria[N].ideas), ['radio-atomico-ionico', 'energia-ionizacion', 'electronegatividad']);
  // Quien nunca abrió la unidad: solo quedan las marcas.
  const nuevo = { avanceV: 1 };
  A.migrar(nuevo);
  assert.equal(nuevo.partidoTP, 1);
  assert.equal((nuevo.teoria || {})[N], undefined);
});
