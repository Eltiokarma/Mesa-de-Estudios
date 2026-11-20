# Propuesta de ideas: «Proporcionalidad y semejanza»

`geometria.proporcionalidad-y-semejanza` · Etapa 8 del plan de calidad, sexta unidad de la rama «Geometría plana» (sigue a
«Segmentos y ángulos», «Triángulos y líneas notables», «Congruencia de triángulos», «Polígonos y cuadriláteros» y
«Circunferencia y ángulos en ella», las cinco con `calidad: 2`; la siguen «Puntos notables», «Relaciones métricas» y
«Polígonos regulares») · fases 1 a 5 con criterio delegado (`docs/metodo/unidad/etapa-delegada.md`) · 19 nov 2026

Gerson delegó el criterio: esta propuesta es el guion con el que se escribió la unidad, y la sección 9 no trae preguntas
sino **las decisiones que tomé**, cada una con su motivo y la alternativa descartada, para que las revises después.
No hay ningún CONFLICTO CRÍTICO (el roce con Triángulos sobre el incentro se resuelve en la decisión 3, con un cambio mínimo en
Triángulos y en Puntos notables).

Lo que leí: `CLAUDE.md`, `docs/plan-calidad.md` §3, `docs/molde-unidad.md`, `docs/metodo/unidad/` (LEEME, 1-ideas,
2-ejemplos, 3-practica, reglas-validador y etapa-delegada), las decisiones de las etapas 2 a 7, la propuesta de
Circunferencia (`docs/etapa7/propuesta-geometria.md`) como modelo, su auditoría (qué se corrigió: frases de «Tiene sentido»
falsas, «·» entre dos relaciones, figuras a escala que dejaban medir, objetos que no calzan con el texto), la teoría actual
(`contenido/teoria/geometria/proporcionalidad-y-semejanza.js`, v0.2.0), su ficha en `catalogo/cursos/geometria.json`, sus
dos plantillas (`ampliadora`, escena compartida con cinco unidades; `geo-proporcionalidad`, generador compartido con
Geometría del espacio), el informe `docs/investigacion/geometria-ideas-erroneas.md` (GE1, GE2, GE3, GE8, GE22),
`docs/temario-completo.md` (unidad 6), el par geo-01 de `catalogo/pruebas/geometria.json`, las 14 preguntas de San Marcos de
`docs/datos/admision-unmsm.csv` clasificadas en la unidad, y para no repetir ni adelantar, Triángulos, Congruencia, Polígonos
y Circunferencia (ya calidad 2), Puntos notables, Relaciones métricas y Áreas poligonales.

---

## Lo que pregunta la admisión

**Catálogo:** UNI, semanas 5 y 6; San Marcos, tema 8. **Banco Cuzcano:** unas 19 fichas: semejanza de triángulos (7),
semejanza en circunferencias (6), criterios (3), bisectriz e incentro (3).

**San Marcos, admisión real 2019-I a 2027-I:** 14 preguntas clasificadas en la unidad.

| Qué piden | Periodo | Idea donde cae |
| --- | --- | --- |
| Distancia entre pueblos con rectas paralelas cortadas por dos secantes (Thales y su corolario) | 2023-I (36) | 1, nivel examen |
| Un segmento en una cometa con dos pares de paralelas | 2021 (38) | 1, nivel examen |
| Perímetro de un terreno triangular partido por una bisectriz | 2026-II (33) | 2 |
| Razón de lados con una paralela, semejanza y la bisectriz | 2019-II (41) | 2, nivel examen |
| Razón de segmentos en un cuadrado cortado por una diagonal (bisectriz y semejanza) | 2024-II (35) | 2, nivel examen |
| Perímetro de un paralelogramo con el incentro de un isósceles | 2020-I (41) | **Puntos notables** (usa el incentro; decisión 3) |
| Corte de un tablero triangular que deja un triángulo semejante; perímetros | 2022 (35) | 3, nivel examen |
| La estaca entre dos postes para el menor cable (reflexión y semejanza) | 2020-I (40), 2023-I (35) | 3, nivel examen (con el espejo: el rayo sale con el mismo ángulo) |
| Lado de un cuadrado con un vértice en la diagonal de un rectángulo | 2024-II (36) | 4, nivel examen |
| Área de una parte de un terreno cortado por un lindero paralelo | 2023-II (33) | 5 |
| Área de un hexágono en un triángulo, por semejanza con la esquina | 2025-I (36) | 5, nivel examen |
| Área de un triángulo partido por paralelas por un punto interior (raíces de áreas) | 2026-I (37) | 5, nivel examen |
| Semejanza con cuerdas iguales y ángulos inscritos | 2026-I (35) | **Relaciones métricas** (es la semejanza de cuerdas; la nota del encargo: no adelantar las relaciones métricas de la circunferencia) |

