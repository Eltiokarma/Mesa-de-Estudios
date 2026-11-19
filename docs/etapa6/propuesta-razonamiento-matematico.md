# Propuesta de ideas: «Verdades y mentiras» (`razonamiento-matematico.verdades-y-mentiras`)

19 nov 2026 · Etapa 6 del plan de calidad, rama «Lógica» de razonamiento matemático (tercera unidad, después de
Razonamiento deductivo y Ordenamiento de información, las dos con `calidad: 2`) · encargo con criterio delegado
(`docs/metodo/unidad/etapa-delegada.md`). Gerson delegó el criterio: esta propuesta ya está aplicada en la unidad (sin
`calidad: 2`). Las dudas van al final, en «Decisiones tomadas (Gerson revisa después)», con lo elegido, el motivo y lo
descartado. **No hay ningún conflicto crítico.**

Leído: `CLAUDE.md`, `docs/plan-calidad.md` §3, `docs/molde-unidad.md`, `docs/metodo/unidad/` (LEEME, 1, 2, 3,
reglas-validador, etapa-delegada), las decisiones de las etapas 2 a 5, la propuesta modelo
(`docs/etapa5/propuesta-razonamiento-matematico.md`), las dos unidades anteriores de la rama con sus auditorías
(`rutinas/auditoria/`) y sus lectores en frío (`rutinas/frio/`), la teoría actual de esta unidad (v0.2.0), su ficha en
`catalogo/cursos/razonamiento-matematico.json`, la escena `orden-informacion` (motor `verdades` e `hipotesis`, papel p7 y
p8), `docs/investigacion/codigos-rm-procesos.md`, `docs/clasificacion/trampas-admision-unmsm/rm-a.md`, la matriz
`docs/teoria/matriz/razonamiento-matematico.json` (unidad 4), `docs/temario-completo.md` §4, la prueba del curso y las 26
preguntas de San Marcos de esta unidad en `docs/datos/admision-unmsm.csv`. La unidad siguiente, Certezas, no recibe nada
adelantado (§9). Las cuentas de §3 y §4 se rehicieron aparte (scratchpad `e6-rm/propuesta.py` y `e6-rm/podio.py`, fuerza
bruta sobre todas las suposiciones).

**Ojo:** la unidad entra solo en San Marcos (tema 4). No hay datos de la UNI ni de la UNA Puno, ni literatura de ideas
erróneas de estos acertijos: todos los distractores de abajo son hipótesis que salen de las trampas anotadas en la
clasificación y en los solucionarios (§4 y §7).

## Qué se pregunta en San Marcos (2019-I a 2027-I)

26 preguntas clasificadas en esta unidad. **La mitad son un culpable (o un monto) con «solo uno miente» o «solo uno dice
la verdad»**, y la trampa que más se anota es «no partir de las dos afirmaciones que se contradicen» (6 preguntas).

| Qué piden | Cuántas | Periodos (pregunta) | Trampa anotada | Idea |
| --- | --- | --- | --- | --- |
| Culpable, ganador o monto con «solo uno miente» (o «dos mienten»): usar el par que se contradice | 8 | 2019-I (40), 2020-I (24, 26), 2021 (21), 2021 (27), 2022 (24), 2024-I (16), 2025-II (21), 2026-II (25) | no partir del par contradictorio | 3 |
| Lo mismo con «solo uno dice la verdad» | 3 | 2021 (21, del 12 sep), 2024-I (25), 2024-II (16) | ídem | 4 |
| Cajas con rótulos, uno solo falso | 1 | 2026-II (22) | — | 4 (nivel examen) |
| Veraces y mentirosos que hablan de cuántos mienten | 2 | 2024-II (19), 2026-I (29) | «suponer que todos mienten sin ver que alguno debe ser veraz»; «olvidar que el mentiroso miente en ambas afirmaciones» | 6 |
| Cada uno dice una verdad y una mentira (o dos verdades y una mentira) | 5 | 2019-II (22), 2022 (22), 2023-I (21), 2026-I (25, 22) | — | 5 |
| Negar lo que dice quien siempre miente (desigualdades de edad o sueldo) | 2 | 2023-II (17, 29) | negar «más de» como «menos de» y no como «a lo más» | 2 |
| Tabla de respuestas V/F con aciertos | 2 | 2025-I (21), 2027-I (26) | no usar las dos filas opuestas | 3 (nivel examen) |
| Mentirosos según el día de la semana | 2 | 2023-I (28), 2027-I (24) | responder el día del encuentro y no el siguiente | fuera (ver decisión 7) |

