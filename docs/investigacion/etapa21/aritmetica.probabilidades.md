# Aritmética · Probabilidades

## 1. Resumen en 5 líneas

La unidad enseña a describir el azar, definir resultados y asignar probabilidades con un modelo explícito.
Avanza desde casos finitos y conteo hasta sucesos compuestos, información condicionante e independencia.
Termina con experimentos repetidos y problemas de procedencia, usando caminos y grupos de referencia.
Lo más difícil es elegir qué se cuenta y entre quiénes, sin confundir azar con igualdad de posibilidades.
Se proponen seis ideas; las fuentes permiten reconocer estructuras de examen, pero no establecer su frecuencia general.

## 2. Qué se pregunta en los exámenes

**Alcance: 21 de noviembre de 2026.** Se distinguen exámenes ordinarios, pruebas de centros preuniversitarios y temarios. «Inicial», «intermedia» y «alta» son valoraciones propias de las decisiones necesarias, no dificultades medidas. La muestra no permite estimar frecuencias históricas.

| Tipo de pregunta | Universidad y evidencia | Dificultad | Frecuencia | Fuente |
|---|---|---|---|---|
| Contar parejas de dados cuya suma cumple una condición | UNI 2019-1, primera prueba, pregunta 17 | Intermedia: resultados elementales frente a sumas | Un caso; frecuencia general desconocida | [F1], solución p. 40 del PDF |
| Repartir personas en grupos con composición requerida | UNI 2018-2, segunda prueba, Matemática parte 1, pregunta 2 | Alta: agrupaciones y representación consistente | Un caso; frecuencia desconocida | [F2], pp. 36 y 43–44 del PDF |
| Obtener una condicionada mediante unión, intersección y probabilidades simples | CEPREUNI 2015-1, segundo parcial, pregunta 18 | Intermedia–alta: álgebra de sucesos | Un caso de ingreso directo; no examen ordinario | [F3], p. impresa 132 |
| Modelar espacios, sucesos, exclusión e independencia | CEPREUNI, sílabo básico 2023-2 | Inicial–intermedia | Presencia en temario; no frecuencia | [F4], p. 1 |
| Usar espacios equiprobables, condicionamiento, independencia y combinatoria | UNMSM, temario oficial 2023-I | Inicial–alta | Presencia en temario; no frecuencia | [F5], p. 39, 7.4–7.5 |
| Transferir un objeto y ponderar los posibles estados receptores | Atribución secundaria a UNMSM 2026-I, Medicina Humana | Alta: actualizar y sumar caminos | Registro indexado; falta cotejo oficial | [F6] |
| Inferir procedencia tras observar un resultado | Atribución secundaria a UNMSM 2027-I, Medicina Humana | Alta: ponderación y condicional inversa | Un registro; falta cotejo oficial | [F6], entrada visible |
| Unir sucesos superpuestos y relacionar conjunta y condicionada | Material atribuido a CEPREUNMSM 2020-I, semana 18 | Intermedia | Práctica preuniversitaria; no frecuencia | [F7], copia externa |
| Tipos y frecuencia de otras universidades | UNA Puno, UNSA y UNSAAC | Sin asignar | No se reunió muestra primaria comparable | Limitación |

Se priorizan conteo, sucesos compuestos y cambio del total de referencia por su respaldo documental. Probabilidad total y Bayes permiten resolver caminos y procedencias; la binomial cierra el conteo repetido. No se califican como «los más frecuentes». Las preguntas se caracterizan sin reproducir sus inventarios ni soluciones. Las convocatorias secundarias son etiquetas de catálogo, no fechas inferidas ni autenticaciones.

## 3. Errores típicos

Las etiquetas distinguen lectura de investigación original (DOCUMENTADO), descripción citada sin revisar su origen (DE SEGUNDA MANO) y anticipación de diseño (HIPÓTESIS). Las causas son interpretaciones posibles. No se transfieren porcentajes extranjeros al Perú.

| Código | Qué hace o cree el alumno | Por qué puede hacerlo | Etiqueta | Fuente |
|---|---|---|---|---|
| E-EQUI | Da igual probabilidad a categorías que reúnen cantidades distintas de resultados | Asocia azar con igualdad de posibilidades | DOCUMENTADO | Serrano, Batanero, Ortiz y Cañizares, 1998, resultados y argumentos [F8] |
| E-AIS | Responde que no se puede comparar probabilidades porque no se conoce el próximo resultado | Confunde predecir un caso con evaluar posibilidades | DOCUMENTADO | Serrano y colaboradores, 1998, pp. 14–15 [F8] |
| E-PEQ | Espera que una muestra pequeña reproduzca fielmente la proporción del modelo | Exige representatividad inmediata | DOCUMENTADO | Serrano y colaboradores, 1998, p. 14 [F8] |
| E-REP | Considera más probable una secuencia concreta por parecer equilibrada o irregular | Juzga el aspecto de la secuencia | DOCUMENTADO | Serrano y colaboradores, 1998, análisis de argumentos [F8] |
| E-INV | Intercambia la probabilidad de A dado B con la de B dado A | No conserva qué grupo condiciona | DOCUMENTADO | Díaz, Contreras, Batanero y Roa, 2012, resultados [F9] |
| E-CON | Confunde probabilidad condicionada con conjunta | Conserva el denominador global aunque cambie la información | DOCUMENTADO | Díaz y colaboradores, 2012, resultados [F9] |
| E-BASE | Ignora la proporción inicial de cada procedencia | Se fija solo en las tasas internas | DOCUMENTADO | Díaz y colaboradores, 2012, resultados [F9] |
| E-EXC | Trata independencia y exclusión mutua como equivalentes | Interpreta «no depender» como «no ocurrir juntos» | DOCUMENTADO | Díaz y colaboradores, 2012, resultados [F9] |
| E-TIEM | Cree que conocer un resultado posterior no puede cambiar una probabilidad sobre algo anterior | Confunde información con cambio causal del pasado | DOCUMENTADO | Díaz y colaboradores, 2012, resultados [F9] |
| S-RACHA | Espera que una racha haga más probable el resultado contrario en el siguiente ensayo independiente | Imagina una compensación obligatoria | DE SEGUNDA MANO | Falacia del jugador descrita en los antecedentes de Serrano y colaboradores, 1998; no se verificó aquí el estudio originario [F8] |
| H-ORD | Cuenta un orden en el numerador y lo ignora en el denominador | Cambia la definición de resultado durante el cálculo | HIPÓTESIS | Hipótesis de diseño para las escenas de conteo |
| H-DUP | Cuenta dos veces a una persona que cumple dos etiquetas | Suma listados sin revisar la coincidencia | HIPÓTESIS | Hipótesis de diseño |
| H-OEX | Interpreta siempre «A o B» como exactamente uno | Transfiere un uso cotidiano de «o» | HIPÓTESIS | Hipótesis de diseño lingüístico |
| H-Y | Selecciona solo quienes cumplen ambas etiquetas cuando se pide al menos una | Confunde unión con intersección | HIPÓTESIS | Hipótesis de diseño |
| H-REPON | Mantiene la composición inicial después de extraer sin devolver | Conserva el denominador y los favorables del primer paso | HIPÓTESIS | Hipótesis de diseño |
| H-FREC | Toma una frecuencia observada en pocas pruebas como probabilidad exacta del mecanismo | No distingue estimación y modelo | HIPÓTESIS | Hipótesis; E-PEQ es un fenómeno relacionado, pero no idéntico |
| H-UNICA | Usa la probabilidad de un solo orden para el suceso que admite varios órdenes | Omite caminos favorables | HIPÓTESIS | Hipótesis de diseño para repetición binomial |

