# Propuesta de ideas: «Arreglos numéricos y cuadrados mágicos» (`razonamiento-matematico.arreglos-numericos`)

26 nov 2026 · Etapa 9 del plan de calidad, rama «Números y patrones» de razonamiento matemático (segunda unidad de la
rama, después de Razonamiento inductivo) · encargo con criterio delegado (`docs/metodo/unidad/etapa-delegada.md`).
Gerson delegó el criterio: esta propuesta ya está aplicada en la unidad (sin `calidad: 2`). Las dudas van al final, en
«Decisiones tomadas (Gerson revisa después)». **No hay ningún conflicto crítico.**

Leído: `CLAUDE.md`, `docs/plan-calidad.md` §3, `docs/molde-unidad.md`, `docs/teoria.md` (4, 4e a 4j, §5),
`docs/metodo/unidad/` (LEEME, 1, 2, 3, reglas-validador, etapa-delegada), las decisiones de las etapas 2 a 8, la
propuesta modelo (`docs/etapa8/propuesta-razonamiento-matematico.md`, por secciones), la unidad modelo (Razonamiento
inductivo, v0.4.1, con su auditoría y su lector en frío: qué se corrigió), la teoría actual de esta unidad (v0.2.0, tres
ideas, entera), su ficha en `catalogo/cursos/razonamiento-matematico.json`, sus dos plantillas (`arreglos-giros`, escena
compartida con Transformaciones de figuras; `rm-arreglos`, generador propio), el ítem rm-16 de la reserva de la prueba,
las 30 preguntas de San Marcos de la unidad en `docs/datos/admision-unmsm.csv`, los códigos RMP de
`docs/investigacion/codigos-rm-procesos.md` y la investigación de ChatGPT (`docs/investigacion/etapa9/`, larga y breve,
por secciones). Revisadas para no repetir ni adelantar: Razonamiento inductivo (arreglo triangular, patrones), Planteo de
ecuaciones y Máximos y mínimos (que no trae los arreglos con suma máxima: se quedan aquí).

## Qué se pregunta en San Marcos (2019-I a 2027-I)

30 preguntas de la unidad. **La trampa más anotada es olvidar que una casilla compartida entra en dos cuentas** (13 de
las 30 la nombran: vértices, casilla común de la cruz, círculos en varias líneas). Casi la mitad pide además la suma
**mayor o menor** posible.

| Qué piden | Cuántas | Periodos (pregunta) | Idea |
| --- | --- | --- | --- |
| Polígono con números en vértices y lados, suma igual por lado (mayor, menor, diferencia, casillas no esquina) | 5 | 2024-I (21), 2024-II (22, 23), 2026-I (24), 2027-I (27) | 2 y 3 |
| Círculos en líneas que se cruzan, suma igual por línea (máxima o mínima, casillas marcadas) | 5 | 2025-I (27, 29), 2025-II (22), 2026-II (30), 2027-I (26) | 2 y 3 |
| Cruz o cuadro con casillas comunes a una fila y una columna | 4 | 2019-II (25), 2022 (19), 2023-I (25), 2023-II (19) | 2 |
| Cuadrado mágico aditivo (centro, casillas, encadenados, 4 × 4) | 5 | 2019-I (26), 2024-I (29), 2026-II (29), 2027-I (27) y el 4 × 4 | 4 |
| Cuadrado mágico multiplicativo («tratarlo como aditivo») | 3 | 2020-I (38), 2024-II (19), 2025-I (26) | 5 |
| Pirámide de sumas (cada número, la suma de los dos de abajo) | 1 | 2024-II (22) | 6 |
| Repartir en filas o grupos con sumas dadas o crecientes; filas ordenadas con la mayor columna | 3 | 2021 (22), 2023-II (25), 2023-I (27) | 1 y 3 |
| Cuadro latino, paridad en un tablero, numeración de asientos | 4 | 2019-II (19, 24), 2025-I (29), 2027-I (22) | práctica vieja `rm-arreglos` |

