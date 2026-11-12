# Cuentas, login y progreso: diseño (borrador del 12 nov 2026)

> Estado: diseño con las decisiones de Gerson del 12 nov 2026. En construcción: `servidor/` (fase C1).

## Por qué cambia

Hasta hoy la app no tiene servidor. Cada equipo recibe un código anónimo y todo vive en el navegador, hasta que alguien toca «Descargar» (`docs/arquitectura.md`, «Decisiones que esta arquitectura evita tomar ahora»). Gerson decidió (12 nov 2026) que el colegio entrega la lista de alumnos y que cada alumno entra con **usuario y contraseña**. Eso resuelve dos problemas que salieron en la auditoría:

- **El laboratorio:** el alumno que vuelve otro día a otra PC recupera su avance y su prueba de entrada, así que se puede emparejar con la salida.
- **Los datos:** llegan solos al servidor y no dependen de que alguien descargue un archivo en cada equipo antes de borrar el navegador.

Y trae dos obligaciones:

- **Un servidor:** cuentas, contraseñas, progreso y eventos de medición.
- **Datos personales de menores:** de 3.º a 5.º de secundaria, la mayoría tiene entre 14 y 17 años. En el Perú aplican la Ley 29733 y su reglamento: consentimiento, finalidad, seguridad y registro del banco de datos. **Hay que confirmar con un abogado o con la Autoridad Nacional de Protección de Datos qué consentimiento hace falta y quién lo da (el colegio, los padres o el alumno) antes de cargar nombres.** Este documento no lo da por resuelto.

## Principios

1. **La app sigue funcionando sin internet.** Hace falta internet para el primer ingreso en un equipo. Después se practica sin conexión y los eventos se suben cuando vuelve la señal.
2. **Datos mínimos.** Del colegio se pide nombre, grado, sección y DNI (decisión de Gerson; ver abajo). Nada de teléfono ni correo del alumno.
3. **Investigación seudónima.** La medición sigue usando un id al azar por alumno (`alumno`), como hoy. El nombre vive en otra tabla, que solo ven el colegio y Gerson. Lo que se exporta para análisis no trae nombres.
4. **Una sola fuente de verdad del progreso: el servidor.** El celular guarda una copia para trabajar sin conexión y la sincroniza.
5. **Lo que ya existe no se rehace.** El estado del alumno ya está en un solo objeto (`est`, en `app/app.js`) y los eventos en una cola (`nucleo/medicion.js`). Con cuentas, `est` pasa a ser de la cuenta y la cola se sube al servidor.

## Roles

| Rol | Quién | Qué puede hacer |
| --- | --- | --- |
| Alumno | Cada alumno del colegio | Entrar, practicar, ver su progreso y cambiar su contraseña |
| Profesor | Docentes del colegio | Ver sus secciones y el avance de cada alumno, abrir la salida y las soluciones de su sección, y reiniciar la contraseña de un alumno |
| Administrador del colegio | Coordinador del colegio | Cargar la lista de alumnos, crear profesores, asignar secciones y descargar resultados |
| Administrador general | Gerson | Todo, en todos los colegios, más los resultados anónimos para investigación |

Con esto, `?salida=fisica` y `?soluciones=` dejan de ser enlaces que se reparten: el profesor los abre desde su panel, por sección. Los enlaces pueden seguir un tiempo para el modo sin cuenta.

## Cómo se crean las cuentas

1. El colegio entrega una hoja (CSV o Excel) con apellidos, nombres, grado y sección.
2. El administrador la sube. El sistema crea un **usuario** legible, por ejemplo `qroman24` (inicial del nombre, primer apellido y año), y una **contraseña inicial** de 6 caracteres fáciles de dictar, sin 0/O ni 1/l.
3. El sistema genera un PDF con **tarjetas para recortar**, una por alumno, con su usuario y su contraseña inicial. El profesor las reparte en clase.
4. En el primer ingreso, el alumno elige una contraseña nueva. Si la olvida, el profesor la reinicia desde su panel. No hay recuperación por correo, porque los alumnos no tienen correo registrado.

## Sesión y trabajo sin conexión

- **Primer ingreso:** el servidor responde con un token de acceso de corta duración y un token de renovación de unos 30 días, más el estado del alumno (`est`). El token de renovación queda en el navegador, nunca la contraseña.
- **Sin conexión:** la app trabaja con la copia local y encola los eventos. Los eventos ya llevan una marca de tiempo única (`t`), así que reenviarlos no duplica nada.
- **Al volver la señal:** sube la cola (`POST /api/eventos`, idempotente por `alumno` + `t`), sube su `est` y baja el del servidor. Si hay conflicto, se unen: el avance se suma por módulo y las pruebas de entrada y salida no se pisan, porque cada una se hace una sola vez y gana la primera.
- **PC compartida del laboratorio:** «Cerrar sesión» sube lo pendiente y borra del navegador el estado y los tokens. Reemplaza a «Otro alumno en esta PC».
- **Un celular con varios hermanos:** igual que en el laboratorio, con cerrar sesión.

## Servidor (propuesta)

**Recomendado: FastAPI + PostgreSQL en Railway**, el mismo stack que Gerson ya usa en SAD.
- Las cuentas sin correo (usuario y contraseña que entrega el colegio) se hacen directo, sin trucos.
- Las contraseñas se guardan con argon2.
- Tiene límite de intentos por usuario y por IP.
- Todo va por HTTPS.
- La app estática sigue en Vercel y llama a `api.<dominio>`.

