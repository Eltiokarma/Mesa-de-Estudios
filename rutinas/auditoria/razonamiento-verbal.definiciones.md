# Auditoría de contenido: «Definiciones» (razonamiento-verbal.definiciones)

19 nov 2026. Auditor externo (fase 7 del método), que no escribió la unidad. Contrato: `docs/plan-calidad.md` §3 (con la
regla de verbal del punto 1) y §5. Formato: `docs/teoria.md` 4e, 4f, 4h y §5. Vara: `docs/molde-unidad.md` §10 y la fila
de verbal de §11. Reglas automáticas: `docs/metodo/unidad/reglas-validador.md`. Decisiones: `docs/etapa5/propuesta-verbal.md`
(§10 y §11). Lo que vieron los dos lectores en frío de esta ronda está en `rutinas/frio/razonamiento-verbal.definiciones.md`;
aquí se cita cuando el código lo confirma o lo agrava.

**Qué se revisó.**
- La teoría `contenido/teoria/razonamiento-verbal/definiciones.js` (v0.4.0, sin `calidad: 2`):
  - las 5 ideas con sus 7 momentos;
  - los 75 ejemplos;
  - «Ahora tú» y «Así se resuelve» con 200 semillas por idea (son 6 y 4 casos fijos por idea; la semilla cambia el
    orden de las opciones);
  - el glosario (14 términos), las 5 mesas y la historia.
- Las piezas `rv-definicion` y `rv-soporte` (la página de diccionario y la hoja de simulacro con toques), con sus pruebas.
- La práctica `plantillas/definiciones/`: 10 tipos (2 por idea), banco de 40 ítems, `casos.json` y `papel.json`.
- La app a 390 px con `--entera`: los 35 momentos y los 75 ejemplos, contra un servidor propio en el puerto 4315.

**Cuentas.** En verbal, «rehacer las cuentas» es comprobar cada pregunta con alternativas por otro camino. Se hizo en dos
partes.
- **A mano, alternativa por alternativa**, sin mirar la explicación de la unidad: se juzgó cada alternativa, se anotó
  por qué falla y se comparó con lo que dice su explicación. Entraron:
  - los 25 ejemplos de nivel 3 y las 14 listas de candidatas de los niveles 1 y 2;
  - las 16 hojas de «Así se resuelve», los 30 «Ahora tú» y las 5 predicciones;
  - los 40 ítems del banco de la práctica, con sus 8 problemas de papel.
- **Con un script propio**
  (`/tmp/claude-0/-home-user/31d0ae9f-8026-5866-a5dc-2c8554ea89bf/scratchpad/e5-cierre-rv/aud/medidas.js`), que lee lo que
  la unidad y el generador entregan, sin usar sus funciones. Mide en 262 preguntas distintas:
  - el largo de la correcta;
  - si la correcta está escrita dentro de otra alternativa;
  - el lugar de la correcta en las listas;
  - en qué oración está la definición, en la idea 5;
  - el reparto de letras;
  - que cada oración o letra citada exista y que cada resuelto nombre cada alternativa.

  La práctica se midió con 200 semillas por idea.
- **Resultado.** Cada número de oración citado existe y cada resuelto nombra todas sus letras. Las letras de nivel 3
  quedan 5 de cada una. Pero hay dos preguntas con una respuesta discutible (A1, A2) y dos explicaciones de la práctica
  que la situación desmiente (M11). Además aparecen tres pistas que delatan la correcta: el largo (M1), la palabra
  escrita dentro de otra (M2) y el lugar de la definición (M4).
- **Contenido propio.** Los textos son casos locales e inventados (carteles, cuadernos, folletos); ninguno copia un
  examen ni un diccionario. La idea 3 usa el formato de la UNI como hipótesis declarada, en el comentario de la idea y en
  la cabecera del generador. Ningún texto que lee el alumno lo presenta como un examen real: dice «simulacro».

Validador con `calidad: 2` simulada (`Teoria.problemas` con 200 semillas): **0 problemas, 0 pendientes**, antes y después.
Ninguna de las faltas de abajo la ve una regla de hoy. La única que el validador marcó en las correcciones fue un
`figura-respuesta` («7:45» en la respuesta de la tardanza), y se evitó. Pruebas propias antes de corregir:
`definiciones.test.js` 34 de 34, generador 27 de 27, `rv-definicion` y `rv-soporte` en verde.

