# Lector en frío: algebra.ecuaciones-polinomiales

20 nov 2026, ronda 1. Dos lectores nuevos, solo con capturas a 390 px (`--entera`), sin el código ni el `aprendizaje`:
el A, los momentos de las ideas 1 a 3; el B, los de las ideas 4 a 6 y 18 tarjetas de ejemplos (niveles 1, 2 y 3 de cada
idea). Capturas: `/tmp/claude-0/-home-user/31d0ae9f-8026-5866-a5dc-2c8554ea89bf/scratchpad/e8-cierre-ep/lector/`. Sus
informes van tal cual (con un nivel más en los títulos); al final, «Correcciones de la ronda 1». La auditoría del
contrato está en `rutinas/auditoria/algebra.ecuaciones-polinomiales.md`.

## Lector A: momentos de las ideas 1, 2 y 3

Ideas: grado-raices, viete, raices-racionales. Pantallas de celular, tema claro.

De Lee solo veo la tarjeta 1 de 4; de Mira, el paso 1 de 5; de «Así se resuelve», el paso 1 («¿Qué me piden?»). Lo digo una vez y no lo cuento como falla.

### Idea 1: Raíces y grado

**1 Lee.** Veo un rectángulo hecho con un cuadrado grande y dos tiras delgadas, con «ancho: x dm» (verde) y «largo: (x + 2) dm» (morado). La tarjeta cuenta el pasadizo de Rubén: x(x + 2) = 15, y 3 es raíz porque 3 · 5 = 15. No me piden nada, solo leer. x es el ancho en dm; «raíz» es el número que cumple la ecuación. Se entiende. Me queda una duda: ¿x = −5 también sirve? Como la tarjeta habla de un pasadizo, supongo que no, pero no lo dice.

**2 Juega.** Veo la curva y = x³ − 3x + d con d = 0. Corta el eje x en tres puntos morados (cerca de −1,7, en 0 y cerca de 1,7). Hay un letrero que dice «3 reales y 0 no reales: 3 + 0 = 3, el grado» y una barra para mover d. La misión es que la curva toque el eje sin cruzarlo. El punto morado es una raíz real, d sube o baja la curva y «doble» es una raíz que se cuenta dos veces. Si subo d a 2, el valle de x = 1 toca el eje: esa sería la raíz doble. *Aprendí:* reales + no reales siempre suman el grado. *Dudas:* el círculo de la barra está pegado a la izquierda aunque d vale 0, así que no sé si d puede ser negativo. El letrero «3 reales…» sale con otra letra, como de máquina de escribir.

**3 Predice.** Veo una curva que cruza el eje tres veces (cerca de −2, 0 y 2). La pregunta: un polinomio de grado 5 con 3 raíces reales distintas, ¿cuántas no reales tiene? En «Datos» están el grado 5 y las 3 reales. Respondo D, 2 (5 − 3). Se entiende, y el dibujo no regala la respuesta.

**4 Mira (paso 1).** Veo la curva de P(x) = x³ − x² + 4x − 4, que corta el eje una sola vez, en x = 1. El texto dice «Grado 3, pero la curva corta el eje una sola vez» y Nox pregunta dónde están las otras dos. Lo comprobé: P(1) = 0 y P(0) = −4, como en el dibujo. *Aprendí:* la gráfica no muestra todas las raíces.

**5 La regla.** Hay una tabla: x − 1 da 1 real; x² + 4 da 2 no reales; grado 3 = 1 + 2. Debajo vienen el teorema fundamental y la fórmula P(x) = a(x − x₁)…(x − xₙ). Se entiende bien. *Duda:* el «Vale si» dice que «un trinomio sin raíces reales da dos no reales», pero el ejemplo de arriba, x² + 4, tiene dos términos (es un binomio). Me hizo dudar si x² + 4 entraba en esa regla.

**6 Así se resuelve (paso 1).** Veo P(x) = (x − 3)³(x + 2)²(x² + 4) con su gráfica; en los «Datos» están el producto cero, el exponente que cuenta veces y que un cuadrado nunca es negativo. En el paso 1 dicen que piden dos números. Lo resolví: 3 + 2 = 5 reales contando repetidas y 2 no reales (en total 7, el grado). Comprobé que P(−3) = (−6)³ · 1 · 13 = −2808, igual que la escala. *Dudas:* las etiquetas «2 808» y «−2 808» se cortan contra el borde izquierdo. Entre x = 2,5 y x = 3,5 la curva va pegada al eje, así que no se ve dónde está la raíz 3; parece que toca el eje en todo ese tramo.

**7 Ahora tú.** P(x) = (x − 5)(x + 2)²(x² + 4): ¿cuántas raíces en total? El grado es 1 + 2 + 2 = 5, así que respondo D, 5. Se entiende.

**Ejercicio inventado.** P(x) = (x + 1)³(x − 2)(x² + 9). Grado: 3 + 1 + 2 = 6. Reales contando repetidas: −1 tres veces y 2 una vez, o sea 4. No reales: x² + 9 nunca vale 0, así que son 2. Total: 4 + 2 = 6 ✓.

