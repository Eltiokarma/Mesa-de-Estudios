# Propuesta de Física — Etapa 19: Ondas mecánicas y sonido

Borrador para revisión de Gerson. 27 de noviembre de 2026. Unidad `fisica.ondas-mecanicas`, archivo `contenido/teoria/fisica/ondas-mecanicas.js`, rama `codex/etapa19-fisica-ondas-mecanicas`, creada desde main `1da59851801fd377337c8be1e984850545ad71bb`. Este documento propone contenido; no afirma que esté implementado ni comprobado como unidad terminada.

No se encontró un conflicto crítico con lo publicado. Se conservan los cinco identificadores actuales, sus objetivos, los seis temas de la ficha y los tres laboratorios. Se añade una idea de superposición y fronteras, y se desarrolla la energía cuantitativa que hoy falta. La actualización editorial del 27 de noviembre prevalece sobre ejemplos antiguos del molde: Datos contiene valores, unidades y equivalencias necesarias; las relaciones y el camino de solución se explican después.

## Qué preguntan los exámenes y qué evidencia tenemos

La guía oficial CEPRE-UNI 2026-2 incluye propagación, función de onda, reflexión y refracción en cuerdas, ondas estacionarias, transferencia de energía y sonido. Son las semanas **9 y 10**, no solo la 9 registrada hoy. La investigación histórica CEPRE-UNI 2023-2 sirve de antecedente; no se presenta como el temario vigente. La guía de 2026-2 confirma ese ciclo, no todos los procesos futuros.

Tres casos oficiales delimitan exigencias concretas: UNI 2015-I, Física 9, pide interpretar una función de onda y su propagación; UNI 2020-I, Física 14, combina función y potencia media para recuperar densidad lineal; el volumen oficial UNI 2009-II incluye una pregunta sobre diferencia de niveles y razón de intensidades en el **segundo parcial CEPRE**, no en el examen general. Las soluciones y figuras nuevas serán propias. No se copiarán los desarrollos oficiales.

El CSV local clasifica 16 registros en esta unidad: cinco de períodos, frecuencias o longitudes de onda; dos de llegadas por medios diferentes; uno de movimiento del medio; uno de función; siete de intensidad, fuentes, distancia o potencia. Es un inventario del repositorio, no una muestra representativa de todos los exámenes ni una fuente oficial por sí misma. Dos filas tienen advertencias locales de ambigüedad o alternativas duplicadas; no se trasladarán sin contrastar el original. No se modificará el CSV.

Doppler, resonancias en tubos y pulsaciones aparecen en libros universitarios y en la investigación, pero no están enumerados en esos bloques oficiales verificados ni en los seis temas de la ficha. Se reservan como ampliaciones futuras; esa reserva no significa que nunca puedan aparecer en una evaluación. La potencia viajera sí es un objetivo explícito y se enseña con cálculo en la idea 3.

## 0. Diagnóstico de lo publicado

La unidad tiene cinco ideas, unos 52 KB y ningún banco de quince ejemplos por idea. Carece de Lee, Así se resuelve y misiones con el contrato actual. Sus escenas empiezan con gráficas; no muestran la soga, la marca material, las partículas longitudinales ni las fronteras físicas.

Hay dos fugas concretas: Juega 2 ya muestra la rapidez que pide Predice 2; Juega 3 compara las mismas densidades lineales cuya razón reaparece en Predice. En estacionarias se escribe como exacto un redondeo de dos tercios. En sonido se suman dos fuentes sin declarar independencia, y una explicación confunde intensidad con energía por segundo. La frase general de que una onda no transporta materia necesita situarse en el modelo de pequeñas oscilaciones del medio; no se usará como afirmación universal sobre cualquier ola real.

Se conservan los laboratorios `guitarra`, `cuerda-fija` y `parlantes`, con física, notación y condiciones revisadas. No hay Doppler, tubos ni pulsaciones en las cinco ideas publicadas o en esos tres laboratorios, por lo que reservarlos no elimina contenido ya enseñado. La pregunta antigua `fis-20`, actualmente en reserva del curso, se conserva sin modificación: mide rapidez de pulso frente a tensión, masa por longitud y movimiento de la mano.

## 1. Ideas, en este orden

| Orden e identificador | Título | Frase de aprendizaje |
|---|---|---|
| 1. `la-cresta-avanza` | La perturbación avanza | Distingue el avance de una perturbación del movimiento de cada porción del medio y calcula tiempos de llegada. |
| 2. `funcion-de-onda` | La función de una onda | Relaciona dos fotografías de una onda con su función, su longitud de onda, su período y su sentido de propagación. |
| 3. `rapidez-cuerda` | Rapidez y potencia en cuerdas | Explica cómo el medio fija la rapidez y cómo la amplitud cambia la energía transportada cuando las demás condiciones permanecen iguales. |
| 4. `superposicion-y-fronteras` | Superposición y fronteras | Suma desplazamientos y explica qué ocurre cuando una onda encuentra otra onda, un extremo o una cuerda diferente. |
| 5. `ondas-estacionarias` | Ondas estacionarias en cuerdas | Reconoce nodos y vientres durante un ciclo y relaciona los modos permitidos con longitud, rapidez y frecuencia. |
| 6. `intensidad-decibeles` | Intensidad y decibeles | Distingue potencia, intensidad y nivel sonoro para comparar distancias y combinar fuentes independientes sin sumar sus decibeles. |

Cada idea tendrá los siete momentos, 15 ejemplos —cinco de cada nivel— y práctica filtrada por su identificador. Las ideas 3 y 6 no se reducen a fórmulas: Mira desarrolla el mecanismo, un caso y sus condiciones. En la 3 se separan rapidez y potencia en pasos sucesivos; en la 6 se separan reparto espacial, escala logarítmica y suma de fuentes.

### 1.1. Alcance y explicación de cada idea

