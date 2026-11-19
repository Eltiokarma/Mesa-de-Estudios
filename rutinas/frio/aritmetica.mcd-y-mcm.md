# Lector en frío: aritmetica.mcd-y-mcm

Ronda 1 (19 nov), con el método de `docs/metodo/unidad/4-lector-frio.md`; capturas `--entera --lector` del servidor del
auditor (puerto 4433; primer estado de cada momento: solo la tarjeta 1 de Lee y el paso 1 de Mira y de Así se
resuelve). Dos lectores nuevos, sin código: A con los momentos de las ideas 1 a 3; B con los de las ideas 4 a 6 y las 18
tarjetas de ejemplos (n.º 3, 8 y 14 de cada idea). Capturas en
`/tmp/claude-0/-home-user/31d0ae9f-8026-5866-a5dc-2c8554ea89bf/scratchpad/e7-cierre-mm/lector/`.

## Veredicto de la sesión

Los dos lectores resolvieron todos los Predice y los «Ahora tú», hicieron un ejercicio propio por idea y dijeron lo que
aprendieron en cada juego; ninguna cuenta les salió mal. Lo que los trabó es redacción y notación: las letras p y q
cruzadas en la cinta del MCM; «Vale si enteros positivos» y «Vale si sin contar el 0», que no son frases; PESI sin
decir sus letras; A y B en los Datos de «Así se resuelve» sin decir cuál número es cuál; el punto y el cuadrito de la
rifa sin leyenda en Lee; «si coinciden al empezar»; dos líneas de Luma que no ayudan a su pregunta; en Euclides, la
fracción continua nombrada en la regla sin su escalera; la tarjeta 16 con muchas respuestas; la regla de «el mismo resto»
con un dibujo de otro caso y rₑ sin ejemplo; la fórmula de inclusión y exclusión partida; la L sin decir; y las tarjetas
01, 08, 09, 15, 17 y 18. No son defectos: que solo se vea la tarjeta 1 de Lee y el paso 1 de Mira y de Así se resuelve
(es la captura; el paso 5 de Mira de Euclides ya dibujaba la escalera); «Volvemos a la rifa» y «los rollos de la
promoción» (vienen de las ideas anteriores); que la tarjeta 16 sea más fácil que las de nivel 3 de otras ideas (es de
nivel 1).

## Lector A: momentos de las ideas 1, 2 y 3

Ideas: mcd-cintas, mcm-coinciden, mcd-por-mcm. Celular, tema claro, 7 pantallas por idea.

Aviso, una sola vez: de Lee solo veo la tarjeta 1/3, de Mira solo el paso 1, y de «Así se resuelve» solo el paso 1 («¿Qué me piden?»). No lo cuento como falla.

---

### Idea 1: MCD, el trozo más largo (mcd-cintas)

**1 Lee.**
1. Veo dos cintas grises con la punta cortada en V: «Rollo de 14 m» y «Rollo de 20 m». La de 14 es más corta, y se ve proporcionada. Hay una lupa, una tarjeta verde «1/3 Los rollos de la fiesta», un enlace «Ir directo a jugar», la mascota Luma y el botón «Siguiente tarjeta».
2. Piden leer, nada más.
3. «m» son metros.
4. —
5. Nada. Todavía no dicen qué se busca, pero eso viene en las tarjetas 2 y 3.

**2 Juega.**
1. Veo dos rollos (16 m y 40 m) cortados en trozos verdes con el número 5. En el de 16 hay 3 trozos y un pedacito naranja: «sobra 1 m». En el de 40 hay 8 trozos: «no sobra nada». Debajo: «Trozos de 5 m: sobran 1 m y 0 m», botones de pares de rollos (16 y 40, 18 y 30, 20 y 28) y un deslizador «Trozo» con − y +.
2. Misión: con los rollos de 18 m y 30 m, buscar el trozo más largo sin sobrante.
3. Verde «trozo» es el largo de cada trozo y naranja «sobra» es lo que queda. Las leyendas lo dicen.
4. Lo que aprendí: el trozo tiene que caber exacto en los dos rollos, y entre los que caben escojo el más largo. Para 18 y 30 sale 6.
5. Nada. Las cuentas cuadran (16 = 3×5 + 1; 40 = 8×5).

**3 Predice.**
1. Veo los rollos de 24 m y 36 m, sin cortar.
2. Elegir cuánto mide cada trozo. Opciones: 72, 12, 6 y 24.
3. «Datos»: cada trozo mide un número entero de metros.
4. —
5. Nada. Yo marco B, 12 m. El 6 también cabe en los dos, así que me hace pensar en «el más largo», y eso está bien.

**4 Mira (paso 1/5).**
1. Los dos rollos cortados en trozos de 6: 4 en el de 24 y 6 en el de 36. No sobra nada.
2. Dar play o pasar al paso 2.
3. 24 = 4 × **6** y 36 = 6 × **6**. El 6 va en verde, que es el color del trozo.
4. Lo que aprendí: el 6 es un divisor común, pero todavía no es el mayor. Supongo que en los pasos siguientes sale el 12.
5. Nada.

