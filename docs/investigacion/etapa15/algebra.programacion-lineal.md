# Álgebra · Inecuaciones con dos variables y programación lineal

## 1. Resumen en 5 líneas

La unidad convierte condiciones de compra en desigualdades con dos cantidades.
Relaciona pedidos, tablas, expresiones algebraicas y regiones del plano.
Distingue cumplir restricciones de conseguir el mejor importe.
Lo más difícil es entender la solución como conjunto y justificar cada frontera y candidato óptimo.
El cierre trata empates, regiones no acotadas y cantidades enteras.

Etapa 15. Identificador: algebra.programacion-lineal. Propuesta para quinto de secundaria y preuniversitario; consulta: 22 de noviembre de 2026. Incluye seis ideas con sus siete momentos. Los guiones son originales y sus cantidades son datos didácticos, no mediciones de un negocio.

El hilo conductor es una mercería: $x$ siempre son metros de cinta A y $y$, metros de cinta B. La modalidad entera utiliza cortes cerrados de un metro. Los ejemplos finales y sus resultados serán recalculados por el equipo que implemente la propuesta.

## 2. Qué se pregunta en los exámenes

Un temario no demuestra aparición en examen y una atribución escolar no equivale a cotejar el original. Dificultad estimada: básica, una decisión; media, varias representaciones; alta, modelación o justificación general. No son índices psicométricos.

| Tipo de pregunta | Universidad y alcance comprobado | Dificultad propuesta | Frecuencia que permite afirmar la muestra | Fuente y localización |
|---|---|---|---|---|
| Analizar afirmaciones sobre un mínimo y un máximo sujetos al mismo conjunto admisible. | UNI, examen ordinario 2017-1, segunda prueba, pregunta 18. Se leyó el enunciado en la publicación institucional. | Alta conceptual: exige comprobar condiciones y usar contraejemplos; no basta calcular intersecciones. | Una pregunta identificada; no permite estimar una frecuencia histórica. | UNI–OCAD, 2017, p. impresa 34, p. 30 del PDF [A01]. |
| Construir y representar sistemas de inecuaciones de dos variables, diferenciando dominios reales y enteros. | CEPRE-UNI, sílabo de Álgebra del ciclo 2026-2, semana 16. | Básica a alta según número de condiciones y dominio. | Presencia curricular explícita, no frecuencia de examen. | CEPRE-UNI, 2026, p. impresa 35 [A02]. |
| Reconocer región admisible, factibilidad, convexidad y valor óptimo; aplicar el método gráfico. | CEPRE-UNI, ciclo 2026-2, semana 17. | Media para evaluar vértices; alta para justificar existencia o multiplicidad. | Presencia curricular explícita. | CEPRE-UNI, 2026, p. impresa 35 [A02]. |
| Formular un costo mínimo con dos tipos de transporte y restricciones de capacidad y disponibilidad. | UNMSM 2020-I, áreas C y E, atribución explícita en una práctica escolar. No se obtuvo el cuadernillo oficial durante esta investigación. | Alta de modelación: distinguir capacidad mínima, disponibilidad máxima y decisión entera. | Un caso atribuido; no se presenta como muestra oficial completa. | Colegio San Vicente de Paúl, s. f., práctica de programación lineal, ejercicio 12 [A03]. |
| Representar regiones, comprobar pares y contar soluciones enteras de un sistema. | CEPRE-UNMSM, material identificado como semana 18 del ciclo 2025-II, consultado en una reproducción de terceros. | Media; alta cuando se combinan desigualdades estrictas y enteros. | Presencia en ese material, sin inferencia de frecuencia en admisión. | CEPRE-UNMSM, 2025, pp. impresas 40–43; copia consultada en Scribd [A04]. |
| Formular restricciones y una función objetivo; comparar su valor en puntos extremos. | CEPRE-UNMSM, mismo material de semana 18. | Media a alta. | Presencia didáctica; no equivale a una estadística de exámenes. | CEPRE-UNMSM, 2025, apartado de programación lineal [A04]. |
| Sistemas de inecuaciones de primer grado con dos variables e introducción a programación lineal. | UNMSM, Reglamento de Admisión 2022-II, temario de Álgebra, apartados 16.3 y 16.4. El índice de búsqueda recuperó el pasaje; el PDF institucional devolvió error al abrirlo. | Delimitación curricular, no clasificación de un ítem. | Referencia histórica con acceso parcial. No se afirma vigencia para una convocatoria posterior. | UNMSM, 2022 [A05]. |
| Tipos específicos de esta unidad en UNA Puno, UNSA y UNSAAC. | No se verificó un conjunto suficiente de documentos originales de estas universidades. | No asignada como dato de examen. | No estimable. | Vacío de evidencia de esta entrega; no significa ausencia del tema. |

La prioridad sigue dependencias conceptuales, no frecuencias supuestas: modelar y verificar antes de optimizar. Las predicciones tendrán cuatro opciones, aunque un examen citado use cinco.

## 3. Errores típicos

DOCUMENTADO: resultado leído en la fuente de sus autores, indicando si fue resumen original o texto completo. DE SEGUNDA MANO: conocido solo mediante otra fuente. HIPÓTESIS: distractor razonable aún sin evidencia específica. No se asignan prevalencias locales.

| Código | Qué hace o cree el alumno | Por qué: evidencia o interpretación delimitada | Etiqueta | Fuente |
|---|---|---|---|---|
| IGU | Busca un único par o reemplaza la desigualdad por una igualdad y termina allí. | Reaño relaciona la búsqueda de valores aislados con experiencias previas resolviendo sistemas de ecuaciones. El traslado a esta escena es una decisión didáctica. | DOCUMENTADO | Reaño Paredes, 2015, resumen original institucional, conclusiones [A06]. |
| SIG | Al dividir por un número negativo, conserva la orientación de la desigualdad. | En la investigación se identifican dificultades con esa operación y generalización de procedimientos de ecuaciones; no se diagnostica una causa individual solo por elegir una opción. | DOCUMENTADO | Yokoso, Kabutey, Ansah, Ntow y Ofotsu, 2024, artículo original [A07]. |
| SOM | Sombrea por apariencia o por una regla de «arriba/abajo» sin verificar un punto. | Los entrevistados describen procedimientos gráficos sin justificación suficiente del lado elegido. | DOCUMENTADO | Nasrullah y colaboradores, 2026, apartado 3.2.1.1 [A08]. |
| UNA | Acepta un pedido que cumple una condición, aunque falle otra. | El estudio registra dificultad para reconocer la intersección como solución del sistema. | DOCUMENTADO | Nasrullah y colaboradores, 2026, apartado 3.2.1.2 [A08]. |
| VIS | Decide que un punto sirve porque parece estar dentro del dibujo y no sustituye sus coordenadas. | Las entrevistas y producciones muestran desconexión entre lectura gráfica y comprobación algebraica. | DOCUMENTADO | Nasrullah y colaboradores, 2026, apartados 3.2.1.3 y 3.2.2.3 [A08]. |
| BOR | Interpreta «hasta» como «menos que», o acepta igualdad cuando el texto exige «menos que». | Hipótesis: puede confundir el límite permitido con un valor prohibido o no atender al matiz verbal. No se halló aquí un estudio específico que aísle ese mecanismo en postulantes peruanos. | HIPÓTESIS | Diseño de esta propuesta; validar mediante explicación oral del alumno. |
| POS | Introduce longitudes negativas para compensar un exceso de otra cinta. | Hipótesis: resuelve una expresión sin volver al significado físico de las cantidades. | HIPÓTESIS | Diseño de esta propuesta. |
| OBJ | Optimiza metros totales cuando el pedido solicita optimizar dinero, o supone que cada cambio aporta lo mismo. | Hipótesis: conserva la magnitud visual más saliente y omite los importes por metro. | HIPÓTESIS | Diseño de esta propuesta. |
| FAC | Cree que cualquier pedido permitido es ya el mejor. | Hipótesis: confunde una prueba de cumplimiento con una comparación global. | HIPÓTESIS | Diseño de esta propuesta. |
| VER | Elige automáticamente la intersección de dos rectas, o cree que un óptimo siempre es único. | Hipótesis: convierte la evaluación de vértices en una receta de escoger el cruce más llamativo. | HIPÓTESIS | Diseño de esta propuesta; no atribuir a los estudios de desigualdades un resultado que no midieron. |
| ACO | Afirma que una región no acotada nunca tiene mínimo ni máximo finitos. | Hipótesis: confunde extensión del conjunto con comportamiento de una función concreta. | HIPÓTESIS | Diseño; el sílabo y el examen UNI justifican enseñar la distinción, pero no prueban que sea un error frecuente. |
| RED | Redondea el óptimo continuo y supone que sigue siendo factible y óptimo entre enteros. | Hipótesis: transfiere el redondeo de una medida a una decisión sujeta a varias condiciones simultáneas. | HIPÓTESIS | Diseño de esta propuesta. |

