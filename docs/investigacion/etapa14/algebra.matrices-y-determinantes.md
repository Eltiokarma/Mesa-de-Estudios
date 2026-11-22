# Álgebra · Matrices y determinantes

## 1. Resumen en 5 líneas

La unidad enseña a organizar información en matrices y a interpretar cada posición antes de operar.
Construye la suma, el producto por un número, la traspuesta y el producto matricial mediante registros y pedidos.
Presenta el determinante como un número asociado a una matriz cuadrada, con procedimientos y propiedades.
Conecta la inversa y los determinantes con la recuperación de información y la resolución de sistemas lineales.
Lo más difícil es abandonar reglas de los números que no se trasladan a las matrices y comprobar las condiciones de cada método.

## 2. Qué se pregunta en los exámenes

**Alcance de la revisión.** Investigación de esta entrega: 22 de noviembre de 2026. Se revisaron los enunciados pertinentes del solucionario oficial UNI 2020-1, el programa del ciclo básico publicado por CEPREUNI y un boletín histórico del Centro Preuniversitario UNMSM conservado en una copia externa. Esta última mantiene encabezados, ciclo y paginación institucionales, pero su alojamiento no es oficial y no acredita el temario vigente. La muestra permite identificar formatos; no permite estimar qué tema aparece más en una serie representativa de admisiones.

La dificultad es una **valoración de diseño**, no un índice psicométrico publicado: básica exige reconocer o ejecutar una operación; media exige encadenar procedimientos; alta exige justificar condiciones o evaluar proposiciones. Las referencias F1–F10 se desarrollan en la sección 10. Los problemas oficiales se describen por su estructura; las escenas de la sección 5 son originales.

| Tipo de pregunta | Universidad | Dificultad | Frecuencia | Fuente |
|---|---|---|---|---|
| Construir una matriz rectangular mediante una regla para sus entradas; formar su producto con la traspuesta y calcular el determinante del resultado. | UNI, admisión ordinaria 2020-1, segunda prueba, pregunta 14. | Alta: combina índices, dimensiones, producto y determinante. | Un ítem identificado en ese examen; no permite establecer frecuencia histórica. | F1, página impresa 26, página 27 del PDF. |
| Evaluar proposiciones sobre productos que involucran una matriz y su traspuesta y sobre relaciones entre columnas. | UNI, admisión ordinaria 2020-1, segunda prueba, pregunta 18. | Alta: requiere argumentación. | Un ítem identificado; muestra insuficiente para un ranking. | F1, misma página. Parte de su lenguaje rebasa el núcleo mínimo propuesto. |
| Reconocer clases de matrices, efectuar operaciones y determinar una inversa por su definición. | CEPREUNI, ciclo básico. | Básica a alta según las condiciones combinadas. | Presencia curricular; no equivale a frecuencia de examen. | F2, Álgebra, página 5 del PDF. |
| Calcular determinantes de orden dos y tres y aplicar sus propiedades. | CEPREUNI, ciclo básico. | Básica a media; alta con parámetros. | Presencia curricular confirmada. | F2, página 5 del PDF. |
| Resolver sistemas mediante eliminación, operaciones de fila o determinantes. | CEPREUNI, ciclo básico. | Media a alta cuando debe elegirse el método. | Presencia curricular; sin recuento de ítems. | F2, página 5 del PDF. |
| Usar determinantes de orden dos y tres para estudiar sistemas y distinguir casos con una, varias o ninguna solución. | Centro Preuniversitario UNMSM, ciclo 2017-II, semana 13. | Media; alta en casos degenerados. | Tema desarrollado en un boletín histórico; no demuestra frecuencia de admisión. | F3, Álgebra, páginas impresas 26–34; copia externa. |
| Matrices y determinantes en una serie reciente de exámenes oficiales de San Marcos. | UNMSM. | No asignada a un ítem no verificado. | No determinada: no se obtuvo un corpus oficial reciente verificable para esta unidad. | Limitación de búsqueda; F3 solo respalda preparación histórica. |
| Correspondencia detallada con admisión de UNA Puno, UNSA y UNSAAC. | Universidades indicadas. | No determinada. | No determinada en esta revisión. | No se atribuyen preguntas ni porcentajes sin documento primario revisado. |

**Decisión curricular.** La ruta común llega hasta sistemas; el tramo alto incluye índices, traspuestas y proposiciones, sin valores propios. Para San Marcos se refuerzan sistemas, sin atribuirles mayor frecuencia.

Los ejercicios darán fórmulas y propiedades. Exigirán elegir un método y comprobar sus condiciones, incluyendo reconocer cuándo no puede aplicarse.

## 3. Errores típicos

DOCUMENTADO significa que se leyó el pasaje del estudio original, aunque una copia íntegra esté alojada en otro sitio. Los estudios localizados corresponden a educación superior; sus resultados no describen automáticamente a postulantes peruanos. HIPÓTESIS identifica un mecanismo que el piloto deberá contrastar. Cuando la causa no fue establecida por el estudio, se declara como interpretación de diseño. No se inventan porcentajes ni se presenta una cita bibliográfica indirecta como observación propia.

| Código | Qué hace el alumno | Por qué | Etiqueta | Fuente |
|---|---|---|---|---|
| M01 | Declara iguales matrices que suman lo mismo. | Hipótesis: conserva el total e ignora su distribución. | HIPÓTESIS | Diseño de esta propuesta; sin estudio específico localizado. |
| M02 | Considera intercambiables las posiciones. | Hipótesis: entiende una matriz como colección de números sin dirección. | HIPÓTESIS | Diseño de esta propuesta. |
| M03 | Rechaza como matriz un arreglo no cuadrado. | Hipótesis: generaliza la forma de los ejemplos de determinantes. | HIPÓTESIS | Diseño de esta propuesta. |
| M04 | Multiplica solo una fila al escalar toda una matriz. | Hipótesis: confunde una operación de fila con una operación global. | HIPÓTESIS | Diseño de esta propuesta. |
| M05 | Usa la trasposición para representar un aumento. | Hipótesis: no distingue cambio de presentación y cambio de cantidades. | HIPÓTESIS | Diseño de esta propuesta. |
| M06 | Representa «tres veces» sumando tres a cada entrada. | Hipótesis: sustituye una relación multiplicativa por una aditiva. | HIPÓTESIS | Diseño de esta propuesta; requiere contraste local. |
| M07 | Invierte el orden de un producto suponiendo que nada cambia. | Hipótesis: extrapola la conmutatividad de los números. | HIPÓTESIS | F6 señala el riesgo matemático, pero no documenta su prevalencia estudiantil. |
| M08 | Exige igual tamaño para cualquier producto. | Hipótesis: traslada al producto la condición de la suma. | HIPÓTESIS | Diseño de esta propuesta. |
| M09 | Multiplica solo entradas de la misma posición. | Hipótesis: extiende al producto la operación casilla por casilla. | HIPÓTESIS | Diseño de esta propuesta. |
| M10 | Elige un producto que produce una tabla de cruces cuando necesitaba un total. | Se documentan elección inadecuada del orden y falta de justificación contextual. | DOCUMENTADO | Cárcamo Bahamonde y Fuentealba Aguilera, 2025, publicación electrónica 2026, F4, protocolos del grupo G7. |
| M11 | Interpreta determinante como suma de todas las entradas. | Hipótesis: confunde un número asociado a una matriz con un total. | HIPÓTESIS | Diseño de esta propuesta. |
| M12 | Cree que un determinante solo es cero si todas las entradas son cero. | Hipótesis: identifica pérdida de información con ausencia de datos. | HIPÓTESIS | Diseño de esta propuesta. |
| M13 | Usa indistintamente notación de matriz y determinante. | El estudio registra confusión de símbolos y una división escrita entre matrices en lugar de determinantes. | DOCUMENTADO | Arnawa, Yerizon y Nita, 2019, F5, páginas 4–5. |
| M14 | Duplica el determinante al duplicar todas las entradas de orden dos. | Hipótesis: aplica a toda la matriz una propiedad de una sola fila. | HIPÓTESIS | Diseño de esta propuesta; contraste matemático en F7. |
| M15 | Supone que cualquier operación de fila conserva el determinante. | Hipótesis: confunde conservar soluciones con conservar un número. | HIPÓTESIS | Diseño de esta propuesta. |
| M16 | Cambia el signo al multiplicar filas por un factor positivo. | Hipótesis: recuerda un efecto de filas sin distinguir la operación. | HIPÓTESIS | Diseño de esta propuesta. |
| M17 | Aplica Cramer aun con determinante principal cero. | Se documenta elección por facilidad aparente sin atender a la condición del método. | DOCUMENTADO | Arnawa, Yerizon y Nita, 2019, F5, discusión y conclusión. |
| M18 | Interpreta determinante cero como prueba de que no hay solución. | Hipótesis: sustituye falta de inversa por imposibilidad de cualquier solución. | HIPÓTESIS | Diseño de esta propuesta; no se atribuye como hallazgo independiente a F5. |
| M19 | Escribe infinito como valor de una incógnita tras dividir entre cero. | El estudio registra una respuesta así al aplicar Cramer fuera de sus condiciones. | DOCUMENTADO | Arnawa, Yerizon y Nita, 2019, F5, entrevista de la página 4. |
| M20 | Da un número sin explicar qué cantidad contextual representa. | Se documenta desconexión entre cálculo e interpretación. | DOCUMENTADO | Cárcamo Bahamonde y Fuentealba Aguilera, F4, grupo G9 y discusión. |
| M21 | Entrega una solución sin sustituirla en las ecuaciones. | El estudio identifica omisión de verificación; no establece una causa universal. | DOCUMENTADO | Arnawa, Yerizon y Nita, 2019, F5, análisis y conclusión. |

