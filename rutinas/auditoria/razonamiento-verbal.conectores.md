# Auditoría de contenido: «Conectores lógico-textuales» (razonamiento-verbal.conectores)

20 nov 2026. Auditor externo (cierre delegado, `docs/metodo/unidad/cierre-delegado.md`), que no escribió la unidad.
Contrato: `docs/plan-calidad.md` §3 y §5. Vara: `docs/molde-unidad.md` §10 y la fila de verbal de §11. Reglas
automáticas: `docs/metodo/unidad/reglas-validador.md`. Lo aprendido en las etapas 5 a 7: «Lo que encontraron los
auditores» y «Lo que salió al cerrar la Etapa 7» de `docs/metodo/unidad/etapa-delegada.md`. Decisiones:
`docs/etapa8/propuesta-verbal.md`. Lo que vieron los dos lectores en frío está en
`rutinas/frio/razonamiento-verbal.conectores.md`; aquí se cita cuando el código lo confirma.

**Qué se revisó.**
- La teoría `contenido/teoria/razonamiento-verbal/conectores.js` (v0.3.0, sin `calidad: 2`):
  - las 5 ideas con sus 7 momentos;
  - los 75 ejemplos;
  - «Así se resuelve» (4 hojas por idea) y «Ahora tú» (6 casos por idea; la app baraja las opciones);
  - el glosario (14 términos), la historia con su fuente y las 5 mesas.
- La práctica `plantillas/conectores/` (nueva): 10 tipos (2 por idea), banco de 30 textos, `casos.json` (20) y
  `papel.json` (8).
- La app a 390 px con `--entera`, contra un servidor propio en el puerto 4450: 35 momentos y 75 ejemplos, sin errores de
  página y sin capturas repetidas (md5; solo las 15 copias de `lector/`).

**Cuentas (en verbal: cada pregunta con alternativas, rehecha por otro camino).** Todo está en
`/tmp/claude-0/-home-user/31d0ae9f-8026-5866-a5dc-2c8554ea89bf/scratchpad/e8-cierre-cn/aud/`.
- **Lo que se revisa** lo saca `extrae.js` de lo que la unidad y el generador entregan (textos, opciones,
  explicaciones, Datos y figuras), sin sus funciones internas:
  - 106 preguntas de la teoría: 5 predicciones, 30 «Ahora tú», 20 hojas de «Así se resuelve», 25 hojas de nivel 3,
    25 listas de nivel 2 y el juego de la idea 5;
  - los 25 ejemplos de nivel 1, a mano;
  - 400 semillas de la práctica y los 30 ítems del banco.
  Escribe además un listado con las alternativas en orden alfabético, sin marcar la correcta.
- **Un léxico propio** (`lexico.js`), escrito desde ese listado y sin mirar las tablas de la unidad (`REL1` a `REL5`),
  la del generador (`MARCA`) ni el revisor del autor (`e8-rv/rev/`):
  - la relación que marca cada conector, con la concesión aparte del contraste;
  - lo que pide cada espacio, leído en el texto;
  - para las 24 preguntas que piden un final o «la oración que dice lo mismo», una etiqueta por alternativa (cumple,
    lo esperado, rompe, suma, repite, al revés, choque, «aunque» en el lado malo, cambia el dato, otra cosa);
  - «rival»: una alternativa que un alumno atento podría defender, o que se descarta solo sabiendo algo que el texto no
    dice («saber de fuera»).
- **Un revisor** (`revisa.js`) comprueba:
  - que una sola alternativa cumple en todos los espacios según mi léxico, y que es la que marca la unidad;
  - que la explicación de cada incorrecta nombra la relación que su conector marca de verdad (o el espacio en que falla);
  - la regla 10 de verbal: ni la más larga ni la más corta, ni escrita dentro de otra, y la letra repartida.
  Mide además las fugas que pidió la sesión:
  - **«la que más comparte»** con las demás, **«la que menos»** y **«la más repetida por lugar»**: con cuánta
    probabilidad acierta quien elige así, contra el azar;
  - **la puntuación junto al espacio**: cuántas alternativas caben con los signos que trae el texto;
  - **los Datos**: cuántas alternativas quedan si se descartan las que no están en el recuadro.
