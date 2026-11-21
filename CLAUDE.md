# CLAUDE.md — Laboratorio de Admisión

Lee esto antes de trabajar en el repo. Responde y escribe en español peruano informal con Gerson; el contenido para alumnos va en español claro y neutro.

## Qué es

App de bajo costo para postulantes a universidades peruanas (UNI, San Marcos, UNA Puno, UNSA, UNSAAC). Cursos: física, química, aritmética, álgebra, geometría, trigonometría, razonamiento matemático y razonamiento verbal (decisión de Gerson, 4 nov 2026); el catálogo crece sin tocar código. Cada problema de examen se convierte en una escena visual donde cada variable de la ecuación está amarrada, por color, a un objeto que se ve. El documento que manda es `docs/fundacional.md`: principios, taxonomía, especificación de plantilla, arquitectura, fuentes y hoja de ruta.

## Reglas que no se rompen

1. **La física vive en el motor, nunca en el LLM.** Un modelo de lenguaje puede leer un enunciado y traducirlo a parámetros; el cálculo y el dibujo los hace código determinístico.
2. **Toda plantilla trae casos de prueba** (`casos.json`) verificados con cálculo independiente. No se publica nada que no los pase.
3. **Jugar, después predecir, después ver.** Antes de cualquier pregunta, también de una predicción, el alumno juega con la simulación (decisión de Gerson, 14 nov 2026: es obligatorio). Después, cada escena pide al menos una predicción sobre algo que todavía no vio, y bloquea el avance hasta que el alumno responda. Las opciones incorrectas salen de errores reales de postulantes. **Excepción (decisión de Gerson, 15 nov 2026):** la exploración libre (la mesa, girar y tocar sin una meta de aprendizaje) no pide predicciones ni bloquea nada; puede invitar a un reto. Cuando el alumno entra a aprender un concepto, la escena sigue esta regla tal cual (`docs/dos-entradas.md`). Leer antes de jugar (momento «Lee», 15 nov) no rompe la regla: no pregunta nada ni adelanta la respuesta de la predicción (`docs/teoria.md`, 4e).
4. **Un color por variable**, el mismo en enunciado, dibujo y ecuación.
5. **Contenido propio.** Los manuales de academia, solucionarios y libros de `fuentes/` sirven para saber qué y cómo se pregunta: nunca se copian sus problemas, soluciones, textos ni figuras al producto. **Excepción (decisión de Gerson, 12 nov 2026):** las preguntas de los exámenes oficiales de admisión de universidades públicas se pueden usar tal cual como ejercicios, citando universidad y periodo; la solución y la figura se rehacen (las de la academia no se copian), y los textos de lectura de esos exámenes, que suelen ser fragmentos de autores, no se copian. Que un ejercicio propio se parezca a uno de examen es normal y está bien.
6. **Lápiz y papel.** Cada plantilla trae de 5 a 10 problemas para resolver sin la escena.

## Estructura

