# Propuesta de ideas: «Sistemas de numeración» (`aritmetica.numeracion`)

Etapa 3 del plan de calidad, rama «Números y operaciones» (la de entrada de Aritmética) · fase 1
(`docs/metodo/unidad/1-ideas.md` §A) · 17 nov 2026

Gerson: esto es solo la propuesta. No se escribe nada hasta que la apruebes o la corrijas. Las preguntas que solo tú
puedes contestar están al final (sección 9), cada una con mi recomendación.

Lo que leí: `CLAUDE.md`, `docs/plan-calidad.md` §3 y §7, `docs/molde-unidad.md` (con §5b reescrito), `docs/etapa2/decisiones.md`
con sus «Cambios posteriores», las tres propuestas de la Etapa 2, la teoría actual (`contenido/teoria/aritmetica/numeracion.js`),
su ficha en `catalogo/cursos/aritmetica.json`, las dos plantillas que la cubren (`plantillas/numeracion/`, escena, y
`plantillas/numeros-sucesiones/`, generador), el informe `docs/investigacion/aritmetica-razonamiento-ideas-erroneas.md`, las
trampas de `docs/clasificacion/trampas-admision-unmsm/aritmetica-algebra.md`, la matriz `docs/teoria/matriz/aritmetica.json`
(unidad 11), `docs/temario-completo.md` §11, las preguntas de `docs/datos/admision-unmsm.csv`, la prueba
`catalogo/pruebas/aritmetica.json`, la auditoría de trigonometría y, como nivel, las unidades ya rehechas (vectores,
razones trigonométricas, materia y energía, tema e idea principal).

## Qué se pregunta en los exámenes

`docs/taxonomia-*.md` no traen aritmética. La UNI la pone en las semanas 11 y 12 y San Marcos en su tema 4 (catálogo). En
`docs/datos/admision-unmsm.csv` hay **9 preguntas de San Marcos** clasificadas en esta unidad, más una vecina:

| Periodo (pregunta) | Qué piden | Idea |
| --- | --- | --- |
| 2019-I (43) | El mínimo de envases de capacidades que son potencias de una base para guardar una cantidad: cambio de base | 3 |
| 2021 (33, examen del 4 set.) | Agrupaciones sucesivas de 8 en 8: el total es un numeral en base 8 con cifras ocultas | 3 y 4 |
| 2021 (33, examen del 11 set.) | Numerales de cifras repetidas (a̅a̅, b̅b̅b̅) ligados por una fracción; el mayor valor de otro numeral | 2 |
| 2022 (31, 13 mar.) | Pasar un número de base 10 a otra base por divisiones sucesivas y sumar sus cifras. Trampa: restos al revés | 3 |
| 2022 (31, 19 mar.) | Un numeral con cifras que dependen de un parámetro: cuántos valores dan cifras válidas | 4 |
| 2023-II (31) | Numerales en bases distintas con cifras desconocidas: acotar cada cifra por su base y sumar en base 10 | 4 |
| 2024-II (33) | Tiempos de grifos escritos en otras bases con cifras ocultas (acotar) y trabajo conjunto | 4 (y fracciones) |
| 2025-I (31) | El mayor numeral de tres cifras en una base desconocida, con la suma de cifras dada; pasarlo a base 10 | 4 |
| 2026-II (31) | Las bases en que un número se escribe con tres cifras: acotar entre potencias | 5 |
| 2024-I (33), en potenciación | Cubos perfectos que tienen k cifras en otra base | 5 (vecina) |

Lo que más pesa en San Marcos es **acotar cifras por la base y hallar una base desconocida** (5 de 9). El conteo de páginas
no salió ninguna vez, pero el banco Cuzcano sí lo trae (unas 244 fichas de la unidad: base desconocida 37, conteo en otras
bases 34, conteo de números 28, conteo de cifras 26, descomposición 23).

---

## 0. Diagnóstico de la teoría actual contra el contrato

`numeracion.js` (v0.2.0, `estado: 'completa'`, sin `calidad: 2`) tiene 4 ideas: `agrupar`, `descomposicion`, `cambio-base`
y `conteo-cifras`, y tres mesas (`bloques-base` en 3D, `canje-amplio`, `libros-largos`) con retos que el motor comprueba.
La base está bien: la base como regla de canje con fichas que se agrupan, el mismo numeral 132 en varias bases, la tabla de
divisiones y las dos tiras de páginas y cifras a la misma escala.

