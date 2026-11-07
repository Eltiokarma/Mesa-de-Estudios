# Ideas erróneas en álgebra y funciones (matemática)

6 de noviembre de 2026 · Tarea 4 de `CLAUDE.md`, primer bloque de matemática (sigue a los informes de física y química)

Para qué sirve: da los distractores de las predicciones para las unidades del curso de álgebra del catálogo (`catalogo/cursos/algebra.json`). Cubre sobre todo `algebra.exponentes-y-productos-notables`, `algebra.ecuaciones-lineales-y-cuadraticas`, `algebra.inecuaciones`, `algebra.valor-absoluto-y-radicales`, `algebra.funciones`, `algebra.tipos-de-funciones-e-inversa`, `algebra.exponenciales-y-logaritmos` y `algebra.sistemas-de-ecuaciones`. También sirve como base para física: cada ecuación de una escena es álgebra, y la mitad de los errores de "signo" de los otros informes empiezan aquí.

**Qué no repito.** El informe de [cinemática](cinematica-ideas-erroneas.md) ya documenta, con datos de Beichner (1994), que la gráfica se lee como una foto del movimiento (G1) y que se confunde la pendiente con la altura (G2). Aquí los enlazo y agrego lo que dice la investigación de matemática sobre lo mismo.

**Cómo se hizo y su límite.** En esta sesión la red solo dejó usar el buscador: no se pudo abrir ningún PDF (todos los sitios de revistas y repositorios dieron error de conexión). Todo lo que sigue sale de resúmenes, fichas bibliográficas y fragmentos que devolvió el buscador. Por eso marco los porcentajes como "cifra de resumen": vienen de un resumen o de una cita de terceros y hay que confirmarlos en el texto completo antes de publicarlos en la app. No agregué ninguna cifra que no apareciera en esos fragmentos.

## Resumen en seis líneas

1. **La letra se lee como etiqueta, no como número.** En el problema clásico ("hay seis veces más estudiantes que profesores"), solo el 63 % de 150 ingresantes de ingeniería escribió bien S = 6P; casi todos los demás escribieron 6S = P (Clement, 1982). El error persiste en España en futuros profesores de primaria (Soneira y otros, 2021).
2. **"2n es mayor que n + 2" porque multiplicar agranda.** En el estudio inglés CSMS, el 71 % respondió así, sin ver que depende de n (Küchemann, 1978, cifra de resumen).
3. **El signo igual se lee como "da como resultado".** En 177 escolares de 6.° a 8.° grado de EE. UU., los que lo entienden como equivalencia resuelven mejor las ecuaciones, aun controlando su rendimiento general (Knuth y otros, 2006); la definición relacional pasa de 29 % en 6.° a 46 % en 8.° (Knuth y otros, 2008, cifra de resumen).
4. **Linealidad indebida:** (a + b)² = a² + b², √(a + b) = √a + √b, log(a + b) = log a + log b. Está descrita desde Matz (1982) y aparece en ingresantes de México, Costa Rica y Chile, pero ninguna fuente que pude ver da el porcentaje por ítem.
5. **Inecuaciones y valor absoluto se resuelven como ecuaciones.** Es la conclusión de Tsamir y Almog (2001) en Israel y de Blanco y Garrote (2007) en España; Almog e Ilany (2012) clasificaron los errores de 481 escolares israelíes en desigualdades con valor absoluto. Sin porcentajes a la vista.
6. **Lo que no tiene estudios:** perder una raíz al dividir entre x, cambiar el signo al "pasar", olvidar invertir el sentido de la desigualdad, f⁻¹ = 1/f, f(x + h) = f(x) + h y los errores de sistemas. Son los errores de academia más frecuentes y quedan como hipótesis.

## De dónde salen los datos

