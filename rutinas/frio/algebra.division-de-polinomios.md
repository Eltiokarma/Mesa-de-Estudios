# Lector en frío: algebra.division-de-polinomios

19 nov 2026, ronda 1. Dos lectores nuevos, solo con capturas a 390 px (`--entera`), sin el código ni el `aprendizaje`:
el A, los momentos de las ideas 1 a 3; el B, los de las ideas 4 a 6 y 18 tarjetas de ejemplos (niveles 1, 2 y 3 de cada
idea). Capturas: `/tmp/claude-0/-home-user/31d0ae9f-8026-5866-a5dc-2c8554ea89bf/scratchpad/e6-cierre-div/lector/`. Sus
informes van tal cual; al final, «Correcciones de la ronda 1». La auditoría del contrato está en
`rutinas/auditoria/algebra.division-de-polinomios.md`.

## Lector A: momentos de las ideas 1, 2 y 3

Soy alumno de 5.º. Solo miré las capturas `claro-cel-<idea>-N-*.png`. De Lee veo solo la primera tarjeta (1/4 o 1/3), de Mira solo el paso 1 y de «Así se resuelve» solo el paso 1 («¿Qué me piden?»). Lo digo una vez aquí y no lo cuento como falla.

### Idea 1: Algoritmo de la división

**1 Lee.** *Qué veo:* «Pedido: x² + 5x + 7» con 1 cuadrado grande (loseta), 5 tiras y 7 cuadraditos, y la tarjeta 1/4 «El pasadizo de Rubén». *Qué me piden:* solo leer. *Símbolos:* x es el lado de la loseta en dm, y el pasadizo mide (x + 2) dm de ancho. *Dudas:* ninguna. Se entiende que hay que cubrir un rectángulo con esas piezas.

**2 Juega.** *Qué veo:* un rectángulo con ancho (x + 2) dm (verde, al costado) y largo (x + 1) dm (morado, arriba), armado con la loseta, 3 tiras y 2 cuadraditos. A la derecha, «Sobran:» 2 tiras y 5 cuadraditos. Debajo está la cuenta (x + 2)·(x + 1) + (2x + 5) = x² + 5x + 7, una leyenda y el deslizador «Tramos de 1 dm en el largo» en 1. *Qué me piden:* armar el pasadizo más largo sin huecos. *Símbolos:* el verde es el divisor, el morado el cociente y el naranja lo que sobra (el resto). «Faltan» son los huecos. *Aprendí:* dividir es ver cuántas veces entra el ancho y lo que no entra es el resto. *Comprobé:* (x + 2)(x + 1) = x² + 3x + 2, y si le sumo 2x + 5 me da x² + 5x + 7. Está bien. *Dudas:* la leyenda llama «el resto» a lo que sobra, pero aquí sobra 2x + 5, que tiene el mismo grado que el divisor. En La regla dicen que el resto debe tener menor grado. Me confundió un rato si 2x + 5 «ya es» el resto o todavía no.

**3 Predice.** *Qué veo:* una tabla de grados con D = 7, d = 3 y q = ?, más 4 opciones. *Qué me piden:* el grado del cociente. *Datos:* grado = mayor exponente, y xᵐ·xⁿ = xᵐ⁺ⁿ. *Mi respuesta:* 7 − 3 = 4 (C). *Dudas:* ninguna. Con el dato de los exponentes casi te lo dicen, pero igual hay que pensar.

**4 Mira (paso 1/5).** *Qué veo:* el largo es x dm y entran la loseta y 2 tiras. Sobran 3 tiras y 7 cuadraditos. *Cuenta:* (x + 2)·x = x² + 2x. *Comprobé:* x² + 5x + 7 − (x² + 2x) = 3x + 7, que son 3 tiras y 7 cuadraditos. Coincide. *Aprendí:* se va alargando tramo por tramo y lo que sobra va bajando. *Dudas:* ninguna.

**5 La regla.** *Qué veo:* el pasadizo con largo (x + 3), que usa la loseta, 5 tiras y 6 cuadraditos. Sobra 1 cuadradito. Debajo está la regla D = d·q + r, con «grado de q = grado de D − grado de d» y «Vale si el divisor d no es el polinomio 0». *Comprobé:* (x + 2)(x + 3) = x² + 5x + 6, más 1 da 7. Bien. *Dudas:* la frase «El resto tiene grado menor que d: a lo más, uno menos» la tuve que leer dos veces. El «a lo más, uno menos» suena cortado.

**6 Así se resuelve (paso 1).** *Enunciado:* divisor x + 1, cociente x² + 4x + 5 y resto −2. Piden D. Los datos son útiles. *Lo resolví yo:* D = (x + 1)(x² + 4x + 5) − 2 = x³ + 5x² + 9x + 5 − 2 = x³ + 5x² + 9x + 3. *Dudas:* ninguna en el paso visible.

**7 Ahora tú.** *Pregunta:* D de grado 9 entre d de grado 1. ¿Qué grado tiene q? *Respuesta:* 8 (C). Está claro.

**Ejercicio mío.** Divide x² + 7x + 13 entre x + 3. Pruebo con q = x + 4: (x + 3)(x + 4) = x² + 7x + 12, y sobra 1. Entonces q = x + 4 y r = 1, que tiene grado 0, menor que 1. Si pruebo con x + 5 me pasa (x² + 8x + 15), así que x + 4 es el más largo.

