# Auditoría de contenido: «Segmentos y ángulos» (geometria.segmentos-y-angulos)

17 nov 2026. Auditor externo (fase 7, `docs/metodo/unidad/5-auditor.md`). No se editó la unidad. Contrato:
`docs/plan-calidad.md` §3 (13 puntos) y §5. Formato: `docs/teoria.md` 4e, 4f, 4h y §5. Vara: `docs/molde-unidad.md`
§10. Decisiones: `docs/etapa3/decisiones.md` («Segmentos y ángulos» y rondas siguientes) y `docs/etapa2/decisiones.md`
(«Cambios posteriores»). Las quejas del lector en frío (`rutinas/frio/geometria.segmentos-y-angulos.md`) se
verificaron una por una contra el código y contra capturas nuevas con `--entera`. Lo que salió de capturas mal sacadas
(«el botón tapa…», «solo se ve el paso 1») no cuenta. No se reportan los pendientes de Gerson en la mesa: el reloj
propio de geometría y el ángulo no convexo en el juego de la idea 3.

**Qué se revisó.**
- `contenido/teoria/geometria/segmentos-y-angulos.js`: las 6 ideas con sus 7 momentos, los 90 ejemplos, «Ahora tú» con
  las semillas 0–399 y «Así se resuelve», el glosario (30 términos) y el laboratorio (3 mesas).
- La práctica:
  - `plantillas/geo-segmentos-angulos/`: generador de 29 tipos y `papel.json`.
  - `plantillas/segmentos-angulos/`: la escena «la escuadra y las paralelas» y su `papel.json`.
- La app a 390 × 844, página entera: los 42 momentos y los 90 ejemplos (capturas en el scratchpad,
  `auditoria-segmentos/cap/`).

**Cuentas.** Se rehicieron con scripts propios que no usan el código de la unidad. Son 124 cuentas y todas cuadran.
- `auditoria-segmentos/cuentas.js`: los **30 ejemplos de nivel 3**, resueltos desde el enunciado. Las inecuaciones y
  las ecuaciones se barrieron; los puntos medios se probaron con dos valores del dato que falta.
- `auditoria-segmentos/generador-cuentas.js`: **87 problemas del generador**, 3 semillas por cada uno de los 29
  tipos.
  - Se leyó solo el texto del enunciado.
  - En los tipos de paralelas sin el par nombrado, se midieron los ángulos con las coordenadas de la figura.
- Ese mismo script comprobó que el ejemplo 7 de la idea 5 dibuja mal sus ángulos (A2).

`node --test` da verde en la unidad, el generador y el motor de la escena. El validador de la teoría pasa para esta
unidad (158 de 158).

## Hallazgos

### Alta (el alumno no puede resolver o aprende algo falso)