**Límites de la evidencia.** Reaño estudia educación superior peruana, no una muestra nacional de postulantes. Se pudo leer su resumen original; la descarga del texto completo presentó una barrera de acceso. Yokoso y colaboradores estudian inecuaciones en Ghana; Nasrullah y colaboradores, sistemas de inecuaciones en una escuela de Indonesia. Son antecedentes para diseñar observaciones, no tasas transferibles al Perú. Ninguna etiqueta DOCUMENTADO significa que el distractor exacto de esta propuesta se haya administrado en esas investigaciones.

## 4. Lo que la unidad da por sabido

Se requiere sumar y multiplicar cantidades decimales, comparar números, sustituir valores, leer pares ordenados, resolver sistemas sencillos de dos ecuaciones y distinguir metros de soles por metro. Las equivalencias de unidades se entregan.

Semiplano, región factible, convexidad, función objetivo y método de vértices se introducen aquí. No se presuponen ni se exige memorizar sus reglas.

**Puente de entrada.** Un mostrador muestra dos cortes, una regla y una boleta. El alumno lee longitudes, las escribe en orden A/B y reconoce las unidades del importe. Si falla, se abre una recuperación de coordenadas o sustitución. Cero metros significa no comprar ese tipo; una longitud negativa no representa una venta.

El paso visible de un control no define el dominio matemático. Una interfaz que avanza por centésimas puede representar un modelo continuo. La venta de sobres, en cambio, exige explícitamente metros enteros.

## 5. Las ideas, en orden

### Idea 1. Un límite permite muchos pedidos

**Pregunta que responde.** ¿Qué significa cumplir una condición cuando podemos elegir dos cantidades?

**Aprendizaje.** El alumno representa un pedido con dos cantidades, comprueba una condición y distingue una solución de todas las soluciones.

**Objeto de la primera pantalla.** Un mostrador con dos rollos de cinta, A y B, una regla de costura y una tarjeta de promoción. Es reconocible como compra de materiales para decorar o coser. Las letras se rotulan de inmediato: $x$, metros de cinta A; $y$, metros de cinta B. No aparecen ejes en esta primera pantalla.

#### Lee

- Tarjeta 1: «El pedido combina cinta A y cinta B. Puedes cambiar cuánto llevas de cada una sin cambiar los tipos de cinta».
- Tarjeta 2: «Anotaremos primero los metros de A y después los de B. Ese orden permite reconstruir el pedido».
- Tarjeta 3: «La promoción tiene un límite para la longitud total. Cada pedido se revisa usando sus dos cantidades».

#### Juega

La tarjeta de promoción del juego dice «hasta 12 m entre ambos tipos». El alumno tira de los extremos de las cintas, lee su longitud y guarda dos pedidos distintos. La misión es preparar dos pedidos aceptados con ambas cintas presentes y una longitud total entre 6 m y 10 m. Esas cotas pertenecen a la misión de exploración y no sustituyen la condición general de la promoción.

El programa comprueba que ambas longitudes son positivas, que cada total cae en ese intervalo y que los pedidos guardados no son iguales. Muestra la suma concreta de longitudes, con unidades, y conserva las dos fotos del mostrador. En esta fase los controles no permiten llegar a 12 m: el caso de igualdad se reserva para predecir. La aprobación aparece junto al pedido, no como una medalla desligada de lo que se consiguió.

#### Predice

**Información nueva:** se presenta un pedido aún no ensayado de 7 m de A y 5 m de B, bajo la misma promoción de «hasta 12 m».

**Pregunta:** «¿Qué ocurrirá al revisar este pedido?».

| Opción | Contenido | Clave o error asociado |
|---|---|---|
| A | Será aceptado: alcanzar el límite exacto está permitido. | Correcta. |
| B | Será rechazado: al llegar a 12 m ya se excedió el permiso. | BOR. |
| C | Será el único pedido aceptable, porque una condición solo tiene una solución. | IGU. |
| D | Solo importa cuánto lleva de A; la cantidad de B no participa en la revisión. | UNA, extensión didáctica del control parcial. |

La pantalla de predicción ofrece las longitudes y el texto de la promoción. No enseña una fórmula ni marca una respuesta antes de confirmar.

#### Mira

Los dos cortes se colocan sobre una regla total y el sistema confirma que el límite se alcanza sin superarlo. Luego recupera los dos pedidos del juego: también cumplen. La comparación permite decir «este pedido sirve» sin convertirlo en «este es el único». Solo después se vincula la suma concreta con una expresión general.

#### La regla

Una inecuación compara dos expresiones mediante «menor que», «menor o igual que», «mayor que» o «mayor o igual que». Para la promoción, $x+y\leq12$: la suma de los metros de ambas cintas es menor o igual que doce metros. Una solución es cualquier par de cantidades que hace verdadera la comparación. El conjunto solución reúne todos esos pares.

La igualdad $x+y=12$ describe únicamente los pedidos que agotan el límite. No equivale a toda la inecuación. «A lo más» y «como máximo» incluyen igualdad; «menos de» la excluye. «Por lo menos» y «como mínimo» incluyen igualdad por el otro lado. El sentido se interpreta a partir de la frase completa, no de una palabra aislada: «no menos de» no significa «menos de».

La forma general es $ax+by\leq c$, donde $a$ y $b$ son coeficientes que convierten cada longitud en la cantidad evaluada, y $c$ es el límite de esa misma cantidad. Al usar esa forma se exige que $a$ y $b$ no sean ambos cero. Los casos con ambos coeficientes nulos se comprueban como afirmaciones constantes, sin dibujar una recta inexistente. La venta incorpora además $x\geq0$ y $y\geq0$.

#### Así se resuelve

El ejercicio modelo es decidir si un pedido original respeta una promoción de longitud y expresar la condición para cualquier pedido. El guion del ejemplo resuelto será: identificar qué mide cada letra; escribir las dos cantidades con metros; formar el total; compararlo con el límite según la frase; responder en palabras si se admite; y mostrar otro pedido que también cumpla.

#### Palabras nuevas

