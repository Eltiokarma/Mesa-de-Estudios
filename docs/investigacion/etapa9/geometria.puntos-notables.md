# Propuesta de teoría — Geometría: Puntos notables

**Público:** estudiantes peruanos de 5.º de secundaria y preparación preuniversitaria que estudian de forma autónoma en el celular.  
**Fecha de revisión de fuentes:** 21 de noviembre de 2026.  
**Alcance:** propuesta pedagógica para producir la unidad; no constituye un banco de problemas ni una especificación de programación. Las escenas, misiones y predicciones son propuestas originales. Los ejemplos de resolución se entregan como guiones, sin ejercicios numéricos finales.

## 1. Resumen en 5 líneas

1. La unidad enseña a elegir un punto notable según la condición que debe cumplir: equilibrio, distancias iguales, bisectrices o perpendicularidad.
2. Construye baricentro, circuncentro, incentro, ortocentro y excentros, y después relaciona los centros mediante la recta de Euler.
3. La dificultad principal es distinguir condiciones geométricas que pueden parecer iguales en un dibujo simétrico.
4. Los estudios consultados documentan confusiones entre altura y mediana y dificultades con alturas exteriores y representaciones poco habituales [F08], [F09].
5. La progresión termina en selección justificada de propiedades, ángulos, longitudes y problemas combinados; la frecuencia histórica en admisión queda sin determinar.

## 2. Qué se pregunta en los exámenes

**Cómo leer la evidencia.** Se distinguen preguntas atribuidas a un examen y consultadas en una reproducción de academia, ejercicios de preparación y contenidos de temario. Una práctica preuniversitaria no demuestra que el mismo tipo haya salido en un examen. La dificultad indicada es una valoración didáctica propia: **básica**, reconocer una condición; **media**, encadenar dos propiedades; **alta**, introducir un trazo o coordinar varias relaciones.

| Tipo de pregunta | Universidad y evidencia concreta | Dificultad | Frecuencia que puede sostenerse | Fuente |
|---|---|---|---|---|
| Evaluar afirmaciones sobre coincidencia y alineación de centros en triángulos especiales. | UNI 2023-II, Matemática, pregunta 29. | Media: exige distinguir una propiedad general de un caso especial. | Una aparición localizada; no permite estimar recurrencia. | Trilce, 2023, reproducción del examen, pp. 10–11 [F01]. |
| Obtener coordenadas del baricentro a partir de un triángulo colocado en el plano. | UNMSM 2023-I, área D, pregunta 37. | Media: lectura de la figura y promedio de coordenadas. | Una aparición localizada. | Trilce, 2022, examen del proceso 2023-I, pp. 15–16; copia consultada [F02]. |
| Usar una circunferencia inscrita, tangencias y simetría para encontrar una longitud. | UNMSM 2026-I, Medicina Humana, pregunta 36. Es una aplicación vinculada al incentro, aunque el solucionario la clasifica como circunferencia. | Media–alta. | Una aparición localizada. | Trilce, 2025, p. 23 [F03]. |
| Calcular ángulos y longitudes usando uno o varios centros. | CEPRE UNMSM, ciclo 2024-I, semana 7. | Media–alta. | Repetido dentro del boletín; no equivale a frecuencia en admisión. | Material institucional reproducido por un tercero, pp. 25–30 [F04]. |
| Aplicar propiedades de centros y relacionarlas con semejanza y Euler. | CEPRE UNI, guía del ciclo 2023-2. | Media–alta según la combinación. | Presencia curricular expresa; no aporta un conteo de preguntas. | Guía alojada por CEPRE UNI, bloque de Geometría [F05]. |
| Reconocer y utilizar los cinco centros, incluido el excentro. | UNMSM, temario de admisión 2025-II, apartado 8.4. | Desde básica hasta alta. | Presencia curricular; frecuencia no determinada. | Reglamento institucional, p. 97 impresa, copia consultada [F06]. |
| Trabajar líneas y puntos notables, Euler y ángulos entre líneas notables. | UNSAAC, temario para admisión 2024, Geometría y Trigonometría, apartado 3. | Media–alta. | Presencia curricular; frecuencia no determinada. | Dirección de Admisión de la UNSAAC [F07]. |

**Qué tiene mayor presencia en la muestra revisada.** Se contaron las menciones explícitas de centros en los **20 ejercicios** del boletín CEPRE UNMSM 2024-I, semana 7: 14 de clase y 6 propuestos. Aparecen circuncentro en 6, incentro en 5, excentro en 4, ortocentro en 3 y baricentro en 2. Un ejercicio puede mencionar varios centros; los grupos se superponen. Este conteo describe únicamente ese boletín [F04].

Por tanto, **no es defendible afirmar cuáles son los más frecuentes en los exámenes históricos de San Marcos y la UNI** con esta selección. La prioridad propuesta —reconocer condiciones, trabajar ángulos y combinar centros— responde a la evidencia localizada y a las dependencias de aprendizaje, no a porcentajes inventados.

No se consiguió una colección suficientemente comprobable de preguntas de UNA Puno y UNSA para clasificarlas aquí. En particular, localizar una referencia a un temario no se ha tratado como haber verificado sus ejercicios.

## 3. Errores típicos

**Alcance de las etiquetas.** “Documentado” significa que se leyó el resultado en la investigación original. No significa que se haya medido su prevalencia entre postulantes peruanos. Las explicaciones causales de los autores son interpretaciones, no causas demostradas experimentalmente. Los distractores de las predicciones son redactados para esta propuesta; cuando su error es hipotético, requieren pilotaje antes de presentarlos como errores reales comprobados.

| Código | Qué hace o cree el alumno | Por qué puede hacerlo | Estado | Fuente |
|---|---|---|---|---|
| D-MED | Dibuja una mediana cuando se le pide una altura. | Los autores relacionan la confusión con imágenes prototípicas y con usar el dibujo recordado antes que la definición. | **DOCUMENTADO** | Gutiérrez y Jaime, 1996, figura 8 [F08]. |
| D-EXT | Sustituye una altura exterior por otra interior. | Su imagen de altura excluye el caso exterior. | **DOCUMENTADO** | Gutiérrez y Jaime, 1996, figura 10 [F08]. |
| D-BASE | Cuenta una sola altura porque ve una sola base. | Asocia “base” con el lado colocado abajo. | **DOCUMENTADO** | Morales Carballo y Damián Mojica, 2021, pregunta 5, p. 11 [F09]. |
| D-PTO | Marca puntos medios y los presenta como medianas. | Omite el segmento que los une al vértice opuesto. | **DOCUMENTADO** | Morales Carballo y Damián Mojica, 2021, pregunta 6, p. 12 [F09]. |
| D-FIG | Dice que hay tres mediatrices, pero las representa incorrectamente. | Repite el número sin dominar la construcción. | **DOCUMENTADO** | Morales Carballo y Damián Mojica, 2021, pregunta 4, p. 10 [F09]. |
| D-COIN | Afirma que los cuatro centros coinciden en cualquier triángulo isósceles. | Confunde estar sobre una misma recta con ocupar un mismo punto; esta explicación se propone como interpretación del resultado. | **DOCUMENTADO** | Smith, 2017, sección “Centers of triangles applet”, cuarta página del PDF: quienes fallaron esa pregunta respondieron “isósceles” [F31]. |
| S-TRAZO | Tiene dificultades para seleccionar un teorema y un trazo auxiliar. | La autora describe dificultades de visualización y aplicación en su experiencia preuniversitaria. | **DE SEGUNDA MANO** en esta revisión: se accedió al resumen, no al trabajo completo. | Catire Tranca, 2024, resumen recogido por ALICIA [F10]. |
| H-RAZ | Reparte una mediana por mitades, invierte la razón o usa tres a uno. | Confunde mitad del lado con mitad de la mediana; cambia el orden de los segmentos; o interpreta “tres medianas” como una proporción. | **HIPÓTESIS** | No se encontró evidencia original específica para estas tres variantes. |
| H-CEN | Supone que todo “centro” está dentro o coincide con el medio de un lado. | Traslada la idea cotidiana de centro a condiciones geométricas distintas. | **HIPÓTESIS** | Sin fuente específica localizada. |
| H-EXIST | Cree que un triángulo obtusángulo no puede tener una circunferencia que pase por sus tres vértices. | Rechaza un centro situado fuera de la figura. | **HIPÓTESIS** | Sin fuente específica localizada. |
| H-ANG | Confunde dividir un ángulo con producir un ángulo recto o con dividir también el ángulo formado por dos bisectrices. | Mezcla el ángulo original con el que aparece en la intersección. | **HIPÓTESIS** | Sin fuente específica localizada. |
| H-VIS | Cree que una propiedad depende de cuánto “se abre” o de cómo se orienta el dibujo, aunque sus condiciones se conserven. | Decide por apariencia y no comprueba las restricciones. | **HIPÓTESIS** como distractor específico. | Es coherente con las dificultades de representación de [F08], [F09], pero esta formulación no se midió allí. |
| H-RECT | Coloca el ortocentro en el vértice obtuso. | Extiende indebidamente el caso del vértice recto. | **HIPÓTESIS** | Sin fuente específica localizada. |
| H-EXC | Predice una, dos o infinitas circunferencias exinscritas. | Traslada la unicidad de la inscrita; cuenta las dos bisectrices exteriores como dos centros; o comprueba solo dos contactos. | **HIPÓTESIS** | Sin fuente específica localizada. |
| H-EUL | Alinea siempre los cuatro centros o sustituye uno por el incentro. | Generaliza el triángulo isósceles o recuerda una lista sin sus condiciones. | **HIPÓTESIS** | Sin fuente específica localizada. |