- **`casos-aparte.js`** rehace `casos.json` con mi léxico y una tabla de códigos escrita desde las definiciones de RV24
  a RV35 y RVC1 a RVC6 (no desde la función `codigo` del generador).
- **A mano**: las 106 preguntas, los 25 de nivel 1 y los 30 ítems del banco, alternativa por alternativa, pensando en
  un alumno de 5.º que no sabe nada que el texto no diga (precios, geografía, cuánto dura un vuelo). También todo lo
  que se lee buscando «resultado», «causa», «consecuencia», «cierre», «conclusión» e «inferencia», y los nombres
  propios (la I mayúscula que se lee «l»).

**Resultado de las cuentas, antes de corregir** (`revisa-antes2.txt`, la versión de antes en `…/e8-cierre-cn/antes/`).
- Una sola correcta, y es la que marca la unidad, en las 106 preguntas, los 30 ítems y las 400 semillas: 0 fallas.
- Ninguna correcta es la más larga ni la más corta, ni va escrita dentro de otra (0 en 506).
- Letras: nivel 3, A–E una vez por idea; «Así se resuelve», cada letra 4 veces; listas de nivel 2, 9, 8 y 8.
- **Pero hay fugas que el validador no ve**:
  - **Datos**: en 52 preguntas de la teoría y en casi todas las semillas (391 de 400) quedan menos alternativas si se
    descartan las que no están en el recuadro;
  - **puntuación**: en 7 preguntas la puntuación del texto solo admite la correcta, y en 17 más descarta alguna;
  - **varios espacios**: «la que más comparte» o «la más repetida por lugar» aciertan el doble que el azar en 12
    preguntas de la teoría y en 126 de 298 problemas de la práctica.
- Rivales: 4 en la teoría (más 2 que vio el lector B) y 1 en el banco. «Saber de fuera»: 4 (M5).
- Validador con `calidad: 2` simulada y 200 semillas: **0 problemas, 0 pendientes**. Ninguna falta de abajo la ve una
  regla de hoy. `herramientas/ecuaciones-ancho.js`: «todo cabe», aunque el lector A vio la regla de la idea 2
  partida en «por / eso» (la herramienta no lo marca: se parte en un espacio).
- Pruebas propias antes de corregir: teoría 57 de 57, generador 31 de 31.

**Contenido propio y datos del mundo.**
- Los textos son inventados; ninguno copia un examen ni un manual. El formato UNI y los códigos RVC1 a RVC6 son
  hipótesis declaradas (propuesta, decisiones 4 y 6).
- La historia cita la fuente de la matriz (Instituto Cervantes, Diccionario de términos clave de ELE), y la saponina es
  de libro, sin cifra.
- «A más de 3800 metros» (Puno) y «heladas de hasta diez grados bajo cero» son creíbles y no se usan para calcular.
- Ningún nombre se lee mal en esta letra: Iván, Inca, Iris y Lampa (Ilave ya no está; lo prueba `conectores.test.js`).
- «Inferencia» y «conclusión» no salen en ningún texto (prueba propia).

## Hallazgos

### Alta (el alumno no puede resolver o aprende algo falso)

