# Lector en frío: aritmetica.numeros-primos-y-divisores

Ronda 1 (19 nov), con el método de `docs/metodo/unidad/4-lector-frio.md`; capturas `--entera --lector` del servidor del
auditor (puerto 4411; primer estado de cada momento: solo la tarjeta 1 de Lee y el paso 1 de Mira y de Así se
resuelve). Dos lectores nuevos, sin código: A con los momentos de las ideas 1 a 3; B con los de las ideas 4 a 6 y las 18
tarjetas de ejemplos (n.º 3, 8 y 14 de cada idea).

## Veredicto de la sesión

Los dos lectores resolvieron todos los Predice y los Ahora tú, hicieron un ejercicio propio por idea y dijeron lo que
aprendieron en cada juego; sus frases coinciden con `aprendizaje`. Las cuentas que rehicieron cuadran todas. Se corrige:
la regla de la idea 1 («Cada forma da dos divisores», falsa en el cuadrado y en el 1); Luma que habla de boletos sobre
caramelos y la de Mira 2, que no se entiende en el paso 1; los cordeles del cartel que se leen como una llave; los colores
de la plancha final de la criba sin explicar; «d ≤ √N o k ≤ √N», φ(N) y SD(N) partidos a 390 px; el 18 en turquesa como
un primo; PESI que llega de golpe a Predice 3, y que la idea 5 no dice en palabras; α, β, p y q sin decir en las reglas;
«forma canónica» y «descomposición canónica»; «Vale si» con mayúscula; «parejas filas ×» sin «de»; «12³ no es 2³»;
Wilson, (p − 1)! y el circulito sin presentar en la regla 6; el día 6 resaltado con la base 2 como si fuera la meta;
«base 2base 3»; «p − 1» antes de presentar p; los tachados que no se leen; «Otra rifa»; las tarjetas 01, 02, 10, 13, 15, 16
y 17. No son defectos: que solo se vea la tarjeta 1 de Lee y el paso 1 de Mira y de Así se resuelve (es la captura); la
cuarta fila vacía de la tabla del juego 4 (reserva el alto para β = 3: así la tabla no salta); el número del círculo de
cada tarjeta (es su número en la lista, de la app); el dibujo de la tarjeta 04 (muestra el planteamiento: la criba hecha
daría la respuesta); los Datos de las tarjetas 05 y 12 (dan la lista de primos y la fórmula, que el resuelto usa).

## Lector A: momentos de las ideas 1, 2 y 3

Soy alumno de 5.º. Solo miré las capturas `claro-cel-<idea>-N-*.png` de rectangulos, criba y factorizacion.
Aviso una sola vez: de Lee solo veo la tarjeta 1 de 4, de Mira solo el paso 1 (de 6 o de 5) y de «Así se resuelve» solo
el paso 1 («¿Qué me piden?»). No lo cuento como falla.

### Idea 1: Primo: una sola fila (rectangulos)

**1 Lee.** Veo tres bandejas con caramelos (los dulces con envoltura de lazos): 1 fila de 12, 2 filas de 6 y 3 filas de
4. La tarjeta «La bandeja de la vitrina» cuenta que doña Juana acomoda 12 caramelos en filas iguales y llenas. No me
piden nada, solo leer. Los números verdes son filas y caramelos por fila. Nada me hizo dudar.

**2 Juega.** Las mismas bandejas, un deslizador «Caramelos» (en 12) con − y +, y el texto «3 formas, 2 divisores cada
una: 6 divisores». Misión: buscar entre 20 y 28 la cantidad que solo se acomoda en una fila. Leyenda: «2 filas de 6, una
forma: da los divisores 2 y 6». Lo que aprendí: un número primo solo se acomoda en una fila (el 23). Comprobé: 12 tiene
1, 2, 3, 4, 6 y 12, son 6. Bien.

**3 Predice.** Cinco boletos de rifa (1, 2, 33, 35, 37) con una etiqueta encima «Gana un número primo». Me piden cuántos
ganan. Respondo C) 2: el 2 y el 37 (1 no es primo, 33 = 3 × 11, 35 = 5 × 7). Duda: la etiqueta tiene dos rayitas hacia
arriba en sus puntas y queda justo sobre los boletos 1 y 2; a primera vista parece que señala esos dos como ganadores.

**4 Mira.** Paso 1/6: un solo caramelo, «1 fila de 1», «Un caramelo: una sola forma, que da un solo divisor. 1 = 1 × 1».
Aprendí: el 1 tiene un solo divisor. Duda: Luma dice «Cuenta los divisores de cada boleto», pero en la pantalla hay
caramelos, no boletos.

