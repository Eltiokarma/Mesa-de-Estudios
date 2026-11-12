# Rutina cuentas-servidor: reporte (fase C1)

Rama `rutina/cuentas-servidor`, que sale de `claude/awesome-wozniak-5etl1n`, 12 nov 2026. La tarea era construir el servidor de cuentas en `servidor/` contra el «Contrato de la API» de `docs/cuentas.md`. No se tocaron `app/`, `nucleo/` ni `plantillas/`. Fuera de `servidor/`, el único cambio es `/servidor` en `.vercelignore`.

## Qué hay

Un servidor FastAPI + SQLAlchemy 2. En producción usa PostgreSQL; en local y en las pruebas, SQLite. El detalle está en `servidor/LEEME.md`.

- **Sesión:** `POST /api/login`, `/api/renovar`, `/api/salir` y `PUT /api/contrasena`.
  - Las contraseñas se guardan con argon2.
  - El token de acceso es un JWT de 15 minutos.
  - La renovación es opaca, dura 30 días y se guarda solo su SHA-256. Rota en cada uso, con una revocación condicional para que dos pedidos simultáneos no ganen los dos. Si alguien reusa una renovación revocada, se revocan todas las de ese usuario.
  - Límite de intentos: 5 fallos en 10 minutos, por usuario y por IP, guardados en la base, así que vale entre procesos.
  - Con la contraseña inicial solo se puede cambiar la contraseña.
- **Alumno:**
  - `GET/PUT /api/estado`, con la unión regla por regla en `app/union.py` y las habilitaciones de su sección.
  - `POST /api/eventos`, idempotente por (alumno, t). Pone el seudónimo de la cuenta y quita los campos personales.
- **Profesor:**
  - `GET /api/secciones` y `GET /api/secciones/{id}/avance`.
  - `POST /api/secciones/{id}/habilitar`.
  - `POST /api/alumnos/{usuario}/reiniciar`, que además cierra las sesiones del alumno.
- **Administrador del colegio:**
  - `POST /api/colegio/alumnos`, con el CSV y, con `?formato=pdf`, las tarjetas.
  - `GET /api/colegio/alumnos`, con solo los 3 últimos dígitos del DNI.
  - `POST/GET /api/colegio/profesores` y `PUT /api/colegio/profesores/{usuario}/secciones`.
  - `GET /api/colegio/eventos`: un arreglo plano, la entrada de `herramientas/analizar-medicion.js`.
- **Administrador general:** `GET /api/general/colegios` y `GET /api/general/auditoria`. Además usa las rutas del colegio con `?colegio=<id>`.
- **DNI:**
  - Se guarda cifrado con Fernet, con una huella HMAC para no duplicar alumnos.
  - No sale en el login, el estado, los eventos, el avance, las exportaciones ni la respuesta del CSV. Hay una prueba que lo busca en todas esas salidas.
- **Aislamiento:**
  - Cada usuario ve solo su colegio, y el profesor solo sus secciones.
  - Lo ajeno responde 404, para no confirmar que existe.
- **Auditoría:** queda registro de quién cargó la lista, descargó eventos, reinició contraseñas, creó profesores, asignó secciones y abrió o cerró la salida o las soluciones. También de cada reuso de una renovación.
- **CORS** solo para `CORS_ORIGENES`. Con `ENTORNO=produccion`, el servidor no arranca si falta una clave o si `CORS_ORIGENES` trae `*`.
- **Consola:** `python -m app.crear_admin --colegio … --usuario … --nombre …`, `--general` y `--listar`.

## Cómo probarlo

```bash
cd servidor
pip install -r requirements-dev.txt
python -m pytest -q                       # 79 pruebas en verde con SQLite
PRUEBAS_DATABASE_URL="postgresql://…/mesa_pruebas" python -m pytest -q   # las mismas 79, en verde con PostgreSQL 16
```

Las pruebas cubren:
- el login y su cuerpo;
- la renovación, su reuso y su vencimiento;
- el límite de intentos por usuario, por IP, por IP detrás del proxy y al vencer la ventana;
- el cambio de contraseña y el bloqueo mientras no se cambia;
- la unión del estado, con 18 pruebas que cubren cada regla del contrato;
- la idempotencia de los eventos, también dentro de un mismo lote y entre alumnos;
- la limpieza de datos personales;
- el aislamiento entre colegios y entre secciones, y lo que ve el administrador general;
- el CSV: multipart, punto y coma con cp1252, filas malas, DNI repetido, columnas que faltan y recarga sin duplicar;
- los usuarios que chocan;
- el PDF: válido con pypdf, con varias hojas y vacío;
- las habilitaciones en `GET` y `PUT /api/estado`;
- la auditoría, `crear_admin`, CORS y la validación de producción.