La evidencia original más directamente útil procede de estudiantes de Magisterio en España [F08] y de estudiantes al final de su primer semestre de la Licenciatura en Matemáticas en México [F09]. No son muestras representativas de postulantes peruanos. También se encontró una experiencia colombiana con estudiantes de secundaria y geometría dinámica [F11]. La referencia peruana [F10] aporta contexto profesional, pero **no se utiliza para atribuir porcentajes, efectos causales ni errores concretos que su resumen no documenta**.

Smith [F31] estudia futuros docentes de primaria en Estados Unidos, no alumnos de admisión. Además, Palomino Gomez [F30] investigó dos duplas de estudiantes de tercero de secundaria de una institución privada de Lima. Su resumen informa poca práctica para validar conjeturas. **Se consultaron el resumen original y los metadatos, pero no se pudo completar la lectura del análisis de resultados**; por ello, esa evidencia se conserva como **de segunda mano para esta revisión** y no permite confirmar los distractores H-RAZ.

## 4. Lo que la unidad da por sabido

El alumno necesita poder:

- Distinguir punto, segmento, recta y semirrecta; reconocer que prolongar un lado conserva su dirección.
- Identificar vértices y lados opuestos, punto medio, paralelismo y perpendicularidad, incluso con la figura girada.
- Clasificar triángulos por lados y por ángulos. Usar suma de ángulos interiores, ángulos suplementarios y opuestos por el vértice.
- Comprender que la distancia de un punto a una recta se mide por el segmento perpendicular, no por un segmento oblicuo cualquiera.
- Usar igualdad de lados y ángulos en triángulos isósceles, congruencia básica, semejanza y el teorema del segmento que une puntos medios de dos lados.
- Usar perímetro, área triangular como base por distancia perpendicular dividido entre dos, razones, fracciones y Pitágoras.
- Distinguir círculo y circunferencia; conocer radio, diámetro, arco y tangente, y que el radio al contacto es perpendicular a la tangente.
- Para la variante de coordenadas: leer un par ordenado, calcular un punto medio y trabajar con números negativos.

**Diagnóstico de entrada.** Proponer cuatro acciones breves: ubicar una perpendicular en una figura girada, señalar un punto medio con marcas de igualdad, elegir la distancia correcta a una recta y clasificar un triángulo obtusángulo. Un error abre un repaso de ese concepto. La variante de coordenadas tiene su propio acceso de repaso.

No se exige conocer ningún centro ni memorizar sus nombres antes de entrar. La idea 1 recupera el segmento medio y la semejanza durante su justificación; no presupone la razón del baricentro.

## 5. Las ideas, en orden

**Orden propuesto:** equilibrio y medianas → igualdad de distancias a vértices → igualdad de distancias a lados → perpendicularidad desde vértices → tangencias exteriores → relaciones entre centros.

**Convenciones para todas las ideas.** Las letras **A, B y C** nombran los tres vértices y no cambian de función. El signo **△** se lee “triángulo”. Una barra sobre dos letras indica el segmento; las mismas letras sin barra indican su longitud. El signo **∠** se lee “ángulo”, y la letra central señala su vértice. La expresión **m(∠...)** se lee “medida del ángulo”. Los signos **°**, **=** y **⊥** se leen “grados”, “igual a” y “perpendicular a”.

La app introduce cada otra letra al aparecer, acompañada por su nombre completo. El listado de símbolos de la sección 6 es para producción, no una tarjeta inicial que el alumno deba memorizar.

**Condiciones comunes de las escenas.** Se trabaja con triángulos planos no degenerados. La interfaz impide que los tres vértices queden alineados. Permite ampliar la vista cuando una construcción sale del triángulo. El acierto se comprueba por las condiciones geométricas, con ajuste accesible del arrastre; no por acertar un píxel. La tolerancia de interacción no debe convertirse en una falsa igualdad matemática.

Las claves y los códigos de error de las predicciones son información del equipo: se revelan al alumno en “Mira”. Ningún formulario nuevo aparece antes de responder la predicción. Después, cada ejercicio ofrece sus datos y un pequeño repertorio de relaciones ya estudiadas, con condiciones de uso; exige elegir y justificar.

### Idea 1. El punto de equilibrio

**Pregunta que responde:** ¿dónde sostener una pieza triangular uniforme para que no se incline?

**Aprendizaje:** el alumno relaciona el equilibrio de una lámina uniforme con la intersección de las medianas y usa su división en dos partes desiguales.

**Objeto de la primera pantalla.** Un recorte triangular de cartulina sobre una mesa escolar, un lápiz y una regla. Es un objeto de manualidades reconocible. Se representa cartulina de espesor y distribución de masa uniformes, sin adornos, pegamento ni pesos añadidos.

**1. Lee — tres tarjetas.**

- “Esta pieza tiene el mismo material y el mismo espesor en toda su superficie.”
- “El apoyo puede moverse bajo la pieza. Si queda mal colocado, la pieza se inclina.”
- “Cada lado tiene un punto medio. Unir una esquina con el punto medio del lado opuesto produce una mediana.”

Las tarjetas no indican dónde está el apoyo correcto ni cómo divide una mediana.

**2. Juega.** El alumno mueve el apoyo y estabiliza dos recortes escalenos diferentes. La meta es mantener cada pieza horizontal al soltarla. El programa comprueba que la vertical del apoyo pase por el centro de masa del modelo uniforme. No muestra medianas, longitudes parciales ni razones.

**3. Predice.** Se presenta un tercer recorte que todavía no se puede equilibrar. Se señala una mediana y se pregunta: “Cuando encontremos el apoyo de equilibrio, ¿cómo repartirá esa mediana, desde la esquina hasta el punto medio?”

| Opción | Clave del equipo | Error asociado |
|---|---|---|
| Los dos tramos tendrán la misma longitud. | Incorrecta. | H-RAZ: traslada la mitad del lado a la mediana. |
| El tramo desde la esquina hasta el apoyo será el doble del tramo restante. | **Correcta.** | — |
| El tramo desde la esquina hasta el apoyo será la mitad del tramo restante. | Incorrecta. | H-RAZ: invierte el orden de la razón. |
| El tramo desde la esquina hasta el apoyo será el triple del tramo restante. | Incorrecta. | H-RAZ: convierte el número de medianas en una proporción. |

**4. Mira.** Aparecen las tres medianas y se marca su cruce, **G**, leído “baricentro”. Solo entonces se muestran los dos tramos. Se repite en un recorte obtusángulo y se gira la pieza. La animación proporciona evidencia; la explicación siguiente justifica la relación.

**5. La regla.** La mediana une un vértice con el punto medio del lado opuesto. Las tres medianas concurren —se cortan en un mismo punto— en el baricentro, que siempre está dentro. Llamamos **M_A**, “eme subíndice A”, al punto medio del lado opuesto a A. Entonces:

\[
AG=2GM_A,\qquad AG=\frac{2}{3}AM_A,\qquad GM_A=\frac{1}{3}AM_A.
\]

Se cumplen relaciones análogas desde B y C. El tramo mayor está junto al vértice. Cada mediana divide el área del triángulo por mitades; las tres juntas forman seis triángulos de igual área, que no tienen por qué ser congruentes. El equilibrio corresponde al baricentro cuando la lámina tiene masa uniformemente distribuida [F12], [F13].

**De dónde sale la razón.** Se unen M_A y M_B, los puntos medios de BC y CA. Ese segmento es paralelo a AB y mide la mitad. Los triángulos formados por G, A, B y por G, M_A, M_B son semejantes: de ahí sale la relación dos a uno. Al repetir la construcción con la tercera mediana, esta pasa por el mismo punto. Las igualdades de áreas se justifican con bases iguales y alturas comunes.

**Variante de coordenadas, después de la regla.** La letra **x** con subíndice identifica la coordenada horizontal del punto indicado; **y**, la vertical. Así, x_A significa “coordenada horizontal de A”.

\[
x_G=\frac{x_A+x_B+x_C}{3},\qquad
y_G=\frac{y_A+y_B+y_C}{3}.
\]

El promedio se obtiene al combinar el punto medio de un lado con la división dos a uno de la mediana; no se presenta como una receta independiente [F14].

**Palabras nuevas, con tres ejemplos cada una.**

| Palabra | Explicación cotidiana | Tres ejemplos |
|---|---|---|
| Mediana | Un camino desde una esquina hasta la mitad exacta del borde de enfrente. | Trazo en una cartulina; hilo sobre una plantilla; marca en un tablero triangular. |
| Baricentro | El lugar en que se encuentran esos tres caminos. | Cruce en el recorte; apoyo del modelo uniforme; punto calculado en un plano con coordenadas. |
| Concurrencia | Varias líneas que pasan por un mismo lugar. | Tres medianas en G; tres caminos dibujados hacia una plaza; tres trazos que atraviesan una misma marca. |

**6. Así se resuelve — guion.** Se proporciona la longitud de GM_A y se pide la mediana completa: identificar que G es baricentro; seleccionar la relación entre sus dos tramos; obtener AG; sumar AG y GM_A; comprobar que el tramo del vértice resulte mayor. El equipo asigna los valores y desarrolla la aritmética.

**7. Ahora tú — progresión.** Reconocer medianas entre trazos distractores → reconstruir una mediana desde uno de sus tramos → relacionar áreas → recuperar una longitud combinando la razón con Pitágoras o semejanza → obtener coordenadas con un vértice deducido por simetría. Este último tipo conecta con el examen UNMSM localizado [F02].

