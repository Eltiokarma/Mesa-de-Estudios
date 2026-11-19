# Propuesta de ideas: «Congruencia de triángulos»

`geometria.congruencia` · Etapa 5 del plan de calidad, tercera unidad de la rama «Geometría plana» (sigue a «Segmentos y
ángulos» y «Triángulos y líneas notables», las dos con `calidad: 2`) · fases 1 y 2 (`docs/metodo/unidad/1-ideas.md`) ·
19 nov 2026

> **Resuelto (19 nov, la sesión):** el choque con el validador de calidad 2 (`respuesta-letra` y
> `alternativa-sin-explicar`) se resolvió a favor de la decisión de Gerson: las dos reglas ya aceptan nombrar una
> alternativa por su valor. Donde hay puntos A, B, C, los resueltos explican cada alternativa por su valor, y la prueba
> de la unidad corre el validador entero como calidad 2, sin dejar reglas fuera.

Gerson delegó el criterio en esta etapa: esta propuesta ya está en marcha (la idea 1 está escrita con ella como guion) y
la sección 9 no trae preguntas sino **las decisiones que tomé**, cada una con su motivo y la alternativa que descarté,
para que las revises después.

Lo que leí: `CLAUDE.md`, `docs/plan-calidad.md` §3, `docs/molde-unidad.md` entero, `docs/metodo/unidad/LEEME.md`,
`1-ideas.md` y `2-ejemplos.md`, las decisiones de las etapas 2, 3 y 4, la propuesta de Triángulos
(`docs/etapa4/propuesta-geometria.md`) como modelo, la teoría actual (`contenido/teoria/geometria/congruencia.js`,
v0.2.0), su ficha en `catalogo/cursos/geometria.json`, su plantilla (`congruencia`: escena, motor, casos y papel), el
informe `docs/investigacion/geometria-ideas-erroneas.md`, `docs/temario-completo.md` (unidad 3), la matriz
`docs/teoria/matriz/geometria.json`, los pares cg-01 y cg-02 de `catalogo/pruebas/geometria.json`, las 20 preguntas de
San Marcos de `docs/datos/admision-unmsm.csv`, y como nivel, `contenido/teoria/geometria/triangulos.js` con las piezas
`geo-objeto` y `geo-figura`, su auditoría (`rutinas/auditoria/geometria.triangulos.md`) y las dos rondas de su lector en
frío. Para no adelantar ni repetir revisé las ideas de Triángulos y de las unidades que vienen: polígonos y
cuadriláteros, circunferencia, proporcionalidad, puntos notables y relaciones métricas, y la unidad de razones
trigonométricas (que ya usa 37° y 53°).

---

## Lo que pregunta la admisión

**Catálogo:** UNI, semana 2; San Marcos, temas 2 y 4. **Banco Cuzcano:** unas 117 fichas: triángulos rectángulos
notables (40), teoremas de la bisectriz y la mediatriz (33), criterios LAL, ALA y LLL (23), base media (20).

**San Marcos, admisión real 2019-I a 2027-I:** 20 preguntas clasificadas en esta unidad, una o dos por examen. Es la
unidad de geometría plana que más sale.

| Qué piden | Cuántas | Periodos | Idea donde cae |
| --- | --- | --- | --- |
| Hallar un lado o un ángulo con dos triángulos congruentes que hay que **ver o trazar** (lado común, opuestos por el vértice, un isósceles al lado) | 11 | 2019-I, 2021 (dos: LAL en un cerco, ALA en un cuadrilátero apoyado en la pared), 2022, 2023-I, 2024-I, 2024-II (con 45°), 2025-I (tres: pentágono, LLL, ALA con isósceles), 2025-II | 2, nivel examen (la de 45°, en la 6) |
| Mediatriz o bisectriz: un punto que equidista | 4 | 2019-I (dos bisectrices), 2019-II, 2025-II (con notables), 2027-I (perpendicular a la bisectriz) | 3 (la de 2025-II, en la 6; la de 2027-I, en la 4) |
| Base media | 3 | 2026-II (dos veces seguidas), 2027-I (con la mediana del trapecio), 2019-I (con la mediana a la hipotenusa) | 4 (el trapecio es de Polígonos) |
| Mediana relativa a la hipotenusa | 2 | 2019-I, 2023-II (con desigualdad triangular; la trampa es el valor límite) | 5 |
| Notables de 37° y 53°, 30° y 60°, 45° | 3 | 2019-I, 2024-II (dos) | 6 |

Dos cosas saltan a la vista. **San Marcos nunca pregunta «¿qué criterio es?»**: pide una longitud o un ángulo, y el
criterio es el paso que nadie escribe. Y en 8 de las 11 preguntas de congruencia la segunda herramienta es el
**isósceles** (que ya enseña Triángulos). La unidad de hoy solo pide nombrar el criterio: le falta justo lo que el
examen cobra, usar la congruencia para pasar una medida de un triángulo al otro.

---

## 0. Qué tiene hoy la unidad y qué se queda o sale

1. **Cinco ideas** (`criterios`, `mediatriz-bisectriz`, `base-media`, `mediana-hipotenusa`, `notables`), con «Lee» y «Así
   se resuelve» en todas y un laboratorio de tres mesas con retos comprobados (`compas-lla`, `c-libre`, `base-libre`). La
   base sirve: la trampa LLA con la circunferencia que corta dos veces, el punto P que equidista, la base media que no
   cambia al mover A, la mediana que mide 5 mientras C corre por el arco y los notables como medio cuadrado y medio
   equilátero.
2. **Punto 1: no hay objeto en ninguna primera pantalla.** Las cinco abren con `geo-figura` pelada. Los objetos están
   solo escritos en «Lee» (las ventanas de un edificio, el paradero, el listón del techo, las escuadras).
3. **Punto 2: no hay misión.** Las consignas describen el control («Cambia el ángulo A…», «Mueve el punto P…»). Tampoco
   hay `leyenda`, `aprendizaje`, `actividad` ni `pregunta`. La cabecera dice «postulante de 3.º».
4. **Títulos ingeniosos** («Qué datos fijan un triángulo», «Puntos que equidistan», «La base media mide la mitad», que
   además dice la respuesta).
