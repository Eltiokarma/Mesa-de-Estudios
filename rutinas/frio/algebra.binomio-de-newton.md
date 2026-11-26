# Lector en frío: algebra.binomio-de-newton

26 nov 2026, ronda 1. Dos lectores nuevos, solo con capturas a 390 px (`--entera --lector`), sin el código: el A, los
momentos de las ideas 1 a 3 y las tarjetas 01 a 09; el B, los de las ideas 4 a 6 y las tarjetas 10 a 18. Encargo
especial: leer cada exponente como en el celular. Capturas:
`/tmp/claude-0/-home-user-Mesa-de-Estudios/c6e6072f-61c1-5ae4-9fde-081abfdefa41/scratchpad/cierre-algebra/lector/`. Sus
informes van tal cual (con un nivel más en los títulos); al final, «Correcciones de la ronda 1». La auditoría del
contrato está en `rutinas/auditoria/algebra.binomio-de-newton.md`.

## Lector A: ideas 1 a 3 y tarjetas 01 a 09

Miré solo las capturas PNG de celular (tema claro). De Lee solo veo la tarjeta 1/4, de Mira el paso 1 y de «Así se resuelve» el paso 1: lo digo una vez y no lo cuento como falla.

Encargo especial: leer cada exponente como en el celular y ver si alguno se puede leer mal.

### Parte 1: momentos

#### Idea 1: Elegir en cada paréntesis (pascal-elecciones)

- **Lee.** Veo dos filas de tres losetas: «a b b» y «b a b». Las naranjas dicen a y las turquesas dicen b. Rubén hace cenefas con losetas naranjas o turquesas. Sin el texto no sabría que son «cenefas» (parecen fichas con letras), pero el texto lo dice y alcanza. Exponentes: no hay.
- **Juega.** Veo tres cenefas de 3 losetas con una turquesa cada una, y «3 cenefas: 3a²b». Hay deslizadores n (losetas) y k (turquesas). La misión es que salgan 6 cenefas. Letras: a es una loseta naranja, b una turquesa, n el número de losetas, k el número de turquesas. Aprendí que las cenefas con el mismo número de turquesas dan el mismo término, y que el coeficiente cuenta cuántas cenefas hay. Exponentes: «3a²b» en letra chica morada y verde, se lee bien; en la línea grande «3 a² b» el 2 queda claro.
- **Predice.** Piden el coeficiente de a³b² en (a + b)⁵. Los Datos ayudan bien (dicen que a sale 3 veces y b 2). Respuesta mía: C(5, 2) = 10, la C. Exponentes: «a³b²» con superíndices claros, no se pegan.
- **Mira (paso 1).** Cinco paréntesis (a + b), con a subrayada en los tres primeros y b en los dos últimos; abajo las losetas a a a b b y «a·a·a·b·b = a³b²». Aprendí que una elección de a o b en cada paréntesis da un producto. Exponentes: «a³b²» se lee bien.
- **La regla.** El triángulo de Pascal hasta la fila 5 (1 5 10 10 5 1) con dos flechas que muestran que 4 + 6 = 10. La fórmula C(n, k)·aⁿ⁻ᵏbᵏ. Se entiende. Exponentes: en el texto «aⁿ⁻ᵏbᵏ» es muy chiquito y casi pegado; en el recuadro grande se ve bien. No lo leería mal, pero en el texto cuesta.
- **Así se resuelve (paso 1).** Coeficiente de x³y⁶ en (x + y)⁹. Datos completos con C(n, k) = n!/(k!(n − k)!). Exponentes: «x³y⁶» y «(x + y)⁹» claros.
- **Ahora tú.** Coeficiente de a⁶b³ en (a + b)⁹. C(9, 3) = 84, la A. Exponentes claros.
- **No entendí / dudé:** nada serio. La palabra «cenefa» no la conocía, pero el texto la explica.
- **Mi ejercicio:** coeficiente de a²b⁴ en (a + b)⁶. Hay que elegir los 4 paréntesis de b entre 6: C(6, 4) = 15.

#### Idea 2: El término de lugar k + 1 (termino-general)

