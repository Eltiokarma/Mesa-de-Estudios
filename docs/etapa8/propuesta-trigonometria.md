# Propuesta de ideas: «Ángulos en posición normal»

`trigonometria.angulos-en-posicion-normal` · Etapa 8 del plan de calidad, primera unidad de la rama «Ángulos de
cualquier medida» (la rama «Ángulos y razones» está completa con `calidad: 2`) · fases 1 a 5 con criterio delegado
(`docs/metodo/unidad/etapa-delegada.md`) · 19 nov 2026

Gerson delegó el criterio: esta propuesta es el guion de la unidad y se usa para escribirla. Las dudas van como
**decisiones tomadas** (sección 9), cada una con su motivo y la opción descartada. No hay ningún conflicto crítico.

**Estado (19 nov, fases 1 a 5 hechas):** las cinco ideas están escritas enteras (Lee con el objeto, juego con misión,
predicción, Mira, regla con dibujo, «Así se resuelve», «Ahora tú» de tres tipos con datos y nivel de examen, glosario con
`simple` y 15 ejemplos cada una), con la pieza nueva `trig-pos` (el plano de `trig-plano` con un objeto de fondo: el pueblo,
la rueda de la fortuna, la veleta, el reloj y la rueda de bicicleta; dibujos de prueba), el laboratorio de tres mesas con
los colores nuevos y la práctica nueva `plantillas/trig-posicion-normal/` (15 tipos, 32 casos verificados aparte y 8 de
papel). La unidad no declara `calidad: 2`; con la marca simulada y 400 semillas, el validador no da faltas. Lo que cambió
durante la escritura está en la sección 9 (decisiones 17 a 23).

Lo que leí: `CLAUDE.md`, `docs/plan-calidad.md` §3, `docs/molde-unidad.md`, `docs/teoria.md`, `docs/metodo/unidad/`
(LEEME, 1-ideas, 2-ejemplos, 3-practica, reglas-validador y etapa-delegada), las decisiones de `docs/etapa2/` a
`docs/etapa7/`, `docs/etapa7/propuesta-trigonometria.md` (modelo de formato), la unidad terminada anterior
(`triangulos-rectangulos.js` con su auditoría y su lector en frío: rótulos bajo el suelo, figuras «no a escala» que se
dejaban medir, redondeos con «=», Datos sin la recíproca que se usa, dos ejemplos con los mismos números), las otras tres
de la rama anterior (en especial `angulo-trigonometrico.js`, de donde salieron los coterminales hacia aquí, y
`razones-trigonometricas-agudas.js`, que ya define cot, sec y csc), la teoría actual de esta unidad (v0.1.0, cuatro ideas
sin contrato), su ficha en `catalogo/cursos/trigonometria.json`, su plantilla `circunferencia-trig` (escena compartida con
cuatro unidades más de la rama), `docs/investigacion/trigonometria-ideas-erroneas.md`, `docs/temario-completo.md`
(unidad 6), la matriz `docs/teoria/matriz/trigonometria.json`, la prueba del curso (`catalogo/pruebas/trigonometria.json`:
ningún ítem de esta unidad), las seis preguntas de San Marcos de `docs/datos/admision-unmsm.csv` y, para no adelantar, las
unidades que siguen: `reduccion-al-primer-cuadrante.js` (ángulo de referencia, cofunción, «primero se quitan las vueltas»
y la paridad sen(−θ) = −sen θ), `circunferencia-trigonometrica.js` (radio 1 y las líneas) y `funciones-trigonometricas.js`.

---

## Lo que pregunta la admisión

**Catálogo:** UNI, semana 4; San Marcos, tema 5. **Banco Cuzcano:** unas 62 fichas (razones en posición normal 24, signos
por cuadrante 19, ángulos medidos desde otro eje 10, coterminales y cuadrantales 9).

**San Marcos, admisión real 2019-I a 2027-I:** seis preguntas de esta unidad.

