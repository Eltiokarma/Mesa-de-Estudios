# Propuesta de ideas: «Ángulo trigonométrico y sistemas de medida»

`trigonometria.angulo-trigonometrico` · Etapa 5 del plan de calidad, primera unidad de la rama «Ángulos y razones» · fases
1 y 2 (`docs/metodo/unidad/1-ideas.md` §A y §B) · 19 nov 2026

Gerson delegó el criterio en esta etapa: esta propuesta ya se usó como guion de la idea 1, que está escrita. Las dudas
no van como preguntas, sino como **decisiones tomadas** (sección 9), cada una con su motivo y la alternativa que se
descartó, para que las revises después. No hay ningún conflicto crítico.

**Estado (19 nov, fase 3 hecha):** las cinco ideas están escritas enteras («Lee», juego con misión, predicción, «Mira»,
regla, «Así se resuelve», «Ahora tú» de tres tipos, glosario y 15 ejemplos resueltos cada una), el laboratorio tiene una
mesa por idea y la práctica es la plantilla nueva `plantillas/trig-sistemas-angulares/` (15 tipos, tres por idea). Las
cuentas se rehicieron aparte: 2667 de la idea 1 y 138 de los ejemplos, predicciones y misiones de las ideas 2 a 5, más
el recálculo de «Ahora tú» y «Así se resuelve» desde el texto en 400 semillas dentro de la prueba de la unidad. Lo que
cambió respecto de esta propuesta durante la fase 3 está en la sección 9 (decisiones 18 a 24). La unidad no declara
`calidad: 2`: la marca la sesión después del lector en frío y del auditor; con la marca simulada, el validador no da
faltas.

Lo que leí: `CLAUDE.md`, `docs/plan-calidad.md` §3, `docs/molde-unidad.md` entero, `docs/metodo/unidad/LEEME.md`,
`1-ideas.md` y `2-ejemplos.md`, las decisiones de las etapas 2, 3 y 4, `docs/etapa2/propuesta-trigonometria.md` (modelo
del curso) y `docs/etapa4/propuesta-geometria.md` (modelo de profundidad), la unidad con calidad 2 del curso
(`razones-trigonometricas-agudas.js`, su prueba, su auditoría y su lector en frío), la teoría actual
(`contenido/teoria/trigonometria/angulo-trigonometrico.js`, v0.1.0), su ficha en `catalogo/cursos/trigonometria.json`,
su única plantilla (`cinta-radio`: escena, casos y papel), el informe `docs/investigacion/trigonometria-ideas-erroneas.md`,
`docs/temario-completo.md` (unidad 1), la matriz `docs/teoria/matriz/trigonometria.json`, el ítem `tri-01` de
`catalogo/pruebas/trigonometria.json`, las preguntas de San Marcos de `docs/datos/admision-unmsm.csv` con sus trampas
(`docs/clasificacion/trampas-admision-unmsm/geometria-trigonometria.md`) y, para no repetir ni adelantar, las ideas de
`geometria/segmentos-y-angulos.js` (el reloj de la plaza), `longitud-de-arco-y-sector.js`,
`angulos-en-posicion-normal.js` y `reduccion-al-primer-cuadrante.js`.

---

## Lo que pregunta la admisión

**Catálogo:** UNI, semana 0; San Marcos, tema 1. **Banco Cuzcano:** unas 51 fichas, todas de «Conversión entre
sistemas» (`docs/clasificacion/banco-cuzcano.md`): lo que más sale es la relación entre los números S, C y R de un
mismo ángulo y las conversiones con minutos y segundos. El sentido del giro casi no se pregunta solo: aparece como
figura con arcos de flechas contrarias, donde hay que cambiar un signo antes de sumar.

**San Marcos, admisión real 2019-I a 2027-I:** cinco preguntas clasificadas en esta unidad.

| Periodo (examen) | Qué piden | Idea donde cae |
| --- | --- | --- |
| 2022 (13 mar 2022, n.º 41) | El giro del minutero en un tiempo dado, en minutos centesimales. Trampa: tomar minutos sexagesimales por centesimales | 3, nivel examen (usa el signo de la 1) |
| 2023-I (15 oct 2022, n.º 41) | Un ángulo de un triángulo, con los otros dos dados en centesimales y en radianes, con variable | 4, nivel examen |
| 2024-II (17 mar 2024, Medicina, n.º 39) | El ángulo de un sector, en radianes, a partir de una relación entre sus medidas S y C | 5 |
| 2026-I (4 oct 2025, áreas D y E, n.º 43) | La suma, en grados sexagesimales, de ángulos dados en los tres sistemas. Trampa: tratar los centesimales como sexagesimales | 4, nivel examen |
| 2026-II (7 mar 2026, área E, n.º 37) | Un ángulo de un cuadrilátero, con los otros tres en radianes | 4, nivel examen |