**5 La regla.** Dibujo de 35: 1 fila de 35 y 5 filas de 7. Regla: primo tiene exactamente dos divisores; compuesto, más;
el 1 tiene uno solo y no es ni primo ni compuesto. Recuadro 37 = 1 × 37 (una forma: primo) y 35 = 1 × 35 = 5 × 7 (más
formas: compuesto). «Vale si» dice que son enteros mayores que 1 y que el 2 es el único primo par. Duda: la regla dice
«Cada forma da dos divisores», pero el 1 × 1 del Mira da uno solo, y con 36 la forma 6 × 6 también da uno solo (el 6).
¿Entonces en los cuadrados se cuenta distinto? No lo dice.

**6 Así se resuelve.** 75 caramelos, ¿de cuántas formas? Datos: N = filas × caramelos por fila; 3 × 8 y 8 × 3 son la
misma forma. Paso 1: «Piden cuántas parejas filas × caramelos por fila dan 75». Esa frase se lee rara, le falta un «de»
(«cuántas parejas de filas…»). Yo lo resuelvo: 1 × 75, 3 × 25, 5 × 15, son 3 formas.

**7 Ahora tú.** ¿Cuál boleto es primo: 69, 1, 89, 91? Datos con la definición de primo y compuesto. Respondo C) 89 (69 =
3 × 23, 91 = 7 × 13, el 1 no). Buenas trampas, el 91 engaña. Nada me trabó.

**Mi ejercicio.** ¿De cuántas formas se acomodan 18 caramelos y es primo? 1 × 18, 2 × 9, 3 × 6: 3 formas, 6 divisores
(1, 2, 3, 6, 9, 18), compuesto. Con 31: solo 1 × 31, una forma, primo.

### Idea 2: La criba tacha múltiplos (criba)

**1 Lee.** Una plancha de boletos del 1 al 30 (fichas tipo rompecabezas). Tarjeta «La rifa de los primos»: doña Juana
tacha los que seguro no son primos para no probar uno por uno. No piden nada. Claro.

**2 Juega.** La plancha con rayas: «Tachar con los primos hasta el 2», el 2 en un recuadro verde y los pares tachados;
botones 2, 3, 5, 7. Texto: «Hasta el 2: siguen sin tachar 9, 15, 21, 25 y 27». Misión: el menor primo con el que todo lo
que queda es primo. Respondo: hasta el 5 (con el 3 todavía queda el 25). Aprendí: no hace falta tachar con todos los
primos, se para antes. Comprobé la lista 9, 15, 21, 25, 27: bien.

**3 Predice.** Plancha del 1 al 100, «¿Hasta qué primo se tacha?». Opciones 47, 5, 7, 11. Respondo C) 7: hace falta para
el 49, 77 y 91, y el 11 ya no (11 × 11 = 121 pasa de 100). La etiqueta «Rifa grande: del 1 al 100» tiene otra vez las
rayitas en las puntas, como una llave cortada.

**4 Mira.** Paso 1/6: el 1 tachado, «El 1 no es primo: se tacha primero». Aprendí eso. Duda: Luma dice «Cada primo
empieza a tachar más lejos» y con solo este paso no entiendo qué quiere decir.

**5 La regla.** Plancha del 1 al 100 ya cribada: 2, 3, 5 y 7 en verde, los otros primos en morado, «Quedan 25 primos»
(los conté: son 25). Regla: para saber si N es primo se divide entre los primos p con p × p ≤ N. Fórmula N = d × k → d ≤
√N o k ≤ √N. «Vale si»: si un divisor pasa de la raíz cuadrada, su pareja no llega; cada primo tacha desde p × p. Dudas:
nadie dice por qué unos primos van en verde y otros en morado (supongo que los verdes son los que tachan). La fórmula se
corta: «k ≤» queda al final de una línea y el √N solo en la siguiente. El signo √ aparece por primera vez aquí; la palabra
«raíz cuadrada» subrayada ayuda. Ahora sí entiendo lo de Luma: el 7 empieza a tachar en 49.

**6 Así se resuelve.** ¿Es 281 primo? Datos: la regla y los primos menores que 40. Paso 1: piden saber si 281 tiene algún
divisor además de 1 y 281. Lo resuelvo: 17 × 17 = 289 pasa, pruebo 2, 3, 5, 7, 11, 13; ninguno divide (281 = 7 × 40 + 1,
11 × 25 + 6, 13 × 21 + 8). Es primo.

**7 Ahora tú.** Para asegurarse de que 293 es primo, ¿el mayor primo con el que hay que probar? 13, 19, 17, 139. Respondo
C) 17 (17 × 17 = 289 ≤ 293; 19 × 19 = 361). Trampas buenas (139 es como «la mitad»). Nada me trabó.

**Mi ejercicio.** ¿Es 221 primo? 15 × 15 = 225, así que pruebo hasta el 13: 2, 3, 5, 7, 11 no dividen, pero 13 × 17 = 221.
Es compuesto.

