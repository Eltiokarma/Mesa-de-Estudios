# Auditoría de contenido: «Congruencia de triángulos» (geometria.congruencia)

19 nov 2026. Auditor externo (fase 7 del método, `docs/metodo/unidad/5-auditor.md`), que no escribió la unidad.
Contrato: `docs/plan-calidad.md` §3 y §5. Formato: `docs/teoria.md` 4e, 4f, 4h, 4i, 4j y §5. Vara: `docs/molde-unidad.md`
§10. Reglas automáticas: `docs/metodo/unidad/reglas-validador.md`. Decisiones: `docs/etapa5/propuesta-geometria.md`
(§9, decisiones 1 a 29). Lo que vieron los dos lectores en frío de esta ronda está en
`rutinas/frio/geometria.congruencia.md`; aquí se cita solo cuando el código lo confirma o lo agrava.

**Qué se revisó.**
- La teoría `contenido/teoria/geometria/congruencia.js` (v0.4.0, sin `calidad: 2`): las 6 ideas con sus 7 momentos, los
  90 ejemplos, «Ahora tú» (200 semillas por tipo, 31 tipos) y «Así se resuelve» (200 semillas por idea), el glosario
  (23 términos), las 5 mesas y la historia.
- Lo que la unidad usa de `nucleo/kit/piezas/geo-objeto.js` (figura de examen «angulos», armazón: tijeral, costura,
  mapa, escalera y escuadras) y de `geo-figura.js`.
- La práctica `plantillas/geo-congruencia/`: 26 tipos en las 6 ideas, `casos.json` (26) y `papel.json` (8).
- La app a 390 px con `--entera`: los 42 momentos y los 90 ejemplos (servidor propio en el puerto 4316). Capturas en
  `/tmp/claude-0/-home-user/31d0ae9f-8026-5866-a5dc-2c8554ea89bf/scratchpad/e5-cierre-geo/lector/`.

**Cuentas.** Se rehicieron con scripts propios
(`/tmp/claude-0/-home-user/31d0ae9f-8026-5866-a5dc-2c8554ea89bf/scratchpad/e5-cierre-geo/aud/`). De la unidad y del
generador solo leen el texto (y, en la idea 2, las coordenadas de la figura): cada respuesta sale del enunciado.
- `ahora.js`: **6 200 casos de «Ahora tú»** (200 por tipo) y **1 200 de «Así se resuelve»**. Por cada caso: la
  correcta, que ningún distractor valga la respuesta y cuatro opciones distintas. En la idea 1, cada caso LLA se
  resuelve de verdad (cuántos triángulos salen con la distancia de B a la recta: 42 casos, todos con dos triángulos) y
  cada AAA (34) es «no basta». En la idea 2, la pareja de cada vértice sale de las coordenadas (qué permutación deja los
  tres lados iguales) y se compara con los arcos y las rayitas dibujados. En la mediatriz que corta BC, se comprueba que
  P cae dentro del lado. **0 fallas en las respuestas.**
- `practica.js`: **1 200 problemas** de la práctica (200 por idea, con `{ idea }`), los 26 de `casos.json` y los 8 del
  papel. **12 respuestas falsas** (A1).
- `igualdades.js` + `todas-igualdades.js`: toda igualdad o desigualdad numérica escrita (también con x o k
  reemplazadas cuando el texto dice su valor) en Lee, consignas, misiones, lecturas del juego en toda su grilla, Mira,
  reglas, predicciones con sus `siFuera`, ejemplos, «Así se resuelve» y «Ahora tú» con sus `siFuera` (todas las
  semillas), glosario y mesas: **1 920 comprobadas, ninguna falsa** (3 falsos positivos del comprobador, por razones
  escritas con «:»).
- `misiones.js`: las 6 misiones en toda su grilla, con una geometría propia: ninguna cumplida al abrir; la cumplen 1,
  1, 1, 9 (idea 4: cualquier ancho con la cumbrera a 4 m, a propósito), 1 y 1 casos.
