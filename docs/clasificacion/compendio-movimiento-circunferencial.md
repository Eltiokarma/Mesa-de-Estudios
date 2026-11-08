# Compendio de movimiento circunferencial: qué tipos de problema trae y qué les falta a las escenas

8 de noviembre de 2026 · Clasificación de un compendio de academia, comparada con la pestaña «Ruedas» de `plantillas/tiro-parabolico/` y con `cinta-radio`, `dinamica`, `regla-de-tres` y `relojes-calendarios`

> **El libro sirve solo como mapa** (regla 5 de `CLAUDE.md`): dice qué tipos de problema salen, cuántos hay y dónde están las trampas. No se copia nada al producto: ni enunciados, ni números, ni figuras, ni textos. Todo lo de abajo describe **tipos** en abstracto y con palabras nuestras. El PDF (`fuentes/libros/cuzcano-movimiento-circunferencial-1-90.pdf`) **no se versiona**: `.gitignore` excluye `fuentes/**/*.pdf`.

**Fuente:** Tarazona, *Movimiento circunferencial. Teoría y práctica*, Editorial Cuzcano. Primera edición de 2006, con reimpresiones en 2008, 2011 y 2013 y una segunda edición «aumentada y corregida» de 2015. Es el tomo 6 de la colección de física del mismo autor (el de vectores es el tomo 2). La portada dice «Incluye problemas Cepre UNI».

**Qué se vio.** Las 90 primeras páginas del PDF, que llegan hasta la página 91 del libro. El índice dice que el libro sigue con las relaciones y gráficas de θ, ω, S y v contra el tiempo (página 91), el centro instantáneo de rotación (104), una miscelánea (108 a 167), los enunciados de los propuestos (168) y las claves (179). **Falta, entonces, más de la mitad del libro**: las gráficas, el centro instantáneo, la miscelánea y todos los propuestos.

La portadilla anuncia 260 problemas resueltos y propuestos; el prólogo, 220 resueltos y 60 propuestos (las dos cifras no cuadran). Según el prólogo, los problemas son «tipo examen de admisión UNI», tomados como referencia de exámenes y seminarios del CEPRE-UNI y de exámenes de admisión, ordenados por tema y por dificultad, y resueltos muchas veces con vectores unitarios «por el nuevo plan de estudios de la UNI». La teoría (seis páginas) cubre desplazamiento angular y lineal, periodo y frecuencia, velocidad angular y tangencial, aceleración angular, tangencial, centrípeta y total, MCU, MCUV (con la tabla de ecuaciones análogas al MRUV), las tres formas de transmisión (mismo eje, contacto, faja) y la rotación instantánea de un cuerpo rígido.

- **120 resueltos** (del 1 al 120) y el enunciado del 121, cuya resolución cae fuera. **Ningún propuesto** en estas páginas. Quedan unos 100 resueltos y los 60 propuestos en la parte que falta.
- **1 resuelto se repite** tal cual más adelante (el de la velocidad que forma un ángulo notable con la aceleración, para hallar el radio). Quedan 119 distintos.
- **Origen.** 101 de los 120 resueltos (84 %) llevan la marca «Sem. CEPRE-UNI»; tres dicen el ciclo, de fines de los 90 y del 2000. Otro dice «Examen CEPRE-UNI». **7 dicen «Examen UNI»**, sin año. 11 no dicen de dónde vienen. La proporción CEPRE es casi el doble que en el libro de vectores.
- **Notables.** Unos 19 de los 120 (16 %) dependen de un triángulo notable: 11 del de 37°/53° (descomponer la aceleración total en tangencial y centrípeta, o la velocidad en componentes) y 8 del de 30°/60° o 45°. Bastante menos que en vectores: aquí manda π.
- **Errores del propio libro.** Hay al menos cinco: una velocidad con unidades de aceleración; una clave que no coincide con los valores que la resolución calcula; unas alternativas con una errata que deja la clave lejos del resultado; un dato de la figura que contradice el enunciado; y, **lo más serio, una proposición que da por verdadero que el MCU «tiene aceleración constante»**. La aceleración del MCU tiene módulo constante, pero cambia de dirección en cada instante. Ese error no se debe heredar (ver C12 y la sección 3).

## Resumen en cinco líneas

1. **El MCUV pesa casi la mitad del libro.** La aceleración total con sus componentes (C9: 30 de 120) y el MCUV resuelto «como su análogo lineal» (C8: 27) suman 57 de 120. La pestaña «Ruedas» tiene un solo experimento de MCUV (el frenado con la gráfica f-t).
2. Hay un **invariante que el libro usa sin decirlo**: si un cuerpo parte del reposo con α constante, la razón entre la aceleración centrípeta y la tangencial es 2θ, sin importar el radio ni α. Resuelve de una vez cinco o seis problemas de C9 (cuándo son iguales, cuándo una es el doble, el ángulo entre a y v), y es una predicción perfecta: «¿depende del radio?».
3. **Forma vectorial** (C6: 9) y **MCU combinado con otro movimiento** (C5: 7: la bala que atraviesa discos, la plataforma con un cañón, la cuerda que se rompe) no tienen escena. Tampoco el **centro instantáneo de rotación** (C7), que el libro trata aparte en la parte que falta.
4. Las trampas más repetidas son de **unidades** (rpm, vueltas, km/h, diámetro por radio: en unos 25 problemas), **qué se conserva en la transmisión** (ω o v), **el dato que sobra** en el MCUV (la aceleración tangencial no cambia, así que el tiempo que dan no sirve) y **aT y acp cambiadas** en la tangente del ángulo.
5. Conviene una **escena propia de movimiento circular** («el disco y sus flechas») en la misma unidad del catálogo, con un motor que reúna lo circular que ya existe. Casi todo C1, C2, C3, C8 y C9 se presta a **generador** con el núcleo actual; C6 (respuestas vectoriales) y C12 (verdadero o falso) piden alternativas de texto.

