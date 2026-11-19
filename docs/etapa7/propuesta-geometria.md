# Propuesta de ideas: «Circunferencia y ángulos en ella»

`geometria.circunferencia` · Etapa 7 del plan de calidad, quinta unidad de la rama «Geometría plana» (sigue a «Segmentos y
ángulos», «Triángulos y líneas notables», «Congruencia de triángulos» y «Polígonos y cuadriláteros», las cuatro con
`calidad: 2`) · fases 1 a 5 con criterio delegado (`docs/metodo/unidad/etapa-delegada.md`) · 19 nov 2026

Gerson delegó el criterio: esta propuesta es el guion con el que se escribió la unidad, y la sección 9 no trae preguntas
sino **las decisiones que tomé**, cada una con su motivo y la alternativa descartada, para que las revises después.
No hay ningún CONFLICTO CRÍTICO.

Lo que leí: `CLAUDE.md`, `docs/plan-calidad.md` §3, `docs/molde-unidad.md`, `docs/metodo/unidad/` (LEEME, 1-ideas,
2-ejemplos, 3-practica, reglas-validador y etapa-delegada), las decisiones de las etapas 2 a 6, la propuesta de Polígonos
(`docs/etapa6/propuesta-geometria.md`) como modelo, su auditoría y su lector en frío (qué se corrigió), la teoría actual
(`contenido/teoria/geometria/circunferencia.js`, v0.2.0), su ficha en `catalogo/cursos/geometria.json`, sus dos plantillas
(`angulo-inscrito`, escena compartida con Longitud y áreas circulares; `geo-circunferencia-metrica`, generador compartido
con Relaciones métricas), el informe `docs/investigacion/geometria-ideas-erroneas.md` (GE12, GE15, GE16, GE19),
`docs/temario-completo.md` (unidad 5), el par geo-08 de `catalogo/pruebas/geometria.json`, las 12 preguntas de San Marcos de
`docs/datos/admision-unmsm.csv` clasificadas en la unidad, y para no repetir ni adelantar, Congruencia y Polígonos (ya
calidad 2), Proporcionalidad y semejanza (la que sigue), Relaciones métricas, Puntos notables y Longitud y áreas circulares.

---

## Lo que pregunta la admisión

**Catálogo:** UNI, semanas 4 y 5; San Marcos, temas 6 y 7. **Banco Cuzcano:** unas 93 fichas: tangencia (21), posiciones
relativas (20), cuadrilátero inscrito e inscriptible (14), cuerdas, arcos y diámetros (11), central e inscrito (9).

**San Marcos, admisión real 2019-I a 2027-I:** 12 preguntas clasificadas en la unidad.

| Qué piden | Periodo | Idea donde cae |
| --- | --- | --- |
| Un ángulo con vértice en la circunferencia, con radios iguales e isósceles (un transportador) | 2019-I (46) | 4, nivel examen (y el isósceles de radios, idea 1) |
| Inscritos y semiinscrito que se reparten media vuelta en un punto de tangencia | 2019-II (34) | 4, nivel examen |
| El lado de un cuadrilátero circunscrito con tangentes iguales y notables | 2023-II (34) | 2, nivel examen |
| Un ángulo en un cuadrado que se reconoce inscriptible | 2025-II (36) | 6, nivel examen (sin los notables de 53°/2, que son de Puntos notables) |
| El ángulo entre dos tangentes cuando el arco mayor es múltiplo del ángulo | 2026-I (36) | 5, nivel examen |
| Un ángulo central desde el ángulo interior de dos cuerdas | 2026-I (35) | 5 |
| El ángulo opuesto de un cuadrilátero cuyos vértices equidistan de un punto | 2026-II (36) | 6 |
| Una cuerda con arcos iguales, inscritos y triángulos congruentes | 2026-II (35) | 4, nivel examen |
| Un semiinscrito desde el ángulo exterior de dos tangentes | 2027-I (33) | 5, nivel examen |
| El segmento entre puntos de tangencia en una loseta con su circunferencia inscrita (Poncelet) | 2027-I (36) | 2, nivel examen |
| El teorema de la tangente (PT² = PA · PB), dos veces | 2023-I (35), 2027-I (37) | Relaciones métricas («Cuerdas, secantes y tangente»), no aquí |

San Marcos pregunta casi siempre un **ángulo**: siete de las diez preguntas de la unidad son de ángulos en la
circunferencia (inscrito, semiinscrito, interior, exterior y cuadrilátero inscrito), y las otras tres, de tangentes iguales.
El teorema de la tangente es del tema «Cuerdas, secantes y tangente» de Relaciones métricas.

---

## 0. Qué tiene hoy la unidad y qué se queda o sale

