# Física — Impulso y choques

**Propuesta de teoría para una app peruana de preparación universitaria**

Público: estudiantes de 5.º de secundaria y preuniversitario que estudian de manera independiente, principalmente en el celular. Fecha de revisión: 21 de noviembre de 2026.

Este documento propone contenidos, escenas y decisiones pedagógicas. No contiene código ni un banco de ejercicios calculados. Los casos y las escenas son originales. Las fuentes se usan para establecer el alcance, comprobar la física e identificar dificultades de aprendizaje. Las letras entre corchetes remiten a la sección 10.

## 1. Resumen en 5 líneas

1. La unidad enseña a describir el movimiento mediante la cantidad de movimiento y a relacionar su cambio con el impulso de una fuerza.
2. Enseña a elegir un sistema y un intervalo antes de decidir si su cantidad de movimiento se conserva.
3. Distingue los choques elásticos, los inelásticos y los casos en que los cuerpos quedan unidos.
4. Introduce la restitución y organiza problemas que combinan un choque con una caída, una subida o un frenado.
5. Lo que más cuesta es conservar los signos, distinguir el sistema de cada cuerpo y reconocer que conservar cantidad de movimiento no implica conservar energía cinética.

## 2. Qué se pregunta en los exámenes

### Alcance y frecuencia: qué permite afirmar la muestra

Se consultaron exámenes y solucionarios institucionales de la UNI, dos reproducciones de cuadernillos de admisión de San Marcos, un temario oficial de CEPRE-UNI y una separata de CEPRE San Marcos. Los materiales de San Marcos se pudieron leer en copias alojadas fuera del dominio universitario; esa procedencia limita la trazabilidad y se identifica en las referencias.

**No se encontró una serie completa y comparable que permita ordenar los temas por frecuencia en los exámenes de ambas universidades.** No se asignan porcentajes de aparición en admisión.

Sí se puede contar una muestra delimitada: los **11 ejercicios de esta unidad** en la semana 8 de CEPRE San Marcos, ciclo 2025-I: ejercicios de clase 1–6 y propuestos 1–5. Se excluyeron los de gravitación que comparte la separata. Clasificados por demanda principal, 5 tratan conservación o choques; 4, impulso; 1, suma vectorial; y 1, afirmaciones conceptuales. Por tanto, los dos primeros bloques predominan **en esa práctica**, sin demostrar predominio en admisión. [S02]

La dificultad de la tabla es una valoración de diseño: **básica**, una relación y conversiones; **media**, signos o elección de sistema; **alta**, varias relaciones, incógnitas o etapas. No es una dificultad estadística medida en postulantes.

| Tipo de pregunta | Universidad y evidencia localizada | Dificultad | Frecuencia que se puede sostener | Fuente |
|---|---|---|---|---|
| Hallar fuerza media, duración o cambio de velocidad a partir de un impulso. | San Marcos, admisión 2026-I, área D, p. 13; también CEPRE-UNI, segundo parcial reproducido en el volumen 2011-2. | Básica–media: unidades, signo y diferencia entre fuerza e impulso. | 1/11 en la práctica delimitada de San Marcos, si se separan gráficos y rebotes. Tasa de admisión desconocida. | [S02], [S04], [S07] |
| Interpretar una gráfica fuerza–tiempo: área, impulso y fuerza media. | CEPRE San Marcos, semana 8; impulso de fuerza variable en el temario de CEPRE-UNI. | Media: reconocer el área y conservar su signo. | 2/11 en aquella práctica. El temario acredita alcance, no frecuencia de examen. | [S01], [S02] |
| Calcular el impulso de un rebote contra una pared. | CEPRE San Marcos, semana 8. | Media: restar velocidades con sentidos opuestos. | 1/11 en aquella práctica. Sin tasa de admisión verificada. | [S02] |
| Sumar cantidades de movimiento de cuerpos con velocidades en distintas direcciones. | CEPRE San Marcos, semana 8; sistemas de partículas en CEPRE-UNI. | Media: componentes y suma vectorial. | 1/11 en aquella práctica. | [S01], [S02] |
| Aplicar conservación en unión de cuerpos, retroceso o choque entre dos cuerpos. | San Marcos 2025-II, área B, pregunta 84: cuerpos que quedan unidos. Diversas variantes en CEPRE San Marcos. | Media; aumenta si se desconoce una masa o hay sentidos opuestos. | 5/11 en la práctica, agrupando sus variantes. No equivale a una tasa de admisión. | [S02], [S03] |
| Juzgar afirmaciones sobre impulso y conservación. | CEPRE San Marcos; UNI 2012-1, Física, pregunta 3. | Media: exige condiciones de validez, no solo reemplazar datos. | 1/11 en la práctica de San Marcos; se localizó además el ejemplo UNI indicado. | [S02], [S06] |
| Obtener la energía cinética perdida después de un acoplamiento. | UNI 2020-1, tercera prueba, pregunta 10. | Media–alta: primero velocidad final; después, balance de energía cinética. | Ejemplo verificado; frecuencia en admisión no establecida. | [S05] |
| Relacionar restitución, velocidades y pérdida de energía. | CEPRE-UNI, segundo parcial incluido en el volumen 2017-1, Física, pregunta 1. | Media–alta: dos relaciones o comparación energética. | Ejemplo de evaluación preuniversitaria; no debe contarse como examen ordinario UNI. | [S08] |
| Separar choque y movimiento posterior: unión seguida de vuelo, o choque elástico entre recorridos por rampas. | UNI 2011-2, examen ordinario, Física, pregunta 17; UNI 2012-1, Física, pregunta 9. | Alta: hay que cambiar de principio entre etapas. | Dos ejemplos localizados en periodos diferentes; no constituyen una frecuencia representativa. | [S06], [S07] |
| Calcular centro de masa y relacionar su movimiento con el del sistema. | Incluido en el temario oficial de CEPRE-UNI 2023-2. | Media; alta si combina componentes y conservación. | Presencia curricular comprobada; no se confirmó una tasa ni un ejemplo de admisión dentro de esta muestra. | [S01] |
| Variantes específicas de UNA Puno, UNSA y UNSAAC. | La búsqueda no permitió formar una muestra verificable comparable para esta unidad. | No establecida. | No establecida. Esto no demuestra que el tema esté ausente. | Limitación de esta revisión. |

**Prioridad propuesta:** cantidad de movimiento con signos → impulso y área → sistema y conservación → choques y energía → restitución → problemas por etapas. Se apoya en el alcance comprobado y en las dificultades conceptuales; no se presenta como una predicción estadística del próximo examen.

## 3. Errores típicos

**Cómo leer la evidencia.** DOCUMENTADO significa que se leyó el trabajo original, aunque su copia esté en un repositorio o sitio distinto del editor. DE SEGUNDA MANO significa que solo se pudo comprobar un resumen. HIPÓTESIS identifica una dificultad propuesta para probar con alumnos, sin atribuirle una investigación que no se encontró.

La columna «por qué» describe el razonamiento comunicado en la fuente o una interpretación didáctica expresamente señalada. No establece causas psicológicas ni porcentajes aplicables a escolares peruanos. Los distractores de la sección 5 son nuevos: estar inspirados en una dificultad documentada **no los convierte en ítems validados**.

| Código | Qué hace o cree el alumno | Por qué: razonamiento o interpretación | Estado | Fuente |
|---|---|---|---|---|
| E-FUE | Dice que un objeto en movimiento «lleva fuerza». | Atribuye la fuerza al propio cuerpo; existe ambigüedad entre lenguaje cotidiano y magnitudes físicas. | DOCUMENTADO | Giorgi, Pozzo y Concari, 2005, estudio propio, sección III. [S11] |
| E-VEC | Trata la cantidad de movimiento como un número sin dirección. | Pierde el carácter vectorial al interpretar conservación. | DOCUMENTADO | Singh y Rosengrant, 2003, discusión de respuestas. [S09] |
| E-IMP | Supone que amortiguar y reducir la fuerza reduce necesariamente el impulso. | Confunde la intensidad de la fuerza con el cambio total producido. | DOCUMENTADO | Singh y Rosengrant, 2003, ítem 19 y discusión. [S09] |
| E-PART | Conserva por separado la cantidad de movimiento de cada cuerpo durante una interacción. | Traslada al individuo una propiedad del sistema. | DOCUMENTADO | Singh y Rosengrant, 2003, ítems 3 y 11. [S09] |
| E-ENE | Conserva energía cinética en un choque inelástico, sobre todo si no hay rozamiento externo. | Omite transformaciones internas durante la interacción. | DOCUMENTADO | Singh y Rosengrant, 2003, ítems 10 y 21. [S09] |
| E-REB | Evalúa un impacto mirando solamente la llegada y desatiende la salida. | No considera todo el cambio de cantidad de movimiento. | DOCUMENTADO | Singh y Rosengrant, 2003, ítem 23. [S09] |
| E-ET | Resuelve un péndulo balístico con un único principio para todo el proceso. | No distingue el choque del movimiento posterior. | DOCUMENTADO | Singh y Rosengrant, 2003, ítem 16. [S09] |
| E-DOM | Atribuye mayor fuerza de interacción al cuerpo más pesado o al que parece más activo. | Usa una idea de «dominancia» en la interacción. | DOCUMENTADO | Hestenes, Wells y Swackhamer, 1992, tabla de concepciones y discusión de la tercera ley. [S10] |
| E-ALG | Manipula fórmulas, pero no las conecta correctamente con el movimiento observado. | La desconexión entre formalismo y situación es la dificultad descrita por el resumen; aquí no se atribuye una causa comprobada. | DE SEGUNDA MANO | Lawson y McDermott, 1987, según ficha de ComPADRE. No se leyó el artículo completo. [S12] |
| H-MAS | Decide que duplicar la masa siempre duplica la cantidad de movimiento, aunque cambie también la velocidad. | Hipótesis: atiende una variable y mantiene mentalmente fija la otra. | HIPÓTESIS | Propuesta para pilotaje; sin fuente original localizada. |
| H-T | Cree que alargar un frenado siempre aumenta el impulso, aunque el estado inicial y final sean iguales. | Hipótesis: cambia el tiempo en una relación y olvida que la fuerza media también cambia. | HIPÓTESIS | Propuesta para pilotaje; sin fuente original localizada. |
| H-IGV | Concluye que fuerzas iguales durante el mismo tiempo producen velocidades finales iguales en masas diferentes. | Hipótesis: confunde igualdad de impulso con igualdad de cambio de velocidad. | HIPÓTESIS | Propuesta para pilotaje; sin fuente original localizada. |
| H-RESTA | Calcula el cambio como «inicial menos final» y obtiene un impulso en el sentido contrario. | Hipótesis: usa una resta recordada sin comprobar su significado. | HIPÓTESIS | Propuesta para pilotaje; sin fuente original localizada. |
| H-AREA | Usa la fuerza máxima o la altura del gráfico como si fueran el impulso. | Hipótesis: lee una ordenada cuando necesita un área. | HIPÓTESIS | Propuesta para pilotaje; sin fuente original localizada. |
| H-ALT | Interpreta el coeficiente de restitución como la fracción de altura recuperada o de energía conservada en cualquier choque. | Hipótesis: confunde razones distintas porque todas son números entre cero y uno en los ejemplos usuales. | HIPÓTESIS | Propuesta para pilotaje; sin fuente original localizada. |