### Idea 3: Una sola factorización (factorizacion)

**1 Lee.** Bandeja de 3 filas de 4. Tarjeta «Partir y volver a partir»: 12 en 3 filas de 4, cada 4 se parte en 2 de 2; el
3 y el 2 ya no se parten, son primos. El dibujo solo muestra 3 filas de 4, no el segundo corte; se entiende igual.

**2 Juega.** Árbol de 36: 36 → 2 y 18 → 2 y 9 → 3 y 3; los primos en círculos verdes. 36 = 2 × 18 = 2² × 3². Botones
«Caramelos» (36, 48, 60, 64, 81, 100) y «Primer corte en» (2, 3, 4, 5, 6, 10). Leyenda: hoja con aro = primo; corte = el
número escrito como producto de dos. Misión: el número con tres primos distintos. Respondo 60 (2, 3 y 5). Aprendí: corte
como corte, al final quedan los mismos primos. Duda: en la ecuación el 18 sale en verde con subrayado punteado, igual que
los primos, y el 18 no es primo; la leyenda dice que verde con aro es primo.

**3 Predice.** Tabla «Par / ¿Comparten un primo?» con 7 y 21, 8 y 15, 9 y 15, todo con «?». Definen PESI (primos entre
sí). Respondo C) 8 y 15. La palabra PESI aparece de golpe aquí; quizá venía en las otras tarjetas de Lee que no veo. La
opción A («los dos tendrían que ser primos») es buena trampa.

**4 Mira.** Paso 1/5: árboles de 8 (2, 2, 2) y de 15 (3, 5); 8 = 2³ y 15 = 3 × 5. Aprendí: 8 y 15 no comparten primos, son
PESI aunque ninguno es primo. Nada me trabó.

**5 La regla.** Dos árboles de 60 (4 × 15 y 6 × 10), los dos terminan en 2, 2, 3, 5. Regla: todo número mayor que 1 es un
producto de primos de una sola manera, sin contar el orden; PESI = no comparten primos. Fórmula 60 = 2² × 3 × 5 (forma
canónica) y N = p^α × q^β × … (primos con sus exponentes). Dudas: las letras α y β no se explican ni se dice cómo se leen;
entiendo que son exponentes por la llave, pero son letras griegas que no usamos. El «× …» queda separado, como suelto.

**6 Así se resuelve.** Descomposición canónica de 810. Datos: la regla y la forma canónica con el ejemplo 2² × 3 × 5.
Paso 1: escribir 810 como producto de primos con su exponente. Lo resuelvo: 810 = 81 × 10 = 2 × 3⁴ × 5. Duda pequeña: la
Regla dice «forma canónica» y aquí «descomposición canónica»; supongo que es lo mismo.

**7 Ahora tú.** Canónica de 264: 2 × 3 × 11, 8 × 3 × 11, 2³ × 3 × 11, 2⁴ × 3 × 11. Respondo C) 2³ × 3 × 11 (8 × 33 = 264). La
B es una trampa justa: da 264, pero el 8 no es primo.

**Mi ejercicio.** Canónica de 504 y ¿es PESI con 55? 504 = 8 × 63 = 2³ × 3² × 7; 55 = 5 × 11. No comparten primos: son PESI.

### Lo que me trabó

- rectangulos, 4 Mira: Luma dice «Cuenta los divisores de cada boleto», pero la pantalla muestra caramelos, no boletos.
- rectangulos, 5 La regla: «Cada forma da dos divisores» choca con 1 = 1 × 1 (un divisor) y con los cuadrados (6 × 6 da solo el 6).
- rectangulos, 6 Así se resuelve, paso 1: «cuántas parejas filas × caramelos por fila» se lee raro; falta «de».
- rectangulos, 3 Predice (y criba 3, 4 y 5): la etiqueta del dibujo tiene rayitas en las puntas como una llave cortada; en rectángulos parece señalar los boletos 1 y 2 como ganadores.
- criba, 4 Mira: «Cada primo empieza a tachar más lejos» no se entiende hasta llegar a La regla.
- criba, 5 La regla: no se explica por qué 2, 3, 5 y 7 van en verde y los otros primos en morado.
- criba, 5 La regla: la fórmula «d ≤ √N o k ≤ √N» se parte y el √N queda solo en otra línea.
- factorizacion, 2 Juega: el 18 sale en verde con subrayado punteado como los primos, sin ser primo.
- factorizacion, 3 Predice: PESI aparece de golpe (puede que esté en tarjetas de Lee que no veo).
- factorizacion, 5 La regla: α y β sin explicar ni decir cómo se leen; el «× …» queda suelto.
- factorizacion, 5 y 6: «forma canónica» y «descomposición canónica» con dos nombres para lo mismo.
- Varias, La regla: «Vale si» sigue a veces con mayúscula («Primos», «Se») y a veces con minúscula («un»).

