# Propuesta de ideas: «Números racionales, fracciones y decimales» (`aritmetica.numeros-racionales`)

Etapa 8 del plan de calidad, rama «Números y operaciones» (la de entrada de Aritmética), la sexta unidad, después de
«Sistemas de numeración», «Las cuatro operaciones», «Divisibilidad», «Números primos y divisores» y «MCD y MCM» (las cinco
con calidad 2) · fases 1 a 5 con criterio delegado (`docs/metodo/unidad/etapa-delegada.md`) · 19 nov 2026

Gerson delegó el criterio: esta propuesta ya se ejecutó (es el guion de la unidad) y tú la revisas después. Por eso la
última sección no pregunta: dice qué se decidió, por qué y qué se descartó. **No hay ningún conflicto crítico.**

Lo que leí: `CLAUDE.md`, `docs/plan-calidad.md` §3, `docs/molde-unidad.md`, `docs/teoria.md` (4, 4e a 4j y §5),
`docs/metodo/unidad/` (LEEME, 1-ideas, 2-ejemplos, 3-practica, reglas-validador y el encargo delegado, con sus 19
lecciones), las decisiones de las etapas 2 a 7, la propuesta de MCD y MCM como modelo (`docs/etapa7/propuesta-aritmetica.md`),
esa unidad terminada (`mcd-y-mcm.js`, calidad 2) con su auditoría y su lector en frío, la teoría de antes
(`numeros-racionales.js`, v0.2.0), su ficha en `catalogo/cursos/aritmetica.json`, sus tres plantillas (`fracciones`,
`fracciones-problemas` y `numeros-sucesiones`, con el tipo `grifos` que se mudó aquí), el informe
`docs/investigacion/aritmetica-razonamiento-ideas-erroneas.md` (AR11 y AR12), la matriz `docs/teoria/matriz/aritmetica.json`
(unidad 16), `docs/temario-completo.md` §16, la prueba del curso (fr-01 está en las formas) y `docs/datos/admision-unmsm.csv`;
y las vecinas (`mcd-y-mcm.js`, `numeros-primos-y-divisores.js`, que ya cuenta las fracciones irreductibles con la función
de Euler, `potenciacion-y-radicacion.js` y `sucesiones-y-series.js`), para no repetir ni adelantar.

## Qué se pregunta en los exámenes

El catálogo pone la unidad en las semanas 18 y 19 de la UNI y en los temas 8 y 9 de San Marcos. En el CSV hay **18
preguntas de San Marcos** clasificadas en esta unidad. Las agrupo con el resumen del CSV:

| Periodo (pregunta) | Qué piden | Dónde queda |
| --- | --- | --- |
| 2019-I (37), 2021 (31, stock), 2023-I (32, tiempo restante), 2023-I (32, pérdidas), 2025-II (31) | Fracciones de lo que queda, del resto o del total, a veces hacia atrás (trampa: tomar la fracción sobre el total) | idea 3 |
| 2023-I (32, bomba) | Trabajo con fracciones: lo que se llena en una hora (trampa: «disminuye en 2/3» leído como «queda en 2/3») | idea 3 |
| 2022 (34), 2024-II (32), 2019-II (33) | Fracciones equivalentes con una condición: denominador de tres cifras, suma de términos, un parámetro | idea 1 |
| 2026-I (32, entre dos), 2027-I (31, precio unitario) | Comparar fracciones y contar las que caben entre dos (trampa: comparar solo numeradores) | idea 2 |
| 2025-II (34), 2026-I (34) | Cifras del período sin dividir; cuántas cifras no periódicas da un denominador con un factorial | idea 4 |
| 2021 (31, porcentajes), 2025-II (32), 2027-I (31) | Fracción generatriz: porcentajes periódicos, sumas que dan un periódico mixto, un decimal exacto | idea 5 |
| 2024-II (31), 2026-I (32, impropias) | Formar fracciones irreductibles con números dados; impropias irreductibles con suma entera | práctica `fracciones-problemas` (examen) |

El banco Cuzcano tiene unas 157 fichas: decimales exactos y periódicos (37), fracción de una cantidad (22), equivalentes
e irreductibles (17), problemas con fracciones (15) y caños y tanques (15). Son de academia: dicen qué se pregunta, no se
copian.

