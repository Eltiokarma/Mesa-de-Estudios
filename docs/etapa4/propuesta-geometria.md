# Propuesta de ideas: «Triángulos y líneas notables»

`geometria.triangulos` · Etapa 4 del plan de calidad, segunda unidad de la rama «Geometría plana» (sigue a «Segmentos y
ángulos») · fase 1 (`docs/metodo/unidad/1-ideas.md` §A) · 18 nov 2026

Gerson: esto es solo la propuesta. No se escribe nada hasta que la apruebes o la corrijas. Las preguntas que solo tú
puedes contestar están al final (sección 9), cada una con mi recomendación.

Lo que leí: `CLAUDE.md`, `docs/plan-calidad.md` §3 y §7, `docs/molde-unidad.md` entero (con las reglas del 18 nov en §3:
qué muestra el dibujo de un ejemplo y las marcas de igualdad sobre una llave), `docs/metodo/unidad/LEEME.md` y
`1-ideas.md` §A, `docs/etapa2/decisiones.md` («Cambios posteriores»), `docs/etapa3/decisiones.md` (las cinco rondas), la
propuesta de Segmentos y ángulos (`docs/etapa3/propuesta-geometria.md`) como modelo, la teoría actual
(`contenido/teoria/geometria/triangulos.js`, v0.2.0), su ficha en `catalogo/cursos/geometria.json`, sus dos plantillas
(`triangulo-estira`: escena, motor, casos y papel; `geo-triangulos-notables`: generador, casos y papel), el informe
`docs/investigacion/geometria-ideas-erroneas.md`, `docs/temario-completo.md` (unidad 2), la matriz
`docs/teoria/matriz/geometria.json`, los ítems de `catalogo/pruebas/geometria.json`, las preguntas de San Marcos de
`docs/datos/admision-unmsm.csv` (con las trampas de `docs/clasificacion/trampas-admision-unmsm/geometria-trigonometria.md`),
y como nivel, `contenido/teoria/geometria/segmentos-y-angulos.js` con sus piezas `geo-objeto` y `geo-figura`, su
auditoría y las correcciones de las dos rondas del lector. Para no adelantar contenido revisé las ideas de las unidades
que vienen: congruencia, polígonos, circunferencia, proporcionalidad, puntos notables, relaciones métricas y áreas.

---

## Lo que pregunta la admisión

**Catálogo:** UNI, semana 1; San Marcos, temas 2 y 3. **Banco Cuzcano:** unas 98 fichas. Lo que más sale es
**triángulos isósceles y equiláteros (27)**, después líneas notables (23), ángulos formados por bisectrices (17),
triángulos y líneas notables (13) y ángulos del triángulo (9). **El isósceles, lo más preguntado, hoy no se enseña:**
solo lo nombra el glosario («los ángulos frente a esos lados también son iguales»).

**San Marcos, admisión real 2019-I a 2027-I:** siete preguntas clasificadas en esta unidad.

| Periodo (examen) | Qué piden | Idea donde cae |
| --- | --- | --- |
| 2019-II (9 mar 2019, n.º 36) | Longitud entera mínima con un isósceles auxiliar y la desigualdad triangular | 4, nivel examen (usa la 3) |
| 2023-I (10 dic 2022, n.º 34) | Valor entero de un lado con un ángulo obtuso, una relación de ángulos y la desigualdad. El solucionario concluye que no hay valor: pregunta mal planteada | La relación de ángulos, en la 3 (lado mayor frente al ángulo mayor); la condición de obtuso **no** entra aquí (pregunta 2) |
| 2024-I (áreas D y E, n.º 35) | El mayor ángulo entre un cable y una antena, con la suma de ángulos y el ángulo exterior | 2, nivel examen |
| 2024-I (área A, n.º 35) | Diferencia de costo entre los cercos de perímetro máximo y mínimo, con un ángulo obtuso y lados enteros. Clave dudosa: la respuesta correcta no está entre las alternativas | Necesita x² > a² + b²: va a Relaciones métricas (pregunta 2) |
| 2025-I (áreas D y E, n.º 33) | Suma de dos ángulos en un logotipo con dos triángulos de ángulos iguales y un cuadrilátero | 1, nivel examen (la «mariposa»: dos triángulos opuestos por el vértice) |
| 2025-II (área A, n.º 35) | Un tramo de un corte en un triángulo donde la condición de los ángulos forma un isósceles | 3, nivel examen (el recíproco: ángulos iguales, lados iguales) |
| 2026-I (áreas B y C, n.º 35) | Menor perímetro entero con un punto interior a distancias dadas de dos vértices; la trampa es el valor límite que la desigualdad estricta excluye | 4, nivel examen |

Además, **el isósceles es la herramienta de otras nueve preguntas de San Marcos** clasificadas en congruencia (2022,
2024-I, 2024-II, 2025-I dos veces, 2025-II), circunferencia (2019-I), proporcionalidad (2020-I) y relaciones métricas
(2025-I). Y la unidad es requisito de
`geometria.congruencia`, `poligonos-y-cuadrilateros`, `circunferencia` y `trigonometria.razones-trigonometricas-agudas`.

---

## 0. Qué tiene hoy la unidad y qué se queda o sale

1. **Cuatro ideas** (`suma-de-angulos`, `desigualdad`, `lineas-notables`, `angulo-de-bisectrices`), «Lee» en todas y un
   laboratorio de tres mesas con retos que el motor comprueba (`triangulo-libre`, `bisagra-libre`, `bisectrices`). La
   base sirve: la paralela por A que ordena los tres ángulos en una recta, la bisagra con sus dos extremos aplastados, la
   altura que sale fuera en el obtusángulo (GE7, el único error de la unidad con datos) y el ángulo BIC que solo depende
   de A.
2. **Punto 1: no hay objeto en ninguna primera pantalla.** Las cuatro abren con `geo-figura` pelada. Los objetos solo
   están escritos en «Lee» (el techo de calamina, tres palitos, la bisagra, el triángulo de papel que se dobla).
