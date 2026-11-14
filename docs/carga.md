# Prueba de carga del servidor de cuentas (14 nov 2026)

Pregunta: ¿cuántos alumnos a la vez aguanta `servidor/` antes de fallar, dónde se rompe y qué conviene cambiar? El piloto es un colegio (unos 300 a 600 alumnos), pero la app tiene que servir a miles a la vez.

**Respuesta corta.** El servidor tal como está en `main` (un worker, pool de 15, argon2 por defecto) **se traba para siempre con unos 450 alumnos entrando en el mismo par de minutos**, y no se recupera ni cuando la carga para: hay que reiniciarlo. La causa es un interbloqueo entre los hilos de FastAPI y el pool de conexiones. Con el arreglo (rama `carga-mejoras`, un commit) ya no se traba, y lo que limita es la CPU: un worker sirve unas 130 peticiones por segundo (unos 1000 alumnos con esperas de varios segundos) y el login con argon2 sirve unos 8 ingresos por segundo en toda la máquina. Con 3 workers y argon2 en el perfil mínimo de OWASP, 2000 alumnos andan con p95 por debajo de 300 ms y 5000 entran todos sin errores, aunque con unos 10 s de espera por turno. **En ninguna corrida se perdió ni se duplicó un evento.**

Nada de esto se desplegó. Los cambios al servidor están en la rama `carga-mejoras`, y Railway despliega desde `main`: integrarlos lo decide Gerson.

## Método

- **Todo local, nunca contra Railway.** PostgreSQL 16.15 en el mismo contenedor y el servidor con `uvicorn app.main:app --workers N`. El arranque de Railway (`servidor/railway.json` y `Procfile`) usa `--workers 1`; así se midió el «antes».
- **Máquina:** 4 vCPU Intel Xeon a 2,1 GHz (sin hyperthreading), 15 GiB de RAM, Linux 6.18. El servidor y PostgreSQL quedaron fijados a los núcleos 0 a 2 y el generador al núcleo 3 (`taskset`). Versiones: FastAPI 0.162.7, SQLAlchemy 2.1.8, psycopg 3.3.9, uvicorn 0.54.0. **Railway no es igual:** sus vCPU son compartidas y de otra velocidad, la base va en otro contenedor (cada consulta suma la red interna, aquí casi cero) y la memoria tiene tope según el plan. Las cifras sirven para comparar entre configuraciones y para ver qué se rompe primero, no como capacidad de Railway.
- **Datos inventados** (`servidor/carga/sembrar.py`, directo a la base): 10 colegios, 150 aulas de 40 alumnos (6000 cuentas), un profesor por aula y un `est` de unos 11 kB por alumno (60 unidades vistas, 25 módulos de práctica, pruebas, 40 días y 40 fichas de repaso).
- **Alumno virtual** (`servidor/carga/carga.py`), copiado de `nucleo/sesion.js`: login (si falla, la persona reintenta hasta 5 veces cada 10 s) y `GET /api/estado`. Después, un turno cada 30 s: `POST /api/eventos` en tandas de 500, con 1 a 50 eventos nuevos por turno (el 10 % vuelve de estar sin señal con 500 a 1200 eventos guardados); `PUT /api/estado` si cambió (80 %) y `GET /api/estado`. Un fallo de red se repite una vez al instante, solo en eventos y estado. Un turno fallido se reintenta con espera creciente (2, 4, 8… hasta 300 s). Un 401 renueva y repite. Una vez por alumno, en un momento al azar, `POST /api/renovar` (lo que pasa a los 15 minutos). Un profesor por aula pide el avance de su sección cada 60 s. El cliente corta una petición a los 60 s (`timeout`).
- **Picos:** las aulas empiezan repartidas al azar en los primeros 2 minutos y los 40 alumnos de cada aula entran dentro de un mismo minuto. Con 5000 alumnos son 125 aulas entrando en unos 3 minutos: el timbre de las 8 en muchos colegios a la vez. Después vienen 5 minutos de uso y hasta 4 minutos de vaciado, en los que cada alumno sube lo que le falte.
- **Medidas:** p50, p95 y p99 por ruta (solo las respuestas buenas) y, además, las del «uso estable», después del pico de ingreso; errores por tipo: 5xx, `timeout` (60 s), `rechazada` (no conecta) y `cortada` (el servidor cerró la conexión); la espera de cada alumno para entrar; y CPU, memoria y conexiones a PostgreSQL cada 2 s (`carga/monitor.py`). Al final, `carga/verificar.py` compara, alumno por alumno, los eventos que el servidor confirmó con lo que quedó en la tabla `eventos`: los **perdidos** son los confirmados que faltan, y los **duplicados**, las filas repetidas de un mismo alumno y `t`.
- Para repetirlo: `bash servidor/carga/escalon.sh <alumnos> <carpeta> --duracion 300 --rampa 120 --vaciado 240` (variables `WORKERS`, `ARGON2_*` y `DB_POOL`), después de `python -m carga.sembrar`.

