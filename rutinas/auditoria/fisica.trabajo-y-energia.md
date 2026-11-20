# Auditoría de contenido: «Trabajo, energía y potencia» (fisica.trabajo-y-energia)

20 nov 2026. Auditor externo con criterio delegado (`docs/metodo/unidad/cierre-delegado.md`; fases 7 y 8), que no
escribió la unidad. Contrato: `docs/plan-calidad.md` §3. Vara: `docs/molde-unidad.md` §10. Reglas automáticas:
`docs/metodo/unidad/reglas-validador.md` y las listas «Lo que encontraron los auditores» (Etapas 5 y 6) y «Lo que salió
al cerrar la Etapa 7» de `docs/metodo/unidad/etapa-delegada.md`. Decisiones: `docs/etapa8/propuesta-fisica.md` (§9 y
«Decisiones nuevas de las fases 2 a 5»). Lo que vieron los dos lectores en frío está en
`rutinas/frio/fisica.trabajo-y-energia.md`; aquí se cita cuando el código lo confirma o lo agrava.

**Qué se revisó.**
- La teoría `contenido/teoria/fisica/trabajo-y-energia.js` (v0.3.0, sin `calidad: 2`): las 6 ideas con sus 7 momentos,
  los 90 ejemplos, «Ahora tú» y «Así se resuelve» (400 semillas de cada uno por idea), el glosario (16 términos), las 3
  mesas y la tabla de letras; su prueba `trabajo-y-energia.test.js`.
- La pieza `nucleo/kit/piezas/fis-estatica.js`: el bloque de Energía es aditivo (maleta, barra-e, tobogán, sentado,
  maceta, edificio, motor y `enTobogan`); los objetos de Estática y Dinámica no cambian. No se tocó: lo que falla está en
  cómo la usa la unidad. `fis-estatica.test.js`, `fis-estatica-dinamica.test.js` y `fis-estatica-energia.test.js` en
  verde antes y después.
- La práctica `plantillas/fis-energia/` (18 tipos con `TIPOS_POR_IDEA`, sobre `plantillas/energia/motor.js`), su
  `casos.json` y su `papel.json`; las escenas viejas `energia` y `energia-potencia` (las dos con `"rehacer": true`).
- La prueba del curso: `fis-31` y `fis-32` (reserva) en `catalogo/pruebas/fisica.json`.
- La app a 390 px con `--entera` (servidor propio en el puerto 4456): los 42 momentos y las 90 tarjetas, antes
  (`scratchpad/e8-cierre-te/lector/`, 132 capturas más 18 del lector, ninguna repetida por md5) y después
  (`…/despues/`).

**Cuentas** (scripts propios en `scratchpad/e8-cierre-te/cuentas/`: de la unidad solo leen el texto que ve el alumno, las
opciones y, en las gráficas F–x, los puntos de la figura; no usan las fórmulas de la unidad, ni
`plantillas/energia/motor.js`, ni los scripts del autor):
- `fisica.js`: cada trabajo como suma de F⃗ · Δx⃗ por tramos, con el signo que sale del ángulo entre la fuerza y el avance
  (peso, normal, rozamiento y la mano o la cuerda desde un DCL propio: N = m · g − F · sen θ con la cuerda inclinada,
  N = m · g · cos θ en la rampa); el collarín de la polea integrando la tensión con su ángulo, que cambia en cada tramo; la
  energía cinética como el trabajo de una fuerza constante que lleva el cuerpo de v₀ a v, sumado paso a paso; la
  potencial gravitatoria como menos el trabajo del peso desde la referencia, con dos referencias distintas (el ΔE sale
  igual); la elástica como área bajo F = k · x por trapecios; cada conservación integrando el movimiento (Verlet, paso de
  10⁻⁵ s): la rampa recta de 30° y de 53° y una curva y = h · (1 − s)², las tres con la misma rapidez abajo; el bloque contra
  el resorte, el resorte vertical que se suelta, el lanzamiento hacia arriba y los botes, cada uno integrado; cada caso con
  rozamiento integrando a = g · sen θ − μ_k · g · cos θ a lo largo de h / sen θ (el calor, μ_k · N · d); el μ_k de una
  frenada por bisección sobre la distancia integrada; la potencia como F · v con F del DCL a lo largo de la cuesta.