### Idea 2: Raíces y coeficientes

**1 Lee.** Veo una caja alta y delgada con «alto: 3 dm», «largo: 1 dm» y «ancho: 2 dm», con los bordes morados. La tarjeta dice que (x − 1)(x − 2)(x − 3) «vale 0 justo en sus tres aristas». *Duda:* el polinomio no vale 0 «en las aristas»; vale 0 cuando x es 1, 2 o 3, que son las medidas. La primera vez lo leí como si las aristas fueran lugares.

**2 Juega.** Veo la misma caja, «volumen: 6 dm³», el polinomio x³ − 6x² + 11x − 6 con «1 + 2 + 3 = 6; 1 · 2 · 3 = 6» y tres barras (largo 1, ancho 2, alto 3). La misión es armar la caja de x³ − 9x² + 26x − 24. Largo, ancho y alto son las raíces; volumen = largo · ancho · alto. La resolví con 2, 3 y 4: suma 9, productos de a dos 6 + 8 + 12 = 26, producto 24 ✓. *Aprendí:* el número del x² es la suma de las aristas y el último número es el producto (con signo cambiado). *Dudas:* al empezar, la suma y el producto valen 6 los dos, y −6x² y −6 también son iguales. No supe cuál 6 iba con cuál hasta que moví una barra. El 11 no se explica en el juego.

**3 Predice.** Veo una tabla a, b, c, d = 2, −6, 4, 10 y «producto: ?». La pregunta es cuánto vale el producto de las tres raíces de 2x³ − 6x² + 4x + 10 = 0, y en «Datos» lo factorizan como 2(x³ − 3x² + 2x + 5). Como en el juego el último número salía con el signo cambiado, respondo C, −5 (= −10/2). Se entiende; el «Datos» ayuda sin regalar la respuesta.

**4 Mira (paso 1).** Veo una tabla con los títulos «con las raíces» y «en P», pero las seis casillas están vacías y la primera columna no tiene título. Debajo está (x − 1)(x − 2)(x − 3) = x³ − 6x² + 11x − 6. *Duda:* en el primer paso la tabla vacía parece rota; no sé qué va en la columna sin nombre. *Aprendí:* al multiplicar la caja salen los coeficientes −6, 11 y −6.

**5 La regla.** Tabla: suma −b/a, productos de a dos c/a, producto −d/a. Abajo están la frase completa, la fórmula x₁ + x₂ + x₃ = −b/a con b y a en naranja y el «Vale si» (a ≠ 0; en grado 2, suma −b/a y producto c/a). Nox: «los signos alternan». Se entiende bien.

**6 Así se resuelve (paso 1).** Tabla a, b, c, d = 2, −18, 30, 50, con suma y «de a dos» por hallar. La pregunta pide x₁² + x₂² + x₃², y los «Datos» traen las fórmulas y la identidad (suma)² − 2(de a dos). Lo resolví: suma = 18/2 = 9, de a dos = 30/2 = 15, y 81 − 30 = 51.

**7 Ahora tú.** ¿Cuánto suman las raíces de 2x³ − 12x² + 10x + 24 = 0? −b/a = 12/2 = 6, así que respondo D. Es muy fácil: los «Datos» y Nox repiten la fórmula exacta.

**Ejercicio inventado.** x³ − 4x² + x + 6 = 0. Producto de raíces = −6/1 = −6. Lo compruebo: (x + 1)(x − 2)(x − 3) = x³ − 4x² + x + 6, y (−1)(2)(3) = −6 ✓.

### Idea 3: Raíces racionales

**1 Lee.** Veo una caja con «largo: x dm», «ancho: x + 1 dm», «alto: x + 2 dm» y «volumen: 60 dm³». La ecuación es x(x + 1)(x + 2) = 60, o sea x³ + 3x² + 2x − 60 = 0. Lo comprobé: con x = 3 sale 3 · 4 · 5 = 60 ✓. Se entiende.

**2 Juega.** Veo una hoja de cuaderno con Ruffini de 2x³ − 7x² + 2x + 3 probando 1/2. Las filas son 2, −7, 2, 3; luego 1, −3, −1/2; y abajo 2, −6, −1, con 5/2 en la casilla final. El letrero dice «P(1/2) = 5/2: el resto no es 0». Debajo están los botones ±1/2, ±1, ±3/2, ±3. La misión: encontrar la raíz que no es entera. «A la izquierda» va el número que se prueba; el «resto» es P de ese número. Comprobé la cuenta y está bien. La raíz es −1/2: 2 · (−1/8) − 7/4 − 1 + 3 = 0 ✓. *Aprendí:* Ruffini dice si un número es raíz (resto 0) o no. *Dudas:* no veo de dónde sale la lista de botones. En la Predice, Nox dice «recuerda de dónde salían los números de la lista del juego», pero el juego no lo explica (quizás está en las tarjetas 2 a 4 de Lee, que no vi).

