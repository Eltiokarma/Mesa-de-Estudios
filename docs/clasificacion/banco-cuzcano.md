# El banco Cuzcano: qué trae y qué unidades cubre

13 de noviembre de 2026. Lectura del banco de ejercicios que está en la rama `banco/cuzcano` (carpeta `contenido/ejercicios/cuzcano/`), hecha para entender mejor los temas antes de construir el formato nuevo (`docs/pogil-v2-rive.md`, sección 0). Todo lo de aquí sale de contar con un script; no se leyó ficha por ficha.

## Qué es

- **12 361 fichas** de **125 libros**, todas de la Editorial Cuzcano, en 7 cursos y 123 temas. Razonamiento verbal no tiene ninguna.
- Cada ficha trae el enunciado, la respuesta, una **solución propia con pasos** (la tienen 12 353) y una figura propia en SVG (hay 12 351, unos 39 MB).
- **Estado:** las 12 361 están como `crudo`. 10 339 figuran verificadas y 2 064 están marcadas para revisar antes de integrar (casi todas con una condición anotada: dominio, clave que no coincide, dato que falta).
- La rama no se publica: `vercel` la excluye mientras la app no la lea.

## La regla 5 aplicada a este banco

**Las 12 361 fichas vienen de libros de academia; ninguna es de un examen oficial.** Sus enunciados están cotejados con el escaneo, o sea que son los del libro. Por la regla 5 de `CLAUDE.md`:

- **Los enunciados no van al producto.** Sirven para saber qué se pregunta y cómo, y para alimentar generadores propios que los repliquen con otros números y otra redacción.
- **Lo que sí es nuestro** son las soluciones con pasos y las figuras, que el banco marca como propias. Sirven de base para los ejemplos que se completan (ruta «seguir un ejemplo»), siempre sobre un problema generado.
- **Lo que se cita tal cual** son las preguntas de examen oficial, y esas están en otro lado: la clasificación de San Marcos de `docs/clasificacion-unmsm-admision.md`.

## Cobertura por curso

| Curso | Fichas | Temas del banco | Unidades del catálogo con fichas | Marcadas para revisar |
| --- | --- | --- | --- | --- |
| Física | 2 440 | 24 | 20 de 20 | 443 |
| Química | 1 720 | 13 | 15 de 20 | 377 |
| Aritmética | 1 900 | 19 | 17 de 19 | 214 |
| Álgebra | 1 205 | 17 | 15 de 19 | 128 |
| Geometría | 1 948 | 22 | 16 de 18 | 354 |
| Trigonometría | 1 787 | 13 | 17 de 19 | 305 |
| Razonamiento matemático | 1 361 | 15 | 8 de 19 | 243 |
| Razonamiento verbal | 0 | 0 | 0 de 18 | 0 |
| **Total** | **12 361** | **123** | **108 de 152** | **2 064** |

Las fichas de un tema del banco pueden servir a una unidad de otro curso: las de sucesiones, porcentajes, fracciones, combinatoria y probabilidades de razonamiento matemático se contaron en sus unidades de aritmética.

## Unidades del catálogo que el banco no cubre

Son 44. Para ellas los ejercicios tienen que salir de otro lado: los exámenes oficiales ya clasificados, los generadores que ya existen o material nuevo.

- **Química (5):** Materia y energía; Líquidos, sólidos y cambios de estado; Cinética química; Petróleo y recursos naturales; Contaminación ambiental y química aplicada.
- **Aritmética (2):** Las cuatro operaciones; Problemas de razonamiento numérico.
- **Álgebra (4):** Lógica, conjuntos y juegos lógicos; Números reales e intervalos; Valor absoluto y ecuaciones con radicales; Inecuaciones con dos variables y programación lineal.
- **Geometría (2):** Simetría en el plano y en el espacio; Poliedros.
- **Trigonometría (2):** Plano cartesiano y la recta; Lugar geométrico y cónicas.
- **Razonamiento matemático (11):** Traslados y puntos cardinales; Arreglos numéricos y cuadrados mágicos; Elementos recreativos; Certezas; Frecuencia de sucesos; Ruedas, poleas y engranajes; Máximos y mínimos; Cortes, pesadas y balanzas; Movimiento y comparación de figuras; Rutas y visualización espacial; Tablas, gráficos y suficiencia de datos.
- **Razonamiento verbal (18):** Definiciones; Analogías; Precisión léxica y sentido contextual; Conectores lógico-textuales; Eliminación de oraciones; Plan de redacción; Cohesión y coherencia textual; El texto y sus tipos; Tema central e idea principal; Resumen y síntesis; Textos discontinuos e infografías; Inferencias; Compatibilidad e incompatibilidad; Extrapolación y lectura crítica; Textos argumentativos, dialécticos y debate; Texto y contexto; Textos filosóficos y científicos; Lectura en inglés.

