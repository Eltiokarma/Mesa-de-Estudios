# Compendio de movimiento circunferencial: qué tipos de problema trae y qué les falta a las escenas

8 de noviembre de 2026 · Clasificación de un compendio de academia (libro completo), comparada con la pestaña «Ruedas» de `plantillas/tiro-parabolico/` y con `cinta-radio`, `dinamica`, `regla-de-tres`, `relojes-calendarios`, `mas` y `gravitacion`. Sirve de base para la escena nueva `plantillas/movimiento-circular/`.

> **El libro sirve solo como mapa** (regla 5 de `CLAUDE.md`): dice qué tipos de problema salen, cuántos hay y dónde están las trampas. No se copia nada al producto: ni enunciados, ni números, ni figuras, ni textos. Todo lo de abajo describe **tipos** en abstracto y con palabras nuestras. Los PDF (`fuentes/libros/cuzcano-movimiento-circunferencial-1-90.pdf` y `…-91-180.pdf`) **no se versionan**: `.gitignore` excluye `fuentes/**/*.pdf`.

**Fuente:** Tarazona, *Movimiento circunferencial. Teoría y práctica*, Editorial Cuzcano. Primera edición de 2006, con reimpresiones en 2008, 2011 y 2013 y una segunda edición «aumentada y corregida» de 2015. Es el tomo 6 de la colección de física del mismo autor (el de vectores es el tomo 2). La portada dice «Incluye problemas Cepre UNI».

**Qué se vio.** El libro completo, en dos escaneos de 90 páginas cada uno.
- **Sin superposición.** El primero llega a la página 91 del libro, donde queda el enunciado del resuelto 121. El segundo empieza en la 92, con su resolución. Cada problema tiene número, así que nada se contó dos veces.
- **Orden del libro.** Teoría; 11 problemas de aplicación; resueltos de MCU (12 a 54) y de MCUV (55 a 120); relaciones y gráficas de θ, ω, S y v contra el tiempo (121 a 135); centro instantáneo de rotación y poleas móviles (136 a 140).
- **Miscelánea (141 a 220).** Viene en cinco «tests» de seminario CEPRE-UNI y un bloque final de «problemas selectos» de una academia limeña. La resuelve **otro autor**, que firma la sección.
- **El final.** 60 propuestos con numeración propia (aquí «Pr1» a «Pr60»), ordenados por tema, y una tabla de claves solo para los propuestos.

La portadilla anuncia 260 problemas; **el prólogo dice 220 resueltos y 60 propuestos, y eso es lo que hay: 280**. Según el prólogo, los problemas son «tipo examen de admisión UNI», tomados como referencia de exámenes y seminarios del CEPRE-UNI y de exámenes de admisión, ordenados por tema y por dificultad, y resueltos muchas veces con vectores unitarios «por el nuevo plan de estudios de la UNI». La teoría (seis páginas) cubre:
- desplazamiento angular y lineal, periodo y frecuencia;
- velocidad angular y tangencial;
- aceleración angular, tangencial, centrípeta y total;
- MCU y MCUV, con la tabla de ecuaciones análogas al MRUV;
- las tres formas de transmisión (mismo eje, contacto, faja);
- la rotación instantánea de un cuerpo rígido.

- **280 problemas:** 220 resueltos y 60 propuestos (estos, solo con su clave).
- **Repetidos.** 8 resueltos son copia exacta de otro anterior; uno sale tres veces, con la ecuación del arco en función del tiempo y la aceleración pedida. Otros 2 repiten los datos de uno anterior y cambian solo la forma de la respuesta (decimales en vez de π). **Quedan 210 resueltos distintos.** Al menos 3 propuestos repiten un resuelto, con o sin un dato cambiado. Además hay «familias» que vuelven con otros números: la segunda vuelta para hallar la primera, el aparato que acelera, sigue y frena, y el punto de la Tierra según la latitud.
- **Origen.**
  - **175 de los 220 resueltos (80 %)** llevan una marca del CEPRE-UNI: «Sem. CEPRE-UNI», «Examen CEPRE-UNI» o «Práctica CEPRE-UNI». Cinco dicen el ciclo, de fines de los 90 a comienzos de los 2000.
  - **7 resueltos dicen «Examen UNI»**, sin año, y todos están en la primera mitad.
  - Entre los propuestos, 16 llevan marca CEPRE y 1 dice «Examen de admisión UNI».
  - Los 15 «problemas selectos» del final no tienen marca: vienen de una academia.
- **Notables.** Unos 35 de los 280 (12 %) dependen de un triángulo notable, sobre todo el de 37°/53°: descomponer la aceleración total en tangencial y centrípeta, o leer la posición y la velocidad como vectores. Aquí manda π.

## Resumen en cinco líneas

1. **La aceleración total (C9: 54 de 280) y el MCUV «como su análogo lineal» (C8: 50) suman 104, más de un tercio del libro.** La pestaña «Ruedas» tiene un solo experimento de MCUV. Con el libro completo, **la forma vectorial pasa al tercer lugar** (C6: 24), y aparecen dos familias que la primera mitad casi no tenía: **las gráficas θ-t, ω-t y α-t** (C11: 17) y **las ecuaciones horarias θ(t) y S(t)** (C13: 14).
2. Hay **dos atajos que el libro usa sin enunciar.** Desde el reposo, acp/aT = 2θ (no depende del radio ni de α): resuelve unos 15 problemas de C9. Y en el n-ésimo segundo desde el reposo, los ángulos van como los impares 1, 3, 5, 7…: resuelve 6 de C8. Los dos son predicciones naturales.
3. **El libro tiene errores, algunos serios.** El autor da por verdadero que el MCU «tiene aceleración constante», y la miscelánea, de otro autor, dice lo contrario. Hay al menos 12 erratas más: una clave que no coincide con su resolución, un resultado que pierde un π (lo delata su propio duplicado), fórmulas y unidades mal escritas, y cinco claves de propuestos que no se reproducen. Cada paso de la escena debe tener casos verificados aparte, nunca la clave del libro.
4. **Faltan del todo en las escenas:** la forma vectorial (C6), las gráficas θ-t y α-t y las de dos móviles (C11), las ecuaciones horarias (C13), el centro instantáneo (C7: la rueda que rueda, la barra que resbala, la bobina) y las poleas móviles. El tiro combinado con el giro (C5: 18) tiene media escena (la honda).
5. **Escena propia `plantillas/movimiento-circular/`** (ya decidida), con cinco pestañas: «El disco que acelera», «Flechas», «Gráficas», «Ruedas y poleas» y «¿Qué pasa si…?». Hay 9 generadores propuestos: 6 caben en el núcleo actual; C6 y C12 necesitan alternativas de texto, y hay respuestas con signo (α al frenar, ángulo neto) que el núcleo hoy descarta.

---

## 1. Los tipos