| Palabra | Explicación cotidiana | Tres ejemplos de uso propio |
|---|---|---|
| Restricción | Una condición que un pedido tiene que respetar. | No superar el largo permitido; llevar una longitud mínima; no pedir metros negativos. |
| Par ordenado | Dos cantidades anotadas en un orden acordado. | Primero A y después B; un pedido sin A; dos pedidos que intercambian sus cantidades. |
| Solución | Un pedido que pasa la revisión indicada. | Uno que queda bajo el máximo; uno que alcanza un máximo inclusivo; uno que cumple un mínimo. |

#### Ahora tú

1. Leer dos longitudes y decidir si su suma cumple un máximo inclusivo, con la comparación y los datos disponibles.
2. Elegir la expresión correspondiente a una condición verbal, incluyendo «no menos de».
3. Detectar por qué verificar solo una cantidad no basta para una condición que depende de las dos.
4. Construir dos soluciones diferentes y un contraejemplo sin necesitar un gráfico.
5. Nivel de admisión inicial: traducir una tabla de uso de recursos por metro a una desigualdad y justificar sus unidades.

### Idea 2. Una recta separa pedidos

**Pregunta que responde.** ¿Cómo mostrar de una vez todos los pedidos que cumplen una inecuación?

**Aprendizaje.** El alumno relaciona una frontera con la igualdad y elige el lado correcto comprobando un punto, incluido el tratamiento del borde.

**Objeto de la primera pantalla.** Se ve el mostrador anterior y una hoja cuadriculada donde la vendedora registra pedidos. Cada punto se conecta con dos cortes de cinta. El plano aparece como registro del objeto, después de reconocer qué se compra, y conserva las etiquetas «metros de A» y «metros de B».

#### Lee

- Tarjeta 1: «La hoja permite guardar muchos pedidos sin volver a dibujar cada cinta. Cada punto conserva las dos cantidades».
- Tarjeta 2: «Dos pedidos pueden estar cerca en la hoja y ser diferentes. La cuadrícula indica cuánto cambia cada cantidad».
- Tarjeta 3: «Una frontera separa dos lados del plano. Revisaremos puntos de ambos lados para interpretar esa separación».

#### Juega

La escena mantiene una única condición inclusiva y presenta una recta ya vinculada a los pedidos que alcanzan su límite. El alumno arrastra tres pedidos de una bandeja a sus puntos de la hoja y selecciona un pedido permitido y uno no permitido, ambos lejos del borde. La misión se logra si cada punto coincide con las longitudes de su boleta y si la clasificación coincide con la sustitución numérica.

El programa muestra las cantidades sustituidas en la condición solo después de colocar cada pedido. No colorea de antemano toda la zona correcta. El objetivo es conectar una comprobación concreta con la ubicación, no premiar una intuición sobre el color. El caso que sigue cambia la orientación de la condición: no se obtiene repitiendo mecánicamente el sombreado del juego.

#### Predice

**Información nueva:** la mercería exige que los metros de B sean, como mínimo, los metros de A más 2 m. Se dibuja únicamente la recta de pedidos que cumplen esa diferencia exacta.

**Pregunta:** «¿Qué lado habrá que conservar junto con la recta?».

| Opción | Contenido | Clave o error asociado |
|---|---|---|
| A | El lado con más B para una misma cantidad de A, incluyendo el borde. | Correcta. |
| B | El lado con menos B, porque el signo se conserva aunque se haya dividido por un coeficiente negativo. | SIG. |
| C | Solo la recta; los pedidos fuera de ella no pueden ser soluciones. | IGU. |
| D | El lado que quedó coloreado en el juego anterior, sin comprobar pedidos nuevos. | SOM. |

No se muestra el despeje algebraico durante la predicción. La frase «más B para la misma A» se acompaña con cintas, para que no dependa únicamente de memorizar qué significa arriba.

#### Mira

Se comparan tres pedidos con la misma longitud A: uno por debajo de la diferencia exigida, uno exactamente en ella y otro por encima. Sus posiciones quedan simultáneamente visibles. Se comprueba cada condición en palabras y se introduce el sombreado correspondiente. Después aparece el despeje y se explica por qué puede cambiar la orientación al dividir por un negativo.

#### La regla

La ecuación $ax+by=c$ define la recta frontera de una inecuación lineal no degenerada. La recta divide el plano en dos semiplanos. Para elegir uno, se toma un punto que no esté sobre la recta y se sustituye en la inecuación: si la comparación es verdadera, se conserva su lado; si es falsa, se conserva el otro.

El origen es el punto $(0,0)$ y puede ser cómodo para comprobar, pero no se utiliza como punto de prueba si pertenece a la frontera. En ese caso se elige otro punto fuera de ella. No existe una regla universal que relacione el signo escrito con «arriba» o «abajo» sin considerar cómo está expresada la desigualdad.

Las comparaciones inclusivas usan frontera continua; las estrictas, frontera discontinua y borde excluido. Si se despeja $y$, dividir por un coeficiente positivo conserva el sentido; dividir por uno negativo lo invierte. Si el coeficiente de $y$ es cero, la frontera puede ser vertical y no debe intentarse esa división. Si el coeficiente de $x$ es cero, puede ser horizontal. Los cortes con los ejes se calculan anulando una variable solo cuando ese procedimiento determina un punto; nunca se divide entre cero.

Para trazar una recta bastan dos puntos distintos que satisfagan su ecuación. La solución algebraica puede extenderse a valores negativos; la venta solo utiliza la parte que respeta longitudes no negativas. Esa separación evita confundir la inecuación aislada con el modelo completo del pedido.

#### Así se resuelve

Se plantea una condición de diferencia entre longitudes. El ejemplo identifica la igualdad fronteriza, elige dos puntos distintos sobre ella y los comprueba. Luego selecciona un punto que no esté en la recta, sustituye ambas coordenadas, decide el lado y revisa si el borde pertenece.

#### Palabras nuevas

| Palabra | Explicación cotidiana | Tres ejemplos de uso propio |
|---|---|---|
| Frontera | El borde donde la condición llega justo a su límite. | Agotar el máximo; alcanzar la diferencia exigida; llegar al mínimo del pedido. |
| Semiplano | Uno de los dos lados en que una recta divide la hoja. | Más B que el borde; menos B que el borde; más A que una línea vertical. |
| Punto de prueba | Un pedido elegido para comprobar qué lado funciona. | Uno fuera de la recta; el pedido cero si no cae en ella; un pedido sencillo con una cantidad nula. |

#### Ahora tú

1. Colocar una boleta en el plano y comprobar si representa el pedido correcto.
2. Distinguir frontera incluida y excluida mediante sustitución de un punto del borde.
3. Elegir semiplano con un punto de prueba dado.
4. Resolver casos con recta vertical, horizontal o que pasa por el origen.
5. Nivel de examen: elegir entre gráficos de una inecuación presentada sin despejar, justificando lado y borde con sustituciones.

### Idea 3. Todas las condiciones a la vez

**Pregunta que responde.** ¿Qué pedidos quedan cuando una condición de promoción se combina con existencias y requisitos de compra?

**Aprendizaje.** El alumno construye la región común y justifica por qué un pedido que falla una sola condición queda excluido.

**Objeto de la primera pantalla.** La mercería presenta dos rollos, una tarjeta de existencias y la orden de un cliente. Las condiciones se muestran primero como notas pegadas a esos objetos. El plano se abre como vista adicional después de leerlas; el dibujo no sustituye la historia del pedido.

