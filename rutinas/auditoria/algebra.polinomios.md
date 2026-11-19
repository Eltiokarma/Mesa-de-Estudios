# Auditoría de contenido: «Polinomios» (algebra.polinomios)

19 nov 2026. Auditor externo (fase 7 del método, `docs/metodo/unidad/5-auditor.md`), que no escribió la unidad. Contrato:
`docs/plan-calidad.md` §3 y §5. Formato: `docs/teoria.md` 4e, 4f, 4h, 4i y §5. Vara: `docs/molde-unidad.md` §10. Reglas
automáticas: `docs/metodo/unidad/reglas-validador.md`. Decisiones: `docs/etapa5/propuesta-algebra.md` (§10 y «Cambios»).
Lo que vieron los dos lectores en frío de esta ronda está en `rutinas/frio/algebra.polinomios.md`; aquí se cita solo
cuando el código lo confirma o lo agrava.

**Qué se revisó.**
- La teoría `contenido/teoria/algebra/polinomios.js` (v0.3.0, sin `calidad: 2`):
  - las 6 ideas con sus 7 momentos y los 90 ejemplos;
  - «Ahora tú» y «Así se resuelve», 200 semillas de cada uno por idea;
  - el glosario (18 términos propios), las 3 mesas y la historia.
- La pieza nueva `alg-losetas` (9 objetos) y su prueba; lo que la unidad usa de `alg-tabla` y `ejes`.
- La práctica `plantillas/polinomios-practica/`: 30 tipos en las 6 ideas, `casos.json` y `papel.json`.
- La app a 390 px con `--entera`: los 42 momentos y los 90 ejemplos. Servidor propio en el puerto 4317.

**Cuentas.** Se rehicieron con scripts propios en
`/tmp/claude-0/-home-user/31d0ae9f-8026-5866-a5dc-2c8554ea89bf/scratchpad/e5-cierre-alg/scripts/`. `volcar.js` y
`volcar-gen.js` solo sacan el texto que ve el alumno. `expr.py`, `cuentas.py` y `cuentas-gen.py` lo leen con un
analizador propio (superíndices, x^(…), producto implícito, corchetes) y calculan con sympy, sin el código de la unidad.
Despejan por fuerza bruta los números por hallar y exigen una sola solución. En las identidades, resuelven el sistema de
coeficientes y exigen que tenga una sola solución.
- **Resultado: 5 887 comprobaciones**, y todas las respuestas cuadran.
  - **Igualdades: 2 281**, todas ciertas (2 287 después de corregir). Es toda igualdad o identidad escrita con polinomios o con números en resueltos,
    `siFuera`, Lee, Mira, reglas, glosario, mesas y las lecturas del juego en toda su grilla (232 estados). Se comparan
    simbólicamente.
  - **«Ahora tú»: 1 200 casos** (200 por idea): la correcta vale lo que pide el enunciado, ningún distractor vale lo
    mismo y hay cuatro opciones. Los «idénticos» y los parámetros (m, n, a, b, c, k) tienen una sola solución.
  - **«Así se resuelve»: 1 200 casos**: la respuesta, el resultado completo y ordenado, y las comprobaciones del paso
    «¿Tiene sentido?».
  - **La práctica: 1 200 problemas** (200 por idea, con `{ idea }`), con las mismas reglas. El papel sale del generador.
  - **Los 90 ejemplos**: sus igualdades entran en las 2 287. En el nivel 3, la letra es la de la alternativa que da la
    cuenta y las cinco son distintas. Las 120 explicaciones de distractor se rehicieron a mano, una por una: 119 dan el
    valor de su alternativa (ver B6).
  - **Las 6 predicciones** con sus 18 distractores (a mano) y **las 6 misiones** en toda su grilla: cada una se cumple
    con un solo caso y no al abrir.
- **Lo que la respuesta no ve, y sí vio el script:**
  - un resuelto que escribe «P(0) = 99» por 9 (A1);
  - dos `siFuera` que no dicen el error que miden (M2);
  - un «Así se resuelve» que afirma «una casilla es distinta» cuando son dos o tres, y «x = 2 los separa» cuando no
    los separa (M3).

