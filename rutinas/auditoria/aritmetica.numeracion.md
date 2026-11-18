# Auditoría de contenido: «Sistemas de numeración» (aritmetica.numeracion)

17 nov 2026. Auditor externo (fase 7 del método, `docs/metodo/unidad/5-auditor.md`), sin editar la unidad. Contrato:
`docs/plan-calidad.md` §3 (13 puntos) y §5. Formato: `docs/teoria.md` 4e, 4f, 4h y §5. Vara: `docs/molde-unidad.md`
§10. Decisiones: `docs/etapa3/decisiones.md` (Numeración y rondas siguientes), `docs/etapa3/propuesta-aritmetica.md` §9
y `docs/etapa2/decisiones.md` («Cambios posteriores»). Lo que ya se sabe no se repite: «muestra» marcada como término de
Estadística y la leyenda de la idea 2.

**Qué se revisó.**
- `contenido/teoria/aritmetica/numeracion.js` (v0.4.0, `calidad: 2`): las 5 ideas con sus 7 momentos, los 75 ejemplos,
  «Ahora tú» con las semillas 0–399, «Así se resuelve» con las semillas 0–11, el glosario (16 términos), las 3 mesas del
  laboratorio y la historia.
- Las piezas `arit-puesto`, `arit-tabla` y `arit-talonario` (en pantalla) y la mesa 3D.
- La práctica: `plantillas/numeracion-bases/` (22 tipos, 27 con sus subtipos, y `papel.json`), el tipo `cifras` de
  `plantillas/numeros-sucesiones/` (el único que da a esta unidad) y la escena `plantillas/numeracion/` con su papel.
- La app a 390 × 844 con `--entera`: los 35 momentos, los 75 ejemplos, el glosario y el laboratorio.
- Scripts y capturas en el scratchpad de la sesión, carpeta `auditoria-numeracion/`: `cuentas.js`, `cap/` (momentos,
  glosario, laboratorio) y `capej/` (ejemplos).

**Cuentas.** Se rehicieron con un script propio (`auditoria-numeracion/cuentas.js`). El script tiene sus propias
funciones de cambio de base, valor, validez y conteo de cifras por fuerza bruta. De la unidad solo toma el texto del
problema generado. Resultado: 2266 comprobaciones cuadran y queda 1 error, en la explicación de un distractor (M5).
- **Ejemplos: 50 de 75.** Los 25 de nivel 3 y 25 de los niveles 1 y 2, más la letra de cada alternativa marcada como
  respuesta.
- **Predicciones y misiones.** Las 5 predicciones y las 5 misiones.
- **«Ahora tú»: 2000 casos.** Son las semillas 0–399 de las 5 ideas, con los 23 tipos reconocidos desde el texto. En
  todos, la correcta cuadra, hay una sola mal escrita donde se pide la mal escrita y salen 4 opciones.
- **«Así se resuelve»: 60 casos.** Semillas 0–11 de las 5 ideas; en la idea 4, la base es única.
- **Generador: 81 problemas.** 3 semillas por cada uno de los 27 tipos y subtipos de `numeracion-bases`, más 6 del tipo
  `cifras` de `numeros-sucesiones`.
- **Papel: 18 problemas.** Los 8 de `numeracion-bases` y los 10 de la escena (los capicúas por fuerza bruta).

`node --test` de la unidad, del generador, de `numeros-sucesiones`, del motor y de las tres piezas: 138 de 138 en verde.
`contenido/teoria/teoria.test.js`: 158 de 158, y esta unidad pasa.

**Lo que dijo el lector en frío, verificado.**
- **Es real y entra en la tabla:**
  - el puesto vacío en «Lee» de la idea 3 (A1);
  - el «132» sin base en la idea 2 (M3);
  - q sin explicar (M4);
  - a con dos significados (M6);
  - 18 y 3 en la leyenda de la idea 3 (M8);
  - «Leer la etiqueta» y «Leer la tabla», que regalan la respuesta, y las filas vacías de la tabla (M9 y B4);
  - el nivel 14 más fácil que el 8 en la idea 1 (M10);
  - «manda la base más chica» (B2);
  - 6³ de sobra (B3);
  - el 180 que sale de la nada (B5);
  - la base 7 en verde sin aviso (B6);
  - (31)₍?₎ contra (31)₍ₙ₎ (B7);
  - los distractores sin explicar (B8);
  - los caramelos que se tocan (B11).
- **No se reproduce:**
  - «caja» llega en la tarjeta 3 de «Lee» de la idea 1, y la raya, en la tarjeta 3 de «Lee» de la idea 2;
  - «orden» y «numeral» son términos del glosario;
  - las rayitas sueltas y las cuentas partidas ya no aparecen a 390 px (las cuentas van una por línea).

## Hallazgos

### Alta (el alumno no puede resolver o aprende algo falso)

| # | Punto | Dónde | Evidencia | Corrección propuesta |
|---|---|---|---|---|
| A1 | 1, 10 | `numeracion.js:1241` (idea 3, «Lee», tarjeta 1); captura `cap/claro-cel-cambio-base-1-lee.png` | `dibujo: { datos: montonF(4, 75), estado: {} }`, pero `montonF` ya devuelve `{ pieza, datos, estado }`. La pieza recibe la envoltura, no los datos, y dibuja **el puesto vacío**: sin caramelos, sin rótulos, solo el óvalo punteado del piso. Es la primera pantalla de la idea y dice «le llegan 75 caramelos sueltos». El lector en frío lo vio («adentro del puesto no hay nada»). En la idea 4 se hizo bien (`bolsaF('23', 17).datos`, `:1616`). No hay prueba que lo detecte. | `dibujo: { datos: montonF(4, 75).datos, estado: {} }`, y que el validador rechace un `dibujo.datos` con clave `pieza` (ver Reglas). |

### Media (el alumno se traba o duda)