## Hallazgos

### Alta (el alumno no puede resolver o aprende algo falso)

| # | Punto | Dónde | Evidencia | Corrección propuesta |
|---|---|---|---|---|
| A1 | 10, 13 | Idea 2, ejemplo 15, «La que deja un caso fuera» (`:831`) | La pregunta es «¿Cuál de estas definiciones es muy estrecha?», con la C («Cuchara: cubierto de metal…») como correcta. Pero la B, «Hermano: persona que tiene los mismos padres que otra», también lo es: deja fuera al medio hermano, que comparte solo uno. Hay dos correctas, y el resuelto afirma que en la B «ningún caso queda fuera». | Cambiar la B por una definición sin excepciones, que mida más que la C para que la correcta no sea la más larga. |
| A2 | 10; idea 5 | Idea 5, ejemplo 8, «Dos veces «es»» (`:1837`; lector B, tarjeta 14) | El resuelto dice que la oración 2 define al Misti con «la clase, «volcán», y el rasgo que lo ubica, «del sur del Perú, cerca de Arequipa»». Hay dos problemas:<br>• un lugar no separa al Misti del Chachani, que también es un volcán cerca de Arequipa;<br>• la misma idea enseña en sus Datos que un lugar «acompaña, pero no define».<br>El ejemplo enseña lo contrario de la regla. | Un término común definido por clase y rasgos que separan: la vicuña, «camélido silvestre de los Andes, de lana muy fina», frente a la alpaca y la llama. |

### Media (el alumno se traba o duda)

