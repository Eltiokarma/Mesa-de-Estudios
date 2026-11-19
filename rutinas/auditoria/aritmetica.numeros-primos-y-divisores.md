# Auditoría de contenido: «Números primos y divisores» (aritmetica.numeros-primos-y-divisores)

19 nov 2026. Auditor externo del cierre delegado (`docs/metodo/unidad/cierre-delegado.md`), que no escribió la unidad.
Contrato: `docs/plan-calidad.md` §3 y §5. Formato: `docs/teoria.md`. Vara: `docs/molde-unidad.md` §10. Reglas
automáticas: `docs/metodo/unidad/reglas-validador.md`. Guion: `docs/etapa6/propuesta-aritmetica.md` (decisiones §11 y
§12). Lo que vieron los dos lectores en frío está en `rutinas/frio/aritmetica.numeros-primos-y-divisores.md`; aquí se cita
solo cuando el código lo confirma o lo agrava.

**Qué se revisó.**
- La teoría `contenido/teoria/aritmetica/numeros-primos-y-divisores.js` (v0.3.0, sin `calidad: 2`):
  - las 6 ideas con sus 7 momentos;
  - los 90 ejemplos;
  - «Ahora tú» y «Así se resuelve» (400 semillas de cada uno por idea);
  - el glosario (16 términos), las 4 mesas y la historia.
- Las piezas `arit-bandejas`, `arit-arbol` y el bloque `criba` de `arit-boletos` (con sus pruebas), y lo que la unidad
  usa de `arit-tabla` y `arit-puesto`.
- La práctica `plantillas/primos-divisores/`: 25 tipos en las 6 ideas, `casos.json` (25) y `papel.json` (8).
- La app a 390 px con `--entera`: los 42 momentos y los 90 ejemplos. Servidor propio en el puerto 4411.

**Cuentas.** Se rehicieron con un script propio
(`/tmp/claude-0/-home-user/31d0ae9f-8026-5866-a5dc-2c8554ea89bf/scratchpad/e6-cierre-pri/cuentas.js`). De la unidad y
del generador solo lee el texto. Cada respuesta y cada valor de distractor sale del enunciado por fuerza bruta: divisores
contados uno por uno, CD y SD sumando la lista, φ contando los PESI del 1 al N, la criba probando todos los divisores, y
Fermat y Wilson con BigInt (la potencia y el producto enteros).
- **Resultado: 40 769 comprobaciones; además, 27 241 igualdades y desigualdades evaluadas con racionales exactos.**
  - «Ahora tú»: 2 400 casos (400 semillas por idea), con la correcta, una sola correcta en las de «¿cuál…?», cuatro
    opciones distintas y el valor de cada distractor rehecho con su error.
  - «Así se resuelve»: 2 400 casos, con la respuesta y todas las cuentas de los pasos.
  - Los 90 ejemplos, con la letra del nivel 3 en la alternativa que da la cuenta.
  - Las 6 predicciones con cada distractor rehecho (3, 1 y 4; 5, 11 y 47; los tres pares; 15, 8 y 10; 30, 50 y 25; 2
    y 100).
  - Las 6 misiones en toda su grilla: cada una se cumple con un solo caso y no al abrir. Las lecturas de los seis juegos
    en toda su grilla.
  - La práctica: 2 400 problemas (400 por idea), con la respuesta y el valor de cada error por su código; los 25 de
    `casos.json` y los 8 del papel.
  - Frases que afirman un hecho, en todo texto: «N deja r entre p», «N es primo / no es primo», «N tiene k divisores»,
    «p × p = … (no) pasa de N», «comparten el p», «… todavía es par».
- **Lo que la respuesta no ve, y sí vio el script:**
  - un `siFuera` que es falso en 87 de 100 casos de su tipo en la teoría y en 64 de 100 en la práctica (A1);
  - ciclos de restos de 10 y de 20 en 12 de los 39 casos de «Fermat no vale» con un divisor compuesto (M1).
- Las respuestas, las igualdades y los demás valores de distractor cuadran todos.

