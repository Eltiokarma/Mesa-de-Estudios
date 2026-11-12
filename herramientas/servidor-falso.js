// Servidor falso de cuentas: cumple el «Contrato de la API» de docs/cuentas.md, todo en memoria y sin dependencias,
// con los «Detalles que el contrato no fijaba» del servidor real (servidor/LEEME.md): colegio y sección como objetos,
// 403 debe-cambiar, 401 token-vencido, estado con habilitaciones y la forma del avance.
// Sirve para probar la app con cuentas (nucleo/sesion.test.js y las pruebas de Playwright) mientras el servidor
// de verdad (servidor/, FastAPI) se construye aparte. No es para producción: guarda contraseñas en claro y olvida todo
// al cerrarse.
//
//   node herramientas/servidor-falso.js            → http://127.0.0.1:4180 (PORT=… para otro puerto)
//   y en la app, app/config.js con window.MESA_API = 'http://127.0.0.1:4180'
//
// Cuentas de ejemplo (sembrar()):
//   qroman26 / abc234    alumna de 4.º A, debe cambiar la contraseña
//   lmamani26 / xyz789   alumno de 4.º A
//   pcondori26 / pqr456  alumno de 5.º B
//   profe / profe123     profesor de 4.º A y 5.º B
//   admin / admin123     administrador del colegio
// Desde Node: const { crear } = require('./servidor-falso'); const f = crear({ ttlAcceso: 1000 }); await f.escuchar(0).
'use strict';
const http = require('node:http');
const crypto = require('node:crypto');
const { unirEst } = require('../nucleo/sesion');

const LETRAS = 'abcdefghjkmnpqrstuvwxyz23456789'; // sin 0/O ni 1/l/i
const azar = n => Array.from(crypto.randomBytes(n), b => LETRAS[b % LETRAS.length]).join('');
const token = () => crypto.randomBytes(24).toString('hex');
const hash = t => crypto.createHash('sha256').update(t).digest('hex');
const PERSONALES = ['nombre', 'dni', 'usuario', 'apellidos', 'nombres', 'contrasena', 'correo', 'telefono'];

