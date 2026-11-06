# Ideas erróneas en geometría plana y del espacio

6 de noviembre de 2026 · Tarea 4 de `CLAUDE.md`, primer informe del bloque de matemática (sigue a los de física y química de esta carpeta)

Para qué sirve: cubre las unidades del curso de geometría en `catalogo/cursos/geometria.json`. Entran segmentos y ángulos, triángulos y líneas notables, congruencia, polígonos y cuadriláteros, circunferencia y ángulos en ella, proporcionalidad y semejanza, puntos notables, relaciones métricas, áreas poligonales, longitud de la circunferencia y áreas circulares, prisma y pirámide, cilindro, cono y esfera, y razonamiento con figuras. Quedan fuera simetría, poliedros (salvo el conteo de cubitos), rectas y planos en el espacio y geometría analítica. De ellos no encontré nada útil.

**Cómo se hizo y cuál es su límite.** Esta sesión no pudo abrir ningún artículo. El proxy de red rechazó todas las descargas (uv.es, Springer, ERIC, ResearchGate, CORE, Hrčak, SciELO, Minedu), así que los datos vienen de los resúmenes del buscador web. Cada uno cita el artículo y la página donde aparece la cifra. Por eso marco como **documentado** solo lo que trae un porcentaje concreto atribuido a un estudio con muestra conocida, y aviso cuando la cifra me llegó de segunda mano. Antes de poner una cifra en pantalla hay que leer el original (ver "Huecos").

## Resumen en seis líneas

1. **La ilusión de linealidad es el error mejor documentado del curso.** Un granjero tarda 8 horas en abonar un terreno cuadrado de 200 m de lado. ¿Cuánto tardará con uno de 600 m? Más del 90 % de alumnos belgas de 12 años y más del 80 % de 16 años respondió "24 horas"; lo correcto es 72 (De Bock, Van Dooren, Verschaffel y otros, según el resumen de Van Dooren en un capítulo de la KU Leuven).
2. **No es un error de Bélgica.** En una tesis de la BUAP (México, 2016), 16 de 17 alumnos de un grupo aplicaron el modelo lineal en los problemas de área. Persiste en universitarios de psicología de Zagreb (Pavlin-Bernardić y Mateša, 2012) y en futuros profesores.
3. **Área y perímetro se confunden y se creen ligados.** En un ítem de TIMSS 1999 de 8.° grado, el 29 % del promedio internacional eligió la opción que cubre solo el borde del rectángulo y no su interior; acertó el 46 %. La ECE 2016 de Perú (2.° de secundaria) señala el mismo error en sus distractores. D'Amore y Fandiño Pinilla (2007) muestran que estudiantes y maestros creen que, si crece el área, crece el perímetro.
4. **La altura se dibuja como el profesor la dibujó.** Debe quedar dentro del triángulo, ser "vertical" y caer en el medio del lado. En 8.° grado, después de la enseñanza, menos del 30 % dominaba el concepto (Hershkowitz, 1989, citado por terceros). Con 190 futuros maestros españoles, la imagen de la altura resultó limitada justo en los casos no prototípicos (Gutiérrez y Jaime, 1999).
5. **En el espacio, el alumno ve una figura plana.** Al contar los cubitos de un sólido dibujado, el error más frecuente fue contar las caras visibles. Menos de la mitad de los alumnos de 5.° a 8.° grado resolvió esos problemas (Ben-Chaim, Lappan y Houang, 1985).
6. **Sin datos:** ángulo inscrito frente a central, ángulos entre paralelas, relaciones métricas, el factor 1/3 de pirámide y cono, radio frente a diámetro y longitud de arco. Son los errores de cálculo de academia y quedan como hipótesis. Tampoco hallé porcentajes peruanos por ítem.

## De dónde salen los datos