### Idea 2. A la misma distancia de tres esquinas

**Pregunta que responde:** ¿dónde colocar el compás para trazar una circunferencia que pase por tres marcas?

**Aprendizaje:** el alumno distingue igualdad de distancias a puntos y usa mediatrices para encontrar el circuncentro.

**Objeto de la primera pantalla.** Una plantilla de carpintería apoyada sobre un tablero, con tres marcas de perforación y un compás. El objetivo es trazar una guía circular que pase por esas marcas; no se atribuye al taller una necesidad industrial inexistente.

**1. Lee — tres tarjetas.**

- “Las tres marcas representan posiciones diferentes de la plantilla.”
- “Un compás mantiene la misma apertura mientras gira. Su punta y su lápiz tienen funciones distintas.”
- “La punta puede quedar sobre la plantilla o sobre el papel que la rodea. Todavía no sabemos dónde colocarla.”

**2. Juega.** Con un triángulo acutángulo fijo, el alumno mueve la punta y cambia la apertura. La misión es conseguir que la circunferencia pase por las tres marcas. Se comprueban las tres distancias al centro, no solo dos. No se permite transformar todavía la plantilla en obtusángula.

**3. Predice.** Se muestra, sin construcción, una nueva plantilla obtusángula: “¿Dónde quedará la punta del compás para pasar por las tres marcas?”

| Opción | Clave del equipo | Error asociado |
|---|---|---|
| Dentro del triángulo, porque es un centro. | Incorrecta. | H-CEN: obliga a todo centro a ser interior. |
| En el punto medio del lado más largo. | Incorrecta. | H-CEN: elige una mitad visible sin comprobar tres distancias. |
| Fuera del triángulo. | **Correcta.** | — |
| No existirá una circunferencia que pase por las tres marcas. | Incorrecta. | H-EXIST. |

**4. Mira.** Se amplía el papel, se construye el centro exterior y se muestran tres radios iguales. Luego se compara con un triángulo rectángulo y otro acutángulo.

**5. La regla.** La **mediatriz** es la recta perpendicular a un segmento por su punto medio. Sus puntos, y solamente ellos, están a igual distancia de los dos extremos. Las mediatrices de los tres lados concurren en **O**, “circuncentro”. Si **R** significa “circunradio”, la longitud del radio circunscrito:

\[
OA=OB=OC=R.
\]

O está dentro si el triángulo es acutángulo, en el punto medio de la hipotenusa si es rectángulo y fuera si es obtusángulo. Dos mediatrices bastan para localizarlo; la tercera sirve para verificar la construcción. La circunferencia circunscrita pasa por los vértices [F15], [F16].

**Justificación.** La mediatriz de AB impone igualdad entre las distancias a A y B; la de BC, entre B y C. Su intersección satisface las tres igualdades. La propiedad de la mediatriz se demuestra con dos triángulos rectángulos congruentes.

**Relaciones para ejercicios.** Si el ángulo recto está en A, la hipotenusa es BC y R es la mitad de BC. Los triángulos AOB, BOC y COA son isósceles cuando tienen área distinta de cero. Para ejercicios angulares se introduce **α**, “alfa”, como la medida del ángulo interior en A; **β**, “beta”, para B, y **γ**, “gamma”, para C. El ángulo no reflejo BOC satisface:

\[
m(\angle BOC)=
\begin{cases}
2\alpha,&0^\circ<\alpha\leq90^\circ,\\
360^\circ-2\alpha,&90^\circ<\alpha<180^\circ.
\end{cases}
\]

Se justifica con la relación entre el ángulo central y el inscrito que abarcan el mismo arco: al duplicar un ángulo inscrito obtuso se obtiene un ángulo central reflejo; para el no reflejo se resta de una vuelta completa. Esta relación se explica aquí antes de exigirla, con los triángulos isósceles formados por radios [F16].

**Palabras nuevas.**

| Palabra | Explicación cotidiana | Tres ejemplos |
|---|---|---|
| Mediatriz | La línea que cruza un tramo justo por su mitad y a escuadra. | Doblez que superpone dos marcas; trazo entre dos clavos; línea construida sobre un lado. |
| Equidistar | Estar igual de lejos de los lugares que se están comparando. | Una marca a igual distancia de dos clavos; la punta del compás respecto de tres marcas; cualquier punto de una mediatriz respecto de sus extremos. |
| Circuncentro | La posición de la punta del compás para pasar por las tres esquinas. | Centro interior; centro sobre la hipotenusa; centro exterior. |
| Circunferencia circunscrita | El borde circular que pasa por las tres esquinas. | Guía sobre madera; trazo sobre cartulina; construcción en un plano. |

**6. Así se resuelve — guion.** Se da O como circuncentro y dos datos angulares. Marcar radios iguales; identificar los triángulos isósceles; comprobar qué ángulo central se pide; escoger entre suma triangular y relación central–inscrito; obtener el ángulo y verificar si debe ser agudo, obtuso o llano.

**7. Ahora tú.** Identificar una mediatriz por sus dos condiciones → completar radios iguales → localizar O en las tres clases de triángulo → obtener R en un triángulo rectángulo → resolver ángulos mediante radios y arcos → encontrar una longitud combinando igualdad de radios con Pitágoras. No se requieren todavía otros centros.

### Idea 3. Igual separación de los tres bordes

**Pregunta que responde:** ¿dónde cabe una pieza circular que toque los tres lados de un marco triangular?

**Aprendizaje:** el alumno utiliza distancias perpendiculares a lados, bisectrices interiores y tangencias para construir el incentro.

**Objeto de la primera pantalla.** Tres listones sobre una mesa forman un marco triangular. Hay un disco circular que puede cambiar de tamaño. Una moneda de un sol aparece como referencia de escala en una variante de sobremesa; la moneda real conserva su tamaño [F22].

**1. Lee — tres tarjetas.**

- “El disco debe quedar dentro del marco y tocar sus tres bordes.”
- “La separación respecto de un borde se mide a escuadra, no siguiendo una diagonal cualquiera.”
- “Una bisectriz divide la abertura de una esquina en dos ángulos iguales. No tiene por qué partir por la mitad el lado de enfrente.”

**2. Juega.** El alumno desplaza el disco y modifica su radio hasta obtener tres contactos sin atravesar ningún listón. El programa comprueba que el centro esté dentro y que sus tres distancias perpendiculares a las rectas de los lados coincidan con el radio. El juego no dibuja los segmentos que unen el centro con los vértices ni mide sus ángulos.

**3. Predice.** “Si ahora unimos el centro con dos esquinas del marco, ¿cómo será el ángulo que forman esos segmentos en el centro?” Se señala el ángulo no reflejo entre los segmentos hacia B y C.

| Opción | Clave del equipo | Error asociado |
|---|---|---|
| Siempre será agudo. | Incorrecta. | H-ANG: supone que dividir ángulos vuelve agudo el ángulo del cruce. |
| Siempre será recto. | Incorrecta. | H-ANG: confunde bisectrices con rectas perpendiculares. |
| Podrá ser agudo, recto u obtuso según la forma del marco. | Incorrecta. | H-VIS: no reconoce la restricción que imponen las dos bisectrices. |
| Siempre será obtuso. | **Correcta.** | — |

**4. Mira.** Aparecen las bisectrices y el punto **I**, “incentro”. Se mide el ángulo BIC en dos marcos diferentes y se colorean las mitades de los ángulos en B y C. La explicación usa la suma de los ángulos del triángulo BIC.

**5. La regla.** Las tres bisectrices interiores concurren en I, siempre interior. Sus distancias perpendiculares a los tres lados son iguales. Es el centro de la circunferencia inscrita, tangente a los tres lados [F17].

**r**, “inradio”, es su radio. Los puntos **T_A, T_B y T_C** son los contactos con BC, CA y AB, respectivamente. Por tanto:

\[
IT_A=IT_B=IT_C=r.
\]

La propiedad se obtiene comparando los triángulos rectángulos a ambos lados de una bisectriz: comparten la hipotenusa y tienen el mismo ángulo en el vértice. De ahí salen las distancias iguales [F18].

Además:

\[
m(\angle BIC)=90^\circ+\frac{\alpha}{2},\quad
m(\angle CIA)=90^\circ+\frac{\beta}{2},\quad
m(\angle AIB)=90^\circ+\frac{\gamma}{2}.
\]

Por ejemplo, en BIC se resta de 180° la mitad de β y la mitad de γ; se usa después que α, β y γ suman 180°. Esto explica el signo de suma y por qué el resultado es obtuso [F19].

Para longitudes y áreas, **a, b y c** significan las longitudes de BC, CA y AB. **s**, “semiperímetro”, es la mitad del perímetro; **S**, “área del triángulo ABC”, se mide en unidades cuadradas:

\[
s=\frac{a+b+c}{2},\qquad S=rs,\qquad r=\frac{S}{s}.
\]

La relación de área se obtiene sumando las áreas de IBC, ICA e IAB: sus bases son a, b y c y sus alturas son r [F20].

Los dos segmentos tangentes trazados desde un mismo vértice a la inscrita tienen igual longitud. Se justifica con dos triángulos rectángulos que comparten la distancia del vértice a I y tienen radios iguales. En la notación de la unidad:

\[
AT_B=AT_C=s-a,\quad BT_A=BT_C=s-b,\quad CT_A=CT_B=s-c.
\]

