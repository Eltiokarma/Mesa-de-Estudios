# Lector en frío: algebra.factorizacion

19 nov 2026, ronda 1. Dos lectores nuevos, solo con capturas a 390 px (`--entera`), sin el código ni el `aprendizaje`:
el A, los momentos de las ideas 1 a 3; el B, los de las ideas 4 a 6 y 18 tarjetas de ejemplos (niveles 1, 2 y 3 de cada
idea). Capturas: `/tmp/claude-0/-home-user/31d0ae9f-8026-5866-a5dc-2c8554ea89bf/scratchpad/e7-cierre-fz/lector/`. Sus
informes van tal cual (con un nivel más en los títulos); al final, «Correcciones de la ronda 1». La auditoría del
contrato está en `rutinas/auditoria/algebra.factorizacion.md`.

## Lector A: momentos de las ideas 1, 2 y 3

Soy un alumno de 5.º de Juliaca. Miré solo las 21 capturas `claro-cel-<idea>-N-*.png` (factor-comun, identidades, aspa-simple; del 1 Lee al 7 Ahora tú). De Lee solo veo la primera tarjeta, y de Mira y «Así se resuelve» solo el primer paso. Lo digo esta vez y no lo cuento como falla.

### Idea 1: Factor común y agrupación

**1 Lee.** Veo «Pedido: 2x² + 4x», 2 losetas cuadradas grandes y 4 tiras delgadas. Tarjeta 1/4, «El pedido de Rubén»: tiene 2 losetas y 4 tiras que cubren (2x² + 4x) dm² y las quiere en un solo pasadizo rectangular, sin que sobre ninguna pieza. Me piden leer. Símbolos: x² es una loseta y x es una tira, en dm². Duda: no dice cuánto miden las tiras (supongo que x por 1).

**2 Juega.** Veo un pasadizo con las 2 losetas y las 4 tiras en fila, ancho «x dm» en verde, largo «(2x + 4) dm» en morado, «Sobran: nada», la ecuación x · (2x + 4) = 2x² + 4x y un deslizador «Ancho: cuántas x» que está en 1. Me piden elegir el ancho más grande que use todo sin que sobre nada. Hay una leyenda: x es el lado de la loseta, «ancho» es el factor que se saca, «largo» es lo que queda dentro y sobran o faltan piezas. Aprendí que sacar factor común es armar un rectángulo: lo de afuera es el ancho y lo de adentro es el largo. Duda: con el ancho en 1 ya dice «Sobran: nada». Si no leo bien la palabra «más grande», creo que ya terminé.

**3 Predice.** Veo una tabla con número y exponente de x: el primero tiene 6 y 3, el segundo 3 y 2, y la fila «común» tiene «?». Pregunta: la factorización de 6x³ + 3x² con todo su factor común afuera. Datos: 6 = 3 · 2 y «x³ es x² por x». Respondería A, 3x²(2x + 1). Duda: los Datos casi me dictan el 3 y el x², así que regalan bastante. B y C también son iguales al polinomio, pero no tienen todo el factor afuera; eso está bien pensado.

**4 Mira.** Veo una tabla «paso | queda» y el paso 1/6: «El mayor número que divide a 6 y a 3 es 3», con 6 = 3·2 y 3 = 3·1. Aprendí que primero se busca el número y después cada letra. Duda: la columna «queda» dice «3 divide a 6 y a 3», y eso no es lo que queda.

**5 La regla.** Veo el pasadizo armado de otra forma: ancho 2x y largo (x + 2), con 2 losetas apiladas y 4 tiras. La regla dice que se toma el mayor número que divide a los coeficientes y cada letra con su menor exponente, y que si nada es común a todos se agrupa de a dos. La fórmula es ab + ac = a(b + c), con a en verde (ancho) y b + c en morado (largo); coincide con Juega. Duda: «Vale si un término que sale entero deja un 1 dentro» no lo entiendo como condición, parece más bien un aviso. Además, «agrupación» está en el título y en la regla, pero en estas 7 pantallas no vi ningún ejemplo de agrupar.

**6 Así se resuelve.** Factorizar 8x³y³ + 16x²y⁴ + 12x²y. Hay una tabla con número (8, 16, 12), x (x³, x², x²) e y (y³, y⁴, y), y la fila «común» vacía. Datos: la regla, «dentro va cada término dividido entre el factor común» y xᵐ ÷ xⁿ = xᵐ⁻ⁿ, x⁰ = 1. El paso 1 es «¿Qué me piden?». Lo resolví yo: 4x²y(2xy² + 4y³ + 3), y lo comprobé multiplicando. Duda: la fila se llama «coeficientes» pero también abarca las columnas x e y, que no son coeficientes.

**7 Ahora tú.** Pregunta: 28x² + 7x. Respondo D, 7x(4x + 1). A, 7x(4x), es la trampa del 1 que se olvida, y la regla me avisó de eso. Se entiende.

**Ejercicio inventado.** Factorizar 15a³b² − 10a²b⁴. El número es 5, a lleva a², b lleva b², así que queda 5a²b²(3a − 2b²). Al multiplicar sale 15a³b² − 10a²b⁴. ✓

### Idea 2: Productos notables al revés