- **Lee.** Cuatro filas «lugar 1 aaa, lugar 2 aab, lugar 3 abb, lugar 4 bbb». Entiendo que cada lugar tiene una b más. Exponente: «bⁿ» en el texto, bien.
- **Juega.** (2x − 1)⁵: cinco paréntesis con 2x elegido en todos, «C(5, 0)·(2x)⁵ = 32x⁵». Hay un deslizador «lugar». La misión: marcar el término cuyo número es −40. Mi cuenta: C(5, 3)(2x)²(−1)³ = −40x², el lugar 4. Letras: 2x es a, −1 es b, k cuántas veces se eligió b. Aprendí que el lugar va uno adelante de k y que el signo depende de cuántas veces sale −1. Exponentes: la línea chica «(2x)⁵ = 32x⁵» se lee; el 5 del «32x⁵» grande, bien.
- **Predice.** Tabla lugar/término con x⁶ en el lugar 1 y «?» en el 4. Lugar 4 de (x − 2)⁶. Mi cuenta: C(6, 3)·x³·(−2)³ = −160x³, la D. Los Datos dan también C(6, 4) = 15, que sirve de trampa. Exponentes de las opciones (160x³, 240x², −40x³, −160x³) claros.
- **Mira (paso 1).** Seis paréntesis (x − 2), x en los tres primeros, −2 en los tres últimos; «lugar 4: k = 3». Se entiende.
- **La regla.** Tabla completa de (x − 2)⁶: x⁶, −12x⁵, 60x⁴, −160x³, 240x², −192x, 64. Comprobé todas las cuentas: están bien. Fórmula t_{k+1} = C(n, k)aⁿ⁻ᵏbᵏ. Exponentes: en la tabla son superíndices Unicode chicos pero claros. El subíndice «k+1» de t se ve bien en el recuadro grande.
- **Así se resuelve (paso 1).** Lugar 4 de (2x − 3)⁶. Datos con t_{k+1}, C(n, k), (2x)³ = 2³x³ = 8x³ y el signo de un negativo. Exponentes: «2³x³» se lee como «2 al cubo por x al cubo», no como 23x3; bien. En el Datos, «tₖ₊₁ = C(n, k)aⁿ⁻ᵏbᵏ» es letra muy chica: el subíndice «k+1» y el «n−k» casi no se distinguen en el celular.
- **Ahora tú.** Lugar 4 de (2x + 2)⁶: C(6, 3)(2x)³·2³ = 20·8·8 = 1 280x³, la D. El espacio fino de «1 280x³» no confunde.
- **No entendí / dudé:** la píldora de arriba corta el título como «El término de lugar k +» y «1» en otra línea; parece que el título termina en «k +».
- **Mi ejercicio:** lugar 3 de (x − 1)⁵: k = 2, C(5, 2)·x³·(−1)² = 10x³.

#### Idea 3: Un término por su exponente (termino-buscado)

- **Lee.** Losetas x², 1/x, x² y «x²·1/x·x² = x³». Entiendo que las potencias se juntan. Exponentes bien.
- **Juega.** (x² + 1/x)⁶: cinco losetas x² y una 1/x, «exponente de x: 2·5 − 1 = 9», «queda x⁹». Misión: el término sin x. Mi cuenta: 12 − 3k = 0, k = 4. Nox dice que cada turquesa baja el exponente en 3. Aprendí a calcular el exponente según cuántas turquesas hay.
- **Predice.** (x² + 1/x)⁵, ¿algún término sin x? 10 − 3k = 0 no da k entero: la C, «No, ninguno». Exponentes: «xᵐ·xⁿ = xᵐ⁺ⁿ» chiquito pero legible.
- **Mira (paso 1).** Tabla de 0 a 5 turquesas con x¹⁰, x⁷, x⁴, x¹, x⁻², x⁻⁵. La fórmula «(x²)⁵⁻ᵏ·(x⁻¹)ᵏ = x¹⁰ ⁻ ³ᵏ». Exponentes: **«(x²)⁵⁻ᵏ» está apretado**: el 2 de adentro y el «5−k» de afuera quedan casi a la misma altura y separados solo por el paréntesis; se puede leer como un solo exponente. El «x¹⁰» de la primera fila podría confundirse con «x¹ 0», pero aquí se ve bien. Las losetas 1/x tienen una mancha blanca detrás de la letra (raro, parece un error de dibujo) y el «1/x» es muy chico.
- **La regla.** Tabla de 0 a 6 turquesas: x¹², x⁹, x⁶, x³, «x⁰: sin x», x⁻³, x⁻⁶. **El «x⁰» se ve como «x°» (grado)**: el cero superíndice es un circulito igual al signo de grados. Fórmula «e₁(n − k) + e₂k = pedido»: el «e₂k» se lee bien porque el 2 está abajo y la k en la línea, pero queda pegado; alguien puede leer «e sub 2k». Lo demás se entiende.
- **Así se resuelve (paso 1).** Término independiente de (2x + 1/x²)⁶. Datos bien. Exponentes: «(xᵐ)ⁿ = xᵐⁿ» es letra muy chica; «xᵐⁿ» se ve como dos letras sueltas arriba. Lo entiendo porque sé la regla, pero en el celular cuesta.
- **Ahora tú.** (x + 2/x)⁶: 6 − 2k = 0, k = 3, C(6, 3)·2³ = 160, la B. Bien.
- **No entendí / dudé:** el x⁰ que parece grado, la fórmula (x²)⁵⁻ᵏ apretada y la mancha en las losetas 1/x.
- **Mi ejercicio:** término independiente de (x³ + 1/x)⁴: 3(4 − k) − k = 12 − 4k = 0, k = 3, C(4, 3) = 4.

