# POGIL v2: auditoría de las escenas y dirección con Rive

13 de noviembre de 2026. Auditoría pedida por Gerson: «el diseño es hermoso; lo que no es hermoso es la forma de enseñar». Es un documento de evaluación y dirección: no trae código ni cambia nada de la app. Se hizo con los skills `diseno-y-animacion` y `estructura-visual-motion`, leyendo `docs/escena-viva.md`, `docs/pendientes.md` (sección B) y `docs/vision-pisa-agilidad-interaccion.md` (secciones 3 y 4), y midiendo las 99 escenas en una pantalla de celular. Si algo de aquí choca con `CLAUDE.md` o con `docs/escena-viva.md`, mandan ellos.

## 1. En corto

- **Veredicto:** ¿se entiende? A medias: se entiende leyendo. ¿Se siente? No. La cáscara ya es acogedora; la lección sigue siendo una presentación de diapositivas con un dibujo al lado.
- **Por qué se ve plano:** no falta profundidad ni acabado. Falta que el alumno haga algo. En 72 de las 99 escenas no se toca la figura: se pulsa «Siguiente» o se jala un deslizador. Las cosas se mueven (89 escenas tienen animación), pero no porque el alumno las mueva.
- **Rive solo no lo arregla.** Poner un tubo de ensayo hermoso en una lección que avanza con «Siguiente» da una presentación más bonita. Primero se cambia el verbo del alumno; después se viste.
- **La propuesta, POGIL v2:** el modelo del POGIL de papel se vuelve un objeto que responde, y las preguntas se contestan haciendo. Cada unidad declara **un gesto** (verter, soltar, colgar, conectar…) que es la acción real del fenómeno, y el alumno arma con sus propios intentos la tabla de datos de la que sale la regla.
- **Dónde entra Rive:** en la mascota, en unos 8 objetos de utilería con material (el vaso que se llena y cambia de color, el mechero, el émbolo, el foco, el carrito…), en 3 personajes y en 3 piezas de interfaz. Unos 15 archivos para toda la app, no uno por unidad. Todo lo que se mide lo sigue dibujando el motor.
- **Dónde rinde más:** en física y química. Son los cursos de fenómenos y solo 5 de sus 40 unidades tienen algo que se arrastra. Geometría, trigonometría y álgebra ya tienen el gesto en la mayoría de sus unidades; a esas les falta el ciclo de descubrir la regla, no Rive.
- **Primer paso:** una sola unidad completa (ácidos y bases), primero sin Rive y después con Rive, probada en un celular real y con alumnos. Recién con eso se decide el resto.

## 2. Qué se midió

Barrido automático del 13 nov sobre `main` (commit `0643f77`): las 99 escenas de `plantillas/`, abiertas a 390 × 780 px con pantalla táctil.

| Medida | Resultado |
| --- | --- |
| Escenas con «paso a paso» | 99 de 99; mediana de 8 pasos, máximo 11 |
| Alto de la página | Mediana de 1577 px: dos pantallas de celular |
| La figura y el botón «Siguiente» caben juntos en una pantalla | En 1 de las 63 escenas donde se pudo medir |
| Palabras a la vista en la primera pantalla | Mediana de 80; hasta 150 (`rutas-espacio`) |
| Escenas donde se arrastra algo de la figura | 27 |
| Escenas donde el único control es un deslizador | 33 |
| Escenas donde solo hay botones | 39 |
| Escenas con animación (un bucle de dibujo) | 89 |
| Escenas que respetan el movimiento reducido | 96 |

Por unidad del temario (152), tomando la mejor escena de cada una:

| Curso | Se arrastra | Deslizador | Solo botones | Sin escena |
| --- | --- | --- | --- | --- |
| Física (20) | 2 | 15 | 3 | 0 |
| Química (20) | 3 | 9 | 8 | 0 |
| Aritmética (19) | 7 | 0 | 11 | 1 |
| Álgebra (19) | 13 | 3 | 3 | 0 |
| Geometría (18) | 14 | 0 | 4 | 0 |
| Trigonometría (19) | 15 | 2 | 2 | 0 |
| Razonamiento matemático (19) | 10 | 0 | 8 | 1 |
| Razonamiento verbal (18) | 0 | 0 | 0 | 18 |
| **Total (152)** | **64** | **29** | **39** | **20** |

**Límites de la medición.** «Se arrastra» se detectó buscando en el código de cada escena los eventos de puntero; puede contar de más (una escena que solo usa el dedo para un globo de ayuda) y no dice si el arrastre es bueno. Las 3 unidades de química que figuran con arrastre lo deben a `molecula-grande`, que es una lupa para mirar, no un experimento. Las palabras se contaron en el primer paso de cada escena, no en todos. Nada se probó con alumnos ni en un celular físico.

**Dos escenas miradas a mano** (`limitante-particulas`, la de la captura de Gerson, y `acidos-bases`):

- En `limitante-particulas`, el subtítulo dice «Arma moléculas hasta que algo se acabe». En el paso a paso el alumno no arma nada: la figura no tiene ningún evento de dedo. Lo único que se puede tocar son los puntos de paso, «Anterior», «Siguiente» y las opciones de la predicción. La promesa del título la cumple la animación, no el alumno.
- En `acidos-bases`, el paso 1 trae unas 110 palabras y 4 líneas de ecuación antes de que el alumno haya tocado algo. La lupa de partículas está arriba y el texto abajo: en el celular no se ven a la vez. El explorador («¿Qué pasa si…?») es un deslizador de dilución.

## 3. Diagnóstico

**En una frase:** el problema dominante está en la capa de la **intención** (qué hace el alumno), no en la de acabado: el verbo de casi todas las lecciones es «leer y pulsar Siguiente».

El skill de estructura visual separa lo que la gente llama «plano» en cuatro problemas distintos. Aquí son dos:

- **«Todo se entiende pero nada importa»** (falta de desarrollo): la acción del alumno no cambia nada. Él no tiene un objetivo, un obstáculo ni una consecuencia; los tiene la explicación.
- **«Muerta»** (acción sin intención ni respuesta): la figura se mueve sola, a su ritmo, y el alumno la mira. Movimiento constante no es progresión.

No es un problema de profundidad ni de volumen. Sombras, degradados o un 3D no lo tocan.

### Hojas de revisión (de la capa más alta a la más baja)

Cada hoja depende de las anteriores: corregir la 5 sin la 1 es pulir una diapositiva.