**Lo que más pesa en San Marcos son las fracciones de lo que queda (6 de 18) y las condiciones sobre fracciones
equivalentes o irreductibles (5 de 18).** La teoría de antes no tenía ni una ni otra: no había ninguna idea de operar con
fracciones. Los números en otras bases no salieron en San Marcos, pero están en el temario del catálogo y en la UNI.

---

## 0. Diagnóstico de la teoría de antes contra el contrato

`numeros-racionales.js` (v0.2.0, `estado: 'completa'`, sin `calidad: 2`) tenía 5 ideas (`equivalentes`, `orden-recta`,
`exacto-periodico`, `generatriz`, `otras-bases`) y tres mesas.

1. **Punto 1: ninguna primera pantalla tenía un objeto.** Tiras abstractas (`arit-tiras`), la recta y tablas; el queso de
   la feria y el kilo y medio de quinua solo estaban escritos.
2. **Puntos 2, 3 y 12: sin `mision`, `leyenda`, `aprendizaje`, `actividad` ni `pregunta`**; consignas que describen
   botones.
3. **Punto 13: ningún ejercicio traía `datos`** y no había ejemplos resueltos (0 de 75). El glosario tenía 15 términos
   sin `simple` y con un solo ejemplo.
4. **Colores fuera del mapa**: el resto en carmín y las cifras en verde, juntos en la misma tabla (verde y carmín dan
   0,038 en deuteranopía); verde junto al naranja del numerador.
5. **Notación**: «·» para multiplicar (la rama usa ×); «0,1666…» con el período escrito de distinta forma en cada idea.
6. **«Ahora tú» con dos opciones** (Sí/No) en la mitad de las semillas, y «Así se resuelve» igual a «Ahora tú» con la
   semilla + 900 (el error que la auditoría de MCD y MCM llamó M3).
7. **Faltaban las operaciones**: ni suma con denominador común (AR12, el único error documentado de la unidad, 55 % en
   NAEP) ni fracción de lo que queda (la pregunta que más repite San Marcos).
8. **Práctica**: la escena `fracciones` (compartida con MCD y MCM y Estadística), `fracciones-problemas` (13 tipos de
   examen sin `datos`, tres de ellos de MCD y MCM: `pesi`, `euclides`, `pg-mcd`) y `numeros-sucesiones` (el tipo `grifos`,
   sin `datos`). Con la marca, **la regla del papel fallaría en 15 problemas** (lección 18): los cinco de esta unidad en
   `fracciones` y los diez de `fracciones-problemas`, sin Datos.
9. La cabecera decía «postulante de 3.º a 5.º».

---

## 1. Las ideas, en orden

Son **seis**. Cinco conservan su `id` (con otra Predice, salvo `exacto-periodico`, que conserva pregunta y opciones) y
una es nueva (`del-resto`). No hace falta `septimaIdea`; el avance se migra (bloque en `REHECHAS_E6` de
`nucleo/avance.js`, decisión 10).

| # | `id` | Título (≤ 6 palabras) | `aprendizaje` |
| --- | --- | --- | --- |
| 1 | `equivalentes` | Fracciones equivalentes | Multiplicar o dividir arriba y abajo por el mismo número no cambia la parte: 3/5 = 6/10. La irreductible sale dividiendo entre el MCD. |
| 2 | `orden-recta` | Comparar fracciones | Con distinto denominador, se multiplica en cruz: a/b < c/d si a × d < b × c. Propia, menor que 1; impropia, mayor; aparente, un entero. |
| 3 | `del-resto` | Partes del total y del resto | Partes del mismo total se suman con denominador común. Una parte de lo que queda se multiplica: queda (1 − a/b) × (1 − c/d). |
| 4 | `exacto-periodico` | Decimal exacto o periódico | Una fracción irreductible da decimal exacto si su denominador solo tiene los primos 2 y 5; si no, se repite. Un irracional no repite. |
| 5 | `generatriz` | La fracción generatriz | Se multiplica por 10, 100 o 1000 hasta alinear las colas y se resta: las colas se cancelan y queda la fracción. |
| 6 | `otras-bases` | Fracciones en otras bases | En base B, la fracción irreductible es exacta si cada primo de su denominador divide a B; las cifras salen de multiplicar el resto por B. |

