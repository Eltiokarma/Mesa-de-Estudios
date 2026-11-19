# Propuesta de ideas: «Ordenamiento de información» (`razonamiento-matematico.ordenamiento-de-informacion`)

19 nov 2026 · Etapa 5 del plan de calidad, rama «Lógica» de razonamiento matemático (segunda unidad, después de
Razonamiento deductivo) · fase 1 (`docs/metodo/unidad/1-ideas.md` §A). Gerson delegó el criterio: las dudas van al
final como «Decisiones tomadas (Gerson revisa después)», cada una con lo que se eligió, por qué y qué se descartó. No
hay ningún conflicto crítico.

Leído: `CLAUDE.md`, `docs/plan-calidad.md` §3, `docs/molde-unidad.md` entero, `docs/metodo/unidad/` (LEEME, 1 y 2),
las decisiones de las etapas 2, 3 y 4, la propuesta y la unidad terminada de Razonamiento deductivo (`calidad: 2`), con
su auditoría (`rutinas/auditoria/`) y sus dos rondas de lector en frío (`rutinas/frio/`), la teoría actual de esta
unidad (v0.2.0), su ficha en `catalogo/cursos/razonamiento-matematico.json`, sus tres plantillas (`orden-informacion`,
`rm-parentesco`, `rm-deduccion`), `docs/investigacion/codigos-rm-procesos.md`,
`docs/investigacion/aritmetica-razonamiento-ideas-erroneas.md`, `docs/clasificacion/trampas-admision-unmsm/rm-a.md`, la
matriz `docs/teoria/matriz/razonamiento-matematico.json`, `docs/temario-completo.md`, la prueba del curso y las 21
preguntas de San Marcos de esta unidad en `docs/datos/admision-unmsm.csv`. Las cuentas de §3 y §4 se rehicieron con un
script aparte (scratchpad `e5-rm/propuesta.py`, fuerza bruta sobre todos los órdenes).

**Ojo:** la unidad entra solo en San Marcos (tema 3). No hay datos de la UNI ni de la UNA Puno. El informe de errores
de aritmética y razonamiento dice que para ordenamiento «no hay literatura de ideas erróneas como tal»: todos los
distractores de abajo son hipótesis que salen de las trampas de los solucionarios (§4).

## Qué se pregunta en San Marcos (2019-I a 2027-I)

21 preguntas clasificadas en esta unidad, más las que llegan por decisión escrita (mesa del 18 nov: los tipos
«puntajes» y «edades» de la práctica vieja de Razonamiento deductivo pasan aquí). **La mitad son mesas redondas.**

| Qué piden | Cuántas | Periodos (número de pregunta) | Trampa anotada en la clasificación |
| --- | --- | --- | --- |
| Mesa redonda de 6 u 8: derecha, izquierda, junto a, frente a, sillas numeradas, parejas, alternancia, un asiento vacío, oficios | 11 | 2019-I (22), 2019-II (22), 2022 (29), 2023-II (20), 2024-I (18, 22), 2024-II (16), 2025-I (23), 2025-II (27), 2027-I (27) y la mesa hexagonal de 2019-I | confundir izquierda y derecha en la mesa (7 de las 11); elegir lo posible y no lo necesario |
| Fila con izquierda y derecha (cinco personas con sus edades; tres parejas alternadas) | 2 | 2023-I (23, 24) | confundir la izquierda y la derecha de quien habla |
| Orden de llegada (antes, después, quiénes quedan entre dos) | 2 | 2020-I (27), 2024-II (20) | — |
| Pisos de un edificio (distancias en pisos, pisos vacíos, vecinos de piso) | 2 | 2023-II (22), 2026-II (24) | — |
| Comparar cantidades: edades con «no es mayor», grupos por sus diferencias | 2 | 2019-I (31), 2020-I (30) | leer «no mayor» como «menor», sin el empate |
| Valores con sumas y diferencias: sumas de edades de a dos, números consecutivos, tres montos | 3 | 2021 (29), 2024-I (16), 2024-II (16) | — |
| Llegan de Razonamiento deductivo: puntajes de dados y edades con primos y pares | 3 | 2019-I (32), 2023-II (17, 18) | — |

Banco Cuzcano: unas 35 fichas (ordenamiento lineal 23, circular 12). La prueba de entrada y salida del curso no tiene
ningún ítem de esta unidad. El «ordenamiento poligonal» del catálogo solo aparece una vez, y como mesa hexagonal de
seis sillas, que se resuelve igual que la redonda. Nadie pregunta de cuántas maneras se sientan n personas: eso es
análisis combinatorio.

---

## 0. Diagnóstico de la teoría actual contra el contrato