| # | Momento | Observación | Hipótesis | Cambio | Resultado esperado | Cómo comprobar |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | Toda la lección | El alumno avanza con «Siguiente»; en 72 de 99 escenas no toca la figura | La lección está pensada como explicación con ilustración, no como experimento | Cada unidad declara un gesto y las preguntas se contestan con él (sección 5) | El alumno puede decir «yo hice que pasara» | Pedirle a un alumno que cuente qué hizo, no qué leyó |
| 2 | Pasos de «observa» | La figura cambia sola al entrar al paso; el alumno no eligió qué probar | No hay intento: sin intento no hay sorpresa ni error propio | Tres o cuatro ensayos que el alumno decide, cada uno deja su registro | La regla sale de comparar sus propios ensayos | Ver si los registros de dos alumnos son distintos |
| 3 | Celular, cualquier paso | La figura y el texto del paso no caben juntos (1 de 63) | Diseño de escritorio a dos columnas apilado en el celular | Una pantalla, una pregunta: figura arriba, una tarjeta de 60 palabras como máximo y el control, sin scroll mientras se manipula | Se ve el efecto mientras se actúa | Repetir el barrido: «caben juntos» en todas |
| 4 | Explorador de física y química | El control es un deslizador lejos de lo que cambia (24 unidades de estos dos cursos) | El deslizador controla un número; el alumno no ve qué acción física es | El control es el objeto mismo: se inclina el vaso, se empuja el émbolo, se jala la honda | Se entiende qué variable se movió sin leer la etiqueta | Mostrar la pantalla sin rótulos y preguntar «¿qué estás cambiando?» |
| 5 | Paso 1 de casi todas | Entre 80 y 150 palabras antes de la primera acción | La explicación va antes que la experiencia | Los primeros 30 segundos son tocar; el texto llega después y cabe en el presupuesto de `escena-viva.md` | El alumno llega a la pregunta con algo ya visto | Contar palabras antes del primer toque: 25 como máximo |
| 6 | Objetos de la figura | Círculos, cajas y barras correctos pero sin material: el líquido no pesa, el fuego no calienta | Todo se dibuja con el mismo trazo y la misma respuesta | Utilería con material en los objetos que el alumno agarra (aquí entra Rive, sección 6) | El objeto responde como su material | Comparar la versión con y sin utilería, misma lección |
| 7 | Pulido | Lista corta: el título de `limitante-particulas` promete lo que no deja hacer; la leyenda de colores queda lejos de la figura; los puntos de paso (1 a 9) invitan a saltarse la predicción | | Se corrigen al rehacer cada escena, no antes | | |

### Lo que funciona y no hay que romper

- **El hilo de color** (regla 4): el dato del enunciado, el objeto y la ecuación comparten color. Es la firma del producto y se ve bien en las dos escenas revisadas.
- **La predicción que bloquea** (regla 3) y el tono nuevo del error («sería cierto si…»).
- **El motor aparte de la pantalla** (regla 1) con sus casos de prueba. Es lo que permite cambiar toda la capa de arriba sin tocar la física.
- **La cáscara:** página del curso, dibujos por unidad, la mascota con sus 8 poses y su contrato.
- **El kit y la línea de tiempo** de `nucleo/kit/`: las piezas ya son funciones «estado → dibujo», justo lo que necesita un objeto que se manipula.
- **Las escenas de geometría y trigonometría que ya se arrastran** (`triangulo-estira`, `angulo-inscrito`, `circunferencia-trig`, `ampliadora`): son el modelo de gesto que le falta al resto.
- **El movimiento reducido** ya está en 96 de 99 escenas.

## 4. Por qué el POGIL de papel no alcanza en pantalla

El POGIL de papel le da al alumno un **modelo** (una figura con datos) y una secuencia de preguntas que lo llevan de mirar a formular la regla y a aplicarla. Funciona porque en papel el modelo está quieto: el texto y la figura tienen que ir juntos y el alumno «opera» el modelo con los ojos.

Lo que hicimos hasta ahora es eso mismo llevado a pantalla: figura, texto corto y pregunta. Está bien hecho y por eso se parece a los exámenes, donde el texto es simple y la imagen guía. Pero la pantalla permite algo que el papel no: **que el modelo responda**. Ahí está la multiplicación que pide Gerson. No es «POGIL con animaciones»; es que el alumno produzca los datos del modelo con sus manos.

| | POGIL de papel (lo de hoy) | POGIL v2 |
| --- | --- | --- |
| El modelo | Una figura con datos ya puestos | Un objeto que el alumno opera |
| Los datos | Vienen en una tabla | Los produce el alumno, ensayo por ensayo |
| La pregunta | Se responde eligiendo o escribiendo | Se responde haciendo; la respuesta queda a la vista |
| El texto | Explica el cambio | Nombra lo que el alumno ya vio |
| La regla | Se lee al final | Se arma con fichas a partir de los ensayos propios |
| El error | Se explica | Se ve: el ensayo que no salió queda junto al que sí |

**Evidencia, sin exagerar** (regla de `CLAUDE.md`: nada de esto se afirma como probado):

- POGIL contra clase expositiva: efecto pequeño en las notas, pero 38 % menos riesgo de desaprobar (Walker y Warfa 2017, ya citado en la visión). Es evidencia del POGIL de aula, con grupos y profesor; no de una app.
- Primero el problema: g = 0,36 a favor en secundaria (Sinha y Kapur 2021, en `docs/investigacion/brilliant.md`).
- Animar contra imagen fija: según el skill de diseño, la ventaja es pequeña en promedio, casi nula cuando lo que se mueve no es lo que hay que aprender y clara cuando el cambio es complejo y es justo lo que hay que inferir. Las cifras del skill hay que rastrearlas a su fuente antes de pasarlas a `docs/fundacional.md`.
- De ahí sale la regla de oro de este documento: **el material y el movimiento se gastan en el objeto que el alumno manipula y en la respuesta que tiene que observar. Todo lo demás se queda quieto.** Un tubo precioso que se llena solo es un detalle seductor (Mayer) y resta.
- Que manipular enseñe más que mirar es, para nuestro caso, una **hipótesis**. La app ya puede comprobarla con las pruebas de entrada y salida (sección 9).

## 5. POGIL v2: el modelo

### 5.1 Los cinco tiempos de una unidad

Es la secuencia del problema guiado de `docs/fundacional.md`, reordenada para que la mano vaya antes que el texto. La regla 3 no cambia: predecir es el único punto que bloquea.

| Tiempo | Qué hace el alumno | Qué pone la app | Texto en pantalla | Mascota |
| --- | --- | --- | --- | --- |
| 1. **Toca** (20 a 40 s) | Usa el gesto una vez, sin pregunta: inclina, suelta, cuelga | El objeto y una consigna de una línea. Comprueba que conoce las piezas con una acción, no con un «Continuar» | 25 palabras como máximo | `señala` y vuelve a `reposo` al primer toque |
| 2. **Predice** | Elige qué va a pasar antes de un ensayo concreto | La pregunta neutra y las opciones con el error típico (regla 3) | El enunciado, 40 palabras | `reposo` |
| 3. **Prueba y registra** | Hace 3 o 4 ensayos que él decide | Cada ensayo deja un **registro** fijo: una miniatura con su valor. Los registros se quedan a la vista, uno al lado del otro | Solo lecturas en vivo (valor con unidad) | `reposo`; reacciona solo al contrastar la predicción |
| 4. **Nombra la regla** | Completa la regla con fichas mirando sus registros | Aquí aparece la ecuación, con el hilo de color hacia los registros | 14 palabras más la ecuación | `celebra` o `acompaña` |
| 5. **Transfiere** | Resuelve un caso nuevo con formato de examen | Figura quieta, alternativas A–E, sin gesto ni registros. Después, lápiz y papel (regla 6) | El enunciado, como en el examen | `hito` al cerrar la unidad |

Detalles que sostienen el modelo:

- **El registro es la tabla de datos del POGIL**, pero la llena el alumno. Es también el rastro que pide el skill («cada paso deja evidencia visible») y lo que se congela para comparar: se anima el ensayo, se congela la serie.
- **El error propio vale.** Un ensayo «malo» (mezclar al revés, soltar desde muy bajo) no se corrige: se registra y sirve para comparar. Solo la predicción y la regla tienen respuesta correcta.
- **La dificultad vive en la idea** (ley 7 del skill). Ningún gesto pide puntería: los valores se ajustan a posiciones limpias al soltar, y eso se declara. En el tiempo 5, sin ajuste.
- **La ayuda se retira por niveles**, como ya dice el fundacional: en el nivel 1 la app propone los ensayos; en el 2 el alumno los elige; en el 3 solo hay predicción y regla; el 4 es el examen.
- **Modo salón:** los cinco tiempos son los mismos para un grupo de 3 o 4 en una PC; los roles del POGIL de aula se reparten por tiempo (uno opera, uno predice, uno anota la regla).

