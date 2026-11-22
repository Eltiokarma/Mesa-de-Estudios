# Razonamiento matemático · Elementos recreativos

Etapa 13. Propuesta de teoría para quinto de secundaria y preuniversitario en una aplicación peruana. Identificador: `razonamiento-matematico.elementos-recreativos`. Revisión documental: 21 de noviembre de 2026.

Las escenas y los problemas descritos son originales. Las referencias de academias sirven únicamente para reconocer tipos de demanda; no se reutilizan sus figuras, enunciados ni soluciones. La propuesta no contiene código ni el banco numérico final. Los ejemplos resueltos muestran decisiones y comprobaciones; producción construirá y verificará cada instancia concreta. Cada ejercicio incluirá las convenciones, datos y relaciones que necesita.

## 1. Resumen en 5 líneas

La unidad enseña a resolver retos con cerillos, monedas, dados y fichas de dominó mediante reglas explícitas.
El alumno aprende a distinguir una operación permitida de una transformación que solo parece conveniente.
Usa conteos, relaciones espaciales y propiedades que se conservan para reducir intentos innecesarios.
Registra las posibilidades y diferencia encontrar una solución de demostrar que es la mejor o la única.
Lo más difícil es abandonar una restricción inventada sin ignorar las restricciones reales del problema.

## 2. Qué se pregunta en los exámenes

«Elementos recreativos» no designa un contenido matemático único. El temario oficial de San Marcos incluye dados, cerillos y dominó, mientras separa pesadas, traslados y otros temas. Aquí se adopta ese núcleo y se añaden monedas como objeto para explicar conteo y conservación. No se absorben balanzas, calendarios ni trasvases completos dentro de esta unidad.

La tabla distingue tres niveles de evidencia: currículo oficial, reproducción de una pregunta atribuida a un examen y material preuniversitario reproducido por terceros. La atribución editorial no se transforma en verificación oficial. La dificultad indicada es una estimación pedagógica basada en las decisiones necesarias, no una estadística de aciertos.

| Tipo de pregunta | Universidad | Dificultad | Frecuencia | Fuente |
| --- | --- | --- | --- | --- |
| Resolver situaciones con dados, cerillos y dominó, y otras operaciones recreativas. | UNMSM, temario general 2023-I, Habilidad Lógico-Matemática, 1.6. | Básica a alta según restricciones y objetivo. | Presencia curricular confirmada; no es frecuencia de preguntas. | UNMSM, 2022, reglamento del proceso 2023-I, p. 38 [F1]. |
| Relacionar puntajes superiores e inferiores de dados convencionales y optimizar una suma con información parcial. | Atribuido a UNMSM 2023-II, área B, en un repertorio de academia. | Media a alta: restricciones numéricas y caras opuestas. | Caso localizado en fuente secundaria; atribución pendiente de cotejo con cuadernillo oficial. | Academia Virtual, sin fecha editorial confirmada [F2]. |
| Restringir resultados de varios lanzamientos mediante una condición numérica y encontrar extremos posibles. | Atribuido a UNMSM 2024-I, Medicina Humana, en el mismo repertorio. | Alta: no basta sumar puntos; hay que acotar cada resultado. | Un caso referido; el catálogo no permite inferir recurrencia. | Academia Virtual [F2]. |
| Retirar la menor cantidad de cerillos para obtener una configuración con cierto número de cuadrados y evaluar propiedades del resultado. | Atribuido a UNI 2024-II, primera prueba, pregunta 33. | Alta: conteo de figuras y demostración del mínimo. | Reproducción editorial localizada; no se verificó aquí el original institucional. | Lumbreras Editores / Academia César Vallejo, 2024, reproducción en Studocu [F3]. |
| Apilar dados y maximizar o minimizar puntos visibles u ocultos según la posición del observador. | Material identificado como CEPREUNMSM, ciclo 2021-I, semana 8. | Media a alta: fijar visibilidad y restricciones simultáneas. | Evidencia de práctica del centro en copia de tercero; no de frecuencia de admisión. | CEPREUNMSM, 2021, copia indexada en Scribd [F4]. |
| Tratar métodos generales de resolución de problemas, sin un bloque explícito con este nombre en el documento consultado. | CEPREUNI, sílabo preuniversitario 2023-2. | Variable. | No se confirmó un bloque propio de «Elementos recreativos» en ese sílabo. | CEPREUNI, 2023 [F5]. |

**Qué puede concluirse.** Hay respaldo curricular directo para el núcleo de objetos y ejemplos editoriales de demanda con dados y cerillos. No hay base suficiente para ordenar familias por frecuencia, comparar universidades ni afirmar que dominó aparezca en todas las convocatorias. Tampoco se recuperó una muestra comparable de UNA Puno, UNSA y UNSAAC. Las cifras publicadas por un catálogo comercial describen su colección, no todos los exámenes.


## 3. Errores típicos

La investigación original localizada se refiere a resolución de problemas con cerillos, principalmente en situaciones experimentales. No demuestra que los mismos errores tengan igual prevalencia en postulantes peruanos. Las demás dificultades de esta tabla son hipótesis de diseño; se mantienen así aunque sean plausibles. DOCUMENTADO indica lectura del trabajo original. No se asigna la etiqueta DE SEGUNDA MANO a resultados que no se usan.

| Código | Qué hace el alumno | Por qué | Etiqueta | Fuente |
| --- | --- | --- | --- | --- |
| FIJA | No considera cambiar una parte de la expresión, aunque las reglas permitan hacerlo. | El estudio interpreta parte de la dificultad mediante restricciones autoimpuestas sobre qué puede transformarse. | DOCUMENTADO | Knoblich, Ohlsson, Haider y Rhenius, 1999, experimentos y discusión [F6]. |
| BLOQ | Ve un símbolo como bloque indivisible y no reconoce una pieza que puede separarse legalmente. | La investigación distingue dificultad por descomposición de agrupaciones perceptivas; trasladarla a nuestras figuras es una adaptación. | DOCUMENTADO | Knoblich y colaboradores, 1999 [F6]. |
| ILEG | Rompe, superpone, retira o añade una pieza cuando solo puede moverla. | Hipótesis: atiende al dibujo final y pierde la definición de operación. | HIPÓTESIS | Propuesta de diseño, 2026; sin estudio específico localizado. |
| RESU | Acepta una figura o igualdad aparentemente correcta sin revisar las condiciones restantes. | Hipótesis: confunde cumplir la meta visible con cumplir todo el problema. | HIPÓTESIS | Propuesta de diseño, 2026. |
| TOTA | Cuenta como objetos distintos las apariciones de una misma moneda o un mismo lado compartido. | Hipótesis: suma por filas o figuras sin identificar objetos comunes. | HIPÓTESIS | Propuesta de diseño, 2026. |
| PARI | Busca una transformación imposible sin revisar si cambia paridad o alguna propiedad conservada. | Hipótesis: interpreta cada intento como independiente de una restricción global. | HIPÓTESIS | Propuesta de diseño, 2026. |
| OCUL | Confunde caras no dibujadas, caras en contacto y caras invisibles para un observador. | Hipótesis: no fija el punto de vista ni el significado de «oculto». | HIPÓTESIS | Propuesta de diseño, 2026. |
| EJES | Cree que cambiar la dirección de mirada o girar el dado sobre la mesa cambia cualquier pareja de caras. | Hipótesis: mezcla orientación respecto de la mesa con relaciones internas del cubo. | HIPÓTESIS | Propuesta de diseño, 2026. |
| ESPE | Acepta una imagen especular como si siempre pudiera obtenerse girando el mismo dado. | Hipótesis: reconoce números y parejas opuestas, pero no su orden alrededor de una esquina. | HIPÓTESIS | Propuesta de diseño, 2026; distinción matemática ilustrada en [F7]. |
| INVE | Usa una ficha ausente, duplica una disponible o trata su inversión como una ficha nueva. | Hipótesis: sigue los valores de las mitades sin controlar el inventario físico. | HIPÓTESIS | Propuesta de diseño, 2026. |
| LOCA | Elige una conexión posible ahora y supone que por eso podrá completar toda la cadena. | Hipótesis: evalúa una compatibilidad local sin revisar lo que queda disponible. | HIPÓTESIS | Propuesta de diseño, 2026. |
| MINI | Llama «mínima» a la primera solución que encuentra. | Hipótesis: confunde evidencia de existencia con comparación contra todas las soluciones más cortas. | HIPÓTESIS | Propuesta de diseño, 2026. |
| ENSA | Concluye que algo es imposible después de varios intentos repetidos o sin registro. | Hipótesis: toma falta de éxito personal como prueba matemática. | HIPÓTESIS | Propuesta de diseño, 2026. |

