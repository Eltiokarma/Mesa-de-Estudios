# Propuesta de ideas: «Resolución de triángulos rectángulos»

`trigonometria.triangulos-rectangulos` · Etapa 7 del plan de calidad, cuarta y última unidad de la rama «Ángulos y
razones» (sigue a «Ángulo trigonométrico», «Longitud de arco y sector» y «Razones trigonométricas de ángulos agudos», las
tres con `calidad: 2`) · fases 1 a 5 con criterio delegado (`docs/metodo/unidad/etapa-delegada.md`) · 19 nov 2026

Gerson delegó el criterio: esta propuesta es el guion de la unidad y se usa para escribirla. Las dudas van como
**decisiones tomadas** (sección 9), cada una con su motivo y la opción descartada. No hay ningún conflicto crítico.

**Estado (19 nov, fases 1 a 5 hechas):** las cinco ideas están escritas enteras (Lee, juego con misión, predicción, Mira,
regla con dibujo propio, «Así se resuelve», «Ahora tú» de tres tipos con datos y nivel de examen, glosario con `simple` y
15 ejemplos cada una), con la pieza nueva `trig-vista` (escenas de lado, dibujos de prueba), un laboratorio de cinco
mesas y la práctica nueva `plantillas/trig-resolucion/` (15 tipos, 30 casos verificados aparte y 8 de papel). La unidad no
declara `calidad: 2`; con la marca simulada y 400 semillas, el validador no da faltas. Lo que cambió durante la escritura
está en la sección 9 (decisiones 17 a 22).

Lo que leí: `CLAUDE.md`, `docs/plan-calidad.md` §3, `docs/molde-unidad.md`, `docs/teoria.md` (4e a 4j y §5),
`docs/metodo/unidad/` (LEEME, 1-ideas, 2-ejemplos, 3-practica, reglas-validador y etapa-delegada), las decisiones de
`docs/etapa2/` a `docs/etapa6/`, `docs/etapa6/propuesta-trigonometria.md` (modelo de formato), la unidad anterior de la
rama (`razones-trigonometricas-agudas.js` con su auditoría y su lector en frío) y la de antes (`longitud-de-arco-y-sector.js`
con su auditoría: el ángulo pedido dibujado con su medida, los rótulos encimados y «Ahora tú» que repetía un ejemplo), la
teoría actual de esta unidad (v0.1.0, tres ideas sin contrato), su ficha en `catalogo/cursos/trigonometria.json`, sus dos
plantillas (`trig-angulos-verticales` y `circunferencia-trig`), `docs/investigacion/trigonometria-ideas-erroneas.md`,
`docs/temario-completo.md` (unidad 4), la matriz `docs/teoria/matriz/trigonometria.json`, la prueba del curso
(`catalogo/pruebas/trigonometria.json`: ningún ítem de esta unidad), las trece preguntas de San Marcos de
`docs/datos/admision-unmsm.csv` y, para no contradecir, `fisica/vectores.js` (componentes F cos α y F sen α) y
`fisica/movimiento-rectilineo.js` (d = v · t, la letra d de la distancia recorrida).

---

## Lo que pregunta la admisión

**Catálogo:** UNI, semana 1; San Marcos, temas 3 y 12. **Banco Cuzcano:** unas 24 fichas, todas de ángulos de elevación y
depresión.

**San Marcos, admisión real 2019-I a 2027-I:** trece preguntas de esta unidad.