**Idea 1.** Una marca atada a la soga permite seguir materia; un máximo del perfil permite seguir la perturbación. Se comparan un pulso transversal y una fila de anillos longitudinales, sin dibujar aire que sube y baja. En la aproximación empleada, las porciones oscilan cerca de sus posiciones de equilibrio mientras el patrón se propaga. Se explica el tiempo de viaje mediante avances iguales en tiempos iguales. Los casos de doble llegada usan dos cuerdas de igual longitud con rapideces dadas y emisiones explícitas; no anticipan sonido, eco ni reflexión. Se distingue duración del paso de un pulso, recorrido local de una marca y avance del patrón. No se introducen período, frecuencia ni una fórmula de rapidez de cuerda antes de las ideas correspondientes.

**Idea 2.** Una fotografía espacial mantiene fijo el tiempo; el registro de una marca mantiene fija su posición. Esa diferencia explica por qué una separación entre crestas mide longitud y una repetición del registro mide período. Primero se obtiene `v = λf`; luego se construye la fase de una onda sinusoidal. Seguir una misma fase, con ejemplos de números pequeños, justifica el signo temporal y `v = ω/k`. La velocidad local `u` pertenece a la marca y puede cambiar de signo mientras el patrón avanza siempre en el mismo sentido. Se aprovecha el MAS previo para explicar el máximo `ωA`; no se exige derivación diferencial al alumno.

**Idea 3.** Más fuerza de tensión produce una mayor aceleración de las porciones vecinas; más masa por longitud dificulta esa respuesta. La comparación de casos conduce a `v = √(F/μ)`, con `μ = m/L`. Después se recupera la energía del MAS: duplicar el desplazamiento y la rapidez local multiplica por cuatro las contribuciones energéticas cuando el resto permanece fijo. La potencia media de una onda viajera sinusoidal es `P_media = μω²A²v/2`. Se explica el factor medio y se distinguen energía transferida durante un intervalo, energía media contenida en un tramo y potencia. Para intervalos de períodos completos se puede usar exactamente `E = P_media Δt`; es una condición suficiente, no necesaria. También sirve cualquier número entero de medios períodos en este modelo. Para un intervalo arbitrario no se afirmará esa igualdad exacta sin considerar la fase.

El modelo de potencia exige cuerda uniforme, fuerza de tensión constante, pequeña inclinación (`Ak ≪ 1`), pérdidas despreciables, una onda sinusoidal viajera y `ω > 0`. El banco nuevo limitará `Ak ≤ 0,1` como margen de diseño, no como frontera universal de validez. La potencia se presenta como magnitud promedio positiva en el sentido de viaje. La energía media de un tramo se explicará como promedio temporal; no se dirá que cada pequeño elemento es un resorte independiente de energía mecánica constante. El oráculo integrará el trabajo transmitido a través de un corte, por el flujo `−F·y_x·y_t`, en lugar de repetir la fórmula de producción.

**Idea 4.** Primero se suman los desplazamientos de dos pulsos en el mismo punto. Después se sigue el tiempo para comprobar que una cancelación instantánea no elimina los pulsos. La condición de un extremo fijo exige desplazamiento nulo y explica la inversión de la reflexión; el extremo libre ideal exige pendiente nula y no invierte el pulso. Al unir dos cuerdas bajo la misma tensión se conservan la frecuencia de la fuente y la continuidad del movimiento de la unión; cambian rapidez, longitud de onda y, en general, amplitudes. Se llama refracción en cuerdas al cambio de propagación que usa el temario; la escena es unidimensional y no inventa un ángulo de Snell.

La enseñanza de frontera combina reflexión cualitativa, rapidez, frecuencia, longitud de onda y tiempos de viaje por tramos. No añade ejercicios de coeficientes de amplitud ni reparto de potencia. El modelo interno sí calculará amplitudes incidentes, reflejadas y transmitidas físicamente compatibles, porque omitir esas fórmulas en el texto no autoriza a dibujar amplitudes arbitrarias. Sus pruebas verificarán continuidad y balance de potencia como controles del modelo. No se supondrán amplitudes iguales ni se simulará un extremo fijo con una rapidez casi cero.

**Idea 5.** Dos ondas iguales que viajan en sentidos opuestos forman un patrón cuyos nodos permanecen quietos durante todo el ciclo. Una fotografía recta no convierte todos los puntos en nodos. Para dos extremos fijos, contar medias longitudes de onda dentro del tramo explica `L = nλ/2` y las frecuencias permitidas. Se distingue la amplitud de cada onda viajera de la amplitud máxima de un vientre. Resonancias consecutivas y menor frecuencia común son problemas combinados, no sustituciones de una sola fórmula. Si cambia la longitud, un puente móvil cambia el tramo vibrante de una cuerda uniforme; no se estira un material de masa fija conservando artificialmente su densidad lineal. La potencia media neta de la estacionaria ideal es nula aunque la cuerda almacene energía.

**Idea 6.** La fuente entrega potencia; la intensidad mide cuánto atraviesa cada área perpendicular a la propagación. Una fuente puntual que emite por igual en todas las direcciones distribuye su potencia sobre una esfera. El aumento del área explica la disminución de intensidad con la distancia. Los decibeles expresan una razón de intensidades, no una intensidad ni un porcentaje. Se construye la escala con factores 10 y luego con razones intermedias, explicando los logaritmos que realmente se usan. Se suman intensidades de fuentes independientes o incoherentes en el punto receptor y solo después se calcula el nivel. Dos fuentes coherentes requieren fase y no se resuelven con esa suma automática. La generación longitudinal del sonido, frecuencia/tono y composición/timbre aparecen como conexiones breves; no se confunde intensidad física con una medida universal de sonoridad percibida.

## 2. Objeto de la primera pantalla y piezas

