# Ideas erróneas en electricidad, magnetismo, física moderna y refracción

4 de noviembre de 2026 · Tarea 4 de `CLAUDE.md`, quinto bloque de física (sigue a [lentes](optica-ideas-erroneas.md), [espejos](optica-espejos-esfericos.md), [cinemática](cinematica-ideas-erroneas.md) y [dinámica](dinamica-ideas-erroneas.md))

Para qué sirve: cubre las semanas 13 a 20 del sílabo CEPRE-UNI 2026-2. Los temas son electrostática, circuitos de corriente continua, magnetismo e inducción, efecto fotoeléctrico y lo que faltaba de óptica (refracción y reflexión total). Este documento junta los errores documentados para escribir las predicciones de esas plantillas.

## Resumen en seis líneas

1. **Circuitos es el tema mejor medido del bloque, y el que peor sale.** En un cuestionario a 184 estudiantes de segundo año de ingeniería en Barcelona, solo el 4,3 % ordenó bien el brillo de bombillas en tres circuitos simples (una sola, dos en serie, dos en paralelo). Al quitar una bombilla de un circuito mixto, acertó **1 de 184** (Periago y Bohigas, 2005). McDermott reporta lo mismo en Estados Unidos: cerca del 15 % de más de 1000 universitarios, antes o después del curso.
2. Detrás de casi todos los errores de circuitos hay dos ideas: **la pila entrega siempre la misma corriente** y **la corriente se gasta** al pasar por las bombillas. En el mismo grupo de Barcelona, el 58 % cree que de dos bombillas iguales en serie brilla más la primera. Son alumnos que ya aprobaron la física del bachillerato y del primer año.
3. **El alumno resuelve el ejercicio y falla la pregunta conceptual.** El 80 % calculó bien las corrientes de un circuito mixto con la ley de Ohm, pero no supo qué pasaba al cambiarlo. En el test DIRECT (1135 alumnos de Estados Unidos), el 47 % cree que si se duplica la corriente por una pila, su voltaje se duplica "porque V = IR".
4. En electrostática hay un dato fuerte en español: de 133 estudiantes de ingeniería, solo el 15 % sabe que dos cargas distintas se ejercen fuerzas **iguales**. El 46 % cree que la carga mayor empuja más (Bohigas y Periago, 2010). Y el 76 % dibuja el campo eléctrico solo donde hay una carga de prueba.
5. En inducción y fotoeléctrico los datos son de grupos chicos, pero claros. Después del curso, casi la mitad no acierta el sentido de la corriente inducida (47 alumnos, Arizona). En el fotoeléctrico, el error más común es **aplicar la ley de Ohm**: creer que subir el voltaje hace salir electrones aunque la luz no tenga la frecuencia suficiente.
6. En refracción, el 57 % de 213 escolares de 14-15 años, que ya habían estudiado la ley de Snell, dibuja el rayo **sin desviarse** al pasar del aire al vidrio. Para reflexión total no encontré estudios con porcentaje. Tampoco para condensadores en serie, transformadores ni cuerpo negro: esos errores quedan como hipótesis.

## Catálogo con respaldo

### Electrostática

Fuente principal: Bohigas y Periago (2010), cuestionario a **133 estudiantes** que empezaban el segundo año de ingeniería en la Universitat Politècnica de Catalunya. Ya habían estudiado electrostática en el bachillerato y aprobado el primer año, que es selectivo.

| # | Idea errónea | Lo correcto | Qué tan frecuente | Fuente |
| --- | --- | --- | --- | --- |
| EL1 | **La carga mayor ejerce más fuerza.** Entre una carga y otra el triple de grande, la grande empuja más a la chica. | Las dos fuerzas son iguales y opuestas (tercera ley de Newton en la ley de Coulomb). | 45,9 % de 133. Solo 15,0 % responde que son iguales. | Bohigas y Periago (2010), pregunta Q1 |
| EL2 | **Sobre la carga mayor actúa más fuerza.** La versión al revés de EL1. | Igual que EL1. | 32,3 % de 133. | Bohigas y Periago (2010), Q1 |
| EL3 | **Las esferas colgadas se desvían distinto.** Dos esferas del mismo peso colgadas de hilos, una con el doble de carga: la de menor carga se aparta más de la vertical, "porque la mayor la empuja más". | Se apartan el mismo ángulo, porque la fuerza es la misma y el peso también. | 57,1 % elige que la carga menor se desvía el doble; 18,8 %, que se desvía más la mayor. Solo 24,1 % acierta. Solo 13,5 % acierta Q1 y Q2 a la vez. | Bohigas y Periago (2010), Q2 |
| EL4 | **Sin carga de prueba no hay campo.** El campo de una carga existe solo donde hay otra carga, y su sentido depende del signo de esa otra carga. | El campo es una propiedad de la carga que lo crea. Existe en todos los puntos, haya o no carga de prueba. | 75,9 % de 133 dibuja este esquema. Solo 6,8 % dibuja bien el campo en los tres casos. | Bohigas y Periago (2010), Q3 |
| EL5 | **Más campo en un punto, más fuerza sobre la carga que está ahí, sin importar su valor.** Se confunde el campo que crea una carga con la fuerza sobre la otra. | La fuerza es q·E: depende del campo **y** de la carga que lo siente. | 76,7 % compara bien los campos, pero solo 36,1 % compara bien las fuerzas. 45,1 % razona "más campo, más fuerza". | Bohigas y Periago (2010), Q4 |
| EL6 | **Las cargas no se pueden mover en un aislante**, así que un aislante no se polariza. | En un aislante las cargas no viajan, pero sí se desplazan un poco dentro de cada molécula: se polariza. | 50 % de universitarios de primer año. | Park y otros (2001), citado por Guisasola y otros (2010) |
| EL7 | **Un conductor sin carga no tiene capacidad.** Como C = Q/V, si Q = 0, entonces C = 0. | La capacidad depende de la forma y del tamaño del cuerpo, no de cuánta carga tenga. | En el grupo con enseñanza tradicional (40 universitarios de primer año de ingeniería), solo 12,5 % acierta. Los autores dicen que la mayoría razona con la fórmula. | Guisasola, Zubimendi, Franco y Ceberio (2010), cuestión C4 |
| EL8 | **La carga pasa de donde hay más a donde hay menos.** Al unir dos cuerpos con un cable, la carga se reparte hasta que los dos tengan la misma cantidad. | La carga pasa hasta que los dos tengan el mismo **potencial**. Un cuerpo grande se queda con más carga. | "La mayoría" de alumnos de bachillerato y de primeros años de universidad; sin porcentaje en las fuentes leídas. En el grupo de control, solo 5 % a 22,5 % acierta las preguntas que exigen distinguir carga de potencial. | Guisasola y otros (2010) |
| EL9 | **Los polos de un imán son cargas eléctricas.** El polo norte es positivo; un imán atrae o repele una carga quieta. | Un imán no ejerce fuerza sobre una carga en reposo. | Muchos de 214 universitarios, según una revisión; sin porcentaje en las fuentes leídas. En otro test, solo 41 % acierta después del curso (38 % antes). Ver MG1. | Maloney (1985), vía Sağlam y Millar; Singh (2017) |

