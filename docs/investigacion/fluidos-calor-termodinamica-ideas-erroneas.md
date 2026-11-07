# Ideas erróneas en fluidos, calor y termodinámica

4 de noviembre de 2026 · Tarea 4 de `CLAUDE.md`, quinto tema de física (sigue a [lentes](optica-ideas-erroneas.md), [espejos](optica-espejos-esfericos.md), [cinemática](cinematica-ideas-erroneas.md) y [dinámica](dinamica-ideas-erroneas.md))

Para qué sirve: cubre las semanas 10 a 13 del sílabo CEPRE-UNI 2026-2. Son tres bloques: fluidos (presión, vasos comunicantes, Pascal, Arquímedes), temperatura y calor (equilibrio, dilatación, calorimetría, cambios de fase, transferencia) y termodinámica (gases ideales, primera ley, ciclos, Carnot, segunda ley). Este documento junta los errores documentados para escribir las predicciones de sus plantillas.

## Resumen en cinco líneas

1. **Fluidos tiene datos fuertes, casi todos de un mismo grupo**: la tesis doctoral de Loverude (Universidad de Washington, 1999), con cientos de universitarios **después** de la enseñanza. El error más grande es de vasos comunicantes: entre el 50 % y el 70 % de los alumnos de primer año dibuja el agua **más baja en el tubo ancho** de un tubo en U.
2. **Arquímedes casi no se entiende con la enseñanza tradicional.** Solo el 20 % de 371 universitarios acertó dónde quedan cinco bloques del mismo tamaño y distinta masa al soltarlos bajo el agua. Entre el 40 % y el 45 % cree que el bloque más pesado recibe **más empuje**, aunque los dos tienen el mismo volumen.
3. **En calor y temperatura, el error de fondo es que cada material "tiene su temperatura"**: el metal es frío y la lana es caliente. En Panamá, solo el 5 % de 241 futuros profesores dijo que una placa de madera y una de aluminio, en la misma aula, marcan la misma temperatura. En Sídney, entre el 30 % y el 48 % de los universitarios de primer año cree que agregar energía **siempre** sube la temperatura (ignora el calor latente).
4. **En termodinámica, casi nadie usa la primera ley.** En una compresión adiabática, solo el 10 % de 179 universitarios predijo que la temperatura sube, y casi ninguno lo explicó con el trabajo. En otro grupo, el 40 % razonó que "el aislante mantiene la temperatura". En Iowa, solo el 15 % de 653 alumnos usó bien la primera ley en un problema con diagrama P-V.
5. Los errores de cálculo propios del examen (usar °C en Carnot o en las leyes de los gases, invertir la razón de áreas en la prensa hidráulica, olvidar el calor latente en la mezcla) **no tienen estudios con porcentaje**. Van como hipótesis, aunque varios son la cara numérica de errores documentados.

## De dónde salen los datos

Casi todo el respaldo de fluidos y de la primera ley viene de una sola fuente que sí pude abrir completa: **la tesis doctoral de Michael Loverude (1999)**, dirigida por Lillian McDermott. Los artículos del American Journal of Physics que el encargo menciona (Loverude, Kautz y Heron 2002 y 2003; Heron y otros 2003; Loverude, Heron y Kautz 2010) publican esa misma investigación, pero no pude abrirlos. La tesis está escaneada; leí como imagen los capítulos 2, 3, 6 y 8. **Las cifras de este informe son las de la tesis**, no las de los artículos, que pueden haber cambiado.

Las demás fuentes leídas completas:

- **Goszewski, Moyer, Bazan y Wagner (2012)** y **Wagner, Carbone y Lindow (2013)**: preguntas de opción múltiple sobre presión y empuje en tres cursos de Grove City College (Estados Unidos), antes y después de la enseñanza.
- **Meltzer (2001)**: 653 alumnos de física con cálculo en Iowa State, primera ley con diagrama P-V. Es el antecedente del artículo de 2004 que pide el encargo, que no pude abrir.
- **Wattanakasiwich, Taleab, Sharma y Johnston (2013)**: encuesta TCS en Australia y Tailandia, más de 2000 respuestas. Varias preguntas son adaptaciones de las de Kautz y otros (2005) sobre gases ideales.
- **Georgiou y Sharma (2010)**: diagnóstico de calor y temperatura a 858 universitarios de primer año en Sídney, al inicio del curso.
- **Jara Guerrero (1991)**, México: 113 estudiantes de primer año de preparatoria. **Rodríguez y Díaz-Higson (2012)**, Panamá: 241 futuros profesores. Son las dos fuentes latinoamericanas que encontré con porcentajes.
- **Brown y Singh (2021)** y **Smith, Christensen, Mountcastle y Thompson (2015)**: primera y segunda ley, Carnot y entropía.

## Catálogo con respaldo

### Presión, vasos comunicantes y barómetro

Salvo que se diga otra cosa, son datos de la tesis de Loverude (1999), recogidos **después** de la enseñanza estándar de hidrostática en cursos universitarios de Estados Unidos.

