# Propuesta de ideas: «Segmentos y ángulos»

`geometria.segmentos-y-angulos` · Etapa 3 del plan de calidad, primera unidad de la rama «Geometría plana» · fase 1
(`docs/metodo/unidad/1-ideas.md` §A) · 17 nov 2026

Gerson: esto es solo la propuesta. No se escribe nada hasta que la apruebes o la corrijas. Las preguntas que solo tú
puedes contestar están al final (sección 9), cada una con mi recomendación.

Lo que leí: `CLAUDE.md`, `docs/plan-calidad.md` §3 y §7, `docs/molde-unidad.md` entero (con el §5b del 17 nov),
`docs/etapa2/decisiones.md` con sus «Cambios posteriores», las tres propuestas de la etapa 2, la teoría actual
(`contenido/teoria/geometria/segmentos-y-angulos.js`, v0.2.0), su ficha en `catalogo/cursos/geometria.json`, la única
plantilla de la unidad (`plantillas/segmentos-angulos/`: motor, 25 casos, papel y escena), el informe
`docs/investigacion/geometria-ideas-erroneas.md`, los códigos GE-SEG/ANG/CS/BIS/QB de `rutinas/teoria-geometria.md`, la
matriz `docs/teoria/matriz/geometria.json`, `docs/temario-completo.md`, los ítems de la prueba del tema
(`catalogo/pruebas/geometria.json`), las preguntas de San Marcos de `docs/datos/admision-unmsm.csv` y, como nivel, la
unidad de trigonometría rehecha (con su pieza `trig-objeto`) y las piezas `rm-reloj` y `fis-combi`.

**Lo que se pregunta.** La UNI la pone en las semanas 0 y 1 y San Marcos en sus temas 1 y 2 (catálogo); los temarios del
repo no detallan geometría. En el banco Cuzcano hay unas 102 fichas: puntos medios (17), segmentos y su medida (16),
paralelas y una secante (16), máximos, mínimos y rangos (12) y razones de segmentos (10). Lo que más sale es el **punto
medio**, y hoy la teoría no lo enseña. En la admisión real de San Marcos (2019-I a 2027-I) hay tres preguntas de la unidad:

| Periodo | Qué piden | Idea donde cae |
| --- | --- | --- |
| 2024-I (n.º 34) | La distancia entre dos caminos paralelos, con la propiedad del serrucho y el triángulo notable de 30° y 60° | 6, solo la parte de los ángulos (pregunta 6) |
| 2025-II (n.º 33) | Un tramo de un segmento con un punto equidistante (punto medio) y una diferencia dada | 2 |
| 2026-I (n.º 35) | El mayor valor entero de un ángulo, con ángulos consecutivos y otro ángulo agudo; la trampa es el valor límite que la desigualdad estricta excluye | 4 |

Además, esta unidad es requisito de `geometria.triangulos` y de `trigonometria.angulo-trigonometrico`, y la idea 1 de
razones trigonométricas da por sabidos de aquí el ángulo recto, el agudo y el complemento.

---

## 0. Diagnóstico de la teoría actual

1. **Tiene cinco ideas** (`suma-de-segmentos`, `abertura`, `bisectrices`, `paralelas`, `quiebre`), «Lee» en todas y un
   laboratorio de tres mesas con retos que el motor sí comprueba. La base sirve: B que se mueve dentro y fuera del tramo,
   «la medida no depende del largo de los lados», las bisectrices de dos suplementarios que forman 90°, la recta que
   gira y rompe la igualdad (GE17) y la paralela auxiliar del quiebre. Las tarjetas de «Lee» ya hablan de Caracoto, la
   cancha de fulbito, los rieles a Cusco y el camino en zigzag de un cerro.
2. **Punto 1: no hay objeto en ninguna primera pantalla.** Las cinco ideas abren con la pieza `geo-figura` pelada:
   puntos, rayos y arcos. Los objetos de «Lee» solo están escritos.
3. **Punto 2: no hay misión.** Las consignas describen el control («Mueve el punto B…», «Gira el lado OB…», «Cambia
   α…»). Tampoco hay `leyenda`, `aprendizaje`, `actividad` ni `pregunta` (puntos 3 y 12). No declara `calidad: 2`.
4. **Punto 9: la predicción de la idea 1 pide Pitágoras** (AB = √(4² + 3²) = 5, «cada tramo es una hipotenusa»), que
   llega en `geometria.relaciones-metricas`, ocho unidades después. La idea 4 usa en «Mira» los **opuestos por el
   vértice** y la regla de la idea 3 los **adyacentes**, que ninguna idea presenta (solo el glosario).