| Fuente | Muestra | Instrumento | Qué aporta |
| --- | --- | --- | --- |
| De Bock, Verschaffel y Janssens (1998), *Educational Studies in Mathematics* 35, 65–83, y la línea de trabajo de De Bock, Van Dooren, Janssens y Verschaffel (2002–2008), Bélgica | 260 alumnos de 12–13 años y 125 de 15–16 años en el estudio de 1998 (cifra del resumen del buscador) | Problemas verbales de longitud, área y volumen de figuras semejantes, proporcionales y no proporcionales | El dato de "24 horas"; la idea de que el dibujo o un contexto realista ayudan poco |
| Sánchez Sánchez (2016), tesis de maestría, BUAP (México) | Grupos de secundaria | Problemas de área, volumen y "falta de autenticidad" | 16 de 17 alumnos de un grupo usaron el modelo lineal en área |
| Pavlin-Bernardić y Mateša (2012), *Review of Psychology* 19(2), 141–146, Croacia | 122 universitarios de psicología | Problemas de área y volumen, con y sin andamiaje visual o metacognitivo | La ilusión sigue en adultos; las ayudas la reducen |
| TIMSS 1999, informe de benchmarking (IEA, Boston College) | Promedio internacional de 8.° grado | Ítem liberado: cuántos triángulos cubren un rectángulo | 29 % eligió la opción que cubre solo el perímetro; 46 % acertó |
| Minedu, UMC (2017), *¿Qué logran nuestros estudiantes en Matemática? ECE 2016, 2.° de secundaria* | Censal, Perú | Ítems liberados con análisis de distractores | Señala la confusión área-perímetro y la falta de caracterización de figuras; no hallé porcentajes por opción |
| D'Amore y Fandiño Pinilla (2007), *Relime* 10(1), 39–68, Italia | Maestros y estudiantes de varias edades | Tareas y entrevistas sobre área y perímetro | La creencia "más área, más perímetro" y su resistencia; cualitativo |
| Hershkowitz (1987, 1989); Vinner y Hershkowitz (1980, 1983), Israel | Alumnos de 5.° a 8.° grado y maestros | Dibujar la altura sobre un lado marcado | Efecto prototipo; menos del 30 % en 8.° (cita de terceros) |
| Gutiérrez y Jaime (1999), *Journal of Mathematics Teacher Education* 2, 253–275, España | 190 futuros maestros de primaria | Dibujar alturas en triángulos no prototípicos, con y sin definición | Tipos de error y la imagen del concepto que los produce |
| Burger y Shaughnessy (1986), *JRME* 17(1), 31–48, Estados Unidos | 13 alumnos de 1.° a 12.° grado y un universitario de matemática | Entrevistas clínicas con triángulos y cuadriláteros | Niveles de Van Hiele; nivel 0 dominante hasta 8.° grado; rechazo de la inclusión de clases |
| Clements, Swaminathan, Hannibal y Sarama (1999), *JRME* 30(2), 192–212 | 97 niños de 3 a 6 años | Identificar figuras entre distractores | Prototipos de forma; útil para el diseño, no para postulantes |
| Ben-Chaim, Lappan y Houang (1985), *Educational Studies in Mathematics* 16(4), 389–409, Estados Unidos | Alumnos de 5.° a 8.° grado | Contar cubitos en dibujos de sólidos | Cuatro tipos de error; el más frecuente es contar caras visibles |
| Kospentaris, Spyrou y Lappas (2011), *Educational Studies in Mathematics* 77, 105–127, Grecia | 21 alumnos de 12.° grado y universitarios de matemática | Seis tareas de comparación y conservación de área, con entrevistas | La estimación visual engaña; triángulos de igual base y altura |
| Aravena, Gutiérrez y Jaime (2016), *Enseñanza de las Ciencias* 34(1), 107–128, Chile | Alumnos de 2.° medio de liceos vulnerables | Test de niveles de Van Hiele con ítems de semejanza | Ningún alumno mostró una adquisición mínima del nivel 4 (deducción formal) |
| Espinoza-Vergara y otros (2020), *Enseñanza de las Ciencias* 38(1), 5–26, Chile | Alumnos de secundaria | Problema de percepción visual resuelto con el ángulo inscrito | Usan el teorema casi solo en la semicircunferencia |

**Cautelas.** Ninguna muestra es de postulantes peruanos. Las cifras más fuertes (Bélgica, TIMSS) son de alumnos de 12 a 16 años, más jóvenes que el público de la UNI pero de la misma edad que 3.º a 5.º de secundaria, el público del lanzamiento en el colegio. La ilusión de linealidad tiene una ventaja: aparece en todas las edades y países estudiados, y se resiste a la enseñanza (Modestou y Gagatsis, 2007, la llaman obstáculo epistemológico). Es razonable esperarla también en Perú.

## Catálogo con respaldo

### Semejanza, escala, área y volumen

| # | Idea errónea | Lo correcto | Cómo aparece en un examen | Dato | Respaldo y fuente |
| --- | --- | --- | --- | --- | --- |
| GE1 | **Si el lado se multiplica por k, el área también se multiplica por k** (ilusión de linealidad). | El área se multiplica por k². | "Pintar una pared cuadrada de 2 m de lado lleva 3 h. ¿Cuánto lleva una de 6 m?" Responde 9 h (es 27 h). | Más del 90 % (12 años) y más del 80 % (16 años) dio la respuesta proporcional en el problema del granjero. El dibujo y el contexto realista ayudaron poco (De Bock y otros, 2002, *Mathematical Thinking and Learning* 4, 65–89). México: 16 de 17 en un grupo. | **Documentado.** Van Dooren y otros, capítulo de la KU Leuven (cifra vista en el resumen del buscador); De Bock, Verschaffel y Janssens (1998); Sánchez Sánchez (2016) |
| GE2 | **Si la arista se multiplica por k, el volumen se multiplica por k** (o por k²). | El volumen se multiplica por k³. | "Una maqueta a escala 1:10 usa 2 L de pintura en su superficie. ¿Cuánto usa el edificio?" o "un cubo de arista doble tiene ¿cuántas veces el volumen?" Responde 2 veces o 4 veces (son 8). | El informe de De Bock y otros en PME 28 (2004) describe una "gran mayoría" de alumnos de 12 a 16 años con esta creencia en área y volumen; no vi el porcentaje para volumen. | **Parcial.** Línea de De Bock y otros (2002–2007); Pavlin-Bernardić y Mateša (2012) |
| GE3 | **El modelo lineal se aplica aunque se avise.** Se mantiene si el problema trae dibujo, si se pide dibujar o si se presenta como "del mundo real". | Hay que preguntarse qué magnitud se mide (longitud, área o volumen) antes de hacer regla de tres. | Cualquier problema de semejanza. | En los estudios de presentación, las ayudas mejoran poco. En una intervención, las respuestas lineales indebidas bajaron a cerca del 18 % al terminar y volvieron a cerca del 30 % semanas después (De Bock y otros, informe ERIC ED501140). | **Parcial.** Cifras vistas en el resumen del buscador |

