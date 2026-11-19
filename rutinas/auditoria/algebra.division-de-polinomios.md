# Auditoría de contenido: «División de polinomios y cocientes notables» (algebra.division-de-polinomios)

19 nov 2026. Auditor externo (cierre con criterio delegado, `docs/metodo/unidad/cierre-delegado.md`; encargo de
`docs/metodo/unidad/5-auditor.md`), que no escribió la unidad. Contrato: `docs/plan-calidad.md` §3 y §5. Formato:
`docs/teoria.md`. Vara: `docs/molde-unidad.md` §10. Reglas automáticas: `docs/metodo/unidad/reglas-validador.md` y lo que
encontraron los auditores de la Etapa 5 (`docs/metodo/unidad/etapa-delegada.md`). Decisiones:
`docs/etapa6/propuesta-algebra.md` (§10 y «Cambios»). Lo que vieron los dos lectores en frío está en
`rutinas/frio/algebra.division-de-polinomios.md`; aquí se cita cuando el código lo confirma o lo agrava.

**Qué se revisó.**
- La teoría `contenido/teoria/algebra/division-de-polinomios.js` (v0.3.0, sin `calidad: 2`, en `main` desde 8fc1fb4a):
  - las 6 ideas con sus 7 momentos y los 90 ejemplos;
  - «Ahora tú» y «Así se resuelve», 400 semillas de cada uno por idea;
  - el glosario (15 términos), las 3 mesas del laboratorio (sus lecturas en toda la grilla) y la historia.
- La pieza nueva `alg-reparto` (pasadizo, piso que se angosta y cuaderno: división larga, Horner y Ruffini) y su prueba.
- La práctica `plantillas/division-practica/` (27 tipos en las 6 ideas, `casos.json` y `papel.json`) y la vieja
  `plantillas/division-polinomios/`, que seguía en la ficha.
- La app a 390 px con `--entera`: los 42 momentos y los 90 ejemplos. Servidor propio en el puerto 4412.

**Cuentas.** Rehechas con scripts propios en
`/tmp/claude-0/-home-user/31d0ae9f-8026-5866-a5dc-2c8554ea89bf/scratchpad/e6-cierre-div/scripts/`. `volcar.js` y
`volcar-gen.js` solo sacan el texto que ve el alumno; `expr.py` lo lee con un analizador propio (superíndices, ÷,
fracciones, coma decimal, miles con espacio, producto implícito) y `cuentas.py` y `cuentas-gen.py` calculan con sympy
(`div`, restos, sistemas de m y n, cocientes notables en dos letras con orden lex), sin el código de la unidad.
- **Teoría: 18 972 comprobaciones, todas en verde después de corregir.**
  - **Igualdades: 6 966**, todas ciertas: toda igualdad escrita, con polinomios o con números, en Lee, Mira, regla,
    ejemplos (enunciado, datos, figura, resuelto), Predice, `siFuera`, lecturas del juego en toda su grilla, misiones y
    leyendas, «Ahora tú» y «Así se resuelve» en 400 semillas, glosario y las tres mesas (6 175 estados). Se comparan
    simbólicamente.
  - **«Ahora tú»: 2 400 casos** (400 por idea): la correcta es la división, el resto, el término o el parámetro que
    pide el enunciado; ningún distractor vale lo mismo; cuatro opciones. Los m y n por hallar tienen una sola solución.
  - **El valor de cada distractor: 7 200.** Cada error (PO, TAL-, AL16) tiene su modelo propio (usar −a, olvidar el
    0, sumar en vez de restar, el cociente falso, evaluar en c, la potencia par como negativa, el término de al lado…) y
    el texto de la opción debe ser lo que ese error da. Encontró M1.
  - **«Así se resuelve»: 2 400 casos**, la respuesta rehecha del enunciado (y la caja, posible: ancho mayor que 0).
  - **Misiones: 6**, cada una con un solo caso en su grilla y no cumplida al abrir.
