# Propuesta de ideas: «Potenciación y radicación» (`aritmetica.potenciacion-y-radicacion`)

Etapa 9 del plan de calidad, rama «Números y operaciones» de Aritmética, la séptima unidad, después de «Sistemas de
numeración», «Las cuatro operaciones», «Divisibilidad», «Números primos y divisores», «MCD y MCM» y «Números
racionales» (las seis con calidad 2) · fases 1 a 5 con criterio delegado (`docs/metodo/unidad/etapa-delegada.md`) ·
26 nov 2026

Gerson delegó el criterio: esta propuesta ya se ejecutó (es el guion de la unidad) y tú la revisas después. La última
sección no pregunta: dice qué se decidió, por qué y qué se descartó. **No hay ningún conflicto crítico.**

Lo que leí: `CLAUDE.md`, `docs/plan-calidad.md` §3, `docs/molde-unidad.md`, `docs/teoria.md` (4e a 4j y §5),
`docs/metodo/unidad/` (LEEME, 1-ideas, 2-ejemplos, 3-practica, reglas-validador y el encargo delegado, con sus 19
lecciones), las decisiones de las etapas 2 a 8, la propuesta de Aritmética de la Etapa 8 como modelo (la de Números
racionales; de la de la Etapa 5, sus títulos), esa unidad terminada (`numeros-racionales.js`, calidad 2: el mapa y la idea
4 en código) con su auditoría y su lector en frío, la teoría de antes (`potenciacion-y-radicacion.js`, v0.2.0), su ficha
en `catalogo/cursos/aritmetica.json`, sus plantillas (`potenciacion`, escena con motor, y el tipo `cubos` de
`numeros-sucesiones`), la investigación previa (`docs/investigacion/etapa9/aritmetica.potenciacion-y-radicacion.md`, por
secciones, y su versión breve), `docs/temario-completo.md` §17, la prueba del curso (ari-19 y ari-20 son de esta unidad,
en la reserva) y `docs/datos/admision-unmsm.csv`; y las vecinas (`numeros-primos-y-divisores.js`, `numeros-racionales.js`,
`sucesiones-y-series.js` y, en Álgebra, `exponentes-y-productos-notables.js`, que pide esta unidad).

## Qué se pregunta en los exámenes

El catálogo pone la unidad en la semana 20 de la UNI y en el tema 4 de San Marcos. En el CSV hay **5 preguntas de San
Marcos** clasificadas en esta unidad, y una más de Números primos que la usa:

| Periodo (pregunta) | Qué piden | Dónde queda |
| --- | --- | --- |
| 2026-II (33) | Contar cuadrados perfectos de cuatro cifras acotando sus raíces (trampa: restar las bases sin sumar 1) | idea 5 |
| 2022 (32) | Un arreglo cuadrado con total acotado; contar los del borde sin repetir esquinas | ideas 3 y 5 |
| 2024-I (33) | Cubos perfectos con cierta cantidad de cifras en otra base, y la suma de sus raíces | idea 5 (y el tipo `cubos` de `numeros-sucesiones`) |
| 2023-I (31), 2026-I (34) | Un cuadrado perfecto con cifras desconocidas: terminaciones de los cuadrados | idea 2 |
| 2025-II (34, Números primos) | Un cuadrado perfecto con una cantidad de divisores dada | idea 1 (Ahora tú, examen) |

La UNI (temario CEPRE 2023-2, según la investigación previa) pide cuadrados y cubos perfectos, criterios de inclusión y
exclusión, raíz entera con sus residuos, reconstruir el radicando y aproximar una raíz con una tolerancia. El banco
Cuzcano tiene unas 100 fichas: criterios (37), raíz cuadrada y cúbica entera (28), cuadrados perfectos (21), cubos (8) y
potencias perfectas (6). Son de academia: dicen qué se pregunta, no se copian.

