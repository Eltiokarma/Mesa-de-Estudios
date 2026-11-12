# Publicar la app (la3)

> **Publicada el 12 nov 2026:** app en https://mesa-de-estudios.vercel.app (Vercel, rama `main`, raíz del repo, preset Other) y servidor de cuentas en https://mesa-de-estudios-production.up.railway.app (Railway, carpeta `servidor`). Cada push a `main` publica los dos.

La app es un sitio estático: no tiene servidor ni base de datos. Para que se instale en el celular y funcione sin conexión, tiene que estar en HTTPS. La opción recomendada es Vercel, porque es gratis para esto, da HTTPS y comprime los archivos sin configurar nada. Los requisitos del hosting están en `docs/arquitectura.md`, en «Carga, caché y despliegue».

## Qué ya está listo en el repo

- **`vercel.json`.** La raíz `/` lleva a `/app/`. `app/sw.js` se sirve con `Cache-Control: no-cache` y `Service-Worker-Allowed: /`, para que el service worker controle también las escenas. `app/`, `nucleo/`, `plantillas/` y `contenido/` se revalidan en cada visita, y como Vercel manda ETag, cada revisión es un 304 de pocos bytes.
- **`.vercelignore`.** Solo se publica la app. Quedan fuera `docs/`, `fuentes/`, `rutinas/`, `herramientas/`, `gestion/` y `catalogo/`, además de los `.md` y `.png` sueltos de la raíz. La app lee el catálogo ya armado en `app/datos/`.
- **No hay paso de construcción.** `app/datos/catalogo.json` y `app/datos/pruebas.json` se suben ya armados con `npm run catalogo`.

## Pasos (los hace Gerson, una sola vez, con su cuenta)

1. Entrar a vercel.com con la cuenta de GitHub y elegir **Add New → Project**.
2. Importar el repo `Eltiokarma/Mesa-de-Estudios`.
3. En **Framework Preset**, elegir **Other**. Dejar vacíos el comando de construcción y la carpeta de salida.
4. Rama de producción: **`main`** (desde el 12 nov 2026, todo lo integrado se sube también a `main`). Nombre del proyecto: **`mesa-de-estudios`**, para que la dirección sea `mesa-de-estudios.vercel.app`, que es el origen que acepta el servidor de cuentas (`CORS_ORIGENES` en Railway). Si Vercel da otra dirección, hay que cambiar `CORS_ORIGENES` y `APP_URL` en Railway.
5. Pulsar **Deploy**. Vercel da una dirección como `mesa-de-estudios.vercel.app`. Un dominio propio se agrega después en **Settings → Domains**.

Desde ese momento, cada push a esa rama se publica solo en uno o dos minutos. Los celulares que ya tienen la app reciben la versión nueva la próxima vez que la abran con conexión, siempre que se haya subido `VERSION` en `app/sw.js`.

## Cómo comprobar que quedó bien

- Abrir `https://<dirección>/` en un celular. Tiene que llevar a la app.
- En Chrome, el menú debe ofrecer **Instalar app** o **Agregar a pantalla principal**.
- Entrar, abrir un curso y una escena, poner el celular en modo avión y volver a abrir la app y **otra** escena que no se haya abierto antes. Las dos deben abrir.
- Completar el punto 2.1 de `docs/guia-profesores.md` con la dirección.

## Comprobado antes de publicar (7 nov 2026)

- Recorrido en Playwright a 390 px de la copia publicable (solo `app/`, `nucleo/`, `plantillas/` y `contenido/`): bienvenida, cursos, prueba de entrada, papel, lectura, progreso y perfil. No hubo errores ni pedidos con 404.
- Sin conexión, con el servidor apagado de verdad (no simulado), abren todos los módulos del catálogo, sus hojas de papel y las lecturas. Antes de la versión v125 del service worker no abría sin conexión una escena que nunca se hubiera abierto con conexión. Se arregló en `app/sw.js`: una carpeta se busca también como `index.html`.
