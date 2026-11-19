# Propuesta de ideas: «División de polinomios y cocientes notables» (`algebra.division-de-polinomios`)

Etapa 6 del plan de calidad, rama «Expresiones algebraicas» (cuarta unidad, después de «Exponentes y radicales»,
«Productos notables» y «Polinomios») · encargo con criterio delegado (`docs/metodo/unidad/etapa-delegada.md`) · 19 nov 2026

Gerson: delegaste el criterio, así que esta propuesta ya está aplicada (la unidad entera, sin `calidad: 2`). Lo que decidí
sin ti está al final, en «Decisiones tomadas (Gerson revisa después)», cada punto con su motivo y la alternativa que
descarté. No encontré ningún conflicto crítico.

Lo que leí: `CLAUDE.md`, `docs/plan-calidad.md` §3, `docs/molde-unidad.md`, `docs/metodo/unidad/` (LEEME, 1-ideas,
2-ejemplos, 3-practica, reglas-validador, etapa-delegada), las decisiones de las etapas 2 a 5, la propuesta modelo
(`docs/etapa5/propuesta-algebra.md`), la unidad anterior con `calidad: 2` (`polinomios.js`, con su auditoría y su lector en
frío: `rutinas/auditoria/algebra.polinomios.md`, `rutinas/frio/algebra.polinomios.md`), la teoría actual
(`contenido/teoria/algebra/division-de-polinomios.js`), su ficha en `catalogo/cursos/algebra.json`, sus plantillas
(`plantillas/polinomios/`, la escena con p5 a p8 y p10 de esta unidad, y `plantillas/division-polinomios/`, el generador
que comparte con Factorización), `docs/temario-completo.md` §8, la nota de polinomios en
`docs/investigacion/algebra-funciones-ideas-erroneas.md` (PO1 a PO35 son hipótesis), `rutinas/teoria-algebra.md`,
`catalogo/pruebas/algebra.json` (po-01 ya es de esta unidad), `docs/datos/admision-unmsm.csv` y las unidades vecinas
(`polinomios`, `factorizacion`, `productos-notables`, `ecuaciones-polinomiales`, y `cuatro-operaciones` de Aritmética, que
estrenó D, d, q y r).

## Qué se pregunta en los exámenes

En `docs/datos/admision-unmsm.csv` hay **9 preguntas de San Marcos** de esta unidad:

| Periodo (pregunta) | Qué piden | Idea |
| --- | --- | --- |
| 2021 (35) | Volumen de una caja sin tapa como polinomio; un resto dado fija la medida | 5 (nivel 3: el resto es el valor del polinomio) |
| 2021 (41) | Polinomio de volumen con parámetros hallados por restos | 5 |
| 2023-I (38) | Cociente notable con exponentes desconocidos y un término dado | 6 (nivel 3) |
| 2023-II (40) | Número de términos dado; grado del término central | 6 (nivel 3) |
| 2024-I (37) | Resto entre un producto de dos factores lineales: evaluar en los dos números | 5 (nivel 3: el resto de grado 1) |
| 2025-I (38) | Identidad de la división evaluada en un punto para fijar un exponente | 1 (nivel 3) |
| 2025-II (38) | Resto entre un binomio de grado 1. Trampa: evaluar en el coeficiente del divisor y no en el número que lo anula | 5 |
| 2026-I (39) | Número de términos de un cociente notable y posiciones centrales en una fila | 6 |
| 2027-I (40) | Polinomio mónico de grado 2 con restos dados y una división exacta | 1 y 5 (nivel 3) |

**Teorema del resto (cuatro) y cocientes notables (tres)** se llevan casi todo. Las otras dos usan la identidad
D = d · q + r evaluada en un número. El banco Cuzcano trae unas 31 fichas (teorema del resto 6, algoritmo 5, divisibilidad
5, restos especiales 4, condición de cociente notable 3). En el repo no hay preguntas de la UNI clasificadas (semana 6 de su
sílabo). La prueba del curso tiene un ítem de la unidad (po-01, teorema del resto).

---

## 0. Diagnóstico de la teoría actual contra el contrato