| Periodo (examen) | Qué piden | Idea donde cae |
| --- | --- | --- |
| 2024-I (9 dic 2023, área A, n.º 39) | Un tiempo con una rapidez dada por el seno de un ángulo en posición normal (el punto en la figura) | 1, nivel examen. Trampa: el seno con el signo equivocado |
| 2024-I (10 dic 2023, Medicina, n.º 39) | Área de un terreno con lados que dependen de razones de dos ángulos coterminales | 5, nivel examen. Trampa: el signo del seno de un negativo |
| 2025-II (2 mar 2025, áreas B y C, n.º 43) | Perímetro de un trapecio con un vértice hallado por la cotangente de un ángulo en posición normal | 1, nivel examen. Trampa: la abscisa sin su signo |
| 2026-I (5 oct 2025, áreas B y C, n.º 43) | Área de un trapecio con un vértice hallado por la tangente | 1, nivel examen |
| 2026-II (7 mar 2026, área E, n.º 38) | Una constante con razones de un ángulo del tercer cuadrante que cumple una ecuación | 2, nivel examen. Trampa: la raíz que no corresponde al cuadrante |
| 2026-II (14 mar 2026, área A, n.º 41) | Área de un triángulo con un vértice dado por la cosecante | 1, nivel examen |

Pesa **leer las coordenadas de un punto del lado final con su signo** (cuatro de seis) y **elegir el signo por el
cuadrante** (dos de seis). Las trampas que se repiten (el signo olvidado, la raíz del otro cuadrante) son distractores de
las ideas 1, 2 y 4.

---

## 0. Qué tiene hoy la unidad y qué se queda o sale

1. **Cuatro ideas** (`razones-coordenadas`, `signos-cuadrante`, `cuadrantales`, `coterminales-negativos`) con Lee y «Así
   se resuelve», y un laboratorio de tres mesas (`seis-razones`, `mismo-lado`, `giro-y-opuesto`). La base sirve: las
   razones salen de P(x, y) y de r; el signo sale de las coordenadas; cero no es «no definida».
2. **Punto 1: ninguna primera pantalla tiene un objeto.** Las cuatro abren con el plano `trig-plano` (ejes, un punto y un
   arco). La plaza de Juliaca está solo escrita en una tarjeta.
3. **Punto 2: no hay misión**, ni `leyenda`, `aprendizaje`, `actividad`, `pregunta` ni `letras`; la cabecera dice «4.º de
   secundaria» y la ficha, `grado: 4`.
4. **Punto 13: ningún ejercicio trae `datos`.** No hay ejemplos resueltos (0 de 60) y el glosario trae un ejemplo por
   término, sin `simple`.
5. **«Así se resuelve» es el mismo tipo que «Ahora tú»** con otra semilla, en las cuatro ideas.
6. **Colores contra la rama:** θ naranja, x turquesa, y en rojo carmín (el color de los ángulos) y r verde (el verde no
   va junto al naranja ni al carmín). En la rama, el ángulo es carmín, el opuesto naranja, el adyacente turquesa y la
   hipotenusa en tinta.
7. **Adelanta dos unidades:** la idea 4 enseña sen(−θ) = −sen θ y cos(−θ) = cos θ (la paridad es de «Reducción», idea
   `mayores-negativos`, que ya la usa en su predicción) y las ideas 2 a 4 trabajan en «la circunferencia de radio 1»
   (que estrena «Circunferencia trigonométrica»).
8. **Glosario repetido en el curso:** cotangente, secante y cosecante ya los define «Razones» (calidad 2).
9. **Lecturas que encadenan con «·»** («θ = 225° · cuadrante III · sen θ < 0»), lo que el molde prohíbe.
10. **La práctica no es de la unidad:** `circunferencia-trig` es una escena vieja con paleta propia, sin Datos, y su papel
    trae problemas de otras cinco unidades sin decir de cuál es cada uno.

**Se queda:** los cuatro `id` de idea, las tres mesas con sus `id` (con los colores nuevos), la historia (con fuente) y
ocho términos del glosario.

**Sale o cambia:** los títulos; las cuatro primeras pantallas (pasan a objetos); las predicciones de las ideas 1, 3 y 4
(la 2 conserva su pregunta y los `id` de sus opciones); los colores; la paridad y el radio 1 (a sus unidades); cot, sec y
csc del glosario (los define «Razones»).

---

## 1. Las ideas, en orden

Cinco ideas: las cuatro de hoy con su `id` y una nueva (los ángulos negativos tenían media idea y su predicción era la de
la paridad). No hace falta partir la unidad ni declarar `septimaIdea`.

