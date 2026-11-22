# Razonamiento matemático · Trazos de figuras y perímetros

Etapa 18. Propuesta para quinto de secundaria y postulantes peruanos. Revisión: 22 de noviembre de 2026. Escenas y problemas originales. Fuentes [F01]–[F10] al final.

## 1. Resumen en 5 líneas

La unidad distingue medir un contorno, medir todos los segmentos de una figura y medir un recorrido que puede repetirlos.
Enseña a reconstruir longitudes rectas y curvas antes de sumar, sin confiar en la apariencia del dibujo.
Explica cuándo una figura puede trazarse de una sola vez mediante conexiones, entradas y salidas.
Resuelve recorridos con repeticiones justificadas y compara su longitud respetando inicio, final y caminos permitidos.
Lo más difícil es identificar qué se mide y qué condiciones limitan el recorrido, antes de escoger una fórmula.

## 2. Qué se pregunta en los exámenes

Se revisaron un cuadernillo oficial UNI, una reproducción de San Marcos, un sílabo oficial CEPRE-UNI y un material atribuido a CEPREUNMSM disponible en un repositorio comercial. No forman una muestra representativa de años ni universidades. Las dificultades son valoraciones de diseño; no se presentan porcentajes ni un ranking de frecuencia.

| Tipo de pregunta | Universidad y evidencia | Dificultad | Frecuencia | Fuente |
|---|---|---|---|---|
| Determinar qué información basta para obtener un perímetro compuesto por circunferencias. | UNI, 2015-II, primera prueba, pregunta 17. Enunciado oficial cotejado visualmente. | Alta: exige expresar lo buscado como suma y distinguir datos suficientes de datos irrelevantes. | Un caso confirmado; no permite estimar recurrencia. | OCAD-UNI, 2015 [F01]. |
| Obtener el perímetro de una figura regular usando igualdad de lados expresados de distinta manera. | UNI, 2015-II, primera prueba, pregunta 19. | Básica a media: combina identificación geométrica y ecuación elemental. | Un caso confirmado. | [F01]. |
| Recorrer toda una estructura de alambre con inicio y final fijados, minimizando longitud. | UNMSM, 2020-I, áreas A/B/D, pregunta 26 en reproducción de Trilce. Examen realizado en septiembre de 2019. | Alta: necesita detectar repeticiones obligatorias y respetar extremos. | Un caso localizado; reproducción no cotejada con un archivo oficial completo. | Trilce, 2019 [F02]. |
| Decidir si existe un trazo continuo sin repeticiones y estudiar casos con repeticiones. | Material de CEPREUNMSM, ciclo especial de verano 2024, semana 1, sección «Trazos de figuras». | Media al reconocer condiciones; alta al justificar recorridos mínimos. | Presencia en ese material, no frecuencia de admisión. | Copia en Scribd con encabezado institucional [F03]. |
| Longitud de circunferencia y arco; relaciones geométricas necesarias para reconstruir medidas. | CEPRE-UNI, sílabo 2023-2, Geometría. | Básica a alta según la figura compuesta. | Cobertura curricular confirmada. | CEPRE-UNI, 2023 [F04]. |
| Trazo euleriano específico en admisión UNI; casos de UNA Puno, UNSA o UNSAAC. | No se confirmó una muestra directa suficiente durante esta revisión. | Sin estimación propia. | Desconocida; no se interpreta la falta de hallazgo como ausencia del tema. | Limitación de la investigación. |

Se prioriza identificar los bordes o caminos que deben cubrirse. En suficiencia de datos se proporciona la definición de cualquier promedio utilizado. Las figuras del banco serán originales, no variaciones numéricas de exámenes.

## 3. Errores típicos

Machaba (2016) estudió área y perímetro con alumnos de grado 10 en Sudáfrica [F05]. Se leyó el artículo original, no solo su resumen. Se usan sus resultados conceptuales sin trasladar prevalencias al Perú. No se encontró un estudio original suficientemente específico sobre errores de trazado euleriano de postulantes peruanos; esos errores se declaran hipótesis.

| Código | Qué hace el alumno | Por qué | Etiqueta | Fuente |
|---|---|---|---|---|
| TP-01 | Mezcla área y perímetro o selecciona una fórmula sin identificar qué magnitud necesita. | El procedimiento aprendido no está conectado con el significado de medir superficie o contorno. | DOCUMENTADO | Machaba, 2016, resultados y discusión [F05]. |
| TP-02 | Cree que conservar área también conserva perímetro, o que una compensación entre lados conserva ambas magnitudes. | Extiende una relación válida en un caso a otra magnitud y a otras transformaciones. | DOCUMENTADO | Machaba, 2016, análisis de la regla intuitiva «mismo A, mismo B» [F05]. |
| TP-03 | Suma una diagonal o una línea auxiliar interior al perímetro exterior. | Confunde todo lo dibujado con el contorno solicitado. | HIPÓTESIS | Propuesta de diagnóstico de esta unidad. |
| TP-04 | Al dividir una región, suma perímetros parciales sin descontar los bordes compartidos. | Cuenta dos veces una separación que no pertenece al borde de la unión. | HIPÓTESIS | Propuesta de diagnóstico. |
| TP-05 | Resta del perímetro todo lo que recorta, sin contar los bordes nuevos. | Interpreta quitar material como reducir necesariamente el contorno. | HIPÓTESIS | Propuesta; no se atribuye este caso específico al estudio [F05]. |
| TP-06 | Aplica el perímetro del rectángulo envolvente a cualquier figura escalonada. | Generaliza una compensación sin comprobar retrocesos o entrantes. | HIPÓTESIS | Propuesta de diagnóstico. |
| TP-07 | Usa el tamaño aparente del dibujo o supone igualdad sin dato ni marca. | Confunde representación esquemática con medición a escala. | HIPÓTESIS | Propuesta de diagnóstico. |
| TP-08 | Usa diámetro como radio, o interpreta una semicircunferencia como un círculo completo. | No identifica los elementos y la fracción de vuelta antes de operar. | HIPÓTESIS | Propuesta; relaciones matemáticas en [F08] y [F09]. |
| TP-09 | Suma solo el arco cuando se pide el perímetro de una región semicircular. | Omite el segmento recto que también limita la región. | HIPÓTESIS | Propuesta de diagnóstico. |
| TP-10 | Sustituye un arco por la cuerda o por una diagonal recta. | Confunde distancia directa entre extremos con longitud del camino. | HIPÓTESIS | Propuesta de diagnóstico. |
| TP-11 | Cree que cruzar un punto otra vez equivale a repetir una arista. | No distingue visita a un punto de recorrido de un tramo. | HIPÓTESIS | Propuesta; distinción en [F06] y [F07]. |
| TP-12 | Decide por el número de líneas o de esquinas, sin revisar entradas y salidas en cada unión. | Usa la apariencia global en lugar de la conectividad. | HIPÓTESIS | Propuesta de diagnóstico. |
| TP-13 | Empieza en cualquier punto aunque la figura tenga exactamente dos vértices impares. | Recuerda una regla incompleta que no incluye extremos. | HIPÓTESIS | Propuesta de diagnóstico. |
| TP-14 | Une componentes separados con un salto o inventa un atajo que no está dibujado. | Cambia silenciosamente los caminos permitidos. | HIPÓTESIS | Propuesta de diagnóstico. |
| TP-15 | Minimiza número de segmentos repetidos aunque los segmentos tengan longitudes diferentes. | Confunde contar aristas con sumar distancias. | HIPÓTESIS | Propuesta de diagnóstico. |
| TP-16 | Deja sin revisar los extremos fijados por el enunciado al corregir los puntos impares. | Aplica el caso de inicio libre a un problema con condiciones adicionales. | HIPÓTESIS | Propuesta; caso de examen en [F02]. |
| TP-17 | Compara recorridos que omiten una parte de la figura. | Optimiza antes de comprobar que la solución cumple la misión. | HIPÓTESIS | Propuesta de diagnóstico. |

