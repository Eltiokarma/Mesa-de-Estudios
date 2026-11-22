# Trigonometría · Coordenadas polares y números complejos

Propuesta de teoría para Mesa de Estudios, etapa 22: estudiantes de 5.º y postulantes peruanos que estudian en el celular. Diseño pedagógico, sin implementación ni banco final calculado. Fuentes revisadas al 21 de noviembre de 2026, hora del Perú.

## 1. Resumen en 5 líneas

La unidad enseña a describir una ubicación mediante una distancia dirigida y un ángulo, y a traducirla a coordenadas rectangulares.
Extiende esa descripción a distancias, áreas y lugares geométricos: rectas, circunferencias y cónicas con foco en el polo.
Presenta cada número complejo como un solo número que admite representaciones rectangular, geométrica, trigonométrica y exponencial.
Explica por qué multiplicar combina escalas y giros, y cómo esa relación permite obtener potencias y todas las raíces enésimas.
Lo más difícil es conservar el mismo objeto al cambiar de representación, atender al cuadrante y distinguir equivalencias de coordenadas de soluciones distintas.

## 2. Qué se pregunta en los exámenes

Se contrastó el temario oficial CEPRE-UNI 2026-2 con un solucionario oficial UNI 2019-I y un boletín atribuido a CEPREUNMSM 2023-II alojado por un tercero. Un temario acredita contenidos; un examen acredita una pregunta; el boletín informa sobre preparación. La muestra no permite determinar qué tipos son más frecuentes. La dificultad indicada es una valoración pedagógica, no una medida oficial.

| Tipo de pregunta | Universidad y evidencia | Dificultad | Frecuencia | Fuente |
|---|---|---|---|---|
| Interpretar pares polares y equivalencias con ángulos o radios distintos. | UNI: temario de CEPRE-UNI. | Básica a intermedia, según signos y vueltas. | Presencia curricular; sin frecuencia de examen. | CEPRE-UNI, 2026, S20.1 [T1]. |
| Convertir coordenadas; hallar distancia y área de triángulos. | UNI: temario de CEPRE-UNI. | Intermedia; alta al combinar cuadrantes y expresiones exactas. | No cuantificada. | CEPRE-UNI, 2026, S20.1 [T1]. |
| Identificar una cónica y convertir su ecuación polar a rectangular. | UNI, admisión ordinaria 2019-I, segunda prueba de Matemática, pregunta 40. | Alta: traducción y reconocimiento de la curva. | Un caso comprobado; no demuestra recurrencia. | UNI, 2019, solución 40, página 54 del PDF [T2]. |
| Reconocer rectas y circunferencias en polares. | UNI: temario de CEPRE-UNI. | Intermedia a alta por dominio y posible pérdida del polo. | Presencia curricular; no cuantificada. | CEPRE-UNI, 2026, S20.1 [T1]. |
| Operar con partes, conjugados y módulos; interpretar condiciones como lugares geométricos. | UNI: CEPRE-UNI; San Marcos: boletín atribuido a CEPREUNMSM, semana 5. | Básica a alta según combinación de representaciones. | No es un recuento de admisión. La copia del boletín no es distribución oficial verificada. | CEPRE-UNI, 2026 [T1]; CEPREUNMSM, 2023, copia externa [T3]. |
| Usar forma polar y exponencial, De Moivre y raíces. | UNI: complejos en Álgebra y Trigonometría de CEPRE-UNI. | Intermedia a alta por periodicidad y enumeración. | Presencia curricular; no cuantificada. | CEPRE-UNI, 2026 [T1]. |
| Patrones propios de UNA Puno, UNSA y UNSAAC. | No se confirmó una muestra original suficiente. | No asignada. | No determinada; esto no implica ausencia del tema. | Límite de la investigación. |

El alcance incluye cónicas por el temario. Se introduce la base rectangular sin depender de otra unidad; los lugares complejos se limitan a rectas y circunferencias.

## 3. Errores típicos

DOCUMENTADO significa leído en fuente original; se indica cuando solo se accedió al resumen de autor. DE SEGUNDA MANO identifica hallazgos consultados mediante otra publicación. HIPÓTESIS señala un distractor plausible sin evidencia específica encontrada. Las causas propuestas son interpretaciones, salvo indicación expresa; no prueban prevalencia en postulantes peruanos.

| Código | Qué hace el alumno | Por qué puede hacerlo | Etiqueta | Fuente |
|---|---|---|---|---|
| TRA | Traslada convenciones cartesianas a polares sin reconstruir qué miden. | Sus significados previos de ángulo y coordenada condicionan la transición. | DOCUMENTADO | Moore, Paoletti y Musgrave, 2014, resumen original institucional [T4]; dificultad general, no respuestas literales. |
| ORD | Lee radio y ángulo como desplazamientos horizontal y vertical. | Conserva el procedimiento cartesiano. | HIPÓTESIS | Diseño propio inspirado en TRA; respuesta específica no verificada. |
| UNI | Exige una pareja única por punto y considera que una vuelta adicional cambia la posición. | Confunde recorrido con ubicación. | HIPÓTESIS | Diseño propio; sin fuente específica hallada. |
| NEG | Trata un radio negativo como distancia imposible o ignora su sentido. | No separa magnitud y dirección. | HIPÓTESIS | Diseño propio; convención matemática contrastada con [T8]. |
| CUA | Usa tangente inversa sin revisar cuadrante. | El cociente pierde los signos individuales. | HIPÓTESIS | Diseño propio; sin evidencia específica consultada. |
| PAS | Suma recorridos por bordes para hallar distancia recta. | Confunde ruta con separación. | HIPÓTESIS | Diseño propio. |
| ARE | Da área negativa al invertir vértices. | Confunde orientación con superficie. | HIPÓTESIS | Diseño propio. |
| RAD | Reconoce una circunferencia por mencionar distancias desde un punto. | Supone constante una distancia no fijada. | HIPÓTESIS | Diseño propio. |
| LIN | Considera solo la distancia a la directriz. | Omite la comparación con el foco. | HIPÓTESIS | Diseño propio. |
| FIN | Reduce un lugar geométrico a uno o dos puntos. | Busca ejemplos sin considerar el conjunto. | HIPÓTESIS | Diseño propio. |
| INC | Excluye los reales de los complejos. | Exige una unidad imaginaria visible. | DE SEGUNDA MANO | Nordlander y Nordlander, 2012, según Seloane y colaboradores, 2025 [T5, T6]. |
| REP | Separa las tareas algebraicas y geométricas sin coordinarlas. | La práctica puede no exigir traducciones. | DE SEGUNDA MANO | Panaoura y colaboradores, 2006, según Seloane y colaboradores, 2025 [T5, T7]. |
| CON | Cambia el signo central al conjugar, aunque no corresponda a la parte imaginaria. | Aplica un patrón visual sin identificar partes. | DOCUMENTADO | Seloane, Ramaila y Ndlovu, 2025, resultados sobre conjugación [T5]. |
| OPU | Cambia ambas componentes al conjugar. | Confunde conjugado y opuesto. | HIPÓTESIS | Diseño propio; no se atribuye al caso CON observado. |
| IMA | Incluye i dentro del valor de la parte imaginaria. | Confunde coeficiente y término. | HIPÓTESIS | Diseño propio; definición matemática en Orloff, 2024 [T11]. |
| EXP | Suma el exponente exterior al elevar una exponencial a una potencia. | Confunde producto y potencia de potencias. | DOCUMENTADO | Seloane, Ramaila y Ndlovu, 2025, resultados [T5]. |
| CIC | Reduce incorrectamente potencias de la unidad imaginaria. | Puede ser ejecución o comprensión; no se distingue con un solo fallo. | DOCUMENTADO | Seloane, Ramaila y Ndlovu, 2025, resultados [T5]. |
| SUM | Intercambia reglas de suma y multiplicación. | Atiende al formato y no a la operación. | HIPÓTESIS | Diseño propio. |
| MOD | Conserva módulo al elevar cualquier complejo a una potencia. | Generaliza el caso de módulo uno. | HIPÓTESIS | Diseño propio. |
| RAI | Obtiene una sola raíz dividiendo un único argumento. | Omite vueltas equivalentes antes de dividir. | HIPÓTESIS | Diseño propio; regla matemática en [T9]. |
| DOS | Da dos raíces para cualquier índice. | Generaliza el caso cuadrático. | HIPÓTESIS | Diseño propio. |
| INF | Cuenta infinitas raíces distintas. | No reconoce la repetición de resultados. | HIPÓTESIS | Diseño propio. |

