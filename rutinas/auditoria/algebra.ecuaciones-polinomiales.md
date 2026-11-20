# Auditoría de contenido: «Ecuaciones polinomiales» (algebra.ecuaciones-polinomiales)

20 nov 2026. Auditor externo (cierre con criterio delegado, `docs/metodo/unidad/cierre-delegado.md`; encargo de
`docs/metodo/unidad/5-auditor.md`), que no escribió la unidad. Contrato: `docs/plan-calidad.md` §3 y §5. Formato:
`docs/teoria.md`. Vara: `docs/molde-unidad.md` §10. Reglas automáticas: `docs/metodo/unidad/reglas-validador.md` y lo que
encontraron los auditores de las Etapas 5 a 7 (`docs/metodo/unidad/etapa-delegada.md`). Decisiones:
`docs/etapa8/propuesta-algebra.md` (§10 y «Cambios»). Lo que vieron los dos lectores en frío está en
`rutinas/frio/algebra.ecuaciones-polinomiales.md`; aquí se cita cuando el código lo confirma o lo agrava.

**Qué se revisó.**
- La teoría `contenido/teoria/algebra/ecuaciones-polinomiales.js` (v0.3.0, sin `calidad: 2`, todavía sin commit):
  - las 6 ideas con sus 7 momentos y los 90 ejemplos;
  - «Ahora tú» y «Así se resuelve», 400 semillas de cada uno por idea;
  - el glosario (17 términos), las 2 mesas del laboratorio (sus lecturas en toda la grilla), las letras y la historia;
  - la prueba propia `ecuaciones-polinomiales.test.js`.
- Las piezas: `alg-caja` (nueva) y la opción `ajustado` de `ejes` (compartida); las demás (`alg-tabla`, `alg-reparto`,
  `alg-objeto`, `recta`) no se tocaron al escribir la unidad.
- La práctica `plantillas/ecuaciones-polinomiales-practica/` (24 tipos, 4 por idea, `casos.json` y `papel.json`), y que
  `ecuaciones-polinomiales` y `polinomios` vayan a «Más mesas del tema» con `rehacer`.
- La prueba del curso: ep-01 y ep-02 en la reserva, con su verificador en `catalogo/pruebas/verificar.js`.
- La app a 390 px con `--entera`: los 42 momentos y los 90 ejemplos. Servidor propio en el puerto 4453.

**Cuentas.** Rehechas con scripts propios en
`/tmp/claude-0/-home-user/31d0ae9f-8026-5866-a5dc-2c8554ea89bf/scratchpad/e8-cierre-ep/scripts/`, sin el código de la
unidad ni los scripts del autor (`e8-algebra/scripts`). `volcar.js` solo saca a JSON el texto que ve el alumno (teoría,
textos de las figuras y práctica); `expr.py` lo lee con un analizador propio (superíndices, miles con espacio, √, i,
producto implícito) y sympy hace todo lo demás:
- **Conteos de raíces** (reales con multiplicidad, no reales, distintas, total): `Poly.real_roots` y el grado, en los 6
  tipos que cuentan (factorizados con repetidas y x² + c; lineal por trinomio con Δ de los dos signos; bicuadradas;
  binómicas xⁿ = c con n de 3 a 8 y los dos signos).
- **Cardano-Vieta con su signo**: la suma, el producto y la suma de inversos salen de las raíces de verdad
  (`all_roots`, a 40 cifras), no de −b/a, c/a y −d/a; la k de «dos raíces dadas» con `solve` en la primera raíz y
  comprobada con la segunda; la generalización de la unidad (producto de las cuatro raíces de grado 4 =
  independiente/a) multiplicando las cuatro raíces. Además `distractores.py` rehace el valor de cada distractor de
  Cardano-Vieta con su error (a·S, −S, M, V, −M/V, V/M, 1/S, c/d): 900 de la teoría y 998 de la práctica, todos
  cuadran.
