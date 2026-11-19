# Ideas erróneas en cinemática (MRUV, caída libre y tiro parabólico)

4 de noviembre de 2026 · Tarea 4 de `CLAUDE.md`, tercer tema (sigue a [lentes](optica-ideas-erroneas.md) y [espejos esféricos](optica-espejos-esfericos.md))

Para qué sirve: MRUV y tiro parabólico son las dos plantillas de la fase 1 que siguen a espejos. Este documento junta los errores documentados de los estudiantes para escribir sus predicciones antes de construirlas.

## Resumen en cinco líneas

1. A diferencia de óptica, cinemática es **el tema más estudiado** de la investigación en enseñanza de la física. Hay estudios con cientos de alumnos, tests validados y datos de antes y después de la instrucción.
2. El hallazgo que más pesa para el laboratorio: **la enseñanza tradicional casi no mueve estos errores.** En la Universidad de Oregon, después de un curso tradicional, solo el 5 % de los alumnos respondía bien las preguntas de la moneda lanzada hacia arriba. Con clases de laboratorio y demostraciones interactivas, donde el alumno **predice antes de ver**, más del 90 % (Thornton y Sokoloff, 1998). Es la misma idea que el principio 1 del laboratorio.
3. Las gráficas x-t y v-t son un punto débil medido: en un test a 524 escolares de los últimos años de secundaria y universitarios, el promedio fue 40 %. Sacar el cambio de velocidad del área de una gráfica a-t lo logró solo el 23 % (Beichner, 1994).
4. En tiro parabólico, el error central es **no separar el movimiento horizontal del vertical**. El 71 % cree que una bala disparada horizontalmente tarda más en caer que una soltada a la vez desde la misma altura (Prescott y Mitchelmore, 2005).
5. A diferencia de óptica, aquí varios errores de cálculo **sí** tienen respaldo: leer la pendiente como "valor entre tiempo" (dividir la altura de un punto entre su tiempo) y calcular pendiente cuando se pide área. Siguen sin estudios los trucos de academia, como la distancia recorrida en el n-ésimo segundo.

## Catálogo con respaldo

### Velocidad y aceleración (MRUV)

| # | Idea errónea | Lo correcto | Qué tan frecuente | Fuente |
| --- | --- | --- | --- | --- |
| K1 | **Misma posición, misma velocidad.** Si dos móviles están en el mismo lugar en el mismo instante, van igual de rápido. | Coincidir en posición no dice nada de la velocidad: uno puede estar pasando al otro. | Reportada en entrevistas con universitarios de cursos introductorios; sin porcentaje en las fuentes leídas. | Trowbridge y McDermott (1980) |
| K2 | **El que alcanza tiene más aceleración.** Alcanzar o ir más rápido se toma como acelerar más; y si dos objetos están en el mismo lugar, tienen la misma aceleración. | La aceleración es cuánto cambia la velocidad por segundo. Un móvil con más velocidad puede tener aceleración cero. | Reportada en entrevistas; sin porcentaje en las fuentes leídas. | Trowbridge y McDermott (1981) |
| K3 | **La aceleración va hacia donde se mueve el objeto.** Si el auto avanza, la aceleración apunta hacia adelante, aunque esté frenando. | En el frenado, la aceleración apunta en contra del movimiento. El signo de a no dice si el móvil va hacia adelante o hacia atrás. | Reportada; sin porcentaje en las fuentes leídas. | Trowbridge y McDermott (1981) |
| K4 | **"a = v/t" en vez de "a = Δv/Δt".** Dividir una velocidad entre un tiempo, sin restar los valores iniciales. Es la versión numérica de K2. | Siempre cambio entre cambio. | Ver G2: en gráficas, cuando la recta no pasa por el origen, solo 21–25 % acierta. | McDermott, Rosenquist y van Zee (1987); Beichner (1994) |

### Gráficas x-t, v-t y a-t

Fuente principal: el test TUG-K de Beichner (1994), con 895 escolares de los últimos años de secundaria y universitarios de Estados Unidos, todos ya instruidos en cinemática. La versión final la rindieron 524. El promedio fue 8,5 de 21 preguntas (40 %), y los universitarios no lo hicieron mejor que los escolares.

| # | Idea errónea | Lo correcto | Qué tan frecuente | Fuente |
| --- | --- | --- | --- | --- |
| G1 | **La gráfica es una foto del movimiento.** Una recta que sube en la gráfica x-t se lee como "el objeto sube una cuesta". | La gráfica es una relación entre dos variables, no un dibujo de la trayectoria. | Documentada como categoría central; sin porcentaje único. | McDermott, Rosenquist y van Zee (1987); Beichner (1994) |
| G2 | **Confundir pendiente con altura.** Leer la velocidad en la gráfica x-t como el valor del eje vertical; o dividir la altura de un punto entre su tiempo, como si la recta pasara por el origen. | La pendiente es Δy/Δx entre dos puntos de la recta (o de la tangente). | Alrededor de 1 de cada 4 confunde pendiente con altura. Si la recta pasa por el origen, 73 % calcula bien la pendiente; si no pasa, baja a 21 % y 25 %. | Beichner (1994) |
| G3 | **Las gráficas de x, v y a son iguales.** Cambiar la etiqueta del eje vertical sin cambiar la forma de la curva. | Cada gráfica es la pendiente de la anterior; cambian de forma. | Alrededor del 25 %. | Beichner (1994) |
| G4 | **Pendiente cuando se pide área.** Para sacar el desplazamiento de una gráfica v-t, o el cambio de velocidad de una gráfica a-t, se calcula la pendiente o se lee el eje vertical. | El área bajo v-t es el desplazamiento; el área bajo a-t, el cambio de velocidad. | Cambio de velocidad desde una gráfica a-t: 23 % de aciertos, el objetivo más difícil del test. Con velocidad constante, 72 % acierta, pero porque usa d = v·t de memoria, sin saber que calcula un área. | Beichner (1994) |

**Lo que se aprende.** El alumno sabe usar fórmulas, pero no lee gráficas, y la escuela no corrige eso: los universitarios no superaron a los escolares. Para el laboratorio, la gráfica v-t tiene que estar **amarrada por color** a la escena: la altura de la curva al velocímetro del móvil, la pendiente a la flecha de aceleración y el área sombreada al tramo recorrido. Es el principio 4 aplicado a gráficas.

### Caída libre y lanzamiento vertical

| # | Idea errónea | Lo correcto | Qué tan frecuente | Fuente |
| --- | --- | --- | --- | --- |
| C1 | **Aceleración cero en el punto más alto.** Como la velocidad es cero arriba, la aceleración también. | La aceleración es g hacia abajo todo el tiempo, también en la cima. Si fuera cero allí, la piedra se quedaría flotando. | En la moneda lanzada hacia arriba, solo el 5 % de 240 alumnos de Oregon respondió de forma newtoniana (fuerza constante hacia abajo en subida, cima y bajada) **después** de un curso tradicional. Las preguntas eran de fuerza, que en este caso equivale a aceleración. Con demostraciones interactivas con predicción, más del 90 %. | Thornton y Sokoloff (1998) |
| C2 | **El más pesado cae primero.** Doble masa, mitad de tiempo de caída. | Sin aire, todos caen con la misma aceleración y llegan a la vez. | "Un porcentaje muy alto" de alumnos de secundaria e incluso universitarios, **después** de resolver ejercicios y hacer prácticas de caída libre. La revisión no da la cifra. | Carrascosa, Gil Pérez y Valdés (2004), sobre Viennot (1979) |

### Tiro parabólico