## Lector B: momentos de las ideas 4, 5 y 6, y 18 tarjetas de ejemplos

Soy un alumno de 5.º que no conoce la app. Solo miré las capturas. De Lee, Mira y «Así se resuelve» veo solo la primera tarjeta o el primer paso en las tres ideas; lo digo esta vez y no lo cuento como falla.

### Parte 1: momentos

#### Idea 4: Elegir exponentes cuenta divisores (divisores)

**1 Lee.** Veo tres bandejas de caramelos: 1 fila de 12, 2 filas de 6 y 3 filas de 4. Debajo hay una tarjeta 1/4, «Los divisores de 12», y a Luma (una tortuga) que me dice que lea con calma. Me piden leer y pasar a la siguiente tarjeta. Los números en verde son cuántas filas y cuántos caramelos van por fila. Dudé en una cosa: el texto dice que hay seis divisores (1, 2, 3, 4, 6 y 12), pero el dibujo muestra solo tres bandejas. Entiendo que cada bandeja da dos divisores, pero eso no lo dice.

**2 Juega.** Veo una tabla con columnas 2⁰ a 2³ y filas 3⁰ a 3², con los productos adentro, un círculo morado sobre el 72, dos deslizadores (α = 3, β = 2) y la misión «Arma el N que tiene exactamente 10 divisores». Me piden mover los exponentes. Aquí α es el exponente del 2, β el del 3, y una «casilla» es un divisor. Aprendí que la cantidad de divisores es columnas por filas: 4 × 3 = 12 para 72. Dudas:
- Hay una cuarta fila vacía en la tabla y no sé para qué está.
- Para tener 10 divisores necesito 5 × 2, o sea 2⁴ × 3 = 48, pero la tabla solo muestra hasta 2³ y no sé si el deslizador llega a 4.
- La frase de abajo («72 = 2³ × 3²: 4 columnas por 3 filas, 12 divisores») sale en otra letra (con serifas), distinta del resto de la pantalla.

**3 Predice.** Veo la tabla ya hasta 2⁴ y la pregunta «720 = 2⁴ × 3² × 5. ¿Cuántos divisores tiene 720?», con las opciones 10, 8, 30 y 15. La cuenta es 5 × 3 × 2 = 30 (C). El recuadro «Datos» solo repite 720 = 2⁴ × 3² × 5¹. Ayuda que el 5 lleve su exponente 1 a la vista, y no regala la respuesta.

**4 Mira (paso 1/6).** La tabla ahora tiene seis filas: se agregan las filas «× 5», hasta 720. El texto dice «Las tres primeras filas son los 15 divisores de 144». Aprendí que un primo nuevo duplica las filas (exponente 1, más 1, da 2). Comprobé las filas: 5 × 3 = 15 para 144, y los 30 números de la tabla están bien.

**5 La regla.** Veo las fórmulas de CD(N) (cantidad), SD(N) (suma) y PD(N) (producto) y el bloque «Vale si». Dudas:
- En SD aparecen p y q, cuando hasta ahora todo era con 2 y 3. Nadie me dice que p y q son los primos.
- La fórmula de SD está partida en dos renglones sin un «×» entre los dos paréntesis.
- PD(N) = N^(CD ÷ 2) sale sin ningún ejemplo.
- No entendí «12³ no es 2³». Entiendo que quiere decir que 12³ no está escrito en primos, pero así se lee raro.
- «Propios» y «Simples» se definen aquí pero no se usan en ninguna parte.
- CD(N) trae solo dos paréntesis, aunque el ejemplo de 720 tenía tres primos.

**6 Así se resuelve (paso 1).** La pregunta es «¿Cuántos divisores tiene 540?». En «Datos» están la fórmula, el primo extra y que todo número se escribe de una sola manera como producto de primos. El paso 1 está claro.

**7 Ahora tú.** La pregunta es N = 3⁴ × 5³ × 7³. La cuenta es 5 × 4 × 4 = 80 (C). Lo resolví sin problema.

**Mi ejercicio:** ¿Cuántos divisores tiene 200? 200 = 2³ × 5², así que (3 + 1)(2 + 1) = 12. Son 1, 2, 4, 8, 5, 10, 20, 40, 25, 50, 100 y 200.

#### Idea 5: Función de Euler, los PESI (euler)

**1 Lee.** Veo boletos del 1 al 12 y la tarjeta 1/4, «Otra rifa»: gana cada número que no comparte ningún primo con 12, «cada número que es PESI con 12». Dudas:
- «Otra rifa» me hace pensar que me perdí una rifa anterior.
- PESI está subrayado como palabra del glosario, pero en la tarjeta no dice que significa «primos entre sí».
- Arriba de los boletos queda un espacio grande vacío.