Los códigos C1 a C13 son nuestros. «1–120» y «121–220» son los resueltos de cada escaneo; «Prop.» son los propuestos. «CEPRE» cuenta, entre resueltos y propuestos, los que llevan cualquier marca del CEPRE-UNI; «UNI», los de examen de admisión UNI.

| Tipo | Qué se pide (en abstracto) | Res. 1–120 | Res. 121–220 | Prop. | **Total** | CEPRE | UNI |
| --- | --- | --- | --- | --- | --- | --- | --- |
| **C9** | **Aceleración total y sus componentes**: aT y acp en un instante; el módulo de a; el radio a partir del ángulo entre a y v; el instante o el ángulo girado en que aT y acp cumplen una razón dada; el ángulo de a con el radio o con v; a dada como vector y descompuesta; el cambio de acp; el radio de curvatura en una trayectoria que no es circular; un hilo que se desenrolla según una ley dada | 30 | 20 | 4 | **54** | 45 | 0 |
| **C8** | **MCUV con las ecuaciones del MRUV** («el análogo lineal»): tres de ω0, ωf, α, t y θ; frenados desde rpm; tramos (acelera, sigue y frena); la primera vuelta conociendo la segunda; razones entre ángulos de intervalos seguidos; **vueltas o área barrida en el n-ésimo segundo**; inversión de sentido | 27 | 12 | 11 | **50** | 35 | 4 |
| **C6** | **Forma vectorial**: el vector velocidad en otro punto o instante, el desplazamiento, la velocidad media y la aceleración media; el **vector acp** en un instante (también desde θ(t)); el vector aT; el periodo a partir de r y v vectores; el ángulo entre dos velocidades; ω y α como vectores ±k̂ (también la dirección de α en una bicicleta que frena, con puntos cardinales); la aceleración angular media cuando ω cambia de dirección o de sentido | 9 | 11 | 4 | **24** | 21 | 0 |
| **C3** | **Transmisión**: fajas abiertas y cruzadas, discos en contacto en cadena, poleas escalonadas con bloques, **poleas móviles** (la velocidad del bloque es la semisuma de las dos cuerdas), reducciones en MCUV (misma aT en la faja, misma α en el eje), engranajes, un **tren planetario** y la aceleración relativa entre dos puntos de ruedas en contacto | 9 | 9 | 5 | **23** | 10 | 1 |
| **C1** | **Ecuación básica del MCU y conversiones**: rpm, T, f, ω, v, vueltas; acp por vueltas o periodo; la Tierra que gira; el reloj; el hilo que se enrolla; la rapidez media y el ángulo; el satélite en órbita rasante | 14 | 4 | 2 | **20** | 14 | 2 |
| **C5** | **El giro con otro movimiento**: la bala por dos discos o por un cascarón; el proyectil desde una plataforma que gira, desde un avión en vuelo circular o desde lo alto de una rueda; algo que cae sobre un disco que arranca; la cuerda que se rompe; la bolita que se despega de un disco liso; un cuerpo que se desliza por una varilla o una generatriz que gira (velocidad compuesta) | 7 | 2 | 9 | **18** | 6 | 1 |
| **C11** | **Gráficas**: θ-t (la pendiente es ω; el vértice de la parábola, ω = 0), ω-t (el área es el ángulo, con signo si cruza el eje; posiciones en el plano a partir del área), α-t (el área es Δω), gráficas de dos móviles (separación o encuentro), y proposiciones sobre una gráfica | 1 | 10 | 6 | **17** | 10 | 0 |
| **C4** | **Encuentros y desfases en MCU**: sentidos iguales u opuestos; separación angular dada; primer o n-ésimo cruce; reencuentro en la salida o volver a alinearse con el centro; ángulo entre velocidades; las agujas del reloj; un insecto que camina sobre un disco que gira | 8 | 4 | 3 | **15** | 14 | 0 |
| **C12** | **Proposiciones verdadero o falso**: si el MCU tiene aceleración (constante o no); qué es tangente, qué es paralelo y qué es perpendicular entre ω, α, v, aT y acp; a = ω × v; qué es constante en el MCUV; la espiral con rapidez constante; puntos de la Tierra según la latitud | 2 | 7 | 5 | **14** | 10 | 0 |
| **C13** | **Ecuaciones horarias**: θ(t) o S(t) de segundo grado, y ω(t) lineal. Se reconocen ω0, α (o v0, aT) comparando con la ecuación; luego se pide ω, aT, acp, a, el ángulo entre v y a, el instante en que ω se anula, el ángulo entre dos instantes, las vueltas en un segundo dado o ω como vector | 0 | 11 | 3 | **14** | 11 | 0 |
| **C2** | **Puntos de un mismo cuerpo rígido**: misma ω, v proporcional a la distancia al eje; dos puntos con la diferencia de sus radios (o un porcentaje); el cono; la latitud (r = R cos λ); la razón de aceleraciones tangenciales en MCUV | 7 | 4 | 2 | **13** | 9 | 0 |
| **C7** | **Centro instantáneo de rotación**: la rueda que rueda en el piso o en un plano inclinado (velocidad de puntos del borde), la piedra que sale de lo más alto, **la barra que resbala** entre pared y piso, **la bobina o carrete**, el tractor de orugas que vira y el cono que rueda sobre su vértice | 2 | 4 | 4 | **10** | 0 | 0 |
| **C10** | **Dos partículas en MCUV** (o una en MCU y otra en MCUV): una vuelta de ventaja, el atraso para hallar la razón de α, la separación que vuelve, el primer encuentro (con una ecuación de segundo grado) | 4 | 2 | 2 | **8** | 6 | 0 |
| | **Total** | **120** | **100** | **60** | **280** | **191** | **8** |

Por secciones del libro:
- **Aplicación (1–11):** de todo un poco.
- **MCU (12–54):** sobre todo C1, C3, C4, C5 y C6.
- **MCUV (55–120):** C8 y C9 (53 de 66).
- **Gráficas y ecuaciones (121–135):** C11 y C13.
- **Centro instantáneo (136–140):** C7 y las poleas móviles.
- **Miscelánea (141–220):** C9 (20), C8 (12), C6 (11), C3 (8) y C12 (7).
- **Propuestos:** C8 (11), C5 (9), C11 (6), C3 (5) y C12 (5).

Los propuestos traen **mucho más C5** (9 de 60) que los resueltos: el libro deja para el alumno los problemas combinados con tiro parabólico.

### Método que enseña el libro, tipo por tipo

- **C8 y parte de C9: «el análogo lineal».** Es el método central y se repite en casi cada resuelto de MCUV.
  - El giro se «desenrolla» como un tramo recto con ω0 y ωf en sus extremos, y se usan las cuatro ecuaciones del MRUV con ω, α y θ.
  - Con varios tramos, dos ecuaciones que se dividen para cancelar α.
  - En los frenados con rpm, todo en vueltas y minutos, y se convierte al final.
  - En la miscelánea aparece además el **atajo de Galileo**: desde el reposo, lo girado en segundos sucesivos va como 1, 3, 5, 7…, y lo girado en n segundos como n². Con eso se resuelve de una vez «cuántas vueltas en el quinto segundo» o «qué área barre el radio en el octavo segundo».
