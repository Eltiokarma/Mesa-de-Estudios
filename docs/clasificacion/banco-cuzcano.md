# El banco Cuzcano: qué trae y qué unidades cubre

13 de noviembre de 2026. Lectura del banco de ejercicios que está en la rama `banco/cuzcano` (carpeta `contenido/ejercicios/cuzcano/`), hecha para entender mejor los temas antes de construir el formato nuevo (`docs/pogil-v2-rive.md`, sección 0). Segunda versión: ya con los subtemas unificados y cada tema asignado a sus unidades, a pedido de Gerson.

## Qué es

- **12 361 fichas** de **125 libros**, todas de la Editorial Cuzcano, en 7 cursos y 123 temas. Razonamiento verbal no tiene ninguna.
- Cada ficha trae el enunciado, la respuesta, una **solución propia con pasos** y una figura propia en SVG (hay 12 351, unos 39 MB).
- **Estado:** todas están como `crudo`. 10 339 figuran verificadas y 2 064 están marcadas para revisar antes de integrar.
- La rama no se publica: Vercel la excluye mientras la app no la lea.

## La regla 5 aplicada a este banco

**Las 12 361 fichas vienen de libros de academia; ninguna es de un examen oficial.** Sus enunciados están cotejados con el escaneo, o sea que son los del libro. Por la regla 5 de `CLAUDE.md`:

- **Los enunciados no van al producto.** Sirven para saber qué se pregunta y cómo, y para alimentar generadores propios que los repliquen con otros números y otra redacción.
- **Lo que sí es nuestro** son las soluciones con pasos y las figuras, que el banco marca como propias. Sirven de base para los ejemplos que se completan (ruta «seguir un ejemplo»), siempre sobre un problema generado.
- **Lo que se cita tal cual** son las preguntas de examen oficial, y esas están en otro lado: la clasificación de San Marcos de `docs/clasificacion-unmsm-admision.md`.

## Cómo quedaron los subtemas y las unidades

| | Antes | Ahora |
| --- | --- | --- |
| Etiquetas de subtema distintas | 3 357 | 1 004 subtemas, entre 1 y 14 por tema |
| Fichas sin subtema | 1 642 | 0 |
| Temas con unidad asignada | 1 de 123 | 123 de 123 (por subtema) |
| Fichas con `unidad` | 23 | 11 467 |
| Unidades del catálogo con fichas | 108 de 152 (estimado por el nombre del tema) | 128 de 152 |

Cómo se hizo:

- Un agente por curso leyó las etiquetas (y, donde no había, el título de la ficha) y armó un vocabulario corto por tema, apoyado en los subtemas del sílabo del catálogo. Cada subtema lleva la unidad donde un alumno lo estudiaría, aunque sea de otro tema o de otro curso.
- **Las etiquetas que juntaban 40 fichas o más** (por ejemplo «operaciones y cardinalidad», con las 100 de conjuntos) se repartieron ficha por ficha leyendo el enunciado. Son 2 824 asignaciones por ficha en total, contando las que no traían etiqueta.
- Todo está en la rama `banco/cuzcano`: el vocabulario en `subtemas.json`, la unidad principal de cada tema en `temas.json` y la herramienta en `herramientas/unificar-subtemas.js`. En cada ficha, `banco.subtema` es el nombre unificado y `banco.subtema_fuente` guarda la etiqueta de origen. La importación lo aplica sola, así que volver a importar no lo deshace. Las pruebas de esa rama pasan.

Lo que hay que saber:

- **La clasificó un modelo, no una persona.** Se hizo sobre etiquetas y títulos, y solo se leyeron enunciados en las etiquetas grandes. Nadie la revisó ficha por ficha. En «Otros» quedaron 51 fichas.
- **Las 894 fichas de otro curso ya tienen `unidad` (14 nov).** Su subtema pertenece a una unidad de otro curso (casi todas son de razonamiento matemático que en el catálogo viven en aritmética o geometría). Un modelo leyó el enunciado y la solución de cada una: **815 correctas, 32 incorrectas y 47 dudosas**. Las incorrectas tomaron la unidad del modelo; las dudosas, la alternativa del modelo, marcadas `por-revisar`. Todas llevan `banco.revision_unidad` con `por: modelo` hasta que las mire una persona (`revision-unidades.json` en la rama). Gerson decidió que el validador acepte una unidad de otro curso: `curso` es el del libro y `unidad`, donde se estudia. Lo que se vio al revisar:
  - Probabilidades (100 de 100), mezclas (26 de 26), productos notables (12 de 12) y cónicas (93 de 96) estaban bien.
  - Estaban mal dos subtemas enteros, y se corrigieron en `subtemas.json`: «Series telescópicas» va a álgebra · sucesiones y series, y «Sucesiones literales» a razonamiento matemático · razonamiento inductivo.
  - El bloque con más errores es «Razonamiento geométrico» de RM: el subtema del libro no sirve para elegir la unidad. Ahí caen lúnulas y sectores (van a áreas circulares), caza de ángulos en triángulos y problemas de congruencia o del teorema de la bisectriz.
  - 652 de las 894 no tienen unidad razonable en su propio curso: RM no tiene unidades de conteo, probabilidades, fracciones, porcentajes, series ni mezclas.
