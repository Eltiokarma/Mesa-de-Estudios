# Rutina cuentas-app (fase C2 de docs/cuentas.md), 12 nov 2026

Rama `rutina/cuentas-app`, creada desde `claude/awesome-wozniak-5etl1n`. Tres commits: el núcleo de la sesión y el servidor falso, las pantallas de la app y la documentación. `npm test` en verde en cada uno. No toqué `servidor/` ni subí `VERSION` en `app/sw.js`.

## Qué quedó hecho

- **`app/config.js`** con `window.MESA_API = ''`. Vacío significa modo demostración, como siempre. Va en la CASCARA, junto con `nucleo/sesion.js`.
- **`nucleo/sesion.js`** no depende del DOM y corre en el navegador y en Node:
  - login, renovación (antes de que venza el acceso y otra vez al recibir un 401), cierre de sesión y cambio de contraseña;
  - la cola sube en tandas de 500 y, si se corta, sigue desde la última tanda;
  - `est` se une con las reglas del contrato (`unirEst`) y se aplica en sitio (`aplicarEnSitio`);
  - copia las habilitaciones de la sección;
  - reintenta con espera creciente (2 s → 5 min);
  - sincroniza al volver la señal, en `visibilitychange` y `pagehide`, cada 30 s y unos 3 s después de cada cambio.
  - La sesión que vence conserva el estado y la cola. Lo que no se pudo subir al cerrar sesión queda en `lab-pendiente-v1` y sube cuando esa cuenta vuelve a entrar en ese navegador.
  - Mientras hay cuenta, el modo demostración se guarda aparte (`lab-demo-v1`) y vuelve al cerrar sesión.
- **`Medicion.guardar`**: el `t` de cada evento es único y creciente en el dispositivo (+1 ms si hay empate). Sin eso, el servidor, que es idempotente por alumno + `t`, descartaría eventos.
- **Pantallas** (`app/app.js` y el final de `app/estilos.css`):
  - ingreso, con «¿Olvidaste tu contraseña? Pídesela a tu profesor» y «Probar sin cuenta»;
  - cambio de contraseña, obligatorio con `debe_cambiar`;
  - perfil con la cuenta, «Cambiar contraseña» y «Cerrar sesión». Con cuenta se ocultan «Otro alumno», «Borrar mi avance», el código del colegio y la descarga manual;
  - `#/salir`, que avisa si no pudo subir y ofrece «Reintentar» o «Cerrar igual»;
  - la bienvenida sin el nombre;
  - el indicador «✓ Guardado» o «Pendiente de subir (n)»;
  - el panel del profesor y del administrador (`#/panel`).
- **Medición con cuenta:** `est.alumno` es el seudónimo. Los enlaces `?salida=` y `?soluciones=` no cuentan con cuenta.
- **Pruebas:**
  - `herramientas/servidor-falso.js` cumple el contrato en memoria (`node herramientas/servidor-falso.js` → puerto 4180, con cuentas de ejemplo);
  - `nucleo/sesion.test.js` trae 10 pruebas;
  - `node rutinas/cuentas-app/pw.js` trae 37 comprobaciones por ancho, a 390 y 1366 px, todas en verde: modo demostración intacto, ingreso, contraseña, práctica sin conexión y subida al volver, cierre de sesión con y sin señal, otro alumno sin mezclar, panel del profesor (habilitar y reiniciar), Ana recibe la salida abierta, y el administrador sube el CSV, baja el PDF y baja los eventos. Sin errores de JavaScript.
- **Documentación:**
  - `docs/arquitectura.md` tiene la sección nueva «Cuentas en la app»;
  - `docs/guia-profesores.md` cubre cómo entran con cuenta, el panel, el laboratorio con «Cerrar sesión», los datos que llegan solos y los problemas nuevos. La guía mantiene el modo sin cuentas.

## Huecos del contrato: supuestos que tomé (la rutina del servidor debería confirmarlos)

1. **Nombre del rol del administrador del colegio:** usé `admin`. La app también acepta `admin-colegio`, `administrador` y `general`.
2. **Forma de `GET /api/secciones/{id}/avance`:** usé `{ alumnos: [{ usuario, nombre, dias, modulos, cursos: { <curso>: { entrada: {aciertos,total,fecha}|null, salida } } }], habilitaciones: { salida: [], soluciones: [] } }`.
   - La app acepta también un arreglo suelto, y `dias_activos` y `modulos_vistos`.
   - **Hace falta `habilitaciones`** para que el panel sepa qué está abierto al entrar. El contrato no tiene cómo leerlo.
3. **Respuesta de `POST /api/secciones/{id}/habilitar`:** uso `{ salida: [], soluciones: [] }` si llega. Si no llega, la app lleva la cuenta sola.
4. **`curso: "todas"`** se guarda tal cual en la lista de habilitaciones. La app ya lo entiende: `salidaAbierta` acepta `todas`.
5. **El CSV va como `multipart/form-data` con el campo `archivo`**, que es lo natural con `UploadFile` de FastAPI.
6. **`usuario` en la respuesta del login** no trae el nombre de usuario. La app guarda el que se escribió. Convendría que el servidor lo devuelva.
7. **`usuario.seccion`:** la app la muestra como «4.º A» si viene como objeto `{grado, letra}` o como id `s4a`. Con otro formato muestra «Sección <id>». Convendría un objeto.
8. **`expira_en`** lo tomé en segundos.
9. **Unión de `enCurso`:** si la fase de esa prueba ya terminó en cualquiera de los dos lados, el `enCurso` se descarta. Si no, revive una prueba ya hecha. Conviene que el servidor aplique la misma regla.
10. **CORS:** la app (Vercel) llama a otro dominio. El servidor debe permitir el origen de la app, con `Authorization` y `Content-Type`, y responder a `OPTIONS`.

## Lo que queda o conviene decidir

- **Subir `VERSION` en `app/sw.js` al integrar:** cambiaron la cáscara, `config.js` y `sesion.js`. No lo subí, por la regla de esta rutina.
- **`app/config.js` con la dirección real** al publicar. Ojo: el service worker lo sirve de la caché y lo renueva por detrás (stale-while-revalidate), así que un cambio de `MESA_API` llega en la segunda visita.
- **Las escenas** (páginas aparte) guardan eventos con el seudónimo, pero no cargan `sesion.js`. Esos eventos suben cuando el alumno vuelve a la app (en unos segundos, o cada 30 s).
- **Límite de la cola:** la cola local guarda como máximo 5000 eventos. Un alumno sin señal por mucho tiempo podría perder los más antiguos sin subir.
- **Reinicio de contraseña:** en el servidor falso revoca las renovaciones del alumno. Si el real también lo hace, la sesión de ese alumno vence en sus equipos y al volver a entrar se le pide la contraseña nueva. Lo pendiente se conserva.
- **Probar en las PC y los celulares reales del colegio** (lo dice `docs/cuentas.md`).
