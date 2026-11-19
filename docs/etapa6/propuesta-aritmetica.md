# Propuesta de ideas: «Números primos y divisores» (`aritmetica.numeros-primos-y-divisores`)

Etapa 6 del plan de calidad, rama «Números y operaciones» (la de entrada de Aritmética), la cuarta unidad, después de
«Sistemas de numeración», «Las cuatro operaciones» y «Divisibilidad» · fases 1 a 5 con criterio delegado
(`docs/metodo/unidad/etapa-delegada.md`) · 19 nov 2026

Gerson delegó el criterio: esta propuesta ya se ejecutó (es el guion de la unidad) y tú la revisas después. Por eso la
última sección no pregunta: dice qué se decidió, por qué y qué se descartó. **No hay ningún conflicto crítico.**

Lo que leí: `CLAUDE.md`, `docs/plan-calidad.md` §3, `docs/molde-unidad.md`, `docs/teoria.md` (4 a 4j y §5),
`docs/metodo/unidad/` (LEEME, 1-ideas, 2-ejemplos, 3-practica, reglas-validador y el encargo delegado), las decisiones
de las etapas 2 a 5, la propuesta de Divisibilidad como modelo (`docs/etapa5/propuesta-aritmetica.md`), esa unidad
terminada (`divisibilidad.js`, calidad 2) con su prueba, su auditoría y su lector en frío (qué se corrigió: igualdades
falsas en algunas semillas, el circulito sin glosa en los Datos, k usada para dos cosas, un ejemplo del glosario que
daba la clave de la predicción, ciclos que no empiezan en la primera potencia), la teoría actual
(`numeros-primos-y-divisores.js`, v0.2.0), su ficha en `catalogo/cursos/aritmetica.json`, sus dos plantillas
(`divisores`, `numeros-sucesiones`), el informe `docs/investigacion/aritmetica-razonamiento-ideas-erroneas.md`, la
matriz `docs/teoria/matriz/aritmetica.json` (unidad 14), `docs/temario-completo.md` §14, la prueba
`catalogo/pruebas/aritmetica.json`, `docs/datos/admision-unmsm.csv` y las unidades vecinas (`divisibilidad.js`,
`mcd-y-mcm.js`, `potenciacion-y-radicacion.js` y el glosario de `logica-proposicional.js`), para no repetir ni adelantar.

## Qué se pregunta en los exámenes

El catálogo pone la unidad en las semanas 15 y 16 de la UNI y en el tema 6 de San Marcos. En
`docs/datos/admision-unmsm.csv` hay **14 preguntas de San Marcos** (2021 a 2027-I) de esta unidad. Las describo con el
resumen del CSV (los solucionarios no están descargados en esta sesión).

| Periodo (pregunta) | Qué piden | Dónde queda |
| --- | --- | --- |
| 2026-I (31, medicina) | Cinco primos acotados en progresión aritmética de razón dada; el mayor | idea 2 (probar si es primo) |
| 2022 (34) | Afirmaciones sobre los divisores de una expresión factorizada | idea 3 y 4 |
| 2025-I (34, área D) | Factorización con exponentes; la cantidad de divisores al operar (trampa: no descomponer las bases compuestas) | ideas 3 y 4 |
| 2025-II (31, D-E), 2027-I (31) | Cantidad de divisores de un número con una forma dada; el menor con k divisores propios (trampa: propios por totales) | idea 4 |
| 2025-II (34, A), 2026-I (34, A) | Divisores simples y compuestos (trampa: el 1 es simple y no es primo) | idea 4 |
| 2021 (32), 2025-II (31, medicina), 2026-I (33) | Suma de divisores, su promedio y la suma de los divisores que son múltiplos de un número | idea 4 |
| 2026-II (33) | Empacar un total en cajas iguales con un tope por caja: un divisor en un rango | idea 1 (Ahora tú) |
| 2023-I (33) | Quitar los múltiplos de varios primos de una lista: los que quedan son PESI (trampa: no corregir los comunes) | idea 5 |
| 2024-I (33), 2025-I (32) | Fracciones propias irreductibles de denominador fijo, también mayores que una cota | idea 5 |

El banco Cuzcano tiene unas 100 fichas del tema: cantidad de divisores (31), divisores que cumplen una condición (16),
numerales con cantidad de divisores dada (16), suma y producto de divisores (12) y primos y compuestos (7). Son de
academia: dicen qué se pregunta, no se copian.

**Lo que más pesa en San Marcos es la cantidad de divisores (7 de 14) y la función de Euler (3 de 14).** Fermat y Wilson
no salieron en San Marcos entre 2021 y 2027-I, pero están en el temario de la UNI y en la academia: quedan como la última
idea, corta.

---

## 0. Diagnóstico de la teoría actual contra el contrato

`numeros-primos-y-divisores.js` (v0.2.0, `estado: 'completa'`, sin `calidad: 2`) tiene 6 ideas (`rectangulos`, `criba`,
`factorizacion`, `divisores`, `euler`, `fermat-wilson`) y cuatro mesas con retos (una 3D). Lo que sirve: los rectángulos
de fichas, la criba en una tabla, la tabla de exponentes y la caja 3D de divisores.