| # | Punto | Dónde | Evidencia | Corrección propuesta |
|---|---|---|---|---|
| M1 | Delatar por largo | Listas de candidatas de los niveles 1 y 2; «Así se resuelve» de la lluvia; práctica | En 12 de las 14 listas del enunciado (««x», «y» o «z»»), la correcta es la más larga o la más corta. En la idea 1 es la más larga en 4 de los 5 ejemplos de nivel 2: la bicicleta, el campeonato, el chullo y el lago. Además va al final en 7 de 14. En la lluvia, la correcta empata con la más larga. En la práctica, la correcta es la más larga en el 25 % de `definicion` (el tambor, siempre) y la más corta en el 17 % de `palabra`. La prueba propia solo medía las hojas con letra. | Alargar o cambiar una candidata en cada lista, mover la correcta de lugar, y en el generador elegir las incorrectas de modo que la correcta quede entre la más corta y la más larga. |
| M2 | Delatar por forma | Idea 3: juego, «Ahora tú», «Así se resuelve» y nivel 3 | La más específica es siempre «palabra + complemento» («bota de jebe», «farmacia de turno», «canoa de pesca», «ráfaga de arena»…). Por eso la correcta es la única alternativa escrita dentro de otra en 15 de las 17 preguntas de la idea, y se puede elegir sin leer la definición. | Usar a veces una sola palabra para la más específica («tutor», «tragaluz») y dar a veces un vecino que contenga a la general («calzado de playa», «tienda de abarrotes», «lluvia fina»). |
| M3 | Regla 3 de CLAUDE.md | Idea 3: juego (`HOJA_OLLA`) contra la predicción | El comentario dice que la más específica se reserva para la predicción, pero la hoja del juego trae «olla de presión», y su lectura dice «agrega un rasgo». La predicción (ganadero) tiene las mismas cuatro trampas que el juego: no pregunta nada nuevo. | Cambiar «olla de presión» por un segundo vecino («sartén»: cocina, pero no es honda), y ajustar la invitación de la mesa. |
| M4 | Delatar por posición | Idea 5 y práctica `termino` | La oración que define es la 2 en 18 de los 28 textos de la teoría y en los 6 de la práctica. | Moverla a la 1, la 3 o la 4 en varios textos, y corregir las citas «oración N». |
| M5 | Regla 3; 4f | Glosario: «definición negativa» (idea 4) y «suficiente» (idea 2) | «Definición negativa» se muestra en «Palabras de esta idea» antes de jugar. Su `simple`, «Decir qué no es una cosa», y su ejemplo, «Pez: animal que no es ave. Entra la rana», dan la clave de la predicción: «Solo dice lo que no es: también entra un profesor». El tercer ejemplo de «suficiente» («no basta para el tren: el bus también las tiene») da la de la idea 2. `glosario-predice` no lo ve, porque la respuesta no es un número. | La negativa, sin `simple` y sin «entra…»: sigue en la pestaña Glosario, pero no en el Resumen. Otro ejemplo para «suficiente». |
| M6 | 3 (términos dichos en palabras), 6 | Lee de las ideas 1 y 2 | Lee de la idea 1 usa «dos rasgos» (tarjeta 4) sin decir qué es un rasgo. «Muy amplia» y «muy estrecha» salen en la lectura del juego, pero ninguna tarjeta de Lee las presenta. | Decir «rasgo» en la tarjeta 2, «muy amplia» en la 3 de la idea 1 y «muy estrecha» en la 2 de la idea 2. |
| M7 | 7 | Juego de la idea 2 (`lecturaAve`); Mira, paso 1 (lector A) | Con «que vuela» quedan fuera dos aves y se cuela el murciélago, pero la lectura y Mira dicen solo «Muy estrecha». | «Muy estrecha y muy amplia: fuera 2 aves, se cuela el murciélago». |
| M8 | 13 | Datos de ejemplos, de «Así se resuelve» y de «Ahora tú» (lectores A y B, tarjetas 05 y 09) | El resuelto usa nombres de fallas que sus Datos no dicen:<br>• «define al vecino» (termómetro, semáforo, cuchara…);<br>• «muy estrecha» y «muy amplia» (la araña);<br>• «cambia el rasgo» y «otra clase» (toda la idea 3). | Una línea por falla que el resuelto nombra, y en la idea 3 dos líneas nuevas: «El vecino: …» y «Otra clase: …». |
| M9 | 13 | «Ahora tú» de la idea 2 (lector A) | La respuesta depende de saber de memoria que los peces respiran por branquias, que los insectos tienen seis patas o que el año tiene doce meses. La lámina no lo dice y tampoco hay tabla. | Poner los hechos en la lámina («… y respira por branquias») y el del vecino en Datos («El pato nada, pero respira con pulmones»). |
| M10 | 9, regla | Idea 4: juego y regla (lector B) | «Alpaca: animal de la puna» falla porque su rasgo no separa (entra la vicuña), y esa falla no está en la regla de la idea («repite, niega, compara»). La regla pide «clase y rasgo», y la alpaca tiene los dos. | La regla dice «la clase y un rasgo que separe», y la lectura de la alpaca, «su rasgo no separa». |
| M11 | 10 | Práctica: `calculadora` y `ventilador` (RVD6) | «Objeto que se lleva al examen de Matemática» se modela como `['objeto']`, y la explicación dice «también entra el celular». Pero la situación dice que el celular no se permite. «Objeto que se usa en el aula de cómputo» deja entrar al abanico, que no está en el aula. Las dos explicaciones son falsas en su situación. | Que la clase lejana pida también un rasgo («Objeto que sirve para hacer cuentas», «… para refrescar el aire»). |
| M12 | 13 | `D_VERBO` y Lee 2 de la idea 3 (lector B, tarjeta 08) | El ejemplo de verbo es «hablar», que es justo una alternativa equivocada de «En voz muy alta». | Otro verbo: «cortar». |
| M13 | Paleta | Idea 4, ejemplos (lector B, tarjeta 11) | Lo que se descarta va en turquesa, que en el juego es «lo que la buena sí dice»: «tejedor», «Lo que no es caliente», «la primavera de la vida», «panadero», «un amigo», «lector», «el faro». Además, «Le faltan la clase» confunde, porque «un amigo» parece una clase. | Naranja para lo descartado, y «Le faltan una clase de verdad, como «conjunto de hojas», y un rasgo». |
| M14 | Decisión de la etapa 3 | `CHUNO`, predicción de la idea 5 y `tarwi` de la práctica (lector B) | «Feria de Ilave» se lee «llave»: la I mayúscula se ve igual que la l. Razonamiento deductivo ya cambió Ilave por Lampa por eso. | Lampa. |
| M15 | 4, 3 | Mira de la idea 4 (lector B) | En los pasos 1 y 2, las entradas 2 y 3 salen como barras grises tapadas, y en Predice la hoja tenía una sola. En el último paso, que es la figura de la regla, «soltero» va en turquesa, sin leyenda. | Sin tapar, y «soltero» en violeta, que es «la entrada que define». |
| M16 | 12, 13 | Idea 5: regla, «Así se resuelve» y nivel 3 (lector B) | Hay dos problemas:<br>• la regla no dice por qué se tacha la oración 3 del chuño (cuánto dura) ni por qué un «solo» hace mala la respuesta;<br>• los enunciados dicen «de comprensión de lectura» bajo una hoja que dice «Razonamiento verbal». | Regla: «… Un dato, un ejemplo o un uso no definen; un «solo» agrega lo que el texto no dice». Enunciados: «del simulacro, sobre un texto». |
| M17 | Niveles | Tarjetas 03 y 12 (lector B) | El nivel 3 es más fácil que el 2 de su grupo:<br>• el género próximo del barómetro (la clase es una palabra sola);<br>• el faro («el faro que guía a sus alumnos»), que además se titula «del cartel» y no hay cartel. | Elegir entre clases anidadas («instrumento de medida» frente a «instrumento» y «objeto»), y un figurado menos obvio («Corazón: el motor que mueve la sangre», junto a «Motor: máquina…»). |
| M18 | 2, 3 | Juego de la idea 1 (lector A) | Hay tres problemas:<br>• Las casillas ☐ de la ficha se pueden tocar (`data-toque`), pero nada lo dice, y el lector no supo si tocar la ficha o los botones.<br>• La línea de leyenda «botón marcado: lo que elegiste; no es color del texto» no se entendió (está en las 5 ideas).<br>• Mira dice «esa clase queda lejos» sin decir «la clase más cercana». | La voz y la tarjeta 4 dicen «Toca la clase o la casilla de un rasgo». Sin esa línea de leyenda. Mira: «no es la clase más cercana». |