- **Raíces racionales**: la lista de candidatos ±p/q reducidos y su número; en cada «¿cuál NO puede ser raíz?», cuáles
  opciones no son candidatas (tiene que ser una sola, la marcada); las otras dos raíces con Ruffini (`quo`); la arista
  mayor de la caja (única raíz positiva de x(x + a)(x + b) − V).
- **Compañeras**: el polinomio mínimo sobre los racionales de la raíz dada (`minimal_polynomial`); una opción es raíz
  «seguro» si lo anula. Así se mide también si hay dos respuestas. El factor de grado 2 es ese polinomio; el menor grado
  suma los grados de los polinomios mínimos distintos; la raíz real de x³ + bx² + cx + d es −d/(producto de la pareja).
- **Recíprocas**: cada opción Q(t) se prueba con x² · Q(x + 1/x) = P(x) desarrollado.
- **Binómicas**: las raíces no reales de x³ = c suman y multiplican lo que dice la opción (raíces numéricas).
- **«Así se resuelve»** (`resuelve.py`, 2 400 casos): cuántas reales y no reales; la suma de cuadrados de las raíces; la
  raíz no entera (y el valor P(número) del candidato que falla); la cúbica (anula la raíz no real y la real, mónica, de
  coeficientes enteros); las cuatro raíces de la bicuadrada; las tres de x³ = c (cada una al cubo da c, distintas).
- **Igualdades** (`igualdades.py`): toda cadena «… = … = …» de números (con √ e i) que ve el alumno, en Lee, lecturas
  del juego en toda su grilla, misiones, Predice, Mira, regla, ejemplos, «Así se resuelve» y «Ahora tú» en 400 semillas,
  glosario, laboratorio y práctica en 400 semillas por idea: **1 441 distintas, todas ciertas** (1 439 después de
  corregir).
- **Ejemplos**: los 90, a mano y con sympy; los 30 de nivel 3 con sus 120 explicaciones de distractor.

Resultado antes de corregir: **2 400 «Ahora tú» de la teoría y 2 400 problemas de la práctica**, la correcta vale lo que
se pide y ninguna otra opción lo vale, **salvo en el tipo `companera` de la práctica (A1)**; 2 400 «Así se resuelve»
correctos; ningún distractor de Cardano-Vieta con un valor que no sea el de su error. ep-01 y ep-02 rehechos a mano:
k = 31 y 38 (tercera raíz 5, producto 30 y 40); 2 reales en x⁴ + 5x² − 36 y x⁴ + 6x² − 7. `pruebas.test.js` 63 de 63.

Validador con `calidad: 2` simulada (`Teoria.problemas`, 200 semillas): **0 problemas y 0 pendientes**, antes y
después. `herramientas/ecuaciones-ancho.js`: «todo cabe», antes (604 renglones) y después (615). Regla del papel con la
marca simulada: sin faltas. Pruebas propias en verde antes de corregir (unidad 9, práctica 36, `alg-caja` 3,
`ejes` 12). **Ninguna de las faltas de abajo la veía una regla de hoy ni una prueba propia.**

**Lo que pedía el encargo, uno por uno.**
- *Lo de «Ecuaciones de primer y segundo grado» como dato* (decisión 1): la fórmula general, Δ y la suma y el producto
  de una cuadrática van en los datos de casi todo ejercicio que los usa; faltaba Δ en dos ejemplos (M2).
- *«Raíz no real» y la i como decide la propuesta* (decisiones 3 y 5): «compleja» no aparece en ningún texto del alumno;
  «número complejo» solo en el glosario (decisión de «Cambios» 6) y en Lee 3 («se explica en Números complejos»); ni
  módulo, ni plano, ni forma polar. Pero la i salía sin su dato i² = −1 en seis ejercicios (M2), y el glosario definía
  «número complejo» como a + bi, con a y b, que en la unidad son coeficientes (B7).