`pregunta` (Resumen): 1 «¿Cuándo dos fracciones son la misma parte del queque?» · 2 «¿Cuál de dos fracciones es la parte
más grande?» · 3 «¿Qué cambia si se vende una parte de lo que queda?» · 4 «¿Cuándo termina el decimal de una fracción?» ·
5 «¿De qué fracción sale un decimal periódico?» · 6 «¿Puede una fracción ser exacta en una base y periódica en otra?».

**Por qué va cada una ahí y qué da por sabido**

1. **Equivalentes.** Da por sabidos el MCD (la unidad anterior) y la fracción irreductible (Números primos, con la
   función de Euler). Estrena: numerador, denominador (mudado aquí desde Probabilidades, decisión 9), fracciones
   equivalentes, número racional.
2. **Comparar.** Usa los productos cruzados de la idea 1. Clases y orden van juntas porque una impropia se reconoce
   comparando con 1. Estrena: fracción propia, impropia, aparente, número mixto.
3. **Partes del total y del resto (nueva).** Usa las equivalentes (denominador común) y el MCM (MCD y MCM). Es la idea con
   más preguntas de San Marcos. Estrena: denominador común, fracción de una fracción, reducción a la unidad.
4. **Exacto o periódico.** Usa la descomposición canónica (Números primos) y la división con resto (Las cuatro
   operaciones). Estrena: decimal exacto, decimal periódico, número irracional, cifra decimal. No dice «período» ni
   «periódico puro» o «mixto» (los estrena la idea 5): habla del bloque que se repite.
5. **Generatriz.** Usa la irreductible (idea 1) y la resta con colas iguales. Estrena: período, periódico puro, periódico
   mixto, generatriz.
6. **Otras bases.** Usa las bases de Numeración y la regla de la idea 4, que aquí se generaliza (en base 10, los primos son
   2 y 5). Va al final porque nadie la necesita antes. Estrena: expansión, cifra fraccionaria.

**Qué no entra** (y adónde va): contar irreductibles con la función de Euler (ya está en Números primos; aquí solo
«cuántas entre dos fracciones», con fuerza bruta), las sumas infinitas (Sucesiones y series: aquí 0,333… sale con la
resta de colas), potencias y raíces de fracciones (Potenciación y radicación), operar decimales en otras bases (ni la
teoría de antes lo tenía) y los problemas de razones (Razones y proporciones).

---

## 2. Objeto de la primera pantalla

Sigue el mundo de la rama: **la promoción** (aquí, el queque que vende en su fiesta) y **el puesto de doña Juana** (su
calculadora de bolsillo, la de Las cuatro operaciones).

| Idea | Objeto (primera tarjeta de «Lee» y juego) | Qué es cada cosa |
| --- | --- | --- |
| 1 | El queque de la promoción en su bandeja, cortado en porciones | las porciones vendidas = el numerador, en naranja; en cuántas se cortó = el denominador |
| 2 | Dos bandejas iguales, una debajo de otra | lo vendido en cada una; si pasa de una bandeja, la fracción es impropia |
| 3 | La venta del día: en la mañana una parte del queque, en la tarde una parte de lo que quedó | lo de la tarde se corta sobre lo que quedó (en filas); lo que queda al final, con borde violeta |
| 4 | La calculadora de doña Juana: 1 ÷ 4 = 0,25 se acaba; 1 ÷ 3 llena la pantalla | después, el cuaderno de la división con cada resto |
| 5 | La calculadora con 0,272727… y la tabla de x, 10x, 100x | las colas que se alinean y se cancelan |
| 6 | El queque cortado en 6 porciones y en 10 | un tercio es justo 2 de 6 porciones, y no cabe justo en décimos |

Piezas (dibujos de prueba, `data-prueba`, con su prueba numérica de encuadre y rótulos; molde §6):
- **`arit-queque`** (nueva): de una a tres bandejas iguales, una debajo de otra, a una sola escala; cada queque cortado en
  porciones (columnas) y, si se pide, cada porción en pedazos (filas); marcas por rectángulos de la grilla (lo vendido en
  naranja, lleno o rayado; lo que se pide con borde violeta); más de un queque por bandeja para una impropia.
- **`arit-calculadora`** (de Las cuatro operaciones, compartida): **un bloque nuevo, la coma decimal** («0,25» se ve con
  la coma en la casilla del 0, como en una calculadora de verdad). No cambia nada de lo que dibuja si la pantalla no trae
  coma.