- **Edades y móviles (100 fichas) quedan en los dos cursos:** principal en razonamiento matemático · planteo de ecuaciones, y en `unidades_tambien`, aritmética · razonamiento numérico.

## Cobertura por curso

Cuenta las fichas que van a unidades de cada curso, vengan del tema que vengan.

| Curso | Fichas del banco en el curso | Fichas que van a sus unidades | Unidades con fichas |
| --- | --- | --- | --- |
| Física | 2 440 | 2 468 | 20 de 20 |
| Química | 1 720 | 1 713 | 19 de 20 |
| Aritmética | 1 900 | 2 634 | 18 de 19 |
| Álgebra | 1 205 | 1 225 | 18 de 19 |
| Geometría | 1 948 | 1 756 | 18 de 18 |
| Trigonometría | 1 787 | 2 015 | 18 de 19 |
| Razonamiento matemático | 1 361 | 550 | 17 de 19 |
| Razonamiento verbal | 0 | 0 | 0 de 18 |
| **Total** | **12 361** | **12 361** | **128 de 152** |

## Unidades sin fichas: las que hay que investigar

Son 24. Para ellas el banco no trae nada y los ejercicios tienen que salir de otro lado: los exámenes oficiales ya clasificados, los generadores que ya existen o material nuevo.

- **Química (1):** Materia y energía.
- **Aritmética (1):** Las cuatro operaciones.
- **Álgebra (1):** Lógica, conjuntos y juegos lógicos.
- **Trigonometría (1):** Reducción al primer cuadrante.
- **Razonamiento matemático (2):** Trazos de figuras y perímetros; Movimiento y comparación de figuras.
- **Razonamiento verbal (18):** Definiciones; Analogías; Precisión léxica y sentido contextual; Conectores lógico-textuales; Eliminación de oraciones; Plan de redacción; Cohesión y coherencia textual; El texto y sus tipos; Tema central e idea principal; Resumen y síntesis; Textos discontinuos e infografías; Inferencias; Compatibilidad e incompatibilidad; Extrapolación y lectura crítica; Textos argumentativos, dialécticos y debate; Texto y contexto; Textos filosóficos y científicos; Lectura en inglés.

Dos de ellas tienen explicación: «Lógica, conjuntos y juegos lógicos» de álgebra se cubre con las fichas de lógica y de conjuntos de aritmética, que son el mismo contenido; y «Reducción al primer cuadrante» de trigonometría no aparece como subtema propio porque el banco la mezcla dentro de ángulos en posición normal.

**Unidades con menos de 10 fichas** (también conviene buscarles material):

| Curso | Unidad | Fichas |
| --- | --- | --- |
| Razonamiento matemático | Tablas, gráficos y suficiencia de datos | 1 |
| Razonamiento matemático | Cortes, pesadas y balanzas | 2 |
| Química | Contaminación ambiental y química aplicada | 3 |
| Razonamiento matemático | Elementos recreativos | 4 |
| Química | Petróleo y recursos naturales | 5 |
| Razonamiento matemático | Verdades y mentiras | 5 |
| Razonamiento matemático | Traslados y puntos cardinales | 5 |
| Razonamiento matemático | Frecuencia de sucesos | 5 |
| Razonamiento matemático | Arreglos numéricos y cuadrados mágicos | 7 |
| Química | Biomoléculas y productos naturales | 8 |
| Razonamiento matemático | Rutas y visualización espacial | 8 |
| Geometría | Razonamiento con figuras | 9 |

## Fichas por unidad, con sus subtemas principales

Los cinco subtemas con más fichas de cada unidad. Es el mapa de qué tipo de problema pregunta el banco en cada una.


### Física