Banco Cuzcano: unas 5 fichas. La prueba de entrada y salida del curso no tiene ningún ítem de esta unidad.

---

## 0. Diagnóstico de la teoría actual contra el contrato

Tres ideas (`suposicion`, `contradictorias`, `negar-bien`), tres mesas de laboratorio y un glosario de 10 términos. La
base sirve: «Ahora tú» sale de contar suposiciones, y el culpable con «solo uno miente» ya está.

1. **Punto 1:** ninguna primera pantalla tiene un objeto: son tablas (`rm-tablero`). La isla y el examen bimestral solo
   están escritos.
2. **Puntos 2, 3 y 12:** sin `mision`, `leyenda`, `aprendizaje`, `actividad` ni `pregunta`; el glosario sin `simple` ni
   tres ejemplos; no declara `calidad: 2`.
3. **§5b, colores:** veraz en **verde** y mentiroso en **carmín**, con el choque en naranja: carmín junto a verde (0,038 con
   deuteranopía) y verde junto a naranja (0,010 con protanopía), los dos pares que el molde prohíbe. La paleta de la rama
   (decisión del 17 nov) no se usa.
4. **Punto 13:** ningún ejercicio trae `datos`; las frases van todas en el enunciado. No hay ejemplos resueltos (0 de 45).
5. **Punto 7:** «Coherente: esta suposición se queda» no dice por qué; «1 falsa: no encaja» tampoco dice con qué.
6. **«Ahora tú» no llega al examen:** tres personas con frases cortas; nada de «solo uno dice la verdad», de «una verdad y
   una mentira» ni de «cuántos mienten» (10 de las 26 preguntas). Las explicaciones de los distractores son genéricas
   («al menos una frase no encaja»).
7. **«Así se resuelve» es el mismo generador que «Ahora tú»** con la semilla + 900 (repite el tipo y el dibujo).
8. **Notación:** «p» y «no p» en la regla sin decir qué son; el «⇔» de la regla 1 es de otro curso; «·» separa dos
   igualdades.
9. **Códigos RMT-VYM-1 a 7** sin informe. La cabecera dice «postulante de 3.º a 5.º».
10. **Práctica:** la unidad no tiene generador; solo la escena vieja, con dos problemas de papel (p7, p8) sin datos.

---

## 1. Las ideas, en orden

**Seis** (el tope). Las tres de hoy conservan su `id`; se agregan `solo-uno-veraz`, `verdad-y-mentira` y
`cuantos-mienten`. El orden cambia: negar va segunda, porque las ideas 3 y 4 la usan.

| # | `id` | Título (≤ 6) | `aprendizaje` (≤ 25 palabras) |
| --- | --- | --- | --- |
| 1 | `suposicion` | Suponer y comprobar | Se supone la tarjeta de cada uno y se revisa cada frase: el veraz dice algo cierto y el mentiroso algo falso; lo que choca se descarta. |
| 2 | `negar-bien` | Lo contrario de «todos» | Lo contrario de «todos cumplen» es «al menos uno no cumple», no «ninguno»; lo contrario de «más de 5» es «5 o menos». |
| 3 | `contradictorias` | Dos frases que se contradicen | En un par que se contradice, una frase es cierta y la otra falsa; si solo uno miente, está en ese par y los demás dicen la verdad. |
| 4 | `solo-uno-veraz` (nueva) | Cuando solo uno dice la verdad | Si solo uno dice la verdad y dos frases se contradicen, el veraz está en el par: los demás mienten, y lo contrario de lo que dicen es cierto. |
| 5 | `verdad-y-mentira` (nueva) | Una verdad y una mentira | Si cada uno dice una verdad y una mentira, sus dos frases no valen lo mismo: se supone cierta una y la otra queda falsa. |
| 6 | `cuantos-mienten` (nueva) | ¿Cuántos mienten? | Se supone cuántos mienten: las frases ciertas deben ser justo las de los veraces. Quienes dicen lo mismo tienen la misma tarjeta. |