function crear({ ttlAcceso = 15 * 60 * 1000, ttlRenovacion = 30 * 864e5, ahora = () => Date.now(), sembrar: conSemilla = true } = {}) {
  const d = {
    colegio: { id: 'c1', nombre: 'Colegio Piloto' },
    secciones: {},        // id → { id, grado, letra }
    usuarios: {},         // usuario → { usuario, contrasena, rol, nombre, debe_cambiar, alumno?, seccion?, secciones?, dni? }
    estados: {},          // alumno → { est, actualizado }
    eventos: new Map(),   // alumno|t → evento
    habilitaciones: {},   // seccion → { salida: Set, soluciones: Set }
    acceso: new Map(),    // token → { usuario, expira }
    renov: new Map(),     // hash → { usuario, expira, revocada }
    fallos: [],           // { usuario, ip, t }
    pedidos: [],          // registro para las pruebas: { metodo, ruta }
  };
  const f = { datos: d, fallarProximos: 0, caido: false };

  const seccion = (grado, letra) => {
    const id = `s${grado}${String(letra).toLowerCase()}`;
    if (!d.secciones[id]) { d.secciones[id] = { id, grado: String(grado), letra: String(letra).toUpperCase() }; d.habilitaciones[id] = { salida: new Set(), soluciones: new Set() }; }
    return id;
  };
  const nuevoUsuario = (nombres, apellidos) => {
    const base = (String(nombres).trim()[0] + String(apellidos).trim().split(/\s+/)[0]).normalize('NFD').replace(/[^a-zA-Z]/g, '').toLowerCase()
      + String(new Date(ahora()).getFullYear()).slice(-2);
    let u = base, k = 2;
    while (d.usuarios[u]) u = base + k++;
    return u;
  };
  const alumno = (usuario, contrasena, nombre, sec, extra = {}) => {
    d.usuarios[usuario] = { usuario, contrasena, rol: 'alumno', nombre, debe_cambiar: true, alumno: 'a' + crypto.randomBytes(5).toString('hex'), seccion: sec, ...extra };
    return d.usuarios[usuario];
  };
  f.sembrar = () => {
    const a = seccion(4, 'A'), b = seccion(5, 'B');
    alumno('qroman26', 'abc234', 'Ana Quispe Román', a, { dni: '70000001' });
    alumno('lmamani26', 'xyz789', 'Luis Mamani', a, { dni: '70000002', debe_cambiar: false });
    alumno('pcondori26', 'pqr456', 'Pedro Condori', b, { dni: '70000003', debe_cambiar: false });
    d.usuarios.profe = { usuario: 'profe', contrasena: 'profe123', rol: 'profesor', nombre: 'Rosa Apaza', debe_cambiar: false, secciones: [a, b] };
    d.usuarios.admin = { usuario: 'admin', contrasena: 'admin123', rol: 'admin', nombre: 'Coordinación', debe_cambiar: false, secciones: [a, b] };
  };
  if (conSemilla) f.sembrar();

  const publico = u => ({ rol: u.rol, nombre: u.nombre, debe_cambiar: !!u.debe_cambiar, usuario: u.usuario, colegio: { ...d.colegio },
    ...(u.rol === 'alumno' ? { alumno: u.alumno, seccion: { ...d.secciones[u.seccion] } } : {}) });
  function emitir(u) {
    const acceso = token(), renovacion = token();
    d.acceso.set(acceso, { usuario: u.usuario, expira: ahora() + ttlAcceso });
    d.renov.set(hash(renovacion), { usuario: u.usuario, expira: ahora() + ttlRenovacion, revocada: false });
    return { acceso, renovacion, expira_en: Math.round(ttlAcceso / 1000), usuario: publico(u) };
  }
  const err = (codigo, estado, mensaje) => ({ estado, cuerpo: { error: codigo, mensaje } });

  // ---------- Rutas ----------
  async function manejar(metodo, ruta, q, cab, cuerpo, ip) {
    if (metodo === 'POST' && ruta === '/api/login') {
      const { usuario = '', contrasena = '' } = json(cuerpo);
      const hace = ahora() - 10 * 60 * 1000;
      d.fallos = d.fallos.filter(x => x.t > hace);
      if (d.fallos.filter(x => x.usuario === usuario).length >= 5 || d.fallos.filter(x => x.ip === ip).length >= 5)
        return err('demasiados-intentos', 429, 'Demasiados intentos. Espera unos minutos y vuelve a probar.');
      const u = d.usuarios[usuario];
      if (!u || u.contrasena !== contrasena) { d.fallos.push({ usuario, ip, t: ahora() }); return err('credenciales', 401, 'Usuario o contraseña incorrectos.'); }
      return { estado: 200, cuerpo: emitir(u) };
    }
    if (metodo === 'POST' && ruta === '/api/renovar') {
      const { renovacion = '' } = json(cuerpo);
      const r = d.renov.get(hash(renovacion));
      if (!r || r.expira < ahora()) return err('renovacion', 401, 'Tu sesión venció. Vuelve a entrar.');
      if (r.revocada) { for (const x of d.renov.values()) if (x.usuario === r.usuario) x.revocada = true; return err('renovacion', 401, 'Tu sesión venció. Vuelve a entrar.'); }
      r.revocada = true;
      return { estado: 200, cuerpo: emitir(d.usuarios[r.usuario]) };
    }
    if (metodo === 'POST' && ruta === '/api/salir') {
      const r = d.renov.get(hash(json(cuerpo).renovacion || ''));
      if (r) r.revocada = true;
      return { estado: 204 };
    }
    // Lo demás pide el token de acceso.
    const a = d.acceso.get(String(cab.authorization || '').replace(/^Bearer /, ''));
    if (!a || a.expira < ahora()) return err('token-vencido', 401, 'Tu sesión venció.');
    const u = d.usuarios[a.usuario];
    if (u.debe_cambiar && !(metodo === 'PUT' && ruta === '/api/contrasena')) return err('debe-cambiar', 403, 'Primero elige una contraseña nueva.');
    if (metodo === 'PUT' && ruta === '/api/contrasena') {
      const { actual, nueva } = json(cuerpo);
      if (actual !== u.contrasena) return err('contrasena-actual', 400, 'La contraseña actual no es correcta.');
      if (!nueva || String(nueva).length < 6) return err('contrasena-corta', 400, 'La contraseña nueva debe tener 6 caracteres o más.');
      if (nueva === actual) return err('contrasena-igual', 400, 'La contraseña nueva no puede ser igual a la actual.');
      u.contrasena = nueva; u.debe_cambiar = false;
      return { estado: 204 };
    }
    if (ruta === '/api/estado' || ruta === '/api/eventos') {
      if (u.rol !== 'alumno') return err('prohibido', 403, 'Solo para alumnos.');
      const st = d.estados[u.alumno] || (d.estados[u.alumno] = { est: { alumno: u.alumno }, actualizado: null });
      const h = d.habilitaciones[u.seccion] || { salida: new Set(), soluciones: new Set() };
      const hab = { salida: [...h.salida].sort(), soluciones: [...h.soluciones].sort() };
      const conHab = e => ({ ...e, salidaHabilitada: hab.salida, solucionesHabilitadas: hab.soluciones });
      if (metodo === 'GET' && ruta === '/api/estado') return { estado: 200, cuerpo: { est: conHab(st.est), actualizado: st.actualizado, habilitaciones: hab } };
      if (metodo === 'PUT' && ruta === '/api/estado') {
        const e = unirEst(st.est, json(cuerpo).est || {});
        e.alumno = u.alumno;
        delete e.salidaHabilitada; delete e.solucionesHabilitadas; // las decide el profesor, no se guardan del cliente
        st.est = e; st.actualizado = new Date(ahora()).toISOString();
        return { estado: 200, cuerpo: { est: conHab(e), actualizado: st.actualizado, habilitaciones: hab } };
      }
      if (metodo === 'POST' && ruta === '/api/eventos') {
        const l = json(cuerpo).eventos;
        if (!Array.isArray(l) || l.length > 500) return err('eventos', 400, 'Hasta 500 eventos por vez.');
        let nuevos = 0;
        for (const ev of l) {
          if (!ev || !ev.t) continue;
          const limpio = { ...ev, alumno: u.alumno };
          for (const k of PERSONALES) delete limpio[k];
          const k = u.alumno + '|' + ev.t;
          if (!d.eventos.has(k)) { d.eventos.set(k, limpio); nuevos++; }
        }
        return { estado: 200, cuerpo: { recibidos: l.length, nuevos } };
      }
    }
    const esProfe = u.rol === 'profesor' || u.rol === 'admin';
    const mias = () => (u.secciones || []);
    if (metodo === 'GET' && ruta === '/api/secciones') {
      if (!esProfe) return err('prohibido', 403, 'Solo para profesores.');
      return { estado: 200, cuerpo: mias().map(id => ({ ...d.secciones[id], alumnos: Object.values(d.usuarios).filter(x => x.seccion === id).length })) };
    }
    let m;
    if ((m = ruta.match(/^\/api\/secciones\/([^/]+)\/(avance|habilitar)$/))) {
      const id = decodeURIComponent(m[1]);
      if (!esProfe || !mias().includes(id)) return err('prohibido', 403, 'Esa sección no es tuya.');
      const h = d.habilitaciones[id];
      if (m[2] === 'avance' && metodo === 'GET') {
        const p = r => (r ? { aciertos: r.aciertos, total: r.total, fecha: r.fecha || null } : null);
        const alumnos = Object.values(d.usuarios).filter(x => x.seccion === id).map(x => {
          const e = (d.estados[x.alumno] || {}).est || {}, dias = e.dias || [], pr = e.practica || {};
          return { usuario: x.usuario, nombre: x.nombre, dias_activos: new Set(dias).size, ultimo_dia: dias.length ? [...dias].sort().pop() : null,
            unidades_vistas: Object.keys(e.vistas || {}).length, modulos_practicados: Object.keys(pr).filter(k => pr[k] && pr[k].hechos).sort(),
            pruebas: Object.fromEntries(Object.entries(e.pruebas || {}).map(([c, r]) => [c, { entrada: p(r.entrada), salida: p(r.salida) }])),
            practica: Object.fromEntries(Object.entries(pr).filter(([, r]) => r && (r.entrada || r.salida)).map(([m, r]) => [m, { entrada: p(r.entrada), salida: p(r.salida) }])) };
        });
        // Como el servidor real: una fila por (curso, qué) con abierto verdadero o falso.
        return { estado: 200, cuerpo: { seccion: d.secciones[id], alumnos, habilitaciones: [...(h.filas || new Map()).values()] } };
      }
      if (m[2] === 'habilitar' && metodo === 'POST') {
        const { curso, que, abierto } = json(cuerpo);
        if (!['salida', 'soluciones'].includes(que) || !curso) return err('habilitar', 400, 'Falta el curso o qué abrir.');
        if (abierto) h[que].add(curso); else h[que].delete(curso);
        (h.filas = h.filas || new Map()).set(curso + '|' + que, { curso, que, abierto: !!abierto, cuando: new Date(ahora()).toISOString() });
        return { estado: 200, cuerpo: { seccion: id, curso, que, abierto: !!abierto } };
      }
    }
    if ((m = ruta.match(/^\/api\/alumnos\/([^/]+)\/reiniciar$/)) && metodo === 'POST') {
      const x = d.usuarios[decodeURIComponent(m[1])];
      if (!esProfe || !x || x.rol !== 'alumno' || !mias().includes(x.seccion)) return err('prohibido', 403, 'Ese alumno no es de tus secciones.');
      x.contrasena = azar(6); x.debe_cambiar = true;
      for (const r of d.renov.values()) if (r.usuario === x.usuario) r.revocada = true;
      return { estado: 200, cuerpo: { usuario: x.usuario, contrasena: x.contrasena } };
    }
    if (ruta.startsWith('/api/colegio/')) {
      if (u.rol !== 'admin') return err('prohibido', 403, 'Solo para el administrador del colegio.');
      if (ruta === '/api/colegio/alumnos' && metodo === 'POST') return cargarCSV(csvDe(cuerpo, cab), q.get('formato'));
      if (ruta === '/api/colegio/alumnos' && metodo === 'GET')
        return { estado: 200, cuerpo: Object.values(d.usuarios).filter(x => x.rol === 'alumno').map(x => ({ nombre: x.nombre, usuario: x.usuario, seccion: x.seccion, dni: x.dni ? '…' + x.dni.slice(-3) : '' })) };
      if (ruta === '/api/colegio/eventos' && metodo === 'GET') return { estado: 200, cuerpo: [...d.eventos.values()].sort((p, r) => String(p.t).localeCompare(String(r.t))) };
      if (ruta === '/api/colegio/profesores' && metodo === 'POST') {
        const { nombre, usuario, secciones = [] } = json(cuerpo);
        const nu = usuario || nuevoUsuario(nombre || 'p', (nombre || 'profe').split(' ').pop());
        d.usuarios[nu] = { usuario: nu, contrasena: azar(6), rol: 'profesor', nombre, debe_cambiar: true, secciones };
        return { estado: 200, cuerpo: { usuario: nu, contrasena: d.usuarios[nu].contrasena } };
      }
    }
    return err('no-existe', 404, 'Esa ruta no existe.');
  }

  function cargarCSV(texto, formato) {
    const filas = String(texto || '').replace(/^﻿/, '').split(/\r?\n/).filter(l => l.trim());
    const cab = (filas.shift() || '').split(',').map(x => x.trim().toLowerCase());
    const creados = [], errores = []; let actualizados = 0;
    filas.forEach((l, i) => {
      const v = l.split(','), r = Object.fromEntries(cab.map((k, j) => [k, (v[j] || '').trim()]));
      if (!r.apellidos || !r.nombres || !/^\d{8}$/.test(r.dni || '') || !r.grado || !r.seccion) return errores.push({ fila: i + 2, motivo: 'Faltan datos o el DNI no tiene 8 cifras.' });
      const sec = seccion(r.grado, r.seccion), nombre = `${r.nombres} ${r.apellidos}`;
      const ya = Object.values(d.usuarios).find(x => x.dni === r.dni);
      if (ya) { Object.assign(ya, { nombre, seccion: sec }); actualizados++; return; }
      const u = alumno(nuevoUsuario(r.nombres, r.apellidos), azar(6), nombre, sec, { dni: r.dni });
      creados.push({ usuario: u.usuario, contrasena: u.contrasena, nombre, grado: String(r.grado), seccion: d.secciones[sec].letra });
    });
    for (const id of Object.keys(d.secciones)) for (const p of Object.values(d.usuarios)) if (p.rol === 'admin' && !p.secciones.includes(id)) p.secciones.push(id);
    if (formato === 'pdf') return { estado: 200, tipo: 'application/pdf', cuerpo: pdf(creados) };
    return { estado: 200, cuerpo: { creados, actualizados, errores } };
  }
  // PDF mínimo (una página con una línea por tarjeta): basta para probar la descarga.
  function pdf(creados) {
    const txt = creados.map(c => `${c.nombre} - ${c.usuario} - ${c.contrasena}`).join(' | ').replace(/[()\\]/g, '').normalize('NFD').replace(/[^\x20-\x7e|]/g, '');
    const flujo = `BT /F1 10 Tf 40 800 Td (${txt || 'Sin alumnos nuevos'}) Tj ET`;
    const obj = ['<< /Type /Catalog /Pages 2 0 R >>', '<< /Type /Pages /Kids [3 0 R] /Count 1 >>',
      '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>',
      `<< /Length ${flujo.length} >>\nstream\n${flujo}\nendstream`, '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>'];
    let s = '%PDF-1.4\n'; const pos = [];
    obj.forEach((o, i) => { pos.push(s.length); s += `${i + 1} 0 obj\n${o}\nendobj\n`; });
    const x = s.length;
    s += `xref\n0 ${obj.length + 1}\n0000000000 65535 f \n${pos.map(p => String(p).padStart(10, '0') + ' 00000 n \n').join('')}trailer\n<< /Size ${obj.length + 1} /Root 1 0 R >>\nstartxref\n${x}\n%%EOF\n`;
    return Buffer.from(s, 'latin1');
  }
  // El CSV llega como multipart/form-data (campo archivo) o como texto plano.
  function csvDe(cuerpo, cab) {
    const tipo = String(cab['content-type'] || '');
    const b = tipo.match(/boundary=(?:"([^"]+)"|([^;]+))/);
    if (!b) return cuerpo.toString('utf8');
    const partes = cuerpo.toString('utf8').split('--' + (b[1] || b[2]));
    const p = partes.find(x => /filename=|name="archivo"/.test(x)) || '';
    return p.slice(p.indexOf('\r\n\r\n') + 4).replace(/\r\n$/, '');
  }
  const json = b => { try { return JSON.parse(b.toString('utf8') || '{}') || {}; } catch { return {}; } };

  // ---------- HTTP ----------
  const CORS = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'Authorization, Content-Type', 'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS' };
  const servidor = http.createServer((req, res) => {
    const partes = [];
    req.on('data', c => partes.push(c));
    req.on('end', async () => {
      const url = new URL(req.url, 'http://x');
      if (req.method === 'OPTIONS') { res.writeHead(204, CORS); return res.end(); }
      d.pedidos.push({ metodo: req.method, ruta: url.pathname });
      if (f.caido) { req.socket.destroy(); return; }
      if (f.fallarProximos > 0) { f.fallarProximos--; res.writeHead(503, { ...CORS, 'Content-Type': 'application/json' }); return res.end(JSON.stringify({ error: 'servidor', mensaje: 'Servidor ocupado.' })); }
      try {
        const r = await manejar(req.method, url.pathname, url.searchParams, req.headers, Buffer.concat(partes), req.socket.remoteAddress);
        if (r.estado === 204) { res.writeHead(204, CORS); return res.end(); }
        const pdfBuf = Buffer.isBuffer(r.cuerpo);
        res.writeHead(r.estado, { ...CORS, 'Content-Type': r.tipo || 'application/json; charset=utf-8' });
        res.end(pdfBuf ? r.cuerpo : JSON.stringify(r.cuerpo));
      } catch (e) {
        res.writeHead(500, { ...CORS, 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'servidor', mensaje: e.message }));
      }
    });
  });
  f.escuchar = (puerto = 0, host = '127.0.0.1') => new Promise(ok => servidor.listen(puerto, host, () => { f.url = `http://${host}:${servidor.address().port}`; ok(f.url); }));
  f.cerrar = () => new Promise(ok => { servidor.closeAllConnections && servidor.closeAllConnections(); servidor.close(() => ok()); });
  f.eventosDe = usuario => [...d.eventos.values()].filter(e => e.alumno === d.usuarios[usuario].alumno);
  f.estadoDe = usuario => (d.estados[d.usuarios[usuario].alumno] || {}).est;
  return f;
}

module.exports = { crear };

if (require.main === module) {
  const f = crear();
  f.escuchar(Number(process.env.PORT) || 4180).then(url => {
    console.log(`Servidor falso de cuentas en ${url}`);
    console.log('  alumnos: qroman26/abc234 (debe cambiar), lmamani26/xyz789, pcondori26/pqr456 · profe/profe123 · admin/admin123');
  });
}