1. **Punto 1: ninguna primera pantalla tiene un objeto.** Fichas sueltas, tablas y tiras: diagramas. La feria de Juliaca y
   los chuños solo aparecen escritos en «Lee». En el kit no hay ninguna pieza de objeto para aritmética.
2. **Puntos 2, 3 y 12: no hay `mision`, `leyenda`, `aprendizaje`, `actividad` ni `pregunta`.** Las consignas describen
   botones («Elige cuántas fichas hay y la base»).
3. **Punto 13: no hay `datos` en ningún ejercicio** ni en el papel; la división con resto y las potencias se usan sin
   darse. No hay ejemplos resueltos (0 de 60). El glosario trae 8 términos sin `simple` y con 0 o 1 ejemplo.
4. **Punto 9: el orden falla.**
   - La idea 1 ya escribe «13 = (23)₅» en la figura, pero cómo se escribe la base se explica recién en el «Lee» de la idea 2.
   - «¿Cuántos números de k cifras hay?» (idea 4) se resuelve con el principio de multiplicación («multiplico las opciones
     de cada lugar»), que es de `analisis-combinatorio`, otra rama.
5. **Regla 3: dos predicciones ya se vieron o se regalan.**
   - Idea 3: el juego muestra la tabla y la lectura escribe el numeral; la predicción pregunta en qué orden se leen los
     restos. Además, el título de la idea, «Restos leídos de abajo arriba», es la respuesta.
   - Idea 2: el juego pasa 132 por las bases 5 a 9 y la predicción pide 132 en base 4: es el mismo cálculo.
6. **Códigos repetidos.** La predicción de la idea 1 tiene dos incorrectas con AT-CIFRA-B (el «3» ni siquiera es ese error)
   y la de la idea 4, dos con AT-BLOQUE.
7. **Punto 7.** La lectura de la idea 2 da un número suelto («(132)₅ = 42») y la de la idea 4 también («se usan 492
   cifras»). Las reglas de las ideas 3 y 4 y el «Lee» de la 4 separan dos relaciones con «·»: «z − a + 1 · 30 − 20 + 1 =
   11» se lee como una igualdad falsa.
8. **§5b: colores por papel viejo y carmín fuera de lugar.** b naranja, cifras turquesa, restos en carmín (el color de los
   ángulos) y el valor en base 10 en verde (el tercer dato), cuando es lo que más se pide. La escena `numeracion` tiene otra
   paleta (un color por orden, N azul, b fucsia) y la mesa 3D usa naranja para «se puede canjear».
9. **«Así se resuelve» es el generador de «Ahora tú» con la semilla + 900**, y «Ahora tú» no llega a examen: no hay cifras
   ocultas, acotar ni base desconocida (lo que más pregunta San Marcos), ni numerales con letras (a̅b̅c̅).
10. Detalles: la cabecera dice «postulante de 3.º», la ficha dice `grado: 3` y la notación es distinta en cada lugar: la
    teoría escribe (132)₄; la escena, la prueba y el generador, 342₍₆₎ y a̅b̅₍₅₎ (pregunta 2).

---

## 1. Las ideas, en orden

Propongo **cinco**. Las cuatro de hoy conservan su `id`, y también las mesas y sus controles (`n`, `b`, `P`, `u`, `d`, `c`,
`m`). La cuarta es nueva.

| # | `id` | Título (≤ 6 palabras) | `aprendizaje` |
| --- | --- | --- | --- |
| 1 | `agrupar` | Agrupar de n en n | En base n, cada n de un orden forman 1 del orden siguiente: por eso las cifras van de 0 a n − 1 y la cifra n no existe. |
| 2 | `descomposicion` | Cada cifra vale según su lugar | Un numeral vale la suma de cada cifra por la potencia de la base de su lugar; las mismas cifras valen distinto en otra base. |
| 3 | `cambio-base` | De base 10 a otra base | Para pasar N a base n se divide entre n hasta que el cociente sea 0; el primer resto es la cifra de las unidades y el último, la primera. |
| 4 | `base-desconocida` (nueva) | La base que no se ve | Si un numeral vale un número conocido, la descomposición da una ecuación en n; la base es mayor que cada cifra, y eso acota las cifras ocultas. |
| 5 | `conteo-cifras` | Contar cifras por bloques | Los números de k cifras en base n van de nᵏ⁻¹ a nᵏ − 1; las cifras se cuentan bloque por bloque: cuántos números por cuántas cifras. |