| # | Punto | Dónde | Evidencia | Corrección propuesta |
|---|---|---|---|---|
| A1 | 7, 13 (la regla dice algo falso del texto); choque con Inferencias | Idea 3: Predice, Mira paso 1 y la regla del cierre (lector A); «Así se resuelve» 54, ejemplos «El viaje de promoción» y «La plaza arreglada», «Ahora tú» del mercado | Mira dice que la última oración «junta dos cosas que el folleto ya dijo: muchas formas y fácil», y el folleto no dice «fácil». El alumno aprende que un cierre puede traer algo nuevo. Además, varios «cierres» son una consecuencia o una conclusión: «ya tenemos lo necesario para el viaje» sale de juntar dinero, «la plaza quedó como nueva» sale de arreglarla, «es un cultivo hecho para el altiplano» pide saber cómo es el altiplano, y «comida de todo el Perú» deja fuera la costa. Eso es lo que Inferencias llamará conclusión. | Un cierre que solo junta lo dicho («se lava, se hierve y se prepara de muchas formas»), y los otros cierres como generalización sin dato nuevo. El Dato dice «la última parte junta en una sola idea lo dicho antes». |

### Media (el alumno se traba o duda)

| # | Punto | Dónde | Evidencia | Corrección propuesta |
|---|---|---|---|---|
| M1 | 13 (se elige entre las que da el recuadro); 10 de verbal | Datos de casi todas las preguntas: 52 en la teoría y 391 de 400 semillas (lector B: tarjetas 01 y 12) | El recuadro trae una lista fija por idea, con los conectores entre paréntesis, y la correcta siempre está en él. Muchas incorrectas no: «es decir», «por ejemplo», «por consiguiente», «en cambio», «o sea», «porque», «aun así»… Quien descarta lo que no está en el recuadro deja 2 de 5 en «Así se resuelve» 9, 10 y 93, y 2 de 4 en los seis «Ahora tú» de la idea 3. El caso de la tarjeta 01 trae solo la adición. En varios espacios, la práctica suma la línea de la relación que pide el ítem («ejemplo», «orden» o «concesión»): eso dice qué pide un espacio. En «Ahora tú» de la mazamorra falta la línea de orden y en «El tren de los vecinos» falta «ya que»: con esos Datos no se puede elegir la correcta. | Datos por pregunta: las líneas fijas de la idea y una por cada relación que marca alguna alternativa, con todos los conectores de esa relación que usa la unidad (máximo 6 líneas). Antes de la idea 3, el caso y las otras palabras van sin sus nombres («Un caso», «Otras palabras»). |
| M2 | 10 de verbal (la correcta no se delata) | Puntuación junto al espacio: 7 preguntas en las que solo cabe la correcta y 17 en las que se descarta alguna (lector A, idea 2); el banco entero | «Huaico; ¿…? los buses salieron» (sin coma después) solo admite «por eso»: «sin embargo», «además» y «es decir» piden coma. «¿…?,» pide uno con coma; «colegio ¿…? los profesores» (sin signo) solo admite «porque». El lector A lo notó: «puedo adivinar por el signo». | Puntuación neutra: dentro de la oración, siempre «, ¿…?» y nunca «¿…?,»; al empezar la oración, sin coma. Los conectores del juego traen su propia coma. |
| M3 | 3 de la etapa 5 (una sola respuesta); 10 de verbal | Fuga que el autor ya había atacado en la idea 5 (decisión 13): sigue en 12 preguntas de la teoría y en 126 de 298 problemas de la práctica | Cada pregunta tenía la correcta y una RVC4 con el mismo conector en el espacio 1. Las dos quedaban «centrales» empatadas: elegir la que más comparte acertaba el 50 % (el azar es 25 %). La prueba del autor solo exigía que no fuera la central única. En la Predice de la idea 5, la correcta era la más repetida en los espacios 1 y 2. En la práctica, `kermes`, `libros`, `abuelo`, `parque`, `papas` y `largo` delataban la correcta en 126 de 298 problemas. | La RVC4 lleva en el espacio 1 otro conector de la misma relación («así que» por «por eso»), y las que fallan en los dos comparten su último conector. Prueba: ni «la que más comparte», ni «la que menos», ni «la más repetida por lugar» aciertan más de 15 puntos sobre el azar. |
| M4 | 3 de la etapa 5 (una sola respuesta) | «Ahora tú» 95 (lector B); tarjetas 05 y 06 (lector B); «El turno de la tarde»; «Ahora tú» del Inca Garcilaso; banco `chaleco` | Hay otra alternativa que un alumno atento puede defender:<br>• «por eso – sin embargo» en el mirador: «a mitad de camino hay un mirador» no rompe nada, y el lector dudó;<br>• «también llovió en la tarde» y «llegaron más turistas en el verano» se leen como la razón;<br>• «además» en «el turno de la mañana sigue igual» (no rompe lo esperado);<br>• «Dado que el Inca Garcilaso escribió en España…» se lee como nostalgia;<br>• «Ya que no sabía nadar, Luis subió al bote con su chaleco» es causal. | Textos que dejan una sola: «el sendero no tiene barandas en las curvas», «también llegué tarde ayer», «este año la visitarán más turistas», «así que – es decir» en lugar de «por eso – además», «la abuela nunca fue a la escuela, aprendió a leer sola», «Luis cruzó el lago en bote sin miedo». |
| M5 | Encargo: lo esperado se ve sin saber nada fuera del texto | Ejemplo «El huaico de la carretera»; «Así se resuelve» 94; Predice de la idea 5; «Así se resuelve» 54 | Para responder hace falta saber algo que el texto no dice, lo mismo que la sesión ya corrigió en la idea 1:<br>• que la fruta va a Lima por la carretera central, y que si falta sube su precio;<br>• cuánto dura el vuelo de Juliaca a Lima: salir tres horas tarde y llegar «antes del mediodía» puede ser lo esperado;<br>• que lo escaso es caro: «se vende cara porque se cultiva poco» contra «por eso»;<br>• cómo es el altiplano. | «Los camiones de fruta llegan a Lima por la carretera central» y, entre las alternativas, «la fruta llegó tarde a los mercados»; «ningún pasajero se quejó del retraso»; «casi no se ve en Lima, porque se vende sobre todo en las ferias de la sierra»; «aguanta condiciones difíciles». |
| M6 | 6 (una palabra, un sentido); 13 | Dato de orden en el tiempo (lector A); voz y Lee 4 de la idea 4 | «Orden en el tiempo: la segunda parte pasa después de la primera (primero, antes, después…)»: «antes» dice lo contrario. La idea 4 pregunta si la lluvia fue «una razón o la causa de algo», y en la unidad razón y causa son lo mismo: lo que distingue las oraciones 2 y 3 es de qué lado va la locución. | «Dice qué pasa primero y qué pasa después»; «¿Lo que sigue a la locución es un obstáculo, una razón o lo que resultó?». |
| M7 | 5 (un color, un papel) | Idea 1: leyenda y consigna del juego contra Mira y la regla; idea 3 igual (lector A) | La leyenda dice que el turquesa es «la segunda idea», y en Mira y en la revelación de Predice marca la primera. | La leyenda dice «lo que decide el conector» (o «la clase») en las dos ideas, y la consigna dice qué es eso en el juego. |
| M8 | 4 (lo que se compara se ve junto) | Mira de la idea 5 (lector B) | Predice baraja las opciones y Mira las muestra con letras fijas: la correcta era la A en Predice y la D en Mira, y el lector creyó que se había equivocado. | Mira como en las otras ideas: el cuaderno con el texto y las alternativas con raya, sin letras, y los pasos que nombran el conector. |
| M9 | 2 (misión) y 7 de la idea 2 (lector A) | Misión del comunicado; ecuación de la regla | La misión dice «el conector que dice qué lleva a qué», y la oración 3 es un contraste. La ecuación se partía en «por / eso» y solo mostraba un orden. | «El conector que marca cómo se unen sus ideas»; ecuación «por eso + consecuencia; porque + causa», con «por eso» que no se parte. |
| M10 | 8 de la etapa 5 (repetición) | «Ahora tú» 55 de la idea 3 y 75 de la idea 4 (lectores A y B) | El primer «Ahora tú» pedía la misma relación y la misma respuesta que la primera hoja de «Así se resuelve» («por ejemplo»; «aun cuando»). Lo mismo en la idea 2 («porque»). | Otro orden de los casos: en las semillas 0 a 3, «Ahora tú» pide otra relación que su «Así se resuelve». |