- `arit-tabla` para la división, la tabla de la generatriz y la división en otra base; `recta` en el dibujo de la regla 2
  y en el laboratorio; `arit-tiras` en el laboratorio.

---

## 3. Misión de «Juega» (meta que el motor comprueba; una sola manera en la grilla)

| Idea | Contexto + misión | Controles | `logrado` | Lectura en vivo |
| --- | --- | --- | --- | --- |
| 1 | «La promoción vende porciones de su queque…» **Haz que lo vendido quede escrito como 6/9 del queque.** | lo vendido (1/2, 1/3, 2/3, 1/4, 3/4, 2/5, 4/5, 5/6: sin 3/5, la predicción), cortar cada porción en 1–4 | 2/3 y 3 | «2/3 = 4/6: lo vendido no cambió» |
| 2 | «Dos bandejas iguales…» **Arriba deja 3/4. Abajo, en 7 porciones, vende lo menos posible para pasarlo.** | vendidas 1–8 y porciones 4–8, arriba y abajo | 3/4 y 6/7 | «3/4 > 5/7: arriba se vendió más» |
| 3 | «En la mañana la promoción vende una parte de su queque…» **Haz que al final quede justo 1/4 del queque.** | mañana 1/3, 2/3, 1/4, 3/4, 2/5, 3/5; tarde 1/2, 1/4, 3/4, 1/5 | 2/3 y 1/4 | «Queda 3/4 de 1/3: 1/4 del queque» |
| 4 | «Doña Juana divide en su cuaderno…» **Con numerador 1, busca un denominador impar que dé decimal exacto.** | numerador 1–9, denominador 2–12 | 1 y 5 | «7/12 = 0,58333…: el resto 4 vuelve» |
| 5 | «Para volver de un decimal a su fracción…» **Para x = 0,123123…, busca el número que deja un entero al restar x.** | decimal (cinco), multiplicar por 10, 100 o 1000 | 0,123123… y 1000 | «100x − x = 45: las colas se cancelan» |
| 6 | «Doña Juana divide en otras bases…» **Haz que 1/9 sea exacto con la base más chica posible.** | n (sin el 5), base 2–10 | 9 y 3 | «1/9 en base 3 = 0,01: termina» |

Ningún `bien` dice la respuesta de su predicción, y ningún juego llega a ella: el juego 1 multiplica hasta por 4 y la
predicción multiplica por 5; el 2 corta hasta en 8 y la predicción usa novenos; el 3 no tiene «1/2 en la mañana»; el 4
llega hasta 12 y la predicción usa 24, 30 y 40; el 5 no tiene el 27; el 6 no tiene el 5.

---

## 4. La predicción de cada idea

La app baraja las opciones. `datos` lleva solo valores, nunca la fórmula. AR12 (sumar arriba y abajo) está documentado y
AR11 tiene respaldo parcial; los AT son hipótesis (tabla «Números racionales (19 nov)» del informe). Ninguna predicción
repite un código, y cada distractor da el valor de su error (la prueba de la unidad los rehace).

**Idea 1.** «Un queque se cortó en 5 porciones y se vendieron 3: 3/5. ¿Cuál de estas fracciones es la misma parte del
queque?» — **15/25** · 5/7 (AT-SUMA-AMBOS, suma 2 arriba y abajo) · 3/25 (AT-SOLO-ABAJO) · 15/5 (AT-SOLO-ARRIBA).

**Idea 2.** «Dos queques iguales: uno se cortó en 7 porciones y se vendieron 5; el otro, en 9, y se vendieron 7. ¿De cuál
se vendió más queque?» — **del de 7/9** · del de 5/7 (AT-PORCION, «los séptimos son más grandes») · lo mismo (AT-DIFERENCIA, a los dos les
faltan 2) · no se puede saber (AT-DISTINTOS, denominadores distintos).

**Idea 3.** «En la mañana se vende 1/2 del queque y en la tarde, 1/3 de lo que quedó. ¿Qué parte del queque queda?» —
**1/3** · 1/6 (AT-RESTO-TOTAL, 1 − 1/2 − 1/3) · 3/5 (AR12, 1/2 + 1/3 = 2/5 vendido) · 2/3 (AT-RESTO-SOLO, lo que queda de
la mitad sin multiplicar).