| # | `id` | Título (≤ 6 palabras) | `aprendizaje` |
| --- | --- | --- | --- |
| 1 | `razones-coordenadas` | Las razones salen de P | Con P(x, y) en el lado final y r = √(x² + y²), sen θ = y/r, cos θ = x/r y tan θ = y/x: el signo lo ponen x e y, y r siempre es positivo. |
| 2 | `signos-cuadrante` | El signo sale de x, y | El seno lleva el signo de y; el coseno, el de x; la tangente es positiva si x e y tienen el mismo signo: en I todas, en II el seno, en III la tangente y en IV el coseno. |
| 3 | `cuadrantales` | Cero no es «no definida» | Si el lado final cae sobre un eje, una coordenada vale 0: la razón con ese 0 arriba vale 0, y la que lo tiene abajo no está definida. |
| 4 | `giro-horario` (nueva) | El giro horario va con menos | Un ángulo negativo gira en sentido horario desde el eje x positivo: pasa primero por el cuadrante IV, y sus razones salen de un punto de su lado final, como siempre. |
| 5 | `coterminales-negativos` | Más vueltas, mismo lado final | Dos ángulos son coterminales si se diferencian en vueltas enteras, 360° · n: comparten el lado final y todas sus razones. |

**Por qué va cada una en su lugar y qué da por sabido**

1. **Las razones salen de P.** Va primero porque es la definición: el triángulo de «Razones» se pone en el plano, con el
   vértice en el origen. x es el adyacente, y el opuesto y r la hipotenusa; lo nuevo es que x e y llevan signo.
2. **El signo sale de x, y.** Usa la idea 1: si r es positivo, el signo de cada cociente lo deciden x e y. De ahí la
   tabla de los cuatro cuadrantes, que se reconstruye y no se memoriza. Su nivel examen junta las dos ideas: con una
   razón y el cuadrante se arma P y salen las demás.
3. **Cero no es «no definida».** Usa la idea 1 con P sobre un eje (una coordenada vale 0) y la 2 para el signo del otro
   número. Va después de los cuadrantes porque los cuadrantales son la frontera entre dos.
4. **El giro horario va con menos.** Los ángulos negativos los presentó «Ángulo trigonométrico» (idea `sentido-signo`);
   aquí se ponen en posición normal: dónde termina el lado final, en qué cuadrante (de 0° a −90°, el IV) y sus razones
   con un punto (ideas 1 a 3).
5. **Más vueltas, mismo lado final.** Al final, porque junta los positivos y los negativos: θ + 360° · n con n positivo o
   negativo. Es lo que «Reducción» usa en su idea `mayores-negativos` («primero se quitan las vueltas»).

**Da por sabido** (de sus `requiere`): de `razones-trigonometricas-agudas`, las seis razones como cocientes de lados,
Pitágoras y los notables de 30°, 45°, 60°, 37° y 53°; de `angulo-trigonometrico` (entra en `requiere`, decisión 13), el
giro con signo (antihorario positivo, horario negativo), la vuelta de 360° y el término «ángulos coterminales». **Va como
dato** cuando se usa: las definiciones con x, y, r (las seis), Pitágoras para r, y los valores de los notables.

**Qué no entra** (y dónde va):
- El ángulo de referencia y las fórmulas de reducción (sen 150° = sen 30°, cos 210° = −cos 30°): `reduccion-al-primer-cuadrante`.
  Por eso aquí ningún valor sale de un ángulo de los cuadrantes II, III o IV que no traiga su punto: el valor de una razón
  sale de un P con coordenadas, de un cuadrantal o de un coterminal del primer cuadrante.
- La paridad sen(−θ) = −sen θ, cos(−θ) = cos θ: `reduccion-al-primer-cuadrante`, idea `mayores-negativos`.
- La circunferencia de radio 1, las líneas trigonométricas y la variación por cuadrante: `circunferencia-trigonometrica`.
  Aquí el radio vector r mide lo que dé el punto (5, 13, 40 cm…), nunca 1 por definición.
- Las identidades (sen² θ + cos² θ = 1) y las ecuaciones: sus unidades.

**Temas de la ficha:** se quedan los cinco; la idea 4 toma «Ángulos negativos» y la 5, «Ángulos coterminales».

---

## 2. Objeto de la primera pantalla

