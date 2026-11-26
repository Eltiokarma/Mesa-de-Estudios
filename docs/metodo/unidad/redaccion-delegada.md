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
   completas, con sujeto y verbo, conectores donde hacen falta. Cada paso debe seguirse del anterior sin saltos. Un
   término técnico se dice en palabras la primera vez.
4. **Explica, no solo pules** (Gerson, 26 nov, después de ver química: «los sigo notando cortos y sin mucho
   significado»). Una frase correcta pero seca no basta. El alumno estudia solo, sin profesor: el texto tiene que
   decirle qué significa cada cosa y por qué es así. En concreto:
   - **La regla** dice qué es cada término nuevo en palabras del alumno («una clase de partícula es un tipo de
     molécula o de átomo: todas las del agua son H₂O»), **por qué** vale lo que dice y un caso concreto que el alumno
     reconozca («el agua con sal se ve como una sola cosa, pero tiene dos clases de partícula: es mezcla»).
   - **El recuadro de la regla** (la `ecuacion`) se lee como frase o lleva debajo, en el texto, qué dice cada línea; un
     rótulo suelto («homogénea: 1 fase») va acompañado de qué es una fase.
   - **«Vale si»** dice la condición **y qué pasa cuando no se cumple** («…; si el sistema no está cerrado, la masa
     parece cambiar porque entra o sale gas»).
   - **Lee y Mira** cuentan una idea por tarjeta o por paso, con el porqué; nada de listas de rótulos.
   - **Los pasos de «Así se resuelve» y las soluciones** dicen qué se hace, **por qué se hace eso y no otra cosa**, y
     qué significa el resultado («sale 70 °C: es lo que falta subir en Juliaca, menos que en Lima porque allá el agua
     hierve antes»).
   - **Cada `siFuera` y cada explicación de alternativa** nombra el razonamiento equivocado con un caso («si cuentas
     el hielo como otra sustancia…»), dice por qué falla y qué se debió mirar.
   - **El glosario**: `simple` en palabras de un alumno de 5.º, con un ejemplo de su vida. Sí se reescribe: no corras
     `npm run catalogo` (lo corre la sesión al integrar); la prueba «glosario … archivos de la app al día» de
     `teoria.test.js` fallará mientras tanto, y está bien.
   - **Textos fijados en una prueba**: si una prueba exige un texto letra por letra, cambia el texto y ajusta esa
     comprobación para que siga comprobando lo mismo (no la borres).
   Puedes agregar oraciones de explicación (el porqué, un ejemplo cotidiano, qué pasaría si no), siempre que sean
   ciertas y no delaten respuestas. Lo que no cambias sigue siendo lo de abajo.
5. **«Vale si».** La app antepone «Vale si» a cada `condicion`: la condición debe continuar esa frase («Vale si el
   lado final no cae sobre un eje»), no empezar otra («Vale si Fuera de los ejes.», «Vale si Atajo: …»). Al 26 nov
   había 33 condiciones así en 14 unidades.
6. **Topes** (`docs/teoria.md` §5, subidos otra vez el 26 nov para que quepa la explicación): regla 60, condición 45,
   tarjeta de Lee 60, `siFuera` 40, paso de Mira 35, solución 40, paso de «Así se resuelve» 50. Lo que va junto al
   dibujo (título, voz, opción, lectura en vivo) sigue corto. Si algo no cabe ni así, pártelo en dos pasos o dos
   tarjetas.

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
cambiaste, por tipo de problema, con seis ejemplos de antes y después (al menos dos reglas y dos explicaciones de
alternativas, para que Gerson vea cuánto se explica ahora), y lo que dejaste anotado para el
auditor. Mensaje final: un resumen de cinco líneas, «Listo: sí/no» y la lista de archivos tocados.