### Baja (estilo)

| # | Punto | Dónde | Evidencia | Corrección |
|---|---|---|---|---|
| B1 | 13 | Tarjeta 07, la lechuza | El enunciado empieza «Una lechuza es un ave» y regala la palabra. «Y ninguno más» en Datos no se entendió. | «En la hoja falta la palabra…»; Datos: «sin agregar otro». |
| B2 | 13 | Tarjeta 02, el chullo | El cartel no dice nada de lo que se pregunta, y lo de las orejeras hay que saberlo. | «Cada chullo se teje a mano, con orejeras para el frío». |
| B3 | antes-predice (a mano) | Lee 2 de la idea 5 | El ejemplo de las palabras que avisan es «el soroche es…», que es la oración que resuelve la misión del juego. | «la helada es…». |
| B4 | Estilo | Tarjetas 01, 04, 05, 13 y 15 | Hay cinco detalles:<br>• la respuesta de la tardanza se dice de otro modo que el resuelto;<br>• la mesa es «redonda» y eso no importa;<br>• el título «Animales de ocho patas» adelanta la mitad;<br>• «dice qué es un cuento «por ejemplo»» suena raro;<br>• la C de la fotosíntesis agrega «las llamas», que el texto no nombra. | Ajustar cada uno. |
| B5 | Gramática | Práctica, RVD6 y RVD7 | «también entra el cepillo de pelo y la cinta»; «el rasgo es el de el celular». | «entran»; «del». |
| B6 | 6 (dibujo) | `rv-soporte`, página de diccionario | El lector A vio cortados los uñeros del canto derecho. Son medios círculos a propósito, en un dibujo de prueba compartido. | Para Gerson. |
| B7 | App | Juego de la idea 5 (lector B) | Solo el rótulo «Oración 1» de los controles va subrayado como palabra del glosario: el glosario de la app subraya la primera aparición. | De `app/teoria.js`. |
| B8 | Niveles | Tarjeta 09, «árido» | Hay que conocer la palabra «árido». Es lo que mide la pregunta de definiciones, y dar su significado en Datos sería dar la respuesta. | Se deja. |
| B9 | 10 | Idea 2, ejemplo 11, el colegio | La correcta, «Lugar donde se enseña a niños y jóvenes», también deja entrar a una academia. La pregunta es «¿cuál define mejor?», y las otras fallan más. | Se deja. |