### Área y perímetro

| # | Idea errónea | Lo correcto | Cómo aparece en un examen | Dato | Respaldo y fuente |
| --- | --- | --- | --- | --- | --- |
| GE4 | **Se calcula o se cubre el borde en lugar de la región** (área y perímetro confundidos). | El área cuenta lo que cubre el interior; el perímetro mide el borde. | "¿Cuántas baldosas de 1 m² hacen falta para un patio de 3 m × 5 m?" Responde 16 (el perímetro) en vez de 15. | TIMSS 1999, 8.° grado: el 29 % (promedio internacional) eligió la opción que cubre solo el perímetro; acertó el 46 %. La ECE 2016 de Perú interpreta un distractor como "confundió área con perímetro". | **Documentado.** TIMSS 1999, informe de benchmarking, cap. 2; Minedu (2017), ECE 2016 |
| GE5 | **Más perímetro implica más área**, y al revés; si el perímetro no cambia, tampoco cambia el área. | Con el mismo perímetro puede haber áreas muy distintas (1 × 9 y 4 × 4 tienen perímetros 20 y 16, pero áreas 9 y 16). | "Se recorta una esquina de un rectángulo. ¿Qué pasa con el área y el perímetro?" Responde que bajan los dos. | "Alto porcentaje", incluso en universitarios, y la mayoría de los maestros entrevistados; sin cifra en lo que pude ver. | **Parcial.** D'Amore y Fandiño Pinilla (2007), *Relime* 10(1) |
| GE6 | **Dos triángulos que "se ven" distintos tienen áreas distintas**, aunque compartan base y altura (la estimación visual manda). | Igual base y misma altura dan igual área, sin importar la inclinación. | Triángulos entre dos paralelas con la misma base: "¿cuál tiene más área?" | 21 alumnos de alto rendimiento; las estimaciones visuales resultaron poco fiables. | **Parcial.** Kospentaris, Spyrou y Lappas (2011) |

### Triángulos, líneas notables y prototipos

| # | Idea errónea | Lo correcto | Cómo aparece en un examen | Dato | Respaldo y fuente |
| --- | --- | --- | --- | --- | --- |
| GE7 | **La altura siempre cae dentro del triángulo** y es "la línea vertical". En el obtusángulo se dibuja hasta el lado opuesto inclinada, o se toma un lado como altura. | La altura es perpendicular a la recta que contiene el lado; en el obtusángulo, dos alturas caen fuera. En el rectángulo, dos alturas son los catetos. | Área de un triángulo obtusángulo con base y "altura" dadas: el alumno usa el lado inclinado como altura. | 8.° grado, ya enseñado el tema: menos del 30 % dominaba el concepto (Hershkowitz, 1989). Más dificultad en rectángulos y obtusángulos que en acutángulos (Hershkowitz, 1987). En otro estudio con maestros (no pude fijar autor ni año), los errores se juntaron en los triángulos rectángulos (214) y obtusángulos (145). | **Documentado** (de segunda mano). Hershkowitz (1987, 1989); Vinner y Hershkowitz (1983); Gutiérrez y Jaime (1999) |
| GE8 | **La altura, la mediana y la bisectriz son la misma línea**: la altura cae en el punto medio y la bisectriz parte el lado opuesto por la mitad. | Solo coinciden en el triángulo isósceles (desde el vértice entre los lados iguales). La bisectriz divide el lado opuesto en la razón de los lados adyacentes. | Triángulo 6-8-10: "¿en qué segmentos divide la bisectriz del ángulo recto a la hipotenusa?" Responde 5 y 5 (son 30/7 y 40/7). | La imagen de la altura del alumno "coincide con la del triángulo isósceles" (descripción del efecto prototipo); sin porcentaje. | **Parcial.** Hershkowitz (1989), citado por terceros |
| GE9 | **Figura prototípica: un cuadrado girado 45° "es un rombo, no un cuadrado"**; un triángulo con un vértice abajo "está al revés". | La figura no cambia con la posición; la definen sus propiedades. | Figuras de examen rotadas a propósito: el alumno no reconoce el cuadrado o el triángulo rectángulo y no aplica la propiedad. | Documentado en niños de 3 a 6 años (Clements y otros, 1999); en secundaria, descrito sin cifra. | **Parcial.** Clements y otros (1999); Vinner y Hershkowitz (1980) |
| GE10 | **Un cuadrado no es un rectángulo** (no hay inclusión de clases), y las propiedades se leen del dibujo, no de la definición. | El cuadrado cumple la definición del rectángulo y la del rombo. | "¿Cuáles de estas figuras son paralelogramos?" El alumno excluye el cuadrado y el rombo. | Nivel 0 de Van Hiele dominante hasta 8.° grado en la muestra de entrevistas. En Chile, ningún alumno de liceos vulnerables llegó al nivel 4. | **Parcial.** Burger y Shaughnessy (1986); Aravena, Gutiérrez y Jaime (2016); Fischbein (1993) para el marco |
| GE11 | **Pitágoras mal aplicado**: se suma cuando la incógnita es un cateto, se aplica a triángulos que no son rectángulos, o se toma la hipotenusa como cateto. | c² = a² + b² solo en el triángulo rectángulo, con c opuesto al ángulo recto. | Hipotenusa 13 y cateto 5: responde √194 en vez de 12. | Un estudio en Bolema clasifica los errores de 10.° grado en conceptuales, de estrategia, de cálculo y de descuido. Entre ellos está "decir que un cateto mide lo mismo que la hipotenusa". No vi el porcentaje de cada error. | **Parcial.** "Examining the errors made by high school students while applying the Pythagorean Theorem", *Bolema* (SciELO Brasil) |