| # | Punto | Dónde | Evidencia | Corrección propuesta |
|---|---|---|---|---|
| M1 | Regla 3 del repo; 4e | Glosario: `:2200` (orden), `:2206` (valor posicional), `:2213` (descomposición polinómica), `:2217`/`:2220` (cociente, resto), `:2224` (cambio de base), `:2229` (base desconocida), `:2244` (cantidad de cifras) | **Los ejemplos del glosario traen la predicción resuelta, o la misión, en 5 de 5 ideas.** Se abren antes de jugar, desde «Palabras de esta idea» del Resumen, desde el subrayado de «Lee» o desde la pestaña Glosario:<br>• «203₍₅₎ = 2 × 25 + 0 × 5 + 3 = 53» es Predice 2.<br>• «19 = 201₍₃₎: los restos salen 1, 0 y 2» es Predice 3; también «19 entre 3: el cociente es 6» y «sobra 1».<br>• «31₍ₙ₎ = 25: la base es 8» es el paso de Predice 4, y «23₍ₙ₎ = 17: la base es 7» es la misión 4.<br>• «Del 1 al 100 se imprimen 192 en total» es Predice 5.<br>• «En 100₍₅₎ hay tres: 1 caja, 0 bolsitas y 0 sueltos» es la respuesta de Predice 1. | Rehacer esos ejemplos con otros números, y que ninguno toque el caso de una predicción: «302₍₄₎ = 50», «41 = 1103₍₃₎», «del 1 al 60», «32₍ₙ₎ = 23: la base es 7», «1000₍₃₎». Prueba automática (ver Reglas). |
| M2 | Regla 3; 4h | Ejemplos: «Un cero en medio» (`:746`), «Dos divisiones» y «Leer la tabla» (`:1101`, `:1109`), «Dos etiquetas, un puesto» (`:1514`), «Boletos de dos cifras» (`:1819`, «No son 89») y «Del 1 al 1000» (`:1915`, «la trampa es… olvidar el 1000») | La pestaña Ejemplos no se cierra por idea (`app/teoria.js:338`, `:880`): se abre antes de Predice.<br>• **Idea 2:** «Un cero en medio» enseña lo que reserva la predicción («Se reserva: el 0 en medio», `:590`).<br>• **Idea 3:** «Leer la tabla» es la pregunta de Predice 3 resuelta con otros números.<br>• **Idea 4:** «Dos etiquetas, un puesto» es Predice 4.<br>• **Idea 5:** los dos ejemplos de la idea 5 explican AT-CONTEO y AT-ULTIMO, dos de los tres distractores.<br>La idea 1 sí se cuidó: `:144`, «Ningún ejemplo usa “le llega un caramelo” (es la predicción)». Y la decisión de Exponentes (etapa 3, tercera ronda) lo dice por escrito: «la pestaña Ejemplos se abre antes de Predice». | Lo mejor está en la app: mostrar los ejemplos de la idea k recién cuando su Predice está respondida. Mientras tanto, sacar o cambiar «Un cero en medio», «Leer la tabla» y «Dos etiquetas, un puesto», y quitar la frase de la trampa en «Del 1 al 1000». En la idea 3 el cambio de base enseña el orden de los restos por fuerza: solo el cierre por idea lo arregla. |
| M3 | 3, 5, 9 | «Sin base escrita, es 10» (regla 1, `:545`; `DN.sinBase`), frente a: idea 1, «Ahora tú» `:229`, `:292`, `:307`; ejemplos «Una base para tres» y «¿En qué bases?» (`:419`, `:429`); idea 2, consigna del juego (`:882`, «La etiqueta dice 132») y «Así se resuelve» (`:944`, «la misma etiqueta, 133») | La unidad enseña que un numeral sin base está en base 10. Después escribe numerales sin base para decir «base que no se conoce»: «¿Cuál es la menor base en la que el numeral 3021…?», «Los numerales 2031, 425 y 106…». El lector en frío se trabó justo ahí («la regla de la idea 1 decía “sin base escrita, es 10”: me confundió»). El generador lo resuelve bien: «En una etiqueta del puesto se borró la base y quedó 3021». | Escribir esos numerales con su base desconocida: 3021₍ₙ₎ y 132₍ₙ₎ (como la leyenda del juego, `:890`). También sirve «se borró la base» del generador. |
| M4 | 3 | Regla de la idea 3 (`:1313`, `N = q × n + r`) y `DD.div` (`:114`), que van en los datos de «Así se resuelve» y «Ahora tú» de las ideas 3 y 4 | **q no se dice nunca en palabras**: no está en la leyenda del juego ni en la condición de la regla ni en los datos. El lector en frío: «la letra q no está explicada». El generador sí lo trae: «N = q × n + r, con 0 ≤ r < n (q: cociente; r: resto)» (`generador.js:108`). | Copiar el texto del generador en `DD.div` y agregar «q: cociente» a la condición de la regla. |
| M5 | 13; 10 (credibilidad del resuelto) | Ejemplo «Una suma con base oculta» (`:1598`) | «D sale de pasar el 5 sumando», pero D es 11. Pasar el 5 sumando da 5n = 50, o sea n = 10. Ninguna de las 4 alternativas sale de ese error: el alumno que comprueba lo que dice el resuelto no lo entiende. Es el único error de las 2267 comprobaciones. | Cambiar D por 10 y dejar la explicación, o explicar el 11 con otro error real. |
| M6 | 3, 5 (tabla de letras, molde §0.4) | Regla de la idea 5 (`:2029`, «de a hasta z hay z − a + 1»), `DD.hasta` (`:115`) y `D.hasta` del generador (`:109`) | En toda la unidad, a es una cifra (a̅b̅c̅₍ₙ₎, «cifra oculta a»). En la idea 5, a es el primer número de un bloque. En el generador choca **dentro del mismo problema**: `acotar:cuantos` pregunta «¿Cuántos valores puede tomar a?» en (a−1)(2a)₍₇₎ y en Datos dice «De a hasta z hay z − a + 1 números» (`generador.js:688`). El lector en frío lo marcó dos veces. | Escribirlo en palabras («del primero al último hay último − primero + 1»), o con letras que no se usen en la unidad (p y u). |
| M7 | Regla 3 | Idea 5: «Lee», tarjeta 2 (`:1970`); figura y lectura del juego (`:1739`, `lineas: 'cuenta'`; `:1994`); captura `cap/claro-cel-conteo-cifras-2-juega.png` | La predicción (del 1 al 100 se imprimen 192) queda casi entera a la vista antes de preguntarla:<br>• «Lee» explica «No son 10 sino 11: se cuentan los dos de las puntas», que es el distractor AT-CONTEO (190).<br>• El juego muestra siempre «1 a 9: 9 × 1 = 9» y «10 a 99: 90 × 2 = 180», que desarman AT-BLOQUE (200).<br>Solo queda medir AT-ULTIMO (189). La propuesta (§3) creía que bastaba con que el juego no bajara de 120. | En el juego, mostrar solo el bloque que se mueve y el total: «100 a 150: 51 × 3 = 153», con los dos primeros bloques en una barra sin rótulo. «Lee» explica z − a + 1 con dos boletos sueltos que no toquen 10 ni 99. Otra salida: preguntar en Predice por un caso que el juego no muestra (del 1 al 1000). |
| M8 | 3, 4f | Leyenda del juego de la idea 3 (`:1261`, `:1262`); captura `cap/claro-cel-cambio-base-2-juega.png` | La leyenda nombra «18 cociente» y «3 resto» cuando la figura y la lectura dicen «75 caramelos sueltos: todavía no se junta nada». Esos números no están en pantalla. El lector en frío: «¿de dónde salen esos números antes de jugar?». | La leyenda solo con lo que se ve, como pide 4f («solo los símbolos que se ven en esa figura»): «cociente: lo que se juntó en la ronda» y «resto: lo que no alcanzó», sin números, o que la leyenda cambie con la ronda. |
| M9 | 13 (el paso hecho) | Ejemplos «Leer la etiqueta» (`:346`) y «Leer la tabla» (`:1111`) | En «Leer la etiqueta», el dato «la cifra de la izquierda cuenta bolsitas y la de la derecha, sueltos» es la respuesta entera. En «Leer la tabla», el dato repite los restos que la tabla ya muestra pintados, y la solución es leerlos al revés. El lector en frío: «el recuadro Datos ya me dice qué cifra es qué». | En el primero, dar solo «1 bolsita = 7 caramelos» y la convención de la etiqueta, como `DN.etiqueta`. En el segundo, sacar el dato (la tabla basta) o cambiar el ejemplo (ver M2). |
| M10 | Niveles (molde §3) | Ejemplos de nivel 3 de la idea 1: «Una base para tres», «¿En qué bases?» y «¿Cuántas están bien?» (`:418`, `:428`, `:445`) | Tres de los cinco ejemplos de nivel 3 son la misma comprobación de un paso que ya está en el nivel 1 («¿Está bien anotada?») y en el nivel 2 («¿Cuál está mal escrita?»): comparar cada cifra con la base. «¿Cuántas están bien?» repite el nivel 2 cinco veces, y el lector en frío la sintió más fácil que «Mal empacado» (nivel 2). Un problema de examen de esta idea tiene llevadas en cadena o varias rondas. Esos no pueden ir como ejemplo, por M2, porque son la predicción. | Cambiar dos de esos ejemplos por problemas de varias rondas que no sean «llega un caramelo»: «Bolsitas para 45» ya es buen modelo; otro sería el reempaque de 2 cajas, 7 bolsitas y 9 sueltos con bolsitas de 4. |
| M11 | 9; molde §7 | `app/practica.js:168` (`gen.generar(…, { unidad })`) frente a `numeracion-bases/generador.js:130` (`{ idea }`) | Es el mismo pendiente que M6 de trigonometría. El generador separa por idea (`TIPOS_POR_IDEA`), pero la app no le pasa la idea. Quien termina la idea 1 recibe base desconocida y conteo de cifras 4 de cada 5 veces. | El arreglo de la app que quedó pendiente en trigonometría. |
| M12 | 13, 9; decisiones | `catalogo/cursos/aritmetica.json:328` (`plantillas` con `numeracion`) y `plantillas/numeracion/papel.json` | La escena sigue en la pantalla Ejercicios de la unidad, con su «Lápiz y papel» de 10 problemas:<br>• **Ninguno trae datos.**<br>• p6 son capicúas, que la decisión saca de la unidad.<br>• p4 llama b a la base, y la decisión dice n.<br>• p7 enseña un atajo, «(250 + 1) · 3 − 111».<br>• p9 es base 2 a base 8 agrupando, que según la propuesta va al laboratorio.<br>• p8 es «192 cifras → 100 páginas», la predicción de la idea 5 al revés.<br>• Usa «·» y «potencia de su orden… empezando en 0».<br>La propuesta (§7) la mandaba a «Más mesas del tema». La paleta propia de la escena está aceptada hasta rehacerla; el papel no. | Sacar `numeracion` de `plantillas` de la unidad hasta rehacer la escena, o filtrar su papel: dejar p1, p2, p3 y p5 con datos y quitar p6, p7, p8 y p9. |