Fuente principal de porcentajes: Prescott y Mitchelmore (2005), entrevistas a 47 alumnas del último año de secundaria (Year 12) en Sídney; 17 ya habían visto el tema en física.

| # | Idea errónea | Lo correcto | Qué tan frecuente | Fuente |
| --- | --- | --- | --- | --- |
| P1 | **Lo soltado cae antes que lo lanzado.** Una bala disparada horizontalmente tarda más en caer que una soltada a la vez desde la misma altura ("recorre más camino"). | Caen a la vez: el movimiento vertical no depende del horizontal. | Balas: 71 % se equivoca. Pelotas (una rueda por el borde de un acantilado y otra se suelta): 40 % dice que la soltada llega primero. | Prescott y Mitchelmore (2005) |
| P2 | **Más rápido, más tiempo en el aire** (o menos). La velocidad horizontal cambia el tiempo de caída. | El tiempo de vuelo depende solo de la altura (y de la velocidad vertical inicial). | Dos balas disparadas horizontalmente con distinta velocidad: 38 % dice que la más rápida dura más en el aire. Con pelotas, 43 % dice que la más rápida llega primero. | Prescott y Mitchelmore (2005); Jimoyiannis y Komis (2001), idea de "más A, más B" |
| P3 | **La velocidad horizontal se gasta.** El proyectil avanza menos cada segundo, o "se le acaba la fuerza" del disparo y entonces cae en picada. | La velocidad horizontal es constante: el mismo avance cada segundo. | Si avanzó 10 m en el primer segundo, 60 % dice que en el segundo avanza menos. | Prescott y Mitchelmore (2005); McCloskey (1983) |
| P4 | **Soltado desde algo que se mueve, cae recto.** La pelota que se suelta desde un avión, una faja o alguien caminando cae vertical o queda atrás. | Sale con la velocidad horizontal del que la suelta y describe una parábola. | Solo 25–38 % acierta, según el caso. "Cae recto": 30–53 %. | Prescott y Mitchelmore (2005) |
| P5 | **Trayectoria con "ímpetu".** Una bola que sale del borde de una mesa sigue recta un tramo y luego cae. | Es una parábola desde el primer instante. | Más de un tercio de escolares y universitarios. | McCloskey (1983), citado por Prescott y Mitchelmore |

**Dato que matiza P1 a P5.** En la misma muestra, el 85 % eligió bien la forma de parábola entre varias opciones. Reconocen la forma, pero no la entienden como dos movimientos independientes. Esto avisa contra un riesgo del laboratorio: una escena que solo **muestra** la parábola no basta.

## Lo que no tiene respaldo (todavía)

Errores propios del estilo de examen peruano y de las academias. No encontré estudios; quedan como hipótesis:

| Error que suponemos | Por qué lo suponemos |
| --- | --- |
| Confundir la distancia recorrida **en** el n-ésimo segundo con la recorrida **en n segundos** | Es una pregunta típica de academia, con su fórmula propia: dₙ = v₀ + a(n − ½) |
| Usar d = v·t con la velocidad final en un MRUV | Es la versión numérica de G4: el alumno usa la fórmula de memoria y no ve el área |
| Cambiar el signo de g a mitad de problema en el lanzamiento vertical (positiva al subir, negativa al bajar) | Es la versión numérica de C1 |
| En el frenado, seguir usando la ecuación después de que el móvil se detuvo, y obtener que retrocede | Las ecuaciones del MRUV no saben que el freno no hace retroceder |
| Usar el ángulo de lanzamiento con la velocidad equivocada: v·cos θ para lo vertical y v·sen θ para lo horizontal | Es frecuente en material de academia, pero no está medido |

Se confirman como los de óptica: con hojas resueltas en la prueba del pase 2 y con predicciones de respuesta abierta.

## Propuesta para las plantillas

**Una nota de diseño que vale para las dos.** Beichner (1994) y Thornton y Sokoloff (1998) llegan a la misma conclusión: lo que funciona es predecir la forma de la gráfica, ver el movimiento real y comparar. La herramienta clásica es *Graphs and Tracks*, de David Trowbridge, un simulador de los años 80. El laboratorio puede hacer lo mismo en el celular: el alumno arrastra el móvil o dibuja la gráfica con el dedo, y la escena corre.

### MRUV

**Problema guiado.** Un móvil parte con v₀ = 4 m/s y acelera a 2 m/s² durante 5 s.

Predicción del paso 3: *¿cómo es la gráfica x-t?* Se muestran cuatro dibujos:

| Opción | Error que representa | Respaldo |
| --- | --- | --- |
| a) Una recta que sube | Confunde x-t con v-t (G3) | Documentado |
| b) Una curva que sube cada vez más empinada | Correcta | — |
| c) Una recta horizontal | Confunde "aceleración constante" con "posición constante" (G3) | Documentado como categoría |
| d) Una cuesta, como la forma del camino | Gráfica como foto (G1) | Documentado |

**Explorador.** Dos móviles en pistas paralelas, uno con MRU y otro con MRUV, que se cruzan. El alumno predice en qué instante tienen la misma velocidad: la mayoría dirá "cuando se cruzan" (K1). La escena marca en la gráfica v-t el punto donde las velocidades coinciden, que no es el cruce. El frenado va como caso límite: ¿qué pasa después de que se detiene? (hipótesis del retroceso).

### Tiro parabólico

**La escena central.** Dos esferas a la vez desde la misma altura: una se suelta y otra se lanza horizontalmente. Ataca P1, P2 y P5 de una vez, y es fácil de animar.

Predicción del paso 3: *¿cuál llega primero al suelo?*

| Opción | Error que representa | Respaldo |
| --- | --- | --- |
| a) La que se soltó, porque recorre menos camino | P1 | 40–71 % |
| b) La lanzada, porque va más rápido | P2 | 43 % |
| c) Llegan a la vez | Correcta | — |
| d) Depende de cuán pesadas sean | C2 | Documentado sin cifra |

**Problema guiado.** Lanzamiento con v₀ = 50 m/s a 37°, con g = 10 m/s². Se usan los valores de examen sen 37° = 3/5 y cos 37° = 4/5, el triángulo 3-4-5 que usa la academia peruana. Así quedan v₀ₓ = 40 m/s y v₀ᵧ = 30 m/s, y todos los resultados salen exactos.

**Explorador:**

1. **Sombras sobre los ejes.** La sombra del proyectil en el eje horizontal avanza a ritmo constante (ataca P3) y la sombra en el eje vertical sube y baja como un lanzamiento vertical. Las dos sombras usan los colores de vₓ y vᵧ.
2. **¿Qué aceleración hay en la cima?** (C1). La flecha de g se ve siempre, del mismo tamaño, en toda la trayectoria.
3. **Soltar desde una faja que avanza** (P4).

### Casos de prueba propuestos

Verificados con fracciones exactas; van al `casos.json` de cada plantilla cuando se construya. Unidades SI, g = 10 m/s².

| Plantilla | Caso | Entrada | Salida esperada |
| --- | --- | --- | --- |
| MRUV | Acelera desde v₀ | v₀ = 4, a = 2, t = 5 | v = 14, d = 45 |
| MRUV | Distancia en el 5.º segundo | v₀ = 4, a = 2, n = 5 | d₅ = 13 (= 45 − 32) |
| MRUV | Frenado hasta detenerse | v₀ = 20, a = −4 | se detiene en t = 5, d = 50 |
| Vertical | Lanzamiento hacia arriba | v₀ = 30 | t de subida = 3, H = 45, t de vuelo = 6 |
| Vertical | Ya de bajada | v₀ = 30, t = 4 | v = −10 (bajando), y = 40 |
| Parabólico | Oblicuo 37° | v₀ = 50, θ = 37° (sen = 3/5) | t de subida = 3, H = 45, T = 6, alcance = 240, v en la cima = 40 |
| Parabólico | Horizontal desde altura | h = 80, vₓ = 15 | t = 4, x = 60 |