`pregunta` (Resumen): 1 «¿Por qué en base 5 no existe la cifra 5?» · 2 «¿Por qué 132₍₄₎ no es ciento treinta y dos?» ·
3 «¿Cómo se escribe un número en otra base?» · 4 «¿Cómo se halla una base que no te dan?» · 5 «¿Cuántas cifras gasta
numerar del 1 al N?».

`actividad`: 1 «Empacar caramelos en bolsitas de un mismo tamaño y leer la etiqueta.» · 2 «Cambiar el tamaño de la
bolsita y ver cuántos caramelos tiene un mismo pedido.» · 3 «Empacar 75 caramelos ronda por ronda hasta no poder juntar
más.» · 4 «Probar tamaños de bolsita hasta que la etiqueta cuadre con la bolsa.» · 5 «Correr el último boleto de una rifa
y ver cuántas cifras gasta la imprenta.»

**Por qué va cada una ahí y qué da por sabido**

1. **Agrupar.** Es la raíz: base, cifra y numeral se usan en las otras cuatro. Aquí se presenta también la escritura
   43₍₅₎ (hoy llega en la idea 2: punto 9). Da por sabido contar y el valor posicional de base 10 (primaria). Estrena:
   base, cifra, numeral, orden.
2. **Descomposición.** Necesita «base» y «cifra». Estrena la potencia como dato (5² = 5 · 5 = 25: «una caja son 5 bolsitas
   de 5»), porque `potenciacion-y-radicacion` llega después en la misma rama, y el numeral con letras (a̅b̅c̅₍ₙ₎: la raya dice
   que son cifras, no un producto), que usan las ideas 4 y 5 y casi todo el examen. Estrena: valor posicional, potencia,
   descomposición polinómica.
3. **Cambio de base.** Necesita la 2 para comprobar «de vuelta» y para pasar entre dos bases que no son 10. La división con
   resto va en «Lee» y en `datos` (17 = 5 · 3 + 2), porque `cuatro-operaciones` viene después y pide esta unidad. Estrena:
   cociente, resto, cambio de base.
4. **Base desconocida (nueva).** Junta la 1 (cada cifra < n, la primera ≠ 0) con la 2 (la ecuación). No usa la 3, pero va
   después porque cierra las tres incógnitas (cifras, valor y base). Es lo que más pregunta San Marcos y el subtema con más
   fichas del banco; hoy solo está en la escena (paso 6). Estrena: base desconocida, cifra oculta, acotar.
5. **Conteo.** Usa la 1 (la primera cifra no es 0) y la 2 (100…0₍ₙ₎ = nᵏ⁻¹). Cuenta los números de k cifras con «de a
   hasta z hay z − a + 1» (dato), no con el principio de multiplicación (punto 9). Su nivel examen trae San Marcos 2026-II.
   Estrena: bloque, cantidad de cifras.

**Qué no entra** (pregunta 7): parte fraccionaria en otras bases (está en la matriz, no en el catálogo); sumar y
multiplicar en otras bases (es tema de `cuatro-operaciones`); capicúas (piden el principio de multiplicación); pasar de
base 2 a base 8 agrupando de a 3 (va al laboratorio).

---

## 2. Objeto de la primera pantalla

Un solo hilo para toda la unidad: **el puesto de doña Juana en el mercado de Juliaca, que empaca caramelos.** Se juntan n
caramelos sueltos en una bolsita, n bolsitas en una caja y n cajas en un cajón; nunca deja n de algo sin juntar. Cada
pedido lleva su etiqueta: 2 bolsitas y 3 sueltos se anotan 23₍₅₎. Es una regla de juego, no de la vida: «Lee» la presenta
con su dibujo (punto 6). El dinero (10 monedas de S/ 1 por un billete de S/ 10) sirve de puente con la base 10.

