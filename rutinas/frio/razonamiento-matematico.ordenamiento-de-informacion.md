# Lector en frío: `razonamiento-matematico.ordenamiento-de-informacion` (19 nov 2026)

Ronda 1, con el método de `docs/metodo/unidad/4-lector-frio.md`: dos lectores nuevos, solo con capturas `--lector` a 390 px
(momentos de las seis ideas y 18 tarjetas de ejemplos, tres por idea). El lector A vio las ideas 1 a 3; el B, las ideas 4 a
6 y las 18 tarjetas. Capturas en el scratchpad de la sesión (`e5-cierre-rm/lector/`).

**Ojo:** en estas capturas de Lee, Mira y «Así se resuelve» solo se ve la primera tarjeta o el primer paso; los dos
lectores lo dicen una vez y no lo cuentan como falla. Los dos comprobaron izquierda y derecha, la numeración de sillas y
pisos y todas las respuestas: todas correctas y con una sola solución.

## Lector A: momentos (orden-lineal, posiciones, comparaciones)

### Idea 1: Ordenar en una fila (orden-lineal)

**1 Lee.** Veo un arco de fútbol con su red y una pelota arriba a la izquierda. Debajo están Ana, Beto y Ciro de pie, y
a la derecha una banca con los puestos 1, 2, 3 y 4. Dina está sentada en el puesto 4, el de la derecha. La tarjeta 1/4
dice que los veo de espaldas y que su izquierda es la mía. Me piden leer. Los números son los puestos. Coincide: Dina
está en el 4 y el 4 está a la derecha.
Duda: la cancha está dibujada a la izquierda, al costado de la banca, y no al fondo. Si miran hacia la cancha «igual que
yo», esperaba verla delante de ellos (hacia dentro de la pantalla). Las figuras no tienen cara, así que no sé si las de
pie también están de espaldas.

**2 Juega.** Veo la misma escena y una tabla con los órdenes 1 a 6, todos con Dina en el 4. La misión es agregar pistas
una a una y ver con cuántas queda fijo el puesto de Beto. La leyenda dice: 1-4 son los puestos de izquierda a derecha,
gris tachado es un orden descartado y marco violeta es lo seguro. Comprobé que 3! = 6 y que los seis órdenes están y
no se repiten. Solo veo el estado con 0 pistas, así que no veo cuáles son las pistas.
Aprendí: sin pistas hay 6 órdenes, y lo único seguro es lo que se repite en todos (Dina en el 4).

**3 Predice.** Veo una banca vacía con los cuatro de pie y dos pistas: Ciro está junto a Ana y Ciro está junto a Beto.
La pregunta es qué es seguro. Respondí D, «Ciro está entre Ana y Beto». La A no es segura, porque Ciro puede estar en el
2 o en el 3. La B no es segura, porque Ana puede estar a cualquier lado. La C es falsa, porque sí se sabe algo.
La pregunta está bien planteada.

**4 Mira.** El orden 1 es Ana, Ciro, Beto, Dina y el orden 2 es Dina, Ana, Ciro, Beto. El paso 1/5 dice: «Si Ana va a
la izquierda de Ciro, Beto va a su derecha». Los dos órdenes cumplen eso. Aprendí que «junto a» por los dos lados
encierra a Ciro en el medio. Sin dudas.

**5 La regla.** Tiene tres filas con Ana en el puesto 2:
- «a la izquierda de Beto»: Beto punteado en el 3 y en el 4. Correcto.
- «junto a Beto»: Beto punteado en el 1 y en el 3. Correcto.
- «inmediatamente a la izquierda»: Beto en violeta en el 3. Correcto.

Las llaves resumen: «a la izquierda de» ordena, «junto a» pega, «inmediatamente» ordena y pega. Se entiende muy bien.

**6 Así se resuelve.** Ana, Ciro, Fito y Hugo, con cuatro pistas. Veo solo el paso 1, «¿Qué me piden?». Lo resolví yo:
Ciro < Ana < Fito en la fila, Ana pegada a Fito y Hugo no en un extremo. Sale Ciro, Hugo, Ana, Fito, y es la única
solución. Tiene sentido.

**7 Ahora tú.** Beto está a la izquierda de Fito, Fito en un extremo y Dina en un extremo. Fito no puede ir en el 1, así
que va en el 4, y Dina va en el 1. Respuesta C, «Dina va en el puesto 1». La A no es segura, porque Beto puede ir en el
2 o en el 3. Es correcto.