- `verificar.js`: **4 800 casos** (400 semillas × 6 ideas × «Ahora tú» y «Así se resuelve») y **6 900 distractores**,
  cada uno contra el valor del error que nombra su código. Antes de corregir, fallaban **22 casos** (A2, abajo) y un caso
  repetía otro (M4); cada situación se comprobó posible: ninguna normal negativa, toda cuerda inclinada vence el
  rozamiento, toda caja que «baja deslizando» tiene μ_k < tan 37°, los dos tramos ásperos dejan pasar el primero.
- `ejemplos.js`: los **90 ejemplos** con el mismo camino y, en los 30 de nivel 3, las **112 alternativas incorrectas**
  contra el error que nombra el resuelto: cuadran las 90 respuestas; **dos explicaciones no daban su valor** (M2).
- `practica.js`: **2 400 problemas** de `fis-energia` (400 semillas por idea) y **4 565 distractores**: todo cuadra. Los
  22 casos de `casos.json` pasan su prueba; el papel (8), a mano: cuadra.
- Las 6 predicciones con sus distractores (0/500/−500 J; 360/180/90 J; baja 120 J desde la vereda y desde la azotea;
  igual en los dos toboganes, √80 ≈ 8,94 m/s; 36 J contra 46,5 J en las rampas de 37° y 53°; 625/400/500/600 W) y las 6
  misiones (40 N a 37°; 30 N por 3 m; balcón a 9 m desde la azotea; 1,8 m; 5 m con μ_k = 0,3; 40 s): un solo caso de la
  grilla cada una y ninguna cumplida al abrir.
- `fis-31` y `fis-32`, sus dos formas con sus tres errores: cuadran (180, 175 J; 8 y 6 m/s) y no son casos de un
  ejemplo, de «Ahora tú» ni del juego.
- **Cantidad de movimiento:** ningún texto de la unidad, la práctica ni el papel nombra la cantidad de movimiento, el
  impulso, un choque ni la restitución; los botes se miran solo por el porcentaje de energía.
- **Convención del examen:** todo Datos con 37° o 53° dice «(convención del examen)»; también la leyenda del juego 1.
  Faltaba en «Mira» de la idea 5 (M5).
- **Las predicciones:** la de los toboganes dice que no hay rozamiento (pregunta y Datos); la de las dos rampas decía
  «los mismos tablones», sin decir que eso es el mismo μ_k (M6).
- **Colores:** cada trabajo y cada energía potencial con el de su fuerza (W_peso y E_PG carmín, W_F y E_PE naranja, W_f y
  el calor turquesa, W_N violeta), como en Dinámica; la prueba de la unidad lo comprueba por el campo `m` de cada ficha.
  Dos sitios en tinta: «W_f = −24 J» en «Mira» de la idea 5 y la W de la regla de potencia (B4).
- **Figuras:** los DCL que se piden (1.9, 1.11, «Ahora tú» y «Así se resuelve» del rozamiento con cuerda inclinada) dicen
  «sin escala» y llevan cada fuerza con su color. Dos figuras de botes estaban a escala y daban la respuesta (M3).
- Validador con `calidad: 2` simulada (`Teoria.problemas`, 60 y 400 semillas): **0 problemas**, antes y después. Reglas
  del papel con la marca simulada (comando de la Etapa 7) en `fis-energia`, `energia` y `energia-potencia`: limpias.
  Ninguna de las faltas de abajo la ve una regla de hoy.

## Hallazgos

### Alta (el alumno no puede resolver o aprende algo falso)

| # | Punto | Dónde | Evidencia | Corrección propuesta |
|---|---|---|---|---|
| A1 | 13 | Datos de 4.3, 4.8, 4.14, 5.8, 5.12, 5.14, 5.15, 6.8 y de «Ahora tú» y «Así se resuelve» de conservación y rozamiento; 6.11, 6.14 y el tractor de «Ahora tú» y de la práctica | El resuelto usa g = 10 m/s² y los Datos no lo dan (lector B: 7 tarjetas y 4 pantallas). En la cuesta, F = m · g · sen 37° + μ_k · m · g · cos 37° sale sin que los Datos digan que el peso tira m · g · sen θ rampa abajo ni que a rapidez constante la fuerza neta es cero (lector B, tarjeta 18: «con lo que dan no sabría armarla»). | g en todo Datos que nombra el peso o m · g; una línea de la cuesta con la normal y la parte del peso, y «la fuerza neta es cero» con P = F · v. |
| A2 | 13; igualdad falsa | «Ahora tú» de la idea 5, lo que sube por la rampa áspera (22 de 400 semillas) | μ_k = 0,375 se escribe «0,38»: con lo que el alumno lee, 12 m/s da 4,78 m (no 4,8 m) y 6 m/s da 1,19 m (no 1,2 m); los dos distractores tampoco cuadran. | Fuera 0,375 (entra 0,6). |