5. **Colores contra §5b:** el lado fijo va en **verde** junto al ángulo naranja (el par que cae a 0,010 en protanopía), lo
   pedido en carmín (el color de los ángulos) y los ángulos en naranja o verde. Nada coincide con Triángulos.
6. **Punto 7: lecturas con «·»** y sin relación: «BC = 6,2 · un solo triángulo», «MN = 4 · BC = 8 · paralelas», «∠C = 90°
   · CM = 5». Ningún largo lleva unidad («7 y 5»).
7. **Punto 5:** «∠A = 40°» sin m∠; el segundo triángulo se llama PQR en la idea 1 y P es un punto suelto en la idea 2.
8. **«Así se resuelve» es el generador de «Ahora tú» con la semilla s + 900**, en las cinco ideas. «Ahora tú» de la idea
   1 solo pide nombrar el criterio; los distractores repiten código (GE-CON8 tres veces, GE-CON10 tres veces, GE-CON14 en
   todas las opciones de notables).
9. **Punto 13: ningún ejercicio trae `datos`.** No hay ejemplos resueltos (0 de 90). El glosario tiene 22 términos sin
   `simple` y 5 con un solo ejemplo.
10. **Punto 9 (orden) dentro del curso:** «Mira» de la base media cierra con «MBCD es paralelogramo», y «Mira» de la
    mediana, con «las diagonales de un rectángulo son iguales»: las dos propiedades son de Polígonos y cuadriláteros, que
    viene después y que además **requiere** esta unidad. Los notables usan Pitágoras, que el curso enseña en Relaciones
    métricas.
11. **Falta lo que más se pregunta:** usar la congruencia (lados y ángulos correspondientes, lado común, opuestos por el
    vértice, trazo auxiliar), el caso «dos ángulos y un lado que no está entre ellos» (sale ALA con la suma de 180°), el
    recíproco de mediatriz y bisectriz como herramienta, la perpendicular a la bisectriz que arma un isósceles, y el
    cateto frente a 30° como mitad de la hipotenusa.

**Se queda:** los cinco `id` de idea y los `id` de sus controles (`t`; `dx` e `y`; `ax` y `ay`; `fi`; `tipo` y `k`), la
trampa LLA como predicción de la idea 1, las tres mesas con sus `id`, la historia de los Elementos I.4 (con su fuente) y
casi todo el glosario, que gana `simple` y ejemplos.

**Sale o cambia:** los títulos; los colores (sección 6); «∠A» pasa a m∠A; PQR pasa a DEF; los largos ganan unidad; las
lecturas con «·»; las dos pruebas que usan paralelogramo y rectángulo (se rehacen con lo que ya se sabe, sección 8); «Así
se resuelve» deja de repetir «Ahora tú».

---

## 1. Las ideas, en orden

Propongo **seis**, el tope. Una es nueva (`partes-correspondientes`); las otras cinco conservan su `id` y su lugar
relativo. La unidad no se parte y no hace falta `septimaIdea`.

| # | `id` | Título (≤ 6 palabras) | `aprendizaje` |
| --- | --- | --- | --- |
| 1 | `criterios` | Criterios de congruencia | Dos triángulos son congruentes si coinciden en LAL, ALA o LLL: tres medidas bien ubicadas fijan el triángulo; LLA y AAA no bastan. |
| 2 | `partes-correspondientes` (nueva) | Lados y ángulos correspondientes | En triángulos congruentes, frente a ángulos iguales hay lados iguales, y al revés; se emparejan por sus marcas, no por su posición. |
| 3 | `mediatriz-bisectriz` | Mediatriz y bisectriz | Todo punto de la mediatriz equidista de los extremos del segmento; todo punto de la bisectriz, de los lados del ángulo, medido en perpendicular. |
| 4 | `base-media` | Base media del triángulo | El segmento que une los puntos medios de dos lados es paralelo al tercero y mide su mitad, sea cual sea la forma del triángulo. |
| 5 | `mediana-hipotenusa` | Mediana relativa a la hipotenusa | En un triángulo rectángulo, la mediana a la hipotenusa mide la mitad de ella y lo parte en dos isósceles. |
| 6 | `notables` | Triángulos rectángulos notables | Por sus ángulos se saben sus lados: 45° da k, k y k√2; 30° y 60°, k, k√3 y 2k; 37° y 53°, casi 3k, 4k y 5k. |

Las preguntas del Resumen (`pregunta`): 1 «¿Qué tres medidas bastan para copiar un triángulo?»; 2 «¿Qué lado de un
triángulo le toca a cada lado de su copia?»; 3 «¿Dónde están los puntos igual de lejos de dos lugares?»; 4 «¿Cuánto mide
el listón que une la mitad de dos vigas?»; 5 «¿Qué distancia no cambia cuando una escalera resbala por la pared?»; 6
«¿Cómo se sacan los lados de una escuadra con solo uno?». Ninguna descarta una alternativa de su predicción.

**Por qué va cada una en su lugar y qué da por sabido**

1. **Criterios de congruencia.** La raíz. «Lee» presenta congruente (calzan), las seis medidas de un triángulo, ≅ y cómo se
   leen L y A. El juego deja ver LAL (dos vigas y el ángulo entre ellas: la tercera sale sola), la predicción es LLA (el
   mismo par de vigas con el ángulo fuera de lugar: dos tijerales) y «Mira» arma, uno tras otro, LLA, LAL, ALA y LLL. Usa
   de Triángulos la suma de 180° (dos ángulos fijan el tercero: AAL se vuelve ALA) y, en su nivel examen, el isósceles
   partido por su mediana. Su nivel examen: el dato que no sirve, cuántos triángulos da LLA según el largo del lado que
   gira, y paralelas con un cruce.
2. **Lados y ángulos correspondientes.** Lo que el examen cobra: ya se sabe que son congruentes; ahora, qué lado es
   igual a cuál. Va segunda porque las cuatro ideas que siguen son, cada una, una congruencia que se usa. «Lee» presenta
   «correspondiente» y el orden de las letras en △ABC ≅ △DEF. Nivel examen: lado común, opuestos por el vértice (de
   Segmentos), el trazo auxiliar, y la cadena «congruencia más isósceles» de San Marcos 2021, 2022, 2024-I y 2025-I.