Las dos trampas que el archivo de trampas cuenta para esta unidad («trata grados o minutos centesimales como
sexagesimales», 2 preguntas; «mezcla de unidades al final», 2) son los distractores de las ideas 2 y 3.

---

## 0. Qué tiene hoy la unidad y qué se queda o sale

1. **Cuatro ideas** (`sentido-signo`, `tres-sistemas`, `radian`, `minutos-decimales`), «Lee» en todas, y un laboratorio
   de tres mesas con retos comprobados (`dos-giros`, `tres-escalas`, `arco-sale`). La base sirve: el giro que pasa de
   una vuelta dibujado en espiral, la fracción de vuelta como lo que se conserva al convertir, las pitas del radio sobre
   el borde y 2° 15′ = 2,25°.
2. **Punto 1: no hay objeto en ninguna primera pantalla.** Las cuatro abren con el plano `trig-plano` (ejes y
   circunferencia). La puerta, el timón y el reloj solo están escritos en una tarjeta.
3. **Punto 2: no hay misión.** Las consignas describen el control («Elige el giro…»). No hay `leyenda`, `aprendizaje`,
   `actividad` ni `pregunta`; no declara `calidad: 2`; la cabecera dice «3.º de secundaria».
4. **Punto 9, el orden falla dos veces.** La idea 2 convierte a radianes antes de que la idea 3 diga qué es un radián.
   Y la idea 1 dibuja el lado inicial sobre el eje x: eso es la posición normal, que es otra unidad.
5. **Punto 13: ningún ejercicio trae `datos`.** No hay ejemplos resueltos (0 de 60), el glosario trae un ejemplo por
   término y ninguno tiene `simple`.
6. **«Así se resuelve» es el mismo generador que «Ahora tú»** con otra semilla, en las cuatro ideas.
7. **Las lecturas encadenan con «·»** («θ = 120° · antihorario · menos de 1 vuelta»), lo que el molde prohíbe.
8. **Colores contra §5b:** el ángulo y sus tres medidas van en naranja (las tres medidas no se distinguen entre sí), el
   radio en verde pegado al naranja y las vueltas en carmín, que es el color de los ángulos.
9. **Adelanta y repite a sus vecinas.** La idea 3 y la mesa `arco-sale` calculan s = θ · r, que es la idea 1 de
   «Longitud de arco». La idea 1 gasta su predicción y su «Ahora tú» en coterminales, que tienen idea propia en
   «Ángulos en posición normal» (`coterminales-negativos`) y en «Reducción» (`mayores-negativos`).
10. **Falta lo que más pregunta el examen:** la relación S/180 = C/200 = R/π con k (las 51 fichas del banco y San Marcos
    2024-II) y los minutos y segundos centesimales (San Marcos 2022). Las letras son D, G y R; el examen usa S, C y R.

**Se queda:** los cuatro `id` de idea, el `id` del control `g` de la idea 1, las tres mesas con sus `id`, la historia
(babilonios, con fuente) y los términos del glosario, que otras unidades heredan.

**Sale o cambia:** los títulos; el orden (los minutos pasan antes del radián); la predicción de las cuatro ideas; el
plano con ejes de la primera pantalla; D y G (pasan a S y C); el arco s = θ · r (se va a su unidad); los coterminales
como tema (queda una frase y el término en el glosario). Entra una idea nueva, `formula-general`.

---

## 1. Las ideas, en orden

Cinco ideas. Cuatro conservan su `id`; la quinta es nueva. No hace falta partir la unidad ni declarar `septimaIdea`.

| # | `id` | Título (≤ 6 palabras) | `aprendizaje` |
| --- | --- | --- | --- |
| 1 | `sentido-signo` | Ángulo trigonométrico: giro con signo | Un ángulo trigonométrico es un giro: antihorario es positivo; horario, negativo. Puede pasar de una vuelta, y los giros seguidos se suman con su signo. |
| 2 | `tres-sistemas` | Grados sexagesimales y grados centesimales | La misma vuelta se parte en 360° o en 400ᵍ: 9° y 10ᵍ son el mismo giro, y al convertir se conserva la fracción de vuelta. |
| 3 | `minutos-decimales` | Minutos y segundos del grado | Un grado sexagesimal tiene 60′ y cada minuto, 60″; un grado centesimal tiene 100ᵐ y cada minuto, 100ˢ: 2° 15′ es 2,25°, pero 2ᵍ 15ᵐ es 2,15ᵍ. |
| 4 | `radian` | El radián: un radio de arco | Un radián es el ángulo central cuyo arco mide lo mismo que el radio; en la vuelta caben 2π radios, así que π rad = 180° = 200ᵍ. |
| 5 | `formula-general` (nueva) | S, C y R: fórmula general | Si S, C y R miden un mismo ángulo, S/180 = C/200 = R/π; por eso S = 9k, C = 10k y R = πk/20, y una condición da k. |