### Baja (estilo)

| # | Punto | Dónde | Evidencia | Corrección |
|---|---|---|---|---|
| B1 | 10 de verbal | Predice de las ideas 1 y 2 (lector A) | La segunda nota del mural («El concurso fue el sábado…», «Las clases vuelven el lunes…») no sirve y distrae. | Se quita. |
| B2 | 7 | Regla de las ideas 2 a 5: el «Vale si» (lector B) | La app antepone «Vale si»: «Vale si se cambia la locución…», «Vale si se mira lo que hay…» se leen raro. | Condiciones que siguen a «Vale si»: «la locución se puede cambiar por un conector simple y la oración sigue diciendo lo mismo». |
| B3 | 7 | Tarjetas 10 y 11 (lector B) | «Un obstáculo que no impidió nada» suena a que no pasó nada. | «no impidió terminar»; «un obstáculo superado, y la banda no tocó». |
| B4 | 9 | Idea 4: Predice con «aun así», que Lee no muestra (lector B) | «Aun así» está en los Datos y el glosario de la idea 1, pero en la idea 4 el lector no lo reconoció. | Lee 3 lo usa en su ejemplo («hacía frío; aun así, salimos»), sin decir dónde va «aunque». |
| B5 | 9 (orden) | Idea 1, «Ahora tú» del lago | «Porque» (RVC1) es un distractor de la idea 1, y la causa la estrena la idea 2. | Se quita: queda con cuatro opciones. |
| B6 | 6 | «Así se resuelve» 12 | «Entrenó poco hace esperar malos resultados»: «resultado» en el sentido deportivo, en la idea que estrena «resultado» como relación. | «hace esperar que pierda». |
| B7 | — (app y pieza) | Botón «¿…?» del juego en violeta (lector A); hojas apiladas bajo el folleto (lector A) | El botón elegido toma el color de la app, y la leyenda dice que el violeta es el conector que marca la relación. Las hojas son del dibujo de `folleto` en `rv-soporte`, común a todo verbal. | Para la app y la pieza; no se toca aquí. |
| B8 | 13 | «Los miradores de Puno», la helada del altiplano | Lo esperado (la altura cansa; la helada daña la papa) lo sabe cualquier alumno de Puno, y el texto ayuda («sin problemas»). | Se deja. |
| B9 | 13 | «Así se resuelve» 71 y «Ahora tú» 75 (lector B) | «La lista de concesión tiene una sola opción posible»: es el diseño (decisión 3), porque el alumno decide la relación y el recuadro le da sus conectores. | Se deja; con M1, el recuadro trae ahora también las relaciones de las demás alternativas. |

