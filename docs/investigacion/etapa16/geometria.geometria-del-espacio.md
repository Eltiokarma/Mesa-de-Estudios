# Geometría · Rectas y planos en el espacio

## 1. Resumen en 5 líneas

La unidad enseña a pasar de objetos tridimensionales a relaciones entre puntos, rectas y planos sin confundir el objeto con su dibujo.
Primero establece qué determina un plano y cómo distinguir intersección, paralelismo y rectas cruzadas.
Después construye la perpendicularidad, la proyección ortogonal y los ángulos entre rectas, entre recta y plano y entre planos.
Finalmente usa esas relaciones para elegir una distancia mínima, una sección útil o una proporción entre transversales.
Lo más difícil es justificar la configuración antes de calcular: una perspectiva puede ocultar encuentros y deformar longitudes y ángulos.

## 2. Qué se pregunta en los exámenes

**Alcance.** Se compararon el temario oficial CEPREUNI 2026-2, el cuadernillo oficial UNI 2012-1 y materiales identificados de San Marcos. La muestra reconoce tipos, pero no permite ordenar frecuencias. La dificultad es una valoración pedagógica, no una estadística de las universidades.

| Tipo de pregunta | Universidad y naturaleza del documento | Dificultad | Frecuencia que puede afirmarse | Fuente |
|---|---|---|---|---|
| Obtener segmentos determinados por tres planos paralelos sobre dos transversales | UNI, examen de admisión 2012-1, segunda prueba, pregunta 26 | Media: reconocer correspondencias antes de plantear una proporción | Un caso localizado; no permite afirmar que sea frecuente | OCAD-UNI, 2012 [F2] |
| Determinar una razón trigonométrica del ángulo entre una arista y el plano de otras dos en una configuración espacial | UNI, examen de admisión 2012-1, segunda prueba, pregunta 27 | Alta: construir la proyección y un triángulo auxiliar | Un caso localizado | OCAD-UNI, 2012 [F2] |
| Relacionar la distancia de un vértice a una diagonal con una longitud del cubo | UNI, examen de admisión 2012-1, segunda prueba, pregunta 28 | Alta: identificar un plano de trabajo y la perpendicular pertinente | Un caso localizado; es aplicación espacial de distancia punto-recta | OCAD-UNI, 2012 [F2] |
| Hallar una longitud en una configuración de soporte vertical y puntos de anclaje sobre una superficie | UNMSM 2019-I, áreas A, B y D, reproducción del examen en un solucionario de Trilce | Básica a media: reconocer el ángulo recto y seleccionar Pitágoras | Una aparición reproducida; no se obtuvo aquí un archivo original de OCA para cotejar su numeración | Trilce, 2018, examen denominado 2019-I [F3] |
| Reconocer perpendicularidad recta-plano y aplicar el teorema de las tres perpendiculares | UNI, temario CEPREUNI 2026-2, sesión 24 | Media: exige hipótesis geométricas completas | Presencia curricular comprobada; no es un conteo de exámenes | CEPREUNI, 2026 [F1] |
| Calcular ángulos, proyecciones de segmentos y distancia entre rectas cruzadas | UNI, temario CEPREUNI 2026-2, sesiones 24 y 25 | Media a alta: trasladar direcciones o construir una perpendicular común | Presencia curricular comprobada | CEPREUNI, 2026 [F1] |
| Determinar un diedro, usar planos perpendiculares o proyectar una región poligonal | UNI, temario CEPREUNI 2026-2, sesión 26 | Media a alta: seleccionar una sección perpendicular a la arista | Presencia curricular comprobada | CEPREUNI, 2026 [F1] |
| Clasificar posiciones relativas y trabajar perpendicularidad, proyección y diedros | UNMSM, complemento de Geometría, semana 6, ciclo especial verano 2024, copia alojada en Scribd | De básica a alta según las relaciones combinadas | Evidencia de tratamiento preuniversitario; no se contabiliza como admisión | CEPREUNMSM, 2024 [F4] |
| Familias equivalentes en UNA Puno, UNSA y UNSAAC | No se reunió una muestra verificable de preguntas de esta unidad durante esta revisión | No determinada | No determinada; no se extrapola la frecuencia de Lima | Vacío de esta investigación |

**Decisión curricular.** Se priorizan perpendicularidad, proyección y construcción de triángulos auxiliares por sus dependencias matemáticas. No se atribuye a esa selección una frecuencia histórica. Triedros completos y volúmenes quedan fuera del bloque; el programa UNI los desarrolla después [F1].

## 3. Errores típicos

DOCUMENTADO indica comportamiento descrito en el original leído. HIPÓTESIS identifica un distractor propio sin evidencia directa localizada. Las causas propuestas deben confirmarse con la explicación del alumno. No se hallaron prevalencias peruanas de estos errores.

Gutiérrez estudia tres escolares de sexto grado; sus episodios no representan a postulantes peruanos [F5]. Cohen publica una comunicación breve que describe dificultades y un estudio con futuros docentes, pero no detalla sus resultados [F6]. No se inventan cifras ni se atribuyen distractores específicos a esa comunicación.

| Código | Qué hace o cree el alumno | Por qué puede hacerlo | Etiqueta | Fuente y alcance |
|---|---|---|---|---|
| E01 | Decide si dos representaciones corresponden al mismo objeto por su apariencia global, sin contrastar sus elementos | Atiende a la silueta y a la posición visible antes que a relaciones invariantes | DOCUMENTADO | Gutiérrez, 1992, episodios de María, pp. 40–41 [F5]. Aplicarlo a falsos cruces es una adaptación de esta propuesta |
| E02 | Considera que dos puntos fijan una única superficie plana | Confunde fijar una recta con fijar también la orientación de una superficie alrededor de ella | HIPÓTESIS | Propuesta propia; sin estudio directo |
| E03 | Cree que cualquier grupo de tres puntos determina un único plano | Memoriza “tres puntos” y omite que no deben estar alineados | HIPÓTESIS | Propuesta propia; regla en [F7] |
| E04 | Llama paralelas a dos rectas solo porque no se encuentran | Traslada al espacio una clasificación aprendida dentro de un único plano | HIPÓTESIS | Hipótesis inspirada en la preocupación general de [F6] |
| E05 | Supone que todas las rectas que no son paralelas terminarán cortándose al prolongarlas | Extiende una propiedad de rectas coplanares a rectas situadas en planos diferentes | HIPÓTESIS | Propuesta propia |
| E06 | Cree que una recta no corta un plano si el cruce queda fuera del borde del tablero dibujado | Identifica el plano infinito con la parte material y limitada que lo representa | HIPÓTESIS | Propuesta propia |
| E07 | Concluye que una varilla es perpendicular al plano después de comprobar un solo ángulo recto | Generaliza una comprobación válida en una dirección a todas las direcciones | HIPÓTESIS | Propuesta propia; criterio en [F8] |
| E08 | Usa dos rectas paralelas del plano como si fueran dos comprobaciones independientes | Cuenta dos marcas, aunque ambas prueban la misma dirección | HIPÓTESIS | Propuesta propia |
| E09 | Dibuja siempre las proyecciones hacia abajo en la pantalla | Confunde la orientación gráfica o la vertical física con la normal del plano elegido | HIPÓTESIS | Propuesta propia |
| E10 | Lee un ángulo espacial con un transportador sobre cualquier vista en perspectiva | Trata la representación como si conservara todas las medidas del objeto | HIPÓTESIS | Propuesta propia; [F5] no documenta esta respuesta |
| E11 | Entrega el ángulo de una recta con la normal cuando se pidió su ángulo con el plano | Recuerda una perpendicular auxiliar, pero pierde cuál es el ángulo solicitado | HIPÓTESIS | Propuesta propia |
| E12 | Afirma que no puede existir un ángulo entre rectas cruzadas porque no comparten vértice | Asocia todo ángulo de direcciones con un cruce físico de las rectas originales | HIPÓTESIS | Propuesta propia |
| E13 | Mide un diedro con dos trazos cualesquiera de sus caras | No reconoce la necesidad de que ambos trazos sean perpendiculares a la arista | HIPÓTESIS | Propuesta propia |
| E14 | Si dos planos son perpendiculares, afirma que cualquier recta de uno es perpendicular a cualquier recta del otro | Atribuye a todos los elementos una relación que corresponde a los planos | HIPÓTESIS | Propuesta propia |
| E15 | Conserva el área de una lámina al proyectarla ortogonalmente sobre otro plano | Confunde una proyección con trasladar rígidamente la lámina sin deformarla | HIPÓTESIS | Propuesta propia |
| E16 | Escoge el segmento más corto en el dibujo, aunque no sea perpendicular en el espacio | Usa la longitud aparente como sustituto de la distancia geométrica | HIPÓTESIS | Propuesta propia |
| E17 | Para medir distancia entre dos rectas cruzadas acepta un enlace perpendicular a una sola | Reutiliza el criterio punto-recta sin comprobar que el segundo extremo también puede variar | HIPÓTESIS | Propuesta propia |
| E18 | Cree que planos paralelos producen segmentos iguales en todas las transversales | Confunde igualdad con proporcionalidad y no conserva la correspondencia entre tramos | HIPÓTESIS | Propuesta propia |
| E19 | Prueba giros sucesivos al azar para hacer coincidir vistas, sin anticipar qué cambiará | Carece de una estrategia explícita para coordinar la orientación del objeto y su representación | DOCUMENTADO | Gutiérrez, 1992, episodios de trabajo de María, pp. 42–44 [F5] |