San Marcos pregunta sobre todo **semejanza** (siete de las doce que quedan aquí, tres de ellas con áreas) y la
**bisectriz** (tres). Thales sale dos veces, casi siempre como paso. Ceva y Menelao no salen en San Marcos: son de la UNI
(catálogo) y del temario de academia; van al final de la unidad.

---

## 0. Qué tiene hoy la unidad y qué se queda o sale

1. **Cinco ideas** (`thales`, `bisectriz`, `ceva-menelao`, `semejanza`, `area-y-escala`) con «Lee», «Así se resuelve» y tres
   mesas, pero sin `aprendizaje`, `actividad`, `pregunta`, misión ni leyenda; sin ejemplos resueltos (0 de 75); sin `datos`
   en ningún ejercicio.
2. **Punto 1:** ninguna idea abre con un objeto: todas con `geo-figura` pelada (un triángulo, un rectángulo); los objetos
   solo están escritos («los rieles del tren que llega a Juliaca»).
3. **Colores contra §5b y contra el curso:** referencias en **verde** (protanopía con el naranja), el pedido en **carmín**
   (un largo), la recta inclinada de Thales en carmín; nada coincide con Triángulos, Congruencia ni Circunferencia.
4. **Títulos que dicen la respuesta** («Una paralela corta en proporción», «La bisectriz copia la razón», «Tres razones cuyo
   producto es 1»); lecturas con «·» entre dos igualdades; `f(n)` con dos decimales («AD/DB = 0,67») escritos con «=».
5. **Lo que llega después:** la idea 2 enseña el teorema del **incentro** (AI/ID = (b + c)/a) y una mesa usa el incentro; el
   generador trae `incentro` (Puntos notables) y `cuerdas` (PA · PB = PC · PD, Relaciones métricas). El encargo pide no
   adelantar ni el incentro ni el baricentro ni las relaciones métricas de la circunferencia.
6. **Glosario que delata:** «teorema de Ceva: … si el producto de las tres razones vale 1» (la respuesta de la predicción de
   Menelao), «factor del área: con escala k es k²» (la regla de su idea), «antiparalela: AE = 3, AB = 9 y AC = 6: AD = 2» (la
   predicción entera). Ningún término tiene `simple` ni 3 ejemplos.
7. **Falta lo que el examen cobra:** el corolario de Thales con la parte y el todo (2023-I), la semejanza por sombras y
   espejos (2020-I, 2023-I), los lados homólogos en triángulos encajados y cruzados (2024-II, 2022), la razón de áreas en un
   lindero (2023-II) y las raíces de áreas (2026-I).
8. **La ficha pide solo `geometria.congruencia`**, pero la prueba de Thales usa las paralelas que cortan tramos iguales (base
   media del trapecio, Polígonos) y los ejercicios usan el paralelogramo, el cuadrado y el rectángulo.
9. **Práctica:** `geo-proporcionalidad` mezcla esta unidad con lo que llega después (incentro, cuerdas, el mástil de Geometría
   del espacio) y no trae `datos`; la escena `ampliadora` no trae `datos` y su papel no dice de qué unidad es cada problema.

**Se queda:** los `id` de las cinco ideas y de las tres mesas (`corte-libre`, `bisectriz-libre`, `estirar`), la historia de los
Elementos VI.2 (con su fuente), la predicción de Menelao (misma pregunta, mismos ids de opciones) y los términos del
glosario que la unidad sigue estrenando, que ganan `simple` y ejemplos sin delatar.
**Sale o cambia:** el teorema del incentro (a Puntos notables), el orden (Ceva y Menelao pasan al final), los títulos, los
colores, las lecturas, cuatro predicciones, el glosario; entra una idea nueva, `encajados`.

---

## 1. Las ideas, en orden

Propongo **seis**, el tope, con los cinco `id` de hoy y uno nuevo. La unidad no se parte y no hace falta `septimaIdea`.