## Lo que está bien y hay que copiar al molde

- **El banco de la práctica con la relación que pide cada espacio**, y un generador que lanza un error si no queda
  una sola alternativa o si dos incorrectas comparten código. En 400 semillas no hubo ninguna falla.
- **Un mundo chico por juego con una sola combinación que cumple la misión**, jugado tocando el soporte.
- **El largo de la correcta controlado en todas partes**: 0 fallas en 506 preguntas.
- **Las cinco predicciones agregan algo que el juego no tenía**: el conector ya puesto, el otro orden, el cierre,
  dónde va «aunque» y el tercer espacio.
- **La prueba que compara cada oración en trozos con su texto entero.**

## Reglas que faltan en el contrato o el validador

| Regla | ¿Automática? |
|---|---|
| **Los Datos traen la relación de cada alternativa** (M1): ninguna se descarta solo porque su conector no está en el recuadro, y ninguna línea depende de lo que pide el espacio. | Sí, en verbal: cada conector de cada alternativa aparece en una lista del recuadro (prueba de esta unidad y de su generador). |
| **La puntuación junto al espacio es la misma en toda la unidad** (M2). | Sí: «, ¿…?» dentro de la oración y nunca «¿…?,» (prueba de esta unidad y del generador). Vale para todo hueco de verbal. |
| **Con varios espacios, ninguna manera de elegir sin leer acierta más que el azar** (M3): ni «la que más comparte», ni «la que menos», ni «la más repetida por lugar». | Sí: la probabilidad de acertar de cada manera, contra 1/n + 0,15 (prueba de esta unidad y del generador). `probarFugas` solo mira la central única. |
| **Un cierre no trae nada que el texto no diga** (A1). | En parte: las palabras de la última oración están en las anteriores (prueba de la Predice de la idea 3). Lo demás es juicio. |
| **Una definición de los Datos no se contradice con su lista** (M6: «antes» en «pasa después»). | No en general; prueba propia para el orden en el tiempo. |
| **Mira no muestra letras si Predice se baraja** (M8). | Sí: la figura de Mira no trae `alternativas` con letra. |
| **«Ahora tú» de la semilla s no pide lo mismo que «Así se resuelve» de la semilla s** (M10). | Sí, para las semillas 0 a 3 (prueba de esta unidad). |
| **Lo esperado se ve sin saber nada fuera del texto** (M5), y **ninguna incorrecta se puede leer como la que pide el espacio** (M4). | No: es juicio del auditor. Ayuda el léxico aparte con sus etiquetas «rival» y «saber de fuera». |

