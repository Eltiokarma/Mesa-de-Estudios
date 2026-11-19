# Propuesta de ideas: «Certezas» (`razonamiento-matematico.certezas`)

19 nov 2026 · Etapa 7 del plan de calidad, rama «Lógica» de razonamiento matemático (cuarta y última unidad, después de
Razonamiento deductivo, Ordenamiento de información y Verdades y mentiras, las tres con `calidad: 2`) · encargo con
criterio delegado (`docs/metodo/unidad/etapa-delegada.md`). Gerson delegó el criterio: esta propuesta ya está aplicada en
la unidad (sin `calidad: 2`). Las dudas van al final, en «Decisiones tomadas (Gerson revisa después)», con lo elegido, el
motivo y lo descartado. **No hay ningún conflicto crítico.**

Leído: `CLAUDE.md`, `docs/plan-calidad.md` §3, `docs/molde-unidad.md`, `docs/teoria.md` (4e a 4j y §5),
`docs/metodo/unidad/` (LEEME, 1, 2, 3, reglas-validador, etapa-delegada), las decisiones de las etapas 2 a 6, la
propuesta modelo (`docs/etapa6/propuesta-razonamiento-matematico.md`), la unidad anterior de la rama (Verdades y
mentiras, v0.3.1, con su auditoría y sus dos lectores en frío: qué se corrigió), la teoría actual de esta unidad
(v0.2.0), su ficha en `catalogo/cursos/razonamiento-matematico.json`, las tres plantillas que la cubren (`rm-certezas`,
`rm-deduccion` con su tipo «siempre cierto», `orden-informacion`), `docs/investigacion/aritmetica-razonamiento-ideas-erroneas.md`
(RM6), `docs/investigacion/codigos-rm-procesos.md` (RMP30 a RMP34, RMP90 a RMP97), `docs/clasificacion/trampas-admision-unmsm/rm-a.md`
y `rm-b.md`, la matriz `docs/teoria/matriz/razonamiento-matematico.json` (unidad 10), `docs/temario-completo.md` §4.10, la
prueba del curso y las 30 preguntas de San Marcos de esta unidad en `docs/datos/admision-unmsm.csv`. La rama siguiente,
«Números y patrones», no recibe nada adelantado (§9). Las cuentas de §3 y §4 se rehicieron aparte por fuerza bruta (todas
las extracciones posibles; scratchpad `e7-rm/propuesta.py`).

**Ojo:** la unidad entra solo en San Marcos (tema 9). No hay datos de la UNI ni de la UNA Puno, ni literatura con cifras
de estos errores: RM6 es hipótesis en el informe y los demás distractores salen de las trampas anotadas en la
clasificación (§7).

## Qué se pregunta en San Marcos (2019-I a 2027-I)

30 preguntas clasificadas en esta unidad. **La trampa más anotada es «calcular el caso favorable y no el peor» (RM6, 14
de las 30)**; la segunda, olvidar en el peor caso lo que no sirve (los sin pareja, los que no cumplen).

| Qué piden | Cuántas | Periodos (pregunta) | Trampa anotada | Idea |
| --- | --- | --- | --- | --- |
| Varias de un color dado (a veces hallando antes las cantidades) | 3 | 2020-I (26), 2022 (18), 2021 (17) | caso favorable | 1 |
| Varias del mismo color, cualquiera, entre muchos colores | 2 | 2019-I (25), 2019-II (28) | caso favorable | 2 |
| Cumpleaños (palomar con fechas) | 1 | 2024-II (21) | olvidar el 29 de febrero | 2 |
| Tres con la misma suma de cifras | 1 | 2024-II (29) | no tratar aparte las sumas con pocos casos | 2 (nivel examen) |
| Varias de dos colores a la vez; par de guantes; par de distinta forma e igual color | 3 | 2025-I (28), 2020-I (32), 2026-II (28) | ignorar izquierdo y derecho; caso favorable | 3 |
| Números con una propiedad: múltiplos, impares, producto par, primos | 6 | 2021 (19, 26), 2023-II (16), 2025-II (28), 2026-II (28), 2023-I (25, consecutivos) | contar mal los que no cumplen | 4 |
| Dos que sumen un valor (discos repetidos, distinto color, billetes), diferencia, cociente entero | 7 | 2022 (29), 2024-I (20), 2023-I (28), 2024-II (17), 2025-I (28), 2023-II (24), 2026-II (23) | olvidar los sin pareja | 5 |
| Que la suma pase de un valor; tres que sumen un valor | 4 | 2022 (23, 28), 2024-I (23), 2025-I (24) | tomar los mayores en vez de los menores | 5 |
| Llaves y candados (o puertas) | 2 | 2019-II (27), 2024-I (20) | contar una prueba de más en la última llave | 6 |
| Cajas mal rotuladas | 1 | 2025-II (30) | — | 6 (nivel examen) |