## 4. Lo que la unidad da por sabido

Se requieren punto, segmento, recta, ángulo recto, paralelismo y perpendicularidad en el plano. El alumno debe reconocer una propiedad dada aunque el dibujo no esté a escala.

Para calcular se necesitan Pitágoras, semejanza, proporcionalidad y razones trigonométricas del triángulo rectángulo. Las relaciones siempre se entregan: el alumno elige cuál corresponde.

Se usan caja, tablero, puerta y soporte sin presuponer volúmenes. No se requieren vectores ni ecuaciones cartesianas de planos.

## 5. Las ideas, en orden

La secuencia va de incidencia a posiciones, perpendicularidad, ángulos de rectas, ángulos de planos y distancias. Cada idea muestra el objeto antes de abstraerlo. Las vistas predefinidas permiten trabajar sin depender de una rotación libre precisa.

### Idea 1. Un tablero no es todo el plano

**Pregunta que responde.** ¿Qué información fija una superficie plana y qué parte de ella muestra un dibujo?

**Aprendizaje.** El alumno distingue el objeto material de su modelo y reconoce que tres puntos no alineados determinan un único plano.

**Objeto de la primera pantalla.** Un tablero con marcas de lápiz y apoyos en un taller de carpintería. Se ve su espesor antes de destacar la cara superior como parte de un plano. La escena es propia; no representa un taller real identificado.

**Lee: cuatro tarjetas.**

1. “La cara del tablero nos ayuda a imaginar una superficie plana. La madera tiene borde y espesor; el plano matemático continúa más allá de los bordes y no tiene espesor.”
2. “Una marca pequeña señala una posición. La llamaremos punto. Las letras mayúsculas servirán para distinguir unas posiciones de otras.”
3. “Una regla apoyada en dos marcas muestra una dirección recta. El tramo que vemos tiene extremos; la recta del modelo continúa en ambos sentidos.”
4. “Un plano puede quedar inclinado. Que la cara del tablero mire hacia arriba o hacia un costado no cambia que sea plana.”

**Juega: fijar una cara.** Mover tres apoyos hasta que toquen una cara rígida en tres marcas separadas. La meta comprueba contacto y puntos distintos; no comprueba aún unicidad del plano. Solo aparecen ternas no alineadas: el caso alineado queda reservado a Predice. No se muestra un contador de orientaciones.

**Predice.** “Ahora las tres marcas quedan sobre una sola línea. Si solo exigimos que la cara pase por esas marcas, ¿cuántas orientaciones de plano pueden cumplirlo?”

| Opción | Respuesta | Lectura pedagógica |
|---|---|---|
| A | Una sola, porque hay tres marcas distintas | E03: cuenta puntos y omite su alineación |
| B | Más de una: la cara puede girar alrededor de la línea que las contiene | Correcta; anticipa la falta de una dirección independiente |
| C | Una sola, porque las dos primeras marcas ya fijaron toda la superficie | E02: dos puntos fijan una recta, no un plano único |
| D | Ninguna si una marca queda fuera del borde del tablero que se dibujó | E06: confunde la extensión del plano con el recorte material |

**Mira.** Una lámina transparente gira alrededor de la línea que contiene las tres marcas: todas esas posiciones las contienen. Al mover una marca fuera de la línea se pierde esa libertad. Se explica por qué existe un giro continuo; no se pretende demostrar infinitud contando unos pocos dibujos.

**La regla, completa.** Por dos puntos distintos pasa una única recta. Tres puntos no alineados determinan un único plano. Tres puntos alineados pertenecen a infinitos planos que contienen su recta. Una recta y un punto exterior a ella determinan un plano; dos rectas secantes distintas determinan un plano; dos rectas paralelas distintas también determinan un plano. Estos últimos casos se vuelven a utilizar al clasificar posiciones en la idea 2.

Si dos puntos distintos de una recta pertenecen a un plano, toda la recta está contenida en él. Cuatro puntos no son necesariamente coplanares: tres no alineados fijan un plano y el cuarto puede estar fuera. El borde dibujado no limita la extensión del plano.

Se introduce $\pi$, “plano pi”. $A\in\pi$ se lee “A pertenece al plano pi”. Para una recta r, $r\subset\pi$ se lee “r está contenida en el plano pi”. Pi nombra aquí un plano, no el número de las circunferencias.

**Así se resuelve: decidir si una cara queda determinada.** Se presenta una plancha con cuatro marcas propias. Tres de ellas están alineadas y la cuarta está fuera de esa línea. La tarea consiste en decidir si todas pertenecen necesariamente a un plano único y justificarlo.

1. Identificar dos marcas distintas de la línea y nombrar la recta que determinan.
2. Reconocer que la tercera marca no aporta una dirección nueva: ya pertenece a esa recta.
3. Elegir la cuarta marca, exterior a la recta, y aplicar “recta más punto exterior”.
4. Concluir que hay un único plano que contiene la recta y esa cuarta marca; por contener la recta, contiene también las tres primeras.
5. Verificar que no se supuso ninguna medida de ángulo, espesor o longitud que el problema no diera.

**Ahora tú: progresión de ejercicios.**

- Separar en una fotografía de una mesa lo que representa un punto, un segmento y una porción de plano; justificar qué propiedad se idealiza.
- Elegir ternas que determinan un plano entre marcas dadas sobre un tablero y una varilla.
- Distinguir “se puede trazar un plano” de “queda determinado un único plano”.
- Con cuatro puntos, decidir si la información garantiza coplanaridad, la descarta o resulta insuficiente.
- Nivel de admisión: evaluar proposiciones sobre rectas y planos, construir un contraejemplo cuando falta una condición y evitar usar el dibujo como única prueba.

