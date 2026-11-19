# Propuesta de ideas: «Polígonos y cuadriláteros»

`geometria.poligonos-y-cuadrilateros` · Etapa 6 del plan de calidad, cuarta unidad de la rama «Geometría plana» (sigue a
«Segmentos y ángulos», «Triángulos y líneas notables» y «Congruencia de triángulos», las tres con `calidad: 2`) · fases
1 a 5 con criterio delegado (`docs/metodo/unidad/etapa-delegada.md`) · 19 nov 2026

Gerson delegó el criterio: esta propuesta es el guion con el que se escribió la unidad, y la sección 9 no trae preguntas
sino **las decisiones que tomé**, cada una con su motivo y la alternativa descartada, para que las revises después.
No hay ningún CONFLICTO CRÍTICO.

Lo que leí: `CLAUDE.md`, `docs/plan-calidad.md` §3, `docs/molde-unidad.md`, `docs/metodo/unidad/` (LEEME, 1-ideas,
2-ejemplos, 3-practica, reglas-validador y etapa-delegada), las decisiones de las etapas 2 a 5, la propuesta de
Congruencia (`docs/etapa5/propuesta-geometria.md`) como modelo, su auditoría y su lector en frío (qué se corrigió), la
teoría actual (`contenido/teoria/geometria/poligonos-y-cuadrilateros.js`, v0.2.0), su ficha en
`catalogo/cursos/geometria.json`, sus dos plantillas (`poligonos`, escena; `geo-poligonos`, generador compartido con
Polígonos regulares), el informe `docs/investigacion/geometria-ideas-erroneas.md`, `docs/temario-completo.md` (unidad 4),
los pares geo-10 y geo-11 de `catalogo/pruebas/geometria.json`, las preguntas de San Marcos de
`docs/datos/admision-unmsm.csv`, y para no repetir ni adelantar, Congruencia (ya calidad 2), Circunferencia (la que
sigue), Polígonos regulares y Áreas poligonales.

---

## Lo que pregunta la admisión

**Catálogo:** UNI, semana 3; San Marcos, temas 4 y 5. **Banco Cuzcano:** unas 163 fichas: rectángulos y cuadrados (32),
número de diagonales (23), trapecios (21), ángulos de polígonos regulares (20), paralelogramos (16).

**San Marcos, admisión real 2019-I a 2027-I:** 7 preguntas clasificadas en la unidad y 2 de Congruencia que usan el
trapecio:

| Qué piden | Periodo | Idea donde cae |
| --- | --- | --- |
| El número de lados a partir de la suma de los ángulos interiores | 2023-I (35) | 1 |
| La suma de dos ángulos de un cuadrilátero partidos por bisectrices, con un ángulo conocido | 2025-I (35) | 1, nivel examen |
| El perímetro de un hexágono equiángulo con cuatro lados dados (se prolongan lados hasta un equilátero) | 2026-II (37) | 2, nivel examen |
| El mayor ángulo entre linderos de un cuadrilátero con un rombo y lados iguales | 2024-I (36) | 5, nivel examen |
| El ángulo entre dos hojas cuadradas superpuestas | 2024-II (33) | 5, nivel examen |
| El alambre de dos cuadrados encajados con un triángulo de 37° y 53° | 2026-II (38) | 5, nivel examen |
| El ancho de un río de orillas paralelas con cuatro anclajes en trapecio | 2024-II (38) | 6, nivel examen |
| Base media y mediana del trapecio (de Congruencia) | 2019-I (41), 2027-I (35) | 6 |

San Marcos casi no pregunta por nombres: pide un ángulo, un lado o un perímetro, y la propiedad del cuadrilátero es el
paso que nadie escribe. Lo que más cobra son los cuadriláteros especiales (rombo y cuadrado) mezclados con isósceles,
equiláteros y notables, que ya enseñan Triángulos y Congruencia.

---

## 0. Qué tiene hoy la unidad y qué se queda o sale

1. **Cinco ideas** (`suma-de-angulos`, `diagonales`, `paralelogramos`, `trapecios`, `trapezoides`) con «Lee», pero sin
   `aprendizaje`, `actividad`, `pregunta`, misión ni leyenda; sin ejemplos resueltos (0 de 75); sin `datos` en ningún
   ejercicio; tres mesas (`cuadrilatero-libre`, `paralelogramo-libre`, `trapecio-libre`).
