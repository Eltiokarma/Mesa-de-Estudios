# Álgebra · Sistemas de ecuaciones

Etapa 13. Propuesta de teoría para una app peruana de preparación universitaria. Público: quinto de secundaria y preuniversitario que estudia de manera autónoma en el celular. Consulta de fuentes: 21 de noviembre de 2026. Documento de diseño pedagógico; no contiene código ni un banco de problemas terminado. Los escenarios, las tarjetas y las predicciones son originales.

## 1. Resumen en 5 líneas

La unidad enseña a encontrar valores que cumplen varias condiciones al mismo tiempo.
Primero construye el significado de solución; después introduce sustitución, reducción y clasificación.
Extiende el razonamiento a tres incógnitas y a sistemas no lineales sencillos con restricciones explícitas.
La mayor dificultad es conservar todas las condiciones mientras se transforma una representación en otra.
La meta es justificar el método y verificar el resultado, incluso cuando hay ninguna, una o muchas soluciones.

## 2. Qué se pregunta en los exámenes

**Alcance de la evidencia.** Se consultaron un temario oficial de San Marcos de 2024-II y compilaciones oficiales UNI de 2012 y 2017-1. Estas últimas contienen distintas modalidades y evaluaciones del centro preuniversitario; no deben contarse como si todas fueran preguntas del examen ordinario. Una reproducción editorial aporta un ejemplo de San Marcos, pero no sustituye al cuadernillo oficial. La muestra es intencional y pequeña: permite identificar familias de tareas, no calcular frecuencias ni pronosticar un examen futuro. Las dificultades siguientes son juicios de diseño, no estadísticas de acierto.

| Tipo de pregunta | Universidad | Dificultad | Frecuencia | Fuente |
| --- | --- | --- | --- | --- |
| Resolver sistemas lineales de dos o tres variables; reconocer Gauss y Cramer | UNMSM, temario oficial 2024-II | Media; aumenta cuando se pide elegir o justificar el método | Presencia curricular confirmada; no equivale a frecuencia de examen | [F1], apartado 16.1–16.2 del temario general |
| Traducir cantidades de monedas, valor total y una condición adicional a tres ecuaciones | UNMSM 2024-II, área E, según reproducción editorial | Media: exige separar cantidad de monedas y cantidad de soles | Un caso localizado; fuente de segunda mano para el enunciado de examen | [F2], problema rotulado 35 en la reproducción consultada |
| Resolver un sistema lineal de tres incógnitas y comunicar una combinación de ellas | UNI, compilación 2012, examen especial, pregunta 23 | Media a alta por organización y control de signos | Un caso identificado; no se extrapola al ordinario | [F3], sección de examen especial, página impresa 234 |
| Combinar una ecuación cuadrática con ecuaciones lineales y reunir todas las soluciones | UNI, compilación 2012, sección de evaluación preuniversitaria | Alta: distingue candidatos y conjunto solución | Caso localizado; periodo y modalidad de esa sección deben mantenerse diferenciados | [F3], pregunta 22, página impresa 151 |
| Operar con potencias pares y reconocer varias parejas reales posibles | CEPRE-UNI, examen final incluido en compilación 2017-1 | Alta: exige estructura algebraica y control de signos | Un caso identificado, no frecuencia del examen ordinario | [F4], pregunta 19, página impresa 117 |
| Decidir afirmaciones sobre matriz de coeficientes y unicidad de solución | CEPRE-UNI, examen final incluido en compilación 2017-1 | Alta y dependiente de matrices | Un caso identificado; se reserva el lenguaje matricial para etapa 14 | [F4], pregunta 20, página impresa 117 |
| Aplicaciones y clasificación en los centros preuniversitarios de San Marcos, UNA Puno, UNSA y UNSAAC | Centros y universidades indicados | Por determinar con sus documentos completos | No hay corpus verificado suficiente en esta revisión | No se atribuyen preguntas o frecuencias no comprobadas |

**Consecuencia para la enseñanza.** Resolver un sistema de dos ecuaciones es el piso, no el techo. Se necesita interpretación, clasificación y un cierre con tres variables y casos no lineales. Cramer de orden dos puede justificarse con eliminación dentro de esta unidad; los determinantes de orden tres y la teoría de matrices pertenecen a la etapa 14. Así se conserva el orden de aprendizaje sin ocultar que el temario oficial de San Marcos menciona ambos métodos.

**Cómo deberá medirse la frecuencia en una ampliación.** Registrar convocatoria, modalidad, área, número de pregunta y tipo principal. Si una pregunta mezcla factorización y sistemas, asignar un tipo principal y uno secundario, sin contarla dos veces en el denominador. Publicar número de cuadernillos y años cubiertos. La frase «lo más frecuente» solo será admisible después de esa codificación; no se obtiene contando resultados de un buscador.

## 3. Errores típicos

DOCUMENTADO significa observado en el texto original leído. La explicación causal sigue siendo una interpretación salvo que el estudio haya investigado esa causa. HIPÓTESIS identifica una necesidad de diagnóstico de esta propuesta, no una frecuencia establecida. El estudio específico consultado corresponde a estudiantes españoles de secundaria; no se traslada automáticamente a postulantes peruanos.

| Código | Qué hace el alumno | Por qué | Etiqueta | Fuente |
| --- | --- | --- | --- | --- |
| SOL | No reconoce que la solución debe satisfacer el sistema completo | Comprensión insuficiente de «solución» | DOCUMENTADO | Muñiz-Rodríguez, Rodríguez-Muñiz y Abella Rodríguez, 2022, discusión; [F5] |
| GRA | No vincula correctamente puntos y ecuaciones de una gráfica | Dificultad de traducción entre registros | DOCUMENTADO | Muñiz-Rodríguez et al., 2022, problemas 4 y 5; [F5] |
| SIG | Omite signos al identificar coeficientes | Atención al procedimiento sin conservar el signo | DOCUMENTADO | Muñiz-Rodríguez et al., 2022, problema 3; [F5] |
| ESC | Multiplica incorrectamente un término al transformar una ecuación | Aplicación defectuosa de la equivalencia | DOCUMENTADO | Muñiz-Rodríguez et al., 2022, problema 2; [F5] |
| RED | No conecta los multiplicadores de reducción con múltiplos comunes | Procedimiento desconectado de su significado aritmético | DOCUMENTADO | Muñiz-Rodríguez et al., 2022, discusión; [F5] |
| TRA | Construye un relato que no corresponde al sistema | Dificultad de traducción al lenguaje cotidiano | DOCUMENTADO | Muñiz-Rodríguez et al., 2022, problema 6; [F5] |
| UNI | Confunde número de monedas con su valor en soles | Suma números sin conservar qué cuentan o miden | HIPÓTESIS | Hipótesis de diseño; pendiente de entrevistas locales |
| SUS | Reemplaza una letra por parte de su expresión equivalente | Interpreta sustituir como mover símbolos aislados | HIPÓTESIS | Hipótesis de diseño; no se atribuye al estudio anterior |
| DEP | Cree que dos condiciones escritas siempre dan una sola respuesta | Cuenta ecuaciones, sin evaluar si aportan información nueva | HIPÓTESIS | Hipótesis de diseño para clasificación |
| DIV | Divide entre una expresión que podría valer cero | Trata una operación condicional como si siempre fuera reversible | HIPÓTESIS | Hipótesis de diseño para parámetros |
| DOM | Acepta una solución algebraica imposible en el contexto | No incorpora positividad, integridad u otras restricciones | HIPÓTESIS | Hipótesis de diseño para modelación |
| RAM | Conserva una sola raíz o combina raíces de forma arbitraria | Extiende a todo sistema la expectativa de una única respuesta | HIPÓTESIS | Hipótesis de diseño para sistemas no lineales |