| # | Idea errónea | Lo correcto | Qué tan frecuente | Fuente |
| --- | --- | --- | --- | --- |
| F1 | **El agua queda más baja en el tubo ancho.** En un tubo en U con una rama más ancha, el lado ancho "pesa más" o "tiene más superficie para que el aire empuje", así que su nivel baja. | Los dos niveles quedan a la misma altura: en la superficie libre, la presión es la atmosférica en ambos lados. | Nivel más bajo en el tubo ancho: 50 % de 236 (álgebra, Washington), 70 % de 138 (Harvard, solo lectura), 55 % de más de 1000 (Purdue), 20 % de 98 (segundo año). El 10 % de una sección de segundo año lo dijo **justo después** de ver la demostración. | Loverude (1999), tabla 2-4 |
| F2 | **La presión depende del peso de lo que hay encima** ("weight-above"). Más líquido encima, o un líquido más pesado encima, da más presión, aunque las paredes del recipiente también empujen. | En un mismo líquido en reposo, la presión solo depende de la profundidad: P = P₀ + ρgh. La forma del recipiente no importa. | Barómetros con varios líquidos: 30 % de 17 y 40 % de 39 alumnos de segundo año. Recipiente con tres secciones (pregunta 3-shape): eligieron la opción "más agua encima", 29–51 % antes de la enseñanza y 5–42 % después, según el curso. | Loverude (1999), tabla 2-2; Goszewski y otros (2012), tabla 2 |
| F3 | **Encerrado, más presión.** Un punto bajo una tapa, en una zona estrecha o "rodeado de más paredes" tiene más presión. | Si está a la misma profundidad en el mismo líquido conectado, la presión es la misma. | Pregunta 3-shape: 36–52 % antes de la enseñanza y 6–26 % después. Debajo de un objeto que flota: 13–25 % antes. | Goszewski y otros (2012), tabla 3 |
| F4 | **La h se mide mal.** Se toma h hasta el techo o la pared que está justo encima del punto, o a lo largo del tubo curvo. | h es la distancia **vertical** hasta la superficie libre del líquido. | Medir h hasta lo que está encima: 24–32 % de todos los cursos antes de la enseñanza; 28–34 % en el curso conceptual después. Tubo en U con una rama tapada: solo 20 % (109, álgebra), 25 % (138) y 40 % (más de 1000) comparó bien las presiones. | Goszewski y otros (2012), tabla 2; Loverude (1999), tabla 2-1 |
| F5 | **Dos líquidos al mismo nivel tienen la misma presión, o más en el más denso.** | Se compara solo dentro de un mismo líquido conectado. Con dos líquidos, hay que ir sumando ρgh tramo por tramo, como en un manómetro. | "Más presión en el líquido más denso": 20 % de 120, 60 % de 95, 40 % de 94 y 60 % de 182. Respuesta correcta: solo entre 15 % y 40 %. En un examen parcial, 1 de 23 alumnos acertó con razonamiento correcto. | Loverude (1999), tabla 3-4 |
| F6 | **El aire encerrado sobre la columna del barómetro está a la presión atmosférica, o a más**, porque "la columna está en equilibrio" o "el aire está comprimido". | Arriba de la columna la presión es menor que la atmosférica: la columna de mercurio la sostiene la diferencia. | Correcto: 40 % de 170, 65 % de 903, 45 % de 182 y 65 % de 155. "Mayor que la atmosférica": 35 %, 15 %, 20 % y 20 %. "Igual": 20 %, 20 %, 35 % y 10 %. | Loverude (1999), tabla 3-3 |
| F7 | **La presión es igual en todo el líquido** ("el agua es incompresible", o el principio de Pascal mal leído: "la presión es uniforme"). | El principio de Pascal dice que un **cambio** de presión se transmite a todo el líquido; la presión sigue creciendo con la profundidad. | Poco frecuente: cerca de 5 % (10 % en un curso de 120). En Grove City, 3–5 % antes; 9–15 % después en el curso conceptual. | Loverude (1999), tabla 3-1; Goszewski y otros (2012) |
| F8 | **La presión crece con la altura** (h medido hacia arriba en P = P₀ + ρgh). | Crece hacia abajo. | 10 % en tres cursos (311, 120 y 138 alumnos); cerca de 5 % en segundo año. | Loverude (1999), tabla 3-2 |
| F9 | **La presión tiene dirección**: un globo en el fondo de una piscina se aplana o se estira. | La presión actúa igual en todas las direcciones; el globo se achica parejo. | Hasta 30 % después de la enseñanza (4–15 % en cada opción). Correcto: entre 41 % y 72 %. | Goszewski y otros (2012) |

### Empuje y flotación (principio de Arquímedes)

| # | Idea errónea | Lo correcto | Qué tan frecuente | Fuente |
| --- | --- | --- | --- | --- |
| F10 | **Más masa, más empuje.** Dos bloques del mismo tamaño, sumergidos por completo, reciben empujes distintos según su masa. | El empuje depende del volumen sumergido y de la densidad del líquido, no de la masa del cuerpo. | Mismo volumen y distinta masa, a la misma profundidad: el más pesado recibe más empuje, alrededor de 40–45 % de 201 alumnos de primer año (la tabla dice 45 %, el texto "cerca de 40 %") y 15 % de 37 de segundo año. Correcto: 25 % y 55 %. | Loverude (1999), tabla 6-3 |
| F11 | **Cada bloque busca "su" profundidad de equilibrio.** Cinco bloques del mismo tamaño y distinta masa, soltados bajo el agua, quedan escalonados: el más pesado, más abajo ("línea descendente"). | Solo hay tres destinos: flotar, quedar en el fondo o, si su densidad es exactamente la del agua, quedar a media agua. | Solo 20 % de 371 alumnos de primer año acertó, y 55 % de 55 de segundo año. Casi todos los que fallaron dibujaron la línea descendente. Con o sin enseñanza previa, los resultados fueron "prácticamente idénticos". En entrevistas, 6 de 12 dieron esta respuesta y no la cambiaron. | Loverude (1999), tabla 6-1 |
| F12 | **El empuje crece con la profundidad** (porque crece la presión, o por la "columna de agua encima"). | Para un cuerpo totalmente sumergido, el empuje no depende de la profundidad. Lo que crece es la presión sobre cada cara, pero la diferencia entre abajo y arriba es la misma. | Dos bloques iguales a distinta profundidad: 25 % (201) y 25 % (37) dijeron que el más hondo recibe más empuje. Correcto: 40 % y 50 %. | Loverude (1999), tablas 6-4 y 6-5 |
| F12b | **El hilo del bloque más hondo tiene más tensión "por el agua de encima".** | Con el empuje igual a cualquier profundidad, la tensión del hilo es la misma. | En la misma pregunta de F12, entre 30 % y 50 % lo dijo. | Loverude (1999), tablas 6-4 y 6-5 |
| F13 | **El que flota más alto tiene más empuje.** Un cubo que sobresale más del líquido "está siendo empujado más". | Dos cubos iguales que flotan tienen el mismo empuje: igual a su peso. Flota más alto el que está en el líquido más denso. | Dos cubos iguales en líquidos distintos: 55 % eligió "más empuje en el que flota más alto"; 25 % "más empuje en el más sumergido", sin mirar la densidad del líquido. Correcto: cerca de 20 % (curso de álgebra en Maryland, tamaño de muestra no visto en las páginas leídas). Además, más del 30 % dijo que un bloque que flota recibe el mismo empuje que uno igual sumergido entero. | Loverude (1999), sección 6.2.3 |
| F14 | **El volumen desalojado depende de la masa** del cuerpo, no de su volumen sumergido. | Un cuerpo sumergido entero desaloja su propio volumen. | Dos bloques del mismo tamaño (aluminio y bronce): cerca de 20 % dijo que el más pesado sube más el nivel del agua. Además, 5–10 % se contradijo entre dos preguntas iguales. | Loverude (1999), sección 6.3.2 |
| F15 | **En el fondo no hay empuje.** | El empuje existe aunque el cuerpo toque el fondo (salvo que no haya líquido debajo). | 9–18 % según el curso. Otras ideas, como "el empuje depende de cuánta agua hay en el tanque" o "un bloque más plano recibe más empuje", aparecieron en menos del 13 %. | Wagner, Carbone y Lindow (2013) |

