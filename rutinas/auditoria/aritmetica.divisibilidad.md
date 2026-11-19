# Auditoría de contenido: «Divisibilidad» (aritmetica.divisibilidad)

19 nov 2026. Auditor externo (fase 7 del método), que no escribió la unidad. Contrato: `docs/plan-calidad.md` §3 y §5.
Formato: `docs/teoria.md` 4e, 4f, 4h, 4i, 4j y §5. Vara: `docs/molde-unidad.md` §10. Reglas automáticas:
`docs/metodo/unidad/reglas-validador.md`. Decisiones: `docs/etapa5/propuesta-aritmetica.md` (§11 y §12). Lo que vieron
los dos lectores en frío de esta ronda está en `rutinas/frio/aritmetica.divisibilidad.md`; aquí se cita solo cuando el
código lo confirma o lo agrava.

**Qué se revisó.**
- La teoría `contenido/teoria/aritmetica/divisibilidad.js` (v0.4.0, sin `calidad: 2`):
  - las 6 ideas con sus 7 momentos;
  - los 90 ejemplos;
  - «Ahora tú» y «Así se resuelve» (200 semillas de cada uno por idea);
  - el glosario (15 términos), las 3 mesas y la historia.
- Las piezas `arit-boletos`, `arit-boleto` y `arit-monedas` (con sus pruebas), y lo que la unidad usa de `arit-puesto`.
- La práctica `plantillas/divisibilidad-restos/`: 26 tipos en las 6 ideas, `casos.json` y `papel.json`.
- La app a 390 px con `--entera`: los 42 momentos y los 90 ejemplos. Servidor propio en el puerto 4312.

**Cuentas.** Se rehicieron con un script propio
(`/tmp/claude-0/-home-user/31d0ae9f-8026-5866-a5dc-2c8554ea89bf/scratchpad/e5-cierre-div/cuentas.js`). De la unidad y del
generador solo lee el texto; cada respuesta sale del enunciado con BigInt y fuerza bruta (restos, potencias, cifras
ocultas, pagos). Además evalúa toda igualdad numérica escrita en cualquier texto (resueltos, `siFuera`, lecturas del
juego en toda la grilla, Mira, reglas, glosario y mesas) y toda frase «n entre d deja r».
- **Resultado: 14 893 comprobaciones, todas cuadran en la respuesta.**
  - «Ahora tú»: 1 200 casos (200 semillas por idea), con la correcta, que ningún distractor sea la respuesta y cuatro
    opciones distintas.
  - «Así se resuelve»: 1 200 casos; en la idea 6 también que cada pareja (bolsas, cajas) esté listada.
  - Los 90 ejemplos, con la letra del nivel 3 en la alternativa que da la cuenta.
  - Las 6 predicciones con cada distractor rehecho (8; 9, 7 y 5 · 6; 20 y 2 · 1; 0, 3 y 2 · 4; 2 y 1 · 2; 3, 1 y 16 ·
    5; 9, 3 y 8).
  - Las 6 misiones en toda su grilla (232, 870, 400, 18, 10 y 78 casos): cada una se cumple con un solo caso y no al abrir.
  - La práctica: 1 200 problemas (200 por idea, con `{ idea }`), los 26 de `casos.json` y los 8 del papel.
- **Lo que la respuesta no ve, y sí vio el script:**
  - una igualdad falsa en el resuelto de «Ahora tú» del 11 (A1);
  - un resuelto que se contradice cuando el número y el divisor comparten un factor (A2);
  - «p de cada d» con dos o tres respuestas si se reduce la razón (A3), también en `casos.json`;
  - ciclos de 10 restos, contra la decisión 15 (M1).

Validador con `calidad: 2` simulada (`Teoria.problemas` con 200 semillas): **0 problemas, 0 pendientes**, antes y después
de las correcciones. Ninguna de las faltas de abajo la ve una regla de hoy. Pruebas propias: `divisibilidad.test.js`
20 de 20, generador 37 de 37, piezas 6 + las de `arit-puesto`, todas en verde antes de corregir.