Las hipótesis no son diagnósticos demostrados. Se pide señalar el borde o tramo que justificó la respuesta para distinguir lectura y cálculo. Un recorrido incompleto no valida una respuesta numérica correcta.

## 4. Lo que la unidad da por sabido

Se requieren suma y resta de longitudes, fracciones sencillas, proporcionalidad y conversión entre milímetro, centímetro y metro. Para reconstruir una diagonal se puede usar el teorema de Pitágoras si hay perpendicularidad explícita; se entrega su relación con las letras identificadas. No se presupone teoría de grafos.

Se requieren figuras elementales; la idea 3 recupera radio, diámetro y fracción de vuelta. La distinción entre área y perímetro se reconstruye en la idea 1.

La entrada comprueba qué se mide para rodear un objeto y cómo se comparan centímetros con milímetros. Si falla, se contrastan cinta y cubierta, o se representan las unidades.

Cada ejercicio entrega fórmulas y condiciones. P se reserva para perímetro; los vértices propios se llaman A, B, C, D y O. Los puntos P y Q mencionados al describir un examen pertenecen solo a esa fuente.

## 5. Las ideas, en orden

Se proponen cinco ideas. Primero se decide qué longitud representa la pregunta; después se reconstruyen bordes rectos y curvos; finalmente se estudian recorridos sobre redes. La primera pantalla siempre muestra un objeto. Los diagramas se obtienen resaltando sus bordes o conexiones, sin presentar inicialmente puntos y flechas aislados.

### Idea 1. Medir el borde correcto

**Pregunta que responde:** ¿qué debo recorrer para medir el perímetro y qué líneas debo dejar fuera?

**Aprendizaje:** el alumno distingue contorno exterior, bordes interiores, superficie y longitud de todos los trazos.

**Objeto de la primera pantalla:** un cartel de cartón de una feria escolar, con un borde que se protegerá con cinta. Se ve el cartel completo sobre una mesa; la cinta y el texto impreso permiten distinguir material, contorno y decoración. Las dimensiones son datos didácticos, no medidas de un cartel real.

#### Lee

1. «Para cubrir un cartel usamos una lámina. Para rodear su borde usamos cinta. Son necesidades distintas aunque se refieran al mismo objeto».
2. «El contorno separa una región de lo que queda fuera de ella. Puede tener tramos rectos o curvos».
3. «Un dibujo puede incluir líneas de adorno o de ayuda. Antes de medir conviene reconocer qué parte representa cada línea».
4. «Una medida de longitud indica cuánto se recorre siguiendo un camino. La unidad debe acompañar el resultado».

Las tarjetas presentan palabras y situación; no preguntan por el cartel ni muestran cómo cambia su perímetro cuando se dibuja una línea interior.

#### Juega

El alumno desliza una cinta virtual por el borde de un cartel rectangular sin divisiones interiores. También puede avanzar seleccionando cada lado mediante botones. La misión es cubrir todo el contorno exactamente una vez, cerrar en el punto de partida y no dejar tramos sobrantes. El programa comprueba qué bordes se cubrieron y con qué multiplicidad.

Se habilita después una segunda vista del mismo cartel girado. El alumno debe encontrar el mismo contorno sin depender de que un lado quede horizontal. El contador de longitud usa las medidas declaradas, no los píxeles de la imagen. El juego no presenta una diagonal interior, que queda reservada para la predicción.

#### Predice

En el mismo cartel se imprime una diagonal que divide visualmente la superficie en dos triángulos, sin cortar el cartón. **¿Cómo cambia la cinta necesaria para rodear únicamente su borde exterior?**

| Opción | Respuesta | Relación con el error |
|---|---|---|
| A | Aumenta en la longitud de la diagonal, porque toda línea dibujada se suma. | Incorrecta: TP-03; incorpora una línea interior. |
| B | No cambia: el borde exterior sigue siendo el mismo. | Correcta. |
| C | Se suman los perímetros de los dos triángulos, contando la diagonal en ambos. | Incorrecta: TP-04; cuenta dos veces una separación interna. |
| D | Se calcula multiplicando las dos dimensiones del cartel, porque interesa todo el cartón. | Incorrecta: TP-01; sustituye longitud de borde por área. |

#### Mira

La cinta recorre exactamente el borde anterior. La diagonal queda visible pero sin cubrir. Se muestran dos preguntas diferentes sobre el mismo objeto: rodear el cartel y repasar todas las líneas impresas. Cada una resalta un conjunto distinto. El programa explica que la longitud no cambió porque no se modificó el conjunto de puntos del borde, no porque «las diagonales nunca cuentan».

#### La regla

El perímetro es la longitud del borde de una región. En un polígono simple se obtiene sumando sus lados completos, sin repetirlos. Se escribirá P para el perímetro y ℓ₁, ℓ₂, … para longitudes de tramos; ℓ se lee «ele». Si hay n tramos, n significa cantidad de tramos y no una longitud:

$$P=\ell_1+\ell_2+\cdots+\ell_n.$$

Se delimita primero la región solicitada. Una línea interior de decoración no cuenta; una línea que limita una región específica sí puede contar. Si se pide perímetro exterior, se excluyen los bordes de agujeros interiores. Si se pide longitud total de todos los bordes, se incluyen los exteriores y los de los agujeros. El banco dirá expresamente cuál de esas magnitudes requiere cuando haya huecos, evitando una convención oculta.

Para un rectángulo de ancho a y alto b, ambos longitudes positivas, P = 2a + 2b. Para un cuadrado de lado a, P = 4a. Estas expresiones abrevian la suma de lados iguales; no sustituyen la identificación del borde. Para un polígono regular se usa s como longitud de cada lado: P = ns, porque se suman n lados iguales. La igualdad de lados se basa en una propiedad o una marca del enunciado, no en la apariencia [F08].

La unidad de P es una unidad de longitud: mm, cm o m según los datos. No se escribe cm², que corresponde a superficie. Se convierten unidades antes de sumar. El área describe cuánto espacio ocupa una región; tener igual área no garantiza igual perímetro, y tener igual perímetro no garantiza igual área [F05].

Si dos regiones se unen por un borde común de longitud c, sin superponerse en superficie y sin otros contactos que alteren el conteo, la suma de sus perímetros cuenta ese borde dos veces. El perímetro de la unión es la suma de ambos perímetros menos 2c. La letra c se reserva para longitud total de contacto compartido en este tipo de comparación. La justificación es contar qué bordes quedan expuestos, no memorizar una resta.

#### Palabras nuevas

**Contorno:** camino que sigue el límite elegido de una región. Ejemplos: borde de un cartel; borde exterior de una ficha; borde de una ventana circular del cartón cuando se pide medir ese hueco.

**Perímetro:** longitud total de ese borde. Ejemplos: cinta para rodear una tarjeta; cerco idealizado de un patio; ribete de una pieza plana de tela.

**Borde compartido:** tramo donde dos piezas se tocan y que deja de estar expuesto al unirlas. Ejemplos: unión de dos cuadrados por un lado; contacto parcial de dos rectángulos; separación entre dos piezas de un rompecabezas ya armado.