Banco Cuzcano: unas 10 fichas. La prueba de entrada y salida del curso no tiene ningún ítem de esta unidad. Las dos
preguntas de «¿qué es siempre cierto?» (2019-II 23, 2023-II 30) están clasificadas en Razonamiento deductivo; aquí se
conserva el tipo `siempre-cierto` de `rm-deduccion` (decisión de la Etapa 3) y la idea 1 enseña su versión con
extracciones («¿qué es seguro después de sacar 9?»).

---

## 0. Diagnóstico de la teoría actual contra el contrato

Tres ideas (`peor-caso`, `palomar`, `llaves`), tres mesas de laboratorio y un glosario de 10 términos. La base sirve: la
idea central está bien dicha («la certeza pide que alcance aun con la peor suerte») y las tres predicciones (10, 25 y 45)
son buenas.

1. **Punto 1:** ninguna primera pantalla tiene un objeto: son filas de fichas (`rm-fichas`) y un cuadro (`rm-tablero`).
   La kermés solo está escrita.
2. **Puntos 2, 3 y 12:** sin `mision`, `leyenda`, `aprendizaje`, `actividad` ni `pregunta`; el glosario sin `simple` ni
   tres ejemplos; no declara `calidad: 2`. La consigna del juego describe el botón («avanza la peor suerte»): el alumno
   no decide nada, mira cómo sale.
3. **§5b, colores:** rojas carmín, azules turquesa, verdes **verde** y lo pedido naranja: carmín junto a verde y verde
   junto a naranja, los pares que el molde prohíbe, y la paleta de la rama (decisión del 17 nov) no se usa. Además el
   color de la ficha es su color real, así que el violeta y el naranja no pueden tener papel.
4. **Punto 13:** ningún ejercicio trae `datos`; no hay ejemplos resueltos (0 de 45). El generador `rm-certezas` da `datos: ''`.
5. **Punto 3 y notación:** «N = peor caso + 1» con N y k sin decir; ⌈ ⌉ en el glosario («redondear hacia arriba») que
   ninguna idea usa.
6. **«Ahora tú» no llega al examen:** urnas de tres colores y nada de números con propiedad, parejas que suman, guantes
   ni «una de cada color» (20 de las 30 preguntas).
7. **«Así se resuelve» es el mismo generador que «Ahora tú»** con la semilla + 900.
8. **Códigos RMT-CER-1 a 8** sin informe. La cabecera dice «postulante de 3.º a 5.º».
9. **Práctica:** `rm-certezas` tiene 19 tipos verificados a ciegas, pero sin tipos por idea, sin `datos` y con colores
   por variable que no son los de la rama; `orden-informacion` (p9, p10) sin datos; `rm-deduccion` p6 y p7 (siempre
   cierto) sí traen sus datos.

---

## 1. Las ideas, en orden

**Seis** (el tope). Las tres de hoy conservan su `id` (`peor-caso`, `palomar`, `llaves`); se agregan `una-de-cada`,
`condicion` y `parejas`.