**Lo que se aprende del catálogo.** Loverude muestra que casi todos los errores de Arquímedes son errores de **dinámica** que reaparecen en otro contexto. Cerca del 30 % dibujó una fuerza neta distinta de cero sobre un bloque en reposo, y muchos ligaron la fuerza a la **posición** del cuerpo (F11, F13), como en el modelo de ímpetu (ver D1 en [dinámica](dinamica-ideas-erroneas.md)). En presión, muchos no ven que las paredes del recipiente empujan al líquido (F1, F2), igual que en dinámica no ven que la mesa empuja (D6). Para el laboratorio: la escena de flotación tiene que mostrar el diagrama de fuerzas del bloque, y la escena de presión, las fuerzas de las paredes.

### Temperatura, calor y equilibrio térmico

| # | Idea errónea | Lo correcto | Qué tan frecuente | Fuente |
| --- | --- | --- | --- | --- |
| Q1 | **Cada material tiene su temperatura.** El metal y el mármol son "fríos", la lana es "caliente", aunque todo lleve horas en la misma habitación. | En equilibrio térmico, todo está a la misma temperatura. El metal **se siente** más frío porque conduce mejor el calor que sale de la mano. | Placas de madera y aluminio en la misma aula: solo 5 % dijo que marcan igual; 77 % dijo que distinto (241 futuros profesores, Panamá). Mayólicas del baño y tapete: correcto solo 6 % (248), 15 % (479), 33 % (131) y 60 % de segundo año; "las mayólicas están más frías", 41–44 % en primer año (Sídney). | Rodríguez y Díaz-Higson (2012), ítem 17; Georgiou y Sharma (2010), pregunta 7 |
| Q2 | **El metal está más frío siempre**, aun en un ambiente más caliente que el cuerpo. | Si el ambiente está a 43 °C, el metal se siente **más caliente** que la madera: conduce más calor hacia la mano. | Un cubo de hielo se derrite antes sobre madera: 48 % de 113 escolares. Antes sobre metal: 40 %, pero solo 5 % habló de conducción. "El metal siempre se sentirá más frío": 24 %. | Jara Guerrero (1991), México |
| Q3 | **El recipiente y su contenido están a temperaturas distintas.** | Lo que estuvo horas en la refrigeradora está todo a la temperatura de la refrigeradora. | 27 %, 32 %, 20 % y 13 % en los cuatro grupos de Sídney. | Georgiou y Sharma (2010), pregunta 2 |
| Q4 | **La temperatura depende de la cantidad.** Más agua hirviendo marca más (o menos) temperatura; un cubito más grande está a otra temperatura. | La temperatura no depende de la cantidad. La cantidad decide cuánto calor hace falta para cambiarla. | Dos ollas hirviendo, una con el doble de agua: solo 26 % dijo "igual"; 34 % "mayor en la que tiene más agua" y 26 % "menor". Dos cubitos del congelador, uno el doble del otro: 57 % acertó; 15 % dijo que difieren. | Rodríguez y Díaz-Higson (2012), ítems 15 y 16 |
| Q5 | **El frío se transfiere.** El frío pasa de la lata a la mesa. | Lo que pasa es calor, de la mesa a la lata. | 39 % (248), 21 % (479), 3 % (131) y 6 % (segundo año). | Georgiou y Sharma (2010), pregunta 3 |
| Q6 | **El calor es una sustancia que el cuerpo tiene y que se conserva.** Calor y temperatura son lo mismo, o el calor es una propiedad del cuerpo. | El calor es energía **en tránsito** por una diferencia de temperatura. Lo que el cuerpo tiene es energía interna. | "El calor se conserva": 15 % de 134 universitarios que respondieron una pregunta abierta, antes del curso. "El calor es una magnitud" (algo que se tiene y se mide): 31 % de 241 en Panamá. Georgiou y Sharma la llaman "dominante en todos los grupos", sin un porcentaje único. | Brown y Singh (2021), tabla 2; Rodríguez y Díaz-Higson (2012), ítem 14; Georgiou y Sharma (2010) |

### Cambios de fase y calorimetría

| # | Idea errónea | Lo correcto | Qué tan frecuente | Fuente |
| --- | --- | --- | --- | --- |
| Q7 | **Agregar energía siempre sube la temperatura.** Se ignora el calor latente. | Durante un cambio de fase, la temperatura no cambia aunque entre calor. | 30 % (248), 48 % (479), 42 % (131) y 20 % (segundo año). Correcto: entre 32 % y 71 %. En México, ningún estudiante mencionó que la temperatura se mantiene constante al hervir o congelarse (113 escolares). | Georgiou y Sharma (2010), pregunta 8; Jara Guerrero (1991) |
| Q8 | **El hielo está a 0 °C; el agua no puede estar a 0 °C.** | El hielo del congelador está bajo cero. A 0 °C pueden coexistir hielo y agua líquida. | Hielo del congelador a 0 °C: 42 %, 39 %, 17 % y 19 %. "El agua no puede tener 0 °C": 32 % y 25 % en primer año. En México, ninguno de 15 entrevistados aceptó agua líquida a 0 °C. | Georgiou y Sharma (2010), preguntas 1 y 4; Jara Guerrero (1991) |
| Q9 | **El agua siempre hierve a 100 °C**, o sigue calentándose después de hervir. | El punto de ebullición baja con la presión (en la sierra, menos de 100 °C). Mientras hierve, la temperatura no sube. | "Siempre hierve a la misma temperatura": 44 % (248) y 34 % (479). "Sigue subiendo después de hervir": 19 % (479) y 25 % (segundo año). El vapor está más caliente que el agua que hierve: 35 % en México. | Georgiou y Sharma (2010), pregunta 6; Jara Guerrero (1991) |
| Q10 | **Todo se enfría al mismo ritmo**, sin importar cuánto más caliente está que el ambiente. | Lo más caliente se enfría más rápido al principio (ley de enfriamiento de Newton). | 32 % (248), 29 % (479), 8 % y 10 %. | Georgiou y Sharma (2010), pregunta 9 |

### Dilatación y transferencia de calor