5. **Falta lo que más se pregunta:** el punto medio (17 fichas, San Marcos 2025-II, y los problemas 2 y 3 del papel),
   los ángulos alrededor de un punto (360°) y los pares externos (los problemas 6 y 7 del papel piden alternos y
   conjugados externos, que la regla no nombra).
6. **Punto 13: ningún ejercicio trae `datos`**, tampoco el papel. No hay ejemplos resueltos (0 de 75). El glosario
   tiene 24 términos (el tope) sin `simple` y solo 6 con ejemplo; faltan «punto medio», «consecutivos» y «externos».
7. **Colores contra §5b.** La cabecera usa la regla vieja: naranja lo que se mueve, verde «la referencia» y carmín «lo
   que se pide». Así AC va en verde junto a AB en naranja (el par que en protanopía cae a 0,010), los ángulos van en
   naranja y turquesa en vez de carmín, la recta que gira va en carmín (el color de los ángulos) y lo pedido va en
   carmín en vez de violeta. La escena `segmentos-angulos` tiene una tercera paleta propia (12 claves).
8. **Punto 7: las lecturas encadenan con «·»** («AB + BC = 12 cm · AC = 10 cm», «α = 60° · β = 120° · α + β = 180°») o
   dan números sueltos («naranjas: 60° · turquesa: 120°»).
9. **«Así se resuelve» es el generador de «Ahora tú» con la semilla s + 900** (lo dice el comentario). En «Ahora tú» de
   paralelas dos opciones llevan GE-QB2 (un código del quiebre) y una es arbitraria (x + 2, «revisa el despeje»). En la
   predicción de paralelas, dos opciones llevan el mismo GE17.
10. Detalles: la cabecera dice «postulante de 3.º», los títulos son frases ingeniosas («Mitades que suman noventa»),
    cuando `docs/teoria.md` 4f pide el nombre del tema, y la prueba del tema solo tiene dos pares (sa-01 de paralelas y
    sa-02 de segmentos).

---

## 1. Las ideas, en orden

Propongo **seis**, el máximo de `docs/teoria.md` §10. Una es nueva (`punto-medio`); las otras cinco conservan su `id` y
los `id` de sus controles (`bx`, `g`, `a`, `t`, `a`/`b`), porque el avance se guarda con ellos. Las tres mesas del
laboratorio tampoco cambian.

| # | `id` | Título (≤ 6 palabras) | `aprendizaje` |
| --- | --- | --- | --- |
| 1 | `suma-de-segmentos` | Suma de segmentos | AB + BC = AC solo si B está en el segmento AC; si B queda fuera, el camino por B es más largo. Con puntos en orden, un tramo se halla sumando y restando los que lo cubren. |
| 2 | `punto-medio` (nuevo) | El punto medio | El punto medio parte un segmento en dos mitades iguales. Si B está entre A y C y M es el medio de AC, B queda a la mitad de AB − BC de M. |
| 3 | `abertura` | Clases de ángulos | Un ángulo mide cuánto se abren sus lados, no cuánto miden: por eso es agudo, recto, obtuso, llano o no convexo. Los consecutivos se suman y una vuelta da 360°. |
| 4 | `bisectrices` | Complemento, suplemento y bisectriz | El complemento de x es 90° − x y su suplemento, 180° − x. Dos adyacentes sobre una recta suman 180°, y la bisectriz parte un ángulo en dos iguales. |
| 5 | `paralelas` | Paralelas cortadas por una secante | Entre paralelas, los ocho ángulos tienen solo dos medidas: los correspondientes y los alternos son iguales y los conjugados suman 180°. Si las rectas no son paralelas, nada de eso vale. |
| 6 | `quiebre` | El quiebre entre paralelas | Si una línea se quiebra entre dos paralelas, el quiebre mide la suma de los ángulos de cada tramo con su paralela; con varios quiebres, lo que abre a un lado suma lo que abre al otro. |

**Por qué va cada una en su lugar y qué da por sabido**

1. **Suma de segmentos.** Es la raíz de la unidad y del curso. «Lee» presenta punto, recta, plano, segmento y «entre»
   (por dos puntos pasa una sola recta). Su predicción ya **no usa Pitágoras**: pregunta si el camino por B es mayor,
   igual o menor, y «Mira» lo mide con la regla del mapa a escala (sección 4). Da por sabido sumar y restar medidas.
   Su «Ahora tú» de nivel examen trae los segmentos que se pisan (AC + BD = AD + BC) y las razones con k («AB : BC =
   2 : 3» va en `datos` como «AB = 2k y BC = 3k»).