`pregunta` de cada idea, para el Resumen: 1. «¿Cómo se sabe quién miente si todos hablan?» · 2. «¿Qué es lo contrario
de “todos aprobaron”?» · 3. «¿Qué tienen de especial dos frases que se contradicen?» · 4. «¿Qué cambia si solo uno dice
la verdad?» · 5. «¿Qué se sabe de alguien que dice una verdad y una mentira?» · 6. «¿Qué pasa si una frase habla de
cuántos mienten?»

**Por qué cada una va ahí y qué da por sabido**

1. **Suponer y comprobar.** El paso más corto desde la unidad anterior: allá se probaba cada lugar; aquí se prueba cada
   tarjeta. Estrena «suposición» y «choque» (Ordenamiento evitó las dos a propósito). «Seguro: lo que vale en todos los
   casos que quedan» viene de Razonamiento deductivo (`requiere`).
2. **Lo contrario de «todos».** Para usar la frase de un mentiroso hay que negarla bien. Sin esto, las ideas 3 y 4
   («lo contrario de lo que dice es cierto») no se pueden hacer. Necesita «siempre miente» (idea 1).
3. **Dos frases que se contradicen.** El culpable con «solo uno miente», lo más preguntado. Una frase y su negación (idea
   2) forman el par; «Fue Ana» y «Fue Beto» no lo forman (puede haber sido otro).
4. **Cuando solo uno dice la verdad.** El mismo par, con la condición al revés: el veraz está en el par y los demás
   mienten. Se usa la negación de la idea 2 en cada frase de fuera.
5. **Una verdad y una mentira.** Ya no hay veraces ni mentirosos: cada uno dice una frase cierta y una falsa. Lo nuevo
   es suponer una frase (no una persona). Usa el choque de la idea 1 y el podio de la carrera, que el alumno conoce de
   Ordenamiento.
6. **¿Cuántos mienten?** La frase habla de los mismos que hablan: el caso más difícil. Va al final porque necesita
   suponer (idea 1), «al menos» (idea 2) y contar quiénes dicen la verdad.

**Qué no entra:** el cuadro de doble entrada (Razonamiento deductivo; aquí solo se usa en un ejemplo de nivel examen),
el orden de personas (Ordenamiento), el peor caso y las extracciones (Certezas), los mentirosos según el día de la
semana (decisión 7) y la tabla de verdad con p y q (Lógica proposicional, en Aritmética).

---

## 2. Objeto de la primera pantalla

Pieza nueva `rm-veraz`, dibujada por la sesión como prueba (`data-prueba`), con su prueba numérica de encuadre y
rótulos. Cada escena va arriba y la tabla de suposiciones abajo, pegada al objeto. Sigue el colegio del campeonato del
aniversario, que el alumno ya conoce de las dos unidades anteriores.

| Idea | Objeto | Qué es qué |
| --- | --- | --- |
| 1 | **El juego de las tarjetas** en la hora de tutoría: cada uno tiene a sus pies una tarjeta boca abajo, VERAZ o MIENTE, y un globo con lo que dice | voltear la tarjeta es suponer; la tabla dice si su frase encaja |
| 2 | **La lista de notas del simulacro**, pegada en el mural: cuatro nombres con «aprobó» o «no aprobó» | cada caso de la lista hace ciertas o falsas las frases «todos aprobaron» y «ninguno aprobó» |
| 3 | **El vidrio roto de la ventana del aula**, con la pelota en el piso y los cuatro sospechosos con su globo | se supone un culpable (con su marca) y se cuentan las frases falsas |
| 4 | **La pelota escondida en una de cuatro mochilas**, colgadas en la pared con su nombre | se supone la mochila y se cuentan las frases ciertas |
| 5 | **El podio de la carrera del aniversario**, con tres escalones y tres atletas que dicen dos frases cada uno | cada orden del podio hace cierta o falsa cada frase; cada atleta debe tener una de cada |
| 6 | **La última ronda del juego de las tarjetas**: cuatro dicen cuántos mienten en la ronda | se supone cuántos mienten y se mira si las frases ciertas son de los que no mienten |

---

## 3. Misión de «Juega» (meta que el motor comprueba)