- *Las aristas de `alg-caja`*: en el juego, las tres medidas son las raíces de (x − largo)(x − ancho)(x − alto) y la
  lectura da −b como su suma y −d como su volumen, con el signo cambiado (125 casos); en los ejemplos de la caja las
  medidas dibujadas son las raíces del polinomio del enunciado (2, 3, 5; 1, 3, 4; 3, 4, 5) con «?» en las tres aristas;
  en Lee 3 y en «Una caja de 120 dm³» la caja no está a escala de la raíz (3 por 4 por 5; 4 por 5 por 6) y los rótulos
  son x, x + 1 y x + 2: no regala el valor. La prueba de la pieza comprueba la proporción y el encuadre.
- *Misión de la idea 1 con una sola salida*: d de 0 a 4, solo d = 2 la cumple (1 de 5); no está cumplida al abrir. Las
  otras: idea 2, una caja (las 6 permutaciones de 2, 3, 4); 3, 4, 6, un caso; 5, el par {4, 9}.
- *Ninguna figura regala una predicción*: las seis figuras de Predice traen «?» o nada (la gráfica de grado 5 no rotula
  sus cortes; la tabla de coeficientes deja el producto en «?»; la recta de la bicuadrada, vacía); ninguna lectura de
  juego dice la respuesta de su Predice (en la idea 5, «2» sale en 62 de 196 lecturas como raíz ±2, no como el número de
  raíces de x⁴ + 3x² − 4). Las figuras de los ejemplos no escriben la respuesta (la tabla de Ruffini de «Bajar el grado»
  trae la fila 1, 4, 3, que es el primer paso del resuelto, no las raíces).

## Hallazgos

### Alta (el alumno no puede resolver o aprende algo falso)

| # | Punto | Dónde | Evidencia | Corrección propuesta |
|---|---|---|---|---|
| A1 | regla 3 de la Etapa 5 (una sola respuesta) | Práctica `companera` (96 de 96 problemas en 400 semillas) | «2 + i es raíz de un polinomio con coeficientes enteros. ¿Cuál de estos números también es raíz, seguro?» con 2 + i entre las alternativas (error TAL-PIDE). 2 + i es raíz seguro: con el polinomio mínimo de sympy, dos alternativas lo anulan. La teoría no lo hace. | Quitar la raíz dada de las alternativas. Prueba en 1 600 semillas. |
| A2 | 1, 4, 7; lector B | Idea 5: la recta del juego (196 casos), de Mira y La regla (u = 1 y 9) y el revelar de Predice | Los valores de u se dibujaban como puntos turquesa sobre la recta de x (u = 9 en la posición 9, u = −1 sobre −1). Leído como figura: u = −1 da x = −1 y u = 1 da solo x = 1; la altura de los puntos no decía nada (lector B; nota de la sesión). La lectura solo repetía los dos u. | La recta es la de x: solo raíces. Cada u positivo, una cota turquesa «u = 4» entre −√u y √u en su propia fila; un u negativo no pone nada, y la lectura dice qué da cada u («u = −1: ninguna real»). Prueba en la grilla entera. |

### Media (el alumno se traba o duda)