La UNI pregunta «distribuciones numéricas» (completar una figura con una relación que se conserva; solucionario 2020-1,
pregunta 19, según la investigación): queda fuera, porque es buscar la regla de unos casos y eso es de Razonamiento
inductivo (idea 2, «Tres casos no prueban»). El temario de la UNA Puno (CEPREUNA 2026, semana 10, según la
investigación) nombra cuadrados de orden 3 y 4 y multiplicativos: entran en las ideas 4 y 5.

---

## 0. Diagnóstico de la teoría actual contra el contrato

Tres ideas (`suma-magica`, `vertices-dos-veces`, `reparto-parejo`), tres mesas y diez términos. Las tres relaciones
están bien elegidas y las predicciones de las ideas 1 y 3 (el centro 5; 2, 4, 6, 8, 10) son buenas.

1. **Punto 1:** ninguna primera pantalla tiene un objeto: un tablero de casillas (`rm-tablero`), un triángulo de puntos
   (`rm-plano`) y fichas sueltas (`rm-fichas`).
2. **Puntos 2, 3 y 12:** sin `mision`, `leyenda`, `aprendizaje`, `actividad` ni `pregunta`; glosario sin `simple` ni tres
   ejemplos; no declara `calidad: 2`.
3. **§5b, colores:** el total en verde junto a la suma en naranja (el par que el molde prohíbe), los vértices en carmín.
4. **Punto 13:** ningún ejercicio trae `datos`; no hay ejemplos resueltos (0 de 45).
5. **Lo previo delata:** el glosario dice «del 1 al 16 suman 136; cada fila suma 34» (el juego de la idea 1 empieza en
   1 y muestra 34) y «(21 + 15) / 3 = 12» antes de predecir; la lectura del juego de la idea 2 escribe la fórmula
   «S = (21 + V) / 3» que la predicción debería descubrir.
6. **Repetición:** «Así se resuelve» es el mismo generador que «Ahora tú» con la semilla + 900; «Ahora tú» de la idea 1
   tiene un distractor con `Math.round` (RMT-ARR-7) que no es el valor de ningún error.
7. **«Ahora tú» no llega al examen:** no hay suma mayor o menor, ni cruces, ni cuadrados con casillas tapadas, ni
   multiplicativos, ni pirámides (25 de las 30 preguntas).
8. **Notación:** «/» y «·» mezclados con «÷» y «×»; «3S» sin decir qué es S.
9. **Práctica:** `rm-arreglos` no trae `datos` (9 de 9 problemas de papel fallan `papel-datos`); el papel de
   `arreglos-giros` no dice de qué unidad es cada problema (20 fallas de la lección 18).

---

## 1. Las ideas, en orden

**Seis** (el tope). Conservan su `id` y su predicción `reparto-parejo` (ahora la 1) y `suma-magica` (ahora la 4);
`vertices-dos-veces` conserva su id con otra predicción (la de antes pasa a la idea 3); entran `mayor-suma`,
`producto-magico` y `piramide-de-sumas`.

| # | `id` | Título (≤ 6) | `aprendizaje` (≤ 25 palabras) |
| --- | --- | --- | --- |
| 1 | `reparto-parejo` | El total se reparte parejo | Si los grupos no comparten números y usan todos, cada uno suma el total entre los grupos; si no sale entero o no se arma, no hay reparto. |
| 2 | `vertices-dos-veces` | Lo compartido cuenta dos veces | Al sumar todas las líneas, una casilla compartida entra en cada línea que la tiene: líneas × S = total + lo que se repite. |
| 3 | `mayor-suma` | La mayor suma tiene que armarse | La suma mayor sale de poner los números grandes en lo compartido, con S entera; después hay que armar el arreglo, o bajar al siguiente. |
| 4 | `suma-magica` | El cuadrado mágico y su centro | En un cuadrado mágico cada fila suma el total entre las filas; en el 3 × 3, el centro es S ÷ 3 y dos opuestos suman 2c. |
| 5 | `producto-magico` | Cuando las líneas multiplican | En el cuadrado mágico multiplicativo 3 × 3, el centro por sí mismo tres veces da el producto común, y dos opuestos multiplican c × c. |
| 6 | `piramide-de-sumas` | La pirámide de sumas | En una pirámide donde cada ladrillo suma los dos de abajo, la cima cuenta cada ladrillo de la base tantas veces como caminos suben. |