**La investigación previa propone seis ideas, y cinco son de Álgebra.** Sus ideas 1 a 5 (qué se repite, leyes de
exponentes, cero y negativos, raíces y existencia, radicales y exponentes racionales) son las tres ideas de «Exponentes y
radicales» (`algebra.exponentes-y-productos-notables`, calidad 2), que pide esta unidad. Solo su idea 6 (raíz entera,
residuos, criterios, conteo y cotas) es el temario de Aritmética. De ella tomo la estructura del residuo por defecto y
por exceso, el residuo máximo, el «si y solo si» de los exponentes, el filtro de la última cifra como condición necesaria,
el conteo de potencias en un intervalo cerrado y la aproximación con garantía; descarto lo demás (decisión 1).

## 0. Diagnóstico de la teoría de antes contra el contrato

`potenciacion-y-radicacion.js` (v0.2.0, `estado: 'completa'`, sin `calidad: 2`) tenía 4 ideas (`perfectos`,
`exclusion`, `raiz-entera`, `aproximadas`) y cuatro mesas, una de ellas 3D (el cubo de cubitos).

1. **Punto 1: ninguna primera pantalla tenía un objeto.** Tablas de exponentes, la tabla de diez cifras, fichas sueltas y
   la recta. La caja de chuño y las losetas del patio solo estaban escritas.
2. **Puntos 2, 3 y 12: sin `mision`, `leyenda`, `aprendizaje`, `actividad` ni `pregunta`**; consignas que describen
   controles.
3. **Punto 13: ningún ejercicio traía `datos`** y no había ejemplos resueltos (0 de 60). El glosario tenía 10 términos
   sin `simple` y con un solo ejemplo.
4. **El juego de `exclusion` mostraba las diez filas llenas**: la respuesta del juego estaba en la pantalla al abrir.
5. **Colores fuera del mapa**: el residuo en carmín junto al cuadrado siguiente en verde (0,038 en deuteranopía), y N
   naranja junto a un tramo verde en la idea 4.
6. **Notación**: «·» para multiplicar (la rama usa ×); la raíz entera se llamaba q (en la rama, q es el cociente) y la
   aproximación a.
7. **«Así se resuelve» igual a «Ahora tú»** con la semilla + 900, y «Ahora tú» con un solo tipo por idea.
8. **Faltaban la raíz cúbica entera** (solo en la mesa 3D), **el conteo de cuadrados en un tramo** (la pregunta de San
   Marcos 2026-II) y el residuo por exceso.
9. **Práctica**: la escena `potenciacion` (borrador 0.1.0, sin `datos` en su papel) y el tipo `cubos` de
   `numeros-sucesiones` (su problema de papel sin `unidades` ni Datos: con la marca, la regla del papel fallaría ahí).
10. La cabecera decía «postulante de 3.º a 5.º».

---

## 1. Las ideas, en orden

Son **seis**. Cuatro conservan su `id` (tres con otra Predice; `aproximadas` conserva pregunta e ids de opción) y dos son
nuevas (`raiz-cubica`, `contar`). No hace falta `septimaIdea`; el avance se migra (bloque en `REHECHAS_E6` de
`nucleo/avance.js`, decisión 9).

| # | `id` | Título (≤ 6 palabras) | `aprendizaje` |
| --- | --- | --- | --- |
| 1 | `perfectos` | Cuadrados y cubos perfectos | N es cuadrado perfecto si cada primo de su factorización tiene exponente par; cubo perfecto, si es múltiplo de 3. El menor factor completa los exponentes. |
| 2 | `exclusion` | Criterios para descartar cuadrados | Un cuadrado perfecto nunca termina en 2, 3, 7 u 8 ni en una cantidad impar de ceros. Cumplir el criterio no basta: solo descarta. |
| 3 | `raiz-entera` | Raíz cuadrada entera y residuo | Si k² ≤ N < (k + 1)², k es la raíz entera, sobran r = N − k² y faltan rₑ: r + rₑ = 2k + 1, y r llega a lo más a 2k. |
| 4 | `raiz-cubica` | Raíz cúbica entera y residuo | Si k³ ≤ N < (k + 1)³, k es la raíz cúbica entera; para el cubo siguiente hacen falta 3k² + 3k + 1 cubitos. |
| 5 | `contar` | Contar cuadrados en un tramo | Los cuadrados de a hasta b tienen bases desde la primera k con k² ≥ a hasta la última con k² ≤ b: última − primera + 1. |
| 6 | `aproximadas` | Aproximar una raíz por décimas | √N se encierra entre x y x + 0,1 si x² ≤ N < (x + 0,1)²; después, por centésimas. El error es menor que el paso. |