**1 Lee.** Veo «Pedido: x² + 9», 1 loseta y 9 cuadraditos en un bloque de 3×3. Tarjeta 1/3, «Un piso cuadrado»: Rubén quiere un piso cuadrado (ancho igual al largo) y puede comprar las tiras que le falten. Se entiende.

**2 Juega.** Veo un cuadrado de lado (x + 2) por (x + 2): la loseta, 2 tiras a la derecha, 2 abajo y 4 cuadraditos en la esquina. Dice «Sobran:» con 5 cuadraditos y la ecuación «(x + 2)² = x² + 4x + 4; pedido: x² + 4x + 9». Hay dos deslizadores: «Lado: x más» en 2 y «Tiras que compra» en 4. Me piden elegir el lado y las tiras para usar todo, sin sobras ni huecos. Lo resolví con lado x + 3 y 6 tiras, porque (x + 3)² = x² + 6x + 9. Aprendí que un trinomio es un cuadrado si el del medio es el doble producto (6x = 2·x·3). Dudas: el «pedido» era x² + 9 y aquí aparece como x² + 4x + 9, mezclando lo que compro con lo que pedí. La ecuación además se parte mal en dos líneas («; pedido:» queda colgando).

**3 Predice.** Veo una tabla «es el cuadrado de»: x⁴ viene de x² y 16 viene de 4, y abajo «factorización completa: ?». Pregunta: la factorización completa de x⁴ − 16. Datos: x⁴ = (x²)² y 16 = 4² = 2⁴. Respondo C, (x² + 4)(x + 2)(x − 2). Duda: en Juega solo vi el cuadrado de un binomio. La diferencia de cuadrados, (a + b)(a − b), no la había visto (puede que esté en las tarjetas 2 o 3 de Lee, que no veo). Sin saberla habría puesto B o D al azar.

**4 Mira.** Veo una tabla «polinomio | factorizado» y el paso 1/6: «Dos cuadrados y su doble producto: un binomio al cuadrado», x² + 6x + 9 = (x + 3)². Aprendí que primero hay que mirar qué forma tiene el polinomio. Se entiende, y confirma lo que encontré en Juega.

**5 La regla.** Veo una tabla «forma | se escribe»: a² − b² da (a + b)(a − b), a² ± 2ab + b² da (a ± b)², y a³ ± b³ da (a ± b)(a² ∓ ab + b²). La regla dice que se lee el producto notable al revés y que se sigue hasta que cada factor sea primo. Dudas: los cubos y el símbolo ∓ aparecen aquí por primera vez, sin dibujo ni explicación. «Vale si primero se saca el factor común» tampoco es una condición, es un orden. Lo de que a² + b² ya no se abre sí lo entendí.

**6 Así se resuelve.** Factorizar 16x² − 24x + 9. Hay una tabla «término | es» con 16x², 9 y −24x vacía. El paso 1 es «¿Qué me piden?». Lo hice yo: 16x² = (4x)², 9 = 3² y 2·4x·3 = 24x, así que da (4x − 3)². Duda en los Datos: «a² − b² = (a + b)(a − b), con a y b los dos términos». a y b no son los términos (16x² y 25) sino lo que está al cuadrado (4x y 5).

**7 Ahora tú.** Pregunta: 16x² − 25. Respondo A, (4x + 5)(4x − 5). El mismo dato «con a y b los dos términos» se repite aquí, y leído al pie de la letra lleva a B, (16x + 25)(16x − 25).

**Ejercicio inventado.** Factorizar 9x² + 30x + 25. Es (3x)², 5², y 2·3x·5 = 30x, así que da (3x + 5)². ✓

### Idea 3: Aspa simple

**1 Lee.** Veo «Pedido: x² + 7x + 12» con 1 loseta, 7 tiras y 12 cuadraditos. Tarjeta 1/3, «Otro pedido»: un pasadizo de (x + m) por (x + n) dm sin que sobre ni falte nada. Se entiende, y m y n quedan presentados.

**2 Juega.** Veo un pasadizo de ancho (x + 2) y largo (x + 5): 1 loseta, 2 tiras abajo, 5 a la derecha y 10 cuadraditos. Dice «Sobran: 2» y la ecuación «(x + 2)(x + 5) = x² + 7x + 10; pedido: x² + 7x + 12». Hay dos deslizadores, m = 2 y n = 5. Me piden usar todo con el ancho menor que el largo. Lo resolví con m = 3 y n = 4. Aprendí que los dos números suman lo del medio (7) y multiplican lo del final (12). Duda: la ecuación también se parte en dos líneas, aunque se entiende.

**3 Predice.** Veo un aspa en tabla: 2x en verde arriba, x en morado abajo, dos «?» y flechas cruzadas. Hay columnas vacías (la 2.ª y la 4.ª) y no sé para qué son. Pregunta: 2x² + 7x + 3. Datos: 2x² = 2x · x y 3 = 1 · 3. Respondo B, (2x + 1)(x + 3), porque 2x·3 + x·1 = 7x. Duda: en Juega solo había x², y aquí salta a 2x² sin dibujo. Con los Datos se puede.