2. **Punto 1:** ninguna idea abre con un objeto: todas con `geo-figura` pelada. Los objetos están solo escritos («la señal
   de Pare», «un balde de costado», «una cometa»).
3. **Colores contra §5b y contra el curso:** n naranja, lo que acompaña turquesa, «referencia» verde y lo pedido en
   **rojo** (el color de los ángulos); el ángulo del paralelogramo, en verde. Nada coincide con Triángulos ni Congruencia.
4. **Lecturas con «·»** que unen dos igualdades («5 triángulos · suma interior = 900°») y sin unidades.
5. **Títulos ingeniosos** («Cada diagonal se cuenta dos veces», «Nombres que se ganan con condiciones», que además dicen la
   respuesta).
6. **Punto 9:** «Mira» de la idea 1 usa «interior más exterior forman 180°» sin decir de dónde sale; las mesas y el
   glosario hablan de «Varignon», «cuadrilátero cruzado» y «cóncavo» sin que ninguna idea los enseñe.
7. **La ficha pide solo `geometria.triangulos`**, pero el paralelogramo se prueba con congruencia y la mediana del trapecio
   con la base media: falta `geometria.congruencia`.
8. **Práctica:** `geo-poligonos` mezcla esta unidad con Polígonos regulares (apotemas, áreas, sección áurea) sin decir de
   cuál es cada problema; la escena `poligonos` no trae `datos`.
9. **Lo que falta y el examen cobra:** el número de lados desde la suma, el ángulo de un polígono equiángulo, los
   cuadriláteros especiales con sus diagonales (rectángulo, rombo, cuadrado) y la bisectriz del paralelogramo que arma un
   isósceles.

**Se queda:** los `id` de cuatro ideas (`suma-de-angulos`, `diagonales`, `paralelogramos`, `trapecios`) con los `id` de sus
controles (`n`; `n` y `v`; `t`; `b` y `d`), las tres mesas con su `id`, la historia de los Elementos I.34 (con su fuente) y
los términos del glosario que siguen siendo de aquí, que ganan `simple` y ejemplos.
**Sale o cambia:** la idea `trapezoides` (su contenido va a las ideas 1 y 4, decisión 3), los títulos, los colores, las
lecturas, las mesas (cambian de colores y pierden lo que ninguna idea enseña) y los términos sin uso.

---

## 1. Las ideas, en orden

Propongo **seis**, el tope. Dos son nuevas (`angulos-exteriores`, `rectangulo-rombo-cuadrado`); la unidad no se parte y
no hace falta `septimaIdea`.

| # | `id` | Título | `aprendizaje` |
| --- | --- | --- | --- |
| 1 | `suma-de-angulos` | Suma de ángulos interiores | Desde un vértice, las diagonales parten un polígono de n lados en n − 2 triángulos: sus ángulos interiores suman (n − 2) · 180°. |
| 2 | `angulos-exteriores` (nueva) | Ángulos exteriores del polígono | Los ángulos exteriores de un polígono convexo suman 360°; si sus n ángulos son iguales, cada exterior mide 360° ÷ n. |
| 3 | `diagonales` | Número de diagonales | De cada vértice salen n − 3 diagonales; como cada una tiene dos puntas, el polígono tiene n(n − 3) ÷ 2. |
| 4 | `paralelogramos` | El paralelogramo y sus propiedades | En un paralelogramo, los lados opuestos y los ángulos opuestos miden igual, dos vecinos suman 180° y las diagonales se cortan en su punto medio. |
| 5 | `rectangulo-rombo-cuadrado` (nueva) | Rectángulo, rombo y cuadrado | El rectángulo tiene diagonales iguales; el rombo, perpendiculares y que parten sus ángulos; el cuadrado es rectángulo y rombo a la vez. |
| 6 | `trapecios` | El trapecio y su mediana | La mediana del trapecio es paralela a las bases y mide su semisuma; el tramo entre los puntos medios de las diagonales, su semidiferencia. |

Preguntas del Resumen (`pregunta`): 1 «¿Cuánto suman los ángulos de adentro de un terreno?»; 2 «¿Cuánto gira en total
quien da la vuelta a una plaza?»; 3 «¿Cuántas ligas caben entre clavos que no son vecinos?»; 4 «¿Qué no cambia cuando un
marco de madera se inclina?»; 5 «¿Cómo sabe el carpintero que su marco quedó a escuadra?»; 6 «¿Qué ancho tiene el agua
de un canal lleno hasta la mitad?». Ninguna descarta una alternativa de su predicción.