### 5.2 El gesto es la pregunta

Cada unidad declara **un gesto principal**. Sirve si cumple cuatro condiciones:

1. **Es la acción del fenómeno.** Lo que hace la mano en la pantalla es lo que haría en el laboratorio, en la calle o en el cuaderno: verter, colgar, cortar. Un deslizador rotulado «concentración» no la cumple.
2. **La mano mueve la variable que se controla y el ojo ve la que responde,** las dos en el mismo objeto o pegadas.
3. **Se puede repetir en ensayos sueltos,** para que haya registros que comparar.
4. **Tiene otra forma de hacerse sin arrastrar** (botones − y +, tocar origen y destino), como ya exige `escena-viva.md`.

Vocabulario cerrado de gestos. Una unidad nueva elige de aquí; un gesto nuevo se agrega a esta lista con su razón.

| Gesto | La mano hace | Sirve para |
| --- | --- | --- |
| **Verter y gotear** | Inclina un recipiente; deja caer gotas | Soluciones, ácidos y bases, mezclas, calor, fluidos |
| **Calentar y enfriar** | Acerca el mechero o el hielo y lo mantiene | Calor, gases, cinética, equilibrio, cambios de estado |
| **Apretar** | Empuja o jala un émbolo | Gases, termodinámica, Pascal |
| **Soltar y lanzar** | Empuja con el dedo, o jala hacia atrás y suelta | Cinemática, tiro, energía, choques, oscilaciones |
| **Colgar y pesar** | Pone cosas en un platillo o las cuelga | Estática, dinámica, mol, ecuaciones, balanzas |
| **Conectar** | Une dos puntos con un trazo | Circuitos, enlaces, cadenas, trazos de figuras, parentescos |
| **Estirar** | Arrastra un punto con restricción | Geometría, vectores, funciones, intervalos |
| **Girar** | Hace rodar una rueda, una aguja o una figura | Trigonometría, movimiento circular, engranajes, relojes |
| **Cortar y armar** | Parte una figura y reacomoda las piezas | Fracciones, áreas, productos notables, cortes |
| **Doblar y reflejar** | Dobla un papel, mueve un espejo, despliega un sólido | Simetría, sólidos, función inversa, espejos |
| **Poner fichas** | Lleva fichas a casilleros, aros o filas | Conteo, balance de reacciones, numeración, divisores, lógica |
| **Ordenar y clasificar** | Mueve tarjetas a su lugar o a su caja | Nomenclatura, tabla periódica, lectura, lógica |
| **Marcar** | Toca o subraya dentro de la figura o del texto | Razonamiento con figuras y razonamiento verbal |

«Mirar con lupa» (pasar de lo que se ve a las partículas) no es un gesto: es un cambio de vista que acompaña a los de química y se usa después del ensayo, no durante.

## 6. Dónde entra Rive y dónde no

### 6.1 Regla de decisión

| Si el elemento… | Lo hace | Por qué |
| --- | --- | --- |
| Es un texto, una ecuación, un botón o una alternativa | HTML | Lo leen los lectores de pantalla, se puede ampliar y seleccionar |
| Se puede medir sobre él (rayos, ejes, ángulos, trayectorias, cotas, gráficas, partículas que se cuentan) | El motor y el kit, en SVG o canvas | Regla 1: una interpolación bonita que corre un rayo dos píxeles enseña mal |
| Tiene material, estados o actitud (se inclina, se llena, hierve, se enciende, rebota, mira) | Rive, y su valor le llega del motor | Ahí es donde el oficio de animación rinde y donde el dibujo a mano en código queda tieso |
| Es un momento de marco (bienvenida, hito, progreso) | Rive | Poco frecuente y sin datos que deformar |

Consecuencias directas:

- **El dedo lo lee la página, la cuenta la hace el motor y Rive actúa.** El arrastre no se resuelve dentro del archivo de Rive (aunque Rive puede escuchar el dedo), porque así se perderían la alternativa sin arrastrar, el teclado y el resorte común del kit. Rive recibe números por enlace de datos (inclinación, nivel, color, brillo, posición) y los dibuja.
- **Sin scripts dentro del `.riv`.** Rive permite programar en Luau, pero los archivos con scripts tienen que salir firmados para la web y eso consume el cupo del plan. Además rompería la regla 1. La lógica se queda en el motor.
- **Sin texto dentro del `.riv`.** Ni rótulos ni números: van en HTML encima.
- **Rive no simula fluidos ni partículas.** El «líquido» de Rive es una forma con nivel y color que le dicta el motor, con una superficie que se mece al inclinar. Las partículas de la lupa siguen en canvas, calculadas.
- **Cada utilería tiene una prueba de fidelidad:** en cinco valores del motor, lo que se ve (el nivel contra la marca del vaso, la posición del carrito contra la regla) coincide dentro de 1 px. Sin esa prueba no se publica.
- **Siempre hay respaldo.** Como la mascota: si el `.riv` no carga, se ve el mismo objeto en SVG del kit, sin actuación. Nada esencial depende de Rive.

### 6.2 Catálogo cerrado de archivos Rive

Unos 15 archivos para toda la app. Un objeto nuevo se agrega al catálogo con su contrato; no se hace uno por unidad.

| Archivo | Tipo | Qué recibe del motor | Qué actúa por su cuenta | Unidades que lo usan |
| --- | --- | --- | --- | --- |
| Mascota (ya contratada) | Personaje de marco | `pose`, `reducido`; a futuro, hacia dónde mirar | Las 8 poses | Toda la app |
| Vaso y tubo | Utilería | Nivel, color, turbidez, inclinación, si burbujea | La superficie que se mece y se asienta | 11: física 11 y 12; química 1, 10, 11, 12, 13, 14, 15 y 20; aritmética 7 |
| Gotero y bureta | Utilería | Gotas por soltar, gotas soltadas | La gota que se forma y cae | 3: química 11, 14 y 20 |
| Mechero y hielo | Utilería | Intensidad, encendido | La llama; el hielo que suda | 8: física 12 y 13; química 1, 9, 10, 12, 13 y 19 |
| Émbolo | Utilería | Posición, presión para el manómetro | La resistencia al empujar | 3: física 13; química 9 y 13 |
| Foco, pila e interruptor | Utilería | Brillo, abierto o cerrado | El filamento que prende y se apaga | 6: física 15, 17 y 20; química 15; aritmética 1; álgebra 1 |
| Imán y brújula | Utilería | Posición, ángulo de la aguja | La aguja que oscila al asentarse | 2: física 16 y 17 |
| Carrito y bloque | Utilería | Posición y velocidad | Ruedas que giran, cabeceo al frenar o chocar | 4: física 2, 5, 7 y 8 |
| Pelota | Utilería | Posición | Aplastarse al rebotar | 2: física 3 y 9 |
| Hormiga | Personaje de escena | Posición y dirección | Caminar | 2: razonamiento matemático 2 y 17 |
| Combi | Personaje de escena | Posición y dirección | Arrancar y frenar | 2: razonamiento matemático 5 y 11 |
| Satélite | Personaje de escena | Posición | Girar sobre sí mismo | 1: física 6 |
| Candado de la predicción | Interfaz | Cerrado, abierto | Abrirse al responder | Toda la app |
| Sello de unidad | Interfaz | Nivel alcanzado | Caer y asentarse | Toda la app |
| Camino del curso | Interfaz | Unidades hechas, racha | Avanzar al terminar una unidad | La página de cada curso |