| # | Idea errónea | Lo correcto | Qué tan frecuente | Fuente |
| --- | --- | --- | --- | --- |
| Q11 | **El agujero de una placa se achica al calentarla.** | Se agranda: la placa se dilata como una ampliación fotográfica, agujero incluido. | Documentada como "muy conocida"; sin porcentaje en las fuentes leídas. Solo leí el resumen. | Vidak, Odžak y Mešić (2018), resumen |
| Q12 | **Las nubes "tapan" el aire** y por eso las noches nubladas son más templadas. | Las nubes absorben y reemiten la radiación infrarroja de la Tierra. | Correcto: solo 9 %, 10 %, 15 % y 23 %; sin una opción errónea dominante. | Georgiou y Sharma (2010), pregunta 12 |

En conducción, convección y radiación no encontré más datos con porcentaje. El mismo estudio de Sídney trae dos preguntas abiertas (por qué el agua a 15 °C se siente más fría que el aire a 15 °C, y por qué soplar el té lo enfría), pero las clasifica por nivel de razonamiento, no por idea errónea.

### Gases ideales

| # | Idea errónea | Lo correcto | Qué tan frecuente | Fuente |
| --- | --- | --- | --- | --- |
| T1 | **Más temperatura, más presión, siempre.** El gas de una jeringa con émbolo libre aumenta su presión al calentarse. | Si el émbolo se mueve libre, la presión la fija el equilibrio del émbolo y no cambia: lo que crece es el volumen (Charles). | "La presión aumenta": 38 % de 349 universitarios australianos después del tema y 24 % de 314 tailandeses antes. Correcto: 42 % y 53 %. | Wattanakasiwich y otros (2013), pregunta 9, adaptada de Kautz y otros (2005) |
| T2 | **El cilindro más caliente tiene más presión**, aunque todos los émbolos sean iguales y estén en equilibrio. | Émbolos iguales en equilibrio: la misma presión en todos los cilindros, sin importar el gas ni la temperatura. | 57 % y 48 % (mismos grupos). Correcto: 30 % y 33 %. Agregar "en equilibrio mecánico" al enunciado no ayudó. | Wattanakasiwich y otros (2013), pregunta 12 |
| T3 | **Razonar con PV = nRT moviendo dos variables y dejando fija la tercera sin motivo** ("baja el volumen, sube la presión, entonces sube la temperatura"). | En una compresión hay que usar la primera ley; la ecuación de estado sola no dice qué pasa con T. | Razonamiento incorrecto con la ley de los gases: entre 10 % y 70 % según el curso (70 % en 262 alumnos de física con cálculo en Maryland). | Loverude (1999), tabla 8-4 |

### Primera ley, trabajo y ciclos

| # | Idea errónea | Lo correcto | Qué tan frecuente | Fuente |
| --- | --- | --- | --- | --- |
| T4 | **Aislado = la temperatura no cambia.** En una compresión rápida en un cilindro aislado, "la chaqueta aislante mantiene el calor adentro", así que T no cambia. | Aislado quiere decir Q = 0, no ΔT = 0. El trabajo sobre el gas aumenta su energía interna y su temperatura. | Compresión adiabática (179 alumnos de álgebra después del tema): solo 10 % predijo que T sube, y casi 0 % lo explicó con el trabajo. Razonamiento basado en el aislante: 40 % de 103. "Casi la mitad" dijo que T no cambia. En la encuesta TCS, "no cambia": 15 % y 25 %. | Loverude (1999), tablas 8-3 y 8-4; Wattanakasiwich y otros (2013), pregunta 16 |
| T5 | **El trabajo no depende del camino.** Dos procesos con los mismos estados inicial y final hacen el mismo trabajo. | El trabajo es el área bajo la curva en el diagrama P-V; cambia con el camino. | W₁ = W₂: 25 % (186), 26 % (188) y 35 % (279) en Iowa. Más del 25 % en una sección de segundo año en Washington; 45 % en una versión de opción múltiple en otra universidad. | Meltzer (2001), tabla I; Loverude (1999), sección 8.6.2 |
| T6 | **El calor no depende del camino** (se lo trata como una función de estado, igual que la energía interna). | Q = ΔU + W. Con igual ΔU y distinto W, el calor también es distinto. | Q₁ = Q₂: 31 %, 43 % y 41 %; de ellos, 20–23 % lo justificó diciendo que "el calor no depende del camino". Más de un tercio de los que acertaron el trabajo igual dijo Q₁ = Q₂. Solo 15 % de los 653 usó bien la primera ley. | Meltzer (2001), tabla II |
| T7 | **Más presión, más calor.** | El calor depende del proceso completo, no de la presión. | 12 %, 7 % y 8 %. | Meltzer (2001), tabla II |
| T8 | **Todo el calor absorbido se vuelve energía interna**, aunque el gas se expanda (proceso isobárico). Se olvida el trabajo. | ΔU = Q − W. Si el gas se expande, parte del calor se va como trabajo. | Un gas absorbe x J a presión constante: "la energía cinética de las moléculas sube exactamente x J", 42 % (Australia, después del tema) y 29 % (Tailandia, antes). Correcto ("sube menos de x J"): 38 % y 23 %. | Wattanakasiwich y otros (2013), pregunta 21 |
| T9 | **Confundir el trabajo hecho por el gas con el hecho sobre el gas** (el signo). | En una compresión, el entorno hace trabajo positivo sobre el gas; el gas, trabajo negativo. | Opción con el signo cambiado: 41 % y 35 %. En entrevistas, los alumnos tratan el signo como "una convención que no recuerdan". | Wattanakasiwich y otros (2013), pregunta 20; Loverude (1999), sección 8.6.2 |
| T10 | **En un ciclo, el trabajo neto y el calor neto son cero**, porque el gas vuelve a su estado inicial. | En un ciclo, solo ΔU = 0. El trabajo neto es el área encerrada y el calor neto es igual al trabajo neto. | Trabajo neto cero: 47 % (Australia) y 18 % (Tailandia). Calor neto cero en otro ciclo: 49 % y 24 %. Meltzer (2004) lo reporta en entrevistas, según el resumen de Dreyfus y otros (2014). | Wattanakasiwich y otros (2013), preguntas 26, 29 y 30; Dreyfus y otros (2014) |
| T11 | **En un proceso isotérmico no hay calor**, porque la temperatura no cambia. | En una expansión isotérmica el gas absorbe calor, y lo convierte entero en trabajo. | "No hay transferencia de calor": 51 % y 40 %. El texto del artículo llama a esta opción con otra letra; el número es el de la tabla. | Wattanakasiwich y otros (2013), pregunta 23 |
| T12 | **La primera ley es "la energía se conserva", sin calor.** | La primera ley dice cómo cambia la energía interna por calor **y** por trabajo. | Antes del curso, 52 % dijo "la energía se conserva" y solo 5 % incluyó el calor (134 de 207 alumnos de álgebra, Pittsburgh). | Brown y Singh (2021), tabla 2 |
| T13 | **Batir o rozar no calienta.** | El trabajo de rozamiento aumenta la energía interna. | Leche batida en la licuadora: solo poco más de la mitad predijo que se calienta; 15 % "no cambia" y 18 % "se enfría". En cambio, 98 % sabe que el taladro se calienta. | Jara Guerrero (1991) |