### Circunferencia

| # | Idea errónea | Lo correcto | Cómo aparece en un examen | Dato | Respaldo y fuente |
| --- | --- | --- | --- | --- | --- |
| GE12 | **El ángulo inscrito solo vale la mitad del arco cuando subtiende un diámetro** (el caso del ángulo recto). Fuera de ese caso no se usa. | Todo ángulo inscrito mide la mitad del arco que abarca, y todos los inscritos en el mismo arco son iguales. | Un punto que se mueve sobre la circunferencia: "¿cambia el ángulo?" | Descrito en alumnos de secundaria chilenos; sin porcentaje. | **Parcial.** Espinoza-Vergara y otros (2020) |

### Espacio

| # | Idea errónea | Lo correcto | Cómo aparece en un examen | Dato | Respaldo y fuente |
| --- | --- | --- | --- | --- | --- |
| GE13 | **Un sólido dibujado se cuenta como si fuera plano**: se cuentan las caras visibles o solo los cubitos visibles. | El volumen cuenta también los cubitos ocultos: largo × ancho × alto. | "¿Cuántos cubitos forman este bloque de 3 × 4 × 2?" Responde 26 (las caras visibles) en vez de 24. | Cuatro tipos de error (caras visibles con o sin duplicar, cubitos visibles con o sin duplicar). El más frecuente: contar caras. Menos del 50 % de alumnos de 5.° a 8.° grado resolvió estos problemas. | **Documentado.** Ben-Chaim, Lappan y Houang (1985), según dos fuentes que lo citan |
| GE14 | **El volumen de un prisma es la suma de las áreas de sus caras** (volumen y área total se confunden). | El volumen es área de la base × altura; el área total suma las caras. | Prisma de 2 × 3 × 4: responde 52 (el área total) en vez de 24. | Lo reportan los profesores entrevistados en un estudio australiano sobre el conocimiento docente del volumen del prisma; sin porcentaje. | **Parcial.** *Australian Mathematics Teacher* 74(1), 2018 (ERIC EJ1175356) |

**Lo que dicen las respuestas buenas.** Los niveles de Van Hiele explican la mitad del catálogo. GE7 a GE10 son errores del nivel 1 (visual): la figura se reconoce por su aspecto y la propiedad se lee del dibujo. Usiskin (1982) evaluó a unos 2700 alumnos de secundaria estadounidenses con un test de 25 ítems; Aravena y otros (2016) lo replicaron en Chile. La consecuencia para la plantilla: **toda figura de una escena debe poder girarse, estirarse y deformarse**, y las predicciones deben usar figuras no prototípicas (obtusángulos, cuadrados girados, alturas fuera).

## Lo que no tiene respaldo (todavía)

Errores frecuentes en problemas de academia para los que no encontré estudios con datos. Se tratan como **hipótesis**; el lanzamiento en el colegio dirá cuáles aparecen.