`pregunta` de cada idea, para el Resumen: 1. «¿Cuánto suma cada grupo si todos suman lo mismo?» · 2. «¿Por qué sumar
los lados no da la suma de los números?» · 3. «¿Cómo sabes que una suma es la mayor posible?» · 4. «¿Qué número va en el
centro de un cuadrado mágico?» · 5. «¿Qué cambia si las líneas multiplican en vez de sumar?» · 6. «¿Cuántas veces sube
cada ladrillo de la base?»

**Por qué cada una va ahí y qué da por sabido.** La 1 es la cuenta que todo lo demás usa (total entre líneas que no se
tocan) y agrega la condición «necesario no basta». La 2 suma la casilla compartida (la trampa de 13 preguntas). La 3 usa
la 2 para el mayor y el menor (la mitad de las preguntas). La 4 junta la 1 (filas) y la 2 (las cuatro líneas que pasan
por el centro). La 5 cambia la suma por el producto: la estructura de la 4 con otra operación (la trampa «tratarlo
como aditivo»). La 6 lleva el conteo de la 2 a casillas que entran más de dos veces. Ninguna usa algo de una idea
posterior. Se da por sabido: sumar, multiplicar y dividir enteros, par e impar (en Lee de la idea 1) y «c × c × c»
escrito así (Razonamiento inductivo estrena «al cubo»; aquí no se usa el exponente). No hay `requiere` nuevo.

**Lo que se descartó de la investigación de ChatGPT.** Sus seis ideas eran: leer todas las condiciones, contar
apariciones, la estructura del cuadrado, el mayor posible, el producto y «una regla tiene que resistir la comprobación».
Se tomaron el conteo de apariciones (idea 2), la cota que tiene que armarse (idea 3), el centro y los opuestos (idea 4),
el multiplicativo (idea 5) y los errores PAR, INV, CON, OPT y MUL como hipótesis. Se descartó: «leer condiciones» como
idea propia (entra en la regla y en «Ahora tú» de la idea 1, que comprueba inventario y líneas); la idea 6 de reglas
compatibles (es Razonamiento inductivo); la predicción conceptual de la idea 4 («ninguna suma puede superar cierto
límite…»), que se cambia por un caso que se calcula (el cuadrado con 1 a 8); y el aumento de todas las casillas como
predicción de la idea 3 (queda en «Ahora tú» de la 4 como nivel examen). La versión breve coincide en la definición
completa del cuadrado (las diagonales también) y en el centro S/3: va en la regla de la idea 4.

---

## 2. Objeto de la primera pantalla

Dibujos de la sesión en una pieza nueva, `rm-casillas` (prueba: `data-prueba`; Gerson decide después cuáles reemplaza).
El objeto es el juego de tarjetas de la kermés del colegio: tarjetas de cartulina con números, sobre bandejas y marcos de
madera.

| Idea | Objeto | Escena de la pieza |
| --- | --- | --- |
| 1 | la bandeja de madera de la kermés, con dos filas de tres tarjetas | `bandeja` |
| 2 | la bandeja en cruz (una fila y una columna que comparten la tarjeta del centro) | `cruz` |
| 3 | el marco triangular de madera con tarjetas en las esquinas y a mitad de cada lado | `marco` |
| 4 | el tablero de madera de 4 × 4 (y el de 3 × 3 en Predice) | `tablero` |
| 5 | dos tiras de cartulina con tres tarjetas cada una, que multiplican | `bandeja` con `op: '×'` |
| 6 | un muro de adobes en pirámide, cada adobe con su número | `muro` |

---

## 3. Misión de «Juega» (meta que el motor comprueba)