Cotrado, Burgos y Beltrán-Pellicer (2022) [F10] analizan currículo y materiales peruanos: advierten conflictos potenciales al suponer equiprobabilidad. Estudian documentos, no frecuencias de error en alumnos. La tesis de Díaz Mejía (2025) [F11] aporta un antecedente limeño sobre condicionamiento y simulación; solo se leyó su resumen. Los códigos orientan ayuda y permanecen ocultos al estudiante.

## 4. Lo que la unidad da por sabido

Se necesitan fracciones, equivalencia con decimales y porcentajes, operaciones elementales y lectura de tablas. Debe distinguirse un objeto de una categoría, una secuencia de su resumen y «al menos» de «exactamente».

La combinatoria no se presupone dominada: la idea 2 reconstruye sus reglas. No se requieren límites, integrales ni inferencia estadística.

El diagnóstico pide contar fichas y tipos de dibujo por separado y comparar dos proporciones con totales distintos. Si falla, se organizan las fichas en filas y se repite con otro inventario.

Toda probabilidad estará entre cero y uno y no tendrá unidad física. «Azar» exige un mecanismo: una caja opaca no garantiza selección uniforme. Las escenas declaran mezcla, igualdad al tacto y selección uniforme cuando se necesitan; son hipótesis del modelo.

## 5. Las ideas, en orden

La progresión es: **modelo y resultados → conteo → operaciones con sucesos → condición → dependencia y repetición → caminos y procedencia**. Ninguna idea usa una fórmula que aparezca después. Las opciones se presentan sin explicación durante «Predice»; las claves y códigos siguientes son para el equipo.

«Así se resuelve» especifica el método editorial. El equipo fijará y recalculará los datos finales. Las misiones se aprueban por decisiones comprobables, nunca por acertar un sorteo.

### Idea 1. El azar necesita un modelo

**Pregunta que responde.** ¿Qué puede salir y qué justifica comparar sus posibilidades?

**Aprendizaje.** El alumno distingue resultado, suceso y probabilidad, y exige una razón para suponer equiprobabilidad.

**Objeto de la primera pantalla.** Una bolsa escolar contiene fichas iguales al tacto, con números y dibujos. Primero se ven la bolsa, las fichas y la mano que seleccionará sin mirar; las letras matemáticas aparecen después.

**Lee, cuatro tarjetas.**

1. «La mesa tiene fichas iguales al tacto. Cada una lleva un número que permite reconocerla después de sacarla».
2. «La actividad consiste en mezclar, sacar una ficha sin mirar y registrar lo que apareció. Al preparar una ronda nueva se devuelve la ficha».
3. «Un resultado dice qué ficha salió. Un suceso reúne los resultados que cumplen una condición, como llevar una estrella».
4. «La simulación está diseñada para dar la misma oportunidad a cada ficha individual. Los dibujos pueden repetirse en cantidades diferentes».

**Juega.** El alumno coloca todas las fichas numeradas en un registro y marca las que cumplen una condición. La misión exige inventario completo, ningún duplicado y clasificación correcta. Una extracción permite conocer la acción; acertar qué saldrá no concede puntos.

**Predice.** «Una bolsa nueva tiene seis fichas con estrella y dos con luna; todas son iguales al tacto y cada ficha tiene la misma oportunidad de salir. Antes de sacar una, ¿qué afirmación es correcta?»

| Opción | Contenido | Clave y error |
|---|---|---|
| A | Es más probable obtener estrella, aunque una luna sigue siendo posible | Correcta: se comparan cantidades de fichas bajo el mismo mecanismo |
| B | Estrella y luna son igual de probables porque hay dos dibujos | Incorrecta; E-EQUI |
| C | No se puede comparar porque no sabemos qué ficha saldrá | Incorrecta; E-AIS |
| D | Si hacemos ocho rondas reiniciando la bolsa, tienen que salir exactamente seis estrellas | Incorrecta; E-PEQ |

**Mira.** Se agrupan los resultados individuales por dibujo. Después se conservan varias series breves con conteos distintos, reiniciando la bolsa cada vez. Se separa el modelo de posibilidades del registro observado; ninguna serie se escoge por coincidir con la proporción esperada.

**La regla, completa.** Se llama $\Omega$, «omega mayúscula», al espacio muestral: conjunto de resultados posibles definidos para el experimento. Se llama $\omega$, «omega minúscula», a un resultado individual. Se reserva $A$, «a mayúscula», para el suceso que se quiere evaluar. Un suceso es un conjunto de resultados; puede contener uno, varios, todos o ninguno.

La expresión $P(A)$, «probabilidad de a», mide la probabilidad del suceso. Se cumple $0\leq P(A)\leq1$, $P(\Omega)=1$ y $P(\varnothing)=0$, donde $\varnothing$ se lee «conjunto vacío». En un espacio finito de resultados equiprobables, la regla de Laplace es $P(A)=\#A/\#\Omega$. El signo $\#$ se lee «número de elementos de». El numerador cuenta resultados favorables a la condición, no resultados buenos para la persona.

La equiprobabilidad se establece por la hipótesis del mecanismo o por una justificación suficiente; no por la palabra «aleatorio». Si los resultados tienen probabilidades distintas conocidas, se suman las probabilidades de los resultados que forman $A$. No se divide simplemente entre el número de etiquetas. La probabilidad de todas las posibilidades elementales debe sumar uno.

Se llama $R$, «erre mayúscula», al número de repeticiones del experimento y $F_A$, «efe sub a», a cuántas veces ocurrió el suceso registrado. La frecuencia relativa observada es $\widehat p=F_A/R$, donde «pe con sombrero» indica una estimación. En repeticiones con mecanismo estable y adecuadamente reiniciado, muchas observaciones pueden ayudar a estimar una probabilidad. No garantizan una proporción exacta en cada bloque ni predicen el siguiente resultado. La discusión formal de independencia se reserva a la idea 5; aquí se describe el protocolo de repetición en palabras.

**Palabras nuevas.**

- **Experimento aleatorio:** acción cuyo resultado concreto no conocemos de antemano. Ejemplos: sacar una ficha mezclada; lanzar una moneda bajo el modelo declarado; seleccionar al azar una ficha de un listado.
- **Espacio muestral:** colección de respuestas posibles al registro elegido. Ejemplos: números de fichas; caras de un dado; identificadores de piezas de un lote.
- **Equiprobable:** con la misma oportunidad dentro del modelo. Ejemplos: fichas individuales seleccionadas uniformemente; caras de un dado ideal equilibrado; registros elegidos uniformemente de una lista completa.
- **Frecuencia relativa:** parte de las pruebas en que ocurrió algo. Ejemplos: fichas con estrella observadas; resultados pares registrados; piezas marcadas durante una simulación repetida.

**Así se resuelve.** El ejemplo da un inventario y un protocolo uniforme. Primero identifica la ficha individual como resultado; luego cuenta el total y los favorables. Justifica equiprobabilidad, forma el cociente y expresa la proporción. Comprueba el intervalo entre cero y uno. Finalmente compara con un registro breve: una frecuencia distinta no invalida automáticamente el modelo.

**Ahora tú.** Orden progresivo: identificar resultados; distinguir fichas de dibujos; aplicar Laplace con uniformidad justificada; rechazarlo cuando falta esa condición; sumar probabilidades elementales dadas; comparar bolsas con totales diferentes. En admisión, identificar favorables mediante una propiedad numérica y distinguir probabilidad de frecuencia observada.

**Retroalimentación.** E-EQUI: desplegar fichas individuales. E-AIS: separar resultado desconocido y posibilidades comparables. E-PEQ: conservar varias series sin exigir que copien el inventario.

### Idea 2. Contar el resultado completo

**Pregunta que responde.** ¿Cómo cuento posibilidades cuando un resultado tiene varias partes?