| # | `id` | Título (≤ 6) | `aprendizaje` (≤ 25 palabras) |
| --- | --- | --- | --- |
| 1 | `peor-caso` | Prepara la peor suerte | Para estar seguro se arma el peor caso: sale todo lo que no sirve y una menos de lo pedido; la siguiente obliga. |
| 2 | `palomar` | Más objetos que casilleros | Para tener varios iguales, la peor suerte pone en cada casillero uno menos de lo pedido; uno más obliga a repetir. |
| 3 | `una-de-cada` | Una de cada clase | Si la meta pide una de cada clase, la peor suerte agota primero las clases más grandes; la que falta llega al final. |
| 4 | `condicion` | Números que cumplen algo | Con fichas numeradas, se cuentan las que no cumplen: salen todas primero; después, las que cumplen, una menos de lo pedido. |
| 5 | `parejas` | Parejas y sumas | Para tener dos que sumen algo, la peor suerte saca una de cada pareja y todas las sin pareja; la siguiente completa una. |
| 6 | `llaves` | Llaves y candados | En el peor caso cada llave falla en todos los candados que quedan menos uno, que ya no se prueba: se deduce. |

`pregunta` de cada idea, para el Resumen: 1. «¿Por qué no basta con sacar justo las que pides?» · 2. «¿Cuántos alumnos
aseguran que tres cumplan años el mismo mes?» · 3. «¿Qué sale primero si la meta pide una de cada color?» · 4. «¿Cómo se
cuenta lo que no sirve en un bingo?» · 5. «¿Qué cartas saca la mala suerte si buscas dos que sumen algo?» · 6. «¿Por qué
la última llave no se prueba?»

**Por qué cada una va ahí y qué da por sabido**

1. **Prepara la peor suerte.** La raíz: una meta de un color fijo. Estrena «extracción», «sin devolver» y «peor caso».
   «Seguro: lo que vale en todos los casos posibles» viene de Razonamiento deductivo (`requiere`), y aquí se aplica a las
   extracciones (el tipo «¿qué es seguro después de sacar 9?» de «Ahora tú» es el «siempre cierto» de la Etapa 3).
2. **Más objetos que casilleros.** La meta cambia a «del mismo color, cualquiera»: cada color es un casillero. Lleva al
   palomar de los cumpleaños. Usa el peor caso de la idea 1.
3. **Una de cada clase.** Otra forma de meta: que no falte ninguna clase (cada color; o, en los guantes, un izquierdo y un
   derecho del mismo color). Usa el peor caso (1) y los casilleros (2): cada clase es un casillero que se llena entero.
4. **Números que cumplen algo.** Lo mismo que la idea 1, pero «lo que no sirve» hay que contarlo: múltiplos, primos,
   impares. Va después de las tres metas de colores porque agrega una cuenta (cuántos múltiplos de 3 hay del 1 al 20).
5. **Parejas y sumas.** La meta es una pareja: cada pareja es un casillero que admite una carta (idea 2), y las cartas sin
   pareja son lo que no sirve (idea 4). Su nivel examen junta «que la suma pase de» (salen primero las más chicas).
6. **Llaves y candados.** Identificación: el peor caso cuenta pruebas que fallan, y lo que queda se deduce. Va al final
   porque es el caso más distinto (no se saca de un recipiente) y su nivel examen tiene las cajas mal rotuladas.

**Qué no entra:** la probabilidad (Juegos recreativos, en «Números y patrones»: la certeza no es «muy probable», y se
dice sin fórmulas), las pesadas con balanza (Cortes y pesadas, que pide esta unidad), las sumas de Gauss con fórmula
(Razonamiento inductivo) y el «siempre cierto» con frascos y condicionales (Razonamiento deductivo).

---

## 2. Objeto de la primera pantalla

Pieza nueva `rm-certeza`, dibujada por la sesión como prueba (`data-prueba`), con su prueba numérica de encuadre y
rótulos. La kermés del aniversario del colegio (el mismo colegio del campeonato de las tres unidades anteriores).

| Idea | Objeto | Qué es qué |
| --- | --- | --- |
| 1 | **La tómbola de la kermés**: una caja con su boca y bolitas con la letra de su color (R, V, N) | lo que sale baja a «Salieron», en el orden de la mala suerte |
| 2 | **La misma tómbola**, y en Predice, **el calendario de cumpleaños del salón** (12 casilleros) | cada color, o cada mes, es un casillero |
| 3 | **La tómbola**, y en Predice, **el cajón de los guantes** de educación física (izquierdos y derechos) | cada clase es un color, o un color y una mano |
| 4 | **El bingo de la kermés**: el tablero con las bolillas del 1 al 20 | lo que salió se marca en su lugar |
| 5 | **Las cartas de la feria**, del 1 al 7, boca arriba en la mesa, juntas de a dos las que suman 8 | cada pareja va unida por una raya |
| 6 | **Los casilleros del gimnasio**: cuatro candados y cuatro llaves sueltas | filas = llaves, columnas = candados, ✗ = prueba que falla |