**Por qué va cada una en su lugar y qué da por sabido**

1. **Giro con signo.** Va primero porque las otras cuatro miden giros, y porque el signo viaja con la medida en todos
   los sistemas (−90° = −100ᵍ = −π/2 rad). Solo usa grados sexagesimales, que el alumno trae de Geometría. Su nivel de
   examen es la figura con arcos de flechas contrarias: para sumar, todos los ángulos van en el mismo sentido, y al
   invertir una flecha cambia el signo. Da por sabido: ángulo, vértice, lados y 1 vuelta = 360°
   (`geometria.segmentos-y-angulos`); sumar con signo va explicado en «Mira» y la regla.
2. **Sexagesimal y centesimal.** Solo dos sistemas: los dos parten la vuelta en partes iguales, así que se comparan sin
   nada nuevo. El radián espera a la idea 4 (punto 9: hoy se usa antes de presentarse). Da por sabido: fracciones y
   proporciones (van como dato: 9° = 10ᵍ).
3. **Minutos y segundos.** Después de la 2, porque parte los dos grados que ya se conocen; antes del radián, porque el
   radián no tiene minutos. Su nivel de examen es San Marcos 2022 (27′ son 50ᵐ) y las sumas con «llevadas» de 60.
4. **El radián.** Aquí se presenta: el ángulo que abarca un arco del largo del radio, cuántos radios caben en la vuelta
   y π rad = 180° = 200ᵍ. Con eso se convierte entre los tres sistemas y se resuelven las figuras de San Marcos
   (triángulo y cuadrilátero con ángulos en sistemas distintos). **No se calcula ninguna longitud de arco**: eso es la
   idea 1 de la unidad siguiente.
5. **S, C y R.** Al final, porque junta los tres sistemas en una sola relación y la usa como ecuación. Es el tipo de
   problema más frecuente del banco y el de San Marcos 2024-II.

**Qué no entra** (y dónde va):
- s = θ · r, el área del sector y las ruedas: `trigonometria.longitud-de-arco-y-sector`.
- Coterminales como tema (hallar el coterminal, θ₁ − θ₂ = 360° · n): `angulos-en-posicion-normal`, idea
  `coterminales-negativos`. Aquí queda una frase en «Mira» de la idea 1 («dos giros distintos pueden terminar en el
  mismo lado») y el término en el glosario, porque el glosario es del curso.
- El lado inicial sobre el eje x y los cuadrantes: `angulos-en-posicion-normal`. Aquí el lado inicial puede estar en
  cualquier parte: en el timón está arriba.
- Clases de ángulos (agudo, recto, obtuso) y el ángulo entre las agujas: ya están en Geometría, con el reloj de la
  plaza. Aquí el reloj solo aparece en ejemplos, como aguja que gira en sentido horario (ángulo negativo).

**Temas de la ficha:** se quedan los cuatro del catálogo y propongo agregar «Minutos y segundos» y «Relación entre S, C
y R» cuando se escriban las ideas 3 y 5 (fase 3).

---

## 2. Objeto de la primera pantalla

| Idea | Objeto | Qué es cada cosa |
| --- | --- | --- |
| 1 | **El timón de una combi**, con una cinta que marca la parte de arriba cuando las llantas van derechas | el rayo va del centro a la cinta; donde estaba la cinta, lado inicial; donde queda, lado final; a la izquierda, antihorario; a la derecha, horario |
| 2 | **Un transportador de vuelta entera con dos escalas**, como el círculo del teodolito de un topógrafo: afuera 360°, adentro 400ᵍ, y una aguja | la aguja marca el mismo giro en las dos escalas |
| 3 | **La lupa sobre el transportador**: un solo grado, partido en sus 60 minutos (y, desde «Mira», debajo, el grado centesimal partido en 100). Reemplaza al GPS (decisión 18) | la aguja corre por los minutos del grado |
| 4 | **La rueda de un triciclo de carga y una pita del largo de un rayo**, que se acuesta sobre la llanta | la pita es el radio; el ángulo que abarca acostada es 1 radián |
| 5 | **Una calculadora científica** con sus tres modos (DEG, GRA y RAD) y el mismo ángulo en los tres | S en DEG, C en GRA, R en RAD |

Ninguna pieza del kit dibuja estos objetos. La idea 1 estrena la pieza **`trig-giro`** (dibujos de prueba,
`data-prueba`, con su prueba numérica de encuadre): el timón, la llave del caño, la tapa rosca, el reloj del aula y
los rayos de una figura de examen. Los objetos de las ideas 2 a 5 se agregan a esa pieza en la fase 3.