Tres ideas (`orden-lineal`, `orden-circular`, `mesa-cuadrada`) y tres mesas de laboratorio con retos que el motor
comprueba. La base sirve: todo sale de contar los órdenes que cumplen las pistas, y dice bien que «a la izquierda de»
no es «junto a».

1. **Punto 1: ninguna primera pantalla tiene un objeto.** Son una tabla de órdenes, círculos con iniciales y un
   cuadrado con números. La promoción que posa para la foto y el almuerzo de Puno solo están escritos en «Lee».
2. **Puntos 2, 3 y 12:** sin `mision`, `leyenda`, `aprendizaje`, `actividad` ni `pregunta`. Las consignas describen
   botones («agrega pistas una a una y mira»). No declara `calidad: 2`.
3. **Puntos 3 y 5:** las personas van por su inicial en las sillas (A, B, C: chocan con las alternativas); la regla usa
   `a < b`, `⇒` y `(n − 1)!` sin presentarlos; el «·» separa dos relaciones en la regla de la idea 3.
4. **Punto 7, lecturas que no dicen nada:** «Pista 2: Ciro está junto a Beto» repite el dato y «A la derecha de Ana:
   Beto, en todos los giros» es fija.
5. **§5b, colores:** la persona de referencia en turquesa, lo que se pregunta en naranja, lo seguro en **verde** y lo
   descartado en **carmín**: verde junto a naranja (0,010 con protanopía) y rojo junto a verde (0,038 con
   deuteranopía), los dos pares que el molde prohíbe. Además, ningún color es fijo: Ana es turquesa en una figura y
   naranja en otra.
6. **Punto 13:** ningún ejercicio trae `datos`. «Así se resuelve» es el generador de «Ahora tú» con la semilla + 900.
   No hay ejemplos resueltos (0 de 45).
7. **«Ahora tú» no llega al examen:** la fila es de 4 con 2 o 3 pistas; San Marcos pone 5 o 6 personas, pisos vacíos,
   llegadas, comparaciones con sumas y mesas de 8 con parejas. La mesa cuadrada pregunta solo «¿qué silla queda frente
   a la 3?».
8. **La izquierda de quién.** Nada dice hacia dónde mira la fila. Es justo la trampa que más anota la clasificación (7
   preguntas). La matriz del curso lo pide: «declarar hacia dónde miran».
9. **La predicción de la idea 2 es combinatoria** («¿de cuántas maneras se sientan 4 personas en una mesa redonda?»):
   ningún examen la pregunta en esta unidad y pide `(n − 1)!`, que es de otro curso.
10. **Media unidad no está:** llegadas, pisos, comparaciones y valores con sumas (9 de las 21 preguntas, y las 3 que
    llegan) no tienen idea. Códigos RMT-ORD-1 a 10 sin informe; la cabecera dice «postulante de 3.º a 5.º».

---

## 1. Las ideas, en orden

Propongo **seis** (el tope). Las tres de hoy conservan su `id` y sus mesas; se agregan `posiciones`, `comparaciones` y
`con-numeros`. Se reparten como el examen: dos de filas (6 preguntas), dos de cantidades (5, más las 3 que llegan) y
dos de mesas (11).

| # | `id` | Título (≤ 6) | `aprendizaje` (≤ 25 palabras) |
| --- | --- | --- | --- |
| 1 | `orden-lineal` | Ordenar en una fila | «A la izquierda de» ordena sin pegar y «junto a» pega sin ordenar; un puesto es seguro si coincide en todos los órdenes que quedan. |
| 2 | `posiciones` (nueva) | Pisos y puestos de llegada | «Dos pisos más arriba» amarra a dos personas en un bloque que sube y baja entero; se prueba cada lugar donde el bloque cabe. |
| 3 | `comparaciones` (nueva) | Más que, menos que | Cada comparación es una flecha del menor al mayor; solo se ordena lo que una cadena une. «No es mayor» admite el empate. |
| 4 | `con-numeros` (nueva) | Ordenar con sumas y diferencias | Con los valores a la vista, una suma dice qué par es; si dos pares suman igual, quien gana en uno pierde en el otro. |
| 5 | `orden-circular` | La mesa redonda | Mirando al centro, la derecha de cada uno va contra el reloj; girar a todos no cambia el orden, por eso se fija a uno. |
| 6 | `mesa-cuadrada` | Frente a frente | «Frente a» es la silla que queda al cruzar la mesa: en la redonda con sillas pares, media vuelta; en la cuadrada, el lado opuesto. |

`pregunta` de cada idea, para el Resumen: 1. «¿“A la izquierda de” quiere decir “junto a”?» · 2. «¿Cómo se ubica a dos
vecinos separados por dos pisos?» · 3. «¿Cuándo dos comparaciones alcanzan para ordenar a tres?» · 4. «¿Qué dice una
suma sobre quién tiene más?» · 5. «¿Hacia dónde queda la derecha de quien mira al centro?» · 6. «¿Qué silla queda frente
a otra en cada mesa?»

