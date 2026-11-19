# Auditoría de contenido: «Factorización» (algebra.factorizacion)

19 nov 2026. Auditor externo (cierre con criterio delegado, `docs/metodo/unidad/cierre-delegado.md`; encargo de
`docs/metodo/unidad/5-auditor.md`), que no escribió la unidad. Contrato: `docs/plan-calidad.md` §3 y §5. Formato:
`docs/teoria.md`. Vara: `docs/molde-unidad.md` §10. Reglas automáticas: `docs/metodo/unidad/reglas-validador.md` y lo que
encontraron los auditores de las Etapas 5 y 6 (`docs/metodo/unidad/etapa-delegada.md`). Decisiones:
`docs/etapa7/propuesta-algebra.md` (§10 y «Cambios»). Lo que vieron los dos lectores en frío está en
`rutinas/frio/algebra.factorizacion.md`; aquí se cita cuando el código lo confirma o lo agrava.

**Qué se revisó.**
- La teoría `contenido/teoria/algebra/factorizacion.js` (v0.3.0, sin `calidad: 2`, todavía sin commit):
  - las 6 ideas con sus 7 momentos y los 90 ejemplos;
  - «Ahora tú» y «Así se resuelve», 400 semillas de cada uno por idea;
  - el glosario (16 términos), las 3 mesas del laboratorio (sus lecturas en toda la grilla), las letras y la historia.
- Las piezas compartidas que usa (`alg-reparto`, `alg-losetas`, `alg-tabla`, `alg-baldosas`): ninguna se tocó al escribir
  la unidad.
- La práctica `plantillas/factorizacion-practica/` (25 tipos en las 6 ideas, `casos.json` y `papel.json`) y la vieja
  `plantillas/division-polinomios/`, que con esta unidad solo da MCD y MCM.
- La app a 390 px con `--entera`: los 42 momentos y los 90 ejemplos. Servidor propio en el puerto 4435.

**Cuentas.** Rehechas con scripts propios en
`/tmp/claude-0/-home-user/31d0ae9f-8026-5866-a5dc-2c8554ea89bf/scratchpad/e7-cierre-fz/scripts/`, sin el código de la
unidad ni los scripts del autor (`e7-algebra/scripts`). `volcar.js` y `volcar-gen.js` solo sacan el texto que ve el
alumno; `expr.py` lo lee con un analizador propio (superíndices, productos de paréntesis con exponente, fracciones, miles
con espacio, producto implícito); `fz.py` factoriza sobre los enteros con sympy (`factor_list`: un factor primo es
primitivo e irreducible; la constante no cuenta; se cuentan los distintos); `cuentas.py` y `cuentas-gen.py` rehacen cada
respuesta y cada distractor; `div-mcd.py` rehace la vieja `division-polinomios`.
- **Teoría** (números del estado final; antes de corregir, ver los hallazgos):
  - **Igualdades: 9 933**, todas ciertas, en Lee, Mira, regla, ejemplos (enunciado, datos, figura, resuelto), Predice,
    `siFuera`, lecturas del juego en toda su grilla, misiones y leyendas, «Ahora tú» y «Así se resuelve» en 400 semillas,
    glosario y las tres mesas. Las 16 que el analizador no pudo dar por buenas son cortes de su separador (la «y» de
    «2x · y + x · (−5y)»), rehechas a mano: ciertas.
  - **«Ahora tú»: 2 400 casos** (400 por idea), con un modelo por tipo: la factorización da el polinomio y cada factor es
    primo sobre los enteros (o el factor común es el MCD de los coeficientes con la menor potencia de cada letra); el
    conteo y la suma de factores primos con la convención de los Datos; cada aspa simple y doble (los factores que da
    sympy); la doble especial (existe con los extremos dados y lo que falta es uno solo); el binomio del teorema del
    factor (una sola opción divide a P); el MCD, el MCM, su grado y su valor; el Q del MCM dado (uno solo).
  - **El valor de cada distractor: 7 200**, cada código con su modelo (el 1 borrado, la menor potencia, el binomio sin
    voltear, el cruce cambiado, el principal olvidado, lo que falta sin restar, el signo copiado, el divisor que no anula,
    el mayor exponente en el MCD, P · Q…). Encontró M2 y M3.
  - **«Así se resuelve»: 2 400 casos**: la respuesta rehecha del enunciado; las factorizaciones, completas. Encontró A1.
  - **Ejemplos: los 90**, sus igualdades dentro de las de arriba; los 30 de nivel 3 y sus 120 explicaciones de
    distractor, rehechos uno por uno (a mano y con sympy): todos dan el valor de su alternativa. Las respuestas de todo
    «Factoriza…», completas salvo una de la idea 1 (B6).