### Parte 2: tarjetas de ejemplos

Ninguna de las 9 tarjetas trae dibujo: solo enunciado, Datos, Resuelto y Respuesta. No puedo opinar sobre el dibujo.

| Tarjeta | Qué piden | ¿Tengo todo? | ¿Sigo el Resuelto? | Cuentas | Algo raro |
|---|---|---|---|---|---|
| 01 (3, Un coeficiente con C) | coef. de a⁴b² en (a + b)⁶ | Sí | Sí | 720/(2·24) = 15 ✔ | nada |
| 02 (8, El mismo coeficiente) | otro término con el coef. de a⁷b² en (a + b)⁹ | Sí | Sí | C(9, 2) = C(9, 7) = 36 ✔ | nada; exponentes a⁷b² y a²b⁷ claros |
| 03 (14, Una suma de Pascal) | m en C(9, 4) + C(9, 5) = C(10, m) | Sí | Sí | C(10, 5) = 252 ✔ | nada |
| 04 (3, Con signo menos) | lugar 2 de (x − 3)⁴ | Sí | Sí | 4·x³·(−3) = −12x³ ✔ | nada |
| 05 (8, Con dos letras) | lugar 4 de (x + 2y)⁵ | Sí | Sí | 10·x²·8y³ = 80x²y³ ✔ | los Datos traen (2x)³ y el problema usa (2y)³: no confunde |
| 06 (14, Dos coeficientes seguidos) | n si los lugares 3 y 4 de (x + 1)ⁿ tienen igual coeficiente | Sí | Sí | C(5, 2) = C(5, 3) = 10 ✔ | «C(n,» / «3)» partido entre dos líneas |
| 07 (3, ¿Qué k anula?) | k con 8 − 2k = 0 | Sí | Sí | k = 4 ✔ | muy fácil, casi regala la respuesta |
| 08 (8, El coeficiente de x³) | coef. de x³ en (x² − 1/x)⁶ | Sí | Sí | 12 − 3k = 3, k = 3, C(6, 3)(−1)³ = −20 ✔ | nada |
| 09 (14, El número que falta) | m si el término independiente de (x² + m/x)⁶ es 240 | Sí | Sí, aunque «vale 0 con k = 4» salta el paso 12 − 3k = 0 | 15m⁴ = 240, m⁴ = 16, m = 2 ✔ | «C(6,» / «4)m⁴» partido entre dos líneas |

Exponentes en las tarjetas: ninguno se lee como número de dos cifras. a⁴b², a⁷b², 80x²y³, 2³x³, 15m⁴ y m⁴ = 16 tienen el superíndice bien arriba y separado. Lo único chico es el renglón de Datos «tₖ₊₁ = C(n, k)aⁿ⁻ᵏbᵏ» y «(xᵐ)ⁿ = xᵐⁿ», que usan letras volantes más chicas que el resto (el título de la tarjeta 08, «x³», también usa el otro tipo de letra que el cuerpo, «x³»: se nota la diferencia, pero no confunde).