`division-de-polinomios.js` (v0.2.0, `estado: 'completa'`, sin `calidad: 2`) tenía 5 ideas (`algoritmo`, `ruffini`,
`divisor-k`, `teorema-resto`, `cocientes-notables`) y tres mesas con retos comprobados. Se quedan: la tabla de la
división larga, la flecha «multiplica y suma» de Ruffini, «el resto no se divide entre k» y la mesa del cociente con «+».

1. **Punto 1: ninguna primera pantalla tiene un objeto.** Cuatro ideas juegan con tablas y una con curvas.
2. **Puntos 2, 3 y 12:** no hay `mision`, `leyenda`, `aprendizaje`, `actividad` ni `pregunta`; las consignas describen
   controles.
3. **Punto 13:** ningún ejercicio trae `datos`; no hay ejemplos resueltos (0 de 75); el glosario no tiene `simple` ni tres
   ejemplos.
4. **No adelantar Factorización:** Lee de la idea 4 define «factor», Mira factoriza x² − 2x − 3 = (x − 3)(x + 1) y la
   lectura dice «x − a es factor de P». Es el teorema del factor, que es de la unidad siguiente.
5. **Regla 3:** la lectura del juego de `algoritmo` da Q y R en vivo; la del juego de `cocientes-notables` dice «Q tiene n
   términos», que es media respuesta de su predicción.
6. **«Así se resuelve» es «Ahora tú» con la semilla + 900** en las cinco ideas, y «Ahora tú» no llega a examen: no hay
   cociente notable con exponentes ni término central, ni resto con divisor de grado 2, ni identidad evaluada.
7. **§5b: colores viejos.** Q verde junto al naranja de P (protanopía: 0,010) y R en carmín (es de los ángulos).
8. **Punto 7:** las lecturas separan con «   ·   » («Q = x + 1 · R = 2»), que en álgebra se lee como un producto.
9. **No hay división entre un polinomio de grado 2** (Horner solo se nombra en una condición), aunque «Métodos de Horner y
   Ruffini» es un tema del catálogo y dos preguntas de San Marcos tienen divisor de grado 2.
10. Detalles: la cabecera dice «3.º de secundaria»; P, D, Q, R no siguen las letras D, d, q, r que la rama ya enseñó en
    «Las cuatro operaciones».

---

## 1. Las ideas, en orden

**Seis ideas.** Las cinco de hoy conservan su `id` y entra una nueva en el segundo lugar. No hace falta partir la unidad
(decisión 1).

| # | `id` | Título | `aprendizaje` |
| --- | --- | --- | --- |
| 1 | `algoritmo` | Algoritmo de la división | Dividir D entre d es hallar q y r con D = d · q + r, con r de grado menor que d; el grado de q es el de D menos el de d. |
| 2 | `horner` (nueva) | División clásica y Horner | Se divide el primer término de lo que queda entre el primero de d, se resta d por ese término y se repite hasta que lo que queda tenga grado menor que d. |
| 3 | `ruffini` | Regla de Ruffini | Para dividir entre x − a se baja el primer coeficiente y cada casilla nueva es el coeficiente de arriba más a por la casilla anterior; la última es el resto. |
| 4 | `divisor-k` | Divisor de la forma cx + b | Para dividir entre cx + b se usa Ruffini con x = −b/c, y el cociente que sale se divide entre c; el resto no cambia. |
| 5 | `teorema-resto` | Teorema del resto | El resto de dividir D(x) entre x − a es D(a); si vale 0, la división es exacta y D es divisible entre x − a. |
| 6 | `cocientes-notables` | Cocientes notables | (xⁿ − aⁿ) ÷ (x − a) es exacta y tiene n términos: en el de lugar k, x lleva n − k y a lleva k − 1. |

`pregunta` (Resumen): 1 «¿Qué buscas cuando divides un polinomio entre otro?» · 2 «¿Cómo se divide entre un polinomio de
grado 2?» · 3 «¿Cómo se divide rápido entre x − a?» · 4 «¿Qué cambia si el divisor empieza con 2x o 3x?» · 5 «¿Cómo
hallas el resto sin hacer la división?» · 6 «¿Cómo escribes un término de xⁿ − aⁿ entre x − a sin dividir?».