1. **Punto 1: ninguna primera pantalla tiene un objeto.** Fichas sueltas y tablas; la vendedora de la feria solo está
   escrita en «Lee».
2. **Puntos 2, 3 y 12: no hay `mision`, `leyenda`, `aprendizaje`, `actividad` ni `pregunta`.** Las consignas describen
   botones («Elige cuántas fichas hay»).
3. **Punto 13: ningún ejercicio trae `datos`.** No hay ejemplos resueltos (0 de 90). El glosario tiene 11 términos sin
   `simple` y con un solo ejemplo, y dos de ellos («PESI» y «criba») traen justo la respuesta de una predicción.
4. **Punto 9: orden.** «PESI» se define con el máximo común divisor, que es de la unidad siguiente (MCD y MCM), y el
   resuelto de «Ahora tú» de la idea 3 dice «mcd = 1». «número perfecto» y la caja 3D hablan de verde.
5. **Notación.** «·» para multiplicar (la rama usa ×), n en naranja y los exponentes en carmín (el color de los ángulos),
   el resultado en verde junto al naranja.
6. **Regla 3.** La predicción de la idea 1 tiene dos opciones con el mismo código (AT-UNO); la «Lee» de la idea 1 dice
   «Cada rectángulo te da dos divisores» y la regla del 1 se adelanta en el glosario.
7. **«Así se resuelve» no existe en cuatro ideas, y «Ahora tú» no llega a examen**: no hay divisores con condición,
   simples y compuestos, fracciones irreductibles con cota ni primos en progresión.
8. **Letras.** n es el número y también la base de numeración de la rama; a y b son exponentes y, en la rama, cifras.
9. **Práctica:** la escena `divisores` (borrador 0.1.0, compartida con Divisibilidad, que ya la mandó a «Más mesas») y
   dos tipos de `numeros-sucesiones` (`divisores` y `primos-pa`). No hay práctica por idea, y la prueba del curso no tiene
   ningún ítem de esta unidad.
10. La cabecera dice «postulante de 3.º».

---

## 1. Las ideas, en orden

Son **seis**, con los mismos `id` de hoy (el avance de nadie se pierde; no hace falta migración ni `septimaIdea`). Los
`id` de los controles de las mesas no cambian; los rótulos y colores sí.

| # | `id` | Título (≤ 6 palabras) | `aprendizaje` |
| --- | --- | --- | --- |
| 1 | `rectangulos` | Primo: una sola fila | Un primo tiene exactamente dos divisores: sus caramelos solo se acomodan en una fila. El 1 tiene uno solo: no es primo ni compuesto. |
| 2 | `criba` | La criba tacha múltiplos | Para saber si N es primo basta probar con los primos p que cumplen p × p ≤ N; la criba tacha los múltiplos de esos primos. |
| 3 | `factorizacion` | Una sola factorización | Todo número mayor que 1 es un producto de primos de una sola manera; dos números son PESI si no comparten ningún primo. |
| 4 | `divisores` | Elegir exponentes cuenta divisores | Cada divisor de N = pᵅ × qᵝ elige un exponente para cada primo: hay (α + 1)(β + 1); la suma y el producto salen de la misma tabla. |
| 5 | `euler` | Función de Euler: los PESI | φ(N) cuenta los números del 1 al N que son PESI con N: cada primo de N deja la parte que no es su múltiplo. |
| 6 | `fermat-wilson` | Fermat y Wilson con un primo | Si p es primo y no divide a la base, la potencia p − 1 deja resto 1 (Fermat); 1 × 2 × … × (p − 1) deja p − 1 (Wilson). |

`pregunta` (Resumen): 1 «¿Por qué el 7 es primo y el 1 no?» · 2 «¿Hasta dónde hay que probar para saber si un número
es primo?» · 3 «¿Se puede factorizar un número de dos maneras distintas?» · 4 «¿Cuántos divisores tiene 720?» ·
5 «¿Cuántos números del 1 al N no comparten ningún primo con N?» · 6 «¿Qué resto deja una potencia enorme entre un
primo?».

`actividad`: 1 «Cambiar cuántos caramelos hay y ver de cuántas formas se acomodan en la bandeja.» · 2 «Tachar en la
plancha de la rifa los múltiplos de cada primo.» · 3 «Partir un número en dos partes, y cada parte otra vez, hasta
llegar a primos.» · 4 «Subir los exponentes y contar las casillas de la tabla de divisores.» · 5 «Tachar los boletos que
comparten un primo con el total y contar los que quedan.» · 6 «Multiplicar el pedido cada día y anotar los sueltos con
bolsitas de 5 o de 7.»

**Por qué va cada una ahí y qué da por sabido**

1. **Primo.** Es la raíz de las otras cinco. Da por sabidos «divisor», «múltiplo» y «división exacta» (Las cuatro
   operaciones) y «número primo» (que el curso define en Lógica: aquí se marca «se explica en…»). Lo nuevo es mirar
   **todos** los divisores a la vez: cada forma de acomodar N caramelos en filas iguales da una pareja de divisores.
   Estrena: número compuesto, pareja de divisores.
