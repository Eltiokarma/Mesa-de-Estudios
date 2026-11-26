# Propuesta de ideas: Movimiento armónico simple

26 de noviembre de 2026. Unidad: **fisica.oscilaciones**. Archivo previsto: contenido/teoria/fisica/oscilaciones.js. Etapa 11.

Esta es una propuesta de contenido y de implementación. No declara terminadas la unidad, las pruebas, las capturas ni la auditoría. Los números de las misiones y predicciones son casos de diseño que deberán convertirse en cálculos determinísticos y contrastarse de forma independiente.

## 0. Diagnóstico y alcance

La unidad publicada contiene cinco ideas: aceleracion-al-centro, graficas-mas, periodo-resorte, pendulo y energia-mas. Se conservarán esos identificadores y se añadirá ciclo-y-amplitud al comienzo. Los títulos actuales adelantan conclusiones, como «El período no depende de A»; se sustituirán por títulos neutrales. Ninguna de las cinco ideas trae todavía sus quince ejemplos.

La ficha del catálogo abarca movimiento periódico y oscilatorio, ecuaciones y gráficas del MAS, resorte horizontal y vertical, péndulo simple y energía. Esos temas se conservarán. Los dos resortes en serie y en paralelo serán una extensión acotada de la idea 4, no una séptima idea.

Se usa como modelo de tono Trabajo, energía y potencia, con calidad 2. De su auditoría se toman especialmente las correcciones sobre constantes omitidas, números ocultamente redondeados, cancelaciones sin explicar, rótulos cruzados por líneas y controles que no coincidían con el dibujo. Se conserva su nomenclatura energética: energía cinética, potencial elástica y mecánica, con E y los subíndices C, PE y M. No se copiarán sus cadenas antiguas de fórmulas ni sus colores sin revisar el contexto de esta unidad.

**Instrucción actual que prevalece:** los recuadros Datos no darán fórmulas, despejes, atajos ni relaciones que resuelvan lo pedido. Contendrán entradas, unidades, condiciones, equivalencias necesarias y, cuando corresponda, valores trigonométricos. Las relaciones se desarrollarán en Mira y La regla, y se aplicarán en los pasos de resolución. Esta decisión sustituye la práctica de los documentos antiguos que sugerían poner fórmulas en Datos; no se presenta como un conflicto pendiente.

El alcance físico será:

- MAS rectilíneo ideal: fuerza neta lineal que devuelve el cuerpo al equilibrio, sin rozamiento ni fuerza motriz posterior.
- Ecuaciones temporales y gráficas mediante la proyección del movimiento circular, sin exigir derivadas.
- Resorte horizontal y vertical, distinguiendo en el vertical longitud natural, equilibrio y desplazamiento respecto del equilibrio.
- Dos resortes ideales en serie o en paralelo, sin redes mixtas, poleas ni masa efectiva del resorte.
- Péndulo simple con amplitudes angulares de 5° a 10°, bajo la aproximación de ángulo pequeño.
- Energía del oscilador únicamente en un resorte horizontal. No se mezclará la energía elástica desde la longitud natural con el desplazamiento desde el equilibrio vertical.
- Amortiguamiento solo como contraste verbal del modelo ideal. Resonancia, péndulo físico y péndulo cónico quedan fuera.

No se ha identificado un conflicto crítico con una decisión escrita. La decisión de la etapa 4 sobre componentes con signo en una recta y la notación energética de la etapa 8 siguen siendo aplicables; la paleta y la regla actual de Datos se declaran expresamente para esta unidad.

## 1. Ideas en orden

Los títulos identifican el asunto; las frases de aprendizaje expresan lo que el alumno podrá hacer. No se usarán como títulos las respuestas reservadas de Predice.