**Alcance geográfico:** se encontró investigación original argentina sobre representaciones del movimiento [S11]. No se localizó en esta revisión un estudio peruano original suficientemente específico para documentar estos errores en esta unidad. No debe transformarse esta limitación de búsqueda en la afirmación de que ese trabajo no existe.

## 4. Lo que la unidad da por sabido

| Conocimiento previo | Qué debe poder hacer el alumno | Apoyo si no puede hacerlo |
|---|---|---|
| Masa y unidades. | Diferenciar masa de peso; convertir gramos a kilogramos y milisegundos a segundos. | Tarjeta de conversión con unidades visibles, sin exigir memoria de factores ocultos. |
| Velocidad y rapidez. | Distinguir dirección y sentido de rapidez; leer una velocidad negativa sin concluir que el cuerpo «va más lento». | Animación breve de ida y vuelta sobre una misma línea. |
| Vectores elementales. | Sumar y restar componentes; reconocer que vectores opuestos pueden cancelarse. | Apoyo con objetos que se mueven antes de dibujar las flechas. |
| Fuerzas y leyes de Newton. | Separar fuerza neta de una fuerza particular; reconocer pares de interacción que actúan en cuerpos distintos. | Identificar quién ejerce cada fuerza y sobre qué cuerpo. |
| Gráficas y áreas sencillas. | Leer ejes y unidades; obtener áreas de rectángulos, triángulos y trapecios. | Partir la región en figuras y conservar el signo respecto del eje del tiempo. |
| Energía y trabajo. | Reconocer energía cinética, potencial gravitatoria y transformaciones; distinguir conservación de energía total y mecánica. | Recordatorio antes de la idea 4. Las relaciones necesarias se vuelven a proporcionar. |
| Movimiento con aceleración constante. | Relacionar velocidad, desplazamiento y aceleración; separar movimiento horizontal y vertical. | Recordatorio antes de los rebotes verticales y del problema por etapas. |
| Álgebra elemental. | Despejar y resolver dos ecuaciones lineales; interpretar una razón y un porcentaje. | Resolución guiada con una incógnita por paso. |

Los apoyos no deben exigir conceptos que esta unidad todavía va a construir. No se requiere cálculo integral. En ejercicios, las fórmulas pertinentes y otras plausibles se entregan identificadas con sus condiciones; la decisión evaluada es cuál corresponde y por qué.

## 5. Las ideas, en orden

### Condiciones comunes de las seis ideas

- La primera imagen muestra el objeto. Los ejes, las flechas y los gráficos aparecen después, asociados a ese objeto.
- Los textos de «Lee» que siguen son las tres o cuatro tarjetas propuestas, en su orden. No incluyen preguntas ni la conclusión de la predicción.
- Cada misión usa un modelo escolar declarado. Sus masas, velocidades y metas son parámetros de diseño, salvo los datos expresamente documentados en la sección 8.
- La escena habilita solo las variaciones descritas para «Juega». La predicción introduce una situación que esa misión no permitió observar.
- El equipo comprobará que los controles permiten alcanzar la meta. Para velocidades objetivo se propone una tolerancia visible de ±0,01 m/s; las bandas de altura se indican directamente.
- Las opciones correctas están marcadas para el equipo editorial. En el producto se alternará su posición. No se mostrará la justificación hasta «Mira».
- «Así se resuelve» especifica un caso original y el desarrollo que debe escribir el equipo. Se entrega el método, sin resultados numéricos finales.

### Idea 1. La masa y la velocidad cuentan

**Pregunta que responde:** ¿cómo describimos el movimiento cuando no basta con comparar la rapidez?

**Aprendizaje:** el alumno reconoce que la cantidad de movimiento depende de la masa y de la velocidad, incluido su sentido.

**Objeto de la primera pantalla.** Un coche de carga de una ferretería, con bultos y una balanza al lado. El conjunto permite reconocer la carga antes de introducir una magnitud abstracta. La masa considerada incluye coche y carga.

**Lee — cuatro tarjetas**

1. «Este coche puede llevar cargas diferentes. La balanza permite conocer la masa del conjunto».
2. «Para describir cómo se mueve, registramos su velocidad: cuánto avanza por segundo y hacia qué lado».
3. «Llamaremos cantidad de movimiento a una magnitud que relaciona la masa del cuerpo con su velocidad. La observaremos junto al coche».
4. «Un vector tiene tamaño, dirección y sentido. Llamaremos módulo a su tamaño; una flecha nos ayudará a representarlo».

**Juega.** Con masa total fija de 40 kg, el alumno regula una marcha horizontal hacia la derecha entre 0,50 y 1,50 m/s. Un medidor muestra la cantidad de movimiento sin revelar todavía su fórmula. **Misión:** conseguir que marque 40 kg·m/s hacia la derecha. La masa y el sentido no pueden cambiar en esta misión. Son datos de un modelo, no una medición de una ferretería.

**Predice.** «Ahora aparece un segundo coche: tiene el doble de masa, se mueve con la mitad de rapidez y va en el sentido contrario al primero. ¿Cómo se comparan sus cantidades de movimiento?»

- **A. Correcta:** tienen igual módulo y sentidos opuestos.
- **B. Incorrecta — E-VEC:** son exactamente el mismo vector.
- **C. Incorrecta — H-MAS:** la del segundo tiene el doble de módulo porque su masa es el doble.
- **D. Incorrecta — E-FUE:** ambas se vuelven cero en cuanto una persona deja de empujar, aunque los coches sigan avanzando.

**Mira.** Se muestran ambos movimientos y, después, sus flechas asociadas. Sus longitudes coinciden y apuntan en sentidos opuestos. Al retirar una mano no desaparece la cantidad de movimiento de un coche que continúa avanzando.

**La regla, completa.** La cantidad de movimiento de un cuerpo se representa con \(\vec p\), su masa con \(m\) y su velocidad con \(\vec v\):

\[
\vec p=m\vec v.
\]

La masa se expresa en kilogramos; la velocidad, en metros por segundo; la cantidad de movimiento, en kilogramos metro por segundo. La flecha indica que la magnitud tiene dirección y sentido. Su módulo —la longitud de esa flecha— es masa por rapidez.

En una línea se elige un sentido positivo y se usa \(p=mv\) con signos. Si se necesitan dos direcciones perpendiculares, \(x\) e \(y\) nombran sus ejes: \(p_x=mv_x\) y \(p_y=mv_y\). El módulo es \(|\vec p|=\sqrt{p_x^2+p_y^2}\). No se suman aquí cantidades de movimiento de cuerpos diferentes: eso se construye en la idea 3.

La comparación debe hacerse respecto del mismo observador. Un cuerpo puede tener cantidad de movimiento distinta de cero aunque la fuerza neta sobre él sea cero. [S13]

**Palabras nuevas**

| Palabra | Explicación cotidiana | Tres ejemplos |
|---|---|---|
| Cantidad de movimiento | Una manera de describir cuánto movimiento lleva un cuerpo teniendo en cuenta su masa y cómo se desplaza; no es una fuerza almacenada. | Un coche cargado que avanza; una pelota que vuelve; una mochila que se desliza. |
| Vector | Un dato al que hay que añadir hacia dónde apunta. | Avanzar hacia la puerta; regresar hacia la pared; subir verticalmente. |
| Módulo | El tamaño de una cantidad con dirección, sin contar hacia qué lado apunta. | La rapidez de una pelota; el tamaño de una fuerza; la longitud de la flecha que representa una cantidad de movimiento. |

**Así se resuelve — guion.** Caso original: comparar el mismo coche antes y después de añadir una carga, con velocidades dadas. Pasos: delimitar coche más carga; expresar las masas en kilogramos; elegir el sentido positivo; asignar signo a cada velocidad; calcular cada cantidad de movimiento y comparar módulo y sentido. Cerrar comprobando las unidades, sin confundir «igual módulo» con «igual vector».

**Ahora tú — progresión**

1. Obtener cantidad de movimiento a partir de masa y velocidad.
2. Encontrar una masa o una velocidad desconocida.
3. Comparar dos estados en los que cambian simultáneamente masa y rapidez.
4. Resolver comparaciones con sentidos opuestos o componentes perpendiculares de la velocidad de un cuerpo.

### Idea 2. Importa cuánto dura la fuerza

**Pregunta que responde:** ¿cómo relacionamos una fuerza aplicada durante un tiempo con el cambio de movimiento?

**Aprendizaje:** el alumno distingue fuerza e impulso y relaciona este último con el cambio de cantidad de movimiento.

**Objeto de la primera pantalla.** Una pelota en una guía horizontal de baja fricción, con una pala acolchada que la empuja. La pelota aparece primero; luego se añaden el reloj y el registro de fuerza. La guía es un montaje escolar explícito.

**Lee — cuatro tarjetas**

