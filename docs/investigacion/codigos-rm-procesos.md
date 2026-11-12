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

## Fichas: conteo con giros, tablero con fichas de 5 y la región de arcos (`rm-fichas`) (cierre-100, 12 nov 2026)

| Código | Error | Trampa de la que sale |
|---|---|---|
| RMP120-sin-giros | Contar la ficha solo como está dibujada, sin ponerla de lado | UNMSM 2025-II p. 25 (olvidar las orientaciones giradas) |
| RMP121-dividir-area | Dividir las casillas de la figura entre las de la ficha (fichas que no se tocan) en vez de contar todas las posiciones | UNMSM 2025-II p. 25 |
| RMP122-sin-voltear / RMP122-volteo-de-mas | Solo girar cuando también se puede voltear, o voltear cuando el enunciado solo permite girar | conteo de fichas quirales (L4, S4, P5) |
| RMP123-giro-repetido | Contar cada giro de 90° (y volteo) como posición nueva aunque la ficha quede igual | conteo con fichas simétricas (I3, T4, U5) |
| RMP124-caja-completa | Contar solo donde entra el rectángulo que encierra a la ficha, sin ver que entra también donde falta una casilla de ese rectángulo | conteo con fichas con huecos en su caja |
| RMP125-dividir-todo | Dividir las casillas de todo el tablero (con las tapadas) entre las de la ficha | UNMSM 2025-I p. 23 (49 ÷ 5 = 9) |
| RMP126-circulo-completo | Al rectángulo que encierra la figura restarle un círculo completo | UNMSM 2025-I p. 30 (restar círculos completos) |
| RMP127-sumar-sin-restar | Sumar la media luna de arriba sin quitar los dos huecos de abajo | UNMSM 2025-I p. 30 |
| RMP128-olvidar-la-luna | Quitar los dos huecos y olvidar la media luna que los rellena | UNMSM 2025-I p. 30 |
| RMP129-toda-la-caja | Tomar todo el rectángulo que encierra la figura | UNMSM 2025-I p. 30 |

Se reutilizan RMP63-sin-tapadas, RMP69-dividir, RMP69-redondeo y RMP2-voraz en el tablero de fichas de 5.

## Planteo: latas, fichas de dos caras, cometa y vasos (`rm-planteo`, cierre-100, 12 nov 2026)


| Código | Sufijos (error) | Trampa de la que sale |
|---|---|---|
| RMP130 | una-por-lata (un golpe por lata gris); solo-grises (no golpear latas sin pintar que derriban varias grises); solo-la-de-encima (la caída arrastra solo a la lata justo encima); por-filas (un golpe por fila con grises); uno-de-mas | UNMSM 2026-I (4 oct 2025, áreas D/E) p. 22: pirámide de latas, golpes mínimos |
| RMP131 | lata-doble-olvidada (ignorar la lata que faltó en las dos pirámides y se deduce con el puntaje); copiar-a-arturo (dar el puntaje de Arturo); union (sumar las caídas de ambos); comun-dos-veces | UNMSM 2026-I (11 oct 2025, área A) p. 28: dos pirámides numeradas que se completan |
| RMP132 | sumar-las-vistas (sumar los números pedidos en vez de sus opuestos); como-dado (opuestas suman siempre lo mismo); misma-tirada (opuesto = otro número del mismo lanzamiento); solo-dos-lanzamientos (pareja que sirve con dos tiradas y la tercera descarta) | UNMSM 2023-I p. 25: tres fichas de dos caras |
| RMP133 | solo-diagonales; medios-como-diagonales (cada pieza de puntos medios = una diagonal); dos-medias (solo dos de las cuatro piezas); todas-iguales; y, en la variante inversa, sin-duplicar, mitad-sin-restar, triple, otra-diagonal-mas-medias | UNMSM 2021 (4 sep 2021) p. 23: listón de una cometa |
| RMP134 | solo-alineadas (sin intercalar); desfase-sin-perder (todas las filas intercaladas con n vasos); dividir-areas (área bandeja ÷ área circular); cuadrados (área bandeja ÷ d²) | UNMSM 2021 (4 sep 2021) p. 25: vasos en una bandeja |

## Relojes con retraso y jornada; diagramas con impresos y bucles (`rm-relojes`, `rm-diagramas-flujo`, cierre-100, 12 nov 2026)

Todos en hipótesis (sin dato publicado). Columnas: código · id en el generador · error · de qué trampa sale.

