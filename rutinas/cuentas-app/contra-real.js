// Prueba de humo de nucleo/sesion.js contra el servidor real (servidor/, FastAPI) corriendo en local.
// Uso: levantar el servidor (servidor/LEEME.md), crear un administrador de colegio y correr
//   API=http://127.0.0.1:8000 ADMIN=coord CLAVE=<la impresa> node rutinas/cuentas-app/contra-real.js
// Cambia la contraseña del administrador (a CLAVE2 o «nueva-clave-admin»), sube una lista y crea un profesor.
const assert = require('node:assert/strict');
const Sesion = require('../../nucleo/sesion');
const Medicion = require('../../nucleo/medicion');
const API = process.env.API || 'http://127.0.0.1:8000';
class Almacen { constructor() { this.m = new Map(); } getItem(k) { return this.m.has(k) ? this.m.get(k) : null; } setItem(k, v) { this.m.set(k, String(v)); } removeItem(k) { this.m.delete(k); } }
const reloj = { setTimeout: () => 0, clearTimeout() {}, setInterval: () => 0, clearInterval() {} };
const nueva = (alm = new Almacen()) => ({ alm, s: Sesion.crear({ api: API, almacen: alm, reloj }) });
const ok = (c, m) => { assert.ok(c, m); console.log('  ✓ ' + m); };
const est = alm => JSON.parse(alm.getItem('lab-v1') || '{}');

(async () => {
  const sufijo = String(Date.now()).slice(-6);
  // ---- Administrador ----
  const a = nueva();
  let u = await a.s.login(process.env.ADMIN || 'coord', process.env.CLAVE);
  if (u.debe_cambiar) await a.s.cambiarContrasena(process.env.CLAVE, process.env.CLAVE2 || 'nueva-clave-admin');
  ok(u.rol === 'admin' && typeof u.colegio === 'object', `admin entra (colegio ${u.colegio.nombre})`);
  const fd = new FormData();
  const dni = n => String(40000000 + Number(sufijo) * 10 + n).slice(0, 8);
  fd.append('archivo', new Blob([`apellidos,nombres,dni,grado,seccion\nPrueba Uno,Ana,${dni(1)},4,A\nPrueba Dos,Luis,${dni(2)},4,A\n`], { type: 'text/csv' }), 'lista.csv');
  const c = await a.s.pedir('POST', '/api/colegio/alumnos', fd);
  ok(c.creados.length === 2, `sube el CSV: ${c.creados.map(x => x.usuario).join(', ')}`);
  const secs = await a.s.pedir('GET', '/api/secciones');
  const sec = secs.find(x => x.grado == 4 && x.letra === 'A');
  const pr = await a.s.pedir('POST', '/api/colegio/profesores', { nombre: 'Profe Prueba', usuario: 'profe' + sufijo, secciones: [sec.id] });
  ok(pr.contrasena, `crea al profesor ${pr.usuario}`);
  const pdf = await a.s.pedir('POST', '/api/colegio/alumnos?formato=pdf', (() => { const f = new FormData(); f.append('archivo', new Blob([`apellidos,nombres,dni,grado,seccion\nPrueba Tres,Mia,${dni(3)},4,A\n`]), 'l.csv'); return f; })(), { crudo: true });
  ok(/pdf/.test(pdf.headers.get('content-type')), 'baja las tarjetas en PDF');

  // ---- Alumna: primer ingreso, contraseña, eventos y estado ----
  const al = nueva();
  const ana = c.creados[0];
  u = await al.s.login(ana.usuario, ana.contrasena);
  ok(u.debe_cambiar && u.seccion.letra === 'A' && u.usuario === ana.usuario, 'alumna entra con debe_cambiar y la sección como objeto');
  await assert.rejects(al.s.pedir('GET', '/api/estado'), e => e.codigo === 'debe-cambiar');
  await al.s.cambiarContrasena(ana.contrasena, 'gatito-' + sufijo);
  ok(est(al.alm).alumno === u.alumno, 'cambia la contraseña y trae su estado');
  const e = est(al.alm); e.uni = 'uni'; e.grado = '4'; e.vistas = { 'fisica.mruv': '2026-12-01' }; e.pruebas = { fisica: { orden: 'AB', entrada: { aciertos: 3, total: 10, fecha: '2026-12-01T10:00:00Z' } } };
  al.alm.setItem('lab-v1', JSON.stringify(e));
  for (let i = 0; i < 1203; i++) Medicion.guardar({ tipo: 'prediccion', modulo: 'm', problema: 'p' + i }, 'humo', est(al.alm), al.alm);
  let r = await al.s.sincronizar();
  ok(r.ok && r.pendientes === 0, 'sube 1203 eventos en tandas y el estado');
  r = await al.s.pedir('POST', '/api/eventos', { eventos: JSON.parse(al.alm.getItem('lab-medicion-v1')).slice(0, 5) });
  ok(r.nuevos === 0, 'reenviar no duplica');

  // ---- Profesor: abre la salida y ve el avance ----
  const p = nueva();
  u = await p.s.login(pr.usuario, pr.contrasena);
  if (u.debe_cambiar) await p.s.cambiarContrasena(pr.contrasena, 'profe-' + sufijo);
  await p.s.pedir('POST', `/api/secciones/${sec.id}/habilitar`, { curso: 'fisica', que: 'salida', abierto: true });
  const av = await p.s.pedir('GET', `/api/secciones/${sec.id}/avance`);
  const fa = av.alumnos.find(x => x.usuario === ana.usuario);
  ok(fa && fa.pruebas.fisica.entrada.aciertos === 3 && fa.unidades_vistas === 1, 'el avance trae la entrada de Ana');
  ok(av.habilitaciones.some(h => h.curso === 'fisica' && h.que === 'salida' && h.abierto), 'y la salida abierta');
  const re = await p.s.pedir('POST', `/api/alumnos/${ana.usuario}/reiniciar`);
  ok(re.contrasena, 'reinicia la contraseña de Ana');

  // ---- Ana: su sesión venció por el reinicio; vuelve a entrar y ve la salida ----
  Medicion.guardar({ tipo: 'prediccion', modulo: 'm', problema: 'despues' }, 'humo', est(al.alm), al.alm);
  r = await al.s.sincronizar();
  // Con el acceso aún vigente, el servidor responde 403 debe-cambiar; si ya venció, la renovación revocada da sesión vencida.
  ok(!r.ok && (al.s.vencida() || al.s.usuario().debe_cambiar) && al.s.pendientes() > 0, 'tras el reinicio, Ana no sincroniza y lo pendiente se queda');
  u = await al.s.login(ana.usuario, re.contrasena);
  await al.s.cambiarContrasena(re.contrasena, 'otra-' + sufijo);
  ok(est(al.alm).salidaHabilitada.includes('fisica') && est(al.alm).pruebas.fisica.entrada.aciertos === 3, 'Ana vuelve: su avance y la salida abierta');
  ok(al.s.pendientes() === 0, 'y lo que quedó pendiente subió');
  ok((await al.s.salir()).ok && !al.s.activa(), 'cierra sesión');
  const ev = await a.s.pedir('GET', '/api/colegio/eventos');
  ok(ev.filter(x => x.alumno === u.alumno).length === 1204, 'el administrador baja los 1204 eventos de Ana');
  console.log('\nTodo bien contra el servidor real.');
})().catch(e => { console.error(e); process.exit(1); });