El estudio de cerillos sustenta dos mecanismos concretos, no una recomendación de «pensar fuera de la caja» en cualquier problema. Relajar una restricción inventada es válido; saltarse una regla escrita no lo es. La aplicación debe mostrar esa diferencia de forma explícita. Tampoco debe concluir que la rapidez es una medida de inteligencia: un intento lento puede contener una comprobación mejor.


## 4. Lo que la unidad da por sabido

- Conteo de objetos, suma y resta de números naturales, igualdad y desigualdad. Las operaciones se pueden realizar con apoyo; la dificultad central está en elegir qué contar.
- Números pares e impares. La idea 2 vuelve a explicar esta distinción mediante agrupación de dos en dos.
- Cuadrado y triángulo como figuras cerradas; lado, esquina y segmento. Los lados compartidos se desarrollan en la primera idea.
- Cubo como objeto con caras, aristas y vértices. La idea 3 recupera las palabras con un dado real antes de usar perspectivas.
- Lectura de condiciones: exactamente, como máximo, como mínimo, todos, alguno y distinto. Se ofrece una aclaración al aparecer cada expresión.
- Capacidad de seguir una lista corta de estados y acciones. No se presupone conocer grafos, combinatoria formal, algoritmos ni notación de congruencias.

La unidad no enseña probabilidad de lanzamientos. Un dado funciona como objeto con caras y valores; cuando se mencionan resultados posibles, el problema especifica la condición, sin convertir «posible» en «igual de probable». Tampoco se requieren fórmulas de volumen ni desarrollos avanzados del cubo.

## 5. Las ideas, en orden

Se proponen cinco ideas. Las tres primeras construyen lectura de reglas, conservación y relaciones espaciales; la cuarta organiza conexiones; la quinta reúne esas herramientas para justificar mínimos. Las claves de Predice se guardan hasta Mira. Cada misión acepta cualquier solución que cumpla las condiciones, no solo un dibujo previsto por el autor.

### Idea 1. Mover no es cambiar las reglas

**Pregunta que responde.** ¿Qué hace que una transformación con cerillos sea una solución válida?

**Aprendizaje.** El alumno separa objetos, operaciones permitidas y condiciones de llegada, y reconoce que un mismo cerillo puede participar en varias figuras.

**Objeto de la primera pantalla.** Una mesa de taller escolar con palitos de madera iguales, una tarjeta de reto y una bandeja de piezas. Son palitos sin fuego, usados como representación de cerillos. Primero se puede tocar uno y ver que es una pieza entera. La pantalla no comienza con una cuadrícula abstracta ni con una expresión aritmética sin contexto.

**Lee.**

1. Cada palito de esta mesa es una pieza completa. Podemos identificarlo aunque cambie de lugar o de orientación.
2. La tarjeta distingue mover, retirar y añadir. Mover significa llevar una pieza del arreglo a otra posición dentro del mismo arreglo.
3. Un reto puede pedir una forma final y limitar las acciones. Ambas partes pertenecen al problema.
4. Las piezas que se tocan pueden formar figuras cerradas. Para contar una figura hay que recorrer su contorno completo.

**Juega.** Se entregan siete palitos y una mesa plana con ajuste de extremos. Misión: construir dos cuadrados del mismo tamaño usando todos los palitos, sin superponerlos y sin partirlos. El programa verifica dos contornos cuadrados, igualdad de lado, uso de las siete piezas y ausencia de superposición. La construcción admite un lado compartido. No se introduce todavía el objetivo de minimizar movimientos ni se usan signos aritméticos.

La ayuda inicial no muestra una figura fantasma que pueda copiarse. Si sobran piezas, indica cuántas están fuera del arreglo. Si se dibuja un contorno abierto, permite seguirlo con el dedo para localizar la interrupción. El contador diferencia piezas físicas de apariciones de lados; un palito compartido se ilumina una vez aunque pertenezca a dos cuadrados.

**Predice.** Un reto nuevo muestra una igualdad con palitos y dice: «Mueve exactamente un palito; puedes modificar cifras o signos; no añadas ni retires piezas; al final deben quedar símbolos del catálogo y una igualdad verdadera». ¿Cuál de estas decisiones respeta esas reglas?

| Opción | Respuesta | Clave de diseño |
| --- | --- | --- |
| A | Examinar también los palitos de los signos, siempre que el resultado respete el catálogo y la igualdad. | Correcta: no se agrega una prohibición que el enunciado no contiene. |
| B | Revisar solo las cifras, porque los signos no pueden tocarse aunque la tarjeta lo permita. | Incorrecta: FIJA. |
| C | Quitar una pieza de la mesa si con eso la igualdad queda verdadera. | Incorrecta: ILEG. |
| D | Aceptar cualquier símbolo parecido al necesario, aunque no esté en el catálogo. | Incorrecta: RESU. |

**Mira.** Se marcan piezas de cifras y signos con la misma condición de «movibles». Se comparan tres acciones: una legal, una que retira una pieza y otra que produce un símbolo no permitido. No se presenta una receta de un acertijo conocido. El objetivo es mostrar que la validez combina operación, inventario y resultado. Después aparece un catálogo original de cifras y signos con trazos precisos, que seguirá disponible en los ejercicios.

**La regla.** Un estado es la descripción de todas las piezas y sus posiciones. Un movimiento legal es una acción que cumple exactamente las restricciones. Una solución es una secuencia de movimientos legales cuyo estado final satisface todas las condiciones. Cumplir solo la meta visual no basta. Si se pide mover, el número de piezas se conserva; si se pide retirar o añadir, cambia según lo indicado. Girar una pieza puede formar parte de un movimiento cuando el enunciado lo autoriza. Cambiar de plano, partir, doblar o superponer no se supone permitido por silencio: el ejercicio debe declarar su espacio de acciones.

Las figuras se cuentan por contornos completos, incluyendo tamaños distintos cuando el enunciado no restringe el tamaño. Un cuadrado compuesto por varios segmentos puede contar aunque contenga otros cuadrados. Dos figuras pueden compartir un lado: contar lados por figura y sumar no equivale a contar piezas distintas. La letra (n), leída «cantidad de piezas», representará el inventario total. Si ninguna pieza entra o sale, ese inventario es el mismo antes y después.