**Idea 4.** «¿Cuál de estas fracciones da un decimal exacto?» — **7/40** · 5/24 (AT-PAR) · 4/15 (AT-CINCO) · 11/30
(AT-DOSYCINCO). Datos: 40 = 2³ × 5, 24 = 2³ × 3, 15 = 3 × 5, 30 = 2 × 3 × 5. Conserva pregunta y opción correcta de antes;
cambian dos distractores, que antes estaban en el juego.

**Idea 5.** «x = 0,272727… ¿Qué fracción es x?» — **3/11** · 27/100 (AT-CORTAR) · 3/10 (AT-MIXTO, 27/90) · 3 (AT-NUEVES,
27/9).

**Idea 6.** «En base 10, 1/5 = 0,2 es exacto. ¿Cómo se escribe 1/5 en base 6?» — **0,111… periódico** · 0,2 exacto
(AT-BASE10) · 0,1 exacto (AT-SIN-RESTO, 6 ÷ 5 = 1 y deja el resto) · no se puede (AT-NO-BASE). Reemplaza a la de antes
(1/3 en base 6), que la tarjeta del queque en 6 porciones regalaba.

Ningún ejemplo del glosario ni de «Lee» usa los números de estas predicciones ni de las misiones (la prueba lo mira).

---

## 5. Lo que tiene que decir cada regla y adónde llega «Ahora tú»

| Idea | La regla dice | «Así se resuelve» (distinto de «Ahora tú») | «Ahora tú», hasta nivel examen |
| --- | --- | --- | --- |
| 1 | a/b = (a × k)/(b × k); a/b = c/d si a × d = b × c; la irreductible, dividiendo entre el MCD; sumar lo mismo cambia la parte | la equivalente con un producto de términos dado | el término que falta; cuál es equivalente; la irreductible; **la suma de términos (San Marcos 2024-II)**; **la diferencia**; **cuántas con denominador de tres cifras (2022)** |
| 2 | mismo denominador: gana el numerador; si no, en cruz; en la recta, la mayor a la derecha; propia, impropia, aparente, mixto | una fracción entre dos dadas | cuál es mayor; ordenar tres; la clase; impropia a mixto; **cuántas irreductibles entre dos (2026-I)**; **la bolsa más barata por kilo (2027-I)** |
| 3 | sumar con denominador común; c/d de lo que queda es c/d × (1 − a/b); nunca arriba con arriba | qué parte de lo que quedaba se vendió en la tarde | sumar dos; lo vendido en total; lo que queda; **hacia atrás (2019-I)**; **dos grifos y un desagüe (caños)**; **pérdidas sucesivas y una ganancia (2023-I)** |
| 4 | irreductible: exacto si el denominador solo tiene 2 y 5; cifras: el mayor exponente; periódico si tiene otro primo; irracional, infinito sin bloque | si 63/150 es exacto (simplificar primero) | cuál es exacto; cuántas cifras; cuántas cifras antes del bloque; cuál es irracional; **con un factorial (2026-I)**; **la cifra del lugar 100 (2025-II)** |
| 5 | multiplicar hasta alinear colas y restar; puro: período sobre nueves; mixto: todo menos lo de antes, sobre nueves y ceros | la generatriz con parte entera | puro; mixto; exacto a irreductible; suma de dos periódicos; **porcentaje periódico (2021)**; **producto con un periódico** |
| 6 | exacto en base B si los primos del denominador dividen a B; cada resto por B da la cifra; 0,xy₍B₎ = x/B + y/B² | escribir 3/8 en base 4 | exacto o periódico; 0,xy₍B₎ a fracción; la menor base; **periódico en base B a fracción**; **cuántas bases hacen exacta una fracción** |

---

## 6. Tabla de letras y símbolos (`def.letras`)