## Dónde hay mucho y dónde hay poco

| Las ocho unidades con más fichas | Fichas | | Las ocho con menos (entre las cubiertas) | Fichas |
| --- | --- | --- | --- | --- |
| Geometría analítica | 484 | | Trazos de figuras y perímetros | 2 |
| Magnitudes proporcionales y reparto | 400 | | Proporcionalidad y semejanza | 12 |
| MRU, MRUV y caída libre | 236 | | Factorización | 18 |
| Fluidos | 221 | | Polinomios | 23 |
| Cilindro, cono y esfera | 213 | | División de polinomios y cocientes notables | 31 |
| Electrostática | 206 | | Puntos notables del triángulo | 32 |
| Sistemas de numeración | 200 | | Química orgánica: hidrocarburos | 41 |
| Números racionales, fracciones y decimales | 200 | | Funciones orgánicas oxigenadas y nitrogenadas | 41 |

## Las figuras

| Tipo de figura | Fichas |
| --- | --- |
| Tarjeta de relaciones | 6 042 |
| Gráfica cartesiana | 5 216 |
| Tabla | 681 |
| Construcción vectorial | 160 |
| Recta numérica | 118 |
| Reconstrucción vectorial | 79 |
| Figura reconstruida | 20 |
| Esquema | 19 |
| Sin tipo | 15 |
| Tarjeta conceptual | 11 |

Nueve de cada diez figuras son de dos tipos generales (tarjeta de relaciones y gráfica cartesiana). Ilustran el problema; no son piezas que se puedan manipular ni corresponden una a una con las piezas del kit.

## Lo que esto le dice a la estrategia

1. **El banco cubre 108 de las 152 unidades.** Para las otras 44 no hay nada, y ahí están todo razonamiento verbal y 11 de las 19 de razonamiento matemático.
2. **Los subtemas no están normalizados.** Hay 3 357 etiquetas distintas para 123 temas, y 1 642 fichas no tienen ninguna (en calor, 139 de 170). La misma idea aparece escrita de varias formas («Ley de Faraday» y «ley-de-faraday»). Antes de usar el banco para elegir tipos de problema o para la práctica mezclada hay que unificar esas etiquetas.
3. **Las soluciones con pasos son lo más aprovechable.** Casi todas las fichas la tienen, y es justo lo que pide la ruta «seguir un ejemplo»: un problema resuelto al que se le quita un paso.
4. **El volumen es muy desigual.** Geometría analítica tiene 484 fichas y trazos de figuras, 2. Con pocas fichas no se puede saber qué tipos de problema hay: en esas unidades manda la clasificación de exámenes oficiales.
5. **Una de cada seis fichas pide revisión** antes de integrarse. Las condiciones anotadas (dominio que falta, clave que no coincide, dato ambiguo) son una lista gratis de trampas y cuidados para los generadores.
6. **Solo 1 de los 123 temas tiene su unidad asignada** en `temas.json`. La tabla de abajo propone las demás.

## MRU, MRUV y caída libre: qué pregunta el banco

Es la primera unidad que se construye. Le corresponden unas 236 fichas de tres temas: cinemática I (116), análisis de gráficas (62) y la mitad de cinemática II (58). Un conteo por palabras en los títulos y enunciados, aproximado, da estos tipos:

| Tipo de problema | Fichas, aproximado |
| --- | --- |
| Gráficas del movimiento | 62 del tema propio, más unas 18 dentro de cinemática |
| Caída libre y lanzamiento vertical | unas 54 |
| Encuentros, alcances y cruces de dos móviles | unas 39 |
| Movimiento relativo (río, bote, escalera) | unas 32 |
| Frenado | unas 16 |

Lo que cambia en el diseño de la sección 7.5 de la auditoría: **los encuentros y alcances de dos móviles pesan tanto como el frenado y no estaban.** Se agregó una parte con dos carritos.

## Propuesta: a qué unidad va cada tema del banco

Hecha por el nombre del tema, sin leer las fichas. Cuando un tema sirve a dos o tres unidades, sus fichas se repartieron por igual para contar; el reparto real hay que hacerlo por subtema.