#### Lee

- Tarjeta 1: «Además de una promoción, la tienda tiene existencias y el cliente puede exigir una cantidad mínima».
- Tarjeta 2: «Cada condición se revisa por separado, pero el pedido final tiene que pasar todas las revisiones».
- Tarjeta 3: «Guardaremos en una misma hoja los pedidos que sobreviven a cada revisión».

#### Juega

El alumno arma un pedido dentro de un máximo total y de una existencia específica de A. Después debe guardar tres pedidos diferentes que pasen ambas condiciones. El programa comprueba las sustituciones, muestra una marca independiente por condición y conserva los puntos aceptados. La región común se va revelando con los casos explorados; el borde exacto se presenta completo en Mira.

La misión requiere que al menos uno de los pedidos no agote ninguno de los recursos. Así se evita que el alumno infiera que «cumplir» equivale siempre a «usar todo». No se introduce todavía una ganancia ni se declara mejor a ningún pedido. Un fracaso muestra qué nota se incumplió y conserva las restantes como cumplidas.

#### Predice

**Información nueva:** otro cliente solicita al menos 9 m entre A y B, pero la promoción de ese pedido permite como máximo 8 m entre ambas. No hay cambios ni excepciones a esas condiciones.

**Pregunta:** «¿Qué pedidos podrá aceptar la tienda para esa solicitud?».

| Opción | Contenido | Clave o error asociado |
|---|---|---|
| A | Ninguno: ninguna longitud total cumple simultáneamente ambos requisitos. | Correcta. |
| B | Cualquier pedido que cumpla una de las dos notas. | UNA. |
| C | El pedido situado en el cruce de las dos fronteras, porque dos condiciones siempre producen un par. | IGU. |
| D | Alguno que parezca quedar entre las rectas, sin necesidad de comprobar sus cantidades. | VIS. |

El dato nuevo es la incompatibilidad de las cotas. No se entrega el sistema simbólico ni una regla de intersección en esta pantalla.

#### Mira

Una misma longitud total se compara con las dos notas. Se muestra que acercarse a una condición no basta para satisfacer la otra. Después aparecen sus dos regiones separadas: no hay zona común. Se nombra el conjunto vacío y se devuelve el resultado al cliente: con esas condiciones no existe pedido aceptable.

Se ofrece una revisión posterior, ya después de responder, en la que el mínimo del cliente coincide con el máximo de la tienda. Ahora sí aparecen pedidos sobre una frontera común. Este contraste distingue «no hay zona con interior» de «no hay ninguna solución».

#### La regla

Un sistema exige que todas sus inecuaciones y ecuaciones se cumplan al mismo tiempo. Su región factible, llamada aquí $R$, es la intersección de los conjuntos solución, incluidos el dominio y las condiciones de no negatividad del contexto. Intersección significa parte común; no significa sumar áreas ni quedarse con cualquiera de las condiciones.

Para decidir si un par pertenece a $R$, se sustituye en cada condición. Basta una comparación falsa para excluirlo. Para describir $R$ gráficamente se dibujan las fronteras, se identifican sus lados y se conserva la parte común. Un cruce de rectas es solamente un candidato: puede quedar fuera de otra condición.

La región puede ser vacía, un punto, un segmento, una región con área limitada o una zona que se prolonga sin límite. Un sistema de desigualdades lineales sobre números reales define un conjunto convexo: si dos puntos pertenecen, todo el segmento entre ellos también pertenece. Esto se justifica porque combinar en la misma proporción dos desigualdades verdaderas preserva cada condición lineal. La propiedad se aplicará al modelo continuo; al restringir a enteros, los puntos intermedios no necesariamente son admisibles.

Una restricción es redundante si las demás ya garantizan su cumplimiento. Retirarla no cambia $R$. En cambio, agregar una condición solo puede conservar o reducir el conjunto de soluciones, nunca ampliarlo, si todo lo demás permanece igual. Esta afirmación trata sobre pedidos posibles; todavía no dice qué ocurre con un importe óptimo.

#### Así se resuelve

El ejemplo combina un máximo total, una existencia de A y un mínimo de B. Se escribe una fila por condición, con su frase de origen. Se trazan sus fronteras, se registra si incluyen igualdad y se elige la zona común. Las intersecciones candidatas se calculan resolviendo parejas de ecuaciones, pero cada resultado se comprueba luego en todas las condiciones.

#### Palabras nuevas

| Palabra | Explicación cotidiana | Tres ejemplos de uso propio |
|---|---|---|
| Intersección | Lo que queda en común al aplicar varias condiciones. | Cumplir promoción y existencias; respetar dos máximos; atender un mínimo sin superar un máximo. |
| Factible | Que el pedido puede hacerse bajo todas las reglas del modelo. | Un pedido interior; uno sobre un borde permitido; el pedido cero cuando no hay mínimo obligatorio. |
| Convexo | Que unir dos pedidos permitidos por un segmento no saca la mezcla continua de la zona permitida. | Una región triangular; un segmento permitido; la intersección de dos semiplanos. |

#### Ahora tú

1. Completar una tabla de verdadero o falso para un pedido y cada condición.
2. Localizar una región común entre dos desigualdades.
3. Detectar una región vacía y explicar la incompatibilidad en palabras.
4. Reconocer un punto o segmento como conjunto factible, sin exigir que tenga área.
5. Detectar una condición redundante mediante implicación o prueba de las cotas.
6. Nivel de examen: encontrar las intersecciones que realmente pertenecen a un sistema de varias restricciones y justificar cada descarte mediante una condición incumplida.

### Idea 4. Posible no significa mejor

**Pregunta que responde.** ¿Qué cantidad queremos mejorar y cómo comparamos pedidos permitidos?

**Aprendizaje.** El alumno distingue las restricciones de la función que evalúa cada pedido y compara importes sin confundirlos con metros.

**Objeto de la primera pantalla.** Dos pedidos aceptados están sobre el mostrador, cada uno con su boleta. Al lado hay etiquetas de precio por metro. El dinero aparece como importe de la boleta, no como un número flotante sobre un plano.

#### Lee

- Tarjeta 1: «Estos pedidos ya cumplen las condiciones. Ahora la tienda necesita compararlos usando un mismo criterio».
- Tarjeta 2: «Una etiqueta indica cuánto aporta un metro de cada cinta al importe de la boleta».
- Tarjeta 3: «La longitud y el importe son cantidades distintas. Las anotaremos con sus respectivas unidades».

#### Juega

Se ofrecen tres pedidos factibles y precios didácticos por metro. El alumno los coloca en una bandeja de comparación, reconstruye cada boleta a partir de sus dos aportes y ordena los importes de menor a mayor. El programa verifica la suma monetaria y el orden. La misión termina cuando los tres pedidos están bien ordenados, incluso si su orden por longitud total es diferente.

Todavía no se pide hallar el mejor entre todos los pedidos de la región. La pantalla dice «mayor entre estos tres» para no presentar una muestra como prueba global. Los precios permanecen fijos durante el juego. El cambio reservado para Predice es una modificación de un solo precio.

#### Predice

**Información nueva:** dos pedidos permitidos llevan igual cantidad de B, pero el primero lleva más A. Sube únicamente el precio por metro de A; las cantidades de ambos pedidos y las restricciones permanecen iguales.

**Pregunta:** «¿Cuál de las dos boletas aumentará más?».