**Por qué cada una va ahí y qué da por sabido**

1. **Ordenar en una fila.** Es el paso más corto desde Razonamiento deductivo: un orden es un reparto de personas en
   puestos, y «seguro» sigue siendo lo que vale en todos los casos que quedan. Lo nuevo es el idioma de las pistas («a
   la izquierda de», «junto a», «inmediatamente», «entre», «extremo») y el dibujo de la fila. Todos miran hacia el
   mismo lado que el alumno (se ven de espaldas), así la izquierda del dibujo es la de ellos; la foto vista de frente
   queda como caso de nivel examen. Da por sabido: ✓ segura y reparto (unidad anterior, en `requiere`).
2. **Pisos y puestos de llegada.** La misma fila, parada o en el tiempo, con dos cosas nuevas: las distancias («dos
   pisos más arriba», «llegó tres puestos después») y los lugares vacíos. Necesita la idea 1 (orden, extremo, entre).
3. **Más que, menos que.** Deja de haber puestos: se ordenan cantidades que no se conocen. Aparece el orden a medias
   (dos personas sin comparar) y el empate. Necesita «seguro o solo posible» (idea 1).
4. **Ordenar con sumas y diferencias.** Las cantidades ya tienen número o se suman de a dos. Usa la cadena de la idea
   3 y el reparto de la unidad anterior. Aquí caen los tipos «puntajes», «edades» y «orden» de la práctica vieja. «Par»
   y «primo» van como dato; no pide `planteo-de-ecuaciones` (no se despeja nada).
5. **La mesa redonda.** Lo más preguntado y lo que más confunde va después de dominar la fila: la mesa es una fila
   que se cierra, sin extremos, y la derecha ya no es la del dibujo. Necesita las ideas 1 y 2 (junto a, distancias).
6. **Frente a frente.** «Frente a», sillas numeradas, asiento vacío, parejas y alternancia, en la redonda y en mesas
   con lados. Su nivel examen junta la mesa con un cuadro de oficios (2027-I), que viene de la unidad anterior.

**Qué no entra:** el cuadro de doble entrada y el de dos atributos (Razonamiento deductivo; aquí solo se usan), contar
de cuántas maneras se sientan (`(n − 1)!`, análisis combinatorio), suponer quién miente (Verdades y mentiras) y el peor
caso (Certezas). La palabra «suponer» no se usa: aquí se «prueba cada lugar».

---

## 2. Objeto de la primera pantalla

Pieza nueva `rm-orden`, dibujada por la sesión como prueba (`data-prueba`), con su prueba numérica de encuadre y
rótulos. El esquema (la tira de puestos, la lista de órdenes) va pegado al objeto, nunca solo. Sigue el campeonato del
aniversario del colegio, que el alumno ya conoce de la unidad anterior.

| Idea | Objeto | Qué es qué |
| --- | --- | --- |
| 1 | **La banca frente a la cancha**, vista desde atrás: Ana, Beto, Ciro y Dina miran el partido del campeonato. Dina ya está sentada en el puesto 4; los otros tres esperan de pie | cada lugar de la banca es un puesto, numerado de izquierda a derecha; debajo, cada renglón de «Órdenes» es una manera de sentarlos |
| 2 | **Un edificio de cinco pisos** con una ventana por piso (y, en los ejemplos, la meta de la carrera del aniversario con su podio) | cada ventana es un lugar; dos vecinos amarrados por «dos pisos más arriba» suben y bajan juntos |
| 3 | **La formación por talla para el desfile escolar**: cuatro alumnos en fila, tapados hasta que una cadena de pistas los ordena | cada pista es una flecha del más bajo al más alto, dibujada sobre las cabezas |
| 4 | **Tres sobres de la rifa del aniversario** con billetes de 20, 50 y 100 soles, y los tres ganadores | cada sobre va a una persona; una pista de suma encierra dos sobres |
| 5 | **El almuerzo en la mesa redonda**, visto desde arriba: cinco platos de chairo, cada persona con la cuchara en su mano derecha. Ana abajo, de espaldas, como en la banca | la cuchara marca la derecha de cada uno; una flecha contra el reloj la recorre |
| 6 | **La mesa del compartir del aula**: carpetas juntas, primero en ronda de 8 y después en cuadrado, con un cartelito de número en cada silla | una línea cruza la mesa de una silla a la de enfrente |

---

## 3. Misión de «Juega» (meta que el motor comprueba)