| # | Unidad | Fichas | Subtemas con más fichas |
| --- | --- | --- | --- |
| 1 | Magnitudes y vectores | 151 | Principio de homogeneidad dimensional (24); Suma de vectores por método gráfico (24); Resultante de dos vectores (15); Magnitudes fundamentales y derivadas (14); Producto escalar y vectorial (13) |
| 2 | MRU, MRUV y caída libre | 250 | Caída libre (54); Encuentros y alcances (38); Velocidad relativa (27); MRUV (23); MRU (21) |
| 3 | Movimiento parabólico y circular | 127 | Tiro parabólico (29); Movimiento en dos dimensiones (19); MCUV (18); Aceleración tangencial y centrípeta (13); Magnitudes angulares (11) |
| 4 | Estática: equilibrio y torque | 120 | Equilibrio de una partícula (38); Equilibrio del cuerpo rígido (37); Rozamiento estático y cinético (12); Equilibrio con poleas (10); Diagrama de cuerpo libre (8) |
| 5 | Dinámica | 82 | Dinámica circular (26); Rozamiento en movimiento (18); Bloques, poleas y planos inclinados (12); Peso aparente y sistemas acelerados (9); Movimiento relativo y sistemas inerciales (9) |
| 6 | Gravitación universal | 53 | Leyes de Kepler (20); Campo gravitatorio (13); Satélites y órbitas circulares (9); Ley de gravitación universal (5); Energía gravitatoria y velocidad de escape (4) |
| 7 | Trabajo, energía y potencia | 74 | Trabajo de fuerzas constantes y variables (23); Conservación de la energía mecánica (18); Teorema trabajo-energía cinética (10); Energía con fuerzas no conservativas (7); Potencia y eficiencia (6) |
| 8 | Impulso, cantidad de movimiento y choques | 125 | Impulso y fuerza media (30); Impulso de fuerzas variables (21); Conservación de la cantidad de movimiento (18); Centro de masa (16); Choques elásticos e inelásticos (15) |
| 9 | Movimiento armónico simple | 73 | Ecuaciones y gráficas del MAS (27); Péndulo simple (13); Energía en el MAS (13); Masa-resorte horizontal y vertical (11); Sistemas oscilantes compuestos (9) |
| 10 | Ondas mecánicas y sonido | 71 | Función de onda (22); Ondas estacionarias (11); Intensidad y nivel de intensidad sonora (9); Reflexión y transmisión de ondas (7); Energía transportada por una onda (7) |
| 11 | Fluidos | 219 | Principio de Arquímedes (42); Flotación (27); Bernoulli y Torricelli (27); Presión hidrostática y atmosférica (22); Caudal y continuidad (22) |
| 12 | Temperatura y calor | 171 | Dilatación (38); Calorimetría (33); Cambios de fase y calor latente (32); Conducción, convección y radiación (25); Calor específico y capacidad calorífica (18) |
| 13 | Termodinámica | 120 | Máquinas térmicas y ciclo de Carnot (26); Procesos y diagrama P-V (22); Primera ley (22); Gases ideales y ecuación de estado (18); Procesos adiabáticos (13) |
| 14 | Electrostática | 206 | Energía potencial y potencial eléctrico (33); Ley de Coulomb (29); Campo eléctrico y líneas de fuerza (19); Redes de condensadores con puentes (17); Carga en campo uniforme (16) |
| 15 | Corriente eléctrica y circuitos | 156 | Resistencia, resistividad y ley de Ohm (29); Resistencias en serie y en paralelo (21); Puentes, simetrías y redes infinitas (20); Intensidad y densidad de corriente (19); Fuerza electromotriz (19) |
| 16 | Campo y fuerza magnética | 61 | Fuerza magnética sobre una carga (22); Campo magnético de corrientes (17); Fuerza sobre un conductor (17); Fuerza entre cables paralelos (5) |
| 17 | Inducción electromagnética | 87 | Transformador (16); Flujo magnético (15); Ley de Faraday (14); Corriente alterna y valores eficaces (14); Ley de Lenz (11) |
| 18 | Ondas electromagnéticas | 69 | Características de las ondas electromagnéticas (13); Campos y ecuación de la onda (13); Rapidez de la luz (13); Espectro electromagnético (12); Interferencia, difracción y polarización (11) |
| 19 | Óptica geométrica | 128 | Espejos planos (30); Espejos esféricos (29); Lentes delgadas (26); Refracción y ley de Snell (24); Ecuación del fabricante de lentes (11) |
| 20 | Física moderna | 125 | Efecto fotoeléctrico (27); Rayos X (22); Fotones: potencia e intensidad (18); Modelo de Bohr y espectros atómicos (13); Efecto Compton (11) |

### Química