**2 Juega.** Veo los boletos del 1 al 12 con 1, 5, 7 y 11 marcados y los demás tachados. Las opciones de N son 12, 14, 15, 18, 21 y 22, y la misión es «que ganen justo 8». Aquí «gana» quiere decir que no comparte primo con N y «raya» que está tachado. Aprendí que con 12 = 2² × 3 quedan 4. Para la misión probé a mano: con 15 = 3 × 5 quedan 8. Dudas:
- Los números tachados casi no se leen: la raya pasa encima de un número gris claro.
- La etiqueta «N = 12 = 2² × 3» tiene dos rayitas que salen por arriba de su borde.

**3 Predice.** Veo la rifa grande del 1 al 100 y la pregunta «¿Cuántos ganan?», con las opciones 30, 40, 25 y 50. Mi respuesta es 100 × ½ × ⅘ = 40 (B). «¿Cuántos ganan?» aparece dos veces, debajo de la rejilla y en la pregunta. «Datos» no regala la respuesta.

**4 Mira (paso 1/5).** El texto dice «Gana el que no tiene ni el 2 ni el 5». Aprendí que basta mirar los primos de 100.

**5 La regla.** Veo la rejilla resuelta («Ganan 40 boletos»), la fórmula de φ(N) y φ(p) = p − 1. Comprobé que ganan los que terminan en 1, 3, 7 y 9: son 40, y está bien. Dudas:
- La fórmula está mal partida: «N × (1 − 1/p» queda en un renglón y «) × (1 − 1/q)» empieza el siguiente. El paréntesis se corta y cuesta leerla.
- «Si p es primo, solo p no es PESI con p» lo entendí recién al releerlo. Faltaría decir «del 1 al p».

**6 Así se resuelve (paso 1).** La pregunta es φ(108), y en «Datos» está la fórmula completa con «…». Se entiende. (Mi cuenta: 108 = 2² × 3³, así que 108 × ½ × ⅔ = 36.)

**7 Ahora tú.** La pregunta es 45 = 3² × 5. Mi cuenta es 45 × ⅔ × ⅘ = 24 (C).

**Mi ejercicio:** ¿Cuántos del 1 al 60 son PESI con 60? 60 = 2² × 3 × 5, así que 60 × ½ × ⅔ × ⅘ = 16.

#### Idea 6: Fermat y Wilson con un primo (fermat-wilson)

**1 Lee.** Veo la tienda «Caramelos de doña Juana»: 1 bolsita = 7 caramelos, el día 2 hay 9 caramelos, y quedan 1 bolsita llena y 2 sueltos. La tarjeta 1/4 dice que el pedido empieza en 3 y se multiplica por 3 cada día. Comprobé el dibujo: 9 = 7 + 2, y la bolsita tiene 7 caramelos. Duda: el título habla de Wilson, pero en esta tarjeta no aparece.

**2 Juega.** Veo una tabla con día, pedido y sueltos con 7. Las bases son 2, 3, 4 y 6, las bolsitas son de 7 o de 5, y la misión es «busca la base cuyos sueltos vuelven a 1 recién el día 6». Aprendí que los sueltos se repiten en ciclo. Probé a mano: la base 3 da 3, 2, 6, 4, 5, 1, y es la única de las opciones que tarda 6 días. Duda: con la base 2 elegida, la casilla del día 6 (que vale 1) sale resaltada como si fuera la meta. Me confundió, porque con la base 2 el 1 ya sale el día 3 y la misión pide «recién el día 6».

**3 Predice.** La pregunta es «101 es primo. ¿Qué resto deja 2¹⁰⁰ entre 101?», con las opciones 100, 1, 2 y «No se puede saber». Respondí 1 (B), porque la pista de Luma me llevó del día 6 con el 7 al día 100 con el 101. El salto de 7 a 101 es grande, pero la pista ayuda. «Datos» no regala la respuesta.

**4 Mira (paso 1/5).** Veo la tabla con las bases 2 a 6: el día 6 deja 1 en todas, y 3⁶ = 729 = 7 × 104 + 1. Comprobé las cinco columnas y están bien. Aprendí que con el 7, el día 6 siempre deja 1. Dudas:
- Los títulos de columna se pegan entre sí: se lee «base 2base 3base 4».
- Luma dice «el día p − 1», pero aquí todavía no me han dicho que p es el número de caramelos por bolsita.