**Ejercicio mío.** Hay 4 puestos. Eva está inmediatamente a la derecha de Luis, Luis está junto a Rosa y Rosa está en
el puesto 1. ¿Dónde está Eva? Luis está junto a Rosa, así que va en el 2, y Eva va en el 3.

### Idea 2: Pisos y puestos de llegada (posiciones)

**1 Lee.** Veo un edificio de 5 pisos numerados de abajo arriba y una ventana en cada piso. La tarjeta dice que Ana,
Beto y Ciro viven en pisos distintos y que hay pisos vacíos. Duda: el título dice «puestos de llegada», pero en ninguna
pantalla que vi aparece una carrera. Puede que esté en las tarjetas 2 a 4 de Lee.

**2 Juega.** Las pistas son: Beto vive dos pisos más arriba que Ana y Ciro vive en el 3. Ana está en el 1 y la llave +2
va del 1 al 3. En el 3 dice «Ciro y Beto», con Beto tachado. El título dice «Beto cae en el piso 3, que es de Ciro».
Los números y la llave coinciden. La misión es mover a Ana hasta que no se rompa ninguna pista. Con Ana en el 2, Beto
queda en el 4, y eso funciona.
Duda: la leyenda dice «violeta: el lugar que no rompe ninguna pista», pero el círculo violeta está en Ana, en el piso 1,
que sí rompe la pista. Parece que el violeta es el círculo para arrastrar, y eso me confundió.
Aprendí: «dos pisos más arriba» mueve a los dos juntos, como un bloque.

**3 Predice.** Eva vive tres pisos más abajo que Fito. ¿Cuántos pisos hay entre los dos? La respuesta es C, dos. Puede
ser Eva en el 1 y Fito en el 4, o Eva en el 2 y Fito en el 5, y en los dos casos quedan dos pisos en medio. La B
(«depende») es una buena trampa.

**4 Mira.** En el caso 1, Eva está en el 1, Fito en el 4 y la llave +3 va del 1 al 4. El caso 2 está vacío en el paso
1. El texto coincide con el dibujo. Aprendí que hay que probar cada lugar del bloque y contar los pisos de en medio.

**5 La regla.** En el caso 1, Eva está en el 1 y Fito en el 4, con los pisos 2 y 3 en gris. En el caso 2, Eva está en
el 2 y Fito en el 5, con los pisos 3 y 4 en gris. La llave dice +3 y los números están bien. La fórmula «pisos en medio
= la diferencia, menos 1» da 3 − 1 = 2, y eso coincide.
Problema: la frase principal dice «"Dos pisos más arriba" amarra a dos en un bloque, con un piso en medio», pero el
dibujo de al lado es de tres pisos (+3), con dos pisos en medio. Leo «dos» y «un piso en medio», veo +3 y dos grises, y
dudo cuál vale. Además, el gris de los pisos de en medio no tiene leyenda en esta pantalla.

**6 Así se resuelve.** Eva vive dos pisos más arriba que Ana, Dina vive en el 5 y el piso 4 está vacío. El dibujo pone a
Dina en el 5. Veo solo el paso 1. Lo resolví yo: Ana en el 1, Eva en el 3 y el piso 2 vacío (Eva no puede ir en el 4
porque está vacío, ni en el 5 porque es de Dina). Es la única solución.

**7 Ahora tú.** El edificio tiene 4 pisos y Ana está en el 1. Dina vive dos pisos más arriba que Ciro. Ciro no puede ir
en el 1, que es de Ana, así que Ciro va en el 2 y Dina en el 4. Respuesta D. El dibujo con 4 pisos coincide.

**Ejercicio mío.** El edificio tiene 6 pisos. Luz vive cuatro pisos más arriba que Pepe y el piso 1 está vacío. ¿Dónde
vive Luz? Pepe puede ir en el 2 (y Luz en el 6), porque el 1 está vacío. Queda un solo caso: Luz en el 6, con tres
pisos en medio.

### Idea 3: Más que, menos que (comparaciones)

**1 Lee.** Veo una regla vertical sin números a la izquierda y a Ana, Beto, Ciro y Dina, todos del mismo tamaño. La
tarjeta dice que se forman por talla y que solo se sabe quién es más alto que quién. Se entiende. Que los dibujé iguales
tiene sentido, porque no se sabe cuánto miden.