- **Práctica: 2 400 problemas** (400 por idea), normalizados al texto de las preguntas de la teoría y rehechos con los
  mismos modelos más los códigos propios de la práctica (TAL-UNO-SIGNO, TAL-AGRUPA-PROD, TAL-CUBO-CUAD, TAL-ASPA-NUM…):
  2 400 respuestas, 8 213 valores de distractor y 1 766 igualdades de sus soluciones. Encontró A1, M5 y M6 también aquí. El papel (8) y `casos.json`
  (25) salen del generador y entran en la cuenta.
- **`division-polinomios` con la unidad: 400 de 400** (274 valores del MCD o del MCM, también con el MCD dado y B por
  completar, y 126 grados): correctas, y ningún distractor vale la respuesta. Solo da MCD y MCM (su prueba lo exige).
- **La convención de «factor primo»** (coeficientes enteros, sin la constante, distintos) se buscó en los Datos de todo
  ejercicio que cuenta o suma factores primos: faltaba «enteros» en 205 de la teoría y 209 de la práctica (M1).
- **La letra a** se revisó en todo texto que ve el alumno: ningún ejercicio junta sus dos sentidos (lo que va al cuadrado
  en una identidad, idea 2; el número que anula a P, idea 5); `ab + ac = a(b + c)` y `b − a = −(a − b)` (idea 1) usan a
  como en una identidad. Sí había un tercer sentido, una variable, en el glosario (M12).

Validador con `calidad: 2` simulada (`Teoria.problemas`, 200 semillas): **0 problemas y 0 pendientes**, antes y después.
`herramientas/ecuaciones-ancho.js`: 2 enunciados partidos después de «=» (B9). Pruebas propias en verde antes de corregir
(unidad 14, práctica 37, `division-polinomios` 27). **Ninguna de las faltas de abajo la veía una regla de hoy ni una prueba
propia.**

## Hallazgos

### Alta (el alumno no puede resolver o aprende algo falso)

| # | Punto | Dónde | Evidencia | Corrección propuesta |
|---|---|---|---|---|
| A1 | 4f, 13; la regla de la idea 2 | Idea 2: «Así se resuelve» (145 de 400 semillas) y «Ahora tú» tipo 0 (25 de 100); práctica `tcp` (27 de 100) y `dif-cuad` (28 de 100) | La respuesta no es la factorización completa: «Factoriza 4x² − 16x + 16 → (2x − 4)²», «16x² − 36 → (4x + 6)(4x − 6)», «36x² − 9 → (6x + 3)(6x − 3)». 2x − 4 = 2(x − 2) no es primo; lo completo es 4(x − 2)². La regla de la misma idea dice «primero se saca el factor común… hasta que cada factor sea primo»: el alumno aprende lo contrario. Los generadores no piden que a y b no tengan número común. | a y b (o p y q) sin número común en los cuatro generadores. Prueba que mida el contenido de cada factor. |
| A2 | 13; regla 4 de la Etapa 5 | El dato `a² − b² = (a + b)(a − b), con a y b los dos términos` (teoría: ideas 2, 3, 6 y ejemplos; práctica) | Es falso: en 16x² − 25 los términos son 16x² y 25, y a y b son 4x y 5. Leído al pie de la letra lleva a (16x + 25)(16x − 25), el distractor TAL-SIN-RAIZ (lector A). LETRAS repetía «el primer término». | «con a y b lo que va al cuadrado (no los términos)»; LETRAS igual. |

### Media (el alumno se traba o duda)