**5 La regla.** Veo las fórmulas de Fermat y de Wilson y la notación p con un circulito encima. Dudas:
- El circulito sobre la p no se explica aquí; lo entendí recién en la pantalla siguiente («un múltiplo de p»).
- Wilson aparece de golpe: no lo jugué ni lo vi antes.
- (p − 1)! se presenta con el signo «!» y nada más.
- El «Vale si» («7⁶ deja 0 y, con 9, que no es primo, 2⁸ deja 4») es muy apretado. Comprobé que 7⁶ deja 0 entre 7 y que 256 = 9 × 28 + 4.

**6 Así se resuelve (paso 1).** La pregunta es «¿Qué resto deja 6⁹¹ entre 11?». En «Datos» están Fermat, la suma de exponentes y el circulito explicado. Se entiende.

**7 Ahora tú.** La pregunta es 4⁴⁷ entre 7. Mi cuenta: 47 = 42 + 5, y 4⁵ deja 4, 2, 1, 4, 2, o sea resto 2 (C). Lo comprobé: 1024 = 7 × 146 + 2.

**Mi ejercicio:** ¿Qué resto deja 3⁵⁰ entre 7? 3⁶ deja 1 y 50 = 48 + 2, así que queda 3² = 9, que deja 2.

### Parte 2: tarjetas de ejemplos

En todas las tarjetas comprobé las cuentas y las trampas que nombran; no encontré ninguna mal hecha. El número del círculo de cada tarjeta (3, 8 o 14) parece el nivel, pero nada lo dice. Como la tarjeta 01 lleva un «3», al principio creí que era la tarjeta número 3.

- **01, ¿Es 13 primo? (3).** Tengo todo para resolverla. El dibujo (6 filas de 2 y sobra 1) ayuda, y 6 × 2 + 1 = 13 está bien. Me pierdo en la línea 1: dice que probó «4, 5 o 6», pero no dice por qué basta con eso ni qué pasa con 7 a 12.
- **02, Primos entre 20 y 30 (8).** Hay todo. Sigo el resuelto, aunque «23 y 29 solo caben en una fila» se afirma sin probar con 3 ni con 5. No tiene dibujo.
- **03, Divisores en cantidad impar (14).** Hay todo y se sigue entero. Las trampas están bien: 6, 6, 8 y 6.
- **04, Los primos hasta 20 (3).** Hay todo. El dibujo sobra: muestra los boletos del 1 al 20 sin tachar nada y deja un espacio grande vacío. Si mostrara la criba ya hecha, ayudaría.
- **05, Primos entre 70 y 90 (8).** Hay todo y se sigue: quedan 71, 73, 79, 83 y 89, que son 5. En «Datos», la lista de primos menores que 20 distrae un poco.
- **06, Primos que terminan en 7 (14).** Hay todo y se sigue. Las trampas están bien.
- **07, Dos caminos para 36 (3).** Hay todo. El árbol solo muestra el primer corte (4 y 9, 6 y 6); ayuda poco, pero no confunde.
- **08, Factorizar un producto (8).** Hay todo y se sigue: 216 = 2³ × 3³.
- **09, Los exponentes de N (14).** Hay todo y se sigue. Las trampas están bien: 8, 7, 4 y 2.
- **10, Los divisores de 18 (3).** Hay todo y se sigue. «Las potencias de 2 que sirven son 1 y 2» funciona porque 1 = 2⁰, pero no lo dice. La línea «1, 3, 9 ; 2, 6, 18» sale en otra letra.
- **11, Los impares de 360 (8).** Hay todo. Sale clara.
- **12, Múltiplos de 6 (14).** Hay todo. El segundo dato casi da el método completo. Las trampas están bien: 40, 16, 4 y 12.
- **13, Los PESI con 9 (3).** Falta qué quiere decir PESI: no está en «Datos» y en esta tarjeta ni siquiera está subrayado. Sin haberlo memorizado no sé qué cuento. El resuelto se sigue.
- **14, Fracciones de denominador 12 (8).** Hay todo; aquí «irreducible si k y N son PESI» lo explica a medias. En «Datos» aparece una N que el enunciado no usa (el enunciado dice 12). Se sigue.
- **15, Fracciones de denominador 18 (14).** Hay todo. Las trampas están bien: 17, 11, 3 y 9.
- **16, Wilson con 5 (3).** «Datos» regala la respuesta: dice «deja p − 1», así que solo hay que restar 1. Igual la cuenta 24 = 5 × 4 + 4 me convence.
- **17, Wilson con 13 (8).** El resuelto usa 13 con un circulito encima y en esta tarjeta no se explica qué es. «Datos» vuelve a regalar la respuesta (13 − 1), y la tarjeta no es más difícil que la 16.
- **18, Dos potencias entre 41 (14).** Hay todo y se sigue: 1 + 1 = 2. Las trampas están bien.

**Las que mejor se entienden:** 03, 06 y 09. Tienen una idea clara, cada trampa explicada y no dependen de palabras raras.