**Por qué va cada una ahí y qué da por sabido**

1. **Algoritmo.** La base: qué se busca al dividir. Sigue a «Las cuatro operaciones» (D = d · q + r con números) y usa
   las piezas de Polinomios. Da por sabido el grado, el polinomio completo y ordenado, y multiplicar polinomios.
2. **Horner (nueva).** El procedimiento general, columna por columna, para cualquier divisor; Horner es la misma cuenta en
   una tabla. Necesita la identidad de la idea 1.
3. **Ruffini.** El atajo de la idea 2 cuando d = x − a. Pide el polinomio completo (los 0 de Polinomios, idea 4).
4. **Divisor cx + b.** Ruffini (idea 3) con el divisor partido en c(x + b/c).
5. **Teorema del resto.** La identidad (1) evaluada en x = a; Ruffini (3) es la comprobación. Divisibilidad: resto 0. Su
   nivel examen trae el divisor de grado 2 con dos números que lo anulan (San Marcos 2024-I) y el volumen de una caja.
6. **Cocientes notables.** Ruffini con ceros en medio (3) y la división exacta (5). Al final, porque usa todo.

**Qué no entra** (es de otra unidad): «si D(a) = 0, x − a es factor», divisores binómicos y MCD y MCM (Factorización,
`teorema-factor`); raíces, su número y Cardano-Vieta (Ecuaciones polinomiales). Aquí «D(a) = 0» solo dice que la división
es exacta: no se dice «raíz» ni «factor» como teorema. Los restos especiales con x² = k van como nivel 3 de un ejemplo, con
su dato.

---

## 2. Objeto de la primera pantalla

Sigue el hilo de la rama: **el maestro Rubén enchapa pisos en Juliaca** con losetas de x dm de lado, tiras de x por 1 y
cuadraditos de 1 por 1 (Polinomios). Dividir es acomodar un pedido en un rectángulo de ancho dado.

| Idea | Objeto (primera tarjeta de «Lee» y juego) | Qué es cada cosa |
| --- | --- | --- |
| 1 | **Un pasadizo de (x + 2) dm de ancho** que Rubén enchapa con su pedido de x² + 5x + 7 dm² | D = todo el pedido; d = el ancho; q = el largo; r = lo que sobra |
| 2 | **La hoja del cuaderno de Rubén**, con la división por columnas, como la del colegio | cada columna, una potencia de x; la fila de abajo, lo que queda |
| 3 | **La misma hoja**, con la tabla de tres filas de Ruffini | arriba, los coeficientes de D; a la izquierda, a; abajo, q y r |
| 4 | **El pasadizo, ahora 2, 3 o 6 veces más ancho** con el mismo pedido 6x² + 6x + 1 | más ancho, más corto: el largo se divide; lo que sobra no |
| 5 | **Un piso partido en un rectángulo de (x − 2) por (x + 3) dm y 7 cuadraditos sueltos**, que se angosta al achicar la loseta | con x = 2 el rectángulo desaparece y solo quedan los 7 dm² del resto |
| 6 | **La calculadora**, que con x = 10 muestra un cociente notable como número: 9984 ÷ 8 = 1248 | las cifras 1, 2, 4, 8 son las potencias de 2 |

Pieza nueva del kit: **`alg-reparto`** (dibujo de prueba, `data-prueba`), con los objetos `pasadizo`, `cuaderno` (división
por columnas, Horner y Ruffini en una hoja) y `angosto`, y su prueba numérica de encuadre y rótulos. La calculadora es
`arit-calculadora` (Las cuatro operaciones), que no cambia. `alg-losetas` (Polinomios) no se toca.

---

## 3. Misión de «Juega»