---

## 3. Misión de «Juega» (meta que el motor comprueba)

| Idea | Contexto + misión | Controles | `logrado` | Lectura en vivo | `bien` |
| --- | --- | --- | --- | --- | --- |
| 1 | «El chofer gira el timón; la cinta marca cuánto.» **Gira en sentido horario hasta que la cinta apunte a la izquierda.** | `g`, de −540° a 540°, de 30° en 30° (el timón se arrastra por su cinta) | `val.g === -270` | «θ = −270°: 3/4 de vuelta, horario» | «Listo: tres cuartos de vuelta en sentido horario. El signo menos dice el sentido.» |
| 2 | «La aguja marca en las dos escalas a la vez.» **Lleva la aguja hasta que la escala de adentro marque 150ᵍ.** | `g`, de 0° a 360°, de 9° en 9° | `val.g === 135` | «135° y 150ᵍ: 3/8 de vuelta» | «Los dos números nombran la misma abertura.» |
| 3 | «El GPS escribe la latitud con grados y minutos.» **Arma un ángulo que mida exactamente 2,75°.** | `g` (grados, 0 a 3) y `m` (minutos, de 5 en 5) | `val.g === 2 && val.m === 45` | «2° 45′ = 2° + 45/60 de grado» | «45 de 60 minutos son tres cuartos de grado.» |
| 4 | «La pita mide lo mismo que un rayo de la rueda.» **Acuesta pitas sobre la llanta hasta abarcar 2 radianes.** | `n`, de 0,5 a 2,5 pitas, de 0,5 en 0,5; `r`, el tamaño de la rueda | `val.n === 2` | «2 pitas de arco: θ = 2 rad, con cualquier rueda» | «Dos radios de arco. Cambia la rueda: el ángulo no cambia.» |
| 5 | «La calculadora muestra el mismo ángulo en sus tres modos.» **Cambia el ángulo hasta que el modo GRA marque 70.** | `s`, de 18° a 162°, de 9° en 9° | `val.s === 63` | «63/9 = 70/10 = 7» | «S entre 9 y C entre 10 dan el mismo número.» |

En la idea 4 el juego no pasa de 2,5 pitas (unos 143°): la media vuelta y la vuelta entera quedan para la predicción.
En la idea 5 la grilla va de 9° en 9° para que la respuesta de la predicción (27°) esté, pero no su condición a la
vista: la lectura muestra los cocientes, no la suma S + C.

---

## 4. La predicción de cada idea

La app baraja las opciones. Los `datos` solo traen equivalencias y valores, nunca la fórmula. «Parcial» y
«documentado» son el respaldo del informe de trigonometría; lo demás son hipótesis de aula, que se confirman con la
medición.

**Idea 1.** «El chofer gira el timón 150° a la izquierda y, sin soltarlo, 240° a la derecha. ¿Cuánto mide el giro
total, desde la posición inicial?» Datos: «Timón hacia la izquierda: sentido antihorario. Hacia la derecha: sentido
horario.» y «Giro antihorario: positivo. Giro horario: negativo.» El juego solo deja hacer un giro; juntar dos es
nuevo. La figura muestra solo el primer giro.

| Opción | Qué mide |
| --- | --- |
| −90° | Correcta: 150° + (−240°) |
| 390° | Suma los tamaños, sin sentido (TRIG-SIN-SIGNO, hipótesis) |
| 90° | Resta bien y pierde el signo: no dice hacia dónde quedó (TRIG-SIGNO-PIERDE, hipótesis) |
| 270° | «Un ángulo no puede ser negativo»: da el giro antihorario que termina igual (TRIG-NEGATIVO, hipótesis; es el error objetivo de la matriz, «eliminar el signo del giro») |

**Idea 2.** «Un ángulo mide 55ᵍ. ¿Cuánto mide su complemento, en grados sexagesimales?» Datos: «Complemento: lo que le
falta a un ángulo para el ángulo recto.» «Una vuelta: 360° o 400ᵍ.» (Con 40ᵍ, el ángulo y su complemento caían en la
grilla del juego, de 9° en 9°, y se leían en el transportador; 55ᵍ = 49,5° no cae en ella: decisión 19.)

| Opción | Qué mide |
| --- | --- |
| 40,5° | Correcta: 100ᵍ − 55ᵍ = 45ᵍ, y 45ᵍ son 40,5° |
| 35° | Resta 90 − 55: trata los centesimales como sexagesimales (trampa de San Marcos 2026-I; CONV-MISMO) |
| 45° | Resta bien en centesimales y solo cambia el símbolo (CONV-SIMBOLO, hipótesis) |
| 50° | Convierte con el factor al revés, 45 · 10/9 (CONV-INVERSA, hipótesis) |