## Hallazgos

### Alta (el alumno no puede resolver o aprende algo falso)

| # | Punto | Dónde | Evidencia | Corrección propuesta |
|---|---|---|---|---|
| A1 | 10, 13 | Idea 5, «Ahora tú» tipo 0 (`casoOnce`, `:1674`) | Con 4 cifras la suma alternada puede bajar hasta −18. El resuelto suma siempre 11: «8 181 … −14, y −14 + 11 = 8», que es falso (−14 + 11 = −3; hace falta + 22). Pasa en 11 de 200 semillas de ese tipo. El `siFuera` de AT-PESO-NEGATIVO dice «Lo que sobra es 11 − 14». | Sumar 11 × ⌈−total ÷ 11⌉ en el resuelto, y un `siFuera` que no reste: «se le suma 11 hasta que deje de ser negativo». El generador (`once`) ya lo hace bien. |
| A2 | 10, 9 | Idea 4, «Ahora tú» tipo 4 (`casoBinomio`, `:1390`) | Con N = 9̊ + 3 los restos de 3, 9, 27… entre 9 son 3, 0, 0…: el ciclo no empieza en la primera potencia, y eso no se enseña. El resuelto dice «Ciclo de 1; 44 entre 1 deja 0» y el `siFuera` de la opción 1 dice «En 1 termina el ciclo; ahí cae solo si el exponente es múltiplo de 1»: según eso, la respuesta sería 1, y es 0. Pasa en 22 de 200 semillas de ese tipo. | Elegir el resto de N sin factor común con el divisor y con un ciclo de 3 a 6 que empiece en la primera potencia (como ya hace `casoPotencia`). |
| A3 | 10, 13 | Idea 1, «Ahora tú» tipo 4 (`casoRazon`, `:257`) y práctica `razon` (`generador.js:240`), con `casos.json` semilla 3 | «2 de cada 12» es «1 de cada 6». Con p y d con un factor común, el total solo tiene que ser múltiplo de d ÷ mcd: «2 de cada 12, entre 134 y 152» admite 23, 24 o 25. El dato «por cada grupo de d, p» lo tapa, pero un alumno que reduce la razón (lo correcto) no tiene una sola respuesta. Teoría: 10 de 40 casos. Práctica: 18 de 49. El caso verificado de `casos.json` es justo «3 de cada 9». | p y d sin factor común (`mcd(p, d) === 1`), y rehacer el caso de `casos.json`. |

### Media (el alumno se traba o duda)