**Lo que se aprende.** Los alumnos de Barcelona no tienen errores sueltos: el 64,6 % respondió de forma coherente con un modelo, solo que equivocado (Bohigas y Periago, 2010). Es el mismo resultado que en dinámica: "el más fuerte empuja más" (D10 en [dinámica](dinamica-ideas-erroneas.md)). La escena de Coulomb debe mostrar siempre **las dos flechas** de fuerza, del mismo color y del mismo largo, aunque las cargas se dibujen de distinto tamaño.

### Corriente y circuitos de corriente continua

Dos fuentes principales:

- **Periago y Bohigas (2005):** cuestionario de 9 preguntas a **184 estudiantes** de segundo año de ingeniería industrial y química en Barcelona, al empezar el curso de electromagnetismo. Es el dato más cercano a un postulante: alumnos que ya aprobaron circuitos en el bachillerato.
- **Engelhardt y Beichner (2004):** el test DIRECT, versión 1.0, con **1135 alumnos** de secundaria (454) y universidad (681) de Estados Unidos. El promedio fue 48 %. El artículo trae el porcentaje de cada opción en cada pregunta (tabla III). Las figuras no salieron al extraer el texto; uso solo las preguntas que se entienden sin la figura o que el artículo explica.

| # | Idea errónea | Lo correcto | Qué tan frecuente | Fuente |
| --- | --- | --- | --- | --- |
| C1 | **La pila es una fuente de corriente constante.** Entrega siempre la misma corriente, se conecte lo que se conecte. | La pila mantiene (casi) constante el **voltaje**. La corriente depende del circuito. | Es la idea que más usaron los alumnos en las entrevistas del DIRECT. En Barcelona, 83,7 % de las respuestas al ordenar el brillo de tres circuitos se explican con ella, según los autores; 65,2 % en otra pregunta. | Engelhardt y Beichner (2004); Periago y Bohigas (2005), Q7 y Q8; Cohen, Eylon y Ganiel (1983) |
| C2 | **La corriente se gasta.** Sale de la pila, cada bombilla consume una parte y vuelve menos. De dos bombillas iguales en serie, brilla más la primera. | La corriente es la misma en todo un circuito en serie. Lo que se transforma en luz y calor es energía, no corriente. | De dos bombillas iguales en serie, 58,2 % de 184 dice que brilla más una. En otra pregunta, 44,0 % dice que la corriente se gasta al pasar por la bombilla. | Periago y Bohigas (2005), Q3 y Q4; Shipstone (1984) |
| C3 | **Las cargas se gastan en la bombilla** y se convierten en luz. | La carga se conserva. Se transforma la energía. | 23 % de 1135 (dos opciones del DIRECT 1.0). | Engelhardt y Beichner (2004), pregunta 1 |
| C4 | **Razonamiento secuencial.** Un cambio en el circuito afecta solo a lo que viene "después" del cambio, en el sentido de la corriente. | Todo el circuito cambia a la vez. | Al aumentar una resistencia entre dos bombillas, 37 % dice que la primera no cambia y solo la segunda se apaga un poco. Acierta 45 % (las dos bajan). | Engelhardt y Beichner (2004), pregunta 26; Closset (1983) |
| C5 | **Cada parte del circuito es independiente.** Al quitar una bombilla de un paralelo, la otra recibe "toda la corriente" y brilla más, mientras la bombilla en serie con ellas sigue igual. | Al quitar la bombilla, la resistencia total sube y la corriente total baja: la bombilla en serie brilla menos y la que queda en paralelo brilla más. | 46,2 % de 184 da la respuesta incorrecta descrita. Solo **1 de 184 (0,5 %)** acierta. | Periago y Bohigas (2005), Q8 |
| C6 | **Más pilas, siempre más brillo** (superposición de pilas). Dos pilas dan el doble de energía y de voltaje, estén en serie o en paralelo. | En serie, los voltajes se suman. En paralelo, el voltaje es el de una sola pila. | 21 % cree que dos pilas en paralelo dan más voltaje (DIRECT 1.1, 692 alumnos). | Engelhardt y Beichner (2004), versión 1.1, pregunta 7 |
| C7 | **El voltaje es consecuencia de la corriente.** Si no pasa corriente, no hay voltaje; si se duplica la corriente por la pila, se duplica su voltaje "porque V = IR". | El voltaje de una pila ideal es propio de la pila. Hay voltaje entre dos puntos aunque no pase corriente. | Duplicar corriente: 47 % elige "sí, porque V = IR"; solo 25 % acierta. Pila de 12 V con un tramo sin corriente: 56 % dice 0 V; solo 21 % acierta. 28 % de los alumnos muestra confusión entre corriente y voltaje. | Engelhardt y Beichner (2004), preguntas 24 y 28; Cohen, Eylon y Ganiel (1983) |
| C8 | **Sin componente entre dos puntos, no hay voltaje.** O: el voltaje entre dos puntos no cambia al modificar el circuito. | Hay que seguir el circuito entero y ver qué potencial tiene cada punto. | 27,2 % de 184 dice que el voltaje entre dos puntos sin componentes es cero; 22,3 %, que no cambia. Acierta 1,6 %. En el estudio original con escolares, 45 % eligió "cero" y acertó 15 %; entre profesores en ejercicio acertó 4 %. | Periago y Bohigas (2005), Q9; Cohen, Eylon y Ganiel (1983), vía Periago y Bohigas |
| C9 | **Hay voltaje en un cable sin resistencia.** | Entre dos puntos de un cable ideal la diferencia de potencial es cero. | Cerca de 10 % de 184. | Periago y Bohigas (2005), Q6 |
| C10 | **Pilas opuestas no dan voltaje**, porque "los polos positivos están juntos". O: hay voltaje, pero no pasa corriente. | Dos pilas de distinta fem en oposición dan una fem neta igual a la diferencia, y pasa corriente. | 21,2 % de 184 dice que no hay voltaje; 31,5 % dice que hay voltaje pero no pasa corriente por la bombilla. En otro estudio, 47 % dijo que no hay voltaje. | Periago y Bohigas (2005), Q2; Furió y Guisasola (1999), vía Periago y Bohigas |
| C11 | **La corriente se reparte por mitades en cada nudo**, sin mirar la resistencia de cada rama (razonamiento local). | Por la rama de menor resistencia pasa más corriente. | Documentado en entrevistas del DIRECT; sin porcentaje en las fuentes leídas. | Engelhardt y Beichner (2004); von Rhöneck y Grob, vía Engelhardt y Beichner |
| C12 | **No ver el cortocircuito.** Un circuito con la pila en corto se acepta como circuito que funciona. | La corriente toma el camino sin resistencia; las bombillas en paralelo con el corto se apagan. | 17 % no identifica un corto o su efecto. | Engelhardt y Beichner (2004) |
| C13 | **Una bombilla puede encender con un solo polo de la pila**, como una fuente de agua. | Hace falta un circuito cerrado. | Cerca de 10 % de 184 universitarios. | Periago y Bohigas (2005), Q1 |
| C14 | **Potencia: al agregar una resistencia en serie, la potencia de la primera no cambia.** | La corriente baja, así que baja la potencia de cada resistencia. | 32 % elige "se mantiene"; 55 % acierta. El objetivo "potencia" fue el peor del test: 37 % de aciertos. | Engelhardt y Beichner (2004), pregunta 2 (la serie se deduce de la clave de respuestas) y tabla I |
| C15 | **El amperímetro consume corriente**, como una bombilla. | Un buen amperímetro deja pasar la corriente sin cambiarla casi nada. | Reportado en escolares griegos de 14-15 años; sin porcentaje en las fuentes leídas. | Psillos, Koumaras y Valassiades (1987), vía Engelhardt y Beichner |

