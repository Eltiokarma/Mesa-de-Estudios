# Propuesta de ideas: «Divisibilidad» (`aritmetica.divisibilidad`)

Etapa 5 del plan de calidad, rama «Números y operaciones» (la de entrada de Aritmética), la tercera unidad, después de
«Sistemas de numeración» y «Las cuatro operaciones» · fases 1 y 2 (`docs/metodo/unidad/1-ideas.md`) · 19 nov 2026

Gerson delegó el criterio: esta propuesta ya se está ejecutando (la idea 1 está escrita con ella como guion) y tú la
revisas después. Por eso la última sección no pregunta: dice qué se decidió, por qué y qué se descartó. No hay ningún
conflicto crítico.

Lo que leí: `CLAUDE.md`, `docs/plan-calidad.md` §3, `docs/molde-unidad.md`, `docs/metodo/unidad/` (LEEME, 1-ideas,
2-ejemplos), las decisiones de las etapas 2, 3 y 4, la propuesta de «Las cuatro operaciones» como modelo
(`docs/etapa4/propuesta-aritmetica.md`), esa unidad terminada (`cuatro-operaciones.js`, calidad 2) con sus piezas, su
auditoría y su lector en frío (`rutinas/auditoria/` y `rutinas/frio/`), la teoría actual (`divisibilidad.js`, v0.2.0), su
ficha en `catalogo/cursos/aritmetica.json`, sus dos plantillas (`divisores`, `numeros-sucesiones`), el informe
`docs/investigacion/aritmetica-razonamiento-ideas-erroneas.md`, las trampas de
`docs/clasificacion/trampas-admision-unmsm/aritmetica-algebra.md`, la matriz `docs/teoria/matriz/aritmetica.json`
(unidad 13), `docs/temario-completo.md` §13, `docs/clasificacion/banco-cuzcano.md`, la prueba
`catalogo/pruebas/aritmetica.json`, `docs/datos/admision-unmsm.csv` y las unidades vecinas (`numeracion.js`,
`numeros-primos-y-divisores.js` y `mcd-y-mcm.js`), para no repetir ni adelantar.

## Qué se pregunta en los exámenes

El catálogo pone la unidad en las semanas 14 y 15 de la UNI y en el tema 5 de San Marcos. En
`docs/datos/admision-unmsm.csv` hay **15 preguntas de San Marcos** (2019-I a 2027-I) que son de divisibilidad: 13
clasificadas en aritmética y 2 en razonamiento matemático. Las describo con el resumen del CSV (los solucionarios no
están descargados en esta sesión).

| Periodo (pregunta) | Qué piden | Dónde queda |
| --- | --- | --- |
| 2019-I (44) | Varios grupos; una razón obliga a que el total sea múltiplo de un número | idea 1 |
| 2026-I, RM (25) | Faltan unidades para un reparto exacto; cuántas personas, por los divisores | idea 1 |
| 2023-II (33) | «Le faltaba uno»: el resto por exceso leído como por defecto (trampa 18) | idea 2 (la parte de un solo divisor) |
| 2023-II (31) | Numerales con cifras ocultas, múltiplos de 7 y de 9 | ideas 3 y 5 |
| 2027-I (33) | Numerales con cifras ocultas, divisibles entre 7 y 13 | idea 5 |
| 2023-II, RM (23) | Cantidades de dos artículos con un gasto fijo (ecuación diofántica) | idea 6 |
| 2019-II (37), 2023-I (31, dos formas), 2023-II (32, dos formas), 2024-II (31), 2026-II (32) | Un número que deja ciertos restos con **varios** divisores: «MCM × k + r» (trampa 19: el producto en vez del MCM, o el MCM sin igualar los restos) | **MCD y MCM** (decisión 1) |
| 2026-II (32, área D) | Múltiplos de tres primos, con inclusión y exclusión (trampa 20) | **MCD y MCM** (decisión 1) |

El banco Cuzcano tiene unas 131 fichas: criterios de divisibilidad (44), ecuaciones diofánticas (19), restos potenciales
(18), conteo de múltiplos (13) y cifras terminales (12). Son de academia: dicen qué se pregunta, no se copian.

**Lo que más pesa en San Marcos (9 de 15) necesita el MCM**, que en el árbol llega dos unidades después. De lo que es
divisibilidad pura, lo más preguntado son los criterios con cifras ocultas (2 de San Marcos y 44 fichas de academia) y
el resto por exceso. Los restos potenciales no salieron en San Marcos entre 2019-I y 2027-I, pero sí están en el temario
de la UNI y en la academia.

---

## 0. Diagnóstico de la teoría actual contra el contrato

`divisibilidad.js` (v0.2.0, `estado: 'completa'`, sin `calidad: 2`) tiene 5 ideas (`filas-de-m`, `restos-suman`,
`restos-potenciales`, `criterios`, `diofanticas`) y tres mesas con retos. Lo que sirve: los sobrantes que se juntan en
otra fila, la tabla del ciclo de restos y la tabla «cifra · lugar · resto del lugar · aporte».

1. **Punto 1: ninguna primera pantalla tiene un objeto.** Fichas en filas y tablas. Los panes de la feria, los huevos
   por docena y los juegos de 4 y 6 soles solo están escritos en «Lee».
2. **Puntos 2, 3 y 12: no hay `mision`, `leyenda`, `aprendizaje`, `actividad` ni `pregunta`.** Las consignas describen
   botones («Elige cuántas fichas hay y el largo de cada fila»).
3. **Punto 13: ningún ejercicio trae `datos`.** No hay ejemplos resueltos (0 de 90). El glosario tiene 10 términos sin
   `simple` y con un solo ejemplo.