2. **Criba.** Usa la 1 (las parejas de divisores: una de las dos es como mucho √N) y la idea 1 de Divisibilidad (los
   múltiplos van de p en p). Estrena: criba de Eratóstenes, raíz cuadrada.
3. **Factorización y PESI.** Usa la 1 y la 2 (cortar hasta que cada parte sea prima). PESI se define por los primos de
   cada número, **sin el máximo común divisor**, que es de la unidad siguiente. Estrena: factorización, factor primo,
   teorema fundamental, PESI.
4. **Divisores.** Usa la 3: cada divisor es un trozo de la factorización. Cantidad, suma y producto con la misma tabla;
   divisores con una condición (múltiplos de k, impares), propios, simples y compuestos. Estrena: cantidad de divisores,
   suma de divisores, divisor propio, divisor simple.
5. **Euler.** Usa la 3 (PESI y los primos de N) y la idea 2 (tachar múltiplos en la plancha). φ(N) se calcula quitando
   la parte de cada primo, una tras otra (N × (1 − 1/p) × (1 − 1/q)), nunca sumando y restando comunes: la
   inclusión-exclusión es de MCD y MCM. Estrena: función de Euler, fracción irreductible.
6. **Fermat y Wilson.** Usa los restos potenciales de Divisibilidad (idea 4) y el circulito (p̊ + 1). Va al final porque
   nadie más la necesita en la unidad. Estrena: teorema de Fermat, teorema de Wilson.

**Qué no entra** (y adónde va): el MCD y el MCM (MCD y MCM, que se apoya en la factorización de la idea 3); la
inclusión-exclusión para contar múltiplos de varios números en un tramo cualquiera (MCD y MCM, como decidió
Divisibilidad); los cuadrados y cubos perfectos (Potenciación y radicación: aquí solo «el 4 va con él mismo» en las
parejas); el teorema de Euler a^φ(N) (no está en el temario de San Marcos y pide congruencias); los numerales con cifras
ocultas y divisores (San Marcos 2026-I, 34): las cifras ocultas son de Divisibilidad y aquí sumarían dos dificultades.

---

## 2. Objeto de la primera pantalla

Sigue el mundo de la rama: **el puesto de doña Juana** (los caramelos que acomoda en la bandeja de la vitrina, las
bolsitas) y **la rifa de la promoción** (la plancha de boletos numerados). Acomodar N caramelos en filas iguales, todas
llenas, es escribir N como un producto; una forma que no cierra deja caramelos sueltos.

| Idea | Objeto (primera tarjeta de «Lee» y juego) | Qué es cada cosa |
| --- | --- | --- |
| 1 | La bandeja de la vitrina: N caramelos en filas iguales, todas llenas; todas las formas a la vez | cada bandeja = una pareja de divisores (filas y caramelos por fila) |
| 2 | La plancha de boletos de la rifa, donde doña Juana tacha los que no son primos | tachar = múltiplo de un primo ya usado; lo que queda = primos |
| 3 | El pedido que se parte en partes iguales, y cada parte otra vez (el árbol de cortes), junto a la bandeja de 12 | cada corte = un producto; las hojas = los primos |
| 4 | La bandeja de 12 en «Lee» (sus 6 divisores en parejas) y la tabla de divisores: columnas de potencias de 2, filas de potencias de 3 | cada casilla = un divisor |
| 5 | La plancha de la rifa: gana el boleto que no comparte ningún primo con el total | tachado = comparte un primo; lo que queda = φ(N) |
| 6 | El pedido que se multiplica cada día, empacado en bolsitas de 5 o de 7 (el puesto), y la tabla de sueltos | día = exponente; sueltos = resto |

Piezas:
- **`arit-bandejas`** (nueva, dibujo de prueba `data-prueba`, con su prueba numérica de encuadre y rótulos; molde §6): la
  bandeja de la vitrina con N caramelos en filas iguales; todas las formas de N a la vez, a una sola escala, cada una con
  su rótulo «3 filas de 8» y, si se pide, un intento que no cierra con los sueltos en naranja punteado.
- **`arit-arbol`** (nueva, de prueba): el árbol de cortes. La raíz es N, cada corte la parte en dos, las hojas (primos)
  van en turquesa con un aro. Admite dos árboles lado a lado (para comparar dos caminos o dos números).
- **`arit-boletos`** (de Divisibilidad, compartida): **un bloque nuevo, `criba`**, que tacha los múltiplos de una lista
  de primos y, si se pide, marca en violeta lo que queda. No cambia nada de lo que ya dibuja.
- `arit-tabla` para la tabla de divisores y la de sueltos; `arit-puesto` para la tarjeta de «Lee» de la idea 6.

---

## 3. Misión de «Juega» (meta que el motor comprueba)