**Palabras nuevas.** “Plano”: superficie lisa imaginada sin bordes; ejemplos: modelo de una cara de mesa, de puerta y de lámina. “Alineados”: puntos que caben en una misma recta; ejemplos: perforaciones de una regla, marcas sobre un borde recto y señales sobre un hilo ideal tenso. “Coplanares”: elementos que caben en una misma superficie plana; ejemplos: esquinas de una cartulina plana, marcas de una cara de caja y bordes contiguos de un tablero.

### Idea 2. No encontrarse no basta

**Pregunta que responde.** ¿Cómo distinguimos rectas paralelas, secantes y cruzadas en un objeto tridimensional?

**Aprendizaje.** El alumno clasifica posiciones usando pertenencia a un plano e intersección real, sin decidir solo por una vista.

**Objeto de la primera pantalla.** Una estantería metálica de un puesto de mercado, vacía para ver barras delanteras, posteriores y laterales. Se distinguen por marcas además de color. Sus ejes se modelan como rectas prolongables.

**Lee: cuatro tarjetas.**

1. “La estantería tiene barras delante y detrás. En una fotografía, algunas pueden taparse aunque estén separadas.”
2. “Dos líneas que comparten un punto del espacio se cortan. Ese encuentro debe existir en el objeto, no solo en la imagen.”
3. “Para estudiar las barras prolongaremos sus direcciones. Una barra corta puede representar parte de una recta.”
4. “Las caras transparentes ayudan a comprobar qué barras caben en una misma superficie plana.”

**Juega: encontrar un encuentro verdadero.** Mover una barra de la cara frontal hasta que comparta una marca espacial con otra de esa cara. El programa verifica el punto común y permite cambiar de vista. El par de barras situadas en niveles diferentes queda reservado a Predice.

**Predice.** Se señala una barra horizontal delantera en la parte alta y una barra que va de delante hacia atrás en la parte baja, sin contacto entre ellas. “Las líneas de estas barras tienen direcciones distintas. ¿Qué relación tienen al prolongarlas?”

| Opción | Respuesta | Lectura pedagógica |
|---|---|---|
| A | Son paralelas, porque nunca se tocan | E04: omite la condición de coplanaridad y dirección |
| B | Se cortan porque sus imágenes se cruzan en la vista frontal elegida | E01: adaptación del juicio por apariencia global |
| C | Son cruzadas: no comparten punto ni pueden quedar contenidas en un mismo plano | Correcta |
| D | Se cortarán lejos del mueble, porque tienen direcciones distintas | E05: aplica al espacio una conclusión propia del plano |

**Mira.** La cámara gira y el cruce aparente desaparece. Se intenta contener ambas rectas en una lámina, sin éxito. Permanecen en niveles paralelos diferentes y sus direcciones son distintas: no pueden ser secantes ni paralelas.

**La regla, completa.** Dos rectas distintas son secantes si comparten un punto; paralelas si son coplanares sin puntos comunes; y cruzadas o alabeadas si no son coplanares. Dos nombres pueden designar una misma recta: entonces son coincidentes. El aspecto de una sola vista no decide la clasificación.

Una recta puede estar contenida en un plano, cortarlo en un punto o ser estrictamente paralela sin puntos comunes. Aquí “paralela al plano” excluye estar contenida; otra convención debe advertirse.

Dos planos distintos son paralelos o se intersecan en una recta. Se introducen $\sigma$ y $\tau$, “plano sigma” y “plano tau”. $\pi\cap\sigma=r$ se lee “la intersección de pi y sigma es r”.

El símbolo $\parallel$ significa “paralelo a”. Una recta exterior a un plano, paralela a una recta contenida en él, es paralela al plano. La condición de exterioridad evita confundir paralelismo estricto con contención.

Dos rectas distintas paralelas a una misma recta son paralelas entre sí. Dos planos paralelos a un mismo plano son paralelos o coincidentes. En cambio, dos rectas paralelas a un plano pueden tener direcciones diferentes.

Para probar que dos planos distintos son paralelos basta encontrar en cada uno dos rectas secantes, respectivamente paralelas a las del otro. Una sola dirección no basta: permite que un plano gire alrededor de ella.

**Así se resuelve: clasificar sin medir la imagen.** En una caja rectangular se seleccionan dos aristas que no comparten vértice. Se dan sus caras y direcciones, no una fotografía a escala.

1. Revisar primero si las rectas son coincidentes o comparten un punto. La diferencia de altura puede descartar el encuentro cuando ambas permanecen en niveles horizontales diferentes.
2. Comparar direcciones a partir de aristas declaradas paralelas o perpendiculares en las caras.
3. Si las direcciones son iguales y las rectas son distintas, reconocer el paralelismo.
4. Si no comparten punto y sus direcciones no son paralelas, concluir que son cruzadas.
5. Comprobar la conclusión en otra vista y explicar por qué la cámara no puede cambiarla.

**Ahora tú: progresión de ejercicios.**

- Clasificar pares de barras de una misma cara del mueble.
- Identificar pares cruzados en un armazón rectangular, indicando qué información descarta las otras posiciones.
- Decidir si una recta está contenida, es secante o es paralela a un plano cuyo recorte visible es pequeño.
- Evaluar proposiciones con “toda”, “alguna” y “necesariamente”, mediante un ejemplo o un contraejemplo construido.
- Nivel de admisión: encadenar relaciones entre varios planos y rectas, incluyendo coincidencia como posibilidad cuando el enunciado no dice “distintos”.

**Palabras nuevas.** “Secantes”: elementos que realmente se encuentran; ejemplos: reglas cruzadas sobre una mesa, planos de caras contiguas y varilla que atraviesa una lámina. “Cruzadas”: rectas separadas con direcciones diferentes; ejemplos: barra delantera alta y lateral baja de un estante, aristas equivalentes de una caja y ejes de dos varillas montadas sin contacto ni paralelismo. “Intersección”: parte compartida; ejemplos: punto entre rectas secantes, línea entre planos secantes y recta completa cuando está contenida en un plano.

### Idea 3. Comprobar dos direcciones

**Pregunta que responde.** ¿Cuándo una recta es perpendicular a un plano y cómo se obtiene una proyección ortogonal?

**Aprendizaje.** El alumno exige dos direcciones secantes para verificar perpendicularidad y construye proyecciones siguiendo la normal del plano elegido.

**Objeto de la primera pantalla.** Un soporte de exhibición con varilla articulada y base rígida. Una escuadra se coloca en distintas direcciones de la base, como en el armado de un atril.

**Lee: cuatro tarjetas.**

1. “Una escuadra permite comparar dos direcciones con un ángulo recto. Colocarla en otro lugar puede comprobar algo distinto.”
2. “La varilla puede inclinarse hacia delante o hacia un costado. Una vista frontal no muestra todas esas inclinaciones.”
3. “El plano de referencia será la cara de la base. Primero elegimos esa cara y luego decidimos qué líneas pertenecen a ella.”
4. “La marca donde una línea encuentra la base servirá para mantener juntas las comprobaciones.”

**Juega: pasar un control de escuadra.** Ajustar una varilla para que forme ángulo recto con una sola línea de la base. La meta comprueba solo esa relación y deja un giro libre; no diagnostica perpendicularidad al plano. Predice muestra una posición inclinada que pasa ese control.

**Predice.** “La varilla forma un ángulo recto con la línea marcada. ¿Qué falta para asegurar que es perpendicular a toda la base?”

