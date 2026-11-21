# Cierre de una unidad con criterio delegado: capturas para el lector, auditoría y correcciones (desde la Etapa 6)

La unidad ya tiene todas sus ideas, sus 15 ejemplos por idea y su práctica, en `main`. Tú eres el **auditor**: no la
escribiste. Mismas reglas de convivencia que siempre: otros agentes trabajan a la vez; no hagas commits ni
stash/checkout/reset; no corras `npm test` completo; servidor propio con tu PORT, cerrado por su PID; nunca `pkill`;
un solo navegador a la vez. Toca solo los archivos de tu unidad, su práctica y sus piezas.

Para leer la unidad sin abrir el archivo entero: `node herramientas/mapa-unidad.js <UNIDAD>` (`LEEME.md`, «Leer sin
gastar contexto»). Revisas todo el contenido, pero idea por idea.

## Paso 1: capturas para el lector en frío (primero, para que la sesión lance a los lectores en paralelo)
`MESA_URL=http://localhost:<PORT> node herramientas/capturas-teoria.js <UNIDAD> <SCRATCH>/lector momentos,ejemplos --entera --lector`
(si se cae por tiempo, copia la herramienta a tu SCRATCH con más espera). Comprueba que hay capturas de todas las
ideas y manda a la sesión, con SendMessage a `main`, un mensaje corto: «Capturas del lector listas en <ruta>, ideas:
<ids>». Después sigue con el paso 2 sin esperar.

## Paso 2: auditoría (`docs/metodo/unidad/5-auditor.md`)
Sigue ese encargo completo: contrato de 13 puntos (`docs/plan-calidad.md` §3), `docs/molde-unidad.md`, las reglas de
`docs/metodo/unidad/reglas-validador.md`, y **rehaz aparte todas las cuentas** (cada ejemplo, cada predicción con sus
distractores, cada misión, 200 semillas de «Ahora tú» y «Así se resuelve» por idea, los casos y el papel de la
práctica), por otro camino que el del contenido. Corre el validador simulando `calidad: 2`. Escribe el informe en
`rutinas/auditoria/<UNIDAD>.md` con el formato de los informes que ya hay ahí (graves, medias, menores, y una tabla de
reglas nuevas que propondrías para el validador).

## Paso 3: correcciones (`docs/metodo/unidad/6-correcciones.md`)
Corrige todo lo grave y lo medio, y lo menor que sea barato, cada cosa con su prueba (que falle con la versión
anterior). Anótalo en una sección «Correcciones (19 nov)» del informe. Lo que sea decisión de Gerson, no lo decidas:
tómalo con la opción que recomendarías y anótalo como «decidido por la sesión, Gerson revisa después».

## Paso 4: espera las notas del lector
La sesión te mandará los informes del lector en frío. Corrige lo que señalen (mismo criterio) y anótalo en
`rutinas/frio/<UNIDAD>.md` («Correcciones de la ronda 1»).

## Mensaje final
Graves y medias encontradas (una línea cada una) y cómo quedaron; cuentas rehechas; qué del lector se corrigió; qué
quedó para Gerson; «Listo para integrar: sí/no» y la lista exacta de archivos para el commit. No marques `calidad: 2`:
la sesión lo marca al integrar si todo está en verde.
