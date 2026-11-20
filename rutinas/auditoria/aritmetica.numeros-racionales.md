# Auditoría de contenido: «Números racionales, fracciones y decimales» (aritmetica.numeros-racionales)

20 nov 2026. Auditor externo del cierre delegado (`docs/metodo/unidad/cierre-delegado.md`), que no escribió la unidad.
Contrato: `docs/plan-calidad.md` §3 y §5. Formato: `docs/teoria.md`. Vara: `docs/molde-unidad.md` §10. Reglas
automáticas: `docs/metodo/unidad/reglas-validador.md`. Guion: `docs/etapa8/propuesta-aritmetica.md` (decisiones §11).
Lo que vieron los dos lectores en frío está en `rutinas/frio/aritmetica.numeros-racionales.md`; aquí se cita solo
cuando el código lo confirma o lo agrava.

**Qué se revisó.**
- La teoría `contenido/teoria/aritmetica/numeros-racionales.js` (v0.3.0, sin `calidad: 2`; pasa a v0.3.1 con las
  correcciones):
  - las 6 ideas con sus 7 momentos;
  - los 90 ejemplos;
  - «Ahora tú» (400 semillas por tipo: 2 400 por idea, 2 000 en la idea 6) y «Así se resuelve» (400 por idea);
  - el glosario (21 términos), las 3 mesas y la historia.
- La pieza nueva `arit-queque` y el bloque de la coma de `arit-calculadora`, con sus pruebas.
- La práctica nueva `plantillas/racionales/` (24 tipos en las 6 ideas, `casos.json`, papel de 8), y los bloques de la
  unidad en `fracciones-problemas` (10 tipos con `{ unidad }`, papel de 7), `numeros-sucesiones` (`grifos`) y `fracciones`
  (escena con `rehacer`; sus 5 problemas de papel de esta unidad).
- La prueba del curso: ari-37 y ari-38 en la reserva.
- La app a 390 px con `--entera`: los 42 momentos y los 90 ejemplos. Servidor propio en el puerto 4454.

**Cuentas.** Se rehicieron aparte con dos scripts en Python, con `fractions.Fraction`, sin el código de la unidad ni los
scripts del autor (`/tmp/claude-0/-home-user/31d0ae9f-8026-5866-a5dc-2c8554ea89bf/scratchpad/e8-cierre-nr/cuentas.py` y
`cuentas2.py`). Un volcador (`volcar.js`) solo aplana a texto lo que ve el alumno: pregunta, Datos, opciones con su
código, `siFuera`, solución, pasos, respuestas, la lectura del juego en toda su grilla y los textos de las figuras. Los
scripts leen ese texto y rehacen todo por su cuenta:
- cada equivalencia y cada comparación con Fraction, buscando k por fuerza bruta;
- cada fracción del total y del resto contando pedazos de un queque cortado en b × d;
- cada decimal exacto o periódico con su propia división larga. El criterio de los factores 2 y 5 del denominador
  irreductible se contrasta con ella, y también el largo del anteperíodo (el mayor exponente) y del período;
- cada generatriz, pura y mixta, leyendo el decimal escrito con la regla de la unidad (bloque de 1 o 2 cifras, tres
  veces; de más, dos) y evaluándolo exacto;
- cada fracción en otra base, exacta si la división larga en base B termina, contrastado con «los primos del
  denominador dividen a la base»;
- cada igualdad escrita, con un evaluador propio de fracciones, periódicos y números en base B.

**Resultado (versión corregida): 1 082 452 comprobaciones.** Antes de corregir eran 1 074 412, con las faltas de abajo.
- «Ahora tú»: 14 000 casos (400 por tipo, los 35 tipos). En cada uno se rehicieron la correcta, que haya una sola, las
  cuatro opciones distintas y el valor de cada distractor por su código. Son 16 400 correctas y 48 000 distractores,
  contando la práctica.
- La práctica `racionales`: 2 400 problemas (400 por idea, los 24 tipos), con la correcta, el valor de cada error y los
  Datos.