Validador con `calidad: 2` simulada (`Teoria.problemas` con 200 semillas): **0 problemas y 0 pendientes**, antes y
después de corregir. Ninguna de las faltas de abajo la ve una regla de hoy. Pruebas propias en verde antes de corregir:
`polinomios.test.js` 21 de 21, `alg-losetas.test.js` 13 de 13 y generador 42 de 42.

## Hallazgos

### Alta (el alumno no puede resolver o aprende algo falso)

| # | Punto | Dónde | Evidencia | Corrección propuesta |
|---|---|---|---|---|
| A1 | 10, 13 | Idea 2, «Ahora tú» tipo 4 (`casoDesplazado`, `:637`) | Cuando piden solo P(1) o solo P(0), la ecuación del resuelto pega el valor dos veces. Escribe «x = −3: P(0) = 99» cuando P(0) = 9, y «P(1) = 5151» cuando P(1) = 51. Pasa en 16 de 40 casos del tipo. Es el resuelto que lee el alumno después de fallar. | Que la cadena termine en «P(0) = » y el número vaya solo en el `RES`. |

### Media (el alumno se traba o duda)

| # | Punto | Dónde | Evidencia | Corrección propuesta |
|---|---|---|---|---|
| M1 | 4f; regla `glosario-predice` | Glosario de las ideas 3, 4 y 5 (`:2505`, `:2514`, `:2522`), que se abre desde «Palabras de esta idea» y desde Lee, antes de Predice | El glosario da la clave de tres predicciones.<br>• «Grado absoluto»: «El mayor de los grados de los términos». Su `simple` dice «el término que tiene más letras multiplicadas» y un ejemplo, «los grados son 4 y 6; el absoluto es 6», es la predicción de la idea 3 con otros números.<br>• «Idéntico»: «valen igual para todo x» responde la de la idea 5.<br>• «Completo»: «x³ − 2 se completa como x³ + 0x² + 0x − 2» es el procedimiento de la de la idea 4.<br>La regla no lo ve porque las respuestas tienen una cifra. La prueba propia tampoco: su patrón `/el mayor de/` no ve la mayúscula de «El mayor de». | Definiciones que no digan cómo se halla el grado absoluto ni si basta un valor. Ejemplos de un solo término. Un patrón sin mayúsculas en la prueba. |
| M2 | 4f (`siFuera`) | `casoDesplazado` (`:632`) y `casoUnoCero` (`:573`); en la práctica, `desplazado` (`generador.js:414`) | • Cuando piden el término independiente, el `siFuera` de «despejaste al revés» dice «x + 3 = 1 da x = −2»: habla de P(1). Pasa en 8 de 40 casos del tipo, y en la práctica también.<br>• En P(1) − P(0), la opción de PO12 vale P(0) − P(1), pero su `siFuera` dice «Bien P(0)…; P(1) no es el término independiente». Ese error daría 0. | `siFuera` según lo que se pide («x + 3 = 0 da x = −3»), y que la opción de PO12 valga P(0) − P(0) = 0. |
| M3 | 10; figura | Idea 5, «Así se resuelve» (`:1921`) | • El sorteo cambia cada casilla por separado. En 27 de 200 casos cambian dos o tres casillas, y la respuesta dice «una casilla es distinta».<br>• En 3 casos, «Comprueba con x = 2: el primero vale −12 y el segundo, −12. Ya ese valor los separa» es falso.<br>• La figura del enunciado ya trae las dos filas del casillero llenas: comparar es la respuesta (lector B). | Una sola casilla distinta. Al empezar, Q con «?» en el casillero. |
| M4 | Molde §3 (la figura) | Idea 6, ejemplos «Un tramo por dos», «Dos binomios» y «El piso de Rubén»; Lee 1 de la idea 6 | • El piso de los ejemplos viene partido en sus piezas: contando losetas, tiras y cuadraditos sale el producto antes del resuelto (lector B, tarjeta 16).<br>• Lee 1 dibuja el piso (2x + 1) por (x + 3), que es la misión del juego ya resuelta (lector B). | Una opción `piezas: false` en `alg-losetas`, con el borde y las marcas de los tramos. Otro piso en Lee. |
| M5 | 2, 4f | Idea 2, leyenda del juego (`:804`) | «P(4) se lee "P de 4"»: 4 es la respuesta de la misión, y el juego abre en P(2) (lector A). | «P(2): se lee "P de 2"». |
| M6 | 3, 9 | Idea 2, regla (`:842`); `DV.desplaza` | «Con P(x + h), x cumple x + h = k»: h y k no se dicen y no hay ejemplo. Fue lo que más trabó al lector A. | En la regla, un renglón con ejemplo: «si te dan P(x + 1): P(1) sale con x = 0, porque 0 + 1 = 1». |
| M7 | 2 | Idea 3, misión (`:1158`) | «Lleva el primer término a grado 8 sin que el exponente de y pase de 3» no dice que x llega solo a 5. El lector vio tres respuestas (5 y 3, 6 y 2, 7 y 1). | «… con x hasta 5 e y hasta 3». |
| M8 | 4f (Predice) | Idea 3, Predice (`:1179`, `:1188`) | El enunciado y la figura traen los grados de los tres términos (3, 4 y 0), y la respuesta es uno de ellos. Solo queda elegir uno (lector A). | Que pregunte el grado absoluto sin dar los grados. La figura, solo con las fichas. |
| M9 | 10; figura | Idea 3, «Así se resuelve» (`:1222`) | El enunciado pide el grado de «4²x⁵y⁴» y la figura escribe «2x⁵y⁴», en las 200 semillas. Los datos no dicen que el coeficiente, aunque lleve exponente, no es una letra (lector A). | La figura escribe el término del enunciado (la pieza lo permite con un texto). Un dato de qué es el coeficiente. |
| M10 | 9, 3 | Idea 1, regla (`:460`) | • «−(2x² − x) = −2x² + x» aparece por primera vez en la regla: ningún momento anterior resta.<br>• La fórmula usa solo xⁿ, y la predicción era con xy (lector A). | Un paso de Mira con la resta. La fórmula con xᵐyⁿ y «yx es xy» en la condición. |
| M11 | 3, letras | Idea 5, regla (`:1909`) y juego; idea 6, `DM.pot` | • a₂, a₁, a₀ y b₂, b₁, b₀ no se dicen en palabras.<br>• En el juego, a y b son los números que mueve el alumno; en la regla, los coeficientes de P y de Q; en los datos de la idea 6, exponentes (xᵃ · xᵇ). El lector B lo notó tres veces. | El juego mueve m y n. La condición dice qué son a₂ y b₂. xᵐ · xⁿ en la teoría y en la práctica. |
| M12 | 13 | Idea 6, Predice | Para responder hace falta xᵐ · xⁿ = xᵐ⁺ⁿ, que viene de Exponentes y radicales, y no está en Datos (lector B). | El dato (es una ley que se usa, no la regla de la idea). Decidido por la sesión, ver abajo. |
| M13 | 9, 12 | Idea 4: Lee, regla y juego | • «Homogéneo» sale por primera vez en la regla, y todos los ejemplos de antes tienen una sola letra.<br>• Nox dice «todas las filas igual de largas» en una pantalla sin filas.<br>• La leyenda nombra la «casilla punteada», que no se ve al abrir.<br>• El casillero de «Así se resuelve» va x⁴, x⁰, x³, x², x (lector B). | Homogéneo con un ejemplo de dos letras en Lee 2. Otra voz. La leyenda nombra el pedido que la muestra. El casillero, de mayor a menor. |
| M14 | 13 | Ejemplos «Coeficientes sin desarrollar» (tarjeta 06), «¿Sumar o multiplicar?» (01), «Coeficientes con dos letras» (15) y «Dos binomios» (16) | • 06 usa «la suma de los coeficientes es P(1)» sin tenerla en Datos. Además el dato «coeficiente: el número que multiplica a las letras» deja fuera al término sin letras, que P(1) sí suma.<br>• 01 afirma «solo valen igual si x es 2 o 0» sin mostrarlo, y no da x · x = x².<br>• 15 salta a «3a = 12» sin decir que suma las ecuaciones.<br>• 16 dice «las dos tiras» con cinco tiras dibujadas. | Los datos que faltan y el paso que se salta, uno por ejemplo. |
| M15 | 1, 8 | Idea 5, Predice y Mira 1 (pieza `tamano` con dos filas) | El rótulo «Q: 2x» queda pegado a las piezas de P y lejos de las suyas. No se dice que losetas de 1 dm es x = 1, y P(1) aparece sin explicar (lector B). | El rótulo junto a su fila cuando hay dos. «(x = 1)» en la pregunta. «P(1): lo que cubre P con x = 1» en Mira. |
| M16 | 4, 12 | Idea 6, regla | Solo se resaltan −3x² y 2x², no x y −6x. «Sus coeficientes suman P(1) · Q(1)» y grado(Pᵏ) van sin ejemplo (lector B). | Los cuatro resaltes y un renglón de ejemplo para cada una. |

