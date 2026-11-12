// Pruebas de nucleo/sesion.js contra el servidor falso (herramientas/servidor-falso.js), que cumple el contrato
// de docs/cuentas.md. Reloj y almacén inyectados: nada depende de la hora real ni del navegador.
const test = require('node:test');
const assert = require('node:assert/strict');
const Sesion = require('./sesion');
const Falso = require('../herramientas/servidor-falso');
const Medicion = require('./medicion');

class Almacen {
  constructor() { this.m = new Map(); }
  getItem(k) { return this.m.has(k) ? this.m.get(k) : null; }
  setItem(k, v) { this.m.set(k, String(v)); }
  removeItem(k) { this.m.delete(k); }
  get todo() { return [...this.m.values()].join('\n'); }
}
// Relojes falsos: los temporizadores se anotan y se disparan a mano.
function relojFalso() {
  const r = { timeouts: [], intervalos: [] };
  r.setTimeout = (fn, ms) => { const t = { fn, ms }; r.timeouts.push(t); return t; };
  r.clearTimeout = t => { r.timeouts = r.timeouts.filter(x => x !== t); };
  r.setInterval = (fn, ms) => { const t = { fn, ms }; r.intervalos.push(t); return t; };
  r.clearInterval = t => { r.intervalos = r.intervalos.filter(x => x !== t); };
  return r;
}

async function montar({ ttlAcceso } = {}) {
  const reloj = { t: Date.parse('2026-12-01T13:00:00Z') };
  const ahora = () => reloj.t;
  const f = Falso.crear({ ttlAcceso, ahora });
  const url = await f.escuchar(0);
  const alm = new Almacen();
  const red = { caida: false, cortarTras: Infinity, n: 0 };
  const fetchX = async (u, o) => {
    if (red.caida) throw new TypeError('Failed to fetch');
    if (red.n++ >= red.cortarTras) { red.caida = true; throw new TypeError('Failed to fetch'); }
    return fetch(u, o);
  };
  const timers = relojFalso();
  const s = Sesion.crear({ api: url, fetch: fetchX, almacen: alm, ahora, reloj: timers });
  return { f, s, alm, red, reloj, timers, cerrar: () => f.cerrar() };
}
const est = alm => JSON.parse(alm.getItem('lab-v1') || '{}');
// Eventos como los guarda la app: Medicion.guardar con el perfil del est actual.
const registrar = (alm, n, extra = {}) => { for (let i = 0; i < n; i++) Medicion.guardar({ tipo: 'prediccion', modulo: 'm', problema: 'p' + i, ...extra }, 'test', est(alm), alm); };