#### Así se resuelve

Ejemplo propio: se unen dos tarjetas rectangulares por un lado completo de longitud b. Cada tarjeta tiene ancho a y alto b. Se pide la cinta para el contorno exterior del conjunto, sin cubrir la unión.

1. Se identifican los bordes exteriores antes de escribir una fórmula. El segmento común queda dentro del conjunto.
2. Cada tarjeta aporta 2a + 2b si se mide por separado. La suma provisional es 4a + 4b.
3. El borde común b aparece dos veces en esa suma; ambas apariciones se eliminan porque ninguna queda expuesta.
4. Resulta P = 4a + 2b. Se comprueba observando el rectángulo completo, de ancho 2a y alto b.
5. La respuesta conserva unidad de longitud. Si hubiera separación entre tarjetas, ya no podría aplicarse esta unión: cambiaría el objeto que se mide.

#### Ahora tú

- Seleccionar el borde solicitado entre líneas interiores y exteriores de objetos sencillos.
- Obtener un perímetro con todos los lados dados y unidades compatibles.
- Convertir unidades y justificar si una marca permite considerar lados iguales.
- Unir piezas sin superposición y descontar contactos compartidos, incluidos contactos parciales declarados.
- Nivel de examen: comparar expresiones de perímetro y decidir qué datos bastan. Incluir una afirmación que confunda conservar superficie con conservar longitud del borde.

**Retroalimentación:** ante una diagonal añadida se pide mostrar dónde apoyaría la cinta; ante una fórmula de área, elegir entre tira y lámina.

### Idea 2. Lo que desaparece y lo que aparece

**Pregunta que responde:** ¿cómo cambia un perímetro cuando se recorta una esquina o se introduce una muesca?

**Aprendizaje:** el alumno compara bordes eliminados y nuevos, y reconstruye longitudes mediante alineaciones justificadas.

**Objeto de la primera pantalla:** una pieza de cartón para rotular un puesto de feria. Se debe adaptar a una esquina de la mesa sin perder la referencia de cuánto ribete necesita. Primero se ve el cartón sobre la mesa; al seleccionarlo aparecen las medidas y el contorno.

#### Lee

1. «Recortar cambia el material y puede cambiar su borde. Conviene mirar los tramos que desaparecen y los que quedan recién expuestos».
2. «Una muesca es una entrada en el borde. Una esquina recortada y una entrada en medio de un lado no dejan el mismo contorno».
3. «Las medidas que faltan pueden reconstruirse cuando los segmentos están alineados y sus posiciones están indicadas».
4. «Un dibujo esquemático comunica relaciones. No promete que cada centímetro de pantalla represente la misma longitud real».

#### Juega

El alumno mueve dos controles que fijan el tamaño de un recorte rectangular en una esquina de la pieza. Se muestran el borde anterior y el nuevo, en vistas alternas. La misión es emparejar cada tramo retirado con un tramo nuevo de igual longitud, hasta demostrar qué ribete puede reutilizarse. El recorte debe permanecer dentro de la pieza y dejar una región conectada.

El comprobador valida correspondencias de longitud, no una coincidencia de colores. El alumno puede desplazar virtualmente los tramos para compararlos, pero la pieza no cambia de tamaño mientras lo hace. Todas las medidas pertenecen al modelo didáctico. El juego solo recorta una esquina; la entrada situada en medio de un lado no se muestra todavía.

#### Predice

En una pieza rectangular nueva se recorta una muesca rectangular desde el medio del lado superior, sin llegar a otros lados. Se conocen su ancho y su profundidad, ambos positivos. **¿Qué pasa con el perímetro exterior frente al rectángulo original?**

| Opción | Respuesta | Relación con el error |
|---|---|---|
| A | Disminuye necesariamente, porque se quitó cartón. | Incorrecta: TP-05; confunde cantidad de material y longitud de borde. |
| B | Se conserva porque el rectángulo que envuelve la pieza no cambió. | Incorrecta: TP-06; extiende una compensación a una muesca interior. |
| C | Aumenta: aparecen los dos costados de la entrada y se conserva la longitud horizontal retirada mediante el fondo. | Correcta. |
| D | No puede decidirse sin medir el dibujo en la pantalla. | Incorrecta: TP-07; ignora las relaciones y medidas declaradas. |

#### Mira

Se resalta el tramo superior retirado. El fondo de la muesca tiene el mismo ancho, por lo que sustituye esa longitud. Los dos costados quedan sin pareja que los compense. La app recorre el borde nuevo y muestra que son longitudes adicionales. Después vuelve al recorte de esquina del juego para comparar por qué allí la compensación sí era completa.

#### La regla

Al modificar una región, el perímetro nuevo se obtiene del anterior restando la longitud de borde que desaparece y sumando la que se crea. Se seguirá siempre el contorno resultante para confirmar que no quedaron tramos omitidos o contados dos veces. Esta es una aplicación del conteo de bordes de la idea 1, no una fórmula independiente que deba memorizarse.

En el recorte rectangular de una esquina se eliminan dos tramos perpendiculares y aparecen otros dos de las mismas longitudes. Mientras el recorte no alcance el lado opuesto ni desconecte la pieza, el perímetro se conserva. Cambia la superficie, lo que proporciona un contraejemplo a la creencia de que área y perímetro necesariamente varían juntos.

En una muesca rectangular introducida desde el interior de un lado, se elimina un tramo de cierto ancho y aparece un fondo del mismo ancho. Además aparecen dos tramos de profundidad h, donde h significa profundidad de la muesca. Por eso el perímetro aumenta en 2h. La conclusión exige una muesca perpendicular al lado, sin atravesar toda la figura ni superponerse con otra. Si cambian esas condiciones, se vuelve a contar bordes.

En una figura formada por segmentos horizontales y verticales se pueden sumar proyecciones por dirección. Un recorrido escalonado que va de un extremo a otro sin retroceder horizontalmente tiene longitud horizontal total igual a la separación horizontal de sus extremos; lo mismo ocurre verticalmente si no hay retroceso vertical. Al aparecer una entrada y una salida, las dos distancias se recorren y ambas cuentan. La distancia neta entre extremos no reemplaza la longitud del camino.

Para una figura cerrada, el avance total hacia la derecha iguala al avance total hacia la izquierda; el total hacia arriba iguala al total hacia abajo. Esto permite reconstruir sumas de lados que no tienen dato individual. No autoriza a reemplazar cualquier contorno por su rectángulo envolvente: las entradas pueden añadir recorridos opuestos que se cancelan en desplazamiento pero se suman en longitud.

Si un lado oblicuo necesita reconstruirse, se usa una relación geométrica justificada. En un triángulo rectángulo con catetos u y v, longitudes perpendiculares, e hipotenusa w, la relación de Pitágoras es w² = u² + v². Las letras u, v y w se reservan a esos tres papeles en toda la unidad. Si no se demuestra el ángulo recto, esa relación no está autorizada. Para lados iguales se requiere regularidad, congruencia, simetría declarada u otra propiedad, no simple semejanza visual.

#### Palabras nuevas

**Muesca:** entrada que interrumpe un borde. Ejemplos: hueco rectangular desde un lado; entrada para dejar pasar una pata de mesa; recorte que forma dos costados y un fondo.

**Compensar:** sustituir una longitud retirada por otra igual. Ejemplos: mover un tramo horizontal sin cambiar su medida; reemplazar un borde de esquina por otro paralelo; comparar el fondo de una muesca con su abertura.