| # | Punto | Dónde | Evidencia | Corrección propuesta |
|---|---|---|---|---|
| A1 | 9, 10 (la condición de la regla) | `segmentos-y-angulos.js:1166-1179` (`casoClase`, «Ahora tú» tipo 0 de la idea 3). También sale en la prueba del tema (semillas 500 y siguientes). | Con a + b > 180° la pregunta dice «OB queda entre OA y OC» y da por correcta «no convexo» para ∠AOC. Pasa en 8 de cada 100 casos del tipo 0 (semillas 0, 84 y 100: 80° + 105°, 100° + 95°, 90° + 100°). ∠AOC sin más es el convexo, y mide 175°: es obtuso, y «obtuso» está entre las opciones. Además, OB no está entre OA y OC del convexo. El alumno que razona bien queda marcado mal. La figura no lleva el arco de ∠AOC (`total: false`, :1175), y OA y OC se ven casi en línea: el lector en frío dudó con «llano». El generador ya evita este caso (`generador.js:639`, `if (t > 180) continue`), pero la teoría no. | Limitar a + b ≤ 180°, como el generador. Si se quiere practicar el no convexo, decir «el ángulo AOC que contiene a OB» y dibujar su arco. |
| A2 | 4, 10 (molde §3: la figura muestra el planteamiento) | `segmentos-y-angulos.js:1725` (ejemplo 7 de la idea 5, «Suman 180°») | Se dibuja con θ = 60°. P ai, rotulado «2x + 20°», se ve obtuso (120°), y Q bi, rotulado «3x + 10°», se ve agudo (60°). Con x = 30°, esos ángulos miden **80° y 100°**: el rótulo que vale 80° está en un ángulo obtuso y el que vale 100° en uno agudo. La prueba «compara `mide` con lo que se dibuja», pero `mide` sale de θ y no de las expresiones, así que no lo detecta. Los otros 14 ejemplos con expresiones sí cuadran (se revisaron los 14). | Dibujar con θ = 100°: P ai = 80° y Q bi = 100°. En la prueba, evaluar cada rótulo con la x de la solución y compararlo con `mide`. |
| A3 | 10, 6 (Predice) | `:478-492`, `:502` (Mira, paso 5) y `:135` (rótulo «3 km») | La opción correcta, «Más de 10 km, pero menos de 13 km», solo es cierta por dónde está B, frente al km 4. Sin Pitágoras no se puede saber que el camino no llega a 13. Mira lo justifica con «El 13 suma los 3 km aparte; pero cada camino sube mientras avanza». Eso es falso en general: con B a 3 km frente al km 0, el camino mide 3 + √109 ≈ 13,4 km, más que 13. El alumno se lleva una regla falsa: «el rodeo nunca pasa de AC + la altura». Además, el «3 km» se dibuja sobre la carretera, al pie de la punteada, y se lee como un tramo de la carretera (captura `suma-de-segmentos-3-predice`; el lector en frío lo leyó así). | Opciones sin el límite de 13: «Más de 10 km: el rodeo alarga» (correcta), «Exactamente 10 km», «Menos de 10 km» y «Depende del lado de la carretera en que esté B». Mira se queda en la medición con la regla, sin la frase del 13. El «3 km» va junto a la punteada, a media altura. |

### Media (el alumno se traba o duda)