3. **Mediatriz y bisectriz.** Dos congruencias con nombre propio. La mediatriz solo se definió en Triángulos; aquí llega
   su teorema (LAL con el lado común PM) y el de la bisectriz (dos ángulos y la hipotenusa común: ALA tras el tercer
   ángulo). «Lee» presenta la distancia de un punto a una recta, en perpendicular. Nivel examen: el recíproco (si
   equidista, está en la mediatriz), la perpendicular a una bisectriz que arma un isósceles y San Marcos 2019-I y
   2019-II.
4. **Base media del triángulo.** Usa el punto medio (Segmentos), las paralelas (Segmentos) y dos congruencias (idea 2).
   Va antes de la mediana a la hipotenusa porque esta se prueba con ella. Nivel examen: el triángulo de los puntos
   medios, dos bases medias seguidas (San Marcos 2026-II) y la perpendicular a la bisectriz con base media (2027-I).
5. **Mediana relativa a la hipotenusa.** Se prueba con la base media (la paralela por M llega al punto medio del cateto y
   es perpendicular a él) y la mediatriz (idea 3): sin rectángulos ni circunferencias. Usa el isósceles de Triángulos
   para los dos ángulos que copia. Nivel examen: el ángulo entre la mediana y la altura, y San Marcos 2023-II (con la
   desigualdad triangular, de Triángulos).
6. **Triángulos rectángulos notables.** Al final, porque junta todo: el de 45° es un isósceles rectángulo; el de 30° y
   60°, medio equilátero (o la mediana a la hipotenusa: el cateto frente a 30° mide la mitad); el de 37° y 53°, el 3-4-5
   del albañil. Pitágoras entra como dato. Nivel examen: San Marcos 2024-II (cable de un poste con 37° y un isósceles; la
   altura trazada que arma un notable de 45°) y 2025-II (mediatriz con notables).

**Temas de la ficha:** agrego «Lados y ángulos correspondientes» a los cinco de hoy (el `id` no cambia).

**Qué no entra** (y dónde va):
- La mediana del trapecio y las propiedades del paralelogramo: Polígonos y cuadriláteros. Las preguntas de San Marcos
  2019-I (n.º 41) y 2027-I (n.º 35) usan la base media aquí y el trapecio allá.
- El teorema de la bisectriz interior (BF/FC = AB/AC) y Thales: Proporcionalidad.
- Incentro, circuncentro y excentro como puntos (las tres mediatrices, las tres bisectrices): Puntos notables. Aquí P es
  un punto de **una** mediatriz o de **una** bisectriz.
- Pitágoras como teorema (su prueba, la altura sobre la hipotenusa, las ternas): Relaciones métricas. Aquí es un dato.
- Las razones sen, cos y tan de 37° y 53°, y los de 16° y 74°: Razones trigonométricas (otro curso). Aquí, solo lados
  3k, 4k y 5k.
- Los notables de 15° y 75°, 53°/2 y 37°/2: la unidad siguiente de trigonometría (decisión de la etapa 2).
- Semejanza (AAA da la misma forma): Proporcionalidad. Aquí AAA solo «no fija el tamaño».
- El ángulo inscrito en una semicircunferencia: Circunferencia. La idea 5 ya no usa el arco.

---

## 2. Objeto de la primera pantalla

| Idea | Objeto | Qué es cada cosa |
| --- | --- | --- |
| 1 | **Un tijeral que se arma en el piso del taller**, sobre la silueta del primero marcada con tiza (un techo lleva varios tijerales iguales) | A, B y C = las puntas; AB y AC = las dos vigas ya cortadas; BC = la viga que cierra; m∠A = lo que se abren AB y AC; la silueta = el modelo |
| 2 | **Dos banderines de tela cortados con el mismo molde**, colgados en distinta posición (uno girado y volteado) | A, B, C y D, E, F = las puntas de cada banderín; los arcos (1, 2 y 3) = sus ángulos; el lado frente a cada ángulo = su correspondiente |
| 3 | **Dos caseríos y el pozo que hay que poner igual de lejos de los dos** (como mapa; en «Predice», una antena entre dos carreteras que se cruzan) | A y B = los caseríos; P = el pozo; PA y PB = los caminos; la línea punteada = la mediatriz de AB; en la bisectriz, PH y PK = los caminos más cortos a cada carretera |
| 4 | **Un tijeral con su listón** (el nudillo que une la mitad de una viga inclinada con la mitad de la otra) | A = la cumbrera; B y C = los apoyos sobre las paredes; M y N = la mitad de cada viga; MN = el listón; BC = la viga de abajo |
| 5 | **Una escalera apoyada en la pared, que resbala** | A = la punta en la pared; B = el pie en el piso; C = la esquina de pared y piso (el ángulo recto); M = la mitad de la escalera; CM = de la esquina a esa mitad |
| 6 | **Las dos escuadras del juego de geometría** (en «Lee», la cinta del albañil: 3 m, 4 m y 5 m para sacar una esquina recta) | los catetos = los dos bordes que forman la esquina recta; la hipotenusa = el borde largo; k = el tamaño de la escuadra |

Todos van como **prueba** (`data-prueba`) en `geo-objeto`, que arma la figura con `geo-figura` a escala y pone el objeto
debajo, con la prueba numérica de encuadre y de rótulos (molde §6 y las reglas de las auditorías de Segmentos y de
Triángulos: rótulo dentro de su ángulo, sin tocar un trazo, marcas sobre llaves). El tijeral de la idea 4 es el de
Triángulos con el listón; el mapa de la idea 3 reusa el caserío y la carretera.

---

## 3. Misión de «Juega» (meta que el motor comprueba)

