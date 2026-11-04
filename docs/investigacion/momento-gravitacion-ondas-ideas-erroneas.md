# Ideas erróneas en cantidad de movimiento, gravitación, oscilaciones y ondas

4 de noviembre de 2026 · Tarea 4 de `CLAUDE.md`, quinto tema de física (sigue a [cinemática](cinematica-ideas-erroneas.md) y [dinámica](dinamica-ideas-erroneas.md))

Para qué sirve: cubre las semanas 6 a 10 del sílabo CEPRE-UNI 2026-2. Son cuatro bloques: impulso y choques, gravitación, movimiento armónico simple (MAS) y ondas mecánicas con sonido. Este documento junta los errores documentados para escribir las predicciones de sus plantillas.

## Resumen en seis líneas

1. **Ondas es el bloque con mejores datos y el único con un estudio latinoamericano.** En México, 541 universitarios rindieron en español el *Mechanical Waves Conceptual Survey* (Barniol y Zavala, 2017). Solo el 28 % supo que mover la mano más rápido no cambia la rapidez de un pulso en una cuerda. El 46 % cree que un sonido más agudo viaja más rápido, porque lee mal v = f·λ.
2. **La idea de "lanzar la onda como una pelota" es la más fuerte de todo el informe.** En Maryland, cerca del 90 % de los universitarios creía antes de la instrucción que la mano que agita la cuerda fija la rapidez del pulso. Después de una instrucción diseñada contra ese error, la mitad seguía creyéndolo (Wittmann, 2002; Wittmann, Steinberg y Redish, 1999).
3. **"En el espacio no hay gravedad" está medido.** En una pregunta abierta, el 50,3 % de los alumnos de un curso universitario de astronomía dijo que los astronautas flotan porque en el espacio no hay gravedad. Solo el 9,7 % habló de caída libre. En una versión de opción múltiple, después del curso, el 72,7 % eligió "escaparon de la gravedad de la Tierra" (Williamson y otros, 2013).
4. **En choques, el error central es tratar la cantidad de movimiento como un escalar y como algo de cada cuerpo.** Después de la instrucción, el 50 % de 336 universitarios dijo que una pelota que rebota empuja a la pared con la misma fuerza que una que se pega; la que rebota empuja el doble (Singh y Rosengrant, 2003). En Indonesia, el 26 % de 175 escolares restó las rapideces del rebote sin considerar el sentido (Saifullah y otros, 2017).
5. **En oscilaciones casi no hay datos con porcentaje.** Hay un dato pequeño: cerca del 25 % de 46 estudiantes avanzados explicó que más amplitud da más período (Ambrose, 2006). Que el período del péndulo dependa de la masa está documentado solo de forma cualitativa: en un estudio español con ocho estudiantes, la idea resistió incluso después de medir (González, Mellado y Ruiz, 2005).
6. **Los errores de cálculo propios del examen no tienen estudios.** Entre ellos están el factor 2 de los armónicos, sumar decibeles, g ∝ 1/r en vez de 1/r², T ∝ L en el péndulo y la energía cinética a media amplitud. Quedan como hipótesis, aunque varios son la cara numérica de errores medidos.

## Catálogo con respaldo

### Impulso, choques y centro de masa

Fuente principal: el *Energy and Momentum Conceptual Survey* (EMCS) de Singh y Rosengrant (2003). Los porcentajes por opción salen de su tabla II: tres cursos universitarios de física con cálculo de Estados Unidos, 352 alumnos antes y 336 después de la instrucción, con datos sin emparejar. La extracción del texto perdió las cursivas que marcan la opción correcta. La deduje de la física de cada pregunta y la comprobé con su tabla I, que da el porcentaje de aciertos por pregunta.