| Fuente | Muestra | Instrumento | Qué aporta |
| --- | --- | --- | --- |
| Clement (1982); Clement, Lochhead y Monk (1981), EE. UU. | 150 ingresantes de ingeniería | Problemas de traducción de enunciado a ecuación | El error de inversión (6S = P) y sus dos causas: orden de palabras y comparación estática |
| Soneira, Bansilal y Govender (2021), España y Sudáfrica | 211 futuros profesores españoles y 79 sudafricanos | Problemas de traducción | En España casi todos los errores son inversiones; en Sudáfrica casi no hay |
| Küchemann (1978, 1981), Inglaterra, proyecto CSMS | Escolares de 11 a 16 años (el estudio de 1981 es nacional) | Test de álgebra con seis niveles de uso de la letra | Letra evaluada, ignorada, como objeto, incógnita, número general y variable |
| Knuth, Stephens, McNeil y Alibali (2006), EE. UU. | 177 escolares (47 de 6.°, 72 de 7.°, 58 de 8.°) | Definir el signo igual y resolver ecuaciones | La comprensión del signo igual predice la resolución de ecuaciones |
| Alibali y otros (2007), EE. UU. | 81 escolares seguidos de 6.° a 8.° | Mismo enfoque, longitudinal | Al final de 8.°, cerca de 30 % operacional y 60 % relacional (cifra de resumen) |
| Clement (1985), EE. UU. | Universitarios | Gráficas de distancia-tiempo | "Hasta la mitad" elige el objeto más lento cuando se pregunta cuál va más rápido |
| Leinhardt, Zaslavsky y Stein (1990) | Revisión | — | Tres confusiones con gráficas: intervalo y punto, pendiente y altura, gráfica como dibujo |
| Vinner y Dreyfus (1989), Israel | 271 universitarios y 36 profesores de secundaria | Definición de función y casos | La definición que dan no coincide con la imagen que usan |
| Breidenbach, Dubinsky, Hawks y Nichols (1992); Carlson (1998), EE. UU. | Universitarios | Tareas de función | Función como acción y no como proceso; poca covariación incluso en alumnos con nota A |
| Zazkis, Liljedahl y Gadowsky (2003), Canadá | Escolares y profesores | Entrevistas sobre y = (x − 3)² | Por qué "x − 3" parece mover a la izquierda |
| Tsamir y Almog (2001); Tsamir, Tirosh y Almog (1998), Israel | Escolares de secundaria | Inecuaciones lineales, cuadráticas, racionales y con raíces | Analogías indebidas con ecuaciones; no descartar valores excluidos |
| Almog e Ilany (2012), Israel | 481 escolares de 10.° y 11.°, 32 entrevistas | Cuestionario de desigualdades con valor absoluto | Tipos de error consistentes |
| Blanco y Garrote (2007), España | 1.° de bachillerato | Cuestionario y entrevistas | Errores en inecuaciones heredados del álgebra temprana |
| Vaiyavutjamai y Clements (2006), Tailandia | 231 escolares de 9.° grado | 18 ecuaciones cuadráticas, antes y después de 11 clases | Tras las clases, la mayoría no entendía ni el procedimiento ni el porqué |
| Ochoviet y Oktaç (2009), Uruguay | Estudiantes adultos | Ecuaciones (ax + b)(cx + d) = 0 | Conocen "si ab = 0, a = 0 o b = 0" pero no lo usan |
| Universidad de Guadalajara (2015), México | 198 ingresantes de informática, administración y turismo | 15 ítems de opción múltiple | 51,31 % de respuestas incorrectas; el ítem de ecuación cuadrática, 69,19 % |
| Gamboa, Castillo e Hidalgo (2019), Costa Rica | 54 ingresantes de Costa Rica y México | Prueba diagnóstica de la Universidad Nacional | Errores en jerarquía de operaciones, paréntesis, polinomios y productos notables |
| Aguerrea, Solís y Huincahue (2022), Chile | 42 ingresantes a pedagogía en matemática | Pretest, talleres, postest | Linealidad indebida en raíces, potencias, logaritmos y trigonometría; persiste tras un semestre |
| Agencia de Calidad de la Educación (Chile), *Aprendiendo de los errores* | Pruebas SIMCE de II medio | Análisis de ítems | Elevar cada término del binomio por separado (cifra no legible en el fragmento) |
| Ganesan y Dindyal (2014); Chua y Wood (2005), Singapur | 89 y 81 escolares | Tests de logaritmos | Muchos errores no son falta de conocimiento sino sobregeneralización de reglas |

**Cautelas.** Ninguna muestra es peruana ni de postulantes. Las más cercanas son las de ingresantes de México, Costa Rica y Chile. Ninguna mide un examen de opción múltiple como el de la UNI o San Marcos, donde el distractor está escrito; por eso los porcentajes sirven para elegir **qué** opciones poner, no para predecir cuántos las elegirán.

## Catálogo con respaldo

Respaldo: **documentado** (hay un dato cuantitativo publicado; aquí casi siempre "cifra de resumen", por verificar), **parcial** (estudio cualitativo, muestra pequeña o sin porcentaje a la vista), **hipótesis** (experiencia docente, sin estudio).

### La letra y el signo igual

| # | Idea errónea | Ejemplo tipo examen | Dato | Respaldo | Fuente |
| --- | --- | --- | --- | --- | --- |
| AL1 | **Inversión: la letra es una etiqueta ("S" = estudiantes), no "el número de estudiantes".** Se traduce palabra por palabra. | "En un taller hay 4 alumnos por cada computadora." Se escribe 4A = C. | 63 % de aciertos en 150 ingresantes de ingeniería; la mayoría de los errores son inversiones. Una fuente en español cita que el 68 % de los errores fue 6S = P. | Documentado (cifra de resumen) | Clement (1982); Clement, Lochhead y Monk (1981); Soneira y otros (2021) |
| AL2 | **Comparación estática:** "6S" se lee como "seis estudiantes" que van con un profesor, no como una operación. | Igual que AL1, pero el alumno explica "por cada 6 estudiantes hay 1 profesor, entonces 6S = 1P". | Las dos causas (orden de palabras y comparación estática) aparecen en España; en Sudáfrica solo la primera. | Parcial | Clement (1982); Soneira y otros (2021) |
| AL3 | **Letra como objeto o como inicial** ("a" = manzanas), **o letra ignorada.** | "Una manzana cuesta a soles y una pera p soles; 3a + 2p" se lee "3 manzanas y 2 peras". | Es uno de los seis niveles del CSMS; no vi el porcentaje. | Parcial | Küchemann (1981) |
| AL4 | **Letras distintas, valores distintos.** Se cree que x + y + z = x + p + z no puede ser cierto, o que dos letras distintas nunca valen lo mismo. | Sistema donde la solución es x = y. | Descrito en el CSMS; sin porcentaje a la vista. | Parcial | Küchemann (1981); Booth (1984) |
| AL5 | **"Multiplicar agranda":** 2n > n + 2 siempre. No se ve la letra como número general. | "Para n real, ¿cuál es mayor, 3n o n + 6?" | 71 % respondió que 2n es mayor (Küchemann, 1978). En 9.° grado de Turquía, la mayoría tomó n como un valor fijo. | Documentado (cifra de resumen) | Küchemann (1978) |
| AL6 | **El signo igual es "da como resultado"** (lectura operacional). Se encadena 3 + 5 = 8 · 2 = 16, o no se acepta 12 = 2x + 4. | Simplificaciones encadenadas con "=" entre pasos que no son iguales. | Definición relacional: 29 % en 6.° y 46 % en 8.° (Knuth y otros, 2008); al final de 8.° cerca de 30 % sigue operacional (Alibali y otros, 2007). | Documentado (cifra de resumen) | Kieran (1981); Knuth y otros (2006, 2008); Alibali y otros (2007) |
| AL7 | **No se acepta una expresión como respuesta** (falta de clausura): x + 3 "no está terminado". | "Exprese el perímetro en función de x." | Descrito por Booth y por Collis; sin porcentaje a la vista. | Parcial | Booth (1984) |