### Máquinas térmicas, Carnot y segunda ley

| # | Idea errónea | Lo correcto | Qué tan frecuente | Fuente |
| --- | --- | --- | --- | --- |
| T14 | **No ver que una máquina "mejor que Carnot" es imposible**, o no ligar Carnot con la segunda ley. | Ninguna máquina entre dos focos supera la eficiencia de Carnot: si lo hiciera, la entropía del universo bajaría. | Alumnos de los últimos años de la carrera de física: menos del 20 % (11 de 64) lo reconoció; menos del 30 % (19 de 64) razonó bien que, tras un ciclo de Carnot, la entropía del universo no cambia. | Smith y otros (2015) |
| T15 | **No aplicar la segunda ley para juzgar si una máquina o refrigerador propuesto es posible.** | Se compara la eficiencia propuesta con 1 − T_C/T_H (en kelvin). | "Muchos estudiantes", en cursos introductorios y avanzados; sin porcentaje en las fuentes leídas. | Cochran y Heron (2006), citado por Smith y otros (2015) |

**Una cifra de contexto.** En la encuesta STPFaSL (primera y segunda ley), los universitarios de física introductoria pasaron de 29–30 % a 37 % después de la enseñanza tradicional (507 alumnos con cálculo y 382 con álgebra). La ganancia normalizada fue de 0,10 a 0,11, menos de la mitad de lo que la PUCP logró en mecánica (ver [dinámica](dinamica-ideas-erroneas.md)). Fuente: Brown y Singh (2021), tabla 3.

**Lo que se aprende del catálogo.** Los errores de termodinámica tienen dos raíces. La primera es confundir **estado** con **proceso**: el alumno extiende a Q y a W la idea correcta de que ΔU no depende del camino (T5, T6, T10). La segunda es la "reducción funcional", que el artículo de la TCS toma de Rozier y Viennot (1991): ante varias variables, el alumno se queda con una sola (T1 a T4, Q4). Para el laboratorio, esto pide escenas donde se vean **a la vez** las tres flechas de la primera ley (calor que entra, trabajo que sale, cambio de energía interna) con su color, y donde el diagrama P-V pinte el área del trabajo mientras el émbolo se mueve.

## Lo que no tiene respaldo (todavía)

Errores de cálculo típicos de examen y de academia. No encontré estudios que los midan; varios son la versión numérica de un error documentado.

| Error que suponemos | Error conceptual del que sale |
| --- | --- |
| Prensa hidráulica: F₂ = F₁ ("la presión se transmite, entonces la fuerza también") | F7: no separar presión de fuerza |
| Prensa hidráulica: usar la razón de diámetros en vez de la razón de áreas (olvidar elevar al cuadrado) | Ninguno; error de fórmula |
| Prensa hidráulica: creer que el émbolo grande sube lo mismo que baja el chico | No usar la conservación del volumen (F14 es pariente) |
| Sumar o no sumar P₀: confundir presión absoluta y manométrica | F6 |
| Medir h desde el fondo del recipiente | F4, F8 (en Grove City, 8–16 % eligió una opción así, pero no estaba diseñada para medirlo) |
| Fracción sumergida invertida: ρ_líquido/ρ_cuerpo en vez de ρ_cuerpo/ρ_líquido, o dar la fracción que sobresale | Wagner y otros (2013) describen la idea "volumen desalojado = parte que sobresale", pero su porcentaje solo está en un gráfico |
| Mezcla con hielo: promedio simple de temperaturas | Q4: ignorar las masas |
| Mezcla con hielo: olvidar el calor latente, o la etapa de calentar el hielo hasta 0 °C | Q7 |
| Mezcla con hielo: no revisar si alcanza el calor para fundir todo (dar una temperatura final bajo 0 °C o sobre la inicial) | Q7, Q8 |
| Dilatación: usar α para un área o un volumen (en vez de 2α o 3α) | Q11 |
| Gay-Lussac, Charles o Carnot con temperaturas en °C | Ninguno documentado; muy frecuente en material de academia |
| Trabajo isobárico como P·V en vez de P·ΔV | T5 |
| Primera ley con la convención de química (ΔU = Q + W) mezclada con la de física | Meltzer (2001) lo vio en algunos alumnos ("error de signo": 4 %) |
| Creer que una máquina sin rozamiento llega al 100 % | T14, T15 |

Se confirman igual que en los otros temas: con hojas resueltas en la prueba del pase 2 y con predicciones de respuesta abierta.

## Propuesta para las plantillas

**Una regla para todas las plantillas de este bloque.** Cada escena dibuja las fuerzas o las energías con su agente, como en dinámica. En fluidos: las fuerzas de las paredes sobre el líquido, el peso y el empuje del cuerpo. En termodinámica: tres flechas fijas por color, Q (entra o sale), W (el émbolo empuja o es empujado) y ΔU (un termómetro o una barra de energía interna). Esto ataca F1, F2, F11, F13, T4, T8 y T9 a la vez.

### Presión hidrostática y vasos comunicantes

**Problema guiado.** Tres recipientes abiertos, de formas distintas (uno ancho, uno estrecho y uno con una sección tapada), llenos de agua hasta 2 m de profundidad. g = 10 m/s².

Predicción: *¿en cuál es mayor la presión del agua en el fondo?*

| Opción | Error que representa | Respaldo |
| --- | --- | --- |
| a) En el ancho, porque tiene más agua encima | F2, "peso de encima" | Documentado: 29–51 % antes de la enseñanza |
| b) En el de la sección tapada, porque está encerrado | F3 | Documentado: 36–52 % antes |
| c) En el estrecho, porque las paredes están más cerca | Distancia a las paredes | Documentado como opción, menos frecuente (hasta 40 % en una pregunta de varias respuestas, menos de 10 % en preguntas de una sola respuesta) |
| d) Igual en los tres: 20 000 Pa sobre la atmosférica | Correcta | — |

**Segunda predicción (vasos comunicantes).** Un tubo en U con una rama el doble de ancha que la otra. Se agrega agua por la rama angosta. *¿Dónde queda el nivel en la rama ancha?* Opciones: más bajo, porque esa agua pesa más (F1, 50–70 %); más alto, porque cabe más; igual (correcta); depende de cuánta agua se echó. Es la predicción con el error más frecuente de todo el informe.

