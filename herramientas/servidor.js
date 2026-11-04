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
// Todo lo demás se sirve como archivo estático desde la raíz del repositorio.
// Solo escucha en 127.0.0.1: es una herramienta de desarrollo, no un servidor público.

const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const hoja = require('./hoja-de-ruta');
const { construir } = require('./construir-catalogo');

const RAIZ = path.join(__dirname, '..');
const PUERTO = Number(process.env.PORT) || 4173;
const TIPOS = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8', '.webmanifest': 'application/manifest+json', '.svg': 'image/svg+xml',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.md': 'text/markdown; charset=utf-8',
  '.ico': 'image/x-icon', '.woff2': 'font/woff2',
};
// Carpetas que no se sirven aunque estén en el repositorio.
const PROHIBIDO = /^\/(\.git|node_modules|fuentes)(\/|$)/;

function enviar(res, codigo, cuerpo, tipo = 'text/plain; charset=utf-8', extra = {}) {
  res.writeHead(codigo, { 'Content-Type': tipo, 'Cache-Control': 'no-cache', ...extra });
  res.end(cuerpo);
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
  if (ruta === '/app/datos/catalogo.json') return enviar(res, 200, JSON.stringify(construir()), TIPOS['.json']);
  if (PROHIBIDO.test(ruta)) return enviar(res, 404, 'No encontrado');
  if (ruta.endsWith('/')) ruta += 'index.html';
  const archivo = path.normalize(path.join(RAIZ, ruta));
  if (!archivo.startsWith(RAIZ + path.sep)) return enviar(res, 403, 'Prohibido');
  fs.readFile(archivo, (err, datos) => {
    if (err) return enviar(res, 404, 'No encontrado');
    const extra = {};
    // El service worker de la PWA vive en /app/ pero controla también /plantillas/.
    if (ruta === '/app/sw.js') extra['Service-Worker-Allowed'] = '/';
    enviar(res, 200, datos, TIPOS[path.extname(archivo)] || 'application/octet-stream', extra);
  });
});

servidor.listen(PUERTO, '127.0.0.1', () => {
  console.log(`Laboratorio de Admisión en http://localhost:${PUERTO}`);
  console.log(`  App:           http://localhost:${PUERTO}/app/`);
  console.log(`  Hoja de ruta:  http://localhost:${PUERTO}/gestion/`);
});
