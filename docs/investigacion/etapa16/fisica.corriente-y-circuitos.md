# Física · Corriente eléctrica y circuitos

Propuesta independiente para 5.º de secundaria y postulantes a universidades públicas peruanas. Etapa 16. Revisión: 22 de noviembre de 2026. Las escenas y las predicciones son originales; las fuentes delimitan contenidos y evidencia. Se describe el diseño pedagógico, sin programación ni banco final de problemas calculados.

## 1. Resumen en 5 líneas

La unidad explica cómo circula carga y cómo se transfiere energía en circuitos de corriente continua.
Separa corriente, diferencia de potencial, resistencia, potencia y energía mediante objetos y mediciones distintas.
Construye conexiones en serie y paralelo desde sus contactos antes de reconocerlas en diagramas.
Llega a circuitos mixtos, reglas de Kirchhoff, instrumentos, efecto Joule y fuentes con resistencia interna.
La dificultad central es pensar el circuito como un conjunto, sin imaginar corriente que se gasta ni una pila que siempre entrega la misma intensidad.

## 2. Qué se pregunta en los exámenes

Se consultaron el sílabo oficial CEPREUNI 2026-2 [F1], el solucionario oficial UNI 2012-1 [F2], una reproducción del cuadernillo UNMSM 2024-II, área A [F3], y material CEPREUNMSM 2024-II, semana 12 [F4]. El alojamiento de estos dos últimos es de terceros: se identificó el encabezado institucional del documento, pero no se cotejó su distribución oficial. No se copian figuras, soluciones ni problemas.

| Tipo de pregunta | Universidad y evidencia | Dificultad didáctica | Frecuencia | Fuente |
| --- | --- | --- | --- | --- |
| Relacionar carga que atraviesa una sección con tiempo, incluyendo movimiento periódico. | UNI, ordinario 2012-1, tercera prueba, pregunta 16. | Media: traducir un movimiento a carga por tiempo. | Caso verificado; sin ranking. | Solucionario oficial, p. impresa 108 [F2]. |
| Reducir resistencias y hallar corriente con una fuente. | UNI, ordinario 2012-1, tercera prueba, pregunta 17. | Media: reconocer conexiones antes de operar. | Caso verificado; sin serie temporal. | [F2], pp. 108–109. |
| Comparar resistencias equivalentes de elementos iguales conectados de dos maneras. | UNMSM 2024-II, área A; cuadernillo reproducido. | Media: relacionar número de elementos y asociación. | Un caso observado. | Bloque de física, p. 22 de la reproducción [F3]. |
| Relacionar energía térmica, resistencia y tiempo para determinar corriente. | UNMSM 2024-II, área A; cuadernillo reproducido. | Media: seleccionar la expresión de potencia. | Un caso observado. | Bloque de física, p. 21 [F3]. |
| Interpretar corriente variable mediante un gráfico y contar portadores. | UNMSM, práctica CEPRE 2024-II. | Media a alta: área y conversión de carga. | Presencia en práctica; no frecuencia de admisión. | Semana 12, ejercicios propuestos [F4]. |
| Aplicar Ohm, resistividad y cambios de temperatura. | UNI, contenido CEPRE 2026-2. | Básica a media. | Presencia curricular. | Semanas 15–16, p. impresa 23 [F1]. |
| Analizar nudos, mallas y lecturas de instrumentos. | UNI y UNMSM, preparación preuniversitaria. | Media a alta: topología y signos. | No cuantificada en exámenes. | [F1], [F4]. |
| Relacionar densidad de corriente y conducción microscópica. | UNI, contenido CEPRE 2026-2. | Alta por coordinación de escalas. | Presencia curricular, no recurrencia demostrada. | [F1]. |

No se puede afirmar cuál tipo es el más frecuente a partir de esta muestra pequeña y heterogénea. No se verificó un corpus comparable de UNA Puno, UNSA o UNSAAC. «Alta» indica varias decisiones conceptuales o algebraicas, no una dificultad medida en postulantes. El material CEPRE no se presenta como examen ordinario.

La cobertura prioriza corriente continua estacionaria y resistores. Se incluye el área bajo gráficos sencillos de corriente sin exigir cálculo integral. Los condensadores, los transitorios, la inducción y la impedancia de corriente alterna requieren otras unidades. La red doméstica se usará únicamente como referencia de etiquetas; las misiones representan montajes virtuales de baja tensión.

## 3. Errores típicos

DOCUMENTADO significa leído en el estudio original; DE SEGUNDA MANO significa conocido mediante una cita ajena; HIPÓTESIS identifica una propuesta de distractor todavía no contrastada. Las causas explicativas son interpretaciones, salvo que se indique lo contrario. Las poblaciones estudiadas no representan automáticamente a los postulantes peruanos.

| Código | Qué hace el alumno | Por qué o interpretación del razonamiento | Etiqueta | Fuente |
| --- | --- | --- | --- | --- |
| E01 | Trata la pila como fuente de corriente fija. | Atribuye la intensidad a la pila aislada. | DOCUMENTADO. | Engelhardt y Beichner, 2004, entrevistas y tabla V [F5]. |
| E02 | No identifica los dos contactos del foco. | Confunde forma exterior con conexión eléctrica. | DOCUMENTADO. | Engelhardt y Beichner, 2004, p. 104 [F5]. |
| E03 | Reparte corriente por igual en cualquier bifurcación. | Considera solo la división del camino. | DOCUMENTADO. | Engelhardt y Beichner, 2004, tabla V [F5]. |
| E04 | Cree que un foco puede funcionar conectado a un solo polo. | Imagina la pila como salida de un suministro abierto. | DOCUMENTADO. | Periago y Bohigas, 2005, análisis Q1 [F6]. |
| E05 | Cree que la corriente disminuye al pasar por resistores. | Interpreta consumo de energía como consumo de corriente. | DOCUMENTADO. | Periago y Bohigas, 2005, análisis Q3–Q5 [F6]. |
| E06 | Considera que dos fuentes opuestas siempre se anulan. | Ignora la magnitud de cada fem. | DOCUMENTADO. | Periago y Bohigas, 2005, análisis Q2 [F6]. |
| E07 | Confunde voltaje con cantidad de carga por segundo. | Intercambia dos magnitudes con unidades distintas. | HIPÓTESIS para esta formulación. | Diseño propio. |
| E08 | Cree que ausencia de corriente implica necesariamente voltaje cero. | Usa una relación para un resistor como regla de cualquier circuito abierto. | HIPÓTESIS. | Diseño propio. |
| E09 | Decide serie o paralelo por la posición en el dibujo. | Atiende a la forma, no a los nodos. | HIPÓTESIS. | Diseño propio. |
| E10 | Cree que aumentar voltaje cambia siempre la resistencia de un resistor óhmico. | Interpreta una igualdad como dependencia causal obligatoria. | HIPÓTESIS. | Diseño propio. |
| E11 | Confunde área transversal con longitud o diámetro. | Cambia una dimensión sin revisar cómo aparece en la relación. | HIPÓTESIS. | Diseño propio. |
| E12 | Conecta amperímetro en paralelo o voltímetro en serie. | Ve ambos como lectores intercambiables. | HIPÓTESIS. | Diseño propio. |
| E13 | Cambia signos de malla sin fijar sentido de recorrido. | Memoriza «sumar pilas, restar resistencias». | HIPÓTESIS. | Diseño propio. |
| E14 | Descarta una corriente calculada negativa. | Confunde orientación elegida con dirección física obligatoria. | HIPÓTESIS. | Diseño propio. |
| E15 | Usa potencia nominal como consumo fijo en cualquier condición. | Ignora tensión, tiempo y comportamiento del aparato. | HIPÓTESIS. | Diseño propio. |
| E16 | Afirma que más resistencia produce siempre más potencia. | Usa una fórmula sin identificar qué se mantiene fijo. | HIPÓTESIS. | Diseño propio. |
| E17 | Iguala fem y tensión terminal con cualquier carga. | Omite la resistencia interna del modelo real. | HIPÓTESIS. | Diseño propio. |
| E18 | Confunde velocidad de deriva con propagación de la señal. | Interpreta la animación como viaje de un electrón desde la pila al foco. | HIPÓTESIS. | Diseño propio; distinción física en [F7]. |
| E19 | Obtiene energía en kW o potencia en kWh. | Borra el papel del tiempo. | HIPÓTESIS. | Diseño propio. |