**Idea 3.** «Un ángulo mide 27′, minutos sexagesimales. ¿Cuántos minutos centesimales mide?» Datos: «1° = 60′»,
«1ᵍ = 100ᵐ», «9° = 10ᵍ».

| Opción | Qué mide |
| --- | --- |
| 50ᵐ | Correcta: 27′ = 0,45° = 0,5ᵍ = 50ᵐ |
| 27ᵐ | Un minuto es un minuto (trampa de San Marcos 2022; MIN-MISMO) |
| 30ᵐ | Usa el factor de los grados, 27 · 10/9 (MIN-FACTOR-GRADO, hipótesis) |
| 45ᵐ | Pasa 27′ a 0,45° y lo lee como 45ᵐ, sin cambiar de sistema (MIN-SIN-SISTEMA, hipótesis) |

**Idea 4.** «Si sigues acostando pitas sobre la llanta, ¿cuántas caben en la vuelta completa?» Datos: «Largo de la
vuelta completa de una rueda: 2 · π · radio» y «π ≈ 3,14». (Es una definición de Geometría, no la regla de la idea.)

| Opción | Qué mide |
| --- | --- |
| 2π ≈ 6,28 | Correcta |
| 6 exactas | Cree que la vuelta se mide en radios enteros (RAD-ENTERO, hipótesis) |
| 1 | «La vuelta es un radián» (TR5; parcial: 6,7 % de 60, Williams) |
| Depende del tamaño de la rueda | El ángulo depende del largo (TR6 y TR2; TR2 documentado: Tuna 2013, Fi 2003) |

**Idea 5.** «Los números S y C de un mismo ángulo suman 57. ¿Cuánto mide el ángulo, en grados sexagesimales?» Datos:
«S: su número de grados sexagesimales. C: su número de grados centesimales.» «9° = 10ᵍ».

| Opción | Qué mide |
| --- | --- |
| 27° | Correcta: 9k + 10k = 57, k = 3 |
| 57° | Toma la suma por el ángulo (SCR-SUMA, hipótesis) |
| 28,5° | Reparte la suma en dos mitades, como si S = C (CONV-MISMO) |
| 30° | Halla k y responde con C (SCR-OTRA, hipótesis; es «mezcla de unidades al final» del archivo de trampas) |

---

## 5. Tabla de letras y símbolos

| Letra | Un solo significado en la unidad | Aviso |
| --- | --- | --- |
| θ | El ángulo trigonométrico: el giro, con su signo | En Razones, θ es el ángulo agudo del triángulo; es otra unidad |
| α, β, γ | Los ángulos de una figura con varios giros (ideas 1 y 4) | Se distinguen por su letra y por uno, dos o tres arcos, como en Triángulos |
| x | La incógnita, un número sin «°»: (3x + 20)°, x = 40 | Decisión de la etapa 3 (Segmentos y ángulos) |
| n | Número de vueltas, entero o fracción | En Longitud de arco es lo mismo |
| S, C, R | Los números de grados sexagesimales, de grados centesimales y de radianes de un mismo ángulo (idea 5) | Son las letras del examen. Hoy la unidad usa D y G: cambian. **R choca con el radio** de muchos libros (L = θ · R): aquí el radio es siempre r minúscula, y se avisa en «Lee» de la idea 5 |
| k | La constante de la fórmula general: S = 9k, C = 10k, R = πk/20 | La escena `cinta-radio` usa S = 180k: es la misma relación con otra k; se cambia al rehacer la escena |
| °, ′, ″ | Grado, minuto y segundo sexagesimales | ′ no es «prima» ni pie |
| ᵍ, ᵐ, ˢ | Grado, minuto y segundo centesimales | ᵐ no es metro ni ˢ segundo de tiempo: van siempre como superíndice pegado al número |
| rad | Radián | Un ángulo sin unidad escrita está en radianes («θ = 2» es 2 rad): se avisa en la regla de la idea 4 |
| π | El número 3,1416…; π rad = 180° | π no es 180: es un número. El error TR1 («π es 180») va de distractor en la idea 4 |
| r | El radio de la rueda (idea 4) | El arco no lleva letra aquí: es «el arco» o «la pita». La letra del arco se estrena en la unidad siguiente |
| O; A, B, P, Q, M, N | El vértice; puntos de los lados en una figura de examen | **Ningún punto se llama C, S ni R**: son medidas |

---

## 6. Mapa de colores (§5b: un color fijo por magnitud en la unidad)

En esta unidad todo es un ángulo; lo que cambia es el sistema en que se escribe. El color distingue el sistema.