| Idea | Qué aparece antes de una fórmula | Qué observa el alumno |
|---|---|---|
| 1 | Una mano, una soga y una marca atada a ella; el pulso tiene un máximo distinguible. | La marca conserva su identidad mientras el pulso pasa. La vista longitudinal posterior muestra anillos, no una senoide como trayectoria del aire. |
| 2 | La misma soga con una marca y dos instrumentos de registro, presentados uno por tarjeta. | Una fotografía muestra posiciones diferentes en el mismo instante; el registro temporal sigue una sola marca. |
| 3 | Una soga tensada entre un soporte y un dispositivo que permite elegir la fuerza; masa y longitud están rotuladas. | El mismo pulso tarda distinto al cambiar el medio. Más adelante aparece el corte por el que pasa energía. |
| 4 | Dos pulsos en una sola soga; después, pared, guía libre o unión de dos tramos. | La cuerda real es la suma. Los trazos individuales son auxiliares discontinuos y se nombran. |
| 5 | Una cuerda de longitud conocida entre dos soportes fijos. | El movimiento instantáneo y su envolvente permiten distinguir puntos siempre quietos de cruces momentáneos. |
| 6 | Un parlante, un receptor y superficies de reparto declaradas como esquema. | La potencia de la fuente y la intensidad en el receptor son magnitudes diferentes. Un frente de sonido no es una partícula que abandona el parlante. |

Se propone la pieza propia `fis-ondas-e19`: recibe perfiles y posiciones calculados, fronteras, partículas identificables, cotas y rótulos. No calcula respuestas ni contiene un reloj independiente. Exportará dibujo, texto alternativo y geometría inspeccionable para pruebas. Se reutilizan `ejes` para gráficas con ejes y unidades reales, y `T.rotulo`, líneas, flechas y cotas del kit. No se ampliará una pieza compartida ni se copiará el canvas antiguo. Si se usa un eco como aplicación posterior, aparecerá después de enseñar reflexión, nunca en la primera idea.

Las transformaciones horizontal y vertical permanecen fijas durante una escena y sus comparaciones. Cuando centímetros verticales se amplíen respecto de metros horizontales, se declara «Las alturas están ampliadas». Una incógnita no alimenta geometría, cotas, alt ni escala antes de resolver; se usa una figura declarada esquemática si la geometría exacta permitiría medirla. Ningún identificador interno se imprime como texto. Las fórmulas, raíces, fracciones y subíndices van fuera del SVG con nodos del núcleo; dentro se usan palabras breves y valores del kit. Puntos y cuerdas son 1/2, izquierda/derecha o entrada/salida, nunca A/B.

El motor antiguo `plantillas/ondas/motor.js` se puede reutilizar mediante adaptadores comprobados, sin modificarlo. Su clave interna `T` se traduce a la fuerza visible `F`. Su amplitud de estacionaria corresponde a cada viajera: el vientre alcanza el doble. Sus pulsos gaussianos no tienen un borde de llegada exacto; cuando el relato requiera llegada o salida de un pulso se utilizará un perfil propio de soporte finito. Las partes de potencia o frontera que falten se calculan en código propio de la unidad o de su plantilla.

## 3. Misiones comprobables

Los siguientes casos fijan el diseño. La implementación calculará posiciones, lecturas, estados iniciales y testigos; no guardará a mano respuestas independientes del modelo. El reloj permite observar, pero ninguna misión se completa desde el control inicial solo por dejar correr la animación. Los valores aquí listados no se imprimirán todos como instrucciones que delaten la acción necesaria.

| Idea | Contexto y misión propuesta | Control y caso | Criterio de logro; estado inicial |
|---|---|---|---|
| 1 | «Haz que la marca recorra 4 cm cuando pasa un pulso.» | Pulso positivo de soporte finito; amplitudes 1, 2 o 3 cm. La marca sube y vuelve una vez, no ejecuta un ciclo sinusoidal completo. | Recorrido acumulado 4 cm al terminar el paso: amplitud 2 cm. Inicial 1 cm, que recorre 2 cm. Posición horizontal de la marca invariable. |
| 2 | «Consigue que tres crestas pasen por la marca en un segundo.» | Frecuencias 1, 2 o 3 Hz, rapidez 2,4 m/s, amplitud fija. El conteo se define sobre un intervalo abierto a la izquierda y cerrado a la derecha, con fase inicial explícita. | Tres pasos de cresta en 1 s: 3 Hz. Inicial 1 Hz. No contar dos veces una cresta del borde del intervalo. |
| 3 | «Haz que el pulso recorra 2 m en 0,05 s.» | `μ = 0,01 kg/m`; fuerzas 4, 9, 16 o 25 N. Misma forma de pulso, nuevo ensayo al cambiar fuerza. | `F = 16 N`, rapidez 40 m/s. Inicial 4 N, que tarda 0,1 s. El reloj y la lectura usan el mismo tiempo físico. |
| 4 | «Haz que la marca situada a 2 m suba 5 cm al encontrarse los pulsos.» | Dos pulsos positivos de 2 y 3 cm, rapidez 1 m/s en sentidos opuestos. Primer centro en 1 m; separación inicial elegible 1, 2 o 3 m; comparación al segundo 1. El encuadre contiene completos ambos pulsos en las tres posiciones iniciales. | Separación 2 m: los centros coinciden en 2 m y la suma es 5 cm. Inicial separación 3 m. El caso de pulsos opuestos se reserva para Predice. |
| 5 | «Consigue dos puntos interiores que permanezcan quietos durante todo el ciclo.» | Cuerda de 1,2 m y rapidez 12 m/s; excitaciones 5, 10 o 15 Hz. | Tercer modo: dos nodos interiores. Inicial primer modo. Se evalúa la amplitud local durante el ciclo, no un solo fotograma. |
| 6 | «Ajusta la fuente hasta obtener 30 µW/m² en el receptor.» | Fuente puntual ideal, receptor a 10 m; potencias 4π, 8π, 12π o 16π mW. | Potencia 12π mW. Inicial 4π mW, intensidad 10 µW/m². Las potencias son datos sintéticos exactos para el modelo, no mediciones de un parlante comercial. |

Cada Juega tendrá una voz que nombra el objeto y el control, una leyenda de lo visible y una lectura breve calculada. Antes de Predice no aparecerá una regla que anticipe la respuesta reservada. Lee dará de dos a cuatro tarjetas sobre lectura del objeto, unidades o vocabulario; no será una segunda solución escondida. La información calculada que haga visible el fenómeno se distingue de las explicaciones causales que corresponden a Mira.