### Idea 2: División clásica y Horner

**1 Lee.** *Qué veo:* un cuaderno con d = x² + x − 1 y la fila «D 1 4 1 −2» bajo x³, x², x y x⁰. La tarjeta 1/3 «La división del colegio» dice que 1375 = 12·114 + 7. *Comprobé:* 12·114 = 1368 y más 7 da 1375. Bien. *Símbolos:* el 12 verde es el divisor, el 114 morado el cociente y el 7 naranja el resto. Es el mismo color que en la idea 1, y eso ayuda. *Dudas:* el título dice «Horner», pero en esta tarjeta todavía no aparece qué es.

**2 Juega.** *Qué veo:* la división de x³ + 4x² + x − 2 entre x² + x − 1 en columnas (D, d·q, queda) y dos deslizadores, «Coeficiente de x en q» y «Término sin x de q», los dos en 0. El mensaje dice «Queda x³ + 4x² + x − 2: grado 3 ≥ 2». *Qué me piden:* elegir q para que lo que queda tenga menor grado que el divisor. *Lo hice en papel:* q = x + 3 da d·q = x³ + 4x² + 2x − 3, y queda −x + 1, de grado 1 < 2. *Aprendí:* el cociente se elige columna por columna para que se anulen las primeras. *Dudas:* ninguna. La pista de Nox (primero la columna de x³) ayuda.

**3 Predice.** *Qué veo:* D = 6 1 0 4 −1 con el 0 de x² resaltado en morado, d = 2x² + x − 1 y q = ?. *Pregunta:* el primer término del cociente. *Respuesta:* 6x⁴ ÷ 2x² = 3x² (C). *Dudas:* el 0 de x² sale en morado, que es el color de q. Pensé un momento que ese 0 era parte del cociente.

**4 Mira (paso 1/6).** *Qué veo:* «Se escriben todos los coeficientes, con 0 en x²», es decir 6 1 0 4 −1, otra vez con el 0 morado. *Aprendí:* no hay que olvidar el 0 de la potencia que falta. *Dudas:* el mismo color morado del 0.

**5 La regla.** *Qué veo:* una tabla de Horner con 2, −1 y 1 a la izquierda en verde, arriba 6 1 0 4 −1, en medio las filas −3 3, 1 −1 y −2 2, y abajo 3 −1 2 (morado) | 1 1 (naranja). El texto dice que cada término de q es el primero de lo que queda entre el primero de d. Debajo están 6x⁴ ÷ 2x² = 3x² y «queda: D − d·3x²». *Comprobé la tabla:* q = 3x² − x + 2 y r = x + 1. Al multiplicar, (2x² + x − 1)(3x² − x + 2) = 6x⁴ + x³ + 0x² + 3x − 2, y más x + 1 da 6x⁴ + x³ + 4x − 1. Está bien. *Dudas, y aquí me trabé:* la tabla aparece ya llena y nadie explica cómo se arma. No sé por qué el +1 y el −1 de d se vuelven −1 y 1 (signo cambiado), por qué el 2 de arriba no cambia, ni por qué abajo sale 3 y −1 en vez de la suma de la columna (hay que dividir entre 2). El texto explica la división clásica, no la tabla. Nox dice que «Horner es esta misma cuenta, en una tabla y sumando», pero con eso no la puedo repetir yo solo.

**6 Así se resuelve (paso 1).** *Enunciado:* 6x⁴ − 5x³ + 8x² + 3x + 3 entre 2x² − x + 3. Piden q y r. *Lo resolví yo (división clásica):* 3x² deja −2x³ − x² + 3x + 3; −x deja −2x² + 6x + 3; −1 deja 5x + 6. Entonces q = 3x² − x − 1 y r = 5x + 6. *Dudas:* no sé si en los pasos siguientes lo hacen con la tabla de Horner. Si es así, me faltaría saber armarla (ver La regla).

**7 Ahora tú.** *Pregunta:* el primer término del cociente de −4x⁴ + 5x² − 4 entre 4x³ + x + 6. *Respuesta:* −4x⁴ ÷ 4x³ = −x (C). Fácil. La pista de Nox («escribe las columnas completas») no hacía falta para esta pregunta.

**Ejercicio mío.** Divide x³ + 2x² − x + 3 entre x² + x + 1. Primero x: me queda x² − 2x + 3. Después +1: me queda −3x + 2. Entonces q = x + 1 y r = −3x + 2. *Comprobación:* (x² + x + 1)(x + 1) = x³ + 2x² + 2x + 1, y más (−3x + 2) da x³ + 2x² − x + 3. Bien.

### Idea 3: Regla de Ruffini

**1 Lee.** *Qué veo:* la tabla de x³ + 2x² − x + 3 entre x − 1, con a = 1 en verde, arriba 1 2 −1 3, en medio 1 3 2, abajo 1 3 2 en morado y el 5 en una caja naranja, más flechas verdes en diagonal. La tarjeta 1/3 dice «Un atajo para x − a» (Paolo Ruffini). *Comprobé:* 1; 2 + 1 = 3; −1 + 3 = 2; 3 + 2 = 5. Bien. *Dudas:* las flechas muestran «multiplica y sube», pero no hay nada que muestre la suma hacia abajo ni que el primer número solo baja. Con las otras tarjetas quizá se explica.