| Token | Magnitud | Dónde |
| --- | --- | --- |
| `h` carmín | **El giro y su medida sexagesimal**: el arco con su flecha, θ, α, β, x, S, y todo número con °, ′ o ″ | Las cinco ideas. Es el mismo carmín de los ángulos en todo el curso (37° es carmín en Razones) |
| `i` turquesa | **La medida centesimal**: C y todo número con ᵍ, ᵐ o ˢ; la escala de adentro del transportador | Ideas 2, 3, 4 y 5 |
| `f` violeta | **La medida en radianes**: R, rad y los múltiplos de π | Ideas 4 y 5. Es lo que el examen pide casi siempre al final |
| `o` naranja | **Los largos**, que no son ángulos: el radio r y el arco (la pita) | Solo la idea 4 |
| `d` verde | No se usa | — |
| tinta | El lado inicial, el objeto, el número de vueltas, k, y lo que se pide antes de hallarlo («?») | Todas |

Reglas que salen de ahí:
- **La idea 1 es de un solo color**: carmín para el giro y tinta para lo demás. El sentido lo dicen la flecha del arco y
  el signo, no un color (un color para «positivo» y otro para «negativo» haría del color la única señal).
- Dos giros en un mismo problema van los dos en carmín, con uno y dos arcos y con sus letras (decisión de Física para
  dos móviles y de Triángulos para dos ángulos).
- La respuesta lleva el color de su magnitud: en grados, carmín; en centesimales, turquesa; en radianes, violeta. Lo
  que se pide va con «?» en tinta hasta comprobar.
- Pares que quedan juntos: carmín–turquesa 0,077, turquesa–violeta 0,101 y violeta–carmín 0,167 (distancias de §5b).
  Naranja y carmín (0,062) solo se juntan en la idea 4, donde el naranja es una línea recta (el radio) y el carmín, un
  arco con su letra.
- La unidad escribirá esta regla en su cabecera, con una prueba que la compruebe (ya está para la idea 1).

---

## 7. Práctica y datos del mundo

### 7a. Qué existe y qué falta

Lo que existe hoy para la unidad:
- **La escena `cinta-radio`** (borrador, compartida con Longitud de arco): sus casos 3 a 8 son de esta unidad (π/12 rad
  y 2 rad a grados, 40ᵍ, un radián en grados y minutos, la vuelta en los tres sistemas, 27° 30′ y 27ᵍ 50ᵐ, y C − S = 2).
  Tiene paleta propia y no va por idea.
- **Su papel:** los problemas 1, 2, 4 y 10 son de esta unidad (así los reparte `nucleo/repaso-tipos.js`).
- **Tres mesas de laboratorio** en la teoría: `dos-giros`, `tres-escalas` y `arco-sale`.
- **Generador: ninguno.** La prueba del curso trae un solo par de esta unidad (`tri-01`, radianes sin π a grados).

| Idea | Hay | Falta |
| --- | --- | --- |
| 1 Giro con signo | mesa `dos-giros` (es de coterminales: pasa a «Más mesas del tema») | tipos «signo de un giro», «giros seguidos» y «figura con sentidos contrarios» (x); papel |
| 2 Sexagesimal y centesimal | caso 4 de la escena; papel 1 | tipos «convertir», «complemento y suplemento en centesimales» y «dos ángulos en sistemas distintos»; papel |
| 3 Minutos y segundos | caso 7 de la escena; papel 10 | tipos «grados con decimales», «minutos de un sistema al otro» (San Marcos 2022), «sumar con llevadas de 60»; papel |
| 4 El radián | casos 3, 5 y 6; papel 2; mesa `tres-escalas`; `tri-01` | tipos «radianes con π a grados y al revés», «radianes sin π», «figura con ángulos en tres sistemas» (San Marcos 2023-I, 2026-I y 2026-II); papel |
| 5 S, C y R | caso 8; papel 4 | tipos «una condición con S y C», «una expresión con S, C y R» y «halla R» (San Marcos 2024-II); papel |

Propuesta para la fase 5: una plantilla nueva de formato `predicciones`, `plantillas/trig-sistemas-angulares/`
(generador con sus tipos separados por idea, prueba, `casos.json` verificado aparte y `papel.json` con sus datos al
final). La escena `cinta-radio` pasa a «Más mesas del tema» con `"rehacer": true`, como las demás escenas viejas. La
mesa `arco-sale` (s = θ · r) queda sin idea en esta unidad: es de la siguiente. A la prueba del curso le falta un par
de S y C.

### 7b. Datos del mundo