| Idea | Contexto + misión | Controles | `logrado` | Lectura en vivo (enuncia una relación) | `bien` |
| --- | --- | --- | --- | --- | --- |
| 1 | «Don Julián arma un tijeral igual al modelo marcado con tiza. Las vigas AB (8 m) y AC (5 m) ya están cortadas iguales.» **Gira la viga AC (arrastra C o usa el control) hasta que calce sobre la silueta.** | `t` (se queda), m∠A, de 40° a 120°, de 10° en 10°; empieza en 100° | `v.t === 60` | «m∠A = 100°: BC ≈ 10,1 m; el modelo, BC = 7 m.» | «Calza: con 60° entre las dos vigas, BC mide 7 m, igual que el modelo.» |
| 2 | «Los dos banderines salieron del mismo molde; uno quedó girado y volteado.» **Gira y voltea el banderín suelto hasta que calce sobre el otro.** | `giro`, de 0° a 330°, de 30° en 30°; `cara` (derecho o volteado) | giro y cara del calce | «F cae sobre A: los dos tienen tres arcos y, enfrente, 24 cm.» | «Calza: frente a ángulos iguales quedaron lados iguales.» |
| 3 | «Los caseríos A y B están a 6 km uno del otro.» **Mueve el pozo P hasta que quede a 5 km de A y a 5 km de B.** | `dx` e `y` (se quedan), en km | `PA = PB = 5` (dos lugares: a 4 km de AB, a un lado o al otro) | «PA ≈ 4,5 km y PB ≈ 6,3 km: P está más cerca de A.» | «PA = PB = 5 km: P está sobre la mediatriz de AB.» |
| 4 | «Las paredes están a 8 m; M y N son la mitad de cada viga inclinada.» **Mueve la cumbrera A hasta que el listón MN quede a 2 m del piso.** | `ax` y `ay` (se quedan), en m | `v.ay === 4` (cualquier `ax`) | «MN = 4 m, la mitad de BC = 8 m, y va paralelo a BC.» | «A 4 m de alto o más ancho, MN sigue en 4 m: la mitad de BC.» |
| 5 | «Una escalera de 4 m resbala con la punta en la pared y el pie en el piso.» **Deslízala hasta que el pie quede a 2 m de la esquina.** | `fi` (se queda): el ángulo de la escalera con el piso, de 20° a 70°, de 10° en 10° | `v.fi === 60` | «CM = 2 m = MA = MB: la mitad de la escalera.» | «Pie a 2 m: CM = MB = CB = 2 m. La mitad sigue a 2 m de la esquina.» |
| 6 | «Cada escuadra crece sin cambiar de forma.» **Elige la escuadra y su tamaño k hasta que el borde largo mida 10 cm y el corto, 5 cm.** | `tipo` y `k` (se quedan); el de 45° entra al juego como tercera opción solo en la mesa | `30-60` con `k = 5` | «Con k = 5: 5 cm, 5√3 cm ≈ 8,7 cm y 10 cm.» | «En la de 30° y 60°, el borde corto mide la mitad del largo.» |

Ninguna misión está cumplida al abrir y ninguna leyenda da el número que solo sale con la misión cumplida (validador
`leyendaSinRespuesta`). En la idea 1 el rango del control cambia (hoy 20° a 150°) para que los rótulos quepan y no pisen
nada a 390 px; el `id` es el mismo.

---

## 4. La predicción de cada idea

La app baraja las opciones; los `datos` traen solo valores y definiciones, nunca la fórmula. Ningún error de esta unidad
tiene datos medidos: el informe solo trae GE8 y GE9 (prototipos) de segunda mano; los GE-CON son hipótesis de
`rutinas/teoria-geometria.md` y los que dicen «nuevo» los agrego yo. Todos se confirman con la medición del piloto. En la
figura, lo que se pide va con «?» en tinta o no va.

**Idea 1.** «Por teléfono, don Julián dicta tres medidas de otro tijeral: AB = 8 m, m∠A = 30° y BC = 5 m. La viga BC no
toca la punta A. ¿Cuántos tijerales distintos se pueden armar con ellas?» Datos: el ángulo A lo forman la viga AB y la
línea donde irá AC; la punta B queda a 4 m de esa línea.

| Opción | Qué mide |
| --- | --- |
| Dos tijerales distintos | Correcta (AC ≈ 3,9 m o AC ≈ 9,9 m; comprobado aparte) |
| Uno solo: dos lados y un ángulo fijan el triángulo | Toma LLA por LAL: no mira dónde está el ángulo (GE-CON1) |
| Ninguno: la viga de 5 m no alcanza | No compara con la distancia de B a la línea (GE-CON2) |
| Muchos: la viga de 5 m puede quedar en cualquier parte | No ve que su punta tiene que caer en la línea (GE-CON16, nuevo) |

«Mira»: la viga de 5 m gira en B y su punta recorre una circunferencia, que corta la línea en C₁ y C₂; después, las tres
maneras que sí fijan el tijeral: el ángulo entre las dos vigas (LAL), un lado con sus dos ángulos (ALA: dos líneas se
cruzan una sola vez) y los tres lados (LLL: dos circunferencias se cruzan en un solo punto de ese lado).

**Idea 2.** «Dos banderines congruentes cuelgan en distinta posición. En el primero, el lado de 24 cm queda frente al
ángulo de tres arcos. En el segundo, ¿cuál es el lado de 24 cm?» Datos: los ángulos con los mismos arcos miden igual.

| Opción | Qué mide |
| --- | --- |
| El que queda frente al ángulo de tres arcos | Correcta |
| El de abajo, como en el primero | Empareja por la posición en el dibujo (GE-CON17, nuevo; vecino de GE9) |
| DE, porque en el primero era AB | Empareja por el orden alfabético de las letras (GE-CON3) |
| No se sabe sin medir el banderín | Cree que la congruencia no dice qué lado es cuál (GE-CON18, nuevo) |

«Mira»: el banderín suelto se gira y se voltea hasta calzar; cada ángulo cae sobre su igual y cada lado, sobre el que
tiene enfrente.

**Idea 3.** «Dos carreteras rectas se cruzan en O y forman 60°. Una antena P está sobre la bisectriz de ese ángulo, a
5 km de O, y queda a 2,5 km de una carretera. ¿A cuánto queda de la otra?» Datos: la distancia de un punto a una recta
se mide por la perpendicular.