### Baja (estilo)

| # | Punto | Dónde | Evidencia | Corrección propuesta |
|---|---|---|---|---|
| B1 | Molde §7 | `numeracion-bases/generador.js:127` (`PAPEL`) | El papel tiene 1 problema de la idea 1 (nivel 1) y 1 de la idea 5: `cuantos-k`. No hay ninguno de «cifras del 1 al N», que es el centro de la idea 5. | Cambiar `papel-4` por `cifras` o por `hasta`, y uno de los de la idea 2 por `sucesor`. |
| B2 | 3 | Condición de la regla de la idea 4 (`:1677`) y su ecuación (`:1676`) | «Si una letra está en varios numerales, manda la base más chica» no tiene ejemplo en pantalla. «0 < a» contra «0 ≤ b» tampoco se explica. El lector en frío no lo entendió. | «La cifra a va primera: no es 0.» Y en vez de «manda la base más chica»: «una cifra de dos numerales es menor que las dos bases». |
| B3 | 13 | `DD.pot` (`:112`), en los datos de `casoValor` (`:630`) | Siempre da n² y n³, también para numerales de 3 cifras. El lector en frío preguntó para qué estaba 6³. El generador recorta bien (`D.pot(n, k)`). | Recortar como el generador. |
| B4 | 8 | `tablaDiv` (`:1016`, `filasMax: 5`); captura `capej/claro-cel-ej-cambio-base-03.png` | Las tablas de 3 divisiones salen con 2 filas vacías. El lector en frío creyó que faltaba algo. | `filasMax: ds.length`, o una sola fila vacía en Predice y Mira. |
| B5 | 13 | Ejemplo «¿Hasta qué boleto?» (`:1884`) y `casoHasta` (`:1774`) | «Hasta el 99 se gastan 9 + 180 = 189» no dice de dónde sale 180. | «9 × 1 + 90 × 2 = 189», como el generador (`:765`). |
| B6 | 5 | Idea 3: «Así se resuelve» y ejemplos con `bas2`/`num2` (verde) | La segunda base va en verde, como decidió Gerson, pero ninguna pantalla lo dice. El lector en frío: «el 7 cambia de color sin aviso». | Una línea en la leyenda del paso o en la regla: «verde: la base nueva». |
| B7 | 3, 5 | Idea 4: figuras con «₍?₎» (`bolsaF`, `:1368`; `MIRA4`) y textos con «₍ₙ₎» (Predice `:1648`, leyenda `:1634`) | Una misma etiqueta sale como 31₍?₎ en el dibujo y como 31₍ₙ₎ en la pregunta. | Usar ₍ₙ₎ también en la figura, con la n turquesa. |
| B8 | Opciones (molde §2) | Ejemplos con alternativas: «Una cifra repetida» (`:839`, D 30), «Cada cifra sube 1» (`:820`, D 49), «Juntar de 8 en 8» (`:1572`) y «Cifras con un parámetro» (`:1583`) | Esas alternativas no dicen de qué error salen. El lector en frío lo notó en dos. | Una línea por trampa, como «Con 1500 cifras». |
| B9 | Decisiones (fuera: operaciones en otras bases) | Ejemplo «Cada cifra sube 1» (`:823`) | «345₍₇₎ − 234₍₇₎ = 111₍₇₎» es una resta hecha en base 7. | Empezar por la comprobación en base 10 y decir «cada lugar suma 1: 49 + 7 + 1». |
| B10 | Medición | `casoCifras` (`:1755`, `:1757`, dos AT-BLOQUE); generador `malEscrito` (`:240`, `:243`, dos AT-CIFRA-MAYOR) y `cifras` (`:739`–`:742`, dos AT-BLOQUE y dos AT-CONTEO); `casoBases`, `casoBasesTres` y `basesTres` (`:312`, `:1806`, `generador.js:834`) | Hay códigos repetidos en una misma pregunta: la medición no distingue cuál error fue. La propuesta §0.6 ya lo criticaba. Además, el distractor AT-MENOR («da la menor base») sale escrito como «5 bases», que no es lo que escribiría quien comete ese error. | Un código por distractor (AT-SIN-UNO, AT-SIN-DOS…). AT-MENOR como «la base 5», o cambiarlo por otro error. |
| B11 | 1 (pieza) | `arit-puesto`: caramelos de las bolsitas y de los sueltos; captura `crop-lee1.png` | Los caramelos se tocan por las puntas y cuesta contarlos. El lector en frío contó «3 + 5» en una bolsita de 5, y en «Mal empacado» dijo que «se tocan por las puntas». | Separar los caramelos (paso ≥ ancho + 4) y que la prueba de la pieza lo compruebe con números. |
| B12 | Molde §5 | Ejemplos y soluciones: «36a», «37a», «10a + b», «5n + 5», «3a = 2b» (`:813`, `:842`, `:851`, `:1576`, `:1596`); `numeros-sucesiones` «11(a + b)» | La cabecera dice que se multiplica con «×» (`:18`), y la idea 2 enseña que «sin raya, ab sería a × b». En las ecuaciones el producto va pegado. Es la notación de álgebra y se entiende, pero no está presentada. | «36 × a», o una línea en la tarjeta 3 de «Lee» de la idea 2: «36a es 36 × a». |
| B13 | 5 (§5b) | Ejemplos de nivel 3: «Si a0a₍₆₎ = 185», «a̅b̅ + b̅a̅ = 154» (`:838`, `:809`) | La cantidad en base 10 que se da va en tinta, cuando el mapa de la unidad la pinta de violeta. | `cant(185)` y `cant(154)`. |
| B14 | Catálogo; propuesta §4 | `catalogo/cursos/aritmetica.json:329` (`"investigacion": null`) | Los códigos AT nuevos no están en `docs/investigacion/aritmetica-razonamiento-ideas-erroneas.md`, y la propuesta dijo que irían ahí como hipótesis. | Agregar la tabla de códigos AT-* con «hipótesis» y apuntar `investigacion` al informe. |
| B15 | 13 (pendiente de Vectores, M21) | `numeracion-bases/papel.json` | «Datos:» y «Alternativas:» siguen dentro del párrafo del enunciado. | El arreglo de `herramientas/papel-generador.js` que propuso la auditoría de Vectores. |
| B16 | Generador | `ordenar` (`generador.js:386`) | La correcta es siempre el único numeral de tres cifras que empieza en 1. Después de dos o tres problemas, se acierta sin calcular. Además, el subtipo «menor» del comentario nunca sale. | Variar la forma de la correcta: dos cifras en base alta o tres cifras que empiecen en 2. Activar «menor». |

