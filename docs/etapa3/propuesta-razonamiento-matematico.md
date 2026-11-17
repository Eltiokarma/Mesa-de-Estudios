# Propuesta de ideas: «Razonamiento deductivo» (`razonamiento-matematico.razonamiento-deductivo`)

17 nov 2026 · Etapa 3 del plan de calidad, rama de entrada «Lógica» de razonamiento matemático · fase 1
(`docs/metodo/unidad/1-ideas.md` §A). Para Gerson: es solo la propuesta, sin código. Las preguntas que solo tú puedes
contestar están en la sección 9, cada una con mi recomendación.

Leído: `CLAUDE.md`, `docs/plan-calidad.md` (§3 y §7), `docs/molde-unidad.md` entero (§5b del 17 nov), `docs/etapa2/decisiones.md`
con sus «Cambios posteriores», las tres propuestas de la etapa 2, la teoría actual
(`contenido/teoria/razonamiento-matematico/razonamiento-deductivo.js`, v0.2.0), su ficha en
`catalogo/cursos/razonamiento-matematico.json`, las tres plantillas que la cubren (`orden-informacion`, `rm-deduccion`,
`rm-parentesco`: generador o motor, casos y papel), `docs/investigacion/aritmetica-razonamiento-ideas-erroneas.md`,
`docs/investigacion/codigos-rm-procesos.md`, `docs/clasificacion/trampas-admision-unmsm/rm-a.md`, la matriz
`docs/teoria/matriz/razonamiento-matematico.json`, `docs/temario-completo.md` y las 32 preguntas de San Marcos de esta
unidad en `docs/datos/admision-unmsm.csv`. Como nivel, las cuatro unidades ya rehechas (vectores, razones agudas, materia
y energía, tema e idea principal). Las cuentas de los cuadros de §3 y §4 las rehíce con un script aparte (scratchpad `rm/`).

**Ojo:** la ficha se llama «Razonamiento deductivo y parentesco» y entra solo en San Marcos (temas 1, 2 y 18). No hay
datos de la UNI ni de la UNA Puno para esta unidad. El informe de errores de aritmética y razonamiento **no trae nada de
lógica**: todos los distractores de abajo son hipótesis (sección 4).

## Qué se pregunta en San Marcos (2019-I a 2027-I)

32 preguntas clasificadas en esta unidad. **Más de la mitad son cuadros de doble entrada**, y salen en todos los periodos.

| Qué piden | Cuántas | Periodos (número de pregunta) | Trampa anotada en la clasificación |
| --- | --- | --- | --- |
| Cuadro de doble entrada: personas con 1 a 3 atributos (profesión, ciudad, edad, transporte) | 18 | 2019-I (21, 28), 2019-II (16, 17), 2020-I (21), 2021 (16, 24), 2022 (16, 16), 2023-I (16, 24, 28), 2024-I (17), 2025-I (27), 2025-II (27), 2026-I (21), 2026-II (30), 2027-I (30) | 2026-I: no descartar que alguien tenga dos oficios que se relacionan |
| Parentesco: cadena de relaciones o persona en un árbol | 4 | 2021 (28), 2023-I (20), 2024-I (27), 2024-II (18) | leer la cadena desde el inicio; responder un eslabón intermedio |
| Parentesco: mínimo de personas | 1 | 2022 (19) | sumar los papeles como si fueran personas |
| «¿Qué es siempre cierto?» con información incompleta (frascos con condicionales) | 2 | 2019-II (23), 2023-II (30) | elegir una afirmación posible pero no necesaria |
| Condicionales y contrafácticos para asignar profesiones | 1 | 2021 (28) | tomar el condicional como bicondicional |
| Silogismo: conclusión de dos premisas sobre clases | 1 | 2021 (20) | concluir «algunos» en vez de «ninguno» |
| Repartos con números (dados, edades con primos, billetes) | 4 | 2019-I (32), 2023-II (17, 18), 2026-II (21) | — |
| Mal clasificada: quién aún puede ganar con los votos restantes | 1 | 2026-I (21) | es de `planteo-de-ecuaciones` (módulo `rm-planteo`) |