## 4. Predicciones y errores interpretables

Las opciones se barajan, pero cada valor y cada contrafactual nace de una operación determinística. Las claves siguientes son propuestas de hipótesis didácticas: no se presentan como porcentajes ni hallazgos observados en postulantes peruanos. La investigación sobre modelos de partículas y sonido orienta la selección, sin convertir automáticamente cada error nuevo en un resultado publicado.

### Idea 1: tiempo total de llegada

En la misma cuerda uniforme, un pulso recorre 4 m en 2 s. Una marca está a 7 m del punto de emisión. «¿Cuánto tiempo pasa desde la emisión hasta que el pulso llega a la marca?» Datos: 4 m; 2 s; 7 m. No aparece una rapidez calculada ni una fórmula en Datos.

| Opción | Operación e interpretación |
|---|---|
| **3,5 s** | El avance mantiene la misma razón; se calcula el tiempo total. |
| 2 s | Conserva el tiempo aunque cambie la distancia. |
| 1,5 s | Responde únicamente el tiempo del tramo adicional de 3 m. |
| 14 s | Trata los 2 s observados como tiempo por cada metro y omite los 4 m de referencia. |

La misión trata recorrido de una marca; esta pregunta trata viaje del pulso en otro caso. Las definiciones previas de transversal y longitudinal no la contestan. La figura señala distancias dadas, sin mostrar posición final ni reloj de llegada. Mira usa la marca para mantener separadas ambas clases de movimiento.

### Idea 2: separación entre crestas

Una onda avanza 6 m en 2 s y la fuente realiza 3 ciclos por segundo. «¿Qué separación hay entre dos crestas consecutivas?» Datos: 6 m; 2 s; 3 Hz. El gráfico previo es esquemático y no permite medir la separación pedida.

| Opción | Operación e interpretación |
|---|---|
| **1 m** | En cada segundo los 3 m de avance contienen tres repeticiones. |
| 9 m | Multiplica la rapidez por la frecuencia en vez de dividir. |
| 3 m | Confunde el avance de un segundo con una longitud de onda. |
| 2 m | Divide la distancia dada entre los ciclos de un segundo y omite los 2 s observados. |

Se pide una distancia no observada, no la frecuencia elegida en la misión. El nuevo avance es de 6 m en 2 s, distinto de los 2,4 m/s del juego; por ello ninguna separación vista allí entrega la respuesta. Los contrafactuales explican qué cambia cuando aumenta la cantidad de repeticiones por segundo manteniendo la rapidez.

### Idea 3: cambiar el medio

En una cuerda un pulso viaja a 24 m/s. Se usa otra con cuatro veces la masa por metro y la misma fuerza de tensión. «¿Cuál será la rapidez?» Datos: 24 m/s; razón de masas por metro 4; fuerza de tensión sin cambio. No se mostraron esas dos cuerdas en el juego.

| Opción | Operación e interpretación |
|---|---|
| **12 m/s** | Reduce la rapidez según la raíz de la razón de masas por longitud. |
| 6 m/s | Aplica proporcionalidad inversa lineal. |
| 24 m/s | Supone que cambiar de cuerda no cambia la rapidez. |
| 48 m/s | Hace más rápida la propagación en la cuerda con mayor masa por metro. |

La regla posterior se completa con potencia: cambiar amplitud no cambia esta rapidez en el modelo, pero sí la energía transportada. Ese desarrollo no se omite por no ser el centro de la predicción.

### Idea 4: cancelación que dura un instante

Dos pulsos de igual forma y amplitud, uno hacia arriba y otro hacia abajo, viajan uno hacia el otro. «¿Qué ocurre cuando coinciden y después se separan?» Datos: amplitudes de 2 cm; formas iguales; sentidos contrarios. Antes de responder se ve solo el estado anterior al encuentro.

| Opción | Modelo que representa |
|---|---|
| **La cuerda queda recta un instante; después los pulsos continúan.** | Suma punto por punto y evolución posterior de las dos perturbaciones. |
| Los dos pulsos desaparecen definitivamente. | Interpreta cancelación de desplazamiento como destrucción de las ondas. |
| Los pulsos rebotan y regresan por donde llegaron. | Trata los pulsos como cuerpos que chocan. |
| Se forma un pulso de 4 cm hacia arriba. | Suma magnitudes y descarta el signo de uno de los desplazamientos. |

Se ajustará la longitud de la primera opción al tope sin perder las dos observaciones. Los contrafactuales mostrarán exactamente la trayectoria o el desplazamiento que exigiría cada hipótesis, sin afirmar que una energía negativa cancela otra.

### Idea 5: otro modo permitido

Una cuerda fija en ambos extremos mide 1,5 m. La rapidez es 18 m/s y el patrón tiene cuatro vientres. «¿Con qué frecuencia oscila?» Datos: 1,5 m; 18 m/s; cuatro vientres. El cuarto modo no aparece en el selector de la misión.

| Opción | Operación e interpretación |
|---|---|
| **24 Hz** | Ajusta cuatro medias longitudes de onda y calcula la frecuencia. |
| 6 Hz | Usa siempre la frecuencia fundamental. |
| 12 Hz | Cuenta dos modos donde hay cuatro vientres. |
| 48 Hz | Omite el factor 2 de las medias longitudes de onda. |

Los dibujos respetan los cuatro vientres dados y los extremos, pero no rotulan longitud de onda ni frecuencia calculadas. Los nodos se identifican por el ciclo, no por un cruce aislado.

### Idea 6: la misma fuente, otra distancia

El receptor pasa de 4 m a 8 m de la misma fuente puntual ideal, que mantiene su potencia y emite por igual en todas las direcciones. «¿Qué fracción de la intensidad inicial recibe?» Datos: 4 m; 8 m; potencia sin cambio.