---

## 3. Misión de «Juega» (meta que el motor comprueba)

En todas, **el alumno hace de mala suerte**: elige qué sale (no mira cómo sale solo). La misión se cumple solo con el peor
caso, y la lectura dice cuánto falta para que ya no quede nada que no sirva.

| Idea | Contexto + misión | Controles | `logrado` | Lectura en vivo (enuncia una relación) |
| --- | --- | --- | --- | --- |
| 1 | Tómbola con 5 rojas, 4 verdes y 3 negras; la meta, 2 rojas. **Saca la mayor cantidad de bolitas sin llegar a 2 rojas.** | cuántas rojas, verdes y negras salen | 1 roja, 4 verdes, 3 negras (8) | «8 sin 2 rojas: ya no queda ninguna que no sirva» · «Con 2 rojas la meta se cumple» |
| 2 | La misma tómbola; la meta, 3 del mismo color. **Saca la mayor cantidad sin tener 3 iguales.** | ídem | 2, 2 y 2 (6) | «6 sin 3 iguales: la siguiente repite un color por tercera vez» |
| 3 | La misma; la meta, una de cada color. **Saca la mayor cantidad sin tener una de cada color.** | ídem | 5 rojas y 4 verdes (9) | «Faltan las negras: todavía pueden salir 2 verdes más sin cumplir» |
| 4 | Bingo del 1 al 20; la meta, 2 múltiplos de 3. **Saca la mayor cantidad de bolillas sin tener 2 múltiplos de 3.** | cuántas no múltiplos y cuántos múltiplos salen | 14 y 1 (15) | «15 sin 2 múltiplos de 3: ya no queda ninguna que no sirva» |
| 5 | Cartas del 1 al 7; la meta, dos que sumen 8. **Saca la mayor cantidad de cartas sin dos que sumen 8.** | de cada pareja (1 y 7, 2 y 6, 3 y 5): ninguna, una o las dos; el 4: sí o no | una de cada pareja y el 4 (4) | «4 cartas sin pareja completa: la siguiente cierra una» |
| 6 | Cuatro candados y cuatro llaves. **Haz que la mala suerte gaste la mayor cantidad de pruebas.** | en qué intento abre la llave 1 (1 a 4), la 2 (1 a 3) y la 3 (1 o 2) | 6 pruebas | «Llave 1: 3 pruebas; el cuarto candado se deduce» |

Cuentas rehechas aparte: idea 1, el mayor grupo sin 2 rojas es 8 (9 aseguran); idea 2, 6 (7); idea 3, 9 (10); idea 4,
15 (16); idea 5, 4 (5); idea 6, 3 + 2 + 1 = 6. Ninguna misión está cumplida al abrir (todo empieza en 0 o en el primer
intento).

---

## 4. La predicción de cada idea

Ninguna pregunta por lo que el juego ya mostró: cada una es otro caso. Los `datos` llevan las cantidades y las reglas del
problema, nunca la regla de la idea. La app baraja las opciones.

**Idea 1** (la de hoy, se queda). «En la misma tómbola, ¿cuántas bolitas hay que sacar, como mínimo, para tener con
certeza 3 rojas?» → **10** · 3 (RM6, con suerte) · 5 (RMP30, solo las rojas) · 12 (RMP152, sacar todo).

**Idea 2** (la de hoy, se queda). «¿Cuántos alumnos debe tener un salón, como mínimo, para que con certeza 3 cumplan
años el mismo mes?» → **25** · 3 (RM6) · 24 (RMP34, sin la que obliga) · 36 (RMP153, 3 en cada mes).

**Idea 3.** «En el cajón hay 4 pares de guantes negros y 3 pares de guantes blancos, sueltos. ¿Cuántos hay que sacar,
como mínimo, para tener con certeza un par que se pueda usar?» → **8** · 3 (RMP31, mirar solo el color) · 7 (RMP34) ·
14 (RMP152, todos).