- **Práctica: 10 808 comprobaciones** (400 semillas por idea): 2 400 respuestas y 8 408 valores de distractor con los
  mismos modelos. Encontró M1 también aquí. `casos.json` (27 casos) y el papel salen del generador y se recalculan.
- **Los 90 ejemplos**: sus igualdades entran en las 6 966. Los 30 de nivel 3 y sus 120 explicaciones de distractor se
  rehicieron a mano, uno por uno, y los nuevos con sympy: 118 daban el valor de su alternativa (las otras dos: M2 y B5).

Validador con `calidad: 2` simulada (`Teoria.problemas`, 200 semillas): **0 problemas y 0 pendientes**, antes y después.
`herramientas/ecuaciones-ancho.js`: «todo cabe» (62 pantallas). Pruebas propias en verde antes de corregir (unidad 12,
pieza 4, práctica 38, vieja 26). **Ninguna de las faltas de abajo la ve una regla de hoy ni una prueba propia.**

## Hallazgos

### Alta (el alumno no puede resolver o aprende algo falso)

| # | Punto | Dónde | Evidencia | Corrección propuesta |
|---|---|---|---|---|
| A1 | 13; regla 1 de la Etapa 5 | Glosario, «división exacta» (`:2337`) | Su ejemplo de lo que no es exacto, «x⁴ + 2x³ − x + 0 entre x² + x − 1 no lo es: deja resto», es falso: x⁴ + 2x³ − x = (x² + x − 1)(x² + x), resto 0. Además es la respuesta del ejemplo «Para que salga exacta» (m = −1, n = 0). El glosario se abre desde «Palabras de esta idea». | Un ejemplo cierto que no toque ningún ejercicio. Una prueba que divida lo que el glosario afirma. |

### Media (el alumno se traba o duda)