**Por qué va cada una en su lugar y qué da por sabido**

1. **Suma de ángulos interiores.** La raíz: usa la suma de 180° del triángulo (Triángulos) y la diagonal (Congruencia).
   Nivel examen: el número de lados desde la suma (San Marcos 2023-I), dos polígonos con lados de diferencia y el
   cuadrilátero con dos bisectrices (2025-I): el ángulo entre las bisectrices de C y D mide (m∠A + m∠B) ÷ 2.
2. **Ángulos exteriores.** Va después porque se prueba con la idea 1 (n · 180° − (n − 2) · 180° = 360°) y con la vuelta del
   mototaxi. Estrena polígono equiángulo y polígono regular. Nivel examen: el número de lados desde un ángulo interior, el
   interior que es k veces el exterior y el hexágono equiángulo completado a equilátero (2026-II).
3. **Número de diagonales.** No usa ángulos; va tercera para que la idea 1 ya haya presentado la diagonal desde un vértice
   (los cordeles). Nivel examen: «si tuviera 3 lados más, tendría 30 diagonales más», las diagonales que son k veces los
   lados y el apretón de manos en la ronda (el par geo-10 de la prueba del curso).
4. **El paralelogramo.** El primer cuadrilátero con nombre. Se prueba con Congruencia (la diagonal parte el marco en dos
   triángulos congruentes por ALA, con los alternos internos de Segmentos). «Lee» clasifica por lados paralelos
   (paralelogramo, trapecio, trapezoide). Nivel examen: la bisectriz que arma un isósceles y el cuadrilátero de los puntos
   medios de un trapezoide (base media: su perímetro es la suma de las diagonales).
5. **Rectángulo, rombo y cuadrado.** Los paralelogramos especiales y sus diagonales, con la inclusión (GE10: un cuadrado
   también es rectángulo y rombo). El rombo se prueba con la mediatriz de Congruencia (A y C equidistan de B y de D).
   Nivel examen: el cuadrado con un equilátero (2024-II), el rombo con lados iguales (2024-I) y los cuadrados encajados
   con 37° y 53° (2026-II, con el notable de Congruencia como dato).
6. **El trapecio y su mediana.** Al final, porque se prueba con dos bases medias (Congruencia) y usa las paralelas del
   paralelogramo. Nivel examen: el lado partido en cuatro con tres paralelas (2027-I), el trapecio isósceles y el río de
   orillas paralelas (2024-II, con el notable de 3, 4 y 5 como dato).

**Temas de la ficha:** se quedan los cinco y agrego «Rectángulo, rombo y cuadrado». «Suma de ángulos internos y externos»
va en las ideas 1 y 2; «Trapezoides», en la 4 (clasificación y cuadrilátero de los puntos medios).

**Qué no entra (y dónde va):**
- Cuadrilátero inscrito, Pitot, tangentes: Circunferencia (la que sigue; nada de arcos ni circunferencias aquí).
- Apotema, ángulo central, polígonos inscritos y sección áurea: Polígonos regulares. Aquí solo «regular» como nombre
  (lados iguales y ángulos iguales) y el ángulo interior y exterior de un equiángulo.
- Áreas de cuadriláteros y el área del paralelogramo de Varignon: Áreas poligonales.
- Polígonos cóncavos y cruzados: fuera (la mesa vieja los mostraba sin idea que los enseñe). Todos los ejercicios son
  convexos; la regla lo dice.
- Pitágoras como teorema y la altura del trapecio por relaciones métricas: Relaciones métricas; aquí solo el notable de
  3, 4 y 5 como dato, como en Congruencia.
- Diagonales desde k vértices consecutivos (fórmula de academia): fuera; el examen de San Marcos no la trae.

---

## 2. Objeto de la primera pantalla

| Idea | Objeto | Qué es cada cosa |
| --- | --- | --- |
| 1 | **El terreno de don Julián**, visto desde arriba, con una estaca en cada esquina y cordeles tendidos desde la estaca A | esquinas = vértices; cordeles = diagonales desde A; parcelas = los triángulos |
| 2 | **Una plaza de esquinas iguales y el mototaxi que la rodea** | lo que gira el mototaxi en cada esquina = el ángulo exterior; la esquina por dentro = el interior |
| 3 | **Un geoplano redondo** (tablero con clavos y ligas, material del colegio) | clavos = vértices; ligas entre clavos no vecinos = diagonales |
| 4 | **Un marco de madera con pernos en las esquinas, que se inclina** sobre la mesa del taller | listones = lados; pernos = vértices; cordeles en diagonal (en Predice) |
| 5 | **El marco de una ventana con dos cordeles en diagonal**: el carpintero los mide para saber si quedó a escuadra; en Predice, el marco de cuatro listones iguales (rombo) | cordeles = diagonales |
| 6 | **El corte de un canal de riego** con el agua hasta la mitad | boca y fondo = bases; paredes = lados no paralelos; el borde del agua = la mediana |