1. **Seis ideas** (`tangentes`, `posiciones`, `inscrito`, `interior-exterior`, `poncelet-pitot`, `cuadrilatero-inscrito`) con
   «Lee», «Así se resuelve» y tres mesas, pero sin `aprendizaje`, `actividad`, `pregunta`, misión ni leyenda; sin ejemplos
   resueltos (0 de 90); sin `datos` en ningún ejercicio.
2. **Punto 1:** ninguna idea abre con un objeto: todas con `geo-figura` pelada; los objetos solo están escritos («una pileta
   de Juliaca», «un plato en una bandeja», «dos piedritas en el lago»).
3. **Colores contra §5b y contra el curso:** radios y referencias en **verde** (protanopía con el naranja), el ángulo
   pedido en **carmín**, la `d` entre centros en carmín (es un largo), el verde de la región del cuadrilátero. Nada
   coincide con Triángulos, Congruencia ni Polígonos.
4. **Títulos que dicen la respuesta** («Inscrito: la mitad del arco», «Dentro se suma, fuera se resta», «Opuestos que suman
   180°»); lecturas con «·» entre dos igualdades.
5. **Glosario que delata:** «ángulo inscrito: mide la mitad de su arco», «semiinscrito: mide la mitad» (la predicción de esa
   idea), «tangentes exteriores: d = r₁ + r₂» (media respuesta de la predicción de posiciones), «cuadrilátero inscrito: sus
   opuestos suman 180°».
6. **Falta lo que el examen cobra y el temario de academia trae primero:** las propiedades de la cuerda (el radio
   perpendicular la parte en dos; cuerdas igual de lejos del centro miden igual), el isósceles de dos radios (2019-I) y el
   ángulo entre dos tangentes (2026-I, 2027-I).
7. **La ficha pide solo `geometria.triangulos`**, pero la prueba de la cuerda usa la mediatriz y Pitot usa las
   tangentes iguales con congruencia: falta `geometria.congruencia`; y los cuadriláteros (suma de 360°, trapecio, cuadrado)
   son de Polígonos.
8. **Práctica:** `geo-circunferencia-metrica` mezcla esta unidad con Relaciones métricas (teorema de la tangente, cuerdas
   que se cortan) sin `datos`; la escena `angulo-inscrito` no trae `datos` y su papel no dice de qué unidad es cada problema.
9. **Glosario de Congruencia:** «circunferencia», «radio» y «diámetro» siguen definidos allá (pendiente de la Etapa 5).

**Se queda:** los `id` de las seis ideas, los de las tres mesas (`dos-libres`, `inscrito-libre`, `cuadrilatero-libre`), los
controles que siguen teniendo sentido (`fi` en la idea 4, `a` y `b` en la 5, `t` sale), la historia de los Elementos III.20
(con su fuente) y los términos del glosario, que ganan `simple` y ejemplos sin delatar.
**Sale o cambia:** el contenido de la idea `tangentes` (ahora también la cuerda) y de `poncelet-pitot` (ahora también las
tangentes iguales desde un punto, que estaban en la idea 1), el orden (Pitot pasa al segundo lugar), los títulos, los
colores, las lecturas, las predicciones de cinco ideas y el glosario.

---

## 1. Las ideas, en orden

Propongo **seis**, el tope, con los seis `id` de hoy. La unidad no se parte y no hace falta `septimaIdea`: la cuerda entra
en la primera idea junto a la tangente (son lo mismo: la recta que se aleja del centro), y las tangentes iguales pasan a la
idea de Pitot y Poncelet, que son su consecuencia.

| # | `id` | Título | `aprendizaje` |
| --- | --- | --- | --- |
| 1 | `tangentes` | Radio, cuerda y tangente | El radio perpendicular a una cuerda la parte por la mitad; cuerdas igual de lejos del centro miden igual; la tangente es perpendicular al radio. |
| 2 | `poncelet-pitot` | Tangentes iguales: Pitot y Poncelet | Las dos tangentes desde un punto miden igual; de ahí salen Pitot, en el cuadrilátero circunscrito, y Poncelet, en el triángulo rectángulo. |
| 3 | `posiciones` | Posición de dos circunferencias | Dos circunferencias se cortan, se tocan o se separan según cómo se compare la distancia entre centros con la suma y la resta de los radios. |
| 4 | `inscrito` | Ángulo central e inscrito | El ángulo central mide lo que su arco; el inscrito y el semiinscrito miden la mitad del arco que abarcan. |
| 5 | `interior-exterior` | Ángulos interior y exterior | Con el vértice dentro, el ángulo mide la semisuma de sus dos arcos; con el vértice fuera, la semidiferencia. |
| 6 | `cuadrilatero-inscrito` | Cuadrilátero inscrito | Si los cuatro vértices están en una circunferencia, los ángulos opuestos suman 180°; y si suman 180°, caben en una. |

