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