## Resultados

«req/s» son las respuestas buenas por segundo de uso, sin contar el vaciado. Las latencias van en milisegundos. «Estable» es después del pico de ingreso.

### Antes: `main` tal cual (1 worker, pool 5 + 10, argon2 t=3, 64 MiB, p=4)

| Alumnos | req/s | Errores | No entraron | Login p50 / p95 | Eventos p50 / p95 / p99 | Estado (GET) p95 | Avance p95 | CPU servidor media / máx. | RAM máx. | Conexiones PG |
|---|---|---|---|---|---|---|---|---|---|---|
| 100 | 14 | 0 | 0 | 103 / 142 | 13 / 20 / 33 | 14 | 135 | 10 % / 74 % | 178 MB | 4 |
| 500 | 67 | 0 | 0 | 133 / 391 | 15 / 42 / 81 | 33 | 362 | 48 % / 240 % | 480 MB | 8 |
| **1000** | **3** | **81 %** | **562** | 241 / 1454 | 55 / 796 / — | 921 | — | se traba a los 80 s | 819 MB | 16 bloqueadas |
| 2000 y 5000 | no se corrieron: con 1000 ya queda trabado | | | | | | | | | |

Con 500 alumnos, 0 perdidos y 0 duplicados (205 585 eventos). Con 1000, a los ~80 s de empezar, con unos 450 alumnos entrando, el servidor quedó con 16 conexiones `idle in transaction` y la CPU al 2 %, y así siguió media hora después de terminada la carga. 562 alumnos nunca entraron y 63 634 eventos se quedaron sin subir. Ninguno se perdió: en la app real esperan en el celular.

### Después del arreglo del interbloqueo (rama, commit «la conexión vuelve al pool…»), 1 worker

| Alumnos | req/s | Errores | Login p50 / p95 | Eventos p50 / p95 | Estado (GET) p50 / p95 | CPU media | RAM máx. | Perdidos / duplicados |
|---|---|---|---|---|---|---|---|---|
| 1000 | 118 | 0 % | 2 912 / 7 000 | 635 / 6 837 | 632 / 6 992 | 114 % | 712 MB | 0 / 0 (383 425) |
| 2000 | 102 | 0,2 % (cortadas) | 18 985 / 43 028 | 15 209 / 46 630 | 14 972 / 48 840 | 147 % | 1,65 GB | 0 / 0 (404 980) |

Ya no se traba; ahora limita la CPU de un proceso: el GIL deja un solo núcleo para Python, y lo que pasa del 100 % es argon2, que corre fuera del GIL.

### Con los arreglos de CPU (eventos en una sentencia, estado sin `jsonable_encoder`, middleware ASGI, avance sin N+1)