| Idea | Contexto + misión | Controles | `logrado` | Lectura en vivo (enuncia una relación) |
| --- | --- | --- | --- | --- |
| 1 | Seis tarjetas: 1, 2, 3 arriba y 7, 6, 5 abajo; cada columna se puede voltear. **Haz que las dos filas sumen lo mismo.** | tres columnas (arriba o abajo), también tocando la columna | {7, 2, 3} o {1, 6, 5} arriba | «Arriba 12 y abajo 12: la mitad de 24 cada una» |
| 2 | La cruz con cinco tarjetas seguidas; el centro está en la fila y en la columna. **Haz que la fila y la columna sumen 12 cada una.** | desde qué número (1 a 3) y el centro (1 a 7) | 2 a 6 con el 4 al centro | «Fila 12 y columna 12; el 4 está en las dos» |
| 3 | El marco con 1 a 6; las tarjetas del medio se acomodan solas si se puede. **Haz que cada lado sume 11.** | las tres esquinas (1 a 6) | esquinas 2, 4 y 6 (con 1, 5, 6 o 3, 4, 5 no se arma) | «Esquinas 2 + 4 + 6 = 12; cada lado suma 11» |
| 4 | Cuadrado mágico 4 × 4 con 16 números seguidos. **Haz que cada fila sume 50.** | desde qué número (1 a 6) | empieza en 5 | «Total 200 entre 4 filas: 50 cada una» |
| 5 | Seis tarjetas en dos tiras: 2, 4, 9 arriba y 1, 3, 6 abajo. **Haz que las dos tiras den el mismo producto.** | tres columnas (arriba o abajo) | {1, 4, 9} o {2, 3, 6} arriba | «Arriba 1 × 4 × 9 = 36 y abajo 36» |
| 6 | Muro de adobes: tres abajo, dos encima y la cima. **Haz que la cima valga 20 sin repetir números abajo.** | los tres de abajo (1 a 9) | a + 2b + c = 20, distintos | «Cima 17 = 3 + 5 + 5 + 4» |

Cuentas rehechas aparte (`SCRATCH/e9-rm/explora.py`, `explora2.py`, sin el código de la unidad): {7, 2, 3} y {1, 6, 5}
son las dos ternas de 12 entre 1, 2, 3, 5, 6, 7; en la cruz con a..a + 4, fila = columna = 12 solo con 2 a 6 y centro 4;
en el triángulo con 1 a 6, cada lado 11 solo con esquinas 2, 4, 6 ({1, 5, 6} y {3, 4, 5} dan 11 en la cuenta pero no se
arman); el 4 × 4 de Durero desde 5 suma 200 y cada fila 50; 1 × 4 × 9 = 2 × 3 × 6 = 36. Ninguna misión está cumplida al
abrir.

---

## 4. La predicción de cada idea

Ninguna pregunta por lo que el juego mostró. Los `datos` traen valores, nunca la regla.

**Idea 1** (la de hoy, se queda con su pregunta y sus ids). «Los números 2, 4, 6, 8 y 10 suman 30, que es par. ¿Se pueden
repartir en dos grupos de igual suma?» → **No: cada grupo sumaría 15, y con pares no sale** · «Sí: el total es par»
(RMT-ARR-8 → RMP180, par basta) · «Sí: 10 con 4, y 2 con 6 y 8» (RMP181, suma mal un grupo: 14 y 16).

**Idea 2** (nueva; la de antes pasa a la 3). «En el marco triangular van 1 a 6; las esquinas son 1, 3 y 5 y cada lado suma
lo mismo. ¿Cuánto suma cada lado?» → **10** · 7 (RMP1, 21 ÷ 3: cada esquina en un solo lado) · 12 (RMP182, cuenta dos
veces las tarjetas del medio: (21 + 15) ÷ 3) · 9 (RMP183, la suma de las esquinas). El juego fue la cruz: el triángulo
no se vio.

**Idea 3** (la predicción de antes de la idea 2). «Ahora un marco cuadrado con 1 a 8: uno en cada esquina y uno en medio
de cada lado. ¿Cuál es la mayor suma igual por lado?» → **15** · 15,5 (RMP184, la cuenta con 5, 6, 7 y 8 en las
esquinas: no es entera) · 9 (RMP1, 36 ÷ 4) · 21 (RMP185, los tres mayores en cada lado a la vez). Por fuerza bruta (8!
acomodos): las sumas posibles son 12, 13, 14 y 15; el 15 solo con esquinas 3, 6, 7 y 8 (con 4, 5, 7, 8, que también dan
24, no se arma).