**Idea 4.** «En el mismo bingo (1 al 20), ¿cuántas bolillas hay que sacar, como mínimo, para tener con certeza una con
número primo?» → **13** · 1 (RM6) · 9 (RMP32, contar los primos y sumar 1) · 12 (RMP30, el 1 tomado por primo).

**Idea 5.** «Con cartas del 1 al 10, ¿cuántas hay que sacar, como mínimo, para tener con certeza dos que sumen 12?» →
**7** · 2 (RM6) · 5 (RMP30, olvidar el 1 y el 6, que no tienen pareja) · 6 (RMP34).

**Idea 6** (la de hoy, se queda). «Con 10 llaves y 10 candados, ¿cuántas pruebas hacen falta en el peor caso para saber
qué llave abre cada candado?» → **45** · 10 (RM6) · 55 (RMP34, probar también la última) · 100 (RMP154, todas con todas).

Las figuras de Predice son el planteamiento (la tómbola llena, el calendario vacío, el cajón, el bingo, las cartas, la
cuadrícula sin marcas): nada en violeta antes de responder.

---

## 5. Tabla de letras y símbolos

| Símbolo | Un solo significado en la unidad | Aviso |
| --- | --- | --- |
| R, V, N, B (en una bolita) | roja, verde, negra, blanca | Solo en la figura; el texto dice el color con su nombre |
| I, D (en un guante) | izquierdo, derecho | Solo en la figura |
| ✗ | una prueba que falla (llaves) | |
| ✓ turquesa | lo que se deduce sin probar | |
| A–E | solo las alternativas de un ejemplo tipo examen | **En esta unidad las figuras tienen letras (R, V, N, B, I, D): los resueltos nombran cada alternativa por su valor**, nunca por su letra (decisión de la Etapa 3) |
| N, k, ⌈ ⌉ | **se quitan** | La regla se dice en palabras («uno menos de lo pedido en cada casillero») |

`letras: {}`: la unidad no usa letras de fórmula.

---

## 6. Colores: la paleta de deducción de la rama

La misma de las tres unidades anteriores, con el papel de cada color dicho para esta. El color real de una bolita **no**
se pinta: se escribe su letra (R, V, N, B); así ningún color de ficha pisa un papel.

| Token | Papel | En esta unidad |
| --- | --- | --- |
| tinta | lo que amarra | la tómbola, el bingo, las bolitas que quedan, sus letras y números, la meta |
| `o` naranja | lo supuesto: la peor suerte | lo que sale sin cumplir la meta, cada prueba que falla |
| `i` turquesa | lo que sale de ahí | la extracción que obliga a cumplir la meta; lo que se deduce sin probar |
| `f` violeta | lo seguro, ya comprobado | el total (la respuesta), solo al resolver |
| gris tenue y tachado | lo descartado | una suerte que no es la peor |
| `h` carmín y `d` verde | **no se usan** | |

La pieza fija los papeles (`PAPELES`) y la prueba de la unidad falla si aparece verde o carmín, o si una figura que se ve
antes de responder trae violeta.

---

## 7. Práctica: qué existe y qué falta por idea

**Qué existe:** `rm-certezas` (19 tipos verificados a ciegas, 50 casos, 10 de papel), el tipo `siempre-cierto` de
`rm-deduccion` y la escena `orden-informacion` (p9 y p10).

**Qué se hace:** `rm-certezas` 0.3.0 con tipos por idea (`TIPOS_POR_IDEA`), `datos` por línea en todos los tipos, la
paleta de la rama, explicaciones que empiezan por lo que el alumno hizo bien y `datos` en el papel. Sin idea, el
generador sigue igual (los 50 casos de `casos.json` no cambian). `orden-informacion` pasa a «Más mesas del tema» en esta
unidad (`"rehacer"`). `rm-deduccion` se queda con su tipo `siempre-cierto` para Certezas.