**5 La regla.**
1. Rollos cortados en trozos de 12: 2 en el de 24 y 3 en el de 36. Debajo, la regla y las descomposiciones: 24 = 2³ × 3, 36 = 2² × 3², MCD(24, 36) = 2² × 3 = **12**, con una llave que dice «menor exponente».
2. Leer.
3. MCD es el mayor que divide exacto a todos. El exponente es el numerito de arriba. «PESI» no lo conozco, pero el texto lo explica: «no comparten ningún primo».
5. Me hizo dudar «**Vale si** enteros positivos.»: le falta algo, como «si son enteros positivos». La palabra PESI aparece sin decir qué significan las letras.

**6 Así se resuelve (paso 1).**
1. Problema: Doña Juana tiene 56 caramelos de fresa y 48 de limón, los empaca en bolsitas iguales sin mezclar, con la mayor cantidad posible en cada una. ¿Cuántas bolsitas arma en total? Hay un recuadro «Datos» con las definiciones y el paso 1 «¿Qué me piden?».
2. Seguir los pasos.
3. En «Datos» hablan de «A y B», pero en el problema hay 56 y 48. Entiendo que A y B son esos números, aunque no lo dicen.
5. Poca cosa. Lo resolví yo: MCD(56, 48) = 8, así que 7 + 6 = **13 bolsitas**. Es bueno que el paso 1 avise que no piden el 8.

**7 Ahora tú.**
1. Rollos de 72 m y 81 m. Opciones: 648, 3, 9 y 72, y además «No sé».
2. Elegir el largo del trozo.
3. Los mismos Datos de antes.
5. Nada. 72 = 2³·3² y 81 = 3⁴, así que MCD = 3² = **9 m (C)**. El 648 es el MCM y el 3 es un divisor común que no es el mayor. Buenas trampas.

**Ejercicio inventado.** Una tabla de 45 cm y otra de 60 cm se cortan en listones iguales, lo más largos posible, sin que sobre nada. ¿Cuánto mide cada listón y cuántos salen?
45 = 3²·5 y 60 = 2²·3·5, así que MCD = 3·5 = 15 cm. Salen 3 + 4 = 7 listones.

---

### Idea 2: MCM, la primera coincidencia (mcm-coinciden)

**1 Lee.**
1. Veo un cartel «Caramelo cada 4 · gaseosa cada 6» y boletos del 1 al 30, unidos como fichas de rompecabezas. Algunos tienen un puntito y otros un cuadradito en la esquina, y el 12 y el 24 tienen borde violeta. Tarjeta «1/3 Dos premios en la rifa».
2. Leer.
3. Por ahora no sé qué es el puntito ni qué es el cuadradito; se ve recién en Juega. Comprobé: los puntos están en 4, 8, …, 28 y los cuadrados en 6, 12, …, 30. Está bien.
5. En Lee no hay leyenda de punto y cuadrado. Lo entendí en la pantalla siguiente.

**2 Juega.**
1. Cartel «Caramelo cada 3 · gaseosa cada 7» y boletos del 1 al 60, con el 21 y el 42 en violeta. «Los dos premios: 21 y 42 (cada 21)». Leyenda: ● caramelo, ■ gaseosa y «borde violeta» para los dos premios. Botones para cambiar los números (3, 4, 5, 6 y 7, 8, 10, 15).
2. Misión: elegir los premios para que el primer boleto con los dos sea el 20.
3. Ya está claro qué es el punto, qué es el cuadrado y qué es el violeta.
4. Lo que aprendí: el primer boleto con las dos marcas es el menor múltiplo de los dos números, y después se repite cada esa misma cantidad. La misión sale con caramelo 4 y gaseosa 10.
5. Nada.

**3 Predice.**
1. Cartel 12 y 18 y boletos del 1 al 40 sin marcas.
2. Decir el primer boleto que gana los dos premios. Opciones: 216, 6, 30 y 36.
3. Datos: los múltiplos de 12 y los de 18.
5. Nada. Respondo **D, 36**. El 216 es multiplicarlos, el 6 es el MCD y el 30 es sumarlos: son trampas buenas.

**4 Mira (1/4).**
1. Puntos en 12, 24 y 36. Texto: «Los múltiplos de 12 ganan caramelo: 12, 24, 36…» y abajo «12, 24, 36, 48, …».
2. Avanzar.
4. Lo que aprendí: primero se marca un premio y después el otro, y donde coinciden por primera vez está el MCM.
5. Nada.

**5 La regla.**
1. La misma cuadrícula: puntos en 12, 24 y 36, cuadrados en 18 y 36, y el 36 en violeta. 12 = 2² × 3, 18 = 2 × 3², MCM = 2² × 3² = **36**, con la llave «mayor exponente».
3. MCM es el menor múltiplo de los dos. El color violeta es el mismo del borde de la cuadrícula.
5. «**Vale si** sin contar el 0.» suena mal; le falta algo. «Si coinciden al empezar, esa es la primera vez» no lo entendí: ¿cómo coinciden al empezar? ¿Cuando un número es múltiplo del otro? ¿En el 0?