| # | Punto | Dónde | Evidencia | Corrección propuesta |
|---|---|---|---|---|
| M1 | 4f; regla 2 de la Etapa 5 | Idea 4, «Ahora tú» tipo 3 (`casoCuartoK`); práctica `cociente-frac` | El distractor PO2 («usa b/c en vez de −b/c») muestra el cociente con los signos alternados, que no es lo que da ese error: con x = b/c el cociente ni siquiera sale con enteros (100 de 100 casos en la teoría, 94 de 94 en la práctica). | Otro error real con enteros: multiplicar por c en vez de dividir (TAL-K-MULT, c²·q). |
| M2 | 4f; niveles | Idea 2, ejemplo «El coeficiente de x del resto» (tarjeta 06 del lector B) | La C, «suma 18x en vez de restarlo», da −3x + 18x = 15x, no 21 (el lector B lo encontró). El resuelto salta los dos primeros pasos. Y es la misma división del ejemplo de nivel 2 «El término independiente del cociente», con un paso más. | La C «resta al revés: 18x − (−3x) = 21x»; los tres pasos del cociente; otra división en el de nivel 2. |
| M3 | 4f; regla 4 de la Etapa 5 (`glosario-predice`) | Glosario de las ideas 4, 5 y 6; Lee 1 y 3 de la idea 6 | • «Cociente falso»: «…antes de dividirlo entre c» es la respuesta de la predicción de la idea 4.<br>• «Teorema del resto»: «lo que sobra es D(a): basta evaluar» y «Entre x + 3 se evalúa en −3» son la regla y la trampa de la predicción de la idea 5.<br>• «Término de lugar k»: «x³ + 2x² + 4x + 8» es la misión de la idea 6 (1248) y el patrón de su predicción (8x²); «x²y²» es la respuesta de un ejemplo.<br>• Lee 1 y 3 de la idea 6: x² + 2x + 4 = 124 y la calculadora con 992 ÷ 8 = 124, el comienzo de 1248 con a = 2.<br>La regla no lo ve: las respuestas tienen una cifra o no se dicen como «= N». | Definiciones que no digan el método; ejemplos sin potencias de 2; Lee con a = 3 (139). |
| M4 | 3, 13 | Datos de las ideas 3 y 4 (tarjetas 09 y 11, «Así se resuelve» y «Ahora tú» de cx + b) | «… más a por la casilla anterior»: a no se dice en ningún dato de la idea 3, y en la idea 4 el número es x = −b/c (la regla no lo llama a). Lo trabó al lector B tres veces. La práctica dice lo mismo. | Idea 3: «con a el número que anula al divisor». Idea 4: «más −b/c por la anterior». |
| M5 | 9, 12; regla | Idea 2: regla, Mira 6 y ejemplo «La misma cuenta en Horner» (tarjeta 05) | La tabla de Horner aparece llena y nadie dice por qué los demás términos de d cambian de signo ni por qué cada columna se divide entre el primero de d (lector A: «no la podría repetir solo»). La tarjeta 05 dice «cada uno da sus productos en diagonal» sin decir cuáles ni adónde van. | La condición y Nox lo dicen; Mira 6 lo muestra con 6 ÷ 2 = 3 y sus productos; la tarjeta, producto por producto. |
| M6 | 5, §5b | El 0 de una potencia que falta, en violeta (`celD`, `OLV`): figuras de Horner, Ruffini y cocientes notables, Mira y ejemplos | Los dos lectores leyeron el 0 violeta de D como parte del cociente (el violeta es q en toda la unidad). La propuesta lo tomó de Polinomios («lo que se olvida»), donde no hay cociente. | El 0 en tinta, como los demás coeficientes de D. Decisión de color: la toma la sesión. |
| M7 | 7; molde §2 | Reglas de las ideas 1, 2, 4 y 5 (`SEP`) | «D = d · q + r   ·   grado de q = …», «x = −b/c · q = q′/c · r = …»: un «·» entre dos igualdades se lee como un producto. La propuesta lo marcó como defecto (diagnóstico, punto 8) y quedó en las reglas. | Punto y coma. |
| M8 | 3, 9 | Idea 5, regla y Nox | «si d(a) = 0: r(a) = D(a)» escribe el resto como función cuando, con x − a, es un número (lector B). Nox habla de un divisor de grado 2 y de «mx + n» que nada explica, aunque «Ahora tú» y un ejemplo de nivel 3 lo piden. | «en x = a: D(a) = 0 · q(a) + r = r»; Nox dice qué vale el resto mx + n. |
| M9 | 1, 4 | Idea 4, Lee 1 | La tarjeta habla del pasadizo de (x + 1) dm y del de (2x + 2) dm, y el dibujo es el de (6x + 6) dm, con «largo: x» sobre el lado corto (lector B). | Lee 1 dibuja el de (x + 1) dm (largo 6x), el que nombra. |
| M10 | 13 | Idea 4, ejemplo «El pasadizo de ancho 3x + 3» (tarjeta 12) | El resuelto usa Ruffini con x = −1 y el cociente falso; los datos solo hablan de losetas y de multiplicar (lector B). | Los datos del cociente falso, de q = q′ ÷ c y de la casilla. |
| M11 | 13 (`datos-respuesta` en espíritu) | Idea 4, ejemplo «El resto no se divide» (tarjeta 10) | El enunciado da la fila 8, 2, 4, 3 y el dato «Resto: la última casilla, sin dividir»: la respuesta está dicha (lector B). | Datos que den la herramienta (2x − 1 = 2(x − 1/2), la tabla divide entre x − 1/2, D = d · q + r) y un resuelto que muestre por qué el 3 no cambia. |
| M12 | 10, 13 | Idea 5, «Así se resuelve» (la caja) | Sin dibujo y sin dato de cuánto pierde cada lado de la cartulina: el largo 30 − 2x sale solo del primer paso (lector B). | Un dato: «Al doblar, cada lado de la cartulina pierde dos cuadrados; el alto es x». |
| M13 | niveles | Idea 4, ejemplos de nivel 3 «Suma de coeficientes del cociente» y «Cociente y resto juntos» | Repiten la división de «El resto no se divide» (nivel 1, que ya da la tabla) y de «Grado 4 entre 2x + 1» (nivel 2): el nivel 3 es el ejemplo anterior con una suma más. | Otras divisiones, rehechas aparte. |
| M14 | 8; figura | Idea 3, «Ahora tú» tipo 0 (y toda tabla con «?») | En la pieza, la casilla «?» medía como el texto «undefined»: su columna salía 88 de ancho y las otras 31; los coeficientes de arriba quedaban corridos y −3 y −5 pegados (lector A). | `T.ancho('?')` para la casilla por hallar; prueba numérica en la pieza. |
| M15 | 3; regla | Idea 1, Juega | La lectura pinta en naranja, el color del resto, lo que sobra con k = 0, 1, 2 (3x + 7, 2x + 5, x + 3), que tiene el grado del divisor; la leyenda dice «Sobran: el resto». Choca con la regla (lector A). | Naranja solo con k = 3; la leyenda dice que es el resto cuando ya no alcanza. |
| M16 | práctica por idea; punto 9 | `plantillas/division-polinomios/` en la ficha de la unidad | Es mixto y `generar` no mira la unidad: 2 de cada 8 problemas son MCD y MCM de polinomios (Factorización, una unidad posterior) y salen en la práctica y en los exámenes de esta unidad (`app/app.js`, `vExamen`, usa todos los generadores de la ficha). Sus tipos de división ya están, por idea y verificados, en `division-practica`. | Sale de esta unidad (ver «Decisión: MCD y MCM»). |