El caso horizontal sirve también para P1: una esfera soltada desde 80 m tarda los mismos 4 s.

## Huecos y siguientes pasos

- **Los estudios son de Estados Unidos y Australia,** con muestras de colegio o universidad privados en el caso australiano (dos colegios de mujeres). No encontré estudios peruanos ni latinoamericanos con cifras. La revisión española de Carrascosa y otros confirma que los errores aparecen en España y Cuba, pero no da números.
- **No pude leer los textos completos** de Trowbridge y McDermott (1980, 1981) ni de McDermott, Rosenquist y van Zee (1987). Lo de K1 a K4 sale de resúmenes y de reseñas. Sus porcentajes están en los artículos originales (American Journal of Physics).
- **C1 está medido como fuerza, no como aceleración.** Las preguntas de la moneda del FMCE piden la fuerza sobre la moneda. Para la moneda en vuelo es lo mismo (F = mg), pero vale confirmar la versión cinemática con postulantes.
- **Qué sigue.** En la tarea 4 quedan dinámica y estequiometría. Con tres temas investigados, ya alcanza para empezar la tarea 1: extraer el motor de la lente a un módulo y correr los casos de prueba.

## MRU (18 nov)

Códigos de las ideas A2 a A5 de «Movimiento rectilíneo uniforme» (`contenido/teoria/fisica/movimiento-rectilineo.js`;
propuesta aprobada en `docs/etapa4/propuesta-fisica.md`, pregunta 11). Los de A1 (MRU-X0, MRU-SIGNO, MRU-CONTEO,
MRU-SUMA, MRU-ECUACION) están en la cabecera de la unidad. Salvo donde se dice, **son hipótesis de diseño, sin dato
propio**: errores que suponemos por la forma de las alternativas de examen y de academia, para confirmar con lo que
midan las predicciones y el «Ahora tú» en el colegio.

| Código | Idea errónea (lo que hace el alumno) | Dónde aparece | Respaldo |
| --- | --- | --- | --- |
| G2-altura-entre-tiempo | Divide la altura de un punto entre su tiempo, como si la recta x–t saliera del cero | A2: Predice, «Ahora tú» | G2 de Beichner (1994): con la recta fuera del origen, 21–25 % acierta |
| G2-ultimo-punto | Lo mismo con el último punto de la gráfica (38 m ÷ 5 s) | A2 | Variante de G2; hipótesis |
| G2-pendiente-es-altura | Da la altura del punto (la posición) como velocidad | A2 | G2 de Beichner (1994): 1 de cada 4 confunde pendiente con altura |
| XT-SIN-DIVIDIR | Da el cambio de x (Δx) sin dividir entre el tiempo | A2 «Ahora tú» | Hipótesis (versión x–t de K-SINDIV de MRUV) |
| XT-SIGNO | Pierde el signo de la pendiente de una recta que baja, o cambia los signos de dos rectas | A2 (San Marcos 2019-I) | Hipótesis |
| XT-INVERSA | Divide el tiempo entre el cambio de x | A2 «Ahora tú» | Hipótesis |
| XT-LEIDO | Toma la última posición dibujada como respuesta cuando la recta sigue | A2 (San Marcos 2024-II, trampa de la clave) | Hipótesis |
| DX-RAPIDEZ | Da la velocidad media (0, si volvió) cuando se pide la rapidez media | A3 Predice y «Ahora tú» | Hipótesis (ya en la unidad vieja) |
| DX-DISTANCIA | Lo contrario: da la rapidez media cuando se pide la velocidad media | A3 «Ahora tú» | Hipótesis |
| DX-IDA | Solo el tramo de ida, sin lo que regresó | A3 «Ahora tú» | Hipótesis (ya en la unidad vieja) |
| MED-PROMEDIO | Promedia las rapideces de tramos que no duran lo mismo | A3 | Trampa 10 de San Marcos (2019-II y 2022, en las alternativas) |
| MED-SUMA | Suma las rapideces de los tramos | A3 | Hipótesis |
| MED-UN-TIEMPO | Divide todo el camino entre el tiempo de un solo tramo | A3 «Ahora tú» | Hipótesis |
| MED-CRUZADO | Cruza los tiempos: cada rapidez con el tiempo del otro tramo | A3 «Ahora tú» | Hipótesis |
| MED-TRAMO | Da la rapidez media de un solo tramo (la del último, o la de la segunda mitad) | A3 «Ahora tú» | Hipótesis |
| MED-PROMEDIO-MITADES | Promedia las dos mitades del camino como si duraran lo mismo (San Marcos 2022) | A3 «Ahora tú» | Hipótesis |
| K1 | «Lo alcanza cuando vayan igual de rápido» | A4 Predice | K1 de Trowbridge y McDermott (1980), sin porcentaje |
| VR-SUMA / VR-RESTA | Suma las rapideces cuando se persiguen, o las resta cuando van de frente | A4 Predice y «Ahora tú» | Hipótesis (ya en la unidad vieja) |
| VR-UNO | Trata al otro móvil como si estuviera quieto | A4 | Hipótesis (ya en la unidad vieja) |
| VR-POSICION | Da el lugar del encuentro (en metros) cuando se pide el instante | A4 «Ahora tú» | Hipótesis (ya en la unidad vieja) |
| VR-RELOJ | Cuenta el alcance desde que salió el primero, no desde que salió el que alcanza (San Marcos 2021) | A4 «Ahora tú» | Hipótesis |
| VR-VENTAJA | Da cuánto salió antes el primero como tiempo de alcance | A4 «Ahora tú» | Hipótesis |
| REL-SENTIDO | Resta donde se suma (o al revés), o invierte la resta v_B − v_A | A5 | Trampa 12 de San Marcos (2020-I y 2021) |
| REL-SIN-MARCO | Usa la velocidad medida desde otro sistema (la del bote respecto al agua, la de B desde la carretera) | A5 | Hipótesis |
| REL-PITAGORAS | Usa Pitágoras con dos velocidades sobre la misma recta, como el bote que cruza en Vectores | A5 Predice | Hipótesis |
| REL-SUMA | Suma las velocidades de dos combis que van hacia el mismo lado | A5 «Ahora tú» | Hipótesis |
| REL-SIGNO | Olvida el signo de la que viene de frente antes de restar | A5 «Ahora tú» | Hipótesis |
| REL-SOLO-A | Da la velocidad de los postes (−v_A) como la de la otra combi | A5 «Ahora tú» | Hipótesis |
| REL-SOLO-RIO | Usa solo la corriente, como un bote que no rema | A5 «Ahora tú» | Hipótesis |
| REL-IDA | En el bote que sube y baja, da solo el tiempo de un tramo | A5 «Ahora tú» | Hipótesis |

Se confirman como los demás de este informe: con el registro de opciones elegidas en las predicciones y en «Ahora tú»
(evento `teoria` de la medición), y con preguntas abiertas en la prueba del pase 2.

## Práctica de MRU (fis-mru, 18 nov)