test('unirEst: contadores al máximo, pruebas que no se pisan, vistas y días unidos', () => {
  const s = { alumno: 'aS', nombre: 'Ana', uni: 'uni', vistas: { u1: '2026-11-02', u2: '2026-11-05' }, dias: ['2026-11-02'],
    practica: { m: { hechos: 5, aciertos: 2, entrada: { aciertos: 1, total: 3 } }, lv: { hechos: { t1: 1 }, textos: 1 } },
    pruebas: { fisica: { orden: 'AB', entrada: { aciertos: 4, total: 10, fecha: 'x' }, enCurso: { fase: 'salida', respuestas: [1] } } } };
  const c = { alumno: 'aC', nombre: '', uni: 'unmsm', grado: '5', vistas: { u1: '2026-11-01', u3: '2026-11-07' }, dias: ['2026-11-07', '2026-11-02'],
    practica: { m: { hechos: 3, aciertos: 3, nose: 1, entrada: { aciertos: 3, total: 3 }, salida: { aciertos: 2, total: 3 } }, lv: { hechos: { t1: 2, t2: 1 }, textos: 3 } },
    pruebas: { fisica: { orden: 'BA', entrada: { aciertos: 9, total: 10 }, enCurso: { fase: 'salida', respuestas: [1, 2, 3] } }, quimica: { enCurso: { fase: 'entrada', respuestas: [] } } } };
  const u = Sesion.unirEst(s, c);
  assert.equal(u.alumno, 'aS', 'el alumno lo pone el servidor');
  assert.equal(u.nombre, 'Ana', 'un nombre vacío del cliente no borra el del servidor');
  assert.equal(u.uni, 'unmsm'); assert.equal(u.grado, '5');
  assert.deepEqual(u.practica.m, { hechos: 5, aciertos: 3, nose: 1, entrada: { aciertos: 1, total: 3 }, salida: { aciertos: 2, total: 3 } });
  assert.deepEqual(u.practica.lv.hechos, { t1: 2, t2: 1 }); assert.equal(u.practica.lv.textos, 3);
  assert.equal(u.pruebas.fisica.orden, 'AB'); assert.equal(u.pruebas.fisica.entrada.aciertos, 4);
  assert.equal(u.pruebas.fisica.enCurso.respuestas.length, 3, 'enCurso en los dos: el de más respuestas');
  assert.ok(u.pruebas.quimica.enCurso, 'enCurso de un solo lado: ese');
  assert.deepEqual(u.vistas, { u1: '2026-11-01', u2: '2026-11-05', u3: '2026-11-07' });
  assert.deepEqual(u.dias, ['2026-11-02', '2026-11-07']);
  // Una prueba a medio hacer de una fase ya terminada no revive.
  const v = Sesion.unirEst({ pruebas: { f: { enCurso: { fase: 'entrada', respuestas: [1] } } } }, { pruebas: { f: { entrada: { aciertos: 1, total: 1 } } } });
  assert.equal(v.pruebas.f.enCurso, undefined);
});

test('aplicarEnSitio: no reemplaza los objetos que no cambian', () => {
  const ec = { fase: 'entrada', respuestas: [1] };
  const d = { pruebas: { f: { enCurso: ec, orden: 'AB' } }, vistas: {} };
  Sesion.aplicarEnSitio(d, { pruebas: { f: { enCurso: { fase: 'entrada', respuestas: [1] }, orden: 'AB', entrada: null } }, vistas: { u: 'x' } });
  assert.equal(d.pruebas.f.enCurso, ec);
  assert.equal(d.vistas.u, 'x');
});

test('login: guarda tokens y nunca la contraseña; credenciales y demasiados intentos', async () => {
  const m = await montar();
  try {
    await assert.rejects(m.s.login('qroman26', 'mal'), e => e.codigo === 'credenciales' && e.estado === 401 && /incorrect/.test(e.message));
    for (let i = 0; i < 4; i++) await m.s.login('qroman26', 'otra').catch(() => {});
    await assert.rejects(m.s.login('qroman26', 'abc234'), e => e.codigo === 'demasiados-intentos' && e.estado === 429);
    m.reloj.t += 11 * 60 * 1000;
    const u = await m.s.login('qroman26', 'abc234');
    assert.equal(u.rol, 'alumno'); assert.equal(u.debe_cambiar, true); assert.equal(m.s.usuario().usuario, 'qroman26');
    assert.ok(m.s.activa());
    assert.ok(!m.alm.todo.includes('abc234'), 'la contraseña no queda en el almacén');
    assert.equal(est(m.alm).alumno, m.f.datos.usuarios.qroman26.alumno, 'est.alumno es el seudónimo de la cuenta');
    assert.equal(est(m.alm).nombre, 'Ana Quispe Román', 'el nombre viene de la cuenta');
    assert.deepEqual(m.s.usuario().colegio, { id: 'c1', nombre: 'Colegio Piloto' });
    assert.equal(m.s.usuario().seccion.letra, 'A');
    // Con debe_cambiar, el servidor no deja leer el estado y la sesión no sincroniza.
    assert.ok(!m.f.datos.pedidos.some(p => p.ruta === '/api/estado'), 'el login no pide el estado');
    await assert.rejects(m.s.pedir('GET', '/api/estado'), e => e.codigo === 'debe-cambiar' && e.estado === 403);
    assert.equal((await m.s.sincronizar()).ok, false);
    assert.ok(!m.f.datos.pedidos.some(p => p.ruta === '/api/estado' && p.metodo === 'PUT'));
    await assert.rejects(m.s.cambiarContrasena('mala', 'otra-clave'), e => e.codigo === 'contrasena-actual');
    await assert.rejects(m.s.cambiarContrasena('abc234', 'abc234'), e => e.codigo === 'contrasena-igual');
    await m.s.cambiarContrasena('abc234', 'nueva-clave');
    assert.equal(m.s.usuario().debe_cambiar, false);
    assert.ok(m.f.datos.pedidos.some(p => p.ruta === '/api/estado' && p.metodo === 'GET'), 'al cambiarla, trae el estado');
    assert.equal(m.f.estadoDe('qroman26').alumno, m.f.datos.usuarios.qroman26.alumno);
    assert.ok(!m.alm.todo.includes('nueva-clave'));
  } finally { await m.cerrar(); }
});