**Idea 4** (la de hoy, se queda con su pregunta y sus ids). «En un cuadrado mágico 3 × 3 con los números del 1 al 9, ¿qué
número va en la casilla del centro?» → **5** · 9 (RMT-ARR-1 → RMP186, el mayor al centro) · 15 (RMP61, la suma de una
fila) · «Cualquiera de los nueve» (RMT-ARR-3 → RMP187). El juego es el 4 × 4, que no tiene centro.

**Idea 5.** «Un cuadrado mágico 3 × 3 multiplica: cada fila, columna y diagonal da 216. ¿Qué número va en el centro?» →
**6** · 72 (RMP65, como en el de sumas: 216 ÷ 3) · 54 (RMP188, 216 ÷ 4, por las cuatro líneas del centro) · «No se puede
saber sin las otras casillas» (RMP187). Datos: «216 = 2 × 2 × 2 × 3 × 3 × 3».

**Idea 6.** «En otro muro van cuatro adobes abajo: 2, 5, 1 y 3. ¿Cuánto vale la cima?» → **23** · 11 (RMP1, cada adobe
una sola vez) · 17 (RMP189, los del medio dos veces, como en el muro de tres) · 22 (RMP190, el doble de la base). El
juego fue el muro de tres: el de cuatro no se vio.

---

## 5. Tabla de letras y símbolos

| Símbolo | Un solo significado en la unidad | Dónde se dice |
| --- | --- | --- |
| T | el total: lo que suman todos los números del reto, cada casilla una vez | Lee de la idea 1 |
| S | la suma común: lo que suma cada línea (fila, columna, lado o grupo) cuando todas suman igual | Lee de la idea 1 |
| V | lo que suman las esquinas de un polígono | regla de la idea 2 |
| c | el número de la casilla compartida (la del centro de la cruz o del cuadrado) | Lee de la idea 2 |
| n | el orden del cuadrado: cuántas casillas tiene cada fila | Lee de la idea 4 |
| a, b | dos casillas opuestas: a los dos lados del centro, en una misma línea | regla de la idea 4 |
| P | el producto común: lo que da cada línea del cuadrado que multiplica | Lee de la idea 5 |
| x | el número de la casilla que se busca | donde se usa |
| ×, ÷ | multiplicar y dividir (nunca «·» ni «/» en el texto del alumno) | — |
| A–E | solo las alternativas de un ejemplo de nivel 3 | los resueltos las nombran por su valor cuando la figura tiene letras |

`letras: { T, S, V, c, n, a, b, P, x }` con esos significados. S no choca con el sol (S/) porque la unidad no usa precios.

---

## 6. Colores (molde §5b, por papel; un color fijo por magnitud)

| Token | Magnitud | Por qué |
| --- | --- | --- |
| tinta | los números de las tarjetas, las líneas, n, el número de líneas | lo que amarra |
| `o` naranja | T, el total (y, en la idea 5, el producto de todas las casillas) | el primer dato: de ahí sale todo |
| `i` turquesa | lo compartido: V, c, la casilla común, las veces que sube cada adobe | el segundo dato: lo que se cuenta de más |
| `f` violeta | S y P (la suma o el producto común) y la cima: lo que se pide casi siempre | lo pedido y su resultado |
| `h` carmín | x, la casilla que se busca | la unidad no tiene ángulos; x aparece junto a S (x = S − …) y no puede ser violeta |

Sin verde (no puede ir junto al naranja del total). Naranja y carmín (0,062) solo van juntos con su letra (T y x), como
el molde pide para A⃗ y θ. En las figuras, lo que se pide va con «?» en tinta hasta resolver; el violeta solo aparece al
resolver (prueba de la pieza). La pieza fija los papeles (`PAPELES`) y no usa carmín ni verde.

---

## 7. Práctica: qué existe y qué falta por idea

**Qué existe:** `rm-arreglos` (generador propio de la unidad, ocho tipos de examen: multiplicativo, vértices de un cuadro,
pirámide, filas, latino, filas crecientes, paridad, asientos; sin `datos`, sin separar por idea) y la escena
`arreglos-giros` (compartida con Transformaciones de figuras: cuadrado mágico, triángulo, ruedas y banderas).