| Idea | Objeto (primera tarjeta de «Lee» y juego) | Qué es cada cosa |
| --- | --- | --- |
| 1 | El puesto con caramelos sueltos, bolsitas y la etiqueta del pedido | bolsita = n caramelos; etiqueta = numeral; sueltos = cifra de las unidades |
| 2 | Un **quipu**: cuerdas con nudos en niveles (unidades abajo, decenas, centenas), donde un nivel vacío es un 0. Después, el mismo pedido «132» en puestos con bolsitas de distinto tamaño | nivel = lugar; nudos = cifra; el tamaño de la bolsita cambia lo que vale cada lugar |
| 3 | Doña Juana empaca 75 caramelos sueltos con la menor cantidad de envases (como San Marcos 2019-I) | cada ronda de empaque = una división; lo que sobra = un resto = una cifra |
| 4 | Una bolsa cerrada de un puesto vecino: la etiqueta dice 23 y adentro hay 17 caramelos; no se sabe su tamaño de bolsita | etiqueta = numeral; bolsa = N; tamaño de bolsita = la base que falta |
| 5 | **El talonario de una rifa pro fondos de la promoción**, con boletos numerados del 1 al N, en la imprenta | boletos = números; cifras impresas = lo que se cuenta |

Piezas nuevas, dibujadas por la sesión como prueba (`data-prueba`, con su prueba numérica de encuadre y rótulos; molde §6):
`arit-puesto` (caramelos, bolsita, caja, cajón y etiqueta), `arit-quipu` y `arit-talonario`. Las piezas `arit-fichas`,
`arit-tabla` y `arit-tiras` quedan para «Mira» y los ejemplos, al lado del objeto.

---

## 3. Misión de «Juega» (meta que el motor comprueba)

| Idea | Contexto + misión | Controles | `logrado` | Lectura en vivo (enuncia una relación) | `bien` |
| --- | --- | --- | --- | --- | --- |
| 1 | «Doña Juana junta los caramelos en bolsitas iguales.» **Con bolsitas de 6, arma un pedido que se anote 40₍₆₎.** | `n` caramelos, 5–24; `b` (se muestra «n»), 5–9; se arrastra el borde de la bolsita. Solo dos órdenes (N < n²) | `val.b === 6 && val.n === 24` | «24 caramelos = 4 bolsitas de 6 + 0 sueltos → 40₍₆₎» | «Listo: 4 bolsitas de 6 son 24, y el 0 dice que no quedó ningún suelto.» |
| 2 | «La etiqueta dice 132: 1 caja, 3 bolsitas y 2 sueltos.» **Con la bolsita más chica posible, haz que el pedido tenga más de 50 caramelos.** | `b`, 4–9 (con 3, la cifra 3 no existe); el numeral 132 queda fijo | `val.b === 6` (132₍₅₎ = 42; 132₍₆₎ = 56) | «132₍₆₎ = 1 caja de 36 + 3 bolsitas de 6 + 2 sueltos = 56 caramelos» | «Con bolsitas de 6 la caja ya tiene 36: el mismo 132 vale más con una base mayor.» |
| 3 | «Hay 75 caramelos sueltos y bolsitas de 4.» **Empaca ronda por ronda hasta que ya no se pueda juntar nada.** | `n`, 20–99; `b`, 2–9; `ronda`, 0 a 7 (nuevo) | `val.n === 75 && val.b === 4 && val.ronda === 4` | Ronda 2: «18 bolsitas = 4 cajas de 4 bolsitas + 2 bolsitas sueltas» | «1 cajón, 0 cajas, 2 bolsitas y 3 sueltos: 75 = 1023₍₄₎.» |
| 4 | «La etiqueta dice 23 y en la bolsa hay 17 caramelos.» **Encuentra el tamaño de bolsita con el que la etiqueta cuadra.** | `b`, 4–9 (con 3, la cifra 3 no existe) | `val.b === 7` | «23₍₆₎ = 2 bolsitas de 6 + 3 = 15: faltan 2 para 17» | «2 bolsitas de 7 y 3 sueltos son 17: la bolsita es de 7.» |
| 5 | «La imprenta cobra por cifra, y la promoción pagó 492 cifras.» **¿Hasta qué boleto alcanza? Corre el último boleto.** | `P` (se muestra «N»), 120–400, de 10 en 10; se arrastra el final del talonario | `totalCifras(val.P) === 492` (N = 200) | «Del 1 al 200: 9 + 180 + 303 = 492 cifras; cada boleto de tres cifras gasta 3» | «Hasta el boleto 200: los de tres cifras se llevan 303 de las 492.» |