**Retroceso:** parte del recorrido que vuelve en una dirección contraria. Ejemplos: bajar y subir dentro de una entrada; avanzar a la derecha y regresar a la izquierda; entrar a un pasillo y volver al mismo cruce.

#### Así se resuelve

Ejemplo propio: una etiqueta rectangular tiene ancho a y alto b. Se introduce una muesca de profundidad h desde el centro de su lado superior; el recorte no toca los otros lados. Se pide expresar el perímetro nuevo.

1. El perímetro inicial es 2a + 2b, obtenido al recorrer los cuatro lados.
2. Se comparan abertura y fondo de la muesca. Sus longitudes son iguales, por lo que la resta de la abertura y la suma del fondo se compensan.
3. Se identifican los dos costados nuevos, ambos de longitud h. Ninguno reemplaza un borde anterior.
4. El resultado es P = 2a + 2b + 2h. Se verifica siguiendo el borde completo en una sola vuelta, sin sumar una línea ficticia sobre la abertura.
5. La anchura de la muesca no aparece en la expresión final, pero sí debe cumplir las condiciones geométricas del caso. Que un dato se cancele no significa que cualquier recorte sea posible.

#### Ahora tú

- Comparar piezas antes y después de un recorte e identificar bordes nuevos y eliminados.
- Reconstruir lados faltantes mediante sumas de segmentos alineados.
- Resolver contornos escalonados diferenciando avances netos y retrocesos.
- Contrastar recorte de esquina, muesca lateral y hueco interior; el enunciado precisa qué bordes se miden.
- Nivel de examen: encontrar una expresión de perímetro con datos parciales, justificar cancelaciones y detectar información insuficiente. Si hay un corte diagonal, se entrega la relación de Pitágoras y se exige comprobar perpendicularidad.

**Transferencia:** comparar escaleras sin retrocesos con un contorno que incorpora un entrante. El alumno identifica qué condición cambió.

### Idea 3. El borde también puede curvarse

**Pregunta que responde:** ¿cómo combino segmentos y arcos sin confundir circunferencia, región circular y distancia entre extremos?

**Aprendizaje:** el alumno identifica la fracción de vuelta de cada arco y suma únicamente las partes del borde solicitado.

**Objeto de la primera pantalla:** una moneda peruana utilizada como plantilla junto a una tarjeta de cartón. Primero se reconocen moneda y cartón; después se idealiza el borde circular. El relieve interior no se convierte en perímetro. El diámetro de una emisión concreta puede tomarse del dato institucional de la sección 8, con su alcance indicado.

#### Lee

1. «Una circunferencia es un borde circular. La región que encierra incluye la superficie de dentro».
2. «El radio va del centro al borde. El diámetro atraviesa el centro y une dos puntos del borde».
3. «Un arco es una parte del camino circular. La cuerda une sus extremos mediante un segmento recto».
4. «La misma curva puede pertenecer al borde de una región o ser una línea interior. El encargo decide qué partes medir».

#### Juega

El alumno coloca un cordón virtual sobre arcos de una misma circunferencia: un cuarto, media vuelta y tres cuartos. Puede girar las piezas curvas y reunirlas. La misión es formar exactamente una vuelta con las piezas disponibles, sin superponer tramos ni dejar huecos. Se comprueba la fracción total y la igualdad del radio de las piezas.

Una segunda prueba ofrece un arco de otro radio para que no baste sumar fracciones de vueltas de círculos diferentes. El programa pide justificar cuál pieza no pertenece al mismo borde. El juego mide únicamente curvas; todavía no pide el contorno de una región semicircular, que incluirá un segmento recto.

#### Predice

Se corta una tarjeta circular por un diámetro y se conserva una de las mitades. **¿Qué debe incluir la cinta para rodear todo el borde de esa pieza semicircular?**

| Opción | Respuesta | Relación con el error |
|---|---|---|
| A | Solo la curva de media vuelta. | Incorrecta: TP-09; omite el borde recto creado por el corte. |
| B | Una circunferencia completa, porque la plantilla original era un círculo. | Incorrecta: TP-08; usa una vuelta entera en lugar de la parte conservada. |
| C | Dos segmentos iguales al diámetro, sustituyendo la curva por su unión recta. | Incorrecta: TP-10; cambia arco por cuerda. |
| D | La curva de media vuelta y el diámetro que cierra la pieza. | Correcta. |

#### Mira

La cinta empieza en un extremo del corte, sigue la curva y regresa por el borde recto. Se muestran ambos tramos separados antes de sumarlos. La app contrasta «longitud de la semicircunferencia» con «perímetro de la región semicircular»; la diferencia proviene de qué conjunto se mide, no de dos fórmulas contradictorias.

#### La regla

Se escribirá r para radio, d para diámetro y π para la constante pi, sin unidad. Se cumple d = 2r. La longitud de una circunferencia es 2πr, equivalente a πd. Esta relación debe entregarse en los ejercicios; elegir entre radio y diámetro forma parte de la tarea [F08].

Un arco corresponde a una fracción de la vuelta de su propio círculo. Si θ, leído «theta», es su ángulo central expresado en grados, su longitud es:

$$\ell_{\mathrm{arco}}=\frac{\theta}{360^\circ}\,2\pi r.$$

Si el ángulo central se expresa mediante su medida en radianes, se usa ℓ del arco = rθ, con θ en radianes. Un radián corresponde al ángulo que recorta un arco tan largo como el radio. No se introduce un número en grados dentro de la expresión para radianes sin convertirlo. El alumno puede mantener grados y fracción de vuelta durante toda la práctica básica [F09].

La semicircunferencia tiene longitud πr; la región semicircular tiene perímetro πr + 2r, porque incorpora el diámetro. Un sector circular propio, con ángulo mayor que cero y menor que una vuelta, tiene borde compuesto por su arco y dos radios; su perímetro es ℓ del arco + 2r. No se extiende esa expresión al disco completo sumando radios internos que no forman parte de su borde.

En una figura compuesta, se identifica cada tramo del contorno y se decide si es recto o circular. Para cada arco se indica centro, radio y fracción de vuelta, o datos equivalentes que permitan obtenerlos. Dos arcos de igual longitud no necesitan tener igual forma, pero no se pueden reunir sus ángulos como si pertenecieran al mismo radio cuando sus radios difieren.

Si varios semicírculos tienen diámetros contiguos que suman una longitud total d, la suma de sus arcos es πd/2. La relación surge de sumar π veces cada diámetro dividido entre dos. No describe automáticamente el perímetro de una región: todavía se decide qué segmentos rectos o arcos adicionales pertenecen a su borde. Tampoco exige que los semicírculos tengan igual tamaño.

Se conserva π en el resultado exacto cuando así se pide. Si la consigna entrega una aproximación de π, se aplica al final, evitando redondeos sucesivos. Un dibujo deformado o una fotografía oblicua de una moneda no autoriza medir su radio en píxeles; se usan las medidas declaradas.

#### Palabras nuevas

**Radio:** distancia del centro a un punto del borde circular. Ejemplos: centro a borde de una moneda idealizada; centro a borde de una tapa; radio común de varios arcos de una misma circunferencia.

**Arco:** camino curvo que forma parte de una circunferencia. Ejemplos: cuarto de vuelta; media vuelta; tres cuartos de vuelta.

**Cuerda:** atajo recto entre dos puntos del borde circular. Ejemplos: diámetro; segmento que une extremos de un cuarto de vuelta; segmento que une dos puntos cercanos del borde.

#### Así se resuelve

Ejemplo propio: una tarjeta con forma de semicírculo tiene diámetro d. Se pide ribetear todo el contorno.