- **Las 3 que mejor se entienden:** 04, 05 y 01.
- **Las 3 que peor:** 09 (salta el paso del exponente igual a 0 y parte C(6, 4)), 06 (parte C(n, 3) y el «solo por la simetría» pide pensar), 03 (hay que imaginar el triángulo sin verlo).
- **¿Suben los niveles?** Sí: en cada grupo el 3 es directo, el 8 pide un paso más (simetría, dos letras, signo) y el 14 va al revés (hallar n o m). La 07 es casi demasiado fácil.
- **Recuadro «Datos»:** ayuda; trae la fórmula justo cuando hace falta. No regala la respuesta, salvo la 07, que ya da en el enunciado el exponente 8 − 2k.

### Lo que me trabó

- Idea 3, La regla: «x⁰: sin x» se ve como «x°» (signo de grados).
- Idea 3, Mira: «(x²)⁵⁻ᵏ» está apretado; el 2 y el 5−k casi se juntan como un solo exponente.
- Idea 3, La regla: «e₂k» pegado, se puede leer «e sub 2k».
- Idea 3, Mira y La regla: las losetas «1/x» tienen una mancha blanca detrás y la letra es muy chica.
- Ideas 2 y 3, Datos de «Así se resuelve» y Ahora tú, y tarjetas 04 a 06, 08 y 09: «tₖ₊₁ = C(n, k)aⁿ⁻ᵏbᵏ» y «(xᵐ)ⁿ = xᵐⁿ» en letra volante muy chica, difícil en el celular.
- Idea 1, La regla: «aⁿ⁻ᵏbᵏ» en el texto, chico y casi pegado.
- Ideas 2 y 3 (píldora de arriba): el título se corta como «El término de lugar k +» / «1».
- Tarjetas 06 y 09: «C(n,» / «3)» y «C(6,» / «4)m⁴» partidos entre dos líneas.
- Tarjeta 09, Resuelto: «vale 0 con k = 4» sin mostrar 12 − 3k = 0.
- Tarjeta 07: casi regala la respuesta (el enunciado ya da 8 − 2k).
- Tarjetas 01 a 09: ninguna tiene dibujo.

## Lector B: ideas 4 a 6 y tarjetas 10 a 18

Miré solo los PNG. De Lee y de «Así se resuelve» veo solo la primera tarjeta o el primer paso, y de Mira solo el paso 1/5. Lo digo una vez y no lo cuento como falla.

Foco pedido: **exponentes en el celular.** No encontré dos exponentes pegados que parezcan un número de dos cifras. Los exponentes de dos cifras (`(x² + 3y)¹⁵`) se leen bien porque los separa el paréntesis. Los exponentes fraccionarios van con palabras («elevado a 1/2», «elevado a 2/3», «elevado a 6/2») y así se evita el lío de `(1+x)^{1/2}` con el superíndice chiquito. Hay tres cosas menores, que van abajo.

### Parte 1: momentos

#### Idea 4: Cuántos términos y cuánto suman (suma-coeficientes)
- **Lee:** veo cenefas de 3 losetas: naranja = a, turquesa = b, agrupadas por número de turquesas, con ×1, ×3, ×3, ×1. Se entiende que cada grupo es un término y que el número es su coeficiente. Sin el texto no sabría que eso es una «cenefa», pero el dibujo es claro como fichas.
- **Juega:** hay un deslizador n (losetas), y la misión pide 16 cenefas, así que pongo n = 4. «4 grupos, k de 0 a 3; en total 2³ = 8 cenefas». La leyenda «× 4 cuántas cenefas tiene el grupo» me hizo dudar un poco: ¿por qué 4, si ningún grupo de la pantalla tiene ×4? Aprendí que cada loseta más duplica las cenefas: el total es 2ⁿ.
- **Predice:** la tabla término/coeficiente tiene las filas x⁵, x⁴, x³, x², x y **«sin x»**. **Falla:** «sin x» se lee como *seno de x* (sin x en trigonometría y en la calculadora). Quiere decir «el término sin x» (el independiente). Me hizo dudar en seco. Mejor poner «número solo» o «término independiente». La pregunta es cuánto suman los coeficientes de (2x − 1)⁵, y voy por la C, 1. Los Datos no regalan la respuesta.
- **Mira:** con x = 1, la tabla 32x⁵, −80x⁴, 80x³, −40x², 10x, −1. El paso 1: «6 términos: 5 + 1 = 6». Aprendí que con x = 1 la suma sale sin desarrollar.
- **La regla:** las cenefas de 4 dan 1 + 4 + 6 + 4 + 1 = 16 = 2⁴. «S = P(1)»: aquí **P no está dicho** (se supone «el polinomio»), y lo entendí recién en «Así se resuelve», donde los Datos dicen «Suma de coeficientes de P». También mete en la misma regla el término central (lugar n/2 + 1, y (n+1)/2 y (n+3)/2 con n impar). Son dos reglas distintas juntas en una caja, y se siente cargado.
- **Así se resuelve:** (2x² − 5y)⁵, paso 1. Los Datos ayudan y no regalan nada.
- **Ahora tú:** ¿cuántos términos tiene (x² + 3y)¹⁵? 16 (C). El exponente 15 se lee bien.
- **Ejercicio inventado:** suma de coeficientes de (3x − 2)⁴: con x = 1, (3 − 2)⁴ = 1. Tiene 5 términos.