Validador con `calidad: 2` simulada (`Teoria.problemas` con 200 semillas): **0 problemas, 0 pendientes** antes y después
de las correcciones. Ninguna de las faltas de abajo la ve una regla de hoy. `herramientas/ecuaciones-ancho.js`: «todo
cabe», aunque cuatro fórmulas se partían dentro de un paréntesis (M3): la herramienta mide desbordes, no cortes.
Pruebas propias antes de corregir: unidad 13 de 13, generador 36 de 36, piezas en verde.

## Hallazgos

### Alta (el alumno no puede resolver o aprende algo falso)

| # | Punto | Dónde | Evidencia | Corrección propuesta |
|---|---|---|---|---|
| A1 | 10, 13 | Idea 3, «Ahora tú» tipo 0 (`casoCanon`, opción `sinexp`) y práctica `canonica` (AT-FACT-EXPONENTE) | El `siFuera` dice «Pero cada uno entra más de una vez: 2 × 3 × 11 no da 264». En 264 = 2³ × 3 × 11, el 3 y el 11 entran una sola vez. Es falso en 87 de 100 casos del tipo en la teoría y en 64 de 100 en la práctica. | Nombrar solo los primos que se repiten: «el 2 entra más de una vez». |
| A2 | 9, 12 | Idea 1, La regla (`:443`) y Lee 3 | La regla termina en «Cada forma da dos divisores»: en un cuadrado no es así (6 × 6 da solo el 6), y «Ahora tú» tipo 3, la mesa y dos ejemplos piden cuadrados. Lee 3 define primo como «un número que solo se acomoda en una fila»: el 1 también cumple, y la predicción marca mal a quien lo cuenta (lector A, la regla). | «Cada forma da dos divisores; la del cuadrado (6 × 6), uno solo»; Lee con «exactamente dos divisores». |

### Media (el alumno se traba o duda)