Ninguna pieza del kit los dibuja: la idea 1 estrena la pieza **`trig-pos`** (dibujos de prueba, `data-prueba`), que pone
un objeto de fondo detrás del plano de `trig-plano` (las mismas escalas, ejes, rayos, arcos, segmentos y puntos), con su
prueba numérica de encuadre y de rótulos.

| Idea | Objeto | Qué es cada cosa |
| --- | --- | --- |
| 1 | **El plano de un pueblo**: la plaza en el centro, las dos calles principales que se cruzan en ella y las manzanas | la plaza es el origen; la calle hacia el este, el eje x positivo; cada cuadra, una unidad; la casa es P; la línea recta de la plaza a la casa, el radio vector r |
| 2 | **Una rueda de la fortuna** de la feria | el centro de la rueda es el origen; la cabina es P; θ se mide desde el rayo horizontal de la derecha; la cabina queda a la derecha o a la izquierda (signo de x), arriba o abajo (signo de y) |
| 3 | **La veleta de la plaza**, vista desde arriba | la flecha apunta al este, al norte, al oeste o al sur: el lado final cae sobre un eje; su punta es P, a 40 cm del eje de la veleta |
| 4 | **El reloj de pared del aula**, con el minutero | el centro es el origen; el lado inicial apunta al 3; el minutero gira en sentido horario, de 30° en 30° por número |
| 5 | **Una rueda de bicicleta** con su válvula | el eje de la rueda es el origen; la válvula es P; la rueda puede dar más de una vuelta, hacia adelante o hacia atrás |

---

## 3. Misión de «Juega» (meta que el motor comprueba)

| Idea | Contexto + misión | Controles | `logrado` | Lectura en vivo |
| --- | --- | --- | --- | --- |
| 1 | «La plaza es el origen; la casa es P, a x cuadras al este e y al norte.» **Pon la casa al oeste de la plaza, a 5 cuadras en línea recta, donde sen θ = 4/5.** | `x` y `y` (de −4 a 4) y el arrastre de la casa | `x === −3 && y === 4` | «r = √(9 + 16) = 5 cuadras; sen θ = y/r = 4/5» |
| 2 | «La cabina es P; θ se mide desde el rayo de la derecha.» **Deja la cabina donde el seno es negativo y el coseno, positivo.** | `g` (θ, de 0° a 360°, de 45° en 45°) y el arrastre de la cabina | `g === 315` | «cuadrante IV: x > 0 e y < 0; sen θ < 0 y cos θ > 0» |
| 3 | «La flecha de la veleta mide 40 cm; su punta es P.» **Haz que el coseno valga −1.** | `g` (θ, de 0° a 360°, de 90° en 90°) | `g === 180` | «P(−40, 0); sen θ = 0/40 = 0; cos θ = −40/40 = −1» |
| 4 | «El minutero empieza en el 3, sobre el eje x positivo, y gira en sentido horario.» **Haz que el minutero apunte al 8.** | `g` (θ, de 0° a −180°, de 30° en 30°) | `g === −150` | «θ = −150°: el minutero apunta al 8; lado final en el cuadrante III» |
| 5 | «La válvula empieza a la derecha del eje.» **Haz que la rueda gire −315°.** | `g` (de 0° a 315°, de 45° en 45°) y `n` (vueltas, de −2 a 2) | `g === 45 && n === −1` | «θ = 45° + 360° · (−1) = −315°: la válvula queda donde con 45°» |

Cada misión se cumple con un solo caso de su grilla y no al abrir (lo comprueba la prueba de la unidad).

---

## 4. La predicción de cada idea

La app baraja las opciones. Los `datos` solo traen valores, nunca la regla que se predice. Lo que el juego no muestra:
el juego de la idea 1 da solo el seno; el de la 2, los signos del seno y del coseno; el de la 3, el seno y el coseno; el de
la 4 llega hasta −180°; el de la 5 no da ninguna razón.

**Idea 1.** «La casa de Luis está en P(−12, 5): 12 cuadras al oeste y 5 al norte de la plaza. ¿Cuánto vale cos θ?» Datos:
«P(−12, 5): x = −12, y = 5.» y «r = 13 cuadras.» (Decisión 19: antes era P(−8, 6).)

| Opción | Qué mide |
| --- | --- |
| −12/13 | Correcta: x/r |
| 12/13 | Divide bien, sin el signo de x (TR12) |
| 5/13 | Usa la ordenada: eso es el seno (TR11) |
| −12 | Toma la abscisa por el coseno: la razón como una longitud (TR7) |