| Dato | ¿Fuente? |
| --- | --- |
| El timón que da vuelta y media hacia cada lado; giros de 150° y 240° | Valores de problema, creíbles (un auto da unas 3 vueltas de tope a tope): sin fuente |
| Las llaves de caño y las tapas rosca abren en sentido antihorario | Es la rosca de todos los días; va con «casi todas», sin fuente |
| El minutero gira 360° en 60 min (6° por minuto) y el horario, 30° por hora | Son cuentas, no datos |
| La latitud de Juliaca en grados, minutos y segundos (idea 3) | **Necesita fuente** (IGN o INEI). Hoy la tarjeta dice «unos 15° 29′»: mientras no se confirme, va con «unos» y solo grados y minutos |
| El grado centesimal en topografía (idea 2) | Es cierto que los teodolitos lo traen (se llama gon), pero **no se afirma sin fuente**: si no se confirma con una norma o un manual, el objeto es «un transportador de dos escalas», sin topógrafo |
| Los modos DEG, RAD y GRA de la calculadora (idea 5) | Se ve en cualquier calculadora científica del colegio: sin fuente |
| 1 rad ≈ 57,2958° = 57° 17′ 45″; 2π ≈ 6,2832 | Cuentas: se comprueban con un script aparte |
| Historia: la base sesenta de los babilonios | Ya trae fuente (MacTutor, Universidad de St Andrews). El origen del sistema centesimal no se cuenta sin fuente |

---

## 8. Riesgos de orden con otras unidades (`requiere`)

**Lo que esta unidad da por sabido** (todo de `geometria.segmentos-y-angulos`, su único `requiere`, que confirmo):
ángulo, vértice y lados; el grado y 1 vuelta = 360°; complemento y suplemento (idea 2); la suma de los ángulos de un
triángulo va como dato cuando se usa (idea 4), porque `geometria.triangulos` no está en el `requiere`. Fracciones,
proporciones y números con signo no están en ningún `requiere`: van en «Lee», en «Mira» y en `datos`.

**Riesgos dentro de la unidad:** hoy la idea 2 usa el radián antes de la idea 3; con el orden nuevo, el radián solo
aparece desde la idea 4. La idea 3 usa 9° = 10ᵍ (idea 2); la 5 usa las tres medidas (ideas 2 y 4).

**Lo que no hay que adelantar:** s = θ · r, el sector y las ruedas (Longitud de arco); el eje x como lado inicial, los
cuadrantes y los coterminales (Posición normal); quitar vueltas para reducir (Reducción).

**Lo que otras unidades toman de aquí:** Longitud de arco (su único `requiere` es esta unidad) necesita el radián y
π rad = 180°: los tendrá en la idea 4. El glosario del curso toma de aquí «ángulo trigonométrico», «lado inicial»,
«sentido antihorario», «sentido horario», «ángulos coterminales», los tres grados, «radián», «minuto», «vuelta»,
«circunferencia», «radio» y «arco»: ninguno se quita. Razones trigonométricas ya no pide esta unidad (decisión de la
etapa 2), así que el cambio de orden no le afecta.

**Avance de los alumnos:** los cuatro `id` se conservan, así que nada se pierde; solo cambia el orden en el mapa. No
hace falta migración.

---

## 9. Decisiones tomadas (Gerson revisa después)

1. **Cinco ideas, con `formula-general` nueva y el radián en cuarto lugar.** Motivo: el examen pregunta sobre todo la
   relación entre S, C y R, y hoy no se enseña; y el radián se usaba antes de presentarse. Descartado: dejar las cuatro
   ideas y meter S, C y R en el «Ahora tú» de la idea de conversión (su predicción no mediría el error más común).
2. **Los coterminales no se enseñan aquí.** Motivo: tienen idea propia en «Ángulos en posición normal» y en
   «Reducción»; aquí gastaban la predicción de la idea 1. Queda una frase y el término en el glosario. Descartado:
   mantener la predicción «270° y −90°, ¿son el mismo ángulo?».
3. **La idea 1 se centra en lo que el examen sí pide del sentido:** el signo, los giros de más de una vuelta, los
   giros seguidos y la figura con flechas contrarias. Descartado: una idea que solo defina el ángulo trigonométrico.
4. **El lado inicial no va sobre el eje x.** Motivo: la posición normal es otra unidad; aquí el lado inicial está donde
   empieza el giro (arriba, en el timón). Descartado: el plano `trig-plano` con ejes en la primera pantalla.
5. **Colores: el giro y su medida sexagesimal en carmín, la centesimal en turquesa y los radianes en violeta.**
   Motivo: 37° ya es carmín en todo el curso, y así los tres sistemas se distinguen sin juntar naranja con carmín ni
   usar verde. Descartado: sexagesimal en naranja con el arco en carmín (el par más débil de §5b, 0,062, pegado en cada
   figura) y un color para el sentido (sería la única señal).
6. **Letras del examen: S, C y R, con k en la forma S = 9k, C = 10k, R = πk/20.** Motivo: es la forma de las academias
   y deja números chicos. Descartado: D, G y R de la unidad actual, y S = 180k de la escena `cinta-radio` (la misma
   relación con otra k; se unifica al rehacer la escena).