| # | Idea errónea | Lo correcto | Qué tan frecuente | Fuente |
| --- | --- | --- | --- | --- |
| M1 | **La cantidad de movimiento y la energía cinética se conservan para cada cuerpo**, no para el sistema. En un choque elástico, "la energía del disco blanco se conserva". | En un choque se conserva la cantidad de movimiento **del sistema**. Cada cuerpo, por separado, gana o pierde. | Ítem 3 del EMCS: antes de la instrucción, el 55 % eligió una opción que incluía "la energía cinética del disco blanco se conserva"; después, el 39 %. En Indonesia, la mayoría de 175 escolares eligió que solo se conserva la de una canica (sin cifra exacta para ese ítem). | Singh y Rosengrant (2003); Saifullah, Sutopo y Wisodo (2017) |
| M2 | **La cantidad de movimiento es un escalar.** En un rebote, el cambio se calcula restando las rapideces, sin considerar el sentido. | Δp = p_final − p_inicial con signo. Si la pelota rebota, los dos términos se suman en valor absoluto. | 175 escolares de Indonesia, problema numérico de un carrito que rebota: 54 % acierta; 26 % resta las rapideces sin signo; 14 % comete además otro error. Con el mismo problema en forma de diagrama de vectores, solo acierta el 15 %. | Saifullah, Sutopo y Wisodo (2017) |
| M3 | **La pelota que rebota y la que se pega empujan igual** a la pared, porque llegan con la misma rapidez y la misma masa. | La que rebota tiene el doble de cambio en su cantidad de movimiento; con el mismo tiempo de contacto, ejerce el doble de fuerza. | Ítem 23 del EMCS: 45 % antes y **50 % después** de la instrucción eligió "fuerzas iguales". Solo el 25 % acertó después. | Singh y Rosengrant (2003) |
| M4 | **El proyectil que se incrusta transmite más**, "porque le entrega toda su energía". El que rebota "no le da su cantidad de movimiento". | El bloque del que rebota la bala sale más rápido: recibe más cantidad de movimiento. | Ítem 5 del EMCS, después de la instrucción: 30 % "le entrega toda su energía"; 20 % "la bala que rebota no le da su cantidad de movimiento" (subió desde 15 %). Correcta: 27 %. | Singh y Rosengrant (2003) |
| M5 | **La energía cinética se conserva en una explosión o en un choque inelástico.** Algunos entrevistados creen que la energía cinética es un vector. | En una explosión o en un choque plástico se conserva la cantidad de movimiento, no la energía cinética. | Ítem 10 del EMCS (bomba que explota): 46 % antes y 33 % después eligió una opción que dice que se conserva la energía cinética. | Singh y Rosengrant (2003) |
| M6 | **Péndulo balístico con un solo principio.** Resolver todo con energía, o todo con cantidad de movimiento. | El choque se resuelve con cantidad de movimiento; la subida posterior, con energía. | Ítem 16 del EMCS: es la única pregunta que **empeoró** con la instrucción (34 % de aciertos antes, 26 % después). Después, el 37 % eligió "solo energía". | Singh y Rosengrant (2003) |
| M7 | **El pajar da un impulso menor** que la pared. | El cambio de cantidad de movimiento (el impulso) es el mismo; el pajar lo reparte en más tiempo y la fuerza media es menor. | Ítem 19 del EMCS: 14 % antes y 19 % después eligió "el pajar da menos impulso". Correcta: 70 % después. | Singh y Rosengrant (2003) |
| M8 | **Más masa, más cantidad de movimiento; o más rapidez, más cantidad de movimiento**, mirando una sola de las dos. | p = m·v: hay que mirar las dos a la vez. | 175 escolares de Indonesia, dos bloques empujados por la misma fuerza: 55 % "el de más masa"; 39 % "el más rápido"; **nadie** acertó. | Saifullah, Sutopo y Wisodo (2017) |
| M9 | **En el empujón, el más pesado o el que empuja ejerce más fuerza** (la versión de D10 de [dinámica](dinamica-ideas-erroneas.md) en un retroceso). | Las fuerzas del par son iguales; por eso la cantidad de movimiento total sigue en cero. | Dos estudiantes, uno empuja al otro: 57 % "el más pesado o el que empuja"; 31 % "solo el que empuja ejerce fuerza"; 2 % acertó. | Saifullah, Sutopo y Wisodo (2017) |

**Lo que se aprende.** Los alumnos usan bien Δp = F·Δt cuando el enunciado les da todos los números. Fallan cuando tienen que decidir qué se conserva y para qué sistema, y cuando el signo importa. Singh y Rosengrant notan además que las preguntas que exigen dos principios a la vez (M6) son las que menos se aprenden. Para la plantilla, significa dos cosas: dibujar siempre el borde del sistema, y mostrar la cantidad de movimiento como una flecha con sentido, no como un número.

**Sin dato para el centro de masa.** No encontré estudios con porcentaje sobre el centro de masa en una dimensión. Los errores que suponemos están en la sección de hipótesis.

### Gravitación universal

Fuente principal: el *Newtonian Gravity Concept Inventory* (NGCI) de Williamson, Willoughby y Prather (2013). La versión final la rindieron 925 alumnos antes del curso y 743 después, en seis universidades de Estados Unidos. Son cursos de astronomía para no científicos, un público más débil que el postulante a la UNI. Las versiones 1 y 2 se aplicaron solo después del curso, en Montana State: 230 y 259 alumnos. Los porcentajes por opción que cito son siempre de después del curso.