Para verificar una igualdad con cerillos hay dos controles separados: que las cifras y signos estén bien formados según el catálogo y que la relación aritmética sea verdadera. No se autorizan ceros iniciales, exponentes improvisados, números romanos o cambios del signo igual salvo que el problema los incluya expresamente. El catálogo evita que la respuesta dependa de la tipografía. Una solución puede cambiar un signo si está permitido; la familiaridad con ese signo no lo vuelve intocable.

En retos de cuadrados no basta contar las regiones pequeñas. Se organiza una revisión por tamaño y ubicación, marcando cada contorno una sola vez. Si se retira un lado compartido, pueden desaparecer varias figuras al mismo tiempo. Por eso no existe una correspondencia universal «un cerillo retirado, una figura menos». La cantidad afectada se obtiene revisando qué contornos utilizaban esa pieza.

**Así se resuelve.** Caso original: se entrega un arreglo y una propuesta de transformación. Se pide decidir si es válida, no buscar todavía el mínimo.

1. Reescribir la instrucción en tres columnas: piezas disponibles, operaciones permitidas y condiciones finales.
2. Comparar inventarios inicial y final. Si el verbo es mover, toda pieza debe conservar su identidad y seguir presente.
3. Identificar cuál cambió de posición y comprobar que no se partió ni se usó dos veces.
4. Revisar la forma final por contornos o por catálogo de símbolos, según el problema.
5. Comprobar la condición aritmética o geométrica. Una igualdad verdadera con un movimiento ilegal sigue siendo una respuesta inválida.
6. Explicar la primera condición que falla, o certificar que todas se cumplen. No confundir esa certificación con una prueba de mínimo.

**Palabras nuevas.**

| Palabra | Explicación de todos los días | Tres ejemplos |
| --- | --- | --- |
| Restricción | Una condición que limita lo que se puede hacer. | Mover una sola pieza; mantener todo en la mesa; usar todos los palitos. |
| Estado | Cómo están las cosas en un momento del reto. | Arreglo inicial; figura después de mover; igualdad final. |
| Compartido | Algo que participa en más de una parte sin convertirse en dos objetos. | Lado de dos cuadrados; moneda en dos filas; extremo que une dos fichas. |

**Ahora tú.** Empezar distinguiendo mover, añadir y retirar en acciones animadas. Continuar con uso de todas las piezas y detección de contornos incompletos. Comparar conteo de lados y conteo de palitos. Incorporar cuadrados de varios tamaños y un catálogo de símbolos. Llegar a evaluar propuestas que cumplen algunas condiciones y violan otras. En el nivel de examen, pedir una transformación válida con límite de movimientos, dejando la demostración formal del mínimo para la idea 5. Cada caso tendrá una figura original revisada, sin ambigüedad de trazos.

### Idea 2. Contar lo que cambia y lo que permanece

**Pregunta que responde.** ¿Qué información permite descartar una meta antes de probar todas las posiciones?

**Aprendizaje.** El alumno distingue objetos de apariciones y usa una propiedad que se conserva para justificar que ciertas transformaciones son imposibles.

**Objeto de la primera pantalla.** Monedas de un sol sobre un paño de una mesa familiar. Se usan dos caras claramente diferenciadas por diseño, además de color, para que la actividad no dependa de distinguir tonos. Las monedas son objetos de juego, no una apuesta. Una ficha opcional presenta una emisión real documentada por el BCRP; el arreglo y las operaciones son didácticos.

**Lee.**

1. Cada moneda sigue siendo la misma aunque la movamos o le demos vuelta. La mesa mantiene un registro de todas las piezas.
2. Una moneda colocada en el cruce de dos filas pertenece a ambas filas. Para contar monedas físicas se recorre la mesa; para contar apariciones se recorre cada fila.
3. En este juego una acción consiste en dar vuelta a dos monedas distintas. No se puede voltear una sola dentro de una acción.
4. Un número par puede agruparse de dos en dos sin que sobre una unidad. Un número impar deja una unidad sin pareja.

**Juega.** Se inicia con todas las monedas mostrando la misma cara. El alumno selecciona dos distintas y las voltea juntas. Misión: reproducir una tarjeta objetivo alcanzable con un número par de caras diferentes, usando las acciones permitidas. El programa valida las dos selecciones por acción, conserva el inventario y compara la orientación de cada moneda con la tarjeta. El primer objetivo es alcanzable y no se ofrece una tarjeta con cantidad impar antes de Predice.

El historial muestra pequeñas fotografías de estados, pero todavía no una regla de paridad. Si el alumno selecciona dos veces la misma moneda, la acción no se ejecuta: el enunciado exige monedas distintas. Así se evita que una ambigüedad del control se convierta en una supuesta excepción matemática.

**Predice.** Se reinicia la mesa con todas las monedas mostrando la cara inicial. Se mantiene la regla de voltear exactamente dos monedas distintas por acción. Una tarjeta nueva pide que quede una cantidad impar mostrando la otra cara. ¿Qué se puede afirmar?

| Opción | Respuesta | Clave de diseño |
| --- | --- | --- |
| A | Se conseguirá necesariamente si se repiten suficientes intentos al azar. | Incorrecta: PARI. |
| B | Es imposible con esas acciones, porque el número de monedas cambiadas de cara mantiene paridad par. | Correcta: propiedad conservada por cada acción. |
| C | Basta contar una moneda de un cruce dos veces para que la meta física se cumpla. | Incorrecta: TOTA. |
| D | Es imposible solo porque los primeros intentos no funcionaron; esa es la prueba suficiente. | Incorrecta: ENSA. |

**Mira.** Se agrupan las acciones posibles en tres casos: voltear dos monedas de la cara inicial, una de cada cara o dos de la otra cara. La cantidad de monedas con la cara objetivo aumenta en dos, no cambia o disminuye en dos. Se representa esa cantidad con parejas de fichas y se observa que nunca aparece una unidad sola. La conclusión no depende del número de intentos del alumno.

**La regla.** Una propiedad invariante es una característica que se conserva en todas las acciones permitidas. Para usarla, primero se demuestra su conservación en cada tipo de acción; después se compara el estado inicial con la meta. Si la meta tiene un valor diferente de esa propiedad, es inalcanzable. Coincidir en el invariante es una condición necesaria, pero no garantiza por sí sola que exista una solución: puede haber otras restricciones.

En este juego, (h) será la cantidad de monedas que muestran la cara objetivo. Al voltear dos distintas, (h) cambia en más dos, cero o menos dos. Por tanto, conserva su paridad. Desde (h=0), que es par, no se llega a un (h) impar. Si se permitiera voltear una moneda, la propiedad dejaría de conservarse; no puede aplicarse una conclusión obtenida con reglas distintas. El inventario (n) también se conserva, pero conservar el total no basta para demostrar esta imposibilidad.

Para arreglos en filas, se distingue número de objetos y suma de apariciones. Si (r_j) es la cantidad de monedas de la fila (j), la suma de los (r_j) cuenta cada moneda tantas veces como filas contiene. El subíndice (j) identifica una fila. No se exige notación de sumatoria: se puede escribir la suma fila por fila. Las monedas de intersección explican por qué esa suma puede superar (n). No significa que se haya creado materia ni que una moneda valga varias monedas físicas.