```
docs/fundacional.md            documento base (copia del doc vivo en claude.ai)
docs/arquitectura.md           capas (catálogo, módulos, núcleo, app, datos), formatos de módulo y cómo agregar cursos o unidades
docs/metodo/                   cómo se construye una plantilla con subagentes (briefs del constructor, verificador y revisor); docs/metodo/unidad/: cómo se rehace una unidad de teoría (fases y encargos)
docs/pendientes.md             traspaso corto: estado más reciente, cómo arrancar y lo siguiente (léelo al empezar)
docs/pendientes-archivo.md     estados anteriores y pendientes viejos (consulta puntual, no se lee entero)
docs/historia.md               bitácora del 4 al 12 nov y lista original de la fase 0
docs/cuentas.md                diseño de cuentas, login, progreso y servidor, con el contrato de la API
docs/carga.md                  prueba de carga del servidor (14 nov 2026): dónde se rompe y qué cambiar; herramientas en servidor/carga/
servidor/                      API de cuentas y progreso (FastAPI + PostgreSQL, para Railway; ver servidor/LEEME.md); pruebas con pytest
docs/publicar.md               cómo publicar la app en Vercel (vercel.json, .vercelignore) y cómo comprobarla
docs/guia-profesores.md        guía para el profesor del colegio piloto (enlaces, pruebas, laboratorio, datos)
docs/pogil-v2-rive.md          auditoría de las escenas y dirección: POGIL v2, cinco rutas, dónde entra Rive, progresiones y orden de trabajo
docs/temario-completo.md       las 152 unidades con ruta, gesto, tramo y campos abiertos para investigar (copia de trabajo de Gerson)
docs/recorrido.md              recorrido para los ocho alumnos ficticios: avance honesto (nucleo/avance.js), prueba del tema, retomar, «Terminar», colección y muestra
docs/dos-entradas.md           decisión del 15 nov: una base, dos entradas (explorar o examen), gráficos que se adaptan y una unidad completa antes de tres
docs/plan-calidad.md           plan vigente (16 nov): contrato «se entiende sin profesor», tres filtros, molde y orden por el árbol
herramientas/revision/         mesa de revisión de Gerson (artifact con base de datos): cada cambio con su captura, Va / No va / comentario; las sesiones suben ahí lo que Gerson debe ver y leen sus respuestas (LEEME.md)
docs/molde-unidad.md           receta paso a paso de una unidad terminada (17 nov, de Magnitudes y Vectores): datos, ejemplos, notación, dibujos, práctica, comprobación
docs/teoria.md                 contrato de la teoría interactiva (molde de las 152 unidades; 4e: momentos «Lee» y «Así se resuelve»); fuentes investigadas en docs/teoria/
contenido/teoria/<curso>/<unidad>.js  teoría de cada unidad (cinco momentos por idea); lector en app/teoria.js, formato en nucleo/teoria.js
docs/3d.md                     molde del 3D: cuándo va, la pieza viva sobre nucleo/kit/vivo3d.js y la mesa 3D del laboratorio
nucleo/glosario.js             glosario por tema: una definición por curso, términos tocables en la teoría; app/datos/glosario/<curso>.json lo arma npm run catalogo
docs/escena-viva.md            contrato del rediseño: el ejercicio se cuenta solo (topes de texto, formato escena/pasos/fantasmas, kit, mascota Rive)
nucleo/kit/                    kit común de escenas: trazo, línea de tiempo y piezas (barra-porcentaje)
nucleo/mascota.js, app/mascotas/  hueco de mascotas Rive con respaldo SVG; probar.html para el diseñador
nucleo/repaso.js, app/repaso.js  cola de repaso (versión R): preguntas de generadores en días distintos y mezcladas; estado en est.repaso
nucleo/papel-opciones.js       alternativas de los problemas de papel calculadas por el motor (docs/papel-opciones.md; molde: gases)
docs/ejercicios-7000.md        plan de la tanda de ejercicios (serán más de 10 000); validador en herramientas/validar-ejercicios.js
docs/diseno.md                 sistema de diseño: colores de marca y de variables, componentes, celular y pantalla grande
catalogo/                      qué se enseña: cursos, unidades, en qué universidad entra cada una (JSON; ver catalogo/LEEME.md)
plantillas/<tema>/plantilla.json  ficha del módulo: unidades que cubre, estado, versión, archivos
docs/hoja-de-ruta.md + .json   hoja de ruta; el JSON es la fuente, se edita en http://localhost:4173/gestion/ (npm run dev)
app/                           la PWA: lee app/datos/catalogo.json (npm run catalogo lo arma desde catalogo/); sw.js la deja sin conexión
gestion/                       página del Gantt navegable y editable
nucleo/                        piezas compartidas: azar con semilla, armado de alternativas, medición (navegador y Node)
plantillas/<id>/generador.js   módulos de formato "predicciones": generan problemas con errores típicos (ver nucleo/predicciones.js)
herramientas/analizar-medicion.js  junta los datos que exportan los alumnos y resume entrada, salida y errores por módulo
herramientas/servidor.js       servidor local sin dependencias: npm run dev → http://localhost:4173
docs/vision-futura.md          ideas de Gerson para después (todos los grados, seguimiento, curar contenido externo, historia); no se desarrollan aún
docs/taxonomia-uni-2026.md     temario de física y química de la UNI (sílabo CEPRE-UNI 2026-2)
docs/taxonomia-unmsm-2026.md   temario de San Marcos (CEPRE-UNMSM 2026-I) comparado con la UNI
docs/investigacion/            informes de investigación por tema (ideas erróneas, fuentes)
plantillas/<tema>/index.html   la escena (HTML; carga motor.js de la misma carpeta)
plantillas/<tema>/motor.js     la física, sin DOM; sirve en el navegador y en Node
plantillas/<tema>/casos.json   casos de prueba del motor
plantillas/<tema>/motor.test.js  corre casos.json contra el motor (npm test o node --test)
fuentes/por-conseguir.md       lista de libros, tesis y artículos que faltan, con prioridad
herramientas/                  OCR de PDF escaneados, esquema y script de clasificación de preguntas
docs/clasificacion-unmsm.md    qué pregunta San Marcos en física y química (datos en docs/datos/)
docs/clasificacion-unmsm-admision.md  exámenes de admisión de San Marcos 2019-I a 2027-I, los ocho cursos: temas, cobertura de la app y huecos (datos en docs/datos/admision-unmsm.csv)
fuentes/drive.tsv + descargar.sh  PDF de Google Drive (simulacros y temarios de San Marcos); en una sesión nueva: bash fuentes/descargar.sh
fuentes/prospectos/            prospectos y temarios oficiales (no se versionan si son pesados o con derechos; ver .gitignore)
fuentes/examenes/              exámenes pasados
fuentes/libros/                libros y manuales de consulta
```