| # | Punto | Dónde | Evidencia | Corrección propuesta |
|---|---|---|---|---|
| M1 | 13; convención de la propuesta (decisión 3) | Datos de los ejercicios que cuentan o suman factores primos: ideas 4 (tipo 3) y 5 (tipo 2) de «Ahora tú», 5 ejemplos, y los mismos tipos de la práctica | El dato dice «se cuentan los distintos; un número solo… no cuenta», pero no «con coeficientes enteros»: en 205 casos de la teoría y 209 de la práctica falta esa parte (sin ella, x² − 2 o x² + 4 «se abren»). Un ejemplo de nivel 3 («Dos factores con números») habla de factores primos sin ningún dato de la convención. | El dato dice «Factores primos, con coeficientes enteros: …»; el ejemplo suma el dato de factor primo. Prueba en teoría y práctica. |
| M2 | 14 (regla de la Etapa 6) | Idea 1 «Ahora tú» tipo 3 (`siFuera`, 50 de 100); idea 3 tipo 2 (solución, 59 de 100); idea 4 tipo 2 (solución, 50 de 100) | Texto roto: «Bien x + -1 común al primer par», «en cruz, 2x · y + x · -5y da el del medio» (menos de teclado, sin paréntesis), «−3x² − −6x² = 3x²». | `lin(1, a)`; «x · (−5y) = −3xy, el del medio»; el cruce negativo entre paréntesis. Prueba de signos en 400 semillas. |
| M3 | 4f; regla 1 de la Etapa 5 | Idea 2 «Ahora tú» tipo 2 (cubos), 42 de 100 | «Bien los cuadrados 2x² y 1»: el cuadrado de 2x es 4x², no 2x² (la opción misma dice 4x²). | «(2x)² = 4x²». Prueba. |
| M4 | 3, 12 | Idea 2, Juega (lector A) | La lectura dice «(x + 2)² = x² + 4x + 4; pedido: x² + 4x + 9», pero el pedido era x² + 9: mezcla lo comprado con lo pedido. | «;   tienes x² + 4x + 9». |
| M5 | regla 2 de la Etapa 5 | Práctica `principal` (97 de 100) | El distractor TAL-FACTOR-CAND («cree que todo divisor del independiente anula a P») era cx − (\|b\| + c), que se anula en (\|b\| + c)/c: casi nunca es un candidato (3x − 5 con independiente 12). | Un candidato de verdad: k/c con k divisor del independiente que no anula a P. Prueba. |
| M6 | regla 2 de la Etapa 5 | Práctica `grado-mcm` (84 de 100) | El 8 (TAL-MCM-PROD, «no se multiplican P y Q dos veces») no sale de ningún error: P · Q tiene grado 4. | Sale; quedan 4, 1 y 2. Prueba. |
| M7 | 10 (la alternativa no se distingue); lector B | «Ahora tú» de las seis ideas | Las alternativas eran fichas de magnitud: en la app salen en color y con el punteado de un término del glosario (lector B: «parece que al tocarlas abrirán una definición»). Las demás unidades de la rama las ponen en tinta. | Las alternativas en tinta (`ops` pasa el texto a plano); el color queda en la solución. Prueba. |
| M8 | 13; regla 4 de la Etapa 5 | Datos que dan la respuesta: Predice de la idea 4 («x² · 2 = 2x²; 1 · x² = x²», el cruce que se predice salvo una resta) y el ejemplo «Qué números probar» (el dato es la respuesta) (lector B) | | Predice: «x⁴ = x² · x²; 2 = 1 · 2; el término en x² de P es 9x²». Ejemplo: el teorema del factor y «el independiente es −a por el de q». Prueba. |
| M9 | 4, 13 | Idea 5, «Así se resuelve» (lector B) | El dibujo, antes del primer paso, ya trae la tabla con a = −1 y la casilla en 0: la búsqueda está hecha. | El dibujo inicial con «a = ?» y la tabla vacía; la llena el paso que la usa. Prueba. |
| M10 | 13 | Ejemplos «Un factor con dos letras» (aspa, nivel 3), «Con un 3 adelante» (nivel 3), «Con un 2 adelante» (nivel 2) y «Ahora tú» de dos letras y de principal 2 o 3 (lector B) | El dato «el último en dos números» no sirve para 2y² = y · 2y; para 3x − 1 no hay dato de que es factor si P(1/3) = 0; el resuelto de «Con un 2 adelante» usa el aspa sin el dato y prueba 2 sin decir por qué. | Datos: «Aspa con dos letras…», «cx − b = c(x − b/c): es un factor de P si P(b/c) = 0» (también en la práctica), el aspa, y «primero los enteros: P(1) = −2». |
| M11 | niveles (regla 9 de la Etapa 5) | Idea 4, ejemplo de nivel 2 «Sin término en x²» (lector B: más difícil que el de nivel 3) | No dice cómo se parten los extremos ni en qué fila va cada número; no hay tabla. | La tabla de la doble especial con «?» y la partición dicha fila por fila. |
| M12 | 6 (notación) | Glosario «factor común»: «En x(a + 1) + y(a + 1), es a + 1» | Un tercer sentido de a (una variable), además de los dos de LETRAS. | «En x(y + 1) + 2(y + 1), es y + 1». |
| M13 | 9; reglas de la Etapa 5 | Reglas: «Vale si» de las ideas 1, 2 y 3; regla de las ideas 4 y 5; regla de la idea 2 (lectores A y B) | «Vale si un término que sale entero deja un 1» y «Vale si primero se saca el factor común» no son condiciones; «Vale si ninguna partición da…» se lee al revés; la doble especial no dice cómo se parte lo que falta; «también fracciones» no dice cuáles; la regla de la idea 2 usa ∓ sin presentarlo. | Condiciones nuevas; la tabla de la idea 2 en cuatro filas, sin ∓. |
| M14 | 2 (Nox) | Voces de «Ahora tú» de las ideas 5 y 6, Mira de la 5, regla de la 3 (lectores) | «Prueba los divisores» cuando el enunciado ya da P(−1) = 0; «Factoriza primero» con P y Q ya factorizados; «Primero los candidatos» y el paso 1 prueba a = 1 sin listarlos; «los signos salen del último término» (falso en general). | Voces que valen para todos los tipos. |