**2 Juega.** *Qué veo:* la misma tabla, la cuenta (x − 1)(x² + 3x + 2) + 5 = x³ + 2x² − x + 3, una leyenda (a = el número que anula a x − a; abajo = el cociente; la caja = el resto; la flecha = multiplica por a y sube) y el deslizador a = 1. *Misión:* elegir a para que el cociente sea x² + 4x + 7. *Lo hice:* con a = 2 sale 1; 2 + 2 = 4; −1 + 8 = 7; 3 + 14 = 17. Entonces a = 2, el cociente es x² + 4x + 7 y el resto 17. *Aprendí:* cambiar a cambia todo el cociente y el resto. *Dudas:* ninguna. La leyenda es clara.

**3 Predice.** *Pregunta:* el resto de 2x³ − 5x + 1 entre x − 2. Dato: x − 2 vale 0 con x = 2. *Respuesta:* 2; 4; 3; 7. El resto es 7 (D). *Dudas:* ninguna.

**4 Mira (paso 1/6).** *Qué veo:* arriba 2 0 −5 1, con el 0 en morado, a = 2 y la caja del resto vacía. *Aprendí:* el 0 va por el x² que falta. *Dudas:* otra vez el 0 sale en morado, como el cociente de abajo.

**5 La regla.** *Qué veo:* la tabla completa (2 0 −5 1; en medio 4 8 6; abajo 2 4 3 y 7), el texto «se baja el primero; cada casilla nueva es la de arriba más a por la anterior», la fórmula nueva = arriba + a · anterior y «Vale si el divisor es x − a; con x + a se usa −a». *Comprobé:* 2·2 = 4 y 0 + 4 = 4; 4·2 = 8 y −5 + 8 = 3; 3·2 = 6 y 1 + 6 = 7. Bien. *Dudas:* en el recuadro de la fórmula, «+ a ·» queda al final de un renglón y «anterior» baja solo al siguiente. Parece cortado y me costó ver que era a·anterior.

**6 Así se resuelve (paso 1).** *Enunciado:* x³ − 2x + 5 entre x + 3, con la tabla 1 0 −2 5 y a = −3. *Lo resolví yo:* 1; −3; 9 − 2 = 7; −21 + 5 = −16. Entonces q = x² − 3x + 7 y r = −16. *Dudas:* ninguna.

**7 Ahora tú.** *Pregunta:* el número que va en «?» en la tabla de −3x³ − x² − 3x − 5 entre x + 2. *Respuesta:* −1 + (−2)(−3) = 5 (C). *Dudas:* en la fila de arriba los números quedan mal espaciados: hay mucho espacio entre −1 y −3 y el −3 y el −5 están pegados. Abajo hay casilla para el −3 y para «?», un hueco sin casilla y luego la caja. Igual se entiende.

**Ejercicio mío.** Divide 2x³ + 3x² − 5x + 4 entre x + 2, con a = −2. Sale 2; 3 − 4 = −1; −5 + 2 = −3; 4 + 6 = 10. Entonces q = 2x² − x − 3 y r = 10. *Comprobación:* (x + 2)(2x² − x − 3) = 2x³ + 3x² − 5x − 6, y más 10 da 2x³ + 3x² − 5x + 4. Bien.

### En resumen

Las tres ideas se siguen bien. Las piezas del pasadizo (idea 1) explican muy bien el resto. Todas las cuentas que comprobé están correctas. Lo más flojo es la tabla de Horner en La regla de la idea 2: aparece armada y sin explicación.

### Lo que me trabó

- Algoritmo, 2 Juega: lo que sobra (2x + 5) se llama «el resto», pero tiene el mismo grado que el divisor. Choca con La regla.
- Algoritmo, 5 La regla: la frase «a lo más, uno menos» suena cortada y la leí dos veces.
- Horner, 3 Predice y 4 Mira: el 0 de x² sale en morado, el color de q. Parece parte del cociente.
- Horner, 5 La regla: la tabla de Horner aparece llena y sin explicación. No sé por qué cambian los signos de d, por qué el primero (2) no cambia ni por qué se divide entre 2 para la fila de abajo. No la podría repetir solo.
- Ruffini, 1 Lee: las flechas muestran «multiplica y sube», pero no se ve la suma hacia abajo ni que el primer número solo baja.
- Ruffini, 4 Mira: el 0 del x² que falta sale otra vez en morado, como el cociente.
- Ruffini, 5 La regla: en la fórmula, «+ a ·» queda al final de un renglón y «anterior» baja solo al siguiente.
- Ruffini, 7 Ahora tú: los números de arriba están mal espaciados (−3 y −5 pegados) y en la fila de abajo falta la casilla de la tercera columna.

## Lector B: momentos de las ideas 4, 5 y 6 y las 18 tarjetas

Soy un alumno de 5.º de Juliaca. Solo miré las capturas PNG. En Lee solo veo la primera tarjeta, y en Mira y en «Así se resuelve» solo el primer paso. Lo digo aquí una vez y no lo cuento como falla.

### Parte 1: momentos

#### Idea 4: Divisor de la forma cx + b

