# Redactor de una unidad (desde la Etapa 9, 26 nov 2026)

Gerson, 26 nov: «muchas explicaciones son incoherentes por su brevedad». Antes de probar con alumnos, cada unidad pasa
por un redactor que no la escribió. Va **después del agente que la escribe y antes del auditor y los lectores en
frío**, para que ellos revisen el texto final. Las unidades que ya están cerradas lo reciben en una pasada aparte.

Quien te llama te da: `UNIDAD`, `ARCHIVO`, el árbol de trabajo y `SCRATCH`. Mismas reglas de convivencia que
`etapa-delegada.md`: sin commits ni stash/checkout/reset, toca solo tu unidad y su práctica, y lee con medida
(`node herramientas/mapa-unidad.js <UNIDAD> <idea> --texto` y `--ejemplo <n>` muestran lo que ve el alumno).

## Qué haces

1. Carga la skill `anthropic-skills:escribidor-escribano` y síguela: es el criterio de redacción del proyecto.
2. Lee **todo** el texto que ve el alumno, idea por idea: Lee, consigna y misión, lecturas en vivo y leyendas, voces,
   Predice (pregunta, opciones y `siFuera`), pasos de Mira, regla y «Vale si», «Así se resuelve» y «Ahora tú»
   (enunciado, Datos, pasos, solución y explicaciones de cada alternativa, en unas 20 semillas por idea), los 15
   ejemplos, el glosario y la práctica (enunciados, pasos y papel).
3. Reescribe lo que está telegráfico, entrecortado, ambiguo, en jerga o que no se sigue de lo anterior: frases
   completas, con sujeto y verbo, conectores donde hacen falta y el porqué dicho. Cada paso debe seguirse del anterior
   sin saltos. Un término técnico se dice en palabras la primera vez.
4. Los topes de palabras subieron el 26 nov para los textos que explican (`docs/teoria.md` §5: regla 45, condición 35,
   `siFuera` 30, paso de Mira 25, solución 30, paso de «Así se resuelve» 40). Úsalos cuando haga falta; no alargues por
   alargar. Lo que va junto al dibujo (título, voz, opción, lectura en vivo) sigue corto.

## Lo que no cambias

- **Ningún número, respuesta, distractor, dato ni dibujo.** Solo el texto. Si al redactar ves una cuenta o una
  afirmación falsa, no la arregles: anótala para el auditor.
- La notación y los colores (letras del campo `letras`, nodos de ecuación).
- Las reglas de lo previo (lecciones 4 y 16 de `etapa-delegada.md`): un texto más claro no puede delatar la respuesta
  de la Predice ni de la misión, ni el género o el número de la correcta. En verbal, la correcta no puede quedar
  como la más larga ni la más corta.
- La lectura de verbal (el texto que se estudia) es objeto de estudio: no se reescribe salvo un error de lengua.

## Al terminar

Corre las pruebas de la unidad, de su práctica y `contenido/teoria/teoria.test.js`, el validador simulando
`calidad: 2` y `node herramientas/ecuaciones-ancho.js` sobre la unidad. Escribe `rutinas/redaccion/<UNIDAD>.md`: qué
cambiaste, por tipo de problema, con tres o cuatro ejemplos de antes y después, y lo que dejaste anotado para el
auditor. Mensaje final: un resumen de cinco líneas, «Listo: sí/no» y la lista de archivos tocados.
