# Códigos de error de los generadores de razonamiento matemático (rutina rm-procesos, 8 nov 2026)

Los generadores `plantillas/rm-*` (formato «predicciones») arman sus alternativas incorrectas con errores con nombre. Los que ya tienen código en `aritmetica-razonamiento-ideas-erroneas.md` (AR1–AR22, RM1–RM6) usan ese código. Los demás salen de las trampas que se infirieron de los solucionarios de admisión de San Marcos (`docs/clasificacion/trampas-admision-unmsm/rm-a.md` y `rm-b.md`) y entran aquí como **hipótesis**: no hay dato de alumnos. Los datos del colegio dirán cuáles se eligen de verdad.

El id de cada alternativa es `<código>-<detalle>` (por ejemplo `RMP20-una-vuelta-menos`): el código agrupa el error y el detalle dice su cara en ese problema. Rangos: RMP1–RMP2 compartidos; RMP10–RMP79, un bloque de diez por grupo de generadores.

## Compartidos

| Código | Error | Trampa de origen |
| --- | --- | --- |
| RMP1 | Puntos contra intervalos (el error de la cerca): cortes por tramos, n tomas = n − 1 intervalos, estacas compartidas contadas dos veces, contar estados en vez de movimientos, contar la salida como encuentro | rm-a #3 |
| RMP2 | Quedarse con la primera solución o estrategia que funciona, sin minimizar ni maximizar | rm-a (sueltas: «primera solución diofántica sin minimizar») |

## Deducción lógica (`rm-deduccion`)

| Código | Error | Trampa de origen |
| --- | --- | --- |
| RMP70 | Leer el condicional como bicondicional | rm-a #25 |
| RMP71 | Usar la recíproca, negar las dos partes o negar «si p, q» como «ni p ni q» | negar mal un condicional |
| RMP72 | Quedarse con un reparto que cumple todas las pistas menos una | nueva |
| RMP73 | Leer «todos los A son B» o «algunos A no son B» al revés (conversión ilícita), en una premisa o en la conclusión | rm-a #25 |
| RMP74 | Poner «algunos» donde vale «ninguno», o leer «algunos» como «todos» o «ningún» | rm-a #25 |
| RMP75 | Leer «algunos son» como «solo algunos» | nueva |
| RMP76 | Encadenar por un término medio que no conecta (efecto atmósfera) | nueva |
| RMP77 | Elegir lo posible y no lo necesario | rm-a #16 |
| RMP78 | Creer que no se deduce nada cuando sí se deduce algo | nueva |
| RMP79 | Tomar la primera parte de un contrafáctico («si X fuera…») como un dato | hueco de admisión 2021 |

## Trasvases y movimientos (`rm-trasvases`, `rm-movimientos`)

| Código | Error | Trampa de origen |
| --- | --- | --- |
| RMP10 | Contar llenar y vaciar cuando no cuentan como trasvase, o no contarlos cuando sí | trasvases |
| RMP11 | Dar por lograda la meta a medias: la cantidad repartida entre dos recipientes, en otro recipiente o con huecos | trasvases |
| RMP12 | Quedarse con un barril que cumple la divisibilidad pero con el que no se arman los pedidos | rm-b sueltas («no comprobar que los barriles formen las parejas») |
| RMP13 | Dividir entre k y no entre k + 1, o aplicar la divisibilidad al barril que queda | barriles |
| RMP14 | Olvidar los viajes de regreso de la canoa, o contar uno de más al final | rm-a #19 |
| RMP15 | Pasar por alto una restricción: quien no rema cruza solo, los que se atacan quedan juntos, la casilla bloqueada, la boca cerrada | rm-a #19 |
| RMP16 | Dividir la distancia entre lo que avanza un salto, o mover el caballo como el rey | movimientos en tablero |
| RMP17 | Ir directo sin pasar por la casilla intermedia | caballo con casilla intermedia |
| RMP18 | Contar mal qué es un movimiento: las fichas, sacar y meter como uno, ida y vuelta | traslado de fichas |
| RMP19 | Olvidar los bordes del tablero o de la fila | movimientos en tablero |

## Certezas, cortes y balanzas (`rm-certezas`, `rm-cortes`, `rm-balanzas`)

El peor caso usa RM6 del informe (hipótesis allí).