4. **Punto 9: el orden falla con el árbol.** La idea 5 se llama «manda el mcd» y el glosario estrena aquí «máximo común
   divisor», que es de la unidad MCD y MCM, dos más abajo. «Múltiplo», «divisor» y «división exacta» se vuelven a
   explicar, y ya son de Las cuatro operaciones.
5. **Notación que el examen no usa.** Todo va con a ≡ r (mód m). San Marcos y las academias escriben el múltiplo con
   un circulito encima: N = 7̊ + 3. La unidad no lo muestra ni una vez.
6. **Regla 3 y códigos repetidos.** La predicción de la idea 1 (91 en filas de 7) tiene tres opciones con el mismo
   código AT-PRIMO; la de la 3, dos con AT-CICLO; la de la 4, tres con AT-CRITERIO; la de la 5, tres con AT-DIOF.
7. **§5b: colores viejos.** El resto en carmín (el color de los ángulos) y el resultado en verde, junto al naranja.
8. **«Así se resuelve» es el generador de «Ahora tú» con la semilla + 900**, y «Ahora tú» no llega a examen: no hay
   cifras ocultas, ni conteo de múltiplos, ni el resto por exceso.
9. **Letras.** n es el número y también el exponente; m es el divisor (en la rama, n es la base); a es un número y un
   coeficiente; b es la base de la potencia.
10. **Práctica:** la escena `divisores` (borrador 0.1.0, compartida con Números primos, papel sin datos) y dos tipos de
    `numeros-sucesiones` (`grupos` y `divisores`). No hay práctica por idea, y la prueba del curso no tiene ningún ítem
    de esta unidad.
11. La cabecera dice «postulante de 3.º».

---

## 1. Las ideas, en orden

Son **seis** (no hace falta `septimaIdea` ni partir la unidad). Cinco conservan su `id`; `criterios-pesos` es nueva.
Los `id` de los controles que se quedan no cambian (`n`, `m`, `a`, `b`, `k`, `e`, `N`, `d`, `c`); los rótulos sí.

| # | `id` | Título (≤ 6 palabras) | `aprendizaje` |
| --- | --- | --- | --- |
| 1 | `filas-de-m` | Múltiplo: bolsitas llenas, ningún suelto | N es múltiplo de d, y d divisor de N, si N caramelos llenan bolsitas de d sin sueltos: N = d × k. |
| 2 | `restos-suman` | Al operar, mandan los sueltos | Al sumar o multiplicar, las bolsitas llenas siguen llenas: el resto del resultado sale de operar solo los restos y volver a empacar. |
| 3 | `criterios` | Criterios: lo que deja cada envase | Entre 9 y 3, cada bolsita, caja o cajón deja 1 suelto por cifra: se suman las cifras; entre 2, 4, 5 y 25, los envases grandes no dejan nada: bastan las últimas cifras. |
| 4 | `restos-potenciales` | Los restos de potencias se repiten | Los restos de las potencias de un número vuelven a empezar en ciclo; el exponente se cambia por su resto entre el largo del ciclo. |
| 5 | `criterios-pesos` (nueva) | Criterios del 11, 7 y 13 | Cada lugar pesa lo que deja su potencia de 10: entre 11, sobra 1 y falta 1, alternados; entre 7, los pesos 1, 3 y 2; con eso se halla una cifra oculta. |
| 6 | `diofanticas` | Pagar justo con dos monedas | Una ecuación con dos incógnitas enteras se resuelve con restos: se halla una solución y las demás salen de salto en salto; a veces no hay ninguna. |

`pregunta` (Resumen): 1 «¿Cuándo un número es múltiplo de otro?» · 2 «¿Qué resto deja una suma o un producto?» ·
3 «¿Por qué sumar las cifras dice si un número es múltiplo de 9?» · 4 «¿Qué resto deja una potencia enorme?» ·
5 «¿Cómo se sabe si un número es múltiplo de 11 o de 7?» · 6 «¿Cuándo se puede pagar justo con dos monedas?».

`actividad`: 1 «Cambiar el tamaño de la bolsita hasta que no quede ningún caramelo suelto.» · 2 «Juntar dos pedidos y
ver qué pasa con los sueltos de cada uno.» · 3 «Reempacar cajas y bolsitas de 10 en bolsitas de 9 y contar lo que
sobra.» · 4 «Duplicar el pedido cada día y anotar los sueltos hasta que se repitan.» · 5 «Probar cifras en un boleto
borroso hasta que gane el premio.» · 6 «Elegir cuántas monedas de cada clase hacen justo el total.»

**Por qué va cada una ahí y qué da por sabido**

1. **Múltiplo.** Es la raíz de las otras cinco. Da por sabido «múltiplo», «divisor» y «división exacta» (Las cuatro
   operaciones, idea 6): aquí no se vuelven a definir, se marcan «se explica en…». Lo nuevo es la relación mirada desde
   los dos lados (N = d × k), la escritura del examen (N = 7̊), que los múltiplos van de d en d y cuántos hay hasta
   cierto número (el conteo de múltiplos, 13 fichas de academia). Estrena: divisible, número par, número impar.
2. **Operar con restos.** Los principios de la divisibilidad: múltiplo ± múltiplo es múltiplo; (d̊ + r) + (d̊ + s) =
   d̊ + (r + s); en el producto, los restos se multiplican; todo múltiplo de 6 lo es de 3; y un mismo número se escribe
   d̊ + r o d̊ − rₑ (el resto por exceso de Las cuatro operaciones, la trampa 18). Necesita la 1. Estrena: módulo,
   congruencia (como otra manera de escribir «dejan el mismo resto»).