**3 Predice.** Tabla con 3/2, 2/3, −1/3 y 2, y «¿puede ser raíz?». La pregunta: un polinomio empieza con 3x³ y termina en + 2; ¿cuál NO puede ser raíz? En «Datos» están los divisores de 2 y de 3. Mirando la lista del juego (2 abajo, 3 arriba) adivino que arriba va el divisor del último y abajo el del primero, así que respondo D, 3/2. Pero lo adiviné, no lo sabía.

**4 Mira (paso 1).** Veo una tabla «número / P(número)» con las ocho casillas vacías. El texto dice «Arriba, un divisor de 3; abajo, uno de 2; con los dos signos: ±1; ±3; ±1/2; ±3/2». *Dudas:* la pantalla no dice de qué polinomio habla (supongo que del juego, 2x³ − 7x² + 2x + 3), y la tabla vacía parece rota. *Aprendí:* la lista sale de los divisores del último y del primero.

**5 La regla.** Ruffini con −1/2: 2, −8, 6 y resto 0. La comprobé ✓, y el cociente 2x² − 8x + 6 da 1 y 3. Abajo vienen la frase p/q y la fórmula candidatos = ± divisores del independiente / divisores del principal, más el «Vale si». Aquí por fin se explica de dónde salen los candidatos. Bien.

**6 Así se resuelve (paso 1).** Ruffini de 2x³ − 7x² − 7x + 12 con «?» a la izquierda. La pregunta pide la raíz no entera; los «Datos» traen la regla y cómo se hace Ruffini. Lo resolví: P(1) = 0 y el cociente es 2x² − 5x − 12 = (2x + 3)(x − 4), así que la raíz no entera es −3/2. *Duda chica:* en los Datos, la frase «cada casilla es el de arriba más el número que se prueba por la anterior» se entiende recién a la segunda lectura («la anterior» es la casilla de abajo de la columna anterior).

**7 Ahora tú.** Principal 3, independiente 5: ¿cuál NO puede ser raíz? Los candidatos son ±1, ±5, ±1/3 y ±5/3, así que respondo C, −3/5, que está al revés. Se entiende.

**Ejercicio inventado.** 3x³ − x² − 3x + 1 = 0. Los candidatos son ±1 y ±1/3. P(1) = 3 − 1 − 3 + 1 = 0. Ruffini con 1 da 3, 2, −1 y resto 0, o sea 3x² + 2x − 1 = (3x − 1)(x + 1). La raíz no entera es 1/3. Lo compruebo: 3/27 − 1/9 − 1 + 1 = 0 ✓.

### Nota

De las seis preguntas con alternativas, cuatro tienen la respuesta en D (grado-raices Predice y Ahora tú, viete Ahora tú, raices-racionales Predice). No me ayudó, pero se nota.

### Lo que me trabó

- raices-racionales, 2 Juega: la lista de botones (±1/2, ±1, ±3/2, ±3) aparece sin explicar de dónde sale, y en 3 Predice Nox dice «recuerda de dónde salían», pero el juego no lo dijo; tuve que adivinar qué va arriba y qué abajo.
- raices-racionales, 4 Mira (paso 1): no dice de qué polinomio son «un divisor de 3» y «uno de 2», y la tabla «número / P(número)» sale vacía.
- viete, 4 Mira (paso 1): la tabla «con las raíces / en P» sale vacía y su primera columna no tiene título; parece rota.
- viete, 2 Juega: al empezar, la suma y el producto valen 6 los dos (y −6x², −6), así que no se sabe qué 6 es cuál hasta mover una barra.
- viete, 1 Lee: «vale 0 justo en sus tres aristas» confunde; vale 0 en las medidas 1, 2 y 3, no en las aristas.
- grado-raices, 6 Así se resuelve: las etiquetas «2 808» y «−2 808» del eje y se cortan contra el borde izquierdo, y la curva va pegada al eje entre 2,5 y 3,5, así que no se ve la raíz 3.
- grado-raices, 5 La regla: el «Vale si» habla de «un trinomio sin raíces reales», pero el ejemplo de la tabla es x² + 4, un binomio.
- grado-raices, 2 Juega: el círculo de la barra de d está pegado a la izquierda con d = 0; no sé si d puede ser negativo.
- viete, 7 Ahora tú: los «Datos» y Nox dan la fórmula exacta; la pregunta queda regalada.

## Lector B: momentos de las ideas 4, 5 y 6 y las 18 tarjetas

Soy un alumno de 5.º que no conoce la app. Solo miré las capturas.

Aviso una sola vez: de Lee solo veo la tarjeta 1 de 4, de Mira solo el paso 1 y de «Así se resuelve» solo el paso 1 («¿Qué me piden?»). No lo cuento como falla.

### Parte 1: momentos

#### Idea 4: Raíces en pareja (conjugadas)

**1 Lee.** Veo un cuadrado con borde naranja y relleno de rayitas (el huerto) con «? m» arriba y «2 m²» en el centro, y debajo «Huerto del colegio». Me piden leer. x es el lado y √2 y −√2 son las raíces de x² = 2. Me quedó claro que la ecuación da las dos raíces juntas, aunque el lado solo puede ser √2. No tuve dudas.