- `medible.js`: qué figuras de ejercicio, dibujadas a escala, dejan medir lo pedido con transportador (M2).
- A mano: **los 90 ejemplos**, con sus 30 de nivel 3 y la explicación de **cada alternativa** (lo que dice que hace cada
  error, rehecho), y **las 6 predicciones con cada distractor** (AC₁ ≈ 3,9 m y AC₂ ≈ 9,9 m; 5 sen 30° = 2,5 y
  OH = 2,5√3 ≈ 4,3; AN = 3,5 m; CM ≈ 1,4 m con el pie a 2 m; 5√2, 5, 5√3 y 10√2). Las 90 respuestas cuadran; las
  explicaciones falsas están en M7.
- Variedad: `variedad.js` y `variedad2.js` comparan cada caso de «Ahora tú» y «Así se resuelve» con los ejemplos.

Validador con `calidad: 2` simulada (`Teoria.problemas`, 200 semillas): **0 problemas, 0 pendientes.** Ninguna de las
faltas de abajo la ve una regla de hoy. Pruebas propias antes de corregir: `congruencia.test.js` 24 de 24, generador,
`geo-objeto` y `geo-figura`: 48 de 48 en verde.

## Hallazgos

### Alta (el alumno no puede resolver o aprende algo falso)

| # | Punto | Dónde | Evidencia | Corrección propuesta |
|---|---|---|---|---|
| A1 | 10, 13 | Práctica, tipo `criterio` (`generador.js:87`) | El caso LLA se arma con lados al azar y responde siempre «Ninguno: esos datos no bastan». En 12 de los 13 casos LLA de 200 semillas eso es falso: con BC ≥ AB (8 cm, 8 cm y 70°; 7 cm, 8 cm y 60°) LLA fija un solo triángulo, y con BC menor que la distancia de B a la recta (7 cm, 6 cm y 65°: 6 < 6,34) el triángulo no existe. La teoría sí filtra (sus 42 casos dan dos triángulos). | Elegir BC entre la distancia de B a la recta y AB, sin los extremos (como `casoCriterio` de la teoría), con una prueba que recalcule cuántos triángulos salen. |
| A2 | 4, 9 | Idea 2: Lee y Juega contra Predice, Mira y La regla | Los arcos del banderín DEF cambian de vértice: en Lee y Juega, D tiene un arco, E dos y F tres; en Predice, Mira y La regla, E uno, F dos y D tres (`figPred2`, con `nombres: 'EFD'`). La regla dibuja ese par (AB = EF = 24 cm) y su ecuación dice «△ABC ≅ △DEF → AB = DE» y «A con D, B con E». La idea enseña a emparejar bien y la pantalla de la regla se contradice a la vista (lector A: «no supe cuál creer»). | La regla con su propio dibujo, en el orden de su ecuación (D, E y F con uno, dos y tres arcos; AB = DE). Predice avisa que es otro par, con las letras en otro orden. Una prueba: la congruencia escrita en cada figura de la idea coincide con la que dicen sus arcos. |

### Media (el alumno se traba o duda)