**El dato de McDermott.** En el circuito "una bombilla sola, dos en serie y dos en paralelo, con pilas iguales", el orden correcto (la sola igual a las de paralelo, y las de serie más débiles) lo dio cerca del **15 % de más de 1000 alumnos** de física universitaria con cálculo. Lo mismo dieron profesores de física de secundaria y profesores universitarios de otras ciencias. Entre asistentes de cátedra y posdoctorados de física (unos 100), cerca del 70 %. El resultado fue igual antes y después de la instrucción. Lo leí en las diapositivas de la propia McDermott, no en el artículo de 1992.

**Lo que se aprende.** Es el patrón de dinámica llevado al extremo. El alumno de Barcelona resuelve el problema numérico (79,9 % acertó la primera parte de Q8) y falla la pregunta cualitativa del mismo circuito (0,5 %). Los autores lo atribuyen a una enseñanza basada en calcular. Engelhardt y Beichner encontraron además que el alumno no usa un modelo único: cada pregunta activa un error distinto. Para el laboratorio, la escena de circuitos debe amarrar por color el **brillo de cada bombilla** a su potencia, y mostrar la corriente con un número en cada tramo, el mismo antes y después de cada bombilla.

### Magnetismo e inducción

| # | Idea errónea | Lo correcto | Qué tan frecuente | Fuente |
| --- | --- | --- | --- | --- |
| MG1 | **Un imán ejerce fuerza sobre una carga quieta.** El imán se ve como un dipolo eléctrico (norte positivo, sur negativo). | La fuerza magnética necesita que la carga se mueva: F = qvB sen θ. | Un dipolo eléctrico y un imán frente a una carga quieta: solo 41 % acierta después del curso (466 alumnos); 38 % antes (127). El error más común: sumar la fuerza del imán. | Singh (2017); Maloney (1985), vía Sağlam y Millar |
| MG2 | **La fuerza magnética va en la dirección del campo** (o en contra). Una carga que entra paralela al campo, pero en sentido contrario, se frena. | La fuerza es perpendicular al campo y a la velocidad. Si la velocidad es paralela al campo, no hay fuerza. | Fue el error más común en esa pregunta; sin porcentaje en el texto leído. En otra pregunta sobre la orientación de la fuerza, acierta 24 % antes y 43 % después. En entrevistas con un imán real, alumnos que sabían la fórmula predijeron que el cable iría hacia un polo. | Singh (2017), preguntas 4 y 6 |
| MG3 | **Usar el ángulo equivocado.** Leer el ángulo de la velocidad con la horizontal como si fuera el ángulo con el campo. | Lo que importa es el ángulo entre v y B. | Fue el error más común en esa pregunta; sin porcentaje en el texto leído. | Singh (2017), pregunta 5 |
| MG4 | **Corrientes opuestas se atraen**, "como cargas opuestas". | Corrientes en sentidos opuestos se repelen; en el mismo sentido, se atraen. | El error más común en esa pregunta; sin porcentaje en el texto leído. Ninguno de los entrevistados que acertó pudo explicarlo con las dos reglas de la mano derecha: lo habían memorizado. | Singh (2017), pregunta 2 |
| MG5 | **El campo se anula entre dos corrientes opuestas**, por analogía con "dos efectos iguales y opuestos se cancelan". | Entre dos corrientes opuestas, los campos de las dos **se suman**. | Acierta 39 % después del curso (466 alumnos), sin mejora respecto de antes. En la pregunta parecida del CSEM, 63 %. | Singh (2017), pregunta 3 |
| MG6 | **El cable con más corriente ejerce más fuerza** sobre el otro. | Las dos fuerzas son iguales (tercera ley). Es EL1 en magnetismo. | Sin porcentaje en las fuentes leídas. | Maloney y otros (2001), vía Sağlam y Millar |
| MG7 | **Un imán quieto cerca de la bobina induce corriente.** | Solo se induce corriente si cambia el flujo. | Acierta 26 % antes y 68 % después (47 alumnos de un laboratorio universitario). | Secrest y Novodvorsky (2005), pregunta 23 |
| MG8 | **No saber el sentido de la corriente inducida** (ley de Lenz). Algunos deciden solo por el polo del imán; otros, solo por si se acerca o se aleja. | La corriente inducida crea un campo que se opone al **cambio** de flujo. | Al alejar el polo norte de un anillo, 81 % sabe que hay corriente, pero solo 45 % acierta el sentido; 36 % elige el contrario (47 alumnos, después del curso). | Secrest y Novodvorsky (2005), pregunta 24 |
| MG9 | **La corriente inducida va en contra del campo** (y no en contra del cambio del flujo). Es una lectura literal del enunciado de Lenz. | Si el flujo disminuye, la corriente inducida **refuerza** el campo. | Sin porcentaje en las fuentes leídas. | Bagno y Eylon (1997), vía Sağlam y Millar |
| MG10 | **Confundir flujo con campo, o flujo con cambio de flujo.** Ver la fem en el flujo y no en su variación; no ver que cambiar el área también induce. | La fem es la rapidez con que cambia el flujo: ε = −N ΔΦ/Δt. | Lista de dificultades documentadas en la revisión de Zuza, García y Guisasola (2012); sin porcentaje en las fuentes leídas. En Arizona, casi todos aceptan que cambiar el área induce corriente, pero en entrevistas pocos lo explican por el área: dicen que "la fuerza del imán aumenta". | Pantoja y Moreira (2021), resumen de esa revisión; Secrest y Novodvorsky (2005) |