**Aprendizaje.** El alumno elige una representación consistente, decide si importa el orden y cuenta sin omitir ni duplicar.

**Objeto de la primera pantalla.** Un puesto escolar prepara credenciales con casillas para un sello de color y otro con figura. Se ven los sellos disponibles y credenciales terminadas. La tabla aparece después de reconocer el resultado completo.

**Lee, cuatro tarjetas.**

1. «Una credencial terminada contiene las dos casillas. Un sello suelto todavía no es el resultado completo».
2. «El inventario indica qué sellos pueden ir en cada casilla. El orden de las casillas está fijado por el soporte».
3. «Dos credenciales son diferentes si cambia al menos una casilla. Repetir la misma pareja no crea otra posibilidad».
4. «En el modelo de selección posterior, cada credencial completa del catálogo tendrá la misma oportunidad. Esa condición se declara antes de calcular probabilidades».

**Juega.** El alumno arma el catálogo de credenciales y elimina duplicados. La misión exige cada combinación válida exactamente una vez. Después cambia una restricción y debe retirar las credenciales inválidas. Se comprueba cobertura del catálogo, sin puntuar velocidad.

**Predice.** «En otro experimento se lanzan un dado rojo y uno azul, ambos ideales; el modelo da la misma probabilidad a cada pareja ordenada. ¿Cómo se compara obtener suma tres con obtener suma dos?»

| Opción | Contenido | Clave y error |
|---|---|---|
| A | La suma tres tiene mayor probabilidad porque puede formarse con más parejas | Correcta: se cuentan resultados completos |
| B | Son igual de probables porque cada una es una suma posible | Incorrecta; E-EQUI |
| C | Son igual de probables porque intercambiar los dados nunca cambia un resultado | Incorrecta; H-ORD |
| D | No podemos comparar hasta lanzar los dados y ver qué ocurre | Incorrecta; E-AIS |

**Mira.** Las parejas de dados ocupan una tabla: rojo en filas, azul en columnas. Se agrupan casillas por suma sin ocultar las parejas. La suma resume resultados elementales; sus categorías no se vuelven equiprobables por ser números.

**La regla, completa.** El principio multiplicativo cuenta procesos por etapas: si cada elección inicial permite el mismo número de opciones siguientes, se multiplican los conteos de opciones. Si el número de continuaciones depende de lo elegido, se enumeran o suman por ramas, sin multiplicar cantidades que no representan un mismo caso. Un árbol de conteo organiza estas ramas; por ahora sus rótulos son cantidades, no probabilidades condicionadas.

Se llama $N$, «ene mayúscula», al número de objetos disponibles distintos y $n$, «ene minúscula», al número de selecciones o posiciones del experimento. Con repetición permitida y $N$ opciones en cada posición, hay $N^n$ secuencias. Sin repetición y con orden, hay $N(N-1)\cdots(N-n+1)=N!/(N-n)!$, para $0\leq n\leq N$. El signo de admiración indica factorial: producto de enteros positivos hasta el indicado, y $0!=1$.

Si solo importa qué objetos se eligen y no su orden, cada grupo de $n$ objetos distintos se contó $n!$ veces en la ordenación anterior. Por eso el número de selecciones es $\binom{N}{n}=N!/[n!(N-n)!]$, leído «combinaciones de ene mayúscula tomadas de ene minúscula». Las fórmulas están disponibles; se exige decidir cuál representa el experimento.

En una probabilidad por conteo, el numerador y el denominador deben usar el mismo tipo de resultado. Se pueden contar secuencias en ambos o grupos en ambos cuando sus probabilidades sean uniformes; no secuencias favorables sobre grupos totales. Si un enunciado reparte personas en grupos, se debe fijar si los grupos están identificados por mesa o son indistinguibles. Contarlos con etiquetas es válido si tanto favorables como totales usan esas mismas etiquetas y cada reparto admisible tiene el mismo peso.

**Palabras nuevas.**

- **Secuencia:** resultado en que la posición tiene significado. Ejemplos: primer y segundo sello; dado rojo y dado azul; orden de salida de fichas.
- **Combinación:** selección en que importa quién está y no en qué orden se anotó. Ejemplos: equipo sin cargos; pareja de piezas para inspección simultánea; conjunto de cuadernos elegidos.
- **Factorial:** forma corta de escribir un producto descendente de enteros. Ejemplos: ordenar tres fichas distintas; contar posiciones para cuatro personas; quitar órdenes repetidos de una selección.
- **Repetición:** permiso para volver a usar un objeto o una opción. Ejemplos: usar de nuevo un sello; permitir la misma cifra en dos posiciones; devolver una ficha antes de seleccionar otra.

**Así se resuelve.** El ejemplo selecciona objetos con una composición requerida. Define qué distingue dos resultados; decide si importan orden y repetición. Cuenta total y favorables con el mismo criterio, forma el cociente y contrasta una versión pequeña por enumeración. La extensión reparte en grupos identificados y actualiza el inventario tras cada grupo.

**Ahora tú.** Orden progresivo: completar parejas; detectar duplicados; contar secuencias repetibles; seleccionar sin repetición; distinguir ordenación y combinación; imponer composición; agrupar parejas de dados. En admisión, repartir en grupos restringidos y comparar soluciones que deben conservar los mismos pesos.

**Retroalimentación.** Para H-ORD, contrastar dos órdenes de una misma selección y decidir si el registro los distingue. Si falla la enumeración, reducir el inventario conservando la estructura.

### Idea 3. «O», «y» y «no» seleccionan grupos distintos

**Pregunta que responde.** ¿Qué resultados cumplen una condición compuesta?

**Aprendizaje.** El alumno construye unión, intersección y complemento, y evita contar dos veces una coincidencia.

**Objeto de la primera pantalla.** Un panel de biblioteca muestra tarjetas ficticias de personas con sus actividades. Cada tarjeta tiene un identificador único. El universo permanece fijo mientras cambian los filtros; el diagrama viene después.

**Lee, tres tarjetas.**

1. «La biblioteca prepara materiales para sus actividades. Una tarjeta representa a una persona, aunque tenga varias etiquetas».
2. «El pedido puede incluir a quienes cumplen una condición, dos condiciones o ninguna de ellas».
3. «El aviso precisa quién recibe el material. Cada persona tiene una tarjeta única que permite revisar la entrega».

**Juega.** Con turnos excluyentes de mañana y tarde, el alumno selecciona tarjetas que cumplen el pedido, incluido un pedido negativo. La misión verifica identificadores exactos. Las actividades superpuestas se reservan para la predicción.

**Predice.** «Ahora algunas personas se inscribieron en lectura, otras en dibujo y algunas en ambas. Cada persona debe recibir un solo folleto si participa en lectura o dibujo, incluidas quienes participan en ambas. ¿Qué selección cumple el pedido?»

| Opción | Contenido | Clave y error |
|---|---|---|
| A | Una vez cada persona que tenga al menos una de las dos etiquetas | Correcta: incluye la coincidencia una sola vez |
| B | Una copia de su tarjeta por cada actividad, aunque la misma persona aparezca dos veces | Incorrecta; H-DUP |
| C | Solo quienes tengan las dos etiquetas | Incorrecta; H-Y |
| D | Solo quienes tengan una etiqueta y no la otra | Incorrecta; H-OEX |

**Mira.** Las tarjetas con ambas etiquetas ocupan la zona compartida, sin duplicarse. Los contadores por actividad las incluyen en ambos listados; el contador de personas las cuenta una vez. Los bordes se convierten luego en un diagrama de Venn.