| Idea | Contexto + misión | Controles | `logrado` | Lectura en vivo (enuncia una relación) | `bien` |
| --- | --- | --- | --- | --- | --- |
| 1 | «Doña Juana acomoda caramelos en la bandeja, en filas iguales y todas llenas.» **Busca entre 20 y 28 caramelos la cantidad que solo se acomoda en una fila.** | `n` caramelos, 4–30 | `20 ≤ n ≤ 28` y n primo (solo 23) | «24 = 1 × 24 = 2 × 12 = 3 × 8 = 4 × 6: 8 divisores» o «23 = 1 × 23, ninguna otra forma: 2 divisores» | «23 = 1 × 23: una sola fila. Sus únicos divisores son 1 y 23.» |
| 2 | «Doña Juana tacha en la plancha del 1 al 30 los boletos que no son primos.» **Lleva la criba hasta el menor primo con el que todo lo que queda, salvo el 1, es primo.** | `p` tachar hasta 2, 3, 5 o 7 | `p === 5` (con 3 queda el 25) | «Hasta el 3: sigue sin tachar el 25 = 5 × 5» o «Hasta el 5: quedan 10, todos primos» | «Con el 5 cayó el 25 = 5 × 5. Desde ahí, ningún primo tacha nada nuevo.» |
| 3 | «Doña Juana parte un pedido en partes iguales, y cada parte otra vez, hasta que ya no se pueda.» **Busca el número de la lista que tiene tres primos distintos.** | `n` en 36, 48, 60, 64, 81, 100; `d` el primer corte, 2–6 o 10 | `n === 60` (único con 2, 3 y 5) | «60 = 4 × 15 = 2 × 2 × 3 × 5 = 2² × 3 × 5» o «64 = 3 × 21 + 1: no se parte en 3» | «60 = 2² × 3 × 5: el 2, el 3 y el 5. Prueba otro primer corte: salen los mismos.» |
| 4 | «Los divisores de N = 2ᵅ × 3ᵝ caben en una tabla: columnas de potencias de 2, filas de potencias de 3.» **Arma el N que tiene exactamente 10 divisores.** | `a` exponente de 2, 0–4; `b` exponente de 3, 0–3 | `a === 4 && b === 1` (5 × 2; la otra, 2 × 3⁴, no cabe) | «72 = 2³ × 3²: 4 columnas por 3 filas, 12 divisores» | «48 = 2⁴ × 3: 5 columnas por 2 filas, 10 divisores.» |
| 5 | «La rifa tiene N boletos. Gana cada boleto que no comparte ningún primo con N.» **Elige cuántos boletos hay para que ganen justo 8.** | `n` en 12, 14, 15, 18, 21, 22 | `n === 15` (φ: 4, 6, 8, 6, 12, 10) | «15 = 3 × 5: sin tachar quedan 8 de 15» | «Con 15 boletos ganan 8: el 1, 2, 4, 7, 8, 11, 13 y 14.» |
| 6 | «Cada día doña Juana multiplica el pedido por la base y lo empaca en bolsitas.» **Con bolsitas de 7, busca la base cuyos sueltos vuelven a 1 recién el día 6.** | `a` base 2, 3, 4 o 6; `p` bolsita de 5 o de 7 | `p === 7 && a === 3` (2 y 4 vuelven el día 3; 6, el día 2) | «Base 3, bolsitas de 7: sueltos 3, 2, 6, 4, 5, 1» | «Con 3, los sueltos tardan 6 días en volver a 1: 3, 2, 6, 4, 5, 1.» |

Ningún `bien` dice la respuesta de su predicción, y ningún juego llega a ella: en la 1 el juego empieza en 4 (no hay 1
ni 2); en la 2 la plancha llega a 30; en la 3 nadie dice qué es PESI; en la 4 solo hay dos primos; en la 5 no hay 100; en
la 6 la bolsita llega a 7.

---

## 4. La predicción de cada idea

La app baraja las opciones. `datos` lleva solo valores y equivalencias, nunca la fórmula. **No hay estudios con cifras
sobre errores de este tema** en el informe de aritmética (la matriz marca su error objetivo como «hipótesis de diseño»):
todo código AT es una hipótesis. Dos se apoyan en trampas que el CSV deduce de San Marcos: «no descomponer las bases
compuestas» (2025-I) y «el 1 es simple y no es primo» (2025-II). Ninguna predicción repite un código. Las cuentas las
rehice aparte (`propuesta-cuentas.py`, en la carpeta temporal de la sesión).

**Idea 1.** «En la rifa quedan los boletos 1, 2, 33, 35 y 37. Ganan los que llevan un número primo. ¿Cuántos ganan?»
Datos: los boletos que quedan. El juego empieza en 4.

| Opción | Qué mide |
| --- | --- |
| 2 | Correcta: el 2 y el 37 |
| 3 | Cuenta el 1: «se divide entre 1 y entre sí mismo» (AT-PRIMO-UNO) |
| 1 | Deja fuera el 2 porque es par (AT-PRIMO-PAR) |
| 4 | Cree que todo impar es primo: 1, 33, 35 y 37 (AT-PRIMO-IMPAR) |

**Idea 2.** «La rifa grande tiene boletos del 1 al 100. ¿Hasta qué primo hay que tachar múltiplos para que solo queden
primos?» Datos: los primos menores que 20.

| Opción | Qué mide |
| --- | --- |
| 7 | Correcta: 7 × 7 = 49 ≤ 100 y 11 × 11 = 121 > 100 |
| 5 | Usa el mismo tope que en la plancha de 30 (AT-CRIBA-MISMO) |
| 11 | Cree que hay que pasar de √100 = 10 (AT-CRIBA-PASA) |
| 47 | Prueba hasta la mitad de 100 (AT-CRIBA-MITAD) |