### Baja (estilo)

| # | Punto | Dónde | Evidencia | Corrección |
|---|---|---|---|---|
| B1 | 4f | Idea 1 «Ahora tú» tipo 2 cuando a = n (14 de 100) | «el signo se le cambia al 3, no al 3 de adentro». | «cambia en el 3 que multiplica, no dentro del binomio x − 3». |
| B2 | 4f | Idea 3 «Ahora tú» tipo 0 (100 de 100) | «el cruce no da 16x» cuando el del medio es −16x. | «no da −16x». |
| B3 | códigos | Idea 6 tipo 3 (teoría y práctica) e idea 3 tipo 2 | Q(k) entero llevaba TAL-MCD-MAX («el mayor exponente»); px + qs·y, TAL-ASPA-MEDIO («una partición que no cuadra»): el código no era su error. | TAL-MCD-SINFACTOR y TAL-PIDE. |
| B4 | 5 | Práctica `dif-cuad` con y (36 textos en 400 semillas) | «4x² − 1y²», «(2x + 1y)». | Sin q = 1 con y. Prueba. |
| B5 | 7 | Mira 1 («queda: 3 divide a 6 y a 3»), «Así se resuelve» 1 (fila «coeficientes» sobre x e y), aspas con el 6x en la fila del 1, ejemplo de nivel 2 del aspa con la notación del cruce que cambia, ejemplo «El lado de un piso cuadrado» con «largo: ?» (lectores) | | «cómo»; «términos»; cada producto en cruz en la fila del número que multiplica (teoría y Mira); el cruce escrito igual las dos veces; `alg-reparto` acepta `rotuloLargo: 'lado: ?'` (cambio aditivo, con prueba). |
| B6 | 4f | Idea 1, ejemplo «Tres términos» | 4x(2x² − 3x + 1): lo de adentro todavía se abre en (2x − 1)(x − 1) (la idea 1 no tiene aspa, pero la unidad insiste en «completa»). | 8x³ − 12x² + 8x = 4x(2x² − 3x + 2), que ya no se abre. |
| B7 | 1, 12 | Juegos 1 y 6 (lectores) | Con ancho x ya dice «Sobran: nada» y parece cumplida; «grados: MCD 2 + MCM 6 = P · Q 8» se lee mal. | «entra todo; ¿entra con uno más ancho?»; «grado de MCD · MCM: 2 + 6 = 8, el de P · Q» (también en la mesa 3). |
| B8 | 13 | Datos de las piezas (lector A) | No se dice cuánto mide una tira. | «una tira (x por 1 dm), x dm²». |
| B9 | 7 | Ejemplos «Una fila que no se abre» y «Un factor que se repite» | `ecuaciones-ancho.js`: «Factoriza por completo P(x) = ⏎ x³ − x² − 4». | «P(x) = x³ − x² − 4. Factorízalo por completo.» |
| B10 | repetición | Idea 6 «Ahora tú» tipo 2 y práctica `grado-mcm` | La respuesta es siempre 3 (dos trinomios con un factor común). | Se deja: el alumno ve una semilla por vez; queda para la ronda 2. |
| B11 | Lector B | Juego 4 (la ✗ montada sobre la «y» de 5xy), tarjeta 04 (el cuadradito 16 suelto en `alg-losetas`), tarjeta 12 («Valor numérico» resaltado), tarjeta 16 (el enunciado se corta) | Son de las piezas compartidas o de la app. | Se dejan (ver «Pendiente»). |