| Idea | Contexto + misión | Controles | `logrado` | Lectura en vivo (enuncia una relación) |
| --- | --- | --- | --- | --- |
| 1 | «Cuatro amigos miran el partido desde la banca. Dina ya ocupa el puesto 4.» **Agrega pistas una a una: ¿con cuántas queda fijo el puesto de Beto?** | `n` de 0 a 3 pistas: Ana está a la izquierda de Beto · Ciro no está junto a Dina · Ciro no está en un extremo | `val.n === 2` | n = 1: «Quedan 3 órdenes; en uno, Ciro se sienta entre Ana y Beto.» n = 2: «Quedan 2 órdenes; en ambos, Beto va en el puesto 3: seguro.» n = 3: «Queda 1 orden: Ana, Ciro, Beto, Dina.» |
| 2 | «Beto vive dos pisos más arriba que Ana. Ciro vive en el piso 3.» **Mueve a Ana hasta que no se rompa ninguna pista.** | `a`: piso de Ana, de 1 a 5 (o arrastrar el bloque) | `val.a === 2` | Ana en el 1: «Beto cae en el piso 3, que es de Ciro.» Ana en el 2: «Ana en el 2 y Beto en el 4: cabe y no choca.» Ana en el 4: «Beto caería en el piso 6: el bloque no cabe.» |
| 3 | «Se forman por talla para el desfile.» **Agrega pistas hasta saber quién es el más bajo.** | `n` de 0 a 3: Ana es más alta que Beto · Ciro es más alto que Beto · Dina es más baja que Beto | `val.n === 3` | n = 2: «Ana y Ciro superan a Beto; entre Ana y Ciro no hay flecha.» n = 3: «Dina es la más baja; la más alta puede ser Ana o Ciro.» |
| 4 | «Tres sobres: 20, 50 y 100 soles.» **Agrega pistas hasta saber cuánto recibió cada uno.** | `n` de 0 a 2: Beto y Ciro juntos recibieron 120 · Ana recibió más que Beto | `val.n === 2` | n = 1: «120 = 20 + 100: Ana tiene el sobre de 50, aunque la pista no la nombra.» n = 2: «Ana 50, Beto 20, Ciro 100.» |
| 5 | «Ana está abajo, de espaldas a ti, mirando al centro.» **Sienta a Beto a la derecha de Ana.** | `b`: silla de Beto, las 4 libres (o arrastrarlo) | Beto en la silla que sigue a la de Ana contra el reloj | bien: «Beto está a la derecha de Ana: del lado de su cuchara.» mal: «Beto quedó a la izquierda de Ana: su cuchara apunta al otro lado.» |
| 6 | «Ronda de 8 sillas numeradas en orden.» **Sienta a Ana frente a la silla 7.** | `s`: silla de Ana, de 1 a 8 (o arrastrarla) | `val.s === 3` | «Frente a la silla 3 está la 7: cuatro sillas más allá, media vuelta.» |

Cuentas rehechas aparte: idea 1, 6 → 3 → 2 → 1 órdenes y el puesto de Beto queda fijo con 2 pistas; idea 2, de los
cinco lugares de Ana el bloque cabe en tres y solo uno no choca; idea 3, 24 → 12 → 8 → 2; idea 4, 6 → 2 → 1 repartos
(con la suma sola quedan 2 y en los dos Ana tiene 50). Ninguna misión está cumplida al abrir.

---

## 4. La predicción de cada idea

Ninguna pregunta por lo que el juego ya mostró. Los `datos` llevan solo las reglas del problema y las definiciones,
nunca la regla de la idea. La app baraja las opciones. **Todos los códigos son hipótesis**: RMP ya escritos en
`codigos-rm-procesos.md` o nuevos de esta unidad (RMP88, RMP89 y RMP140 a RMP143, §7).

**Idea 1.** «Otra banca de cuatro, con otras pistas: Ciro está junto a Ana y también junto a Beto. ¿Qué es seguro?»
Datos: «Cada puesto es de una sola persona.» (El juego mostró que «a la izquierda de» no pega; esta va por el otro
lado: «junto a» no ordena, y aun así algo queda seguro.)

| Opción | Código |
| --- | --- |
| **Ciro está entre Ana y Beto** | correcta: quedan 4 órdenes de 24 y vale en los 4 |
| Ana está a la izquierda de Ciro | RMP89 (leer «junto a» con un lado fijo); pasa en 2 de los 4 |
| Ciro está en el puesto 2 | RMP77 (posible, no necesario); pasa en 2 de los 4 |
| Nada: «junto a» no dice de qué lado | RMP78 (creer que no se deduce nada) |

**Idea 2.** «En otro edificio, Eva vive tres pisos más abajo que Fito. ¿Cuántos pisos hay entre los dos?» Datos: «El
edificio tiene 5 pisos.»