| Opción | Contenido | Clave o error asociado |
|---|---|---|
| A | La del primer pedido, porque contiene más metros del tipo cuyo precio subió. | Correcta. |
| B | Ambas aumentarán igual, pues el precio por metro subió lo mismo. | OBJ. |
| C | Ninguna cambiará: ser un pedido permitido fija para siempre su importe. | FAC. |
| D | No puede haber dos pedidos permitidos para comparar; debe existir un único par. | IGU. |

La pregunta no solicita un cálculo final ni entrega la fórmula general del importe. Obliga a identificar qué cantidad multiplica el cambio.

#### Mira

Se añaden a cada boleta los incrementos correspondientes a sus metros de A. El aporte de B queda visible e idéntico al anterior. Las boletas cambian mientras los puntos de la región permanecen en el mismo lugar: modificamos el criterio monetario, no las cantidades ni los pedidos permitidos.

#### La regla

La función objetivo asigna a cada pedido un valor que queremos maximizar o minimizar. Aquí $z$, importe total evaluado en soles, se expresa como $z=px+qy$. La letra $p$ es el importe por metro de A y $q$ el importe por metro de B, ambos en soles por metro. La unidad de cada producto es soles. La fórmula puede representar ingreso o costo según el problema, pero $z$ conserva siempre el significado de importe evaluado; no se lo llama ganancia si no se han descontado costos.

Un pedido factible cumple las restricciones. Un pedido óptimo es factible y alcanza el mejor valor del objetivo entre todos los factibles. La solución óptima es el pedido; el valor óptimo es su importe. No son la misma respuesta, y un examen puede pedir uno, el otro o una combinación de las cantidades del pedido.

Para un importe fijo $k$, la ecuación $px+qy=k$ reúne pedidos del mismo valor. Si $p$ y $q$ no son ambos cero, esas líneas de igual importe son rectas paralelas al variar $k$. Su desplazamiento ayuda a entender qué significa mejorar, pero mover una línea en la pantalla no demuestra por sí solo haber encontrado el óptimo. Si ambos coeficientes son cero, todos los pedidos factibles tienen importe cero y no se dibuja una familia de rectas.

Los coeficientes son constantes dentro de cada escenario. No corresponden a esta formulación descuentos que cambian automáticamente al superar un umbral, costos fijos activados solo al comprar o productos entre variables. Esos casos requieren otro modelo o una separación explícita por tramos.

#### Así se resuelve

El ejemplo ofrece una tabla con dos tipos de cinta, sus precios por metro y varios pedidos ya comprobados. Se identifica la pregunta, se construye el aporte de cada tipo y se suma para obtener el importe. Se ordenan los resultados y se responde con el alcance correcto: «mejor entre los pedidos ofrecidos».

#### Palabras nuevas

| Palabra | Explicación cotidiana | Tres ejemplos de uso propio |
|---|---|---|
| Función objetivo | La cuenta que permite comparar los pedidos con un criterio concreto. | Ingreso por venta; costo de adquisición; importe de una orden. |
| Maximizar | Encontrar el mayor valor permitido del criterio elegido. | Mayor ingreso posible; mayor importe entre tres pedidos; mayor valor dentro de una región. |
| Minimizar | Encontrar el menor valor permitido del criterio elegido. | Menor costo cumpliendo el pedido; menor importe con un mínimo obligatorio; menor valor en una lista factible. |

#### Ahora tú

1. Distinguir datos que limitan el pedido de datos que permiten valorarlo.
2. Construir un importe a partir de precios por metro y cantidades dadas.
3. Elegir entre expresiones de longitud, ingreso y costo, con todas las relaciones disponibles.
4. Identificar pedidos distintos con el mismo importe.
5. Nivel de examen: interpretar el objetivo de un problema contextualizado y diferenciar cantidad óptima de valor óptimo.

### Idea 5. Comparar esquinas con una razón

**Pregunta que responde.** ¿Cuándo basta revisar un número finito de pedidos para encontrar el mejor de una región continua?

**Aprendizaje.** El alumno aplica el método de vértices con sus condiciones y reconoce que dos extremos empatados pueden producir todo un lado óptimo.

**Objeto de la primera pantalla.** La vendedora compara pedidos guardados en sobres, cada uno con su boleta y su uso de existencias. Al abrir la hoja del pedido, los sobres se conectan con las esquinas de una región poligonal. Las esquinas no se presentan como puntos especiales por su color, sino como pedidos donde coinciden fronteras activas.

#### Lee

- Tarjeta 1: «La región contiene muchos pedidos. Algunos están en esquinas donde se encuentran bordes del conjunto permitido».
- Tarjeta 2: «Cada esquina sigue siendo un pedido con dos cantidades; también necesita una boleta y una revisión».
- Tarjeta 3: «Compararemos los importes de varios pedidos especiales y explicaremos por qué esta comparación puede alcanzar a todos».

#### Juega

Se entrega una región cerrada, no vacía y acotada, con vértices correctamente identificados y coordenadas proporcionadas. El alumno conecta cada vértice con su pedido y evalúa su boleta. La misión es ordenar todos los vértices por importe y señalar el mayor, bajo precios elegidos para que no exista empate.

El programa comprueba que se evaluaron todos los vértices factibles y que el seleccionado tiene el mayor importe entre ellos. Deja visible la diferencia entre un cruce de rectas fuera de la región y una esquina del conjunto permitido. La explicación de por qué basta esa lista llega en La regla. No se habilitan todavía precios que produzcan un lado empatado.

#### Predice

**Información nueva:** para otra lista de precios, los dos extremos de un mismo lado permitido tienen el mismo importe, y ese importe es el mayor de todos los vértices. El lado completo pertenece a la región y se admiten longitudes continuas.

**Pregunta:** «¿Qué ocurre con los pedidos situados entre esos dos extremos?».

| Opción | Contenido | Clave o error asociado |
|---|---|---|
| A | Todos tienen ese mismo importe máximo. | Correcta. |
| B | Ninguno puede ser óptimo: solo una esquina puede dar la respuesta. | VER. |
| C | Uno del medio necesariamente tendrá un importe mayor que ambos extremos. | OBJ. |
| D | Todo el plano es óptimo, incluidos pedidos que incumplen las restricciones. | UNA. |

Los datos expresan el empate observado en los extremos, pero no incluyen la regla de combinación lineal que lo explica. No se muestra un pedido intermedio antes de confirmar.

#### Mira

Un pedido intermedio se reconstruye mezclando las cantidades de los extremos en la misma proporción. Su boleta conserva el importe. Se ensayan otras posiciones del lado y se mantiene el resultado. Al mismo tiempo se muestra un punto exterior que no cumple las existencias, para separar «mismo importe» de «solución permitida».

#### La regla

En una región factible poligonal, cerrada, acotada y no vacía, una función lineal alcanza máximo y mínimo, y existe al menos un vértice donde alcanza cada uno. Si la región es un segmento se comparan sus extremos; si es un punto se evalúa ese punto. Se exige cerrado porque una frontera excluida puede impedir alcanzar el valor al que nos aproximamos.

La razón del método es que cualquier punto de un polígono convexo puede expresarse como combinación de sus vértices con pesos no negativos que suman uno. La función lineal aplicada a esa combinación produce la misma combinación de los valores de los vértices: no puede superar el mayor ni quedar bajo el menor. No hace falta memorizar la notación de esos pesos; basta comprender una mezcla proporcional y luego generalizarla.

El procedimiento completo es formular el dominio y las restricciones, comprobar que existe región, obtener los cruces de fronteras, descartar los que incumplen alguna condición, identificar los vértices reales y evaluar el objetivo en todos ellos. Las intersecciones con los ejes solo son candidatas cuando los ejes delimitan la región y los puntos pasan las demás condiciones.

