# Propuesta de ideas: Gravitación universal

Unidad: fisica.gravitacion. Curso: Física. Etapa 10. Fecha: 22 de noviembre de 2026.
Rama: codex/etapa10-fisica-gravitacion, creada desde main 94f40db7ee81125c144f8bbbe2eca328d757f8ea.
Gerson autorizó continuar con la siguiente unidad completa y subirla al repositorio; sus notas quedan para después.

No se detectó un conflicto crítico con una decisión escrita. La investigación larga de esta unidad todavía no está en main. Se usa la breve, su LEEME y la investigación compartida, contrastadas con fuentes primarias. Sus propuestas son insumos, no decisiones obligatorias.

## 0. Diagnóstico y alcance

La unidad recibida tiene cuatro ideas: cuadrado-inverso, campo-gravitatorio, orbita-circular y leyes-de-kepler. Se conservan sus ids. Faltan Lee, misiones, leyendas, ejemplos y Así se resuelve. El glosario responde predicciones, los títulos anuncian resultados y varios redondeos aparecen como igualdades exactas. La fórmula temporal de la órbita usa un período redondeado separado de la rapidez.

Hay una afirmación física falsa que se corrige: «Con otra rapidez la órbita es una elipse, también cerrada». El estado puede permitir escape o hacer que la trayectoria interseque el planeta. La nueva unidad distingue el modelo circular, el movimiento elíptico exterior y el lanzamiento radial de escape.

La ficha exige gravitación, campo, altura y Kepler. La escena y su papel ya incluyen energía orbital y escape, y la investigación breve también los propone. Se les da espacio explícito en la teoría: se añaden los temas Energía gravitatoria y Rapidez de escape y el requisito fisica.trabajo-y-energia. No se afirma que esos temas tengan una frecuencia de admisión verificada. El par fis-21 del curso ya pregunta por el peso en otro planeta; los pares nuevos evitarán repetirlo.

Modelo de tono y profundidad: Trabajo y energía, la unidad anterior de Mecánica que tiene calidad 2, con sus informes de auditoría y lectura en frío. Impulso y choques fue completada en otra rama, pero todavía no se toma como una unidad auditada.

## 1. Ideas en orden

| Orden | Id | Título | Frase de aprendizaje |
| --- | --- | --- | --- |
| 1 | cuadrado-inverso | Ley de gravitación universal | Calculas la atracción entre cuerpos y distingues el efecto de cada masa y de la distancia entre centros. |
| 2 | campo-gravitatorio | Campo gravitatorio y altura | Separas el campo del lugar de la masa del objeto y mides la altura desde la superficie adecuada. |
| 3 | energia-gravitatoria | Energía gravitatoria | Comparas posiciones mediante energía, declarando el cero en el infinito y conservando los signos. |
| 4 | orbita-circular | Órbitas circulares | La gravedad aporta la aceleración centrípeta; radio, rapidez y período deben corresponder al mismo modelo. |
| 5 | leyes-de-kepler | Leyes de Kepler | Distingues forma, áreas y período de una órbita; comparas períodos con el semieje mayor y la misma fuente. |
| 6 | escape | Rapidez de escape | Hallas el umbral energético de una salida radial hacia afuera, sin aire ni propulsión posterior. |

Se amplía de cuatro a seis ideas. La migración conserva «Ya la estudié» para quien completó las cuatro anteriores, deja pendientes las nuevas y renueva una vez las predicciones antiguas sin huella. No se marca calidad 2.

El campo interno de planetas, la relatividad, las transferencias orbitales, la dinámica de masas comparables y la deducción por cálculo integral quedan fuera. La forma elíptica se introduce dentro de Kepler antes de emplear sus áreas o su semieje; no se exige conocer cónicas de otra unidad.

## 2. Primera pantalla y objeto

| Idea | Objeto reconocible | Qué se verá junto |
| --- | --- | --- |
| 1 | Un planeta y un satélite con paneles solares. | Ensayo de referencia y ensayo con otra separación; cotas entre centros. |
| 2 | Una sonda a cierta altura de un planeta. | Radio, altura y separación central; dos masas de prueba en el mismo lugar. |
| 3 | Una sonda en dos posiciones exteriores. | Las dos distancias y sus indicadores de energía, con el cero declarado. |
| 4 | Un satélite junto a un planeta. | Dirección tangente de velocidad y dirección radial de la gravedad. |
| 5 | Una órbita elíptica con el astro en un foco. | Sectores barridos desde ese foco, posiciones en intervalos iguales y forma de referencia. |
| 6 | Una sonda lanzada radialmente hacia afuera. | Estado inicial, referencia de energía y trayectoria radial esquemática. |