1. «La pala toca la pelota durante un intervalo. El reloj registra cuándo empieza y cuándo termina el contacto».
2. «Durante el contacto, la fuerza puede cambiar. El sensor permite seguir esos cambios».
3. «Llamaremos impulso al efecto acumulado de una fuerza durante un intervalo. Compararemos ese registro con el movimiento de la pelota».
4. «La fuerza media resume ese registro mediante un valor constante equivalente durante el mismo intervalo. No tiene por qué coincidir con la fuerza más alta registrada».

**Juega.** La duración del empuje permanece fija y la pelota comienza en reposo. El alumno cambia la intensidad de una fuerza horizontal constante. **Misión:** lograr una velocidad de salida de 2,00 m/s hacia la derecha. No se puede variar el tiempo ni realizar un frenado durante esta misión.

**Predice.** «Una pelota llega horizontalmente y se detiene en dos recepciones. Su masa y velocidad de llegada son iguales. En la recepción acolchada tarda el doble en detenerse. Despreciamos otras fuerzas horizontales. ¿Qué ocurre con el impulso y con el módulo de la fuerza media de frenado?»

- **A. Correcta:** el impulso es el mismo y la fuerza media es menor.
- **B. Incorrecta — E-IMP:** el impulso es menor porque la recepción es más suave.
- **C. Incorrecta — E-FUE:** la fuerza media es igual porque la pelota trae la misma fuerza.
- **D. Incorrecta — H-T:** el impulso es mayor porque el contacto dura más.

**Mira.** Ambas recepciones muestran el mismo estado inicial y el mismo estado final. Los registros fuerza–tiempo tienen igual área con signo, aunque se repartan de manera diferente. Se comparan las fuerzas medias, sin afirmar que conocerlas determine los máximos de fuerza.

**La regla, completa.** El impulso neto se representa con \(\vec I_{\text{neta}}\). El símbolo \(\Delta\) significa «valor final menos valor inicial»; los subíndices \(i\) y \(f\) indican el inicio y el final del intervalo estudiado. Para masa constante:

\[
\vec I_{\text{neta}}=\Delta\vec p
=m(\vec v_f-\vec v_i)
=\vec F_{\text{med,neta}}\Delta t.
\]

Aquí \(\vec F_{\text{med,neta}}\) es la fuerza neta media y \(\Delta t\), la duración. Un impulso se mide en newton segundo: \(1\ \mathrm{N\,s}=1\ \mathrm{kg\,m/s}\).

En un gráfico de una componente de fuerza frente al tiempo, el impulso de esa componente es el **área con signo**: por encima del eje temporal es positiva y por debajo, negativa. Se calcula con las áreas de las figuras que forman el gráfico. La fuerza media de esa componente es el área dividida entre la duración. Si la fuerza varía linealmente, se puede promediar su valor inicial y final; no se generaliza ese procedimiento a cualquier gráfica.

El impulso de una fuerza particular no siempre coincide con el cambio total de cantidad de movimiento. El impulso de contacto se escribe \(\vec I_{\text{contacto}}\), y el de las demás fuerzas, \(\vec I_{\text{otras}}\). Si intervienen esas otras fuerzas:

\[
\vec I_{\text{contacto}}=\Delta\vec p-\vec I_{\text{otras}}.
\]

En una situación vertical hay que considerar el impulso del peso o justificar por qué es despreciable. Para un mismo cambio de cantidad de movimiento, aumentar el tiempo reduce el módulo de la fuerza neta media correspondiente. Esta conclusión no permite conocer por sí sola la fuerza máxima. [S14]

**Palabras nuevas**

| Palabra | Explicación cotidiana | Tres ejemplos |
|---|---|---|
| Impulso | Lo que una fuerza acumula durante el tiempo en que actúa; no es solo «qué tan fuerte». | Empujar brevemente una pelota; frenar un coche de juguete; recibir una pelota con las manos. |
| Fuerza media | Una fuerza constante que, durante el mismo tiempo, produciría el mismo impulso que la fuerza variable. | Sustituir un golpe irregular por un valor constante; comparar dos recepciones; resumir un registro del sensor. |
| Intervalo | El tramo de tiempo que hemos decidido observar. | Desde el primer contacto hasta la separación; desde el inicio hasta el final del frenado; entre dos marcas del reloj. |

**Así se resuelve — guion.** Caso original: una pala cambia la velocidad de una pelota en una guía; se proporciona un gráfico por tramos. Pasos: elegir el sentido positivo; identificar qué fuerza representa el gráfico; separar áreas positivas y negativas; sumarlas; usar el impulso neto para hallar el cambio de cantidad de movimiento; recuperar la velocidad final a partir de la inicial. Si se pide fuerza media, dividir el impulso entre la duración total.

**Ahora tú — progresión**

1. Hallar impulso con fuerza constante y duración.
2. Obtener fuerza media o tiempo de frenado, con conversiones de unidades.
3. Leer áreas de gráficos triangulares, rectangulares y trapezoidales.
4. Combinar áreas de signos diferentes y una velocidad inicial no nula.
5. Distinguir impulso de contacto e impulso neto cuando otra fuerza está especificada.

### Idea 3. Elige qué cuerpos vas a contar

**Pregunta que responde:** ¿cuándo se conserva la cantidad de movimiento de un conjunto?

**Aprendizaje:** el alumno delimita un sistema, identifica sus impulsos externos y conserva la cantidad de movimiento total cuando corresponde.

**Objeto de la primera pantalla.** Dos combis de juguete sobre una pista recta, con un pequeño resorte comprimido entre ellas. Se trata de un montaje escolar; no se representa una colisión real de pasajeros.

**Lee — tres tarjetas**

1. «Podemos estudiar una combi de juguete o estudiar las dos juntas. Llamaremos sistema al conjunto que elijamos».
2. «Algunas interacciones ocurren entre cuerpos del sistema. Otras provienen de objetos que dejamos fuera».
3. «Marcaremos el sistema y registraremos el movimiento de cada cuerpo antes y después de soltar el resorte».

**Juega.** Las dos combis tienen igual masa y empiezan en reposo. El sistema incluye ambas combis y el resorte, cuya masa se desprecia. El alumno cambia la compresión del resorte y observa la liberación. **Misión:** conseguir que la combi derecha salga a 0,30 m/s hacia la derecha. Las masas permanecen bloqueadas y se idealiza como despreciable el impulso externo horizontal.

**Predice.** «Repetimos la liberación desde el reposo, pero una combi tiene mayor masa. El resorte solo empuja a las dos combis y su masa es despreciable. ¿Cómo se comparan sus cambios de cantidad de movimiento?»

- **A. Correcta:** tienen igual módulo y sentidos opuestos.
- **B. Incorrecta — E-DOM:** el de la combi más liviana tiene mayor módulo, porque la más pesada transmite una fuerza mayor sobre ella.
- **C. Incorrecta — E-PART:** ambos son cero, porque cada combi debe conservar la cantidad de movimiento que tenía.
- **D. Incorrecta — H-IGV:** ambas terminan con la misma rapidez en sentidos opuestos, aunque sus masas sean distintas.

**Mira.** La combi de menor masa sale con mayor rapidez. Se muestran primero los movimientos, después las cantidades de movimiento y finalmente su suma. Una frontera alrededor de ambas combis y del resorte ayuda a localizar qué interacción es interna.

**La regla, completa.** La cantidad de movimiento total del sistema se escribe \(\vec P\). Se obtiene sumando los vectores de todos sus cuerpos, no sumando sus módulos. Para dos cuerpos:

\[
\vec P=\vec p_1+\vec p_2=m_1\vec v_1+m_2\vec v_2.
\]

Los subíndices 1 y 2 identifican cuerpos. Para un sistema de masa fija, el cambio de su cantidad de movimiento total es igual al impulso externo neto, \(\vec I_{\text{ext}}\):

\[
\vec P_f-\vec P_i=\vec I_{\text{ext}}.
\]

Si el impulso externo neto es cero entre los dos instantes elegidos, entonces \(\vec P_f=\vec P_i\). Si la fuerza externa neta es cero durante todo el intervalo, la cantidad de movimiento total permanece constante en todo él. Si el impulso externo es suficientemente pequeño para la precisión del problema, la conservación se usa como aproximación.

Las fuerzas de interacción internas forman pares iguales y opuestos sobre cuerpos distintos. Sus impulsos se cancelan en la suma del sistema; no se cancelan en el balance de cada cuerpo. Igual impulso no implica igual cambio de velocidad cuando las masas son distintas. Un contacto breve ayuda a despreciar ciertos impulsos externos, pero **su brevedad no demuestra por sí sola que sean despreciables**. [S15]

En una dimensión se suman valores con signo. En dos dimensiones se aplican las ecuaciones por separado a las componentes \(x\) e \(y\). Una componente puede conservarse aunque otra no lo haga: la condición se comprueba para cada dirección.

**Extensión dentro de esta misma idea: centro de masa.** Se llama centro de masa al punto que permite resumir la distribución de masa. \(M\) representa la masa total; \(x_1\) y \(x_2\), las posiciones de los cuerpos sobre el eje; \(x_{\mathrm{CM}}\), la posición de su centro de masa:

\[
M=m_1+m_2,\qquad
x_{\mathrm{CM}}=\frac{m_1x_1+m_2x_2}{M},
\qquad
\vec v_{\mathrm{CM}}=\frac{\vec P}{M}.
\]

\(\vec v_{\mathrm{CM}}\) es la velocidad del centro de masa. Se generaliza sumando todos los cuerpos y se calcula también por componentes. El centro de masa está en el punto medio de dos posiciones solo si las masas son iguales. Si \(\vec P\) se mantiene constante, su velocidad también: puede estar quieto o avanzar uniformemente. Este contenido se incluye por su presencia en CEPRE-UNI. [S01], [S17]

**Palabras nuevas**

| Palabra | Explicación cotidiana | Tres ejemplos |
|---|---|---|
| Sistema | El conjunto de cosas que decidimos contar en un mismo estudio. | Una pelota; dos combis de juguete; una persona y su mochila. |
| Impulso externo | El efecto acumulado de fuerzas ejercidas por algo que quedó fuera del conjunto elegido. | La pared sobre una pelota sola; el suelo sobre un carrito; una mano sobre dos juguetes que estudiamos juntos. |
| Conservación | Mantener el mismo total entre los instantes considerados, aunque cambie su reparto. | Dos juguetes se reparten cantidades opuestas al separarse; un cuerpo cede parte de su cantidad de movimiento a otro; el total permanece en cero mientras ambos se mueven. |
| Centro de masa | Un punto de referencia cuya posición da más importancia a donde hay más masa. | Dos juguetes iguales; un coche vacío junto a otro cargado; una barra con una carga en uno de sus extremos. |

