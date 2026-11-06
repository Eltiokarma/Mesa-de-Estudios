# Ideas erróneas en dinámica (fuerza y leyes de Newton)

4 de noviembre de 2026 · Tarea 4 de `CLAUDE.md`, cuarto tema (sigue a [lentes](optica-ideas-erroneas.md), [espejos](optica-espejos-esfericos.md) y [cinemática](cinematica-ideas-erroneas.md))

Para qué sirve: dinámica es el siguiente bloque de física después de las cuatro plantillas de la fase 1. Comprende el diagrama de cuerpo libre, el plano inclinado, las poleas y el equilibrio. Este documento junta los errores documentados para escribir sus predicciones.

## Resumen en cinco líneas

1. Dinámica es el tema **más estudiado** de toda la investigación en enseñanza de la física. El instrumento estándar es el *Force Concept Inventory* (FCI), de Hestenes, Wells y Swackhamer (1992), con una taxonomía de unas 30 ideas erróneas.
2. **Hay un estudio peruano.** La PUCP aplicó el FCI a 4535 alumnos entre 2009 y 2011 (Castillo, Moscoso, Phan y Quiroz, 2013). Sus alumnos de Física 1 **ya aprobaron la admisión** y aun así entran con 14,6 de 30 respuestas correctas (49 %). Después de un semestre de enseñanza tradicional salen con 18,0. Calculado con sus propios datos, eso da una ganancia normalizada de 0,23, exactamente el promedio de la enseñanza tradicional en el estudio de Hake (1998).
3. El estudio de la PUCP muestra además que **la nota del curso no mide los conceptos**. El 18 % de los aprobados terminó el semestre con *menos* respuestas correctas que al empezar. El tema que menos mejoró fue la segunda ley de Newton (alrededor de 2 puntos porcentuales).
4. Casi todos los errores salen de un modelo de fondo, el de "ímpetu": el movimiento necesita una fuerza que lo mantenga, y esa fuerza se gasta. En 478 universitarios, solo el 17 % razonaba de forma newtoniana antes del curso (Halloun y Hestenes, 1985).
5. Los errores de cálculo propios del examen (N = mg en el plano inclinado, T = mg en poleas, el roce estático siempre igual a μN) **no tienen estudios con porcentaje**. Quedan como hipótesis, aunque son consecuencias directas de errores conceptuales documentados.

## Lo que dice el estudio de la PUCP

Es el único dato peruano que encontré en los cuatro temas, y vale la pena detallarlo porque habla directamente del público del laboratorio.

| Grupo | Respuestas correctas en el FCI (de 30) |
| --- | --- |
| Curso de nivelación, al final del semestre (468 alumnos) | 14 |
| Física 1, al inicio (539 alumnos con entrada y salida) | 14,6 |
| Física 1, al final | 18,0 |
| Física 2 y Física 3, al inicio | 18 |
| Electrónica, ya sin cursos de mecánica | 18 |

- **El techo es 18 de 30 (60 %).** Después de Física 1, el puntaje no sube más, ni con dos cursos más de física. Según Hestenes y Halloun, un puntaje cerca del 60 % marca la entrada al pensamiento newtoniano; los alumnos de la PUCP se quedan justo en la puerta.
- **Por temas:** en la nivelación, lo mejor contestado fue cinemática, primera ley y tercera ley; lo peor, movimiento circular y segunda ley. En Física 1, la segunda ley mejoró apenas alrededor de 2 puntos; el diagrama de cuerpo libre y el movimiento circular, alrededor de 20.
- **Nota y concepto no van juntos.** De 539 alumnos, 70 aprobaron con ganancia negativa (el 18 % de los aprobados) y 93 desaprobaron pese a haber mejorado. La correlación entre la nota y la ganancia es casi nula (R² = 5 %).