Banco Cuzcano: unas 23 fichas (cuadros de doble entrada 14, deducción lógica 6, parentesco 3). La prueba de entrada y
salida de razonamiento matemático no tiene ningún ítem de esta unidad. Los «diagramas lineales» del catálogo no aparecen
en ninguna pregunta (pregunta 9.4).

---

## 0. Diagnóstico de la teoría actual contra el contrato

Cuatro ideas (`conclusion-necesaria`, `si-entonces`, `doble-entrada`, `parentesco`) y tres mesas de laboratorio con
retos que el motor sí comprueba. La base sirve: todo se decide por fuerza bruta (dibujos, filas, repartos y caminos que
cumplen todo) y la idea central está bien dicha: **es seguro lo que vale en todos los casos que dejan los datos**.

1. **Punto 1: ninguna primera pantalla tiene un objeto.** Son círculos de Venn, una tabla de cuatro filas, un cuadro 3 × 3
   y un árbol de letras. Los mototaxistas de Juliaca y la lluvia solo están escritos en «Lee».
2. **Puntos 2, 3 y 12:** sin `mision`, `leyenda`, `aprendizaje`, `actividad` ni `pregunta`. Las consignas describen
   botones («prueba cada lugar de C», «elige qué se sabe y mira»). No declara `calidad: 2`.
3. **Regla 3, la predicción ya vista:** en la idea 1 el juego muestra los tres lugares de C (con `minimo: 3`) y la
   predicción pregunta justo si se puede asegurar que algún A es C. Ya lo vio.
4. **Punto 7, lecturas que no dicen nada:** «Queda 1 caso: se concluye» (no dice qué) y «Pista 2: Beto no juega fútbol»
   (repite el dato). La de parentesco no dice el camino.
5. **Puntos 3 y 5, símbolos sin presentar:** ⊂ (es de conjuntos, otro curso), ⇒ y ⇏ entre dos conclusiones (se lee como
   otro condicional), «no q» y «p ⇒ q» en «Mira». El «·» separa dos igualdades en la regla de las ideas 2 y 4, lo que el
   molde prohíbe. La mesa de Venn tiene un control «Radio de C» y el glosario define «radio»: geometría en una unidad de
   lógica.
6. **§5b, colores que no se distinguen:** en el Venn, B naranja y C verde **se tienen que tocar** (naranja–verde da 0,010
   con protanopía). En el cuadro, ✓ verde junto a ✗ carmín (rojo–verde, 0,038 con deuteranopía); además el carmín es de
   los ángulos. En el árbol, Raúl naranja junto a Pedro verde en «revelar».
7. **Punto 13:** ningún ejercicio trae `datos`, tampoco el papel de las tres plantillas. «Así se resuelve» es el mismo
   generador que «Ahora tú» con la semilla + 900. No hay ejemplos resueltos (0 de 60).
8. **«Ahora tú» no llega al examen:** el cuadro es 3 × 3 con un solo atributo y solo pistas «X no hace Y», cuando San
   Marcos pone 3 o 4 personas con 2 o 3 atributos y pistas que cruzan atributos (2027-I: profesión, ciudad y transporte).
   El parentesco pregunta «el hermano del padre de Ana», no la cadena dicha desde «mi …» que sale en 2021, 2024-I y
   2024-II, ni el mínimo de personas de 2022. La regla del Venn solo dice la cadena «todo A es B, todo B es C», pero
   «Ahora tú» pide también «ningún» y «algunos».
9. **Códigos sin informe:** la teoría usa RMT-DED-1 a 14, que no están en ningún documento; los generadores usan RMP60 a
   RMP79 (`codigos-rm-procesos.md`). Son dos nombres para los mismos errores.
10. Detalles: la cabecera dice «postulante de 3.º a 5.º» y la ficha `grado: 3`; «Lee» afirma sin fuente que «en muchas
    familias de Puno los primos crecen casi como hermanos» (punto 10). Ningún generador separa sus tipos por unidad
    (`rm-deduccion` también sirve a certezas; `rm-parentesco`, a ordenamiento).

---

## 1. Las ideas, en orden