Con eso, **31 de las 152 unidades** llevan utilería o un personaje de escena (14 de física, 10 de química, 3 de aritmética y álgebra, 4 de razonamiento matemático), y las otras 121 llevan el gesto con el kit y la mascota. Es a propósito: en matemática el objeto es la figura, y la figura es del motor.

**Honestidad sobre la utilería:** varias piezas (el vaso con nivel y color, el foco que brilla) se pueden hacer bien en SVG con el kit, sin Rive. Rive se gana su lugar cuando el objeto tiene varios estados que se mezclan (inclinarse mientras se vacía y la superficie se mece). Por eso la primera prueba compara las dos versiones (sección 9).

### 6.3 Presupuesto para celulares de gama baja

Amplía las reglas de la otra conversación; el celular de 4 GB sigue siendo el juez.

| Qué | Regla |
| --- | --- |
| Lienzos de Rive a la vez | Dos como máximo: la utilería de la escena y la mascota. Vaso, gotero y mechero juntos van en un solo archivo con componentes anidados |
| Quién se mueve | Uno a la vez. Mientras el alumno manipula la utilería, la mascota está en `reposo` y en pausa |
| Estados en reposo | Sin bucles: la llama y las burbujas solo corren mientras el dedo actúa o unos segundos después. Rive se pausa solo cuando nada se anima, y eso es lo que hay que aprovechar |
| Tamaño | La utilería ocupa una parte de la figura, no la pantalla entera |
| Peso | Solo vectores, menos de 100 KB por archivo, pocos vértices (ojo con vectores generados o calcados) |
| Efectos | Sin modos de fusión, sin difuminados, sin mallas ni huesos en la utilería |
| Runtime | Es `@rive-app/canvas` 2.50.0: 684 KB de JS y 2,2 MB de wasm sin comprimir. Se baja una vez y solo si la escena trae `.riv`. Falta confirmar que `sw.js` lo deja disponible sin conexión |
| Canvas contra WebGL2 | Se queda canvas: no tiene límite de lienzos y no paga por las fusiones. Se pierde el difuminado fino, que igual no se usa |
| Si el celular no puede | La escena detecta cuadros lentos y cambia al respaldo SVG. Hay que definir el umbral con la prueba de estrés |
| Movimiento reducido | Estados fijos: el vaso aparece ya vertido, sin el vaivén |

### 6.4 Lo que cambia del plan de tres capas

El plan de `docs/pendientes.md` (alma, movimiento, escenas) sigue en pie, con una capa nueva **delante** de las tres:

0. **Gesto** (nueva): qué hace la mano en cada unidad y cómo se registra. Es diseño de lección, no de gráficos. Sin ella, las otras tres decoran.
1. **Escenas:** el kit crece con las piezas que el gesto necesita (zonas que se arrastran, registros, fichas).
2. **Movimiento:** la línea de tiempo y los tokens ya definidos; no hace falta una librería nueva para esto.
3. **Alma:** Rive, en los 15 archivos de arriba.

## 7. Un ejemplo completo: ácidos y bases

**Hoy.** Ocho pasos. El paso 1 tiene unas 110 palabras y la deducción del pH escrita antes de que el alumno toque nada. La lupa muestra las partículas, pero el alumno no las toca. Para diluir se jala un deslizador. La relación que el examen pide (cada vez que diluyes 10 veces un ácido fuerte, el pH sube 1) el alumno la lee escrita; no la saca de algo que hizo.

**Con POGIL v2.** Gesto: verter y gotear. Ficha de tarea:

- **Promesa:** el alumno descubre con tres vertidas que diluir 10 veces sube el pH en 1, y con una bureta que la neutralización es un salto y no una rampa.
- **Persona y condiciones:** alumno de 4.º o 5.º de secundaria, celular de gama baja, sin conexión, quizá con el celular en una mano.
- **Resultado observable:** predice el pH de una dilución nueva y explica por qué mezclar un ácido con el doble de agua no «baja el pH a la mitad».
- **Orden de atención:** primero el vaso, después el color y la lectura de pH, después los registros; la ecuación, al final.

| Tiempo | Lo que pasa en pantalla |
| --- | --- |
| 1. Toca | Un vaso con ácido (rojo, pH 2) y una jarra de agua. «Echa agua al vaso.» El alumno inclina la jarra con el dedo: el nivel sube, el color se aclara y la lectura de pH cambia en vivo. Sin preguntas todavía |
| 2. Predice | «Tienes 10 mL a pH 2. Si completas hasta 100 mL, ¿qué pH marca?» Opciones con los errores típicos (pH 20, pH 0,2, pH 3, «no cambia»). Bloquea |
| 3. Prueba y registra | El alumno vierte hasta 100 mL: queda un vasito registrado, «×10 → pH 3». Repite hasta 1000 mL: «×100 → pH 4». Tercer ensayo libre: lo que él quiera. Entre ensayos puede abrir la lupa y ver que hay las mismas partículas de H⁺ en más agua |
| 4. Nombra la regla | Con los tres vasitos a la vista: «Cada vez que el volumen se multiplica por ___, el pH sube ___». Fichas: 2, 10, 100, 1, 2. Al completar, aparece pH = −log [H⁺] con el hilo de color hacia cada vasito |
| 3 y 4 otra vez, con la bureta | Gotea base sobre el ácido. El color casi no cambia durante muchas gotas y vira de golpe. El registro es la curva que él mismo fue marcando. Regla: se neutraliza cuando los moles se igualan |
| 5. Transfiere | Un problema de formato San Marcos, con figura quieta y alternativas. Después, los de lápiz y papel |

**Qué hace cada medio:**

- El motor de `acidos-bases` ya calcula todo esto; no cambia.
- La lectura de pH, las opciones, las fichas, la ecuación y los registros son HTML y SVG.
- Las partículas de la lupa siguen en canvas.
- La utilería (vaso, jarra y bureta) recibe del motor nivel, color e inclinación. El color sale del motor como color de un indicador, y hay que decidir cuál y decírselo al alumno: hoy la escala de pH es gris a propósito, para no sugerir que el ácido «es rojo».
- La mascota señala la jarra en el tiempo 1 y no vuelve a moverse hasta que se contrasta la predicción.

**Qué se pierde y hay que cuidar:**

- El paso a paso de hoy enseña la deducción completa (fuerte contra débil, la cuadrática). Eso no desaparece: pasa a ser la solución en línea de tiempo del tiempo 5 y la micro-lección de teoría. Lo que cambia es el orden: primero la experiencia, después la deducción.
- Verter es más lento que jalar un deslizador. Si un ensayo toma más de unos 5 segundos, el alumno se aburre a la tercera. Hay que medirlo.

## 8. El temario completo: las 152 unidades

Cómo leer las tablas:

- **Hoy:** A = ya se arrastra algo de la figura; D = el control es un deslizador; B = solo botones; G = no tiene escena, solo práctica o lectura. Sale del barrido de la sección 2.
- **Gesto:** el gesto principal de la unidad, del vocabulario de la sección 5.2.
- **Lo que descubre:** la relación que el alumno tiene que poder decir después de sus ensayos. Son propuestas para discutir con Gerson, no contenido verificado: cada una se contrasta con el motor y con el informe de ideas erróneas de su tema antes de construirla.
- **Rive:** la utilería o el personaje de la sección 6.2. Una raya quiere decir kit y mascota, nada más.

### Física (20)

| # | Unidad | Hoy | Gesto | Lo que descubre haciéndolo | Rive |
| --- | --- | --- | --- | --- | --- |
| 1 | Magnitudes y vectores | D | Estirar: mueve la punta de cada flecha y júntalas cola con punta | La resultante depende del ángulo: va desde la resta hasta la suma de los módulos | — |
| 2 | MRU, MRUV y caída libre | D | Soltar: empuja el carrito con el dedo y pisa el freno | La gráfica v–t la dibuja su propio movimiento, y el área es lo que avanzó | Carrito |
| 3 | Movimiento parabólico y circular | D | Lanzar: jala la honda y suelta; gira la rueda con el dedo | 30° y 60° caen en el mismo punto; la sombra horizontal avanza parejo | Pelota |
| 4 | Estática | A | Colgar: cuelga pesas en la barra y mueve el apoyo | Lo que equilibra es peso por distancia, no el peso | — |
| 5 | Dinámica | D | Colgar y soltar: jala el bloque con una cuerda; inclina el plano | La fuerza neta manda sobre la aceleración, no sobre la velocidad | Bloque |
| 6 | Gravitación universal | D | Lanzar: suelta el satélite con más o menos rapidez | Hay una sola rapidez que cierra la órbita; más lejos, más lento | Satélite |
| 7 | Trabajo, energía y potencia | D | Soltar: sube el carrito a la rampa y cámbiale la forma | La rapidez abajo depende de la altura, no del camino | Carrito |
| 8 | Impulso y choques | D | Lanzar: manda dos carritos uno contra otro | La suma de m·v no cambia aunque la energía sí | Carrito |
| 9 | Movimiento armónico simple | D | Estirar y soltar: jala la masa del resorte o el péndulo | Estirar más no cambia el período | Pelota (el resorte es del motor) |
| 10 | Ondas mecánicas y sonido | D | Estirar: sacude el extremo de la cuerda con el dedo y ténsala | La mano decide la frecuencia; la cuerda, la rapidez | — |
| 11 | Fluidos | D | Verter: llena vasos de formas distintas; hunde el bloque con el dedo | La presión depende de la profundidad; el empuje, de lo que se hunde | Vaso |
| 12 | Temperatura y calor | D | Verter y calentar: mezcla dos vasos; acerca el mechero al hielo | La temperatura final no es el promedio; en el cambio de fase entra calor y T no sube | Vaso y mechero |
| 13 | Termodinámica | D | Apretar: empuja el émbolo rápido o lento, con mechero o sin él | El trabajo es el área que él mismo dibuja en P–V | Émbolo y mechero |
| 14 | Electrostática | B | Estirar: acerca una carga a otra que cuelga | Las dos fuerzas son iguales aunque las cargas no lo sean | — |
| 15 | Corriente y circuitos | D | Conectar: arma el circuito con el dedo y saca un foco | En serie se reparten el voltaje; en paralelo cada foco brilla igual | Foco y pila |
| 16 | Campo y fuerza magnética | B | Girar: pasea la brújula alrededor del cable; lanza la carga | La carga quieta no siente nada; la fuerza va de costado | Imán y brújula |
| 17 | Inducción electromagnética | B | Estirar: mete y saca el imán de la espira, rápido o lento | El foquito prende solo mientras el flujo cambia | Imán y foco |
| 18 | Ondas electromagnéticas | D | Ordenar: recorre el espectro; cruza el rayo a otro medio | Todas viajan a c; al cambiar de medio cambia λ, no f | — |
| 19 | Óptica geométrica | A | Estirar: mueve el objeto y la lente; dobla la hoja en el espejo | La imagen cambia de lado al cruzar el foco | — |
| 20 | Física moderna | D | Girar: dos perillas en la lámpara, una para el color y otra para el brillo | El brillo da más electrones; el color, más energía; bajo el umbral no sale nada | Foco |

### Química (20)

| # | Unidad | Hoy | Gesto | Lo que descubre haciéndolo | Rive |
| --- | --- | --- | --- | --- | --- |
| 1 | Materia y energía | B | Verter y calentar: filtra, decanta y evapora una mezcla | Cada método separa por una propiedad; la masa no cambia | Vaso y mechero |
| 2 | Estructura atómica | B | Poner fichas: llena los orbitales con electrones | El orden de llenado sale de «primero el más barato» | — |
| 3 | Tabla periódica | B | Ordenar: acomoda cartas de elementos por una propiedad | La tendencia aparece al ordenar; los grupos se parecen | — |
| 4 | Enlace químico | B | Conectar y girar: une átomos y gira la molécula | Los pares libres empujan; los dipolos se suman o se anulan | — |
| 5 | Nomenclatura inorgánica | B | Clasificar y poner fichas: cruza las cargas | El nombre sale del estado de oxidación | — |
| 6 | Mol y composición | D | Pesar: echa cucharadas a la balanza hasta juntar un mol | Un mol de cada sustancia pesa distinto y cuenta lo mismo | — (balanza del kit) |
| 7 | Reacciones y balance | B | Poner fichas: agrega moléculas enteras a cada lado | Se cambian los coeficientes, nunca los subíndices | — |
| 8 | Estequiometría | D | Poner fichas: junta 1 N₂ con 3 H₂ hasta que algo se acabe | El limitante es el que se acaba primero, no el que hay menos | — |
| 9 | Estado gaseoso | D | Apretar y calentar: empuja el émbolo; acerca el mechero | Con T fija, P por V no cambia; con calor, los choques son más fuertes | Émbolo y mechero |
| 10 | Líquidos y sólidos | D | Calentar: calienta el frasco, tápalo, súbelo de altitud | Hierve cuando su vapor iguala la presión de afuera | Vaso y mechero |
| 11 | Soluciones | B | Verter: echa soluto, agrega agua, pasa una parte a otro vaso | Diluir no cambia los moles; sacar una parte no cambia la concentración | Vaso y gotero |
| 12 | Cinética química | D | Calentar: calienta, muele y agita | Qué acelera la reacción y por qué: más choques que sirven | Vaso y mechero |
| 13 | Equilibrio químico | D | Verter, apretar y calentar un sistema en equilibrio | El sistema responde en contra; K solo cambia con la temperatura | Vaso, émbolo y mechero |
| 14 | Ácidos y bases | D | Verter y gotear: diluye; neutraliza gota a gota | Diluir 10 veces sube 1 de pH; la neutralización es un salto | Vaso y gotero |
| 15 | Electroquímica | B | Conectar: arma la pila, pon el puente salino, cambia los metales | Quién se oxida lo decide la pareja; sin puente no hay corriente | Vaso y foco |
| 16 | Hidrocarburos | A | Conectar: arma la cadena carbono por carbono | El nombre sale de la cadena más larga; mismos átomos, otra molécula | — |
| 17 | Funciones orgánicas | A | Cortar y armar: quita un H y pon el grupo | El grupo decide la familia y cuánto se pegan las moléculas | — |
| 18 | Biomoléculas | A | Conectar: junta dos piezas y sale agua | Toda unión suelta agua; la hidrólisis la devuelve | — |
| 19 | Petróleo y recursos naturales | D | Calentar: destila subiendo la temperatura | Cada fracción sale a su temperatura | Mechero |
| 20 | Contaminación y química aplicada | D | Gotear y clasificar: mide el pH de la lluvia; ordena contaminantes | Qué gas causa qué efecto | Vaso y gotero |