**Lo que se aprende.** Singh encontró que el alumno sabe la regla en papel y la abandona frente a un experimento real: con el imán en la mano vuelve a "la fuerza va hacia el polo". Es un argumento a favor de la escena: la predicción debe hacerse **frente al dibujo en 3D**, no frente a la fórmula. Muchos errores de magnetismo copian errores de electrostática (MG1, MG4, MG5, MG6). Conviene que ambas plantillas usen la misma convención de colores para fuerza y campo.

### Física moderna: efecto fotoeléctrico

| # | Idea errónea | Lo correcto | Qué tan frecuente | Fuente |
| --- | --- | --- | --- | --- |
| FM1 | **Aplicar V = IR al fotoeléctrico.** El voltaje de la pila hace pasar corriente o "ayuda a vencer la función trabajo". | El voltaje solo acelera o frena los electrones que ya salieron. Si la luz no los arranca, no hay corriente con ningún voltaje. | En una pregunta de examen (luz que no arranca electrones, ¿qué pasa al subir el voltaje de 0 a 5 V?), solo 20 % de 26 alumnos de la Universidad de Washington con enseñanza tradicional acertó. En Colorado, con la simulación, 77-85 %. El 42 % de los que fallaron alguna parte cometió este error. | Steinberg, Oberem y McDermott (1996), vía McKagan y otros (2009) |
| FM2 | **No separar intensidad de frecuencia.** Más intensidad, electrones más rápidos; o con luz más intensa salen electrones aunque la frecuencia sea baja. | La intensidad cambia **cuántos** electrones salen. La frecuencia cambia **la energía** de cada uno. Bajo la frecuencia umbral no sale ninguno. | Al duplicar la intensidad de una luz que no arranca electrones, acertó 40 % de 26 alumnos con enseñanza tradicional. En Colorado, 5 % de los que fallaron dijo explícitamente que basta subir la intensidad. | Steinberg y otros, vía McKagan y otros (2009) |
| FM3 | **No reconocer la frecuencia de corte en la gráfica** energía cinética vs frecuencia. | Es una recta que empieza en la frecuencia umbral; por debajo, no hay electrones. | Antes de ver opciones, solo 16 % dibujó algo parecido a la gráfica correcta (Colorado, primavera de 2007). Con opciones y discusión, entre un tercio y la mitad. | McKagan y otros (2009) |
| FM4 | **Más velocidad de los electrones, más corriente.** | La corriente depende de cuántos electrones llegan por segundo, no de su rapidez. | Debates "acalorados" en clase; sin porcentaje en las fuentes leídas. | McKagan y otros (2009) |
| FM5 | **El fotón tiene carga.** | El fotón es neutro. | Reportado por Steinberg y otros. McKagan y otros no lo encontraron en sus alumnos. | Steinberg y otros, vía McKagan y otros (2009) |

**Un dato sobre los profesores.** El 80 % de los profesores universitarios encuestados por McKagan y otros creía que sus alumnos ya lograban los objetivos del tema. La investigación dice que no. Es el mismo aviso que en circuitos: lo que el alumno calcula no prueba lo que entiende.

**Cuerpo negro y Planck.** No encontré estudios con datos de alumnos. Queda en "Huecos".

### Refracción y reflexión total

Fuente principal: Fyttas, Komis y Ravanis (2013), cuestionario escrito a **213 escolares griegos de 14-15 años** (noveno grado). Ya habían estudiado la refracción dos veces, la segunda con la ley de Snell. Es una población más joven que un postulante, pero es el único estudio con porcentajes que encontré.

| # | Idea errónea | Lo correcto | Qué tan frecuente | Fuente |
| --- | --- | --- | --- | --- |
| R1 | **El rayo no se desvía** al pasar del aire al vidrio, "porque el vidrio es transparente". | Al entrar oblicuo al vidrio, el rayo se acerca a la normal. | 57,7 % de 213. | Fyttas y otros (2013), tarea 1 |
| R2 | **La luz no entra a un medio más denso**; rebota en la superficie. | La mayor parte entra y se refracta; una parte se refleja. | 21,1 % de 213. De los que justificaron, 22 dijeron que se refleja "porque el vidrio es más denso". | Fyttas y otros (2013), tarea 1 |
| R3 | **Desviación al revés.** Al entrar al vidrio, el rayo se aleja de la normal; al salir del agua, se acerca. | Del medio de menor índice al de mayor, se acerca a la normal; al revés, se aleja. | 8,5 % (aire a vidrio) y 9,9 % (agua a aire). | Fyttas y otros (2013), tareas 1 y 2 |
| R4 | **El rayo no sale del agua "porque el agua es más densa".** Se confunde con reflexión total, pero sin ángulo límite. | Con incidencia pequeña, el rayo sale y se aleja de la normal. La reflexión total ocurre solo si el ángulo supera el ángulo límite. | 13,6 % de 213. Ninguno mencionó la reflexión total. | Fyttas y otros (2013), tarea 2 |
| R5 | **El rayo no se desvía al salir del agua al aire.** | Se aleja de la normal. | 56,8 % de 213. Solo 19,7 % dibujó bien el rayo (6,1 % con buena justificación). | Fyttas y otros (2013), tarea 2 |
| R6 | **Con incidencia perpendicular, el rayo se desvía o rebota.** | Con incidencia normal, el rayo sigue recto. | 16,0 % dibuja una desviación; 23,9 % dibuja que el rayo vuelve. Siguen recto 51,2 %, pero solo 9,4 % lo justifica por la incidencia normal. | Fyttas y otros (2013), tarea 3 |
| R7 | **Cada caso tiene su regla**: prismas, láminas y superficies curvas se resuelven por separado, sin la ley de refracción como principio general. | Una sola ley (Snell) para todos los casos. | Sin porcentaje en las fuentes leídas. | Singh y Butler; Galili, Bendall y Goldberg (1993); ambos vía Fyttas y otros (2013) |