**6 Así se resuelve (paso 1).**
1. Con losetas de 12 cm por 20 cm, todas en la misma posición, se arma el cuadrado más pequeño posible. ¿Cuánto mide su lado y cuántas losetas se usan? Hay un recuadro Datos y el paso 1.
5. Ningún dibujo de losetas en el paso 1, pero puede venir después. Lo resolví yo: MCM(12, 20) = 60 cm, y se usan (60/12)·(60/20) = 5·3 = **15 losetas**.

**7 Ahora tú.**
1. Rifa: caramelo para los múltiplos de 14 y gaseosa para los de 18. Opciones: 126, 32, 252 y 2, y «No sé».
3. Los Datos de MCM.
5. La pista de Luma, «¿Se junta o se corta? Si se junta, es el MCM.», no me ayuda en una rifa: aquí no se junta ni se corta nada. Respuesta: 14 = 2·7 y 18 = 2·3², así que MCM = 2·3²·7 = **126 (A)**.

**Ejercicio inventado.** Dos combis salen juntas del paradero a las 7:00. Una vuelve cada 8 minutos y la otra cada 12. ¿A qué hora vuelven a salir juntas?
8 = 2³ y 12 = 2²·3, así que MCM = 2³·3 = 24. Salen juntas a las **7:24**.

---

### Idea 3: MCD, MCM y los cocientes (mcd-por-mcm)

**1 Lee.**
1. Rollos de 18 m y 30 m cortados en trozos de 6: 3 trozos y 5 trozos, sin sobrante. Tarjeta «1/3 Los rollos otra vez».
2. Leer.
3. Los «cocientes» son las veces que entra el trozo: aquí 3 y 5.
5. Nada.

**2 Juega.**
1. Rollo A de 12 m, con «p = 3 trozos de 4 m», y rollo B de 8 m, con «q = 2 trozos de 4 m». Debajo, «Cinta del MCM: 24 m» con borde violeta, partida en «2 rollos A (q)», y «La misma cinta, con rollos B», en «3 rollos B (p)». La cuenta: **4** × **24** = 96 = 12 × 8. Hay botones para elegir los rollos A y B.
2. Misión: dos rollos con MCD 4 y MCM 48. Sale con 12 y 16.
3. Verde es el MCD, violeta es el MCM, y p y q son los cocientes. Están en la leyenda.
4. Lo que aprendí: MCD × MCM da lo mismo que multiplicar los dos rollos.
5. Me trabé un rato con «2 rollos A (**q**)». ¿Por qué los rollos A se cuentan con la q, que era la de B? Es cierto (24/12 = 2 = q), pero el cruce confunde: tuve que hacer la cuenta para creerlo.

**3 Predice.**
1. Una tabla «primo | 4 | 6 | 10 | MCD | MCM» con los exponentes de 2, 3 y 5, y las columnas MCD y MCM vacías.
2. Con tres números (4, 6 y 10), ¿cuánto da MCD × MCM? Opciones: 24, 480, 120 y 240.
3. Cada número de la tabla es un exponente. Lo comprobé: 4 = 2², 6 = 2·3 y 10 = 2·5.
5. La primera vez quise marcar 240, porque dice que «con dos rollos da el producto». Haciendo la tabla sale MCD 2 y MCM 60, así que **120 (C)**. Es una buena trampa.

**4 Mira (1/5).**
1. La misma tabla, y el texto «Cada número con sus exponentes: una fila por primo», con 4 = 2², 6 = 2 × 3 y 10 = 2 × 5.
4. Lo que aprendí: en cada fila, el menor va al MCD y el mayor al MCM, como dice Luma.
5. Nada.

**5 La regla.**
1. Rollo A de 12 (p = 3) y rollo B de 16 (q = 4), trozos de 4. La cinta del MCM, de 48 m, cabe en 4 rollos A (q) o en 3 rollos B (p). Fórmulas: A = MCD × p, B = MCD × q, MCM = MCD × p × q (con la llave «p y q PESI») y MCD × MCM = A × B.
3. PESI quiere decir que no comparten primos.
5. Otra vez el cruce «4 rollos A (q)». El «Vale si solo con dos números: 4, 6 y 10 son un contraejemplo» sí lo entendí, porque ya lo había vivido en Predice.

**6 Así se resuelve (paso 1).**
1. El MCD de dos números es 5 y su MCM es 180. Ninguno de los dos es múltiplo del otro. ¿Cuánto suman? Datos: A = MCD × p, B = MCD × q, MCM = MCD × p × q, y p y q son PESI aunque no tienen que ser primos.
5. Nada. Lo resolví yo: p × q = 36, y como son PESI y ninguno es 1, quedan 4 y 9. Los números son 20 y 45, y suman **65**.

**7 Ahora tú.**
1. MCD 2, MCM 70, y uno de los números es 10. ¿Cuál es el otro? Opciones: 35, 140, 14 y 7, y «No sé».
3. Datos: MCD(A, B) × MCM(A, B) = A × B.
5. Nada. 2 × 70 = 140, y 140 / 10 = **14 (C)**. Lo comprobé: MCD(10, 14) = 2 y MCM = 70.

**Ejercicio inventado.** El MCD de dos números es 6 y su MCM es 72. Uno de ellos es 18. ¿Cuál es el otro?
6 × 72 = 432, y 432 / 18 = **24**. Comprobación: MCD(18, 24) = 6 y MCM(18, 24) = 72.

---

### Lo que me trabó

