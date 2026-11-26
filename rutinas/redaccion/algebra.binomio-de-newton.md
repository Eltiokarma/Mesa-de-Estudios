# Redacción · algebra.binomio-de-newton (26 nov 2026)

Pasada del redactor (`docs/metodo/unidad/redaccion-delegada.md`, criterio `escribidor-escribano`) sobre
`contenido/teoria/algebra/binomio-de-newton.js` y su práctica `plantillas/binomio-practica/` (generador y `papel.json`,
regenerado con `node herramientas/papel-generador.js binomio-practica`).

No se tocó ningún número de cuenta, respuesta, distractor, dato de ejercicio, color, nodo de ecuación ni dibujo. Las
preguntas de «Ahora tú» quedaron igual (la prueba propia las lee con expresiones regulares para rehacer la cuenta). Lo
que cambió es prosa: Lee, consignas, misiones, lecturas en vivo, voces, `siFuera`, `coincide` y `noCoincide`, pasos de
Mira, reglas y condiciones, pasos de «Así se resuelve», soluciones y explicaciones de «Ahora tú» y de la práctica, los
90 ejemplos, una línea del glosario, la historia y los mensajes del laboratorio.

## Qué cambió, por tipo de problema

1. **El número combinatorio, dicho en palabras.** «Análisis combinatorio» no está rehecha, así que C(n, k) se explica
   donde aparece. En la teoría, cada ejercicio que daba «Número combinatorio: C(n, k) = n!/(k!(n − k)!)» lleva ahora
   dos líneas de Datos: «Número combinatorio: C(n, k) cuenta las maneras de elegir k cosas entre n, sin importar el
   orden» y la fórmula sola (con la frase en la misma línea, la fracción se partía en el celular). Se omitió la línea
   nueva solo en el ejemplo 11 de la idea 3, que ya tenía seis Datos (el tope). En la práctica, donde los Datos son
   texto plano, va en una sola línea: «Número combinatorio, las maneras de elegir k cosas entre n sin importar el
   orden: C(n, k) = n!/(k!(n − k)!)». En el flujo de la idea 1, la primera aparición es el paso 3 de Mira: «Elegir 2 de 5, sin orden, es el
   número combinatorio C(5, 2).» pasa a «De cuántas maneras se eligen 2 paréntesis entre 5, sin importar el orden, lo
   dice el número combinatorio C(5, 2).». La regla dice «El coeficiente de aⁿ⁻ᵏbᵏ, C(n, k), cuenta las maneras de
   elegir los k paréntesis de b», y los ejemplos dicen qué cuenta antes de calcularlo («Esas maneras las cuenta el
   número combinatorio C(6, 2)»).
2. **«Vale si» roto en las seis condiciones.** Ninguna continuaba el marco: «Vale si k va de 0 a n; C(n, k) = …»,
   «Vale si El lugar 1 es aⁿ…», «Vale si e₁ y e₂: exponentes…», «Vale si Con n impar…», «Vale si La suma sirve…»,
   «Vale si p + q + r = n. El desarrollo…». Ahora cada una empieza por la condición y sigue la frase: «Vale si k es un
   número natural de 0 a n. Elegir los k paréntesis de b deja dichos los n − k de a, y por eso C(n, k) = C(n, n − k).»;
   «Vale si los términos se ordenan desde aⁿ, en el lugar 1, hasta bⁿ, en el último…»; «Vale si x está entre −1 y 1,
   para que la suma se acerque al valor exacto…»; «Vale si p + q + r = n, porque cada paréntesis da una sola letra…».
3. **`siFuera` y explicaciones en molde «Bien X. Pero Y».** Casi todas (unas 120 en la teoría y unas 90 en la práctica)
   eran dos fragmentos sin verbo: «Bien el número. Pero (−2)³ es −8: exponente impar.». En la teoría se reescribieron
   como una oración que dice lo que estuvo bien y por qué no alcanza, repartidas en varias formas para no dejar otro
   molde («X está bien, pero…», «Es cierto que…, pero…», «X es la idea, pero…»). En la práctica la prueba exige que
   la explicación empiece por «Bien», muestre su valor y no pase de 32 palabras; se conservó el «Bien» inicial y se
   unió todo en una sola oración con «pero».
   - Antes: «Bien elegir 2 de 5: 5 · 4. Pero así cada cenefa se cuenta dos veces.» Después: «Contar 5 · 4 serviría si
     las dos turquesas fueran distintas, pero son iguales: cambiarlas de lugar da la misma cenefa, así que cada una se
     contó dos veces.»
   - Antes: «Bien en el juego sí lo había. Pero con 5 losetas el exponente salta de x¹ a x⁻².» Después: «En el juego,
     con 6 losetas, sí lo había, pero con 5 el exponente salta de x¹ a x⁻² sin pasar por 0.»
   - Antes (práctica): «Bien llegar a m⁴ = 16. Pero falta sacar la raíz: m no es 16.» Después: «Bien planteado hasta
     m⁴ = 16, pero falta sacar la raíz de índice 4: m no es 16.»
   - Cuando b es positivo, el `siFuera` del signo decía «(2)³ tiene exponente impar», que no explica nada; ahora dice
     «aquí b es positivo, así que el término no lleva signo menos» (ideas 3 y 4, solo el texto).