| # | Punto | Dónde | Evidencia | Corrección propuesta |
|---|---|---|---|---|
| M1 | 2, 7 | Idea 2, Juega (`lectura`) | Al abrir dice «Puesto encima: D sobre A, F sobre B, E sobre C». Los banderines están lado a lado y F (tres arcos) va sobre B (dos): el lector A no supo si era el estado o la respuesta. | Decir que es lo que pasaría con ese giro y que no calza: «Así caería: D en A, F en B, E en C; no calza». |
| M2 | Molde §3 | 13 ejemplos y 5 generadores dibujados a escala en los que lo pedido es un ángulo que se mide con transportador (`medible.js`): idea 2, ejemplo 12 y «Ahora tú» tipo 4; idea 3, ejemplos 8, 13 y 14, tipo 4 y «Así se resuelve» (mediatriz); idea 4, ejemplos 9 y 14 y «Así se resuelve» (MNC); idea 5, ejemplos 7 y 10, tipo 1 y «Así se resuelve» (BMC) | El ángulo pedido mide en el dibujo justo la respuesta (∠ADE = 65°, ∠APB = 70°, ∠NMP = 70°, ∠BMC = 50°…). La decisión 18 dejó «sin escala» solo dos ejemplos. (En los que copian un ángulo dado, como el ejemplo 5 de la idea 2, medir no regala nada: la respuesta es el dato.) | Esas figuras van sin escala, con «El dibujo no está a escala.» y el ángulo pedido lejos de la respuesta; una prueba que mida el ángulo pedido en toda figura a escala. |
| M3 | Molde §2 («Así se resuelve» ≠ «Ahora tú»), 4h | «Ahora tú» igual a un ejemplo (mismos números y misma pregunta): idea 2 tipo 4 = ejemplo 12 (45 de 200); idea 5 tipo 4 = ejemplo 12 (21); idea 6 tipo 4 = ejemplo 12 (26) y tipo 3 = ejemplo 13 (19); idea 4 tipo 4 = ejemplo 10 (31) y tipo 1 = ejemplo 3 (15); y casos sueltos (idea 3 tipo 3, idea 5 tipos 1 y 3, idea 6 tipo 2). «Así se resuelve» de la idea 1 repite el ejemplo 6 en 7 semillas (la 0 entre ellas) | Los ejemplos se abren tras predecir: el alumno encuentra resuelto el «Ahora tú» que le toca. | Que los generadores salten los números de los ejemplos de su idea, con una prueba en 1 000 semillas. |
| M4 | 10 | Idea 6, «Ahora tú» tipo 1 (`casoN37`) y práctica `n37` | Escaleras de 15 a 40 m apoyadas en una pared («mide 30 m y forma 53° con el piso»); en la práctica, también rampas de 40 m. Además «el largo del escalera». | Escalera de 5 o 10 m; los largos mayores, para el cable de un poste; «de la escalera». |
| M5 | 9, 10, 13 | Idea 1: la regla (condición) y las mesas | La condición dice «LLA y AAA no bastan; dos ángulos fijan el tercero». La mesa `compas-lla` enseña lo contrario en un caso («con A obtuso … ahí LLA sí fija el triángulo») y la regla no dice cuándo LLA fija el triángulo (la decisión 6 pedía esa línea). Las dos frases juntas parecen causa y efecto (lector A) y el caso «el lado no queda entre los dos ángulos» (AAL), que usan «Así se resuelve» y el ejemplo 6, no se dice. Es lo que produjo A1. | Condición: «LLA no basta: el lado de enfrente puede caer en dos lugares; AAA tampoco: da la forma, no el tamaño. Si el lado no queda entre los dos ángulos, saca el tercero: es ALA». |
| M6 | 3, 4 | Idea 1, Predice | «La viga de 5 m» era AC en el juego (sale de A) y en Predice es BC (sale de B), con el mismo color; «La viga BC no toca la punta A» confunde (lector A). | «Ahora la viga de 5 m va de B a la línea punteada (es BC).» |
| M7 | 10, molde §2 | Explicaciones de alternativas que no dicen la verdad (rehechas a mano): idea 4 ejemplo 14 («110° y 120° restan de 180° uno solo de ellos»: 180° − 50° = 130°, no 110°); idea 2 ejemplo 15 («115° y 130° suman o duplican el de 65°»: 115° = 180° − 65°); idea 6 ejemplo 15 («32 cm suma AB y CB»: 16 + 8 = 24); idea 6 ejemplo 14 («9 m pone BC = 4k»: eso da AB = 9 m, no AD; «8 m resta la mitad»); idea 3 ejemplo 14 («30° reparte 90°»); idea 3 ejemplo 12 («8 cm y 10 cm se equivocan al reemplazar») | Lector B, tarjetas 12 y 18. | Rehacer cada línea con la cuenta del error. |
| M8 | 13, letras | Datos de la idea 3: «Mediatriz de AB…» y «Todo punto de la mediatriz de AB equidista de A y de B» en ejercicios con la mediatriz de AC o de BC (ejemplos 10, 13 y 14; «Ahora tú» tipo 2; la práctica `perimetro`) | AB es otro lado del mismo problema (lector B, tarjeta 09). | Datos dichos para cualquier segmento: «Todo punto de la mediatriz de un segmento equidista de sus dos extremos». |
| M9 | 3 | Idea 3: Juega, Mira y La regla | «P a los lados, en km» no dice desde dónde (lector A lo dedujo); «m∠HOP = m∠KOP» en Mira sin K en el dibujo; la regla tiene la mediatriz en el texto y no en el dibujo; «Y al revés» de la bisectriz sin «dentro del ángulo» (los Datos de «Así se resuelve» sí lo dicen). | Control «P a los lados de M»; K desde el paso 1 de Mira; la condición con «si está dentro del ángulo, en la bisectriz»; la regla con un dibujo de las dos (o la mediatriz en la condición y el dibujo de la bisectriz, con su nota). |
| M10 | 3, 8 | Rótulos de un lado entero junto a la mitad de otro tramo: la escalera («4 m» junto a A en Lee, Juega, Mira y La regla de la idea 5) y el triángulo rectángulo de la idea 5 (`figRect`: «14 cm» de AB queda bajo MB en «Ahora tú» tipo 0 y en los ejemplos 3 y 8) | El lector B leyó MB = 14 y eligió 14 cm, que es una opción. | El rótulo dice qué lado mide («AB = 4 m», «AB = 14 cm»), y una prueba: todo rótulo de AB en una figura con M lleva el nombre del lado. |
| M11 | 2, 3, 7 | Idea 4, Juega | La lectura «A 1,5 m del piso: MN = 4 m…» se lee como «el punto A está a 1,5 m»; nadie dice que el listón queda a media altura de la cumbrera, y la misión lo necesita; el control «a lo alto» empieza en su mínimo (lector B). | «MN, a 1,5 m del piso, mide 4 m…»; Lee 4 dice que M y N quedan a media altura de A; el control empieza en 5 m. |
| M12 | 1, 3, 4 | Idea 6, Juega y Lee | Lee 1 presenta las escuadras de 30° y 60° y de 45°; el juego ofrece la de 30° y 60° y otra de 37° y 53° que Lee no nombra; «k: el tamaño» no dice qué es k en cada una; los tres dibujos de la regla no llevan los ángulos (lector B). | Lee 1 nombra las tres (la de 45°, para predecir); leyenda «k: el número que multiplica a cada borde»; la regla con 30°, 60°, 37°, 53° y 45° escritos. |
| M13 | 5b, 9 | Mesa `c-libre` | «La punteada es la circunferencia de diámetro AB» y «CM = 5 m y el ángulo en C vuelve a 90°: van siempre juntos»: es el ángulo inscrito en la semicircunferencia, de Circunferencia (la propuesta §8 lo deja fuera; la idea 5 lo sacó del juego). | La mesa sin la circunferencia: compara el ángulo en C con CM, sin nombrar el arco. |
| M14 | 13 | Distractores que salen de un dato que nadie da: idea 4 «Ahora tú» tipo 1 (la mitad de AB, que el enunciado no da) y tipo 5 (m∠C, que tampoco); «4,7 cm» (un tercio) en la idea 4 tipo 0 y «4,7 cm, la relación del baricentro, de otro tema» en la idea 5 tipo 0 (lector B: «no tiene sentido»); «44 cm, 6 cm, 11 cm…» de GE-CON8 y GE-TRI15 en las ideas 2 a 5, con un `siFuera` que no dice de dónde sale («revisa el despeje»). | El molde pide que cada opción incorrecta salga de un error real y muestre su valor. | Cambiar los de datos ausentes y los inventados por errores con cuenta: «depende de AB y AC», «no se sabe sin los catetos», el despeje con el signo cambiado. |
| M15 | 4h, 13 | Predice de la idea 5 (`coincide` y `noCoincide`) | «Con la esquina de 110°, CM mide unos 1,4 m» es cierto solo con el pie a 2 m, como en el dibujo: con 110°, CM va de unos 1,4 m a casi 2 m según dónde quede el pie. | «En el dibujo, con el pie a 2 m, CM mide unos 1,4 m». |