### Baja (estilo)

| # | Punto | Dónde | Evidencia | Corrección |
|---|---|---|---|---|
| B1 | 5 | Idea 5, «Ahora tú» tipo 3 | «1 + 1m − 5 = 0» con x = ±1 y «8 + 4m + 0 = 0» cuando cx + d = 0. | Sin el 1 ni el «+ 0». |
| B2 | 7 | Idea 5, Juega | «D(5) = (5 − 2) · 8 + 7»: el ancho con su cuenta y el largo ya hecho (lector B). | «(5 + 3)». |
| B3 | 2 | Idea 4, Mira | Nox: «Yo había comprimido un paso. Abrámoslo» (lector B). | Otra voz. |
| B4 | 7 | Idea 6, regla | «Con x + a abajo» y un «Vale si» apretado (lector B). | «en el divisor», en dos frases. |
| B5 | 4f | Idea 4, ejemplo «El cociente con x = 1/2», la E | «Divide entre 2 solo los dos primeros términos» daría 2x² − 2x + 6, no x² − x + 3. | La E vale 2x² − 2x + 6, lo que da su error, y la frase lo dice. |
| B6 | 13 | Idea 5, ejemplo «Potencias de −2» (tarjeta 14) | El dato «(−2)⁵ = −32 y (−2)⁴ = 16» es el paso hecho (lector B). | La regla con otras potencias: «(−2)² = 4 y (−2)³ = −8». |
| B7 | estilo | Idea 1 regla; idea 1, tarjeta 02; Juega 6 | «a lo más, uno menos» suena cortado (A); «cada loseta del ancho x pide x de largo» (B); leyenda «x = 10: con x = 10…» (B). | Frases nuevas. |
| B8 | título | Idea 3, ejemplo «Resto con cuatro ceros posibles» | Faltan dos potencias (x³ y x); el título no dice qué son los «cuatro ceros». | «Resto con dos potencias que faltan». |
| B9 | repetición | Idea 6, ejemplos «Con potencias en el divisor» y «Un término con potencias» | La misma división (x¹² − y⁸) ÷ (x³ − y²), los dos de nivel 2. | Se deja: preguntan cosas distintas (cuántos términos y el segundo término) y la prueba nueva solo mira las de nivel 3. |
| B10 | 5 | Práctica `caja` | La alternativa del área (TAL-CAJA-AREA) sale con «cm³». | Se deja, como en Polinomios (B13): el distractor muestra lo que escribe quien comete el error. |
| B11 | Lector A | Idea 3, Lee 3 | Las flechas muestran «multiplica y sube», no la suma hacia abajo. | Se deja: la tarjeta pide descubrir la cuenta en el juego. |