2. **El punto medio.** Usa «entre» y la suma de la idea 1. Va antes de los ángulos porque es lo más preguntado y cierra
   los segmentos. Su nivel examen es el de San Marcos 2025-II y los dos medios (MN = (AC + BD)/2). Da por sabido
   dividir entre 2.
3. **Clases de ángulos.** Primera idea de ángulos: vértice, lados, grados, las cinco clases y los **consecutivos**
   (comparten vértice y un lado), que las ideas 4 a 6 usan. Su nivel examen: varios ángulos consecutivos alrededor de un
   punto (suman 360°). Da por sabido el grado como unidad (una vuelta = 360°, va en `datos`).
4. **Complemento, suplemento y bisectriz.** Necesita los consecutivos y el recto y el llano de la idea 3. Aquí se
   estrenan los **adyacentes** sobre una recta (par lineal), que la regla de hoy usa sin presentar. Su nivel examen: las
   cadenas S(C(x)), «el suplemento es m veces el complemento» y el máximo entero de San Marcos 2026-I. Da por sabido
   despejar x en una ecuación de primer grado (pregunta 5).
5. **Paralelas cortadas por una secante.** Usa el suplemento de la idea 4: los vecinos de un cruce son suplementarios y
   los **opuestos por el vértice** son iguales porque los dos son suplemento del mismo vecino («Lee» lo presenta antes de
   que «Mira» lo use). La regla nombra los seis pares, también los externos. Nivel examen: las ecuaciones 3x + 10 = 5x −
   30 y la figura girada (GE9: la figura no cambia con la posición).
6. **El quiebre entre paralelas.** Al final, porque su prueba es una paralela auxiliar y dos pares de alternos de la idea
   5. Su nivel examen es el serrucho de varios quiebres (problema 9 del papel; caso `reglaSerrucho` del motor).

Qué **no** entra: la desigualdad triangular y los rangos de un segmento (son de `triangulos`), la cuaterna armónica
(AB · CD = BC · AD, unas pocas fichas de academia) y la distancia entre las paralelas de San Marcos 2024-I, que pide el
notable de 30° y 60° (de `razones-trigonometricas-agudas`, que viene después).

---

## 2. Objeto de la primera pantalla

| Idea | Objeto | Qué es cada cosa |
| --- | --- | --- |
| 1 | **Una carretera recta con tres pueblos y la combi que va de A a C** (vista como mapa, con sus kilómetros) | A, B y C = pueblos; AB y BC = tramos que recorre la combi; AC = el viaje directo |
| 2 | **El tira y afloja del aniversario del colegio:** la soga de 10 m, el pañuelo atado a su mitad y la raya pintada en el patio | A y C = las puntas de la soga (cada equipo); M = el pañuelo; B = la raya; BM = cuánto ganó un equipo |
| 3 | **El reloj de la plaza y un reloj de pulsera**, a una hora en punto | vértice = el eje de las agujas; lados = las agujas (largas en la plaza, cortas en la pulsera); el ángulo = cuánto se separan |
| 4 | **La tranquera de un estacionamiento:** la barra que sube desde su poste, junto a la pista | α = barra con la pista; 90° − α = barra con el poste; 180° − α = barra con la pista del otro lado |
| 5 | **La línea del tren que cruza una calle** (los rieles a Cusco salen de Juliaca), vista desde arriba | rieles = L₁ y L₂, paralelas; la calle = la secante; los ocho ángulos, en los dos cruces |
| 6 | **Un pasaje que une dos avenidas paralelas y dobla una vez**, como en el mapa del celular | avenidas = L₁ y L₂; el pasaje = PVQ; V = donde dobla; x = el quiebre |

No hay pieza que dibuje casi nada de esto. Propongo una pieza nueva, `geo-objeto`, de prueba (`data-prueba`), con su
prueba numérica de encuadre y rótulos (molde §6): carretera con pueblos (con la combi de `fis-combi` como dibujo), soga
con pañuelo y raya, tranquera, paso del tren y pasaje entre avenidas. Para la idea 3 se reusa `rm-reloj` con dos
opciones nuevas: el arco mayor (el ángulo no convexo) y dos relojes de tamaño distinto (sección 6: también cambian sus
colores). De `trig-objeto` no conviene reusar dibujos: todos sus objetos son triángulos rectángulos, que esta unidad aún
no tiene. Sí se copian su forma de trabajo (cada parte del objeto con su nombre, medidas a una sola escala, prueba de
encuadre) y su lección de color: el color no debe nombrar la respuesta (sección 6).