Códigos nuevos de la práctica de «Movimiento rectilíneo uniforme» (`plantillas/fis-mru/generador.js`, un generador con
tipos por idea). Usa también los de la sección anterior y los de la cabecera de la unidad. **Todos son hipótesis de
diseño, sin dato propio**: salen de la forma de las alternativas de academia y de examen, y se confirman con las
opciones que eligen los alumnos en la práctica (evento `prediccion` de la medición). Los de unidades (U1-kmh,
U1-inversa, U6-min, U2-km, U2-cm) son los códigos U de `fisica-calculo-transversal-ideas-erroneas.md`.

| Código | Idea errónea (lo que hace el alumno) | Dónde aparece | Respaldo |
| --- | --- | --- | --- |
| MRU-ECO-MITAD | Divide entre 2 el camino del trueno, como si rebotara | A1 (el rayo y el trueno) | Hipótesis |
| MRU-ECO-DOBLE | Cuenta ida y vuelta en un sonido que viaja una sola vez | A1 (el trueno) | Hipótesis |
| MRU-ECO-SIN-MITAD | No divide entre 2 el camino de ida y vuelta del eco | A1 (dos ecos, la bocina) | Hipótesis |
| MRU-ECO-UNO | Entre dos cerros, da la distancia a uno solo | A1 (dos ecos) | Hipótesis |
| MRU-ECO-RESTA | Resta las distancias a dos cerros que están a lados opuestos | A1 (dos ecos) | Hipótesis |
| MRU-ECO-QUIETO | Trata como quieta a la combi que toca la bocina y sigue avanzando | A1 (la bocina) | Hipótesis |
| MRU-ECO-ESCUCHA | Da la distancia al cerro cuando oye el eco, no cuando tocó la bocina | A1 (la bocina) | Hipótesis |
| MRU-ECO-MEDIO | Divide entre 2 el camino del sonido, pero suma entero lo que avanzó la combi | A1 (la bocina) | Hipótesis |
| MRU-IDA | En una ida y vuelta, da la posición al final de la ida | A1 | Hipótesis |
| MRU-RESTA-V | Resta las velocidades y multiplica por el tiempo total, aunque cada una dure su propio tiempo | A1 | Hipótesis |
| XT-PRIMER-PUNTO | Toma un punto de la recta como x₀, aunque no esté en t = 0 | A2 | Hipótesis |
| XT-POSICION | Da la posición final como la distancia recorrida, sin restar la salida | A2 (San Marcos 2024-II) | Hipótesis |
| XT-CAMBIA | En la ecuación de la recta, cambia de lugar x₀ y v | A2 | Hipótesis |
| DX-VUELTA-ENTERA | Cuenta la vuelta entera aunque no llegó a la partida | A3 | Hipótesis |
| DX-SUMA-POSICIONES | Suma las posiciones de una tabla en vez de los tramos recorridos | A3 (San Marcos 2021) | Hipótesis |
| MED-SIN-PARADA | Deja fuera de la rapidez media el tiempo de una espera | A3 | Hipótesis |
| VR-PROMEDIO | Divide la separación entre el promedio de las rapideces | A4 | Hipótesis |
| ENC-OTRO | Da lo que recorrió el otro móvil, no el que se pide | A4 | Hipótesis |
| ENC-MITAD | Supone que de frente se cruzan a la mitad del camino | A4 | Hipótesis |
| ENC-UN-LARGO | Para cruzarse por completo, cuenta un solo largo | A4 (trenes) | Hipótesis |
| ENC-PRIMERA | Da la primera vez que están a cierta separación cuando se pide la segunda | A4 | Hipótesis |
| ENC-CRUCE | Da el instante del cruce cuando se pide una separación | A4 | Hipótesis |
| ENC-SOLO-S | Cuenta solo el tiempo de separarse, sin el de acercarse | A4 | Hipótesis |
| REL-SIN-MITAD | De los viajes río abajo y río arriba, no divide entre 2 | A5 | Hipótesis |
| REL-CRUZA | Da la corriente cuando se pide lo que rema el bote, o al revés | A5 | Hipótesis |
| REL-UN-LARGO | Al adelantar a otra combi, cuenta un solo largo | A5 | Hipótesis |

## MRUV y caída libre (18 nov)

Códigos de las seis ideas de «MRUV y caída libre» (`contenido/teoria/fisica/mruv-y-caida-libre.js`, ideas B1 a B6 de
`docs/etapa4/propuesta-fisica.md`; la lista completa está en la cabecera de la unidad) y de su práctica
(`plantillas/fis-mruv/generador.js`, un tipo por idea con tres niveles). Los que se apoyan en el catálogo de arriba
llevan su respaldo (K1-a y K3 de Trowbridge y McDermott, sin porcentaje; G3 y G4 de Beichner 1994; C1 de Thornton y
Sokoloff 1998; C2 de Carrascosa y otros 2004). Los de unidades y proporción (U1-kmh, U1-al-reves, U1-ms, U2-cm, PR1,
PR1-frenado) son los de `fisica-calculo-transversal-ideas-erroneas.md`, con un sufijo que dice el caso. **Todos los
demás son hipótesis de diseño, sin dato propio**: salen de la forma de las alternativas de examen y de academia, y se
confirman con las opciones que eligen los alumnos en las predicciones, en «Ahora tú» (evento `teoria`) y en la práctica
(evento `prediccion`). DX-IDA y MED-TRAMO son los mismos códigos de MRU, llevados a la gráfica v–t y a la aceleración.

### En la teoría (B1 a B6)