**La regla, completa.** Se mantiene $A$ como suceso que se evalúa y se introduce $B$, «be mayúscula», como otro suceso que puede aportar una condición. $A\cup B$, «a unión be», ocurre si se cumple al menos uno, incluyendo ambos. $A\cap B$, «a intersección be», ocurre si se cumplen ambos. $A^c$, «complemento de a», ocurre si no se cumple $A$ dentro del mismo espacio muestral.

Las relaciones son $P(A^c)=1-P(A)$ y $P(A\cup B)=P(A)+P(B)-P(A\cap B)$. La resta corrige la coincidencia contada dos veces. Si $A\cap B=\varnothing$, los sucesos son incompatibles o mutuamente excluyentes y se obtiene $P(A\cup B)=P(A)+P(B)$. La exclusión describe la imposibilidad de ocurrir juntos en ese experimento; aún no significa independencia.

«Exactamente uno de A y B» reúne dos regiones: solo A y solo B. Su probabilidad es $P(A)+P(B)-2P(A\cap B)$. «Ninguno» es el complemento de la unión. «Al menos uno» equivale a uno menos la probabilidad de ninguno; esta forma puede ahorrar conteo, pero se usa por equivalencia de sucesos, no por una palabra clave memorizada.

El suceso «A y no B» tiene probabilidad $P(A)-P(A\cap B)$. La intersección no puede tener probabilidad mayor que cualquiera de los sucesos que la contienen. La unión no puede tener probabilidad menor que cada uno de sus componentes ni mayor que uno. Estos límites sirven para detectar resultados imposibles antes de terminar las operaciones.

**Palabras nuevas.**

- **Unión:** reunir lo que cumple alguna de las condiciones. Ejemplos: lectura o dibujo; ficha roja o numeración par; pieza grande o marcada.
- **Intersección:** parte que cumple las dos condiciones a la vez. Ejemplos: lectura y dibujo; ficha roja y par; pieza grande y marcada.
- **Complemento:** lo que queda cuando se retira un suceso del conjunto completo. Ejemplos: no asistir a lectura; no obtener una ficha marcada; no seleccionar una pieza del tipo pedido.
- **Incompatible:** dos condiciones que no pueden ocurrir juntas en el experimento definido. Ejemplos: una única ficha simultáneamente roja y azul si cada una tiene un solo color; una persona en dos turnos si la inscripción prohíbe duplicidad; un dado mostrando dos números distintos en un mismo lanzamiento.

**Así se resuelve.** El ejemplo entrega total, conteos de A, de B y de ambas. Ubica primero la coincidencia; completa solo A, solo B y ninguna. Comprueba conteos no negativos y suma total. Selecciona la región pedida, obtiene su proporción y contrasta con la identidad algebraica. El equipo verifica previamente que los datos sean compatibles.

**Ahora tú.** Orden progresivo: seleccionar por texto; construir complementos; distinguir al menos y exactamente; calcular unión disjunta; corregir coincidencias; completar cuatro regiones; recuperar una probabilidad faltante. En admisión, combinar relaciones algebraicas y detectar datos incompatibles.

**Retroalimentación.** Para H-DUP, separar contador de personas y participaciones. Para H-OEX, comparar pedidos de al menos una y exactamente una con las mismas tarjetas.

### Idea 4. La información cambia el grupo de referencia

**Pregunta que responde.** ¿Entre quiénes calculo la probabilidad cuando ya sé algo del resultado?

**Aprendizaje.** El alumno interpreta «dado que» como restricción y distingue probabilidad conjunta, condicionada e inversa.

**Objeto de la primera pantalla.** Una caja de biblioteca contiene tarjetas ficticias con dos etiquetas: asistencia al taller y llegada en bicicleta. Se selecciona una uniformemente y se revela información verdadera antes de mostrarla completa.

**Lee, cuatro tarjetas.**

1. «La tarjeta ya fue seleccionada. Antes de mostrarla por completo, se revela una característica».
2. «La información permite descartar tarjetas que no coinciden con ella. No cambia lo que hizo la persona».
3. «Dos preguntas pueden mencionar las mismas etiquetas y pedir cosas diferentes. La frase indica qué información se conoce».
4. «La misma tarjeta puede pertenecer a los dos grupos. Los tamaños de esos grupos no tienen por qué coincidir».

**Juega.** Revelada una condición, el alumno retira las tarjetas incompatibles y marca las restantes que cumplen el objetivo. La misión verifica los identificadores conservados y marcados. Todavía no se calcula ni se elige un denominador.

**Predice.** «Se sabe que la persona seleccionada llegó en bicicleta. Se pregunta la probabilidad de que haya asistido al taller. ¿Con qué grupo debe compararse la cantidad de personas que hicieron ambas cosas?»

| Opción | Contenido | Clave y error |
|---|---|---|
| A | Con todas las personas que llegaron en bicicleta | Correcta: ese es el grupo que sigue siendo posible |
| B | Con todas las personas del registro original | Incorrecta; E-CON |
| C | Con todas las personas que asistieron al taller | Incorrecta; E-INV |
| D | Con ninguna: como la llegada ocurrió antes, la información no sirve para revisar una probabilidad | Incorrecta; E-TIEM |

**Mira.** Se enmarca el total de bicicletas y se destaca dentro la asistencia. Sobre la misma tabla se comparan tres preguntas: ambas entre todos, asistencia entre bicicletas y bicicletas entre asistentes. La coincidencia permanece; cambia el grupo que constituye el total.

**La regla, completa.** $P(A\mid B)$ se lee «probabilidad de a dado be». La barra vertical significa que se sabe que ocurrió B; no es una división de letras ni significa «A después de B». Si $P(B)>0$, entonces $P(A\mid B)=P(A\cap B)/P(B)$. En un registro finito seleccionado uniformemente, puede calcularse como número de elementos de $A\cap B$ dividido entre número de elementos de B.

La conjunta $P(A\cap B)$ se refiere al espacio original. La condicionada $P(A\mid B)$ usa como referencia el suceso conocido. En general, $P(A\mid B)$ no es igual a $P(B\mid A)$, porque sus denominadores son distintos. Para invertir la condición hace falta conservar la información sobre los tamaños o probabilidades de los grupos.

Si $P(B)=0$, el cociente elemental no define esta probabilidad condicionada. La unidad no introduce teoría de condicionamiento para sucesos de probabilidad cero. Tampoco supone que recibir una información sea lo mismo que cambiar el mecanismo de selección. «Seleccionar una persona del grupo B uniformemente» y «seleccionar de todos uniformemente y saber que pertenece a B» coinciden en los modelos finitos aquí usados; con otros mecanismos hay que comprobar los pesos.

Al condicionar, las probabilidades posibles vuelven a sumar uno. El total lo determina la frase, no la posición de una fila o columna.

Una condición puede informar sobre un hecho anterior. No modifica el pasado; modifica el conjunto de posibilidades compatible con lo conocido. Asimismo, una probabilidad condicionada diferente no demuestra causalidad. En el registro de bicicletas y asistencia no se puede afirmar que usar bicicleta cause asistir al taller.

**Palabras nuevas.**

- **Condición:** información que limita los casos que siguen en consideración. Ejemplos: se sabe que llegó en bicicleta; se conoce que la ficha es azul; se informa que la pieza pertenece a un lote.
- **Probabilidad conjunta:** posibilidad de que se cumplan dos condiciones dentro del total original. Ejemplos: bicicleta y asistencia; ficha azul y par; pieza de un lote y marcada.
- **Grupo de referencia:** conjunto que funciona como total de la comparación. Ejemplos: todo el registro; solo quienes llegaron en bicicleta; solo quienes asistieron.
- **Condicional inversa:** pregunta que intercambia qué se sabe y qué se quiere averiguar. Ejemplos: asistencia dado bicicleta frente a bicicleta dado asistencia; marca dado lote frente a lote dado marca; color dado número frente a número dado color.