**2 Juega.** Veo una tabla «compañera | suma | producto» con 2 + √3 | 4 + 2√3 | 7 + 4√3, el letrero «coeficientes no enteros», una frase grande «suman 4 + 2√3 y multiplican 7 + 4√3», una leyenda y cuatro botones: 2 + √3, −2 + √3, −2 − √3 y 2 − √3. Me piden elegir la compañera para que (x − raíz)(x − compañera) tenga coeficientes enteros. «Compañera» es la otra raíz, «suma» es raíz + compañera y «producto» es raíz · compañera. **Aprendí** que si elijo 2 − √3 el √3 se cancela (suma 4, producto 1). Dudé con el «2 + √3 y» suelto a la izquierda de la tabla, que parece cortado, y con la frase de abajo en otra letra (con serifas), que no sé si es la misma ecuación u otra cosa.

**3 Predice.** Veo la tabla «raíz 2 + 3i | compañera ?», Datos «i² = −1» y las opciones −2 + 3i, 3 + 2i, 2 − 3i y −2 − 3i. Me piden la otra raíz segura de un polinomio de grado 3 con coeficientes enteros. Elijo C, 2 − 3i, por lo que hice con √3. El salto de √3 a i es grande, porque en Juega solo vi raíces con √. La pista de Nox me ayudó.

**4 Mira.** Veo una tabla «pareja | suma | producto» con «2 ± 3i» y celdas vacías. El paso 1 dice que x − (2 + 3i) es un factor de P. **Aprendí** que cada raíz da un factor. Dudé con la P, que aparece sin que nadie diga que P es el polinomio.

**5 La regla.** La tabla está llena: 2 ± 3i suma 4 y da producto 13; 1 ± √2 suma 2 y da producto −1. Comprobé las cuentas: 4 + 9 = 13 y 1 − 2 = −1, y también 1 ± 2i, que suma 2 y da producto 5. Están bien. Me piden entender que la raíz con √ inexacta o con i llega con su conjugada. Me hizo dudar Nox con «la conjugada conserva la parte **entera**». En clase, la parte entera de 2 + √3 es 3 (porque 2 + √3 ≈ 3,7). Yo entendí «el número de adelante», pero lo tuve que adivinar. También dudé con «√ inexacta», que creo que significa «raíz que no sale exacta».

**6 Así se resuelve.** Veo la tabla «1 − i y ? | ? | ?». Piden la cúbica que empieza con x³ y tiene las raíces 1 − i y 4. Los Datos traen la conjugada, el factor x² − (suma)x + (producto) y la línea «√−9 = 3i». Esta última no sirve para este problema y me distrajo. El paso 1 se entiende.

**7 Ahora tú.** Si −1 + 2√2 es raíz, ¿cuál otra es raíz seguro? Respondo D, −1 − 2√2. Se entiende. La pista vuelve a decir «parte entera», y aquí la parte de adelante es −1, lo que me confunde más.

**Ejercicio mío.** Una cúbica con coeficientes enteros que empieza con x³ tiene las raíces 2 + √5 y 1. ¿Cuál es? La pareja 2 ± √5 suma 4 y da producto 4 − 5 = −1, así que el factor es x² − 4x − 1. Queda (x² − 4x − 1)(x − 1) = x³ − 5x² + 3x + 1. También resolví el de «Así se resuelve»: (x² − 2x + 2)(x − 4) = x³ − 6x² + 10x − 8.

#### Idea 5: Bicuadradas y recíprocas (cambio de variable)

**1 Lee.** Veo el huerto 1 (pequeño, naranja, «1 m²» debajo) y el huerto 2 (grande, verde, «4 m²» dentro), cada uno con «? m». Me piden leer que x² vale 1 o 4, que da (x² − 1)(x² − 4) = x⁴ − 5x² + 4. La cuenta está bien. No tuve dudas; solo noto que el título dice «y recíprocas» y en esta tarjeta no aparece nada de recíprocas.

**2 Juega.** Veo una recta con el título «x» y dos puntos verdes: «u = −1», alto, sobre el −1, y «u = 1», más bajo, sobre el 1. Con líneas punteadas bajan a dos puntos morados en −1 y 1. Debajo dice «x⁴ − 1 = 0: u = 1 y u = −1», y hay dos deslizadores u₁ = 1 y u₂ = −1. La misión pide que la ecuación sea x⁴ − 13x² + 36 = 0, así que pondría u₁ = 4 y u₂ = 9. La leyenda dice que u es x² (el área del huerto) y x es una raíz (el lado, con + o con −). **Aquí me trabé.** El dibujo hace parecer que u = −1 da la raíz x = −1 y u = 1 da la raíz x = 1, cuando en verdad u = 1 da las dos (±1) y u = −1 no da ninguna real. Además los valores de u están puestos sobre el eje de x, y no sé qué significa la altura de cada punto verde. Tampoco sé si los deslizadores llegan a 9. **Aprendí** (por el texto, no por el dibujo) que un u negativo no da lados reales.