| Configuración | Alumnos | req/s | Errores | No entraron | Login p50 / p95 | Eventos p50 / p95 · estable p95 | Estado (GET) p95 · estable p95 | CPU media / máx. | RAM máx. | Conexiones PG | Perdidos / duplicados |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 worker | 1000 | 125 | 0 | 0 | 3 067 / 6 496 | 128 / 5 689 | 5 917 | 102 % / 277 % | 1,17 GB | 16 | 0 / 0 |
| 1 worker | 2000 | 130 | 0,3 % | 0 | 12 933 / 32 813 | 8 792 / 33 119 | 35 506 | 142 % / 281 % | 1,63 GB | 16 | 0 / 0 |
| 3 workers | 2000 | 204 | 0,3 % | 0 | 17 950 / 42 330 | 81 / 20 848 | 29 743 | 167 % / 288 % | **4,73 GB** | 46 | 0 / 0 |
| 3 workers | 5000 | 15 | **79 %** | **3321** | 26 310 / 55 140 | 16 118 / 42 307 | 46 015 | 278 % / 296 % | **7,0 GB** | 45 | 0 / 0 (ver nota) |
| 3 workers + tope argon2 (4) | 2000 | 221 | 0,1 % | 0 | 13 644 / 35 521 | 75 / 16 514 · 674 | 18 160 · 629 | 165 % / 291 % | 1,30 GB | 45 | 0 / 0 (710 959) |
| **3 workers + tope + argon2 OWASP** | **2000** | **265** | **0** | 0 | **44 / 182** | **24 / 271 · 291** | **229 · 253** | 112 % / 199 % | 1,88 GB | 43 | 0 / 0 (840 389) |
| 3 workers + tope + argon2 OWASP | 5000 | 329 | 0,2 % (cortadas) | 0 | 7 447 / 16 016 | 10 900 / 20 307 · 15 625 | 20 157 · 15 434 | 183 % / 257 % | 3,42 GB | 46 | 0 / 0 (1 214 218) |

Nota de la fila de 5000 con 3 workers y argon2 por defecto: en la base quedaron 846 eventos más que los confirmados. Son tandas que el servidor guardó pero cuya respuesta llegó tarde (`timeout`). El alumno las reenvía y no se duplican, porque la base no acepta dos veces el mismo alumno + `t`. En la misma corrida, 809 renovaciones respondieron **401 `renovacion-reusada`** (ver «Qué falla», punto 4).

Los errores `cortada` (0,1 a 0,3 %) son conexiones que el servidor cerró justo cuando el cliente las reusaba. Uvicorn cierra una conexión quieta a los 5 s y el generador las guarda 30 s. Es el mismo ECONNRESET de `docs/pendientes.md`, y la app ya lo repite una vez.

Otra comparación: argon2 aislado en esta máquina, 120 verificaciones:

| Parámetros | Un hash | Ingresos por segundo (3 hilos) | Con 40 hilos |
|---|---|---|---|
| Hoy: t=3, 64 MiB, p=4 (los de argon2-cffi) | 166 ms | 8,5 | 7,9 |
| Mínimo de OWASP: t=2, 19 MiB, p=1 | 22 ms | 85,9 | 57,3 |

## Punto de quiebre y qué falla primero

1. **Interbloqueo del pool (tal como está hoy en Railway).** Unos 450 alumnos entrando en los mismos 2 minutos bastan, y un colegio grande al timbre de las 8 está cerca. FastAPI corre la dependencia `usuario_actual` y la ruta en dos hilos distintos del mismo threadpool (40 hilos). `usuario_actual` hacía un SELECT y dejaba la transacción abierta. Con el pool lleno (15 conexiones), los 40 hilos esperaban una conexión y las 15 conexiones esperaban un hilo para terminar su ruta. La cola sin tope de peticiones de clientes que ya se fueron lo mantuvo trabado media hora después de terminada la carga. Lo confirmó `py-spy dump`: 40 hilos en `QueuePool._do_get` y 16 conexiones `idle in transaction`. El login lo empeoraba, porque calculaba argon2 (166 ms) con la conexión tomada.
2. **CPU de un solo proceso.** Arreglado lo anterior, un worker se queda en unas 125 a 130 peticiones por segundo. Cada alumno pide unas 2,8 por turno de 30 s (una cada 11 s), así que un worker aguanta unos 1000 alumnos con p95 de varios segundos y unos 700 con holgura. Perfil del GIL con 600 alumnos: inserción de eventos por ORM 14 %, `PUT /api/estado` 11 %, `jsonable_encoder` sobre el `est` 10 %, `usuario_actual` 11 % y el middleware `@app.middleware("http")` más el bucle de eventos 20 %.
3. **argon2 en el login.** Con los parámetros de hoy, la máquina entera da unos 8 ingresos por segundo; 5000 alumnos en 3 minutos piden 28. Cada cálculo pide 64 MiB, y sin tope, 3 workers con 40 hilos llegaron a **7 GB** de RAM. En Railway, con un plan de 1 o 2 GB, el proceso moriría por falta de memoria (no lo pude comprobar aquí).
4. **Renovación que vence en el cliente.** Si `POST /api/renovar` tarda más de lo que el cliente espera, el servidor ya rotó el token pero el cliente no recibió el nuevo. El siguiente intento usa el viejo, el servidor lo toma como robo y **cierra todas las sesiones del alumno** (809 casos con 5000 alumnos). Con carga, eso es una ola de alumnos expulsados.
5. **Límite de intentos por IP (no es de carga, pero rompe el piloto).** Son 5 fallos en 10 minutos por IP. Un laboratorio, o el wifi de un colegio, sale a internet por una sola IP, así que **5 alumnos que se equivocan de clave bloquean el ingreso de todo el colegio por 10 minutos**, también a los que la escriben bien. La prueba `test_limite_por_ip` lo muestra tal cual. Además, `servidor/LEEME.md` y `docs/pendientes.md` dicen que el límite vive en memoria y que por eso hay que usar un solo proceso: ya no es así, vive en la tabla `intentos_fallidos`, y varios workers cuentan lo mismo.
6. **Conexiones a PostgreSQL.** Cada worker abre hasta 15 (`pool_size` 5 + `max_overflow` 10): con 3 workers se vieron 46. El PostgreSQL de Railway trae, en principio, 100 por defecto (no verificado), así que con 6 workers ya no entran.