**Así se resuelve — guion.** Caso original: una persona sobre una plataforma idealizada de baja fricción entrega movimiento a una mochila. Se dan las masas y la velocidad final de la mochila respecto del suelo. Pasos: elegir persona, plataforma y mochila como sistema; fijar el intervalo; evaluar el impulso externo horizontal; escribir la suma inicial y final con signos; despejar la velocidad restante; comprobar el sentido y que todas las velocidades usen el mismo observador.

**Ahora tú — progresión**

1. Elegir el sistema y reconocer fuerzas internas y externas.
2. Hallar una velocidad final cuando las demás se proporcionan.
3. Resolver separaciones y retrocesos con estado inicial en reposo o en movimiento.
4. Trabajar por componentes con dos o tres cuerpos, sin introducir aún una ley de restitución.
5. En la extensión UNI, encontrar posición o velocidad del centro de masa y comprobar su movimiento.

### Idea 4. Se juntan: revisa también la energía

**Pregunta que responde:** ¿qué se conserva y qué cambia cuando dos cuerpos quedan unidos?

**Aprendizaje:** el alumno calcula la velocidad común mediante conservación de cantidad de movimiento y examina por separado la energía cinética.

**Objeto de la primera pantalla.** Dos vagones de juguete con uniones de velcro o una pequeña cantidad de plastilina. Primero se observa el mecanismo que permite que queden unidos. Las ruedas se idealizan con inercia despreciable y la pista con rozamiento horizontal despreciable durante el choque.

**Lee — tres tarjetas**

1. «Llamaremos choque a una interacción breve entre cuerpos. Registraremos lo que sucede justo antes y justo después».
2. «Estos vagones pueden engancharse al encontrarse. Después seguiremos el movimiento del conjunto».
3. «La energía cinética describe energía asociada al movimiento. También la registraremos, por separado de la cantidad de movimiento».

**Juega.** Dos vagones iguales avanzan hacia la derecha. El delantero va a 0,20 m/s; el alumno regula la rapidez del trasero, siempre mayor que la del delantero. **Misión:** lograr que el conjunto avance a 0,40 m/s después de engancharse. No se permite invertir sentidos y el indicador de energía todavía no aparece.

**Predice.** «Ahora dos vagones iguales llegan con la misma rapidez en sentidos opuestos y quedan unidos. El impulso externo horizontal es despreciable. ¿Qué ocurre después?»

- **A. Correcta:** quedan en reposo; la energía cinética que tenían pasa a otras formas de energía.
- **B. Incorrecta — E-ENE:** quedan en reposo, pero la energía cinética total conserva su valor inicial positivo.
- **C. Incorrecta — E-VEC:** avanzan hacia algún lado porque las cantidades de movimiento iniciales se suman siempre como números positivos.
- **D. Incorrecta — E-PART:** cada vagón conserva su velocidad anterior, aunque los dos hayan quedado unidos.

**Mira.** Se detiene el conjunto. El total inicial de cantidad de movimiento era cero, aunque ambos vagones se movieran y tuvieran energía cinética. Se muestra la deformación o compresión del acoplamiento y un balance de energía, sin atribuir toda la transformación exclusivamente al calor.

**La regla, completa.** Si dos cuerpos quedan unidos, tienen la misma velocidad final. Si además el impulso externo del sistema es despreciable:

\[
m_1\vec v_{1,i}+m_2\vec v_{2,i}=(m_1+m_2)\vec v_f,
\qquad
\vec v_f=
\frac{m_1\vec v_{1,i}+m_2\vec v_{2,i}}{m_1+m_2}.
\]

La segunda expresión se obtiene despejando la primera: no es un atajo independiente.

La energía cinética se representa con \(E_c\), es una magnitud escalar y se mide en joules:

\[
E_c=\frac12m|\vec v|^2.
\]

La energía cinética total se obtiene sumando la de los cuerpos. No puede ser negativa; una velocidad negativa se eleva al cuadrado.

- En un **choque elástico**, la energía cinética total antes y después es la misma.
- En un **choque inelástico ordinario**, parte de esa energía se transforma en otras formas y la energía cinética total final es menor.
- En un **choque perfectamente inelástico**, los cuerpos quedan con una velocidad común. Para las mismas masas y el mismo estado inicial, es el caso de máxima pérdida de energía cinética traslacional compatible con la conservación de cantidad de movimiento. No implica que se pierda toda: puede quedar movimiento del conjunto.

Estas comparaciones se hacen entre antes y después del choque, no en el instante de máxima compresión. Que los cuerpos reboten no demuestra que el choque sea elástico. Que no se peguen tampoco demuestra conservación de energía cinética.

Se llamará \(E_{\text{dis}}\) a la disminución de energía cinética en los choques pasivos del modelo:

\[
E_{\text{dis}}=E_{c,i}-E_{c,f},
\qquad
\text{porcentaje de disminución}
=100\frac{E_{\text{dis}}}{E_{c,i}},
\quad E_{c,i}>0.
\]

La energía no desaparece: puede quedar en deformaciones, energía interna, sonido u otras formas. Conservación de cantidad de movimiento y conservación de energía cinética son condiciones diferentes. Los casos con liberación adicional de energía interna se dejan fuera de esta clasificación escolar de choques pasivos. [S16]

**Palabras nuevas**

| Palabra | Explicación cotidiana | Tres ejemplos |
|---|---|---|
| Choque | Un encuentro breve en el que dos cuerpos interactúan y pueden cambiar su movimiento. | Dos vagones de juguete; una pelota y una pared; una bola de plastilina y un receptor. |
| Elástico | Un choque que devuelve, al terminar, toda la energía cinética total que había al empezar. | Dos cuerpos idealizados que rebotan sin pérdida; el modelo ideal de una pelota contra una pared; dos deslizadores con un resorte ideal entre ellos. |
| Inelástico | Un choque que deja menos energía cinética total después de la interacción. | Plastilina que se pega; vagones que se enganchan; una pelota que rebota perdiendo rapidez. |
| Disipación | El paso de energía de movimiento a formas que ya no recuperamos como ese mismo movimiento en el proceso observado. | Deformar un acoplamiento; calentar ligeramente los materiales; producir sonido en un impacto. |

**Así se resuelve — guion.** Caso original: un vagón alcanza a otro y ambos quedan unidos. Pasos: seleccionar ambos vagones; justificar la conservación en la dirección estudiada; obtener la velocidad común con signos; calcular energía cinética total antes y después; obtener su disminución y, si se solicita, dividirla entre el valor inicial para hallar la fracción perdida. Comprobar que la velocidad común coincide con la del centro de masa ya conocido.

**Ahora tú — progresión**

1. Unión de un cuerpo en movimiento con otro inicialmente quieto.
2. Unión de cuerpos que se mueven en el mismo sentido o en sentidos contrarios.
3. Encontrar una masa o una velocidad inicial desconocida.
4. Comparar cantidad de movimiento y energía cuando el total de la primera es cero.
5. Hallar disminución de energía cinética y porcentaje, como demanda de nivel de admisión.

### Idea 5. Rebotar cambia el sentido

**Pregunta que responde:** ¿cómo describimos un rebote y obtenemos las velocidades después de un choque?

**Aprendizaje:** el alumno calcula el impulso teniendo en cuenta la salida y usa la restitución junto con la conservación que corresponda.

**Objeto de la primera pantalla.** Un balón de futsal sobre una losa deportiva, junto a una referencia de altura. La escena se inspira en un objeto cotidiano; el comportamiento concreto del piso y del balón pertenece al modelo y no se atribuye a cualquier cancha peruana.

**Lee — tres tarjetas**

1. «En un rebote registramos la llegada y la salida. La cámara lenta permite distinguir ambos momentos».
2. «El comportamiento depende de los dos cuerpos que entran en contacto y de las condiciones del encuentro».
3. «Para comparar choques distinguiremos la rapidez con que los cuerpos se acercan y la rapidez con que se separan».

**Juega.** El alumno suelta el balón desde distintas alturas, sin lanzarlo, sobre el mismo piso. **Misión:** conseguir que el primer rebote alcance una banda situada entre 0,35 y 0,45 m sobre el nivel de contacto, usando una referencia consistente para el balón. Solo se modifica la altura inicial; no se cambia de material ni se permite un rebote ideal.

**Predice.** «Ahora usamos un modelo ideal: una pelota llega horizontalmente a una pared fija y rebota con la misma rapidez, en sentido contrario. Comparamos ese choque con detener la misma pelota desde la misma velocidad de llegada. ¿Cómo es el impulso sobre la pelota durante el rebote?»

- **A. Correcta:** tiene el doble de módulo que al detenerla y apunta alejándose de la pared.
- **B. Incorrecta — E-REB:** es igual al de detenerla, porque la llegada es la misma.
- **C. Incorrecta — E-VEC:** es cero, porque la rapidez inicial y final es la misma.
- **D. Incorrecta — H-RESTA:** tiene el doble de módulo y apunta hacia la pared.

**Mira.** Primero se observa la detención y luego el rebote. Se superponen las velocidades inicial y final y se construye su diferencia. La pared invierte el sentido: no basta comparar los módulos de las velocidades.

**La regla, completa.** Para cualquier rebote se aplica el impulso neto de la idea 2. Si el sistema es solamente la pelota, la pared ejerce un impulso externo: **no se conserva la cantidad de movimiento de la pelota sola**.

Para dos cuerpos que chocan en una línea, el coeficiente de restitución se representa con \(e\). Se define como la razón entre la rapidez relativa de separación y la rapidez relativa de acercamiento. «Relativa» significa comparar un movimiento con el del otro cuerpo.

Si el cuerpo 1 está inicialmente a la izquierda del 2, ambos se están acercando y se toma la derecha como positiva:

\[
e=\frac{v_{2,f}-v_{1,f}}{v_{1,i}-v_{2,i}},
\qquad v_{1,i}-v_{2,i}>0.
\]