**4 Mira.** Veo una tabla con x | 3 y x | 4 y la cabecera «en cruz». Paso 1/6: «El pasadizo del juego: cada lado es una fila del aspa», x² + 7x + 12 = (x + 3)(x + 4). Aprendí que cada fila del aspa es un factor. Se entiende bien y une el juego con el aspa.

**5 La regla.** Veo el aspa de 2x² + 7x + 3 (2x con 1, x con 3, flechas cruzadas) y la columna «en cruz» con 6x y x, y debajo 6x + x = 7x. La regla dice que el primer término se parte en dos con x, el último en dos números, y que si los productos en cruz suman el del medio cada fila es un factor. Da (2x + 1)(x + 3). Dudas: 6x está escrito en la fila de 1, y 2x·1 no es 6x. Tuve que seguir la flecha para ver que es 2x·3. «Vale si ninguna partición da el término del medio, el trinomio no se factoriza» se lee al revés: parece decir cuándo vale y en realidad dice cuándo no. Nox dice que «los signos salen del último término», pero también dependen del término del medio.

**6 Así se resuelve.** Factorizar x² + 3x − 18. Veo el aspa con x, x y dos «?». Datos: la regla del aspa, la cruz que suma el término del medio y los signos de un producto. El paso 1 es «¿Qué me piden?». Lo hice yo: 6 · (−3) = −18 y 6 − 3 = 3, así que da (x + 6)(x − 3). Duda: es la primera vez que aparecen números negativos. En Juega, Mira y la Regla todo era positivo.

**7 Ahora tú.** Pregunta: cuál binomio es factor de x² − 16x + 63. Respondo B, x − 7, porque (−7)(−9) = 63 y −7 − 9 = −16. Los Datos de signos me ayudaron. Sin ellos habría elegido x + 7.

**Ejercicio inventado.** Factorizar 3x² − 10x − 8. Parto 3x² en 3x · x y −8 en 2 · (−4). En cruz: 3x·(−4) + x·2 = −10x ✓. Queda (3x + 2)(x − 4).

### Lo que me trabó

- factor-comun, 2 Juega: con el ancho en 1 ya dice «Sobran: nada» y parece que la misión ya está cumplida. Además no se dice cuánto mide una tira.
- factor-comun, 3 Predice: los Datos (6 = 3·2, x³ es x² por x) casi dictan el factor 3x².
- factor-comun, 4 Mira: la columna «queda» dice «3 divide a 6 y a 3», que no es lo que queda.
- factor-comun, 5 La regla: «Vale si un término que sale entero deja un 1 dentro» no se entiende como condición. «Agrupación» se nombra, pero no vi ningún ejemplo.
- factor-comun, 6 Así se resuelve: la fila «coeficientes» abarca también las columnas x e y.
- identidades, 2 Juega: el pedido era x² + 9 y la ecuación dice «pedido: x² + 4x + 9». La línea de la ecuación se parte mal.
- identidades, 3 Predice: pide una diferencia de cuadrados que no vi antes (en Juega solo hay cuadrado de binomio).
- identidades, 5 La regla: aparecen los cubos y el símbolo ∓ sin explicación. «Vale si primero se saca el factor común» es un orden, no una condición.
- identidades, 6 Así se resuelve y 7 Ahora tú: «con a y b los dos términos» está mal, porque a y b son las raíces (4x y 5) y no los términos (16x² y 25). Así lleva a la opción B.
- aspa-simple, 3 Predice y 5 La regla: el aspa tiene columnas vacías, y la columna «en cruz» pone 6x en la fila del 1.
- aspa-simple, 5 La regla: «Vale si ninguna partición da el término del medio…» se lee al revés.
- aspa-simple, 6 Así se resuelve y 7 Ahora tú: los negativos aparecen recién aquí, porque Juega, Mira y la Regla solo usan +. Nox dice que los signos salen solo del último término.
- aspa-simple, 3 Predice: salta de x² a 2x² sin dibujo previo.

## Lector B: momentos de las ideas 4, 5 y 6 y las 18 tarjetas

Soy un alumno de 5.º de secundaria. Solo miré las capturas. Aviso una sola vez: de Lee vi solo la primera tarjeta, de Mira solo el paso 1 y de «Así se resuelve» solo el paso 1. No lo cuento como falla.

### Parte 1: momentos

#### Idea 4: Aspa doble y doble especial

**1 Lee.** Veo un rectángulo partido en 9 parcelas. Arriba los lados miden x, 2y y 1; a la izquierda, x, y y 2. Dentro de las parcelas están x², 2xy, x, xy, 2y², y, 2x, 4y y 2. Debajo, la suma: x² + 3xy + 2y² + 3x + 5y + 2. La tarjeta 1/3 habla de un terreno de (x + 2y + 1) por (x + y + 2). Todavía no me piden nada. x e y son medidas en metros. Comprobé las cuentas: (x + 2y + 1)(x + y + 2) da justo ese polinomio. El dibujo se entiende muy bien. Sin dudas.