| Orden e identificador | Título propuesto | Frase de aprendizaje | Alcance y enlace |
| --- | --- | --- | --- |
| 1. ciclo-y-amplitud | Un movimiento que se repite | Identificas una oscilación completa y distingues posición, amplitud, distancia entre extremos, período y frecuencia. | Antes de contar, se fija el eje, el equilibrio y el estado de partida. Volver a una posición interior con sentido contrario no completa el ciclo. |
| 2. aceleracion-al-centro | El empuje del resorte | Relacionas el desplazamiento con la fuerza neta y la aceleración, conservando sus signos. | Parte de Hooke y la segunda ley ya estudiados. Distingue aceleración de velocidad; todavía no introduce frecuencia angular. |
| 3. graficas-mas | Del movimiento a la gráfica | Ubicas el cuerpo y su sentido de movimiento a partir del instante y del estado inicial. | Construye posición, velocidad y aceleración desde una secuencia de cuartos de ciclo y después desde la fase. |
| 4. periodo-resorte | El ritmo del bloque y el resorte | Comparas períodos cuando cambian masa, rigidez o conexión de los resortes. | Resorte horizontal, equilibrio vertical y dos resortes ideales. La amplitud queda dentro del régimen lineal. |
| 5. pendulo | El vaivén de una pesa colgada | Seleccionas la longitud y las condiciones necesarias para estimar el período de un péndulo simple. | Longitud hasta el centro de masa, inclinación pequeña, masa despreciable del hilo y soporte fijo. |
| 6. energia-mas | Energía durante el vaivén | Calculas cómo se reparte la energía y distingues rapidez de velocidad con signo. | Recupera Trabajo y energía en un oscilador horizontal; la energía no decide por sí sola el sentido del movimiento. |

El glosario se revisará contra el del curso antes de asignar términos. Se prevén apoyos breves sobre oscilación, amplitud y posición de equilibrio en la primera idea; fuerza restauradora y MAS en la segunda; fase y fase inicial en la tercera; resorte ideal, conexión en serie y conexión en paralelo en la cuarta; péndulo simple y aproximación de ángulo pequeño en la quinta; oscilación libre y punto de retorno en la sexta. Período, frecuencia, constante elástica y energías que ya tengan entrada útil se heredarán. No se inventarán definiciones incompatibles para duplicar términos.

## 2. Primera pantalla y objetos

| Idea | Objeto que aparece primero | Qué hace visible | Qué se reserva |
| --- | --- | --- | --- |
| 1 | Un carrito unido a un resorte horizontal, con el equilibrio y los dos extremos señalados. | El carro puede estar a ambos lados del mismo origen; la amplitud se mide desde ese origen, no de extremo a extremo. | La cuenta de ocho ciclos en cuatro segundos y su período. |
| 2 | El mismo tipo de carrito, separado a la derecha del equilibrio, justo después de soltarlo. | Masa y rigidez rotuladas; eje positivo a la derecha y fuerza del resorte sobre el carro. | El cambio simultáneo de lado y de módulo de la aceleración del caso de Predice. |
| 3 | Cuatro posiciones sucesivas del carrito, separadas por tiempos iguales, junto a una gráfica posición-tiempo. | El orden temporal y el sentido de cruce; el juego empieza en el extremo derecho. | La secuencia que parte del extremo izquierdo en otro sistema. |
| 4 | Un bloque guiado sobre una mesa, unido a un resorte, con masa y rigidez identificadas. | Se cambia la rigidez y se observa el tiempo de una oscilación. | El efecto de cuadruplicar la masa; las conexiones de dos resortes aparecen después. |
| 5 | Una esfera colgada de un hilo, con el apoyo, el centro de la esfera, la vertical y una inclinación pequeña. | La longitud corresponde al hilo hasta el centro de masa, no a la altura de la esfera respecto del piso. | La comparación simultánea de longitud y masa. |
| 6 | El carro horizontal con una barra de energía mecánica total. | Cambiar la amplitud cambia la energía del ensayo; la barra total se conserva durante el movimiento ideal. | El reparto numérico en una posición interior: las barras cinética y potencial se incorporan después de Predice. |

### Piezas y escala

Se reutilizarán fis-estatica y ejes. No se creará un renderizador de tipografía SVG.