### Baja (estilo)

| # | Punto | Dónde | Evidencia | Corrección |
|---|---|---|---|---|
| B1 | Lector A | Idea 1, «Así se resuelve» | «Pedido que se repite 2 veces» se dibuja una vez y se cuenta una copia. | Dibujarlo k veces. |
| B2 | Lector A | Idea 1, Predice: pieza `giro` | Un solo «y dm» al lado de dos piezas apiladas: parece que las dos juntas miden y. | Un «y dm» por pieza. |
| B3 | Lector A | Idea 2, «Ahora tú» | La primera vez ya pide un cúbico con x negativo. | Las dos primeras veces, de grado 2. |
| B4 | 10 | Idea 2, «Así se resuelve», paso «¿Tiene sentido?» | «Con losetas de 7 dm cubriría…» en 40 de 200 casos; el juego dice de 2 a 6 dm. | Con lado 6, comparar con 5 dm. |
| B5 | Notación | Ejemplo «¿Es un polinomio?» | «x^(1/2)» escrito con «^» en el texto. | El exponente como superíndice. |
| B6 | Opciones | Ejemplo «Coeficientes de una potencia», la B | «Multiplica por los exponentes en vez de elevar: 1 · 4 + 4 · 2» suma los dos factores; ese error da (1 · 4) · (4 · 2) = 32. | La B vale 32. |
| B7 | Notación | `casoSistema` | «4a − 1b = −10». | Sin el 1. |
| B8 | Molde §2 | Mesa «Dos curvas, tres casillas» | La lectura separa con «   ·   » una igualdad y la cuenta de casillas: «Q = 2 · casillas…». | Punto y coma. |
| B9 | Lector B, tarjeta 17 | «Sumar sin desarrollar» | «(1 + 2)(3 − 1)» sin el 3 · 1. | «(3 · 1 − 1)». |
| B10 | 9 | Mesa «Dos curvas», `bien` del último reto | «En grado 2 hacen falta tres [empates]» adelanta el número de raíces (Ecuaciones polinomiales). | Se deja: es un reto del laboratorio. |
| B11 | Lector B, tarjeta 18 | «Grado y término independiente» | El tercer factor (x − 1) va sin color. | Se deja: el mapa tiene dos colores de polinomio (propuesta §6); el tercero va en tinta. |
| B12 | Lector A | Idea 1, Predice | Las piezas naranjas y turquesas parecen de dos tipos. | Se deja: el color dice quién apuntó (propuesta §6). |
| B13 | 5 | Práctica `perimetro` | La alternativa del área (TAL-AREA) sale con «m», como las demás. | Se deja: el distractor muestra lo que escribe quien comete el error. |