| # | Punto | Dónde | Evidencia | Corrección propuesta |
|---|---|---|---|---|
| M1 | molde §2 («Ahora tú practica cada parte de la regla») | `:1643-1647` y `:1480-1544` («Ahora tú» de la idea 4) | Los cuatro tipos son `casoVecesX`, `casoCadena`, `casoVeces` y `casoMaximo`, y **ninguno pide una bisectriz**. La idea se llama «Complemento, suplemento y bisectriz»: su Predice, su Mira y su regla («bisectrices de dos adyacentes: 90°») son de bisectrices. Por eso la prueba del tema tampoco pregunta por la bisectriz. El generador sí tiene el tipo `bisect`. | Cambiar `casoVecesX` o `casoVeces` por un tipo con bisectrices: dos adyacentes o dos consecutivos, ∠MON. |
| M2 | 3, 4, 9 | `:938-943` (la regla de la idea 2), con la figura de Mira (`:924-928`; `app/teoria.js:619` usa el último paso de Mira) | La regla dice «El punto medio M parte AC… Con B entre A y C, BM = (AB − BC)/2», pero la figura de al lado es la de las bancas: M es el punto medio de **AB**, N el de CD, y B está pegado a A (captura `punto-medio-5-regla`). Las letras del texto contradicen las del dibujo. El lector en frío: «me confundió mucho». | Dar a la regla su propia figura: la soga, con M en la mitad de AC y B en la raya. La otra opción es escribir en la regla MN = (AC + BD)/2 y nombrar las bancas. |
| M3 | molde §3 («lo que el resuelto dice que hace, se ve hecho») | Idea 6: 14 de 15 ejemplos (`:2011-2078`, solo el 14 lleva `aux`), «Así se resuelve» (`:2233`) y «Ahora tú» (`:2086-2131`); en el generador, `quiebreFig` (`generador.js:1094`) | El resuelto dice «La paralela por V parte x en dos alternos internos», y en el paso «regla» de «Así se resuelve», «Por V trazo una paralela». Ninguna figura la dibuja (captura `quiebre-6-resuelve`). Mira sí la dibuja desde el paso 2, así que esa queja del lector en frío no vale para Mira. | En el resuelto, la figura de solución con `aux` (en «Así se resuelve», un `dibujo` en el paso «regla»). En el ejemplo, la paralela punteada, que no delata nada. |
| M4 | 3, 4 (rótulos) | Ejemplo 3 de la idea 4 (`:1380`); ejemplo 8 (`:1411`, `sector: [0, 35]`); «Así se resuelve» de la idea 4 (`:1626`, `sector: [0, h]`); ejemplo 15 de la idea 4 (`:1469`); ejemplo 15 de la idea 5 (`:1764`); Predice y regla de la idea 4 (`:1595`, `:1602`); «Ahora tú» de la idea 5 (`:1693`, rótulos L₁ y L₂) | Hay rótulos en el hueco de otro ángulo.<br>- «70°» cae en la mitad AOD, que mide 35°: se lee m∠AOD = 70°.<br>- «76°» cae entre OD y OB.<br>- En Predice, el «?» va sin arco entre el poste y la barra: parece pedir esos 40°.<br>- En la regla, el «90°» va junto al poste, sin arco.<br>- En «Ahora tú» de paralelas, «L₂» queda pegado al «100°», que es del cruce de arriba (captura `paralelas-7-ahora-tu`).<br>El lector en frío cayó en cuatro de estos. | El rótulo del ángulo entero va sobre su bisectriz, a un radio mayor que las mitades (el generador ya lo hace con `rotular`). Los «?» y los 90° entre bisectrices llevan su arco. L₁ y L₂ van fuera de la franja entre las rectas. |
| M5 | 3 | `consec` (`:1024-1026`): ejemplos 8 y 14 de la idea 3 (`:1087`, `:1141`), «Ahora tú» tipos 0 y 3 de la idea 3 (`:1175`, `:1220`); generador `consecFig` y `vuelta` | Dos ángulos consecutivos del mismo color y con el mismo radio se ven como un solo arco. Pasa en «k» y «2k» (ejemplo 8), en la vuelta de 120°, 2x y x + 30° (un círculo carmín entero, ejemplo 14) y en 80° y 105° de «Ahora tú». No se ve dónde termina uno y empieza el otro (lector en frío: «los arcos no corresponden a las etiquetas»). | Radios alternados (24 y 32) o un corte de 2° junto al lado común. |
| M6 | 3 (marcas) | Ejemplo 8 de la idea 2 (`:676-677`) y ejemplo 14 (`:757-758`); `casoMedio` y `casoEquidistante` (`:785-838`); generador `medioEntre` y `equidistante` (`generador.js:374`, `:464`) | Las marcas de igualdad caen en el medio del tramo, sin mirar los puntos.<br>- En el ejemplo 8, la de MC tacha el punto B.<br>- En el ejemplo 14, la «/» de MB y las «//» de AN se juntan en «///».<br>- En «Ahora tú» pasa en 39 de 200 casos (marca a menos del 3 % del largo de un punto).<br>- En el generador, en 81 de 300 casos de `medio-entre` y 71 de 300 de `equidistante`. | En la pieza, correr la marca fuera de un punto cercano o subirla a otro nivel. Prueba numérica: ninguna marca a menos de 10 px de un punto ni de una marca de otro grupo. |
| M7 | 8 | `:1616` (ecuación de la regla de la idea 4) | A 390 px, «bisectrices de dos adyacentes: 9…» se corta en el borde de la tarjeta (captura `bisectrices-5-regla`). | Partir la frase o pasarla a la condición; probar el ancho a 390 px. |
| M8 | 3 | `:1246` (tarjeta 2 de Lee, idea 3); leyenda (`:1263-1268`) | «m∠» nunca se dice en palabras. Lee lo usa una vez («Se escribe m∠AOB = 120°») junto a un reloj sin A ni B, y después aparece en todos los enunciados y datos. El lector en frío: «“m∠” no sé qué significa». | En Lee: «m∠AOB se lee “la medida del ángulo AOB”», con A y B en las agujas. Sumarlo a la leyenda o al glosario («ángulo», en `simbolo`). |
| M9 | 1, 3 | `:1876` (tarjeta 4 de Lee, idea 5) y la regla de la idea 5 | La tarjeta que nombra los seis pares (correspondientes, alternos y conjugados, internos y externos) **no tiene dibujo**. La figura de la regla pinta por medida (carmín θ, turquesa 180° − θ), no por par. El alumno no puede ubicar «alternos internos» en ninguna figura antes de «Así se resuelve». | Dar a la tarjeta 4 los rieles con dos pares marcados (por ejemplo, correspondientes con una letra y alternos internos con otra), o una tarjeta por familia. |
| M10 | 13 (el ejercicio tiene todo) | `plantillas/geo-segmentos-angulos/papel.json:27` (p3); `generador.js:1232` (`papel-3: 'quiebre'`) | El papel va sin figura, y el texto de p3 («PV forma 25° con L₁ y QV forma 45° con L₂») sirve para dos dibujos. Si P y Q quedan del mismo lado de V, x = 70°; si quedan a lados distintos, x = 160°. 160° no está entre las opciones. El comentario del generador dice que en papel van «solo tipos que se resuelven con el texto». | Agregar a p3 un dato: «P y Q quedan a la izquierda de V; los ángulos se miden del lado de V». La otra opción es cambiar `papel-3` por `quiebre-veces` con ese mismo dato. |
| M11 | 13, 5, §5b | `plantillas/segmentos-angulos/papel.json` (p1–p10) y `index.html:21`, `:250-253` | El papel de la escena:<br>- No tiene ningún `datos`: ni las definiciones, ni las reglas de las paralelas, ni la suma de los quiebres.<br>- Escribe los ángulos sin «°» («4x − 20 y 2x + 40», «m∠APB = 5x + 2»).<br>- Escribe «P1, P2, P3» sin subíndice.<br>- Pregunta «¿Cuánto mide m∠AOB?».<br>La escena usa su propia paleta: θ en azul, el suplemento en **violeta** (el color de lo que se pide) y oliva junto a rosa. No usa el carmín de los ángulos ni el turquesa del compañero, que dice el mapa de la unidad. | Pasar el papel por `herramientas/papel-generador.js` o agregarle `datos` a mano. Usar «°», subíndices y «¿Cuánto mide ∠AOB?». En la escena, los tokens de §5b: θ y sus iguales en carmín, el compañero en turquesa y lo pedido en tinta. |
| M12 | 1, 3 | `:870-871` (tarjeta 1 de Lee, idea 2, `figSoga(5)`) | En la primera figura de la idea, la raya B y el pañuelo M están en el mismo punto, y las letras salen pegadas: «BM». La raya pintada no se distingue del punto (captura `punto-medio-1-lee`). El lector en frío leyó un punto llamado «BM». | La primera tarjeta con la soga corrida (AB = 6) o con la raya dibujada como una franja; las dos letras, separadas. |
| M13 | molde §3 (la figura no delata la respuesta) | Ejemplo 14 de la idea 3 (`:1141`, «¿Cuál es el mayor de los tres?») y ejemplo 3 de la idea 2 (`:621`, «¿M es el punto medio?») | Las dos figuras van a escala, y la pregunta es justo de comparar. Se ve a ojo que 140° es el mayor y que 4 ≠ 6 antes de resolver (lector en frío: «se ve a ojo que BOD es el mayor»). | En el ejemplo 14, preguntar «¿Cuánto mide el mayor?». En el ejemplo 3, una figura de referencia que no esté a escala, o preguntar «¿a cuánto de A queda el punto medio?». |