| # | Punto | Dónde | Evidencia | Corrección propuesta |
|---|---|---|---|---|
| M1 | 6 (palabra falsa); lector B | Voz de La regla y de «Ahora tú» de la idea 4, solución de «Ahora tú» tipo 0, ejemplo «La trampa del signo», práctica `companera` | «La conjugada conserva la parte entera»: la parte entera de 2 + √3 es 3, no 2; en −1 + 2√2 tampoco se sabe cuál es. | «el número sin √ ni i». Prueba en teoría y práctica. |
| M2 | 13; decisiones 1 y 3 | Ejemplos «Una caja de 120 dm³» (usa Ruffini y Δ = 49 − 120 sin datos) y «Las reales de x⁶ = 64» (Δ < 0 sin dato); seis ejercicios que escriben con i sin i² = −1 («La compañera con i», «La trampa del signo», «¿Cuántas reales?», «El menor grado», «Sin raíces reales», «La suma de las no reales») y «Ahora tú» tipo 2 de la idea 4 (25 de 100) | La propuesta dice que Δ y la i van siempre como dato. | Los datos que faltan. Prueba: todo ejercicio que escribe Δ o la i trae su dato (ejemplos, 80 «Ahora tú» y 40 «Así se resuelve» por idea). |
| M3 | 13, 4h; lector A, nota 1 de la sesión | Idea 3, Juega | La lista ±1, ±3, ±1/2, ±3/2 aparecía sin decir de dónde sale, y Predice dice «Recuerda de dónde salían los números de la lista». El lector A adivinó qué va arriba. | La consigna: «Su lista: arriba, divisores del 3; abajo, del 2». La Predice sigue pidiendo aplicarlo con los papeles cambiados. |
| M4 | 3, 8; lector A, nota 2 | Mira de las ideas 2 y 3 | En el paso 1 las tablas salen vacías y la primera columna de la idea 2 no tiene título: parecen rotas. El paso 1 de la idea 3 no dice de qué polinomio habla. | Título «cuenta» y nombres de fila (o los números que se prueban) desde el paso 1; «En 2x³ − 7x² + 2x + 3: …». |
| M5 | 4, 7; lector A, nota 3 | Idea 2, Juega al abrir | Con 1, 2 y 3, la suma y el producto valen 6 los dos (y −6x², −6): no se sabe qué 6 es cuál. | Arranca con 1, 2 y 4 (suma 7, volumen 8). Lee y Mira siguen con 1, 2 y 3, donde la tabla dice qué fila es cuál. |
| M6 | 13; lector A, nota 5 | «Vale si» de la idea 1 y glosario «raíz no real» | «un trinomio sin raíces reales da dos no reales», con x² + 4 (un binomio) de ejemplo en la misma pantalla; el glosario, «salen de un trinomio con Δ < 0». | «un factor de grado 2 sin raíces reales»; glosario igual. |
| M7 | 8; lector A | Idea 1, «Así se resuelve» (400 de 400) | La escala del eje y era la del mayor valor de P (hasta 2 808): los rótulos se cortaban en el borde y la curva iba pegada al eje cerca de las raíces (la 3 no se veía). | Escala fija de −40 a 40; lo que se sale se corta. |
| M8 | regla 4 de la Etapa 5 (lo previo no delata); lector B, nota 3 | Ejemplos «La diagonal de la caja» y «El producto de las cuatro» (x⁴ = 81); «Ahora tú» tipo 3 de la idea 6 y práctica `producto-todas` | Los datos traían «√50 = √(25 · 2) = 5√2»: el último paso y la alternativa D. El dato «en grado 4, el producto es (término independiente)/a», leído sobre x⁴ = 81 sin pasar el 81, da 81: la trampa A. | Un dato de cómo se simplifica una raíz con otro caso (√12 = 2√3); «con la ecuación escrita como … = 0». El resuelto pasa primero el 81. |
| M9 | regla 2 de la Etapa 5 | Ejemplo «Una pareja con √» | «La B suma solo la pareja: 2», y la B es −2. | «suma solo la pareja, 2, y da b = −2». |
| M10 | 9, 13; lector B, nota 6 | Idea 5, La regla | El «Vale si» traía una regla nueva (recíprocas, t = x + 1/x) que la regla no decía. | La regla nombra la ecuación recíproca y t; el «Vale si» es su condición (se lee igual al revés; x² + 1/x² = t² − 2). |
| M11 | regla 2 de la Etapa 5 | Idea 5, «Ahora tú» tipo 0 con los dos u negativos (25 de 100) y práctica `reales-bicuad` igual | «Bien un u positivo. Pero da dos raíces opuestas» y «Bien que salen raíces opuestas» cuando no hay ningún u positivo ni raíces reales. | Explicaciones que valen para ese caso. Prueba en teoría y práctica. |

### Baja (estilo)