3. **Criterios de las últimas cifras y de la suma.** Usa la 2 (el resto de una suma y de un producto) y la
   descomposición de Numeración: 243 = 2 × 100 + 4 × 10 + 3. Cada envase deja siempre lo mismo. Estrena: criterio de
   divisibilidad, suma de cifras.
4. **Restos potenciales.** Usa la 2 (el producto de restos, repetido). Va antes de la 5 porque los pesos del 7 son los
   restos de las potencias de 10. Incluye la última cifra de una potencia (cifras terminales, 12 fichas): es el resto
   entre 10. Estrena: restos potenciales, ciclo, exponente.
5. **El 11, el 7 y el 13 (nueva).** Usa la 3 (cada lugar deja su resto) y la 4 (el ciclo de 10 entre 7: 1, 3, 2 y
   después los mismos «faltando»). Su nivel examen son las cifras ocultas de San Marcos 2023-II y 2027-I. Estrena:
   suma alternada, peso de un lugar.
6. **Ecuaciones diofánticas.** Usa la 2 y la 1. Va al final porque nadie más la necesita en la unidad. La condición de
   existencia se dice sin el MCD: «si los dos coeficientes son múltiplos de un mismo número y el total no, no hay
   solución». Estrena: ecuación diofántica, coeficiente, solución entera.

**Qué no entra** (y adónde va): los restos con varios divisores a la vez y el conteo de múltiplos con inclusión y
exclusión, que necesitan los múltiplos comunes (MCD y MCM, decisión 1); la cantidad de divisores, los primos y el
teorema de Fermat (Números primos y divisores, que ya los tiene); los criterios en otras bases (una línea en la
condición de la regla de la idea 3: «en base n, la suma de cifras sirve para n − 1») y el binomio de Newton con
múltiplos, (d̊ + r)ⁿ = d̊ + rⁿ, que entra como caso de nivel examen de la idea 4 y no como idea.

---

## 2. Objeto de la primera pantalla

Sigue el mundo de la rama: **el puesto de doña Juana** (caramelos, bolsitas, cajas) y **la rifa de la promoción**
(boletos numerados). Empacar en bolsitas de d es dividir entre d; los sueltos son el resto; un boleto premiado «cada d»
es un múltiplo de d.

| Idea | Objeto (primera tarjeta de «Lee» y juego) | Qué es cada cosa |
| --- | --- | --- |
| 1 | El mostrador con los caramelos empacados en bolsitas de d; en «Lee», «Predice» y «Mira», la plancha de boletos de la rifa con un premio cada d boletos | bolsitas llenas = k; ningún suelto = múltiplo; boleto premiado = múltiplo de d |
| 2 | Dos pedidos en bolsitas de 7 que se juntan en el mostrador: las llenas siguen llenas y los sueltos de los dos forman un montón aparte | sueltos de cada pedido = r y s; el montón junto = r + s, que se vuelve a empacar |
| 3 | El pedido en cajas de 100, bolsitas de 10 y sueltos, que doña Juana reempaca en bolsitas de 9: de cada bolsita de 10 sobra 1 y de cada caja de 100 sobra 1 | lo que deja cada envase = el resto de 10 y de 100; una cifra = cuántos envases hay |
| 4 | El pedido que se duplica cada día (2, 4, 8, 16, 32 y 64 caramelos), empacado en bolsitas de 7, con los sueltos de cada día en fila | día = exponente; sueltos del día = resto de la potencia |
| 5 | Un boleto de la rifa con una cifra borrada por la lluvia; gana si su número es múltiplo de 11 | cifra borrada = cifra oculta; debajo de cada cifra, su peso |
| 6 | Las monedas de S/ 2 y de S/ 5 sobre el mostrador para pagar justo una cuenta | cuántas de cada una = x e y; el total = lo que hay que pagar |

Piezas: `arit-puesto` ya sirve a las ideas 1 a 4 (con `incompleta` para el resto por exceso). Nueva, dibujada como
prueba (`data-prueba`, con su prueba numérica de encuadre y rótulos; molde §6): **`arit-boletos`**, la plancha de
boletos numerados de la rifa, con los premiados marcados y los grupos de d boletos sombreados (ideas 1, 2 y 5; en la 5,
un boleto grande con la cifra borrada y los pesos debajo). Para la idea 6 hará falta **`arit-monedas`** (monedas de
S/ 2 y S/ 5 en pilas), también de prueba. `arit-tabla` queda para «Mira» y los ejemplos de las ideas 3 a 5, al lado del
objeto.

---

## 3. Misión de «Juega» (meta que el motor comprueba)