| # | Idea errónea | Lo correcto | Qué tan frecuente | Fuente |
| --- | --- | --- | --- | --- |
| G1 | **En el espacio no hay gravedad; por eso flotan los astronautas.** | A 400 km de altura, la gravedad de la Tierra es casi el 90 % de la del suelo. Flotan porque la nave y ellos caen juntos. | Pregunta abierta: 50,3 % "no hay gravedad en el espacio"; 14,6 % "es mucho más débil"; 10,2 % "están muy lejos"; solo 9,7 % "caída libre". Opción múltiple, versión 2: 72,7 % "escaparon de la gravedad de la Tierra". Versión 3: 12,7 % "no sienten fuerza de la Tierra" y 19,4 % "la nave hace una fuerza que la anula"; correcta: 67,4 %. | Williamson y Willoughby (2012), leído a través de Williamson y otros (2013); Williamson y otros (2013) |
| G2 | **La atmósfera es el borde de la gravedad**, o la gravedad necesita aire. Se mezcla con el magnetismo, la rotación o la presión del aire. | La gravedad depende solo de las masas y la distancia. No se apaga al salir del aire. | Versión 3, "¿por qué la Tierra atrae objetos?": solo 49,5 % "porque tiene masa"; 39,4 % "más de una de estas" (masa con atmósfera, campo magnético o rotación). En Ciudad del Cabo, 11 % de 79 universitarios dijo antes del curso que un lapicero soltado en la Luna flotaría para siempre; después del curso, 19 % de 91. | Williamson y otros (2013); Rajpaul, Allie y Blyth (2014) |
| G3 | **La fuerza baja en proporción directa a la distancia**, no a su cuadrado. | F ∝ 1/r². El doble de distancia da la cuarta parte. | Versión 2 (Luna al doble de distancia): 72,3 % "la mitad". Versión 3 (cuatro veces más lejos): 35,7 % "cuatro veces más débil", 16,8 % "ocho veces"; correcta (16 veces): 40,1 %. | Williamson y otros (2013) |
| G4 | **Mismo peso en dos planetas, misma masa.** Se olvida el radio. Y la distancia se mide desde la superficie, no desde el centro. | g = GM/R²: dos planetas de masas distintas pueden dar el mismo peso si sus radios compensan. La distancia va de centro a centro. | Pregunta 25, versión 3: 63,3 % "deben tener la misma masa". Es la pregunta más difícil del test. Lo de medir desde la superficie se reporta como idea frecuente, sin porcentaje. | Williamson y otros (2013) |
| G5 | **Solo los cuerpos muy pesados atraen**, o solo lo que se ve moverse. | Toda masa atrae a toda masa. | Pregunta abierta: 18,9 % "solo los muy pesados". Versión 3: 22,6 % cree que la Tierra atrae a la Luna y a una persona, pero no al Sol ni a Marte; correcta: 65,1 %. | Williamson y otros (2013) |
| G6 | **El planeta va con rapidez constante en su órbita** (segunda ley de Kepler). | Va más rápido cerca del Sol y más lento lejos. | Entrevistas a 112 universitarios antes del curso: solo 45 % respondió algo. De los que respondieron, 48 % dijo "rapidez constante" y 35 % dio la respuesta correcta. | Yu, Sahami y Denn (2010) |
| G7 | **Las órbitas de los planetas son elipses muy alargadas.** | Son casi circulares. La elipse alargada de los libros exagera. | Cerca de tres cuartos de las 112 entrevistas. Además, 8 de 112 dijeron que la rapidez de un planeta depende de su masa o tamaño (tercera ley). | Yu, Sahami y Denn (2010) |
| G8 | **En un ascensor en caída libre, el peso que marca la balanza no cambia o aumenta.** | La balanza marca cero: hombre y balanza caen juntos. Es la misma razón por la que flotan los astronautas. | 135 estudiantes de Turquía (85 escolares y 50 futuros profesores): 20 % dijo "ingrávido"; 44 % "disminuye"; 14 % "aumenta"; 13 % no respondió. | Gürel y Acar (2003) |

**Lo que se aprende.** El modelo de fondo es el del "borde": la gravedad vive dentro de la atmósfera y se apaga afuera (Williamson y Willoughby lo llaman *Boundary Model*). Junto con G3, explica el error de examen más probable en "g a cierta altura": creer que g cae mucho más rápido de lo que cae, o que cae linealmente. Gürel y Acar recalcan que los alumnos no tienen sentido del orden de magnitud: les sorprende que a la altura de la estación espacial la gravedad siga siendo casi el 90 % de la del suelo.

**Un matiz sobre G1.** En el NGCI, la versión de opción múltiple que pregunta "¿siente fuerza de la Tierra?" da menos error (12,7 %) que la pregunta abierta "¿por qué flota?" (50,3 %). Para la plantilla, la pregunta tiene que ser la abierta, la del porqué: ahí aparece el error.

### Oscilaciones (MAS)

| # | Idea errónea | Lo correcto | Qué tan frecuente | Fuente |
| --- | --- | --- | --- | --- |
| O1 | **Más amplitud, más período**, porque "el bloque recorre más camino". | En el MAS, el período no depende de la amplitud: T = 2π√(m/k). | Cerca del 25 % de 46 estudiantes de mecánica intermedia (tercer año), después de las clases; fue la explicación incorrecta más común. Solo cerca del 10 % dio una explicación completa y correcta, aunque la mayoría eligió bien la respuesta. | Ambrose (2006) |
| O2 | **Aciertan con "compensación"**: "va más rápido, pero recorre más, así que tarda lo mismo". | Es una respuesta correcta con un razonamiento que no se generaliza. El período depende solo de m y k. | Fue la justificación de muchas respuestas correctas; sin porcentaje. | Ambrose (2006) |
| O3 | **El período del péndulo depende de la masa**, en los dos sentidos: "a más peso tarda más" y "es más ligera y tiene que ir más deprisa". | Para ángulos pequeños, T = 2π√(L/g), sin la masa. | Estudio de casos con 8 estudiantes universitarios de España: la idea resistió a la lectura del libro y a las primeras mediciones; un estudiante siguió sin convencerse al final. Sin porcentaje. | González, Mellado y Ruiz (2005) |
| O4 | **La longitud del péndulo es solo la del hilo**, sin llegar al centro de la esfera. | L va del punto de suspensión al centro de masa de la esfera. | Apareció en uno de los dos grupos del mismo estudio y fue clave para que el grupo cambiara de idea. Sin porcentaje. | González, Mellado y Ruiz (2005) |

**Lo que se aprende.** El hueco más grande del informe está aquí. No encontré un test de oscilaciones con porcentajes en alumnos de secundaria o de primer año. El estudio de Ambrose es de alumnos de tercer año. Que crean que la amplitud cambia el período sugiere que el error es más común en un postulante. La masa del péndulo conecta con D5 de dinámica ("el más pesado cae más rápido"). Los mismos estudiantes dicen "a más masa, más fuerza de gravedad", sin ver que también hay más inercia.

### Ondas mecánicas y sonido