Las entrevistas de [F5] y el estudio universitario español publicado en REDIE [F6] aportan evidencia original; no se presentan porcentajes como si fueran prevalencias locales. No se encontró en esta revisión una investigación peruana específica que justificara esas cifras. Una respuesta aislada permite seleccionar una actividad de contraste, no diagnosticar definitivamente a la persona.

Los códigos también organizan la retroalimentación. Ante E05 conviene comparar simultáneamente dos lecturas de corriente; ante E09, deformar un cable sin cambiar sus extremos. Repetir la misma pregunta con otros números no distingue si el alumno corrigió su modelo o recordó una posición de respuesta.

## 4. Lo que la unidad da por sabido

Se requiere interpretar proporciones, despejar ecuaciones sencillas, usar potencias de diez y convertir unidades. También se necesita reconocer carga positiva y negativa, trabajo y energía, y la idea de campo eléctrico como descripción de una interacción sobre cargas. Si falta esa última noción, se añade un apoyo previo de fuerza sobre una carga; no se exige derivar campos.

No se presuponen ley de Ohm, fem, asociaciones de resistores ni reglas de Kirchhoff. Potencia se recupera como rapidez de transferencia de energía cuando llega la idea 6. La diferencia de potencial se construye en la idea 2, aunque el alumno haya escuchado la palabra «voltaje».

La comprobación inicial pide distinguir energía de carga en dos etiquetas, convertir miliamperios a amperios con una equivalencia dada y explicar qué significa «por segundo». El alumno no necesita memorizar el valor de la carga elemental; se proporciona cuando sea pertinente. Para los gráficos se requiere área de rectángulos y triángulos, con una tarjeta recordatoria.

En todos los casos se declara si los cables son ideales, si los instrumentos son ideales, si la fuente mantiene tensión y si los resistores mantienen su temperatura. Una bombilla real no se convertirá silenciosamente en resistor de valor constante. Los modelos simplificados estarán identificados en la ficha del objeto.

## 5. Las ideas, en orden

La secuencia es circuito y corriente; voltaje e instrumentos; resistencia; asociaciones; conservación en redes; potencia y fuente real. Cada idea usa entre tres y cuatro tarjetas de lectura. Los formularios aparecen después de observar la predicción y siguen disponibles durante la práctica. El valor pedagógico está en seleccionar relaciones y condiciones, no en ocultar ecuaciones.

### Idea 1. Cerrar el camino: ¿qué significa que circule corriente?

**Lo que aprende.** La corriente mide carga que atraviesa una sección por tiempo; un circuito estacionario necesita un camino conductor completo.

**Objeto de la primera pantalla.** Una linterna abierta sobre una mesa de taller, con pila, interruptor, contactos y foco pequeño de filamento. La carcasa aparece parcialmente transparente para reconocer el camino real. La primera vista no contiene flechas ni un esquema abstracto. El montaje es virtual y no usa un tomacorriente.

**Lee: cuatro tarjetas.**

1. «Esta linterna tiene una pila, un foco y piezas metálicas que permiten conectar sus contactos. El interruptor puede interrumpir una conexión».
2. «El foco tiene dos contactos separados. Cada uno llega a un extremo de su filamento».
3. «Los metales ya contienen partículas cargadas que pueden desplazarse. La pila participa en el funcionamiento del conjunto».
4. «Una sección del cable es un corte imaginario donde se registra cuánta carga pasa durante un intervalo».

**Juega: reconstruir la linterna.** El alumno arrastra dos conexiones y cierra el interruptor hasta que el foco funcione. La misión comprueba un recorrido que incluya ambos terminales de la pila y ambos contactos del foco, sin un puente que evite el foco. Se admite más de una disposición espacial correcta. Se muestra un único contador de carga; todavía no se compara qué ocurre antes y después del foco.

**Predice.** «En esta linterna funcionando de manera estable se colocan contadores a ambos lados del foco, en el mismo camino sin bifurcaciones. Durante el mismo intervalo, ¿qué indicarán?»

| Opción | Respuesta | Relación con el error |
| --- | --- | --- |
| A | Después del foco pasará menos carga porque este consume corriente. | E05. |
| B | Pasará la misma cantidad neta de carga por ambos lugares. | Correcta. |
| C | Solo pasará carga por el cable conectado al polo positivo. | E04. |
| D | El segundo contador marcará cero porque el foco tiene un único contacto eléctrico. | E02. |

**Mira.** Los contadores trabajan simultáneamente y registran cantidades iguales. El foco entrega luz y calor, pero los marcadores de carga no desaparecen. Se abre el interruptor y, después del breve ajuste que el modelo no resuelve, ambos registros dejan de aumentar. El cambio no se anima como una carga que debe recorrer primero toda la linterna para avisar al resto.

**La regla, completa.** La carga neta transferida se llama $Q$ y se mide en culombios, símbolo C. El intervalo es $\Delta t$, leído «delta te», y se mide en segundos. La intensidad media es $I=Q/\Delta t$, en amperios, A; un amperio equivale a un culombio por segundo. Para corriente constante, $Q=I\Delta t$. Si cambia, el área algebraica bajo un gráfico corriente-tiempo da la carga neta: áreas de signo contrario se restan. Si se pide cantidad total transportada en ambos sentidos, se suman magnitudes de áreas.

El sentido convencional de corriente corresponde al movimiento de carga positiva. En un metal los electrones tienen deriva opuesta. La corriente no es una sustancia adicional ni una rapidez: cuenta transferencia de carga. Si pasan $N$ electrones en un sentido, la magnitud de carga transferida es $Ne$, donde $e$ es la magnitud positiva de la carga elemental, proporcionada como dato. El número $N$ no tiene unidad.

En estado estacionario no se acumula indefinidamente carga en un tramo; por eso los dos extremos de un camino sin bifurcaciones registran igual intensidad. Al abrir un circuito resistivo deja de mantenerse corriente de conducción estacionaria en ese camino. Esto no significa que todo voltaje desaparezca: esa distinción se estudia a continuación.

Para una sección uniforme de área $A$, la densidad de corriente media en magnitud es $J=I/A$. Si hay $n$ portadores por volumen, cada uno con carga de magnitud $e$ y rapidez de deriva $v_d$, entonces $I=neAv_d$ y $J=nev_d$. Aquí $n$ es una densidad de portadores, no un número de resistores. Estas relaciones suponen flujo uniforme y una especie de portador; en ejercicios con otros portadores se proporciona la carga correspondiente.

La deriva es un promedio del movimiento de muchas partículas, distinto del movimiento microscópico desordenado y de la propagación de una perturbación eléctrica [F7]. No se ofrece una velocidad universal de la «electricidad». El circuito real tiene un ajuste inicial; el modelo de esta unidad describe lo que ocurre después.