| # | `id` | Título | `aprendizaje` |
| --- | --- | --- | --- |
| 1 | `thales` | Paralelas que cortan dos rectas | Tres o más paralelas cortan a dos secantes en tramos proporcionales; en un triángulo, una paralela a un lado corta los otros dos en la misma razón, y al revés. |
| 2 | `bisectriz` | Teorema de la bisectriz | La bisectriz de un ángulo del triángulo parte el lado opuesto en dos tramos que están en la misma razón que los lados vecinos. |
| 3 | `semejanza` | Triángulos semejantes | Dos ángulos iguales bastan para que dos triángulos sean semejantes (también LAL y LLL proporcionales), y entonces todos sus lados se multiplican por el mismo k. |
| 4 | `encajados` | Triángulos encajados y cruzados | Si dos triángulos tienen un ángulo común y otro igual, son semejantes aunque no haya paralelas; cada lado va con el que está frente a su ángulo igual, no con el que queda en el mismo lugar del dibujo. |
| 5 | `area-y-escala` | Áreas de figuras semejantes | Si los lados se multiplican por k, el perímetro se multiplica por k y el área por k². |
| 6 | `ceva-menelao` | Teoremas de Ceva y Menelao | Tres cevianas pasan por un punto, o tres puntos están en una recta, cuando el producto de tres razones, dando la vuelta, vale 1. |

Preguntas del Resumen (`pregunta`): 1 «¿Cómo se reparten las cuadras entre calles paralelas?»; 2 «¿Dónde llega un canal que
parte una esquina en dos?»; 3 «¿Cómo se mide un poste con su sombra?»; 4 «¿Qué lado va con cuál en dos triángulos
semejantes?»; 5 «¿Cuánto crece el área de una foto ampliada?»; 6 «¿Qué tienen en común tres caminos que se cruzan en un
pozo?». Ninguna descarta una alternativa de su predicción.

**Por qué va cada una en su lugar y qué da por sabido**

1. **Thales.** La raíz: estrena proporción, tramos proporcionales y recíproco. Se prueba partiendo un tramo en partes
   iguales y trazando paralelas por cada marca: paralelas que cortan tramos iguales en una secante los cortan iguales en la
   otra (base media y trapecio, Polígonos; congruencia ALA). Nivel examen: la parte y el todo (2023-I), la x en los tramos,
   el recíproco, el trapecio con una paralela a las bases, la cometa con dos pares de paralelas (2021).
2. **Bisectriz.** Usa Thales: por C se traza la paralela a la bisectriz y queda un isósceles (Triángulos). Estrena el pie de
   la bisectriz; usa «bisectriz interior» y «exterior» de Triángulos. Nivel examen: el perímetro desde los tramos (2026-II),
   la exterior que corta la prolongación, la bisectriz con una paralela (2019-II) y la del cuadrado (2024-II).
3. **Semejanza.** Usa Thales (un triángulo dentro de otro con un lado paralelo) y los criterios de congruencia como modelo.
   AA en el juego (sombras), LAL y LLL en la regla. Nivel examen: la persona dentro de la sombra del poste, el espejo en el
   suelo (2020-I, 2023-I, sin la palabra «reflexión»: el dato es que el rayo sale con el mismo ángulo), el tablero cortado
   (2022), el segmento paralelo a la base.
4. **Triángulos encajados y cruzados** (al escribir se llamaba «Lados homólogos»; el título nuevo dice la situación y no
   repite Congruencia, que ya enseñó a emparejar lados en triángulos iguales). Va después de la 3 porque ya hay semejanza:
   ahora se aprende a emparejar cuando los triángulos no
   están en la misma posición (encajados con un ángulo común, la antiparalela, cruzados en X). Es el error GE22. Nivel
   examen: la antiparalela, el puntal de la rampa, el cuadrado dentro de un triángulo (2024-II), los dos postes con cables
   cruzados.
5. **Áreas.** Al final de la semejanza: el área del triángulo y del rectángulo (base por altura) van como dato. Nivel
   examen: el lindero paralelo (2023-II), el trapecio que queda, el triángulo de la esquina (2025-I) y las raíces de áreas con
   paralelas por un punto interior (2026-I).
6. **Ceva y Menelao.** Lo más avanzado y lo que San Marcos no pregunta: la prueba de Menelao usa Thales dos veces. Nivel
   examen: un tramo con Ceva, un tramo en la prolongación con Menelao, la x en las razones.

**Temas de la ficha** (decisión 4): «Teorema de Thales» (idea 1), «Teorema de la bisectriz interior y exterior» (idea 2, antes
«Teoremas de la bisectriz y del incentro»), «Criterios de semejanza de triángulos» (ideas 3 y 4), «Razón de áreas de figuras
semejantes» (idea 5, nuevo) y «Menelao y Ceva» (idea 6).

**Qué no entra (y dónde va):**
- El teorema del incentro (AI/ID = (AB + AC)/BC), el baricentro (2 : 1) y todo punto notable: Puntos notables.
- La semejanza de cuerdas y secantes (PA · PB = PC · PD), la altura sobre la hipotenusa (h² = m · n), Euclides y Stewart:
  Relaciones métricas. Pitágoras solo como dato, con ternos enteros.
