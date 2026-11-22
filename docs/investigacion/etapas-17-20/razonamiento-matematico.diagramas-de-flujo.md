# Razonamiento matemático · Diagramas de flujo y operadores

Propuesta autónoma para quinto de secundaria y preparación de admisión en el Perú. Etapa 17. Identificador: `razonamiento-matematico.diagramas-de-flujo`. Investigación del 22 de noviembre de 2026. Se especifican decisiones pedagógicas y escenas originales; no se entrega código de la aplicación ni un banco final calculado.

## 1. Resumen en 5 líneas

La unidad enseña a ejecutar instrucciones precisas y a interpretar operaciones cuyo significado se define en el problema.
Primero se sigue un valor que cambia, después se eligen caminos y se controlan repeticiones.
Luego se aplican operadores por fórmula o tabla, incluyendo neutro e inverso cuando existen.
La resolución exige respetar el orden, registrar el estado actual y comprobar restricciones.
La principal dificultad es sustituir la regla escrita por una costumbre: calcular todo, seguir ambas ramas o suponer propiedades de la suma.

## 2. Qué se pregunta en los exámenes

La dificultad se estima aquí por las decisiones requeridas: básica, una sustitución; media, varias operaciones o una bifurcación; alta, coordinación de condiciones, repeticiones, tablas e incógnitas. Una fuente externa se identifica como tal. La muestra permite afirmar presencia, pero no ordenar frecuencias históricas.

| Tipo de pregunta | Universidad | Dificultad | Frecuencia | Fuente |
|---|---|---|---|---|
| Recuperar una regla cuyo argumento aparece transformado y usarla en una ecuación | UNI, admisión 2019-II, primera prueba, pregunta 28 | Alta: distinguir argumento y parámetro de la definición | Un caso comprobado; frecuencia general desconocida | Solucionario oficial, página impresa 39 [F01] |
| Evaluar una expresión con una operación definida mediante notación propia | UNI, 2019-II, pregunta 29 | Media: sustitución y simplificación ordenada | Un caso del examen consultado | OCAD-UNI, 2019 [F01] |
| Leer tabla de operación, identificar neutro e inversos y evaluar una expresión | UNI, 2019-II, pregunta 30 | Alta: coordinar varias búsquedas sin confundir inverso con recíproco | Un caso oficial; no se extrapola a otros periodos | OCAD-UNI, enunciado página 8 y solución página 39 [F01] |
| Seguir decisiones sucesivas y transformaciones de un valor en un diagrama | UNMSM, 2023-I, pregunta 19 según solucionario del 16 de octubre | Media a alta: evaluar condiciones con el valor vigente | Un caso reproducido; pendiente cotejo institucional | Solucionario de academia alojado en Studocu [F02] |
| Evaluar operador definido sobre números reales positivos | UNMSM, 2024-II, área C, pregunta 29 en copia escaneada | Media a alta según estructura de los argumentos | Un caso reproducido; la extracción de la fórmula es incompleta | Copia del examen alojada en Studocu [F03] |
| Definición simbólica, operadores por tablas, neutro e inverso | CEPRE-UNI, ciclo básico admisión 2019-I | Básica a alta | Presencia en programa, no frecuencia de examen | Guía reproducida; encabezados internos identifican el ciclo pese al título distinto del portal [F04] |

No se obtuvo una muestra suficiente de UNA Puno, UNSA y UNSAAC para describir sus frecuencias. Se localizó un cuadernillo atribuido a CEPRE-UNA sobre tablas, pero no se verificó su procedencia institucional: no se cuenta como evidencia adicional. El sílabo oficial CEPRE-UNI 2023-2 revisado en la búsqueda no permitió localizar este bloque por nombre; eso no demuestra su exclusión del examen.

Se priorizan cuatro capacidades observables: reconstruir el recorrido, aplicar una definición a argumentos nuevos, leer una tabla con orden y comprobar una respuesta por sustitución. No se enseñará a reconocer una figura para ejecutar automáticamente un truco. En cada ejercicio estarán disponibles la definición, las condiciones y las relaciones aritméticas necesarias. La rapidez se desarrollará después de comprender qué información debe conservarse.

## 3. Errores típicos

La evidencia de programación se usa con cautela: un diagrama de admisión comparte seguimiento de estado, pero no equivale a estudiar un lenguaje de programación. Los hallazgos de otros autores que Sorva resume se etiquetan DE SEGUNDA MANO. No se afirma que los distractores exactos hayan sido administrados a postulantes peruanos. Las explicaciones causales siguientes son interpretaciones de diseño salvo indicación expresa.

| Código | Qué hace el alumno | Por qué | Etiqueta | Fuente |
|---|---|---|---|---|
| DF-01 | Lee una asignación como ecuación que debe seguir siendo verdadera para siempre | Traslada el significado algebraico de igualdad a una instrucción temporal | DE SEGUNDA MANO | Bayman y Mayer, 1983, referidos por Sorva, 2012, sección 3.4 [F05] |
| DF-02 | Decide el resultado por unas instrucciones llamativas, sin recorrer toda la secuencia | Sustituye el seguimiento por una impresión global | DE SEGUNDA MANO | Sleeman y colaboradores, 1986, y Kaczmarczyk y colaboradores, 2010, resumidos en Sorva, sección 3.3 [F05] |
| DF-03 | Supone que el contador o el total ya tiene un valor inicial conveniente | No distingue iniciar un registro de modificarlo | DE SEGUNDA MANO | Samurçay, 1989, referido en Sorva, sección 3.4 [F05] |
| DF-04 | Espera que el sistema corrija una instrucción porque «se entiende lo que quería» | Atribuye intención y conocimiento implícito al ejecutor | DE SEGUNDA MANO | Pea, 1986, resumido por Sorva, sección 3.4 [F05] |
| DF-05 | Recorre las dos salidas de una decisión o elige por posición | Trata el diagrama como lista de cálculos y no como caminos excluyentes en esa evaluación | HIPÓTESIS | Distractor de diseño; falta estudio local específico |
| DF-06 | Confunde mayor que con mayor o igual, o evalúa antes de actualizar | Ignora el caso frontera o el instante de lectura | HIPÓTESIS | Previsión para diagnosticar condiciones |
| DF-07 | Hace una repetición adicional, o imprime el valor anterior al que corresponde | Mezcla contar vueltas, actualizar y mostrar | HIPÓTESIS | Adaptación al formato de admisión; no se atribuye a una muestra concreta |
| DF-08 | Interpreta un símbolo nuevo como multiplicación o suma conocidas | Se guía por la apariencia y no por la definición local | HIPÓTESIS | Previsión para operadores definidos |
| DF-09 | Sustituye en el parámetro sin igualar el argumento completo | Lee la letra visible y omite una transformación dentro de la caja | HIPÓTESIS | Previsión motivada por el tipo de pregunta oficial [F01] |
| DF-10 | Intercambia fila y columna o cambia el orden de los operandos | Supone que el orden no importa | HIPÓTESIS | Previsión para tablas y operaciones no conmutativas |
| DF-11 | Toma uno como neutro universal y el recíproco como inverso universal | Generaliza propiedades de multiplicación a cualquier operación | HIPÓTESIS | Previsión para la demanda de neutro e inverso [F01], [F04] |
| DF-12 | Borra paréntesis, distribuye o asocia sin demostrar que está permitido | Transporta propiedades de operaciones familiares | HIPÓTESIS | Previsión de diseño |
| DF-13 | Acepta una entrada que llega al número pedido pero viola una condición intermedia | Resuelve hacia atrás sin verificar el camino | HIPÓTESIS | Previsión para la integración final |