**Así se resuelve.** El ejemplo presenta una tabla con totales. Subraya la información conocida, encierra su grupo e identifica la coincidencia con lo preguntado. Divide por el total condicionado, comprueba el intervalo permitido y responde «entre quienes…». Repite con la pregunta inversa; evita datos que igualen accidentalmente los denominadores.

**Ahora tú.** Orden progresivo: elegir el total sin calcular; completar una tabla; calcular por conteos; distinguir conjunta y condicionada; invertir la pregunta; trabajar con probabilidades; reconstruir casillas. En admisión, combinar relaciones de sucesos y reconocer información insuficiente, sin necesitar todavía Bayes.

**Retroalimentación.** Se conserva la frase del alumno junto al denominador elegido. El apoyo señala si nombran conjuntos distintos, en lugar de limitarse a señalar un error de división.

### Idea 5. El siguiente paso puede depender del anterior

**Pregunta que responde.** ¿Cuándo puedo multiplicar probabilidades simples y cuándo debo actualizar la situación?

**Aprendizaje.** El alumno distingue dependencia, independencia y exclusión, y justifica modelos de selección repetida.

**Objeto de la primera pantalla.** Una caja de fichas representa un lote de inspección escolar. Algunas tienen una marca al dorso. Una bandeja permite ver si la ficha vuelve a la caja o permanece fuera; el lote es ficticio.

**Lee, cuatro tarjetas.**

1. «Después de observar una ficha, el encargado puede devolverla o dejarla fuera. El procedimiento indica cuál acción corresponde».
2. «El inventario de la caja se conserva a la vista. Cada extracción registra qué queda disponible».
3. «Un ensayo es una repetición de la acción definida. Las condiciones de un ensayo pueden cambiar cuando la caja cambia».
4. «Que dos resultados no ocurran juntos es una afirmación diferente de que conocer uno no cambie la posibilidad del otro».

**Juega.** En el modo con devolución y nueva mezcla, el alumno reconstruye el inventario después de cada extracción. La misión exige estados correctos. El modo sin devolución se reserva para la predicción; la cantidad de marcas obtenidas no afecta la aprobación.

**Predice.** «La caja contiene varias fichas marcadas y varias sin marca. Se extrae una marcada y esta vez se deja fuera. Al seleccionar uniformemente entre las restantes, ¿cómo cambia la probabilidad de obtener una marcada en el siguiente paso?»

| Opción | Contenido | Clave y error |
|---|---|---|
| A | Disminuye: hay que comparar el nuevo número de marcadas con el nuevo total | Correcta: se actualizan numerador y denominador |
| B | No cambia nunca, porque cada extracción es “al azar” | Incorrecta; H-REPON |
| C | La siguiente tiene que ser sin marca para compensar la anterior | Incorrecta; S-RACHA |
| D | No se puede comparar ninguna probabilidad hasta conocer la siguiente ficha | Incorrecta; E-AIS |

**Mira.** La ficha marcada queda fuera. Se muestran el total y las marcadas antes y después y se comparan proporciones con barras de igual ancho. Se distingue probabilidad menor de imposibilidad: todavía quedan fichas marcadas.

**La regla, completa.** La regla general para dos sucesos es $P(A\cap B)=P(B)P(A\mid B)$ cuando $P(B)>0$. También puede escribirse $P(A)P(B\mid A)$ cuando $P(A)>0$. Se deriva de la definición de probabilidad condicionada. Para varias etapas se multiplica la probabilidad del primer paso por la de cada paso siguiente condicionada a lo que ya ocurrió. Las probabilidades de las alternativas que salen de un mismo estado deben sumar uno.

A y B son independientes si $P(A\cap B)=P(A)P(B)$. Cuando las condiciones tienen probabilidad positiva, esto equivale a que conocer una no cambie la probabilidad de la otra. Ser incompatibles significa $A\cap B=\varnothing$. Si ambos tienen probabilidad positiva y son incompatibles, no son independientes: saber que uno ocurrió hace imposible el otro.

La devolución, mezcla y selección uniforme permiten en el modelo de la caja mantener las probabilidades entre ensayos. La devolución por sí sola no prueba independencia de cualquier fenómeno real: un mecanismo defectuoso podría introducir dependencia. Sin devolución, la composición debe actualizarse. En varios ensayos, no basta una independencia solo por parejas para justificar todos los productos; el modelo binomial requiere independencia de los ensayos en conjunto.

Se llama $p$, «pe», a la probabilidad del suceso objetivo A en cada ensayo de un modelo con probabilidad constante. Se llama $q$, «cu», a la probabilidad contraria, de modo que $q=1-p$. En $n$ ensayos independientes, una secuencia específica con $k$, «ka», ocurrencias de A y $n-k$ no ocurrencias tiene probabilidad $p^kq^{n-k}$. Hay $\binom{n}{k}$ posiciones posibles para esas $k$ ocurrencias. Por eso, si $X$, «equis mayúscula», cuenta cuántas veces ocurre A, entonces $P(X=k)=\binom{n}{k}p^kq^{n-k}$.

Esta es la distribución binomial. Requiere número fijo de ensayos, dos categorías complementarias, probabilidad constante e independencia. «Éxito» significa cumplir el suceso elegido, no algo deseable. Para «al menos uno» se puede usar $1-q^n$; para otros intervalos se suman los valores de $k$ pertinentes. En un mecanismo que solo se detiene al aparecer una marca, el número de ensayos no está fijado y esta fórmula no responde directamente a todas las preguntas.

Para selección uniforme de $n$ objetos sin devolución de un lote de $N$ objetos distintos, con $K$, «ka mayúscula», que cumplen A, el conteo de exactamente $k$ favorables da
$P(X=k)=\binom{K}{k}\binom{N-K}{n-k}/\binom{N}{n}$.
Solo se permiten enteros con $0\leq n\leq N$, $0\leq k\leq K$ y $0\leq n-k\leq N-K$. La fórmula surge de seleccionar favorables y no favorables, no de fingir probabilidad constante. Puede ofrecerse como extensión de conteo; no se exigirá memorizar su nombre.

**Palabras nuevas.**

- **Reposición:** devolver lo seleccionado antes de seguir. Ejemplos: regresar una ficha; volver a colocar una tarjeta; restablecer el inventario inicial.
- **Independencia:** conocer un resultado no cambia la probabilidad del otro en el modelo. Ejemplos: ensayos reiniciados de un mecanismo ideal; dos selecciones uniformes separadas con protocolo declarado; sucesos de una tabla cuyo producto verifica la condición.
- **Ensayo:** una repetición completa de la acción definida. Ejemplos: sacar y registrar una ficha; lanzar una moneda ideal; inspeccionar una pieza elegida bajo un protocolo.
- **Binomial:** modelo que cuenta ocurrencias en un número fijo de ensayos con las condiciones indicadas. Ejemplos: marcas en extracciones con reposición; caras en lanzamientos ideales independientes; aciertos en pruebas simuladas con probabilidad constante declarada.

**Así se resuelve.** El ejemplo compara devolución y no devolución sobre el mismo inventario. Escribe cada probabilidad sobre el estado correspondiente. Multiplica para un orden; suma caminos excluyentes para varios. Después agrupa caminos equivalentes para deducir la binomial y contrasta con selección sin devolución. Comprueba que cada fórmula respete el protocolo.

**Ahora tú.** Orden progresivo: actualizar inventarios; distinguir exclusión e independencia; calcular dos extracciones; comparar reposición; reunir varios órdenes; usar complemento. En admisión, justificar binomial, contar selecciones sin devolución, verificar independencia en una tabla y resolver restricciones de composición.