Los de las ideas 1, 2, 3 y 6 van en un bloque nuevo de `geo-objeto` (escena `parcela`, tipos `terreno`, `plaza`,
`geoplano` y `canal`); los marcos de las ideas 4 y 5 usan el `armazon` de Congruencia (listones y pernos). Todos son
dibujos de prueba (`data-prueba`) con su prueba numérica de encuadre y de rótulos.

---

## 3. Misión de «Juega» (meta que el motor comprueba)

| Idea | Contexto + misión | Controles | `logrado` | Lectura (una relación) |
| --- | --- | --- | --- | --- |
| 1 | «Don Julián reparte su terreno en parcelas triangulares con cordeles que salen de la estaca A.» **Agrega esquinas hasta que los cordeles dejen 6 parcelas.** | `n` (3 a 10, empieza en 5) | `n === 8` | «n = 5: 3 parcelas; 3 · 180° = 540°» |
| 2 | «El mototaxi da vueltas a una plaza de esquinas iguales.» **Elige la plaza en la que gira 45° en cada esquina.** | `n` (3 a 10, empieza en 5) | `n === 8` | «n = 5: adentro 108°; gira 72°; 108° + 72° = 180°» |
| 3 | «En el geoplano, cada liga va de un clavo a otro que no es su vecino.» **Pon clavos hasta que del clavo marcado salgan 5 ligas.** | `n` (4 a 10, empieza en 6) y `v` (clavo de partida) | `n === 8` | «n = 6: del clavo marcado salen 6 − 3 = 3 ligas» |
| 4 | «Un marco de 60 cm por 40 cm se inclina sin que sus listones cambien.» **Inclínalo hasta que la esquina B mida 110°.** | `t` = m∠A (40° a 140°, de 10° en 10°; empieza en 90°) | `t === 70` | «m∠A = 60°: m∠C = 60°; m∠B = m∠D = 120°» |
| 5 | «El marco de una ventana mide 80 cm por 60 cm; el carpintero mide sus dos cordeles.» **Endereza el marco hasta que los dos cordeles midan lo mismo.** | `t` = m∠A (60° a 120°, de 5° en 5°; empieza en 70°) | `t === 90` | «AC ≈ 115,3 cm y BD ≈ 82,0 cm: AC es mayor» |
| 6 | «La boca del canal mide 6 m; el agua llega a la mitad de su hondura.» **Ajusta el fondo hasta que el agua mida 4,5 m de ancho.** | `b` (fondo, 1 a 5 m, de 0,5 en 0,5) y `d` (el fondo corrido) | `b === 3` | «MN = 4 m, entre BC = 2 m y AD = 6 m» |

Ninguna misión está cumplida al abrir; ninguna leyenda trae el número que solo sale con la misión cumplida.

---

## 4. La predicción de cada idea

La app baraja las opciones; los `datos` traen valores, nunca la fórmula (ni «AB = CD»: el validador lo lee como fórmula).
Ningún error de la unidad tiene datos medidos: GE10 y GE23 vienen del informe (parciales o sin respaldo); los GE-POL,
GE-TRP y GE-PC nuevos son hipótesis. En la figura, lo que se pide va con «?» en tinta o no va.

**Idea 1.** «Doña Rosa reparte otro terreno de 5 lados de otra manera: clava una estaca O adentro y tiende un cordel de O a
cada esquina. Salen 5 parcelas. ¿Cuánto suman los 5 ángulos interiores del terreno?» Datos: en cada triángulo, los tres
ángulos suman 180°; los ángulos que se juntan alrededor de O forman una vuelta, 360°.

| Opción | Qué mide |
| --- | --- |
| 540° | Correcta: 5 · 180° − 360° |
| 900° | Suma los ángulos de O como si fueran del terreno (GE-POL6, nuevo) |
| 720° | Cuenta un triángulo de más: (n − 1) · 180° (GE23) |
| Depende de dónde quede O | Cree que la suma cambia con la forma de partir (GE-POL7, nuevo) |

