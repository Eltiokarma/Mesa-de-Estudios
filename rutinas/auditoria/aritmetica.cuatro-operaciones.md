# Auditoría de contenido: «Las cuatro operaciones» (aritmetica.cuatro-operaciones)

18 nov 2026, noche. Auditor externo (fase 7 del método), sin editar la unidad. Contrato: `docs/plan-calidad.md` §3 y §5.
Formato: `docs/teoria.md` 4e, 4f, 4h, 4i y §5. Vara: `docs/molde-unidad.md` §10. Decisiones: `docs/etapa4/decisiones.md`
y `docs/etapa4/propuesta-aritmetica.md`. Lo que ya encontró el lector en frío (`rutinas/frio/aritmetica.cuatro-operaciones.md`)
no se repite: abajo solo se confirma o se descarta.

**Qué se revisó.**
- La teoría `contenido/teoria/aritmetica/cuatro-operaciones.js` (v0.4.0, `calidad: 2`, `septimaIdea`):
  - las 7 ideas con sus 7 momentos;
  - los 105 ejemplos;
  - «Ahora tú» y «Así se resuelve» (semillas 0–39 y 0–11);
  - el glosario (24 términos), las 3 mesas y la historia.
- Las piezas `arit-puesto` y `arit-calculadora`, con sus pruebas.
- La práctica:
  - `plantillas/operaciones-cifras/`: 32 tipos, `papel.json` y `casos.json`;
  - la escena vieja `plantillas/cuatro-operaciones/` (`"rehacer": true`), con su papel.
- La mudanza `mudadoSum` de `nucleo/avance.js`, con su prueba y el lado de `sucesiones-y-series.js`.
- Los pares ari-17 y ari-30 de `catalogo/pruebas/aritmetica.json`.
- La app a 390 px con `--entera`: los 49 momentos, los 105 ejemplos, el glosario y el laboratorio. Servidor propio en
  el puerto 4211, ya apagado. Las capturas están en `scratchpad/aud-ari/cap/`.

**Cuentas.** Se rehicieron con un script propio (`scratchpad/aud-ari/cuentas.js`). Tiene sus propias funciones de base,
complemento, reverso, fuerza bruta de manchas y extremos con BigInt. De la unidad solo lee el texto.
- **Resultado: 426 de 426 cuadran.**
  - Los 35 ejemplos de nivel 3: la letra marcada señala lo que da la cuenta.
  - Las 7 predicciones y las 7 misiones. La misión de la idea 6 es única con d de 3 a 9.
  - 280 casos de «Ahora tú» (semillas 0–39 de cada idea).
  - 96 problemas del generador: 3 semillas por cada uno de los 32 tipos.
  - Aparte, a mano: los 70 ejemplos de niveles 1 y 2, las semillas 0–2 de «Así se resuelve» y los 8 del papel.
- **Lo que las cuentas no ven**, y sí vio el script:
  - un ejemplo con más de una respuesta si se aceptan ceros a la izquierda (M1);
  - un dato de «Ahora tú» que lleva a la opción incorrecta (A1).

Pruebas: `node --test` de la unidad, las dos piezas, el generador y el avance dan 69 de 69; `teoria.test.js`, 160 de 160.

**El lector en frío, comprobado en el código.**
- **Es real** (no se repite en la tabla salvo que haga falta otra corrección):
  - la condición de la idea 4, «si a − c = 1 es 99; si no, suman 18» (`:1832`): 099 también suma 18;
  - «0 < r < d» en la regla (`:2563`) contra «0 ≤ r < d» en los datos;
  - el dibujo de la regla de la idea 6: las bolsas dibujadas llevan 5 y la incompleta se llena con 7;
  - «la suma de cifras» en la regla de la idea 7;
  - «cada 10» antes de «en base n» en la regla de la idea 1;
  - el atajo del complemento mal dicho («de 9 cada cifra»);
  - la «n» sin definir en los datos (`DO.columna`, `:132`, en unos 60 ejemplos y en todos los «Ahora tú» de columnas);
  - F, G, H y s sin definir en los datos de la idea 5;
  - los ejemplos 17 («Restos iguales», `:2410`) y 21, que repiten el 20;
  - las letras de las trampas en violeta: medido, son **96 de 96** letras de las soluciones (A3).