Estas expresiones se reconstruyen sumando las parejas que forman los tres lados. No se exige memorizarlas. Tampoco se afirma que I esté a igual distancia de los tres vértices.

**Palabras nuevas.**

| Palabra | Explicación cotidiana | Tres ejemplos |
|---|---|---|
| Bisectriz interior | El camino que sale de una esquina y reparte su abertura en dos partes iguales. | Doblez que superpone los bordes de una esquina; guía en un marco; trazo hacia el interior de un triángulo. |
| Incentro | El lugar desde el que los tres bordes quedan igual de cerca, midiendo a escuadra. | Centro del disco ajustado; centro de una circunferencia inscrita; punto de encuentro de las bisectrices. |
| Inradio | La separación del incentro a cada borde. | Segmento al contacto con BC; segmento al contacto con CA; segmento al contacto con AB. |
| Semiperímetro | La mitad de lo que mide toda la vuelta. | Mitad del contorno del marco; mitad del borde del recorte; mitad del perímetro de una parcela idealizada. |

**6. Así se resuelve — guion.** Se da el ángulo BIC y se pide el ángulo en A: reconocer que el centro es I; seleccionar la relación para BIC; identificar qué ángulo del triángulo queda enfrente; despejar α; comprobar que sea positivo y menor que 180°. Una segunda demostración resuelve el mismo tipo sumando ángulos, para que la fórmula tenga sentido.

**7. Ahora tú.** Distinguir distancia a un lado de distancia a una esquina → reconocer las bisectrices → calcular un ángulo interior o un ángulo en I → obtener un radio desde área y semiperímetro → relacionar tangencias y lados → combinar tangencias, simetría y Pitágoras en un marco isósceles. Este último tipo se vincula con el examen de Medicina Humana consultado [F03].

### Idea 4. Perpendiculares desde las esquinas

**Pregunta que responde:** ¿dónde se encuentran las tres rectas que salen de las esquinas a escuadra del lado opuesto?

**Aprendizaje:** el alumno construye alturas sin depender de la orientación del dibujo y comprende por qué su punto común puede ser exterior.

**Objeto de la primera pantalla.** Una pieza triangular de tablero sobre una mesa de carpintería, acompañada de una escuadra. Se marcan líneas de referencia; no se dice que sean refuerzos estructurales ni que ese punto mejore la resistencia de un techo.

**1. Lee — tres tarjetas.**

- “La escuadra comprueba un ángulo recto aunque giremos la pieza.”
- “Cada esquina tiene enfrente un lado. Podemos continuar la dirección de ese lado sobre el papel de trabajo.”
- “Una altura une una esquina con la recta del lado opuesto, formando un ángulo recto. La recta de esa altura puede prolongarse.”

**2. Juega.** En una pieza acutángula que se puede girar, el alumno coloca tres trazos: cada uno debe pasar por su vértice y ser perpendicular al lado opuesto. La misión exige cumplir las dos condiciones en los tres trazos. Se muestran los cuadrados de ángulo recto. Solo se habilitan formas acutángulas durante este juego.

**3. Predice.** Se presenta una pieza obtusángula nueva, sin alturas dibujadas: “Al continuar las tres rectas de altura, ¿dónde estará su punto común?”

| Opción | Clave del equipo | Error asociado |
|---|---|---|
| Fuera del triángulo. | **Correcta.** | — |
| Dentro, porque se trata de un centro. | Incorrecta. | H-CEN. |
| En la esquina del ángulo obtuso. | Incorrecta. | H-RECT. |
| No habrá punto común, porque algunos segmentos de altura quedan fuera. | Incorrecta. | D-EXT, adaptado: excluye las prolongaciones necesarias. |

**4. Mira.** La cámara se aleja; se trazan las rectas completas y se muestra su cruce exterior. Después aparece una pieza rectángula: dos alturas coinciden con catetos y su cruce está en el vértice recto.

**5. La regla.** Una altura parte de un vértice y termina perpendicularmente sobre la recta que contiene el lado opuesto. El punto donde llega es su **pie**. Las tres rectas que contienen las alturas concurren en **H**, “ortocentro” [F21].

El punto **D_A** es el pie desde A sobre la recta BC; D_B y D_C se definen de forma análoga. Así:

\[
\overleftrightarrow{AD_A}\perp\overleftrightarrow{BC},\quad
\overleftrightarrow{BD_B}\perp\overleftrightarrow{CA},\quad
\overleftrightarrow{CD_C}\perp\overleftrightarrow{AB}.
\]

La flecha doble sobre dos letras se lee “recta que pasa por esos puntos”. En un triángulo rectángulo, dos pies coinciden con el vértice recto; se conservan las tres rectas de altura.

H está dentro en un acutángulo, en el vértice recto en un rectángulo y fuera en un obtusángulo. Todos los triángulos no degenerados tienen tres alturas. Ser altura no exige partir el lado por la mitad [F19], [F21].

**Por qué concurren.** Se dibuja por cada vértice una paralela al lado opuesto. Las tres paralelas forman un triángulo mayor; A, B y C son puntos medios de sus lados. Las rectas de altura originales son mediatrices del triángulo mayor. Por la idea 2, tienen un punto común. Se muestra esta construcción después de la predicción, con una sola capa auxiliar a la vez.

**Relación angular acotada.** En un triángulo **acutángulo**:

\[
m(\angle BHC)=180^\circ-\alpha,
\]

y de forma análoga para los otros dos vértices. Se deriva de las perpendicularidades y de los ángulos suplementarios. **No se aplica automáticamente esta expresión a cualquier dibujo obtusángulo:** allí se identifica primero qué rayos forman el ángulo pedido. Los ejercicios obtusángulos de esta idea se centran en construcción, ubicación y lectura de perpendiculares.

**Palabras nuevas.**

| Palabra | Explicación cotidiana | Tres ejemplos |
|---|---|---|
| Altura | El trayecto a escuadra desde una esquina hasta la línea del borde opuesto. | Interior en una pieza aguda; exterior en una pieza obtusa; coincidente con un cateto. |
| Pie de altura | La marca donde termina ese trayecto sobre la línea del borde. | Marca dentro de un lado; marca sobre su prolongación; marca que coincide con otro vértice. |
| Ortocentro | El cruce de las tres líneas de altura. | Cruce interior; cruce exterior; vértice del ángulo recto. |
| Prolongación | Continuar una línea en la misma dirección, sin doblarla. | Continuar el borde sobre el papel; extender una altura; extender una mediatriz. |

**6. Así se resuelve — guion.** Se da un triángulo acutángulo y el ángulo en A; se pide BHC: traducir “H es ortocentro” en dos perpendicularidades; marcar los ángulos rectos; obtener los ángulos restantes; identificar el suplemento correspondiente; comprobar que el resultado sea obtuso. Se ofrece la fórmula como otra escritura del razonamiento.

**7. Ahora tú.** Reconocer el pie correcto → construir las tres alturas en una figura girada → resolver los casos interior, exterior y coincidente con un cateto → obtener un ángulo en un triángulo acutángulo → combinar una altura con una mediana y Pitágoras, justificando cuándo son trazos distintos y cuándo coinciden.

### Idea 5. El contacto también puede ser exterior

**Pregunta que responde:** ¿qué ocurre si el disco debe tocar un lado por fuera y las prolongaciones de los otros dos?

**Aprendizaje:** el alumno construye un excentro con una bisectriz interior y dos exteriores, y distingue las tres circunferencias exinscritas.

**Objeto de la primera pantalla.** El marco triangular de listones reaparece sobre una mesa mayor. Dos bordes pueden prolongarse con reglas. Un disco se coloca por fuera del tercer lado. Es una actividad de trazado sobre una plantilla, sin atribuirle un uso estructural.

**1. Lee — tres tarjetas.**

- “Ahora el disco quedará fuera del marco y tocará uno de sus lados.”
- “Los otros dos contactos se buscarán en las líneas que continúan los bordes.”
- “Un ángulo interior y su exterior adyacente completan un ángulo llano. También podemos dividir el exterior en dos partes iguales.”

**2. Juega.** Se fija como lado de contacto BC. El alumno mueve el disco y cambia su radio, con el centro en el semiplano opuesto a A respecto de BC. Debe lograr contacto con el segmento BC y con las prolongaciones de AB más allá de B y de AC más allá de C. Se comprueban los tres contactos, su ubicación y que no atraviese las rectas. Durante el juego no se permite elegir otro lado.

**3. Predice.** “Si repetimos la misión eligiendo sucesivamente cada uno de los tres lados, ¿cuántas circunferencias exteriores distintas obtendremos en este triángulo escaleno?”

| Opción | Clave del equipo | Error asociado |
|---|---|---|
| Una, porque cada triángulo tiene un único círculo asociado. | Incorrecta. | H-EXC: traslada la unicidad de la inscrita. |
| Dos, porque en la construcción intervienen dos bisectrices exteriores. | Incorrecta. | H-EXC: confunde el número de rectas usadas con el de centros posibles. |
| Tres. | **Correcta.** | — |
| Infinitas, porque el disco puede deslizarse fuera. | Incorrecta. | H-EXC: no conserva simultáneamente los tres contactos. |

**4. Mira.** Se repite la construcción para cada lado. Se muestra cada circunferencia por separado antes de superponer las tres. Se verifica que cambiar el lado seleccionado cambia cuál es la bisectriz interior utilizada.