Lo que **no** falló en ninguna corrida: ni un evento perdido ni uno duplicado, ni con el servidor trabado ni con 5000 alumnos. Tampoco hubo errores de PostgreSQL ni del pool una vez arreglado el interbloqueo.

## Cambios propuestos (rama `carga-mejoras`)

Un commit por cambio, cada uno con `python -m pytest -q` en verde, con SQLite y con PostgreSQL (88 pruebas). No tocan la app, así que `npm test` no hace falta.

1. **La conexión vuelve al pool antes de la ruta y antes de argon2** (`dependencias.py` y `rutas/sesion.py`), con la prueba `test_usuario_actual_devuelve_la_conexion`, que falla sin el arreglo. Antes, 1000 alumnos trababan el servidor, con 81 % de errores; después, 0 errores. **Es el único imprescindible.**
2. **Eventos en una sola sentencia** `INSERT … ON CONFLICT DO NOTHING … RETURNING` en PostgreSQL; SQLite sigue igual. Sigue siendo idempotente.
3. **Avance de la sección en una consulta**, en vez de 2 por alumno (81 por sección de 40).
4. **Estado con `JSONResponse` directo**, sin que FastAPI recorra el `est` entero.
5. **Cabeceras de seguridad con un middleware ASGI puro** (con prueba nueva: no había ninguna).
   Con los cambios 2 a 5, 1 worker y 1000 alumnos, la sincronización bajó de p50 ~635 ms a ~128 ms (el p95 lo sigue dominando el pico de logins).
6. **Pool, workers y límite por IP configurables** con los valores de hoy: `DB_POOL`, `DB_POOL_EXTRA`, `WEB_CONCURRENCY` (Railway y el `Procfile` pasan a `--workers ${WEB_CONCURRENCY:-1}`) e `INTENTOS_IP_MAX`.
7. **Argon2:** tope de 4 cálculos a la vez por proceso (`ARGON2_A_LA_VEZ`, activo por defecto), parámetros por entorno (`ARGON2_T`, `ARGON2_M_KIB`, `ARGON2_P`, con los valores de hoy) y rehash al entrar cuando cambian. Solo el tope, con 3 workers y 2000 alumnos: RAM máxima de 4,73 GB a 1,30 GB. Con el perfil OWASP, el login pasó de p50 ~18 s a 44 ms.

## Recomendaciones, en orden

### Antes del piloto (un colegio)