- Resorte: pared, objeto resorte, caja o carrito, guía de equilibrio y cotas. La posición del cuerpo se obtiene de una única escala espacial, compartida por todos los ensayos que se comparan.
- Péndulo: viga, cuerda y esfera; sus posiciones se calculan desde la longitud y la inclinación. La viga termina en el apoyo y la longitud llega al centro de la esfera.
- Gráficas: ejes rotulados y curvas muestreadas del mismo estado físico. Las comparaciones conservarán iguales límites y unidades.
- Barras de energía: las tres usan la misma escala de joules por píxel. La suma de las partes ocupa lo mismo que la barra total.
- Los parámetros m y k siempre aparecen rotulados. El tamaño de un bloque no se usará como prueba de su masa: esta se identifica por el rótulo y, si se dibujan cargas añadidas, por piezas visibles.
- Una amplitud o una longitud conocida mayor debe verse mayor a escala común. Si la magnitud es la incógnita, no se dibujará su valor a escala junto a una medida conocida; se usará un esquema declarado sin escala o se omitirá el tramo desconocido.
- La pieza antigua fis-resorte normaliza la posición por A y el péndulo de fis-objeto tiene longitud fija en píxeles. No se utilizarán intactos para comparar amplitudes o longitudes.
- Los rótulos SVG se limitarán a símbolos simples o a los subíndices cortos ya admitidos por fis-estatica. Los nombres largos y las fórmulas se escribirán con nodos HTML de Ecuacion en leyendas y pasos.
- Una fuerza o velocidad nula se mostrará como texto, sin enviar largo cero al campo de flechas: fis-estatica usa un largo por omisión cuando recibe cero.

## 3. Misiones y modelos de los juegos

Los siguientes casos fijan una grilla y un testigo previsto. La implementación deberá recorrer la grilla, verificar el testigo y confirmar que la misión no esté cumplida al abrir. El estado empleado por el dibujo, la lectura y la misión procederá de una misma función; no habrá redondeos independientes.

| Idea | Parámetros y controles propuestos | Misión | Testigo previsto y reserva pedagógica |
| --- | --- | --- | --- |
| 1 | Resorte horizontal ideal. Amplitud entre 5, 10, 15 y 20 cm; período entre 2, 4, 6 y 8 s; tiempo de 0 a 16 s, en pasos de 0,5 s. Parte del extremo derecho. | Consigue que la primera llegada al extremo izquierdo ocurra cuando el reloj marca 3 s. | T = 6 s y t = 3 s, con amplitud libre. Se exige la primera llegada: una llegada posterior no completa la misión. Predice reserva el cálculo del período a partir de varios ciclos. |
| 2 | Carro de 0,5 kg, resorte de 20 N/m. Desplazamiento inicial desde 0 hasta +8 cm, en pasos de 2 cm. | Consigue una aceleración inicial de −2,4 m/s². | Desplazamiento inicial +6 cm. Solo se explora el lado derecho antes de Predice. El control compara puntos de liberación, no representa el tiempo de una trayectoria. |
| 3 | A = 12 cm y T = 4 s; parte del extremo derecho. Tiempo de 0 a 4 s con marcas de un cuarto de ciclo. | Haz que cruce el equilibrio hacia la izquierda. | t = 1 s. La lectura indica posición y sentido; el regreso por el centro a los 3 s se distingue. Predice cambia el extremo de partida y el período. |
| 4 | Carro de 0,5 kg, amplitud fija de 8 cm. Rigidez entre 12,5; 50; 112,5 y 200 N/m. | Consigue un período de aproximadamente 0,63 s. | k = 50 N/m, con un intervalo explícito de aceptación acorde con dos decimales. Solo cambia k; cambiar la masa queda reservado para Predice. |
| 5 | Péndulo con amplitud angular de 8° y g ≈ 10 m/s² como aproximación de cálculo. Se muestran referencia y ensayo. Un selector separa dos experimentos: masas de 40 y 80 g a igual L; longitudes de 25 y 100 cm a igual masa. | Compara dos masas distintas con la misma longitud y el mismo período aproximado. | Referencia de 40 g y ensayo de 80 g, ambos con L = 25 cm. Al abrir son iguales y la misión no está cumplida. La comparación es simultánea y no promete guardar registros. El cambio conjunto de masa y longitud queda para Predice. |
| 6 | Resorte horizontal de 80 N/m y carro de 0,4 kg. Amplitud entre 5, 10, 15 y 20 cm. Se muestra la energía mecánica total durante el movimiento. | Logra una energía mecánica de 0,9 J. | A = 15 cm. Antes de Predice no se muestra el reparto de energía en una posición interior. |