**5. La regla.** El **excentro I_A**, leído “i subíndice A”, es la intersección de la bisectriz interior de A y las bisectrices exteriores de B y C. Es el centro de la circunferencia exinscrita opuesta a A, tangente al lado BC y a las prolongaciones de los otros lados. Hay tres excentros, I_A, I_B e I_C, todos exteriores [F18], [F19].

Las bisectrices interior y exterior de un mismo vértice son perpendiculares: dividen por la mitad dos ángulos que suman 180°. Las distancias perpendiculares de I_A a las tres **rectas** de los lados son iguales; no son distancias a los tres segmentos limitados ni a los vértices.

Si **r_a**, “exradio opuesto a A”, es el radio correspondiente:

\[
r_a=\frac{S}{s-a},\quad r_b=\frac{S}{s-b},\quad r_c=\frac{S}{s-c}.
\]

La primera relación procede de sumar las áreas de los triángulos de vértices I_A, A, B y de vértices I_A, A, C, y restar la del triángulo de vértices I_A, B, C. El resultado es S y la distancia perpendicular común a las tres rectas es r_a. Así se obtiene S=r_a(b+c-a)/2=r_a(s-a). En un triángulo válido s-a es positivo [F23].

Para los ángulos no reflejos:

\[
m(\angle BI_AC)=90^\circ-\frac{\alpha}{2},\quad
m(\angle AI_BC)=90^\circ-\frac{\beta}{2},\quad
m(\angle AI_CB)=90^\circ-\frac{\gamma}{2}.
\]

En la primera igualdad se observa el triángulo BI_AC: sus ángulos en B y C son mitades de los exteriores correspondientes. El signo de resta sale de sumar sus tres ángulos [F19]. En un mismo vértice, una bisectriz interior y una exterior forman 90°; si pertenecen a vértices distintos, se dibujan los rayos y se reconstruye el ángulo con la suma triangular. No se ofrece una fórmula sin figura para todos esos casos.

**Palabras nuevas.**

| Palabra | Explicación cotidiana | Tres ejemplos |
|---|---|---|
| Bisectriz exterior | La línea que reparte en dos la abertura que aparece al continuar un borde. | Exterior adyacente en A; exterior adyacente en B; exterior adyacente en C. |
| Excentro | Un lugar exterior desde el que puede trazarse el disco de los tres contactos. | I_A frente a BC; I_B frente a CA; I_C frente a AB. |
| Circunferencia exinscrita | Un borde circular exterior que toca un lado y dos bordes prolongados. | La opuesta a A; la opuesta a B; la opuesta a C. |
| Exradio | La distancia del centro exterior a cada una de las tres líneas que toca. | r_a; r_b; r_c. |

**6. Así se resuelve — guion.** Se proporciona el ángulo BI_AC y se pide el ángulo en A: identificar cuál es el excentro; marcar las dos bisectrices exteriores; seleccionar la relación correcta; despejar α; verificar que BI_AC sea agudo. Después se contrasta con el ángulo BIC de la idea 3 para explicar por qué cambia el signo.

**7. Ahora tú.** Identificar el lado asociado a un excentro → distinguir contacto con lado y con prolongación → calcular ángulos con dos bisectrices exteriores → combinar una bisectriz interior y una exterior con rayos especificados → obtener un exradio desde área y lados → integrar incentro y excentro mediante perpendiculares, ángulos o triángulos rectángulos. Las combinaciones se diseñan con datos suficientes y no con una figura que “parezca” indicar igualdades.

### Idea 6. Elegir el centro y relacionarlos

**Pregunta que responde:** ¿qué centro corresponde a cada encargo y qué relaciones permanecen cuando cambia el triángulo?

**Aprendizaje:** el alumno selecciona centros por condiciones, distingue coincidencia de alineación y utiliza la relación de Euler con sus excepciones.

**Objeto de la primera pantalla.** Una mesa de trabajo con un mismo recorte triangular y cuatro encargos conocidos: equilibrar la pieza, pasar una circunferencia por sus esquinas, ajustar un disco interior y trazar perpendiculares desde los vértices. Los objetos aparecen antes que las construcciones.

**1. Lee — tres tarjetas.**

- “Una misma pieza puede recibir encargos diferentes.”
- “Cada encargo exige comprobar una condición: equilibrio, distancias a esquinas, distancias a bordes o perpendicularidad.”
- “La palabra centro necesita un apellido. Las construcciones ya aprendidas permiten identificar cuál corresponde.”

**2. Juega.** El alumno asigna una construcción a cada encargo y coloca el punto correspondiente. El programa comprueba la condición, además del nombre elegido. Cada construcción se presenta en una pestaña separada: todavía no se superponen los cuatro centros ni se dibuja una recta que los una. La misión termina cuando los cuatro encargos están correctamente resueltos en un triángulo escaleno.

**3. Predice.** “Si reunimos los cuatro resultados sobre la misma pieza y después cambiamos la forma del triángulo, ¿qué afirmación será verdadera?”

| Opción | Clave del equipo | Error asociado |
|---|---|---|
| Circuncentro, baricentro e incentro estarán alineados en cualquier triángulo no equilátero. | Incorrecta. | H-EUL: sustituye el ortocentro por el incentro. |
| Los cuatro centros coincidirán en un mismo punto en cualquier triángulo isósceles. | Incorrecta. | D-COIN: confunde alineación y coincidencia. |
| Circuncentro, baricentro y ortocentro estarán alineados en cualquier triángulo no equilátero. | **Correcta.** | — |
| Incentro, baricentro y ortocentro estarán alineados en cualquier triángulo no equilátero. | Incorrecta. | H-EUL: sustituye el circuncentro por el incentro. |

**4. Mira.** Se superponen O, G, H e I en el triángulo escaleno. Se dibuja la recta por O y H y se verifica que pasa por G. El alumno observa después un isósceles no equilátero y un equilátero. Solo ahora se muestran las distancias sobre la recta.

**5. La regla.** En un triángulo no equilátero, O, G y H están en una misma recta, llamada **recta de Euler**. G queda entre O y H y:

\[
OG:GH=1:2,\qquad OG=\frac{OH}{3},\qquad GH=\frac{2OH}{3}.
\]

Los dos puntos del signo **:** se leen “es a” al expresar una razón. Estas igualdades son relaciones entre longitudes, no instrucciones para memorizar una posición a la izquierda o a la derecha de la pantalla [F24], [F25].

**De dónde sale.** Se recupera la relación de la idea 1: desde G, cada punto medio del lado opuesto queda en dirección contraria a su vértice y a la mitad de distancia. Esa transformación lleva las rectas de altura a las mediatrices correspondientes. Por eso lleva H a O: quedan a lados opuestos de G y sus distancias a G están en razón dos a uno. La animación muestra el giro y la reducción, y la explicación verifica perpendicularidad y punto medio.

En un isósceles, O, G, H e I están sobre su eje de simetría; esto no significa que coincidan. En un equilátero coinciden los cuatro. En ese caso, tres puntos coincidentes no determinan una recta de Euler única. En un escaleno, I no pertenece a la recta de Euler [F17], [F24], [F25].

**Síntesis para elegir, disponible solo después de la predicción.**

| Condición del encargo | Construcción | Punto | Ubicación |
|---|---|---|---|
| Equilibrar una lámina uniforme. | Medianas. | G. | Interior. |
| Estar a igual distancia de tres vértices. | Mediatrices. | O. | Interior, sobre la hipotenusa o exterior, según el triángulo. |
| Estar dentro y a igual distancia de los tres lados. | Bisectrices interiores. | I. | Interior. |
| Cruzar las perpendiculares desde los vértices. | Rectas de altura. | H. | Interior, vértice recto o exterior. |
| Tocar un lado y dos prolongaciones desde fuera. | Una bisectriz interior y dos exteriores. | I_A, I_B o I_C. | Exterior. |

**Ampliación dentro de esta idea: circunferencia de nueve puntos.** Se incluye porque la guía de CEPRE UNI menciona la circunferencia de Euler [F05]. No es necesaria para resolver los ejercicios anteriores. Pasa por los tres puntos medios de los lados, los tres pies de altura y los tres puntos medios de AH, BH y CH. Su centro **N** es el punto medio de OH y su radio **R_9**, leído “radio de la circunferencia de nueve puntos”, es R/2. Algunos de esos puntos pueden coincidir en triángulos especiales [F26], [F27].

**Guion de justificación de la ampliación.** Primero, la reducción a la mitad y en dirección contraria desde G lleva los vértices a los puntos medios de los lados; lleva la circunferencia circunscrita a otra de radio R/2 cuyo centro es N, usando la relación de Euler. Segundo, una reducción a la mitad desde H lleva A, B y C a los puntos medios de AH, BH y CH, y lleva O al mismo N: ambos grupos están en la misma circunferencia. Tercero, el segmento que une M_A con el punto medio de AH tiene punto medio N —se verifica con las relaciones de punto medio y Euler—, por lo que es un diámetro. El pie D_A forma un ángulo recto con sus extremos porque un tramo sigue BC y el otro sigue la altura; por el criterio del ángulo inscrito recto pertenece a esa circunferencia. Se repite desde B y C. Si un pie coincide con un extremo del diámetro, su pertenencia ya está comprobada. Se construyen estas capas sucesivamente; una animación con nueve marcas no sustituye estos argumentos.

**Palabras nuevas.**