**Uso diagnóstico.** Elegir un distractor no demuestra por sí solo una concepción estable. Después de la revelación, pedir una justificación breve o una selección de la condición incumplida. El código orienta la devolución, no etiqueta al estudiante. La app debe distinguir error de lectura, error de operación y error de concepto; repetir una animación no remedia necesariamente los tres.

**Límite de la investigación.** No se halló en esta revisión un estudio peruano original que permita estimar la prevalencia de estos errores en el público de la app. Tampoco se afirma que los seis códigos documentados agoten el repertorio. Las escenas específicas y los distractores siguientes son decisiones propias informadas por esa evidencia y deben pilotearse.

## 4. Lo que la unidad da por sabido

- Operar con enteros y fracciones, especialmente restar un número negativo y distribuir un factor sobre un paréntesis.
- Entender una igualdad como dos expresiones con el mismo valor, no como una instrucción de escribir una respuesta.
- Resolver una ecuación lineal de una incógnita mediante operaciones equivalentes, incluyendo coeficiente distinto de uno.
- Sustituir un valor en una expresión y leer una pareja ordenada: primero la coordenada horizontal y después la vertical.
- Reconocer que un punto puede cumplir una ecuación y otro no. La interpretación conjunta de dos ecuaciones se enseña aquí.
- Para la sexta idea, factorizar una cuadrática sencilla o aplicar una fórmula cuadrática proporcionada; conocer área de rectángulos.
- Diferenciar una medida continua de un conteo entero y reconocer soles, centímetros y cantidades de objetos.

**Puerta de entrada.** Antes de la unidad, usar tres tareas breves: comprobar una igualdad con una sustitución, explicar una transformación equivalente y leer una pareja en una tabla. No es necesario saber resolver sistemas. Si falla el producto de un número por un paréntesis, ofrecer un apoyo localizado con una bolsa que contiene dos clases de fichas; no obligar a repetir toda la unidad de álgebra.

**Convención de lectura.** En los escenarios de monedas, x significa cantidad de monedas de un sol, y cantidad de monedas de dos soles y z cantidad de monedas de cinco soles. Esas letras no cambian de significado físico en las escenas. Para el marco rectangular de la última idea se usan u y v. Los coeficientes con subíndice son números conocidos de una ecuación; los subíndices identifican la ecuación, no son exponentes.

## 5. Las ideas, en orden

### Idea 1. Una respuesta que cumple todo

**Pregunta que responde:** ¿qué significa resolver varias condiciones a la vez?

**Aprendizaje en una frase.** Una solución asigna valores a las incógnitas y hace verdaderas todas las condiciones del problema simultáneamente.

**Objeto de la primera pantalla.** Una bandeja de cobro de una bodega, con monedas de S/ 1 y S/ 2, un comprobante y dos casilleros: «cantidad de monedas» y «dinero reunido». Las denominaciones están documentadas por el BCRP [F9]; los totales de la actividad serán datos ficticios de enseñanza. No aparecen ejes ni ecuaciones al abrir la escena.

**Lee: cuatro tarjetas.**

1. «En la caja hay monedas de dos valores. Una moneda cuenta como una pieza, pero puede aportar más de un sol».
2. «El comprobante registra cuántas piezas hay y cuánto dinero reúnen. Son dos datos sobre la misma bandeja».
3. «Llamaremos x a la cantidad de monedas de un sol y y a la cantidad de monedas de dos soles».
4. «Una propuesta indica cuántas monedas de cada clase habrá. Conservaremos juntas esas dos cantidades durante la revisión».

Estas tarjetas presentan la situación y las palabras. No muestran una bandeja que cumpla una sola condición, porque ese contraste será la predicción.

**Juega.** El alumno arrastra monedas desde dos dispensadores a la bandeja. Misión: construir una colección que coincida con los dos datos de un comprobante mostrado. El programa comprueba conteo y valor, con indicadores separados; no acepta solo el total de soles. Debe ofrecer un objetivo realizable, no negativo y con pocas piezas para evitar que la destreza al arrastrar domine la actividad. El alumno puede retirar monedas y usar controles de cantidad accesibles. La escena termina después de construir una solución; todavía no clasifica candidatas incompletas.

**Predice.** Aparece una bandeja nueva, distinta a la manipulada. La tarjeta informa que tiene el número correcto de piezas, pero reúne menos dinero que el comprobante. «¿Esta propuesta resuelve el encargo?»

| Opción | Respuesta | Vínculo diagnóstico |
| --- | --- | --- |
| A | Sí, porque coincidió uno de los datos | Incorrecta; SOL |
| B | No, porque debe coincidir también el dinero reunido | Correcta; conserva ambas condiciones |
| C | Sí, porque contar piezas es lo mismo que contar soles | Incorrecta; UNI |
| D | Sí, si intercambiamos los nombres x e y sin mover monedas | Incorrecta; TRA |

**Mira.** Se contabiliza la misma bandeja en dos recorridos: primero piezas y después valor. El comprobante se conserva fijo. Un resaltado identifica cuál condición coincide y cuál no. La animación no se limita a una cruz roja: permite explicar por qué el acierto parcial no basta. Después se muestra una candidata que sí satisface ambas condiciones, sin enseñar todavía un algoritmo para encontrarla.

**La regla, completa.** Un sistema reúne ecuaciones sobre las mismas incógnitas. Resolverlo significa encontrar todas las asignaciones que hacen verdaderas todas las ecuaciones. Una pareja ordenada (x, y) escribe primero el valor de x y luego el de y. Para el contexto de monedas, ambas cantidades deben ser enteros no negativos. Si N es el número total de monedas y M el valor numérico del dinero expresado en soles, las condiciones son x + y = N y x + 2y = M. N y M se nombran antes de escribir la relación. El número 2 representa el valor de cada moneda de dos soles, no dos monedas adicionales. Comprobar una candidata requiere sustituirla en las dos relaciones; no exige resolver desde cero.

**Así se resuelve: guion de un ejemplo original.** Presentar una pareja candidata con sus monedas visibles. Paso 1: escribir qué cuenta cada coordenada. Paso 2: sumar las cantidades y comparar con N. Paso 3: multiplicar la cantidad de cada clase por su denominación y comparar con M. Paso 4: comprobar integridad y no negatividad. Paso 5: responder si la pareja pertenece al conjunto solución, justificando cada comparación. El equipo elegirá y recalculará las cantidades finales. El producto pedagógico es la cadena de comprobaciones, no una respuesta numérica inventada en esta propuesta.

**Palabras nuevas.**

| Palabra | Explicación de todos los días | Tres ejemplos |
| --- | --- | --- |
| Incógnita | Una cantidad que todavía debemos averiguar | Monedas de un sol; monedas de dos soles; paquetes aún sin contar |
| Condición | Algo que una propuesta debe respetar | Tener cierto número de piezas; reunir cierto dinero; usar cantidades enteras |
| Solución | Una propuesta que pasa todas las comprobaciones | Una bandeja que coincide con dos datos; una pareja que cumple dos igualdades; una terna que cumple tres registros |