**Nada adelantado de otras unidades**: no hay «raíz», «factor» como teorema, «resto» ni Ruffini. «Forma factorizada»
solo evalúa (San Marcos 2026-II, decisión 5 de la propuesta). **Notación antes de decirse**: P(x) y P(k) se presentan en
Lee 2 de la idea 2 antes de usarse, y GA y GR(x), en Lee 3 de la idea 3. En la idea 1, P y Q salen en un solo ejemplo
de nivel 3, con «P = …» escrito. a₂ y b₂ entraron en M11.

## Lo que está bien y hay que copiar al molde

- **Un objeto por idea, con un hilo** (el pedido de losetas de Rubén): la letra es una medida, x = 1 explica P(1) y
  x = 0, P(0).
- **Las misiones tienen una sola respuesta en toda su grilla**, y la prueba lo comprueba. Las predicciones tienen un
  código distinto por opción y no aparecen ni en «Ahora tú» ni en la práctica.
- **Los parámetros se despejan con un solo valor**: el sistema de idénticos tiene determinante distinto de 0 (p, q ≥ 1)
  y los exponentes por hallar tienen una solución. El script lo confirmó en 1 200 + 1 200 casos.
- **La práctica es modelo**: `TIPOS_POR_IDEA`, explicaciones que dan el valor de su error, datos por tipo y un papel con
  las seis ideas.