Preguntas del Resumen (`pregunta`): 1 «¿Qué ancho tiene el agua en un tanque echado?»; 2 «¿Qué miden los bordes de una
bandeja donde un plato entra justo?»; 3 «¿Cuándo se cruzan dos círculos de luz?»; 4 «¿Con qué ángulo se ven dos faroles
desde el borde de una pileta?»; 5 «¿Qué ángulo forman dos veredas que cruzan una plaza redonda?»; 6 «¿Qué tienen de
especial cuatro faroles en el borde de una pileta?». Ninguna descarta una alternativa de su predicción.

**Por qué va cada una en su lugar y qué da por sabido**

1. **Radio, cuerda y tangente.** La raíz: estrena circunferencia, radio, diámetro (mudados de Congruencia), cuerda y
   tangente. Se prueba con lo sabido: OA = OB (radios), el isósceles de Triángulos (la altura es también mediana) y la
   mediatriz de Congruencia; Pitágoras va como dato (como en Congruencia). La tangente sale como el caso límite: la cuerda
   que se aleja del centro hasta volverse un punto. Nivel examen: el radio desde la cuerda y su flecha (la altura del agua),
   el largo de la tangente desde un punto, el isósceles de radios con un ángulo en O (2019-I).
2. **Tangentes iguales: Pitot y Poncelet.** Va después porque usa la tangente perpendicular al radio (los dos triángulos
   rectángulos con la hipotenusa común son congruentes, LLL con Pitágoras de dato). Pitot y Poncelet son las tangentes
   iguales contadas en cada vértice. Nivel examen: el trapecio isósceles circunscrito (lados y radio), el triángulo que
   recorta una tercera tangente (perímetro 2 · PT) y la loseta cuadrada con su circunferencia (2027-I).
3. **Posición de dos circunferencias.** Tercera porque «tocarse en un punto» ya tiene nombre (tangente). Nivel examen: tres
   monedas tangentes de dos en dos (los lados del triángulo de centros), una circunferencia dentro de otra, y la tangente
   común exterior (Pitágoras de dato con los radios perpendiculares de la idea 1).
4. **Ángulo central e inscrito.** El arco se mide en grados por su ángulo central (definición en «Lee»). El inscrito se
   prueba con el isósceles de dos radios (idea 1) y el ángulo exterior de Triángulos; el semiinscrito, con la tangente
   perpendicular (idea 1). Nivel examen: el inscrito en una semicircunferencia (90°), inscritos y semiinscrito en un punto de
   tangencia (2019-II), el transportador (2019-I) y arcos iguales con cuerdas iguales (2026-II).
5. **Ángulos interior y exterior.** Necesita el inscrito (se prueba con un inscrito y el exterior de un triángulo) y la
   tangente (el exterior de dos tangentes). Nivel examen: dos tangentes con el arco mayor k veces el ángulo (2026-I), el
   central desde el interior (2026-I) y el semiinscrito desde el exterior de dos tangentes (2027-I).
6. **Cuadrilátero inscrito.** Al final: sus opuestos son dos inscritos que entre los dos abarcan la circunferencia entera,
   y usa la suma de 360° de Polígonos. Nivel examen: el inscriptible que se reconoce en un cuadrado (2025-II), los vértices
   que equidistan de un punto (2026-II) y el exterior igual al interior opuesto.

**Temas de la ficha:** se quedan los cinco. «Elementos y teoremas de tangencia» va en las ideas 1 y 2; «Teoremas de
Poncelet y Pitot», en la 2; los ángulos, en la 4 y la 5.

**Qué no entra (y dónde va):**
- Teorema de la tangente, de las cuerdas y de las secantes (PT² = PA · PB): Relaciones métricas (dos preguntas de San
  Marcos).
- Longitud de la circunferencia, arcos en centímetros, sectores, áreas y π: Longitud y áreas circulares.
- Incentro, circuncentro, circunferencia de Euler y las bisectrices con 37°/2 y 53°/2: Puntos notables. Aquí la
  circunferencia inscrita es solo la que toca los lados; dónde queda su centro no se pide.
- Semejanza, Thales y la potencia de un punto: Proporcionalidad y semejanza, y Relaciones métricas.
- Pitágoras como teorema: Relaciones métricas; aquí es un dato, con los ternos 3-4-5, 5-12-13, 8-15-17 y 7-24-25.
- Polígonos regulares inscritos y su apotema: Polígonos regulares.

---

## 2. Objeto de la primera pantalla