| Periodo (examen) | Qué piden | Idea donde cae |
| --- | --- | --- |
| 2019-I (16 set 2018, n.º 49) | Altura de una montaña con dos elevaciones desde un vehículo en marcha | 4, nivel examen (d = v · t) |
| 2019-II (9 mar 2019, n.º 10) | Distancia al punto alto de un poste con una condición entre seno y coseno | No entra: es de identidades (decisión 10) |
| 2019-II (10 mar 2019, n.º 48) | Un lado con dos ángulos dados por sus razones, planteando con una constante | 2, nivel examen |
| 2020-I (14 set 2019, n.º 54) | Recorrido en un puente escrito con cotangentes y cosecantes | 2, nivel examen (es su objeto de «Ahora tú») |
| 2020-I (14 set 2019, n.º 55) | Tangente de la diferencia de dos elevaciones a la mitad y a la cima de una torre | 5, solo con notables (decisión 10) |
| 2020-I (15 set 2019, n.º 48) | Altura de un poste visto desde dos cámaras a ambos lados, con notables | 4 (es su segundo tipo) |
| 2021 (4 set 2021, n.º 45) | Altura de vuelo de una avioneta que ve un auto con dos depresiones complementarias | 4, nivel examen |
| 2023-I (16 oct 2022, n.º 43) | Largo de un muro entre dos edificios, con dos depresiones | 4, nivel examen |
| 2023-I (23 oct 2022, n.º 40) | Altura de una montaña vista por un dron con dos depresiones en un intervalo | 4, nivel examen. Trampa: sumar en vez de restar |
| 2023-I (10 dic 2022, n.º 39) | Altura de un poste con dos cables y la tangente de una suma | No entra: es de arcos compuestos (decisión 10) |
| 2023-II (2 abr 2023, n.º 39) | Altura de un poste con cámara que ve un auto con dos depresiones en un intervalo | 4, nivel examen |
| 2024-II (10 mar 2024, n.º 45) | Ancho de una pista igual a la sombra de un poste, con el seno | 1 y 3 |
| 2027-I (24 oct 2026, n.º 41) | Altura de un edificio con una depresión y una elevación hacia un mismo punto | 3, nivel examen. Trampa: restar las tangentes en vez de sumarlas |

Pesa, por lejos, **dos ángulos hacia una misma punta** (ocho de trece). Las trampas que se repiten (medir la depresión
desde la vertical, olvidar la altura de los ojos, sumar donde se resta y elegir mal la razón) son distractores de las
ideas 1 a 4.

---

## 0. Qué tiene hoy la unidad y qué se queda o sale

1. **Tres ideas** (`un-lado-un-angulo`, `elevacion-depresion`, `angulo-observacion`), con «Lee» y «Así se resuelve», y un
   laboratorio de cuatro mesas (`torre-campo` en 3D, `instrumento`, `faro`, `letrero-cerca`). La base sirve: un lado y un
   ángulo bastan; la depresión de arriba es la elevación de abajo; el ángulo de observación es una resta de elevaciones y
   tiene un máximo.
2. **Punto 1: ninguna primera pantalla tiene un objeto.** Las tres abren con la pieza abstracta `triangulo` (un triángulo
   con «ojo», puntos y líneas). La torre, el faro y el letrero están solo escritos.
3. **Punto 2: no hay misión,** ni `leyenda`, `aprendizaje`, `actividad`, `pregunta` ni `letras`; la cabecera dice «3.º de
   secundaria» y la ficha, `grado: 3`.
4. **Punto 13: ningún ejercicio trae `datos`.** No hay ejemplos resueltos (0 de 45) y el glosario trae un ejemplo por
   término, sin `simple`.
5. **«Así se resuelve» es el mismo tipo que «Ahora tú»** con otra semilla, en las tres ideas.
6. **Colores contra la rama:** θ en naranja, CO en rojo, H en verde. En «Razones» (la unidad anterior, con `calidad: 2`) el
   ángulo es carmín, CO naranja, CA turquesa y H en tinta.
7. **Lecturas que encadenan con «·»** («CO = 6 sen 30° ≈ 3 · CA ≈ 5,2»), lo que el molde prohíbe.
8. **Convención mal escrita:** «(convención 3-4-5)»; la forma de la app es «(convención del examen)».
9. **Falta lo que más pregunta San Marcos:** dos ángulos hacia una misma punta (ocho de trece preguntas) no tiene idea.
10. **La práctica no es de la unidad:** `trig-angulos-verticales` trae también la tangente de una diferencia
    (`mitad-cima`, `objeto-elevado`, `dron-camino`), condiciones con sen θ + cos θ y medios ángulos (`puente-simbolico`),
    que son de Identidades; `circunferencia-trig` es una escena vieja con paleta propia y papel de otras unidades.

**Se queda:** los tres `id` de idea, las cuatro mesas con sus `id` (con colores nuevos), la historia de al-Biruni (con
fuente) y los diez términos del glosario, que otras unidades del curso pueden usar.

**Sale o cambia:** los títulos; las tres primeras pantallas (pasan a objetos); las predicciones de las ideas 1 y 3
(`un-lado-un-angulo` y `elevacion-depresion`); los colores; la idea 4 vieja de la figura del triángulo pasa a una pieza
nueva; `trig-angulos-verticales` y `circunferencia-trig` dejan de servir a esta unidad.

---

## 1. Las ideas, en orden