test('renovación automática al recibir un 401, con rotación', async () => {
  const m = await montar({ ttlAcceso: 60000 });
  try {
    await m.s.login('lmamani26', 'xyz789');
    const r1 = JSON.parse(m.alm.getItem('lab-sesion-v1')).renovacion;
    // El servidor vence el acceso antes de lo que el cliente cree (reloj del servidor adelantado): 401 y renueva.
    for (const a of m.f.datos.acceso.values()) a.expira = 0;
    const g = await m.s.pedir('GET', '/api/estado');
    assert.ok(g.est);
    const r2 = JSON.parse(m.alm.getItem('lab-sesion-v1')).renovacion;
    assert.notEqual(r1, r2, 'la renovación rota');
    assert.equal(m.s.usuario().usuario, 'lmamani26', 'renovar no pierde el nombre de usuario');
    assert.equal(m.f.datos.pedidos.filter(p => p.ruta === '/api/renovar').length, 1);
    // Acceso vencido según el reloj del cliente: renueva antes de pedir, sin pasar por el 401.
    m.reloj.t += 61000;
    await m.s.pedir('GET', '/api/estado');
    assert.equal(m.f.datos.pedidos.filter(p => p.ruta === '/api/renovar').length, 2);
    // Reusar una renovación revocada revoca todas: la sesión vence, pero el estado y la cola se quedan.
    registrar(m.alm, 2);
    const s = JSON.parse(m.alm.getItem('lab-sesion-v1'));
    await fetch(m.f.url + '/api/renovar', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ renovacion: r1 }) });
    s.acceso = 'vencido'; m.alm.setItem('lab-sesion-v1', JSON.stringify(s));
    const avisos = []; m.s.alCambiar(i => avisos.push(i.estado));
    const r = await m.s.sincronizar();
    assert.equal(r.ok, false); assert.ok(m.s.vencida()); assert.ok(!m.s.activa());
    assert.ok(avisos.includes('vencida'));
    assert.equal(r.pendientes, 3, 'los 2 eventos y el est siguen pendientes');
    // Vuelve a entrar la misma cuenta: sigue con su estado y sube lo pendiente.
    await m.s.login('lmamani26', 'xyz789');
    assert.equal((await m.s.sincronizar()).ok, true);
    assert.equal(m.f.eventosDe('lmamani26').length, 2);
  } finally { await m.cerrar(); }
});