## Reglas que faltan en el contrato o el validador

| Regla | ¿Automática? |
|---|---|
| **Toda igualdad escrita con polinomios es cierta** (A1): se leen los tramos «A = B» de resueltos, `siFuera`, lecturas y Mira, y se comparan en varios valores de x (o en simbólico) en 200 semillas. | Sí: `cuentas.py` lo hace con sympy; en JS basta el `valor()` de `polinomios.test.js`. Habría encontrado A1 y M3. |
| **`glosario-predice` sin distinguir mayúsculas**, y con las marcas que declare la predicción cuando la respuesta tiene una cifra (M1). | Parcial. |
| **El `siFuera` reproduce su valor**: para los distractores con `valorDe`, la cuenta que nombra da el texto de la opción (M2). | Semi. |
| **Una figura no trae el resultado de juntar los datos** (M4): para piezas de área (piso, baldosas), el número de piezas dibujadas no puede ser el producto pedido. | Semi, por pieza. |
| **La leyenda no muestra el valor que cumple la misión** (M5): ningún número de la leyenda es un valor de control con `logrado`. | Sí. |
| **Figura y enunciado dicen lo mismo** (M9): el término o el polinomio de la figura está, tal cual, en el enunciado. | Semi (por texto). |

## Correcciones (19 nov)

Fase 8 del método (`docs/metodo/unidad/6-correcciones.md`), junto con las notas de los dos lectores en frío
(`rutinas/frio/algebra.polinomios.md`, «Correcciones de la ronda 1»). La teoría sigue en v0.3.0 (no se publicó). Las
copias de antes están en `/tmp/claude-0/-home-user/31d0ae9f-8026-5866-a5dc-2c8554ea89bf/scratchpad/e5-cierre-alg/antes/`.

Pruebas nuevas:
- al final de `polinomios.test.js`, 10 pruebas («Correcciones del 19 nov»);
- en `alg-losetas.test.js`, 4;
- en `generador.test.js`, 1.

Corridas contra los archivos de antes (en un espejo del repo), las 15 fallan.

Después:
- unidad 31 de 31, pieza 17 de 17, generador 43 de 43;
- `contenido/teoria/teoria.test.js` en verde, después de `npm run catalogo`;
- validador con `calidad: 2` simulada: sin problemas ni pendientes;
- `cuentas.py`: 4 693 de 4 693. `cuentas-gen.py`: 1 200 de 1 200;
- `herramientas/ecuaciones-ancho.js algebra.polinomios`: «todo cabe» (60 pantallas);
- `herramientas/papel-reglas.js`: sin hallazgos.

No se corrió `npm test` completo (otras sesiones trabajando). Capturas `--entera`: `…/e5-cierre-alg/despues/`.