- **No se reproduce:** «la misión de 47 tiene dos respuestas». Con d de 3 a 9 solo sirve d = 5; la de 10 no está en el
  control.

## Hallazgos

### Alta (el alumno no puede resolver o aprende algo falso)

| # | Punto | Dónde | Evidencia | Corrección propuesta |
|---|---|---|---|---|
| A1 | 13, 10 | Idea 6, «Ahora tú», tipo «dos repartos» (`casoDosRepartos`, `:2331`, datos en `:2336`); 80 de 400 semillas | La pregunta es «da 3 a cada sobrino, le sobran 4; si les da 6, le faltan 11. ¿Cuántos sobrinos son?». El dato que trae es `d × q + r = d × (q + 1) − rₑ`, que solo vale si cada uno recibe **uno** más. Aquí siempre es 2 o 3 más (`e = r.ent(2, 3)`). Quien usa el dato saca d = r + rₑ = 15, y 15 es justo la trampa AT-REPARTO-SIN-DIVIDIR. Pasa en las 80 semillas de ese tipo. El generador sí da la fórmula buena. | Usar los datos del generador: «al dar q₁ a cada uno sobran r: D = d × q₁ + r; al dar q₂ faltan f: D = d × q₂ − f». |

### Media (el alumno se traba o duda)