**Idea 3.** «Dos números son PESI (primos entre sí) si no comparten ningún primo en su factorización. ¿Cuál de estos
pares es PESI?» Datos: «PESI se lee “primos entre sí”». El juego no dijo qué es PESI.

| Opción | Qué mide |
| --- | --- |
| 8 y 15 | Correcta: 2 × 2 × 2 y 3 × 5 |
| 7 y 21 | Cree que basta que uno sea primo (AT-PESI-UN-PRIMO) |
| 9 y 15 | Cree que dos impares no comparten nada (AT-PESI-IMPARES) |
| Ninguno: los dos tendrían que ser primos | Lee el nombre, no la definición (AT-PESI-PRIMOS; el error que nombra la matriz) |

**Idea 4.** «720 = 2⁴ × 3² × 5. ¿Cuántos divisores tiene 720?» Datos: 720 = 2⁴ × 3² × 5¹. El juego solo tenía 2 y 3.

| Opción | Qué mide |
| --- | --- |
| 30 | Correcta: 5 × 3 × 2 |
| 15 | Se olvida del 5, como en la tabla del juego (AT-CD-OLVIDA) |
| 8 | Multiplica los exponentes sin sumar 1: 4 × 2 × 1 (AT-CD-SIN-UNO) |
| 10 | Suma en vez de multiplicar: 5 + 3 + 2 (AT-CD-SUMA) |

**Idea 5.** «La rifa grande tiene 100 boletos. Gana cada boleto que no comparte ningún primo con 100. ¿Cuántos ganan?»
Datos: 100 = 2² × 5²; los boletos van del 1 al 100.

| Opción | Qué mide |
| --- | --- |
| 40 | Correcta: de 100 queda la mitad (sin pares) y de esa, cuatro quintos (sin múltiplos de 5) |
| 30 | Quita 50 y 20 y descuenta dos veces los múltiplos de 10 (AT-EULER-DOBLE; la trampa de San Marcos 2023-I) |
| 50 | Solo quita los pares (AT-EULER-UN-PRIMO) |
| 25 | Cuenta los primos hasta 100 (AT-EULER-PRIMOS) |

**Idea 6.** «101 es primo. ¿Qué resto deja 2¹⁰⁰ al dividirlo entre 101?» Datos: 2¹⁰⁰ es 2 multiplicado por sí mismo
100 veces. El juego llega a la bolsita de 7.

| Opción | Qué mide |
| --- | --- |
| 1 | Correcta: el día p − 1 deja 1 suelto |
| 2 | Cree que vuelve a la base (AT-FERMAT-BASE) |
| 100 | Confunde con «p − 1» (AT-FERMAT-MENOS-UNO) |
| No se puede saber sin calcular 2¹⁰⁰ | No usa el teorema (AT-POTENCIA-ENTERA, el de Divisibilidad) |

Los códigos nuevos van al informe de aritmética, en una tabla «Números primos y divisores (19 nov)», como hipótesis.
Ningún ejemplo del glosario ni de «Lee» usa los números de estas predicciones ni resuelve su situación (auditorías de
Numeración, M1, y de Divisibilidad, M2): «PESI» deja de dar «8 y 15» y «criba» deja de decir «hasta 100 basta tachar
con 2, 3, 5 y 7».

---

## 5. Lo que tiene que decir cada regla y adónde llega «Ahora tú»

| Idea | La regla dice | «Así se resuelve» (distinto de «Ahora tú») | «Ahora tú», hasta nivel examen |
| --- | --- | --- | --- |
| 1 | Un primo tiene exactamente dos divisores, 1 y él mismo; un compuesto, más de dos; el 1, uno solo. Cada forma de acomodar da una pareja d × (N ÷ d). El 2 es el único primo par | cuántas bandejas distintas se arman con N caramelos (N no cuadrado) | cuál de cuatro boletos es primo; cuántos primos hay en una lista con 1 y 2; cuántos divisores tiene N; **las bandejas de un cuadrado (36: el 6 va con él mismo)**; **dos primos que suman un impar (uno es 2)**; **un divisor en un rango (San Marcos 2026-II)** |
| 2 | N es primo si ningún primo p con p × p ≤ N lo divide; la criba tacha los múltiplos de cada primo desde p × p. Las parejas: si una pasa de √N, la otra no llega | ¿es N primo? (N primo de tres cifras) | hasta qué primo probar; el menor primo que divide a N = p × q; cuántos primos hay en un tramo; **primos en progresión aritmética (San Marcos 2026-I)** |
| 3 | N = pᵅ × qᵝ × … de una sola manera (descomposición canónica); los exponentes dicen cuántas veces entra cada primo; PESI: sin ningún primo en común (no tienen que ser primos) | la descomposición canónica de un número por divisiones sucesivas | la forma canónica entre cuatro (sin terminar, sin exponentes, con un compuesto); el exponente de un primo; cuál par es PESI; **el exponente de 3 en 12³ × 45² (San Marcos 2025-I)** |
| 4 | CD(N) = (α + 1)(β + 1); SD(N) = (1 + p + … + pᵅ)(1 + q + … + qᵝ); PD(N) = N^(CD/2). Propios: CD − 1; simples: el 1 y los primos; múltiplos de k: los divisores de N ÷ k | la cantidad de divisores de un número que hay que factorizar | CD de una forma canónica; SD; **divisores múltiplos de k o impares**; **el exponente que falta para tener k divisores (San Marcos 2027-I)**; **divisores compuestos (2025-II: el 1 es simple)**; **el promedio de los divisores (2021)** |
| 5 | φ(N) = N × (1 − 1/p) × (1 − 1/q); entran los primos distintos, no los exponentes; φ(p) = p − 1 | φ de un número con dos primos | φ con dos primos; con tres o con una potencia de un primo; **fracciones propias irreductibles de denominador N (2025-I)**; **las mayores que ½ (2024-I)** |
| 6 | p primo, a no múltiplo de p: aᵖ⁻¹ = p̊ + 1; 1 × 2 × … × (p − 1) = p̊ − 1. Si p no es primo o divide a la base, no vale | el resto de una potencia grande entre un primo, reduciendo con p − 1 | el resto de aⁿ con n grande; **cuando p divide a la base, o no es primo**; Wilson; **Wilson más un número** |