### Baja (estilo)

| # | Punto | Dónde | Evidencia | Corrección propuesta |
|---|---|---|---|---|
| B1 | 7 | `:509`, `:1617` (`condicion`) | El lector pone «Vale si» delante de la condición, y queda: «Vale si B está entre A y C cuando está en la recta AC…» y «Vale si C(x) existe si x < 90°». | `condicion: 'B está en la recta AC y en el tramo de A a C.'` y `'x < 90° para C(x) y x < 180° para S(x)…'`. |
| B2 | 5 | `:1963` («Así se resuelve» de la idea 5: «x = 17»), los ejemplos de la idea 5 («x = 20°»), `casoEcuacion` (opciones «17°») | x es un número en un lugar y un ángulo con «°» en otro, dentro de la misma idea. | Una sola forma en la unidad y en el generador: en «3x + 29°», x = 17 sin «°». |
| B3 | 5, 7 | Mira de la idea 6, paso 1 (`:2211`: «a = 40° · b = 30°»), ejemplo 12 de la idea 3 (`:1128`), ejemplo 6 de la idea 5 (`:1724`: «3 · 20° + 10° = 70° · 5 · 20°…»), lectura de `mesaPunto` (`:2318`) | El «·» separa dos igualdades (molde §2), y en el ejemplo 6 de la idea 5 también es el signo de multiplicar. | Separar con « y », o en dos líneas (`SEP` solo entre bloques que no son igualdades). |
| B4 | 7 | `:1929` (Mira de la idea 5, paso 3) | El texto dice «el opuesto por el vértice también mide 60°», pero la ecuación nombra «alternos internos: 60° = 60°». La razón no coincide con el nombre del par. | «En Q, el opuesto por el vértice también mide 60°: es alterno interno con el de P». |
| B5 | molde §3 | `:1415` (ejemplo 8 de la idea 4) | La línea termina en «queda el suplemento:» y la ecuación empieza por «70° ÷ 2 = 35°». El orden queda cruzado. | Dos líneas: primero la mitad y después el suplemento. |
| B6 | 3 | Ejemplo 3 de la idea 6 (`:2019`: «porque a = b», sin a ni b en la tarjeta); ejemplo 14 (`:2056`: pide a y b, y la figura solo tiene «?»); ejemplo 14 de la idea 5 (`:1755`: θ no se presenta) | Hay letras en el texto que la figura no tiene, o al revés. | Rotular a y b en la figura y en el texto, y presentar θ en el enunciado. |
| B7 | molde §3 (niveles) | Ejemplo 14 de la idea 6 (`:2056`, nivel 3: 84 ÷ 2) y ejemplo 8 de la idea 1 (`:225`, nivel 2) | El de nivel 3 se resuelve en un paso y es más fácil que el 8 de su idea. El de nivel 2 de la idea 1 es casi el mismo que «Así se resuelve». | El ejemplo 14 con la paralela bisectriz y un dato con x (a = 2y + 2, b = 3y − 10). |
| B8 | 3 | Juega de la idea 6 (`:1985`, `pasajeJ`) | La leyenda nombra «a, b», pero la figura solo pone 40° y 30°. | Rótulos «a = 40°» y «b = 30°». |
| B9 | 1 | Predice de la idea 3 (`:1293`) | Los dos relojes no tienen números (solo rayitas) y el «?» va sin arco, flotando sobre el reloj. El dato dice «12 números a igual distancia». | El 12, el 3, el 6 y el 9 en los relojes; el «?» sobre un arco tenue. |
| B10 | 10 | Predice de la idea 2 (`:910-911`, `:588`) | Paraderos de una avenida a 4 m, 8 m y 10 m uno de otro (AC = 12 m, BD = 18 m). No es creíble. | «Postes» o «bancas» en vez de paraderos, o medidas en cientos de metros. |
| B11 | 9 | Ejemplo 15 de la idea 5 (`:1771`: «Los tres ángulos de un triángulo suman 180°»); ejemplo 12 de la idea 4 y `casoMaximo` (inecuaciones) | El ejemplo usa un teorema de `geometria.triangulos`, una unidad que requiere a esta. Las inecuaciones lineales no están en `requiere` (solo `algebra.ecuaciones-lineales-y-cuadraticas`). | Dejar el ejemplo para Triángulos o resolverlo con la paralela por K. Sumar `algebra.inecuaciones` como requisito de consejo, o decir en datos «x < 25 → el mayor entero es 24» sin el paso hecho. |
| B12 | 12 | `:510`, `:1618` (voz de Neri) | «El dibujo sugiere; “entre A y C” lo garantiza» y «despeja de adentro hacia afuera»: el lector en frío no las entendió. | «Que se vea en medio no basta: tiene que estar entre A y C» y «Primero el complemento, después el suplemento». |
| B13 | 7 | `:1503` (`casoCadena`) | `valor: k − 180 + 90 + 90 === v ? k + 90 : k + 90`: un ternario muerto (los dos lados son iguales). | `valor: k + 90`. |
| B14 | práctica (repaso) | Generador: `quiebre-veces` da 4 enunciados distintos en 100 semillas; `reloj` 8, `veces-x` 8, `veces-cs` 9 y `equidistante` 11 | En la cola de repaso se repiten casos idénticos. Entre las semillas 11 y 222 salen iguales `afuera`, `equidistante` y `veces-cs`. | Ampliar los rangos (`quiebre-veces`: m entre 2 y 4 y b de 5 en 5) o variar el contexto. |