Las opciones y misiones son elaboración propia, no instrumentos validados por F4 y F5. Una elección aislada es un indicio: debe contrastarse con otra tarea y una explicación.

## 4. Lo que la unidad da por sabido

El alumno necesita operar con enteros y fracciones, distribuir un producto y reconocer que no se divide entre cero. Debe resolver una ecuación lineal sencilla y comprender que una solución hace verdadera una igualdad. Para el cierre se recupera la eliminación elemental de una incógnita; el método matricial se construye aquí, no se supone aprendido.

Necesita también leer tablas de doble entrada, distinguir cantidad y unidad y reconocer un par ordenado. La interpretación geométrica usa área de rectángulo y paralelogramo. No exige producto vectorial, trigonometría, rango, independencia lineal formal ni valores propios. Los ejercicios obligatorios no podrán depender de esas nociones.

La comprobación inicial pide localizar una casilla, interpretar una variación negativa, verificar por sustitución y distinguir área de longitud. Cada fallo conduce al repaso correspondiente.

Los objetos contables usarán enteros no negativos. Los negativos aparecerán como variaciones o coeficientes, nunca como existencias físicas negativas. Los valores monetarios serán supuestos didácticos, salvo las denominaciones oficiales de la sección 8.

## 5. Las ideas, en orden

Las seis ideas conservan **Lee → Juega → Predice → Mira → La regla → Así se resuelve → Ahora tú**. Las claves permanecen ocultas hasta Mira. Los modelos explican la ruta y sus expresiones exactas; producción recalculará los casos numéricos.

### Idea 1. Cada número tiene una dirección

**Pregunta que responde:** ¿qué información se pierde si conservamos solo los números de una tabla?

**Aprendizaje.** Leer una matriz como arreglo ordenado y decidir su tamaño y sus posiciones sin confundirlos con el total de objetos.

**Objeto de la primera pantalla.** Un puesto de desayunos tiene dos bandejas, mañana y tarde, con espacios para panes, vasos y frutas. Una hoja registra las cantidades. Primero se ven los objetos; luego aparece la tabla. Los productos ayudan a reconocer categorías, sin afirmar que representen una dieta ni una costumbre de todos los peruanos.

**Lee: tres tarjetas.**

1. «El registro numérico, llamado matriz, separa productos y turnos. Las etiquetas acompañan a las cantidades».
2. «Una fila recorre el registro de izquierda a derecha. Una columna lo recorre de arriba hacia abajo».
3. «Cada casilla combina una etiqueta de fila y una de columna. Los espacios sin existencias también se registran».

**Juega.** El alumno arrastra seis cantidades a sus casillas en una hoja con orden fijo de categorías. La misión es registrar correctamente todo el inventario. Se comprueban valor y pareja de etiquetas. Puede haber ceros, para distinguir ausencia de existencias y dato omitido. El total general no basta para aprobar. No se permite intercambiar columnas completas: esa acción se reserva para la predicción.

**Predice.** Se intercambian dos cantidades diferentes entre pan y fruta, manteniendo el tamaño de la tabla y el total. «¿La matriz numérica resultante es igual a la anterior, con el orden de etiquetas fijado?»

| Opción | Contenido | Clave de autoría |
|---|---|---|
| A | Sí, porque el total de objetos sigue igual. | Incorrecta: M01. |
| B | No, porque cambiaron valores en posiciones concretas. | Correcta. |
| C | Sí, porque una matriz no distingue dónde aparece cada número. | Incorrecta: M02. |
| D | No puede decidirse porque una tabla rectangular no es una matriz. | Incorrecta: M03. |

**Mira.** Se superponen las hojas conservando los encabezados. Dos casillas difieren aunque el contador total coincida. Después se permite trasladar etiquetas junto con columnas para distinguir reorganizar la misma información de conservar la misma matriz numérica en un orden fijado. No se afirma que cambiar el lugar físico de una hoja cambie automáticamente su información.

**La regla.** Una matriz es un arreglo rectangular de números en filas y columnas. Se escribe $A=(a_{ij})$: A nombra la matriz; $a_{ij}$, leído «a sub i jota», nombra su entrada de la fila i y columna j. El primer índice es siempre la fila. Si hay m filas y n columnas, su orden es $m\times n$, leído «m por n». Los índices empiezan en uno y deben corresponder a posiciones existentes. Dos matrices son iguales cuando tienen el mismo orden y coinciden todas sus entradas correspondientes.

Una matriz fila tiene una sola fila y una matriz columna una sola columna. Es cuadrada cuando coinciden las cantidades de filas y columnas. Se usará «rectangular no cuadrada» cuando sean diferentes, pues en sentido amplio toda matriz tiene forma rectangular. Las etiquetas no son entradas numéricas. Cero es un valor válido, distinto de «dato desconocido». Una colección de números sin orden no especifica una matriz.

**Palabras nuevas.**

- **Matriz:** un registro de números con lugares acordados. Ejemplos: existencias por turno y producto; boletos por ruta y día; monedas por caja y denominación.
- **Entrada:** el número de una casilla particular. Ejemplos: panes de la mañana; boletos de una ruta el lunes; monedas de dos soles de una caja.
- **Orden:** cuántas filas y cuántas columnas tiene el registro, en esa secuencia. Ejemplos: dos turnos y tres productos; tres rutas y dos días; una caja y tres denominaciones.