| Idea | Contexto + misión | Controles | `logrado` | Lectura en vivo |
| --- | --- | --- | --- | --- |
| 1 | «Rubén acomoda su pedido de (x² + 5x + 7) dm² en un pasadizo de (x + 2) dm de ancho.» **Arma el pasadizo más largo que puedas sin dejar huecos; lo que no entre queda aparte.** | `k`: tramos de 1 dm del largo, 0–4 | `k === 3` | «(x + 2)(x + 3) + 1 = x² + 5x + 7» |
| 2 | «Rubén divide x³ + 4x² + x − 2 entre x² + x − 1 en su cuaderno.» **Elige el cociente para que lo que queda tenga grado menor que el divisor.** | coeficientes de q, −3 a 3 | q = x + 3 | «Queda −x + 1: grado 1 < 2» |
| 3 | «Rubén divide x³ + 2x² − x + 3 entre x − a con la tabla corta.» **Elige a para que el cociente sea x² + 4x + 7.** | `a`, −3 a 3 | `a === 2` | «(x − 2)(x² + 4x + 7) + 17 = x³ + 2x² − x + 3» |
| 4 | «El mismo pedido, (6x² + 6x + 1) dm², en pasadizos más anchos.» **Elige el ancho para que el pasadizo mida 3x dm de largo.** | `c`: 1, 2, 3 o 6 (ancho cx + c) | `c === 2` | «(2x + 2) · 3x + 1 = 6x² + 6x + 1» |
| 5 | «El piso cubre x² + x + 1 dm²: un rectángulo de (x − 2) por (x + 3) dm y 7 cuadraditos.» **Achica la loseta hasta que el rectángulo desaparezca.** | `x`: 2 a 6 dm, de medio en medio | `x === 2` | «D(5) = (5 − 2) · 8 + 7 = 31 dm²» |
| 6 | «Con x = 10, un cociente notable se lee en la calculadora.» **Haz que la calculadora muestre 1248.** | `n` 2–5, `a` 1–3 | `n === 4 && a === 2` | «(x⁴ − 2⁴) ÷ (x − 2) = x³ + 2x² + 4x + 8» |

Cada misión tiene un solo caso en toda su grilla (lo comprueba la prueba propia). Para que la predicción quede fuera de
lo jugado: el juego 1 divide grado 2 entre grado 1 (la predicción, grado 7 entre grado 3); el 2 tiene divisor con primer
coeficiente 1 (la predicción, 2x²); el 3 divide un polinomio completo (la predicción tiene un término que falta); el 4 no
usa fracciones (la predicción, x = 1/2); el 5 nunca evalúa un negativo; el 6 llega a n = 5 (la predicción, n = 6).

---

## 4. La predicción de cada idea

La app baraja las opciones. `datos` lleva solo valores y equivalencias. Todo error es hipótesis (PO de
`plantillas/polinomios/`; TAL-, hipótesis de diseño que van a `rutinas/teoria-algebra.md` al cerrar). Ninguna predicción
repite un código.

| Idea | Pregunta y datos | Correcta | Distractores (código) |
| --- | --- | --- | --- |
| 1 | «Se divide un D de grado 7 entre un d de grado 3. ¿Qué grado tiene el cociente q?» Datos: el grado es el mayor exponente de x; xᵐ · xⁿ = xᵐ⁺ⁿ | 4 | 10, suma los grados (TAL-GRADO-SUMA) · 3, el grado de d (TAL-GRADO-DIVISOR) · 2, el mayor grado del resto (TAL-RESTO-COC) |
| 2 | «Se divide 6x⁴ + x³ + 4x − 1 entre 2x² + x − 1. ¿Cuál es el primer término del cociente?» Datos: xᵐ ÷ xⁿ = xᵐ⁻ⁿ | 3x² | 6x², no divide entre el 2 (TAL-COEF-PRINC) · 3x⁶, suma los exponentes (TAL-EXP-SUMA) · 4x², resta los coeficientes (TAL-COEF-RESTA) |
| 3 | «Con la tabla de Ruffini, ¿cuál es el resto de dividir 2x³ − 5x + 1 entre x − 2?» Datos: x − 2 vale 0 con x = 2 | 7 | −1, sin la casilla del 0 (PO1) · −5, usa −2 (PO2) · 6, solo multiplica sin sumar (TAL-RUF-PRODUCTO) |
| 4 | «Se divide 4x² − 2x + 5 entre 2x − 1. Ruffini con x = 1/2 deja 4, 0 y 5. ¿Cuál es el cociente?» Datos: 2x − 1 se anula en x = 1/2 | 2x | 4x, el cociente falso (PO3) · 2x + 5, mete el resto (TAL-RESTO-EN-Q) · 8x, multiplica por 2 (TAL-K-MULT) |
| 5 | «¿Cuál es el resto de dividir x⁵ − 3x² + 7 entre x + 1?» Datos: x + 1 = x − (−1) | 3 | 5, evalúa en 1 (PO8) · 7, el término independiente (PO27) · 9, (−1)² como −1 (PO15) |
| 6 | «En el cociente de (x⁶ − 64) ÷ (x − 2), ¿cuál es el cuarto término?» Datos: 64 = 2⁶ | 8x² | 16x², a con exponente 4 (TAL-TK-EXP) · 8x³, x con exponente de más (TAL-TK-X) · 4x³, el tercer término (TAL-CONTEO) |