| # | Punto | Dónde | Evidencia | Corrección propuesta |
|---|---|---|---|---|
| M1 | Decisión 15 | Idea 4, «Ahora tú» tipos 3 y 4 (`casoPotMas`, `casoBinomio`) | 2 entre 11 tiene un ciclo de 10 restos. La decisión 15 dice «ciclos de 3 a 6: con 10 o 12 la tabla no los muestra enteros y la solución no cabe». Pasa en 78 de 400 casos de esos tipos. `casoPotencia` y la práctica sí filtran. | El mismo filtro de `casoPotencia`: largo de 3 a 6. |
| M2 | Regla 3; 4f | Glosario, «criterio de divisibilidad» (`:2357`) | Lo estrena la idea 3 y se abre desde «Palabras de esta idea» antes de jugar. Su tercer ejemplo, «Entre 4: bastan las dos últimas cifras», es la clave de la predicción (237 en bolsitas de 4; trampas AT-CRITERIO-SUMA, -ULTIMA y -MEZCLA). La regla `glosario-predice` no lo ve: la respuesta (1) tiene una cifra. Es el M5 de Las cuatro operaciones. | Otro ejemplo que no sea el 4: «Entre 10: basta ver si termina en 0». |
| M3 | 3, letras | `D2.falta` (`:555`) y `D.falta` del generador | «Si a N le faltan k… N = d̊ − k». En la tabla de letras, k es «el entero que multiplica»; la regla y Lee llaman rₑ a lo que falta. El lector A no supo qué era la «e» chiquita de rₑ en la regla (nunca se presenta en palabras) y vio q y r aparecer en «Ahora tú» después de k. | rₑ en los datos y en la tabla de letras; la regla de la idea 1 presenta q y r con su llave; la de la idea 2 dice «rₑ: lo que falta». |
| M4 | 3; propuesta §6 | El circulito (d̊) en Datos, ejemplos y reglas de las ideas 2, 4 y 5 | Solo la tarjeta 2 de Lee de la idea 1 lo dice en palabras. Los dos lectores lo tomaron por un grado o un adorno (tarjetas 04, 05, 06 y 12; reglas de las ideas 4 y 5; Lee de la idea 5). La práctica sí trae la línea «d̊: un múltiplo de d». | Una línea de Datos «d̊ (d con un circulito): un múltiplo de d» en todo ejercicio que lo use, y la llave «múltiplo de 7» en la regla de la idea 4. |
| M5 | 13 | Idea 2, «Ahora tú» tipo 0 (`casoVeces`) y ejemplos «El resto de un producto» y «Le faltaba uno» | El dato es (d̊ + r) × (d̊ + s), el producto de dos restos; la pregunta es k pedidos iguales, donde k no es un resto. El lector A dudó si sumar o multiplicar. | Un dato propio: «k pedidos iguales: k × (d̊ + r) = d̊ + k × r». |
| M6 | 2; 4f | Idea 5, Juega (`lectura`) | Al abrir, la lectura dice «3 − 7 + 0 − 4 = −8: faltan 8»: es la respuesta de la misión. | La lectura dice la cuenta y si gana, sin «faltan k». |
| M7 | 13 | Idea 6: ejemplos «Bolsas y cajas», «Con los restos», «Con las dos clases», «Una sola compra posible»; «Ahora tú» tipo 3; práctica `articulos` | El enunciado dice «al menos una de cada una» o «enteros positivos», y los Datos «enteros que no son negativos». Se contradicen (lector B, tarjeta 17). | «enteros positivos» en los Datos de esos ejercicios. |
| M8 | 9, 12 | Reglas | Idea 1: «tantos múltiplos como el cociente entero» no dice de qué división, y «Así se resuelve» es de un tramo que la regla no nombra. Idea 2: dice «una resta» y no trae su relación. Idea 4: «la última cifra es su resto entre 10» va en «Vale si», como si fuera una condición. Idea 5: «desde las unidades» solo en la lista del 11, con el boleto dibujado al revés (2, 3, 1). | Cociente de N ÷ d y el tramo en la condición; la relación de la resta; la última cifra como relación; la llave en las tres listas y por qué 1 000 pesa −1. |

### Baja (estilo)