**Así se resuelve.** Modelo: reconstruir una matriz desde un inventario y localizar una entrada indicada. Primero se fija el orden de categorías. Después se cuentan filas y columnas excluyendo encabezados. Para una entrada solicitada, se recorre su fila y luego su columna. Se escribe $a_{ij}=\text{cantidad de la casilla}$ y se vuelve a expresar el resultado con producto y turno. Para comparar registros se revisa primero el orden y luego las entradas. La primera diferencia basta para descartar igualdad; la igualdad exige comprobarlas todas.

**Ahora tú.** Localizar una entrada; reconstruir etiquetas; comparar igualdad con conservación del total; detectar un índice inexistente; completar una matriz definida por una regla que depende de si i es menor, igual o mayor que j. En el último tipo la regla viene dada y cada posición se evalúa por separado. Todavía no se piden determinantes ni productos. La evidencia de dominio es poder decir qué representa una casilla, además de encontrarla.

### Idea 2. Actualizar y reorganizar un registro

**Pregunta que responde:** ¿cómo se combinan cantidades correspondientes y cómo se cambia su presentación?

**Aprendizaje.** Distinguir sumar registros compatibles, repetir cantidades por un factor y trasponer un arreglo.

**Objeto de la primera pantalla.** Dos cajas de mercadería llegan al puesto con hojas de contenido. Ambas tienen las mismas categorías. Una pizarra permitirá organizar productos por filas en vez de por columnas. La llegada de mercadería modifica cantidades; reorganizar la pizarra modifica su presentación.

**Lee: cuatro tarjetas.**

1. «Una hoja corresponde a la entrega inicial y otra a la reposición. Ambas usan las mismas categorías».
2. «El registro distingue lo que llegó de lo que salió. Una variación puede aumentar o disminuir una existencia».
3. «Un factor indica cuántas veces se toma una cantidad. En matrices, ese número también se llama escalar».
4. «La pizarra puede poner en columnas las categorías que estaban en filas. Esa reorganización se llama trasposición».

**Juega.** Se agrupan fichas de la entrega inicial y de una reposición diferente. La misión es completar las seis casillas del inventario total. La comprobación se hace por categorías. Una hoja con columnas permutadas debe alinearse antes de combinar datos. El juego no presenta tres entregas idénticas ni permite duplicar automáticamente el inventario.

**Predice.** «Se preparan tres cajas idénticas a la caja registrada. ¿Cómo representar el contenido de las tres juntas en una matriz del mismo tamaño?»

| Opción | Contenido | Clave de autoría |
|---|---|---|
| A | Triplicar solamente la primera fila. | Incorrecta: M04. |
| B | Cambiar las filas por columnas. | Incorrecta: M05. |
| C | Sumar tres a cada casilla. | Incorrecta: M06. |
| D | Triplicar el número de cada casilla. | Correcta. |

**Mira.** Se abren las cajas y se agrupan sus contenidos por tipo. Cada entrada corresponde a tres grupos iguales. Luego se reorganiza la hoja sin cambiar cantidades para contrastar trasponer con multiplicar. No se define traspuesta como «girar noventa grados»: ese giro puede invertir un orden que la trasposición debe conservar.

**La regla.** Para sumar o restar matrices se exige igual orden; en una aplicación también deben coincidir categorías y unidades. La entrada de $A+B$ es $a_{ij}+b_{ij}$, y la de $A-B$, $a_{ij}-b_{ij}$. El escalar k multiplica todas las entradas: la de kA es $ka_{ij}$. El opuesto se obtiene tomando k igual a menos uno. La suma es conmutativa y asociativa y el producto escalar distribuye respecto de ella. La matriz nula $O_{m\times n}$ tiene ceros en todas sus entradas y no altera una suma del mismo orden.

La traspuesta $A^{\mathsf T}$, leída «A traspuesta», tiene orden $n\times m$. La entrada $a_{ij}$ pasa a la posición de fila j y columna i. Se intercambian los papeles de filas y columnas sin invertir su secuencia. Trasponer dos veces devuelve A. La traspuesta de una suma es la suma de las traspuestas y la traspuesta de kA es k por la traspuesta de A. Se justifican siguiendo una misma entrada.

En matrices cuadradas, la diagonal principal reúne entradas de índices iguales. Una matriz diagonal tiene ceros fuera de ella, aunque puede tener también ceros en la propia diagonal. Una matriz escalar es diagonal con todas sus entradas diagonales iguales. Una triangular superior tiene ceros debajo de la diagonal; una inferior los tiene encima. Una matriz simétrica cumple $A^{\mathsf T}=A$; una antisimétrica cumple $A^{\mathsf T}=-A$. Sobre los reales, la diagonal de una antisimétrica es cero porque cada entrada debe ser igual a su opuesta. Una diagonal nula por sí sola no garantiza antisimetría.

**Palabras nuevas.**

- **Escalar:** un número que indica una repetición o un cambio de tamaño. Ejemplos: tres cajas idénticas; la mitad de cantidades divisibles; el opuesto de un registro de variaciones.
- **Traspuesta:** el registro que intercambia el papel de filas y columnas. Ejemplos: turnos por productos a productos por turnos; rutas por días a días por rutas; cajas por denominaciones a denominaciones por cajas.
- **Diagonal principal:** casillas con igual número de fila y columna. Ejemplos: primera con primera; segunda con segunda; tercera con tercera.
- **Simétrica:** tabla cuadrada con valores iguales en posiciones enfrentadas a la diagonal. Ejemplos: distancias ideales entre puntos; una matriz diagonal; una tabla de relaciones recíprocas con valores iguales.

**Así se resuelve.** Modelo: representar tres entregas del inventario A menos una devolución B, mostrando el resultado traspuesto. Se interpreta $(3A-B)^{\mathsf T}$ con palabras y se comprueban dimensiones y unidades. Se escribe cada entrada como $3a_{ij}-b_{ij}$. Después se traslada a la posición j, i. La solución es la matriz cuyas entradas quedan definidas así. Se comprueba una casilla mediante los objetos y se verifica el orden final. La devolución no se resta tres veces: los paréntesis deben coincidir con la historia.

**Ahora tú.** Sumar matrices; detectar una suma imposible; representar entradas y salidas con signos; construir combinaciones escalares; reconstruir una matriz desde su traspuesta; completar entradas usando simetría o antisimetría; evaluar afirmaciones sobre matrices diagonales y triangulares. La dificultad aumenta por las condiciones que deben combinarse, no por memorizar nombres. No se utiliza todavía multiplicación entre matrices.

### Idea 3. Unir registros para obtener otro

**Pregunta que responde:** ¿por qué el producto combina filas con columnas y por qué importa el orden?

**Aprendizaje.** Construir el producto sumando contribuciones compatibles y anticipar sus dimensiones.

**Objeto de la primera pantalla.** Dos cajas contienen monedas de tres denominaciones peruanas. Una hoja registra cantidades por caja y otra el valor por moneda. Se busca el dinero de cada caja. Las denominaciones proceden de F10; las cantidades son ficticias.

**Lee: tres tarjetas.**

1. «La hoja de cada caja separa cuántas monedas hay de cada clase».
2. «Una ficha distinta registra cuánto vale una moneda de cada clase. Cantidad de piezas y valor por pieza son datos diferentes».
3. «El total reúne aportes de todas las denominaciones. Cada aporte conserva el nombre de la moneda que lo produjo».