1. Se recorre visualmente el borde: hay un arco de media vuelta y un segmento de longitud d.
2. Se identifica r = d/2; el dato inicial es diámetro, no radio.
3. El arco mide πr = πd/2. El segmento recto permanece como d.
4. El perímetro es P = πd/2 + d. La expresión tiene unidad de longitud en ambos términos.
5. Como comprobación, al reunir dos tarjetas por sus diámetros, esos lados quedan internos. El contorno de la unión sería el círculo completo, no dos veces el perímetro de una tarjeta.

#### Ahora tú

- Distinguir radio, diámetro, arco y cuerda sobre un objeto idealizado.
- Calcular longitud de un arco con fracción de vuelta y radio declarados.
- Calcular perímetros de semicírculos y sectores, indicando sus tramos rectos.
- Reunir arcos de diferentes diámetros mediante una suma justificada, sin sumar ángulos indebidamente.
- Nivel de examen: evaluar suficiencia de información para una suma de longitudes circulares y resolver contornos mixtos con bordes interiores que no se deben contar. Las definiciones de cualquier promedio empleado se proporcionan.

**Retroalimentación:** recorrer el borde pendiente permite detectar el diámetro omitido. Superponer dos radios sobre el diámetro corrige la confusión entre ambos.

### Idea 4. Entrar y salir sin repetir

**Pregunta que responde:** ¿puedo repasar todos los tramos de una figura sin levantar el lápiz ni recorrer dos veces un mismo tramo?

**Aprendizaje:** el alumno explica la condición de un solo trazo a partir de entradas y salidas en cada unión.

**Objeto de la primera pantalla:** una maqueta de reja de ventana dibujada sobre cartón. El alumno repasará cada varilla con un plumón virtual para comprobar un diseño. La reja completa aparece antes de convertirse en una red de puntos y tramos; se aclara que se mide el eje idealizado de cada varilla, sin ancho de pintura.

#### Lee

1. «Para repasar una figura importa qué tramos se conectan. Dos diseños con formas distintas pueden permitir los mismos recorridos».
2. «Un vértice es un punto donde un tramo termina o se une con otros. Una arista es un tramo entre dos de esos puntos».
3. «Volver a un punto no significa necesariamente volver a pasar por el mismo tramo».
4. «La consigna puede permitir o prohibir levantar el lápiz y repetir tramos. Esas condiciones forman parte del problema».

#### Juega

La reja inicial es un marco rectangular sin diagonales. El alumno elige un punto de inicio y repasa sus cuatro tramos. La misión es cubrirlos todos exactamente una vez, sin levantar el plumón, y volver al inicio. El programa registra los tramos usados, no solo los puntos tocados. Se puede deshacer una elección y se acepta recorrer en cualquiera de los dos sentidos.

Después se deforma visualmente el marco sin añadir ni quitar conexiones. La misión sigue siendo la misma. Esta variación permite separar conectividad y apariencia, pero no introduce un punto con tres conexiones; esa novedad aparece en la predicción. No se entrega todavía la regla de paridad.

#### Predice

La nueva maqueta es un rectángulo cuyos vértices, en orden alrededor del borde, son A, B, C y D. Se agrega una sola diagonal entre A y C. **¿Qué afirmación describe correctamente un recorrido por sus cinco tramos, sin levantar el plumón ni repetir un tramo?**

| Opción | Respuesta | Relación con el error |
|---|---|---|
| A | Es posible empezando en A y terminando en C, o al revés. | Correcta. |
| B | Es posible empezando en cualquiera de las cuatro esquinas, como en el marco anterior. | Incorrecta: TP-13; omite la condición sobre extremos. |
| C | Es imposible porque habría que volver a algún punto, aunque no se repita un tramo. | Incorrecta: TP-11; confunde repetir vértice y repetir arista. |
| D | Es imposible porque el total de tramos es impar. | Incorrecta: TP-12; aplica paridad al total equivocado. |

#### Mira

Se reproduce un recorrido válido: A–B–C–D–A–C. Cada tramo se ilumina al usarse; la diagonal se usa una sola vez. A y C pueden visitarse más de una vez sin repetir una arista. Luego se marcan las conexiones de cada esquina: A y C tienen tres; B y D, dos. Al comenzar en B, el intento queda sin poder completar todos los tramos bajo la misma condición.

#### La regla

La figura se representa como una red no dirigida: se puede recorrer cada arista en ambos sentidos, salvo que el enunciado indique algo distinto. Una arista termina en un vértice o conecta dos vértices; su curvatura no cambia sus extremos. Si dos líneas se cruzan, el dibujo debe indicar si hay unión. Un cruce con paso por encima no permite cambiar de camino; una intersección conectada sí. No se debe adivinar esta diferencia por el grosor de las líneas.

El grado de un vértice es la cantidad de extremos de aristas que llegan a él. Se escribirá g(A) para el grado de A. Un lazo que sale y vuelve al mismo vértice aporta dos, porque tiene dos extremos allí. Dos aristas distintas entre los mismos puntos se cuentan por separado. Un punto agregado en medio de un tramo lo divide en dos y tiene grado dos; esa división no cambia la posibilidad de trazar el conjunto.

La red es conexa cuando todos los tramos pertenecen a una sola pieza accesible siguiendo conexiones. Para un trazo que cubre aristas, los puntos aislados sin tramos no se cuentan como obstáculos. Si hay dos piezas con aristas y no existe conexión entre ellas, no se recorren ambas sin levantar el lápiz o añadir un camino prohibido.

En una red conexa con al menos una arista, un recorrido que usa cada arista exactamente una vez y regresa al inicio existe si y solo si todos los grados son pares. Si el recorrido empieza y termina en puntos diferentes, existe si y solo si hay exactamente dos vértices impares; se empieza en uno y se termina en el otro. Con más de dos impares no existe un recorrido único sin repeticiones [F06] [F07].

La razón de la paridad es local. En un punto intermedio, cada llegada necesita una salida; esas conexiones se agrupan por pares. El inicio de un recorrido abierto tiene una salida que no se empareja con una llegada anterior; el final tiene una llegada sin salida posterior. Por eso los dos extremos abiertos son impares y los demás son pares. Cuando se vuelve al inicio, también allí se emparejan llegada y salida.

La condición de paridad explica la posibilidad, pero un intento torpe puede cerrar una parte demasiado pronto. Para construir un recorrido en ejemplos pequeños, se empieza donde corresponde y se evita consumir un puente del conjunto de aristas todavía no usadas si existe otra opción. Un puente es un tramo cuya retirada separa la parte que aún debe recorrerse. Si es la única salida, se usa. Esta estrategia se presenta con demostración visual, no como una contraseña que el alumno memoriza [F07].

No se identifica «impar» con «punta suelta». Una punta tiene grado uno y es impar, pero una unión de tres o cinco tramos también es impar. Tampoco se deduce conexión a partir de que todos los grados sean pares: dos marcos separados tienen grados pares y siguen siendo dos piezas distintas.

#### Palabras nuevas

**Vértice:** punto que sirve como unión o extremo de tramos. Ejemplos: esquina del marco; encuentro de tres varillas; extremo libre de una rama.

**Arista:** tramo que se recorre entre uniones o extremos. Ejemplos: lado de una reja; diagonal completa entre dos esquinas; arco curvo entre dos uniones.

**Grado:** número de conexiones que se cuentan en una unión. Ejemplos: dos en una esquina sin ramificación; tres en una unión en forma de T; cuatro en un cruce conectado de dos líneas.