Las velocidades llevan signo. No se sustituyen por sus módulos de manera automática. Si el impulso externo es despreciable, se combina esa relación con:

\[
m_1v_{1,i}+m_2v_{2,i}=m_1v_{1,f}+m_2v_{2,f}.
\]

Son dos ecuaciones para dos velocidades finales. Se enseñará a resolverlas, sin pedir memorizar expresiones finales para cada masa.

En el modelo unidimensional de cuerpos sin rotación y choques pasivos:

- \(e=1\): choque elástico.
- \(0<e<1\): choque inelástico con separación.
- \(e=0\): misma velocidad inmediatamente después en la dirección estudiada. El valor cero por sí solo no demuestra una unión permanente.

La relación de velocidades para \(e=1\) también se obtiene combinando conservación de cantidad de movimiento y de energía cinética, factorizando la diferencia de cuadrados. Para otros valores, \(e\) es un dato empírico del contacto y sus condiciones: no se deduce únicamente de conservación de energía ni es una constante universal de un material. [S18]

**Caso de una pared fija.** En la dirección perpendicular a una pared que permanece en reposo:

\[
v_f=-e\,v_i.
\]

**Caso de caída y rebote vertical.** \(g\) representa el módulo de la aceleración gravitatoria; \(h_{\text{caída}}\), la distancia vertical de caída hasta el contacto; \(h_{\text{reb}}\), la altura recuperada desde ese mismo nivel. Sin resistencia del aire, soltando desde el reposo y usando un piso fijo, las relaciones de movimiento uniformemente acelerado dan:

\[
|v_i|^2=2gh_{\text{caída}},\qquad
|v_f|^2=2gh_{\text{reb}},
\qquad
e=\sqrt{\frac{h_{\text{reb}}}{h_{\text{caída}}}}.
\]

Se miden los desplazamientos del centro del balón con un mismo nivel de contacto como referencia. En este caso particular, la fracción de energía cinética del balón que queda inmediatamente después es \(e^2\). No se generaliza esa fracción a cualquier choque entre dos cuerpos. Es una deducción de la definición de restitución, la cinemática y la regla de energía de la idea 4. [S18], [S25]

**Palabras nuevas**

| Palabra | Explicación cotidiana | Tres ejemplos |
|---|---|---|
| Restitución | Una manera de comparar cuánto se recupera la separación respecto del acercamiento durante un choque. | Dos juguetes que rebotan; una pelota contra un piso; una pelota contra una pared fija. |
| Velocidad relativa | Cómo se mueve un cuerpo visto desde el otro, usando sus velocidades respecto de un mismo observador. | Dos combis que se alcanzan; dos juguetes que vienen de frente; una pelota que se aleja de una pared quieta. |
| Línea de impacto | La dirección a lo largo de la cual estudiamos el contacto en el modelo. | La vertical al caer sobre un piso; la perpendicular a una pared en un golpe frontal; la línea de una pista recta con dos carritos. |

**Así se resuelve — guion.** Caso original: dos carritos de masas distintas chocan frontalmente y se proporciona el coeficiente de restitución. Pasos: ubicar los cuerpos y elegir el sentido positivo; verificar que se acercan; escribir conservación de cantidad de movimiento si corresponde; escribir la relación de restitución; resolver simultáneamente; comprobar que después se separan o tienen velocidad común; contrastar el balance de energía con el tipo de choque.

**Ahora tú — progresión**

1. Calcular impulso en una detención y en un rebote con velocidades dadas.
2. Obtener restitución a partir de velocidades de llegada y salida.
3. Resolver choques elásticos o parcialmente inelásticos con masas distintas.
4. Relacionar alturas con restitución bajo las condiciones declaradas.
5. Calcular la disminución de energía después de hallar las velocidades, sin interpretar \(e\) como un porcentaje de energía.

### Idea 6. Cada etapa tiene su regla

**Pregunta que responde:** ¿cómo resolvemos un problema que incluye un choque y otro movimiento antes o después?

**Aprendizaje:** el alumno divide el proceso en intervalos y justifica el principio aplicable en cada uno.

**Objeto de la primera pantalla.** Un montaje escolar: un vasito pequeño con plastilina, suspendido de un hilo, y una bola blanda que puede quedar atrapada en él. El vasito es el receptor y se idealiza como una masa puntual. Se marca la posición inferior y la altura posterior. Es un péndulo balístico idealizado de baja energía.

**Lee — tres tarjetas**

1. «La cámara registra varios momentos: la llegada, el contacto y el movimiento posterior».
2. «Podemos separar la película en tramos. En cada tramo cambia qué necesitamos estudiar».
3. «Guardaremos el resultado de un tramo para usarlo como dato del siguiente».

**Juega.** Todavía no aparece la bola entrante. En el modelo, el hilo mide 0,50 m. El alumno suelta el receptor desde alturas entre 0,04 y 0,20 m sobre su posición inferior y observa su oscilación ideal sin rozamiento. **Misión:** hacer que llegue a una banda de altura entre 0,10 y 0,12 m al otro lado. La misión permite estudiar la subida y bajada; no muestra un choque ni un cuerpo que se adhiera.

**Predice.** «Ahora la bola llega horizontalmente y queda atrapada en el receptor, que estaba quieto abajo. Durante el contacto, muy breve, el hilo se mantiene aproximadamente vertical. Después el conjunto sube sin pérdidas apreciables. ¿Qué procedimiento permite determinar la altura alcanzada?»

- **A. Correcta:** conservar aproximadamente la cantidad de movimiento horizontal durante el choque y usar conservación de energía mecánica durante la subida.
- **B. Incorrecta — E-ENE:** conservar la energía mecánica desde antes de pegarse hasta la altura máxima, incluyendo el choque.
- **C. Incorrecta — E-ET:** conservar la cantidad de movimiento del conjunto tanto en el choque como durante toda la subida.
- **D. Incorrecta — E-PART:** conservar por separado la cantidad de movimiento de la bola y la del receptor durante el choque.

**Mira.** La película se detiene justo antes del contacto, justo después y en el punto más alto. Se presenta un balance distinto en cada intervalo. Durante el choque se explica por qué el impulso externo horizontal es despreciable; durante la subida, gravedad y tensión cambian la cantidad de movimiento.

**La regla, completa.** Primero se elige el sistema y luego se divide el proceso. No se extiende una conservación a un intervalo en el que dejaron de cumplirse sus condiciones.

La energía potencial gravitatoria se escribe \(E_p\); la energía mecánica, \(E_m\). Para gravedad aproximadamente uniforme, \(h\) es la altura respecto del nivel de referencia elegido:

\[
E_p=mgh,\qquad E_m=E_c+E_p.
\]

El trabajo de fuerzas no conservativas se representa con \(W_{\text{nc}}\). Un ejemplo es el rozamiento que transforma energía mecánica durante un deslizamiento. Para el modelo mecánico considerado:

\[
E_{m,f}-E_{m,i}=W_{\text{nc}}.
\]

Si ese trabajo es cero, se conserva la energía mecánica. La tensión de un hilo ideal no realiza trabajo sobre la masa puntual de un péndulo de longitud fija, porque es perpendicular a su desplazamiento.

| Etapa | Qué se revisa | Relación que corresponde |
|---|---|---|
| Llegada por una rampa. | Si hay rozamiento y qué fuerzas realizan trabajo. | Balance de energía mecánica; conservación solo cuando corresponda. |
| Choque. | Sistema, dirección, impulso externo y condición de unión o restitución. | Impulso–cantidad de movimiento; si procede, conservación; además, velocidad común o relación de restitución. |
| Subida posterior. | Altura inicial y final, gravedad y pérdidas. | Balance de energía mecánica del movimiento posterior. |
| Vuelo desde una mesa. | Velocidad de salida, altura y resistencia del aire. | Cinemática horizontal y vertical. |
| Frenado sobre piso horizontal. | Rozamiento y fuerzas que realizan trabajo. | Balance de trabajo y energía. |

En el péndulo descrito, primero se obtiene la velocidad común después de la adhesión. Si se elige altura cero en el punto inferior, la subida ideal satisface:

\[
\frac12M|\vec v_{\text{después}}|^2=Mgh_{\text{subida}}.
\]

El subíndice «después» identifica el instante inmediatamente posterior al choque. La masa total \(M\) es la misma definida en la idea 3. Esta relación se usa solamente para la subida. No se aplica la conservación de energía mecánica a la adhesión inelástica.

Para la variante de salida **horizontal** desde una mesa, sin resistencia del aire, la velocidad vertical inicial es cero. La distancia horizontal recorrida se representa con \(d\); el tiempo de vuelo, con \(\Delta t_{\text{vuelo}}\):

\[
h_{\text{caída}}=\frac12g(\Delta t_{\text{vuelo}})^2,
\qquad
d=|v_{x,\text{salida}}|\,\Delta t_{\text{vuelo}}.
\]

La salida del choque entrega el dato de velocidad que necesita el vuelo. En el vuelo no se conserva la cantidad de movimiento vertical porque actúa la gravedad.

Para un frenado por rozamiento cinético sobre un piso horizontal, sin otras fuerzas verticales aparte del peso y la reacción del piso, el trabajo del rozamiento es:

\[
W_{\text{nc}}=-\mu_k Mgd.
\]

\(\mu_k\) es el coeficiente de rozamiento cinético, sin unidades; \(d\) es la distancia recorrida durante ese frenado. El signo negativo indica que el rozamiento se opone al desplazamiento. Si existen otras fuerzas o cambia la geometría, no se reutiliza esta expresión sin revisar las condiciones.

La separación de etapas responde a demandas verificadas en los problemas UNI citados. Las relaciones físicas se apoyan en los balances ya desarrollados y en los conocimientos previos declarados. [S06], [S07], [S24], [S25]

**Palabras nuevas**

| Palabra | Explicación cotidiana | Tres ejemplos |
|---|---|---|
| Etapa | Un tramo de la historia que estudiamos con condiciones bien identificadas. | La bajada anterior al choque; el contacto; la subida posterior. |
| Balance | Comparar lo que había al inicio y al final con lo que entró, salió o se transformó. | Cambio de cantidad de movimiento por impulso externo; cambio de energía mecánica por trabajo; transformación de energía cinética en un choque. |
| Aproximación | Una simplificación que se acepta para una precisión y unas condiciones determinadas. | Despreciar el aire en un recorrido corto; considerar fijo un piso muy masivo; despreciar el impulso externo horizontal durante un contacto breve. |