**Alternativa: Supabase** (Postgres, autenticación y reglas por fila ya hechas). Es más rápida de levantar, pero su autenticación está pensada para correo. Habría que inventar correos del tipo `usuario@colegio.mesa`, y las reglas de colegio, sección y profesor se escriben en SQL de Postgres. Sirve si se quiere evitar mantener un servidor.

**Tablas mínimas:**
- `colegios`
- `secciones` (colegio, grado y letra)
- `usuarios` (rol, usuario, hash de la contraseña, si debe cambiarla, colegio)
- `alumnos` (id seudónimo, usuario, sección, nombre)
- `profesor_seccion`
- `estado_alumno` (el JSON de `est` y la fecha de actualización)
- `eventos` (alumno seudónimo, `t` y el JSON del evento, con clave única `alumno` + `t`)
- `habilitaciones` (sección, curso, salida o soluciones, quién y cuándo)

**Rutas:**
- **Sesión:** `POST /api/login`, `POST /api/renovar`, `POST /api/salir`.
- **Alumno:** `GET/PUT /api/estado`, `POST /api/eventos`, `PUT /api/contrasena`.
- **Profesor:**
  - `GET /api/secciones`;
  - `GET /api/secciones/{id}/avance`;
  - `POST /api/secciones/{id}/habilitar`;
  - `POST /api/alumnos/{id}/reiniciar-contrasena`.
- **Administrador:**
  - `POST /api/colegio/alumnos` (sube el CSV);
  - `GET /api/colegio/tarjetas.pdf`;
  - `GET /api/resultados` (el mismo resumen de `nucleo/medicion.js`, en el servidor).

## Pantallas nuevas en la app

- **Ingreso:** usuario y contraseña. «¿Olvidaste tu contraseña? Pídesela a tu profesor.»
- **Cambiar contraseña:** obligatoria en el primer ingreso.
- **Perfil:** nombre, sección, cerrar sesión y cambiar contraseña. Los datos de medición ya no se descargan a mano.
- **Progreso:** el mismo de hoy, pero de la cuenta, en cualquier equipo.
- **Panel del profesor:**
  - una tabla por sección, con cada alumno, los módulos vistos, la entrada y la salida por curso, y los errores más frecuentes;
  - botones para abrir la salida y las soluciones;
  - reinicio de contraseña.
- **Panel del administrador:** subir la lista, imprimir las tarjetas y descargar resultados.

## Qué pasa con lo que ya existe

- `est` y la cola de eventos se mantienen. Se agrega una capa `nucleo/sesion.js` (tokens, sincronización y cierre de sesión), que la app usa si hay servidor.
- **Modo sin cuenta:** se puede dejar como «modo demostración» para quien abra la app sin usuario. En ese modo nada sube al servidor.
- `herramientas/analizar-medicion.js` se reutiliza en el servidor sobre la tabla `eventos`.
- La regla de la salida otro día (auditoría del 12 nov) se mantiene, y con cuentas además funciona entre equipos.

## Fases y tiempo

| Fase | Qué | Para el piloto |
| --- | --- | --- |
| C1 | Servidor: cuentas, login, estado y eventos con sincronización, carga del CSV y tarjetas en PDF | Sí, imprescindible |
| C2 | Pantallas de ingreso, contraseña y cerrar sesión, y la app sincronizando sin conexión | Sí |
| C3 | Panel del profesor: avance por sección, abrir salida y soluciones, reiniciar contraseña | Sí, en versión simple |
| C4 | Panel del administrador y resultados en el servidor | Puede ser por consola para el piloto |
| C5 | Padres, cobro y varios colegios | Después del piloto |

Con el piloto en diciembre, C1 a C3 son unas 2 a 3 semanas de trabajo con pruebas. Hay que probar el ingreso en los celulares y en las PC reales del colegio antes de la primera clase.

## Decisiones de Gerson (12 nov 2026)

1. **Servidor:** FastAPI + PostgreSQL en Railway.
2. **Datos del colegio:** nombre, grado, sección **y DNI**. El DNI sirve para no duplicar alumnos al volver a cargar la lista y para identificar sin dudas a un alumno que olvidó su usuario. Se guarda **cifrado** (no en texto plano) en la tabla de alumnos. Nunca va en los eventos, en el estado del alumno ni en las exportaciones para investigación. Solo lo ve el administrador del colegio. **No es el usuario**, para que no aparezca en las tarjetas ni en la pantalla de ingreso.
3. **Equipos:** laboratorio y celulares propios. El diseño cubre los dos casos: «Cerrar sesión» en la PC compartida y sesión de unos 30 días en el celular.
4. **Modo sin cuenta:** se mantiene como demostración, y nada de ese modo sube al servidor.

**Pendiente:**
- Consentimiento: quién lo firma y cómo. Hay que consultarlo antes de cargar nombres y DNI.
- El dominio: dónde vive la app y dónde la API.

Con el DNI pesa más el deber de seguridad. Además del cifrado del campo:
- copias de respaldo cifradas;
- acceso al panel del administrador con contraseña fuerte;
- un registro de quién descargó qué.