| Opción | Operación e interpretación |
|---|---|
| **La cuarta parte.** | Usa la razón de áreas de reparto. |
| La mitad. | Supone disminución inversa lineal con la distancia. |
| La misma intensidad. | Confunde conservar potencia con conservar intensidad. |
| El doble. | Hace crecer la intensidad en proporción a la distancia. |

El juego cambió potencia con una distancia fija; esta variante cambia distancia con potencia fija. No se imprime el área de ninguna esfera antes de responder. Los decibeles se explican después, sobre intensidades ya comprendidas.

## 5. Tabla de letras y glosario por idea

| Símbolo | Significado y unidad | Primera explicación |
|---|---|---|
| `x`, `y` | Posición a lo largo de la cuerda y desplazamiento transversal; m. Para una partícula longitudinal se distingue su posición de equilibrio de su desplazamiento. | 1–2 |
| `A` | Amplitud del desplazamiento; m. Nunca área. | 1; se formaliza en 2 |
| `t`, `Δt`, `T` | Tiempo, intervalo y período; s. `T` nunca es fuerza de tensión visible. | 1–2 |
| `f`, `ω` | Frecuencia en Hz y frecuencia angular en rad/s. | 2 |
| `λ`, `k`, `φ` | Longitud de onda en m, número de onda en rad/m y fase inicial en rad. | 2 |
| `v`, `u` | Rapidez de propagación y velocidad local de una porción del medio; m/s. `v` es positiva y el sentido se declara aparte; `u` puede tener signo. | 1–2 |
| `F`, `m`, `L`, `μ` | Fuerza de tensión en N, masa en kg, longitud en m y masa por longitud en kg/m. | 3 |
| `E`, `P` | Energía en J y potencia en W; la media lleva el identificador correspondiente con nodos, no un guion bajo literal. | 3 |
| `n` | Número entero positivo del modo. | 5 |
| `S`, `r` | Área perpendicular a la propagación en m² y distancia radial en m. | 6 |
| `I`, `I₀`, `β` | Intensidad y referencia en W/m²; nivel de intensidad en dB. Los subíndices se construyen con nodos. | 6 |

Se preservan los quince términos publicados y se redistribuyen para que cada idea introduzca entre dos y cuatro. Plan de **24 entradas**: idea 1, onda, onda mecánica, onda transversal y onda longitudinal; idea 2, cresta, longitud de onda, función de onda y fase; idea 3, densidad lineal, fuerza de tensión, potencia media y energía transportada; idea 4, superposición, reflexión, transmisión y refracción en cuerdas; idea 5, onda estacionaria, nodo, vientre y frecuencia fundamental; idea 6, intensidad de la onda, nivel de intensidad sonora, decibel y fuente independiente. Amplitud, período y frecuencia se recuperan del prerrequisito con una explicación contextual, sin convertir cada recordatorio en una nueva entrada.

Cada entrada tendrá definición sencilla, explicación y al menos tres ejemplos propios. El glosario de superposición describe la operación local, pero no anticipa la cancelación completa ni la supervivencia de los dos pulsos de Predice. El de modo o vientre no entrega una fórmula con los números del cuarto modo. El de intensidad no adelanta la razón de áreas de la predicción. La revisión de fuga incluye todos los ejemplos del glosario, no solo la definición corta.

## 6. Mapa de colores

Se usan las familias existentes del kit, con una asignación fija por magnitud durante toda la unidad. Los colores agrupan dimensiones relacionadas; los nombres, unidades y símbolos distinguen magnitudes dentro de cada familia. No se cambia el color por estar en otra cuerda o por viajar en sentido contrario.

| Magnitudes | Color del kit | Uso |
|---|---|---|
| Desplazamiento transversal o longitudinal, amplitud `A` | Turquesa `i` | Marca material y curvas de desplazamiento. |
| `x`, `L`, `λ`, `k`, distancias, `r`, área `S` | Verde `d` | Posiciones, cotas y geometría. El número de onda conserva su vínculo espacial. |
| `t`, `Δt`, `T`, `f`, `ω`, `φ` | Carmín `h` | Tiempo, ritmo y fase. |
| Propagación `v` y velocidad local `u` | Naranja `o` | Flechas con identidad escrita; nunca se confunden solo por compartir color. |
| `m`, `μ`, fuerza de tensión `F`, modo `n` y cantidad de fuentes `N` | Violeta `f` | Propiedades del medio y conteos. |
| Energía `E` y potencia `P` | Naranja `o` | Energía transferida o transferida por tiempo, identificada con unidad. |
| Intensidad `I` e intensidad de referencia `I₀` | Naranja `o` | Energía por tiempo y área en el punto receptor. |
| Nivel de intensidad `β` | Carmín `h` | Valor logarítmico en dB, separado de la intensidad. |

Las curvas incidente, reflejada y transmitida de un mismo desplazamiento mantienen su color; se distinguen por nombre y trazo. Una fuerza no cambia al naranja porque su flecha apunte a la derecha. La versión oscura usa los mismos tokens del tema.

## 7. Ejemplos, práctica y comprobaciones

### 7.1. Quince ejemplos por idea

La lista fija diversidad física y dificultad; no son quince cambios de números de una misma sustitución. Cada familia tendrá entradas públicas suficientes, opción única, explicación causal y al menos un caso recalculado por otra vía antes de producir el banco.