### Linealidad indebida (las reglas se estiran)

| # | Idea errónea | Ejemplo | Dato | Respaldo | Fuente |
| --- | --- | --- | --- | --- | --- |
| AL8 | **(a + b)² = a² + b²** (y (a − b)² = a² − b²). | "Si a + b = 7 y ab = 12, halle a² + b²." Se responde 49. | El SIMCE de Chile lo señala como el error típico del binomio; en Guadalajara y Costa Rica aparece entre los más comunes. Sin porcentaje legible. | Parcial | Matz (1982); Agencia de Calidad (Chile); Gamboa y otros (2019); Guadalajara (2015) |
| AL9 | **√(a + b) = √a + √b** y √(a² + b²) = a + b. | √(x² + 9) = x + 3 al despejar. | Aparece entre los errores de linealidad de ingresantes chilenos y persiste tras un semestre. | Parcial | Aguerrea y otros (2022); Matz (1982) |
| AL10 | **log(a + b) = log a + log b**, y log(ab) = log a · log b. | "Resuelva log x + log(x − 3) = 1." Se escribe log(2x − 3) = 1. | Descrito en Singapur como sobregeneralización; 89 y 81 escolares, sin porcentaje del ítem. | Parcial | Chua y Wood (2005); Ganesan y Dindyal (2014); Aguerrea y otros (2022) |
| AL11 | **(a + b)ⁿ, 2^(x + y) = 2^x + 2^y, (ab)ⁿ bien pero (a + b)ⁿ mal.** El exponente "se reparte" sobre la suma. | 2^(x + 1) = 2^x + 2. | Mismo patrón que AL8; sin dato propio. | Hipótesis (con base en Matz) | Matz (1982) |
| AL12 | **Simplificar sumandos como si fueran factores:** (x + 3)/(x + 5) = 3/5, o (a + b)/a = b. | Simplificar (x² + 2x)/(x² + 5). | Matz y Kirshner y Awtry lo explican por la "forma visual": se aplica la regla que se parece, no la que vale. | Parcial | Matz (1982); Kirshner y Awtry (2004) |

### Ecuaciones y sistemas

| # | Idea errónea | Ejemplo | Dato | Respaldo | Fuente |
| --- | --- | --- | --- | --- | --- |
| AL13 | **Ecuación cuadrática resuelta "como lineal"** o con fórmula mal aplicada. | x² − 8x + 15 = 0. | En Guadalajara, el ítem de ecuación cuadrática tuvo 69,19 % de respuestas incorrectas, el más alto del test. | Documentado (cifra de resumen; no indica qué error) | Universidad de Guadalajara (2015) |
| AL14 | **"Si (x − 3)(x − 5) = 8, entonces x − 3 = 8 o x − 5 = 8."** La propiedad del producto cero se usa con un número distinto de cero. | (x − 3)(x − 5) = 8 da 11 y 13 (lo correcto: 1 y 7). | Los alumnos uruguayos conocen "si ab = 0…" pero no saben cuándo vale; en Tailandia, al verificar, se reemplazaba cada raíz en un solo factor. | Parcial | Ochoviet y Oktaç (2009); Vaiyavutjamai y Clements (2006) |
| AL15 | **Dividir entre la variable y perder una raíz:** x² = 5x ⇒ x = 5. | "Halle la suma de las soluciones de x³ = 4x." Se responde 2 (dividiendo entre x y tomando solo la raíz positiva). | No encontré estudio. | Hipótesis | — |
| AL16 | **Cambiar mal el signo al "pasar al otro lado"**, o pasar un factor restando. | 3x − 7 = 2x + 5 ⇒ 3x + 2x = 5 − 7. | Kieran (1992, revisión) describe la "transposición" como regla sin significado; sin porcentaje. | Hipótesis (descrito sin dato) | Kieran (1992) |
| AL17 | **En un sistema, la solución es "un número", no un par.** Se da solo x, o se cree que un sistema sin solución "está mal planteado". | Sistema con parámetro k: ¿para qué k no tiene solución? | Ochoviet (2009, tesis) estudia el concepto de solución de un sistema 2 × 2; no vi porcentajes. | Parcial | Ochoviet (2009) |
| AL18 | **Sumar o restar ecuaciones sin multiplicar todos los términos**, o igualar coeficientes "a ojo". | 2x + 3y = 12 y x − y = 1; se multiplica la segunda por 3 solo en el lado izquierdo. | No encontré estudio. | Hipótesis | — |

### Inecuaciones y valor absoluto

| # | Idea errónea | Ejemplo | Dato | Respaldo | Fuente |
| --- | --- | --- | --- | --- | --- |
| AL19 | **La inecuación se resuelve como ecuación** y al final se "pone el signo". | x² < 9 ⇒ x < ±3 ⇒ x < 3. | Es la dificultad principal en Israel (analogías indebidas con ecuaciones) y en España. | Parcial | Tsamir y Almog (2001); Blanco y Garrote (2007) |
| AL20 | **No invertir el sentido al multiplicar o dividir por un negativo.** | −2x + 3 > 11 ⇒ x > −4 (lo correcto: x < −4). | No vi porcentaje en los resúmenes. | Hipótesis (muy citado en la experiencia docente) | — |
| AL21 | **Multiplicar por una expresión de signo desconocido**: 1/x < 2 ⇒ 1 < 2x. | Se pierde todo x < 0. | Tsamir y Almog (2001): en inecuaciones racionales se olvida descartar valores excluidos. | Parcial | Tsamir y Almog (2001) |
| AL22 | **|x| = x siempre, o |−x| = x; |a + b| = |a| + |b|.** El valor absoluto "quita el signo menos". | |x − 3| < 5 ⇒ x − 3 < 5 ⇒ x < 8. | 481 escolares israelíes; errores consistentes clasificados, sin porcentaje a la vista. | Parcial | Almog e Ilany (2012) |
| AL23 | **No verificar las soluciones de |A| = B** cuando B depende de x. | |2x + 1| = x − 4 da dos "soluciones" que no cumplen. | Igual que AL22. | Parcial | Almog e Ilany (2012) |