### Media (el alumno se traba o duda)

| # | Punto | Dónde | Evidencia | Corrección propuesta |
|---|---|---|---|---|
| M1 | 13 (una sola forma) | `D.trig` (fracciones) contra la leyenda del juego, los pasos y las soluciones (decimales) | «cos 37° = 4/5» en Datos y «· 0,8» en la cuenta de al lado (lector A). | Decimales en todos los Datos (teoría y práctica). |
| M2 | Distractores (Etapa 5, 2) | 5.13 A y 6.14 B | 5.13: «A multiplica por la altura en vez del largo» da μ_k · 8 · 3 = 12, μ_k = 0,5, y la alternativa dice 0,4. 6.14: «B usa todo el peso» da (500 + 100) · 2 = 1200 W, y la alternativa dice 1000 W (el peso entero sin rozamiento). | 5.13 A = 0,5; 6.14 B = 1200 W, con su explicación entera. |
| M3 | Figuras (Etapa 5, 5) | 5.4 y 5.9 (`figBotes`) | Las alturas que se piden se dibujan a escala junto a la dada: 1,5 m al lado de 2 m; 4 m y 3,2 m al lado de 5 m. Se miden en la figura. | La altura que se pide no se dibuja: solo su rótulo. |
| M4 | Repetición (Etapa 6, 15) | «Así se resuelve» de la idea 4 y «Ahora tú» de la idea 2 | La rampa sin rozamiento de 4,05 m está en las dos listas de la idea 4; «Ahora tú» de la idea 2 da la pelota de 0,4 kg de 5 a 15 m/s, que es el ejemplo 2.13 (2 de 400). | 8,45 m en vez de 4,05 m; el caso del ejemplo, fuera. |
| M5 | 13 (convención) | «Mira» de la idea 5 | «N = 20 · 0,8 = 16 N» y «desliza 5 m» sin decir que 0,8 es cos 37° ni de dónde salen los 5 m (lector B). | «20 · cos 37°» y «cos 37° = 0,8, convención del examen» en el paso; la caja de 2 kg y μ_k = 0,3 escritos. |
| M6 | Predice | Predice de la idea 5 | Datos: «Los tablones son los mismos en las dos»; no dice que eso es el mismo coeficiente de rozamiento. | «… el mismo coeficiente de rozamiento». |
| M7 | 10 (credibilidad); 3 | Idea 3 (juego, Predice, Lee) y 1.13 | «1.er piso» para el balcón a 3 m: en el Perú el primer piso es la planta baja (lector A); en la Predice hay dos «h = 0» sin decir cuál es cuál. 1.13 «deja un saco en cada uno de los tres primeros pisos» tiene el mismo problema. | Los balcones por su altura («a 3 m», «a 6 m», «a 9 m»); «h = 0: vereda» y «h = 0: azotea»; las paradas de 1.13 por su altura. |
| M8 | 7; igualdad | Juegos 4, 5 y 6 y la mesa «rampa» | El control «Avance» muestra 0,17 mientras el dibujo y la lectura usan 0,25 (redondeo a cuartos): con 0,17 la columna dice 720 J de 960 J (lector B). El nombre «Avance» no dice qué mide. | Dibujo y lectura con las dos cifras que muestra el control; «Parte del camino (0 arriba, 1 abajo)». |
| M9 | 3 | Lee y juego de la idea 4 | La columna escribe «h = 3,2 m» (la altura del tobogán) junto a la energía de la altura de ahora: 30 · 10 · 3,2 = 960 ≠ 720 J (lector B). | «aquí, a 2,4 m»: la altura de ahora. |
| M10 | Pasos (molde §3) | 4.8, 5.8, 5.13, 5.14 y 5.15 | «Sin la masa, que se cancela: v² = 2 · 10 · 0,45» salta ½ · m · v² = m · g · h; «por kilo» sin decir qué es; «0,25 · 8 · 5» con un 8 que nadie explica (lector B). | El paso que falta y «la masa se cancela: se cuenta por cada kilo», con la normal por kilo escrita. |
| M11 | 2, 12; 7 | La regla de las ideas 2 y 3 | Idea 2: la gráfica F–x no dice de qué cuerpo es ni se amarra a W_neto = cambio de E_C. Idea 3: el dibujo es el resorte y el texto solo habla de gravedad; k no se da (lector A). | Rótulo «carrito: W_neto = 80 J, gana 80 J de E_C» y eje «F neta»; el resorte en el texto de la regla y «k = 400 N/m» en el dibujo. |