## Lo que está bien y hay que copiar al molde

- **Un mundo chico en el código** (`medir`, `medirAve`, el banco del generador con sus seres y rasgos). Así, lo que entra,
  se cuela o queda fuera en el juego, Mira y la práctica no depende de un texto escrito a mano. El generador lanza un
  error si un ítem no cuadra, y su prueba recorre el banco entero.
- **Misiones de una sola combinación en toda la grilla**, que no están cumplidas al abrir, y juegos que se tocan sobre
  la hoja (`data-toque`), con una prueba que lo exige.
- **El reparto de letras de nivel 3** (5 de cada una) y la correcta entre la más corta y la más larga en las hojas con
  letra, con su prueba.
- **La idea 3 como hipótesis declarada**: el comentario de la idea y la cabecera del generador lo dicen, y el alumno
  solo lee «simulacro».
- **Una incorrecta por código** en cada predicción y cada «Ahora tú», con los códigos en `codigos.json`.

## Reglas que faltan en el contrato o el validador

| Regla | ¿Automática? |
|---|---|
| **En una hoja de palabras, la correcta no es la única alternativa escrita dentro de otra** (M2): con 15 de 17, la forma delata la correcta. | Sí: subcadena entre alternativas; avisar si pasa en más del 40 % de las preguntas de una idea. |
| **El largo de la correcta también en las listas del enunciado** (««x», «y» o «z»») y en las definiciones numeradas, no solo en las hojas con letra (M1). | Sí: el mismo patrón que usa `medidas.js`. |
| **En verbal, la oración clave cambia de lugar**: la que define, la principal o la que se cita no está en el mismo número en más de la mitad de los textos de una idea (M4). | Parcial: pide que el ejercicio declare cuál es su oración clave. |
| **Cada falla que nombra un resuelto está en sus Datos** (M8), con una tabla «nombre → línea» por unidad. | Sí: la unidad ya lo hace con `completar`, y la prueba M8 lo comprueba. |
| **`glosario-predice` también para respuestas sin número**: el `simple` y los ejemplos de un término no dicen la frase clave de la correcta de Predice (M5). | Parcial: con marcas que la predicción declara (como en Divisibilidad). |
| **El juego no trae la trampa que la predicción reserva** (M3). | Parcial: el juego declara los códigos que muestra, y la predicción debe traer al menos uno que no esté ahí. |
| **En la práctica, la correcta nunca es la más larga ni la más corta**, en cada problema y no en promedio (hoy la prueba común acepta hasta el 45 %). | Sí, en `probar-generador.js`. |
| **Nombres de lugar que empiezan con «Il»** (Ilave, Ilo) se leen como «ll»: avisar. | Sí: búsqueda de texto. |

## Correcciones (19 nov)

Fase 8 del método (`docs/metodo/unidad/6-correcciones.md`), junto con los dos informes del lector en frío (ver
`rutinas/frio/razonamiento-verbal.definiciones.md`, «Correcciones de la ronda 1»). La teoría pasa a v0.4.1. Las copias de
antes están en `/tmp/claude-0/-home-user/31d0ae9f-8026-5866-a5dc-2c8554ea89bf/scratchpad/e5-cierre-rv/antes/`.

**Pruebas nuevas.**
- 16 al final de `definiciones.test.js`. Con la versión de antes fallan las 16 (y la del conteo de términos); con la
  nueva pasan.
- 4 al final de `generador.test.js`. Con el generador de antes fallan las 4 (y 3 casos de `casos.json`); con el nuevo
  pasan.

Se comprobó corriendo las mismas pruebas contra las copias de antes, con los arneses de `aud/corre-teoria.test.js` y
`aud/corre-gen.test.js`.