| # | Unidad | Fichas | Subtemas con más fichas |
| --- | --- | --- | --- |
| 1 | Materia y energía | 0 | — |
| 2 | Estructura atómica | 72 | Modelo de Bohr y espectros atómicos (20); Modelos atómicos de Dalton a Bohr (11); Núclidos e isótopos (10); Iones y especies isoelectrónicas (10); Configuración electrónica de átomos e iones (8) |
| 3 | Tabla periódica | 101 | Ubicación de un elemento (18); Periodos, grupos y bloques (17); Tendencias periódicas (15); Metales, no metales y semimetales (14); Energía de ionización y afinidad electrónica (11) |
| 4 | Enlace químico y fuerzas intermoleculares | 155 | Enlace iónico (27); Hibridación y geometría molecular (23); Fuerzas intermoleculares (21); Tipos de enlace y propiedades (18); Polaridad (15) |
| 5 | Nomenclatura inorgánica | 122 | Estados de oxidación (23); Óxidos, peróxidos e hidruros (23); Sales oxisales y haloideas (15); Funciones inorgánicas (14); Nomenclatura de iones (12) |
| 6 | Mol, masa molar y composición | 115 | Número de Avogadro y mol (50); Relaciones molares en una fórmula (32); Composición centesimal (12); Fórmula empírica y molecular (12); Masa atómica promedio (6) |
| 7 | Reacciones químicas y balance | 116 | Balance redox por ion-electrón (43); Clasificación de las reacciones (28); Oxidación, reducción y agentes (17); Balance por tanteo (14); Termoquímica (8) |
| 8 | Estequiometría | 92 | Reactivos impuros (23); Reactivo limitante y en exceso (21); Rendimiento de una reacción (17); Equivalente químico y masa equivalente (16); Relaciones masa-masa, mol-mol y volumen-volumen (12) |
| 9 | Estado gaseoso | 190 | Mezclas: Dalton y Amagat (42); Leyes de Boyle, Charles y Gay-Lussac (29); Ecuación de estado (28); Densidad y masa molar de gases (23); Estequiometría con gases (18) |
| 10 | Líquidos, sólidos y cambios de estado | 23 | Gases húmedos y humedad relativa (23) |
| 11 | Soluciones y coloides | 151 | Estequiometría en soluciones (29); Solubilidad y curvas de solubilidad (27); Dilución y mezcla de soluciones (22); Sistemas dispersos: soluciones, coloides y suspensiones (21); Conversión entre unidades de concentración (20) |
| 12 | Cinética química | 21 | Velocidad y orden de reacción (13); Factores que afectan la velocidad (5); Perfil de energía de una reacción (3) |
| 13 | Equilibrio químico | 128 | Kc y Kp (28); Composición en el equilibrio (26); Principio de Le Chatelier (22); Reacciones reversibles y equilibrio dinámico (19); Equilibrio heterogéneo (15) |
| 14 | Ácidos y bases | 152 | Ka, Kb y Kw (42); pH y pOH (34); Neutralización y titulación (29); Teorías de Arrhenius, Brønsted-Lowry y Lewis (19); Pares conjugados y fuerza relativa (13) |
| 15 | Electroquímica | 150 | Leyes de Faraday (37); Semirreacciones y potenciales de reducción (33); Electrólisis (24); Celdas galvánicas y fem (23); Ecuación de Nernst (17) |
| 16 | Química orgánica: hidrocarburos | 76 | El carbono e hibridación (14); Isomería estructural y geométrica (14); Tipos de fórmulas y cadenas (12); Alcanos, alquenos y alquinos (12); Nomenclatura de hidrocarburos (11) |
| 17 | Funciones orgánicas oxigenadas y nitrogenadas | 33 | Nomenclatura de compuestos monofuncionales (21); Grupos funcionales (12) |
| 18 | Biomoléculas y productos naturales | 8 | Carbohidratos (8) |
| 19 | Petróleo y recursos naturales | 5 | Petróleo y combustión (5) |
| 20 | Contaminación ambiental y química aplicada | 3 | Corrosión (3) |

### Aritmética

| # | Unidad | Fichas | Subtemas con más fichas |
| --- | --- | --- | --- |
| 1 | Lógica proposicional | 103 | Valores de verdad (29); Leyes lógicas (19); Inferencia lógica (13); Tablas de verdad (10); Operadores lógicos definidos (8) |
| 2 | Conjuntos | 105 | Diagramas de Venn con tres conjuntos (34); Diagramas de Venn con dos conjuntos (11); Leyes del álgebra de conjuntos (10); Diagramas de Carroll (10); Producto cartesiano (9) |
| 3 | Razones y proporciones | 91 | Serie de razones geométricas equivalentes (34); Proporciones continuas (21); Razón aritmética y geométrica (16); Proporciones aritméticas y geométricas (14); Medias aritmética, geométrica y armónica (6) |
| 4 | Magnitudes proporcionales y reparto | 370 | Magnitudes directa e inversamente proporcionales (51); Obras con retiros y refuerzos (33); Reparto directo (32); Obras con cambios de personal (27); Proporcionalidad compuesta (24) |
| 5 | Tanto por ciento y operaciones comerciales | 177 | Variación porcentual (41); Ganancia y pérdida (32); Precios de costo, lista y venta (24); Aumentos y descuentos sucesivos (22); Porcentajes de grupos y subgrupos (17) |
| 6 | Interés y descuento | 200 | Varios capitales a distintas tasas (33); Descuento comercial y racional (24); Interés y monto simple (23); Capital, tasa y tiempo (23); Valor actual y valor nominal (15) |
| 7 | Mezclas y aleaciones | 145 | Aleaciones, ley y quilates (36); Precio medio (30); Mezclas alcohólicas y concentración (30); Mezclas y reemplazos (29); Dilución y extracciones sucesivas (20) |
| 8 | Estadística descriptiva | 100 | Tablas de frecuencias (23); Media aritmética (18); Mediana y moda (18); Medidas de dispersión (13); Interpolación y percentiles (10) |
| 9 | Análisis combinatorio | 131 | Combinaciones y números combinatorios (34); Principios de adición y multiplicación (23); Variaciones (15); Permutaciones lineales y circulares (15); Permutaciones con repetición (11) |
| 10 | Probabilidades | 131 | Extracciones con y sin reposición (23); Probabilidad clásica y frecuencial (17); Eventos y álgebra de eventos (17); Probabilidad con técnicas de conteo (15); Eventos independientes (14) |
| 11 | Sistemas de numeración | 244 | Base desconocida (37); Conteo en otras bases (34); Conteo de números (28); Conteo de cifras (26); Descomposición polinómica (23) |
| 12 | Las cuatro operaciones | 0 | — |
| 13 | Divisibilidad | 131 | Criterios de divisibilidad (44); Ecuaciones diofánticas (19); Restos potenciales (18); Conteo de múltiplos (13); Cifras terminales (12) |
| 14 | Números primos y divisores | 100 | Cantidad de divisores (31); Divisores que cumplen una condición (16); Numerales con cantidad de divisores dada (16); Suma y producto de divisores (12); Primos y compuestos (7) |
| 15 | MCD y MCM | 104 | Relación entre MCD y MCM (32); MCD y MCM por descomposición canónica (18); Algoritmo de Euclides (16); Aplicaciones del MCD y MCM (13); MCD y MCM con cifras desconocidas (12) |
| 16 | Números racionales, fracciones y decimales | 157 | Decimales exactos y periódicos (37); Fracción de una cantidad (22); Fracciones equivalentes e irreducibles (17); Problemas con fracciones (15); Caños y tanques (15) |
| 17 | Potenciación y radicación | 100 | Criterios de inclusión y exclusión (37); Raíz cuadrada y cúbica entera (28); Cuadrados perfectos (21); Cubos perfectos (8); Potencias perfectas (6) |
| 18 | Sucesiones y series numéricas | 211 | Serie aritmética (26); Progresión aritmética (24); Sumas notables (23); Sucesiones de orden superior (22); Serie geométrica (18) |
| 19 | Problemas de razonamiento numérico | 34 | Criptoaritmética (16); Método regresivo (10); Móviles (4); Edades (4) |