| Símbolo | Un solo significado en la unidad | Aviso |
| --- | --- | --- |
| a, b | el numerador y el denominador de una fracción a/b | **Aviso**: en Numeración y Las cuatro operaciones, a, b y c eran cifras; aquí no hay cifras ocultas |
| c, d | el numerador y el denominador de otra fracción | — |
| k | el número por el que se multiplican los dos términos | Como en la rama: un entero |
| x | el decimal periódico al que se le busca la fracción (idea 5) | Solo en la idea 5 |
| L | cuántas cifras tiene el bloque que se repite | Solo en los Datos de la idea 4 |
| B | la base de numeración (idea 6) | En Numeración la base era n; aquí n es un denominador (como en la teoría de antes) |
| n | el denominador de 1/n en la idea 6 | Solo en la idea 6 |
| N | una cantidad entera (kilos, panes, litros) | Como en Divisibilidad |
| MCD(a, b) | el máximo común divisor, para simplificar | Como en MCD y MCM |
| 0,272727… | un decimal periódico: el bloque repetido y «…» (decisión 8) | Toda la unidad igual; nunca con raya encima |
| × | multiplicar | Nunca «·» (el «   ·   » solo separa dos relaciones en una regla) |

---

## 7. Mapa de colores por magnitud (§5b)

Un color fijo por magnitud en las seis ideas, con su prueba en `numeros-racionales.test.js`
(`def.colores = { parte: 'o', partes: 'i', pedido: 'f', resto: 'h' }`).

| Token | Magnitud | Dónde se ve |
| --- | --- | --- |
| `o` naranja, «parte» | el numerador: las porciones que se toman (lo vendido) | las porciones vendidas del queque, el numerador en las cuentas |
| `i` turquesa, «partes» | el denominador: en cuántas partes iguales se corta el entero | el denominador en las cuentas y rótulos; las porciones que se cuentan |
| `f` violeta, «pedido» | lo que se busca: la fracción que queda, la equivalente que falta, las cifras del decimal, la generatriz | el borde de lo que queda, las cifras de la división, la respuesta |
| `h` carmín, «resto» | el resto de la división (ideas 4 a 6) | la columna de restos; el resto que vuelve |
| tinta | cantidades (kilos, horas), la base, k, x, «?» | — |
| verde | **no se usa** | antes, las cifras iban en verde, junto al carmín del resto (0,038 en deuteranopía) |

Pares que van juntos (medidos en §5b): naranja–turquesa 0,114, turquesa–violeta 0,101, violeta–carmín 0,167,
turquesa–carmín 0,077 y naranja–carmín 0,062 (el más bajo: la columna de restos lleva su encabezado «resto» y el
numerador nunca va en esa columna). Una cantidad pedida (cuántos kilos, cuántas horas, cuántas fracciones) va en tinta,
como en MCD y MCM.

---

## 8. Práctica: qué existía y qué se hizo

**Antes:** la escena `fracciones` (borrador 0.1.0, compartida), `fracciones-problemas` (13 tipos de examen, tres de MCD y
MCM, sin `datos`) y `numeros-sucesiones` (el tipo `grifos`, sin `datos`). La prueba del curso tenía fr-01 (suma de
fracciones) en las formas y fr-02 en la reserva.

**Ahora:**
- **`plantillas/racionales/`** («El queque y la calculadora», formato `predicciones`), primera en la ficha, con
  `TIPOS_POR_IDEA` (24 tipos, cuatro por idea, de nivel 1 a examen, 9 con forma de San Marcos), prueba en 400 semillas, `casos.json` con un
  caso por tipo verificado aparte en Python y papel de 8 problemas (uno por idea y dos de examen de San Marcos).
- **`fracciones-problemas`** se queda como práctica de examen: con `{ unidad }` (como la llama la app) ya no da los tres
  tipos de MCD y MCM (`pesi`, `euclides`, `pg-mcd`: los tiene `mcd-mcm`; sin unidad, sus pruebas siguen iguales), y su
  papel, hecho a mano, pierde esos tres problemas (p5, p7 y p9) y trae ahora sus Datos y su unidad (decisión 7).
- **`numeros-sucesiones`**: el tipo `grifos` trae su recuadro de Datos y su problema de papel dice de qué unidad es y trae
  sus Datos (bloque propio); el repaso lo cuenta en esta unidad.
- **La escena `fracciones`** pasa a «Más mesas del tema» (`"rehacer"` con esta unidad, como ya estaba para MCD y MCM).
- Dos ítems nuevos para la prueba del curso, en la reserva (decisión 12).

---

## 9. Datos del mundo

La unidad no los necesita: el queque, la calculadora, los grifos, los panes y los sacos de arroz son situaciones de
problema, sin fuente. Medidas creíbles: queques de 6 a 24 porciones, tanques que se llenan en 2 a 30 horas, sacos de 30 a
120 kg. La historia (Simon Stevin y los decimales, MacTutor) ya tenía fuente; se queda.