| # | Punto | Dónde | Evidencia | Corrección |
|---|---|---|---|---|
| B1 | Letras | Ejemplo «A uno sobra, a otro falta» | Usa a y b como números; en la tabla de letras son cifras. | Dos pedidos, sin letras. |
| B2 | Niveles | Ejemplo «El largo del ciclo» | El enunciado da 2, 4, 1, 2, 4, 1…: la respuesta se lee (lector B, tarjeta 10). | Que el alumno calcule los restos. |
| B3 | 13 | Ejemplos «Entre 8» y «Las tres últimas cifras» | `D3.cien` trae «100 = 4 × 25», que no se usa (tarjeta 08). | Solo «1 000 = 8 × 125». |
| B4 | 5 | Ejemplos «Entre 13», «Con el 13», «Un peso negativo del 7», «Entre 7 con tres cifras» | «5 × 1 − 4 × 3 − 3 × 4» mezcla cifras y pesos (tarjeta 14). | Cada peso entre paréntesis y en naranja: 4 × (−3). |
| B5 | Ejemplos | «Dos cifras, dos criterios» (tarjeta 15) y «Cuando sale negativo» (tarjeta 13) | La trampa C no dice cómo da 9; el resuelto dice «da −7» antes de mostrar la cuenta. | 13 + a = 22; la cuenta primero. |
| B6 | Regla 3 | Voz de Predice (idea 4) y de Mira (idea 3) | «No hace falta calcular la potencia» descarta la opción D; «La caja no deja nada: cuentan las dos últimas cifras» adelanta el final de Mira en el paso 1. | Voces que dicen qué mirar. |
| B7 | 1 | Lee de la idea 3: la caja de 100 | Las 5 bolsitas sobre la caja parecen botellas (lector A). Es el dibujo de prueba de `arit-puesto`, compartido. | Rótulos «1 caja: deja 1» y «1 bolsita: deja 1»; el dibujo, para Gerson. |
| B8 | 6 | Idea 6, título, pregunta y regla | «Pagar justo con dos monedas», con cinco monedas en el dibujo (lector B). | «dos clases de monedas». |
| B9 | 5 | `arit-monedas` | El rótulo dice «3 × S/ 2» y la ecuación «2 × 3». | Primero el valor: «S/ 2 × 3». |
| B10 | 8 | Ejemplo «Todas las cifras que sirven» (tarjeta 09) | La raya de 7̅3̅a̅6̅ en el segundo renglón del enunciado parece subrayar «suman». Es el interlineado de la app (`{ raya }` en texto corrido). | El numeral al empezar el enunciado y primero en los Datos; el interlineado, aparte. |
| B11 | Códigos | `casoArticulos`, `casoOculta9`, `casoBorrada` | Dos distractores con AT-RESPONDE-OTRA; «cifra + 1» con el código genérico AT-CONTEO. La regla es de las que siguen a mano. | Se deja. |
| B12 | Propuesta §1 | Regla de la idea 3 | La propuesta pedía «en base n, la suma de cifras sirve para n − 1» en la condición. No está. | Se deja: la condición dice ahora «en base 10, cifras de 0 a 9», que el lector A pidió. |

## Lo que está bien y hay que copiar al molde

- **Misiones con una sola respuesta en toda la grilla** y una prueba que la recorre: las seis, también la idea 6 (S/ 23
  con 9 + 1 o 4 + 3 monedas, pero la de menos monedas es una sola).
- **Predicciones con un código distinto por opción** y una prueba que lo exige; ningún juego llega a la situación de la
  predicción (el juego suma, la predicción multiplica; el juego reempaca de 9, la predicción de 4).
- **Fuerza bruta en las cifras ocultas**: cada `casoOculta…` y cada tipo de cifra de la práctica exigen una sola cifra que
  cumpla antes de usar el caso.
- **El generador por idea** (`TIPOS_POR_IDEA`) con el papel de las seis ideas y dos de examen de San Marcos.
- **La lista de datos del generador** con la letra explicada en la misma línea («d̊: un múltiplo de d; r y s: los restos»):
  fue la solución para la teoría (M4).

## Reglas que faltan en el contrato o el validador

| Regla | ¿Automática? |
|---|---|
| **Toda igualdad numérica de un texto es cierta**: sumas, restas y productos de enteros escritos en resueltos, `siFuera`, lecturas del juego y Mira (A1). | Sí: el comprobador de `cuentas.js` evalúa los tramos con números, + − × ÷ y =, en 200 semillas. Encontró A1 y nada más. |
| **Una razón «p de cada d» va reducida** cuando el ejercicio usa que el total es múltiplo de d (A3). | Sí, para el patrón «(\d+) de cada (\d+)». |
| **Una notación nueva se dice en palabras en los Datos de cada ejercicio que la usa** (el circulito; antes, la raya). | Sí: el nodo `{ mult }` en un ejercicio exige una línea de Datos con su glosa. La unidad ya lo prueba con `usaMu`. |
| **La regla `glosario-predice` también para respuestas de una cifra**, con marcas reservadas («entre 4», «dos últimas») que declara la predicción (M2). | Parcial: necesita que cada `predice` declare sus marcas. |
| **«al menos una de cada una» o «positivos» en el enunciado no va con «no negativos» en los Datos** (M7). | Sí: búsqueda de texto. |
| **Una letra de Datos con otro significado que el de la tabla de letras** (k como «lo que falta») (M3). | Parcial: `letras-datos` ve que la letra está dicha, no que se dice igual. |
| **Un generador que reduce restos de potencias declara el largo máximo de ciclo y que empiece en la primera potencia** (A2, M1). | Sí, dentro de la prueba de la unidad: se recalcula el ciclo de cada caso. |