| Idea | Cinco de nivel 1 | Cinco de nivel 2 | Cinco de nivel 3 |
|---|---|---|---|
| 1 | Clasificar transversal o longitudinal; distinguir pulso y tren repetido; rapidez desde dos posiciones y tiempos; posición futura del frente; llegada a una marca fija. | Duración del paso desde ancho y rapidez; recorrido local de un pulso positivo; recorrido con extremos sucesivos desiguales; desplazamiento y recorrido durante un tramo declarado; comparar avance del pulso y recorrido local. | Rapidez y hora de emisión con dos sensores; distancia común de dos cuerdas desde diferencia de llegada; rapidez desconocida de una señal; distancia con emisiones en instantes distintos; instante y posición de encuentro de dos pulsos de igual rapidez en una misma cuerda, sin anticipar lo que ocurre después. |
| 2 | Amplitud; longitud de onda espacial; período temporal; frecuencia desde ciclos o período; rapidez desde frecuencia y longitud de onda. | Nueva longitud de onda al cambiar ritmo; leer parámetros y obtener longitud y período; desplazamiento en un punto e instante; sentido siguiendo una fase; comparar fases entre marcas. | Reconstruir función con fase y sentido; comparar rapidez de dos ondas recuperando parámetros de funciones y registros, no solo dos cocientes; hallar un coeficiente desde registro temporal y avance; desplazamiento con fase inicial y conversiones necesarias; primer instante positivo de máximo en una marca. |
| 3 | Densidad lineal; rapidez con fuerza y densidad; fuerza necesaria; masa de un tramo; razón de rapideces al cambiar tensión. | Fuerza desde tiempo, masa y longitud; masa desde fuerza y tiempo; fuerza para cambiar el tiempo de viaje; fuerza desde frecuencia y longitud de onda; igualar rapideces de dos cuerdas. | Potencia recuperando rapidez del medio y amplitud o ritmo de un registro; energía media o transferida recuperando primero parámetros de una función y el intervalo pertinente; densidad lineal desde función y potencia; amplitud desde potencia y propiedades del medio; cambio de potencia y energía al variar fuerza con masa por longitud, amplitud y frecuencia controladas. |
| 4 | Suma de dos desplazamientos positivos; suma con signos; cancelación instantánea; tres aportes con signo; perfil resultante en tres puntos de solapamiento parcial. | Reflexión fija; reflexión libre; posición y signo después de una reflexión; regreso a un sensor; comparar el estado completo con extremo fijo y libre. | Rapidez y longitud transmitida en dos cuerdas; recuperar frecuencia y período transmitidos desde mediciones del avance y un registro espacial incidente; razón de densidades desde longitudes de onda; primera llegada por dos tramos; signo reflejado y longitud transmitida al pasar a cuerda más ligera o pesada. |
| 5 | Identificar nodos durante el ciclo; contar vientres; longitud de onda de un modo; fundamental; frecuencia de un modo dado. | Nodos interiores frente a extremos; separación entre nodos; modo a partir de frecuencia; amplitud de viajera frente a vientre; longitud vibrante con puente móvil. | Resonancias consecutivas; menor frecuencia común de dos cuerdas; recuperar tensión desde modo y masa/longitud; cambiar tramo vibrante y modo manteniendo excitación; combinar datos de dos resonancias para inferir longitud o rapidez. |
| 6 | Intensidad desde potencia y área; potencia desde intensidad; intensidad a otra distancia; nivel para una potencia exacta de diez; intensidad desde nivel. | Diferencia de niveles; suma de fuentes iguales independientes; suma de intensidades distintas; potencia de una fuente desde nivel y distancia; distinguir tono e intensidad con datos comparables. | Número entero máximo de fuentes bajo un límite matemático de nivel; dos fuentes a distancias diferentes; cambio simultáneo de cantidad de fuentes y distancia; inferir distancia desde una diferencia de niveles; separar contribución de una fuente y fondo independiente mediante intensidades. |

Esta tabla concilia el alcance con `casos-plan-ondas.md`; ese plan detalla los noventa modelos. Los cinco últimos ejemplos de cada idea combinan decisiones reales y tienen siempre cinco alternativas distintas, A–E, con cuatro errores calculados. Las familias de práctica también tendrán cinco alternativas. Los casos de potencia y energía de nivel 3 recuperan magnitudes desde el medio, una función o un registro y muestran esas etapas: no bastará entregar todos los factores de una fórmula. No se inventa dificultad con unidades raras o cuentas largas. «Primer instante» y «menor frecuencia común» eliminan soluciones múltiples. En nivel sonoro, un límite es una condición matemática del ejercicio, no consejo de salud ni una norma inventada.

### 7.2. Plantilla propia y mesas heredadas

Crear `plantillas/fis-ondas` con `TIPOS_POR_IDEA`, filtros compatibles por unidad, idea y tipo, y generadores determinísticos. Mantener `ondas` y `ondas-llegadas` como Más mesas del tema, marcadas `rehacer` para esta unidad según el alcance de cada ficha. La plantilla vieja `ondas-llegadas` no ofrece el contrato completo de filtros y Datos; no conviene modificar su generador compartido para convertirlo en práctica nueva.

| Idea | Tres familias de práctica previstas |
|---|---|
| `la-cresta-avanza` | `avance-pulso`, `recorrido-particula`, `doble-llegada` |
| `funcion-de-onda` | `leer-parametros`, `estado-local`, `fase-y-retardo` |
| `rapidez-cuerda` | `rapidez-tension`, `tension-desde-tiempo`, `potencia-cuerda` |
| `superposicion-y-fronteras` | `suma-local`, `reflexion-pulso`, `cambio-cuerda` |
| `ondas-estacionarias` | `geometria-modo`, `frecuencia-modo`, `resonancias-consecutivas` |
| `intensidad-decibeles` | `potencia-area`, `nivel-razon`, `fuentes-distancia` |

Mínimo previsto: 18 familias, 400 semillas por familia —7200 ejercicios—, 20 casos con entradas y resultados obtenidos por un cálculo independiente y ocho problemas de papel con Datos completos. Habrá al menos un papel por idea y dos adicionales de integración. El papel se genera de semillas reservadas y se comprueba contra sus enunciados visibles, no solo contra una clave almacenada. Los ejemplos y las variantes generadas no repetirán misión, Predice, ejemplos reservados ni preguntas del curso.

El par antiguo `fis-20` sigue en reserva. Se proponen hasta dos pares nuevos, también en reserva, con dos formas cada uno: uno que combine función de onda y potencia en cuerda; otro que combine potencia, distancias o fuentes independientes y nivel sonoro. Los casos exactos se reservarán y recalcularán al implementar, con cuatro opciones y errores operativos. No se reemplazan pares de otras unidades ni se altera la longitud del diagnóstico de curso. Los verificadores nuevos irán en un bloque propio aditivo.