## Lo que está bien y hay que copiar al molde

- **Cuentas sin errores en las respuestas.** De 2267 comprobaciones aparte, todas las respuestas cuadran; el único fallo
  es la explicación de un distractor (M5). Cada constante de ejemplos dice qué cuentas se revisaron, y «Así se resuelve»
  y «Ahora tú» calculan con las mismas funciones (`enBase`, `valor`, `divisiones`, `bloquesT`).
- **Un color por magnitud con su prueba** (molde §5b). `COLORES` y `ficha(m)` llevan la magnitud en cada pieza de texto,
  y `numeracion.test.js` falla si una magnitud cambia de color. Es la primera unidad que trae la prueba que pedía la
  auditoría de trigonometría. Hay que copiarla tal cual.
- **Cuatro opciones siempre.** `conCuatro` rehace el caso si dos errores dan el mismo texto, y el generador no publica
  con menos de 4. En 2000 casos no salió ninguno con menos.
- **Distractores calculados por error.** Cada opción incorrecta es el valor exacto que da su error (AT-LLEVA-UNA,
  AT-ORDEN, AT-SIGNO = n + 2m, AT-SIN-SUELTOS = n + m, AT-UNA-COTA). Su `siFuera` empieza por lo que el alumno hizo bien.
- **El juego no llega a la predicción, cuando se cuidó.** En la idea 1 no hay caja (hasta 24 caramelos con bolsitas de
  5 o más). La idea 2 nunca muestra un 0 en medio. En la idea 4 la misión halla la base y la predicción la usa en otra
  etiqueta. Cada `bien` dice el resultado de la misión, no el de la predicción.
- **La figura no da la respuesta.** Lo que se pide va con «?» en tinta: etiqueta ₍?₎, «Bolsa 13: ?», «cifras impresas:
  ?». Revisado en los 75 ejemplos y en las figuras de «Ahora tú».