## Correcciones (20 nov)

Hechas por el mismo auditor (paso 3 del cierre delegado), junto con lo que señalaron los dos lectores en frío (ver
`rutinas/frio/razonamiento-verbal.conectores.md`, «Correcciones de la ronda 1»). Las copias de antes están en
`/tmp/claude-0/-home-user/31d0ae9f-8026-5866-a5dc-2c8554ea89bf/scratchpad/e8-cierre-cn/antes/`.

**Pruebas nuevas.**
- **Teoría**: 8 al final de `conectores.test.js` («cierre · …»):
  - la puntuación junto al espacio;
  - los Datos con cada conector de cada alternativa, y 6 líneas o menos;
  - las tres maneras de elegir sin leer en varios espacios;
  - el cierre que no trae nada nuevo;
  - el orden en el tiempo con «antes»;
  - Mira sin letras;
  - «Ahora tú» distinto de su «Así se resuelve»;
  - la regla de la idea 2 con los dos órdenes.
  Con la versión de antes fallan las 8; con la nueva pasan 65 de 65. Se comprobó con un árbol aparte con la unidad de
  antes y la prueba nueva (`…/e8-cierre-cn/viejo-arbol/`). También cambió la prueba del cuaderno de Mira, que ahora
  admite un texto de dos oraciones (idea 5).
- **Generador**: 3 al final de `generador.test.js` (Datos, puntuación y fugas de varios espacios). Con el generador de
  antes fallan las 3 (la de fugas: 126 de 298 problemas delataban la correcta); con el nuevo pasan 34 de 34.

| # | Qué se hizo |
|---|---|
| A1 | Predice y Mira de la idea 3: «se lava, se hierve y se prepara de muchas formas». Cierres nuevos: «toda la promoción trabajó para el viaje», «la junta renovó toda la plaza», «es un cultivo que aguanta condiciones difíciles» y «comida de muchas regiones». El Dato del cierre es «la última parte junta en una sola idea lo dicho antes». |
| M1 | `datosDe` en la teoría y en el generador: las líneas fijas de la idea más una por cada relación que marca alguna alternativa; las que piden un final conservan la tabla de la idea. Todas las líneas están juntas arriba, con listas completas (el contraste suma «en cambio» y «o se opone»; la causa, «como»). La tarjeta 01 trae adición, contraste y resultado. |
| M2 | `neutro` en `oracion()` y los 30 textos del banco reescritos: «, ¿…?» dentro de la oración y sin coma después. |
| M3 | Las RVC4 de la idea 5 (Predice, «Ahora tú», «Así se resuelve» 94, ejemplos 7, 11, 13, 14 y 15) y del banco cambian como dice la tabla. `papas`, que tenía un espacio igual en todas, pasa a `posta`. |
| M4, M5 | Como dicen las tablas. «Ahora tú» de la mazamorra pasa a la feria de Lampa (causa y consecuencia). |
| M6–M10 | Como dicen las tablas. |
| B1–B6 | Hechos, como dice la tabla. |
| B7–B9 | No se tocaron (ver la tabla). |