No se halló un estudio peruano original accesible sobre estos errores en postulantes. Los distractores requieren pilotaje: una elección también puede deberse a lectura, cálculo o interfaz.

## 4. Lo que la unidad da por sabido

Se necesitan operaciones reales con signo, fracciones, potencias enteras, raíces reales no negativas, ubicación en cuadrantes, grados y radianes, y significado y signos de seno, coseno y tangente. Se proporcionan Pitágoras e identidades de suma angular cuando se usan: se evalúa elegirlas, no recitarlas.

Para distancias y áreas hay que distinguir longitud de superficie y mantener unidades homogéneas. Las cónicas requieren perpendicularidad y ecuaciones simples; foco, directriz y excentricidad se introducen aquí. No se exige memorizar ecuaciones canónicas ni estudiar previamente cortes de conos.

La comprobación inicial pide interpretar giros, ubicar un punto a la izquierda y arriba y usar una fórmula de proyección suministrada. Los apoyos parten del objeto. La unidad imaginaria aparece en la idea 4: se anuncia entonces el paso de longitudes físicas a números sin unidad física asignada.

## 5. Las ideas, en orden

La secuencia es ubicación → medidas → curvas → complejo rectangular → potencias → raíces. Cada juego reserva un caso nuevo. Escenas propias; el equipo recalculará el banco final.

### Idea 1. Una ubicación, varias instrucciones

**Pregunta que responde:** ¿cómo puedo indicar una ubicación mediante un giro y una separación desde un punto fijo?

**Aprendizaje:** el alumno interpreta un par polar y reconoce que instrucciones diferentes pueden terminar en el mismo punto.

**Objeto de la primera pantalla.** Una mesa de taller con chincheta central, cinta que gira y ficha móvil. Primero se ve el montaje; después, las referencias. Una raya hacia la derecha fija el inicio angular. No se presenta como brújula geográfica.

**Lee.**

1. «La chincheta será el punto fijo desde el que describiremos las fichas: el polo». Se ilumina el objeto.
2. «La cinta gira desde una raya de referencia. El ángulo registra cuánto y hacia qué lado se orienta».
3. «El radio polar indica dónde colocar la ficha sobre esa dirección. La instrucción reúne radio polar y ángulo».
4. «El giro antihorario será positivo. La pantalla anuncia grados o radianes». No se anticipa el radio negativo.

**Juega.** El alumno ajusta radio y orientación de una cinta para colocar tres fichas en marcas visibles. Solo se admiten radios positivos y ángulos dentro de una vuelta, sin repetir extremos. La misión se verifica por coincidencia espacial dentro de una tolerancia anunciada y confirmación de ambas lecturas; arrastrar directamente la ficha no basta. Botones finos evitan evaluar destreza del dedo.

El cambio de signo y las vueltas adicionales permanecen bloqueados para reservar el caso de la predicción. El panel separa ángulo y radio y conserva un registro de instrucciones.

**Predice.** Se mantiene visible una ficha ya ubicada: «Si conservamos su dirección de referencia y cambiamos a negativo el radio de igual magnitud, ¿dónde terminará?» Todavía no se anima el caso.

| Opción | Respuesta ofrecida | Clave pedagógica |
|---|---|---|
| A | La instrucción no puede representar ningún punto porque una distancia no puede ser negativa. | Incorrecta: NEG confunde radio dirigido con distancia. |
| B | En el lado opuesto de la misma recta, a igual separación del polo. | Correcta: se conserva la magnitud y se invierte el sentido radial. |
| C | En otro punto del mismo rayo, porque cada pareja escrita debe tener una ubicación propia. | Incorrecta: UNI exige una ubicación exclusiva para cada pareja y no interpreta equivalencias ni sentido. |
| D | A la izquierda una cantidad dada por el radio y arriba una cantidad dada por el ángulo. | Incorrecta: ORD interpreta los datos polares como desplazamientos rectangulares. |

**Mira.** Una prolongación transparente muestra la recta completa. La ficha aparece al otro lado del polo y la cinta confirma igual separación. Después se permite una vuelta adicional: cambia el recorrido, pero se repite la posición. Se distingue longitud no negativa de instrucción dirigida.

**La regla.** El polo se representa por \(O\), leído «polo u origen». El par \((r,\theta)\), leído «radio polar y ángulo theta», indica una ubicación desde el polo respecto del eje polar fijado. \(r\) es un número real con la unidad de longitud elegida; \(\theta\) es un ángulo dirigido. Si \(r>0\), el punto está sobre el rayo señalado por el ángulo; si \(r<0\), está en el rayo opuesto, a distancia \(\lvert r\rvert\). Las barras significan valor absoluto: la magnitud sin signo. Si \(r=0\), el punto es el polo, cualquiera sea el ángulo escrito.

Una vuelta completa equivale a \(360^\circ\) o \(2\pi\) radianes; \(\pi\), leído «pi», es la constante de la circunferencia. Con \(k\) entero, que cuenta vueltas completas, representan el mismo punto:

\[
(r,\theta),\qquad (r,\theta+2k\pi),\qquad (-r,\theta+(2k+1)\pi).
\]

La igualdad de ubicación no exige parejas idénticas. Para dar una respuesta única se puede exigir radio no negativo y un ángulo en el intervalo \(0\leq\theta<2\pi\); fuera del polo, esa elección determina una pareja. En el polo no hay una dirección privilegiada: puede escribirse un ángulo por convenio, pero no atribuírselo como dirección propia. En grados se usan sus equivalentes de vuelta y media vuelta, sin mezclar sistemas.

**Así se resuelve.** Se pide normalizar una instrucción de radio negativo y ángulo fuera de la primera vuelta. Primero se identifica la distancia como valor absoluto del radio. Segundo se cambia el signo radial y se añade media vuelta. Tercero se retiran o añaden vueltas completas hasta entrar en el intervalo solicitado. Cuarto se dibujan ambas instrucciones y se comprueba el mismo punto. Normalizar solo el ángulo no cambia el signo radial.

**Palabras nuevas.**

| Palabra | Explicación de todos los días | Tres ejemplos propios |
|---|---|---|
| Polo | El punto fijo desde el que se describen las demás ubicaciones. | La chincheta de la mesa; una marca central de una plantilla; el centro elegido para un plano de patio. |
| Eje polar | La dirección que se acuerda usar como comienzo del giro. | Una raya hacia la puerta; una flecha pintada hacia la derecha; el borde de una plantilla tomado como referencia. |
| Radio polar | El dato que indica cuánto separarse y en qué sentido de la dirección elegida. | Un dato positivo sobre la cinta; uno negativo en la prolongación opuesta; cero para una ficha en la chincheta. |
| Equivalencia | Dos instrucciones que llegan al mismo resultado aunque estén escritas de manera distinta. | Añadir una vuelta; retirar dos vueltas; invertir el radio y añadir media vuelta. |

**Ahora tú.** Ubicar fichas con radios positivos; interpretar radios negativos; seleccionar pares equivalentes por signo y vueltas; finalmente decidir proposiciones bajo un intervalo angular y justificar el polo. Se proporcionan las convenciones y relaciones de equivalencia: el reto es aplicarlas, no recordarlas.