Cinco ideas, tres con su `id` de siempre y dos nuevas. No hace falta partir la unidad ni declarar `septimaIdea`.

| # | `id` | Título (≤ 6 palabras) | `aprendizaje` |
| --- | --- | --- | --- |
| 1 | `un-lado-un-angulo` | La hipotenusa y un ángulo | Con la hipotenusa H y un ángulo agudo θ, el opuesto mide H · sen θ y el adyacente, H · cos θ: se multiplica. |
| 2 | `cateto-y-angulo` (nueva) | Un cateto y un ángulo | Con un cateto y θ, el lado buscado es el conocido por la razón que lleva el buscado arriba y el conocido abajo. |
| 3 | `elevacion-depresion` | Ángulos de elevación y depresión | Elevación y depresión se miden desde la horizontal del ojo; la depresión de arriba es la elevación de abajo, y la altura de los ojos se suma. |
| 4 | `dos-angulos` (nueva) | Dos ángulos hacia la misma punta | Dos visuales a una misma punta arman dos triángulos con la misma altura h: cada distancia al pie es h · cot de su ángulo, y esas distancias se restan o se suman. |
| 5 | `angulo-observacion` | Ángulo de observación | El ángulo de observación es la resta de las elevaciones de los dos bordes, φ = β − α; acercarse lo agranda solo hasta un punto. |

**Por qué va cada una en su lugar y qué da por sabido**

1. **La hipotenusa y un ángulo.** Va primero porque es el caso más simple de despejar: el lado buscado está arriba en la
   razón y la hipotenusa pasa multiplicando. «Razones» dejó fuera, a propósito, despejar un lado (decisiones de la Etapa
   2): aquí entra. Es lo mismo que Física («Vectores») da como dato para las componentes, F cos α y F sen α.
2. **Un cateto y un ángulo.** Usa las seis razones de «Razones» (cot, sec y csc llegaron en su idea 5). La regla es una
   sola para las dos ideas: buscado = conocido · razón, con la razón armada «buscado sobre conocido». Su predicción es la
   trampa de multiplicar donde la idea 1 multiplicaba: la hipotenusa no puede salir menor que un cateto.
3. **Elevación y depresión.** Usa las ideas 1 y 2 con una visual: la altura es el opuesto a la elevación y la distancia
   por el suelo, el adyacente. Suma la altura de los ojos (el error objetivo de la matriz) y la depresión desde lo alto.
4. **Dos ángulos hacia la misma punta.** Junta dos triángulos de la idea 3 que comparten la altura: cada distancia al
   pie es h · cot (idea 2). Es la idea más pedida por San Marcos.
5. **Ángulo de observación.** Al final, porque usa dos elevaciones desde el mismo ojo (idea 3) hacia dos puntos de un
   mismo objeto. Con notables (16°, 37°, 45°, 53°) no hace falta la tangente de una diferencia.

**Da por sabido** (de `trigonometria.razones-trigonometricas-agudas`, su único `requiere`): las seis razones, los lados
de un triángulo rectángulo nombrados desde un ángulo, 30°, 45° y 60° exactos, y 37°, 53°, 16° y 74° como convención del
examen. **Va como dato** cuando se usa: el triángulo notable de cada ángulo (sus tres lados), las razones como cocientes,
Pitágoras, «alternos internos entre paralelas» (en «Lee» y en la regla de la idea 3) y d = v · t.

**Qué no entra** (y dónde va):
- La tangente de una suma o de una diferencia (San Marcos 2020-I n.º 55 y 2023-I n.º 39): `arcos-compuestos`.
- Condiciones con sen θ + cos θ o con el ángulo doble (San Marcos 2019-II n.º 10) y medios ángulos: Identidades.
- Triángulos que no son rectángulos (ley de senos y de cosenos): `triangulos-oblicuangulos`.
- El área de un triángulo con el seno (½ab sen θ): `areas-y-lineas-notables`.

**Temas de la ficha:** se quedan los tres («Resolver con un lado y un ángulo», «Ángulos de elevación y depresión»,
«Ángulo de observación») y entra uno: **«Dos ángulos de elevación o depresión»** (idea 4). La idea 2 también cubre
«Resolver con un lado y un ángulo».

---

## 2. Objeto de la primera pantalla