**Así se resuelve — guion.** Caso original: una bola blanda se adhiere al receptor de un péndulo escolar y se conoce la altura de ascenso. Pasos: dibujar tres instantes a partir de la escena; empezar por la subida para obtener la rapidez inmediatamente posterior al choque; retroceder al choque; justificar conservación horizontal durante ese intervalo; usar la masa total correcta; obtener la velocidad de llegada; verificar que no se conservó energía cinética en la adhesión.

**Ahora tú — progresión**

1. Elegir el principio correcto para cada intervalo sin efectuar cálculos.
2. Resolver adhesión seguida de subida.
3. Resolver bajada por rampa, choque elástico y subida de otro cuerpo.
4. Resolver adhesión seguida de salida horizontal desde una mesa.
5. Resolver un choque de bloques deslizantes seguido de frenado con rozamiento, proporcionando sus datos y las relaciones necesarias.

## 6. Tabla de letras y símbolos de la unidad

La unidad usa «cantidad de movimiento». Al consultar otras fuentes, el alumno puede encontrar «momento lineal» o el término inglés *momentum* para la misma magnitud. No se cambia de nombre entre pantallas sin explicarlo.

| Letra o símbolo | Significado único en esta unidad | Unidad o lectura | Advertencia |
|---|---|---|---|
| \(m\) | Masa de un cuerpo. | kg | No se usa para peso. La m de la unidad metro se escribe como unidad, no como variable. |
| \(M\) | Masa total del sistema. | kg | No significa momento de una fuerza. |
| \(\vec v\) | Velocidad. | m/s | Es vectorial; sin flecha, \(v\) representa su componente con signo en problemas de una dimensión. |
| \(\lvert\vec v\rvert\) | Módulo de la velocidad o rapidez. | m/s | No es una velocidad «siempre hacia la derecha». |
| \(\vec p\) | Cantidad de movimiento de un cuerpo. | kg·m/s | No se usa \(p\) para presión. |
| \(\vec P\) | Cantidad de movimiento total del sistema. | kg·m/s | En otros temas P puede significar potencia o peso; aquí no. |
| \(\vec F\) | Fuerza. | N | Los subíndices identifican cuál; «neta» y «media» no son intercambiables. |
| \(\vec I\) | Impulso. | N·s | En electricidad I puede significar corriente. Otros libros usan J para impulso; aquí J se reserva a la unidad joule. |
| \(t\) | Tiempo. | s | Un instante no es lo mismo que una duración. |
| \(\Delta\) | Diferencia entre valor final e inicial del intervalo señalado. | «Cambio de…» | No significa automáticamente un valor positivo. |
| \(\Delta t\) | Duración de un intervalo. | s | En la unidad, se elige el instante final posterior al inicial. |
| \(E_c\) | Energía cinética. | J | Algunas fuentes usan K. Aquí se mantiene \(E_c\). |
| \(E_p\) | Energía potencial gravitatoria. | J | Algunas fuentes usan U. La referencia de altura se declara. |
| \(E_m\) | Energía mecánica, suma de cinética y potencial del modelo. | J | No equivale a toda forma de energía existente. |
| \(E_{\text{dis}}\) | Disminución de energía cinética en un choque pasivo. | J | No es energía destruida. |
| \(e\) | Coeficiente de restitución. | Sin unidad | No representa un porcentaje general de energía conservada. |
| \(x,y\) | Coordenadas de posición y nombres de sus ejes. | m para las coordenadas | En un subíndice indican una componente sobre ese eje. |
| \(x_{\mathrm{CM}}\) | Coordenada del centro de masa. | m | No se toma como punto medio sin revisar las masas. |
| \(\vec v_{\mathrm{CM}}\) | Velocidad del centro de masa. | m/s | Es una velocidad, no una nueva clase de cantidad de movimiento. |
| \(g\) | Módulo de la aceleración gravitatoria proporcionado por el ejercicio. | m/s² | El signo de cada componente de aceleración depende del eje elegido. |
| \(h\) | Altura o distancia vertical entre los niveles expresamente identificados. | m | «Caída», «rebote» y «subida» especifican qué diferencia vertical se mide. |
| \(d\) | Distancia recorrida en el tramo rectilíneo indicado. | m | No se usa simultáneamente para diámetro. |
| \(W_{\text{nc}}\) | Trabajo de fuerzas no conservativas en el balance indicado. | J | W es variable de trabajo; como símbolo de unidad significa watt, que no se necesita aquí. |
| \(\mu_k\) | Coeficiente de rozamiento cinético. | Sin unidad | Algunas fuentes usan \(\mu_d\); no se alternan ambas letras en la app. |
| Subíndices \(1,2\) | Identidad de los cuerpos. | «Cuerpo uno», «cuerpo dos». | No indican instantes. |
| Subíndices \(i,f\) | Inicio y final del intervalo que se está estudiando. | «Inicial», «final». | Antes de cambiar de etapa se vuelve a señalar el intervalo. |
| «neta», «ext», «contacto», «otras», «med» | Fuerza o impulso neto, externo, de contacto, de otras fuerzas; valor medio. | Se leen completos al introducirlos. | Son etiquetas; no variables que se multiplican. |
| «después», «salida», «vuelo», «CM» | Instante, tramo o referencia identificados en la escena. | Lectura literal. | Evitan reutilizar una letra con un significado diferente. |
| Flecha, barras y subíndices | Vector, módulo y especificación de cuerpo/componente/instante. | Según corresponda. | Las barras de módulo no deben usarse para borrar signos antes de una resta vectorial. |

Las unidades se presentan también en palabras la primera vez: kilogramo (kg), metro (m), segundo (s), newton (N) y joule (J). No se introduce una segunda letra para «velocidad final» cuando basta un subíndice.

## 7. Otras formas de explicarla y su riesgo

Las fuentes aportan principios, representaciones o posibilidades de exploración. La adaptación a objetos y misiones de esta propuesta es un diseño propio.

| Recurso o explicación | Para qué idea conviene y cómo usarlo | Qué idea falsa puede dejar | Cómo contener el riesgo | Fuente o procedencia |
|---|---|---|---|---|
| Comparar un mismo coche con distinta carga o velocidad. | Idea 1: variar una magnitud y después combinar cambios. | «Cantidad de movimiento» significa fuerza que el objeto lleva dentro. | Nombrar masa, velocidad y fuerza por separado; evitar definirla solamente como «qué tan difícil es pararlo». | Fundamento: [S13]. Escena local: propuesta propia. |
| Recibir una pelota acompañándola con las manos; mostrar fuerza frente al tiempo. | Idea 2: relacionar una recepción más prolongada con fuerza media e impulso. | Una recepción suave siempre tiene menor impulso, incluso si los estados inicial y final no son iguales. | Comparar la misma llegada y la misma detención; distinguir media de máximo. | [S14] |
| Rodear con un marco a los cuerpos elegidos. | Idea 3: cambiar de pelota sola a pelota más entorno, o de un carrito a dos. | Las fuerzas de acción y reacción se cancelan sobre cada cuerpo. | Dibujar cada fuerza sobre su receptor y sumar solo después de elegir el sistema. | [S15]; representación adaptada. |
| Marcar el centro de masa sobre una pista. | Extensión de la idea 3: seguir un punto mientras cambia el movimiento de los cuerpos. | El centro de masa siempre es el centro geométrico o siempre está quieto. | Comparar masas iguales y distintas; incluir un sistema cuyo total de cantidad de movimiento no sea cero. | [S17] |
| Dos deslizadores o carritos con acoplamiento, junto a barras de energía. | Idea 4: separar la conservación de cantidad de movimiento de la transformación de energía. | Todos los choques inelásticos terminan pegados; toda disminución aparece solo como calor. | Incluir también un rebote inelástico y etiquetar diversas formas de energía. | [S16] |
| PhET, *Collision Lab*: pausar, avanzar por pasos y variar una condición. | Ideas 3–5: explorar primero en una dimensión y luego ampliar; mostrar vectores, energía y centro de masa cuando sean pertinentes. | Las paredes de la simulación no afectan al sistema; el control de elasticidad es siempre un porcentaje de energía. | Desactivar paredes reflectantes al estudiar un sistema sin impulso externo; enseñar la definición de restitución y no inferir una equivalencia energética general del nombre del control. | Guía docente original de PhET, julio de 2023, primera parte del PDF consultado. [S19] |
| Soltar un balón y medir el primer rebote. | Idea 5: conectar velocidades de contacto con alturas mediante cinemática. | La razón de alturas es directamente \(e\), o un balón tiene un \(e\) fijo para cualquier piso y velocidad. | Distinguir razón de alturas y raíz de esa razón; registrar condiciones y no extrapolar el ensayo. | Modelo de restitución: [S18]. Ejemplo normado de rebote: [S22]. |
| Tres fotogramas con un balance bajo cada intervalo. | Idea 6: llegada, salida del choque y estado posterior. | Una ecuación elegida al principio sigue siendo válida durante toda la historia. | Escribir junto a cada balance su sistema, intervalo y condición. | Diseño propio orientado a las demandas de [S06], [S07]; balance mecánico: [S24]. |

No se propone usar dinero, «puntos de movimiento» o líquidos como equivalencias literales. Pueden ayudar a explicar reparto, pero ocultan el sentido vectorial o sugieren que la cantidad de movimiento de cada objeto debe ser positiva.

## 8. Datos del mundo con fuente

Estos son datos comprobados, distintos de los valores elegidos para construir los ejercicios. No certifican por sí solos cómo rebota un objeto concreto ni cuánto dura un impacto.