**Idea 2.** «El mototaxi da la vuelta a otra plaza de 5 esquinas, todas distintas. Gira 60°, 85°, 70° y 75° en cuatro de
ellas. ¿Cuánto gira en la quinta?» Datos: en cada esquina, el ángulo de adentro y el giro forman 180°; los ángulos
interiores de un polígono de 5 lados suman 540°.

| Opción | Qué mide |
| --- | --- |
| 70° | Correcta: los giros suman una vuelta |
| 250° | Suma los giros como si fueran ángulos interiores, hasta 540° (GE-POL1) |
| 72° | Reparte 360° en partes iguales: supone la plaza de esquinas iguales (GE-POL8, nuevo) |
| 110° | Da el ángulo de adentro de esa esquina, no el giro (GE-POL9, nuevo) |

**Idea 3.** «Ahora el geoplano tiene 10 clavos. Si pones una liga entre cada par de clavos que no son vecinos, ¿cuántas
ligas usas en total?» Datos: del clavo marcado salen 7 ligas; cada liga une dos clavos.

| Opción | Qué mide |
| --- | --- |
| 35 | Correcta |
| 70 | Cuenta cada liga dos veces, una por punta (GE-POL4) |
| 45 | Une todos los pares, también los vecinos: cuenta los lados (GE23) |
| 7 | Cuenta solo las del clavo marcado (GE-POL5) |

**Idea 4.** «Don Julián ata dos cordeles en diagonal al marco inclinado, de A a C y de B a D. ¿Qué pasa siempre, se incline
como se incline?» Datos: los listones de enfrente miden igual, 60 cm y 40 cm.

| Opción | Qué mide |
| --- | --- |
| Se cortan justo en la mitad de cada uno | Correcta |
| Los dos cordeles miden lo mismo | Lleva al paralelogramo lo del rectángulo (GE-PC1, nuevo) |
| Se cortan en ángulo recto | Lleva al paralelogramo lo del rombo (GE-PC2, nuevo) |
| Nada fijo: depende de cuánto se incline | No ve la propiedad que se conserva (GE-PC3, nuevo) |

**Idea 5.** «Ahora el marco tiene sus cuatro listones de 50 cm, como el rombo de una reja. Inclinado, ¿cómo se cruzan sus
cordeles AC y BD?» Datos: los cuatro listones miden 50 cm; el marco está inclinado: la esquina A mide 60°.

| Opción | Qué mide |
| --- | --- |
| En ángulo recto | Correcta |
| A 60°, igual que la esquina A | Copia el ángulo del marco (GE-PC4, nuevo) |
| En ángulo recto solo si el marco está a escuadra | No acepta que un rombo inclinado lo cumpla: lo deja para el cuadrado (GE10) |
| Depende de cuánto se incline | (GE-PC3) |

**Idea 6.** «En otro canal, la boca AD mide 10 m y el fondo BC, 4 m. Dos cordeles tensos van de A a C y de B a D, y cruzan
la línea del agua MN en P y Q. ¿Cuánto mide PQ?» Datos: M y N son las mitades de las paredes; P y Q son las mitades de los
cordeles. La figura no está a escala (a escala, PQ se mediría).

| Opción | Qué mide |
| --- | --- |
| 3 m | Correcta: (10 − 4) ÷ 2 |
| 7 m | Da la línea del agua entera, MN (GE-TRP1) |
| 6 m | Resta las bases y no saca la mitad (GE-TRP2) |
| 2 m | Da MP, la mitad del fondo (GE-TRP3, nuevo) |

---

## 5. Tabla de letras y símbolos

| Letra | Un solo significado en la unidad | Aviso |
| --- | --- | --- |
| n | El número de lados del polígono (igual al de vértices y al de ángulos) | — |
| S | La suma de los ángulos interiores | Solo en la idea 1 y en los ejercicios que la usan |
| x | Lo que se pide, un número | Sin «°»: m∠A = 3x + 10°, x = 20 |
| A, B, C, … | Vértices, en orden alrededor de la figura (ABCD: A con C y B con D son opuestos) | Chocan con las alternativas A–E: donde hay puntos, ningún resuelto nombra una alternativa por su letra |
| O | El punto de adentro donde se juntan cordeles o se cortan diagonales | — |
| M, N, P, Q | Puntos medios (de lados o de diagonales, según el problema) | En el trapecio, M y N en los lados no paralelos, P y Q en las diagonales, como en los libros |
| E | Un punto marcado sobre un lado o dentro de la figura | — |
| m∠A, m∠BAC | La medida de un ángulo; tres letras cuando el vértice tiene varios | Como en Triángulos |
| ∥, ⟂, △ | Paralela, perpendicular, triángulo | Ya definidos |
| °, cm, m | Unidades | Todo largo lleva la suya |

