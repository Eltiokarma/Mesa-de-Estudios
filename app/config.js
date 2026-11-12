// Configuración de la app. MESA_API es la dirección del servidor de cuentas (docs/cuentas.md), sin «/» al final.
// Vacío: no hay servidor y la app queda en modo demostración, como siempre (todo se guarda en el navegador y los
// datos se descargan a mano).
//
// Publicada (Vercel), la app usa el servidor de Railway. En local (npm run dev) sigue en demostración, para que las
// pruebas y el desarrollo no toquen datos reales; para probar contra el servidor en local, cambia la línea a mano.
// El servidor solo acepta los orígenes de su variable CORS_ORIGENES (hoy https://mesa-de-estudios.vercel.app).
window.MESA_API = /^(localhost|127\.0\.0\.1|\[::1\])$/.test(location.hostname) ? '' : 'https://mesa-de-estudios-production.up.railway.app';