**Quejas del lector en frío que no se sostienen.**
- «Bisectriz», «correspondientes», «ángulo llano» y «opuestos por el vértice» sí se presentan antes de Predice: en la
  tarjeta 3 de Lee de la idea 4, en la tarjeta 4 de la idea 5 y en la tarjeta 3 de la idea 3. El lector solo vio la
  tarjeta 1. Además, las palabras se pueden tocar en el glosario.
- Las rayitas «/» y «//» se explican en la tarjeta 2 de Lee de la idea 2.
- La paralela auxiliar de Mira (idea 6) aparece desde el paso 2.
- Que BC sea turquesa en un ejemplo y naranja en otro sigue la regla aprobada: el color sale de lo que el tramo es en
  la figura (decisiones de la etapa 3).

## Lo que está bien y hay que copiar al molde

- **El color lo pone la pieza y el texto lo toma de la figura.** `pinta(F, nom)` usa `PO.colorDe`. Así un tramo no
  puede tener un color en el texto y otro en el dibujo. La prueba lo comprueba en toda la grilla del juego y en 400
  semillas, y el generador calcula el color igual y su test lo compara con la pieza. Es la mejor solución vista a
  «un color por variable» cuando las letras cambian de un problema a otro.
- **Sin figura cuando la figura es la respuesta.** En «¿cuál está entre los otros dos?», en la teoría y en el
  generador, no hay dibujo ni colores, y el motivo está escrito en un comentario.