No se encontró investigación original específica suficiente sobre operadores simbólicos de admisión peruana. Por ello no se fuerza la etiqueta DOCUMENTADO. La bibliografía de programación aporta patrones parciales, y el diseño explicita qué todavía es hipótesis. Un piloto deberá solicitar una explicación breve después de elegir una opción para distinguir un error de recorrido de una equivocación aritmética aislada.

## 4. Lo que la unidad da por sabido

Se requieren operaciones con enteros y fracciones, jerarquía aritmética, paréntesis, comparación de números y ecuaciones lineales sencillas. Se necesita leer una tabla por encabezados y comprender que una letra puede representar un número. Si un problema utiliza divisibilidad o suma de cifras, se proporcionará el criterio o se recuperará previamente: no será un obstáculo oculto.

No se presupone programación, funciones inversas, teoría de grupos ni recursión. Una operación nueva se define en la propia unidad y su inverso se introduce como elemento que produce el neutro, sin exigir estructuras abstractas posteriores. «Volver a un paso» se entenderá primero con una acción visible. El alumno no tendrá que conocer la sintaxis de un lenguaje informático.

La recuperación inicial propone tres tareas sin presión de tiempo: completar una operación con paréntesis, decidir si la igualdad pertenece a un intervalo indicado y encontrar una casilla de una tabla. Si falla, se muestra un ejemplo resuelto y otro caso. Las instrucciones se podrán escuchar y la ruta activa tendrá un marcador que no dependa exclusivamente del color. Los números tendrán espacio suficiente para signos negativos y fracciones; una raya de fracción no se confundirá con una flecha del diagrama.

## 5. Las ideas, en orden

Seis ideas conectan ejecución y definición. Las tres primeras desarrollan diagramas; las dos siguientes, operadores; la sexta reúne ambos. Toda escena conserva un objeto reconocible detrás del esquema. Las tarjetas de Lee preparan lenguaje y situación; las reglas generales se revelan después de la predicción. Los ejemplos resueltos siguientes son originales y pequeños: el equipo de producción recalculará sus variantes y los ejercicios finales.

### Idea 1. Un paso cambia el estado

**Pregunta que responde:** ¿qué número debo usar después de ejecutar una instrucción?

**Aprendizaje:** el alumno registra un valor inicial y lo sustituye por el resultado de cada paso, en el orden indicado.

**Objeto de la primera pantalla:** un tablero de pedidos de un puesto de comida, con una bandeja y una tarjeta que cuenta porciones pendientes. El contexto es una escena ficticia peruana; no reproduce precios, capacidad ni datos de un negocio real. El contador tiene un único valor visible.

#### Lee

1. «Una tarjeta registra las porciones que quedan por preparar. El número puede cambiar cuando ocurre una acción».
2. «Una instrucción dice exactamente qué acción se realiza. El orden de las tarjetas indica cuándo se hace».
3. «Llamaremos x al valor que muestra el registro en ese momento. El nombre del registro permanece aunque cambie su contenido».
4. «El registro inicial debe estar indicado antes de comenzar. No se inventa un valor cuando falta».

#### Juega

El alumno arrastra dos tarjetas de acción a una secuencia: añadir pedidos y retirar porciones ya preparadas. La misión es que el tablero llegue a la cantidad objetivo sin pasar por un valor negativo. Las cantidades se proporcionan y los órdenes posibles son pocos. El programa comprueba cada estado, no únicamente el resultado final. Cada pulsación de «paso» ejecuta una tarjeta y deja el valor anterior en un historial separado.

El juego utiliza solo sumas y restas. No muestra el efecto de combinar duplicación y aumento, que se reserva para la predicción. El tablero puede ser reiniciado con claridad; un segundo intento no comienza accidentalmente con el estado final del primero. La animación muestra que el historial conserva lo sucedido mientras el registro conserva solo el valor actual.

#### Predice

Un nuevo tablero comienza con x igual a 4. Primero se duplica su valor y después se añaden tres pedidos. ¿Qué valor debe quedar al terminar?

| Opción | Respuesta | Clave y error |
|---|---|---|
| A | 11 | Correcta: se aplica la segunda acción al resultado de la primera |
| B | 14 | Incorrecta: DF-02, invierte el orden y duplica después de sumar |
| C | 7 | Incorrecta: DF-02, omite la duplicación |
| D | No puede cambiar porque x sigue siendo 4 en todas las tarjetas | Incorrecta: DF-01, convierte el nombre en igualdad permanente |

#### Mira

El registro pasa de 4 a 8 y después a 11. Se destaca el instante entre ambas instrucciones: la segunda lee 8. El historial conserva tres entradas, pero el tablero no guarda simultáneamente tres valores actuales. A continuación se presenta la escritura de asignación como abreviatura de lo ya visto, evitando que un símbolo sin significado sea la primera experiencia.

#### La regla

Una secuencia se ejecuta siguiendo sus conexiones desde inicio hasta fin. La instrucción `x ← 2x` se lee «reemplaza el valor de x por el doble de su valor actual». Primero se evalúa la expresión de la derecha y después se guarda el resultado en el registro de la izquierda. La flecha de asignación no es una igualdad algebraica. En exámenes puede aparecer `x = x + 3` dentro de un bloque de proceso: allí debe leerse como actualización si esa es la convención declarada por el diagrama.

El óvalo marca inicio o fin, el rectángulo una acción, el paralelogramo entrada o salida y las flechas el recorrido. Las convenciones se darán en una leyenda. Si una figura usa otra convención explícita, se lee esa leyenda. Registrar «paso, instrucción, valor anterior, valor nuevo» evita utilizar datos viejos. El orden puede cambiar el resultado; no se permutan acciones sin comprobarlo. Mostrar un valor no lo modifica por sí mismo. Estas son reglas operativas del modelo propuesto; su necesidad didáctica se relaciona con [F05].