| Idea | Tipos de `rm-certezas` |
| --- | --- |
| 1 Peor caso | `colores` (color dado) |
| 2 Palomar | `colores` (mismo color), `cumpleanos`, `cumpleanos-ya`, `suma-cifras` |
| 3 Una de cada | `colores` (una de cada), `guantes` |
| 4 Condición | `divisibilidad`, `paridad`, `primos`, `consecutivos` |
| 5 Parejas | `pareja-suma`, `pareja-color`, `suma-supera`, `billetes`, `trio-suma`, `diferencia`, `division` |
| 6 Llaves | `llaves`, `cajas`, `cajas-abrir` |

**Códigos.** Los RMT-CER de la teoría de hoy pasan a RM6 y RMP: 1 → RMP30 · 2 → RMP152 · 3 y 4 → RMP34 · 5 → RMP153 ·
6 → RMP155 · 7 → RMP154 · 8 → RMP34. Nuevos, todos hipótesis, anotados en `codigos-rm-procesos.md`:

| Código | Error | De dónde sale |
| --- | --- | --- |
| RMP152 | Sacar todo: asegura, pero no es el mínimo | RMT-CER-2 de la teoría vieja |
| RMP153 | Pedir lo pedido en **cada** casillero (3 por mes: 36) y no en alguno | RMT-CER-5 |
| RMP154 | Probar cada llave en todos los candados, aunque ya estén abiertos (10 × 10) | RMT-CER-7 |
| RMP155 | Usar «casilleros + 1» con cualquier meta (13 alumnos para que 3 coincidan) | RMT-CER-6 y la matriz («el peor caso más uno es un argumento, no una fórmula») |

---

## 8. Datos del mundo

Ninguno hace falta. Cantidades de bolitas, cartas y llaves son de problema; deben ser posibles (una tómbola con 30
bolitas, no con 3000). Que el año tiene 366 fechas posibles (con el 29 de febrero) es un dato de calendario que va en
`datos`. La historia (el principio del palomar y Dirichlet) ya trae fuente (University of Lethbridge) y se queda.

---

## 9. Riesgos de orden (`requiere`)

- `requiere: ['razonamiento-matematico.razonamiento-deductivo']` (hoy `[]`): «seguro es lo que vale en todos los casos»
  y el término «certeza» vienen de ahí. No se pide Verdades y mentiras: «al menos» se dice en los datos donde se usa.
- **La rama siguiente («Números y patrones») no recibe nada adelantado:** ni probabilidad, ni la fórmula de Gauss, ni
  sucesiones. La suma 3 + 2 + 1 de las llaves se hace a mano.
- Dentro de la unidad: la idea 2 usa el peor caso de la 1; la 3, los casilleros de la 2; la 4, «lo que no sirve» de la 1;
  la 5, el casillero de la 2 y «lo que no sirve» de la 4; la 6 es aparte.
- Temas del catálogo, sin agregar ninguno: «Extracción de objetos» (ideas 1, 3, 4 y 5), «Peor caso» (1 a 5) e
  «Identificación de objetos» (6).

---

## 10. Decisiones tomadas (Gerson revisa después)

1. **Seis ideas, tres nuevas.** Elegido: color dado, palomar, una de cada clase, números con condición, parejas y sumas,
   llaves. Motivo: 20 de las 30 preguntas (números, parejas, guantes, una de cada) no tenían idea. Descartado: tres ideas
   con todo eso en «Ahora tú» (la regla tendría que decir seis cosas).
2. **El alumno hace de mala suerte** en todos los juegos (elige qué sale). Motivo: el juego de hoy avanzaba solo; la
   misión pide construir el peor caso, que es lo que el examen pide. Descartado: el botón «saca la siguiente».
3. **Las bolitas llevan la letra de su color y van en tinta**, sin su color real. Motivo: con la paleta de la rama, el
   color de una ficha chocaría con el papel (una ficha roja en carmín, una verde en verde) y delataría lo pedido.
   Descartado: pintar cada bolita de su color.
4. **Alternativas por su valor en toda la unidad** (las figuras tienen letras R, V, N, B, I y D). Descartado: nombrar por
   letra («**B** olvida…»), que se confunde con la bolita blanca.
5. **`requiere` pasa a Razonamiento deductivo.** Motivo: «seguro = en todos los casos» y «certeza» se estrenan allá. La
   rama ya va en ese orden. Descartado: dejarla sin requisitos.