**Para el laboratorio** esto tiene dos lecturas. La primera: el postulante promedio que **ingresa** a una universidad exigente todavía no razona como Newton, así que hay mucho margen. La segunda: el examen de admisión, como la nota de Física 1, se puede aprobar con fórmulas sin el concepto. Si el laboratorio quiere subir puntajes y no solo comprensión, debe medir las dos cosas por separado en la prueba del pase 2.

**Cautelas.** Son alumnos de una universidad privada de Lima, no de la UNA Puno. Rindieron una versión del FCI en español. La ganancia de 0,23 la calculé yo con los promedios de su tabla 1; el artículo define la ganancia como simple diferencia.

## Catálogo con respaldo

Los códigos entre paréntesis son los de la taxonomía del FCI (Hestenes, Wells y Swackhamer, 1992, tabla II).

### Fuerza y movimiento (primera y segunda ley)

| # | Idea errónea | Lo correcto | Qué tan frecuente | Fuente |
| --- | --- | --- | --- | --- |
| D1 | **Todo movimiento necesita una fuerza** que lo mantenga, en la dirección del movimiento (AF2). | Para mantener la velocidad constante no hace falta fuerza neta. La fuerza cambia la velocidad. | 478 universitarios: 65 % antes del curso, 44 % después. | Halloun y Hestenes (1985), citado por Mora y Herrera (2009) |
| D2 | **La fuerza se gasta** (I3, AF7). El empujón se va agotando y por eso el objeto se detiene. | Se detiene porque actúa otra fuerza, el roce. Sin roce seguiría. | Dentro del modelo de ímpetu, el más común: 65 % de 478 universitarios razonaba con ímpetu y 18 % de forma aristotélica. Solo 17 %, newtoniano. | Halloun y Hestenes (1985); Gunstone y Watts |
| D3 | **Fuerza constante, velocidad constante** (AF4). "F = m·v". | Fuerza neta constante produce aceleración constante. | 14 % de 478 universitarios. De ellos, 27 % cree además que la velocidad llega a un límite fijado por la fuerza. | Halloun y Hestenes (1985) |
| D4 | **En la cima, la fuerza es cero** (moneda lanzada hacia arriba). Mientras sube, hay una fuerza hacia arriba que se va gastando. | Solo actúa el peso, igual en la subida, la cima y la bajada. | Después de un curso tradicional, solo 5 % de 240 alumnos de Oregon respondió bien las tres preguntas. Ver C1 en [cinemática](cinematica-ideas-erroneas.md). | Thornton y Sokoloff (1998); Clement (1982) |
| D5 | **El más pesado cae más rápido** (G3). | Sin aire, todos con la misma aceleración. | Hestenes y otros notan que esta idea persiste en un ítem aun cuando en otro ítem, más parecido a lo visto en clase, los alumnos aciertan. Ver C2 en cinemática. | Hestenes, Wells y Swackhamer (1992) |

### Tipos de fuerza y diagrama de cuerpo libre

| # | Idea errónea | Lo correcto | Qué tan frecuente | Fuente |
| --- | --- | --- | --- | --- |
| D6 | **La mesa no empuja; solo "está en el camino"** (Ob). Los objetos inanimados detienen o desvían, pero no ejercen fuerzas. | La mesa ejerce la fuerza normal, hacia arriba. | En secundaria, la mitad dijo que la mesa "solo se encuentra en el camino". | Minstrell (1982); Halloun y Hestenes (1985); vía Mora y Herrera (2009) |
| D7 | **El aire sostiene o empuja hacia abajo** (G1). La presión del aire ayuda a la gravedad, o mantiene el libro en la mesa. | La presión del aire actúa por todos lados y casi se cancela; no es la fuerza que sostiene. | Cerca del 15 % de alumnos de secundaria dijo que solo el aire mantiene el libro en su lugar. | Minstrell (1982), vía Mora y Herrera (2009) |
| D8 | **Lo que cae no tiene fuerza; "quiere" ir hacia abajo** (G2). La gravedad es una tendencia del objeto, no una fuerza. Y en el suelo "ya no hay gravedad". | El peso es una fuerza que actúa siempre, también en reposo sobre el suelo. | Reportada en entrevistas; sin porcentaje. | Halloun y Hestenes (1985); Minstrell (1982) |
| D9 | **Fuerza centrífuga.** En el movimiento circular, una fuerza real empuja hacia afuera; al soltarse, el objeto sigue curvándose. | La fuerza neta apunta hacia el centro. Al soltarse, el objeto sigue en línea recta. | El FCI no tiene ítem propio para esta idea. En la PUCP, movimiento circular fue de lo peor contestado en la nivelación. | Hestenes, Wells y Swackhamer (1992); McCloskey, Caramazza y Green (1980); Castillo y otros (2013) |