---

## 3. Misión de «Juega» (meta que el motor comprueba)

| Idea | Contexto + misión | Controles | `logrado` | Lectura en vivo (enuncia una relación) | `bien` |
| --- | --- | --- | --- | --- | --- |
| 1 | «De A a C hay 10 km por la carretera. El pueblo B se mueve por la misma carretera.» **Pon B donde el recorrido de la combi, de A a C pasando por B, mida 14 km.** | `bx` de −2 a 12 km, de 1 en 1 (arrastre del pueblo B) | `Math.abs(v.bx) + Math.abs(10 − v.bx) === 14` (B en −2 o en 12) | «Por B: 12 km + 2 km = 14 km, más que AC = 10 km.» Con B entre A y C: «4 km + 6 km = 10 km: igual a AC.» | «14 km solo con B fuera del tramo AC; entre A y C, el recorrido siempre da 10 km.» |
| 2 | «Tu equipo jala de la punta A; el pañuelo está a la mitad de la soga de 10 m.» **Jala hasta que el pañuelo quede 1,5 m pasado la raya, de tu lado.** | `ab` (soga de tu lado de la raya) de 2 a 8 m, de 0,5 en 0,5 (arrastre de la soga) | `v.ab === 6.5` | «AB = 6,5 m y BC = 3,5 m: AB − BC = 3 m, el doble de BM = 1,5 m.» | «El pañuelo se alejó 1,5 m y entre los dos lados hay 3 m de diferencia: el doble.» |
| 3 | «El minutero marca las 12 y el horario se mueve de hora en hora.» **Pon una hora en punto en que las agujas formen un ángulo llano.** | `g` (se queda el id) de 0° a 330°, de 30° en 30° (arrastre del horario) | `v.g === 180` (las 6:00) | «6:00: 6 espacios × 30° = 180°: las agujas quedan en una recta.» De 7 a 11, el arco mayor: «8:00: 240°, no convexo.» | «A las 6:00 las agujas forman una sola recta: 180°, ángulo llano.» |
| 4 | «La barra de la tranquera sube desde la pista hasta el poste.» **Súbela hasta que su ángulo con la pista sea el doble que su ángulo con el poste.** | `a` (se queda el id) de 10° a 90°, de 10° en 10° (arrastre de la punta de la barra) | `v.a === 60` | «60° con la pista y 30° con el poste: 60° + 30° = 90°.» Al otro lado: «60° + 120° = 180°.» | «60° = 2 × 30°, y 60° + 30° = 90°: el ángulo con el poste es el complemento.» |
| 5 | «Una calle recta cruza los dos rieles del tren.» **Gira la calle hasta que, en un cruce, un ángulo mida el doble que su vecino.** | `t` (se queda el id) de 30° a 150°, de 10° en 10° (arrastre de la punta de la calle) | `v.t === 60 \|\| v.t === 120` | «En los dos cruces: 60° y 120°. Los ocho ángulos tienen solo dos medidas.» | «120° = 2 × 60° y 60° + 120° = 180°; el otro riel repite las mismas dos medidas.» |
| 6 | «El pasaje baja de una avenida a la otra y dobla en V.» **Haz que el pasaje doble en ángulo recto sin que a y b sean iguales.** | `a` y `b` de 20° a 70°, de 5° en 5° (arrastre de P y de Q) | `v.a + v.b === 90 && v.a !== v.b` | «x = 90°, lo mismo que a + b = 35° + 55°.» | «35° + 55° = 90°: el quiebre es la suma de a y b, sean iguales o no.» |

Los controles de las ideas 3 y 4 cambian de rango y de paso, no de `id`. En la idea 3, el juego no trae un control de
tamaño del reloj: eso es lo que pregunta la predicción.

---

## 4. La predicción de cada idea

La app baraja las opciones; los `datos` traen solo valores, nunca la fórmula. Ningún distractor de esta unidad tiene
dato medido: el informe dice «Sin estudios: ángulos entre paralelas», GE17 está en su tabla «Lo que no tiene respaldo» y
los códigos GE-SEG, GE-ANG, GE-BIS y GE-QB son hipótesis de `rutinas/teoria-geometria.md`. Los nuevos llevan «nuevo».
Todos se confirman con la medición del piloto. En la figura de la predicción, lo que se pide va con «?» en tinta.

**Idea 1.** «Esta vez la combi se desvía al pueblo B, que queda fuera de la carretera. ¿Cuánto recorre de A a C
pasando por B?» Datos: AC = 10 km por la carretera; B está a 3 km de la carretera, frente al kilómetro 4.