6. **El «siempre cierto» con frascos se queda en `rm-deduccion`** (tipo `siempre-cierto` para esta unidad, decisión de
   la Etapa 3), y aquí entra su forma con extracciones en «Ahora tú» de la idea 1. Descartado: una séptima idea.
7. **Las cajas mal rotuladas** (una pregunta) van como nivel examen de la idea 6, junto a las llaves («identificar»).
8. **Práctica: `rm-certezas` se rehace por dentro** (tipos por idea, datos, paleta) en vez de escribir un generador nuevo.
   Motivo: sus 19 tipos y sus 50 casos ya están verificados a ciegas y cubren las 30 preguntas. Descartado: un generador
   nuevo como `rm-verdades`.
9. **Glosario:** se quedan peor caso, extracción, sin devolver, casillero, principio del palomar, identificar y deducir;
   salen urna (se dice tómbola), «redondear hacia arriba» (ninguna idea lo usa) y probabilidad (es de Juegos
   recreativos); entran par usable, una de cada, bolilla, múltiplo, número primo, pareja, sin pareja y prueba.
10. **Prueba del curso:** dos ítems nuevos a la reserva (las formas ya tienen 10 pares): rm-24 (una de cada color) y
    rm-25 (dos que sumen un valor), verificados en `catalogo/pruebas/verificar.js` con `rm-certezas`.

---

## 11. Fases 2 a 5 (19 nov): lo que cambió al escribir

Decisiones tomadas al escribir (Gerson revisa después), además de las de §10:

1. **Pieza nueva `rm-certeza`** (escenas recipiente —tómbola, cajón, bingo, mesa—, casilleros del calendario y la
   cuadrícula de llaves y candados), con su prueba numérica de encuadre y rótulos y los papeles de color fijos
   (`PAPELES`). Las piezas viejas (`rm-fichas`, `rm-tablero`, con verde y carmín) salen de esta unidad, también del
   laboratorio.
2. **Notas de la sesión sobre la idea 1** (19 nov): la regla en tres llaves cortas (no se parte dentro de un paréntesis);
   la tómbola sin la barra de la boca, que no se reconocía; la leyenda dice «salió y todavía no cumple la meta» (así una
   roja con borde naranja no se lee como «no sirve»); el «12» de Predice dice cuántas sobran.
3. **La lectura del juego no cuenta lo que falta** («todavía caben 8 más» daba la respuesta de la misión): dice si aún
   cabe algo sin cumplir o si ya no queda nada que no sirva.
4. **Glosario:** «múltiplo» ya se define en Frecuencia de sucesos (se usa el de allá); «prueba» sale del glosario,
   porque la palabra se marcaría en todo el curso («prueba cada lugar»), y «número primo» va sin las formas «primo» y
   «primos» (en Parentesco son familiares).
5. **El bingo de los ejemplos va como bombo, con las bolillas tapadas**: el tablero numerado del 1 al 20 escribiría la
   respuesta (16, 13…) en la figura. El tablero se queda en Lee, el juego y Predice.
6. **«Ahora tú» y «Así se resuelve» nunca traen el caso del juego ni el de la predicción** (la tómbola de 5, 4 y 3 con 2
   o 3 rojas, las cartas del 1 al 7 con suma 8, 4 o 10 llaves…); lo prueba `certezas.test.js`.
7. **Las cajas mal rotuladas** son el ejemplo 15 de la idea 6 (de una sola caja basta); «abrir un candado dado» (5
   pruebas: la quinta llave hay que meterla) es el 10, para distinguir «saber» de «abrir».
8. **Práctica:** `rm-certezas` 0.3.0 con `TIPOS_POR_IDEA` (seis ideas, 21 tipos), `datos` en todos los tipos, el problema
   en tinta y solo la respuesta en violeta; 18 casos nuevos por idea en `casos.json`, resueltos aparte; el papel con
   `datos` y su idea (p6 pasa a ser de la idea 1). Las explicaciones de los distractores de los 19 tipos viejos se
   quedan como estaban (ya decían el valor de su error): no se reescribieron.
9. **Prueba del curso:** rm-24 (una de cada sabor o color) y rm-25 (dos que sumen un valor) a la reserva, verificados con
   `calc` de `rm-certezas`.