---

## 6. Tabla de letras y símbolos

| Símbolo | Un solo significado en la unidad | Aviso |
| --- | --- | --- |
| N | el número que se estudia | Como en Divisibilidad. Antes era n, que en la rama es la base de numeración |
| d | un divisor de N | Como en Divisibilidad (el divisor, lo que lleva una fila) |
| k | un entero (N = d × k) | El mismo de Divisibilidad |
| p, q | dos primos distintos | **Aviso**: en Divisibilidad q era el cociente; aquí es un primo, como en los libros (N = pᵅ × qᵝ) |
| α, β | los exponentes de p y de q en N | Letras griegas, como en la academia (CD = (α + 1)(β + 1)); se dicen en la llave y en Datos |
| CD(N), SD(N), PD(N) | cantidad, suma y producto de los divisores de N | Notación de la academia peruana; van en el glosario y en Datos |
| φ(N) | la función de Euler de N | Se lee «fi de N» |
| a | la base de la potencia (Fermat) | Solo en la idea 6; a, b, c no son cifras en esta unidad (no hay cifras ocultas) |
| p̊ | «múltiplo de p» (el circulito del examen, `{ mult }`) | Solo en la idea 6, con su glosa en los Datos de cada ejercicio que lo usa (auditoría de Divisibilidad, M4) |
| √N | la raíz cuadrada de N | En el glosario (idea 2) |
| × | multiplicar | Nunca «·» (el «   ·   » solo separa dos relaciones en una regla) |
| mcd, MCD | **salen** | Son de MCD y MCM |

---

## 7. Mapa de colores por magnitud (§5b)

El criterio de la rama (envase turquesa, lo que se muda naranja, lo que se busca violeta, números en tinta), leído en
esta unidad. Un color fijo por magnitud en las seis ideas, con su prueba en `numeros-primos-y-divisores.test.js`
(`def.colores`, como en Divisibilidad).

| Token | Magnitud | Dónde se ve |
| --- | --- | --- |
| `i` turquesa, «envase» | **los divisores**: lo que lleva una fila de la bandeja, las filas, los primos con que se arma N (son sus divisores primos), las casillas de la tabla de divisores, el primo que tacha en la criba, la bolsita de Fermat | el rótulo «3 filas de 8», las hojas del árbol, el aro del primo que tacha |
| `o` naranja, «sobra» | lo que sobra: los sueltos de una forma que no cierra, el resto de una división de prueba, los restos de Fermat y Wilson | el caramelo suelto punteado, «221 = 7 × 31 + 4», la columna de sueltos |
| `f` violeta, «busca» | lo que se busca: cuántos primos o divisores, CD, SD, φ(N), el número que se pide; en la criba y en Euler, los boletos que quedan | el recuadro de respuesta, el boleto que gana |
| tinta | N cuando se da, los exponentes, k, los números que se operan, «?» | — |
| verde, carmín | **no se usan** | el carmín es de ángulos; el verde se pierde junto al naranja |

Avisos:
- **Los exponentes van en tinta** (antes, carmín). El control del exponente no lleva color, como el control de los
  caramelos en Divisibilidad. Descartado: el exponente en naranja, porque en la idea 6 el exponente y el resto van juntos
  (aᵖ⁻¹ = p̊ + 1) y compartirían color.
- **La respuesta lleva el color de su magnitud**: un resto en naranja; cuántos o cuál, en violeta. Lo pedido va con «?»
  en tinta hasta comprobar.
- La caja 3D del laboratorio (`ari-cubitos-3d`, pieza compartida) pinta en verde los divisores que resalta; no se toca:
  es una mesa libre y el verde va solo (sin naranja al lado).

Pares que van juntos (medidos en §5b): naranja–turquesa 0,114, naranja–violeta 0,189 y turquesa–violeta 0,101.

---

## 8. Práctica: qué existe y qué falta por idea

**Lo que existe hoy:**
- **Escena `divisores`** («El rectángulo de fichas», borrador 0.1.0, compartida con Divisibilidad): divisores, criba,
  exponentes, criterios, restos y restos potenciales, con 19 casos y papel sin `datos`. Divisibilidad ya la mandó a «Más
  mesas del tema».