3. **Punto 2: no hay misión.** Las consignas describen el control («Mueve el vértice A con la base BC fija…», «Cambia los
   ángulos B y C…»). Tampoco hay `leyenda`, `aprendizaje`, `actividad` ni `pregunta`. No declara `calidad: 2`; dice
   `estado: 'completa'` y la cabecera dice «postulante de 3.º».
4. **Títulos ingeniosos** («Tres ángulos caben en una recta», «El tercer lado tiene límites», «Cada línea, por su
   condición»), cuando `docs/teoria.md` 4f pide el nombre del tema.
5. **Colores contra §5b.** A naranja, B turquesa, **C verde** (verde junto a naranja: el par que en protanopía cae a
   0,010), lo pedido en carmín en vez de violeta. En líneas notables, altura carmín, mediana turquesa, bisectriz naranja y
   **mediatriz verde**. Y lo más grave: **en «Así se resuelve» y «Ahora tú» de líneas notables la línea va en su color
   fijo, que es justo lo que se pregunta** («¿Qué línea notable es?»): el color da la respuesta, y «Lee» lo anuncia («el
   rojo de la altura, el turquesa de la mediana…»).
6. **Punto 7: lecturas con «·» y números sueltos.** «A + B + C = 180° · acutángulo escaleno», «Pies: H en 1,5 · M en 3 ·
   D en 2,6», «x ≈ 7,2» (sin unidad). La posición de D sale del teorema de la bisectriz (Proporcionalidad, después) y nadie
   la explica.
7. **Punto 5: la letra del punto hace de ángulo.** «A = 50°», «B = 70°», sin m∠. Los lados de la bisagra no tienen unidad
   («5 y 8»).
8. **El juego de la idea 1 muestra sumas falsas.** A se mueve por puntos enteros y los ángulos salen con decimales: en 6
   de las 45 posiciones los tres rótulos redondeados suman 179° o 181° (por ejemplo A = (4, 5): 60° + 51° + 68°).
   Comprobado con un script aparte.
9. **«Así se resuelve» es el generador de «Ahora tú» con la semilla s + 900**, el mismo problema. «Ahora tú» de la idea 1
   solo pide el exterior; el de líneas notables solo reconoce la línea; el de la desigualdad solo cuenta enteros. En
   varias predicciones dos opciones llevan el mismo código (GE7 dos veces en la altura, GE-BIS5 dos veces en bisectrices,
   GE-DT3 en «Ahora tú» de la desigualdad).
10. **Punto 13: ningún ejercicio trae `datos`.** No hay ejemplos resueltos (0 de 60). El glosario tiene 20 términos sin
    `simple` y solo 3 con ejemplo.
11. **Punto 9 dentro de la unidad:** «Lee» de la idea 4 presenta el incentro (Puntos notables, después). Eso no es
    grave, pero hay que decidir dónde vive el ángulo BIC (pregunta 3).
12. **Falta lo más preguntado:** el isósceles y el equilátero, el ángulo exterior como idea con su juego (la suma de los
    exteriores, el cuadrilátero cóncavo), la relación entre el lado mayor y el ángulo mayor, el ángulo entre la altura y la
    bisectriz, y las dos bisectrices exteriores (90° − m∠A/2).
13. **La prueba del tema no tiene ningún ítem de esta unidad** (los pares geo-04 y geo-05 usan `triangulo-estira`, pero
    son de Áreas y de Relaciones métricas).

**Se queda:** los cuatro `id` de idea y los `id` de sus controles (`g`, `ax` de líneas notables, `b` y `c`; los de la
idea 1, pregunta 6), la paralela por A, la bisagra con sus extremos (ahora una lámpara), la predicción del obtusángulo, el
«Mira» de BIC y BEC, las tres mesas con sus `id`, la historia de los Elementos I.32 (con su fuente) y casi todo el
glosario, que gana `simple` y ejemplos.

**Sale o cambia:** los títulos; los colores (sección 6); «A = 50°» pasa a m∠A; la predicción de la idea 1 (el exterior)
se va a la idea 2 nueva; la lectura con la posición de D; las líneas en color en los ejercicios de reconocer; el pie de la
bisectriz pasa de D a F; la palabra «incentro» como teoría (queda como «se explica en Puntos notables»); los términos
«proposición» y «demostración» del glosario si hace falta espacio (tope 30).

---

## 1. Las ideas, en orden

Propongo **seis**, el máximo de `docs/teoria.md` §10. Dos son nuevas (`angulo-exterior` e `isosceles`); las otras cuatro
conservan su `id`.

| # | `id` | Título (≤ 6 palabras) | `aprendizaje` |
| --- | --- | --- | --- |
| 1 | `suma-de-angulos` | Suma de ángulos interiores | Los tres ángulos interiores de un triángulo suman 180°, sea cual sea su forma; por eso solo uno puede ser recto u obtuso. |
| 2 | `angulo-exterior` (nueva) | El ángulo exterior | Un ángulo exterior mide lo que suman los dos interiores que no están a su lado, y los tres exteriores dan una vuelta: 360°. |
| 3 | `isosceles` (nueva) | Triángulo isósceles y equilátero | Frente a lados iguales hay ángulos iguales, y al revés; frente al lado mayor, el ángulo mayor. Equilátero: tres ángulos de 60°. |
| 4 | `desigualdad` | Desigualdad triangular | Cada lado es menor que la suma de los otros dos y mayor que su diferencia; en los extremos no hay triángulo, solo un segmento. |
| 5 | `lineas-notables` | Líneas notables | Cada línea notable se reconoce por su condición: la altura es perpendicular y puede caer fuera; mediana, bisectriz y altura coinciden solo en el isósceles. |
| 6 | `angulo-de-bisectrices` | Ángulos entre bisectrices | Las bisectrices interiores de B y C forman 90° + m∠A/2; una interior y una exterior, m∠A/2: solo importa el ángulo A. |