## Lo que no tiene respaldo (todavía)

Errores de cálculo típicos de problemas de admisión. No encontré estudios que los midan; la columna de la derecha dice de qué error documentado saldrían.

| Tema | Error que suponemos | Error documentado del que sale |
| --- | --- | --- |
| Coulomb | Al duplicar la distancia, la fuerza baja a la mitad (usar 1/r en vez de 1/r²) | Ninguno directo |
| Coulomb | Olvidar pasar µC a C, o sumar fuerzas como números sin mirar su dirección | Ninguno directo |
| Campo y potencial | Si el campo es cero en un punto, el potencial también (y al revés). Entre dos cargas opuestas iguales, "todo se anula" | MG5 y las entrevistas de Singh (2017) sobre el campo en el punto medio |
| Condensadores | En serie, sumar capacidades (Ceq = C1 + C2), como si fueran resistencias en serie | Parcial: en las entrevistas del DIRECT aparece el error inverso, calcular voltajes con fórmulas de capacidad equivalente (Engelhardt y Beichner, 2004) |
| Condensadores | En serie, poner cargas distintas en cada condensador; o repartir el voltaje en partes iguales | C2 y C11: el reparto "por partes iguales" |
| Resistencias | Sumar resistencias en paralelo como en serie | Documentado como error de aplicación de reglas en entrevistas del DIRECT, sin porcentaje |
| Potencia | En paralelo, creer que brilla más la bombilla de mayor resistencia (usar P = I²R con la corriente fija) | C1: pila de corriente constante |
| Amperímetro y voltímetro | Conectar el amperímetro en paralelo o el voltímetro en serie; creer que el voltímetro ideal deja pasar corriente | C15 |
| Kirchhoff | Errores de signo al recorrer una malla, sobre todo al cruzar una pila al revés | C10 |
| Efecto Joule | Confundir energía (J) con potencia (W), o usar minutos en vez de segundos | Ninguno directo |
| Campo de un conductor | Usar 1/r² en vez de 1/r para el hilo largo; invertir dedos y pulgar en la regla de la mano derecha | Parcial: en entrevistas, un alumno invirtió dedos y pulgar (Secrest y Novodvorsky, 2005) |
| Faraday | Usar el flujo en vez de su cambio; olvidar multiplicar por N espiras | MG10 |
| Transformador | Creer que funciona con corriente continua; invertir la razón de vueltas | MG7: no ver que hace falta un cambio de flujo |
| Fotoeléctrico | Calcular la energía cinética como hf, sin restar la función trabajo; mezclar joules y electronvoltios | FM2 |
| Fotoeléctrico | Creer que con más intensidad sube el potencial de frenado | FM2 |
| Refracción | Medir los ángulos desde la superficie y no desde la normal | Ninguno directo |
| Ángulo límite | Calcular sen L = n₂/n₁ con los índices al revés, o creer que hay reflexión total al pasar a un medio de mayor índice | R4 |

Se confirman igual que en los otros temas: con hojas resueltas en la prueba del pase 2 y con predicciones de respuesta abierta.

## Propuesta para las plantillas

### Circuitos (la plantilla más importante del bloque)

**Hecho (5 nov 2026):** `plantillas/circuitos-cc/`. Tiene:
- un motor nodal general con detección de cortos y 35 pruebas;
- 9 casos y 9 problemas de papel verificados con fracciones por métodos distintos;
- el problema guiado 1, con dos predicciones;
- "¿qué pasa si…?" con McDermott, C2, C6, C10, C1/C7 y C12;
- el explorador, con el modo altura.

Faltan los medidores que se arrastran (C15); el motor ya los resuelve.

Es la más importante por tres razones: tiene los datos más fuertes, los errores más persistentes y el patrón más claro de "sabe calcular, no entiende". La regla de la escena: **cada bombilla brilla según su potencia**, con un color fijo para corriente (I), otro para voltaje (V) y otro para resistencia (R). La corriente se muestra como número en cada tramo, a la entrada y a la salida de cada bombilla.

**Problema guiado 1 (circuito mixto).** Pila ideal de 6 V. La bombilla B1 está en serie con dos bombillas en paralelo, B2 y B3. Las tres son iguales, de 12 Ω. Paso 1: ¿cuál brilla más? Paso 2 (predicción): *se quita B3 sin poner nada en su lugar. ¿Qué pasa con B1 y B2?*

| Opción | Error que representa | Respaldo |
| --- | --- | --- |
| a) B2 brilla más y B1 sigue igual | C1 y C5: la pila da la misma corriente y "toda va a B2" | 46,2 % de 184 (Periago y Bohigas, 2005) |
| b) B2 y B1 siguen igual | Cada bombilla es independiente del resto | 19,0 % de 184 |
| c) B2 y B1 brillan más | "Hay menos bombillas, sobra más corriente" | 5,4 % de 184 |
| d) B2 brilla más y B1 brilla menos | Correcta (P de B1 baja de 4/3 W a 3/4 W; la de B2 sube de 1/3 W a 3/4 W) | Solo 0,5 % de 184 acertó |