**Explorador.** Se arrastra la forma del recipiente y la profundidad del punto; un manómetro, amarrado por color a la h de la fórmula, marca siempre lo mismo a la misma profundidad. Un segundo modo pone dos líquidos en el tubo en U (agua y mercurio) y muestra cómo se suma ρgh tramo por tramo (F5). Un tercer modo, el barómetro de Torricelli, deja abrir una burbuja de aire arriba de la columna (F6).

### Principio de Pascal (prensa hidráulica)

**Problema guiado.** Émbolos de 0,01 m² y 0,5 m². Se aplica 200 N en el chico.

Predicción: *¿cuánta fuerza sale en el émbolo grande?* Opciones: 200 N, "la presión se transmite" (hipótesis, sale de F7); 10 000 N (correcta); 4 N, razón de áreas invertida (hipótesis); 1 400 N, razón de diámetros en vez de áreas (hipótesis; con estas áreas, la razón de diámetros es √50 ≈ 7,07, así que da 200 · 7,07 ≈ 1 414 N). **Ninguna de las tres opciones erróneas tiene estudio.** Es la predicción con menos respaldo del informe; conviene medirla en el pase 2 antes de fijarla.

**Explorador.** Al bajar 0,5 m el émbolo chico, el grande sube 1 cm. Las dos barras de trabajo (F·d) quedan iguales: 100 J. Esto muestra que la prensa no "crea" energía.

### Empuje y flotación

**Problema guiado.** Dos bloques del mismo tamaño (0,5 L), uno de 2 kg y otro de 1 kg, sostenidos por hilos y sumergidos por completo en agua, a la misma profundidad.

Predicción: *¿cuál recibe más empuje?*

| Opción | Error que representa | Respaldo |
| --- | --- | --- |
| a) El de 2 kg, porque pesa más | F10 | Documentado: 40–45 % en primer año |
| b) El de 1 kg, porque es "más flotante" | F10, al revés: empuje como "flotabilidad" | Hipótesis: F10 no trae cifra para la versión inversa (el 15 % es del error directo en segundo año y el 25 % son aciertos; corregido el 7 nov 2026) |
| c) Los dos igual: 5 N | Correcta | — (solo 25 % de primer año acierta) |
| d) Ninguno: los hilos los sostienen | Empuje ligado a otras fuerzas | Documentado como categoría (Wagner y otros, 2013); su porcentaje solo está en un gráfico |

**Segunda predicción (flotación).** El mismo cubo de madera flota en agua y en aceite. *¿En cuál recibe más empuje?* Opciones: en el agua, donde flota más alto (F13, 55 %); en el aceite, donde se hunde más y desaloja más (F13, 25 %); igual, porque en ambos el empuje es igual al peso (correcta, cerca de 20 %); depende de la forma del cubo.

**Explorador.** El escenario de los cinco bloques de Loverude: el alumno arrastra cada bloque a la posición que predice, suelta, y la escena muestra su diagrama de fuerzas mientras se mueve. Así se ve que la "línea descendente" (F11) no puede quedar en reposo. Un control de densidad del bloque muestra la fracción sumergida en tiempo real (ρ_bloque/ρ_líquido).

### Temperatura y equilibrio térmico

**Problema guiado.** Un aula a 20 °C, de noche. Sobre la mesa hay una placa de aluminio, un bloque de madera y una chompa de lana, cada uno con un termómetro.

Predicción: *¿qué marcan los termómetros?*

| Opción | Error que representa | Respaldo |
| --- | --- | --- |
| a) El aluminio, menos de 20 °C; la lana, más de 20 °C | Q1 | Documentado: 77 % en Panamá; 41–44 % en primer año de Sídney |
| b) Los tres, 20 °C | Correcta | — (solo 5 % en Panamá) |
| c) El aluminio, menos; los otros dos, 20 °C | Q1, versión parcial | Documentado como categoría (Jara Guerrero, 1991) |
| d) Depende del tamaño de cada objeto | Q4 | Documentado: 15 % con los cubitos de hielo |

**Explorador.** Una mano virtual toca cada objeto: la escena muestra la flecha de calor que **sale** de la mano, más gruesa en el aluminio. Un control sube el aula a 43 °C y la flecha se invierte (Q2).

### Calorimetría con cambio de fase

**Problema guiado.** 50 g de hielo a −10 °C se echan en 200 g de agua a 50 °C. c del agua = 1 cal/g°C, c del hielo = 0,5 cal/g°C, calor latente de fusión = 80 cal/g. Sin pérdidas.

Predicción: *¿cuál es la temperatura final?*

| Opción | Error que representa | Respaldo |
| --- | --- | --- |
| a) 39 °C | Olvida el calor latente | Q7: 30–48 % cree que agregar energía siempre sube la temperatura (la versión numérica es hipótesis) |
| b) 23 °C | Correcta | — |
| c) 20 °C, el promedio de −10 y 50 | Ignora las masas (Q4) | Hipótesis |
| d) 0 °C, porque queda hielo | No revisa si alcanza el calor | Hipótesis; se apoya en Q8 |

**Explorador.** Una barra de calor dividida en tramos de color: calentar el hielo hasta 0 °C (250 cal), fundirlo (4000 cal) y calentar el agua de deshielo. Junto a ella, la gráfica temperatura-calor con su meseta a 0 °C. Al subir la masa de hielo, la escena encuentra el punto en que ya no todo se funde y la temperatura final se queda en 0 °C.

### Primera ley en un proceso isobárico

**Problema guiado.** Un gas en un cilindro con émbolo libre, a 2 × 10⁵ Pa, recibe 10 000 J de calor y se expande de 0,01 m³ a 0,03 m³.

Predicción: *¿cuánto cambia su energía interna?*

| Opción | Error que representa | Respaldo |
| --- | --- | --- |
| a) 10 000 J, todo el calor | T8: olvida el trabajo | Documentado: 42 % (Australia) y 29 % (Tailandia) |
| b) 14 000 J | T9: suma el trabajo con el signo cambiado | Documentado como error de signo (35–41 % en una pregunta parecida) |
| c) 6 000 J | Correcta | — |
| d) 0 J, porque la presión no cambió | Reducción funcional: una sola variable | Hipótesis |

**Explorador.** El diagrama P-V pinta el área del trabajo mientras el émbolo sube. Un control cambia el proceso (isobárico, isotérmico, isocórico, adiabático) y las tres flechas Q, W y ΔU cambian de tamaño. En el isotérmico, ΔU = 0 y la flecha de calor no desaparece (T11). En el adiabático, Q = 0 y la temperatura sí cambia (T4).