**Ahora tú, progresión.** Primero, elegir entre bandejas dibujadas cuál satisface dos registros. Segundo, comprobar parejas en una tabla donde algunos valores son cero. Tercero, traducir a dos ecuaciones un enunciado propio de inventario. Cuarto, decidir qué información falta para verificar una propuesta. En nivel de admisión, reconocer el sistema correcto entre cuatro modelaciones, incluyendo una que intercambia cantidad y valor. Se proporcionan denominaciones y definiciones de variables; el reto es representar y comprobar.

**Criterio de cierre.** El alumno debe poder decir qué condición falla en una pareja rechazada. Acertar por inspección de una opción no es evidencia suficiente. No se introduce todavía la clasificación por número de soluciones: saber qué cuenta como solución es anterior a preguntar cuántas existen.

### Idea 2. Cambiar una cantidad por su equivalente

**Pregunta que responde:** ¿cómo uso una condición dentro de la otra sin cambiar el problema?

**Aprendizaje en una frase.** La sustitución reemplaza una incógnita por una expresión igual a ella y conserva la otra condición para determinar su valor.

**Objeto de la primera pantalla.** La misma caja, ahora con una ficha de inventario y una tira de casilleros para todas las monedas. Los espacios ocupados por monedas de dos soles dejan visible cuántos faltan para completar el total. Es una representación del complemento de un conteo, no una fórmula escrita de entrada.

**Lee: tres tarjetas.**

1. «La tira tiene tantos espacios como monedas debe haber en total. Cada espacio se ocupa con una moneda».
2. «Al fijar cuántas monedas de dos soles usaremos, quedan determinados los espacios para las de un sol».
3. «Una expresión puede describir una cantidad sin indicar todavía su valor. Usaremos esa descripción para seguir una segunda condición».

No se muestra el reemplazo dentro de una expresión con multiplicador. Ese es el caso nuevo reservado para predecir.

**Juega.** Mover un control que elige y; los espacios restantes se llenan con monedas de un sol. Misión: completar la tira y alcanzar el dinero exacto del comprobante. La app conserva el total de piezas mientras cambia el valor monetario. La meta comprueba las dos relaciones originales, no solo el éxito aparente del mecanismo. Los límites del control evitan cantidades negativas, pero permiten cero. Un mensaje descriptivo muestra qué dato permanece igual y cuál cambia, sin presentar aún el nombre del método.

**Predice.** Un segundo registro describe dos cajas idénticas al inventario de la tira. «Cuando la cantidad de monedas de un sol se describe como “total de piezas menos monedas de dos soles”, ¿qué debemos contar dos veces para representar esas dos cajas?»

| Opción | Respuesta | Vínculo diagnóstico |
| --- | --- | --- |
| A | Solo el total de piezas; el descuento se hace una vez | Incorrecta; ESC |
| B | Solo las monedas de dos soles | Incorrecta; SUS |
| C | La descripción completa de las monedas de un sol | Correcta; sustituye una cantidad por todo su equivalente |
| D | El dinero de una caja, aunque el registro pida piezas | Incorrecta; UNI |

**Mira.** Duplicar visualmente la caja completa. Cada copia conserva tanto los espacios totales como los ocupados por monedas de dos soles. Después reunir las dos copias en una expresión con paréntesis. El alumno ve que el paréntesis protege una cantidad completa; no es un adorno ni una orden arbitraria de cálculo.

**La regla, completa.** Si una ecuación establece x = N − y, puede reemplazarse cada aparición de x por la expresión completa N − y en la otra ecuación. Se usan paréntesis cuando un factor o un signo afecta a toda la expresión. Se resuelve la ecuación resultante, se recupera la incógnita restante y se verifica la pareja en las condiciones originales. Si se despeja dividiendo por un coeficiente, ese coeficiente debe ser distinto de cero; si no lo es, se elige otro despeje o se analiza el caso. Igualación es una variante: si ambas condiciones expresan la misma incógnita mediante otras expresiones, esas expresiones deben ser iguales. No se igualan cantidades de significado o unidad diferentes. Referencia conceptual de los métodos: [F6].

**Así se resuelve: desarrollo simbólico completo.** Para x + y = N y x + 2y = M, despejar x = N − y. Sustituir: (N − y) + 2y = M. Reducir términos semejantes: N + y = M. Obtener y = M − N. Recuperar x = N − (M − N) = 2N − M. Verificar el conteo: (2N − M) + (M − N) = N. Verificar el dinero: (2N − M) + 2(M − N) = M. Finalmente, el contexto exige N y M enteros, N no negativo y N ≤ M ≤ 2N. Esta condición de validez no se memoriza: se obtiene exigiendo x e y no negativos. El equipo sustituirá valores propios y comprobará que el escenario tenga sentido.

**Palabras nuevas.**

| Palabra | Explicación de todos los días | Tres ejemplos |
| --- | --- | --- |
| Despejar | Dejar una cantidad sola para ver de qué depende | Aislar x en el conteo; aislar y en una relación; aislar una longitud en un perímetro |
| Sustituir | Poner otra descripción de la misma cantidad en su lugar | Cambiar x por N − y; cambiar un total por su suma; cambiar una cantidad conocida por su valor |
| Equivalente | Distinto en la escritura, igual en lo que representa | Una cantidad y su descripción; dos sumas iguales; dos registros de una misma colección |

**Ahora tú, progresión.** Completar una sustitución con casilleros; seleccionar los paréntesis necesarios; resolver con una incógnita ya despejada; escoger entre dos despejes válidos; modelar dos registros y justificar por qué sustitución es conveniente. En nivel de examen, incorporar fracciones o un valor pedido como combinación de las incógnitas, manteniendo números y unidades explícitos. No introducir parámetros que obliguen a discutir división por cero antes de la idea 4.

**Retroalimentación específica.** Para SUS, regresar a la descripción completa encerrada en un recuadro. Para ESC, comparar dos copias completas. Para UNI, mostrar el rótulo de la cantidad solicitada. La ayuda debe señalar el paso afectado y permitir corregirlo; entregar inmediatamente la pareja final impediría observar si el alumno comprendió el reemplazo.

### Idea 3. Restar registros para aislar una cantidad

**Pregunta que responde:** ¿por qué sumar o restar ecuaciones ayuda a encontrar las incógnitas?

**Aprendizaje en una frase.** La reducción combina condiciones equivalentes para cancelar una incógnita y conserva suficiente información para recuperar las demás.

**Objeto de la primera pantalla.** Dos bandejas de una feria escolar muestran combinaciones repetidas de paquetes cerrados de monedas. Cada paquete de un mismo color tiene la misma composición desconocida. Junto a cada bandeja aparece su registro de valor. Al comienzo se ven objetos iguales que pueden emparejarse; las filas algebraicas se revelan después. Las cantidades físicas x e y siguen asociadas a las denominaciones fijadas en la unidad.

**Lee: cuatro tarjetas.**

1. «Dos registros pueden compartir una parte. Compararlos permite atender a lo que cambia».
2. «Repetir una colección repite todas sus piezas y también su valor total».
3. «El número que acompaña a una incógnita indica cuántas veces participa esa cantidad. Se llama coeficiente».
4. «Guardaremos los registros originales para comprobar cualquier propuesta que aparezca al transformar las cuentas».