#### Palabras nuevas

| Palabra | Explicación de todos los días | Tres ejemplos |
|---|---|---|
| Estado | Lo que el registro contiene ahora | Cuatro pedidos al comenzar; ocho después de duplicar; once al terminar |
| Asignar | Guardar un valor en un registro con nombre | Iniciar x en cuatro; reemplazarlo por su doble; guardar una suma |
| Secuencia | Acciones que se hacen en un orden | Leer y luego calcular; sumar y luego duplicar; mostrar y terminar |

#### Así se resuelve

Caso propio: el registro comienza en 6, se resta 2 y se triplica el resultado. Primero se escribe el estado inicial, 6. La resta produce 4 y ese es el nuevo valor. La multiplicación utiliza 4, de modo que termina en 12. La comprobación compara con la expresión completa `(6 − 2) × 3`. Escribir `6 − 2 × 3` describiría otra organización: el paréntesis conserva el resultado intermedio que realmente leyó la última acción.

#### Ahora tú

La progresión comienza con una acción y continúa con tres pasos sin bifurcación. Después se pide detectar el primer estado incorrecto de una solución ajena. En admisión se mezclan actualizaciones y salidas: hay que distinguir el último valor guardado de la suma de los valores mostrados. Las acciones no ejecutadas no se calculan por costumbre; todavía no se incorporan decisiones o retornos.

### Idea 2. La condición elige un camino

**Pregunta que responde:** ¿cómo sé qué instrucciones se ejecutan cuando aparecen dos salidas?

**Aprendizaje:** el alumno evalúa una condición con el estado actual y sigue únicamente la rama correspondiente.

**Objeto de la primera pantalla:** una balanza de un puesto de frutas y dos bandejas para clasificar pedidos. El letrero contiene un límite de masa didáctico. Antes del diagrama se ve colocar un paquete y decidir a qué bandeja pertenece; no se atribuye el límite a una norma comercial real.

#### Lee

1. «Una regla de clasificación puede separar los pedidos en dos grupos. Cada pedido debe tener un destino determinado».
2. «La condición se lee completa, incluidos palabras como “más de” o “al menos”».
3. «Un rombo representa una decisión. Sus salidas indican qué camino corresponde a cada respuesta».
4. «La decisión usa el valor disponible cuando se llega al rombo, después de las acciones anteriores».

#### Juega

El alumno mueve paquetes con masas suministradas y los entrega a la bandeja que cumple la regla. Una ficha sincronizada muestra después el mismo recorrido mediante un rombo y dos ramas. La misión es clasificar correctamente una serie de paquetes y señalar qué condición se evaluó en cada uno. Se comprueban destino y valor leído. El juego utiliza valores estrictamente menores o mayores que el límite; el valor exactamente igual queda reservado.

La masa y el contador numérico se presentan con su unidad. Cuando el esquema pasa a trabajar con números abstractos se avisa, para que una regla como duplicar no sugiera que la balanza fabrica fruta. El objeto introduce la selección; los ejercicios posteriores usan registros numéricos cuya transformación sí está definida.

#### Predice

Un clasificador nuevo manda a la bandeja derecha los paquetes con masa mayor que 2 kg y a la izquierda todos los demás. ¿A dónde va un paquete de exactamente 2 kg?

| Opción | Respuesta | Clave y error |
|---|---|---|
| A | A la derecha porque mayor que incluye la igualdad | Incorrecta: DF-06, confunde desigualdad estricta e inclusiva |
| B | A ambas bandejas porque hay dos flechas | Incorrecta: DF-05, ejecuta las dos ramas |
| C | A la izquierda porque la condición “mayor que 2” es falsa | Correcta: evalúa el caso frontera |
| D | A la que tenga menos pedidos, aunque eso no figure en la regla | Incorrecta: DF-04, añade una intención no escrita |

#### Mira

El paquete queda en la bandeja izquierda. La igualdad se compara después con un segundo letrero que dice «mayor o igual»: ese cambio de regla sí modifica el destino. La escena diferencia observar un resultado de cambiar el problema. La opción correcta no depende de que izquierda signifique siempre «no»; las etiquetas de salida permanecen visibles y se alternan de posición en la práctica.

#### La regla

Una condición tiene un resultado verdadero o falso para el estado evaluado. En una decisión binaria se sigue una sola salida en esa visita: la marcada «sí» si es verdadera y la marcada «no» si es falsa. `>` se lee mayor que; `≥`, mayor o igual; `<`, menor que; `≤`, menor o igual; `=`, igual; `≠`, distinto. La igualdad pertenece a las comparaciones inclusivas y queda excluida de las estrictas.

Si la condición une requisitos con «y», deben cumplirse todos; si usa «o» inclusivo, basta al menos uno. El problema debe avisar si quiere «uno u otro, pero no ambos». Tras ejecutar una rama se continúa por la conexión de reunión indicada, sin regresar espontáneamente al otro camino. Si hay otra decisión después de una actualización, se vuelve a evaluar usando el nuevo valor. Una entrada inversa debe satisfacer las condiciones de la rama utilizada, además de producir la salida numérica. Esta última comprobación se retomará en la idea 6.

#### Palabras nuevas

| Palabra | Explicación de todos los días | Tres ejemplos |
|---|---|---|
| Condición | Requisito que se comprueba en un momento | Superar una masa; ser un número par; tener un saldo suficiente |
| Rama | Camino que sale de una decisión | Camino sí; camino no; camino que llega a otra decisión |
| Frontera | Valor justo donde cambia una clasificación | Exactamente dos kilogramos; saldo igual al costo; contador igual al límite |

#### Así se resuelve

Un registro empieza en 5, recibe un aumento de 2 y después se pregunta si supera 6. Primero se actualiza a 7. La condición se evalúa sobre 7, no sobre 5, y resulta verdadera. Si la rama sí indica restar 1, el estado final es 6. La tabla de seguimiento conserva el momento de cada lectura. El hecho de terminar en 6 no vuelve falsa retroactivamente la decisión que se tomó cuando el estado era 7.

#### Ahora tú

Se clasifica primero un valor; luego se revisan valores a ambos lados y exactamente en la frontera. Sigue una actualización antes de decidir y después dos decisiones sucesivas. En admisión se interpreta un recorrido con divisibilidad o comparaciones compuestas, con los criterios proporcionados. Se pide explicar una rama descartada sin ejecutarla, y distinguir una condición falsa de un error del sistema.

### Idea 3. Repetir sin perder la cuenta