Propongo **cinco**. Las cuatro de hoy conservan su `id` (guardan el avance) y sus mesas no cambian de `id`; se agrega
`dos-atributos`. Cambia el orden: el cuadro pasa al principio (pregunta 9.1).

| # | `id` | Título (≤ 6) | `aprendizaje` (≤ 25 palabras) |
| --- | --- | --- | --- |
| 1 | `doble-entrada` | El cuadro que descarta | Una ✓ es segura cuando vale en todos los repartos que quedan; cada ✓ tacha el resto de su fila y de su columna. |
| 2 | `dos-atributos` (nueva) | Pistas que cruzan dos listas | Una pista que une dos listas sin nombrar a nadie va en el cuadro de esas dos listas; de ahí pasa a las personas. |
| 3 | `conclusion-necesaria` | Lo que vale en todo dibujo | Una conclusión es segura si se cumple en todos los dibujos que respetan las premisas; basta un dibujo que la rompa para descartarla. |
| 4 | `si-entonces` | Si llueve, la pista se moja | Un «si…, entonces…» solo prohíbe un caso: que pase lo primero sin lo segundo. Por eso, si no pasó lo segundo, no pasó lo primero. |
| 5 | `parentesco` | Subir y bajar por el árbol | Un parentesco es un camino que se lee desde «mi»: sube a los padres, baja a los hijos; una persona puede tener dos papeles. |

`pregunta` de cada idea, para el Resumen: 1. «¿Cuándo es segura una casilla del cuadro?» · 2. «¿Dónde se marca una pista
que no nombra a nadie?» · 3. «¿Cuándo se puede asegurar una conclusión?» · 4. «¿Qué se concluye de un “si…, entonces…”?»
· 5. «¿Cómo se lee una cadena de parentescos?»

**Por qué cada una va ahí y qué da por sabido**

1. **El cuadro que descarta.** Primero porque es lo más concreto (tres amigos, tres cosas) y lo que más pregunta San
   Marcos (18 de 32). Aquí nace la idea de toda la unidad, contando: sin pistas hay 6 repartos, cada pista tacha algunos
   y una casilla es segura cuando coincide en todos los que quedan. Da por sabido: nada (es la raíz del curso;
   `requiere: []` se queda). «Reparto», ✓ y ✗ se presentan en «Lee».
2. **Pistas que cruzan dos listas.** Necesita el cuadro y la ✓ segura (idea 1). Es el salto al nivel del examen: la pista
   «el que toca charango vive en Juliaca» no cabe en la fila de nadie. Su «Ahora tú» llega a 4 personas con 3 atributos
   y a los repartos con números (dados, edades con primos, billetes), con «par» y «primo» como dato.
3. **Lo que vale en todo dibujo.** Generaliza la idea 1: un dibujo de aros es otro «caso posible». Presenta «todos»,
   «algunos» y «ningún» con su dibujo. Da por sabido: «seguro = en todos los casos que quedan» (idea 1). El diagrama de
   Venn se presenta en «Lee» con los aros del patio; no pide `aritmetica.conjuntos`.
4. **Si llueve, la pista se moja.** Usa los casos de la idea 1 (aquí son cuatro filas) y «seguro o solo posible» de la
   idea 3. Va en palabras, sin tabla de verdad ni símbolos de lógica proposicional (pregunta 9.3). Su nivel examen junta
   todo: los frascos de «¿qué es siempre cierto?» (2023-II) y la asignación con contrafácticos (2021).
5. **Subir y bajar por el árbol.** Es otra representación (un árbol), casi independiente; va al final porque su
   predicción (dos padres y dos hijos) usa «el mínimo que cumple todo», que ya se vio en las ideas 1 a 3. Da por sabido:
   palabras de familia (padre, madre, hijo, hermano); tío, primo y sobrino se definen en «Lee».

**Qué no entra:** ordenar en fila o en mesa redonda (es `ordenamiento-de-informacion`, que pide esta unidad), verdades y
mentiras, el peor caso de certezas y las tablas de verdad (`aritmetica.logica-proposicional`).

---

## 2. Objeto de la primera pantalla

