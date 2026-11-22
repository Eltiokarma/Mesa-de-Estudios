# Aritmética · Análisis combinatorio

Propuesta de teoría para quinto de secundaria y preuniversitario en Perú. Etapa 20. Revisión: 22 de noviembre de 2026. Escenas y ejemplos originales; sus cantidades son ficticias salvo los datos documentados en la sección 8.

## 1. Resumen en 5 líneas

La unidad enseña a contar resultados diferentes sin tener que escribirlos todos.
Primero define qué constituye un resultado y cuándo dos registros representan lo mismo.
Después distingue decisiones sucesivas, ordenaciones, elecciones de grupos y repartos.
Las fórmulas se construyen a partir de elecciones disponibles y correcciones del conteo repetido.
La mayor dificultad consiste en interpretar orden, repetición y restricciones antes de operar.

## 2. Qué se pregunta en los exámenes

Se revisaron un solucionario oficial UNI, un programa de CEPREUNI y una recopilación externa atribuida a San Marcos. La muestra no permite ordenar contenidos por frecuencia. Dificultad estimada por esta propuesta: básica, una decisión; media, condiciones coordinadas; alta, varias representaciones o restricciones.

| Tipo de pregunta | Universidad | Dificultad | Frecuencia | Fuente |
|---|---|---|---|---|
| Contar números con simetría en sus cifras y una condición adicional de divisibilidad. | UNI, admisión 2018-2, primera prueba, pregunta 24. | Alta: separar cifras libres de cifras determinadas. | Caso observado; no permite estimar recurrencia. | OCAD-UNI, 2018, solucionario oficial, p. 12. [F1](https://admision.uni.edu.pe/wp-content/uploads/2022/11/solucionario20182.pdf). |
| Contar resultados de dos dados que cumplen una condición de diferencia. | UNI, admisión 2018-2, primera prueba, pregunta 26. | Media: identificar resultados completos y excluir los que incumplen. | Caso observado; sin frecuencia comparable entre periodos. | OCAD-UNI, 2018, p. 12 y solución posterior. [F1](https://admision.uni.edu.pe/wp-content/uploads/2022/11/solucionario20182.pdf). |
| Distribuir personas en grupos con una composición exigida, dentro de un problema de probabilidad. | UNI, admisión 2018-2, Matemática, parte 1, pregunta 2. | Alta: reconocer grupos, categorías y posibles repeticiones del conteo. | Caso observado; aquí se trabaja únicamente su componente combinatorio. | OCAD-UNI, 2018, p. 36. [F1](https://admision.uni.edu.pe/wp-content/uploads/2022/11/solucionario20182.pdf). |
| Seleccionar una cantidad variable de proyectos, incluir uno obligatorio y considerar su orden de ejecución. | Atribuido a UNMSM 2027-I, Medicina Humana, por una recopilación externa. | Alta: separar tamaños posibles y distinguir selección de orden. | No cuantificable; atribución pendiente de cotejo con el cuadernillo oficial. | Academia Virtual, s. f., pregunta visible 1. [F2](https://academiavirtual.pe/cursos/aritmetica/analisis-combinatorio). |
| Contar figuras determinadas por elecciones de puntos de una circunferencia. | Atribuido a UNMSM 2027-I, área B, por una recopilación externa. | Media: cada figura se identifica por un conjunto de vértices. | No cuantificable; no se considera autenticada la atribución. | Academia Virtual, s. f., pregunta visible 2. [F2](https://academiavirtual.pe/cursos/aritmetica/analisis-combinatorio). |
| Principios aditivo y multiplicativo, factorial, permutaciones, variaciones y permutación circular. | CEPREUNI, ciclo 2026-2, semana 9. | Desde básica hasta alta según las restricciones. | Presencia curricular confirmada; no equivale a frecuencia de examen. | CEPREUNI, 2026, guía del estudiante, p. 30. [F3](https://www.cepre.uni.edu.pe/assets/archivos/comunicados/PREUNIVERSITARIO-GUIADELESTUDIANTE-2026-2.pdf). |
| Permutaciones con repetición, combinaciones y propiedades de números combinatorios. | CEPREUNI, ciclo 2026-2, semana 10. | Media; puede llegar a alta al justificar identidades o resolver condiciones. | Presencia curricular confirmada; sin proporción de preguntas. | CEPREUNI, 2026, p. 30. [F3](https://www.cepre.uni.edu.pe/assets/archivos/comunicados/PREUNIVERSITARIO-GUIADELESTUDIANTE-2026-2.pdf). |

No se verificaron un programa oficial detallado de CEPRE San Marcos ni una muestra comparable de UNA Puno, UNSA y UNSAAC. No puede inferirse ausencia del tema.

Se prioriza interpretar y combinar modelos. Aplicar los conteos a probabilidad exige justificar además el espacio muestral y la equiprobabilidad cuando corresponda; queda fuera de esta unidad.

## 3. Errores típicos

DOCUMENTADO indica lectura del trabajo original. La tesis de Morales se leyó en una reproducción y se contrastaron sus metadatos con PUCP. Un comportamiento documentado puede tener aquí una explicación hipotética, señalada en «por qué». No se generalizan porcentajes a los postulantes peruanos.

| Código corto | Qué hace el alumno | Por qué | Etiqueta | Fuente |
|---|---|---|---|---|
| C01-LISTA | Omite resultados o repite registros al enumerar sin un criterio estable. | La sistematización insuficiente aparece en los casos analizados. | DOCUMENTADO | Morales Giraldo, 2013, resultados, pp. 35–39. [F5](https://studylib.es/doc/8030175/augusto-morales_2013_operacioneas-combinatoria-en). |
| C02-OPER | Suma posibilidades de etapas que deberían completarse juntas. | Hipótesis: confunde opciones parciales con resultados completos. | DOCUMENTADO | Batanero, Navarro-Pelayo y Godino, 1997, error OPERATIONS. [F4](https://www.ugr.es/~batanero/pages/ARTICULOS/Implicitmodel.htm). |
| C03-ORD | Cuenta un cambio de orden irrelevante o ignora uno relevante. | Hipótesis: mira la escritura y no el resultado representado. | DOCUMENTADO | Batanero et al., 1997, ORDER. [F4](https://www.ugr.es/~batanero/pages/ARTICULOS/Implicitmodel.htm). |
| C04-REP | Permite repetir cuando no se puede, o prohíbe una repetición permitida. | Hipótesis: importa condiciones de otro problema. | DOCUMENTADO | Batanero et al., 1997, REPETITION. [F4](https://www.ugr.es/~batanero/pages/ARTICULOS/Implicitmodel.htm). |
| C05-OBJ | Distingue ejemplares que el enunciado considera idénticos. | Hipótesis: conserva etiquetas imaginarias. | DOCUMENTADO | Batanero et al., 1997, OBJECTS. [F4](https://www.ugr.es/~batanero/pages/ARTICULOS/Implicitmodel.htm). |
| C06-PAR | Intercambia el tamaño del repertorio con el número de posiciones. | Hipótesis: sustituye números sin interpretar parámetros. | DOCUMENTADO | Batanero et al., 1997, PARAMETERS. [F4](https://www.ugr.es/~batanero/pages/ARTICULOS/Implicitmodel.htm). |
| C07-BORRA | Elimina un ejemplar repetido en vez de mantenerlo en el arreglo. | Hipótesis: confunde descontar duplicados con quitar objetos. | DOCUMENTADO | Batanero et al., 1997, EXCLUSION. [F4](https://www.ugr.es/~batanero/pages/ARTICULOS/Implicitmodel.htm). |
| C08-DEST | Trata destinatarios diferentes como si fueran intercambiables. | Hipótesis: atiende cantidades y pierde las etiquetas. | DOCUMENTADO | Batanero et al., 1997, CELLS. [F4](https://www.ugr.es/~batanero/pages/ARTICULOS/Implicitmodel.htm). |
| C09-SOLAPA | Suma dos familias que tienen resultados en común sin corregir la coincidencia. | Puede interpretar «o» como separación automática de casos. No se verificó aquí un estudio específico de esta variante. | HIPÓTESIS | Hipótesis pedagógica de esta propuesta; no se atribuye a un estudio. |
| C10-TESTIGO | Elige primero una persona que asegura la condición y cuenta de nuevo grupos que contienen varias personas que la aseguran. | La misma selección final puede tener varios caminos de construcción. | HIPÓTESIS | Hipótesis pedagógica propia; se justifica matemáticamente mediante un contraejemplo. |
| C11-GIRO | Identifica por rotación arreglos cuya posición sí está fijada, o distingue rotaciones de un círculo sin referencia. | Usa «circular» o «mismos objetos» como palabra clave sin definir equivalencia. | HIPÓTESIS | Hipótesis de diseño; no se halló evidencia directa para esta formulación concreta. |
| C12-VACÍO | Deja un destinatario vacío cuando todos deben recibir algo, o impone esa condición sin que exista. | Interpreta el contexto social del reparto como una restricción matemática implícita. | HIPÓTESIS | Hipótesis propia; requiere validación con usuarios. |
| C13-ALMENOS | Interpreta «al menos uno» como «exactamente uno». | Centra la atención en el mínimo mencionado y olvida los casos mayores. | HIPÓTESIS | Hipótesis propia; no se presenta como resultado de una investigación consultada. |
| C14-CERO | Acepta un cero inicial en un número de varias cifras sin distinguirlo de un código. | Traslada una regla de identificación a la representación de números. | HIPÓTESIS | Hipótesis propia para tareas de transferencia entre números y códigos. |

Morales estudia un grupo reducido de universitarios de Lima, sin representatividad de postulantes. Los códigos orientan la retroalimentación: una respuesta aislada no demuestra una concepción estable. Una explicación posterior incompatible requiere otra situación de diagnóstico.

## 4. Lo que la unidad da por sabido

Se necesitan operaciones con enteros no negativos, multiplicación como grupos de igual tamaño, división exacta y potencias con exponente entero no negativo. También se necesita leer una condición como «exactamente», «por lo menos», «ninguno» o «sin repetir». No se presupone conocimiento de factoriales, variaciones, combinaciones ni separadores: aparecen dentro de la secuencia.

Una entrada breve compara objetos individuales y tipos: cuadernos con portadas distintas y fichas sin marcas. Después compara listas de nombres que representan filas o equipos sin cargos. Si falla la multiplicación, se conserva una tabla pequeña de resultados completos como apoyo.

Los ejercicios numéricos entregan los criterios de divisibilidad necesarios. Los de triángulos informan que tres puntos no colineales determinan uno. Esas herramientas no se evalúan como conocimientos ocultos.

## 5. Las ideas, en orden

Las claves de predicción son para el equipo y permanecen ocultas hasta «Mira». Las tarjetas Lee se muestran como están escritas. Los ejercicios entregan sus fórmulas y datos.

### Idea 1. Contar resultados completos

**Pregunta que responde:** ¿qué estoy contando y cómo evito dejar posibilidades fuera?

**Aprende:** a definir un resultado, organizar sus casos y distinguir elecciones sucesivas de alternativas excluyentes.

**Objeto de la primera pantalla.** Un puesto de confecciones prepara bolsas para una feria. Se ven dos modelos y dos acabados de borde, junto a una ficha de pedido que registra ambas características. Es un catálogo ficticio.

**Lee, cuatro tarjetas.**

1. «El taller prepara una bolsa por pedido. En la ficha anota el modelo elegido y el acabado del borde».
2. «Un resultado es una ficha completa que el taller podría preparar. Una casilla sin completar todavía no representa un pedido».
3. «Dos fichas representan el mismo pedido cuando coinciden en las características que el taller registra».
4. «Un registro ordenado permite volver a revisar lo que ya se encontró. Aquí las fichas se guardan junto a las bolsas que describen».

**Juega.** El alumno arrastra modelo y acabado a una ficha, confirma la bolsa y la coloca en un catálogo. Misión: completar cuatro pedidos diferentes utilizando el pequeño catálogo inicial. No se acepta una ficha incompleta ni una duplicada. Puede ordenar las fichas por modelo; el programa comprueba que las cuatro correspondan a resultados distintos y posibles. La animación no añade un tercer acabado ni anuncia una regla para ampliar el catálogo.

La retroalimentación identifica la causa: falta un acabado o se repite un pedido. Una ficha creada con otro orden de gestos sigue siendo la misma si describe la misma bolsa.

**Predice.** Se anuncia un tercer acabado, todavía sin abrir el nuevo catálogo: «Con los mismos dos modelos y tres acabados disponibles para cualquiera de ellos, ¿cuántos pedidos distintos habrá?».

| Opción | Respuesta propuesta | Clave para el equipo |
|---|---|---|
| A | Seis pedidos completos. | Correcta. |
| B | Cinco, contando modelos y acabados como posibilidades separadas. | C02-OPER. |
| C | Tres, porque basta registrar una ficha por acabado. | C01-LISTA: deja fuera la variación del modelo. |
| D | Doce, porque elegir primero el borde y después el modelo crea otro pedido. | C03-ORD: cuenta el orden del procedimiento como resultado. |

La pantalla permite revisar fichas anteriores, sin generar el tercer acabado ni mostrar multiplicaciones.

**Mira.** El nuevo acabado se aplica a cada modelo y se completan las fichas que faltaban. Después se agrupan los pedidos por modelo y se conecta cada ficha con una bolsa. El alumno ve que elegir los componentes en otro orden vuelve a una ficha existente. La pantalla presenta la respuesta y explica el contraste con su elección antes de mostrar la relación general.

**La regla, completa.** Si una tarea se realiza mediante varias decisiones sucesivas y cada resultado completo corresponde a un único recorrido, se cuentan las opciones de cada etapa. Cuando la cantidad disponible en una etapa es la misma después de cualquiera de las elecciones anteriores válidas, el total es el producto de esas cantidades. Si $N$ significa número de resultados completos y $d_1,d_2,\ldots,d_t$ son las cantidades de opciones en las etapas primera, segunda y siguientes, entonces $N=d_1d_2\cdots d_t$. La letra $t$ indica cuántas etapas tiene ese procedimiento.

No se necesita que las elecciones sean «independientes» en sentido probabilístico. Sin repetición, por ejemplo, las opciones concretas cambian, aunque su cantidad puede disminuir de manera previsible. Si distintas ramas tienen diferentes cantidades de continuaciones, no se fuerza un producto uniforme: se separan las ramas y se suman sus resultados completos.

La suma se utiliza cuando los resultados se dividen en familias sin coincidencias y esas familias cubren todos los resultados permitidos. Para dos familias disjuntas, el total es la cantidad de la primera más la cantidad de la segunda. «O» no garantiza por sí solo que sean disjuntas; si un mismo resultado pertenece a ambas, esta regla simple todavía no basta. Esa corrección se desarrolla en la idea 5, y antes no se incluyen ejercicios que la necesiten.

Una lista sistemática agota las continuaciones de una característica antes de cambiarla. En un árbol se cuentan recorridos completos, no trazos ni nodos. En una tabla cada casilla admisible representa un resultado completo.

**Palabras nuevas.**

| Palabra | Explicación cotidiana | Tres ejemplos |
|---|---|---|
| Resultado | Una posibilidad ya terminada que satisface el encargo. | Una bolsa con modelo y acabado; una entrada con función y asiento; un sándwich con pan y relleno. |
| Etapa | Una decisión que falta completar para terminar. | Elegir modelo; escoger acabado; seleccionar horario de recojo. |
| Disjuntos | Grupos de posibilidades que no comparten ningún resultado. | Pedidos para lunes frente a pedidos para martes; etiquetas de dos casillas frente a etiquetas de tres; entradas infantiles frente a adultas cuando la categoría está fijada. |
| Sistemático | Hecho con un orden que permite revisar qué falta. | Completar todos los bordes de un modelo; recorrer una tabla fila por fila; terminar una rama antes de abrir otra. |

**Así se resuelve.** Un taller ficticio ofrece tres modelos de estuche. Dos aceptan dos tipos de cierre y el tercero acepta solamente uno. Se quiere contar diseños completos, no unidades producidas.

1. Se escribe qué identifica un diseño: su modelo y su cierre.
2. Se separan los modelos en tres casos, porque un diseño tiene un único modelo.
3. Se anotan los cierres permitidos para cada caso; no se atribuyen dos cierres al modelo que admite uno.
4. Se expresa el total como $2+2+1$. El equipo calcula el valor al preparar la pantalla final.
5. Se revisa una lista de fichas para comprobar que no se omitió ninguna ni se repitió una con otro orden de gestos.
6. Se compara con el producto uniforme propuesto por un personaje: falla porque presupone una opción que el catálogo no permite.

**Ahora tú, progresión.** Primero, completar una ficha y distinguirla de una elección parcial. Después, construir una tabla pequeña y detectar una ficha repetida. Luego, elegir entre suma y producto justificando qué representan sus términos. Finalmente, contar itinerarios con etapas y horarios ficticios, separando los casos cuando la cantidad de conexiones depende de la primera elección. El ejercicio de nivel de examen entrega las compatibilidades; la dificultad está en organizar el conteo, no en adivinar una ruta real.

### Idea 2. Ocupar puestos sin confundir orden y repetición

**Pregunta que responde:** ¿cuántas listas o códigos puedo formar cuando las posiciones tienen significado?

**Aprende:** a contar arreglos ordenados con y sin repetición, y a reconocer restricciones de posición.

**Objeto de la primera pantalla.** Una imprenta escolar prepara etiquetas con casillas izquierda y derecha. Los dibujos disponibles representan lápiz, cuaderno, regla y tijera, identificados por forma y nombre. Se trabaja con códigos ficticios.

**Lee, tres tarjetas.**

1. «La etiqueta se lee de izquierda a derecha. La imprenta conserva qué dibujo ocupa cada casilla».
2. «El repertorio reúne los dibujos que pueden utilizarse. Una posición es un lugar concreto de la etiqueta».
3. «En la primera prueba, cada dibujo se utiliza como máximo una vez por etiqueta. Después de guardar una etiqueta, los dibujos vuelven a estar disponibles para crear otra».

**Juega.** Se presentan tres dibujos para dos casillas. Misión: guardar cuatro etiquetas válidas diferentes sin repetir dibujo dentro de ninguna. El alumno puede intercambiar las posiciones. El programa valida las parejas ordenadas; acepta un intercambio cuando cambia la etiqueta y rechaza utilizar dos veces el mismo dibujo en esta prueba. No muestra etiquetas con repetición y no revela el total del caso que se usará en la predicción.

El inventario se repone entre etiquetas: «sin repetición» se refiere a cada resultado, no al conjunto de todas las alternativas.

**Predice.** «Ahora habrá cuatro dibujos y dos casillas. La imprenta permitirá repetir un dibujo dentro de la misma etiqueta. ¿Cuántas etiquetas distintas podrán diseñarse?».

| Opción | Respuesta propuesta | Clave para el equipo |
|---|---|---|
| A | Doce. | C04-REP: sigue retirando el dibujo usado. |
| B | Diez. | C03-ORD: reúne como una sola las etiquetas con posiciones intercambiadas. |
| C | Dieciséis. | Correcta. |
| D | Ocho. | C02-OPER: suma las opciones de las dos casillas. |

**Mira.** La primera casilla se fija sucesivamente en cada dibujo. Para cada elección se llena la segunda con todos los dibujos, incluido el mismo. Las etiquetas se agrupan por lo que aparece a la izquierda. Después se compara una pareja intercambiada: ambas conservan los mismos dibujos, pero no el mismo código. La fórmula aparece únicamente al terminar esta comprobación.

**La regla, completa.** Sea $n$ el número de elementos distintos del repertorio y $r$ el número de posiciones de la lista. Si importa qué elemento ocupa cada posición y no se permite repetir, la primera posición admite $n$ opciones; la siguiente, $n-1$; y así hasta $n-r+1$. El número de variaciones sin repetición se escribe $V(n,r)$ y cumple $V(n,r)=n(n-1)\cdots(n-r+1)=n!/(n-r)!$, para enteros $0\le r\le n$.

El signo de exclamación expresa factorial: $n!=n(n-1)\cdots2\cdot1$ para $n\ge1$. Se establece $0!=1$ porque hay una manera de completar una lista sin posiciones pendientes: no agregar nada. Una lista vacía tiene un único resultado; una lista que exige más elementos distintos de los disponibles tiene cero resultados. En este último caso no se evalúa un factorial negativo.

Si se permite reutilizar cualquiera de los $n$ elementos en cada una de las $r$ posiciones, y no hay otras restricciones, cada posición admite las mismas $n$ opciones. Las variaciones con repetición se escriben $V_R(n,r)=n^r$. La base es el tamaño del repertorio; el exponente es el número de posiciones. El subíndice $R$ recuerda «repetición»; no es una variable numérica. Para evitar casos ambiguos de repertorio vacío, las tareas de esta fórmula usan $n\ge1$.

Con restricciones particulares se vuelve al conteo por posiciones o por casos. Un código puede admitir cero inicial si así se especifica; un número decimal de varias cifras no empieza con cero. Para construir números pares sin repetir cifras cuando el cero está disponible, suele convenir separar el caso de última cifra cero y el de última cifra par no nula: la cantidad de opciones iniciales puede cambiar. No se aplica una fórmula ignorando esa dependencia.

Una variación también se llama arreglo o permutación de $n$ elementos tomados de $r$ en $r$. Cada cargo es una posición: intercambiar coordinador y secretario cambia la asignación.

**Palabras nuevas.**

| Palabra | Explicación cotidiana | Tres ejemplos |
|---|---|---|
| Repertorio | Todo lo que se puede escoger antes de empezar una lista. | Los dibujos de una imprenta; las cifras autorizadas; los participantes disponibles para cargos. |
| Posición | Un lugar que cumple un papel propio en el resultado. | Primera casilla; última cifra; cargo de coordinador. |
| Repetición | Usar de nuevo un elemento dentro del mismo resultado. | Dos dibujos iguales en una etiqueta; una cifra que aparece dos veces; el mismo sabor en dos casillas si está permitido. |
| Factorial | Una escritura corta para multiplicar enteros consecutivos desde uno hasta un tope. | $3!=3\cdot2\cdot1$; $5!=5\cdot4!$; $0!=1$ para ningún puesto pendiente. |

**Así se resuelve.** Una biblioteca ficticia forma códigos de tres cifras usando un repertorio de seis cifras que incluye el cero. No se repiten cifras y el código puede empezar con cero.

1. Se identifica el resultado como una lista de tres posiciones, no como un número de tres cifras.
2. Se toma $n=6$ para el repertorio y $r=3$ para los puestos.
3. Se explican los factores: seis elecciones iniciales, cinco posteriores y cuatro finales.
4. Se expresa la cuenta como $6\cdot5\cdot4=V(6,3)$. No se calcula todavía el total en esta propuesta.
5. Se comprueba que un código y su inversión pueden ser distintos, y que ningún resultado utiliza dos veces una cifra.
6. Como contraste, si el encargo fuera formar números de tres cifras, la primera posición excluiría el cero. Se reconstruye la cuenta por puestos; no se modifica una respuesta al azar.

**Ahora tú, progresión.** Reconocer si intercambiar posiciones cambia el resultado; contar etiquetas con un repertorio pequeño; comparar con y sin repetición; asignar cargos a personas distintas; formar números con primera o última cifra restringida; finalmente, elegir un procedimiento por casos cuando dos restricciones afectan las mismas cifras. Todas las fórmulas disponibles se entregan, incluida la definición del factorial. Se exige explicar qué decisión representa cada factor y por qué ningún resultado aparece dos veces.

### Idea 3. Ordenar todos y descontar solo las copias

**Pregunta que responde:** ¿qué cambia cuando algunos objetos son indistinguibles o cuando una vuelta completa no crea otro arreglo?

**Aprende:** a contar permutaciones lineales y circulares justificando qué cambios producen resultados nuevos.

**Objeto de la primera pantalla.** Un taller prepara una tira decorativa con cuatro banderines de formas diferentes. La tira se cuelga entre dos soportes, uno marcado «inicio» y otro «final». El resultado es el orden visible desde el inicio. El primer contacto no muestra factoriales, una circunferencia ni un conjunto de letras aisladas.

**Lee, tres tarjetas.**

1. «La tira debe utilizar todos los banderines disponibles. Cada uno ocupa un lugar entre el inicio y el final».
2. «Una permutación es una manera de ordenar todos esos objetos. La etiqueta del soporte indica desde dónde se lee».
3. «Dos tiras se comparan por lo que se ve en cada lugar. El taller no registra en qué momento se colocó cada banderín».

**Juega.** El alumno reordena cuatro banderines distintos. Misión: guardar tres tiras diferentes y, en cada una, señalar qué puesto cambió respecto de la anterior. El programa exige usar todos los objetos una sola vez y comprueba los órdenes completos. No muestra aún objetos iguales ni agrupa resultados por rotación. La misión prepara la lectura de una permutación sin agotar todos sus casos.

**Predice.** Se presenta una nueva caja con dos banderines azules idénticos, uno rojo y uno verde. Todos tienen la misma forma y el resultado se distingue solo por la secuencia de colores. «¿Qué comparación permite reconocer cuándo dos tiras son el mismo diseño?».

| Opción | Respuesta propuesta | Clave para el equipo |
|---|---|---|
| A | Cambiar entre sí los dos azules crea otro diseño, aunque se vea igual. | C05-OBJ. |
| B | Hay que retirar uno de los azules antes de ordenar. | C07-BORRA. |
| C | Cualquier giro o inversión de la tira produce el mismo diseño porque conserva los colores. | C11-GIRO. |
| D | Cambiar entre sí solo los dos azules no crea otro diseño; ambos permanecen en la tira. | Correcta. |

**Mira.** Se colocan marcas temporales en el reverso de los azules y se intercambian. Las marcas permiten seguir los objetos, pero al observar la cara que cuenta para el diseño se obtiene la misma tira. Después se mueve el rojo a otra posición y el cambio sí queda registrado. El programa mantiene cuatro lugares ocupados: descontar copias del conteo no significa quitar un banderín.

**La regla, completa.** Ordenar linealmente $n$ objetos distintos en $n$ posiciones produce $n!$ permutaciones. Es el caso $r=n$ de las variaciones sin repetición de la idea 2. El primer objeto tiene $n$ posiciones posibles; al completar sucesivamente los lugares se obtiene el mismo producto descendente.

Si hay $m$ objetos en total y algunos son indistinguibles, se identifican sus clases. La letra $k$ expresa cuántas clases hay y $m_i$ cuántos objetos pertenecen a la clase de índice $i$. El índice es el número que identifica la clase; no una multiplicación. Si $m_1+\cdots+m_k=m$, el número de secuencias diferentes es $m!/(m_1!\cdots m_k!)$. Se imagina primero que cada ejemplar lleva una marca. Cada secuencia visible corresponde a exactamente $m_1!\cdots m_k!$ órdenes de esos ejemplares marcados. Dividir elimina esa multiplicidad uniforme y conserva todos los objetos.

La igualdad debe estar definida por el problema. Dos personas con el mismo uniforme no se vuelven indistinguibles si se registra su identidad. Dos fichas de igual color sí pueden ser indistinguibles cuando únicamente importa la secuencia de colores. Tampoco se divide por un factorial simplemente porque una palabra contenga alguna letra repetida: se cuentan las multiplicidades de cada letra y se explica el denominador completo.

Para $n\ge1$ objetos distintos alrededor de una mesa sin puesto inicial distinguido, si las rotaciones representan el mismo resultado y las reflexiones conservan resultados diferentes, hay $(n-1)!$ órdenes circulares. Se fija una persona como referencia y se ordenan las demás alrededor, en un sentido declarado. No se elimina a esa persona: se usa para que una misma vuelta no aparezca con varios comienzos.

Una mesa con sillas numeradas sí tiene posiciones distinguidas: se cuentan $n!$ asignaciones. Una pulsera que puede voltearse exige analizar también las reflexiones; queda fuera de la fórmula circular de esta unidad. Los círculos con objetos repetidos tampoco se resuelven dividiendo automáticamente una permutación lineal entre $n$: algunas configuraciones pueden tener simetrías distintas. La unidad conserva ese límite explícito.

**Palabras nuevas.**

| Palabra | Explicación cotidiana | Tres ejemplos |
|---|---|---|
| Permutación | Un orden completo de los objetos disponibles. | Una fila de todos los participantes; todos los libros en un estante; todos los banderines de una tira. |
| Indistinguibles | Objetos cuyo intercambio no cambia lo que se está registrando. | Fichas sin marcas del mismo color; letras iguales de un cartel; copias idénticas de un separador. |
| Multiplicidad | Cuántas copias corresponden a una misma clase. | Dos fichas azules; tres letras iguales; cuatro piezas del mismo modelo. |
| Rotación | Mover un arreglo circular conservando quién sigue a quién. | Girar una mesa de muestra; cambiar el punto desde donde se lee una ronda; desplazar todos los puestos de una corona rígida. |

**Así se resuelve.** Se ordenan siete fichas en una tira: tres de un tipo, dos de otro y dos de un tercero. Dentro de cada tipo no se distinguen ejemplares.

1. Se fija que el resultado conserva el orden lineal y utiliza las siete fichas.
2. Se marcan temporalmente los ejemplares para reconocer que hay $7!$ órdenes marcados.
3. Se toma una tira visible y se examina cuántos cambios de marcas conserva: $3!$ en la primera clase, $2!$ en la segunda y $2!$ en la tercera.
4. Se justifica que esa cantidad es la misma para toda tira visible.
5. Se escribe $7!/(3!\,2!\,2!)$ y se deja su evaluación al equipo de implementación.
6. Se verifica que el denominador corrige copias de resultados y no cambia la cantidad de lugares de la tira.

**Ahora tú, progresión.** Ordenar todos los objetos distintos; detectar el denominador correcto de una permutación con objetos iguales; comparar dos criterios de identidad para los mismos objetos; distinguir mesa con sillas numeradas y mesa sin referencia; finalmente, resolver un ordenamiento con objetos repetidos y una posición restringida mediante casos, usando las reglas ya presentadas. No se incluye como ejercicio ordinario un collar con simetrías no enseñadas.

### Idea 4. Elegir un grupo sin inventarle cargos

**Pregunta que responde:** ¿cómo cuento selecciones cuando solo importa quiénes están incluidos?

**Aprende:** a formar combinaciones y explicar por qué el orden interno no produce grupos nuevos.

**Objeto de la primera pantalla.** Un panel de una feria escolar muestra nombres completos ficticios y una bandeja titulada «equipo de apoyo». Los integrantes tendrán la misma tarea y no habrá cargos. El panel se ve como un objeto con una finalidad concreta, antes de convertirse en una lista de símbolos.

**Lee, cuatro tarjetas.**

1. «La feria necesita un equipo de apoyo. Todos sus integrantes harán la misma tarea y ninguno tendrá un cargo diferente».
2. «La ficha del equipo guarda quiénes participan. Los nombres se pueden acomodar en la pantalla sin cambiar la tarea».
3. «Cada persona puede pertenecer como máximo una vez al equipo. Las propuestas de equipos son alternativas entre sí».
4. «Una selección es el conjunto de integrantes elegidos. Después se comparan las fichas para reconocer selecciones repetidas».

**Juega.** De cuatro personas se eligen dos por equipo. Misión: registrar tres equipos diferentes y localizar una segunda escritura de uno ya registrado. El programa compara integrantes, no el orden de arrastre. Al invertir los nombres, la ficha vuelve a su equipo guardado. No aparece la relación entre el total de listas ordenadas y el total de equipos de mayor tamaño.

**Predice.** «En otro panel hay cinco personas y cada equipo tendrá tres integrantes, sin cargos. Ya se escribieron todas las listas ordenadas de tres personas distintas. ¿Cómo convertir esas listas en un registro de equipos?».

| Opción | Respuesta propuesta | Clave para el equipo |
|---|---|---|
| A | Conservar todas las listas porque sus posiciones se ven diferentes. | C03-ORD. |
| B | Reunir las listas con los mismos integrantes y conservar una representación por grupo. | Correcta. |
| C | Dividir el total de listas entre la cantidad de personas del panel, sin revisar cuántas listas representan cada equipo. | C06-PAR. |
| D | Añadir listas en las que una persona ocupe dos plazas para completar los casos faltantes. | C04-REP. |

**Mira.** Se toma una lista y se recuperan todas las que tienen esos mismos integrantes. Las fichas se superponen sobre un solo equipo. Se repite con otro equipo para comprobar que todos tienen la misma cantidad de órdenes internos. No se sugiere dividir por la cantidad total de candidatos: el divisor se obtiene de los integrantes que sí aparecen en cada resultado.

**La regla, completa.** Una combinación sin repetición selecciona $r$ elementos de un repertorio de $n$ elementos distintos, sin considerar su orden interno. Se escribe $C(n,r)$ o $\binom nr$, leído «n sobre r». Para enteros $0\le r\le n$, se cumple $C(n,r)=n!/[r!(n-r)!]$. La explicación parte de $V(n,r)$ listas ordenadas. Cada grupo de $r$ integrantes aparece exactamente $r!$ veces, por sus órdenes internos; por eso se divide entre $r!$.

Se conserva un grupo vacío cuando $r=0$, de modo que $C(n,0)=1$. Elegir todo el repertorio también tiene una única posibilidad: $C(n,n)=1$. Elegir una cantidad mayor que la disponible da cero posibilidades; no se sustituyen números en factoriales negativos. La fórmula requiere objetos distintos y selección sin repetición. Elegir varias unidades de un mismo tipo se trabaja en la idea 6.

Elegir los incluidos determina exactamente los excluidos, y viceversa. Esa correspondencia explica $C(n,r)=C(n,n-r)$. Para $1\le r\le n-1$, se puede fijar una persona y separar los grupos que la incluyen de los que no: $C(n,r)=C(n-1,r-1)+C(n-1,r)$. Los casos no coinciden y cubren todas las selecciones. Esta es la identidad de Pascal; no se exige memorizar una fila triangular para utilizarla.

«Comité» puede incluir cargos y «elegir proyectos» puede exigir orden de ejecución. Se decide por lo que identifica el resultado, no por una palabra aislada.

**Palabras nuevas.**

| Palabra | Explicación cotidiana | Tres ejemplos |
|---|---|---|
| Combinación | Una selección en la que solo cuenta qué elementos están incluidos. | Un equipo sin cargos; libros elegidos para llevar; puntos elegidos como vértices de una figura. |
| Orden interno | La manera de escribir o colocar los integrantes de una misma selección. | Ana antes que Luis en una lista; un libro seleccionado dibujado a la izquierda; nombres ordenados alfabéticamente. |
| Complementario | Lo que queda afuera cuando ya se conoce lo elegido. | Candidatos no seleccionados; libros que permanecen en el estante; fichas que quedan en la caja. |

**Así se resuelve.** Una biblioteca selecciona cuatro libros distintos de un catálogo de nueve para exhibirlos juntos, sin asignarles posiciones en el cartel.

1. Se precisa que el resultado es el conjunto de cuatro títulos, no una fila de libros.
2. Se reconoce que listar cuatro títulos en orden produciría $V(9,4)$ registros.
3. Se elige una muestra de cuatro títulos y se explica que sus $4!$ órdenes describen la misma selección.
4. Se expresa el número buscado como $C(9,4)=9!/[4!\,5!]$.
5. Se comprueba el modelo mediante su complemento: decidir qué cinco libros quedan fuera identifica la misma elección.
6. Se deja la evaluación aritmética para la versión final; la solución ya determina la expresión y el criterio de conteo.

**Ahora tú, progresión.** Clasificar selecciones y listas; agrupar representaciones equivalentes de un equipo; justificar un coeficiente combinatorio; elegir la expresión más corta usando complementarios; explicar la identidad de Pascal con una persona marcada; finalmente, combinar tamaños de selección excluyentes o contar figuras por sus vértices cuando el ejercicio entrega las condiciones geométricas. No se atribuyen probabilidades iguales a los grupos solo por haberlos contado.

### Idea 5. Cumplir restricciones sin contar dos veces

**Pregunta que responde:** ¿cómo incorporo «al menos», «juntos», «separados» y «obligatorio» sin perder casos?

**Aprende:** a escoger casos disjuntos, complemento o corrección de coincidencias, y a justificar bloques y espacios.

**Objeto de la primera pantalla.** Un organizador coloca tarjetas de expositores ficticios en el panel de turnos de una feria. Una actividad requiere equipos de dos personas e incluye una tarjeta marcada como participante obligatorio. Las tarjetas muestran nombres e iconos de rol; la obligación se lee en el aviso de la actividad.

**Lee, tres tarjetas.**

1. «El aviso indica qué equipos están permitidos. Una restricción es una condición que cada resultado debe cumplir».
2. «Antes de contar, se guarda una ficha de ejemplo que sí cumple el aviso y otra que no lo cumple».
3. «Los casos son familias de resultados que se revisan por separado. El registro debe permitir reconocer si una ficha aparece en más de una familia».

**Juega.** Con cinco personas y una obligatoria, se crean tres equipos válidos de dos integrantes. La misión exige que todos incluyan a la persona marcada y que no repitan la misma pareja. El programa comprueba integrantes y condición. No introduce todavía dos personas que puedan cumplir alternativamente una exigencia ni muestra la respuesta de la predicción.

**Predice.** En una nueva actividad se eligen tres personas de cinco. Debe participar al menos una de estas dos: Ana o Luis. «¿Qué procedimiento cuenta exactamente los equipos permitidos?».

| Opción | Respuesta propuesta | Clave para el equipo |
|---|---|---|
| A | Sumar los equipos que incluyen a Ana y los que incluyen a Luis, sin revisar coincidencias. | C09-SOLAPA. |
| B | Contar solo equipos con exactamente una de esas dos personas. | C13-ALMENOS. |
| C | Contar todos los equipos y quitar los que no incluyen ni a Ana ni a Luis. | Correcta. |
| D | Fijar a Ana en todos los equipos y elegir a los demás. | C01-LISTA: omite los que incluyen a Luis y no a Ana. |

**Mira.** Se muestran equipos de tres tipos: solo Ana, solo Luis y ambos. Una tarjeta con ambos nombres cae en las dos bandejas de la opción A; se resalta que sigue siendo un único equipo. Otra con solo Luis demuestra la omisión de D. La vista de complemento retira únicamente las fichas con ninguno de los dos y conserva las demás.

**La regla, completa.** Para usar casos, se demuestra que todo resultado válido pertenece a uno y solo uno. «Exactamente una persona marcada», «exactamente dos» y «exactamente tres» pueden formar casos disjuntos si esas son todas las cantidades posibles. «Incluye a Ana» e «incluye a Luis» no son disjuntos cuando ambos pueden integrar el mismo equipo.

La letra $\Omega$, leída omega, representa el conjunto de todos los resultados del modelo sin la restricción que se analizará. La notación $|A|$, leída cantidad de elementos de A, cuenta los resultados de una familia $A$. Si $A$ reúne los resultados permitidos, su complemento $A^c$ contiene los de $\Omega$ que no pertenecen a $A$. Entonces $|A|=|\Omega|-|A^c|$. El total y los descartados deben describir el mismo tipo de resultado: no se resta una cantidad de equipos a una cantidad de listas ordenadas.

Para dos familias $A$ y $B$, su unión $A\cup B$ reúne los resultados que pertenecen a por lo menos una; su intersección $A\cap B$ contiene los que pertenecen a ambas. Se cumple $|A\cup B|=|A|+|B|-|A\cap B|$. Se resta la intersección una vez porque la suma la incluyó dos veces y se necesita conservarla una. La unidad no generaliza sin explicación a tres o más familias.

«Al menos uno» permite uno o más; «a lo sumo uno» permite cero o uno; «exactamente uno» permite solo uno. Para seleccionar grupos con una persona obligatoria se fija su inclusión y se seleccionan los restantes entre los demás. Si se elige primero a cualquier persona que asegure «al menos uno», un grupo con varios candidatos que aseguran la condición puede aparecer varias veces. Antes de multiplicar, se revisa si el recorrido de construcción identifica un resultado de manera única.

En ordenamientos lineales de objetos distintos, exigir que dos personas concretas estén juntas permite considerarlas un bloque. El bloque ocupa un lugar entre las demás unidades y conserva sus dos órdenes internos, salvo que se fije uno. Exigir que no estén juntas se puede resolver restando del total los casos juntos. Cuando varias personas de una categoría deben quedar separadas entre sí, se ordena primero la otra categoría y se identifican sus espacios interiores y extremos. Se eligen espacios distintos para evitar vecindades y se ordenan después las personas que los ocuparán. Cada factor se explica; el método no se aplica a un círculo sin revisar sus espacios.

**Palabras nuevas.**

| Palabra | Explicación cotidiana | Tres ejemplos |
|---|---|---|
| Restricción | Una condición que deja algunas posibilidades fuera. | Una persona debe participar; dos libros van juntos; ninguna cifra se repite. |
| Complemento | Los resultados del mismo universo que no cumplen la condición. | Ningún invitado marcado frente a al menos uno; personas juntas frente a separadas; códigos sin cero frente a códigos con algún cero. |
| Intersección | Los resultados que pertenecen a dos familias a la vez. | Equipo con Ana y Luis; código que empieza en uno y termina en cero; selección con ambos libros exigidos. |
| Bloque | Varios objetos tratados temporalmente como una sola unidad porque deben permanecer juntos. | Dos expositores consecutivos; tres libros contiguos; dos fichas vecinas. |

**Así se resuelve.** Una feria ficticia elige equipos de tres personas entre siete; dos tienen una capacitación requerida y debe participar al menos una de ellas.

1. Se define el resultado como equipo sin cargos y sin repetición de personas.
2. Se cuenta el universo con $C(7,3)$.
3. Se identifica el incumplimiento exacto: elegir a las tres personas entre las cinco sin esa capacitación.
4. Se expresa el conteo válido como $C(7,3)-C(5,3)$.
5. Se comprueba que un equipo con las dos personas capacitadas permanece incluido una sola vez.
6. Se contrasta con casos disjuntos: exactamente una capacitada o exactamente dos. La segunda ruta debe representar el mismo conjunto, aunque su expresión parezca distinta. No se exige evaluar ambas aritméticamente.

**Ahora tú, progresión.** Identificar ejemplos válidos y no válidos; completar una tabla de casos disjuntos; contar mediante complemento; corregir una suma con intersección; organizar un bloque con orden interno; ubicar personas no vecinas en espacios; finalmente, resolver una selección seguida de una asignación de cargos o una ejecución ordenada, con un elemento obligatorio y tamaños posibles diferentes. Los problemas de examen combinan herramientas ya enseñadas; no introducen una identidad nueva dentro de la solución.

### Idea 6. Repartir objetos y repartir cantidades

**Pregunta que responde:** ¿por qué repartir objetos distintos no se cuenta igual que distribuir unidades idénticas?

**Aprende:** a definir el resultado de un reparto, conservar los destinatarios y representar cantidades mediante separadores.

**Objeto de la primera pantalla.** Un almacén de una feria dispone de bolsas cerradas del mismo producto para tres puestos identificados por nombre. Todas las bolsas de la actividad tienen el mismo tamaño y no se registran números de lote. La pantalla muestra las bolsas y las canastas de destino, antes de cualquier representación con puntos o barras.

**Lee, cuatro tarjetas.**

1. «El almacén registra cuántas bolsas recibe cada puesto. En esta actividad las bolsas se consideran iguales».
2. «Los puestos sí se distinguen por su nombre. El registro conserva el destinatario de cada cantidad».
3. «Distribuir todas las bolsas significa que ninguna queda sin asignar. Un puesto puede recibir cero solo cuando el aviso lo permite».
4. «La ficha del reparto muestra las cantidades junto a los nombres. Cambiar el orden de entrega no añade otra ficha».

**Juega.** Se reparten cuatro bolsas idénticas entre tres puestos con nombre; se permite dejar puestos vacíos. Misión: construir cuatro repartos diferentes, incluyendo uno con un puesto vacío. El programa comprueba conservación de bolsas y compara la terna de cantidades en el orden de los nombres. Intercambiar físicamente dos bolsas iguales no añade un reparto. No aparece todavía la exigencia de que todos reciban alguna.

**Predice.** «Llegan cinco bolsas idénticas y ahora cada uno de los tres puestos debe recibir al menos una. ¿Qué procedimiento conserva esa nueva condición y cuenta repartos por cantidades?».

| Opción | Respuesta propuesta | Clave para el equipo |
|---|---|---|
| A | Reservar una bolsa para cada puesto y distribuir las restantes conservando los nombres. | Correcta. |
| B | Usar todos los repartos del caso que permitía puestos vacíos, sin cambiar nada. | C12-VACÍO. |
| C | Numerar imaginariamente cada bolsa y contar como diferente cualquier cambio de sus destinatarios. | C05-OBJ. |
| D | Quitar los nombres de los puestos y conservar solo las cantidades ordenadas de menor a mayor. | C08-DEST. |

**Mira.** Se coloca una bolsa en cada canasta y se distribuyen las restantes. La ficha conserva tres cantidades positivas y sus destinatarios. Después se deshace la reserva para mostrar que retirar una bolsa de cada puesto recupera un reparto sin exigencia mínima. Se compara un reparto con el intercambio de dos cantidades entre puestos: sus nombres hacen que puedan ser diferentes.

**La regla, completa.** El resultado debe indicar qué se distingue: objetos, destinatarios, orden dentro de cada grupo y posibilidad de vacíos. Si se distribuyen $n$ objetos distintos entre $k$ destinatarios distintos, cada objeto se asigna a uno y solo uno, no hay capacidades máximas y se permiten vacíos, existen $k^n$ asignaciones. La base cuenta destinos y el exponente objetos que se asignan. No se aplica este conteo a objetos indistinguibles porque distintas historias de asignación pueden producir la misma ficha de cantidades.

Para $m$ objetos idénticos y $k\ge1$ destinatarios distintos, se escribe $x_i$ para la cantidad que recibe el destinatario de índice $i$. Si se permiten vacíos, los repartos satisfacen $x_1+\cdots+x_k=m$ y cada $x_i$ es un entero no negativo. Se ordenan los nombres de los destinatarios una sola vez. Una fila de $m$ marcas de objetos y $k-1$ separadores indica cuántos objetos corresponden al primer nombre, al segundo y así sucesivamente. Separadores consecutivos y separadores en los extremos representan cantidades cero; no son dibujos inválidos.

Cada reparto determina una única fila de marcas y separadores, y cada fila determina un reparto. Hay $m+k-1$ posiciones totales y se eligen $k-1$ para los separadores. El número de repartos es $C(m+k-1,k-1)$. Los separadores son idénticos; no se ordenan entre sí. Esta expresión se obtiene de las combinaciones ya aprendidas, no de una fórmula nueva sin explicación.

Si todos deben recibir al menos uno y $m\ge k$, se reserva una unidad por destinatario. Quedan $m-k$ unidades para repartir sin mínimos, por lo que el número es $C(m-1,k-1)$. Si $m<k$, no hay repartos posibles. Para mínimos distintos, primero se reservan las cantidades exigidas y se aplica el mismo razonamiento al resto, si alcanza. Con capacidades máximas no basta la fórmula de reparto libre: se separan casos por las cantidades permitidas o se resta el incumplimiento cuidando las intersecciones.

Seleccionar $m$ unidades entre $k$ tipos, permitiendo repetir tipo y sin considerar el orden de selección, equivale a decidir cuántas unidades se toman de cada tipo. Tiene el mismo conteo $C(m+k-1,k-1)$ cuando existe disponibilidad suficiente de cada tipo. No equivale a fijar un valor monetario: monedas de distintas denominaciones aportan valores diferentes y exigen una condición adicional.

Con objetos distintos y cupos fijos por destinatario, se elige sucesivamente quién va a cada uno. Si los cupos son $x_1,\ldots,x_k$ y suman $n$, el resultado puede escribirse $n!/(x_1!\cdots x_k!)$. El orden dentro de cada grupo no se registra. Los destinatarios siguen identificados; no se divide otra vez entre $k!$. Formar grupos sin nombres exige analizar cuándo intercambiar grupos conserva un resultado, y se deja como ampliación fuera del núcleo para no imponer un divisor injustificado.

**Palabras nuevas.**

| Palabra | Explicación cotidiana | Tres ejemplos |
|---|---|---|
| Destinatario | El lugar o persona a quien llega una parte del reparto. | Puesto de bebidas; biblioteca de un aula; canasta marcada con un nombre. |
| Cupo | La cantidad fijada o permitida para un destinatario, según el aviso. | Dos personas por mesa; tres libros para un aula; como máximo cuatro bolsas en una canasta. |
| Separador | Una marca que indica dónde termina la cantidad de un destinatario y empieza la del siguiente. | Una pestaña entre grupos de fichas; una división entre cantidades; una barra junto a otra para señalar un grupo vacío. |
| No negativo | Cero o una cantidad mayor, sin cantidades por debajo de cero. | Ninguna bolsa; una ficha; varias unidades completas. |

**Así se resuelve.** Se distribuyen ocho paquetes idénticos entre tres puestos con nombre y cada uno debe recibir al menos uno.

1. Se define que interesa la cantidad por puesto y no la identidad de un paquete.
2. Se reserva un paquete por cada destinatario y se comprueba que el inventario alcanza.
3. Se representan los paquetes restantes mediante marcas y se añaden dos separadores para los tres puestos.
4. Se eligen las posiciones de los separadores entre el total de marcas y separadores. La expresión queda $C(8-1,3-1)$.
5. Se comprueba que retirar y devolver la reserva establece una correspondencia entre los dos registros, sin duplicar repartos.
6. Se contrasta con ocho paquetes numerados: el registro tendría que conservar qué paquetes recibe cada puesto y la fórmula anterior dejaría de describir el problema.

**Ahora tú, progresión.** Interpretar una ficha de cantidades; distinguir un intercambio de bolsas idénticas de un intercambio de destinatarios; representar cantidades cero; contar repartos libres; incorporar mínimos; comparar unidades idénticas con objetos numerados; elegir unidades por tipos; finalmente, distribuir personas distintas en grupos con nombre y cupos fijos, o resolver una capacidad máxima mediante casos explícitos. Las soluciones incluyen la correspondencia entre resultado y representación, además de la expresión final.

## 6. Tabla de letras y símbolos de la unidad

Todos los conteos son adimensionales. Se acompañan de palabras como «equipos» o «listas», que describen lo contado y no son unidades físicas. Las letras se pronuncian y explican antes de usarse.

| Letra o símbolo | Significado | Unidad |
|---|---|---|
| $N$ | Número total de resultados del conteo en curso. | Conteo. |
| $n$ | Cantidad de elementos distintos del repertorio o inventario. | Conteo. |
| $r$ | Cantidad de posiciones o de elementos seleccionados del repertorio. | Conteo. |
| $t$ | Número de etapas de un procedimiento. | Conteo; no tiempo. |
| $d_i$ | Cantidad de opciones disponibles en la etapa de índice $i$. | Conteo. |
| $i$ | Índice que identifica una etapa, clase o destinatario dentro de su lista. | Sin unidad. |
| $m$ | Cantidad total de unidades de un inventario con objetos indistinguibles por clases. | Conteo. |
| $m_i$ | Multiplicidad de la clase de índice $i$ dentro de ese inventario. | Conteo. |
| $k$ | Número de clases o destinos diferenciados del reparto o clasificación. | Conteo. |
| $x_i$ | Cantidad recibida por el destinatario de índice $i$. | Conteo. |
| $!$ | Factorial del entero no negativo que lo precede. | Sin unidad. |
| $V(n,r)$ | Cantidad de listas sin repetición de longitud $r$. | Conteo. |
| $V_R(n,r)$ | Cantidad de listas con repetición de longitud $r$. | Conteo; $R$ es una etiqueta. |
| $C(n,r)$ y $\binom nr$ | Número de selecciones sin repetición de tamaño $r$. | Conteo. |
| $\Omega$ | Universo de resultados de un mismo modelo. | Conjunto. |
| $A$, $B$ | Familias de resultados dentro de ese universo. | Conjuntos; no nombres de participantes. |
| $A^c$ | Complemento de $A$ dentro de $\Omega$. | Conjunto. |
| $\cup$, $\cap$ | Unión e intersección de familias. | Sin unidad. |
| $\lvert A\rvert$ | Cantidad de elementos de la familia $A$. | Conteo; no valor absoluto de una cantidad física. |

Otros libros usan $P(n,r)$ o índices para variaciones; aquí se conserva $V(n,r)$. $C$ no significa costo ni $V$ volumen. $x_i$ siempre es cantidad recibida; el enunciado indica si está fijada.

## 7. Otras formas de explicarla

| Representación y procedencia | Para qué conviene | Riesgo y corrección |
|---|---|---|
| Relacionar resultado, procedimiento y expresión; marco presentado por Lockwood, 2015 [F6]. | Todas las ideas: pedir que cada factor apunte a una decisión concreta. | Convertirlo en tres casillas decorativas. Exigir una correspondencia verificable entre una ficha y su recorrido. |
| Tabla de opciones y árbol de decisiones; recursos habituales de conteo en OpenStax [F7]. | Ideas 1 y 2, para inventarios pequeños. | Contar nodos en vez de resultados completos. Vincular cada hoja a una ficha terminada. |
| Marcas temporales sobre objetos iguales; desarrollo didáctico propio. | Idea 3: explicar el divisor de una permutación repetida. | Creer que las marcas forman parte del problema. Ocultarlas y comparar el criterio visible. |
| Equipo escrito de varias maneras; diseño propio a partir de un caso genérico. | Idea 4: justificar el divisor por órdenes internos. | Dividir siempre por el número de candidatos. Construir las representaciones de un grupo concreto. |
| Bandejas de resultados que pueden coincidir; diseño propio. | Idea 5: mostrar intersección y complemento. | Restar dos veces la coincidencia. Seguir una ficha que pertenece a ambas familias. |
| Marcas y separadores, explicados en Levin, 2019 [F8]. | Idea 6: convertir cantidades por destinatario en una selección de posiciones. | Olvidar ceros o borrar nombres. Mantener el orden de destinatarios y admitir separadores consecutivos. |

Estas adaptaciones necesitan validación en la app. Los símbolos llegan después del objeto; los casos grandes se resuelven mediante expresiones justificadas, sin arrastrar cientos de fichas.

## 8. Datos del mundo, con fuente

| Dato comprobable | Uso propuesto | Fuente y límite |
|---|---|---|
| PROMPERÚ describe seis denominaciones de monedas: 10, 20 y 50 céntimos, y 1, 2 y 5 soles. | Distinguir cantidad de monedas, denominación y valor total. | PROMPERÚ, 2022 [F9]. Catálogo documentado; no inventario de una caja real. |
| El BCRP registra denominaciones de billetes de 10, 20, 50, 100 y 200 soles en su Memoria 2024. | Seleccionar tipos de billetes o comparar ejemplares por número de serie frente a denominaciones iguales. | BCRP, 2025 [F10]. No se cuenta dinero existente a partir del número de diseños posibles. |

Los inventarios, equipos, bolsas y cupos de las escenas son ficticios. Con monedas se distingue ejemplares, denominaciones e importe: fijar un importe añade una condición de valor que debe enseñarse.

## 9. Dudas y decisiones

La frecuencia por universidad queda sin determinar. Las atribuciones de San Marcos requieren cotejo oficial; sus problemas y soluciones no se copian.

Se separan selección, orden y distribución. La parte circular admite objetos distintos, rotaciones equivalentes y reflexiones diferentes; excluye collares y simetrías con repeticiones. Particiones generales y desarreglos quedan fuera. La prioridad de separadores necesita un corpus oficial mayor.

El dueño del proyecto debe decidir si la idea 6 es cierre obligatorio o tramo avanzado, y cuánto apoyo de lectura mantiene en modo examen. Su teoría queda completa; los datos y las fórmulas se conservan en ambos modos.

Auditoría de dependencias: la idea 1 usa solo conteo y operaciones previas; la 2 introduce factorial y listas; la 3 utiliza esas listas para ordenar todos; la 4 deriva combinaciones de órdenes ya conocidos; la 5 combina casos, selecciones y órdenes; la 6 emplea combinaciones para justificar separadores. Ningún ejercicio anterior necesita la fórmula de una idea posterior. Las seis predicciones tienen cuatro opciones, una clave y tres distractores asociados a códigos de la sección 3. Cada predicción modifica una condición no mostrada en el juego precedente.

El equipo verifica los cálculos finales, la factibilidad de las restricciones y la ausencia de duplicados. Las expresiones exactas de los ejemplos ya determinan el método; los casos vacíos requieren explicación verbal.

## 10. Fuentes

- **F1. OCAD, Universidad Nacional de Ingeniería. 2018.** *Solucionario del examen de admisión 2018-2*. Fuente oficial; preguntas indicadas en la sección 2. [PDF](https://admision.uni.edu.pe/wp-content/uploads/2022/11/solucionario20182.pdf).
- **F2. Academia Virtual. S. f.** *Análisis combinatorio: clases y preguntas*. Reproducción externa consultada el 22 de noviembre de 2026; sirve para tipos de pregunta, no para autenticar atribuciones ni frecuencias. [Página](https://academiavirtual.pe/cursos/aritmetica/analisis-combinatorio).
- **F3. CEPREUNI. 2026.** *Guía del estudiante, ciclo preuniversitario admisión 2026-2*. Programa oficial, p. 30. [PDF](https://www.cepre.uni.edu.pe/assets/archivos/comunicados/PREUNIVERSITARIO-GUIADELESTUDIANTE-2026-2.pdf).
- **F4. Batanero, C.; Navarro-Pelayo, V.; Godino, J. D. 1997.** *Effect of the implicit combinatorial model on combinatorial reasoning in secondary school pupils*. Educational Studies in Mathematics, 32, 181–199. DOI: 10.1023/A:1002954428327. Texto original alojado por la autora. [Texto](https://www.ugr.es/~batanero/pages/ARTICULOS/Implicitmodel.htm).
- **F5. Morales Giraldo, J. A. 2013.** *Operaciones combinatorias en adolescentes y jóvenes universitarios*. Tesis, Pontificia Universidad Católica del Perú. [Registro institucional](http://hdl.handle.net/20.500.12404/4703). [Copia del texto original consultada](https://studylib.es/doc/8030175/augusto-morales_2013_operacioneas-combinatoria-en). El acceso automatizado al archivo institucional no se consiguió; se contrastó identidad bibliográfica, no integridad digital del PDF.
- **F6. Lockwood, E. 2015.** *Don’t Count Them Out – Helping Students Successfully Solve Combinatorial Tasks*. Blog de educación matemática de la American Mathematical Society. [Artículo](https://blogs.ams.org/matheducation/2015/12/20/dont-count-them-out-helping-students-successfully-solve-combinatorial-tasks/).
- **F7. Abramson, J., y colaboradores. 2021.** *Precalculus 2e*, sección 11.5, Counting Principles. OpenStax. Referencia matemática y de representaciones; no fuente de escenas copiadas. [Capítulo](https://openstax.org/books/precalculus-2e/pages/11-5-counting-principles).
- **F8. Levin, O. 2019.** *Discrete Mathematics: An Open Introduction*, tercera edición, sección 1.5, Stars and Bars. Referencia matemática; los objetos y ejercicios de esta propuesta son propios. [Capítulo](https://discrete.openmathbooks.org/dmoi3/sec_stars-and-bars.html). [Prefacio con año](https://discrete.openmathbooks.org/dmoi3/preface.html).
- **F9. PROMPERÚ. 2022.** *Conoce la historia de las monedas del Perú*. Publicado el 11 de enero de 2022. [Artículo](https://www.peru.travel/es/inspirate/conoce-la-historia-de-las-monedas-del-peru).
- **F10. Banco Central de Reserva del Perú. 2025.** *Memoria 2024*, billetes y monedas en circulación. Información del año 2024, no estimación de inventarios actuales. [Informe](https://www.bcrp.gob.pe/docs/Publicaciones/Memoria/2024/memoria-bcrp-2024.pdf).