Si dos vértices de un lado tienen el mismo valor óptimo, todo ese lado es óptimo en el modelo continuo. Si el objetivo es constante, toda la región puede ser óptima. Si existe un único vértice con valor estrictamente mejor que los demás en un polígono acotado, ese vértice es la única solución óptima. La comparación se realiza con valores exactos o con precisión suficiente, no por el tamaño aparente de las boletas.

#### Así se resuelve

Se propone una mercería con dos recursos limitados y precios por metro. La resolución crea una tabla de cruces de fronteras, indica qué condiciones satisface cada uno y conserva solo vértices factibles. A continuación evalúa el importe, compara y redacta la respuesta con longitudes e importe.

#### Palabras nuevas

| Palabra | Explicación cotidiana | Tres ejemplos de uso propio |
|---|---|---|
| Vértice | Una esquina del conjunto de pedidos permitidos. | Cruce de dos límites activos; esquina sobre un eje permitido; extremo de un segmento factible. |
| Óptimo | El mejor valor alcanzable bajo las condiciones y el criterio elegidos. | Mayor ingreso; menor costo; varios pedidos empatados en el mejor importe. |
| Acotado | Que el conjunto cabe dentro de un espacio limitado del plano. | Un triángulo factible; un rectángulo de existencias; un segmento con extremos incluidos. |

#### Ahora tú

1. Evaluar una función objetivo en vértices ya proporcionados.
2. Identificar y descartar un cruce no factible.
3. Resolver un problema completo con región poligonal acotada.
4. Reconocer un lado óptimo y distinguir muchos pedidos de un solo valor óptimo.
5. Nivel de examen: comparar máximo y mínimo, justificar afirmaciones sobre unicidad y construir un contraejemplo a «el cruce principal siempre gana».

### Idea 6. Revisar lo que el dibujo no garantiza

**Pregunta que responde.** ¿Qué cambia si la región continúa, si un borde está excluido o si solo se admiten metros enteros?

**Aprendizaje.** El alumno distingue una solución inexistente, un objetivo sin cota y un óptimo continuo que no resuelve automáticamente una decisión entera.

**Objeto de la primera pantalla.** Aparece un pedido de cinta con dos modalidades: venta por longitud continua y venta de sobres cerrados con cortes de un metro. En un segundo panel, una hoja de pedido tiene una flecha de continuación porque falta un límite de existencias en el modelo. La flecha es una advertencia sobre las condiciones escritas, no una afirmación de que una tienda real disponga de stock infinito.

#### Lee

- Tarjeta 1: «Un corte suelto permite elegir fracciones de metro. Un sobre cerrado de un metro se entrega completo».
- Tarjeta 2: «La forma de vender debe estar escrita en las condiciones. No se deduce del aspecto del dibujo».
- Tarjeta 3: «La ventana del gráfico muestra solo una parte de la hoja. Su borde no agrega una restricción al pedido».

#### Juega

En la modalidad continua se proporciona un óptimo con alguna longitud no entera, junto con la región y su función objetivo ya trabajadas. La misión es reconstruir ese pedido y comprobar que pasa todas las condiciones. Luego, en una actividad separada de exploración, el alumno amplía la ventana de una región no acotada y encuentra dos puntos factibles fuera de la vista inicial.

El programa comprueba pertenencia y registra las coordenadas nuevas; no considera las dimensiones de la pantalla como cotas. No activa todavía la venta entera para el caso de Predice ni calcula un óptimo entero. El objetivo del juego es hacer visible la diferencia entre una condición matemática, una modalidad de venta y un recorte visual.

#### Predice

**Información nueva:** el cliente cambia a sobres indivisibles de un metro. El óptimo anterior requería alguna longitud fraccionaria, y ninguna regla permite abrir un sobre.

**Pregunta:** «¿Cómo debe revisarse la respuesta anterior?».

| Opción | Contenido | Clave o error asociado |
|---|---|---|
| A | Buscar pedidos con metros enteros, comprobar todas las condiciones y comparar sus importes; redondear no basta. | Correcta. |
| B | Redondear cada cantidad al entero más cercano y conservar la conclusión de óptimo. | RED. |
| C | Conservar el pedido fraccionario porque su punto está dentro de la región continua. | VIS. |
| D | Elegir cualquier pedido entero que cumpla las restricciones, porque ya será óptimo. | FAC. |

La predicción no pregunta cuál es el óptimo entero: pregunta qué criterio de solución resulta válido. Así no exige un algoritmo que todavía no se presentó.

#### Mira

La escena muestra sobres completos y comprueba un pedido obtenido por redondeo que viola una condición, en un caso diseñado y recalculado para ello. Después muestra otro pedido entero factible. Todavía debe compararse su importe con el de los demás candidatos: encontrar uno permitido no termina la optimización.

#### La regla

Conviene separar tres preguntas: si existe al menos un pedido factible, si el objetivo tiene una cota finita en el sentido buscado y si esa cota se alcanza. Una región no acotada puede tener mínimo finito. Por ejemplo, para longitudes no negativas y precios positivos, el pedido cero minimiza el importe si no hay mínimos de compra, aunque el conjunto se prolongue indefinidamente. En ese mismo modelo el ingreso máximo no existe como valor finito si podemos aumentar una longitud sin límite.

Que una región sea no acotada no decide por sí solo la existencia del óptimo. Hay que analizar el objetivo y una dirección en que se pueda seguir dentro del conjunto. Para demostrar que un máximo no tiene cota basta construir pedidos factibles con importes cada vez mayores, sin límite. En regiones no acotadas, revisar una lista visible de vértices sin analizar esa posibilidad no demuestra un máximo.

Una desigualdad estricta puede permitir aproximarse a un valor sin alcanzarlo. «Menos de cierto largo» excluye el pedido que llega exactamente a ese largo. Si el importe crece hacia esa frontera, no hay máximo alcanzado allí. El límite superior al que se aproxima se llama supremo; esta palabra se explica solo como ampliación conceptual y no se exige formalismo de análisis real.

En la modalidad de sobres, $x$ e $y$ son metros enteros no negativos. Los puntos factibles pertenecen a la cuadrícula entera y cumplen todas las restricciones. Si hay un número finito y manejable de pares, se puede enumerar por filas o por valores de una variable, acotando la otra con las desigualdades y comparando el objetivo. Al contar soluciones, se incluyen o excluyen extremos según la desigualdad. No basta contar puntos dibujados con un zoom arbitrario.

Para maximización, el óptimo continuo proporciona una cota superior al óptimo entero, porque permite más pedidos; para minimización proporciona una cota inferior. Si un óptimo continuo ya tiene coordenadas enteras y cumple la modalidad, también es óptimo entero. En los demás casos no existe autorización general para redondear, ni para revisar únicamente los dos vecinos más cercanos. No se enseñarán simplex, ramificación y acotación ni programación entera avanzada en esta unidad.

#### Así se resuelve

El ejemplo principal ofrece un rectángulo pequeño de búsqueda, restricciones lineales y venta en sobres. Primero se determina el intervalo entero posible para A; después, para cada valor de A, se obtienen los valores enteros permitidos de B. La tabla conserva solo pares factibles, calcula su importe y compara. La solución explica por qué la enumeración fue exhaustiva y devuelve una cantidad entera de sobres.

#### Palabras nuevas