- **C9: el triángulo de aceleraciones.** aT sobre la velocidad, acp hacia el centro, a como hipotenusa.
  - Si el ángulo es notable, a = 5k, aT = 3k, acp = 4k (o al revés), y k sale de acp = v²/R.
  - Con una razón entre aT y acp, el radio se cancela y se usa ω² = 2αθ desde el reposo: **acp/aT = 2θ**. El libro lo usa sin enunciarlo en unos 15 problemas.
  - Con rapidez inicial, la miscelánea escribe acp(final) = acp(inicial) + 2·aT·θ, la misma idea con el arranque desplazado.
- **C13: «reconocer términos».** Se compara θ(t) con θ0 + ω0·t + ½α·t² (o S(t) con S0 + v0·t + ½aT·t²) y se lee cada coeficiente. **El coeficiente de t² es α/2, no α.** La miscelánea deriva en vez de comparar.
- **C11: pendiente y área.**
  - En θ-t, la pendiente es ω, y el vértice de la parábola es el instante en que ω = 0 y cambia el sentido.
  - En ω-t, el área es el ángulo; si la gráfica cruza el eje, las áreas se restan para el ángulo neto y se suman para lo recorrido.
  - En α-t, el área es el cambio de ω.
  - Para ubicar la partícula en el plano, se suma el ángulo del área al de partida.
- **C6: vectores con la figura.**
  - La velocidad es tangente, con el sentido de giro.
  - Δv sale del triángulo de las dos velocidades.
  - El desplazamiento es la cuerda.
  - La velocidad media y la aceleración media se dividen entre Δt.
  - El vector acp apunta al centro, y se escribe −ω²·r⃗ (no depende del sentido de giro).
  - ω y α como ±k̂ con la mano derecha; α va con ω si acelera y contra ω si frena.
  - Para la aceleración angular media, se restan los **vectores** ω (con la ley de cosenos si no son paralelos).
- **C3: qué se conserva.**
  - Mismo eje: misma ω (y misma α).
  - Contacto o faja: misma v (y misma aT).
  - En la polea móvil, la velocidad del centro es la semisuma (vectorial) de las de sus dos cuerdas.
  - En el tren planetario, la velocidad del borde del satélite se arma con las de los dos engranajes que toca.
- **C7: la rueda gira alrededor del punto de apoyo.** Cada punto va a ω por su distancia al punto de contacto. En la barra que resbala, el centro instantáneo se halla con las perpendiculares a las dos velocidades conocidas (cae fuera de la barra). En la bobina, se apoya en el cilindro chico y los puntos del disco grande pueden ir más rápido o más lento que el centro.
- **C2, C4, C10 y C5.** Igual que en la primera mitad:
  - C2: misma ω, v/r.
  - C4 y C10: θ = ωt (o ½αt²) para cada móvil y una ecuación de la figura.
  - C5: tiempos iguales, con la ω mínima a **media vuelta**.
  - La miscelánea agrega la velocidad compuesta: la del giro más la del deslizamiento, perpendiculares, con Pitágoras.
- **C12: un caso por proposición**, con contraejemplos.

### Trampas que se deducen de las alternativas y de las resoluciones

| Trampa | Dónde aparece | Cómo se ve en las alternativas |
| --- | --- | --- |
| **rpm sin 2π o sin 60** | C1, C8, C3 | La correcta y la mitad o el doble, o un valor 60 veces mayor. |
| **Radianes como vueltas** | C1, C8 | El ángulo en radianes como número de vueltas, y al revés. Algunos propuestos traen las alternativas en «rad» cuando piden vueltas. |
| **Diámetro por radio**, y **cm o km/h sin convertir** | C1, C8, C9 | Sale en al menos 8 problemas; las alternativas incluyen el resultado con el diámetro o con el factor 10 o 100 de los centímetros. |
| **Misma v en el mismo cuerpo** | C2 | Puntos a distinta distancia con la misma velocidad. |
| **Latitud mal llevada** | C2, C12 | R en vez de R cos λ, o cos(λ/2). |
| **Qué se conserva en la transmisión** | C3 | Misma ω en una faja o misma v en un eje; proporción directa; el radio al cuadrado; ω/n contra nω. En MCUV, misma α donde va misma aT. |
| **La polea móvil** | C3 | El bloque va a la velocidad de una sola cuerda, o a la suma, en vez de la semisuma; «sube» contra «baja». |
| **Sumar o restar las ω**, y **primer encuentro contra reencuentro** | C4, C10 | Operación cambiada; primer alcance contra volver a la salida; separación «por el otro lado». |
| **Vuelta entera en vez de media vuelta** | C5 | La ω mínima para un agujero, o para que el proyectil vuelva, sale el doble. |
| **Arco por cuerda, y sin dividir entre Δt** | C6 | Desplazamiento como arco; velocidad media sin dividir; signo cambiado. |
| **El sentido de acp depende del sentido de giro** | C6 | Con ω negativa, el vector acp aparece con el signo cambiado. Las alternativas traen las cuatro combinaciones de signos. |
| **α siempre paralela a ω** | C6, C12 | Al frenar, α apunta contra ω (la bicicleta que frena: α hacia atrás). |
| **Restar módulos de ω** | C6 | Con ω que cambia de dirección o de sentido, se restan los módulos; el distractor es la diferencia sin signo. |
| **Rapidez constante, Δv = 0**, y **MCU sin aceleración o con aceleración constante** | C6, C12 | El cambio de velocidad no es cero; la aceleración existe y cambia de dirección. |
| **El punto de arriba va como el centro** | C7 | En la rueda que rueda, lo más alto va al doble del centro; en la bobina, el punto de abajo puede ir hacia atrás. |
| **Δt contra t**, y **el dato que sobra** | C8, C9, C2 | Intervalos que no empiezan en cero; un dato que no se usa (la masa, α cuando se pide una razón de aT, un tiempo cuando aT es constante). |
| **Seguir la ecuación tras detenerse** | C8, C13 | Una ω(t) que se anula dentro del intervalo: el ángulo neto no es lo que recorrió. El libro lo calcula sin advertirlo. |
| **El n-ésimo segundo** | C8 | Lo girado en el n-ésimo segundo contra lo girado en n segundos; razón n en vez de 2n − 1. |
| **El coeficiente de t² como α** | C13 | Se toma el coeficiente de t² por α (o por aT) sin multiplicar por 2; también se olvida el signo (aT negativa al frenar). |
| **Leer la gráfica mal** | C11 | Leer el valor del eje en vez del área o la pendiente; sumar áreas que se restan; tomar θ(t) por el ángulo girado sin restar el de partida. |
| **aT y acp cambiadas**, **sin Pitágoras**, **acp con ω0** | C9 | Tangente invertida, valores cruzados, suma de componentes, acp del inicio. |
| **Seno y coseno cambiados con el notable** | C9, C6 | Con 37° o 53°, la tangencial y la centrípeta (o las componentes x e y) intercambiadas. |
| **El cociente depende del radio** | C9, C10 | Desde el reposo, el ángulo en que acp/aT vale k no depende de R ni de α; en radios distintos con la misma α se gira igual. |
| **acp en la espiral** | C12 | Con rapidez constante, la acp es mayor donde la curva es más cerrada; aT = 0. |