No hay ninguna pieza del kit con estos objetos (`rm-plano` dibuja círculos y árboles; `rm-tablero`, cuadros). Propongo
una pieza nueva `rm-objeto`, dibujada por la sesión como prueba (`data-prueba`, lista en `docs/encargo-vectores.md`), con
su prueba numérica de encuadre y rótulos. El diagrama va al lado del objeto, nunca solo.

| Idea | Objeto | Qué es qué |
| --- | --- | --- |
| 1 | **Tres amigos inscritos en el campeonato del aniversario del colegio.** En la banca, una pelota de fútbol, una de vóley y un tablero de ajedrez; cada ficha de inscripción, en blanco | cada amigo es una fila; cada cosa, una columna; al quedar un reparto, cada cosa pasa a la mano de su dueño |
| 2 | **Los tres músicos de la comparsa del colegio bajando de la combi**, con su quena, su charango y su bombo; en la combi, el letrero de Puno, Juliaca o Ilave sin decir quién viene de dónde | tres cuadros en L: persona–instrumento, persona–ciudad e instrumento–ciudad |
| 3 | **Los aros de educación física en el patio**, con alumnos parados adentro: el aro de los quenistas dentro del aro grande de la banda; el aro de los que bailan diablada se mueve | cada aro es un grupo; estar dentro de dos aros es estar en los dos grupos |
| 4 | **La calle frente al colegio**: una nube que puede llover, un camión cisterna que riega y la pista, mojada o seca | lo primero es la lluvia; lo segundo, la pista mojada; la cisterna explica el caso «no llovió y está mojada» |
| 5 | **La foto de la familia de Ana en el cumpleaños del abuelo Raúl** (tres generaciones), con el árbol al lado | cada línea del árbol une a un padre o una madre con su hijo o hija |

---

## 3. Misión de «Juega» (meta que el motor comprueba)

| Idea | Contexto + misión (≤ 16 palabras) | Controles | `logrado` | Lectura en vivo (enuncia una relación) | `bien` |
| --- | --- | --- | --- | --- | --- |
| 1 | «Cada uno juega un deporte distinto.» **Encuentra con cuántas pistas aparece la primera ✓.** | `n` de 0 a 3 pistas: Ana no juega vóley · Ana no juega ajedrez · Ciro no juega vóley | `val.n === 2` | n = 1: «Ana no juega vóley: quedan 4 repartos; ninguna casilla coincide en todos.» n = 2: «Quedan 2 repartos y en los dos Ana juega fútbol: esa ✓ es segura.» n = 3: «Queda 1 reparto: Ana fútbol, Beto vóley, Ciro ajedrez.» | «La ✓ salió antes de saberlo todo: Ana juega fútbol en los dos repartos que quedan.» |
| 2 | «Cada músico toca algo distinto y viene de una ciudad distinta.» **Agrega pistas hasta saber qué toca Beto.** | `n` de 0 a 3: Beto vive en Ilave · El que toca charango vive en Juliaca · Beto no toca quena | `val.n === 3` | n = 2: «Beto vive en Ilave y el del charango, en Juliaca: Beto no toca charango (4 repartos).» n = 3: «Sin quena ni charango, Beto toca bombo (quedan 2 repartos).» | «La pista del charango no nombraba a Beto, pero le tachó una casilla.» |
| 3 | «Premisas: todos los quenistas están en la banda; algunos de la banda bailan diablada.» **Pon el aro de danzantes sin tocar a ningún quenista.** | `c`: lejos, cruza o cubre a los quenistas (o arrastrar el aro) | `val.c === 'lejos'` | lejos: «Cumple las dos premisas y ningún quenista baila.» cruza: «Cumple y algún quenista baila.» cubre: «Cumple y todos los quenistas bailan.» | «Las premisas permiten este dibujo: no obligan a que algún quenista baile.» |
| 4 | «Regla: si llueve, la pista se moja. La cisterna también la moja.» **Elige un dato con el que quede un solo caso.** | `dato`: llueve · no llueve · está mojada | `val.dato === 'llueve'` | llueve: «Con lluvia, la regla deja un caso: pista mojada.» no llueve: «Quedan 2 casos: seca, o mojada por la cisterna.» mojada: «Quedan 2: lluvia o cisterna; no se sabe si llovió.» | «Con lluvia solo cabe la pista mojada: es lo único que asegura la regla.» |
| 5 | «Ana dice: “el hijo del único hermano de mi papá”.» **Lleva la manija hasta esa persona.** | `c`: padre, abuelo, tío, primo (o arrastrar la manija por el árbol) | `val.c === 'primo'` | primo: «Iván es primo de Ana: sube 2 (Pedro, Raúl) y baja 2 (Tomás, Iván).» tío: «Tomás es tío de Ana: sube 2 y baja 1.» | «Se lee desde “mi papá”: Pedro, su hermano Tomás y el hijo de Tomás.» |