| Código | Id en el generador | Error | Trampa de la pregunta oficial |
| --- | --- | --- | --- |
| RMP100 | RMP100-sin-retraso | Dar la hora en que empezó el examen y olvidar sumar el retraso (rm-relojes, tipo «retraso») | UNMSM 2019-II (10 mar 2019) p. 31: «olvidar sumar el retraso al inicio» |
| RMP101 | RMP101-razon-invertida | Tomar el tiempo de antes como q veces el de después (leer «la cuarta parte de» al revés) (rm-relojes, «retraso») | misma pregunta: la razón entre el tiempo transcurrido y el por transcurrir |
| RMP102 | RMP102-sin-duracion | Repartir todo el intervalo entre las partes sin quitar la duración del examen (rm-relojes, «retraso») | misma pregunta: 5x + 105 = 240, no 5x = 240 |
| RMP103 | RMP103-retraso-restado | Restar el retraso en vez de sumarlo (rm-relojes, «retraso») | misma pregunta |
| RMP104 | RMP104-falta-del-dia | Dar las horas que faltan para que termine el día (24 − t) cuando se pregunta por la jornada (rm-relojes, «jornada») | UNMSM 2024-II (10 mar 2024) p. 18: «responder la hora y no lo que falta» (da 3 en vez de 2) |
| RMP105 | RMP105-ya-trabajadas | Dar las horas ya trabajadas (t − S) en vez de las que faltan (rm-relojes, «jornada») | misma pregunta |
| RMP106 | RMP106-cuenta-lo-no-impreso | Sumar también los valores que salen de la división, que no se imprimen (rm-diagramas-flujo, «impresos») | UNMSM 2023-I (10 dic 2022) p. 29: suma de lo impreso |
| RMP107 | RMP107-sin-sumar-cifras | Quedarse con la suma de lo impreso (3330) sin sumar sus cifras (rm-diagramas-flujo, «impresos») | misma pregunta: la respuesta es la suma de cifras de la suma |
| RMP108 | RMP108-sale-sin-probar | Salir del bucle sin probar la última condición: «Fin» apenas N pasa de T, o imprimir K sin ver si es múltiplo (rm-diagramas-flujo, «impresos» y «bucles») | UNMSM 2026-I (4 oct 2025) p. 24: «salir del bucle antes de cumplir la condición» (951 en vez de 1832) |
| RMP109 | RMP109-cuenta-el-ingreso | Contar como impreso el número que se ingresa (rm-diagramas-flujo, «impresos») | UNMSM 2023-I p. 29 |

## Ids con código viejo, usados por los tipos nuevos (no son códigos nuevos)

- rm-diagramas-flujo, «impresos» y «bucles»: RMP20-una-vuelta-menos, RMP20-una-vuelta-mas, RMP20-flecha-de-vuelta (la flecha de N ← pK + q vuelve a K ← N ÷ 2 en vez de a K ← N − c), RMP20-variable (restar al K de antes en vez de al N), RMP21-borde, RMP22-imprime-N.
- rm-rumbos, «moviles-tramos» y «direccion»: RMP41-desde-el-destino (la trampa de UNMSM 2024-I p. 25: dar el rumbo del regreso, visto desde la tía y no desde la casa), RMP41-RMP40-al-reves-y-eje, RMP41-suma-de-posiciones, RMP41-tramo-invertido (un tramo tomado en sentido contrario), RMP40-eje, RMP40-345-al-reves, RMP42-suma-recorridos, RMP42-resta-recorridos, RMP42-sin-restar-opuestas, RMP42-suma-tramos, RMP43-angulo-recto, AR5-dato-intermedio (distancia de A o de B al punto de partida).
- rm-relojes, «retraso» y «jornada»: AR5-hora-de-fin, AR5-la-hora, AR5-duracion-del-turno, RMP48-pasado-por-falta, RMP44-am-pm.

Nota: RMP41-tramo-invertido y RMP41-suma-de-posiciones son ids nuevos dentro de la familia RMP41 (invertir el sentido); la sesión principal decide si les da fila propia en el informe.

## Certezas con color, cumpleaños con «ya», cajas que se abren y balanzas con peso combinado (`rm-certezas`, `rm-balanzas`, `rm-deduccion`, cierre-100, 12 nov 2026)

| Código | Error | Trampa de la que sale | Generador |
| --- | --- | --- | --- |
| RMP90-un-color | En el peor caso solo salen todos los de un color y el siguiente sirve (N + 1); se olvidan los números sin pareja del otro color | UNMSM 2023-I #28 | rm-certezas pareja-color |
| RMP91-una-copia | Contar como si hubiera un solo bolo de cada número (ignora la copia del otro color) | UNMSM 2023-I #28 | rm-certezas pareja-color |
| RMP92-sin-restar | Calcular el total de personas para el palomar y no restar las que ya hay | UNMSM 2024-II #21 | rm-certezas cumpleanos con ya |
| RMP93-sin-bisiesto-ya | Usar 365 fechas (olvidar el 29 de febrero) en el «cuántos más» | UNMSM 2024-II #21 | rm-certezas cumpleanos con ya |
| RMP94-sin-deducir-ultima | Abrir también la última caja rotulada «amarillo» (r + 1), sin deducirla | UNMSM 2025-II #30 | rm-certezas cajas-abrir |
| RMP95-deduce-de-mas | Creer que se deducen dos cajas a la vez (r − 1) | UNMSM 2025-II #30 | rm-certezas cajas-abrir |
| RMP96-una-por-color | Contar una caja por cada color distinto (c) | UNMSM 2025-II #30 | rm-certezas cajas-abrir |
| RMP97-casi-todas | Abrir casi todas las cajas (n − 1), sin ver que las de rótulo de color ya se saben | UNMSM 2025-II #30 | rm-certezas cajas-abrir |
| RMP98-sin-la-tercera | Resolver solo con las dos balanzas en equilibrio y tomar uno de los pesos que las cumplen, sin usar la desequilibrada | UNMSM 2024-I #20 | rm-balanzas combinado |
| RMP99-borde | Tomar el borde de la desigualdad de la balanza desequilibrada como igualdad | UNMSM 2024-I #20 | rm-balanzas combinado |