**Nada adelantado de otras unidades:** ni «raíz» (salvo «raíz cuadrada», que no aparece) ni ecuaciones: la prueba propia lo
mira en todo el texto. **Una sola respuesta:** las 6 misiones, el binomio del teorema del factor (una sola opción divide a
P), lo que falta en la doble especial (sympy halla los α y γ enteros: uno solo) y el Q del MCM dado lo cumplen en 400
semillas. **El avance:** la unidad está en `REHECHAS_E6` (`prediccionFZ`, con su prueba en `nucleo/avance.test.js`);
mcd-mcm conserva su Predice (misma pregunta y mismos ids de opción que en `main`).

## Lo que está bien y hay que copiar al molde

- **El hilo de Rubén**: factorizar es armar con el pedido un rectángulo sin que sobre ni falte; el ancho más grande que
  entra es el factor común; las tiras se reparten entre los dos lados en el aspa. Los dos lectores lo siguieron solos.
- **Los distractores tienen modelo**: en 7 200 opciones de la teoría y las de la práctica, todas menos las de M3, M5 y M6
  dan lo que su error produce, y ningún distractor de una factorización o de un factor es también correcto.
- **La práctica es modelo** (tipos por idea, papel generado, recálculo propio en su prueba) y la vieja
  `division-polinomios` quedó bien acotada: con la unidad solo da MCD y MCM, 400 de 400 correctos.
- **La convención escrita en el dato** de cada ejercicio que cuenta (decisión 3 de la propuesta) es la manera de cerrar
  el desacuerdo entre academias; solo le faltaba decir «enteros» en todos.

## Reglas que faltan en el contrato o el validador

| Regla | ¿Automática? |
|---|---|
| **Una factorización que se da como respuesta es completa** (A1): cada factor es primo sobre los enteros (sin un número común en sus coeficientes). | Sí, por unidad: la prueba nueva mide el contenido de cada factor; en general, con un factorizador (sympy fuera del repo). |
| **Un dato con letras dice qué es cada letra sin contradecir el ejemplo** (A2: «a y b los dos términos»). | Semi: comparar el dato con el caso (a² del dato contra el término del enunciado). |
| **Una convención que el ejercicio necesita está entera en sus Datos** (M1). | Sí, por unidad: si la pregunta dice «factores primos», el dato dice enteros, distintos y la constante. |
| **Ningún texto con un menos de teclado o dos signos seguidos** (M2): `+ -`, `· -`, `− −`. | Sí, en general: el validador puede buscarlo en «Ahora tú» y «Así se resuelve» de cada unidad. |
| **Las alternativas no llevan fichas de color** (M7). | Sí, en general: `fichas(op.texto)` vacío en `ahoraTu`. |
| **El dibujo inicial de «Así se resuelve» no muestra lo que el paso de cuentas va a hallar** (M9). | Semi, por pieza (la tabla de Ruffini con su `a` y su fila de abajo). |