**2 Juega.** Veo un recuadro «Del más bajo al más alto» con Ana, Beto, Ciro y Dina en cajas punteadas, una debajo de
otra. Hay 24 órdenes posibles (4! = 24, correcto). La misión es agregar pistas hasta saber quién es el más bajo. La
leyenda dice: la flecha va del más bajo al más alto, las columnas van de izquierda a derecha de menos a más alto, el
marco cortado significa sin flechas y el marco violeta significa lugar seguro.
Duda: si las columnas ordenan de izquierda a derecha, los cuatro en una sola columna parecen «iguales de alto», y el
título encima («del más bajo al más alto») parece decir que Ana es la más baja porque está arriba. Solo entendí que es
«sin ordenar» por la palabra «cortado».
Aprendí: cada pista es una flecha del menor al mayor.

**3 Predice.** «Eva no es más alta que Fito.» La respuesta es A, «mide menos o lo mismo». La B es la trampa. Bien
planteada.

**4 Mira.** Hay dos recuadros: «Si Eva es más baja» (Eva → Fito, de izquierda a derecha) y «Si miden lo mismo» (Eva
encima de Fito, en la misma columna). El paso 1 coincide. Aprendí que «no es más alta que» deja dos casos: más baja o
igual.

**5 La regla.** El recuadro «Ana y Ciro: sin cadena entre ellos» muestra Dina → Beto → Ana y Beto → Ciro, con Ana y Ciro
uno encima del otro en la misma columna. Las flechas son correctas: entre Ana y Ciro no se sabe nada.
Problema: en Mira, «uno encima del otro en la misma columna» significaba «miden lo mismo». Aquí el mismo dibujo
significa «no se sabe». Con la leyenda de Juega (las columnas son de menos a más alto), pensé que Ana y Ciro empataban.
La regla habla de «menor/mayor» para tallas. Se entiende, pero en Lee decía «más bajo/más alto».

**6 Así se resuelve.** Hay que ordenar las edades de Ana, Beto, Leo y Rosa. El dibujo usa la regla de alturas, que no
sirve para edades, y eso distrae un poco. Veo solo el paso 1. Lo resolví yo: Beto < Ana < Leo < Rosa. Es una sola
cadena y tiene una sola solución.

**7 Ahora tú.** Con Beto < Ana < Fito < Rosa, el segundo desde el mayor es Fito. Respuesta C. Es correcto.

**Ejercicio mío.** Tito es mayor que Sol, Sol es mayor que Rita y Uma es menor que Tito. ¿Quién es el mayor? Tito,
porque los otros tres son menores que él (Sol y Uma directamente, y Rita a través de Sol). El orden entre Uma y los
demás no se sabe.

### Nota sobre «frente a»

En estas tres ideas no aparece «frente a» en ninguna pantalla, así que no pude comprobarlo.

### Lo que me trabó

- posiciones · 5 La regla: el texto dice «dos pisos más arriba… con un piso en medio», pero el dibujo es +3 con dos pisos en medio.
- comparaciones · 5 La regla vs 4 Mira: el mismo dibujo (uno encima del otro en la misma columna) significa «miden lo mismo» en Mira y «sin cadena, no se sabe» en La regla.
- comparaciones · 2 Juega: con la leyenda «columnas de izquierda a derecha, más altos», los cuatro en una sola columna bajo «Del más bajo al más alto» parecen iguales, o parece que Ana es la más baja.
- posiciones · 2 Juega: el círculo violeta está en Ana, en el piso 1, que rompe la pista, pero la leyenda dice «violeta: el lugar que no rompe ninguna pista».
- orden-lineal · 1 Lee: la cancha está dibujada a la izquierda de la banca y no delante, aunque dice que miran hacia la cancha «igual que tú».
- posiciones · 1 Lee: el título dice «puestos de llegada», pero en las pantallas que vi solo hay pisos.
- comparaciones · 6 Así se resuelve: el problema es de edades, pero el dibujo muestra una regla de alturas.
- posiciones · 5 La regla: el gris de los pisos de en medio no tiene leyenda.

## Lector B: momentos (con-numeros, orden-circular, mesa-cuadrada) y tarjetas de ejemplos

### Parte 1: momentos

#### Idea 4 · «Ordenar con sumas y diferencias» (con-numeros)

**1 Lee.** Veo tres sobres (S/ 20, S/ 50 y S/ 100), la tarjeta 1/4 «La rifa del aniversario», a Faro y el botón «Siguiente tarjeta». Me piden leer. S/ quiere decir soles. Todo se entiende.