| # | Punto | Dónde | Evidencia | Corrección |
|---|---|---|---|---|
| B1 | 7; lector A | Lee 1 y consigna de la idea 2 | «vale 0 justo en sus tres aristas»: vale 0 en sus medidas. | «cuando x es 1, 2 o 3, sus medidas»; «cuando x es el largo, el ancho o el alto». |
| B2 | 13; lector A | Dato de Ruffini (teoría y práctica) | «cada casilla es el de arriba más el número que se prueba por la anterior» se entiende a la segunda. | «cada casilla de abajo es el de arriba más (número que se prueba) · (la de abajo anterior)». |
| B3 | 10, 12; lector B | Ejemplo «El largo del pasadizo» | El enunciado era x por (x − 1) y la figura, un cuadrado de x por x (la pieza no dibuja x − 1). | x por (x + 1) dm, 12 dm²: x = 3, largo 4; la figura es la del enunciado; la respuesta sigue en D. |
| B4 | 5 | «Ahora tú» tipo 0 de la idea 5 (8 de 100) y soluciones de suma y producto (teoría y práctica, 86 en 2 400) | «u² − 1u + …»; «−(10)/2». | `poli` en u; el menos pegado si el número es positivo. Prueba. |
| B5 | 5 | Práctica `reales-bin` y `no-reales-bin`; `menor-grado` | «1 reales», «y 1 reales»; «los enteros no» con un solo entero. | Singular; «el entero 3 no». Prueba. |
| B6 | voz; lector B, nota 5 | Voces de Predice y de La regla de la idea 6 | La Predice pide −b/a de un trinomio sin decirlo; Nox habla de Δ sin decir qué es. | «Son las raíces de x² + 2x + 4: ¿qué suman las raíces de un trinomio (idea 2)?»; «un trinomio con discriminante negativo (Δ = b² − 4ac < 0) no da raíces reales». |
| B7 | 6 (letras) | Glosario «número complejo» | «Número de la forma a + bi … b = 0»: a y b son coeficientes en la unidad. | «Número como 3 + 2i, con i² = −1; los reales también lo son: 5 = 5 + 0i». |
| B8 | lector B | Mira 4 (P sin presentar), «Así se resuelve» 4 (dato √−9 = 3i que no sirve), tarjetas 02, 07, 08, 13, 14, 15, 17, voz de «Ahora tú» de la idea 2 (repetía las tres fórmulas) | Ver `rutinas/frio/…`, «Lo que me trabó». | Hechas (tabla de la ronda 1 en el informe del lector). |
| B9 | pieza compartida | `ejes`, opción `ajustado` | Cambio aditivo sin prueba propia en `ejes.test.js`. | Prueba: mismo plano, lienzo que termina bajo el eje x, todo texto dentro, y con marca no cambia nada. |
| B10 | comentarios | Cabecera de la unidad | Decía «c en el juego 1» y «en la idea 6, a es el número de xⁿ = a» (los dos cambiaron en «Cambios» 1 y 5). | Se deja: no lo ve el alumno (anotado). |

**El avance:** la unidad está en `REHECHAS_E6` con la marca `prediccionEP` y su prueba en `nucleo/avance.test.js` (en
verde). **Orden:** ninguna idea usa algo de una posterior; la suma y el producto de una cuadrática están en la regla de
la idea 2 antes de que la idea 6 los pida. **Repetición:** «Así se resuelve» y «Ahora tú» salen de tipos distintos y la
unidad veta los polinomios de los ejemplos, Predice, consigna y misión (prueba propia en 400 semillas).

## Lo que está bien y hay que copiar al molde

- **La caja como Cardano-Vieta**: las aristas son las raíces, la suma de aristas es −b, la mitad del cartón es c y el
  volumen es −d. Los dos lectores leyeron la relación en el juego antes de la regla.
- **El dato de cada error rehecho por otro camino**: con raíces numéricas y polinomios mínimos (sympy), los 1 898
  distractores de Cardano-Vieta y las 4 800 correctas cuadran; la prueba propia ya los rehace con Durand-Kerner.
- **Lo de otra rama como dato y con nombre** (decisión 1): el alumno de la rama de Expresiones no necesita haber hecho
  «Ecuaciones de primer y segundo grado» para resolver ningún ejercicio.
- **La práctica**: cuatro tipos por idea, el nivel 3 con preguntas de San Marcos con otros números, papel generado.

