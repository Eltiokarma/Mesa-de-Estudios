# Visión a futuro: modo PISA, agilidad mental e interacciones tipo juego

5 de noviembre de 2026 · Ideas dictadas en una sesión aparte. Igual que `docs/vision-futura.md`: **no se desarrolla todavía**. Antes de ejecutar algo de aquí, se discute y se pasa a `docs/fundacional.md` y a la hoja de ruta.

Ideas que se refuerzan entre sí:

1. **Modo PISA**: no solo rayar ejercicios de academia, sino problemas en contexto real.
2. **Agilidad mental** (al estilo de la app Peak): calentamientos cortos que automatizan el cálculo que el examen da por sabido.
3. **Interacciones más dinámicas** (al estilo de Brilliant): arrastrar, deslizar, completar con fichas, ordenar, emparejar.
4. **Aprendizaje guiado paso a paso** (POGIL): el alumno descubre el concepto con preguntas escalonadas sobre un modelo.

---

## 1. Modo PISA

### Qué es PISA

- PISA (*Programme for International Student Assessment*) es la prueba de la OCDE que se toma cada pocos años a alumnos de 15 años en matemática, lectura y ciencia, y con la que se compara a los países.
- Perú sale entre los últimos de la tabla. En PISA 2025 (resultados del 8 de setiembre de 2026) sacó 382 en matemática, 390 en lectura y 406 en ciencia, frente a promedios OCDE de 463, 461 y 482. **7 de cada 10 alumnos de 15 años no llegan al nivel básico en matemática.** Detalle, fuentes y lo que falta verificar: `docs/investigacion/pisa-y-evaluaciones.md`.
- Lo que PISA mide no es si el alumno se sabe la fórmula, sino si la **usa en una situación de la vida real**: leer un enunciado largo, sacar los datos que importan de una tabla o un gráfico, decidir qué modelo aplicar, estimar y juzgar si la respuesta tiene sentido.

### Por qué nos importa

- Los colegios (nuestro primer cliente, el piloto) se evalúan con pruebas de este tipo: PISA y, en Perú, la Evaluación Nacional de Logros de Aprendizaje (ENLA) del Minedu. Según la ENLA 2025, solo el 12,8 % de 5.º de secundaria llega al nivel esperado en matemática (por verificar en el informe de la UMC).
- Lo que nos falta no es calcular, que las escenas ya entrenan: es **formular** (pasar de una situación desordenada a un problema) e **interpretar** (juzgar si el resultado tiene sentido y decidir). Son dos de los tres procesos que mide PISA en matemática; ver el informe.
- Un argumento de venta para el colegio piloto: "no solo prepara para la academia; entrena lo que mide PISA".
- El examen de admisión y PISA piden cosas distintas. La admisión premia velocidad y trucos sobre problemas cerrados; PISA premia leer, modelar y razonar en contexto. **Necesitamos los dos modos**, no reemplazar uno por otro.

### Cómo se vería en la app

- Un **modo PISA** por tema: el mismo concepto de una plantilla (por ejemplo, la lente o el circuito), pero planteado como situación real. Ejemplos de tipo de problema (propios, no copiados):
  - Óptica: ¿a qué distancia pongo el celular de la lupa para que la foto salga nítida?
  - Circuitos: el recibo de luz de la casa; cuánto gasta la terma comparada con el foco.
  - Porcentajes: comparar dos ofertas de una tienda o dos planes de celular.
  - Reactivo limitante: una receta del restaurante con ingredientes que se acaban.
- Con datos que hay que **buscar** (en una tabla, un gráfico, un recibo dibujado) y datos que **sobran**.
- Preguntas abiertas cortas además de alternativas: "¿te alcanza o no? explica en una línea".
- Niveles de dificultad que imitan los niveles de desempeño de PISA (del 1 al 6), para que el colegio vea en qué nivel está cada salón.
- Contexto local: Juliaca, Puno, el mercado, las combis, el lago, la altura (ya hay "modo altura" en circuitos). Que el alumno reconozca su mundo.

### Fuentes

Marcos de la OCDE, nota de país de Perú, informe nacional del Minedu e ítems liberados, con enlaces: `docs/investigacion/pisa-y-evaluaciones.md`, sección 5. **Regla 5 de `CLAUDE.md`:** los ítems liberados no se copian al producto; se escriben problemas propios con el mismo tipo de razonamiento.