Ninguna pieza del kit los dibuja: la idea 1 estrena la pieza **`trig-vista`** (dibujos de prueba, `data-prueba`, con su
prueba numérica de encuadre y de rótulos): una escena de lado con el suelo, los objetos a escala (las alturas y las
distancias) o como íconos de tamaño fijo (la cometa, el globo, la combi, el barco, el dron), las visuales punteadas, las
horizontales del ojo y los ángulos. Los ángulos se dibujan con su medida, salvo los que se piden (decisión 15).

| Idea | Objeto | Qué es cada cosa |
| --- | --- | --- |
| 1 | **Una cometa en la pampa**, con la pita amarrada a una estaca | la pita tensa es la hipotenusa; la altura de la cometa, el opuesto al ángulo de la pita con el suelo; el suelo hasta debajo de ella, el adyacente |
| 2 | **Una antena con su cable tensor** | la antena es el opuesto al ángulo del cable con el suelo; el suelo hasta la estaca, el adyacente; el cable, la hipotenusa |
| 3 | **Un globo aerostático que sube recto** y una niña que lo mira | la visual sale de sus ojos (a 1,5 m del suelo); la elevación nace en la horizontal de sus ojos |
| 4 | **Un cerro visto desde la carretera**, con una combi en dos lugares | las dos visuales van a la misma punta; las dos distancias al pie comparten la altura del cerro |
| 5 | **Un letrero en un poste** frente a una persona | las dos visuales a sus bordes, de abajo y de arriba; entre ellas, el ángulo de observación |

---

## 3. Misión de «Juega» (meta que el motor comprueba)

| Idea | Contexto + misión | Controles | `logrado` | Lectura en vivo |
| --- | --- | --- | --- | --- |
| 1 | «La pita de la cometa, bien tensa, es la hipotenusa H; θ es su ángulo con el suelo.» **Con 40 m de pita, haz que la cometa vuele a 20 m de altura.** | `g` (θ: 30°, 45° o 60°); `H` (de 20 a 60 m, de 10 en 10) | `g === 30 && H === 40` | «h = H · sen θ = 40 · sen 30° = 20 m» |
| 2 | «La antena es el cateto opuesto al ángulo θ del cable con el suelo.» **Con la antena de 12 m, clava la estaca a 4√3 m de su pie.** | `g` (θ: 30°, 45° o 60°); `h` (6, 9 o 12 m) | `g === 60 && h === 12` | «d = h · cot θ = 12 · cot 60° = 4√3 m ≈ 6,93 m» |
| 3 | «La niña mira la canasta del globo; sus ojos están a 1,5 m del suelo.» **Con el globo a 20 m de ti, haz que su canasta suba a 21,5 m del suelo.** | `d` (de 10 a 30 m, de 5 en 5); `g` (θ: 30°, 45° o 60°) | `d === 20 && g === 45` | «sobre tus ojos, 20 · tan 45° = 20 m; del suelo, 21,5 m» |
| 4 | «La combi ve la punta del cerro, de 300 m, con α y, más adelante, con β.» **Haz que la combi avance justo 200√3 m entre las dos miradas.** | `a` (α: 30°, 45° o 60°); `b` (β: 30°, 45° o 60°) | `a === 30 && b === 60` | «avanzó 300√3 − 100√3 = 200√3 m ≈ 346,4 m» |
| 5 | «El letrero va de 2 m a 6 m sobre tus ojos.» **Busca una distancia desde la que el letrero abarque más de 25°.** | `d` (de 6 a 12 m, de 1 en 1) | `φ(d) > 25°` (solo d = 6) | «φ = β − α ≈ 45° − 18,4° ≈ 26,6°» |

Cada misión se cumple con un solo caso de su grilla y no al abrir (lo comprueba la prueba de la unidad).

---

## 4. La predicción de cada idea

La app baraja las opciones. Los `datos` solo traen valores, nunca la fórmula. TR9 es del informe de trigonometría
(parcial); lo demás son hipótesis de aula, con su código.

**Idea 1.** «La pita de otra cometa mide 50 m y forma 37° con el suelo. ¿A qué distancia de la estaca, por el suelo, queda
el punto que está justo debajo de la cometa?» Datos: «sen 37° = 3/5 y cos 37° = 4/5 (convención del examen)». El juego solo
da la altura (el seno); aquí se pide el suelo.

| Opción | Qué mide |
| --- | --- |
| 40 m | Correcta: 50 · cos 37° |
| 30 m | Multiplica por el seno: esa es la altura (TR9) |
| 62,5 m | Divide la pita entre el coseno (RES-DIVIDE) |
| 50 m | Toma la pita por el suelo (RES-IGUAL) |