| # | Punto | Dónde | Evidencia | Corrección propuesta |
|---|---|---|---|---|
| M1 | Decisión 15 de Divisibilidad | Idea 6, «Ahora tú» tipo 1 (`casoNoVale`, rama del divisor compuesto) y práctica `no-vale` | Con 25 los ciclos de 2, 4 y 8 miden 20, 10 y 20. La solución muestra 6 restos con «…» y salta al resultado. Pasa en 12 de 39 casos. Es el M1 de Divisibilidad. | Divisor compuesto entre 9, 15 y 21: ciclos de 2 a 6, que la solución muestra enteros. |
| M2 | 3; auditoría de Divisibilidad, M4 | Idea 6: Datos de los ejemplos «Wilson con 13», «Una base mayor que la bolsita», «Fermat no vale con 15» y «El día de la semana», y de «Ahora tú» tipos 0 a 2 | Los resueltos escriben p̊ y los Datos no lo glosan (lector B, tarjeta 17). «Así se resuelve» trae la glosa sin usar el circulito. | Una línea «p̊ (p con un circulito): un múltiplo de p» en los Datos de todo ejercicio que lo use, puesta sola al armar la idea (`conMu`). |
| M3 | 8 | La regla de las ideas 4 y 5; ejemplos y «Ahora tú» de φ con tres primos | A 390 px la línea se parte entre la fracción apilada y su paréntesis («84 × (1 − ½) × (1 − ⅓) × (1 − 1/7» y «) = 24») y la suma de divisores entre «)(» (lector B). `ecuaciones-ancho.js` no lo ve: nada se sale de la caja. | φ con tres primos en dos renglones (los dos primeros, después el tercero); en las reglas, fracciones en línea, «×» entre los paréntesis y espacios que no se parten. |
| M4 | 13; niveles | Ejemplos «Wilson con 5» (n.º 3) y «Wilson con 13» (n.º 8) de la idea 6; «Fracciones de denominador 18» (n.º 14) de la idea 5 | Los Datos traen Wilson y la pregunta es aplicarlo: la respuesta queda a una resta (lector B, tarjetas 16 y 17). El nivel 2 de Wilson repite el nivel 1 con otro número, y el nivel 3 de fracciones repite el nivel 2 (12 → 18, dos primos). | Nivel 1: la cuenta sin Wilson en los Datos, que lo nombra al final; nivel 2: Wilson más uno, con la suma; nivel 3: denominador 90, que hay que factorizar, con tres primos. |
| M5 | 10 | Ejemplo «Dos formas, una de 3 filas» (idea 1) | «Si lo de cada fila no fuera primo, habría una tercera forma»: 27 = 3 × 9 tiene solo dos formas. La respuesta (93) está bien, el argumento no. | Probar los múltiplos de 3 de dos cifras desde el mayor. |
| M6 | 2, 4f; regla 3 | Idea 6: Juega, Predice y Mira | La tabla del juego resalta el día p − 1: con la base 2 marca el «1» del día 6 como si fuera la meta, y la misión pide «recién el día 6» (lector B). La figura de Predice es esa misma tabla, con ese resalte. La voz de Mira y dos `siFuera` de Predice dicen «p − 1» antes de que alguien diga qué es p. | Resaltar el primer día en que los sueltos vuelven a 1; Predice y Mira sin la letra p; Lee 3 dice que la bolsita prima se llama p. |
| M7 | 3, 12 | Reglas de las ideas 3, 4, 5 y 6 | Idea 3: α y β sin decir qué son ni cómo se leen. Idea 4: p y q sin decir que son primos, y «12³ no es 2³». Idea 5: «Si p es primo, solo p no es PESI con p», sin «del 1 al p». Idea 6: Wilson y «(p − 1)!» en la regla sin presentarse, y el circulito sin glosa (lectores A y B). | Cada letra en palabras en su regla; «12³ = 2⁶ × 3³»; Wilson presentado en el paso 5 de Mira, y «p̊: un múltiplo de p» en la condición. |
| M8 | 3 | Idea 5: Lee 1 y Datos de todos sus ejercicios | «PESI» no se dice en palabras en la idea 5: la tarjeta 13 del lector («Los PESI con 9») no lo trae en los Datos. | `D5.def` con «es decir, no comparten ningún primo con N»; Lee 1 de la idea 5 con «(«primo entre sí»)». |
| M9 | Regla 8 | Idea 4, ejemplo 1 «Divisores de 2⁴ × 3» | Es la respuesta de la misión del juego (48 = 2⁴ × 3, 10 divisores), en la pestaña «Ejemplos», que se abre antes de jugar. | 2⁴ × 7: la misma cuenta, otro caso. |
| M10 | 5 | Ideas 3 y 4, y los Datos de la práctica | «forma canónica» en la regla y los Datos, y «descomposición canónica» en las preguntas (lector A). | Un solo nombre: «descomposición canónica», el del examen. |
| M11 | 5b, 3 | Idea 2: el último paso de Mira y la plancha de la regla | El 2, el 3, el 5 y el 7 quedan en turquesa y los otros 21 primos en violeta, y nada dice por qué (lector A). | Al final, los 25 primos en violeta (bloque `criba`, `primosQuedan`), con el pie «Quedan 25 primos, en violeta». |

### Baja (estilo)

| # | Punto | Dónde | Evidencia | Corrección |
|---|---|---|---|---|
| B1 | 10 | Ejemplo «Cinco primos en fila» | «**D**, de empezar en 31»: los cinco desde 31 terminan en 55; 49 es el cuarto, el que falla. | «**D** falla al empezar en 31 (31, 37, 43, 49)». |
| B2 | 10 | Ejemplo «El día de la semana» | «es una semana entera más un día»: son muchas semanas. | «son semanas enteras y un día más». |
| B3 | 3 | Idea 5, «Ahora tú» tipo 1 y práctica `phi-tres` | «el 1 lo es» se lee como «el 1 es primo»; «N − 1 vale solo si N es primo» cuando la pregunta no nombra N. | «el 1 también cuenta»; el número en lugar de N. |
| B4 | 10 | Práctica `fermat` | «Doña Juana empaca 12⁹⁹ caramelos»: 107 de 400 problemas de la idea 6. | «Se divide 12⁹⁹ entre 7». |
| B5 | Letras | Ejemplo «Los mismos primos» | Usa a y b como números; en la tabla de letras, a es la base de Fermat. | Dos pedidos, sin letras. |
| B6 | 9 | Ejemplo «Sin el último factor» | «Ese producto es el pedido por 6, y 6 × 1 = 6»: el pedido no es este producto, y el paso de 6 a 1 no se explica. | Escribir (1 × … × 5) × 6 y probar qué resto da 6. |
| B7 | 5 | Ejemplo «Una base múltiplo» | «10000» sin el espacio de los miles. | «10 000». |
| B8 | 3 | Voces de Mira de las ideas 1 y 2 | «Cuenta los divisores de cada boleto» sobre caramelos; «Cada primo empieza a tachar más lejos» no se entiende en el paso 1 (lector A). | «Cada boleto, en caramelos: cuenta sus divisores»; «Mira dónde empieza a tachar cada primo». |
| B9 | 1 | Cartel de `arit-boletos` (Predice de las ideas 1, 2 y 5; juegos 2 y 5) | Los dos cordeles del cartel se leen como una llave cortada sobre los boletos 1 y 2 (lectores A y B). | El cartel sin cordeles en esta unidad (`cordeles: false`; Divisibilidad no cambia). |
| B10 | 3 | Juego de la idea 3 | La lectura pinta en turquesa las dos partes del primer corte: el 18 parecía primo (lector A). | Las partes del corte en tinta; los primos de la descomposición, en turquesa. |
| B11 | 8 | Mira de la idea 6 | «base 2base 3…»: los encabezados se pegan a 390 px. | Encabezados «×2», «×3»…: el pedido se multiplica por la base. |
| B12 | 8 | Juego de la idea 5 (bloque `criba`) | El número tachado, al 45 % y bajo la raya, casi no se lee (lector B). | Número al 72 % y raya más fina y suave. |
| B13 | 3 | Ejemplos «¿Es 13 primo?», «Primos entre 20 y 30» y «Los divisores de 18» | No dicen por qué basta probar hasta 6 filas, afirman sin probar que 23 y 29 son primos, y no dicen que 1 = 2⁰ (lector B). | Una frase en cada uno. |
| B14 | 13 | «Así se resuelve» de la idea 6 | Trae la glosa del circulito sin usarlo. | Fuera (la pone `conMu` solo donde se usa). |
| B15 | 3 | «Vale si» de las seis reglas | Sigue unas veces con mayúscula («Vale si Primos…») y otras con minúscula (lector A). | Todas en minúscula, como Divisibilidad. |
| B16 | 3 | Predice de las ideas 2 y 5; Lee de la idea 5 | El pie de la figura repite la pregunta («¿Cuántos ganan?»); la tarjeta «Otra rifa» hace pensar que faltó una (lector B). | Pies que dicen lo que se ve; «La rifa de 12 boletos». |
| B17 | Glosario | «número primo» | Se define en Lógica: aquí se marca «se explica en…» (decisión de la propuesta). | Se deja. |

## Lo que está bien y hay que copiar al molde

- **Misiones con una sola respuesta en toda su grilla, y una prueba que la recorre**, incluso la del árbol, que no mira el
  primer corte (la prueba exige fijos solo los controles que la misión mira).
- **Cada distractor con su valor rehecho**: la prueba propia ya recalculaba los de las predicciones; la de esta
  auditoría rehízo además los 2 400 de «Ahora tú» y los 2 400 de la práctica por su código de error, y cuadraron todos.
- **Fuerza bruta en todo lo que pide una sola respuesta**: un solo primo entre los boletos, una sola progresión de primos,
  un solo divisor en el rango, un solo par PESI y un solo par de primos que suma un impar, en cada semilla.
- **El circulito glosado por construcción** (`conMu`): la línea de Datos entra sola donde el ejercicio lo usa, y nunca
  donde no.
- **φ por partes, multiplicando**, y la trampa de San Marcos 2023-I (restar dos veces los comunes) como distractor con su
  cuenta: no adelanta la inclusión-exclusión de MCD y MCM.

## Reglas que faltan en el contrato o el validador

| Regla | ¿Automática? |
|---|---|
| **Una frase de un `siFuera` o de un resuelto que afirma un hecho del caso es cierta en todas las semillas**: «cada uno entra más de una vez», «N es primo», «N tiene k divisores», «comparten el p» (A1). | Sí, para una lista de patrones: el comprobador de `cuentas.js` lee esas frases en 400 semillas. Lo de «cada uno» necesita saber de qué número habla. |
| **Una fórmula no se parte dentro de un paréntesis a 390 px** (M3). | Sí: `ecuaciones-ancho.js` puede medir si dos piezas de un mismo `(…)` caen en renglones distintos (hoy solo mide desbordes). |
| **Una regla que dice «cada…» no tiene excepción en los ejercicios de su idea** (A2: «cada forma da dos divisores» y los cuadrados). | No: es lectura. El auditor la busca. |
| **Un ciclo de restos que el resuelto muestra cabe en lo que muestra** (M1). | Sí, dentro de la prueba de la unidad: se recalcula el largo del ciclo de cada caso. Ya estaba propuesta en Divisibilidad. |
| **Ningún ejemplo es la respuesta de la misión** (M9). | Parcial: se puede comparar el caso del ejemplo con el caso que cumple la misión cuando los dos son números. |
| **Una notación nueva se dice en los Datos de cada ejercicio que la usa** (M2; también propuesta en Divisibilidad). | Sí: `{ mult }` en el ejercicio exige su glosa en los Datos. |
| **Los Datos no traen el teorema cuya aplicación es la respuesta en un ejemplo de nivel 1** (M4). | No: depende de qué practica el ejemplo. |

## Correcciones (19 nov)

Paso 3 del cierre (`docs/metodo/unidad/6-correcciones.md`), junto con las notas de los dos lectores en frío (ver
`rutinas/frio/aritmetica.numeros-primos-y-divisores.md`, «Correcciones de la ronda 1»). La teoría pasa a v0.3.1. Copias de
antes en `/tmp/claude-0/-home-user/31d0ae9f-8026-5866-a5dc-2c8554ea89bf/scratchpad/e6-cierre-pri/antes/`.

Las pruebas nuevas van al final de `numeros-primos-y-divisores.test.js` (12 y la tabla de ejemplos al día), de
`generador.test.js` (3) y de `arit-boletos.test.js` (1). Con los archivos de antes fallan todas (comprobado: 13 de la
unidad, 3 del generador y la de la pieza). Después: unidad 25 de 25, generador 39 de 39, piezas en verde (86 pruebas
entre unidad, generador y piezas), validador con `calidad: 2` simulada sin problemas, `cuentas.js` 40 769 de 40 769 sin
afirmaciones falsas, `ecuaciones-ancho.js`: todo cabe. `contenido/teoria/teoria.test.js`: esta unidad en verde; fallan
otras que otras sesiones están editando (estática, polígonos, verdades y mentiras, analogías, y el glosario de química sin
regenerar). No se corrió `npm test` completo. Se corrió `npm run catalogo` y `herramientas/papel-generador.js
primos-divisores` (cambian p2, «descomposición canónica», y p6, «Se divide 4³⁶ entre 11»).

| # | Qué se hizo |
|---|---|
| A1 | `casoCanon` y `canonica` nombran solo los primos que se repiten («Bien los primos. Pero el 2 entra más de una vez…»). Prueba: en 400 semillas, los primos nombrados son justo los de exponente mayor que 1. |
| A2 | Regla: «Cada forma da dos divisores; la del cuadrado (6 × 6), uno solo». Condición: «el 1 no es ni uno ni otro». Lee 3: «Un número primo tiene exactamente dos divisores, el 1 y él mismo». Prueba. |
| M1 | Divisor compuesto entre 9, 15 y 21 en la teoría y en la práctica; la solución de la práctica muestra el ciclo. Prueba: el ciclo de cada caso mide de 2 a 6. |
| M2 | `conMu` agrega «p̊ (p con un circulito): un múltiplo de p» a los ejemplos y «Ahora tú» de la idea 6 que lo usan; sale de «Así se resuelve». Prueba en los 15 ejemplos y 400 semillas: la glosa está si y solo si se usa. |
| M3 | `phiEc` con tres primos va en dos renglones («84 × (1 − ½) × (1 − ⅓) = 28» y «28 × (1 − 1/7) = 24»). Reglas: CD y SD con «×» entre los paréntesis y la suma corta, φ con fracciones en línea, «d ≤ √N o k ≤ √N» sin espacios partibles. Capturas: cada fórmula se parte solo después del «=». Prueba. |
| M4 | «El producto de 1 a 4» (nivel 1, Datos sin Wilson, que se nombra al final); «Wilson más uno» (nivel 2: ¿es 12! + 1 múltiplo de 13?, sí); «Fracciones de denominador 90» (nivel 3, φ(90) = 24, tres primos; las trampas 89, 65, 12 y 45 rehechas, la letra sigue en A). Prueba. |
| M5 | El resuelto prueba 99, 96 y 93 desde el mayor. Prueba. |
| M6 | La tabla resalta el primer día en que los sueltos vuelven a 1 (en el juego y en la figura de Predice). Voz de Mira «Con bolsitas de 7, mira el día 6»; `siFuera` de Predice sin p («Los sueltos vuelven a la base un día después, el día 101»). Lee 3: «ese primo se llama p». Prueba. |
| M7 | Idea 3: «α y β («alfa» y «beta») dicen cuántas veces entra cada uno». Idea 4: «Con p y q primos…»; «12³ = 2⁶ × 3³». Idea 5: «del 1 al p». Idea 6: Wilson en el paso 5 de Mira; nota de la llave «el producto de 1 a p − 1»; «p̊: un múltiplo de p» en la condición. Prueba. |
| M8 | `D5.def` con «es decir, no comparten ningún primo con N»; Lee 1 de la idea 5 con «primo entre sí»; Lee 3 de la idea 3 presenta PESI (el lector A lo vio llegar de golpe en Predice). Prueba. |
| M9 | «Divisores de 2⁴ × 7». Prueba. |
| M10 | «Descomposición canónica» en los Datos de la teoría y de la práctica y en la llave de la regla. Prueba: «forma canónica» no aparece en ningún texto que se ve. |
| M11 | Bloque `criba` con `primosQuedan` (los primos que tacharon, también en violeta) en el último paso de Mira y en el «revelar» de Predice; pie «Quedan 25 primos, en violeta». Prueba en la pieza y en la unidad. |
| B1, B2, B5, B6, B7, B13, B14, B15, B16 | Como dice la tabla. |
| B3, B4 | Como dice la tabla, en la teoría y en la práctica. Prueba de B4 en el generador. |
| B8 | Voces nuevas. |
| B9 | `arit-boletos` admite `cordeles: false` (sin cordeles; por defecto, como antes); esta unidad lo usa en todos sus carteles. Prueba. |
| B10 | La lectura del árbol escribe «36 = 2 × 18 = 2² × 3²» con el corte en tinta. Prueba. |
| B11 | Encabezados «×2» a «×6». Prueba. |
| B12 | En el bloque `criba`, número tachado al 72 % y raya de 1,3 con 55 %. Solo lo usa esta unidad. Prueba. |
| B17 | No se tocó. |

### Pendiente

- **De `nucleo/ecuacion.js` (fuera del alcance):** una fracción apilada (`{ frac }`) deja partir el renglón a su lado, también
  antes de un «)». Aquí se esquivó desde el contenido; la solución de fondo es que `ecuacion.js` no parta dentro de un
  paréntesis. Y la regla nueva para `ecuaciones-ancho.js` (tabla de arriba).
- **Para Gerson (dibujos de prueba):** la bandeja, el árbol de cortes y la plancha de la rifa siguen siendo de prueba
  (`data-prueba`).
- **Decidido por la sesión, Gerson revisa después:** el ejemplo de nivel 1 de Wilson ya no trae Wilson en los Datos (lo
  descubre con la cuenta y el resuelto lo nombra), porque los dos lectores dijeron que la respuesta venía dada. Y el cartel
  de la rifa va sin cordeles en esta unidad, porque se leía como una llave; Divisibilidad sigue con cordeles.