| # | Hipótesis | Ejemplo propio | Ligada a |
| --- | --- | --- | --- |
| GE15 | El ángulo inscrito se iguala al central, o se toma el doble en vez de la mitad. | Central de 100°: responde 100° o 200° para el inscrito (es 50°). | GE12 |
| GE16 | Ángulo entre dos secantes que se cortan fuera: se suman los arcos en vez de restarlos, o no se divide entre 2. Dentro: se restan en vez de sumarlos. | Arcos de 110° y 30°: el exterior es 40° (no 70° ni 80°); el interior es 70°. | GE15 |
| GE17 | Entre paralelas, se igualan ángulos que son suplementarios (conjugados internos) o se suplementan los alternos. Se asume que dos rectas son paralelas porque "se ven" paralelas. | Alternos internos 3x + 10 y 5x − 30: x = 20 (70°). Si los suma a 180°, da x = 25. | GE9, GE10 |
| GE18 | Relaciones métricas del triángulo rectángulo: la altura relativa a la hipotenusa como promedio de las proyecciones (no media geométrica); cateto² = m · n en vez de m · c. | Proyecciones 4 y 9: h = 6 (no 6,5); catetos 2√13 y 3√13. | GE11 |
| GE19 | Radio y diámetro se intercambian; se usa 2πr como área o πr² como longitud. Arco y sector sin la fracción del ángulo, o con el ángulo en grados sin dividir entre 360. | r = 6 y 60°: arco 2π, sector 6π. Con el diámetro: 4π y 24π. | GE4 (la misma confusión entre longitud y región) |
| GE20 | Falta el factor 1/3 en la pirámide y el cono. | Cono r = 3, h = 4: 12π (sin el 1/3, 36π). | GE13, GE14 |
| GE21 | Se usa la altura en lugar de la apotema de la pirámide o de la generatriz del cono para el área lateral. | Pirámide de base cuadrada 6 y altura 4: área lateral 60 (con la altura, 48). | GE7 (altura mal ubicada) |
| GE22 | Teorema de Thales y semejanza con lados mal emparejados (se empareja por posición en el dibujo, no por ángulo). | Triángulo con una paralela a la base: se usa la razón parte/parte donde va parte/todo. | GE1, GE9 |
| GE23 | Suma de ángulos interiores de un polígono como 180° · n, o diagonales como n(n − 1)/2. | Hexágono: 720° (no 1080°); 9 diagonales (no 15). | Sin respaldo |

## Propuesta para las plantillas

Las tres escenas siguen el principio de "predecir antes de ver" (`docs/fundacional.md`). Las opciones incorrectas llevan el código del error que representan.

### 1. La ampliadora (semejanza, área y volumen)

**Qué se ve.** Una figura (cuadrado, triángulo o círculo) con una manija en un vértice. Al arrastrarla, la figura crece desde un punto fijo (homotecia). Dentro, una cuadrícula de baldosas unitarias que se cuentan. En un segundo modo, un cubo o un cono hecho de cubitos o lleno de agua.

**Variables y colores.** k, la razón de semejanza, en naranja: es la manija y la etiqueta "×k" sobre un lado. El lado L en azul: el segmento. El área A en verde: las baldosas, que se cuentan con un contador. El volumen V en morado: los cubitos o el agua. La ecuación A' = k² · A se arma con los mismos colores.

**Predicciones.**

1. *Abonar un terreno cuadrado de 50 m de lado toma 2 horas. ¿Cuánto toma uno de 150 m?* a) 18 h (correcta); b) 6 h (GE1); c) 54 h (usa k³: sobrecorrige; hipótesis, cercana a GE2).
2. *El lado del triángulo se duplica. ¿Cuántas veces cabe el triángulo pequeño en el grande?* a) 4 (correcta); b) 2 (GE1); c) 3 (cuenta los triángulos de las esquinas sin el del centro; hipótesis).
3. *Un cubo de arista 2 cm se reemplaza por uno de 6 cm. ¿Cuántos cubitos de 2 cm caben?* a) 27 (correcta); b) 3 (GE2); c) 9 (GE2: usa k²); d) 19 (GE13: cuenta solo los cubitos visibles).
4. *Una maqueta a escala 1:50 necesita 3 cm² de vidrio por ventana. ¿Cuánto vidrio necesita una ventana real?* a) 7500 cm² (correcta); b) 150 cm² (GE1); c) 375 000 cm² (GE2).
5. *Un vaso cónico y uno cilíndrico tienen la misma base y la misma altura. ¿Cuántos conos llenan el cilindro?* a) 3 (correcta); b) 2 (hipótesis: "el cono es la mitad"); c) 1 (GE20). La escena vierte el agua tres veces.

**Explorador.** El deslizador de k va de 1/3 a 4 y hay tres contadores en vivo (lado, baldosas, cubitos). Con un interruptor se pasa de figura plana a sólido. Un botón "¿y si fuera lineal?" dibuja en gris la figura que tendría k veces el área, que se ve deformada y no semejante.

### 2. El triángulo que se estira (líneas notables y área)

**Qué se ve.** Un triángulo con el vértice A arrastrable; la base BC queda fija. Desde A salen tres cevianas: la altura, la mediana y la bisectriz. Se pueden prender y apagar por separado. Cuando el ángulo en B pasa de 90°, la altura sale del triángulo y se dibuja la prolongación de la base, punteada. Un modo "entre paralelas" restringe A a una recta paralela a BC.

**Variables y colores.** La base b, en azul (el segmento BC). La altura h, en rojo (la perpendicular, con su marca de ángulo recto). La mediana, en verde, con el punto medio marcado. La bisectriz, en amarillo, con los dos arcos iguales del ángulo. El área A = b · h / 2 aparece con b en azul y h en rojo.