**Idea 2** (conserva la pregunta y los `id`: `c`, `todo-neg`, `copia`, `cero`; cambia el texto de las opciones). «En 225°
la cabina queda en el cuadrante III: sen θ y cos θ son negativos. ¿Qué signo tiene tan θ = y/x?»

| Opción | Qué mide |
| --- | --- |
| Positivo | Correcta: (−)/(−) = + |
| Negativo, como todo en el III | Cree que en el III todo es negativo (TRPN-TODO-NEG) |
| Negativo, como el seno | Copia el signo del seno (TRPN-COPIA-SEN) |
| Cero: los signos se anulan | Suma signos en vez de dividirlos (TR12) |

**Idea 3** (conserva los `id`: `c`, `cero`, `uno`, `infinito`). «La flecha apunta al norte: θ = 90° y P(0, 40). ¿Cuánto vale
tan θ?» Datos: «P(0, 40): x = 0, y = 40, r = 40 cm.» y «tan θ = y/x.»

| Opción | Qué mide |
| --- | --- |
| No está definida | Correcta: 40/0 no es un número |
| 0 | Pone el 0 arriba (TRPN-TAN-CERO, el error objetivo de la matriz) |
| 1 | Lee y/r, el seno (TR11) |
| Un número infinitamente grande | Toma «crece sin tope» por un valor (TRPN-INFINITO) |

**Idea 4** (nueva). «El juego llegó hasta −180°. ¿En qué cuadrante termina el lado final de −300°?» Datos: «Entre dos
números del reloj hay 30°.» y «Una vuelta mide 360°.»

| Opción | Qué mide |
| --- | --- |
| En el I | Correcta: de −270° a −360° pasa por el I |
| En el IV | Gira 300° en sentido antihorario: olvida el signo (TR15) |
| En el III | Le suma media vuelta en vez de una: −300° + 180° = −120° (TRNEG-180, hipótesis) |
| En ninguno: un negativo no se ubica | Cree que un ángulo negativo no está en el plano (TRIG-NEGATIVO) |

**Idea 5** (conserva el `id` de la idea; pregunta nueva). «Sabemos que cos 60° = 1/2. ¿Cuánto vale cos 780°?» Datos:
«cos 60° = 1/2.» y «Una vuelta mide 360°.»

| Opción | Qué mide |
| --- | --- |
| 1/2 | Correcta: 780° = 60° + 2 · 360° |
| 13/2 | Cree que la razón crece con el ángulo: 780° es 13 veces 60° (TR10) |
| −1/2 | Cree que cada vuelta cambia el signo (TRCOT-SIGNO, hipótesis) |
| No existe: pasa de una vuelta | Cree que un ángulo de más de 360° no tiene razones (TRIG-MAYOR, hipótesis) |

---

## 5. Tabla de letras y símbolos (va también en el campo `letras`)

| Letra | Un solo significado en la unidad | Aviso |
| --- | --- | --- |
| θ | El ángulo en posición normal | Como en toda la rama |
| α, β | Dos ángulos de un mismo problema (¿son coterminales?) | En «Reducción», α es el ángulo de referencia: es otra unidad |
| P | Un punto del lado final (la casa, la cabina, la punta de la flecha, la válvula) | Q, solo en la mesa `mismo-lado`: el punto k veces más lejos |
| x, y | La abscisa y la ordenada de P, con su signo | |
| r | El radio vector: la distancia de P al origen, siempre positiva | Nunca 1 por definición (eso es de «Circunferencia trigonométrica») |
| n | Un número entero de vueltas | |
| a, m | Una coordenada desconocida en los problemas de examen («P(a, 12) con a < 0») | |
| O | El origen | Solo en las figuras |

**R, L, k y m no se usan con otro sentido** (m es el metro; k solo en la mesa `mismo-lado`).

---

## 6. Mapa de colores (§5b: un color fijo por magnitud en la unidad)

Es el de la rama: **el lado lleva el color de su nombre desde el ángulo** (en el plano, el triángulo de P con el eje x).