| Idea | Contexto + misión | Controles | `logrado` | Lectura en vivo (enuncia una relación) | `bien` |
| --- | --- | --- | --- | --- | --- |
| 1 | «Doña Juana empaca sus caramelos en bolsitas iguales.» **Pon 28 caramelos: elige una bolsita de más de 4 caramelos que no deje ninguno suelto.** | `n` caramelos, 12–40; `m` por bolsita, 2–9 | `n === 28 && m > 4 && n % m === 0` (solo m = 7) | «30 = 4 × 7 + 2: no es múltiplo de 4» o «28 = 7 × 4: es múltiplo de 7» | «28 = 7 × 4: cuatro bolsitas de 7 y ningún suelto. 28 es múltiplo de 7.» |
| 2 | «Le llegan dos pedidos y los empaca en bolsitas de 7.» **El de la mañana es de 25. Busca el de la tarde, de menos de 20, que deja el total sin sueltos.** | `a`, 12–40; `b`, 11–40; bolsitas de 7 fijas | `a === 25 && b === 17` (el único de 11 a 19) | «sueltos: 4 + 3 = 7: llenan otra bolsita; 25 + 17 = 42 es múltiplo de 7» | «Los 4 sueltos de la mañana y los 3 de la tarde llenaron una bolsita: 42 = 7 × 6.» |
| 3 | «Tiene 2 cajas y 5 sueltos, y reempaca todo en bolsitas de 9.» **Elige cuántas bolsitas de 10 agrega para que no sobre ningún caramelo.** | cajas 1–4, bolsitas 0–9, sueltos 0–9 | 2 cajas, 5 sueltos y 2 bolsitas (225 = 9 × 25; única) | «de las cajas sobran 2, de las bolsitas 4 y hay 3 sueltos: 2 + 4 + 3 = 9, otra bolsita de 9» | «Cada caja y cada bolsita dejó 1 suelto: 2 + 2 + 5 = 9, y con 9 se llenó otra.» |
| 4 | «Cada día duplica el pedido y lo empaca en bolsitas de 7.» **Busca el primer día, después del día 1, en que vuelven a quedar 2 sueltos.** | `e` día, 1–6; `k` por bolsita, 3, 5, 7 o 9 | `k === 7 && e === 4` (16 = 7 × 2 + 2) | «día 4: 16 = 7 × 2 + 2; los sueltos van 2, 4, 1, 2» | «El día 4 quedan 2, como el día 1: de ahí en adelante los sueltos se repiten.» |
| 5 | «La lluvia borró una cifra del boleto 4☐73. Gana si es múltiplo de 11.» **Elige la cifra borrada que lo hace ganar.** | la cifra, 0–9 | la cifra es 8 (4 873 = 11 × 443; única) | «3 − 7 + 8 − 4 = 0: lo que sobra y lo que falta se compensan» | «Con el 8, lo que sobra y lo que falta se anulan: 4 873 es múltiplo de 11.» |
| 6 | «Un cliente paga S/ 23 solo con monedas de S/ 2 y de S/ 5.» **Paga justo con la menor cantidad de monedas.** | `a` monedas de 2, 0–12; `b` monedas de 5, 0–5 | `a === 4 && b === 3` (la otra manera, 9 y 1, usa 10 monedas) | «2 × 4 + 5 × 3 = 23: justo» o «2 × 5 + 5 × 3 = 25: sobran 2» | «4 de S/ 2 y 3 de S/ 5: siete monedas. Con 9 y 1 también llega, con diez.» |

Ningún `bien` dice la respuesta de su predicción, y ningún juego llega a ella: en la 1 no hay rifa ni se cuenta nada;
en la 2 solo se suma; en la 3 solo se reempaca de 9 en 9; en la 4 el juego llega al día 6; en la 5 solo hay 11; en la 6
el total es 23 y se pide una manera, no cuántas hay.

---

## 4. La predicción de cada idea

La app baraja las opciones. `datos` lleva solo valores y equivalencias, nunca la fórmula. **No hay estudios con cifras
sobre errores de divisibilidad**: el informe de aritmética no tiene sección del tema, y la matriz marca su error objetivo
como «hipótesis de diseño». Todo código AT es una hipótesis. Dos se apoyan en trampas deducidas de San Marcos: la 18
(resto por exceso leído como por defecto, 3 preguntas) y la 19 (el producto en vez del MCM, que queda para MCD y MCM).
Ninguna predicción repite un código. Las cuentas las rehice aparte (`propuesta-cuentas.js`, en la carpeta temporal de la
sesión).

**Idea 1.** «La promoción vende los boletos del 1 al 50. Hay premio para cada boleto cuyo número es múltiplo de 6.
¿Cuántos premios se entregan?» Datos: los boletos van del 1 al 50, sin saltarse ninguno. El juego no contó nada.

| Opción | Qué mide |
| --- | --- |
| 8 | Correcta: 50 = 6 × 8 + 2; cada grupo completo de 6 boletos termina en un premio |
| 9 | Redondea 50 ÷ 6 hacia arriba: cuenta un grupo que no se completa (AT-CONTEO-ARRIBA) |
| 7 | No cuenta el 6: cree que un número no es múltiplo de sí mismo (AT-MULT-PROPIO) |
| 5 | Cuenta los boletos que terminan en 6: 6, 16, 26, 36 y 46 (AT-MULT-TERMINA) |

**Idea 2.** «Un pedido deja 4 sueltos al empacarlo en bolsitas de 7. Doña Juana prepara 5 pedidos iguales y los junta.
¿Cuántos sueltos quedan?» Datos: 1 bolsita = 7 caramelos; cada pedido deja 4 sueltos. El juego solo sumó dos pedidos.

| Opción | Qué mide |
| --- | --- |
| 6 | Correcta: 5 × 4 = 20 sueltos = 2 bolsitas + 6 |
| 20 | Multiplica los sueltos y no vuelve a empacar (AT-RESTO-MAYOR) |
| 2 | Suma 4 + 5 en vez de multiplicar: 9 = 7 + 2 (AT-RESTO-SUMA) |
| No se puede saber sin el tamaño del pedido | Cree que hace falta el número entero (AT-DEPENDE) |

**Idea 3.** «Doña Juana reempaca 2 cajas, 3 bolsitas y 7 sueltos (237 caramelos) en bolsitas de 4. ¿Cuántos sueltos
quedan?» Datos: 1 caja = 100 caramelos; 1 bolsita = 10; 100 = 4 × 25. El juego solo reempacó de 9 en 9.