---

## 1. Los tipos

Los códigos C1 a C12 son nuestros. Las columnas siguen las secciones del libro: los «problemas de aplicación» (1 a 11), los resueltos de MCU (12 a 54) y los de MCUV (55 a 120). «CEPRE» cuenta los que llevan la marca de seminario o examen del CEPRE-UNI; «UNI», los de «Examen UNI».

| Tipo | Qué se pide (en abstracto) | Aplic. 1–11 | MCU 12–54 | MCUV 55–120 | **Total** | CEPRE | UNI |
| --- | --- | --- | --- | --- | --- | --- | --- |
| **C9** | **Aceleración total y sus componentes**: aT y acp en un instante, el módulo de a, el radio a partir del ángulo entre a y v, el instante o el ángulo girado en que aT y acp cumplen una razón dada (iguales, una el doble de la otra), el ángulo de a con el radio o con la velocidad, a dada como vector y descompuesta según la posición, el cambio de acp entre dos instantes; también un caso en el círculo vertical con la gravedad como aceleración tangencial | 2 | 0 | 28 | **30** | 28 | 0 |
| **C8** | **MCUV con las ecuaciones del MRUV** («el análogo lineal»): con tres de ω0, ωf, α, t y θ, hallar los otros; frenados desde rpm hasta detenerse; tramos (acelera, sigue constante y frena); el tiempo de la primera vuelta conociendo el de la segunda; razones entre ángulos girados en intervalos consecutivos; datos en km/h para las ruedas de un auto; un caso en que ω0 sale negativa y la partícula invierte el sentido | 2 | 0 | 25 | **27** | 22 | 3 |
| **C1** | **Ecuación básica del MCU y conversiones**: rpm, periodo, frecuencia, ω y v; número de vueltas; acp a partir de vueltas por minuto o del periodo; la velocidad máxima en una curva; la Tierra que gira (el avión que «para» el Sol); ángulo de visión de un satélite; las agujas del reloj; un hilo que se enrolla en una varilla y acorta el radio | 3 | 10 | 1 | **14** | 10 | 2 |
| **C3** | **Transmisión**: fajas abiertas y cruzadas, discos en contacto en cadena (también n discos), poleas escalonadas que suben o bajan bloques colgados, una faja con su largo y el tiempo de una vuelta de un punto de la faja, cuerdas que se enrollan en dos poleas, y engranajes con α constante | 1 | 7 | 1 | **9** | 7 | 1 |
| **C6** | **Forma vectorial**: el vector velocidad en otro punto de la trayectoria, el vector desplazamiento, la velocidad media y la aceleración media como vectores, el periodo a partir de \|Δv\|, la posición (x; y) en un instante, la aceleración angular media cuando el eje de giro cambia de dirección, y α y θ a partir de la velocidad dada como vector | 0 | 8 | 1 | **9** | 9 | 0 |
| **C4** | **Encuentros y desfases en MCU**: dos móviles en sentidos iguales u opuestos (dados con ω o con ±k); la separación angular mínima, el primer alcance, el reencuentro en el punto de partida y las vueltas de cada uno; el ángulo entre las agujas del reloj; un planeta con su satélite | 0 | 8 | 0 | **8** | 8 | 0 |
| **C2** | **Puntos de un mismo cuerpo rígido**: misma ω y v proporcional a la distancia al eje; dos puntos de un disco con la diferencia de sus radios; puntos de un cono a distintas alturas; puntos de la Tierra según la latitud (velocidad y acp, con r = R cos λ) | 1 | 5 | 1 | **7** | 6 | 0 |
| **C5** | **MCU con otro movimiento**: la bala que atraviesa dos discos de un mismo eje o un cascarón esférico (ω mínima para un solo agujero), el proyectil lanzado desde una plataforma que gira, la bola que baja por una rampa mientras otra gira, y la cuerda que se rompe (la recta tangente como ecuación, o un MRUV después) | 0 | 4 | 3 | **7** | 6 | 1 |
| **C10** | **Dos partículas en MCUV**: la que da una vuelta más que la otra (en radios distintos), el atraso angular para hallar la razón de α, la separación angular que vuelve y el primer encuentro con α dadas como vectores | 0 | 0 | 4 | **4** | 4 | 0 |
| **C7** | **Centro instantáneo de rotación**: la piedra en la llanta que sale desde lo más alto, y la rueda que baja rodando por un plano (velocidad de otro punto del borde). El libro tiene una sección aparte en la parte que falta | 1 | 1 | 0 | **2** | 0 | 0 |
| **C12** | **Proposiciones verdadero o falso**: si el MCU tiene aceleración constante, hacia dónde apunta la aceleración en una curva, qué trayectorias permite una aceleración constante, y qué cambia vuelta a vuelta en el MCUV | 0 | 0 | 2 | **2** | 2 | 0 |
| **C11** | **Gráfica ω-t**: el ángulo girado como área bajo la recta. El libro tiene una sección aparte en la parte que falta | 1 | 0 | 0 | **1** | 0 | 0 |
| | **Total** | **11** | **43** | **66** | **120** | **102** | **7** |

### Método que enseña el libro, tipo por tipo