**Conexo:** hecho de una sola pieza a la que se puede acceder por sus conexiones. Ejemplos: un marco; dos marcos unidos por una varilla; una red con ramas que llegan a una misma unión.

#### Así se resuelve

Ejemplo propio: un marco triangular tiene vértices A, B y C. Desde A sale una varilla adicional hasta D, que queda fuera del triángulo. Se pide decidir si puede repasarse sin repetir tramos.

1. Se comprueba que todos los tramos se conectan a la misma pieza. No hay que saltar entre figuras.
2. Se cuentan grados: A tiene tres conexiones; B y C tienen dos; D tiene una. Solo A y D son impares.
3. La regla permite un recorrido abierto que empiece en uno de ellos y termine en el otro. No autoriza empezar en B.
4. Se construye D–A–B–C–A. Se revisa la lista de tramos: DA, AB, BC y CA aparecen exactamente una vez.
5. A aparece dos veces en la lista de vértices, lo cual está permitido. La comprobación se hace sobre aristas recorridas, no sobre cantidad de visitas a un punto.

#### Ahora tú

- Identificar uniones, pasos por encima y extremos en objetos idealizados con leyenda explícita.
- Contar grados, incluyendo un lazo o dos caminos distintos entre los mismos puntos.
- Decidir si un conjunto es conexo antes de usar la regla de pares e impares.
- Elegir inicios y finales válidos y construir un recorrido que cubra todos los tramos.
- Nivel de examen: comparar varias figuras o recorridos candidatos, incluyendo una figura desconectada de grados pares y otra conexa con dos impares que no son puntas sueltas.

**Comprobación:** emparejar llegadas y salidas en una unión y explicar por qué dos marcos separados no permiten un solo trazo aunque todos sus grados sean pares.

### Idea 5. Repetir lo necesario y nada más

**Pregunta que responde:** si un solo trazo sin repeticiones no basta, ¿cómo comparo soluciones válidas y encuentro la mínima?

**Aprendizaje:** el alumno distingue cantidad mínima de trazos de longitud mínima recorrida y justifica repeticiones según los extremos exigidos.

**Objeto de la primera pantalla:** una plantilla de dibujo para un letrero de feria, con rutas por donde debe pasar un plumón. Al lado se muestran dos encargos: ahorrar levantadas del plumón o reducir la distancia total repasada. El objeto permite ver que son objetivos diferentes, aunque utilicen la misma plantilla.

#### Lee

1. «Un trazo continuo va desde que el plumón toca la plantilla hasta que se levanta. Puede visitar varias uniones».
2. «A veces la consigna permite varias levantadas, pero prohíbe repetir un tramo. Otras veces exige una sola pasada continua y permite repeticiones».
3. «Mínimo significa que ninguna solución válida mejora la cantidad que se pidió reducir. Antes de comparar hay que comprobar que se cubrió todo».
4. «Si los tramos tienen medidas diferentes, contar cuántos se repiten no basta para conocer la distancia repetida».

#### Juega

La plantilla es una red conexa con cuatro puntos impares y longitudes visibles. El alumno puede levantar el plumón y elegir otro punto de inicio. La misión es cubrir cada arista una vez usando exactamente dos trazos continuos. El comprobador controla cobertura, ausencia de repeticiones y cantidad de trazos. No cuenta como repetición volver a un vértice por otra arista.

La pantalla conserva los extremos de cada trazo para que el alumno los relacione con los puntos impares. Después se le pide demostrar que un solo trazo sin repeticiones no basta usando la regla de la idea 4. El juego no permite repetir tramos; la predicción introduce una misión distinta que sí los permite y fija inicio y final.

#### Predice

Una plantilla en forma de T tiene unión O y extremos A, B y C. Los únicos tramos son OA, OB y OC, con longitudes didácticas de 4 cm, 6 cm y 3 cm, respectivamente. Se exige empezar en A, terminar en B y pasar por todos los tramos en un solo recorrido continuo. **¿Qué plan cumple la misión con la menor repetición necesaria?**

| Opción | Respuesta | Relación con el error |
|---|---|---|
| A | Recorrer A–O–B, porque es el camino más corto entre los extremos pedidos. | Incorrecta: TP-17; deja sin recorrer OC. |
| B | Recorrer A–O–C–O–B, repitiendo el tramo OC. | Correcta. |
| C | Empezar en C y terminar en B, porque así se eligen otros extremos que parecen convenientes. | Incorrecta: TP-16; cambia el inicio fijado. |
| D | Ir de A a O, de O a C y directamente de C a B por un atajo no dibujado. | Incorrecta: TP-14; inventa una conexión. |

#### Mira

El plumón llega de A a O, visita C y debe volver por OC, porque C no tiene otra salida. Después llega a B. La repetición no se debe a una mala elección: visitar C sin terminar allí obliga a entrar y salir por su único tramo. El programa contrasta con un caso de extremos libres y muestra que cambiar la condición puede cambiar la solución admisible.

#### La regla

Primero se lee qué se minimiza. Para cubrir todas las aristas sin repetirlas, permitiendo levantar el lápiz y elegir libremente los extremos, una componente conexa con aristas y con i vértices impares requiere como mínimo k trazos, donde i es cantidad de vértices impares y k es cantidad de trazos. Si i = 0, k = 1; si i es positivo, k = i/2. Una componente sin aristas no requiere trazo de longitud positiva. En varias componentes con aristas se suman sus mínimos.

La justificación tiene dos partes. Cada trazo abierto aporta como máximo dos extremos impares, de modo que no pueden cubrirse i impares con menos de i/2 trazos. Para mostrar que ese número se alcanza, se emparejan provisionalmente los impares con conexiones auxiliares, se obtiene un circuito de grados pares y se cortan después esas conexiones auxiliares: quedan los trazos sobre las aristas originales. Las conexiones provisionales son una demostración, nunca caminos permitidos en la solución final. Si el problema fija extremos o limita dónde levantar el lápiz, se revisan esas condiciones; la fórmula simple puede dejar de bastar.

Para una sola trayectoria que cubra todos los tramos y permita repeticiones, se escribe L para la suma de longitudes de las aristas originales, cada una contada una vez; R para la longitud adicional debida a repeticiones; y T para la longitud total recorrida. Entonces T = L + R. Repetir un tramo dos veces adicionales agrega dos veces su longitud a R. Esta contabilidad no es una nueva fórmula geométrica: registra cuántas veces se recorrió cada parte.

Una repetición se representa duplicando una arista existente. No se agregan atajos. Repetir un camino entre dos vértices cambia la paridad de sus extremos; los vértices interiores reciben dos conexiones adicionales y conservan su paridad. Para un circuito cerrado hay que dejar todos los grados pares. Para un recorrido abierto con inicio y final distintos fijados, se busca dejar impares exactamente esos dos vértices, aunque uno de ellos fuera originalmente par [F06] [F07].

En redes pequeñas se puede resolver de manera verificable: se marcan los vértices cuya paridad debe cambiar; se enumeran sus emparejamientos posibles; para cada pareja se encuentra el camino permitido de menor longitud; y se compara la suma de longitudes añadidas de cada emparejamiento. Con cuatro vértices por corregir existen tres emparejamientos distintos que se pueden listar. Si se exige un regreso al inicio se corrigen todos los impares; si se fijan dos extremos distintos, se invierte la condición de esos dos al decidir cuáles corregir.