Cuentas rehechas aparte: en la idea 1, 6 → 4 → 2 → 1 repartos; en la idea 2, 36 → 12 → 4 → 2 (y con la cuarta pista de
la predicción, 1). Ninguna misión está cumplida al abrir. Las de las ideas 1, 3 y 4 se pueden lograr probando todo; lo
que enseña es la lectura de cada caso, y eso lo comprueba el lector en frío (mismo riesgo que en verbal).

---

## 4. La predicción de cada idea

Ninguna pregunta por lo que el juego ya mostró. Los `datos` llevan solo las reglas del problema y las definiciones de
palabras, nunca la regla de la idea. La app baraja las opciones. **Todos los códigos son hipótesis** de
`codigos-rm-procesos.md` (salen de las trampas de los solucionarios de San Marcos, sin datos de alumnos). Existe
literatura de psicología del razonamiento sobre el condicional y los silogismos (la tarea de Wason, el efecto atmósfera),
pero el repo no tiene un informe que la cite, así que nada queda como «documentado» (pregunta 9.6).

**Idea 1.** «Otras pistas para los mismos tres: Ana no juega ajedrez y Beto no juega ajedrez. ¿Qué es seguro?»
Datos: «Cada uno juega un solo deporte, y ningún deporte se repite.» (El juego mostró una ✓ por fila; esta sale por columna.)

| Opción | Código |
| --- | --- |
| **Ciro juega ajedrez** | correcta (quedan 2 repartos y en los dos Ciro juega ajedrez) |
| Nada todavía: ninguna pista habla de Ciro | RMP78 (creer que no se deduce nada) |
| Ana juega fútbol | RMP77 (posible, no necesario) |

**Idea 2.** «Se agrega una cuarta pista: Ana no vive en Juliaca. ¿Qué toca Ana?» Datos: «Cada músico toca un instrumento
distinto y viene de una ciudad distinta.»

| Opción | Código |
| --- | --- |
| **Quena** | correcta (Juliaca es del charango; queda 1 reparto) |
| Charango | RMP63 (no aplica la pista que cruza; es la variante `sinCruce` del motor) |
| No se puede saber: la pista habla de ciudades | RMP78 |
| Bombo | RMP72 (un reparto que choca con una pista: el bombo ya es de Beto) |

**Idea 3.** «Otras premisas: todos los quenistas están en la banda; ningún integrante de la banda baila en la diablada.
¿Qué se puede asegurar?» Datos: «“Ningún B es C”: nadie es B y C a la vez.» Es la trampa de San Marcos 2021 (20).

| Opción | Código |
| --- | --- |
| **Ningún quenista baila en la diablada** | correcta |
| Algunos quenistas bailan en la diablada | RMP74 («algunos» donde vale «ninguno») |
| Nada: las premisas no juntan a quenistas y danzantes | RMP78 (la sobrecorrección justo después del juego) |
| Todos los de la banda tocan quena | RMP73 (conversión ilícita) |

**Idea 4.** «Misma regla. Pasas por la calle y la pista está seca. ¿Qué se puede asegurar?» Datos: ninguno.

| Opción | Código |
| --- | --- |
| **Que no llovió** | correcta |
| Nada: la regla solo habla de cuando llueve | RMP78 |
| Que llovió y ya se secó | **RMP87**, hipótesis nueva: agregarle a la regla algo que no dice (otro momento, otra causa) |