Se crea la pieza propia fis-gravitacion: planetas y satélites de prueba, cotas, flechas y sectores. Es pura, de ancho 320, y expone su geometría para comprobar márgenes y colisiones de rótulos. Las unidades y números los calcula quien llama. Los dibujos que no representan distancias a escala lo dicen; ninguna figura previa al resuelto muestra la incógnita calculada.

## 3. Misiones y modelos

Los parámetros son modelos didácticos explícitos; no mediciones de satélites reales. Cada escena declara sus propios parámetros. No se mezclan constantes de dos planetas ni se redondean entradas internas antes de calcular.

| Idea | Misión | Cambia | Fijo y testigo calculado |
| --- | --- | --- | --- |
| 1 | Haz que la fuerza sea la cuarta parte de la referencia. | Separación, con factores 1; 1,5; 2; 2,5; 3 respecto de la referencia. | G=6,67×10⁻¹¹ N·m²/kg², M=6×10²⁴ kg, m=600 kg y referencia a 12 000 km. Testigo: factor 2. |
| 2 | Consigue una fuerza gravitatoria de 250 N. | Masa de la sonda: 20, 40, 60 u 80 kg. | GM=4×10¹⁴ m³/s² y r=8000 km; g=6,25 N/kg. Testigo: 40 kg. |
| 3 | Ubica la sonda donde su energía potencial sea −10 GJ. | Distancia central: 8000, 12 000, 16 000 o 20 000 km. | GM=4×10¹⁴ m³/s², masa 400 kg y referencia cero en el infinito. Testigo: 16 000 km. |
| 4 | Haz coincidir la aceleración necesaria para girar con la que produce la gravedad. | Rapidez tangente: 2, 4, 5 o 6 km/s; reloj cuando corresponde la circular. | GM=4×10¹⁴ m³/s² y radio 16 000 km. Testigo: 5 km/s. |
| 5 | Haz que el sector sombreado cubra la quinta parte del área orbital. | Duración de 1 a 5 h y posición inicial del intervalo. | Otra órbita didáctica: a=10 000 km, e=0,6, período 20 h y radio planetario 2000 km. Testigo: duración 4 h. |
| 6 | Busca la menor rapidez que permite alejarse sin regresar. | Rapidez radial inicial: 6, 8, 9, 10 u 11 km/s. | GM=4×10¹⁴ m³/s², radio inicial 8000 km, sin aire ni empuje posterior. Testigo: 10 km/s. |

La misión de campo corrige un defecto de la breve: con radio fijo, variar la masa no permite alcanzar un cociente F/m diferente. La misión nueva pide fuerza, que sí cambia. En la misión circular no se dibuja un círculo para cualquier rapidez: el estado fuera de equilibrio muestra el instante de lanzamiento; la animación circular se habilita únicamente con la condición física correcta.

En Kepler el avance temporal se calcula mediante la ecuación de Kepler, no mediante ángulos iguales en tiempos iguales. El dibujo aproxima sectores con suficientes puntos; su comprobación física usa el área analítica desde el foco. La órbita es didáctica, no la forma a escala de la terrestre. Su GM se deriva de a y T; no se toma del modelo de otra escena.

Los seis testigos y las respuestas de Predice se recalcularon en un script temporal independiente antes de redactar esta propuesta. La implementación añadirá los barridos de controles y las pruebas permanentes.

## 4. Predicciones reservadas y errores