Las preguntas del Resumen (`pregunta`): 1 «¿Cuánto suman los ángulos de cualquier triángulo?»; 2 «¿Cuánto gira un
mototaxi en cada esquina de una plaza triangular?»; 3 «¿Qué ángulos son iguales cuando dos lados son iguales?»; 4 «¿Con
qué tres largos se puede armar un triángulo?»; 5 «¿Cómo se distingue la altura de la mediana y la bisectriz?»; 6 «¿De qué
depende el ángulo donde se cruzan dos bisectrices?». Ninguna descarta una alternativa de su predicción.

**Por qué va cada una en su lugar y qué da por sabido**

1. **Suma de ángulos interiores.** La raíz de la unidad. «Lee» presenta triángulo, vértice y lado (vértice y lado ya
   vienen de Segmentos), ángulo interior y las tres clases por ángulos. «Mira» junta las tres esquinas recortadas de la
   cartulina sobre el borde recto y explica por qué siempre: la paralela por A y dos pares de alternos internos (de
   Segmentos, idea 5). Su «Ahora tú» de nivel examen: ángulos en razón (2k, 3k, 4k), con x, y la «mariposa» de San
   Marcos 2025-I (dos triángulos opuestos por el vértice: a + b = c + d, con los opuestos por el vértice de Segmentos).
2. **El ángulo exterior.** Usa la suma de la idea 1 y el par adyacente de Segmentos (el exterior y el interior suman
   180°). Hoy está metido como predicción de la idea 1; aquí gana juego, regla propia y la suma de los tres exteriores. Su
   nivel examen: el cuadrilátero cóncavo (la «punta de flecha», x = a + b + c, con dos exteriores) y San Marcos 2024-I.
3. **Isósceles y equilátero.** Usa la suma (los ángulos de la base miden (180° − θ)/2) y, en «Mira», el exterior de la
   idea 2: la prueba de que el lado mayor está frente al ángulo mayor marca en el lado largo un tramo igual al corto (sale
   un isósceles) y compara con un exterior (Elementos I.18). La igualdad de los ángulos de la base se ve doblando el
   compás de papel por la mitad, sin congruencia (que viene después). «Lee» presenta las tres clases por lados. Nivel
   examen: el recíproco de San Marcos 2025-II, el equilátero con un exterior y la cadena de isósceles (AB = BC = CD) de
   academia.
4. **Desigualdad triangular.** Solo usa lados. Va después del isósceles para que su nivel examen traiga el isósceles de
   lados 4 y 9 (el tercero no puede ser 4: 4 + 4 < 9) y el isósceles auxiliar de San Marcos 2019-II. «Lee» recuerda la
   idea 1 de Segmentos: el camino por B es más largo que el directo. Nivel examen: valores enteros, la diagonal de un
   cuadrilátero (dos desigualdades a la vez) y el punto interior de San Marcos 2026-I.
5. **Líneas notables.** Necesita el isósceles (las tres coinciden solo ahí, el «error objetivo» de la matriz, GE8) y, de
   Segmentos, el punto medio, la bisectriz y el ángulo recto. «Lee» presenta perpendicular, pie, ceviana, altura, mediana,
   bisectriz y mediatriz, y las marcas (cuadradito, rayitas sobre llave, arcos). Nivel examen: el ángulo entre la altura y
   la bisectriz que salen del mismo vértice, (m∠B − m∠C)/2, con la suma de la idea 1.
6. **Ángulos entre bisectrices.** Al final, porque usa la bisectriz como línea (idea 5), la suma (idea 1) y el exterior
   (idea 2: la bisectriz exterior parte el exterior). La regla trae las tres: dos interiores, 90° + m∠A/2; interior y
   exterior, m∠A/2; dos exteriores, 90° − m∠A/2. Nivel examen: el inverso (dado ∠BIC, halla m∠A) y cadenas con un
   exterior.

**Temas de la ficha:** propongo agregar «Triángulo isósceles y equilátero» y «Relación entre lados y ángulos» a los cinco
de hoy (el catálogo sí puede crecer; el `id` no cambia).

**Qué no entra** (y dónde va):
- La condición de obtusángulo con lados (x² > a² + b²) y todo lo que use Pitágoras: Relaciones métricas («Pitágoras
  corregido: la proyección»). Pregunta 2.
- Los triángulos notables (30° y 60°, 37° y 53°): Congruencia.
- El área con la altura: Áreas poligonales. La idea 5 no calcula áreas.
- El teorema de la bisectriz (BF/FC = AB/AC): Proporcionalidad.
- Que los puntos de la mediatriz equidistan de los extremos: Congruencia («Puntos que equidistan»). Aquí la mediatriz solo
  se define.
- Los nombres incentro y excentro como teoría, el baricentro y la recta de Euler: Puntos notables.
- La suma 180° · (n − 2) de los polígonos: Polígonos y cuadriláteros.

---

## 2. Objeto de la primera pantalla

| Idea | Objeto | Qué es cada cosa |
| --- | --- | --- |
| 1 | **Un triángulo de cartulina sobre la mesa**, con una regla al lado (en «Lee», el tijeral de un techo, que no se deforma) | A, B y C = las puntas de la cartulina; los ángulos interiores = sus esquinas; en «Mira», las tres esquinas recortadas se juntan sobre el borde de la regla |
| 2 | **Una plaza triangular y el mototaxi que la rodea** (vista desde arriba) | A, B y C = las esquinas; los lados = las calles; el giro en una esquina = cuánto cambia de dirección el mototaxi: el ángulo exterior |
| 3 | **El compás abierto sobre la hoja**, con la raya que une sus puntas (en «Predice», un techo a dos aguas con un lado más largo) | A = la bisagra del compás; AB y AC = las patas, iguales; BC = la raya entre las puntas; θ = la abertura; α = cada ángulo de una pata con la raya |
| 4 | **Una lámpara de escritorio de brazo articulado** (vista de costado) | C = el pie; B = el codo; A = la cabeza; CB y BA = los dos brazos (40 cm y 25 cm); AC = la distancia del pie a la cabeza, el tercer lado |
| 5 | **Un caserío junto a una carretera recta con dos paraderos** (como mapa; reusa la carretera de `geo-objeto`) | A = el caserío; B y C = los paraderos; BC = el tramo de carretera; la altura = el camino recto que llega a la carretera en ángulo recto; la mediana = el camino al punto del medio del tramo; la bisectriz = el camino que parte en dos el ángulo en A |
| 6 | **Un parque triangular con dos caminos que se cruzan en la pileta** | B y C = dos esquinas; cada camino parte su esquina en dos ángulos iguales (una bisectriz); I = la pileta, donde se cruzan |