## Correcciones (19 nov)

Fase 8 del método (`docs/metodo/unidad/6-correcciones.md`), junto con las dos notas del lector en frío (ver
`rutinas/frio/aritmetica.divisibilidad.md`, «Correcciones de la ronda 1»). La teoría pasa a v0.4.1. Copias de antes en
`/tmp/claude-0/-home-user/31d0ae9f-8026-5866-a5dc-2c8554ea89bf/scratchpad/e5-cierre-div/antes/`.

Las pruebas nuevas van al final de `divisibilidad.test.js` (9), de `generador.test.js` (2) y de
`arit-boleto.test.js` (1, para `arit-monedas`). Con la versión de antes fallan las 11 de la unidad y del generador (comprobado con los archivos de antes); la de la
pieza, por construcción (antes escribía «3 × S/ 2»). Después: unidad 29 de 29, generador 39 de 39, piezas en verde, validador con `calidad: 2` simulada sin
problemas, `cuentas.js` 14 893 de 14 893, `herramientas/ecuaciones-ancho.js aritmetica.divisibilidad`: «todo cabe»
(60 pantallas). `contenido/teoria/teoria.test.js`: falla solo en unidades de geometría y de razonamiento matemático que
otras sesiones están editando, no en esta. No se corrió `npm test` completo (otras sesiones trabajando). Se corrió
`npm run catalogo`: de esta unidad cambia solo `app/datos/glosario/aritmetica.json`.