### Baja (estilo)

| # | Punto | Dónde | Evidencia | Corrección |
|---|---|---|---|---|
| B1 | 9 | Idea 2, ejemplo 13 | «(ABCD es un paralelogramo: es de otro tema.)»: nombra algo de Polígonos sin necesidad. | Quitar el paréntesis. |
| B2 | Letras | Idea 3 ejemplo 14 («c») e idea 5 ejemplo 10 («a») | La tabla de letras deja a, b, c fuera de la unidad (son de Relaciones métricas). | x. |
| B3 | 8, 4h | Ejemplos sin dibujo o con dibujos que confunden: idea 4 ejemplo 8 (sin figura, lector B); idea 2 ejemplo 8 (la cometa parece un cuadrado y el 80° se ve recto); idea 6 ejemplos 8 y 14 (arcos sin su valor, tres arcos juntos en C) | Lector B, tarjetas 05, 11, 17 y 18. | Dibujo de los puntos medios con 3, 4 y 5 cm; cometa más alta que ancha; rótulos 53°, 45° y 53° donde quepan. |
| B4 | 4h | Idea 1, ejemplo 8 | La respuesta «Por LLL: AC es de los dos» se ve cortada (lector B). | «Por LLL, con AC de los dos triángulos». |
| B5 | 13 | Idea 6, ejemplo 7 | El dato «8 ÷ √2 = 8√2 ÷ 2» es la cuenta del problema hecha. | «Dividir entre √2 es multiplicar por √2 y dividir entre 2.» |
| B6 | 13 | Idea 6, ejemplo 9 | El resuelto usa 3k, 4k y 5k, y los Datos solo traen Pitágoras. | Agregar el notable de 37° y 53°. |
| B7 | 7 | Idea 1, Juega | La lectura sale en otra letra y partida en dos (lector A). Es el estilo de la lectura en la app. | Para `app/` (no se toca). |
| B8 | Decisión 26 | Glosario: «circunferencia», «radio», «diámetro» y «paralelogramo» viven aquí aunque son de unidades que vienen después (decisión 29, para que otras unidades los manden a ver aquí). | No se usan como herramienta; se deja (decisión de la sesión). | Se deja. |
| B9 | Molde §2 | Idea 3, marcas de AM = MB | Las llaves de igualdad del mapa son cortas (dejan 20 px a cada punta con letra) y el lector A creyó que marcaban un pedacito. Es la pieza compartida. | Para la pieza, con Segmentos y Triángulos a la vista. |

