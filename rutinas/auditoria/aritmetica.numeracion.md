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