- **Lo pedido va con «?» en tinta y el violeta solo en la respuesta.** Ningún ejemplo ni Predice delata la respuesta
  por el color. En los ángulos, todo dado va en carmín y lo pedido en tinta, para que el turquesa no diga «es
  suplementario».
- **Datos con herramientas, sin atajos.** La definición de «entre», la suma de tramos, k como «la medida de una
  parte», C(x) y S(x) con su condición, los pares entre paralelas y «Por V se puede trazar una paralela». Nunca va
  «MN es la semisuma» ni «BM = (AB − BC)/2» en «Ahora tú», aunque esté en la regla.
- **«¿Son paralelas?» dibuja las rectas como son.** `abre` = la diferencia real, sin marcas de paralelas: la figura no
  miente para «parecer» paralela.
- **El generador:**
  - 29 tipos repartidos por idea y por nivel, con un comentario que dice el tipo, su nivel y su idea.
  - `rotular` busca dónde poner cada rótulo, y si no cabe arma otro caso; `cotasCaben` revisa las cotas de los
    segmentos.
  - Excluye el ángulo «consecutivo» de más de 180°, justo el caso que la teoría deja pasar (A1).
- **Las explicaciones de los distractores** empiezan por lo que el alumno hizo bien y cada valor sale de su error
  (GE-PM2, la división entre 4; GE-SEG12, partir lo que ya era el tramo).