### Aritmética (19)

| # | Unidad | Hoy | Gesto | Lo que descubre haciéndolo | Rive |
| --- | --- | --- | --- | --- | --- |
| 1 | Lógica proposicional | B | Conectar: prende interruptores en serie y en paralelo | «Y» es serie, «o» es paralelo; el condicional solo falla en un caso | Foco |
| 2 | Conjuntos | B | Poner fichas en los aros | Lo que está en la intersección se cuenta una vez | — |
| 3 | Razones y proporciones | A | Estirar la tira | Al ampliar, la razón se conserva y la diferencia no | — |
| 4 | Magnitudes proporcionales | A | Estirar un lado del taller de área fija | En la inversa, el producto no cambia | — |
| 5 | Tanto por ciento | G | Cortar la barra (ya existe en la práctica viva) | El segundo descuento se aplica a lo que queda | — |
| 6 | Interés y descuento | A | Poner fichas: agrega una capa por año | El compuesto gana interés sobre el interés | — |
| 7 | Mezclas y aleaciones | B | Verter: junta dos vasos de precio o grado distinto | El promedio se acerca al que más cantidad puso | Vaso |
| 8 | Estadística descriptiva | A | Estirar: mueve un dato del diagrama | Un dato extremo jala la media y no la mediana | — |
| 9 | Análisis combinatorio | B | Ordenar fichas en casilleros | Si el orden no importa, varios arreglos son el mismo | — |
| 10 | Probabilidades | B | Marcar los casos en la cuadrícula de los dos dados | El 7 sale más porque tiene más casillas | — |
| 11 | Sistemas de numeración | B | Poner fichas: agrupa de a b | Cambiar de base es reagrupar las mismas fichas | — |
| 12 | Las cuatro operaciones | B | Poner fichas y llevar | La llevada es un grupo que se muda de columna | — |
| 13 | Divisibilidad | B | Poner fichas en filas iguales | El resto es lo que no entra en la última fila | — |
| 14 | Números primos y divisores | B | Cortar y armar: haz rectángulos con n fichas | Un primo solo arma una fila | — |
| 15 | MCD y MCM | A | Cortar cintas; soltar dos buses | El MCD es el corte más grande que sirve a las dos | — |
| 16 | Números racionales | A | Cortar la barra | Dos fracciones equivalentes son el mismo corte | — |
| 17 | Potenciación y radicación | B | Poner fichas: arma el cuadrado | Para pasar al cuadrado siguiente faltan 2k + 1 fichas | — |
| 18 | Sucesiones y series | A | Poner fichas: agrega una fila a la figura | Lo que se agrega en cada paso es la razón | — |
| 19 | Razonamiento numérico | B | Poner fichas: cambia una por otra | Cada cambio corrige una diferencia fija | — |

### Álgebra (19)

| # | Unidad | Hoy | Gesto | Lo que descubre haciéndolo | Rive |
| --- | --- | --- | --- | --- | --- |
| 1 | Lógica, conjuntos y juegos lógicos | B | Conectar interruptores; poner fichas en aros | Lo mismo que en aritmética 1 y 2 | Foco |
| 2 | Números reales e intervalos | B | Estirar los extremos de dos intervalos | Unión e intersección se ven; el extremo abierto no se alcanza | — |
| 3 | Exponentes y productos notables | A | Cortar y armar el cuadrado de lado a + b | Además de a² y b² hay dos rectángulos | — |
| 4 | Ecuaciones de 1.º y 2.º grado | A | Pesar: quita lo mismo de los dos platillos | Lo que se hace a un lado se hace al otro | — |
| 5 | Inecuaciones | A | Reflejar: voltea la recta al multiplicar por −1 | El signo se invierte porque la recta se refleja | — |
| 6 | Valor absoluto y radicales | A | Estirar: abre un compás desde el centro | El valor absoluto es una distancia | — |
| 7 | Polinomios | A | Poner fichas en la máquina, con el cero que falta | El resto es la altura P(a) en la curva | — |
| 8 | División de polinomios | A | Poner fichas en la máquina de Ruffini | Con divisor ax + b, el cociente sale multiplicado | — |
| 9 | Factorización | A | Cortar y armar: haz un rectángulo con las piezas | Factorizar es hallar los lados | — |
| 10 | Ecuaciones polinomiales | A | Estirar: mueve las raíces sobre el eje | La suma y el producto de las raíces son los coeficientes | — |
| 11 | Funciones y sus gráficas | A | Girar las perillas | Cada perilla mueve la gráfica de una sola manera | — |
| 12 | Tipos de funciones e inversa | A | Doblar el plano por y = x | La inversa es el reflejo; 1/f es otra cosa | — |
| 13 | Exponenciales y logaritmos | A | Poner fichas: sube la escalera multiplicando | El logaritmo cuenta los escalones | — |
| 14 | Números complejos | D | Girar la flecha | Multiplicar por i gira 90° | — |
| 15 | Matrices y determinantes | B | Estirar las dos columnas | El determinante es el área con signo | — |
| 16 | Sistemas de ecuaciones | A | Girar dos rectas | Una solución, ninguna o infinitas se ven | — |
| 17 | Programación lineal | D | Estirar: desliza la recta de nivel con el dedo | El óptimo sale por un vértice | — |
| 18 | Sucesiones y series | A | Poner fichas: agrega filas | La suma se ve como figura | — |
| 19 | Binomio de Newton | D | Soltar bolitas en el tablero | Cada coeficiente cuenta caminos | — |

### Geometría (18)

| # | Unidad | Hoy | Gesto | Lo que descubre haciéndolo | Rive |
| --- | --- | --- | --- | --- | --- |
| 1 | Segmentos y ángulos | B | Girar la secante sobre las paralelas | Los ocho ángulos son solo dos valores | — |
| 2 | Triángulos y líneas notables | A | Estirar el vértice | La altura sale fuera en el obtusángulo | — |
| 3 | Congruencia | B | Cortar y armar: arma el triángulo con palitos y ángulos | Con LLA pueden salir dos triángulos | — |
| 4 | Polígonos y cuadriláteros | A | Estirar los vértices | El nombre cambia cuando cambia una propiedad | — |
| 5 | Circunferencia | A | Estirar el vértice sobre el arco | El inscrito no cambia: es la mitad del central | — |
| 6 | Proporcionalidad y semejanza | A | Estirar: amplía la figura | El área crece con k² y el volumen con k³ | — |
| 7 | Puntos notables | A | Estirar el vértice | Los cuatro puntos coinciden solo en el equilátero | — |
| 8 | Relaciones métricas | A | Cortar y armar los cuadrados de los lados | Pitágoras es una igualdad de áreas | — |
| 9 | Polígonos regulares | A | Girar: da la vuelta al polígono lado por lado | Los ángulos exteriores suman una vuelta | — |
| 10 | Simetría | B | Reflejar: mueve el espejo | Dos reflexiones dan un giro o un traslado | — |
| 11 | Áreas de regiones | A | Estirar el vértice en paralelo a la base | El área no cambia entre paralelas | — |
| 12 | Longitud y áreas circulares | A | Girar: desenrolla la circunferencia; reacomoda los gajos | π es cuántos diámetros caben en la vuelta | — |
| 13 | Rectas y planos en el espacio | A | Girar el cubo | Tres perpendiculares se ven al girar | — |
| 14 | Poliedros | A | Doblar: despliega y vuelve a armar | Caras más vértices menos aristas da 2 | — |
| 15 | Prisma y pirámide | A | Verter: llena el prisma con pirámides | La pirámide es un tercio del prisma | — |
| 16 | Cilindro, cono y esfera | A | Girar la figura plana para generar el sólido | Tres conos llenan el cilindro | — |
| 17 | Geometría analítica | A | Estirar puntos; tensar la cuerda del jardinero | La pendiente; la suma de distancias constante | — |
| 18 | Razonamiento con figuras | B | Marcar cada figura que encuentre | Se cuenta por clases, no una por una | — |