### Baja (estilo)

| # | Punto | Dónde | Evidencia | Corrección |
|---|---|---|---|---|
| B1 | Rótulos | 1.14 y 2.15 («4·m»), 3.3 y 3.8 («x = 0,2·m»), 5.3, 5.8, 5.15, 6.3, 6.14 | El rótulo de una cota sin lugar queda sobre su línea (la pieza pone un halo y queda un punto); «v₀ = 10 m/s» y «v = 2 m/s» cruzados por la rampa; «f = 30 N» pegado a «papas» (lector B). La prueba de rótulos no lo ve: mira rótulo contra rótulo, no contra línea. | Más alto el lienzo; las rapideces arriba, como texto; el costal más adentro. |
| B2 | Figuras | 3.4 y 3.8 | Con 10 cm de compresión, el bloque toca la línea del largo natural y el resorte parece sin comprimir (lector B). | Bloque de 36 px y compresión dibujada de 56 px o más. |
| B3 | Figuras | 4.14, Predice 3, Mira 3, juego 2, «Así se resuelve» 2 y 3 | B y los 2,4 m sin marcar; «despuéscae»; «antes después» pegados; «F = 10 N» entre dos flechas; «f = 20 N» sobre la pierna; la altura de la mesa sin cota (lectores A y B). | Cada uno movido o marcado. |
| B4 | Colores | «Mira» de la idea 5, la regla de la idea 6 | «W_f = −24 J» en tinta; la W de P = W/t en tinta y «W = 5000 J» naranja en el juego (lector B). | La W de la regla en naranja; la de Mira queda. |
| B5 | Notación | Juego 6 | La W del trabajo y la W del watt juntas (lector B). | La leyenda de P dice «250 W = 250 J/s». |
| B6 | DCL | 2.5, 2.6, «Así se resuelve» de la idea 2, Mira 2 | Figuras de trabajo neto con F⃗ y f⃗ y sin peso ni normal; la decisión 14 de la propuesta pide el DCL completo donde se piden todas las fuerzas. | Queda (piso horizontal: no trabajan; el texto de 2.5 lo dice). Gerson decide. |
| B7 | Figuras | 2.8 | Sin dibujo (lector B); la pieza no tiene bicicleta. | Queda. |
| B8 | Repetición | «Ahora tú» de la idea 4 | El tobogán de 0,45 m da los 3 m/s del columpio (4.8), otra situación. | Queda. |
| B9 | Práctica | `fis-energia`, `epe` con la x pedida | El distractor EP-SIN-RAIZ da «x² en cm²» mezclado (100 · 2E/k). | Queda (cuadra con su explicación). |

**Lo que el lector en frío vio y el código confirma** (arriba): A1, M1, M5, M7–M11, B1–B5. Lo demás que señalaron, en
`rutinas/frio/fisica.trabajo-y-energia.md`.

## Lo que está bien y hay que copiar al molde

- **Las cuentas**: 4 800 casos, 6 900 distractores, 90 ejemplos, 112 alternativas de examen, 2 400 problemas de práctica
  y los casos y el papel cuadran por otro camino; ningún caso imposible.
- **El signo del trabajo desde el ángulo**, con la fuerza de lado que no trabaja (la mochila) como predicción y el trabajo
  del peso que solo mira la altura.
- **Las dos referencias** de la energía potencial, con la azotea que da números negativos y el mismo cambio.
- **La predicción de las dos rampas**, que corrige el exceso de la anterior (con rozamiento, el camino sí importa).
- **Un color por clase de fuerza y cada trabajo con el de su fuerza**, con su prueba por el campo `m`.
- **Las misiones de un solo caso** y los errores que no dan la correcta (`distintos`, `repiteCorrecta`).

## Reglas que faltan en el contrato o el validador