- **Credibilidad.** El quipu salió porque no había fuente para «un nivel vacío es un 0» (`:586`). Los valores son de
  problema y caben en el mundo (bolsitas de 3 a 9, rifas de hasta 1000 boletos), y la historia trae fuente.
- **El generador cuida los datos mejor que la teoría.** `D.div` dice qué son q y r, `D.pot(n, k)` recorta las potencias
  que no hacen falta, y «se borró la base» no choca con la regla de la base 10. Copiarlo en la teoría (M3, M4, B3).
- **Práctica por idea y por unidad.** `TIPOS_POR_IDEA` y `NIVEL` en el generador nuevo. `TIPOS_POR_UNIDAD` en
  `numeros-sucesiones`, que en esta unidad solo da `cifras`. `grifos` y `cubos` pasaron a sus unidades. Los tipos de
  nivel 3 citan la pregunta de San Marcos de la que salen.
- **«Así se resuelve» distinto de «Ahora tú» en las cinco ideas**, con un comentario que dice qué pide cada uno. En la
  idea 4 se prueba desde la menor base porque «con una base mayor vale más», lo que justifica el método sin resolver una
  cuadrática.

## Reglas que faltan en el contrato o en el validador

| Regla | ¿Automática? |
|---|---|
| **Ninguna figura de la teoría recibe una envoltura**: en «Lee», «Mira», Predice, `resuelve` y los ejemplos, `dibujo.datos` no tiene la clave `pieza`. Además, la pieza dibuja algo distinto de su lienzo vacío: se compara su SVG con el de `datos: {}`. Habría encontrado A1. | Sí |
| **La predicción no está en la unidad antes de tiempo**: el par de la predicción (los números del enunciado y de la correcta, como «203» y «53», «19» y «201», «100» y «192») no aparece junto en un ejemplo del glosario, ni en «Lee» o el juego de esa idea. Mientras la pestaña Ejemplos no se cierre por idea, tampoco en los ejemplos de esa idea. Habría encontrado M1, M2 y parte de M7. | Sí (heurística por números) |
| **La pestaña Ejemplos de la idea k se abre con su predicción respondida** (app). Es lo único que salva una idea como el cambio de base, donde cualquier ejemplo enseña la respuesta (M2). | Sí (app) |
| **Cada letra de una regla, de una ecuación de datos o de una leyenda está dicha en palabras** en la leyenda, la condición o la línea del dato (la q de M4). Y la leyenda solo nombra números que están en la figura o en la lectura del estado inicial (M8). | Sí |
| **Tabla de letras declarada** (`def.letras = { n: 'la base', a: 'cifra', … }`). El validador rechaza una línea de datos o de regla que use una letra de la tabla con otro papel en el mismo ejercicio («de a hasta z» con a cifra; M6). | Semi (declarar la tabla es a mano; la prueba es automática) |
| **Un numeral sin base solo si es de base 10**: si la unidad dice «sin base escrita, es 10», el validador rechaza un `cif('3021')` sin subíndice en una pregunta que habla de «base» (M3). | Semi |
| **Cada alternativa incorrecta de un ejemplo se explica en el resuelto** (su letra aparece en la solución), y la explicación da ese valor cuando trae una cuenta (M5, B8). | Semi (la letra, sí; que la cuenta dé el valor, el auditor) |
| **Papel por idea**: el mapa `PAPEL` del generador cubre cada idea con su tipo de nivel 1 o 2 central (B1). Y una plantilla en `plantillas` de una unidad con `calidad: 2` lleva `datos` en todo su papel o sale de la unidad (M12). | Sí |
| **Un código de error por distractor en cada pregunta** (B10). | Sí |

## Correcciones (17 nov)

Fase 8 del método (`docs/metodo/unidad/6-correcciones.md`). Fuentes: esta auditoría y el lector en frío
(`rutinas/frio/aritmetica.numeracion.md`). Alcance: `contenido/teoria/aritmetica/numeracion.js` y su test, las piezas
`arit-puesto` y `arit-talonario` con sus tests, `plantillas/numeracion-bases/` y el tipo `cifras` de
`plantillas/numeros-sucesiones/`. No se tocaron `app/`, `nucleo/teoria.js` ni la escena vieja `plantillas/numeracion/`
(pendiente de Gerson). Cada corrección tiene una prueba nueva en `numeracion.test.js` (bloque «Fase 8»); corridas contra
la versión anterior del archivo, fallan las nueve (comprobado con una copia en el scratchpad). Las respuestas que
cambiaron se recalcularon aparte, sin el código de la unidad: `correcciones-numeracion/cuentas.js` del scratchpad, 78
cuentas, todas cuadran.