### Tercera ley

| # | Idea errónea | Lo correcto | Qué tan frecuente | Fuente |
| --- | --- | --- | --- | --- |
| D10 | **El más fuerte ejerce más fuerza** (AR1, AR2). En el choque, el camión empuja más al auto que el auto al camión; el que empuja, más que el empujado. | Las dos fuerzas del par son iguales y opuestas, siempre. | En el modelo "más masa, más fuerza" o "más velocidad, más fuerza", entre el 60 % y el 90 % de los alumnos de cinco cursos universitarios de Estados Unidos, según el nivel del curso, y de forma consistente. | Bao, Hogg y Zollman (2002); Hestenes, Wells y Swackhamer (1992) |
| D11 | **Acción y reacción se anulan** porque son iguales y opuestas. Confundir el par de la tercera ley con dos fuerzas sobre el mismo cuerpo, como el peso y la normal. | Las fuerzas del par actúan sobre cuerpos **distintos**, así que no se suman. | Documentada; sin porcentaje en las fuentes leídas. Mahajan (2005) la reporta en estudiantes de Cambridge. | Hestenes, Wells y Swackhamer (1992); Mahajan (2005) |

**Un matiz sobre D10.** Bao y otros encontraron que el modelo erróneo depende del contexto. Con masa y velocidad, los alumnos sostienen el error de forma consistente. Con "el que empuja", aparecen respuestas mezcladas, porque el refrán "si empujas algo, te empuja de vuelta" ayuda. Para la plantilla, significa que la predicción debe preguntar por masa o por velocidad, no por quién empuja: ahí está el error firme.

**Lo que se aprende del catálogo.** Galili y Hazan dijeron de óptica lo mismo que Halloun y Hestenes dicen de dinámica: el alumno no tiene errores sueltos, tiene un modelo de fondo. En dinámica, ese modelo es el ímpetu (D1 a D4). Halloun y Hestenes encontraron además que los alumnos mezclan modelos y los aplican de forma inconsistente según la situación. La consecuencia para el laboratorio es la misma que en óptica: la escena tiene que hacer visible cada fuerza como una flecha con su agente ("la mesa sobre el bloque", "la Tierra sobre el bloque"), para que nunca aparezca una fuerza sin un objeto que la ejerza.

## Lo que no tiene respaldo (todavía)

Errores de cálculo típicos de los problemas de admisión. No encontré estudios que los midan, pero cada uno es la cara numérica de un error documentado:

| Error que suponemos | Error conceptual del que sale |
| --- | --- |
| N = mg en el plano inclinado, o cuando una fuerza tira hacia arriba en ángulo | D6, D8: la normal se ve como "el peso al revés", no como una fuerza propia de la superficie |
| T = mg en la máquina de Atwood: la tensión igual al peso del bloque que cuelga | D1: si el bloque se mueve, el alumno no ve que la fuerza neta no es cero |
| Roce estático siempre igual a μₛN, aunque el bloque no se mueva | D6: el roce se ve como algo fijo, no como una fuerza que se ajusta hasta un máximo |
| Intercambiar seno y coseno al descomponer el peso en el plano inclinado | Es el mismo error que en tiro parabólico; frecuente en material de academia, sin medir |
| Sumar la "fuerza centrífuga" en el diagrama del movimiento circular | D9 |
| En el ascensor, creer que la normal es mayor cuando el ascensor sube, aunque vaya a velocidad constante | D1: confundir velocidad hacia arriba con fuerza hacia arriba |