- mcd-cintas, 5 La regla: «Vale si enteros positivos.» no se entiende como frase; le falta algo («si son…»).
- mcd-cintas, 5 La regla: aparece «PESI» sin decir qué significan las letras. El sentido sí se entiende por el texto.
- mcd-cintas, 6 Así se resuelve: los Datos hablan de «A y B», pero el problema tiene 56 y 48, y no dice cuál es cuál.
- mcm-coinciden, 1 Lee: el punto y el cuadrado de la cuadrícula no tienen leyenda; se entiende recién en Juega.
- mcm-coinciden, 5 La regla: «Vale si sin contar el 0.» suena mal escrito.
- mcm-coinciden, 5 La regla: no entendí «Si coinciden al empezar, esa es la primera vez».
- mcm-coinciden, 7 Ahora tú: la pista de Luma «¿Se junta o se corta?» no encaja con una rifa.
- mcd-por-mcm, 2 Juega y 5 La regla: «2 rollos A (q)» y «3 rollos B (p)»: el cruce de letras confunde; tuve que hacer la cuenta para creerlo.

## Lector B: momentos de las ideas 4, 5 y 6, y 18 tarjetas de ejemplos


Soy un alumno de 5.º de secundaria. Solo miré las imágenes PNG. De Lee solo vi la tarjeta 1/3, de Mira solo el paso 1 y de «Así se resuelve» solo el paso 1 («¿Qué me piden?»). Lo digo esta vez y no lo cuento como falla.

### Parte 1: momentos

#### Idea 4: El mismo resto con varios divisores (mismo-resto)

**1 Lee.** Veo dos filas, «De 4:» y «De 6:», cada una con una bolsita de caramelos, «× ?» y un caramelo suelto anaranjado, y debajo «sobran 1 con bolsitas de 4 / de 6». Abajo está la tarjeta 1/3, «El paquete de doña Juana»: no sabe cuántos caramelos son; en bolsitas de 4 le sobra 1 y en bolsitas de 6 también. Aquí no piden nada, solo leer. «× ?» quiere decir «no sé cuántas bolsitas». No hay nada que me haga dudar. Un detalle: dice «sobran 1», en plural, junto a un solo caramelo.

**2 Juega.** Veo un deslizador de «Caramelos» (en 30) y las dos filas dibujadas: 7 bolsitas de 4 y sobran 2; 5 bolsitas de 6 y no sobra nada. Arriba dice «N = 30: sobran 2 con 4 y 0 con 6». La misión es buscar entre 40 y 55 una cantidad que deje 1 suelto en las dos formas. N es la cantidad de caramelos y «sueltos» son los que no llenan otra bolsita (hay una leyenda). Comprobé las cuentas: 30 = 4·7 + 2 y 30 = 6·5. La respuesta es 49 = 48 + 1. **Lo que aprendí:** si a N le quito el suelto, queda algo que entra justo en las dos formas. No tuve dudas.

**3 Predice.** Ahora hay bolsitas de 4, 6 y 10, sobra 1 en las tres y el paquete tiene más de 10. Preguntan cuál es la menor cantidad. Las opciones son 61, 13, 241 y 60. El MCM de 4, 6 y 10 es 60, así que 61. La bolsita de 10 sale dibujada alta y angosta, pero se entiende. Sin dudas.

**4 Mira (paso 1/5).** Hay 15 bolsitas de 4 y sobra 1, con «61 = 4 × 15 + 1». La cuenta está bien. **Lo que aprendí:** 61 menos 1 entra justo en bolsitas de 4. Sin dudas.

**5 La regla.** El dibujo muestra 61 en bolsitas de 4 (15 y sobra 1), de 6 (10 y sobra 1) y de 10 (6 y sobra 1); las tres cuentas están bien. La regla dice: «Si N deja el mismo resto r con A y con B, N − r es múltiplo de su MCM. Si les falta lo mismo, rₑ, N + rₑ lo es». En el recuadro aparecen N = 4° + 1, N = 6° + 1, N = 12° + 1 (con la llave MCM(4, 6) = 12) y N = MCM° − rₑ. El circulito encima quiere decir «múltiplo de».

Lo que me hizo dudar:
- El dibujo usa 4, 6 y 10 (el número 61), pero el recuadro usa solo 4 y 6 (MCM 12). No sé si el 61 sirve con el 12; sí sirve (61 = 12·5 + 1), pero no lo dicen.
- La «e» de rₑ no se explica (supongo que es «lo que falta»). La segunda mitad («si les falta lo mismo…» y «se homogeneiza con lo que falta») sale de golpe: no hay ningún ejemplo ni dibujo de «falta».
- «Homogeneiza» es una palabra difícil.

**6 Así se resuelve (paso 1).** Piden el mayor número de dos cifras que deja resto 4 al dividirlo entre 8 y entre 12. Los Datos son la notación A°, MCM × k + r y el MCM con primos. Lo resolví yo: MCM 24, 24k + 4 ≤ 99, k = 3 y sale 76. Bien.

**7 Ahora tú.** Un paquete de más de 10 caramelos deja 1 en bolsitas de 8 y de 10. Las opciones son 41, 39, 40 y 81. El MCM es 40, más 1 da 41. La pista de Luma («Quita lo que sobra y busca un múltiplo común») ayuda sin regalar la respuesta. Bien.