| # | Qué se hizo |
|---|---|
| A1 | `casoOnce` suma 11 × ⌈−total ÷ 11⌉: «−14 + 22 = 8». El `siFuera` de AT-PESO-NEGATIVO ya no resta («se le suma 11 hasta que deje de ser negativo»). Prueba: en 200 casos del tipo, toda suma escrita en el resuelto es cierta y ningún `siFuera` dice «11 − 12…19»; exige que el caso negativo siga saliendo. |
| A2 | `casoBinomio` usa solo restos con un ciclo de 3 a 6 que empieza en la primera potencia (sale 9̊ + 3 y 11̊ + 2). Prueba: recalcula el ciclo de cada caso de los tipos 3 y 4 en 1 000 semillas. |
| A3 | `casoRazon` y `razon` del generador exigen p y d sin factor común. El caso de `casos.json` semilla 3 se rehizo: «5 de cada 9», entre 59 y 68, da 35 (63 = 9 × 7; recalculado aparte en Python). El papel se regeneró: solo cambió p2 (la línea de k pedidos iguales); p8 ya era «4 de cada 9». Pruebas: en la teoría y en el generador, mcd(p, d) = 1 y un solo total aunque se reduzca la razón. |
| M1 | `casoPotMas` descarta ciclos de más de 6 (la misma prueba de A2). |
| M2 | El ejemplo pasa a «Entre 10: basta ver si termina en 0». Prueba: ningún término de la idea 3 dice «entre 4» ni «dos últimas». |
| M3 | `D2.falta` y `D.falta` dicen «le faltan rₑ… N = d̊ − rₑ»; `r_e` entra en `def.letras`. La regla de la idea 1 agrega «si sobran: N = d × q + r», con llaves «bolsitas llenas» y «sueltos». La de la idea 2 dice «rₑ: lo que falta» y su condición, «r + rₑ = d». Lee 2 de la idea 2 nombra rₑ. Pruebas en la unidad y en el generador. |
| M4 | `D2.mu`, «d̊ (d con un circulito): un múltiplo de d, es decir, d por un entero», entra sola en los Datos de todo ejemplo, «Ahora tú» y «Así se resuelve» que usan el circulito (`conMu`, al armar la unidad). La regla de la idea 1 dice «con circulito: múltiplo de d»; la de la idea 4 lleva la llave «múltiplo de 7»; Lee 1 de la idea 5 dice «El 11 con circulito es “un múltiplo de 11”». Prueba: recorre ejemplos y 60 semillas por idea. |
| M5 | `D2.veces` en `casoVeces`, «El resto de un producto» y «Le faltaba uno»; en la práctica, `D.veces` en `veces` y `triple`. |
| M6 | La lectura dice «3 − 7 + 0 − 4 = −8: no es 0, no gana» o «es múltiplo de 11, gana». La consigna dice que la lluvia borró la segunda cifra y que el alumno prueba cifras en su lugar. Prueba: la lectura al abrir no dice «faltan» ni «sobra». |
| M7 | `D6.ec(…, true)` dice «enteros positivos» en los cuatro ejemplos, en `casoArticulos` y en `articulos` del generador. Prueba: todo ejercicio de la idea 6 con «al menos una de cada» lleva «enteros positivos». |
| M8 | Idea 1: «el cociente de N ÷ d» y, en la condición, «En un tramo, se quitan los múltiplos de antes de su comienzo». Idea 2: la relación de la resta y «Si r − s es negativo, se suma d». Idea 4: «la última cifra de una potencia = su resto entre 10» pasa a la ecuación. Idea 5: «desde las unidades» en las tres listas, y la condición dice «de derecha a izquierda» y «1 000 = 7 × 143 − 1». |
| B1 | «Un pedido deja 9 sueltos en bolsitas de 11, y a otro le faltan 4…»; sin a ni b. |
| B2 | «¿Cuánto mide el ciclo de los restos de las potencias de 2 entre 7?», con los datos del ciclo y de cómo sigue; el resuelto calcula 2, 4, 1, 2. |
| B3 | Esos dos ejemplos traen solo «1 000 = 8 × 125». |
| B4 | Cifra × (peso), con el peso en naranja, en los cuatro ejemplos. |
| B5 | «C suma las cifras: 13 + a = 22 da 9»; «Desde las unidades: 1 − 9 + 1 = −7» va primero. |
| B6 | Predice 4: «Mira cómo siguen los sueltos de la tabla». Mira 3: «Mira qué deja cada envase entre 4». El paso 1 de Mira 4 escribe 2¹ = 2 = 7 × 0 + 2. |
| B7 | Rótulos «1 caja: deja 1» y «1 bolsita: deja 1» en Lee 1 de la idea 3. El dibujo de la caja queda para Gerson. |
| B8 | Título «Dos clases de monedas, pago justo» (6 palabras); pregunta, regla, aprendizaje y un `siFuera` dicen «dos clases». |
| B9 | `arit-monedas` escribe «S/ 2 × 3 = S/ 6», con su prueba. |
| B10 | El ejemplo empieza «7̅3̅a̅6̅ es múltiplo de 4…» y la línea del numeral va primera en los Datos. El interlineado de la raya en texto corrido es de `app/` o `nucleo/ecuacion.js`: queda anotado. |
| B11, B12 | No se tocaron (ver la tabla). |

### Pendiente

- **Para Gerson (dibujos de prueba, `arit-puesto` compartido):** la caja con bolsitas que parecen botellas; los rótulos
  «4 + 2 bolsitas» y «2 + 1 sueltos» del juego de la idea 2, que el lector A vio corridos; los sueltos diminutos del juego
  de la idea 4; la cifra «borrada» del boleto, que se ve como una cifra normal en violeta.
- **De `app/` o `nucleo/`:** la raya (overline) de un numeral en el segundo renglón de un texto toca el renglón de arriba.
- **Las reglas nuevas del validador** quedan como propuesta (tabla de arriba); en esta unidad, varias ya son prueba propia.
- **Decidido por la sesión, Gerson revisa después:** el título de la idea 6 cambió (el `id` no): «Dos clases de monedas,
  pago justo», porque «dos clases de monedas» no cabe en las 6 palabras con «pagar justo».