| Opción | Código |
| --- | --- |
| **Dos** | correcta (Eva en el 1 y Fito en el 4, o en el 2 y en el 5: siempre dos en medio) |
| Tres | RMP1 (puntos contra intervalos: cuenta los saltos como pisos) |
| Depende de en qué piso viva Eva | RMP78 (el bloque sube y baja, pero su hueco no cambia) |
| Uno | RMP1 (resta uno de más) |

**Idea 3.** «Una pista más: Eva no es más alta que Fito. ¿Qué se puede asegurar?» Datos: ninguno. (San Marcos 2020-I, 30.)

| Opción | Código |
| --- | --- |
| **Eva mide menos que Fito, o lo mismo** | correcta |
| Eva es más baja que Fito | RMP141 (leer «no es mayor» como «es menor», sin el empate) |
| Fito es más bajo que Eva | RMP64 (dar vuelta la comparación) |
| Nada: no dice cuánto miden | RMP78 |

**Idea 4.** «Las edades de Ana y Beto suman lo mismo que las de Ciro y Dina. Ana es mayor que Ciro. ¿Qué se puede
asegurar?» Datos: «Las cuatro edades son distintas.» (San Marcos 2021, 29.)

| Opción | Código |
| --- | --- |
| **Beto es menor que Dina** | correcta (lo que Ana le gana a Ciro, Beto lo pierde con Dina) |
| Beto es mayor que Dina | RMP143 (llevar la comparación en el mismo sentido al otro par) |
| Beto y Dina tienen la misma edad | RMP72 (choca con un dato: las sumas no serían iguales) |
| Nada: faltan las edades | RMP78 |

**Idea 5.** «Dina se sienta arriba, de cara a ti, mirando al centro. Eva está a la derecha de Dina. En el dibujo, ¿de
qué lado de Dina queda Eva?» Datos: «Todos miran al centro de la mesa.» La figura va sin cucharas.

| Opción | Código |
| --- | --- |
| **A la izquierda del dibujo** | correcta |
| A la derecha del dibujo | RMP140 (tomar la derecha del dibujo por la de quien mira al centro) |
| Depende de cómo se gire la mesa | RMP78 |

**Idea 6.** «Ahora la mesa es cuadrada, con dos sillas por lado, numeradas del 1 al 8 en orden. ¿Qué silla queda frente
a la 1?» Datos: «“Frente a”: la silla que se mira al cruzar la mesa.» `orden: 'fijo'` (los números se ven en la figura).

| Opción | Código |
| --- | --- |
| La 5 | RMP142 (media vuelta, como en la redonda) |
| **La 6** | correcta |
| La 2 | RMP142 (la del mismo lado) |
| La 8 | RMP142 (la que dobla la esquina) |

Ninguna figura de «Predice» delata la respuesta por su color: lo pedido va en tinta o con «?» hasta comprobar.

---

## 5. Tabla de letras y símbolos

| Símbolo | Un solo significado en la unidad | Aviso |
| --- | --- | --- |
| 1, 2, 3, … bajo la banca o en la silla | El número del puesto, contado de izquierda a derecha (o el de la silla) | En la fila se dice «puesto»; en la mesa, «silla»; en el edificio, «piso»; en la carrera, «puesto de llegada» |
| orden | Una manera de ubicar a todos, uno por lugar (lo que en la unidad anterior fue «reparto») | «Lee» de la idea 1 hace el puente: un orden es un reparto de personas en puestos |
| A–E | Solo las alternativas de un ejemplo tipo examen | Las personas nunca se abrevian por su inicial: en las sillas y los puestos va el nombre completo, de 3 a 5 letras |
| ✓ violeta, marco violeta | Seguro: coincide en todos los órdenes que quedan | Igual que en Razonamiento deductivo |
| raya gris sobre un orden | Orden descartado por una pista | Igual que el reparto tachado |
| flecha de la idea 3 | Va del menor al mayor | Sin `<` ni `>` en la teoría; en los datos de nivel examen pueden ir, como en el examen, dichos en palabras la primera vez |
| flecha curva de la idea 5 | El sentido en que avanza «a la derecha» en la mesa: contra el reloj | Se dice «contra el reloj»; «antihorario» queda en el glosario |
| `a < b`, `⇒`, `(n − 1)!`, iniciales | Se quitan | Los dos primeros son de otro curso; el tercero, combinatoria |

Nombres que no se confunden al leer ni al abreviar: Ana, Beto, Ciro, Dina, Eva, Fito (y en los ejemplos Rosa, Iván,
Nora, Lucho, Maru, Teo, Sara, Gino, Pía, Omar). Ningún par empieza con la misma letra en un mismo problema.

---

## 6. Colores: la paleta de deducción, la misma de la rama

La misma tabla que Gerson aprobó para Razonamiento deductivo (17 nov), con el papel de cada color dicho para esta
unidad. Un papel fijo por color en la teoría, los ejemplos, la escena y la práctica.