| Tema del banco | Fichas | Unidad o unidades del catálogo |
| --- | --- | --- |
| `algebra.binomio-de-newton` | 100 | Álgebra: Binomio de Newton |
| `algebra.cocientes-notables` | 8 | Álgebra: División de polinomios y cocientes notables |
| `algebra.desigualdades-e-inecuaciones` | 100 | Álgebra: Inecuaciones |
| `algebra.division-polinomica-y-restos` | 23 | Álgebra: División de polinomios y cocientes notables |
| `algebra.factorizacion` | 9 | Álgebra: Factorización |
| `algebra.logaritmos` | 200 | Álgebra: Exponenciales y logaritmos |
| `algebra.matrices-determinantes-y-sistemas-de-ecuaciones-lineales` | 100 | Álgebra: Matrices y determinantes; Álgebra: Sistemas de ecuaciones |
| `algebra.mcd-y-mcm-de-polinomios` | 9 | Álgebra: Factorización |
| `algebra.numeros-complejos` | 100 | Álgebra: Números complejos |
| `algebra.polinomios-y-grados` | 23 | Álgebra: Polinomios |
| `algebra.potenciacion-y-ecuaciones-exponenciales` | 100 | Álgebra: Exponentes, radicales y productos notables |
| `algebra.productos-notables-e-identidades` | 10 | Álgebra: Exponentes, radicales y productos notables |
| `algebra.radicales-y-racionalizacion` | 11 | Álgebra: Exponentes, radicales y productos notables |
| `algebra.relaciones-y-funciones-i` | 102 | Álgebra: Funciones y sus gráficas |
| `algebra.relaciones-y-funciones-ii` | 100 | Álgebra: Tipos de funciones y función inversa |
| `algebra.sucesiones-y-series` | 100 | Álgebra: Sucesiones y series |
| `algebra.teoria-de-las-ecuaciones` | 110 | Álgebra: Ecuaciones polinomiales; Álgebra: Ecuaciones de primer y segundo grado |
| `aritmetica.analisis-combinatorio-y-teoria-de-probabilidades` | 100 | Aritmética: Análisis combinatorio; Aritmética: Probabilidades |
| `aritmetica.conteo-y-paginacion` | 100 | Aritmética: Sistemas de numeración |
| `aritmetica.divisibilidad` | 100 | Aritmética: Divisibilidad |
| `aritmetica.estadistica` | 100 | Aritmética: Estadística descriptiva |
| `aritmetica.logica-proposicional` | 100 | Aritmética: Lógica proposicional |
| `aritmetica.magnitudes-proporcionales` | 100 | Aritmética: Magnitudes proporcionales y reparto |
| `aritmetica.mcd-y-mcm` | 100 | Aritmética: MCD y MCM |
| `aritmetica.numeracion` | 100 | Aritmética: Sistemas de numeración |
| `aritmetica.numeros-primos` | 100 | Aritmética: Números primos y divisores |
| `aritmetica.numeros-racionales` | 100 | Aritmética: Números racionales, fracciones y decimales |
| `aritmetica.potenciacion-y-radicacion` | 100 | Aritmética: Potenciación y radicación |
| `aritmetica.razones-y-proporciones` | 100 | Aritmética: Razones y proporciones |
| `aritmetica.regla-de-descuento` | 100 | Aritmética: Interés y descuento |
| `aritmetica.regla-de-interes` | 100 | Aritmética: Interés y descuento |
| `aritmetica.regla-de-mezcla-y-aleacion` | 100 | Aritmética: Mezclas y aleaciones |
| `aritmetica.regla-de-tres` | 100 | Aritmética: Magnitudes proporcionales y reparto |
| `aritmetica.reparto-proporcional` | 100 | Aritmética: Magnitudes proporcionales y reparto |
| `aritmetica.tanto-por-ciento` | 100 | Aritmética: Tanto por ciento y operaciones comerciales |
| `aritmetica.teoria-de-conjuntos` | 100 | Aritmética: Conjuntos |
| `fisica.analisis-de-graficas-del-movimiento-mecanico` | 62 | Física: MRU, MRUV y caída libre |
| `fisica.analisis-dimensional` | 61 | Física: Magnitudes y vectores |
| `fisica.analisis-vectorial` | 69 | Física: Magnitudes y vectores |
| `fisica.calor` | 170 | Física: Temperatura y calor |
| `fisica.cantidad-de-movimiento-impulso-y-choques` | 125 | Física: Impulso, cantidad de movimiento y choques |
| `fisica.cinematica-i-mru-y-mruv` | 116 | Física: MRU, MRUV y caída libre |
| `fisica.cinematica-ii-mvcl-y-mpcl` | 116 | Física: MRU, MRUV y caída libre; Física: Movimiento parabólico y circular |
| `fisica.condensadores` | 72 | Física: Electrostática |
| `fisica.dinamica` | 81 | Física: Dinámica |
| `fisica.electrodinamica` | 156 | Física: Corriente eléctrica y circuitos |
| `fisica.electromagnetismo` | 148 | Física: Campo y fuerza magnética; Física: Inducción electromagnética |
| `fisica.electrostatica` | 134 | Física: Electrostática |
| `fisica.estatica` | 120 | Física: Estática: equilibrio y torque |
| `fisica.fisica-moderna` | 115 | Física: Física moderna |
| `fisica.gravitacion-universal` | 63 | Física: Gravitación universal |
| `fisica.hidrostatica` | 121 | Física: Fluidos |
| `fisica.hidrostatica-e-hidrodinamica` | 100 | Física: Fluidos |
| `fisica.movimiento-circunferencial` | 74 | Física: Movimiento parabólico y circular |
| `fisica.ondas-electromagneticas` | 59 | Física: Ondas electromagnéticas |
| `fisica.ondas-mecanicas` | 71 | Física: Ondas mecánicas y sonido |
| `fisica.optica` | 139 | Física: Óptica geométrica |
| `fisica.oscilaciones-mecanicas` | 73 | Física: Movimiento armónico simple |
| `fisica.termodinamica` | 121 | Física: Termodinámica |
| `fisica.trabajo-mecanico-energia-y-potencia` | 74 | Física: Trabajo, energía y potencia |
| `geometria.areas-de-regiones-poligonales-y-circulares` | 100 | Geometría: Áreas de regiones triangulares y cuadrangulares; Geometría: Longitud de la circunferencia y áreas circulares |
| `geometria.circunferencia` | 84 | Geometría: Circunferencia y ángulos en ella |
| `geometria.circunferencia-y-parabola` | 100 | Geometría: Geometría analítica |
| `geometria.congruencia-de-triangulos` | 58 | Geometría: Congruencia de triángulos |
| `geometria.cuadrilateros` | 84 | Geometría: Polígonos y cuadriláteros |
| `geometria.elipse-e-hiperbola` | 100 | Geometría: Geometría analítica |
| `geometria.esfera` | 83 | Geometría: Cilindro, cono y esfera |
| `geometria.geometria-vectorial` | 100 | Geometría: Geometría analítica |
| `geometria.la-linea-recta` | 84 | Geometría: Geometría analítica |
| `geometria.linea-recta-y-angulos` | 100 | Geometría: Segmentos y ángulos |
| `geometria.nociones-generales` | 100 | Geometría: Segmentos y ángulos |
| `geometria.piramide-y-cono` | 60 | Geometría: Prisma y pirámide; Geometría: Cilindro, cono y esfera |
| `geometria.poligonos` | 83 | Geometría: Polígonos y cuadriláteros |
| `geometria.poligonos-regulares` | 100 | Geometría: Polígonos regulares |
| `geometria.prisma-y-cilindro` | 200 | Geometría: Prisma y pirámide; Geometría: Cilindro, cono y esfera |
| `geometria.proporcionalidad-de-segmentos-y-semejanza-de-triangulos` | 12 | Geometría: Proporcionalidad y semejanza |
| `geometria.puntos-notables` | 32 | Geometría: Puntos notables del triángulo |
| `geometria.rectas-y-planos` | 100 | Geometría: Rectas y planos en el espacio |
| `geometria.relaciones-metricas` | 83 | Geometría: Relaciones métricas |
| `geometria.transformacion-de-coordenadas` | 100 | Geometría: Geometría analítica |
| `geometria.triangulos` | 85 | Geometría: Triángulos y líneas notables |
| `geometria.triangulos-y-congruencia` | 100 | Geometría: Triángulos y líneas notables; Geometría: Congruencia de triángulos |
| `quimica.acidos-y-bases` | 144 | Química: Ácidos y bases |
| `quimica.electroquimica` | 153 | Química: Electroquímica |
| `quimica.enlace-quimico` | 155 | Química: Enlace químico y fuerzas intermoleculares |
| `quimica.equilibrio-quimico` | 140 | Química: Equilibrio químico |
| `quimica.estado-gaseoso-y-mezcla-gaseosa` | 183 | Química: Estado gaseoso |
| `quimica.estequiometria` | 149 | Química: Estequiometría |
| `quimica.estructura-atomica` | 84 | Química: Estructura atómica |
| `quimica.nomenclatura-inorganica` | 116 | Química: Nomenclatura inorgánica |
| `quimica.quimica-organica` | 122 | Química: Química orgánica: hidrocarburos; Química: Funciones orgánicas oxigenadas y nitrogenadas; Química: Biomoléculas y productos naturales |
| `quimica.reacciones-quimicas` | 133 | Química: Reacciones químicas y balance |
| `quimica.soluciones` | 134 | Química: Soluciones y coloides |
| `quimica.tabla-periodica` | 107 | Química: Tabla periódica |
| `quimica.unidades-quimicas-de-masa` | 100 | Química: Mol, masa molar y composición |
| `razonamiento-matematico.analisis-combinatorio` | 100 | Aritmética: Análisis combinatorio |
| `razonamiento-matematico.calculo-de-probabilidades` | 100 | Aritmética: Probabilidades |
| `razonamiento-matematico.comparacion-de-magnitudes` | 100 | Aritmética: Magnitudes proporcionales y reparto |
| `razonamiento-matematico.conteo-de-figuras-y-recorridos-eulerianos` | 2 | Razonamiento matemático: Trazos de figuras y perímetros |
| `razonamiento-matematico.cronometria-relojes` | 100 | Razonamiento matemático: Relojes y calendarios |
| `razonamiento-matematico.edades-y-moviles` | 100 | Razonamiento matemático: Planteo de ecuaciones |
| `razonamiento-matematico.fracciones` | 100 | Aritmética: Números racionales, fracciones y decimales |
| `razonamiento-matematico.inductivo-y-deductivo` | 100 | Razonamiento matemático: Razonamiento inductivo; Razonamiento matemático: Razonamiento deductivo y parentesco |
| `razonamiento-matematico.operaciones-matematicas` | 100 | Razonamiento matemático: Diagramas de flujo y operadores |
| `razonamiento-matematico.planteo-de-ecuaciones` | 100 | Razonamiento matemático: Planteo de ecuaciones |
| `razonamiento-matematico.razonamiento-geometrico` | 59 | Geometría: Razonamiento con figuras |
| `razonamiento-matematico.razonamiento-logico` | 100 | Razonamiento matemático: Ordenamiento de información; Razonamiento matemático: Verdades y mentiras |
| `razonamiento-matematico.series` | 100 | Aritmética: Sucesiones y series numéricas |
| `razonamiento-matematico.sucesiones` | 100 | Aritmética: Sucesiones y series numéricas |
| `razonamiento-matematico.tanto-por-ciento` | 100 | Aritmética: Tanto por ciento y operaciones comerciales |
| `trigonometria.circunferencia-trigonometrica` | 84 | Trigonometría: Circunferencia trigonométrica |
| `trigonometria.ecuaciones-e-inecuaciones-trigonometricas` | 129 | Trigonometría: Ecuaciones trigonométricas |
| `trigonometria.funciones-trigonometricas-directas` | 178 | Trigonometría: Funciones trigonométricas |
| `trigonometria.funciones-trigonometricas-inversas` | 165 | Trigonometría: Funciones trigonométricas inversas |
| `trigonometria.identidades-de-arcos-compuestos` | 183 | Trigonometría: Suma y diferencia de ángulos |
| `trigonometria.identidades-de-arcos-multiples` | 146 | Trigonometría: Ángulo doble, mitad y triple |
| `trigonometria.identidades-trigonometricas-fundamentales` | 174 | Trigonometría: Identidades trigonométricas fundamentales |
| `trigonometria.numeros-complejos` | 64 | Trigonometría: Coordenadas polares y números complejos |
| `trigonometria.razones-trigonometricas-de-un-angulo-agudo` | 137 | Trigonometría: Razones trigonométricas de ángulos agudos; Trigonometría: Resolución de triángulos rectángulos |
| `trigonometria.razones-trigonometricas-de-un-angulo-en-posicion-normal` | 144 | Trigonometría: Ángulos en posición normal; Trigonometría: Reducción al primer cuadrante |
| `trigonometria.resolucion-de-triangulos-oblicuangulos` | 163 | Trigonometría: Resolución de triángulos oblicuángulos; Trigonometría: Áreas y líneas notables con trigonometría |
| `trigonometria.sistemas-de-medicion-angular-y-longitud-de-arco` | 100 | Trigonometría: Ángulo trigonométrico y sistemas de medida; Trigonometría: Longitud de arco y sector circular |
| `trigonometria.transformaciones-trigonometricas` | 120 | Trigonometría: Transformaciones y series trigonométricas |

## Límites de esta lectura

- Los conteos salen de un script sobre los campos de cada ficha. No se leyó ninguna ficha entera.
- La asignación de temas a unidades es por nombre. Puede fallar donde el libro agrupa distinto que el catálogo.
- El conteo de tipos de problema de cinemática es por palabras clave: sirve para ver proporciones, no para citar cifras.
- No se revisó la calidad de las soluciones ni de las figuras.