Un argumento de conservación también puede usar cantidad total, suma de valores o colores de casillas, pero debe justificarse para la operación concreta. No se enseñará «busca paridad» como contraseña universal. Si una acción puede cambiar paridad, esa herramienta no descarta la meta. La primera pregunta de control será siempre qué hace exactamente una acción a la cantidad que se está siguiendo.

**Así se resuelve.** Caso original: una tarjeta pide una orientación final de monedas bajo la regla de volteo doble.

1. Identificar qué cuenta (h), sin confundirlo con el total (n).
2. Enumerar los tres tipos de pareja según sus caras antes de voltear.
3. Registrar el cambio en (h) de cada tipo y comprobar que siempre es par.
4. Comparar paridad inicial y final. Si difieren, la meta es imposible con esas reglas.
5. Si coinciden, continuar buscando: no afirmar existencia solo por esa coincidencia.
6. En una variante con filas, etiquetar las monedas para comprobar que las apariciones compartidas no alteran el conteo físico. La etiqueta identifica objetos, no añade una condición al reto.

**Palabras nuevas.**

| Palabra | Explicación de todos los días | Tres ejemplos |
| --- | --- | --- |
| Invariante | Algo que todas las acciones del juego dejan igual. | Total de monedas al moverlas; paridad al voltear de dos en dos; suma de puntos al reordenar fichas. |
| Paridad | La condición de poder formar parejas completas o dejar una unidad suelta. | Cantidad par de monedas; cantidad impar de caras objetivo; cambio de dos unidades que conserva paridad. |
| Aparición | Una vez que un objeto entra en el conteo elegido. | Moneda contada en una fila; la misma moneda contada en otra; lado contado en cada cuadrado que lo usa. |

**Ahora tú.** Comparar número de monedas y suma de apariciones en filas marcadas. Reconocer operaciones que conservan inventario. Calcular cambios cualitativos de una cantidad al voltear piezas. Distinguir una prueba de imposibilidad de una lista de intentos fallidos. Llegar a objetivos con restricciones de paridad y a arreglos con monedas compartidas. En examen, elegir una afirmación necesariamente verdadera o explicar por qué una meta no se alcanza. Si se usan casillas coloreadas, su regla se explica en el ejercicio; no se presupone un teorema nuevo.

### Idea 3. El dado conserva sus vecinos

**Pregunta que responde.** ¿Cómo deducir caras de un dado sin confundir girarlo, mirarlo desde otro lugar y reflejar su imagen?

**Aprendizaje.** El alumno mantiene las relaciones entre caras, fija el punto de vista y distingue lo que los datos determinan de lo que todavía puede variar.

**Objeto de la primera pantalla.** Un dado de un juego de mesa sobre una bandeja escolar. Se puede tocar la cara superior y girar una cámara alrededor, como cuando se examina un objeto con la mano. La escena aclara si se trata de un dado convencional o de un cubo rotulado especialmente. El primer contacto es con el objeto, no con una red de seis cuadrados.

**Lee.**

1. El dado tiene caras que se tocan por un borde y caras que quedan enfrentadas. Cada cara tiene una única cara opuesta.
2. En este reto, «convencional» significa que las caras llevan del uno al seis y que cada pareja opuesta suma siete. Esa convención es un dato del juego.
3. La cara apoyada en la bandeja, la que mira hacia arriba y las que aparecen en la fotografía se describen por separado.
4. Girar la cámara cambia nuestra vista. Rodar el dado cambia su orientación respecto de la mesa. La aplicación indicará cuál de esas acciones se realiza.

**Juega.** El alumno hace rodar el dado por casillas contiguas mediante giros de un cuarto de vuelta alrededor de una arista apoyada. Misión: llevarlo a una casilla meta con una cara superior especificada. Se comprueban posición y orientación. El recorrido permitido es corto y verificado como alcanzable. La cámara puede moverse para inspeccionar, pero no modifica el estado del dado. Todavía no se permite el giro del dado alrededor de su eje vertical; ese es el caso nuevo de Predice.

**Predice.** El mismo dado permanece apoyado sobre la misma cara y se gira sobre la mesa alrededor de una línea vertical que pasa por su centro, sin rodar sobre una arista. ¿Qué ocurre con la cara inferior?

| Opción | Respuesta | Clave de diseño |
| --- | --- | --- |
| A | Puede convertirse en cualquier cara porque todo giro cambia todas las posiciones. | Incorrecta: EJES. |
| B | Cambia por la cara que deja de aparecer en la fotografía. | Incorrecta: OCUL. |
| C | Se transforma en la cara de un dado reflejado, aunque no se cambie el objeto. | Incorrecta: ESPE. |
| D | Sigue siendo la misma; el giro cambia la orientación de las caras laterales. | Correcta: se mantiene el apoyo en ese tipo de giro. |

**Mira.** Una pequeña marca identifica la cara apoyada. El dado gira sobre ella y la marca no pasa a otra cara. Después se compara ese movimiento con rodar sobre una arista. Un botón cambia únicamente la cámara para separar las tres acciones. Finalmente se muestran dos dados con iguales parejas opuestas pero distinto orden alrededor de una esquina: una imagen especular no se obtiene siempre rotando el mismo dado. Esta cautela está ilustrada por NRICH [F7].

**La regla.** En un cubo, cada cara tiene una opuesta y cuatro adyacentes. Una rotación rígida conserva oposición y adyacencia. Para un dado convencional definido en el enunciado, si (p) es el valor de una cara y (p_o) el de su opuesta, (p+p_o=7). La suma de los valores de las seis caras se obtiene sumando los números del uno al seis. Esa suma se entregará desarrollada, no como una clave que deba recordarse. Un cubo con símbolos diferentes o un dado no convencional necesita sus propios datos: no se le impone la suma siete.

«No visible» debe definirse. Puede significar no dibujado desde una cámara fija, tapado por otro objeto o físicamente inaccesible mientras el conjunto permanece apoyado. Esas categorías no son iguales. Para sumar caras ocultas se identifica primero el conjunto exacto de caras pedido. Si se conoce la suma de todas y la suma del complemento visible según la misma definición, se resta. No se suma dos veces una cara compartida: en un contacto hay dos caras distintas, una de cada dado, aunque ocupen el mismo plano.

Para varios dados convencionales, la suma total de puntos de todas sus caras es el número de dados por la suma de un dado. Se usará (d) para cantidad de dados y (P_t), (P_v), (P_o) para sumas total, visible y oculta, respectivamente. Con una partición completa y sin duplicaciones, (P_o=P_t-P_v). Para un dado apoyado, el valor superior determina el inferior por oposición, pero una vista parcial puede no determinar qué número ocupa cada lateral.

Tener iguales parejas opuestas no determina por sí solo un único orden de las caras. En vistas sucesivas del mismo dado se conserva además la orientación relativa alrededor de una esquina. Antes de comparar, se alinea una cara de referencia y se verifica el sentido del giro. Una reflexión invierte esa orientación y no debe aceptarse automáticamente como rotación. Si los datos dejan varias posibilidades, se conservan todas y se busca el mínimo o máximo dentro de ellas, en lugar de inventar una cara.

**Así se resuelve.** Caso original: dos dados están apoyados en una bandeja opaca; se ven sus caras superiores y se pide la suma de puntos de las caras apoyadas, no de todas las caras que faltan en el dibujo.