**Retroalimentación.** H-UNICA: desplegar los órdenes omitidos. E-EXC: mostrar que conocer un suceso positivo incompatible elimina al otro. No asociar automáticamente la palabra «y» con producto de probabilidades simples.

### Idea 6. Reunir caminos y revisar la procedencia

**Pregunta que responde.** ¿Cómo combino grupos diferentes y qué puedo inferir cuando observo un resultado?

**Aprendizaje.** El alumno pondera por el tamaño o la probabilidad de cada procedencia y distingue recorrido directo de inferencia inversa.

**Objeto de la primera pantalla.** Un almacén escolar recibe cuadernos de dos lotes, con etiquetas de procedencia y marcas de revisión. Se ve el almacén antes de la tabla. El protocolo indica si se elige del total o primero se sortea una caja.

**Lee, cuatro tarjetas.**

1. «Dos lotes pueden aportar cantidades distintas de cuadernos. Una proporción dentro de un lote no describe por sí sola todo el almacén».
2. «La etiqueta registra de dónde procede cada cuaderno. La marca de revisión es otra característica».
3. «En esta escena se elige uniformemente un cuaderno del conjunto completo. Las cajas no se eligen con un sorteo separado».
4. «Después de observar una marca, la pregunta puede pasar de “qué marca tiene” a “de dónde pudo venir”».

**Juega.** El alumno clasifica cuadernos por procedencia y marca, reconstruye la tabla y selecciona todos los caminos que producen un marcado. La misión verifica inventario completo y ausencia de duplicados. La inferencia desde una marca hacia el origen aún no aparece.

**Predice.** «El lote uno aporta más cuadernos que el lote dos, y ambos tienen exactamente la misma proporción de cuadernos marcados. Se eligió uniformemente entre todos y el cuaderno observado está marcado. ¿Qué afirmación sobre su procedencia es correcta?»

| Opción | Contenido | Clave y error |
|---|---|---|
| A | Sigue siendo más probable que proceda del lote uno | Correcta: las proporciones iguales conservan la ventaja del lote mayor |
| B | Ambos lotes quedan necesariamente con probabilidad de una mitad porque hay dos procedencias | Incorrecta; E-BASE y E-EQUI |
| C | La probabilidad de venir del lote uno es directamente su porcentaje interno de cuadernos marcados | Incorrecta; E-INV |
| D | Es imposible asignar probabilidades al origen porque la selección ya ocurrió | Incorrecta; E-TIEM |

El equipo debe elegir una proporción interna estrictamente entre cero y uno y tamaños compatibles con conteos enteros. Además evitará que esa proporción coincida accidentalmente con la probabilidad correcta de procedencia, para que la opción C sea inequívocamente falsa.

**Mira.** Se atenúan los cuadernos sin marca y se enmarca el total restante. El lote mayor aporta más marcados al tener la misma proporción interna. Después se presenta otro caso con tasas distintas: el tamaño solo tampoco determina la respuesta.

**La regla, completa.** Se llaman $H_1,H_2,\ldots,H_m$, «hache sub uno, hache sub dos, hasta hache sub eme», a las procedencias que dividen el espacio muestral. Deben ser mutuamente excluyentes y cubrir todas las posibilidades. La letra $m$ es el número de procedencias; $i$ es el índice que señala una de ellas. En las fórmulas siguientes se usan grupos con probabilidad positiva.

La probabilidad total del suceso A se obtiene sumando caminos:
$P(A)=\sum_{i=1}^{m}P(H_i)P(A\mid H_i)$.
El símbolo $\sum$ se lee «sumar los términos indicados». Cada producto es la probabilidad de una procedencia y el resultado A dentro de ella. Las procedencias no reciben peso igual salvo que el mecanismo realmente las haga equiprobables. La expresión es un promedio ponderado de probabilidades internas, con pesos que suman uno.

Si se observa A y $P(A)>0$, la probabilidad de una procedencia es
$P(H_i\mid A)=P(H_i)P(A\mid H_i)/P(A)$.
Sustituir el denominador por la suma anterior da la fórmula de Bayes. Se deriva de la probabilidad condicionada: se toma el camino que cumple origen y observación y se divide entre todos los caminos que producen la observación. No es una regla nueva sin conexión con lo aprendido.

Si todas las procedencias tienen la misma probabilidad interna de A, positiva, observar A no cambia las probabilidades relativas de procedencia. Si difieren, se necesitan tanto los pesos iniciales como las tasas internas. Una tasa de marca alta en un grupo pequeño no implica automáticamente que la mayoría de marcados venga de él. Tampoco una procedencia probable se convierte en una certeza sobre el cuaderno concreto.

Si primero se elige una caja con probabilidades iguales y luego un cuaderno uniformemente dentro de ella, $P(H_i)$ viene del sorteo de cajas, no necesariamente del número de cuadernos. Si se selecciona directamente del total, el peso de cada lote es su tamaño dividido entre el total. Dos procedimientos sobre las mismas cajas pueden dar respuestas distintas; el texto debe fijar cuál se usa.

En transferencias entre recipientes se identifican los resultados posibles del traslado inicial. Para cada uno se actualiza el inventario receptor y se calcula la probabilidad final condicionada a ese traslado. Luego se pondera y suma. No se reemplaza siempre una transferencia aleatoria por una «ficha promedio»: aunque algunas expresiones lineales permitan ese cálculo, el procedimiento de caminos es el que conserva explícitamente el modelo y se generaliza con control.

**Palabras nuevas.**

- **Procedencia:** grupo del que viene el resultado seleccionado. Ejemplos: lote de cuadernos; caja original de una ficha; turno en que se produjo una pieza.
- **Peso:** importancia de cada grupo según el mecanismo de selección. Ejemplos: proporción de cuadernos de un lote; probabilidad de elegir una caja; fracción del registro perteneciente a un turno.
- **Probabilidad total:** resultado de reunir todos los caminos que pueden producir el suceso. Ejemplos: marca desde cualquiera de dos lotes; ficha azul después de distintas transferencias; pieza señalada de diferentes turnos.
- **Probabilidad posterior:** evaluación actualizada al conocer una observación. Ejemplos: origen dado que hay marca; caja original dado un color; turno dado un tipo de etiqueta.

**Así se resuelve.** El ejemplo da tamaños y tasas de dos lotes. Identifica el mecanismo de selección y construye una tabla. Calcula el aporte de cada procedencia y suma. Para inferir origen, restringe al resultado observado y compara el aporte del lote consultado con ese total. Contrasta pregunta directa e inversa y verifica que las probabilidades posteriores sumen uno.

**Ahora tú.** Orden progresivo: ponderar dos grupos; distinguir sorteo de cajas y objetos; completar árboles; calcular una transferencia; inferir origen. En admisión, usar tres procedencias, reconstruir pesos desconocidos y reconocer datos insuficientes, sin copiar inventarios oficiales.

**Retroalimentación.** E-BASE: mostrar objetos detrás de porcentajes. E-INV: comparar los totales de referencia. E-TIEM: conservar la historia y cambiar solo la información del observador.

### Condiciones comunes para las seis ideas

Los ejercicios ofrecen datos, fórmulas y condiciones; el alumno elige. «Predice» no muestra la regla nueva. Las misiones verifican inventarios y clasificaciones, nunca exigen una frecuencia exacta por suerte. No se descartan simulaciones para fabricar coincidencias.

El objeto acompaña tablas y árboles. Cada color tendrá forma o etiqueta; arrastrar tendrá alternativa por selección y botón. El apoyo revisa, en orden, resultado registrado, información conocida, grupo de referencia y operación. La práctica progresa de objeto a tabla y texto, con vista opcional del objeto. Las relaciones se contrastaron con [F12–F15, F21].

## 6. Tabla de letras y símbolos de la unidad