Todos se dibujan como **prueba** (`data-prueba`) en `geo-objeto`, como en Segmentos: la pieza arma el triángulo con
`geo-figura` a escala (cada ángulo con su valor real) y pone el objeto debajo, con la prueba numérica de encuadre y de
rótulos (molde §6; las reglas de la auditoría de Segmentos: rótulo dentro de su ángulo, sin tocar un trazo, marcas a
10 px o más, arcos consecutivos con radios distintos). La carretera de la idea 5 es la misma de Segmentos, idea 1.

---

## 3. Misión de «Juega» (meta que el motor comprueba)

| Idea | Contexto + misión | Controles | `logrado` | Lectura en vivo (enuncia una relación) | `bien` |
| --- | --- | --- | --- | --- | --- |
| 1 | «Recortaste un triángulo de cartulina; la base BC no se mueve.» **Mueve la punta A hasta que su ángulo mida lo mismo que los otros dos juntos.** | arrastre de A; ángulos en B y C de 5° en 5° (pregunta 6) | m∠A = 90° | «50° + 70° + 60° = 180°: los tres llenan una recta.» | «90° = 45° + 45°, y entre los tres, 180°: llenan una recta.» |
| 2 | «El mototaxi da la vuelta a la plaza; en cada esquina dobla.» **Mueve la esquina A hasta que el mototaxi gire 120° en la esquina C.** | `b` y `c`, ángulos de la plaza en B y C, de 30° a 80°, de 10° en 10° (arrastre de A) | `180 − v.c === 120` | «Giro en C = m∠A + m∠B = 50° + 70° = 120°.» | «120° = 50° + 70°: el giro en C suma los ángulos de A y B.» |
| 3 | «Las dos patas del compás miden 12 cm.» **Abre el compás hasta que sus puntas queden tan lejos como mide cada pata.** | `t`, abertura θ, de 20° a 80°, de 10° en 10° (arrastre de una punta) | `v.t === 60` | «Patas de 12 cm: 70° y 70° abajo; arriba, 40°.» | «Puntas a 12 cm: tres lados iguales y tres ángulos de 60°.» |
| 4 | «Los brazos de la lámpara miden 40 cm y 25 cm.» **Estira el codo hasta que la cabeza quede a más de 64 cm del pie.** | `g` (se queda), ángulo del codo, de 15° a 165°, de 15° en 15° | `v.g === 165` (AC ≈ 64,5 cm; con 150°, 62,9 cm) | «AC ≈ 64,5 cm, menos que 40 + 25 = 65 cm.» | «64,5 cm se acerca a 40 + 25 = 65 cm, pero no llega.» |
| 5 | «Del caserío A salen tres caminos rectos a la carretera.» **Mueve el caserío hasta que la altura y la mediana sean un solo camino.** | `ax` (se queda), de 1 a 5 km, de 0,5 en 0,5 (arrastre del caserío) | `v.ax === 3` | «H a 1,5 km de M: AB ≠ AC, caminos distintos.» | «Un solo camino cuando AB = AC; la bisectriz también coincide.» |
| 6 | «Dos caminos parten las esquinas B y C del parque y se cruzan en la pileta.» **Cambia las esquinas B y C hasta que los caminos se crucen formando 120°.** | `b` y `c` (se quedan), de 40° a 70°, de 10° en 10° (arrastre de A) | `v.b + v.c === 120` (tres parejas) | «m∠A = 60°: se cruzan a 90° + 30° = 120°.» | «120° = 90° + 60°/2: A mide 60°, sea cual sea B.» |

La misión 1 no se cumple al abrir (el juego empieza en 50°, 70° y 60°) y tiene varias soluciones (45° y 45°, 40° y 50°…),
como la de 14 km de Segmentos. En la idea 3, la raya BC lleva su medida en cm: así se ve que a 60° mide lo mismo que la
pata. La idea 4 cambia los lados de hoy (5 y 8, sin unidad) por los brazos de 40 cm y 25 cm. Ninguna leyenda da el número
que solo sale con la misión cumplida (validador `leyendaSinRespuesta`).

---

## 4. La predicción de cada idea

La app baraja las opciones; los `datos` traen solo valores y definiciones, nunca la fórmula. Solo GE7 y GE8 tienen datos
medidos (Hershkowitz 1987 y 1989, Gutiérrez y Jaime 1999, de segunda mano según el informe); los GE-TRI, GE-DT y GE-BIS
son hipótesis de `rutinas/teoria-geometria.md`, y los que dicen «nuevo» los agrego yo. Todos se confirman con la
medición del piloto. En la figura, lo que se pide va con «?» en tinta.

**Idea 1.** «Rosa dice que recortó un triángulo de cartulina con dos ángulos obtusos, uno de 100° y otro de 95°. ¿Puede
ser?» Datos: un ángulo obtuso mide más de 90° y menos de 180°.