| Idea | Contexto + misión | Controles | `logrado` | Lectura en vivo (enuncia una relación) |
| --- | --- | --- | --- | --- |
| 1 | Ana: «Beto miente». Beto: «Los dos mentimos». **Voltea las dos tarjetas hasta que ninguna frase choque.** | tarjeta de Ana y de Beto (Veraz o Miente; se tocan en la figura) | Ana veraz, Beto miente | «Ana es veraz, pero su frase sale falsa: choca» · «Las dos frases encajan con sus tarjetas» |
| 2 | Cuatro alumnos en la lista. **Haz que «Todos aprobaron» y «Ninguno aprobó» sean falsas a la vez.** | cuántos aprobaron, de 0 a 4 (arrastrar el borde) | de 1 a 3 | n = 4: «“Todos” es cierta y “ninguno”, falsa» · n = 2: «Las dos frases son falsas a la vez» |
| 3 | Uno rompió el vidrio y solo uno miente. Ana: «Fue Beto». Beto: «Fue Dina». Ciro: «Yo no fui». Dina: «Beto miente». **Supón culpables hasta que quede una sola frase falsa.** | «Supón que fue» (los cuatro; se toca la persona) | fue Beto | «Si fue Ana: 2 frases falsas; se pide 1» · «Si fue Beto: 1 frase falsa, como pide el dato» |
| 4 | La pelota está en una mochila y solo uno dice la verdad. Ana: «Está en la de Beto». Beto: «No está en la mía». Ciro: «Está en la mía». Dina: «No está en la mía». **Busca la mochila que deja una sola frase cierta.** | «Supón que está en la de» (se toca la mochila) | la de Dina | «En la de Ana: 2 frases ciertas; se pide 1» |
| 5 | Ana: «Llegué segunda» y «Beto llegó primero». Beto: «Llegué segundo» y «Ana llegó tercera». Ciro: «Llegué segundo» y «Beto llegó tercero». **Arma el podio en que cada uno dijo una verdad y una mentira.** | el orden del podio (6 órdenes) | Beto, Ciro, Ana | «Ciro: sus dos frases salen falsas: choca» |
| 6 | Ana: «Aquí miente exactamente uno». Beto: «… dos». Ciro: «… tres». Dina: «Aquí mentimos los cuatro». **Supón cuántos mienten hasta que todo encaje.** | cuántos mienten, de 0 a 4 | 3 | «Si mienten 2: solo una frase es cierta y harían falta 2» |

Cuentas rehechas aparte: idea 1, de 4 suposiciones encaja 1 (Ana veraz, Beto miente); idea 3, con Ana, Beto, Ciro y Dina
culpables quedan 2, 1, 3 y 2 frases falsas; idea 4, quedan 2, 2, 3 y 1 frases ciertas; idea 5, de 6 podios encaja 1
(Beto, Ciro, Ana); idea 6, solo con 3 mentirosos hay justo 1 frase cierta para 1 veraz. Ninguna misión está cumplida al
abrir.

---

## 4. La predicción de cada idea

Ninguna pregunta por lo que el juego ya mostró: cada una es otro caso. Los `datos` llevan las reglas del problema y las
frases, nunca la regla de la idea. La app baraja las opciones. **Todos los códigos son hipótesis** (§7).

**Idea 1.** «Otro día, Ciro mira su tarjeta y dice: “Yo digo la verdad”. ¿Qué se sabe de Ciro?»

| Opción | Código |
| --- | --- |
| **Nada: un veraz y un mentiroso dirían lo mismo** | correcta (las dos suposiciones encajan) |
| Que es veraz | RMP144 (creerle a una frase que cualquiera diría) |
| Que miente | RMP144 (desconfiar sin probar) |
| Nadie puede decir esa frase | RMP145 (confundirla con «Yo miento», que choca con las dos tarjetas) |

**Idea 2.** «Rosa siempre miente y dice: “Todos aprobaron el simulacro”. ¿Qué es seguro?»

| Opción | Código |
| --- | --- |
| **Al menos uno no aprobó** | correcta |
| Ninguno aprobó | RMP146 (negar «todos» con «ninguno») |
| Algunos aprobaron y otros no | RMP77 (posible, no seguro: también puede que nadie aprobara) |
| Nada: no se sabe quiénes | RMP78 |

**Idea 3.** Otro caso: alguien se comió el queque del compartir y solo uno miente. Eva: «Fue Gaby». Fito: «No fue Eva».
Gaby: «Eva miente». Hugo: «Fue Fito». «Sin probar culpables, ¿quiénes dicen la verdad con seguridad?» (las frases van
en los datos, una por línea).