- La razón de volúmenes (k³) y los sólidos semejantes: Prisma y pirámide, Sólidos de revolución.
- Las áreas de figuras que no son semejantes (relación de áreas por bases o alturas): Áreas poligonales.
- La simetría (reflejar un punto en una recta): Simetría. Aquí el espejo solo dice que el rayo sale con el mismo ángulo.

---

## 2. Objeto de la primera pantalla

| Idea | Objeto | Qué es cada cosa |
| --- | --- | --- |
| 1 | **El plano de un barrio: tres jirones paralelos cortados por dos avenidas** (vista desde arriba) | los jirones = las paralelas; las avenidas = las secantes; una cuadra = un tramo |
| 2 | **Un terreno triangular con estacas en las esquinas y un canal de riego que parte la esquina A en dos ángulos iguales** | el canal = la bisectriz; donde llega a la cerca BC = su pie D |
| 3 | **Un poste de luz y una alumna parados al sol, con sus sombras** | el poste, la alumna y sus sombras = los catetos; los rayos de sol = la hipotenusa, paralelas entre sí |
| 4 | **Una rampa apoyada en una pared, con un puntal perpendicular a la rampa** | rampa, piso y pared = un triángulo rectángulo; el puntal y el piso = otro, encajado, con el ángulo del pie A común |
| 5 | **Una foto y su ampliación, con la foto chica repetida adentro de la grande** | los lados de la foto = los lados de la figura; cuántas fotos chicas caben = cuántas veces crece el área |
| 6 | **El mismo terreno triangular, con tres caminos rectos desde las esquinas que se cruzan en un pozo** | los caminos = las cevianas; el pozo = el punto donde concurren |

Van en un bloque nuevo de `geo-objeto`, la escena `semejante` (tipos `calles`, `sol`, `rampa`, `foto` y `examen`), sobre una
figura de `geo-figura`; las ideas 2 y 6 usan la escena `parcela` de Polígonos (tipo `terreno`), sin tocarla. Todos son dibujos
de prueba (`data-prueba`) con su prueba numérica de encuadre y de rótulos. El bloque es aditivo: no toca las escenas de las
otras unidades.

---

## 3. Misión de «Juega» (meta que el motor comprueba)

| Idea | Contexto + misión | Controles | `logrado` | Lectura (una relación) |
| --- | --- | --- | --- | --- |
| 1 | «Tres jirones paralelos cortan dos avenidas. En la avenida 1 hay 100 m del primer jirón al tercero; en la 2, 150 m.» **Corre el jirón del medio hasta que la cuadra DE mida 75 m.** | `ab`, la cuadra AB (30 a 70 m, de 10 en 10; empieza en 40) | `ab === 50` | «AB : BC = 40 : 60 = 2 : 3 y DE : EF = 60 : 90 = 2 : 3» |
| 2 | «El canal parte la esquina A en dos ángulos iguales y llega a la cerca BC en D. AB mide 60 m.» **Cambia la cerca AC hasta que D quede en el medio de BC.** | `ac` (20 a 100 m, de 10 en 10; empieza en 30) | `ac === 60` | «BD ≈ 52,5 m y DC ≈ 35 m: D queda más cerca de C» |
| 3 | «Un poste de 4,5 m y una alumna de 1,5 m, al sol de la misma tarde.» **Mueve el sol hasta que la sombra del poste mida 6 m.** | `s`, la sombra de la alumna (0,5 a 2,5 m, de 0,25 en 0,25) | `s === 2` | la sombra del poste es 3 veces la de la alumna, como el poste lo es de la alumna |
| 4 | «La rampa mide 5 m y su pie A está a 4 m de la pared. Un puntal sale perpendicular a la rampa y baja al piso.» **Corre el puntal hasta que su pie D quede a 3 m de A.** | `ae`, de A al puntal sobre la rampa (1,2 a 2,8 m, de 0,4 en 0,4; empieza en 1,6) | `ae === 2.4` | «AE : AC = 1,6 : 4 y AD : AB = 2 : 5: las dos, 0,4» |
| 5 | «Una foto de 15 cm por 10 cm se amplía con todos sus lados multiplicados por k.» **Amplía la foto hasta que tenga 9 veces el área de la chica.** | `k` (1 a 4, de 1 en 1; empieza en 2) | `k === 3` | «Lados × 2: caben 4 fotos chicas, el área va × 4» |
| 6 | «Tres caminos rectos salen de las esquinas y se cruzan en el pozo P.» **Mueve D y E hasta que el camino de C llegue al medio de AB.** | `d` = BD : DC y `e` = CE : EA (1 : 3, 1 : 2, 1 : 1, 2 : 1, 3 : 1; empiezan en 2 : 1 y 2 : 1) | AF = FB | «BD/DC · CE/EA · AF/FB = 2 · 2 · 1/4 = 1» |