### 7.3. Qué deberá quedar comprobado

- En teoría: 15 ejemplos por idea, Predice, Mira, regla, cada misión y 400 semillas de cada generador Resuelve/Ahora. Comprobar cada igualdad, condición, afirmación sobre el caso, opción y `siFuera` con cuentas independientes. Los redondeos llevan `≈`.
- En práctica: 400 semillas por cada una de las 18 familias; comparar todas las alternativas, errores, pasos y textos numéricos; probar filtros, unicidad por fuerza bruta, las 20 referencias y los ocho papeles.
- En física visual: coordenadas de marcas, velocidad y dirección de fase, suma punto por punto, fronteras fija/libre, continuidad y potencia de la unión, nodos y vientres durante el ciclo, identidad y orden de partículas longitudinales. Un dibujo de una incógnita no utiliza la respuesta oculta.
- En energía: integrar el flujo de trabajo y la densidad energética de forma independiente; probar intervalos suficientes sin llamarlos necesarios. No aplicar potencia viajera neta a una estacionaria.
- En interfaz: rótulos y cotas con 4 px de margen, sin cruces de textos/flechas/cuerpos, escalas invariantes, unidades legibles y ecuaciones a 390 px. Revisar capturas claras y oscuras; usar el transporte local ya documentado si el servidor HTTP sigue bloqueado, indicando exactamente su alcance.
- En integración: simular calidad 2 sin marcarla; catálogo; migración de avance completa/parcial/idempotente; preguntas de curso y papel de toda la ficha. Pruebas dirigidas durante el trabajo y una sola suite completa al cierre, ejecutada por la sesión principal.

## 8. Datos del mundo, fuentes y límites