Si inicio y final son libres, se comparan posibilidades de extremos o se dejan sin corregir dos impares cuando eso produce el mínimo admisible. Si la red ya permite una sola pasada, R puede ser cero. Una red desconectada no se vuelve recorrible solo repitiendo sus aristas: sigue sin haber camino entre componentes. Las condiciones de conexión se comprueban antes de buscar mínimos.

Para justificar un mínimo se necesita una cota que ninguna solución pueda mejorar y un recorrido que alcance esa cota. «Probé varios y este salió más corto» no prueba que no exista otro mejor. En la plantilla en T, la obligación de entrar y salir de la rama restante da esa cota; en redes pequeñas con más alternativas, la comparación exhaustiva de emparejamientos permite justificarla. El banco no exigirá algoritmos generales ni redes que hagan impracticable esa revisión en un celular.

No se confunde número de aristas repetidas con distancia: una arista larga puede costar más que dos cortas. También se distingue longitud de todo el dibujo y perímetro exterior. En una reja con diagonales, L incluye diagonales que el perímetro exterior excluiría. Para obtener L se usan las longitudes de las ideas anteriores y se cuentan los tramos distintos, sin duplicar una intersección.

#### Palabras nuevas

**Trazo continuo:** recorrido realizado sin levantar el lápiz. Ejemplos: una vuelta al marco; recorrido abierto entre dos puntas; un recorrido con una repetición permitida.

**Repetición:** paso adicional por una arista ya recorrida. Ejemplos: ida y vuelta por una rama; segundo paso por una diagonal; regreso por parte de un arco utilizado.

**Mínimo:** mejor valor entre soluciones que cumplen todas las condiciones. Ejemplos: menos trazos sin repetir; menos centímetros adicionales; menor recorrido con inicio y final fijados.

#### Así se resuelve

Ejemplo propio: en la T de la predicción se pide comparar el encargo de varios trazos sin repetición con el encargo de un solo recorrido desde A hasta B.

1. Los grados son tres en O y uno en A, B y C: hay cuatro impares. Si los extremos son libres y se permite levantar el lápiz, se necesitan al menos dos trazos.
2. Se alcanza esa cantidad con A–O–B y O–C. Cada arista aparece una vez, de modo que la cota se cumple.
3. Para el encargo continuo de A a B, C no puede ser el final. Visitarlo obliga a recorrer OC de ida y de vuelta. Por ello R es al menos la longitud de OC.
4. El recorrido A–O–C–O–B cumple todo y repite únicamente OC. Alcanza la cota y demuestra el mínimo.
5. La expresión de distancia es T = (4 + 6 + 3) cm + 3 cm = 16 cm. El primer paréntesis cuenta la estructura una vez; el último término, el paso adicional. Son datos de ejemplo, no una medición real.
6. Se verifica que el resultado cambia si se pide regresar a A o si se permite terminar en C. No se traslada una respuesta a un encargo diferente sin revisar condiciones.

#### Ahora tú

- Determinar cantidad mínima de trazos sin repeticiones en una componente pequeña.
- Sumar mínimos de componentes separadas, distinguiendo levantadas de tramos añadidos.
- Calcular L y R a partir de un recorrido dado y localizar aristas omitidas.
- Construir un recorrido mínimo con dos extremos fijados y una o dos ramas que obligan a volver.
- Nivel de examen: comparar emparejamientos de hasta cuatro vértices por corregir, con longitudes distintas y un camino alternativo. Dar tanto el argumento del mínimo como un recorrido que lo alcance.

**Evaluación:** comprobar cobertura, legalidad, extremos, repeticiones y objetivo. Un recorrido que omite una arista es inválido aunque resulte corto.

## 6. Tabla de letras y símbolos de la unidad

| Letra o símbolo | Significado único | Unidad y observación |
|---|---|---|
| P | Perímetro de la región indicada. | mm, cm o m. No se usa como nombre de punto. |
| ℓ, ℓ₁, ℓ₂ | Longitud de un tramo; los subíndices distinguen tramos. | Unidad de longitud. Se lee «ele», no «uno». |
| a, b | Ancho y alto del rectángulo de referencia. | Unidad de longitud; a también es el lado cuando ese rectángulo es cuadrado. |
| s | Longitud de cada lado de un polígono regular. | Unidad de longitud; no significa segundo. |
| c | Longitud total del borde de contacto compartido en la unión de dos piezas. | Unidad de longitud. No es hipotenusa. |
| h | Profundidad perpendicular de una muesca. | Unidad de longitud; no se reutiliza como altura de otro objeto. |
| u, v, w | Catetos y, respectivamente, hipotenusa del triángulo rectángulo auxiliar. | Unidad de longitud. No son nombres de puntos. |
| r, d | Radio y diámetro de la circunferencia correspondiente. | Unidad de longitud; d no significa grado de vértice. |
| θ | Ángulo central del arco considerado. | Grados o radianes expresamente indicados; se lee «theta». |
| π | Constante pi. | Sin unidad; se conserva exacta salvo aproximación indicada. |
| n | Cantidad de tramos del contorno o red que se esté contando. | Número entero sin unidad. |
| g(A) | Grado del vértice A; análogamente para otro vértice. | Número de extremos de aristas incidentes, sin unidad. |
| i | Cantidad de vértices impares. | Entero no negativo sin unidad; no es un índice de tramo. |
| k | Cantidad de trazos continuos. | Entero sin unidad. |
| L | Suma de longitudes de las aristas originales contadas una vez. | Unidad de longitud; puede diferir del perímetro. |
| R | Longitud adicional por repeticiones. | Unidad de longitud; no representa radio. |
| T | Longitud total de un recorrido. | Unidad de longitud; no representa tiempo. |
| A, B, C, D, O | Nombres de vértices del dibujo. | Sin unidad. Las opciones A–D son rótulos de respuesta y no se incorporan a fórmulas. |
| mm, cm, m | Milímetro, centímetro y metro. | Unidades de longitud. El cuadrado de la unidad corresponde a superficie. |

La notación que acompaña un dibujo se lee en palabras la primera vez. Si dos círculos aparecen juntos, se usan subíndices de radio para distinguirlos, conservando el significado de r. El banco no reutilizará una misma letra como medida y como vértice dentro de una pregunta.

## 7. Otras formas de explicarla

| Representación o experiencia | Idea recomendada | Utilidad | Riesgo y corrección | Fuente o procedencia |
|---|---|---|---|---|
| Cinta alrededor del cartón y lámina que lo cubre. | 1. | Separa longitud y superficie antes de las fórmulas. | La cinta con ancho puede confundirse con área; se mide su línea longitudinal idealizada. | Responde al problema conceptual de [F05]; actividad propia. |
| Piezas que se unen y contactos que dejan de estar expuestos. | 1 y 2. | Justifica por qué se descuentan dos apariciones del borde compartido. | Una superposición parcial de superficies no es el mismo caso; se restringe a unión sin superposición. | Conteo geométrico propio; referencia conceptual [F08]. |
| Traslado de tramos paralelos y recorte virtual. | 2. | Permite observar compensaciones y retrocesos. | Mover visualmente un segmento puede parecer que prueba cualquier igualdad; se conservan sus medidas y se declaran paralelismo y perpendicularidad. | Diseño original derivado de suma de longitudes. |
| Cordón que se coloca sobre un arco y se endereza sin estirar. | 3. | Diferencia camino curvo de cuerda recta. | Un cordón real puede estirarse o medir imprecisamente; distinguir exploración aproximada y resultado matemático ideal. | Relaciones de [F08] y [F09]; experiencia propia. |
| Emparejar fichas de llegada y salida en cada unión. | 4. | Hace comprensible la paridad local. | Puede parecer que solo importan grados; comprobar conexión y extremos antes de concluir. | Teoremas expuestos en [F06] y [F07]; visualización propia. |
| Repartidor que debe visitar todos los tramos de una red pequeña. | 5. | Da sentido a duplicar caminos existentes y comparar costos. | Visitar todos los puntos es otro problema; el encargo debe decir todos los tramos. No inventar calles para acortar. | Contexto usado por [F06], con red y actividad originales. |