| Opción | Código |
| --- | --- |
| **Fito y Hugo** | correcta (Eva y Gaby se contradicen: el que miente está entre ellas) |
| Eva y Gaby | RMP148 (tomar el par por los que dicen la verdad) |
| Gaby y Hugo | RMP148 (no ver el par: Gaby puede ser la que miente) |
| Nadie, sin probar cada culpable | RMP78 |

(Se comprueba: fue Fito y solo Eva miente; con los otros tres culpables quedan 3, 2 y 2 frases falsas.)

**Idea 4.** Otro recreo, solo uno dice la verdad. Eva: «Está en la de Fito». Fito: «No está en la mía». Gaby: «Está en
la de Hugo». Hugo: «No está en la de Gaby». «¿Dónde está la pelota?»

| Opción | Código |
| --- | --- |
| **En la mochila de Gaby** | correcta (Eva y Fito se contradicen: el veraz está ahí; Hugo miente, así que está en la de Gaby) |
| En la de Hugo | RMP149 (creerle a Gaby, que está fuera del par) |
| En la de Fito | RMP149 (creerle a Eva sin ver la condición) |
| No se sabe sin probar cada mochila | RMP78 |

(Se comprueba: con la pelota en la de Eva, Fito, Gaby y Hugo quedan 2, 2, 1 y 3 frases ciertas.)

**Idea 5.** «En otra carrera de cuatro, Dina dice: “Llegué segunda” y “Llegué tercera”. Una es verdad y la otra mentira.
¿Qué se sabe de Dina?»

| Opción | Código |
| --- | --- |
| **Llegó segunda o tercera** | correcta (no pueden ser ciertas las dos; si fueran falsas, no diría ninguna verdad) |
| Llegó segunda | RMP150 (creerle la primera frase) |
| Llegó primera o cuarta | RMP150 (negar las dos, como si siempre mintiera) |
| Nada: no se sabe cuál es la verdad | RMP78 |

**Idea 6.** «En otra ronda, tres amigos dicen lo mismo: “Aquí miente exactamente uno”. ¿Cuántos mienten?»

| Opción | Código |
| --- | --- |
| **Los tres** | correcta (si la frase fuera cierta, los tres serían veraces y no mentiría nadie) |
| Uno | RMP151 (creerle a la frase que se repite) |
| Ninguno | RMP144 (creer que si todos coinciden, todos dicen la verdad) |
| No se puede saber | RMP78 |

Ninguna figura de «Predice» delata la respuesta por su color: las tarjetas van boca abajo y lo pedido en tinta o con «?».

---

## 5. Tabla de letras y símbolos

| Símbolo | Un solo significado en la unidad | Aviso |
| --- | --- | --- |
| VERAZ, MIENTE (en la tarjeta) | La tarjeta que se supone | Se dice «veraz» y «mentiroso»; la tarjeta dice VERAZ o MIENTE |
| cierta, falsa | Lo que vale una frase en el caso supuesto | Nunca «verdadera» para no mezclar con «veraz» |
| ✗ choca | La frase no encaja con su tarjeta (o con la condición) | «Choque» lo estrena esta unidad (glosario, idea 1) |
| ✓ violeta, marco violeta | Lo seguro: la única suposición que encaja, el culpable, el lugar | Igual que en las dos unidades anteriores |
| raya gris | Suposición descartada | Igual que el orden tachado |
| A–E | Solo las alternativas de un ejemplo tipo examen | Las personas nunca se abrevian por su inicial |
| p, q, ⇔, «·» entre frases | **Se quitan** | De Lógica proposicional (otro curso); la regla dice «una frase y su contraria» |

`letras: {}`: la unidad no usa letras de fórmula. Nombres que no se confunden al leer: Ana, Beto, Ciro, Dina, Eva, Fito,
Gaby, Hugo (y en los ejemplos Rosa, Nora, Leo, Maru, Teo, Sara, Gino, Pía, Omar, Lucho, Vilma). Ningún par empieza con la
misma letra en un mismo problema. Sin «Iván» ni «Ilave» (la I mayúscula se lee como l).

---

## 6. Colores: la paleta de deducción de la rama

La misma tabla que Gerson aprobó para Razonamiento deductivo (17 nov), con el papel de cada color dicho para esta unidad.