| Código | Idea errónea (lo que hace el alumno) | Dónde aparece | Respaldo |
| --- | --- | --- | --- |
| K-A0 | Cree que sin cambio de sentido no hay aceleración | B1 Predice | Hipótesis |
| K-SIGNO | Da la aceleración (o la velocidad) con el signo al revés | B1, B3, B4, B6 | Hipótesis |
| K-TIEMPO | Da la velocidad después de un solo segundo | B1, B4, B6 | Hipótesis |
| K-CUADRADO | Eleva t al cuadrado donde va a · t (o g · t) | B1, B2, B4, B5 | Hipótesis |
| K-SINDIV | Da el cambio de velocidad Δv sin dividir entre Δt | B1, B3 | Hipótesis (versión de K4) |
| K-SUMA | Suma las velocidades inicial y final en vez de restarlas | B1 | Hipótesis |
| K-POR | Multiplica el cambio de velocidad por el tiempo, o la velocidad por a | B1, B4 | Hipótesis |
| MED-PROMEDIO-A | Promedia (o suma) las aceleraciones de dos tramos que duran distinto | B1 (San Marcos 2021) | Hipótesis |
| MED-TRAMO | Da la aceleración media de otro tramo o de todo el viaje | B1 | Hipótesis (como en MRU) |
| MRUV-FRENO-IGUAL | Con el mismo freno y más rapidez, da la misma distancia de frenado | B2 Predice | Hipótesis |
| MRUV-VT | Multiplica la rapidez inicial por el tiempo de frenado, sin la media | B2 | Hipótesis de arriba («d = v·t en un MRUV») |
| MRUV-TIEMPO | Da el tiempo de frenado cuando se piden metros | B2 | Hipótesis |
| MRUV-SIGNO-D | Da la distancia de frenado con signo negativo, como la aceleración | B2 | Hipótesis |
| DX-RECT | Multiplica la velocidad final por el tiempo, como si fuera así todo el tramo | B2, B3 | Hipótesis (versión de G4) |
| DX-INICIAL | Multiplica la velocidad inicial por el tiempo | B2, B3 | Hipótesis |
| DX-SEMI | Suma v₀ y v sin dividir entre 2 (la media o el trapecio) | B2, B3 | Hipótesis |
| MRUV-ACEL | Da la aceleración cuando se pide lo que avanzó | B2 | Hipótesis |
| MRUV-MEDIO | Olvida el ½ de ½ · a · t² | B2, B4 | Hipótesis (PR3 del informe transversal) |
| MRUV-SIN-A | Calcula la posición sin el término de la aceleración | B2 | Hipótesis |
| MRUV-MEDIO-A | En x = A + Bt + Ct², toma C como la aceleración (no como ½ · a) | B2 (San Marcos 2025-II) | Hipótesis |
| MRUV-POSICION | Da la posición en ese instante cuando se pide la velocidad | B2 | Hipótesis |
| MRUV-POSICION-FINAL | Da la posición final cuando se pide el desplazamiento | B2 (San Marcos 2026-II) | Hipótesis |
| MRUV-DESDE-0 | Resta la posición en t = 0 y no la del instante inicial pedido | B2 | Hipótesis |
| DX-SUMA | Suma un área bajo el eje cuando se pide el desplazamiento | B3 Predice | Hipótesis |
| DX-ALTURA | Suma o resta las alturas de la gráfica v–t en vez de sus áreas | B3 | Hipótesis (versión de G2) |
| DX-RESTA | Da el desplazamiento cuando se pide la distancia recorrida | B3 | Hipótesis |
| DX-TRIANGULO | Toma un triángulo como base por altura, sin dividir entre 2 | B3, B4 | Hipótesis |
| MRUV-MITAD | En el viaje que acelera y frena, da solo el tiempo de una mitad | B3 (San Marcos 2020-I) | Hipótesis |
| MRUV-SOLO-ACELERA | Supone que acelera todo el camino, sin frenar | B3 | Hipótesis |
| MRUV-DIVIDE | Divide la distancia entre la aceleración para sacar un tiempo | B3 | Hipótesis |
| MRUV-LEE-PUNTO | Da la velocidad de un punto de la recta v–t como la de t = 0 | B3 (San Marcos 2021) | Hipótesis |
| MRUV-ORIGEN | Supone que la recta v–t sale del 0 | B3 | Hipótesis |
| K1-a | «Misma posición, misma velocidad»: da el instante del alcance como el de igual velocidad | B4 Predice | K1 de Trowbridge y McDermott (1980), sin porcentaje |
| K1-b | La misma idea en la salida: juntos al empezar, igual de rápidos | B4 Predice | Hipótesis (K1 partido, como GE17) |
| MRUV-NUNCA | Cree que un móvil que acelera nunca iguala la velocidad de uno parejo | B4 Predice | Hipótesis |
| G-SENTIDO | Elige la gráfica del movimiento contrario (la que frena por la que acelera) | B4 | Hipótesis |
| G4-medio | Divide entre 2 el área de un tramo parejo (un rectángulo) | B4 | Hipótesis (versión de G4) |
| DX-TRAMO | Cuenta solo el tramo parejo, sin lo que avanzó al acelerar y al frenar | B3, B4 | Hipótesis |
| K-ALC-PERSEGUIDOR | Da la distancia del que alcanza cuando se pide la del alcanzado | B4 (San Marcos 2024-II) | Hipótesis (trampa de la clave) |
| K-ALC-D | Da la separación inicial como lo que recorre el alcanzado | B4 | Hipótesis |
| C2-suave | «La piedra llega un poco antes»: la versión suave de C2 | B5 Predice | Hipótesis |
| C2-liviano | Cree que lo liviano cae más rápido | B5 Predice | Hipótesis |
| C-MEDIO | Olvida el ½ (o el 2) en h = ½ · g · t² o en v² = 2 · g · h | B5, B6 | Hipótesis |
| C-VELOCIDAD | Da la velocidad (g · t o √(2gh)) cuando se pide la altura o el tiempo | B5 | Hipótesis |
| C-LINEAL | Trata lo que cae como proporcional al tiempo (o a la altura), sin el cuadrado o sin la raíz | B5 | Hipótesis (PR1 y PR2 del informe transversal) |
| C-RAIZ | Da v² = 2 · g · h sin sacar la raíz | B5 | Hipótesis |
| C-TIEMPO | Da el tiempo de caída o de subida cuando se pide otra cosa | B5, B6 | Hipótesis |
| C-JUNTAS | Cree que dos objetos soltados desde alturas distintas llegan a la vez | B5 | Hipótesis |
| C-RESTA-ALTURAS | Calcula el tiempo de caer la diferencia de alturas desde el reposo | B5 (San Marcos 2019-II) | Hipótesis |
| C-SIN-SONIDO | En el pozo con eco, olvida lo que tarda el sonido en subir | B5 | Hipótesis |
| C-SOLO-SONIDO | En el pozo con eco, cuenta solo lo que tarda el sonido | B5 | Hipótesis |
| C-VUELTA | Usa el tiempo de ida y vuelta donde va uno solo (o el sonido como la piedra) | B5, B6 | Hipótesis |
| C-ENESIMO | Da lo que cae en n segundos cuando se pide el n-ésimo segundo | B5 | Hipótesis de arriba («en el n-ésimo segundo») |
| C-ALTURA | Da la altura máxima cuando se pide un tiempo, una velocidad u otra altura | B6 | Hipótesis |
| C-AREA | Toma el área del triángulo de la subida sin dividir entre 2 | B6 | Hipótesis |
| C-SOLTAR | Desde la azotea, calcula el tiempo como si soltara la pelota | B6 | Hipótesis |
| C-SUBIDA | Da solo el tiempo de subida | B6 | Hipótesis |
| C-ENC-MITAD | En el encuentro en el aire, divide entre 2 la rapidez con que se acercan | B6 | Hipótesis |
| C-ENC-CAIDA | Da el tiempo que la piedra tardaría en caer toda, sin encontrarse | B6 | Hipótesis |

### Nuevos de la práctica (`fis-mruv`)