- `casos.json`: los 20 casos se recalcularon con `casos-aparte.js`, y coinciden con el generador. Siguen la misma
  semilla y el mismo ítem; por el banco nuevo, cambian las incorrectas de 6 (caso-4, 9, 12, 14, 17 y 19).
- `papel.json` se regeneró con `herramientas/papel-generador.js`.

**Resultado.**
- **`revisa.js` sobre la versión nueva** (`revisa-despues.txt`):
  - 0 fallas y 0 avisos en 106 preguntas, 30 ítems y 400 semillas;
  - Datos que descartan: 0 en la teoría y 0 semillas;
  - puntuación: 0 (las 3 que marca son espacios al empezar la oración, que van sin signo en todas);
  - varios espacios: 0 en la teoría, y 5 de 400 semillas en el límite (`largo`, «la que menos comparte»);
  - letras como antes.
- **Validador** con `calidad: 2` simulada y 200 semillas: 0 problemas, 0 pendientes.
- **Pruebas**: teoría 65 de 65 y generador 34 de 34. `contenido/teoria/teoria.test.js`: 161 de 164; las 3 que fallan
  son de otras unidades en obra (aritmetica/numeros-racionales, quimica/mol-y-composicion y
  razonamiento-matematico/razonamiento-inductivo). `papel-reglas.test.js` y `alternativas.test.js`: 161 de 161. La
  regla del papel de toda la ficha, simulando la marca: nada. `papel-generador.js --revisar`: al día.
- **`ecuaciones-ancho.js`**: todo cabe (50 pantallas, 350 renglones).
- **No se corrió `npm test` completo**, porque hay otras sesiones trabajando. Sí se corrió `npm run catalogo`.

### Pendiente

- **De la app y la pieza** (B7): el botón elegido «¿…?» en violeta y las hojas apiladas del `folleto`.
- **Las reglas nuevas del validador** quedan como propuesta (tabla de arriba). En esta unidad ya son prueba propia.
- **Decidido por la sesión, Gerson revisa después**:
  - **Datos por pregunta** (M1), con una línea por cada relación de sus alternativas, en lugar de la tabla fija de la
    idea. Se descartó dejar la tabla fija, que dejaba descartar sin leer, y poner todas las relaciones en cada recuadro,
    que no caben en 6 líneas. La práctica de la idea 1 muestra ahora la línea de causa cuando un distractor es
    «porque»: la idea 2 la estrena, pero la práctica no espera a su predicción.
  - **Puntuación neutra** (M2): «, sin embargo, el examen…» en lugar de «; sin embargo, el examen…» cuando el juego
    llena el espacio. La RAE prefiere el punto y coma antes de «sin embargo», pero acepta la coma en oraciones cortas.
    Se descartó dejar cada texto con la puntuación de su correcta (era la fuga) y poner la coma dentro de cada
    alternativa (no es la forma del examen).
  - **Antes de la idea 3, «Un caso» y «Otras palabras»** en los Datos, sin los nombres que estrena la idea 3 (orden,
    punto 9).
  - **«Resultado» (idea 1) y «consecuencia» (desde la idea 2)** nombran la misma relación, como decidió la propuesta
    (decisión 2). Los Datos y los textos los usan siempre en ese sentido; el único uso deportivo («malos resultados»)
    salió.