| # | Punto | Dónde | Evidencia | Corrección propuesta |
|---|---|---|---|---|
| M1 | 13, 10 | Ejemplo «Una resta con tres manchas» (`:1691`, captura `ej-cifras-ocultas-11`) | El dato dice «Bajo cada mancha hay una cifra de 0 a 9». Si la primera mancha del resultado puede ser 0, `7☐8 − 6☐9 = ☐89` tiene 10 soluciones con sumas distintas (por ejemplo, 708 − 619 = 089), y la D («No se puede saber») sería la correcta. El resuelto dice «Si no presta otra vez…» y no descarta el otro caso. El generador sí trae «la primera cifra de un numeral no es 0» (`ca-oculto`). | Agregar ese dato a todo ejercicio con manchas de la teoría, y una línea en el resuelto que descarte el segundo préstamo. |
| M2 | 9; decisiones | Ejemplo «Consecutivas que suman» (`:1735`) | Pide a̅b̅c̅ + c̅b̅a̅ = 1 332. La propuesta §1 y la pregunta 5 aprobada dejan la suma con el reverso en Razonamiento numérico. La regla de la idea 4 solo dice a̅b̅c̅ − c̅b̅a̅, y el resuelto usa 101 × (a + c) + 20 × b, que no está en ninguna parte. | Cambiarlo por una resta con el reverso, por ejemplo cifras consecutivas y c̅b̅a̅ − a̅b̅c̅ con manchas. |
| M3 | 13, 10 | Ejemplo «Dos repartos» (`:2435`) | El dato es «D = d × q + r, con 0 ≤ r < d», pero el problema tiene 6 nietos y le sobran 7, o sea r ≥ d. El dato contradice la situación, y no es la herramienta que usa el resuelto. | Datos como en A1. O cambiar los números para que sobren menos que los nietos. |
| M4 | 3, 9 | Idea 6: `DD` de los datos, «Ahora tú» («el cociente por defecto es 22») y ejemplos 81, 82 y 90 | q, r y rₑ nunca se dicen en palabras en los datos de la teoría. «Cociente por defecto» y «cociente por exceso» no se definen. «Cociente entero» se estrena recién en la idea 7 (`Glosario.porIdea`). El generador sí lo dice: «D: los caramelos; d: lo que lleva una bolsita; q: bolsitas llenas…». | Copiar esa línea del generador a los datos de la idea 6. Estrenar «cociente por defecto / por exceso» en la idea 6. |
| M5 | Regla 3; 4f | Glosario, que se abre desde «Palabras de esta idea» antes de jugar (`:2987`, `:2990`, `:2999`, `:3016`, `:3035`) | Los ejemplos del glosario resuelven lo que la predicción guarda: «En 100 − 1 prestan dos columnas: da 99» y «En 700 − 1 = 699» (idea 2, que tiene a propósito un juego sin ceros); «En base 4, 3 + 2 = 5 = 1 × 4 + 1» (idea 1, que guarda la otra base); «Si uno sube 2 y el otro es 9, el producto sube 18» (idea 5); «Con divisor 9 y resto por defecto 4, es 5» (idea 6). Es el mismo defecto que el M1 de Numeración. | Ejemplos de glosario que nombren sin resolver la situación de la predicción: el préstamo sin ceros, la llevada en base 10. |
| M6 | 13 (el paso hecho) | Predice de la idea 3 (`:1384`); ejemplo «Base 5 con un cero» (`:1298`) | Los datos «4 073 tiene 4 cifras · 10⁴ = 10 000» le dicen al alumno cuál es la meta. La trampa AT-CA-K (95 927) queda sin efecto, y «la meta primero» era el paso que se practicaba. Lo mismo pasa con «En base 5: 5⁴ = 625». | Dar varias potencias (10³, 10⁴, 10⁵) y dejar que el alumno elija. |
| M7 | 5, §5b | El helper `letra` (`:91`, con `m = 'busca'` por defecto); las 35 soluciones de nivel 3 | Las 96 letras de trampa son violetas, con el resaltado del violeta: se ven como la respuesta. El encargo dice «letras de alternativa sin violeta». El generador ya cumple: «Ninguna letra de alternativa lleva color». | Las letras de las trampas en negrita y en tinta. Solo la respuesta lleva el color de su magnitud. |
| M8 | 9; molde §7 | `app/practica.js:138` y `:168` (`gen.generar(…, { unidad })`) | Sigue abierto el M11 de Numeración: el generador tiene `TIPOS_POR_IDEA`, pero la app no le pasa la idea. Quien termina la idea 1 recibe, 6 de cada 7 veces, problemas de ideas que todavía no vio (cifras de un cociente, dos repartos). | Pasar `{ idea }` desde la práctica. Es un arreglo de la app que ya está pendiente. |
| M9 | 13; decisiones | Escena vieja en «Más mesas del tema»: su «✎ Lápiz y papel» (`plantillas/cuatro-operaciones/papel.json`) | Tiene 10 problemas sin datos:<br>• p6 y p7 son sumatorias, que se mudaron;<br>• p9 es la criptoaritmética XY + YX, que es de Razonamiento numérico;<br>• p10 escribe «243₍₅₎ · 4» (la decisión dice ×, nunca «·»);<br>• dice «residuo».<br>Además, la escena sigue enseñando la escalera de las sumatorias. | En una escena con `rehacer`, no mostrar su papel. O quitar p6, p7 y p9 y agregar datos. |
| M10 | Decisiones | `catalogo/pruebas/aritmetica.json`: pares y `nota` | La decisión dice «ari-17 y ari-18 a la prueba». Entraron ari-17 y ari-30, nuevo. ari-18, el resto por exceso (la trampa 18, que está en 3 preguntas de San Marcos y que piden Divisibilidad y MCD), quedó en la reserva. Para hacer lugar se sacó fr-02, de MCD y MCM, que es de otra unidad. Las cuentas de ari-17 y ari-30 cuadran: sus dos formas son paralelas y tienen solución única. | Consultar a Gerson o cumplir la decisión: ari-18 en lugar de ari-30, o los dos en lugar de otro par de esta unidad. |

### Baja (estilo)