| Fuente | Uso concreto | Límite y decisión |
|---|---|---|
| [CEPRE-UNI, guía 2026-2](https://www.cepre.uni.edu.pe/assets/archivos/comunicados/PREUNIVERSITARIO-GUIADELESTUDIANTE-2026-2.pdf), página impresa 22 | Alcance de semanas 9–10, incluida refracción en cuerdas, energía y sonido. | Confirma ese ciclo. No se infiere que un tema ausente jamás aparezca en examen. |
| [CEPRE-UNI, sílabo 2023-2](https://www.cepre.uni.edu.pe/assets/archivos/comunicados/Syl_Pre_PS_2023-2.pdf), página 16 | Antecedente histórico de la investigación. | No se presenta como vigente. |
| [UNI 2015-I](https://admision.uni.edu.pe/wp-content/uploads/2022/11/solucionario2015.pdf), Física 9 | Ejemplo oficial de interpretación de función y sentido. | Referencia de alcance; solución y figura nuevas si se incorpora. |
| [UNI 2020-I](https://admision.uni.edu.pe/wp-content/uploads/2022/11/solucionario2020.pdf), Física 14 | Evidencia directa de función más potencia media. | Sus parámetros dan `Ak = 5π/9`, demasiado grande para justificar pequeña inclinación. Se cita como pregunta publicada; el banco propio usará datos compatibles con el modelo lineal. Esta objeción es una comprobación física propia, no una corrección atribuida a la universidad. |
| [Volumen UNI 2009-II](https://admision.uni.edu.pe/wp-content/uploads/2022/11/solucionario20092.pdf), segundo parcial CEPRE, Física 2 | Diferencia de 5 dB y razón de intensidades. | Se identifica correctamente como CEPRE, no examen general. |
| [OpenStax 16.2](https://openstax.org/books/university-physics-volume-1/pages/16-2-mathematics-of-waves) y [16.3](https://openstax.org/books/university-physics-volume-1/pages/16-3-wave-speed-on-a-stretched-string) | Función, sentido, velocidad local, rapidez de cuerda y condiciones lineales. | Se reescriben explicación y ejemplos. |
| [OpenStax 16.4](https://openstax.org/books/university-physics-volume-1/pages/16-4-energy-and-power-of-a-wave) | Potencia media, energía por longitud y su interpretación. | Se distinguen promedio e instante, onda viajera y estacionaria. |
| [OpenStax 16.5](https://openstax.org/books/university-physics-volume-1/pages/16-5-interference-of-waves) y [16.6](https://openstax.org/books/university-physics-volume-1/pages/16-6-standing-waves-and-resonance) | Superposición, reflexión y modos de cuerda. | Las condiciones de cada frontera se declaran y se comprueban en código. |
| [OpenStax 17.1](https://openstax.org/books/university-physics-volume-1/pages/17-1-sound-waves), [17.2](https://openstax.org/books/university-physics-volume-1/pages/17-2-speed-of-sound) y [17.3](https://openstax.org/books/university-physics-volume-1/pages/17-3-sound-intensity) | Generación longitudinal, unos 343 m/s en aire a 20 °C, potencia/intensidad/nivel y referencia convencional. | Los 340 m/s de un ejercicio serán una aproximación declarada. `I₀ = 10⁻¹² W/m²` es una referencia convencional, no umbral universal de cada persona o frecuencia. |
| [Wittmann, Steinberg y Redish, modelo de onda](https://arxiv.org/pdf/physics/0207092) y [modelo de sonido](https://arxiv.org/pdf/physics/0207031) | Apoyo para distinguir razonamiento sobre partículas, superposición y propagación. | Estudios universitarios estadounidenses; no evidencia de prevalencia peruana. Los distractores nuevos se rotulan como hipótesis propias. |

Los valores de sogas, fuerzas, masas y potencias de los casos nuevos son datos de un modelo o de un experimento ideal descrito; no se atribuyen a una guitarra, parlante, lugar peruano o medición real sin fuente. No se inventan niveles de ruido ni tiempos de exposición seguros. El inventario UNMSM local se conserva como clasificación del proyecto: no se logró verificar un temario primario del ciclo mediante la búsqueda acotada y esa limitación no se oculta.

Se toma de la investigación la distinción materia/patrón, el objeto visible, la transición entre fotografía y registro, la necesidad de sonido y los errores de signo, suma y razones. Se corrigen su posible fuga longitudinal previa, la notación de tensión y la amplitud como supuesto control de rapidez. Doppler, tubos y pulsaciones quedan documentados como ampliaciones pendientes; no se los usa para desplazar potencia ni para prometer cobertura oficial que no se verificó. La pequeña historia de la cuerda publicada se revisará contra su fuente antes de reescribirla; no se añadirá una fecha o atribución no comprobada solo por conservar una anécdota.

## 8b. Orden con otras unidades e integración prevista

Ondas conserva a Oscilaciones como prerrequisito. Esa unidad ya declara Trabajo y energía, movimiento circular y funciones trigonométricas, de modo que no hace falta añadir un requisito redundante a la ficha. La idea 3 recuperará el significado de energía y potencia en su contexto antes de usarlos. No se modificarán fichas de otras unidades. La función de onda recupera seno, fase y MAS; superposición aprovecha signos y conservación; sonido introduce solo los logaritmos necesarios con una explicación local.

Después siguen Ondas electromagnéticas, Óptica y Física moderna en la rama. Esta unidad no enseña campos electromagnéticos, índice óptico ni leyes de rayos. El cambio de frecuencia al entrar en un medio no se afirma: la fuente mantiene la frecuencia en la unión estacionaria estudiada.

En fase 4 se tocarán solamente la ficha de Ondas en `catalogo/cursos/fisica.json`, las fichas heredadas para `rehacer`, la plantilla nueva y sus archivos propios, el glosario de esta unidad, el bloque de migración propio en `nucleo/avance.js`, los dos pares reservados y su bloque de comprobación. Se preservarán los cinco identificadores antiguos. Si estaban completos, la migración conservará «Ya estudié»; un progreso parcial no completará la idea nueva. Los estados viejos de Predice se tratarán según la huella del contrato actual y la migración será idempotente. Solo se tocará `nucleo/repaso-tipos.js` si el contrato real de la plantilla lo exige; no se cambia por rutina.

La ficha mantendrá sus seis temas existentes, añadirá la transmisión/refracción en cuerdas si hace falta para declarar cobertura y registrará semanas UNI 9 y 10. La clasificación UNMSM no cambia sin fuente primaria. Los artefactos generados de catálogo se regenerarán con la herramienta del proyecto, sin ediciones manuales ni archivos pesados. No se marcará `calidad: 2`, no se tocará el service worker ni se abrirá PR.

La entrega seguirá las fases: primero idea 1 completa, glosario y quince ejemplos, con revisión e informe; se avisará del resultado y se continuará sin esperar nuevas notas, según la autorización vigente. Después se completan las otras cinco, práctica e integración y, finalmente, simulación de calidad 2, cuentas independientes, lectura en frío, anchura, capturas y suite final. Durante fase 2 se conservan publicadas las otras ideas hasta sustituirlas en fase 3. Los resultados se informarán como ejecutados solo cuando existan.

## 9. Decisiones tomadas (Gerson revisa después)

| Duda | Opción elegida y motivo | Opción descartada |
|---|---|---|
| ¿Cinco, seis o más ideas? | Seis: conservar cinco IDs y añadir superposición antes de estacionarias. Cada idea tiene una pregunta central y cubre los objetivos publicados. | Mantener cinco cargando fronteras dentro de modos; siete u ocho con ampliaciones que desplazan el núcleo. |
| ¿Dónde enseñar energía cuantitativa? | En la idea 3, después de rapidez y antes de fronteras. Amplitud, frecuencia angular y potencia ya tienen prerrequisitos claros. | Una mención cualitativa o sumar toda la potencia de cuerda al final de decibeles. |
| ¿Doppler, tubos y pulsaciones ahora? | Reservarlos como ampliaciones justificadas: no están enumerados en el temario verificado ni publicados en la unidad actual. | Presentarlos como exigencia oficial comprobada o incorporarlos sacrificando potencia y explicación. |
| ¿Predice 1 longitudinal? | Un tiempo total de llegada distinto de la misión. Permite definir transversal y longitudinal sin responder la pregunta por adelantado. | Preguntar dirección longitudinal después de que el glosario ya la haya definido. |
| ¿Notación de tensión? | `F` sola; `T` solo período, `A` amplitud, `S` área, `v` propagación, `u` movimiento local. El motor antiguo se adapta internamente. | `T` con dos significados o un subíndice de tensión innecesario. |
| ¿Qué significa refracción en cuerdas? | Cambio de rapidez y longitud de onda al transmitirse a otra cuerda, con frecuencia conservada y unión explícita. | Inventar un ángulo de refracción en la escena unidimensional. |
| ¿Cómo limitar el modelo energético? | Pequeña inclinación, onda sinusoidal viajera y promedios identificados. Períodos completos son suficientes para calcular transferencia con la potencia media. | Decir que son los únicos intervalos válidos o atribuir energía mecánica constante a cada elemento aislado. |
| ¿Reutilizar la pieza y práctica antiguas? | Pieza propia del medio material, `ejes` para registros y adaptadores de motor; nueva plantilla con filtros por idea. Mesas antiguas conservadas como `rehacer`. | Modificar piezas compartidas, copiar el canvas o ocultar la ausencia de cobertura por idea. |
| ¿Cambiar lo publicado para simplificar la entrega? | Conservar IDs, temas, laboratorios y el par `fis-20`; añadir bloques propios y probar migración. | Borrar temas, renombrar IDs sin migración o cambiar preguntas de otras unidades. |
| ¿Cómo usar fuentes y errores? | Fuentes primarias con alcance preciso; casos propios y operaciones de error recalculadas. Separar investigación extranjera de hipótesis locales. | Copiar solucionarios, atribuir prevalencias peruanas inexistentes o presentar el sílabo 2023-2 como vigente. |

No queda un conflicto crítico identificado. Gerson podrá revisar especialmente la carga de la idea 3 y la reserva de las tres ampliaciones. Las decisiones quedan documentadas para esa revisión posterior; el diseño está listo para implementar conforme a las fases autorizadas.