**Juega.** Elegir cuántas copias completas de cada registro se colocan lado a lado y emparejar paquetes de una misma clase. Misión: dejar la misma cantidad de esos paquetes en ambas filas para que la comparación revele solo la diferencia de la otra clase. La app comprueba igualdad de los coeficientes seleccionados, repetición del registro completo y una operación válida. Solo se usan copias positivas en esta exploración. El caso de coeficientes con signos opuestos queda reservado para predecir.

**Predice.** Se muestra un registro de entradas y salidas de paquetes: una fila representa una contribución positiva de la cantidad elegida y la otra una contribución negativa de igual tamaño. «¿Qué comparación elimina esa contribución común?»

| Opción | Respuesta | Vínculo diagnóstico |
| --- | --- | --- |
| A | Restarlas siempre, porque eliminar significa restar | Incorrecta; RED |
| B | Sumarlas, porque las contribuciones tienen igual tamaño y signos opuestos | Correcta |
| C | Sumar los tamaños e ignorar los signos | Incorrecta; SIG |
| D | Multiplicar solo la incógnita, dejando intacto el resto del registro | Incorrecta; ESC |

**Mira.** Usar fichas de entrada y devolución claramente rotuladas; no presentar monedas de masa negativa. Al juntarlas, una entrada y su devolución se compensan. Luego mostrar la suma de las ecuaciones, término a término, incluido el término independiente. Conservar una ecuación original a un lado demuestra que la cancelación ayuda a resolver, pero no reemplaza todo el sistema por una sola condición.

**La regla, completa.** Se puede intercambiar el orden de las ecuaciones, multiplicar una ecuación completa por una constante no nula y reemplazar una ecuación por ella más un múltiplo de otra. Estas operaciones conservan el conjunto solución. Para cancelar por suma, los coeficientes deben ser opuestos; para cancelar por resta, iguales. Cuando se necesitan multiplicadores, buscar múltiplos comunes reduce el trabajo, pero usar cantidades mayores también puede ser válido. Tras cancelar, se resuelve la ecuación de una incógnita y se utiliza otra condición conservada para recuperar la restante. Multiplicar por cero elimina información y no es una transformación equivalente. Conservar únicamente la suma de las ecuaciones tampoco garantiza equivalencia con el sistema inicial.

**Así se resuelve: ejemplo simbólico comentado.** Tomar las dos relaciones de la caja: x + y = N y x + 2y = M. Restar la primera a la segunda: (x + 2y) − (x + y) = M − N. Explicar por qué el signo menos afecta a ambos términos del segundo paréntesis. Se obtiene y = M − N. Conservar x + y = N y recuperar x = N − y. Verificar en el registro monetario original. Después mostrar un segundo sistema propio con coeficientes enteros no iguales: el ejemplo resuelto explicará cómo escoger múltiplos, multiplicar toda la fila y decidir suma o resta antes de ejecutar. El equipo fijará los números y revisará cada operación.

**Palabras nuevas.**

| Palabra | Explicación de todos los días | Tres ejemplos |
| --- | --- | --- |
| Coeficiente | Cuántas veces aparece una cantidad en una cuenta | Un paquete; dos copias de un paquete; tres contribuciones iguales |
| Cancelar | Hacer que dos aportes se compensen en una comparación | Una entrada y su devolución; dos partes iguales al restar; términos opuestos al sumar |
| Reducción | Transformar el problema hasta que quede una cantidad menos por averiguar | Quitar x por comparación; quitar y por suma; pasar de tres cantidades a dos |

**Ahora tú, progresión.** Reconocer qué variable ya puede cancelarse; elegir suma o resta; corregir una multiplicación incompleta; comparar dos multiplicadores válidos; completar un sistema resuelto dejando visible la ecuación conservada. En nivel de examen, elegir la combinación que obtiene directamente una expresión pedida, siempre justificando qué información usa. El método rápido debe surgir de la estructura; no se enseña una colección de movimientos sin motivo.

**Criterio de cierre.** Pedir al alumno que explique por qué puede regresar desde el sistema transformado al inicial. No hace falta formalizar una demostración abstracta, pero sí reconocer que multiplicar por un número no nulo es reversible y que la ecuación conservada permite deshacer la combinación. Esta reversibilidad prepara la clasificación siguiente.

### Idea 4. ¿Una respuesta, muchas o ninguna?

**Pregunta que responde:** ¿dos condiciones siempre determinan una única pareja?

**Aprendizaje en una frase.** El número de ecuaciones no basta: importa si las condiciones son independientes, repiten información o se contradicen.

**Objeto de la primera pantalla.** Una libreta de inventario con dos comprobantes sobre la misma caja. Uno cuenta piezas; el otro registra una copia del conteo hecha por otra persona. El soporte vuelve visible que dos papeles no son necesariamente dos datos nuevos. Después aparecen tablas y rectas como representaciones de esos registros; la libreta permanece junto a ellas.

**Lee: cuatro tarjetas.**

1. «Un registro puede escribirse de distintas maneras. Copiarlo en otra hoja no cambia la colección que describe».
2. «Cada ecuación admite ciertas parejas. Una tabla permite conservar ejemplos de las parejas que cumplen una condición».
3. «Una recta puede reunir las parejas de una ecuación lineal en el plano. Sus puntos se leen con el orden horizontal y vertical».
4. «Compararemos las parejas admitidas por ambos registros. Las letras conservarán el mismo significado en las dos representaciones».

Las tarjetas no anuncian los tres resultados posibles. El juego explora repetición de información; la contradicción es el caso nuevo.

**Juega.** Mover un sello de «copia doble» sobre uno de los registros. El programa duplica todos sus términos, no solo el total. Misión: crear dos escrituras diferentes que acepten exactamente las mismas bandejas candidatas de una colección de prueba. La validación comprueba la relación algebraica, no solo las pocas candidatas visibles. Después, al desplegar el registro gráfico, las dos rectas coinciden. Para el objeto físico hay un conjunto finito de conteos admisibles; la prolongación de la recta representa el sistema sobre números reales. Esa diferencia se nombra, no se disimula.

**Predice.** Se cambia únicamente el total de uno de los registros duplicados; las contribuciones de cada tipo de moneda quedan iguales. «¿Puede una misma bandeja cumplir los dos registros?»

| Opción | Respuesta | Vínculo diagnóstico |
| --- | --- | --- |
| A | Sí, porque dos ecuaciones siempre determinan una pareja | Incorrecta; DEP |
| B | Sí, basta que cumpla cualquiera de las dos | Incorrecta; SOL |
| C | No, porque se exige a la misma suma dos totales diferentes | Correcta |
| D | Sí, si intercambiamos las coordenadas del dibujo aunque los registros no cambien | Incorrecta; GRA |

**Mira.** Aplicar la reducción ya aprendida. Si desaparecen las incógnitas y queda una igualdad falsa entre constantes, no puede existir una bandeja que cumpla ambas condiciones. En el gráfico se ven rectas paralelas distintas. Luego contrastar con una igualdad verdadera que no agrega restricciones y con dos rectas que se cruzan. La revelación incluye el significado de cada caso y no pide memorizar solo la posición de líneas.