Ante ORD se separan controles; ante NEG, longitud y sentido; ante UNI, recorrido y posición.

### Idea 2. Dos maneras de medir el mismo punto

**Pregunta que responde:** ¿cómo traduzco una ubicación polar a medidas horizontales y verticales, y cómo comparo dos ubicaciones?

**Aprendizaje:** el alumno cambia de coordenadas conservando el punto, y elige distancias o áreas según lo que realmente se pide.

**Objeto de la primera pantalla.** Un patio escolar ficticio con bordes perpendiculares, estaca y caja. Primero se ve el objeto; después, una cinta polar y dos cintas paralelas a los bordes. Sus medidas son datos de diseño, no de una escuela real.

**Lee.**

1. «La misma caja puede describirse con una cinta que gira o con dos direcciones perpendiculares».
2. «x es la coordenada horizontal; y, la vertical. Sus signos indican el lado del origen».
3. «Una proyección es la sombra perpendicular sobre una dirección. La caja no cambia de lugar».
4. «La separación recta y un camino por los bordes responden a medidas distintas». Se muestran sin calcularlas.

**Juega.** El alumno desplaza la caja horizontal y verticalmente hasta cumplir una tarjeta de coordenadas y coincidir con una marca. Se comprueban ambas lecturas y la cinta polar del mismo punto. Solo se trabaja en el primer cuadrante y sobre un eje; se reserva el segundo cuadrante para predecir.

Cambiar la representación no mueve la caja; la misión exige radio y dirección correctos.

**Predice.** «Una nueva caja debe quedar a la izquierda y arriba de la estaca. Con radio positivo, ¿hacia dónde debe apuntar la cinta?» No se muestra la lectura polar ni una fórmula.

| Opción | Respuesta ofrecida | Clave pedagógica |
|---|---|---|
| A | Hacia la derecha y abajo, porque el cociente de las dos coordenadas tiene signo negativo. | Incorrecta: CUA usa el cociente sin conservar los signos individuales. |
| B | No hay dirección posible con radio positivo: toda coordenada horizontal negativa obliga a un radio negativo. | Incorrecta: NEG confunde el signo de una coordenada rectangular con una distancia radial. |
| C | Hacia la izquierda y arriba, porque deben respetarse simultáneamente ambos lados del origen. | Correcta: la dirección pertenece al segundo cuadrante. |
| D | Hacia el extremo de un camino que primero recorre todo el borde horizontal y después el vertical; esa longitud fija por sí sola la dirección. | Incorrecta: PAS sustituye posición y separación por una ruta de recorrido. |

**Mira.** Las proyecciones de la caja correcta y de otra en el cuadrante opuesto tienen cocientes iguales, pero signos distintos. Se comprueba que compartir tangente no basta. Después se comparan ruta por los bordes y separación recta: responden preguntas diferentes.

**La regla.** Con las convenciones de la idea 1, la misma ubicación satisface:

\[
x=r\cos\theta,\qquad y=r\operatorname{sen}\theta,\qquad x^2+y^2=r^2.
\]

Se lee «x es radio por coseno del ángulo; y es radio por seno del ángulo». Las relaciones valen también para radio polar negativo. Para obtener una representación de radio no negativo a partir de un punto rectangular se elige \(r=\sqrt{x^2+y^2}\). Si el punto no es el polo, se busca un ángulo cuyo coseno sea \(x/r\) y cuyo seno sea \(y/r\), en el intervalo solicitado. La fórmula \(\tan\theta=y/x\) solo puede usarse cuando \(x\neq0\), y no reemplaza la comprobación de cuadrante. Si \(x=0\), se decide sobre el eje vertical mediante el signo de \(y\). Si ambas coordenadas son cero, no existe un ángulo determinado por el punto.

Sean \(P\) y \(Q\) dos puntos, y \(D\), leído «distancia entre los puntos», su separación recta. Los subíndices identifican el punto al que pertenece cada dato, sin cambiar su significado. Entonces:

\[
D=\sqrt{(x_Q-x_P)^2+(y_Q-y_P)^2},\qquad
D^2=r_P^2+r_Q^2-2r_Pr_Q\cos(\theta_Q-\theta_P).
\]

La primera expresión aplica Pitágoras a las diferencias de coordenadas. La segunda sustituye las proyecciones y usa el coseno de una diferencia. Admite radios dirigidos coherentes, aunque inicialmente se usan positivos. Se toma la raíz no negativa. Ambas miden el mismo segmento, no una ruta por calles.

Para el triángulo formado por el polo y los puntos \(P\), \(Q\), el área \(A\) es:

\[
A=\frac12\lvert r_Pr_Q\operatorname{sen}(\theta_Q-\theta_P)\rvert.
\]

Se obtiene como mitad de base por altura perpendicular. El valor absoluto hace que el orden de los vértices no cambie el área geométrica. Si los tres puntos son colineales, el resultado es cero. Para un triángulo cualquiera de vértices \(P,Q,S\), primero pueden convertirse sus coordenadas y usar:

\[
A=\frac12\left\lvert (x_Q-x_P)(y_S-y_P)-(y_Q-y_P)(x_S-x_P)\right\rvert.
\]

La expresión mide la mitad del paralelogramo de dos lados que parten del primer vértice. Se explica con base y altura y se proporciona al resolver; no exige un vértice en el polo. Las longitudes usan una unidad común y el área su cuadrado.

**Así se resuelve.** Una caja y un poste se dan en polares y se pide una cuerda recta entre ellos. Primero se comprueba que compartan polo, referencia y unidades. Segundo se elige entre proyecciones con Pitágoras o diferencia angular. Tercero se sustituyen los datos conservando signos; puede normalizarse un radio negativo. Cuarto se toma la raíz no negativa. Quinto se comprueba que la longitud no exceda la suma de distancias al polo. Si después se pide área, debe elegirse otra relación.

**Palabras nuevas.**

| Palabra | Explicación de todos los días | Tres ejemplos propios |
|---|---|---|
| Proyección | La parte de una separación que corresponde a una dirección elegida. | La sombra sobre un borde horizontal; la medida vertical de una cuerda inclinada; la separación horizontal entre dos cajas. |
| Cuadrante | Una de las cuatro zonas que forman dos líneas perpendiculares de referencia. | Derecha y arriba; izquierda y arriba; izquierda y abajo. |
| Distancia | La longitud del segmento que separa dos puntos cuando se pide separación recta. | Entre dos estacas; de una caja al polo; entre las marcas de una plantilla. |
| Área | Cuánta superficie queda encerrada en una figura. | Un triángulo de patio; una pieza triangular de cartón; la región entre tres marcas de un plano. |

**Ahora tú.** Convertir puntos con valores trigonométricos dados; tratar ejes y cuadrantes; comparar métodos de distancia; hallar área con el polo y luego con tres vértices cualesquiera. En nivel de admisión, combinar cuadrantes, radios negativos y condiciones de distancia o área, justificando representación y unidad. Se proporcionan las relaciones y valores trigonométricos necesarios.

### Idea 3. Una condición dibuja una curva

**Pregunta que responde:** ¿cómo se reconoce qué figura forman todos los puntos que cumplen una condición polar?

**Aprendizaje:** el alumno interpreta rectas, circunferencias y cónicas como conjuntos de ubicaciones, y traduce sus ecuaciones sin perder puntos ni añadir soluciones extrañas.

**Objeto de la primera pantalla.** Un jardín escolar ficticio con estaca, cinta y regla larga. La curva se construye colocando marcas que cumplen medidas; no aparece primero como una gráfica que haya que reconocer de memoria.

**Lee.**

1. «Un borde puede describirse por una condición que cumplen todas sus marcas».
2. «El lugar geométrico reúne todas esas posiciones; comprobar una sola no describe el conjunto».
3. «Otra plantilla tiene un punto fijo, el foco, y una línea fija, la directriz. La distancia a la línea se mide perpendicularmente».
4. «Comparar distancia al foco y a la directriz permite construir curvas». No se anticipa el caso de igualdad.