- **Laboratorio por idea.** Tiene retos comprobados por el motor. La mesa de la secante deja girar el riel, que es lo
  que la idea reserva para Predice. `CAMINO_MAX` y `QUIEBRES` salen de la grilla real, no de un número escrito a mano.
- **Lee prepara sin adelantar.** Cada tarjeta trae el vocabulario de Predice (bisectriz, correspondientes) y la última
  dice qué mirar al jugar.

## Reglas que faltan en el contrato o en el validador

1. **Rótulos con expresiones, evaluados con la solución.** Si una figura rotula «2x + 20°» y declara `mide`, la prueba
   reemplaza la x de la solución y la compara con `mide` (A2). *Automático*: hace falta que el ejemplo declare x.
2. **Cada rótulo dentro de su ángulo.** El centro del rótulo cae en el sector del ángulo que nombra, no en una de sus
   mitades ni en otro ángulo (M4). *Automático* en geo-figura: ángulo polar del rótulo entre `de` y `a`.
3. **Marcas y arcos legibles.**
   - Ninguna marca de igualdad a menos de 10 px de un punto ni de una marca de otro grupo.
   - Dos arcos consecutivos del mismo color no pueden tener el mismo radio (M5, M6).
   *Automático* en geo-objeto y en geo-figura.
4. **La condición de la regla también vale en «Ahora tú».** Si el enunciado dice «OB entre OA y OC», la suma tiene que
   ser ≤ 180° (A1). *Automático* para este tipo; en general, cada `ahoraTu` puede declarar sus invariantes y la
   prueba revisarlas en 400 semillas.
5. **«Ahora tú» cubre cada parte de la regla.** Cada idea declara las partes de su regla (por ejemplo, `partes:
   ['complemento', 'suplemento', 'bisectriz']`) y cada tipo de «Ahora tú» dice cuál practica (M1). *Automático*, con
   ese campo nuevo.
6. **La figura de la regla tiene las letras del texto de la regla.** Las letras que nombra la regla (M, AC, B) tienen
   que ser los mismos puntos en la figura (M2). *Semiautomático*: comparar las letras del texto con los rótulos de la
   figura y avisar si la misma letra es otro punto (por ejemplo, M como medio de AB).
7. **Papel sin figura que se pueda resolver.** Un tipo que va a papel no puede depender de la figura: la prueba genera
   el caso del papel y le pide a un resolutor que dé una sola respuesta solo con el texto y los datos (M10). *Manual*,
   o automático por tipo con un resolutor simple.
8. **El papel de la escena también lleva `datos`, y la escena usa los tokens del mapa de la unidad** (M11).
   *Automático*: el validador del papel exige `datos` en cada problema de `plantillas/*/papel.json` de una unidad con
   `calidad: 2`; los colores, con una lista de tokens permitidos en las escenas de la unidad.
9. **Una ecuación de la regla no se corta a 390 px** (M7). *Automático* con `capturas-teoria.js`: medir `scrollWidth`
   de `.te-ec` contra su caja.
10. **La pregunta de un ejemplo a escala no es una comparación visual.** «¿Cuál es el mayor?», «¿es el punto medio?»
    (M13). *Manual*, en el encargo del lector en frío de ejemplos.
