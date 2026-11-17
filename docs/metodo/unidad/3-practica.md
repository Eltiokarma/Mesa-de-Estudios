# Fase 5: práctica (generadores y lápiz y papel)

> Trabajas en /home/user/mesa-de-estudios. Lee CLAUDE.md (reglas 1, 2 y 6), docs/arquitectura.md (formato
> «predicciones»), docs/plan-calidad.md §3 y docs/molde-unidad.md (§4, §5, §5b, §7). Toma como modelo
> `plantillas/conversion-unidades/`, `plantillas/areas-volumenes/` y `plantillas/vectores-ley-cosenos/`. Español neutro.
> NO hagas commits.
>
> **Encargo**: que cada idea de `<UNIDAD>` tenga práctica. Revisa las plantillas que ya cubren la unidad
> (`plantillas/*/plantilla.json` con `<UNIDAD>` en `unidades`) y crea las que falten, una por idea si hace falta:
> `generador.js`, `generador.test.js`, `casos.json` (15–20 casos verificados con un cálculo independiente que no use el
> generador), `papel.json` (5–10 problemas, con `node herramientas/papel-generador.js`; comprueba `--revisar`) y
> `plantilla.json`; agrega la plantilla a la unidad en `catalogo/cursos/<CURSO>.json` y corre `npm run catalogo`.
>
> Reglas:
> - **`datos` como lista de líneas** (≤ 22 palabras), con una prueba en 400 semillas: lista no vacía, sin la respuesta,
>   con la fórmula de cada tipo; herramientas, no el paso hecho; sin atajos ni consejos.
> - Errores típicos reales como opciones incorrectas, cada uno mostrando el valor que produce su error y una explicación
>   que empieza por lo que el alumno hizo bien. Códigos de error de `docs/investigacion/` con su respaldo; los nuevos,
>   `respaldo: 'hipotesis'`.
> - Niveles hasta examen. Datos del mundo reales con fuente o «unos».
> - Colores por papel (§5b) en `variables`; texto «A_y» para subíndices (la app los muestra como subíndice).
> - Un generador que sirve a varias unidades separa sus tipos con `generar(semilla, { unidad })` y `TIPOS_POR_UNIDAD`
>   (modelo: `plantillas/velocidad-relativa/`).
> - `nucleo/probar-generador.js` (`probarFugas`, sin NaN, undefined ni null) pasa.
>
> Al terminar: pruebas de cada plantilla (`node --test 'plantillas/<id>/*.test.js'`), `npm test`, y capturas de 3
> problemas por plantilla en `http://localhost:4173/app/#/practica/<id>/<UNIDAD>` a 390 px. Mensaje final: tipos,
> errores, datos, pruebas, capturas y dudas para Gerson.