| Opción | Qué mide |
| --- | --- |
| 1 | Correcta: las cajas no dejan nada; 37 = 4 × 9 + 1 |
| 0 | Usa la suma de cifras, como con el 9: 2 + 3 + 7 = 12 (AT-CRITERIO-SUMA) |
| 3 | Mira solo la última cifra, como con el 2 y el 5: 7 = 4 + 3 (AT-CRITERIO-ULTIMA) |
| 2 | Suma las dos últimas cifras en vez de leerlas como 37: 3 + 7 = 10 (AT-CRITERIO-MEZCLA) |

**Idea 4.** «Si sigue duplicando el pedido, el día 50 tendrá 2⁵⁰ caramelos. ¿Cuántos sueltos quedan con bolsitas de
7?» Datos: 1 bolsita = 7 caramelos; los sueltos de los días 1 a 6 fueron 2, 4, 1, 2, 4 y 1.

| Opción | Qué mide |
| --- | --- |
| 4 | Correcta: el ciclo mide 3; 50 = 3 × 16 + 2, toca el segundo del ciclo |
| 2 | Responde el lugar en el ciclo (el resto de 50 entre 3), no lo que hay en ese lugar (AT-CICLO-LUGAR) |
| 1 | Cree que un exponente grande siempre cae al final del ciclo (AT-CICLO-FIN) |
| No se puede saber sin calcular 2⁵⁰ | No usa el ciclo (AT-POTENCIA-ENTERA) |

**Idea 5.** «¿Qué resto deja 415 al dividirlo entre 7?» Datos: 10 = 7 + 3; 100 = 7 × 14 + 2. El juego solo usó el 11.

| Opción | Qué mide |
| --- | --- |
| 2 | Correcta: 5 × 1 + 1 × 3 + 4 × 2 = 16 = 7 × 2 + 2 |
| 3 | Suma las cifras, como con el 9: 4 + 1 + 5 = 10 (AT-CRITERIO-SUMA-7; el código de la idea 3 no se repite) |
| 1 | Alterna los signos, como con el 11: 5 − 1 + 4 = 8 (AT-CRITERIO-ALTERNA) |
| 16 | Pesa bien y no reduce (AT-PESO-SIN-REDUCIR) |

**Idea 6.** «¿De cuántas maneras se pueden pagar S/ 40 justos con monedas de S/ 2 y de S/ 5? Puede faltar una de las
dos.» Datos: las monedas valen S/ 2 y S/ 5; se pagan S/ 40. El juego pidió una sola manera de pagar S/ 23.

| Opción | Qué mide |
| --- | --- |
| 5 | Correcta: las de S/ 5 van de dos en dos: 0, 2, 4, 6 u 8 |
| 9 | Cuenta toda cantidad de monedas de S/ 5, de 0 a 8, sin ver si lo que falta es par (AT-DIOF-TODAS) |
| 3 | Exige las dos monedas: deja fuera «todas de S/ 2» y «todas de S/ 5» (AT-DIOF-CERO) |
| 8 | Divide el total entre una moneda: 40 ÷ 5 (AT-DIOF-DIVIDE) |

Los códigos nuevos van al informe de aritmética, en una tabla «Divisibilidad» que hoy falta, como hipótesis. Ningún
ejemplo del glosario ni de «Lee» usa los números de estas predicciones ni resuelve su situación (auditorías de
Numeración, M1, y de Las cuatro operaciones, M5).

---

## 5. Lo que tiene que decir cada regla y adónde llega «Ahora tú»

| Idea | La regla dice | «Así se resuelve» (distinto de «Ahora tú») | «Ahora tú», hasta nivel examen |
| --- | --- | --- | --- |
| 1 | N = d̊ si N = d × k, con k entero (no sobra nada); entonces d es divisor de N. Los múltiplos de d van de d en d; del 1 al N hay tantos como el cociente entero de N ÷ d. El 0 es múltiplo de todos; todo número lo es de 1 y de sí mismo | cuántos múltiplos de d hay en un tramo (los de hasta el final menos los de antes del principio) | cuál de cuatro pedidos se empaca sin sueltos; el mayor múltiplo de dos cifras; premios de una rifa; múltiplos de dos o de tres cifras; **«3 de cada 8»: el total tiene que ser múltiplo (2019-I)** |
| 2 | d̊ ± d̊ = d̊; k × d̊ = d̊; (d̊ + r) + (d̊ + s) = d̊ + (r + s); (d̊ + r) × (d̊ + s) = d̊ + r × s; al final se vuelve a empacar. d̊ + r = d̊ − rₑ, con r + rₑ = d. Un múltiplo de 6 lo es de 3; al revés, no siempre | el resto de una suma de tres pedidos | resto de un producto; de una resta; «le faltan 2 para otra bolsita» **(2023-II, trampa 18)**; el resto de N² y de 3 × N + 5 conociendo el de N |
| 3 | Entre 9 y 3: el resto de N es el de la suma de sus cifras. Entre 2 y 5: el de la última cifra; entre 4 y 25: el de las dos últimas; entre 8 y 125: el de las tres últimas. Entre 6: par y múltiplo de 3 | el resto de un número de 5 cifras entre 9 y entre 4, con la tabla de envases | la cifra oculta para que a̅b̅c̅ sea 9̊; el menor número que se agrega para tener un 4̊; **cifras ocultas con 9 (2023-II)**; múltiplos de 25 y de 8 |
| 4 | Los restos de a, a², a³… se repiten en un ciclo; aⁿ deja lo que deja la potencia cuyo exponente es el resto de n entre el largo del ciclo (si ese resto es 0, la última del ciclo). La última cifra de una potencia es su resto entre 10 | el resto de 3ⁿ entre 7 con la tabla del ciclo | última cifra de 7ⁿ; resto de 2ⁿ + 3ⁿ; el día de la semana dentro de 2ⁿ días; (d̊ + r)ⁿ = d̊ + rⁿ |
| 5 | Entre 11: desde las unidades, las cifras se suman y se restan alternando. Entre 7: los pesos 1, 3, 2, −1, −3, −2 desde las unidades; entre 13: 1, −3, −4, −1, 3, 4. Un peso negativo es «lo que falta» | el resto de un número de 5 cifras entre 11 | la cifra que hace 11̊ un boleto; el resto entre 7 de un número de 4 cifras; **cifras ocultas con 7 y 13 (2023-II, 2027-I)**; a̅b̅a̅b̅ es siempre 101̊ |
| 6 | a × x + b × y = c con x, y enteros: se toma el resto de los dos lados entre a (o entre b), se halla una solución y las demás van de b en b para x y de a en a para y. Si a y b son múltiplos de un mismo número y c no, no hay solución. Con cantidades (monedas, boletos) solo valen las que no son negativas | una compra con dos precios: todas las maneras | cuántas maneras; la manera con menos monedas; **dos artículos con gasto fijo (2023-II, RM)**; cuándo es imposible |