**Juega.** Se enlaza cada columna de cantidades con su denominación y se llevan las monedas de una caja a una bandeja de conteo. La misión es construir el total usando todas las denominaciones sin cruzarlas. Se comprueban correspondencias y aportes. Solo se utiliza una columna de valores. El caso con varias columnas de resultados y la inversión del orden no se muestra.

**Predice.** Se presentan dos registros numéricos: A tiene dos filas y tres columnas; B, tres filas y dos columnas. Se anuncia verbalmente que cada casilla nueva combina una fila y una columna de igual longitud, sin dar fórmula. «¿Qué puede anticiparse si se ensayan ambos órdenes?»

| Opción | Contenido | Clave de autoría |
|---|---|---|
| A | Ambos productos pueden formarse, pero uno tiene orden dos por dos y el otro tres por tres. | Correcta. |
| B | Ambos dan la misma matriz porque usan los mismos factores. | Incorrecta: M07. |
| C | Ninguno existe porque las matrices no tienen igual tamaño. | Incorrecta: M08. |
| D | Ambos conservan orden dos por tres porque se multiplican casillas correspondientes. | Incorrecta: M09. |

**Mira.** Cada selección de una fila y una columna produce una casilla. Al invertir el orden cambia el número de esas parejas. Se cuentan casillas antes de calcular. Después se explica que un producto posible numéricamente puede no responder a la pregunta contextual: categorías y unidades también deben justificarlo.

**La regla.** Si A tiene orden $m\times n$ y B orden $n\times p$, el producto $P=AB$ existe y tiene orden $m\times p$. P es el nombre del producto. Para obtener su entrada de fila i y columna j se multiplican las entradas de la fila i de A por las correspondientes de la columna j de B y se suman los resultados. Con tres categorías: $p_{ij}=a_{i1}b_{1j}+a_{i2}b_{2j}+a_{i3}b_{3j}$. El mismo patrón se repite para las n categorías compartidas. Las columnas de A deben ser tantas como las filas de B.

El producto es asociativo y distribuye sobre sumas compatibles, pero no es conmutativo en general. No se transforma AB en BA sin una razón específica. Uno puede existir y el otro no; pueden tener distinto tamaño o tener igual tamaño y contenidos diferentes. Tampoco se multiplica casilla por casilla: esa sería otra operación. La distributividad se explica distribuyendo en cada suma de aportes.

La identidad $I_n$ es cuadrada, con unos diagonales y ceros fuera. Deja intacta la otra matriz en productos compatibles: $I_mA=A$ y $AI_n=A$. Para A cuadrada, $A^h$ es el producto de h copias de A si h es entero positivo, y $A^0=I_n$. No se elevan sus entradas por separado. Dos matrices no nulas pueden producir la matriz nula; por tanto, no se cancela un factor únicamente porque sea no nulo. La traspuesta de un producto satisface $(AB)^{\mathsf T}=B^{\mathsf T}A^{\mathsf T}$: al leer cada emparejamiento desde el otro sentido se invierte el orden.

**Palabras nuevas.**

- **Producto matricial:** un registro que suma aportes emparejados. Ejemplos: monedas por valores; pedidos por ingredientes; materiales por costos unitarios.
- **Compatible:** que las categorías necesarias encajen. Ejemplos: tres monedas con tres valores; cuatro ingredientes con cuatro consumos; dos clases de pasaje con dos tarifas.
- **Identidad:** una operación organizada para devolver lo recibido sin mezclarlo. Ejemplos: mantener cada tipo de moneda; conservar cada canal de una señal; dejar cada coordenada donde estaba.
- **Conmutar:** poder cambiar el orden sin alterar el resultado. Ejemplos: sumar cantidades; multiplicar dos matrices diagonales del mismo orden; multiplicar una matriz cuadrada por la identidad correspondiente.

**Así se resuelve.** Modelo: dinero por caja. A organiza cajas en filas y denominaciones en columnas. B organiza denominaciones en filas y valores por moneda en una columna. Antes de operar se anuncia que AB tendrá una fila por caja y una columna de soles. Para cada caja se escribe la suma de cantidad por valor de todas sus monedas. Las unidades piezas y soles por pieza producen soles. Se verifica una caja contando objetos. Esa expresión exacta resuelve el planteamiento; la aritmética final se recalcula durante producción.

**Ahora tú.** Determinar si un producto existe; anticipar su tamaño; calcular una entrada; completar un producto pequeño; comparar AB y BA; interpretar $AA^{\mathsf T}$; simplificar con identidad y distributividad; analizar potencias pequeñas. El nivel de admisión combina una matriz definida por índices con operaciones ya aprendidas. Se pide seleccionar qué casillas hacen falta, evitando calcular toda una matriz cuando solo se necesita una entrada.

### Idea 4. El determinante describe un efecto

**Pregunta que responde:** ¿qué número permite reconocer si una transformación plana conserva superficie o la aplasta?

**Aprendizaje.** Distinguir matriz y determinante, calcular determinantes pequeños y relacionar el cero con la pérdida de superficie en un modelo plano.

**Objeto de la primera pantalla.** Una imprenta de barrio prepara un sello con una letra asimétrica. Se ven el sello, el papel y dos pasos de referencia. En el modelo didáctico, la máquina coloca cada marca combinando dos direcciones indicadas por las columnas de una matriz de orden dos. No se afirma que una impresora comercial opere mediante los controles ficticios de la escena.

**Lee: cuatro tarjetas.**

1. «El sello ocupa una superficie del papel. Su contorno puede alargarse o inclinarse al transformarlo».
2. «Dos pasos de referencia indican dónde va una marca al avanzar una casilla en cada dirección del dibujo original».
3. «La matriz registra esos pasos. Para colocar otra marca se combinan sus avances con el producto que ya conoces».
4. «La superficie ocupada y el sentido de una letra son características que se pueden observar por separado».

**Juega.** El alumno modifica solo el ancho de un sello rectangular, manteniendo su altura. La misión es cubrir exactamente una región marcada. Se comprueban coincidencia del contorno y superficie, con cuadrícula que aparece después del objeto. No se permite inclinar el sello ni hacer coincidir sus dos direcciones. El juego ofrece una ampliación real del objeto y no comienza con vectores desconectados de una situación.

**Predice.** «Ahora los dos pasos de referencia avanzan por la misma línea. Ambos están descritos por números no nulos. ¿Qué ocurrirá con la superficie del dibujo transformado?»

| Opción | Contenido | Clave de autoría |
|---|---|---|
| A | Será positiva porque basta sumar los números de los pasos. | Incorrecta: M11. |
| B | Será necesariamente positiva porque ninguna columna tiene todos sus números cero. | Incorrecta: M12. |
| C | El dibujo quedará sobre una línea y no ocupará superficie plana. | Correcta. |
| D | La superficie será una matriz con las mismas casillas de los pasos. | Incorrecta: M13. |

**Mira.** Se transforman las marcas y el contorno termina alineado. Una línea puede ser larga y no cubrir área. Después se recuperan direcciones distintas y se intercambian: la letra puede conservar área e invertir orientación. Esta segunda exploración ocurre después de responder, no en el juego inicial. Se mantiene una copia del objeto original para que el alumno no dependa de la memoria visual.

**La regla.** El determinante de una matriz cuadrada A es un número, escrito $\det(A)$, leído «determinante de A». En exámenes puede aparecer entre barras verticales. No es la matriz, su suma de entradas ni su valor absoluto. Estas reglas no asignan determinante a una matriz rectangular no cuadrada.