| # | Qué se hizo | Prueba nueva |
|---|---|---|
| A1 | `montonF(4, 75).datos` en la tarjeta 1 de «Lee» de la idea 3: ahora se ven los 75 caramelos. | Ninguna figura (Lee, juego, Predice, revelar, Mira, ejemplos, «Así se resuelve», «Ahora tú») recibe un `datos` con clave `pieza`, y cada una dibuja algo distinto de `dibujar({})`. |
| M1 | Glosario sin predicciones ni misiones: «orden» (120₍₃₎), «valor posicional» (23₍₅₎, sin el 0 en medio), «descomposición polinómica» (231₍₄₎ = 45), «cociente» y «resto» (23 entre 5; 30 en bolsitas de 4), «cambio de base» (17 = 25₍₆₎; 38 = 212₍₄₎), «base desconocida» (32₍ₙ₎ = 23; 41₍ₙ₎ = 21), «acotar» (52₍ₙ₎), «bloque» (del 100 al 999), «cantidad de cifras» (del 1 al 60, 111; 50 = 200₍₅₎). Apareció además «numeral»: «24 y 40₍₆₎» era la misión de la idea 1; va 22 = 42₍₅₎. Ojo: la corrección que proponía la auditoría para el cambio de base, «41 = 1103₍₃₎», está mal (41 = 1112₍₃₎); no se usó. | Los números de cada predicción y de cada misión (44₍₅₎ y 100₍₅₎; 203₍₅₎ y 53; 19 y 201₍₃₎; 31₍ₙ₎ y 25; 13 y 11 con 8; 100 y 192; 40₍₆₎ y 24; 132 y 56; 75 y 1023₍₄₎; 23, 17 y 7; 492 y 200) no van juntos en el glosario, en «Lee» de esa idea o de las anteriores, en el juego (solo la predicción) ni en ningún ejemplo de la unidad. |
| M2 | «Un cero en medio» → «Una caja, una bolsita» (112₍₃₎ = 14); en los niveles 1 y 2 de la idea 2 tampoco quedan otros 0 en medio (2013₍₄₎ → 2113₍₄₎ = 151; 205₍₆₎ → 215₍₆₎ = 83). «Leer la tabla» → «Hasta que dé 0» (cuántas divisiones para pasar 50 a base 4). «Una ecuación corta» era 13₍ₙ₎ = 11 → n = 8, la predicción al revés: va 15₍ₙ₎ = 12 → 7. «Dos etiquetas, un puesto» → «Una caja y dos sueltos» (102₍ₙ₎ = 27 → 5). «Boletos de dos cifras» («No son 89») → «Boletos de tres cifras» (del 1 al 250: 151). «Del 1 al 1000» → «Del 1 al 1200» (3693), sin la trampa del boleto que abre el bloque. De paso, en «Ordenar tres pedidos» la frase «la cifra más chica al frente» era falsa (141₍₅₎ empieza en 1): se corrigió. | La misma de M1, y que los niveles 1 y 2 de la idea 2 no tengan un 0 entre otras cifras. |
| M3 | Base desconocida con ₍ₙ₎: «Ahora tú» de la idea 1 (menor base, tres numerales, cuántas bases), los ejemplos «Una base para tres», la consigna de la idea 2 (132₍ₙ₎), «Así se resuelve» de la idea 2 y «Lee» y la consigna de la idea 4 (23₍ₙ₎). «¿En qué bases?» salió por M10. | En los ejemplos, 400 semillas de «Ahora tú» y 40 de «Así se resuelve», ninguna pregunta que hable de la base trae las cifras de un numeral sin su base; ninguna consigna dice «la etiqueta dice 132» sin base. |
| M4 | `DD.div` dice «(q: cociente; r: resto)»; en la regla de la idea 3, una llave con «cociente» bajo la q. Se aprovechó para la regla de la idea 5: «p: el primero; u: el último; k: cifras de cada uno». | Toda línea de datos o de regla con «q ×» dice «cociente», y toda con «u − p» dice qué son p y u. |
| M5 | D de «Una suma con base oculta» pasa de 11 a 10 (5n = 50); la explicación nombra también A (50) y B (40). | D es (45 + 5) / 5 y la solución trae lo que dan A y B. |
| M6 | «De a hasta z hay z − a + 1» → «Del primero, p, al último, u, hay u − p + 1» en la teoría (datos, regla, «Lee», «Así se resuelve», un `siFuera`), en `numeracion-bases` (`D.hasta` y dos explicaciones) y en el recuadro de `cifras` de `numeros-sucesiones`. `papel.json` regenerado. | Teoría: ningún dato ni regla usa a como extremo. Generadores: 400 semillas sin «z − a» ni «de a hasta» (datos, solución, explicaciones). |
| M7 | El juego de la idea 5 solo da hecha la cuenta del bloque que se mueve («100 a 150: 51 × 3 = 153»); los bloques de una y dos cifras quedan en las barras sin su cuenta. Opción nueva `soloUltimo` en `arit-talonario`, con su prueba. La lectura dice «150 boletos: 342 cifras; del 100 al 150, 51 × 3 = 153». «Lee» ya explicaba u − p + 1 con el 20 y el 30, que no tocan el 10 ni el 99 (lo que pedía la auditoría). La figura de «Lee» mostraba el boleto 200, la respuesta de la misión: ahora es del 1 al 150, y el texto lo dice (el lector preguntaba de dónde salía el 200). | El juego no muestra «9 × 1», «90 × 2», «= 180» ni 189 en ningún caso; la pieza con `soloUltimo` dibuja una sola línea. |
| M8 | La leyenda de la idea 3 dice «cociente: lo que se juntó en la ronda» y «resto: lo que no alcanzó, una cifra», sin el 18 ni el 3. La de la idea 5 cambió con el juego (sin el 492 ni el «90 × 2»). | Cada número de una leyenda se ve al empezar el juego (figura, lectura o misión). |
| M9 | «Leer la etiqueta» da solo la convención de la etiqueta (`DN.etiqueta`); «Leer la tabla» salió (M2). | Los datos de ningún ejemplo traen lo que pide su respuesta ni «la izquierda cuenta…» o los restos en orden. |
| M10 | «¿En qué bases?» → «Reempacar dos órdenes» (2 cajas, 5 bolsitas y 7 sueltos de 4 → 323₍₄₎, con tres trampas calculadas: 263₍₄₎, 223₍₄₎, 257₍₄₎); «¿Cuántas están bien?» → «Una caja para 30» (la bolsita más grande con caja: 5, 110₍₅₎). En base 4 y no en 5, para no repetir la predicción. | Todo nivel 3 de la unidad trae al menos una cuenta, y en la idea 1, cuatro de los cinco tienen tres pasos o más. («Cifras con un parámetro» no traía ninguna: se le agregaron.) |
| Lector | `glosarioSin: ['muestra']` (el verbo no es el término de Estadística). | Se comprueba que está. |

**Bajas que se hicieron de paso** (eran de una línea): B2 (la condición de la regla de la idea 4 y «Dos bases a la vez»
ya no dicen «manda la base más chica»), B3 (`DD.pot(n, k)` recorta n³ en los numerales de tres cifras), B4 (la tabla
sin filas vacías), B5 («9 × 1 + 90 × 2 = 189» en los dos ejemplos y en «Ahora tú»), B6 («verde: la nueva» en la regla
de la idea 3), B7 (las figuras de la idea 4 dicen 31₍ₙ₎, con la n turquesa, como el texto), B8 (los distractores de
«Una cifra repetida», «Cada cifra sube 1», «Juntar de 8 en 8» y «Cifras con un parámetro»), B9 («Cada cifra sube 1» ya
no resta en base 7) y B13 (185 y 154 en violeta).

**Pendiente, con la razón:**
- **M2 en la idea 3 y el resto de la idea 5: necesita `app/`.** Todo ejemplo de cambio de base enseña el orden de los
  restos, y los de «¿Hasta qué boleto?» y «Con 1500 cifras» dan las 189 cifras hasta el 99. Solo lo arregla que la app
  abra los ejemplos de la idea k después de responder su Predice (`app/teoria.js:338` y `:880`). Recomendación para
  Gerson: hacerlo para todas las unidades, porque la regla 3 lo pide y la decisión de Exponentes ya lo nota.