**Juega.** Colocar marcas a una distancia fija de la estaca hasta completar una vuelta y rechazar una marca demasiado próxima. Se verifica la distancia, no solo la apariencia circular. La directriz permanece inactiva: todavía no se construyen cónicas con dos distancias.

Un deslizador recorre el borde para mostrar que la curva contiene más puntos que las marcas colocadas. Una moneda puede ofrecer un segundo contorno, anunciando su ampliación visual.

**Predice.** «Con una estaca fuera de una línea recta, ¿qué conjunto forman todas las posiciones a igual distancia de ambas?» Se ofrecen dibujos originales y descripciones, sin ecuaciones.

| Opción | Respuesta ofrecida | Clave pedagógica |
|---|---|---|
| A | Una circunferencia centrada en la estaca, porque siempre se mide desde un punto fijo. | Incorrecta: RAD supone constante una distancia que el enunciado no fija. |
| B | Una recta paralela a la línea, porque basta conservar la distancia a esa línea. | Incorrecta: LIN omite la distancia al foco. |
| C | Solo una o dos marcas aisladas, sin un borde que continúe. | Incorrecta: FIN confunde hallar ejemplos con describir todo el conjunto. |
| D | Una parábola: una curva abierta cuyas marcas mantienen iguales las dos separaciones. | Correcta: se cumple la condición foco-directriz con razón uno. |

**Mira.** En varias alturas, dos cintas comparan distancia al foco y distancia perpendicular a la directriz. Las marcas aceptadas dejan una parábola. Una marca circular y otra de una paralela fallan la igualdad. Se indica que la curva continúa fuera de la ventana.

**La regla.** Una ecuación polar describe todos los puntos que admiten una pareja permitida que la satisface; también importa el dominio del ángulo y del radio. Con \(R\), leído «radio geométrico de una circunferencia», positivo, \(r=R\) y una vuelta completa describen la circunferencia centrada en el polo. La condición \(\theta=\beta\), donde \(\beta\) es un ángulo fijo, describe una recta por el polo si se admiten radios de ambos signos; si solo se admite \(r\geq0\), describe una semirrecta. El dominio es parte de la respuesta.

Una recta que no pasa por el polo puede escribirse \(x\cos\beta+y\operatorname{sen}\beta=d\), donde \(d>0\) es su distancia perpendicular al polo y \(\beta\) orienta la perpendicular desde el polo hacia la recta. Sustituyendo las coordenadas:

\[
r\cos(\theta-\beta)=d.
\]

Solo se despeja \(r=d/\cos(\theta-\beta)\) para ángulos con denominador distinto de cero. Una circunferencia de centro \((x_c,y_c)\), donde el subíndice c identifica el centro, satisface:

\[
r^2-2r(x_c\cos\theta+y_c\operatorname{sen}\theta)+x_c^2+y_c^2=R^2.
\]

La relación procede de expandir \((x-x_c)^2+(y-y_c)^2=R^2\). Si el centro es \((R,0)\), se obtiene \(r^2=2Rr\cos\theta\). La forma usual \(r=2R\cos\theta\), permitiendo radios dirigidos y el dominio correspondiente, describe la misma circunferencia, incluido el polo que obtiene para ángulos con coseno cero. No se justifica simplemente «dividir por r» sin revisar el caso \(r=0\). Con restricciones adicionales del ángulo hay que verificar de nuevo si el polo sigue representado.

Para una cónica se compara la distancia al foco con la distancia a una directriz. Su razón constante positiva es la excentricidad \(\varepsilon\), leída «épsilon». En esta unidad se coloca el foco en el polo y se empieza con directriz \(x=d\), con \(d>0\), usando radio no negativo. La condición completa es:

\[
r=\varepsilon\lvert r\cos\theta-d\rvert.
\]

Cuando el punto está del lado \(x<d\), se convierte en:

\[
r=\frac{\varepsilon d}{1+\varepsilon\cos\theta},
\]

con denominador positivo para que el radio sea no negativo. Si \(0<\varepsilon<1\), la curva es una elipse; si \(\varepsilon=1\), una parábola; si \(\varepsilon>1\), una hipérbola. En esta última, la fórmula de ese lado no basta por sí sola para describir ambas ramas con radio no negativo. Para puntos del lado \(x>d\), la condición se vuelve \(r=\varepsilon d/(\varepsilon\cos\theta-1)\), en los ángulos que hagan positivo el denominador. La relación con valor absoluto permite recuperar el conjunto completo sin ocultar la otra rama.

Si la directriz se coloca a la izquierda, arriba o abajo, se vuelve a escribir su distancia perpendicular: no se cambia de memoria un signo en una fórmula. Un giro de referencia reemplaza el coseno por el coseno del ángulo relativo correspondiente. La circunferencia se trabaja con su propia condición de radio constante; no se obtiene sustituyendo sin más excentricidad cero en una construcción con directriz a distancia finita. Al elevar al cuadrado para convertir una ecuación, se comprueba que los puntos resultantes satisfagan la condición original de signos y dominio.

**Así se resuelve.** Se pide convertir una expresión polar con denominador que combina una constante y coseno. Primero se registra el dominio y el convenio radial. Segundo se elimina el denominador solo donde existe la expresión. Tercero se sustituye el producto del radio por coseno por la coordenada horizontal. Cuarto se usa la relación pitagórica para eliminar el radio, conservando la condición de signo antes de cuadrar. Quinto se completa el cuadrado si conviene. Sexto se comprueban polo, ramas y puntos prohibidos frente a la ecuación original. Clasificar la curva no basta si se alteró su conjunto.

**Palabras nuevas.**

| Palabra | Explicación de todos los días | Tres ejemplos propios |
|---|---|---|
| Lugar geométrico | Todas las posiciones que pasan una misma comprobación. | Marcas a distancia fija de una estaca; marcas sobre una dirección; marcas que igualan dos separaciones. |
| Foco | El punto fijo que interviene en la comparación usada para construir la cónica. | La estaca de la parábola; el polo de la elipse polar; el punto de referencia de una hipérbola polar. |
| Directriz | Una línea fija a la que se mide la separación por el camino perpendicular. | Una regla vertical a la derecha; una línea horizontal arriba; una línea inclinada de una plantilla girada. |
| Excentricidad | El número que compara cuánto se está del punto fijo con cuánto se está de la línea. | Razón menor que uno en una elipse; razón uno en una parábola; razón mayor que uno en una hipérbola. |

**Ahora tú.** Comprobar pertenencia; distinguir recta y semirrecta por dominio; reconocer circunferencias con centro dentro o fuera del polo; convertir ecuaciones revisando posibles divisiones por cero; clasificar cónicas por foco y directriz. Para nivel UNI, convertir entre formas, controlar signos al cuadrar y justificar dominio y ramas de una hipérbola. Las relaciones se entregan; se evalúa su elección.

### Idea 4. Un número con dos componentes

**Pregunta que responde:** ¿qué representa un complejo y cómo se opera sin separar sus partes como si fueran números independientes?

**Aprendizaje:** el alumno conecta un complejo con un punto, diferencia conjugado y opuesto, y usa su estructura rectangular para operar.

**Objeto de la primera pantalla.** Una ficha señala un motivo inventado en una plantilla de cartón sobre una mesa. Luego se añade el plano para describir traslados. No se atribuye el motivo a una tradición peruana ni se asignan centímetros a los números complejos.

**Lee.**

1. «Un complejo es un solo número con dos componentes. Los reales también son complejos».
2. «i es la unidad imaginaria: su cuadrado vale menos uno. Imaginaria es un nombre matemático, no significa falsa».
3. «z igual a x más i por y nombra el complejo. x es su parte real; y, su parte imaginaria. Ambas son reales».
4. «El punto de coordenadas x, y representa ese mismo número». No se anticipa la conjugación.