**2 Juega.** Veo los tres sobres y una tabla con los 6 repartos posibles (Ana, Beto, Ciro). Debajo dice «Todavía no hay pistas», hay una leyenda y una barra «Pistas 0» con − y +. La misión es agregar pistas hasta saber cuánto recibió cada uno. La leyenda dice S/ = soles, gris tachado = reparto descartado, marco violeta = monto seguro. Duda: como hay 0 pistas, no vi ninguna pista, ni nada tachado, ni el marco violeta, así que no pude comprobar la leyenda. Aprendí que sin pistas hay 6 repartos y que cada pista los va descartando.

**3 Predice.** Veo dos cajas, «Ana + Beto ?» y «Ciro + Dina ?». La pregunta: si las sumas son iguales y Ana es mayor que Ciro, ¿qué se puede asegurar? Mi respuesta es C (Beto es menor que Dina). El Dato «Las cuatro edades son distintas» ayuda. Duda: las cajas no están partidas en dos, así que todavía no muestran a cada persona.

**4 Mira (paso 1/5).** Veo dos barras partidas, Ana|Beto y Ciro|Dina. La de Ana es un poco más larga que la de Ciro. El texto dice «Las dos barras miden lo mismo». Aprendí que si las sumas son iguales, las barras son del mismo largo. Duda: Faro dice «Mira la franja», pero en el paso 1 no hay ninguna franja.

**5 La regla.** Veo Ana 17 + Beto 14 y Ciro 15 + Dina 16, con una franja gris entre las partes. Revisé las cuentas: 31 = 31, Ana le gana a Ciro por 2 y Dina le gana a Beto por 2. Todo cuadra. Fórmula: Ana + Beto = Ciro + Dina, «si Ana gana, Beto pierde». Duda 1: la frase «Con los valores a la vista, una suma dice qué par es» no la entendí. Duda 2: «si Ana gana»… ¿gana frente a quién? Se refiere a Ciro, pero no lo dice.

**6 Así se resuelve.** Veo cuatro sobres (20, 50, 100 y 200) y a Ana, Beto, Dina y Eva. Pistas: Dina + Beto = 120, Beto > Dina, Ana < Eva. Lo resolví yo: 120 = 20 + 100, así que Beto recibió 100 y Dina 20; quedan 50 y 200, así que Ana recibió 50 y Eva 200. La solución es única. Me resultó raro que salte de Beto a Dina sin Ciro, pero no molesta.

**7 Ahora tú.** Sobres de 10, 20 y 100. Leo + Rosa = 110, y Rosa recibió más que Leo. Entonces Rosa recibió **100 (C)**. Todo se ve bien.

**Ejercicio inventado.** Sobres de 10, 30 y 50 para Ana, Beto y Ciro. Ana + Ciro = 60 y Ana recibió más que Ciro. Solución: 60 = 10 + 50, así que Ana recibió 50, Ciro 10 y Beto 30.

#### Idea 5 · «La mesa redonda» (orden-circular)

**1 Lee.** Veo una mesa redonda vista desde arriba, con 4 sillas libres y a Ana abajo (en naranja). Su plato tiene la cuchara a la derecha. Tarjeta: «cinco personas… Ana está abajo, de espaldas a ti». Se entiende.

**2 Juega.** La misión es sentar a Beto a la derecha de Ana. Beto está en la silla de arriba a la derecha (silla 2), y el mensaje dice «Beto no está junto a Ana: queda una silla en medio». Lo comprobé: Ana mira hacia arriba, así que su derecha es la derecha de la pantalla, y la silla 1 es la de la derecha. El mensaje es correcto. Las cucharas también están bien: la de Beto queda a su derecha mirando al centro. Dudas: (a) la leyenda habla de una «flecha turquesa», pero no veo ninguna flecha; (b) la leyenda dice «violeta: la silla pedida, ya comprobada», pero Beto está en violeta y está mal puesto, y eso confunde. Aprendí que la derecha de Ana es la silla siguiente contra el reloj.

**3 Predice.** Mesa de 6 con Dina arriba, de cara a mí. Su derecha es mi izquierda, así que la respuesta es **B (a la izquierda del dibujo)**. El Dato «A la derecha de…» ayuda. Algo raro: debajo del dibujo hay una palabra «Eva» suelta, a la izquierda, y una línea «1. Eva se sienta a la derecha de Dina.». Parece texto que se coló, y como «Eva» aparece a la izquierda, casi regala la respuesta. Además aquí el dibujo no tiene platos ni cucharas.