## Reglas que faltan en el contrato o el validador

| Regla | ¿Automática? |
|---|---|
| **En «¿cuál también es raíz, seguro?», la raíz dada no va entre las opciones** (A1): también es raíz seguro. En general: una pregunta con «seguro» o «siempre» tiene una sola opción que lo cumple. | Sí, por unidad (polinomio mínimo); en general, semi. |
| **Una figura no pone en el mismo eje dos magnitudes distintas** (A2: u y x en la recta de x). | Semi: por pieza, que cada elemento diga de qué variable es y la recta solo acepte la suya. |
| **Lo que una decisión manda como dato está en los datos de todo ejercicio que lo usa** (M2: Δ y la i). | Sí, por unidad (la prueba nueva); en general, con la lista de la propuesta. |
| **Un dato no es el último paso del resuelto ni el texto de una alternativa** (M8: √50 = 5√2). | Sí, en general: comparar cada línea de datos con las alternativas y con la última ecuación del resuelto. |
| **Una explicación no alaba lo que el caso no tiene** (M11: «Bien un u positivo» sin ningún u positivo). | Semi: por tipo, con el caso que cambia la explicación. |
| **«Parte entera» solo en su sentido** (M1). | Sí, en general: buscar «parte entera» junto a √ o i. |

## Correcciones (20 nov)

Paso 3 del cierre (`docs/metodo/unidad/6-correcciones.md`), junto con las notas de los dos lectores en frío
(`rutinas/frio/algebra.ecuaciones-polinomiales.md`, «Correcciones de la ronda 1»). La teoría sigue en v0.3.0 (no se
publicó). Las copias de antes están en `/tmp/claude-0/-home-user/31d0ae9f-8026-5866-a5dc-2c8554ea89bf/scratchpad/e8-cierre-ep/antes/`.

Pruebas nuevas: al final de `ecuaciones-polinomiales.test.js`, 7 («Correcciones del 20 nov»); en
`ecuaciones-polinomiales-practica/generador.test.js`, 2; en `ejes.test.js`, 1 (cobertura de `ajustado`, que ya estaba
bien). Corridas en un espejo del repo con la teoría y el generador de antes
(`e8-cierre-ep/espejo/`), las 9 de la unidad y la práctica fallan.

| # | Qué se hizo |
|---|---|
| A1 | `companera` sin la raíz dada entre las alternativas (sale el error TAL-PIDE). Prueba en 1 600 semillas. `casos.json` y el papel no cambian (`papel-generador.js --revisar`: al día). |
| A2 | `recta5` nueva: solo raíces x sobre la recta (violeta); cada u positivo es una cota turquesa «u = …» entre ±√u en su fila; un u negativo no se dibuja. Recta de −4 a 4. La lectura del juego dice «u = 4 da ±2; u = −1: ninguna real»; la leyenda, «u = …: x²; la cota une sus dos raíces». Prueba en la grilla (196 casos), Mira y el revelar de Predice. |
| M1 | «La conjugada conserva el número sin √ ni i y cambia el signo de lo que lleva √ o i» (voces, soluciones, ejemplo, práctica). Prueba. |
| M2 | Datos: DD.ruf y DD.delta en «Una caja de 120 dm³»; DD.delta en «Las reales de x⁶ = 64»; DD.i en los seis ejemplos y en «Ahora tú» tipo 2 de la idea 4. Prueba en ejemplos, «Ahora tú» y «Así se resuelve». |
| M3 | Consigna del juego 3: «Su lista: arriba, divisores del 3; abajo, del 2». Prueba. |
| M4 | Mira 2: columna «cuenta» y nombres de fila desde el paso 1. Mira 3: los números desde el paso 1 y «En 2x³ − 7x² + 2x + 3: …». Prueba. |
| M5 | El juego 2 arranca con 1, 2 y 4 dm. Prueba: al abrir, la suma y el producto no valen lo mismo. |
| M6 | «un factor de grado 2 sin raíces reales» (regla) y «de un factor de grado 2 con Δ < 0, como x² + 1» (glosario). Prueba. |
| M7 | Escala fija ±40 en «Así se resuelve» de la idea 1. Prueba. Captura: `e8-cierre-ep/despues/claro-cel-grado-raices-6-resuelve.png`. |
| M8 | Dato de simplificar raíces con √12 = 2√3; DD.prod4 «Con la ecuación escrita como … = 0, …» (teoría y práctica); el resuelto de x⁴ = 81 pasa primero el 81; «Las tres medidas suman 12». Prueba. |
| M9 | «La B suma solo la pareja, 2, y da b = −2». Prueba. |
| M10 | Regla 5: «… Una ecuación recíproca usa t»; «Vale si: t = x + 1/x sirve si la ecuación se lee igual al revés; entre x², x² + 1/x² = t² − 2». |
| M11 | Explicaciones de 3 y 1 cuando los dos u son negativos: «Bien buscar los valores de u. Pero los dos son negativos…» (teoría y práctica). Prueba. |
| B1–B9 | Hechas como dice la tabla. B8, además: la voz de «Ahora tú» de la idea 2 ya no repite las tres fórmulas. |
| B10 | No se tocó. |