### Álgebra

| # | Unidad | Fichas | Subtemas con más fichas |
| --- | --- | --- | --- |
| 1 | Lógica, conjuntos y juegos lógicos | 0 | — |
| 2 | Números reales e intervalos | 21 | Desigualdad de medias y cotas (8); Intervalos y sus operaciones (7); Desigualdades (6) |
| 3 | Exponentes, radicales y productos notables | 53 | Leyes de exponentes (17); Habilidad operativa con productos notables (12); Identidades condicionales (5); Racionalización (5); Propiedades de radicales (4) |
| 4 | Ecuaciones de primer y segundo grado | 30 | Ecuación de primer grado (8); Ecuación cuadrática y discriminante (8); Ecuaciones equivalentes y clasificación (7); Ecuaciones fraccionarias (7) |
| 5 | Inecuaciones | 32 | Inecuaciones lineales (9); Inecuaciones fraccionarias (9); Inecuaciones cuadráticas (8); Inecuaciones de grado superior (6) |
| 6 | Valor absoluto y ecuaciones con radicales | 51 | Ecuaciones e inecuaciones con valor absoluto (23); Inecuaciones con radicales (19); Ecuaciones con radicales (9) |
| 7 | Polinomios | 23 | Polinomios homogéneos (7); Grado absoluto y relativo (5); Polinomios completos y ordenados (4); Reconocimiento de polinomios (3); Igualdad de polinomios (3) |
| 8 | División de polinomios y cocientes notables | 31 | Teorema del resto (6); Algoritmo de la división (5); Divisibilidad de polinomios (5); Restos especiales (4); Condición de cociente notable (3) |
| 9 | Factorización | 18 | MCM de polinomios (5); MCD de polinomios (4); Factor común e identidades (3); Factorización por cambio de variable (3); Factores primos y su conteo (3) |
| 10 | Ecuaciones polinomiales | 65 | Ecuaciones bicuadradas y recíprocas (17); Relaciones entre raíces y coeficientes (15); Ecuaciones de grado superior (11); Transformación de ecuaciones (9); Paridad de raíces irracionales y complejas (8) |
| 11 | Funciones y sus gráficas | 122 | Rango de una función (27); Operaciones con funciones (19); Composición de funciones (19); Funciones lineal y cuadrática (16); Relaciones binarias (11) |
| 12 | Tipos de funciones y función inversa | 60 | Inyectiva, sobreyectiva y biyectiva (21); Función inversa (20); Funciones monótonas y acotadas (9); Funciones par e impar (7); Funciones periódicas (2) |
| 13 | Exponenciales y logaritmos | 283 | Ecuaciones logarítmicas (50); Logaritmo y propiedades (37); Inecuaciones exponenciales y logarítmicas (35); Ecuaciones exponenciales (24); Sistemas exponenciales y logarítmicos (22) |
| 14 | Números complejos | 113 | Forma polar y exponencial (27); Representación en el plano complejo (22); Conjugado y módulo (16); Potencias de números complejos (15); Regiones en el plano complejo (13) |
| 15 | Matrices y determinantes | 83 | Operaciones con matrices (17); Determinantes y propiedades (17); Tipos de matrices (15); Potencias de matrices (10); Matriz inversa y adjunta (7) |
| 16 | Sistemas de ecuaciones | 17 | Método de Gauss (11); Matriz ampliada y sistemas equivalentes (5); Regla de Cramer (1) |
| 17 | Inecuaciones con dos variables y programación lineal | 21 | Inecuaciones con dos variables (21) |
| 18 | Sucesiones y series | 102 | Límite de sucesiones (27); Progresión aritmética (15); Serie geométrica (15); Sumas notables y series telescópicas (14); Convergencia de series (12) |
| 19 | Binomio de Newton | 100 | Término general (19); Desarrollo del binomio (17); Sumas con números combinatorios (15); Término independiente (13); Potencia de un polinomio (12) |