**Problema guiado 2 (el circuito de McDermott).** Tres pilas iguales. En la primera, una bombilla sola. En la segunda, dos en serie. En la tercera, dos en paralelo. Predicción: *ordena las cinco bombillas por su brillo.* Opciones: todas iguales (C1) / la sola brilla más que las de paralelo, que se reparten la corriente (C1 con reparto) / en serie brilla más la primera (C2) / la sola igual a las de paralelo, y las de serie más débiles (correcta). Respaldo: 4,3 % de 184 acierta (Periago y Bohigas, Q7); cerca del 15 % de más de 1000 en Estados Unidos (McDermott).

**Explorador.**
- Un interruptor para quitar o poner cada bombilla. Al tocarlo, **todo** el circuito se actualiza a la vez, también lo que está "antes" (ataca C4).
- Un deslizador de resistencia. Al subirlo, las dos bombillas a sus lados bajan su brillo juntas (pregunta 26 del DIRECT).
- Un modo "altura": el potencial dibujado como altura del cable. Cada bombilla es una bajada y la pila una subida. Muestra que un cable ideal no tiene bajada (C9) y que dos puntos sin componentes en medio pueden tener voltaje (C8).
- Medidores que el alumno arrastra. Si pone el amperímetro en paralelo, la escena muestra el corto (C15).
- Dos pilas que se pueden poner en serie, en paralelo o en oposición (C6 y C10).

### Electrostática

**Problema guiado.** Dos esferas iguales, del mismo peso, cuelgan de hilos iguales. Una tiene carga q y la otra 2q. Predicción: *¿cómo quedan los hilos?*

| Opción | Error que representa | Respaldo |
| --- | --- | --- |
| a) Se separan el mismo ángulo de la vertical | Correcta | 24,1 % de 133 (Bohigas y Periago, 2010) |
| b) La de carga q se aparta más, porque la de 2q la empuja más | EL1: la carga mayor ejerce más fuerza | 57,1 % de 133 |
| c) La de carga 2q se aparta más, porque tiene más carga | EL2: sobre la carga mayor actúa más fuerza | 18,8 % de 133 |
| d) Solo se aparta la de carga q; la de 2q queda vertical | Versión extrema de EL1 | Sin respaldo directo |

**Explorador.** Se arrastran dos cargas y se cambia su valor. Las dos flechas de fuerza tienen siempre el mismo largo, y se ve el cambio de 1/r² al alejarlas. En un segundo modo, el mapa de campo de una carga se ve **siempre**, haya o no carga de prueba. Al poner la carga de prueba aparece su flecha de fuerza, que cambia de sentido con el signo de la carga, mientras el campo no cambia (EL4 y EL5). Para condensadores, dos placas con deslizadores de área y distancia: la capacidad cambia aunque la carga sea cero (EL7).

### Magnetismo e inducción

**Problema guiado (inducción).** Un imán y una espira conectada a un amperímetro. Primero el imán se acerca, después se detiene cerca de la espira. Predicción: *con el imán quieto cerca, ¿qué marca el amperímetro?*

| Opción | Error que representa | Respaldo |
| --- | --- | --- |
| a) Corriente, porque el imán está cerca y su campo es fuerte | MG7 y MG10: la fem sale del campo, no de su cambio | Antes del curso, 74 % falló esta pregunta; después, 32 % (47 alumnos). El texto no separa las opciones incorrectas. |
| b) Corriente, pero más chica que cuando se movía | MG10: confundir flujo con cambio de flujo | Sin respaldo directo |
| c) Cero | Correcta | 26 % antes, 68 % después (Secrest y Novodvorsky, 2005) |
| d) Cero, pero solo si el imán está lejos | "El imán no es lo bastante fuerte a esa distancia" | Mencionado por pocos alumnos en entrevistas; sin porcentaje |

**Problema guiado (fuerza magnética).** Un protón entra en un campo uniforme, paralelo al campo y en sentido contrario. Opciones: sigue recto con la misma rapidez (correcta) / se frena (MG2, el error más común en Singh, 2017) / se desvía hacia arriba / se desvía hacia abajo (regla de la mano derecha aplicada sin mirar el ángulo).

**Explorador.** En inducción, un gráfico del flujo y otro de la fem, uno sobre el otro, mientras se arrastra el imán: la fem es la **pendiente** del flujo, no su altura. Es el mismo error que confundir pendiente con altura en cinemática (G2 en [cinemática](cinematica-ideas-erroneas.md)). Para Lenz, la espira dibuja su propio campo inducido con otro color. Se ve que se opone al cambio: al acercar el imán, lo repele; al alejarlo, lo atrae. En fuerza magnética, se gira la velocidad respecto del campo y la flecha de fuerza queda siempre perpendicular a las dos, en una vista 3D que se puede rotar con el dedo.

### Efecto fotoeléctrico

**Problema guiado.** Luz de 620 nm sobre un metal de función trabajo 2,5 eV. El amperímetro marca cero. Predicción: *si se duplica la intensidad de la luz, ¿qué marca el amperímetro?*

| Opción | Error que representa | Respaldo |
| --- | --- | --- |
| a) Corriente, porque llega el doble de energía | FM2: intensidad confundida con energía de cada fotón | Con enseñanza tradicional, acertó 40 % de 26 alumnos (no se separan los errores) |
| b) Cero: cada fotón trae 2 eV, menos que 2,5 eV | Correcta | 78-88 % con la simulación de McKagan, según el semestre (94 a 189 alumnos) |
| c) Cero, pero sale corriente si además se sube el voltaje de la pila | FM1: aplicar V = IR | El error más común: 42 % de los que fallaron |
| d) Salen electrones, pero más lentos | FM2 con FM4 | Sin respaldo directo |

**Explorador.** Como la simulación de PhET en la que se basa McKagan: deslizadores de longitud de onda, intensidad y voltaje, con los electrones visibles entre las placas. La intensidad cambia el número de electrones; la frecuencia, su velocidad. En el potencial de frenado, los electrones llegan justo al borde y vuelven. McKagan reporta que esa imagen funciona muy bien con los alumnos.

### Refracción y reflexión total

**Problema guiado.** Un rayo sale del agua (n = 4/3) hacia el aire con 37° respecto de la normal. Predicción: *¿cómo sigue el rayo?*

| Opción | Error que representa | Respaldo |
| --- | --- | --- |
| a) Sale y se aleja de la normal (53°) | Correcta | 19,7 % de 213 escolares (Fyttas y otros, 2013) |
| b) Sale sin desviarse | R5 | 56,8 % de 213 |
| c) Sale y se acerca a la normal | R3 | 9,9 % de 213 |
| d) No sale, porque el agua es más densa | R4 | 13,6 % de 213 |