### Funciones y gráficas

| # | Idea errónea | Ejemplo | Dato | Respaldo | Fuente |
| --- | --- | --- | --- | --- | --- |
| AL24 | **La gráfica es un dibujo de la situación** (camino, cerro, trayectoria). | Gráfica de rapidez de una bicicleta que pasa un cerro: se dibuja el cerro. | Ver G1 en [cinemática](cinematica-ideas-erroneas.md). En matemática es la "confusión icónica" de Leinhardt y otros. | Documentado en física; parcial en matemática | Leinhardt y otros (1990); Clement (1985); Beichner (1994) |
| AL25 | **Confundir pendiente con altura.** La recta "más alta" es la que crece más rápido. | Dos rectas que se cruzan: ¿cuál crece más rápido antes del cruce? | "Hasta la mitad" de universitarios eligió el objeto más lento (Clement, 1985). Ver G2 de cinemática. | Documentado (cifra de resumen) | Clement (1985); Leinhardt y otros (1990) |
| AL26 | **Función = fórmula.** No se acepta una función por tramos, constante o dada por una tabla; la definición que se recita no es la que se usa. | "¿Es función f(x) = 3 para todo x?" Se responde no "porque no depende de x". | 271 universitarios y 36 profesores; desajuste entre definición e imagen, sin porcentaje a la vista. | Parcial | Vinner y Dreyfus (1989); Breidenbach y otros (1992) |
| AL27 | **f(x + h) = f(x) + h, f(2x) = 2f(x), f(a + b) = f(a) + f(b).** La función se trata como multiplicación por f. | f(x) = x² + 1; f(3 + 2) = f(3) + 2 = 12 (lo correcto: 26). | Es la linealidad de Matz aplicada a f. Sin dato propio. | Hipótesis (con base en Matz) | Matz (1982) |
| AL28 | **f(x − 2) mueve la gráfica a la izquierda** (porque "menos" es izquierda). | Vértice de y = (x − 2)² + 1. | Zazkis y otros (2003) muestran que la intuición "menos es izquierda" es un obstáculo y que elegir bien la dirección no prueba que se entienda. | Parcial | Zazkis, Liljedahl y Gadowsky (2003) |
| AL29 | **f⁻¹(x) = 1/f(x).** El "−1" se lee como exponente. | f(x) = 2x + 6; f⁻¹(10) = 1/26 (lo correcto: 2). | Descrito como barrera en estudios de razonamiento reversible, sin porcentaje. En 69 estudiantes de ciencias e ingeniería de EE. UU., solo el 19 % eligió bien el signo de la raíz al invertir, en otro error de inversas. | Parcial | arXiv 2509.19357 (2025) |
| AL30 | **Sin covariación:** se mira un punto o un valor, no cómo cambia y cuando cambia x. | "El tanque se llena a ritmo constante; ¿cómo es la gráfica de la altura?" en un frasco de forma irregular. | Incluso alumnos con nota A en álgebra universitaria fallan estas tareas. Sin porcentaje a la vista. | Parcial | Carlson (1998) |

### Exponenciales y logaritmos

| # | Idea errónea | Ejemplo | Dato | Respaldo | Fuente |
| --- | --- | --- | --- | --- | --- |
| AL31 | **log a / log b = log(a/b)**, o **log(a²) = (log a)².** | log 8 / log 2 = log 4. | Sobregeneralización; ver AL10. | Parcial | Chua y Wood (2005) |
| AL32 | **Igualar exponentes con bases distintas**: 4^x = 2^(x+3) ⇒ x = x + 3. | Se concluye "no hay solución". | Sin dato. | Hipótesis | — |
| AL33 | **Crecer exponencialmente es "crecer mucho" o "crecer de a poco al inicio"**, sin la idea de factor constante; se confunde 2^x con x². | ¿Qué crece más para x = 3 y para x = 10? | Sin dato encontrado. | Hipótesis | — |

**Lo que se aprende del catálogo.** Casi todo se explica con dos mecanismos. El primero es **leer la letra como cosa y no como número** (AL1 a AL5), que explica por qué el postulante traduce mal el enunciado aunque sepa despejar. El segundo es **aplicar la regla que se parece** (AL8 a AL12, AL27, AL29): Matz (1982) lo llamó extrapolación lineal y Kirshner y Awtry (2004) muestran que la forma visual de la expresión pesa más que la regla. Las escenas deben atacar los dos: mostrar qué número es cada letra y hacer visible por qué la regla no vale con un caso que se pueda contar.

## Lo que no tiene respaldo (todavía)

Errores típicos de los problemas de admisión que no encontré medidos. Cada uno se ata al mecanismo que sí tiene estudios:

| Error que suponemos | Mecanismo del que sale |
| --- | --- |
| Perder la raíz x = 0 al dividir entre x (AL15) | Tratar la letra como un número conocido distinto de cero (AL3, AL5) |
| No invertir el sentido de la desigualdad al multiplicar por negativo (AL20) | Resolver la inecuación como ecuación (AL19) |
| Pasar un término sin cambiarle el signo, o pasar un factor restando (AL16) | Transposición como regla sin significado (Kieran, 1992) |
| Δ = b² − 4ac con el signo de b mal sustituido (b = −8 da b² = −64) | Prioridad de operaciones con negativos (Gamboa y otros, 2019) |
| Suma de raíces −b/a con el signo cambiado | Memorizar fórmulas sin verificar (Vaiyavutjamai y Clements, 2006) |
| x² = 9 ⇒ x = 3 (olvidar −3); √(x²) = x | AL22 |
| Dominio de √(x − 2)/(x − 5) sin excluir x = 5 | AL21 |
| f(x − 2) hacia la izquierda y f(x) + 2 "hacia arriba" bien, pero −f(x) confundido con f(−x) | AL28 |
| Composición f(g(x)) calculada como f(x) · g(x) | AL27 |
| f⁻¹ hallada cambiando x por y pero sin despejar, o como 1/f | AL29 |
| Pendiente con los puntos en orden cruzado: (y₂ − y₁)/(x₁ − x₂) | AL25 |
| log_b(x) con la base y el argumento invertidos | AL31 |
| Sistema: aceptar como solución un par que cumple una sola ecuación | AL17 |
| Parámetro k en un sistema: confundir "sin solución" con "infinitas soluciones" | AL17 |

Se confirman como en los otros temas: con hojas resueltas de academia y con preguntas de respuesta abierta en la prueba del lanzamiento.

**Polinomios (PO1 a PO34, 7 nov 2026).** Este informe no cubre polinomios. Los errores PO1 a PO34 de `plantillas/polinomios/` (la máquina de Ruffini) son hipótesis nuestras: P(0) confundido con P(1), grado del producto sumado o multiplicado mal, Ruffini sin el 0 del término que falta, resto con la raíz de signo cambiado, cociente sin dividir entre a con divisor ax + b, (−2)² = −4 (PO15, solo con raíz negativa) y los demás que lista la cabecera de su `motor.js`. Gamboa y otros (2019) se cita solo como un parecido, sin cifras.

## Propuesta para las plantillas

**Regla común.** Cada letra tiene su color y siempre está pegada a algo que se cuenta o se mide: un montón de fichas, un segmento, un área, un punto que se mueve en la gráfica. Al tocar una letra aparece "x = el **número** de …", nunca "x = …" a secas (contra AL1 a AL3). Las predicciones numéricas se comprueban al final reemplazando el valor en la escena, no con un "correcto/incorrecto".

### Escena A: el traductor de enunciados (letras y ecuaciones)

**Qué se ve.** Un aula con figuritas: estudiantes (S, azul) y profesores (P, naranja). Un deslizador cambia el número de profesores; las figuritas aparecen en grupos de seis por profesor. Abajo, una ecuación que el alumno arma arrastrando fichas (S, P, 6, =). Al soltar, la escena **reemplaza** los números del aula en la ecuación y la pinta verde o roja.

**Problema guiado.** "En una academia hay 6 veces más estudiantes que profesores. Hay 15 profesores."

| Predicción 1: *¿qué ecuación dice lo mismo que el enunciado?* | Error | Respaldo |
| --- | --- | --- |
| a) S = 6P | Correcta | 63 % en Clement (1982) |
| b) 6S = P | AL1 (orden de palabras) | La mayoría de los errores en Clement (1982) |
| c) 6S = 1P "porque por cada 6 hay 1" | AL2 (comparación estática) | Soneira y otros (2021) |
| d) S + 6 = P | AL3 (letra como etiqueta y "veces" como suma) | Hipótesis |

| Predicción 2: *¿cuántos estudiantes hay?* | Error | Respaldo |
| --- | --- | --- |
| a) 90 | Correcta | — |
| b) 2,5 | Usa 6S = P (AL1) | Ver AL1 |
| c) 21 | Suma 15 + 6 (AL3) | Hipótesis |

| Predicción 3: *x² = 5x. ¿Cuántas soluciones tiene?* La balanza de abajo tiene x² en un plato y 5x en el otro; el alumno puede arrastrar "÷ x". | Error | Respaldo |
| --- | --- | --- |
| a) Dos: 0 y 5 | Correcta | — |
| b) Una: 5 | Divide entre x (AL15) | Hipótesis |
| c) Ninguna, porque x² nunca es 5x | AL4 ("letras o expresiones distintas, valores distintos"; corregido el 6 nov 2026: AL5 es "multiplicar agranda") | Parcial |
| d) Infinitas, porque x² = x · x | Lee "=" como identidad (AL6) | Hipótesis |

Al arrastrar "÷ x", la escena pregunta "¿y si x vale 0?" y muestra la balanza con ambos platos vacíos: también está en equilibrio.

| Predicción 4: *(x − 3)(x − 5) = 8. ¿Cuáles son las soluciones?* | Error | Respaldo |
| --- | --- | --- |
| a) 1 y 7 | Correcta | — |
| b) 11 y 13 | Producto cero con un número distinto de cero (AL14) | Ochoviet y Oktaç (2009), parcial |
| c) 3 y 5 | Ignora el 8 | Hipótesis |
| d) 4 y 2 | Reparte el 8 en dos factores sin pensar (8 = 1 · 8) | Hipótesis |

**Explorador.** Una balanza con fichas de x (cajas cerradas, siempre del mismo color) y pesas de 1. Cada operación se hace en los dos platos a la vez; si el alumno "pasa" un término, la escena lo muestra como "quitar lo mismo de los dos lados" (contra AL16). Un botón "abrir las cajas" revela el valor de x.

### Escena B: el cuadrado que crece (linealidad indebida)

**Qué se ve.** Un cuadrado de lado a + b, con a (verde) y b (morado) como segmentos que se arrastran. El área se ve partida en cuatro piezas: a², b² y dos rectángulos ab. Un contador muestra el área total y, al lado, a² + b². Una segunda pestaña muestra un triángulo rectángulo de catetos a y b para √(a² + b²), y una tercera, una regla logarítmica (dos reglas que se deslizan) para log(ab) = log a + log b.

**Problema guiado.** "a + b = 7 y ab = 12. Halle a² + b²."