| Código | Idea errónea (lo que hace el alumno) | Dónde aparece | Respaldo |
| --- | --- | --- | --- |
| K-SIN-V0 | Da a · t (lo que cambió la velocidad) sin sumarle v₀ | B1, B4 | Hipótesis |
| K-INVERSA | Divide a entre la velocidad (o entre Δv) para sacar un tiempo | B1, B4 | Hipótesis |
| K-RESTA-T | Usa el tiempo que falta en vez del que pasó | B1 (el velocímetro) | Hipótesis |
| K-MITAD | Da la mitad de la rapidez final para un instante que no es la mitad | B1 | Hipótesis |
| MED-SIN-RESTA | En el segundo tramo, divide la velocidad final entre su tiempo sin restar la del inicio del tramo | B1 (San Marcos 2021) | Hipótesis |
| MED-SUMA-A | Suma las aceleraciones de dos tramos | B1 | Hipótesis |
| U1-al-reves | Pasa km/h a m/s (o al revés) multiplicando donde va dividir | B1, B5 | U1 del informe transversal, hipótesis |
| U1-ms | Deja en m/s una respuesta que se pide en km/h | B1 | U1 del informe transversal, hipótesis |
| MRUV-RESTA | Resta v₀ y v en la velocidad media | B2 | Hipótesis |
| MRUV-SIN-CUADRADO | Escribe ½ · a · t sin elevar t | B2 | Hipótesis |
| MRUV-RAIZ | Da v² = v₀² + 2aΔx sin sacar la raíz | B2 | Hipótesis |
| MRUV-SIN-DOS | Olvida el 2 de 2 · a · Δx | B2 | Hipótesis |
| MRUV-SIN-V0 | Olvida v₀ (o v₀²) en la ecuación, como si arrancara del reposo | B2 | Hipótesis |
| MRUV-SUMA-RAIZ | Saca la raíz por separado: v₀ + √(2aΔx) | B2 | Hipótesis |
| MRUV-POS-INICIAL | Da la posición del instante inicial cuando se pide el desplazamiento | B2 | Hipótesis |
| MRUV-DISTANCIA | Da la distancia recorrida cuando se pide el desplazamiento de un móvil que da la vuelta | B2 | Hipótesis |
| MRUV-DIF-D | Con el mismo freno y más rapidez, da solo los metros de más | B2 (San Marcos 2026-I) | Hipótesis |
| MRUV-ENESIMO | Da lo que avanza en n segundos cuando se pide el n-ésimo segundo | B2 | Hipótesis de arriba («en el n-ésimo segundo») |
| MRUV-VEL-N | Da la velocidad a los n segundos como lo que avanza en el n-ésimo | B2 | Hipótesis |
| MRUV-ANTERIOR | Da la posición al empezar el n-ésimo segundo, sin restarla | B2 | Hipótesis |
| MRUV-OTRO-SEG | Calcula lo del segundo anterior (de n − 2 a n − 1) | B2, B5 | Hipótesis |
| DX-SIGNO | Resta al revés: la posición inicial menos la final, o lo de vuelta menos lo de ida | B2, B3 | Hipótesis |
| DX-SOLO-TRI | Cuenta solo el triángulo de la salida, sin el tramo parejo | B3 | Hipótesis |
| DX-MEDIA-V | Usa la mitad de la rapidez máxima para todo el viaje | B3 | Hipótesis |
| DX-TRAPECIO | Toma como un trapecio la recta v–t que cruza el eje | B3 | Hipótesis |
| MRUV-DOBLE-TRAMO | En el viaje que acelera y frena, cuenta todo el camino en cada parte | B3 | Hipótesis |
| MRUV-VMAX | Da la rapidez máxima cuando se pide el tiempo | B3 | Hipótesis |
| MRUV-MEDIA-V | Da la rapidez media cuando se pide la máxima | B3 | Hipótesis |
| G4-tiempo | Da la base del triángulo (el tiempo) cuando se pide la pendiente | B3 (San Marcos 2021) | Hipótesis (versión de G4) |
| AT-TRAMO | De una gráfica a–t por tramos, cuenta solo el primero | B4 | Hipótesis |
| AT-TODO | Estira la aceleración del primer tramo a todo el tiempo | B4 | Hipótesis |
| AT-ALTURA | Suma las alturas de la gráfica a–t en vez de sus áreas | B4 | Hipótesis (versión de G4) |
| K-ALC-TIEMPO | Da el tiempo del alcance cuando se piden metros | B4 | Hipótesis |
| K-ALC-SIN-D | Hace salir del mismo lugar a los dos móviles (o al doble de rapidez) | B4 | Hipótesis |
| K-SEP-ALCANCE | Da la posición del alcance cuando se pide la mayor separación | B4 | Hipótesis |
| K-SEP-TIEMPO | Da el instante de la mayor separación cuando se piden metros | B4 | Hipótesis |
| K-SEP-MOTO | Da lo que avanzó uno solo, sin restar lo del otro | B4 | Hipótesis |
| C-IGUAL | Cree que desde más alto tarda lo mismo | B5 | Hipótesis |
| C-CUADRADO | Cree que el tiempo crece con el cuadrado de la altura | B5 | Hipótesis |
| C-ANTERIOR | Da lo que cayó hasta el segundo anterior, sin restarlo | B5 | Hipótesis |
| C-OTRO-SEG | Calcula lo que cae en el segundo anterior al pedido | B5 | Hipótesis |
| C-SUMA-T | Suma los tiempos de caída de dos objetos cuando se pide la diferencia | B5 (San Marcos 2019-II) | Hipótesis |
| C-SOLO-UNA | Da el tiempo de un solo objeto cuando se pide la diferencia | B5 | Hipótesis |
| C-SONIDO-DOBLE | Cuenta ida y vuelta para el sonido del pozo | B5 | Hipótesis |
| U2-cm | Usa los centímetros de la regla como metros | B5 (la regla) | U2 del informe transversal, hipótesis |
| C-SIN-G | Calcula la altura o el encuentro sin la gravedad (solo v₀ · t) | B6 | Hipótesis |
| C-SIN-V0 | Olvida la velocidad de salida (solo −g · t o √(2gy)) | B6 | Hipótesis |
| C-MITAD-T | Divide entre 2 el tiempo de subida | B6 | Hipótesis |
| C-SOLO-G | Da ½ · g · t², lo que le quita la gravedad, como la altura | B6 | Hipótesis |
| C-VUELTA-SOLTAR | Desde la azotea, suma la subida y vuelta y la caída desde el reposo | B6 | Hipótesis |
| C-ENC-CAIDO | En el encuentro, da lo que bajó la piedra en vez de la altura | B6 | Hipótesis |
| C-ENC-SIN-G | En el encuentro, calcula la altura de la pelota sin la gravedad | B6 | Hipótesis |
| C-ENC-MITAD-H | Supone que se encuentran a la mitad de la altura | B6 | Hipótesis |
| C-CUARTO | Divide dos veces entre 2 el tiempo de vuelo | B6 | Hipótesis |

## Movimiento parabólico (19 nov)

Códigos de las cinco ideas de «Movimiento parabólico» (`contenido/teoria/fisica/movimiento-parabolico-y-circular.js`,
ideas A1 a A5 de `docs/etapa5/propuesta-fisica.md`) y de su práctica (`plantillas/fis-parabolico/generador.js`). P1, P2,
P4 y P5 son los del catálogo de arriba (Prescott y Mitchelmore 2005; McCloskey 1983) y C2 el de caída libre; C-LINEAL y
K-TIEMPO vienen de «MRUV y caída libre»; PR1-alcance es PR1 de `fisica-calculo-transversal-ideas-erroneas.md` llevado al
alcance (trampa 2 de San Marcos) y U1-kmh, el de unidades. **Todos los demás son hipótesis de diseño, sin dato propio**:
salen de la forma de las alternativas de examen y de academia, y se confirman con lo que elijan los alumnos en las
predicciones, en «Ahora tú» y en la práctica.