**Explorador.** Se arrastra el ángulo de incidencia y la escena muestra los dos senos como segmentos de color. Al pasar del medio de mayor índice al de menor, el rayo refractado se va acostando hasta rozar la superficie en el ángulo límite. Más allá, solo queda el reflejado. Así la reflexión total aparece como el final de la refracción, no como una regla aparte. Para no reforzar R2, el rayo reflejado parcial se dibuja siempre, más tenue.

## Casos de prueba propuestos

Verificados con `fractions.Fraction` en Python. Unidades SI, salvo que se indique otra. sen 37° = 3/5, sen 53° = 4/5, k = 9 × 10⁹ N·m²/C², hc = 1240 eV·nm.

| Plantilla | Caso | Entrada | Salida esperada |
| --- | --- | --- | --- |
| Circuitos | Serie-paralelo | ε = 12 V; R1 = 4 Ω en serie con (6 Ω ∥ 3 Ω) | Req = 6 Ω; I = 2 A; V1 = 8 V; V del paralelo = 4 V; I(6 Ω) = 2/3 A; I(3 Ω) = 4/3 A |
| Circuitos | Potencias del mismo circuito | igual que arriba | P(4 Ω) = 16 W; P(6 Ω) = 8/3 W; P(3 Ω) = 16/3 W; total = 24 W = ε·I |
| Circuitos | Brillo, tres circuitos (McDermott) | ε = 6 V; bombillas de 12 Ω | Sola: 3 W; cada una en serie: 3/4 W; cada una en paralelo: 3 W |
| Circuitos | Mixto, antes de quitar B3 | ε = 6 V; B1 en serie con B2 ∥ B3, de 12 Ω | I1 = 1/3 A; P1 = 4/3 W; P2 = P3 = 1/3 W |
| Circuitos | Mixto, sin B3 | igual, sin B3 | I = 1/4 A; P1 = P2 = 3/4 W (B1 baja a 9/16 de su potencia; B2 sube a 9/4) |
| Electrostática | Coulomb, cargas distintas | q1 = 2 µC; q2 = 6 µC; r = 0,3 m | F = 6/5 N sobre **cada** carga |
| Electrostática | Coulomb, otra distancia | igual, r = 0,6 m / r = 0,15 m | F = 3/10 N / F = 24/5 N |
| Electrostática | Campo de cada carga en la posición de la otra | igual, r = 0,3 m | E de q2 en q1 = 6 × 10⁵ N/C; E de q1 en q2 = 2 × 10⁵ N/C (campos distintos, fuerzas iguales) |
| Condensadores | En serie | C1 = 3 µF; C2 = 6 µF; V = 12 V | Ceq = 2 µF; Q = 24 µC en cada uno; V1 = 8 V; V2 = 4 V; U = 144 µJ |
| Condensadores | En paralelo | igual, en paralelo | Ceq = 9 µF; U = 648 µJ |
| Inducción | Faraday | N = 100; A = 0,02 m²; B baja de 0,5 T a 0,1 T en 0,2 s; R = 8 Ω | ΔΦ por espira = −1/125 Wb; ε = 4 V; I = 1/2 A |
| Inducción | Fem de movimiento | B = 0,5 T; L = 0,4 m; v = 10 m/s | ε = 2 V |
| Inducción | Imán quieto | ΔΦ = 0 | ε = 0 |
| Transformador | Ideal | Np = 200; Ns = 50; Vp = 220 V; Ip = 0,5 A | Vs = 55 V; Is = 2 A |
| Fotoeléctrico | Con emisión | λ = 310 nm; φ = 2,5 eV | E del fotón = 4 eV; Kmax = 3/2 eV; potencial de frenado = 1,5 V |
| Fotoeléctrico | Sin emisión | λ = 620 nm; φ = 2,5 eV | E = 2 eV < φ: corriente cero con cualquier intensidad y voltaje |
| Fotoeléctrico | Umbral | φ = 2,5 eV | λ umbral = 496 nm |
| Fotoeléctrico | En joules | λ = 300 nm; h = 6,6 × 10⁻³⁴ J·s; e = 1,6 × 10⁻¹⁹ C | E = 6,6 × 10⁻¹⁹ J = 33/8 eV |
| Refracción | Aire a agua | n = 4/3; incidencia 53° | sen r = 3/5, r = 37° |
| Refracción | Agua a aire | n = 4/3; incidencia 37° | sen r = 4/5, r = 53° |
| Refracción | Ángulo límite | vidrio de n = 5/3 hacia aire | sen L = 3/5, L = 37° |
| Refracción | Reflexión total | vidrio de n = 5/3 hacia aire, incidencia 53° | sen r valdría 4/3 > 1: reflexión total |
| Refracción | Sin reflexión total | vidrio de n = 5/3 hacia aire, incidencia 30° | sen r = 5/6: el rayo sale |
| Refracción | Ángulo límite del agua | agua de n = 4/3 hacia aire | sen L = 3/4 (no es un ángulo notable) |

## Huecos y siguientes pasos

- **McDermott y Shaffer (1992), parte I.** No encontré una copia abierta. Las cifras de McDermott salen de sus diapositivas para el taller de profesores nuevos de la AAPT, que citan ese artículo. Si Gerson consigue el PDF, se verifican el 15 % y el tamaño de la muestra.
- **Cohen, Eylon y Ganiel (1983), Shipstone (1984, 1988) y Furió y Guisasola (1999)** los leí solo a través de Periago y Bohigas (2005) y de Engelhardt y Beichner (2004).
- **CSEM (Maloney y otros, 2001).** No pude abrir el artículo: la copia de Aalto pide inicio de sesión y la de Scribd no cargó. Un buscador dio un promedio de 31 % antes y 47 % después del curso en cursos con cálculo, pero no lo verifiqué y no lo uso en el catálogo. Sus afirmaciones de MG6 y de "cargas quietas sienten fuerza magnética" las leí en la revisión de Sağlam y Millar, sin porcentajes.
- **Inducción en español.** No pude abrir la revisión de Zuza, Almudí y Guisasola (Enseñanza de las Ciencias, 2012): el servidor dio errores de certificado y 503. El artículo en Physical Review (Zuza y otros, 2014) dio 403. Son las mejores fuentes para MG8 a MG10 y para transformadores.
- **Steinberg, Oberem y McDermott (1996)** solo a través de McKagan y otros (2009).
- **Reflexión total, condensadores en serie, transformadores, cuerpo negro y Planck:** sin estudios con porcentaje. Las predicciones de esas partes usan hipótesis.
- **Galili y la refracción:** no encontré un estudio de Galili con porcentajes sobre la idea de que "la luz se dobla hacia el medio denso". El dato disponible (Fyttas y otros) es de escolares de 14-15 años, más jóvenes que un postulante.
- **Ningún dato peruano** en este bloque. Las muestras en español son de Barcelona y del País Vasco: universitarios que ya aprobaron estos temas en el bachillerato. Es razonable esperar que un postulante esté igual o peor, pero hay que medirlo en la prueba del pase 2.
- **Qué sigue.** Circuitos tiene datos para construir la plantilla ya. Los cuestionarios de Periago y Bohigas (2005) y de Bohigas y Periago (2010) traen el porcentaje de cada respuesta. Sirven como inspiración, pero sus problemas no se copian al producto (regla 5).