| Opción | Qué mide |
| --- | --- |
| Más de 10 km, pero menos de 13 km | Correcta (5 km + 6,7 km ≈ 11,7 km, medidos con la regla del mapa en «Mira») |
| Exactamente 10 km: B sigue entre A y C | Suma los tramos sin mirar si B está en la recta (GE-SEG1) |
| Exactamente 13 km: los 10 km más los 3 del desvío | Suma el desvío a AC (GE-SEG2) |
| Menos de 10 km: el desvío acorta | Cree que el rodeo es un atajo (GE-SEG6, nuevo) |

«Mira» explica el 13 sin Pitágoras: cada tramo inclinado es el camino directo entre sus puntas, más corto que ir por la
carretera y luego subir 3 km. Es la misma regla de la idea.

**Idea 2.** «En una avenida recta están, en orden, los paraderos A, B, C y D. Ponen una banca M a la mitad de AB y otra,
N, a la mitad de CD. ¿Cuánto hay de banca a banca?» Datos: AC = 12 m; BD = 18 m.

| Opción | Qué mide |
| --- | --- |
| 15 m | Correcta (MN = (12 + 18)/2; caso «Predicción 2» del motor, con A = 0, B = 4, C = 12, D = 22) |
| 30 m | Suma AC y BD y no divide (GE-PM1, nuevo; es el error que anota ese caso) |
| 7,5 m | Divide entre 4: «dos puntos medios, dos mitades» (GE-PM2, nuevo; también anotado en el caso) |
| No se puede: falta cuánto mide BC | Cree que falta un dato (GE-SEG3) |

**Idea 3.** «Dos fotos: el reloj de la plaza, de agujas de 1 m, a la 1:00, y tu reloj de pulsera, de agujas de 1 cm, a
las 2:00. ¿En cuál las agujas forman el ángulo mayor?» Datos: una vuelta tiene 360°; el reloj tiene 12 números a igual
distancia.

| Opción | Qué mide |
| --- | --- |
| En el reloj de pulsera | Correcta (60° contra 30°) |
| En el de la plaza: sus agujas son más largas | El ángulo crece con el largo de los lados (GE-ANG1; es el «error objetivo» de la matriz) |
| Iguales: los dos marcan una hora en punto | Mismo tipo de hora, mismo ángulo (GE-ANG2) |
| No se pueden comparar: son de distinto tamaño | Cree que el ángulo depende de la escala (GE-ANG4, nuevo) |

**Idea 4.** «La barra forma 50° con la pista de un lado y, del otro lado, el resto de la recta. Se traza la bisectriz de
cada ángulo. ¿Qué ángulo forman las dos bisectrices?» Datos: la pista es una recta: 180°.

| Opción | Qué mide |
| --- | --- |
| 90° | Correcta (25° + 65°) |
| Depende de cuánto suba la barra | No ve que las mitades suman la mitad de 180° (GE-BIS1) |
| 180° | Suma los ángulos completos (GE-BIS2) |
| 50° | Toma las bisectrices por los lados del ángulo (GE-BIS3) |

**Idea 5.** «Más allá, en el desvío de la estación, el riel de arriba se abre 8° y deja de ser paralelo al de abajo; la
calle no se mueve. ¿Qué pasa con los dos ángulos correspondientes?» Datos: la calle forma 60° con el riel de abajo; un
desvío de tren se abre pocos grados.

| Opción | Qué mide |
| --- | --- |
| Dejan de ser iguales: difieren en 8° | Correcta (60° y 52°) |
| Siguen iguales: es la misma calle | Las rectas «se ven» paralelas, o manda la secante (GE17-b: asume paralelas por el aspecto) |
| Ahora suman 180° | Cambia de par: usa lo de los conjugados (GE17-a: iguala o suplementa al revés) |
| Difieren en 16°: el giro cuenta dos veces | Hipótesis nueva (GE-PAR1) |

Propongo partir GE17 en **GE17-a** y **GE17-b**, las dos mitades que el informe ya describe, para que dos opciones no
lleven el mismo código (el defecto que se corrigió en verbal).

**Idea 6.** «Para explicar el quiebre, se traza por V una tercera calle paralela a las avenidas. ¿En qué dos ángulos
queda partido x?» Datos: a = 40°; b = 30°; las tres calles son paralelas.

| Opción | Qué mide |
| --- | --- |
| Uno igual a a y otro igual a b | Correcta (alternos internos con cada avenida) |
| En dos mitades iguales | Cree que la paralela es bisectriz (GE-QB1) |
| En 180° − a y 180° − b | Usa conjugados donde van alternos (GE17-a) |
| En a y 180° − b | Mezcla un alterno con un conjugado (GE-QB3, nuevo) |