1. Leer la definición de «apoyadas» y marcar exactamente una cara inferior por dado.
2. Comprobar que el enunciado declara dados convencionales.
3. Nombrar los valores superiores (p_1) y (p_2). Sus inferiores son (7-p_1) y (7-p_2).
4. Sumar esas expresiones para las caras solicitadas. No añadir laterales que la perspectiva no muestra.
5. Verificar cada valor entre uno y seis y mantener las parejas de oposición.
6. Si un dato superior faltara, listar las alternativas compatibles con lo visible y declarar qué parte del resultado queda indeterminada. No usar una fotografía incompleta como si fuera información completa.

**Palabras nuevas.**

| Palabra | Explicación de todos los días | Tres ejemplos |
| --- | --- | --- |
| Opuesta | Una cara que queda al otro lado del objeto, sin compartir borde con la primera. | Techo y base del dado; cara uno frente a seis en el dado definido; caras que no pueden verse juntas desde una misma esquina exterior. |
| Adyacente | Una cara vecina que comparte un borde. | Superior y frontal; frontal y lateral derecha; dos caras que se encuentran en una arista. |
| Orientación | Cómo está colocado un objeto respecto de una referencia. | Cara que mira arriba; número que mira al observador; posición después de rodar. |
| Reflexión | Una imagen invertida como la que devuelve un espejo. | Orden invertido alrededor de una esquina; mano derecha reflejada; dado dibujado con orientación especular. |

**Ahora tú.** Identificar caras opuestas y adyacentes en un dado manipulable. Distinguir mover cámara, girar sobre la base y rodar. Calcular una cara opuesta con la relación disponible. Seleccionar el conjunto de caras ocultas antes de sumar. Pasar a dos vistas del mismo dado, arreglos de varios dados y extremos de sumas sujetos a datos incompletos. En examen, coordinar oposición, inventario y restricciones numéricas. No pedir conocer la fabricación de un dado ni reconocer por memoria una orientación de marca comercial.

### Idea 4. Una cadena necesita más que una unión correcta

**Pregunta que responde.** ¿Cómo organizar fichas de dominó sin perder piezas ni quedar encerrado en una elección local?

**Aprendizaje.** El alumno controla el inventario, verifica las conexiones y utiliza el conteo de extremos para anticipar restricciones de una cadena completa.

**Objeto de la primera pantalla.** Una caja abierta de dominó sobre una mesa de reunión familiar. Las fichas tienen mitades separadas y puntos grandes. La aplicación entrega un conjunto pequeño concreto, no presume que esté toda la caja. Primero se inspecciona y se puede voltear cada ficha de extremo a extremo, sin cambiar sus valores.

**Lee.**

1. Cada ficha tiene dos mitades. En este juego, dos fichas se pueden unir cuando las mitades que se tocan muestran el mismo valor.
2. La caja de hoy contiene solo las fichas que ves. Dar vuelta a una ficha cambia su orientación, no crea una ficha adicional.
3. Una cadena usa cada ficha elegida una sola vez y deja dos extremos libres, salvo que se cierre formando un circuito.
4. El registro de la mesa muestra qué fichas ya se usaron y cuáles quedan. Una unión correcta todavía puede dejar trabajo pendiente.

**Juega.** Se entrega un conjunto pequeño diseñado con una cadena completa posible. Misión: conectar todas las fichas una sola vez, respetando igualdad de mitades en cada unión. Se permite deshacer la última acción. El sistema valida inventario, unicidad y compatibilidad. No muestra reglas sobre paridad de extremos ni conjuntos imposibles; la primera experiencia permite observar el costo de una decisión local sin anticipar la explicación.

La ficha seleccionada conserva un identificador discreto para distinguirla de otra con los mismos valores cuando el problema permita duplicados. El jugador puede invertir la ficha y probar el otro extremo. Si no encaja, la interfaz informa la condición incumplida, sin afirmar que toda la cadena sea imposible. Un espacio libre en la mesa no cuenta como una ficha de valor cero.

**Predice.** Un conjunto nuevo admite al menos una cadena que usa todas sus fichas. Se cuenta cuántas veces aparece cada valor entre todas las mitades: exactamente dos valores aparecen una cantidad impar de veces y todos los demás, una cantidad par. ¿Qué deben mostrar los dos extremos libres de cualquier cadena completa?

| Opción | Respuesta | Clave de diseño |
| --- | --- | --- |
| A | Cualquier pareja que convenga al último movimiento, sin relación con el inventario. | Incorrecta: LOCA. |
| B | Los valores de una ficha extra que se puede imaginar para cerrar la cadena. | Incorrecta: INVE. |
| C | Precisamente los dos valores que aparecen un número impar de veces. | Correcta: las uniones internas consumen apariciones por parejas iguales. |
| D | Siempre dos valores de aparición par, porque las apariciones impares se emparejan por completo. | Incorrecta: PARI. |

**Mira.** Las mitades que se tocan se iluminan en parejas. Para cada valor, las apariciones interiores se consumen de dos en dos. Las únicas apariciones sin pareja son las de los extremos de la cadena. Después se entrega un conjunto separado en dos grupos sin valores comunes para mostrar que contar paridades favorables no basta si las fichas no pueden conectarse entre sí.

**La regla.** Una ficha se representa como \(a;b\), donde (a) y (b) son los valores de sus mitades. El punto y coma solo separa valores; no indica una operación. La ficha invertida tiene los mismos valores e identidad. En una caja convencional sin duplicados, no se consideran piezas diferentes las de valores (a;b) y (b;a). Una ficha doble tiene (a=b) y aporta dos apariciones del mismo valor al inventario de mitades.

Para formar una cadena se comprueba cada unión y se lleva una lista de fichas usadas. Una opción que encaja ahora puede impedir usar otras después. La estrategia es ensayar de forma organizada, retroceder cuando se agotan las continuaciones y conservar lo aprendido del intento. No se descarta una ficha solo porque no encaja en un extremo: puede encajar en el otro o después de una reorganización legal.

En una cadena completa, cada unión interior empareja dos apariciones iguales. Por eso, si hay extremos diferentes, esos dos valores aparecen una cantidad impar de veces en el conjunto total; los demás aparecen un número par. Si los extremos son iguales, todas las cantidades de aparición son pares. En un circuito cerrado no queda ningún extremo libre, por lo que todas son pares. Tener más de dos valores con aparición impar impide formar una sola cadena que use todas las fichas una vez. Estas son condiciones necesarias; en esta unidad se comprueba además la conexión efectiva del conjunto mediante construcción o búsqueda completa en casos pequeños.

No se exige el teorema general de recorridos en grafos. Para los ejercicios propuestos basta justificar las parejas interiores y verificar construcciones. Si una tarea pregunta si una condición garantiza la cadena en cualquier conjunto, debe incluir también conectividad y una explicación adicional; esa generalización queda fuera del banco inicial. Así se evita usar una regla incompleta como si fuera suficiente.

Una ficha puede servir como representación de dos números sin que el problema sea una cadena. En arreglos con sumas por lados, se sigue el inventario y se indica qué mitades entran en cada suma. Las esquinas pueden participar en dos sumas y deben contarse según esa función. La idea 2 ya explicó por qué apariciones y objetos no coinciden. Las sucesiones de dominó requieren una regla verificable en todos los pasos; no existe una única regla deducible de cualquier lista finita sin condiciones adicionales.

