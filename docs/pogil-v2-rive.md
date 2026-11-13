# POGIL v2: auditoría de las escenas y dirección con Rive

13 de noviembre de 2026. Auditoría pedida por Gerson: «el diseño es hermoso; lo que no es hermoso es la forma de enseñar». Es un documento de evaluación y dirección: no trae código ni cambia nada de la app. Se hizo con los skills `diseno-y-animacion` y `estructura-visual-motion`, leyendo `docs/escena-viva.md`, `docs/pendientes.md` (sección B) y `docs/vision-pisa-agilidad-interaccion.md` (secciones 3 y 4), y midiendo las 99 escenas en una pantalla de celular. Si algo de aquí choca con `CLAUDE.md` o con `docs/escena-viva.md`, mandan ellos.

**Ampliado el mismo día** cuatro veces. Cuarto, las progresiones: tramos, prerrequisitos y niveles de dominio, a partir de una tercera opinión (sección 5.7), y la pregunta de seguridad (5.8). Primero, tres unidades de química rediseñadas a pedido de Gerson: materia, tabla periódica y enlace (secciones 7.2 a 7.4). Tercero, más formas de explicar una misma unidad, empezando por razonamiento matemático (sección 5.6). Segundo, una segunda opinión que trajo Gerson (otra conversación, sobre unir Rive con POGIL y sobre otras formas de enseñar). Lo nuevo está en las secciones 5.3 a 5.5, en la columna «Ruta» del temario y en la fila de repaso de la sección 9. Corrige un error de la primera versión: aplicaba POGIL a las 152 unidades.

## 1. En corto

- **Veredicto:** ¿se entiende? A medias: se entiende leyendo. ¿Se siente? No. La cáscara ya es acogedora; la lección sigue siendo una presentación de diapositivas con un dibujo al lado.
- **Por qué se ve plano:** no falta profundidad ni acabado. Falta que el alumno haga algo. En 72 de las 99 escenas no se toca la figura: se pulsa «Siguiente» o se jala un deslizador. Las cosas se mueven (89 escenas tienen animación), pero no porque el alumno las mueva.
- **Rive solo no lo arregla.** Poner un tubo de ensayo hermoso en una lección que avanza con «Siguiente» da una presentación más bonita. Primero se cambia el verbo del alumno; después se viste.
- **La propuesta, POGIL v2:** el modelo del POGIL de papel se vuelve un objeto que responde, y las preguntas se contestan haciendo. Cada unidad declara **un gesto** (verter, soltar, colgar, conectar…) que es la acción real del fenómeno, y el alumno arma con sus propios intentos la tabla de datos de la que sale la regla.
- **No todo se descubre.** POGIL v2 es la ruta principal de 83 de las 152 unidades, no de todas. Un procedimiento (Ruffini, balancear, nombrar un compuesto) se aprende mejor siguiendo un ejemplo que va perdiendo pasos; un concepto con frontera, comparando casos; un dato, recordándolo en días distintos. Cada unidad lleva una ruta principal y una de apoyo, de cinco posibles (sección 5.3).
- **El hueco más grande después del gesto es el repaso.** La app enseña y no vuelve a preguntar días después. Arreglarlo no necesita Rive ni rediseño.
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

## 5. El modelo: POGIL v2 y las otras rutas

### 5.1 Los cinco tiempos de una unidad que se descubre

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

### 5.3 No todo se descubre: las cinco rutas

La primera versión de este documento ponía los cinco tiempos en las 152 unidades. Estaba mal, y la segunda opinión lo dice bien: descubrir una propiedad, aprender un procedimiento, recordar una fórmula y sostener una respuesta con un texto son necesidades distintas. Nadie «descubre» Ruffini vertiendo algo; lo aprende viendo a alguien hacerlo y haciéndolo con menos ayuda cada vez.

La pregunta que decide la ruta es: **¿qué clase de cosa hay que aprender en esta unidad?**

| Ruta | Se usa cuando hay… | Secuencia | Qué hace la mano | Lo que ya existe en Mesa | Rive |
| --- | --- | --- | --- | --- | --- |
| **D · Descubrir** | Una relación entre cosas que cambian: un fenómeno o una figura | Los cinco tiempos de 5.1 | El gesto del fenómeno | Las escenas y sus motores | Utilería donde hay material |
| **E · Seguir un ejemplo** | Un procedimiento con pasos y decisiones: dividir polinomios, balancear, nombrar, resolver | Ejemplo completo → ejemplo donde el alumno elige un paso → problema con pista a pedido → problema solo | Elige o arma el paso siguiente sobre la línea de tiempo | El paso a paso y la línea de tiempo del kit; el principio «ayuda que se retira» del fundacional | Solo la mascota |
| **C · Comparar** | Un concepto con frontera: qué es y qué no es, tipos, definiciones | Casos típicos → casos que «parecen» y casos límite → el alumno fabrica un caso que no cumple | Clasifica, o deforma una figura hasta que deja de cumplir | Los casos límite del explorador; la trampa LLA de `congruencia` | Solo la mascota |
| **R · Recordar** | Un dato, un valor o una convención que el examen da por sabido: notables, prefijos, valencias, fórmulas, vocabulario | Entenderlo una vez → recuperarlo sin apoyo → volver en días distintos, mezclado con otros temas | Toques rápidos | El prototipo de calentamiento `juegos/cual-pesa-mas` (rama `prototipo/cual-pesa-mas`); los problemas de papel | No: basta el movimiento del navegador |
| **A · Argumentar** | Una respuesta que vale por su justificación: lectura, verdades y mentiras, suficiencia de datos | Responder solo → decir por qué, marcando la evidencia → contrastar con otra respuesta → responder otra vez | Marca en el texto o en la figura lo que sostiene su respuesta | El paso previo del formato lectura; el modo salón propuesto | Solo la mascota |

Cada unidad lleva **una ruta principal y una de apoyo**, no las cinco. La columna «Ruta» del temario (sección 8) las da en ese orden: «D+E» quiere decir que la unidad se descubre y después se fija con un ejemplo. Reparto de la ruta principal:

| Curso | Descubrir | Seguir un ejemplo | Comparar | Recordar | Argumentar |
| --- | --- | --- | --- | --- | --- |
| Física (20) | 19 | 0 | 1 | 0 | 0 |
| Química (20) | 12 | 4 | 2 | 2 | 0 |
| Aritmética (19) | 11 | 7 | 1 | 0 | 0 |
| Álgebra (19) | 7 | 10 | 2 | 0 | 0 |
| Geometría (18) | 13 | 2 | 3 | 0 | 0 |
| Trigonometría (19) | 10 | 8 | 1 | 0 | 0 |
| Razonamiento matemático (19) | 11 | 5 | 1 | 0 | 2 |
| Razonamiento verbal (18) | 0 | 4 | 6 | 1 | 7 |
| **Total (152)** | **83** | **40** | **17** | **3** | **9** |

Lo que dice ese reparto:

- **POGIL v2 lidera en 83 unidades:** 19 de 20 en física, 13 de 18 en geometría y 12 de 20 en química.
- **En álgebra y trigonometría, casi la mitad de las unidades es de ejemplo** (18 de 38): identidades, reducción, división de polinomios, factorización. Ahí un gesto bonito sería adorno.
- **Recordar casi nunca lidera (3 unidades) pero apoya a 35.** Es la ruta de los calentamientos: notables, productos notables, unidades, criterios de divisibilidad, valencias.
- **Química es el curso más repartido:** fenómenos (D), procedimientos como nomenclatura y balance (E), clasificaciones como funciones orgánicas y biomoléculas (C) y memoria en los temas de recursos y ambiente (R).

La asignación es una propuesta: se discute unidad por unidad con Gerson y con el informe de ideas erróneas de cada tema.

**Cuatro capas que van en todas las unidades, sea cual sea la ruta:**

1. **Predecir** (regla 3). En las rutas E y C la predicción es «¿qué paso sigue?» o «¿este caso cumple?».
2. **El error se muestra y no se diagnostica de más.** El fantasma y el «sería cierto si…» se quedan. Pero una respuesta equivocada no prueba por qué se equivocó el alumno: puede ser un desliz. La explicación se ofrece como posibilidad («si pensaste que…»), y la medición guarda el código del error como hipótesis, no como diagnóstico.
3. **Transferir** con formato de examen y sin apoyos.
4. **Volver otro día** (sección 5.4).

### 5.4 Dos piezas que le faltaban al modelo

**El ejemplo que se completa.** Los cinco tiempos saltaban de «nombra la regla» a «resuelve uno de examen». Falta el puente: un problema de admisión resuelto en la línea de tiempo, con un paso que el alumno elige. Va al inicio del tiempo 5, antes del problema que resuelve solo. Así la experiencia del vaso queda amarrada al procedimiento que pide el examen. Cuidado con retirar la ayuda muy rápido: el fundacional ya cita que con alumnos de poca base rinde menos (Reisslein y otros 2006). Por eso los pasos se retiran cuando el alumno acierta, no por calendario.

**El repaso de otro día.** Es lo que una buena exploración no garantiza: acordarse la semana siguiente. El fundacional ya tiene el principio («recordar en vez de releer», Roediger y Karpicke) y la arquitectura ya reserva el dato («repasos pendientes»), pero la app no programa ningún repaso: hoy el único es el papel. Propuesta:

- Cada unidad terminada deja en cola tres preguntas cortas para otros días. Los intervalos (por ejemplo 2, 7 y 21 días) son un punto de partida, no un número mágico: se ajustan con los datos.
- Cada repaso dura uno o dos minutos, va con formato de examen, **sin la escena y sin animación**, y mezcla unidades distintas.
- Si falla, recién ahí se abre el modelo de esa unidad, como explicación.
- Los calentamientos de la ruta R entran por la misma cola.

Esto no pasa por Rive ni por el rediseño de las escenas, así que se puede hacer en paralelo.

**Cuánto dura una unidad.** Con el ejemplo y el problema solo, una unidad de ruta D puede pasar de 10 minutos. Si pasa, se parte en dos sesiones: tiempos 1 a 4 en una y el 5 en otra.

### 5.5 Las diez familias de la segunda opinión, contra lo que Mesa ya tiene

La otra conversación lista diez formas de enseñar. Es un buen mapa, pero se escribió sin ver el repo: siete de las diez ya están en Mesa de alguna forma.

