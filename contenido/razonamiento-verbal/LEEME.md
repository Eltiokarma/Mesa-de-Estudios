# Banco de textos y ejercicios de razonamiento verbal

Textos propios para el formato lectura. El formato completo está en `docs/formato-lectura.md` (sección 5); los códigos de error, en `docs/investigacion/razonamiento-verbal-ideas-erroneas.md`.

- `textos/tNNN.json`: un texto con sus preguntas. Se escribe, se revisa a ciegas con un subagente aparte y recién entonces se agrega a `indice.json`.
- `ejercicios/eNNN.json`: un ejercicio suelto, con una sola pregunta y su `cuerpo`: analogía (`base`), término excluido (`terminos`), conector u oración incompleta (`oracion`, con `___`), plan de redacción y eliminación (`oraciones`, con numerales). Se revisa igual que un texto.
- `indice.json`: los textos (`textos`) y ejercicios (`ejercicios`) que la app puede usar, en orden. Solo entran los que tienen `revision.veredicto: "aprobado"`. `entrada` y `salida` son la pareja de textos de las pruebas (t000a y t000b). Un ejercicio entra solo si `plantillas/lectura-verbal/plantilla.json` ya lista su unidad (lo pide `catalogo/catalogo.test.js`).
- `frases.json`: una frase para el alumno por cada código RV ("Elegiste un detalle verdadero…").
- `banco.test.js`: corre con `npm test` y aplica las reglas de la sección 5.5 del diseño, a los textos y a los ejercicios.
- `codigos.json`: el respaldo de cada código; se genera del informe con `node herramientas/codigos-verbal.js`.

Reglas cortas para escribir un texto:

1. De 150 a 350 palabras, tema peruano, andino, de ciencia, de historia o de sociedad, escrito desde cero. Nada copiado ni parafraseado de academias, libros ni exámenes.
2. Cada dato del mundo va en `hechos`, con su fuente, para que el revisor lo verifique.
3. De 3 a 5 preguntas, con 4 o 5 alternativas. Una sola correcta, con `evidencia`, y cada incorrecta con un código RV distinto.
4. Al menos un paso previo por texto (`previo`). En idea principal, `aceptadas` son las oraciones de rol `principal`.
5. Las explicaciones no nombran letras, porque las alternativas se barajan.
6. La correcta no tiene que ser la alternativa más larga: alarga algún distractor.

Reglas cortas para un ejercicio suelto:

1. 4 o 5 alternativas, cada incorrecta con un código RV distinto. En término excluido, las alternativas son los términos; en eliminación, los numerales.
2. Prueba otros criterios antes de cerrarlo: en término excluido, que ningún criterio (origen, material, forma) deje fuera a un solo término distinto de la clave; en analogía, que ninguna otra pareja tenga la misma relación en el mismo orden.
3. En plan de redacción, `retoma` marca la oración a la que se refiere cada una ("este grano", "esa contaminación"). La distractora con RV28 debe romper un retoma y las demás no; el orden de las tarjetas no puede ser ya el correcto.
4. En eliminación, la oración que sobra tiene que sobrar por el texto mismo (impertinente, redundante o que contradice a otra oración), sin que haga falta saber algo de afuera.