**1 Lee.**
1. Veo una tira vertical hecha de 6 cuadrados grandes y varias rayitas, con «largo: x dm» arriba y «ancho: (6x + 6) dm» a la izquierda. A la derecha dice «Sobran:» con un cuadradito naranja. Debajo está la tarjeta 1/4 «Más ancho, más corto»: Rubén tiene (6x² + 6x + 1) dm² de piezas y puede armar un pasadizo de ancho (x + 1), (2x + 2) o el triple.
2. Leer. No piden nada.
3. x es el lado de la loseta (eso lo supe recién en Juega). El color verde es el ancho y el morado es el largo.
5. El dibujo muestra el caso de ancho 6x + 6, pero la tarjeta habla de x + 1 y 2x + 2. Además, «largo: x» está escrito sobre el lado corto y el «ancho» es el lado alto. Para mí, en un pasadizo el largo es lo largo. Me confundió.

**2 Juega.**
1. Veo un pasadizo horizontal de 6 losetas con sus tiras, ancho (x + 1) y largo 6x, y un cuadradito que sobra. Hay botones de ancho: x + 1, 2x + 2, 3x + 3 y 6x + 6. Está la ecuación (x + 1)·6x + 1 = 6x² + 6x + 1 y una leyenda.
2. La misión: elegir el ancho para que el largo mida 3x. Es 2x + 2, porque (2x + 2)·3x = 6x² + 6x y sobra 1.
3. El divisor es el ancho (verde), el cociente es el largo (morado) y el resto es lo que sobra (naranja). La leyenda está clara.
4. Aprendí que si el ancho crece 2 veces, el largo baja a la mitad y lo que sobra no cambia.
5. Nada.

**3 Predice.**
1. Veo un cuaderno con la tabla de Ruffini de 4x² − 2x + 5 entre 2x − 1, usando 1/2. Abajo quedan 4, 0 y 5 (el 5 en un recuadro naranja). Debajo dice «q = ?». Las opciones son 4x, 2x, 2x + 5 y 8x. En Datos dice «2x − 1 vale 0 con x = 1/2».
2. Encontrar el cociente q.
3. q es el cociente (morado).
5. Lo resolví recordando el pasadizo: la tabla da 4x, y como el divisor es el doble de x − 1/2, el cociente es la mitad, 2x. Comprobé: (2x − 1)·2x + 5 = 4x² − 2x + 5. Está bien. Sin Juega no lo habría sacado.

**4 Mira (paso 1/5).**
1. Veo la tabla de 6x² + 6x + 1 entre 2x + 2 con −1. Abajo quedan 6, 0 y 1. Dice «2x + 2 vale 0 con x = −1: la tabla usa −1».
2. Mirar.
3. El −1 está en verde porque viene del divisor.
4. Aprendí que la tabla usa el número que hace 0 al divisor.
5. Nox dice «Yo había comprimido un paso. Abrámoslo». No entendí qué paso comprimió ni cuándo lo hizo.

**5 La regla.**
1. Veo la misma tabla con «q = 6x ÷ 2 = 3x, r = 1». Las fórmulas son x = −b/c, q = q′/c y r = la última casilla. Dice «Vale si c es distinto de 0».
2. Leer la regla.
3. b y c son los números de cx + b. q′ es el «cociente falso» y q es el verdadero.
5. Lo de Nox, cx + b = c(x + b/c), me ayudó. Está bien.

**6 Así se resuelve (paso 1).**
1. Veo la tabla vacía de −3x³ − 9x² + 6x + 30 entre 3x + 6, con −2. Datos: la regla de cx + b, q = q′ ÷ c y «cada casilla nueva de abajo: el coeficiente de arriba más **a** por la casilla anterior».
2. Primero entender qué me piden: q y r.
3. Aquí apareció una letra **a** que nadie definió. Supongo que es el −2 (el número x = −b/c), pero la regla lo llamó x, no a.
5. Lo hice yo: −3, −3, 12 y resto 6. q′ = −3x² − 3x + 12, así que q = −x² − x + 4 y r = 6. Comprobé con d·q + r y cuadra.

**7 Ahora tú.**
1. Piden el cociente de 9x³ − 15x² + 3x + 4 entre 3x − 2. Los Datos son los mismos (con la a otra vez). Opciones: 27x² − 27x − 9, 9x² − 9x − 3, 3x² − 3x − 1 y 3x² − 3x + 1.
2. Elegir el cociente.
3. Lo mismo que antes.
5. Con x = 2/3 salen 9, −9, −3 y resto 2. q′ = 9x² − 9x − 3, así que q = 3x² − 3x − 1 (la C). Está bien.

**Mi ejercicio.** Divide 6x² + x − 2 entre 2x − 1. Con x = 1/2: 6, 1 + 3 = 4, −2 + 2 = 0. q′ = 6x + 4, así que q = 3x + 2 y r = 0. Compruebo: (2x − 1)(3x + 2) = 6x² + x − 2.

#### Idea 5: Teorema del resto

**1 Lee.**
1. Veo «loseta: x = 5 dm», un rectángulo gris de ancho x − 2 = 3 dm (verde) y largo x + 3 = 8 dm (morado), y 7 cuadraditos naranjas (7 dm²). La tarjeta 1/3 dice que x² + x + 1 = (x − 2)(x + 3) + 7.
2. Leer.
3. x es el lado de la loseta, x − 2 es el ancho y x + 3 es el largo. El 7 es lo que sobra.
5. Comprobé: (x − 2)(x + 3) + 7 = x² + x + 1. Está bien.