---

## 10. Riesgos de orden con otras unidades (`requiere`)

- **`requiere: ['aritmetica.mcd-y-mcm']` es correcto y basta.** De ahí se usan el MCD (simplificar) y el MCM (denominador
  común); de Números primos, la fracción irreductible y la descomposición canónica; de Numeración, las bases.
- **Potenciación y radicación** y **Sucesiones y series** (las siguientes): no se adelanta nada. La generatriz sale con
  la resta de colas, no con la suma infinita; no hay potencias de fracciones.
- **Glosario:** «denominador» se muda aquí desde Probabilidades (es una unidad posterior de otra rama; decisión 9).
  «fracción» se queda en Magnitudes proporcionales y «fracción irreductible» en Números primos (las dos se marcan igual
  con su definición). «productos cruzados» se queda en Razones y proporciones.
- **`arit-calculadora`** es de Las cuatro operaciones (y la usa División de polinomios): el bloque de la coma es aparte,
  con su prueba, y no cambia ningún dibujo de esas unidades.

---

## 11. Decisiones tomadas (Gerson revisa después)

1. **Seis ideas, con una nueva (`del-resto`: sumar partes y tomar del resto) y las cinco de antes.** Motivo: las
   fracciones de lo que queda son la pregunta que más repite San Marcos (6 de 18) y la teoría de antes no operaba con
   fracciones; AR12 es el único error documentado de la unidad. Descartado: siete ideas con `septimaIdea` (la suma en una
   idea y el resto en otra: 105 ejemplos para lo que se dice en una regla) y sacar `otras-bases` (es tema del catálogo y
   de la UNI). **Es la que más conviene que mires.**
2. **Colores: numerador naranja, denominador turquesa, lo que se busca violeta y el resto de la división carmín; sin
   verde.** Motivo: la teoría de antes ponía verde junto al carmín y al naranja (los pares que el daltonismo confunde). El
   carmín no tiene otro papel en esta unidad (no hay ángulos). Descartado: el resto en naranja, como «lo que sobra» de MCD
   y MCM, porque en la misma tabla el numerador también es naranja.
3. **Letras a y b para el numerador y el denominador, con aviso.** Motivo: es la notación del examen y de los libros
   (a/b); aquí no hay cifras ocultas. Descartado: N/D (no lo usa nadie) y las mayúsculas A y B de MCD y MCM (A y B eran
   números enteros sueltos, no los términos de una fracción).
4. **El mundo: el queque de la promoción (ideas 1, 2, 3 y 6) y la calculadora de doña Juana (4 y 5).** Pieza de prueba
   nueva `arit-queque` y el bloque de la coma de `arit-calculadora`. Descartado: seguir con `arit-tiras` y la recta (sin
   objeto); las jarras de chicha (una pieza más para comparar lo que el queque ya compara).
5. **La predicción de la idea 3 junta los tres errores de la idea**: restar las dos fracciones del total, sumar arriba y
   abajo (AR12) y no multiplicar. Descartado: una predicción de suma sola (AR12), que dejaba el resto sin predicción.
6. **La predicción de la idea 6 cambia a 1/5 en base 6** (exacto en base 10 y periódico en base 6). Motivo: la de antes
   (1/3 en base 6) la regalaba el queque en 6 porciones de «Lee». Descartado: no dibujar el queque en 6.
7. **`fracciones-problemas` se queda, sin `pesi`, `euclides` ni `pg-mcd`**, y su papel trae Datos. Motivo: son 10 tipos de
   examen de San Marcos que la práctica nueva no repite (irreductibles con parámetro, stock con cotas, formar
   fracciones…); los tres de MCD y MCM son de otra unidad (la lección de Vectores: la práctica de una unidad no pide lo de
   otra). Descartado: borrarla (se perdían esos tipos) y pasarla entera a `racionales` (sin `datos` en el generador).
8. **Los periódicos se escriben con el bloque repetido y «…»**: una o dos cifras, tres veces (0,333…, 0,272727…,
   0,8333…); más, dos veces (0,123123…). Como en la práctica de siempre y en el examen; nunca con raya encima (la raya es
   de Numeración: a̅b̅). Una prueba de la unidad lo comprueba en todo texto.