| Código | Idea errónea (lo que hace el alumno) | Dónde aparece | Respaldo |
| --- | --- | --- | --- |
| TP-SIN-MEDIO | Olvida el ½ de ½ · g · t² | A1, A2, A3 | Hipótesis |
| TP-RAIZ | Da t² (o 2h/g) como si fuera el tiempo | A1 | Hipótesis |
| TP-VT | Divide la altura entre la rapidez de lado para hallar el tiempo de caída (versión de P2) | A1 | Hipótesis |
| TP-ALTURA | Da la altura como alcance | A1, A4 | Hipótesis |
| TP-POR | Multiplica la distancia por el tiempo en vez de dividir | A1 | Hipótesis |
| TP-VY | Da una velocidad (la que gana cayendo o la vertical que hace falta) donde piden otra cosa | A1, A2 | Hipótesis |
| TP-CAIDA | Da lo que cayó cuando piden la altura del golpe o la velocidad | A1, A2 | Hipótesis |
| TP-PISO | No compara el tiempo hasta la pared con el tiempo hasta el piso | A1 | Hipótesis |
| TP-RESTA | Resta una distancia de lado a una altura | A1 | Hipótesis |
| TP-SUMA | Suma las dos componentes de la velocidad como números | A2 (Predice) | Hipótesis (V1 de Vectores en el plano) |
| TP-SOLO-VY | Da solo la velocidad vertical como rapidez | A2 (Predice) | Hipótesis |
| TP-V-CONSTANTE | «Sin aire, la rapidez no cambia» | A2, A3 (Predice) | Hipótesis |
| TP-RESTA-V | Resta las componentes | A2 | Hipótesis |
| TP-TAN-INV | Usa lo que avanza entre lo que baja (tan θ al revés) | A2 | Hipótesis |
| TP-45 | Da el instante o el ángulo de los 45° para otro ángulo | A2, A4 | Hipótesis |
| TP-SENO | Relaciona las componentes con el seno en vez de la tangente | A2 | Hipótesis |
| TP-DOBLE-T | Toma 5 m/s por segundo en vez de 10 (duplica el tiempo) | práctica A2 | Hipótesis |
| TP-CIMA-0 | En la cima la velocidad es cero (lleva la cima del lanzamiento vertical al plano) | A3 (Predice) | Hipótesis |
| TP-COMPONENTE | Da la parte que sube como si fuera la rapidez | A3 (Predice), A4 | Hipótesis |
| TP-SENCOS | Cambia el seno y el coseno al partir v₀ | A3, A4 | Hipótesis |
| TP-V0 | Usa la rapidez entera donde va una componente | A3, A4 | Hipótesis |
| TP-MITAD | Reparte la rapidez por mitades entre las dos componentes | A3 | Hipótesis |
| TP-ANGULO | Hace la componente proporcional a los grados | práctica A3 | Hipótesis |
| TP-SIN-G | Olvida que la gravedad frena la subida | A3 | Hipótesis |
| TP-SUBIDA | Da el tiempo (o el avance) hasta la cima como si fuera todo el vuelo | A3, A4, A5 | Hipótesis |
| TP-V0-VUELO | Calcula el vuelo con la rapidez entera hacia arriba | práctica A3 | Hipótesis |
| TP-VUELVE | Desde una azotea, para el reloj al volver a la altura de salida | práctica A3 | Hipótesis |
| TP-SOLTAR | Desde una azotea, calcula como si la pelota se soltara | práctica A3 | Hipótesis |
| TP-MEDIO | Divide entre g en vez de 2g en la altura máxima | A4 | Hipótesis |
| TP-TIEMPO | Da el tiempo de subida donde piden la altura | A4 | Hipótesis |
| TP-SOLO-ANGULO | «Si el ángulo no cambia, cae en el mismo sitio» | A4 (Predice) | Hipótesis |
| PR-CUBO | Eleva al cubo el factor de la rapidez | A4 (Predice) | Hipótesis |
| PR-DOBLE-K | Multiplica el alcance por 2·k en vez de k² | práctica A4 | Hipótesis |
| TP-DOBLE | Da el doble del ángulo como el que cae en el mismo sitio | A4 | Hipótesis |
| TP-SUPLEMENTO | Da el suplemento (suman 180°) en vez del complemento | A4 | Hipótesis |
| TP-MITAD-ANG | Da la mitad del ángulo como el que cae en el mismo sitio | A4 | Hipótesis |
| TP-SEN-POR | Multiplica por sen 45° en vez de dividir para la rapidez entera | A4 | Hipótesis |
| TP-SUBIDA-V0 | Toma todo el vuelo como subida y además divide bien entre sen 45° | A4 | Hipótesis |
| 2D-SUMA | Suma las coordenadas para la distancia al origen (San Marcos 2025-I) | A5 (Predice) | Hipótesis (V1 de Vectores en el plano) |
| 2D-UNA | Da solo la coordenada mayor como distancia | A5 (Predice) | Hipótesis |
| 2D-SIN-T | Usa lo de un segundo (o suma las velocidades) y olvida el tiempo | A5 (Predice) | Hipótesis |
| 2D-EJE | Reemplaza en la ecuación del otro eje | A5 | Hipótesis |
| 2D-CUADRADO | Eleva t al cuadrado donde la ecuación tiene t (o al revés) | A5 | Hipótesis |
| 2D-DIST | Da la distancia al origen cuando piden una coordenada | A5 | Hipótesis |
| 2D-RESTA | Resta las coordenadas | A5 | Hipótesis |
| 2D-SIN-X0 | Olvida la posición inicial en x(t) | práctica A5 | Hipótesis |
| 2D-TIEMPO | Da el instante en que y = 0 cuando piden la distancia | A5 | Hipótesis |

## Hipótesis de la Etapa 4 (sin estudio)

Índice (19 nov 2026) de los códigos de error que estrenó la Etapa 4 del plan de calidad (`docs/etapa4/decisiones.md`)
y que usan hoy su teoría y su práctica. **Ninguno tiene un estudio detrás**: son hipótesis de diseño, que salen del
temario, de la forma de las alternativas de examen y de academia o de aplicar mal la regla de la idea. Se confirman o
se descartan con lo que midan la app y el piloto; aquí no se les agrega ninguna cita. La lista sale del código (los
`error` de la teoría y los códigos de los generadores), y la descripción de cada uno está en la sección que dice la
última columna.

No entran en el índice: los que ya estaban en el catálogo de arriba (C1, C2, G3, G4, K1, K3, K4); los que parten uno
de esos códigos y heredan su respaldo (C2-liviano, C2-suave, G2-altura-entre-tiempo, G2-pendiente-es-altura,
G2-ultimo-punto, G4-medio, G4-tiempo, K1-a, K1-b); los de unidades y proporción, que se describen en
`fisica-calculo-transversal-ideas-erroneas.md` y llevan un sufijo que dice el caso (PR1-frenado, U1-al-reves,
U1-inversa, U1-kmh, U1-ms, U2-cm, U2-km, U6-min).