Además se probó a mano uvicorn con 2 procesos sobre PostgreSQL: arranque, `crear_admin` y login. `npm test` de la raíz sigue en verde.

## Lo que Gerson tiene que hacer para desplegar

1. En Railway: **New Project → Deploy from GitHub repo** → `Eltiokarma/Mesa-de-Estudios`, con la rama que tenga `servidor/`. Esa rama aparece cuando esta rutina se integre.
2. En el servicio, **Settings**:
   - **Root Directory:** `servidor`.
   - **Railway config file:** `/servidor/railway.json`, con la ruta completa.
3. **+ New → Database → PostgreSQL** en el mismo proyecto.
4. En el servicio, **Variables**:

| Variable | Valor |
| --- | --- |
| `ENTORNO` | `produccion` |
| `DATABASE_URL` | `${{Postgres.DATABASE_URL}}` |
| `JWT_SECRETO` | salida de `python3 -c "import secrets; print(secrets.token_urlsafe(48))"` |
| `DNI_CLAVE_FERNET` | salida de `python3 -c "from cryptography.fernet import Fernet; print(Fernet.generate_key().decode())"` |
| `DNI_HMAC_CLAVE` | otra salida de `python3 -c "import secrets; print(secrets.token_urlsafe(48))"` |
| `CORS_ORIGENES` | el dominio de la app en Vercel, exacto, sin `/` al final (varios, separados por coma) |
| `CONFIAR_PROXY` | `1` |
| `APP_URL` | el mismo dominio de la app; se imprime en las tarjetas |

5. **Guarda `DNI_CLAVE_FERNET` y `DNI_HMAC_CLAVE` en un gestor de contraseñas.** Si se pierde la primera, los DNI no se pueden leer. Si cambia la segunda, la siguiente carga duplica a los alumnos.
6. **Settings → Networking → Generate Domain** y comprueba que `https://<dominio>/api/salud` responda `{"ok":true}`.
7. Desde la consola del servicio (`railway ssh`), crea tu cuenta y la del colegio:
   ```bash
   python -m app.crear_admin --general --usuario gerson --nombre "Gerson"
   python -m app.crear_admin --colegio "Nombre del colegio" --usuario coordinador --nombre "…"
   ```
8. Activa los respaldos del volumen de PostgreSQL.
9. **Antes de cargar nombres y DNI reales: el consentimiento (Ley 29733), que sigue pendiente en `docs/cuentas.md`.**

## Para la rutina de la app (C2)

Lo que el contrato no fijaba está en `servidor/LEEME.md`, «Detalles que el contrato no fijaba». Lo que más le importa a `nucleo/sesion.js`:
- `usuario.colegio` es `{ id, nombre }` y `usuario.seccion` es `{ id, grado, letra }`.
- Con `debe_cambiar` en verdadero, `GET /api/estado` responde **403** `debe-cambiar`. Hay que mostrar «Cambiar contraseña» antes de sincronizar.
- Cuando el acceso vence, la respuesta es **401** `token-vencido`: hay que llamar a `/api/renovar` y repetir el pedido. Si la renovación falla (`renovacion-invalida`, `renovacion-reusada` o `renovacion-vencida`), se vuelve al ingreso.
- `GET` y `PUT /api/estado` responden `{ est, actualizado, habilitaciones }`, con las habilitaciones ya copiadas en `est`.
- `GET /api/secciones/{id}/avance` responde `{ seccion, habilitaciones, alumnos: [...] }`.
- En local, el servidor acepta `http://localhost:4173` sin configurar nada.

## Lo que falta

- `GET /api/resultados` (fase C4). Por ahora: `GET /api/colegio/eventos` y `node herramientas/analizar-medicion.js`.
- Migraciones con Alembic: hoy las tablas se crean al arrancar, con un candado de PostgreSQL para varios procesos.
- Paginar `GET /api/colegio/eventos` cuando haya muchos datos.
- Desactivar cuentas de alumnos que se retiran y borrar los datos de un colegio al terminar el convenio.
- Una decisión para Gerson: el usuario que choca lleva un número pegado (`qroman262`), como pide la tarea, y puede leerse como otro año. Si prefiere `qroman26b`, es un cambio de una línea.