**Así se resuelve: registro de una linterna.** Un sensor informa $N$ electrones que cruzaron una sección durante $\Delta t$. Primero se convierte el tiempo a segundos. Segundo, se obtiene la magnitud de carga como $Ne$. Tercero, se divide por el intervalo: $I=Ne/\Delta t$. Cuarto, se asigna signo según la orientación convencional elegida, no según el nombre del terminal más cercano. Quinto, se comprueba la unidad C/s. Si se pide otra sección del mismo camino estable, se conserva la intensidad; no se descuenta energía como si fuera carga.

**Ahora tú: progresión.**

1. Reconocer conexiones completas a partir de fotos o dibujos del objeto.
2. Interpretar datos de carga y tiempo con unidades explícitas.
3. Comparar dos tramos sin bifurcaciones y explicar la igualdad de corrientes.
4. Obtener carga de un gráfico por tramos rectangulares o triangulares.
5. Relacionar área, densidad de portadores y deriva cuando cambia una condición.
6. Resolver un caso de examen con movimiento periódico de carga, distinguiendo periodo de duración total y carga por paso de carga acumulada.

**Palabras nuevas.**

- **Contacto:** punto por el que una pieza se conecta eléctricamente con otra. Ejemplos: extremo de una pila; base del foco; terminal de un interruptor.
- **Corriente:** cantidad de carga que atraviesa una sección por unidad de tiempo. Ejemplos: paso por el cable de la linterna; paso por un resistor; paso registrado en un sensor de una rama.
- **Deriva:** avance promedio de los portadores, superpuesto a su movimiento desordenado. Ejemplos: electrones en un alambre; electrones en el filamento; portadores del modelo uniforme de una varilla.

### Idea 2. Comparar dos contactos: ¿qué mide el voltaje?

**Lo que aprende.** El voltaje relaciona energía y carga entre dos puntos; corriente y voltaje requieren mediciones diferentes.

**Objeto de la primera pantalla.** La misma linterna junto a un medidor con dos puntas y una pila de repuesto. Los contactos pueden señalarse tocándolos en pantalla. El objetivo cotidiano es comprobar el estado eléctrico de una conexión, sin presentar primero una tabla de símbolos.

**Lee: tres tarjetas.**

1. «Dos contactos pueden encontrarse en condiciones eléctricas diferentes aunque no haya un foco encendido entre ellos».
2. «La palabra voltaje se refiere a una comparación entre puntos. Un medidor utiliza dos referencias para mostrar esa comparación».
3. «Medir el paso de carga y comparar dos puntos son tareas distintas. Cada instrumento debe ubicarse según la magnitud que registra».

**Juega: elegir los puntos de medición.** Con una linterna cerrada y funcionando, el alumno coloca las puntas de un voltímetro virtual sobre los dos contactos del foco y luego sobre un mismo tramo de cable ideal. La misión comprueba los pares de puntos seleccionados y que no se haya cortado el camino original. La lectura se conserva junto a una fotografía de la conexión. Todavía no se mide la pila desconectada.

**Predice.** «Se retira la pila de la linterna y se mantienen las puntas de un voltímetro ideal sobre sus dos terminales. ¿Cuál situación puede ocurrir?»

| Opción | Respuesta | Relación con el error |
| --- | --- | --- |
| A | El voltímetro necesariamente marca cero porque no circula corriente por un foco. | E08. |
| B | El valor en voltios informa cuántos culombios pasan cada segundo. | E07. |
| C | Puede haber voltaje entre terminales sin corriente por una carga externa. | Correcta. |
| D | Para leer voltaje hay que sustituir el voltímetro por un amperímetro que una los terminales. | E12. |

**Mira.** El voltímetro conserva una lectura mientras el circuito externo permanece abierto. Aparece una segunda vista con un medidor de corriente insertado en un camino cerrado con carga. Las etiquetas «entre estos puntos» y «a través de esta sección» permanecen visibles. La lectura negativa al invertir puntas se presenta como cambio de referencia, no como avería automática.

**La regla, completa.** Se reserva $V$ para diferencia de potencial, o voltaje, entre dos puntos. Un voltio equivale a un julio por culombio. Para una transferencia ideal con voltaje constante, la magnitud de energía transferida es $W=QV$, donde $W$ representa energía transferida en julios; el signo se determina según el proceso y la orientación. No se usa $W$ como letra de potencia: W después de un número también es el símbolo de la unidad vatio, y se distingue por el contexto.

Una fuente ideal de tensión mantiene el voltaje especificado entre sus terminales mientras actúa dentro del modelo. Eso no fija por sí solo la corriente; el circuito conectado también importa. La fuerza electromotriz se representa con $\varepsilon$, «épsilon», y expresa energía suministrada por la fuente por unidad de carga. A pesar del nombre histórico, no se mide en newtons. En la fuente ideal su valor coincide con el voltaje terminal. La resistencia interna se incorpora en la idea 6.

Un voltímetro ideal se conecta entre los dos puntos cuya diferencia se desea medir y tiene resistencia infinita en el modelo, por lo que no desvía corriente. Un amperímetro ideal se intercala en el camino de la corriente que se desea medir y tiene resistencia nula. «En paralelo» y «en serie» se formalizarán en la idea 4; aquí se describen primero las acciones físicas. Un instrumento real modifica algo el circuito y tiene límites de uso.

Los puntos unidos por un mismo cable ideal tienen igual potencial en este modelo. La longitud dibujada de ese cable no crea una caída. Un circuito abierto puede tener voltaje entre sus extremos aunque no sostenga corriente. Unir terminales con un camino casi sin resistencia es una condición distinta de circuito abierto. El simulador no deberá representar ese puente como una lectura inocua de corriente.

**Así se resuelve: energía por carga.** Dos dispositivos reciben cargas iguales y tienen voltajes conocidos. Primero se verifica que se comparan los voltajes del dispositivo, no una tensión nominal de otra parte. Segundo, se forma $W=QV$ para cada uno. Tercero, al dividir energías se cancela la carga común y queda la razón de voltajes. Cuarto, se explica por qué una lectura de corriente aislada no basta para esa comparación energética. Quinto, si se invierten las referencias, se cambia el signo de la diferencia de potencial y se mantiene consistente el sentido de transferencia.

**Ahora tú: progresión.**

1. Elegir la pareja de contactos que responde a una medición solicitada.
2. Distinguir unidades C, A, J y V sin exigir recordarlas sin apoyo.
3. Comparar energía transferida para una carga dada.
4. Interpretar lecturas de signo contrario al invertir puntas.
5. Encontrar una conexión de instrumentos que alteraría el circuito.
6. Resolver una situación de examen que combine circuito abierto, cable ideal y voltaje no nulo, justificando por qué no se puede deducir corriente sin conocer el camino.

**Palabras nuevas.**

- **Voltaje:** diferencia eléctrica entre dos puntos expresada como energía por carga. Ejemplos: entre terminales de una pila; entre extremos de un resistor; entre dos puntos de cable ideal.
- **Terminal:** contacto definido para conectar un dispositivo. Ejemplos: polo de la pila; borne de un medidor; entrada de una resistencia.
- **Fuente:** dispositivo que puede aportar energía eléctrica al circuito. Ejemplos: pila; batería; fuente regulada de laboratorio.

### Idea 3. Cambiar el conductor: ¿de qué depende la resistencia?

**Lo que aprende.** La corriente depende del voltaje y del comportamiento del elemento; la resistencia de un conductor también depende de material, geometría y temperatura.

**Objeto de la primera pantalla.** Un carrete de alambre de un taller y un tablero virtual con fuente de baja tensión y medidores. Dos muestras tienen material y temperatura identificados. Antes de dibujar una gráfica se observan longitud y grosor, magnitudes reconocibles al trabajar con cables.