### Trigonometría (19)

| # | Unidad | Hoy | Gesto | Lo que descubre haciéndolo | Rive |
| --- | --- | --- | --- | --- | --- |
| 1 | Ángulo trigonométrico y sistemas | A | Girar: enrolla la cinta del radio | Un radián es un radio enrollado | — |
| 2 | Longitud de arco y sector | A | Girar: haz rodar la rueda | El arco es ángulo por radio | — |
| 3 | Razones de ángulos agudos | A | Estirar el triángulo sin cambiar el ángulo | La razón no depende del tamaño | — |
| 4 | Resolución de triángulos rectángulos | A | Girar la línea de mira | Con un lado y un ángulo sale todo | — |
| 5 | Plano cartesiano y la recta | A | Girar la recta | La pendiente es la tangente del ángulo | — |
| 6 | Ángulos en posición normal | A | Girar el lado final | El signo lo decide el cuadrante | — |
| 7 | Reducción al primer cuadrante | A | Reflejar el ángulo | Mismo valor; cambia el signo | — |
| 8 | Circunferencia trigonométrica | A | Girar el punto | El seno es la altura y el coseno, la sombra | — |
| 9 | Identidades fundamentales | A | Girar y mirar las áreas | sen² más cos² siempre arma el mismo cuadrado | — |
| 10 | Suma y diferencia de ángulos | A | Girar dos veces seguidas | El seno de la suma no es la suma de los senos | — |
| 11 | Ángulo doble, mitad y triple | A | Girar el doble | Duplicar el ángulo no duplica el seno | — |
| 12 | Transformaciones y series | B | Estirar dos flechas en la circunferencia | La suma apunta a la semisuma | — |
| 13 | Funciones trigonométricas | A | Girar el punto y desenrollar la gráfica | El período es una vuelta | — |
| 14 | Funciones inversas | B | Estirar la ventana principal | Solo un corte cae dentro de la ventana | — |
| 15 | Ecuaciones trigonométricas | A | Girar hasta que la altura valga k | Hay dos ángulos por vuelta | — |
| 16 | Triángulos oblicuángulos | A | Girar el compás | Con LLA salen cero, uno o dos triángulos | — |
| 17 | Áreas y líneas notables | A | Estirar un lado y el ángulo | El área es medio producto de dos lados por el seno | — |
| 18 | Lugar geométrico y cónicas | D | Estirar: tensa la cuerda con el dedo | La suma de distancias a los focos no cambia | — |
| 19 | Coordenadas polares y complejos | D | Girar el radar | Un r negativo cruza por el polo | — |

### Razonamiento matemático (19)

| # | Unidad | Hoy | Gesto | Lo que descubre haciéndolo | Rive |
| --- | --- | --- | --- | --- | --- |
| 1 | Deductivo y parentesco | A | Conectar: arma el árbol familiar | Solo una disposición cumple todas las pistas | — |
| 2 | Trazos y perímetros | A | Conectar: traza sin levantar el dedo | Se puede con cero o dos vértices impares | Hormiga |
| 3 | Ordenamiento de información | A | Ordenar fichas en la fila o en la mesa | Cada pista descarta posiciones | — |
| 4 | Verdades y mentiras | A | Clasificar: voltea a cada personaje | Se supone, y la contradicción decide | — |
| 5 | Traslados y puntos cardinales | B | Conectar: guía la combi por las cuadras | El desplazamiento no es lo caminado | Combi |
| 6 | Arreglos numéricos | B | Poner fichas en el cuadrado | El centro es la suma mágica entre 3 | — |
| 7 | Razonamiento inductivo | A | Poner fichas: agrega una fila y cuenta | El patrón sale de tres casos chicos | — |
| 8 | Elementos recreativos | B | Girar el dado; mover palitos | Las caras opuestas suman 7 | — |
| 9 | Relojes y calendarios | B | Girar el minutero | El horario también avanza | — |
| 10 | Certezas | A | Soltar: saca bolas en el peor caso | La certeza llega con el peor caso más uno | — |
| 11 | Frecuencia de sucesos | B | Soltar las combis del paradero | Coinciden en el MCM; hay un intervalo menos que sucesos | Combi |
| 12 | Ruedas, poleas y engranajes | A | Girar la rueda con el dedo | Dientes por vueltas se conserva | — |
| 13 | Máximos y mínimos | B | Estirar el cordel | Con el mismo cordel, el cuadrado encierra más | — |
| 14 | Cortes, pesadas y balanzas | B | Cortar con la sierra; pesar | Hay un corte menos que pedazos | — (balanza del kit) |
| 15 | Planteo de ecuaciones | A | Pesar y poner fichas: traduce el enunciado | Cada frase es una operación sobre la balanza | — |
| 16 | Movimiento de figuras | A | Girar, voltear y rodar | Girar no es voltear | — |
| 17 | Rutas y visualización espacial | A | Girar los cubitos; conectar aristas | Lo que no se ve se deduce de dos vistas | Hormiga |
| 18 | Tablas, gráficos y suficiencia | B | Estirar el eje del gráfico | Un eje cortado exagera la diferencia | — |
| 19 | Diagramas de flujo y operadores | G | Soltar un número por el diagrama | El operador es una máquina con una sola regla | — |

### Razonamiento verbal (18)

Aquí el modelo es el texto y no hay fenómeno que animar. El gesto se hace sobre las palabras y Rive se limita a la mascota. El POGIL v2 de este curso es de lectura: el alumno marca, mueve o tacha, y el texto «responde» mostrando qué se sostiene y qué se cae.