En orden dos, $\det(A)=a_{11}a_{22}-a_{12}a_{21}$. Si las columnas representan una transformación lineal del plano, el valor absoluto del determinante es el factor de cambio de área. El signo positivo conserva orientación y el negativo la invierte. El cero corresponde al aplastamiento del cuadrado de referencia sobre una línea o un punto. El área física nunca es negativa. Un inventario no adquiere automáticamente una superficie real porque se calcule su determinante.

En orden tres puede expandirse por la primera fila: $\det(A)=a_{11}C_{11}+a_{12}C_{12}+a_{13}C_{13}$. El menor $M_{ij}$ es el determinante del arreglo que queda al retirar fila i y columna j. El cofactor $C_{ij}=(-1)^{i+j}M_{ij}$ incorpora el signo de la posición. Por eso en la primera fila los signos alternan positivo, negativo, positivo. Puede expandirse por cualquier fila o columna completa. El determinante de orden uno es su única entrada; esto permite comprender la repetición del procedimiento en tamaños mayores.

Sarrus, válido para orden tres, se obtiene desarrollando esos menores. Se suman los productos $a_{11}a_{22}a_{33}$, $a_{12}a_{23}a_{31}$ y $a_{13}a_{21}a_{32}$; se restan $a_{13}a_{22}a_{31}$, $a_{11}a_{23}a_{32}$ y $a_{12}a_{21}a_{33}$. Organiza seis productos, no una ley de diagonales aplicable a cualquier tamaño. No se extiende a orden cuatro. En presencia de ceros conviene seleccionar una fila o columna que reduzca términos de la expansión.

La resta de orden dos se explica con el área del paralelogramo y se verifica algebraicamente. Para orden tres se mantiene el procedimiento por cofactores. Contraste matemático: F7 y F9; escena propia.

**Palabras nuevas.**

- **Determinante:** un número que describe un efecto particular de una matriz cuadrada. Ejemplos: factor de área de una transformación; cero cuando el sello se aplasta; cambio de signo cuando se invierte orientación.
- **Menor:** el determinante que queda al apartar una fila y una columna. Ejemplos: retirar primera fila y primera columna; retirar segunda fila y tercera columna; retirar tercera fila y segunda columna.
- **Cofactor:** un menor con el signo de su posición. Ejemplos: esquina superior izquierda positiva; posición superior central negativa; posición central positiva en orden tres.
- **Orientación:** el sentido con que queda dispuesto un dibujo. Ejemplos: una letra que conserva su sentido; una letra reflejada; un recorrido alrededor del sello que cambia de sentido.

**Así se resuelve.** Modelo: determinante de una matriz de orden tres con una entrada cero. Se comprueba que sea cuadrada, se elige una fila que reduzca términos y se construye cada menor retirando la fila y columna correspondientes. Se aplica el signo del cofactor y se suma cada entrada por su cofactor. Los paréntesis de números negativos permanecen visibles. El resultado exacto queda expresado por esa suma de productos y diferencias. La comprobación puede realizarse por otra expansión o Sarrus; no se exige repetir siempre dos cuentas completas.

**Ahora tú.** Distinguir una matriz de su determinante; calcular orden dos; identificar un arreglo no cuadrado; calcular orden tres con ceros; detectar un signo incorrecto; decidir cuándo Sarrus no corresponde; hallar un parámetro que anula un determinante. En el nivel alto se pide elegir una fila conveniente y justificar la elección. Las figuras distinguen el número con signo de la superficie física y no dependen de mediciones aproximadas sobre la pantalla.

### Idea 5. Cambiar filas con control

**Pregunta que responde:** ¿cómo simplificar un determinante sin perder de vista qué cambia en su valor?

**Aprendizaje.** Elegir operaciones útiles y registrar el efecto de cada una sobre el determinante.

**Objeto de la primera pantalla.** Se retoma el sello de imprenta, acompañado de dos tiras de calibración. Cada fila de su hoja puede moverse como una tira completa. Una copia del registro original permanece visible. Las entradas negativas describen coeficientes, no cantidades negativas de objetos del negocio.

**Lee: tres tarjetas.**

1. «La hoja original se conserva. Cada cambio produce otra hoja para comparar».
2. «Mover una tira completa cambia una fila. Modificar una sola casilla es una acción diferente».
3. «Dos dibujos pueden tener distintas formas y ocupar la misma superficie».

**Juega.** Se intercambian dos filas completas y después se vuelve a intercambiarlas para recuperar el registro. La misión exige coincidencia de todas las entradas. No se habilita multiplicar toda la matriz por un factor. El valor del determinante no se revela durante esta misión; se muestra después de la predicción. El éxito se comprueba con la igualdad ya conocida, sin necesitar una propiedad futura.

**Predice.** «Una matriz de orden dos tiene determinante positivo. Si se duplican todos sus números, ¿cómo cambiará ese determinante?»

| Opción | Contenido | Clave de autoría |
|---|---|---|
| A | Se hará dos veces el original. | Incorrecta: M14. |
| B | Se hará cuatro veces el original. | Correcta. |
| C | Se mantendrá igual porque todos los cambios de fila lo conservan. | Incorrecta: M15. |
| D | Se hará cuatro veces el original, con signo negativo. | Incorrecta: M16. |

**Mira.** Se amplían ambos pasos del sello y se compara su superficie mediante copias de la región original. Luego se desarrolla el determinante de orden dos: cada producto contiene dos factores duplicados. Se contrasta con duplicar una sola fila. Por último, el intercambio del juego permite observar un efecto distinto sobre el signo.

**La regla.** Intercambiar dos filas cambia el signo del determinante. Multiplicar una sola fila por k multiplica el determinante por k. Sumar a una fila un múltiplo de otra fila distinta conserva el determinante. Las mismas reglas valen para columnas. Se aplican a filas o columnas completas: no describen el efecto de cambiar arbitrariamente una casilla.

Una fila nula o dos filas proporcionales bastan para que el determinante sea cero. Son condiciones suficientes, no una lista completa: puede haber relaciones que involucren más filas sin que dos sean proporcionales. En una matriz triangular, el determinante es el producto diagonal. Se puede triangularizar llevando aparte el registro de intercambios y factores.

Si todas las entradas de una matriz de orden n se multiplican por k, sus n filas han sido multiplicadas: $\det(kA)=k^n\det(A)$. Esta relación aplica repetidamente la propiedad de una fila. También se cumple $\det(A^{\mathsf T})=\det(A)$, $\det(AB)=\det(A)\det(B)$ para matrices cuadradas del mismo orden y $\det(I_n)=1$.

En general, el determinante de una suma no es la suma de determinantes. La linealidad se refiere a una fila cuando las demás permanecen fijas. Si esa fila se descompone en una suma, el determinante se descompone en dos determinantes que conservan las otras filas. Esta precisión impide convertir una propiedad localizada en una supuesta aditividad de toda la matriz.

Las propiedades se justifican primero en orden dos: intercambiar filas invierte la resta; escalar una fila permite extraer un factor; añadir un múltiplo de otra genera términos que se cancelan. La expansión por cofactores permite extender el razonamiento. No se pide memorizar una lista sin comprobar al menos un caso y un contraejemplo. Igual determinante no implica matrices iguales ni transformaciones de la misma forma.

**Palabras nuevas.**