Fuente principal en español: Barniol y Zavala (2017). Aplicaron el *Mechanical Waves Conceptual Survey* (MWCS), traducido al español, a 541 estudiantes de ingeniería de una universidad privada de México, al terminar el curso de ondas. El promedio fue 9,86 de 22 preguntas.

| # | Idea errónea | Lo correcto | Qué tan frecuente | Fuente |
| --- | --- | --- | --- | --- |
| ON1 | **La mano fija la rapidez del pulso.** Agitar más rápido, más fuerte o más alto hace un pulso más rápido, como lanzar una pelota más fuerte. | La rapidez depende solo del medio: v = √(T/μ). La mano fija la forma y la frecuencia, no la rapidez. | Maryland, 92 alumnos emparejados: antes de la instrucción, el 89 % incluyó la mano entre las causas, en opción múltiple; después, 52 %. Wittmann resume: cerca del 90 % antes y la mitad después de instrucción modificada. México: solo 28 % acertó; 34 % "mover la mano más rápido". | Wittmann, Steinberg y Redish (1999); Wittmann (2002); Barniol y Zavala (2017) |
| ON2 | **Más frecuencia, más rapidez**, leyendo v = f·λ como si λ quedara fija. | En un mismo medio, si f sube, λ baja y v no cambia. | México: 46 % dijo que el sonido agudo viaja más rápido; 41 % que dos sonidos de igual frecuencia van igual "porque tienen la misma frecuencia"; 31 % sostuvo la idea en ambas preguntas. Tongchai y otros (2011) reportan 25 % con el mismo test (citado por Barniol y Zavala). | Barniol y Zavala (2017) |
| ON3 | **Más amplitud o más volumen, más rapidez**, "porque tiene más energía". | La rapidez no depende de la amplitud. | Lo reportan entrevistas en Maryland y un estudio con 138 escolares de Tailandia, en el que el grupo con instrucción y el grupo sin ella tuvieron casi las mismas ideas. Sin porcentaje en lo leído. | Wittmann, Steinberg y Redish (1999); Tongchai, Arayathanitkul y Soankwan (2012), solo resumen |
| ON4 | **Cuerda más pesada, pulso más rápido.** | Con la misma tensión, la cuerda más pesada da un pulso más lento. | México: 11 % (correcta: 70 %). Pero 74 % no respondió bien las dos preguntas de la cuerda a la vez. | Barniol y Zavala (2017) |
| ON5 | **El sonido empuja el aire hacia adelante.** La partícula de polvo frente al parlante "se va", en línea recta o siguiendo una senoide. | El aire oscila de ida y vuelta en la dirección de propagación; no viaja con la onda. | Maryland, 137 alumnos emparejados: antes de la instrucción, 50 % "se va"; después de clases tradicionales, 39 %; después del tutorial, 11 %. Respuesta correcta: 9 %, 26 % y 45 %. México: 40 % "se va"; 19 % "oscila de arriba abajo". | Wittmann, Steinberg y Redish (2003); Barniol y Zavala (2017) |
| ON6 | **El sonido es una cosa** distinta del aire: pasa por los huecos entre las partículas, tiene masa y viaja mejor en el vacío "porque nada lo estorba". | El sonido es una perturbación del medio. Sin medio no hay sonido. | Entrevistas a 23 universitarios de un curso conceptual: 12 usaron este modelo al menos una vez; solo 3 usaron el modelo de onda. Casi todos empezaron con este modelo, y después de la instrucción quedaron igual o en un modelo intermedio. | Hrepic, Zollman y Rebello (2010) |
| ON7 | **Los pulsos chocan como carritos**: se anulan, rebotan o salen más chicos "porque perdieron energía". Y solo se suman cuando coinciden sus picos. | Los pulsos se atraviesan y salen intactos. Mientras se superponen, se suman punto por punto. | 182 alumnos antes de la instrucción: 55 % acierta; 20 % dice que se anulan para siempre. 65 alumnos después de las clases: 40 % "solo se suman si coinciden los picos"; 5 % acierta. México: 27 % "solo los picos"; 9 % "salen más chicos". | Wittmann, Steinberg y Redish (1999); Barniol y Zavala (2017) |
| ON8 | **Ondas estacionarias: invertir el efecto de la tensión o de la densidad.** Saber que la rapidez cambia, pero predecir mal hacia dónde va la longitud de onda. | Con la frecuencia fija, más tensión da más rapidez y más λ; más densidad da menos rapidez y menos λ. | México, con justificación obligatoria: tensión, 26 % acierta; densidad, 42 %. El error más común en las dos: la justificación correcta con la predicción al revés (16 % y 20 %). | Barniol y Zavala (2017) |
| ON9 | **Confundir frecuencia con amplitud** (tono con volumen). | El tono depende de la frecuencia; el volumen, de la amplitud. | México: 20 %. | Barniol y Zavala (2017) |
| ON10 | **En la función de onda, el pulso se achica al avanzar.** Al ver y = A·e^(−x²/b²), se cree que el pulso se achica al aumentar x. | La forma se conserva; solo se traslada (x se reemplaza por x − vt). | Respuesta común en entrevistas y pruebas de Maryland; sin porcentaje. | Wittmann (2002) |