---

## 6. Tabla de letras y símbolos

| Símbolo | Un solo significado en la unidad | Aviso |
| --- | --- | --- |
| N | el número que se estudia | Es el dividendo, que en Las cuatro operaciones se llamó D. Aquí va N, como en el examen (N = 7̊ + 3); D no se usa en esta unidad |
| d | el divisor: lo que lleva una bolsita | Igual que en Las cuatro operaciones. Hoy es m, que choca con nada, pero n (la base de la rama) quedaba al lado |
| d̊ (7̊) | «múltiplo de d»: un número que es d por un entero | **Notación nueva en la app**: `{ mult }` en `nucleo/ecuacion.js`, un circulito sobre el número, como en el examen. Se presenta en «Lee» de la idea 1 y se lee «múltiplo de 7». 7̊ + 3 es «un múltiplo de 7, más 3» |
| k | el entero que multiplica: N = d × k (las bolsitas llenas cuando no sobra nada) | Con resto se usa q, el cociente de Las cuatro operaciones: N = d × q + r |
| q, r, rₑ | cociente, resto por defecto (sobran) y resto por exceso (faltan) | Los de Las cuatro operaciones; rₑ con subíndice de verdad |
| ≡ (mód d) | «dejan el mismo resto entre d» | Solo una tarjeta de «Lee» en la idea 2 y el glosario: es la escritura de los libros; los ejercicios usan d̊ + r |
| a̅b̅c̅, ☐ | numeral de cifras a, b, c (con raya); una cifra borrada | Como en Numeración y Las cuatro operaciones. a, b y c son siempre cifras, nunca coeficientes |
| × | multiplicar | Nunca «·» |
| x, y | las dos incógnitas de la idea 6 (cuántas monedas de cada clase) | Los coeficientes van con números (2x + 5y = 23); en la regla, «el número que multiplica a x» |
| la base y el exponente de una potencia | van con números (2⁵⁰) o en palabras | Ninguna letra: n es la base de numeración en la rama, y a es una cifra |
| mcd(a, b), L, s, «a ≡ r» | **salen** | El MCD es de la unidad MCD y MCM |

---

## 7. Mapa de colores por magnitud (§5b)

El mismo criterio de Numeración y de Las cuatro operaciones: lo que cada cosa es en el puesto. Un color fijo por
magnitud en las seis ideas, con su prueba en `divisibilidad.test.js`.

| Token | Magnitud | Dónde se ve |
| --- | --- | --- |
| `i` turquesa | el envase: el divisor d (lo que lleva una bolsita), el número bajo el circulito de d̊, los boletos premiados (los múltiplos de d) y el 10, 100, 1 000 de cada envase en los criterios | el contorno de la bolsita, «1 bolsita = 7 caramelos», el aro del boleto premiado |
| `o` naranja | lo que sobra: el resto r, los sueltos; también el resto de cada sumando, de cada envase (el peso de un lugar) y de cada potencia | los caramelos sueltos, la columna de restos del ciclo, el peso bajo cada cifra |
| `f` violeta | lo que se busca y no es un resto: cuántos múltiplos hay, el número o el múltiplo que se pide, la cifra oculta, las incógnitas x e y; y el resto por exceso rₑ (lo que falta), como en Las cuatro operaciones | el recuadro de respuesta, los huecos punteados, la cifra hallada |
| tinta | N cuando se da, k y q, las cifras conocidas, los exponentes, los caramelos dibujados, «?» y la cifra borrada | — |
| verde, carmín | **no se usan** | el carmín es de ángulos; el verde se pierde junto al naranja |

Avisos:
- **La respuesta lleva el color de su magnitud**: si se pide un resto, naranja; si se pide cuántos hay o qué número es,
  violeta. Lo pedido va con «?» en tinta hasta comprobar.
- **Un peso negativo es «lo que falta»**: se escribe −1 en naranja (es un resto) y se dice «falta 1»; no se usa el
  violeta de rₑ en los pesos, para que una tabla de pesos tenga un solo color.
- Las ideas viejas (2 a 6, con el resto en carmín y el resultado en verde) se corrigen al rehacerlas, en la fase 3.

Pares que van juntos (medidos en §5b): naranja–turquesa 0,114, naranja–violeta 0,189 y turquesa–violeta 0,101.