**Así se resuelve.** Caso original: se da un conjunto pequeño y se pide determinar si una cadena propuesta usa todas las fichas y cumple las uniones.

1. Hacer una lista de fichas con identidad y valores. Tratar una inversión como la misma pieza.
2. Recorrer la cadena propuesta y tachar cada ficha una sola vez del inventario.
3. Comparar las dos mitades de cada unión. Una discrepancia basta para invalidar esa construcción.
4. Contar apariciones de cada valor, incluyendo dos para una ficha doble.
5. Revisar si los extremos de la propuesta concuerdan con las apariciones impares. Si no, hay un error de inventario o conexión.
6. Si falla la propuesta, no concluir aún que el conjunto es imposible. Buscar otra construcción o justificar imposibilidad mediante una condición necesaria violada.

**Palabras nuevas.**

| Palabra | Explicación de todos los días | Tres ejemplos |
| --- | --- | --- |
| Inventario | La lista de piezas reales que se pueden usar. | Fichas disponibles; fichas ya colocadas; piezas que quedan en la caja. |
| Extremo | Una punta libre de la cadena. | Mitad izquierda sin pareja; mitad derecha sin pareja; valor con el que se puede continuar. |
| Circuito | Una cadena que vuelve a cerrarse sin dejar puntas libres. | Anillo de fichas; recorrido que regresa al inicio; cadena cerrada con todas las uniones válidas. |

**Ahora tú.** Reconocer fichas iguales bajo inversión. Detectar duplicaciones u omisiones en una cadena. Completar un hueco con una ficha del inventario. Construir cadenas con pocas piezas y revisar sus extremos. Pasar a imposibilidad por apariciones impares, conjuntos desconectados y arreglos con sumas compartidas. En examen, combinar inventario, conexión y una condición adicional de suma o extremo. Los enunciados no presuponen toda una caja doble-seis si solo muestran una parte.

### Idea 5. Encontrar una solución y demostrar el mínimo

**Pregunta que responde.** ¿Cómo saber que no existe una solución con menos movimientos que la encontrada?

**Aprendizaje.** El alumno combina una construcción válida con una razón que descarta todas las alternativas más cortas, y diferencia mínimo, existencia y unicidad.

**Objeto de la primera pantalla.** Un tablero de feria escolar con fichas sobre posiciones marcadas y una tarjeta con el patrón meta. Se muestran los mismos objetos de las ideas anteriores en pequeños retos: palitos, monedas o dominós. Cada reto conserva un único tipo de movimiento. El tablero permite ver el historial de acciones como una secuencia de miniaturas.

**Lee.**

1. Una ruta que llega a la meta demuestra que la meta se puede alcanzar. La cantidad de acciones realizadas queda registrada.
2. El reto puede pedir cualquier solución, una con un número exacto de movimientos o una con la menor cantidad posible. Son pedidos distintos.
3. Dos rutas pueden llegar al mismo estado. Registrar ese estado ayuda a reconocer intentos repetidos.
4. Para comparar rutas debemos contar movimientos con la misma regla. Un gesto de pantalla no siempre equivale a un movimiento del problema.

**Juega.** El alumno coloca fichas en una configuración objetivo mediante movimientos unitarios definidos: trasladar una ficha a una posición vacía permitida. Misión: alcanzar la meta sin infringir reglas. El programa registra acciones y acepta toda ruta válida; no declara todavía que sea mínima. Se ofrece reinicio y una lista de estados visitados. El tablero se diseña con una solución conocida y con más de una ruta, para que «llegar» y «hacerlo mejor» sean experiencias distintas.

**Predice.** Una compañera presenta una ruta válida de varios movimientos. No ha comparado rutas más cortas ni ha demostrado un límite. ¿Qué prueba por sí sola su construcción?

| Opción | Respuesta | Clave de diseño |
| --- | --- | --- |
| A | Que esa es la menor cantidad posible de movimientos. | Incorrecta: MINI. |
| B | Que ninguna otra ruta funciona porque ella no encontró otra. | Incorrecta: ENSA. |
| C | Que se puede alcanzar la meta usando esa cantidad de movimientos; el mínimo podría ser menor. | Correcta: una construcción establece existencia y una cota superior. |
| D | Que también sirve para un reto con reglas distintas, siempre que la figura final sea igual. | Incorrecta: RESU. |

**Mira.** Se presenta un caso nuevo donde dos rutas llegan a la misma meta con distinta longitud. Después se muestra un argumento que impide hacerlo por debajo de cierto número de movimientos y una ruta que alcanza exactamente ese número. Ambas evidencias se colocan juntas. La aplicación no premia una ruta como mínima solo porque coincide con la respuesta guardada: la explicación incluye la razón de optimalidad.

**La regla.** Se llama (k) a la cantidad de movimientos de una ruta y (k_{\min}) al mínimo posible entre las rutas legales que llegan a la meta. Encontrar una ruta de (k) movimientos demuestra (k_{\min}\leq k). Para demostrar que ese (k) es mínimo se necesita además descartar cualquier ruta con menos movimientos. Una cota inferior es una razón por la que hacen falta al menos ciertas acciones. Cuando una construcción alcanza esa cota, queda demostrado el mínimo.

Una cota puede surgir de objetos obligatoriamente mal ubicados y del máximo efecto de una acción, pero se justifica con cuidado. Si una acción mueve una sola pieza, cada pieza que necesariamente cambia de posición exige al menos un movimiento. Si se permite intercambiar dos piezas en una acción, esa cota cambia. Si mover un palito afecta varios cuadrados a la vez, no se puede contar «cuadrados que faltan» como si cada movimiento corrigiera exactamente uno. La operación define qué argumento es válido.

Otra forma de descartar rutas cortas consiste en revisar sistemáticamente estados: primero las posibilidades de cero movimientos, luego las de uno, después las de dos y así sucesivamente. Cada nivel incluye todos los sucesores legales de los estados anteriores. Cuando cada acción cuesta una unidad, el primer nivel que contiene la meta da un mínimo, siempre que la enumeración sea completa. No se pide programar esa búsqueda; se usan pocos estados y tarjetas. Si acciones distintas tienen costos distintos, comparar solo su número no resuelve un problema de costo total.

Un estado ya visitado por una ruta igual o más corta no necesita explorarse de nuevo si el futuro depende solo del estado y las reglas no cambian. Si existe una condición sobre la historia, por ejemplo no mover dos veces la misma pieza, el registro de esa condición también forma parte del estado. No se descarta información necesaria para decidir los movimientos futuros.

Un mínimo puede alcanzarse mediante varias rutas. La unicidad exige una demostración distinta: que ninguna otra solución admisible existe según la equivalencia declarada. Rotar todo un arreglo puede contar como otra solución o como la misma, dependiendo de si el tablero fija orientación. La aplicación debe aceptar soluciones equivalentes cuando el enunciado lo permita. «Imposible», «mínimo» y «único» son conclusiones diferentes y necesitan evidencia diferente.

**Así se resuelve.** Caso original: se pide transformar un arreglo de piezas con la menor cantidad de movimientos; cada movimiento desplaza exactamente una pieza a una posición libre.