**La regla, completa.** Sobre los números reales, un sistema lineal de dos variables puede tener una única solución, ninguna o infinitas. Se llama compatible si tiene al menos una; compatible determinado si tiene una sola; compatible indeterminado si tiene infinitas; incompatible si no tiene ninguna. Una igualdad como 0 = 0 no significa que las incógnitas sean cero: significa que esa ecuación transformada no agrega una restricción. Una igualdad como 0 = c, donde c es una constante no nula, es una contradicción. Si existe una ecuación no trivial y las demás la repiten, los pares que la cumplen forman infinitas soluciones reales. Con restricciones de contexto, como cantidades enteras no negativas, el conjunto admisible puede ser finito o incluso vacío.

Para dos ecuaciones a₁x + b₁y = c₁ y a₂x + b₂y = c₂, los símbolos a₁ y a₂ son coeficientes de x, b₁ y b₂ coeficientes de y, y c₁ y c₂ términos independientes. Definimos Δ, leído «delta», como a₁b₂ − a₂b₁. Al eliminar se obtiene Δx = c₁b₂ − c₂b₁ y Δy = a₁c₂ − a₂c₁. Si Δ no vale cero, la división es válida y produce una única pareja. Esta es la regla de Cramer de orden dos, aquí derivada de la reducción. Si Δ vale cero, no se divide: se examinan las ecuaciones para distinguir coincidencia y contradicción. Las proporciones entre coeficientes solo se usan cuando sus denominadores no son cero; la reducción funciona también con coeficientes nulos. Si las dos ecuaciones se reducen a igualdades verdaderas sin incógnitas, todo par real es solución.

**Así se resuelve: guion con parámetro.** Usar una familia original donde la segunda ecuación sea λx + λy = M y la primera x + y = N; λ, leído «lambda», es un número conocido que puede cambiar entre casos. Restar λ veces la primera de la segunda. Queda 0 = M − λN. Si M = λN, la segunda condición no añade información y permanecen los pares que cumplen la primera. Si M es distinto de λN, hay contradicción. Esto incluye λ = 0 sin dividir por λ. En el contexto de monedas, examinar después qué pares son enteros no negativos. La exposición termina verificando una pareja y mostrando por qué no hay que confundir «infinitas soluciones reales» con «infinitas bandejas físicas».

**Palabras nuevas.**

| Palabra | Explicación de todos los días | Tres ejemplos |
| --- | --- | --- |
| Compatible | Las condiciones pueden cumplirse juntas | Dos registros que coinciden con una bandeja; rectas con un punto común; dos copias de una condición |
| Contradicción | Dos exigencias que no pueden ser verdaderas a la vez | El mismo total es distinto; una igualdad numérica falsa; dos registros irreconciliables |
| Parámetro | Un dato que cambia de una versión del problema a otra | Multiplicador λ; un total fijado antes de resolver; un coeficiente que selecciona un caso |
| Dependencia | Una condición repite información de otra | Un registro duplicado; una ecuación multiplicada completa; dos rectas coincidentes |

**Ahora tú, progresión.** Clasificar registros verbales; interpretar una ecuación final sin incógnitas; asociar tabla, sistema y gráfico; analizar coeficientes con ceros; hallar valores de un parámetro que cambian la compatibilidad. En nivel de examen, decidir afirmaciones sobre una familia de sistemas justificando cada caso. La hoja de apoyo incluye operaciones equivalentes y las expresiones de Cramer: la evaluación mide si se cumplen sus condiciones de uso.

**Cuidado de diseño.** No usar una imagen de dos rectas que parecen paralelas para concluir exactamente que no se intersectan: la representación debe corresponder a ecuaciones verificadas. Un acercamiento visual puede sugerir; la relación algebraica certifica. Tampoco marcar como incorrecta una solución racional solo porque la escena inicial tuvo monedas: cuando se resuelve sobre reales debe decirse expresamente.

### Idea 5. Tres cantidades, una cadena de comprobaciones

**Pregunta que responde:** ¿cómo se organiza un sistema cuando aparece una tercera incógnita?

**Aprendizaje en una frase.** La eliminación sucesiva reduce un problema de tres incógnitas a otro de dos y recupera después la terna completa.

**Objeto de la primera pantalla.** La caja incorpora monedas de S/ 5 y tres fichas: total de piezas, total en soles y un registro parcial de ciertas denominaciones. Las monedas reales justifican el objeto [F9]; los datos de inventario son ficticios. El número z nombra desde aquí la cantidad de monedas de cinco soles. No se abre con una matriz ni con tres planos flotando.

**Lee: tres tarjetas.**

1. «La nueva denominación añade otra cantidad por averiguar. Usaremos z para las monedas de cinco soles».
2. «Una propuesta ahora tiene tres cantidades en orden: monedas de uno, de dos y de cinco soles».
3. «Los registros parciales también hablan de la caja completa. Conservaremos qué clases de monedas incluye cada uno».

**Juega.** Manipular tres contadores de monedas para cumplir los tres registros. Misión: construir una terna válida y señalar qué ficha revisa cada dato. La app valida las condiciones de manera independiente. Después permite emparejar registros para quitar una denominación en dos comparaciones distintas. El caso del juego tendrá datos independientes y una única solución admisible; no incluye todavía la predicción sobre tres registros redundantes.

**Predice.** Se muestran tres comprobantes nuevos. El segundo es el doble del primero y el tercero es el triple del primero, incluyendo sus totales. «¿Los tres registros garantizan conocer una única terna de cantidades reales?»

| Opción | Respuesta | Vínculo diagnóstico |
| --- | --- | --- |
| A | Sí, porque hay tres incógnitas y tres comprobantes | Incorrecta; DEP |
| B | No, porque repiten la misma información | Correcta |
| C | Sí; basta hallar una terna que cumpla el primer comprobante para demostrar que es la única | Incorrecta; SOL |
| D | Sí, al restar desaparecerán las incógnitas y eso obliga a que todas sean cero | Incorrecta; DEP |

Compartir un código entre dos distractores es admisible: son manifestaciones distintas del mismo error. Ninguna opción incorrecta queda sin vínculo.

**Mira.** Reducir los comprobantes y mostrar dos igualdades verdaderas sin incógnitas. Conservar la condición restante y exhibir dos ternas reales diferentes que la cumplan. Esta demostración refuta unicidad; no basta con una animación que diga «faltan datos». Después regresar al inventario con registros independientes y mostrar cómo la eliminación produce una secuencia útil.

**La regla, completa.** Una solución de tres variables es una terna ordenada que satisface todas las ecuaciones. Para resolver por eliminación, escoger una variable, eliminarla entre dos pares de ecuaciones y formar un sistema de dos variables. Resolver ese sistema y sustituir en una ecuación conservada para recuperar la tercera cantidad. Verificar la terna en las tres originales. Cuando el proceso deja una contradicción, no existe solución; si quedan variables libres sin contradicción, existen infinitas soluciones reales. Tres ecuaciones no aseguran unicidad. El método de Gauss organiza estas operaciones en forma escalonada: cada ecuación útil contiene menos incógnitas que la anterior y la recuperación se hace desde la última. Puede enseñarse con ecuaciones antes del lenguaje matricial. Referencia de organización: [F7].