**4 Mira (1/5).** Veo a Dina arriba con la cuchara a mi izquierda (bien) y a Ana abajo con la cuchara a la derecha (bien). Hay una flecha turquesa que va desde Ana hacia la silla de abajo a la derecha, contra el reloj, como debe ser. Texto: «Ana mira al centro desde abajo: su derecha es la tuya.». Aprendí que con la persona abajo, su derecha coincide con la mía. Nada me trabó.

**5 La regla.** Veo dos flechas: la de Dina va hacia arriba a la izquierda y la de Ana hacia abajo a la derecha. Las dos son correctas. Regla: derecha = siguiente contra el reloj, izquierda = siguiente con el reloj, y un giro no cambia el orden. Está clara.

**6 Así se resuelve.** Beto, Ciro, Dina, Fito y Gino, en 5 sillas. Pistas: Fito está entre Beto y Ciro, y Beto está a la derecha de Gino. Lo resolví: Gino queda con el reloj desde Beto, así que Fito es el otro vecino de Beto. Contra el reloj desde Beto: Beto, Fito, Ciro, Dina, Gino. Es único.

**7 Ahora tú.** Pistas: Ciro a la izquierda de Dina, Ana no junto a Dina y Ana no junto a Fito. Los vecinos de Ana tienen que ser Ciro y Eva. Con el reloj queda Dina → Ciro → Ana → Eva → Fito. A la derecha de Ana (contra el reloj) está **Ciro (D)**. Es único.

**Ejercicio inventado.** Mesa de 4 con Ana, Beto, Ciro y Dina. Beto se sienta a la derecha de Ana y Ciro no se sienta junto a Beto. ¿Quién está a la izquierda de Ana? Solución: contra el reloj van Ana, Beto, silla 3 y silla 4. La silla 3 toca a Beto, así que Ciro va en la 4, que está a la izquierda de Ana. Respuesta: **Ciro**.

#### Idea 6 · «Frente a frente» (mesa-cuadrada)

**1 Lee.** Veo una mesa redonda con 8 sillas y números del 1 al 8 dentro de la mesa: 1 abajo, 2 abajo a la derecha, y así contra el reloj. Tarjeta: «El compartir del aula… sillas con cartel del 1 al 8». Se entiende. Duda pequeña: los números están dibujados dentro de la mesa, no en las sillas.

**2 Juega.** La misión es sentar a Ana frente a la silla 7. Ana está en la 1 y la 7 está resaltada. Una línea turquesa une la 1 con la 5, y el mensaje dice «Frente a la silla 1 está la 5: cuatro sillas más allá». Es correcto. Para cumplir la misión, Ana debe ir a la 3. Aprendí que en la redonda de 8, «frente a» queda 4 sillas más allá.

**3 Predice.** Mesa cuadrada de carpetas, 2 sillas por lado: abajo 1 y 2, a la derecha 3 y 4, arriba 5 (der.) y 6 (izq.), a la izquierda 7 y 8. Ana está en la 1. Frente a la 1 está **la 6 (B)**. Es buena trampa, porque «4 más allá» daría 5. La línea del medio de la mesa ayuda.

**4 Mira (1/5).** El 2 está resaltado y el texto dice «La 2 comparte con la 1 el lado de abajo». Duda: Faro dice «Compara las sillas cercanas a la 6 con la 6» y no entendí qué tengo que comparar.

**5 La regla.** Veo la mesa cuadrada con 4 líneas turquesa que unen 6–5, 7–8, 4–3 y 1–2, o sea, sillas del **mismo lado**, no las que están frente a frente (1–6, 2–5, 3–8, 4–7). El texto dice que «frente a» es cruzar la mesa, pero el dibujo marca otra cosa y me confundió. Además, «Con un número impar de sillas redondas» suena raro: lo redondo es la mesa, no las sillas.

**6 Así se resuelve.** Eva está en la 3, dibujada a la derecha abajo, lo cual es correcto. Lo resolví: Ana frente a Eva va en la 8. Ana mira hacia la derecha, así que su derecha es hacia abajo, y Gino va en la 1. Fito frente a Gino va en la 6. Es único.

**7 Ahora tú.** Frente a la 8 (izquierda abajo) está **la 3 (C)**. Se ve bien.

**Ejercicio inventado.** Misma mesa cuadrada de 8. ¿Qué silla queda frente a la 4? La 4 está a la derecha arriba; al cruzar se llega a la izquierda arriba, que es **la 7**.

### Parte 2: tarjetas (lector/01 a 18)