Ningún `bien` dice la respuesta de su predicción (auditoría de trigonometría, M4). En la 1 el juego no llega a tres órdenes
y en la 5 no baja de 120: la predicción queda fuera de lo que se jugó.

---

## 4. La predicción de cada idea

La app baraja las opciones. `datos` lleva solo valores y equivalencias, nunca la fórmula. **No hay estudios con cifras
sobre errores de numeración** (lo dice el informe de aritmética). Por eso todo código AT es una hipótesis. Algunos los
respaldan las trampas que se dedujeron de las alternativas de San Marcos (trampa 23: «cifra igual o mayor que la base,
primera cifra cero, restos en el orden equivocado», 5 preguntas; trampa 24: «poste y valla», 7). Ninguna predicción repite
un código.

**Idea 1.** «Doña Juana tiene un pedido anotado 44₍₅₎: 4 bolsitas y 4 sueltos. Le llega un caramelo más. ¿Cómo queda la
etiqueta?» Datos: bolsita, 5 caramelos; caja, 5 bolsitas.

| Opción | Qué mide |
| --- | --- |
| 100₍₅₎ | Correcta: los 5 sueltos forman una bolsita y las 5 bolsitas, una caja |
| 45₍₅₎ | Deja 5 sueltos sin juntar: la cifra igual a la base (AT-CIFRA-B; trampa 23) |
| 50₍₅₎ | Junta una vez y no sigue: 5 bolsitas sin juntar (AT-LLEVA-UNA, hipótesis nueva; caso 11 de la escena) |
| 40₍₅₎ | Pone 0 y pierde la bolsita nueva (AT-PIERDE, hipótesis nueva) |

**Idea 2.** «En el puesto de bolsitas de 5, un pedido se anota 203₍₅₎. ¿Cuántos caramelos son?» Datos: bolsita, 5
caramelos; caja, 5 bolsitas = 25 caramelos. El juego nunca mostró un 0 en medio.

| Opción | Qué mide |
| --- | --- |
| 53 | Correcta: 2 · 25 + 0 · 5 + 3 |
| 203 | Lee el numeral en base 10 (AT-DECIMAL: el «error objetivo» de la matriz) |
| 77 | Da la potencia mayor a la cifra de la derecha: 3 · 25 + 2 (AT-ORDEN) |
| 13 | Se salta el 0 y corre los lugares: lo lee como 23₍₅₎ (AT-CERO-LUGAR, hipótesis nueva) |

**Idea 3.** «Ahora sin caramelos, solo la tabla. Al pasar 19 a base 3, los restos salen 1, 0 y 2, en ese orden. ¿Cómo se
escribe 19 en base 3?» Datos: los restos en el orden en que salen, 1, 0 y 2; los cocientes, 6, 2 y 0. El juego empieza en
20 y muestra caramelos, no la lista de restos: se pregunta si el orden pasa del objeto a la tabla.

| Opción | Qué mide |
| --- | --- |
| 201₍₃₎ | Correcta |
| 102₍₃₎ | Escribe los restos en el orden en que salen (AT-ORDEN; trampa 23 y San Marcos 2022) |
| 62₍₃₎ | Escribe los cocientes (AT-COCIENTE) |
| 19₍₃₎ | Copia el número y solo le pone la base (AT-DECIMAL) |

**Idea 4.** «En otro puesto, la etiqueta 31 tiene 25 caramelos. Una etiqueta 13 del mismo puesto, ¿cuántos tiene?» Datos:
las dos etiquetas son del mismo puesto (la misma bolsita).