---

## 2. Agilidad mental (al estilo de Peak)

### La idea

- Peak es una app de "entrenamiento cerebral" con minijuegos cortos y bonitos de memoria, atención, cálculo, lenguaje y agilidad mental.
- Lo que vale de Peak para nosotros: **sesiones de pocos minutos, divertidas, con tiempo y con mejora visible**. Si el alumno multiplica, suma, saca porcentajes y despeja rápido, un problema de energía, cantidad de movimiento, óptica o geometría le sale mucho más rápido, porque la cabeza queda libre para pensar en la física y no en la cuenta.
- Las capturas no se pudieron bajar en esta sesión (la red bloquea la App Store). Se ven en la ficha de la App Store (`apps.apple.com/app/id806223188`) y en los videos de YouTube de cada juego.

### Juegos de Peak que se pudieron confirmar (búsqueda web, 5 nov 2026)

Peak dice tener más de 45 juegos, en áreas como memoria, atención, resolución de problemas, agilidad mental, cálculo, lenguaje y creatividad. Solo pude confirmar las mecánicas de estos:

| Juego | Área | Qué hace el jugador | Cómo lo usaríamos nosotros |
| --- | --- | --- | --- |
| Must Sort | Atención | Clasificar imágenes a toda velocidad hacia uno u otro lado | Lanzar a un lado o al otro: ¿imagen real o virtual?, ¿serie o paralelo?, ¿ácido o base?, ¿m/s o km/h? |
| Rush Back | Atención | Decir si cada imagen es igual a la anterior (tarea *1-back*) | Comparar el resultado de un cálculo con el anterior: ¿mayor, menor o igual? |
| Partial Match | Memoria | Decir si cada figura coincide toda, en parte (mismo color u otra forma) o nada con la anterior | Comparar dos magnitudes: mismo valor y misma unidad, mismo valor en otra unidad (1 km y 1000 m) o distintas |
| Perilous Path | Memoria | Memorizar dónde están las minas en una cuadrícula y luego trazar un camino que las esquive | Memorizar un circuito o un diagrama de rayos y luego reconstruirlo |
| Low Pop | Resolución de problemas | Tocar las fichas de menor a mayor | Ordenar resultados de cuentas, potencias de 10 o fracciones de menor a mayor sin calcularlas del todo (estimar) |
| Size Counts | Razonamiento | Dos tarjetas con una operación cada una ("3 + 4" y "16 − 1"); se toca la de resultado más alto, o el botón del medio si son iguales ("4 + 1" y "2 + 3") | **"¿Cuál pesa más?"**: 2³ o 3²; 0,5 × 40 o 40 ÷ 0,5; 72 km/h o 25 m/s; 1 L o 1000 cm³ (iguales); 10 sen 37° o 5. Entrena estimar y convertir sin calculadora |
| Square Numbers | Razonamiento | Arriba aparece un objetivo (4) y abajo cuatro fichas (3, 6, 16, 1); se tocan las fichas hasta llegar al objetivo (3 + 1 = 4, que quedan marcadas). Hay un botón para deshacer | **"Llega al número"**: el objetivo es una resistencia equivalente, una masa o una velocidad, y las fichas son resistencias, pesas o datos con unidades. En química, coeficientes para balancear |
| Turtle Traffic | Agilidad mental | Tocar para que la tortuga suba y soltar para que baje, comiendo medusas | Poco aprovechable tal cual; sirve como ejemplo de juego con historia y personaje (nuestro gatito) |