**Mi ejercicio:** un número mayor que 3 deja resto 3 al dividirlo entre 5 y entre 7. ¿Cuál es el menor? MCM(5, 7) = 35, y 35 + 3 = **38**. Comprobación: 38 = 5·7 + 3 y 38 = 7·5 + 3.

#### Idea 5: Múltiplos de uno o de otro (multiplos-tramo)

**1 Lee.** Veo una plancha de boletos del 1 al 30 con la etiqueta «Caramelo cada 4 · gaseosa cada 6». El punto marca los múltiplos de 4, el cuadradito los de 6, y el 12 y el 24 tienen borde violeta. En la tarjeta 1/3 se pregunta cuántos boletos ganan algo. Revisé las marcas y están bien. En esta pantalla no explican qué significa el borde violeta (en Juega sí). Dice «Volvemos a la rifa», como si yo ya la conociera de una idea anterior que no vi.

**2 Juega.** Veo una plancha del 1 al 60 con caramelo cada 3 y gaseosa cada 6. Debajo dice «20 caramelos, 10 gaseosas, 10 con los dos: ganan 20», con la leyenda (punto = caramelo, cuadrado = gaseosa, borde violeta = los dos premios). Hay botones para el caramelo (3, 4, 5) y la gaseosa (6, 10, 15). La misión es lograr que exactamente 24 boletos ganen algo. Comprobé el ejemplo: 20 + 10 − 10 = 20, bien. También comprobé que la misión se puede cumplir: con 3 y 10 sale 20 + 6 − 2 = 24. **Lo que aprendí:** los que tienen los dos premios se cuentan dos veces, y por eso se restan una vez. Sin dudas.

**3 Predice.** La plancha va del 1 al 120 y está vacía; caramelo cada 4 y gaseosa cada 6. Preguntan cuántos boletos ganan al menos un premio. Las opciones son 40, 30, 10 y 50. La cuenta da 30 + 20 − 10 = 40. Bien.

**4 Mira (paso 1/4).** Aparecen solo los puntos de los múltiplos de 4 y la línea «120 = 4 × 30». Revisé los puntos fila por fila y están bien. **Lo que aprendí:** hasta 120 hay 30 múltiplos de 4, porque 120 ÷ 4 = 30.

**5 La regla.** La plancha completa marca bien los 10 de borde violeta (12, 24, …, 120). La regla dice: «los de A, más los de B, menos los de los dos, que son los múltiplos del MCM», con la cuenta 30 + 20 − 10 = 40 y la versión para A, B o C.

Lo que me hizo dudar:
- **La fórmula del recuadro está mal cortada:** «de A o de B = de A + de» en una línea y «B − de MCM» en la siguiente. Me costó ver que «de B» va junto.
- La llave «al menos un premio» queda debajo de «de A o de B», y la línea de A, B o C también se parte («cada / par + los tres»).
- En el «Vale si» aparece la L («hasta L») sin explicar qué es; supongo que es el último número de la plancha.

**6 Así se resuelve (paso 1).** Piden cuántos números del 1 al 80 no son múltiplos de 6 ni de 10. Lo hice yo: 13 + 8 − 2 = 19 y 80 − 19 = 61. Bien.

**7 Ahora tú.** Piden cuántos números del 1 al 120 son múltiplos de 8 y de 10 a la vez. Las opciones son 27, 60, 1 y 3. El MCM es 40 y 120 ÷ 40 = 3, la D.

Lo que me hizo dudar: **la pista de Luma («Los que están en las dos cuentas se restan una vez») no sirve para esta pregunta**, porque aquí no se resta nada: solo se cuentan los múltiplos del MCM. Me empujó a hacer 15 + 12 − 3 = 24, que no está en las opciones, y me confundí.

**Mi ejercicio:** del 1 al 60, ¿cuántos son múltiplos de 4 o de 5? Hay 15 de 4 y 12 de 5; de los dos (los múltiplos de 20) hay 3. Entonces 15 + 12 − 3 = **24**.

#### Idea 6: Euclides y la fracción continua (euclides)

**1 Lee.** Veo una cinta de 50 con tres trozos de 15 y un pedazo punteado de 5, y «50 = 3 × 15 + 5». La tarjeta 1/3 explica que el rollo de 15 m se pone sobre el de 50 m tantas veces como entra. Todo claro. «Con los rollos de la promoción» supone que yo ya los conozco.

**2 Juega.** Hay tres cintas en fila: 84 = 3 × 26 + 6, 26 = 4 × 6 + 2 y 6 = 3 × 2. Debajo dice «Pieza exacta: 2 m, en 3 mediciones». Hay botones para el rollo largo (84, 48, 60, 90) y el rollo corto (26, 24, 35, 38). La misión pide dos rollos que necesiten seis mediciones. Comprobé las tres cuentas. Probé a mano y 60 con 38 da seis filas (60, 38, 22, 16, 6, 4, 2), así que la misión se puede cumplir, aunque cuesta encontrarla. «Sobra» es lo que pasa a medir en la fila siguiente; «pieza exacta» es la última. **Lo que aprendí:** lo que sobra mide al rollo anterior, hasta que no sobra nada, y esa última pieza entra exacta en todos.