**2 Juega.** Veo una tabla con columnas x, y y número. La fila de arriba (verde) tiene 2x, 3y y 1; la de abajo (morada), x, y y 6. Hay flechas cruzadas entre x e y y entre y y número, y una fila «cruce» con 5xy ✗ y 19y ✗. Debajo dice «x con número: 2x·6 + x·1 = 13x ✗» y, en otra letra, «aspas: 5xy, 19y y 13x; el polinomio pide 7xy, 11y y 7x». Me piden elegir los términos en y y los números para que las tres aspas cuadren. Hice las cuentas: con «y arriba, 3y abajo» y «3 y 2» sale 2x·3y + x·y = 7xy, y·2 + 3y·3 = 11y y 2x·2 + x·3 = 7x. Aprendí que cada aspa comprueba un término del medio y que hay que cambiar una sola cosa a la vez. Dudas:
- La tercera aspa (x con número) no tiene flechas en la tabla; solo aparece como texto.
- La línea «aspas: … el polinomio pide …» está en otra letra (con serifas) y parece de otro lugar.
- La ✗ pequeña se monta sobre la «y» de 5xy y de 19y.

**3 Predice.** Veo una tabla con encabezados x², x y número. Tiene x² y x² en la primera columna, dos casillas «?» en la del medio y 1 y 2 en la última, con el aspa de los extremos. Abajo dice «falta en x²: ?». Me piden qué término en x² pone la columna del medio en x⁴ + 5x³ + 9x² + 7x + 2. Los extremos cruzados dan x²·2 + 1·x² = 3x², así que falta 9x² − 3x² = 6x², la D. Dudas:
- El recuadro «Datos» ya trae x²·2 = 2x² y 1·x² = x². Casi regala el cruce y solo queda restar.
- El encabezado «x²» de la primera columna me confundió un momento: es «la columna de los x²», no el término x⁴.

**4 Mira (paso 1/7).** Veo la tabla 2x, y, 3 / x, 3y, 2 con tres filas vacías debajo. Dice: «Se parten los extremos de cada columna: 2x² = 2x·x; 3y² = y·3y; 6 = 3·2». Es la respuesta de Juega. Aprendí que primero se parten x², y² y el número, y después se revisan las aspas. Duda: no sé para qué son las tres filas vacías (supongo que se llenan en los pasos siguientes).

**5 La regla.** Veo la tabla x² | 2x | 1 y x² | 3x | 2, con «9x² − 3x² = 6x² = 2x · 3x». La regla dice que la aspa doble tiene tres columnas y tres aspas, y que en la doble especial la columna del medio pone lo que falta del término en x². «Vale si» el polinomio va ordenado, con 0 en el término que falte. Comprobé: (x² + 2x + 1)(x² + 3x + 2) = x⁴ + 5x³ + 9x² + 7x + 2. Dudas:
- La regla no dice cómo elegir entre 6x² = 2x·3x y 6x² = 6x·x.
- Tampoco muestra que hay que revisar el x³ (x²·3x + x²·2x = 5x³) y el x (2x·2 + 3x·1 = 7x). En el dibujo solo está el aspa de los extremos.

**6 Así se resuelve (paso 1).** Piden factorizar 2x² + 5xy − 3y² + 2x + 13y − 4 como producto de dos trinomios. El «Datos» explica las tres aspas y los signos. Lo terminé yo: (2x − y + 4)(x + 3y − 1). Sin dudas en el paso 1.

**7 Ahora tú.** ¿Cuál es un factor de 2x² − 5xy + 2y² − 2x + 7y − 4? Las opciones son A 2x − y − 4, B 2x − y + 1, C 2x + y − 4 y D x − 2y − 4. Me sale (2x − y − 4)(x − 2y + 1), así que es la A. Duda: las opciones salen en verde y con subrayado punteado, como las palabras del glosario. Parece que al tocarlas abrirán una definición.

**Ejercicio mío.** Factoriza x² + 5xy + 6y² + 4x + 9y + 3. Columnas: x | x; 2y | 3y; 1 | 3. Aspas: x·3y + x·2y = 5xy; 2y·3 + 3y·1 = 9y; x·3 + x·1 = 4x. Respuesta: (x + 2y + 1)(x + 3y + 3).

#### Idea 5: Divisores binómicos y teorema del factor

**1 Lee.** Veo una hoja de cuaderno con la tabla de Ruffini de x³ − x² + x − 6 con a = 1. Arriba van los coeficientes 1, −1, 1 y −6; en medio, 1, 0 y 1; abajo, 1, 0, 1 y la caja −5. Unas flechas verdes suben de abajo al medio. La tarjeta 1/3 dice que Rubén busca un factor x − a con la tabla de Ruffini, «como en División de polinomios». No me piden nada. Comprobé la tabla: está bien. Duda: si no vi la idea «División de polinomios», no sé leer la tabla. Aquí no se explica cómo se llena (quizá en las tarjetas 2 y 3).

**2 Juega.** Veo la misma tabla con a = 1, «P(1) = −5: la última casilla», la leyenda (a es el número que se prueba, abajo va el cociente, la caja es lo que sobra) y un deslizador para a. Me piden probar números hasta que la última casilla sea 0. Con a = 2 sale 8 − 4 + 2 − 6 = 0. Aprendí que si sobra 0, x − a es factor. Sin dudas: la leyenda ayuda mucho.