| Token | Magnitud | Dónde |
| --- | --- | --- |
| `h` carmín | **Los ángulos** θ, α y β, con su arco junto al origen | Las cinco ideas |
| `o` naranja | **La ordenada** y: el tramo vertical del eje x a P (el opuesto a θ) | Las cinco ideas |
| `i` turquesa | **La abscisa** x: el tramo horizontal del origen al pie de P (el adyacente) | Las cinco ideas |
| tinta | **El radio vector** r (el lado final de O a P), los objetos, los ejes y lo que se pide antes de hallarlo («?») | Todas |
| `f` violeta | **El valor de la razón que se pide** (sen θ = 3/5 en la respuesta) | En los textos; en las figuras solo después de resolver |
| `d` verde | No se usa | — |

Reglas que salen de ahí:
- **La respuesta lleva el color de su magnitud:** el valor de una razón en violeta, un ángulo en carmín, una coordenada en
  su color; un cuadrante o un signo, en tinta y negrita.
- En la mesa `mismo-lado`, el segundo punto Q y su factor k van en violeta (en el laboratorio no se pide nada).
- La unidad escribe esta regla en su cabecera, con una prueba que la recorre en las figuras.

---

## 7. Práctica y datos del mundo

### 7a. Qué existe y qué falta

| Idea | Hay | Falta |
| --- | --- | --- |
| 1 Razones con P | p1 y p2 del papel de `circunferencia-trig` (son de razones agudas) | tipos «una razón de P», «una expresión con recíprocas» y «una coordenada que falta» |
| 2 Signos | nada | tipos «signos de dos razones», «el cuadrante por dos signos» y «una razón y el cuadrante» |
| 3 Cuadrantales | nada | tipos «una razón sobre un eje», «una expresión» y «una expresión con múltiplos de θ» |
| 4 Negativos | nada | tipos «el cuadrante de un negativo», «una razón de un negativo» y «el signo de un producto con negativos» |
| 5 Coterminales | p6 del papel (con la paridad, de «Reducción») | tipos «el coterminal entre 0° y 360°», «¿cuál es coterminal?» y «una expresión con vueltas» |

**Plantilla nueva `plantillas/trig-posicion-normal/`**, formato `predicciones`: generador con `TIPOS_POR_IDEA` (tres tipos
por idea, niveles 1 a 3), prueba, `casos.json` verificado con un cálculo aparte y `papel.json` con sus datos al final.
`circunferencia-trig` se queda en la ficha con `"rehacer"` para esta unidad (va a «Más mesas del tema»), y cada problema
de su papel dice de qué unidad es (lección 18): ver la decisión 11. Dos ítems nuevos para la prueba del curso, a la
**reserva** (las formas ya tienen 10 pares): el coseno con un punto del lado final y una razón con el cuadrante.

### 7b. Datos del mundo

| Dato | ¿Fuente? |
| --- | --- |
| Casas a pocas cuadras de la plaza; una cuadra como unidad | Valores de problema: sin fuente |
| Rueda de la fortuna de unos 10 m de radio | Valor de problema, con «unos» |
| Flecha de veleta de 40 cm | Valor de problema: sin fuente |
| El minutero: 30° entre dos números, 360° en una hora | Del reloj mismo |
| Historia: tablas de cuerdas y senos, y la posición normal como organización moderna | Ya trae fuente (MacTutor) |

---

## 8. Riesgos de orden con otras unidades (`requiere`)

**Lo que esta unidad da por sabido:** todo lo de `trigonometria.razones-trigonometricas-agudas` y el giro con signo de
`trigonometria.angulo-trigonometrico` (los dos van en `requiere`). Las coordenadas de un punto y Pitágoras van en «Lee» y
en los `datos`.

**Dentro de la unidad:** la idea 2 usa la 1; la 3, la 1 y la 2; la 4, las tres; la 5, la 4 (los negativos entran en
θ + 360° · n). Ninguna usa algo de una idea posterior.

**Lo que no hay que adelantar:** el ángulo de referencia, la paridad y la cofunción (Reducción); la circunferencia de radio
1 y las líneas (Circunferencia trigonométrica); las identidades.

**Lo que otras unidades toman de aquí:** «Reducción», «Identidades fundamentales» y «Recta en el plano» piden esta unidad.
«Reducción» usa los signos por cuadrante y el coterminal entre 0° y 360°; «Circunferencia trigonométrica» usa los
cuadrantales y TRPN-TAN-CERO; «Identidades» usa TRPN-INVERSA. Los códigos se conservan.