**Idea 2.** «Otra antena mide 10 m y su cable llega al suelo formando 30°. ¿Cuánto mide el cable?» Datos: «sen 30° = 1/2,
cos 30° = √3/2 y tan 30° = √3/3». El juego solo da la distancia a la estaca.

| Opción | Qué mide |
| --- | --- |
| 20 m | Correcta: 10 · csc 30° = 10 ÷ sen 30° |
| 5 m | Multiplica por el seno, como en la idea 1 (RES-MULTIPLICA): sale menor que la antena |
| 10√3 m ≈ 17,32 m | Da la distancia a la estaca (TR9) |
| 20√3/3 m ≈ 11,55 m | Divide entre el coseno (TR9) |

**Idea 3.** «La niña ve la canasta del globo con 30° de elevación. Desde la canasta, el piloto la mira a ella. ¿Con qué
ángulo de depresión la ve?» Datos: «Elevación desde los ojos de la niña: 30°.» El juego solo mide desde abajo.

| Opción | Qué mide |
| --- | --- |
| 30°, el mismo | Correcta: las dos horizontales son paralelas (alternos internos) |
| 60° | Mide desde la vertical, la cuerda del globo (DEP-VERTICAL) |
| No se sabe sin la altura | Cree que hace falta calcular (DEP-FALTA) |
| 150° | Mide desde la horizontal del otro lado (DEP-SUPLE) |

**Idea 4.** «Desde la carretera, la punta de otro cerro se ve con 30°; la combi avanza 200 m hacia él y la ve con 60°.
¿Cuánto mide el cerro?» Datos: «tan 30° = √3/3, tan 60° = √3 y √3 ≈ 1,73». El juego siempre da la altura del cerro.

| Opción | Qué mide |
| --- | --- |
| 100√3 m ≈ 173 m | Correcta: h · cot 30° − h · cot 60° = 200 |
| 200√3 m ≈ 346 m | Toma los 200 m por la distancia al pie (DOS-UN-TRIANGULO) |
| 200 m | Toma la visual del segundo lugar por la altura (DOS-VISUAL) |
| 100 m | Usa el seno de 30° con la caminata (TR9) |

**Idea 5.** Se queda la de hoy (mismos `id` de opción): «En el juego, acercarse agranda φ. Si sigues acercándote hasta
quedar junto al poste, ¿qué le pasa a φ?» — crece hasta un máximo y luego baja hacia 0° (correcta); sigue creciendo
(OBS-CRECE); desde cierta distancia ya no cambia (OBS-CONSTANTE); crece hasta 45° y se queda (OBS-45).

---

## 5. Tabla de letras y símbolos (va también en el campo `letras`)

| Letra | Un solo significado en la unidad | Aviso |
| --- | --- | --- |
| θ | Un ángulo agudo dado o pedido: el de un triángulo, una elevación o una depresión | Como en «Razones» |
| α, β | Los dos ángulos de un mismo problema hacia dos puntos o desde dos lugares; α es el menor | En la idea 5, α es la elevación del borde bajo y β la del alto |
| φ | El ángulo de observación, φ = β − α | En el laboratorio 3D, «ángulo en el pie» se dice con palabras |
| CO, CA, H | Cateto opuesto, cateto adyacente e hipotenusa, nombrados desde θ | Las siglas de «Razones» |
| h | Una altura sobre el suelo (la cometa, la antena, el globo, el cerro); h₁ y h₂, las de los bordes del letrero | |
| d | Una distancia por el suelo, en horizontal; d₁ y d₂, las de los dos lugares de la idea 4 | En Física, d es la distancia recorrida: aquí lo que avanza la combi también es una distancia por el suelo (d₁ − d₂) |
| a | Un largo dado con letra, en los problemas de examen con letras («la hipotenusa mide a») | Nunca la altura de los ojos: esa se dice en palabras (1,5 m) |
| v, t | Rapidez y tiempo de un móvil, d = v · t | Las de Física («Movimiento rectilíneo») |
| x | El largo que se pide cuando no es un lado con nombre | |

**R, L y m no se usan como letras** (m es el metro).

---

## 6. Mapa de colores (§5b: un color fijo por magnitud en la unidad)

Es el de «Razones»: **el lado lleva el color de su nombre desde el ángulo** de la figura.