**Predicciones.**

1. *Se arrastra A hasta que el ángulo en B es obtuso. ¿Dónde cae la altura desde A?* a) Fuera del triángulo, sobre la prolongación de BC (correcta); b) en el punto medio de BC (GE8); c) dentro, sobre BC, inclinada (GE7); d) en B (GE7: toma el lado AB como altura).
2. *A se mueve por la recta paralela a BC. ¿Qué pasa con el área?* a) No cambia (correcta); b) crece cuando el triángulo se "acuesta" (GE6); c) es mayor cuando el triángulo es isósceles (GE9).
3. *Triángulo B(0, 0), C(4, 0), A(−2, 3). ¿Cuál es su área?* a) 6 (correcta); b) 2√13 ≈ 7,2 (GE7: usa AB como altura); c) 6√5 ≈ 13,4 (GE7: usa AC como altura); d) 12 (olvida dividir entre 2; hipótesis).
4. *En el triángulo rectángulo 6-8-10, la bisectriz del ángulo recto corta la hipotenusa. ¿En qué segmentos?* a) 30/7 y 40/7 (correcta); b) 5 y 5 (GE8); c) 3,6 y 6,4 (los segmentos de la altura; GE8).
5. *En el mismo triángulo, ¿cuánto mide la altura relativa a la hipotenusa?* a) 4,8 (correcta); b) 5 (GE8: es la mediana); c) 7 (promedia los catetos; hipótesis cercana a GE18).

**Explorador.** Las tres cevianas prendidas, con sus longitudes en vivo. Al volver el triángulo isósceles, se ve que las tres coinciden, y solo entonces (GE8). Un botón "girar" rota todo el dibujo (GE9): las medidas no cambian.

### 3. El ángulo que no cambia (circunferencia)

**Qué se ve.** Una circunferencia con dos puntos fijos A y B que definen un arco, el centro O y un punto P arrastrable sobre la circunferencia. Se ven el ángulo central AOB y el inscrito APB. Un segundo modo pone dos secantes que se cortan en un punto Q arrastrable, dentro o fuera del círculo.

**Variables y colores.** El arco AB, en morado (se pinta el arco). El ángulo central, en azul (el sector desde O). El ángulo inscrito, en naranja (en P). En el modo de secantes, el arco lejano en morado y el cercano en rosado. La ecuación ∠P = arco/2 se muestra con los mismos colores.

**Predicciones.**

1. *El ángulo central mide 100°. ¿Cuánto mide el inscrito que abarca el mismo arco?* a) 50° (correcta); b) 100° (GE15); c) 200° (GE15, al revés).
2. *Se arrastra P por el arco mayor. ¿Qué pasa con el ángulo APB?* a) No cambia (correcta); b) crece al acercarse a A (GE12, hipótesis visual); c) solo vale la mitad del arco cuando AB es diámetro (GE12).
3. *Dos secantes desde un punto exterior abarcan arcos de 110° y 30°. ¿Cuánto mide el ángulo?* a) 40° (correcta); b) 70° (GE16: suma); c) 80° (GE16: no divide); d) 140° (GE16: suma sin dividir).
4. *Q se mete dentro del círculo, con los mismos arcos. ¿Cuánto mide ahora el ángulo?* a) 70° (correcta); b) 40° (GE16: resta, como afuera).
5. *Sector de 60° en un círculo de radio 6. ¿Cuál es la longitud del arco?* a) 2π (correcta); b) 4π (GE19: usa el diámetro); c) 6π (GE19: da el área del sector); d) 12π (GE19: olvida la fracción del ángulo).

**Explorador.** P se arrastra libre y una pequeña tabla registra ∠P en cada posición: siempre el mismo número. Cuando AB es diámetro, se resalta el caso de 90°.

## Casos de prueba propuestos

Los verifiqué con `fractions.Fraction` en Python (`python3 -I`; sympy no está instalado). Las raíces las reduje a la forma a√b con una función de enteros, y π lo traté como coeficiente simbólico. El triángulo del caso 10 lo comprobé con coordenadas: área por determinante y signo del producto escalar para el ángulo obtuso. La bisectriz del caso 13 la calculé con dos fórmulas (ab√2/(a + b) y l² = ab(1 − (c/(a + b))²)), que dieron el mismo valor.