## Correcciones (19 nov)

Paso 3 del cierre (`docs/metodo/unidad/6-correcciones.md`), junto con las notas de los dos lectores en frío
(`rutinas/frio/algebra.factorizacion.md`, «Correcciones de la ronda 1»). La teoría sigue en v0.3.0 (no se publicó). Las
copias de antes están en `/tmp/claude-0/-home-user/31d0ae9f-8026-5866-a5dc-2c8554ea89bf/scratchpad/e7-cierre-fz/antes/`.

Pruebas nuevas: al final de `factorizacion.test.js`, 10 («Correcciones del 19 nov»); en
`factorizacion-practica/generador.test.js`, 3; en `alg-reparto.test.js`, 1. Corridas en un espejo del repo con los
archivos de antes (`e7-cierre-fz/espejo/`), las 14 fallan.

| # | Qué se hizo |
|---|---|
| A1 | Teoría (`casoDifCuad`, «Así se resuelve» de la idea 2) y práctica (`difCuad`, `tcp`): a y b, o p y q, sin número común. Cambió la semilla 0 de `dif-cuad` en `casos.json` (4x² − 9 = (2x + 3)(2x − 3), rehecha con sympy) y el papel se regeneró (`herramientas/papel-generador.js`). Prueba: el contenido de cada factor es 1 en 400 semillas (teoría y práctica). |
| A2 | El dato: «a² − b² = (a + b)(a − b), con a y b lo que va al cuadrado (no los términos)», en la teoría y la práctica; LETRAS dice lo mismo de a y b. Prueba. |
| M1 | El dato de conteo: «Factores primos, con coeficientes enteros: se cuentan los distintos; un número solo, como el 2 de 2x, no cuenta» (teoría y práctica); «Dos factores con números» suma el dato de factor primo. Prueba en todos los ejercicios que cuentan o suman. |
| M2 | «Bien x − 1 común…» (`lin`); «en cruz, 2x · y + x · (−5y) = −3xy, el del medio»; «−3x² − (−6x²) = 3x²». Prueba de signos en las 6 ideas, 400 semillas. |
| M3 | «Bien los cuadrados (2x)² = 4x² y 1». Prueba. |
| M4 | Lectura del juego 2: «(x + 2)² = x² + 4x + 4;   tienes x² + 4x + 9». Prueba. |
| M5 | Práctica `principal`: el TAL-FACTOR-CAND es cx − k con k divisor del independiente que no anula a P. Prueba. |
| M6 | Práctica `grado-mcm`: sale el 8 (TAL-MCM-PROD). Prueba. |
| M7 | `ops` deja las alternativas en tinta (`Kit.plano`). Prueba: ninguna ficha en las alternativas. |
| M8 | Predice de la idea 4: datos «x⁴ = x² · x²; 2 = 1 · 2; el término en x² de P es 9x²». «Qué números probar»: datos del teorema del factor y «el término independiente de P es −a por el de q». Prueba. |
| M9 | «Así se resuelve» de la idea 5: el dibujo inicial con «a = ?» y la tabla vacía; el paso «Con a = …» trae la tabla llena. Prueba. |
| M10 | Datos nuevos `DA.aspaY` (aspa con dos letras) y `DT.teoC` («cx − b = c(x − b/c): es un factor de P si P(b/c) = 0»), también en la práctica (`aspa-dos`, `principal`); «Con un 2 adelante» con el aspa en los datos y «primero los enteros: P(1) = −2, no sirve». |
| M11 | «Sin término en x²» con la tabla de la doble especial (la columna del medio con «?») y la partición dicha fila por fila. |
| M12 | Glosario: «En x(y + 1) + 2(y + 1), es y + 1». Prueba. |
| M13 | «Vale si»: idea 1 «cada término se divide entre el factor común: uno que sale entero deja un 1…»; idea 2 «ya se sacó el factor común; con coeficientes enteros, a² + b² no se abre»; idea 3 «alguna partición da el término del medio; si ninguna lo da…»; idea 4 «…lo que falta se parte para que cuadren x³ y x»; idea 5 «…las fracciones son un divisor del independiente entre uno del principal…». La tabla de la regla 2 en cuatro filas, sin ∓; Lee 2 de la idea 2 recuerda (a + b)(a − b) = a² − b². |
| M14 | Voces: «El número que anula a P da el binomio con el signo cambiado: x − a» (Ahora tú 5), «Con los dos factorizados, compara los exponentes de cada factor» (Ahora tú 6), «Se prueba un candidato en la tabla y se mira la última casilla» (Mira 5), «El signo del último término dice si los números tienen igual signo; el del medio, cuál manda» (regla 3). |
| B1–B9 | Hechas como dice la tabla. B3: los códigos cambiados también en la práctica. B5: `alg-reparto` acepta `rotuloLargo: 'lado: ?'` (cambio aditivo, con prueba); en `aspaT` y en la tabla de Mira de la idea 3, cada producto en cruz va en la fila del número que multiplica. B7: también en la mesa 3. |
| B10, B11 | No se tocaron (ver la tabla y «Pendiente»). |