Fuentes: [Dr Jack Lewis, reseña de Peak](https://www.drjack.co.uk/brain-training-review-of-peak-by-dr-jack-lewis/), [Saga, prueba de 5 apps](https://www.saga.co.uk/magazine/health-and-wellbeing/brain-training-apps-best-and-do-they-work), [Peak Labs, Partial Match](https://medium.com/@peaklabs/train-your-working-memory-with-partial-match-20b2df130969), [Peak Play, Turtle Traffic](https://medium.com/peak-play/from-concept-to-final-product-peak-s-lead-game-designer-on-creating-turtle-traffic-an-7de30749e6a0), videos de YouTube de [Low Pop](https://www.youtube.com/watch?v=oRPlpKBJvTI), [Must Sort](https://www.youtube.com/watch?v=1w0Jwh0M-J8) y [Turtle Traffic](https://www.youtube.com/watch?v=lKQEqjFfKBY).

### Lo que muestran las capturas de la app (6 nov 2026)

Once capturas de la versión en español, en un celular Android. No se suben al repo porque son material de Peak; aquí solo se anota lo que se ve.

**Catálogo de juegos diarios.** Son 43 juegos en 7 categorías, cada una con su color. "Ícono" quiere decir que la mecánica se deduce del dibujo y no está confirmada.

| Categoría (color) | Juegos | Los que nos sirven |
| --- | --- | --- |
| Lenguaje (morado), 6 | Word Fresh, Babble Bots, Word Hunt, Grow, Word Pairs, Word Path | Word Pairs (pares de palabras: sinónimos y antónimos, ícono) y Word Path o Word Fresh (armar palabras en una cuadrícula de letras, ícono), para razonamiento verbal |
| Memoria (naranja), 6 | Perilous Path, Partial Match, Spin Cycle, Baggage Claim, Memory Sweep, Bounce | Partial Match y Perilous Path (ver la tabla de arriba) |
| Razonamiento (verde), 10 | Moving Math, Square Numbers, Low Pop, Pixel Logic, Puzzle Blox, Castle Block, Earth Defense, Slider, Size Counts, Matcha Madness | **Los de cálculo:** Size Counts y Square Numbers (confirmados, ver abajo), Moving Math (armar operaciones con "+" y "=", ícono), Low Pop (ordenar de menor a mayor, también con negativos) |
| Concentración (rojo), 10 | Must Sort, Unique, Objectifind, Decoder, Tap Trap, Rush Back, Tracker, True View, Rush Back+, Tunnel Trance | Must Sort y Rush Back |
| Agilidad mental (azul), 7 | Turtle Traffic, Speed Spotting, True Color, Face Switch, Zap Gap, Flight Path, Refocus | True Color (sí o no rápido, ícono) y Refocus ("P9" y "A6" con sí o no: cambiar de regla según la tarjeta, ícono). El cambio de regla sirve para signos: "si es lente divergente, f es negativo" |
| Emoción (lila), 2 | Smile On Me, Face To Face | No |
| Coordinación (turquesa), 2 | Flame Dodge, Jump Control | No |

**Pantallas que valen como modelo:**

- **Inicio:** un solo número que lo resume todo ("Puntaje mental 442/1000"), la racha en días al lado, un botón grande "Entrenamiento mental" del día (no hay que elegir nada) y un evento de temporada con tiempo límite ("Edición Fiestas", juego de Halloween que dura 4 días). Para nosotros, el evento podría ser un reto la semana antes del examen de la UNI o de San Marcos, o por Fiestas Patrias o la Candelaria.
- **Rendimiento:** una barra por categoría, con su color y su puntaje (por ejemplo Razonamiento 600, Lenguaje 330), y marcas que parten la barra en niveles. Tiene pestañas "por el tiempo" y "percentil", y botones para comparar y compartir. Para nosotros: una barra por curso con el color de cada curso, el avance en el tiempo y, para el profesor, el mismo cuadro por salón.
- **Por juego:** un escudo con estrellas y un color de rango muestra el nivel de dominio. Se pueden marcar favoritos con una pulsación larga.
- **Dos pestañas:** "Juegos diarios" y "Entrenamiento avanzado".

- **Prueba de entrada recomendada:** arriba de la pestaña "Tests", Peak recomienda una "Prueba Cognitiva" que evalúa memoria, atención, razonamiento lógico y lenguaje con distintas tareas. Al final dice en qué eres fuerte y en qué áreas te conviene entrenar. **Esto sí lo copiamos**, con nuestra forma: una prueba de entrada por curso (la1) que termina en "estas son tus unidades fuertes y estas te conviene practicar", y arma el plan del alumno. Sin llamarla "cognitiva" ni dar un número de inteligencia.

**Lo que no copiamos (de frente):** además, la pestaña "Tests" ofrece una "prueba general de CI", un "test de CI rápido", una prueba de desgaste laboral y, "próximamente", una evaluación de riesgo de demencia de inicio precoz. Un juego de celular no mide el CI ni diagnostica demencia, y ponerle a un escolar un número de CI hace daño. Eso no entra en la app. Tampoco el "percentil" contra otros alumnos visible para el alumno; como mucho, su propio avance.

**Cómo enseña y cómo mide cada juego (capturas de Size Counts y Square Numbers):**

- **Tutorial jugando, no leyendo.** Antes de empezar se juega una ronda de ejemplo con un globo de texto de una línea ("Decide qué tarjeta tiene el resultado más alto y tócala"; "Si los resultados son iguales, toca el botón Iguales"). Primero son sumas fáciles; la dificultad sube después.
- **Ficha de cada juego:** mejor rango ("Experto"), mejor puntuación, puntuaciones recientes, botón "Cómo jugar" y un **desafío para subir de rango: "Logra al menos 62 220 puntos dos veces seguidas para llegar a Maestro"**. Para subir hay que repetir el logro; un golpe de suerte no basta. Para nosotros: una unidad se da por dominada con dos sesiones buenas en días distintos, lo que encaja con "recordar en vez de releer".
- **Detalle que no hay que repetir:** el globo dice "toca el botón Iguales", pero el botón dice "EQUAL". La traducción quedó a medias. En la app, todo en español, sin palabras en inglés sueltas.

Lo que se repite en todos y vale copiar: **una sola regla que se entiende en 5 segundos**, respuesta con un toque o un deslizamiento, tiempo corto (alrededor de un minuto), dificultad que sube sola si aciertas y un puntaje al final que compara con tu récord. Las mecánicas no son de nadie; los nombres, el arte y la marca sí: se hacen versiones propias.

### Ojo con la evidencia (de frente)

- La evidencia de que el "entrenamiento cerebral" general (Peak, Lumosity y similares) mejore la inteligencia o el rendimiento en otras tareas es **débil**: se mejora en el jueguito, pero eso casi no se transfiere. A Lumosity la multó la FTC de EE. UU. en 2016 por publicidad engañosa sobre esto, y la revisión de Simons y otros (2016, *Psychological Science in the Public Interest*) llegó a la misma conclusión. *Por verificar y citar en `docs/fundacional.md` antes de usarlo como argumento.*
- Lo que sí tiene sentido: **automatizar los cálculos específicos que el examen pide**. Saber de memoria los triángulos notables o las potencias de 10 libera memoria de trabajo para el razonamiento (teoría de la carga cognitiva). Eso no es "entrenar el cerebro": es práctica deliberada de destrezas concretas.
- Conclusión: copiamos la **forma** de Peak (corto, con tiempo, bonito, con progreso), pero el **contenido** son las destrezas que de verdad aparecen en los problemas de admisión y de PISA. Nunca vender la app como "te hace más inteligente".

### Qué se practicaría

- Cálculo mental: tablas, multiplicar por 5, 25, 11; dividir entre 0,5 y 0,25; cuadrados y raíces frecuentes.
- Fracciones, porcentajes y porcentajes sucesivos (conecta con la plantilla que ya existe).
- Potencias de 10 y notación científica; prefijos (mili, micro, nano, kilo, mega).
- Conversión de unidades: km/h a m/s, cm a m, L a m³, °C a K.
- Triángulos notables (37° y 53°, 30° y 60°, 45°), senos y cosenos de memoria.
- Despejar una variable de una fórmula en segundos.
- Estimación y orden de magnitud: "¿esta respuesta tiene sentido?".
- Signos: la convención de signos de óptica es justo uno de los errores típicos documentados en `docs/investigacion/`.
- Para razonamiento verbal: juegos de palabras, sinónimos, antónimos, completar oraciones (ver la sección 3).

### Cómo se vería en la app

- Un **calentamiento** de 2 a 3 minutos antes de cada sesión, opcional, con las destrezas que pide el tema del día (si toca óptica: fracciones y signos).
- Racha y récord personal, sin rankings públicos que humillen al que va más lento.
- Que los juegos se generen con el mismo núcleo (`nucleo/`, azar con semilla), con resultados calculados por código, no por un modelo de lenguaje (regla 1).
- Medición: tiempo y aciertos por destreza, para ver si el calentamiento cambia la velocidad en los problemas del tema. Si no la cambia, se quita.

---

## 3. Interacciones más dinámicas (al estilo de Brilliant)

### La idea

- Brilliant es la app de aprendizaje interactivo de matemática y ciencia. Lo nuestro va por el mismo camino, pero más bonito, más acogedor y más tranquilo (`docs/diseno.md`). La idea es **copiar sus buenas ideas, no su producto**.
- Lo que vale de Brilliant: lecciones en pasos cortos, se aprende haciendo y no leyendo, **primero el problema y después la explicación**, el error abre una explicación interactiva, y piezas interactivas reutilizables entre cursos.
- "Primero el problema" tiene evidencia: Sinha y Kapur (2021), metaanálisis de 53 estudios, efecto moderado a favor en secundaria (no en primaria). Detalle, críticas, qué copiamos y qué no: `docs/investigacion/brilliant.md`.

### Tipos de interacción para agregar al catálogo de formatos

- **Arrastrar** (*drag*): llevar una lente al lugar correcto, armar un circuito, poner cada dato en su lugar de la fórmula.
- **Deslizar** (*slider*): mover un parámetro y ver qué cambia (ya existe en las escenas; generalizarlo).
- **Completar con fichas** ("nubecitas"): una ecuación o una oración con huecos y fichas para soltar en ellos.
- **Ordenar**: los pasos de una solución, de mayor a menor, una secuencia de reacciones.
- **Emparejar**: variable con unidad, concepto con dibujo, fórmula con situación.
- **Clasificar en cajas**: ¿imagen real o virtual?, ¿serie o paralelo?, ¿reactivo o producto?
- **Marcar en el dibujo**: tocar dónde está el foco, dónde se forma la imagen, qué foco se apaga.
- **Sopa de letras y crucigramas**: sobre todo para razonamiento verbal y vocabulario de ciencia.

### Ojo (de frente)

- Cada interacción tiene que **obligar a pensar en el concepto**. Arrastrar un número a un hueco es una alternativa disfrazada si no cambia nada. La sopa de letras divierte, pero enseña poco si no está amarrada a vocabulario que el alumno necesita; úsese como premio o como descanso, no como núcleo.
- Las reglas de siempre siguen: predecir antes de ver (regla 3), un color por variable (regla 4), opciones incorrectas sacadas de errores reales.
- Cada interacción nueva tiene que funcionar con el dedo en un celular barato y sin conexión.

### Cómo encaja en la arquitectura

- Hoy hay dos formatos de módulo: "escena" y "predicciones" (`docs/arquitectura.md`, `nucleo/predicciones.js`). Estas interacciones serían **componentes reutilizables** del núcleo (arrastrar, completar, ordenar, emparejar) que cualquier plantilla usa, con la corrección hecha por código.
- La medición anónima tiene que registrar también estas respuestas, no solo las alternativas.

---

## 4. Aprendizaje guiado paso a paso (POGIL)

Idea dictada el 6 nov 2026: "llevar de la manito" al alumno desde cero. Queda anotada por si se necesita; no se desarrolla todavía.

### Qué es

- POGIL (*Process Oriented Guided Inquiry Learning*, aprendizaje por indagación guiada orientado a procesos) nació en química universitaria en EE. UU. a fines de los noventa.
- El alumno no recibe primero la explicación: recibe un **modelo** (un dibujo, una tabla, datos) y una **secuencia de preguntas** que lo llevan a descubrir el concepto él mismo.
- Sigue el ciclo de aprendizaje: **explorar** el modelo, **inventar el concepto** (ponerle nombre y regla a lo que vio) y **aplicarlo** a casos nuevos.
- Las preguntas van escalonadas: primero las que se responden mirando el modelo ("¿cuántas…?", "¿qué cambia cuando…?"), luego las que llevan a la idea ("¿qué regla cumplen todos?") y al final las abiertas.
- En el aula se trabaja en grupos de 3 o 4 con roles (quien dirige, quien anota, quien expone, quien reflexiona) y el profesor no dicta: guía.
- *Por verificar en pogil.org:* el ciclo de tres fases, los tipos de preguntas y los roles vienen de la descripción general del método, no de una fuente leída en esta sesión.

### Ojo (de frente)

- POGIL no es "llevar de la manito" en el sentido de explicar todo paso a paso. Es lo contrario: **la guía son las preguntas, no la explicación**. El alumno descubre; la secuencia de preguntas evita que se pierda.
- Es pariente cercano de "primero el problema" (Brilliant, Sinha y Kapur 2021, `docs/investigacion/brilliant.md`) y de nuestra regla 3 (predecir antes de ver).

### Evidencia

- Walker y Warfa (2017), *PLOS ONE*: metaanálisis de 21 estudios con 7876 alumnos, POGIL contra clase expositiva. **El efecto en las notas es pequeño, pero baja en 38 % el riesgo de jalar el curso.** O sea, ayuda sobre todo al que estaba por caerse, que es justo nuestro público.
- Fuente: [Walker y Warfa (2017), PLOS ONE](https://pmc.ncbi.nlm.nih.gov/articles/PMC5638339/). Citar en `docs/fundacional.md` si se adopta.

### Cómo se vería en la app

- Una **unidad guiada** por tema: la escena es el modelo y, en vez de explicar, la app hace de 5 a 10 preguntas en orden, cada una un poco más difícil, hasta que el alumno escribe (con fichas) la regla. Ejemplo en el Banco Óptico: mover el objeto y anotar dónde sale la imagen; ¿qué pasa cuando el objeto cruza el foco?; ¿qué regla cumplen los casos?; ahora predice uno nuevo.
- Las preguntas se responden con los componentes del núcleo (fichas, deslizar, elegir), y la ayuda se retira a medida que acierta ("ayuda que se retira", ya en el fundacional).
- **Modo salón (laboratorio de cómputo):** la misma unidad para grupos de 3 o 4 en una computadora, con roles que rotan y una guía para el profesor. Encaja con el lanzamiento en el colegio.
- Sirve de puente con la idea de bajar a grados menores, con un cuidado: en primaria la evidencia de "primero el problema" es en contra (ver Brilliant). Allí la guía tendría que explicar más.

---

## Cómo encaja con lo que ya existe

| Idea | Ya existe | Qué agrega |
| --- | --- | --- |
| Modo PISA | No: hoy todo apunta al examen de admisión | Problemas en contexto real; argumento para el colegio piloto |
| Agilidad mental | En parte: práctica y "recordar en vez de releer" | Calentamientos cortos de cálculo y unidades, con tiempo y racha |
| Interacciones tipo Brilliant | En parte: deslizadores y arrastre en las escenas; alternativas en "predicciones" | Componentes de respuesta reutilizables en el núcleo |
| Aprendizaje guiado (POGIL) | En parte: paso a paso de las escenas y "ayuda que se retira" | Unidades donde el alumno descubre la regla con preguntas escalonadas; modo salón por grupos |

## Pendientes para cuando se retome

- [x] Cifras de Perú en PISA 2025 y fuentes reunidas (`docs/investigacion/pisa-y-evaluaciones.md`).
- [ ] Leer los marcos de la OCDE y los ítems liberados; verificar lo marcado "por verificar" en ese informe (sobre todo las simulaciones de ciencia y la ENLA 2025 de 5.º de secundaria).
- [x] Capturas de Peak recibidas (6 nov 2026): catálogo completo y pantallas de inicio y rendimiento, en la sección 2.
- [x] Capturas jugando Size Counts y Square Numbers (6 nov 2026).
- [ ] Captura jugando Moving Math (opcional).
- [x] Investigación de Brilliant reunida (`docs/investigacion/brilliant.md`).
- [ ] Probar la versión gratis de Brilliant y anotar 5 lecciones de física o química, pantalla por pantalla.
- [ ] Citar en `docs/fundacional.md` la evidencia sobre entrenamiento cerebral y sobre fluidez en cálculo.
- [ ] Leer el material de pogil.org y una actividad de química de ejemplo, para ver cómo escalonan las preguntas.
- [ ] Decidir cuál de las tres entra primero en la hoja de ruta (propuesta: componentes de interacción, porque los usan las otras dos).