Ninguna misión está cumplida al abrir; ninguna leyenda trae el número que solo sale con la misión cumplida. La de la idea 6 se
cumple de cinco maneras a propósito (BD : DC y CE : EA inversas).

---

## 4. La predicción de cada idea

La app baraja las opciones; los `datos` traen valores, nunca la fórmula. Los errores con respaldo son GE1, GE8 y GE22 del
informe; los demás son hipótesis (GE-THA, GE-PIE, GE-SEM, GE-HOM, GE-ARE, GE-CEV), anotados en el informe.

**Idea 1.** «En otro barrio, la avenida 1 tiene AB = 30 m y BC = 50 m. En la avenida 2, del primer jirón al tercero hay
DF = 120 m. ¿Cuánto mide DE?» (El dibujo no está a escala.) Datos: AB = 30 m, BC = 50 m, DF = 120 m.

| Opción | Qué mide |
| --- | --- |
| 45 m | Correcta: las cuadras de la avenida 2 se reparten 3 : 5, como las de la 1; 120 en ocho partes de 15 |
| 72 m | Empareja la parte con el todo: 30/50 = DE/120 (GE22) |
| 60 m | Reparte DF por la mitad (GE-THA4) |
| 75 m | Da EF, la otra cuadra (GE-THA5) |

**Idea 2.** «Otro terreno tiene AB = 6 m, AC = 9 m y BC = 10 m. El canal parte la esquina A en dos ángulos iguales. ¿En qué
tramos parte la cerca BC?» (El dibujo no está a escala.)

| Opción | Qué mide |
| --- | --- |
| BD = 4 m y DC = 6 m | Correcta: BD : DC = 6 : 9 |
| 5 m y 5 m | Cree que la bisectriz llega al punto medio (GE8) |
| BD = 6 m y DC = 4 m | Pone el tramo largo junto al lado corto (GE-PIE1) |
| BD = 3 m y DC = 7 m | Resta los lados: 9 − 6 = 3 (GE-PIE2) |

**Idea 3.** «Un alumno de 1,6 m se para a 3 m de un poste, donde la punta de su sombra, de 2 m, cae en la de la sombra del
poste. ¿Cuánto mide el poste?» (El dibujo no está a escala.) Al escribir cambiaron los números (los de la propuesta daban un
k = 3 que la misión ya enseñaba).

| Opción | Qué mide |
| --- | --- |
| 4 m | Correcta: la sombra del poste mide 3 + 2 = 5 m, 2,5 veces la del alumno; 1,6 · 2,5 = 4 |
| 2,4 m | Usa los 3 m como sombra del poste (GE22) |
| 4,6 m | Suma la altura del alumno y la distancia (GE-SEM1) |
| 5 m | Iguala el poste a su sombra (GE-SEM2) |

**Idea 4.** «En el triángulo ABC, AB = 9 cm y AC = 6 cm. D está en AB y E en AC, con AE = 3 cm y el ángulo ADE igual al
ángulo ACB. ¿Cuánto mide AD?» (El dibujo no está a escala.)

| Opción | Qué mide |
| --- | --- |
| 2 cm | Correcta: ADE ∼ ACB, con AD frente al ángulo de E, que es el de B: AD/AC = AE/AB |
| 4,5 cm | Empareja por la posición, como si DE fuera paralela a BC (GE22) |
| 3 cm | Cree que AD = AE (GE-HOM1) |
| 6 cm | Resta 9 − 3 (GE-HOM2) |

**Idea 5.** «Un terreno triangular se parte con un cerco paralelo a un lado, que une los puntos medios de los otros dos.
¿Qué parte del terreno queda en el triángulo de arriba?»

| Opción | Qué mide |
| --- | --- |
| La cuarta parte | Correcta: k = 1/2 y el área va por k² = 1/4 |
| La mitad | Lleva la razón de los lados al área (GE1) |
| La tercera parte | Reparte entre el triángulo y el trapecio por igual de a tres (GE-ARE1) |
| La octava parte | Usa k³, la razón de volúmenes (GE2) |

**Idea 6** (la misma de hoy). «Ahora no hay cevianas: una recta corta AB en F, BC en D y la prolongación de CA en E. ¿Cuánto
vale AF/FB · BD/DC · CE/EA, con largos?»