**Lee: cuatro tarjetas.**

1. «No todos los caminos conductores responden igual cuando se conectan a una fuente».
2. «Un resistor es un componente diseñado para ofrecer una resistencia determinada dentro de sus condiciones de funcionamiento».
3. «La longitud, la sección y el material describen una muestra. Cambiar una de esas características no es lo mismo que cambiar el voltaje».
4. «En el juego la temperatura se mantiene fija. Esa condición evita mezclar dos cambios durante una comparación».

**Juega: alcanzar una lectura.** Con un resistor ideal de 30 Ω y una fuente ajustable de 0 a 6 V, el alumno modifica el voltaje para alcanzar una corriente de 0,10 A. La misión comprueba la lectura y que el componente siga dentro del intervalo permitido. Puede repetir con el mismo resistor; no cambia todavía su sección. Los valores son didácticos, no una recomendación de montaje físico.

**Predice.** «Se reemplaza una muestra de alambre por otra del mismo material, misma longitud y temperatura, pero con el doble de área transversal. Se mantiene el mismo voltaje. ¿Qué ocurre con la corriente?»

| Opción | Respuesta | Relación con el error |
| --- | --- | --- |
| A | Aumenta porque la nueva muestra presenta menor resistencia. | Correcta. |
| B | Queda igual porque la fuente siempre entrega la misma corriente. | E01. |
| C | Disminuye porque más sección siempre significa más resistencia. | E11. |
| D | Se cuadruplica, porque duplicar área equivale a duplicar diámetro. | E11. |

**Mira.** Se compara la lectura de ambos alambres bajo el mismo voltaje. Luego se vuelve al resistor del juego y se muestran pares de voltaje y corriente. La gráfica aparece como resumen de mediciones, con nombres y unidades de los ejes. Se añade una curva de otro componente para mostrar que no todo dispositivo cumple proporcionalidad lineal.

**La regla, completa.** Para un resistor óhmico en condiciones fijas, $V=IR$, donde $R$ es resistencia en ohmios, Ω. Así, $I=V/R$ y $R=V/I$ para corriente no nula. Que el cociente permita calcular resistencia no significa que cambiar voltaje cambie necesariamente la resistencia. En un elemento óhmico constante, la gráfica de $V$ en función de $I$ es una recta por el origen cuya pendiente es $R$; si se invierten los ejes, la pendiente es $1/R$.

En un conductor uniforme de longitud $L$, sección transversal $A$ y resistividad $\rho$, se cumple $R=\rho L/A$. La resistividad se mide en Ω·m y caracteriza el material en condiciones especificadas; la resistencia caracteriza la pieza. El área se expresa en metros cuadrados si la resistividad usa metros. Para sección circular se proporciona $A=\pi d^2/4$, donde $d$ es diámetro. Duplicar diámetro no equivale a duplicar área.

Cerca de una temperatura de referencia $T_0$, un modelo lineal es $R=R_0[1+\alpha(T-T_0)]$ si la geometría cambia de forma despreciable. $R_0$ es resistencia a la referencia y $\alpha$ el coeficiente térmico dado. El intervalo de validez debe declararse; no se extiende la recta indefinidamente ni se supone que todos los materiales tengan el mismo signo de coeficiente [F8].

Como ampliación, el modelo de Drude describe una deriva promedio entre interacciones. En el modelo clásico, $\rho=m_e/(ne^2\tau)$: $m_e$ es masa del electrón y $\tau$ el tiempo medio entre interacciones [F16]. Se proporcionan relación y constantes. No explica por completo todos los sólidos ni identifica $\tau$ con el tiempo de propagación de la señal. La relación $I=neAv_d$ conecta esta escala con la medición.

Un foco de filamento cambia de temperatura al funcionar y no debe tratarse como resistor constante en cualquier intervalo. Un LED requiere otra descripción. En ejercicios de esta unidad, «lámpara idealizada como resistor» significa que el enunciado fija esa simplificación; su brillo no se calculará hasta introducir potencia.

**Así se resuelve: comparación de alambres.** Se identifican las condiciones que permanecen iguales. Se escribe $R_1=\rho L/A_1$ y $R_2=\rho L/A_2$. Se divide para cancelar material y longitud: $R_2/R_1=A_1/A_2$. Manteniendo voltaje, $I_2/I_1=R_1/R_2=A_2/A_1$. Se comprueba que mayor sección corresponde a menor resistencia. Si el dato fuera diámetro, se convierte primero en área; si cambiara temperatura, esa cancelación de resistividad ya no estaría justificada sin datos adicionales.

**Ahora tú: progresión.**

1. Elegir pares de datos suficientes para calcular resistencia.
2. Reconocer proporcionalidad óhmica a partir de una tabla.
3. Interpretar la pendiente según el orden de los ejes.
4. Comparar alambres con cambios de longitud, área o diámetro.
5. Incorporar temperatura dentro de un intervalo especificado.
6. Resolver una comparación de examen con dos cambios simultáneos y decidir si corresponde cancelar resistividad.
7. En la extensión UNI, conectar densidad de corriente y deriva usando el modelo proporcionado.

**Palabras nuevas.**

- **Resistencia:** relación que describe cuánto voltaje requiere una corriente en las condiciones del elemento. Ejemplos: resistor fijo; tramo de alambre; filamento a una temperatura dada.
- **Resistividad:** característica del material que interviene en la resistencia de una pieza. Ejemplos: cobre a una temperatura indicada; nicromo de una ficha; aluminio bajo condiciones dadas.
- **Óhmico:** comportamiento donde voltaje y corriente son proporcionales mientras las condiciones se mantienen. Ejemplos: resistor ideal del tablero; alambre metálico a temperatura controlada; muestra con tabla lineal por el origen.

### Idea 4. Seguir las conexiones: ¿serie o paralelo?

**Lo que aprende.** La conexión depende de los nodos compartidos y de los caminos disponibles; la forma del dibujo puede cambiar sin cambiar el circuito.

**Objeto de la primera pantalla.** Una maqueta de un puesto de feria con dos letreros luminosos alimentados por una fuente virtual. Para las mediciones se muestran los resistores que representan las cargas del modelo. Se puede levantar la cubierta y seguir los cables reales de la maqueta antes de simplificarlos en un esquema.

**Lee: tres tarjetas.**

1. «Los dos letreros deben conectarse a una fuente. Los cables pueden doblarse y cambiar de posición sin desconectar sus extremos».
2. «Un nodo reúne puntos conectados mediante cable ideal. Una rama es un camino entre nodos que contiene elementos».
3. «El dibujo servirá para guardar las conexiones. La posición de un componente en la pantalla no define por sí sola cómo está conectado».

**Juega: conservar un circuito al redibujarlo.** El alumno mueve tres resistores y curva sus cables para despejar la pantalla, sin cambiar qué extremos están conectados. La misión comprueba la identidad de los nodos antes y después. Luego empareja dos dibujos que representan ese mismo montaje. No se añade todavía una nueva rama.

**Predice.** «Una fuente ideal mantiene su voltaje. A un resistor conectado entre sus terminales se añade otro resistor positivo entre los mismos terminales. ¿Qué ocurre con la corriente total suministrada?»

| Opción | Respuesta | Relación con el error |
| --- | --- | --- |
| A | Permanece igual porque depende únicamente de la pila. | E01. |
| B | Disminuye porque el nuevo resistor consume parte de la corriente. | E05. |
| C | Solo puede saberse mirando cuál resistor quedó dibujado arriba. | E09. |
| D | Aumenta: aparece un camino adicional con el mismo voltaje. | Correcta. |