**Juega.** Ajustar dos traslados y aplicarlos consecutivamente para llegar a una marca. Se comprueban suma de componentes y punto final. Solo hay sumas, incluidas componentes cero; no se muestran reflejos, conjugados ni productos.

**Predice.** «Una ficha está a la izquierda y arriba del origen. Al reflejarla respecto de la línea horizontal, ¿qué sucede con sus componentes?» El reflejo todavía no estuvo disponible.

| Opción | Respuesta ofrecida | Clave pedagógica |
|---|---|---|
| A | Se conserva la componente horizontal y cambia el signo de la vertical. | Correcta: ese reflejo representa el conjugado. |
| B | Cambian los signos de ambas componentes. | Incorrecta: OPU confunde reflejo horizontal con opuesto. |
| C | Cambia únicamente el signo que aparece entre los dos términos, aunque el término con i se escriba primero. | Incorrecta: CON aplica una instrucción tipográfica en lugar de identificar la parte imaginaria. |
| D | La nueva coordenada vertical debe incluir la letra i como parte de su valor. | Incorrecta: IMA confunde el coeficiente real con el término imaginario completo. |

**Mira.** El reflejo conserva la proyección horizontal e invierte la vertical. Reordenar los términos del complejo no cambia el punto, pero invalida el atajo de cambiar el signo central. Se compara el reflejo con el opuesto.

**La regla.** La unidad imaginaria \(i\) satisface \(i^2=-1\). Un complejo \(z=x+iy\) tiene \(x,y\) reales. Su parte real es \(\operatorname{Re}(z)=x\) y su parte imaginaria es \(\operatorname{Im}(z)=y\), sin incluir \(i\). Dos complejos son iguales si coinciden ambas partes. Los reales corresponden a \(y=0\); los imaginarios puros no nulos tienen \(x=0\) y \(y\neq0\). El cero pertenece a los complejos y a los reales.

El conjugado se escribe \(\overline z\), leído «z conjugado», y vale \(x-iy\). Su imagen es el reflejo respecto del eje real. El opuesto es \(-z=-x-iy\). El módulo \(\rho=\lvert z\rvert=\sqrt{x^2+y^2}\), leído «rho», mide la distancia numérica al origen y nunca es negativo. Se reserva \(r\) para el radio polar dirigido y \(\rho\) para este módulo; un radio polar negativo no es un módulo negativo.

Con subíndices que identifican los operandos:

\[
z_1\pm z_2=(x_1\pm x_2)+i(y_1\pm y_2),
\]
\[
z_1z_2=(x_1x_2-y_1y_2)+i(x_1y_2+y_1x_2).
\]

La segunda relación se obtiene distribuyendo y reemplazando \(i^2\) por \(-1\); no es una regla ajena al álgebra conocida. Como \(z\overline z=x^2+y^2=\rho^2\), para \(z_2\neq0\) se puede dividir multiplicando numerador y denominador por su conjugado:

\[
\frac{z_1}{z_2}=\frac{z_1\overline{z_2}}{x_2^2+y_2^2}
=\frac{x_1x_2+y_1y_2}{x_2^2+y_2^2}
+i\frac{y_1x_2-x_1y_2}{x_2^2+y_2^2}.
\]

Las potencias de \(i\) repiten el ciclo \(1,i,-1,-i\), empezando en exponente cero. Para exponentes enteros no negativos, dividir el exponente entre cuatro y usar su resto sirve porque \(i^4=1\), no por un truco independiente. Si hay exponentes negativos, primero se aplica la definición de inverso. El módulo de una suma no es en general la suma de módulos: las direcciones de sus componentes importan. La representación rectangular suele ser conveniente para sumas, diferencias y comparaciones de partes.

**Así se resuelve.** Dividir dos complejos escritos con términos en distinto orden. Identificar sus partes; comprobar denominador no nulo; conjugarlo por componentes; multiplicar arriba y abajo distribuyendo y reduciendo la potencia de la unidad imaginaria; separar las partes del resultado. Como comprobación, multiplicar por el denominador original debe recuperar el numerador.

**Palabras nuevas.**

| Palabra | Explicación de todos los días | Tres ejemplos propios |
|---|---|---|
| Complejo | Un número que puede describirse con una componente real y otra imaginaria. | Un real escrito con componente imaginaria cero; un imaginario puro; un número con ambas componentes distintas de cero. |
| Conjugado | El número que aparece al reflejar el punto respecto de la línea horizontal. | Reflejar una marca de arriba hacia abajo; dejar fija una marca real; cambiar el sentido vertical de un imaginario puro. |
| Módulo | Qué tan lejos queda el número del origen en el plano. | Cero en el origen; igual módulo para conjugados; igual módulo para puntos de una circunferencia centrada en el origen. |

**Ahora tú.** Identificar partes y reales como complejos; sumar y restar; distinguir conjugado y opuesto; calcular módulos, productos y cocientes. En admisión, resolver condiciones sobre partes o conjugados y traducir módulos a distancias para reconocer rectas o circunferencias de la idea 3. Se suministran relaciones; aún no se requieren argumentos.

### Idea 5. Multiplicar escala y gira

**Pregunta que responde:** ¿por qué la forma polar simplifica productos, cocientes y potencias de complejos?

**Aprendizaje:** el alumno interpreta la multiplicación como combinación de escala y giro, y justifica De Moivre antes de usarlo.

**Objeto de la primera pantalla.** Una marca en una plantilla circular sobre una mesa se reproduce girada y ampliada. Primero se reconoce el objeto; después se asocia el complejo. Original y copia permanecen visibles para distinguir orientación y escala.

**Lee.**

1. «La ubicación de una marca también puede describirse con su distancia al centro y su orientación. Para un complejo no nulo, esa orientación se llama argumento».
2. «El módulo es una distancia no negativa. El argumento registra una dirección y puede escribirse con vueltas adicionales, como en las coordenadas polares».
3. «La misma marca puede trasladarse, reflejarse, girarse o ampliarse. Son acciones distintas; el símbolo de la operación indica cuál se está estudiando».
4. «Compararemos una transformación aplicada una vez con su repetición». No se adelanta cómo se combinan módulos ni argumentos.

**Juega.** Ajustar una ampliación y un giro para hacer coincidir una copia con una marca objetivo. Se verifica la coincidencia y la identificación del control de tamaño y del de orientación. Entrada y salida tienen escritura rectangular; la acción se presenta como multiplicación por un factor complejo. Solo se permite una aplicación, sin encadenamientos ni potencias.

**Predice.** «Una transformación duplica la distancia al centro y gira un tercio de vuelta antihoraria. Si se aplica tres veces, ¿cómo queda la marca respecto del inicio?» La distancia inicial no es cero; no se anima la repetición ni se ofrece fórmula.

| Opción | Respuesta ofrecida | Clave pedagógica |
|---|---|---|
| A | A seis veces la distancia inicial y con la orientación inicial. | Incorrecta: SUM suma los factores de escala en lugar de componerlos. |
| B | A ocho veces la distancia inicial y con la orientación inicial. | Correcta: tres duplicaciones y tres tercios de vuelta. |
| C | A ocho veces la distancia inicial, pero en la dirección opuesta, porque tener la misma tangente permite intercambiar esas direcciones. | Incorrecta: CUA ignora el cuadrante al interpretar una orientación. |
| D | A la misma distancia inicial y con la orientación inicial. | Incorrecta: MOD generaliza conservación del módulo a una transformación que amplía. |

**Mira.** Cada duplicación actúa sobre la copia anterior. Tres giros completan una vuelta: regresa la dirección, no el punto inicial. Después se cambia la escala a uno para contrastar cuándo se conserva el módulo.

**La regla.** Para \(z\neq0\), su módulo \(\rho>0\) y un argumento \(\theta\) permiten escribir:

\[
z=\rho(\cos\theta+i\operatorname{sen}\theta),\qquad
x=\rho\cos\theta,\quad y=\rho\operatorname{sen}\theta.
\]

Todos sus argumentos difieren en vueltas completas: \(\theta+2k\pi\), con \(k\) entero. Para esta unidad, el argumento principal \(\operatorname{Arg}(z)\) se elige en \([0,2\pi)\). Hay libros que usan \((-\pi,\pi]\); ambos convenios son válidos si se anuncian. El cero tiene módulo cero y no tiene argumento definido. No se asigna dirección cero al número cero como si fuera una propiedad matemática.

Al distribuir el producto de dos formas trigonométricas y usar las identidades de suma angular se obtiene:

\[
z_1z_2=\rho_1\rho_2[\cos(\theta_1+\theta_2)+i\operatorname{sen}(\theta_1+\theta_2)].
\]

Se multiplican módulos y se suman argumentos. Para un divisor no nulo se dividen módulos y se restan argumentos. Si el numerador es cero, el cociente es cero y no se le atribuye argumento. Conjugación conserva módulo y cambia el argumento a su opuesto, ajustándolo después al intervalo principal. La suma continúa resolviéndose por componentes; las reglas de producto no se trasladan a ella.

La constante de Euler \(e\) permite escribir \(e^{i\theta}=\cos\theta+i\operatorname{sen}\theta\), con el ángulo en radianes, y así \(z=\rho e^{i\theta}\). La compatibilidad con giros se verifica mediante \(e^{i\theta_1}e^{i\theta_2}=e^{i(\theta_1+\theta_2)}\), usando el producto anterior. No se exige demostrar Euler con cálculo o series. Un ángulo en grados debe convertirse antes de entrar en el exponente.

La fórmula de De Moivre es:

\[
z^n=\rho^n[\cos(n\theta)+i\operatorname{sen}(n\theta)]
=\rho^n e^{in\theta}.
\]

Aquí \(n\) es un exponente entero. Para \(n>0\) resulta de repetir el producto; para \(n<0\) requiere \(z\neq0\) y procede del inverso; para \(n=0\) se usa \(z^0=1\) con \(z\neq0\). No se asigna un valor a \(0^0\). Si \(z=0\) y \(n>0\), la potencia es cero y se resuelve por separado, sin inventar un argumento. En la expresión exponencial, elevar a una potencia multiplica el exponente: no le añade el entero exterior.

**Así se resuelve.** Para una potencia entera de un complejo rectangular: decidir si conviene forma polar; hallar módulo y argumento comprobando cuadrante; elevar el módulo y multiplicar el ángulo; reducir vueltas y convertir al formato solicitado. Verificar magnitud y dirección. Para exponentes pequeños se contrasta con producto rectangular; para negativos se comprueba el inverso.

**Palabras nuevas.**

| Palabra | Explicación de todos los días | Tres ejemplos propios |
|---|---|---|
| Argumento | Un ángulo que señala hacia dónde queda un número no nulo desde el origen. | Una dirección hacia arriba; la misma dirección después de una vuelta; una dirección del tercer cuadrante. |
| Escala | El factor que amplía o reduce las separaciones al centro. | Duplicar una plantilla; reducirla a la mitad; conservarla con factor uno. |
| Forma exponencial | Una escritura compacta que reúne módulo y giro usando una exponencial compleja. | Un giro sin ampliación; una ampliación con giro; una potencia escrita con el ángulo multiplicado. |

**Ahora tú.** Convertir formas; reconocer argumentos equivalentes; elegir el principal; pasar grados a radianes para exponenciales; multiplicar, dividir y resolver potencias positivas o negativas. En admisión, combinar productos, potencias y cocientes y decidir cuándo el resultado es real o imaginario puro. Se entregan identidades; una suma exige su propia regla.

### Idea 6. Encontrar todas las raíces

**Pregunta que responde:** ¿cómo se encuentran todas las posiciones que producen un mismo complejo al elevarlas a una potencia?

**Aprendizaje:** el alumno invierte una potencia considerando todas las vueltas relevantes, cuenta raíces distintas y comprueba cada resultado.

**Objeto de la primera pantalla.** Una tapa con plantilla giratoria y referencia. El plano se superpone después; no hay marcas que revelen cuántas raíces habrá.

**Lee.**

1. «Elevar un complejo a una potencia combina repetidamente su escala y su giro, como acabamos de comprobar».
2. «Ahora conocemos el resultado final y buscamos qué número pudo producirlo. Ese número se llama raíz de la potencia indicada».
3. «El índice de la raíz señala la potencia que debe recuperar el resultado. Encontrar una candidata no demuestra que ya se hayan encontrado todas».
4. «Dos instrucciones con vueltas diferentes pueden señalar el mismo punto. Al contar soluciones se contarán números distintos, no escrituras distintas». No se adelanta la cantidad de raíces para un índice dado.

**Juega.** Ajustar escala y giro para que, al elevar al cuadrado, una candidata llegue a un objetivo no nulo. El sector permitido, anunciado explícitamente, contiene una sola solución. Se verifica aplicando la potencia; no se afirma que sea la única solución del plano completo.

**Predice.** Se desbloquea el plano completo: «¿Cuántos complejos distintos producen un complejo no nulo dado al elevarlos al cubo?» Es un índice nuevo; no hay marcas previas ni fórmula de raíces.

| Opción | Respuesta ofrecida | Clave pedagógica |
|---|---|---|
| A | Uno: basta dividir entre tres el argumento elegido al inicio. | Incorrecta: RAI omite las vueltas equivalentes antes de dividir. |
| B | Dos: siempre existe una solución positiva y otra negativa. | Incorrecta: DOS extiende el caso cuadrático a cualquier índice. |
| C | Infinitos: cada vuelta adicional del argumento produce un número diferente. | Incorrecta: INF no reconoce la repetición de resultados. |
| D | Tres números distintos, separados regularmente alrededor del origen. | Correcta: las tres raíces cúbicas de un complejo no nulo son distintas y equiespaciadas. |

**Mira.** Se buscan tres candidatas y cada una llega al objetivo al elevarse al cubo. Una cuarta instrucción angular coincide con una ya registrada: no aumenta el contador. Se separan las escalas de raíces y resultado para no situarlos forzosamente en una misma circunferencia.

**La regla.** Sea \(w\) el complejo dado, escrito para \(w\neq0\) como \(w=\rho_w(\cos\theta_w+i\operatorname{sen}\theta_w)\). El subíndice w indica módulo y argumento del número dado. Se buscan los complejos \(z\) que cumplen \(z^n=w\), donde ahora \(n\) es un entero positivo, el índice de la raíz. La potencia que se invierte y el índice representan el mismo número de repeticiones.

Por la idea 5, el módulo de una raíz elevado a \(n\) debe ser \(\rho_w\). Su módulo es, por tanto, la raíz real no negativa \(\sqrt[n]{\rho_w}\). Su ángulo multiplicado por \(n\) debe coincidir con un argumento del resultado, incluidas sus vueltas completas. De ahí se obtiene:

\[
z_k=\sqrt[n]{\rho_w}\left[\cos\left(\frac{\theta_w+2k\pi}{n}\right)
+i\operatorname{sen}\left(\frac{\theta_w+2k\pi}{n}\right)\right],
\qquad k=0,1,\ldots,n-1.
\]

Hay exactamente \(n\) raíces distintas cuando \(w\neq0\). Índices separados por \(n\) repiten una raíz porque sus ángulos difieren en una vuelta completa. Dos índices dentro de la lista indicada no la repiten: su diferencia angular es una fracción no nula de una vuelta, menor que una vuelta en magnitud. Las raíces están sobre una circunferencia de radio \(\sqrt[n]{\rho_w}\), con separación angular \(2\pi/n\). Para \(n\geq3\) forman los vértices de un polígono regular; para \(n=2\), dos puntos opuestos; para \(n=1\), solo el número dado.