| Opción | Respuesta | Lectura pedagógica |
|---|---|---|
| A | Nada: un ángulo recto con cualquier línea de la base basta | E07 |
| B | Comprobar otra línea paralela a la primera, porque dos marcas siempre bastan | E08 |
| C | Comprobar una segunda recta de la base que corte a la primera en el pie de la varilla | Correcta |
| D | Girar la cámara hasta que la varilla se vea vertical en la pantalla | E09 |

**Mira.** Una segunda escuadra detecta una inclinación que la primera no detectaba. Se ajusta la varilla hasta pasar ambos controles y se inclina todo el conjunto: la perpendicularidad permanece aunque la varilla no parezca vertical.

**La regla, completa.** Una recta perpendicular a un plano forma ángulos rectos con todas las rectas del plano que pasan por su pie. Basta verificar dos rectas distintas y secantes en ese pie. El símbolo $\perp$ significa “perpendicular a”. Dos direcciones paralelas no cumplen el criterio [F8].

Por un punto pasa una única normal a un plano, es decir, una recta perpendicular a él. Se usa P para un punto exterior y H para su pie sobre el plano. PH indica longitud; $\overline{PH}$ indica el segmento como objeto.

La proyección ortogonal de P es H. Para proyectar un segmento se proyectan sus extremos y se unen sus imágenes; puede resultar un segmento o un punto. Una recta perpendicular se proyecta en un punto; otra recta se proyecta en una recta. Si ya estaba en el plano, su proyección coincide con ella.

“Ortogonal” indica dirección perpendicular al plano receptor, no vertical en la pantalla. En un plano inclinado ambas direcciones pueden diferir. Una sombra solar no define por sí sola una proyección ortogonal.

**Teorema de las tres perpendiculares.** P es exterior al plano, H su proyección, A un punto del plano distinto de H y t una recta del plano por A. Entonces t es perpendicular a AH si y solo si es perpendicular a AP. Deben conservarse esas condiciones; AP es oblicua al plano.

Para justificarlo, tomar B en t. Como PH es normal, $PB^2=PH^2+HB^2$. Si AH es perpendicular a AB, $HB^2=HA^2+AB^2$. Además, $PH^2+HA^2=PA^2$. Resulta $PB^2=PA^2+AB^2$ y la recíproca de Pitágoras prueba el ángulo recto en A.

**Así se resuelve: justificar una perpendicular oblicua.** Una varilla PH está declarada perpendicular a la base. Desde P sale un tirante hasta A, y en la base se traza por A una línea t perpendicular a AH. La tarea es decidir si el tirante forma ángulo recto con t.

1. Identificar H como pie de la normal y verificar que A y t pertenecen a la base.
2. Reconocer AH como proyección del tirante AP, porque A ya está en el plano y P se proyecta en H.
3. Señalar el ángulo recto dado entre t y AH.
4. Aplicar el teorema de las tres perpendiculares, indicando las tres condiciones, y concluir que t es perpendicular a AP.
5. Cambiar la vista para comprobar que el ángulo aparente no fue usado como dato.

**Ahora tú: progresión de ejercicios.**

- Distinguir una comprobación insuficiente de otra que sí garantiza perpendicularidad.
- Encontrar el pie de un punto sobre un plano horizontal y después sobre un plano inclinado.
- Proyectar un segmento paralelo, oblicuo o perpendicular al plano, incluyendo la proyección que se reduce a un punto.
- Elegir entre usar el criterio de dos rectas secantes o el teorema de las tres perpendiculares.
- Nivel de admisión: justificar una perpendicular auxiliar dentro de una caja o estructura espacial antes de calcular una longitud en un triángulo.

**Palabras nuevas.** “Normal”: dirección que sale a escuadra de una superficie; ejemplos: eje perpendicular a una base, línea perpendicular a una puerta y línea perpendicular a una cartulina inclinada. “Pie”: punto de llegada de la perpendicular; ejemplos: H en la base, punto proyectado en una pared y punto proyectado en una mesa. “Proyección ortogonal”: ubicación obtenida siguiendo la normal; ejemplos: esquina proyectada al piso, extremo de varilla proyectado a un tablero y segmento perpendicular proyectado en un punto.

**Cuidado pedagógico.** Una plomada solo representa la normal de una base horizontal. En un plano arbitrario se usa una escuadra, no la vertical física.

### Idea 4. Elegir el ángulo que se pide

**Pregunta que responde.** ¿Cómo medimos una inclinación sin confundirla con el ángulo que dibuja la cámara?

**Aprendizaje.** El alumno construye el ángulo entre direcciones de rectas y el ángulo de una recta con su proyección sobre un plano.

**Objeto de la primera pantalla.** Un tijeral de madera en una maqueta de techo, con barra inclinada y base horizontal. Se mueve la cámara sin mover las uniones. La escena enseña geometría, no diseño estructural.

**Lee: cuatro tarjetas.**

1. “El tijeral mantiene sus uniones cuando miramos desde otro lugar. La fotografía puede cambiar aunque la estructura siga igual.”
2. “Una misma barra tiene una dirección en el espacio. Para comparar direcciones podemos usar otras líneas paralelas a ellas.”
3. “Ya sabemos proyectar los extremos de una barra sobre una base. Esas marcas permiten construir una línea dentro de la base.”
4. “Antes de medir hay que leer qué se compara: dos rectas, o una recta y un plano.”

**Juega: copiar una dirección.** Mover una regla auxiliar hasta hacerla paralela a una barra y pasar por una marca. La meta verifica dirección y punto de paso; no depende de la longitud de la regla. No se enseña todavía cómo medir el ángulo recta-plano. Predice introduce un plano inclinado.

**Predice.** “Queremos medir el ángulo entre una varilla oblicua y una lámina inclinada. ¿Qué construcción debemos usar?”

| Opción | Respuesta | Lectura pedagógica |
|---|---|---|
| A | Medir el ángulo entre la varilla y la normal de la lámina | E11: entrega el complementario |
| B | Medir el ángulo entre la varilla y su proyección ortogonal sobre la lámina | Correcta |
| C | Medir con un transportador el ángulo que parece verse en la imagen frontal | E10: confunde vista y medida espacial |
| D | Bajar verticalmente los extremos hasta la lámina y usar ese trazo, cualquiera que sea la inclinación de la lámina | E09: sustituye normal por vertical |

**Mira.** Se proyecta sobre la lámina siguiendo sus normales. La cámara se orienta frente al triángulo formado por varilla y proyección y después gira: las medidas permanecen. Se distingue el ángulo con la normal, complementario del solicitado.

**La regla, completa.** El ángulo entre dos rectas compara sus direcciones: para secantes se toma el menor ángulo; para paralelas es cero. Para cruzadas se trazan por un mismo punto paralelas a ambas y se mide su ángulo menor. El resultado no depende del punto elegido.

Se usa $\varphi$, “fi”, para el ángulo entre rectas. Aquí “perpendiculares” exige encuentro y “ortogonales” admite direcciones cruzadas. Si un texto usa otra convención, se advertirá.

El ángulo de una recta oblicua con un plano es el menor ángulo con su proyección ortogonal. Se llama $\theta$, “theta”. Es cero para una recta paralela o contenida y noventa grados para una perpendicular, cuya proyección es un punto. Ese caso se define aparte.

Si $\eta$, “eta”, es el ángulo menor de la recta con la normal, $\theta+\eta=90^\circ$. El símbolo $^\circ$ indica grados. No se aplica esa igualdad a arcos obtusos elegidos arbitrariamente.

Considérese un segmento de longitud $\ell$, leída “ele”, y su proyección de longitud $p$, leída “pe”. Sea $h$ la diferencia perpendicular entre las alturas de sus extremos respecto del plano; se usa como magnitud no negativa. En el triángulo rectángulo asociado:

$$p=\ell\cos\theta,\qquad h=\ell\sin\theta,\qquad \ell^2=p^2+h^2.$$

Cuando $p>0$, $\tan\theta=h/p$. Seno, coseno y tangente se escriben aquí $\sin$, $\cos$, $\tan$; también aparecen como sen, cos y tg en textos peruanos.

Si ambos extremos están fuera del plano, h es la magnitud de la diferencia de sus posiciones perpendiculares: se restan sus distancias cuando están del mismo lado y se suman cuando están en lados opuestos. No se suma automáticamente.

La proyección no puede ser más larga que el segmento original. Si tienen la misma longitud, la dirección del segmento es paralela al plano. Si la proyección tiene longitud cero, el segmento es perpendicular. Estos extremos permiten revisar una cuenta sin memorizar valores trigonométricos.

**Así se resuelve: inclinación de un tirante.** En una maqueta se conoce la longitud de un tirante y la separación perpendicular entre sus extremos. El plano de referencia está explícito. Se pide la longitud de la proyección y una expresión que permita obtener el ángulo del tirante con ese plano.

1. Nombrar $\ell$ como longitud del tirante y h como diferencia perpendicular entre sus extremos; verificar que se midieron en la misma unidad.
2. Proyectar los extremos y reconocer el triángulo rectángulo que relaciona $\ell$, p y h. No se usa como h una altura vertical si el plano está inclinado.
3. Elegir Pitágoras para obtener $p=\sqrt{\ell^2-h^2}$. Antes de operar, comprobar que la longitud dada del tirante no es menor que h.
4. Elegir $\sin\theta=h/\ell$, o $\tan\theta=h/p$ si p es positivo, porque se pide el ángulo con el plano.
5. Si se requiere una medida numérica, usar la herramienta o tabla proporcionada para invertir la razón y elegir el ángulo del intervalo de cero a noventa grados.
6. Revisar que p no exceda $\ell$ y que aumentar h manteniendo $\ell$ implique una inclinación mayor.

**Ahora tú: progresión de ejercicios.**

- Identificar cuál de varios arcos representa un ángulo entre una recta y un plano.
- Obtener una proyección o una separación perpendicular a partir de un triángulo ya construido.
- Elegir entre seno, coseno, tangente y Pitágoras con sus relaciones disponibles.
- Comparar dos inclinaciones sin hacer una cuenta completa, manteniendo fija una longitud y cambiando otra.
- Construir el ángulo de rectas cruzadas mediante paralelas auxiliares.
- Nivel de admisión: combinar una perpendicular demostrada en la idea 3, una proyección no visible de inmediato y una razón trigonométrica, justificando cada paso.

**Palabras nuevas.** “Oblicua”: línea inclinada que ni permanece en el plano ni sale a escuadra; ejemplos: tirante hacia el piso, barra inclinada a una base y diagonal que atraviesa oblicuamente una cara. “Dirección”: hacia dónde sigue una línea; ejemplos: dirección de rieles paralelos, reglas paralelas y barra con su copia auxiliar. “Inclinación”: separación angular respecto de una referencia; ejemplos: barra respecto del piso, tirante respecto de un panel y diagonal respecto de una cara.

**Cuidado pedagógico.** Pendiente porcentual y grados no son iguales: la primera es cien veces subida dividida entre avance horizontal, es decir, cien veces la tangente del ángulo con la horizontal.

### Idea 5. Abrir una puerta mide un diedro

**Pregunta que responde.** ¿Cómo se mide la abertura entre dos planos y qué cambia al proyectar una superficie?

**Aprendizaje.** El alumno elige una sección perpendicular a la línea de encuentro y distingue la abertura del diedro de cualquier ángulo dibujado sobre sus caras.

**Objeto de la primera pantalla.** Una puerta de aula con hoja, marco y bisagras. Primero se reconoce el objeto; luego se idealizan la cara de la hoja y el plano del marco como láminas que comparten el eje de bisagra.

**Lee: cuatro tarjetas.**

1. “La puerta gira alrededor de sus bisagras. Los puntos de esa línea permanecen en el lugar de unión.”
2. “La cara de la puerta y el plano del marco tienen una abertura que cambia al girar la hoja.”
3. “Podemos dibujar muchos trazos sobre cada cara. No todos comparan la abertura de la misma manera.”
4. “Una vista tomada a la altura adecuada ayuda a ver la abertura; la propiedad pertenece a los planos, no a la cámara.”

**Juega: abrir hasta una marca.** Girar una puerta de maqueta hasta que su borde inferior llegue a una marca de una guía. El programa verifica la posición prefijada sin mostrar un transportador ni justificar la sección. El juego usa bisagra vertical; Predice cambia a bisagra inclinada.

**Predice.** “En una tapa cuyo eje de bisagra está inclinado, queremos medir la abertura entre sus dos caras planas. ¿Qué procedimiento conserva la medida correcta?”

| Opción | Respuesta | Lectura pedagógica |
|---|---|---|
| A | Dibujar desde un mismo punto del eje un trazo en cada cara, ambos perpendiculares al eje, y medir entre ellos | Correcta |
| B | Tomar cualquier trazo de cada cara que salga de ese punto; todos darán el mismo ángulo | E13 |
| C | Elegir dos trazos cualesquiera y asignarles un ángulo recto si las caras son perpendiculares | E14 |
| D | Proyectar una cara sobre la otra y suponer que conserva siempre su área para deducir la abertura | E15 |

**Mira.** Un corte perpendicular al eje produce dos rayos que miden la abertura. Un corte oblicuo produce otro ángulo. Al desplazar el corte perpendicular por la arista, la medida no cambia.

**La regla, completa.** Un diedro queda formado por dos semiplanos que comparten una recta frontera llamada arista. Su medida es el ángulo entre dos rayos, uno en cada cara, trazados desde un mismo punto de la arista y perpendiculares a ella. Ese ángulo se llama ángulo plano o rectilíneo del diedro.

Se usa $\delta$, “delta”, para el diedro señalado. Dos planos secantes forman diedros adyacentes suplementarios. El ángulo menor entre planos está entre cero y noventa grados; un diedro seleccionado mediante semiplanos puede ser obtuso. El enunciado debe distinguirlos.

Dos planos son perpendiculares si su ángulo menor es recto; basta que uno contenga una normal al otro. En planos perpendiculares, una recta de una cara perpendicular a la arista común es normal a la otra cara. No puede omitirse la condición sobre la arista.

No todas las rectas de planos perpendiculares son perpendiculares entre sí. Por ejemplo, dos rectas paralelas a la arista, una en cada plano, tienen direcciones paralelas. La relación entre superficies no se transmite sin condiciones a cualquier trazo de cada superficie.

La proyección ortogonal de una región plana sobre otro plano reduce su área según la inclinación. Se llama $S$ al área original y $S_{\mathrm{proy}}$, leído “ese proyectada”, al área de la proyección. Si $\delta$ es el ángulo entre los planos o el diedro correspondiente, se cumple:

$$S_{\mathrm{proy}}=S\,|\cos\delta|.$$

El valor absoluto toma una magnitud no negativa. Si se usa el ángulo menor entre planos, el coseno ya es no negativo. No confundir esas barras con la barra que identifica un segmento.

Para justificarla, tomar un rectángulo con un lado paralelo a la arista: ese lado conserva longitud; el lado perpendicular a la arista recibe el factor coseno de la idea 4. El área recibe el factor una sola vez. Una región poligonal se trata por descomposición y suma de áreas.

Si los planos son paralelos, el área se conserva. Si son perpendiculares, la proyección de una región plana puede quedar sobre una línea y su área es cero. Esto no significa que la región original desaparezca ni que su superficie material deje de existir.