Se confirman igual que en los otros temas: con hojas resueltas en la prueba del pase 2 y con predicciones de respuesta abierta.

## Propuesta para las plantillas

**Una regla para todas las plantillas de dinámica.** Cada flecha de fuerza lleva escrito su par "quién sobre quién" ("Tierra → bloque", "plano → bloque") y tiene un color fijo por tipo de fuerza: peso, normal, roce y tensión. Si el alumno arrastra una fuerza que no tiene agente, la escena la rechaza. Esto ataca D6, D7, D8 y D9 a la vez, y aplica el principio 4 del laboratorio: un color por variable.

### Plano inclinado

**Problema guiado.** Un bloque de 10 kg sobre un plano de 37°, con μ = 0,5 y g = 10 m/s². Se usan sen 37° = 3/5 y cos 37° = 4/5, el triángulo 3-4-5 de academia.

Predicción del paso 3: *¿cuánto vale la fuerza normal?*

| Opción | Error que representa | Respaldo |
| --- | --- | --- |
| a) 100 N, igual al peso | N = mg (hipótesis, sale de D6 y D8) | Parcial |
| b) 80 N | Correcta (mg·cos 37°) | — |
| c) 60 N | Intercambia seno y coseno (hipótesis) | Sin respaldo |
| d) 0 N, porque el bloque se está moviendo hacia abajo | D6: la superficie "solo está en el camino" | Documentado |

**Explorador.** Se arrastra el ángulo y se ve cómo la componente del peso a lo largo del plano crece mientras la normal se achica, con las barras de los colores de cada fuerza. El caso límite es el ángulo en que el bloque empieza a deslizar. Ahí se ve que el roce estático **crece** hasta su máximo y no vale μₛN desde el principio.

### Poleas (máquina de Atwood)

**Problema guiado.** Dos bloques de 3 kg y 2 kg.

Predicción: *¿cuánto vale la tensión?*

| Opción | Error que representa | Respaldo |
| --- | --- | --- |
| a) 20 N, el peso del bloque liviano | T = mg (hipótesis) | Sin respaldo |
| b) 30 N, el peso del bloque pesado | Hipótesis nuestra, cercana a "gana el más fuerte" (CI1 del FCI); pero CI1 trata de hacia dónde se mueve el sistema, no del valor de la tensión | Hipótesis (corregido el 6 nov 2026 tras la revisión de la plantilla) |
| c) 24 N | Correcta | — |
| d) 50 N, la suma de los pesos | Suma todas las fuerzas sin separar los cuerpos | Sin respaldo |

### Tercera ley (escena corta, dentro del explorador de cualquier plantilla)

Un auto choca con un camión. *¿Quién ejerce más fuerza?* Opciones: el camión, porque tiene más masa / el auto, porque va más rápido / igual / depende de quién iba más rápido. La escena muestra las dos flechas iguales y, aparte, las dos aceleraciones distintas. Es lo que confunde a los alumnos: misma fuerza, distinto efecto.

### Casos de prueba propuestos

Verificados con fracciones exactas; van al `casos.json` de cada plantilla cuando se construya. Unidades SI, g = 10 m/s², sen 37° = 3/5.