**3 Predice.** Preguntan: si 91 = 2 × 35 + 21, ¿qué se puede decir del MCD de 91 y 35 y del de 35 y 21? Las opciones son «más chico», «son iguales», «no se sabe» y «el doble». Los dos dan 7: son iguales. Sin dudas.

**4 Mira (paso 1/5).** Muestra solo la primera fila, 91 = 2 × 35 + 21. **Lo que aprendí:** que se empieza poniendo el corto sobre el largo.

**5 La regla.** El dibujo tiene cuatro cintas: 91 = 2·35 + 21, 35 = 1·21 + 14, 21 = 1·14 + 7 y 14 = 2·7. Todas las cuentas están bien. La regla: MCD(A, B) = MCD(B, r), y el último divisor es el MCD = 7. Debajo aparece «[2; 1, 1, 2] fracción continua de 91/35».

Lo que me hizo dudar: **no entiendo qué es una fracción continua.** Me dicen que los cocientes son sus «términos», pero no veo cómo [2; 1, 1, 2] es un número ni cómo se relaciona con 91/35 (lo saqué yo: 2 + 1/(1 + 1/(1 + 1/2)) = 13/5 = 91/35). Quizá la tarjeta 2 o 3 de Lee lo explica, pero en lo que vi no aparece, aunque está en el título de la idea.

**6 Así se resuelve (paso 1).** Rollos de 165 y 143: piden el trozo más largo y la fracción continua de 165/143. En los Datos por fin aparece cómo se anota: «[2; 1, 3]: primero la parte entera y después los demás cocientes». Lo hice yo: 165 = 1·143 + 22, 143 = 6·22 + 11 y 22 = 2·11, así que MCD 11 y [1; 6, 2]. Todavía no sé calcular cuánto vale una fracción continua.

**7 Ahora tú.** Piden el MCD de 117 y 45. Las opciones son 27, 585, 9 y 2. Las cuentas: 117 = 2·45 + 27, 45 = 1·27 + 18, 27 = 1·18 + 9 y 18 = 2·9, así que es 9, la C. Comprobé las trampas: 27 es el primer resto y 585 es el MCM. Bien.

**Mi ejercicio:** MCD de 84 y 36. 84 = 2·36 + 12 y 36 = 3·12, así que el MCD es **12**. La fracción continua es [2; 3] = 2 + 1/3 = 7/3, igual que 84/36.

### Parte 2: tarjetas de ejemplos

**Nota general:** ninguna de las 18 tarjetas tiene dibujo. Solo hay enunciado, Datos, Resuelto y respuesta. Donde el dibujo ayudaría, lo digo. Las tarjetas van de tres en tres por idea, con los niveles 3, 8 y 14.

| N.º | Qué piden | ¿Tengo todo? | ¿Sigo el Resuelto? | Dibujo | Algo raro / cuentas |
|---|---|---|---|---|---|
| 01 (3) | MCD de 40 y 100 con primos | Sí. Los Datos ya traen la descomposición, así que regalan la mitad del trabajo | Sí | — | 2²·5 = 20 ✓ |
| 02 (8) | Caramelos por bolsita: 60 fresa, 84 limón | Sí | Sí | Unas bolsitas ayudarían | MCD 12 ✓ |
| 03 (14) | Lápices por paquete: 72 cuadernos y 120 lápices | Sí | Sí. Explica bien que 24 son los paquetes y no los lápices | — | 24 paquetes, 5 lápices ✓; las trampas cuadran (120/12 = 10, MCM 360) |
| 04 (3) | MCM de 5 y 7 | Sí | Sí | — | 35 ✓ |
| 05 (8) | Losetas de 10 × 15 para el cuadrado más chico | Sí | Sí | **Falta**: un cuadrado de 3 × 2 losetas lo haría obvio | 30 cm y 6 losetas ✓ |
| 06 (14) | Ladrillos 6 × 9 × 12 para un cubo | Sí | Sí | Faltaría un cubo | 36 cm, 6·4·3 = 72 ✓; trampas 648, 13 y 3 ✓ |
| 07 (3) | El otro número: MCD 4, MCM 60, uno es 12 | Sí | Sí | — | 20 ✓ (MCD(12, 20) = 4 y MCM = 60). En los Datos «MCD(A,» y «B)» quedan partidos en dos líneas |
| 08 (8) | MCD y MCM de 3A y 3B | **Falta qué es PESI** (no lo explican) | Me pierdo en «3 × A = 24 × p»: no dice que 24 sale de 3 × 8 | — | 24 y 288 ✓ |
| 09 (14) | MCD si MCM = 30·MCD y el producto es 1080 | Sí | Sí. «6 × 180» sale sin decir que 180 es el MCM | — | 6 ✓; trampas ✓. «MCD(A, / B)» partido otra vez. El punteado bajo el 6 de la respuesta se ve cortado abajo |
| 10 (3) | Cuáles de 25, 30 y 37 dejan resto 1 con 4 y 6 | Sí | Sí | — | 25 y 37 ✓ (30 − 1 = 29 no sirve) |
| 11 (8) | Cuántos entre 100 y 150 dejan 2 con 6 y 9 | Sí | Sí | — | 110, 128 y 146 ✓ (92 y 164 quedan fuera) |
| 12 (14) | Alumnos con aulas de 30 y 40, sobran 5, entre 300 y 400 | Sí | Sí | — | 365 ✓; trampas 360, 1205, 125 y 245 ✓ |
| 13 (3) | Múltiplos de 3 o de 5 hasta 30 | Sí | Sí | Una plancha como la de la teoría ayudaría | 14 ✓ |
| 14 (8) | Ni de 4 ni de 10, del 1 al 100 | Sí | Sí | — | 30 y 70 ✓ |
| 15 (14) | Ni de 2, 3 ni 5, del 1 al 100 | Sí | Me pierdo en «50 + 33 + 20 − 16 − 10 − 6 + 3 = 74 (de 6, de 10, de 15 y de 30)»: el paréntesis va al final y no sé qué número es de cuál | — | 74 y 26 ✓; trampas 29, 33 y 3 ✓ |
| 16 (3) | Qué par tiene el mismo MCD que 64 y 24 | Sí | Sí | — | **Pregunta ambigua**: sin opciones, también sirven 16 y 8, 8 y 8, etc. (el MCD es 8). Debería decir «el par que sigue en las divisiones» |
| 17 (8) | Valor de [1; 2, 2] | Solo gracias a los Datos, que dan 1 + 1/(2 + 1/2) | Sí. «Empiezo por abajo» supone una escalera que no veo, porque todo está en una línea | Faltaría la fracción en escalera | 7/5 ✓. El título se parte: «[1;» y «2, 2]» |
| 18 (14) | Valor de [2; 1, 3] | Igual que la 17 | Sí. «Sin escalera» en las trampas, y la escalera nunca la vi | Igual | 11/4 ✓; trampas 10/3, 11/3 ([3; 1, 2]), 4/11 y 3 ✓. Se parte «[2;» y «1, 3]» |