- **`numeros-sucesiones`**: dos tipos de esta unidad, `divisores` (cuántos, múltiplos de m, impares, cuadrados,
  propios, compuestos: el de San Marcos 2022) y `primos-pa` (San Marcos 2026-I). Su papel trae dos problemas de la unidad
  (p6 y p7) sin `unidades` ni `datos`.
- Ningún ítem en la prueba del curso.

| Idea | Hay | Falta |
| --- | --- | --- |
| 1 Primos | mesa `filas-de-c` | tipos «¿cuál es primo?», «cuántos primos en una lista», «cuántos divisores (por parejas)», «dos primos que suman un impar» |
| 2 Criba | mesa `criba-100`; `primos-pa` | tipos «hasta qué primo probar», «el menor primo que divide», «primos en un tramo», «primos en progresión» |
| 3 Factorización | pasos de la escena | tipos «forma canónica», «exponente de un primo», «¿cuál par es PESI?», «potencias de compuestos» |
| 4 Divisores | `divisores` de `numeros-sucesiones`; mesas `caja-divisores` y `otro-primo` | tipos «CD», «SD», «con condición», «exponente que falta», «simples y compuestos» |
| 5 Euler | — | tipos «φ(N)», «φ con tres primos o una potencia», «fracciones irreductibles», «mayores que ½» |
| 6 Fermat y Wilson | — | tipos «Fermat», «cuando no vale», «Wilson», «Wilson más un número» |

Fase 3: una plantilla nueva de formato `predicciones`, **`plantillas/primos-divisores/`** («La vitrina de los primos»),
con generador por idea (`TIPOS_POR_IDEA`), prueba en 400 semillas, `casos.json` verificado aparte en Python y papel de
8 problemas con sus datos (uno por idea y dos de examen de San Marcos). Va primera en la ficha. `numeros-sucesiones`
sigue con sus tipos `divisores` y `primos-pa` (el encargo los dejó para esta unidad), y sus problemas p6 y p7 dicen ahora
de qué unidad son y traen sus datos (cambio mínimo en un archivo compartido). La escena `divisores` pasa a «Más mesas del
tema» también aquí (`"rehacer"` con las dos unidades). Dos ítems nuevos para la prueba del curso (cantidad de divisores
y φ con fracciones irreductibles), en la reserva: las formas ya tienen sus diez pares.

---

## 9. Datos del mundo

La unidad casi no los necesita: el puesto, la bandeja, la rifa y las bolsitas son situaciones de problema.

| Dato | ¿Fuente? |
| --- | --- |
| Caramelos (4 a 40), bolsitas de 5 o 7, boletos del 1 al 30 o al 100 | Valores de problema, sin fuente |
| Una caja de 30 huevos (bandeja de 5 × 6) | De todos los días, «unos»: sin fuente |
| Historia: Euclides, *Elementos* IX.20 (hay infinitos primos) | Ya trae fuente (edición de D. E. Joyce, Clark University); se queda |

---

## 10. Riesgos de orden con otras unidades (`requiere`)

- **`requiere: ['aritmetica.divisibilidad']` es correcto y basta.** De ahí se usan el circulito (p̊), los restos
  potenciales y los criterios del 2, 3 y 5; de Las cuatro operaciones, «divisor», «múltiplo» y «división exacta».
- **MCD y MCM** (la siguiente) recibió los restos con varios divisores y la inclusión-exclusión: aquí no se suman ni se
  restan comunes (φ va por partes, multiplicando), y «máximo común divisor» no aparece. PESI se define por los primos de
  cada número. MCD y MCM podrá usar la factorización de la idea 3 y la palabra «PESI» tal cual.
- **Potenciación y radicación** define «cuadrado perfecto»: aquí no se usa la palabra; el caso del cuadrado va como «el
  6 va con él mismo» en las parejas de 36.
- **«número primo»** sigue definido en Lógica (una definición por curso: no se toca otra unidad). Su definición dice
  «Entero mayor que 1…», que cuadra con la regla de la idea 1.
- **«factorial»** es de Análisis combinatorio: en Wilson se escribe el producto 1 × 2 × … × (p − 1); «(p − 1)!» va solo en
  Datos, con su glosa.
- **`arit-boletos`** es de Divisibilidad: el bloque `criba` es nuevo y aparte, con su prueba, y no cambia ningún dibujo de
  esa unidad.

---

## 11. Decisiones tomadas (Gerson revisa después)

1. **Seis ideas con los `id` de hoy, y la cantidad, la suma y el producto de divisores en una sola (`divisores`).**
   Motivo: el catálogo tiene un solo tema para las tres, salen de la misma tabla y así nadie pierde avance. Descartado:
   siete ideas (partir suma y producto) con `septimaIdea`, que habría dado 105 ejemplos para un tema con 3 preguntas de
   San Marcos. **Es la que más conviene que mires.**
2. **PESI sin el MCD**: «no comparten ningún primo en su factorización». Motivo: el MCD es de la unidad siguiente
   (contrato, punto 9) y la consigna es no adelantarla. Descartado: «su máximo común divisor es 1» (la definición de hoy).