**Así se resuelve: diseño de la explicación.** Presentar x + y + z = N, x + 2y + 5z = M y x + 2y = H. H representa el valor numérico en soles reunido solo por las monedas de uno y dos soles. Primero restar el tercer registro al segundo para aislar la contribución de las monedas de cinco soles: 5z = M − H. Obtener z = (M − H)/5. En el conteo total, formar x + y = N − z. Conservar x + 2y = H y reducir como en la idea 3. Recuperar y y luego x; no hace falta resolver nuevamente las tres ecuaciones desde cero. Antes de aceptar el inventario, exigir que M − H sea un múltiplo no negativo de cinco y que las otras cantidades sean enteros no negativos. El equipo elegirá datos que cumplan esas condiciones y comprobará el ejemplo numérico.

**Palabras nuevas.**

| Palabra | Explicación de todos los días | Tres ejemplos |
| --- | --- | --- |
| Terna | Tres valores escritos en un orden acordado | Cantidades de tres monedas; tres conteos de inventario; valores de tres incógnitas |
| Escalonar | Organizar el trabajo para ir reduciendo lo que falta | Tres incógnitas a dos; dos a una; recuperación desde el último registro |
| Variable libre | Una cantidad que puede elegirse dentro de las restricciones y determina otras | Un conteo permitido; una coordenada real; un valor que recorre una familia de soluciones |

**Ahora tú, progresión.** Comprobar una terna; identificar la pareja de registros que elimina una variable; completar una eliminación sucesiva; detectar una tercera ecuación redundante; modelar conteo, valor y registro parcial. En nivel de examen, solicitar una combinación como la suma de las cantidades o el valor de una denominación y pedir al alumno que decida si conviene resolver todo o usar una combinación de ecuaciones. La devolución debe reconocer los dos caminos válidos.

**Accesibilidad y carga de lectura.** Mantener los tres registros visibles con un botón para leer su significado. Al transformar una ecuación, mostrar su procedencia verbal: «segundo registro menos tercero». La ayuda se retira gradualmente; en la práctica final quedan los datos y el formulario. No se exige manipular una escena tridimensional para comprender un sistema de tres variables.

### Idea 6. Cuando las condiciones no son rectas

**Pregunta que responde:** ¿qué cambia si una condición contiene un producto o una potencia de las incógnitas?

**Aprendizaje en una frase.** Los sistemas no lineales se resuelven conservando todas las ramas posibles y verificando cada candidata en el problema original.

**Objeto de la primera pantalla.** Un taller escolar arma marcos rectangulares para un aviso de una feria local. Se ven listones, una cinta métrica y la superficie que debe cubrir el aviso. u es el largo del marco y v su ancho, ambos en centímetros; son letras nuevas para no reutilizar x e y con otro significado. La medida del marco es un dato didáctico por elegir, no una medida atribuida a un establecimiento real.

**Lee: cuatro tarjetas.**

1. «El borde usa listones y el interior recibe el aviso. Medir el borde y medir lo que cubre el aviso son tareas distintas».
2. «Llamaremos u al largo y v al ancho. Ambas medidas deben ser positivas para formar un rectángulo».
3. «Una condición que multiplica dos cantidades desconocidas no es lineal. Una sustitución puede seguir siendo útil».
4. «Una candidata se conserva hasta comprobar todas las condiciones. No elegiremos una respuesta solo porque parezca familiar».

**Juega.** Mover largo y ancho de un marco manteniendo el perímetro indicado; el material para listones impone ese límite. Misión: alcanzar un área objetivo posible. La app verifica perímetro y área con las medidas proporcionadas, admitiendo la tolerancia de la interacción y exigiendo el valor exacto cuando se pasa al registro numérico. En el juego se fija la orientación «largo mayor o igual que ancho», y no se muestra una segunda configuración girada. La predicción cambia esa condición explícitamente.

**Predice.** Se presenta un encargo nuevo cuyo largo y ancho son distintos y satisfacen el borde y el área requeridos. Ahora el aviso puede girarse y el enunciado ya no exige «largo mayor que ancho». «¿Qué ocurre al intercambiar las dos medidas?»

| Opción | Respuesta | Vínculo diagnóstico |
| --- | --- | --- |
| A | Se conserva el área, pero necesariamente cambia el perímetro | Incorrecta; TRA |
| B | Sigue cumpliendo ambas condiciones y produce otra pareja ordenada | Correcta |
| C | No puede ser solución porque un sistema siempre tiene una sola pareja | Incorrecta; RAM |
| D | Es válida cualquier pareja que conserve solo el área | Incorrecta; SOL |

**Mira.** Girar el marco, comparar las medidas del borde y del interior y conservar ambas parejas ordenadas. Explicar que el mismo objeto geométrico sin orientación puede corresponder a dos asignaciones si las variables están asociadas a posiciones. Si la condición original impusiera u ≥ v, la pareja invertida podría quedar fuera; no se cambia el dominio sin avisar.

**La regla, completa.** Un sistema es no lineal cuando al menos una condición no es una ecuación de primer grado en todas sus incógnitas. Pueden aparecer productos, potencias u otras funciones. Sustitución y eliminación siguen siendo herramientas, pero las transformaciones deben conservar su dominio. Dividir por una expresión elimina el caso en que esa expresión vale cero; elevar al cuadrado puede introducir candidatas adicionales. Cuando una ecuación produce varias raíces, cada una debe utilizarse para recuperar su valor asociado de la otra variable. No se combinan libremente raíces de distintas ramas. Toda candidata se comprueba en las ecuaciones iniciales y en las restricciones del contexto. Un sistema no lineal puede tener diversas cantidades de soluciones; la clasificación «cero, una o infinitas» de la idea 4 era propia de sistemas lineales.

Para el marco, P representa el perímetro y A el área. Las condiciones son 2u + 2v = P y uv = A. Definir s = P/2, llamado semiperímetro, permite escribir u + v = s. Sustituir v = s − u produce u² − su + A = 0. El discriminante D = s² − 4A determina cuántas raíces reales tiene esa cuadrática: dos si es positivo, una repetida si es cero y ninguna si es negativo. Esto describe la ecuación reducida; todavía deben comprobarse las medidas positivas y cualquier condición de orientación. La fórmula cuadrática se entrega como apoyo y se recuerda qué representa cada término. No se solicita memorizarla para aprobar esta unidad.

**Así se resuelve: desarrollo simbólico.** Leer primero qué miden P y A y verificar que estén expresados en unidades compatibles. Escribir v = s − u, reemplazar en el producto y ordenar la cuadrática. Obtener las candidatas u = (s ± √D)/2, siempre que D sea no negativo. Para cada candidata calcular v = s − u, formando parejas asociadas. Comprobar en cada pareja que la suma es s y el producto A; después aplicar positividad y orientación. Si D = 0, las dos escrituras con signos distintos representan la misma raíz, por lo que no se cuentan dos soluciones diferentes. El ejemplo numérico futuro usará un marco de dimensiones creíbles, elegido y recalculado por el equipo.

**Palabras nuevas.**

| Palabra | Explicación de todos los días | Tres ejemplos |
| --- | --- | --- |
| No lineal | Una relación que no mantiene la forma de una suma de cantidades con factores fijos | Producto largo por ancho; una incógnita al cuadrado; producto de dos incógnitas |
| Candidata | Una respuesta posible que todavía debe revisarse | Una raíz obtenida; una pareja reconstruida; una medida antes de comprobar positividad |
| Rama | Un camino distinto que debe seguirse después de una elección algebraica | Signo positivo de una raíz; signo negativo; caso que se separa antes de dividir |
| Dominio | Los valores que el problema permite usar | Longitudes positivas; monedas enteras; denominadores distintos de cero |