**Nada adelantado de otras unidades** (salvo M16): no hay «factor», «raíz» ni «divisores binómicos»; «D(a) = 0» se dice
«división exacta» y «divisible». **Notación**: D, d, q y r, las de «Las cuatro operaciones», con `letras` en la unidad;
q′ se presenta en la idea 4 antes de usarse; t_k, en el glosario y en la regla de la idea 6. **Una sola respuesta**: las
6 misiones, los m y n de las divisiones exactas, los exponentes por hallar (un solo n entre 2 y 39) y los restos entre
dos binomios lo cumplen en toda su grilla o en 400 semillas.

## Decisión: MCD y MCM de polinomios (la vieja `division-polinomios`)

**Salen de esta unidad** (decidido por el auditor, como pidió el encargo; Gerson revisa después). Motivos: son de
Factorización (`teorema-factor`, propuesta §1, «Qué no entra»); el generador no separa sus tipos por unidad, así que
llegaban a la práctica y al examen de esta unidad (M16); y sus cinco tipos de división (cociente, resto2, identidad,
parámetros, caja) ya están en `division-practica`, por idea, con 400 semillas verificadas. Cambio mínimo:
- `plantillas/division-polinomios/plantilla.json`: `unidades` queda en `["algebra.factorizacion"]`;
- `catalogo/cursos/algebra.json`: la ficha de la unidad queda con `["division-practica", "polinomios"]`;
- `nucleo/repaso-tipos.js`: sale la fila de `division-polinomios` (ya no es mixto; la prueba exige que cada fila lo
  sea) y `nucleo/repaso-tipos.test.js` comprueba que no cubre esta unidad y que sus MCD y MCM son de Factorización.

Queda para quien rehaga Factorización: ese generador le da también problemas de división (como antes, porque no mira la
unidad); en su repaso ahora cuentan como de Factorización. El `papel.json` viejo no se tocó: sus problemas dicen su
unidad y la app, al llegar desde Factorización, muestra solo el de MCD y MCM.

## Lo que está bien y hay que copiar al molde

- **El hilo del maestro Rubén**: el pasadizo hace ver que el resto tiene grado menor que el ancho, que un ancho c veces
  mayor da un largo c veces menor sin tocar lo que sobra, y el piso que se angosta hace ver el teorema del resto (con
  x = a el rectángulo desaparece). Los dos lectores lo entendieron sin ayuda.
- **Misiones de un solo caso** en toda su grilla, comprobadas por prueba; predicciones que no salen ni en «Ahora tú» ni
  en la práctica (la práctica lo prueba con sus enunciados).
- **Los distractores tienen modelo**: en 15 600 opciones de la teoría y la práctica, todas salvo las de M1 dan lo que su
  error produce. Es lo que hay que exigir a cada unidad (ver la tabla de abajo).
- **La práctica es modelo**: `TIPOS_POR_IDEA`, fugas, datos por tipo, papel generado y recálculo independiente en su
  prueba.

## Reglas que faltan en el contrato o el validador

| Regla | ¿Automática? |
|---|---|
| **Lo que el glosario afirma de un caso es cierto** (A1): «no lo es», «deja N», «da …», «es exacta» se recalculan. | Sí, por unidad: la prueba nueva de esta unidad divide lo que dice el glosario. En general, solo con el motor de cada curso. |
| **Cada distractor vale lo que da su error** (M1): un modelo por código de error que recalcula la opción. | Semi: con el motor de errores de cada unidad. Aquí lo hizo `cuentas.py` (7 200 + 8 408 opciones) y ahora, para M1, una prueba de la teoría y otra de la práctica. |
| **Un ejemplo de nivel 3 no repite la división de otro ejemplo de su idea** (M2, M13). | Sí, por texto: la prueba nueva compara «A entre B» de los enunciados (los «Comprobar…» se permiten). |
| **Toda letra de un dato está dicha en ese dato o en el ejercicio**, aunque esté en la tabla de letras (M4): `letras-datos` acepta a porque está en `letras`, pero el alumno no ve esa tabla. | Parcial: exigir la glosa en el mismo ejercicio para las letras que no aparecen en su enunciado. |
| **El color de una magnitud no se reusa para otra cosa en la misma figura** (M6: el violeta del cociente en un coeficiente de D). | Semi, por pieza: la celda de una fila de D no lleva el color del cociente. |
| **La casilla «?» mide como su «?»** (M14), y en general: las columnas de una tabla del kit no cambian de ancho por una casilla vacía. | Sí, por pieza (prueba nueva de `alg-reparto`). |