**Así se resuelve: área útil vista perpendicularmente.** Una lámina rectangular de una maqueta se inclina respecto de la base. Se conoce su área y se da el ángulo entre ambos planos. Se pide el área de su proyección ortogonal sobre la base.

1. Identificar la región que se proyecta y el plano receptor. No confundir área de la lámina con área de una pared diferente.
2. Comprobar que el ángulo dado es entre los planos; si es entre una normal y un plano, convertirlo mediante la relación complementaria antes de usarlo.
3. Seleccionar $S_{\mathrm{proy}}=S|\cos\delta|$ del panel de relaciones.
4. Sustituir el área y el ángulo dados, conservando una sola unidad de superficie. El equipo de producción elegirá los valores y verificará la cuenta.
5. Revisar que el resultado esté entre cero y S y que se acerque a cero cuando la lámina queda de canto respecto del plano receptor.

**Ahora tú: progresión de ejercicios.**

- Seleccionar el corte que mide un diedro entre varias secciones candidatas.
- Distinguir el diedro señalado del ángulo menor entre los mismos planos.
- Reconocer cuándo dos planos perpendiculares autorizan una perpendicular entre recta y plano.
- Calcular el área proyectada a partir del área original y el ángulo, o plantear la relación inversa si se conoce una razón de áreas.
- Detectar configuraciones imposibles, como una proyección ortogonal de área mayor que la región original.
- Nivel de admisión: combinar una sección recta, un triángulo auxiliar y una relación de áreas para determinar una abertura o una longitud.

**Palabras nuevas.** “Diedro”: abertura entre caras unidas por una línea; ejemplos: puerta y marco idealizados, cartulinas articuladas y faldones de una maqueta. “Arista”: línea de encuentro de caras; ejemplos: eje ideal de bisagra, esquina de caja y unión recta de placas. “Sección”: figura obtenida al cortar con un plano; ejemplos: corte horizontal de la puerta, corte perpendicular a una bisagra inclinada y triángulo obtenido al cortar una esquina de caja.

**Cuidado pedagógico.** El modelo selecciona planos y omite holguras y espesor. Una sombra solo representa esta proyección si los rayos son paralelos y perpendiculares al plano receptor.

### Idea 6. La distancia necesita una dirección

**Pregunta que responde.** ¿Qué segmento mide la separación entre objetos y cuándo corresponde usar una proporción entre planos?

**Aprendizaje.** El alumno construye la perpendicular adecuada para una distancia mínima y diferencia esa medida de los tramos proporcionales sobre transversales.

**Objeto de la primera pantalla.** Dos barras de un exhibidor a diferentes alturas y un enlace cuyos extremos pueden deslizarse. Se distingue una unión cualquiera de la unión mínima entre las rectas que modelan las barras.

**Lee: cuatro tarjetas.**

1. “Entre dos lugares podemos dibujar muchos segmentos. La distancia pedida suele referirse al más corto que cumple las condiciones.”
2. “En esta maqueta se pueden mover los dos extremos de la unión. Cambiar un extremo puede cambiar la longitud.”
3. “Las barras físicas tienen extremos. Cuando el problema habla de rectas, sus direcciones continúan fuera del objeto.”
4. “Una longitud aparente depende de la vista. Para comparar usaremos las medidas del modelo y sus ángulos rectos.”

**Juega: acortar con un extremo fijo.** Mantener un extremo del enlace en P y deslizar el otro sobre una recta hasta minimizar la longitud. Se comprueba la posición perpendicular y luego se muestra el ángulo recto. Predice libera ambos extremos sobre dos rectas cruzadas: es un caso nuevo.

**Predice.** “Ahora ambos extremos pueden deslizarse por dos barras cruzadas. ¿Qué condición identifica la unión más corta entre sus rectas?”

| Opción | Respuesta | Lectura pedagógica |
|---|---|---|
| A | Que el enlace sea perpendicular a ambas rectas | Correcta |
| B | Que parezca el segmento más corto en la vista frontal | E16 |
| C | Que sea perpendicular solo a una de las rectas | E17 |
| D | Cualquier enlace sirve si las barras están en dos niveles paralelos, porque todos esos tramos son iguales | E18 |

**Mira.** Un enlace perpendicular a una sola barra todavía puede acortarse moviendo el otro extremo. En la posición mínima es perpendicular a ambas. Las etiquetas de medida permanecen al girar la cámara.

**La regla, completa.** La distancia de un punto a una recta es la longitud del segmento perpendicular desde el punto a la recta. La distancia de un punto a un plano es la longitud del segmento perpendicular desde el punto al plano. Si P está fuera del plano y H es su pie, se escribe $d(P,\pi)=PH$; d se lee “distancia”.

Para cualquier otro punto Q del plano, el triángulo PHQ es rectángulo en H y cumple $PQ^2=PH^2+HQ^2$. Como el segundo sumando no es negativo, PQ no puede ser menor que PH. Así se justifica que la perpendicular dé la menor distancia; no se enseña como una regla arbitraria.

Entre dos planos paralelos distintos, la distancia es constante y se mide por cualquier perpendicular común. Entre una recta y un plano estrictamente paralelos, se puede tomar cualquier punto de la recta y medir su distancia al plano. Si una recta corta el plano, la distancia mínima entre los conjuntos es cero, aunque algunos de sus puntos estén alejados.

Entre rectas paralelas, la distancia sigue una perpendicular común. Entre rectas cruzadas existe una única perpendicular común; el segmento entre ellas mide la distancia. Puede construirse el plano que contiene una recta y es paralelo a la otra: la separación perpendicular entre ese plano y la recta exterior da la misma distancia. Los extremos deben pertenecer a las rectas.

La distancia entre rectas infinitas puede diferir de la distancia entre segmentos: si el pie cae fuera de una barra, el mínimo entre barras puede estar en un extremo. Las primeras misiones eligen configuraciones cuyo mínimo sí queda dentro.

**El triángulo útil.** Un plano que contenga el punto y la recta permite trabajar con un triángulo. Si $S_{\triangle}$ es su área, b la longitud de la base y d la altura perpendicular, $S_{\triangle}=bd/2$. Puede elegirse esta relación o Pitágoras, según los datos disponibles.

No se usa una diagonal como altura sin justificar su perpendicularidad. Elegir entre área y Pitágoras depende de los datos y de la figura auxiliar construida.

**Thales en el espacio.** Tres planos paralelos distintos cortan dos transversales que los atraviesan en el mismo orden. En la primera transversal se llaman A, B y C a los puntos; en la segunda, D, E y F. Los puntos A y D pertenecen al primer plano, B y E al segundo, C y F al tercero. Entonces:

$$\frac{AB}{BC}=\frac{DE}{EF},\qquad
\frac{AB}{AC}=\frac{DE}{DF}.$$

Las letras consecutivas representan longitudes positivas de segmentos. La igualdad depende de mantener la correspondencia entre los mismos pares de planos. No afirma que AB y DE sean iguales. Tampoco exige que las transversales sean paralelas entre sí.

Para justificar Thales, trazar por un punto de una transversal una auxiliar paralela a la otra. En el plano que contiene la auxiliar y la primera transversal, los planos paralelos producen rectas paralelas. Aplicar Thales plano y trasladar los tramos correspondientes. Las transversales originales podrían ser cruzadas.

Si las separaciones perpendiculares entre planos consecutivos son iguales, los tramos consecutivos de una misma transversal también son iguales. Otra transversal puede tener tramos mayores por su inclinación. Esta distinción une los dos temas de la idea: una distancia perpendicular y un tramo oblicuo no son la misma magnitud.