| Idea | Objeto | Qué es cada cosa |
| --- | --- | --- |
| 1 | **El tanque de agua echado, visto de frente** (un tanque de 1 m de diámetro sobre el piso) | el borde = la circunferencia; la superficie del agua = una cuerda; el piso = una tangente |
| 2 | **La esquina de una bandeja con un plato que roza sus dos bordes** (en Predice y Mira, la bandeja entera) | los bordes = tangentes; donde el plato los roza = puntos de contacto |
| 3 | **Dos círculos de luz de dos linternas en el piso** | cada borde de luz = una circunferencia; los centros = donde apunta cada linterna |
| 4 | **La pileta redonda de la plaza, con dos faroles A y B en el borde y un fotógrafo P que camina por el borde** | faroles y fotógrafo = puntos de la circunferencia; lo que abarca su vista = el ángulo inscrito |
| 5 | **Una plaza redonda con dos veredas rectas que se cruzan en Q** | veredas = cuerdas; el cruce = el vértice del ángulo |
| 6 | **La pileta con cuatro faroles A, B, C y D unidos por un cordel** | faroles = vértices de un cuadrilátero inscrito |

Van en un bloque nuevo de `geo-objeto`, la escena `redondo` (tipos `tanque`, `bandeja`, `luces`, `pileta`, `veredas` y
`examen`), sobre una figura de `geo-figura`. Todos son dibujos de prueba (`data-prueba`) con su prueba numérica de encuadre
y de rótulos. El bloque es aditivo: no toca las escenas de las otras unidades; agrega como obstáculo de los rótulos el
contorno de cada circunferencia (hasta hoy, `geo-objeto` solo esquivaba trazos rectos).

---

## 3. Misión de «Juega» (meta que el motor comprueba)

| Idea | Contexto + misión | Controles | `logrado` | Lectura (una relación) |
| --- | --- | --- | --- | --- |
| 1 | «El tanque de 1 m de diámetro está echado en el piso, con agua adentro.» **Sube el agua hasta que su superficie mida 80 cm.** | `h`, la altura del agua (5 a 50 cm, de 5 en 5; empieza en 10) | `h === 20` | «AM = MB = 30 cm: el agua mide 60 cm de ancho» |
| 2 | «Un plato de 20 cm de diámetro roza los dos bordes de la esquina A de una bandeja.» **Mueve el plato hasta que el tramo AE mida 24 cm.** | `d` = OA (12 a 30 cm, de 2 en 2; empieza en 16) | `d === 26` | «AE = AH ≈ 12,5 cm» |
| 3 | «Dos linternas hacen círculos de luz de 40 cm y 20 cm de radio.» **Acerca las luces hasta que sus bordes se toquen por dentro.** | `d` (0 a 80 cm, de 10 en 10; empieza en 70) | `d === 20` | «d = 50 cm: los bordes se cortan en dos puntos» |
| 4 | «El fotógrafo camina por el borde de la pileta y mira los faroles A y B.» **Abre los faroles hasta que P los vea con 65°.** | `arco` (40° a 160°, de 10 en 10; empieza en 80°) y `fi` (dónde está P) | `arco === 130` | «arco AB = 80°: ∠APB = 40°, esté donde esté P» |
| 5 | «Dos veredas rectas cruzan la plaza redonda y se cortan en Q.» **Mueve las veredas hasta que el ángulo en Q mida 75°.** | `a` (60° a 160°) y `b` (20° a 100°), los dos arcos | `a + b === 150` | «arcos de 110° y 30°: ∠AQB = 70°» |
| 6 | «Cuatro faroles en el borde de la pileta, unidos por un cordel.» **Corre el farol A hasta que el ángulo en B mida 70°.** | `fi`, dónde está A | `m∠B === 70` | «m∠B = 80° y m∠D = 100°: suman 180°» |

Ninguna misión está cumplida al abrir; ninguna leyenda trae el número que solo sale con la misión cumplida. La de la idea 5
se cumple de varias maneras a propósito (cualquier par de arcos que sume 150°).

---

## 4. La predicción de cada idea

La app baraja las opciones; los `datos` traen valores, nunca la fórmula. Los errores con respaldo son GE12, GE15 y GE16 del
informe; los demás son hipótesis (GE-CIR, GE-TAN, GE-PIT, GE-POS, GE-INS, GE-ANG, GE-CIC), anotados en el informe.

**Idea 1.** «Con el agua a 20 cm de alto, su superficie mide 80 cm. Si el agua sube hasta 80 cm de alto, ¿cuánto mide la
superficie?» Datos: el tanque mide 100 cm de diámetro; con el agua a 20 cm, la superficie queda 30 cm debajo del centro. La
figura: el tanque con el agua a 20 cm («80 cm») y una marca de 80 cm de alto en la regla del costado, sin cuerda.