| Regla | ¿Automática? |
|---|---|
| **g en los Datos** de todo ejercicio cuyos Datos nombran el peso o m · g (y, en general, toda constante que el resuelto usa). | Sí (en `Teoria.problemas`: una línea con «m · g» o «peso» y ninguna con «g = »). |
| **Un número escrito con menos cifras que el que se usa** («0,38» por 0,375): la respuesta se rehace con lo que se lee. | Semi (en la prueba de la unidad: los valores de las listas de azar tienen a lo sumo los decimales con que se escriben). |
| **Una figura a escala no muestra una longitud pedida** junto a una dada (dos líneas comparables, una con «?»). | Semi (en la prueba de la pieza: el rótulo con «?» no va sobre una línea medible). |
| **Un rótulo no queda sobre una línea** (la cota o la rampa que lo cruza). | Sí (en la prueba de la pieza: caja del rótulo contra los segmentos dibujados, como ya se hace rótulo contra rótulo). |
| **Un control animado y su dibujo usan el mismo valor** (lo que muestra el control es lo que se dibuja y se lee). | Sí (evaluar dibujo y lectura en valores intermedios del control). |
| **Una sola forma de un mismo valor** en la unidad (cos 37° = 4/5 y 0,8). | Semi (lista de pares por curso). |

## Correcciones (20 nov)

Hechas por el mismo auditor (fase 8), con las notas de los dos lectores en frío de la ronda 1 (anotadas aparte en
`rutinas/frio/fisica.trabajo-y-energia.md`). Archivos tocados: `contenido/teoria/fisica/trabajo-y-energia.js` y su
`.test.js`; `plantillas/fis-energia/generador.js`, `generador.test.js` y `papel.json` (regenerado). No toqué la pieza,
`app/`, `nucleo/`, el catálogo, la prueba del curso ni otras unidades.

**Pruebas.** Seis pruebas nuevas en `trabajo-y-energia.test.js` («auditoría A1», «M1» a «M4» y «lector en frío») y una
en `generador.test.js`; todas fallan con la versión de antes (copias en `scratchpad/e8-cierre-te/prueba-antes/` y
`prueba-antes-gen/`) y pasan con la nueva. En verde: la unidad (16), el generador (31), la pieza y sus bloques de
Dinámica y Energía, `catalogo/pruebas/pruebas.test.js`. Validador con `calidad: 2` simulada, 60 y 400 semillas: 0
problemas. Papel con la marca simulada: limpio. Cuentas otra vez por mi camino: 4 800 casos y 6 900 distractores, 90
ejemplos y 112 alternativas, 2 400 problemas y 4 565 distractores de la práctica: todo cuadra, nada imposible.
Capturas de después: `scratchpad/e8-cierre-te/despues/`. Ecuaciones a 390 px (`herramientas/ecuaciones-ancho.js`,
53 pantallas, 586 renglones): nada se sale y ningún renglón se parte tras un paréntesis, un «+» o una flecha; quedan 11
resultados cortos que bajan solos después del último «=» (los que la app arreglará; estaban antes de corregir), y los dos
que agregaba la línea nueva de la cuesta se evitaron escribiéndola sin «=». El validador común
(`contenido/teoria/teoria.test.js`) falla solo en otra unidad (`trigonometria/angulos-en-posicion-normal.js`).

### Alta

- **A1.** Hecho: `conG` agrega «g = 10 m/s²» a los Datos de todo ejemplo, «Así se resuelve» y «Ahora tú» que nombra el
  peso o m · g sin dar g (lo mismo en `cerrar` del generador). La cuesta (6.11, 6.14, el tractor de «Ahora tú» y de la
  práctica) trae «En una rampa de ángulo θ: normal, m · g · cos θ; el peso tira m · g · sen θ rampa abajo» (en la práctica, «el peso tira m · g · sen θ rampa abajo») y «A rapidez constante, la fuerza neta es
  cero y P = F · v». Prueba «auditoría A1» (y la del generador).
- **A2.** Hecho: μ_k = 0,6 en vez de 0,375. Prueba «auditoría M1» (rehace la altura con el μ_k que se lee).

### Media

- **M1.** Hecho: todos los Datos con decimales (sen 37° = 0,6 y cos 37° = 0,8…; cos 60° = 0,5), también en la práctica
  y el papel. Prueba «lector en frío».
- **M2.** Hecho: 5.13 A = 0,5; 6.14 B = 1200 W («usa el peso entero, 500 + 100, en vez de su parte a lo largo de la
  rampa»). Las letras correctas no cambian. Prueba «auditoría M2».