**3 Predice.** Me dicen que P(−3) = 0 para x³ + 2x² − 5x − 6 y preguntan qué binomio es factor. Es x + 3, la A. Lo comprobé: −27 + 18 + 15 − 6 = 0. La pista de Nox («qué binomio vale 0 cuando x es −3») es buena y la trampa x − 3 está bien puesta. Sin dudas.

**4 Mira (paso 1/6).** Dice: «Con a = 1 sobra −5: x − 1 no es un factor», con P(1) = 1 − 1 + 1 − 6 = −5. Aprendí que el resto de Ruffini es lo mismo que P(a). Duda: Nox dice «Primero los candidatos; después la tabla», pero el paso 1 ya prueba a = 1 sin haber listado los candidatos.

**5 La regla.** Veo la tabla con a = 2 (2, 2 y 6 en medio; 1, 1, 3 y la caja 0 abajo) y P(x) = (x − a)·q(x). Dice que se prueban los divisores del independiente y que, «si el principal no es 1, también fracciones». Comprobé la tabla: está bien, y el cociente es x² + x + 3. Dudas:
- No dice qué fracciones hay que probar. Recién lo encontré en la tarjeta 14 de ejemplos: los divisores del independiente entre los del principal.
- «Principal» no está explicado en esta pantalla.

**6 Así se resuelve (paso 1).** Piden factorizar por completo x³ + x² − 9x − 9. Arriba ya está la tabla con a = −1: abajo 1, 0, −9 y la caja 0. El «Datos» trae el teorema, los candidatos, Ruffini y el aspa. Lo terminé yo: (x + 1)(x² − 9) = (x + 1)(x + 3)(x − 3). Dudas:
- El dibujo ya muestra que a = −1 funciona antes de los pasos. Adelanta la parte de buscar.
- Para x² − 9 el «Datos» propone el aspa, pero es una diferencia de cuadrados.

**7 Ahora tú.** Me dicen que P(−1) = 0 para x³ + 2x² + 6x + 5 y preguntan qué binomio es factor. Es x + 1, la A. Lo comprobé: −1 + 2 − 6 + 5 = 0. Dudas:
- Es casi igual a Predice. No pide usar Ruffini ni factorizar del todo, como sí hace «Así se resuelve».
- Nox dice «Prueba los divisores del término independiente», pero el enunciado ya da el número que anula.
- Las opciones salen en verde y subrayadas, como en la idea anterior.

**Ejercicio mío.** Factoriza x³ − 6x² + 11x − 6. Candidatos: ±1, ±2, ±3 y ±6. P(1) = 1 − 6 + 11 − 6 = 0. Ruffini con a = 1 deja 1, −5, 6 y resto 0, así que el cociente es x² − 5x + 6 = (x − 2)(x − 3). Respuesta: (x − 1)(x − 2)(x − 3).

#### Idea 6: MCD y MCM de polinomios

**1 Lee.** Veo un rectángulo con «largo: (x + 2) dm» y «ancho: (x + 1) dm», armado con un cuadrado grande, tiras y cuadraditos. La tarjeta 1/4 habla de dos pedidos, (x² + 3x + 2) dm² y (x² + 4x + 3) dm², armados en pasadizos del mismo ancho (x + 1). No me piden nada. El dibujo corresponde al primer pedido: (x + 1)(x + 2) = x² + 3x + 2. Dudas:
- «Pasadizos» para un pedido de dm² me sonó raro, como si fueran pasillos.
- El dibujo es pequeño y deja mucho espacio vacío.

**2 Juega.** Veo una tabla con las columnas factor, en P, en Q, MCD y MCM:
- x − 2: 3, 1, 1 y 3
- x + 2: 2, 1, 1 y 2
- x + 3: 0, 1, 0 y 1

Debajo dice «grados: MCD 2 + MCM 6 = P·Q 8», y hay dos deslizadores para el exponente de x − 2 en P y en Q. La misión es que x − 2 vaya al cuadrado en el MCD y en el MCM: hay que poner 2 en P y 2 en Q. Aprendí que el MCD toma el menor exponente y el MCM el mayor. Comprobé los grados: están bien. Dudas:
- La línea «MCD 2 + MCM 6 = P·Q 8» se lee mal: no dice «grado de P·Q», y va en otra letra.
- El enunciado dice «P tiene los factores x − 2 y (x + 2)²» sin exponente en x − 2, pero la tabla pone 3. Entendí que es lo que yo elijo, pero choca un momento.

**3 Predice.** P = x² − 1 y Q = x² − 2x + 1. ¿Cuál es el MCD? Factorizo: (x + 1)(x − 1) y (x − 1)². El MCD es x − 1, la A. El «Datos» da pistas para factorizar sin dar la respuesta. Bien.

**4 Mira (paso 1/5).** Veo la tabla con x − 1 (1 en P, 2 en Q) y x + 1 (1 en P, 0 en Q), y las columnas MCD y MCM vacías. Dice «Primero se factoriza cada uno», con x² − 1 = (x + 1)(x − 1). Aprendí el orden: primero se factoriza, después se comparan los exponentes. Sin dudas.