| Palabra | Explicación cotidiana | Tres ejemplos de uso propio |
|---|---|---|
| Dominio | Las cantidades que el modelo permite considerar desde el comienzo. | Metros reales no negativos; metros enteros en sobres; valores restringidos por una modalidad de venta. |
| No acotado | Que el conjunto permite seguir hacia alguna dirección sin un límite escrito. | Sin máximo total; sin cota para B; una zona que sale de cualquier ventana finita. |
| Redondeo | Cambiar una cantidad por otra cercana con menos precisión. | Aproximar una longitud medida; pasar un decimal a un entero; cambiar una cifra que después necesita comprobarse. |
| Cota | Un límite para comparar valores, aunque no siempre sea alcanzable. | Ingreso continuo que limita al entero; costo continuo que queda por debajo del entero; importe al que se aproxima un borde excluido. |

#### Ahora tú

1. Distinguir pedidos continuos y enteros con la misma leyenda de longitudes.
2. Refutar un redondeo verificando una restricción.
3. Enumerar soluciones enteras en una región pequeña.
4. Reconocer un mínimo finito en una región no acotada.
5. Mostrar por qué un objetivo puede crecer sin límite o aproximarse a una frontera excluida.
6. Nivel de examen: evaluar afirmaciones generales sobre máximo, mínimo, dominio y cambios de restricciones, con contraejemplos propios.

### Cierre de la secuencia y contrato de práctica

Cada ejercicio de Ahora tú entregará sus datos y las relaciones necesarias. En modelación se ofrecerán formas generales de restricción y de objetivo, sin señalar cuál corresponde a cada oración. En optimización se proporcionará el criterio de vértices con sus hipótesis, para que el alumno decida si puede aplicarlo. En tareas enteras se declarará el dominio. Una pregunta que evalúa elegir un método no puede incluir como pista «usa los vértices» si esa decisión es precisamente lo evaluado.

## 6. Tabla de letras y símbolos de la unidad

| Letra o símbolo | Significado único en esta propuesta | Unidad o aclaración |
|---|---|---|
| $x$ | Longitud de cinta A del pedido. | Metros; en modalidad de sobres, metros enteros. |
| $y$ | Longitud de cinta B del pedido. | Metros; en modalidad de sobres, metros enteros. |
| A, B | Nombres de los dos tipos de cinta, no variables numéricas. | Sin unidad. No usar A también para área. |
| $a$, $b$ | Coeficientes de una restricción correspondientes a A y B. | Unidades del recurso o criterio restringido por metro. Si se restringe longitud total, coeficientes adimensionales. |
| $c$ | Límite de la cantidad expresada en una restricción. | Misma unidad que $ax+by$. No representa costo. |
| $a_j$, $b_j$, $c_j$ | Coeficientes y límite de la restricción identificada por el índice $j$. | Misma regla de unidades de la fila anterior. |
| $j$ | Índice que identifica una restricción cuando hay varias. | Entero sin unidad. No mide cantidad de cinta. |
| $p$, $q$ | Importe por metro de cinta A y B, respectivamente. | S/ por metro. Se advierte que p no significa probabilidad. |
| $z$ | Importe total evaluado por la función objetivo. | Soles. En cada problema se declara si representa ingreso o costo. |
| $k$ | Importe fijo de una línea de igual valor. | Soles; no es un número de cortes. |
| $R$ | Región factible del problema. | Conjunto de pares; no confundir con $\mathbb{R}$, los números reales. |
| $(x,y)$ | Pedido escrito como par ordenado, primero A y después B. | Cada coordenada conserva metros. |
| $x_0$, $y_0$ | Valores concretos de las longitudes de un pedido identificado. | Metros; el subíndice cero no significa que su valor sea cero. |
| $=$, $<$, $>$, $\leq$, $\geq$ | Igualdad y comparaciones estrictas o inclusivas. | Se leen en palabras al aparecer por primera vez. |
| $\in$ | «Pertenece a», usado para un punto y un conjunto. | Sin unidad. |
| $\varnothing$ | Conjunto vacío: ningún pedido cumple. | No equivale a un pedido de longitud cero. |
| $\cap$ | Intersección: parte común de conjuntos. | Se introduce después de la explicación cotidiana. |
| $\mathbb{R}$ | Números reales, usados en el modelo continuo. | Dominio numérico, distinto de la región R. |
| $\mathbb{Z}_{\geq0}$ | Enteros no negativos. | Cero, uno, dos y así sucesivamente; se explicita que incluye cero. |
| m, cm, S/ | Metro, centímetro y sol. | Son unidades, no letras de decisión ni coeficientes. |
| Máx., Mín., s. a. | Maximizar, minimizar y «sujeto a». | Notación habitual de optimización, que se desarrolla en palabras. |

## 7. Otras formas de explicarla

Los recursos siguientes orientan la explicación; no constituyen evidencia de eficacia de esta app.

| Representación y antecedente | Idea | Qué aporta | Riesgo y control |
|---|---|---|---|
| Boleta y cantidades; diseño propio compatible con los registros de Reaño [A06]. | 1 y 4. | Conecta términos, objetos y unidades. | Introducir dinero demasiado pronto. Empezar con longitudes. |
| Recta y puntos de prueba; OpenStax §5.5 [A09]. | 2. | Justifica cada lado mediante sustitución. | Memorizar «arriba». Variar orientación y comprobar puntos. |
| Transparencias superpuestas; OpenStax §5.10 [A10]. | 3. | Hace visible la parte común. | Aceptar cualquier zona coloreada. Mostrar una marca por restricción. |
| Tabla de recursos e importes; diseño propio, terminología contrastada con [A11]. | 4 y 5. | Separa cumplimiento y comparación. | Confundir una muestra con búsqueda exhaustiva. Declarar cuándo contiene todos los vértices. |
| Rectas de igual importe; representación estándar contrastada con [A11]. | 4 y 5. | Relaciona desplazamiento y cambio de valor. | Resolver por aproximación visual. Mantener valores exactos y distinguir objetivo constante. |
| Mezcla proporcional de pedidos; justificación propia. | 3 y 5. | Explica convexidad y empates. | Aceptar medio sobre. Usar primero cantidades continuas. |
| Puntos enteros sobre la región; diseño motivado por los dominios del sílabo [A02]. | 6. | Separa conjunto continuo y decisiones enteras. | Elegir el entero más cercano. Comprobar todas las restricciones y justificar la búsqueda. |

Los ejes representan cantidades, no la ubicación geográfica de una tienda. Una balanza equilibrada tampoco sustituye la explicación de una inecuación: podría reforzar la confusión entre igualdad y desigualdad.

## 8. Datos del mundo

| Dato u objeto comprobable | Fuente | Uso y límite |
|---|---|---|
| Taquile es una isla del lago Titicaca, en Puno, con actividad textil descrita en el inventario turístico. | MINCETUR, s. f., ficha 959 [A12]. | Contexto de textiles; no atribuirle la mercería ficticia ni sus rendimientos. |
| El arte textil de Taquile figura inscrito en la lista representativa de UNESCO en 2008. | UNESCO, ficha indexada y listado de Perú [A13]. | Contexto cultural opcional. No es un dato de productividad. |
| Centi equivale a una centésima: un metro contiene cien centímetros. | BIPM, tabla de prefijos [A14]. | Cambiar unidades de un corte; entregar la equivalencia. |
| Milli equivale a una milésima de la unidad. | BIPM [A14]. | Interpretar milímetros sin confundir resolución de pantalla con precisión real. |