| Palabra | Explicación cotidiana | Tres ejemplos |
|---|---|---|
| Colineales | Puntos por los que puede pasar una misma regla recta. | O, G y H; tres marcas sobre un borde; los centros de un isósceles sobre su eje. |
| Recta de Euler | La línea que relaciona tres centros que parecían construcciones separadas. | En un escaleno acutángulo; en un escaleno obtusángulo; en un rectángulo. |
| Contraejemplo | Un caso que basta para mostrar que “siempre” era demasiado. | O exterior frente a “todo centro está dentro”; altura exterior frente a “toda altura es interior”; I fuera de la recta de Euler de un escaleno frente a “los cuatro se alinean”. |
| Circunferencia de nueve puntos | Un mismo borde circular que reúne tres grupos de marcas del triángulo. | Pasa por los puntos medios de los lados; por los pies de altura; por los puntos medios entre vértices y H. |

**6. Así se resuelve — guion.** Se da OH y se pide GH: verificar que el triángulo no sea equilátero; colocar G entre O y H; interpretar la división en tres partes, una para OG y dos para GH; aplicar la relación elegida; comprobar que ambas longitudes sumen OH. Después se gira el dibujo para verificar que el procedimiento no depende de la orientación.

**7. Ahora tú.** Elegir un centro por una condición sin que se dé su nombre → distinguir coincidencia de alineación → completar distancias sobre Euler → evaluar afirmaciones con casos y contraejemplos → combinar un triángulo rectángulo, su circuncentro y la razón de Euler → integrar ángulos de dos centros ya estudiados. En la ampliación: identificar los nueve puntos, obtener N y relacionar su radio con R. El formato de proposiciones conecta con UNI 2023-II [F01].

## 6. Tabla de letras y símbolos de la unidad

| Letra o símbolo | Significado único | Unidad o advertencia |
|---|---|---|
| A, B, C | Vértices del triángulo de referencia. | Sin unidad. No representan números angulares. |
| a, b, c | Longitudes de BC, CA y AB, respectivamente. | mm, cm o m; una sola unidad dentro de cada relación. |
| M_A, M_B, M_C | Puntos medios de BC, CA y AB. | Sin unidad. M no se reutiliza como punto móvil. |
| G | Baricentro. | Sin unidad. No se usa para “gravedad” ni masa. |
| O | Circuncentro. | Sin unidad. Choca con el uso común de O como origen cartesiano: aquí el origen se escribe (0; 0). |
| I | Incentro. | Sin unidad. Debe distinguirse visualmente de 1 y de la ele minúscula. |
| I_A, I_B, I_C | Excentros opuestos a A, B y C. | Sin unidad. El subíndice es indispensable. |
| H | Ortocentro. | Sin unidad. Nunca se usa H para un pie de altura. |
| D_A, D_B, D_C | Pies de las alturas desde A, B y C. | Sin unidad. Pueden estar en prolongaciones o coincidir con vértices. |
| T_A, T_B, T_C | Contactos de la inscrita con BC, CA y AB. | Sin unidad. No se reutilizan para contactos de las exinscritas. |
| N | Centro de la circunferencia de nueve puntos. | Sin unidad. No se usa para “número de puntos”. |
| R | Circunradio. | Longitud. No confundir con r. |
| r | Inradio. | Longitud. |
| r_a, r_b, r_c | Exradios opuestos a A, B y C. | Longitud. |
| R_9 | Radio de la circunferencia de nueve puntos. | Longitud. |
| s | Semiperímetro de ABC. | Longitud. La s de segundos no se introduce en los ejercicios. |
| S | Área del triángulo ABC. | mm², cm² o m². No se usa A para área. |
| α, β, γ | Medidas de los ángulos interiores en A, B y C. | Grados sexagesimales. No se reutilizan como subángulos iguales de otra construcción. |
| x_A, y_A; x_B, y_B; x_C, y_C; x_G, y_G | Coordenadas horizontal y vertical de cada punto indicado. | Misma unidad de longitud que el plano. x e y no se usan además como incógnitas genéricas. |
| △ABC | Triángulo ABC. | No significa área. |
| Segmento con barra; recta con flecha doble | Objeto limitado entre dos puntos; recta completa. | Sin unidad como objetos. |
| AB, AG, OH, etc., sin barra | Longitud del segmento indicado. | Longitud. |
| ∠ABC; m(∠ABC) | Ángulo de vértice B; medida de ese ángulo. | La medida se expresa en grados. La m de “medida” es un operador; m en una cantidad como “2 m” es el símbolo de metro. |
| ⊥; ∥ | Perpendicular; paralelo. | Sin unidad. ∥ se nombra “paralelo” cuando aparezca en la justificación. |
| =; :; / | Igualdad; razón; división. | Una razón entre longitudes en la misma unidad no tiene unidad. |

Los signos de comparación y los números de las fórmulas se leen en palabras al introducirlos. En los problemas nuevos se mantienen estas convenciones. Cuando se muestre una pregunta oficial con otras letras, se explica la correspondencia; no se cambia silenciosamente la función de una letra dentro de la unidad.

## 7. Otras formas de explicarla, con su riesgo

Las propuestas de la última columna son decisiones de diseño. No se atribuye a una fuente una eficacia que no evaluó.

| Representación o experimento | Fuente y uso conveniente | Riesgo conceptual | Cómo corregirlo en la unidad |
|---|---|---|---|
| Equilibrar una lámina triangular sobre un apoyo. | Math Open Reference propone una placa y una punta de lápiz; idea 1 [F12]. | Creer que el baricentro equilibra cualquier objeto triangular, aunque tenga huecos, lastres o densidad variable. | Explicitar el modelo uniforme. Un marco de alambre y una lámina no se intercambian. |
| Doblar papel para superponer dos marcas. | Adaptación original del criterio de equidistancia y la construcción de [F16]; idea 2. | Creer que toda línea de doblez es una mediana. | Nombrar qué se superpone y comprobar punto medio más perpendicularidad. |
| Comparar radios del compás y distancias a esquinas. | Construcción de Euclides, libro IV, proposición 5 [F16]. | Confundir tres vértices con tres lados. | Mantener visibles los extremos de las distancias y después contrastar con la idea 3. |
| Comparar distancias perpendiculares desde una bisectriz. | Euclides, libro IV, proposición 4 [F18]; ideas 3 y 5. | Medir hasta una esquina o hasta el punto del borde que resulte visualmente cómodo. | Mostrar el pie perpendicular y el ángulo recto, además del número. |
| Arrastrar vértices y observar invariantes. | Joya Cetina y Suárez Sotomonte, 2020, experiencia colombiana con GeoGebra [F11]. | Confundir muchos casos observados con una demostración, o conservar propiedades solo por ajustes accidentales. | Separar “observamos” de “justificamos” y hacer explícitas las restricciones. |
| Incluir alturas exteriores y figuras giradas. | Decisión basada en los errores documentados por Gutiérrez y Jaime [F08]; idea 4. | Presentar lo exterior como una excepción que se memoriza. | Construir desde “vértice + perpendicular al lado opuesto”, para todas las orientaciones. |
| Superponer centros de forma gradual. | Applet de Euler de Math Open Reference [F24]; idea 6. | Saturar la pantalla o creer que cercanía significa coincidencia. | Activar una construcción por vez y distinguir igualdad exacta de simple proximidad. |

La experiencia peruana de Palomino Gomez [F30] refuerza la pertinencia de investigar cómo justifican los alumnos las propiedades observadas; su resumen no demuestra que arrastrar figuras, por sí solo, produzca esa comprensión.

No se propone la analogía de una “antena que atiende por igual” sin aclarar que aquí solo se igualan distancias geométricas. Tampoco se presenta el circuncentro como solución automática al menor recorrido, a la mejor cobertura o a la ubicación óptima de un servicio: son otros problemas.

## 8. Datos del mundo, con fuente

Se prefieren objetos pequeños que permitan experimentar. Las dimensiones de los triángulos de juego serán **datos ficticios de diseño**, declarados como tales y comprobados por el equipo. No se atribuyen a una plaza, una escuela o una construcción real.

| Dato comprobado | Fuente | Aplicación y límite |
|---|---|---|
| La moneda peruana de un sol de la ficha consultada tiene diámetro de **25,50 mm**. | BCRP, ficha “Un sol”, cono monetario, sin fecha visible [F22]. | Disco físico para comparar contactos. Para obtener su radio se divide el diámetro entre dos. En el juego, se mueve la moneda o los listones; no se cambia ficticiamente el tamaño de la moneda real. |
| La ficha peruana de ARAUCOPLY Mueblería presenta tableros de **2,44 m × 1,22 m**, con espesores nominales de **9, 12, 15 y 18 mm**. | Arauco, febrero de 2021, especificaciones técnicas, p. 2 [F28]. | Referencia creíble para recortes de taller y escalas de la escena. No demuestra uniformidad perfecta de densidad ni certifica una aplicación estructural. |
| Una presentación comercial peruana de cartulina escolar declara **50 cm × 65 cm**. | Altapel, ficha de producto, sin fecha visible [F29]. | Material para recortes, pliegues y comparación de construcciones. Es la medida de esa presentación, no de todas las cartulinas. |

**Criterios para construir los datos ficticios.** Las longitudes deben formar un triángulo válido; el equipo comprobará sus desigualdades triangulares. Un recorte debe caber en el material elegido. Los círculos deben tener espacio real en la mesa. Una escala de pantalla debe indicar si representa milímetros, centímetros o metros. No se mezclan esos sistemas dentro de una fórmula sin conversión.

## 9. Dudas y decisiones