## Lo que está bien y hay que copiar al molde

- **Las respuestas de los generadores de la teoría**: 7 400 casos rehechos aparte sin una falla, con los LLA de verdad
  ambiguos y una prueba propia (`congruencia.test.js`) que ya rehace la respuesta desde el enunciado.
- **Fidelidad de las figuras**: cada ángulo declara `mide` y la prueba lo compara con su rótulo; los lados con medida van
  a una sola escala; los rótulos caben y quedan cerca de su vértice.
- **Las pruebas sin paralelogramo ni circunferencia** (ideas 4 y 5), con su prueba que lo vigila.
- **Misiones con una sola solución** (salvo la 4, a propósito) y comprobadas en toda su grilla.
- **El glosario no dice la clave de ninguna predicción** (con una prueba por término; LLA no dice cuántos salen).

## Reglas que faltan en el contrato o el validador

| Regla | ¿Automática? |
|---|---|
| **Un caso LLA que responde «no basta» da de verdad dos triángulos**: el lado de enfrente entre la distancia a la recta y el otro lado (A1). Vale para teoría y práctica. | Sí, en geometría: recalcular con h = c · sen A. |
| **Una figura dibujada en el orden de su congruencia escrita**: si una figura y una ecuación de la misma pantalla nombran △ABC ≅ △DEF, las marcas emparejan A con D (A2). | Sí: permutación por coordenadas o por arcos contra la congruencia escrita. |
| **Lo pedido no se mide en la figura**: en una figura a escala, el ángulo con «?» no mide la respuesta (±2°), o la figura lleva `sinEscala` (M2). | Sí, para ángulos; para lados, con la escala de los rótulos. |
| **«Ahora tú» no repite un ejemplo de su idea** (mismos números y misma pregunta) (M3). | Sí: firma de números y pregunta, en 1 000 semillas. |
| **Toda explicación de una alternativa se rehace** («X es el doble de…», «resta de 180°…») (M7). | Parcial: las igualdades escritas sí (ya se hace aparte); las frases, a mano. |
| **Un distractor no sale de un dato que el ejercicio no da** (M14). | Parcial: el valor del distractor tiene que salir de los números del enunciado y de los datos con una operación. |
| **Medidas creíbles de objetos**: largos de escalera, rampa y cable con tope por objeto (M4). | Sí, con una tabla de topes por palabra. |

## Correcciones (19 nov)