| Plantilla | Caso | Entrada | Salida esperada |
| --- | --- | --- | --- |
| Plano | Normal | m = 10, θ = 37° | N = 80; componente del peso a lo largo del plano = 60 |
| Plano | Sin roce | m = 10, θ = 37° | a = 6 |
| Plano | Con roce cinético | m = 10, θ = 37°, μ = 1/2 | a = 2 |
| Plano | Roce estático, no desliza | m = 10, θ = 37°, μₛ = 4/5 | roce = 60 (no 64 = μₛN) |
| Poleas | Atwood | m₁ = 3, m₂ = 2 | a = 2, T = 24 |
| Normal | Ascensor que sube acelerando | m = 60, a = 2 hacia arriba | N = 720 |
| Normal | Ascensor que baja acelerando | m = 60, a = 2 hacia abajo | N = 480 |
| Normal | Tirón hacia arriba a 37° sobre el piso | m = 10, F = 50 | N = 70; a = 4 sin roce |
| Circular | Fuerza centrípeta | m = 2, v = 4, r = 2 | F = 16 hacia el centro |

## Huecos y siguientes pasos

- **La tabla por pregunta del FCI.** El artículo de 1992 trae los porcentajes de cada opción, antes y después de la instrucción, pero salió ilegible al extraer el texto. Si Gerson consigue una copia limpia, completo los porcentajes de D9, D10 y D11.
- **Los artículos originales** de Halloun y Hestenes (1985), Clement (1982) y Minstrell (1982) solo los leí a través de la revisión de Mora y Herrera (2009).
- **Pedir los datos por pregunta a la PUCP.** El artículo de Castillo y otros solo da resultados por tema. Los datos por pregunta de 4535 alumnos peruanos serían la mejor fuente de distractores del país. Vale escribirles: los correos están en el artículo.
- **Qué sigue.** En la tarea 4 queda estequiometría (química). Con cuatro temas de física investigados, recomiendo pasar a la tarea 1 antes de seguir leyendo.

## Fuentes

- [Castillo, Moscoso, Phan y Quiroz (2013), *Impacto de la enseñanza de conceptos de fuerza y movimiento en los cursos de Física General*, En Blanco & Negro 4(1), 47–54, PUCP](https://revistas.pucp.edu.pe/index.php/enblancoynegro/article/download/7412/7636). 4535 alumnos de la PUCP, FCI en español.
- [Hestenes, Wells y Swackhamer (1992), *Force Concept Inventory*, The Physics Teacher 30, 141–158](https://gwern.net/doc/science/physics/1992-hestenes.pdf). Taxonomía de ideas erróneas y puntajes base.
- [Mora y Herrera (2009), *Una revisión sobre ideas previas del concepto de fuerza*, Latin American Journal of Physics Education 3(1), 72–86](https://repositoriodigital.ipn.mx/handle/123456789/10737). Revisión en español; fuente de los datos de Halloun y Hestenes (1985) y de Minstrell (1982).
- [Bao, Hogg y Zollman (2002), *Model analysis of fine structures of student models: An example with Newton's third law*, American Journal of Physics 70(7), 766–778](https://www.asc.ohio-state.edu/bao.15/Papers/AJP_2002-7-766-MA_FineStructure.pdf).
- [Thornton y Sokoloff (1998), FMCE](https://pages.uoregon.edu/sokoloff/FMCE.pdf). Ver [cinemática](cinematica-ideas-erroneas.md).
- [Mahajan (2005), *Observations on teaching first-year physics*](https://arxiv.org/abs/physics/0512158). Observaciones en Cambridge sobre la segunda y tercera ley.
- [Hake (1998), *Interactive-engagement versus traditional methods*](https://web.mit.edu/jrankin/www/Active_Learning/hake_active_phys.pdf). Ya citado en el documento fundacional.
- Halloun y Hestenes (1985), *Common sense concepts about motion*, American Journal of Physics 53, 1056–1065. Leído a través de Mora y Herrera.
- Minstrell (1982), *Explaining the "at rest" condition of an object*, The Physics Teacher 20, p. 10. Leído a través de Mora y Herrera.
- Clement (1982), *Students' preconceptions in introductory mechanics*, American Journal of Physics 50(1), 66–71. Solo la referencia.
- McCloskey, Caramazza y Green (1980), *Curvilinear motion in the absence of external forces*, Science 210, 1139–1141. Solo la referencia.