- **M3.** Hecho: `figBotes` no dibuja la altura que se pide; su rótulo va a media altura («después: ?», «1.er bote»,
  «2.º: ?»). Prueba «auditoría M3».
- **M4.** Hecho: la rampa de «Así se resuelve» de la idea 4 pasa a 8,45 m (13 m/s); el caso del ejemplo 2.13, fuera de
  «Ahora tú». Prueba «auditoría M4».
- **M5.** Hecho: «N = 20 · cos 37° = 16 N», «N = 20 · cos 53° = 12 N», «caja de 2 kg; μ_k = 0,3» y los pasos con el coseno
  y la convención.
- **M6.** Hecho: «Los tablones son los mismos en las dos: el mismo coeficiente de rozamiento». Los ids, las opciones y los
  errores no cambian: `prediccionTE` no se toca.
- **M7.** Hecho: balcones «a 3 m», «a 6 m», «a 9 m»; referencia «Balcón a 3 m»; «h = 0: vereda» y «h = 0: azotea» en
  toda figura del edificio; la Predice «cae del balcón que está a 9 m al que está a 3 m sobre la vereda»; 3.6 dice que el
  1.er piso está a nivel de la vereda (cota de 0 a 9 m, con «?»); 1.13 para a 3, 6 y 9 m. La misión y su respuesta no
  cambian.
- **M8.** Hecho: `uVista` redondea a centésimas (lo que muestra el control) y el control se llama «Parte del camino (0
  arriba, 1 abajo)» o «Parte de la subida (0 abajo, 1 arriba)». La lectura del juego 4 pasa a «787,2 J + 172,8 J = 960 J,
  como arriba», que no deja el «J» solo en el renglón siguiente.
- **M9.** Hecho: la columna escribe «aquí, a 2,4 m» (la altura de ahora).
- **M10.** Hecho: 4.8 con m · 10 · 0,45 = ½ · m · v²; 5.8, 5.13, 5.14 y 5.15 dicen «la masa se cancela: se cuenta por cada
  kilo» y escriben la normal por kilo (1 · 10 · 0,8 = 8 N); 5.8 en dos renglones.
- **M11.** Hecho: la gráfica de la regla 2 con el eje «F neta», y el texto «Si la fuerza neta cambia, el área bajo F–x es
  ese trabajo: en el dibujo, el carrito gana 80 J» (un rótulo dentro de la gráfica tapaba las áreas y la pieza `ejes` no
  escribe subíndices); la regla 3 dice «Un resorte guarda ½ · k · x²: el área bajo F–x», su dibujo «resorte: F = k · x,
  k = 400 N/m» y «8 J», y la fórmula del peso, que se partía en «al / final», pasa a W_peso = −ΔE_PG con Δ dicho en
  «Vale si».

### Baja

- B1, B2, B3 y B5: hechos (lienzos más altos, rapideces de las rampas como texto, el costal y la flecha «cae» corridos,
  las barras de Mira 3 «a 9 m» y «a 3 m», la v⃗ del carrito más arriba, la f⃗ con su rótulo abajo, la cota de la mesa, B
  con su línea y su cota de 2,4 m, el bloque del resorte más angosto). B4: la W de la regla de potencia, en naranja; la de
  Mira 5 queda. B6, B7, B8 y B9: quedan.
- Además, de la lectura: la Mira 1 llega a 10 m y dice «mochila: 0 N a lo largo»; la leyenda de la punteada avisa que a 0°
  queda oculta; la invitación de la mesa «rampa» dice «menos áspera» (decía «lisa» con μ_k > 0).

### Decidido por la sesión, Gerson revisa después

1. **g = 10 m/s² en los Datos** de todo ejercicio que usa el peso, como una línea más al final (no dentro de la línea de
   E_PG): así se ve igual en la teoría, la práctica y el papel.
2. **Los niveles del edificio por su altura** («balcón a 3 m»), no por número de piso: en el Perú el 1.er piso es la planta
   baja y en otros países no. Donde el enunciado nombra pisos (3.6), dice que el 1.er piso está a nivel de la vereda.
3. **El coseno en decimales** en toda la unidad (0,6 y 0,8), como lo escribe la leyenda del juego y como se usa en las
   cuentas.
4. **B6 queda**: las figuras de trabajo neto en piso horizontal dibujan solo las fuerzas que trabajan. Si Gerson prefiere
   el DCL completo (decisión 14 de la propuesta), hay que hacer sitio en `figCarrito` para el peso y la normal.