`pregunta` (Resumen): 1 «¿Cómo saber si un número es cuadrado perfecto sin sacar su raíz?» · 2 «¿Qué cifras finales
delatan que un número no es un cuadrado?» · 3 «¿Cuántos caramelos sobran, y cuántos faltan para la bandeja siguiente?» ·
4 «¿Cuántos cubitos hacen falta para pasar al cubo siguiente?» · 5 «¿Cuántos cuadrados perfectos hay entre dos números?» ·
6 «¿Cómo se acerca uno a √2 sin calculadora?».

`requiere` (catálogo): pasa de «Números primos y divisores» a **«Números racionales»** (decisión 8): la idea 6 usa
decimales y «número irracional», que estrena esa unidad, y la rama ya la pone antes.

## 2. Objeto de la primera pantalla

| Idea | Objeto | Pieza |
| --- | --- | --- |
| 1 | La **bandeja cuadrada de doña Juana**: arma bandejas de k filas de k caramelos para su vitrina (el puesto de caramelos es el hilo de la rama). Si N no forma un cuadrado, se ve el rectángulo más cuadrado que sí cierra (72 = 8 × 9) | `arit-cuadrado` (nueva, dibujo de prueba) |
| 2 | La **calculadora de doña Juana** en «Lee» (13 × 13 = 169, 23 × 23 = 529: la misma cifra final), y la tabla de las cifras finales en el juego | `arit-calculadora` y `arit-tabla` |
| 3 | La bandeja cuadrada con los caramelos que sobran en el borde de la bandeja siguiente y los lugares que faltan, punteados | `arit-cuadrado` |
| 4 | El **cubo de cubitos de chocolate**: un cubo macizo de k × k × k y los cubitos que sobran pegados a sus caras | `ari-cubitos-3d` (ya existe; dibuja la lista del motor de `plantillas/potenciacion`) |
| 5 | **Bandejas cuadradas de varios tamaños** en «Lee»; en el juego, la recta con los cuadrados marcados y el tramo de a hasta b | `arit-cuadrado` y `recta` |
| 6 | La calculadora de doña Juana con √2 en la pantalla (1,4142135) en «Lee»; en el juego, la recta de los cuadrados | `arit-calculadora` y `recta` |

`arit-cuadrado` es una pieza nueva y propia de esta unidad (no toco `arit-bandejas`, que usan Números primos y MCD):
dibuja de una a tres bandejas de caramelos, cada una con k × k llenos, los que sobran (carmín, punteados) en el borde
de la bandeja siguiente y los lugares que faltan (punteados en tinta), o un rectángulo de filas × porFila. Prueba
numérica de encuadre (4 de margen) y de rótulos que no se pisan.

## 3. Misión de «Juega» (meta que el motor comprueba; una sola manera en la grilla)