| Opción | Qué mide |
| --- | --- |
| A 2,5 km | Correcta |
| A 5 km, lo mismo que hasta el cruce | Toma la distancia al vértice por la distancia al lado (GE-CON6) |
| Depende de hacia dónde se mida | No mide en perpendicular (GE-CON19, nuevo; hoy comparte código con la anterior) |
| A unos 4,3 km | Da el tramo OH sobre la carretera, 2,5√3 km (GE-CON7) |

«Mira»: los triángulos OHP y OKP tienen un recto, la mitad de 60° y el lado OP de los dos: el tercer ángulo también
coincide (60°) y, por ALA, PH = PK. El juego ya mostró la mediatriz; la regla trae las dos y su recíproco.

**Idea 4.** «El carpintero quiere otro listón: sale de M, la mitad de la viga AB, y va paralelo a la viga de abajo. ¿A
qué punto de la viga AC llega?» Datos: AB = 5 m; AC = 7 m; BC = 8 m; M es el punto medio de AB.

| Opción | Qué mide |
| --- | --- |
| A su punto medio, a 3,5 m de A | Correcta (el recíproco) |
| A 2,5 m de A, lo mismo que AM | Copia la medida en vez de la proporción (GE-CON20, nuevo) |
| Depende de la forma del tijeral | No ve que vale para todo triángulo (GE-CON9) |
| A un tercio de la viga | Confunde con otra partición (GE-CON21, nuevo; hoy comparte código con la anterior) |

«Mira»: se prolonga MN hasta D con ND = MN; △ANM ≅ △CND (LAL, opuestos por el vértice), así CD = AM = MB y CD ∥ AB;
después △MBC ≅ △CDM (LAL, alternos internos y MC de los dos): MD = BC y MD ∥ BC. **Sin paralelogramo.**

**Idea 5.** «Ahora la pared está inclinada hacia afuera y forma con el piso un ángulo de más de 90°. La escalera de 4 m
sigue apoyada en los dos. ¿Cuánto mide CM, de la esquina a la mitad de la escalera?» Datos: AB = 4 m; M es el punto
medio de AB.

| Opción | Qué mide |
| --- | --- |
| Menos de 2 m | Correcta |
| 2 m, como siempre | Usa la regla sin el ángulo recto (GE-CON12) |
| Más de 2 m | Invierte el efecto (GE-CON22, nuevo; hoy comparte código con la anterior) |
| No se puede saber sin el ángulo exacto | Cree que falta un dato para comparar (GE-CON23, nuevo) |

«Mira»: con el ángulo recto, la paralela a CB por M llega al punto medio N de CA (idea 4) y es perpendicular a CA: M
está en la mediatriz de CA y MC = MA (idea 3). Si el ángulo en C no es recto, MN deja de ser perpendicular.

**Idea 6.** «Una escuadra de 45° y 45° tiene el borde largo de 10 cm. ¿Cuánto mide cada borde corto?» Datos: √2 ≈
1,41; en un triángulo rectángulo, el cuadrado del lado mayor es la suma de los cuadrados de los otros dos, dicho con un
ejemplo numérico (3² + 4² = 5²), no con letras.

| Opción | Qué mide |
| --- | --- |
| 5√2 cm, unos 7,1 cm | Correcta |
| 5 cm, la mitad | Lleva la regla del de 30° y 60° al de 45° (GE-CON14) |
| 5√3 cm | Usa el cateto mayor del de 30° y 60° (GE-CON24, nuevo; hoy comparte código con la anterior) |
| 10√2 cm | Multiplica en vez de dividir: un cateto más largo que la hipotenusa (GE-CON15) |

«Mira»: dos escuadras de 45° forman un cuadrado de lado k y la hipotenusa es su diagonal, k√2; dos de 30° y 60°, un
equilátero de lado 2k.

---

## 5. Tabla de letras y símbolos

| Letra | Un solo significado en la unidad | Aviso |
| --- | --- | --- |
| A, B, C | Vértices del primer triángulo (puntas del tijeral y del banderín, caseríos, cumbrera y apoyos, punta y pie de la escalera, C la esquina recta en las ideas 5 y 6) | **Chocan con las alternativas A–E** (decisión vigente: ningún resuelto nombra una alternativa por su letra) y **A choca con la A de «ángulo» en LAL y ALA**: se usa la notación de los libros y «Lee» lo avisa («en LAL, la A no es el punto A: es un ángulo») |
| D, E, F | Vértices del segundo triángulo, en ese orden: △ABC ≅ △DEF empareja A con D, B con E y C con F | Hoy es PQR; P pasa a ser solo el punto que equidista. En las ideas 3 a 6, D es también el punto auxiliar de «Mira» (un solo triángulo en la figura) |
| C₁, C₂ | Los dos lugares de C en la trampa LLA | — |
| L, A (en LAL, ALA, LLL, LLA, AAA) | Lado y ángulo, leídos en orden | Es la sigla de los libros y del CEPRE |
| ≅ | Congruente | Va al glosario |
| P | Un punto de la mediatriz o de la bisectriz (el pozo, la antena) | — |
| M, N | Puntos medios (M de AB en las ideas 3 a 5; N del otro lado) | Como en Segmentos y Triángulos |
| H, K | Pies de las perpendiculares de P a los dos lados del ángulo | H ya era el pie de la altura en Triángulos |
| O | Vértice del ángulo de la bisectriz (el cruce de las carreteras) | — |
| k | El tamaño del notable: lo que mide el lado menor (o su tercera, cuarta y quinta parte en el de 37° y 53°) | El mismo de las razones de Triángulos |
| x | Lo que se pide | **Sin «°»**: m∠A = 2x + 10°, x = 20. Un lado: AC = 3x − 4, x = 7, «AC = 17 cm» |
| m∠A, m∠BAC | La medida de un ángulo; tres letras cuando el vértice tiene varios | Como en Triángulos |
| AB | El lado y su medida | Como en Segmentos |
| ⟂, ∥, △ | Perpendicular, paralela, triángulo | Ya definidos en Triángulos y Segmentos |
| a, b, c | **No se usan** como lados opuestos | Son de Relaciones métricas |
| °, cm, m, km | Unidades | Todo largo lleva la suya |

---

## 6. Mapa de colores (§5b: un color fijo por lo que cada cosa es en la figura)

Es la regla de Triángulos, llevada a dos triángulos:

| Token | Magnitud en esta unidad |
| --- | --- |
| `o` naranja | **el primer lado dado** y su pareja en el otro triángulo (una rayita sobre su llave): la viga AB, PA, la base media MN, el cateto menor |
| `i` turquesa | **el segundo lado dado** y su pareja (dos rayitas): la viga AC, la viga que gira en la trampa LLA y la circunferencia que recorre su punta, PB, la mediana (como en Triángulos), el cateto mayor |
| `h` carmín | **todo ángulo dado**, con 1, 2 o 3 arcos (sus iguales en el otro triángulo llevan los mismos arcos); la bisectriz |
| `f` violeta | lo que se pide, ya resuelto, **solo en el texto del resuelto y en la respuesta**; nunca en una figura ni en un enunciado |
| tinta | el tercer lado (tres rayitas), la viga que cierra, la hipotenusa, lo que no es dato, lo pedido con «?», las líneas auxiliares y la mediatriz (discontinua) |
| `d` verde | no se usa |

- **Las marcas de igualdad van siempre sobre una llave**, nunca sobre el lado (decisión de la quinta ronda).
- **En los ejercicios de la idea 2** (hallar el lado correspondiente), los lados dados van **en tinta**, con su medida:
  si las parejas compartieran color, el color daría la respuesta. Los ángulos sí llevan sus arcos, que son el dato.
- **Pares que van juntos:** naranja–turquesa 0,114, turquesa–carmín 0,077, violeta–carmín 0,167. El par débil
  naranja–carmín (0,062) aparece cuando el ángulo carmín queda entre un lado naranja y otro turquesa: el ángulo siempre
  lleva su arco y su valor.
- La escena `congruencia` y las tres mesas usan hoy verde y rojo: las mesas se corrigen con su idea (fase 3) y la
  escena, cuando se rehaga.

| Idea | Carmín | Turquesa | Naranja | Violeta | Tinta |
| --- | --- | --- | --- | --- | --- |
| 1 | m∠A y todo ángulo dado | AC, la viga que gira y su circunferencia | AB | la respuesta | BC, la línea de AC, la silueta |
| 2 | los ángulos, por sus arcos | — | — | el lado o ángulo pedido, resuelto | los lados, con su medida |
| 3 | la bisectriz y sus mitades | PB, PK | PA, PH | la distancia pedida | AB, la mediatriz (discontinua), las carreteras |
| 4 | ángulos iguales de «Mira» | BC | MN | la medida pedida | las vigas, la prolongación |
| 5 | el recto en C, los ángulos que se copian | la mediana CM | — | el ángulo o lado pedido | la escalera AB, pared y piso |
| 6 | los ángulos del notable | el cateto mayor | el cateto menor | el lado pedido | la hipotenusa |

---

## 7. Práctica y datos del mundo

### 7a. Qué existe y qué falta

Lo que hay:
- **La escena `congruencia`** (borrador 0.1.0, «El armador de triángulos»): criterios con piezas, la trampa LLA,
  mediatriz, bisectriz, base media y mediana a la hipotenusa; 20 casos y papel. Sin `datos`, con verde y rojo.
- **Ningún generador** (el temario lo dice: «Prácticas que ya existen: ninguna»).
- **Mesas:** `compas-lla` (idea 1), `base-libre` (idea 4), `c-libre` (idea 5).
- **Prueba del tema:** cg-01 (mediatriz con Pitágoras) y cg-02 (mediana a la hipotenusa), los dos con la plantilla
  `congruencia`.

| Idea | Hay | Falta |
| --- | --- | --- |
| 1 Criterios | mesa `compas-lla`; pestaña de criterios de la escena | generador: nombrar el criterio, el dato que falta, cuántos triángulos da LLA, lado común y cruce, con x; papel |
| 2 Correspondientes | nada | todo: lado y ángulo correspondiente, lado común, opuestos por el vértice, congruencia más isósceles; una mesa (los banderines); ítem de prueba |
| 3 Mediatriz y bisectriz | pestañas de la escena; cg-01 | generador: igualar dos expresiones, el recíproco, dos bisectrices, perpendicular a la bisectriz; una mesa (el pozo) |
| 4 Base media | mesa `base-libre` | generador: base media, triángulo medial, dos bases medias, con x; ítem de prueba |
| 5 Mediana | mesa `c-libre`; cg-02 | generador: mediana, los dos isósceles, el ángulo con la altura, el recíproco |
| 6 Notables | nada (hay tipos sueltos en `geo-triangulos-notables`, de otra unidad) | generador: completar lados, notable escondido en un isósceles o con una altura trazada; una mesa (las escuadras con 45°); ítem de prueba |

Propuesta: una plantilla nueva de formato `predicciones`, **`plantillas/geo-congruencia/`**, con los tipos separados por
idea (`TIPOS_POR_IDEA`), `datos` por línea, prueba en 400 semillas, `casos.json` verificado aparte y papel de 5 a 10 por
idea. La escena `congruencia` va a «Más mesas del tema» (`"rehacer": true`). Prueba del tema: los pares cg-01 y cg-02 se
quedan y se agregan dos (correspondientes con lado común; notables). Las mesas `c-libre` y `compas-lla` conservan su `id`
y cambian de colores con su idea.

### 7b. Datos del mundo

La unidad casi no los necesita: los objetos son de todos los días y sus medidas, de problema, pero posibles (punto 10).

| Dato | ¿Fuente? |
| --- | --- |
| Tijeral de 8 m, 5 m y 7 m (ángulos de 60°, unos 38° y unos 82°) | Valor de problema, posible para el techo de un taller; cuentas rehechas aparte |
| «Un techo lleva varios tijerales iguales, uno detrás de otro» y «el primero se marca con tiza en el piso» | Práctica de taller, sin cifra; se dice en general, sin nombrar un lugar |
| Banderines de 15 cm, 21 cm y 24 cm; cometa de varillas de 30 cm y 50 cm; escalera de 4 m; escuadras de 10 cm | Valores de todos los días, con «unos» cuando van en una tarjeta, sin fuente |
| Caseríos a 6 km; antena a 5 km de un cruce | Valores de problema; el mapa no lleva nombres reales |
| El albañil y la cinta de 3 m, 4 m y 5 m | Práctica de obra conocida, sin fuente; se queda como hoy, sin «de Juliaca» |
| 37° y 53° | «≈» en la teoría (miden 36,87° y 53,13°) y «(convención del examen)» en `datos`, como en Razones trigonométricas |
| Historia: Elementos I.4 | Ya trae fuente (edición de D. E. Joyce, Clark University) |