| Opción | Qué mide |
| --- | --- |
| No: esos dos ya suman más de 180° | Correcta |
| Sí, si el tercer ángulo es muy pequeño | No usa la suma de los tres (GE-TRI4, nuevo) |
| Sí, si la cartulina es bien grande | El ángulo crece con el tamaño (GE-ANG1, de Segmentos) |
| Sí: 100° + 95° no llega a 360° | Confunde la suma con una vuelta (GE-TRI5, nuevo) |

«Mira»: las tres esquinas recortadas sobre la regla llenan 180°; la paralela por A dice por qué pasa siempre (alternos
internos); con 100° y 95° ya no queda nada para el tercero.

**Idea 2.** «El mototaxi da una vuelta completa a la plaza y vuelve a su esquina mirando hacia donde salió. ¿Cuánto
giró en total?» Datos: los ángulos de la plaza miden 50°, 60° y 70°; el giro en una esquina es el ángulo entre la calle
que deja y la prolongación de la que traía.

| Opción | Qué mide |
| --- | --- |
| 360° | Correcta (130° + 120° + 110°) |
| 180°: lo mismo que suman los ángulos de la plaza | Confunde exteriores con interiores (GE-EXT1, nuevo) |
| 540°: 180° en cada esquina | Cuenta el llano entero en cada vértice (GE-EXT2, nuevo; vecino de GE-TRI2) |
| Depende de la forma de la plaza | No ve que la suma no cambia (GE-EXT3, nuevo) |

«Mira»: cada giro es 180° menos su ángulo; tres llanos menos 180° dan 360°. Y el giro en C = m∠A + m∠B.

**Idea 3.** «Un techo a dos aguas tiene sus dos lados distintos: uno de 3 m y otro de 4 m, sobre una viga de 6 m. ¿Qué
lado del techo queda más inclinado, es decir, forma el ángulo mayor con la viga?» Datos: AB = 3 m; AC = 4 m; BC = 6 m.

| Opción | Qué mide |
| --- | --- |
| El lado corto, el de 3 m | Correcta (36° contra 26°; A mide 117°; comprobado aparte) |
| El lado largo: más lado, más ángulo | Toma el ángulo pegado al lado y no el de enfrente (GE-ISO1, nuevo) |
| Los dos igual: suben al mismo punto | Supone el techo simétrico (GE-ISO2, nuevo; prototipo, vecino de GE9) |
| No se sabe sin medir la altura del techo | Cree que falta un dato (GE-ISO3, nuevo) |

«Mira»: primero el compás doblado por la mitad (patas iguales, ángulos iguales); después, en el techo, se marca en AC un
punto D con AD = 3 m: ABD es isósceles, y su ángulo en D es exterior del triángulo BDC, mayor que el ángulo en C.

**Idea 4.** «Imagina que el codo de la lámpara pudiera cerrarse del todo y estirarse del todo. ¿Entre qué valores puede
estar AC para que pie, codo y cabeza formen un triángulo?» Datos: CB = 40 cm; BA = 25 cm.

| Opción | Qué mide |
| --- | --- |
| Entre 15 cm y 65 cm, sin llegar a ninguno | Correcta |
| De 15 cm a 65 cm, incluidos | Cuenta los extremos aplastados (GE-DT3; la trampa de San Marcos 2026-I) |
| Cualquier valor menor que 65 cm | Olvida el límite de abajo (GE-DT2) |
| Solo 65 cm | Toma la suma como único valor (GE-DT1) |

«Mira»: cerrado del todo, A cae sobre CB y AC = 40 − 25 = 15 cm: segmento; estirado, AC = 65 cm: otro segmento.

**Idea 5.** «Otro caserío queda más allá del paradero B, a un lado de la carretera, y el ángulo en B queda obtuso.
¿Dónde llega la altura trazada desde A?» Datos: la altura va de A a la recta BC y forma 90° con ella; m∠B = 120°.

| Opción | Qué mide |
| --- | --- |
| Fuera del tramo BC, en la carretera más allá de B | Correcta |
| Al punto medio del tramo BC | Altura y mediana como la misma línea (GE8) |
| Dentro del tramo BC, aunque el camino quede inclinado | La altura siempre cae dentro (GE7-a) |
| Justo en B: el camino AB es la altura | Toma un lado por altura (GE7-b) |

Propongo partir GE7 en **GE7-a** y **GE7-b**, las dos formas que el informe ya describe, para que dos opciones no lleven
el mismo código. La carretera que sigue más allá de B hace de prolongación sin inventar nada.

**Idea 6.** «En otro parque, el camino de C no parte la esquina de adentro: parte el ángulo entre la calle CA y la que
sigue de largo después de C. Se cruza con el camino de B en E. ¿Qué ángulo forman en E?» Datos: m∠A = 60°; cada camino
parte su ángulo en dos iguales.

| Opción | Qué mide |
| --- | --- |
| 30° | Correcta (m∠A/2) |
| 120° | Usa la de dos interiores (GE-BIS4) |
| 60° | Toma el ángulo A entero (GE-BIS5-a) |
| 90° | Cree que dos bisectrices de C siempre dan 90° en E (GE-BIS5-b) |

GE-BIS5 se parte en **-a** y **-b** por la misma razón. El dibujo va con B = 70° y C = 50° (el de hoy).

---

## 5. Tabla de letras y símbolos