**Ahora tú, progresión.** Verificar parejas en un sistema con producto; completar una sustitución que produce una cuadrática; recuperar parejas sin cruzar ramas; rechazar una raíz ajena al dominio; distinguir una raíz repetida de dos diferentes. En nivel de admisión, combinar ecuaciones con potencias pares y pedir suma de componentes o análisis de signos. El primer bloque no incluye exponenciales y logaritmos: requieren prerrequisitos específicos que no deben introducirse de manera oculta.

**Cierre de transferencia.** Presentar tres sistemas nuevos, uno lineal sencillo, uno de tres variables y uno con producto. El alumno elige un método y anticipa qué deberá verificar. No se espera que siempre elija el procedimiento más corto, sino uno correcto y justificable. Después puede comparar eficiencia. El puntaje distingue modelación, transformación, recuperación y comprobación.

## 6. Tabla de letras y símbolos de la unidad

| Letra o símbolo | Significado fijo en esta propuesta | Unidad |
| --- | --- | --- |
| x | Cantidad de monedas de S/ 1 en las escenas de caja | Monedas, conteo entero |
| y | Cantidad de monedas de S/ 2 en las escenas de caja | Monedas, conteo entero |
| z | Cantidad de monedas de S/ 5 en las escenas de caja | Monedas, conteo entero |
| N | Número total de monedas | Monedas |
| M | Valor numérico del dinero total, expresado en soles | S/ como unidad de la cantidad representada |
| H | Valor numérico en soles de las monedas de S/ 1 y S/ 2 juntas | S/ |
| a₁, a₂ | Coeficientes de x en las ecuaciones primera y segunda | Según magnitudes del modelo; números en la escritura algebraica normalizada |
| b₁, b₂ | Coeficientes de y en las ecuaciones primera y segunda | Según magnitudes del modelo |
| c₁, c₂ | Términos independientes de las ecuaciones primera y segunda | Según magnitudes del modelo |
| c | Constante no nula usada para expresar una contradicción | Sin unidad en el ejemplo algebraico |
| λ | Parámetro multiplicador de una ecuación | Sin unidad |
| Δ | Combinación a₁b₂ − a₂b₁, determinante de orden dos de los coeficientes | Según normalización del sistema |
| u | Largo del marco rectangular | cm |
| v | Ancho del marco rectangular | cm |
| P | Perímetro del marco | cm |
| A | Área del marco | cm² |
| s | Semiperímetro del marco, P/2 | cm |
| D | Discriminante s² − 4A de la cuadrática del marco | cm² |
| (x, y) | Pareja ordenada, primero x y después y | Cada componente conserva su unidad |
| (x, y, z) | Terna ordenada | Cada componente conserva su unidad |
| = | Igualdad de valores | No aplica |
| ≠ | Valores diferentes | No aplica |
| ≥, ≤ | Mayor o igual; menor o igual | No aplica |
| ± | Dos posibilidades, suma o resta, que deben examinarse | No aplica |
| √ | Raíz cuadrada principal no negativa | La raíz de cm² se expresa en cm |

**Colisiones que se evitan.** Δ no representa aquí un cambio de una magnitud, y D no representa distancia. A es área, no una matriz; la unidad de matrices usará su propio contrato de símbolos. N es cantidad total de monedas, no el símbolo de los números naturales ni el newton. En fórmulas de examen que usen otras letras, la app mostrará una correspondencia explícita antes de resolver. Nunca cambiará silenciosamente el significado de una letra dentro del mismo problema.

**Unidades en las ecuaciones de caja.** El conteo y el dinero son condiciones distintas. Es legítimo operar con sus valores numéricos una vez declaradas las unidades elegidas, pero no se presenta una resta de «soles menos monedas» como una operación entre magnitudes físicas. Cuando se combinen filas en el desarrollo algebraico, se trabaja con los números de los registros normalizados; la lectura final vuelve a las cantidades y sus unidades.

## 7. Otras formas de explicarla, con su riesgo

| Representación o analogía | Idea para la que conviene | Qué permite ver | Riesgo y corrección |
| --- | --- | --- | --- |
| Caja con monedas y comprobantes | 1, 2 y 5 | Varias condiciones sobre una misma colección | Puede sugerir que toda solución es entera. Separar dominio del contexto y solución sobre reales |
| Tira de espacios ocupados y restantes | 2 | Una cantidad descrita como total menos otra | Puede confundir longitud de una tira con valor monetario. Mantener rótulos de piezas y soles |
| Bandejas con paquetes repetidos | 3 | Multiplicar un registro completo y comparar partes iguales | No representa literalmente números negativos. Introducir entradas y devoluciones antes de usar signos |
| Balanza de igualdad | Recuperación previa y 3 | La misma operación en ambos miembros | Una sola balanza no muestra simultaneidad de condiciones. Usar dos registros y comprobar ambos |
| Tabla de parejas | 1 y 4 | Qué significa cumplir una ecuación | Una tabla finita no prueba todas las soluciones. Mostrar la relación general después |
| Dos rectas en un plano | 4 | Intersección, coincidencia y paralelismo | El dibujo puede ocultar un cruce lejano. Confirmar con ecuaciones exactas |
| Esquema escalonado de ecuaciones | 5 | Dependencia de cada paso y recuperación hacia atrás | Puede volverse receta. Mantener la ecuación original y el motivo de la operación |
| Marco rectangular giratorio | 6 | Producto, suma y dos parejas asociadas | Puede contar dos veces el mismo objeto físico. Distinguir configuración, orientación y pareja ordenada |

OpenStax combina gráficos, sustitución y reducción [F6–F8]; se toma esa pluralidad de registros como referencia, no sus ejemplos. El estudio de Muñiz-Rodríguez y colaboradores [F5] respalda atender especialmente las traducciones y la reducción; las escenas concretas de esta propuesta son creación propia.

**Alternativa para celulares modestos.** Cada escena puede representarse con objetos planos, números legibles y dos o tres acciones. No necesita simulación física ni gestos precisos. La manipulación debe revelar una relación matemática; si arrastrar veinte monedas solo agrega trabajo mecánico, usar un contador acompañado de una muestra visual. La versión sin movimiento conserva las mismas decisiones y los mismos criterios de éxito.

## 8. Datos del mundo, con fuente

| Dato comprobable | Fuente | Uso didáctico | Límite |
| --- | --- | --- | --- |
| El BCRP dispuso en 2016 la circulación de monedas con denominaciones de S/ 1, S/ 2 y S/ 5 bajo el nombre Sol | BCRP, Circular 004-2016-BCRP, artículo 1; [F9] | Caja e inventario de tres denominaciones | La fuente respalda las denominaciones, no los totales ficticios de las actividades |
| La circular describe diseños distintos para las tres denominaciones | BCRP, 2016; [F9] | Diferenciar clases por valor y rótulo, además de color | No se necesita copiar ilustraciones oficiales para el prototipo |
| Los registros oficiales de admisión de San Marcos incluyen sistemas lineales de dos y tres variables | UNMSM, 2024-II; [F1] | Situar el objetivo de transferencia del curso | Se usa como dato curricular histórico; no como garantía del temario de cada convocatoria futura |