- **Operación de fila:** un cambio que sigue una regla para toda una fila. Ejemplos: intercambiar dos filas; multiplicar una fila por un número; añadir a una fila el doble de otra.
- **Triangular:** matriz cuadrada con una región de ceros a un lado de la diagonal. Ejemplos: ceros debajo; ceros encima; matriz diagonal, que cumple ambas condiciones.
- **Proporcionales:** filas en las que una es un mismo múltiplo de la otra en todas las posiciones. Ejemplos: fila duplicada; fila reducida a la mitad; fila con signos invertidos.
- **Invariante:** algo que no cambia durante una acción especificada. Ejemplos: determinante al añadir un múltiplo de otra fila; determinante al trasponer; matriz original después de dos trasposiciones.

**Así se resuelve.** Modelo: comparar el determinante original con el de una matriz obtenida mediante operaciones descritas. Se escribe la secuencia y se etiqueta cada paso: «invierte signo», «introduce factor» o «conserva valor». Se mantienen los factores fuera del determinante pendiente. Cuando se obtiene una triangular, se escribe el producto diagonal. Finalmente se despeja el determinante solicitado, deshaciendo los factores introducidos. El modelo trabajado muestra esa expresión exacta y una comprobación con una matriz pequeña de datos nuevos.

**Ahora tú.** Identificar filas proporcionales; anticipar el efecto de un intercambio; comparar escalar una fila y toda una matriz; escoger operaciones para obtener ceros; triangularizar registrando cambios; evaluar proposiciones sobre productos y traspuestas; construir un contraejemplo a la aditividad. El reto de admisión usa información parcial, como un determinante conocido, para deducir otro. Todas las propiedades necesarias están disponibles; la dificultad es determinar cuál corresponde.

### Idea 6. Recuperar información y comprobar si alcanza

**Pregunta que responde:** ¿cuándo los totales permiten reconstruir de manera única los datos originales?

**Aprendizaje.** Decidir si una matriz es invertible, resolver sistemas según las condiciones de cada método y verificar la interpretación del resultado.

**Objeto de la primera pantalla.** Dos comprobantes ficticios de un puesto muestran cantidades de dos productos y totales pagados. Los precios unitarios están tapados. Primero se observan los comprobantes completos; después se organiza su matriz de coeficientes. Los precios son supuestos del ejemplo, no datos actuales de Juliaca.

**Lee: cuatro tarjetas.**

1. «Los comprobantes muestran productos y totales. Faltan los precios de una unidad de cada producto».
2. «Una solución es una elección de precios que hace verdaderos todos los comprobantes a la vez».
3. «Un sistema reúne varias igualdades que deben cumplirse simultáneamente».
4. «Comprobar una propuesta significa colocar sus valores en los comprobantes originales».

**Juega.** Se mueven dos controles de precios discretos en un caso construido con solución única y positiva. La misión es hacer coincidir simultáneamente ambos totales. Una coincidencia parcial no se acepta. Se pueden mostrar las contribuciones de cada producto, pero no resolver automáticamente. El caso de comprobantes proporcionales permanece bloqueado.

**Predice.** «El primer comprobante registra un pan y una bebida por un total dado. El segundo registra exactamente dos panes y dos bebidas por el doble del total. Los precios son positivos y no cambian entre compras. ¿Bastan esos comprobantes para recuperar un único par de precios?»

| Opción | Contenido | Clave de autoría |
|---|---|---|
| A | Sí, dos comprobantes siempre permiten obtener un único par de precios. | Incorrecta: M17, generalización que sostiene la aplicación indiscriminada del método. |
| B | No existe ningún par que cumpla ambos comprobantes. | Incorrecta: M18. |
| C | Los dos precios deben valer infinito. | Incorrecta: M19. |
| D | No: varios pares positivos pueden cumplirlos porque el segundo repite la misma relación. | Correcta. |

No se solicita calcular precios ni se afirma que haya infinitos precios monetarios discretos. Producción elegirá un total que admita al menos dos pares positivos con la resolución monetaria usada.

**Mira.** Se exhiben dos pares distintos que cumplen ambos comprobantes. Luego se modifica el segundo total para que deje de ser el doble y aparece una contradicción. Se distingue información repetida de información incompatible antes de introducir el término singular. El alumno puede volver a ambos casos y observar qué dato cambió.

**La regla.** La inversa de una matriz cuadrada A es una matriz $A^{-1}$ tal que $AA^{-1}=A^{-1}A=I_n$. Se lee «A inversa»; no significa tomar el recíproco de cada entrada. Existe si y solo si $\det(A)\ne0$, y entonces es única. Una matriz sin inversa es singular. Ser distinta de la matriz nula no garantiza que exista inversa.

La adjunta clásica, $\operatorname{adj}(A)$, es la traspuesta de la matriz de cofactores de la idea 4. Si el determinante no es cero, $A^{-1}=\operatorname{adj}(A)/\det(A)$: cada entrada de la adjunta se divide por ese número. En orden dos, el numerador coloca $a_{22}$ y $a_{11}$ en la diagonal y $-a_{12}$, $-a_{21}$ fuera de ella. Se justifica multiplicando por A y observando que aparece la identidad tras dividir por el determinante.

Un sistema lineal se escribe $AX=Y$, donde X es la columna de incógnitas y Y la de términos independientes. Si A es cuadrada e invertible, $X=A^{-1}Y$ es la solución única. Se multiplica por la izquierda para colocar juntos $A^{-1}A$. En una ecuación matricial $XA=B$, con dimensiones compatibles, se multiplica por la derecha y se obtiene $X=BA^{-1}$. No se introduce una división genérica entre matrices.

Cramer expresa cada incógnita como $x_j=\Delta_j/\Delta$. Delta es el determinante de A; delta sub j es el determinante que sustituye la columna j por Y. Exige un sistema cuadrado y delta distinto de cero. La columna sustituida corresponde a la incógnita buscada. Si delta es cero, estos cocientes no resuelven el sistema: se pasa a eliminación. Dividir entre cero no produce un precio infinito ni una solución real.

Gauss trabaja con la matriz ampliada $[A\mid Y]$, que reúne coeficientes y términos independientes. Se pueden intercambiar ecuaciones, multiplicar una ecuación por un número no nulo y sumar a una ecuación un múltiplo de otra. La operación afecta también al término independiente. Se conservan las soluciones, lo cual no implica conservar siempre el determinante de los coeficientes.

Se obtiene una forma escalonada: cada fila no nula empieza con su primer coeficiente no nulo más a la derecha que la anterior, y las filas nulas quedan al final. Ese primer coeficiente es un pivote. Una fila con todos los coeficientes cero y término independiente no nulo expresa una contradicción: el sistema no tiene solución. Sin contradicción, si cada incógnita tiene pivote, hay una solución única. Si quedan incógnitas libres, hay infinitas soluciones sobre los reales. Condiciones adicionales de una aplicación —enteros, positividad o céntimos— se verifican después y pueden reducir ese conjunto.

Gauss-Jordan continúa hasta dejar pivotes iguales a uno y anular también los coeficientes encima. Para obtener una inversa, se parte de $[A\mid I_n]$ y se aplican las mismas operaciones a todo el arreglo. Si el bloque izquierdo llega a la identidad, el derecho es la inversa. Si no puede alcanzarla, A no es invertible. Se explican adjunta y Gauss-Jordan, pero el ejercicio permite escoger una ruta justificada; no exige ambos métodos en el primer intento.