**3 Predice.** Veo la recta vacía con «x» arriba a la izquierda. ¿Cuántas raíces reales tiene x⁴ + 3x² − 4 = 0? Datos: x⁴ = (x²)². Resuelvo u = 1 o u = −4 y me quedan 2 reales: C. La recta vacía no regala nada. La «x» sola arriba parece el nombre de un eje vertical que no existe.

**4 Mira.** Recta vacía. El paso 1 cambia x⁴ − 10x² + 9 = 0 por u² − 10u + 9 = 0, con la u en verde. **Aprendí** que primero se trabaja en u y al final se vuelve a x. No tuve dudas.

**5 La regla.** Veo la recta con «u = 1» (verde, sobre el 1) y «u = 9» (verde, arriba, sobre el 9), y raíces moradas en −3, −1, 1 y 3. El −1 y el 1 están sobre la recta, pero el −3 y el 3 flotan por encima. ¿Por qué? Otra vez u y x están en el mismo eje: el 9 está en la posición 9 del eje x, aunque 9 no es raíz. La regla dice que u positivo da dos raíces opuestas y u negativo da dos no reales, con u = x² y au² + bu + c = 0, y se entiende. Lo que no entendí es el «Vale si»: habla de la ecuación recíproca, de dividir entre x² y de t = x + 1/x, con x² + 1/x² = t² − 2. Es una regla nueva y no una condición, y no sé qué es una ecuación recíproca. La t aparece sin color y sin explicación. Tampoco dice qué pasa si u = 0.

**6 Así se resuelve.** Recta de −6 a 6, vacía. Hay que resolver x⁴ − 52x² + 576 = 0. Por mi cuenta: u² − 52u + 576 = 0 tiene Δ = 2704 − 2304 = 400, así que u = 36 o u = 16 y x = ±6 o x = ±4. Cabe en la recta. El paso 1 se entiende.

**7 Ahora tú.** ¿Cuántas raíces reales tiene x⁴ − 5x² + 6 = 0? u = 2 o 3, que da ±√2 y ±√3: 4 (D). Se entiende.

**Ejercicio mío.** x⁴ − 5x² − 36 = 0 da u² − 5u − 36 = (u − 9)(u + 4), así que u = 9 (x = ±3) o u = −4 (x = ±2i). Tiene 2 raíces reales.

#### Idea 6: Ecuaciones de dos términos (binómica)

**1 Lee.** Veo una caja de cartón cúbica con «?» en un lado y «8 dm³» debajo; arriba queda mucho espacio vacío. Me piden leer: la arista cumple x³ = 8, o sea x³ − 8 = 0, una ecuación de dos términos. Rubén es el que quiere la caja. No tuve dudas.

**2 Juega.** Veo la recta de −2 a 2 con puntos morados en −1 y 1, el texto «x² = 1: 2 reales y 0 no reales; 2 + 0 = 2», el deslizador n = 2 y los botones «El número: 1 / −1». La misión pide 2 reales y 4 no reales: pondría n = 6 con 1. El punto morado es una raíz real y n es el exponente, o sea el grado. **Aprendí** que xⁿ = 1 o −1 tiene n raíces, pero en la recta solo se ven las reales. No sé si el deslizador llega a 6, porque está al mínimo.

**3 Predice.** Veo la tabla «raíz | sale de» con 2 → x − 2 y dos «?» → x² + 2x + 4. Datos: x³ − 8 = (x − 2)(x² + 2x + 4). ¿Cuánto suman las dos raíces no reales? Respondo −2 (A), por −b/a del trinomio. Me salió porque ya conozco la suma de raíces. Si no la recuerdo, los Datos no me la dan.

**4 Mira.** Tabla «ecuación | reales | no reales» con x⁴ = 16. El paso 1 dice x⁴ − 16 = (x² + 4)(x² − 4). **Aprendí** que se pasa todo a un lado y se factoriza. No tuve dudas.

**5 La regla.** La tabla de n impar/par contra número positivo/negativo se entiende muy bien. La regla dice que xⁿ igual a un número tiene n raíces. Me hizo dudar Nox con «mira el signo de Δ en cada trinomio», porque la Δ no se explica en esta pantalla.

**6 Así se resuelve.** Tabla con x − 4 y dos veces x² + 4x + 16. ¿Cuáles son las tres raíces de x³ = 64? Los Datos traen A³ − B³, la fórmula general, Δ e i. Por mi cuenta: Δ = 16 − 64 = −48 y √−48 = 4√3 i, así que x = 4 o x = −2 ± 2√3 i. El paso 1 se entiende.

**7 Ahora tú.** ¿Cuántas raíces reales tiene x⁵ = −243? Respondo 1 (B), que es −3. Se entiende.

**Ejercicio mío.** x³ = −27 da (x + 3)(x² − 3x + 9). Δ = 9 − 36 = −27, así que x = −3 o x = (3 ± 3√3 i)/2.