1. **Integrar el commit 1 (interbloqueo).** Sin él, un colegio grande al timbre puede dejar el servidor trabado hasta que alguien lo reinicie. Mejor integrar la rama entera: los commits 2 a 5 no cambian ningún comportamiento.
2. **Decidir el límite por IP** (decisión de Gerson, cambia el contrato de `docs/cuentas.md`). Propuesta: `INTENTOS_IP_MAX=100`, dejando 5 por usuario. Cien intentos en 10 minutos desde una IP no alcanzan para adivinar claves de 6 caracteres de 31 símbolos (887 millones de combinaciones), y un aula equivocándose no bloquea al colegio.
3. **Corregir el LEEME y `docs/pendientes.md`:** el límite de intentos ya vive en la base, y varios workers son seguros.
4. **Railway:** `WEB_CONCURRENCY=2` (o tantos como vCPU tenga el plan) y revisar que la memoria del plan cubra unos 600 MB a 1 GB por worker en el pico. Workers × 15 conexiones debe quedar por debajo del `max_connections` del PostgreSQL de Railway.
5. **Plan del primer día:** que no entren todas las aulas en el mismo minuto, sino aula por aula. Con argon2 como hoy, un worker da unos 8 ingresos por segundo (en Railway puede ser menos).

### Antes de miles de alumnos

6. **Bajar argon2 al perfil mínimo de OWASP** (`ARGON2_T=2`, `ARGON2_M_KIB=19456`, `ARGON2_P=1`; decisión de Gerson, porque es un cambio de seguridad). Las claves viejas se siguen verificando y se rehacen solas al entrar. Es lo que más cambió el resultado: 10 veces más ingresos por segundo y la cuarta parte de memoria por cálculo.
7. **Tolerar la renovación repetida un instante** (por ejemplo, devolver el mismo par nuevo si la renovación vieja se reusa dentro de los 30 s siguientes a rotarla) en vez de cerrar todas las sesiones. Hay que diseñarlo con cuidado (cambia `docs/cuentas.md`) y no está hecho.
8. **Escalar por vCPU:** la capacidad creció casi en línea con los núcleos: 1 worker, ~130 req/s (unos 1000 alumnos); 3 workers en 3 núcleos, ~330 req/s (unos 3500). Para 5000 alumnos con p95 por debajo de 1 s hacen falta unos 5 o 6 núcleos de esta máquina, o varias réplicas detrás del balanceador de Railway. A partir de unos 6 workers, el pool necesita PgBouncer o un pool más chico por worker.
9. **Cortar la cola cuando el servidor no da abasto:** responder 503 rápido cuando hay más de N peticiones en curso (la app ya espera 2, 4, 8 s… ante un error). Así el servidor no trabaja para clientes que ya se fueron. No está hecho.
10. **`--timeout-keep-alive` mayor que el que usa el navegador** (uvicorn cierra a los 5 s), para bajar las conexiones `cortada`.
11. **`PUT /api/estado` manda el `est` entero cada turno** (11 kB o más). Un `PUT` solo cuando cambió algo que importa, o un diff, bajaría la mitad del tráfico. `GET /api/estado` en cada turno es lo que más se pide.

## No verificado

- **Railway en sí:** CPU, memoria máxima del plan, latencia de la red interna con PostgreSQL y su `max_connections`. Todo se midió en un contenedor de 4 vCPU con la base en la misma máquina.
- **El generador y el servidor comparten máquina:** el generador usó un núcleo propio (hasta 50 % de él), pero el reparto de caché y memoria entre ambos no se controló.
- **Celulares y redes reales:** la latencia del 3G o 4G de Juliaca, las conexiones que se caen a medio camino y `fetch`, que en el navegador no corta a los 60 s como el generador.
- **Por qué cada worker llega a 600 MB o 1 GB de RAM** con el perfil OWASP. Puede ser la fragmentación de malloc con 40 hilos (se probaría con `MALLOC_ARENA_MAX=2`); no lo medí.
- **Corridas largas** (horas o un día escolar entero) y el crecimiento de la tabla `eventos` con meses de datos. `GET /api/colegio/eventos` y la carga del CSV no entraron en la prueba.
- **La tolerancia a la renovación repetida y el corte con 503** (recomendaciones 7 y 9) no están implementados ni medidos.
- Cada configuración se corrió una sola vez: no hay barras de error. Las diferencias grandes (trabado o no, 8 contra 86 ingresos por segundo, 7 GB contra 1,3 GB) son claras; las de 10 o 20 %, no.