Para cada tarjeta respondo: qué piden / si tengo todo / si sigo el Resuelto / el dibujo / algo raro. Revisé todas las cuentas.

- **01 (n.º 3, Junto a).** Piden en qué puestos puede estar Maru. Tengo todo. Sigo el Resuelto. El dibujo ayuda y no da la respuesta. Respuesta 1 o 3: correcta.
- **02 (n.º 8, Seguro y no).** Tengo todo, menos esto: no dice si «a la izquierda de» es «justo al lado» o «en cualquier puesto a la izquierda». El Resuelto lo toma como cualquier puesto, y en la mesa redonda era «la silla de al lado». El dibujo con «Vilma» punteada en 2 y 3 adelanta parte del resuelto. Respuesta correcta: Lucho 1 y Teo 4.
- **03 (n.º 14, Tres parejas).** Falta algo: no dicen quién es varón y quién es mujer; hay que adivinarlo por los nombres. Me pierdo en la línea 2 del Resuelto («Ana iría en el 3, junto a Ciro, o Beto en el 6…»), porque mete dos casos en una sola frase. Lo comprobé: Beto, Ana, Fito, Eva, Ciro, Dina. Respuesta **B: Eva**, correcta. El dibujo (Dina en 1 o 6) ayuda.
- **04 (n.º 3, Bloque).** Tengo todo y lo sigo. El edificio ayuda. Respuesta pisos 1 o 2: correcta.
- **05 (n.º 8, Dos pisos en medio).** Falta un Dato: no dice «una persona por piso». El Resuelto usa «el 2 es de Nora: Rosa no va ahí»; si dos pudieran vivir en el mismo piso, Leo también podría estar en el 5. Lo sigo. Respuesta 4: correcta con esa suposición.
- **06 (n.º 14, Siete pisos).** Tengo todo. La línea «3 + 2 = 5» aparece suelta después de que ya se usó. Sara 1, Pía 2, Teo 3, Gino 4, Omar 6, así que los pisos vacíos son 5 y 7. Respuesta **B**, correcta.
- **07 (n.º 3, Sin cadena).** Me pierdo en la línea 1: «Las dos flechas salen de Beto», pero el dibujo no tiene ninguna flecha. Los tres muñecos miden lo mismo, y eso confunde con «tallas distintas». Tampoco se dice si «Beto, Ana, Ciro» va del más bajo al más alto. Respuesta «No se sabe»: correcta.
- **08 (n.º 8, Puntos).** Tengo todo y lo sigo, porque esta vez sí explica las flechas. Raro: el dibujo usa muñecos con regla de talla para mostrar puntos. Nora < Rosa < Iván, así que gana Iván: correcto. Se siente más fácil que la 07.
- **09 (n.º 14, Pistas sueltas).** Tengo todo y lo sigo. «Antes» quiere decir «menor»; se deduce, pero no lo dice. 24 ÷ 2 ÷ 2 = 6, así que la respuesta es **B**: correcto. Los muñecos iguales no ayudan.
- **10 (n.º 3, Tres dados).** Tengo todo y lo sigo. Raro: los dados están dibujados como sobres. 4 + 6 = 10, así que Nora sacó 2: correcto.
- **11 (n.º 8, Lo que gana uno).** Me pierdo en la línea 1: «su parte de arriba es más larga», pero las barras son horizontales y no están partidas (solo dicen «Maru + Teo ?»). También dice «Teo más corto», hablando de una persona como si fuera una barra. Respuesta Vilma: correcta.
- **12 (n.º 14, Par e impar).** Tengo todo y lo sigo. Omar 14, Gino 15, Pía 13, así que la respuesta es **A**: correcto. El 16 de la opción D es imposible a propósito, y el Resuelto lo explica.
- **13 (n.º 3, Tres en la mesa).** Tengo todo y lo sigo. El dibujo ayuda. Ciro: correcto.
- **14 (n.º 8, ¿Entre quiénes?).** Tengo todo y lo sigo. Ciro queda con el reloj desde Ana, y Beto va en la del medio de las tres que quedan. Entre Dina y Eva: correcto.
- **15 (n.º 14, Derecha de Hugo).** Tengo todo y lo sigo. Contra el reloj: Eva, Fito, Gino, Hugo, Iván, Ana. A la derecha de Hugo está Iván, respuesta **E**: correcto.
- **16 (n.º 3, Sillas impares).** Tengo todo y lo sigo. Los números del dibujo coinciden (1 abajo, 2 a la derecha… contra el reloj). Ninguna: correcto.
- **17 (n.º 8, Ronda de ocho).** Tengo todo. La derecha de Beto (5, arriba) es la 6, a la izquierda de la pantalla: correcto. Frente a la 6 está la 2. La línea «6 − 4 = 2» aparece sin explicar por qué se resta 4.
- **18 (n.º 14, Doce sillas).** Tengo todo y lo sigo. Iván en la 9 (arriba a la izquierda). Su izquierda es mi derecha, la 8, respuesta **D**: correcto. Las distractoras también están bien explicadas.