| Código | Error | Trampa de origen |
| --- | --- | --- |
| RMP30 | Dejar fuera del peor caso lo que no sirve: los sin pareja, los que no son primos, el 1, los otros colores | rm-a #1, rm-b (certezas) |
| RMP31 | Armar mal el peor caso: tomar los mayores, un solo color, ignorar izquierdo y derecho, k por caja | huecos de certezas |
| RMP32 | Contar mal el conjunto: los múltiplos comunes dos veces, contar los que sí sirven | huecos de certezas |
| RMP33 | Contar mal las casillas del palomar: olvidar el 29 de febrero, las sumas de cifras con pocos casos | rm-a #2, huecos de certezas |
| RMP34 | El último paso: sin el + 1, con un + 1 de más, el último intento que ya se sabe | huecos de certezas |
| RMP35 | Cortar sin apilar ni superponer (pieza por pieza o por las líneas dibujadas) | rm-a #6, rm-b |
| RMP36 | Contar mal lo que permite el apilado: redondear el logaritmo, el logaritmo del total, ignorar el tope de capas | rm-a #6 |
| RMP37 | Tomar mal una medida que queda: los lados nuevos del corte, el promedio de los tramos, olvidar la hipotenusa | huecos de cortes |
| RMP38 | Plantear mal las balanzas: la desigualdad como igualdad, olvidar que son enteros, sustituir a medias, razón invertida | huecos de balanzas |
| RMP39 | Usar un solo platillo (sin restar pesas) | rm-a #13 |

## Rumbos, lecturas y relojes (`rm-rumbos`, `rm-lectura-palabras`, `rm-relojes`)

| Código | Error | Trampa de origen |
| --- | --- | --- |
| RMP40 | Medir el ángulo desde el eje o hacia el lado equivocado (E 37° N por N 37° E), o el 3-4-5 al revés | rm-b (rumbos: «eje equivocado») |
| RMP41 | Invertir el sentido: el rumbo desde el destino y no hacia él | rm-b (rumbos: «invertir la dirección») |
| RMP42 | Sumar largos sin dirección: los tramos, o las componentes sin restar las opuestas | rumbos |
| RMP43 | Usar Pitágoras con un ángulo que no es recto | rumbos |
| RMP44 | Confundir las 12 h del reloj con las 24 h del día (a. m. y p. m., 1440 min por 720) | rm-a #5 |
| RMP45 | Contar dos veces la lectura común o las simétricas | rm-b sueltas («la lectura común contada dos veces») |
| RMP46 | No restar la casilla tapada o las que faltan | lecturas |
| RMP47 | Olvidar el 29 de febrero o contar uno que no hay | rm-a #2, rm-b |
| RMP48 | Cambiar antes por después: lo que pasó por lo que falta, hace por dentro de, inicio por fin, ayer por mañana | rm-a #5 |
| RMP49 | Creerle al que miente ese día | relojes (mentirosos) |
| RMP81 | Multiplicar donde no va (como si fuera un triángulo, pasos multiplicados) | lecturas |
| RMP82 | Contar casillas en vez de caminos | lecturas |
| RMP83 | Sumar en vez de multiplicar dos tramos | rm-b («sumar en vez de multiplicar por tramos») |
| RMP84 | Contar solo una parte de las lecturas: hasta la fila ancha, un tramo, solo la ida | lecturas |
| RMP85 | Leer la parte decimal de una hora como minutos (14,4 h como 14 h 40 min) | relojes |

## Parentesco, arreglos y fichas (`rm-parentesco`, `rm-arreglos`, `rm-fichas`)

Usan también AR7 (linealidad: escalar el perímetro como el área, usar todas las fichas) y RM2 («objeto entero»), del informe, con respaldo parcial.

| Código | Error | Trampa de origen |
| --- | --- | --- |
| RMP60 | Leer la cadena de parentescos desde el inicio y no desde «mi …» | rm-a sueltas («leer la cadena desde el inicio») |
| RMP61 | Responder un paso intermedio: un eslabón de la cadena, la suma de una línea, el lado antes de dividir | rm-b (parentesco: «eslabón intermedio»; AR5 por analogía) |
| RMP62 | Contar cada rol como una persona distinta, o juntar a todas las personas de un sexo | rm-a sueltas («sumar los roles») |
| RMP63 | Ignorar o leer mal una condición: «único», una pista, las columnas o la diagonal, las casillas tapadas, el 1 como primo | varias |
| RMP64 | Cambiar la línea paterna por la materna, o adelante por atrás | parentesco, asientos |
| RMP65 | Tratar el cuadrado mágico multiplicativo como aditivo, o responder el exponente | rm-b sueltas («tratarlo como aditivo») |
| RMP66 | En el tablero de paridad: la mitad y la mitad, un solo color, o todos los pares juntos | hueco de paridad |
| RMP67 | Elegir el número más cercano en valor y no en posición | hueco de asientos |
| RMP68 | Sumar perímetros sin restar los lados en contacto (o restarlos una sola vez, o tomar la caja que encierra) | rm-b sueltas («sumar perímetros sin restar lados internos») |
| RMP69 | Dividir áreas o volúmenes sin ver el encaje, redondear hacia arriba, contar un hexágono como un triángulo | huecos de máximos y semejanza |
| RMP86 | Suponer que la sucesión de figuras crece de forma lineal (diferencia constante) | rm-b (inducción: «suponer crecimiento lineal») |