Se cumplen $(AB)^{-1}=B^{-1}A^{-1}$ cuando existen ambas inversas, $(A^{\mathsf T})^{-1}=(A^{-1})^{\mathsf T}$ y $\det(A^{-1})=1/\det(A)$. Se justifican con productos que devuelven la identidad. Un sistema homogéneo tiene Y nula y siempre admite la solución nula. Si A es cuadrada con determinante no nulo, esa solución es única; con determinante cero existen soluciones no nulas sobre los reales.

**Palabras nuevas.**

- **Inversa:** una operación que recupera de forma única lo que había antes. Ejemplos: deshacer una transformación sin aplastamiento; recuperar entradas desde totales suficientes; obtener identidad al componer una operación con su recuperación.
- **Singular:** matriz cuadrada que no permite recuperación única para toda salida. Ejemplos: dos filas iguales; dos filas proporcionales; transformación plana que aplasta un dibujo.
- **Compatible:** dicho de un sistema, que al menos una elección cumple todas sus igualdades. Ejemplos: dos compras consistentes; comprobantes que repiten la misma compra; tres ecuaciones satisfechas por el mismo conjunto de valores.
- **Pivote:** el primer coeficiente no nulo que organiza una fila escalonada. Ejemplos: inicio de la primera fila; primer coeficiente restante de la segunda; uno que se obtiene al normalizar una fila.

**Así se resuelve.** Modelo: reconstruir dos precios. Se nombran incógnitas con producto y unidad, se escriben las ecuaciones y se forma $AX=Y$ conservando el orden. Se calcula el determinante para decidir el método. Si no es cero, se construyen los determinantes de sustitución y se escriben los cocientes exactos. Si es cero, se elimina y se busca contradicción o libertad. Se sustituyen los valores en todas las ecuaciones originales y se interpretan unidades, signos y restricciones. El resultado no se redondea antes de comprobar; la producción recalculará cada cierre numérico.

**Ahora tú.** Verificar una inversa propuesta; decidir si puede existir; calcularla en orden dos; resolver una ecuación matricial multiplicando por el lado correcto; plantear compras; elegir Cramer o eliminación; clasificar sistemas con datos proporcionales; analizar un parámetro que cambia la invertibilidad; combinar producto, traspuesta y determinante en proposiciones. El cierre exige justificar por qué el método está permitido. Ningún ejercicio obligatorio utiliza rango o valores propios sin haberlos enseñado.

**Criterio de salida.** Explicar el significado de la matriz, justificar la operación y comprobar el resultado. Un error aritmético aislado no prueba desconocimiento conceptual.

## 6. Tabla de letras y símbolos de la unidad

Las mayúsculas, minúsculas y subíndices se conservan en pantalla y narración. Cada nombre mantiene su papel durante un ejemplo. Un cambio de situación empieza con una nueva definición explícita de sus datos.

| Letra o símbolo | Significado | Unidad |
|---|---|---|
| A, B | Primera y segunda matriz dadas. | Según sus entradas; no necesariamente igual entre ambas matrices. |
| P | Matriz producto AB. | Producto de unidades emparejadas, cuando los términos sean sumables. |
| $a_{ij},b_{ij},p_{ij}$ | Entradas de A, B y P en fila i y columna j. | La unidad de la entrada. |
| i, j | Índices de posición de fila y columna. | Enteros positivos sin unidad física. |
| m, n, p | Filas de A, columnas de A y columnas de B en el producto general. B tiene n filas. | Conteos. p minúscula no es P mayúscula. |
| k | Escalar que multiplica una matriz o una fila. | Adimensional en los ejemplos de repetición. |
| h | Exponente entero no negativo de una potencia matricial. | Sin unidad. |
| $A^{\mathsf T}$ | Traspuesta de A. | Conserva unidades de las entradas trasladadas. T no representa temperatura. |
| $O_{m\times n}$ | Matriz nula del orden indicado. | Según contexto. O es letra, no el número cero. |
| $I_n$ | Identidad de orden n. | Adimensional. I no representa intensidad eléctrica. |
| $\det(A)$ | Determinante de A. | Depende del modelo; no tiene unidad universal. |
| $M_{ij}$ | Menor de la entrada indicada. | Según el determinante de orden reducido. |
| $C_{ij}$ | Cofactor de esa entrada. | Igual que su menor. C no nombra otra matriz en esta unidad. |
| $\operatorname{adj}(A)$ | Adjunta clásica, traspuesta de la matriz de cofactores. | Según entradas. No es la adjunta conjugada de otros cursos. |
| $A^{-1}$ | Inversa de A, si existe. | Según la transformación inversa. |
| X | Matriz de incógnitas; es columna en AX=Y. | Según incógnitas, por ejemplo soles por producto. |
| Y | Columna de términos independientes. | Según resultados, por ejemplo soles. |
| $x_j$ | Incógnita en la fila j de la columna X. | Unidad de la incógnita. |
| $\Delta,\Delta_j$ | Determinante principal y de sustitución para Cramer. | Según coeficientes y términos independientes. |
| $[A\mid Y]$ | Matriz ampliada con separación visual. | Puede reunir columnas de distintas unidades; no es un determinante. |
| $=,\ne,\times$ | Igual a, distinto de, y signo de orden o multiplicación. | Sin unidad propia. |

Si todas las entradas de una matriz tienen una misma unidad, su determinante tiene formalmente esa unidad elevada al orden. Esto no basta para atribuirle un significado físico. Los ejercicios abstractos tendrán entradas adimensionales. Si se emplean barras verticales, la primera aparición dirá «determinante»; el valor absoluto de ese número se diferenciará expresamente.

## 7. Otras formas de explicarla

| Representación | Idea conveniente | Aporte | Riesgo y límite |
|---|---|---|---|
| Inventario con objetos y etiquetas, diseño propio. | 1 y 2. | Posiciones, categorías, suma y variaciones. | Puede sugerir que todas las matrices contienen positivos. Se introducen variaciones con signo y ejemplos abstractos. |
| Monedas y ficha de denominaciones, diseño propio con F10. | 3. | Cada aporte empareja cantidad y valor unitario. | Un total único oculta la generalidad. Se amplía después a varias columnas de resultados. |
| Máquina que encadena transformaciones, como en F6 y F8. | 3 y 6. | Producto como composición e inversa como recuperación. | El orden visual puede confundirse con el escrito. Se sigue una marca y se identifica qué actúa primero. |
| Sello con letra asimétrica, inspirado en la interpretación de F9. | 4 y 5. | Superficie y orientación. | Área física no es determinante con signo; una tabla de inventario no es un mapa espacial. Se declaran ambos límites. |
| Tiras de filas, diseño propio. | 5. | Diferencia entre modificar una fila y toda la matriz. | Conservar soluciones no equivale a conservar determinante. Se registran por separado los efectos. |
| Comprobantes con precios tapados, diseño propio. | 6. | Información suficiente, repetición y contradicción. | Dos comprobantes no aseguran dos relaciones distintas. Se incluyen deliberadamente casos dependientes. |
| Cubrir fila y columna para construir un cofactor, apoyado en F7. | 4 y 6. | Identifica el menor y su posición. | Puede convertirse en receta de colores. Se mantienen índices y explicación verbal del signo. |

La casilla activa conserva sus encabezados. El color complementa etiquetas. Estas representaciones requieren pilotaje.

## 8. Datos del mundo