**Las 3 que mejor se entienden:** 13, 10 y 04.
**Las 3 que peor:** 07 (flechas que no se ven), 11 (barras horizontales con «parte de arriba») y 03 (géneros sin decir y línea 2 apretada).
**¿Suben los niveles?** Sí, en general: el n.º 14 trae más pistas y opciones A–E. La excepción es comparaciones: la 08 se siente más fácil que la 07.
**El recuadro «Datos»:** ayuda mucho, sobre todo las definiciones de «a la derecha de» y «frente a», y no regala la respuesta. Le faltan dos cosas: en la 05, «una persona por piso», y en la 02, qué significa «a la izquierda de» en una fila.

### Lo que me trabó

- Sumas y diferencias · Mira paso 1: Faro dice «mira la franja», pero no hay franja todavía.
- Sumas y diferencias · La regla: la frase «Con los valores a la vista, una suma dice qué par es» no se entiende, y en «si Ana gana, Beto pierde» no se dice frente a quién.
- Sumas y diferencias · Juega: con 0 pistas no vi ninguna pista ni nada tachado, y no pude comprobar la leyenda.
- La mesa redonda · Juega: la leyenda nombra una «flecha turquesa» que no aparece, y Beto mal puesto sale en violeta («ya comprobada»).
- La mesa redonda · Predice: hay un «Eva» suelto a la izquierda y la línea «1. Eva se sienta a la derecha de Dina.» bajo el dibujo; parece colado y casi da la respuesta.
- Frente a frente · Mira paso 1: «Compara las sillas cercanas a la 6 con la 6» no se entiende.
- Frente a frente · La regla: las líneas turquesa unen sillas del mismo lado (1–2, 3–4, 5–6, 7–8), no las de enfrente, y dice «sillas redondas».
- Tarjeta 02: no se define si «a la izquierda de» en fila es «justo al lado» o «en cualquier puesto a la izquierda».
- Tarjeta 03: no dicen quién es varón y quién mujer, y la línea 2 del Resuelto mezcla dos casos.
- Tarjeta 05: falta el Dato «una persona por piso»; sin él, Leo podría estar en el 5.
- Tarjeta 07: el Resuelto habla de «las dos flechas», pero el dibujo no tiene flechas, y los muñecos miden igual.
- Tarjeta 08: muñecos con regla de talla para mostrar puntos de concurso.
- Tarjeta 10: los dados están dibujados como sobres.
- Tarjeta 11: «su parte de arriba es más larga» con barras horizontales que no están partidas, y «Teo más corto».
- Tarjeta 17: «6 − 4 = 2» aparece sin explicar por qué se resta 4.

## Correcciones de la ronda 1 (19 nov)

Con el criterio de `docs/metodo/unidad/6-correcciones.md`, junto con la auditoría
(`rutinas/auditoria/razonamiento-matematico.ordenamiento-de-informacion.md`, sección «Correcciones (19 nov)», donde está la
prueba de cada cosa). Ninguna respuesta cambió. Capturas después de corregir: `e5-cierre-rm/despues/` y `despues2/`.