| Token | Papel | Ideas 1 y 2 (fila, pisos) | Ideas 3 y 4 (cantidades) | Ideas 5 y 6 (mesas) |
| --- | --- | --- | --- | --- |
| tinta | lo que amarra | personas, puestos, pistas, la banca, el edificio | personas, flechas, sobres | la mesa, las sillas, los nombres |
| `o` naranja | lo primero: desde quién se mide | — | — | la persona de referencia (Ana, la primera que se sienta) |
| `i` turquesa | lo segundo: hacia dónde se mide | — | — | la flecha de «a la derecha» y la línea de «frente a» |
| `f` violeta | lo seguro y lo pedido, ya comprobado | el puesto fijo, la persona pedida | el lugar seguro en la cadena, el monto pedido | la silla pedida |
| gris tenue y tachado | lo descartado | órdenes tachados | repartos tachados | mesas tachadas |
| `h` carmín y `d` verde | **no se usan** | | | |

- Las ideas 1 a 4 usan solo tinta, violeta y gris, como las ideas 1 y 2 de la unidad anterior. Naranja y turquesa
  entran recién en la mesa, donde hace falta decir desde quién y hacia dónde.
- Pares que quedan juntos (§5b): naranja–turquesa 0,114, naranja–violeta 0,189, turquesa–violeta 0,101. Desaparecen el
  verde junto al naranja y el carmín junto al verde de la versión de hoy.
- Lo seguro y lo descartado se distinguen también por la forma (marco contra raya), no solo por el color.
- La pieza fija los papeles (`PAPELES`) y la prueba de la unidad falla si una figura que se ve antes de responder trae
  violeta.

---

## 7. Práctica: qué existe y qué falta por idea

**Qué existe**

| Plantilla | Lo que es de esta unidad | Lo que no |
| --- | --- | --- |
| `orden-informacion` (escena, borrador; 10 de papel) | los modos `lineal` y `circular` del motor (`resolver`, `quien`, `necesario`, `variante`: «inmediata», «sentidoInvertido»); papel p1 a p5 | cuadro, verdades y mentiras, certezas |
| `rm-parentesco` (generador) | `orden` (cuatro personas con sumas de a dos) y `edades` (primos, pares y suma mínima): ya separados por unidad | cadena, árbol, mínimo y billetes (Razonamiento deductivo) |
| `rm-deduccion` (generador) | `puntajes` (tres dados; orden entre puntajes): ya separado por unidad | silogismo, siempre cierto, asignación, condicional |

**Qué falta, por idea** (cada tipo con `datos` por línea, prueba en 400 semillas y papel con `unidades`, molde §7)

| Idea | Hay | Falta |
| --- | --- | --- |
| 1 Fila | la escena vieja | tipo **fila**: 4 a 6 personas con izquierda, derecha, junto a, inmediatamente, extremo, entre; «¿quién va en el puesto k?» y «¿cuál es necesariamente verdadera?»; distractores RMP88, RMP89, RMP77, RMP72 |
| 2 Pisos y llegadas | nada | tipo **posiciones**: pisos o llegadas con distancias y un lugar vacío; «¿quiénes quedan entre…?»; RMP1, RMP88 |
| 3 Comparar | nada | tipo **cadena**: 4 o 5 cantidades con «más que», «menos que» y «no es mayor que»; «¿quién es el segundo?», «¿qué no se puede saber?»; RMP141, RMP64, RMP77 |
| 4 Con números | `orden`, `edades`, `puntajes` | tipo **montos** (tres valores dados con una suma y una comparación) y el de números consecutivos (2024-I, 16); RMP143, RMP72 |
| 5 Mesa redonda | la escena vieja | tipo **mesa**: 5 o 6 personas con derecha, izquierda y junto a; RMP140, RMP89 |
| 6 Frente a | nada | tipo **frente**: 6 u 8 sillas con frente a, numeradas, un asiento vacío, parejas alternadas y, en nivel examen, oficios; RMP142, RMP140 |

Propuesta: un generador nuevo `plantillas/rm-ordenamiento/` con esos seis tipos, por idea, que use `MotorOrden` para
la fila y la mesa (sin copiar su lógica) y fuerza bruta propia para lo demás. `rm-parentesco` y `rm-deduccion` siguen
dando sus tres tipos a la idea 4. Además: 15 ejemplos por idea (90), 3 o 4 ítems de esta unidad en la prueba de entrada
y salida, y la escena `orden-informacion` en «Más mesas del tema» (`"rehacer": true`) hasta que le toque su turno.

**Códigos.** Los RMT-ORD de la teoría de hoy se cambian por RMP: 1 → RMP88 · 2 y 4 → RMP78 · 3 → RMP72 · 8 → RMP140 ·
9 y 10 → RMP142; 5, 6 y 7 se van con la predicción de combinatoria. Códigos nuevos, todos hipótesis, anotados en
`codigos-rm-procesos.md`:

