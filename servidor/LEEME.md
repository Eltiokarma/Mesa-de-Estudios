# Servidor de Mesa de Estudios (fase C1)

Cuentas, login, estado del alumno, eventos de medición, carga del CSV del colegio y tarjetas en PDF. El diseño y el contrato están en `docs/cuentas.md`; este servidor lo sigue al pie de la letra, salvo lo anotado en «Detalles que el contrato no fijaba».

Stack: Python 3.12 o superior, FastAPI, SQLAlchemy 2 y PostgreSQL en producción; SQLite en local y en las pruebas.

## Correrlo en local

```bash
cd servidor
python3 -m venv .venv && . .venv/bin/activate
pip install -r requirements-dev.txt
python -m pytest -q                      # 79 pruebas, con SQLite en memoria
python -m app.crear_admin --colegio "IE de prueba" --usuario coord --nombre "Ana Quispe"
uvicorn app.main:app --reload --port 8000
```

Sin variables de entorno usa `servidor/local.db` (SQLite) y claves de desarrollo, y acepta peticiones de `http://localhost:4173` (el `npm run dev` de la app). La documentación interactiva queda en `http://localhost:8000/docs` (en producción se apaga).

Para correr las pruebas contra PostgreSQL (borra la base en cada prueba, úsala solo para eso):

```bash
PRUEBAS_DATABASE_URL="postgresql://usuario:clave@localhost/mesa_pruebas" python -m pytest -q
```

## Comandos

```bash
python -m app.crear_admin --colegio "IE Juliaca" --usuario coordinador --nombre "Ana Quispe"   # colegio + su administrador
python -m app.crear_admin --general --usuario gerson --nombre "Gerson"                        # administrador general
python -m app.crear_admin --listar                                                            # colegios con sus conteos
```

La contraseña se imprime una sola vez (12 caracteres para los administradores) y se pide cambiarla en el primer ingreso.

## Variables de entorno

| Variable | Qué es | Ejemplo |
| --- | --- | --- |
| `ENTORNO` | `produccion` exige todas las claves de abajo y apaga `/docs` | `produccion` |
| `DATABASE_URL` | PostgreSQL. Acepta `postgres://` o `postgresql://` tal como lo da Railway | `${{Postgres.DATABASE_URL}}` |
| `JWT_SECRETO` | firma de los tokens de acceso (32 caracteres o más) | ver abajo |
| `DNI_CLAVE_FERNET` | clave de cifrado del DNI | ver abajo |
| `DNI_HMAC_CLAVE` | clave de la huella del DNI, para buscarlo sin descifrarlo (32 o más) | ver abajo |
| `CORS_ORIGENES` | orígenes de la app separados por coma, exactos, sin `*` | `https://mesa-de-estudios.vercel.app` |
| `CONFIAR_PROXY` | `1` detrás del proxy de Railway: la IP del límite de intentos sale de `X-Forwarded-For` | `1` |
| `APP_URL` | dirección de la app; se imprime en las tarjetas | `https://mesa-de-estudios.vercel.app` |

Para generar las tres claves:

```bash
python3 -c "import secrets; print(secrets.token_urlsafe(48))"                            # JWT_SECRETO
python3 -c "from cryptography.fernet import Fernet; print(Fernet.generate_key().decode())" # DNI_CLAVE_FERNET
python3 -c "import secrets; print(secrets.token_urlsafe(48))"                            # DNI_HMAC_CLAVE
```

**Guarda `DNI_CLAVE_FERNET` y `DNI_HMAC_CLAVE` en un gestor de contraseñas.** Si se pierde la primera, los DNI guardados ya no se pueden leer. Si cambia la segunda, la siguiente carga del CSV duplica a todos los alumnos. Cambiar `JWT_SECRETO` solo obliga a renovar el token de acceso; no cierra las sesiones.

## Desplegar en Railway

1. **New Project → Deploy from GitHub repo** → `Eltiokarma/Mesa-de-Estudios`, con la rama que tenga `servidor/`.
2. En el servicio, **Settings**:
   - **Root Directory:** `servidor`.
   - **Config as code → Railway config file:** `/servidor/railway.json`. Railway no busca ese archivo dentro de la carpeta raíz del servicio, así que se le da la ruta completa.
   - El archivo ya trae el comando de arranque (`uvicorn app.main:app --host 0.0.0.0 --port $PORT --workers 1`) y el chequeo de salud (`/api/salud`). Si no se configura, el `Procfile` arranca lo mismo.
3. **+ New → Database → PostgreSQL** en el mismo proyecto.
4. En el servicio, **Variables**, pon las ocho de la tabla. `DATABASE_URL` va como referencia: `${{Postgres.DATABASE_URL}}`.
5. **Settings → Networking → Generate Domain** (o un dominio propio, por ejemplo `api.<dominio>`). Pon el dominio de la app en `CORS_ORIGENES`.
6. Las tablas se crean solas al arrancar. Para crear el primer colegio, abre una consola en el servicio (`railway ssh` desde la carpeta enlazada, o el botón de consola del servicio) y corre:
   ```bash
   python -m app.crear_admin --general --usuario gerson --nombre "Gerson"
   python -m app.crear_admin --colegio "Nombre del colegio" --usuario coordinador --nombre "Nombre del coordinador"
   ```