| # | Punto | Dónde | Evidencia | Corrección |
|---|---|---|---|---|
| B1 | 3 (letras) | Ejemplo «La diferencia suma 18» (`:1713`); «Ahora tú» y ejemplo de la idea 7 («Si B tiene q cifras», `:2674`, `:2768`); datos del generador («10ᵃ ÷ 10ᵇ»); mesa `dos-productos` (`:3089`: a, b y k) | En la tabla de letras, n es la base, p el préstamo, q el cociente, a y b cifras ocultas y k las cifras de N. Aquí, en cambio: m̅n̅p̅ son cifras, q son las cifras de B, a y b son exponentes, y la mesa usa a y b como factores y k como lo que sube (la propuesta §6 lo prohibía). | x̅y̅z̅; «B tiene k cifras»; 10ˣ ÷ 10ʸ; la mesa en palabras. |
| B2 | 13 | Datos de la idea 7 de tipo potencias (`:2654`) | La pregunta es A² × B³, pero el dato define A² y A³, no B³. | «A² = A × A; B³ = B × B × B», como el generador. |
| B3 | Regla 3 / escala | Distractores AT-DECIMAL del generador: «89₍₄₎», «879₍₆₎», «768₍₄₎», «799₍₄₎» | Son numerales que no se pueden escribir en esa base: se descartan sin pensar. | Si da cifras inválidas, otra trampa. |
| B4 | Redacción | «Ahora tú», idea 6, exceso (`:2291`) | «le sobran 1»; siFuera «ya tiene 1 sueltos». | Concordar el número (el generador ya usa `sobran(k)`). |
| B5 | Niveles | Ejemplos de la idea 7: 97 = 91 y 95, y 104 = 98, con otros números; «Estimar no es adivinar» (`:2745`), de nivel 2 y de un paso | Confirma lo que vio el lector. | Un nivel 2 con cociente y producto mezclados; un nivel 3 con cifras desconocidas. |
| B6 | 9 | Glosario, `sumandos` (`:2981`, `ver: ['sumatoria']`) | Remite a un término que ahora se estrena en Sucesiones, una unidad posterior. | Quitar «sumatoria» de `ver`. |
| B7 | 12 | Glosario de la idea 6 | «resto por defecto», «división exacta» y «cociente entero» no traen `simple`. «Resto por defecto» es la mitad de la idea. | `simple` para los tres. |
| B8 | 13 | Datos de la teoría frente al generador | El generador dice que r + rₑ = d es un atajo y no lo da. La teoría lo da como dato en «Ahora tú» (tipo «el doble del resto») y en los ejemplos 79, 83, 88 y 90, y con eso el ejercicio queda en un paso. | Decidir una sola política. Recomiendo la del generador: las dos fórmulas, y que r + rₑ = d salga de restarlas. |
| B9 | Avance | `mudadoSum` (`nucleo/avance.js:114`) | Quien terminó las 6 ideas viejas queda con 5 de 7: pierde «La estudié», y Divisibilidad, Combinatoria, Razonamiento numérico y Polinomios, si no los había abierto, se le cierran. Lo ya empezado no se cierra. | Aceptarlo con una nota en `docs/recorrido.md`, o contar como estudiada una unidad que lo estaba antes de la mudanza. |
| B10 | Estilo | El generador repite problemas («los-dos», semillas 2 y 18, idénticas) y el papel p4 escribe «0 + 10 − 1 = 9», donde el − 1 es el sustraendo y en la línea siguiente es el préstamo | Sin colores, en papel no se distinguen. | Evitar duplicados por semilla; en el papel, «− 1 que prestó». |

## Lo que está bien y hay que copiar al molde

- **Datos con la base puesta** en el generador: «Suma de una columna = llevada × 7 + cifra que se anota». Con eso
  desaparece la «n sin definir» que el lector encontró en la teoría.