| Predicción 1: *a = 3, b = 4. ¿Cuánto vale (a + b)²?* (antes de ver el cuadrado) | Error | Respaldo |
| --- | --- | --- |
| a) 49 | Correcta | — |
| b) 25 | AL8 | SIMCE (Chile), parcial |
| c) 14 | Multiplica por 2 en vez de elevar | Hipótesis |
| d) 37 | Suma un solo rectángulo ab | Hipótesis |

| Predicción 2: *√(9 + 16) = ?* (el triángulo 3-4-5 se ve después) | Error | Respaldo |
| --- | --- | --- |
| a) 5 | Correcta | — |
| b) 7 | AL9 | Aguerrea y otros (2022), parcial |
| c) 25 | Olvida la raíz | Hipótesis |

| Predicción 3: *log₂(4 + 4) = ?* | Error | Respaldo |
| --- | --- | --- |
| a) 3 | Correcta | — |
| b) 4 | AL10 (log₂ 4 + log₂ 4) | Chua y Wood (2005), parcial |
| c) 2 | log₂(4 · 4)/2, mezcla de reglas | Hipótesis |

| Predicción 4: *a + b = 7 y ab = 12. ¿a² + b²?* | Error | Respaldo |
| --- | --- | --- |
| a) 25 | Correcta: 49 − 2 · 12 | — |
| b) 49 | AL8 | Parcial |
| c) 37 | Resta un solo ab | Hipótesis |
| d) 73 | Suma 2ab en vez de restarlo | Hipótesis |

**Explorador.** Al arrastrar b hasta 0, los rectángulos desaparecen y (a + b)² = a² "por fin" se cumple: la regla falsa solo vale cuando una pieza no existe. Lo mismo con √ (el triángulo se aplasta) y con log (una regla queda en 1).

### Escena C: la gráfica con perillas (funciones)

**Qué se ve.** Plano cartesiano con la gráfica de f (azul) y una copia g (naranja). Tres perillas: h (desplazamiento horizontal, rojo), k (vertical, verde) y "reflejar en y = x". Un punto P sobre f se arrastra; su "gemelo" sobre g muestra a qué x corresponde. La ecuación g(x) = f(x − h) + k está escrita con los mismos colores. Una pestaña aparte tiene una recta numérica para inecuaciones: al multiplicar por −1, la recta **gira** media vuelta y la flecha de la solución cambia de lado.

**Problema guiado.** f(x) = x². ¿Dónde está el vértice de g(x) = (x − 2)² + 1?

| Predicción 1: *¿hacia dónde se mueve la parábola?* | Error | Respaldo |
| --- | --- | --- |
| a) 2 a la derecha y 1 arriba: vértice (2; 1) | Correcta | — |
| b) 2 a la izquierda y 1 arriba: (−2; 1) | AL28 | Zazkis y otros (2003), parcial |
| c) 2 abajo y 1 arriba: (0; −1) | Lee "−2" como desplazamiento vertical | Hipótesis |

Al arrastrar P a x = 0 sobre f, su gemelo aparece en x = 2: "g en 2 vale lo que f en 0".

| Predicción 2: *f(x) = x² + 1. ¿f(3 + 2)?* | Error | Respaldo |
| --- | --- | --- |
| a) 26 | Correcta | — |
| b) 12 | AL27: f(3) + 2 | Hipótesis (con base en Matz) |
| c) 14 | f(3) + f(2) − 1, mezcla | Hipótesis |

| Predicción 3: *f(x) = 2x + 6. ¿f⁻¹(10)?* (la perilla "reflejar" muestra la inversa) | Error | Respaldo |
| --- | --- | --- |
| a) 2 | Correcta | — |
| b) 1/26 | AL29 | Parcial |
| c) 26 | Calcula f(10) | Hipótesis |
| d) 8 | (10 − 6) · 2, despeja al revés | Hipótesis |

| Predicción 4: *dos rectas se cruzan en x = 4; la recta A está más arriba antes del cruce. ¿Cuál crece más rápido en x = 2?* | Error | Respaldo |
| --- | --- | --- |
| a) La que tiene más pendiente (B, que viene de abajo) | Correcta | — |
| b) A, porque está más arriba | AL25 | "Hasta la mitad", Clement (1985) |
| c) Las dos igual, porque se cruzan | Confusión intervalo-punto | Leinhardt y otros (1990), parcial |

| Predicción 5 (recta numérica): *−2x + 3 > 11* | Error | Respaldo |
| --- | --- | --- |
| a) x < −4 | Correcta | — |
| b) x > −4 | AL20 | Hipótesis |
| c) x < −7 | Pasa el 3 sumando (AL16) | Hipótesis |
| d) x = −4 | Resuelve como ecuación (AL19) | Tsamir y Almog (2001), parcial |

| Predicción 6: *|x − 3| ≤ 5* (la recta muestra "distancia a 3") | Error | Respaldo |
| --- | --- | --- |
| a) −2 ≤ x ≤ 8 | Correcta | — |
| b) x ≤ 8 | AL22: quita las barras | Almog e Ilany (2012), parcial |
| c) x ≤ −2 o x ≥ 8 | Invierte dentro y fuera | Hipótesis |

## Casos de prueba propuestos

Verificados con `fractions.Fraction` en Python (`python3 -I`), probando cada inecuación en una malla de valores racionales y cada ecuación por sustitución. El script quedó en el directorio de trabajo de la sesión (no se versiona).