| Familia | En Mesa hoy | Qué falta | ¿Se toma? |
| --- | --- | --- | --- |
| 1. Indagación guiada | Las escenas con su explorador | Que el alumno opere el modelo (toda esta auditoría) | Sí: es la ruta D |
| 2. Predecir, observar y explicar | Regla 3, en las 99 escenas | El «explicar» del alumno: hoy predice pero no dice por qué | Sí. En algunas predicciones, una ficha con la razón |
| 3. Ejemplos resueltos | El paso a paso | Que los pasos se retiren: hoy el ejemplo siempre está completo | Sí: es la ruta E |
| 4. Aprendizaje basado en problemas | El modo PISA de la visión | Todo | No ahora. El examen de admisión pregunta problemas cerrados |
| 5. Proyectos | Nada | Todo | No. No cabe en 10 minutos de celular ni apunta al examen |
| 6. Aprender del error | Errores típicos, fantasmas y el tono nuevo | No diagnosticar con una sola respuesta | Sí, con ese cuidado (5.3) |
| 7. Recuperación y repaso espaciado | El principio y los problemas de papel | Que la app programe los repasos | Sí: es el hueco más grande (5.4) |
| 8. Comparar ejemplos y contraejemplos | Casos límite sueltos en algunas escenas | Que sea un formato y que el alumno fabrique el contraejemplo | Sí: es la ruta C |
| 9. Explicar y discutir entre pares | El modo salón, propuesto y sin hacer | Casi todo | A medias: la ruta A y el modo salón. Una app individual no reemplaza la discusión |
| 10. Simulaciones | Las 99 escenas con motor verificado | Nada de fondo | Ya es el corazón del producto |

**Dónde acierta la segunda opinión:**

- No casarse con una sola metodología. Este documento lo hacía.
- La retención como medida aparte: entender hoy no es acordarse el día del examen.
- No dar por diagnosticado al alumno por una respuesta.
- Medir comprensión, resolución sin pistas y retención, no cuánto gustó la animación.

**Dónde se queda corta para Mesa:**

- Propone biología, historia y literatura; el catálogo tiene ocho cursos y esos quedan en `docs/vision-futura.md`.
- POGIL de aula es trabajo en equipos con roles, y de ahí sale su evidencia. En un celular a solas se pierde esa mitad; solo el modo salón la recupera.
- Un repertorio mal usado termina en lecciones de 20 minutos con siete técnicas apiladas. Por eso aquí son una ruta principal y una de apoyo.