**Pregunta que responde:** ¿cómo reconocer cuántas veces se ejecuta una acción y qué valores se muestran?

**Aprendizaje:** el alumno sigue un retorno, actualiza sus registros y separa vueltas, salidas y estado final.

**Objeto de la primera pantalla:** una mesa de empaquetado de cuadernos con una caja abierta y un contador de paquetes. La acción de colocar un cuaderno puede repetirse. El límite de la caja es didáctico y aparece en la ficha; no se finge una medida comercial comprobada.

#### Lee

1. «Una flecha puede llevar de vuelta a un paso anterior. Eso permite repetir una parte del proceso».
2. «El contador indica cuántas veces ocurrió una acción. Debe comenzar con un valor conocido».
3. «Mostrar un número, cambiar un registro y contar una vuelta son acciones diferentes».
4. «La ubicación de la condición indica cuándo se comprueba si el proceso continúa».

#### Juega

El alumno pulsa «paso» para introducir cuadernos en una caja hasta completar el objetivo. El contador se inicia en cero; cada colocación lo aumenta en uno. La misión es detener la ejecución en la salida de fin correcta y completar un registro de las vueltas realizadas. El programa distingue pulsaciones, instrucciones y vueltas: una pulsación no tiene por qué ser una vuelta completa.

El juego usa una caja inicialmente vacía y una condición que admite varias acciones. No muestra la situación en que la condición ya es falsa antes de la primera acción. También se limita a un contador: la suma acumulada se presenta en La regla y se aplica después. Así la predicción se puede responder con los significados disponibles, sin necesitar una fórmula de series.

#### Predice

En otro proceso se comprueba «¿x es menor que 5?» antes de ejecutar la acción. El registro ya empieza en 5. La rama sí ejecuta una acción y regresa; la rama no termina. ¿Cuántas acciones de esa parte se realizan?

| Opción | Respuesta | Clave y error |
|---|---|---|
| A | Una, porque toda repetición empieza ejecutando una acción | Incorrecta: DF-07, desplaza la comprobación hacia después |
| B | Cinco, porque ese es el número escrito como límite | Incorrecta: DF-02, decide por un dato aislado |
| C | Las necesarias hasta que el sistema corrija el valor inicial | Incorrecta: DF-04, supone una corrección no indicada |
| D | Ninguna, porque la primera condición ya es falsa | Correcta: el cuerpo puede ejecutarse cero veces |

#### Mira

El marcador entra directamente al rombo y sale hacia fin. No visita el bloque de acción. Después se compara con un esquema distinto que ejecuta primero y pregunta al final: allí sí ocurriría al menos una acción. Se conserva la diferencia de estructura; no se enseña que todas las repeticiones obedecen al mismo número de vueltas por tener dibujos parecidos.

#### La regla

Un ciclo repite un conjunto de instrucciones siguiendo una flecha de retorno. Para rastrearlo se registran valores iniciales, lugar de comprobación, instrucciones del cuerpo, actualización y salida. Si la prueba está antes del cuerpo, puede haber cero ejecuciones. Si se ejecuta el cuerpo antes de la primera prueba, habrá al menos una, siempre que se haya entrado en ese recorrido. La condición se reevalúa en cada visita con el estado vigente.

La letra k nombra el contador de ejecuciones y n la cantidad total prevista cuando el problema la fija. Un acumulador S conserva una suma: se inicia en cero y, para añadir el valor actual x, se actualiza mediante `S ← S + x`. No se confunde S con k. Mostrar x antes de aumentarlo produce otra lista que mostrarlo después. Para detectar un ciclo que no termina se comprueba si el estado cambia de manera capaz de alcanzar una salida; repetir unas pocas vueltas no demuestra por sí solo que terminará. La app debe distinguir «fin alcanzado» de «simulación detenida para revisar».

#### Palabras nuevas

| Palabra | Explicación de todos los días | Tres ejemplos |
|---|---|---|
| Ciclo | Parte del recorrido que vuelve a ejecutarse | Añadir un cuaderno; revisar otro pedido; aumentar un registro hasta una condición |
| Contador | Registro que cuenta ocurrencias | Vueltas hechas; paquetes revisados; valores mostrados |
| Acumulador | Registro que guarda un total que va creciendo con aportes | Suma de salidas; total de unidades; total de puntos de varias rondas |

#### Así se resuelve

Un proceso original inicia x en 2 y repite mientras x sea menor que 7: muestra x y luego le suma 2. Primera visita: la condición admite 2, se muestra 2 y queda 4. Segunda: muestra 4 y queda 6. Tercera: muestra 6 y queda 8. La siguiente comprobación es falsa y termina. Hubo tres salidas, el último valor mostrado fue 6 y el estado final fue 8. Si se pidiera su suma, se sumaría la lista mostrada, no el estado final. Esas cantidades responden preguntas distintas.

#### Ahora tú

Se empieza completando dos vueltas con tabla de estado. Continúa distinguir última salida y estado final. Después se suma lo mostrado, se cambia la posición de impresión o se compara prueba inicial y final. El nivel de admisión exige hallar un dato inicial o número de vueltas compatible con una lista, justificando el primer y último paso. No se usa una fórmula de progresión sin haber demostrado que el recorrido genera esa progresión.

### Idea 4. El símbolo tiene una definición

**Pregunta que responde:** ¿cómo calculo una operación que nunca había visto?

**Aprendizaje:** el alumno sustituye argumentos completos en una regla dada, sin asignar al símbolo propiedades por su apariencia.

**Objeto de la primera pantalla:** una etiquetadora de paquetes en un pequeño almacén. Recibe una tarjeta numérica y produce otra según una regla visible. No se afirma que una etiquetadora real multiplique pedidos; el dispositivo representa una transformación de códigos. Las cantidades físicas y los códigos se distinguen mediante rótulos.

#### Lee

1. «Un símbolo puede abreviar una regla. Para entenderlo hay que leer la definición que acompaña al problema».
2. «La tarjeta que entra contiene el argumento: el dato completo al que se aplica la regla».
3. «Algunos operadores reciben un dato y otros reciben dos. En ese caso cada entrada tiene su lugar».
4. «Un resultado permitido debe respetar las restricciones de la ficha, por ejemplo que una división tenga denominador distinto de cero».

#### Juega

La etiquetadora tiene la regla «duplica el código de entrada y suma uno». El alumno elige tarjetas para producir dos códigos objetivo indicados. La misión se comprueba comparando entradas y salidas, y exige identificar qué tarjeta se usó, no solo señalar un resultado de una lista. La representación inicial es verbal; luego se abrevia como f(a), leída «resultado del operador f aplicado al argumento a».