| Dato comprobable o supuesto | Fuente | Uso | Límite |
|---|---|---|---|
| El BCRP emitió monedas de uno, dos y cinco soles con la denominación SOL. | BCRP, 2016, Circular 004-2016-BCRP, F10. | Tres categorías reconocibles para cantidades y valores. | No se infiere frecuencia de uso ni estructura actual de circulación. |
| Los valores nominales permiten distinguir número de monedas y valor monetario. | Denominaciones de F10; elaboración matemática propia. | Justificación de unidades en el producto. | Cantidades por caja y totales son datos didácticos, no estadísticas del BCRP. |
| Inventarios, turnos, cantidades de cajas y precios de comprobantes. | Supuestos originales de esta propuesta. | Escenas pequeñas que el programa puede comprobar. | Rotular como ejemplo ficticio; no presentarlos como medición de un negocio real. |
| Dimensiones y transformaciones del sello. | Modelo geométrico propio. | Separar área, orientación y determinante. | No atribuir especificaciones a impresoras comerciales. |

Los supuestos se distinguen de las mediciones: conteos enteros, precios ficticios y precisión monetaria explícita. No se añaden estadísticas sin función matemática.

## 9. Dudas y decisiones

**Límites.** No se dispone de una muestra representativa ni de investigación peruana específica para estimar prevalencias. Se distingue evidencia oficial UNI, preparación histórica UNMSM y estudios universitarios de otros países. No se declara un formato más frecuente. CEPREUNI enlaza como «Temario 2024» un archivo nombrado «2023-2»; se conserva esa discrepancia.

**Decisiones matemáticas.** Sarrus se limita a orden tres. La inversa aparece después de cofactores y determinante. La clasificación de sistemas usa eliminación: anular el determinante principal y todos los de sustitución no es un criterio universal suficiente de compatibilidad en casos degenerados. Tampoco todo determinante cero exige dos filas proporcionales.

**Decisiones del dueño.** Definir cuánto del tramo alto UNI será obligatorio y si los precios usarán céntimos discretos o un modelo continuo. Pilotar la densidad de la idea 6, distribuyéndola en pantallas sin eliminar sus condiciones. Rango y valores propios quedan fuera.

**Auditoría de dependencia.** Tabla → operaciones por casilla y trasposición → producto → determinante y cofactores → propiedades → inversa y sistemas. Cada misión usa únicamente herramientas disponibles. Las seis predicciones contienen una opción correcta y tres distractores codificados.

| Idea | Correcta | Distractores | Situación reservada hasta Predice |
|---|---|---|---|
| 1 | B | M01, M02, M03 | Igual total y posiciones distintas. |
| 2 | D | M04, M05, M06 | Tres copias idénticas de un registro. |
| 3 | A | M07, M08, M09 | Invertir dos matrices rectangulares. |
| 4 | C | M11, M12, M13 | Pasos de impresión sobre una misma línea. |
| 5 | B | M14, M15, M16 | Duplicar todas las entradas de orden dos. |
| 6 | D | M17, M18, M19 | Un comprobante exactamente doble de otro. |

Producción verificará restricciones numéricas, alternativas distintas y misiones alcanzables. Comprobará todas las ecuaciones y explicará cada distractor sin etiquetar permanentemente al alumno.

## 10. Fuentes

- **F1. Universidad Nacional de Ingeniería, Oficina Central de Admisión (2020).** *Solucionario del examen de admisión 2020-1*. Segunda prueba, preguntas 14 y 18, página impresa 26. Se verificó también la imagen de la página. [PDF oficial](https://admision.uni.edu.pe/wp-content/uploads/2022/11/solucionario2020.pdf).
- **F2. Centro de Estudios Preuniversitarios UNI (s. f.; archivo identificado como 2023-2).** *Guía / temario del ciclo básico*. Álgebra, página 5 del PDF. La página institucional lo enlaza con la etiqueta «Temario 2024», discrepancia que no permite asignar una nueva edición comprobada. [Programa](https://www.cepre.uni.edu.pe/assets/archivos/comunicados/Syl_Bas_PS_2023-2.pdf) · [Página que lo enlaza](https://www.cepre.uni.edu.pe/ciclos/ciclo-basico-juliaca).
- **F3. Universidad Nacional Mayor de San Marcos, Centro Preuniversitario (2017).** *Boletín del ciclo 2017-II, semana 13: Álgebra, determinantes y sistemas de ecuaciones*. Páginas impresas 26–34. Copia externa de material institucional; usada para alcance histórico. [Copia consultada](https://pdfpresanmarcos.com/wp-content/uploads/2024/02/Boletin-Semana-13-Pre-San-Marcos-2017-II-UNMSM-PDF.pdf).
- **F4. Cárcamo Bahamonde, Andrea, y Fuentealba Aguilera, Claudio (2025; publicación electrónica del 10 de junio de 2026).** *Dificultades de estudiantes de ingeniería en la resolución de tareas de modelización matemática: el caso de álgebra lineal*. Ingeniare, volumen 33. Artículo original, resultados de protocolos y discusión. [Texto completo](https://www.scielo.cl/scielo.php?pid=S0718-33052025000100229&script=sci_arttext) · [DOI](https://doi.org/10.64966/ingeniare.v33.28).
- **F5. Arnawa, I. M.; Yerizon; y Nita, S. (2019).** *Errors and misconceptions in learning elementary linear algebra*. Journal of Physics: Conference Series, 1321, 022095. Se leyó la copia íntegra del artículo, especialmente páginas 4–5. No se extrapolan sus porcentajes a Perú. [DOI](https://doi.org/10.1088/1742-6596/1321/2/022095) · [Texto íntegro consultado](https://www.researchgate.net/publication/337278602_Errors_and_misconceptions_in_learning_elementary_linear_algebra).
- **F6. Margalit, Dan; Rabinoff, Joseph; con ejercicios de Larry Rolen (s. f., edición web consultada en 2026).** *Interactive Linear Algebra: Matrix Multiplication*. Contraste de propiedades y representación mediante composición. [Sección](https://textbooks.math.gatech.edu/ila/1553/matrix-multiplication.html) · [Créditos](https://textbooks.math.gatech.edu/ila/1553/preface-1.html).
- **F7. Margalit, Dan, y Rabinoff, Joseph (s. f., edición web consultada en 2026).** *Interactive Linear Algebra: Determinants: Definition; Cofactor Expansions*. [Definición y propiedades](https://textbooks.math.gatech.edu/ila/1553/determinants-definitions-properties.html) · [Cofactores](https://textbooks.math.gatech.edu/ila/1553/determinants-cofactors.html).
- **F8. Margalit, Dan, y Rabinoff, Joseph (s. f., edición web consultada en 2026).** *Interactive Linear Algebra: Matrix Inverses*. Contraste de definición, propiedades y eliminación. [Texto](https://textbooks.math.gatech.edu/ila/1553/matrix-inverses.html).
- **F9. Margalit, Dan, y Rabinoff, Joseph (s. f., edición web consultada en 2026).** *Interactive Linear Algebra: Determinants and Volumes*. Interpretación de determinante y cambio de área o volumen. [Texto](https://textbooks.math.gatech.edu/ila/1553/determinants-volumes.html).
- **F10. Banco Central de Reserva del Perú (2016).** *Circular 004-2016-BCRP: Ponen en circulación monedas de S/ 1, S/ 2 y S/ 5*. Se usa exclusivamente el dato nominal. [Documento del BCRP](https://www.bcrp.gob.pe/docs/Transparencia/Normas-Legales/Circulares/2016/circular-004-2016-bcrp.pdf) · [Publicación en El Peruano](https://busquedas.elperuano.pe/dispositivo/NL/1350005-1).

Las escenas y actividades son originales; las fuentes no validan experimentalmente esta secuencia.