---

## 5. Tabla de letras y símbolos

| Símbolo | Un solo significado en la unidad | Aviso |
| --- | --- | --- |
| D, d, q, r | dividendo, divisor, cociente y resto; D(x), d(x), q(x), r(x) cuando importa la letra | Las mismas de «Las cuatro operaciones» (D = d · q + r con números); se recuerda en Lee 2 de la idea 1. **D y d se distinguen por la mayúscula y por el color** (d turquesa) |
| q′ | el cociente falso: lo que da Ruffini con divisor cx + b, antes de dividir entre c | Se presenta en la idea 4 |
| x, y | las variables; en las ideas 1, 4 y 5, x es el lado de la loseta en dm | y solo en cocientes notables con dos letras |
| a | el número que anula al divisor x − a (Ruffini, teorema del resto) y la segunda base de xⁿ − aⁿ | Es el mismo número: x − a se anula en a |
| c, b | en el divisor cx + b, el primer coeficiente y el término independiente | Se usa c y no k (k es el lugar de un término) ni a (ya es el número de x − a) |
| n | el exponente de xⁿ − aⁿ, que es también el número de términos de su cociente | |
| k | el lugar de un término del cociente notable: t_k | |
| m | un número por hallar (divisibilidad), o un exponente cualquiera en una ley (xᵐ · xⁿ) | Como en Polinomios |
| P, V | el nombre de un polinomio en un enunciado (P(x) = …); V(x), el volumen de una caja | Se dicen en el enunciado |
| ÷ y la raya | «dividido entre»; la fracción solo en x = −b/c y q′/c | |

## 6. Mapa de colores por magnitud (§5b)

Sigue a la rama y a «Las cuatro operaciones»: **el total en tinta, violeta para el resultado y para lo que se olvida.**

| Token | Magnitud |
| --- | --- |
| tinta | el dividendo D (el pedido entero, el total), las letras x e y, y lo que se pide con «?» |
| `i` turquesa | el divisor d (el ancho del pasadizo) y lo que sale de él: a, c y b, y la flecha «multiplica por a» |
| `f` violeta | el cociente q (el largo), q′ y los términos del cociente notable: lo que casi siempre se pide; y los 0 de las potencias que faltan (lo que se olvida), como en Polinomios |
| `o` naranja | el resto r (lo que sobra), como en «Las cuatro operaciones» (lo que queda suelto) |
| `h` carmín, `d` verde | **no se usan** |

Pares que van juntos: turquesa–violeta 0,101, naranja–violeta 0,189, naranja–turquesa 0,114 (molde §5b). En las figuras de
Predice y de los ejemplos, lo pedido va con «?» en tinta. Las piezas se distinguen por su forma; el color solo dice si
forman el rectángulo (tinta) o sobran (naranja).

---

## 7. Práctica: qué existe y qué falta por idea

**Hoy:** la escena `polinomios` (la máquina de Ruffini, borrador 0.1.0) es la escena principal de la unidad, con p5 a p8 y
p10 de esta unidad; y el generador `division-polinomios` (borrador), que comparte con Factorización y mezcla cocientes
notables, restos e identidades con MCD y MCM de polinomios (que son de Factorización).