7. **El radio es r y el arco no lleva letra en esta unidad.** Motivo: R es el número de radianes, y la letra del arco
   la estrena la unidad siguiente. Descartado: s (la de hoy) y L (la de las academias).
8. **El reloj no es objeto de ninguna primera pantalla.** Motivo: Geometría ya abrió con el reloj de la plaza. Aquí
   aparece solo en ejemplos, como aguja que gira en sentido horario (San Marcos 2022 pregunta el giro del minutero).
   Descartado: quitarlo del todo.
9. **Objetos de prueba dibujados por la sesión:** timón, llave del caño, tapa rosca y reloj del aula (hechos, en
   `trig-giro`); transportador de dos escalas, GPS, rueda de triciclo con su pita y calculadora (fase 3). Gerson
   decide después cuáles reemplaza.
10. **Sin datos del mundo sin fuente:** la latitud de Juliaca va con «unos» y el topógrafo no se nombra hasta tener
    fuente del gon (sección 7b). Descartado: afirmarlos de memoria.
11. **Alternativas A a E en los ejemplos de nivel 3.** En los que tienen una figura con puntos con letras, el resuelto
    explica cada error por su valor y no por la letra de la alternativa (decisión de la etapa 3).
12. **Mesas del laboratorio:** `dos-giros` y `arco-sale` quedan sin idea («Más mesas del tema») y `tres-escalas` pasa a
    la idea 4, donde ya se conocen los tres sistemas. Descartado: borrarlas (tienen retos comprobados).
13. **Práctica:** plantilla nueva `trig-sistemas-angulares` en la fase 5 y `cinta-radio` a «Más mesas del tema».
    Descartado: estirar la escena vieja.
14. **Ficha del catálogo:** `grado: 5` y dos temas nuevos al cerrar la unidad; no se tocó en esta fase.
15. **Lo que se pide se dibuja en carmín, con «?» en tinta.** Motivo: en esta unidad todo giro es carmín, así que el
    color no delata nada; con el arco en tinta se confundía con el aro del timón. Descartado: arco y «?» en tinta.
16. **«lado final» no se define aquí.** Ya lo define «Ángulos en posición normal» y el glosario admite una definición
    por curso; esta unidad lo usa y el lector lo marca solo. Al rehacer esa unidad conviene mudarlo aquí, donde se
    estrena. Descartado: tocar ahora la otra unidad.
17. **Los grados van sin espacio de miles** («−1080°», no «−1 080°»), como en el examen, solo en la idea 1 por ahora.
18. **Idea 3: la lupa sobre el transportador en vez del GPS.** Motivo: la latitud de Juliaca necesitaba fuente (7b) y la
    lupa muestra lo que la idea afirma (60 partes en un grado, 100 en el otro, a escala). Descartado: el GPS con «unos».
19. **Predicción de la idea 2 con 55ᵍ**, no con 40ᵍ: con 40ᵍ el juego mostraba el ángulo y su complemento en la grilla.
    Descartado: cambiar la grilla del juego.
20. **Laboratorio: una mesa por idea, con los mismos `id`.** `dos-giros` pasa a dos giros seguidos del timón (idea 1),
    `tres-escalas` usa el transportador (idea 4) y `arco-sale` cuenta radios sobre la llanta sin calcular ningún arco
    (idea 4). Descartado (decisión 12): dejar dos mesas en «Más mesas del tema». Los controles conservan su `id`; los
    rangos cambian (la colección guardada se ajusta sola al rango nuevo).
21. **Práctica: `trig-sistemas-angulares`, 15 tipos (tres por idea, niveles 1, 2 y 3) y 8 problemas de papel.** Ningún
    tipo repite una predicción de la teoría (27′ = 50ᵐ, S + C = 57, 150° y 240° del timón). Sin figuras. `cinta-radio`
    queda con `"rehacer": ["trigonometria.angulo-trigonometrico"]`: va a «Más mesas del tema» solo en esta unidad (en
    «Longitud de arco» sigue igual).
22. **Prueba del curso:** el par `tri-11` (2C − S = dato, el ángulo en sexagesimales) va a la **reserva**: las formas ya
    tienen 10 pares. Descartado: sacar `tri-01`.
23. **Catálogo:** `grado: 5`, temas nuevos «Minutos y segundos» (idea 3) y «Relación entre S, C y R» (idea 5), y la
    plantilla nueva primero. `requiere` se queda con `geometria.segmentos-y-angulos`.
24. **El glosario define «radián»** de modo que sirva a otras unidades (Física, «Movimiento circular»): «ángulo central
    cuyo arco mide lo mismo que el radio; su medida cuenta cuántos radios caben en el arco», sin decir cuántos caben en la vuelta (es la
    predicción de la idea 4).