| Opción | Qué mide |
| --- | --- |
| 80 cm | Correcta: a 80 cm la superficie queda 30 cm encima del centro, la misma distancia |
| 320 cm | Cuatro veces más alto, cuatro veces más ancho (GE-CIR1, una proporción que no es) |
| 100 cm | Cree que pasada la mitad el agua toma todo el ancho, el diámetro (GE-CIR2) |
| 140 cm | Suma al ancho lo que subió el agua: 80 + 60 (GE-CIR3) |

**Idea 2.** «Ahora el plato roza los cuatro bordes de una bandeja ABCD. AB = 38 cm, BC = 32 cm y CD = 30 cm. ¿Cuánto mide
DA?» (El dibujo no está a escala.) Datos: el plato roza cada borde en un solo punto.

| Opción | Qué mide |
| --- | --- |
| 36 cm | Correcta: AB + CD = BC + DA |
| 32 cm | Lo trata como paralelogramo: copia el lado de enfrente, BC (GE-PIT2) |
| 40 cm | Empareja vecinos en vez de opuestos: AB + BC − CD (GE-PIT3) |
| Faltan datos: depende de la forma | No ve que las tangentes iguales alcanzan (GE-PIT1) |

**Idea 3.** «Otras dos linternas hacen círculos de 50 cm y 30 cm de radio. ¿Para qué distancias d entre los centros se
cortan sus bordes en dos puntos?» Datos: un radio mide 50 cm y el otro, 30 cm.

| Opción | Qué mide |
| --- | --- |
| Más de 20 cm y menos de 80 cm | Correcta |
| Cualquier d menor que 80 cm | Ve el límite de afuera y no el de adentro (GE-POS1) |
| Entre 30 cm y 50 cm | Toma los radios como límites (GE-POS2) |
| De 20 cm a 80 cm, con los dos incluidos | En 20 y en 80 se tocan en un solo punto (GE-POS3) |

**Idea 4.** «El fotógrafo llega al farol A. Ahí su vista va por la tangente en A y por la cuerda AB. Si el arco AB mide
100°, ¿cuánto mide el ángulo entre la tangente y la cuerda?» Datos: el arco AB mide 100°.

| Opción | Qué mide |
| --- | --- |
| 50° | Correcta: el semiinscrito también mide la mitad de su arco |
| 100° | Lo iguala al central (GE15) |
| 90°, por ser tangente | Lleva el ángulo recto del radio a la cuerda (GE-INS1) |
| 0°: el ángulo desaparece | Cree que sin el segundo lado no queda ángulo (GE12) |

**Idea 5.** «Ahora las dos veredas se juntan en Q, fuera de la plaza. Entre ellas quedan dos arcos: el lejano mide 110° y el
cercano, 30°. ¿Cuánto mide el ángulo en Q?» Datos: arco lejano 110°; arco cercano 30°.

| Opción | Qué mide |
| --- | --- |
| 40° | Correcta: (110° − 30°) ÷ 2 |
| 70° | Usa la semisuma, la de adentro (GE16) |
| 80° | Resta y no divide entre 2 (GE16) |
| 55° | La mitad del arco lejano, como un inscrito (GE15) |

**Idea 6.** «Ahora el farol D se mete dentro de la pileta, sin tocar el borde. ¿Cuánto suman los ángulos B y D?»

| Opción | Qué mide |
| --- | --- |
| Más de 180° | Correcta: con D dentro, el ángulo en D se abre |
| 180°, como antes | Lleva la regla a un cuadrilátero que ya no es inscrito (GE-CIC2) |
| Menos de 180° | Lo que pasa con D fuera (GE-CIC3) |

---

## 5. Tabla de letras y símbolos

| Letra | Un solo significado en la unidad | Aviso |
| --- | --- | --- |
| O | El centro de la circunferencia (O₁ y O₂, de dos circunferencias) | — |
| r | El radio; r₁ y r₂, los de dos circunferencias (r₁ el mayor) | — |
| d | La distancia entre los centros de dos circunferencias | Solo en la idea 3; en la idea 1 la distancia del centro a la cuerda es OM |
| h | La altura del agua en el tanque (la flecha de la cuerda) | Solo en la idea 1 |
| a, b, c | Los catetos y la hipotenusa del triángulo rectángulo de Poncelet | Solo en la idea 2 |
| x | Lo que se pide, un número | Sin «°»: m∠A = 3x + 10°, x = 20 |
| k | Lo que mide una parte en una razón (arco mayor = k veces el ángulo) | — |
| A, B, C, D, P, Q | Puntos de la figura; P y Q, vértices de ángulos (P en la circunferencia o fuera; Q, cruce de dos rectas) | Chocan con las alternativas A–E: ningún resuelto nombra una alternativa por su letra |
| M | El pie de la perpendicular desde O a una cuerda (su punto medio) | — |
| T, S, E, F, G, H | Puntos de contacto de tangentes | — |
| arco AB | La medida del arco entre A y B que no contiene al otro punto nombrado; con tres letras (arco ACB) si hace falta | En grados, como su ángulo central |
| m∠APB | La medida de un ángulo, como en Triángulos | — |
| ⟂, ∥, △ | Perpendicular, paralela, triángulo | Ya definidos |

