# Banco de textos de razonamiento verbal

Textos propios para el formato lectura. El formato completo está en `docs/formato-lectura.md` (sección 5); los códigos de error, en `docs/investigacion/razonamiento-verbal-ideas-erroneas.md`.

- `textos/tNNN.json`: un texto con sus preguntas. Se escribe, se revisa a ciegas con un subagente aparte y recién entonces se agrega a `indice.json`.
- `indice.json`: los textos que la app puede usar, en orden. Solo entran textos con `revision.veredicto: "aprobado"`. `entrada` y `salida` quedan en `null` hasta escribir la pareja de textos de las pruebas.
- `frases.json`: una frase para el alumno por cada código RV ("Elegiste un detalle verdadero…").
- `banco.test.js`: corre con `npm test` y aplica las reglas de la sección 5.5 del diseño.

Reglas cortas para escribir un texto:

1. De 150 a 350 palabras, tema peruano, andino, de ciencia, de historia o de sociedad, escrito desde cero. Nada copiado ni parafraseado de academias, libros ni exámenes.
2. Cada dato del mundo va en `hechos`, con su fuente, para que el revisor lo verifique.
3. De 3 a 5 preguntas, con 4 o 5 alternativas. Una sola correcta, con `evidencia`, y cada incorrecta con un código RV distinto.
4. Al menos un paso previo por texto (`previo`). En idea principal, `aceptadas` son las oraciones de rol `principal`.
5. Las explicaciones no nombran letras, porque las alternativas se barajan.
6. La correcta no tiene que ser la alternativa más larga: alarga algún distractor.