| Letra o símbolo | Significado fijado | Unidad o condición |
|---|---|---|
| $\Omega$ | Espacio muestral del experimento | Conjunto |
| $\omega$ | Resultado elemental | Elemento del espacio |
| $A$ | Suceso objetivo que se evalúa | Conjunto; su descripción se fija al comenzar cada ejercicio |
| $B$ | Segundo suceso, usado como condición cuando corresponda | Conjunto; no es una caja ni un número |
| $A^c$ | Suceso contrario o complemento de A | Conjunto dentro del mismo espacio |
| $P(A)$ | Probabilidad del suceso A | Sin unidad; entre cero y uno |
| $P(A\mid B)$ | Probabilidad de A con la información B | Sin unidad; en la fórmula elemental requiere $P(B)>0$ |
| $\cup$ | Unión: al menos uno | Operación con conjuntos |
| $\cap$ | Intersección: ambos | Operación con conjuntos |
| $\varnothing$ | Conjunto vacío | Suceso imposible |
| $\#A,\#\Omega$ | Número de resultados de un conjunto | Conteo; no es probabilidad |
| $N$ | Número de objetos distintos disponibles en un lote o catálogo | Conteo entero no negativo |
| $K$ | Número de esos objetos que cumplen A | Conteo entre cero y N |
| $n$ | Número de selecciones, posiciones o ensayos que componen el experimento | Conteo entero no negativo |
| $k$ | Número específico de ocurrencias de A que se consulta | Conteo compatible con n y, sin reposición, con el lote |
| $X$ | Variable que cuenta ocurrencias de A en el experimento | Conteo aleatorio |
| $p$ | Probabilidad de A en un ensayo del modelo de repetición constante | Sin unidad |
| $q$ | Probabilidad contraria en ese modelo, $1-p$ | Sin unidad |
| $R$ | Número de veces que se repite el experimento completo para registrar datos | Conteo positivo |
| $F_A$ | Número de repeticiones registradas en que ocurrió A | Conteo entre cero y R |
| $\widehat p$ | Frecuencia relativa usada como estimación | Sin unidad; no es automáticamente el p exacto |
| $!$ | Factorial del entero al que acompaña | Operación de conteo |
| $\binom{N}{n}$ | Número de selecciones sin orden de n objetos entre N distintos | Conteo |
| $H_i$ | Suceso de pertenecer a la procedencia i | Conjunto; no significa necesariamente una hipótesis causal |
| $i$ | Índice de procedencia | Entero entre uno y m |
| $m$ | Número de procedencias de la partición | Conteo positivo |
| $\sum$ | Suma de los términos señalados | Operación |
| $=,\leq,\geq,<,>$ | Igualdad y comparaciones de tamaño | Relaciones |

**Colisiones evitadas.** No usar P como permutación: P se reserva a probabilidad. Las combinaciones se escriben con el símbolo binomial, para no confundir C con una cara de moneda. Las caras se escriben en palabras. N es tamaño del lote, n es tamaño del experimento y R es cantidad de repeticiones completas; sus diferencias deben acompañarse de rótulos en pantalla. K y k no se intercambian. 

## 7. Otras formas de explicarla y sus riesgos

| Recurso | Ideas | Aporte | Riesgo y protección | Fuente |
|---|---|---|---|---|
| Inventario antes de extraer | 1, 5 | Conecta resultados y objetos restantes | Igualar oportunidades sin justificar; declarar protocolo | Diseño propio; conceptos [F12] |
| Catálogo de credenciales | 2 | Hace visible el resultado compuesto | Confundir catálogo con sorteo uniforme; describir selección | Propio |
| Tabla de dados distinguibles | 2 | Muestra parejas detrás de sumas | Memorizar tabla; variar la propiedad sin ocultar parejas | [F12]; adaptación propia |
| Tarjetas con identificador | 3 | Revela doble conteo | Convertir dos etiquetas en dos personas; conservar identidad | Propio |
| Marco sobre grupo condicionado | 4, 6 | Explica el denominador | Creer que cambia el pasado; mantener la historia | Propio, motivado por [F9] |
| Árbol de estados | 5, 6 | Multiplica en caminos y suma caminos excluyentes | Operar por cercanía visual; rotular cada estado | [F15] |
| Conteos antes de porcentajes | 4, 6 | Muestra objetos detrás de tasas | Confundir conteos ilustrativos con observados; rotularlos | Propuesta propia |
| Simulaciones conservadas | 1, 5 | Muestra variación entre series | Tomarlas como prueba exacta; no seleccionar series convenientes | [F16]; protocolo propio |
| Variar mecanismos | Todas | Evita identificar azar con equiprobabilidad | Sobrecarga; variar una condición cada vez | Motivación curricular [F10] |

Se distingue una realización aleatoria, un caso elegido y una enumeración completa. Solo la última organiza todos los resultados; una serie de sorteos ilustra variabilidad. En celular, cada número debe señalar objetos y cada color tener una alternativa por forma o etiqueta.

## 8. Datos del mundo, con fuente

| Dato comprobable | Fuente | Uso | Límite |
|---|---|---|---|
| Moneda de un sol de la circular 024-2012: diámetro 25,50 mm | BCRP, 2012 [F17] | Objeto peruano a escala plausible | El diámetro no prueba caras equiprobables |
| Moneda de un nuevo sol de alpaca: masa 7,32 g y diámetro 25,5 mm | BCRP, Museo Numismático [F18] | Separar propiedades físicas y supuestos probabilísticos | No extender a todas las emisiones |
| Pronóstico climático por categorías debajo, dentro y encima del rango normal | SENAMHI, IDESEP [F19] | Soporte real con incertidumbre probabilística | No equivale a porcentaje de días lluviosos ni probabilidad diaria |
| Papel A4 de 210 por 297 mm, en resmas de 500 hojas | Perú Compras, 2023 [F20] | Credenciales y lotes finitos creíbles | La selección uniforme requiere un procedimiento |

Fichas, asistentes, lotes y tasas de revisión son ficticios. No representan estadísticas de colegios o proveedores. Los futuros datos observados deberán conservar fuente, fecha, población y selección. Un ejemplo meteorológico debe respetar lugar, periodo y categoría; no convertir un pronóstico trimestral en lluvia de mañana.

## 9. Dudas y decisiones

**Evidencia.** No se confirmó la atribución oficial de los registros secundarios de San Marcos ni la frecuencia de ningún tipo. Los temarios históricos no se presentan como vigentes para toda convocatoria. Los estudios extranjeros no miden al público peruano; el análisis peruano de [F10] estudia documentos. De [F11] solo se leyó el resumen.

**Alcance.** Condición precede al producto; Bayes viene después. Combinatoria se reconstruye al necesitarse. Binomial y selección sin devolución explican conteos; se excluyen densidades continuas, esperanza de ganancias e inferencia formal.

**Decisiones del dueño.** Elegir si Bayes con tres procedencias y la selección sin reposición mediante combinaciones serán obligatorios o de profundización. La ruta básica alcanza dos procedencias, tablas y actualización de inventarios. Definir también el máximo de objetos visibles en celulares pequeños.

**Auditoría pedagógica.** La idea 1 usa proporciones; la 2 cuenta sin depender de independencia; la 3 combina sucesos; la 4 cambia la referencia; la 5 deriva productos y repetición; la 6 pondera caminos y revisa procedencias. Cada distractor tiene un código. Las predicciones reservan categorías desiguales, sumas de pares, superposición, denominador condicionado, ausencia de reposición y origen inferido.

**Producción posterior.** Recalcular los datos finales, comprobar consistencia de inventarios y pilotear distractores, especialmente los hipotéticos. Alternar la posición de la respuesta correcta sin alterar los códigos. Una opción elegida orienta ayuda, pero no diagnostica por sí sola. La devolución solo justifica independencia bajo el mecanismo declarado.