7. Comprueba: `curl https://<dominio>/api/salud` responde `{"ok":true}`.
8. **Respaldos:** activa los respaldos del volumen de PostgreSQL en Railway. El DNI va cifrado dentro de la base, así que un respaldo no lo expone sin `DNI_CLAVE_FERNET`, pero los nombres sí van en claro: el respaldo es tan sensible como la base.

## Qué hay

- `app/config.py`: variables de entorno; en producción falla al arrancar si falta una clave.
- `app/modelos.py`: colegios, secciones, usuarios, alumnos, profesor_seccion, estado_alumno, eventos, habilitaciones, renovaciones, intentos_fallidos y auditoría.
- `app/seguridad.py`: argon2, JWT, renovaciones (solo el SHA-256), Fernet + HMAC del DNI, contraseñas iniciales y usuarios legibles.
- `app/union.py`: la unión del estado de `PUT /api/estado`, función pura con una prueba por regla.
- `app/lista.py`: el CSV del colegio (coma, punto y coma o tabulador; UTF-8 o el cp1252 de Excel).
- `app/tarjetas.py`: el PDF de tarjetas para recortar (10 por hoja A4).
- `app/rutas/`: `sesion`, `alumno`, `profesor`, `colegio` y `general`.

### Rutas

Las del contrato, más estas:

- `GET /api/colegio/profesores` y `PUT /api/colegio/profesores/{usuario}/secciones { secciones }`: para ver y cambiar las secciones de un profesor.
- `GET /api/general/colegios` y `GET /api/general/auditoria?colegio=&limite=`: solo el administrador general.
- `GET /api/salud`.
- El administrador general usa las rutas del colegio y `GET /api/secciones` con `?colegio=<id>`.

## Detalles que el contrato no fijaba

- **Login:** `usuario.colegio` es `{ id, nombre }` y `usuario.seccion` es `{ id, grado, letra }`. También va `usuario.usuario`.
- **Con `debe_cambiar` en verdadero**, todas las rutas con token responden **403** `debe-cambiar`, salvo `PUT /api/contrasena`. `/api/renovar` y `/api/salir` funcionan, porque no usan el token de acceso. La app debe pedir la contraseña nueva antes de `GET /api/estado`.
- **`PUT /api/contrasena`** con la actual equivocada responde **400** `contrasena-actual`. Otros errores: `contrasena-corta` y `contrasena-igual`. No cierra las otras sesiones del usuario. El reinicio que hace el profesor sí las cierra.
- **`GET /api/estado` y `PUT /api/estado`** devuelven `{ est, actualizado, habilitaciones }`; `est` ya trae `salidaHabilitada` y `solucionesHabilitadas` copiadas. Esas dos no se guardan desde el cliente.
- **Lo que el contrato no nombra en la unión:** gana el cliente si lo trae; si no, se conserva lo del servidor. Si `enCurso` empata en respuestas, gana el del cliente. `dias` se guarda ordenado, con los últimos 400, como hace la app. Una unidad que el alumno desmarcó en `vistas` vuelve, porque la regla es unir.
- **Eventos:** se descartan los que no son objeto, los que no traen `t` (texto de 1 a 40 caracteres) y los de más de 20 kB. Siguen contando en `recibidos`. Se quitan `nombre`, `nombres`, `apellidos`, `dni`, `usuario`, `contrasena`, `correo` y `telefono` del primer nivel, sin importar mayúsculas.
- **`GET /api/secciones/{id}/avance`** responde `{ seccion, habilitaciones, alumnos: [{ usuario, nombre, dias_activos, ultimo_dia, unidades_vistas, modulos_practicados, pruebas: { curso: { entrada, salida } }, practica: { modulo: { entrada, salida } } }] }`. En `entrada` y `salida` van `{ aciertos, total, fecha }` o `null`.
- **`POST /api/secciones/{id}/habilitar`**: `curso` es un id de curso en minúsculas o `todas`. Responde el estado nuevo.
- **CSV:** admite multipart (cualquier nombre de campo) o el CSV crudo en el cuerpo, hasta 2 MB y 3000 filas. Las filas se numeran como en la hoja (la cabecera es la 1). Un DNI de 7 dígitos se completa con un 0 adelante, porque Excel se come el 0 inicial. El grado se lee del primer dígito del 1 al 6 (`3`, `3.º`, `3ro`). La sección se pasa a mayúsculas y lleva de 1 a 3 letras o números. Un DNI repetido dentro del archivo es error en la segunda fila. Un DNI que ya está en el colegio actualiza nombre y sección y cuenta en `actualizados`.
- **Usuario que choca:** se le agrega 2, 3, …: `qroman26`, `qroman262`. Los apellidos con partícula se juntan: «De la Cruz» da `delacruz`.
- **Errores de acceso a lo ajeno:** responden 404 y no 403, para no confirmar que existe una sección o un alumno de otro colegio.
- **IP para el límite de intentos:** con `CONFIAR_PROXY=1` se toma la última de `X-Forwarded-For`, la que agrega el borde de Railway.

## Lo que falta

- `GET /api/resultados` (el resumen de `nucleo/medicion.js` en el servidor): fase C4. Por ahora se descarga `GET /api/colegio/eventos` y se pasa por `node herramientas/analizar-medicion.js`.
- Migraciones con Alembic: hoy las tablas se crean al arrancar, y un cambio de columnas en producción requerirá una migración.
- `GET /api/colegio/eventos` devuelve todo de una vez; con muchos meses de datos convendrá paginar.
- Desactivar cuentas (alumnos que se retiran) y borrar los datos de un colegio cuando termine el convenio.