1. Precisar qué posiciones finales están obligadas y cuáles admiten alternativas.
2. Identificar piezas que necesariamente deben abandonar su posición. Esa obligación da una cota solo si no puede resolverse cambiando la interpretación del objetivo.
3. Construir una ruta legal y registrar cada estado. Contar movimientos según la regla, no según arrastres o pulsaciones de la interfaz.
4. Si la ruta alcanza la cota inferior, concluir mínimo y explicar ambas partes de la prueba.
5. Si no la alcanza, revisar rutas más cortas por niveles o mejorar la construcción. No proclamar mínimo todavía.
6. Comprobar que ninguna simetría, pieza indistinguible o condición histórica altera el conteo. Si se pide unicidad, revisar además todas las rutas o estados finales equivalentes relevantes.

**Palabras nuevas.**

| Palabra | Explicación de todos los días | Tres ejemplos |
| --- | --- | --- |
| Mínimo | La menor cantidad que realmente puede lograrse bajo las reglas. | Menos movimientos; menos piezas retiradas; menor suma posible de caras ocultas. |
| Cota | Un límite que ayuda a encerrar la respuesta posible. | Al menos una acción por pieza obligada; como máximo lo conseguido por una ruta; límite derivado de una suma. |
| Contraejemplo | Un caso válido que hace caer una afirmación general. | Ruta más corta que la supuesta mínima; segunda solución frente a una supuesta única; arreglo legal que contradice una regla propuesta. |

**Ahora tú.** Clasificar afirmaciones de existencia, mínimo e imposibilidad. Comparar rutas válidas de diferente longitud. Completar una búsqueda por niveles en un tablero pequeño. Justificar una cota y construir una solución que la alcance. Detectar pruebas que cuentan mal el efecto de un movimiento. Llegar a cerillos con mínimo de retiros, cadenas con condiciones y extremos de dados. En el nivel de examen se pide elegir una alternativa, pero la retroalimentación debe mostrar la construcción y el descarte de opciones mejores, sin depender de una figura memorizada.

## 6. Tabla de letras y símbolos de la unidad

La unidad usa pocas letras. Las tablas de estados pueden emplear nombres de objetos en lugar de símbolos. Ningún símbolo se introduce solo porque simplifique el trabajo del equipo técnico.

| Letra o símbolo | Significado | Unidad o convención |
| --- | --- | --- |
| (n) | Cantidad total de piezas del inventario de un reto. | Piezas; no cambia de significado a puntos o movimientos. |
| (h) | Cantidad de monedas que muestran la cara objetivo. | Monedas. |
| (r_j) | Cantidad de monedas de la fila identificada por (j). | Apariciones en esa fila. |
| (j) | Identificador de fila. | Sin unidad. |
| (p) | Valor de una cara de dado. | Puntos. |
| (p_o) | Valor de la cara opuesta a la que vale (p). | Puntos. |
| (p_1,p_2) | Valores de caras identificadas en dados distintos. | Puntos; el subíndice identifica la cara considerada. |
| (d) | Cantidad de dados. | Dados. |
| (P_t,P_v,P_o) | Sumas de puntos total, visible y oculta, según definición del ejercicio. | Puntos. |
| (a;b) | Valores de las dos mitades de una ficha. | Puntos; el separador no es una división. |
| (k) | Cantidad de movimientos de una ruta concreta. | Movimientos. |
| (k_{\min}) | Menor cantidad de movimientos de una solución legal. | Movimientos. |
| (=,\leq,\geq) | Igual, menor o igual, mayor o igual. | Relaciones entre cantidades comparables. |

**Colisiones.** (d) puede representar distancia en otros cursos; aquí es cantidad de dados. (P) mayúscula no representa perímetro ni probabilidad: es suma de puntos con subíndice. El subíndice (o) significa opuesto en (p_o) y oculto en (P_o); se conserva la diferencia de mayúscula y se muestra el nombre completo. Si esto provoca confusión en pruebas de uso, se sustituirá el subíndice por la palabra completa, sin cambiar las relaciones. Las letras A, B, C y D de las alternativas no representan variables.

## 7. Otras formas de explicarla

| Representación o recurso | Para qué idea conviene | Riesgo y corrección |
| --- | --- | --- |
| Palitos reales con identificadores discretos. | 1: diferencia pieza física, trazo y lado compartido. | Las etiquetas pueden parecer nuevas restricciones. Aclarar que solo ayudan a seguir identidad. |
| Reconstruir una figura por contornos de distinto tamaño. | 1: evita contar solo regiones pequeñas. NRICH trabaja cuadrados con lados compartidos [F8]. | No copiar un patrón como fórmula universal. Cada figura tiene sus propios contornos. |
| Mostrar símbolos como conjuntos de trazos permitidos. | 1: ayuda a revisar restricciones autoimpuestas relacionadas con [F6]. | No sugerir que cualquier signo puede modificarse en todo problema. La tarjeta manda. |
| Parejas de monedas y registro de tres tipos de volteo. | 2: hace visible conservación de paridad. | Probar varios casos no sustituye agotar los tipos de acción. Deben incluirse los tres. |
| Dado manipulable y cámara separada. | 3: distingue orientación del objeto y punto de vista. | Un giro automático puede ocultar la trayectoria. Permitir avanzar un cuarto de vuelta y deshacer. |
| Cubo de papel con marcas propias y comparación con espejo. | 3: muestra por qué oposición no fija toda la orientación, como ilustra NRICH [F7]. | Un desarrollo mal plegado crea errores. Verificar el modelo y no empezar por él. |
| Fichas de dominó reales y registro de mitades. | 4: relaciona inventario con extremos. NRICH ofrece juegos y entornos de exploración [F9]. | No confundir contar puntos con contar apariciones de un valor. Nombrar la magnitud en cada tabla. |
| Tarjetas de estados agrupadas por número de movimientos. | 5: demuestra qué rutas cortas ya se revisaron. | Un árbol muy grande puede saturar el celular. Usar pocos estados y agrupar duplicados válidamente. |
| Comparación de una ruta y una cota inferior. | 5: distingue existencia de optimalidad. | Una cota sin explicación parece otro truco. Relacionarla con lo que una acción puede cambiar. |

Las actividades de NRICH son referencias de enfoque, no plantillas para copiar. La propuesta conserva la idea de manipular, formular una conjetura y justificarla, pero usa retos nuevos y reglas adaptadas al público. Las escenas deben poder manejarse con pulsaciones además de arrastre. La precisión motora no debe decidir si un razonamiento es correcto: las piezas pueden ajustarse a posiciones válidas y el historial permite corregir un gesto accidental.

## 8. Datos del mundo

| Dato comprobable | Fuente | Aplicación | Límite |
| --- | --- | --- | --- |
| El BCRP describe para la moneda de un sol de la emisión de cerámica precolombina anunciada el 17 de octubre de 2024 una masa de 7,32 g y un diámetro de 25,50 mm. | BCRP, 2024, nota informativa oficial [F10]. | Referencia de escala para representar monedas reales sobre una mesa. | No se afirma que todas las emisiones o monedas desgastadas tengan idéntica medición individual. La unidad no evalúa autenticidad monetaria. |
| La emisión está dedicada al Período Formativo de la cerámica precolombina peruana y tiene denominación de un sol. | BCRP, 2024 [F10]. | Ficha opcional para reconocer el objeto y su vínculo peruano. | La historia de la cerámica no es un requisito para resolver el reto. No se copia el diseño numismático como figura de un problema ajeno. |