**Avance de los alumnos:** los cuatro `id` de siempre y las tres mesas se conservan; tres ideas cambian de predicción
(`razones-coordenadas`, `cuadrantales` y `coterminales-negativos`; `signos-cuadrante` conserva la pregunta y los `id` de sus
opciones) y la unidad suma `giro-horario`. La unidad entra en `REHECHAS_E6` de `nucleo/avance.js` (una línea, con su
prueba): las predicciones viejas sin huella de esas tres ideas se vuelven a preguntar una vez, y quien había terminado las
cuatro ideas de antes conserva «Ya la estudié».

---

## 9. Decisiones tomadas (Gerson revisa después)

1. **Cinco ideas, con `giro-horario` nueva.** Motivo: la idea 4 de hoy juntaba los coterminales y los negativos, y su
   predicción era la paridad, que es de «Reducción». Los negativos en posición normal (dónde termina el lado final, en qué
   cuadrante) son un tema del catálogo y merecen su predicción (TR15). Descartado: dejar cuatro ideas.
2. **Fuera la paridad y el radio 1.** Motivo: «Reducción» enseña sen(−θ) = −sen θ (su idea `mayores-negativos` la usa en
   su predicción) y «Circunferencia trigonométrica» estrena el radio 1. Aquí un negativo se resuelve con un punto de su
   lado final o con su coterminal, y r mide lo que dé el punto. Descartado: conservar la idea 4 de hoy.
3. **Ningún valor sale del ángulo de referencia.** Las razones de 120°, 210° o 330° piden reducir: aquí no se preguntan
   sin su punto. Sí entran los cuadrantales, los coterminales de 30°, 45°, 60°, 37° y 53°, y todo ángulo con su P.
4. **Objetos:** el plano del pueblo, la rueda de la fortuna, la veleta, el reloj de pared y la rueda de bicicleta, en la
   pieza nueva `trig-pos` (dibujos de prueba, detrás del plano de `trig-plano`). El reloj es objeto de la idea 4 aunque
   «Ángulo trigonométrico» decidió no abrir con él (su decisión 8, para no repetir Geometría): aquí el minutero es justo
   el giro horario con su lado inicial en el 3. Descartado: un molino de viento (menos reconocible) y el plano abstracto.
5. **Colores de la rama:** θ carmín, y naranja (el opuesto), x turquesa (el adyacente), r en tinta (la hipotenusa).
   Motivo: es la regla de «Razones» y de «Triángulos rectángulos» puesta en el plano. Descartado: el mapa de hoy (y en el
   color de los ángulos y r en verde, junto al naranja).
6. **El valor de una razón pedida va en violeta**, como la respuesta de «Razones». Motivo: una razón no es un lado ni un
   ángulo; el violeta queda para lo que se busca casi siempre en esta unidad. Un ángulo pedido va en carmín.
7. **cot, sec y csc se quedan en el glosario de la unidad, sin `simple`** (cambió al escribir: ver la decisión 17). Las
   definiciones con x, y, r van en la regla de la idea 1 y en los `datos`.
8. **La idea 2 conserva su predicción** (el signo de tan 225°) con sus `id` de opción; cambian los textos para que la
   correcta no sea la más corta. La idea 3 conserva los `id` de la suya y cambia el punto (0, 1) por P(0, 40): el radio
   1 es de la unidad siguiente.
9. **Los ángulos de la idea 4 llegan hasta −360°** y los de la idea 5 pasan de una vuelta. Motivo: la idea 4 enseña a
   ubicar el giro horario; la 5, las vueltas enteras con cualquier signo.
10. **`requiere` suma `trigonometria.angulo-trigonometrico`** (el giro con signo, la vuelta y el término «ángulos
    coterminales» vienen de ahí). Motivo: hoy solo pide «Razones», que no enseña el giro.
11. **`circunferencia-trig` se queda con `"rehacer": ["trigonometria.angulos-en-posicion-normal"]`** (a «Más mesas del
    tema») y su papel dice de qué unidad es cada problema (lección 18): p5 y p6 de «Reducción» y de esta unidad (como dice
    `nucleo/repaso-tipos.js`), p7 y p10 de «Funciones trigonométricas», p8 y p9 de «Ecuaciones». p1 a p4 eran de
    «Razones» y de «Triángulos rectángulos», que ya no listan la escena: quedan en esta unidad, como repaso de lo que la
    idea 1 da por sabido (archivo compartido: solo se agrega el campo `unidades`). Descartado: borrar p1 a p4 (es papel de
    otra escena) o marcarlos con una unidad que no es de la plantilla (la regla lo rechaza).