No se presentan precios actuales de menús, pasajes ni productos, porque no se verificaron y no son necesarios para el concepto. Los marcos del taller, las cantidades de monedas y los comprobantes se rotularán «datos de la actividad». Un lugar peruano aporta familiaridad, pero no convierte una cifra inventada en dato real. Si el equipo desea ambientar un negocio existente, tendrá que verificar por separado sus medidas o precios.

## 9. Dudas y decisiones

1. **Frecuencia de examen.** No se puede afirmar qué tipo es el más frecuente con el corpus consultado. Se mantiene una columna explícita de incertidumbre en vez de completar con impresiones de academia.
2. **Evidencia de San Marcos.** El temario es oficial; el ejemplo de monedas se localizó en una reproducción editorial. Se conserva esta diferencia de procedencia. No se copian su enunciado, números, alternativas ni solución.
3. **Centros preuniversitarios.** Hay evidencia primaria de evaluaciones CEPRE-UNI dentro de la compilación oficial. No se comprobó un temario completo reciente de CEPUSM para esta unidad ni material primario suficiente de las otras tres universidades. Ese vacío no autoriza a atribuirles los mismos énfasis.
4. **Cramer.** Se incluye su versión de orden dos derivada de eliminación. La teoría general de determinantes se reserva para etapa 14; si el proyecto exige Cramer de orden tres aquí, deberá adelantar un bloque completo de prerrequisitos, no insertar una fórmula aislada.
5. **Sistemas no lineales.** El cierre cubre suma y producto, cuadráticas y control de ramas. Los casos con logaritmos, exponenciales o valores absolutos se incorporarán solo si sus unidades previas ya están disponibles.
6. **Notación.** Las escenas de caja mantienen x, y y z con un significado estable. El marco usa u y v para evitar reutilizar cantidades de monedas como longitudes.
7. **Predicciones.** Cada juego deja sin mostrar el caso sobre el que se pregunta. La regla y el formulario del bloque permanecen ocultos hasta «Mira»; en la práctica posterior sí están disponibles.
8. **Ejemplos resueltos.** Se entregan desarrollos simbólicos y guiones de resolución. El equipo escogerá los datos finales, recalculará resultados y probará que las metas interactivas sean alcanzables.
9. **Decisión del dueño.** Definir si las actividades avanzadas son obligatorias para todos o se habilitan tras dominar el núcleo. Se recomienda conservar las seis ideas y graduar la práctica, para no excluir sistemas de tres incógnitas del recorrido general.
10. **Validación con alumnos.** Probar especialmente la diferencia entre cantidad y valor, la lectura de una igualdad sin incógnitas y la reconstrucción de parejas. Registrar explicaciones, no solo alternativas elegidas. No se propone un porcentaje de dominio sin pilotaje.

**Revisión de dependencias realizada.** La idea 1 define solución; la 2 usa esa definición para sustituir; la 3 usa equivalencia y comprobación; la 4 clasifica con la reducción ya enseñada; la 5 extiende eliminación y clasificación; la 6 añade no linealidad con cuadráticas declaradas como prerrequisito. Ninguna misión exige matrices ni una regla que se enseñe en una idea posterior. Los 18 distractores de las seis predicciones tienen código de error presente en la sección 3.

## 10. Fuentes

- **[F1] Universidad Nacional Mayor de San Marcos, Oficina Central de Admisión. (2024). _Reglamento de admisión 2024-II_.** Documento oficial alojado en gob.pe. Se consultó el temario general, apartado 16, distinguiéndolo de temarios de otras modalidades que aparecen más adelante. [PDF](https://cdn.www.gob.pe/uploads/document/file/5781114/1889987-reglamento-de-admision-2024-ii-de-la-universidad-nacional-mayor-de-san-marcos.pdf?v=1706650101).
- **[F2] Lumbreras Editores / Academia ADUNI. (2024). _Solucionario del examen de admisión UNMSM 2024-II, área E_.** Fuente editorial secundaria utilizada únicamente para reconocer el tipo de pregunta; la copia consultada no constituye publicación oficial de la universidad. [Página editorial de la convocatoria](https://www.elumbreras.com.pe/admision-unmsm-2024-ii/). [Reproducción consultada](https://www.scribd.com/document/760518893/Sol-adm-unmsm-2024-II-Area-e).
- **[F3] Universidad Nacional de Ingeniería, OCAD. (2012). _Solucionario del examen de admisión 2012-1_.** Compilación institucional con secciones diferenciadas de admisión y evaluaciones asociadas. [PDF oficial](https://admision.uni.edu.pe/wp-content/uploads/2022/11/solucionario2012.pdf).
- **[F4] Universidad Nacional de Ingeniería, OCAD. (2017). _Solucionario del examen de admisión 2017-1_.** Se consultaron, entre otras, preguntas del examen final preuniversitario incluidas en la compilación. La fecha del directorio web no es la fecha del examen. [PDF oficial](https://admision.uni.edu.pe/wp-content/uploads/2022/11/solucionario20171.pdf).
- **[F5] Muñiz-Rodríguez, L., Rodríguez-Muñiz, L. J., y Abella Rodríguez, A. (2022). _Errores del alumnado de Educación Secundaria al manejar y resolver sistemas de dos ecuaciones lineales con dos incógnitas_. Épsilon, 111, 7–28.** Texto original leído, especialmente resultados y discusión. Algunos pies de página muestran «110»; se conserva el número 111 indicado en portada y registro bibliográfico. [Artículo completo en FUNES, Universidad de los Andes](https://funes.uniandes.edu.co/wp-content/uploads/tainacan-items/32454/1725184/1801200382080777_Munoz2022Errores.pdf).
- **[F6] Abramson, J., y colaboradores. (2021). _College Algebra 2e_, sección 7.1, “Systems of Linear Equations: Two Variables”. OpenStax.** Referencia conceptual de representaciones y métodos. [Capítulo](https://openstax.org/books/college-algebra-2e/pages/7-1-systems-of-linear-equations-two-variables).
- **[F7] Abramson, J., y colaboradores. (2021). _College Algebra 2e_, sección 7.2, “Systems of Linear Equations: Three Variables”. OpenStax.** [Capítulo](https://openstax.org/books/college-algebra-2e/pages/7-2-systems-of-linear-equations-three-variables).
- **[F8] Abramson, J., y colaboradores. (2021). _College Algebra 2e_, sección 7.3, “Systems of Nonlinear Equations and Inequalities: Two Variables”. OpenStax.** [Capítulo](https://openstax.org/books/college-algebra-2e/pages/7-3-systems-of-nonlinear-equations-and-inequalities-two-variables).
- **[F9] Banco Central de Reserva del Perú. (2016). _Circular N.º 004-2016-BCRP_.** Fuente primaria para denominaciones y características de monedas. [PDF oficial](https://www.bcrp.gob.pe/docs/Transparencia/Normas-Legales/Circulares/2016/circular-004-2016-bcrp.pdf).

Las relaciones algebraicas se desarrollan con explicación propia. Las fuentes de examen se usan para delimitar la demanda; las de investigación, para fundamentar errores; las escenas y textos para el alumno no reproducen material de academia.