**Mira.** Se mide la corriente de cada rama y la total. El resistor original conserva su voltaje y corriente porque la fuente del modelo es ideal. La fuente suministra ahora la suma de ambos aportes. Se deforma el dibujo y se repite la lectura para vincular el resultado a conexiones y condiciones, no a la apariencia.

**La regla, completa.** Dos resistores están en serie cuando comparten un nodo sin otra rama que desvíe corriente y pertenecen al mismo camino. En estado estable pasa igual corriente por ambos. Como las diferencias de potencial se suman a lo largo del camino, $V=IR_1+IR_2=I(R_1+R_2)$. La resistencia equivalente es $R_{\mathrm{eq}}=R_1+R_2$, y se extiende sumando más resistores en serie.

Dos resistores están en paralelo si sus extremos se conectan a los mismos dos nodos. Ambos tienen el mismo voltaje y las corrientes son $I_1=V/R_1$ e $I_2=V/R_2$. La corriente total es su suma. Al escribir $I=V/R_{\mathrm{eq}}$ se obtiene $1/R_{\mathrm{eq}}=1/R_1+1/R_2$. Para dos resistores, $R_{\mathrm{eq}}=R_1R_2/(R_1+R_2)$. Con resistencias positivas finitas, la equivalente en paralelo es menor que cualquiera de ellas.

El símbolo «eq» significa equivalente: el conjunto y su reemplazo tienen la misma relación entre voltaje y corriente vistos desde los dos terminales elegidos. La equivalencia no afirma que la corriente de cada elemento interno sea igual a la total. Después de reducir hay que volver al circuito original para recuperar las corrientes y voltajes internos.

Para dos elementos en serie, el reparto de voltaje es proporcional a sus resistencias: $V_1/V_2=R_1/R_2$. Para dos ramas resistivas en paralelo, $I_1/I_2=R_2/R_1$. El reparto de corriente solo es igual si las resistencias de esas ramas son iguales. Estas relaciones se derivan de la corriente común o del voltaje común; no se enseñan como recetas independientes.

Si un resistor queda conectado entre dos puntos del mismo nodo ideal, su voltaje es cero y no circula corriente por él en el modelo resistivo. Una rama abierta tampoco conduce corriente estacionaria, aunque sus extremos puedan tener voltaje. Un cruce de cables sin contacto no crea un nodo: la convención gráfica debe estar explicada. Añadir una rama puede cambiar las corrientes de otras ramas si la fuente no mantiene el voltaje; ese caso se retoma en la idea 6 [F9].

En un circuito mixto se reduce únicamente un grupo cuya conexión ya se verificó. Si no existe una reducción inmediata, no se fuerza una suma por cercanía visual. Una red puede requerir las reglas de la siguiente idea. No se anticipa una transformación estrella-triángulo sin enseñarla; queda fuera del banco básico.

**Así se resuelve: una resistencia seguida de dos ramas.** Se nombran los nodos. Se comprueba que $R_2$ y $R_3$ comparten dos nodos y se obtiene su equivalente $R_{23}=R_2R_3/(R_2+R_3)$. Ese equivalente queda en serie con $R_1$, por lo que $R_{\mathrm{eq}}=R_1+R_{23}$. Se calcula la corriente total con el voltaje de la fuente. Se obtiene el voltaje del bloque paralelo como $V_{23}=IR_{23}$ y se recuperan $I_2=V_{23}/R_2$ e $I_3=V_{23}/R_3$. Se comprueba $I_2+I_3=I$. Los subíndices identifican componentes o bloques, no multiplicaciones.

**Ahora tú: progresión.**

1. Identificar nodos en el objeto y trasladarlos al esquema.
2. Reconocer serie y paralelo en dibujos deformados.
3. Comparar una equivalente con las resistencias originales antes de calcular.
4. Reducir un circuito mixto y recuperar magnitudes internas.
5. Analizar qué cambia al abrir un interruptor o puentear un elemento.
6. Resolver un caso de examen con elementos iguales y cantidad desconocida, eligiendo primero la relación de asociación.
7. Detectar una red que no puede reducirse mediante una combinación inmediata de serie y paralelo.

**Palabras nuevas.**

- **Nodo:** conjunto de contactos unidos sin caída de voltaje en el modelo. Ejemplos: unión de tres cables; barra conductora ideal; puntos de un mismo cable continuo.
- **Rama:** camino identificado entre nodos. Ejemplos: recorrido con un resistor; recorrido con fuente y resistor; camino que puede abrir un interruptor.
- **Equivalente:** reemplazo que conserva una relación observada desde determinados terminales. Ejemplos: dos resistores en serie; dos ramas paralelas; bloque mixto ya reducido.

### Idea 5. Conservar carga y energía: ¿cómo analizar una red que no se reduce de inmediato?

**Lo que aprende.** Las ecuaciones de nudos y recorridos cerrados expresan conservaciones distintas; sus signos dependen de referencias explícitas.

**Objeto de la primera pantalla.** Un tablero didáctico que alimenta dos pequeños indicadores de una maqueta de movilidad urbana. Se ven bornes, fuentes rotuladas y resistores. El alumno puede seguir cada conexión con un dedo. Solo después aparece un esquema que conserva colores de nodos y nombres de componentes.

**Lee: tres tarjetas.**

1. «Algunas conexiones dejan varios caminos posibles. Reducir resistores por parejas ya no resuelve de inmediato toda la red».
2. «Se puede llevar una cuenta de lo que entra y sale de un nodo, y otra de los cambios de voltaje al recorrer un camino cerrado».
3. «Las flechas que dibujemos serán referencias para escribir esas cuentas. El resultado permitirá comprobar si acertamos su orientación».

**Juega: cerrar una cuenta de nodo.** En un tablero con tres ramas y lecturas dadas, el alumno orienta flechas y asigna una lectura faltante para que el registro de entrada iguale al de salida. La misión comprueba igualdad y unidades. Después marca un recorrido cerrado que vuelve al punto inicial sin saltar conexiones. No se resuelve aún una corriente que resulte opuesta a la orientación elegida.

**Predice.** «Se elige una flecha para una corriente desconocida, se escriben las ecuaciones de manera consistente y al resolver se obtiene un valor negativo. ¿Cómo debe interpretarse?»

| Opción | Respuesta | Relación con el error |
| --- | --- | --- |
| A | La corriente circula en sentido opuesto a la flecha elegida. | Correcta. |
| B | El circuito es imposible porque no existen números negativos de corriente. | E14. |
| C | Hay que borrar el signo en todas las ecuaciones sin revisar orientaciones. | E13. |
| D | El valor indica que la fuente dejó de suministrar su corriente fija. | E01. |

**Mira.** Un indicador invierte el sentido de la flecha física y conserva una etiqueta con la referencia original. Se sustituyen los valores con signo en la ecuación del nodo y se verifica el balance. Luego se invierte voluntariamente una referencia desde el inicio y se muestra que cambian algunos signos, pero no la predicción física.

**La regla, completa.** En un nodo sin acumulación de carga en régimen estacionario, la suma de corrientes que entran es igual a la suma de las que salen. Se puede escribir $\sum I_{\mathrm{entra}}=\sum I_{\mathrm{sale}}$. El símbolo $\sum$, «sumatoria», indica sumar todas las ramas incluidas. Esta igualdad no exige repartir la corriente por partes iguales.

En un recorrido cerrado de un circuito concentrado de corriente continua, la suma algebraica de los cambios de potencial es cero. Al recorrer un resistor en el sentido de la corriente de referencia, el cambio es $-IR$; en sentido contrario es $+IR$. Al cruzar una fuente ideal del terminal negativo al positivo, el cambio es $+\varepsilon$; al revés, $-\varepsilon$. Un cable ideal aporta cero.