| Token | Magnitud | Dónde |
| --- | --- | --- |
| `h` carmín | **Los ángulos** θ, α, β y φ, con su arco junto al vértice | Las cinco ideas, como en toda la rama |
| `o` naranja | **El cateto opuesto** CO; en una visual, **la altura** h (el opuesto a la elevación y a la depresión) | Las cinco ideas |
| `i` turquesa | **El cateto adyacente** CA; en una visual, **la distancia por el suelo** d | Las cinco ideas |
| tinta | **La hipotenusa** H (la pita, el cable, la visual), los objetos, la horizontal del ojo y lo que se pide antes de hallarlo («?») | Todas |
| `f` violeta | No se usa | — |
| `d` verde | No se usa | — |

Reglas que salen de ahí:
- Como las elevaciones y las depresiones se miden desde una horizontal, en las ideas 3 a 5 **lo vertical es siempre
  naranja y lo horizontal turquesa**, sin importar desde qué extremo se mire.
- **La respuesta lleva el color de su magnitud** (molde §5b): una altura en naranja, una distancia en turquesa, un ángulo
  en carmín y una hipotenusa en tinta (en negrita). Lo que se pide va con «?» en tinta hasta comprobar.
- Dos alturas de un mismo problema van las dos en naranja (h₁ y h₂, o la del cerro y la del edificio) y se distinguen por
  su letra y su lugar; lo mismo dos distancias (d₁ y d₂).
- La unidad escribe esta regla en su cabecera, con una prueba que la recorre en todos los textos y las figuras.

---

## 7. Práctica y datos del mundo

### 7a. Qué existe y qué falta

| Idea | Hay | Falta |
| --- | --- | --- |
| 1 Hipotenusa y ángulo | nada propio | tipos «un cateto», «perímetro o suma» y «la altura sobre la hipotenusa con letras» |
| 2 Cateto y ángulo | `puente-simbolico` de `trig-angulos-verticales` (con medios ángulos: no) | tipos «el otro cateto», «la hipotenusa» y «el puente con cot y csc» (San Marcos 2020-I) |
| 3 Elevación y depresión | la mesa `instrumento` y la mesa `faro` | tipos «elevación con ojos», «depresión desde lo alto» y «elevación y depresión a la vez» (San Marcos 2027-I) |
| 4 Dos ángulos | `mismo-lado`, `ambos-lados`, `movimiento` y `entre-edificios` de `trig-angulos-verticales` (en una plantilla que trae también Identidades) | tipos «mismo lado», «lados opuestos» y «en movimiento o desde lo alto» |
| 5 Observación | la mesa `letrero-cerca` | tipos «el ángulo con notables», «el largo con el ángulo» y «desde una ventana» |

**Plantilla nueva `plantillas/trig-resolucion/`**, formato `predicciones`: generador con `TIPOS_POR_IDEA` (tres tipos por
idea, niveles 1 a 3), prueba, `casos.json` verificado con un cálculo aparte y `papel.json` con sus datos al final.
`trig-angulos-verticales` deja de servir a esta unidad y queda solo para `arcos-compuestos` (sale su fila de
`nucleo/repaso-tipos.js`, porque deja de ser un generador mixto). `circunferencia-trig` también deja esta unidad (como
dejó «Razones»), y su problema p3 sale del repaso. Dos ítems nuevos para la prueba del curso, a la **reserva** (las formas
ya tienen 10 pares): la hipotenusa con un cateto y un ángulo, y la altura con dos elevaciones.

### 7b. Datos del mundo

| Dato | ¿Fuente? |
| --- | --- |
| Pitas de cometa de 20 a 60 m; antenas de 6 a 12 m | Valores de problema, creíbles: sin fuente |
| Ojos a unos 1,5 m del suelo | Valor de libro, con «unos» |
| Globos aerostáticos que suben hasta unos 50 m amarrados | Valor de problema: sin fuente |
| Cerros de unos 300 m sobre la carretera; combis a unos 54 km/h | Valores de problema, como en MRU (combis de 54 a 90 km/h) |
| Faros de 20 a 40 m | Valores de problema: sin fuente |
| Historia: al-Biruni y su tratado de las sombras (hacia 1021) | Ya trae fuente (MacTutor) |

---

## 8. Riesgos de orden con otras unidades (`requiere`)

**Lo que esta unidad da por sabido:** todo lo de `trigonometria.razones-trigonometricas-agudas` (su único `requiere`,
que confirmo). Pitágoras y «alternos internos entre paralelas» son de Geometría: van en `datos` y en «Lee».