9. **«denominador» se muda aquí** desde Probabilidades (donde se estrenaba con P = 2/36); «fracción» se queda en
   Magnitudes proporcionales. Motivo: «denominador» es una palabra de la idea 1 y Probabilidades está después en el árbol;
   «fracción» ya tiene su definición de todos los días y esta unidad no la necesita como palabra nueva. Descartado: mudar
   las dos (cuatro palabras por idea no dejaban sitio a «número racional»).
10. **Avance:** `equivalentes`, `orden-recta`, `generatriz` y `otras-bases` conservan su id con otra Predice: una
    predicción sin huella se vuelve a preguntar (marca `prediccionNR`). `exacto-periodico` conserva pregunta y opción
    correcta (cambian dos distractores, con otros ids). Quien terminó las cinco ideas de antes conserva «Ya la estudié»
    (`estudiadaNR`); la nueva le queda por hacer. Entrada en `REHECHAS_E6`, con su prueba.
11. **Los ejemplos de nivel 3 llevan cinco alternativas, A a E**, con la letra correcta repartida (6 de cada una en 30).
12. **Prueba del curso: sin cambios en las formas** (ya tienen diez pares, fr-01 es de esta unidad). ari-37 (lo que
    queda tras dos ventas) y ari-38 (generatriz de un periódico mixto) quedan en la reserva, con su verificador.
13. **Ficha del catálogo:** un tema nuevo, «Operaciones y fracción del resto»; `plantillas`: `racionales`,
    `fracciones-problemas`, `numeros-sucesiones` y `fracciones` (esta, con `rehacer`); `requiere` y `grado` sin tocar.
14. **Las tres mesas del laboratorio se quedan** con sus `id` y los de sus controles (por la colección); cambian sus
    colores (sin verde: las cifras en violeta, el resto en carmín).
15. **El ícono de la unidad (`app/dibujos/aritmetica.js`)** dibuja «3/4»: no es la respuesta de ninguna predicción ni de
    ninguna misión (la regla `icono-respuesta` lo comprueba); se queda.

---

## 12. Fases 2 a 5 (19 nov): lo que se hizo

Las seis ideas quedaron escritas con sus 15 ejemplos y su prueba propia (`contenido/teoria/aritmetica/numeros-racionales.test.js`,
15 pruebas: colores por magnitud; misión única en la grilla, rehecha por fuerza bruta; predicciones con cada distractor
rehecho con fracciones exactas; «Ahora tú» en 400 semillas por idea, con la correcta y el valor de cada error rehechos
desde el texto de la pregunta (fracciones con enteros, divisiones largas propias en base 10 y en base B, conteos uno por
uno), sin el código de la unidad; «Así se resuelve» en 100; toda igualdad escrita comprobada en 400 semillas; «Ahora tú»
que no repite la predicción ni un ejemplo; los 90 ejemplos, con la correcta y cada trampa de nivel 3 rehechas y la letra
repartida, 6 por letra; el glosario sin las respuestas; la notación del decimal que se repite; las figuras del queque
sin solapes). El validador con `calidad: 2` simulada no marca nada en 200 semillas; la unidad sigue sin la marca.
`herramientas/ecuaciones-ancho.js`: todo cabe y nada se parte en mal sitio. La regla del papel (lección 18) con la marca
simulada: ninguna falla en las cuatro plantillas de la ficha. Cuentas aparte en Python (scratchpad de la sesión,
`e8-aritmetica/casos.py`, los 24 casos de la práctica, con `fractions`).

Lo que encontraron las pruebas propias y se corrigió antes de entregar (vale como lección para el método):
- en «hacia atrás» y en las pérdidas con ganancia, el distractor «toma la segunda fracción sobre el total» salía con un
  número de 18 cifras cuando 1 − a/b − c/d daba 0 en coma flotante (`Number.isInteger` de 2,16 × 10¹⁷ es verdadero):
  ahora se cuenta con enteros y, si no queda nada, el distractor no sale;
- la generatriz de un mixto con período 9 (0,8999… = 0,9) y los decimales escritos a mano en una lista
  («0,0909…» en vez de «0,090909…»): ahora se escriben con la misma función que la división;
- seis figuras de ejemplos (el cuaderno de la división) traían las cifras de la respuesta: salieron.