| Idea | Contexto + misión | Controles | `logrado` | Lectura en vivo |
| --- | --- | --- | --- | --- |
| 1 | «Doña Juana arma sus caramelos en bandejas.» **Elige los exponentes para que salga una bandeja cuadrada de más de 50 caramelos.** | exponente de 2 (0–4), de 3 (0–2) | 2⁴ × 3² = 144 | «72 = 2³ × 3²: el 2 tiene exponente impar, no cierra en cuadrado» |
| 2 | «En la calculadora, la cifra final de k × k sale de la cifra final de k.» **Busca una cifra final de k, distinta de 4, que haga terminar k² en 6.** | decena de k (0–9), cifra final de k (0–9) | cifra 6 | «36² = 1 296 termina en 6, como 6 × 6 = 36» |
| 3 | «Doña Juana arma la bandeja cuadrada más grande que puede.» **Arma una bandeja de 6 × 6 de la que sobren 5 caramelos.** | N (2–60) | N = 41 | «41 = 6² + 5: sobran 5, faltan 8 para 7²» |
| 4 | «Doña Juana arma un cubo macizo de cubitos de chocolate.» **Arma el cubo de 4 × 4 × 4 y que sobren 10 cubitos.** | N (1–130), cáscara pegada o aparte | N = 74 | «74 = 4³ + 10: sobran 10, faltan 51 para 5³» |
| 5 | «Bandejas cuadradas de distintos tamaños, sin que sobre nada.» **Desde 50, haz el tramo más corto que tenga 4 cuadrados.** | desde a (1–100), hasta b (1–200) | a = 50 y b = 121 | «De 50 a 121 hay 4 cuadrados: de 8² a 11²» |
| 6 | «En la calculadora no hay tecla √.» **Encierra √10 entre dos décimas seguidas.** | N (2–20), x (1–4,5 por décimas) | N = 10 y x = 3,1 | «3,1² = 9,61 ≤ 10 < 10,24 = 3,2²» |

Ningún `bien` dice la respuesta de su predicción, y ningún juego llega a ella: el juego 1 solo tiene los primos 2 y 3 (la
predicción trae un 5); el 2 no tiene el 2 021 ni números de cuatro cifras; el 3 llega a k = 7 (la predicción es con 9); el
4 llega a k = 5 (la predicción es con 8); el 5 llega a 200 (la predicción es de tres cifras); el 6 trabaja por décimas (la
predicción pide centésimas).

---

## 4. La predicción de cada idea

La app baraja las opciones. `datos` lleva solo valores, nunca la fórmula. Los errores con su estado (la investigación
previa los clasifica así; ninguno se presenta como dato de postulantes peruanos).

| Idea | Pregunta | Datos | Correcta | Distractores (código) |
| --- | --- | --- | --- | --- |
| 1 | ¿Por qué número mínimo hay que multiplicar 600 para obtener un cuadrado perfecto? | 600 = 2³ × 3 × 5²; un primo sin exponente escrito tiene exponente 1 | 6 | 30, todos los primos (AT-TODOS) · 24, duplica lo impar: 14 400 = 120² sí es cuadrado, pero no es el menor (AT-COPIA) · 2, olvida el exponente 1 del 3 (AT-EXP-UNO) |
| 2 | Doña Juana dice: «2 021 termina en 1, como 81 y 121, que son cuadrados. Entonces 2 021 también». ¿Tiene razón? | 44 × 44 = 1 936; 45 × 45 = 2 025 | No: queda entre dos cuadrados seguidos | Sí, todo número que termina en 1 es cuadrado (H-TERM, hipótesis) · No, ningún cuadrado es impar (AT-IMPAR) · No, los cuadrados solo terminan en 0, 4 o 9 (AT-POCOS-CASOS) |
| 3 | La bandeja de 9 × 9 está armada. ¿Cuántos caramelos pueden sobrar, como máximo, sin que alcance para la de 10 × 10? | 9 × 9 = 81; 10 × 10 = 100 | 18 | 19, lo que falta con la bandeja vacía (AT-MAS-UNO) · 9, una sola fila (AT-UNA-FILA) · 20, dos filas de 10 (AT-ESQUINA) |
| 4 | El cubo de 8 × 8 × 8 está armado. ¿Cuántos cubitos hay que agregar para armar el de 9 × 9 × 9? | 8 × 8 = 64; 8 × 8 × 8 = 512 | 217 | 17, copia el 2k + 1 del cuadrado (AT-COPIA-CUADRADO) · 192, solo las tres caras (AT-CARAS) · 1, cree que crece de a uno (E-RDIV/AT-UNO, hipótesis) |
| 5 | ¿Cuántos cuadrados perfectos de tres cifras hay? | 10 × 10 = 100; 31 × 31 = 961; 32 × 32 = 1 024 | 22 | 21, resta las bases sin sumar 1 (la trampa del CSV, San Marcos 2026-II) · 31, cuenta desde 1² (AT-DESDE-UNO) · 29, la raíz de la diferencia (AT-RAIZ-DIF) |
| 6 | (se conserva) √2 está entre 1,4 y 1,5, porque 1,96 < 2 < 2,25. ¿Entre qué centésimas está? | 1,41 × 1,41 = 1,9881; 1,42 × 1,42 = 2,0164; 1,45 × 1,45 = 2,1025 | Entre 1,41 y 1,42 | (los de antes) 1,45 y 1,46, el medio (AT-MEDIO) · 1,40 y 1,41 · 1,42 y 1,43 (AT-COMPROBAR) |

