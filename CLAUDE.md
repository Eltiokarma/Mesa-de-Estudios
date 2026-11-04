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
plantillas/<tema>/index.html   la plantilla (hoy: HTML autocontenido)
plantillas/<tema>/casos.json   casos de prueba del motor
fuentes/prospectos/            prospectos y temarios oficiales (no se versionan si son pesados o con derechos; ver .gitignore)
fuentes/examenes/              exámenes pasados
fuentes/libros/                libros y manuales de consulta
```

## Estado (4 nov 2026)

- Fase 0 en curso. Hecho: documento fundacional, Banco Óptico (lente sola + sistemas de 2 o 3 lentes) en `plantillas/optica-lente-delgada/`.
- El motor del Banco Óptico está dentro del HTML (dos IIFE, una por modo). Las pruebas de `casos.json` todavía no corren contra él.

## Próximas tareas, en orden

1. Extraer el motor de la lente (funciones `chain`, `trace`, `geo`) a un módulo JS puro y hacer que `casos.json` corra contra él con `node --test`.
2. Leer los prospectos/temarios que Gerson suba a `fuentes/prospectos/` y fijar la taxonomía de `docs/fundacional.md` (la UNI como techo de dificultad).
3. Clasificar unos 50 problemas reales (UNA Puno primero) por plantilla y medir cobertura.
4. Investigar, tema por tema, las ideas erróneas típicas (empezar por óptica geométrica) para las opciones de predicción.
5. Construir a mano: espejos esféricos, MRUV, tiro parabólico. Interacción principal: arrastrar en pantalla táctil (celular primero) y que funcione sin conexión.
6. Recién después de 4 plantillas probadas: destilar un skill de "cómo se construye una plantilla".

## Cómo se trabaja

- Cambios chicos y revisables; un commit por plantilla o por cambio de documento.
- Antes de afirmar algo sobre evidencia pedagógica, cita la fuente en `docs/fundacional.md`.
- Si algo del documento fundacional cambia, actualiza también el doc vivo o avisa a Gerson para que lo haga.