| # | Plantilla | Entrada | Salida esperada (y la del error) |
| --- | --- | --- | --- |
| 1 | Circunferencia | Central de 100° | Inscrito de 50° (GE15: 100° o 200°) |
| 2 | Circunferencia | Arcos de 110° y 30° | Exterior 40°; interior 70° (GE16: 70°, 80°) |
| 3 | Ampliadora | k = 3; granjero de 8 h | Área ×9, volumen ×27, 72 h (GE1: 24 h) |
| 4 | Ampliadora | Rectángulos 1 × 9 y 4 × 4 | P = 20 y 16; A = 9 y 16: el de más perímetro tiene menos área (GE5) |
| 5 | Triángulo | Catetos 5 y 12; hipotenusa 13 y cateto 5 | Hipotenusa 13; cateto 12 (GE11: √194) |
| 6 | Triángulo | Proyecciones m = 4, n = 9 sobre la hipotenusa | h = 6; catetos 2√13 y 3√13; área 39 (GE18: h = 6,5) |
| 7 | Circunferencia | r = 6, sector de 60° | Arco 2π; sector 6π (GE19 con el diámetro: 4π y 24π) |
| 8 | Ampliadora (sólido) | Cono r = 3, h = 4 | V = 12π; generatriz 5; lateral 15π; total 24π (GE20: 36π) |
| 9 | Ampliadora (sólido) | Pirámide de base cuadrada 6, altura 4 | V = 48; apotema 5; lateral 60 (GE20: 144; GE21: lateral 48) |
| 10 | Triángulo | B(0, 0), C(4, 0), A(−2, 3) | Área 6; ángulo en B obtuso; pie de la altura en x = −2, fuera de BC (GE7: 2√13 o 6√5) |
| 11 | Paralelas | Alternos internos 3x + 10 y 5x − 30 | x = 20; 70° (GE17: x = 25, 85°) |
| 12 | Ampliadora (sólido) | Esfera r = 3; luego r = 6 | V = 36π; A = 36π; al duplicar r, A ×4 y V ×8 |
| 13 | Triángulo | Rectángulo 6-8-10 | Mediana a la hipotenusa 5; bisectriz del recto la divide en 30/7 y 40/7 y mide 24√2/7; altura 24/5 con proyecciones 18/5 y 32/5 (GE8: 5 y 5) |

## Huecos y siguientes pasos

- **Abrir los originales.** Todas las cifras de este informe vienen de resúmenes del buscador, porque la red de la sesión bloqueó las descargas. Antes de usar un porcentaje en pantalla o en el informe del colegio hay que leer: De Bock, Verschaffel y Janssens (1998); De Bock y otros (2002, *ESM* 50, 311–334, el estudio en profundidad); Van Dooren y otros (2008, *JRME* 39(3)); Hershkowitz (1989); Gutiérrez y Jaime (1999) (está en la página de Ángel Gutiérrez en uv.es); Ben-Chaim y otros (1985); y el informe de benchmarking de TIMSS 1999. Si Gerson permite uv.es, ERIC y SciELO en la red de la sesión, se completa en una tarde.
- **Datos peruanos.** Los informes para docentes de la ECE (2016, 2018, 2019) de la UMC del Minedu analizan ítems liberados de "forma, movimiento y localización". Algunos traen el porcentaje por opción; es la fuente más cercana al alumno del lanzamiento. No pude abrirlos.
- **En español, por leer:** D'Amore y Fandiño Pinilla (2007), con las cifras de área y perímetro; Sánchez Sánchez (2016, BUAP) y Sánchez y Caballero Juárez (Funes), sobre la ilusión de linealidad en México; Aravena, Gutiérrez y Jaime (2016), con los porcentajes por nivel en Chile; Espinoza-Vergara y otros (2020), sobre el ángulo inscrito.
- **Sin estudios:** ángulos entre paralelas, ángulos en la circunferencia (salvo GE12), relaciones métricas, el factor 1/3 y área lateral con apotema. Para estos conviene que el colegio responda primero preguntas abiertas y que los distractores salgan de esas respuestas.
- **Modestou y Gagatsis (2007)**, *Educational Psychology* 27(1), 75–92: la ilusión de linealidad como obstáculo epistemológico, con porcentajes por ítem que no vi.

## Fuentes

No pude leer ninguna completa; lo que digo de cada una viene de los resúmenes del buscador web (6 de noviembre de 2026), que citan el texto o las tablas.