---

## 5. Lo que tiene que decir cada regla y adónde llega «Ahora tú»

| Idea | La regla dice | «Ahora tú» (tipos; el último, de examen) | «Así se resuelve» |
| --- | --- | --- | --- |
| 1 | Cuadrado: exponentes pares; cubo: múltiplos de 3; el menor multiplicador sube cada exponente al siguiente que sirve; el menor divisor le quita lo que sobra | cuál es cuadrado (con 4³ × 3², que lo es) · menor multiplicador para cuadrado · para cubo · menor divisor · divisores de N que son cuadrados (examen, San Marcos 2025-II) | menor multiplicador para cubo, con números que «Ahora tú» no usa |
| 2 | Un cuadrado nunca termina en 2, 3, 7 u 8, ni en una cantidad impar de ceros; si termina en 5, termina en 25. Cumplirlo no basta. Los cubos terminan en cualquier cifra | cuál no puede ser cuadrado · qué cifra final puede tener el cuadrado de un número que termina en d · cifra oculta de un cuadrado (examen, San Marcos 2023-I y 2026-I) · un número que pasa el criterio y no es cuadrado | descartar uno de cuatro, con la razón |
| 3 | k² ≤ N < (k + 1)²; r = N − k², rₑ = (k + 1)² − N; r + rₑ = 2k + 1; r ≤ 2k; si N es cuadrado, r = 0 | raíz entera y residuo · lo que falta (rₑ) · reconstruir N desde k y r · el mayor N con raíz k (examen) · datos imposibles: r > 2k | raíz y los dos residuos de un N, reconstruyendo N por dos caminos |
| 4 | k³ ≤ N < (k + 1)³; r = N − k³; faltan 3k² + 3k + 1 − r; r ≤ 3k² + 3k | raíz cúbica entera y residuo · cuántos cubitos para el cubo siguiente · reconstruir N · residuo máximo (examen) | raíz cúbica y residuo de un N de tres o cuatro cifras |
| 5 | Primera base: la menor k con k² ≥ a; última: la mayor con k² ≤ b; cantidad: última − primera + 1. Lo mismo con cubos. Cuadrados y cubos a la vez son sextas potencias | cuadrados entre a y b · cuadrados de n cifras · cubos en un tramo · cuadrados o cubos, sin contar dos veces (examen) | cuadrados entre a y b |
| 6 | x² ≤ N < (x + 0,1)² encierra √N entre x y x + 0,1; por centésimas igual; x es la aproximación por defecto, x + 0,1 por exceso, y el error es menor que el paso. La raíz no se reparte en una suma | entre qué décimas · entre qué centésimas · aproximación por defecto o por exceso · √(a + b) no es √a + √b · con error menor que 0,1 (examen) | encerrar por décimas una raíz de dos cifras |

---

## 6. Tabla de letras y símbolos (`def.letras`)