## 10. Fuentes

Las fuentes se usan para caracterizar contenidos, fundamentar errores o verificar relaciones y datos puntuales. Las escenas, tarjetas y progresiones de esta propuesta son originales. Las limitaciones de acceso y procedencia se explicitan.

- **[F1]** Universidad Nacional de Ingeniería, Oficina Central de Admisión. **2019**. *Solucionario del examen de admisión 2019-1*. Primera prueba, pregunta 17. Fuente institucional primaria. https://admision.uni.edu.pe/wp-content/uploads/2022/11/solucionario2019.pdf
- **[F2]** Universidad Nacional de Ingeniería, Oficina Central de Admisión. **2018**. *Solucionario del examen de admisión 2018-2*. Segunda prueba, Matemática parte 1, pregunta 2. https://admision.uni.edu.pe/wp-content/uploads/2022/11/solucionario20182.pdf
- **[F3]** Universidad Nacional de Ingeniería, Oficina Central de Admisión. **2015**. *Solucionario del examen de admisión 2015-1*. Incluye segundo examen parcial CEPREUNI 2015-1, pregunta 18, p. impresa 132. https://admision.uni.edu.pe/wp-content/uploads/2022/11/solucionario2015.pdf
- **[F4]** CEPREUNI. **2023**. *Ciclo básico, sílabo 2023-2*. Aritmética: conteo y probabilidad. https://www.cepre.uni.edu.pe/assets/archivos/comunicados/Syl_Bas_PS_2023-2.pdf
- **[F5]** Universidad Nacional Mayor de San Marcos. **2022**, convocatoria 2023-I. *Reglamento de admisión 2023-I*. Temario, p. 39, apartados 7.4–7.5. Copia institucional alojada por la Facultad de Medicina. https://medicina.unmsm.edu.pe/wp-content/uploads/2023/02/Reglamento-de-Admision-2023-I.pdf
- **[F6]** Academia Virtual. **Sin fecha editorial visible**. *Probabilidades (Aritmética): clases y preguntas de admisión*. Registros atribuidos a UNMSM 2026-I y 2027-I. Fuente secundaria: el primero se recuperó mediante texto indexado y el segundo en la página abierta; no se cotejaron cuadernillos oficiales. https://academiavirtual.pe/cursos/aritmetica/probabilidades
- **[F7]** Material atribuido a UNMSM, Centro Preuniversitario. **2020**. *Aritmética, ciclo 2020-I, semana 18*. Copia externa titulada *Manual de Aritmética y Probabilidad*. Solo se usa para identificar tipos de pregunta, sin adoptar sus datos como hechos reales. https://es.scribd.com/document/658785638/Aritmetica-Pre-San-Marcos-658-702
- **[F8]** Serrano, Luis; Batanero, Carmen; Ortiz, J. Jesús; Cañizares, M. Jesús. **1998**. *Heurísticas y sesgos en el razonamiento probabilístico de los estudiantes de secundaria*. Educación Matemática, 10(1), 7–25. Texto original consultado; autoría contrastada con la portada del PDF. https://funes.uniandes.edu.co/wp-content/uploads/tainacan-items/32454/1142161/Heuristicas1998Serrano.pdf
- **[F9]** Díaz, Carmen; Contreras, J. Miguel; Batanero, Carmen; Roa, Rafael. **2012**. *Evaluación de sesgos en el razonamiento sobre probabilidad condicional en futuros profesores de educación secundaria*. Bolema, 26(44), 1207–1225, según el PDF consultado. Texto original. https://www.ugr.es/~jmcontreras/pages/Investigacion/articulos/2012Bolema.pdf
- **[F10]** Cotrado, Bethzabe; Burgos, María; Beltrán-Pellicer, Pablo. **2022**. *Análisis ontosemiótico de los contenidos de probabilidad en los documentos curriculares de Perú*. Educación Matemática, 34(3), 97–131. DOI: 10.24844/EM3403.04. Texto original consultado. https://dialnet.unirioja.es/descarga/articulo/8879975.pdf
- **[F11]** Díaz Mejía, Henry Gustavo. **2025**. Tesis de maestría, Pontificia Universidad Católica del Perú. *La construcción de la noción de probabilidad condicional en estudiantes de quinto de secundaria con apoyo de software de simulación desde la teoría de situaciones didácticas*. Solo resumen consultado; no utilizado para atribuir errores ni resultados generales. https://alicia.concytec.gob.pe/vufind/Record/PUCP_a28d179a49141a6a2cad690eb709175c
- **[F12]** Illowsky, Barbara, y Dean, Susan; OpenStax. **2023**. *Introductory Statistics 2e*, sección 3.1, «Terminology». https://openstax.org/books/introductory-statistics-2e/pages/3-1-terminology
- **[F13]** Illowsky, Barbara, y Dean, Susan; OpenStax. **2023**. *Introductory Statistics 2e*, sección 3.2, «Independent and Mutually Exclusive Events». https://openstax.org/books/introductory-statistics-2e/pages/3-2-independent-and-mutually-exclusive-events
- **[F14]** Illowsky, Barbara, y Dean, Susan; OpenStax. **2023**. *Introductory Statistics 2e*, sección 3.3, «Two Basic Rules of Probability». https://openstax.org/books/introductory-statistics-2e/pages/3-3-two-basic-rules-of-probability
- **[F15]** Illowsky, Barbara, y Dean, Susan; OpenStax. **2023**. *Introductory Statistics 2e*, sección 3.5, «Tree and Venn Diagrams». https://openstax.org/books/introductory-statistics-2e/pages/3-5-tree-and-venn-diagrams
- **[F16]** Serrano, Luis; Batanero, Carmen; Ortiz, J. J.; Cañizares, M. Jesús. **2001**. *Concepciones de los alumnos de secundaria sobre modelos probabilísticos en las secuencias de resultados aleatorios*. Suma, 36, 23–32. https://www.ugr.es/~batanero/pages/ARTICULOS/Suma01.pdf
- **[F17]** Banco Central de Reserva del Perú. **2012**. *Circular N.º 024-2012-BCRP*. Especificación de moneda de un nuevo sol. Texto institucional indexado consultado; la apertura directa solo mostró un contenedor sin texto. https://www.bcrp.gob.pe/docs/Transparencia/Normas-Legales/Circulares/2012/circular-024-2012-bcrp.pdf
- **[F18]** Banco Central de Reserva del Perú. **Sin fecha confirmada**. *Museo Numismático del Perú*. Texto institucional indexado consultado. https://www.bcrp.gob.pe/docs/Proyeccion-Institucional/Museo/Museo-Numismatico-del-Peru.pdf
- **[F19]** SENAMHI. **Sin fecha visible**. *IDESEP: pronóstico climático*. Texto institucional indexado consultado; la apertura directa agotó el tiempo de respuesta. https://idesep.senamhi.gob.pe/portalidesep/idesep_tema_pronostico_climatico.jsp
- **[F20]** Central de Compras Públicas, Perú Compras. **2023**. *Relación de fichas tipo para las compras corporativas obligatorias, Decreto Supremo N.º 253-2023-EF*. Especificaciones de papel A4 y resmas. Texto institucional indexado consultado. https://www.gob.pe/institucion/perucompras/informes-publicaciones/4920647-relacion-de-fichas-tipo-para-las-compras-corporativas-obligatorias-decreto-supremo-n-253-2023-ef
- **[F21]** Illowsky, Barbara, y Dean, Susan; OpenStax. **2023**. *Introductory Statistics 2e*, sección 4.3, «Binomial Distribution». Contraste de condiciones del modelo binomial. https://openstax.org/books/introductory-statistics-2e/pages/4-3-binomial-distribution