### Convenciones de academia

- **π se deja indicado** en casi todas las respuestas. Se aproxima en pocos casos (π ≈ 3,14 en unos 4 problemas; π² ≈ 10 en unos 4, también como truco para sacar π de una raíz).
- **g** vale 10 m/s², salvo dos problemas con 9,8.
- **Unidades mezcladas**: rpm (unos 30 problemas), rps, vueltas por minuto, rad/min, rev/min², revoluciones, km/h y cm.
- **Respuestas dobles** en unos 30 problemas; **respuestas que no son un número** en unos 45: vectores con î, ĵ, k̂, ecuaciones, horas, expresiones literales (con n o con radios), raíces, arcotangentes, **intervalos** («entre 30 y 35 vueltas») y combinaciones de V y F.
- **Decimales de calculadora** en unos 25 problemas, sobre todo en la miscelánea y los propuestos. Son más que en la primera mitad, pero no conviene imitarlos.
- **Signo ± en las ecuaciones** en la parte del autor; **derivadas** (ω = dθ/dt, aT = dv/dt) en la miscelánea.
- **«Velocidad» por «rapidez»**, «aceleración normal» por centrípeta, «aceleración lineal» por tangencial. Cinco alternativas, con «N.A.» o «F.D.» como distractor.
- **Lugares reales**: aparece un óvalo con el nombre de un lugar de Lima, y un esmeril en la contratapa. Nuestros enunciados pueden usar lugares peruanos propios (regla 5).

### Erratas del libro, contrastando claves con resoluciones

| Dónde | Qué pasa | Gravedad |
| --- | --- | --- |
| Un resuelto de la primera mitad (C4, separación angular con ω como ±k̂) | El resultado lleva un π de más: la resolución usa los coeficientes de ω sin el π. **Lo delata su duplicado de la miscelánea**, que da el valor correcto, sin π. | Clave equivocada |
| Una proposición del autor (C12) | Da por **verdadero** que el MCU «tiene aceleración constante». La miscelánea, de otro autor, contesta lo contrario sobre el MCU. El libro se contradice. | **Conceptual** |
| Dos proposiciones de la miscelánea (C12) | Una da por verdadero que «el módulo de aT es constante» en el MCUV; la otra, por falso que «aT es constante», pensando en el vector. Las dos se sostienen solo si se dice si se habla del módulo o del vector. | Ambigua |
| Un resuelto de la primera mitad (C9) | La clave no coincide con los valores que la resolución calcula. | Clave equivocada |
| Un resuelto de la primera mitad (C2) | Las alternativas tienen una errata que deja la clave lejos del resultado. | Alternativas |
| Un resuelto de la primera mitad (C1) | Una velocidad con unidades de aceleración. | Unidades |
| Un resuelto de la primera mitad (C9) | Un dato de la figura contradice el enunciado. | Figura |
| La primera proposición de la miscelánea (C12) | La fórmula de la acp aparece con el cuadrado sobre el radio en vez de sobre ω. | Fórmula |
| Un resuelto de la miscelánea (C6) | Escribe el coseno de 30° como √2/2, aunque el número final está bien. | Fórmula |
| Tres propuestos de C8 | Alternativas en «rad» cuando se piden vueltas, y una alternativa sin número. | Unidades |
| Un propuesto de C8 | Pide la «aceleración tangencial» con unidades de aceleración angular y sin dar el radio. | Enunciado |
| Un propuesto de C6 | Alternativas de una aceleración angular en rad/s. | Unidades |
| Un propuesto de C6 | No dice el sentido de giro; la clave supone uno. | Enunciado incompleto |
| **Claves de propuestos**, verificadas aparte con cálculo propio | **37 coinciden.** **5 no se reproducen**: dos de C4 (realinearse; el insecto sobre el disco), uno de C3 (la aceleración relativa), uno de C11 (vueltas totales con una ω-t que cruza el eje) y el de C6 sin sentido de giro. 1 es **debatible**: una proposición de C12 sobre la aceleración de módulo constante. 17 no se verificaron porque dependen de detalles de la figura. | A revisar |

**Consecuencia para el método:** ningún caso de `casos.json` puede salir de una clave del libro. La regla 2 (casos verificados aparte) aquí no es un trámite.

---

## 2. Comparación con lo que ya existe

**La pestaña «Ruedas» de `plantillas/tiro-parabolico/` (0.2.0)** tiene seis experimentos con predicción:
- la rotonda: el MCU tiene aceleración hacia el centro;
- la honda: al romperse la cuerda, sigue la tangente;
- la cadena: misma v;
- la rueda de atrás: mismo eje;
- el frenado con la gráfica f-t: vueltas como área;
- la pista: alcance con una vuelta de ventaja.

El paso a paso es solo de tiro, y el `papel.json` trae cuatro problemas circulares.

El motor (`MotorTiro`) tiene `mcu`, `mcuv` (con `frena`), `mcuvDatos` (tres de cinco datos, con rpm y vueltas), `transmision` y `tren` (faja, cruzada, engranaje, eje y sentido), `encuentroPista` (lineal o angular, los dos sentidos, n-ésimo encuentro) y `soltarDelCirculo`, todos con `errores`.

**Otras escenas:**
- `plantillas/cinta-radio/`: radián, arco, sector, vueltas de una rueda que rueda (`vueltas`, `rodar`), la moneda alrededor de otra (`alrededor`), faja y bicicleta, y `tangentesExternas` y `tangentesInternas` para el largo de una faja.
- `plantillas/dinamica/`: columpio y loma (`centripeta`, `vertical`, `loma`, `curva`).
- `plantillas/regla-de-tres/`: engranajes con dientes y vueltas.
- `plantillas/relojes-calendarios/`: agujas del reloj.
- `plantillas/mas/`: el círculo de referencia, cuya sombra sobre un eje es la proyección de r⃗, v⃗ y a⃗ del MCU. Sirve para C6.
- `plantillas/gravitacion/`: la órbita, para el satélite rasante de C1.