| Opción | Qué mide |
| --- | --- |
| 1, también | Correcta (Menelao) |
| Menos de 1, porque E está fuera | Cree que el punto de afuera achica el producto (GE-CEV1) |
| No se puede usar: E no está en el lado | Cree que solo vale con puntos en los lados (GE-CEV1) |
| −1 | Razones con signo, que aquí no se usan (GE-CEV2) |

---

## 5. Tabla de letras y símbolos

| Letra | Un solo significado en la unidad | Aviso |
| --- | --- | --- |
| A, B, C, D, E, F, … | Puntos de la figura | Chocan con las alternativas A–E: ningún resuelto nombra una alternativa por su letra |
| k | La razón de semejanza: lo que se multiplica cada lado | No es la escala de un mapa (1 : 200); si aparece, se dice |
| x | Lo que se pide, un número | Sin «°» ni unidad pegada: AB = x + 2 (en cm) |
| S | Un área; S₁ y S₂, las de dos figuras; S, la del triángulo entero en las raíces de áreas | Solo en la idea 5 |
| h | Una altura (de un triángulo o un poste) | — |
| ∼ | «es semejante a», con los vértices en orden: ADE ∼ ACB | Se dice en palabras en «Lee» de la idea 3 |
| ∥, ⟂, △, m∠ | Paralela, perpendicular, triángulo, medida de un ángulo | Ya definidos en la rama |
| AB : BC = 2 : 3 | Una razón entre tramos («2 a 3») | Se dice en «Lee» de la idea 1 |

La tabla va en el campo `letras` de la unidad (`k`, `x`, `S`, `h`).

---

## 6. Mapa de colores (§5b y las reglas del curso)

Las reglas del curso: ángulos dados en carmín (1, 2 o 3 arcos cuando hay parejas); lados dados naranja y turquesa; lo pedido
con «?» en tinta; el violeta solo en el texto del resuelto y en la respuesta; sin verde; marcas de igualdad sobre una llave.
En esta unidad, **un color por papel en la razón**: lo que va arriba en la fracción en naranja, lo que va abajo en turquesa.

| Idea | Carmín | Naranja | Turquesa | Tinta | Violeta |
| --- | --- | --- | --- | --- | --- |
| 1 | — | el primer tramo de cada secante (AB, DE; AM en el triángulo) | el segundo (BC, EF; MB) | las paralelas, los totales (AC, DF) | la respuesta |
| 2 | las dos mitades del ángulo A (con su rayita) | AB y su tramo BD | AC y su tramo DC | la bisectriz AD (punteada), BC entera | la respuesta |
| 3 | el ángulo de los rayos con el suelo (y el recto en su cuadradito) | las alturas (poste, alumna) | las sombras | los rayos de sol, k | la respuesta |
| 4 | los ángulos iguales (1 arco el que se da, 2 el común) | la pareja AE y AC | la pareja AD y AB | DE y CB, el puntal | la respuesta |
| 5 | — | el lado y el área de la figura chica | el lado y el área de la grande | k, el cerco | la respuesta |
| 6 | — | los tramos que salen de un vértice (AF, BD, CE) | los que llegan a un vértice (FB, DC, EA) | las cevianas, la recta | la respuesta |

La prueba de la unidad comprueba la regla en todas las figuras (sin violeta ni verde en ninguna; «?» en tinta).

---

## 7. Práctica y datos del mundo

### 7a. Qué existe y qué falta

- **La escena `ampliadora`** (borrador 0.1.0, semejanza, área y volumen): sin `datos`; también sirve a cinco unidades más.
  Va a «Más mesas del tema» solo en esta unidad (`"rehacer": ["geometria.proporcionalidad-y-semejanza"]`) y su papel dice de
  qué unidad es cada problema (`unidades`).
- **`geo-proporcionalidad`** (generador compartido con Geometría del espacio): sin `datos`, con incentro y cuerdas. Va a «Más
  mesas del tema» de esta unidad (`"rehacer"`, como una escena vieja) y su papel dice de qué unidad es cada problema. Sigue en
  la ficha (la prueba del catálogo pide que una ficha liste toda plantilla que la cubre) y su fila del repaso no se toca.
- **Plantilla nueva `geo-semejanza`** (formato `predicciones`, sin figura, como `geo-circunferencia`): tipos por idea
  (`TIPOS_POR_IDEA`), `datos` por línea con prueba en 400 semillas, `casos.json` verificado aparte y papel de 8 problemas (las
  seis ideas).