La tabla va en el campo `letras` de la unidad (`n`, `S`, `x`).

---

## 6. Mapa de colores (§5b y las reglas del curso)

Las reglas que ya decidió el curso: interiores en carmín con 1, 2 o 3 arcos; exterior en turquesa; lados dados naranja y
turquesa; todo ángulo dado en carmín en los ejercicios; lo pedido con «?» en tinta; el violeta solo en el texto del
resuelto y en la respuesta; sin verde; marcas de igualdad sobre una llave.

| Idea | Carmín | Turquesa | Naranja | Tinta | Violeta |
| --- | --- | --- | --- | --- | --- |
| 1 | los ángulos interiores | — | n (en el texto y el control) | lados, cordeles punteados, parcelas | S y la respuesta |
| 2 | los interiores | los giros (exteriores) | n | lados y calles prolongadas | la respuesta |
| 3 | — | — | las ligas del clavo marcado y n | las demás ligas, el tablero | el total |
| 4 | los ángulos (1 arco en A y C, 2 en B y D) | AD y BC | AB y CD | cordeles, flechitas de paralelas | la respuesta |
| 5 | los ángulos | el cordel BD | el cordel AC | listones | la respuesta |
| 6 | los ángulos (trapecio isósceles) | el fondo BC | la boca AD | las paredes, la línea del agua MN, PQ | la respuesta |

En los ejercicios, el lado que se pide va en tinta con «?» aunque su pareja tenga color (el color no da la respuesta). La
prueba de la unidad comprueba la regla en todas las figuras.

---

## 7. Práctica y datos del mundo

### 7a. Qué existe y qué falta

- **La escena `poligonos`** (borrador 0.1.0, «El polígono que se abre»): sin `datos`, con verde y rojo; también sirve a
  Polígonos regulares. Va a «Más mesas del tema» solo en esta unidad (`"rehacer": ["geometria.poligonos-y-cuadrilateros"]`)
  y su papel dice de qué unidad es cada problema (`unidades`).
- **`geo-poligonos`** (generador compartido con Polígonos regulares): sus tipos de esta unidad no traen `datos` ni dicen de
  qué unidad son. Esta unidad deja de usarlo (sale de su ficha y de `unidades` en su `plantilla.json`); Polígonos regulares
  lo conserva.
- **Plantilla nueva `geo-poligonos-cuadrilateros`** (formato `predicciones`, sin figura, como `geo-congruencia`): tipos
  por idea (`TIPOS_POR_IDEA`), `datos` por línea con prueba en 400 semillas, `casos.json` verificado aparte y papel de 8
  problemas (las seis ideas).
- **Mesas:** las tres de antes conservan su `id` y pasan a los colores del curso: `cuadrilatero-libre` (idea 4, los puntos
  medios de un cuadrilátero convexo), `paralelogramo-libre` (idea 5, el nombre que gana con sus diagonales) y
  `trapecio-libre` (idea 6). Sin cóncavos ni cruzados.
- **Prueba del curso:** las formas ya tienen 10 pares (geo-10 y geo-11 son de esta unidad); dos ítems nuevos a la reserva:
  pc-01 (la bisectriz del paralelogramo) y pc-02 (la mediana y el tramo de las diagonales del trapecio), con su verificador.

### 7b. Datos del mundo

La unidad casi no los necesita: terrenos, plazas, marcos, ventanas y canales con medidas de problema, posibles (punto 10):
un marco de ventana de 80 cm por 60 cm, un canal de riego de 6 m de boca, un terreno de unos 40 m de lado. «La señal de
Pare tiene ocho lados» es un hecho del reglamento de tránsito sin cifra que verificar. El 37° y 53° va con «(convención
del examen)», como en Congruencia. La historia de los Elementos I.34 ya trae fuente (edición de D. E. Joyce).

---

## 8. Riesgos de orden con otras unidades (`requiere`)