**2 Juega.**
1. Lo mismo, con un deslizador «Lado de la loseta, x (dm)» en 5. La ecuación es D(5) = (5 − 2)·8 + 7 = 31 dm².
2. Achicar la loseta hasta que el rectángulo desaparezca: x = 2.
3. D(5) es el área total cuando x = 5. La leyenda dice qué es el divisor, el cociente y el resto.
4. Aprendí que cuando el ancho llega a 0, solo quedan los 7 cuadraditos: el resto.
5. En la ecuación el ancho sale como (5 − 2), pero el largo sale ya hecho, «8», en vez de (5 + 3). Me hizo dudar un poco.

**3 Predice.**
1. Veo el cuaderno con D = x⁵ − 3x² + 7, d = x + 1 y r = ?. Datos: x + 1 = x − (−1). Opciones: 9, 7, 5 y 3.
2. Encontrar el resto.
5. Con x = −1: −1 − 3 + 7 = 3 (la D). Sin problema.

**4 Mira (paso 1/5).**
1. Veo el mismo rectángulo con x = 5 y «Para cualquier loseta, D(x) = (x − 2)(x + 3) + 7. D(5) = 3·8 + 7 = 31».
2. Mirar.
4. Aprendí que la igualdad vale para cualquier x, así que puedo elegir la x que borra el rectángulo.
5. Nada.

**5 La regla.**
1. Veo la loseta con x = 2: ancho x − 2 = 0, largo 5 en línea punteada y los 7 cuadraditos. La regla dice «el resto de dividir D(x) entre x − a es D(a)». Las fórmulas son D(x) = d·q + r y «si d(a) = 0: r(a) = D(a)».
2. Leer.
3. a es el número que anula al divisor.
5. Escriben **r(a)**, como si el resto fuera una función, pero el resto es un número. Me confundió. Nox habla de un divisor de grado 2 y de un resto mx + n que «sale de dos cuentas». Eso no se explicó en ningún lado y me asustó. Además, el letrero «x − 2 = 0 dm» queda apretado junto a «largo».

**6 Así se resuelve (paso 1).**
1. Solo texto, **sin dibujo**: una cartulina de 30 por 16 cm a la que se le cortan cuadrados de x cm en las esquinas para armar una caja sin tapa. Piden el resto de dividir V(x) entre x − 7. Datos: el teorema del resto y «volumen = largo · ancho · alto».
2. Entender qué me piden: el resto, sin dividir.
3. V(x) es el volumen.
5. Sin dibujo de la cartulina me costó ver que el largo es 30 − 2x y el ancho 16 − 2x. Los Datos no lo dicen. Lo saqué yo: V(7) = 7·16·2 = 224.

**7 Ahora tú.**
1. Piden el resto de 3x³ + 3x² + 4x + 1 entre x − 3. Opciones: 1, −65, 121 y 11.
2. Elegir el resto.
5. D(3) = 81 + 27 + 12 + 1 = 121 (la C). Las otras salen de x = 0, x = −3 y x = 1, así que tienen sentido como trampas.

**Mi ejercicio.** El resto de x³ − 2x² + 4 entre x − 2: D(2) = 8 − 8 + 4 = 4.

#### Idea 6: Cocientes notables

**1 Lee.**
1. Veo una calculadora con «992 ÷ 8» y la pantalla 124 en morado. La tarjeta 1/3 dice que con x = 10, x² + 2x + 4 vale 124: los coeficientes se leen como cifras mientras ninguno pase de 9.
2. Leer.
3. x vale 10.
5. En la tarjeta 1 todavía no se ve qué tiene que ver 992 ÷ 8 con x² + 2x + 4. Supongo que lo explica la tarjeta 2 (992 = 10³ − 2³).

**2 Juega.**
1. Veo la calculadora con 999 ÷ 9 = 111, la ecuación (x³ − 1³) ÷ (x − 1) = x² + x + 1 y dos deslizadores, n = 3 y a = 1.
2. La misión: que la pantalla muestre 1248. Se logra con n = 4 y a = 2, porque 9984 ÷ 8 = 1248.
3. n es el exponente, a es el número de x − a y la pantalla es el cociente. La leyenda «x = 10: con x = 10, cada coeficiente es una cifra» se repite a sí misma, pero se entiende.
4. Aprendí que las cifras del cociente son las potencias de a: 1, 2, 4, 8.
5. Nada.

**3 Predice.**
1. Veo la tabla de Ruffini de x⁶ − 64 entre x − 2: arriba 1, 0, 0, 0, 0, 0 y −64, y abajo empieza con 1. Datos: 64 = 2⁶. Opciones: 8x³, 4x³, 8x² y 16x².
2. Encontrar el cuarto término.
5. Los ceros de arriba están en **morado**, que es el color del cociente, pero son del dividendo. Con la tabla saco 1, 2, 4, 8…, así que el cuarto término es 8x² (la C).

**4 Mira (paso 1/5).**
1. Veo la misma tabla y «x⁶ − 64 = x⁶ − 2⁶: entre los dos van cinco ceros», con 1 00000 −64 y los ceros en morado.
2. Mirar.
4. Aprendí que las potencias que faltan se rellenan con ceros.
5. Otra vez los ceros en morado.