El juego 2 mostrará el instante posterior a soltar el carro: mientras una mano lo mantiene apartado, la fuerza de la mano puede compensar la del resorte y la fuerza neta sería otra. Si se anima el recorrido de ese control, se rotulará como comparación de ensayos; no se fingirá una trayectoria temporal.

En los demás juegos, el reloj y el movimiento tendrán el mismo tiempo físico. Si un control muestra dos decimales, dibujo y lectura usarán exactamente ese valor visible, o la lectura identificará de forma inequívoca la aproximación. La velocidad visual de reproducción podrá cambiar, pero no cambiará el período físico anunciado.

La primera idea contará ciclos desde el estado inicial. Para una posición interior se necesitarán posición y sentido: pasar dos veces por el mismo lugar no basta para contar dos ciclos. En las gráficas, los cuartos se explican primero con movimientos y luego con fase; no se exige reconocer una derivada.

## 4. Predicciones reservadas y errores

| Idea | Caso reservado | Respuesta prevista | Operaciones que representan las otras opciones |
| --- | --- | --- | --- |
| 1 | Ocho oscilaciones completas tardan 4 s. Se pide el período. | 0,5 s. | 0,25 s: contar los dieciséis medios ciclos como completos; 1 s: reunir cada dos ciclos; 2 s: invertir tiempo y cantidad. |
| 2 | En un mismo MAS, a = −3 m/s² cuando x = +2 cm. Se pide a cuando x = −6 cm. | +9 m/s². | −9: conservar el signo inicial; +3: cambiar solo el signo; +27: elevar al cuadrado el factor de desplazamiento. |
| 3 | Un MAS tiene T = 8 s, comienza en reposo en el extremo izquierdo y se observa a los 2 s. Se pide ubicación y sentido. | Cruza el equilibrio hacia la derecha. | Centro hacia la izquierda: trasladar la secuencia que empezó a la derecha; extremo izquierdo: mantener el estado inicial; extremo derecho: confundir un cuarto de ciclo con medio ciclo. |
| 4 | Mismo resorte ideal; se cuadruplica la masa. El período inicial es 0,6 s. | 1,2 s. | 0,3: usar la raíz de la razón inversa; 0,6: omitir el cambio de masa; 2,4: hacer al período directamente proporcional a la masa. |
| 5 | Mismo g y pequeños ángulos. L pasa de 40 a 90 cm y la masa de 30 a 120 g. Se pide la razón de períodos nuevo/inicial. | Aproximadamente 1,5. | 2,25: omitir la raíz; 3: incluir además la raíz de la razón de masas; 0,75: dividir entre esa raíz de masas. |
| 6 | Resorte horizontal de 200 N/m, A = 20 cm; se suelta desde el reposo en un extremo. Se pide energía cinética en x = +10 cm. | 3 J. | 1 J: dar la energía potencial elástica; 4 J: omitir la energía potencial restante; 5 J: sumar las energías en vez de restar. |

El tercer caso sustituye expresamente la propuesta preliminar de A = 20 cm, T = 12 s y partida desde la derecha. Evita que Predice repita la misma fase inicial del juego.

Cada alternativa y cada explicación se producirán mediante una operación determinística sobre las entradas. Sus causas son hipótesis de diseño; la evidencia sobre dificultades conceptuales no valida automáticamente esos distractores. Se comprobarán por separado los valores, los signos, la unicidad numérica y la unicidad después del formato visible.

La primera pantalla, los glosarios, los títulos, la leyenda, la misión, la lectura y la figura previa no traerán la respuesta reservada. La figura de la tercera predicción mostrará el estado inicial y la pregunta sobre el instante posterior, sin colocar ya el carro en su posición final.

## 5. Letras, notación y mapa de colores

Se agrupan magnitudes relacionadas, pero el color nunca sustituye el símbolo, la unidad o el nombre. Una misma magnitud conserva su color en enunciado, control, dibujo, leyenda, ecuación, sustitución numérica y resultado.