- **Datos con leyenda de letras** en el generador: «D: los caramelos; d: lo que lleva una bolsita; q: bolsitas llenas;
  r: sobran; rₑ: faltan» y «Aquí d son los nietos y q lo que recibe cada uno».
  - Es la solución a M4 y a la confusión del lector con los sobrinos.
  - Regla posible: toda letra de un dato se dice en el mismo recuadro.
- **«La primera cifra de un numeral no es 0»** como dato en todo ejercicio de cifras ocultas (ca-oculto).
- **Ninguna letra de alternativa lleva color** (cabecera del generador).
- **La prueba propia de la unidad** (`cuatro-operaciones.test.js`):
  - recalcula «Ahora tú» con código aparte en 400 semillas;
  - comprueba que la figura de un ejemplo no muestra el número pedido;
  - comprueba que cada ficha de color declara su magnitud (`m`) y coincide con `def.colores`.
  - Las tres valen para el molde.
- **Tres pares con el mismo color en las siete ideas** (envase, lo que se muda, lo que se busca), sin verde ni carmín, y
  la regla «el resultado es violeta también cuando se da». Funcionó en las 49 capturas.
- **Misiones únicas dentro del rango de los controles** y juegos que no llegan a la predicción: juego en base 10 sin
  ceros, frente a una predicción en base 5 con ceros.
- **Una mudanza con `renombrar`, `sinPrediccion` y `reiniciaPrediccion`**, con su prueba. Es el modelo para mover una
  idea a una unidad que ya existe.
- **El dato «Minuendo − sustraendo = diferencia»** en el tipo «suma-tres» del generador, en vez de «minuendo =
  sustraendo + diferencia», que regala el paso (ejemplo 29 de la teoría).

## Reglas que faltan en el contrato o el validador

| Regla | ¿Automática? |
|---|---|
| **El dato tiene que servir para el caso que se pregunta.** Si el ejercicio no cumple la condición de una fórmula de sus datos (uno más por persona, r < d), el dato está mal (A1, M3). | Parcial: el generador puede declarar las condiciones (`e === 1`, `r < d`) y la prueba comprueba que se cumplen en 400 semillas. |
| **Las manchas tienen solución única también con ceros a la izquierda**, o el ejercicio trae el dato «la primera cifra no es 0». | Sí: fuerza bruta con y sin ceros, como `cuentas.js`, sección E. |
| **Ningún ejemplo del glosario de una idea resuelve la situación que guarda su predicción.** Ampliar la prueba, que hoy solo compara números, a la marca de la trampa, por ejemplo: un 0 que presta, una base distinta de 10, la llevada de 2. | Parcial: cada predicción declara sus «marcas reservadas» (`/0\d*\s*−/`, `₍[2-9]₎`) y el validador las busca en el glosario y en «Lee» de la idea. |
| **Las letras de trampa en tinta.** El validador rechaza una letra A–D con color fuera de `respuesta`. | Sí. |
| **Los datos no deben fijar el exponente ni la meta** cuando el ejercicio practica elegirlos (M6). | Parcial: marcar `practica: 'meta'` en la predicción y rechazar datos con un solo 10ᵏ. |
| **Toda letra de una línea de `datos` lleva su significado en el mismo recuadro.** | Sí: letras sueltas de los datos frente a una lista de definiciones o frente a la leyenda. |
| **La práctica respeta la idea** (M8): una prueba de la app que llame a `generar` con `{ idea }`. | Sí. |
| **Una escena con `rehacer` no muestra su papel sin datos.** | Sí: en `construir-catalogo`, `rehacer && papel sin datos` es un error. |

## Correcciones (18 nov)

Fase 8 del método (`docs/metodo/unidad/6-correcciones.md`), con las notas de la sesión. La teoría pasa a v0.4.1. Las
respuestas que cambiaron se recalcularon con un script propio, que no usa la unidad
(`/tmp/claude-0/-home-user/31d0ae9f-8026-5866-a5dc-2c8554ea89bf/scratchpad/cuentas-cor.py`): cuadran todas. Las pruebas nuevas van en `cuatro-operaciones.test.js`,
`nucleo/avance.test.js` y `plantillas/cuatro-operaciones/motor.test.js`. Pruebas: 459 de 459 en la lista del encargo,
más `herramientas/papel-generador.test.js` y `papel-opciones.test.js`. No se corrió `npm test` completo, porque otras
sesiones estaban trabajando en física y geometría. Capturas: `scratchpad/cor-ari/antes/` y `scratchpad/cor-ari/`.