- «Así se resuelve»: 2 400 casos, con la respuesta rehecha por fuerza bruta.
- Igualdades: 31 268 escritas, evaluadas exactas.
- Periódicos: 8 440 escritos. Cada uno se escribe como da la división, con el bloque repetido y «…».
- Coma flotante: ningún número de 9 cifras o más, ni decimal largo, ni notación «e», NaN, undefined ni [object en
  ningún texto. El autor ya había quitado el de 18 cifras; el script no encontró otro.
- Los 90 ejemplos (`cuentas2.py`, con las respuestas escritas a mano desde el enunciado):
  - los 30 de nivel 3, con la correcta y cada trampa rehecha por su error; la letra queda 6 veces en cada una de A a E;
  - los 60 de nivel 1 y 2, con su respuesta.
- Las 6 predicciones, con cada distractor rehecho:
  - 5/7, 3/25 y 15/5;
  - 45 contra 49;
  - 1/6, 3/5 (AR12) y 2/3;
  - 7/40, la única con solo 2 y 5;
  - 27/100, 3/10 y 3;
  - 0,111…₍₆₎ y 0,2₍₆₎ = 1/3.
- Las 6 misiones en toda su grilla: cada una se cumple con un solo caso, que coincide con la meta rehecha por fuerza
  bruta.
- **El juego de la idea 1 no llega a 15/25.** No aparece ninguna fracción igual a 3/5 en las 32 lecturas ni en los
  rótulos del dibujo (sin 3/5 entre las fracciones; k llega a 4).
- **La del-resto usa los errores con nombre.** AR12 está en la Predice, en «lo vendido en total», en el tipo nuevo «qué
  queda» y en la práctica `sumar`, y su valor es siempre (a + c)/(b + d). Los 68 códigos AT-* de la teoría y la práctica
  están en la tabla «Números racionales (19 nov)» del informe de ideas erróneas.

Validador con `calidad: 2` simulada (`Teoria.problemas`, 200 semillas): **0 problemas, 0 pendientes** antes y después.
Las correcciones lo hicieron saltar por topes de palabras, que se ajustaron. Ninguna de las faltas de abajo la ve una
regla de hoy.

**Regla del papel con la marca simulada** (lección 18): **ninguna falla** en las cuatro plantillas de la ficha, antes y
después. `fracciones` tiene `rehacer` y no entra en papel-datos ni papel-unidad. Sus 5 problemas de esta unidad dicen su
unidad, y los de `fracciones-problemas`, `racionales` y `numeros-sucesiones` traen Datos.

Pruebas propias antes de corregir: unidad 15 de 15, `racionales` 33 de 33, `fracciones-problemas` 29 de 29, piezas en
verde.

## Hallazgos

### Alta (el alumno no puede resolver o aprende algo falso)

| # | Punto | Dónde | Evidencia | Corrección propuesta |
|---|---|---|---|---|
| A1 | 3, 9; lector A | Idea 3 (del-resto, la nueva): La regla | El dibujo es mañana 1/2 y tarde 1/3 de lo que quedó. La ecuación suma 1/2 + 1/6 = 4/6 sin decir de dónde sale el 1/6, la llave usa a, b, c y d sin decirlas, y la condición afirma «1/2 + 1/3 no es 2/5: es 5/6» sobre el mismo queque, donde lo vendido es 4/6. El lector A: «¿lo vendido es 4/6 o 5/6?». Un alumno puede salir creyendo que la tarde suma 1/3 del queque, el error que la idea combate. | Con los números del dibujo: 1/3 × 1/2 = 1/6 (la tarde), 1/2 + 1/6 = 4/6 (lo vendido) y 2/3 × 1/2 = 1/3 (lo que queda), cada uno con su llave; la condición solo con el error de arriba con arriba. |

### Media (el alumno se traba o duda)

| # | Punto | Dónde | Evidencia | Corrección propuesta |
|---|---|---|---|---|
| M1 | 13; lección 2 | Idea 5, «Ahora tú» tipo 5 (`casoProducto`, AT-CORTAR) | Con 0,333… o 0,666…, «cortar» da 0,06 × 1,5 = 9/100 en vez de 0,66 × 1,5 = 99/100 (el bloque de una cifra se cortaba en una cifra). Falla en 118 de 400 casos del tipo. | Cortar en dos cifras de verdad. |
| M2 | 10, 13 | Idea 2, «Ahora tú» tipo 5 y práctica `precio` (AT-TOTAL) | «Cuesta menos en total, es cierto» y las dos bolsas cuestan lo mismo (S/ 10 y S/ 10). Falso en 10 de 400 casos en la teoría y en 2 de 400 en la práctica. | Excluir el mismo precio. |
| M3 | Lección 16 | Idea 2, «Ahora tú» tipo 2 (`casoClase`) y práctica `exacto` | La lista del enunciado va siempre en el mismo orden: la aparente siempre 2.ª (193 de 193), la propia siempre 3.ª (207 de 207), y en la práctica la exacta siempre 1.ª (96 de 96). Las opciones se barajan, pero la lista delata. | Barajar la lista. |
| M4 | 13; lección 2 | Idea 4, ejemplo 12 «El lugar 100» | La trampa **D**, 2, «cuenta uno de menos»: el lugar 99 de 3/7 es 8, no 2; el 2 no sale de ningún error. | D = 8. |
| M5 | Decisión 8; pedido de la sesión | Teoría (ejemplos 4.15 y 5.11), `fracciones-problemas` (generador y papel) y papel de `fracciones` | «0,0016666…» y «0,16666…» (cuatro seises). En la práctica de examen, los bloques de dos cifras salen dos veces («27,2727… %», «0,019696…», «0,1515…»), y la cota de `stock` se escribe truncada con «…» («N < 283,5…», 92 casos): en esta unidad «…» quiere decir que el bloque se repite. La prueba de la unidad no lo veía, porque «6666» termina en «666». | Escribir con la división; la cota como «N ≤ 283». |
| M6 | 13 | `fracciones-problemas`, los 10 tipos con `{ unidad }` | Ningún problema trae Datos (400 de 400): la práctica de examen de la unidad no cumple el punto 13. El papel sí (lo hizo el autor a mano); el generador no (decisión 7 lo dejó así). | Recuadro «Datos» por tipo, con la definición y la fórmula, nunca el paso. |
| M7 | Lección 5; lector A | Idea 2, Predice; ejemplos 1.9, 2.1 y 2.10 | En el dibujo, 7/9 pintado a escala llega más lejos que 5/7: se ve la respuesta. Lo mismo pasa en las figuras que comparan dos queques (Rosa y Luis, 5/9 y 7/9, Ana y Beto). | Las bandejas cortadas, con su rótulo, sin lo vendido pintado. |
| M8 | Lección 4 | Idea 3, Juega | Con mañana 1/3 y tarde 1/2, la lectura dice «Queda 1/2 de 2/3: 1/3 del queque»: la respuesta de la Predice (1/2 y después 1/3), en el otro orden. | Sacar 1/3 de la mañana (la misión sigue con un solo caso). |
| M9 | §2 (practica cada parte); lector A | Idea 3, «Ahora tú» tipo 0 | Una suma sola («¿Cuánto es 2/5 + 1/4?»): no practica la parte del resto y Luma pregunta «¿Esa parte es del total o de lo que quedó?». | Tipo 0: qué queda tras la mañana y la tarde, con los tres errores de la Predice (AR12 con su nombre). |
| M10 | 13; lector B | Datos de las tarjetas 05, 07 y 09; Predice de la generatriz | «se suman los numeradores» en una resta; «el MCM de los dos» con tres fracciones; «vender» en un problema de perder; «0,27 = 27/100» empuja a la trampa C (27/100). | Datos dichos para todos los casos; en Predice, un valor que no es una opción. |
| M11 | 2, 9; lector A | Idea 2: misión, Lee y La regla | La misión «Arriba deja 3/4… vende lo menos posible para pasarlo» se lee de dos maneras. Las bandejas se llaman Mañana y Tarde en Lee y Arriba y Abajo en Juega. La regla nombra la aparente sin ejemplo, y 7/4 queda fuera de la recta de 0 a 1. | Misión sin «deja» ni «pasarlo»; Arriba y Abajo también en Lee; llaves «impropia» (7/4) y «aparente» (8/4 = 2); recta de 0 a 2 con 7/4. |
| M12 | 3; lector B | Idea 6: Juega, Predice y La regla | La tabla dice «resto × 10» sin decir la base: en Predice muestra 1/5 en base 10 bajo una pregunta en base 6. La regla escribe 0,23₍₆₎ = 2/6 + 3/36 sin terminar. | «cifra en base B» en la tabla; la regla hasta 5/12, con su llave. |

### Baja (estilo)

| # | Punto | Dónde | Evidencia | Corrección |
|---|---|---|---|---|
| B1 | 10 | Idea 5, Juega | La lectura «10x − x = 3: las colas se cancelan» no despeja x (lector B). | «x = 3/9 = 1/3». |
| B2 | 3 | Tarjetas 11, 12, 15 y 17 | Faltan pasos: la división de 2/7, el 125/100 000, por qué 1000x y 10x, el «compruebo» de base 3; «2 115» y «2115» (lector B). | Los pasos, en cada tarjeta. |
| B3 | Lector A | Mira de las ideas 1, 2 y 3; Mira de la idea 3 | Luma dice «Corta…» donde no se corta nada; lo que queda (1 − 1/2 = 1/2) va en el color de lo vendido. | «Mira cómo se corta…»; lo que queda en violeta. |
| B4 | Lector A | Idea 1, La regla | Nombra el MCD y la irreductible sin un ejemplo. | Llave 12/16 ÷ 4 = 3/4. |
| B5 | Lector B | Idea 5, «Así se resuelve» | «todo hasta el bloque − lo de antes» no dice si entra la parte entera. | Un dato más: con parte entera, «todo» y «lo de antes» la llevan delante. |
| B6 | Lector B | Idea 4, Juega | El «resto» de la primera fila es el numerador. | Lee 3: «la primera fila empieza con el numerador». |
| B7 | 5 (notación) | `fracciones-problemas` (generador y papel) y papel de `fracciones` | «·» para multiplicar (41 en el generador), contra el «×» de la unidad. | «×». |
| B8 | Prueba del curso | ari-38 A | 0,8333… = 5/6 es justo el ejemplo de La regla y de Mira de la idea 5: la prueba de salida mediría memoria. | 0,7333… = 11/15, con sus tres errores rehechos. |
| B9 | Lector B | Tarjeta 05 y regla 2 | «Aparente» sin decir que vale un entero. | «…y vale un entero». |
| B10 | 3 | Idea 6, Mira paso 1 | «1 × 6 = 6 = 1 × 5 + 1» sin decir cuál es la cifra (lector B). | «cifra 1, sobra 1». |
| B11 | Lectores | — | Lo que no se tocó: los Datos de Predice 4 repiten la tabla; la tarjeta 18 da la fórmula del bloque en base B (es la fórmula, punto 13); la trampa 19/6 de la 18 es mayor que 1 (sale de su error, AT-NUEVES); el primer «Así se resuelve» de la idea 1 (30k² = 1080) es difícil; el hueco blanco sobre la lupa (es de la app). | Ver «Pendiente». |

## Lo que está bien y hay que copiar al molde

- **Misiones con una sola respuesta en toda su grilla, rehechas por fuerza bruta en la prueba**, y las Predice que el
  juego no alcanza (el juego de la idea 1 no tiene 3/5; el de la generatriz, no tiene 0,2727…).
- **Los periódicos con una sola escritura en toda la unidad**, salida de la misma función que la división. Lo que falló
  fue lo escrito a mano y la plantilla vieja; ahora la prueba lo compara con la división.
- **Un color por magnitud con prueba** (`def.colores` y la ficha que dice su magnitud), sin verde, y el resto de la
  división en carmín.
- **Las trampas de nivel 3 rehechas en la prueba de la unidad**, con la letra repartida (6 por letra).
- **El tipo de examen de San Marcos en cada idea** (9 tipos con forma de examen), con Datos que dan la fórmula general.

## Reglas que faltan en el contrato o el validador

| Regla | ¿Automática? |
|---|---|
| **Un decimal con «…» se escribe exactamente como la división** (no basta con que termine en el bloque repetido: «0,0016666…» pasaba) (M5). | Sí: releer el decimal por todos los cortes y comparar con la división, como la prueba nueva de la unidad. Vale para todo curso que escriba periódicos. |
| **Una lista dentro del enunciado no pone la correcta siempre en el mismo lugar** (M3). | Sí: en 400 semillas, el lugar de la correcta dentro de la lista toma al menos 3 valores. |
| **Un dibujo a escala de dos cantidades que se comparan no las pinta en Predice** (M7). | Parcial: con la pieza que dibuja fracciones (queque, tiras), que la figura de una Predice de comparar no traiga marcas. |
| **El juego no muestra la respuesta de la Predice, tampoco en otro orden ni con otros números que dan lo mismo** (M8). | Sí: la lectura de toda la grilla no contiene el valor de la opción correcta (lo que hoy mira `antes-predice` en la consigna y la misión, llevado a la lectura). |
| **Los Datos de Predice no traen el valor de una opción** (M10, «0,27 = 27/100»). | Sí: ninguna línea de Datos contiene el texto de una opción incorrecta como número entero. |
| **Un «siFuera» que afirma un hecho del caso es cierto en todas las semillas** («cuesta menos en total»; M2). Ya propuesta en MCD y MCM. | Parcial: por patrones, como en `cuentas.py`. |
| **La práctica de una unidad con `calidad: 2` trae Datos también en las plantillas viejas que la ficha lista** (M6). Hoy la regla del papel lo pide al papel, no al generador. | Sí: `generar(s, { unidad })` en 400 semillas con `datos` no vacío. |

## Correcciones (20 nov)

Paso 3 del cierre (`docs/metodo/unidad/6-correcciones.md`), junto con las notas de los dos lectores en frío (ver
`rutinas/frio/aritmetica.numeros-racionales.md`, «Correcciones de la ronda 1»). Copias de antes en
`/tmp/claude-0/-home-user/31d0ae9f-8026-5866-a5dc-2c8554ea89bf/scratchpad/e8-cierre-nr/antes/`.

**Pruebas nuevas.**
- `numeros-racionales.test.js`: 11 nuevas al final («cierre …»). La recalculación del tipo 0 de la idea 3 se puso al día.
- `plantillas/racionales/generador.test.js`: 2.
- `plantillas/fracciones-problemas/generador.test.js`: 1.
- Con los archivos de antes fallan todas: se comprobó en una copia con la versión de antes (12 de la unidad, contando la
  del tipo 0, 2 de `racionales` y 1 de `fracciones-problemas`).

**Después.**
- Unidad 26 de 26, `racionales` 35 de 35, `fracciones-problemas` 30 de 30, `fracciones` y `numeros-sucesiones` en verde,
  piezas en verde.
- `catalogo/pruebas/pruebas.test.js` 63 de 63.
- Validador con `calidad: 2` simulada: 0 problemas.
- Regla del papel con la marca simulada: ninguna falla.
- `cuentas.py`: sin fallas en 1 082 452 comprobaciones. Las 4 «igualdades» que marca son de otras unidades del papel de
  `fracciones`, escritas con «·».
- `cuentas2.py`: sin fallas. Las 7 que lista son de comparación del propio script; se revisaron una por una.
- `contenido/teoria/teoria.test.js`: 188 de 189. Falla Ángulos en posición normal, que edita otra sesión.
- No se corrió `npm test` completo. Se corrió `npm run catalogo`, y `herramientas/papel-generador.js racionales` (cambia
  p3: la lista barajada).

| # | Qué se hizo |
|---|---|
| A1 | La regla de la idea 3 con tres llaves y los números del dibujo: la tarde (1/3 × 1/2 = 1/6), lo vendido (1/2 + 1/6 = 4/6) y lo que queda (2/3 × 1/2 = 1/3). La condición solo con «arriba con arriba no se suma: 1/2 + 1/6 no es 2/8». El texto y el `aprendizaje` sin letras. Prueba. |
| M1 | `casoProducto` corta en dos cifras de verdad. Prueba (400 semillas). |
| M2 | `casoPrecio` y `precio` excluyen el mismo precio. Pruebas en la teoría y en la práctica. |
| M3 | La lista de `casoClase` y la de `exacto` se barajan. Pruebas. |
| M4 | Trampa D = 8. Prueba. |
| M5 | Teoría con `decimal(1, 600)` y «0,1666…». En `fracciones-problemas`, `conPuntos` sigue la decisión 8 y la cota pasa a «N ≤ 283» (en la recta, intervalo cerrado). En los papeles: 0,015909090…, el período de 3/17 dos veces, 0,3181818… y 0,151515…. Pruebas: el decimal releído es el de la división en la teoría; los bloques y la cota en la práctica. |
| M6 | `datosDe(tipo)` en `fracciones-problemas`: el recuadro de los 10 tipos de la unidad (definiciones, MCD(n, n + k) = MCD(n, k), generatriz pura y mixta, «quitar c/d de lo que queda», «cada venta da un entero», factorial, anteperíodo y período). Los de MCD y MCM, que la unidad no pide, siguen sin recuadro. Prueba (400 semillas, con la unidad). |
| M7 | `sinVender()`: Predice 2 y los ejemplos 1.9, 2.1 y 2.10 con las bandejas cortadas y su rótulo, sin lo vendido. Prueba. |
| M8 | `MANANA` sin 1/3; la misión sigue con un solo caso (lo comprueba la prueba de misiones). Prueba: ningún caso de la grilla deja 1/3. |
| M9 | Tipo 0 nuevo, `casoQueda`, con AR12, AT-RESTO-TOTAL y AT-RESTO-SOLO, rehecho por `cuentas.py` contando pedazos. Prueba. |
| M10 | `D3.comun` («se suman o se restan»), `D2.comun` («el MCM de sus denominadores»), `D3.resto` («quitar … vender, gastar o perder») y Predice 5 con «100 × 0,35 = 35». Prueba. |
| M11 | Misión «Arriba hay 3/4 vendido. Abajo, en séptimos, vende lo menos posible pero más que arriba.»; Lee con Arriba y Abajo; la regla con las llaves «impropia» y «aparente» y la recta de 0 a 2 con 7/4. Prueba. |
| M12 | `tablaDiv(…, conBase)`: «cifra en base B» en Juega, Mira, Predice (base 10 y base 6) y la mesa de bases; la regla 6 con la llave hasta 5/12, y también Lee 2. Prueba. |
| B1 a B6, B9, B10 | Como dice la tabla. B1, con prueba. |
| B7 | «×» en todo el generador de `fracciones-problemas` y en su papel; en el papel de `fracciones`, solo en los problemas de esta unidad. Prueba en la práctica. |
| B8 | ari-38 A: 0,7333… = 11/15 (errores 73/99, 73/100 y 22/3, rehechos con Fraction); el verificador de `catalogo/pruebas/verificar.js` lo comprueba sin cambios. |

Capturas después de corregir: `/tmp/claude-0/-home-user/31d0ae9f-8026-5866-a5dc-2c8554ea89bf/scratchpad/e8-cierre-nr/despues/`
(132: 42 momentos y 90 ejemplos, ninguna repetida según md5sum). `herramientas/ecuaciones-ancho.js` después de corregir:
todo cabe (58 pantallas, 412 renglones). En la idea 6, la tabla con la base deja la columna n.º para que «cifra en base
10» quepa sin apretar las cuentas.

### Pendiente

- **De `herramientas/` (fuera del alcance):** las reglas nuevas de la tabla de arriba, sobre todo la del decimal
  releído y la de Datos en los generadores viejos de la ficha.
- **De la app:** el hueco blanco sobre la lupa en Mira (lector A) es de la caja fija de la figura, no de la unidad.
- **De la pieza `recta` (compartida, no se tocó):** con `paso: 0.25` y `cada: 4` los números del eje salen mal (de 0 a 2
  solo rotula 0 y 1; con `decimales: 2`, «0» y «1,25»). La regla de la idea 2 usa `paso: 0.5` y `cada: 2`, que rotula 0, 1
  y 2.
- **Para Gerson (dibujos de prueba):** el queque y la coma de la calculadora siguen siendo de prueba.
- **Decidido por la sesión, Gerson revisa después:**
  - el tipo 0 de «Ahora tú» de la idea 3 dejó de ser una suma sola: ahora pregunta qué queda. La suma sola sigue en los
    ejemplos 1 a 3 y en la práctica `sumar`, y la suma de partes está dentro de «lo vendido en total». Descartado:
    dejar la suma y cambiar la voz de Luma, porque no practicaba la idea nueva.
  - la mañana del juego de la idea 3 pierde 1/3, para que ningún caso deje la respuesta de la Predice. Descartado:
    cambiar la Predice, que junta los tres errores (decisión 5).
  - las figuras que comparan dos fracciones (Predice 2 y tres ejemplos) muestran el queque cortado sin lo vendido.
    Descartado: «El dibujo no está a escala», porque el queque está a escala a propósito en el resto de la unidad.
  - el primer «Así se resuelve» de la idea 1 (30k² = 1080) se queda: es un tipo de examen que «Ahora tú» no tiene.
    Descartado: bajarlo a la suma de términos, que ya es el tipo 3 de «Ahora tú».
  - ari-38 A cambia de 0,8333… a 0,7333…, porque el anterior es el ejemplo de La regla.