| Símbolo | Un solo significado en la unidad | Aviso |
| --- | --- | --- |
| N | el número que se estudia: los caramelos o los cubitos | Como en Divisibilidad y Números primos |
| k | la raíz entera: el lado de la bandeja cuadrada (o la arista del cubo) más grande que se arma con N | En Números primos k era «un entero»; aquí es siempre la raíz entera |
| r | el residuo: lo que sobra, N − k² (o N − k³) | En la rama, r es el resto de una división; aquí «residuo» y la letra r solo van con la raíz, y el resto de dividir se dice en palabras |
| rₑ (`r_e`) | el residuo por exceso: lo que falta para el cuadrado (o el cubo) siguiente | Como el resto por exceso de Las cuatro operaciones |
| p, q | números primos; α, β, sus exponentes en N | Como en Números primos y divisores |
| m | el menor número por el que se multiplica (o divide) N | Solo en la idea 1 |
| a, b | los extremos del tramo de a hasta b | Solo en la idea 5 (en Números primos, a era la base de una potencia) |
| x | una aproximación de la raíz, por décimas o centésimas | Solo en la idea 6 |
| √, ∛ | la raíz cuadrada y la raíz cúbica | √ ya está en el glosario (Números primos); ∛ lo estrena la idea 4 |
| × | multiplicar | Nunca «·» (el «   ·   » solo separa dos relaciones en una regla) |

---

## 7. Mapa de colores por magnitud (§5b)

Un color fijo por magnitud en las seis ideas, con su prueba en
`contenido/teoria/aritmetica/potenciacion-y-radicacion.test.js`
(`def.colores = { numero: 'o', exponente: 'i', raiz: 'f', residuo: 'h' }`).

| Token | Magnitud | Dónde se ve |
| --- | --- | --- |
| `o` naranja, «número» | N, el número que se estudia (los caramelos, los cubitos, el radicando) | N en la lectura, el punto N en la recta, el número en las cuentas |
| `i` turquesa, «exponente» | el exponente de cada primo en la factorización (ideas 1 y 2) | la columna «exponente» de la tabla, los exponentes en las cuentas |
| `f` violeta, «raíz» | k, la raíz entera (el lado), y x, la aproximación de la raíz | el lado de la bandeja, la arista del cubo, la respuesta cuando es una raíz |
| `h` carmín, «residuo» | r, lo que sobra | los caramelos que sobran (punteados), los cubitos sueltos |
| tinta | rₑ (lo que falta, con lugares punteados), m, a, b, las cantidades que se cuentan, «?» | — |
| verde | **no se usa** | antes, el cuadrado siguiente iba en verde junto al carmín del residuo |

Pares que van juntos (medidos en §5b): naranja–turquesa 0,114 (N y sus exponentes), naranja–violeta 0,189 (N y k),
violeta–carmín 0,167 (k y r), naranja–carmín 0,062 (N y r: el más bajo; el residuo siempre va con su letra r y
punteado). Lo que falta va en tinta y punteado: así la bandeja nunca junta dos colores para «sobra» y «falta».

---

## 8. Práctica: qué existía y qué se hace

**Antes:** la escena `potenciacion` (borrador, compartida con la prueba del curso por su motor: ari-19 y ari-20) y el tipo
`cubos` de `numeros-sucesiones`.

**Ahora:**
- **`plantillas/potencias-raices/`** («La bandeja cuadrada de doña Juana», formato `predicciones`), primera en la ficha,
  con `TIPOS_POR_IDEA` (cuatro tipos por idea, de nivel 1 a examen, con los de San Marcos), prueba en 400 semillas,
  `casos.json` con un caso por tipo verificado aparte en Python y papel de 8 problemas con Datos.
- **La escena `potenciacion`** pasa a «Más mesas del tema» (`"rehacer"`); su motor sigue: lo usan la mesa 3D y los
  verificadores de ari-19 y ari-20.