Después:
- unidad 24 de 24, práctica 40 de 40, `alg-reparto` 6 de 6, `division-polinomios` 27 de 27,
  `contenido/teoria/teoria.test.js` 163 de 164 (la que falla es `trigonometria/triangulos-rectangulos.js`, de otra
  sesión), después de `npm run -s catalogo`;
- validador con `calidad: 2` simulada (200 semillas): sin problemas ni pendientes;
- `cuentas.py`: 22 663 comprobaciones en verde (las 16 igualdades que su analizador corta, rehechas a mano); `cuentas-gen.py`: 13 234 en verde; `div-mcd.py`: 400 de 400;
- `herramientas/ecuaciones-ancho.js algebra.factorizacion`: «todo cabe» (66 pantallas, 635 renglones);
- `herramientas/papel-generador.js --revisar`: el de esta unidad, al día (avisa de `mcd-mcm`, de otra sesión).

No se corrió `npm test` completo (otras sesiones trabajando). Capturas `--entera` de momentos y ejemplos:
`/tmp/claude-0/-home-user/31d0ae9f-8026-5866-a5dc-2c8554ea89bf/scratchpad/e7-cierre-fz/despues/`.

### Pendiente

- **Decidido por la sesión, Gerson revisa después:** las alternativas de «Ahora tú» en tinta (M7; las demás unidades de
  la rama ya lo hacen así, y la propuesta no lo decía); el ejemplo de nivel 2 «Tres términos» cambió de polinomio (B6).
- **Se deja, con motivo:** la Predice de la idea 1 trae «6 = 3 · 2; x³ es x² por x» (lector A: «casi dicta 3x²»): son
  equivalencias y la trampa es el 1, que los datos no dicen. «Ahora tú» tipo 0 de la idea 5 se parece a su Predice (otro
  polinomio, mismo tipo: la regla 8 pide otro caso, no otro tipo). La Predice de la idea 3 salta a 2x² sin juego previo
  (es lo que se predice). La tarjeta «Con un 2 adelante» no trae la tabla de Ruffini (mostraría a = 2 y el cociente).
- **Para Gerson (piezas compartidas y app, dibujos de prueba):** en `alg-tabla`, la ✗ del juego 4 se monta sobre la «y»
  de 5xy y el aspa x–número no tiene flecha; en `alg-losetas`, el cuadradito 16 sale suelto en la última fila; en la
  app, «Valor numérico» sale resaltado en los Datos (término del glosario) y el MCD de la tarjeta 16 se corta en dos
  renglones. Ninguna cambia una cuenta.
- **Las reglas nuevas del validador** quedan como propuesta (tabla de arriba); en esta unidad ya son prueba propia.