### Hallazgos del auditor

| # | Qué se hizo |
|---|---|
| A1 | Se cambiaron los datos de `casoDosRepartos` por los del generador: «Si al dar q₁ a cada uno sobran r: D = d × q₁ + r» y «Si al dar q₂ a cada uno faltan f: D = d × q₂ − f». Se agregó una línea con las letras: «D: los caramelos; d: los sobrinos; q₁ y q₂: lo que recibe cada uno». Una prueba nueva, en 400 semillas, comprueba que los datos no traen q + 1 ni r < d. Las respuestas no cambian. |
| M1 | Se agregó el dato `DR.primera`, «La primera cifra de un numeral no es 0», a toda cuenta manchada: ejemplos, «Ahora tú», «Así se resuelve» y la predicción de la idea 4. El resuelto de «Una resta con tres manchas» ahora descarta el segundo préstamo (7 − 1 − 6 = 0). Una prueba comprueba que el dato está siempre y que hace falta: sin él, la cuenta tiene 10 soluciones. |
| M2 | Se cambió «Consecutivas que suman» por «El reverso con manchas»: 5☐2 − 2☐5 = ☐97. Usa números y el reverso en una resta. La respuesta es 2: hay 10 soluciones por fuerza bruta y en todas la cifra del resultado es 2. Las trampas son 3 (no descuenta), 1 (descuenta dos veces) y «No se puede saber». |
| M3 | Los ejemplos «Dos repartos» y «Uno más y faltan», y el tipo `uno-mas` de «Ahora tú», usan los datos de A1. |
| M4 | Se agregó la línea `DR.letrasDiv` («D: los caramelos; d: lo que lleva una bolsita; q: bolsitas llenas; r: sobran; rₑ: faltan») a todo ejercicio de la idea 6. La tarjeta 2 de Lee dice q, r, q + 1 y rₑ con sus nombres. «Cociente entero» tiene ahora la forma «cociente por defecto» y se estrena en la idea 6. |
| M5 | Se cambiaron los ejemplos del glosario que resolvían una predicción: préstamo, minuendo, llevada, sumandos, complemento aritmético, factor y resto por exceso. Ninguno nuevo usa un 0 que presta, otra base, una meta de 10 000, una subida de un producto ni r + rₑ. |
| M6 | La predicción de la idea 3 da tres potencias: 10³, 10⁴ y 10⁵, sin «4 073 tiene 4 cifras». El ejemplo «Base 5 con un cero» da 5³, 5⁴ y 5⁵. |
| M7 | `letra` usa ahora `{ negrita }` de `nucleo/ecuacion.js`, como Estructura atómica: todas las letras van en tinta, también la de la respuesta, y solo el valor lleva color. Una prueba nueva lo comprueba en 155 letras. |
| M8 | No se tocó, por la nota de la sesión: es de `app/`. Falta pasar `{ idea }` a `gen.generar` en `app/practica.js:138` y `:168`. |
| M9 | En `plantillas/cuatro-operaciones/papel.json`, p6 y p7 (sumatorias) y p9 (XY + YX) se cambiaron por tres problemas nuevos verificados con el motor:<br>• p6, cifras de A × B con 4 y 3 cifras: 6 o 7;<br>• p7, el mayor a̅b̅c̅ con a̅b̅c̅ − c̅b̅a̅ = 594: 993;<br>• p9, la división entre 12 con rₑ = 2r y q = 7: 88.<br>Además:<br>• los 10 problemas llevan «Datos:» al final, también en sus `preguntas`;<br>• «·» pasa a ×, «residuo» a «resto», y la `indicacion` ya no define el CA;<br>• `motor.test.js` exige los datos y que no vuelvan «·», «residuo», sumatorias ni letras.<br>No hizo falta filtrar el papel por unidad. |
| M10 | No se tocó, por la nota de la sesión: lo decidió la sesión. |
| B1 | Se cambiaron las letras que chocaban con la tabla de letras:<br>• m̅n̅p̅ pasa a x̅y̅z̅ en «La diferencia suma 18»;<br>• «B tiene q cifras» pasa a «k cifras», en «Ahora tú» y en el ejemplo;<br>• el generador escribe 10ˣ ÷ 10ʸ;<br>• la mesa `dos-productos` se dice en palabras (consigna, etiquetas y retos). Los id de sus controles no cambian. |
| B2 | Los datos de `casoCifrasPot` definen las dos potencias que se preguntan, por ejemplo A² y B³. |
| B3 | Si la trampa de la base 10 da cifras que la base no tiene, se cambia por otra:<br>• en el generador (`enLaBase`): `suma-base` y `por-cifra-base` usan AT-LLEVA-DOBLE, `resta-base` usa AT-DOBLE-DESCUENTO y `ca-base` usa AT-CA-DIEZ. En 3000 semillas no queda ningún numeral inválido;<br>• en la teoría, `casoTres` usa la trampa del motor, que ya está validada, o AT-LLEVA-OLVIDA;<br>• en el ejemplo «Tres sumandos en base 6», 754₍₆₎ pasa a 1022₍₆₎ (sin sumar las llevadas que llegan, recalculado aparte). |
| B4 | Se concordó el número en «sobra/sobran», «falta/faltan», «faltaría/faltarían» y «suelto/sueltos», en las ideas 6 de «Ahora tú». |
| B5 | «Seis por tres cifras» pasa a «Producto y cociente a la vez», de nivel 2: 5 o 6 y 2 o 3. «Un cociente grande» pasa a «Cifras que no se ven», de nivel 3: 1☐☐☐ × 1☐☐ tiene siempre 6 cifras. «Estimar no es adivinar» se queda. |
| B6 | Se quitó «sumatoria» del `ver` de «sumandos». |
| B7 | Ahora tiene `simple` «resto por defecto». Una idea lleva como mucho 4 palabras con `simple`, así que «múltiplo» lo perdió: sigue estrenándose aquí, con su definición y sus ejemplos. «División exacta» y «cociente entero» siguen sin `simple` por el mismo tope. |
| B8 | Se usa la política del generador. r + rₑ = d sale de los datos en «Ahora tú» (`casoRestosRelacion`), en «Así se resuelve» y en los ejemplos «Los dos restos», «Restos iguales», «El exceso es el doble» y «Restos que suman». El resuelto iguala las dos formas de D. |
| B9 | Se arregló en `nucleo/avance.js` con `conservaEstudio`. La partición `mudadoSum` trae `estudiada`, con su propia marca, `estudiadaSum`. Quien había terminado las 6 ideas viejas queda con «Ya la estudié» en `est.marcadas`, con la fecha de su visita o la del 18 nov. Así conserva el nivel 1, y Divisibilidad, Combinatoria, Razonamiento numérico y Polinomios no se le cierran. La visita se queda, y prestamo y cifras-ocultas quedan por hacer. Como `mudadoSum` ya había corrido en `main`, también recupera a quien ya había migrado: busca la sumatoria en Sucesiones, como `suma-rectangulo`. La prueba cubre cuatro casos: el que no había migrado, el que ya migró, el que no la tenía completa y el que ya la había marcado. No hizo falta tocar `app/`. |
| B10 | En el papel, «− 1 que prestó» ahora se distingue de la cifra del sustraendo: `lineasResta` del generador, que se regeneró con `papel-generador.js`. Las semillas repetidas de `los-dos` no se tocaron: hacerlo cambia los `casos.json` del generador. |