Si \(w=0\), la única raíz distinta es cero, aunque la ecuación polinómica tenga multiplicidad \(n\). Se trata por separado porque cero no tiene argumento. Una raíz principal, si un texto la solicita, es una elección entre las raíces con una convención especificada; no sustituye al conjunto de soluciones de la ecuación. Para evitar ambigüedad, esta unidad pide «todas las soluciones de la ecuación» y reserva el radical de \(\rho_w\) para una raíz real no negativa. Cambiar el argumento inicial de \(w\) por uno equivalente cambia el orden de la lista, no su conjunto de raíces.

**Así se resuelve.** Para una potencia igual a un complejo no nulo: hallar módulo y argumento del resultado; escribir las condiciones radial y angular con vueltas completas; enumerar índices de cero a uno menos que el índice de raíz; comprobar módulo común y separación regular; elevar cada candidata y recuperar el resultado. Finalmente justificar por qué el siguiente índice repite la primera. No basta presentar una lista sin verificar su completitud.

**Palabras nuevas.**

| Palabra | Explicación de todos los días | Tres ejemplos propios |
|---|---|---|
| Raíz | Un número que, al aplicar la potencia indicada, recupera el resultado buscado. | Una candidata que recupera el resultado al cuadrado; otra que lo recupera al cubo; cero como raíz de una potencia igual a cero. |
| Índice | El número de repeticiones de la potencia que se quiere invertir. | Dos para raíz cuadrada; tres para raíz cúbica; un entero mayor para una raíz enésima. |
| Equiespaciadas | Posiciones separadas por el mismo giro entre vecinas. | Tres marcas a tercios de vuelta; cuatro a cuartos de vuelta; cinco a quintos de vuelta. |
| Multiplicidad | Cuántas veces aparece una solución en la factorización, aunque sea un solo punto. | Cero repetido en una potencia cuadrada; cero repetido en una potencia cúbica; una raíz simple de una potencia igual a un número no nulo. |

**Ahora tú.** Verificar candidatas; obtener todas las raíces cuadradas y cúbicas; detectar repeticiones; ampliar a índices mayores con valores trigonométricos dados. En admisión, seleccionar raíces que cumplan una condición adicional de cuadrante o parte real, después de obtener el conjunto. Incluir resultado cero y argumentos iniciales equivalentes: deben conservarse las excepciones y la independencia del formato.

## 6. Tabla de letras y símbolos de la unidad

Los símbolos se explican al aparecer. Los subíndices identifican datos del mismo tipo. La geometría física usa longitudes; el plano complejo usa números sin unidad física asignada.

| Letra o símbolo | Significado | Unidad o condición |
|---|---|---|
| \(O\) | Polo u origen. | Punto. |
| \(P,Q,S\) | Puntos identificados. | Sin unidad; S no representa área. |
| \(r\) | Radio polar dirigido. | Longitud; admite signo negativo. |
| \(R\) | Radio de circunferencia. | Longitud positiva. |
| \(x,y\) | Coordenadas rectangulares; partes real e imaginaria del complejo correspondiente. | Longitudes físicas o números en el plano complejo. |
| \(x_c,y_c\) | Coordenadas del centro. | Misma unidad que los puntos. |
| \(\theta\) | Ángulo de ubicación; argumento en complejos. | Grados o radianes; exponenciales en radianes. |
| \(\beta\) | Ángulo fijo de referencia de una recta. | Unidad angular anunciada. |
| \(k\) | Entero que enumera vueltas y sus representantes al extraer raíces. | Sin unidad; rango indicado. |
| \(D\) | Distancia entre puntos. | Longitud no negativa. |
| \(A\) | Área de triángulo. | Longitud al cuadrado; no es punto. |
| \(d\) | Distancia perpendicular del polo a una recta, incluida una directriz. | Longitud positiva. |
| \(\varepsilon\) | Excentricidad. | Razón positiva sin unidad. |
| \(i\) | Unidad imaginaria. | Su cuadrado vale menos uno; no es índice. |
| \(z,w\) | Complejos; w identifica el resultado dado al extraer raíces. | Sin unidad física asignada. |
| \(\rho\) | Módulo del complejo. | Real no negativo. |
| \(\operatorname{Re},\operatorname{Im}\) | Parte real y parte imaginaria. | Devuelven reales. |
| \(\overline z\) | Conjugado. | La barra no indica promedio. |
| \(\lvert\cdot\rvert\) | Valor absoluto o módulo, según el objeto. | Magnitud no negativa. |
| \(\operatorname{Arg}\) | Argumento principal. | Intervalo declarado de una vuelta. |
| \(e\) | Constante de Euler. | Sin unidad; no excentricidad. |
| \(n\) | Entero de repeticiones de una potencia; índice al invertirla. | Positivo para raíces enésimas. |
| \(\pi,\operatorname{sen},\cos,\tan\) | Pi, seno, coseno y tangente. | Unidad angular consistente. |
| \(\sqrt[n]{\rho_w}\) | Raíz real no negativa del módulo dado. | No es el conjunto de raíces complejas. |

**Choques.** Se reserva rho para módulo, aunque otros textos usen r; épsilon evita confundir excentricidad con Euler. La j de ingeniería equivale a nuestra i. Sin en inglés corresponde a sen. Todo cambio de intervalo de argumento debe anunciarse.

## 7. Otras formas de explicarla

| Representación | Idea y uso | Fuente o fundamento | Riesgo y límite |
|---|---|---|---|
| Cinta giratoria prolongable. | 1–2: separar orientación, sentido y proyecciones. | Diseño propio; convenciones en OpenStax [T8]. | La cinta no tiene longitud negativa: el signo indica sentido radial. |
| Dos paneles con una sola ficha. | 2 y 4: traducir escritura conservando posición. | Dificultades de coordinación en [T4, T7]. | Deben actualizarse juntos para no parecer dos objetos independientes. |
| Estaca y regla. | 3: construir cónicas mediante dos distancias. | Condición foco-directriz en [T10]. | La separación a la directriz es perpendicular, no oblicua. |
| Moneda vista desde arriba. | 3: circunferencia con polo desplazado. | Diámetro documentado [T12]. | Separar contorno ideal de grabado y tamaño real de ampliación. |
| Reflejo plano de una ficha. | 4: distinguir conjugado y opuesto. | Error observado en [T5]. | Un espejo tridimensional distrae: conservar proyecciones planas. |
| Plantilla girada y ampliada. | 5: composición antes de De Moivre. | Relaciones contrastadas en [T9, T11]. | No mostrar únicamente módulo uno ni sugerir que los módulos se suman. |
| Marcas sobre una tapa. | 6: contar raíces y verificar con potencias. | Regla de raíces en [T9]; escena propia. | Un polígono dibujado antes de predecir revelaría la cantidad. |
| Vista algebraica y geométrica enlazadas. | 4–6: explorar y comprobar. | Intervención con GeoGebra en [T5]. | Sus resultados no prueban eficacia de esta app ni reemplazan restricciones algebraicas. |

Usar vistas superiores, controles grandes, pausa, repetición y texto equivalente; las marcas no deben depender solo del color.

## 8. Datos del mundo

| Dato comprobado | Fuente | Uso y límite |
|---|---|---|
| Moneda peruana de un sol alusiva a José de la Mar y Cortázar, emitida en septiembre de 2023: diámetro 25,50 mm. | BCRP, Circular 0017-2023-BCRP [T12]. | Circunferencia y polo desplazado. El radio se obtiene dividiendo el diámetro entre dos; lo recalcula el equipo. No generalizar a todas las monedas. |
| Antena principal de Jicamarca: 18 432 dipolos, arreglo de 290 m por 290 m. | IGP, página técnica «Antenas», sin fecha visible [T13]. | Contexto para coordenadas. Las marcas añadidas son didácticas, no ubicaciones medidas de dipolos. |
| Una nota de difusión del IGP indica 300 m por 300 m. | IGP, fecha no confirmada [T14]. | Se registra la discrepancia; los ejercicios adoptan explícitamente el dato técnico de 290 m por 290 m, sin prometer precisión topográfica. |