---

## 8. Práctica: qué existe y qué falta por idea

**Lo que existe hoy:**
- **Escena `divisores`** («El rectángulo de fichas», borrador 0.1.0, compartida con Números primos): divisores, criba,
  exponentes, criterios, restos y restos potenciales, con 19 casos y papel sin `datos`.
- **`numeros-sucesiones`**: dos tipos para esta unidad, `grupos` (el total tiene que ser múltiplo: es el caso de
  San Marcos 2019-I) y `divisores` (cantidad de divisores: es de Números primos).
- **`rm-diofanticas`** (razonamiento matemático): compras, monedas y cifras con enteros. Sirve de base para la idea 6.
- Ningún ítem en la prueba del curso.

| Idea | Hay | Falta |
| --- | --- | --- |
| 1 Múltiplo | tipo `grupos`; mesa `filas-grandes` | tipos «¿es múltiplo?», «el mayor o el menor múltiplo de k cifras», «cuántos múltiplos hasta N y en un tramo», «el total es múltiplo» |
| 2 Operar con restos | mesa `juntar-sobrantes` | tipos «resto de una suma», «de un producto», «por exceso» (trampa 18), «resto de una expresión» |
| 3 Criterios | pasos de la escena | tipos «resto con la suma de cifras», «con las últimas cifras», «cifra oculta con 9, 3, 4 u 8» |
| 4 Restos potenciales | mesa `ciclos-largos`; casos de la escena | tipos «resto de una potencia», «última cifra», «suma de potencias» |
| 5 El 11, el 7 y el 13 | — | tipos «resto entre 11», «entre 7», «cifra oculta con 11», «dos cifras ocultas con 7 y 13» |
| 6 Diofánticas | `rm-diofanticas` | tipos «una solución», «cuántas maneras», «la de menos monedas», «¿se puede?» |

Fase 3: una plantilla nueva de formato `predicciones`, `plantillas/divisibilidad-restos/`, con generador por idea
(`TIPOS_POR_IDEA`), prueba en 400 semillas, `casos.json` verificado aparte y papel de 5 a 10 por idea con sus datos. El
tipo `divisores` de `numeros-sucesiones` queda solo para Números primos. La escena `divisores` va a «Más mesas del tema»
(`"rehacer": true`). Dos ítems nuevos para la prueba del curso (conteo de múltiplos y cifra oculta con 9), sin tocar los
pares de otras unidades.

---

## 9. Datos del mundo

La unidad casi no los necesita: el puesto, la rifa y las monedas son situaciones de problema.

| Dato | ¿Fuente? |
| --- | --- |
| Caramelos, bolsitas de 2 a 9, pedidos de 12 a 64, boletos del 1 al 50 o al 100 | Valores de problema, sin fuente. Posibles: una rifa de promoción vende de 50 a 500 boletos |
| Monedas de S/ 2 y S/ 5; billetes de S/ 10 y S/ 20 | Denominaciones vigentes del BCRP: de todos los días, sin fuente. No se usa ninguna moneda que no exista (no hay de S/ 3 ni de S/ 4) |
| La semana de 7 días (qué día cae dentro de tantos días) | De todos los días |
| Historia: Gauss y las *Disquisitiones Arithmeticae*, 1801 | Ya trae fuente (MacTutor, biografía de Gauss); se queda |

---

## 10. Riesgos de orden con otras unidades (`requiere`)

- **`requiere: ['aritmetica.cuatro-operaciones']` es correcto y basta.** De ahí se usan «múltiplo», «divisor»,
  «división exacta», D = d × q + r y el resto por exceso; de Numeración (que esa unidad pide), la descomposición de un
  numeral y las potencias de 10.
- **MCD y MCM recibe 9 preguntas de San Marcos** que el CSV clasifica en Divisibilidad (los restos con varios
  divisores y la inclusión y exclusión). Cuando se rehaga esa unidad, su propuesta tiene que recogerlas: una idea
  «El mismo resto con varios divisores» después de `mcm-coinciden`. Aquí queda lista la mitad que no necesita el MCM:
  escribir «sobran r» o «faltan k» como d̊ + r o d̊ − k (idea 2).
- **Glosario.** «máximo común divisor» se estrena hoy aquí y es de MCD y MCM: se muda cuando se rehaga la idea 6
  (hay que tocar `mcd-y-mcm.js`). «congruencia», «módulo», «restos potenciales», «ciclo», «exponente», «criterio de
  divisibilidad», «ecuación diofántica» y «coeficiente» se quedan. «número primo» sigue siendo de Lógica.
- **Números primos y divisores** usa los restos potenciales (su idea `fermat-wilson`) y los criterios (la criba): los
  dos quedan antes, bien. Su idea 1 arma rectángulos con los divisores de un número: por eso aquí no se cuentan
  divisores ni se habla de primos.
- **Potenciación** usa criterios de exclusión con las últimas cifras: los da la idea 3.
- **La notación d̊** es nueva en `nucleo/ecuacion.js` (archivo compartido): un bloque propio, `{ mult }`, que no cambia
  nada de lo que ya existe.
- **La escena vieja** enseña la cantidad de divisores y la criba, que no son de esta unidad: va a «Más mesas».

---

## 11. Decisiones tomadas (Gerson revisa después)

1. **Los restos con varios divisores («MCM × k + r») y la inclusión y exclusión no entran aquí: van a MCD y MCM.**
   Motivo: necesitan los múltiplos comunes, que el árbol presenta dos unidades después (contrato, punto 9), y la
   consigna de esta etapa es no adelantar contenido a esas unidades. Descartado: una idea 7 aquí, con `septimaIdea` y el
   MCM dado como dato en cada ejercicio (como Vectores recibe CA = H × cos θ). **Es la decisión que más conviene que
   mires**: son 9 de las 15 preguntas de San Marcos del tema.