- **`numeros-sucesiones`**: el problema de papel del tipo `cubos` dice de qué unidad es y trae sus Datos (bloque propio).
- Dos ítems nuevos para la prueba del curso, en la reserva (las formas ya tienen 10 pares): ari-39 (el mayor N con raíz
  entera k) y ari-40 (cuadrados perfectos de n cifras).

---

## 9. Datos del mundo

Ninguno hace falta: las cantidades son de problema (caramelos, cubitos, losetas), sin fuente. Una equivalencia de libro
en la idea 4: 1 L = 1000 cm³, el volumen de un cubo de 10 cm de arista. Descarto los de la investigación (el cerámico de
45 × 45 y la moneda de un sol): no ayudan a decidir nada de la unidad.

## 10. Riesgos de orden con otras unidades (`requiere`)

- **Álgebra, «Exponentes y radicales»** pide esta unidad: aquí no van leyes de exponentes, exponente cero o negativo,
  propiedades de radicales ni exponentes fraccionarios. La única propiedad de radicales que aparece es «la raíz no se
  reparte en una suma», como trampa de una aproximación (idea 6), sin fórmula general.
- **Números primos y divisores** estrena la factorización, la raíz cuadrada (√) y la cantidad de divisores: aquí se usan.
- **Números racionales** estrena el número irracional y las cifras decimales: la idea 6 los usa (por eso el `requiere`).
- **Sucesiones y series** tiene las sumas notables (1 + 3 + 5 + … = n²): no entran aquí.
- **MCD y MCM** estrena «tramo» y el conteo con inclusión y exclusión (múltiplos de uno o de otro): la idea 5 los usa para
  cuadrados o cubos.

---

## 11. Decisiones tomadas (Gerson revisa después)

1. **El temario de Aritmética, no el de la investigación.** Seis ideas sobre cuadrados y cubos perfectos, criterios, raíz
   entera cuadrada y cúbica, conteo y aproximación. Motivo: cinco de las seis ideas de la investigación previa repiten
   «Exponentes y radicales» de Álgebra, que viene después y pide esta unidad; el catálogo, la UNI y San Marcos piden lo
   de aquí. Descartado: una idea de «qué cuenta el exponente» (E-MUL, E-SUM: los dos aparecen como distractores en los
   ejemplos) y el tramo de conjugados (es de Álgebra). **Es la que más conviene que mires.**
2. **Dos ideas nuevas: la raíz cúbica entera (`raiz-cubica`) y el conteo en un tramo (`contar`).** Motivo: la raíz
   cúbica solo estaba en una mesa 3D, y contar cuadrados es la pregunta de San Marcos 2026-II y 2022 (y cubos en
   2024-I). Descartado: la cúbica dentro de la idea 3 (su residuo máximo y su «cubo siguiente» son otra cuenta y otro
   dibujo).
3. **El objeto: la bandeja cuadrada de caramelos de doña Juana**, con una pieza propia (`arit-cuadrado`, dibujo de
   prueba). Motivo: sigue el hilo de la rama, y sobrantes y faltantes se ven en el borde de la bandeja siguiente.
   Descartado: tocar `arit-bandejas` (la usan otras dos unidades) y las losetas del patio (otro objeto más).
4. **Colores: N naranja, exponentes turquesa, la raíz violeta, el residuo carmín; lo que falta en tinta y punteado; sin
   verde.** Motivo: la teoría de antes ponía verde junto al carmín. Descartado: lo que falta en turquesa (el turquesa ya
   es de los exponentes, y una magnitud no comparte color).
5. **Letras: k para la raíz entera, r y rₑ para los residuos.** Motivo: es la notación de academia (N = k² + r) y rₑ
   repite el «resto por exceso» de Las cuatro operaciones. Descartado: q (en la rama, el cociente) y K mayúscula.
6. **El residuo por exceso solo cuando la raíz no es exacta.** La regla dice rₑ para N que no es cuadrado; con N
   cuadrado, r = 0 y no se habla de exceso. Motivo: así r + rₑ = 2k + 1 vale siempre que se escribe. Descartado: el
   convenio de la investigación (rₑ = 0 en el caso exacto), que obliga a avisar dos convenios.