Los 12 m de la promoción, los precios y las existencias son parámetros originales del problema, no datos observados. Se rotularán como tales. Un caso real de abastecimiento exigiría fichas y presupuestos fechados para cada número; esta propuesta no inventa precios típicos ni ganancias de artesanos.

## 9. Dudas y decisiones

- **Frecuencias:** no hay una muestra homogénea de exámenes completos que permita estimarlas. Se diferencia pregunta oficial, atribución secundaria y presencia curricular.
- **Acceso:** el reglamento UNMSM solo fue recuperable parcialmente; de Reaño se leyó el resumen original y no la tesis completa; UNESCO presentó una barrera en la ficha, con datos visibles en su índice institucional. La copia CEPRE-UNMSM no se autenticó por descarga oficial.
- **Alcance matemático:** se admiten fronteras verticales y horizontales; basta que los dos coeficientes de una restricción no sean simultáneamente cero. El teorema de vértices se introduce con región cerrada, acotada y no vacía, antes de sus excepciones.
- **Contexto:** la cinta permite cantidades continuas creíbles. Los sobres de un metro introducen enteros sin cambiar el significado de las variables.
- **Por implementar:** recalcular datos, encontrar testigos de cada misión y comprobar unicidad de claves. No se afirma que haya un motor o banco de ejercicios probado.
- **Por decidir en el proyecto:** inclusión del contexto cultural de Taquile; obligatoriedad del cierre entero; aparición de «supremo» solo como ampliación.
- **Por validar con alumnos:** observar IGU, SOM y UNA y comprobar si los distractores hipotéticos corresponden a razonamientos reales. Un clic aislado no diagnostica una concepción.

**Auditoría del orden:** solución → una región → región común → objetivo → vértices → excepciones y enteros. Cada procedimiento usa conceptos ya presentados.

**Auditoría de predicciones:** seis preguntas, cuatro opciones cada una y dieciocho distractores codificados. Se reservan, en orden: igualdad exacta, nueva orientación, cotas incompatibles, cambio de precio, empate en un lado y dominio entero. Las claves aparecen como A para revisión editorial; su posición debe permutarse en la app.

## 10. Fuentes

«S. f.»: año editorial no confirmado. Consulta: 22 de noviembre de 2026. Guiones y escenas originales; fuentes usadas para investigación y contraste.

- **[A01] Universidad Nacional de Ingeniería, Oficina Central de Admisión. (2017).** *Solucionario del examen de admisión 2017-1*. Segunda prueba, pregunta 18, p. impresa 34. Fuente institucional. [PDF](https://admision.uni.edu.pe/wp-content/uploads/2022/11/solucionario20171.pdf).
- **[A02] Centro de Estudios Preuniversitarios de la UNI. (2026).** *Guía del Estudiante – Ciclo Preuniversitario, Admisión 2026-2*. Sílabo de Álgebra, semanas 16 y 17, p. impresa 35. [PDF](https://www.cepre.uni.edu.pe/assets/archivos/comunicados/PREUNIVERSITARIO-GUIADELESTUDIANTE-2026-2.pdf).
- **[A03] Colegio San Vicente de Paúl. (s. f.).** *Práctica 21: Programación lineal*, quinto de secundaria. Ejercicio 12 atribuido a UNMSM 2020-I, áreas C y E. Atribución secundaria. [PDF consultado](https://intranet.svp.edu.pe/uploads/240621222341-S5%20-%20MAT%20-%20PRA%2021%20-%20PROGRAMACI%C3%93N%20LINEAL.pdf).
- **[A04] Centro Preuniversitario de la UNMSM. (2025).** *Boletín, semana 18, ciclo 2025-II*. Álgebra: sistemas de inecuaciones e introducción a programación lineal, pp. impresas 40–44. Copia de terceros. [Copia consultada](https://es.scribd.com/document/1019103965/BOLETIN-SEMANA-N-18-CICLO-2025-II).
- **[A05] Universidad Nacional Mayor de San Marcos. (2022).** *Reglamento de Admisión 2022-II*. Temario de Álgebra, apartados 16.3 y 16.4. Acceso parcial mediante índice de búsqueda; apertura directa fallida. [Enlace institucional](https://viceacademico.unmsm.edu.pe/wp-content/uploads/2022/01/REGLAMENTO-DE-ADMISI%C3%93N-2022-II.pdf).
- **[A06] Reaño Paredes, Carolina Rita. (2015, fecha de publicación del registro).** *Sistemas de inecuaciones lineales con dos incógnitas y problemas de programación lineal: una mirada desde la teoría de situaciones didácticas*. Tesis, Pontificia Universidad Católica del Perú. Resumen original consultado. [Registro y resumen](https://tesis.pucp.edu.pe/items/bd7ccf5a-b49e-4399-90c8-30caf4ccf1e4).
- **[A07] Yokoso, Victor; Kabutey, Davidson Teye; Ansah, Susan; Ntow, Yvonne Mawusi; y Ofotsu, Sylvia. (2024).** “Errors and Misconceptions in Linear Inequalities Among Senior High Students in Mfantseman Municipality”. *International Journal of Mathematics and Statistics Studies*, 12(2), 56–70. [Artículo original](https://eajournals.org/ijmss/wp-content/uploads/sites/71/2024/03/Errors-and-Misconceptions-in-Linear-Inequalities.pdf).
- **[A08] Nasrullah, Anton; Suryadi, Didi; Prabawanto, Sufyani; Hendriyanto, Agus; Muhaimin, Lukman Hakim; y Dewi, Deshinta Arrova. (2026).** “Assessing the impact of mathematics textbooks on learning obstacles and student performance in systems of linear inequalities in two variables”. *Discover Education*, 5, artículo 1036. Publicado el 28 de septiembre de 2026. Resultados consultados: §3.2. [Artículo original](https://doi.org/10.1007/s44217-026-02064-x).
- **[A09] OpenStax. (2023).** *Contemporary Mathematics*, §5.5, “Graphing Linear Equations and Inequalities”. [Capítulo](https://openstax.org/books/contemporary-mathematics/pages/5-5-graphing-linear-equations-and-inequalities).
- **[A10] OpenStax. (2023).** *Contemporary Mathematics*, §5.10, “Systems of Linear Inequalities in Two Variables”. [Capítulo](https://openstax.org/books/contemporary-mathematics/pages/5-10-systems-of-linear-inequalities-in-two-variables).
- **[A11] OpenStax. (2023).** *Contemporary Mathematics*, §5.11, “Linear Programming”. [Capítulo](https://openstax.org/books/contemporary-mathematics/pages/5-11-linear-programming).
- **[A12] Ministerio de Comercio Exterior y Turismo del Perú. (s. f.).** *Inventario Nacional de Recursos Turísticos: Isla Taquile*, ficha 959. [Ficha oficial](https://consultasenlinea.mincetur.gob.pe/fichaInventario/index.aspx?cod_Ficha=959).
- **[A13] UNESCO. (2008, año de inscripción; ficha sin fecha de actualización confirmada).** *El arte textil de Taquile*. Consulta parcial e índice institucional. [Ficha](https://ich.unesco.org/es/RL/el-arte-textil-de-taquile-00166) y [listado de Perú](https://ich.unesco.org/es/estado/peru-PE).
- **[A14] Bureau International des Poids et Mesures. (s. f.).** *The International System of Units: Prefixes*. Tabla oficial de múltiplos y submúltiplos decimales. [Tabla](https://www.bipm.org/en/measurement-units/si-prefixes).