Las ecuaciones se escriben después de elegir recorridos y flechas. Si una corriente resulta negativa, su sentido real se opone al supuesto. No se modifica una ecuación aislada para hacerla positiva. Tampoco se asigna automáticamente signo positivo a todas las fuentes: depende de cómo se cruza cada una. Dos fuentes opuestas solo se cancelan si sus fem son iguales.

Para una red conectada, no todas las ecuaciones de nudos son independientes: al sumar todas, cada corriente interna aparece entrando y saliendo. Se elige un conjunto suficiente de ecuaciones independientes y se comprueba el resto. En un puente no reducible de inmediato, pueden usarse corrientes de rama y recorridos independientes. No se exige aprender un algoritmo de mallas separado para comenzar.

Las reglas representan conservación de carga y consistencia de potencial en este modelo [F10]. No se extrapolan sin aclaración a un lazo atravesado por flujo magnético variable. Los signos de una lectura de voltímetro deben seguir el mismo orden de puntos que se usa en la ecuación.

**Así se resuelve: dos fuentes en oposición.** Se plantea un lazo con resistores en serie y dos fuentes cuyas polaridades se conocen. Se elige una flecha de corriente. Si el recorrido cruza la primera fuente de menos a más y la segunda de más a menos, se escribe $\varepsilon_1-\varepsilon_2-I(R_1+R_2)=0$. Al despejar, $I=(\varepsilon_1-\varepsilon_2)/(R_1+R_2)$. Se interpreta el signo, se recuperan las caídas en cada resistor y se comprueba que la suma del recorrido sea cero. Si se invierte el recorrido, se multiplica toda la ecuación por menos uno; no cambia el resultado físico.

Como variante, el tablero conserva dos nodos y tres ramas. El guion no empieza sustituyendo números: primero pide una ecuación de nodo y dos relaciones de recorrido. Después resuelve el sistema por sustitución o eliminación, identifica la corriente solicitada y verifica un recorrido no usado. El equipo genera valores que eviten corrientes enormes o fuentes incompatibles.

**Ahora tú: progresión.**

1. Completar corrientes en un nodo con sentidos dados.
2. Asignar signos al recorrer un resistor y una fuente.
3. Resolver un lazo con fuentes en oposición.
4. Interpretar lecturas negativas sin modificar el circuito.
5. Escribir ecuaciones independientes en una red de dos lazos.
6. Resolver un problema de examen que combine lectura de amperímetro, voltaje entre puntos y una corriente de sentido inicialmente desconocido.
7. Comprobar una solución propuesta mediante un balance, sin resolver de nuevo todo el sistema.

**Palabras nuevas.**

- **Lazo:** recorrido cerrado que vuelve al punto de partida. Ejemplos: vuelta por fuente y resistor; vuelta por dos ramas; recorrido exterior de una red.
- **Referencia:** elección que permite expresar una medición con signo. Ejemplos: flecha de corriente; orden de puntas del voltímetro; sentido de recorrido del lazo.
- **Conservación:** cuenta que exige que una cantidad no aparezca ni desaparezca sin explicación. Ejemplos: carga en un nodo; energía en un circuito estacionario; igualdad entre aportes y transferencias.

### Idea 6. Usar energía: ¿qué consume un aparato y por qué cae el voltaje de una pila?

**Lo que aprende.** La potencia mide rapidez de transferencia de energía; una fuente real puede entregar un voltaje terminal menor que su fem al suministrar corriente.

**Objeto de la primera pantalla.** Una lámpara portátil de un puesto de trabajo junto a dos baterías virtuales y un registro de duración. Se conservan las etiquetas de voltaje y corriente de las ideas anteriores. El alumno reconoce la diferencia cotidiana entre «funciona con más intensidad» y «se usó durante más tiempo».

**Lee: cuatro tarjetas.**

1. «Un aparato puede transformar energía eléctrica en luz, calor o movimiento. La carga que circula y la energía transferida no son la misma cantidad».
2. «La potencia describe el ritmo de transferencia. El tiempo de uso también importa para el total de energía».
3. «Una batería real tiene procesos internos. Su etiqueta nominal no promete una lectura idéntica bajo cualquier demanda».
4. «La escena comparará datos de un modelo. La duración real depende además del estado de la batería y de cómo se utiliza el aparato».

**Juega: cumplir una duración dentro de un presupuesto energético.** El alumno reparte una hora entre modos de 1 W y 2 W, usando al menos 15 minutos el segundo y sin superar 1,5 Wh. Un registro muestra energía y tiempo. Se comprueban ambas metas. La fuente es ideal; todavía no se muestra caída terminal por resistencia interna.

**Predice.** «Dos baterías tienen la misma fem y alimentan por separado el mismo resistor. Una tiene mayor resistencia interna, manteniéndose iguales las demás condiciones del modelo. ¿Cuál entrega menor voltaje al resistor?»

| Opción | Respuesta | Relación con el error |
| --- | --- | --- |
| A | Ninguna: igual fem obliga a igual voltaje terminal bajo cualquier carga. | E17. |
| B | La de mayor resistencia interna. | Correcta. |
| C | Ambas mantienen la misma corriente porque cada batería la fija por sí sola. | E01. |
| D | La de menor resistencia interna, porque menos resistencia siempre significa menos potencia. | E16. |

**Mira.** Se muestran una fuente ideal y un resistor interno dentro de cada carcasa transparente. Se leen corriente y voltaje externo. Un registro de energía separa lo transferido a la carga de lo disipado internamente. Las cargas no desaparecen en la batería más resistiva; la diferencia es de voltaje, intensidad y reparto energético.

**La regla, completa.** La potencia media es $P=W/\Delta t$. Para voltaje y corriente constantes bajo una convención de receptor, $P=VI$. En un resistor óhmico, al sustituir la ley de Ohm se obtiene $P=I^2R=V^2/R$. Si se mantiene corriente, mayor resistencia implica mayor potencia; si se mantiene voltaje, mayor resistencia implica menor potencia. Sin identificar la condición constante, ninguna de esas frases es una regla universal.

La energía transferida con potencia constante es $W=P\Delta t$. Para varios intervalos se suman sus energías. La energía disipada por efecto Joule en un resistor de valor constante es $W=I^2R\Delta t$. Si se calcula un aumento de temperatura, se necesita además un modelo térmico y datos de masa, calor específico y pérdidas; no se supone que toda energía eleve exclusivamente la temperatura del objeto.

Un kilovatio-hora, kWh, es una unidad de energía: $1\ \mathrm{kWh}=3,6\times10^6\ \mathrm{J}$. No equivale a kW/h. En un problema de costo, se multiplica energía en kWh por la tarifa dada, añadiendo solo cargos expresamente incluidos. La eficiencia $\eta$ es energía útil dividida entre energía de entrada, o la correspondiente razón de potencias en régimen compatible. No se equipara brillo de un LED y un filamento solo por su potencia eléctrica [F12].

Para una fuente de fem $\varepsilon$ y resistencia interna $r$ que entrega corriente a una carga resistiva $R$, el circuito tiene $I=\varepsilon/(R+r)$ y voltaje terminal $V=\varepsilon-Ir=IR$. En circuito abierto del modelo, $I=0$ y $V=\varepsilon$. Al entregar corriente, parte de la potencia $\varepsilon I$ se disipa como $I^2r$ y la carga recibe $I^2R$. Se comprueba $\varepsilon I=I^2r+I^2R$ [F11].