- **Mesas:** las tres de antes conservan su `id` y pasan a los colores del curso: `corte-libre` (idea 1, D y E libres: el
  corte inclinado), `bisectriz-libre` (idea 2, el ángulo A libre) y `estirar` (idea 5, el rectángulo con dos escalas).
- **Prueba del curso:** las formas ya tienen 10 pares (geo-01 es de esta unidad); dos ítems nuevos a la reserva: ps-01 (la
  parte y el todo en Thales) y ps-02 (la bisectriz), con su verificador.

### 7b. Datos del mundo

La unidad casi no los necesita: cuadras, terrenos, postes, rampas y fotos con medidas de problema, posibles (punto 10): cuadras
de 30 a 150 m, postes de 4 a 9 m, una persona de 1,5 a 1,7 m, rampas de 3 a 6 m, fotos de 10 por 15 cm. El área del triángulo
(base por altura entre 2) y del rectángulo van como dato. La historia de los Elementos VI.2 ya trae fuente (edición de
D. E. Joyce).

---

## 8. Riesgos de orden con otras unidades (`requiere`)

**Lo que la unidad da por sabido:** de Segmentos, las paralelas cortadas por una secante (ángulos correspondientes y alternos)
y despejar x; de Triángulos, la suma de 180°, el isósceles, la bisectriz interior y exterior; de Congruencia, los criterios
LAL, ALA y LLL, la base media, la razón; de Polígonos, el trapecio y su mediana, el paralelogramo, el cuadrado y el rectángulo.
**Cambio en la ficha:** `requiere` pasa de `geometria.congruencia` a `geometria.poligonos-y-cuadrilateros` (que ya pide
Congruencia y Triángulos). No pide Circunferencia: ningún ejercicio usa ángulos inscritos.

**Lo que hay que rehacer para no usar lo que viene después:**

| Hoy | Problema | Cómo queda |
| --- | --- | --- |
| Teorema del incentro en la idea 2 y en el generador | Puntos notables | Fuera; «incentro» pasa al glosario de Puntos notables y Triángulos remite allá (decisión 3) |
| Tipo `cuerdas` del generador viejo | Relaciones métricas | El generador viejo va a «Más mesas del tema»; el nuevo no lo trae |
| Glosario con las medidas («es k²», «vale 1») | Delata las predicciones de las ideas 5 y 6 | Definiciones de qué es cada cosa, sin su medida |
| «volumen» en el glosario | La unidad no enseña volumen | Se queda en el glosario (otras unidades lo usan y aquí se define en el curso), con `simple` y ejemplos; ninguna idea lo usa |

**Lo que otras unidades toman de aquí:** Puntos notables (la razón 2 : 1 y el teorema del incentro se prueban con Thales y la
bisectriz), Relaciones métricas (semejanza en el triángulo rectángulo y en la circunferencia), Áreas poligonales (razón de
áreas), Prisma y pirámide (semejanza de sólidos).

---

## 9. Decisiones tomadas (Gerson revisa después)

1. **Seis ideas: las cinco de hoy y `encajados` («Triángulos encajados y cruzados»), nueva; Ceva y Menelao pasan al final.** Motivo: emparejar lados por
   los ángulos es el error documentado GE22 y lo que cobran cuatro preguntas de San Marcos; Ceva y Menelao son lo más
   avanzado y no salen en San Marcos. *Descartado:* meter la antiparalela dentro de la idea 3 (la idea quedaba con dos metas)
   y partir la unidad.
2. **Cuatro ideas cambian su Predice y conservan su `id`; la unidad suma una idea:** va a `REHECHAS_E6` en `nucleo/avance.js`
   (marcas `prediccionPS` y `estudiadaPS`; `ceva-menelao` conserva la suya). Quien terminó las cinco de antes conserva «Ya la
   estudié».
3. **El incentro no se enseña aquí** (lo pide el encargo): su teorema va a Puntos notables (tema «Propiedades de los puntos
   notables»), igual que la pregunta 2020-I (41). Triángulos dice que «incentro» «se explica en Proporcionalidad y semejanza»:
   **cambió al escribir:** el validador pide que todo término del glosario aparezca en el texto de la unidad, así que
   «incentro» se mudó al glosario de Puntos notables (cambio mínimo: una entrada) y la tarjeta de Triángulos dice ahora que el
   incentro y el excentro «se explican en Puntos notables» (una frase y dos comentarios; su prueba sigue pasando).
   *Descartado:* dejarlo aquí sin usarlo (lo rechaza el validador) o nombrarlo en una idea (adelanta Puntos notables).