Fase 8 del método (`docs/metodo/unidad/6-correcciones.md`), junto con las dos notas del lector en frío (ver
`rutinas/frio/geometria.congruencia.md`, «Correcciones de la ronda 1»). Archivos: `contenido/teoria/geometria/congruencia.js`
y `congruencia.test.js`; `plantillas/geo-congruencia/` (`generador.js`, `generador.test.js`, `casos.json` y `papel.json`
regenerado con `herramientas/papel-generador.js`). No se tocaron `geo-objeto`, `geo-figura`, `app/` ni `nucleo/`. Copias de
antes en `/tmp/claude-0/-home-user/31d0ae9f-8026-5866-a5dc-2c8554ea89bf/scratchpad/e5-cierre-geo/antes/`.

**Pruebas.** 16 nuevas: 14 al final de `congruencia.test.js` («auditoría A2 … B6») y 2 al final de `generador.test.js`
(«auditoría A1» y «auditoría M4»). Con los archivos de antes fallan las 16 (comprobado en un árbol aparte,
`scratchpad/e5-cierre-geo/antes-arbol/`). Después: unidad 37 de 37, generador 10 de 10, `geo-objeto` y `geo-figura` en verde
(64 de 64 en las cuatro). Validador con `calidad: 2` simulada, 200 semillas: 0 problemas, 0 pendientes. Recuentos aparte
después de corregir: `ahora.js` 7 400 de 7 400; `practica.js` 1 234 de 1 234 (12 fallas antes); `todas-igualdades.js` sin
igualdades falsas; `misiones.js` igual que antes; `variedad2.js` sin «Ahora tú» igual a un ejemplo; `medible.js`: quedan 7
figuras donde el ángulo pedido se mide, todas copias de un ángulo dado que la figura ya escribe (la respuesta es el dato).
`herramientas/ecuaciones-ancho.js geometria.congruencia`: todo cabe (65 pantallas). `contenido/teoria/teoria.test.js`: falla
solo en `razonamiento-matematico` (otra sesión). `npm run catalogo`: de esta unidad no cambia nada en
`app/datos/glosario/geometria.json`. No se corrió `npm test` completo (otras sesiones trabajando).