- **C8 y parte de C9: «el análogo lineal».** Es el método central del libro y lo repite en casi cada resuelto de MCUV. El giro se «desenrolla» y se dibuja como un tramo recto, con ω0 a la izquierda, ωf a la derecha y el ángulo (o el arco) como la longitud del tramo. Luego se usan las cuatro ecuaciones del MRUV con ω, α y θ, eligiendo la que no tiene la incógnita que no se pide. Con varios tramos, se dibujan seguidos y se escriben dos ecuaciones (una por tramo) que se dividen para cancelar α. El libro deja anotado que el dibujo «supuesto» puede no coincidir con el resultado, y lo muestra en un caso donde ω0 sale negativa: la partícula primero gira al revés, se detiene y vuelve.
- **Unidades de vueltas.** En los frenados con rpm, el libro trabaja todo en vueltas y minutos (incluso α en vueltas por minuto al cuadrado) y convierte al final. Es el mismo camino que el motor de la escena (`mcuvDatos` con `alfaV` en vueltas/s²).
- **C9: el triángulo de aceleraciones.** aT va sobre la velocidad y acp hacia el centro, y forman un triángulo rectángulo con a. Si el ángulo es notable, se escribe a = 5k, aT = 3k, acp = 4k (o al revés) y se despeja k con acp = v²/R. Si se da una razón entre aT y acp, se escribe α·R / (ω²·R) y el radio se cancela, y luego se usa ω² = 2αθ desde el reposo. **Así sale el invariante acp/aT = 2θ**, que el libro no enuncia pero usa en al menos cinco problemas.
- **C3: qué se conserva.** Las tres figuras de la teoría (mismo eje: misma ω; contacto o faja: misma v; y en MCUV, la misma aT en el contacto). En cadenas de poleas se van marcando puntos numerados y se pasa de «misma v» a «misma ω» según la unión. Los bloques colgados van a la velocidad de la garganta de donde cuelgan.
- **C2: misma ω.** Se escribe v1/r1 = v2/r2. En el cono, el radio de cada punto sale por semejanza de triángulos; en la Tierra, r = R cos λ.
- **C4 y C10: θ = ωt para cada móvil, y una ecuación de la figura.** Se dibujan las posiciones, y la suma o resta de los ángulos barridos se iguala a lo que dice el enunciado (2π para encontrarse en sentidos opuestos, la separación inicial más una vuelta, etc.). Para el reencuentro en el punto de partida, el libro cuenta cuánto se atrasa el lento por cada vuelta del rápido. En MCUV es lo mismo con θ = ½αt².
- **C5: tiempos iguales.** El tiempo del otro movimiento (la bala entre los discos, el vuelo del proyectil, el MRUV por la rampa) se iguala al tiempo que tarda el disco en girar lo que hace falta. Para la ω mínima, «lo que hace falta» es **media vuelta**, no una vuelta.
- **C6: vectores con la figura.** El vector velocidad es tangente y su sentido sale del sentido de giro; Δv se obtiene con el triángulo (o el rombo) de las dos velocidades; el desplazamiento es la cuerda, no el arco; la velocidad media y la aceleración media se dividen entre Δt. Para la aceleración angular media con ejes distintos, se usa la ley de cosenos con los dos vectores ω.
- **C7: la rueda gira alrededor del punto de apoyo.** Cada punto va a ω por su distancia al punto de contacto: lo más alto, al doble del centro; un punto lateral, al centro por √2.
- **C12: un caso por proposición**, con contraejemplos (la caída libre como movimiento rectilíneo en dos sentidos con aceleración constante).

### Trampas que se deducen de las alternativas y de las resoluciones

| Trampa | Dónde aparece | Cómo se ve en las alternativas |
| --- | --- | --- |
| **rpm sin 2π o sin 60** | C1, C8, C3 | Están la correcta y la mitad o el doble (2π contra π), o un valor 60 veces mayor. |
| **Radianes como vueltas** | C1, C8 | El ángulo en radianes aparece como si fuera el número de vueltas, y al revés. |
| **Diámetro por radio** | C1, C8, C9 | El enunciado da el diámetro (de la rueda, del círculo, del tambor) y las alternativas incluyen el resultado con el diámetro. Sale en al menos cinco problemas. |
| **km/h sin convertir** | C1, C8, C9 | Ruedas de autos y trenes con velocidades en km/h y radios en cm. |
| **Misma v en el mismo cuerpo** | C2 | Puntos a distinta distancia del eje se toman con la misma velocidad; o el ángulo barrido se cree distinto para cada punto. |
| **Latitud mal llevada** | C2 | Se usa el radio de la Tierra en vez de R cos λ, o cos(λ/2), o el doble. |
| **Qué se conserva en la transmisión** | C3 | Misma ω en una faja o misma v en un eje; proporción directa en vez de inversa; el radio al cuadrado. En la cadena de n discos, ω/n contra nω. |
| **Sumar o restar las ω** | C4, C10 | En sentidos opuestos las ω se suman; en el mismo sentido, se restan. Las alternativas traen el tiempo con la operación cambiada. |
| **Primer encuentro contra reencuentro en la salida** | C4 | El primer alcance (una vuelta de ventaja) se confunde con volver a coincidir en el punto de partida (mínimo común múltiplo de los periodos). |
| **La separación «por el otro lado»** | C4, C10 | Cuando se pide una separación angular, hay dos instantes (antes y después de cruzarse). La clave es el primero. |
| **Vuelta entera en vez de media vuelta** | C5 | La ω mínima para un solo agujero, o para que el proyectil vuelva al cañón, se calcula con una vuelta y sale el doble. |
| **Arco por cuerda, y sin dividir entre Δt** | C6 | El desplazamiento es la cuerda; la velocidad media aparece sin dividir entre el tiempo, y el vector con el signo cambiado. |
| **Rapidez constante, Δv = 0** | C6, C12 | En MCU, el cambio de velocidad entre dos puntos no es cero aunque la rapidez no cambie. |
| **Restar módulos de ω** | C6 | Si el eje de giro cambia de dirección, la aceleración angular media no es la diferencia de los módulos sobre el tiempo. |
| **El punto de arriba va como el centro** | C7 | La piedra que sale de lo más alto de la llanta va al doble de la velocidad del auto; aparecen la del auto y el triple. |
| **Δt contra t** | C8 | Datos dados entre dos instantes que no empiezan en cero; el distractor divide entre el instante final. |
| **El dato que sobra** | C8, C9 | Se da un ángulo o un tiempo que no se usa, porque aT es constante en el MCUV. El distractor lo usa. |
| **Seguir la ecuación después de detenerse** | C8 | En un frenado, las ecuaciones dan que la rueda retrocede. El libro, en un caso, lo interpreta como un cambio de sentido real. |
| **aT y acp cambiadas** | C9 | La tangente del ángulo de a con el radio aparece invertida, y en las alternativas de aT y acp los valores se cruzan. |
| **Sumar aT y acp sin Pitágoras**, o acp con la ω inicial | C9 | Aparecen la suma de las dos componentes y la centrípeta del comienzo. |
| **Seno y coseno cambiados con el notable** | C9 | Con a formando 37° con la tangente, la tangencial y la centrípeta se intercambian. |
| **El cociente depende del radio** | C9, C10 | Partiendo del reposo, el ángulo en que acp/aT toma un valor no depende de R ni de α; en dos radios distintos con la misma α, se gira el mismo ángulo. El distractor mete el radio. |
| **«MCU: aceleración cero»** y **«MCU: aceleración constante»** | C12 | La primera es error clásico; la segunda la comete el propio libro, que da por verdadero que el MCU tiene aceleración constante. |

