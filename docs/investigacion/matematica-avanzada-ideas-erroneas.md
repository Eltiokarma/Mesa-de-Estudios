# Ideas erróneas en matemática avanzada (cónicas, polares, matrices, binomio, complejos, espacio y conteo de figuras)

7 de noviembre de 2026 · Rutina de investigación de matemática (rama `rutina/investigacion-mat`). Sigue a los informes de [trigonometría](trigonometria-ideas-erroneas.md), [geometría](geometria-ideas-erroneas.md), [álgebra y funciones](algebra-funciones-ideas-erroneas.md) y [aritmética y razonamiento](aritmetica-razonamiento-ideas-erroneas.md).

Para qué sirve: siete escenas nuevas marcan todas sus opciones incorrectas como «hipótesis nuestras» porque ningún informe cubría su tema. Este documento busca, código por código, si esos errores están documentados en la literatura de educación matemática. Las listas de códigos están en la cabecera de cada `motor.js`. La tabla de cambios propuestos para las escenas está en [`rutinas/investigacion-mat.md`](../../rutinas/investigacion-mat.md).

**Respaldo** (la misma escala de los otros informes): **documentado**, un dato cuantitativo leído en el texto completo de un estudio publicado; **parcial**, un estudio que describe el error pero del que solo se leyó el resumen, un fragmento o una cita de terceros, o que no da cifra; **hipótesis**, ningún estudio encontrado que trate ese error concreto. Un estudio que trata algo vecino se anota como «indicio», pero no sube el respaldo.

## Cómo se hizo y su límite

Siete búsquedas en paralelo, una por tema, en inglés y en español: ERIC, SciELO, Redalyc, Dialnet, Dergipark, repositorios de tesis (YÖK, PUCP, Alicia) e informes PISA, TIMSS y ECE. Después, un revisor que no vio el razonamiento de los buscadores comprobó cada cita y cada cifra con el buscador. Sus 17 correcciones están aplicadas: cuatro respaldos bajaron a hipótesis, se corrigieron autores, revistas y muestras, y se quitaron cifras que no aparecían en ningún fragmento.

**La red de la sesión no dejó abrir ningún texto completo.** WebFetch y curl dieron «host no permitido» en dergipark.org.tr, funes.uniandes.edu.co, link.springer.com, files.eric.ed.gov, doi.org, arxiv.org, tesis.pucp.edu.pe y otros. Todo sale de resúmenes, fichas y fragmentos del buscador. Por la definición de arriba, **ningún código llega a «documentado»**, y cada cifra lleva anotado de dónde se vio. Antes de usar un porcentaje en una decisión, hay que confirmarlo en el texto completo (sección 5 de [`fuentes/por-conseguir.md`](../../fuentes/por-conseguir.md)).

## Resumen en seis líneas

1. **Casi nada de esto está medido.** De unos 220 errores, 8 quedan como parciales y ninguno como documentado. La investigación en estos temas es casi toda universitaria, cualitativa y sin porcentajes por tipo de respuesta.
2. **Cónicas: cero.** Ningún estudio da la frecuencia de cambiar c² entre elipse e hipérbola, leer mal el centro, tomar r² por r o equivocar el lado recto. Sudihartinih y Purniati (2020, 91 universitarios de Indonesia) nombran las dificultades con el lado recto, las asíntotas y los focos, sin cifras en el resumen.
3. **Polares, complejos y matrices: un mecanismo nombrado y sin cifras.** El r negativo cuesta más (Habre, 2017). El argumento se saca con el triángulo de referencia y no con la circunferencia (Smith, Zwolak y Manogue, 2019). Se confunde la matriz con su determinante, de ahí det(kA) = k·det A (Aygör y Özdağ, 2012).
4. **Binomio: lo que hay es de combinatoria.** El error de orden (variación por combinación) y el sesgo de equiprobabilidad están bien estudiados (Batanero, Navarro-Pelayo y Godino, 1997; Lecoutre, 1992; Begué y otros, 2020). El desarrollo de (a + b)ⁿ con n natural no tiene estudios con datos.
5. **Espacio y conteo de figuras: la fuente fuerte son los cubos.** En la tarea del ángulo BGD del cubo, los alumnos de nivel bajo responden 90° (Kondo y otros, PME 2013 y 2014). Contar solo los cubos visibles o contar caras está descrito por Ben-Chaim, Lappan y Houang (1985) y por Battista y Clements (1996).
6. **No hay ningún dato peruano** en estos siete temas, ni ítems liberados de PISA, TIMSS o ECE que los toquen. Los errores de academia (el signo del centro, el lado recto, el término central) se confirman con la medición del colegio piloto.

## Índice