4. **Pasos y soluciones telegráficos.** Los rótulos «Lugar 3: k = 2.», «Exponente: 6 − 2k = 0, así que k = 3.», «Sin x
   pide exponente 0.», «α = 4.», «p = q = r = 1.», «Con n = 2.», «Se suman.» pasan a oraciones con sujeto y verbo que
   dicen de dónde sale cada dato: «El lugar 3 tiene k = 2: a = 2x sale 3 veces y b = 1 sale 2 veces.», «El exponente de
   x es 6 − 2k, que vale 0 con k = 3.», «Que el término no tenga x quiere decir que su exponente es 0.», «En abc cada
   letra sale una vez: p = q = r = 1.», «Con n = 2, la fórmula da C(4, 2).». Las explicaciones de los distractores de
   nivel 3 que no se entendían también se completaron: «La E usa C(7, 2) = 21: deja libre la primera.» pasa a «La E
   reparte las 2 turquesas que faltan entre las 7 posiciones, sin sacar la primera: C(7, 2) = 21.».
5. **Lee y consignas.** Se completaron las tarjetas que encadenaban dos puntos: «Una cenefa es un producto: sus
   potencias de x se juntan.» pasa a «Una cenefa es el producto de sus losetas, así que sus potencias de x se juntan en
   una sola.»; «n! cuenta las maneras…» presenta el término («n!, el factorial de n, cuenta…»). La consigna de la idea
   1 («…Iguales colores, igual término.») y la de la idea 2 («Cada lugar es una manera de elegir en los paréntesis»,
   inexacta: cada lugar junta C(n, k) elecciones) se reescribieron.
6. **Sueltos.** Concordancias («faltan repartir» pasa a «falta repartir»; «b sale 1 veces» pasa a «1 vez»; «cada uno de
   los 1 paréntesis» en el resuelto de la idea 6), un dato sin verbo («Letras iguales que se multiplican: sus
   exponentes se suman» pasa a «Al multiplicar letras iguales, sus exponentes se suman»), la línea de lectura del
   juego 3 («1 naranjas»), y la historia («El desarrollo de la escuela y esa extensión piden condiciones distintas»
   pasa a «Por eso el desarrollo del colegio, con n natural, y la extensión de Newton valen en condiciones distintas»).

## Para el auditor

1. **Notación de la ecuación (no se tocó, es dibujo):** cuando a es xᵖ sin número, `cuentaEc` y `cuentaEc3` escriben
   la potencia pegada: «C(8, 5) · x³³ · (−2/x)⁵» por (x³)³ en «Ahora tú» 2 de la idea 3 (casoCoefX), y
   «C(8, 4) · x²⁴ · (−2)⁴» por (x²)⁴ en «Ahora tú» 2 de la idea 4 (casoCentral). Se lee como x elevado a 33 o a 24.
   Viene de `bloque()`, que no pone paréntesis si el coeficiente es 1.
2. **Práctica, papel p8** repite el ejemplo de nivel 3 «El número que falta» de la idea 3: (x² + m/x)⁶ con término
   independiente 240.
3. **Práctica, tipo `existe`:** la fracción de k no se simplifica («k = 18/4»); la teoría sí lo hace (`frTxt`).
4. **`papel.json`:** al juntar los Datos, después de una línea que termina en «k!» no se pone punto («…/k! n! = 1 ·
   2…»). Es de `herramientas/papel-generador.js`, no del texto.
5. **Teoría, casoNLugar:** el texto y la solución escriben «1 · 3» cuando q = 1 («3(n − 3) − 1 · 3»), porque usan `${q}`
   y no `uno(q)`.
6. **Condiciones de las ideas 1 y 4:** la primera oración completa «Vale si»; la segunda trae un dato que no es
   condición (la simetría; S = 2ⁿ si a = b = 1). Se dejó porque «Ahora tú» lo usa y la regla no tiene espacio. Si se
   quiere estricto, se muda a la voz de la regla o a una tarjeta.
7. **Ejemplo «Suma con signos» (idea 6), alternativa A = −32:** decía «pone un signo de más», que no se entendía; ahora
   dice «cambia el signo del resultado». Confirmar que ese es el error que se quiso modelar.
8. **Códigos de error:** en teoría y práctica, el distractor p^n («solo el primer coeficiente») lleva el código
   TAL-BN-CERO, que es el de poner x = 0. No se cambió.
9. **Dato del trinomio en la práctica:** para caber en 22 palabras quedó como rótulo: «En (a + b + c)ⁿ, el término con a
   p veces, b q veces y c r veces: n!/(p! q! r!)».

## Pruebas

- `contenido/teoria/algebra/binomio-de-newton.test.js` (incluye el validador con `calidad: 2` simulada, 60 semillas):
  7/7.
- `plantillas/binomio-practica/generador.test.js`: 36/36.
- `contenido/teoria/teoria.test.js`: 164/164.
- `node herramientas/ecuaciones-ancho.js algebra.binomio-de-newton`: todo cabe (58 pantallas, 677 renglones). Hubo que
  partir la línea del combinatorio y proteger «b = 1/x^q» del resuelto de la idea 3, que se partían después de «=».