Después:
- unidad 16 de 16, práctica 38 de 38, `alg-caja` 3 de 3, `ejes` 13 de 13, `recta` 10 de 10, `avance` 34 de 34,
  `catalogo/pruebas/pruebas.test.js` 63 de 63; `contenido/teoria/teoria.test.js` 209 de 211 (las 2 que fallan son
  `aritmetica/numeros-racionales.js` y `fisica/trabajo-y-energia.js`, de otras sesiones), después de `npm run -s catalogo`;
- validador con `calidad: 2` simulada (200 semillas): sin problemas ni pendientes; regla del papel con la marca: sin faltas;
- `cuentas.py`: 4 800 en verde (2 400 de la teoría y 2 400 de la práctica, también las 96 de `companera`);
  `distractores.py`: 1 898 en verde; `resuelve.py`: 2 400 en verde; `igualdades.py`: 1 439 igualdades distintas, todas
  ciertas;
- `herramientas/ecuaciones-ancho.js algebra.ecuaciones-polinomiales`: «todo cabe» (61 pantallas, 615 renglones).

No se corrió `npm test` completo (otras sesiones trabajando). Capturas `--entera` de momentos y ejemplos:
`/tmp/claude-0/-home-user/31d0ae9f-8026-5866-a5dc-2c8554ea89bf/scratchpad/e8-cierre-ep/despues/`.

### Pendiente

- **Decidido por la sesión, Gerson revisa después:** la recta nueva de la idea 5 (A2: cotas en vez de puntos para u);
  el juego 2 arranca en 1, 2 y 4 (M5); la voz de la Predice 6 remite a la idea 2 en vez de dar −b/a como dato (una
  Predice no lleva fórmulas); el pasadizo de nivel 3 cambió de x − 1 a x + 1 (B3).
- **Se deja, con motivo:** los Datos de «Ahora tú» de la idea 2 traen las tres fórmulas (el ejercicio practica elegir
  entre ellas: punto 13); el dato del producto de grado 4 en el ejemplo de nivel 2 (es la fórmula que se aplica); el
  control de d del juego 1 empieza en su tope (0 a 4 para que la misión tenga una sola salida); la Predice 4 salta de √
  a i (es lo que se reserva); la letra D repetida en Predice y «Ahora tú» (la app baraja en cada visita).
- **Para Gerson (piezas compartidas y app):** en `alg-tabla`, el rótulo de fila «2 + √3 y» del juego 4 parece cortado;
  en `recta`, la «x» de la variable sale arriba a la izquierda, lejos de la recta; la lectura del juego sale en otra
  letra; «término independiente» se resalta en unas tarjetas y en otras no; `alg-caja` no dibuja la diagonal.
- **Las reglas nuevas del validador** quedan como propuesta (tabla de arriba); en esta unidad ya son prueba propia.