## Correcciones (19 nov)

Paso 3 del cierre (`docs/metodo/unidad/6-correcciones.md`), junto con las notas de los dos lectores en frío
(`rutinas/frio/algebra.division-de-polinomios.md`, «Correcciones de la ronda 1»). La teoría sigue en v0.3.0 (no se
publicó). Las copias de antes están en `/tmp/claude-0/-home-user/31d0ae9f-8026-5866-a5dc-2c8554ea89bf/scratchpad/e6-cierre-div/antes/`.

Pruebas nuevas: al final de `division-de-polinomios.test.js`, 11 («Correcciones del 19 nov»); en `alg-reparto.test.js`,
1; en `division-practica/generador.test.js`, 1; en `nucleo/repaso-tipos.test.js`, 2 aserciones. Corridas en un espejo del
repo con los archivos de antes, las 13 pruebas fallan (y la de repaso-tipos, por construcción).

Después:
- unidad 23 de 23, pieza 5 de 5, práctica 39 de 39, `division-polinomios` 26 de 26, `repaso-tipos` 7 de 7,
  `contenido/teoria/teoria.test.js` 164 de 164, después de `npm run catalogo`;
- validador con `calidad: 2` simulada (200 semillas): sin problemas ni pendientes;
- `cuentas.py`: 18 972 de 18 972; `cuentas-gen.py`: 10 808 de 10 808; las divisiones nuevas, también con sympy;
- `herramientas/ecuaciones-ancho.js algebra.division-de-polinomios`: «todo cabe» (62 pantallas);
- `herramientas/papel-generador.js --revisar`: al día (papel de `division-practica` regenerado: cambiaron los datos de
  Ruffini en p2 y p5); `herramientas/papel-reglas.js`: sin hallazgos de la unidad.

No se corrió `npm test` completo (otras sesiones trabajando). Capturas `--entera` de momentos, ejemplos y glosario:
`/tmp/claude-0/-home-user/31d0ae9f-8026-5866-a5dc-2c8554ea89bf/scratchpad/e6-cierre-div/despues/`.