## Fuentes

- [Periago y Bohigas (2005), *Persistencia de las ideas previas sobre potencial eléctrico, intensidad de corriente y ley de Ohm en los estudiantes de segundo curso de Ingeniería*, Revista Electrónica de Investigación Educativa 7(2)](https://redie.uabc.mx/redie/article/view/136). Leído completo, con anexos de respuestas. 184 estudiantes de la UPC.
- [Bohigas y Periago (2010), *Modelos mentales alternativos de los alumnos de segundo curso de Ingeniería sobre la Ley de Coulomb y el Campo Eléctrico*, Revista Electrónica de Investigación Educativa 12(1)](https://redie.uabc.mx/redie/article/view/241). Leído completo. 133 estudiantes de la UPC.
- [Engelhardt y Beichner (2004), *Students' understanding of direct current resistive electrical circuits*, American Journal of Physics 72(1), 98–115; preprint arXiv physics/0304040](https://arxiv.org/abs/physics/0304040). Leído completo (preprint), con las tablas por pregunta; sin las figuras de los circuitos.
- [McDermott, diapositivas *PER as a resource for improving student learning*, taller de profesores nuevos de la AAPT](https://aapt.org/Conferences/newfaculty/upload/McDermott_1306_NFW.pdf). Leído. Resume McDermott y Shaffer (1992), *Research as a guide for curriculum development: An example from introductory electricity. Part I*, American Journal of Physics 60(11), 994–1003, que no pude abrir.
- [Guisasola, Zubimendi, Franco y Ceberio (2010), *Secuencia de enseñanza basada en la investigación, para mejorar la comprensión del concepto de capacidad eléctrica en primer curso de universidad*, Investigações em Ensino de Ciências 15(3), 485–506](https://ienci.if.ufrgs.br/index.php/ienci/article/view/259). Leído completo. Fuente del dato de Park y otros (2001), que no leí.
- [Singh (2017), *Improving students' understanding of magnetism*, preprint arXiv 1701.01523](https://arxiv.org/abs/1701.01523). Leído completo; la tabla 1 no salió al extraer el texto, uso solo los porcentajes escritos en el cuerpo.
- [Secrest y Novodvorsky (2005), *Identifying student difficulties with understanding induced EMF*, preprint arXiv physics/0501093](https://arxiv.org/abs/physics/0501093). Leído completo. 47 alumnos con pre y postest, 30 entrevistas.
- [Pantoja y Moreira (2021), *Potentially meaningful teaching units on electromagnetic induction*, Caderno Brasileiro de Ensino de Física](https://periodicos.ufsc.br/index.php/fisica/article/view/75550). Leída la introducción, que resume la revisión de Zuza, García y Guisasola (2012).
- [Sağlam y Millar, revisión en Asia-Pacific Forum on Science Learning and Teaching 11(1), 2010](https://eduhk.hk/apfslt/v11_issue1/saglam/page2.htm). Leída la página de revisión. Fuente secundaria de Maloney (1985), Maloney y otros (2001) y Bagno y Eylon (1997).
- [McKagan, Handley, Perkins y Wieman (2009), *A research-based curriculum for teaching the photoelectric effect*, American Journal of Physics 77(1), 87–94; preprint arXiv 0706.2165](https://arxiv.org/abs/0706.2165). Leído completo. Fuente de los datos de Steinberg, Oberem y McDermott (1996).
- [Fyttas, Komis y Ravanis (2013), *Ninth grade students' mental representations of the refraction of light*, Revista Mexicana de Física E 59, 133–139](https://rmf.smf.mx/ojs/index.php/rmf-e/article/view/4706). Leído completo. 213 escolares griegos.
- [AAAS Project 2061, *Research on student learning: Electricity and magnetism*](https://letslearntogether.neocities.org/PDF/ScienceLit/Electricity%20and%20Magnetism%20-%20Research.pdf). Resumen de investigaciones, leído; sin porcentajes.
- [Zabriskie y Stewart (2019), *Multidimensional item response theory and the Conceptual Survey of Electricity and Magnetism*, Physical Review Physics Education Research 15, 020107](https://par.nsf.gov/servlets/purl/10170867). Leídos los antecedentes; no aporta porcentajes de ideas erróneas.
- Maloney, O'Kuma, Hieggelke y Van Heuvelen (2001), *Surveying students' conceptual knowledge of electricity and magnetism*, American Journal of Physics 69(S1), S12–S23. No lo pude abrir.
- Cohen, Eylon y Ganiel (1983), *Potential difference and current in simple electric circuits: A study of students' concepts*, American Journal of Physics 51(5), 407–412. Leído a través de Periago y Bohigas y de Engelhardt y Beichner.
- Shipstone (1984), *A study of children's understanding of electricity in simple DC circuits*, European Journal of Science Education 6(2), 185–198. Solo la referencia.
- Psillos, Koumaras y Valassiades (1987), *Pupils' representations of electric current before, during and after instruction on DC circuits*, Research in Science and Technological Education 5(2). Leído a través de Engelhardt y Beichner.
- Zuza, Almudí, Leniz y Guisasola (2014), *Addressing students' difficulties with Faraday's law: A guided problem solving approach*, Physical Review Special Topics – Physics Education Research 10, 010122. No lo pude abrir.