## Ids que cuelgan de códigos que ya existían (sin código nuevo)
- rm-balanzas combinado: RMP38-otra-combinacion (falta contar una figura pedida), RMP38-una-sola (cada figura una vez), RMP38-suma-pesas (suma las pesas de las balanzas). Son variantes del RMP38 (plantear mal las balanzas).
- rm-deduccion puntajes: RMP72-pista-sin-revisar (reparto o puntaje que sale al ignorar una pista), RMP72-dado-cruzado (puntaje de una persona con el dado de otra), RMP2-sin-maximizar (puntaje posible que no es el mayor). Variantes de RMP72 y RMP2.
- rm-certezas: RM6-favorable, RMP34-sin-mas-uno, RMP34-mas-uno reutilizados en los tipos nuevos.

## Bocas del tubo, lecturas dobles y en malla, tablero de triángulos y alambre (`rm-movimientos`, `rm-lectura-palabras`, `rm-cortes`, cierre-100, 12 nov 2026)

| Código | Error | Trampa de la que sale | Generador |
| --- | --- | --- | --- |
| RMP110 (`-fuera-de-lugar`) | Contar una operación por cada bolo que no está en su lugar; no ve que al subir un bolo a P los demás bajan un lugar. | rm-movimientos, bolos con bocas laterales (UNMSM 2024-I p. 26, 2025-II p. 21) | rm-movimientos, tipo `bocas` |
| RMP111 (`-bocas-libres`) | Suponer que se puede sacar el bolo de cualquier lugar, no solo del que está a la altura de una boca. | ídem (ignorar qué hace la boca) | rm-movimientos, `bocas` |
| RMP112 (`-sacar-e-introducir`) | Contar por separado sacar el bolo y meterlo por P (2n en vez de n). | ídem | rm-movimientos, `bocas` |
| RMP113 (`-un-caso`) | Leer una palabra que empieza con dos letras iguales solo con la primera L arriba y la segunda en la fila de abajo, y olvidar el comienzo con las dos L en la misma fila (vecinas horizontales). | rm-lectura-palabras, arreglo triangular con L repetida (UNMSM 2024-I p. 28) | rm-lectura-palabras, `doble` |
| RMP114 (`-una-L`) | Tratar el arreglo como un triángulo común con una sola L arriba (la mitad del caso anterior). | ídem | rm-lectura-palabras, `doble` |
| RMP115 (`-sin-volver`) | Contar solo las lecturas que no repiten casilla; olvidar que «ida y vuelta» por la misma letra cuenta. | rm-lectura-palabras, mallas LODO (UNMSM 2025-II p. 29) | rm-lectura-palabras, `malla` |
| RMP116 (`-una-salida`) | Contar las lecturas que salen de una letra inicial y multiplicarlas por el número de letras iniciales (las vecindades de borde y de centro difieren). | ídem | rm-lectura-palabras, `malla` |
| RMP117 (`-mitad`) | Pensar que cada corte separa solo dos triángulos (N ÷ 2), sin ver que lo apilado se corta junto. | rm-cortes, tablero hexagonal de triángulos con sierra corta (UNMSM 2024-II p. 23) | rm-cortes, `tablero` |
| RMP118 (`-una-sola-recta`) | Creer que todos los puntos de soldadura se pueden alinear en una sola recta desde el principio; la estructura está rígida hasta que se sueltan trozos. | rm-cortes, estructura de alambre (UNMSM 2027-I p. 25) | rm-cortes, `alambre` |
| RMP119 (`-de-a-dos`) | Pensar que cada corte atiende solo dos puntos (nodos ÷ 2), sin ver que trozos sueltos se alinean de a varios. | ídem | rm-cortes, `alambre` |

Códigos ya existentes que reutilizan los tipos nuevos (no se crean):
- RMP1-estados (n + 1), RMP2-todos-menos-uno (subir todos los bolos menos el de abajo), RMP45-vuelta-doble (lecturas que vuelven, contadas dos veces), RMP82-casillas, RMP83-suma-opciones, RMP84-solo-abajo (solo las lecturas que bajan).
- RMP35-pieza-por-pieza (N − 1 cortes), RMP35-por-lineas (tablero: cada línea en tramos de la sierra, sin apilar), RMP35-sin-reacomodar y RMP35-punto-por-punto (alambre), RMP36-log-abajo, RMP36-ignora-sierra (tablero: como si la sierra cortara cualquier largo).
