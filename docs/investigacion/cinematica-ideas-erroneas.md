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

## Fuentes

- [Beichner (1994), *Testing student interpretation of kinematics graphs*, American Journal of Physics 62(8), 750–762](https://moodle2.units.it/pluginfile.php/732257/mod_resource/content/1/Testing%20student%20understanding%20kinematics%20graphs.pdf). 895 estudiantes; test TUG-K con porcentajes por objetivo y por pregunta.
- [Thornton y Sokoloff (1998), *Assessing student learning of Newton's laws: The Force and Motion Conceptual Evaluation*, American Journal of Physics 66(4), 338–352](https://pages.uoregon.edu/sokoloff/FMCE.pdf). 240 estudiantes de Oregon, antes y después de instrucción tradicional y activa.
- [Prescott y Mitchelmore (2005), *Student Misconceptions about Projectile Motion*, MERGA 28](https://merga.net.au/wp-content/uploads/DOCS/common/Uploaded%20files/Annual%20Conference%20Proceedings/2005%20Annual%20Conference%20Proceedings/Prescott%20Mitchelmore%20RP722005.pdf). 47 alumnas de último año de secundaria en Sídney; cita a McCloskey (1983) y a Jimoyiannis y Komis (2001).
- [Carrascosa, Gil Pérez y Valdés (2004), *El problema de las concepciones alternativas, hoy*, Didáctica de las Ciencias Experimentales y Sociales 18, 41–63](https://ojs.uv.es/index.php/dces/article/download/2900/2472). Revisión en español.
- [Trowbridge y McDermott (1980), *Investigation of student understanding of the concept of velocity in one dimension*, American Journal of Physics 48(12)](https://www.compadre.org/portal/items/detail.cfm?ID=2964). Solo la ficha y reseñas.
- [Trowbridge y McDermott (1981), *Investigation of student understanding of the concept of acceleration in one dimension*, American Journal of Physics 49(3)](https://www.compadre.org/portal/items/detail.cfm?ID=2965). Solo la ficha y reseñas.
- [McDermott, Rosenquist y van Zee (1987), *Student difficulties in connecting graphs and physics: Examples from kinematics*, American Journal of Physics 55(6)](https://www.compadre.org/portal/items/detail.cfm?ID=2739). Solo la ficha y reseñas.
- Jimoyiannis y Komis (2001), *Computer simulations in physics teaching and learning: a case study on students' understanding of trajectory motion*, Computers & Education 36(2), 183–204. Leído a través de Prescott y Mitchelmore.