| # | Unidad | Hoy | Gesto | Lo que descubre haciéndolo |
| --- | --- | --- | --- | --- |
| 1 | Definiciones | G | Poner fichas: género y diferencia | Una definición buena deja fuera a los parecidos |
| 2 | Analogías | G | Conectar pares y nombrar la relación con una ficha | Se compara la relación, no las palabras |
| 3 | Sentido contextual | G | Poner fichas: cambia la palabra y relee | El contexto decide cuál acepción aguanta |
| 4 | Conectores | G | Poner fichas entre dos ideas | El conector dice qué relación hay: causa, contraste o suma |
| 5 | Eliminación de oraciones | G | Marcar: tacha una oración y relee | Sobra la que repite o se sale del tema |
| 6 | Plan de redacción | G | Ordenar tarjetas | El orden va de lo general a lo particular o sigue el tiempo |
| 7 | Cohesión y coherencia | G | Conectar cada pronombre con su referente | Un texto se sostiene por sus referencias |
| 8 | El texto y sus tipos | G | Clasificar párrafos | El tipo lo delata el propósito, no el tema |
| 9 | Tema e idea principal | G | Marcar: tapa una oración y mira si el texto se cae | La idea principal es la que no se puede quitar |
| 10 | Resumen y síntesis | G | Marcar: tacha hasta dejar lo mínimo | Resumir es quitar sin cambiar lo que se afirma |
| 11 | Textos discontinuos | G | Marcar en el gráfico de dónde sale el dato | La respuesta está en el cruce de fila y columna |
| 12 | Inferencias | G | Marcar las dos frases que sostienen la conclusión | Inferir es unir dos cosas dichas, no adivinar |
| 13 | Compatibilidad | G | Clasificar: lo dice, lo contradice o no lo dice | «No lo dice» no es «lo niega» |
| 14 | Extrapolación | G | Poner fichas: cambia una condición del texto | Qué conclusión cambia y cuál se mantiene |
| 15 | Argumentativos y dialécticos | G | Clasificar: tesis, argumento y contraargumento; quién lo dice | Dos autores pueden coincidir en el dato y no en la tesis |
| 16 | Texto y contexto | G | Ordenar: sitúa el texto en su línea de tiempo | El sentido cambia con quién habla y cuándo |
| 17 | Filosóficos y científicos | G | Marcar el término y armar su definición con el texto | El autor define sus palabras al usarlas |
| 18 | Lectura en inglés | G | Conectar la palabra con su pista de contexto | El significado se saca de lo que la rodea |

## 9. Orden de trabajo y cómo se comprueba

Una variable por versión, como pide el skill. Cada versión tiene una decisión al final; si la respuesta es no, no se pasa a la siguiente.

| Versión | Qué cambia | Qué se mide | Decisión |
| --- | --- | --- | --- |
| **0. Estrés de Rive** | Nada de la app: una página de prueba con 1, 2 y 3 animaciones, chicas y grandes, siguiendo el dedo | Cuadros por segundo y memoria en el celular de 4 GB | El presupuesto real de la sección 6.3 |
| **A. Ácidos y bases con POGIL v2, sin Rive** | Los cinco tiempos, el gesto de verter y los registros, con el vaso en SVG del kit | Que la figura y la tarea quepan en una pantalla; palabras antes del primer toque; duración de un ensayo; que cinco alumnos cuenten qué hicieron | ¿El modelo de lección funciona? Esto no depende de Rive |
| **B. La misma unidad con utilería Rive** | Solo el vaso, la jarra y la bureta pasan a Rive | Cuadros por segundo contra A; preferencia y comprensión contra A con otros cinco alumnos | ¿Rive agrega algo que justifique su costo de producción? |
| **C. Una unidad de física y una de matemática** | MRUV con el carrito; `triangulo-estira`, que ya se arrastra, solo con registros y regla | Lo mismo que A | ¿El modelo aguanta fuera de la química? |
| **D. Escalar** | Física y química primero, por utilería compartida: las que usan vaso y mechero, después carrito, después foco | Pruebas de entrada y salida | Con tope de gasto por rutina, como siempre |

**Guion para probar con un alumno** (sin anticiparle nada): se le da el celular con la unidad abierta y al terminar se le pregunta, en este orden: «¿Qué pasó?», «¿Qué hiciste tú?», «¿Cuándo lo entendiste?», «Si ahora tuvieras 1 L, ¿qué pH marcaría?». Se anota lo que intentó tocar y no respondía: eso dice qué gesto esperaba.

**La hipótesis de fondo y su prueba.** Hipótesis: en una misma unidad, POGIL v2 da mejor resultado en los ítems de transferencia que el paso a paso de hoy. La app ya tiene con qué comprobarlo: pruebas de entrada y salida con formas paralelas y ganancia de Hake. En el piloto, una sección usa la versión de hoy y otra la v2 de la misma unidad. Con un colegio y dos secciones el resultado es una señal, no una prueba.

**Lo que conviene decidir antes del piloto de diciembre.** El rediseño completo no entra. Entra la versión A, quizá la B. Lo demás del piloto va con las escenas de hoy, que funcionan.

## 10. Riesgos y lo que no se verificó

- **Costo de producción.** Cada utilería es dibujo y animación a mano en el editor de Rive, más su contrato, su respaldo SVG y su prueba de fidelidad. Quince archivos bien hechos son varias semanas de alguien. Existe además la línea de comandos de Rive, con la que un agente escribe la escena como texto; desde este entorno no se pudo probar porque el servidor de descarga está bloqueado.
- **Plan de Rive.** El plan gratis exporta con la pantalla de inicio de Rive. Para producción hace falta Cadet (108 USD al año según su documentación; confirmar en su web). Hay que confirmar también que el enlace de datos funciona en el runtime 2.50.0 que ya está en `app/vendor/rive/`.
- **El gesto puede volverse un juguete.** Verter es divertido; si el alumno vierte veinte veces y no llega a la regla, el gesto se comió la lección. Por eso los ensayos son 3 o 4 y la regla es un tiempo aparte.
- **Detalles seductores.** Toda utilería nueva tiene que contestar: «si se quita, ¿qué se pierde?». Si la respuesta es «se ve menos bonito», no entra.
- **Accesibilidad.** Un gesto que solo se puede hacer arrastrando deja fuera a alumnos y a las PC sin pantalla táctil del laboratorio. La alternativa sin arrastrar no es opcional.
- **Tiempo por unidad.** Los cinco tiempos pueden tardar más que el paso a paso. Si una unidad pasa de 10 minutos, se parte.
- **No verificado:** nada se probó con alumnos, ni en un celular físico, ni con lector de pantalla. La detección de «se arrastra» es automática y aproximada. Las relaciones de la columna «lo que descubre» son propuestas sin contrastar con los informes de ideas erróneas. No se leyó material de pogil.org (sigue pendiente en la visión). Las cifras sobre animación del skill no se rastrearon a su fuente.

## Reporte de diseño

- **Ficha de tarea:** revisión de algo existente (las 99 escenas) y dirección para un sistema nuevo de lección. No se corrigió nada.
- **Sistema:** el existente (`docs/diseno.md`, `docs/escena-viva.md`, kit y mascota). Decisiones nuevas que este documento propone y que quedan aquí escritas hasta que Gerson las apruebe: los cinco tiempos, el vocabulario de 13 gestos, la regla de decisión Rive contra motor y el catálogo de 15 archivos.
- **Carácter:** acogedora, viva y precisa (sin cambios). Firma: el hilo de color, que ahora llega también a los registros.
- **Movimientos:** ninguno nuevo. La utilería se rige por las clases «gesto» y «simulación» del skill: sigue al dedo uno a uno y el reloj es el del motor.
- **Verificación:** barrido con Playwright de 99 escenas a 390 × 780 (cifras en la sección 2); dos escenas revisadas a mano.
- **No verificado:** lo listado en la sección 10.
- **Hipótesis:** la de la sección 9.
- **Conflictos:** el plan de tres capas de `docs/pendientes.md` propone GSAP o Motion para el movimiento; aquí se propone no agregar librería hasta que el gesto esté resuelto. `docs/escena-viva.md` pone la mascota como único uso de Rive; aquí se amplía a utilería, personajes de escena e interfaz, con el mismo tipo de contrato.