### Geometría

| # | Unidad | Fichas | Subtemas con más fichas |
| --- | --- | --- | --- |
| 1 | Segmentos y ángulos | 102 | Puntos medios de segmentos (17); Segmentos y su medida (16); Rectas paralelas y una secante (16); Máximos, mínimos y rangos (12); Razones y productos de segmentos (10) |
| 2 | Triángulos y líneas notables | 98 | Triángulos isósceles y equiláteros (27); Líneas notables (23); Ángulos formados por bisectrices (17); Triángulos y líneas notables (13); Ángulos del triángulo (9) |
| 3 | Congruencia de triángulos | 117 | Triángulos rectángulos notables (40); Teoremas de la bisectriz y mediatriz (33); Criterios LAL, ALA y LLL (23); Teorema de la base media (20); Otros (1) |
| 4 | Polígonos y cuadriláteros | 163 | Rectángulos y cuadrados (32); Número de diagonales (23); Trapecios (21); Ángulos de polígonos regulares (20); Paralelogramos (16) |
| 5 | Circunferencia y ángulos en ella | 93 | Elementos y teoremas de tangencia (21); Posiciones relativas de dos circunferencias (20); Cuadrilátero inscrito e inscriptible (14); Cuerdas, arcos y diámetros (11); Ángulos central e inscrito (9) |
| 6 | Proporcionalidad y semejanza | 19 | Semejanza de triángulos (7); Semejanza en circunferencias (6); Criterios de semejanza de triángulos (3); Teoremas de la bisectriz e incentro (3) |
| 7 | Puntos notables del triángulo | 37 | Incentro e inradio (14); Ortocentro y baricentro (10); Circuncentro (6); Excentro (4); Recta y circunferencia de Euler (3) |
| 8 | Relaciones métricas | 86 | Cuerdas, secantes y tangente (36); Relaciones en el triángulo rectángulo (13); Teorema de Euclides y proyecciones (13); Teoremas de Stewart y la mediana (6); Teorema de Herón (5) |
| 9 | Polígonos regulares | 86 | Pentágono y decágono regulares (26); Hexágono, octógono y dodecágono regulares (18); Cuerdas y arcos notables (15); Cuadrado y triángulo equilátero inscritos (9); Figuras con polígonos regulares (8) |
| 10 | Simetría en el plano y en el espacio | 18 | Simetría y rotaciones (16); Simetría respecto de una recta (2) |
| 11 | Áreas de regiones triangulares y cuadrangulares | 99 | Área del triángulo con distintos datos (32); Áreas de regiones sombreadas (24); Relación entre áreas de triángulos (14); Áreas con circunferencias tangentes (11); Área de cuadrados y rectángulos (7) |
| 12 | Longitud de la circunferencia y áreas circulares | 30 | Área del círculo y sector circular (15); Segmento y corona circular (7); Lúnulas y otras regiones circulares (5); Longitud de arco (3) |
| 13 | Rectas y planos en el espacio | 103 | Ángulo diedro (27); Distancia entre rectas cruzadas (20); Proyección ortogonal (13); Ángulos y distancias en prismas (11); Ángulo entre rectas cruzadas (8) |
| 14 | Poliedros | 18 | Poliedros regulares (12); Elementos y clasificación de poliedros (6) |
| 15 | Prisma y pirámide | 106 | Secciones planas de prismas (30); Otros (16); Áreas y volúmenes de prismas (13); Prisma oblicuo y sección recta (11); Tronco de prisma (11) |
| 16 | Cilindro, cono y esfera | 216 | Cilindro oblicuo y tronco de cilindro (35); Sólidos inscritos y combinados (31); Sólidos y superficies de revolución (22); Áreas y volúmenes de cilindros (21); Esferas inscritas y circunscritas (15) |
| 17 | Geometría analítica | 356 | Líneas notables con coordenadas (30); Ecuación vectorial de la recta (29); Punto medio y división de segmentos (26); Ecuación de la circunferencia (25); Tangencia de recta y circunferencia (24) |
| 18 | Razonamiento con figuras | 9 | Sucesiones gráficas (4); Conteo de figuras (3); Perímetros de figuras (2) |

### Trigonometría