| Tema | Plantilla | Códigos | Parcial | Hipótesis |
| --- | --- | --- | --- | --- |
| [1. Cónicas](#1-cónicas) | `conicas` | CO1–CO37 (sin CO36) | 0 | 36 |
| [2. Coordenadas polares](#2-coordenadas-polares) | `coordenadas-polares` | CP1–CP27 | 1 (CP3) | 26 |
| [3. Matrices y determinantes](#3-matrices-y-determinantes) | `matrices` | MT1–MT34 | 1 (MT4) | 33 |
| [4. Binomio de Newton](#4-binomio-de-newton) | `binomio-newton` | BN1–BN27 | 2 (BN12, BN21) | 25 |
| [5. Números complejos](#5-números-complejos) | `numeros-complejos` | CX1–CX7, CX10–CX35 | 2 (CX17, CX18) | 31 |
| [6. Geometría del espacio](#6-geometría-del-espacio) | `geometria-espacio` | 37 claves `función.pregunta.clave` | 1 (90° en el vértice) | 36 |
| [7. Conteo de figuras](#7-conteo-de-figuras) | `razonamiento-figuras` | 33 claves `función.clave` | 4 | 29 |

Cada tema trae su resumen, sus fuentes y su catálogo con una fila por código.

## 1. Cónicas

Plantilla: `plantillas/conicas/`.


7 de noviembre de 2026 · Para `plantillas/conicas/` (códigos CO1 a CO37; CO36 no existe).

### Resumen en cinco líneas

1. No encontré ningún estudio que mida, con porcentaje, alguno de los 36 errores concretos de `motor.js` (c² cambiado entre elipse e hipérbola, centro con signos cambiados, r² por r, lado recto mal recordado, asíntotas invertidas, etc.). Todos quedan como **hipótesis**.
2. El estudio más cercano es Sudihartinih y Purniati (2020, Indonesia, 91 universitarios de primer semestre): según su resumen, los alumnos no pudieron hallar el lado recto de la elipse, la asíntota de una hipérbola dados sus vértices ni los focos de una hipérbola dada la diferencia de radios focales. Son errores vecinos a CO21–CO27, sin cifras ni forma del error en lo que leí.
3. Los alumnos piensan las cónicas por la ecuación y el dibujo, no por la definición de lugar geométrico: en Turquía, de 90 futuros profesores, el 22,2 % asoció la hipérbola con su definición, el 60 % con «ecuación y forma» y el 3,33 % con su relación con las otras cónicas (tesis de YÖK, cifra vista en el resumen). Apoya la decisión de la escena (la cuerda y las estacas), no un código.
4. Wright (2013, Australia, 119 universitarios) y una tesis de la PUCP sobre la elipse en 5.º de secundaria coinciden en que cuesta ver la elipse como lugar geométrico y ver la circunferencia como caso particular de la elipse (vecino a CO34, CO35 y CO37). Sin cifras leídas.
5. La red de la sesión solo dejó buscar: ningún texto completo abrió (ejournal.upi.edu, dergipark.org.tr, funes.uniandes.edu.co, tesis.pucp.edu.pe dieron «host no permitido»). Lo que sigue sale de resúmenes y fragmentos del buscador.

### Cómo se hizo y su límite

- Búsquedas en inglés, español y turco (`conic sections misconceptions`, `errores cónicas elipse parábola tesis`, `konik kesitler hata kavram yanılgısı`, foco y directriz, corte del cono, completar cuadrados en la circunferencia, tesis peruanas en la PUCP).
- WebFetch falló con «host no permitido» en los cuatro dominios probados (ejournal.upi.edu, dergipark.org.tr, funes.uniandes.edu.co, tesis.pucp.edu.pe). Por la advertencia del entorno, no seguí probando otros. Para leer los PDF hay que permitir esos dominios en la red de la sesión.
- Todo lo leído es **resumen** o **fragmento del buscador**. Por la regla del encargo, nada llega a «documentado». Tampoco marqué nada como «parcial»: ninguna fuente describe el error concreto de un código, solo dificultades vecinas (anotadas como «indicio vecino» en el catálogo).
- No encontré datos de PISA, TIMSS ni ECE sobre cónicas (las cónicas no están en esas pruebas de forma separable). No encontré ningún estudio peruano con cifras de errores en cónicas.
- Mucho resultado del buscador era material docente o páginas de práctica (Varsity Tutors, Albert, SDSU, TI, páginas tipo SEO). Mencionan errores como el signo del centro o r² por r, pero no son estudios; no se usan como respaldo.

### De dónde salen los datos

| Fuente | Muestra | Instrumento | Qué aporta | Qué leí |
| --- | --- | --- | --- | --- |
| Sudihartinih, E. y Purniati, T. (2020). Students' Mistakes and Misconceptions on the Subject of Conics. *International Journal of Education*, 12(2). DOI 10.17509/ije.v12i2.19130 · https://ejournal.upi.edu/index.php/ije/article/download/19130/pdf · https://doaj.org/article/a1ae37d6617644f99dc7cbfc21fb4174 | 91 estudiantes de primer semestre (2017), una universidad de Indonesia | Prueba escrita, entrevistas y documentos; niveles de Van Hiele | Lista de errores: no escriben las dos ecuaciones posibles, no describen una parábola simple, no prueban el lado recto de la elipse, no hallan la asíntota de una hipérbola dados los vértices, no hallan focos de la hipérbola dada la diferencia de radios focales; quienes fallan están en el nivel 1 de Van Hiele | Resumen y fragmentos del buscador; sin porcentajes por ítem |
| Tesis de YÖK (2019-2020): «İlköğretim matematik öğretmenliği lisans öğrencilerinin hiperbol konusundaki kavram imajlarının incelenmesi» · https://acikbilim.yok.gov.tr/handle/20.500.12812/569819 | 90 futuros profesores de 3.er año, una universidad estatal de Turquía | Cuestionario abierto y entrevistas clínicas | Imagen de la hipérbola: 22,2 % definición, 60 % ecuación y forma, 3,33 % relación con otras cónicas; menciona «ideas erróneas» sin detallar | Ficha y resumen |
| Wright, V. (2013). Pre-service Teachers' Concept Image for Circle and Ellipse. MERGA 36, pp. 682-689 · https://acuresearchbank.acu.edu.au/item/8q34z/pre-service-teachers-concept-image-for-circle-and-ellipse | 119 universitarios de 2.º año (futuros profesores), Australia | Respuestas a una pregunta de examen; marco de imagen conceptual y Van Hiele | Llaman «óvalo» a la elipse; les cuesta la relación entre clases (circunferencia como elipse) y razonar con propiedades | Resumen y fragmentos |
| Tesis de maestría PUCP sobre la elipse en 5.º de secundaria con GeoGebra · https://tesis.pucp.edu.pe/bitstreams/7287a9be-1d91-4157-a1d8-3a68db59c7ca/download | Alumnos de 5.º de secundaria, Perú (n no visto) | Secuencia de actividades; registros de representación | «Inconvenientes para comprender la elipse como lugar geométrico» | Fragmento del resumen; autor y año no vistos |
| Revisión de tesis de la Maestría en Enseñanza de las Matemáticas de la PUCP sobre cónicas (2014-2020) · https://tesis.pucp.edu.pe/items/2a58f672-c577-492f-8fae-8d537edf0a35 | Tesis de maestría | Revisión documental | La elipse es la cónica más estudiada; la hipérbola no ha sido objeto de ninguna tesis | Fragmento del resumen |
| Boubée, C., Rey, G. y Sastre Vázquez, P. (2018). Errores en situaciones de validación (secciones cónicas) · https://funes.uniandes.edu.co/wp-content/uploads/tainacan-items/32454/1170868/Boubee2018Errores.pdf | Estudiantes de 1.er año de Agronomía, UNCPBA, Argentina | Tareas de validación de afirmaciones | Categoría emergente «interpretación»; un resumen automático dice que, al preguntar cuándo una elipse pasa a otra cónica, no consideraron la parábola (no confirmado) | Ficha; el dato de la parábola es de un resumen del buscador y queda sin confirmar |
| Tesis de la UIN Sunan Gunung Djati (Indonesia), enfoque fenomenográfico · https://digilib.uinsgd.ac.id/143082/66/02.%20ABSTRAK.pdf | 105 estudiantes | Autoexplicación como instrumento diagnóstico | Cinco niveles de comprensión, de la reproducción memorística a la relacional | Resumen |
| Estudio de la Universidad Pasundan sobre dificultades con la elipse · https://journal.unpas.ac.id/index.php/symmetry/article/view/27500 | Universitarios, Indonesia (n no visto) | Cualitativo | Dificultad para justificar geométricamente y «olvido de la fórmula del lado recto» | Fragmento del buscador |
| Karapiçak, S. Tesis: «10. sınıf öğrencilerinin analitik geometride hata ve kavram yanılgılarının analizi» · https://acikbilim.yok.gov.tr/handle/20.500.12812/381714 | 2552 alumnos de 10.º grado (1.ª etapa), 299 (2.ª) y 10 entrevistas, Turquía | Prueba y entrevistas | Errores de geometría analítica (recta y quizá circunferencia); no se vio qué temas cubre | Ficha |
| Rabanal (2003), Universidad Abierta de Filipinas · https://repository.upou.edu.ph/items/3a01530c-8dbe-4efe-872e-3aadadf5773d | 16 estudiantes de ingeniería de 1.er año | Pensamiento en voz alta | Secuencias de tareas y conductas críticas al resolver cónicas | Resumen |
| Tesis de maestría de Taiwán (NTNU, 2011) · https://etds.lib.ntnu.edu.tw/thesis/detail/6f1ba8ad2ff23de9c1792175bc12355c | Alumnos de bachillerato | Entrevistas | Modelos mentales informales («cohete», «patio»); no dominan las definiciones; recomienda la excentricidad para distinguirlas | Resumen del buscador |
| González Gallegos, W. M. (2018). Tesis, Universidad de Cuenca, Ecuador · https://dspace-test.ucuenca.edu.ec/bitstream/123456789/30735/1/Tesis.pdf | Alumnos de 3.º de bachillerato (15, según un fragmento; no confirmado) | Clases con GeoGebra y prueba | Errores concentrados en resolución de problemas y manipulación algebraica | Resumen del buscador |

**Cautelas.** Dos de las fuentes con más detalle (Wright y la tesis turca) estudian a futuros profesores, no a postulantes. Sudihartinih y Purniati es el único estudio con errores de cálculo de cónicas, pero en lo que leí no dice qué respuesta equivocada dieron los alumnos ni con qué frecuencia; por eso no se puede amarrar a un código.

### Catálogo

| Código | Error (breve) | Qué dice la fuente (cifra exacta y muestra) | Fuente | Qué leí | Respaldo propuesto |
| --- | --- | --- | --- | --- | --- |
| CO1 | Elipse con c² = a² + b² | Sin estudios encontrados. Solo material docente lo menciona («confunden cuál usa suma y cuál resta»). | — | — | Hipótesis |
| CO2 | Hipérbola con c² = a² − b² | Indicio vecino: en 91 universitarios, no hallan los focos de la hipérbola dada la diferencia de radios focales; no se dice con qué relación ni cuántos. | Sudihartinih y Purniati (2020) | Resumen | Hipótesis (indicio vecino) |
| CO3 | b = a − c | Sin estudios encontrados. | — | — | Hipótesis |
| CO4 | Olvida la raíz (da b² o c²) | Sin estudios encontrados. | — | — | Hipótesis |
| CO5 | e = a/c | Sin estudios encontrados. | — | — | Hipótesis |
| CO6 | e = b/a | Sin estudios encontrados. | — | — | Hipótesis |
| CO7 | Elipse: a² siempre bajo x | Indicio vecino: «no pudieron determinar las dos ecuaciones simples posibles» (eje horizontal o vertical), 91 universitarios, sin cifra. | Sudihartinih y Purniati (2020) | Resumen | Hipótesis (indicio vecino) |
| CO8 | Centro con signos cambiados | Sin estudios encontrados; solo material docente y páginas de práctica. | — | — | Hipótesis |
| CO9 | Lee r² como el radio | Sin estudios encontrados; solo material docente. | — | — | Hipótesis |
| CO10 | Completa cuadrados sin sumar al otro lado | Sin estudios con cifras sobre la circunferencia. Vecino: en ecuaciones cuadráticas por completar cuadrados (30 alumnos de 10.º, Panamá, 2024) los errores salen sobre todo de saberes previos; no es cónicas. | Revista *Cuadernos de Investigación y Formación en Educación Matemática* (UCR), https://revistas.ucr.ac.cr/index.php/cifem/article/download/57777/60968/281687 | Resumen | Hipótesis |
| CO11 | Ignora el signo de p | Sin estudios encontrados. | — | — | Hipótesis |
| CO12 | Toma 4p como p | Sin estudios encontrados. | — | — | Hipótesis |
| CO13 | Foco de la parábola sobre el otro eje | Indicio vecino: «no pudieron determinar la descripción de una parábola simple» (91 universitarios, sin cifra). | Sudihartinih y Purniati (2020) | Resumen | Hipótesis (indicio vecino) |
| CO14 | LR = 4p con su signo | Sin estudios encontrados. | — | — | Hipótesis |
| CO15 | LR = 2\|p\| | Sin estudios encontrados. | — | — | Hipótesis |
| CO16 | LR = \|p\| | Sin estudios encontrados. | — | — | Hipótesis |
| CO17 | Hipérbola: a² = denominador mayor | Sin estudios encontrados. | — | — | Hipótesis |
| CO18 | Focos en los vértices (c = a) | Sin estudios encontrados. | — | — | Hipótesis |
| CO19 | Confunde elipse e hipérbola por los signos | Indicio vecino: dificultad para identificar parábola, elipse o hipérbola (91 universitarios, sin cifra). | Sudihartinih y Purniati (2020) | Resumen | Hipótesis (indicio vecino) |
| CO20 | Dos cuadrados del mismo signo = circunferencia aunque A ≠ C | Indicio vecino: dificultad con la relación entre clases circunferencia–elipse (119 universitarios, sin cifra leída). | Wright (2013) | Resumen | Hipótesis (indicio vecino) |
| CO21 | Asíntotas con la razón invertida | Indicio vecino: no hallan la asíntota de una hipérbola dados los vértices (91 universitarios); no se dice qué respuesta dieron. | Sudihartinih y Purniati (2020) | Resumen | Hipótesis (indicio vecino) |
| CO22 | Asíntotas sin raíz | Mismo indicio que CO21. | Sudihartinih y Purniati (2020) | Resumen | Hipótesis (indicio vecino) |
| CO23 | Asíntotas invertidas y sin raíz | Mismo indicio que CO21. | Sudihartinih y Purniati (2020) | Resumen | Hipótesis (indicio vecino) |
| CO24 | e = 2c/a | Sin estudios encontrados. | — | — | Hipótesis |
| CO25 | LR = 2b/a | Indicio vecino: no prueban la longitud del lado recto de la elipse (91 universitarios); «olvidan la fórmula del lado recto» (Unpas, n no visto). Ninguna dice qué fórmula equivocada usan. | Sudihartinih y Purniati (2020); Unpas | Resumen y fragmento | Hipótesis (indicio vecino) |
| CO26 | LR = b²/a | Mismo indicio que CO25. | Ídem | Resumen y fragmento | Hipótesis (indicio vecino) |
| CO27 | LR = 2a²/b | Mismo indicio que CO25. | Ídem | Resumen y fragmento | Hipótesis (indicio vecino) |
| CO28 | Parábola es la que tiene términos en x y en y | Indicio vecino: dificultad para identificar el tipo de cónica (91 universitarios, sin cifra). | Sudihartinih y Purniati (2020) | Resumen | Hipótesis (indicio vecino) |
| CO29 | Plato: foco a la altura del borde | Sin estudios encontrados. | — | — | Hipótesis |
| CO30 | Plato: x² = 2py | Sin estudios encontrados. | — | — | Hipótesis |
| CO31 | Todo corte inclinado del cono da elipse | Sin estudios encontrados. Vecino sin confirmar: al preguntar cuándo una elipse pasa a otra cónica, alumnos de Agronomía no consideraron la parábola (dato de un resumen automático, no del texto). | Boubée, Rey y Sastre Vázquez (2018) | Ficha y resumen del buscador | Hipótesis |
| CO32 | Plano paralelo a la generatriz da hipérbola | Mismo vecino que CO31, sin confirmar. | Boubée y otros (2018) | Ficha | Hipótesis |
| CO33 | Plano paralelo a la generatriz da dos rectas | Sin estudios encontrados. | — | — | Hipótesis |
| CO34 | Clavos juntos: la cuerda dibuja un segmento | Indicio vecino: la elipse no se ve como lugar geométrico (5.º de secundaria, PUCP) y cuesta ver la circunferencia como elipse (119 universitarios); sin cifras. | Tesis PUCP; Wright (2013) | Resúmenes | Hipótesis (indicio vecino) |
| CO35 | Clavos juntos: la cuerda dibuja un punto | Mismo indicio que CO34. | Ídem | Resúmenes | Hipótesis (indicio vecino) |
| CO37 | Clavos juntos: la elipse se alarga | Mismo indicio que CO34. Material docente menciona la idea inversa «más excentricidad, más redonda»; no es estudio. | Ídem | Resúmenes | Hipótesis (indicio vecino) |

**Conteo:** 0 documentados, 0 parciales, 36 hipótesis (17 con indicio vecino en un resumen).


## 2. Coordenadas polares

Plantilla: `plantillas/coordenadas-polares/`.


7 de noviembre de 2026 · Para `plantillas/coordenadas-polares/` (El radar). Cubre los códigos CP1 a CP27 del motor.

### Resumen en cinco líneas

1. La literatura sobre polares es escasa y casi toda universitaria (cálculo, cálculo multivariable, futuros profesores); no hay ningún estudio escolar ni peruano.
2. El único error que aparece por nombre en un estudio es **r negativo**: coordinar el sentido de cambio costó más «sobre todo cuando r es negativo» en un curso de cálculo de 2.º año (Habre, 2017). Solo leí el resumen: CP3 queda parcial. (Un fragmento del buscador atribuía lo mismo a Borji, Erfani y Font, 2020, pero su resumen no menciona r negativo; no se usa como respaldo.)
3. Hay un mensaje cualitativo general: el razonamiento cartesiano estorba al pasar a polares (Moore, Paoletti y Musgrave, 2014; Montiel, Vidakovic y Kabael, 2008) y la trigonometría débil hace fallar las tareas polares (Borji y otros, 2020). Ninguno describe las formas concretas de CP4 a CP27.
4. El error del cuadrante de arctan (CP10) solo aparece en guías de enseñanza y foros, sin datos medidos.
5. Resultado: 0 documentados, 1 parcial (CP3), 26 hipótesis. Las cifras que sí encontré (un 56 % en una pregunta sobre la mayor dificultad, categoría no confirmada, en un artículo de *REAMEC* de 2015 con autores por confirmar) son de cálculo de varias variables y no corresponden a ningún código.

### Cómo se hizo y su límite

- Leí la cabecera de `plantillas/coordenadas-polares/motor.js` (lista CP1 a CP27 con su regla) y el formato de `docs/investigacion/trigonometria-ideas-erroneas.md`.
- Hice unas 16 búsquedas web en inglés, español y portugués (polar coordinates student difficulties, Montiel, Vidakovic, Kabael, Moore, Paoletti, Sayre y Wittmann, Habre, Borji, arctan quadrant, errores coordenadas polares, forma polar de complejos, Distéfano y Aznar, Nordlander).
- **Límite fuerte:** WebFetch no abrió nada. Las dos primeras páginas (dergipark.org.tr y web.phys.ksu.edu) respondieron que el host no está permitido en la red de la sesión, y paré ahí, como pide la regla del entorno. Todo lo que sigue sale de resúmenes y fragmentos que devolvió el buscador. **No leí ningún texto completo.** Por eso nada puede quedar como «documentado».
- Para abrir los textos hay que permitir al menos: `dergipark.org.tr`, `web.phys.ksu.edu`, `funes.uniandes.edu.co`, `periodicoscientificos.ufmt.br`, `laur.lau.edu.lb`, `digitalcommons.montclair.edu`, `files.eric.ed.gov`.

### De dónde salen los datos

| Fuente | Muestra | Instrumento | Qué aporta | Qué leí |
| --- | --- | --- | --- | --- |
| Borji, Erfani y Font (2020). A combined application of APOS and OSA to explore undergraduate students' understanding of polar coordinates. *IJMEST* 51(3), 405–423. DOI 10.1080/0020739X.2019.1578904 | 34 universitarios | 7 tareas de polares | La mayoría tuvo dificultades con las tareas prácticas y para graficar curvas polares; la trigonometría débil causó fallos. El resumen no menciona r negativo (eso solo salió en un fragmento del buscador; no confirmado). Sin cifras por tarea en lo que vi | Resumen (fragmentos del buscador) |
| Habre (2017). Students' challenges with polar functions: covariational reasoning and plotting in the polar coordinate system. *IJMEST* 48(1), 48–66. DOI 10.1080/0020739X.2016.1220027; https://laur.lau.edu.lb:8443/xmlui/handle/10725/4239 | Un curso de cálculo de 2.º año de la Lebanese American University, Líbano (tamaño no visto) | Gráfica polar a partir de la cartesiana r(θ) | Coordinar el valor de una variable con el cambio de la otra salió bien; coordinar el **sentido** de cambio costó más, sobre todo con r negativo. Dice que hay poca investigación | Resumen |
| Moore, Paoletti y Musgrave (2014). Complexities in students' construction of the polar coordinate system. *Journal of Mathematical Behavior* 36, 135–149. DOI 10.1016/j.jmathb.2014.10.001; https://digitalcommons.montclair.edu/mathsci-facpubs/57 | Futuros profesores de secundaria (experimento de enseñanza; su trabajo de 2013 habla de 2) | Experimento de enseñanza | El significado que dan a la medida del ángulo condiciona cómo arman el sistema polar; su modo cartesiano de pensar se vuelve un problema al pasar a polares | Resumen |
| Montiel, Vidakovic y Kabael (2008). Relationship between students' understanding of functions in Cartesian and polar coordinate systems. *Investigations in Mathematics Learning* 1(2), 52–70. DOI 10.1080/24727466.2008.11790283 | Universitarios (no visto) | Cuestionario y entrevistas (según citas) | Las ideas erróneas sobre función en cartesianas se trasladan a polares | Citas de terceros (Kabael, 2015) |
| Kabael (2015). Analysis II students' construction of polar functions. *Necatibey Eğitim Fakültesi Elektronik Fen ve Matematik Eğitimi Dergisi* (Dergipark) | Estudiantes de Análisis II, Turquía (no visto) | APOS | El nivel de comprensión de función se relaciona con la construcción de la función polar; a diferencia de Montiel y otros, no aparecen ideas erróneas nuevas | Resumen y fragmentos |
| Montiel, Wilhelmi, Vidakovic y Elstak (2009). Using the onto-semiotic approach to identify and analyze mathematical meaning when transiting between different coordinate systems in a multivariate context. *Educational Studies in Mathematics* 72(2), 139–160. DOI 10.1007/s10649-009-9184-2 | Universitarios de cálculo multivariable | Respuestas a tareas en polares, cilíndricas y esféricas | Marco de análisis; sin resultados de alumnos en lo que vi | Resumen |
| Sayre y Wittmann (2008). Plasticity of intermediate mechanics students' coordinate system choice. *Phys. Rev. ST Phys. Educ. Res.* 4, 020105. DOI 10.1103/PhysRevSTPER.4.020105 | Estudiantes de mecánica intermedia, Universidad de Maine | Entrevistas en grupo y sesiones de tareas (péndulo simple) | Persisten en usar cartesianas aunque no convengan; deducen en vez de recordar los detalles del sistema polar | Resumen |
| Artículo de *REAMEC* 3(1) (2015), autores por confirmar (el buscador lo atribuyó a Ruiz Mendoza y Martínez Flores, pero el revisor no vio esos nombres). https://periodicoscientificos.ufmt.br/ojs/index.php/reamec/article/download/5306/3501/16900 | Estudiantes de cálculo de varias variables de la Universidad Autónoma de Nuevo León, México, que habían reprobado (semestre 2014-2015; tamaño no visto) | Encuesta sobre dificultades | Lista dificultades en polares (simetría, identificar gráficas, límites de integración para áreas, intersección de curvas). Un 56 % junto a la pregunta por la mayor dificultad: categoría no confirmada | Fragmento del buscador |
| Owusu, Bonyah y Arthur (2023). The effect of GeoGebra on university students' understanding of polar coordinates. *Cogent Education* 10(1), 2177050. DOI 10.1080/2331186X.2023.2177050 | 84 universitarios de Ghana (42 y 42) | Cuasiexperimento, pre y postest | GeoGebra mejora más que la clase tradicional; no describe errores concretos en lo que vi | Resumen |
| Zengin y Tatar (2015). The teaching of polar coordinates with dynamic mathematics software. *IJMEST* 46(1), 127–139. DOI 10.1080/0020739X.2014.904529 | 33 futuros profesores, Turquía, 11 semanas | Prueba de conocimientos y entrevista | Efecto positivo del software; sin lista de errores en lo que vi | Resumen |
| Distéfano, Aznar y Pochulu (2012). Errores asociados a la representación geométrica-vectorial de números complejos. *Unión* 30, 61–80. https://funes.uniandes.edu.co/wp-content/uploads/tainacan-items/32454/1159053/Dist25C325A9fano2012Errores.pdf | Curso universitario de álgebra, Argentina | Análisis ontosemiótico de producciones | Errores al pasar entre representaciones de complejos; puede tener datos de argumento (no visto) | Ficha del buscador |
| Guías de enseñanza y foros (RevisionDojo, Physics Forums, diagnósticos de IB) | — | — | Describen el error de arctan en el cuadrante equivocado como el más común en el argumento de complejos; sin datos medidos | Fragmentos; no es evidencia |

**Cautelas.** Las muestras son universitarias o de futuros profesores; ninguna cifra se traslada a postulantes. El 56 % del artículo de *REAMEC* (autores por confirmar) es de cálculo de varias variables, que el examen de admisión no pregunta, y no se sabe a qué categoría corresponde.

### Catálogo con respaldo

Respaldo: **documentado** (cifra leída en el texto completo de un estudio publicado), **parcial** (estudio que nombra el error, leído solo en resumen o cita, o sin cifra) o **hipótesis** (no encontré nada que corresponda al error concreto).

| Código | Error (breve) | Qué dice la fuente (cifra exacta y muestra) | Fuente | Qué leí | Respaldo propuesto |
| --- | --- | --- | --- | --- | --- |
| CP1 | Cuadrante = ⌊θ/90°⌋, sin sumar 1 | Nada | — | — | Hipótesis |
| CP2 | Reduce el ángulo al primer cuadrante para ubicar el punto | Nada específico; Borji y otros (2020) atribuyen fallos a la trigonometría débil, sin detallar | Borji y otros (2020) | Resumen | Hipótesis |
| CP3 | Con r < 0 ubica (|r|; θ): ignora el signo | Coordinar el sentido de cambio fue más difícil «sobre todo cuando r es negativo», en un curso de cálculo de 2.º año (sin cifra en el resumen). Borji y otros (2020) no lo mencionan en su resumen | Habre (2017) | Resumen | Parcial, solo por Habre (la dificultad con r < 0 está nombrada; la forma concreta «ignora el signo» no se ve en el resumen) |
| CP4 | Con r < 0, (|r|; −θ): refleja en el eje x | Nada sobre esta forma concreta (ver CP3) | — | — | Hipótesis |
| CP5 | Con r < 0, (|r|; 180° − θ): refleja en el eje y | Nada sobre esta forma concreta (ver CP3) | — | — | Hipótesis |
| CP6 | Con r < 0 suma 90° en vez de 180° | Nada | — | — | Hipótesis |
| CP7 | Al cambiar el signo de r deja θ igual | Nada sobre esta forma concreta (ver CP3) | — | — | Hipótesis |
| CP8 | Al cambiar el signo de r, θ → −θ | Nada | — | — | Hipótesis |
| CP9 | Mide θ desde el eje vertical | Moore y otros (2014): el significado de medida del ángulo condiciona cómo arman el sistema; no dice «desde la vertical» | Moore, Paoletti y Musgrave (2014) | Resumen | Hipótesis (relación débil; no se fuerza) |
| CP10 | θ = arctan(y/x) de la calculadora, sin corregir el cuadrante | Solo guías de enseñanza y foros, sin datos | Guías (RevisionDojo, IB) | Fragmentos | Hipótesis |
| CP11 | θ = arctan(x/y) | Nada | — | — | Hipótesis |
| CP12 | Toma el ángulo agudo con el eje x como θ | Nada medido; las guías lo describen junto a CP10 | Guías | Fragmentos | Hipótesis |
| CP13 | r = x² + y², sin raíz | Nada | — | — | Hipótesis |
| CP14 | x = cos θ, y = sen θ: olvida r | Nada específico; «falta de conocimiento trigonométrico» en general | Borji y otros (2020) | Resumen | Hipótesis |
| CP15 | r = a cos θ como circunferencia de centro en el polo y radio |a| | Graficar curvas polares fue difícil para la mayoría de 34 (sin desglose por curva) | Borji y otros (2020) | Resumen | Hipótesis (la dificultad general no identifica este error) |
| CP16 | Centro en (a; 0) y radio |a| | Nada | — | — | Hipótesis |
| CP17 | Cruza cos y sen: centro en el otro eje | Nada | — | — | Hipótesis |
| CP18 | Con a < 0, centro como si a fuera positivo | Nada específico; relacionado con la dificultad de r negativo (CP3) | — | — | Hipótesis |
| CP19 | Cartesiana de r = a cos θ: x² + y² = a | Nada | — | — | Hipótesis |
| CP20 | √(x² + y²) = ax ⟹ x² + y² = a²x² | Nada | — | — | Hipótesis |
| CP21 | La rosa siempre tiene n pétalos | Nada | — | — | Hipótesis |
| CP22 | La rosa siempre tiene 2n pétalos | Nada | — | — | Hipótesis |
| CP23 | El pétalo mide |a|/2 | Nada | — | — | Hipótesis |
| CP24 | Cruza a y n (a como número de pétalos) | Nada | — | — | Hipótesis |
| CP25 | θ = k es una semirrecta | Nada medido (es además una convención que varía entre textos) | — | — | Hipótesis |
| CP26 | θ = k es una circunferencia | Nada | — | — | Hipótesis |
| CP27 | θ = k es una recta horizontal, como y = k | Moore y otros (2014) y Montiel y otros (2008): el modo cartesiano de pensar se traslada y estorba en polares; no mencionan θ = k | Moore, Paoletti y Musgrave (2014); Montiel, Vidakovic y Kabael (2008) | Resumen; cita de terceros | Hipótesis (el mecanismo general es plausible; no se fuerza la correspondencia) |

Códigos ajenos que usa el motor: TR11, TR12 (trigonometría) y AL9 (álgebra) conservan el respaldo de sus informes; no encontré nada nuevo de ellos en polares.


## 3. Matrices y determinantes

Plantilla: `plantillas/matrices/`.


7 de noviembre de 2026 · Da respaldo (o falta de respaldo) a los códigos MT1 a MT34 de `plantillas/matrices/motor.js` («El plano que se deforma»). AL16 y AL17, que el motor también usa, ya están en `docs/investigacion/algebra-funciones-ideas-erroneas.md` y no se repiten aquí.

### Resumen en cinco líneas

1. **Casi todo lo que el motor usa es hipótesis de aula.** La investigación en enseñanza del álgebra lineal (Dorier, Sierpinska, Hillel, Harel, Larson y Zandieh) estudia sobre todo espacios vectoriales, independencia lineal y transformaciones, no los errores de cálculo de un examen de admisión (orden del producto, Sarrus, inversa 2 × 2, Cramer).
2. **El único error con cifra cerca de nuestros códigos es det(kA) = k·det A (MT4).** Aygör y Özdağ (2012, 60 universitarios turcos) lo dan como ejemplo de su hallazgo principal, confundir la matriz con su determinante; la cifra de 34 de 116 profesores con «errores similares» solo aparece en una reseña de arXiv (2411.03332), que la atribuye a Kazunga y Bansilal (2018); el resumen del capítulo no la trae, así que queda sin confirmar. MT4 queda como PARCIAL.
3. **Kazunga y Bansilal (Zimbabue, 116 profesores en servicio) son la fuente con más datos.** Según los resúmenes, más de la mitad tuvo problemas con el determinante de la inversa, con la transpuesta y con las propiedades del determinante (2018), y más del 50 % con el producto de una matriz fila por una matriz columna (2017). Los resúmenes no dicen qué respuesta errónea dieron, así que no se pueden amarrar a un código.
4. **La no conmutatividad (AB = BA, MT2, MT34) no tiene ningún estudio con porcentaje.** Solo aparece en textos de enseñanza y en un caso de aula informal con 12 alumnos.
5. **Los estudios indonesios de secundaria (clase XI) dan porcentajes por categoría** (conceptual, procedimental, técnico; Kastolan, Newman o Watson), no por error concreto. Sirven para decir que el producto, el determinante y la inversa son los puntos donde más se falla, no para fijar un distractor.

### Cómo se hizo y su límite

Hice 20 búsquedas web en inglés, español, turco e indonesio (linear algebra education, determinant misconceptions, det(A + B), AB = BA, Sarrus, Cramer, inversa, transpuesta, composición de transformaciones, tesis latinoamericanas). **No abrió ningún texto completo**: doi.org, arxiv.org, par.nsf.gov y researchspace.ukzn.ac.za devolvieron «host no permitido» en la red de esta sesión, y no seguí probando otros sitios. Todo lo que sigue sale de resúmenes, fichas y citas de otros autores que devolvió el buscador. Por eso **ningún código llega a «documentado»**: según la regla del informe, «documentado» pide una cifra leída en el texto completo.

Las fuentes con muestra son de profesores en servicio (Kazunga y Bansilal) o de universitarios (Aygör y Özdağ), no de postulantes. Si ellos fallan, es razonable esperar que un postulante también falle, pero el porcentaje no se traslada. No encontré ningún estudio peruano sobre matrices y determinantes; de la PUCP hay trabajos sobre errores en sistemas de ecuaciones lineales y en espacio generado (estudiantes de ingeniería), que no abrí.

### De dónde salen los datos

| Fuente | Muestra | Instrumento | Qué aporta | Qué leí |
| --- | --- | --- | --- | --- |
| Aygör y Özdağ (2012), «Misconceptions in linear algebra: the case of undergraduate students», *Procedia – Social and Behavioral Sciences* 46, 2989–2994. DOI 10.1016/j.sbspro.2012.05.602 | 60 universitarios de la Universidad Técnica Yıldız (Turquía) | Problemas de matrices y determinantes | Hallazgo principal: confundir la matriz con su determinante. Ejemplo citado: «si A = kB, entonces det A = k det B». Otro ejemplo citado: creer que intercambiar dos filas cambia el signo de la matriz y no del determinante | Cita de terceros (un artículo de arXiv sobre tutorías, 2411.03332, y un trabajo sobre applets de GeoGebra), vistas en fragmentos del buscador |
| Kazunga y Bansilal (2018), «Misconceptions about determinants», capítulo en Stewart, Andrews-Larson, Berman y Zandieh (eds.), *Challenges and Strategies in Teaching Linear Algebra*, Springer. DOI 10.1007/978-3-319-66811-6_6 | 116 profesores de matemática en servicio (Zimbabue) | Cuestionario escrito | Más de la mitad tuvo dificultades con el determinante de la inversa, la transpuesta y la aplicación de las propiedades del determinante; los errores vienen de aplicar reglas fuera del dominio donde valen. La cifra de «34 participantes con errores similares» al de det(kA) solo aparece en arXiv 2411.03332 (reseña sobre tutorías en álgebra lineal), que la atribuye a este estudio; el resumen del capítulo no la trae: **sin confirmar** | Resumen; el 34, cita de terceros sin confirmar |
| Kazunga y Bansilal (2017), «Zimbabwean in-service mathematics teachers' understanding of matrix operations», *The Journal of Mathematical Behavior* | Los mismos 116 profesores | Cuestionario, análisis APOS | Suma, producto por escalar y producto de matrices interiorizados como procesos por muchos; más del 50 % tuvo problemas con el producto de una matriz fila por una matriz columna (resultado escalar) | Resumen |
| Kazunga y Bansilal (2020), «An APOS analysis of solving systems of equations using the inverse matrix method», *Educational Studies in Mathematics* 103(3), 339–358. DOI 10.1007/s10649-020-09935-6 | Profesores en servicio (muestra no confirmada) | APOS | Calculan determinantes, pero fallan más con la inversa y con resolver sistemas por la inversa; sobregeneralización y fórmulas mal aplicadas | Fragmentos del resumen |
| Kartini y Alawiyah (2023), «Students' errors in solving matrix multiplication problems based on Kastolan theory», *Mosharafa* 12(1). DOI 10.31980/mosharafa.v12i1.1811 | Alumnos de clase XI de una escuela técnica de Indonesia (el número, 28, y la escuela, SMK Perpajakan Riau, **sin confirmar**) | Prueba y entrevistas, cualitativo | La mayoría falla en el producto de matrices; errores conceptuales, procedimentales y técnicos. No vi los porcentajes | Resumen |
| Khairani y Kartini (2021), *Mosharafa* 10(3), 505–514. DOI 10.31980/mosharafa.v10i3.981. URL: https://karya.brin.go.id/15654/1/Jurnal_Bella%20Putri%20Khairani_Universitas%20Riau.pdf | Alumnos de XI MIA 1 del SMAN 15 Pekanbaru (Indonesia) | Prueba | Errores de hechos 18,3 %, conceptuales 26,1 %, de principios 25,6 %, de operación 25 % (las cuatro cifras confirmadas por el revisor) | Cita del buscador; cifras confirmadas en la revisión |
| Anggriani, W., «Analisis Kesalahan Siswa dalam Menyelesaikan Soal Matriks Ditinjau dari Pendekatan Realistic Mathematics Education (RME)», *JUDIKA*, Indonesia. URL: https://journal.ipm2kpe.or.id/index.php/JUDIKA/article/view/19778 | Alumnos de SMA | Prueba | Errores de comprensión 9,09 %, conceptuales 27,27 %, procedimentales 42,42 %, de operación 45,45 %; el error que más pesa es de cálculo, sobre todo en producto, determinante e inversa. **Ojo:** las cifras coinciden con la revisión, pero el texto extraído es incoherente (el 27,27 % aparece también como comprensión «alta»); hay que revisarlas en la tabla original | Fragmentos del resumen |
| Estudio de clase XI en *Proximal*, Indonesia. URL: https://e-journal.my.id/proximal/article/view/2136 | Pocos sujetos (alto, medio y bajo rendimiento) | Prueba, cualitativo | Errores de principio en producto, determinante e inversa; errores de concepto en transpuesta, igualdad de matrices y producto | Fragmentos del resumen |
| Kinanti, Az Zahra Lintang (2024), tesis de licenciatura en educación de la física, Universitas Jember (sustentada en enero de 2024). URL: https://repository.unej.ac.id/handle/123456789/119707 | Alumnos de secundaria (física, circuitos de dos mallas) | Prueba | Cramer con Sarrus: errores conceptuales 24 %, de uso de datos 5,33 %, de estrategia 21,33 %, de cálculo 22,66 % | Ficha del repositorio, vista en el buscador |
| Lorenz y Wirths (2018), «Sarrus rules and dihedral groups», arXiv 1809.08948 | Sin muestra (matemática) | — | Nombra y estudia como objeto matemático la «falsa regla de Sarrus» para n × n. Que diga que los alumnos la usan en 4 × 4 lo dijo el resumen del buscador, pero **no está confirmado** | Fragmento del resumen; afirmación sobre alumnos sin confirmar |
| Larson y Zandieh (2013), «Three interpretations of the matrix equation Ax = b», *For the Learning of Mathematics* (revista por confirmar) | — | Marco teórico | Tres lecturas de Ax = b: combinación lineal, sistema y transformación | Citas de terceros |
| Proyecto IOLA (Inquiry-Oriented Linear Algebra), trabajos sobre el determinante. URL: https://par.nsf.gov/servlets/purl/10566425 | Aulas universitarias de EE. UU. | Diseño de tareas | El determinante 2 × 2 como razón de áreas con signo entre la imagen y la figura original; «hay relativamente pocos artículos sobre cómo entienden los alumnos el determinante» | Fragmentos del resumen |
| Dorier (ed., 2000), *On the Teaching of Linear Algebra*, Kluwer: capítulos de Dorier, Robert, Robinet y Rogalski (obstáculo del formalismo), Hillel (modos de descripción) y Sierpinska | Encuestas y estudios en Francia y Canadá | Varios | Marco general: el alumno opera sobre la forma de las expresiones sin referirlas a nada; no hay datos sobre los errores de MT | Fichas y citas de terceros |
| Carlson (1993), citado por terceros | Universitarios de EE. UU. | — | Los alumnos suelen acertar en algoritmos simples (producto de matrices, sistemas) y fallar en independencia y transformaciones | Cita de terceros |
| Caso de aula sin autor confirmado (sitio «Inquiry Maths») | 12 alumnos que ya sabían multiplicar matrices | Indagación en clase | Se preguntan si AB = BA y lo prueban con figuras con y sin simetría | Fragmento de una página de enseñanza, sin revisión por pares |

### Catálogo con respaldo

Respaldo: **documentado** (cifra leída en el texto completo), **parcial** (cifra o descripción vista en resumen o cita de terceros, o estudio cualitativo) o **hipótesis** (sin correspondencia concreta en una fuente).

| Código | Error (breve) | Qué dice la fuente (cifra exacta y muestra) | Fuente | Qué leí | Respaldo propuesto |
| --- | --- | --- | --- | --- | --- |
| MT1 | Multiplica elemento a elemento: (AB)ᵢⱼ = aᵢⱼ·bᵢⱼ | Ninguna cifra. Un caso de enseñanza de la Universidad de Georgia describe a un futuro profesor que multiplica entrada por entrada, sin dato de frecuencia | Caso «Situations» de UGA (jwilson.coe.uga.edu) | Fragmento | Hipótesis |
| MT2 | Calcula BA en lugar de AB (cree que el orden no importa) | Sin estudio con porcentaje; solo textos de enseñanza y un caso de aula con 12 alumnos | Caso «Inquiry Maths» | Fragmento | Hipótesis |
| MT3 | det(A + B) = det A + det B | Ninguna cifra. No encontré que Aygör y Özdağ lo reporten. Kazunga y Bansilal (2018): más de la mitad de 116 profesores con dificultades en «propiedades del determinante», sin decir cuáles | Kazunga y Bansilal (2018) | Resumen | Hipótesis (pista general en Kazunga y Bansilal) |
| MT4 | det(kA) = k·det A | Aygör y Özdağ (2012), 60 universitarios: «muchos estudiantes concluyen: si A = kB, entonces det A = k det B», como ejemplo de su hallazgo principal. Sin porcentaje en lo que vi. La cifra de 34 de 116 profesores con «errores similares» solo aparece en arXiv 2411.03332, que la atribuye a Kazunga y Bansilal (2018); **sin confirmar** | Aygör y Özdağ (2012); Kazunga y Bansilal (2018) | Cita de terceros | **Parcial** |
| MT5 | Determinante 2 × 2 como ad + bc (suma las diagonales) | Ninguna cifra. Los estudios indonesios ponen el error de cálculo en el determinante como el más frecuente (p. ej., 45,45 % de errores de operación en Anggriani, *JUDIKA*, cifra con texto extraído incoherente), pero no dicen cuál | Anggriani (*JUDIKA*) | Fragmentos | Hipótesis |
| MT6 | Sarrus: suma las seis diagonales | Ninguna cifra | — | — | Hipótesis |
| MT7 | Inversa: usa la adjunta sin dividir entre det | Ninguna cifra. Kazunga y Bansilal (2020): más dificultad con la inversa que con el determinante, sin detalle del error | Kazunga y Bansilal (2020) | Fragmentos del resumen | Hipótesis |
| MT8 | Cree que BA existe y tiene el orden de AB al revés | Ninguna cifra | — | — | Hipótesis |
| MT9 | (AB)ᵀ = AᵀBᵀ | Ninguna cifra. Kazunga y Bansilal (2018) mencionan dificultades con la transpuesta en el contexto del determinante; *Proximal* reporta errores de concepto en la transpuesta. Ninguno dice que sea este | Kazunga y Bansilal (2018); *Proximal* | Resumen; fragmentos | Hipótesis |
| MT10 | Cambia i y j: lee aᵢⱼ como aⱼᵢ | Ninguna cifra | — | — | Hipótesis |
| MT11 | Al construir aᵢⱼ, da el orden columnas × filas | Ninguna cifra | — | — | Hipótesis |
| MT12 | Escribe la matriz por columnas (da la transpuesta) | Ninguna cifra | — | — | Hipótesis |
| MT13 | Inversa 2 × 2: intercambia a y d pero no cambia el signo de b y c | Ninguna cifra | — | — | Hipótesis |
| MT14 | Multiplica fila por fila (A·Bᵀ) | Ninguna cifra | — | — | Hipótesis |
| MT15 | El orden de AB sale de los números de en medio (n × p) | Ninguna cifra. Kazunga y Bansilal (2017): más del 50 % de 116 profesores con problemas en fila × columna (resultado escalar), pero el resumen no dice qué orden dieron | Kazunga y Bansilal (2017) | Resumen | Hipótesis (pista en Kazunga y Bansilal 2017) |
| MT16 | Solo se multiplican matrices del mismo orden | Ninguna cifra. Un estudio de 3 alumnos de clase XI (Palu, Indonesia) describe un error conceptual al multiplicar matrices de órdenes distintos, sin decir en qué sentido | Estudio de SMA Negeri 5 Palu | Fragmento | Hipótesis |
| MT17 | La composición de dos transformaciones es A + B | Ninguna cifra | — | — | Hipótesis |
| MT18 | Determinante 2 × 2 como bc − ad | Ninguna cifra | — | — | Hipótesis |
| MT19 | Determinante 2 × 2 como ab − cd (por filas) | Ninguna cifra | — | — | Hipótesis |
| MT20 | Quita el signo al determinante («un área no es negativa») | Ninguna cifra. IOLA trabaja el determinante como área con signo, sin cifras de error | Proyecto IOLA | Fragmentos | Hipótesis |
| MT21 | «No tiene inversa si un elemento es 0» (k = 0) | Ninguna cifra | — | — | Hipótesis |
| MT22 | Inversa 2 × 2: cambia los signos de b y c sin intercambiar a y d | Ninguna cifra | — | — | Hipótesis |
| MT23 | Inversa como 1/aᵢⱼ elemento por elemento | Ninguna cifra | — | — | Hipótesis |
| MT24 | det(kA) = k^(n²)·det A | Ninguna cifra | — | — | Hipótesis |
| MT25 | det(Aᵀ) = −det A | Ninguna cifra. Kazunga y Bansilal (2018): más de la mitad de 116 profesores con dificultades con «la transpuesta» al trabajar determinantes; el resumen no dice qué respuesta dieron | Kazunga y Bansilal (2018) | Resumen | Hipótesis (pista en Kazunga y Bansilal 2018) |
| MT26 | det(BA) = −det A·det B (el orden cambia el signo) | Ninguna cifra | — | — | Hipótesis |
| MT27 | Determinante 3 × 3 = producto de la diagonal principal | Ninguna cifra | — | — | Hipótesis |
| MT28 | Sarrus: secundarias − principales | Ninguna cifra | — | — | Hipótesis |
| MT29 | Cramer: x = Δx (no divide entre Δ) | Ninguna cifra que corresponda. Kinanti (2024), cifras confirmadas en la revisión: errores de cálculo 22,66 % y conceptuales 24 % al usar Cramer, sin detalle | Kinanti (2024) | Ficha del repositorio | Hipótesis |
| MT30 | Cramer: x = Δ/Δx (cociente al revés) | Ninguna cifra | — | — | Hipótesis |
| MT31 | Cramer: usa la otra columna (da y en lugar de x) | Ninguna cifra | — | — | Hipótesis |
| MT32 | (AB)ᵀ = AB (no transpone) | Ninguna cifra | — | — | Hipótesis |
| MT33 | Composición como (det B)·A, como si B estirara igual en todas las direcciones | Ninguna cifra | — | — | Hipótesis |
| MT34 | Composición en el orden en que actúan (B·A en vez de A·B) | Ninguna cifra; solo textos de enseñanza que dicen que es frecuente multiplicar en el orden de lectura | Páginas de enseñanza | Fragmentos | Hipótesis |

**Conteo:** 0 documentados, 1 parcial (MT4), 33 hipótesis (MT3, MT9, MT15 y MT25 con una pista general en Kazunga y Bansilal que no alcanza para amarrarlos).

**Nota para el motor.** El comentario de `motor.js` dice que MT1 a MT32 son hipótesis y que `docs/investigacion/` no trae datos sobre matrices; el motor ya usa MT33 y MT34. Si este informe se integra, conviene decir «MT1 a MT34» y apuntar a este informe, con MT4 como parcial.


## 4. Binomio de Newton

Plantilla: `plantillas/binomio-newton/`.


7 de noviembre de 2026 · Para `plantillas/binomio-newton/` («El tablero de los caminos»). Revisa los errores BN1 a BN27 que usa `motor.js`. AL8 y AL11 ya están en `docs/investigacion/algebra-funciones-ideas-erroneas.md` y aquí no se repiten. El error de orden, la enumeración sin sistema y el sesgo de equiprobabilidad están en `docs/investigacion/aritmetica-razonamiento-ideas-erroneas.md` (AR17, AR18 y AR20); aquí solo se dice cómo se relacionan con los BN.

### Resumen en cinco líneas

1. **No hay ningún estudio empírico con cifras sobre errores en el desarrollo del binomio.** No apareció ninguno sobre término general, término central, término independiente, número de términos ni suma de coeficientes, ni en inglés ni en español, turco o indonesio. La literatura de investigación trata la combinatoria (contar), no el teorema del binomio como técnica de álgebra.
2. **Lo que sí está estudiado es contar.** Hay 720 alumnos españoles de 14 y 15 años (Batanero, Navarro-Pelayo y Godino, 1997; Navarro-Pelayo y otros, 1996). Allí se describen el error de orden (variación en lugar de combinación), el de repetición y la enumeración sin sistema. Esto respalda BN12, aunque solo como **parcial**, porque leí resúmenes y citas, no el texto completo.
3. **Contar es difícil incluso para quien estudió combinatoria.** Entre universitarios que ya habían llevado un curso de combinatoria, solo el 40 % de las soluciones iniciales fue correcto, 43 de 108 (Eizenberg y Zaslavsky, 2004). La cifra la vi citada por Lockwood (2015).
4. **El tablero de Galton con «todos los casilleros igual» (BN21) corresponde al sesgo de equiprobabilidad.** El mejor indicio es Begué y otros (2020): 127 bachilleres frente a una distribución binomial, con el sesgo de equiprobabilidad mencionado en el resumen. Se suma Lecoutre (1992, más de 1000 estudiantes), ya recogido en AR20. Sigue como **parcial**, porque solo leí resúmenes.
5. **Los errores de técnica (índice corrido t(k+1) contra k, no elevar el 2 de (2x), perder el signo de (−3)ʳ) solo aparecen en guías docentes y en blogs de examinadores** (Cambridge OCR, guías del IB), sin muestra ni cifra. Por eso quedan como **hipótesis** con apoyo de práctica docente. Balance: 0 documentados, 2 parciales y 25 hipótesis.

### Cómo se hizo y su límite

- Leí la cabecera de `plantillas/binomio-newton/motor.js` (qué calcula cada error BN y en qué función aparece), los informes de álgebra (AL8 y AL11) y de aritmética (AR17 a AR20), y el formato de `trigonometria-ideas-erroneas.md`.
- Hice unas 25 búsquedas web en inglés, español, turco e indonesio: binomial theorem errors, binomial expansion misconceptions, Pascal's triangle, Batanero, Navarro-Pelayo y Godino, Lockwood, Annin y Lai, Eizenberg y Zaslavsky, Fischbein, Galton, tesis latinoamericanas y peruanas.
- **Límite fuerte: no pude abrir ningún texto completo.** WebFetch y curl fueron rechazados por la red de la sesión: ugr.es, funes.uniandes.edu.co, stat.auckland.ac.nz y arxiv.org dieron «host no permitido» o un 403 del proxy. Todo sale de resúmenes, fichas y frases citadas que devolvió el buscador. Por eso nada puede pasar de «parcial».
- El buscador resume las páginas con un modelo. Las cifras que copio son las que ese resumen atribuye a la fuente, y hay que confirmarlas en el original antes de usarlas en una decisión.
- No forcé correspondencias. Un error BN se marca «parcial» solo si una fuente describe el mismo error de forma concreta. Si solo describe una dificultad general, queda como hipótesis y se anota la relación.

### De dónde salen los datos

| Fuente | Muestra | Instrumento | Qué aporta | Qué leí |
| --- | --- | --- | --- | --- |
| Batanero, Navarro-Pelayo y Godino (1997). *Effect of the implicit combinatorial model on combinatorial reasoning in secondary school pupils*. Educational Studies in Mathematics 32, 181–199. [Página del grupo](https://www.ugr.es/~batanero/pages/ARTICULOS/Implicitmodel.htm) | 720 alumnos de 14 y 15 años (Granada), con y sin instrucción en combinatoria | Cuestionario de problemas combinatorios simples (modelos de selección, partición y colocación); ANOVA y análisis cualitativo | El modelo implícito del enunciado cambia la dificultad; los tipos de error (orden, repetición, tipo de objeto, operación aritmética equivocada) dependen de las variables de la tarea | Resumen (vía buscador); el texto completo fue rechazado por la red |
| Navarro-Pelayo, Batanero y Godino (1996). *Razonamiento combinatorio en alumnos de secundaria*. Educación Matemática 8(1), 26–39. [Funes](https://funes.uniandes.edu.co/wp-content/uploads/tainacan-items/32454/1141903/Razonamiento1996Navarro.pdf) | La misma muestra de 720 | Cuestionario de problemas combinatorios simples (número de problemas por confirmar) | «Dificultad bastante generalizada»; clasificación de errores por modelo | Resumen y citas; el PDF fue rechazado por la red |
| Roa (2000), tesis doctoral, Universidad de Granada; Roa, Batanero y Godino (2001 y 2003) | Estudiantes de 4.º y 5.º de la licenciatura de Matemáticas: 91 en el artículo «Dificultad de los problemas combinatorios en estudiantes con preparación matemática avanzada» y 120 en la ponencia del SEIEM de 2001 (Almería) | Cuestionario de 13 problemas (11 simples y 2 compuestos) | Los problemas combinatorios son difíciles incluso con preparación avanzada; promedio de 5,5 aciertos en 11 problemas simples (2003) | Citas de terceros. La tesis de Roa es la fuente de los porcentajes 37,8 % y 66,6 % del informe de aritmética, que no volví a ver |
| Fischbein y Gazit (1988), ZDM 20(5), 193–198, citado en Batanero y otros (1997) | Alumnos israelíes (no vi la muestra) | Problemas de permutaciones, variaciones y combinaciones, antes y después de enseñar | Después de enseñar, las combinaciones fueron las de menor frecuencia de acierto | Cita de terceros (frase del resumen del buscador) |
| Eizenberg y Zaslavsky (2004). *Students' verification strategies for combinatorial problems*. Mathematical Thinking and Learning 6(1), 15–36. DOI [10.1207/s15327833mtl0601_2](https://doi.org/10.1207/s15327833mtl0601_2) | 14 universitarios que ya habían llevado al menos un curso de combinatoria; 10 problemas | Entrevistas | Solo el 40 % (43 de 108) de las soluciones iniciales fue correcto (la cita la ubica en la p. 31, sin confirmar); los errores se codifican como de procedimiento o conceptuales; cinco estrategias de verificación | Resumen (la muestra y el diseño) y cita de terceros (el 40 %, en Lockwood, 2015) |
| Lockwood y Gibson (2016). *Combinatorial tasks and outcome listing*. Educational Studies in Mathematics 91(2), 247–270. DOI [10.1007/s10649-015-9664-5](https://link.springer.com/10.1007/s10649-015-9664-5) | Universitarios novatos en conteo (no vi la cifra) | Problemas de conteo, análisis de si listan los resultados | Listar aunque sea en parte el conjunto de resultados se asocia a más aciertos. Apoya la idea de la escena: mostrar las palabras «aabb» que se cuentan | Resumen |
| Lockwood (2013), modelo de pensamiento combinatorio (fórmulas, procesos de conteo y conjuntos de resultados) | Teórico, con entrevistas | — | Marco: el error viene de no mirar qué conjunto se está contando | Cita de terceros |
| Annin y Lai (2010). *Common errors in counting problems*. Mathematics Teacher 103(6), 402–409 | Sin muestra (artículo para docentes) | — | Contar de más y confundir cuándo importa el orden | Ficha y citas de terceros |
| Lecoutre (1992). *Cognitive models and problem spaces in "purely random" situations*. Educational Studies in Mathematics 23, 557–568. DOI [10.1007/BF00540060](https://doi.org/10.1007/BF00540060); Cañizares y Batanero (1998), ya en AR20 | Más de 1000 estudiantes (Lecoutre, 1992; «más de 600» es de un estudio anterior que ese artículo resume); 251 y 143 niños de 10 a 14 años (Cañizares y Batanero) | Ítems de dados y monedas | Sesgo de equiprobabilidad: todos los resultados de azar parecen igual de probables. La proporción «al menos la mitad» que cita AR20 no está confirmada | Ficha y resumen (vía el revisor); no las leí en esta sesión |
| Begué, Batanero, Gea y Díaz-Levicoy (2020). *High school students' reasoning when facing a binomial distribution*. Tangram 3(2), 27–50. DOI 10.30612/tangram.v3i2.10888 | 127 estudiantes españoles de bachillerato | Dar cuatro valores probables del número de éxitos de una binomial y justificarlos | El resumen menciona el sesgo de equiprobabilidad y creencias erróneas sobre el azar. Cifras del resumen: el 56,7 % estima bien la probabilidad, el 40,2 % nota la convergencia y la variabilidad y el 22 % no justifica. Ninguna de ellas mide el sesgo | Resumen (las cifras, vía el revisor) |
| Tatira (2021). *Mathematics education students' understanding of binomial series expansion based on the APOS theory*. EURASIA J. Math. Sci. Tech. Ed. 17(12). DOI 10.29333/ejmste/11287 | 159 estudiantes universitarios de educación matemática (Sudáfrica) | Evaluación escrita y APOS | Es el único estudio empírico hallado sobre el desarrollo binomial, pero trata la serie binomial (exponente negativo o fraccionario), no (a + b)ⁿ con n natural | Resumen, sin los errores ni las cifras |
| Cambridge OCR, blog de examinadores: [Binomial expansion pure and applied](https://ocr-live-prd95.cambridgeassessment.org.uk/blog/alevel-maths-binomial-expansion-pure-and-applied/) | Sin muestra | Observación de examinadores | «Los errores más comunes en este tipo de desarrollo aparecen cuando hay múltiplos o negativos»; ejemplo de un signo perdido | Fragmento |
| RevisionDojo, guías del IB Maths AA: [common mistakes](https://www.revisiondojo.com/blog/ib-maths-aa-binomial-theorem-common-mistakes) | Sin muestra | Guía comercial | Índice r contra término r + 1 («uno de los errores más comunes»), signos perdidos, potencias del coeficiente omitidas, 3ʳ en vez de (−3)ʳ | Fragmento; no es investigación |
| Matz (1982), ya en AL8 y AL11 | — | — | Extrapolación lineal: (a + b)ⁿ = aⁿ + bⁿ | No la leí aquí; ver el informe de álgebra |

**Cautelas.** Las muestras con cifras (720, 14 y 127) son españolas, israelíes o estadounidenses, y estudian el conteo, no el binomio. No encontré ningún trabajo peruano ni latinoamericano con datos sobre el binomio de Newton. Hay una revisión bibliográfica de la UDEP (Piura) sobre errores en expresiones algebraicas en secundaria, preuniversitario y universidad, pero no trata el binomio. Un trabajo con 19 alumnos de grado 10 compara el triángulo de Pascal con otros enfoques para un problema binomial; lo vi solo como referencia dentro de otro PDF.

### Catálogo

Respaldo: **documentado** (dato cuantitativo leído en el texto completo), **parcial** (correspondencia concreta, pero leída solo en resumen o cita, o sin cifra) o **hipótesis** (sin correspondencia concreta en una fuente con datos). «Práctica docente» quiere decir que el error aparece en guías o en blogs de examinadores sin muestra; no sube el respaldo.

| Código | Error (breve) | Qué dice la fuente (cifra exacta y muestra) | Fuente | Qué leí | Respaldo propuesto |
| --- | --- | --- | --- | --- | --- |
| BN1 | (a + b)ⁿ tiene n términos, no n + 1 (olvida el de k = 0) | Nada específico | — | — | Hipótesis |
| BN2 | Índice corrido: usa C(n, k + 1) en t(k+1), C(n + 1, k) en Pascal o C(n, k − 1) en Galton | Las guías del IB dicen que confundir el índice r con el número de término r + 1 es «uno de los errores más comunes»; sin muestra | RevisionDojo (guía IB); ejercicio de un alumno que desarrolla mal (2x − y)⁴ en un documento docente de Montana State (https://math.montana.edu/burroughs/documents/BinomialTheorem.pdf; material de clase, no dato) | Fragmento | Hipótesis (práctica docente) |
| BN3 | Olvida el coeficiente C(n, k) y escribe solo Aⁿ⁻ᵏBᵏ | Nada específico | — | — | Hipótesis |
| BN4 | (2x)ʲ = 2xʲ: no eleva el coeficiente de cada término | Las guías dicen que muchos errores en (2x − 3)⁵ vienen de no elevar el término completo; el IB menciona «omitir potencias numéricas»; sin muestra | RevisionDojo; guías de revisión (Save My Exams y otras) | Fragmento | Hipótesis (práctica docente). Es pariente de AL11 (el exponente no se reparte bien) |
| BN5 | La suma de la fila n de Pascal es n | Nada específico | — | — | Hipótesis |
| BN6 | La suma de la fila n es 2n | Nada específico | — | — | Hipótesis |
| BN7 | El término central de n par es t(n/2 + 2) (k = n/2 + 1: suma 1 dos veces) | Nada específico; es variante de BN2 | — | — | Hipótesis |
| BN8 | Pierde el signo: todos los términos positivos con (x − 2)ⁿ | El blog de examinadores de OCR dice que los errores más comunes aparecen «cuando hay múltiplos o negativos» y da el ejemplo de un signo olvidado; las guías IB mencionan «perder signos negativos» y 3ʳ en vez de (−3)ʳ; sin muestra ni cifra | Cambridge OCR (blog); RevisionDojo | Fragmento | Hipótesis (práctica docente; observación de examinadores sin datos) |
| BN9 | Con exponente negativo, suma los exponentes como positivos: eA(n − k) + \|eB\|k | Nada específico | — | — | Hipótesis |
| BN10 | Toma k igual al lugar: t_L con k = L | Es el mismo fenómeno que BN2 según las guías IB: un ejemplo dice que se sustituye r = 4 y eso da el quinto término; sin muestra | RevisionDojo | Fragmento | Hipótesis (práctica docente) |
| BN11 | Invierte los exponentes: AᵏBⁿ⁻ᵏ | Nada específico | — | — | Hipótesis |
| BN12 | n!/(n − k)!: cuenta las palabras como si importara el orden (variación en vez de combinación) | En 720 alumnos de 14 y 15 años se describe el «error de orden» y su dependencia del modelo implícito; el porcentaje no aparece en el resumen. Según el informe de aritmética (AR17), la tesis de Roa (2000) le da un 37,8 % en el grupo con instrucción; no lo vi. Fischbein y Gazit (1988): tras enseñar, las combinaciones fueron las de menor acierto. Annin y Lai (2010) y Lockwood: confundir cuándo importa el orden es un error común | Batanero, Navarro-Pelayo y Godino (1997); Navarro-Pelayo y otros (1996); Fischbein y Gazit (1988); Annin y Lai (2010) | Resumen y citas de terceros | Parcial (correspondencia concreta con AR17; la cifra está por leer en el original) |
| BN13 | n!/k!: olvida dividir entre (n − k)! | Batanero y otros (1997) incluyen «usar operaciones aritméticas incorrectas» entre los tipos de error, pero no se ve que sea este | Batanero y otros (1997), vía Lockwood y Gibson | Cita de terceros | Hipótesis (no hay correspondencia concreta) |
| BN14 | 2ⁿ: cuenta todas las palabras de n letras, no solo las que tienen k letras b | Se relaciona con «contar de más» (Annin y Lai) y con no fijarse en el conjunto de resultados (Lockwood), pero ninguna fuente describe este error | Annin y Lai (2010); Lockwood (2013) | Citas de terceros | Hipótesis |
| BN15 | En Pascal multiplica los dos números de arriba en vez de sumarlos | Nada específico | — | — | Hipótesis |
| BN16 | En Pascal copia el número de arriba sin sumarle el vecino | Nada específico | — | — | Hipótesis |
| BN17 | 2ⁿ términos: uno por palabra, sin juntar los semejantes | Nada específico | — | — | Hipótesis |
| BN18 | La suma de la fila n es n² | Nada específico | — | — | Hipótesis |
| BN19 | Cree que el término independiente es siempre el central | Nada específico | — | — | Hipótesis |
| BN20 | La suma de coeficientes es 2ⁿ aunque A y B tengan coeficientes distintos de 1 | Nada específico | — | — | Hipótesis |
| BN21 | Galton: todos los casilleros reciben lo mismo, bolitas/(n + 1) | Es el sesgo de equiprobabilidad. Indicio principal: con 127 bachilleres ante una distribución binomial, el resumen de Begué y otros (2020) menciona el sesgo de equiprobabilidad; ninguna de sus cifras (56,7 %, 40,2 %, 22 %) mide ese sesgo. Indicio por analogía: con dados, «todas las sumas de 2 a 12 valen 1/11» es el mismo error que «todos los casilleros valen 1/(n + 1)»; Lecoutre (1992) lo reporta en más de 1000 estudiantes (sin proporción confirmada) y, según AR20, Cañizares y Batanero lo hallan en cerca del 25 % de niños de 10 a 14 años. No hay estudio con el tablero de Galton | Begué, Batanero, Gea y Díaz-Levicoy (2020); Lecoutre (1992); Cañizares y Batanero (1998), según AR20 | Resúmenes (Begué y Lecoutre, vía el revisor); Cañizares y Batanero no leído en esta sesión | Parcial (sin cifra del sesgo leída en texto completo) |
| BN22 | Galton: la mitad de las bolitas cae en el casillero central | Nada específico. Begué y otros (2020) tratan la binomial, pero su resumen no menciona este error | — | Resumen | Hipótesis |
| BN23 | El término central de n par es t(n/2) | Nada específico; es variante de BN2 o BN10 | — | — | Hipótesis |
| BN24 | Con n impar da un solo central, t((n + 1)/2) | Nada específico | — | — | Hipótesis |
| BN25 | Con n impar da un solo central, t((n + 3)/2) | Nada específico | — | — | Hipótesis |
| BN26 | Con n impar dice que no hay término central porque n/2 no es entero | Nada específico | — | — | Hipótesis |
| BN27 | La suma de coeficientes es n | Nada específico | — | — | Hipótesis |

**Lo que se aprende del catálogo.** Los BN se agrupan en tres familias, y solo la tercera tiene apoyo en la investigación.
- **Índice corrido** (BN2, BN7, BN10, BN23 a BN26): es lo que más señalan los docentes, pero no tiene datos.
- **Fórmula que se parece** (BN3, BN4, BN8, BN9, BN13, BN20, junto con AL8 y AL11): es la extrapolación lineal de Matz; los docentes la señalan sin cifras.
- **No mirar qué se cuenta** (BN12, BN14, BN17, BN21): es la única con apoyo de investigación, en Batanero, Lockwood y Lecoutre. Lockwood y Gibson (2016) apoyan la decisión de diseño de la escena: hacer visibles las palabras «aabb» que se cuentan, porque listar resultados, aunque sea en parte, se asocia con más aciertos.


## 5. Números complejos

Plantilla: `plantillas/numeros-complejos/`.


7 de noviembre de 2026 · Plantilla `plantillas/numeros-complejos/` («La flecha en el plano»)

Para qué sirve: dar respaldo (o dejar claro que no lo hay) a los errores típicos que el motor usa como distractores, con los códigos CX1 a CX35 de `plantillas/numeros-complejos/motor.js`. **CX8 y CX9 no existen** en el motor ni en sus casos (verificado con grep en toda la carpeta de la plantilla): hay 33 códigos. El motor también usa AL9 (|z| = |a| + |b|) y AL11 (el exponente se reparte sobre la suma), que ya están en `docs/investigacion/algebra-funciones-ideas-erroneas.md` (AL9 parcial, por Aguerrea y otros 2022; AL11 hipótesis, por Matz 1982); este informe no les cambia el respaldo.

### Resumen en cinco líneas

1. **No hay ningún error de cálculo con complejos documentado con cifra en texto completo.** La literatura que encontré estudia la *imagen del concepto* (¿es un número?, ¿qué representa i?) y el paso entre la forma algebraica y la geométrica, no cuántos alumnos escriben i² = 1 o √(−4)·√(−9) = 6.
2. **El hallazgo más repetido es la separación de registros.** Alumnos griegos de último año (95, Panaoura y otros 2006) tratan la forma algebraica y la geométrica como cosas autónomas; físicos universitarios fallan cuando mezclan la trigonometría del triángulo con la de la circunferencia al sacar el argumento (Smith, Zwolak y Manogue 2019). Esto respalda en parte CX17 y CX18 (argumento sin mirar el cuadrante).
3. **Llevar reglas de los reales a los complejos** es la idea errónea general que reportan los estudios turcos (Turanlı, Keçeli y Türker 2007, escolares de 2.º de secundaria; Keçeli y Turanlı 2013, universitarios), y la definición i = √(−1) se señala como obstáculo (Chin y Jiew 2020, con 2 universitarios, citado por Veith y Bitzenbauer 2021). Ninguna fuente describe el error concreto √(−a)·√(−b) = √(ab), así que CX28 queda como hipótesis.
4. **De Moivre es la tarea que más falla** en un estudio nigeriano: 12 de 18 alumnos de tercer año casi no la resolvieron (Lukumon y otros 2026, según resumen); no se dice qué error cometieron, así que no respalda ningún código concreto.
5. **Balance:** 0 documentados, 2 parciales (CX17 y CX18) y 31 hipótesis. No encontré ningún estudio peruano con datos; las fuentes en español (Argentina) no se pudieron abrir.

### Cómo se hizo y su límite

- Se leyó la cabecera del motor y se listaron los códigos con grep (CX1–CX7 y CX10–CX35).
- Se hicieron unas 20 búsquedas web en inglés, español y turco (artículos sugeridos por el pedido, «complex numbers misconceptions», «√(−4)·√(−9)», De Moivre, «errores números complejos», «karmaşık sayılar kavram yanılgıları»).
- **Ningún texto completo se pudo abrir.** WebFetch falló con «host no permitido» en funes.uniandes.edu.co, distantreader.org, pythagoras.org.za, link.aps.org y ejmste.com; después de eso no se intentaron más sitios. Todo lo que sigue sale de resúmenes, fichas y citas de terceros que devolvió el buscador. Por regla, nada llega a «documentado».
- **Dos referencias del pedido no se pudieron confirmar:** Tirosh y Almog (1989) (lo único verificable fue Tsamir, Tirosh y Almog 1998, sobre inecuaciones, ya citado en el informe de álgebra) y la tesis de Danenhower (2000). No se usan.
- Muchas muestras son universitarias o de profesores (Karakok y otros 2015: 3 profesores). La cifra no se traslada a postulantes peruanos.

### De dónde salen los datos

| Fuente | Muestra | Instrumento | Qué aporta | Qué leí |
| --- | --- | --- | --- | --- |
| Nordlander, M. C. y Nordlander, E. (2012). On the concept image of complex numbers. *IJMEST* 43 (número 5 y páginas 627–641 no confirmados; DOI no visto) | Estudiantes suecos (cantidad no vista) | Cuestionario de percepciones y prueba de identificación | Cuatro categorías de imagen del concepto; muchos no reconocen que todo real es complejo | Resumen y citas de terceros |
| Panaoura, Elia, Gagatsis y Giatilis (2006). Geometric and algebraic approaches in the concept of complex numbers. *IJMEST* 37(6), 681–706. DOI 10.1080/00207390600712281 | 95 alumnos griegos de último año de secundaria (17–18 años) | Prueba de tareas algebraicas y geométricas | Enfoque geométrico más frecuente, algebraico más consistente; compartimentación entre registros | Resumen |
| Karakok, Soto-Johnson y Dyben (2015). Secondary teachers' conception of various forms of complex numbers. *J. Math. Teacher Education* 18(4), 327–351. DOI 10.1007/s10857-014-9288-1 (ERIC EJ1067309) | 3 profesores de secundaria en ejercicio | Entrevista de 90 min tras tres sesiones de 4 h (12 h) de formación | Concepción operacional, no estructural, de la forma exponencial; dificultad con imaginarios puros como punto y como vector | Resumen y cita de terceros |
| Smith, Zwolak y Manogue (2019). Isolating approaches… *Phys. Rev. PER* 15, 010138. DOI 10.1103/PhysRevPhysEducRes.15.010138 | Estudiantes de física de nivel intermedio (cantidad no vista) | Tarea: de un punto en el plano a varias formas algebraicas | Quienes mezclan trigonometría del triángulo y de la circunferencia fallan al sacar el argumento | Resumen |
| Conner, Rasmussen, Zandieh y Smith (c. 2007). Student understanding of complex numbers (informe preliminar, SDSU y ASU). https://www.academia.edu/26387792 | Estudiantes universitarios (muestra por confirmar) | Antes y después de un curso | Resistencia inicial a multiplicar por −1 como giro; al final, «casi todos» rechazan que los complejos no sean números | Resumen del buscador (año y sede por confirmar) |
| Turanlı, Keçeli y Türker (2007), Turquía. *BAÜ Fen Bilimleri Enstitüsü Dergisi* 9(2), 135–149. https://dergipark.org.tr/en/download/article-file/231670 | Alumnos de 2.º de secundaria (el número 483, los colegios de Buca y el año 2005–2006 no están confirmados) | Prueba diagnóstica de complejos (los 50 ítems de opción múltiple no están confirmados) | Faltas de conocimiento y concepciones erróneas en conjugado, raíces y cuatro operaciones; regla de los reales aplicada a los complejos | Resumen y fragmentos |
| Keçeli y Turanlı (2013). Misconceptions and common errors in complex numbers. *Hacettepe Ü. Eğitim Fak. Dergisi* 28(1), 223–234. https://dergipark.org.tr/en/download/article-file/87135 | Universitarios de varias universidades | Prueba diagnóstica | Los universitarios tienen las mismas concepciones erróneas que los de 11.º grado | Resumen |
| Lukumon y otros (2026), con Maharaj entre los coautores. Error analysis in third-year complex number topics: A study of undergraduate mathematics students in a Nigerian university. *Interdisciplinary J. of Education* 9(1), 1–27 (DOI 10.53449/zc1hpz13 no confirmado). https://journals.iuiu.ac.ug/index.php/ije/article/view/1210 | 18 alumnos de 3.er año (curso MATH307 no confirmado), Nigeria | Seis problemas abiertos: simplificación, conjugado, división, producto, módulo y argumento de un cociente, De Moivre | Errores conceptuales (n = 26) y de interpretación (n = 17), en una taxonomía de cuatro tipos (conceptual, de interpretación, de procedimiento y técnico); 12 de 18 casi fallan De Moivre; no coordinan forma polar y binómica | Resumen del buscador |
| Seloane, Ramaila y Ndlovu (2025). *Pythagoras* 46(1), a825. DOI 10.4102/pythagoras.v46i1.825 | Alumnos de 1.er año de ingeniería, Sudáfrica | Pre y postest; categorías de Donaldson y Orton | GeoGebra reduce el total de errores (χ² = 7,9584 y p = 0,004787, cifras no confirmadas por el revisor); representaciones vistas como autónomas | Resumen |
| Veith, J. M. y Bitzenbauer, P. (2021). Two challenging concepts in mathematics education: Subject-specific thoughts on the complex unit and angles. *European Journal of Science and Mathematics Education* 9(4), 244–251. DOI 10.30935/scimath/11251 | Ensayo, sin muestra | Análisis de contenido | Critica definir i = √(−1); cita a Chin y Jiew como estudio empírico de que esa definición estorba | Fragmentos del buscador |
| Chin y Jiew (2020), *The Mathematics Enthusiast* 17(1). https://scholarworks.umt.edu/tme/vol17/iss1/11 (la cita de «2018» no se encontró; es probablemente este artículo) | 2 universitarios | No visto | i = √(−1) obstaculiza entender los complejos y la raíz cuadrada | Cita de terceros (Veith y Bitzenbauer) |
| Aznar y otros (2010); Distéfano, Aznar y Pochulu (2011, 2012); Andino y otros (2012), Argentina (FUNES) | Universitarios de primer año | Exámenes parciales | Errores al pasar del gráfico a la expresión con módulo y argumento; errores en producto, cociente, potencia y raíz en polar y binómica | Solo título y una línea del buscador; el PDF no abrió |

### Catálogo con respaldo

Columnas: «Qué dice la fuente» solo trae cifras que vi; «Qué leí» dice si fue resumen, fragmento o cita de terceros. Ningún código llega a documentado.

| Código | Error (breve) | Qué dice la fuente (cifra exacta y muestra) | Fuente | Qué leí | Respaldo propuesto |
| --- | --- | --- | --- | --- | --- |
| CX1 | i² = 1 (en potencias, producto y cociente) | Sin estudio con cifra. Solo un sitio de repaso del IB lo nombra como fallo común (no es investigación). | — | — | Hipótesis |
| CX2 | i³ = i | Nada encontrado. | — | — | Hipótesis |
| CX3 | iⁿ con el cociente de n entre 4 en vez del resto | Nada encontrado. | — | — | Hipótesis |
| CX4 | Ciclo corrido: i⁰ = i, da i^(resto + 1) | Nada encontrado. | — | — | Hipótesis |
| CX5 | iⁿ = n·i | Nada encontrado. | — | — | Hipótesis |
| CX6 | i · i = i (y √(−a)·√(−b) = √a·√b·i) | Nada encontrado. | — | — | Hipótesis |
| CX7 | Producto parte por parte: (a + bi)(c + di) = ac + bd·i | Turanlı y otros (2007) hablan de reglas de los reales aplicadas a los complejos y de errores en las cuatro operaciones (escolares de 2.º de secundaria), sin decir cuál ni cuántos. | Turanlı, Keçeli y Türker (2007) | Resumen | Hipótesis (la fuente es demasiado general) |
| CX10 | \|z\| = √(\|a\| + \|b\|) | Nada encontrado. | — | — | Hipótesis |
| CX11 | \|z\| = a² + b² (olvida la raíz) | Smith y otros (2019) nombran «el cuadrado de la norma» entre los métodos, sin reportarlo como error. | Smith, Zwolak y Manogue (2019) | Resumen | Hipótesis |
| CX12 | Conjugado como −a + bi | Turanlı y otros (2007) incluyen el conjugado entre los subtemas con errores; Lukumon y otros (2026) tienen una tarea de conjugado. Ninguno dice qué error. | Turanlı y otros (2007); Lukumon y otros (2026) | Resumen | Hipótesis |
| CX13 | Conjugado como −a − bi (confunde con el opuesto) | Igual que CX12. | Ídem | Resumen | Hipótesis |
| CX14 | Conjugado como b − ai | Nada encontrado. | — | — | Hipótesis |
| CX15 | Cociente parte por parte: a/c + (b/d)i | Nada concreto; la tarea de división existe en Lukumon y otros (2026), sin desglose. | Lukumon y otros (2026) | Resumen | Hipótesis |
| CX16 | Cociente sin dividir entre c² + d² | Nada encontrado. | — | — | Hipótesis |
| CX17 | Argumento como arctan(b/a) sin mirar el cuadrante | Quienes no distinguen la trigonometría del triángulo de la de la circunferencia fallan al pasar del punto a las formas algebraicas; sin cifra, muestra no vista. La forma concreta del error (arctan sin cuadrante) es inferida. | Smith, Zwolak y Manogue (2019) | Resumen | Parcial (sin cifra) |
| CX18 | Argumento como ángulo agudo con el eje real, sin signo | Igual que CX17: es el uso del triángulo de referencia donde va el ángulo de la circunferencia. La forma concreta del error es inferida. | Smith, Zwolak y Manogue (2019) | Resumen | Parcial (sin cifra) |
| CX19 | Producto en polar suma los módulos | Nada concreto; Lukumon y otros (2026): no coordinan forma polar y binómica (18 alumnos). | Lukumon y otros (2026) | Resumen | Hipótesis |
| CX20 | Producto en polar multiplica los argumentos | Ídem. | Ídem | Resumen | Hipótesis |
| CX21 | Producto en polar resta los argumentos | Nada encontrado. | — | — | Hipótesis |
| CX22 | Cociente en polar suma los argumentos | Nada encontrado. | — | — | Hipótesis |
| CX23 | Cociente en polar resta los módulos | Nada encontrado. | — | — | Hipótesis |
| CX24 | Cociente en polar: θ₂ − θ₁ | Nada encontrado. | — | — | Hipótesis |
| CX25 | i^(−n) = iⁿ | Nada encontrado. | — | — | Hipótesis |
| CX26 | i^(−n) = 1 («se cancelan») | Nada encontrado. | — | — | Hipótesis |
| CX27 | i^(−n) = −1 (solo cambia el signo) | Nada encontrado. | — | — | Hipótesis |
| CX28 | √(−a)·√(−b) = √(ab) | Ninguna fuente describe este error. Solo hay un indicio general: Turanlı y otros (2007) hablan de errores en raíces y en reglas de los reales aplicadas a los complejos, sin desglose, y Chin y Jiew (2020, 2 universitarios) señalan que i = √(−1) estorba. Los libros de texto lo traen como ejercicio de «encuentra el error», que no es dato de frecuencia. | Turanlı y otros (2007); Chin y Jiew (2020) vía Veith y Bitzenbauer (2021) | Resumen; cita de terceros | Hipótesis (indicio general) |
| CX29 | √(−a)·√(−b) «no existe» | Nordlander y Nordlander (2012) reportan dudas de que los complejos sean números; Conner y otros: al final, «casi todos» rechazan «los complejos no son números de verdad» (muestra por confirmar). Es la idea de fondo, no este error. | Nordlander y Nordlander (2012); Conner y otros (c. 2007) | Resumen | Hipótesis (correspondencia indirecta) |
| CX30 | De Moivre sin elevar el módulo: r cis(nθ) | 12 de 18 casi fallan la tarea de De Moivre; no se dice qué error. | Lukumon y otros (2026) | Resumen del buscador | Hipótesis (la cifra es de la tarea, no del error) |
| CX31 | De Moivre multiplica el módulo por n | Igual que CX30. | Ídem | Resumen del buscador | Hipótesis |
| CX32 | Cuadrática con Δ < 0: usa b en vez de −b | Nada específico de complejos; en álgebra, AL13 (fórmula mal aplicada) tiene una cifra de ítem sin desglose del error. | Ver AL13 en `algebra-funciones-ideas-erroneas.md` | — | Hipótesis |
| CX33 | Divide la parte real entre 2a y la imaginaria no | Nada encontrado. | — | — | Hipótesis |
| CX34 | No divide nada entre 2a | Nada encontrado. | — | — | Hipótesis |
| CX35 | Cociente multiplicando por w y no por w̄ | Nada encontrado. | — | — | Hipótesis |

**Conteo:** 0 documentados, 2 parciales (CX17 y CX18), 31 hipótesis. AL9 y AL11 se quedan como están en el informe de álgebra.

**Para las escenas.** Lo más sólido de la literatura no es un error de cuenta sino la desconexión entre la forma binómica y el dibujo (Panaoura y otros 2006; Smith y otros 2019; Seloane y otros 2025). La escena ya va por ahí (la flecha que gira y se estira). La medición del colegio será la primera fuente real de frecuencias para CX1 a CX35.


## 6. Geometría del espacio

Plantilla: `plantillas/geometria-espacio/`.


7 de noviembre de 2026 · (complementa a `geometria-ideas-erroneas.md`, que dejó fuera «rectas y planos en el espacio»). Cubre la plantilla `plantillas/geometria-espacio/` (el cubo que gira).

Códigos: el motor no usa números (GE1, GE2…) sino claves de error por pregunta. Aquí cada idea errónea se nombra **GE-espacio `función.pregunta.clave`** (por ejemplo `varilla.cuantas.bastaUna`). Se antepone la función porque varias preguntas comparten nombre (`angulo` y `distancia` aparecen en tres funciones con claves distintas).

### Resumen en cinco líneas

1. **No hallé ningún error de este tema con dato leído en texto completo**: la sesión no pudo abrir artículos (ver abajo). No hay ninguna clave **documentada**.
2. **La pista más concreta es el ángulo en el cubo dibujado.** En la tarea «¿cuánto mide el ángulo BGD del cubo?» (triángulo de diagonales de caras, 60°), los alumnos de menor nivel de pensamiento 3D dibujaron la red del cubo y respondieron **90°** (Kondo, Fujita, Kunimune y Jones, PME 37, 2013, según el resumen). En las actas de PME 38 (2014) se confirman 8 respuestas de 90° (el total de respuestas no está confirmado); aparecen también respuestas de 60°, 45° y 22,5° («la mitad de la mitad»), sin cuentas confirmadas. Es exactamente la pregunta `anguloEnVertice` con A, F, H. Solo `anguloEnVertice.angulo.recto` queda **parcial**.
3. **La analogía con el plano** («si no se cortan, son paralelas»; «la perpendicular se define como en el plano») aparece como categoría de error («analogías») en futuros profesores argentinos (Götte y Mántica, 2012, 2021; tesis de maestría de Götte, 2019), sin porcentajes y sin que haya leído los ejemplos concretos. Por eso `anguloRectasCubo.angulo.paralelas` y `varilla.cuantas.bastaUna` quedan como **hipótesis con indicio**.
4. **Leer el dibujo como si fuera la figura** (las claves `dibujo`) tiene marco teórico sólido (Parzysz, 1988; Gutiérrez, 1996; Widder, Berman y Koichu, 2019; Fujita y otros, 2020, con 1357 alumnos de 4.° a 9.° grado), pero ningún dato que diga cuántos alumnos toman el ángulo «que se ve». Quedan como **hipótesis** con marco, emparentadas con GE7–GE10 y GE13.
5. Resultado: **0 documentadas, 1 parcial, 36 hipótesis** (37 claves; dos de ellas, hipótesis con indicio). El ángulo recta-plano, el diedro, las tres perpendiculares, la proyección, la distancia entre cruzadas y el triedro no tienen ningún estudio con datos que haya podido ver; las fuentes que describen el error del «ángulo con la normal» o del diedro «oblicuo» son páginas de repaso, no investigación.

### Cómo se hizo y su límite

- Leí la cabecera y las funciones de `plantillas/geometria-espacio/motor.js` y armé la lista completa de claves de error (37). Revisé `docs/investigacion/geometria-ideas-erroneas.md` para no repetir GE7–GE10 y GE13.
- Hice unas 20 búsquedas web (inglés, español e indonesio). **WebFetch no pudo abrir nada**: link.springer.com y doaj.org no resuelven en la red de esta sesión, y por la regla del entorno dejé de intentar otros sitios. Todo lo que cito viene del **resumen del buscador** (fragmentos y resúmenes de los artículos), nunca del texto completo. Por eso ninguna fila pasa de **parcial**, aunque traiga cifra.
- Correspondencia: solo marco **parcial** cuando la fuente describe el mismo error que la clave (mismo tipo de respuesta). Si la fuente habla de dificultades generales («errores de concepto en distancias»), la clave queda **hipótesis** y la fuente se anota como contexto.
- Lo que no encontré: datos peruanos (ECE no evalúa geometría del espacio de este nivel), ítems liberados de TIMSS o TIMSS Advanced sobre ángulo recta-plano o diedro con porcentaje por opción, y cualquier estudio sobre el triedro.

### De dónde salen los datos

| Fuente | Muestra | Instrumento | Qué aporta | Qué leí |
| --- | --- | --- | --- | --- |
| Kondo, Y., Fujita, T., Kunimune, S. y Jones, K. (2013). *Students' level of 3D geometrical thinking: The influence of 3D representations*. Informe corto, PME 37. https://eprints.soton.ac.uk/445811/1/Kondo_etc_PME37_2013.pdf | Alumnos japoneses de secundaria baja (no vi el número) | Problema del ángulo BGD en un cubo dibujado en perspectiva oblicua | Los de nivel bajo responden 90° apoyándose en la red; los de nivel alto pasan a proyección ortogonal y dan 60° | Resumen del buscador |
| Kondo, Y., Fujita, T., Kunimune, S., Jones, K. y Kumakura, H. (2014). *The influence of 3D representations on students' level of 3D geometrical thinking*. PME 38 y PME-NA 36 (Vancouver), vol. 4, 25–32 (copia de las actas: ERIC ED599895). https://eprints.soton.ac.uk/445744 | No confirmada (total de respuestas no confirmado) | El mismo problema del cubo | 8 respuestas de 90° (confirmadas); también respuestas de 60°, 45° y 22,5° («la mitad de la mitad»), sin cuentas confirmadas | Fragmento de tabla en el resumen del buscador; el revisor confirmó solo las 8 de 90° |
| Jones, K., Fujita, T. y Kunimune, S. (2012). PME 36 (Taipéi), vol. 2, 339–346. https://eprints.soton.ac.uk/445627/1/Jones_etc_represent_reason3D_PME36_2012.pdf | Alumnos de 12 a 15 años | Problema con un cubo en perspectiva oblicua | Origen de la tarea; cita a Parzysz sobre la preferencia por la perspectiva oblicua | Resumen del buscador |
| Fujita, T., Kondo, Y., Kumakura, H., Kunimune, S. y Jones, K. (2020). *Spatial reasoning skills about 2D representations of 3D geometrical shapes in grades 4 to 9*. Mathematics Education Research Journal 32(2), 235–255. DOI 10.1007/s13394-020-00335-w; ERIC EJ1258277 | 1357 alumnos de 4.° a 9.° grado (Japón) | Problemas con diagramas de sólidos | Visualizar o razonar con propiedades por separado no basta para superar «el aspecto engañoso del diagrama» en problemas de más de un paso | Resumen |
| Fujita, T. y otros (2017). *Students' geometric thinking with cube representations: Assessment framework and empirical evidence*. Journal of Mathematical Behavior. https://ore.exeter.ac.uk/repository/handle/10871/26954 | Alumnos de 7.° a 9.° grado (12–15 años) | Marco de evaluación con representaciones del cubo | Probable fuente de los porcentajes por respuesta | Solo la ficha |
| Parzysz, B. (1988). *«Knowing» vs «seeing»: problems of the plane representation of space geometry figures*. Educational Studies in Mathematics 19, 79–92. DOI 10.1007/BF00428386 | No vista | Dibujos de sólidos hechos por alumnos | Conflicto entre lo que se sabe del sólido y lo que se ve en el dibujo; preferencia por la perspectiva oblicua con una cara cuadrada; dificultad para representar paralelas y perpendiculares | Cita de terceros |
| Gutiérrez, A. (1996). *Visualization in 3-dimensional geometry: in search of a framework*. https://www.uv.es/gutierre/archivos1/textospdf/Gut96c.pdf | Alumnos de primaria y secundaria | Software 3D dinámico | Marco de visualización; las imágenes en pantalla siguen siendo representaciones planas | Resumen del buscador |
| Widder, M., Berman, A. y Koichu, B. (2019). *An a priori measure of visual difficulty of 2-D sketches depicting 3-D objects*. JRME 50(5). https://nctm.org/Publications/Journal-for-Research-in-Mathematics-Education/2019/Vol50/Issue5/An-A-Priori-Measure-of-Visual-Difficulty-of-2-D-Sketches-Depicting-3-D-Objects | Alumnos de secundaria (Israel); número no visto | 12 bocetos de cubos, orientados y volteados | Mide la dificultad por la razón entre información geométrica útil y engañosa del boceto; la ordenación coincide con el porcentaje de comprensión correcta | Resumen |
| Pittalis, M. y Christou, C. (2010). *Types of reasoning in 3D geometry thinking and their relation with spatial ability*. ESM 75(2), 191–212. DOI 10.1007/s10649-010-9251-8 | Alumnos de 5.° a 9.° grado (Chipre); la cifra de 269 que dio una ficha no está confirmada | Test de geometría 3D y de habilidad espacial | Cuatro tipos de razonamiento 3D; no da errores por tarea | Resumen |
| Ben-Chaim, D., Lappan, G. y Houang, R. (1985, 1989). ESM 16, 389–409; ESM 20, 121–146 | Alumnos de 5.° a 8.° grado | Cubitos y descripción de edificios | Ya usado en GE13; no toca ángulos ni planos | Resumen |
| Götte, M. y Mántica, A. M. (2012). *Estudio de particularidades del aprendizaje de la geometría tridimensional*. RevEM. https://dialnet.unirioja.es/servlet/articulo?codigo=8833045 | Alumnos del profesorado en matemática (UNL, Argentina) | Demostraciones de paralelismo y perpendicularidad en el espacio | La perpendicularidad en el plano es entre rectas secantes; en el espacio, también entre rectas que no se cortan, recta-plano y planos; errores por analogía | Resumen del buscador |
| Götte, M. (2019). Tesis de maestría, Universidad Nacional del Litoral. https://bibliotecavirtual.unl.edu.ar:8443/bitstream/handle/11185/5808/Tesis.pdf | Alumnos del profesorado | Tareas de geometría espacial | «Analogías entre plano y espacio» como categoría de error; alumnos buenos en el plano fallan en el espacio | Resumen del buscador |
| Götte, M. y Mántica, A. M. (2021). *Acrisolado de tipologías de errores en demostraciones geométricas de futuros profesores en matemática*. UNIÓN e006. https://union.fespm.es/index.php/UNION/article/view/187 | Futuros profesores | Demostraciones con paralelismo y perpendicularidad | Tipología con un tópico de «uso de analogías» | Resumen |
| Ridha, Suhendra y Nurlaelah (2023). Análisis con la teoría de Nolting. *Aksioma* 12(2), 2426–2434. DOI 10.24127/ajpm.v12i2.6739 (Indonesia) | 65 alumnos de grado XII | Problemas de distancia en el cubo | Errores de concepto 65 %, de descuido 54 %, de examen 37 %, de aplicación 3 % (por categoría, no por respuesta) | Resumen del buscador |
| Asri y otros (2018), *Jurnal Pendidikan: Teori, Penelitian, dan Pengembangan* (UM, Indonesia) | Alumnos de secundaria superior (estudio cualitativo) | Ángulo entre recta y plano, con andamiaje | Obstáculos al planear la solución; dos sujetos con obstáculos | Resumen del buscador |

### Catálogo

Respaldo: **Documentado** (cifra leída en texto completo), **Parcial** (fuente con correspondencia concreta, leída solo en resumen o fragmento), **Hipótesis** (sin correspondencia concreta). Ninguna fila es documentada.

#### El diedro (`diedro`)

| Código (pregunta.clave) | Error (breve) | Qué dice la fuente (cifra exacta y muestra) | Fuente | Qué leí | Respaldo propuesto |
| --- | --- | --- | --- | --- | --- |
| `diedro.diedro.oblicuas` | Mide el diedro con las rectas AC y AD, que no son perpendiculares a la arista | Páginas de repaso describen medir «en cualquier dirección» en vez de con rayos perpendiculares a la arista; sin estudio ni cifra | Mathwords; recursos de dibujo técnico (flipeducation) | Resumen del buscador | Hipótesis |
| `diedro.diedro.unaOblicua` | Una de las dos rectas es perpendicular a la arista y la otra no | Nada | — | — | Hipótesis (ligada a `oblicuas`) |
| `diedro.diedro.recto` | Todo plano «que sube» forma 90° con el piso (se toma como pared) | Nada | — | — | Hipótesis (prototipo vertical, como GE7) |

#### La varilla en el piso (`varilla`)

| Código (pregunta.clave) | Error (breve) | Qué dice la fuente (cifra exacta y muestra) | Fuente | Qué leí | Respaldo propuesto |
| --- | --- | --- | --- | --- | --- |
| `varilla.cuantas.ninguna` | Una varilla inclinada no forma 90° con ninguna recta del piso | Nada | — | — | Hipótesis |
| `varilla.cuantas.bastaUna` | Si es perpendicular a una recta del piso, lo es al piso (a todas) | Indicio: «analogías plano-espacio» como categoría de error en futuros profesores; el artículo de 2012 analiza ítems de recta perpendicular a un plano con el criterio de dos secantes, pero no leí que describa el error «basta una recta». Sin porcentaje | Götte y Mántica (2012, 2021); Götte (2019, tesis de maestría) | Resumen del buscador | Hipótesis con indicio |
| `varilla.cuantas.dos` | Es perpendicular a una recta y a su perpendicular (dos) | Nada específico; misma analogía con el plano | Götte (2019) como marco | Resumen del buscador | Hipótesis |
| `varilla.conM.bastaUna` | Con la recta M (su sombra) forma 90° | Nada | — | — | Hipótesis (ligada a `cuantas.bastaUna`) |
| `varilla.conM.complemento` | Da 90° − el ángulo correcto (el ángulo con la vertical o la normal) | Páginas de repaso señalan como error común dar el ángulo con la normal en lugar del ángulo con el plano; sin estudio | Revisión IB (savemyexams), revisiondojo | Resumen del buscador | Hipótesis |
| `varilla.conM.dibujo` | Toma el ángulo que se ve en el dibujo | Marco: conflicto entre lo que se sabe y lo que se ve; «aspecto engañoso del diagrama» (1357 alumnos, sin cifra por tarea) | Parzysz (1988); Fujita y otros (2020); Widder y otros (2019) | Cita de terceros y resúmenes | Hipótesis (con marco; ver GE7–GE10, GE13) |

#### La diagonal y su sombra (`anguloDiagonal`)

| Código (pregunta.clave) | Error (breve) | Qué dice la fuente (cifra exacta y muestra) | Fuente | Qué leí | Respaldo propuesto |
| --- | --- | --- | --- | --- | --- |
| `anguloDiagonal.angulo.conArista` | Ángulo de AG con la arista AB en vez de con su proyección AC | Un sitio comercial menciona alumnos que calculan el ángulo entre dos rectas en lugar de recta-plano; anécdota | sketchmath (blog de producto) | Resumen del buscador | Hipótesis |
| `anguloDiagonal.angulo.diagonalCara` | Usa la diagonal de la cara del frente (AF) en vez de AG | Nada | — | — | Hipótesis |
| `anguloDiagonal.angulo.hipotenusa` | tan θ = alto / AG (la diagonal como cateto) | Nada | — | — | Hipótesis (ligada a GE11, Pitágoras mal aplicado) |

#### Tres perpendiculares (`tresPerpendiculares`)

| Código (pregunta.clave) | Error (breve) | Qué dice la fuente (cifra exacta y muestra) | Fuente | Qué leí | Respaldo propuesto |
| --- | --- | --- | --- | --- | --- |
| `tresPerpendiculares.distancia.alPlano` | Distancia de P a L = h (la altura PA) | Contexto: 65 % con errores de concepto en problemas de distancia en el cubo (por categoría, no por respuesta) | Ridha y otros (2023), *Aksioma*, 65 alumnos de grado XII | Resumen del buscador | Hipótesis |
| `tresPerpendiculares.distancia.alPie` | Distancia = m (AB, la del pie) | Igual que arriba | Ridha y otros (2023) | Resumen del buscador | Hipótesis |
| `tresPerpendiculares.distancia.alMedio` | Mide hasta el punto medio del tramo | Nada | — | — | Hipótesis |
| `tresPerpendiculares.distancia.alExtremo` | Mide hasta el otro extremo del tramo | Nada | — | — | Hipótesis |

#### Rectas cruzadas (`distanciaCruzadas`)

| Código (pregunta.clave) | Error (breve) | Qué dice la fuente (cifra exacta y muestra) | Fuente | Qué leí | Respaldo propuesto |
| --- | --- | --- | --- | --- | --- |
| `distanciaCruzadas.distancia.entreExtremos` | La menor distancia entre extremos nombrados | Nada | — | — | Hipótesis |
| `distanciaCruzadas.distancia.mitadDeR1` | La mitad del largo de r1 | Nada | — | — | Hipótesis |
| `distanciaCruzadas.distancia.perpendicularAUna` | Perpendicular a una sola recta (de un extremo a la otra) | Nada; la perpendicular común como idea nueva del espacio aparece en Götte y Mántica sin datos | Götte y Mántica (2012) como marco | Resumen del buscador | Hipótesis |

#### Proyección de un segmento (`proyeccion`)

| Código (pregunta.clave) | Error (breve) | Qué dice la fuente (cifra exacta y muestra) | Fuente | Qué leí | Respaldo propuesto |
| --- | --- | --- | --- | --- | --- |
| `proyeccion.proyeccion.igual` | La proyección mide lo mismo que el segmento | Nada | — | — | Hipótesis |
| `proyeccion.proyeccion.resta` | Proyección = largo − diferencia de alturas | Nada | — | — | Hipótesis (ligada a GE11) |
| `proyeccion.proyeccion.altura` | Da la diferencia de alturas | Nada | — | — | Hipótesis |

#### Ángulo entre rectas del cubo (`anguloRectasCubo`)

| Código (pregunta.clave) | Error (breve) | Qué dice la fuente (cifra exacta y muestra) | Fuente | Qué leí | Respaldo propuesto |
| --- | --- | --- | --- | --- | --- |
| `anguloRectasCubo.angulo.dibujo` | Toma el ángulo que se ve en la vista | Marco sin cifra por tarea | Parzysz (1988); Widder y otros (2019); Fujita y otros (2020) | Cita de terceros y resúmenes | Hipótesis (con marco; GE7–GE10, GE13) |
| `anguloRectasCubo.angulo.paralelas` | Cruzadas: «no se cortan, entonces son paralelas» (0°) | Indicio: en futuros profesores, «analogías plano-espacio» como categoría de error (contexto, sin el ejemplo concreto ni cifra). Delgado Pineda (2021), *El Cálculo y su Enseñanza* 17(1), 1–12, no sirve: trata el paralelismo en el plano, no las rectas cruzadas | Götte (2019); Götte y Mántica (2021) | Resumen del buscador | Hipótesis con indicio |
| `anguloRectasCubo.angulo.recto` | 90° por defecto | Nada para rectas; ver `anguloEnVertice.angulo.recto` | — | — | Hipótesis |
| `anguloRectasCubo.angulo.medio` | 45° por defecto | Nada para rectas | — | — | Hipótesis |
| `anguloRectasCubo.angulo.equilatero` | 60° por defecto | Nada | — | — | Hipótesis |

#### Ángulo en un vértice del cubo (`anguloEnVertice`)

La escena usa AFH (equilátero, 60°) y EBC (recto, 90°). AFH es la misma tarea que el ángulo BGD de Kondo y otros.

| Código (pregunta.clave) | Error (breve) | Qué dice la fuente (cifra exacta y muestra) | Fuente | Qué leí | Respaldo propuesto |
| --- | --- | --- | --- | --- | --- |
| `anguloEnVertice.angulo.dibujo` | Toma el ángulo que se ve en el dibujo | Respuestas de 22,5° y 30° en las actas (sin cuentas confirmadas) son una pista de lectura del dibujo, pero la fuente no lo dice | Kondo y otros (2014), fragmento | Resumen del buscador | Hipótesis |
| `anguloEnVertice.angulo.recto` | 90° («en el cubo todo es recto») | Nivel bajo: dibuja la red y concluye que BGD mide 90°. En las actas: 8 respuestas de 90° (total no confirmado) | Kondo y otros (2013, 2014) | Resumen y fragmento del buscador | Parcial |
| `anguloEnVertice.angulo.medio` | 45° | Aparecen respuestas de 45° en las actas, pero la cuenta no se confirmó | Kondo y otros (2014) | Fragmento del buscador | Hipótesis |
| `anguloEnVertice.angulo.equilatero` | 60° cuando no lo es (por ejemplo en EBC) | En BGD, 60° es lo correcto; como error no hay dato | — | — | Hipótesis |

#### Distancia de un vértice a una recta (`distanciaVerticeRecta`)

| Código (pregunta.clave) | Error (breve) | Qué dice la fuente (cifra exacta y muestra) | Fuente | Qué leí | Respaldo propuesto |
| --- | --- | --- | --- | --- | --- |
| `distanciaVerticeRecta.distancia.alMedio` | Mide hasta el punto medio del segmento | Un estudio indonesio cuenta «error al determinar la fórmula de la distancia de punto a recta» entre los errores de concepto; sin cifra por respuesta | *Al-Khwarizmi* (IAIN Palopo) | Resumen del buscador | Hipótesis |
| `distanciaVerticeRecta.distancia.alExtremo` | Mide hasta el extremo más cercano | Igual que arriba | *Al-Khwarizmi* | Resumen del buscador | Hipótesis |
| `distanciaVerticeRecta.distancia.conLaSombra` | Usa la sombra de la recta en el piso | Nada | — | — | Hipótesis |

#### El triedro (`triedro`; la pregunta `razon` usa las mismas claves)

| Código (pregunta.clave) | Error (breve) | Qué dice la fuente (cifra exacta y muestra) | Fuente | Qué leí | Respaldo propuesto |
| --- | --- | --- | --- | --- | --- |
| `triedro.existe.soloCadaCara` (y `triedro.razon.soloCadaCara`) | Basta que cada cara mida menos de 180° | Nada | — | — | Hipótesis |
| `triedro.existe.soloDesigualdad` (y `triedro.razon.soloDesigualdad`) | Mira la desigualdad pero olvida que la suma es menor que 360° | Nada | — | — | Hipótesis (analogía con la desigualdad triangular) |
| `triedro.existe.obtusaImposible` (y `triedro.razon.obtusaImposible`) | Ninguna cara puede ser obtusa | Nada | — | — | Hipótesis (prototipo de la esquina del cubo) |

**Recuento:** 37 claves; 0 documentadas, 1 parcial (`anguloEnVertice.angulo.recto`), 36 hipótesis, de las cuales `varilla.cuantas.bastaUna` y `anguloRectasCubo.angulo.paralelas` son hipótesis con indicio (Götte y Mántica). Las tres claves `dibujo` son hipótesis con marco teórico y se enlazan con GE7–GE10 y GE13 del informe de geometría.


## 7. Conteo de figuras

Plantilla: `plantillas/razonamiento-figuras/`.


7 de noviembre de 2026 · , ligado a `plantillas/razonamiento-figuras/` (el reflector de figuras)

Para qué sirve: dar respaldo (o marcar como hipótesis) a cada clave de error de `plantillas/razonamiento-figuras/motor.js`: conteo de segmentos, triángulos, cuadriláteros, cuadrados y rectángulos en figuras planas (rectas con puntos, abanicos, cuadrículas, cuadrados con diagonales, triángulos con cevianas) y conteo de cubos en pilas. Complementa, sin repetir, a `docs/investigacion/aritmetica-razonamiento-ideas-erroneas.md` (AR17, error de orden; AR18, enumeración sin sistema) y a `docs/investigacion/geometria-ideas-erroneas.md` (GE13, sólido dibujado contado como plano).

### Resumen en cinco líneas

1. **Solo el conteo de cubos tiene investigación seria.** Battista y Clements (1996) trabajaron con alumnos de 3.er y 5.º grado; una fuente que los cita da 23 % y 63 % de aciertos con un edificio de 3 × 4 × 5, cifras **no confirmadas** (el revisor no las encontró). La primera idea del alumno es la pila como un conjunto de caras sin coordinar.
2. **Ben-Chaim, Lappan y Houang (1985) dan los cuatro errores de contar cubos dibujados:** caras visibles, caras visibles por dos, cubos visibles y cubos visibles por dos. Respaldan `pila.carasVisibles` y `pila.soloVisibles`. Según una fuente secundaria, los aciertos van de alrededor del 25 % en 5.º al 50 % en 8.º.
3. **El error de orden (contar AB y BA) tiene dato fuera de la geometría:** es el error más frecuente en combinatoria escolar con instrucción (Navarro-Pelayo, Batanero y Godino, 1996; ver AR17). Respalda en parte `segmentosRecta.conOrden`.
4. **Contar solo las piezas simples, olvidar las compuestas o contar dos veces en triángulos, abanicos y cuadrículas no tiene ningún estudio con datos.** Lo dicen las guías de academia y las páginas de práctica; quedan como hipótesis ligadas a AR18 (enumeración sin sistema).
5. **Ninguna fuente es peruana ni de postulantes, y no pude abrir ningún texto completo.** Por eso no hay ningún error «documentado» en este tema: de las 33 claves del motor, 4 son parciales y 29 hipótesis. La medición de la app en el colegio será la primera fuente con cifras propias para casi todo el tema.

### Cómo se hizo y su límite

- Se leyó la cabecera de `motor.js` y se armó la lista de claves `función.clave` (33 claves en 9 funciones; `piramideEsquina` y `escaleraCubos` devuelven los mismos errores que `pila`, así que comparten fila).
- Búsqueda web (WebSearch) en inglés y español: Battista y Clements (1996, 1998), Ben-Chaim y otros (1985), Olkun y Knaupp (ERIC ED428954), ítems de TIMSS de contar cubos, conteo de cuadrados en cuadrículas, conteo de triángulos, clasificación inclusiva de cuadriláteros (¿el cuadrado es rectángulo?) y tesis peruanas de «conteo de figuras».
- **Límite fuerte:** la red de la sesión bloqueó la descarga de textos completos (fallaron `springerlink.bibliotecabuap.elogim.com` y `openjournals.libs.uga.edu`; por la regla de la sesión no se probaron más sitios). Todo lo que sigue sale de resúmenes, fichas y fragmentos que devolvió el buscador. Por la regla del encargo, una cifra vista solo en resumen o en cita de terceros es **parcial**, nunca documentada.
- No encontré ítems liberados de TIMSS, PISA ni de la ECE peruana con cubos ocultos o conteo de cuadrados y su porcentaje por opción. Tampoco una tesis peruana sobre conteo de figuras: lo más cercano es una ponencia con alumnos peruanos que cuentan cuadrados de una malla para hallar áreas (no trata errores de conteo).

### De dónde salen los datos

| Fuente | Muestra | Instrumento | Qué aporta | Qué leí |
| --- | --- | --- | --- | --- |
| Battista, M. T. y Clements, D. H. (1996). *Students' understanding of three-dimensional rectangular arrays of cubes*. JRME 27(3), 258–292. [DOI 10.5951/jresematheduc.27.3.0258](https://doi.org/10.5951/jresematheduc.27.3.0258) (JSTOR: 10.2307/749365) · [ResearchGate](https://www.researchgate.net/publication/343754592_Students'_Understanding_of_Three-Dimensional_Rectangular_Arrays_of_Cubes) | Alumnos de 3.er y 5.º grado, EE. UU. (tamaño exacto no visto) | Entrevistas: predecir cuántos cubos forman un edificio rectangular dibujado o armado | 23 % de 3.er grado y 63 % de 5.º acertaron con un edificio de 3 × 4 × 5 (**no confirmado**); niveles de estrategia, desde «la pila como caras sin coordinar, solo cubos visibles o de afuera» hasta «arreglo por capas»; cuentan dos veces los cubos de aristas y esquinas y olvidan los de adentro | Resumen y cita de terceros (la cifra 23 % / 63 % viene de un artículo posterior que los cita; un fragmento desordenado da «64 % de 3.er grado y 21 % de 5.º» sin saber a qué categoría corresponde: no se usa) |
| Ben-Chaim (Ben-Haim), D., Lappan, G. y Houang, R. T. (1985). *Visualizing rectangular solids made of small cubes: analyzing and effecting students' performance*. Educational Studies in Mathematics 16(4), 389–409. [DOI 10.1007/BF00417194](https://doi.org/10.1007/BF00417194) | Alumnos de 5.º a 8.º grado, EE. UU. (tamaño no visto; un estudio hermano de 1988 tuvo unos 1000) | «¿Cuántos cubitos hacen falta para armar este sólido dibujado?» | Cuatro tipos de error: caras visibles, caras visibles × 2, cubos visibles, cubos visibles × 2. Aciertos de alrededor del 25 % (5.º) al 50 % (8.º); la misma fuente da errores de alrededor del 17, 22, 8 y 8 % sin que se sepa a qué opción corresponde cada uno ([boletín de la NTNU](https://epbulletin.epc.ntnu.edu.tw/BEP/upload/journal/prog/8434217e_20171213.pdf)) | Resumen y citas de terceros (dos fuentes coinciden en los cuatro errores; las cifras salen de una sola fuente secundaria) |
| Battista, M. T., Clements, D. H., Arnoff, J., Battista, K. y Van Auken Borrow, C. (1998). *Students' spatial structuring of 2D arrays of squares*. JRME 29(5), 503–532. [NCTM](https://www.nctm.org/Publications/journal-for-research-in-mathematics-education/1998/Vol29/Issue5/Students_-Spatial-Structuring-of-2D-Arrays-of-Squares/) | Un aula de 2.º grado, EE. UU. | Contar o predecir cuántos cuadritos tiene un rectángulo cuadriculado | Muchos alumnos no «ven» filas y columnas; niveles desde el conteo desordenado hasta el conteo por filas | Resumen y cita de terceros; sin cifras |
| Olkun, S. y Knaupp, J. E. (1999). *Children's understanding of rectangular solids made of small cubes*. [ERIC ED428954](https://files.eric.ed.gov/fulltext/ED428954.pdf) | Escolares (tamaño no visto) | Contar cubos de edificios rectangulares | Muchos cuentan solo los cubos visibles o las caras visibles | Fragmento del buscador; sin cifras |
| Tekin y otros, *An investigation into the performance, solution strategies…* [CIMT](https://www.cimt.org.uk/journal/tekin2.pdf); estudio turco de 6.º grado [ERIC EJ1013939](https://files.eric.ed.gov/fulltext/EJ1013939.pdf) | 7.º y 8.º de un colegio privado de Estambul; 6.º grado en Turquía | Contar cubos de prismas | Estrategia «contar los cubos visibles» registrada | Fragmento; sin cifras |
| Navarro-Pelayo, V., Batanero, C. y Godino, J. D. (1996). *Razonamiento combinatorio en alumnos de secundaria*. Educación Matemática 8(1), 26–39. [PDF](http://www.revista-educacion-matematica.org.mx/descargas/Vol8/1/05Navarro.pdf) | 720 alumnos de 14–15 años, Granada | Cuestionario de problemas combinatorios (número de problemas por confirmar) | Error de orden y enumeración sin sistema (ya en AR17 y AR18, con cifras «por confirmar» de la tesis de Roa, 2000) | Lo que ya resumió el informe de aritmética (resumen y cita de terceros) |
| Fujita, T. y Jones, K. (2007). *Learners' understanding of the definitions and hierarchical classification of quadrilaterals*. Research in Mathematics Education 9(1 y 2), 3–20. [PDF](https://eprints.soton.ac.uk/49731/1/Fujita_Jones_RME_vol9_2007.pdf) | 158 futuros profesores de primaria de Escocia | Definir y clasificar cuadriláteros | Según una reseña, solo el 13 % (20 de 158) aceptó que el cuadrado es un rectángulo; el 21,5 % dio una definición correcta de rectángulo ([reseña](https://ijres.net/index.php/ijres/article/download/186/pdf)). No es una tarea de conteo | Fragmento del buscador y cita de terceros |
| Páginas de práctica y academias (Unacademy, SATHEE IIT Kanpur, Shikshanation, The Math Doctors) | — | Guías de «figure counting» y el tablero de ajedrez (204 cuadrados) | Errores que repiten: olvidar los compuestos, contar dos veces, contar solo los de 1 × 1, contar puntos alineados como triángulo | Fragmentos; sin estudio ni cifras |

### Catálogo con respaldo

Respaldo: **documentado** (cifra leída en texto completo), **parcial** (cifra o descripción vista solo en resumen, fragmento o cita de terceros, o estudio sin cifra), **hipótesis** (sin correspondencia concreta en un estudio). Las filas van en el orden de la cabecera de `motor.js`.

| Código (función.clave) | Error (breve) | Qué dice la fuente (cifra exacta y muestra) | Fuente | Qué leí | Respaldo propuesto |
| --- | --- | --- | --- | --- | --- |
| `contar.soloPiezas` | Cuenta solo las piezas simples (regiones que no se parten más). | Ningún estudio. Las guías de práctica dicen que se olvidan las figuras grandes hechas de piezas. | Guías de práctica | Fragmentos | Hipótesis (ligada a AR18) |
| `contar.piezasYTotal` | Las piezas más la figura grande, sin las intermedias. | Sin dato. | — | — | Hipótesis |
| `contar.dobleCuenta` | Cada figura contada dos veces (de ida y de vuelta). | Sin dato en figuras planas. El mecanismo «contar con orden» tiene dato en combinatoria (AR17), pero no en conteo de figuras. | Navarro-Pelayo y otros (1996), como analogía | Resumen (vía informe de aritmética) | Hipótesis (ligada a AR17) |
| `contar.compuestasDosVeces` | Piezas una vez y cada compuesta dos veces. | Sin dato. Las guías mencionan «contar el mismo triángulo más de una vez» sin cifra. | Guías de práctica | Fragmentos | Hipótesis |
| `segmentosRecta.soloPiezas` | n − 1: solo los tramos entre puntos vecinos. | Sin dato. | — | — | Hipótesis (ligada a AR18) |
| `segmentosRecta.piezasYTotal` | n: los tramos más el segmento entero. | Sin dato. | — | — | Hipótesis |
| `segmentosRecta.conOrden` | n(n − 1): AB y BA por separado. | En combinatoria escolar, el error de orden fue el más frecuente en el grupo con instrucción (720 alumnos de 14–15 años; 37,8 % según la tesis de Roa, 2000, por confirmar). No es un estudio de segmentos. | Navarro-Pelayo, Batanero y Godino (1996); Roa (2000) | Resumen y cita de terceros (vía AR17) | Parcial (por analogía con AR17) |
| `triangulosAbanico.soloPiezas` | n: solo los triángulos de la base. | Sin dato. | — | — | Hipótesis |
| `triangulosAbanico.piezasYTotal` | n + 1: los de la base y el grande. | Sin dato. | — | — | Hipótesis |
| `triangulosAbanico.dobleCuenta` | 2·total. | Sin dato. | — | — | Hipótesis (ligada a AR17) |
| `triangulosAbanico.unNivel` | n(n + 1)/2: solo los de una línea horizontal; olvida que cada cuerda arma otra familia. | Sin dato. | — | — | Hipótesis |
| `triangulosAbanico.unNivelYPiezas` | n(n + 1)/2 + n: los de un nivel y además las piezas otra vez. | Sin dato. | — | — | Hipótesis |
| `cuadrilaterosAbanico.soloPiezas` | (k − 1)·n: solo los trapecios pieza. | Sin dato. | — | — | Hipótesis |
| `cuadrilaterosAbanico.piezasYTotal` | (k − 1)·n + 1. | Sin dato. | — | — | Hipótesis |
| `cuadrilaterosAbanico.comoTriangulos` | k·n(n + 1)/2: aplica la fórmula de triángulos del abanico. | Sin dato. | — | — | Hipótesis |
| `cuadradosCuadricula.soloPiezas` | m·n: solo los cuadraditos de 1 × 1 (en el tablero de ajedrez, 64 en vez de 204). | Ningún estudio con cifra. Battista y otros (1998) muestran que en 2.º grado muchos ni siquiera estructuran bien los cuadraditos de 1 × 1 (conteo desordenado), pero no estudian los cuadrados grandes. | Battista y otros (1998); The Math Doctors | Resumen; fragmento | Hipótesis |
| `cuadradosCuadricula.piezasYGrande` | m·n + 1. | Sin dato. | — | — | Hipótesis |
| `cuadradosCuadricula.soloDiagonal` | m·n + C(mín, 2): los grandes solo a lo largo de una diagonal. | Sin dato. | — | — | Hipótesis |
| `cuadradosCuadricula.comoCuadrada` | Σk² hasta mín(m, n): usa la fórmula de la cuadrícula cuadrada en una rectangular. | Sin dato. | — | — | Hipótesis |
| `cuadradosCuadricula.ladoLargo` | Σk² hasta máx(m, n). | Sin dato. | — | — | Hipótesis |
| `rectangulosCuadricula.soloPiezas` | m·n: solo los cuadraditos. | Sin dato. | — | — | Hipótesis |
| `rectangulosCuadricula.sinCuadrados` | total − cuadrados: no cuenta los cuadrados como rectángulos. | Con 158 futuros profesores de primaria de Escocia, solo el 13 % (20 de 158) aceptó que el cuadrado es un rectángulo, según una reseña. No es una tarea de conteo: la correspondencia es con la clasificación, no con el conteo. | Fujita y Jones (2007) | Cita de terceros | Parcial (no es una tarea de conteo) |
| `rectangulosCuadricula.suma` | C(m + 1, 2) + C(n + 1, 2): suma en vez de multiplicar las elecciones de líneas. | Sin dato en conteo de figuras. El principio multiplicativo como fuente de error en combinatoria aparece en el grupo de Granada, pero no lo verifiqué para este caso. | — | — | Hipótesis |
| `rectangulosCuadricula.soloFilas` | m·C(n + 1, 2): solo rectángulos de una fila de alto. | Sin dato. | — | — | Hipótesis |
| `triangulosCuadradoDiagonales.soloPiezas` | 4: solo los cuatro triángulos pieza. | Sin dato. | — | — | Hipótesis |
| `triangulosCuadradoDiagonales.unaDiagonal` | 6: las piezas y las mitades de una sola diagonal. | Sin dato. | — | — | Hipótesis |
| `triangulosCuadradoDiagonales.compuestasDosVeces` | 12. | Sin dato. | — | — | Hipótesis |
| `triangulosDosCevianas.soloPiezas` | Solo las piezas del triángulo con dos cevianas. | Sin dato. | — | — | Hipótesis |
| `triangulosDosCevianas.piezasYTotal` | Piezas más el triángulo grande. | Sin dato. | — | — | Hipótesis |
| `triangulosDosCevianas.dobleCuenta` | 2·total. | Sin dato. | — | — | Hipótesis (ligada a AR17) |
| `pila.soloVisibles` (y `piramideEsquina`, `escaleraCubos`) | Cuenta solo los cubos que se ven; omite los ocultos. | Ben-Chaim y otros: dos de los cuatro errores son «cubos visibles» y «cubos visibles × 2»; los aciertos van de alrededor del 25 % (5.º) al 50 % (8.º), y los cuatro errores rondan el 17, 22, 8 y 8 %, sin asignación a cada opción (una sola fuente secundaria). Battista y Clements: el nivel más bajo cuenta «solo los cubos visibles o de afuera»; una cita de terceros da 23 % de 3.er grado y 63 % de 5.º de aciertos con 3 × 4 × 5 (no confirmado). Olkun y Knaupp y estudios turcos lo registran sin cifra. | Ben-Chaim, Lappan y Houang (1985); Battista y Clements (1996); Olkun y Knaupp (1999) | Resumen y citas de terceros | Parcial (ya figura como GE13 en geometría; el informe de geometría lo da como documentado con la regla anterior de «dos fuentes que coinciden»: con la regla de este encargo baja a parcial) |
| `pila.carasVisibles` (y `piramideEsquina`, `escaleraCubos`) | Cuenta las caras que se ven en vez de los cubos. | Ben-Chaim y otros: «caras visibles» y «caras visibles × 2» son los otros dos errores; contar caras fue el más frecuente según el informe de geometría (GE13), dato que no volví a ver en esta búsqueda. Battista y Clements: la idea inicial del alumno es la pila como «conjunto de caras sin coordinar». Hirstein (1981), citado por terceros: confunden volumen con área de la superficie. | Ben-Chaim y otros (1985); Battista y Clements (1996); Hirstein (1981) | Resumen y citas de terceros | Parcial |
| `pila.caja` (y `piramideEsquina`, `escaleraCubos`) | Largo · ancho · alto de la caja que envuelve la pila, como si la pila fuera un bloque lleno. | Sin dato directo. Los estudios de cubos usan bloques rectangulares llenos, donde la caja es la respuesta correcta; el error de aplicar la fórmula a una pila escalonada no aparece en lo que vi. | — | — | Hipótesis |

**Conteo (33 claves del motor):** 0 documentadas, 4 parciales (`segmentosRecta.conOrden`, `rectangulosCuadricula.sinCuadrados`, `pila.soloVisibles`, `pila.carasVisibles`), 29 hipótesis. Las claves de `pila` valen también para `piramideEsquina` y `escaleraCubos`.

#### Errores de las fuentes que el motor aún no tiene

Sirven para opciones nuevas en la pestaña de pilas; los dos tienen el mismo respaldo parcial de Ben-Chaim y otros (1985):

- **Cubos visibles × 2** (cuenta los que ve y duplica «por los de atrás»).
- **Caras visibles × 2.**
- Battista y Clements (1996) describen además **contar dos veces los cubos de aristas y esquinas** al recorrer cara por cara, que en una pila sale como suma de las tres vistas sin descontar las aristas compartidas. Tampoco está en el motor.

## Huecos y siguientes pasos

- **Leer los textos completos de prioridad A** (sección 5 de `fuentes/por-conseguir.md`). Lo que más podría mover respaldos: Sudihartinih y Purniati (2020) en cónicas, Borji y otros (2020) y Habre (2017) en polares, Kazunga y Bansilal (2017, 2018) en matrices, Batanero y otros (1997) en binomio, Turanlı y otros (2007) en complejos, y Kondo y otros (2013, 2014) y Battista y Clements (1996) en espacio y figuras.
- **Medir en el colegio.** Como en los demás informes, las hipótesis se confirman o descartan con los datos del lanzamiento: la predicción registra el código de cada opción elegida.
- **GE13.** El informe de geometría lo da como documentado. Con la regla de este informe (texto completo leído), sería parcial. La escena de figuras ya lo usa como parcial.