**5 La regla.**
1. Veo la tabla completa: 1, 2, 4, 8, 16, 32 y resto 0. La regla dice que (xⁿ − aⁿ) ÷ (x − a) da n términos y que tk = x^(n−k)·a^(k−1), con las llaves «baja de uno en uno» y «sube desde 0».
2. Leer.
3. k es el lugar del término y n es el exponente.
5. «Con x + a **abajo**» quiere decir en el divisor, pero tardé en darme cuenta. El «Vale si» («con x + a abajo, eso pide n impar en xⁿ + aⁿ y n par en xⁿ − aⁿ») es una frase muy apretada y no la entendí a la primera. La fórmula de tk tampoco muestra el signo para el caso x + a.

**6 Así se resuelve (paso 1).**
1. Solo texto: el término de lugar 7 de (x²⁴ − y¹⁶) ÷ (x³ − y²). Datos: la fórmula de tk y «el dividendo debe ser (x³)ⁿ − (y²)ⁿ».
2. Entender qué me piden.
5. Lo saqué yo: n = 8, y t7 = (x³)¹·(y²)⁶ = x³y¹².

**7 Ahora tú.**
1. Piden el término de lugar 6 de (x¹⁰ − y¹⁰) ÷ (x − y). Opciones: x⁵y⁵, x⁴y⁶, x⁴y⁵ y x³y⁶.
5. x⁴y⁵ (la C). Fácil con los Datos.

**Mi ejercicio.** El cuarto término de (x⁵ + 32) ÷ (x + 2): x lleva 1 y el 2 lleva 3, o sea 8x. El lugar 4 es par, así que el signo es −. Queda −8x.

### Parte 2: tarjetas de ejemplos

Comprobé cada cuenta a mano. No encontré números imposibles ni cosas cortadas o encimadas. Solo 02, 03, 05 y 12 traen dibujo; las demás no tienen, y no les hace falta.

- **01 (3) El grado del cociente.** Piden el grado de q. Tengo todo. Sigo el Resuelto completo: 2 + grado de q = 5, así que grado 3. Bien.
- **02 (8) El largo sin sobrante.** Piden el largo. Tengo todo. Me trabé un poco en la primera línea: «cada loseta del ancho x pide x de largo» es una frase rara. Las cuentas están bien: (x + 2)(2x + m) = 2x² + (m + 4)x + 2m, m = 3, largo 2x + 3. El dibujo es un rectángulo vacío con «largo: ?». No sobra, pero ayuda poco.
- **03 (14) El pasadizo más largo.** Piden cuánto queda aparte. Tengo todo. Lo sigo entero: m = 2, (x + 2)(3x + 2) + 5, y 3x² + 8x + 4 + 5 da bien. La explicación de las trampas está bien (B: 3x + 4 pide 10 tiras y solo hay 8). Igual que en 02, el dibujo es un rectángulo vacío.
- **04 (3) Un paso de la división.** Piden lo que queda después de restar x(x² + 2x). Lo sigo: queda 2x² + x − 3. Bien.
- **05 (8) Horner.** Piden q y r. Los Datos traen la regla de Horner, pero muy resumida. **Me pierdo en «Columna de x²: −1 + 1 − 1 = −1»**: no se ve de dónde sale cada producto, y «cada uno da sus productos en diagonal» no lo aclara. El dibujo es la tabla de Horner **vacía** (solo la primera fila y la columna 1, −1, 1). Si mostrara los productos en diagonal, me ayudaría mucho. Comprobé: (x² + x − 1)² + 5x − 3 = x⁴ + 2x³ − x² + 3x − 2. Las cuentas cuadran.
- **06 (14) El coeficiente de x del resto.** Piden el coeficiente de x del resto. **Me pierdo en la primera línea**: «El cociente sale x² − 3x + 9» aparece sin los dos primeros pasos, y no se ve de dónde sale 9x² − 3x + 5. Lo rehice y sí sale; el resto es −21x + 14 y la respuesta es la D. **Algo raro:** la explicación de la C («suma 18x en vez de restarlo») no da 21, porque −3x + 18x = 15x. El error que da 21 es otro.
- **07 (3) La fila de arriba.** Piden la fila 1, 0, −2, 5. Bien. El 0 está en morado, que es el color del cociente, pero es un coeficiente del dividendo.
- **08 (8) Comprobar la tabla.** Piden comprobar d·q + r. Lo sigo entero: (x + 2)(2x² − x + 2) = 2x³ + 3x² + 4, y menos 9 da 2x³ + 3x² − 5. Bien.
- **09 (14) El número sin x del cociente.** Piden el término independiente del cociente. **Falta algo:** los Datos dicen «más a por la casilla anterior» pero no dicen qué es a. Lo adiviné por x − 3. Sigo el Resuelto: 2, 3, 13 y 38. Respuesta 13 (la A). Las trampas están bien; la E con −3 da 2, −9 y 31.
- **10 (3) El resto no se divide.** Piden el resto. El enunciado ya da la tabla (8, 2, 4 y 3), y los Datos dicen «resto: la última casilla». Con eso **la respuesta ya está regalada**: 3. La cuenta está bien.
- **11 (8) Dividir entre 3x + 2.** Piden q y r. Otra vez la «a» sin definir; además, los Datos llaman x al número (x = −b/c) y luego le dicen a. Sigo el Resuelto: 6, 3, 0 y 4, así que q = 2x² + x y r = 4. Comprobé y está bien.
- **12 (14) El pasadizo de ancho 3x + 3.** Piden el largo. **Falta algo:** el Resuelto usa Ruffini con x = −1 y el «cociente falso», pero los Datos no los mencionan (solo hablan de losetas y de multiplicar). Igual se puede resolver con el método de m de 02. Las cuentas están bien: 2x + 1, sobra 1 y la respuesta es la E. **El dibujo confunde:** el rectángulo es alto, el «largo» está sobre el lado corto y el «ancho» en el lado largo.
- **13 (3) ¿Es divisible?** Lo sigo entero: D(3) = 0. Bien.
- **14 (8) Potencias de −2.** Lo sigo entero: −32 + 32 + 2 + 3 = 5. Los Datos traen las potencias ya calculadas, así que ayudan mucho, casi demasiado.
- **15 (14) Un polinomio con dos restos.** Lo sigo entero: n = 4, m = −2 y P(2) = 4 (la C). Las trampas están bien: con m = 2 sale 12. Buena tarjeta.
- **16 (3) El tercer término.** Lo sigo: x²y². Bien.
- **17 (8) Con potencias en el divisor.** Lo sigo: 12 ÷ 3 = 8 ÷ 2 = 4 términos. Los Datos casi dan el método completo.
- **18 (14) Un término con x + 2.** Lo sigo entero: x²·2⁴ = 16x², con signo + (la A). Las trampas están bien: la E es el cuarto término, −8x³, sin su signo.