**5 La regla.** Veo la tabla completa (MCD: 1 y 0; MCM: 2 y 1). La regla dice que el MCD lleva los factores comunes con su menor exponente y el MCM todos los factores con su mayor exponente, y da MCD·MCM = P·Q «con todos mónicos». Comprobé: (x − 1)·(x − 1)²(x + 1) = P·Q. Duda pequeña: la condición «mónicos» sale dos veces, debajo de P·Q y en el «Vale si». Se entiende.

**6 Así se resuelve (paso 1).** Piden el MCD de x² − 7x + 10 y x² − x − 20. Lo hice yo: (x − 2)(x − 5) y (x − 5)(x + 4), así que el MCD es x − 5. La frase «el polinomio de mayor grado que divide a los dos» me ayudó. Sin dudas.

**7 Ahora tú.** P = (x − 2)²(x + 4)² y Q = (x − 2)³(x + 1). ¿Cuál es el MCD? Es (x − 2)², la A. Dudas:
- Nox dice «Factoriza primero», pero los dos ya vienen factorizados.
- Es más fácil que Predice y que «Así se resuelve».

**Ejercicio mío.** P = x² − 4 y Q = x² + 4x + 4. Factorizo: P = (x + 2)(x − 2) y Q = (x + 2)². MCD = x + 2 y MCM = (x + 2)²(x − 2). Comprobación: el grado de MCD·MCM es 1 + 3 = 4, igual que el de P·Q, 2 + 2.

### Parte 2: tarjetas de ejemplos

Cada tarjeta trae un número de nivel: 3, 8 o 14.

| # | ¿Qué me piden? | ¿Tengo todo? | ¿Sigo el Resuelto? | Dibujo | Algo raro |
|---|---|---|---|---|---|
| 01 (3) | Factorizar 10x²y − 15xy² | Sí | Sí. Comprobé 5xy(2x − 3y). | No hay | Nada |
| 02 (8) | Factorizar 5x(x + 4) + 3(x + 4) | Sí | Sí. (x + 4)(5x + 3) ✓ | No hay | El producto se corta en dos renglones: «(x + 4)» y abajo «(5x + 3)» |
| 03 (14) | Valor del otro factor de x²y + xy² + 3x + 3y con x = 2 e y = 3 | Sí | Sí. (x + y)(xy + 3) → 9 ✓. Comprobé las trampas, también la E: 45 = 5·9 ✓ | No hay | Nada; buenas explicaciones de cada trampa |
| 04 (3) | Lado del piso cuadrado de x² + 8x + 16 | Sí | Sí. (x + 4)² ✓ | Ayuda: 1 loseta, 8 tiras y 16 cuadraditos sin armar. No regala la respuesta | El cuadradito 16 sale suelto, más bajo y más pequeño que los demás (filas de 5, 5 y 6) |
| 05 (8) | Factorizar 8x³ − 1 | Sí | Sí. (2x − 1)(4x² + 2x + 1) ✓ | No hay | Nada |
| 06 (14) | Lado del piso de 4x² + 20x + 25 con x = 3 | Sí | Sí. 2x + 5 = 11 ✓. Comprobé 121, 17, 8 y 31 ✓ | Sobra: un cuadrado vacío | El dibujo dice «largo: ?» pero preguntan el lado de un cuadrado. «La loseta mide x = 3 dm» se entiende, pero la loseta es de x² |
| 07 (3) | Factorizar x² + 2x − 15 | Sí | Sí. (x + 5)(x − 3) ✓ | No hay; un aspa dibujada ayudaría | Nada |
| 08 (8) | Factorizar 6x² + 7x + 2 | Sí | Me trabé en «(6x · 2 + x = 13x; 6x + 2x = 8x)»: la segunda cuenta está escrita distinta de la primera y no dice qué número va en cada fila. Después «3x · 1 + 2x · 2 = 7x» ✓ | No hay; aquí sí haría falta el aspa | Notación del cruce irregular |
| 09 (14) | Qué binomio es factor de 3x² + 7xy + 2y² | Casi: el «Datos» dice «el último en dos números», pero aquí 2y² se parte en y·2y | Sí. (3x + y)(x + 2y) ✓. Comprobé las trampas (3x² ± 5xy…, 3x² − 7xy…) ✓ | No hay | El «Datos» no encaja con dos letras |
| 10 (3) | Qué término en x² pone la columna del medio en x⁴ + 4x³ + 6x² + 5x + 2 | Sí | Sí. 6x² − 3x² = 3x² ✓. Comprobé (x² + x + 1)(x² + 3x + 2) ✓ | Ayuda: la tabla con las «?» muestra dónde va lo que falta | El «Datos» casi da la receta completa |
| 11 (8) | Factorizar x⁴ − x³ + 5x − 3 | Sí, pero cuesta | Me pierdo en la primera línea: «Extremos: x²·3 y (−1)·x²». No dice cómo se partió −3 ni qué fila lleva −1 y cuál 3; lo saqué de la respuesta. El resto cuadra: (x² + x − 1)(x² − 2x + 3) ✓ | No hay; justo aquí la tabla haría falta | Es el más difícil de toda la serie y no tiene dibujo |
| 12 (14) | Valor del factor que lleva 3y, con x = 2 e y = 1 | Sí | Sí. (x + y + 1)(x + 3y + 1) → 6 ✓. Comprobé 4, 24, 8 y 5 ✓ | No hay | En el «Datos», «Valor numérico» sale con fondo lila, como si estuviera seleccionado; en las otras tarjetas no |
| 13 (3) | Qué números conviene probar en x³ − 2x² − 5x + 6 | Sí | Sí. ±1, ±2, ±3 y ±6 | No hay | El «Datos» regala la respuesta: es la misma frase que se pregunta |
| 14 (8) | Factorizar por completo 2x³ − 3x² − 3x + 2 | Falta la regla del aspa en el «Datos», y el Resuelto la usa | Me pierdo en la primera línea: «P(2) = …» no dice por qué se prueba 2 (P(1) = −2 no sirve; −1 también anula). Tampoco se ve la tabla de «deja 2, 1, −1»; la hice yo y está bien. (x − 2)(2x − 1)(x + 1) ✓ | No hay; la tabla de Ruffini ayudaría | La respuesta final no lleva colores, a diferencia de las otras |
| 15 (14) | Qué binomio es factor de 3x³ − 4x² − 5x + 2 | Falta algo: el «Datos» habla de x − a, pero no dice que 3x − 1 es factor si P(1/3) = 0 | Sí. P(1/3) = 0 ✓, (3x − 1)(x² − x − 2) ✓. Comprobé −4, 28/9, −28 y 32 ✓ | No hay | Nada; buenas trampas |
| 16 (3) | MCD de (x + 1)(x − 4) y (x − 2)(x + 3) | Sí | Sí. Es 1 | No hay | El enunciado corta «(x − 2)» y «(x + 3)» en dos renglones. El subrayado del «1» en la respuesta se ve cortado. Habla del MCM sin que lo pregunten |
| 17 (8) | MCD de x³ − 1 y x² − 1 | Sí | Sí. x − 1 ✓ | No hay | «Solo x − 1 es común» aparece antes de la factorización del segundo |
| 18 (14) | Grado de MCD·MCM para x³ − x y x² + x | Sí | Sí. 2 + 3 = 5 ✓. Comprobé las trampas ✓ | No hay | Nada |