**Dentro de la unidad:** la idea 2 usa la regla de la 1; la 3, las de la 1 y la 2; la 4, la 3 y la cotangente de la 2; la
5, dos elevaciones de la 3. Ninguna usa algo de una idea posterior.

**Lo que no hay que adelantar:** la tangente de una suma o de una diferencia, el ángulo doble y los triángulos
oblicuángulos.

**Lo que otras unidades toman de aquí:** Física («Vectores») da como dato «F cos α en x y F sen α en y»: es la regla de la
idea 1 con F como hipotenusa. «Movimiento rectilíneo» escribe d = v · t; la idea 4 lo usa igual. «Triángulos
oblicuángulos» pide esta unidad: no se toca.

**Avance de los alumnos:** los tres `id` de siempre y las cuatro mesas se conservan; dos ideas cambian de predicción
(`un-lado-un-angulo` y `elevacion-depresion`) y la unidad suma dos ideas. La unidad entra en `REHECHAS_E6` de
`nucleo/avance.js` (una línea, con su prueba): las predicciones viejas sin huella de esas dos ideas se vuelven a preguntar
una vez, y quien había terminado las tres ideas de antes conserva «Ya la estudié».

---

## 9. Decisiones tomadas (Gerson revisa después)

1. **Cinco ideas**, con dos nuevas: `cateto-y-angulo` (la idea 1 de hoy junta los tres casos en una regla y una
   predicción) y `dos-angulos` (ocho de trece preguntas de San Marcos). Motivo: el caso del cateto es el que se equivoca
   (multiplica donde va la recíproca) y merece su predicción; dos ángulos es lo que más se pregunta. Descartado: una
   idea aparte para «triángulos encadenados»: cabe como nivel examen de las ideas 1, 2 y 4.
2. **Una sola regla para las ideas 1 y 2: buscado = conocido · razón(buscado sobre conocido).** Motivo: es la regla de
   las academias y evita dividir entre una fracción. La idea 1 la estrena con la hipotenusa (sen y cos); la 2, con un
   cateto (tan, cot, sec y csc). Descartado: enseñar a despejar dividiendo (queda en Mira: «dividir entre el seno es
   multiplicar por la cosecante»).
3. **Objetos:** la cometa, la antena con su tensor, el globo aerostático, el cerro con la combi y el letrero, en la pieza
   nueva `trig-vista` (dibujos de prueba). Descartado: la escalera y el poste con cable de «Razones» (repetirían sus
   primeras pantallas) y la torre fija en el juego de la idea 3 (con una torre fija, los ángulos no salen notables).
4. **El ojo, más alto que a escala.** La persona y su altura de ojos se dibujan con un tamaño mínimo en pantalla, y todo lo
   que está sobre los ojos va a escala: así los ángulos son fieles y la persona se reconoce. Descartado: dibujarla a
   escala (medía 6 px con una torre de 40 m).
5. **Colores: los de «Razones»** (ángulo carmín, CO naranja, CA turquesa, H en tinta), y en las visuales la altura en
   naranja y la distancia por el suelo en turquesa. Motivo: es la misma regla de la unidad anterior y en una visual lo
   vertical siempre es el opuesto. Descartado: el mapa de hoy (θ naranja, CO rojo, H verde).
6. **La respuesta va en el color de su magnitud** (molde §5b), no en violeta como en «Razones». Motivo: el molde lo pide y
   «Razones» lo dejó como pregunta para Gerson (su B4); aquí lo que se pide cambia de magnitud de un problema a otro
   (altura, distancia, ángulo, hipotenusa) y el color dice cuál es. Descartado: violeta para toda respuesta.
7. **Letras:** φ para el ángulo de observación y α, β para los dos ángulos de un mismo problema (α el menor), en toda la
   unidad. Motivo: hoy β era a la vez «el ángulo de observación» y «una elevación». Descartado: θ para la observación (θ
   ya es el ángulo dado).
8. **La altura de los ojos se dice en palabras** («los ojos, a 1,5 m del suelo») y no lleva letra. Motivo: la letra a
   queda para un largo dado con letra en los problemas de examen. Descartado: a o h₀ para los ojos.
9. **La idea 5 conserva su predicción** (el máximo de φ), con sus `id` de opción: es buena, el juego no la muestra y nadie
   pierde su respuesta. Su «Mira» muestra el máximo con notables (30° a 2√3 m).