| Símbolo o grupo | Significado y unidad | Color de esta unidad |
| --- | --- | --- |
| x, A | Desplazamiento con signo desde el equilibrio y amplitud no negativa; metros o centímetros según se indique. | Turquesa i. |
| L y longitudes auxiliares | Longitud del péndulo hasta el centro de masa; longitud natural y otras longitudes identificadas en el resorte vertical. | Turquesa i. |
| v y rapidez máxima | v es la componente con signo en la recta; la rapidez es su módulo. Unidad: m/s. | Naranja o. |
| a y F del resorte | Componente de aceleración y componente de fuerza; m/s² y N. En el resorte vertical, la fuerza elástica se distingue de la fuerza neta. | Verde d. |
| t, Δt, T, f | Instante, duración, período y frecuencia; segundos y hertz. | Carmín h. |
| ω, φ | Frecuencia angular de la fase y fase inicial; rad/s y rad. ω no es la rapidez angular instantánea de la pesa del péndulo. | Carmín h. |
| θ | Inclinación del péndulo respecto de la vertical; grados en el control, radianes cuando se usa una relación matemática que los requiere. | Carmín h, con arco y símbolo propios. |
| m, k y rigideces de cada resorte | Masa del cuerpo y constante elástica; kg y N/m. La rigidez equivalente se nombra y rotula antes de usarse. | Violeta f. |
| g | Módulo de la aceleración gravitatoria local; se declara el valor de cálculo y su aproximación. | Carmín h. |
| Energía cinética, E con subíndice C | Energía asociada al movimiento del carro. | Naranja o. |
| Energía potencial elástica, E con subíndice PE | Energía del resorte horizontal, medida desde su longitud natural. | Turquesa i. |
| Energía mecánica, E con subíndice M | Suma de las energías cinética y potencial elástica del oscilador horizontal. | Violeta f. |
| N | Número de ciclos completos. | Violeta f. |
| d | Distancia recorrida, que se acumula durante el movimiento. | Turquesa i. |
| δ | Deformación del resorte desde su longitud natural; el subíndice indica equilibrio o instante inicial cuando hace falta. | Turquesa i. |

Esta paleta responde al encargo actual. No se afirma que coincida símbolo por símbolo con todas las unidades anteriores. Se conserva la nomenclatura energética de Trabajo y energía, evitando K/U como nombres alternativos.

El verde de aceleración/fuerza y el naranja de velocidad se distinguirán también por rótulos y carriles separados: velocidad encima del carro, aceleración/fuerza debajo. En gráficos comparados se nombrará cada eje y, si coinciden curvas, se usarán trazos diferentes. Las barras de energía llevarán nombres y valores; no dependerán solo de sus tonos.

### Componentes y referencias

El término «fase» será local a Oscilaciones: aquí es un ángulo y no debe marcar «cambio de fase» en Calor. «Ciclo» no será una forma global de «oscilación», para no confundir los ciclos termodinámicos con un vaivén mecánico. Período y frecuencia se recuperan de Movimiento circular, sin duplicar sus entradas.

En el movimiento rectilíneo, x, v, a y la fuerza con signo son componentes sobre un eje positivo visible; no se colocará una flecha vectorial sobre un escalar. Las flechas del dibujo representan dirección y sentido. Si se emplea una magnitud vectorial completa, se construirá con el nodo de vector y se dirá que es un vector.

En el resorte vertical se reservará x para el desplazamiento desde el equilibrio. La deformación desde la longitud natural tendrá otro nombre y símbolo declarado antes del cálculo. Así no se identifican indebidamente fuerza neta, fuerza elástica y peso.

En el péndulo se hablará de aceleración tangencial cuando se use el modelo armónico. En la posición inferior puede ser nula la componente tangencial y no ser nula la aceleración total, debido a la componente centrípeta.

### Texto y renderizado compatibles

- Teoría: Ecuacion admite nodos de color, subíndice, potencia, fracción, raíz y vector; se usarán también dentro de Datos. Los valores de los parámetros conservarán el color del símbolo en las sustituciones.
- Práctica: se usarán los strings y las fichas P.v que admite el formato existente. Las magnitudes compuestas se escribirán completas: «energía cinética», «energía del resorte», «energía mecánica». Los estados aparecerán como «Al inicio…» y «Después…», en líneas separadas. No se enviarán nodos de ecuación a un renderizador que solo acepta texto.
- Datos de práctica: strings de condiciones y equivalencias. Los valores que deban verse coloreados irán en el enunciado mediante P.v.
- No habrá guiones bajos visibles, subíndices Unicode improvisados, interpolación de objetos en strings ni un conversor SVG nuevo.
- Se ensayará el HTML producido por los renderizadores reales, sin modificar app: ausencia de texto roto, parámetros con los colores esperados y nombres completos. El examen conserva su presentación existente en tinta/negrita.
- Antes del cierre se revisarán ecuaciones y figuras a 390 px. Una igualdad extensa se dividirá por pasos matemáticos, no en medio de un operador.