| Idea | Caso reservado | Resultado calculado y operaciones erróneas |
| --- | --- | --- |
| 1 | Una fuerza de referencia de 160 N; se duplica M, triplica m y duplica r. El juego solo cambió r. | 240 N. Errores: 480 N al dividir por r una vez; 960 N al omitir la distancia; 40 N al omitir las masas. |
| 2 | Otro planeta tiene g superficial de 18 N/kg; la sonda está a altura 2R. | 2 N/kg. Errores: 4,5 al usar h; 6 al dividir por la separación sin elevarla; 18 al mantener el campo superficial. |
| 3 | Una sonda de 300 kg pasa de 10 000 a 20 000 km, con GM=4×10¹⁴ m³/s². Se pregunta el cambio de energía. | +6 GJ. Errores de orden de resta, signo y conservación indebida del valor inicial. |
| 4 | Dos órbitas circulares exteriores alrededor del mismo astro: la segunda tiene cuatro veces el radio; la primera rapidez es 8 km/s. | 4 km/s. Errores: proporcionalidad directa, ausencia de cambio y omisión de raíz. |
| 5 | Alrededor de la misma fuente dominante: período A de 3 años y semieje de 2 UA; B tiene semieje de 8 UA. | 24 años. Errores: 12 por relación lineal, 6 por raíz simple y 48 por cuadrado. |
| 6 | La rapidez de escape desde R es 10 km/s. Se lanza radialmente hacia afuera desde 4R. | 5 km/s. Errores: 10 sin cambio, 2,5 por inversa lineal y 20 por proporcionalidad directa de raíz. |

Los Datos de Predice dan valores, equivalencias y condiciones, nunca la fórmula que se predice. Los glosarios y juegos no usan esos mismos casos ni anuncian su resultado. Cada opción y cada siFuera se calcularán, con una única correcta comprobada por fuerza bruta.

NGCI documenta dificultades con la distancia desde la superficie, la potencia de la distancia y la gravedad que supuestamente termina en el espacio. Eso no convierte las alternativas numéricas propias en ítems validados ni da una frecuencia peruana. Cada operación nueva se registrará como hipótesis de diseño; se distinguirá el respaldo del constructo del respaldo de la formulación exacta.

## 5. Letras y colores

| Símbolo | Significado en esta unidad | Color |
| --- | --- | --- |
| M, m y masas con subíndice | Masa de la fuente y del cuerpo señalado. | Violeta f. |
| r, R, h | Separación entre centros, radio planetario y altura sobre su superficie. | Turquesa i, siempre con su propio rótulo. |
| F, F⃗ y F_x | Módulo, vector y componente de fuerza gravitatoria. | Carmín h. |
| v, v⃗, v_esc y v_inf | Rapidez, velocidad, rapidez mínima de escape y rapidez límite lejana. | Naranja o. |
| t, Δt, T | Instante, duración y período orbital. | Verde d. |
| g, g⃗ y g_x | Módulo, vector y componente del campo gravitatorio. | Tinta. |
| E_PG, E_C, E_M | Energías potencial gravitatoria, cinética y mecánica. | Tinta; etiquetas completas. |
| W_g | Trabajo de la gravedad. | Tinta. |
| G | Constante de gravitación; se distingue de g. | Tinta. |
| a, b | Semiejes mayor y menor de la elipse, ambos longitudes. | Turquesa i. |
| e | Excentricidad geométrica, sin unidad y entre cero y uno para la elipse. | Tinta. |
| A, A_total | Área barrida y área total de la elipse. | Tinta. |
| r_p, r_a, v_p, v_a | Distancias y rapideces en los extremos cercano y lejano. | Según distancia o rapidez. |

La aceleración centrípeta se escribe como v²/r o se nombra con palabras; no se usa a como aceleración y semieje a la vez. No se introduce otro símbolo para potencial por kilogramo. GM es el producto de G y M, que puede darse directamente. Los factores de comparación se definen en cada caso. Se mantiene la notación energética de Trabajo y energía.

Cada magnitud mantiene su color en texto, dibujo, controles, ecuación y respuesta. Las referencias y magnitudes en tinta se distinguen con sus símbolos y unidades. La incógnita de la figura va con interrogación hasta resolver, sin colorear una alternativa como correcta.

## 6. Ejemplos y práctica

Cada idea tendrá quince ejemplos: cinco directos; cinco con conversiones, referencia o despeje; cinco de examen que combinen decisiones y pasos. Las alternativas de examen repartirán las letras A–E. Resuelve y Ahora tú usarán familias comparables con entradas distintas, al menos tres enunciados y 400 semillas por generador; no repetirán misión, predicción o ejemplos.

| Idea | Familias previstas de práctica |
| --- | --- |
| Ley universal | Fuerza directa con unidades; factores de masa y distancia; despeje o suma de contribuciones. |
| Campo y altura | Campo y peso; r=R+h y razones; dos fuentes y campo neto en una recta. |
| Energía gravitatoria | Valor con referencia; cambio y trabajo; conservación entre posiciones exteriores. |
| Circular | Rapidez; período y unidades; deducción de radio o masa central. |
| Kepler | Forma y extremos; área y duración; período y semieje con la misma fuente. |
| Escape | Umbral; comparación de radios/planetas; energía residual o retorno radial. |