**Lo que la unidad da por sabido:** de Triángulos, la suma de 180°, el ángulo exterior, el isósceles y el equilátero; de
Congruencia, ALA y LLL, la diagonal, la mediatriz (todo punto que equidista de B y D está en ella), la base media y los
notables como dato; de Segmentos, las paralelas (alternos internos iguales, conjugados internos que suman 180°), la
bisectriz y despejar x. **Cambio en la ficha:** `requiere` pasa de `geometria.triangulos` a `geometria.congruencia` (que ya
pide Triángulos).

**Lo que hay que rehacer para no usar lo que viene después:**

| Hoy | Problema | Cómo queda |
| --- | --- | --- |
| «Interior más exterior forman 180°» sin decir por qué | Dato suelto | Se cita de Triángulos (adyacentes en una recta) en el dato y en «Lee» |
| Mesa del cuadrilátero cóncavo y cruzado; «Varignon» en el glosario | Nada lo enseña | Sin cóncavos ni cruzados; el cuadrilátero de los puntos medios se prueba con la base media, sin nombre propio |
| Trapecio en el glosario de Congruencia como contraejemplo de paralelogramo | — | Se queda: «paralelogramo» se muda aquí y Congruencia lo marca «se explica en…» |

**Lo que no hay que adelantar:** Circunferencia (ningún arco, tangente ni cuadrilátero inscrito), Polígonos regulares
(ni apotema ni ángulo central: «regular» es solo un nombre), Áreas poligonales (ninguna área), Relaciones métricas
(Pitágoras y el 3-4-5 solo como dato).

**Lo que otras unidades toman de aquí:** Polígonos regulares (los nombres y el ángulo interior del regular), Áreas
poligonales (paralelogramo, rombo y trapecio; el cuadrilátero de los puntos medios), Circunferencia (cuadriláteros y
la suma de 360°).

---

## 9. Decisiones tomadas (Gerson revisa después)

1. **Seis ideas, con `angulos-exteriores` y `rectangulo-rombo-cuadrado` nuevas; la unidad no se parte.** Motivo: los
   exteriores son una regla propia (360°) con un nivel de examen propio (el interior del regular, el hexágono de 2026-II),
   y los cuadriláteros especiales son lo que más cobra San Marcos (tres de siete preguntas) y el Cuzcano (32 fichas).
   *Descartado:* partir en «Polígonos» y «Cuadriláteros» (dos unidades de 3 y 4 ideas, con migración del avance y cambios
   en los `requiere` de Polígonos regulares y Áreas) y declarar `septimaIdea` con `trapezoides` aparte (el trapezoide no
   tiene una regla propia que el examen cobre).
2. **La idea `trapezoides` sale.** El trapezoide queda como nombre en la clasificación de la idea 4 y en su nivel examen (los
   puntos medios de un trapezoide forman un paralelogramo de perímetro igual a la suma de las diagonales); el cuadrilátero
   cualquiera, en la idea 1 (suma de 360° y bisectrices, San Marcos 2025-I). Lo guardado de esa idea no se migra: no tenía
   predicción que se repita y una idea que ya no existe no cuenta en el avance de la unidad.
3. **Tema nuevo «Rectángulo, rombo y cuadrado»**; «Trapezoides» se queda en la ficha, en la idea 4.
4. **Polígonos convexos en todos los ejercicios**; cóncavos y cruzados salen de la unidad y de su mesa. *Descartado:*
   enseñar que (n − 2) · 180° vale también con entrantes (el examen no lo pregunta y abre dudas con el exterior).
5. **«Polígono regular» se muda aquí desde Polígonos regulares** (solo el término del glosario: lados iguales y ángulos
   iguales), con «polígono equiángulo» nuevo. Motivo: el examen dice «polígono regular» al pedir su ángulo interior, y el
   nombre es de la primera unidad de polígonos. Polígonos regulares lo sigue usando y el lector lo marca «se explica en
   Polígonos y cuadriláteros». *Descartado:* decir solo «equiángulo» en toda la unidad.
6. **«Paralelogramo» se muda aquí desde Congruencia** (decisión 29 de la etapa 5); allá el ejemplo 13 de la idea 2 dice
   «se explica en Polígonos y cuadriláteros».
7. **`requiere` pasa a `geometria.congruencia`.** Motivo: punto 9; las pruebas del paralelogramo, del rombo y del trapecio
   usan congruencia, mediatriz y base media.
8. **Las pruebas se rehacen con lo ya sabido:** el paralelogramo con ALA y alternos internos; el rombo con la mediatriz; el
   rectángulo con LAL; el trapecio con dos bases medias; la suma de exteriores con la idea 1 y la vuelta del mototaxi.