**Idea 5.** «Dos padres y dos hijos fueron a pescar a la laguna. ¿Cuántas personas son, como mínimo?» Datos: ninguno.
(San Marcos 2022, 19.)

| Opción | Código |
| --- | --- |
| **Tres** | correcta: abuelo, padre e hijo; el del medio es hijo y padre |
| Cuatro | RMP62 (contar cada papel como una persona) |
| No se puede saber sin sus nombres | RMP78 |

Ninguna figura de «Predice» delata la respuesta por su color: en la 5, Pedro va en tinta como los demás hasta revelar.

---

## 5. Tabla de letras y símbolos

| Símbolo | Un solo significado en la unidad | Aviso |
| --- | --- | --- |
| A, B, C | Los grupos en la forma general «todos los A son B» (regla y «Mira» de la idea 3) | **Choca** con Ana, Beto y Ciro y con las alternativas A–E. Es la notación de los libros y se queda, pero solo en la forma general; en los ejercicios los grupos van con su nombre (quenistas, banda) y las personas nunca se abrevian por inicial |
| p, q | Primera y segunda parte del «si…, entonces…» (idea 4) | Se dicen en palabras la primera vez («p: llueve»). Sin ⇒, ⇏, → ni ~: en `aritmetica.logica-proposicional` el condicional se escribe p → q y ahí se estrena el símbolo |
| ✓ | Seguro: vale en todos los casos que quedan | — |
| ✗ | Imposible: lo tacha una pista o una ✓ | — |
| todos, algunos, ningún, único | Cuantificadores, con su definición en `datos` o en el glosario | **«Algunos» choca con el uso diario:** en lógica es «al menos uno, quizás todos», no «algunos sí y otros no» (RMP75). «Lee» lo avisa |
| sube n, baja m | El camino entre dos personas del árbol | La letra del nodo es la inicial del nombre que va escrito al lado |
| reparto, dibujo, caso | Lo mismo con tres nombres: una manera de cumplir todos los datos (idea 1, idea 3 e idea 4) | «Mira» de la idea 3 dice «un dibujo es un caso posible, como un reparto» |
| ⊂, «·» entre igualdades, «radio» | Se quitan | ⊂ es de conjuntos; el «·» se lee como otra igualdad; el aro se agranda con «tamaño del aro» |

Las letras de las alternativas que nombra un resuelto van en negrita (molde §3).

---

## 6. Colores: la paleta de deducción (el equivalente de §5b)

Aquí no hay magnitudes. Como hizo verbal, propongo **un papel fijo por color en toda la unidad**, elegido por lo que
§5b ya dice de cada token, en la teoría, los ejemplos, la escena y la práctica:

| Token | Papel en deducción | Idea 1 y 2 (cuadros) | Idea 3 (aros) | Idea 4 (condicional) | Idea 5 (árbol) |
| --- | --- | --- | --- | --- | --- |
| `o` naranja | de dónde se parte (el primer dato) | — | el grupo A (quenistas) | p: la lluvia | quien habla («mi …») |
| `i` turquesa | lo segundo (el segundo dato) | — | el grupo C (danzantes) | q: la pista mojada | — |
| tinta | lo que amarra o se usa sin color | personas, cosas, filas y columnas | el grupo B, el del medio (banda) | la cisterna | las líneas y los eslabones |
| `f` violeta | lo seguro y lo que se pide, ya comprobado | ✓ | la conclusión necesaria | lo que se concluye | la persona pedida (antes, «?» en tinta) |
| gris tenue y tachado | lo descartado | ✗ y repartos tachados | el dibujo que no cumple | la fila que la regla prohíbe | — |
| borde de marca (`--brand`) | un estado: la pista o el dato que se acaba de agregar | la pista nueva | — | el dato elegido | — |
| `h` carmín y `d` verde | **no se usan** | | | | |

- Pares que quedan juntos (valores de §5b, peor caso entre visión normal, protan, deutan y tritan): naranja–turquesa
  0,114 (A y C se cruzan en el aro), naranja–violeta 0,189, turquesa–violeta 0,101. Desaparecen naranja–verde (0,010) y
  rojo–verde (0,038), que hoy van pegados.