| Tipo | Total | Cobertura | Qué hay / qué falta |
| --- | --- | --- | --- |
| C9 aceleración total | 54 | **A medias, muy poco** | La rotonda y la leyenda de aT y a en el frenado; el motor da aT, acp, a y `aSuma`. Faltan el triángulo aT-acp-a con un notable, el radio desde el ángulo entre a y v, la razón acp/aT (el atajo 2θ), acp(final) = acp(inicial) + 2·aT·θ y a como vector. |
| C8 MCUV análogo lineal | 50 | **A medias** | El frenado y `mcuvDatos`. Faltan los tramos, los intervalos que no empiezan en 0, la primera vuelta desde la segunda, el n-ésimo segundo (impares de Galileo) y la inversión de sentido. |
| C6 forma vectorial | 24 | **No** | `soltarDelCirculo` da posiciones; ningún paso dibuja Δv, la cuerda, la velocidad media, el vector acp ni ω y α como vectores. `mas` tiene el círculo de referencia, sin vectores de aceleración. |
| C3 transmisión | 23 | **A medias** | Cadena, eje, faja, bicicleta y engranajes (tres escenas). Faltan las poleas escalonadas con bloques, **las poleas móviles**, las reducciones en MCUV, los n discos en contacto y el tren planetario. |
| C1 MCU y conversiones | 20 | **A medias** | La rotonda, el papel y las vueltas de `cinta-radio`. Ningún paso pide convertir rpm con su trampa. |
| C5 el giro con otro movimiento | 18 | **A medias** | La honda. Faltan la bala, la plataforma, el avión en vuelo circular, la gota de barro de la rueda, la bolita que se despega y la velocidad compuesta. `tiro-parabolico` ya tiene el motor del proyectil. |
| C11 gráficas | 17 | **A medias** | El frenado con f-t (área). Faltan θ-t (pendiente, vértice), ω-t que cruza el eje (neto contra recorrido), α-t y las gráficas de dos móviles. |
| C4 encuentros en MCU | 15 | **A medias** | La pista (en metros) y el reloj. `encuentroPista` ya acepta la versión angular y los dos sentidos, sin paso. |
| C12 proposiciones | 14 | **A medias** | La rotonda contesta «¿tiene aceleración?». Falta todo lo de los vectores (qué es paralelo, qué es perpendicular) y la espiral. |
| C13 ecuaciones horarias | 14 | **No** | Nada. |
| C2 cuerpo rígido | 13 | **A medias** | La rueda de atrás (mismo eje). Faltan dos puntos del mismo disco, el cono y la latitud. |
| C7 centro instantáneo | 10 | **No** | `cinta-radio` hace rodar la rueda, sin velocidades por punto. |
| C10 dos partículas en MCUV | 8 | **No** | `encuentroPista` es solo uniforme. |

**Lo que falta, ordenado por frecuencia en el libro.** No cubiertos:
1. C6 (24)
2. C13 (14)
3. C7 (10)
4. C10 (8)

A medias:
1. C9 (54)
2. C8 (50)
3. C3 (23)
4. C1 (20)
5. C5 (18)
6. C11 (17)
7. C4 (15)
8. C12 (14)
9. C2 (13)

**Lo que las escenas tienen y el libro no:** la cinta del radián, la moneda que rueda alrededor de otra, la bicicleta completa y las fuerzas del columpio y la loma (dinámica circular, otro tomo).

---

## 3. Contraste con la tabla de errores

`docs/investigacion/cinematica-ideas-erroneas.md` cubre MRUV, caída libre y tiro; **no tiene códigos de movimiento circular** (la taxonomía lo marca «sin MCUV»). Lo circular con respaldo está en `dinamica-ideas-erroneas.md`:
- D9: fuerza centrífuga y «sigue curvándose» (Hestenes, Wells y Swackhamer, 1992; McCloskey, Caramazza y Green, 1980);
- el dato de la PUCP: movimiento circular fue de lo peor contestado en la nivelación (Castillo y otros, 2013).

Los códigos de «Ruedas» son casi todos `hipotesis`. Las trampas de este libro **no tienen estudio** y entran como hipótesis, salvo las que heredan respaldo de un código vecino.

### Trampas del libro que **coinciden** con códigos que ya existen

| Trampa del libro | Código existente | Respaldo y comentario |
| --- | --- | --- |
| «MCU: aceleración cero» | `rapidez-constante-sin-aceleracion` (escena) | Hipótesis. Sale en C12 (también en la miscelánea) y en el Δv de C6. |
| Aceleración hacia adelante; aT y v siempre en la misma dirección | K3 de cinemática (`K3-a-en-direccion-del-movimiento`) | Parcial (Trowbridge y McDermott, 1981). C12 y la α que frena en C6. |
| Al romperse la cuerda, sigue curvándose o sale hacia afuera | D9 (`D9-sigue-curvando`), `sale-hacia-afuera` | D9 parcial. Coincide con C5 (honda, bolita del disco liso, gota de barro). |
| Δt contra t | K4 de cinemática | Documentado en MRUV; aquí en versión angular. |
| Pendiente contra área; leer el eje | G2 y G4 de cinemática (`G4-pendiente-en-vez-de-area`, `G4-lee-el-eje`) | G2 y G4 parciales (Beichner, 1994). **Es el corazón de C11**: θ-t (pendiente), ω-t y α-t (área). |
| Las gráficas θ, ω y α tienen la misma forma | G3 de cinemática | Parcial. Las proposiciones sobre una θ-t parabólica lo piden. |
| Seguir la ecuación tras detenerse | «En el frenado, seguir usando la ecuación…» (cinemática) y `mcuv-sin-frenar` | Hipótesis. Sale en C8 y en C13 (ω(t) que se anula en el intervalo). |
| El n-ésimo segundo contra n segundos | «Confundir la distancia recorrida en el n-ésimo segundo…» (cinemática, sin respaldo) | Hipótesis. Aquí son 6 resueltos y 1 propuesto: más que en MRUV. |
| Misma ω con faja, proporción directa, radio al cuadrado | `omega-igual-con-faja`, `RM5-proporcion-directa`, `radio-al-cuadrado` | Hipótesis. C3. |
| Misma v en el mismo eje | `v-igual-en-eje`, `inversa-en-eje` | Hipótesis. C2 y C3. |
| Sumar o restar mal en el alcance | RM4 (`RM4-suma-en-alcance`), `vuelta-del-rapido` | Hipótesis. C4 y C10. |
| Radianes como vueltas | TR5 de trigonometría, `vueltas-sin-2pi` | TR5 parcial. C1 y C8. |
| Diámetro por radio | `vueltas-con-diametro` (cinta-radio) | Hipótesis. |
| Seno y coseno cambiados | `VE-sen-cos-cambiados`, TR9 | C9 y C6. |
| Sentido opuesto de un vector | `VE-sentido-opuesto` (propuesto en vectores) | C6 (signos en î, ĵ, k̂). |
| Mano derecha invertida | `VE-mano-derecha-invertida` (propuesto en vectores) | C6 (ω y α como ±k̂). |
| El ángulo no depende del radio | TR2 y TR6 | Parientes de C2 y C10. |
| aT + acp sin Pitágoras, acp con ω0 | `aSuma`, `acConOmega0` (motor) | Hipótesis, en el motor y sin paso. |

### Trampas **nuevas** (irían como `hipotesis`)