**Resultado.**
- Unidad 50 de 50 y generador 31 de 31; `rv-definicion` y `rv-soporte` en verde.
- Validador con `calidad: 2` simulada y 200 semillas: 0 problemas, 0 pendientes.
- `contenido/teoria/teoria.test.js` 163 de 163; `papel-reglas.test.js` y `alternativas.test.js` 137 de 137.
- `papel-generador.js --revisar`: al día.
- `medidas.js`: la correcta nunca es la más larga ni la más corta en 244 preguntas (antes 13 en la teoría y 25 en la
  práctica).
- No se corrió `npm test` completo, porque hay otras sesiones trabajando. Se corrió `npm run catalogo`: de esta unidad
  cambian dos entradas de `app/datos/glosario/razonamiento-verbal.json`.
- Capturas de después: 112, sin errores de página, en
  `/tmp/claude-0/-home-user/31d0ae9f-8026-5866-a5dc-2c8554ea89bf/scratchpad/e5-cierre-rv/despues/`. Se miraron el juego de
  las ideas 2 y 3, la regla de la idea 4 y la tarjeta de la vicuña.

| # | Qué se hizo |
|---|---|
| A1 | La B pasa a «Mes: cada una de las doce partes en que se divide el año» (57 caracteres, más que la C). Prueba A1. |
| A2 | Ejemplo «Dos veces «es»» con la vicuña: «La vicuña es muy apreciada…» contra «La vicuña es un camélido silvestre de los Andes, de lana muy fina». Datos de «camélido» y «silvestre»; el resuelto dice que esos rasgos la separan de la alpaca y la llama. Prueba A2. |
| M1 | Las 14 listas, una por una:<br>• el cuy suma «ave», que no lo contiene;<br>• un distractor más largo en la bicicleta, el campeonato, el chullo y el lago;<br>• «pico» por «serrucho», «vendedor» por «vender», «prenda» y «cuy» como nuevas candidatas;<br>• «decir» y «gritería» en «En voz muy alta»;<br>• «limpio, limpieza, sucio» en lugar de «seco», para que la correcta no sea la más corta;<br>• «vereda peatonal» y «… ni albañil».<br>La correcta va al final en 4 de 14 (antes, 7). La lluvia alarga la 1. En el generador, `elegir` vuelve a mezclar las incorrectas hasta que la correcta queda entre la más corta y la más larga; la primera mezcla, si ya cumple, es la de siempre. También se alargaron dos incorrectas del banco (los platillos y la parrilla). Pruebas M1 (dos) y la primera del generador. |
| M2 | «Ahora tú»: «calzado de playa», «tienda de abarrotes», «tutor», «correr a galope», «pariente político» y «hogar». «Así se resuelve»: la canoa tiene ahora la balsa como segundo vecino. Nivel 3: «tragaluz» (con su glosa en Datos) y «lluvia fina». La pista acierta ahora en 6 de 17 (antes, 15). Prueba M2. |
| M3 | El juego trae «sartén» («cocina, pero no es honda») en lugar de «olla de presión»; la predicción estrena la más específica. La invitación de la mesa «La hoja de las cinco palabras» pasa a «Deja solo las dos que cambian un rasgo». Prueba M3. |
| M4 | La definición pasa a otro lugar: la 1 en la quinua, la ojota, la puna y el yaraví; la 3 en la apacheta, la faena y la huaca; la 4 en la totora. En la práctica: la 1 en el tarwi y la 3 en el mate burilado y el eclipse. Con eso se corrigieron todas las citas «oración N» de esos textos. Pruebas M4 y la tercera del generador. |
| M5 | «Definición negativa» va sin `simple`, así que sale del Resumen de la idea 4 y queda en la pestaña Glosario. Sus ejemplos ya no dicen quién entra. «Suficiente» tiene otro tercer ejemplo: «Que tiene joroba» separa al camello de la llama. Prueba M5; la prueba del conteo pasa a [4, 2, 2, 2, 2]. |
| M6 | Lee 2 de la idea 1: «Por eso sigue un rasgo: algo que la cosa tiene y las demás no». Lee 3: «Esa ficha es muy amplia». Lee 2 de la idea 2: «… la definición queda muy estrecha». Prueba M6. |
| M7 | `lecturaAve` dice las dos fallas cuando pasan juntas, y Mira 1 dice «quedan fuera dos aves, y se cuela el murciélago». Prueba M7. |
| M8 | `completar`, al final de la unidad, agrega a los Datos de cada ejemplo y de cada «Así se resuelve» la línea de cada falla que su resuelto nombra. Si no cabe en 6 líneas, lanza un error. «Ahora tú» de la idea 1 suma «Define al vecino», y el de la idea 3, «El vecino» y «Otra clase». Prueba M8. |
| M9 | Las seis láminas o carteles traen el hecho («… y respira por branquias», «da leche a…», «tiene seis patas», «suena cuando se la sopla»). En Datos va el del vecino («El pato nada, pero respira con pulmones», «La araña es pequeña y tiene ocho patas»…). Prueba M9. |
| M10 | Regla: «Tiene que decir la clase y un rasgo que separe». La lectura de la alpaca dice «su rasgo no separa, también entra la vicuña», y la voz pregunta «¿dice qué es y la separa de sus vecinos?». Prueba B2. |
| M11 | «Objeto que sirve para hacer cuentas» (entran el celular y el ábaco) y «Objeto que sirve para refrescar el aire de un cuarto» (entra el abanico). Los casos caso-0, caso-2 y caso-3 de `casos.json` se revisaron a mano y se rehicieron. Prueba: la clase lejana pide un rasgo. |
| M12 | `D_VERBO` y Lee 2 de la idea 3 dicen «cortar». Prueba M10. |
| M13 | Naranja para lo descartado en 8 ejemplos de la idea 4. El libro: «Un libro no es una persona: «amigo» no es su clase. Le faltan una clase de verdad… y un rasgo». Prueba B3. |
| M14 | Lampa, en la teoría y en el generador. Prueba B1. |
| M15 | Mira de la idea 4 sin `tapar`, y «soltero» en violeta. |
| M16 | Regla nueva de la idea 5 (28 palabras); Mira 2 del chuño: «cuánto se puede guardar: un dato del chuño, no qué es». Los enunciados dicen «del simulacro, sobre un texto». Prueba B1. |
| M17 | El género próximo del barómetro se elige entre «objeto», «instrumento» e «instrumento de medida». El nivel 3 de sentido figurado es «El motor del cuerpo», con «Motor: máquina…» entre las literales. |
| M18 | La voz y la tarjeta 4 dicen «Toca la clase o la casilla de un rasgo». Sale la línea «botón marcado…» de las 5 leyendas. Mira 1: «no es la clase más cercana». Las voces de las ideas 3 a 5 dicen que se toca en la hoja. Prueba B1 (leyenda). |
| B1–B5 | Hechos:<br>• B1, la lechuza: «En la hoja falta la palabra…»; Datos: «sin agregar otro».<br>• B2, el chullo: las orejeras van en el cartel.<br>• B3: Lee 2 de la idea 5 dice «la helada es…».<br>• B4: la respuesta de la tardanza dice «después de la hora fijada» (con «7:45» la marcaba `figura-respuesta`); la mesa ya no es «redonda»; el título es «Animales del jardín»; el cuento dice «La oración 1 del mensaje dice…»; la C de la fotosíntesis ya no nombra a las llamas.<br>• B5: «entran» y «del». Prueba: la cuarta del generador. |
| B6–B9 | No se tocaron (ver la tabla). |

### Pendiente

- **Para Gerson (dibujo de prueba de `rv-soporte`, compartido):** los uñeros de la página de diccionario parecen cortados
  (B6).
- **De `app/`:** el subrayado del glosario en el rótulo «Oración 1» (B7).
- **Las reglas nuevas del validador** quedan como propuesta (tabla de arriba). En esta unidad, M1, M2, M4, M5 y M8 ya
  son prueba propia.
- **Decidido por la sesión, Gerson revisa después:**
  - Sin `simple` para «definición negativa». El término sigue en la pestaña Glosario, pero no en «Palabras de esta
    idea», para no adelantar la predicción de la idea 4.
  - La regla de la idea 4 nombra «un rasgo que separe» en vez de sacar del juego la entrada de la alpaca.
  - En la idea 3, algunas alternativas son frases de dos o tres palabras («calzado de playa», «tienda de abarrotes»):
    así la más específica no es la única con complemento.