- **M11 (app):** `app/practica.js:168` debe pasar `{ idea }` a `generar`; el generador ya separa por idea.
- **M12 (escena vieja `plantillas/numeracion/`):** sin tocar, pendiente de la decisión de Gerson en la mesa. Recomendación:
  pasarla a «Más mesas del tema» y sacarla de `plantillas` de la unidad hasta rehacerla. Su papel trae capicúas, un
  atajo, la base b y la predicción de la idea 5 al revés.
- **Decisión de Gerson, M7:** el juego ya no da hechos el 9 y el 180, pero el alumno todavía puede restar: 342 − 153 =
  189. Si se quiere medir solo con lo que el juego no muestra, la otra salida es preguntar en Predice por el 1 al 1000.
  Recomendación: dejarlo así; la resta ya es razonar, no leer.
- **Decisión de Gerson, M10:** «Reempacar dos órdenes» enseña la llevada en cadena, que es la idea de Predice 1, con
  otra base y sin «llega un caramelo». «Hasta la caja» (nivel 2) ya lo hacía. Recomendación: dejarlo, porque es el
  problema de examen de la idea.
- **Bajas sin hacer:** B1 (papel por idea), B10 (un código por distractor), B11 (separar los caramelos en `arit-puesto`),
  B12 (36a sin «×»), B14 (códigos AT en el informe de investigación), B15 (arreglo de `herramientas/papel-generador.js`)
  y B16 (`ordenar` del generador).

## Correcciones de la ronda 2 del lector (18 nov)

Fuente: `rutinas/frio/aritmetica.numeracion.md`, sección «Ronda 2». Método: `docs/metodo/unidad/6-correcciones.md`.
Alcance: la unidad y su test, `arit-puesto`, `arit-talonario` (con su test) y `plantillas/numeracion-bases/` (generador,
test y `papel.json` regenerado). No se tocaron `app/` ni `nucleo/teoria.js`. No son hallazgos: que la captura muestre
solo el primer paso (en el código los pasos siguientes sí lo resuelven), el número del circulito y el subrayado del
glosario. Cada corrección tiene su prueba: bloque «Ronda 2» de `numeracion.test.js` (8 pruebas) y dos en
`arit-talonario.test.js`. Corridas contra la versión anterior (copia en el scratchpad, `numeracion-r2/antes/`), fallan
las 10. Las cuentas nuevas o cambiadas se rehicieron sin el código de la unidad (`numeracion-r2/scripts/cuentas-r2.js`):
30 de 30 cuadran.