3. **φ(N) por partes, multiplicando (N × (1 − 1/p) × (1 − 1/q))**, nunca sumando y restando comunes. La trampa de San
   Marcos 2023-I queda como distractor (AT-EULER-DOBLE) con su explicación. Descartado: contar con inclusión-exclusión,
   que es de MCD y MCM.
4. **Notación del examen: N = pᵅ × qᵝ, CD(N), SD(N), PD(N), α y β griegas**, con aviso para q (en Divisibilidad era el
   cociente). Descartado: a, b, c para los primos (en la rama son cifras) y n para el número (en la rama es la base).
5. **Colores: divisores y primos en turquesa, lo que sobra en naranja, lo que se busca en violeta, exponentes en
   tinta.** Motivo: un color por magnitud y el exponente junto al resto en Fermat. Descartado: exponentes en carmín (el
   color de los ángulos), que es lo que hay hoy.
6. **El mundo: la bandeja de la vitrina (ideas 1, 3 y 4), la plancha de la rifa (2 y 5) y el pedido en bolsitas (6).**
   Piezas de prueba nuevas `arit-bandejas` y `arit-arbol`, y el bloque `criba` en `arit-boletos`. Descartado: seguir con
   fichas sueltas.
7. **Fermat y Wilson en una idea corta, la última.** Motivo: 0 preguntas de San Marcos y sí en el temario de la UNI.
   Descartado: sacarlos (la unidad dejaría de cubrir su tema) o juntarlos con Euler.
8. **Las cifras ocultas con divisores (San Marcos 2026-I, 34) no entran.** Motivo: suman la dificultad de Divisibilidad
   a la de esta unidad en un solo ejercicio. Descartado: un ejemplo de nivel 3 con a̅b̅ (las letras a y b tendrían dos
   sentidos en la unidad).
9. **Los ejemplos de nivel 3 llevan cinco alternativas, A a E**, como Divisibilidad, con la letra de la correcta
   repartida (unas 6 veces cada una en 30 ejemplos).
10. **Práctica: `plantillas/primos-divisores` nueva y primera en la ficha; `numeros-sucesiones` se queda segunda** con
    sus dos tipos, y la escena `divisores` pasa a «Más mesas del tema» en esta unidad. Descartado: sacar la unidad de
    `numeros-sucesiones` (el encargo dejó su tipo `divisores` para esta unidad).
11. **Ficha del catálogo:** temas sin cambio; `investigacion` apunta al informe de aritmética, con su tabla nueva;
    `requiere` y `grado` sin tocar.
12. **Las mesas del laboratorio se quedan** (sus `id` y los de sus controles no cambian, por la colección); cambian sus
    colores (los exponentes salen del carmín y la lectura del verde) y sus letras (N, no n). La caja 3D sigue con su verde.

---

## 12. Fases 2 a 5 (19 nov): lo que se hizo y lo que se decidió de paso

Las seis ideas quedaron escritas con sus 15 ejemplos y su prueba propia (`numeros-primos-y-divisores.test.js`: colores,
misión única, predicciones con un código por opción y cada distractor rehecho, «Ahora tú» en 400 semillas recalculado
por fuerza bruta, toda igualdad escrita comprobada en 400 semillas, los 90 ejemplos contra cuentas aparte y la letra
correcta repartida). El validador con `calidad: 2` simulada no marca nada; la unidad sigue sin la marca.
`herramientas/ecuaciones-ancho.js`: todo cabe a 390 px.

13. **Práctica: `plantillas/primos-divisores`** («La vitrina de los primos», 25 tipos en las seis ideas, de nivel 1 a
    examen, con 25 casos verificados aparte en Python y 8 de papel). Va primera en la ficha; `numeros-sucesiones` queda
    segunda con `divisores` y `primos-pa` (sus problemas p6 y p7 ahora dicen su unidad y traen datos); la escena
    `divisores` pasa a «Más mesas del tema» también en esta unidad.
14. **La prueba del curso no cambia**: ya tiene sus diez pares. Los dos de esta unidad (ari-33, cantidad de divisores;
    ari-34, fracciones irreductibles con φ) quedan en la reserva con su verificador. Descartado: sacar otro par.
15. **La caja 3D del laboratorio resalta en violeta** (antes verde): el color lo dan los datos de la mesa, no la pieza.
    La mesa `criba-100` pasa a la plancha de la rifa; los `id` de mesas y controles no cambian.
16. **El glosario de Fermat no dice el resultado** (se abre antes de jugar desde «Palabras de esta idea» y habría
    respondido la predicción): «un atajo para el resto de una potencia entre un primo». Igual con «raíz cuadrada»: sin
    √30, que daba la misión de la criba.
17. **La lectura del juego de la idea 1 dice «3 formas, 2 divisores cada una: 6 divisores»** (nota de la sesión: con
    «12 = 1 × 12 = …: 6 divisores» y tres bandejas, se contaba 3), y «Lee» dice que 12 filas de 1 es la misma bandeja
    girada.
18. **Las misiones que no miran un control** (la idea 3 no mira el primer corte) cuentan como una sola manera: la prueba
    exige que los controles que la misión mira queden fijos.