**Así se resuelve: distancia a un plano dentro de una figura espacial.** Se da un punto P exterior a una base, se declara PH perpendicular a la base y se conocen una longitud oblicua PA y la longitud HA, con A en la base. Se pide la distancia de P al plano.

1. Identificar que la distancia buscada es PH, porque H es el pie de la perpendicular.
2. Reconocer el triángulo PHA y justificar su ángulo recto en H usando pertenencia de HA al plano.
3. Elegir Pitágoras: $PH^2=PA^2-HA^2$. No restar longitudes directamente.
4. Comprobar que PA es mayor que HA antes de obtener una raíz positiva.
5. Interpretar el resultado como distancia al plano completo, aunque H quede fuera del polígono dibujado que lo representa.
6. Verificar en una segunda representación que se conserva la relación y que ninguna arista aparente fue tomada como perpendicular sin dato.

**Segundo modelo de solución: proporción entre planos.** Marcar primero los pares de tramos que corresponden a los mismos planos; escribir su proporción; despejar la longitud faltante; y comprobar que cambiar la inclinación puede alargar los tramos de una transversal sin alterar su razón interna.

**Ahora tú: progresión de ejercicios.**

- Identificar el segmento que mide una distancia punto-plano entre varios candidatos.
- Obtener una distancia perpendicular dentro de un triángulo rectángulo ya señalado.
- Reconocer que dos planos secantes tienen distancia mínima cero, sin confundirla con la distancia de puntos específicos.
- Construir una perpendicular común entre rectas cruzadas en una configuración sencilla.
- Aplicar Thales en el espacio, conservando el orden y las correspondencias entre planos.
- Elegir entre una relación de áreas, Pitágoras, trigonometría o proporcionalidad con todas las relaciones disponibles.
- Nivel de admisión: construir un plano auxiliar en una caja, demostrar una perpendicular y recién calcular la distancia a una diagonal o entre rectas.

**Palabras nuevas.** “Distancia”: menor separación permitida; ejemplos: de una marca a una recta, de un punto a un plano y entre planos paralelos. “Perpendicular común”: línea a escuadra con dos rectas; ejemplos: entre rieles paralelos, entre barras cruzadas y entre aristas apropiadas de una caja. “Transversal”: línea que atraviesa planos; ejemplos: varilla entre repisas, auxiliar que cruza láminas paralelas y línea oblicua que atraviesa niveles de una maqueta.

## 6. Tabla de letras y símbolos de la unidad

| Letra o símbolo | Significado y lectura | Unidad o tipo |
|---|---|---|
| A, B, C, D, E, F | Puntos de una figura o intersecciones ordenadas de transversales con planos | Posiciones; sin unidad |
| P | Punto exterior al plano o a la recta de referencia | Posición |
| H | Pie de la perpendicular desde P al plano de referencia | Posición |
| Q | Otro punto candidato sobre el plano, usado para comparar distancias | Posición |
| r, s, t | Rectas; se dice “recta r”, etc. | Objetos geométricos |
| $\pi$, $\sigma$, $\tau$ | Nombres de planos: pi, sigma y tau | Objetos geométricos |
| $\overline{AB}$ | Segmento cuyos extremos son A y B | Objeto geométrico |
| AB | Longitud del segmento AB cuando aparece en una relación métrica | mm, cm o m, según el problema |
| $\ell$ | Longitud del segmento cuya proyección se estudia | Unidad de longitud |
| p | Longitud de la proyección ortogonal de ese segmento | Misma unidad que $\ell$ |
| h | Magnitud de la separación perpendicular entre los extremos del segmento | Unidad de longitud |
| d | Distancia mínima entre los objetos que se indican | Unidad de longitud |
| b | Longitud de la base elegida para calcular el área de un triángulo | Unidad de longitud |
| S | Área de una región plana original | Unidad de superficie |
| $S_{\mathrm{proy}}$ | Área de la proyección ortogonal de la región | Misma unidad de superficie que S |
| $S_{\triangle}$ | Área del triángulo usado en una construcción | Unidad de superficie |
| $\varphi$ | Ángulo menor entre direcciones de dos rectas | Grados |
| $\theta$ | Ángulo menor entre una recta y un plano | Grados |
| $\eta$ | Ángulo menor entre una recta y la normal del plano | Grados |
| $\delta$ | Abertura del diedro seleccionado; se aclara si se usa el ángulo menor entre planos | Grados |
| $\in$, $\subset$ | Pertenece a; está contenido en | Relaciones |
| $\cap$ | Intersección, parte común | Operación entre conjuntos |
| $\parallel$, $\perp$ | Paralelo a; perpendicular a | Relaciones |
| $^\circ$ | Grados de medida angular | Unidad angular |
| $\sin$, $\cos$, $\tan$ | Seno, coseno y tangente; también sen, cos y tg en textos peruanos | Razones sin unidad |
| $\lvert\cos\delta\rvert$ | Valor absoluto del coseno: su magnitud no negativa | Sin unidad |
| $\sqrt{\phantom{x}}$ | Raíz cuadrada no negativa | Depende de la magnitud bajo la raíz |

**Colisiones que se avisan.** Pi nombra un plano, no el número de la circunferencia. P mayúscula es un punto y p minúscula es una longitud proyectada; deben distinguirse tipográficamente y también en audio. S se reserva para áreas y no para una recta. La letra d representa una distancia, no un diámetro. La letra h no significa automáticamente altura vertical: es separación perpendicular respecto del plano elegido.

## 7. Otras formas de explicarla

| Recurso o representación | Idea en la que conviene | Qué permite comprender | Riesgo y corrección | Procedencia |
|---|---|---|---|---|
| Tablero rígido con tres marcas y una línea de giro | 1 | Distinguir una restricción redundante de una dirección nueva | Confundir estabilidad física y determinación geométrica; limitar la conclusión al plano | Diseño propio a partir de relaciones de incidencia |
| Armazón de una caja con barras identificables | 2 | Comparar posiciones reales con encuentros aparentes | Creer que los extremos de las barras son extremos de las rectas; mostrar prolongaciones | Diseño propio |
| Giro del objeto y comparación con vistas estáticas | 1 y 2 | Buscar propiedades que no cambian con la cámara | Girar al azar puede sustituir al razonamiento; pedir una anticipación breve antes de cada giro | Inspiración general en tareas de representación de Gutiérrez, 1992 [F5]; escena nueva |
| Dos escuadras en direcciones distintas | 3 | Dar contenido al criterio de perpendicularidad recta-plano | Contar dos escuadras paralelas como dos condiciones; identificar sus direcciones | Euclides, libro XI, proposición 4 [F8], adaptación propia |
| Puerta, tapa o dos cartulinas articuladas | 5 | Entender arista y sección perpendicular de un diedro | Medir cualquier ángulo de las caras; mostrar un corte oblicuo y uno perpendicular | Diseño propio sobre la definición clásica [F7] |
| Enlace deslizante entre barras | 6 | Hacer visible la necesidad de una perpendicular común | La mínima distancia entre barras finitas puede diferir de la de sus rectas; declarar el dominio | Diseño propio |
| Tres repisas paralelas y dos varillas transversales | 6 | Mantener la correspondencia de tramos al usar Thales | Suponer igualdad de longitudes entre varillas; variar inclinación y conservar razones | Diseño propio; tema curricular verificado en [F1] |

## 8. Datos del mundo real

Los datos siguientes orientan objetos y escalas; no describen medidas exactas de una escena real. Las dimensiones inventadas para ejercicios se declararán datos del modelo.