**Lo que se aprende.** Wittmann lo llama el modelo de "pulsos como partículas": la onda es un objeto que se lanza (ON1, ON3), que empuja lo que encuentra (ON5) y que choca (ON7). Hrepic y otros encuentran lo mismo en el sonido (ON6). Es el mismo patrón que el ímpetu en dinámica, un solo modelo de fondo que produce muchos errores. Para el laboratorio, la escena debe separar siempre dos rapideces con colores distintos: la de un trozo de cuerda (de arriba abajo, la controla la mano) y la del pulso (a lo largo, la controla el medio). Wittmann señala que los alumnos confunden justamente esas dos.

**Una cautela sobre ON2.** El error de v = f·λ lo produce la fórmula que se enseña. Barniol y Zavala lo dicen así: los alumnos no ven que, si f cambia en el mismo medio, λ se ajusta. Una academia que enseñe v = f·λ sin v = √(T/μ) al lado puede estar reforzando ON2.

## Lo que no tiene respaldo (todavía)

Errores de cálculo típicos de los problemas de admisión. No encontré estudios que los midan; algunos son la cara numérica de un error documentado.

| Error que suponemos | Error documentado del que sale |
| --- | --- |
| En el choque plástico, calcular la velocidad final conservando la energía cinética | M5 |
| En el choque elástico entre masas distintas, suponer que "intercambian velocidades" (solo vale con masas iguales) | M1 |
| Impulso con rebote: Δp = m(v − v') en vez de m(v + v') | M2 (sí medido en un problema numérico) |
| Centro de masa: promediar las posiciones sin pesar por la masa | Ninguno; hipótesis pura |
| Creer que el centro de masa se mueve cuando una bomba en reposo explota | M5 y M9: no ver al sistema como un todo |
| g a una altura h: usar g·R/(R + h) (lineal), o g·(R/h)² (distancia desde la superficie) | G3 y G4 |
| Tercera ley de Kepler: T ∝ a en vez de T² ∝ a³ | G3, el mismo error de proporcionalidad |
| Satélite: creer que uno más pesado necesita más rapidez para la misma órbita | G7 (8 de 112 en Yu y otros), sin medir en problemas numéricos |
| Péndulo: T ∝ L en vez de T ∝ √L; o T ∝ √m por transferir la fórmula del resorte | O3 |
| Resorte: T ∝ m en vez de T ∝ √m | Ninguno; hipótesis |
| Energía en el MAS: en x = A/2 la energía cinética es la mitad (en realidad es 3/4) | Ninguno; hipótesis |
| Cuerda con extremos fijos: f_n = n·v/L, olvidando el 2; o contar nodos en vez de vientres | ON8 |
| Función de onda: leer k como λ y ω como f; equivocar el sentido de propagación por el signo | ON10 |
| Duplicar la intensidad duplica los decibeles; dos parlantes de 80 dB dan 160 dB | Ver nota |
| Al doble de distancia, la intensidad baja a la mitad (no a la cuarta parte) | G3, el mismo error con 1/r² |

**Nota sobre los decibeles.** Milner-Bolotin y Zazkis (2021) estudiaron a 12 futuros profesores de física de Canadá. Les pidieron escribir un diálogo de clase sobre la escala de decibeles. En sus guiones, el alumno imaginado dice "debería sonar el doble de fuerte porque hay dos". Eso muestra lo que los profesores esperan de sus alumnos, no lo que los alumnos responden. El mismo artículo cita a Liang y Wood (2005): en escolares, el 86 % resuelve ejercicios rutinarios de logaritmos, pero solo el 39 % los aplica a una situación nueva. No leí a Liang y Wood directamente.

Se confirman igual que en los otros temas: con hojas resueltas en la prueba del pase 2 y con predicciones de respuesta abierta.

## Propuesta para las plantillas

**Una regla para las cuatro plantillas.** Toda magnitud con sentido se dibuja como flecha con su color: la cantidad de movimiento en los choques, la fuerza gravitatoria en la órbita, la velocidad del bloque en el resorte, y las dos velocidades de la onda (la del trozo de cuerda y la del pulso). Esto ataca M2, G1, ON1 y ON5, y aplica el principio 4 del laboratorio.

### Choques e impulso

**Problema guiado.** Dos pelotas de 0,5 kg llegan a una pared a 10 m/s. La de goma rebota a 10 m/s; la de plastilina se pega. El contacto dura 0,02 s en las dos.

Predicción: *¿cuál empuja más fuerte a la pared?*

| Opción | Error que representa | Respaldo |
| --- | --- | --- |
| a) Igual, porque llegan con la misma masa y la misma rapidez | M3 | 50 % después de la instrucción (Singh y Rosengrant) |
| b) La de goma, el doble que la de plastilina | Correcta (500 N contra 250 N) | — |
| c) La de plastilina, porque se queda y le entrega toda su energía | M4 | 30 % en la pregunta análoga del bloque y la bala |
| d) La de plastilina, porque la de goma rebota y no le pasa su cantidad de movimiento | M4 | 20 % en la misma pregunta |

**Explorador.**

1. **Choque en una recta con flechas de p.** Se arrastran las dos masas y las velocidades, y se elige elástico o plástico. La flecha de p total no cambia; las flechas de cada cuerpo sí. La barra de energía cinética total baja en el plástico. Ataca M1 y M5.
2. **Pajar y pared.** El mismo Δp con distinto Δt, mostrado como el área de una gráfica F-t: misma área, distinta altura (M7).
3. **Explosión desde el reposo.** Una marca del centro de masa que no se mueve mientras los pedazos salen (hipótesis del centro de masa).

### Gravitación

**Problema guiado.** Una astronauta en la estación espacial, a 400 km de altura. Radio de la Tierra: 6400 km. g = 10 m/s² en la superficie.