| # | Unidad | Fichas | Subtemas con más fichas |
| --- | --- | --- | --- |
| 1 | Ángulo trigonométrico y sistemas de medida | 51 | Conversión entre sistemas (51) |
| 2 | Longitud de arco y sector circular | 49 | Longitud de arco (18); Ruedas, poleas y engranajes (18); Sector y trapecio circular (13) |
| 3 | Razones trigonométricas de ángulos agudos | 92 | Razones en figuras geométricas (45); Definición en el triángulo rectángulo (19); Ángulos notables y aproximados (16); Razones recíprocas y complementarias (12) |
| 4 | Resolución de triángulos rectángulos | 24 | Ángulos de elevación y depresión (24) |
| 5 | Plano cartesiano y la recta | 142 | Área con coordenadas (39); Paralelas, perpendiculares y distancias (35); Pendiente e inclinación (25); Ecuaciones de la recta (22); Puntos notables con coordenadas (21) |
| 6 | Ángulos en posición normal | 62 | Razones en posición normal (24); Signos por cuadrante (19); Ángulos medidos desde otro eje (10); Ángulos coterminales y cuadrantales (9) |
| 7 | Reducción al primer cuadrante | 0 | — |
| 8 | Circunferencia trigonométrica | 84 | Áreas en la circunferencia trigonométrica (35); Rango y extremos (20); Variación de las líneas por cuadrante (15); Líneas trigonométricas y segmentos (14) |
| 9 | Identidades trigonométricas fundamentales | 174 | Identidades recíprocas y por división (37); Simplificación y demostración (36); Identidades pitagóricas (27); Eliminación de la variable angular (21); Radicales y signos por cuadrante (19) |
| 10 | Suma y diferencia de ángulos | 180 | Aplicaciones geométricas (48); Tangente y cotangente de arcos compuestos (46); Seno y coseno de arcos compuestos (39); Identidades auxiliares (20); Rango y extremos (11) |
| 11 | Ángulo doble, mitad y triple | 157 | Identidades del ángulo doble (53); Ángulo mitad (34); Ángulo triple (25); Degradación de potencias (21); Sumas y productos telescópicos (9) |
| 12 | Transformaciones y series trigonométricas | 112 | Suma a producto (47); Sumatorias de senos y cosenos (23); Producto a suma (20); Identidades condicionales (17); Rango y extremos (3) |
| 13 | Funciones trigonométricas | 178 | Rango y extremos (104); Dominio (40); Gráficas e intersecciones (17); Amplitud, periodo y frecuencia (9); Asíntotas y discontinuidades (8) |
| 14 | Funciones trigonométricas inversas | 177 | Ecuaciones con funciones inversas (39); Gráficas y transformaciones (36); Dominio y rango (31); Propiedades de las funciones inversas (18); Composición de funciones directas e inversas (14) |
| 15 | Ecuaciones trigonométricas | 117 | Ecuaciones no elementales (38); Inecuaciones trigonométricas (37); Sistemas de ecuaciones trigonométricas (23); Ecuaciones con ángulos múltiples (12); Ecuaciones elementales (7) |
| 16 | Resolución de triángulos oblicuángulos | 150 | Ley de senos (58); Ángulos horizontales y rumbos (47); Ley de cosenos (23); Relaciones entre lados y ángulos (13); Leyes de proyecciones y de tangentes (9) |
| 17 | Áreas y líneas notables con trigonometría | 71 | Inradio, circunradio y exradios (26); Longitud de cevianas, bisectrices y medianas (18); Área del triángulo (14); Fórmula de Herón y semiángulos (7); Cuadriláteros inscritos y circunscritos (6) |
| 18 | Lugar geométrico y cónicas | 144 | Rotación de ejes (36); Hipérbola (35); Traslación de ejes (27); Recta tangente a una cónica (11); Lugar geométrico (10) |
| 19 | Coordenadas polares y números complejos | 51 | Logaritmo y funciones complejas (15); Forma exponencial (13); Teorema de De Moivre (12); Forma trigonométrica de un complejo (11) |

### Razonamiento matemático

| # | Unidad | Fichas | Subtemas con más fichas |
| --- | --- | --- | --- |
| 1 | Razonamiento deductivo y parentesco | 23 | Cuadros de doble entrada (14); Deducción lógica (6); Parentesco (3) |
| 2 | Trazos de figuras y perímetros | 0 | — |
| 3 | Ordenamiento de información | 35 | Ordenamiento lineal (23); Ordenamiento circular (12) |
| 4 | Verdades y mentiras | 5 | Verdades y mentiras (5) |
| 5 | Traslados y puntos cardinales | 5 | Traslados y cruces (5) |
| 6 | Arreglos numéricos y cuadrados mágicos | 7 | Arreglos numéricos (7) |
| 7 | Razonamiento inductivo | 45 | Inducción numérica (20); Inducción con figuras (14); Inducción en arreglos numéricos (11) |
| 8 | Elementos recreativos | 4 | Juegos con fichas y dados (4) |
| 9 | Relojes y calendarios | 112 | Adelantos y atrasos (36); Ángulo entre las agujas del reloj (32); Tiempo transcurrido y por transcurrir (18); Campanadas (16); Calendarios (10) |
| 10 | Certezas | 10 | Certezas (10) |
| 11 | Frecuencia de sucesos | 5 | Intervalos y campanadas (5) |
| 12 | Ruedas, poleas y engranajes | 12 | Ruedas y engranajes (12) |
| 13 | Máximos y mínimos | 12 | Máximos y mínimos (9); Recorridos mínimos con reflejos (3) |
| 14 | Cortes, pesadas y balanzas | 2 | Cortes y pesadas (2) |
| 15 | Planteo de ecuaciones | 164 | Encuentros y alcances (27); Edades en distintos tiempos (17); Ecuaciones lineales (17); Sistemas de ecuaciones (13); Rapidez media y por tramos (12) |
| 16 | Movimiento y comparación de figuras | 0 | — |
| 17 | Rutas y visualización espacial | 8 | Rutas en el plano (8) |
| 18 | Tablas, gráficos y suficiencia de datos | 1 | Situaciones deportivas (1) |
| 19 | Diagramas de flujo y operadores | 100 | Composición e iteración de operadores (25); Operadores con potencias y radicales (21); Operadores definidos por una regla (14); Operadores definidos por recurrencia (12); Operadores en sumas y productos (10) |