1. **Frecuencia histórica pendiente.** Hay ejemplos y temarios verificables, pero no una muestra exhaustiva de exámenes. Para obtener frecuencias se necesita fijar años, convocatorias y áreas; reunir los cuadernillos; contar apariciones y distinguir problema principal de uso auxiliar. No se extrapola el conteo del boletín a todos los postulantes.

2. **Procedencia de algunas copias.** Varias fuentes de UNMSM se leyeron en reproducciones de terceros. Se identifica esa situación y el localizador de la pregunta. El documento de UNSAAC está alojado por su Dirección de Admisión. No se trataron títulos automáticos de plataformas de documentos como títulos reales de las obras.

3. **Errores y distractores.** Seis errores de la tabla están documentados en originales; los demás tienen sus etiquetas. Las variantes de razón, de ángulos del incentro, de excentros y de alineación general en Euler no están validadas como respuestas reales de la población objetivo. Son candidatos de diseño, no evidencia empírica. La confusión entre alineación y coincidencia sí tiene un antecedente original, D-COIN. Antes de cerrar los ítems, conviene probarlos con alumnos y recoger sus explicaciones; una opción elegida por adivinación no demuestra una concepción errónea.

4. **Se eligieron seis ideas.** Separar incentro y excentros permite aprender primero la distancia a lados y después introducir exteriores. Euler queda al final porque necesita baricentro, circuncentro y ortocentro. Ninguna actividad anterior lo presupone.

5. **Se incluyeron coordenadas del baricentro como variante.** Existe una pregunta de UNMSM de ese tipo. El dueño del proyecto debe decidir si habilitarla aquí para quienes ya dominan el plano cartesiano o enlazarla desde Geometría analítica. La ruta geométrica principal no depende de esa variante.

6. **La circunferencia de nueve puntos es una ampliación.** Su presencia en CEPRE UNI justifica contemplarla. El dueño debe decidir si se ofrece a todos o en la ruta UNI. Requiere su propia demostración guiada y práctica dentro de la idea 6; no debe convertirse en una tarjeta final cargada de nombres.

7. **Se limita el repertorio de fórmulas.** No se añaden por defecto la distancia entre incentro y circuncentro, fórmulas trigonométricas de radios, teoremas métricos de cevianas ni relaciones avanzadas entre exradios. Tampoco se incluye una unidad de circunferencias inscritas en cuadriláteros. Si un ejercicio futuro los necesita, habrá que incorporar su explicación antes o remitir a la unidad correspondiente.

8. **El formulario forma parte de la enseñanza solicitada.** Los ejercicios ofrecen relaciones y condiciones, pero el alumno decide cuál aplicar. La dificultad de admisión se conserva mediante lectura de figuras, elección de trazos y combinación de propiedades; no se afirma que el examen real entregue esas fórmulas.

9. **La evidencia visual no sustituye una justificación.** Las animaciones sirven para contrastar predicciones; la regla incluye el argumento geométrico. En la producción se deben separar claramente aproximaciones físicas, tolerancias de arrastre e igualdades exactas del modelo.

10. **Revisión de dependencias y de predicciones realizada.**

| Idea | Usa contenidos anteriores | Lo que el juego reserva para la predicción | Correspondencia de distractores |
|---|---|---|---|
| 1. Baricentro | Solo prerrequisitos. | La razón en que se divide una mediana. | Tres variantes H-RAZ. |
| 2. Circuncentro | Solo prerrequisitos; la comparación con G se deja para más tarde. | La ubicación en un obtusángulo. | H-CEN, H-CEN, H-EXIST. |
| 3. Incentro | Lectura de distancias; no necesita el ortocentro. | El ángulo entre segmentos hacia dos vértices. | H-ANG, H-ANG, H-VIS. |
| 4. Ortocentro | Idea 2 para justificar concurrencia. | El cruce de las alturas de un obtusángulo. | H-CEN, H-RECT, D-EXT. |
| 5. Excentros | Idea 3 y ángulos suplementarios. | La cantidad de construcciones al cambiar el lado elegido. | Tres variantes H-EXC. |
| 6. Relaciones | Ideas 1–5; nueve puntos después de explicar Euler. | La alineación y la coincidencia al superponer construcciones. | H-EUL, D-COIN, H-EUL. |

Cada predicción tiene cuatro opciones, una correcta y tres vinculadas a códigos existentes. Las tres tarjetas “Lee” de cada idea no incluyen preguntas ni revelan el resultado que se predice. Los guiones de resolución quedan después de la regla. El equipo que produzca los ejercicios debe recalcular todos los datos y comprobar que cada problema tenga una solución única bajo sus condiciones.

## 10. Fuentes

Las fechas corresponden a la publicación cuando se pudo establecer; **s. f.** significa “sin fecha identificable”. Un año dentro del nombre de una convocatoria no se confunde con el año de realización del examen. No se reproducen problemas, soluciones ni figuras de las academias.

### Exámenes y alcance curricular