Predicción: *¿cuánto vale la fuerza de gravedad sobre ella, comparada con la del suelo?*

| Opción | Error que representa | Respaldo |
| --- | --- | --- |
| a) Cero: en el espacio no hay gravedad | G1 | 50,3 % en pregunta abierta; 72,7 % "escaparon de la gravedad" |
| b) Casi cero: allá arriba es muy débil | G1 | 14,6 % en pregunta abierta |
| c) Casi el 90 % de la del suelo | Correcta (256/289 ≈ 0,886) | — |
| d) La de la Tierra, pero la nave la anula con una fuerza hacia arriba | G1, mezcla de fuerzas | 19,4 % (versión 3 del NGCI) |

**Explorador.**

1. **El cañón de Newton.** Se arrastra la rapidez de lanzamiento horizontal desde una montaña: la trayectoria pasa de parábola a órbita. La flecha de gravedad apunta siempre al centro y casi no se achica. Es lo que proponen Gürel y Acar para G1.
2. **Ascensor en caída libre** con una balanza que marca cero (G8). La escena se pone al lado de la órbita para que el alumno vea que es el mismo fenómeno.
3. **g contra altura.** Se arrastra h y se ve g en una gráfica con 1/r², al lado de la recta 1/r que el alumno espera (G3). Marcas en h = R/2 y h = R.
4. **Kepler.** Una órbita con sectores de igual área pintados, y la rapidez como flecha que crece cerca del Sol (G6). Con la excentricidad real de la Tierra, para mostrar que la órbita se ve casi circular (G7).

### Oscilaciones

**Problema guiado.** Un péndulo de 2,5 m con una esfera de 100 g, soltado desde un ángulo pequeño. g = 10 m/s². Su período es π s, cerca de 3,14 s.

Predicción: *si se cambia la esfera por una de 400 g, con el mismo hilo y el mismo ángulo, ¿cuánto tarda una oscilación?*

| Opción | Error que representa | Respaldo |
| --- | --- | --- |
| a) Más: la pesada va más lenta | O3 | Documentado sin cifra (González y otros) |
| b) Menos: la pesada cae más rápido | O3; D5 de dinámica | Documentado sin cifra (González y otros) |
| c) Lo mismo, π s | Correcta | — |
| d) El doble, como en el resorte (T ∝ √m) | Transferir la fórmula del resorte | Sin respaldo (hipótesis) |

**Explorador.**

1. **Dos péndulos lado a lado** con masas distintas y el mismo L, oscilando en fase (O3). Luego, dos con L y 4L: el segundo tarda el doble, no cuatro veces (hipótesis T ∝ L).
2. **Resorte con amplitud arrastrable.** El cronómetro no cambia aunque el bloque recorra más (O1). Una flecha de velocidad que crece con la amplitud muestra la compensación que describe Ambrose (O2).
3. **Barras de energía** cinética y potencial que suben y bajan. Una marca en x = A/2 muestra que la cinética es 3/4 del total, no la mitad (hipótesis).

### Ondas y sonido

**Problema guiado.** Una cuerda de 2 m, con 100 N de tensión y 0,01 kg/m de densidad lineal, fija en los dos extremos.

Predicción del paso 1, con la cuerda tensa y un pulso que viaja hacia la pared: *¿qué haces para que llegue antes?*

| Opción | Error que representa | Respaldo |
| --- | --- | --- |
| a) Mover la mano más rápido | ON1, ON2 | 34 % en México; cerca del 90 % antes de instrucción en Maryland |
| b) Mover la mano más alto (pulso más grande) | ON1, ON3 | Documentado en entrevistas; sin cifra |
| c) Tensar más la cuerda | Correcta | — |
| d) Usar una cuerda más pesada con la misma tensión | ON4 | 11 % en México |

**Segunda predicción (sonido, sin respaldo).** Un parlante da 80 dB. *Si se prende otro igual al lado, ¿cuántos decibeles marca el medidor?* Opciones: 160 dB (sumar decibeles), 83 dB (correcta), 80 dB ("el nivel no cambia porque los parlantes son iguales") y 90 dB (confundir el doble con diez veces). Las cuatro son hipótesis; solo la primera aparece en los guiones de Milner-Bolotin y Zazkis.

**Explorador.**

1. **Dos rapideces en dos colores.** Un punto de la cuerda sube y baja (color de la mano); la cresta avanza (color del medio). Se arrastra la frecuencia de la mano: el punto sube y baja más rápido y λ se acorta, pero la cresta llega al mismo tiempo (ON1, ON2).
2. **Pulsos que se cruzan,** con la suma punto por punto dibujada mientras se superponen y los pulsos intactos al salir (ON7).
3. **Armónicos.** Se arrastra la frecuencia del vibrador hasta que aparece cada modo; la escena cuenta vientres, no nodos, y escribe f_n = n·v/(2L). Luego se arrastra la tensión y se ve que λ crece (ON8).
4. **Partícula de polvo frente al parlante.** Oscila de ida y vuelta sin irse (ON5). Una campana de vacío donde el parlante sigue vibrando pero el medidor marca cero (ON6).
5. **Medidor de decibeles** con dos parlantes y una regla logarítmica: cada vez que la intensidad se multiplica por 10, el nivel sube 10 dB.

### Casos de prueba propuestos