**Predicción corta (compresión adiabática).** Un cilindro aislado; se empuja rápido el émbolo. *¿Qué pasa con la temperatura?* Opciones: no cambia, porque está aislado (T4: 40 % razonó así en un grupo de 103); sube, por el trabajo hecho sobre el gas (correcta; solo 10 %); baja; sube solo porque sube la presión, por PV = nRT (T3). La última opción es "correcta por la razón equivocada"; la escena pide justificar.

### Máquinas térmicas y Carnot

**Problema guiado.** Una máquina térmica trabaja entre 227 °C y 27 °C y recibe 1000 J por ciclo.

Predicción: *¿cuál es la eficiencia máxima posible?*

| Opción | Error que representa | Respaldo |
| --- | --- | --- |
| a) 88 %, con 1 − 27/227 | Temperaturas en °C | Hipótesis |
| b) 40 %, con 1 − 300/500 | Correcta | — |
| c) 60 %, con T_C/T_H | Invierte la fórmula | Hipótesis |
| d) 100 %, si no hay rozamiento | T14, T15 | Documentado como dificultad, sin porcentaje en introductorios |

**Explorador.** Un ciclo de Carnot en el diagrama P-V con el área del trabajo neto pintada. Un control mueve T_C; otro deja escribir una máquina "propuesta" (Q_H, W, Q_C) y la escena dice si viola la primera ley, la segunda o ninguna (T15). En el modo "ciclo", se ve que el gas vuelve al estado inicial pero el trabajo neto y el calor neto no son cero (T10).

## Casos de prueba propuestos

Verificados con fracciones exactas en Python (`fractions.Fraction`). Van al `casos.json` de cada plantilla cuando se construya. Unidades SI salvo calorimetría (cal, g, °C). g = 10 m/s², densidad del agua 1000 kg/m³, c del agua 1 cal/g°C, c del hielo 0,5 cal/g°C, calor latente de fusión 80 cal/g.

| Plantilla | Caso | Entrada | Salida esperada |
| --- | --- | --- | --- |
| Presión | Presión hidrostática | agua, h = 2 m, P₀ = 10⁵ Pa | P manométrica = 20 000 Pa; P absoluta = 120 000 Pa |
| Presión | Fondo de 5 m | agua, h = 5 m, P₀ = 10⁵ Pa | P absoluta = 150 000 Pa |
| Presión | Barómetro de mercurio | ρ = 13 600 kg/m³, h = 0,76 m | P₀ = 103 360 Pa |
| Presión | Tubo en U con agua y mercurio | columna de agua de 0,272 m | desnivel del mercurio = 0,02 m |
| Pascal | Prensa hidráulica | A₁ = 0,01 m², A₂ = 0,5 m², F₁ = 200 N, el émbolo chico baja 0,5 m | F₂ = 10 000 N; el grande sube 0,01 m; trabajo 100 J en ambos lados |
| Arquímedes | Bloque que flota | madera ρ = 600 kg/m³, V = 0,002 m³, en agua | fracción sumergida = 3/5; empuje = peso = 12 N |
| Arquímedes | Mismo bloque, sumergido entero con un hilo | igual | empuje = 20 N; tensión del hilo = 8 N |
| Arquímedes | Mismo bloque en aceite | ρ_aceite = 800 kg/m³ | fracción sumergida = 3/4; empuje = 12 N (igual que en agua) |
| Arquímedes | Dos bloques de igual volumen | V = 0,0005 m³ cada uno, masas 2 kg y 1 kg, sumergidos | empuje = 5 N en ambos |
| Calorimetría | Mezcla con fusión completa | 50 g de hielo a −10 °C + 200 g de agua a 50 °C | calor para llevar el hielo a agua a 0 °C = 4250 cal; T final = 23 °C (sin calor latente daría 39 °C) |
| Calorimetría | Fusión parcial | 100 g de hielo a 0 °C + 200 g de agua a 20 °C | se funden 50 g; T final = 0 °C |
| Dilatación | Varilla de acero | L = 10 m, α = 1,2 × 10⁻⁵ /°C, ΔT = 50 °C | ΔL = 0,006 m |
| Gases | Charles (émbolo libre) | V₁ = 2 L, T de 300 K a 450 K | V₂ = 3 L; P no cambia |
| Gases | Gay-Lussac (recipiente rígido) | P₁ = 1 atm, de 27 °C a 127 °C | P₂ = 4/3 atm (con °C daría 127/27 ≈ 4,70 atm) |
| Primera ley | Proceso isobárico | P = 2 × 10⁵ Pa, V de 0,01 a 0,03 m³, Q = 10 000 J | W = 4000 J; ΔU = 6000 J (para gas monoatómico, ΔU = (3/2)PΔV = 6000 J y Q = (5/2)PΔV = 10 000 J: consistente) |
| Ciclos | Ciclo rectangular | P entre 10⁵ y 3 × 10⁵ Pa, V entre 0,001 y 0,003 m³ | W neto = 400 J; ΔU = 0; Q neto = 400 J |
| Carnot | Eficiencia | T_H = 500 K (227 °C), T_C = 300 K (27 °C), Q_H = 1000 J | η = 2/5 = 40 %; W = 400 J; Q_C = 600 J (con °C daría 200/227 ≈ 88,1 %) |

## Huecos y siguientes pasos

