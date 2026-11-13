// Servidor local, sin dependencias: sirve la app (PWA), las plantillas y la hoja de ruta.
//   npm run dev            → http://localhost:4173
//   PORT=5000 npm run dev  → otro puerto
//
// Rutas:
//   /                    → redirige a /app/
//   /app/                → la PWA
//   /gestion/            → la hoja de ruta (Gantt) navegable y editable
//   /api/hoja-de-ruta    → GET devuelve docs/hoja-de-ruta.json; PUT lo valida, lo guarda
//                          y regenera el Gantt de Mermaid de docs/hoja-de-ruta.md
//   /app/datos/catalogo.json → el catálogo armado al vuelo desde catalogo/ (ver construir-catalogo.js)
//   /app/datos/pruebas.json  → el banco de pruebas de entrada y salida, armado al vuelo desde catalogo/pruebas/
// Todo lo demás se sirve como archivo estático desde la raíz del repositorio.
// Solo escucha en 127.0.0.1: es una herramienta de desarrollo, no un servidor público.
//
// Para parecerse a un hosting real (y medir como lo vivirá el celular):
//   - ETag (y Last-Modified en los archivos): con If-None-Match o If-Modified-Since iguales responde 304 sin cuerpo.
//     Con Cache-Control: no-cache el navegador revalida siempre, así que la revalidación del service worker cuesta un 304.
//   - gzip si el cliente manda Accept-Encoding: gzip, para texto (HTML, JS, CSS, JSON, SVG) de más de 1 KB.

const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const zlib = require('node:zlib');
const crypto = require('node:crypto');
const hoja = require('./hoja-de-ruta');
const { construir, construirPruebas } = require('./construir-catalogo');

const RAIZ = path.join(__dirname, '..');
const PUERTO = Number(process.env.PORT) || 4173;
const TIPOS = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8', '.webmanifest': 'application/manifest+json', '.svg': 'image/svg+xml',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.md': 'text/markdown; charset=utf-8',
  '.ico': 'image/x-icon', '.woff2': 'font/woff2', '.wasm': 'application/wasm', '.riv': 'application/octet-stream',
};
// Carpetas que no se sirven aunque estén en el repositorio.
const PROHIBIDO = /^\/(\.git|node_modules|fuentes)(\/|$)/;

function enviar(res, codigo, cuerpo, tipo = 'text/plain; charset=utf-8', extra = {}) {
  res.writeHead(codigo, { 'Content-Type': tipo, 'Cache-Control': 'no-cache', ...extra });
  res.end(cuerpo);
}

// Respuesta 200 con validadores (ETag y, si se da, Last-Modified), 304 si el cliente ya la tiene y gzip si lo acepta.
const COMPRIMIBLE = /^(text\/|application\/(json|manifest\+json|javascript)|image\/svg\+xml)/;
const comprimidos = new Map(); // ruta + etag → cuerpo con gzip (para no comprimir lo mismo en cada pedido)
function enviarConCache(req, res, cuerpo, tipo, { etag, modificado, extra = {} } = {}) {
  cuerpo = Buffer.isBuffer(cuerpo) ? cuerpo : Buffer.from(cuerpo);
  etag = etag || `W/"${crypto.createHash('sha1').update(cuerpo).digest('base64url').slice(0, 20)}"`;
  const cab = { 'Content-Type': tipo, 'Cache-Control': 'no-cache', ETag: etag, ...extra };
  if (modificado) cab['Last-Modified'] = modificado.toUTCString();
  const zip = COMPRIMIBLE.test(tipo) && cuerpo.length > 1024;
  if (zip) cab.Vary = 'Accept-Encoding';
  const inm = req.headers['if-none-match'], ims = req.headers['if-modified-since'];
  const igual = inm ? inm.split(',').some(x => x.trim().replace(/^W\//, '') === etag.replace(/^W\//, ''))
    : !!(ims && modificado && Math.floor(modificado.getTime() / 1000) <= Math.floor(Date.parse(ims) / 1000));
  if (igual) { res.writeHead(304, cab); return res.end(); }
  if (zip && /\bgzip\b/.test(req.headers['accept-encoding'] || '')) {
    const k = req.url.split('?')[0] + ' ' + etag;
    let z = comprimidos.get(k);
    if (!z) { z = zlib.gzipSync(cuerpo); if (comprimidos.size > 2000) comprimidos.clear(); comprimidos.set(k, z); }
    cab['Content-Encoding'] = 'gzip';
    cuerpo = z;
  }
  cab['Content-Length'] = cuerpo.length;
  res.writeHead(200, cab);
  res.end(req.method === 'HEAD' ? undefined : cuerpo);
}

function leerCuerpo(req) {
  return new Promise((ok, mal) => {
    let datos = '';
    req.on('data', c => { datos += c; if (datos.length > 1e6) { mal(new Error('demasiado grande')); req.destroy(); } });
    req.on('end', () => ok(datos));
    req.on('error', mal);
  });
}

async function api(req, res) {
  if (req.method === 'GET') return enviar(res, 200, JSON.stringify(hoja.leer()), TIPOS['.json']);
  if (req.method === 'PUT') {
    try {
      const d = hoja.guardar(JSON.parse(await leerCuerpo(req)));
      return enviar(res, 200, JSON.stringify(d), TIPOS['.json']);
    } catch (e) {
      return enviar(res, 400, JSON.stringify({ errores: e.errores || [e.message] }), TIPOS['.json']);
    }
  }
  return enviar(res, 405, 'Método no permitido');
}

const servidor = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  let ruta = decodeURIComponent(url.pathname);
  if (ruta === '/') return enviar(res, 302, '', undefined, { Location: '/app/' });
  if (ruta === '/api/hoja-de-ruta') return api(req, res);
  if (ruta === '/app/datos/catalogo.json') return enviarConCache(req, res, JSON.stringify(construir()), TIPOS['.json']);
  if (ruta === '/app/datos/pruebas.json') return enviarConCache(req, res, JSON.stringify(construirPruebas()), TIPOS['.json']);
  if (PROHIBIDO.test(ruta)) return enviar(res, 404, 'No encontrado');
  if (ruta.endsWith('/')) ruta += 'index.html';
  const archivo = path.normalize(path.join(RAIZ, ruta));
  if (!archivo.startsWith(RAIZ + path.sep)) return enviar(res, 403, 'Prohibido');
  fs.stat(archivo, (err, st) => {
    if (err || !st.isFile()) return enviar(res, 404, 'No encontrado');
    fs.readFile(archivo, (err2, datos) => {
      if (err2) return enviar(res, 404, 'No encontrado');
      const extra = {};
      // El service worker de la PWA vive en /app/ pero controla también /plantillas/.
      if (ruta === '/app/sw.js') extra['Service-Worker-Allowed'] = '/';
      // ETag débil con tamaño y fecha de modificación (como los servidores estáticos comunes).
      const etag = `W/"${st.size.toString(16)}-${Math.floor(st.mtimeMs).toString(16)}"`;
      enviarConCache(req, res, datos, TIPOS[path.extname(archivo)] || 'application/octet-stream', { etag, modificado: st.mtime, extra });
    });
  });
});

servidor.listen(PUERTO, '127.0.0.1', () => {
  console.log(`Laboratorio de Admisión en http://localhost:${PUERTO}`);
  console.log(`  App:           http://localhost:${PUERTO}/app/`);
  console.log(`  Hoja de ruta:  http://localhost:${PUERTO}/gestion/`);
});