| Opción | Qué mide |
| --- | --- |
| 11 | Correcta: 3 · 8 + 1 = 25, así que la bolsita es de 8, y 13₍₈₎ = 8 + 3 |
| 13 | Lee la etiqueta en base 10 (AT-DECIMAL) |
| 8 | Da la base y no lo que se pide (AT-PIDE-BASE, hipótesis nueva) |
| 52 | Cree que invertir las cifras invierte el valor: 25 al revés (AT-INVIERTE, hipótesis nueva) |

**Idea 5.** «La rifa del año pasado tuvo boletos del 1 al 100. ¿Cuántas cifras imprimió la imprenta?» Datos: boletos del 1
al 100.

| Opción | Qué mide |
| --- | --- |
| 192 | Correcta: 9 + 180 + 3 |
| 200 | Todos con dos cifras (AT-BLOQUE) |
| 190 | Del 10 al 99 cuenta 89 y no 90 (AT-CONTEO; trampa 24, «poste y valla») |
| 189 | Se olvida del boleto 100 (AT-ULTIMO, hipótesis nueva) |

Los códigos nuevos van al informe de aritmética como hipótesis, junto con los AT que ya usa la teoría.

---

## 5. Tabla de letras y símbolos

| Símbolo | Un solo significado en la unidad | Aviso |
| --- | --- | --- |
| n | la base | **Cambia** respecto a hoy (b). Los exámenes y libros escriben a̅b̅c̅₍ₙ₎: ahí b es una cifra, y con b como base la letra tendría dos significados (pregunta 1). Los `id` de los controles siguen siendo `b`; solo cambia el rótulo |
| N | el número, la cantidad en base 10 (caramelos, último boleto) | N mayúscula y n minúscula conviven, como en los libros: cada una va siempre con su color y su leyenda. En física, N es el newton (otra unidad) |
| a, b, c, x | cifras que no se conocen | Van dentro de un numeral con raya |
| a̅b̅c̅₍ₙ₎ | numeral de cifras a, b, c en base n | La raya dice «son cifras», no «a · b · c». En álgebra, ab es un producto: se avisa en «Lee» de la idea 2 |
| 342₍₆₎ | numeral en base 6; sin subíndice, base 10 | Hoy la teoría escribe (132)₄ y la escena y la práctica 342₍₆₎ (pregunta 2) |
| q, r | cociente y resto: N = n · q + r, con 0 ≤ r < n | r solo en la idea 3 |
| k | cuántas cifras tiene un número | En trigonometría k es «cuánto vale cada parte»: otra unidad |
| nᵏ, n² | potencias de la base: n² = n · n | Van como dato (la potenciación viene después) |
| z − a + 1 | cuántos números hay de a hasta z | Va escrita en palabras la primera vez; nunca pegada a otra igualdad con «·» |
| d, P | **salen** de lo que ve el alumno | d (cifra genérica de la regla) se reemplaza por letras; P (última página) pasa a ser N |

---

## 6. Mapa de colores por magnitud (§5b)

Un color fijo por magnitud en toda la unidad. Son tres magnitudes: **lo que hay** (la cantidad), **cómo se agrupa** (la
base) y **cómo se escribe** (las cifras).

| Token | Magnitud | Dónde se ve |
| --- | --- | --- |
| `f` violeta | N, la cantidad en base 10 | caramelos de un pedido, la bolsa de la idea 4, el último boleto; es lo que más pide el examen: casi todas las preguntas de San Marcos terminan en un número de base 10 (un valor, una suma o un tiempo) |
| `i` turquesa | n, la base | el contorno de la bolsita, la caja y el cajón (cada uno mide «n del anterior»), el subíndice ₍ₙ₎ y el divisor de la tabla |
| `o` naranja | las cifras: el numeral, cada resto (que es una cifra), k y las cifras impresas de la idea 5 | la etiqueta, la columna de restos y, en la idea 5, lo que se cuenta |
| tinta | cocientes, caramelos sueltos dibujados, números de boleto | — |
| `d` verde | solo la segunda base, al pasar entre dos bases que no son 10 (idea 3) | siempre con su rótulo ₍₇₎; no va junto a una cifra naranja en el mismo trazo |
| `h` carmín | **no se usa** | es de ángulos; hoy pinta los restos |