## Estado

**Desde el 16 nov manda `docs/plan-calidad.md`:** la app es para 5.º de secundaria y preuniversitario, la estructura es el mapa por ramas y las 152 unidades se rehacen una por una contra el contrato «se entiende sin profesor» (lector en frío y visto bueno de Gerson). No hay más rondas en paralelo. Léelo antes de tocar la teoría.

**Sesión nueva: lee `docs/pendientes.md`** (corto: estado más reciente, cómo arrancar y lo siguiente). Los estados anteriores, las auditorías del 13 nov (POGIL v2, «escena viva»: `docs/escena-viva.md` manda sobre todo ejercicio nuevo o migrado) y la lista vieja de pendientes están en `docs/pendientes-archivo.md`; ábrelo solo si necesitas una sección puntual (el índice está al final de `pendientes.md`).

- Plantillas: 251 carpetas en `plantillas/` (escenas, generadores de predicciones y lectura); la lista vive en `catalogo/` y `app/datos/catalogo.json`. `npm test` en verde (unas 12 520 pruebas al 20 nov).
- Historia del proyecto (bitácora del 4 al 12 nov y lista original de la fase 0): `docs/historia.md`. Solo se consulta si hace falta.
- App PWA con medición anónima, lápiz y papel, celular y laboratorio de cómputo, y diseño acogedor (`docs/diseno.md`).
- Público (Gerson, 16 nov 2026): 5.º de secundaria y preuniversitario. Antes se pensó en un colegio de 3.º a 5.º; 3.º y 4.º quedan para después (`docs/vision-futura.md`).

## Próximas tareas

La lista vigente está en `docs/pendientes.md` («Siguiente» del estado más reciente) y en la hoja de ruta (`docs/hoja-de-ruta.json`).

## Cómo se trabaja

- Antes de subir un cambio en una plantilla: pruebas en verde. Usa `npm run test:corto` (las mismas pruebas que `npm test`, pero solo imprime las fallas y los totales; `npm test` suelta unas 75 000 líneas). Mientras trabajas, corre solo lo tuyo: `npm run test:corto -- 'plantillas/<id>/*.test.js'`. La suite entera (unos 8 minutos) va una vez, al integrar.
- **Lectura medida (21 nov 2026), para no gastar contexto:**
  - No se leen enteros los archivos grandes: `contenido/teoria/<curso>/<unidad>.js` (hasta 340 KB), `app/teoria.js`, `nucleo/teoria.js`, `catalogo/pruebas/verificar.js`, `nucleo/avance.js` y su prueba. Para una unidad de teoría, `node herramientas/mapa-unidad.js <unidad>` da el mapa (ideas, momentos y líneas), el código de una idea o un momento, y lo que ve el alumno con `--texto` o `--ejemplo <n>`. En los demás, ubica con grep lo que buscas y lee ese tramo con sus líneas; para copiar bloques entre árboles, `herramientas/integracion/`.
  - De las etapas cerradas (`docs/etapa2/` a `docs/etapa8/`) solo se lee `decisiones.md`. Las `propuesta-*.md` y los informes de `rutinas/frio/` y `rutinas/auditoria/` son registro: se abre el de una unidad puntual si hace falta, y las búsquedas amplias se acotan para no arrastrarlos (por ejemplo, grep sobre `contenido/` o `nucleo/`, no sobre todo el repo).
  - De `docs/diseno.md`, `docs/teoria.md` y `docs/arquitectura.md` se lee la sección que toca, no el documento entero.
- Si cambia `catalogo/` o una `plantilla.json`: `npm run catalogo`. Si cambia la cáscara de la app: subir `VERSION` en `app/sw.js`.

- Cambios chicos y revisables; un commit por plantilla o por cambio de documento.
- **Presupuesto (Gerson, 13 nov 2026):** hay capital para tres planes de IA de 200 USD al mes durante tres meses, hasta el despliegue. El costo no es motivo para recortar el alcance. Lo que limita es el calendario, los límites semanales de los planes y la calidad.
- **Vectores y Rive (Gerson, 13 nov 2026):** cuando una unidad necesita un objeto dibujado, se le pide a Gerson la lista de vectores con su encargo; cuando hace falta Rive de pago, se le pide la suscripción. No se improvisa ninguna de las dos cosas. **Cambio (Gerson, 16 nov 2026):** los objetos en SVG ya no esperan: la sesión los dibuja de prueba, marcados como tales, y Gerson decide después cuáles reemplaza (`docs/plan-calidad.md`, M4). Rive de pago se sigue pidiendo.
- Antes de afirmar algo sobre evidencia pedagógica, cita la fuente en `docs/fundacional.md`.
- Si algo del documento fundacional cambia, actualiza también el doc vivo o avisa a Gerson para que lo haga.