| Código | Error | De dónde sale |
| --- | --- | --- |
| RMP88 | Leer «a la izquierda de», «antes de» o «más arriba que» como «inmediatamente»: pegar lo que la pista solo ordena | la variante «inmediata» del motor; matriz del curso («confundir orden relativo con posiciones consecutivas») |
| RMP89 | Leer «junto a» o «entre» con un lado fijo: ordenar lo que la pista solo pega | nueva |
| RMP140 | Tomar la izquierda o la derecha del dibujo por la de la persona (en la mesa, o de quien habla de frente) | rm-a #10 (7 preguntas) |
| RMP141 | Leer «no es mayor que» como «es menor que»: olvidar el empate | 2020-I (30) |
| RMP142 | En una mesa con lados, tomar por «frente» la media vuelta, la silla del mismo lado o la de la esquina | RMT-ORD-9 y 10 de la teoría vieja |
| RMP143 | En dos sumas iguales, llevar la comparación en el mismo sentido al otro par | 2021 (29) |

---

## 8. Datos del mundo

La unidad casi no los necesita: personas, pistas y edades son de problema y van sin fuente, pero deben ser posibles.

| Dato | ¿Fuente? |
| --- | --- |
| Campeonato del aniversario, la banca del patio, el desfile escolar por talla, la rifa, el compartir del aula | Situaciones de todos los días: sin fuente |
| Billetes de 20, 50 y 100 soles | Existen (BCRP); no se afirma nada más de ellos |
| Chairo en el almuerzo | Plato conocido en Puno: se nombra, sin cifras |
| Edificio de cinco pisos | De problema; sin dirección ni nombre |
| Edades de escolares (14 a 18 años), estaturas (de 1,48 m a 1,75 m) | Valores de problema, creíbles para 5.º |
| Historia: Boole y *Las leyes del pensamiento* (1854) | Ya trae fuente (Stanford Encyclopedia of Philosophy) y dice que no es el origen de estos acertijos: se queda |

---

## 9. Riesgos de orden (`requiere`)

- `requiere: ['razonamiento-matematico.razonamiento-deductivo']` se queda y ahora sí se usa: la idea 1 parte de
  «reparto» y de «seguro: vale en todos los casos», y el nivel examen de la idea 6 usa el cuadro de dos listas.
- La idea 4 suma y resta edades y montos, pero no plantea ecuaciones: no se agrega `planteo-de-ecuaciones` (está en
  otra rama y cerraría el paso). «Par» y «primo» van como dato.
- Verdades y mentiras y Certezas, las unidades que siguen, no reciben nada adelantado: aquí no hay quién miente ni
  peor caso, y la palabra «suponer» no aparece.
- Dentro de la unidad: la mesa (ideas 5 y 6) usa «junto a» de la idea 1 y las distancias de la idea 2; la idea 4 usa
  la cadena de la idea 3. Ninguna idea usa algo que llega después.
- El catálogo gana un tema, «Ordenamiento por comparación» (ideas 3 y 4); las ideas 1 y 2 van en «Ordenamiento
  lineal», la 5 en «Ordenamiento circular» y la 6 en «Ordenamiento circular» y «Ordenamiento poligonal».

---

## 10. Decisiones tomadas (Gerson revisa después)

1. **Seis ideas, tres nuevas.** Elegido: fila, pisos y llegadas, comparar, con números, mesa redonda y frente a.
   Motivo: 9 de las 21 preguntas (y las 3 que llegan) son de llegadas, pisos, comparaciones y sumas, y hoy no tienen
   idea. Descartado: dejar las tres de hoy y mandar todo eso a «Ahora tú» de la fila, que quedaría con seis destrezas.
2. **La fila se ve de espaldas.** Elegido: los cuatro miran la cancha y el alumno los ve desde atrás, así la izquierda
   del dibujo es la de ellos. Motivo: quita la trampa de la izquierda de la primera idea y la reserva para la mesa,
   donde es el tema. Descartado: la foto de promoción vista de frente, que obliga a explicar el espejo antes que nada;
   queda como un ejemplo de nivel examen de la idea 1 (San Marcos 2023-I).
3. **Dina ya está sentada en el juego de la idea 1.** Elegido: con un puesto dado quedan 6 órdenes y se ven todos, con
   los tachados a la vista, como los 6 repartos de la unidad anterior. Motivo: con cuatro libres son 24 y no caben en
   el celular. Descartado: tres personas en tres puestos (muy poco para ver que «a la izquierda» deja un hueco) y
   mostrar solo los órdenes que quedan (se pierde lo tachado).