**Las que peor:** 13 (PESI sin definir), 17 (el circulito sin explicar y la respuesta regalada) y 04 (el dibujo no aporta nada).

**¿Suben los niveles?** En general sí: el 3 es directo, el 8 pide un paso más y el 14 trae alternativas con trampas. Hay dos excepciones: la 15 es igual de difícil que la 14 (solo cambia 12 por 18) y la 17 es igual que la 16 con un número más grande.

**El recuadro «Datos»** casi siempre ayuda: me dio fórmulas que no tenía que recordar. Regala la respuesta en las de Wilson (16 y 17), le falta la definición de PESI en las de Euler (13 a 15) y distrae un poco en la 05.

### Lo que me trabó

- divisores, Juega: la cuarta fila vacía de la tabla y no saber si α llega a 4 para la misión de 10 divisores.
- divisores, Regla: p y q aparecen sin decir que son los primos; SD partida en dos renglones sin «×».
- divisores, Regla: «12³ no es 2³» se lee raro; «Propios» y «Simples» no se usan; PD sin ejemplo.
- euler, Lee: «Otra rifa» hace pensar que falta una rifa anterior; PESI no se define en la tarjeta.
- euler, Juega: los números tachados casi no se leen.
- euler, Regla: la fórmula de φ(N) está cortada a la mitad del paréntesis entre dos renglones.
- fermat-wilson, Juega: con la base 2, el 1 del día 6 sale resaltado como meta y confunde con la misión «recién el día 6».
- fermat-wilson, Mira: los títulos «base 2base 3base 4» se pegan; Luma dice «p − 1» antes de que me digan qué es p.
- fermat-wilson, Regla: el circulito sobre la p no se explica hasta la pantalla siguiente; Wilson y (p − 1)! aparecen sin haberlos jugado.
- tarjetas: el número del círculo (3, 8, 14) no dice que es el nivel; en la 01 parece el número de la tarjeta.
- tarjeta 01: no dice por qué basta probar con filas hasta de 6.
- tarjeta 04: el dibujo de boletos sin tachar no ayuda.
- tarjeta 13: PESI no está definido.
- tarjeta 17: el 13 con circulito no se explica, y «Datos» regala la respuesta (igual que en la 16).
- tarjeta 15: no sube de nivel respecto de la 14.

## Correcciones de la ronda 1

Paso 4 del cierre (19 nov), junto con la auditoría (`rutinas/auditoria/aritmetica.numeros-primos-y-divisores.md`,
«Correcciones (19 nov)»: ahí están las pruebas y lo que se comprobó). Archivos: `numeros-primos-y-divisores.js` (v0.3.1)
y su prueba, `plantillas/primos-divisores/` (generador, prueba y papel) y el bloque `criba` de `arit-boletos`, con su
prueba (cambio mínimo: dos opciones nuevas que por defecto no cambian nada, y el tachado más legible, que solo usa esta
unidad). No se tocaron `arit-bandejas`, `arit-arbol`, `app/` ni `nucleo/` fuera de esa pieza. Capturas después de
corregir: `/tmp/claude-0/-home-user/31d0ae9f-8026-5866-a5dc-2c8554ea89bf/scratchpad/e6-cierre-pri/despues/`.