---

## 5. Tabla de letras y símbolos

| Letra | Un solo significado en la unidad | Aviso |
| --- | --- | --- |
| A, B, C, D | Puntos en orden sobre una recta (pueblos, paraderos, puntas de la soga) | Solo en las ideas 1 y 2. En la idea 6 de hoy, «B» era un punto del pasaje y «b» un ángulo: se renombran (abajo) |
| AB | El segmento y su medida | Algunos libros escriben AB̅ para el segmento y AB para su medida. La app usa AB para los dos, como hoy; se avisa una vez en «Lee» |
| M, N | Puntos medios | M mayúscula; la m minúscula solo va en m∠ |
| k | Cuánto vale cada parte (AB = 2k, BC = 3k) | El mismo significado que en razones trigonométricas |
| O | Vértice de un ángulo (eje del reloj, pie de la tranquera) | — |
| ∠AOB, m∠AOB | El ángulo y su medida | El papel escribe «m∠AOB»; la teoría, «∠AOB = 40°». Hay que elegir una (pregunta 3) |
| α, β | En la idea 4: la barra con la pista y su suplemento | En Vectores α es el ángulo con el eje x y en razones, el otro agudo: otras unidades. Dentro de esta no choca |
| C(x), S(x) | Complemento y suplemento de x (notación de academia) | **Choca con el punto C.** En las figuras de la idea 4 no se nombra ningún punto C ni S |
| θ | El ángulo de la calle con los rieles (idea 5) | Otro significado que en Vectores y en razones: otra unidad |
| x | Lo que se pide, en cm, m o grados; en la idea 6, el quiebre | Va con su unidad en la respuesta (x = 20°) |
| a, b | Los ángulos de cada tramo del pasaje con su avenida (idea 6) | Los puntos del pasaje pasan a ser **P, V y Q**, como los cruces P y Q de la idea 5 (mismo papel: un punto en cada paralela) |
| L₁, L₂, ∥ | Las dos rectas paralelas | Con subíndice de verdad (`<tspan>` en el SVG) |
| °, cm, m, km | Unidades | Todo número lleva la suya; el ángulo, siempre «°» |

---

## 6. Mapa de colores por magnitud (§5b)

En esta unidad casi todo es ángulo o segmento, y las letras (AC, θ) no son magnitudes fijas como la Q de química:
cambian de un problema a otro. Por eso propongo que el color siga a **lo que el segmento o el ángulo es en la figura**,
igual en toda la unidad, como en razones trigonométricas sigue al nombre del lado:

| Token | En esta unidad |
| --- | --- |
| tinta | el segmento de punta a punta (AC en la idea 1, AD con cuatro puntos, la soga entera), con su cota; las rectas, la secante, las agujas, la barra; los rayos de las bisectrices, discontinuos |
| `o` naranja | el primer tramo que se junta (de izquierda a derecha): AB en la idea 1, AC cuando se pisa con BD |
| `i` turquesa | el segundo tramo: BC, BD. En ángulos: **el compañero**, el que mide 180° − θ (o 90° − α) |
| `h` carmín | el ángulo que se da o se mueve, con su arco y su letra: α, θ, a y b (estos dos se distinguen por letra y arco, como θ y α en razones), y **los ángulos que miden lo mismo que él** |
| `f` violeta | lo que se pide, ya resuelto (BC = 8 cm, x = 20°). Antes de resolverlo, «?» en tinta |
| `d` verde | no se usa: todo dibujo de la unidad tiene naranja o carmín al lado |

- **Igual medida, igual color.** Dos tramos iguales (AM y MB) llevan el mismo color y su rayita; los ángulos iguales
  entre paralelas, el mismo carmín, y sus compañeros, el mismo turquesa. Así el juego de la idea 5 muestra a la vista
  que «los ocho son dos medidas». Las mitades de una bisectriz llevan el color de su ángulo, con una rayita (α) o dos (β).
- **Excepción, como la idea 1 de razones:** en Predice, «Ahora tú», «Así se resuelve» y los ejemplos de las ideas 4 a 6,
  todo ángulo dado va en carmín, se iguale o no, porque lo que se practica es decidir si dos ángulos son iguales o
  suplementarios: el turquesa del compañero lo diría por el alumno. Una prueba en 400 semillas lo comprueba.