| Idea | Tipos nuevos (plantilla `division-practica`, formato `predicciones`) |
| --- | --- |
| 1 Algoritmo | grado del cociente · grado máximo del resto · D a partir de d, q y r · suma de coeficientes de D · identidad evaluada en 0 (San Marcos 2025-I) |
| 2 Horner | primer término del cociente · un coeficiente del cociente · resto entre un divisor de grado 2 · divisible entre uno de grado 2: halla m + n |
| 3 Ruffini | casilla de la tabla · cociente completo · resto con un término que falta · suma de coeficientes del cociente |
| 4 Divisor cx + b | cociente · resto · un coeficiente del cociente · cociente con fracción (x = −b/c no entero) |
| 5 Teorema del resto | resto entre x − a · resto entre x + a con potencias de un negativo · divisible: halla m · resto entre (x − a)(x − b) con dos restos dados (San Marcos 2024-I) · resto del volumen de una caja (San Marcos 2021) |
| 6 Cocientes notables | término de lugar k · con signos alternados · número de términos · grado del término central (San Marcos 2023-II) · exponentes por hallar (San Marcos 2023-I) |

`TIPOS_POR_IDEA`, prueba en 400 semillas, `casos.json` verificado aparte y papel con datos. La escena `polinomios` pasa a
«Más mesas del tema» también aquí (`"rehacer"` con las dos unidades). El generador `division-polinomios` sale de esta
unidad y queda en Factorización (decisión 6). Dos ítems nuevos de la unidad, a la reserva de la prueba del curso (las formas
ya tienen 10 pares): dp-01, el grado del término de lugar k de un cociente notable con potencias, y dp-02, la suma de
coeficientes del cociente con divisor cx + b, con su verificador en `catalogo/pruebas/verificar.js`.

## 8. Datos del mundo

| Dato | ¿Fuente? |
| --- | --- |
| Losetas de 2 a 6 dm, tiras de 1 dm de ancho, cuadraditos de 1 dm; el pasadizo y el piso | Valores de problema, posibles, sin fuente (los mismos de Polinomios) |
| La caja sin tapa (cartulina de 30 cm por 20 cm, cortes de 2 a 5 cm) | Valores de problema, sin fuente |
| Historia: Horner, 1819 y 1830 | Ya publicada con su fuente (MacTutor). Se queda tal cual |
| Paolo Ruffini | Solo el nombre, sin fechas ni obra (no se volvió a leer una fuente) |

## 9. Riesgos de orden (`requiere`)

- `requiere` no cambia: `algebra.polinomios` (grado, completo y ordenado, valor numérico, producto). D, d, q y r vienen de
  `aritmetica.cuatro-operaciones`, que Polinomios ya pide.
- **No se adelanta Factorización:** ni «factor» como teorema, ni divisores binómicos, ni «raíz». «D(a) = 0» se dice
  «división exacta» y «divisible».
- «Coeficiente», «término independiente», «grado», «completo» y «ordenado» están definidos en otras unidades del curso: aquí
  salen como «Se explica en…».
- «Cociente» está definido en Inecuaciones («el resultado de dividir»). Aquí va como término `local` (vale en esta unidad)
  con su sentido de la división de polinomios (decisión 8).
- La idea 2 usa solo la identidad de la idea 1; la 5 usa la identidad (1) y Ruffini (3) como comprobación; la 6 usa Ruffini
  y la división exacta (5). Ninguna usa algo posterior.

---

## 10. Decisiones tomadas (Gerson revisa después)

1. **Entra la idea `horner` («División clásica y Horner») en el segundo lugar; la unidad queda en seis.** Motivo: «Métodos
   de Horner y Ruffini» es un tema del catálogo y no se enseñaba a dividir entre un polinomio de grado 2. Descartado:
   dejar Horner como una línea de la condición de Ruffini.
2. **Las letras son D, d, q y r**, las de «Las cuatro operaciones», en vez de P, D, Q, R. Motivo: la rama ya las enseñó con
   números y la academia escribe D(x) = d(x) · q(x) + r(x). Descartado: P, D, Q, R (D cambiaba de papel entre unidades).
3. **Colores: el dividendo en tinta (el total), el divisor turquesa, el cociente violeta, el resto naranja.** Motivo: el
   «total en tinta» de la rama y el resto naranja y el divisor turquesa de «Las cuatro operaciones». a va en turquesa porque
   sale del divisor. Descartado: el dividendo naranja como «primer polinomio» de Polinomios (dejaba el resto sin color).