4. **Temas de la ficha:** «Teoremas de la bisectriz y del incentro» pasa a «Teorema de la bisectriz interior y exterior», y
   entra «Razón de áreas de figuras semejantes» (tres preguntas de San Marcos). `requiere` pasa a
   `geometria.poligonos-y-cuadrilateros` (punto 9).
5. **Colores por papel en la razón:** arriba naranja, abajo turquesa, en todas las ideas; en semejanza, cada pareja de lados
   homólogos lleva el mismo color en los dos triángulos. *Descartado:* el pedido en carmín de hoy (el carmín es de los
   ángulos) y el verde de referencia.
6. **Glosario sin la regla:** «teorema de la bisectriz» no va (su definición sería la respuesta de la predicción, como Pitot y
   Poncelet en Circunferencia); «teorema de Menelao» y «factor del área» dicen qué relacionan, no cuánto vale.
7. **La semejanza de cuerdas (2026-I, 35) va a Relaciones métricas**, por la nota del encargo; esta unidad no pide
   Circunferencia.
8. **El espejo sin «reflexión»:** en el nivel examen de la idea 3, el dato es «el rayo de luz sale del espejo con el mismo
   ángulo con que llega» (la simetría es de otra unidad).
9. **Notación:** AB : BC = 2 : 3 para la razón entre tramos y AB/BC en las fórmulas; ADE ∼ ACB con los vértices en orden; k
   para la razón de semejanza; x sin unidad pegada.
10. **Figuras de ejercicio sin escala** si lo pedido se puede medir, con «El dibujo no está a escala.», dibujadas con otra
    razón que la de verdad (lección M2 de Congruencia; M5, M6 y M7 de Circunferencia).
11. **Escena `semejante` nueva en `geo-objeto`** (bloque propio, aditivo); las ideas 2 y 6 usan `parcela` (tipo `terreno`)
    sin tocarla.
12. **Práctica nueva `geo-semejanza`** (sin figura); `ampliadora` y `geo-proporcionalidad` a «Más mesas del tema» solo aquí,
    con `unidades` en su papel.
13. **Prueba del curso:** ps-01 y ps-02 a la reserva (las formas tienen 10 pares).
14. **Códigos:** GE1, GE2, GE8 y GE22 se quedan; GE-THA, GE-CEV y GE-SEM de hoy se renumeran en familias por idea (GE-THA,
    GE-PIE, GE-SEM, GE-HOM, GE-ARE, GE-CEV), todos hipótesis, anotados en el informe de geometría.
15. **Áreas en esta unidad:** el área del triángulo y del rectángulo van como dato (se conocen desde la primaria); la relación
    de áreas de figuras que no son semejantes queda en Áreas poligonales.

### Decisiones chicas al escribir (fases 2 a 5)

- **Idea 4 se llama `encajados`** («Triángulos encajados y cruzados»), no `lados-homologos`: así no repite el «emparejar
  lados» de Congruencia y el título dice la situación (nota de la sesión del 19 nov).
- **La regla de Thales dibuja los dos casos:** las tres paralelas con dos secantes (A, B, C y D, E, F) y el triángulo con MN
  paralela a BC, uno al lado del otro (nota de la sesión).
- **Ceva y Menelao no usan nada de después:** ni incentro, ni baricentro, ni medianas (comprobado por la prueba de la unidad,
  que busca esas palabras en todo el texto). El pozo P es solo «donde se cruzan los caminos».
- **Totales en las figuras como «DF = 120 m»:** en las figuras de calles y de triángulos, el tramo entero lleva su nombre
  para no confundirse con un tramo; en la regla, con letras, solo el nombre.
- **Semejanza AA sin medidas de ángulos:** el caso del ejemplo con dos ángulos marcados no trae grados (con grados y lados a la
  vez, los números no cerraban).
- **Menelao con E fuera:** el distractor «suma o resta CA del lado que no es» es GE-CEV8.
- **Códigos de la bisectriz con prefijo GE-PIE** (pie de la bisectriz): GE-BIS ya es de Triángulos (GE-BIS1 a GE-BIS14).
- **Despejes en dos renglones:** donde la cuenta entera no cabía a 390 px, «En cruz, …» va en el texto y la ecuación queda
  con el último paso (herramientas/ecuaciones-ancho.js, sin ningún corte).
- **Juego de Ceva:** con BD : DC = 3 : 1 y CE = EA, el rótulo P no cabe junto a los caminos y no se escribe (en los demás
  casos sí).
- **Más mesas del tema:** `ampliadora` y `geo-proporcionalidad` llevan `"rehacer"` con esta unidad y `unidades` en su papel;
  el problema p7 de `geo-proporcionalidad` (el poste parado en el pie de la bisectriz) va a Geometría del espacio.