**Las 3 que mejor se entienden:** 15, 08 y 18.

**Las 3 que peor:** 05 (la tabla de Horner vacía y el Resuelto que salta los productos), 06 (salta los primeros pasos y la explicación de la C está mal) y 12 (usa herramientas que no están en Datos y el dibujo tiene el largo y el ancho al revés).

**¿Suben los niveles?** Sí, en cada grupo de tres (3, 8 y 14) se nota la subida, y la 14 siempre trae trampas explicadas. En 04 a 06 el salto de 8 a 14 se siente grande, porque la 06 resume demasiado.

**¿El recuadro «Datos» ayuda?** Casi siempre ayuda. Regala la respuesta en 10, y casi en 14 y 17. Le falta algo en 09 y 11 (qué es «a») y en 12 (el cociente falso).

### Lo que me trabó

- divisor-k, Lee: el dibujo muestra el ancho 6x + 6 mientras la tarjeta habla de x + 1 y 2x + 2, y el «largo» está escrito sobre el lado corto.
- divisor-k, Mira: Nox dice «Yo había comprimido un paso» y no entendí a qué se refiere.
- divisor-k, Así se resuelve y Ahora tú (Datos): «más **a** por la casilla anterior», pero a nunca se define (la regla lo llamó x = −b/c).
- teorema-resto, Juega: en D(5) = (5 − 2)·8 + 7, el largo sale como 8 ya hecho y no como (5 + 3).
- teorema-resto, La regla: escriben «r(a) = D(a)» como si el resto fuera una función.
- teorema-resto, La regla: Nox habla de un divisor de grado 2 y de un resto mx + n que no se explican.
- teorema-resto, Así se resuelve: la caja no tiene dibujo y los Datos no dicen que el largo es 30 − 2x y el ancho 16 − 2x.
- cocientes-notables, Predice, Mira y La regla: los ceros del dividendo están en morado, el color del cociente (igual que el 0 de la tarjeta 07).
- cocientes-notables, La regla: «con x + a abajo» y el «Vale si» (n impar / n par) son confusos, y tk no muestra el signo.
- Tarjeta 05: la tabla de Horner está vacía y me pierdo en «Columna de x²: −1 + 1 − 1», porque no se ven los productos en diagonal.
- Tarjeta 06: el Resuelto salta los dos primeros pasos del cociente.
- Tarjeta 06: la explicación de la C está mal: «suma 18x en vez de restarlo» da 15, no 21.
- Tarjetas 09 y 11: los Datos usan «a» sin decir qué es.
- Tarjeta 10: el enunciado y los Datos juntos regalan la respuesta.
- Tarjeta 12: el Resuelto usa Ruffini y el cociente falso, que no están en Datos.
- Tarjeta 12: el dibujo pone el «largo» en el lado corto.
- Tarjetas 02 y 12: el rectángulo vacío con «largo: ?» casi no ayuda, y la frase de 02 «cada loseta del ancho x pide x de largo» es rara.

## Correcciones de la ronda 1

Hechas junto con la auditoría (`rutinas/auditoria/algebra.division-de-polinomios.md`, «Correcciones (19 nov)»), que dice
la prueba de cada una. Capturas después: `/tmp/claude-0/-home-user/31d0ae9f-8026-5866-a5dc-2c8554ea89bf/scratchpad/e6-cierre-div/despues/`.