### Lo que marcó el lector en frío (veredicto, momentos y ejemplos)

| Dónde | Qué se hizo |
|---|---|
| Idea 1 | Una tarjeta de Lee nueva, «Otros puestos, otras bases», presenta 21₍₅₎ con su dibujo, sin decir qué pasa al sumar. La regla empieza por «en base n, cada n (en base 10, cada 10)». |
| Idea 2 | La ecuación de la regla dice «la columna que prestó queda en arriba − 1». Los datos dicen qué es «envase»: «bolsita, caja o cajón». |
| Idea 3 | La condición del atajo dice «cada cifra se resta de 9, y la última que no es 0, de 10». El «complemento aritmético» ya se presentaba en la tarjeta 2 de Lee. |
| Idea 4 | La condición de la regla ahora es cierta para todo k (nota e de la sesión): «La diferencia es 099, 198, 297… hasta 891: 9 en medio y extremos que suman 9». Se comprobó para k de 1 a 9. El ejemplo 11 («Un número menos su reverso») explica el doble préstamo y de dónde sale 99 × 5, con la descomposición. |
| Idea 5 | La voz de Juega ya no nombra una «fila violeta» que no está al empezar. La leyenda dice «lo que pasa de 24 en cada bolsa». La regla trae su propio dibujo, las 7 bolsas con 3 más, y su condición dice qué pasa si sube G: s × G + F × t + s × t. |
| Idea 6 | El último paso de Mira, y con él la regla, pasa a «39 en bolsitas de 7»: el divisor ya no cambia de objeto en el dibujo. La regla dice «0 ≤ r < d», igual que los datos. La misión de 47 tiene una sola respuesta, como dijo el auditor: no hubo que cambiarla. |
| Idea 7 | La regla dice «cifras de A + cifras de B», no «la suma de cifras». |
| Juegos | Las misiones de las ideas 1, 2, 3, 5, 6 y 7 empiezan por «Pon…» o «Lleva…»: dicen que hay que llevar los controles al caso. |
| Datos | La n va escrita en `DO.columna(n)`, `DO.producto(n)` y `DR.resta(n)`. F, G, H, s y t van con su línea de letras, y q, r y rₑ con `DR.letrasDiv`. |
| Ejemplos | Se corrigieron los peores que marcó el lector:<br>• 17, «Restos iguales»: ahora dice qué se empaca y qué son los dos restos;<br>• 06: la línea cortada se partió en tres, y el dato pasa a «minuendo − sustraendo = diferencia» (ya no regala el paso);<br>• 21: se cambió por otro (B5);<br>• 11: se explicó (ver idea 4). |

### Pendiente

- **M8** (`{ idea }` en la práctica) y **M10**: los lleva la sesión.
- **Fuera de alcance**, de `app/`:
  - «Prueba 3 casos…: llevas 1» se confunde con la llevada. Es un texto común de `app/teoria.js`.
  - Los iconos de la bolsita, que parece una botella, y las 5 cajitas sobre el cajón son dibujos de prueba de `arit-puesto`: los decide Gerson.
- **La escena vieja**: `plantillas/cuatro-operaciones/index.html` sigue enseñando la escalera de las sumatorias y la criptoaritmética. Solo se arregló su papel. La escena espera rehacerse (`"rehacer": true`).
- **Que se quedó igual a propósito**:
  - La predicción de la idea 7 es de un cociente, aunque la idea se titule con el producto: el título está fijado en la prueba y aprobado.
  - Los «1000» sin espacio en los dibujos del cuaderno.
  - «Estimar no es adivinar» sigue en nivel 2 con un paso.
  - Las semillas repetidas del generador (B10).
- **Reglas que faltan en el contrato**: no se agregaron al validador común (`nucleo/teoria.js`). Las de esta unidad quedan en sus pruebas:
  - las letras en tinta;
  - el dato de la primera cifra;
  - los datos de los repartos.