4. **El juego de la idea 1 agrega pistas; sentar fichas con el dedo va al laboratorio.** Motivo: es el gesto que el
   alumno ya aprendió en la unidad anterior y deja ver lo que importa (qué órdenes quedan). Descartado: que la misión
   sea armar un orden que cumpla todo, porque premia al primero que cumple y la idea es justo lo contrario.
5. **Sale la predicción de `(n − 1)!`.** Elegido: la predicción de la mesa pregunta por la derecha de quien está de
   cara al alumno. Motivo: es la trampa de 7 preguntas, y contar maneras de sentarse es combinatoria. Descartado:
   dejarla como dato curioso en «Mira».
6. **«Frente a» junta la mesa redonda y la cuadrada en la idea 6, que conserva el `id` `mesa-cuadrada`.** Motivo: el
   examen pregunta «frente a» en mesas redondas de 6 y 8 (5 veces) y casi nunca en una cuadrada. Descartado: una idea
   solo para mesas con lados.
7. **«Puntajes», «edades» y «orden» van en la idea 4, no en una idea propia cada uno.** Motivo: los tres ordenan
   valores con sumas y condiciones. Descartado: dejarlos sin idea, como estaban en la unidad anterior (auditoría M9).
8. **Códigos:** los RMT-ORD pasan a RMP y se agregan RMP88, RMP89 y RMP140 a RMP143 como hipótesis. Descartado:
   reusar RMP64 («adelante por atrás») para izquierda y derecha, porque junta dos errores distintos.
9. **Tema nuevo en el catálogo:** «Ordenamiento por comparación». Motivo: el validador exige que cada idea declare un
   tema del catálogo y las ideas 3 y 4 no son lineales ni circulares. Descartado: forzarlas en «Ordenamiento lineal».
10. **Sin «<» ni «>» en la teoría** (flechas y palabras); en los datos de nivel examen sí pueden ir, dichos en palabras
   la primera vez. Descartado: escribir toda la idea 3 con desigualdades, que es notación de álgebra.
11. **Práctica en un generador nuevo, `rm-ordenamiento`,** sobre `MotorOrden`; la escena vieja pasa a «Más mesas del
    tema». Descartado: seguir sumando tipos a `rm-parentesco` y `rm-deduccion`, que son de otra unidad.
12. **Ficha:** `grado: 3` queda como dato informativo (decisión del 17 nov) y la cabecera pasa a «5.º y
    preuniversitario». La historia de Boole se queda.

---

## 11. Fase 3 (19 nov): lo que cambió al escribir las ideas 2 a 6

Decisiones tomadas al escribir (Gerson revisa después), además de las de §10:

1. **Las mesas pasan a la pieza `rm-orden`** (escena `mesa`, redonda o cuadrada) y dejan `rm-plano`: así la paleta
   de deducción es la misma en toda la unidad (naranja para la referencia, turquesa para la flecha y la línea, violeta
   para lo seguro) y las mesas viejas con verde y carmín desaparecen, también en el laboratorio. Descartado: repintar
   `rm-plano`, que usan otras unidades.
2. **Sillas numeradas contra el reloj desde la de abajo** (en la cuadrada, desde la de abajo a la izquierda), el mismo
   sentido que «a la derecha». Frente a la 1 sigue siendo la 6, y la 5, la 2 y la 8 siguen siendo los distractores.
   Descartado: la numeración en el sentido del reloj desde arriba de la versión vieja, que obligaba a explicar dos
   sentidos.
3. **La idea 3 dibuja la cadena en columnas**, del más bajo al más alto, con quien no tiene flechas aparte (marco
   cortado). Los alumnos de la formación se dibujan del mismo alto: nadie sabe cuánto mide cada uno. Descartado:
   alturas que suben, que afirmarían comparaciones que las pistas no dan.
4. **La idea 4 usa dos barras del mismo largo** para las dos sumas iguales (predicción, «Mira» y regla): la franja que
   uno gana arriba es la que el otro gana abajo. Las edades de los ejemplos se muestran en los mismos sobres de la rifa
   (como tarjetas). Descartado: una balanza, que sugiere pesos.
5. **Práctica en un generador nuevo, `rm-ordenamiento`** (11 tipos, `TIPOS_POR_IDEA`), con el motor de
   `orden-informacion` para la fila y la mesa; la escena vieja pasa a «Más mesas del tema» (`"rehacer"` solo para esta
   unidad). Los dos ítems de la prueba del curso (rm-20, pisos; rm-21, mesa) van a la **reserva**: las formas ya tienen
   10 pares.
6. **Laboratorio:** «Sentar con el dedo» (la banca de la idea 1, con las cuatro pistas del juego), la mesa redonda y la
   cuadrada libres con la paleta nueva, y «Pistas a elegir», que se queda.