- De Bock, D., Verschaffel, L. y Janssens, D. (1998). *The predominance of the linear model in secondary school students' solutions of word problems involving length and area of similar plane figures*. Educational Studies in Mathematics 35, 65–83. https://link.springer.com/article/10.1023/A:1003151011999
- De Bock, D., Verschaffel, L. y Janssens, D. (2002). *The effects of different problem presentations and formulations on the illusion of linearity in secondary school students*. Mathematical Thinking and Learning 4, 65–89.
- De Bock, D., Van Dooren, W., Janssens, D. y Verschaffel, L. (2002). *Improper use of linear reasoning: an in-depth study of the nature and the irresistibility of secondary school students' errors*. Educational Studies in Mathematics 50, 311–334. http://www.fisme.science.uu.nl/publicaties/literatuur/2002_debock_esm_lineariteit.pdf
- De Bock, D. y otros (2004). Informe breve en las actas de PME 28. https://emis.univie.ac.at/proceedings/PME28/SO/SO020_DeBock.pdf
- Van Dooren, W., De Bock, D., Janssens, D. y Verschaffel, L. (2008). *The linear imperative: an inventory and conceptual analysis of students' overuse of linearity*. Journal for Research in Mathematics Education 39(3). Resumen con el problema del granjero en https://ppw.kuleuven.be/onderwijskunde/documents/ch9vandoorenmorelessons
- Van Dooren, W. y otros. Intervención para remediar la ilusión de linealidad, ERIC ED501140. https://files.eric.ed.gov/fulltext/ED501140.pdf
- Modestou, M. y Gagatsis, A. (2007). *Students' improper proportional reasoning: a result of the epistemological obstacle of "linearity"*. Educational Psychology 27(1), 75–92. https://eric.ed.gov/?id=EJ763425
- Pavlin-Bernardić, N. y Mateša, B. (2012). *Illusion of linearity in area and volume problems*. Review of Psychology 19(2), 141–146. https://hrcak.srce.hr/file/147850
- Sánchez Sánchez, R. (2016). *La ilusión de la linealidad en problemas de área, volumen y con falta de autenticidad en alumnos de secundaria*. Tesis de maestría, BUAP. https://www.fcfm.buap.mx/posgrados/assets/docs/catalogo-tesis/mem/2016/RobertoSanchezSanchez.pdf
- D'Amore, B. y Fandiño Pinilla, M. I. (2007). *Relaciones entre área y perímetro: convicciones de maestros y de estudiantes*. Relime 10(1), 39–68. https://www.scielo.org.mx/scielo.php?pid=S1665-24362007000100003&script=sci_abstract
- IEA (2000). *TIMSS 1999 Benchmarking Report*, cap. 2–3. https://timssandpirls.bc.edu/timss1999b/mathbench_report/t99bmath_chap_2_3.html
- Minedu, UMC (2017). *¿Qué logran nuestros estudiantes en Matemática? Informe para docentes, ECE 2016, 2.° grado de secundaria*. http://umc.minedu.gob.pe/wp-content/uploads/2017/04/Informe-para-Docentes-Matem%C3%A1tica-ECE-2016-2.%C2%B0-grado-de-secundaria.pdf
- Hershkowitz, R. (1989). *Visualization in geometry: two sides of the coin*. Focus on Learning Problems in Mathematics 11(1). Hershkowitz, R. (1987), sobre la altura en 5.° a 8.° grado, y Vinner, S. y Hershkowitz, R. (1980, 1983), sobre la imagen del concepto, citados por las fuentes de abajo.
- Gutiérrez, A. y Jaime, A. (1999). *Preservice primary teachers' understanding of the concept of altitude of a triangle*. Journal of Mathematics Teacher Education 2, 253–275. https://www.uv.es/angel.gutierrez/archivos1/textospdf/GutJai99.pdf
- Burger, W. y Shaughnessy, J. M. (1986). *Characterizing the van Hiele levels of development in geometry*. Journal for Research in Mathematics Education 17(1), 31–48. https://eric.ed.gov/?id=EJ332027
- Usiskin, Z. (1982). *Van Hiele levels and achievement in secondary school geometry* (proyecto CDASSG). University of Chicago.
- Clements, D. H., Swaminathan, S., Hannibal, M. A. Z. y Sarama, J. (1999). *Young children's concepts of shape*. Journal for Research in Mathematics Education 30(2), 192–212. https://eric.ed.gov/?id=EJ582599
- Clements, D. H. y Battista, M. T. (1992). *Geometry and spatial reasoning*. En D. Grouws (ed.), *Handbook of Research on Mathematics Teaching and Learning*, NCTM. (Marco general; no lo consulté.)
- Fischbein, E. (1993). *The theory of figural concepts*. Educational Studies in Mathematics 24(2), 139–162.
- Ben-Chaim, D., Lappan, G. y Houang, R. T. (1985). *Visualizing rectangular solids made of small cubes: analyzing and effecting students' performance*. Educational Studies in Mathematics 16(4), 389–409.
- Kospentaris, G., Spyrou, P. y Lappas, D. (2011). *Exploring students' strategies in area conservation geometrical tasks*. Educational Studies in Mathematics 77, 105–127. https://link.springer.com/article/10.1007/s10649-011-9303-8
- Aravena, M., Gutiérrez, A. y Jaime, A. (2016). *Estudio de los niveles de razonamiento de Van Hiele en alumnos de centros de enseñanza vulnerables de educación media en Chile*. Enseñanza de las Ciencias 34(1), 107–128. https://ensciencias.uab.cat/article/download/v34-n1-aravena-gutierrez-jaime/1664-pdf-es/10725
- Espinoza-Vergara, J. y otros (2020). Artículo sobre el uso del teorema del ángulo inscrito en un problema de percepción visual. Enseñanza de las Ciencias 38(1), 5–26. https://ensciencias.uab.cat/article/download/v38-n1-espinoza-vergara-valenzuela/2418-pdf-es/18901
- *Examining the errors made by high school students while applying the Pythagorean Theorem*. Bolema (SciELO Brasil). https://www.scielo.br/j/bolema/a/wd97pKjzkcD66Nm6vSF9pwC/?format=pdf&lang=en
- *The nature of middle school mathematics teachers' pedagogical content knowledge: the case of the volume of prisms*. Australian Mathematics Teacher 74(1), 2018. https://files.eric.ed.gov/fulltext/EJ1175356.pdf