| Token | Papel | En esta unidad |
| --- | --- | --- |
| tinta | lo que amarra | personas, frases, condiciones («solo uno miente»), la tabla, el objeto |
| `o` naranja | lo primero: lo que se supone | la tarjeta volteada, el culpable supuesto, la mochila supuesta, la frase supuesta cierta, el número supuesto de mentirosos |
| `i` turquesa | lo segundo: lo que sale de suponer | «cierta» o «falsa» de cada frase en ese caso |
| `f` violeta | lo seguro y lo pedido, ya comprobado | la única suposición que encaja, el culpable, el lugar, la respuesta |
| gris tenue y tachado | lo descartado | la suposición que choca |
| `h` carmín y `d` verde | **no se usan** | |

- Pares que quedan juntos (§5b): naranja–turquesa 0,114, naranja–violeta 0,189, turquesa–violeta 0,101. Desaparecen el
  carmín junto al verde y el verde junto al naranja de la versión de hoy.
- El choque se marca con forma (✗ y la palabra «choca»), no solo con color; lo descartado, con raya.
- La pieza fija los papeles (`PAPELES`) y la prueba de la unidad falla si aparece verde o carmín, o si una figura que se
  ve antes de responder trae violeta.

---

## 7. Práctica: qué existe y qué falta por idea

**Qué existe:** solo la escena `orden-informacion` (borrador), con su motor (`verdades`, `hipotesis`, `paresContradictorios`)
y dos problemas de papel de esta unidad (p7, p8, ya marcados con `unidades`). Ningún generador.

**Qué falta, por idea** (cada tipo con `datos` por línea, prueba en 400 semillas y papel con `unidades`, molde §7):
un generador nuevo `plantillas/rm-verdades/` (formato «predicciones», `TIPOS_POR_IDEA`), con fuerza bruta propia.

| Idea | Tipos | Distractores |
| --- | --- | --- |
| 1 Suponer | `tarjetas` (2 o 3 personas: ¿quiénes dicen la verdad?) · `tarjeta-de` (¿qué tarjeta tiene X?, con dos suposiciones en pie) | otra suposición, con la frase que la rompe (RMP72); RMP144; RMP78 |
| 2 Negar | `negar` (lo seguro cuando un mentiroso dice «todos», «ninguno», «los dos», «más de», «menos de») · `edad` (un mentiroso dice dos frases sobre su edad: ¿cuántos años tiene?) | RMP146, RMP147, RMP77, RMP78 |
| 3 Contradictorias | `culpable` (4 o 5 sospechosos, solo uno miente: ¿quién fue?) · `quien-miente` (¿quién miente?) | el del par que no es (RMP148), el acusado por el mentiroso (RMP72), RMP78 |
| 4 Solo uno veraz | `escondido` (¿en qué mochila está?) · `rotulos` (tres cajas, un solo rótulo cierto) | RMP149, RMP148, RMP78 |
| 5 Verdad y mentira | `podio` (3 atletas: ¿quién ganó?, ¿quién llegó último?) | RMP150 (creerle la primera o negar las dos), RMP72 |
| 6 Cuántos mienten | `cuantos` (cada uno da un número distinto) · `al-menos` (frases «por lo menos k mienten») | RMP151, RMP144, RMP78 |

Además: 15 ejemplos por idea (90), dos ítems para la prueba del curso (a la reserva: las formas ya tienen 10 pares),
verificados con el motor de `orden-informacion` en `catalogo/pruebas/verificar.js`, y la escena vieja en «Más mesas del
tema» (`"rehacer"` para esta unidad).

**Códigos.** Los RMT-VYM de la teoría de hoy se cambian por RMP: 1 y 5 → RMP72 · 2 → RMP78 · 3 → RMP148 · 4 → RMP78 ·
6 → RMP146 · 7 → RMP77. Códigos nuevos, todos hipótesis, anotados en `codigos-rm-procesos.md`:

| Código | Error | De dónde sale |
| --- | --- | --- |
| RMP144 | Creerle a una frase que cualquiera diría («Yo digo la verdad»), o creer que si todos coinciden todos dicen la verdad | matriz del curso («premiar intuiciones sobre las personalidades») |
| RMP145 | Confundir «Yo digo la verdad» con «Yo miento»: creer que ninguna frase sobre uno mismo se puede decir | nueva |
| RMP146 | Negar «todos» con «ninguno» (o «ninguno» con «todos»): cambiar una sola palabra | matriz («negar una proposición compuesta cambiando una sola palabra») |
| RMP147 | Negar «más de k» como «menos de k» y no como «k o menos» (lo mismo con «menos de») | rm-a #22 (2 preguntas) |
| RMP148 | No ver el par que se contradice, o tomar por contradictorias dos frases que solo son distintas («Fue Ana» y «Fue Beto») | trampa de 6 preguntas («no partir de las dos afirmaciones que se contradicen») |
| RMP149 | Con «solo uno dice la verdad», creerle a quien está fuera del par | ídem |
| RMP150 | Con «una verdad y una mentira», creerle las dos frases a alguien o negarle las dos | 2026-I (29): «olvidar…», al revés |
| RMP151 | Creerle a la frase sobre cuántos mienten sin contar a quien la dice | 2024-II (19): «suponer que todos mienten sin ver que alguno debe ser veraz» |

---

## 8. Datos del mundo

La unidad casi no los necesita: personas, frases, edades y montos son de problema y van sin fuente, pero deben ser
posibles.

| Dato | ¿Fuente? |
| --- | --- |
| Hora de tutoría, simulacro, compartir, recreo, carrera del aniversario | Situaciones de todos los días: sin fuente |
| Edades de escolares (14 a 18 años), montos de 10 a 100 soles | Valores de problema, creíbles para 5.º |
| Historia: Boole (1847 y 1854) | Ya trae fuente (Stanford Encyclopedia of Philosophy) y dice que las tablas de verdad llegaron después: se queda |

---

## 9. Riesgos de orden (`requiere`)

- `requiere: ['razonamiento-matematico.razonamiento-deductivo']` se queda y se usa: «seguro: vale en todos los casos que
  quedan» y el cuadro de doble entrada de un ejemplo de nivel examen. No se agrega Ordenamiento (está en la misma rama,
  antes; el podio se explica entero aquí).
- **Certezas, la que sigue, no recibe nada adelantado:** aquí no hay extracciones, peor caso ni «con seguridad hay que
  sacar…». «Al menos uno» se define como negación de «todos» (idea 2), sin conteos de extracción.
- Dentro de la unidad: la idea 3 usa la negación de la idea 2; la 4, el par de la 3; la 5, el choque de la 1; la 6,
  «por lo menos» de la 2. Ninguna idea usa algo que llega después.
- Temas del catálogo, sin agregar ninguno: «Personajes que siempre mienten o dicen la verdad» (ideas 1, 2 y 6), «Método de
  suposición» (ideas 1, 5 y 6) y «Afirmaciones contradictorias» (ideas 3 y 4).

---

## 10. Decisiones tomadas (Gerson revisa después)

1. **Seis ideas, tres nuevas.** Elegido: suponer, negar, par contradictorio, solo uno veraz, una verdad y una mentira,
   cuántos mienten. Motivo: 10 de las 26 preguntas («solo uno dice la verdad», «una verdad y una mentira», «cuántos
   mienten») no tenían idea. Descartado: tres ideas con todo eso en «Ahora tú» (quedaría con seis destrezas cada una).
2. **Negar va en el segundo lugar** (antes era la tercera). Motivo: las ideas 3 y 4 usan «lo contrario de lo que dice»;
   sin la negación primero, el par contradictorio se explica con algo que llega después. Descartado: dejarla al final.
3. **«Solo uno miente» y «solo uno dice la verdad» van en dos ideas.** Motivo: son 11 preguntas y el par se usa al revés
   (el mentiroso o el veraz está en el par). Descartado: una idea con las dos condiciones, que obliga a la regla a decir
   dos cosas opuestas a la vez.
4. **Colores por papel de la rama:** naranja lo supuesto, turquesa lo que sale, violeta lo seguro, gris lo descartado.
   Sale el verde del veraz y el carmín del mentiroso. Descartado: un color por tipo de persona (veraz y mentiroso), que
   delataría la respuesta en cada figura.
5. **La tarjeta boca abajo como objeto** (VERAZ o MIENTE): suponer es voltear. Descartado: la isla de los caballeros y
   los bribones, que no se reconoce y no es de aquí.