test('sincronizar: la cola sube en tandas de 500 y, si se corta, sigue sin perder ni duplicar', async () => {
  const m = await montar();
  try {
    await m.s.login('lmamani26', 'xyz789');
    registrar(m.alm, 1203);
    const ts = JSON.parse(m.alm.getItem('lab-medicion-v1')).map(e => e.t);
    assert.equal(new Set(ts).size, 1203, 't es único aunque caigan en el mismo milisegundo');
    assert.equal(m.s.pendientes(), 1204);
    // Se corta después de la primera tanda.
    m.red.n = 0; m.red.cortarTras = 1;
    const r = await m.s.sincronizar();
    assert.equal(r.ok, false); assert.equal(m.s.info().estado, 'sin-conexion');
    assert.equal(m.f.eventosDe('lmamani26').length, 500);
    assert.equal(m.s.pendientes(), 704);
    // Reintento con espera creciente.
    assert.equal(m.timers.timeouts.at(-1).ms, 2000);
    await m.s.sincronizar();
    assert.equal(m.timers.timeouts.at(-1).ms, 4000);
    m.red.caida = false; m.red.cortarTras = Infinity;
    await m.timers.timeouts.at(-1).fn();
    await m.s.sincronizar();
    assert.equal(m.f.eventosDe('lmamani26').length, 1203);
    assert.equal(m.s.pendientes(), 0); assert.equal(m.s.info().estado, 'guardado');
    const tandas = m.f.datos.pedidos.filter(p => p.ruta === '/api/eventos').length;
    assert.ok(tandas >= 3 && tandas <= 4, `${tandas} tandas`);
    // Reenviar la misma tanda no duplica.
    const ev = JSON.parse(m.alm.getItem('lab-medicion-v1')).slice(0, 10);
    const x = await m.s.pedir('POST', '/api/eventos', { eventos: ev });
    assert.deepEqual(x, { recibidos: 10, nuevos: 0 });
    // El servidor descarta los campos personales y pone el alumno de la cuenta.
    await m.s.pedir('POST', '/api/eventos', { eventos: [{ t: '2026-12-01T00:00:00.000Z', tipo: 'x', alumno: 'otro', nombre: 'Luis', dni: '1' }] });
    const e = m.f.eventosDe('lmamani26').find(z => z.tipo === 'x');
    assert.equal(e.nombre, undefined); assert.equal(e.dni, undefined);
  } finally { await m.cerrar(); }
});

test('sincronizar: est sube y baja unido, y trae las habilitaciones de la sección', async () => {
  const m = await montar();
  try {
    // En otro equipo, la misma alumna ya hizo la entrada de física.
    const otro = new Almacen();
    const s2 = Sesion.crear({ api: m.f.url, almacen: otro, reloj: relojFalso() });
    await s2.login('lmamani26', 'xyz789');
    const e2 = est(otro); e2.uni = 'uni'; e2.grado = '4'; e2.vistas = { 'fisica.mruv': '2026-11-20' }; e2.pruebas = { fisica: { orden: 'AB', entrada: { aciertos: 3, total: 10, fecha: '2026-11-20' } } };
    otro.setItem('lab-v1', JSON.stringify(e2));
    await s2.sincronizar();
    // El profesor abre la salida de física.
    const p = Sesion.crear({ api: m.f.url, almacen: new Almacen(), reloj: relojFalso() });
    await p.login('profe', 'profe123');
    await p.pedir('POST', '/api/secciones/s4a/habilitar', { curso: 'fisica', que: 'salida', abierto: true });
    // En este equipo: entra, practica y sincroniza.
    let aplicado = 0;
    const s = Sesion.crear({ api: m.f.url, almacen: m.alm, reloj: relojFalso(), alEstado: e => { aplicado++; m.alm.setItem('lab-v1', JSON.stringify(e)); } });
    await s.login('lmamani26', 'xyz789');
    const e = est(m.alm);
    assert.equal(e.pruebas.fisica.entrada.aciertos, 3, 'baja la entrada hecha en el otro equipo');
    assert.deepEqual(e.salidaHabilitada, ['fisica']);
    assert.ok(aplicado >= 1, 'la app recibe el est unido');
    e.vistas['quimica.gases'] = '2026-12-01'; e.pruebas.fisica.entrada = { aciertos: 10, total: 10 };
    m.alm.setItem('lab-v1', JSON.stringify(e));
    await s.sincronizar();
    const srv = m.f.estadoDe('lmamani26');
    assert.deepEqual(Object.keys(srv.vistas).sort(), ['fisica.mruv', 'quimica.gases']);
    assert.equal(srv.pruebas.fisica.entrada.aciertos, 3, 'la entrada del servidor no se pisa');
    assert.equal(est(m.alm).pruebas.fisica.entrada.aciertos, 3);
    // El profesor cierra la salida: al sincronizar, se cierra aquí también.
    await p.pedir('POST', '/api/secciones/s4a/habilitar', { curso: 'fisica', que: 'salida', abierto: false });
    await s.sincronizar();
    assert.deepEqual(est(m.alm).salidaHabilitada, []);
    // Sin cambios, no hay PUT.
    const puts = m.f.datos.pedidos.filter(x => x.metodo === 'PUT' && x.ruta === '/api/estado').length;
    await s.sincronizar();
    assert.equal(m.f.datos.pedidos.filter(x => x.metodo === 'PUT' && x.ruta === '/api/estado').length, puts);
  } finally { await m.cerrar(); }
});