7. **`aproximadas` conserva su predicción (pregunta e ids).** Motivo: sigue sin regalarse (el juego va por décimas) y no
   hay que volver a preguntarla. Cambian su juego (√10 en vez de √2, con misión), sus colores y sus Datos.
8. **`requiere` pasa a «Números racionales».** Motivo: la idea 6 usa decimales y «número irracional»; la rama ya pone
   Racionales antes y la cadena sigue llegando a Números primos (factorización y √).
9. **El avance:** `perfectos`, `exclusion` y `raiz-entera` cambian su Predice y se vuelven a preguntar una vez; quien
   había terminado las cuatro de antes conserva «Ya la estudié» (bloque en `REHECHAS_E6`, marcas `prediccionPR` y
   `estudiadaPR`, con su prueba).
10. **La escena `potenciacion` pasa a «Más mesas del tema» y la práctica nueva es `potencias-raices`.** Motivo: la escena
    no tiene Datos ni tipos por idea; su motor queda para la mesa 3D y los ítems ari-19 y ari-20.
11. **De paso, en piezas y plantillas compartidas (bloques propios):** el tipo `cubos` de `numeros-sucesiones` pasa lo
    que se pide de verde a violeta (como la teoría) y trae su recuadro de Datos; su problema de papel dice de qué unidad es
    y trae Datos. La ficha del catálogo pasa `potencial_visual` de «bajo» a «medio» (ahora hay bandeja, cubo 3D y recta).
12. **La misión de `exclusion` deja libre la decena** (36, 46, 56… cumplen): lo que se pide es la cifra final, y la
    lectura muestra justo que la decena no importa. Las otras cinco misiones tienen un solo caso en su grilla.

## 12. Fases 2 a 5 (26 nov): lo que se hizo

Las seis ideas quedaron escritas con sus 15 ejemplos (90; la letra correcta de nivel 3, 6 por letra) y su prueba propia
(`contenido/teoria/aritmetica/potenciacion-y-radicacion.test.js`: colores por magnitud; misión única rehecha por fuerza
bruta; cada Predice rehecha; «Ahora tú» en 400 semillas por idea, con la correcta rehecha desde el texto de la pregunta
por fuerza bruta y una sola opción que cumple en los tipos de «cuál»; toda igualdad cierta en 400 semillas con la marca
simulada; los nivel 3 rehechos, con una sola alternativa que cuadra). El validador con `calidad: 2` simulada no marca nada
en 400 semillas; la unidad sigue sin la marca. Pieza nueva `arit-cuadrado` (dibujo de prueba, con su prueba numérica de
encuadre y rótulos, también sobre todas las figuras y la grilla de los juegos de la unidad). Práctica nueva
`plantillas/potencias-raices` (24 tipos, cuatro por idea; 24 casos rehechos en Python fuera del repo; papel de 8). El
avance migra con `prediccionPR` y `estudiadaPR` (prueba en `nucleo/avance.test.js`). Prueba del curso: ari-39 y ari-40
en la reserva, con sus verificadores. `herramientas/ecuaciones-ancho.js`: nada que no quepa; quedan renglones partidos
después de un «=» en prosa (el caso que la app arreglará).

Lo que encontraron las pruebas propias y se corrigió antes de entregar:
- el ejemplo «Bandejas sin sobrantes» pintaba los cuadrados del tramo en la recta: se veía que eran 5. Ahora la figura
  de un ejemplo no pinta ninguno;
- `√2 = 1,4142135` en «Lee» (la calculadora redondea): va con «≈»;
- la letra m de la unidad (el menor multiplicador) aparecía en un Dato de conteo («de m hasta n»): ahora en palabras;
- en la primera versión de «Ahora tú» de la idea 3, el distractor «parte r + rₑ en dos» siempre daba la correcta (la
  mitad de 2k + 1, por defecto, es k): se cambió por «da la raíz en vez del número».