## Diagramas de flujo y ciclos (`rm-diagramas-flujo`, `rm-ciclos`)

| Código | Error | Trampa de origen |
| --- | --- | --- |
| RMP20 | El bucle corrido en una vuelta (una de menos o una de más), o las asignaciones en otro orden | rm-b «salir del bucle un paso antes o después» |
| RMP21 | El borde de la condición: > por ≥, < por ≤, o la rama equivocada en el borde | huecos de diagramas («evaluar mal la condición») |
| RMP22 | Imprimir o contar otra cosa: otra variable, todas las vueltas, la condición sobre n, un solo contador, los cocientes | huecos de diagramas |
| RMP23 | Saltarse un bloque: la suma de cifras final, el segundo descuento, el envío, la operación de afuera | huecos («olvidar sumar cifras», «un solo descuento») |
| RMP24 | Primalidad: tomar el 1 o cualquier impar como primo | huecos de diagramas («prueba de primo») |
| RMP25 | Leer mal un operador: otro paréntesis, conmutar los operandos, cruzar las reglas | operadores matemáticos |
| RMP26 | Ignorar el desfase del ciclo: contar desde el primero, olvidar el preperíodo, suponer que parten juntas | rm-b sueltas («el ciclo empieza en un elemento intermedio») |
| RMP27 | Leer mal el residuo: el residuo 0 como el primero, la que terminó, la siguiente, el bloque completo | rm-b sueltas («equivocar el residuo») |
| RMP28 | Recorrer al revés: sentido de giro, la espiral desde el otro lado, como si fuera una recta | huecos de ciclos («sentido del recorrido») |
| RMP29 | Avance y retroceso: dividir entre el avance neto sin ver el último tramo, o contar un día de más | huecos («dividir entre el avance neto») |

## Planteo y enteros (`rm-planteo`, `rm-diofanticas`)

| Código | Error | Trampa de origen |
| --- | --- | --- |
| RMP50 | Redondear al lado equivocado (paquetes, lotes, dinero) | rm-a sueltas («redondear hacia abajo un cociente de lotes») |
| RMP51 | Olvidar una condición o un dato: lo que ya hay, los votos en blanco, los mínimos por tipo, el cero que no vale, que sea exacto o entero, el sentido de la medida, el rango | varios huecos de planteo y máximos |
| RMP52 | Llevar mal la promoción o el canje: regalo sobre regalo, regalos sobre el total, un solo canje, botar los envases sobrantes, pedir prestado | huecos («contar obsequios sobre los obsequios», «sobre el total») |
| RMP53 | El borde cuenta: el empate tomado como victoria, partes iguales sin sumar uno, «no alcanza» leído como «alcanza justo» | huecos («repartir en partes iguales sin sumar uno») |
| RMP54 | Armar mal el escenario extremo de los votos: comparar con el segundo, olvidar al líder o darle votos, no descontar | huecos («comparar contra el segundo», «el líder también recibe») |
| RMP55 | En las fichas de dos caras, contar de más una cara que entra en varias sumas | fichas de dos caras |
| RMP56 | Igualar al promedio y no al mayor | huecos («igualar al promedio») |
| RMP57 | Combinar a medias las ecuaciones de la diana (suma, resta, promedio, coeficientes cambiados) | huecos («intentar hallar cada incógnita») |
| RMP58 | Jerarquía de operaciones: de izquierda a derecha, o las sumas primero | huecos («olvidar la jerarquía») |
| RMP59 | Puntos del empate mal contados (1 en total, o 0) | situaciones deportivas |
| RMP80 | Dar por posible uno más allá del óptimo sin comprobarlo (una moneda en dos grupos, un dardo menos) | máximos con existencias |