### Convenciones de academia

- **π se deja indicado**: casi todas las respuestas van en función de π (un múltiplo de π en rad/s, una fracción de π² en m/s²). Solo en dos problemas se aproxima: π ≈ 3,14 en uno y π² ≈ 10 en otro.
- **g** vale 10 m/s² en los problemas con proyectiles y 9,8 m/s² en dos casos (rampa y centrifugadora).
- **Unidades mezcladas**: rpm (en unos 15 problemas), vueltas por minuto, rad/min, revoluciones, km/h (en 5), cm. Vueltas, revoluciones, ciclos y oscilaciones son sinónimos («1 Hz = 1 oscilación por segundo»).
- **Respuestas dobles**: cerca de 18 problemas piden dos cosas a la vez (periodo y ω, α y tiempo, aT y acp), con cinco pares de alternativas que combinan bien y mal.
- **Respuestas que no son un número**: vectores con î, ĵ, k̂ (unos 5), la ecuación de una recta (1), una hora en horas, minutos y segundos (1), expresiones literales (unas 6), raíces (√2, raíz cuarta) y arcotangentes.
- **Decimales de calculadora** en unos 6 problemas (el número de vueltas con dos decimales, el largo de una faja con ángulos no notables, la centrifugadora). Son excepción y no conviene imitarlos.
- **Signo ± en las ecuaciones** («+ si acelera, − si desacelera») en vez de α con signo.
- **«Velocidad»** se usa a veces por «rapidez» y «aceleración normal» por centrípeta. Cinco alternativas (A a E), con «Clave: X», y a veces «N.A.» o «F.D.» (faltan datos) como distractor.
- La forma vectorial aparece con **ω y α como vectores ±k̂** para decir el sentido de giro (la mano derecha), sin explicarlo más.

---

## 2. Comparación con lo que ya existe

**La pestaña «Ruedas» de `plantillas/tiro-parabolico/` (0.2.0)** tiene seis experimentos con predicción: la rotonda (el MCU tiene aceleración hacia el centro), la honda (al romperse la cuerda sigue la tangente), la cadena (misma v, ω inversa al radio), la rueda de atrás (mismo eje, v proporcional al radio), el frenado con la gráfica f-t (vueltas como área) y la pista (alcance con una vuelta de ventaja). El paso a paso es solo de tiro. El `papel.json` trae tres problemas circulares (faja, rueda con T, ω, v y acp, y la pista en los dos sentidos) y un frenado.

El motor (`MotorTiro`) ya tiene mucho: `mcu`, `mcuv` (con `frena` y la rueda que «retrocede»), `mcuvDatos` (tres de cinco datos, con rpm y vueltas), `transmision` y `tren` (faja, cruzada, engranaje y eje, con el sentido), `encuentroPista` (lineal o angular, mismo sentido o contrario, n-ésimo encuentro) y `soltarDelCirculo`. Sus `errores` ya cubren rpm sin 2π, rectángulos en vez de área, misma ω con faja, proporción directa, radio al cuadrado, suma en el alcance, acp con ω0 y aT + acp sin Pitágoras.

**Otras escenas:**
- `plantillas/cinta-radio/`: radián con cintas, arco, sector, vueltas de una rueda que rueda (`vueltas`, `rodar`), la moneda que rueda alrededor de otra (`alrededor`), faja y bicicleta en vueltas, y el largo de los tramos rectos de una faja (`tangentesExternas`, `tangentesInternas`).
- `plantillas/dinamica/`: el columpio y la loma (fuerza neta hacia el centro, `centripeta`, `vertical`, `loma`, `curva`).
- `plantillas/regla-de-tres/`: engranajes en fila con dientes y vueltas (`engranajes`).
- `plantillas/relojes-calendarios/`: el ángulo entre las agujas y sus superposiciones, que es el C4 del reloj.