| Letra | Un solo significado en la unidad | Aviso |
| --- | --- | --- |
| A, B, C | Vértices del triángulo (puntas de la cartulina, esquinas de la plaza y del parque, bisagra y puntas del compás, cabeza, codo y pie de la lámpara, caserío y paraderos) | **Chocan con las alternativas A–E.** Decisión vigente: ningún resuelto nombra una alternativa por su letra |
| AB, BC, AC | El lado y su medida | Como en Segmentos («AB nombra el segmento y su medida») |
| m∠A, m∠BAC | La medida de un ángulo. m∠A solo si ese vértice tiene un solo ángulo en la figura; si hay varios, tres letras | Hoy «A = 50°». Pregunta 5 |
| D | Un punto en la prolongación de un lado: el exterior en C es ∠ACD (ideas 2 y 6); en «Mira» de la idea 3, el punto de AC con AD = AB | Hoy D es el pie de la bisectriz: pasa a F |
| H | Pie de la altura | — |
| M | Punto medio de un lado (pie de la mediana; por ahí pasa la mediatriz) | Como en Segmentos |
| F | Pie de la bisectriz (idea 5) | — |
| I | Cruce de las bisectrices interiores de B y C (la pileta) | «Incentro» va al glosario como «se explica en Puntos notables» |
| E | Cruce de la bisectriz interior de B con la exterior de C | Ídem «excentro» |
| P | Un punto dentro del triángulo (idea 4, nivel examen) | — |
| θ | La abertura del compás, el ángulo en A del isósceles (idea 3) | En Segmentos θ era el de la calle con los rieles: otra unidad |
| α | Cada ángulo de la base del isósceles (idea 3) | En Segmentos, la barra de la tranquera: otra unidad |
| x | Lo que se pide: un ángulo o un lado | **Sin «°»** (cuarta ronda): m∠A = 2x + 10°, x = 20. Un lado: AC = x, x = 9, «AC = 9 cm» |
| k | Lo que vale cada parte (ángulos 2k, 3k, 4k) | El mismo de Segmentos y de razones |
| △ | Triángulo (△ABC) | Va al glosario |
| ⟂, ∥ | Perpendicular, paralela | ∥ viene de Segmentos; ⟂ se define aquí (Segmentos no la define) |
| C(x), S(x) | **No se usan** | C es un vértice en todas las figuras: se escribe 90° − x y 180° − x |
| a, b, c | **No se usan como lados opuestos a A, B y C** | Esa convención es de Relaciones métricas y Trigonometría. Aquí la regla usa las letras de su figura: CB − BA < AC < CB + BA |
| °, cm, m, km | Unidades | Todo número lleva la suya; los rótulos de ángulos, «°» |

---

## 6. Mapa de colores (§5b: un color fijo por magnitud en la unidad)

Como en Segmentos, las letras cambian de un problema a otro, así que el color sigue a **lo que cada cosa es en la
figura**, igual en toda la unidad:

| Token | Magnitud en esta unidad |
| --- | --- |
| `h` carmín | **todo ángulo interior**, con su arco y su letra; tres ángulos distintos se distinguen por 1, 2 o 3 arcos (sus copias llevan los mismos arcos); **toda bisectriz interior** y las mitades que deja (con una rayita o dos) |
| `i` turquesa | **el ángulo exterior** (el «compañero» del interior, como el suplemento de Segmentos) y su bisectriz; en las ideas 3 y 4, el segundo lado dado |
| `o` naranja | el primer lado dado; los **lados iguales** del isósceles, con la misma rayita sobre una llave (molde §3); en la idea 5, **la altura** con su cuadradito |
| `i` turquesa (idea 5) | **la mediana**, con la llave y las rayitas de sus dos mitades |
| `f` violeta | lo que se pide, ya resuelto, **solo en el texto del resuelto y en la respuesta**; nunca en una figura ni en un enunciado |
| tinta | los lados que no son dato, la base del isósceles, la viga, la carretera, la paralela auxiliar, las prolongaciones, **la mediatriz (discontinua)** y lo pedido con «?» |
| `d` verde | no se usa: casi todo dibujo tiene naranja o carmín al lado |

- **Excepción en los ejercicios** (Predice, ejemplos, «Así se resuelve», «Ahora tú»), como en Segmentos: en las ideas 1,
  2, 3 y 6 todo ángulo dado va en carmín, también un exterior, porque el turquesa diría «este es el suplemento» y eso es lo
  que se practica. En la idea 5, **la línea que hay que reconocer va en tinta**: el alumno lee su marca (cuadradito,
  rayitas, arcos), no su color. Una prueba en 400 semillas lo comprueba.
- **Pares que van juntos:** naranja–turquesa 0,114, turquesa–carmín 0,077, violeta–carmín 0,167 (molde §5b). El par débil
  naranja–carmín (0,062) aparece solo en la idea 5 (altura y bisectriz): se separan también por la marca (cuadradito
  contra arcos) y la letra del pie (H contra F).
- La escena `triangulo-estira` (base azul, altura roja, mediana verde, bisectriz amarilla) y las mesas `triangulo-libre` y
  `bisectrices` (C verde) se corrigen cuando se rehaga su práctica.

| Idea | Carmín | Turquesa | Naranja | Violeta | Tinta |
| --- | --- | --- | --- | --- | --- |
| 1 | los tres interiores (1, 2, 3 arcos) y sus copias en la paralela | — | — | el ángulo pedido, resuelto | lados, regla, paralela por A |
| 2 | los interiores | el giro (exterior) | — | el ángulo pedido | calles, prolongaciones |
| 3 | α, α y θ (dos arcos) | en el techo, el lado largo | las patas iguales; en el techo, el lado corto | el ángulo o lado pedido | la raya BC, la viga |
| 4 | el ángulo del codo | el brazo de 25 cm | el brazo de 40 cm | x resuelto | AC (con «?» en los ejercicios) |
| 5 | bisectriz y sus arcos | mediana y sus mitades | altura y su cuadradito | el ángulo pedido | lados, carretera, mediatriz |
| 6 | m∠A, bisectrices de B y C y sus mitades | exterior en C, su bisectriz y sus mitades | — | ∠BIC o ∠BEC resuelto | lados, prolongación |

---

## 7. Práctica y datos del mundo

### 7a. Qué existe y qué falta