| Hallazgo del lector | Qué se hizo | Prueba |
|---|---|---|
| «Solo ceros y unos»: no dice por qué los restos van del último al primero ni que en base 2 los lugares valen 1, 2, 4, 8 | Dato nuevo `DD.restos` («el primer resto es la cifra de la derecha (lo que quedó suelto); el último resto, la de la izquierda») y los lugares 4 = 2 × 2 y 8 = 2 × 2 × 2. La solución dice por qué: el primer resto quedó suelto y va a la derecha; el último es el orden más grande. Cierra con 1 × 8 + 1 × 4 + 0 × 2 + 1 = 13. `DD.restos` va también en los demás ejemplos de la idea 3 que escriben el número leyendo los restos. | R2 huecos 1 |
| «Una cifra repetida»: «36a» sin «×», 36 = 6² sin decir y salto a a = 5 | «En base 6 los lugares valen 6 × 6 = 36, 6 y 1»; a0a₍₆₎ = a × 36 + 0 × 6 + a = 37 × a; 37 × a = 185, a = 185 ÷ 37 = 5. En Datos, 6² = 6 × 6. De paso (B12 del auditor), ningún ejemplo pega un número a una letra: «Cifras cruzadas», «Al revés en otra base», «Juntar de 8 en 8» (y 195 ÷ 65), «Una suma con base oculta», «Menos de 30» y «Cifras con un parámetro» escriben el «×». | R2 huecos 2 |
| «(a − 1)(2a)₍₇₎»: nada dice que cada paréntesis es una sola cifra | Dato: «Bajo la raya, cada paréntesis es una sola cifra: (2a) es la cifra 2 × a». | R2 huecos 3 |
| «Hasta que dé 0» no escribe el número en base 4 | Paso nuevo: los restos del último al primero, 3, 0 y 2, con la vuelta 3 × 16 + 0 × 4 + 2 = 50; la respuesta dice 50 = 302₍₄₎. La frase de caramelos sin caramelos («junta de a 4…») pasa a «Se divide 50 entre 4; después, el cociente 12…». | R2 huecos 4 |
| «¿Hasta qué boleto?» dice «del 100 al 114» antes de la cuenta | Primero 99 + 15 = 114 («el último es 99 + 15»), después la comprobación 114 − 100 + 1 = 15. | R2 huecos 4 |
| «Leer la etiqueta»: Datos no dice que la base es lo que lleva cada bolsita | `DN.etiqueta` termina en «la base: los caramelos de cada bolsita» (también en «Anotar la etiqueta» y «Dos puestos, un pedido»). | R2 huecos 5 |
| La raya sobre a̅b̅c̅ sin explicar en la regla | La condición de la regla de la idea 2 empieza «La raya: a, b y c son cifras, no un producto»; la de la idea 4, «Con raya, a y b son cifras». («Lee» de la idea 2 ya la explicaba en la tarjeta 3.) | R2 símbolos |
| N mayúscula junto a n | Otra letra, dicha en palabras: la regla de la idea 3 dice «Para pasar un número D a base n» y «D = q × n + r»; los datos, «D = q × n + r … (D: el número; q: cociente; r: resto)», también `D.div` del generador. Con la palabra «número» la fórmula no cabía en una línea a 390 px. La regla de la idea 4 dice «= número conocido». N queda solo como último boleto en la idea 5, y su regla ya no la nombra. | R2 símbolos |
| «caja» y «cajón» de golpe | Predice 1: «En su puesto, 5 bolsitas llenan una caja». «Lee» 1 de la idea 3: «junta 4 bolsitas en una caja, y 4 cajas en un cajón» (antes «y así»). Leyenda del juego de la idea 3: el aro punteado («los que se juntan en la ronda siguiente»), que el lector vio como «algo verde». | R2 símbolos |
| «acota» | Regla de la idea 4: «la base acota las cifras ocultas: cada una es menor que n». Ejemplo de una letra en dos bases en la ecuación de la regla: 3a₍₄₎ y a2₍₆₎ dan a < 4 y a < 6. | R2 símbolos |
| «la primera cifra de un numeral no es 0» | Regla de la idea 1: «Con varias cifras, no se empieza con 0: 05 es 5». `DN.primera` lleva el mismo ejemplo. | R2 símbolos |
| «a la misma escala», «boletos: un tramo por bloque: igual cantidad de cifras» | Leyenda: «boletos: cada tramo, los boletos de un bloque» y «cifras impresas: cada tramo, las cifras que gasta ese bloque». «Lee» 1 de la idea 5 dice qué es cada tramo de la barra (el lector no lo sabía). | R2 símbolos |
| «puntas» | En toda la unidad, «el primero y el último» (Luma, «Lee», un `siFuera`, «Así se resuelve» y un ejemplo). | R2 símbolos |
| «en base n» en la regla de la idea 5, sin ejemplo | Línea nueva en la ecuación: «en base 5, tres cifras: de 100₍₅₎ = 25 a 444₍₅₎ = 124»; la condición dice «En los boletos, n = 10» y «El último bloque puede quedar incompleto». | R2 símbolos |
| «bolsa» contra «bolsita» | El envase cerrado se llama **paquete** en toda la unidad (idea 4 entera, «Leer la etiqueta», «Juntar de 8 en 8»), en el texto alternativo de `arit-puesto` y en el generador. «Lee» 1 de la idea 4 dice que adentro van bolsitas y sueltos. | R2 símbolos |
| La segunda base en dos verdes; el verde sin leyenda | Un solo verde (`c-d`) para la segunda base, también en la tabla: en «Así se resuelve» de la idea 3 la columna «entre» y el divisor van en verde (`tablaDiv(…, { segunda: true })`; antes, turquesa). Se dice dónde se ve: ejemplo en la regla, 21₍₅₎ = 11 = 23₍₄₎ con el (4) en verde, y la condición «la nueva, en verde»; el paso «¿Qué me piden?» y los cuatro ejemplos entre dos bases lo repiten. | R2 colores |
| «Del 100 al 150»: el 100 sin color y el 150 en violeta | Los dos extremos dados van en violeta, en el texto y en el dibujo: el primer boleto del talonario se pinta como el último cuando no es el 1. Igual en «De un boleto a otro», «Desde el boleto 45» y «Así se resuelve». | R2 colores; ronda 2 del talonario |
| La «a» en tinta en el enunciado y naranja después | Todos los enunciados de ejemplos nombran la cifra con su naranja (`cif('a')`): «La cifra del medio», «Dos bases a la vez», las dos «borrosas», «Juntar de 8 en 8», «Cifras con un parámetro», «Cifras cruzadas». | R2 colores |
| El 6 de «6 × 6» sin color | En «Una caja para 30» y «Bolsitas para 45», la base (6, 5, 7) en turquesa en «bolsitas de 6» y en «6 × 6». | R2 colores |
| Dos ejemplos «La cifra borrosa» | El de nivel 2 (2a3₍₅₎) se llama «La cifra del medio». Ningún título se repite. | R2 colores |
| Dibujos que solo repetían el enunciado | «Leer la etiqueta» y «La cifra del medio» quedan sin dibujo. Con el último boleto pedido, `arit-talonario` ya no escribe el enunciado bajo el dibujo: dibuja la barra de las cifras impresas (el dato, en naranja) partida en 9, 180 y lo que queda, con «1 a 9», «10 a 99» y «100 a ?». Los anchos salen de las cifras, no del último boleto. Vale para «¿Hasta qué boleto?», «Con 1500 cifras» y «Ahora tú». | R2 huecos 5; ronda 2 del talonario |
| El deslizador que arranca en 4 | Consignas de las ideas 2 y 4: «desde 4: con 3, no existiría la cifra 3». Idea 1: «bolsitas iguales, de 5 a 9 caramelos». | R2 dibujos y controles |
| La columna «va en» vacía en Mira | Cada «va en» se llena con su fila: en el paso 1 ya dice «sueltos». El paso 4 dice «El primer resto va a los sueltos; el último, a las cajas». | R2 dibujos y controles |
| Regla de la idea 2: letrero «1 bolsita = 5» con etiquetas en n, y «b × n» bajo un lugar vacío | El último paso de «Mira» (la figura de la regla) dice «1 bolsita = n caramelos» y «1 caja = n bolsitas» y dibuja una caja, una bolsita y un suelto con a × n², b × n y c × 1. La ecuación agrega n² = n × n. | R2 dibujos y controles |
| Otros, de una línea | «Lee» 1 de la idea 1 dice qué es n («Lo que lleva cada bolsita se llama n; aquí, n = 5»). El juego de la idea 2 escribe la caja como 1 × 4 × 4. «Cifras en base 3» trae a̅b̅₍ₙ₎ en Datos (usaba 10₍₃₎). 40₍₆₎ va como numeral en «La cifra borrosa». | (validador y pruebas de siempre) |

**Pendiente, con la razón:**
- **App (`app/`):** «Prueba 3 casos distintos» no dice qué cuenta como caso distinto (el lector preguntó si basta mover un
  poco el control). Es texto de `app/teoria.js`.
- **Decisión de Gerson, el verde:** el lector llama «verde azulado» al turquesa de la base y «verde oliva» al de la segunda
  base. Ahora la segunda base tiene un solo verde y se dice dónde va, pero los dos colores siguen pareciéndose de nombre.
  Si vuelve a confundir, la salida es otra marca para la segunda base (subrayado o un rótulo «base nueva»), no otro color:
  la paleta de §5b no tiene otro libre junto al naranja.
- **Predice de la idea 4** dibuja un solo paquete aunque habla de dos (el lector lo notó). Dibujar dos paquetes pide
  cambiar `arit-puesto` (hoy dibuja un solo `cerrado`); queda para cuando se rehaga la pieza.
- **«Primera y última cifra»** (idea 3) no lleva `DD.restos` a propósito: el dato respondería la pregunta. La solución
  explica por qué con «lo que queda suelto».
- Quedan las bajas sin hacer de la primera ronda (B1, B10, B11, B14, B15, B16).