- **Los artículos del American Journal of Physics no los pude abrir.** Loverude, Kautz y Heron (2002 y 2003), Heron y otros (2003), Kautz y otros (2005, partes I y II), Loverude, Heron y Kautz (2010), Meltzer (2004), Cochran y Heron (2006) y Yeo y Zadnik (2001) están tras suscripción. La tesis de Loverude cubre la mayor parte de los de 2002, 2003 y 2010; los demás los leí solo a través de otros. Si Gerson consigue copias, los anoto en `fuentes/por-conseguir.md` y completo, sobre todo, los porcentajes de Kautz (gases ideales) y de Meltzer 2004 (ciclos).
- **El Thermal Concept Evaluation (TCE).** De Yeo y Zadnik solo leí la ficha de PhysPort: más de 1000 alumnos de secundaria y universidad en Australia y Corea, ganancia normalizada de 0,30 en la universidad. Los porcentajes por pregunta, incluida la del metal y la madera, no los vi. La pregunta 7 de Georgiou y Sharma (mayólicas y tapete) es equivalente y sí tiene datos.
- **Lewis y Linn (1994) y Erickson (1979, 1980).** Solo los vi citados: Lewis y Linn encontraron, en entrevistas, la creencia de que los metales y la lana tienen propiedades térmicas "activas". Sin porcentajes leídos.
- **Dilatación, convección y radiación** casi no tienen datos con porcentaje en lo que leí. La idea del agujero que se achica (Q11) está documentada, pero solo leí el resumen.
- **Pascal y la prensa hidráulica no tienen estudio.** Es el hueco más importante para la plantilla, porque es un problema clásico del examen de admisión. Hay que medirlo en el pase 2.
- **No hay datos peruanos.** Las dos fuentes latinoamericanas (México 1991, Panamá 2012) son de escolares y futuros profesores, no de postulantes. Las revistas en español y portugués (Enseñanza de las Ciencias, Revista Eureka, Latin American Journal of Physics Education, Revista Brasileira de Ensino de Física) merecen una búsqueda más larga; en esta pasada no encontré en ellas estudios de fluidos o termodinámica con porcentajes.
- **Cuidado con las poblaciones.** Casi todas las cifras son de universitarios de Estados Unidos, Australia y Tailandia, muchas **después** de la enseñanza. En la encuesta TCS, el grupo tailandés respondió **antes** del tema y el australiano después. Los porcentajes sirven para elegir distractores, no para predecir cuánto fallará un postulante peruano.

## Fuentes

Leídas completas:

- [Loverude (1999), *Investigation of student understanding of hydrostatics and thermal physics and of the underlying concepts from mechanics*, tesis doctoral, Universidad de Washington](http://hdl.handle.net/1773/9736). Escaneada; leí como imagen los capítulos 2, 3, 6 y 8 (presión, gradiente de presión, Arquímedes, primera ley).
- [Goszewski, Moyer, Bazan y Wagner (2012), *Exploring student difficulties with pressure in a fluid*, PERC 2012, AIP Conf. Proc. 1513, 154–157](https://www.compadre.org/portal/items/detail.cfm?ID=12797).
- [Wagner, Carbone y Lindow (2013), *Exploring student difficulties with buoyancy*, PERC 2013, doi:10.1119/perc.2013.pr.077](https://www.compadre.org/portal/items/detail.cfm?ID=13152). Los porcentajes de su figura 2 son un gráfico y no se pudieron leer; uso solo los del texto.
- [Meltzer (2001), *Student reasoning regarding work, heat, and the first law of thermodynamics in an introductory physics course*, PERC 2001](https://www.compadre.org/portal/items/detail.cfm?ID=4347).
- [Wattanakasiwich, Taleab, Sharma y Johnston (2013), *Development and implementation of a conceptual survey in thermodynamics*, International Journal of Innovation in Science and Mathematics Education 21(1), 29–53](https://openjournals.library.sydney.edu.au/CAL/article/view/6459). Fuente de los datos tipo Kautz y otros (2005).
- [Georgiou y Sharma (2010), *A report on a preliminary diagnostic for identifying thermal physics conceptions of tertiary students*, International Journal of Innovation in Science and Mathematics Education 18(2), 32–51](https://openjournals.library.sydney.edu.au/CAL/article/view/4700).
- [Jara Guerrero (1991), *Calor y temperatura. Esquemas alternativos en estudiantes de preparatoria*, Revista Mexicana de Física 37, 688–696](https://rmf.smf.mx/ojs/index.php/rmf/article/download/4271/4225/6812).
- [Rodríguez y Díaz-Higson (2012), *Concepciones alternativas sobre los conceptos de energía, calor y temperatura de los docentes en formación del Instituto Pedagógico en Santiago, Panamá*, Actualidades Investigativas en Educación 12(3), 1–26](https://revistas.ucr.ac.cr/index.php/aie/article/view/10293).
- [Brown y Singh (2021), *Development and validation of a conceptual survey instrument to evaluate introductory physics students' understanding of thermodynamics*, arXiv:2102.07302](https://arxiv.org/abs/2102.07302).
- [Smith, Christensen, Mountcastle y Thompson (2015), *Identifying student difficulties with entropy, heat engines, and the Carnot cycle*, Phys. Rev. ST Phys. Educ. Res. 11, 020116](https://arxiv.org/abs/1508.04104).
- [Dreyfus, Geller, Meltzer y Sawtelle (2014), *Resource Letter TTSM-1: Teaching thermodynamics and statistical mechanics*, arXiv:1407.5533](https://arxiv.org/abs/1407.5533). Bibliografía comentada; de aquí salen los resúmenes de Meltzer (2004), Kautz y otros (2005) y Lewis y Linn (1994).

Solo resumen, ficha o cita secundaria:

- [Yeo y Zadnik (2001), *Introductory thermal concept evaluation*, The Physics Teacher 39, 496–504](https://www.physport.org/assessments/TCE). Leí solo la ficha de PhysPort.
- Meltzer (2004), *Investigation of students' reasoning regarding heat, work, and the first law of thermodynamics in an introductory calculus-based general physics course*, American Journal of Physics 72, 1432–1446. A través de Dreyfus y otros (2014) y de Wattanakasiwich y otros (2013).
- Loverude, Kautz y Heron (2002), *Student understanding of the first law of thermodynamics: Relating work to the adiabatic compression of an ideal gas*, American Journal of Physics 70, 137–148. Su contenido está en la tesis de 1999.
- Loverude, Kautz y Heron (2003), *Helping students develop an understanding of Archimedes' principle. I*, American Journal of Physics 71, 1178–1187; Heron, Loverude, Shaffer y McDermott (2003), parte II, 1188–1195. Su contenido de investigación está en la tesis.
- Loverude, Heron y Kautz (2010), *Identifying and addressing student difficulties with hydrostatic pressure*, American Journal of Physics 78, 75–85. Su contenido está en la tesis.
- Kautz, Heron, Loverude y McDermott (2005), *Student understanding of the ideal gas law*, partes I y II, American Journal of Physics 73, 1055–1071. A través de Wattanakasiwich y otros (2013).
- Cochran y Heron (2006), *Development and assessment of research-based tutorials on heat engines and the second law of thermodynamics*, American Journal of Physics 74, 734–741. A través de Smith y otros (2015).
- Lewis y Linn (1994), *Heat energy and temperature concepts of adolescents, adults, and experts*, Journal of Research in Science Teaching 31, 657–677. A través de Dreyfus y otros (2014).
- Erickson (1979, 1980) y Erickson y Tiberghien (1985), sobre calor y temperatura en niños. Solo la referencia.
- Vidak, Odžak y Mešić (2018), sobre dilatación de objetos con agujeros, Research in Science & Technological Education, doi:10.1080/02635143.2018.1551200. Solo el resumen.