**Las 3 que mejor se entienden:** 03 (agrupar y valor numérico, con cada trampa explicada), 12 (aspa doble con las tres aspas escritas una por una) y 04 (piezas que se cuentan).

**Las 3 que peor se entienden:**
- 11: la primera línea no dice cómo se parten los extremos y no hay tabla.
- 14: aparece P(2) de la nada, no se ve la tabla de Ruffini y el aspa no está en el «Datos».
- 08: la notación del cruce cambia y no hay aspa dibujada.

**¿Suben los niveles?** En parte:
- Suben bien en factor común (01 → 02 → 03), aspa simple (07 → 08 → 09), teorema del factor (13 → 14 → 15) y MCD (16 → 17 → 18).
- En identidades, el 14 (06) solo agrega un valor numérico al nivel 3 (04), y el 8 (diferencia de cubos) me pareció igual de difícil o más.
- En aspa doble, el 8 (11) es claramente más difícil que el 14 (12).
- Los nivel 3 de teorema del factor (13) y MCD (16) son casi de memoria.

**El recuadro «Datos».** Casi siempre ayuda: da la fórmula sin dar el número. Distrae en 09, donde no encaja con dos letras. Regala la respuesta en 13. Le falta algo en 14 (el aspa) y en 15 (el binomio con coeficiente). En el Predice de aspa doble casi regala el cruce.

### Lo que me trabó
- Aspa doble, pantalla 2 (Juega): el aspa x–número no tiene flechas en la tabla, solo texto; la ✗ se monta sobre la «y» de 5xy y 19y.
- Aspa doble, pantalla 3 (Predice): el «Datos» (x²·2 = 2x², 1·x² = x²) casi regala el cruce.
- Aspa doble, pantalla 5 (La regla): no dice cómo elegir la partición de 6x² (2x·3x o 6x·x) ni muestra la revisión del x³ y del x.
- Aspa doble y teorema del factor, pantalla 7 (Ahora tú): las opciones salen en color y con subrayado punteado, como palabras del glosario.
- Teorema del factor, pantalla 1 (Lee): la tabla de Ruffini da por sabido «División de polinomios».
- Teorema del factor, pantalla 4 (Mira): Nox dice «primero los candidatos», pero el paso 1 prueba a = 1 sin listarlos.
- Teorema del factor, pantalla 5 (La regla): «si el principal no es 1, también fracciones» no dice cuáles.
- Teorema del factor, pantalla 6 (Así se resuelve): el dibujo ya muestra a = −1 con resto 0 antes de los pasos.
- Teorema del factor, pantalla 7 (Ahora tú): es casi igual a Predice y Nox pide probar divisores cuando ya dan P(−1) = 0.
- MCD y MCM, pantalla 1 (Lee): «pasadizos» suena raro para pedidos en dm².
- MCD y MCM, pantalla 2 (Juega): «grados: MCD 2 + MCM 6 = P·Q 8» se lee mal.
- MCD y MCM, pantalla 7 (Ahora tú): Nox dice «Factoriza primero», pero ya vienen factorizados.
- Tarjeta 04: el cuadradito 16 sale suelto y más pequeño.
- Tarjeta 06: el dibujo dice «largo» en un cuadrado y sobra.
- Tarjeta 08: la notación de los cruces cambia entre una cuenta y otra; falta el aspa dibujada.
- Tarjeta 09: el «Datos» dice «el último en dos números», pero aquí es y·2y.
- Tarjeta 11: «Extremos: x²·3 y (−1)·x²» no dice cómo se parten los extremos ni en qué fila va cada número; no hay tabla.
- Tarjeta 11 frente a 12: el nivel 8 es más difícil que el nivel 14.
- Tarjeta 12: «Valor numérico» sale resaltado en lila en el «Datos».
- Tarjeta 13: el «Datos» regala la respuesta.
- Tarjeta 14: no dice por qué se prueba 2, no se ve la tabla y falta el aspa en el «Datos».
- Tarjeta 15: el «Datos» no explica que 3x − 1 es factor si P(1/3) = 0.
- Tarjeta 16: el enunciado se corta en dos renglones y el subrayado del «1» se ve cortado.