| Dato verificable | Fuente | Uso posible | Límite de la representación |
|---|---|---|---|
| El reglamento FIVB 2025–2028 define el terreno de juego de voleibol como un rectángulo de 18 m por 9 m | FIVB, 2025, regla 1.1 [F9] | Base reconocible para situar puntos, líneas y un plano horizontal ideal | No se afirma que toda cancha peruana tenga esas medidas ni que el piso real sea un plano perfecto |
| La ficha comercial Gran Onda de Eternit Perú muestra un ancho de 1,10 m y largos de 1,83 m, 2,44 m y 3,05 m | Eternit Perú, sin fecha visible, hoja comercial consultada en 2026 [F10] | Dar escala creíble a una maqueta de cubierta o comparar largos de piezas | La plancha es ondulada: su superficie material no se identifica con una región plana; se modela su plano general de colocación |
| Esa misma hoja indica un espesor de 5,0 mm para las presentaciones listadas | Eternit Perú, sin fecha visible [F10] | Mostrar la diferencia entre una pieza con espesor y un plano sin espesor | El espesor no se usa como tolerancia de un ejercicio geométrico ni como recomendación estructural |
| Eternit identifica una planta en Lima donde fabrica, entre otros productos, placas de cemento Superboard | Eternit Perú, página institucional, sin fecha visible [F11] | Vincular tableros y placas con un contexto de fabricación existente en Perú | La página institucional no se usa para atribuir dimensiones a una placa específica |

## 9. Dudas y decisiones

**Vacíos.** No hay corpus suficiente para ordenar frecuencias. UNI se verificó en un cuadernillo oficial; San Marcos mediante reproducción editorial, sin cotejo de numeración OCA. UNA Puno, UNSA y UNSAAC requieren ampliar el corpus. No se interpreta esa falta como ausencia del tema.

**Contenido.** Se elige geometría sintética para no introducir vectores o coordenadas sin sus prerequisitos. La dificultad se concentra en justificar la figura auxiliar.

Thales se incluye por evidencia curricular y de examen. Se coloca después de distinguir distancias perpendiculares y tramos oblicuos. Su justificación no supone que las transversales originales sean coplanares.

La proyección de áreas se deriva para un rectángulo y se extiende por descomposición. Triedros completos y volúmenes quedan fuera; las cajas solo sirven para construir rectas, planos y triángulos.

**Lenguaje.** “Recta paralela al plano” excluye aquí estar contenida; “perpendicular” entre rectas exige intersección y “ortogonal” puede comparar direcciones cruzadas. Se advertirá otra convención cuando un enunciado la use.

**Decisiones del dueño.** Confirmar dónde se enseñarán triedros y volúmenes; decidir si las tareas UNI más exigentes se muestran como tramo avanzado; y elegir entre tabla trigonométrica dada o herramienta integrada. La teoría de un ejercicio no debe retirarse por cambiar su ubicación.

**Revisión de dependencias y distractores.**

| Idea | Usa solamente | Caso nuevo reservado a Predice | Errores de las tres opciones incorrectas |
|---|---|---|---|
| 1 | Nociones planas recuperadas en Lee | Tres marcas alineadas y extensión fuera del recorte | E03, E02, E06 |
| 2 | Determinación de plano de la idea 1 | Dos barras de niveles y direcciones diferentes | E04, E01, E05 |
| 3 | Incidencia y posiciones relativas | Un control de escuadra insuficiente | E07, E08, E09 |
| 4 | Perpendicularidad y proyección construidas en la idea 3 | Elegir el ángulo con un plano inclinado | E11, E10, E09 |
| 5 | Ángulos, proyecciones y coseno de la idea 4 | Eje articulado inclinado y sección que mide la abertura | E13, E14, E15 |
| 6 | Relaciones anteriores y proporcionalidad plana previa | Mínimo con ambos extremos móviles | E16, E17, E18 |

## 10. Fuentes

**F1. Universidad Nacional de Ingeniería, Centro Preuniversitario. (2026). _Guía del estudiante: ciclo preuniversitario, admisión 2026-2_.** Sílabo de Geometría, sesiones 24–27, página impresa 38. [PDF oficial](https://www.cepre.uni.edu.pe/assets/archivos/comunicados/PREUNIVERSITARIO-GUIADELESTUDIANTE-2026-2.pdf).

**F2. Universidad Nacional de Ingeniería, Oficina Central de Admisión. (2012). _Solucionario del examen de admisión 2012-1_.** Segunda prueba, preguntas 26–28 del enunciado. [PDF institucional](https://admision.uni.edu.pe/wp-content/uploads/2022/11/solucionario2012.pdf).

**F3. Academia Trilce. (2018). _Solucionario áreas A, B y D: examen San Marcos 2019-I_.** Reproducción editorial; proceso denominado 2019-I. [PDF del editor](https://www.trilce.edu.pe/storage/static/upload/944afaa0-41e0-11e9-b14a-55504c38e198.pdf).

**F4. Universidad Nacional Mayor de San Marcos, Centro Preuniversitario. (2024). _Complemento de Geometría, semana n.º 6, ciclo especial verano 2024_.** Copia en plataforma de terceros. [Documento consultado](https://es.scribd.com/document/943832883/Complemento-de-Geometria-Semana-N-06-Ciclo-Especial-Verano-2024).

**F5. Gutiérrez, Ángel. (1992). _Exploring the links between Van Hiele Levels and 3-dimensional geometry_. Structural Topology, 18, 31–48.** Original consultado. [Artículo completo](https://www.uv.es/gutierre/archivos1/textospdf/Gut92a.pdf).

**F6. Cohen, Nitsa. (2000). _Misconceptions in 3-D geometry basic concepts_.** En T. Nakahara y M. Koyama, editores, _Proceedings of the 24th Conference of the International Group for the Psychology of Mathematics Education_, volumen 1, p. 1-149. Comunicación breve original; no publica resultados detallados. [Actas completas, ERIC ED452031](https://files.eric.ed.gov/fulltext/ED452031.pdf).

**F7. Euclides; edición web de David E. Joyce. (1996–1998, edición web). _Elements, Book XI_.** [Libro XI, Clark University](https://mathcs.clarku.edu/~djoyce/elements/bookXI/bookXI.html).

**F8. Euclides; edición web de David E. Joyce. (1996–1998, edición web). _Elements, Book XI, Proposition 4_.** Criterio de perpendicularidad respecto de dos rectas secantes de un plano. [Proposición y demostración](https://mathcs.clarku.edu/~djoyce/elements/bookXI/propXI4.html).

**F9. Fédération Internationale de Volleyball. (2025). _Official Volleyball Rules 2025–2028_.** Regla 1.1, dimensiones del terreno de juego. [Reglamento oficial](https://www.fivb.com/wp-content/uploads/2025/01/FIVB-Volleyball_Rules2025_2028-EN-v05.pdf).

**F10. Eternit Perú. (Sin fecha visible; consulta en 2026). _Gran Onda: hoja vendedora_.** Ficha comercial del fabricante con dimensiones y espesor. [Documento del fabricante](https://media.eternit.com.pe/pi79041/original/-1065852722/hoja-vendedora-gran-onda.pdf). Si la descarga exige un enlace temporal, localizar el título en el [catálogo de documentos técnicos](https://www.eternit.com.pe/es-pe/documentos/).

**F11. Eternit Perú. (Sin fecha visible; consulta en 2026). _Quiénes somos_.** Información institucional sobre fabricación en Perú. [Página del fabricante](https://www.eternit.com.pe/es-pe/quienes-somos/).

Consulta y revisión: 22 de noviembre de 2026.