**Sus fuentes.** No se pudieron abrir desde este entorno (la red las bloquea), así que quedan **por verificar** antes de pasar al fundacional: la definición de pogil.org, el metaanálisis sobre la guía en la indagación (Universidad de Twente), el de retroalimentación en entornos digitales (Van der Kleij y otros), la guía de prácticas del IES y la investigación de PhET. El fundacional ya trae fuentes propias para cuatro de estos puntos: predecir (Crouch y otros 2004), ayuda que se retira (Reisslein y otros 2006), recordar (Roediger y Karpicke) y simulaciones con andamiaje (D'Angelo y otros 2014: guiar la simulación suma sobre la simulación sola).

### 5.6 Más de una forma de explicar lo mismo

La ruta dice cómo entra el alumno a la unidad. No dice que haya una sola explicación. Cuando alguien no entiende, repetirle lo mismo más despacio casi nunca sirve; sirve cambiar de representación: del dibujo a la tabla, de la tabla a un caso con números chicos, del caso a la regla.

- **Cada unidad lleva su entrada principal y al menos dos entradas más,** escritas de antemano: otra representación, un caso más simple o un camino distinto de solución.
- **Aparecen a pedido** («explícamelo de otra forma») **o al fallar dos veces,** que es cuando `docs/pendientes.md` ya preveía abrir la micro-lección. No se muestran todas juntas.
- **Todas llegan a la misma regla y lo dicen:** al final se ve que el árbol y el cuadro de descarte dan la misma respuesta. Varias representaciones sueltas confunden; amarradas, enseñan.
- **La medición guarda con cuál entrada acertó cada alumno.** Con eso se sabe qué explicación funciona mejor para cada unidad, y la que nadie usa se quita.
- **Dónde importa más:** en razonamiento matemático (casi todo problema tiene varios caminos), en álgebra (el mismo ejercicio sale por gráfica, por tabla o por despeje) y en aritmética (barras, tabla o ecuación).

La tabla de formas de razonamiento matemático está en la sección 8, después de la de ese curso. Para los demás cursos queda por investigar: el archivo `docs/temario-completo.md` trae el campo vacío en cada unidad, listo para llenarse. Que variar la representación ayude es una hipótesis razonable, no un dato de este proyecto.

### 5.7 Progresiones: en qué orden, con qué base y cómo se demuestra

Una tercera opinión que trajo Gerson (otra conversación, que sí leyó el catálogo y el fundacional en `main`) mira una capa que esta auditoría no tocaba. Aquí se habla de **cómo se vive cada unidad**; esa opinión habla de **en qué orden van, qué base piden y qué prueba que el alumno puede avanzar**. Las dos capas se necesitan.

**Lo que afirma sobre el repo, comprobado:**

| Afirmación | ¿Es cierta? | Dónde se ve |
| --- | --- | --- |
| El avance cuenta unidades estudiadas, no lo que el alumno sabe hacer | Sí | `app/app.js`: el avance es la fracción de unidades marcadas como vistas («unidades estudiadas», «% estudiado») |
| La ruta se ordena por grado y por el temario de la universidad, sin dependencias entre unidades | Sí | El catálogo trae `grado` y `universidades` por unidad; no hay ningún campo de prerrequisitos |
| La «confianza calibrada» es en realidad aciertos sobre lo intentado | Sí | `nucleo/medicion.js`: es la tasa de aciertos sin contar los «No sé». No se le pregunta al alumno qué tan seguro está |
| La regla de lectura trata la paráfrasis como «se deduce» y la cita casi literal como «lo dice» | Sí | `docs/formato-lectura.md`, en las notas del paso `clasificar` |

Las dos últimas son correcciones concretas, no opiniones:

- **Lectura.** Una paráfrasis puede decir algo que el texto dice de forma explícita. La frontera útil es otra: información explícita (literal o reformulada) contra conclusión que obliga a unir dos datos. **Decidido y hecho (13 nov):** la regla ya está corregida en `docs/formato-lectura.md`. Falta revisar las sondas de `clasificar` de 24 textos.
- **Medición.** El número sirve, pero el nombre promete otra cosa. **Decidido (13 nov):** se agrega la pregunta de seguridad y el número de hoy se renombra. El plan está en 5.8.

**Lo que se toma:**

1. **Cuatro niveles por unidad en vez de un visto bueno.** Encajan con lo que la app ya registra y con la cola de repaso de 5.4:

   | Nivel | Qué quiere decir | Con qué se comprueba |
   | --- | --- | --- |
   | La estudié | Pasó por la unidad | La marca de hoy |
   | La resuelvo con ayuda | Acierta mientras tiene el modelo y las pistas | Los tiempos 1 a 4, o la práctica con pasos |
   | La resuelvo solo | Acierta un problema de examen sin apoyos | El problema final del tiempo 5 y la prueba de salida |
   | La recuerdo y la aplico | Acierta días después, mezclada con otras | El repaso de la semana |

   Un porcentaje suelto no declara dominio: hace falta resolver solo y volver a acertar después.

2. **Tramos dentro de cada curso.** Las 152 unidades se agrupan en 54 tramos (entre 6 y 9 por curso) que dicen qué se construye sobre qué. No reemplazan el orden del temario de cada universidad: lo complementan. Cada unidad lleva su tramo en `docs/temario-completo.md`. Un cruce útil: el tramo «Explicar propiedades» de química junta enlace con líquidos y sólidos, y eso coincide con el acto 5 de la sección 7.4.

3. **Prerrequisitos y desvíos cortos.** Dos o tres capacidades concretas por unidad. Si falla una, se ofrece un desvío de uno o dos minutos (un calentamiento de la ruta R o un problema guiado), no repetir una unidad entera. Es una oferta, no una reja: el postulante llega con huecos y con poco tiempo.

4. **Qué hacer según lo que pasó,** sin diagnosticar de más (una respuesta sola no clasifica a nadie; hacen falta dos señales):

   | Lo que se observa | Lo que se ofrece |
   | --- | --- |
   | Falla lo que la unidad da por sabido | El desvío corto |
   | Plantea bien y calcula mal | Práctica localizada de esa cuenta |
   | Acierta y no puede justificar | Un contraejemplo o una comparación (ruta C) |
   | Ya lo domina | Paso directo al problema de examen |

5. **Una ficha por unidad** con ocho elementos: desempeño final observable, prerrequisitos, diagnóstico, experiencia central, enseñanza explícita, práctica con apoyo que se retira, transferencia y recuperación posterior. Los seis últimos ya están en los cinco tiempos, las rutas y el repaso. Los dos primeros faltaban y quedan como campos abiertos en el temario.

6. **Práctica mezclada.** El examen no dice de qué capítulo es cada pregunta. La cola de repaso mezcla unidades a propósito, y antes de resolver se pregunta «¿qué tipo de problema es?». Es la idea más valiosa para un examen de admisión.

7. **Una dinámica propia por curso,** que se suma a las rutas de 5.3:

   | Curso | Dinámica central | Ruta a la que corresponde |
   | --- | --- | --- |
   | Aritmética | «Elige el modelo antes de calcular» | Comparar, con práctica mezclada |
   | Álgebra | «Auditor de soluciones»: hallar el primer paso sin justificar | Seguir un ejemplo, con un ejemplo que tiene un error |
   | Geometría | «Construye un contraejemplo» | Comparar |
   | Trigonometría | «Predice la gráfica desde el movimiento» | Descubrir |
   | Física | «¿Qué modelo explica este caso?» | Comparar y argumentar |
   | Química | «La misma situación en tres lenguajes»: lo que se observa, las partículas y los símbolos | Comparar |
   | Razonamiento matemático | «¿De verdad es el mínimo?» | Argumentar |
   | Razonamiento verbal | «Tribunal del resumen» | Argumentar |

   El «auditor de soluciones» es una variante nueva de la ruta E que no estaba: el ejemplo trae un error y el alumno lo encuentra. Va después del ejemplo correcto, nunca antes.

**Lo que no se toma, o se toma con cuidado:**

- **Herramientas externas dentro de la app** (GeoGebra, Desmos, PhET, CODAP). Mesa corre sin conexión en celulares baratos, con motor propio verificado (regla 1), contenido propio (regla 5) y medición propia. Una simulación de fuera no deja nada en la medición. Sirven como referencia de diseño y para el profesor en el laboratorio. Sus licencias para un producto que se vende a colegios hay que revisarlas antes de usarlas.
- **Ocho unidades de arranque, una por curso.** La selección por «puentes» es buena (fracciones hacia proporcionalidad, partículas hacia mol), porque prueba justo los prerrequisitos. Pero ocho fichas completas no entran antes del piloto. Orden propuesto: primero una unidad entera con su ficha (ácidos y bases, sección 9), después los ocho puentes.
- **Las dinámicas de pareja** (uno propone y otro comprueba). Son para el modo salón. En el celular a solas se convierten en dos preguntas seguidas, y eso pierde parte de lo que las hace funcionar.
- **La ficha en las 152 unidades.** Es trabajo editorial grande. Se llena primero donde se va a construir.
- **Sus fuentes.** Tampoco se pudieron abrir desde aquí. Dos coinciden con lo que el repo ya cita: el estudio de la PUCP con 4535 alumnos (`docs/investigacion/dinamica-ideas-erroneas.md`) y el de ejemplos que se retiran (Reisslein y otros 2006, en el fundacional). El resto queda por verificar.

### 5.8 La pregunta de seguridad y la regla que mantiene al alumno aprendiendo

Decisión de Gerson (13 nov): se agrega la pregunta de seguridad, para calibrar mejor al alumno, y con ella hace falta una buena regla para que siga aprendiendo sin trabarse. **Está planeado, no construido.**

**La pregunta.** Después de responder y antes de ver si acertó: «¿Qué tan seguro estás?», con tres opciones: *Seguro*, *Más o menos* y *Adiviné*. Un toque. «No sé» sigue existiendo y es otra cosa: es no responder.

**Qué mide.** Calibración de verdad: cuánto coincide lo seguro que dice estar con lo que acierta. El número de hoy se renombra «acierto sobre lo intentado» y el nombre «calibración» queda para este.

**Las cuatro combinaciones.** Juntar acierto y seguridad dice más que cada uno por separado:

| El alumno… | Qué es probable | Qué hace la app |
| --- | --- | --- |
| Está seguro y acierta | Lo domina | Avanza, le retira apoyos y aleja el repaso |
| Está seguro y falla | Tiene una idea equivocada firme. Es el caso más valioso | Le muestra su respuesta en la figura junto a la correcta, le da un contraejemplo y vuelve pronto sobre el tema |
| Duda y acierta | Lo sabe a medias, o adivinó | Otro del mismo tipo sin apoyo, y repaso pronto |
| Duda y falla | Le falta base | Un ejemplo completo o el desvío del prerrequisito, con un nivel más de apoyo |

**La regla.** Tiene que ser simple, siempre la misma ante lo mismo y explicable al alumno y al profesor; no un modelo opaco. Es el mismo espíritu de la regla 1.

1. **Primero se ajusta el apoyo, no el tema.** Se sube o se baja entre los cuatro niveles de ayuda antes de mandar al alumno a otra unidad.
2. **Hay una franja de acierto que se busca:** ni tan fácil que aburra ni tan difícil que frustre. Punto de partida, por ajustar con datos: que acierte entre 7 y 8 de cada 10.
3. **Nunca dos fallos seguidos sin que algo cambie:** otra forma de explicarlo (5.6), más apoyo o el desvío.
4. **Dos aciertos seguros seguidos** retiran un apoyo o llevan al problema de examen.
5. **El repaso se programa con las dos señales:** seguro y acierta alarga el intervalo; cualquier otra combinación lo acorta.
6. **Una señal sola no decide nada.** Hacen falta dos, igual que con los errores (5.3).
7. **El alumno ve el porqué** en una línea: «Te pongo otro parecido porque dudaste».

**Riesgos y lo que falta decidir:**

- **Cansa.** Es un toque más en cada problema. Quizá se pregunta en uno de cada dos.
- **Marcar siempre «Seguro».** La seguridad no puede tener premio ni castigo en puntos; si lo tiene, deja de ser sincera.
- **Dónde se pregunta.** En la práctica y en el repaso, desde el inicio. En las pruebas de entrada y salida daría el dato más limpio, pero las aleja del examen: por decidir, quizá solo en una parte de los ítems.
- **Quién ve la calibración.** El alumno, la suya. El profesor, por salón o por alumno: por decidir. Nunca como tabla de posiciones.
- **Tres opciones o cuatro,** y el texto exacto de cada una, se prueban con alumnos.
- Que esta regla mantenga al alumno aprendiendo es una hipótesis: se comprueba con el avance en los cuatro niveles de 5.7.

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
| Gotero y bureta | Utilería | Gotas por soltar, gotas soltadas | La gota que se forma y cae | 4: química 4, 11, 14 y 20 |
| Mechero y hielo | Utilería | Intensidad, encendido | La llama; el hielo que suda | 9: física 12 y 13; química 1, 4, 9, 10, 12, 13 y 19 |
| Émbolo | Utilería | Posición, presión para el manómetro | La resistencia al empujar | 3: física 13; química 9 y 13 |
| Foco, pila e interruptor | Utilería | Brillo, abierto o cerrado | El filamento que prende y se apaga | 7: física 15, 17 y 20; química 4 y 15; aritmética 1; álgebra 1 |
| Imán y brújula | Utilería | Posición, ángulo de la aguja | La aguja que oscila al asentarse | 2: física 16 y 17 |
| Carrito y bloque | Utilería | Posición y velocidad | Ruedas que giran, cabeceo al frenar o chocar | 4: física 2, 5, 7 y 8 |
| Pelota | Utilería | Posición | Aplastarse al rebotar | 2: física 3 y 9 |
| Hormiga | Personaje de escena | Posición y dirección | Caminar | 2: razonamiento matemático 2 y 17 |
| Combi | Personaje de escena | Posición y dirección | Arrancar y frenar | 2: razonamiento matemático 5 y 11 |
| Satélite | Personaje de escena | Posición | Girar sobre sí mismo | 1: física 6 |
| Candado de la predicción | Interfaz | Cerrado, abierto | Abrirse al responder | Toda la app |
| Sello de unidad | Interfaz | Nivel alcanzado | Caer y asentarse | Toda la app |
| Camino del curso | Interfaz | Unidades hechas, racha | Avanzar al terminar una unidad | La página de cada curso |

Con eso, **32 de las 152 unidades** llevan utilería o un personaje de escena (14 de física, 11 de química, 3 de aritmética y álgebra, 4 de razonamiento matemático), y las otras 120 llevan el gesto con el kit y la mascota. Es a propósito: en matemática el objeto es la figura, y la figura es del motor. De esas 32, 28 son de ruta Descubrir; las otras cuatro reutilizan utilería que ya existe, sin costo nuevo. **Las rutas E, C, R y A no piden ningún archivo de Rive aparte de la mascota:** el catálogo sigue en 15.

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

## 7. Ejemplos completos

### 7.1 Ácidos y bases

**Hoy.** Ocho pasos. El paso 1 tiene unas 110 palabras y la deducción del pH escrita antes de que el alumno toque nada. La lupa muestra las partículas, pero el alumno no las toca. Para diluir se jala un deslizador. La relación que el examen pide (cada vez que diluyes 10 veces un ácido fuerte, el pH sube 1) el alumno la lee escrita; no la saca de algo que hizo.

**Con POGIL v2.** Ruta: descubrir, con apoyo de un ejemplo (D+E). Gesto: verter y gotear. Ficha de tarea:

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
| 5. Transfiere | Primero un problema de formato San Marcos resuelto en la línea de tiempo, donde el alumno elige un paso (qué hacer con el 10⁻²). Después otro que resuelve solo, con figura quieta y alternativas. Al final, los de lápiz y papel |
| Otro día | A los 2, 7 y 21 días, una pregunta de dilución o de neutralización, sin vaso ni animación, mezclada con otras unidades. Si falla, se abre el vaso |

**Qué hace cada medio:**

- El motor de `acidos-bases` ya calcula todo esto; no cambia.
- La lectura de pH, las opciones, las fichas, la ecuación y los registros son HTML y SVG.
- Las partículas de la lupa siguen en canvas.
- La utilería (vaso, jarra y bureta) recibe del motor nivel, color e inclinación. El color sale del motor como color de un indicador, y hay que decidir cuál y decírselo al alumno: hoy la escala de pH es gris a propósito, para no sugerir que el ácido «es rojo».
- La mascota señala la jarra en el tiempo 1 y no vuelve a moverse hasta que se contrasta la predicción.

**Qué se pierde y hay que cuidar:**

- El paso a paso de hoy enseña la deducción completa (fuerte contra débil, la cuadrática). Eso no desaparece: pasa a ser la solución en línea de tiempo del tiempo 5 y la micro-lección de teoría. Lo que cambia es el orden: primero la experiencia, después la deducción.
- Verter es más lento que jalar un deslizador. Si un ensayo toma más de unos 5 segundos, el alumno se aburre a la tercera. Hay que medirlo.

### 7.2 Materia y energía: la muestra y la mesa

Pedido de Gerson (13 nov): la unidad tiene más potencial, puede llevar más ejemplos y le faltan las propiedades de la materia. Tiene razón: la había puesto como «comparar y recordar» y eso la dejaba en una clasificación de memoria. Ruta nueva: **descubrir, con apoyo de comparar (D+C)**, y un tramo corto de ejemplo para la cuenta de masa y energía.

La idea que ordena todo: **una muestra sobre una mesa de laboratorio y cuatro cosas que se le pueden hacer.** Las propiedades no se listan; salen de medir.

| Parte | Gesto | Qué hace el alumno | Lo que descubre | Idea errónea que ataca |
| --- | --- | --- | --- | --- |
| 1. Propiedades | **Cortar** y medir | Tiene un bloque de cobre (o un vaso de agua), una balanza, una probeta y un termómetro. Mide, parte la muestra por la mitad y vuelve a medir | La masa y el volumen se parten; la densidad, el color y la temperatura a la que hierve no. Unas propiedades dicen cuánto hay y otras dicen qué es. Recién ahí llegan los nombres: extensivas e intensivas | — |
| 1b. Hasta el fondo | Cortar, con la lupa | Sigue cortando hasta que la lupa muestra unos pocos átomos | Un átomo solo no tiene densidad ni punto de fusión: esas propiedades son del conjunto | AT1: «un átomo tiene las propiedades de la sustancia» |
| 2. Cambios | **Calentar, verter, cortar**: «hazle algo» | Doce casos de la casa y de la calle: hervir agua, disolver sal, el clavo que se oxida, quemar papel, fermentar chicha, el vaso frío que se empaña. Predice si es físico o químico, hace el cambio y mira con la lupa y con la balanza | La pregunta que decide es una sola: ¿las partículas siguen siendo las mismas? La masa total no cambia en ninguno | AT3: el cambio de estado leído como reacción (33 % de 358 universitarios, Salame y Casino 2021) |
| 3. Qué es | **Clasificar** y **poner fichas** | Unos treinta ejemplos reales (aire, bronce, oro de 18 quilates, agua del lago, leche) con su lupa de partículas. Después fabrica él uno: «arma una mezcla homogénea de dos elementos» | Elemento, compuesto y mezcla se distinguen por las partículas, no por el aspecto | Clasificar por la apariencia (Sanger 2000) |
| 3b. Separar | Verter y calentar | Filtra, decanta, destila o acerca un imán | Cada método aprovecha una propiedad de la parte 1: tamaño, densidad, punto de ebullición | — |
| 4. Energía | Ejemplo que se completa | Un problema de equivalencia masa y energía resuelto, con un paso por elegir | El orden de magnitud: muy poca masa es muchísima energía | — |

Lo que la hace visual sin gastar de más:

- **La parte 3b usa lo que se descubrió en la parte 1.** Por eso la unidad se siente como una sola historia y no como siete temas del sílabo.
- **Los ejemplos son el contenido.** Treinta sustancias y doce cambios, cada uno con su dibujo de partículas calculado y verificado. Ahí está el trabajo, no en la animación.
- **Rive:** el vaso y el mechero que ya están en el catálogo. Nada nuevo.
- **Para el repaso:** un calentamiento de un minuto, «¿físico o químico?» y «¿intensiva o extensiva?», lanzando cada caso a un lado.

### 7.3 Tabla periódica: la tabla viva

Pedido de Gerson: la tabla tiene mucha historia, comparar los tipos de tabla con animación puede servir, y para las propiedades hay que animar una tabla periódica «sin ahorrar», porque sirve para muchas cosas. De acuerdo en todo, con una precisión: **se gasta en la tabla, no en Rive.**

**Por qué la tabla no va en Rive:**

- Son 118 casillas con texto que se tiene que leer, ampliar y buscar. El texto dentro de Rive no lo lee un lector de pantalla ni se puede seleccionar.
- Cada número de la tabla es un dato (regla 1): sale de un archivo verificado, no de un dibujo.
- Va a tener muchos modos (historia, propiedades, bloques, valencias). En Rive cada modo nuevo se dibuja a mano en el editor; como pieza del kit, es una regla más sobre los mismos datos.
- Lo que hay que animar es mover y hacer crecer cajas. Eso el navegador lo hace con poco costo incluso con 118 a la vez.

**La tabla viva es una pieza mayor del kit, con seis comportamientos:**

| Comportamiento | Qué hace | Para qué sirve |
| --- | --- | --- |
| **Se reordena** | Las mismas cartas pasan de un arreglo a otro: en fila por masa, en tríadas, en octavas, en la tabla de 1869 con sus huecos, en la moderna por número atómico, en bloques | La historia: cada transición muestra qué cambió cada persona |
| **Se levanta** | Cada casilla crece como barra o como círculo según una magnitud: radio, energía de ionización, electronegatividad, afinidad, carácter metálico | Las propiedades periódicas, de un vistazo |
| **Se recorre** | El dedo camina por un periodo o por un grupo y abajo se dibuja el perfil de la propiedad. Al lado, el átomo cambia: un protón más o una capa más | Explicar la tendencia con sus dos factores, carga del núcleo y distancia |
| **Se ilumina** | Metales, no metales y semimetales; bloques; familias; estados de oxidación | Ubicar y clasificar |
| **Responde** | Tocar dos elementos da su diferencia de electronegatividad; tocar varios suma la masa molar | Enlace, mol, nomenclatura |
| **Está siempre a mano** | Se abre desde cualquier pantalla de química, como la tabla de cartulina que pedían en el colegio | Consulta, también sin conexión |

**La lección de historia: el solitario de Mendeléyev.** Mendeléyev trabajó con fichas de los elementos (`docs/investigacion/historia-ganchos.md`; lo del sueño es dudoso). El alumno hace lo mismo:

| Tiempo | Lo que pasa |
| --- | --- |
| 1. Toca | Recibe unas veinte cartas, cada una con su masa, la fórmula de su óxido y si es metal. Las ordena en fila por masa |
| 2. Predice | «Si sigues la fila, ¿cada cuántas cartas vuelve a aparecer un metal que reacciona con el agua?» |
| 3. Prueba y registra | Corta la fila donde las propiedades se repiten y apila los trozos: aparecen las columnas. Queda un hueco debajo del silicio. Con las cartas vecinas estima la masa y la densidad de la que falta |
| 4. Nombra la regla | La app destapa la carta: el germanio, hallado en 1886, contra lo que Mendeléyev anunció en 1871 (masa de unos 72 y densidad de unos 5,5 g/cm³). Regla con fichas: las propiedades se repiten de forma periódica |
| 3 y 4 otra vez | Dos cartas quedan mal por masa: el telurio y el yodo. Al reordenar por número atómico (Moseley, 1913) cada una cae en su columna. La ley periódica moderna ordena por número atómico |
| 5. Transfiere | Un problema de ubicación de formato San Marcos |

Las tríadas de Döbereiner y las octavas de Newlands entran como dos arreglos más de las mismas cartas, cada uno con el punto exacto donde deja de funcionar. Los datos de 1871 y 1886 ya están en el informe de ganchos de historia con su estado de verificación; se revisan otra vez antes de publicarlos.

**La lección de propiedades: caminar por la tabla.** El alumno predice («¿quién es más grande, el sodio o el magnesio?»), camina con el dedo por el periodo y ve el perfil dibujarse. Registra tres tramos y arma la regla. Lo importante es la explicación con dos factores, porque el informe de ideas erróneas dice que los alumnos explican con uno solo (TP7) o con «subcapa llena es estable» (TP5, TP6). Por eso al caminar se ve el átomo: en un periodo entra un protón más y el radio se cierra; al bajar por un grupo entra una capa más.

**El problema del celular, de frente.** La tabla larga tiene 18 columnas. En 360 px de ancho cada casilla mide 20 px y el símbolo no se lee. Propuesta: en el celular la vista de partida es la **tabla plegada**, con los ocho grupos representativos (casillas de unos 45 px), y un pliegue entre el segundo y el tercer grupo que se abre para mostrar los metales de transición. Con el celular echado se ve entera. Hay que probarlo en un celular real antes de construir lo demás.

**Dónde va el gasto «sin ahorrar»:**

- **Los datos.** La escena de hoy (`atomo-y-tabla`) llega hasta el elemento 36 y sus valores se contrastaron solo en parte con fuentes secundarias. Hay que decidir hasta dónde llega (lo que pregunta la admisión son los representativos y la primera serie de transición) y verificar cada valor con una fuente primaria.
- **La carta en tres tamaños:** casilla de 20 px, casilla de 45 px y carta completa.
- **Las transiciones entre arreglos,** que son la lección de historia.

**Unidades que la reutilizan** (por eso conviene hacerla pronto): estructura atómica (los bloques se encienden al llenar la configuración), tabla periódica, enlace (la diferencia de electronegatividad), nomenclatura (estados de oxidación), mol (masa molar), balance, estequiometría, electroquímica, hidrocarburos y materia (elemento contra compuesto). Son diez de las veinte de química.

**Para el repaso:** un calentamiento, «¿dónde vive?»: sale un elemento o una familia y se toca su casilla, un minuto, con racha. Es ruta recordar pura.

**Rive en esta unidad:** ninguno. Si se quiere una viñeta de Mendeléyev con sus fichas para abrir la lección, basta una ilustración quieta.

### 7.4 Enlace químico: la cuerda y los globos

Pedido de Gerson: «se leía aburrido, inventa algo más visual». Lo de antes era «une átomos y gira la molécula». La propuesta nueva cuenta toda la unidad con dos objetos que se entienden sin leer: **una cuerda** (quién atrae más los electrones) y **unos globos** (los pares de electrones que se empujan). Ruta: **descubrir, con apoyo de comparar (D+C)**.

Un cuidado antes de empezar: el informe de ideas erróneas dice que los alumnos creen que los átomos «quieren» completar su octeto (EN2, TP1). Por eso los átomos no llevan cara ni deseos y el texto dice «atrae», nunca «quiere». La cuerda es una fuerza, no una voluntad.

| Acto | Gesto | Qué hace el alumno | Lo que descubre | Idea errónea que ataca |
| --- | --- | --- | --- | --- |
| 1. El valle | **Estirar**: acerca dos átomos de hidrógeno | Mientras los acerca, una bolita recorre una curva de energía que él mismo va dibujando: baja, toca fondo y sube de golpe si los aprieta | El enlace es el fondo del valle. Formarlo suelta energía; romperlo cuesta | TP1: «el octeto da estabilidad por sí solo» |
| 2. La cuerda | Elige dos átomos en la tabla viva y los pone frente a frente | El par de electrones es un nudo en la cuerda. Con H–H queda al centro; con H–Cl se corre hacia el cloro; con Na–Cl pasa entero al otro lado y quedan dos iones. Cada pareja probada queda marcada en una regla de diferencia de electronegatividad | No hay tres enlaces sino una sola escala: apolar, polar e iónico son zonas de la misma regla | EN5: clasificar el enlace al revés; TP8: «electronegativo es tener carga negativa» |
| 2b. La red | **Soltar** más iones | Suelta más sodios y cloros: no forman parejas, se acomodan alternados en una red | El cloruro de sodio no tiene moléculas: cada ion atrae a todos sus vecinos | EN1: «el NaCl está hecho de moléculas» |
| 3. Los globos | **Poner fichas**: agrega globos al átomo central | Cada globo es un par de electrones. Al agregar uno, todos se reacomodan solos lo más lejos posible: dos en línea, tres en triángulo, cuatro en tetraedro. Después cambia un globo por un par libre: el arreglo sigue y el nombre de la forma cambia | La forma no se memoriza: sale de que los pares se repelen. La molécula se gira para verla | EN8: leer la geometría del dibujo plano; EN9: los pares libres «no cuentan» |
| 4. El equipo | **Girar** la molécula | Cada enlace polar es una cuerda que jala el átomo central. Gira la molécula y mira si los tirones se anulan: CO₂ contra H₂O, CCl₄ contra CH₂Cl₂. Prueba final: acerca una regla cargada a un chorrito de cada líquido | Polar es tener enlaces polares que no se anulan en tres dimensiones. Hacen falta las dos condiciones | EN10 y EN11: polaridad leída en el dibujo plano o con un solo factor |
| 5. Lo que se pega | **Calentar** y golpear | Calienta agua, H₂S y metano: las moléculas se separan enteras, las cuerdas de adentro no se rompen. Registra a qué temperatura hierve cada uno. Después golpea un cristal de sal y un trozo de metal, y les acerca el foco | Hervir separa moléculas, no rompe enlaces. La sal se parte, el metal se dobla, y la sal conduce solo fundida o disuelta | EN13 y EN14: «al hervir se rompen los enlaces covalentes» |

Lewis, resonancia e hibridación son procedimientos: van como **ejemplo que se completa** (ruta E) dentro de los actos 2 y 3. En resonancia, ojo con la animación: el informe dice que los alumnos creen que la molécula cambia de forma (EN6). No se animan átomos moviéndose; se muestra la nube repartida por igual.

Lo que la hace visual:

- **Profundidad de verdad.** En los actos 3 y 4 la forma es el argumento, así que aquí sí hace falta volumen: lo de atrás se ve más chico y más oscuro y lo de adelante lo tapa. Es el único lugar de esta auditoría donde «se ve plano» se arregla con profundidad.
- **Respuesta física.** Los globos se empujan y se asientan; la cuerda se tensa. Son posiciones que calcula el motor: los ángulos solo se rotulan cuando todo está quieto.
- **Un hilo entre actos.** La cuerda del acto 2 es la misma del acto 4 y la que no se rompe en el acto 5.

Costos y límites:

- **Son tres sesiones,** no una: actos 1 y 2, acto 3 y actos 4 y 5.
- **Rive:** solo utilería que ya existe (el foco, el mechero y el gotero para el chorrito). La nube, la cuerda y los globos se calculan y los dibuja el kit. Una nube con bordes suaves en Rive pide difuminado, que es justo lo que se descartó para gama baja.
- **Hay que verificar** la curva del acto 1, los valores de electronegatividad y los puntos de ebullición contra fuentes primarias, y decidir qué escala de electronegatividad se usa (la que use el examen).
- **Que formar el enlace suelta energía** como idea errónea frecuente no está en el informe del repo: se busca su fuente antes de usarla como argumento.

## 8. El temario completo: las 152 unidades

Cómo leer las tablas:

- **Hoy:** A = ya se arrastra algo de la figura; D = el control es un deslizador; B = solo botones; G = no tiene escena, solo práctica o lectura. Sale del barrido de la sección 2.
- **Ruta:** la ruta principal y la de apoyo (sección 5.3). D = descubrir, E = seguir un ejemplo, C = comparar, R = recordar, A = argumentar.
- **Gesto:** el gesto principal de la unidad, del vocabulario de la sección 5.2. En las rutas E, C, R y A el gesto acompaña; no es el centro de la lección.
- **Lo que descubre:** la relación que el alumno tiene que poder decir después de sus ensayos. Son propuestas para discutir con Gerson, no contenido verificado: cada una se contrasta con el motor y con el informe de ideas erróneas de su tema antes de construirla.
- **Rive:** la utilería o el personaje de la sección 6.2. Una raya quiere decir kit y mascota, nada más.

### Física (20)

| # | Unidad | Hoy | Ruta | Gesto | Lo que descubre haciéndolo | Rive |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | Magnitudes y vectores | D | D+R | Estirar: mueve la punta de cada flecha y júntalas cola con punta | La resultante depende del ángulo: va desde la resta hasta la suma de los módulos | — |
| 2 | MRU, MRUV y caída libre | D | D+E | Soltar: empuja el carrito con el dedo y pisa el freno | La gráfica v–t la dibuja su propio movimiento, y el área es lo que avanzó | Carrito |
| 3 | Movimiento parabólico y circular | D | D+E | Lanzar: jala la honda y suelta; gira la rueda con el dedo | 30° y 60° caen en el mismo punto; la sombra horizontal avanza parejo | Pelota |
| 4 | Estática | A | D+E | Colgar: cuelga pesas en la barra y mueve el apoyo | Lo que equilibra es peso por distancia, no el peso | — |
| 5 | Dinámica | D | D+E | Colgar y soltar: jala el bloque con una cuerda; inclina el plano | La fuerza neta manda sobre la aceleración, no sobre la velocidad | Bloque |
| 6 | Gravitación universal | D | D+R | Lanzar: suelta el satélite con más o menos rapidez | Hay una sola rapidez que cierra la órbita; más lejos, más lento | Satélite |
| 7 | Trabajo, energía y potencia | D | D+E | Soltar: sube el carrito a la rampa y cámbiale la forma | La rapidez abajo depende de la altura, no del camino | Carrito |
| 8 | Impulso y choques | D | D+E | Lanzar: manda dos carritos uno contra otro | La suma de m·v no cambia aunque la energía sí | Carrito |
| 9 | Movimiento armónico simple | D | D+R | Estirar y soltar: jala la masa del resorte o el péndulo | Estirar más no cambia el período | Pelota (el resorte es del motor) |
| 10 | Ondas mecánicas y sonido | D | D+R | Estirar: sacude el extremo de la cuerda con el dedo y ténsala | La mano decide la frecuencia; la cuerda, la rapidez | — |
| 11 | Fluidos | D | D+E | Verter: llena vasos de formas distintas; hunde el bloque con el dedo | La presión depende de la profundidad; el empuje, de lo que se hunde | Vaso |
| 12 | Temperatura y calor | D | D+E | Verter y calentar: mezcla dos vasos; acerca el mechero al hielo | La temperatura final no es el promedio; en el cambio de fase entra calor y T no sube | Vaso y mechero |
| 13 | Termodinámica | D | D+E | Apretar: empuja el émbolo rápido o lento, con mechero o sin él | El trabajo es el área que él mismo dibuja en P–V | Émbolo y mechero |
| 14 | Electrostática | B | D+E | Estirar: acerca una carga a otra que cuelga | Las dos fuerzas son iguales aunque las cargas no lo sean | — |
| 15 | Corriente y circuitos | D | D+E | Conectar: arma el circuito con el dedo y saca un foco | En serie se reparten el voltaje; en paralelo cada foco brilla igual | Foco y pila |
| 16 | Campo y fuerza magnética | B | D+C | Girar: pasea la brújula alrededor del cable; lanza la carga | La carga quieta no siente nada; la fuerza va de costado | Imán y brújula |
| 17 | Inducción electromagnética | B | D+C | Estirar: mete y saca el imán de la espira, rápido o lento | El foquito prende solo mientras el flujo cambia | Imán y foco |
| 18 | Ondas electromagnéticas | D | C+R | Ordenar: recorre el espectro; cruza el rayo a otro medio | Todas viajan a c; al cambiar de medio cambia λ, no f | — |
| 19 | Óptica geométrica | A | D+E | Estirar: mueve el objeto y la lente; dobla la hoja en el espejo | La imagen cambia de lado al cruzar el foco | — |
| 20 | Física moderna | D | D+R | Girar: dos perillas en la lámpara, una para el color y otra para el brillo | El brillo da más electrones; el color, más energía; bajo el umbral no sale nada | Foco |

### Química (20)

| # | Unidad | Hoy | Ruta | Gesto | Lo que descubre haciéndolo | Rive |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | Materia y energía | B | D+C | Cortar y calentar: parte la muestra y vuelve a medir; hazle algo y mírala con la lupa (sección 7.2) | Unas propiedades dicen cuánto hay y otras qué es; en un cambio físico las partículas son las mismas | Vaso y mechero |
| 2 | Estructura atómica | B | E+R | Poner fichas: llena los orbitales con electrones | El orden de llenado sale de «primero el más barato» | — |
| 3 | Tabla periódica | B | D+R | Ordenar y estirar: acomoda las cartas por masa y córtalas donde se repiten; después camina por la tabla (sección 7.3) | Las propiedades se repiten cada cierto número de elementos, y eso permite predecir el que falta | — (la tabla viva es del kit) |
| 4 | Enlace químico | B | D+C | Estirar y poner fichas: acerca dos átomos y mira quién atrae más el par; agrega globos al átomo central (sección 7.4) | El tipo de enlace es una sola escala de atracción; la forma sale de pares que se repelen | Foco, mechero y gotero |
| 5 | Nomenclatura inorgánica | B | E+R | Clasificar y poner fichas: cruza las cargas | El nombre sale del estado de oxidación | — |
| 6 | Mol y composición | D | D+E | Pesar: echa cucharadas a la balanza hasta juntar un mol | Un mol de cada sustancia pesa distinto y cuenta lo mismo | — (balanza del kit) |
| 7 | Reacciones y balance | B | E+D | Poner fichas: agrega moléculas enteras a cada lado | Se cambian los coeficientes, nunca los subíndices | — |
| 8 | Estequiometría | D | D+E | Poner fichas: junta 1 N₂ con 3 H₂ hasta que algo se acabe | El limitante es el que se acaba primero, no el que hay menos | — |
| 9 | Estado gaseoso | D | D+E | Apretar y calentar: empuja el émbolo; acerca el mechero | Con T fija, P por V no cambia; con calor, los choques son más fuertes | Émbolo y mechero |
| 10 | Líquidos y sólidos | D | D+C | Calentar: calienta el frasco, tápalo, súbelo de altitud | Hierve cuando su vapor iguala la presión de afuera | Vaso y mechero |
| 11 | Soluciones | B | D+E | Verter: echa soluto, agrega agua, pasa una parte a otro vaso | Diluir no cambia los moles; sacar una parte no cambia la concentración | Vaso y gotero |
| 12 | Cinética química | D | D+C | Calentar: calienta, muele y agita | Qué acelera la reacción y por qué: más choques que sirven | Vaso y mechero |
| 13 | Equilibrio químico | D | D+C | Verter, apretar y calentar un sistema en equilibrio | El sistema responde en contra; K solo cambia con la temperatura | Vaso, émbolo y mechero |
| 14 | Ácidos y bases | D | D+E | Verter y gotear: diluye; neutraliza gota a gota | Diluir 10 veces sube 1 de pH; la neutralización es un salto | Vaso y gotero |
| 15 | Electroquímica | B | D+E | Conectar: arma la pila, pon el puente salino, cambia los metales | Quién se oxida lo decide la pareja; sin puente no hay corriente | Vaso y foco |
| 16 | Hidrocarburos | A | E+C | Conectar: arma la cadena carbono por carbono | El nombre sale de la cadena más larga; mismos átomos, otra molécula | — |
| 17 | Funciones orgánicas | A | C+R | Cortar y armar: quita un H y pon el grupo | El grupo decide la familia y cuánto se pegan las moléculas | — |
| 18 | Biomoléculas | A | C+R | Conectar: junta dos piezas y sale agua | Toda unión suelta agua; la hidrólisis la devuelve | — |
| 19 | Petróleo y recursos naturales | D | R+C | Calentar: destila subiendo la temperatura | Cada fracción sale a su temperatura | Mechero |
| 20 | Contaminación y química aplicada | D | R+C | Gotear y clasificar: mide el pH de la lluvia; ordena contaminantes | Qué gas causa qué efecto | Vaso y gotero |

### Aritmética (19)

| # | Unidad | Hoy | Ruta | Gesto | Lo que descubre haciéndolo | Rive |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | Lógica proposicional | B | E+C | Conectar: prende interruptores en serie y en paralelo | «Y» es serie, «o» es paralelo; el condicional solo falla en un caso | Foco |
| 2 | Conjuntos | B | D+E | Poner fichas en los aros | Lo que está en la intersección se cuenta una vez | — |
| 3 | Razones y proporciones | A | D+E | Estirar la tira | Al ampliar, la razón se conserva y la diferencia no | — |
| 4 | Magnitudes proporcionales | A | D+E | Estirar un lado del taller de área fija | En la inversa, el producto no cambia | — |
| 5 | Tanto por ciento | G | D+E | Cortar la barra (ya existe en la práctica viva) | El segundo descuento se aplica a lo que queda | — |
| 6 | Interés y descuento | A | D+E | Poner fichas: agrega una capa por año | El compuesto gana interés sobre el interés | — |
| 7 | Mezclas y aleaciones | B | D+E | Verter: junta dos vasos de precio o grado distinto | El promedio se acerca al que más cantidad puso | Vaso |
| 8 | Estadística descriptiva | A | D+C | Estirar: mueve un dato del diagrama | Un dato extremo jala la media y no la mediana | — |
| 9 | Análisis combinatorio | B | C+E | Ordenar fichas en casilleros | Si el orden no importa, varios arreglos son el mismo | — |
| 10 | Probabilidades | B | D+C | Marcar los casos en la cuadrícula de los dos dados | El 7 sale más porque tiene más casillas | — |
| 11 | Sistemas de numeración | B | E+D | Poner fichas: agrupa de a b | Cambiar de base es reagrupar las mismas fichas | — |
| 12 | Las cuatro operaciones | B | E+R | Poner fichas y llevar | La llevada es un grupo que se muda de columna | — |
| 13 | Divisibilidad | B | E+R | Poner fichas en filas iguales | El resto es lo que no entra en la última fila | — |
| 14 | Números primos y divisores | B | D+R | Cortar y armar: haz rectángulos con n fichas | Un primo solo arma una fila | — |
| 15 | MCD y MCM | A | E+D | Cortar cintas; soltar dos buses | El MCD es el corte más grande que sirve a las dos | — |
| 16 | Números racionales | A | D+E | Cortar la barra | Dos fracciones equivalentes son el mismo corte | — |
| 17 | Potenciación y radicación | B | E+R | Poner fichas: arma el cuadrado | Para pasar al cuadrado siguiente faltan 2k + 1 fichas | — |
| 18 | Sucesiones y series | A | D+E | Poner fichas: agrega una fila a la figura | Lo que se agrega en cada paso es la razón | — |
| 19 | Razonamiento numérico | B | E+C | Poner fichas: cambia una por otra | Cada cambio corrige una diferencia fija | — |

### Álgebra (19)

| # | Unidad | Hoy | Ruta | Gesto | Lo que descubre haciéndolo | Rive |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | Lógica, conjuntos y juegos lógicos | B | E+C | Conectar interruptores; poner fichas en aros | Lo mismo que en aritmética 1 y 2 | Foco |
| 2 | Números reales e intervalos | B | C+E | Estirar los extremos de dos intervalos | Unión e intersección se ven; el extremo abierto no se alcanza | — |
| 3 | Exponentes y productos notables | A | D+R | Cortar y armar el cuadrado de lado a + b | Además de a² y b² hay dos rectángulos | — |
| 4 | Ecuaciones de 1.º y 2.º grado | A | E+D | Pesar: quita lo mismo de los dos platillos | Lo que se hace a un lado se hace al otro | — |
| 5 | Inecuaciones | A | E+C | Reflejar: voltea la recta al multiplicar por −1 | El signo se invierte porque la recta se refleja | — |
| 6 | Valor absoluto y radicales | A | C+E | Estirar: abre un compás desde el centro | El valor absoluto es una distancia | — |
| 7 | Polinomios | A | E+R | Poner fichas en la máquina, con el cero que falta | El resto es la altura P(a) en la curva | — |
| 8 | División de polinomios | A | E+R | Poner fichas en la máquina de Ruffini | Con divisor ax + b, el cociente sale multiplicado | — |
| 9 | Factorización | A | E+C | Cortar y armar: haz un rectángulo con las piezas | Factorizar es hallar los lados | — |
| 10 | Ecuaciones polinomiales | A | E+D | Estirar: mueve las raíces sobre el eje | La suma y el producto de las raíces son los coeficientes | — |
| 11 | Funciones y sus gráficas | A | D+C | Girar las perillas | Cada perilla mueve la gráfica de una sola manera | — |
| 12 | Tipos de funciones e inversa | A | D+C | Doblar el plano por y = x | La inversa es el reflejo; 1/f es otra cosa | — |
| 13 | Exponenciales y logaritmos | A | D+R | Poner fichas: sube la escalera multiplicando | El logaritmo cuenta los escalones | — |
| 14 | Números complejos | D | D+E | Girar la flecha | Multiplicar por i gira 90° | — |
| 15 | Matrices y determinantes | B | E+D | Estirar las dos columnas | El determinante es el área con signo | — |
| 16 | Sistemas de ecuaciones | A | E+D | Girar dos rectas | Una solución, ninguna o infinitas se ven | — |
| 17 | Programación lineal | D | D+E | Estirar: desliza la recta de nivel con el dedo | El óptimo sale por un vértice | — |
| 18 | Sucesiones y series | A | D+E | Poner fichas: agrega filas | La suma se ve como figura | — |
| 19 | Binomio de Newton | D | E+R | Soltar bolitas en el tablero | Cada coeficiente cuenta caminos | — |

### Geometría (18)

| # | Unidad | Hoy | Ruta | Gesto | Lo que descubre haciéndolo | Rive |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | Segmentos y ángulos | B | D+R | Girar la secante sobre las paralelas | Los ocho ángulos son solo dos valores | — |
| 2 | Triángulos y líneas notables | A | D+C | Estirar el vértice | La altura sale fuera en el obtusángulo | — |
| 3 | Congruencia | B | C+D | Cortar y armar: arma el triángulo con palitos y ángulos | Con LLA pueden salir dos triángulos | — |
| 4 | Polígonos y cuadriláteros | A | C+D | Estirar los vértices | El nombre cambia cuando cambia una propiedad | — |
| 5 | Circunferencia | A | D+R | Estirar el vértice sobre el arco | El inscrito no cambia: es la mitad del central | — |
| 6 | Proporcionalidad y semejanza | A | D+E | Estirar: amplía la figura | El área crece con k² y el volumen con k³ | — |
| 7 | Puntos notables | A | D+C | Estirar el vértice | Los cuatro puntos coinciden solo en el equilátero | — |
| 8 | Relaciones métricas | A | D+E | Cortar y armar los cuadrados de los lados | Pitágoras es una igualdad de áreas | — |
| 9 | Polígonos regulares | A | D+R | Girar: da la vuelta al polígono lado por lado | Los ángulos exteriores suman una vuelta | — |
| 10 | Simetría | B | D+C | Reflejar: mueve el espejo | Dos reflexiones dan un giro o un traslado | — |
| 11 | Áreas de regiones | A | D+E | Estirar el vértice en paralelo a la base | El área no cambia entre paralelas | — |
| 12 | Longitud y áreas circulares | A | D+E | Girar: desenrolla la circunferencia; reacomoda los gajos | π es cuántos diámetros caben en la vuelta | — |
| 13 | Rectas y planos en el espacio | A | C+D | Girar el cubo | Tres perpendiculares se ven al girar | — |
| 14 | Poliedros | A | D+R | Doblar: despliega y vuelve a armar | Caras más vértices menos aristas da 2 | — |
| 15 | Prisma y pirámide | A | D+E | Verter: llena el prisma con pirámides | La pirámide es un tercio del prisma | — |
| 16 | Cilindro, cono y esfera | A | D+E | Girar la figura plana para generar el sólido | Tres conos llenan el cilindro | — |
| 17 | Geometría analítica | A | E+D | Estirar puntos; tensar la cuerda del jardinero | La pendiente; la suma de distancias constante | — |
| 18 | Razonamiento con figuras | B | E+C | Marcar cada figura que encuentre | Se cuenta por clases, no una por una | — |

### Trigonometría (19)

| # | Unidad | Hoy | Ruta | Gesto | Lo que descubre haciéndolo | Rive |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | Ángulo trigonométrico y sistemas | A | D+R | Girar: enrolla la cinta del radio | Un radián es un radio enrollado | — |
| 2 | Longitud de arco y sector | A | D+E | Girar: haz rodar la rueda | El arco es ángulo por radio | — |
| 3 | Razones de ángulos agudos | A | D+R | Estirar el triángulo sin cambiar el ángulo | La razón no depende del tamaño | — |
| 4 | Resolución de triángulos rectángulos | A | E+D | Girar la línea de mira | Con un lado y un ángulo sale todo | — |
| 5 | Plano cartesiano y la recta | A | D+E | Girar la recta | La pendiente es la tangente del ángulo | — |
| 6 | Ángulos en posición normal | A | D+R | Girar el lado final | El signo lo decide el cuadrante | — |
| 7 | Reducción al primer cuadrante | A | E+R | Reflejar el ángulo | Mismo valor; cambia el signo | — |
| 8 | Circunferencia trigonométrica | A | D+R | Girar el punto | El seno es la altura y el coseno, la sombra | — |
| 9 | Identidades fundamentales | A | E+R | Girar y mirar las áreas | sen² más cos² siempre arma el mismo cuadrado | — |
| 10 | Suma y diferencia de ángulos | A | E+R | Girar dos veces seguidas | El seno de la suma no es la suma de los senos | — |
| 11 | Ángulo doble, mitad y triple | A | E+R | Girar el doble | Duplicar el ángulo no duplica el seno | — |
| 12 | Transformaciones y series | B | E+R | Estirar dos flechas en la circunferencia | La suma apunta a la semisuma | — |
| 13 | Funciones trigonométricas | A | D+C | Girar el punto y desenrollar la gráfica | El período es una vuelta | — |
| 14 | Funciones inversas | B | C+D | Estirar la ventana principal | Solo un corte cae dentro de la ventana | — |
| 15 | Ecuaciones trigonométricas | A | E+D | Girar hasta que la altura valga k | Hay dos ángulos por vuelta | — |
| 16 | Triángulos oblicuángulos | A | D+E | Girar el compás | Con LLA salen cero, uno o dos triángulos | — |
| 17 | Áreas y líneas notables | A | E+D | Estirar un lado y el ángulo | El área es medio producto de dos lados por el seno | — |
| 18 | Lugar geométrico y cónicas | D | D+C | Estirar: tensa la cuerda con el dedo | La suma de distancias a los focos no cambia | — |
| 19 | Coordenadas polares y complejos | D | D+E | Girar el radar | Un r negativo cruza por el polo | — |

### Razonamiento matemático (19)

| # | Unidad | Hoy | Ruta | Gesto | Lo que descubre haciéndolo | Rive |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | Deductivo y parentesco | A | E+A | Conectar: arma el árbol familiar | Solo una disposición cumple todas las pistas | — |
| 2 | Trazos y perímetros | A | D+E | Conectar: traza sin levantar el dedo | Se puede con cero o dos vértices impares | Hormiga |
| 3 | Ordenamiento de información | A | E+A | Ordenar fichas en la fila o en la mesa | Cada pista descarta posiciones | — |
| 4 | Verdades y mentiras | A | A+E | Clasificar: voltea a cada personaje | Se supone, y la contradicción decide | — |
| 5 | Traslados y puntos cardinales | B | D+E | Conectar: guía la combi por las cuadras | El desplazamiento no es lo caminado | Combi |
| 6 | Arreglos numéricos | B | D+E | Poner fichas en el cuadrado | El centro es la suma mágica entre 3 | — |
| 7 | Razonamiento inductivo | A | D+E | Poner fichas: agrega una fila y cuenta | El patrón sale de tres casos chicos | — |
| 8 | Elementos recreativos | B | D+C | Girar el dado; mover palitos | Las caras opuestas suman 7 | — |
| 9 | Relojes y calendarios | B | E+D | Girar el minutero | El horario también avanza | — |
| 10 | Certezas | A | D+A | Soltar: saca bolas en el peor caso | La certeza llega con el peor caso más uno | — |
| 11 | Frecuencia de sucesos | B | D+E | Soltar las combis del paradero | Coinciden en el MCM; hay un intervalo menos que sucesos | Combi |
| 12 | Ruedas, poleas y engranajes | A | D+E | Girar la rueda con el dedo | Dientes por vueltas se conserva | — |
| 13 | Máximos y mínimos | B | D+C | Estirar el cordel | Con el mismo cordel, el cuadrado encierra más | — |
| 14 | Cortes, pesadas y balanzas | B | D+E | Cortar con la sierra; pesar | Hay un corte menos que pedazos | — (balanza del kit) |
| 15 | Planteo de ecuaciones | A | E+D | Pesar y poner fichas: traduce el enunciado | Cada frase es una operación sobre la balanza | — |
| 16 | Movimiento de figuras | A | C+D | Girar, voltear y rodar | Girar no es voltear | — |
| 17 | Rutas y visualización espacial | A | D+C | Girar los cubitos; conectar aristas | Lo que no se ve se deduce de dos vistas | Hormiga |
| 18 | Tablas, gráficos y suficiencia | B | A+C | Estirar el eje del gráfico | Un eje cortado exagera la diferencia | — |
| 19 | Diagramas de flujo y operadores | G | E+D | Soltar un número por el diagrama | El operador es una máquina con una sola regla | — |

**Más formas de explicar cada unidad** (pedido de Gerson, 13 nov: «hay muchas formas de explicar un tema»). En razonamiento matemático casi ningún problema tiene un solo camino, y eso es parte de lo que se enseña. La columna «Gesto» de arriba da la entrada principal; esta tabla da las otras entradas, para el botón «explícamelo de otra forma» de la sección 5.6. Son propuestas para ampliar.

| # | Unidad | Otras formas de explicarla |
| --- | --- | --- |
| 1 | Deductivo y parentesco | Armar el árbol familiar · Cuadro de doble entrada con descarte · «Una persona, varios papeles» (padre e hijo a la vez) para hallar el mínimo de personas |
| 2 | Trazos y perímetros | Contar cuántas líneas llegan a cada vértice (pares e impares) · Probar con el dedo y ver dónde se traba · La historia de los puentes de Königsberg · Para perímetros: correr los lados de la escalera hasta formar un rectángulo |
| 3 | Ordenamiento de información | Fichas en una fila o alrededor de la mesa · Cuadro de doble entrada · Empezar por la pista que fija más (el dato ancla) · Probar un caso y descartar |
| 4 | Verdades y mentiras | Suponer y buscar la contradicción · Tabla de quién dice qué · Buscar dos frases que se contradicen: una es verdad y la otra no · Personajes que se voltean |
| 5 | Traslados y puntos cardinales | Camino sobre la cuadrícula · Sumar por separado norte-sur y este-oeste · La flecha del inicio al final (Pitágoras) · El plano de una ciudad conocida |
| 6 | Arreglos numéricos | Suma total entre el número de filas · Parejas que suman lo mismo · Girar y reflejar el cuadrado para ver que es el mismo · Contar dos veces las casillas de las esquinas |
| 7 | Razonamiento inductivo | Tres casos chicos en una tabla · La figura que crece: mirar qué se agrega · Contar lo mismo de dos maneras · Proponer la fórmula y probarla con el caso 4 |
| 8 | Elementos recreativos | El dado desplegado en cruz · Palitos: mover uno y contar · Buscar lo que no cambia (pares e impares) · Resolver de atrás hacia adelante |
| 9 | Relojes y calendarios | Las agujas como dos corredores en una pista redonda · Tabla de adelanto y atraso por hora · Calendario: el resto de dividir entre 7 · Línea de tiempo |
| 10 | Certezas | El peor caso: la mala suerte máxima y uno más · Casilleros y palomas · Jugar contra alguien que siempre te da lo peor · Tabla de lo que ya salió |
| 11 | Frecuencia de sucesos | Línea de tiempo con marcas: hay un intervalo menos que marcas · MCM para saber cuándo coinciden · Campanadas: se cuentan los silencios, no los golpes · Dos tiras de papel con marcas |
| 12 | Ruedas, poleas y engranajes | Contar los dientes que pasan por el contacto · Proporción inversa entre dientes y vueltas · Sentido de giro: ruedas pares e impares de la cadena · Misma faja, misma rapidez en el borde |
| 13 | Máximos y mínimos | Tabla de valores y buscar el pico · Con el mismo cordel, comparar figuras · El reflejo para el camino más corto · Completar cuadrados · Probar los casos extremos |
| 14 | Cortes, pesadas y balanzas | Cortar de verdad: en una soga, un corte menos que pedazos; en un aro, igual número · Estacas en fila · La balanza tiene tres resultados: por eso salen potencias de 3 · Doblar antes de cortar |
| 15 | Planteo de ecuaciones | La balanza · Barras o segmentos para cada cantidad · Cuadro de antes, ahora y después (edades) · Falsa suposición · La ecuación al final |
| 16 | Movimiento y comparación de figuras | Papel calco que gira · Marcar una esquina y seguirla · El espejo: voltear cambia la mano de la figura · Rodar con una marca para contar vueltas |
| 17 | Rutas y visualización espacial | Sumar en cada cruce los caminos que llegan · Tres vistas: frente, lado y arriba · Desarmar el cubo por capas · Desplegar la caja para el camino de la hormiga |
| 18 | Tablas, gráficos y suficiencia de datos | Leer primero los ejes y las unidades · Pasar el gráfico a tabla · Suficiencia: probar con cada dato solo y luego con los dos · Fabricar un caso donde el dato no alcanza |
| 19 | Diagramas de flujo y operadores | La máquina de entrada y salida · Seguir un número con el dedo · Tabla de pasadas cuando hay un ciclo · El operador como receta que se aplica dos veces |

### Razonamiento verbal (18)

Aquí el modelo es el texto y no hay fenómeno que animar. El gesto se hace sobre las palabras y Rive se limita a la mascota. El POGIL v2 de este curso es de lectura: el alumno marca, mueve o tacha, y el texto «responde» mostrando qué se sostiene y qué se cae.

| # | Unidad | Hoy | Ruta | Gesto | Lo que descubre haciéndolo |
| --- | --- | --- | --- | --- | --- |
| 1 | Definiciones | G | C+R | Poner fichas: género y diferencia | Una definición buena deja fuera a los parecidos |
| 2 | Analogías | G | C+A | Conectar pares y nombrar la relación con una ficha | Se compara la relación, no las palabras |
| 3 | Sentido contextual | G | C+A | Poner fichas: cambia la palabra y relee | El contexto decide cuál acepción aguanta |
| 4 | Conectores | G | C+E | Poner fichas entre dos ideas | El conector dice qué relación hay: causa, contraste o suma |
| 5 | Eliminación de oraciones | G | A+C | Marcar: tacha una oración y relee | Sobra la que repite o se sale del tema |
| 6 | Plan de redacción | G | E+A | Ordenar tarjetas | El orden va de lo general a lo particular o sigue el tiempo |
| 7 | Cohesión y coherencia | G | E+C | Conectar cada pronombre con su referente | Un texto se sostiene por sus referencias |
| 8 | El texto y sus tipos | G | C+R | Clasificar párrafos | El tipo lo delata el propósito, no el tema |
| 9 | Tema e idea principal | G | A+C | Marcar: tapa una oración y mira si el texto se cae | La idea principal es la que no se puede quitar |
| 10 | Resumen y síntesis | G | E+A | Marcar: tacha hasta dejar lo mínimo | Resumir es quitar sin cambiar lo que se afirma |
| 11 | Textos discontinuos | G | E+A | Marcar en el gráfico de dónde sale el dato | La respuesta está en el cruce de fila y columna |
| 12 | Inferencias | G | A+E | Marcar las dos frases que sostienen la conclusión | Inferir es unir dos cosas dichas, no adivinar |
| 13 | Compatibilidad | G | C+A | Clasificar: lo dice, lo contradice o no lo dice | «No lo dice» no es «lo niega» |
| 14 | Extrapolación | G | A+C | Poner fichas: cambia una condición del texto | Qué conclusión cambia y cuál se mantiene |
| 15 | Argumentativos y dialécticos | G | A+C | Clasificar: tesis, argumento y contraargumento; quién lo dice | Dos autores pueden coincidir en el dato y no en la tesis |
| 16 | Texto y contexto | G | A+C | Ordenar: sitúa el texto en su línea de tiempo | El sentido cambia con quién habla y cuándo |
| 17 | Filosóficos y científicos | G | A+E | Marcar el término y armar su definición con el texto | El autor define sus palabras al usarlas |
| 18 | Lectura en inglés | G | R+A | Conectar la palabra con su pista de contexto | El significado se saca de lo que la rodea |

## 9. Orden de trabajo y cómo se comprueba

Una variable por versión, como pide el skill. Cada versión tiene una decisión al final; si la respuesta es no, no se pasa a la siguiente.

| Versión | Qué cambia | Qué se mide | Decisión |
| --- | --- | --- | --- |
| **0. Estrés de Rive** | Nada de la app: una página de prueba con 1, 2 y 3 animaciones, chicas y grandes, siguiendo el dedo | Cuadros por segundo y memoria en el celular de 4 GB | El presupuesto real de la sección 6.3 |
| **A. Ácidos y bases con POGIL v2, sin Rive** | Los cinco tiempos, el gesto de verter y los registros, con el vaso en SVG del kit | Que la figura y la tarea quepan en una pantalla; palabras antes del primer toque; duración de un ensayo; que cinco alumnos cuenten qué hicieron | ¿El modelo de lección funciona? Esto no depende de Rive |
| **B. La misma unidad con utilería Rive** | Solo el vaso, la jarra y la bureta pasan a Rive | Cuadros por segundo contra A; preferencia y comprensión contra A con otros cinco alumnos | ¿Rive agrega algo que justifique su costo de producción? |
| **C. Una unidad de física y una de matemática** | MRUV con el carrito; `triangulo-estira`, que ya se arrastra, solo con registros y regla | Lo mismo que A | ¿El modelo aguanta fuera de la química? |
| **R. Cola de repaso** (en paralelo, no depende de las otras) | La app programa preguntas cortas de las unidades ya hechas, en días distintos | Aciertos en el repaso de la semana contra los del día | ¿El repaso cambia lo que el alumno recuerda? Se puede probar en el piloto con las escenas de hoy |
| **T. La tabla viva** (en paralelo) | Primero solo la tabla plegada en el celular y el reordenamiento de las cartas | Que el símbolo se lea a 360 px; cuadros por segundo al reordenar | ¿Se construye la pieza completa? La reutilizan diez unidades de química |
| **P. Avance en cuatro niveles** (después de R) | La barra del curso deja de contar unidades vistas y muestra los cuatro niveles de 5.7 | Que un alumno pueda decir qué le falta | ¿Los niveles le sirven al alumno y al profesor? |
| **S. Pregunta de seguridad** (después de R) | «¿Qué tan seguro estás?» en la práctica y el repaso, y la regla de 5.8 | Si los alumnos la contestan con sinceridad y si la calibración mejora | ¿Se lleva a las pruebas de entrada y salida? |
| **Los ocho puentes** (después de C) | Una unidad puente por curso con su ficha completa y sus prerrequisitos | Si el desvío corto arregla el fallo de base | El modelo editorial para las 152 |
| **D. Escalar** | Física y química primero, por utilería compartida: las que usan vaso y mechero, después carrito, después foco | Pruebas de entrada y salida | Con tope de gasto por rutina, como siempre |

**Guion para probar con un alumno** (sin anticiparle nada): se le da el celular con la unidad abierta y al terminar se le pregunta, en este orden: «¿Qué pasó?», «¿Qué hiciste tú?», «¿Cuándo lo entendiste?», «Si ahora tuvieras 1 L, ¿qué pH marcaría?». Se anota lo que intentó tocar y no respondía: eso dice qué gesto esperaba.

**Qué se mide, en tres partes:** comprensión (los ítems de transferencia), resolución sin pistas (el problema del tiempo 5 que hace solo) y retención (el repaso de la semana siguiente). La app mide hoy las dos primeras con las pruebas de entrada y salida; la tercera llega con la cola de repaso. Cuánto le gustó la animación no cuenta como resultado.

**La hipótesis de fondo y su prueba.** Hipótesis: en una misma unidad, POGIL v2 da mejor resultado en los ítems de transferencia que el paso a paso de hoy. La app ya tiene con qué comprobarlo: pruebas de entrada y salida con formas paralelas y ganancia de Hake. En el piloto, una sección usa la versión de hoy y otra la v2 de la misma unidad. Con un colegio y dos secciones el resultado es una señal, no una prueba.

**Lo que conviene decidir antes del piloto de diciembre.** El rediseño completo no entra. Entra la versión A, quizá la B. Lo demás del piloto va con las escenas de hoy, que funcionan.

## 10. Riesgos y lo que no se verificó

- **Costo de producción.** Cada utilería es dibujo y animación a mano en el editor de Rive, más su contrato, su respaldo SVG y su prueba de fidelidad. Quince archivos bien hechos son varias semanas de alguien. Existe además la línea de comandos de Rive, con la que un agente escribe la escena como texto; desde este entorno no se pudo probar porque el servidor de descarga está bloqueado.
- **Plan de Rive.** El plan gratis exporta con la pantalla de inicio de Rive. Para producción hace falta Cadet (108 USD al año según su documentación; confirmar en su web). Hay que confirmar también que el enlace de datos funciona en el runtime 2.50.0 que ya está en `app/vendor/rive/`.
- **El gesto puede volverse un juguete.** Verter es divertido; si el alumno vierte veinte veces y no llega a la regla, el gesto se comió la lección. Por eso los ensayos son 3 o 4 y la regla es un tiempo aparte.
- **Detalles seductores.** Toda utilería nueva tiene que contestar: «si se quita, ¿qué se pierde?». Si la respuesta es «se ve menos bonito», no entra.
- **Accesibilidad.** Un gesto que solo se puede hacer arrastrando deja fuera a alumnos y a las PC sin pantalla táctil del laboratorio. La alternativa sin arrastrar no es opcional.
- **Tiempo por unidad.** Los cinco tiempos pueden tardar más que el paso a paso. Si una unidad pasa de 10 minutos, se parte.
- **Apilar técnicas.** Con cinco rutas es fácil querer usar las cinco en cada unidad. La regla es una principal y una de apoyo.
- **La ruta puede estar mal asignada.** Si en la prueba con alumnos una unidad de ruta D se resuelve mejor con un ejemplo, se cambia la ruta y no se fuerza el gesto.
- **Dos correcciones ya decididas** (sección 5.7): la regla de lectura está cambiada y falta revisar los ítems; la pregunta de seguridad está planeada (5.8). Las dos cambian datos que ya se miden: lo medido antes y después no se compara sin cuidado.
- **No verificado:** nada se probó con alumnos, ni en un celular físico, ni con lector de pantalla. La detección de «se arrastra» es automática y aproximada. Las relaciones de la columna «lo que descubre» son propuestas sin contrastar con los informes de ideas erróneas. No se leyó material de pogil.org (sigue pendiente en la visión) ni se pudieron abrir las fuentes de la segunda opinión. Las cifras sobre animación del skill no se rastrearon a su fuente.

## Reporte de diseño

- **Ficha de tarea:** revisión de algo existente (las 99 escenas) y dirección para un sistema nuevo de lección. No se corrigió nada.
- **Sistema:** el existente (`docs/diseno.md`, `docs/escena-viva.md`, kit y mascota). Decisiones nuevas que este documento propone y que quedan aquí escritas hasta que Gerson las apruebe: los cinco tiempos, el vocabulario de 13 gestos, las cinco rutas con su asignación por unidad, la cola de repaso, los cuatro niveles de dominio, los 54 tramos, la regla de decisión Rive contra motor y el catálogo de 15 archivos.
- **Carácter:** acogedora, viva y precisa (sin cambios). Firma: el hilo de color, que ahora llega también a los registros.
- **Movimientos:** ninguno nuevo. La utilería se rige por las clases «gesto» y «simulación» del skill: sigue al dedo uno a uno y el reloj es el del motor.
- **Verificación:** barrido con Playwright de 99 escenas a 390 × 780 (cifras en la sección 2); dos escenas revisadas a mano.
- **No verificado:** lo listado en la sección 10.
- **Hipótesis:** la de la sección 9.
- **Conflictos:** el plan de tres capas de `docs/pendientes.md` propone GSAP o Motion para el movimiento; aquí se propone no agregar librería hasta que el gesto esté resuelto. `docs/escena-viva.md` pone la mascota como único uso de Rive; aquí se amplía a utilería, personajes de escena e interfaz, con el mismo tipo de contrato.