### Parte 2: tarjetas de ejemplos

Por los títulos, las tarjetas 01–03 son de grado y raíces, 04–06 de Vieta, 07–09 de raíces racionales, 10–12 de conjugadas, 13–15 de cambio de variable y 16–18 de binómica. Cada idea tiene los niveles 3, 8 y 14.

| Tarjeta | ¿Qué piden? | ¿Tengo todo? | ¿Sigo el Resuelto? | Dibujo | Algo raro / cuentas |
|---|---|---|---|---|---|
| 01 (3) Raíz repetida | Cuántas veces cuenta el 5 en (x−5)³(x+2) | Sí | Sí | No hay | Bien |
| 02 (8) Con el discriminante | Raíces no reales de (x+1)(x²−2x+5) | Sí | Sí, pero dice «Δ es negativo» antes de calcularlo | No hay | Δ = 4 − 20 = −16, bien |
| 03 (14) Largo del pasadizo | Largo si x(x−1) = 12 | Sí | Sí | Sobra un poco: dibuja un **cuadrado** para un rectángulo cuyo largo es menor que el ancho; no regala la respuesta | x = 4, largo 3, bien; distractores bien explicados |
| 04 (3) Productos de a dos | c/a en x³−2x²−5x+6 | Sí | Sí | No hay | −5, bien (raíces 1, −2 y 3) |
| 05 (8) Suma de cuadrados | x₁²+x₂²+x₃² | Sí | Sí | No hay | 1 + 20 = 21, bien (raíces 1, 2 y −4) |
| 06 (14) Diagonal de la caja | Diagonal con aristas raíces de x³−12x²+47x−60 | Sí, y de más | Sí | Ayuda poco: no dibuja la diagonal que piden | 144 − 94 = 50, √50 = 5√2, bien (aristas 3, 4 y 5). **Datos regala:** trae «√50 = 5√2», que es justo la opción D. «La suma de aristas es 12» confunde: una caja tiene 12 aristas y en total suman 48 |
| 07 (3) ¿Es raíz? | ¿2 es raíz de x³−3x²+4? | Sí | Sí | No hay | 8 − 12 + 4 = 0, bien. La P de «P(2)» no se nombra en el enunciado |
| 08 (8) Raíz no entera | La raíz fraccionaria de 2x³−x²−2x+1 | Sí | Sí | No hay | Bien. **Datos distrae:** trae la regla p/q, pero el Resuelto agrupa y no la usa |
| 09 (14) Parámetro | Menor raíz con k desconocido | Sí | Sí | No hay | k = −5; el Ruffini da x²+x−2, raíces 3, −2 y 1; bien |
| 10 (3) Escribir con i | Raíces de x²+25 | Sí | Sí | No hay | Bien |
| 11 (8) No reales con la fórmula | Resolver x²+2x+5 | Sí | Sí | No hay | −1 ± 2i, bien |
| 12 (14) Pareja con √ | b si 1+√2 y 3 son raíces | Sí | Sí | No hay | Suma 5, b = −5, bien. Dice «la B suma solo la pareja: 2», pero la opción B es −2. El ejemplo de los Datos (3 + √2) usa el mismo 3 que la raíz del problema y puede mezclarse |
| 13 (3) Un u negativo | x si u = −16 | Sí | Casi: muestra √−16 = 4i y la respuesta trae −4i sin escribir x = ±4i | No hay | Bien |
| 14 (8) Producto de las cuatro | Producto de raíces de 2x⁴−9x²+4 | Sí | **Me pierdo en «Se comprueba: u = 4 y u = 1/2»**: no dice de dónde salen | No hay | 4/2 = 2, bien; también lo comprobé con 2u²−9u+4 = (2u−1)(u−4). **Datos regala:** la regla del producto es toda la solución |
| 15 (14) Raíces positivas | Suma de raíces positivas de x⁴−34x²+225 | Sí | Casi: (u−9)(u−25) aparece sin decir que se buscan dos números que multiplican 225 y suman 34 | No hay | 3 + 5 = 8, bien |
| 16 (3) Ninguna real | Raíces reales de x⁶ = −1 | Sí | Sí | No hay | Bien |
| 17 (8) La suma de las tres | Suma de raíces de x³ = 125 | Sí | Sí | No hay | Da 0, bien. Me sorprende que la suma sea 0 si la única real es 5; no se comenta |
| 18 (14) Producto de las cuatro | Producto de raíces de x⁴ = 81 | Sí, si paso el 81 al otro lado | Sí | No hay | −81, bien. Los Datos dicen «producto = término independiente/a» sin avisar que primero hay que pasar todo a un lado: leyendo x⁴ = 81 sale 81 (la trampa A). «Cardano-Vieta» aparece por primera vez. «término independiente» tiene fondo lila aquí y no en la 14 |