La tabla va en el campo `letras` de la unidad (`r`, `d`, `h`, `a`, `b`, `c`, `x`, `k`).

---

## 6. Mapa de colores (§5b y las reglas del curso)

Las reglas del curso: ángulos dados en carmín (1, 2 o 3 arcos cuando hay parejas); lados dados naranja y turquesa; lo
pedido con «?» en tinta; el violeta solo en el texto del resuelto y en la respuesta; sin verde; marcas de igualdad sobre una
llave. Esta unidad agrega los **arcos**: el arco que abarca el ángulo (o el mayor, o el lejano) en naranja; el segundo arco
(el menor, o el cercano) en turquesa. Un arco es un dato como un lado, no un ángulo: va en el color de dato.

| Idea | Carmín | Turquesa | Naranja | Tinta | Violeta |
| --- | --- | --- | --- | --- | --- |
| 1 | — | el radio (OA, OB, OT) | la cuerda (la superficie del agua) | OM, el piso (tangente), h | la respuesta |
| 2 | — | BC y DA; el cateto b | AB y CD; el cateto a; los tramos de la esquina A | la hipotenusa c, r, los puntos de contacto | la respuesta |
| 3 | — | el círculo chico, r₂ | el círculo grande, r₁ | d | la respuesta |
| 4 | los ángulos dados (inscrito, central, semiinscrito) | el segundo arco | el arco que abarca | radios, cuerdas, la tangente | la respuesta |
| 5 | los ángulos dados | el arco cercano o menor | el arco lejano o mayor | cuerdas, secantes, tangentes | la respuesta |
| 6 | m∠B (1 arco) y m∠D (2 arcos), los dados | el arco de m∠D (en Mira) | el arco de m∠B (en Mira) | el cordel (los lados) | la respuesta |

La prueba de la unidad comprueba la regla en todas las figuras (sin violeta ni verde en ninguna; «?» en tinta).

---

## 7. Práctica y datos del mundo

### 7a. Qué existe y qué falta

- **La escena `angulo-inscrito`** (borrador 0.1.0, «¿Cambia el ángulo?»): sin `datos`, con verde; también sirve a Longitud y
  áreas circulares. Va a «Más mesas del tema» solo en esta unidad (`"rehacer": ["geometria.circunferencia"]`) y su papel
  dice de qué unidad es cada problema (`unidades`: p1 a p8 de esta, p9 y p10 de Longitud y áreas circulares).
- **`geo-circunferencia-metrica`** (generador compartido con Relaciones métricas): sus tipos de esta unidad no traen `datos`
  y su tipo `tangente` es el teorema de la tangente, de Relaciones métricas. **Al escribir se dejó como estaba** (en la
  ficha, en tercer lugar, y en `unidades`, con su fila de `nucleo/repaso-tipos.js`): si sale de esta unidad, sus tipos de
  Pitot, Poncelet e inscriptible pasarían a la práctica y al repaso de Relaciones métricas sin ser de ella. Se decide al
  rehacer Relaciones métricas (decisión chica 1).
- **Plantilla nueva `geo-circunferencia`** (formato `predicciones`, sin figura, como `geo-poligonos-cuadrilateros`): tipos
  por idea (`TIPOS_POR_IDEA`), `datos` por línea con prueba en 400 semillas, `casos.json` verificado aparte y papel de 8
  problemas (las seis ideas).
- **Mesas:** las tres de antes conservan su `id` y pasan a los colores del curso: `dos-libres` (idea 3, dos radios libres),
  `inscrito-libre` (idea 4, el arco y P sueltos, también dentro y fuera) y `cuadrilatero-libre` (idea 6, D dentro, sobre o
  fuera).
- **Prueba del curso:** las formas ya tienen 10 pares (geo-08 es de esta unidad); dos ítems nuevos a la reserva: ci-01
  (Pitot en una bandeja) y ci-02 (el ángulo entre dos tangentes), con su verificador.

### 7b. Datos del mundo

La unidad casi no los necesita: tanques, bandejas, linternas, piletas y plazas con medidas de problema, posibles (punto 10):
un tanque de 1 m de diámetro, un plato de 20 cm, círculos de luz de 20 a 50 cm de radio, una plaza de unos 30 m de radio.
Pitágoras va como dato con ternos enteros; el 37° y 53° va con «(convención del examen)», como en Congruencia. La historia
de los Elementos III.20 ya trae fuente (edición de D. E. Joyce).

