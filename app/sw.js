// Service worker: deja la app y las escenas guardadas en el celular para usarlas sin internet.
//
// Qué guarda: la cáscara (CASCARA: la app, sus estilos, sus scripts, el núcleo, los íconos y los dos JSON de datos)
// y los archivos de cada plantilla que lista el catálogo (en lectura, el banco entero).
//
// Cómo responde: desde lo guardado y, a la vez, pide el archivo a la red y guarda la respuesta para la próxima vez
// (stale-while-revalidate). Así una plantilla que cambió se renueva sola la primera vez que se abre con internet,
// sin subir VERSION; el alumno ve el cambio en la visita siguiente. Las entradas se guardan sin la parte «?…»
// de la dirección (la escena se abre con ?desde=app): una sola copia por archivo, la que se sirve.
// Con ETag o Last-Modified en el servidor, esa revalidación es un 304 de pocos bytes.
//
// Al subir VERSION (hay que hacerlo cuando cambia la cáscara), la instalación arma la caché nueva así:
//   1. La cáscara se baja SIEMPRE de nuevo (cache: 'no-cache', revalida aunque el navegador la tenga en su caché HTTP).
//   2. Cada archivo de plantilla que ya estaba en la caché anterior (mismo URL) se COPIA de ahí, sin red.
//   3. Solo se bajan los archivos de plantilla que no estaban (plantillas o archivos nuevos).
//   Al activarse se borran las cachés anteriores. Los archivos copiados se siguen renovando por stale-while-revalidate.
// Antes cada VERSION nueva volvía a bajar todo (218 archivos, 8 MB sin comprimir); ahora, la cáscara y lo nuevo.
const VERSION = 'v104';
const CACHE = `lab-${VERSION}`;
const CASCARA = ['/app/', '/app/index.html', '/app/estilos.css', '/app/app.js', '/app/manifest.webmanifest',
  '/app/practica.js', '/app/prueba.js', '/app/lectura.js', '/app/ilustraciones.js', '/app/datos/catalogo.json', '/app/datos/pruebas.json',
  '/nucleo/azar.js', '/nucleo/predicciones.js', '/nucleo/medicion.js', '/nucleo/pruebas.js', '/nucleo/lectura.js', '/nucleo/celular.js', '/nucleo/elementos.js', '/app/iconos/icono.svg', '/app/iconos/icono-192.png', '/app/iconos/icono-512.png'];

// Clave de la caché: la dirección sin «?…» (las respuestas se buscan con ignoreSearch).
const clave = u => { const x = new URL(u, location.origin); return x.origin + x.pathname; };

// La copia más reciente de un URL en las cachés anteriores (si hubo varias, la última guardada).
async function anterior(viejas, u) {
  for (const c of viejas) {
    const todas = await c.matchAll(u, { ignoreSearch: true });
    if (todas.length) return todas[todas.length - 1];
  }
  return null;
}

self.addEventListener('install', e => {
  e.waitUntil((async () => {
    const c = await caches.open(CACHE);
    const viejas = await Promise.all((await caches.keys()).filter(k => k.startsWith('lab-') && k !== CACHE).reverse().map(k => caches.open(k)));
    await c.addAll(CASCARA.map(u => new Request(u, { cache: 'no-cache' })));
    // Las escenas salen del catálogo: así una plantilla nueva queda disponible sin tocar este archivo.
    try {
      const cat = await (await fetch('/app/datos/catalogo.json', { cache: 'no-store' })).json();
      const archivos = [...new Set(Object.values(cat.plantillas).flatMap(p => p.archivos))].filter(u => !CASCARA.includes(u));
      await Promise.all(archivos.map(async u => {
        const r = await anterior(viejas, u);
        if (r) return c.put(clave(u), r);
        return c.add(u).catch(() => {});
      }));
    } catch { /* sin red al instalar: se guardan cuando se abran */ }
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', e => {
  e.waitUntil((async () => {
    for (const k of await caches.keys()) if (k.startsWith('lab-') && k !== CACHE) await caches.delete(k);
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  if (e.request.method !== 'GET' || url.origin !== location.origin || url.pathname.startsWith('/api/')) return;
  // Solo la app, el núcleo, las plantillas y el contenido (banco de lectura); la hoja de ruta (/gestion/) es una herramienta interna.
  if (!/^\/(app|plantillas|nucleo|contenido)\//.test(url.pathname)) return;
  e.respondWith((async () => {
    const c = await caches.open(CACHE);
    const guardada = await c.match(e.request, { ignoreSearch: true });
    const red = fetch(e.request).then(r => { if (r.ok) c.put(clave(e.request.url), r.clone()); return r; }).catch(() => null);
    if (guardada) { e.waitUntil(red); return guardada; }
    const r = await red;
    if (r) return r;
    if (e.request.mode === 'navigate') return (await c.match('/app/index.html')) || Response.error();
    return Response.error();
  })());
});