**Las 3 que mejor se entienden:** 07 (¿Es raíz?), 09 (parámetro) y 15 (raíces positivas).
**Las 3 que peor se entienden:** 06 (los Datos regalan 5√2, «suma de aristas» confunde y no se dibuja la diagonal), 14 (los u salen de la nada y los Datos son la solución) y 18 (la trampa del signo viene de los mismos Datos).

**¿Suben los niveles de verdad?** Sí. El 3 es un paso, el 8 son dos o tres, y el 14 trae alternativas con cada error explicado. En conjugadas, el 10 (nivel 3) no trata de conjugadas sino solo de escribir con i.

**El recuadro Datos** ayuda casi siempre, porque no tengo que memorizar fórmulas. Pero regala la respuesta en la 06 (√50 = 5√2) y en la 14 (la regla del producto es toda la solución). Distrae en la 08 (regla p/q que no se usa), en Así se resuelve de conjugadas (√−9 = 3i) y en la 12 (el ejemplo con 3). En la 18 puede llevar a la opción incorrecta.

### Lo que me trabó

- Cambio de variable, Juega: el dibujo pone u = −1 sobre x = −1 y u = 1 sobre x = 1, como si cada u diera una sola raíz y u = −1 diera x = −1; u y x comparten el eje.
- Cambio de variable, Juega y La regla: no sé qué significa la altura de los puntos verdes; en La regla, −3 y 3 flotan mientras −1 y 1 están sobre la recta.
- Cambio de variable, La regla: el «Vale si» trae una regla nueva (recíproca, t = x + 1/x) en vez de una condición; no sé qué es una ecuación recíproca.
- Cambio de variable, Predice, Mira y Así se resuelve: la «x» suelta arriba a la izquierda parece el nombre de un eje que no existe.
- Conjugadas, La regla y Ahora tú: Nox dice «parte entera», pero la parte entera de 2 + √3 es 3; en −1 + 2√2 tampoco queda claro.
- Conjugadas, Predice: salta de √3 (Juega) a i sin haber jugado con i.
- Conjugadas, Juega: el «2 + √3 y» suelto junto a la tabla y la frase en otra letra parecen descolocados.
- Conjugadas, Mira: aparece P sin decir que es el polinomio.
- Conjugadas, Así se resuelve: el dato «√−9 = 3i» no sirve para ese problema.
- Binómica, Predice: para sumar las no reales hay que recordar −b/a; los Datos no lo dan.
- Binómica, La regla: Nox habla de Δ sin explicarla.
- Tarjeta 06: los Datos regalan la respuesta (√50 = 5√2); «suma de aristas 12» confunde; falta dibujar la diagonal.
- Tarjeta 14: «u = 4 y u = 1/2» aparece sin cómo; los Datos son toda la solución.
- Tarjeta 15: (u − 9)(u − 25) aparece sin explicar cómo se halló.
- Tarjeta 18: la regla «término independiente/a» de los Datos, leída sobre x⁴ = 81, lleva a 81 (la trampa).
- Tarjeta 12: la explicación de la B dice «2» y la opción es −2.
- Tarjeta 08: los Datos traen la regla p/q, que el Resuelto no usa.
- Tarjeta 03: dibuja un cuadrado para un rectángulo de largo menor que el ancho.
- Tarjeta 13: falta escribir x = ±4i antes de la respuesta.

## Correcciones de la ronda 1

Hechas junto con la auditoría (`rutinas/auditoria/algebra.ecuaciones-polinomiales.md`, «Correcciones (20 nov)»), que dice
la prueba de cada una. Capturas después: `/tmp/claude-0/-home-user/31d0ae9f-8026-5866-a5dc-2c8554ea89bf/scratchpad/e8-cierre-ep/despues/`.