---

## 8. Riesgos de orden con otras unidades (`requiere`)

**Lo que la unidad da por sabido:** de Triángulos, la suma de 180°, el ángulo exterior, el isósceles (la altura desde el
vértice es mediana); de Congruencia, LLL y LAL, la mediatriz, la hipotenusa y Pitágoras como dato, los notables; de
Polígonos, la suma de 360° del cuadrilátero, el cuadrado, el trapecio isósceles y la semisuma; de Segmentos, la recta
secante, el suplemento y despejar x. **Cambio en la ficha:** `requiere` pasa de `geometria.triangulos` a
`geometria.poligonos-y-cuadrilateros` (que ya pide Congruencia y Triángulos).

**Lo que hay que rehacer para no usar lo que viene después:**

| Hoy | Problema | Cómo queda |
| --- | --- | --- |
| «Poncelet», «Pitot» en «Lee» con su enunciado | Lee adelantaba la regla | Lee cuenta el plato y la bandeja; los nombres llegan en la regla |
| Glosario con las medidas («mide la mitad») | Delata las predicciones de las ideas 4 y 3 | Definiciones de qué es cada cosa, sin su medida |
| Circunscrita (Puntos notables) | Se usaba para triángulos | Solo «polígono circunscrito» (sus lados tocan la circunferencia) |

**Lo que no hay que adelantar:** Relaciones métricas (Pitágoras solo como dato; nada de PT² = PA · PB), Longitud y áreas
circulares (ningún π, longitud ni área), Puntos notables (ni incentro ni circuncentro), Proporcionalidad (ninguna
semejanza).

**Lo que otras unidades toman de aquí:** Puntos notables (circunferencia inscrita, tangentes iguales), Polígonos regulares
(ángulo central), Longitud y áreas circulares (arco en grados, ángulo central), Relaciones métricas (cuerda, secante,
tangente), Proporcionalidad (cuadrilátero inscrito en la semejanza de cuerdas).

---

## 9. Decisiones tomadas (Gerson revisa después)

1. **Seis ideas con los seis `id` de hoy, reordenadas; la unidad no se parte.** La cuerda entra a la idea 1 con la tangente,
   y las tangentes iguales pasan a la idea de Pitot y Poncelet, que sube al segundo lugar. Motivo: las propiedades de la
   cuerda son lo primero del tema en las academias (11 fichas del Cuzcano y la base del isósceles de 2019-I), y la tangente es
   su caso límite: la cuerda que se aleja del centro hasta un punto. *Descartado:* una séptima idea «Radio y cuerda» con
   `septimaIdea` (la tangente sola quedaba corta) y partir la unidad (cambia los `requiere` de cuatro unidades).
2. **Cinco ideas cambian su Predice y conservan su `id`:** la unidad va a `REHECHAS_E6` en `nucleo/avance.js` (marca
   `prediccionCI`). No suma ideas: nadie pierde «Ya la estudié».
3. **`requiere` pasa a `geometria.poligonos-y-cuadrilateros`.** Motivo: punto 9; la idea 6 usa la suma de 360° y el nivel
   examen usa el cuadrado y el trapecio isósceles; la idea 1, la mediatriz de Congruencia.
4. **«Circunferencia», «radio» y «diámetro» se mudan aquí desde Congruencia** (pendiente de la Etapa 5). Congruencia los
   sigue usando y el lector los marca «se explica en Circunferencia». *Descartado:* dejarlos allá (dos definiciones por
   curso cuando esta unidad los estrena).
5. **Los arcos en el color de dato:** el que abarca el ángulo (o el mayor, o el lejano) naranja; el otro, turquesa. El
   carmín queda para los ángulos y la `d` entre centros va en tinta (es un largo). *Descartado:* arcos en carmín (un arco y su
   ángulo en el mismo color se confundían, y en la idea 5 hay dos arcos y un ángulo).
6. **Glosario sin medidas:** cada término dice qué es, no cuánto mide (el central, el inscrito, el semiinscrito, el
   cuadrilátero inscrito, las tangentes exteriores). Motivo: regla 4 de la Etapa 5; las medidas son la regla de su idea.
7. **«Pitot» y «Poncelet» no van al glosario:** son nombres de la regla de la idea 2, y su definición sería la respuesta de
   la predicción. Se nombran en «La regla» y en los datos de los ejercicios que los usan.
8. **Teorema de la tangente fuera** (dos preguntas de San Marcos): es «Cuerdas, secantes y tangente» de Relaciones
   métricas. Por eso esta unidad deja `geo-circunferencia-metrica`.
9. **Pitágoras como dato** con ternos enteros (3-4-5, 5-12-13, 8-15-17, 7-24-25 y sus múltiplos), como en Congruencia; nada
   de raíces en las respuestas de la idea 1.