| # | Qué se hizo |
|---|---|
| A1 | Cuando piden solo P(1) o solo P(0), la cadena del resuelto termina en «P(0) = » y el número va solo en el `RES`. Prueba: en 400 semillas, cada «P(0) = N» y «P(1) = N» del resuelto vale lo que da P(x + h), recalculado desde el enunciado. |
| M1 | «Grado absoluto»: «El grado de un polinomio entero, que sale de los grados de todos sus términos», con ejemplos de un solo término. «Idéntico»: «el mismo polinomio, aunque esté escrito en otro orden». «Completo»: «x³ − 2 no lo es: le faltan x² y x». Prueba con patrones sin mayúsculas, que incluyen «para todo x» y «+ 0x». |
| M2 | Teoría y práctica: si se pide P(0), «x + h = 0 da x = −h». La opción de PO12 en P(1) − P(0) vale 0. Pruebas en la teoría (400 semillas) y en el generador. |
| M3 | Cambia una sola casilla. Al empezar, Q va con «?» en el casillero. Prueba: en 200 semillas, una sola potencia distinta, x = 2 los separa y Q empieza en «?». |
| M4 | `alg-losetas`, piso con `piezas: false`: el borde con las marcas de los tramos, sin piezas y sin cuentas en el texto alternativo. Va en los tres ejemplos. Lee 1 dibuja (2x + 2) por (x + 1). Pruebas en la teoría y en la pieza. |
| M5 | Leyenda: «P(2): se lee "P de 2"», lo que se ve al abrir. |
| M6 | Regla: «Evaluar P(k)…; P(0) es el término independiente», más el renglón «si te dan P(x + 1): P(1) sale con x = 0, porque 0 + 1 = 1». `DV.desplaza` queda corto, en palabras. |
| M7 | «Lleva el primer término a grado 8, con x hasta 5 e y hasta 3.» |
| M8 | «¿Cuál es el grado absoluto de 3x²y − 2xy³ + 1, el grado del polinomio entero?». La figura trae las fichas sin el grado de cada fila. |
| M9 | La pieza escribe el término tal como lo da el enunciado (cuarto elemento de `terminos`). Dato nuevo: «El coeficiente es un número, aunque lleve exponente: no es una letra del término». Prueba en 200 semillas. |
| M10 | Mira 6: «(4x² + 3x) − (2x² − x) = 4x² + 3x − 2x² + x = 2x² + 4x». La regla usa xᵐyⁿ y la condición dice «(yx es xy)». |
| M11 | El juego de la idea 5 mueve m y n. La condición dice «a₂, a₁, a₀: coeficientes de x², x y x⁰ en el primero; b₂, b₁, b₀, del segundo». En la teoría y en la práctica, xᵐ · xⁿ = xᵐ⁺ⁿ y (xᵐ)ᵏ (papel regenerado: solo cambió p7). |
| M12 | Predice de la idea 6 con el dato xᵐ · xⁿ = xᵐ⁺ⁿ. **Decidido por la sesión, Gerson revisa después.** Es la ley de la unidad anterior, no la regla que se predice. Con ella sigue habiendo que ver que el grado lo dan los términos mayores (PO5, PO23). |
| M13 | Lee 2: «Ordenado y homogéneo», con «en x²y + xy², los dos tienen 3». Nox: «Todos los términos del mismo grado: homogéneo». La leyenda: «casilla punteada: vacía, como en el pedido x³ + 7». El casillero de «Así se resuelve» baja de xⁿ a x⁰. Pruebas. |
| M14 | 06: datos «Suma de coeficientes de P: P(1)» y «Término independiente de P: P(0)». El coeficiente se define igual en toda la unidad, «…; el término sin letras es su propio coeficiente». 01: dato «x · x = x²» y un paso «con x = 2 dan 4 y 4, con x = 0, 0 y 0; con x = 3, 6 y 9». 15: «Sumo las dos primeras: −b y b se anulan». 16: «Las tiras de 3x y las de 2x se juntan». Pruebas. |
| M15 | `tamano` con dos filas: cada rótulo va justo encima de sus piezas; con una fila, fijo (el juego no se mueve). La pregunta dice «(x = 1)». Mira 1: «P(1): lo que cubre P con x = 1. Vale 2, como Q(1)». Prueba en la pieza. |
| M16 | La regla resalta las cuatro casillas semejantes. Renglones «por ejemplo, grado de (x² + 1)³ = 3 · 2 = 6» y «suma de coeficientes = P(1) · Q(1) = 3 · (−1) = −3», con el producto del dibujo. |
| B1–B9 | Hechas como dice la tabla. B3: `casoNegativo` de grado 2 en las semillas 0 y 5. B4: con lado 6, «con losetas de 5 dm cubriría…, menos». |
| B10–B13 | No se tocaron (ver la tabla). |

### Pendiente

- **Las reglas nuevas del validador** quedan como propuesta (tabla de arriba). En esta unidad, varias ya son prueba
  propia.
- **Decidido por la sesión, Gerson revisa después:** M12, el dato de la ley de los exponentes en Predice de la idea 6.
  Y M11: en el juego de idénticos los números que se mueven pasan de a y b a m y n, porque a y b quedan para los
  coeficientes de la regla.
- **Para Gerson (dibujos de prueba de `alg-losetas`):** el piso sin piezas de los ejemplos (borde y marcas) y el
  casillero con «?».