6. **«Cierta» y «falsa» para las frases; «veraz» y «mentiroso» para las personas.** Motivo: no mezclar las dos capas
   (quién habla y qué vale lo que dice), que es la idea central de la matriz. Descartado: «verdadera».
7. **Los mentirosos según el día de la semana quedan fuera** (2 preguntas). Motivo: piden contar días («ayer», «mañana»)
   y ya los practica `rm-relojes` (RMP49) en Cronometría y calendarios. Descartado: una séptima idea.
8. **La tabla de respuestas V/F y las cajas con rótulos van como nivel examen** de las ideas 3 y 4, no como ideas
   propias (3 preguntas entre las dos). Motivo: se resuelven con el mismo par.
9. **Práctica en un generador nuevo, `rm-verdades`,** con fuerza bruta propia; la escena vieja pasa a «Más mesas del
   tema». Descartado: sumar tipos a la escena vieja, que es de cuatro unidades.
10. **Glosario:** se quedan veraz, mentiroso, suposición, choque, frases contradictorias, negación y al menos uno; salen
    «coherente» (se dice «encaja»), «tabla de verdad» (es de Lógica proposicional) y «condición» (no la estrena ninguna
    idea). Entran a lo más, culpable, exactamente uno, del mismo tipo y otros, cada uno con `simple` y tres ejemplos.
11. **Ficha:** `grado: 3` queda como dato informativo (decisión del 17 nov); la cabecera pasa a «5.º y
    preuniversitario». La historia de Boole se queda.
12. **Prueba del curso:** dos ítems nuevos (rm-22, culpable con solo uno miente; rm-23, mochila con solo uno veraz) a la
    reserva.

---

## 11. Fases 2 a 5 (19 nov): lo que cambió al escribir

Decisiones tomadas al escribir (Gerson revisa después), además de las de §10:

1. **Pieza nueva `rm-veraz`** (escenas tarjetas, ventana, mochilas y cajas, mural y podio, y la lista de suposiciones),
   con su prueba numérica de encuadre y rótulos y los papeles de color fijos (`PAPELES`). La tabla vieja (`rm-tablero`, con
   verde y carmín) sale de esta unidad, también del laboratorio.
2. **Notas de la sesión sobre la idea 1** (19 nov): la figura de Predice trae la tabla de las dos tarjetas por probar, vacía
   (así no queda aire y no adelanta nada); «Así se resuelve» y «Ahora tú» no usan a Ana y Beto juntos (son los del juego y
   de la regla); lo descartado va al 70 % de tinta, para que se lea qué combinación se tachó; los valores de la derecha
   dejan margen.
3. **Predice de la idea 3 pregunta «¿qué se puede asegurar?»** y no «¿quiénes dicen la verdad?»: al resolver del todo,
   Gaby también dice la verdad, y la opción «Gaby y Hugo» habría sido correcta. Ahora solo «Fito y Hugo dicen la verdad» es
   seguro sin probar culpables.
4. **En «Lo contrario de “todos”» la frase del mentiroso va en la pregunta** (es una sola); en las otras ideas las frases
   van en los datos, una por línea.
5. **La tabla de respuestas V/F y las cajas** son el nivel examen de las ideas 3 (carteles, uno falso) y 4 (rótulos, uno
   cierto). Los oficios (una verdad y una mentira) entran como ejemplos de la idea 5.
6. **«Ahora tú» de la idea 6 no tiene a los veraces y mentirosos nombrados** salvo en los ejemplos de nivel examen (frases
   «X dice la verdad» mezcladas con cuentas): el generador `casoCuantos` solo arma frases de cuántos mienten.
7. **La regla de verbal «la correcta no es la más larga ni la más corta»** no se aplicó a los nombres de las alternativas
   (son de razonamiento matemático y los nombres miden lo que miden); quedan tres ejemplos de nivel 3 con la correcta más
   larga o más corta por un carácter.
8. **Laboratorio:** se quedan los tres ids (`tres-que-hablan`, `quien-fue`, `seis-alumnos`) con la pieza nueva y la paleta
   de la rama; las ideas 5 y 6 aportan su juego.
9. **Prueba del curso:** rm-22 (vidrio, solo uno miente) y rm-23 (mochila, solo uno dice la verdad) a la reserva,
   verificados con el motor `verdades` de `orden-informacion`.