**Las 3 que mejor se entienden:** 12 (aulas con sobrante), 06 (ladrillos para un cubo) y 13 (de 3 o 5 hasta 30).
**Las 3 que peor:** 16 (pregunta ambigua), 08 (PESI sin explicar y el 24 que aparece de golpe) y 15 (la suma larga con el paréntesis al final).

**¿Los niveles suben de verdad?** Sí. En cada idea el 3 es directo, el 8 es un problema contado y el 14 tiene trampas y un paso más (cubo, tres primos, raíz). Lo que menos sube es Euclides: la 16 es más fácil que las otras «3».

**¿El recuadro «Datos» ayuda?** Casi siempre ayuda: recuerda la regla sin dar el número. Regala en la 01, porque trae la descomposición en primos hecha. En la 17 y la 18 da la fracción ya escrita en forma de suma; ahí es imprescindible, porque la teoría nunca explicó qué vale una fracción continua.

### Lo que me trabó

- euclides, La regla: se nombra «fracción continua [2; 1, 1, 2] de 91/35» sin explicar qué número es ni cómo se calcula.
- euclides, Así se resuelve y tarjetas 17 y 18: «empiezo por abajo» y «sin escalera» suponen una escalera de fracciones que nunca se dibuja.
- multiplos-tramo, Ahora tú: la pista de Luma («se restan una vez») no corresponde a la pregunta (solo «a la vez»).
- multiplos-tramo, La regla: la fórmula del recuadro se parte mal («de A + de» / «B − de MCM»).
- multiplos-tramo, La regla: la L del «Vale si» no se explica.
- mismo-resto, La regla: el dibujo usa 4, 6 y 10, pero el recuadro solo 4 y 6 (MCM 12).
- mismo-resto, La regla: rₑ, «les falta lo mismo» y «homogeneiza» salen sin ejemplo.
- tarjeta 16: «¿Qué par tiene el mismo MCD?» tiene muchas respuestas.
- tarjeta 08: PESI sin explicar; «24 × p» aparece sin decir que es 3 × 8.
- tarjeta 15: el paréntesis «(de 6, de 10, de 15 y de 30)» al final no deja ver qué número es de cuál.
- tarjetas 07 y 09: «MCD(A, / B)» partido en dos líneas en los Datos.
- tarjetas 17 y 18: el corchete del título se parte en dos líneas.
- tarjetas 05 y 06: falta el dibujo de las losetas y del cubo (ninguna de las 18 tarjetas tiene dibujo).
- tarjeta 01: los Datos traen la descomposición hecha y regalan la mitad.

## Correcciones de la ronda 1

Paso 4 del cierre (19 nov), junto con la auditoría (`rutinas/auditoria/aritmetica.mcd-y-mcm.md`, «Correcciones (19
nov)»: ahí están las pruebas y lo que se comprobó). Archivos: `mcd-y-mcm.js` y su prueba, `plantillas/mcd-mcm/`
(generador, prueba y papel) y `arit-reparto` con su prueba (pieza nueva de esta unidad). No se tocaron `arit-cintas`,
`arit-boletos`, `app/` ni el resto de `nucleo/`. Las pruebas nuevas van en el bloque «Cierre (19 nov)» al final de
`mcd-y-mcm.test.js`, `generador.test.js` y `arit-reparto.test.js`, y fallan con la versión de antes.