test('arrancar: sincroniza al volver la señal, al pasar a segundo plano y cada 30 segundos', async () => {
  const m = await montar();
  try {
    await m.s.login('lmamani26', 'xyz789');
    const oy = {};
    const ventana = { addEventListener: (k, f) => { oy[k] = f; }, removeEventListener: k => { delete oy[k]; } };
    const doc = { visibilityState: 'visible', addEventListener: (k, f) => { oy['doc:' + k] = f; }, removeEventListener: k => { delete oy['doc:' + k]; } };
    m.red.caida = true;
    m.s.arrancar({ ventana, doc });
    assert.equal(m.timers.intervalos[0].ms, 30000);
    registrar(m.alm, 3);
    await m.s.sincronizar();
    assert.equal(m.s.pendientes(), 4);
    m.red.caida = false;
    oy.online(); await m.s.sincronizar();
    assert.equal(m.f.eventosDe('lmamani26').length, 3);
    registrar(m.alm, 1);
    doc.visibilityState = 'hidden'; oy['doc:visibilitychange'](); await m.s.sincronizar();
    assert.equal(m.f.eventosDe('lmamani26').length, 4);
    registrar(m.alm, 1);
    m.timers.intervalos[0].fn(); await m.s.sincronizar();
    assert.equal(m.f.eventosDe('lmamani26').length, 5);
    m.s.parar();
    assert.equal(m.timers.intervalos.length, 0); assert.equal(oy.online, undefined);
  } finally { await m.cerrar(); }
});

test('cerrar sesión en una PC compartida: sube, borra y no mezcla al siguiente alumno', async () => {
  const m = await montar();
  try {
    // Antes había alguien en modo demostración en esta PC.
    m.alm.setItem('lab-v1', JSON.stringify({ alumno: 'ademo', nombre: 'Demo', uni: 'uni', grado: '5', vistas: { 'x.y': '2026-11-01' } }));
    registrar(m.alm, 2);
    await m.s.login('lmamani26', 'xyz789');
    assert.equal(est(m.alm).vistas['x.y'], undefined, 'la cuenta no hereda el modo demostración');
    assert.equal(JSON.parse(m.alm.getItem('lab-medicion-v1')).length, 0);
    registrar(m.alm, 4);
    // Sin conexión: no cierra y avisa.
    m.red.caida = true;
    const r = await m.s.salir();
    assert.deepEqual([r.ok, r.pendientes], [false, 5]);
    assert.ok(m.s.activa(), 'no borró nada');
    // Con conexión: sube y borra.
    m.red.caida = false;
    assert.equal((await m.s.salir()).ok, true);
    assert.equal(m.f.eventosDe('lmamani26').length, 4);
    assert.ok(!m.s.activa());
    for (const k of ['lab-sesion-v1', 'lab-cuenta-v1', 'lab-subido-v1']) assert.equal(m.alm.getItem(k), null, k);
    assert.equal(est(m.alm).alumno, 'ademo', 'vuelve el modo demostración');
    assert.equal(JSON.parse(m.alm.getItem('lab-medicion-v1')).length, 2);
    assert.ok(m.f.datos.pedidos.some(p => p.ruta === '/api/salir'));
    // Entra otro alumno: empieza desde cero, sus eventos van con su seudónimo.
    await m.s.login('pcondori26', 'pqr456');
    assert.equal(est(m.alm).alumno, m.f.datos.usuarios.pcondori26.alumno);
    registrar(m.alm, 1);
    await m.s.sincronizar();
    assert.equal(m.f.eventosDe('pcondori26').length, 1);
    assert.equal(m.f.eventosDe('lmamani26').length, 4);
  } finally { await m.cerrar(); }
});