| Plantilla | Caso | Entrada | Salida esperada (y la de cada error) |
| --- | --- | --- | --- |
| A | Traducción | S = 6P, P = 15 | S = 90 (con 6S = P: 5/2) |
| A | Dividir entre x | x² = 5x | {0; 5} (dividiendo: {5}) |
| A | Transposición | 3x − 7 = 2x + 5 | x = 12 (con el signo mal: −2/5) |
| A | Producto distinto de cero | (x − 3)(x − 5) = 8 | {1; 7} (con "cada factor = 8": 11 y 13, que dan 8 · 6 = 48) |
| A | Sistema | 2x + 3y = 12; x − y = 1 | (3; 2) |
| A | Sistema con parámetro | kx + 2y = 3; 2x + y = 5 | determinante k − 4; para k = 4 no hay solución (4x + 2y vale 3 y 10 a la vez) |
| B | Binomio | a = 3, b = 4 | (a + b)² = 49 (a² + b² = 25) |
| B | Raíz | √(9 + 16) | 5 (√9 + √16 = 7) |
| B | Logaritmo | log₂(4 + 4) | 3 (log₂ 4 + log₂ 4 = 4) |
| B | Exponencial | 4^x = 2^(x + 3) | x = 3 (2x = x + 3) |
| C | f(x + h) | f(x) = x² + 1, f(3 + 2) | 26 (f(3) + 2 = 12) |
| C | Desplazamiento | y = (x − 2)² + 1 | vértice (2; 1) (al revés: (−2; 1)) |
| C | Inversa | f(x) = 2x + 6, f⁻¹(10) | 2; se comprueba f(2) = 10 (1/f(10) = 1/26) |
| C | Inecuación lineal | −2x + 3 > 11 | x < −4 |
| C | Inecuación racional | 1/x < 2 | x < 0 o x > 1/2 (multiplicando por x: solo x > 1/2) |
| C | Valor absoluto | |x − 3| ≤ 5 | −2 ≤ x ≤ 8 |
| C | Valor absoluto con verificación | |2x − 1| = x + 2 | x = 3 o x = −1/3 (las dos cumplen) |

## Huecos y siguientes pasos

- **Ningún PDF se pudo abrir en esta sesión.** Los sitios de revistas, ERIC, Funes, Redalyc, ResearchGate y arXiv dieron error de conexión. Todo lo marcado "cifra de resumen" debe confirmarse con el texto completo: Clement (1982), Küchemann (1978, 1981), Knuth y otros (2006, 2008), Alibali y otros (2007), Clement (1985) y el estudio de Guadalajara (2015). Si Gerson habilita esos dominios o sube los PDF, se completa en una tarde.
- **Faltan porcentajes por ítem** en casi todo: el capítulo de Küchemann en Hart (1981), Vinner y Dreyfus (1989), Breidenbach y otros (1992), Carlson (1998), Almog e Ilany (2012), Tsamir y Almog (2001), Ganesan y Dindyal (2014) y el informe chileno *Aprendiendo de los errores*.
- **Fuentes en español sin leer:** Socas (1997) sobre dificultades, obstáculos y errores en la ESO; Ruano, Socas y Palarea (2008) en *PNA*; Ursini y Trigueros (1997, 2003) con el modelo 3UV (México); Blanco y Garrote (2007); Ochoviet (2009); Aguerrea y otros (2022); Gamboa y otros (2019).
- **Sin datos peruanos.** Lo más cercano son tesis de la Universidad de Piura sobre errores algebraicos en 2.° y 4.° de secundaria (repositorio ALICIA de CONCYTEC). Conviene buscarlas en RENATI y pedir a la UNI o San Marcos datos por pregunta de sus CEPRE.
- **Sin estudio:** AL15, AL16, AL18, AL20, AL27, AL32 y AL33, que son justamente los errores más rentables para un examen de admisión. La prueba del lanzamiento debería incluir dos o tres de ellos como respuesta abierta.
- **Qué sigue.** Aritmética (porcentajes, regla de tres, proporcionalidad) comparte con este informe la linealidad indebida; conviene que los dos usen el mismo código para ese mecanismo.

## Fuentes

Ninguna leída completa en esta sesión. Lo que se dice de cada una viene de su resumen, de su ficha bibliográfica o de citas de terceros que devolvió el buscador.

Con dato cuantitativo en el resumen:

- Clement, J. (1982). *Algebra word problem solutions: thought processes underlying a common misconception*. Journal for Research in Mathematics Education 13(1), 16–30. DOI 10.2307/748434. [Ficha en ERIC](https://eric.ed.gov/?id=EJ258398).
- Clement, J., Lochhead, J. y Monk, G. (1981). *Translation difficulties in learning mathematics*. American Mathematical Monthly 88, 286–290.
- Küchemann, D. (1978). *Children's understanding of numerical variables*. Mathematics in School 7(4), 23–26.
- Knuth, E., Stephens, A., McNeil, N. y Alibali, M. (2006). *Does understanding the equal sign matter? Evidence from solving equations*. Journal for Research in Mathematics Education 37(4), 297–312. [Página de NCTM](https://www.nctm.org/Publications/journal-for-research-in-mathematics-education/2006/Vol37/Issue4/Does-Understanding-the-Equal-Sign-Matter_-Evidence-from-Solving-Equations/).
- Knuth, E., Alibali, M., Hattikudur, S., McNeil, N. y Stephens, A. (2008). *The importance of equal sign understanding in the middle grades*. Mathematics Teaching in the Middle School 13(9), 514–519.
- Alibali, M., Knuth, E., Hattikudur, S., McNeil, N. y Stephens, A. (2007). Estudio longitudinal del signo igual de 6.° a 8.° grado, Mathematical Thinking and Learning 9(3). [Resumen en un blog de investigación](https://blog.mathed.net/2011/11/rysk-alibali-et-als-longitudinal.html).
- Clement, J. (1985). *Misconceptions in graphing*. Proceedings of PME 9, 369–375.
- Universidad de Guadalajara (2015). *Errores algebraicos más comunes en los estudiantes de primer ingreso*. Educación y Humanismo (octubre de 2015). [PDF en la revista](https://revistas.unisimon.edu.co/index.php/educacion/article/download/2170/2062).
- *The inverse function fallacy* (2025), arXiv 2509.19357. [Resumen](https://www.arxiv.org/abs/2509.19357).

Cualitativos o sin porcentaje a la vista:

- Soneira, C., Bansilal, S. y Govender, R. (2021). *Insights into the reversal error from a study with South African and Spanish prospective primary teachers*. Pythagoras 42(1), a613. [ERIC EJ1327400](https://files.eric.ed.gov/fulltext/EJ1327400.pdf).
- Hart, K. M. (ed.), Brown, M. L. y Küchemann, D. E. (1981). *Children's understanding of mathematics: 11–16*. John Murray.
- Kieran, C. (1981). *Concepts associated with the equality symbol*. Educational Studies in Mathematics 12, 317–326. Kieran, C. (1992). *The learning and teaching of school algebra*, en Grouws (ed.), Handbook of Research on Mathematics Teaching and Learning. Kieran, C. (2007), capítulo de álgebra en el Second Handbook (Lester, ed.).
- Booth, L. (1984). *Algebra: children's strategies and errors*. NFER-Nelson.
- Matz, M. (1982). *Towards a process model for high school algebra errors*, en Sleeman y Brown (eds.), Intelligent Tutoring Systems, Academic Press.
- Kirshner, D. y Awtry, T. (2004). *Visual salience of algebraic transformations*. Journal for Research in Mathematics Education 35(4), 224–257.
- Leinhardt, G., Zaslavsky, O. y Stein, M. K. (1990). *Functions, graphs, and graphing: tasks, learning, and teaching*. Review of Educational Research 60(1), 1–64.
- Vinner, S. y Dreyfus, T. (1989). *Images and definitions for the concept of function*. Journal for Research in Mathematics Education 20(4), 356–366.
- Breidenbach, D., Dubinsky, E., Hawks, J. y Nichols, D. (1992). *Development of the process conception of function*. Educational Studies in Mathematics 23, 247–285.
- Carlson, M. (1998). *A cross-sectional investigation of the development of the function concept*. Research in Collegiate Mathematics Education III, CBMS Issues in Mathematics Education 7, 114–162.
- Zazkis, R., Liljedahl, P. y Gadowsky, K. (2003). *Conceptions of function translation: obstacles, intuitions, and rerouting*. Journal of Mathematical Behavior 22(4), 437–450.
- Tsamir, P., Tirosh, D. y Almog, N. (1998). *Students' solutions of inequalities*. Proceedings of PME 22, vol. 4, 129–136. Tsamir, P. y Almog, N. (2001). *Students' strategies and difficulties: the case of algebraic inequalities*. International Journal of Mathematical Education in Science and Technology 32(4), 513–524.
- Almog, N. e Ilany, B.-S. (2012). *Absolute value inequalities: high school students' solutions and misconceptions*. Educational Studies in Mathematics 81(3), 347–364.
- Blanco, L. J. y Garrote, M. (2007). *Difficulties in learning inequalities in students of the first year of pre-university education in Spain*. Eurasia Journal of Mathematics, Science and Technology Education 3(3), 221–229. Versión en español en la revista *Suma* 46 (2004).
- Vaiyavutjamai, P. y Clements, M. A. (2006). *Effects of classroom instruction on students' understanding of quadratic equations*. Mathematics Education Research Journal 18(1), 47–77.
- Ochoviet, C. y Oktaç, A. (2009). *If A·B = 0 then A = 0 or B = 0?* The Mathematics Enthusiast 6(1). Ochoviet, C. (2009). *Sobre el concepto de solución de un sistema de ecuaciones lineales con dos incógnitas*, tesis doctoral, CICATA-IPN.
- Ursini, S. y Trigueros, M. (1997). *Understanding of different uses of variable: a study with starting college students*. Proceedings of PME 21, 254–261. Trigueros, M. y Ursini, S. (2003), CBMS Issues in Mathematics Education 12.
- Socas, M. (1997). *Dificultades, obstáculos y errores en el aprendizaje de las matemáticas en la educación secundaria*, en Rico (coord.), La educación matemática en la enseñanza secundaria, Horsori.
- Ruano, R., Socas, M. y Palarea, M. (2008). *Análisis y clasificación de errores cometidos por alumnos de secundaria en los procesos de sustitución formal, generalización y modelización en álgebra*. PNA 2(2), 61–74.
- Gamboa, R., Castillo, M. e Hidalgo, R. (2019). *Errores matemáticos de estudiantes que ingresan a la universidad*. Actualidades Investigativas en Educación 19(1). DOI 10.15517/aie.v19i1.35278.
- Aguerrea, M., Solís, M. y Huincahue, J. (2022). *Errores matemáticos persistentes al ingresar en la formación inicial de profesores de matemática: el caso de la linealidad*. Uniciencia 36(1).
- Agencia de Calidad de la Educación (Chile). *Aprendiendo de los errores: un análisis de los errores frecuentes de los estudiantes en las pruebas SIMCE*. [PDF](https://archivos.agenciaeducacion.cl/Aprendiendo_de_los_errores.pdf).
- Chua, B. L. y Wood, E. (2005). Errores en logaritmos de escolares de Singapur, The Mathematics Educator 8(2). Ganesan, R. y Dindyal, J. (2014). *An investigation of students' errors in logarithms*. Proceedings of MERGA 37.
- [Cinemática](cinematica-ideas-erroneas.md), informe de este repositorio: G1 y G2, con datos de Beichner (1994).


## Números complejos (CX1 a CX35, 7 nov 2026)

Este informe no trata los complejos. Los errores CX1 a CX35 de `plantillas/numeros-complejos/` (multiplicar por i, módulo, conjugado, producto en forma polar, De Moivre y argumento) son **hipótesis nuestras**, sin dato publicado leído; la lista y sus convenciones están en `rutinas/matematica-a.md` y en la cabecera del motor. Se confirman o descartan con los datos del colegio piloto.