Los tamaños de palitos, la cantidad de monedas, la caja de dominó y las dimensiones de dados de cada escena serán datos didácticos. No se atribuye una medida universal a «un dado de mesa» ni a «un cerillo». Si una configuración depende de la longitud, se entrega esa longitud y se verifica que las piezas puedan colocarse sin atravesarse. Si las piezas son abstractas, la escena lo dice y mantiene reglas geométricas consistentes.


## 9. Dudas y decisiones

**Evidencia incompleta.** El respaldo más sólido del alcance es el temario oficial de San Marcos. Varias preguntas concretas se localizaron en reproducciones; su fecha y universidad se presentan como atribución editorial. La coincidencia de un enunciado en sitios distintos no demuestra autenticidad, porque pueden copiar una misma fuente. No se usa ese material para calcular frecuencia. Queda pendiente un cotejo sistemático con cuadernillos oficiales antes de publicar afirmaciones sobre recurrencia por universidad.

**Alcance elegido.** La unidad cubre cerillos, monedas, dados y dominó mediante cinco ideas. Pesadas, trasvases, calendarios, operadores generales, parentescos y trazo de figuras no se incorporan completos aunque alguna academia los agrupe como recreativos. Así cada objeto sirve para una decisión concreta y no se convierte en un cajón de acertijos. Un banco adicional puede vincularlos desde otras unidades, siempre con los requisitos indicados.

**Investigación.** Se dispone de un estudio original sobre restricciones y agrupaciones perceptivas en cerillos. No se encontró evidencia original específica para todos los errores de dominó, caras ocultas y mínimos en la población objetivo. Esos códigos permanecen como hipótesis. No se presentan estadísticas de éxito ni se afirma que el entrenamiento garantice una mejora general de inteligencia.

**Decisiones sobre reglas.** Cada reto debe declarar si se permite superponer, salir del plano, invertir fichas, modificar signos, reutilizar piezas o pasar por posiciones ocupadas. No se diseñará una solución que dependa de una excepción sorpresa. Si hay varias respuestas, se aceptan todas las válidas o se reformula la pregunta. Si una figura admite interpretaciones, se precisan tamaño de figuras contadas, punto de vista y catálogo de símbolos.

**Decisiones del dueño del proyecto.** Elegir si habrá un modo libre de exploración posterior a la regla. Decidir cuánta rotación tridimensional requiere el dado: se puede resolver con vistas discretas verificadas y un modelo ligero. Determinar si el nivel de examen pide demostraciones completas o selección de una justificación entre opciones; en ambos casos debe existir una explicación accesible del mínimo. Estas decisiones no impiden desarrollar la secuencia descrita.

**Orden revisado.** La idea 1 introduce estado, regla y piezas compartidas. La 2 usa esas nociones para conteo e invariantes. La 3 añade relaciones del cubo sin necesitar cadenas ni búsqueda por niveles. La 4 usa inventario y paridad ya presentados. La 5 reúne las herramientas y formaliza mínimo. No se usa un teorema de grafos ni una condición suficiente de cadenas que no se haya explicado.

**Predicciones revisadas.** Hay cinco preguntas y quince distractores, cada uno vinculado a un código de la sección 3. La primera transfiere de figuras a símbolos; la segunda introduce una meta de paridad distinta; la tercera cambia el tipo de giro; la cuarta presenta un inventario nuevo y declara que existe una cadena; la quinta pregunta por el alcance de una construcción. Juega no muestra esas respuestas. Las palabras y las reglas necesarias para entender cada enunciado ya aparecen en Lee o en ideas anteriores.

**Comprobación antes de producir.** Para cada figura final, verificar existencia de solución, legalidad de todas sus acciones y corrección de la justificación. Para mínimos, construir una solución y demostrar el límite; si se usa enumeración, revisar que sea completa. Para dados, verificar una orientación realizable y separar reflexión de rotación. Para dominó, revisar el inventario físico y contar dobles correctamente. Este control es parte de la autoría del problema, no una tarea que se deja al alumno para corregir un error del material.

## 10. Fuentes

- **[F1] Universidad Nacional Mayor de San Marcos. (2022).** *Reglamento de Admisión 2023-I*. Temario general, Habilidad Lógico-Matemática, 1.6, p. 38. [PDF oficial](https://medicina.unmsm.edu.pe/wp-content/uploads/2023/02/Reglamento-de-Admision-2023-I.pdf).
- **[F2] Academia Virtual. (Sin fecha editorial confirmada).** *Elementos recreativos: clases y preguntas de admisión*. Repertorio secundario; solo se usa para tipos y atribuciones declaradas, no para frecuencia. [Página consultada](https://academiavirtual.pe/cursos/razonamiento-matematico/elementos-recreativos).
- **[F3] Lumbreras Editores / Academia César Vallejo. (2024).** *UNI 2024-2: Aptitud Académica y Humanidades*. Pregunta 33 en reproducción de terceros. No se copian figura ni solución. [Copia consultada en Studocu](https://www.studocu.com/pe/document/universidad-nacional-mayor-de-san-marcos/matematica/ex-adm-uni-2024-2-examen-de-admision/102233609).
- **[F4] Centro Preuniversitario UNMSM. (2021, según cabecera de la copia).** *Solucionario de la semana 8, ciclo 2021-I*. Copia de tercero; acceso al texto indexado, no verificación del archivo institucional. [Referencia localizada en Scribd](https://es.scribd.com/document/1029962800/Sol-Semana-08-cepreunmsm-2021-I).
- **[F5] CEPREUNI. (2023).** *Guía del ciclo preuniversitario 2023-2*. Documento oficial consultado para delimitación curricular. [PDF](https://www.cepre.uni.edu.pe/assets/archivos/comunicados/Syl_Pre_PS_2023-2.pdf).
- **[F6] Knoblich, G.; Ohlsson, S.; Haider, H.; Rhenius, D. (1999).** *Constraint Relaxation and Chunk Decomposition in Insight Problem Solving*. Journal of Experimental Psychology: Learning, Memory, and Cognition, 25(6), 1534–1555. Investigación original. [Texto completo alojado por la Universidad de Colonia](https://www.kognition.uni-koeln.de/literature/Knoblich_etal_1999.pdf). [DOI](https://doi.org/10.1037/0278-7393.25.6.1534).
- **[F7] NRICH, Universidad de Cambridge. (Sin fecha confirmada).** *Right or Left?* Actividad sobre orientación de dados y sus imágenes especulares. [Recurso original](https://nrich.maths.org/problems/right-or-left).
- **[F8] NRICH, Universidad de Cambridge. (Sin fecha confirmada).** *Matchsticks*. Recurso sobre cuadrados con lados compartidos. [Recurso original](https://nrich.maths.org/problems/matchsticks).
- **[F9] NRICH, Universidad de Cambridge. (Sin fecha confirmada).** *Dominoes*. Juegos y exploraciones con cadenas; se adapta el enfoque, no los problemas. [Recurso original](https://nrich.maths.org/games/dominoes).
- **[F10] Banco Central de Reserva del Perú. (2024, 17 de octubre).** *BCRP pone en circulación primera moneda de S/ 1 de la serie numismática «Cerámica Precolombina Peruana»*. Fuente institucional para denominación y dimensiones. [Nota informativa](https://www.bcrp.gob.pe/docs/Transparencia/Notas-Informativas/2024/nota-informativa-2024-10-17.pdf).