Verificados con fracciones exactas en Python (`fractions.Fraction`). Van al `casos.json` de cada plantilla cuando se construya. Unidades SI, g = 10 m/s². π queda simbólico, salvo donde se indica. Para los logaritmos se usa log 2 ≈ 0,3, el valor que suelen dar los problemas de examen (confirmar con los manuales de `fuentes/`); el valor exacto va entre paréntesis.

| Plantilla | Caso | Entrada | Salida esperada |
| --- | --- | --- | --- |
| Choques | Plástico | m₁ = 2, v₁ = 6; m₂ = 1 en reposo | v = 4; energía cinética de 36 a 24 (se pierde 1/3) |
| Choques | Elástico | m₁ = 1, v₁ = 6; m₂ = 2 en reposo | v₁' = −2 (rebota), v₂' = 4; p = 6 y energía = 18 antes y después |
| Choques | Impulso con rebote | m = 1/2, de +10 a −6, Δt = 1/50 | Δp = −8; F media = 400 (el error M2 da Δp = 2 y F = 100) |
| Choques | Goma contra plastilina | m = 1/2, llega a 10, Δt = 1/50 | Goma (rebota a 10): F = 500; plastilina: F = 250 |
| Choques | Centro de masa | 2 kg en x = 0; 3 kg en x = 5 | x_cm = 3 (no 2,5) |
| Gravitación | g a la altura h = R | g₀ = 10 | g = 5/2 (el error lineal da 5) |
| Gravitación | g a la altura h = R/2 | g₀ = 10 | g = 40/9 ≈ 4,44 |
| Gravitación | Estación espacial | R = 6400 km, h = 400 km | g/g₀ = 256/289 ≈ 0,886; g ≈ 8,86 |
| Gravitación | Tercera ley de Kepler | a = 4 UA | T² = 64, T = 8 años |
| MAS | Péndulo | L = 5/2 | T = 2π·√(1/4) = π s; igual con cualquier masa |
| MAS | Péndulo con π² ≈ 10 | L = 1 | T = 2 s (convención de examen; confirmar en `fuentes/`) |
| MAS | Resorte | m = 2/5, k = 40, A = 1/10 | ω = 10 rad/s, T = π/5 s; E = 1/5; v máx = 1; en x = A/2, energía cinética = 3/20 (3/4 de E) |
| MAS | Resorte con 4m | m = 8/5, k = 40 | T se duplica: 2π/5 s |
| Ondas | Rapidez en cuerda | T = 100, μ = 1/100 | v = 100 |
| Ondas | Estacionaria, extremos fijos | L = 2, v = 100 | f₁ = 25, f₃ = 75, λ₃ = 4/3 |
| Ondas | Tensión × 4 | T = 400, μ = 1/100 | v = 200; todas las frecuencias se duplican |
| Ondas | Función de onda | y = 0,05·sen(4πx − 200πt) | λ = 1/2, f = 100, v = 50, hacia +x |
| Sonido | Nivel | I = 10⁻⁴, I₀ = 10⁻¹² | β = 80 dB |
| Sonido | Intensidad doble | I = 2·10⁻⁴ | β = 83 dB con log 2 = 0,3 (exacto: 83,01) |
| Sonido | Intensidad × 10 | I = 10⁻³ | β = 90 dB |
| Sonido | Doble de distancia, fuente puntual | de 80 dB a r y luego a 2r | β = 74 dB con log 2 = 0,3 (exacto: 73,98) |

## Huecos y siguientes pasos

- **Oscilaciones es el tema más débil.** No hay un test validado con porcentajes por opción para el MAS de nivel escolar. Encontré la referencia de un test de cuatro niveles de Indonesia (*Jurnal Ilmiah Pendidikan Fisika Al-Biruni*, 2020) con cifras sobre el período del péndulo, pero no pude abrirlo. Es el primero que hay que conseguir.
- **Leí resúmenes, no los originales,** de Maurines (1992) sobre pulsos, Linder (1993) sobre el sonido y Pride, Vokos y McDermott (1998) sobre los teoremas de trabajo-energía e impulso-cantidad de movimiento. Sus resultados solo aparecen aquí a través de Wittmann, de Hrepic y otros, y de Barniol y Zavala. Tampoco abrí los estudios de Bar y colaboradores sobre "la gravedad necesita aire"; los cita Gürel y Acar.
- **No pude abrir** el artículo de Bravo, Pesa y Caballero (2009) en *Enseñanza de las Ciencias* (falló el certificado del sitio), ni la revisión sobre el modelo de sonido de la misma revista (servidor caído). Tampoco abrí la versión de 2016 del MWCS de Barniol y Zavala en *Physical Review* ni su versión en español de 2019 en la *Revista Brasileira de Ensino de Física*. Esa versión en español sería la base natural para las predicciones de ondas.
- **Una cifra muy citada no la verifiqué.** Stead y Osborne (1980) reportan, según una ficha del Instituto de Física británico, porcentajes altos de escolares de 13 y 14 años que dicen que en el espacio no hay gravedad. El sitio bloqueó el acceso y no la uso.
- **Los decibeles no tienen ningún estudio con alumnos.** Es el error de examen más predecible del bloque y el menos medido. Vale ponerlo primero en la prueba del pase 2.
- **Qué sigue.** El MWCS en español (Barniol y Zavala) se puede usar casi tal cual como prueba diagnóstica con postulantes peruanos, con permiso de los autores. Daría el primer dato peruano de ondas.

## Fuentes