El juego muestra la regla en su argumento directo. No presenta una definición con el argumento desplazado, que será la novedad de Predice. La máquina no aprende de unos pocos ejemplos ni adivina una regla oculta: su definición siempre está suministrada.

#### Predice

En una ficha nueva se define `f(a + 1) = 2a + 3`. Para encontrar f(5), ¿qué primer paso respeta el argumento de la definición?

| Opción | Respuesta | Clave y error |
|---|---|---|
| A | Sustituir a por 5 inmediatamente en el lado derecho | Incorrecta: DF-09, identifica el parámetro con el argumento completo |
| B | Igualar a + 1 con 5 y obtener a antes de usar el lado derecho | Correcta: hace corresponder las entradas |
| C | Multiplicar f por 5 porque los paréntesis siempre indican producto | Incorrecta: DF-08, ignora la definición del símbolo |
| D | Cambiar la regla para que produzca el resultado que parece más simple | Incorrecta: DF-04, sustituye la instrucción por una intención |

#### Mira

La ranura de entrada se rotula «a + 1». La tarjeta con 5 solo encaja después de reconocer que el parámetro es 4. Entonces se aplica la expresión correspondiente. Se diferencia visualmente el nombre del operador, el argumento y el resultado. No se introduce todavía inversión de funciones: se resuelve una igualdad sencilla para usar una definición ya dada.

#### La regla

Un operador queda determinado por su definición y su dominio, conjunto de entradas admitidas. Para una regla unaria f(a), cada aparición del argumento se sustituye de manera completa y con paréntesis cuando corresponde. En `f(a + 1) = 2a + 3`, obtener f(x) exige plantear `a + 1 = x`, de donde `a = x − 1`; por tanto `f(x) = 2(x − 1) + 3 = 2x + 1`. La letra a representa aquí el primer argumento formal; x es el valor concreto del registro que se desea transformar.

Para una operación binaria `a ⋆ b`, leída «a operado con b», a ocupa el primer lugar y b el segundo. Si se define `a ⋆ b = 2a − b`, cambiar el orden produce otra sustitución. El signo ⋆ no significa multiplicación salvo que la definición lo establezca. Se respetan los paréntesis y el dominio; una expresión con división por cero no se vuelve válida por estar dentro de una caja. Las preguntas oficiales de operadores motivan esta distinción [F01].

#### Palabras nuevas

| Palabra | Explicación de todos los días | Tres ejemplos |
|---|---|---|
| Operador | Nombre o signo que abrevia una regla dada | f; una estrella definida; una caja con regla explícita |
| Argumento | Dato completo que entra en la regla | El número cinco; una suma entre paréntesis; el resultado de otra operación |
| Dominio | Entradas que la regla admite | Enteros; positivos; reales excepto un denominador prohibido |

#### Así se resuelve

Se define `f(a − 2) = 3a + 1` y se pide f(4). Primero se iguala la entrada formal con la solicitada: `a − 2 = 4`. Se obtiene a igual a 6. Después se usa ese valor en el lado derecho y resulta 19. La comprobación recupera la regla directa: a es x más 2, de modo que `f(x) = 3(x + 2) + 1`; aplicada a 4 produce lo mismo. No se interpreta f(4) como cuatro veces una letra desconocida.

#### Ahora tú

Primero se aplica una regla directa a un número. Después se sustituyen fracciones y expresiones entre paréntesis. Sigue una definición con argumento desplazado o multiplicado y una ecuación sencilla con el operador. En admisión se coordinan dos definiciones y restricciones. Si la transformación del argumento no permite recuperar un único parámetro, el enunciado debe aclarar el dominio o garantizar consistencia; no se inventa unicidad.

### Idea 5. Leer una tabla y sus propiedades

**Pregunta que responde:** ¿qué puedo afirmar de una operación dada por una tabla, sin suponer que se comporta como la suma?

**Aprendizaje:** el alumno obtiene resultados respetando fila y columna, y comprueba cierre, neutro e inversos a partir de toda la información necesaria.

**Objeto de la primera pantalla:** un talonario de turnos con tres clases de etiquetas numéricas y una mesa que combina dos tarjetas para producir una tercera. Son códigos ficticios, no montos de dinero. La tabla se abre como la ficha de funcionamiento de ese clasificador.

#### Lee

1. «Una tabla puede dar todos los resultados de una operación cuando hay pocas entradas posibles».
2. «El primer dato elige una fila y el segundo una columna, según la leyenda de esta ficha».
3. «La casilla donde se cruzan contiene el resultado. Los encabezados no son resultados de otra operación».
4. «Una propiedad debe funcionar en todos los casos que dice abarcar. Un ejemplo aislado puede no ser suficiente».

#### Juega

El alumno introduce pares de tarjetas y marca su casilla de resultado. La misión exige acertar varias combinaciones en una tabla no simétrica de entrenamiento. El programa comprueba fila, columna y lectura; así puede distinguir inversión de operandos de error aritmético. No se busca todavía un elemento que deje iguales a todos los demás. Para la predicción se usará una tabla nueva, expresamente distinta, evitando que un hallazgo del juego revele la respuesta.

#### Predice

La tabla nueva opera sobre los códigos 0, 1 y 2. El primer argumento elige fila.

| ⋆ | 0 | 1 | 2 |
|---|---|---|---|
| 0 | 0 | 1 | 2 |
| 1 | 1 | 2 | 0 |
| 2 | 2 | 0 | 1 |

¿Qué código deja sin cambio a cualquier otro tanto si se coloca primero como segundo?

| Opción | Respuesta | Clave y error |
|---|---|---|
| A | 1 porque siempre es el elemento que no cambia una operación | Incorrecta: DF-11, universaliza el neutro de multiplicación |
| B | 2 porque basta una casilla favorable para decidir | Incorrecta: DF-12, generaliza sin comprobar todos los casos |
| C | 0, porque su fila y su columna reproducen los encabezados correspondientes | Correcta: comprueba ambos lados |
| D | Cualquiera, porque todas las operaciones permiten quitar un argumento | Incorrecta: DF-08, atribuye una regla inexistente |

#### Mira

Se recorre la fila de 0 y luego su columna. Cada combinación devuelve el otro código. Se comparan después las filas y columnas de 1 y 2, donde aparecen contraejemplos. El resultado no surge de que cero «parezca vacío», sino de la tabla específica. En otra operación cero podría no tener ese papel.

#### La regla

Hay cierre sobre un conjunto cuando todas las combinaciones admitidas producen elementos del mismo conjunto. Un neutro e satisface `a ⋆ e = a` y `e ⋆ a = a` para todo elemento a. La letra e se lee «elemento neutro»; no significa número de Euler. Verificar solo una fila puede acreditar un neutro por un lado, pero no necesariamente uno bilateral.

