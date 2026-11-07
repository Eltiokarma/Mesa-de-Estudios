// Service worker: deja la app y las escenas guardadas en el celular para usarlas sin internet.
// Estrategia: al instalar, guarda la cáscara, el catálogo y los archivos de cada plantilla (en lectura, el banco entero).
// Después responde desde lo guardado y actualiza en segundo plano (stale-while-revalidate).
// Al cambiar algo de la cáscara, subir VERSION para que los celulares la renueven.
const VERSION = 'v49';
const CACHE = `lab-${VERSION}`;
const CASCARA = ['/app/', '/app/index.html', '/app/estilos.css', '/app/app.js', '/app/manifest.webmanifest',
  '/app/practica.js', '/app/prueba.js', '/app/lectura.js', '/app/ilustraciones.js', '/app/datos/catalogo.json', '/app/datos/pruebas.json',
  '/nucleo/azar.js', '/nucleo/predicciones.js', '/nucleo/medicion.js', '/nucleo/pruebas.js', '/nucleo/lectura.js', '/nucleo/celular.js', '/app/iconos/icono.svg', '/app/iconos/icono-192.png', '/app/iconos/icono-512.png'];

self.addEventListener('install', e => {
  e.waitUntil((async () => {
    const c = await caches.open(CACHE);
    await c.addAll(CASCARA);
    // Las escenas salen del catálogo: así una plantilla nueva queda disponible sin tocar este archivo.
    try {
      const cat = await (await fetch('/app/datos/catalogo.json', { cache: 'no-store' })).json();
      const archivos = Object.values(cat.plantillas).flatMap(p => p.archivos);
      await Promise.all(archivos.map(u => c.add(u).catch(() => {})));
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
    const red = fetch(e.request).then(r => { if (r.ok) c.put(e.request, r.clone()); return r; }).catch(() => null);
    if (guardada) { e.waitUntil(red); return guardada; }
    const r = await red;
    if (r) return r;
    if (e.request.mode === 'navigate') return (await c.match('/app/index.html')) || Response.error();
    return Response.error();
  })());
});