test('cerrar sesión forzada sin conexión: lo pendiente espera en la PC y sube cuando esa cuenta vuelve', async () => {
  const m = await montar();
  try {
    await m.s.login('lmamani26', 'xyz789');
    const e = est(m.alm); e.uni = 'uni'; e.grado = '4'; e.vistas = { 'a.b': '2026-12-01' }; m.alm.setItem('lab-v1', JSON.stringify(e));
    registrar(m.alm, 3);
    m.red.caida = true;
    assert.equal((await m.s.salir({ forzar: true })).ok, true);
    const pend = JSON.parse(m.alm.getItem('lab-pendiente-v1'));
    assert.equal(pend[m.f.datos.usuarios.lmamani26.alumno].eventos.length, 3);
    assert.equal(m.alm.getItem('lab-sesion-v1'), null);
    m.red.caida = false;
    // Otro alumno no recibe lo de Luis.
    await m.s.login('pcondori26', 'pqr456');
    assert.equal(JSON.parse(m.alm.getItem('lab-medicion-v1')).length, 0);
    assert.equal(est(m.alm).vistas['a.b'], undefined);
    await m.s.salir();
    // Luis vuelve: lo suyo sube.
    await m.s.login('lmamani26', 'xyz789');
    await m.s.sincronizar();
    assert.equal(m.f.eventosDe('lmamani26').length, 3);
    assert.equal(m.f.estadoDe('lmamani26').vistas['a.b'], '2026-12-01');
    assert.equal(m.alm.getItem('lab-pendiente-v1'), null);
  } finally { await m.cerrar(); }
});

test('profesor y administrador: secciones, avance, reinicio y carga de la lista', async () => {
  const m = await montar();
  try {
    const p = m.s;
    const u = await p.login('profe', 'profe123');
    assert.equal(u.rol, 'profesor');
    assert.equal(m.alm.getItem('lab-cuenta-v1'), null, 'el profesor no toca el estado de alumno');
    const sec = await p.pedir('GET', '/api/secciones');
    assert.deepEqual(sec.map(x => x.id), ['s4a', 's5b']);
    const av = await p.pedir('GET', '/api/secciones/s4a/avance');
    assert.equal(av.alumnos.length, 2);
    assert.ok(!JSON.stringify(av).includes('7000000'), 'el avance no trae el DNI');
    const r = await p.pedir('POST', '/api/alumnos/lmamani26/reiniciar');
    assert.equal(r.usuario, 'lmamani26'); assert.equal(r.contrasena.length, 6);
    await assert.rejects(p.pedir('GET', '/api/colegio/eventos'), e => e.estado === 403);
    await p.salir();
    await p.login('admin', 'admin123');
    const fd = new FormData();
    fd.append('archivo', new Blob(['apellidos,nombres,dni,grado,seccion\nRomán Quispe,Ana,70000001,4,A\nTito Huanca,Juana,70000009,3,C\nmal,,1,3,C\n'], { type: 'text/csv' }), 'lista.csv');
    const c = await p.pedir('POST', '/api/colegio/alumnos', fd);
    assert.equal(c.actualizados, 1); assert.equal(c.creados.length, 1); assert.equal(c.errores.length, 1);
    assert.equal(c.creados[0].usuario, 'jtito26');
    const fd2 = new FormData();
    fd2.append('archivo', new Blob(['apellidos,nombres,dni,grado,seccion\nSoto,Mia,70000010,3,C\n'], { type: 'text/csv' }), 'lista.csv');
    const pdf = await p.pedir('POST', '/api/colegio/alumnos?formato=pdf', fd2, { crudo: true });
    assert.equal(pdf.headers.get('content-type'), 'application/pdf');
    assert.ok((await pdf.text()).startsWith('%PDF'));
    assert.ok(Array.isArray(await p.pedir('GET', '/api/colegio/eventos')));
  } finally { await m.cerrar(); }
});