9. **Colores:** interiores carmín, exteriores turquesa, lados dados naranja y turquesa (AB y CD naranja, AD y BC turquesa en
   el paralelogramo; AC naranja y BD turquesa en las diagonales; la boca naranja y el fondo turquesa en el trapecio), n
   naranja en el texto; sin verde; violeta solo en el resuelto y la respuesta. *Descartado:* el verde de hoy para la
   referencia (protanopía con el naranja).
10. **Figuras de ejercicio con un ángulo pedido: sin escala**, con «El dibujo no está a escala.» y el ángulo pedido dibujado
    lejos de la respuesta (lección M2 de Congruencia). Las de conteo (lados, diagonales) y las de lados dados van como
    salgan, sin medidas que se lean del dibujo.
11. **Notación:** S para la suma de interiores (solo en la idea 1 y donde se usa), «diagonales» sin letra (la D es un
    vértice), n en naranja, m∠A, x sin «°», bases del trapecio por su nombre (AD y BC), no B y b (B es un vértice).
12. **Códigos:** GE10, GE23, GE-POL1, GE-POL4 y GE-TRP1 y 2 se quedan; agrego como hipótesis GE-POL5 a GE-POL20, GE-PC1 a
    GE-PC20 y GE-TRP3 a GE-TRP10, anotados en el informe de geometría.
13. **Práctica nueva `geo-poligonos-cuadrilateros`** (sin figura); esta unidad deja `geo-poligonos` (queda para Polígonos
    regulares) y manda la escena `poligonos` a «Más mesas del tema» solo aquí. *Descartado:* separar `geo-poligonos` por
    unidad (sus tipos de esta unidad no traen `datos` y mezclan regulares con apotema).
14. **Prueba del curso:** pc-01 y pc-02 a la reserva (las formas tienen 10 pares).

### Decisiones chicas al escribir (fases 2 a 5)

15. **Cordeles con trazo fino continuo y parcelas numeradas** en el juego de la idea 1 (notas de la sesión): punteados,
    el primer tramo quedaba en blanco junto a la estaca A; con dos tonos y su número, las parcelas se cuentan.
16. **Juego del marco (idea 4): solo la esquina A lleva rótulo**, y el control va de 50° a 130° (antes 40° a 140°): con
    los cuatro rótulos, el de un ángulo chico se alejaba hasta otra esquina. La lectura dice los cuatro.
17. **Sin llaves en las mitades de las diagonales** (marco y rombo de las ideas 4 y 5): en tramos tan cortos, entre los
    dos cordeles y sobre los listones, se enredaban; las mitades las dicen la lectura, el paso de «Mira» y la ecuación.
    Las llaves se quedan donde caben (lados del rombo de examen). *Descartado:* rayitas sobre el tramo (la regla del curso).
18. **Fondo del canal desde 1,5 m** (antes 1 m): con 1 m, las letras B y C pisaban la medida del fondo.
19. **Figuras sin escala elegidas entre varias formas** (bisectrices del cuadrilátero, plazas, rombos, paralelogramos y
    trapecios): se usa la que dibuja el ángulo pedido a 8° o más de su valor; la prueba de la unidad lo comprueba.
20. **«Regular» en la teoría solo como nombre** (Lee de la idea 2 y glosario); «Ahora tú» dice «equiángulo», y la
    práctica usa «regular» en un tipo con su definición en Datos.
21. **Tres mesas**, con sus `id` de antes y los colores del curso: los puntos medios de un cuadrilátero (idea 4), las
    diagonales que dan el nombre (idea 5) y el trapecio estirable (idea 6). Las ideas 1 a 3 aportan su juego al
    laboratorio. *Descartado:* una mesa por idea (el juego de esas ideas ya es libre).
22. **`geo-poligonos` queda solo para Polígonos regulares**: sale de la fila de `nucleo/repaso-tipos.js` (ya no es mixto)
    y el papel de la escena `poligonos` dice de qué unidad es cada problema (`unidades`).
23. **Ítems pc-01 y pc-02 con números que el generador no saca** (la prueba del banco pide que ningún ítem repita un
    problema del generador).
24. **Congruencia** conserva el paréntesis «(ABCD es un paralelogramo: se explica más adelante.)» (con «en Polígonos y
    cuadriláteros» pasaba el tope de 30 palabras); el lector marca el término y dice dónde se explica.