| Punto | Qué se hizo |
|---|---|
| «2 rollos A (q)» y «3 rollos B (p)» (A, juego y regla 3) | Las notas de la cinta del MCM lo dicen en palabras: «2 rollos A: tantos como trozos tiene B, q» y «3 rollos B: tantos como trozos tiene A, p». La regla dice «p y q son los cocientes» y la tarjeta 3 de Lee, «p para el rollo A y q para el B». |
| A y B en los Datos de «Así se resuelve» (A, idea 1) | El paso «datos» dice «Hay A = 56 de fresa y B = 48 de limón» (y en las losetas de la idea 2, «A = 12 cm por B = 20 cm»). Además la pregunta cambió (auditoría, M3): la mayor cantidad de bolsas iguales y qué lleva cada una. |
| «Vale si enteros positivos» / «Vale si sin contar el 0» (A) | «Vale si A y B son enteros positivos…» y «Vale si no se cuenta el 0…». |
| PESI sin sus letras (A, regla 1) | «Si son PESI (primos entre sí), el MCD es 1». La tarjeta 08 dice «(que no comparten ningún primo)». |
| Punto y cuadrito sin leyenda en Lee (A, idea 2; B, Lee 5) | Lee 1 de la idea 2: «gana un caramelo (●)… una gaseosa (■)»; Lee 1 de la idea 5 dice también qué es el borde violeta. |
| «Si coinciden al empezar, esa es la primera vez» (A) | Condición: «Si coinciden al empezar, esa ya es la primera vez»; línea de Datos: «Si coinciden al empezar (hoy, o a la hora de partida), esa ya cuenta como la primera vez». |
| Luma «¿Se junta o se corta?» (A, «Ahora tú» 2) y «se restan una vez» (B, «Ahora tú» 5) | «Busca el primero que es múltiplo de todos: es el MCM.» y «Cuenta cada premio y mira cuáles están en las dos cuentas.» |
| La fracción continua sin escalera (B, regla 6, tarjetas 17 y 18) | La regla dibuja la escalera de 91/35 junto a [2; 1, 1, 2]; el paso 5 de Mira dice «Los cocientes 2, 1, 1 y 2: fracción continua de 91/35, en escalera»; las tarjetas 17 y 18 empiezan con [1; 2, 2] y [2; 1, 3] en escalera, y su resuelto dice «En escalera, empiezo por el escalón de abajo». |
| Tarjeta 16, muchas respuestas (B) | «Con el algoritmo de Euclides, ¿qué par de números se divide después, con el mismo MCD que 64 y 24?»; el resuelto dice que el divisor pasa a dividirse y el resto a dividir. |
| Regla 4: dibujo de 4, 6 y 10 y recuadro de 4 y 6; rₑ y «homogeneizar» sin ejemplo (B) | El dibujo es el de 25 con bolsitas de 4 y de 6 (25 = 12 × 2 + 1, el caso del recuadro). La condición: «Homogeneizar: con 4 sobran 3 y con 6 sobran 5, falta rₑ = 1». |
| «de A + de / B − de MCM» y «cada / par» partidos (B, regla 5) | «de A», «de B», «de MCM», «cada uno», «cada par» y «los tres» con espacios que no se parten; «de A, B o C =» y su suma en renglones propios. |
| La L del «Vale si» (B, regla 5) | «Vale si se cuenta del 1 al L: los de A son el cociente entero de L ÷ A…». |
| «sobran 1» (B, Lee 4) | `arit-reparto` dice «sobra 1» en singular, en la nota y en el texto alternativo. Prueba en la pieza. |
| Tarjeta 01 (Datos con la descomposición hecha) | Los Datos dan la regla y el exponente; el resuelto descompone 40 y 100. Lo mismo en «Con primos: 12 y 10» de la idea 2. |
| Tarjeta 08 (PESI; «24 × p» de golpe) | «3 × A = 3 × 8 × p = 24 × p…, con los mismos cocientes PESI (que no comparten ningún primo)». |
| Tarjeta 09 («6 × 180» sin decir que 180 es el MCM) | «…es 6, y el MCM es 30 × 6 = 180». |
| Tarjeta 15 (el paréntesis al final) | «De 2, de 3 y de 5 hay 50, 33 y 20. De 6, de 10 y de 15, 16, 10 y 6. De 30, 3.», y la suma en su ecuación. |
| «MCD(A, / B)» y «[1; / 2, 2]» partidos (B, tarjetas 07, 09, 17 y 18) | MCD(A, B) y MCM(A, B) con espacios que no se parten en las líneas de Datos; la regla 6 dice «A y B tienen el mismo MCD que B y r» (MCD, término tocable del glosario, se partía antes del paréntesis); los títulos de las tarjetas 17 y 18, sin partir. |

Lo que quedó, y por qué:
- **Para Gerson (dibujos):** las tarjetas 05 y 06 (losetas y ladrillos) piden un dibujo; hoy no hay pieza de losetas ni de
  cubo para los ejemplos (el cubo de ladrillos está en el laboratorio, en 3D). Se deja anotado; no se improvisa una pieza.
- **No es defecto:** lo dicho en el veredicto.