10. **Fuera:** la tangente de una diferencia o de una suma y las condiciones con identidades (tres preguntas de San
    Marcos): son de Identidades. La idea 5 usa solo notables (la diferencia de dos ángulos de la tabla).
11. **Práctica:** plantilla nueva `trig-resolucion` (15 tipos, tres por idea, separados con `TIPOS_POR_IDEA`) y 8
    problemas de papel; `trig-angulos-verticales` y `circunferencia-trig` dejan de servir a esta unidad (sus fichas, una
    línea cada una; la fila de `nucleo/repaso-tipos.js` del generador sale y el p3 de la escena, también; archivos
    compartidos, cambio de un bloque). Descartado: marcarlas con `"rehacer"` (el examen de la unidad toma todos sus
    generadores, y `trig-angulos-verticales` traería la tangente de una diferencia).
12. **Prueba del curso:** dos pares nuevos a la reserva (`tri-14`, la hipotenusa con un cateto; `tri-15`, la altura con dos
    elevaciones). Descartado: reemplazar un par de las formas.
13. **Ficha del catálogo:** `grado: 5` (como el resto de la rama), `trig-resolucion` como única plantilla y un tema nuevo,
    «Dos ángulos de elevación o depresión». `requiere` se queda con `trigonometria.razones-trigonometricas-agudas`.
14. **El glosario conserva sus diez términos** (con `simple` y tres ejemplos los que la unidad estrena) y suma
    «ángulos alternos internos» (Geometría lo define, pero el glosario es por curso). Ver la decisión 19.
15. **Un ángulo que se pide se dibuja con otra abertura** (25° o más lejos de la suya) y el enunciado dice «El dibujo no
    está a escala.» Lo mismo cuando un largo pedido se podría medir con otro de la figura (lección de la auditoría de
    «Longitud de arco»).
16. **Laboratorio:** se conservan las cuatro mesas con sus `id` y los de sus controles (con los colores de la unidad);
    `torre-campo` (3D) va a la idea 4 (dos miradas a una misma torre), `instrumento` y `faro` a la idea 3 y
    `letrero-cerca` a la 5; entra `cometa-libre` (idea 1). La idea 2 aporta su juego: el tope es de cinco mesas (se
    escribió `antena-libre` y salió por eso). Descartado: quitar `faro` (alguien pudo guardarla en su colección).
17. **Los ejercicios no van a escala** (nota de la sesión, 19 nov): en Predice, Mira, ejemplos, «Así se resuelve» y
    «Ahora tú», el triángulo se dibuja con otra abertura del mismo lado de 45° (37°→27°, 30°→20°, 60°→70°, 53°→63°,
    45°→36°, 16°→27°, 74°→63°) y el enunciado dice «El dibujo no está a escala.»; solo el juego, Lee y la regla van a
    escala. Así lo pedido no se mide con una regla y el cateto mayor sigue siendo el mayor. Descartado: un dibujo sin
    medidas (perdía el objeto).
18. **Lo que se pide va en tinta también en la figura** (la línea, no solo el «?»): con color, el turquesa del adyacente
    le diría al alumno «usa el coseno» (el error TR9 que mide la idea 1). Los datos y lo resuelto sí llevan su color.
19. **Glosario de 16 términos:** se suman «cable tensor», «numerador», «ángulos alternos internos» (sin `simple`: dice lo
    que responde la predicción de la idea 3), «lado común», «rapidez» y «borde»; ninguno trae «máximo» (la predicción de
    la idea 5). «perímetro» se usa con la definición de «Áreas y líneas notables» (un término por curso).
20. **«Ahora tú» no repite un ejemplo ni la predicción**: si un caso sale con los mismos números que un ejemplo de su
    idea o que su predicción, se arma otro (la prueba de la unidad lo mira en 400 semillas).
21. **La idea 2 enseña una sola regla con las cuatro recíprocas en la regla** (CA = CO · cot θ, H = CO · csc θ,
    CO = CA · tan θ, H = CA · sec θ) y su «Mira» dice que dividir entre el seno es multiplicar por la cosecante.
22. **La altura sobre la hipotenusa (a sen θ cos θ) y sus dos pedazos (a cos² θ y a sen² θ)** son el nivel examen de la
    idea 1, con letras; en la práctica, con números. Descartado: una idea propia de triángulos encadenados.
