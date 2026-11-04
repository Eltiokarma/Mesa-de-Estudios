# CLAUDE.md — Laboratorio de Admisión

Lee esto antes de trabajar en el repo. Responde y escribe en español peruano informal con Gerson; el contenido para alumnos va en español claro y neutro.

## Qué es

App de bajo costo para postulantes a universidades peruanas (UNI, San Marcos, UNA Puno, UNSA, UNSAAC). Cada problema de examen se convierte en una escena visual donde cada variable de la ecuación está amarrada, por color, a un objeto que se ve. El documento que manda es `docs/fundacional.md`: principios, taxonomía, especificación de plantilla, arquitectura, fuentes y hoja de ruta.

## Reglas que no se rompen

1. **La física vive en el motor, nunca en el LLM.** Un modelo de lenguaje puede leer un enunciado y traducirlo a parámetros; el cálculo y el dibujo los hace código determinístico.
2. **Toda plantilla trae casos de prueba** (`casos.json`) verificados con cálculo independiente. No se publica nada que no los pase.
3. **Predecir antes de ver.** Cada escena pide al menos una predicción y bloquea el avance hasta que el alumno responda. Las opciones incorrectas salen de errores reales de postulantes.
4. **Un color por variable**, el mismo en enunciado, dibujo y ecuación.
5. **Contenido propio.** Los PDFs de `fuentes/` (manuales de academia, libros, exámenes) sirven para saber qué y cómo se pregunta. Nunca se copian sus problemas, textos ni figuras al producto.
6. **Lápiz y papel.** Cada plantilla trae de 5 a 10 problemas para resolver sin la escena.

## Estructura

```
docs/fundacional.md            documento base (copia del doc vivo en claude.ai)
docs/hoja-de-ruta.md           hoja de ruta con Gantt, estado de pendientes, plataforma (PWA) y referencia de interfaz
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
fuentes/drive.tsv + descargar.sh  PDF de Google Drive (simulacros y temarios de San Marcos); en una sesión nueva: bash fuentes/descargar.sh
fuentes/prospectos/            prospectos y temarios oficiales (no se versionan si son pesados o con derechos; ver .gitignore)
fuentes/examenes/              exámenes pasados
fuentes/libros/                libros y manuales de consulta
```

## Estado (4 nov 2026)

- Fase 0 en curso. Hecho: documento fundacional, Banco Óptico (lente sola + sistemas de 2 o 3 lentes) en `plantillas/optica-lente-delgada/`.
- Investigación de ideas erróneas en óptica (lentes): `docs/investigacion/optica-ideas-erroneas.md`. Conclusión clave: los errores conceptuales están documentados; los de cálculo (signos, sistemas, aumento total) no, y se tratan como hipótesis. Espejos esféricos: `docs/investigacion/optica-espejos-esfericos.md`, con predicciones y casos de prueba propuestos para la plantilla. Cinemática (MRUV, caída libre, tiro parabólico): `docs/investigacion/cinematica-ideas-erroneas.md`; aquí sí hay datos fuertes (Beichner 1994, Thornton y Sokoloff 1998, Prescott y Mitchelmore 2005). Dinámica: `docs/investigacion/dinamica-ideas-erroneas.md`, con el único dato peruano encontrado (FCI en 4535 alumnos de la PUCP, Castillo y otros 2013). Además: estática y energía, choques/gravitación/ondas, fluidos/calor/termodinámica, y electricidad/magnetismo/refracción/física moderna, cada uno en su informe de `docs/investigacion/`. Química: estequiometría, gases y soluciones, equilibrio/ácidos/electroquímica, y átomo/tabla periódica/enlace. Libros y artículos pendientes de conseguir: `fuentes/por-conseguir.md`.
- El motor del Banco Óptico está en `plantillas/optica-lente-delgada/motor.js`; los dos modos del HTML lo usan. `npm test` corre los 7 casos de `casos.json` y comprueba que los rayos trazados se cruzan donde la ecuación pone la imagen (14 pruebas en verde).

## Próximas tareas, en orden

1. ~~Extraer el motor de la lente a un módulo JS puro y correr `casos.json` con `node --test`.~~ Hecho. Es el patrón para las plantillas que siguen: `motor.js` + `casos.json` + `motor.test.js`.
2. Leer los prospectos/temarios que Gerson suba a `fuentes/prospectos/` y fijar la taxonomía de `docs/fundacional.md` (la UNI como techo de dificultad). UNI hecha con el sílabo del CEPRE-UNI 2026-2: `docs/taxonomia-uni-2026.md`. San Marcos hecha con el temario del CEPRE-UNMSM 2026-I: `docs/taxonomia-unmsm-2026.md`. Faltan UNA Puno, UNSA y UNSAAC.
3. Clasificar problemas reales por plantilla y medir cobertura. San Marcos hecho: `docs/clasificacion-unmsm.md` (120 preguntas distintas de 7 periodos oficiales; la fase 1 cubre solo el 5 % de su física; calorimetría, energía y circuitos cubren el 28 %). Herramientas para repetirlo en `herramientas/`. **Decisión de Gerson (4 nov 2026):** por ahora las prioridades se fijan con la UNI y San Marcos, que son los temarios más completos; cuando Gerson suba material de la UNA Puno, se reajusta.
4. Investigar, tema por tema, las ideas erróneas típicas para las opciones de predicción. Física y química completas según el temario UNI (ver la columna "Investigación" de `docs/taxonomia-uni-2026.md`); fuera quedan nomenclatura, orgánica y ecología. Lo que sigue es confirmar las hipótesis con postulantes reales (pase 2). En el Banco Óptico, agregar al explorador las predicciones "¿qué pasa si…?" propuestas en el informe (requiere trazar un abanico de rayos).
5. Construir a mano: espejos esféricos, MRUV, tiro parabólico. Interacción principal: arrastrar en pantalla táctil (celular primero) y que funcione sin conexión.
6. Recién después de 4 plantillas probadas: destilar un skill de "cómo se construye una plantilla".
7. Más adelante (no ahora): las ideas de `docs/vision-futura.md`.

## Cómo se trabaja

- Antes de subir un cambio en una plantilla: `npm test` en verde.

- Cambios chicos y revisables; un commit por plantilla o por cambio de documento.
- Antes de afirmar algo sobre evidencia pedagógica, cita la fuente en `docs/fundacional.md`.
- Si algo del documento fundacional cambia, actualiza también el doc vivo o avisa a Gerson para que lo haga.