| Código propuesto | Error |
| --- | --- |
| `CI-rpm-sin-2pi` / `CI-rpm-sin-60` | Pasa rpm o vueltas a rad/s sin 2π o sin dividir entre 60. |
| `CI-diametro-por-radio` | Usa el diámetro donde va el radio. |
| `CI-unidades-sin-convertir` | Mezcla km/h, cm y m (o minutos y segundos). |
| `CI-latitud-sin-coseno` | En la Tierra usa R en vez de R cos λ. |
| `CI-cadena-directa` | En n discos en contacto, divide ω entre n. |
| `CI-bloque-radio-equivocado` | En una polea escalonada, usa el radio de la otra garganta. |
| `CI-polea-movil-una-cuerda` | En una polea móvil, toma la velocidad de una sola cuerda (o la suma) en vez de la semisuma. |
| `CI-alfa-igual-con-faja` | En una reducción en MCUV, cree que las ruedas unidas por faja tienen la misma α (la que se conserva es aT). |
| `CI-primer-encuentro-vs-salida` | Confunde el primer alcance con volver a coincidir en la salida. |
| `CI-separacion-despues` | Da el segundo instante con la separación pedida, no el primero. |
| `CI-vuelta-entera` | Usa una vuelta en vez de media para la ω mínima. |
| `CI-arco-por-cuerda` / `CI-media-sin-dividir` | Arco como desplazamiento; Δr o Δv sin dividir entre Δt. |
| `CI-delta-v-cero` | Cree que Δv = 0 en el MCU. |
| `CI-acp-con-signo-de-omega` | Cambia el sentido del vector acp cuando ω es negativa (acp = −ω²·r⃗ no depende del sentido). |
| `CI-alfa-siempre-con-omega` | Cree que α tiene siempre el sentido de ω (al frenar, va en contra). |
| `CI-alfa-resta-modulos` | Resta los módulos de ω cuando cambia de dirección o de sentido. |
| `CI-cir-todos-a-v` | Cree que todos los puntos de una rueda que rueda van como el centro. |
| `CI-cir-en-la-barra` | Busca el centro instantáneo de una barra que resbala sobre la propia barra. |
| `CI-dato-que-sobra` | Usa un dato que no hace falta (masa, tiempo, α). |
| `CI-at-crece` | Cree que en el MCUV la tangencial crece con la rapidez, o que la centrípeta es constante. |
| `CI-at-ac-cambiadas` | Invierte aT/acp o intercambia sus valores. |
| `CI-cociente-depende-del-radio` | Cree que el ángulo desde el reposo en que acp/aT vale k depende de R o de α (es k/2 rad). |
| `CI-enesimo-segundo` | Confunde lo girado en el n-ésimo segundo con lo girado en n segundos, o usa la razón n en vez de 2n − 1. |
| `CI-coeficiente-como-alfa` | En θ(t) o S(t), toma el coeficiente de t² como α (o aT), sin el factor 2, o pierde su signo. |
| `CI-neto-por-recorrido` | Con ω que cambia de signo, da el ángulo neto cuando se pide lo recorrido (o al revés). |
| `CI-posicion-por-giro` | En θ-t, toma el valor de θ como ángulo girado sin restar la posición inicial. |
| `CI-espiral-acp-igual` | En una curva con rapidez constante, cree que la acp es la misma en todos los puntos. |
| `CI-mcu-a-constante` | Cree que la aceleración del MCU es constante porque su módulo lo es. **Lo afirma el propio libro** (y lo niega su miscelánea). |

---

## 4. Propuesta para `plantillas/movimiento-circular/` (escena propia, ya decidida)

### (a) La escena: «El disco y sus flechas»

**Ficha.**
- `plantilla.json` con `id: "movimiento-circular"`, formato `escena` y la unidad `fisica.movimiento-parabolico-y-circular`.
- Agregar `"movimiento-circular"` al campo `plantillas` de esa unidad en `catalogo/cursos/fisica.json` y correr `npm run catalogo`.
- Archivos de siempre: `index.html`, `motor.js`, `casos.json`, `motor.test.js` y `papel.json`.
- La pestaña «Ruedas» de `tiro-parabolico` se queda como entrada corta y enlaza aquí.

**Colores (regla 4).** Reusar las claves de `tiro-parabolico`, que ya pasaron revisión de contraste: `--c-v`, `--c-a` (acp y a), `--c-at`, `--c-w` (ω y θ) y `--c-t`. Agregar `--c-alfa` para α y un color para r⃗, en claro y en oscuro, según `docs/diseno.md`. La aceleración total va a trazos sobre su color, como en el frenado de «Ruedas».

**Motor.** Mudar (copiar con sus casos) `mcu`, `mcuv`, `mcuvDatos`, `transmision`, `tren`, `encuentroPista` y `soltarDelCirculo` de `MotorTiro` a `MotorCircular`, con sus `errores`, y agregar las funciones de (c). Más adelante, si se quiere una sola fuente, se pueden pasar a `nucleo/`.

**Regla de casos.** Cada caso de `casos.json` se calcula aparte. **Ninguno sale de una clave del libro** (ver erratas).

Las cinco pestañas, por peso en el libro. Cada paso pide una predicción que bloquea, y la escena cambia recién después de responder. Las figuras y los números son nuestros.

**Pestaña 1, «El disco que acelera»** (paso a paso; C8 y C9: 104). Un disco que parte del reposo con α constante y un punto del borde con v, aT, acp y a.

1. **El problema.** Radio y α propios, desde el reposo.
2. **«¿Qué flecha cambia?»** Correcta: aT no cambia y acp crece. Distractores: las dos crecen (`CI-at-crece`), las dos fijas (`CI-mcu-a-constante`), aT crece y acp fija. Después, el disco gira y las flechas cambian a la vista.
3. **«¿Cuándo son iguales?»** ¿Cuánto giró cuando acp = aT? Correcta: medio radián. Distractores: depende del radio (`CI-cociente-depende-del-radio`), 45° (confunde el ángulo de a con lo girado), una vuelta. Al responder, dos perillas cambian R y α y el disco se detiene siempre en el mismo ángulo. Remate: acp/aT = 2θ.
4. **«Segundo a segundo».** El arco se pinta con un color distinto en cada segundo. Se predice cuántas veces lo del primer segundo gira en el tercero. Correcta: 5. Distractores: 3 (`CI-enesimo-segundo`), 9 (lo girado en tres segundos), 2. Después aparecen los impares en fila.
5. **«El análogo lineal».** El arco se desenrolla en una pista recta, con la gráfica ω-t debajo. Se predicen las vueltas de un tramo que no empieza en t = 0. Distractores: el rectángulo con ω0 o con ωf, Δt contra t (K4), radianes como vueltas.
6. **«rpm».** Contador de vueltas y reloj; se predice ω en rad/s. Distractores: `CI-rpm-sin-2pi`, `CI-rpm-sin-60`, `CI-diametro-por-radio`.
7. **«El triángulo de aceleraciones».** a forma un ángulo notable con v; se predice el radio o aT. Distractores: seno y coseno cambiados, `aSuma`, `CI-at-ac-cambiadas`.