| Dónde se usan | Cuántos | Códigos | Descripción |
| --- | --- | --- | --- |
| «Movimiento rectilíneo uniforme», teoría (`contenido/teoria/fisica/movimiento-rectilineo.js`) | 32 | DX-DISTANCIA, DX-IDA, DX-RAPIDEZ, MED-CRUZADO, MED-PROMEDIO, MED-PROMEDIO-MITADES, MED-SUMA, MED-TRAMO, MED-UN-TIEMPO, MRU-CONTEO, MRU-ECUACION, MRU-SIGNO, MRU-SUMA, MRU-X0, REL-IDA, REL-PITAGORAS, REL-SENTIDO, REL-SIGNO, REL-SIN-MARCO, REL-SOLO-A, REL-SOLO-RIO, REL-SUMA, VR-POSICION, VR-RELOJ, VR-RESTA, VR-SUMA, VR-UNO, VR-VENTAJA, XT-INVERSA, XT-LEIDO, XT-SIGNO, XT-SIN-DIVIDIR | «MRU (18 nov)»; los de la idea 1 (MRU-…), también en la cabecera de la unidad |
| Práctica de MRU (`plantillas/fis-mru/generador.js`) | 57 | DX-DISTANCIA, DX-IDA, DX-RAPIDEZ, DX-SUMA-POSICIONES, DX-VUELTA-ENTERA, ENC-CRUCE, ENC-MITAD, ENC-OTRO, ENC-PRIMERA, ENC-SOLO-S, ENC-UN-LARGO, MED-CRUZADO, MED-PROMEDIO, MED-PROMEDIO-MITADES, MED-SIN-PARADA, MED-SUMA, MED-TRAMO, MED-UN-TIEMPO, MRU-CONTEO, MRU-ECO-DOBLE, MRU-ECO-ESCUCHA, MRU-ECO-MEDIO, MRU-ECO-MITAD, MRU-ECO-QUIETO, MRU-ECO-RESTA, MRU-ECO-SIN-MITAD, MRU-ECO-UNO, MRU-ECUACION, MRU-IDA, MRU-RESTA-V, MRU-SIGNO, MRU-SUMA, MRU-X0, REL-CRUZA, REL-IDA, REL-PITAGORAS, REL-SENTIDO, REL-SIGNO, REL-SIN-MARCO, REL-SIN-MITAD, REL-SOLO-A, REL-SOLO-RIO, REL-SUMA, REL-UN-LARGO, VR-PROMEDIO, VR-RELOJ, VR-RESTA, VR-SUMA, VR-UNO, VR-VENTAJA, XT-CAMBIA, XT-INVERSA, XT-LEIDO, XT-POSICION, XT-PRIMER-PUNTO, XT-SIGNO, XT-SIN-DIVIDIR | «Práctica de MRU (fis-mru, 18 nov)» y «MRU (18 nov)» |
| «MRUV y caída libre», teoría (`contenido/teoria/fisica/mruv-y-caida-libre.js`) | 56 | C-ALTURA, C-AREA, C-ENC-CAIDA, C-ENC-MITAD, C-ENESIMO, C-JUNTAS, C-LINEAL, C-MEDIO, C-RAIZ, C-RESTA-ALTURAS, C-SIN-SONIDO, C-SOLO-SONIDO, C-SOLTAR, C-SUBIDA, C-TIEMPO, C-VELOCIDAD, C-VUELTA, DX-ALTURA, DX-IDA, DX-INICIAL, DX-RECT, DX-RESTA, DX-SEMI, DX-SUMA, DX-TRAMO, DX-TRIANGULO, G-SENTIDO, K-A0, K-ALC-D, K-ALC-PERSEGUIDOR, K-CUADRADO, K-POR, K-SIGNO, K-SINDIV, K-SUMA, K-TIEMPO, MED-PROMEDIO-A, MED-TRAMO, MRU-X0, MRUV-ACEL, MRUV-DESDE-0, MRUV-DIVIDE, MRUV-FRENO-IGUAL, MRUV-LEE-PUNTO, MRUV-MEDIO, MRUV-MEDIO-A, MRUV-MITAD, MRUV-NUNCA, MRUV-ORIGEN, MRUV-POSICION, MRUV-POSICION-FINAL, MRUV-SIGNO-D, MRUV-SIN-A, MRUV-SOLO-ACELERA, MRUV-TIEMPO, MRUV-VT | «MRUV y caída libre (18 nov)», «En la teoría (B1 a B6)» |
| Práctica de MRUV (`plantillas/fis-mruv/generador.js`) | 98 | AT-ALTURA, AT-TODO, AT-TRAMO, C-ALTURA, C-ANTERIOR, C-CUADRADO, C-CUARTO, C-ENC-CAIDA, C-ENC-CAIDO, C-ENC-MITAD, C-ENC-MITAD-H, C-ENC-SIN-G, C-ENESIMO, C-IGUAL, C-LINEAL, C-MEDIO, C-MITAD-T, C-OTRO-SEG, C-RAIZ, C-RESTA-ALTURAS, C-SIN-G, C-SIN-SONIDO, C-SIN-V0, C-SOLO-G, C-SOLO-UNA, C-SOLTAR, C-SONIDO-DOBLE, C-SUBIDA, C-SUMA-T, C-TIEMPO, C-VELOCIDAD, C-VUELTA, C-VUELTA-SOLTAR, DX-ALTURA, DX-IDA, DX-INICIAL, DX-MEDIA-V, DX-RECT, DX-RESTA, DX-SEMI, DX-SIGNO, DX-SOLO-TRI, DX-SUMA, DX-TRAMO, DX-TRAPECIO, DX-TRIANGULO, G-SENTIDO, K-ALC-D, K-ALC-PERSEGUIDOR, K-ALC-SIN-D, K-ALC-TIEMPO, K-CUADRADO, K-INVERSA, K-MITAD, K-POR, K-RESTA-T, K-SEP-ALCANCE, K-SEP-MOTO, K-SEP-TIEMPO, K-SIGNO, K-SIN-V0, K-SINDIV, K-SUMA, K-TIEMPO, MED-PROMEDIO-A, MED-SIN-RESTA, MED-SUMA-A, MED-TRAMO, MRU-X0, MRUV-ACEL, MRUV-ANTERIOR, MRUV-DESDE-0, MRUV-DIF-D, MRUV-DISTANCIA, MRUV-DOBLE-TRAMO, MRUV-ENESIMO, MRUV-FRENO-IGUAL, MRUV-MEDIA-V, MRUV-MEDIO, MRUV-MEDIO-A, MRUV-MITAD, MRUV-OTRO-SEG, MRUV-POS-INICIAL, MRUV-POSICION, MRUV-POSICION-FINAL, MRUV-RAIZ, MRUV-RESTA, MRUV-SIGNO-D, MRUV-SIN-A, MRUV-SIN-CUADRADO, MRUV-SIN-DOS, MRUV-SIN-V0, MRUV-SOLO-ACELERA, MRUV-SUMA-RAIZ, MRUV-TIEMPO, MRUV-VEL-N, MRUV-VMAX, MRUV-VT | «MRUV y caída libre (18 nov)», «Nuevos de la práctica (`fis-mruv`)» y «En la teoría (B1 a B6)» |

## Fuentes

- [Beichner (1994), *Testing student interpretation of kinematics graphs*, American Journal of Physics 62(8), 750–762](https://moodle2.units.it/pluginfile.php/732257/mod_resource/content/1/Testing%20student%20understanding%20kinematics%20graphs.pdf). 895 estudiantes; test TUG-K con porcentajes por objetivo y por pregunta.
- [Thornton y Sokoloff (1998), *Assessing student learning of Newton's laws: The Force and Motion Conceptual Evaluation*, American Journal of Physics 66(4), 338–352](https://pages.uoregon.edu/sokoloff/FMCE.pdf). 240 estudiantes de Oregon, antes y después de instrucción tradicional y activa.
- [Prescott y Mitchelmore (2005), *Student Misconceptions about Projectile Motion*, MERGA 28](https://merga.net.au/wp-content/uploads/DOCS/common/Uploaded%20files/Annual%20Conference%20Proceedings/2005%20Annual%20Conference%20Proceedings/Prescott%20Mitchelmore%20RP722005.pdf). 47 alumnas de último año de secundaria en Sídney; cita a McCloskey (1983) y a Jimoyiannis y Komis (2001).
- [Carrascosa, Gil Pérez y Valdés (2004), *El problema de las concepciones alternativas, hoy*, Didáctica de las Ciencias Experimentales y Sociales 18, 41–63](https://ojs.uv.es/index.php/dces/article/download/2900/2472). Revisión en español.
- [Trowbridge y McDermott (1980), *Investigation of student understanding of the concept of velocity in one dimension*, American Journal of Physics 48(12)](https://www.compadre.org/portal/items/detail.cfm?ID=2964). Solo la ficha y reseñas.
- [Trowbridge y McDermott (1981), *Investigation of student understanding of the concept of acceleration in one dimension*, American Journal of Physics 49(3)](https://www.compadre.org/portal/items/detail.cfm?ID=2965). Solo la ficha y reseñas.
- [McDermott, Rosenquist y van Zee (1987), *Student difficulties in connecting graphs and physics: Examples from kinematics*, American Journal of Physics 55(6)](https://www.compadre.org/portal/items/detail.cfm?ID=2739). Solo la ficha y reseñas.
- Jimoyiannis y Komis (2001), *Computer simulations in physics teaching and learning: a case study on students' understanding of trajectory motion*, Computers & Education 36(2), 183–204. Leído a través de Prescott y Mitchelmore.