- **F01.** Academia Trilce. **2023**. *Solucionario UNI 2023-2: Matemática*, pregunta 29, pp. 10–11. Fuente secundaria para la pregunta de admisión. [PDF del editor](https://www.trilce.edu.pe/storage/static/upload/2438c550-4859-11ee-b564-9157265fbc8d.pdf).
- **F02.** Academia Trilce. **2022**, proceso **UNMSM 2023-I**. *Solucionario San Marcos 2023-I, áreas D y E*, pregunta 37, pp. 15–16; examen del 15 de octubre de 2022. [Índice del editor](https://www.trilce.edu.pe/academia/solucionarios-san-marcos) · [Copia del documento consultada](https://es.scribd.com/document/601464141/Solucionario-Sm-2023-i-Areas-d-e).
- **F03.** Academia Trilce. **2025**, proceso **UNMSM 2026-I**. *Solucionario San Marcos 2026-I: Medicina Humana*, pregunta 36, p. 23. Fuente secundaria para la pregunta de admisión. [PDF del editor](https://www.trilce.edu.pe/storage/static/upload/d294af60-c54c-11f0-b064-11bcb4f2a4cd.pdf).
- **F04.** Universidad Nacional Mayor de San Marcos, Centro Preuniversitario. **2024**. *Material de la semana n.º 7, ciclo 2024-I*, Geometría, ejercicios de clase y propuestos, pp. 25–30. Documento institucional consultado en copia de tercero; la plataforma le asigna un título automático ajeno al nombre del boletín. [Copia consultada](https://es.scribd.com/document/732626528/MPE-SEMANA-N-07-CICLO-ORDINARIO-2024-I).
- **F05.** Universidad Nacional de Ingeniería, CEPRE UNI. **2023**. *Guía del ciclo preuniversitario 2023-2*, Geometría: puntos notables, recta y circunferencia de Euler; séptima página del PDF. [Documento institucional](https://www.cepre.uni.edu.pe/assets/archivos/comunicados/Syl_Pre_PS_2023-2.pdf).
- **F06.** Universidad Nacional Mayor de San Marcos, Oficina Central de Admisión. **2025**. *Reglamento de admisión 2025-II*, temario de Geometría, apartado 8.4, p. 97 impresa. Copia alojada fuera de la universidad. [PDF consultado](https://uniamor.com/pluginfile.php/630/mod_resource/content/1/Reglamento%20Admision%20Universidad%20San%20Marcos%202025%20II.pdf).
- **F07.** Universidad Nacional de San Antonio Abad del Cusco, Dirección de Admisión. **2023**, para procesos **2024**. *Temario de conocimientos por asignaturas para los diferentes procesos de admisión 2024 a la UNSAAC*, Geometría y Trigonometría, apartado 3; aprobado por Resolución CU-384-2023-UNSAAC. [Documento institucional](https://admision.unsaac.edu.pe/wp-content/uploads/2024/03/TEMARIO-GENERAL-2023-.pdf).

### Investigación educativa

- **F08.** Gutiérrez, Ángel, y Jaime, Adela. **1996**. *Uso de definiciones e imágenes de conceptos geométricos por los estudiantes de Magisterio*. En J. Giménez y otros, *El proceso de llegar a ser un profesor de primaria. Cuestiones desde la educación matemática*, pp. 143–170. Comares. Se revisaron especialmente los análisis de errores y las figuras 8–10. [Original alojado por la Universitat de València](https://www.uv.es/angel.gutierrez/archivos1/textospdf/GutJai96.pdf).
- **F09.** Morales Carballo, Armando, y Damián Mojica, Angie. **2021**. *Errores y dificultades acerca de las rectas notables del triángulo. Etapa preliminar para la elaboración de trayectorias de aprendizaje*. UNIÓN, n.º 61, pp. 1–17. [Registro de la revista](https://revistaunion.org.fespm.es/index.php/UNION/article/view/254) · [Texto completo consultado](https://funes.uniandes.edu.co/wp-content/uploads/tainacan-items/32454/1190366/Morales2021Errores.pdf).
- **F10.** Catire Tranca, Rosa. **2024**. *El uso del software GeoGebra en el aprendizaje de puntos notables en los estudiantes del anual UNI de la academia Trilce 2024*. Trabajo de suficiencia profesional, Universidad Nacional del Callao. **Solo se consultó el resumen y los metadatos:** no se presenta como revisión del texto completo. [Registro ALICIA](https://alicia.concytec.gob.pe/vufind/Record/UNAC_b6ee201d844fb436b09b062e431f1de7/Details).
- **F11.** Joya Cetina, Carlos Alberto, y Suárez Sotomonte, Publio. **2020**. *Aprendizaje por descubrimiento en sistemas de puntos y rectas notables del triángulo*. Praxis & Saber, 11(26), e9880. Estudio cualitativo con estudiantes de grado décimo en Tunja, Colombia. [Texto completo](https://revistas.uptc.edu.co/index.php/praxis_saber/article/download/9880/9395) · [DOI](https://doi.org/10.19053/22160159.v11.n26.2020.9880).
- **F30.** Palomino Gomez, Haydee Lucia. **2024**. *Tipos de prueba sobre el baricentro y circuncentro del triángulo que realizan estudiantes de 3er grado de secundaria cuando resuelven una secuencia didáctica con el uso del GeoGebra*. Tesis de maestría, Pontificia Universidad Católica del Perú. Depositada en 2025. **Consulta limitada al resumen original y metadatos; análisis completo pendiente.** [Registro institucional](https://hdl.handle.net/20.500.12404/30274) · [PDF, resumen en p. 5](https://tesis.pucp.edu.pe/bitstreams/941951f2-b570-49bd-a0c9-cafec4fa9cf6/download).
- **F31.** Smith, Katherine. **2017**. *Implementation of Dynamic Geometry Applets to Enhance Student Learning in Online Courses*. Proceedings of the Twenty-ninth Annual International Conference on Technology in Collegiate Mathematics. Se revisó la sección sobre centros y la confusión entre coincidencia y alineación. [Texto completo](https://www.pearson.com/content/dam/one-dot-com/one-dot-com/us/en/files/Katherine%20Smith%20-%20ICTCM_Smith.pdf) · [Año confirmado en el registro institucional de la autora](https://www.odu.edu/directory/katie-smith).

### Fundamento matemático y representaciones

- **F12.** Math Open Reference. **S. f.** *Centroid of a Triangle*. Experimento de equilibrio, medianas y razón dos a uno. [Artículo y applet](https://www.mathopenref.com/trianglecentroid.html).
- **F13.** Weisstein, Eric W. **S. f.** *Triangle Centroid*. MathWorld, Wolfram Research. [Artículo](https://mathworld.wolfram.com/TriangleCentroid.html).
- **F14.** Math Open Reference. **S. f.** *Centroid of a Triangle — Coordinate Geometry*. [Artículo y calculadora](https://www.mathopenref.com/coordcentroid.html). La página contiene un desliz terminológico aislado: dice “orthocenter” en una frase sobre el promedio; la relación usada aquí corresponde al baricentro y se justifica mediante medianas.
- **F15.** Math Open Reference. **S. f.** *The Circumcenter of a Triangle*. [Artículo y applet](https://www.mathopenref.com/trianglecircumcenter.html).
- **F16.** Euclides. **Antigüedad; edición web de David E. Joyce, s. f.** *Elementos*, libro IV, proposición 5, con guía sobre circunferencia circunscrita. Clark University. [Construcción y demostración](https://mathcs.clarku.edu/~djoyce/elements/bookIV/propIV5.html).
- **F17.** Weisstein, Eric W. **S. f.** *Incenter*. MathWorld, Wolfram Research. [Artículo](https://mathworld.wolfram.com/Incenter.html).
- **F18.** Euclides. **Antigüedad; edición web de David E. Joyce, s. f.** *Elementos*, libro IV, proposición 4, con guía sobre circunferencias inscritas y exinscritas. Clark University. [Construcción, demostración y comentarios](https://mathcs.clarku.edu/~djoyce/elements/bookIV/propIV4.html).
- **F19.** Universidad Nacional Federico Villarreal, CEPREVI. **S. f.; copia institucional en directorio de 2018**. *Geometría*, unidad 5, “Triángulos II: Líneas y puntos notables”, pp. 21–24. Se consultan definiciones y relaciones, no se reproducen ejercicios. [PDF institucional](https://www.unfv.edu.pe/ceprevi/images/servicios/ciclos/ciclo_c/2018/Libros/Geometra.pdf).
- **F20.** Weisstein, Eric W. **S. f.** *Inradius*. MathWorld, Wolfram Research. [Artículo](https://mathworld.wolfram.com/Inradius.html).
- **F21.** Math Open Reference. **S. f.** *Orthocenter of a Triangle*. [Artículo y applet](https://www.mathopenref.com/triangleorthocenter.html).
- **F23.** Weisstein, Eric W. **S. f.** *Exradius*. MathWorld, Wolfram Research. [Artículo](https://mathworld.wolfram.com/Exradius.html).
- **F24.** Math Open Reference. **S. f.** *Euler Line*. [Artículo y applet](https://www.mathopenref.com/eulerline.html).
- **F25.** Weisstein, Eric W. **S. f.** *Circumcenter*. MathWorld, Wolfram Research; relaciones entre O, G y H. [Artículo](https://mathworld.wolfram.com/Circumcenter.html).
- **F26.** Weisstein, Eric W. **S. f.** *Nine-Point Circle*. MathWorld, Wolfram Research. [Artículo](https://mathworld.wolfram.com/Nine-PointCircle.html).
- **F27.** Weisstein, Eric W. **S. f.** *Nine-Point Center*. MathWorld, Wolfram Research. [Artículo](https://mathworld.wolfram.com/Nine-PointCenter.html).

### Objetos y medidas

- **F22.** Banco Central de Reserva del Perú. **S. f.** *Un sol — Cono monetario*. Ficha de diámetro y características de la moneda. [Ficha institucional](https://www.bcrp.gob.pe/docs/Billetes-Monedas/Cono-Monetario/Cono-Monetario-1-00.pdf).
- **F28.** Arauco. **2021, febrero**. *ARAUCOPLY Mueblería — Ficha técnica para Perú*. Dimensiones y espesores, p. 2. [PDF del fabricante](https://arauco.com/peru/wp-content/uploads/sites/22/2021/02/02_3850_PDF_WEB_PERU_FICHA_TECNICA_ARAUCOPLY_MUEBLERIA_01Feb_21.pdf).
- **F29.** Altapel. **S. f.** *Cartulina escolar, tamaño 50 × 65 cm, color blanco*. Se usa únicamente la dimensión declarada del producto. [Ficha comercial](https://altapel.com.pe/product/cartulina-escolar-tamano-50-x-65cm-medida-50-x-65cm-g-140gr-color-blanco/).


[F01]: https://www.trilce.edu.pe/storage/static/upload/2438c550-4859-11ee-b564-9157265fbc8d.pdf
[F02]: https://es.scribd.com/document/601464141/Solucionario-Sm-2023-i-Areas-d-e
[F03]: https://www.trilce.edu.pe/storage/static/upload/d294af60-c54c-11f0-b064-11bcb4f2a4cd.pdf
[F04]: https://es.scribd.com/document/732626528/MPE-SEMANA-N-07-CICLO-ORDINARIO-2024-I
[F05]: https://www.cepre.uni.edu.pe/assets/archivos/comunicados/Syl_Pre_PS_2023-2.pdf
[F06]: https://uniamor.com/pluginfile.php/630/mod_resource/content/1/Reglamento%20Admision%20Universidad%20San%20Marcos%202025%20II.pdf
[F07]: https://admision.unsaac.edu.pe/wp-content/uploads/2024/03/TEMARIO-GENERAL-2023-.pdf
[F08]: https://www.uv.es/angel.gutierrez/archivos1/textospdf/GutJai96.pdf
[F09]: https://funes.uniandes.edu.co/wp-content/uploads/tainacan-items/32454/1190366/Morales2021Errores.pdf
[F10]: https://alicia.concytec.gob.pe/vufind/Record/UNAC_b6ee201d844fb436b09b062e431f1de7/Details
[F11]: https://revistas.uptc.edu.co/index.php/praxis_saber/article/download/9880/9395
[F12]: https://www.mathopenref.com/trianglecentroid.html
[F13]: https://mathworld.wolfram.com/TriangleCentroid.html
[F14]: https://www.mathopenref.com/coordcentroid.html
[F15]: https://www.mathopenref.com/trianglecircumcenter.html
[F16]: https://mathcs.clarku.edu/~djoyce/elements/bookIV/propIV5.html
[F17]: https://mathworld.wolfram.com/Incenter.html
[F18]: https://mathcs.clarku.edu/~djoyce/elements/bookIV/propIV4.html
[F19]: https://www.unfv.edu.pe/ceprevi/images/servicios/ciclos/ciclo_c/2018/Libros/Geometra.pdf
[F20]: https://mathworld.wolfram.com/Inradius.html
[F21]: https://www.mathopenref.com/triangleorthocenter.html
[F22]: https://www.bcrp.gob.pe/docs/Billetes-Monedas/Cono-Monetario/Cono-Monetario-1-00.pdf
[F23]: https://mathworld.wolfram.com/Exradius.html
[F24]: https://www.mathopenref.com/eulerline.html
[F25]: https://mathworld.wolfram.com/Circumcenter.html
[F26]: https://mathworld.wolfram.com/Nine-PointCircle.html
[F27]: https://mathworld.wolfram.com/Nine-PointCenter.html
[F28]: https://arauco.com/peru/wp-content/uploads/sites/22/2021/02/02_3850_PDF_WEB_PERU_FICHA_TECNICA_ARAUCOPLY_MUEBLERIA_01Feb_21.pdf
[F29]: https://altapel.com.pe/product/cartulina-escolar-tamano-50-x-65cm-medida-50-x-65cm-g-140gr-color-blanco/
[F30]: https://hdl.handle.net/20.500.12404/30274
[F31]: https://www.pearson.com/content/dam/one-dot-com/one-dot-com/us/en/files/Katherine%20Smith%20-%20ICTCM_Smith.pdf