Lo que hay:
- **`geo-triangulos-notables`** (predicciones 0.2.0, compartido con Puntos notables). Tipos: `desigualdad` (máximo,
  mínimo, cuántos, diagonal de un cuadrilátero, punto interior, punto con dos distancias, ángulo doble, isósceles con
  ceviana, contar triángulos), `obtusangulo` (siete subtipos, todos con x² frente a a² + b²), `angulos` (incentro,
  excentro, interior con exterior, ortocentro, circuncentro, ortocentro con incentro, pies de las alturas), `ortocentro`,
  `mitades` (tan 37°/2) y `arco`. **`datos: ''` en todos** (punto 13). Papel de 8: p1, p4 y p6 son de la idea 4; p2, de
  la 6; p3 (obtuso), p5 (ortocentro), p7 (tan 53°/2) y p8 (arco) son de otras unidades.
- **La escena `triangulo-estira`** (borrador 0.1.0, compartida con Áreas, Relaciones métricas y Puntos notables), con
  predicciones de GE7 y GE8; su papel es casi todo de área y de relaciones métricas.
- **Mesas:** `triangulo-libre` (idea 5), `bisagra-libre` (idea 4), `bisectrices` (idea 6).
- **Prueba del tema:** ningún ítem.

| Idea | Hay | Falta |
| --- | --- | --- |
| 1 Suma | reto «acutángulo y obtusángulo» de la mesa `triangulo-libre` | todo el generador: tercer ángulo, razón con k, con x, clasificación, mariposa (San Marcos 2025-I); papel; ítem de prueba |
| 2 Exterior | nada | todo: exterior directo y con x, suma de exteriores, cóncavo, San Marcos 2024-I; una mesa (la plaza); papel |
| 3 Isósceles | solo lo usan `isosceles-ceviana` y `doble-angulo` | todo: ángulos de la base y del vértice, recíproco (San Marcos 2025-II), equilátero, ordenar lados por sus ángulos, cadena de isósceles; una mesa (el compás); ítem de prueba |
| 4 Desigualdad | `desigualdad` con sus nueve subtipos; papel p1, p4, p6; mesa `bisagra-libre` | `datos` por línea; el isósceles de lados 4 y 9; lados con unidad en la mesa; ítem de prueba |
| 5 Líneas | mesa `triangulo-libre`; predicciones de la escena | todo el generador: reconocer por la marca (en tinta), dónde cae la altura, ángulo entre altura y bisectriz, coinciden y entonces isósceles |
| 6 Bisectrices | `angulos` (incentro, excentro, interior con exterior), papel p2, mesa `bisectrices` | `datos`; el tipo inverso (dado ∠BIC, halla m∠A); I y E sin la teoría de Puntos notables |

Propuesta: una plantilla nueva de formato `predicciones`, **`plantillas/geo-triangulos/`**, con los tipos separados por
idea, `datos` por línea, prueba en 400 semillas, `casos.json` verificado aparte y papel de 5 a 10 por idea. Los tipos de
desigualdad y de las tres bisectrices **llaman** a `calc` de `geo-triangulos-notables` (no lo copian), y ese generador
separa sus tipos por unidad, como `numeros-sucesiones`: los de puntos notables quedan para Puntos notables y
`obtusangulo` pasa a Relaciones métricas. La escena `triangulo-estira` va a «Más mesas del tema» (`"rehacer": true`).
Prueba del tema: tres pares nuevos (suma o exterior con x, isósceles, desigualdad entera). Las mesas: `triangulo-libre`
se asigna también a la idea 1 (su reto de comparar sumas), y faltan la plaza (idea 2) y el compás con patas libres (idea
3); los `id` de las tres mesas de hoy no cambian.

### 7b. Datos del mundo

La unidad casi no los necesita: los objetos son de todos los días y sus medidas, de problema. Tienen que ser posibles
(punto 10).

| Dato | ¿Fuente? |
| --- | --- |
| Patas del compás de unos 12 cm; brazos de la lámpara de unos 40 cm y 25 cm | Valores de todos los días, con «unos», sin fuente |
| Techo de 3 m, 4 m y viga de 6 m (inclinaciones de 36° y 26°); caserío a 3,6 km de una carretera con paraderos a 6 km; plaza de 50°, 60° y 70° | Valores de problema, sin fuente. Son posibles (cuentas rehechas aparte) |
| «Las vigas de muchos techos forman triángulos, y por eso no se deforman» (la tarjeta de hoy dice «en Juliaca suelen») | Sin cifra; lo dejo general, sin nombrar Juliaca, salvo que encuentre una fuente |
| Mototaxis en una plaza | Situación de todos los días; la plaza no lleva el nombre de una plaza real |
| Historia: Elementos I.32 | Ya trae fuente (edición de D. E. Joyce, Clark University). La prueba del lado mayor es la I.18; si la cito en «Mira», compruebo antes el enlace de Joyce |

---

## 8. Riesgos de orden con otras unidades (`requiere`)

**Lo que esta unidad da por sabido** (todo de `geometria.segmentos-y-angulos`, su único `requiere` hoy, que confirmo):
punto, recta, segmento y su medida, «entre», punto medio, ángulo y sus clases, m∠, consecutivos, adyacentes y
suplemento, bisectriz, paralelas y alternos internos (para la paralela por A), opuestos por el vértice (para la mariposa),
el quiebre (parecido al cóncavo) y despejar x (Segmentos ya trae `algebra.ecuaciones-lineales-y-cuadraticas` como
consejo). Segmentos ya usa «los tres ángulos de un triángulo suman 180°» como **dato** en un ejemplo de nivel 3 de
paralelas: no choca, y aquí se enseña.

**Riesgos dentro de la unidad:** la idea 3 usa en «Mira» el exterior (idea 2); la 4, el isósceles en su nivel examen; la
5, el isósceles; la 6, el exterior y la bisectriz como línea. El orden propuesto los cubre.

**Lo que no hay que adelantar:**