Patios, tapas y jardines son modelos originales con medidas plausibles, rotulados como datos construidos. Latitud y longitud no se presentan como coordenadas polares planas. Jicamarca aporta un contexto de ubicación: no se afirma que su radar funcione como la cinta giratoria del juego.

## 9. Dudas y decisiones

**Evidencia pendiente.** El temario CEPRE-UNI y el caso oficial UNI se verificaron; faltan series de exámenes originales para estimar frecuencia y caracterizar las otras universidades. El boletín de San Marcos sigue identificado como copia externa. No hallar un ítem no demuestra que el contenido no se evalúe.

**Investigación.** Se leyó el artículo completo de Seloane y colaboradores, el resumen original de Moore y colaboradores y la revisión secundaria de Nordlander y Panaoura. Se mantienen esas diferencias de acceso y los límites de población. Las respuestas específicas propuestas requieren pilotaje y no autorizan diagnosticar concepciones por una sola elección.

**Convenciones.** Radio dirigido y módulo no negativo se distinguen con letras distintas. El argumento principal se toma en una vuelta desde cero; la exponencial usa radianes. Las cónicas parten de la distancia absoluta para no perder una rama de hipérbola. Se excluyen logaritmos complejos, integrales polares, derivadas y ecuaciones eléctricas: no son necesarios para los ejercicios descritos.

**Decisiones del dueño.** Definir sesiones para la idea 3, práctica adicional UNI de cónicas y posibilidad de cambiar el intervalo principal. La base ya tiene seis ideas y una convención utilizable. El equipo recalcula el banco final.

**Control realizado.** Las ideas 1–3 no usan complejos; la 4 no usa argumentos; la 5 construye potencias antes de invertirlas en la 6. Las predicciones reservan un caso nuevo y sus tres distractores tienen códigos existentes. En prototipo debe verificarse que ayudas o controles no revelen esos casos antes de responder.

## 10. Fuentes

- **[T1]** Centro de Estudios Preuniversitarios de la Universidad Nacional de Ingeniería, **2026**. *Guía del estudiante: ciclo preuniversitario 2026-2*. Álgebra y semana 20 de Trigonometría. [PDF oficial](https://www.cepre.uni.edu.pe/assets/archivos/comunicados/PREUNIVERSITARIO-GUIADELESTUDIANTE-2026-2.pdf).
- **[T2]** Universidad Nacional de Ingeniería, **2019**. *Solucionario del examen de admisión 2019-I*. Fuente oficial, Matemática, solución 40, página 54. Se usa el tipo de pregunta, no se copian problemas ni erratas. [PDF oficial](https://admision.uni.edu.pe/wp-content/uploads/2022/11/solucionario2019.pdf).
- **[T3]** Centro Preuniversitario de la Universidad Nacional Mayor de San Marcos, autoría atribuida en el documento, **2023**. *Ciclo 2023-II, semana 5: boletín de ejercicios*. Álgebra. Copia externa no autenticada institucionalmente. [Copia consultada](https://pdfpresanmarcos.com/wp-content/uploads/2024/02/Boletin-Semana-5-Pre-San-Marcos-2023-II-UNMSM-PDF-1.pdf).
- **[T4]** Moore, Kevin C.; Paoletti, Teo; Musgrave, Stacy, **2014**. *Complexities in students’ construction of the polar coordinate system*. The Journal of Mathematical Behavior, 36, 135–149. DOI: 10.1016/j.jmathb.2014.10.001. Resumen original consultado; sin texto completo accesible. [Registro y resumen institucional](https://digitalcommons.montclair.edu/mathsci-facpubs/57/).
- **[T5]** Seloane, Majane P.; Ramaila, Sam; Ndlovu, Mdutshekelwa, **2025**. *Harnessing GeoGebra as a modelling tool to mitigate undergraduate engineering mathematics students’ misconceptions and errors associated with complex numbers*. Pythagoras, 46(1), a825. DOI: 10.4102/pythagoras.v46i1.825. Original completo; resultados y revisión diferenciados. [Artículo en SciELO](https://scielo.org.za/scielo.php?lng=en&nrm=iso&pid=S2223-78952025000100005&script=sci_arttext&tlng=en).
- **[T6]** Nordlander, Maria Cortas; Nordlander, Edvard, **2012**. *On the concept image of complex numbers*. International Journal of Mathematical Education in Science and Technology, 43(5), 627–641. DOI: 10.1080/0020739X.2011.633629. Edición 2012, anticipada 2011; hallazgo consultado mediante [T5]. [Registro editorial](https://www.tandfonline.com/doi/full/10.1080/0020739X.2011.633629).
- **[T7]** Panaoura, Areti; Elia, Iliada; Gagatsis, Athanasios; Giatilis, George-Panagiotis, **2006**. *Geometric and algebraic approaches in the concept of complex numbers*. International Journal of Mathematical Education in Science and Technology, 37(6), 681–706. DOI: 10.1080/00207390600712281. Consultado mediante [T5]. [Registro editorial](https://www.tandfonline.com/doi/full/10.1080/00207390600712281).
- **[T8]** Abramson, Jay, y colaboradores; OpenStax, **2021**. *Precalculus 2e*, sección 8.3, «Polar Coordinates». Texto educativo original abierto; contraste de convenciones y conversiones. [Capítulo](https://openstax.org/books/precalculus-2e/pages/8-3-polar-coordinates).
- **[T9]** Abramson, Jay, y colaboradores; OpenStax, **2021**. *Precalculus 2e*, sección 8.5, «Polar Form of Complex Numbers». Contraste de productos, De Moivre y raíces.  [Capítulo](https://openstax.org/books/precalculus-2e/pages/8-5-polar-form-of-complex-numbers).
- **[T10]** Abramson, Jay, y colaboradores; OpenStax, **2021**. *Precalculus 2e*, sección 10.5, «Conic Sections in Polar Coordinates». Contraste de foco, directriz y excentricidad. [Capítulo](https://openstax.org/books/precalculus-2e/pages/10-5-conic-sections-in-polar-coordinates).
- **[T11]** Orloff, Jeremy; Massachusetts Institute of Technology, **2024**. *ES.1803 Differential Equations: Class 06, Complex Numbers*. Notas del 12 de febrero: partes de un complejo y Euler. [PDF en MIT OpenCourseWare](https://ocw.mit.edu/courses/es-1803-differential-equations-spring-2024/mites_1803_s24_day6-notes.pdf).
- **[T12]** Banco Central de Reserva del Perú, **2023**. *Circular 0017-2023-BCRP: puesta en circulación de la moneda alusiva a José de la Mar y Cortázar*. Publicada el 19 de septiembre de 2023. [Publicación oficial en El Peruano](https://busquedas.elperuano.pe/dispositivo/NL/2216320-1).
- **[T13]** Instituto Geofísico del Perú, Radio Observatorio de Jicamarca, **sin fecha visible**. *Antenas*. Página técnica oficial; consultada el 21 de noviembre de 2026. [Página técnica](https://www.igp.gob.pe/observatorios/radio-observatorio-jicamarca/?page_id=43).
- **[T14]** Instituto Geofísico del Perú, **fecha no confirmada en esta consulta**. *IGP potenciará su radar más grande del mundo para lograr nuevos hallazgos en la alta atmósfera*. Texto institucional indexado; discrepancia dimensional con [T13]. [Nota oficial](https://www.gob.pe/institucion/igp/noticias/521397-igp-potenciara-su-radar-mas-grande-del-mundo-para-lograr-nuevos-hallazgos-en-la-alta-atmosfera).