**Pestaña 2, «Flechas»** (C6, C12 y C2: 51). MCU en el plano cartesiano, con r⃗, v⃗ y acp⃗ dibujados y sus componentes en î y ĵ.

8. **«La flecha que se gira».** Se predice \|Δv\| entre dos posiciones. Distractores: 0 (`CI-delta-v-cero`), 2v siempre, la suma de rapideces. Al responder, las dos flechas se trasladan a un mismo origen. Variante: la velocidad media con la cuerda contra el arco (`CI-arco-por-cuerda`, `CI-media-sin-dividir`).
9. **«¿Hacia dónde apunta acp?»** Con ω negativa, se predice el vector acp en un punto. Correcta: hacia el centro, igual que con ω positiva. Distractores: el opuesto (`CI-acp-con-signo-de-omega`), tangente (K3), hacia afuera (D9). Remate: la aceleración del MCU **no es constante**, porque gira con el punto (`CI-mcu-a-constante`).
10. **«ω y α con la mano»** (C6 y C12). Un disco visto en 3D con ω y α como flechas sobre el eje. Al frenar, se predice hacia dónde apunta α. Correcta: contra ω. Distractores: con ω (`CI-alfa-siempre-con-omega`), tangente al borde. Variante: la aceleración angular media cuando ω cambia de sentido (`CI-alfa-resta-modulos`).
11. **«Dos puntos del mismo disco»** (C2). Se predice la razón de velocidades. Distractor: iguales (`v-igual-en-eje`). Variante con un globo terráqueo y la latitud (`CI-latitud-sin-coseno`).

**Pestaña 3, «Gráficas»** (C11 y C13: 31). Tres gráficas amarradas por color (θ-t, ω-t y α-t) y el disco al lado. El alumno arrastra un cursor de tiempo.

12. **«La pendiente es ω».** En una θ-t parabólica, se predice cuándo el disco se detiene. Correcta: en el vértice. Distractores: donde θ vale cero, al final, nunca (G2, `CI-posicion-por-giro`).
13. **«El área con signo».** Una ω-t que cruza el eje. Se predicen el ángulo neto y lo recorrido. Distractores: `CI-neto-por-recorrido`, la pendiente (G4), el valor del eje.
14. **«De la ecuación al disco»** (C13). Se da θ(t) o S(t) de segundo grado y se predice α o aT. Correcta: el doble del coeficiente. Distractores: el coeficiente (`CI-coeficiente-como-alfa`), con el signo cambiado, el término lineal. Al responder, la ecuación se colorea término por término con el color de su variable.
15. **«Dos discos en la misma gráfica»** (C10 y C11). Dos rectas ω-t; se predice la separación cuando sus acp son iguales. Correcta: el área entre las rectas.

**Pestaña 4, «Ruedas y poleas»** (C3 y C7: 33).

16. **«La polea móvil».** Dos cuerdas a distinta velocidad; se predice la del bloque. Correcta: la semisuma. Distractores: la de una cuerda, la suma, la diferencia (`CI-polea-movil-una-cuerda`).
17. **«La reducción que acelera».** Faja y eje en MCUV; se predice qué se conserva en cada unión. Distractor: `CI-alfa-igual-con-faja`.
18. **«La rueda que rueda».** Velocidades de lo más alto, el centro, el apoyo y un punto lateral. Correcta: lo más alto al doble. Distractores: igual al centro (`CI-cir-todos-a-v`), cero, el triple. Al responder, la rueda gira alrededor del punto de apoyo. Variantes: la bobina apoyada en su cilindro chico (un punto del disco va hacia atrás) y **la barra que resbala**, con las dos perpendiculares que se cortan fuera de la barra (`CI-cir-en-la-barra`).

**Pestaña 5, «¿Qué pasa si…?»** (C5, C4 y C1: 53).

19. **«La bala y los discos».** Se predice la ω mínima. Distractor: una vuelta entera (`CI-vuelta-entera`). Cámara lenta al responder.
20. **«La gota de barro».** Una gota sale del borde de una rueda y debe caer en el mismo punto. Se predice si hace falta más o menos rapidez que para media vuelta. Reusa el proyectil de `tiro-parabolico`.
21. **«La bolita que se despega».** Disco liso visto desde arriba; la bolita sale por la tangente, no hacia afuera (D9, `sale-hacia-afuera`). Se predice el punto por donde sale del disco.
22. **«El reencuentro».** Dos móviles con ω (o α) distintas; ¿cuándo coinciden en la salida? Distractores: el primer alcance (`CI-primer-encuentro-vs-salida`), la suma de las ω, el periodo del rápido.
23. **«Frena y se da la vuelta».** Con un mismo dato, una rueda con freno (se queda quieta) y una partícula que nada detiene (vuelve). Usa `mcuv` con y sin `frena`.

**Papel (`papel.json`).** De 8 a 10 problemas propios, uno por pestaña y tipo: la escalera de tramos, el triángulo de aceleraciones, el n-ésimo segundo, el vector acp, la ω-t que cruza el eje, la ecuación horaria, la polea móvil con bloque, la rueda que rueda, la bala y los discos, y el reencuentro.

**Orden sugerido de construcción:** pestaña 1, pestaña 3, pestaña 2, pestaña 4, pestaña 5. Así se ataca primero lo que más pesa y lo que no tiene nada (C13 y C11).

### (b) Generadores (formato «predicciones»)

`nucleo/predicciones.js` (`armar`) hoy acepta solo **valores numéricos positivos**, formateados con coma decimal. Este tema agrega a lo que pedía vectores tres necesidades:
- **π indicado.** Elegir datos para que la respuesta salga sin π, o agregar al núcleo una opción `formato` con una función (como `textoPi` de `cinta-radio`).
- **Respuestas dobles.** Una pregunta por ejercicio.
- **Signo.** El ángulo neto, α al frenar y aT negativa en C13 piden una opción `conSigno`, que no descarte valores negativos ni el cero.