Pares medidos que se usan juntos (§5b): naranja–turquesa 0,114, naranja–violeta 0,189 y turquesa–violeta 0,101, todos ≥ 0,08.
El verde junto al naranja da 0,010 en protanopía: por eso el verde queda solo para la segunda base, con rótulo.

Avisos:
- La respuesta lleva el color de su magnitud: violeta en las ideas 2 y 4 si se pide N, naranja si se pide un numeral (ideas
  1 y 3) y turquesa si se pide la base (idea 4). En «Predice» y en los ejemplos, lo pedido va con «?» en tinta hasta
  comprobar.
- En la idea 5, naranja es «cifras» (las que se imprimen) y violeta, el último boleto. Es la misma regla, aunque cuenten
  cosas distintas.
- La escena `numeracion` (un color por orden, N azul, b fucsia) y la mesa 3D (naranja = «se puede canjear») quedan
  distintas hasta que se rehagan. La mesa se puede corregir aquí, porque es de esta teoría.

---

## 7. Práctica: qué existe y qué falta por idea

**Lo que existe hoy:**
- **Escena `numeracion`** (borrador 0.1.0, 20 casos verificados aparte, 10 de papel sin `datos`). Su motor (`MotorNumeracion`:
  canjes, numeral normal, llevadas en cadena) sirve para las misiones 1 a 4. Tiene paleta propia.
- **Generador `numeros-sucesiones`** (5 unidades). De esta unidad son solo 3 de sus 11 tipos: `cifras` (a̅a̅/b̅b̅b̅ y
  a̅b̅ + b̅a̅), `grifos` (acotar más trabajo conjunto, que es de fracciones) y `cubos` (potenciación). No lee `opts.unidad`:
  la práctica de numeración sale con sucesiones y divisores. Lleva `datos: ''` en todo.
- Tres mesas de laboratorio y 2 ítems de esta unidad en `catalogo/pruebas/aritmetica.json` (342₍₆₎ y 413₍₇₎ a base 10).

| Idea | Hay | Falta |
| --- | --- | --- |
| 1 Agrupar | mesas `canje-amplio` y `bloques-base`; casos 1, 11, 18 y 19 de la escena | tipos «caramelos a etiqueta», «¿cuáles están bien escritos?», «menor base común a varios numerales»; papel (hoy solo el 10) |
| 2 Descomposición | papel 2 y 5; casos 3, 5 y 13 de la escena; tipo `cifras` del generador | tipos «a base 10», «ordenar numerales de bases distintas» y «numeral con letras» (a̅b̅ + b̅a̅; nivel examen, a̅a̅/b̅b̅b̅ de San Marcos 2021) |
| 3 Cambio de base | papel 1 y 3; casos 2 y 8 de la escena | una mesa; tipos «de 10 a n», «entre dos bases», «envases mínimos y suma de cifras» (San Marcos 2019-I y 2022) |
| 4 Base desconocida | papel 4; caso 6 de la escena | una mesa; tipos «23₍ₙ₎ = 17», «121₍ₙ₎ = 49», «acotar cifras en varias bases» (2022 y 2023-II), «mayor numeral con suma de cifras dada» (2025-I) |
| 5 Conteo | mesa `libros-largos`; papel 7 y 8; casos 14 y 15 de la escena | tipos «cifras del 1 al N», «al revés: con tantas cifras, ¿hasta qué número?», «cuántos de k cifras en base n» (con z − a + 1), «bases en que N tiene 3 cifras» (2026-II) |

Propuesta (pregunta 8): una plantilla nueva de formato `predicciones`, `plantillas/numeracion-bases/`, con generador, prueba
en 400 semillas, `casos.json` verificado aparte y papel de 5 a 10 por idea con sus datos al final. Los tipos van separados
por idea, con los mismos colores y códigos que la teoría. Además, `numeros-sucesiones` lee `opts.unidad` y en numeración
solo da `cifras`. La escena queda en «Más mesas del tema». Faltan también ítems de las ideas 3 a 5 en la prueba del curso.

---

## 8. Datos del mundo

La unidad casi no los necesita: el puesto y la rifa son situaciones de problema.