- ✓ y ✗ se distinguen por la forma, no solo por el color (WCAG 1.4.1); la ✗ gris debe llegar a 3:1 contra la tarjeta
  como marca (lo comprueba la prueba de la pieza).
- Lo mismo vale para los generadores con figura y para la escena `orden-informacion` cuando le toque su turno.

---

## 7. Práctica: qué existe y qué falta por idea

**Qué existe** (ningún papel trae `datos`; ningún generador separa sus tipos por unidad):

| Plantilla | Lo que es de esta unidad | Lo que no |
| --- | --- | --- |
| `orden-informacion` (escena, borrador, 18 casos, 10 de papel) | el modo `cuadro` del motor, con atributos (`resolver`, `posibles`, `pasos`, `necesario`, la variante `sinCruce`): es el motor natural de las ideas 1 y 2; el problema 6 del papel (deporte y mascota) es de la idea 2 | filas, mesa redonda, verdades y mentiras, certezas (otras tres unidades) |
| `rm-deduccion` (generador, 18 casos, 9 de papel) | `silogismo` → idea 3; `siempre-cierto` (frascos) → idea 4, nivel examen; `asignacion` (4 × 4 con condicionales y contrafácticos) → idea 4; `puntajes` (dados) → idea 2 | sus tipos también sirven a certezas y hoy salen mezclados en las dos prácticas |
| `rm-parentesco` (generador, 18 casos, 8 de papel) | `cadena`, `arbol` y `minimo` → idea 5; `billetes` y `edades` → idea 2, nivel examen | `orden` (sumas de edades) es de `ordenamiento-de-informacion` |

**Qué falta, por idea** (cada tipo con `datos` por línea, prueba en 400 semillas y papel, molde §7):

| Idea | Hay | Falta |
| --- | --- | --- |
| 1 Cuadro | solo el «Ahora tú» de la teoría (3 × 3) | un tipo **cuadro simple** de 3 o 4 personas con pistas positivas y negativas, sobre el motor de `orden-informacion` (2023-I 24, 2026-II 30); distractores RMP72, RMP77 y RMP78 |
| 2 Dos atributos | `puntajes`, `billetes`, `edades`; la escena | un tipo **cuadro con atributos** (3 o 4 personas, 2 o 3 listas, pistas que cruzan), que es lo que más sale (2027-I 30, 2025-II 27); distractores con `sinCruce` (RMP63) |
| 3 Aros | `silogismo` | nada nuevo; sus opciones ya traen RMP73 a RMP78 |
| 4 Condicional | `siempre-cierto`, `asignacion` | un tipo **condicional simple** («regla + dato: ¿qué es seguro?»), que hoy solo vive en la teoría; distractores RMP70 (afirmar lo segundo), RMP71 y RMP87 |
| 5 Árbol | `cadena`, `arbol`, `minimo` | nada nuevo; revisar que la cadena se diga desde «mi …» como en el examen |

Propuesta: los dos tipos de cuadro en un generador nuevo (por ejemplo `plantillas/rm-cuadros/`) que use `MotorOrden` y
no copie su lógica; el tipo condicional, dentro de `rm-deduccion`; y que los tres generadores lean `opts.unidad` para
separar sus tipos. Además: 15 ejemplos por idea (75), 3 o 4 ítems de esta unidad en la prueba de entrada y salida, y la
pregunta de votos de 2026-I reclasificada en planteo.

**Códigos.** Propongo cambiar los RMT-DED de la teoría por los RMP de los generadores, para que la medición junte los
mismos errores: 1 → RMP76 · 2 y 5 → RMP78 · 3 → RMP73 · 4 → RMP74 · 7 y 8 → RMP70 y RMP71 · 9 → RMP72 · 10 → RMP63 ·
11 → RMP62 · 13 → RMP64 · 14 → RMP61. El 6 pasa a RMP87, el único código nuevo (agregarle a la regla algo que no
dice); el 12 se va con la opción «Dos», que no tiene un error claro detrás.

---

## 8. Datos del mundo

La unidad casi no los necesita: las personas, las pistas y las familias son de problema y van sin fuente, pero deben ser
posibles (punto 10).