2. **Seis ideas, con los criterios en dos** (`criterios`: últimas cifras y suma; `criterios-pesos`, nueva: 11, 7 y
   13). Motivo: es el subtema con más fichas de academia (44 de 131) y el de las cifras ocultas de San Marcos.
   Descartado: una sola idea de criterios con diez divisores en su regla.
3. **Los restos potenciales van antes del 11, el 7 y el 13.** Motivo: los pesos del 7 son los restos de las potencias de
   10; así el criterio se entiende y no se memoriza. Descartado: el orden actual (potencias antes de todo criterio).
4. **Notación del examen: el múltiplo con circulito (7̊ + 3), con `{ mult }` nuevo en `nucleo/ecuacion.js`.** La
   congruencia (≡) queda como una tarjeta de «Lee» y un término del glosario. Motivo: «letras como en el examen».
   Descartado: seguir con a ≡ r (mód m) en toda la unidad, o escribir siempre «múltiplo de 7» en palabras.
5. **N para el número y d para el divisor.** Motivo: es la letra del examen, y D junto a d̊ se confunde. Descartado:
   seguir con D, la de Las cuatro operaciones (queda un aviso en la tabla de letras).
6. **Colores: el resto en naranja también cuando es lo que se pide; el violeta para lo que se busca y no es un resto
   (cuántos, cuál, la cifra oculta, x e y) y para rₑ.** Motivo: un color fijo por magnitud, y el resto ya era naranja
   en la unidad anterior. Descartado: el resto en violeta «porque es lo que se busca casi siempre».
7. **El mundo: el puesto (ideas 1 a 4), la rifa (1, 2 y 5) y las monedas de S/ 2 y S/ 5 (6).** Piezas de prueba nuevas:
   `arit-boletos` (hecha con la idea 1) y `arit-monedas` (fase 3). Descartado: seguir con fichas en filas y tablas.
8. **La idea 6 se enseña sin el MCD**: con restos y, para decir cuándo no hay solución, «los dos coeficientes son
   múltiplos de un mismo número y el total no». Descartado: la regla «mcd(a, b) divide a c» (la de hoy).
9. **En la idea 1, el conteo de múltiplos es parte de la regla** (del 1 al N hay tantos como el cociente entero), y la
   predicción es de eso, con la rifa. Descartado: la predicción de hoy (91 en filas de 7), que tenía un solo código.
10. **Los ejemplos de nivel 3 llevan cinco alternativas, A a E**, como pide el encargo de la etapa (Las cuatro
    operaciones lleva cuatro). Si prefieres cuatro, se quita la última de cada uno sin tocar los resueltos.
11. **Ficha del catálogo (fase 3):** temas «Múltiplos y divisores», «Principios de la divisibilidad» (hoy «Teoremas de
    la divisibilidad»), «Criterios de divisibilidad», «Restos potenciales» y «Ecuaciones diofánticas lineales»;
    `investigacion` apuntando al informe de aritmética, con la tabla de códigos; `requiere` y `grado` sin tocar. Hoy la
    ficha no cambia: la idea nueva usa el tema «Criterios de divisibilidad».
12. **Mientras se rehacen, las ideas 2 a 6 quedan con su contenido viejo en el orden nuevo**, y `criterios-pesos`
    entra como esqueleto válido (el 11 y el 7 con la tabla de pesos de hoy). La unidad no lleva `calidad: 2` todavía.

---

## 12. Fase 3 (19 nov): lo que se hizo y lo que se decidió de paso

Las seis ideas quedaron escritas con sus 15 ejemplos y sus pruebas propias (`divisibilidad.test.js`: colores, misión
única, predicción, «Ahora tú» en 400 semillas y los 90 ejemplos, todo contra cuentas aparte con BigInt y fuerza bruta).
El validador con `calidad: 2` simulada no marca nada; la unidad sigue sin la marca.

13. **Práctica: `plantillas/divisibilidad-restos`** («El puesto de los restos», 26 tipos en las seis ideas, de nivel 1 a
    examen, con 26 casos verificados aparte en Python y 8 de papel). Va primera en la ficha; `numeros-sucesiones` queda
    solo con `grupos` (la cantidad de divisores es de Números primos) y la escena `divisores` pasa a «Más mesas del tema»
    solo en esta unidad (`"rehacer": ["aritmetica.divisibilidad"]`). Su papel dice ahora de qué unidad es cada problema.
14. **La prueba del curso no cambia**: ya tiene sus diez pares. Los dos de esta unidad (ari-31, conteo de múltiplos en un
    tramo; ari-32, cifra oculta con 9) quedan en la reserva con su verificador. Descartado: sacar otro par para meterlos.
15. **Restos potenciales en «Ahora tú» y en la práctica: ciclos de 3 a 6 restos.** Con 10 o 12 la tabla no los muestra
    enteros y la solución no cabe. Descartado: aceptar cualquier ciclo.
16. **La predicción de la idea 2 se dibuja a escala 1,7** (antes 0,8, la del juego): con 4 caramelos el mostrador quedaba
    casi vacío. Cambia el tamaño entre el juego y la predicción. Descartado: una sola escala para toda la idea.
17. **Las mesas del laboratorio hablan del largo de la fila**, no de «m» ni de «a + b»: las letras de la unidad son N y
    d. Descartado: dejar las letras viejas en las invitaciones.