| Tipo | Total | Cobertura | Qué hay / qué falta |
| --- | --- | --- | --- |
| C9 aceleración total | 30 | **A medias, muy poco** | La rotonda (acp hacia el centro) y la leyenda de aT y a en el frenado; el motor da aT, acp, a y `aSuma`. Falta todo lo que pregunta el libro: el triángulo aT-acp-a con un notable, el radio a partir del ángulo entre a y v, la razón acp/aT (el invariante 2θ), el ángulo con el radio y a como vector. |
| C8 MCUV análogo lineal | 27 | **A medias** | El frenado con la gráfica f-t y `mcuvDatos`. Faltan los tramos (acelera, constante, frena), los intervalos que no empiezan en t = 0, las razones entre ángulos de intervalos seguidos, el tiempo de la primera vuelta conociendo la segunda, las ruedas de un auto en km/h y la inversión de sentido como paso con predicción. |
| C1 ecuación básica y conversiones | 14 | **A medias** | La rotonda (v y acp), el papel (T, ω, v, acp) y las vueltas de `cinta-radio`. Ningún paso pide convertir rpm con su trampa; faltan la Tierra que gira, el hilo que se enrolla y la curva con acp máxima. |
| C3 transmisión | 9 | **Sí, en buena parte** | Cadena, eje, faja y bicicleta (tres escenas). Faltan las poleas escalonadas con bloques, los n discos en contacto, el tiempo de vuelta de un punto de la faja y los engranajes con α (aT igual en el contacto). |
| C6 forma vectorial | 9 | **No** | `soltarDelCirculo` da posiciones, pero ningún paso dibuja Δv, el desplazamiento, la velocidad media ni la aceleración media. |
| C4 encuentros en MCU | 8 | **A medias** | La pista (alcance, mismo sentido, en metros) y `relojes-calendarios` para las agujas. `encuentroPista` ya acepta la versión angular y el sentido contrario, sin paso. Faltan la separación angular dada, el reencuentro en la salida con las vueltas de cada uno y ω como ±k̂. |
| C2 cuerpo rígido | 7 | **A medias** | La rueda de atrás (mismo eje). Faltan dos puntos del mismo disco, el cono y la latitud en la Tierra. |
| C5 MCU con otro movimiento | 7 | **A medias** | La honda (la cuerda se rompe y sigue la tangente). Faltan la bala y los discos, la plataforma con el cañón y la rampa. |
| C10 dos partículas en MCUV | 4 | **No** | `encuentroPista` es solo uniforme. |
| C7 centro instantáneo | 2 | **No** | `cinta-radio` hace rodar la rueda (vueltas y huella), pero no muestra la velocidad de cada punto. |
| C12 proposiciones | 2 | **A medias** | La rotonda responde «¿tiene aceleración?». Falta «su aceleración no es constante: cambia de dirección». |
| C11 gráfica ω-t | 1 | **Sí** | El frenado (área bajo f-t). El libro tiene más gráficas en la parte que falta. |

**Lo que falta, ordenado por frecuencia en el libro.** No cubiertos:
1. C6 (9)
2. C10 (4)
3. C7 (2, y una sección entera en la parte que falta)

A medias:
1. C9 (30)
2. C8 (27)
3. C1 (14)
4. C4 (8)
5. C2 (7)
6. C5 (7)
7. C12 (2)

**Lo que las escenas tienen y el libro no** (en estas páginas): la gráfica f-t como modelo del frenado, la cinta del radián, la moneda que rueda alrededor de otra, la bicicleta completa y las fuerzas del columpio y la loma (esto último es dinámica circular, que en esta colección va en otro tomo).

---

## 3. Contraste con la tabla de errores

`docs/investigacion/cinematica-ideas-erroneas.md` cubre MRUV, caída libre y tiro parabólico; **no tiene códigos de movimiento circular** (la taxonomía lo dice: «sin MCUV»). Lo circular con respaldo está en `dinamica-ideas-erroneas.md` (D9, fuerza centrífuga y «sigue curvándose», Hestenes, Wells y Swackhamer, 1992; McCloskey, Caramazza y Green, 1980) y en el dato de la PUCP: movimiento circular fue de lo peor contestado en la nivelación (Castillo y otros, 2013). Los códigos de la pestaña «Ruedas» son casi todos `hipotesis`. Las trampas de cálculo de este libro **no tienen estudio**: entran como hipótesis.

### Trampas del libro que **coinciden** con códigos que ya existen