| # | Qué se hizo |
|---|---|
| A1 | En la práctica, el caso LLA elige BC entre AB · sen A y AB, sin los extremos (si con el ángulo sorteado no cabe un entero, usa 30°); los casos que ya eran buenos no cambian (`casos.json` sigue igual en ese tipo). La solución dice por qué: «BC pasa de la distancia de B a la recta y es menor que AB: caben dos triángulos». Prueba: 1 000 semillas, cada LLA da dos triángulos. |
| A2 | La regla de la idea 2 tiene dibujo propio (`FIG_REGLA2`): el par del juego con AB = DE = 24 cm, en el orden de la ecuación. Predice dice que es otro par con las letras en otro orden. Prueba: en Lee, Juega, Predice y la regla, los arcos emparejan como la forma; la regla, como su ecuación; Lee, Juega y la regla, con D, E y F de uno, dos y tres arcos. |
| M1 | «Caería D en A, F en B, E en C: no calza». Prueba en toda la grilla. |
| M2 | Sin escala, con «El dibujo no está a escala.» y lo pedido lejos de la respuesta: ejemplo 12 de la idea 2 y su tipo de «Ahora tú» (dibujados con otro ángulo en A); tipo 2 de la idea 2 cuando lo pedido es la pareja del ángulo no dado (otros ángulos); ejemplos 8, 13 y 14 de la idea 3, su tipo 4 y su «Así se resuelve» (mediatriz); ejemplos 9 y 14 de la idea 4 y su «Así se resuelve»; ejemplos 7 y 10 de la idea 5, su tipo 1 y su «Así se resuelve» (otro ángulo en A, con el recto intacto). Ayudante `torcer` (estira en vertical: conserva paralelas y puntos medios; rehace los `mide` y las letras). Prueba: en toda figura a escala de ejemplos, «Ahora tú» y «Así se resuelve», el ángulo pedido no mide la respuesta, salvo que copie un ángulo escrito en la misma figura. |
| M3 | `conCuatro` recibe las firmas de los ejemplos de su idea y salta esos casos; «Así se resuelve» de las ideas 1 y 5 saltan los del ejemplo 6 y el 7. Prueba en 1 000 semillas por idea. |
| M4 | Teoría y práctica: escalera de 5 m o 10 m, rampa de hasta 20 m, cable de hasta 40 m; cada pregunta dice desde dónde («¿A qué distancia de la pared queda su pie?», «¿Cuánto mide el poste?»); «de la escalera». El caso 122 de `casos.json` se rehízo (rampa de 20 m a 53°: avanza 3k = 12 m). Pruebas en la teoría y en el generador. |
| M5, M6 | Regla y condición de la idea 1 reescritas (ver la tabla del lector). Predice: «Ahora la viga de 5 m es BC: va de B a la línea punteada». |
| M7 | Las siete explicaciones rehechas con su cuenta (también «8 cm hace 2 · (3 + 1)…» y «14 cm suma el cateto de 9 cm y la mediana»). Prueba: ninguna de las frases falsas vuelve. |
| M8 | `D_MED` y `D_TEO` (teoría y práctica) dicen «un segmento» y «sus extremos». Prueba: ningún ejercicio con la mediatriz de AC o BC trae «mediatriz de AB» en Datos. |
| M9 | Control «P a los lados de M»; Mira 1 sin K; la regla con el dibujo de la mediatriz; la condición con «dentro del ángulo». |
| M10 | `figEscalera` y `figRect` escriben «AB = …» y buscan dónde cabe; si no cabe, la medida sola (13 de 200 en «Ahora tú» tipo 0 y los ejemplos de 5 m y 6 m). |
| M11 | Lectura «MN = 4 m = BC ÷ 2, a 1,5 m del piso»; `bien` con MN; Lee 4 con la media altura; el control empieza en 5 m (el `id` no cambia). |
| M12 | Lee 1 nombra el de 37° y 53°; leyenda de k; los ángulos de cada escuadra escritos en la regla (`libres`). |
| M13 | La mesa `c-libre` ya no dibuja la circunferencia ni la nombra en la consigna. **Parcial:** el primer reto dice «C está en la circunferencia de diámetro AB», porque el glosario de la unidad define «diámetro» (decisión 29) y el validador exige que el término aparezca en la teoría. Decidido por la sesión, Gerson revisa después: mover «circunferencia», «radio», «diámetro» y «paralelogramo» al glosario de sus unidades. |
| M14 | Fuera el tercio y el baricentro (el distractor es partir dos veces); el tipo 1 de la idea 4 da AB y el tipo 5, m∠C; los «revisa el despeje» son ahora errores con cuenta (olvida restar o sumar el número; duplica x y no el número). Prueba en 1 000 semillas por idea. |
| M15 | «En el dibujo, con el pie a 2 m, CM mide unos 1,4 m». |
| B1 | **Se queda** «(ABCD es un paralelogramo: es de otro tema.)»: es el único lugar de la teoría donde aparece el término del glosario (decisión 29); va con M13. |
| B2 | x en lugar de c y a. |
| B3 | La cometa del ejemplo 8 de la idea 2, más alta que ancha. Los arcos sin número de la idea 6 y la figura de la tarjeta 11 se quedan (no caben; ver el informe del lector). |
| B4, B5, B6 | Hechos (respuesta de la cometa, dato sin la cuenta, notable en la cinta del albañil). |
| B7, B9 | Para `app/` y para la pieza compartida: no se tocaron. |
| B8 | Se deja (decisión 29). |

### Pendiente

- **De `app/`:** la lectura del juego de la idea 1 en otra letra y partida en dos (lector A).
- **De la pieza `geo-objeto` (compartida con Segmentos y Triángulos):** las llaves de igualdad de tramos cortos con letras en
  las dos puntas quedan cortas (20 px de aire por punta); el lector A no vio que marcaban la mitad entera.
- **La práctica** conserva distractores sin cuenta parecidos a los de M14 (p. ej. «21 cm» en dos bases medias, la mitad
  menos uno); la regla nueva del validador los encontraría.
- **Decidido por la sesión, Gerson revisa después:** M13 y B1 (los términos de otras unidades que viven en este glosario);
  que las figuras de copia de un ángulo dado sigan a escala (M2); que los niveles 1 de un solo paso sigan aplicando un dato
  (tarjetas 07, 10 y 13 del lector B).