---

## 8. Riesgos de orden con otras unidades (`requiere`)

**Lo que esta unidad da por sabido** (todo de `geometria.triangulos`, su único `requiere`, que confirmo, y por ella de
Segmentos): la suma de 180°, el ángulo exterior, el isósceles y su recíproco, la desigualdad triangular, altura, mediana,
bisectriz y mediatriz como líneas, punto medio, perpendicular, paralelas con alternos internos, opuestos por el vértice
y despejar x.

**Riesgos dentro de la unidad:** la idea 3 usa AAL (idea 1) y correspondientes (idea 2); la 4, dos congruencias; la 5, la
base media y la mediatriz; la 6, el isósceles, el equilátero y la mediana. El orden propuesto los cubre. La idea 1 no
puede pedir «hallar un lado en una figura con trazos»: eso es de la idea 2. Sus ejercicios solo usan que en triángulos
congruentes las seis medidas coinciden, que «Lee» presenta.

**Lo que hay que rehacer para no usar lo que viene después:**

| Hoy | Problema | Cómo queda |
| --- | --- | --- |
| «Mira» de la base media: «MBCD es paralelogramo» | El paralelogramo es de Polígonos, que requiere esta unidad | Dos congruencias LAL (sección 4, idea 4) |
| «Mira» de la mediana: «las diagonales del rectángulo son iguales» y el juego sobre una semicircunferencia | Rectángulo (Polígonos) y ángulo inscrito (Circunferencia) | La escalera que resbala; la prueba, con base media y mediatriz |
| Notables con Pitágoras | Pitágoras se enseña en Relaciones métricas | Pitágoras como dato y en «Lee», como hizo Razones trigonométricas; «1/√2 = √2/2» como dato |

**Lo que no hay que adelantar:**

| Unidad que viene | Lo que es suyo | Cómo se evita aquí |
| --- | --- | --- |
| Polígonos y cuadriláteros | paralelogramos, rectángulo, mediana del trapecio | ninguna prueba los usa; el trapecio no entra |
| Circunferencia | ángulo inscrito, tangentes | la circunferencia aparece solo como «la punta de una viga que gira» |
| Proporcionalidad | Thales, teorema de la bisectriz, semejanza | la base media no se generaliza a «un tercio»; AAA solo «no fija el tamaño» |
| Puntos notables | circuncentro, incentro | una sola mediatriz y una sola bisectriz; dos bisectrices solo en el nivel examen (San Marcos 2019-I), sin nombre |
| Relaciones métricas | Pitágoras y sus ternas | dato |

**Lo que otras unidades toman de aquí:** Polígonos prueba sus paralelogramos con congruencia y su mediana del trapecio
con la base media; Circunferencia usa la mediatriz de una cuerda y los radios; Puntos notables, las tres mediatrices y
las tres bisectrices; Simetría requiere esta unidad; Razones trigonométricas (otro curso) ya da 37° y 53° como
convención.

---

## 9. Decisiones tomadas (Gerson revisa después)

1. **Seis ideas, con `partes-correspondientes` nueva en el segundo lugar; la unidad no se parte.** Motivo: 11 de las 20
   preguntas de San Marcos piden usar la congruencia y hoy nadie lo enseña. *Descartado:* partir en «Congruencia» y
   «Aplicaciones de la congruencia», como los libros de academia (dos unidades de 2 y 4 ideas; la primera quedaba muy
   corta y había que migrar el avance), y meter la correspondencia dentro de la idea 1 (quedaba con dos reglas).
2. **Mediatriz y bisectriz siguen en una sola idea.** Motivo: es una sola noción (equidistar) probada dos veces; el juego
   hace una y la predicción la otra. *Descartado:* separarlas con `septimaIdea` (33 fichas del banco lo podrían
   justificar, pero San Marcos solo trae 4 preguntas).
3. **La idea 1 pregunta cuántas medidas fijan un triángulo, con un tijeral que se copia sobre su silueta de tiza.**
   Motivo: «copiar» es la manera más corta de decir «congruente», y el tijeral ya es el objeto de Triángulos. *Descartado:*
   las ventanas del edificio de hoy (no se arman con tres medidas) y dos triángulos lado a lado (a 390 px quedan chicos y
   no se ve el calce).
4. **Los ejercicios de la idea 1 dibujan un solo triángulo con los datos marcados** cuando se pregunta si los datos
   bastan. Motivo: dos triángulos iguales dirían «sí» y dos distintos dirían «no»; el dibujo daría la respuesta (molde
   §3).
5. **Colores:** primer lado naranja, segundo turquesa, tercero en tinta, ángulos en carmín con arcos, sin verde; marcas
   sobre llaves; en la idea 2, lados en tinta. Motivo: es la regla de Triángulos y evita que el color empareje por el
   alumno. *Descartado:* un color por pareja de lados correspondientes en toda la unidad.
6. **Notación:** el segundo triángulo es DEF (no PQR); m∠A; x sin «°»; LAL, ALA y LLL como en los libros, con el aviso de
   que esa A no es el punto A; «LLA» para el caso que no es criterio. *Descartado:* «ALL» o «cuarto caso» (el caso con el
   ángulo frente al lado mayor): solo una línea en la condición de la regla, sin nombre.
7. **AAL se enseña como «ALA con el tercer ángulo»**, en «Así se resuelve» y en la regla, no como un criterio más.
   Motivo: usa la suma de Triángulos y es lo que pide la prueba de la bisectriz.
8. **Las pruebas de la base media y de la mediana se rehacen sin paralelogramo, rectángulo ni circunferencia** (sección
   8). Motivo: punto 9; Polígonos y Circunferencia vienen después. La escalera que resbala reemplaza al arco.