| # | Qué se hizo |
|---|---|
| A1 | «división exacta»: «x² + 3 entre x + 1 no lo es: deja 4». Prueba: lo que el glosario dice de una división («no lo es», «deja N», «sobra N») se divide aparte. |
| M1 | Teoría y práctica: el PO2 del cociente con x = −b/c en fracción pasa a TAL-K-MULT (c²·q, «el cociente falso se divide entre 2, no se multiplica»). El caso de `casos.json` que cambió (cociente-frac, semilla 0) se rehízo con sympy. Pruebas en las dos. |
| M2 | La C: «resta al revés: 18x − (−3x) = 21x»; el resuelto con las tres vueltas (x², −3x y 9). El de nivel 2 divide x⁴ + x³ − 2x² + 3 entre x² − x + 1 (q = x² + 2x − 1, término independiente −1). Prueba de divisiones repetidas y del 21. |
| M3 | «cociente falso»: «Lo que deja la tabla de Ruffini cuando el divisor es cx + b, con c distinto de 1». «teorema del resto»: «El teorema que da el resto … sin hacer la división», con ejemplos que no evalúan. «término de lugar k»: 5x³ − x + 7 y a + b + c. Lee 1 y 3 de la idea 6 con a = 3 (x² + 3x + 9 = 139; 973 ÷ 7). Prueba. |
| M4 | Idea 3: «… el de arriba más a por la anterior, con a el número que anula al divisor» (16 datos). Idea 4: «… más −b/c por la anterior». En la práctica, `casilla` y `casillaK` (≤ 22 palabras). Pruebas. |
| M5 | Condición de Horner: «D y d van de mayor a menor potencia, con sus 0; en Horner, d cambia de signo menos el primero». Nox: «se suma, y cada columna se divide entre el primero de d». Mira 6 con 6 ÷ 2 = 3, 3 · (−1) = −3 y 3 · 1 = 3. La tarjeta 05 en cuatro líneas, con cada producto y su columna. Prueba. |
| M6 | El 0 de una potencia que falta va en tinta (`celD`, `OLV`); «lo que se olvida» sale de `def.colores`. **Decidido por la sesión, Gerson revisa después.** Prueba. |
| M7 | `SEP` es «;   » en las cuatro reglas. Prueba. |
| M8 | Regla: «en x = a: D(a) = 0 · q(a) + r = r». Nox: «Si el divisor es de grado 2, el resto es mx + n: vale lo mismo que D donde el divisor vale 0». Prueba. |
| M9 | Lee 1 de la idea 4 dibuja el pasadizo de (x + 1) dm. Prueba. |
| M10 | Datos del ejemplo: cociente falso, q = q′ ÷ c y la casilla. Prueba. |
| M11 | Datos: «La tabla con x = 1/2 divide entre x − 1/2», «2x − 1 = 2(x − 1/2)» y D = d · q + r; el resuelto: D = (2x − 1)(4x² + x + 2) + 3. Prueba. |
| M12 | Dato nuevo en la caja: «Al doblar, cada lado de la cartulina pierde dos cuadrados; el alto es x». Prueba. |
| M13 | «Suma de coeficientes del cociente»: 6x³ + x² − 4x + 4 entre 2x − 1 (q = 3x² + 2x − 1, r = 3; alternativas 8, 11, 4, 7, 2, la C). «Cociente y resto juntos»: 4x⁴ + 2x³ − 6x + 3 entre 2x + 1 (q = 2x³ − 3, r = 6; alternativas 2, 5, 4, −1, 3, la B). Las letras siguen repartidas. Rehechas con sympy y a mano. Prueba de divisiones repetidas. |
| M14 | `alg-reparto`: la casilla por hallar mide como «?». Prueba en la pieza (anchos 31,5 / 87,7 / 31,5 / 31,5 antes). |
| M15 | Lectura del juego 1: lo que sobra en naranja solo con k = 3; leyenda «Sobran: lo que queda aparte al final: el resto». Prueba. |
| M16 | Ver «Decisión: MCD y MCM». |
| B1–B8 | Hechas como dice la tabla (B1 y B2 con prueba; B5 rehecha a mano: la tabla de 4x³ − 6x² + 8x − 3 da 4x² − 4x + 6, y solo los dos primeros entre 2 dan 2x² − 2x + 6). |
| B9–B11 | No se tocaron (ver la tabla). |

### Pendiente

- **Decidido por la sesión, Gerson revisa después:** M6 (el 0 de la potencia que falta en tinta, no en violeta; cambia
  la regla de colores de la propuesta, §6) y M16 (MCD y MCM salen de esta unidad: `division-polinomios` queda solo para
  Factorización).
- **Para Gerson (dibujos de prueba de `alg-reparto`):** la caja de cartulina no tiene pieza (la pide el lector B en
  «Así se resuelve» del teorema del resto); el rótulo «x − 2 = 0 dm» queda apretado junto a «largo» en la regla de la
  idea 5 (no se pisan: la prueba lo mide).
- **Las reglas nuevas del validador** quedan como propuesta (tabla de arriba); en esta unidad, varias ya son prueba propia.