- La recta que gira en la predicción de la idea 5 va en tinta discontinua, con el rastro de la paralela (hoy va en
  carmín). En `rm-reloj` las agujas pasan a tinta y el ángulo a carmín (hoy: minutero naranja, horario turquesa y ángulo
  verde, el par naranja–verde que no se distingue en protanopía). Es una opción nueva de la pieza; razonamiento
  matemático queda como está hasta su turno.

| Idea | Naranja | Turquesa | Carmín | Violeta | Tinta |
| --- | --- | --- | --- | --- | --- |
| 1 | AB | BC | — | BC pedido, resuelto | AC, la carretera |
| 2 | AB | BC | — | BM o MN | la soga AC; AM = MC llevan tinta con su rayita |
| 3 | — | — | ∠ entre las agujas | la clase o la medida pedida | las agujas |
| 4 | — | 90° − α o 180° − α | α y sus mitades | x | la pista, el poste, las bisectrices |
| 5 | — | los cuatro de 180° − θ | θ y sus tres iguales | x | rieles y calle |
| 6 | — | — | a, b y sus copias en V | x | avenidas, pasaje, paralela auxiliar |

La escena `segmentos-angulos` (12 claves propias) y la mesa `secante-y-giro` (giro en carmín) se corrigen cuando se
rehaga su práctica.

---

## 7. Práctica: qué existe y qué falta por idea

Lo que hay:
- **La escena `segmentos-angulos`** (borrador 0.1.0, «Paso a paso» y «¿Qué pasa si…?»). Su **motor** sirve casi entero
  para los generadores: `recta`, `solapados`, `puntosMedios`, `medioYDiferencia`, `angulo`, `cadena`, `resolverAngulo`,
  `bisectrices`, `cruce`, `paralelas`, `ochoAngulos`, `ecuacionPar`, `noParalelas`, `quiebre` y `reglaSerrucho`, con 25
  casos verificados aparte.
- **Su papel:** 10 problemas, sin `datos`: p1 (idea 1), p2 y p3 (idea 2), p4, p5 y p10 (idea 4), p6 y p7 (idea 5, pares
  externos), p8 y p9 (idea 6). Nada de la idea 3.
- **Generador: ninguno** (el temario dice «Prácticas que ya existen: ninguna»). Los «Ahora tú» viven dentro de la teoría.
- **Mesas:** `punto-libre` (idea 1), `secante-y-giro` (idea 5) y `quiebre` (idea 6).
- **Prueba del tema:** sa-01 (idea 5) y sa-02 (idea 1).

| Idea | Hay | Falta |
| --- | --- | --- |
| 1 Suma | papel p1; mesa `punto-libre`; `solapados` y `recta`; prueba sa-02 | tipos «un tramo con puntos en orden», «segmentos que se pisan» y «razón con k» |
| 2 Punto medio | papel p2 y p3; `puntosMedios` y `medioYDiferencia` | todo el tipo «punto medio» (el de San Marcos 2025-II y los dos medios); una mesa (la soga); ítem de prueba |
| 3 Clases | `angulo` (clase) | tipos «clase de un ángulo consecutivo» y «alrededor de un punto: 360°»; papel; ítem de prueba |
| 4 Complemento | papel p4, p5 y p10; `cadena`, `resolverAngulo`, `bisectrices` | sacar a la plantilla los tres tipos que hoy están en la teoría; tipo «máximo entero» (San Marcos 2026-I); una mesa (la tranquera) |
| 5 Paralelas | papel p6 y p7; mesa `secante-y-giro`; `ecuacionPar`; prueba sa-01 | tipos «ecuación con un par» (los seis pares) y «¿son paralelas?» (`noParalelas`); quitar el distractor x + 2 |
| 6 Quiebre | papel p8 y p9; mesa `quiebre`; `quiebre` y `reglaSerrucho` | tipos «un quiebre» y «serrucho»; ítem de prueba |

Propuesta: una plantilla nueva de formato `predicciones`, `plantillas/geo-segmentos-angulos/`, con los tipos separados
por idea, que llame al motor de `segmentos-angulos` (no lo copia), con `datos` por línea, prueba en 400 semillas,
`casos.json` verificado aparte y papel de 5 a 10 por idea. El papel de hoy pasa a esa plantilla con sus `datos` al
final. La escena queda en «Más mesas del tema».

---

## 8. Datos del mundo

La unidad casi no necesita datos del mundo: los objetos son de todos los días y sus medidas, de problema. Tienen que ser
posibles (punto 10).