| Lo que señaló el lector | Qué se hizo |
|---|---|
| A · posiciones, La regla: «dos pisos… con un piso en medio» y el dibujo es +3 con dos en medio; el gris sin leyenda | «“Tres pisos más arriba” amarra a dos en un bloque, con dos pisos en medio (en gris)», con prueba de que el texto y el dibujo dicen la misma distancia (auditoría M1). |
| A · comparaciones: la misma columna es «miden lo mismo» en Mira y «no se sabe» en la regla; Juega con los cuatro en una columna bajo «Del más bajo al más alto» | La leyenda dice «columnas: en la misma, todavía sin comparar» (el empate de Mira lleva su signo de igual); con 0 pistas el título es «Todavía sin flechas» (M8). |
| A · posiciones, Juega: círculo violeta en Ana, en un piso que rompe una pista | El asa de arrastre ya no es violeta y la leyenda dice «violeta: los nombres, si no rompen ninguna pista»; queda el morado de la app en el asa, que pide un cambio en `app/` (M7, pendiente). |
| A · orden-lineal, Lee: la cancha está al costado de la banca | **No se hizo**: es el dibujo de prueba de la pieza (B5); va a Gerson. |
| A · posiciones, Lee: el título promete «puestos de llegada» y solo hay pisos | La tarjeta 2 trae la tira de llegadas, con su «Llegada» y los puestos 1 a 5 (B8). |
| A · comparaciones, «Así se resuelve»: edades con un tallímetro | La formación sin tallímetro en todo lo que es de edades o puntos (M9). |
| B · Frente a frente, La regla: las líneas unen sillas del mismo lado; «sillas redondas» | Real: las líneas se cortaban cerca del centro y formaban un cuadradito. Ahora cruzan la mesa de silla a silla (por debajo de los carteles), la regla muestra dos pares (1 y 6, 3 y 8) con sus carteles marcados, y la condición dice «en la mesa redonda con un número impar de sillas» (A1). |
| B · mesa redonda, Predice: «Eva» suelta a la izquierda casi da la respuesta | Quien espera va centrado sobre la mesa («De pie: Eva»); los ejemplos 1 y 2 de la idea, que preguntan de qué lado va alguien, ya no traen cucharas (M6). |
| B · mesa redonda, Juega: la flecha turquesa de la leyenda no aparece; Beto mal puesto en violeta | Leyenda: «flecha turquesa: al acertar: su derecha, contra el reloj»; el asa, como en la idea 2 (M7). |
| B · tarjeta 05: falta «una persona por piso» | En los ejemplos de pisos con tres personas o más (M11). |
| B · tarjeta 02: no dice qué es «a la izquierda de» en la fila | «A la izquierda de: en un puesto de número menor» en los ejemplos de nivel 1 y 2 que lo usan, y la línea de palabras completa en la tarjeta 02 (M11). |
| B · tarjeta 03: no dicen quién es varón y quién mujer; la línea 2 mezcla dos casos | «Mujeres (Ana, Dina y Eva) y varones (Beto, Ciro y Fito), alternados» en Datos, también en el ejemplo 11 de la idea 6 y en «Ahora tú» de la idea 6; la línea 2 cuenta los dos casos por separado (M4). |
| B · tarjeta 07: «las dos flechas» sin flechas en el dibujo | El resuelto escribe las flechas: «Beto → Ana y Beto → Ciro» (M10). |
| B · tarjeta 08: puntos con tallímetro; tarjeta 10: dados como sobres | Pieza con dados (cara con sus puntos) y tarjetas lisas para edades; sin tallímetro en puntos y edades (M9). |
| B · tarjeta 09: «antes» por «menor» sin decirlo | «Beto es menor que Ana; en la otra mitad, mayor» (M10). |
| B · tarjeta 11: «su parte de arriba es más larga» con barras sin partir; «Teo más corto» | «una barra de Maru y Teo, otra de Lucho y Vilma… su trozo es más largo», «el trozo de Teo» (M15). |
| B · tarjeta 17: «6 − 4 = 2» sin explicar | «Media vuelta son 4 sillas: contando 4 hacia atrás desde la 6…» (B6). |
| B · sumas: Faro dice «Mira la franja» antes de la franja; «una suma dice qué par es»; «si Ana gana, Beto pierde», ¿frente a quién? | Voz «Compara las barras; después, la franja»; regla «Si sabes qué valores hay, una suma dice cuáles dos la forman. Con dos sumas iguales, lo que uno le gana a alguien del otro par, su compañero lo pierde»; nota «si Ana supera a Ciro, Dina supera a Beto» (M15). |
| B · sumas, Juega con 0 pistas: no se ve lo que nombra la leyenda | **No se hizo**: el validador ya exige que se vea en algún caso del juego; mostrarlo al abrir pide empezar con una pista, que cambia la misión. Queda anotado. |
| B · frente a frente, Mira: «Compara las sillas cercanas a la 6 con la 6» | «Desde la 1, mira cuál de estas sillas te queda al cruzar» (M16). |
| B · tarjeta 06: «3 + 2 = 5» suelto | No se tocó (la cuenta va en la línea que la usa). |
| B · Lee de la idea 6: los números están dentro de la mesa | No se tocó: son los carteles de la mesa del compartir, a propósito sobre el borde. |