| Objeto y dato puntual | Fuente verificable y localización | Uso en la unidad | Límite que debe respetarse |
|---|---|---|---|
| Balón de fútbol: masa reglamentaria de **410–450 g** al comienzo del partido; circunferencia de **68–70 cm**. | IFAB, Reglas de Juego 2026/27, regla 2.1. [S20] | Ideas 1–2: seleccionar una masa plausible y distinguir masa de velocidad. | Es un intervalo reglamentario. La masa del balón usado debe darse o medirse; no se deduce su fuerza de impacto de ese intervalo. |
| Balón de voleibol: masa de **260–280 g**; circunferencia de **65–67 cm**. | FIVB, Reglas Oficiales 2025–2028, regla 3.1, p. 16. [S21] | Idea 2: recepción y duración del frenado con un objeto reconocible en el contexto escolar. | La norma no da el tiempo de contacto con las manos ni la fuerza de una recepción. Esos valores requieren medición o deben declararse datos del modelo. |
| Balón de futsal: masa de **400–440 g**; circunferencia de **62–64 cm**. | FIFA, *Futsal Laws of the Game 2025–2026*, regla 2.1, p. 27. [S22] | Idea 5: escoger una masa y un tamaño coherentes para el balón representado. | Se cita la edición comprobada, sin afirmar que sea la última disponible. |
| En la misma norma de futsal, al soltar el balón desde **2 m**, el primer rebote debe quedar entre **50 y 65 cm**. | FIFA, misma regla. [S22] | Diseñar una comparación entre una especificación de ensayo y el modelo de restitución. | No se traslada el resultado a cualquier losa. Para inferir \(e\), se declara el modelo y se aplica la raíz de la razón de alturas; el equipo recalcula aparte. |
| Cemento SOL: presentación comercial nominal de **42,5 kg** en bolsa. | UNACEM Perú, página oficial de productos, apartado Cemento SOL; sin fecha indicada, consulta del 21-11-2026. [S23] | Variante de la idea 1 situada en una ferretería peruana: separar masa de carga y masa total del coche. | La cifra corresponde al contenido nominal indicado; se añade por separado la masa del coche y, si importa para la precisión, la del envase. No es una especificación de carga segura de una carretilla. |

**Tratamiento de otros números.** Las velocidades de juguetes, las masas de receptores, los coeficientes de rozamiento, las duraciones de contacto y los valores de restitución de las escenas serán datos didácticos declarados. No se presentarán como mediciones hechas en Juliaca ni como propiedades universales de «cemento», «goma» o «metal». Si se usa \(g=10\ \mathrm{m/s^2}\), se rotulará como aproximación para el ejercicio, no como gravedad exacta de un lugar.

## 9. Dudas y decisiones

### Lo que no se pudo confirmar

1. **Frecuencia real en admisión.** La muestra permite identificar tipos y localizar ejemplos, pero no sostener que uno sea el más frecuente en todos los periodos de San Marcos o UNI. Se necesitaría una serie definida, criterios de inclusión y revisión de todos sus exámenes.
2. **Comparación entre cinco universidades.** No se obtuvo una muestra suficientemente trazable de UNA Puno, UNSA y UNSAAC para esta unidad. Su ausencia en la tabla de ejemplos no significa ausencia curricular.
3. **Vigencia de todos los temarios.** CEPRE-UNI 2023-2 acredita contenido de esa edición. Se debe verificar el temario del ciclo concreto al publicar un itinerario dirigido a una convocatoria posterior.
4. **Procedencia digital de San Marcos.** Se leyó contenido de cuadernillos institucionales en reproducciones de terceros. Conviene sustituir esos enlaces por copias institucionales estables si el proyecto las consigue; no se usaron los comentarios del alojamiento como evidencia.
5. **Errores de estudiantes peruanos.** No se dispone de una estimación local de prevalencia. E-ALG conserva la etiqueta de segunda mano y los códigos H siguen siendo hipótesis.
6. **Reconocimiento de los objetos.** Ferretería, balones y juguetes son elecciones de diseño plausibles, no resultados de una encuesta. El pilotaje debe comprobar que se reconocen sin explicación larga.

### Decisiones tomadas y su motivo

| Decisión | Motivo y consecuencia |
|---|---|
| Usar seis ideas. | Permite construir primero la magnitud, luego su cambio, después la conservación y finalmente las clases de choque y las etapas. |
| Mantener fuerza media y fuerza máxima separadas. | Un impulso y una duración determinan una media, no toda la forma de la fuerza. |
| Enseñar el sistema antes del choque perfectamente inelástico. | Evita convertir «se conserva la cantidad de movimiento» en una frase sin sujeto ni condiciones. |
| Tratar energía antes de restitución. | El alumno necesita distinguir pérdida de energía, rebote y unión antes de interpretar un coeficiente. |
| Usar \(E_c\), \(E_p\), \(E_m\) e \(I\). | Permite leer los nombres y evita usar J simultáneamente para impulso y para joule. Las variantes de otros libros se explican una sola vez. |
| Incluir centro de masa como extensión de la idea 3. | Está en el temario comprobado de CEPRE-UNI y se deduce de la suma de cantidades de movimiento. No necesita una séptima idea. |
| Incluir componentes, pero limitar restitución al choque en una línea. | La suma vectorial es necesaria; choques oblicuos con componentes tangenciales, rotación y fricción de contacto requieren un desarrollo distinto. |
| No introducir cohetes de masa variable ni choques con liberación interna de energía. | Exigen ampliar las condiciones de las ecuaciones. No son necesarios para cubrir los tipos verificados de esta propuesta. |
| Proporcionar fórmulas con sus condiciones. | La exigencia principal será seleccionar y justificar, además de ejecutar el cálculo. |
| Mantener el gráfico después del objeto. | El gráfico representa algo que ya fue observado; no funciona como una escena independiente sin referente. |

### Decisiones que debe tomar el dueño del proyecto

- **Alcance de la ruta UNI:** hacer obligatorios centro de masa y ejercicios vectoriales de tres cuerpos, o dejarlos como ampliación identificada. Esta propuesta los conserva para no perder el alcance comprobado.
- **Profundidad de la última idea:** ofrecer de entrada las tres variantes —subida, vuelo y rozamiento— o desplegarlas como práctica gradual después de comprender el método común.
- **Validación de distractores:** probar las opciones con alumnos del público objetivo y pedir una explicación breve. Una elección aislada no permite atribuir con seguridad un error conceptual.
- **Datos locales adicionales:** decidir si se recogerán masas y registros de rebote de objetos reales. Hasta entonces, no sustituir supuestos por cifras con apariencia experimental.

Estas decisiones no impiden usar la secuencia propuesta; determinan su extensión y el trabajo de validación posterior.

### Revisión de dependencias

| Idea | Utiliza únicamente | Introduce | Situación que «Juega» reserva para «Predice» |
|---|---|---|---|
| 1 | Masa, velocidad, vectores y álgebra previos. | Cantidad de movimiento individual. | Cambiar masa y sentido a la vez. |
| 2 | Idea 1, fuerzas y áreas previas. | Impulso, fuerza media y cambio de cantidad de movimiento. | Frenar durante tiempos distintos con los mismos estados inicial y final. |
| 3 | Ideas 1–2 y tercera ley previa. | Sistema, conservación total y centro de masa. | Liberación de cuerpos con masas diferentes. |
| 4 | Ideas 1–3 y noción previa de energía. | Energía cinética en choques, unión y clasificación. | Encuentro en sentidos opuestos y comparación energética. |
| 5 | Ideas 1–4 y cinemática previa. | Restitución y relación con velocidades o alturas. | Rebote ideal horizontal contra una pared. |
| 6 | Ideas 1–5, trabajo y cinemática previos. | Organización de balances por etapas y condiciones de cada intervalo. | Adhesión de un cuerpo entrante antes de la oscilación. |

**Revisión de las 18 opciones incorrectas:** idea 1 → E-VEC, H-MAS, E-FUE; idea 2 → E-IMP, E-FUE, H-T; idea 3 → E-DOM, E-PART, H-IGV; idea 4 → E-ENE, E-VEC, E-PART; idea 5 → E-REB, E-VEC, H-RESTA; idea 6 → E-ENE, E-ET, E-PART. Todas remiten a códigos definidos en la sección 3. E-ALG, H-AREA y H-ALT sirven además para orientar la retroalimentación de los ejercicios; no se fuerza su inclusión en una predicción.

## 10. Fuentes

Todas las fuentes enlazadas se consultaron para esta revisión. Las indicaciones de páginas y preguntas distinguen el material original de los sitios que alojan sus copias. No se reproducen en esta propuesta enunciados completos, soluciones ni figuras de los exámenes o libros.

### Temarios, práctica y exámenes