| Lector | Lo que señaló | Qué se hizo |
|---|---|---|
| A | Algoritmo, Juega: «el resto» 2x + 5 tiene el grado del divisor | Lo que sobra va en naranja (el color del resto) solo con k = 3, cuando ya no alcanza para otro tramo; antes, en tinta. La leyenda: «Sobran: lo que queda aparte al final: el resto» (auditoría M15). |
| A | Algoritmo, regla: «a lo más, uno menos» suena cortado | «como mucho, un grado menos». |
| A y B | El 0 de la potencia que falta, en el violeta del cociente (Horner, Ruffini, cocientes notables, tarjeta 07) | Va en tinta, como los demás coeficientes de D; sale de la tabla de colores. **Decidido por la sesión, Gerson revisa después** (M6). |
| A | Horner, regla: la tabla llena sin explicar el signo cambiado ni la división entre 2 | La condición: «en Horner, d cambia de signo menos el primero»; Nox: «se suma, y cada columna se divide entre el primero de d»; Mira 6: «x − 1 cambia de signo, −1 y 1, para sumar. Abajo, entre 2», con 6 ÷ 2 = 3 y sus dos productos (M5). |
| B | Tarjeta 05: tabla de Horner vacía y «−1 + 1 − 1» sin ver de dónde sale cada producto | El resuelto pasa a cuatro líneas: cada número de q con sus productos y la columna adonde va cada uno (M5). La figura sigue vacía: es el planteamiento. |
| A | Ruffini, Ahora tú: −3 y −5 pegados, columnas corridas | Error de la pieza: la casilla «?» medía como el texto «undefined». Corregido en `alg-reparto` (M14). La casilla que sigue a «?» queda vacía a propósito: solo se pide la «?». |
| A | Ruffini, Lee: no se ve la suma hacia abajo | Se deja: la tarjeta pide descubrir la cuenta en el juego; la regla y Mira la dicen. |
| A | Ruffini, regla: «+ a ·» y «anterior» en dos renglones | Se deja: `herramientas/ecuaciones-ancho.js` dice «todo cabe»; la app parte después de un signo. |
| B | Error de matemática, tarjeta 06: la C («suma 18x») daría 15, no 21 | La C «resta al revés: 18x − (−3x) = 21x». La tarjeta ya no salta pasos: x², −3x y 9, cada uno con su resta. La de nivel 2 que repetía su división usa otra (M2). |
| B | Tarjetas 09 y 11, Así se resuelve y Ahora tú de divisor-k: «a» sin decir qué es | En Ruffini, «… más a por la anterior, con a el número que anula al divisor»; en cx + b, «… más −b/c por la anterior» (teoría y práctica, M4). |
| B | Tarjeta 10: enunciado y Datos regalan el resto | Los datos ya no dicen «Resto: la última casilla»: dan «la tabla con x = 1/2 divide entre x − 1/2», «2x − 1 = 2(x − 1/2)» y D = d · q + r, y el resuelto muestra por qué el 3 no cambia (M11). |
| B | Tarjeta 12: Ruffini y cociente falso sin Datos | Datos con el cociente falso, q = q′ ÷ c y la casilla (M10). |
| B | divisor-k, Lee y tarjeta 12: «largo» sobre el lado corto | Lee 1 dibuja el pasadizo de (x + 1) dm que nombra (largo 6x). En la tarjeta 12 se deja: el ancho es el divisor 3x + 3 y es más ancho que largo; está rotulado. |
| B | divisor-k, Mira: «Yo había comprimido un paso» | «Veamos qué hizo la tabla y qué falta.» |
| B | teorema-resto, Juega: el largo sale «8» ya hecho | «D(5) = (5 − 2) · (5 + 3) + 7 = 31 dm²». |
| B | teorema-resto, regla: «r(a) = D(a)»; Nox habla de grado 2 y mx + n sin explicar | La ecuación: «en x = a: D(a) = 0 · q(a) + r = r». Nox: «Si el divisor es de grado 2, el resto es mx + n: vale lo mismo que D donde el divisor vale 0» (es lo que piden «Ahora tú» y un ejemplo de nivel 3, con sus datos) (M8). |
| B | teorema-resto, Así se resuelve: la caja sin dibujo ni largo 30 − 2x | Dato nuevo: «Al doblar, cada lado de la cartulina pierde dos cuadrados; el alto es x». Sin dibujo: no hay pieza de la caja (para Gerson). |
| B | cocientes-notables, regla: «con x + a abajo» y el «Vale si» apretado | «en el divisor»; «Con x + a de divisor, xⁿ + aⁿ lo es si n es impar; xⁿ − aⁿ, si es par». |
| B | Juega 6: la leyenda «x = 10: con x = 10…» se repite | «x: vale 10: cada coeficiente es una cifra». |
| B | Tarjeta 14: los Datos traen las potencias ya calculadas | El dato es la regla con otras potencias: «(−2)² = 4 y (−2)³ = −8». |
| B | Tarjeta 02: «cada loseta del ancho x pide x de largo» es rara | «El ancho x + 2 lleva una loseta por cada x del largo. Para usar las 2 losetas, el largo empieza con 2x». |
| B | Tarjetas 02 y 12: el rectángulo vacío ayuda poco; 17 casi da el método; 05 a 06 salta mucho | Se deja el rectángulo (la figura muestra el planteamiento, no la respuesta: molde §3). La 17 da la regla de las bases con exponente, que es la herramienta. El salto de 05 a 06 bajó con los pasos nuevos de la 06. |
| B | Regla 5: «x − 2 = 0 dm» apretado junto a «largo» | Se deja para Gerson: es el dibujo de prueba de `alg-reparto` (no se pisan: la prueba de la pieza lo mide). |