Un inverso de a respecto de ese neutro es un elemento b que cumple `a ⋆ b = e` y `b ⋆ a = e`. Puede no existir; sin hipótesis adicionales tampoco se promete unicidad. Si el problema escribe a⁻¹ para el inverso de esta operación, se usa esa definición, no automáticamente el recíproco 1/a. La conmutatividad exige `a ⋆ b = b ⋆ a` en todos los pares; la asociatividad exige que `(a ⋆ b) ⋆ c` y `a ⋆ (b ⋆ c)` coincidan para todas las ternas admitidas. La letra c es el tercer argumento formal. Una tabla simétrica ayuda a comprobar conmutatividad, pero no demuestra por sí sola asociatividad. Un contraejemplo basta para refutar una propiedad universal. Demanda de tablas y propiedades: [F01], [F04].

#### Palabras nuevas

| Palabra | Explicación de todos los días | Tres ejemplos |
|---|---|---|
| Neutro | Elemento que deja al otro igual al combinarse por ambos lados | Cero en la suma; uno en la multiplicación; cero en la tabla mostrada |
| Inverso | Compañero que junto a un elemento produce el neutro de esa operación | Opuesto para la suma; recíproco de un no nulo para multiplicación; código dos como compañero del uno en la tabla |
| Cierre | Resultados que permanecen dentro del conjunto permitido | Suma de enteros; tabla con resultados entre sus etiquetas; combinación de códigos que devuelve otro código permitido |

#### Así se resuelve

En la tabla de la predicción se pide el inverso de 1. Primero se comprueba que el neutro es 0. En la fila de 1, el resultado 0 aparece bajo la columna de 2: ese es candidato. Se verifica el otro orden, fila 2 y columna 1, y también da 0. Por tanto 2 es inverso de 1 para esta operación. La fracción 1/1 no responde al problema: sería una operación diferente. El procedimiento permite encontrar el resultado sin suponer que todas las tablas son grupos.

#### Ahora tú

Se leen primero casillas y expresiones de dos pasos. Después se buscan neutros por ambos lados e inversos de elementos concretos. Sigue distinguir tabla cerrada, conmutativa o no conmutativa y hallar un contraejemplo. En admisión se evalúa una expresión anidada con inversos dados por tabla y se contrasta una afirmación de propiedades. Las tablas y convenciones se incluyen completas y legibles.

### Idea 6. Encadenar y comprobar

**Pregunta que responde:** ¿cómo combinar operadores y recorridos sin perder el orden ni aceptar una entrada imposible?

**Aprendizaje:** el alumno resuelve de dentro hacia fuera cuando hay anidamiento y verifica el recorrido completo cuando busca una entrada.

**Objeto de la primera pantalla:** un comprobante de pedido que pasa por dos estaciones de sellado en una mesa. Cada sello lleva una regla numérica explícita. El comprobante conserva el código transformado; los sellos no representan descuentos ni impuestos reales. El contexto permite ver qué estación recibe el resultado de la anterior.

#### Lee

1. «Una salida puede convertirse en la entrada de otra regla. El orden queda marcado por las conexiones o los paréntesis».
2. «Una expresión dentro de otra se resuelve como una unidad antes de entregar su resultado».
3. «Si se busca la entrada, puede ser útil deshacer pasos, pero cada candidato debe recorrer el proceso original».
4. «Llegar al número final pedido no basta si una condición anterior impide tomar ese camino».

#### Juega

El alumno dispone dos estaciones con reglas conocidas y elige entre tarjetas iniciales para obtener un código objetivo. La misión comprueba cada resultado intermedio y el orden de estaciones. Se trabaja con un recorrido sin bifurcación y con entradas positivas declaradas. El esquema permite volver a ver la regla de cada estación en cualquier momento, sin exigir memorizar fórmulas.

La predicción introduce una condición de acceso nueva que no apareció en el juego. La escena de comprobante sigue siendo visible: el rombo se añade como control de entrada, no como un diagrama desconectado del objeto. Las reglas del caso se presentan completas antes de pedir la elección.

#### Predice

Un proceso admite únicamente entradas x mayores que 3. Si se admite la entrada, la duplica y luego resta 2. Se quiere una salida de 4. Al deshacer las operaciones aparece x igual a 3. ¿Qué conclusión corresponde?

| Opción | Respuesta | Clave y error |
|---|---|---|
| A | La entrada 3 sirve porque produce 4 en las operaciones | Incorrecta: DF-13, omite la condición de acceso |
| B | La entrada 3 sirve porque mayor que 3 incluye 3 | Incorrecta: DF-06, incluye indebidamente la frontera |
| C | Se cambia la condición para admitir el resultado encontrado | Incorrecta: DF-04, corrige el enunciado según la intención |
| D | Ese candidato no es admisible; no hay entrada válida para esa salida en el proceso dado | Correcta: la única solución algebraica viola la condición |

#### Mira

La tarjeta con 3 llega al control y queda fuera del recorrido admitido. Se muestra aparte que el cálculo aritmético sí produciría 4 si pudiera ejecutarse. Son dos comprobaciones diferentes. La app no castiga por haber encontrado el candidato: reconoce el cálculo y solicita completar la validación. Después se explica por qué no hay otro candidato para esa transformación lineal concreta.

#### La regla

En una composición `f(f(x))`, el operador interior se aplica primero; su resultado completo es argumento del exterior. En una operación binaria, `(a ⋆ b) ⋆ c` y `a ⋆ (b ⋆ c)` deben tratarse como expresiones distintas salvo que se haya demostrado asociatividad. No se distribuye un operador sobre una suma ni se intercambian operandos por analogía con operaciones conocidas.

Para recuperar una entrada se identifican los pasos realmente ejecutados, se deshacen transformaciones cuando sea posible y se comprueba el candidato de principio a fin. Deshacer una operación puede producir varias posibilidades o ninguna; la división por cero y las restricciones de dominio siguen vigentes. En un diagrama con varias ramas se resuelve cada camino compatible y se verifica su condición, sin mezclar actualizaciones de ramas excluyentes. Una solución es válida si cumple simultáneamente definición, dominio, recorrido y salida. Repetir una operación n veces no significa elevar el argumento a n, ni multiplicar una sola salida por n.

#### Palabras nuevas