- [Singh y Rosengrant (2003), *Multiple-choice test of energy and momentum concepts*, American Journal of Physics 71(6), 607–619](https://arxiv.org/abs/1602.06497). Preprint de arXiv leído completo, con la tabla II de porcentajes por opción. Fuente de M1, M3 a M7.
- [Saifullah, Sutopo y Wisodo (2017), *Senior high school students' difficulties in solving impulse and momentum problems*, Jurnal Pendidikan IPA Indonesia 6(1), 1–10](https://journal.unnes.ac.id/nju/jpii/article/view/9593). Leído completo. 175 escolares de Malang. Fuente de M2, M8 y M9; cita a Graham y Berry (1996) y a Bryce y MacMillan (2009), que no leí.
- [Williamson, Willoughby y Prather (2013), *Development of the Newtonian Gravity Concept Inventory*, Astronomy Education Review 12(1), 010107](https://istardb.org/wp-content/uploads/tainacan-items/1018/17957/Williamson-et-al_2013_Development-of-the-Newtonian-Gravity-Concept-Inventory-1.pdf). Leído completo. Trae también los datos de pregunta abierta de Williamson y Willoughby (2012), que no leí directamente.
- [Yu, Sahami y Denn (2010), *Student ideas about Kepler's laws and planetary orbital motions*, Astronomy Education Review 9, 010108](https://istardb.org/wp-content/uploads/tainacan-items/1018/18684/Yu-et-al_2010_Student-Ideas-about-Keplers-Laws-and-Planetary-Orbital-Motions-1.pdf). Leído completo. 112 entrevistas.
- [Gürel y Acar (2003), *Research into students' views about basic physics principles in a weightless environment*, Astronomy Education Review 2(1), 65–81](https://istardb.org/wp-content/uploads/tainacan-items/1018/20217/Gurel_Acar_2003_Research-into-Students-Views-About-Basic-Physics-Principles-in-a-Weightless-1-1.pdf). Leído completo. 135 estudiantes de Turquía.
- [Rajpaul, Allie y Blyth (2014), *The introductory astronomy course at the University of Cape Town: probing student perspectives*](https://arxiv.org/abs/1409.2363). Leída la sección de gravitación.
- [Ambrose (2006), *Probing student reasoning and intuitions in intermediate mechanics: An example with linear oscillations*, PERC Proceedings](https://faculty.gvsu.edu/AMBROSEB/research/IMT-Dissem_files/Ambrose_2006_PERC_SHM_H2D_DHM.pdf). Leído completo.
- [González, Mellado y Ruiz (2005), *Las ideas alternativas sobre el periodo de oscilación del péndulo simple*, Enseñanza de las Ciencias, número extra (VII Congreso)](https://ddd.uab.cat/pub/edlc/edlc_a2005nEXTRA/edlc_a2005nEXTRAp177idealt.pdf). Leído completo (cinco páginas, estudio de casos).
- [Wittmann, Steinberg y Redish (1999), *Making sense of how students make sense of mechanical waves*, The Physics Teacher 37(1), 15–21](https://arxiv.org/abs/physics/0207092). Leído completo.
- [Wittmann (2002), *The object coordination class applied to wavepulses*, International Journal of Science Education 24(1), 97–118](https://arxiv.org/abs/physics/0207042). Leídas las secciones de propagación y de función de onda.
- [Wittmann, Steinberg y Redish (2003), *Understanding and affecting student reasoning about sound waves*, International Journal of Science Education 25(8), 991–1013](https://arxiv.org/abs/physics/0207031). Preprint leído; tablas 1 a 3.
- [Hrepic, Zollman y Rebello (2010), *Identifying students' mental models of sound propagation*, Physical Review Special Topics – Physics Education Research 6, 020114](https://perg.phys.ksu.edu/papers/2010/hrepic-prst-per.pdf). Leído completo. Cita a Linder (1993) y a Maurines (1992).
- [Barniol y Zavala (2017), *The Mechanical Waves Conceptual Survey: An analysis of university students' performance, and recommendations for instruction*, EURASIA Journal of Mathematics, Science and Technology Education 13(3), 929–952](https://www.ejmste.com/article/the-mechanical-waves-conceptual-survey-an-analysis-of-university-students-performance-and-4698). Leído completo. 541 estudiantes de México; cita a Tongchai y otros (2009, 2011), que no leí.
- [Tongchai, Arayathanitkul y Soankwan (2012), *The persistence of students' alternative conceptions in wave propagation*](https://openjournals.library.sydney.edu.au/IISME/article/view/6371). Solo el resumen.
- [Milner-Bolotin y Zazkis (2021), *A study of future physics teachers' knowledge for teaching: A case of a decibel sound level scale*, LUMAT 9(1), 336–365](https://journals.helsinki.fi/lumat/article/view/1519). Leídas las secciones de antecedentes y de método.
- Pride, Vokos y McDermott (1998), *The challenge of matching learning assessments to teaching goals: An example from the work-energy and impulse-momentum theorems*, American Journal of Physics 66(2), 147–157. Solo la ficha y el resumen.
- Maurines (1992), *Spontaneous reasoning on the propagation of visible mechanical signals*, International Journal of Science Education 14(3). Solo la referencia y citas secundarias.
- Linder (1993), *University physics students' conceptualizations of factors affecting the speed of sound propagation*, International Journal of Science Education 15(6). Solo la referencia y citas secundarias.
- Bravo, Pesa y Caballero (2009), Enseñanza de las Ciencias 27(3), 405–420, sobre la propagación de ondas. No se pudo abrir.