| Trampa del libro | Código existente | Respaldo y comentario |
| --- | --- | --- |
| «MCU: aceleración cero» | `rapidez-constante-sin-aceleracion` (escena) | Hipótesis. El libro lo pregunta en C12 y en el Δv de C6. |
| Aceleración hacia adelante | K3 de cinemática (`K3-a-en-direccion-del-movimiento`) | Parcial (Trowbridge y McDermott, 1981). Sale en las proposiciones de C12. |
| Al romperse la cuerda, sigue curvándose o sale hacia afuera | D9 de dinámica (`D9-sigue-curvando`), `sale-hacia-afuera` | D9 parcial (McCloskey y otros, 1980). Coincide con C5. |
| Δt contra t | K4 de cinemática («a = v/t» en vez de Δv/Δt) | Documentado en MRUV; aquí es la versión angular. |
| Área bajo ω-t, no la pendiente ni el eje | G4 de cinemática (`G4-pendiente-en-vez-de-area`, `G4-lee-el-eje`) | Parcial (Beichner, 1994). Coincide con C11 y con el «análogo lineal» de C8. |
| Seguir la ecuación tras detenerse | «En el frenado, seguir usando la ecuación…» (sección «Lo que no tiene respaldo» de cinemática) y `mcuv-sin-frenar` | Hipótesis. El libro muestra un caso en que la inversión es real, porque nada detiene a la partícula: es la otra cara de la misma idea. |
| Misma ω con faja, proporción directa, radio al cuadrado | `omega-igual-con-faja`, `RM5-proporcion-directa`, `radio-al-cuadrado` | RM5 (aritmética) y las de la escena son hipótesis. Coinciden con C3. |
| Misma v en el mismo eje | `v-igual-en-eje`, `inversa-en-eje` | Hipótesis. Coincide con C2 y C3. |
| Sumar o restar mal en el alcance | RM4 de aritmética (`RM4-suma-en-alcance`), `vuelta-del-rapido` | Hipótesis. Coincide con C4 y C10. |
| Radianes como vueltas, vueltas sin 2π | TR5 de trigonometría (parcial), `vueltas-sin-2pi` | Coincide con C1 y C8. |
| Diámetro por radio | `vueltas-con-diametro` (cinta-radio) | Hipótesis. En este libro es de lo más frecuente. |
| Seno y coseno cambiados con el notable | `VE-sen-cos-cambiados` (vectores) y TR9 | Coincide con C9. |
| El ángulo no depende del radio | TR2 y TR6 de trigonometría (`TR2-radian-depende-del-radio`, `TR6-angulo-depende-del-lado`) | Parientes de «en dos radios distintos con la misma α se gira lo mismo» (C10) y de «todos los puntos barren el mismo ángulo» (C2). |
| aT + acp sin Pitágoras, acp con ω0 | `aSuma` y `acConOmega0` en `mcuv` (motor) | Hipótesis, ya en el motor y sin paso que las use. |

### Trampas **nuevas** (irían como `hipotesis`)

| Código propuesto | Error |
| --- | --- |
| `CI-rpm-sin-2pi` | Pasa rpm o vueltas a rad/s sin multiplicar por 2π (o lo hace dos veces). |
| `CI-rpm-sin-60` | Pasa rpm a rad/s sin dividir entre 60. |
| `CI-diametro-por-radio` | Usa el diámetro donde va el radio (generaliza `vueltas-con-diametro`). |
| `CI-kmh-sin-convertir` | Mezcla km/h con m o cm. |
| `CI-latitud-sin-coseno` | En un punto de la Tierra usa R en vez de R cos λ. |
| `CI-cadena-directa` | En n discos en contacto, cree que ω se divide entre n (en vez de multiplicarse). |
| `CI-bloque-radio-equivocado` | En una polea escalonada, toma la velocidad del bloque con el radio de la otra garganta. |
| `CI-primer-encuentro-vs-salida` | Confunde el primer alcance con volver a coincidir en el punto de partida. |
| `CI-separacion-despues` | Da el segundo instante con la separación pedida (después de cruzarse), no el primero. |
| `CI-vuelta-entera` | Para la ω mínima de un solo agujero (o del proyectil que vuelve), usa una vuelta en vez de media. |
| `CI-arco-por-cuerda` | Toma el arco como módulo del desplazamiento. |
| `CI-media-sin-dividir` | Da el desplazamiento o Δv como velocidad media o aceleración media. |
| `CI-delta-v-cero` | Cree que Δv = 0 en el MCU porque la rapidez no cambia (pariente de `rapidez-constante-sin-aceleracion`). |
| `CI-alfa-resta-modulos` | Con el eje de giro que cambia de dirección, resta los módulos de ω. |
| `CI-cir-todos-a-v` | Cree que todos los puntos de una rueda que rueda van a la velocidad del centro (o que lo más alto va al triple). |
| `CI-dato-que-sobra` | Usa un dato que no hace falta (el tiempo para «actualizar» aT, que es constante en el MCUV). |
| `CI-at-crece` | Cree que en el MCUV la aceleración tangencial crece con la rapidez (o que la centrípeta es constante). |
| `CI-at-ac-cambiadas` | Invierte aT/acp en la tangente del ángulo, o intercambia sus valores. |
| `CI-cociente-depende-del-radio` | Cree que el ángulo girado desde el reposo en que acp/aT vale k depende de R o de α (es k/2 rad). |
| `CI-mcu-a-constante` | Cree que la aceleración del MCU es constante porque su módulo lo es. **Lo afirma el propio libro**: conviene un paso que lo desarme. |

---

## 4. Propuestas

### (a) Qué agregar y dónde: una escena propia de movimiento circular

**Opción recomendada: `plantillas/movimiento-circular/`** («el disco y sus flechas»), en la misma unidad del catálogo (`fisica.movimiento-parabolico-y-circular`, cuyo campo `plantillas` ya acepta más de una).

Por qué una escena propia y no más pestañas en tiro parabólico:
1. **El peso.** C8 y C9 son 57 de 120, y con C6 y C10 llegan a 70. Es más de lo que pesa el tiro en cualquier compendio que tengamos. La pestaña «Ruedas» tiene un solo experimento de MCUV.
2. **El tamaño.** `tiro-parabolico/index.html` ya tiene unas 1600 líneas y tres pestañas. Ocho pasos más la vuelven pesada en celular de gama baja.
3. **El motor ya existe.** Las funciones circulares de `MotorTiro` se mudan (o se copian con sus casos) al motor nuevo, y se agregan las de (c). `tiro-parabolico` puede seguir cargando las suyas; más adelante, si se quiere una sola fuente, se pasan a una pieza de `nucleo/`, como `celular.js` o `elementos.js`.
4. **«Ruedas» se queda como está**, como entrada corta (rotonda, honda, cadena, eje, frenado y pista), con un enlace a la escena nueva.

Si Gerson prefiere no abrir una escena, el mínimo útil son dos experimentos más en «Ruedas»: el 3 y el 7 de abajo.