| Palabra | Explicación de todos los días | Tres ejemplos |
|---|---|---|
| Anidamiento | Una operación colocada dentro de otra | f(f(x)); una casilla cuyo dato es otro resultado; dos pares de paréntesis interiores |
| Candidato | Valor que todavía debe pasar las comprobaciones | Entrada encontrada hacia atrás; solución de una ecuación; etiqueta propuesta como inverso |
| Verificar | Recorrer las condiciones para confirmar una respuesta | Sustituir en la definición; comprobar la rama; revisar que no se divida por cero |

#### Así se resuelve

Caso original: `f(a) = 2a + 1`, y se busca una entrada positiva que haga `f(f(x)) = 15`. Primero se reconoce que la entrada del operador exterior debe ser 7, pues duplicarla y sumar uno produce 15. Después se exige `f(x) = 7`, por lo que x es 3. La comprobación recorre ambas estaciones: 3 pasa a 7 y 7 a 15; además 3 es positivo. El resultado es válido. Una lectura como `2f(x)` produciría otra expresión y no conservaría la estructura solicitada.

#### Ahora tú

La progresión comienza con dos operadores anidados, continúa con ecuaciones de entrada y después incorpora una condición que descarta candidatos. En admisión se combinan una regla transformada, una tabla y un recorrido corto, sin agregar una operación no explicada. Los casos difíciles exigirán detectar falta de solución o datos insuficientes cuando corresponda. La dificultad no debe depender de un esquema ilegible ni de flechas superpuestas.

## 6. Tabla de letras y símbolos de la unidad

| Letra o símbolo | Significado | Unidad o lectura |
|---|---|---|
| x | Valor actual del registro principal | Número o unidad declarada por la escena |
| k | Contador de ejecuciones | Conteo adimensional |
| n | Cantidad de ejecuciones prevista o considerada | Conteo adimensional |
| S | Suma acumulada | La unidad de las cantidades sumadas |
| a | Primer argumento formal de una definición | Número del dominio indicado |
| b | Segundo argumento formal | Número del dominio indicado |
| c | Tercer argumento formal al comparar agrupaciones | Número del dominio indicado |
| f | Operador unario definido en cada problema | No es una cantidad que se multiplica |
| ⋆ | Operación binaria definida en la ficha del problema | Se lee «operado con» |
| e | Elemento neutro de la operación considerada | Elemento del conjunto |
| a⁻¹ | Inverso de a cuando el problema usa esa notación | Definido por la operación; no necesariamente recíproco |
| ← | Asignación de un nuevo valor al registro | Se lee «recibe» o «se reemplaza por» |
| = | Igualdad matemática; en un bloque puede representar asignación si se declara | La leyenda debe distinguir ambos usos |
| >, ≥, <, ≤, ≠ | Comparaciones estrictas, inclusivas y desigualdad | Mayor, mayor o igual, menor, menor o igual, distinto |
| Paréntesis | Agrupación y delimitación de argumento | No se eliminan sin justificación |
| kg | Kilogramo de masa en la escena de clasificación | Unidad, no variable |
| S/ | Símbolo monetario del sol en datos del mundo | No es el acumulador S |

Las letras conservan estos papeles. La definición de f o ⋆ puede variar entre problemas, pero dentro de un problema permanece fija y visible. No se reutiliza x como contador y masa simultáneamente: cada escena declara qué registra. El signo igual en diagramas heredados es una colisión real de notación que debe explicarse, no ocultarse. El inverso de una operación y una potencia negativa habitual comparten escritura; el texto debe decir qué significado corresponde.

## 7. Otras formas de explicarla

| Recurso | Idea y propósito | Riesgo y corrección | Fuente |
|---|---|---|---|
| Persona que ejecuta instrucciones literalmente | Idea 1: separar lo escrito de lo que el autor quiso decir | La persona puede corregir por sentido común; acordar que solo ejecuta instrucciones explícitas | CS Unplugged, Kidbots [F06] |
| Registro actual y tira de historial separados | Ideas 1 a 3: visualizar la actualización | Una caja con todos los valores puede sugerir que todos siguen vigentes; dejar uno activo | Diseño original; motivado por la revisión de seguimiento de estado [F05] |
| Balanza y bandejas | Idea 2: hacer visible la frontera de una condición | Puede confundirse comparación con transformación de masa; separar clasificar de operar códigos | Diseño propio |
| Recorrido con marcador móvil y lista de salidas | Idea 3: distinguir ejecución y resultado mostrado | Una animación automática rápida puede impedir comprobar; permitir un paso por pulsación | Diseño propio, relacionado con la ejecución explícita de [F06] |
| Etiquetadora con ranura de argumento | Idea 4: reconocer la entrada completa | Puede sugerir que la regla se deduce de pocos ejemplos; mantener la definición visible | Diseño propio |
| Tabla como mapa de cruces entre dos tarjetas | Idea 5: respetar orden y buscar propiedades | La simetría visual puede confundirse con asociatividad; comprobar cada propiedad con su definición | Diseño propio en respuesta a demanda de [F01] |
| Dos estaciones de sellado | Idea 6: mostrar que una salida alimenta otra | Puede confundirse repetir con multiplicar el resultado; conservar los valores intermedios | Diseño propio |

La actividad Kidbots aporta el principio de instrucciones precisas y comprobación paso a paso, pero la propuesta no copia sus recorridos ni sus materiales. Las escenas de pedidos y etiquetas se diseñan para adolescentes; no requieren un personaje infantil ni una historia extensa. El soporte visual debe reducir las demandas de memoria del seguimiento y permitir que el alumno explique una decisión con sus propias palabras. No se afirma que esta adaptación tenga una eficacia medida antes de probarla.

Para trabajo en papel se conserva el mismo registro de estado y una leyenda pequeña. Un alumno que termina la escena debe poder reconstruir al menos un caso sin animación. La transición no borra todas las ayudas de golpe: primero se mantiene la tabla de pasos y después se permite abreviarla. El criterio de avance es una explicación consistente de un caso nuevo, no el número de pulsaciones ni el tiempo de permanencia.

## 8. Datos del mundo

En esta unidad el contexto real ayuda a reconocer soportes y cantidades, pero las reglas de los operadores son definiciones didácticas. No es necesario inventar tarifas o atribuir a una máquina real una fórmula arbitraria. Se verificaron los siguientes datos monetarios del Perú para posibles variantes de clasificación y conteo.

| Dato | Uso posible | Fuente |
|---|---|---|
| El folleto del BCRP presenta billetes de S/ 10, S/ 20, S/ 50, S/ 100 y S/ 200 | Tarjetas de clasificación por denominación, sin inferir poder adquisitivo | BCRP, s. f., folleto institucional, familia de billetes 2021 [F07] |
| En esa familia, el billete de S/ 10 presenta a Chabuca Granda | Reconocer el soporte antes de abstraer su denominación | BCRP, mismo folleto [F07] |
| El billete de S/ 20 de esa familia presenta a José María Arguedas | Distinguir identidad visual y valor numérico; usar ilustración propia, no una copia engañosa | BCRP, mismo folleto [F07] |

