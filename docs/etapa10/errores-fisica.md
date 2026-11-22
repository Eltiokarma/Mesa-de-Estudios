# Errores de Gravitación universal — etapa 10

Unidad: `fisica.gravitacion`. Elaboración propia, 22 de noviembre de 2026.

## Qué respalda cada alternativa

Los códigos `GR1-` a `GR6-` de la teoría y `GRP-` de la práctica representan **hipótesis de operaciones**. Cada alternativa se obtiene ejecutando una operación errónea concreta sobre los datos del problema; su explicación describe esa misma operación. No son diagnósticos validados ni frecuencias observadas en postulantes peruanos.

El [Newtonian Gravity Concept Inventory de Williamson, Willoughby y Prather (2013)](https://istardb.org/wp-content/uploads/tainacan-items/1018/17957/Williamson-et-al_2013_Development-of-the-Newtonian-Gravity-Concept-Inventory-1.pdf) documenta dificultades generales con la distancia, las masas y la presencia de gravedad fuera de la atmósfera. Sirve para elegir qué conceptos contrastar. No demuestra que nuestros números ni cada uno de nuestros distractores correspondan a una respuesta observada en su muestra.

El tratamiento físico se contrastó con [OpenStax, capítulo 13](https://openstax.org/books/university-physics-volume-1/pages/13-1-newtons-law-of-universal-gravitation). Las preguntas, soluciones, dibujos y bancos de semillas son propios. Las referencias completas y los límites de los modelos están en [la propuesta](propuesta-fisica.md).

## Familias y operaciones

| Idea | Operaciones que se contrastan | Condición que no debe perderse |
|---|---|---|
| Ley universal | Omitir una masa; tratar la distancia como lineal; invertir el cociente; sumar fuerzas mutuas de cuerpos distintos; sumar módulos sin sus sentidos. | La separación une centros. Las fuerzas que se suman actúan sobre el mismo cuerpo. |
| Campo y altura | Usar altura en lugar de separación central; olvidar el cuadrado; confundir masa con peso; ignorar una fuente; confundir la fuerza de apoyo con la atracción gravitatoria. | El campo se evalúa en una posición exterior y no depende de la masa de prueba. |
| Energía | Cambiar el signo o el orden de una resta; usar solo un extremo; sumar energías en lugar de restarlas; omitir el factor un medio al despejar una rapidez. | La referencia de energía es común; el trabajo gravitatorio es el opuesto del cambio de energía potencial. |
| Circular | Confundir altura y radio; omitir una raíz; usar el campo superficial a otra distancia; omitir el recorrido completo al hallar el período. | La gravedad aporta toda la aceleración centrípeta; la masa de la fuente domina. |
| Kepler | Usar un extremo como semieje; confundir fracción de área y porcentaje; invertir proporciones; usar una potencia distinta en la relación de períodos. | Se comparan órbitas alrededor de la misma fuente; el semieje describe toda la elipse. |
| Escape | Confundir rapidez circular y umbral; usar altura en vez de separación; sumar o restar rapideces linealmente al conservar energía; invertir el signo que determina un retorno. | La salida es exterior, radial hacia afuera, sin aire ni empuje posterior; la fuente permanece fija. |

## Cómo se comprueban

Las pruebas de cada idea recalculan los resultados desde sus entradas con otro procedimiento: aritmética racional, bisección, integración de la fuerza o balances físicos. Además recorren 400 semillas de cada momento generado, verifican las cifras que se muestran, las igualdades, los resultados de error y la respuesta única. La práctica añade 400 semillas por tipo y casos esperados calculados por su oráculo independiente.

La unicidad se comprueba tanto en el valor como en el texto redondeado de las alternativas. Si dos operaciones producen el mismo valor, no se presentan como respuestas distintas. Las explicaciones reconocen una parte rescatable del intento, pero no atribuyen al alumno un cambio de masa, radio o sentido que no ocurrió en ese caso.

La notación `≈` identifica resultados redondeados. Las cifras de entrada que el alumno usa son las mismas que usa el cálculo; una cifra visible redondeada no oculta otro dato interno. Los valores dados para planetas ideales no se presentan como mediciones de objetos reales.

## Identificadores de práctica

El prefijo `GRP-<TIPO>-<OPERACION>` identifica una operación dentro de uno de los 18 tipos de `fis-gravitacion`. El generador entrega `respaldo: 'hipotesis'` y este documento como fuente. Las fórmulas exactas de cada operación están en el constructor del caso y se contrastan por separado en `plantillas/fis-gravitacion/oraculo.test.js`; el código del error no sustituye ese cálculo.