**Paso a paso: «El disco que acelera»** (C8 y C9). Un disco que parte del reposo con α constante y un punto del borde con tres flechas de color fijo: v, aT y acp (y a, a trazos). Las figuras y los números son nuestros.

1. **El problema.** Un disco de radio y α propios, desde el reposo.
2. **«¿Qué flecha cambia?»** Se predice qué pasa con aT y con acp al pasar el tiempo. Correcta: aT no cambia, acp crece. Distractores: las dos crecen (`CI-at-crece`); las dos fijas (`CI-mcu-a-constante` llevado al MCUV); aT crece y acp fija. Después el disco gira y las flechas cambian (o no) a la vista.
3. **«¿Cuándo son iguales?»** Se predice cuánto ha girado el disco cuando acp = aT. Correcta: medio radián. Distractores: depende del radio (`CI-cociente-depende-del-radio`), 45° (confunde el ángulo de a con el girado), una vuelta. Al responder, dos perillas cambian R y α y el disco se detiene siempre en el mismo ángulo. Es el invariante que resuelve C9 de un golpe.
4. **«El análogo lineal».** El arco girado se desenrolla en una pista recta al lado del disco, con ω0 y ωf en sus extremos y la gráfica ω-t debajo. Se predice cuántas vueltas da en un tramo que no empieza en t = 0. Distractores: el rectángulo con ω0 o con ωf, el tiempo final en vez de Δt (K4), radianes como vueltas.
5. **«rpm».** El mismo disco con un contador de vueltas y un reloj. Se predice ω en rad/s. Distractores: sin 2π (`CI-rpm-sin-2pi`), sin 60 (`CI-rpm-sin-60`) y con el diámetro (`CI-diametro-por-radio`).
6. **«El triángulo de aceleraciones».** a forma un ángulo notable con v; se predice el radio o aT. Distractores: seno y coseno cambiados, aT + acp sin Pitágoras, aT/acp invertida (`CI-at-ac-cambiadas`).

**«¿Qué pasa si…?»**

7. **«La flecha que se gira»** (C6 y C12). MCU con la velocidad dibujada en dos puntos. Se predice \|Δv\| para dos posiciones separadas por un ángulo dado. Correcta: la del triángulo de velocidades. Distractores: 0 (`CI-delta-v-cero`), siempre 2v, y la suma de las rapideces. Al responder, las dos flechas se trasladan a un mismo origen y aparece Δv. Variante: la velocidad media con la cuerda contra el arco (`CI-arco-por-cuerda`, `CI-media-sin-dividir`). Remate: la aceleración del MCU apunta siempre al centro, así que **no es constante** (`CI-mcu-a-constante`).
8. **«Dos puntos del mismo disco»** (C2). Dos marcas a distinta distancia del eje; se predice la razón de sus velocidades. Distractor: iguales (`v-igual-en-eje`). Variante con un globo terráqueo y la latitud (`CI-latitud-sin-coseno`).
9. **«La bala y los discos»** (C5). Dos discos en un eje y una bala que los cruza. Se predice la ω mínima para que los agujeros queden en línea, o para que un cascarón tenga un solo agujero. Distractor: una vuelta entera (`CI-vuelta-entera`). Al responder, la escena se ve en cámara lenta.
10. **«La rueda que rueda»** (C7). Una rueda avanza sin resbalar, con las velocidades de lo más alto, el centro, el apoyo y un punto lateral. Se predice la de arriba. Correcta: el doble del centro. Distractores: igual al centro (`CI-cir-todos-a-v`), cero, el triple. Al responder, se ve la rueda girar alrededor del punto de apoyo.
11. **«El reencuentro»** (C4 y C10). Dos móviles en la misma pista, con ω (o con α) distintas. Se predice cuándo vuelven a coincidir en la salida. Distractores: el primer alcance (`CI-primer-encuentro-vs-salida`), la suma de las ω, el periodo del rápido.
12. **«Frena y se da la vuelta»** (C8). Con un mismo dato, una rueda con freno (se queda quieta) y una partícula que nada detiene (vuelve). Se predice cuál de las dos «retrocede». Usa `mcuv` con y sin `frena`.

La escena trae su `papel.json` (de 5 a 10 problemas propios: la escalera de tramos, el triángulo de aceleraciones, la polea escalonada con bloque, el disco y la bala, dos puntos del mismo disco y el reencuentro) y su `casos.json` verificado aparte (regla 2).

### (b) Generadores (formato «predicciones»)

`nucleo/predicciones.js` (`armar`) hoy acepta solo **valores numéricos positivos** y los formatea con coma decimal. Hay dos detalles que este tema agrega a lo que ya pedía el compendio de vectores:
- **π indicado.** El libro responde casi siempre en función de π. O se eligen los datos para que la respuesta salga sin π (por ejemplo, ω con π en el dato y el tiempo como número), o se agrega al núcleo una opción `formato` que reciba una función (como `textoPi` de `cinta-radio`).
- **Respuestas dobles.** Se pregunta por una sola cosa por ejercicio.