Si una fuente está siendo cargada y se adopta corriente positiva entrando por su terminal positivo, la relación de terminales cambia a $V=\varepsilon+Ir$. El enunciado debe aclarar el régimen y la convención; no se usa siempre un signo menos. Las fuentes ideales en paralelo solo son compatibles si imponen el mismo voltaje; conectar ideales distintos directamente produce un modelo inconsistente.

No se deduce la autonomía de una batería únicamente de su voltaje nominal. Una capacidad dada en Ah expresa carga; para estimar energía hace falta el comportamiento del voltaje, o una aproximación explícita de voltaje constante. Una aproximación de capacidad ideal tampoco describe por sí sola descarga real, temperatura o envejecimiento. El banco puede comparar modelos, pero no prometer duraciones comerciales sin una ficha adecuada.

**Así se resuelve: fuente real y carga.** Se suman resistencia externa e interna. Se calcula $I=\varepsilon/(R+r)$. Se obtiene el voltaje terminal de dos maneras: $\varepsilon-Ir$ e $IR$. Se calcula potencia útil como $I^2R$ e interna como $I^2r$. Al multiplicar cada una por el intervalo se obtienen energías. Finalmente se verifica el balance y, si corresponde, $\eta=R/(R+r)$ para este modelo resistivo de una sola fuente. No se usa esa última expresión como eficiencia universal de cualquier aparato.

**Ahora tú: progresión.**

1. Distinguir potencia de energía en etiquetas.
2. Calcular energía por intervalos de potencia constante.
3. Comparar resistores identificando si se fija voltaje o corriente.
4. Aplicar Joule y seleccionar datos térmicos necesarios.
5. Obtener corriente y tensión terminal de una fuente real.
6. Interpretar capacidad en Ah con una aproximación explícita.
7. Resolver un problema de examen con potencia en una rama de una red, consumo durante un intervalo y balance de energía de la fuente.

**Palabras nuevas.**

- **Potencia:** ritmo al que se transfiere energía. Ejemplos: resistor calentando; lámpara funcionando; fuente entregando energía.
- **Efecto Joule:** transformación de energía eléctrica en energía térmica por el paso de corriente en un elemento resistivo. Ejemplos: filamento; resistor de un tablero; resistencia interna del modelo de batería.
- **Resistencia interna:** parte resistiva con la que se representa el comportamiento interno de una fuente. Ejemplos: pila nueva del modelo; pila con mayor pérdida interna; batería equivalente de una ficha.
- **Eficiencia:** parte de lo recibido que se considera útil para un propósito declarado. Ejemplos: energía entregada a la carga; energía destinada a calentar el objeto; potencia mecánica útil de un equipo con datos proporcionados.

## 6. Tabla de letras y símbolos de la unidad

| Símbolo | Significado | Unidad |
| --- | --- | --- |
| $Q$ | Carga neta transferida. | C. |
| $I$ | Intensidad de corriente con referencia indicada. | A. |
| $\Delta t$ | Intervalo de tiempo. | s. |
| $N$, $e$ | Número de electrones; magnitud de carga elemental. | Sin unidad; C. |
| $A$ | Área transversal del conductor. | m². |
| $J$ | Densidad de corriente en magnitud. | A/m². |
| $n$ | Densidad numérica de portadores. | m⁻³. |
| $v_d$ | Rapidez de deriva. | m/s. |
| $V$ | Diferencia de potencial entre puntos identificados. | V. |
| $W$ | Energía transferida. | J o kWh, según los datos. |
| $\varepsilon$ | Fuerza electromotriz de una fuente. | V. |
| $R$, $R_{\mathrm{eq}}$, $r$ | Resistencia externa, equivalente e interna. | Ω. |
| $L$, $d$ | Longitud y diámetro del conductor. | m. |
| $\rho$ | Resistividad. | Ω·m. |
| $T$, $T_0$, $R_0$ | Temperatura, referencia y resistencia a esa referencia. | °C o K; Ω para resistencia. |
| $\alpha$ | Coeficiente térmico del modelo lineal. | K⁻¹ o °C⁻¹. |
| $m_e$, $\tau$ | Masa del electrón; tiempo medio de interacción en Drude. | kg; s. |
| $P$, $\eta$ | Potencia; eficiencia definida. | W; sin unidad. |
| $\sum$, $\Delta$, $\pi$ | Suma de términos; cambio o intervalo; constante del círculo. | Según expresión; π sin unidad. |
| Subíndices numéricos | Identificadores de componentes, ramas o mediciones. | No son multiplicaciones. |
| $=$, $<$, $>$ | Igualdad, menor que y mayor que. | Relaciones. |

**Choques.** $A$ variable es área y A como unidad es amperio; $J$ variable es densidad de corriente y J como unidad es julio. $W$ variable es energía y W como unidad es vatio. Se leen siempre con significado. No se usa E para energía y campo a la vez. $Q$ no significa calor en esta unidad. Los nombres de nodos se escriben como etiquetas «nodo 1», «nodo 2» para no crear otro significado para una letra.

## 7. Otras formas de explicarla, con su riesgo

| Recurso | Idea y utilidad | Riesgo y corrección | Procedencia |
| --- | --- | --- | --- |
| Linterna con contactos visibles. | 1–2: traducir objeto a circuito. | El dibujo puede ocultar un contacto; mostrar ambos y la separación aislante. | Diseño propio, contraste con dificultades [F5]. |
| Cuenta de carga y cuenta de energía separadas. | 1, 2 y 6: evitar «corriente gastada». | Presentarlas como sustancias transportadas en paquetes idénticos. Aclarar que son registros del modelo. | Diseño propio. |
| Circuito hidráulico cerrado con bomba. | 2 y 4: caudal frente a diferencia de presión. | Una fuente abierta de agua sugiere que no se necesita retorno. Explicitar circuito lleno y límites. | Analogía de continuidad comentada en [F10]; adaptación propia. |
| Deformar cables sin alterar extremos. | 4: reconocer topología. | Confundir alargar el dibujo con alargar físicamente un conductor resistivo. Mantener cable ideal. | Diseño propio. |
| Gráfica obtenida de mediciones. | 3: identificar relación óhmica. | Memorizar pendiente sin leer ejes. Mostrar ambos órdenes de variables. | Desarrollo propio contrastado con [F8]. |
| Balance alrededor de un recorrido. | 5: signos y vuelta al punto inicial. | Convertir flechas de referencia en movimientos reales de electrones. Separar ambas vistas. | Fundamento en [F10]. |
| Fuente ideal más resistor dentro de una carcasa. | 6: explicar caída terminal. | Creer que toda batería contiene literalmente un resistor separado y constante. Rotular «circuito equivalente». | [F11]. |

Un circuito de cuerda o cadena cerrada puede mostrar movimiento simultáneo sin desaparición de eslabones. Es una propuesta analógica, no prueba experimental: la tensión mecánica y la transmisión real de energía eléctrica no son idénticas. Si el alumno empieza a atribuir rigidez o desplazamiento mecánico a los cables, se vuelve a la lectura de instrumentos.

Se puede consultar el catálogo oficial de PhET, *Circuit Construction Kit: DC* [F15], como referencia de exploración. Esta propuesta no presupone incorporar su motor ni haber auditado cada detalle de su simulación. La actividad final debe conservar sus propios objetos y preguntas.

## 8. Datos del mundo, con fuente