| Unidad que viene | Lo que es suyo | Cómo se evita aquí |
| --- | --- | --- |
| Congruencia | criterios, equidistancia de mediatriz y bisectriz, base media, mediana a la hipotenusa, notables | el isósceles se ve doblando, sin LAL; la mediatriz solo se define; sin 30°-60° ni 37°-53° |
| Polígonos y cuadriláteros | 180° · (n − 2) y los exteriores del polígono | aquí solo el triángulo y el cóncavo de cuatro lados como ejercicio de exteriores |
| Proporcionalidad | teorema de la bisectriz (BF/FC = AB/AC) | sin la posición de F en la lectura ni en ejercicios |
| Puntos notables | incentro, excentro, ortocentro, baricentro, Euler | I y E solo como cruces; ∠BOC y ∠BHC no entran |
| Relaciones métricas | Pitágoras, Euclides y la condición de obtusángulo | ningún ejercicio pide x² frente a a² + b² |
| Áreas poligonales | base por altura sobre dos | la altura no se usa para áreas |

**Lo que otras unidades toman de aquí:** Congruencia usa el isósceles sin enseñarlo («MCB es isósceles y copia el
ángulo B», en la mediana a la hipotenusa); esta propuesta tapa ese hueco. Circunferencia lo usa con los radios.
Polígonos usa los 180° de cada triángulo. Razones trigonométricas (otro curso, consejo) pide esta unidad. **Puntos
notables ya enseña ∠BIC y ∠BEC** en su idea `centros`: hay un cruce que decidir (pregunta 3).

---

## 9. Preguntas para Gerson

1. **¿Seis ideas, con `angulo-exterior` e `isosceles` como ideas propias?** Recomiendo que sí. El isósceles es lo más
   preguntado (27 fichas, San Marcos 2025-II y 2019-II, y la herramienta de nueve preguntas más de otras unidades) y hoy no
   se enseña. El exterior hoy vive escondido en la predicción de la idea 1 y es la llave de San Marcos 2024-I. La otra
   opción es dejar el exterior dentro de la idea 1 (cinco ideas), pero la idea 1 queda con dos reglas y sin predicción
   propia de la suma. Seis es el tope.
2. **La condición de obtusángulo (x² > a² + b²), fuera.** Las dos preguntas de San Marcos que la piden (2023-I y 2024-I
   área A) están mal planteadas o con clave dudosa, y la condición necesita Pitágoras, que llega en Relaciones métricas.
   Recomiendo llevar el tipo `obtusangulo` a esa unidad y quedarme aquí solo con la relación entre el lado mayor y el
   ángulo mayor.
3. **¿Dónde viven los ángulos entre bisectrices?** Están en el catálogo de esta unidad (17 fichas) y también en Puntos
   notables (`centros`). Recomiendo enseñarlos aquí como caza de ángulos, con I y E como cruces de caminos y los nombres
   «incentro» y «excentro» marcados «se explica en Puntos notables» (como se hizo con «valor absoluto»), y que Puntos
   notables los dé por sabidos cuando le toque su turno.
4. **Colores (sección 6).** ¿Apruebas los interiores en carmín (1, 2 o 3 arcos), el exterior en turquesa como
   «compañero», los lados dados en naranja y turquesa, las líneas notables en naranja (altura), turquesa (mediana), carmín
   (bisectriz) y tinta discontinua (mediatriz), y en los ejercicios todo ángulo dado en carmín y la línea por reconocer en
   tinta? Recomiendo que sí: es la regla de Segmentos llevada al triángulo, sin verde y sin que el color diga la respuesta.
5. **Notación.** Recomiendo m∠A cuando el vértice tiene un solo ángulo en la figura, m∠BAC cuando hay varios y ∠ACD para
   el exterior, como m∠AOB en Segmentos; x sin «°»; nunca C(x) ni S(x), porque C es un vértice; y los lados por sus
   letras (AB), sin la convención a, b, c de Relaciones métricas.
6. **Los controles de la idea 1.** Hoy `ax` y `ay` mueven A por puntos enteros y los ángulos salen con decimales: 6 de 45
   posiciones muestran sumas de 179° o 181°. Arreglarlo choca con la regla «no se cambian los `id` de los controles».
   Recomiendo agregar `b` y `c` (ángulos en B y C, de 5° en 5°, con el arrastre de A, como la idea de bisectrices) y
   sacar `ax` y `ay` del juego sin borrarlos del avance. La otra opción es mantenerlos y que A salte solo a posiciones con
   ángulos enteros, que es más frágil.
7. **Objetos.** ¿Te sirven la cartulina (y el tijeral en «Lee»), la plaza con el mototaxi, el compás y el techo a dos
   aguas, la lámpara de escritorio, el caserío junto a la carretera y el parque con la pileta? Los dibujo como prueba en
   `geo-objeto`, y tú decides cuáles reemplazas.
8. **El lado mayor frente al ángulo mayor, dentro de la idea 3.** Recomiendo que sí, con el techo como predicción: es el
   caso «desigual» del isósceles, entra en San Marcos 2023-I y en el subtipo `relacion` del generador, y no da para una
   séptima idea.
9. **La mediatriz solo como definición.** Recomiendo que sí: que sus puntos equidistan es el teorema de Congruencia.
10. **Códigos.** ¿Parto GE7 en GE7-a (dentro, inclinada) y GE7-b (un lado como altura) y GE-BIS5 en -a y -b, y agrego como
    hipótesis GE-TRI4, GE-TRI5, GE-EXT1 a 3 y GE-ISO1 a 3? Recomiendo que sí, anotados en `rutinas/teoria-geometria.md` y
    en el informe.
11. **Práctica.** Recomiendo la plantilla nueva `geo-triangulos` por idea, que llama a `calc` de `geo-triangulos-notables`;
    que ese generador separe sus tipos por unidad; `triangulo-estira` en «Más mesas del tema»; y tres pares nuevos en la
    prueba del tema.
12. **Títulos y temas.** Propongo los títulos de la sección 1 en vez de los de hoy (el `id` no cambia) y agregar «Triángulo
    isósceles y equilátero» y «Relación entre lados y ángulos» a los temas de la ficha. Si prefieres conservar algún
    título, dime cuál.