12. **Práctica:** plantilla nueva `trig-posicion-normal` (15 tipos, tres por idea, con `TIPOS_POR_IDEA`) y 8 problemas de
    papel. Descartado: estirar la escena vieja.
13. **Ficha del catálogo:** `grado: 5` (como el resto de la rama), `trig-posicion-normal` primero y `circunferencia-trig`
    después; `requiere` con las dos unidades.
14. **Laboratorio:** se conservan las tres mesas con sus `id` y los de sus controles (colores nuevos). `seis-razones` va a
    las ideas 1 y 3, `mismo-lado` a la 1 y la 2. `giro-y-opuesto` muestra sen(−θ) junto a sen θ (la paridad): pasa a «Más
    mesas del tema» sin idea. Descartado: borrarla (alguien pudo guardarla en su colección).
15. **La prueba del curso** suma dos pares a la reserva (`tri-16` y `tri-17`). Descartado: reemplazar un par de las formas.
16. **El ícono de la unidad** (`app/dibujos/trigonometria.js`) dejaba «+» y «−» en los cuadrantes (los signos del seno,
    con «−» en el III, que es un distractor de la predicción de la idea 2). Pasa a dibujar el lado final, el punto P y su
    arco, sin signos (bloque propio de la unidad). Así no necesita una excepción de `icono-respuesta`.
17. **cot, sec y csc: la definición del curso es la de esta unidad** (con x, y, r). «Razones» las tiene como `local`
    (con los catetos), y «Reducción» y «Circunferencia trigonométrica» las citan en su `ver`: si salen de aquí, esas
    referencias quedan colgando. Van sin `simple` (no son palabras nuevas para quien viene de «Razones») y con tres
    ejemplos. Descartado: borrarlas (la propuesta decía eso; lo corrigió la lectura del glosario armado).
18. **Notas de la sesión sobre la idea 1 (aplicadas):** la regla dice r = √(x² + y²) > 0 y trae las seis razones en el
    cuerpo; el «Vale si» solo trae condiciones (P fuera del origen; sin tan y sec si x = 0; sin cot y csc si y = 0); la
    consigna dice que θ empieza en la calle al este y gira antihorario hasta la casa; la plaza se dibuja (manzana con
    pileta y árboles); la voz de Mara dice que x e y van con su signo; la lectura no racionaliza (3/√13 ≈ 0,83) y el juego
    abre en P(4, 3), con r entero.
19. **La predicción de la idea 1 pasó de P(−8, 6) a P(−12, 5).** Motivo: la regla `antes-predice` vio que la misión
    (sen θ = 4/5) traía casi la respuesta (−4/5); y P(−8, 6) está en el mismo lado final que P(−4, 3). El ejemplo de la
    cotangente pasó a P(35, −12) para no repetir los números.
20. **Las figuras de «¿dónde termina?» no dibujan el lado final** (el cuadrante de −40°, de 200°, el coterminal de 400°):
    va el plano con los cuadrantes, o la rueda antes de girar, con el ángulo escrito. Y el plano del pueblo solo aparece
    donde el enunciado habla de la plaza; en «el lado final pasa por P» va el plano solo (el dibujo es el objeto que nombra
    el texto).
21. **La mesa `giro-y-opuesto` perdió los rótulos de sus dos arcos** (con vueltas enteras caían uno sobre otro; el control
    dice θ). Sigue en «Más mesas del tema».
22. **Prueba del curso:** `tri-16` (el coseno con P(−8, 15) y P(−20, 21)) y `tri-17` (una razón y el cuadrante: sen θ = 3/5
    en el II, cos θ = 5/13 en el IV), con su verificador aparte en `catalogo/pruebas/verificar.js` y seis códigos nuevos en
    el diccionario de errores. El cuadrante va en `datos.modelo` (no es un número del enunciado).
23. **Los ángulos de más de 999° se escriben sin espacio de miles** («1230°»), como decidió «Ángulo trigonométrico» (su
    decisión 17), en la teoría y en la práctica.