## 6. Ejemplos, práctica y comprobaciones previstas

Cada idea tendrá quince ejemplos propios: cinco de nivel 1, cinco de nivel 2 y cinco de nivel 3. El tercer nivel combinará decisiones y operaciones, no solo números mayores. Sus cinco respuestas correctas ocuparán A, B, C, D y E una vez cada una.

| Idea | Nivel 1 | Nivel 2 | Nivel 3 y familias de práctica |
| --- | --- | --- | --- |
| 1 | Reconocer equilibrio, extremos y ciclo; contar períodos. | Convertir tiempos y relacionar conteos, frecuencia y período. | Distinguir pasos por una posición, ciclos completos y recorrido; combinar unidades y conteo. |
| 2 | Sentido de fuerza y aceleración; fuerza desde un desplazamiento. | Convertir cm a m, usar masa y comparar puntos del mismo sistema. | Reconstruir rigidez o masa desde dos datos y predecir otro estado con signo. |
| 3 | Cuartos de ciclo y lectura de posición/sentido. | Evaluar una fase con valores trigonométricos dados y convertir unidades. | Determinar fase o instante compatible con posición y sentido; comparar dos estados inequívocos. |
| 4 | Período de un resorte y razones simples. | Despejar masa o rigidez; obtener rigidez a partir del equilibrio vertical. | Dos resortes en serie o paralelo y período posterior; distinguir deformación estática, posición inicial y amplitud. |
| 5 | Identificar longitud y estimar período a pequeño ángulo. | Razones de longitudes y períodos, con unidades y g declarado. | Obtener longitud mediante conteos o comparar dos entornos y justificar qué parámetros influyen. |
| 6 | Energía total y energía del resorte en posiciones conocidas. | Hallar energía cinética o rapidez mediante un balance. | Reconstruir amplitud o posición desde datos energéticos, y añadir el sentido solo cuando esté determinado. |

Los ejemplos de nivel 3 mostrarán la relación inicial, la sustitución con unidades, el despeje que cambia la incógnita y la interpretación. Si se divide entre la masa, se escribirá primero la igualdad que la contiene y se explicará la cancelación. «Por kilogramo», «fase» o «rigidez equivalente» no sustituirán un paso que todavía no se explicó.

Se prevé una plantilla nueva fis-oscilaciones, con TIPOS_POR_IDEA y al menos tres familias progresivas por idea. Sus variantes cubrirán los casos de la tabla. Resuelve y Ahora tú tendrán bancos de entradas separados, sin repetir ejemplos, misión o Predice. Las antiguas mas y mas-horaria pasarán a «Más mesas del tema» con rehacer, conservando los identificadores necesarios.

El papel incluirá ocho problemas: al menos uno por idea y dos combinados, con Datos del caso, unidades y condiciones, sin fórmulas de resolución. Se propondrán hasta dos pares A/B para la reserva de la prueba del curso; no se modificarán los diez pares activos sin una necesidad expresamente autorizada.

Al cambiar las predicciones de los cinco identificadores existentes y añadir una idea, se requerirá una migración mínima del avance en un bloque propio, con su prueba. La ficha del catálogo conservará todos sus temas y requisitos; las rutas de práctica se asignarán por idea.

### Comprobaciones que faltan por ejecutar