| Dato comprobable | Uso pedagógico | Fuente y límite |
| --- | --- | --- |
| La ficha de la pila alcalina AA Energizer E91 indica 1,5 V nominales. | Leer una etiqueta sin confundir nominal con constante exacta. | Ficha técnica del fabricante [F13]. |
| Esa ficha indica resistencia interna nominal de 150 a 300 mΩ para pila nueva. | Comparar fuente ideal y modelo con pérdida interna. | [F13]; rango típico, no garantía universal ni parámetro fijo durante toda la descarga. |
| La información técnica de MINEM de 2009 describe 220 V nominales residenciales y frecuencia de 60 Hz. | Reconocer que la red doméstica corresponde a corriente alterna y no a la pila del juego. | Documento institucional [F14], extracto indexado; el PDF completo no fue accesible en la consulta. |
| Los ensayos de descarga de la ficha E91 especifican cargas, ciclos y temperatura. | Explicar por qué una sola cifra de autonomía no caracteriza todo uso. | [F13]; no extrapolar una curva a otra condición. |

Las tensiones y resistencias de las misiones son parámetros ficticios de un simulador. No representan una instalación de un colegio ni un diagnóstico de una vivienda. Las referencias peruanas aportan contexto de lectura de etiquetas, no una invitación a intervenir la red eléctrica.

## 9. Dudas y decisiones

| Asunto | Decisión adoptada | Pendiente para el proyecto |
| --- | --- | --- |
| Frecuencia de admisión. | No se declara un orden de frecuencia. | Ampliar periodos y áreas con cuadernillos oficiales. |
| Evidencia peruana. | No extrapolar prevalencias de estudios extranjeros. | Probar distractores localmente con explicación de la elección. |
| Modelo de lámpara. | Separar objeto reconocible y resistor idealizado. | Definir si el motor representará variación térmica; si no, declararlo. |
| Drude. | Ampliación conceptual con ecuación y constantes proporcionadas. | Confirmar profundidad para la ruta UNI; conservar acceso sin bloquear el núcleo. |
| Instrumentos. | Empezar con ideales y explicitar su conexión. | Decidir si habrá ejercicios de resistencia finita de medidores. |
| Fuente real. | Modelo de fem y resistencia interna constante por caso. | Seleccionar rangos plausibles y declarar régimen de descarga o carga. |
| Potencia y brillo. | No comparar tecnologías distintas mediante brillo proporcional a potencia. | Definir un indicador visual cuyo significado esté escrito. |
| Contenido excluido. | Sin transitorios, capacitancia, inducción ni circuitos de alterna. | Coordinar enlaces con sus unidades respectivas. |

**Revisión de dependencias.** La idea 1 introduce corriente y carga; la 2, voltaje y medición; la 3, resistencia; la 4 usa esas tres magnitudes para asociaciones; la 5 generaliza conservaciones; la 6 añade potencia y fuente real. No se pide calcular brillo antes de potencia ni usar resistencia interna antes de explicarla. Las seis predicciones presentan cuatro opciones con tres errores identificados.

Los ejercicios resueltos muestran el método y su comprobación simbólica. El equipo que implementa seleccionará y recalculará los datos, revisará límites de funcionamiento y validará la representación. Las misiones no se aprueban solo por apariencia: deben coincidir conexiones, magnitudes y condiciones declaradas.

## 10. Fuentes

- **F1. CEPREUNI (2026).** *Guía del estudiante, ciclo preuniversitario Admisión 2026-2*, física, semanas 15–16. [PDF oficial](https://www.cepre.uni.edu.pe/assets/archivos/comunicados/PREUNIVERSITARIO-GUIADELESTUDIANTE-2026-2.pdf).
- **F2. Universidad Nacional de Ingeniería, OCAD (2012).** *Solucionario del examen de admisión 2012-1*, tercera prueba, preguntas 16–17. [Publicación oficial](https://admision.uni.edu.pe/wp-content/uploads/2022/11/solucionario2012.pdf).
- **F3. Universidad Nacional Mayor de San Marcos, OCA (2024).** *Examen general de admisión 2024-II, área A, 16 de marzo*. [Cuadernillo reproducido por terceros](https://www.scribd.com/document/715054893/Examen-Unmsm-2024-Ii-area-A-16-03). Se consultó para tipología, no para copiar problemas.
- **F4. UNMSM, Centro Preuniversitario (2024).** *Física, semana 12, ciclo 2024-II: Corriente eléctrica y circuitos eléctricos*. [Reproducción del material original](https://es.scribd.com/document/1042293533/FISICA-SEMANA-N-12-CICLO-ORDINARIO-2024-II-1).
- **F5. Engelhardt, Paula Vetter, y Beichner, Robert J. (2004).** *Students’ understanding of direct current resistive electrical circuits*. American Journal of Physics, 72, 98–115. DOI 10.1119/1.1614813. [Artículo original completo](https://web.phys.ksu.edu/papers/2004/englehardt-beichner-ajp-1-04.pdf).
- **F6. Periago, María Cristina, y Bohigas, Xavier (2005).** *Persistencia de las ideas previas sobre potencial eléctrico, intensidad de corriente y ley de Ohm en los estudiantes de segundo curso de Ingeniería*. REDIE, 7(2). [Artículo original](https://redie.uabc.mx/redie/article/download/136/1096/7438).
- **F7. Ling, Samuel J.; Sanny, Jeff; Moebs, William (2016).** *University Physics, Volume 2*, 9.2: Model of Conduction in Metals. OpenStax. [Capítulo](https://openstax.org/books/university-physics-volume-2/pages/9-2-model-of-conduction-in-metals).
- **F8. Ling, Sanny y Moebs (2016).** Obra citada, 9.3: Resistivity and Resistance. [Capítulo](https://openstax.org/books/university-physics-volume-2/pages/9-3-resistivity-and-resistance).
- **F9. Ling, Sanny y Moebs (2016).** Obra citada, 10.2: Resistors in Series and Parallel. [Capítulo](https://openstax.org/books/university-physics-volume-2/pages/10-2-resistors-in-series-and-parallel).
- **F10. Ling, Sanny y Moebs (2016).** Obra citada, 10.3: Kirchhoff’s Rules. [Capítulo](https://openstax.org/books/university-physics-volume-2/pages/10-3-kirchhoffs-rules).
- **F11. Ling, Sanny y Moebs (2016).** Obra citada, 10.1: Electromotive Force. [Capítulo](https://openstax.org/books/university-physics-volume-2/pages/10-1-electromotive-force).
- **F12. Ling, Sanny y Moebs (2016).** Obra citada, 9.5: Electrical Energy and Power. [Capítulo](https://openstax.org/books/university-physics-volume-2/pages/9-5-electrical-energy-and-power).
- **F13. Energizer (s. f.; versión consultada en 2026).** *Energizer E91 AA, Product Datasheet*, archivo E91NA0426. [Ficha del fabricante](https://data.energizer.com/pdfs/E91NA0426.pdf).
- **F14. Ministerio de Energía y Minas del Perú (2009).** *Sector eléctrico del Perú*, folleto institucional. [PDF institucional](https://cdn.www.gob.pe/uploads/document/file/5315681/4767869-brochure-electricidad-2009.pdf). Se dispuso del extracto indexado, no de lectura íntegra.
- **F15. University of Colorado Boulder, PhET Interactive Simulations (s. f.).** *Circuit Construction Kit: DC*. [Catálogo oficial](https://phet.colorado.edu/en/simulations/circuit-construction-kit-dc).
- **F16. Delft University of Technology, Open Solid State Notes (s. f.).** *Drude model*. [Apuntes del curso](https://solidstate.quantumtinkerer.tudelft.nl/3_drude_model/). Referencia para la ampliación microscópica y sus límites.

«s. f.» indica ausencia de fecha editorial identificada. Los materiales docentes orientan la cobertura; las escenas, preguntas y guiones de esta propuesta son propios.