Se creará fis-gravitacion con TIPOS_POR_IDEA, casos calculados aparte y papel con Datos. Las plantillas anteriores gravitacion y dinamica-fuerzas quedarán como mesas adicionales para esta unidad; la segunda es compartida y su marca rehacer se limitará a fisica.gravitacion. Se añadirán hasta dos pares A/B a la reserva del curso, sin cambiar sus diez pares activos.

## 7. Datos del mundo y fuentes

La mayoría de los números serán parámetros de planetas ideales declarados. Una aplicación terrestre puede usar GM≈3,9860×10¹⁴ m³/s² y radio medio 6371 km, con fuente NASA. Una órbita circular didáctica a 700 km no se presenta como telemetría de PerúSAT-1. Las referencias históricas de CONIDA y Congreso discrepan entre 702,5 y 694 km; se descarta usar una de ellas como altura actual exacta.

Fuentes contrastadas el 22 de noviembre de 2026:

- OpenStax: [ley universal](https://openstax.org/books/university-physics-volume-1/pages/13-1-newtons-law-of-universal-gravitation), [campo](https://openstax.org/books/university-physics-volume-1/pages/13-2-gravitation-near-earths-surface), [energía](https://openstax.org/books/university-physics-volume-1/pages/13-3-gravitational-potential-energy-and-total-energy), [órbitas](https://openstax.org/books/university-physics-volume-1/pages/13-4-satellite-orbits-and-energy) y [Kepler](https://openstax.org/books/university-physics-volume-1/pages/13-5-keplers-laws-of-planetary-motion). Se verifican condiciones; no se copian problemas ni figuras.
- [NASA Earth Fact Sheet](https://nssdc.gsfc.nasa.gov/planetary/factsheet/earthfact.html): parámetros terrestres; radio medio y ecuatorial no se mezclan.
- [NIST, CODATA 2022, mayo de 2024](https://physics.nist.gov/cuu/pdf/wall_2022.pdf): G es una constante medida, no exacta. En ejercicios se dará el valor aproximado elegido.
- [Williamson, Willoughby y Prather, 2013](https://istardb.org/wp-content/uploads/tainacan-items/1018/17957/Williamson-et-al_2013_Development-of-the-Newtonian-Gravity-Concept-Inventory-1.pdf): dificultades sobre masas, distancia, gravedad y atmósfera. No se trasladan porcentajes a postulantes peruanos.

## 8. Orden con otras unidades

Se conservan Dinámica y Movimiento circular como requisitos y se añade Trabajo y energía. Las fórmulas previas necesarias vuelven a estar en Datos. No se necesita la nueva versión de Impulso y choques para cargar o entender esta rama. La elipse se presenta aquí mediante foco, semiejes y extremos; no se presupone el curso de cónicas. Las fórmulas de escape usan energía ya presentada, no nociones de combustible o propulsión.

## 9. Decisiones tomadas (Gerson revisa después)

| Duda | Opción elegida y motivo | Opción descartada |
| --- | --- | --- |
| ¿Cuántas ideas? | Seis, con energía antes de circular y escape al final; separa los bloques más cargados de la breve. | Tres ideas sobrecargadas o dejar energía/escape solo en ejercicios antiguos. |
| ¿Una idea aparte de elipses? | Presentar forma, áreas y período juntos en Kepler, con límites claros y ejemplos progresivos. | Una séptima idea o eliminar el tratamiento explícito de energía. |
| ¿Qué misión de campo? | Alcanzar una fuerza cambiando masa a radio fijo: tiene un testigo único. | Cambiar F/m con ese mismo control: sería constante y la misión no funcionaría. |
| ¿Cómo animar la órbita? | Movimiento circular solo cuando la rapidez cumple la condición; Kepler con tiempo físico, no ángulo uniforme. | Dibujar cualquier rapidez como un círculo o afirmar que siempre produce una elipse cerrada. |
| ¿Qué constantes usar? | Modelos didácticos explícitos y una aplicación NASA separada; calcular siempre desde los mismos datos. | Mezclar g0, R, GM y períodos redondeados de modelos distintos. |
| ¿Qué conservar de la evidencia? | Dificultades documentadas como contexto y operaciones nuevas como hipótesis verificables. | Presentar distractores propios como diagnósticos validados o inventar frecuencia de admisión. |