1. Calcular respuestas, opciones y explicaciones con código determinístico; recalcularlas por otro procedimiento en pruebas independientes.
2. Recorrer 400 semillas por cada generador de teoría y de práctica, incluyendo cada igualdad y afirmación visible. Rehacer la cuenta desde los números que efectivamente se muestran.
3. Verificar una sola respuesta por fuerza bruta, sin duplicados numéricos ni duplicados tras el redondeo.
4. Evaluar las grillas de misión y los estados intermedios del movimiento automático. Control, lectura y dibujo deben usar el mismo estado.
5. Verificar escalas comunes, extremos físicos, fuerzas nulas, longitud de los resortes, conservación de la longitud del péndulo y ausencia de respuestas medibles en dibujos previos.
6. Comprobar rótulos contra rótulos, cuerpos, flechas, guías y cotas; revisar las capturas reales cuando el entorno lo permita.
7. Examinar color, notación y HTML real en teoría, práctica, papel y examen, además del validador simulado con calidad 2. La unidad no se marcará con esa calidad.
8. Correr las pruebas pertinentes durante la escritura y la suite completa al cerrar la unidad; los fallos ajenos se informarán sin corregirlos.

Estas comprobaciones son compromisos de implementación, no resultados obtenidos en esta propuesta.

La comprobación del entorno ha encontrado un bloqueo EACCES al abrir el servidor en localhost. Todavía no se han obtenido ni inspeccionado capturas de esta unidad. La revisión visual queda pendiente de disponer de un servidor accesible; las comprobaciones de geometría y HTML no la sustituyen.

## 7. Datos del mundo y fuentes

La mayoría de los valores serán parámetros declarados de modelos didácticos. No se presentarán como mediciones de una escuela, una ciudad o un aparato real. El uso de g ≈ 10 m/s² es una aproximación de cálculo, no una medición local.

Puede incorporarse un caso con la masa nominal de 7,32 g de la moneda conmemorativa de 2021 «Toribio Rodríguez de Mendoza», según la ficha del BCRP. Su diámetro nominal es 25,50 mm. La ficha llama «peso» al dato en gramos; el texto de Física dirá masa. No se extenderá el dato a todas las monedas peruanas. Si se usa como pesa de un péndulo, se declarará la aproximación de masa puntual y L se medirá hasta su centro de masa. Una rigidez o longitud añadida al problema será un supuesto didáctico, no una especificación atribuida al BCRP.

La demostración de UCSB con masas de 50 g y resortes de rigidez aproximada 1 N/m sirve como referencia de montaje para serie/paralelo. No se reutilizará su cuenta errónea que escribe 0,50 kg junto a una fuerza de aproximadamente 0,49 N; tampoco se importarán como exactos los efectos de un resorte real con masa.

Fuentes del contraste independiente, que orientan el contenido y no aportan ejercicios copiados:

- [OpenStax 15.1, MAS](https://openstax.org/books/university-physics-volume-1/pages/15-1-simple-harmonic-motion): fuerza restauradora, fase y resorte vertical.
- [OpenStax 15.2, energía](https://openstax.org/books/university-physics-volume-1/pages/15-2-energy-in-simple-harmonic-motion): balance del oscilador ideal.
- [OpenStax 15.3, proyección circular](https://openstax.org/books/university-physics-volume-1/pages/15-3-comparing-simple-harmonic-motion-and-circular-motion): conexión con el requisito de movimiento circular.
- [OpenStax 15.4, péndulos](https://openstax.org/books/university-physics-volume-1/pages/15-4-pendulums): modelo simple y límites del ángulo pequeño. Se elige 5°–10°; no se copia sin verificar una cota general de error para 15°.
- [Tumanggor y colaboradores, 2020](https://ejournal.radenintan.ac.id/index.php/al-biruni/article/download/4571/pdf/19396): dificultades conceptuales estudiadas en 60 alumnos de secundaria de Indonesia. No proporciona frecuencias de error de postulantes peruanos ni valida nuestros distractores concretos.
- [Reglamento UNMSM 2023-I](https://medicina.unmsm.edu.pe/wp-content/uploads/2023/02/Reglamento-de-Admision-2023-I.pdf): evidencia curricular histórica de MAS, bloque-resorte, péndulo simple y energía. No se presenta como temario vigente de 2026 ni como frecuencia de admisión.
- [BCRP, moneda conmemorativa](https://www.bcrp.gob.pe/docs/Billetes-Monedas/Monedas-de-Coleccion/bicentenario-2021/bicentenario-3-trdm.pdf): especificaciones nominales del único objeto monetario citado.
- [UCSB, demostración 40.15](https://www.physics.ucsb.edu/~lecturedemonstrations/Composer/Pages/40.15.html) y [MIT OCW, material inicial de oscilaciones](https://live.ocw.mit.edu/courses/res-8-009-introduction-to-oscillations-and-waves-summer-2017/mitres_8_009su17_starter.pdf): conexiones de resortes y condiciones mecánicas.

Se toma de la investigación el objeto físico antes de la fórmula, la distinción entre fuerza y velocidad, las comparaciones de sistemas y las advertencias del resorte vertical y el péndulo pequeño. Se reorganiza en seis ideas. Se descartan fórmulas en Datos, energía vertical dentro de la idea 6 y ampliaciones de amortiguamiento o redes de resortes que excedan el alcance.

## 8. Orden con otras unidades

Se mantienen los requisitos existentes: fisica.trabajo-y-energia, fisica.movimiento-circular y trigonometria.funciones-trigonometricas. Hooke, segunda ley y energía se recuperan en el texto y en las explicaciones, sin trasladar sus despejes a Datos.

La introducción vuelve a explicar signos y origen. Antes de usar ω o φ se recuperan radián, una vuelta y cuadrantes mediante el objeto y su secuencia. No se exige cálculo diferencial ni una nueva unidad de trigonometría para comenzar las ideas 1 y 2.

La idea 4 amplía el resorte vertical sin repetir toda la unidad de Trabajo y energía. La idea 5 limita expresamente el péndulo simple y evita identificar su aceleración tangencial con la aceleración total. La idea 6 retoma las energías del curso, solo en horizontal. Esta unidad no depende de que Gravitación o Impulso y choques hayan sido integradas ni incorpora cambios de sus ramas.

Fluidos será una unidad posterior independiente. No se adelantan aquí presión, empuje ni oscilaciones de cuerpos flotantes.

## 9. Decisiones tomadas (Gerson revisa después)

| Duda | Opción elegida y motivo | Opción descartada |
| --- | --- | --- |
| 1. ¿Cinco ideas antiguas o una entrada nueva? | Seis ideas: añadir ciclo-y-amplitud y conservar los cinco identificadores anteriores. El alumno interpreta el vaivén antes de recibir fase o ecuaciones. | Mantener títulos que adelantan respuestas y concentrar ciclo, signos, fase y fuerza en la primera pantalla. |
| 2. ¿Qué debe contener Datos y cómo se muestra la notación? | Aplicar la instrucción actual: entradas, condiciones y equivalencias sin fórmulas. Nodos estructurados en teoría; strings/P.v compatibles y nombres completos en práctica. | Copiar fórmulas de los Datos antiguos, enviar objetos a un renderizador de strings o modificar app para acomodar esta unidad. |
| 3. ¿Reutilizar las piezas antiguas tal como están? | Componer con fis-estatica y ejes, escalas comunes y rotulación existente. El movimiento, las medidas y las lecturas procederán del mismo estado. | Normalizar cada amplitud por sí misma, cambiar solo el rótulo de un péndulo de largo fijo o crear tipografía SVG propia. |
| 4. ¿Hasta dónde llevar los modelos? | Resorte vertical y dos resortes ideales en la idea 4; energía solo horizontal; péndulo de 5°–10° con aproximación y componente tangencial explícitas. | Redes mixtas, masa del resorte, péndulo físico/cónico y energía vertical escrita como si toda deformación se midiera desde el equilibrio. |
| 5. ¿Qué paleta y qué predicción de gráficas? | Usar los grupos de color indicados, reforzados por símbolos, unidades, carriles y trazos. Predice3 parte de la izquierda con T = 8 s y pregunta a los 2 s, después de explorar cuartos desde la derecha. | Depender solo del contraste verde/naranja, dejar m/k sin rótulo o repetir en Predice la misma fase inicial del juego. |
| 6. ¿Qué datos reales y qué respaldo atribuir a los errores? | Modelos didácticos declarados y, si aporta al aprendizaje, una aplicación BCRP identificada. Distractores como operaciones hipotéticas con comprobación independiente. | Inventar mediciones locales, generalizar la masa de una moneda o presentar frecuencias extranjeras como diagnóstico peruano. |