**Qué se hace:**
- **Generador nuevo `rm-arreglos-ideas`**, de esta unidad sola, con `TIPOS_POR_IDEA` (seis ideas, tres tipos cada una),
  `datos` por línea en todos, distractores con el valor de su error, casos verificados aparte (`casos.json`) y papel con
  `herramientas/papel-generador.js`.
- `rm-arreglos` y `arreglos-giros` pasan a «Más mesas del tema» de esta unidad (`"rehacer"`). El papel de
  `arreglos-giros` dice de qué unidad es cada problema (lección 18).

| Idea | Tipos | Errores |
| --- | --- | --- |
| 1 | `grupos` (S = T ÷ grupos), `se-puede` (sí / no por impar / no aunque par), `falta` (la casilla que falta) | RMP180 a 181, RMP1, RMP61 |
| 2 | `lado` (S con las esquinas), `esquinas` (V con S), `cruz` (S o c) | RMP1, RMP182, RMP183, RMP61 |
| 3 | `mayor`, `menor` (con el paso al siguiente entero o al siguiente arreglo), `diferencia` | RMP184, RMP185, RMP1, RMP2 |
| 4 | `suma` (S con números en progresión), `centro`, `opuesta` (x = 2c − a) | RMP61, RMP186, RMP191 |
| 5 | `centro` (c con P), `producto` (P con c), `opuesta` (x = c × c ÷ a) | RMP65, RMP188, RMP191 |
| 6 | `cima`, `base` (la casilla de abajo que falta), `pesos` (cuántas veces sube) | RMP1, RMP189, RMP190 |

---

## 8. Datos del mundo

Ninguno hace falta: los números de las tarjetas son del juego, no medidas. La kermés del colegio, la bandeja y el muro
de adobes son escenas propias, sin cifras del mundo. La historia sigue con la fuente que ya tenía (ETH Library, *Magic
Squares*) y agrega el Lo Shu con la misma fuente.

---

## 9. Riesgos de orden (`requiere`)

- «Al cubo» y su símbolo son de Razonamiento inductivo: aquí se escribe «c × c × c» y no se usa el exponente.
- «Vértice», «paridad», «producto» y «consecutivo» ya se estrenan en otras unidades del curso: aquí se usan y el lector
  los marca con su definición; la unidad no los vuelve a definir.
- «Cota» la estrenaba Máximos y mínimos, que va después en la rama: **se muda aquí** (idea 3), con su definición, y sale
  del glosario de Máximos y mínimos (el lector la sigue marcando allá con esta definición).
- Máximos y mínimos no tiene arreglos con suma máxima: nada se adelanta.

---

## 10. Decisiones tomadas (Gerson revisa después)

1. **Seis ideas, con tres nuevas** (mayor suma, multiplicativo, pirámide). Motivo: 25 de las 30 preguntas no tenían idea.
   Descartado: la idea «leer todas las condiciones» de la investigación como idea propia (va dentro de la 1) y su idea
   6 de reglas compatibles (es Razonamiento inductivo).
2. **El orden cambia:** el reparto pasa a ser la idea 1 y el cuadrado mágico la 4. Motivo: el cuadrado usa las dos
   cuentas de antes (el total entre filas y el centro que entra en cuatro líneas). Descartado: empezar por el cuadrado,
   como hoy, y explicar el centro sin el conteo de lo compartido.
3. **Predicciones:** `reparto-parejo` y `suma-magica` conservan pregunta, ids y correcta; `vertices-dos-veces` cambia (el
   triángulo con esquinas 1, 3 y 5) y la de antes (el cuadrado con 1 a 8) pasa a `mayor-suma`. Avance: la unidad entra
   en `REHECHAS_E6` con la marca `prediccionAR2` (se vuelve a preguntar la de `vertices-dos-veces`) y `estudiadaAR2`
   (quien terminó las tres de antes conserva «Ya la estudié»).
4. **x en carmín.** La unidad no tiene ángulos y la casilla que se busca aparece junto a S. Descartado: x en violeta (dos
   variables del mismo problema con el mismo color) y en verde (junto al naranja del total).