| Dato | ¿Fuente? |
| --- | --- |
| Campeonato del aniversario, comparsa con quena, charango y bombo, aros de educación física, cisterna que riega la calle | Situaciones de todos los días: sin fuente |
| Puno, Juliaca e Ilave como procedencia de los músicos | Lugares reales sin cifra: sin fuente |
| «En Juliaca llueve sobre todo de diciembre a marzo» | **No usar** sin SENAMHI. La regla del juego no lo necesita |
| «En muchas familias de Puno los primos crecen casi como hermanos» (Lee actual) | **Se quita:** afirma algo de la gente sin fuente |
| Historia: Aristóteles y la conclusión necesaria | Ya trae fuente (Stanford Encyclopedia of Philosophy) |
| Historia, si se quiere para los aros: los diagramas de Euler (cartas a una princesa, siglo XVIII) y los de Venn (1880) | Necesita fuente antes de usarla (MacTutor, Universidad de St Andrews); no doy fechas exactas de memoria |
| Edades, puntajes de dados y montos de billetes | Valores de problema; las cuentas las hace el motor |

---

## 9. Preguntas para Gerson

1. **¿El cuadro va primero?** Recomiendo que sí: es lo más concreto, es la mitad del examen (18 de 32) y en él se ve,
   contando repartos, la idea que después usan los aros y el condicional. La otra opción es dejar el orden de hoy (aros,
   condicional, cuadro, árbol), que empieza por lo más abstracto. Cambiar el orden no toca ningún `id`.
2. **¿Agregamos la idea `dos-atributos`?** Recomiendo que sí (cinco ideas). Sin ella, el cuadro de «Ahora tú» se queda en
   3 × 3 con un atributo, muy por debajo de lo que pide San Marcos. La otra salida es meterla como nivel examen de la
   idea 1, pero la pista que no nombra a nadie es un aprendizaje nuevo y merece su predicción.
3. **¿El condicional se queda aquí, en palabras?** Recomiendo que sí: el catálogo lo pide («deductivo directo e
   indirecto») y San Marcos lo usa en 2021 y 2023-II. Va sin tabla de verdad ni símbolos (→, ~), que son de
   `aritmetica.logica-proposicional`; no agrego esa unidad al `requiere` porque la idea presenta todo lo que usa.
4. **«Diagramas lineales»:** ¿qué son en las academias de Juliaca? No encontré su sentido en el repo ni en las preguntas.
   Si son comparaciones en una línea («Ana es mayor que Beto»), recomiendo dejarlas a `ordenamiento-de-informacion`; si
   son otra forma de dibujar clases, una tarjeta de «Lee» en la idea 3.
5. **Paleta de deducción (sección 6):** ¿la apruebas? Naranja lo primero, turquesa lo segundo, tinta lo que amarra,
   violeta lo seguro y lo pedido, gris lo descartado, sin carmín ni verde. Recomiendo que sí, con la misma tabla para
   las otras unidades de la rama Lógica.
6. **Códigos:** ¿cambio los RMT-DED por los RMP de los generadores y agrego RMP87 como hipótesis? Recomiendo que sí.
   Aparte, recomiendo un informe corto de errores de lógica (condicional y silogismos) antes de la rama siguiente, para
   que algún distractor pase de hipótesis a documentado.
7. **Objetos:** ¿te sirven el campeonato del colegio, la comparsa que baja de la combi, los aros del patio, la calle con
   la cisterna y la foto familiar? Los dibuja la sesión como prueba (`rm-objeto`) y tú decides cuáles reemplazas.
8. **Práctica:** ¿apruebas un generador nuevo de cuadros sobre el motor de `orden-informacion` y el tipo condicional en
   `rm-deduccion`? Recomiendo que sí: el tipo de pregunta que más sale en esta unidad hoy no tiene generador.
9. **Ficha:** el nombre «Razonamiento deductivo y parentesco» se queda (no se toca el `id`); `grado: 3` queda como dato
   informativo (decisión del 17 nov) y la cabecera de la teoría pasa a «5.º y preuniversitario». ¿De acuerdo?