| Generador | Tipos | Parámetros | Pregunta | Distractores (código) | ¿Cabe en el núcleo actual? |
| --- | --- | --- | --- | --- | --- |
| **G1 MCU y conversiones** | C1, C2 | Radio o diámetro, rpm, periodo o vueltas en un tiempo; dos radios en el mismo disco; latitud notable | ω, v, acp, vueltas, una razón de velocidades | `CI-rpm-sin-2pi`, `CI-rpm-sin-60`, `CI-diametro-por-radio`, `acSinCuadrado`, `v-igual-en-eje`, `CI-latitud-sin-coseno` | Sí, con la respuesta sin π o con `formato` |
| **G2 transmisión** | C3 | Tren de 2 a 4 ruedas (faja, cruzada, contacto, eje), poleas escalonadas con un bloque | ω o rpm de la última, velocidad del bloque | `omegaIgualConFaja`, `omegaDirecta`, `omegaCuadrado`, `vIgualEnEje`, `vInversa`, `CI-bloque-radio-equivocado` | Sí; el sentido de giro pide texto |
| **G3 MCUV de tres datos** | C8 | Tres de ω0, ωf, α, t y θ (en rpm, rad/s o vueltas), intervalos que empiezan después de t = 0, tramos | t, θ, vueltas o α | rectángulos, pendiente, eje, `vueltasSinDosPi`, K4 (Δt contra t), `CI-rpm-sin-60` | Sí, preguntando por magnitudes |
| **G4 aceleración total** | C9 | Ángulo notable entre a y v, rapidez, radio, α; o una razón acp/aT desde el reposo | R, aT, \|a\|, el ángulo girado, la tangente del ángulo | `aSuma`, `acConOmega0`, `CI-at-ac-cambiadas`, seno y coseno cambiados, `CI-cociente-depende-del-radio` | Sí |
| **G5 encuentros angulares** | C4, C10 | Dos ω (o dos α), sentido, separación inicial, n | t del n-ésimo encuentro, vueltas de uno, t del reencuentro en la salida | `tConSuma`, `tConResta`, `tVueltaDelRapido`, `CI-primer-encuentro-vs-salida`, `CI-separacion-despues` | Sí para t y vueltas |
| **G6 combinados** | C5 | Distancia entre discos, rapidez de la bala, desfase; componente vertical del proyectil | ω mínima o rapidez de la bala | `CI-vuelta-entera`, grados sin pasar a radianes | Sí |

**No caben todavía:** C6 (vectores como respuesta: piden `armarTexto`, lo mismo que G3 a G5 de vectores, o preguntar por un escalar que resuma, como \|Δv\| o una componente), C12 (verdadero o falso: texto), y todo lo que pida un valor negativo o nulo (Δacp al frenar, ω0 negativa). Esas dos extensiones del núcleo, **alternativas de texto y valores con signo**, ya están pedidas por vectores; conviene hacerlas una sola vez.

**G2, G3 y G5 se pueden empezar ya**: el motor tiene `transmision`, `tren`, `mcuvDatos` y `encuentroPista` con sus `errores`. G1, G4 y G6 necesitan funciones nuevas de (c). Cada generador lleva su `generador.test.js`, que verifica para muchas semillas que haya 4 o 5 alternativas distintas y que la correcta coincida con un cálculo independiente, como en `plantillas/porcentajes-sucesivos/`.

### (c) Funciones de motor que harían falta

Todas sin DOM y con su campo `errores`, en el motor de la escena nueva (o en `MotorTiro` si se elige la opción mínima):
- `convertir({ rpm | f | omega | periodo })`: exporta lo que hoy hace la función privada `angular`, con los errores `CI-rpm-sin-2pi` y `CI-rpm-sin-60`.
- `aceleracionTotal({ r, omega | v, alfa | at })` → aT, acp, \|a\|, el ángulo de a con v y con el radio; errores: suma, cambiadas, complementario.
- `desdeReposo({ alfa, r, razon | anguloAV })` → el ángulo girado, el tiempo y las velocidades en que acp/aT vale la razón dada (θ = razón/2), o en que a forma el ángulo dado con v.
- `rigido({ omega, radios })` y `latitud({ R, lambda, periodo })` → velocidad y acp de cada punto.
- `vectorial({ r, omega, theta0, t1, t2 })` → posiciones, velocidades como vectores, Δv, desplazamiento, velocidad media y aceleración media.
- `alfaMediaVectorial({ omega1, omega2, angulo, dt })`.
- `rodadura({ r, v })` → la velocidad de lo más alto, el centro, el apoyo y un punto a un ángulo dado (centro instantáneo).
- `mcuvTramos([{ alfa, t } …], omega0)` → ω y θ al final de cada tramo (acelera, constante, frena) y el total en vueltas.
- `encuentroMCUV({ omega01, alfa1, omega02, alfa2, theta0, sentido, n })`, que extiende `encuentroPista` a α constante, y `reencuentroSalida({ periodo1, periodo2 })`.
- `atraviesa({ L, v, omega, modo: 'discos' | 'cascaron', desfase })` y `plataforma({ vy, g })` para la ω mínima y el tiempo de vuelo.
- `poleaEscalonada({ radios, union, omega | vBloque })` y la cadena de n discos en contacto en `tren`; en `transmision`, el MCUV (misma aT en el contacto, α inversa al radio).
- El largo de una faja abierta, reusando `tangentesExternas` de `cinta-radio`.

Cada una necesita sus casos en `casos.json` verificados aparte (regla 2).

### Pendiente

- **Pedir a Gerson las páginas 91 en adelante** (gráficas, centro instantáneo, miscelánea, propuestos y claves). Faltan unos 100 resueltos y los 60 propuestos; el mapa de C7, C11 y la miscelánea puede cambiar el orden de prioridades.
- No adoptar la proposición del libro sobre «el MCU tiene aceleración constante»: el paso 7 la desarma.
- Hacer un informe de ideas erróneas del movimiento circular (MCU, MCUV, transmisión): `cinematica-ideas-erroneas.md` no lo cubre. El dato de la PUCP (Castillo y otros, 2013) y D9 son los únicos respaldos que tenemos.
- La clasificación cuenta un solo compendio, con un sesgo fuerte hacia el CEPRE-UNI (84 %). San Marcos tuvo solo dos preguntas de movimiento circular en 7 periodos (`docs/clasificacion-unmsm.md`). Cruzar con los temarios de provincia antes de fijar prioridades.