| Punto | Qué se hizo |
|---|---|
| «Cada forma da dos divisores» (A, regla 1) | «Cada forma da dos divisores; la del cuadrado (6 × 6), uno solo.» La condición dice «el 1 no es ni uno ni otro». Lee 3 define primo por sus dos divisores, no por «una sola fila» (el 1 también cabía). La lectura del juego con un cuadrado ya decía «3 formas: 5 divisores (el 4 va con él mismo)»: se revisó de 4 a 30. |
| Luma: «boletos» sobre caramelos (A, Mira 1) | «Cada boleto, en caramelos: cuenta sus divisores.» |
| El cartel como una llave cortada (A, Predice 1 y criba; B, juego 5) | El cartel va sin cordeles en esta unidad (`cordeles: false` de `arit-boletos`). |
| «Cada primo empieza a tachar más lejos» (A, Mira 2) | «Mira dónde empieza a tachar cada primo.» |
| 2, 3, 5 y 7 de otro color (A, regla 2) | Al final de la criba, los 25 primos van en violeta, también los que tacharon (`primosQuedan`), y el pie dice «Quedan 25 primos, en violeta». Mientras tachan, el primo que tacha va en turquesa con su aro, como dice la leyenda del juego. |
| «d ≤ √N o k ≤ √N» partido (A, regla 2) | En su propio renglón y sin espacios que se partan. Captura: entero. |
| «parejas filas × caramelos» (A, Así se resuelve 1) | «Piden cuántas parejas de números, filas y caramelos por fila, dan 75 al multiplicarse.» |
| El 18 en turquesa como los primos (A, juego 3) | Las partes del primer corte van en tinta: «36 = 2 × 18 = 2² × 3²», con los primos de la descomposición en turquesa. |
| PESI llega de golpe (A, Predice 3; B, Lee 5 y tarjeta 13) | Lee 3 de la idea 3 lo presenta («Dos números que no comparten ningún primo se llaman PESI («primos entre sí»)»); Lee 1 de la idea 5 dice «PESI («primo entre sí»)»; la línea de φ(N) en los Datos dice «es decir, no comparten ningún primo con N». |
| α y β sin decir (A, regla 3) | La condición dice «p y q son primos, y α y β («alfa» y «beta») dicen cuántas veces entra cada uno». |
| «forma canónica» y «descomposición canónica» (A) | Un solo nombre en toda la unidad y la práctica: «descomposición canónica». |
| «Vale si» con mayúscula (A) | Las seis condiciones empiezan en minúscula. |
| p y q sin decir; SD partida; «12³ no es 2³» (B, regla 4) | «Con p y q primos, cada divisor de N = pᵅ × qᵝ…»; CD y SD con «×» entre los paréntesis, en un renglón después del «=»; «12³ = 2⁶ × 3³». PD tiene su ejemplo en el paso 6 de Mira (PD(720) = 720¹⁵); propios y simples se usan en los ejemplos 5 y 12 y en «Ahora tú» (la captura de la regla no los muestra). |
| φ(N) cortada en el paréntesis (B, regla 5) | Fracciones en línea en la regla, y φ con tres primos en dos renglones en los ejemplos y en «Ahora tú». «Del 1 al p, solo p no es PESI con p.» |
| Los tachados no se leen (B, juego 5) | Número al 72 % y raya más fina y suave. |
| «Otra rifa» (B, Lee 5) | «La rifa de 12 boletos». |
| El 1 del día 6 resaltado con la base 2 (B, juego 6) | Se resalta el primer día en que los sueltos vuelven a 1 (con la base 2, el día 3). La figura de Predice, la misma tabla, ya no marca el día 6. |
| «base 2base 3» (B, Mira 6) | Encabezados «×2» a «×6»: cada día el pedido se multiplica por la base. |
| «p − 1» antes de presentar p (B, Mira 6) | Voz «Con bolsitas de 7, mira el día 6»; los `siFuera` de Predice hablan del día 100 y del 101; Lee 3 dice que la bolsita prima se llama p. |
| Wilson, (p − 1)! y el circulito en la regla 6 (B) | Wilson se presenta en el paso 5 de Mira («Teorema de Wilson: el producto de 1 a 6 deja 6 entre 7»); la nota de la llave dice «el producto de 1 a p − 1» (sin «!»); la condición, «p̊: un múltiplo de p». La regla dice «p primo (la bolsita)». |
| Tarjeta 01 | «Con 7 filas o más no alcanzan 2 por fila, y 13 filas de 1 es la fila girada.» |
| Tarjeta 02 | «23 y 29 dejan sueltos en 2, 3, 4 y 5 filas; con 6 o más habría menos de 5 por fila: formas giradas ya probadas.» |
| Tarjeta 10 | «1 = 2⁰ y 2; … 1 = 3⁰, 3 y 9». |
| Tarjeta 13 | PESI en los Datos (fila de arriba). |
| Tarjeta 15 (no sube) | Denominador 90: hay que factorizar y entran tres primos; φ(90) = 24, con las trampas rehechas. |
| Tarjetas 16 y 17 (Datos con la respuesta; no sube) | 16: los Datos ya no traen Wilson; el resuelto hace la cuenta (24 = 5 × 4 + 4) y nombra el teorema al final. 17: «¿Es 1 × 2 × … × 12 + 1 un múltiplo de 13?»: Wilson y después la suma (sí, deja 0), con el circulito en los Datos. |

Lo que quedó, y por qué:
- **No es defecto:** lo de arriba, en el veredicto.
- **De la app (no se toca desde aquí):** la letra con serifas de la lectura del juego y de las fórmulas (es la de
  `app/estilos.css` para toda ecuación); el espacio vacío arriba de los boletos de Lee 1 de la idea 5 (la figura de Lee
  tiene un alto mínimo); una fracción apilada deja partir el renglón a su lado (`nucleo/ecuacion.js`), aquí esquivado
  desde el contenido.
- **Para Gerson:** la bandeja, el árbol y la plancha de la rifa siguen como dibujos de prueba.
- **Decidido por la sesión, Gerson revisa después:** la tarjeta 16 no trae Wilson en los Datos (lo descubre con la cuenta),
  y el cartel de la rifa va sin cordeles en esta unidad.