#### Idea 5: Exponente que no es natural
- **Lee:** dos calculadoras. «La raíz» da √1,02 = 1,0099505 y «sin raíz» da 1 + 0,02 ÷ 2 = 1,01. Las reconozco como calculadoras. Se entiende que la cuenta sin raíz se acerca.
- **Juega:** hay botones de α (2, 3, −1, −2) y una tabla k / nuevo factor / coeficiente de xᵏ. La misión pide 4 términos, así que pongo α = 3. Con α = 2 la tabla da 1, 2, 1, 0, 0, 0: bien. **Duda:** el pie dice «α = 2: el factor 2 − 2 = 0 deja 3 términos», pero la fórmula del nuevo factor que está al lado es (α − k + 1)/k, que en k = 3 da 2 − 3 + 1. No vi de dónde sale «2 − 2». Aprendí que con α natural algún factor llega a 0 y corta.
- **Predice:** ¿cuántos términos tiene (1 + x) elevado a 1/2? La opción «No termina» es la que esperas si jugaste. Está bien planteado.
- **Mira:** α = 1/2, k = 1, el coeficiente es 1/2, «y sigue sin parar…». Se entiende.
- **La regla:** comprobé la tabla con α = 1/2: los factores 1/2, −1/4, −1/2, −5/8, −7/10 y los coeficientes 1, 1/2, −1/8, 1/16, −5/128, 7/256 están todos bien. La fórmula α(α−1)…(α−k+1)/k! se entiende. «Vale si x está entre −1 y 1» está claro. La frase «el factor α − α = 0» repite la duda de Juega.
- **Así se resuelve:** coeficiente de x² en (1 + 2x)⁻¹. Aquí el exponente va con superíndice (−1) y en lo demás va con palabras. Se lee bien, pero no es igual en todas partes.
- **Ahora tú:** x² en (1 + x) elevado a 2/3: (2/3)(−1/3)/2 = −1/9, la A.
- **Ejercicio inventado:** x² en (1 + x)⁻²: (−2)(−3)/2 = 3.

#### Idea 6: La potencia de un trinomio
- **Lee:** dos cenefas de 4 losetas con tres colores (naranja a, turquesa b, verde c). Se reconocen.
- **Juega:** hay deslizadores q (turquesas) y r (verdes). «3 naranjas, 1 turquesa, 0 verdes: 4 cenefas, 4a³b». La misión pide 12 cenefas, así que pongo q = 1 y r = 1 (a²bc). Aprendí que el número de cenefas de un grupo es el coeficiente.
- **Predice:** coeficiente de a²b²c² en (a + b + c)⁶. Los Datos (6! y 2!) bastan: 720/8 = 90, la B. Los exponentes a²b²c² se leen bien separados.
- **Mira:** «a²b²c²» de colores, cada letra con su 2. Se lee bien.
- **La regla:** n!/(p!·q!·r!) aᵖ bᑫ cʳ. **Detalle de exponentes:** la q de b no se ve igual que la p y la r. La p y la r salen como superíndices chiquitos tipo versalita, y la q sale casi a la altura normal, de modo que «bq» se puede leer como b por q. Además, «El desarrollo tiene C(n + 2, 2) términos» usa C(·,·) sin decir qué es en esta pantalla.
- **Así se resuelve:** x³y en (x + y + 2)⁵. Lo hice yo: 5!/(3!·1!·1!)·2 = 40.
- **Ahora tú:** a²bc⁴ en (a + b + c)⁷: 7!/(2!·1!·4!) = 105, la B.
- **Ejercicio inventado:** abc en (a + b + c)³: 3!/(1!1!1!) = 6.

### Parte 2: tarjetas