| Dato | ¿Fuente? |
| --- | --- |
| Caramelos, bolsitas de n, precio por cifra en la imprenta | Valores de problema, sin fuente. Que sean posibles: bolsitas de 2 a 9 caramelos, rifas de 100 a 400 boletos |
| 10 monedas de S/ 1 = un billete de S/ 10 | Son denominaciones vigentes del BCRP: es de todos los días, sin fuente |
| El quipu: nudos por niveles en base 10, con las unidades abajo y un nivel vacío como cero | **Necesita fuente** antes de escribir. Propongo Ascher y Ascher, *Code of the Quipu* (1981), o Locke, *The Ancient Quipu* (1923). Solo se afirma eso, sin fechas ni cifras. Lo confirmo en la fuente; no lo afirmo de memoria |
| Rifa pro fondos de la promoción | Costumbre; sin fuente |
| Historia: la numeración posicional entre la India, el mundo árabe y Europa | Ya trae fuente (MacTutor, *Arabic numerals*) |

---

## 9. Preguntas para Gerson

1. **¿La base se llama n o b?** Recomiendo **n**: es la letra de los libros y los exámenes, que escriben a̅b̅c̅₍ₙ₎. Ahí b es
   una cifra, y si la base también fuera b, la letra tendría dos significados en la misma unidad. Los `id` de los controles
   no cambian. El costo: N y n conviven, con color y leyenda.
2. **¿Cómo se escribe un numeral?** Recomiendo 342₍₆₎ y a̅b̅c̅₍ₙ₎, con raya cuando lleva letras. Es lo que ya usan la escena,
   el generador y la prueba, y es lo que el alumno ve en el examen. Habría que reemplazar el (132)₄ de la teoría. Para la
   raya hace falta un `{ raya }` en `nucleo/ecuacion.js` (hoy no existe); el generador usa el carácter que combina.
3. **¿Cinco ideas, con `base-desconocida` nueva?** Recomiendo que sí: es 5 de las 9 preguntas de San Marcos y el subtema con
   más fichas del banco. La otra opción es meterla en el nivel examen de la idea 2, pero se pierden su juego y su predicción.
4. **Objetos.** ¿Te sirven el puesto de caramelos de doña Juana como hilo de toda la unidad, el quipu en la idea 2 y el
   talonario de la rifa en la idea 5? Recomiendo los tres, dibujados como prueba. Si prefieres otra cosa que se empaque
   (chuño en bolsas y costales, por ejemplo), cambia el dibujo y no la idea.
5. **¿Busco la fuente del quipu?** Recomiendo que sí. Si no aparece una fuente que diga lo de «un nivel vacío es un 0», el
   quipu sale y la idea 2 abre con la etiqueta del puesto.
6. **Colores:** ¿apruebas violeta para la cantidad en base 10, turquesa para la base, naranja para las cifras (y los restos,
   que son cifras), el verde solo para la segunda base y el carmín fuera? Recomiendo que sí; además corrige la mesa 3D aquí.
7. **¿Qué queda fuera?** Recomiendo dejar fuera la parte fraccionaria en otras bases, las operaciones en otras bases (van a
   `cuatro-operaciones`) y los capicúas (piden el principio de multiplicación). Pasar de base 2 a base 8 de a 3 cifras iría
   como mesa de laboratorio, no en «Ahora tú».
8. **Práctica.** ¿Hago la plantilla nueva `numeracion-bases` por idea y hago que `numeros-sucesiones` separe por unidad?
   Recomiendo que sí, y que `grifos` pase a la unidad de fracciones o de racionales y `cubos` a potenciación. Ninguno de los
   dos se resuelve solo con lo de esta unidad (punto 9).
9. **¿Se queda el conteo de cifras?** San Marcos no lo preguntó entre 2019-I y 2027-I, pero el catálogo lo pone como tema y el
   banco trae 54 fichas (conteo de números y de cifras). Recomiendo que se quede, con el nivel examen de 2026-II.
10. **Ficha del catálogo:** recomiendo agregar el tema «Base desconocida y cifras ocultas», dejar `requiere: []` (es la raíz,
    y la división con resto y las potencias van como dato) y no tocar `grado: 3`, que ya es solo informativo.