## MRU, MRUV y caída libre: qué pregunta el banco

Es la primera unidad que se construye. Le corresponden 250 fichas. Por tema del banco:

- **Cinemática I (116):** Encuentros y alcances (24); MRU (21); MRUV (20); Velocidad relativa (14); Velocidad y rapidez media (13); Aceleración media (7); Sonido y eco en MRU (7); Posición, desplazamiento y distancia (5); Movimiento con aceleración variable (5).
- **Cinemática II (116):** Caída libre (54); Tiro parabólico (29); Movimiento en dos dimensiones (11); Tiro sobre planos y rebotes (8); Encuentros en caída libre (7); Velocidad relativa (4); MRUV (3). De estas, las de tiro parabólico y movimiento en dos dimensiones van a la unidad de movimiento parabólico.
- **Gráficas del movimiento (62):** Gráficas de velocidad y aceleración (20); Gráficas de posición y tiempo (16); Encuentros y alcances (14); Recta y parábola como gráficas (7); Movimiento en dos dimensiones (5).

Lo que cambia en el diseño de la sección 7.5 de la auditoría: **encuentros y alcances es el subtema más grande de cinemática I, por encima de MRU y de MRUV.** Por eso se agregó la parte de dos carritos. Velocidad relativa y velocidad media también pesan y quedan para el ejemplo que se completa y la práctica.

## Las figuras

Nueve de cada diez figuras son de dos tipos generales, «tarjeta de relaciones» (6 042) y «gráfica cartesiana» (5 216). Ilustran el problema; no son piezas que se puedan manipular ni corresponden una a una con las piezas del kit.

## Lo que esto le dice a la estrategia

1. **El banco cubre 128 de las 152 unidades,** no 108 como parecía por el nombre de los temas. Al mirar por subtema aparecieron fichas para unidades que ningún tema nombraba: cinética química (dentro de reacciones y de equilibrio), valor absoluto y números reales (dentro de inecuaciones), la recta en el plano (dentro de ángulos en posición normal), simetría y poliedros (dentro de congruencia y de prismas), y varias de razonamiento matemático (certezas, ordenamientos, verdades y mentiras) que estaban bajo «razonamiento lógico».
2. **Lo que sigue vacío es razonamiento verbal entero** y seis unidades sueltas.
3. **Las soluciones con pasos son lo más aprovechable.** Casi todas las fichas la tienen, y es justo lo que pide la ruta «seguir un ejemplo».
4. **Ahora se puede elegir por tipo de problema.** Con los subtemas unificados, la práctica mezclada y los generadores pueden pedir «encuentros y alcances» o «Venn con tres conjuntos» en vez de un tema entero.
5. **El volumen es muy desigual.** Hay unidades con cientos de fichas y otras con menos de diez.
6. **Una de cada seis fichas pide revisión** antes de integrarse. Las condiciones anotadas (dominio que falta, clave que no coincide, dato ambiguo) son una lista gratis de cuidados para los generadores.
7. **El catálogo tiene huecos que el banco sí pregunta:** óptica ondulatoria (interferencia, difracción y polarización, 11 fichas) y termoquímica (entalpía y ley de Hess, 8 fichas) no tienen unidad propia.

## Decisiones abiertas

- ~~**Unidad de otro curso.**~~ Resuelto el 14 nov: el validador la acepta (ver arriba).
- **Edades y móviles** (100 fichas de razonamiento matemático) quedaron en planteo de ecuaciones, que es donde la app los enseña. El sílabo de aritmética también los nombra, en razonamiento numérico.
- **Recta y cónicas** aparecen en tres unidades del catálogo (geometría analítica, recta en el plano y cónicas, las dos últimas en trigonometría). Las fichas se repartieron entre las tres según lo que nombra el sílabo de cada una; si se prefiere todo en un solo lado, es un cambio corto.
- **Revisión por una persona.** Conviene que alguien que conozca los cursos mire el vocabulario de `subtemas.json`, al menos en las unidades que se van a construir primero.

## Límites de esta lectura

- La unificación se hizo con modelos de lenguaje sobre etiquetas y títulos. No se leyó cada ficha y nadie la revisó.
- No se revisó la calidad de las soluciones ni de las figuras.
- Los conteos por unidad dependen de esa clasificación: sirven para ver dónde hay material, no para citar cifras exactas.