- **10 (Dos centrales, (a+b)⁷):** te piden los lugares. Tengo todo. El resuelto es claro: 8 términos, lugares 4 y 5. Los Datos casi regalan la respuesta, porque dan la fórmula (n+1)/2 y (n+3)/2 lista. No hay dibujo. Las cuentas están bien.
- **11 (Con dos letras, (2x+y)⁵):** 3⁵ = 243, bien. Muy clara.
- **12 (Centrales de un impar, (x+2)⁵):** tengo todo. Los lugares 3 y 4 dan k = 2 y 3, y C(5,2)·2² = 40 y C(5,3)·2³ = 80 suman 120. Está bien. La fila «t_{k+1} = C(n,k)aⁿ⁻ᵏbᵏ» trae subíndices y superíndices muy chiquitos: «n−k» se lee con esfuerzo en el celular, pero se lee. La primera línea donde me frené: «Los centrales están en los lugares 3 y 4, con k = 2 y k = 3». No dice que k = lugar − 1, aunque sale de t_{k+1}. La explicación de las opciones malas ayuda.
- **13 (α = −1):** (−1)(−2)/2 = 1, bien. Clara.
- **14 (Con 2x adentro, elevado a 1/2):** −1/8 · 4 = −1/2, bien. Lo sigo. Es la más larga, pero no me pierdo.
- **15 (Una fracción que es natural, elevado a 6/2):** 6/2 = 3, así que tiene 4 términos. Es buena trampa. Los distractores están bien explicados.
- **16 (a²b en (a+b+c)³):** 3!/(2!1!0!) = 3, bien. El título usa el carácter «²» y el cuerpo un superíndice. Se ven un poco distintos, pero no confunden.
- **17 (x²y en (x+y+2)⁴):** 12 · 2 = 24, bien. La frase «pide x dos veces, y una vez y el 2 una vez» se traba: hay que leerla dos veces para separar «y» (la letra) de «y» (la conjunción).
- **18 (Suma con signos, (2x−y+z)⁵):** 2⁵ = 32, bien. Los distractores también están bien (3⁵ = 243, 4⁵ = 1024, 0).

Ninguna tarjeta trae dibujo, así que no hay dibujo que sobre ni que regale la respuesta. No vi nada cortado ni encimado.

**Las que mejor se entienden:** 11, 13 y 16. **Las que peor:** 12 (Datos densos y exponentes chiquitos), 17 (la «y» doble) y 10 (los Datos regalan la fórmula exacta).
**Niveles:** sí suben dentro de cada idea. El nivel 3 es directo, el 8 agrega un número adentro (2x, el 2) y el 14 trae alternativas y trampa.
**Recuadro «Datos»:** ayuda casi siempre. Solo en la 10 regala la respuesta.

### Lo que me trabó
- Idea 4 (suma-coeficientes), Predice: la fila «sin x» de la tabla se lee como seno de x.
- Idea 4, La regla: «S = P(1)» sin decir qué es P en esa pantalla. Además, la suma y el término central van juntos en una sola caja.
- Idea 4, Juega: la leyenda «× 4 cuántas cenefas tiene el grupo» usa un 4 que no aparece en la pantalla con n = 3.
- Idea 5 (exponente-no-natural), Juega y La regla: «el factor 2 − 2 = 0» y «α − α = 0» no cuadran a simple vista con la fórmula (α − k + 1)/k que está al lado.
- Idea 5: el exponente va con palabras («elevado a 1/2») en casi todo, pero con superíndice en «(1 + 2x)⁻¹». No es igual en todas partes, aunque se lee bien.
- Idea 6 (potencia-trinomio), La regla: en «aᵖ bᑫ cʳ» la q no sale como superíndice igual que p y r, y «bq» parece un producto.
- Idea 6, La regla: «C(n + 2, 2) términos» sin explicar C en esa pantalla.
- Tarjeta 12 (lector/12.png): en «t_{k+1} = C(n,k)aⁿ⁻ᵏbᵏ» los índices son muy chicos para el celular, y no se dice que k = lugar − 1.
- Tarjeta 17 (lector/17.png): «pide x dos veces, y una vez y el 2 una vez»: la letra y se confunde con la conjunción.
- Tarjeta 10 (lector/10.png): los Datos dan la fórmula exacta de los lugares centrales y regalan la respuesta.
- Ningún par de exponentes pegados se lee como número de dos cifras.

## Correcciones de la ronda 1