Una animación muestra un caso; la regla justifica su extensión. Se ofrece selección de tramos como alternativa al arrastre preciso.

## 8. Datos del mundo

Los tamaños de cartones y maquetas son didácticos; el dato dimensional peruano siguiente procede del BCRP.

| Dato | Ejemplo que permite | Precaución de interpretación | Fuente |
|---|---|---|---|
| La moneda de un sol de la serie Riqueza y Orgullo del Perú alusiva al Tumi de Oro tiene diámetro nominal de 25,5 mm. | Estimar el contorno circular de una plantilla usando diámetro, sin confundirlo con radio. | Se idealiza el borde como circunferencia; no se mide el relieve ni el estriado. El dato corresponde a esa emisión. | BCRP, 2010, Circular 009-2010 y anuncio institucional de la emisión [F10]. |
| La emisión institucional de esa moneda se identifica con el año 2010 y la denominación de un nuevo sol de entonces. | Dar identidad al objeto sin inventar una moneda genérica. | La denominación histórica del documento no es una cotización ni una afirmación sobre disponibilidad actual. | [F10]. |

El diámetro se verificó en contenido oficial indexado concordante. La apertura directa devolvió una página intermedia; no se afirma lectura visual del PDF completo. No se incorpora una imagen de la moneda.

El perímetro derivado de πd es un cálculo del modelo que el equipo recalculará. Las longitudes de la plantilla en T son datos didácticos, no medidas reales.

## 9. Dudas y decisiones

**Fuentes.** El material CEPREUNMSM es una copia externa identificada por su encabezado. CEPRE-UNI confirma arcos y circunferencias, no expresamente trazos eulerianos; su «circunferencia de Euler» pertenece a otro tema.

**Frecuencia y errores.** No se estableció predominio de preguntas ni prevalencia peruana. Machaba respalda dos confusiones generales; los errores particulares permanecen como hipótesis. No se fuerza una categoría de segunda mano sin un hallazgo específico útil.

**Convenciones.** Se decide escribir «perímetro exterior» cuando se excluyen huecos y «longitud total de bordes» cuando se incluyen. En cruces se distingue conexión de paso por encima. Las redes son finitas, no dirigidas y con longitudes positivas; el banco declara cualquier excepción antes de pedir un razonamiento que dependa de ella.

**Mínimos.** Se usan redes pequeñas y longitudes como costos. Menos segmentos repetidos no garantiza menos distancia. Si los extremos deben ser distintos, se expresa esa condición; «extremos libres» no la implica.

**Auditoría de dependencias.** La idea 1 define el borde; la 2 reconstruye tramos rectos; la 3 agrega arcos; la 4 introduce red, grado y un solo trazo; la 5 introduce varios trazos y repeticiones mínimas. Ninguna misión inicial necesita paridad. Los juegos reservan para sus predicciones, respectivamente, una diagonal interior, una muesca central, el borde recto de un semicírculo, un marco con diagonal y un recorrido que admite repetir con extremos fijos.

**Auditoría de distractores.** Idea 1: TP-03/04/01. Idea 2: TP-05/06/07. Idea 3: TP-09/08/10. Idea 4: TP-13/11/12. Idea 5: TP-17/16/14. Hay cuatro opciones por predicción y tres errores identificados. TP-02 y TP-15 se trabajan también en contrastes y ejercicios; no todos los códigos necesitan aparecer en una predicción.

**Decisiones del proyecto.** Definir radianes como extensión, cantidad de ejercicios de emparejamiento y nuevos datos locales. Comprobar que la tolerancia táctil no agregue conexiones y recalcular el banco final. La propuesta no incluye código.

## 10. Fuentes

- **[F01] Universidad Nacional de Ingeniería, OCAD (2015).** *Solucionario del examen de admisión 2015-2*. Primera prueba, preguntas 17 y 19; enunciados cotejados en las páginas impresas 15–16. Fuente oficial. https://admision.uni.edu.pe/wp-content/uploads/2022/11/solucionario20152.pdf
- **[F02] Trilce (2019).** *Solucionario San Marcos 2020-I, áreas A, B y D*. Pregunta 26, página impresa 15. Reproducción de academia utilizada solo para identificar el tipo de pregunta. https://www.trilce.edu.pe/storage/static/upload/1c036330-d759-11e9-927f-89e0fd9a770c.pdf
- **[F03] Centro Preuniversitario UNMSM, atribución del documento (2024).** *Material de la semana 1, ciclo especial de verano 2024*, sección Trazos de figuras I y II, páginas impresas 26–28. Copia externa leída en Scribd; no se copian ejercicios ni diagramas. https://es.scribd.com/document/698447678/MPE-SEMANA-N-01-CICLO-ESPECIAL-VERANO-2024-240102-105653
- **[F04] CEPRE-UNI (2023).** *Sílabo del ciclo preuniversitario 2023-2*. Geometría: longitud de circunferencia y arco. Documento institucional leído. https://www.cepre.uni.edu.pe/assets/archivos/comunicados/Syl_Pre_PS_2023-2.pdf
- **[F05] Machaba, France M. (2016).** *The concepts of area and perimeter: Insights and misconceptions of Grade 10 learners*. Pythagoras, 37(1), a304. DOI: 10.4102/pythagoras.v37i1.304. Artículo original leído, especialmente discusión de resultados en páginas 8–10. https://files.eric.ed.gov/fulltext/EJ1209134.pdf
- **[F06] Kirk, Donna, y colaboradores (2023).** *Contemporary Mathematics*, 12.5, Euler Circuits. OpenStax. Capítulo leído; los problemas de esta propuesta son propios. https://openstax.org/books/contemporary-mathematics/pages/12-5-euler-circuits
- **[F07] Kirk, Donna, y colaboradores (2023).** *Contemporary Mathematics*, 12.6, Euler Trails. OpenStax. Se consultaron condiciones de recorrido y construcción. https://openstax.org/books/contemporary-mathematics/pages/12-6-euler-trails
- **[F08] Marecek, Lynn; Anthony-Smith, MaryAnne; Mathis, Andrea Honeycutt (2020).** *Prealgebra 2e*, 9.5, Solve Geometry Applications: Circles and Irregular Figures. OpenStax. https://openstax.org/books/prealgebra-2e/pages/9-5-solve-geometry-applications-circles-and-irregular-figures
- **[F09] Abramson, Jay, y colaboradores (2021).** *Precalculus 2e*, 5.1, Angles. OpenStax. Se consultó la relación entre ángulo central, radio y arco. https://openstax.org/books/precalculus-2e/pages/5-1-angles
- **[F10] Banco Central de Reserva del Perú (2010).** *Circular 009-2010-BCRP*, emisión de la moneda alusiva al Tumi de Oro; y anuncio de características en *Revista Moneda*, número 143. Consulta parcial de contenido oficial indexado; acceso directo al PDF limitado. https://www.bcrp.gob.pe/docs/Transparencia/Normas-Legales/Circulares/2010/Circular-009-2010-BCRP.pdf ; https://www.bcrp.gob.pe/docs/Publicaciones/Revista-Moneda/Moneda-143/Moneda-143.pdf