Las cantidades de pedidos, masas límite, códigos y capacidades de caja de las ideas son ficticias y se rotularán como datos del ejercicio. Una moneda no cambia de valor por pasar por un operador: si se transforman números, se trata de códigos o registros, no de dinero material. No se incluye tipo de cambio, impuesto ni una norma de comercio que requiera actualización periódica. El material de aula puede usar tarjetas simples con denominación escrita, evitando depender de la autenticidad visual de un billete.

## 9. Dudas y decisiones

**Muestra de examen.** Hay evidencia oficial UNI 2019-II para operadores, tablas y propiedades. Las dos referencias de San Marcos son reproducciones externas: la extracción de la fórmula de 2024-II no es suficientemente fiel para reconstruir el ejercicio, por lo que solo se describe su tipo. No se copia ni se usa su respuesta como ejemplo. La guía CEPRE-UNI tiene un título de portal que dice 2023, pero sus encabezados internos indican admisión 2019-I; se usa esta última identificación y se conserva la discrepancia.

**Investigación.** Se leyó la síntesis de Sorva sobre trabajos anteriores. Los errores derivados de esas citas permanecen DE SEGUNDA MANO. No se dispone de una validación peruana sobre esta secuencia ni de prevalencias transferibles. Se intentó acceder a un artículo sobre comprensión del signo igual, pero la página solicitó verificación adicional y no se incorporó como lectura original. Los errores sobre operadores de admisión quedan como hipótesis explícitas.

**Alcance.** Se incluyen neutro e inverso porque la muestra oficial los exige. No se convierte la unidad en teoría de grupos. La asociatividad se enseña como propiedad que debe comprobarse, no se supone al ver una tabla. Se excluyen recursión, complejidad computacional y sintaxis de lenguajes. Tampoco se pide derivar una ley única desde unos pocos pares de entrada y salida: sin restricciones pueden existir muchas reglas compatibles.

**Revisión de secuencia.** La idea 1 introduce actualización; la 2 añade elección de camino; la 3 usa ambas para repetir. La 4 define operadores sin necesitar neutros. La 5 incorpora tablas y propiedades. La 6 combina conceptos ya presentados. Ningún ejercicio temprano necesita inversos, acumuladores ni propiedades que aparezcan después. En la idea 2 solo se anuncia que los candidatos deberán verificarse; su resolución completa se desarrolla en la 6.

**Revisión de predicciones.** Se reservaron, respectivamente, una combinación nueva de acciones, el caso de igualdad, cero repeticiones, un argumento transformado, un neutro en una tabla nueva y una entrada que viola la condición. Distractores: idea 1, DF-02/DF-02/DF-01; idea 2, DF-06/DF-05/DF-04; idea 3, DF-07/DF-02/DF-04; idea 4, DF-09/DF-08/DF-04; idea 5, DF-11/DF-12/DF-08; idea 6, DF-13/DF-06/DF-04. Todos tienen registro en la sección 3.

**Decisiones de producción.** Conviene empezar con una columna de recorrido para celular, usar conectores identificados cuando una flecha de retorno sea larga y mostrar la tabla de operador sin desplazamiento horizontal si su tamaño lo permite. Si no cabe, se mantienen visibles los encabezados al desplazarla. Un límite de pasos de la simulación debe generar «revisa si termina», nunca un falso fin matemático.

**Decisiones del dueño del proyecto.** Definir si las tablas avanzadas se incluyen en la ruta común o en una ampliación UNI, y elegir el tamaño del diagnóstico local. La propuesta permite ambos recorridos sin retirar la explicación. El equipo deberá comprobar todas las definiciones, soluciones y casos frontera al producir ejercicios; la revisión documental no equivale a una implementación probada con estudiantes.

## 10. Fuentes

| Código | Autor, año, título y enlace | Qué se consultó |
|---|---|---|
| F01 | Oficina Central de Admisión, Universidad Nacional de Ingeniería, 2019. [Solucionario de admisión UNI 2019-II](https://admision.uni.edu.pe/wp-content/uploads/2022/11/solucionario20192.pdf) | PDF oficial; preguntas 28 a 30 y sus soluciones para identificar demanda, sin reproducir problemas o soluciones |
| F02 | Solucionario de academia, autor no identificado de forma suficiente en la vista consultada, 2022. [San Marcos, admisión 2023-I, domingo 16 de octubre](https://www.studocu.com/pe/document/universidad-nacional-mayor-de-san-marcos/examen-de-admision/san-marcos-solucionario-domingo-16-octubre/40399844) | Reproducción externa; pregunta 19 y su tipo de diagrama. El periodo 2023-I no se confunde con el año calendario del examen |
| F03 | Universidad Nacional Mayor de San Marcos, 2024. [Examen general 2024-II, área C, copia escaneada](https://www.studocu.com/pe/document/universidad-nacional-mayor-de-san-marcos/examen-de-admision/examen-unmsm-2024-ii-area-c-escaneado/99286113) | Copia en portal externo; pregunta 29 identificable, fórmula con extracción incompleta. Cotejo institucional pendiente |
| F04 | CEPRE-UNI, ciclo básico admisión 2019-I. [Guía del estudiante, reproducción externa](https://es.scribd.com/document/394100249/Guia-cepre-UNI-Admision-2019) | Páginas internas 24 y 25: Operadores matemáticos I y II. El portal titula el archivo con otro año |
| F05 | Juha Sorva, 2012. [Visual Program Simulation in Introductory Programming Education](https://files.software-carpentry.org/training-course/2012/08/sorva-thesis-1.pdf). Tesis doctoral, Aalto University | Secciones 3.3 y 3.4 leídas: revisión de seguimiento, asignación, inicialización y concepciones. Hallazgos de estudios citados etiquetados de segunda mano |
| F06 | Computer Science Education Research Group, University of Canterbury, s. f. [CS Unplugged: Kidbots, What's it all about?](https://www.csunplugged.org/en/topics/kidbots/whats-it-all-about/) | Recurso de sus autores sobre instrucciones secuenciales y ejecución; se adapta el principio, no se copia la actividad |
| F07 | Banco Central de Reserva del Perú, s. f. [Folleto institucional, familia de billetes 2021](https://www.bcrp.gob.pe/docs/sobre-el-bcrp/folleto/folleto-institucional.pdf) | Contenido indexado del documento institucional: denominaciones y personajes. La apertura directa devolvió un contenedor sin el texto completo |