4. **El divisor de la idea 4 se escribe cx + b** y no kx + b ni ax + b. Motivo: k es el lugar de un término (t_k, como en
   los libros) y a el número de x − a. Descartado: kx + b de la versión anterior.
5. **Teorema del resto sin «factor»**: la división exacta y «divisible» bastan para la divisibilidad. Motivo: «si P(a) = 0,
   hay factor» es la idea `teorema-factor` de Factorización. Descartado: dejar la factorización de Mira.
6. **Práctica:** plantilla nueva `division-practica` por idea, primera en la ficha; la escena `polinomios` va a «Más mesas
   del tema» en esta unidad. **El generador `division-polinomios` se queda en la ficha** (cambio del 19 nov, al escribir la
   práctica): sacarlo obligaba a tocar `nucleo/repaso-tipos.js` y su `plantilla.json`, que comparte con Factorización, y
   su prueba de «generador mixto». Pendiente para Gerson: sus MCD y MCM de polinomios (de Factorización) salen hoy en la
   práctica y en los exámenes de esta unidad (el repaso ya los manda a Factorización). Descartado: separar sus tipos por
   unidad (archivo compartido que Factorización rehará).
7. **El resto con divisor de grado 2** (San Marcos 2024-I) va como nivel examen del teorema del resto, con la condición «con
   d de grado 2, r tiene grado 1 a lo más». Los restos especiales con x² = k van en un ejemplo de nivel 3 con su dato.
   Descartado: una séptima idea de restos especiales.
8. **«Cociente» va como término `local`**, porque Inecuaciones lo define con otro sentido. Descartado: mudar la definición
   (tocaría otra unidad).
9. **La calculadora de la idea 6 es `arit-calculadora`** (sus casillas van en turquesa, que aquí es el color del divisor;
   la leyenda no la nombra). Descartado: dibujar otra calculadora.
10. **Lee de Ruffini** nombra a Paolo Ruffini sin fechas: la fecha de 1804 de la versión anterior no tenía fuente.
11. **Títulos con el nombre del tema** («Algoritmo de la división», «Regla de Ruffini»), como en la etapa 4; los `id` no
    cambian.
12. **Ficha del catálogo:** `potencial_visual: alto`, `investigacion` apuntando a
    `docs/investigacion/algebra-funciones-ideas-erroneas.md` (la nota de PO1 a PO35); `grado` sin tocar.

## Cambios (19 nov, al escribir las ideas 2 a 6 y la práctica)

1. **Notas de la sesión sobre la idea 1:** los pedidos se escriben con paréntesis y unidad («(x² + 5x + 7) dm²»); la
   misión pasa a «Arma el pasadizo más largo que puedas sin dejar huecos; lo que no entre queda aparte» (sigue con un solo
   caso, k = 3); cada medida dice qué es donde está dibujada («ancho:», «largo:»).
2. **Idea 2, juego:** el dividendo pasa a x³ + 4x² + x − 2 (q = x + 3, queda −x + 1): con el anterior, «3x²», la
   respuesta de la predicción, se leía en la consigna.
3. **Idea 4, misión:** «que el pasadizo mida 3x dm de largo» (c = 2). La de 2x hacía que el «bien» dijera «el largo es
   2x», la respuesta de su predicción. Lee dibuja el pasadizo de ancho 6x + 6 (no el de la misión).
4. **Idea 4, glosario:** estrena «cociente falso» (q′) y «mónico»; la idea 3, «regla de Ruffini» y «anular»; la idea 2,
   «división clásica», «método de Horner» y «división exacta». Todos con `simple` y tres ejemplos.
5. **Cocientes notables con potencias:** el dato dice «Si el divisor es x² − y³, el dividendo debe ser (x²)ⁿ − (y³)ⁿ»,
   con los números de cada problema, para no sumar letras a la tabla. En los exponentes por hallar (San Marcos 2023-I) las
   letras son m y s (o m y t en la práctica), porque n ya es el número de términos.
6. **Laboratorio:** las tres mesas de la ronda 2 se quedan con los colores y las letras nuevas (D, r, a); la de Ruffini
   dibuja la tabla en el cuaderno.