## Correcciones de la ronda 1

Hechas junto con la auditoría (`rutinas/auditoria/algebra.factorizacion.md`, «Correcciones (19 nov)»), que dice la
prueba de cada una. Capturas después: `/tmp/claude-0/-home-user/31d0ae9f-8026-5866-a5dc-2c8554ea89bf/scratchpad/e7-cierre-fz/despues/`.

| Lector | Lo que señaló | Qué se hizo |
|---|---|---|
| A | «con a y b los dos términos» es falso y lleva a la B (identidades, Así se resuelve y Ahora tú) | A2: «con a y b lo que va al cuadrado (no los términos)», en teoría, ejemplos y práctica; LETRAS igual. |
| A | Juego 2: «pedido: x² + 4x + 9» cuando el pedido era x² + 9 | M4: «tienes x² + 4x + 9». |
| A | Juego 1: con ancho x ya dice «Sobran: nada» y parece cumplida | B7: la lectura dice «entra todo; ¿entra con uno más ancho?». |
| A | Predice 1: los datos casi dictan 3x² | Se deja: son equivalencias y la trampa (el 1) no se dice. |
| A | Predice 2: la diferencia de cuadrados no se vio antes | Lee 2 recuerda (a + b)(a − b) = a² − b² (de Productos notables). |
| A | Predice 3: salta de x² a 2x² sin dibujo | Se deja: es lo que se predice; la regla lo dibuja después. |
| A | Negativos solo desde «Así se resuelve»; Nox «los signos salen del último término» | Mira 3 tiene un caso con signos (paso 5); Nox: «El signo del último término dice si los números tienen igual signo; el del medio, cuál manda». |
| A | Regla 2: cubos y ∓ sin explicar; «Vale si» que no son condiciones o se leen al revés | M13: la tabla en cuatro filas, sin ∓; «Vale si» nuevos en las ideas 1, 2 y 3. |
| A | Mira 1, columna «queda»; fila «coeficientes» sobre x e y; aspa con el 6x en la fila del 1 | B5: «cómo»; «términos»; cada producto en cruz en la fila del número que multiplica. |
| A | No se dice cuánto mide una tira | B8: «una tira (x por 1 dm), x dm²». |
| A | «Agrupación» sin ejemplo | Está en Mira 1, pasos 5 y 6 (el lector veía solo el paso 1). |
| B | Alternativas en color y con subrayado punteado, como glosario | M7: en tinta. |
| B | Predice 4: los datos regalan el cruce; tarjeta 13: el dato es la respuesta; dibujo de «Así se resuelve» 5 con a = −1 ya probado | M8 y M9. |
| B | Ahora tú 5 casi igual a Predice; Nox pide probar divisores con P(−1) dado; Nox de MCD «Factoriza primero» | Ahora tú se deja (otro polinomio); M14: voces nuevas. |
| B | Tarjeta 11 (nivel 2) más difícil que la 12 (nivel 3); sin tabla | M11: tabla de la doble especial y partición fila por fila. |
| B | Regla 4 sin cómo partir 6x²; regla 5 «también fracciones» sin decir cuáles | M13: condiciones nuevas. |
| B | Tarjeta 09 «el último en dos números» con y · 2y; tarjeta 14 sin aspa ni por qué 2; tarjeta 15 sin dato de 3x − 1 | M10. |
| B | Mira 5: Nox «primero los candidatos» y el paso 1 no los lista | M14: «Se prueba un candidato en la tabla y se mira la última casilla». |
| B | Juego 6 y mesa 3: «grados: MCD 2 + MCM 6 = P · Q 8» | B7: «grado de MCD · MCM: 2 + 6 = 8, el de P · Q». |
| B | Tarjeta 06: «largo» en un piso cuadrado; tarjeta 08: notación del cruce | B5: «lado: ?» (`alg-reparto`, aditivo); el cruce escrito igual las dos veces. |
| B | ✗ sobre la «y» y aspa x–número sin flecha (juego 4); cuadradito 16 suelto (tarjeta 04); «Valor numérico» resaltado (tarjeta 12); enunciado cortado (tarjeta 16); «pasadizos» en la idea 6 | Para Gerson: piezas compartidas y app (auditoría, «Pendiente»). |