10. **Figuras de ejercicio con un ángulo pedido: sin escala**, con «El dibujo no está a escala.» y el ángulo pedido
    dibujado a 8° o más de la respuesta (lección M2 de Congruencia); las de largos, sin escala si lo pedido se puede medir.
11. **Notación:** «arco AB» en palabras (sin el arquito de las academias, que la app no dibuja), m∠APB, x sin «°», O el centro,
    M el pie de la perpendicular, r₁ ≥ r₂.
12. **Escena `redondo` nueva en `geo-objeto`** (bloque propio, aditivo): agrega el contorno de las circunferencias como
    obstáculo de los rótulos solo en sus escenas; las de las otras unidades no cambian.
13. **Práctica nueva `geo-circunferencia`** (sin figura); `angulo-inscrito` a «Más mesas del tema» solo aquí, con `unidades`
    en su papel; `geo-circunferencia-metrica` sigue en la ficha hasta Relaciones métricas (decisión chica 1).
14. **Prueba del curso:** ci-01 y ci-02 a la reserva (las formas tienen 10 pares).
15. **Códigos:** GE12, GE15 y GE16 se quedan; GE-TAN, GE-POS, GE-PON y GE-CIC de hoy se renumeran en familias por idea
    (quedaron GE-CIR1 a GE-CIR12, GE-TAN1 a GE-TAN3, GE-PIT1 a GE-PIT13, GE-PON1 a GE-PON5, GE-POS1 a GE-POS13, GE-INS1 a
    GE-INS8, GE-ANG1 a GE-ANG7 y GE-CIC1 a GE-CIC10), todos hipótesis, anotados en el informe de geometría.

### Decisiones chicas al escribir (fases 2 a 5)

1. **`geo-circunferencia-metrica` no sale de la unidad** (cambia el punto 7a): `catalogo/catalogo.test.js` pide que una
   ficha liste toda plantilla que la cubre, y sacarla de `unidades` mandaba sus tipos de Pitot, Poncelet e inscriptible a la
   práctica y al repaso de Relaciones métricas. Queda tercera en la ficha, después de `geo-circunferencia` y
   `angulo-inscrito`, con su fila mixta del repaso.
2. **Misión de la idea 1: solo h = 20.** El agua llega hasta 50 cm en el control, así que de las dos alturas con 80 cm de
   superficie (20 y 80) solo vale una. En «Predice» y «Mira» no va la marca de 90 cm ni la opción de la regla; el «50 cm» del
   radio va sobre un radio propio, OR, con su llave (junto a OA, en el triángulo, podía leerse como OM).
3. **Sin rótulo en el semiinscrito:** su abertura, entre la cuerda y el arco, no deja lugar; lo dicen el texto y la
   ecuación. Los círculos de luz van sin el rótulo de su radio (lo dice el texto) y las figuras del ángulo exterior van sin
   escala.
4. **Letras que se corren para no tocar un trazo** (las halló la revisión estricta de `geo-objeto.test.js`): con el agua
   baja, A y B van de costado (abajo tocaban el piso) y M cambia de lado según la altura; con la segunda cuerda, O va a la
   derecha; en la plaza, Q va en el sector más ancho sin arco; en la pileta, O busca el lado sin cuerdas del fotógrafo. En la
   pieza (bloque `redondo`): la letra de un farol va 4 px más lejos, el fotógrafo 4 px más de costado y las rayas del piso
   empiezan 1 px más adentro. Queda una sola excepción: en la mesa libre del fotógrafo, con P pegado a un farol, sus letras
   se tocan (se arrastra a cualquier lugar).
5. **Práctica:** el inscrito y el semiinscrito también abarcan arcos de más de 180° (sin el de 180°), para que la
   correcta no sea siempre la menor; tres errores nuevos para lo mismo: GE-PON5 (área entre perímetro), GE-PIT13 (la base
   menor como diámetro) y GE-ANG7 (la mitad del arco cercano). En «¿Se puede inscribir?», el caso del sí nunca trae 90° y 90°.
6. **`cuadrilatero-inscrito` conserva su Predice** (la misma pregunta, D dentro, y los mismos ids de opciones): no va en
   `cambian` de `REHECHAS_E6`. Las otras cinco sí.
7. **Prueba del curso:** ci-01 usa lados que el generador no da (más de 36 cm) y ci-02, arcos impares; ci-02 A no dice
   «tangentes» ni «arco cercano», para no repetir el texto del generador.
8. **Glosario:** «ángulo interior» queda en `glosarioSin` (Polígonos ya lo define con otro sentido); las formas sueltas
   «cercano», «inscrito» y «central» no se marcan (tocaban palabras que no eran el término).