| Generador | Tipos | Parámetros | Pregunta | Distractores (código) | ¿Cabe en el núcleo actual? |
| --- | --- | --- | --- | --- | --- |
| **G1 MCU y conversiones** | C1, C2 | Radio o diámetro, rpm, periodo o vueltas; dos radios del mismo disco; latitud notable | ω, v, acp, vueltas, una razón | `CI-rpm-sin-2pi`, `CI-rpm-sin-60`, `CI-diametro-por-radio`, `acSinCuadrado`, `v-igual-en-eje`, `CI-latitud-sin-coseno` | Sí (respuesta sin π o con `formato`) |
| **G2 transmisión** | C3 | Tren de 2 a 4 ruedas, poleas escalonadas, una polea móvil, reducción en MCUV | ω o rpm de la última, velocidad del bloque, α de la última | `omegaIgualConFaja`, `omegaDirecta`, `omegaCuadrado`, `vIgualEnEje`, `CI-bloque-radio-equivocado`, `CI-polea-movil-una-cuerda`, `CI-alfa-igual-con-faja` | Sí; «sube o baja» pide texto |
| **G3 MCUV de tres datos** | C8 | Tres de ω0, ωf, α, t, θ (rpm, rad/s, vueltas), intervalos desplazados, tramos | t, θ, vueltas o \|α\| | rectángulos, pendiente, eje, `vueltasSinDosPi`, K4, `CI-rpm-sin-60` | Sí, con magnitudes |
| **G4 n-ésimo segundo** | C8 | Vueltas (o área barrida) en el segundo k, desde el reposo | Lo girado en el segundo m | `CI-enesimo-segundo` (razón m/k, m²/k², lo de m segundos) | Sí |
| **G5 aceleración total** | C9 | Ángulo notable entre a y v, rapidez, radio, α; una razón acp/aT desde el reposo; acp inicial más aT y θ | R, aT, \|a\|, θ, la tangente del ángulo | `aSuma`, `acConOmega0`, `CI-at-ac-cambiadas`, seno y coseno cambiados, `CI-cociente-depende-del-radio` | Sí |
| **G6 ecuación horaria** | C13 | θ(t) = θ0 + b·t + c·t², o S(t), con enteros propios | ω o α en un instante, el instante en que ω = 0, lo girado entre dos instantes, aT, acp | `CI-coeficiente-como-alfa`, `CI-posicion-por-giro`, `CI-neto-por-recorrido` | Sí para magnitudes; los signos piden `conSigno` |
| **G7 gráfica ω-t** | C11 | Gráfica de tramos rectos con vértices enteros (puede cruzar el eje) | Ángulo neto, recorrido o vueltas en un intervalo | G4 (pendiente), lee el eje, `CI-neto-por-recorrido` | Sí para lo recorrido; el neto negativo pide `conSigno` |
| **G8 encuentros** | C4, C10 | Dos ω (o dos α), sentido, separación, n | t del n-ésimo encuentro, vueltas de uno, t del reencuentro en la salida | `tConSuma`, `tConResta`, `tVueltaDelRapido`, `CI-primer-encuentro-vs-salida`, `CI-separacion-despues` | Sí |
| **G9 el giro con otro movimiento** | C5 | Distancia entre discos, rapidez de la bala, desfase; componente vertical del proyectil | ω mínima o rapidez | `CI-vuelta-entera`, grados sin pasar a radianes | Sí |

**No caben todavía:** C6 (la respuesta es un vector: pide `armarTexto`, lo mismo que vectores, o preguntar por un escalar que resuma, como \|Δv\| o una componente), C12 (verdadero o falso: texto) y C7 (las razones literales entre velocidades se pueden pasar a número). Las extensiones del núcleo (**alternativas de texto, `conSigno` y `formato`**) conviene hacerlas una sola vez, para los dos temas.

**G2, G3, G4 y G8 se pueden empezar ya**: el motor tiene `transmision`, `tren`, `mcuvDatos` y `encuentroPista`; G4 sale de `mcuvDatos` con dos llamadas. G1, G5, G6, G7 y G9 necesitan funciones de (c). Cada uno lleva su `generador.test.js` (muchas semillas, 4 o 5 alternativas distintas, la correcta contra un cálculo independiente), como en `plantillas/porcentajes-sucesivos/`.

### (c) Funciones de motor que harían falta

Todas sin DOM, con su campo `errores` y casos verificados aparte (regla 2):
- `convertir({ rpm | rps | f | omega | periodo })`, que exporta lo de la función privada `angular`, con `CI-rpm-sin-2pi` y `CI-rpm-sin-60`.
- `aceleracionTotal({ r, omega | v, alfa | at })` → aT, acp, \|a\|, el ángulo de a con v y con el radio.
- `desdeReposo({ alfa, r, razon | anguloAV })` → θ, t y velocidades donde acp/aT vale la razón dada (θ = razón/2) o donde a forma el ángulo dado con v.
- `enesimoSegundo({ alfa | theta1, n })` → lo girado en el segundo n y en los n primeros segundos.
- `horaria({ theta0, omega0, alfa })` (o `{ s0, v0, at, r }`) → θ(t), ω(t), los instantes en que ω = 0, lo girado entre dos instantes (neto y recorrido), aT, acp y a en un instante.
- `grafica({ tipo: 'omega' | 'alfa' | 'theta', puntos })` → para ω-t de tramos rectos, el ángulo neto y el recorrido entre dos instantes; para α-t, ω(t); para θ-t, la pendiente en cada tramo.
- `vectorial({ r, omega, alfa, theta0, t1, t2 })` → r⃗, v⃗, aT⃗ y acp⃗ en cada instante, Δv, la velocidad media y la aceleración media.
- `alfaMediaVectorial({ omega1, omega2, angulo, dt })`.
- `rigido({ omega, radios })` y `latitud({ R, lambda, periodo })`.
- `rodadura({ r, v, rApoyo })` → velocidades de puntos del borde (la bobina, con radio de apoyo distinto); `barraResbala({ L, angulo, vA })` → centro instantáneo, ω y vB.
- `poleaMovil({ v1, v2 })`, `poleaEscalonada({ radios, omega | vBloque })`, la cadena de n discos en `tren`, el MCUV en `transmision` (misma aT en la faja, misma α en el eje) y `planetario({ R, r, n1, n2 })`.
- `mcuvTramos([{ alfa, t } …], omega0)` → ω y θ al final de cada tramo y el total en vueltas.
- `encuentroMCUV({ omega01, alfa1, omega02, alfa2, theta0, sentido, n })` y `reencuentroSalida({ periodo1, periodo2 })`.
- `atraviesa({ L, v, omega, modo, desfase })`, `plataforma({ vy, g })`, `gotaDeRueda({ r, g })` y `despegaDelDisco({ R, d, omega })` para C5.
- El largo de una faja, reusando `tangentesExternas` de `cinta-radio`.

### Pendiente

- Hacer un informe de ideas erróneas del movimiento circular (`docs/investigacion/`): `cinematica-ideas-erroneas.md` no lo cubre, y D9 y el dato de la PUCP son los únicos respaldos. Vale la pena buscar estudios sobre gráficas θ-t y ω-t (por analogía con Beichner) y sobre el centro instantáneo.
- No adoptar ninguna clave del libro sin verificarla: hay al menos 2 claves de resueltos y 5 de propuestos que no se sostienen.
- La clasificación cuenta un solo compendio, con un sesgo fuerte hacia el CEPRE-UNI (191 de 280). San Marcos tuvo solo dos preguntas de movimiento circular en 7 periodos (`docs/clasificacion-unmsm.md`). Cruzar con los temarios de provincia antes de fijar prioridades.