Ninguno de los dos leyó un exponente como un número de dos cifras en lo que vio, pero la auditoría encontró uno que no
les tocó (A1: «x³³» por (x³)³ en «Ahora tú» de las ideas 3 y 4), ya corregido. Lo que señalaron:

| Lo que trabó | Cómo quedó |
|---|---|
| «x⁰: sin x» parece «x°» (regla 3); «sin x» se lee seno (Predice 4) | «exponente 0» en la regla 3; «número solo» en la tabla de Predice y su revelado; la lectura del juego 3 dice «un número solo, sin ninguna x» y la del laboratorio «sin ninguna x». |
| «(x²)⁵⁻ᵏ» apretado (Mira 3); «tₖ₊₁ = C(n, k)aⁿ⁻ᵏbᵏ», «(xᵐ)ⁿ = xᵐⁿ» diminutos en Datos; «aⁿ⁻ᵏbᵏ» en el texto de la regla 1; «aᵖ bᑫ cʳ» con glifos distintos (regla 6); índices de tₖ₊₁ (tarjeta 12) | Los exponentes e índices con letra son nodos de la ecuación (`{ sup }`, `{ sub }`), con letra del tamaño de un exponente de cifras: `nucleo/ecuacion.js` no convertía ᵏ, ᵐ, ᵖ, ʳ ni ₖ₊₁. La regla 1 dice el coeficiente en palabras. |
| «e₂k» se lee «e sub 2k» (regla 3) | «e₁ · (n − k) + e₂ · k», con la nota «exponente de x en el lugar k + 1». |
| Título «El término de lugar k + / 1» cortado en la píldora | «El término general». |
| «C(n, / 3)» y «C(6, / 4)m⁴» partidos (tarjetas 06 y 09) | Espacio duro dentro de todo C(…, …) de la unidad. |
| Losetas «1/x» con mancha blanca | El halo de `.kit-txt` (4 px) se quita dentro de las losetas (`alg-cenefa`). |
| Tarjeta 09: «vale 0 con k = 4» sin 12 − 3k = 0 | «2(6 − k) − k = 12 − 3k, que vale 0 con k = 4». |
| Tarjeta 07: el enunciado da 8 − 2k | El enunciado dice que x sale en 8 − k paréntesis y 1/x en k; Datos con 1/x = x⁻¹ y la suma de exponentes; el resuelto arma 8 − 2k. |
| Regla 4: «S = P(1)» sin P; suma y central en una caja | «La suma S de los coeficientes del desarrollo P es P(1): P con cada letra igual a 1.» La ecuación es solo S = P(1); los centrales van en el texto. |
| Juega 4: «× 4» que no se ve con n = 3 | «× 3». |
| Idea 5: «2 − 2 = 0», «α − α = 0» no salen de (α − k + 1)/k | Se muestra el reemplazo: «α = 2, k = 3: (2 − 3 + 1)/3 = 0 → 3 términos»; misión «en k = 4 el factor (3 − 4 + 1)/4 vale 0»; «Vale si»: «en k = α + 1 el factor (α − k + 1)/k vale 0». |
| Idea 5: «(1 + 2x)⁻¹» con superíndice y lo demás «elevado a» | **Se deja** (decidido por la sesión, Gerson revisa después): exponente entero con superíndice, fraccionario en palabras, como en los libros; el lector lo leyó bien. |
| Regla 6: «C(n + 2, 2)» sin decir qué es | «…tiene C(n + 2, 2) términos: las maneras de elegir 2 cosas entre n + 2.» |
| Tarjeta 12: no dice k = lugar − 1 | «El lugar k + 1 lleva k veces b, así que k es el lugar menos 1: k = 2 y k = 3.» |
| Tarjeta 17 (y la 13 de la idea 6): la letra y con la conjunción | «pide dos veces la letra x, una vez la letra y, y una vez el 2». |
| Tarjeta 10: los Datos dan (n + 1)/2 y (n + 3)/2 | Datos: cuántos términos tiene y que los centrales dejan los mismos a cada lado; el resuelto: 3 + 2 + 3 = 8. |
| Tarjetas sin dibujo (A) | Se deja a Gerson: el molde no lo pide en álgebra. |

Comprobado con capturas nuevas (`…/cierre-algebra/despues/`), el validador con `calidad: 2` simulada (60 y 200
semillas) y `node herramientas/ecuaciones-ancho.js algebra.binomio-de-newton` (nada se corta).