5. **Juegos con tarjetas que se voltean por columna** (ideas 1 y 5) en vez de mover cada tarjeta. Motivo: seis botones
   por tarjeta no caben en el celular; voltear una columna se toca en la figura y deja ver que una fila gana lo que la
   otra pierde. Descartado: un control por tarjeta (64 casos, doce botones).
6. **Práctica nueva `rm-arreglos-ideas`** y las dos viejas a «Más mesas del tema». Motivo: `rm-arreglos` no tiene datos
   ni separa por idea; `arreglos-giros` es compartida. Descartado: rehacer `rm-arreglos` por dentro (sus tipos de examen,
   como el cuadro latino y la paridad, siguen ahí como práctica extra).
7. **«Cota» se muda** de Máximos y mínimos a esta unidad (va antes en la rama).
8. **Códigos RMP180 a RMP191** nuevos, todos hipótesis; RMT-ARR-1 a 10 de la teoría vieja se reemplazan (tabla en
   `docs/investigacion/codigos-rm-procesos.md`).
9. **Prueba del curso:** dos ítems nuevos a la reserva (las formas ya tienen 10 pares): rm-28 (cruz con la casilla común)
   y rm-29 (centro del cuadrado mágico multiplicativo), verificados en `catalogo/pruebas/verificar.js`.

---

## 11. Fases 2 a 5 (26 nov): lo que cambió al escribir

Decisiones tomadas al escribir (Gerson revisa después), además de las de §10:

1. **Pieza nueva `rm-casillas`** (bandeja, cruz, marco de 3 a 5 lados, tablero, muro de adobes), con la prueba común de las
   piezas de razonamiento matemático (encuadre con 4 de margen, rótulos que no se pisan, alto fijo, `data-prueba`) sobre
   todas las figuras de la unidad, los papeles de color fijos y ningún violeta antes de responder. Las tarjetas son
   opacas: el marco no se ve a través de ellas.
2. **Notas de la sesión sobre la idea 1** (26 nov): el ícono de la unidad ya no es el Lo Shu con 5 y 15 (delataba las
   predicciones de las ideas 1 y 4): ahora es el marco triangular con «?» en las tarjetas del medio; la regla dice «x: el
   número que le falta al grupo»; el «Vale si» dice en palabras que salga entero no basta; la leyenda del juego, «6, 18…:
   la suma de cada fila».
3. **Juegos:** la cruz elige desde qué número van las cinco tarjetas y cuál va al centro (si el centro no es una de ellas,
   la lectura lo dice); el marco triangular deja elegir las tres esquinas y acomoda solo las del medio si se puede; el
   muro tiene tres controles para los adobes de abajo.
4. **«Necesario» y «suficiente»** salen del glosario (la regla de la idea 1 lo dice en palabras, por la nota de la
   sesión); «progresión aritmética» y «ecuación» también salen (no se usan). Glosario: 14 términos, de 2 a 3 por idea.
5. **Mesas del laboratorio** pasadas a la pieza nueva: el reparto de números seguidos (idea 1), las esquinas a elección
   (idea 3) y el cuadrado mágico con otros números (idea 4). Las ideas 2, 5 y 6 aportan su juego.
6. **Los Datos del multiplicativo** traen una tabla de números por sí mismos tres veces (3 → 27 … 15 → 3375): se elige
   de una tabla, no se da la respuesta (regla `datos-respuesta`).
7. **Prueba del curso:** rm-28 cambió de contexto (alumnos con números en el polo) porque con tarjetas en una cruz
   repetía un problema del generador; rm-29 usa 1000 y 2744 para que A y B midan los mismos errores.
8. **Pruebas propias** (`arreglos-numericos.test.js`): un resolvedor que lee el texto del alumno y rehace todo por fuerza
   bruta (acomodos del marco, subconjuntos de la lista, cuadrados 3 × 3 por permutaciones, el muro fila por fila) en 400
   semillas de «Ahora tú» y 200 de «Así se resuelve»; la paleta; lo que no se repite y el validador con `calidad: 2`
   simulada.