9. **Pitágoras, √2 y √3 entran como dato en la idea 6**, y 37° y 53° con «≈» y «(convención del examen)». Motivo: es lo
   que ya se decidió para Razones trigonométricas (etapa 2). *Descartado:* mover los notables a Relaciones métricas (el
   catálogo y los libros los ponen aquí, y San Marcos los mezcla con congruencia).
10. **Rango del control `t` de la idea 1:** de 40° a 120° (hoy 20° a 150°), empezando en 100°. Motivo: fuera de ese rango
    los rótulos pisan las vigas a 390 px (lo comprueba la prueba de la pieza). El `id` no cambia y el avance guardado se
    ajusta solo.
11. **Códigos:** GE-CON1 a 3 y 6 a 15 se quedan; agrego como hipótesis GE-CON4 y 5, GE-CON16 a 24 (los de la sección 4) y
    GE-CON25 a 31 (los de «Ahora tú» de la idea 1), anotados en `rutinas/teoria-geometria.md` y en el informe de
    geometría. Donde hoy dos opciones comparten código, se parten.
12. **Práctica:** plantilla nueva `geo-congruencia` por idea; la escena `congruencia` a «Más mesas del tema»; dos pares
    nuevos en la prueba del tema. *Descartado:* estirar `geo-triangulos-notables` (es de Puntos notables).
13. **Títulos con el nombre del tema** (sección 1) y el tema nuevo «Lados y ángulos correspondientes» en la ficha. Los `id`
    no cambian.
14. **Mientras llega la fase 3,** las ideas 3 a 6 quedan con su contenido de hoy y su título nuevo, y la idea 2, como
    esqueleto válido (juego de girar y voltear, predicción, regla y un «Ahora tú» corto). La unidad no declara `calidad: 2`.

### Decisiones chicas que salieron al escribir la idea 1 (fase 2)

15. **«Mira» de la idea 1 tiene 7 pasos** (el tope): cuatro para la trampa LLA y uno para cada criterio (LAL, ALA y LLL),
    siempre con el mismo tijeral de 8 m, 5 m y 7 m. Motivo: la regla nombra los tres criterios y «Ahora tú» los pide; sin
    esos pasos, ALA y LLL quedaban solo dichos. *Descartado:* dejarlos para el dibujo de la regla.
16. **Un ángulo que no cabe con su número va solo con su arco**, y el número, en la ecuación del paso: el 30° cuando ya
    están puestas las dos vigas BC₁ y BC₂, y el «≈ 38°» de ALA (junto al 60° se leían pegados).
17. **Los ejemplos de nivel 3 explican cada alternativa incorrecta por su valor**, no por su letra (ver el conflicto de
    arriba), en una cuarta línea del resuelto.
18. **Dos ejemplos van sin escala** («Paralelas y un cruce» y «El tijeral y su poste»), con «El dibujo no está a escala»:
    a escala, la respuesta se medía con regla o con transportador. Los demás van a escala, comprobada con números.
19. **El primer ejemplo usa el tijeral; los demás, figuras de examen**, y la cometa (ejemplo 8) es un dibujo de prueba
    nuevo. Cuando la pregunta es si los datos bastan, se dibuja un solo triángulo (decisión 4).
20. **«Así se resuelve» de la idea 1** trae dos casos que «Ahora tú» no pide: dos ángulos y un lado que no está entre
    ellos (ALA con el tercer ángulo) y un ángulo igual que en el segundo triángulo cae en otro vértice.
21. **El glosario no dice cuántos triángulos da LLA** (es la predicción): «LLA» se define como «dos lados y un ángulo que
    no queda entre ellos; no es un criterio».

### Decisiones de la fase 3 (las ideas 2 a 6, la práctica y el cierre de contenido)

22. **Los banderines de la idea 2 están sobre la mesa de costura**, no colgados: un banderín colgado no se puede girar
    cualquier ángulo. *Descartado:* el cordel (el giro libre lo contradecía).
23. **La mediatriz y la bisectriz van punteadas y en tinta**, y las mitades de la bisectriz en carmín con su rayita. La
    tabla de colores (sección 6) ponía la bisectriz en carmín; en tinta no compite con los ángulos y la prueba de colores
    de la unidad queda simple (lados solo naranja, turquesa o tinta). *Descartado:* la recta carmín.
24. **El pozo del juego de la idea 3 solo se mueve arriba de AB** (y de 1 km a 5 km): con P sobre AB las letras se pisaban,
    y la misión queda con una sola solución (P a 4 km sobre M).
25. **Un rótulo que no cabe junto a su vértice va solo con su arco, y su valor, en el enunciado** (la decisión 16, llevada
    a todas las ideas): pasó con ángulos de cuñas angostas (el 25° de la mediana, el 45° y el 37° de la altura que parte en
    dos notables). Lo mismo con algunas medidas: en el juego, si la medida del camino no cabe, va solo en la lectura.
26. **Cinco mesas, una por idea, salvo la 2** (el tope del laboratorio es 5): la circunferencia de LLA, el pozo, la base
    media con base libre, la esquina que se abre (C libre, antes «C dentro y fuera del círculo») y las escuadras (con la de
    45°). La de los banderines quedó escrita pero fuera: el juego de la idea 2 ya gira y voltea. Las tres de antes
    conservan su `id` y pasan a los colores de su idea.
27. **La práctica nueva `geo-congruencia` no lleva figura**: 26 tipos que se resuelven con el texto, por idea, con niveles
    hasta los modelos de San Marcos (2021, 2022, 2023-II, 2024-II, 2026-II y 2027-I). La escena `congruencia` pasa a «Más
    mesas del tema» (`"rehacer": true`). *Descartado:* figuras en la práctica (la teoría ya trae 90 ejemplos con figura).
28. **Prueba del tema:** las formas de geometría ya tienen 10 pares; cg-03 (lados correspondientes con x) y cg-04 (la altura
    que parte en dos notables) van a la reserva, con su verificador.
29. **Glosario:** «perímetro» y «recíproco» los definen Polígonos y Proporcionalidad: aquí no se repiten. «Radio»,
    «diámetro» y «paralelogramo» se quedan porque otras unidades del curso los mandan a ver aquí.