1. **S01 — Centro Preuniversitario de la Universidad Nacional de Ingeniería, 2023.** *Guía del ciclo preuniversitario 2023-2*, temario de Física, p. 16. Documento institucional. [PDF oficial](https://www.cepre.uni.edu.pe/assets/archivos/comunicados/Syl_Pre_PS_2023-2.pdf).
2. **S02 — Universidad Nacional Mayor de San Marcos, Centro Preuniversitario, 2025.** *Material para alumnos, semana 8, ciclo ordinario 2025-I*, Física: teoría de impulso y choques y ejercicios de clase/propuestos, pp. 115–125. Texto institucional leído en reproducción de terceros. [Copia consultada](https://es.scribd.com/document/863692115/0-Mpe-Semana-8-Ciclo-Ord-2025-i-Para-Alumnos).
3. **S03 — Universidad Nacional Mayor de San Marcos, 2025.** *Examen General de Admisión 2025-II, área B*, 2 de marzo de 2025, pregunta 84, p. 14. Cuadernillo reproducido en un alojamiento externo. [Copia consultada](https://es.scribd.com/document/1043234043/Examen-Unmsm-2025-II-Area-b-Claves).
4. **S04 — Universidad Nacional Mayor de San Marcos, 2025.** *Examen de Admisión 2026-I, área D*, 4 de octubre de 2025, pregunta de impulso y fuerza media, p. 13. Se omite el número de pregunta porque la lectura disponible no permitió confirmarlo con igual seguridad. [Copia consultada](https://www.scribd.com/document/1006104770/EXAMEN-DE-ADMISIO-N-A-REA-D-UNMSM-2026-I).
5. **S05 — Universidad Nacional de Ingeniería, Oficina Central de Admisión, 2020.** *Solucionario del examen de admisión 2020-1*, tercera prueba, Física, pregunta 10. [PDF oficial](https://admision.uni.edu.pe/wp-content/uploads/2022/11/solucionario2020.pdf).
6. **S06 — Universidad Nacional de Ingeniería, Oficina Central de Admisión, 2012.** *Solucionario del examen de admisión 2012-1*, Física, preguntas 3 y 9. [PDF oficial](https://admision.uni.edu.pe/wp-content/uploads/2022/11/solucionario2012.pdf).
7. **S07 — Universidad Nacional de Ingeniería, Oficina Central de Admisión, 2011.** *Solucionario del examen de admisión 2011-2*. Se consultaron la pregunta 17 de Física del examen ordinario y la pregunta 1 de Física del segundo parcial CEPRE-UNI incluido en el volumen. [PDF oficial](https://admision.uni.edu.pe/wp-content/uploads/2022/11/solucionario20112.pdf).
8. **S08 — Universidad Nacional de Ingeniería, Oficina Central de Admisión, 2017.** *Solucionario del examen de admisión 2017-1*, sección CEPRE-UNI, segundo examen parcial, Física, pregunta 1, p. 103 de la numeración impresa. [PDF oficial](https://admision.uni.edu.pe/wp-content/uploads/2022/11/solucionario20171.pdf).

### Investigación sobre aprendizaje

9. **S09 — Singh, Chandralekha, y Rosengrant, David, 2003.** “Multiple-choice test of energy and momentum concepts”. *American Journal of Physics*, 71(6), 607–617. DOI: 10.1119/1.1571832. Se leyó el texto original en una versión de autor depositada en 2016; 2016 no es el año de publicación del estudio. [Texto completo](https://arxiv.org/pdf/1602.06497).
10. **S10 — Hestenes, David; Wells, Malcolm; y Swackhamer, Gregg, 1992.** “Force Concept Inventory”. *The Physics Teacher*, 30, 141–158. DOI: 10.1119/1.2343497. Se leyó el artículo original, en copia alojada fuera del editor. [Texto consultado](https://gwern.net/doc/science/physics/1992-hestenes.pdf).
11. **S11 — Giorgi, Silvia M.; Pozzo, Roberto L.; y Concari, Sonia B., 2005.** “Cuerpos en movimiento: un estudio de investigaciones publicadas y de las representaciones de los estudiantes universitarios”. *Ciencia, Docencia y Tecnología*, 16(31), 199–218. Para la fila E-FUE se usó el estudio de los propios autores, sección III, no solamente su revisión de otros trabajos. [Texto completo consultado](https://www.academia.edu/48800755/Cuerpos_en_Movimiento_Un_estudio_de_investigaciones_publicadas_y_de_las_representaciones_de_los_estudiantes_universitarios).
12. **S12 — Lawson, Ronald A., y McDermott, Lillian C., 1987.** “Student understanding of the work-energy and impulse-momentum theorems”. *American Journal of Physics*, 55, 811–817. DOI: 10.1119/1.14994. **Acceso de segunda mano:** se leyó la descripción bibliográfica y el resumen de ComPADRE, no el artículo íntegro. [Ficha consultada](https://www.compadre.org/Portal/items/detail.cfm?ID=2746).

### Física y representaciones

13. **S13 — Ling, Samuel J.; Sanny, Jeff; y Moebs, William, 2016.** *University Physics, Volume 1*, OpenStax, §9.1, “Linear Momentum”. [Capítulo](https://openstax.org/books/university-physics-volume-1/pages/9-1-linear-momentum).
14. **S14 — Ling, Samuel J.; Sanny, Jeff; y Moebs, William, 2016.** *University Physics, Volume 1*, OpenStax, §9.2, “Impulse and Collisions”. [Capítulo](https://openstax.org/books/university-physics-volume-1/pages/9-2-impulse-and-collisions).
15. **S15 — Ling, Samuel J.; Sanny, Jeff; y Moebs, William, 2016.** *University Physics, Volume 1*, OpenStax, §9.3, “Conservation of Linear Momentum”. [Capítulo](https://openstax.org/books/university-physics-volume-1/pages/9-3-conservation-of-linear-momentum).
16. **S16 — Ling, Samuel J.; Sanny, Jeff; y Moebs, William, 2016.** *University Physics, Volume 1*, OpenStax, §9.4, “Types of Collisions”. [Capítulo](https://openstax.org/books/university-physics-volume-1/pages/9-4-types-of-collisions).
17. **S17 — Ling, Samuel J.; Sanny, Jeff; y Moebs, William, 2016.** *University Physics, Volume 1*, OpenStax, §9.6, “Center of Mass”. [Capítulo](https://openstax.org/books/university-physics-volume-1/pages/9-6-center-of-mass).
18. **S18 — Peacock, Thomas, y Hadjiconstantinou, Nicolas, 2007.** *Dynamics and Control I*, MIT OpenCourseWare, lecture 6: “Collisions / Impulses”, especialmente pp. 3–4. [Apuntes oficiales](https://ocw.mit.edu/courses/2-003j-dynamics-and-control-i-spring-2007/e12ed118aeb1eb716db972ab23f4b982_lec06.pdf).
19. **S19 — PhET Interactive Simulations; guía firmada Rouinfar, julio de 2023.** *Tips for Teachers: Collision Lab*. Se leyó la guía original reproducida en las primeras cuatro páginas del PDF enlazado; las fichas añadidas después no se atribuyen a esa guía. [Guía consultada](https://uploads.teachablecdn.com/attachments/5b09f60ad17247d185381cac699dc20e.pdf). [Simulador oficial](https://phet.colorado.edu/es/simulations/collision-lab).

### Datos del mundo

20. **S20 — The International Football Association Board, edición 2026/27.** *Reglas de Juego*, regla 2.1, “El balón: características y medidas”. [Página oficial](https://theifab.com/es/laws/latest/the-ball/).
21. **S21 — Fédération Internationale de Volleyball, 2025.** *Official Volleyball Rules 2025–2028*, regla 3.1, “Standards”, p. 16. [PDF oficial](https://www.fivb.com/wp-content/uploads/2025/01/FIVB-Volleyball_Rules2025_2028-EN-v05.pdf).
22. **S22 — Fédération Internationale de Football Association, 2025.** *Futsal Laws of the Game 2025–2026*, regla 2.1, “Qualities and measurements”, p. 27. [PDF oficial](https://digitalhub.fifa.com/m/20d52e6779b53321/original/FUTSAL-Laws-of-the-Game-2025-2026.pdf).
23. **S23 — UNACEM Perú, sin fecha indicada.** *Productos: Cemento SOL*, presentación comercial. Consulta: 21 de noviembre de 2026. [Página oficial](https://unacem.pe/comercializacion/productos-y-servicios/productos/).

### Relaciones previas recuperadas en la unidad

24. **S24 — Ling, Samuel J.; Sanny, Jeff; y Moebs, William, 2016.** *University Physics, Volume 1*, OpenStax, §8.3, “Conservation of Energy”. [Capítulo](https://openstax.org/books/university-physics-volume-1/pages/8-3-conservation-of-energy).
25. **S25 — Ling, Samuel J.; Sanny, Jeff; y Moebs, William, 2016.** *University Physics, Volume 1*, OpenStax, §3.4, “Motion with Constant Acceleration”. [Capítulo](https://openstax.org/books/university-physics-volume-1/pages/3-4-motion-with-constant-acceleration).

[S01]: https://www.cepre.uni.edu.pe/assets/archivos/comunicados/Syl_Pre_PS_2023-2.pdf
[S02]: https://es.scribd.com/document/863692115/0-Mpe-Semana-8-Ciclo-Ord-2025-i-Para-Alumnos
[S03]: https://es.scribd.com/document/1043234043/Examen-Unmsm-2025-II-Area-b-Claves
[S04]: https://www.scribd.com/document/1006104770/EXAMEN-DE-ADMISIO-N-A-REA-D-UNMSM-2026-I
[S05]: https://admision.uni.edu.pe/wp-content/uploads/2022/11/solucionario2020.pdf
[S06]: https://admision.uni.edu.pe/wp-content/uploads/2022/11/solucionario2012.pdf
[S07]: https://admision.uni.edu.pe/wp-content/uploads/2022/11/solucionario20112.pdf
[S08]: https://admision.uni.edu.pe/wp-content/uploads/2022/11/solucionario20171.pdf
[S09]: https://arxiv.org/pdf/1602.06497
[S10]: https://gwern.net/doc/science/physics/1992-hestenes.pdf
[S11]: https://www.academia.edu/48800755/Cuerpos_en_Movimiento_Un_estudio_de_investigaciones_publicadas_y_de_las_representaciones_de_los_estudiantes_universitarios
[S12]: https://www.compadre.org/Portal/items/detail.cfm?ID=2746
[S13]: https://openstax.org/books/university-physics-volume-1/pages/9-1-linear-momentum
[S14]: https://openstax.org/books/university-physics-volume-1/pages/9-2-impulse-and-collisions
[S15]: https://openstax.org/books/university-physics-volume-1/pages/9-3-conservation-of-linear-momentum
[S16]: https://openstax.org/books/university-physics-volume-1/pages/9-4-types-of-collisions
[S17]: https://openstax.org/books/university-physics-volume-1/pages/9-6-center-of-mass
[S18]: https://ocw.mit.edu/courses/2-003j-dynamics-and-control-i-spring-2007/e12ed118aeb1eb716db972ab23f4b982_lec06.pdf
[S19]: https://uploads.teachablecdn.com/attachments/5b09f60ad17247d185381cac699dc20e.pdf
[S20]: https://theifab.com/es/laws/latest/the-ball/
[S21]: https://www.fivb.com/wp-content/uploads/2025/01/FIVB-Volleyball_Rules2025_2028-EN-v05.pdf
[S22]: https://digitalhub.fifa.com/m/20d52e6779b53321/original/FUTSAL-Laws-of-the-Game-2025-2026.pdf
[S23]: https://unacem.pe/comercializacion/productos-y-servicios/productos/
[S24]: https://openstax.org/books/university-physics-volume-1/pages/8-3-conservation-of-energy
[S25]: https://openstax.org/books/university-physics-volume-1/pages/3-4-motion-with-constant-acceleration