| Dato | ¿Fuente? |
| --- | --- |
| Carretera de 10 km con un desvío de 3 km, soga de 10 m, agujas de 1 m y 1 cm, tranquera de 10° a 90°, calle a 60° | Valores de problema: sin fuente. Son posibles |
| «Caracoto queda entre Juliaca y Puno» (tarjeta de «Lee» de hoy) | Es un hecho de mapa, sin cifra. Lo compruebo en el mapa vial del MTC antes de dejarlo |
| La distancia real de Juliaca a Puno | **No usar** sin fuente (MTC o Provías). La carretera del juego no lleva nombre de pueblos reales |
| Los rieles del tren a Cusco salen de Juliaca | Es la ruta conocida del Ferrocarril del Sur; sin cifra, sin fuente. El ancho de la vía no se usa |
| Un desvío de tren se abre pocos grados (8° en la predicción) | Valor de problema, «unos». No afirmo el ángulo real de los desvíos de PeruRail |
| 30° entre dos números del reloj, 6:00 = 180° | Cálculo (360° ÷ 12), no dato |
| Historia: los Elementos de Euclides, libro I | Ya trae fuente (edición de D. E. Joyce, Clark University) |

---

## 9. Preguntas para Gerson

1. **¿Seis ideas, con `punto-medio` como idea propia?** Recomiendo que sí: es lo que más sale en el banco (17 fichas) y
   en San Marcos 2025-II, y hoy no está. La otra opción es meterlo en el «Ahora tú» de la idea 1, pero se pierde su
   predicción y la idea 1 queda con dos reglas. Seis es el tope de `docs/teoria.md`.
2. **Colores (sección 6).** ¿Apruebas que el color siga a lo que es cada cosa en la figura (el todo en tinta, tramos
   naranja y turquesa, el ángulo dado y sus iguales en carmín, el compañero en turquesa) con la excepción de que en los
   ejercicios de las ideas 4 a 6 todo ángulo dado va en carmín? Recomiendo que sí; es lo mismo que se aprobó en razones
   (el color sigue al nombre, y no nombra la respuesta).
3. **Notación del ángulo: «m∠AOB = 40°» o «∠AOB = 40°».** El papel usa la primera y la teoría la segunda. Recomiendo
   «m∠AOB» en enunciados y `datos`, como los libros de academia (lo confirmo con un libro de `fuentes/` antes de
   escribir), y «∠AOB» solo para nombrar el ángulo en «Lee» y en la figura. Y para el complemento, ¿C(x) y S(x) como en
   academia? Recomiendo que sí, sin puntos C ni S en esas figuras.
4. **Pitágoras fuera de la idea 1.** La predicción de hoy lo necesita y llega ocho unidades después. Recomiendo la
   versión de la sección 4 (mayor, igual o menor, medido con la regla del mapa) y no darlo como dato: aquí la regla es
   «el camino directo es el más corto».
5. **`requiere`.** Hoy es `[]` (raíz del curso, siempre abierta). Las ideas 4 y 5 despejan x en 3x + 10 = 5x − 30.
   Recomiendo agregar `algebra.ecuaciones-lineales-y-cuadraticas` como consejo (es de otro curso: no cierra nada) y no
   tocar lo demás.
6. **San Marcos 2024-I** (serrucho más el notable de 30° y 60°). Recomiendo usar aquí solo su parte de ángulos y llevar
   la pregunta completa al nivel examen de `razones-trigonometricas-agudas` (idea 3) o de `triangulos-rectangulos`,
   donde el notable ya se sabe.
7. **Pares externos.** ¿Entran en la regla de la idea 5? Recomiendo que sí: el papel ya los pide (p6 y p7) y es una
   línea más en «Lee» y en la regla.
8. **Objetos.** ¿Te sirven la combi en la carretera, el tira y afloja del colegio, el reloj de la plaza con el de
   pulsera, la tranquera, el tren que cruza la calle y el pasaje entre avenidas? Los dibuja la sesión como prueba (pieza
   `geo-objeto` nueva y `rm-reloj` con dos opciones), y tú decides cuáles reemplazas.
9. **Códigos.** ¿Parto GE17 en GE17-a (iguala o suplementa al revés) y GE17-b (paralelas por el aspecto), y agrego los
   nuevos GE-SEG6, GE-PM1, GE-PM2, GE-ANG4, GE-PAR1 y GE-QB3 como hipótesis? Recomiendo que sí, anotados en
   `rutinas/teoria-geometria.md` y en el informe.
10. **Títulos.** Propongo cambiar los títulos ingeniosos por el nombre del tema (sección 1), como pide `docs/teoria.md`
    4f. El `id` no cambia. Si prefieres conservar alguno, dime cuál.