| Lector | Lo que señaló | Qué se hizo |
|---|---|---|
| B | Bicuadradas (Juega, Mira/La regla, revelar de Predice): u y x en el mismo eje; u = −1 parecía dar x = −1; la altura de los puntos no decía nada | A2: la recta es solo la de x. Cada u positivo es una cota turquesa «u = 4» que une sus dos raíces ±√u, en su propia fila (la fila dice de qué u salen); un u negativo no pone nada en la recta y la lectura dice «u = −1: ninguna real». |
| A | Raíces racionales, Juega: la lista ±1, ±3, ±1/2, ±3/2 sale sin decir de dónde; Predice dice «recuerda de dónde salían» | M3: la consigna dice «Su lista: arriba, divisores del 3; abajo, del 2». La Predice sigue siendo una predicción: pide aplicarlo con los papeles cambiados (3x³ … + 2). |
| A | Mira de viete y de raíces racionales: tablas vacías en el paso 1, columna sin título | M4: viete con la columna «cuenta» y los nombres de las filas desde el paso 1; racionales con los números de la tabla desde el paso 1 y el polinomio dicho en el paso 1. |
| A | Juego de viete: al abrir, la suma y el producto valen 6 los dos | M5: arranca con 1, 2 y 4 dm (suma 7, volumen 8). |
| A | «Ahora tú» de viete: los Datos y Nox dan la fórmula exacta | La voz ya no repite las tres fórmulas («Primero mira qué cuenta te piden; después, qué coeficientes usa»). Los Datos se quedan: son las tres fórmulas entre las que se elige (contrato, punto 13: si el ejercicio practica elegir, van las fórmulas entre las que se elige). |
| A | «Vale si» de la idea 1: «un trinomio sin raíces reales» con x² + 4 de ejemplo, que es un binomio | M6: «un factor de grado 2 sin raíces reales»; el glosario de «raíz no real» igual. |
| A | «vale 0 justo en sus tres aristas» | B1: «vale 0 justo cuando x es 1, 2 o 3, sus medidas» (Lee) y «cuando x es el largo, el ancho o el alto» (consigna). |
| A | «Así se resuelve» de la idea 1: rótulos 2 808 cortados; la raíz 3 no se ve | M7: escala fija de −40 a 40 (lo que se sale se corta). |
| A | Cuatro de seis respuestas en D | No es del contenido: la app baraja las opciones de Predice y de «Ahora tú» en cada visita. Se deja. |
| A | El control de d arranca en el tope izquierdo | Se deja: d va de 0 a 4 para que la misión tenga una sola salida (con d = −2 habría otra); la lectura dice el valor. |
| A | Datos de Ruffini: «la anterior» se entiende a la segunda | B2: «cada casilla de abajo es el de arriba más (número que se prueba) · (la de abajo anterior)», en teoría y práctica. |
| B | «Parte entera» para el 2 de 2 + √3 (la parte entera es 3) | M1: «el número sin √ ni i» en las voces, soluciones y explicaciones (teoría y práctica). |
| B | Tarjeta 06: «√50 = 5√2» en los Datos es la opción D; «la suma de aristas es 12» | M8: el dato es la regla para simplificar con otro caso (√12 = 2√3); «las tres medidas suman 12». |
| B | Tarjeta 18: «producto = término independiente/a» leído sobre x⁴ = 81 lleva a 81 | M8: el dato dice «con la ecuación escrita como … = 0» (teoría y práctica) y el resuelto pasa primero el 81. |
| B | Tarjeta 14: u = 4 y u = 1/2 salen de la nada; los Datos son la solución | El resuelto dice (2u − 1)(u − 4) = 0. El dato del producto se queda (es la fórmula; el ejemplo de nivel 2 practica usarla). |
| B | Tarjeta 12: la B dice «2» y la opción es −2 | M9: «suma solo la pareja, 2, y da b = −2». |
| B | Binómica, Predice: hay que recordar −b/a | Voz: «Son las raíces de x² + 2x + 4: ¿qué suman las raíces de un trinomio (idea 2)?». No va como dato: la Predice no lleva fórmulas, y la suma −b/a de grado 2 ya está en la regla de la idea 2. Decidido por la sesión, Gerson revisa después. |
| B | Binómica, regla: Nox habla de Δ sin explicarla | Voz: «Factoriza: un trinomio con discriminante negativo (Δ = b² − 4ac < 0) no da raíces reales». |
| B | Bicuadradas, regla: el «Vale si» trae una regla nueva (recíprocas) | M10: la regla dice «Una ecuación recíproca usa t»; el «Vale si» es la condición: «t = x + 1/x sirve si la ecuación se lee igual al revés; entre x², x² + 1/x² = t² − 2». |
| B | Mira de conjugadas: P sin presentar | «Si 2 + 3i es raíz del polinomio P, …». |
| B | «Así se resuelve» de conjugadas: «√−9 = 3i» no sirve | El dato es «i² = −1». |
| B | Tarjeta 03: un cuadrado para un rectángulo de largo menor | B3: el pasadizo pasa a x por (x + 1) dm (x = 3, largo 4); la figura es la del enunciado; la respuesta sigue en D. |
| B | Tarjeta 13: falta x = ±4i | «x = 4i o x = −4i». |
| B | Tarjeta 15: (u − 9)(u − 25) sin cómo | «Dos números que multiplican 225 y suman 34 son 9 y 25». |
| B | Tarjeta 08: el dato p/q no se usa | El dato es el de agrupar. |
| B | Tarjeta 02: «Δ es negativo» antes de calcularlo | La cuenta va primero. |
| B | Tarjeta 07: P(2) sin nombrar | «Sí: con x = 2, vale 0». |
| B | Tarjeta 17: la suma 0 no se comenta | «La real, 5, y las dos no reales, que suman −5, dan 0». |
| B | Predice de conjugadas: salta de √3 a i | Se deja: es lo que se reserva para predecir; Lee 3 presenta la i y la voz remite a lo que hizo 2 + √3. |
| B | «2 + √3 y» suelto junto a la tabla; la lectura con otra letra; la «x» suelta arriba de la recta; «término independiente» resaltado en una tarjeta y no en otra | Son de las piezas compartidas (`alg-tabla`, `recta`) y de la app; no cambian una cuenta. Quedan para Gerson. |
| B | Tarjeta 06 no dibuja la diagonal | Se deja: `alg-caja` no la dibuja; no hace falta para resolver. |
