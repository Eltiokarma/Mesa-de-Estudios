# Cuzcano: fuentes de consulta

Avance vigente: **4213 fichas locales**, incluidas **1000 nuevas de Razonamiento Matemático** (1202 acumuladas en ese curso). Se añadieron cien por cada uno de diez temas; el mapa inicial de 123 temas tiene ahora 28 con mínimo de cien revisados. Las 3213 fichas anteriores se conservaron sin cambios. Consultar [avance-rm-1000.json](avance-rm-1000.json), [cobertura-100-por-tema.json](cobertura-100-por-tema.json) y [plan-cobertura-cursos.json](plan-cobertura-cursos.json). Las secciones siguientes conservan los hitos históricos y sus cifras de cada momento.

La tanda comprende planteo de ecuaciones, edades y móviles, operaciones matemáticas, comparación de magnitudes, fracciones, tanto por ciento, sucesiones, series, análisis combinatorio y cálculo de probabilidades. Son ejercicios del material original con soluciones propias en tres pasos, controles locales y referencias a páginas; las figuras se reconstruyen en SVG y los ejercicios sin figura tienen tarjetas de relaciones. 797 nuevas no tienen condiciones registradas y 203 conservan aclaraciones para producto. Se documentan claves incompatibles, parámetros, dominios, reglas no únicas y supuestos probabilísticos. No se certifican libros completos ni cien ejercicios por cada subtema.

El lector privado actualizado está en `fuentes/ocr-local/cuzcano/cierre-rm-1000/index.html`, con consultas por tema, búsqueda, filtro de condiciones, JSON completo y distribución por subtema. Los materiales permanecen físicamente en D. GitHub recibe herramientas generales y resúmenes; los autores de fichas, enunciados, soluciones, evidencias y respaldos completos permanecen locales. No se repitió OCR ni se usaron servicios externos para el cálculo.

Se restauraron y verificaron 10685 archivos; desde la copia pasaron 3939 controles en 105 bloques. El ZIP tiene 2551476736 bytes y SHA-256 `cb382ebe60ac303d24ce177e499cb4fdd5c5ab8d544e20e67866dce50025afc0`. Las 3213 fichas previas conservaron sus archivos. La extracción temporal se retiró. Prueba local: `fuentes/ocr-local/cuzcano/archivo-ejercicios/prueba-restauracion-rm-1000.json`; resumen: [respaldo-100-por-tema.json](respaldo-100-por-tema.json).

La biblioteca original y los hitos históricos se documentan a continuación.

Inventario de los 198 documentos publicados en [UNIverse to Study](https://universetostudy.com/biblioteca/cuzcano/), consultado el 8 de noviembre de 2026. Alcance solicitado: toda la colección.

La comparación de SHA-256 encontró 197 contenidos PDF distintos: dos entradas apuntan a copias idénticas de un documento de 23 páginas. `duplicados.json` conserva esa relación; no se eliminan referencias del inventario. El total de 21 522 páginas corresponde a las 198 entradas, incluidas ambas copias.

`cobertura-catalogo.json` relaciona las entradas con los identificadores de cursos de `catalogo/cursos/`, usando título, sección y colección. Es una inferencia de metadatos, no una clasificación de todas las preguntas:

| Curso | Entradas |
| --- | ---: |
| Geometría | 48 |
| Física | 44 |
| Aritmética | 33 |
| Trigonometría | 26 |
| Álgebra | 18 |
| Razonamiento matemático | 15 |
| Química | 14 |

No se identifica un título de razonamiento verbal en este catálogo.

## Resultado del OCR del 8 de noviembre y revisión al 9 de noviembre de 2026

- 198 entradas descargadas y procesadas; 197 contenidos PDF distintos.
- 21 522 páginas: 21 462 con OCR nuevo en español y 60 con capa textual previa aprovechable.
- Cero libros con fallo de procesamiento. La auditoría de integridad pasó y las trece pruebas de herramientas están aprobadas.
- 299 páginas con algún cotejo visual: seis con texto completo cotejado, seis sin texto principal y 287 parcialmente revisadas. Ningún libro completo certificado.
- 19 copias corregidas locales: 17 reconstrucciones visuales y dos páginas con nueve reemplazos puntuales en total.
- 13 722 páginas siguen en la cola de baja confianza. El nuevo lote examinó 24 páginas de confianza cero y resolvió diez entradas de la cola: seis transcripciones completas y cuatro páginas sin texto principal.

`auditoria.json` conserva las comprobaciones y recuentos de su ejecución histórica; no se ha repetido para los pilotos puntuales posteriores. `revision-muestras.json` contiene los recuentos actuales de revisión. `entorno-ocr.json` registra las versiones de Python, bibliotecas y motor, y el hash del modelo de español. La integridad del lote no equivale a exactitud del OCR: la revisión visual del resto está pendiente.

### Piloto de ejercicios con figuras

La tanda de Física PREUNI incorpora los problemas originales 1–300 en diez bloques de treinta. Conserva enunciados normalizados, soluciones propias por pasos, gráficos SVG o tarjetas conceptuales, fichas JSON y evidencias locales. Los 300 controles pasaron y los lectores se comprobaron a 390 píxeles de ancho. Hay 26 fichas con condiciones o ambigüedades pendientes para producto, detalladas en el lector; no se certifican como contenido listo para la app. No se repitió el OCR ni se certificaron páginas completas adicionales.

`fisica-preuni-300.json` guarda el resumen sin enunciados ni figuras. El lector consolidado está en `fuentes/ocr-local/cuzcano/coleccion-fisica-preuni-300/index.html`; su `ejercicios.json` permite recuperar las 300 fichas sin volver a interpretarlas. Al cerrar esa tanda el archivo acumulaba 574 fichas y tres guías, con respaldo ZIP local y comprobador de integridad. Las observaciones y los límites de cada ficha se conservan en el respaldo.

La continuación incorpora los problemas 301–500 de Física: 200 fichas más, seis bloques de treinta y uno de veinte. Incluye soluciones propias por pasos, SVG, redes equivalentes, proyecciones y diagramas de rayos, distinguidos de las evidencias originales. Hay 170 fichas sin observaciones detectadas y 30 con condiciones o ambigüedades para producto. Se documentan figuras ausentes, alternativas múltiples o incompatibles, referencias de coeficientes térmicos, fases y factores de potencia omitidos, convenciones de flujo y una coma no visible en una ecuación de onda. No se fuerzan respuestas de las alternativas.

`fisica-preuni-301-500.json` conserva el resumen de la tanda. Su lector está en `fuentes/ocr-local/cuzcano/coleccion-fisica-preuni-301-500/index.html`, con búsqueda, filtro de casos condicionados y las 200 fichas en JSON. Los siete lectores se comprobaron a 390 píxeles, sin imágenes faltantes ni desbordamiento. No se repitió el OCR ni se certificaron páginas completas. El siguiente problema de Física es el 501.

`piloto-graficos.json` registra dos ejercicios locales, uno de geometría y otro de estática, vinculando enunciado, figura y resolución por pasos. Sus cuatro páginas sólo tienen cotejo parcial: no se retira ninguna de la cola.

La demostración de geometría se cotejó y se complementó con ocho construcciones numéricas que verifican pertenencias, paralelismo, bisectrices e igualdades. En estática, la respuesta editorial se reproduce mediante su aproximación de triángulo notable; con los ángulos literales se compensan las fuerzas, pero queda un residuo de momento. Este segundo ejercicio requiere aclaración geométrica y no queda validado para la app.

La entrega de consulta está en `fuentes/ocr-local/cuzcano/piloto-graficos/index.html`, con fichas JSON, dibujos SVG, recortes de evidencia, comprobación Python y ZIP. Se inspeccionaron los dibujos rasterizados y se verificaron las referencias locales y la integridad de los once archivos del ZIP. Los materiales fuente permanecen fuera de Git. Esta prueba no constituye un motor reutilizable ni amplía el procesamiento masivo.

Los PDF y las transcripciones son material local de consulta. Siguiendo `CLAUDE.md`, no se incorporan sus enunciados, textos ni figuras al producto. Git guarda el inventario, las herramientas y los registros de procesamiento; los originales y el OCR quedan excluidos.

## Preparación

Python 3.12. Desde la raíz del repositorio:

```sh
python -m pip install --target .ocr-deps -r herramientas/requirements-ocr.txt
```

Crear `.tessdata/` y descargar allí el modelo `spa.traineddata` del repositorio oficial [tessdata_fast](https://github.com/tesseract-ocr/tessdata_fast). Las ruedas de tesserocr usadas incluyen Tesseract; no requieren instalar la aplicación por separado. En Linux sin rueda compatible, consultar la instalación de [tesserocr](https://github.com/sirfz/tesserocr).

## Ejecutar

```sh
python herramientas/cuzcano.py --descargar
python herramientas/ocr_cuzcano.py --workers 4
python herramientas/estado_cuzcano.py
python herramientas/auditar_cuzcano.py
```

Ejecutar OCR después de terminar la descarga: el procesador toma la lista de PDF disponible al arrancar. Si empezó antes, repetir el comando cuando acaben las descargas. Los resultados completos por página se reutilizan.

Para actualizar el inventario, descargar `https://universetostudy.com/universe-ui/data/platform.json` y ejecutar `python herramientas/cuzcano.py --inventariar platform.json`. Revisar el cambio de inventario antes de volver a descargar.

## Qué produce

- `inventario.json`: título, colección, sección, autor y enlace original; la clave es el identificador completo de Drive.
- `descargas.json`: resultado por archivo, tamaño y SHA-256. Descargas incompletas terminan en `.part`; no se consideran PDF terminados.
- `fuentes/libros/cuzcano/<id>.pdf`: originales locales.
- `fuentes/ocr-local/cuzcano/<id>/p-NNNN.json`: texto por página de PDF, método, confianza cuando existe y coordenadas de reconocimiento. Es material local, no versionado.
- `procesamiento.json`: registro local no versionado de libros procesados hasta el final en la ejecución actual; se actualiza al terminar cada libro. Los JSON individuales permiten recuperar el avance de ejecuciones anteriores.
- `errores-ocr.json`: registro local no versionado de errores por libro, sin detener el procesamiento de los demás; si existen, el proceso termina con código de error.
- `estado.json`: avance que se puede regenerar mientras corre el OCR; diferencia páginas procesadas y revisión visual.

Al terminar una ejecución, el procesador actualiza automáticamente el estado y la cola de revisión. Si se interrumpe durante una página, al repetir el comando se conservan las páginas completas.

La auditoría contrasta los identificadores, hashes de origen, continuidad de páginas, métodos de extracción y vigencia de las copias corregidas. Es una comprobación de integridad, no de exactitud matemática ni textual.

El OCR usa Tesseract 5 en español y renderiza a 200 dpi, con un máximo de 3500 píxeles en el lado largo: algunos PDF declaran dimensiones físicas desproporcionadas. Cada resultado nuevo registra su resolución efectiva; los resultados anteriores conservan sus dimensiones originales. Una capa textual previa se reutiliza si supera comprobaciones básicas de longitud, caracteres legibles y caracteres de reemplazo; esas comprobaciones **no certifican su exactitud**. `--forzar-ocr` permite reconocer un archivo íntegramente, pero requiere una salida sin resultados de otra configuración.

En escaneados apaisados con relación de aspecto mayor que 1,2, se reconocen las mitades izquierda y derecha en ese orden. Es una heurística: revisar las páginas apaisadas que no sean dobles. Se conservan las regiones y sus coordenadas para cotejarlas con el original. El texto no representa fielmente figuras, fracciones, matrices ni otras expresiones bidimensionales.

## Revisión visual

Todas las páginas parten de `revision_visual: pendiente`. La confianza de Tesseract no mide corrección matemática ni garantiza el orden de columnas. Las páginas cortas o con confianza menor de 80 reciben prioridad alta; también hay que cotejar fórmulas, figuras, alternativas e índices de las demás páginas.

Prioridad solicitada por Gerson: revisar primero las páginas de baja confianza. `python herramientas/cola_revision_ocr.py` genera una cola local ordenada, separando las que ya tienen un cotejo parcial. Una página sin texto reconocido puede ser una portada, una página en blanco o un fallo: comprobarlo en la imagen.

Las páginas clasificadas visualmente como `sin_texto_principal` salen de esa cola. También salen las de `estado: texto_cotejado`, `alcance: texto_completo` y `pendientes: []`, siempre que exista una copia corregida vinculada al mismo registro y al hash vigente del OCR original. Un cotejo textual completo no certifica exactitud matemática. En páginas dobles se registra la menor confianza de las dos mitades; una mitad en blanco puede producir cero aunque la otra tenga texto legible.

Conservar el OCR crudo. Guardar correcciones en un archivo local separado, con identificador de libro, página PDF, fragmento original, corrección y motivo. No completar texto ilegible por conjetura. Registrar explícitamente si una revisión fue parcial; no contarla como revisión integral.

`python herramientas/aplicar_correcciones_ocr.py <registro-local.json>` aplica correcciones con campos `original` y `correccion` únicamente si cada fragmento aparece una sola vez. Produce un archivo `.corregido.json` separado, ligado al SHA-256 del OCR original. Si se vuelve a reconocer la página, verificar ese SHA y volver a cotejar las correcciones; no reutilizarlas ciegamente.

Cuando el OCR está vacío o resulta inservible, el registro puede proporcionar `texto_reconstruido` y `sha256_ocr_original`. Esta modalidad es excluyente con los reemplazos y también conserva el original. Las reconstrucciones parciales deben identificar expresamente su alcance y los segmentos pendientes; no equivalen a una transcripción completa.

`python herramientas/preparar_revision_visual.py --inicio 0 --cantidad 8` prepara imágenes y OCR de un lote para cotejo. La identidad del lote depende de sus páginas, por lo que regenerar la cola no sobrescribe evidencia de otro lote. Después de revisar:

```sh
python herramientas/cola_revision_ocr.py
python herramientas/resumir_revision_visual.py
python herramientas/auditar_cuzcano.py
python herramientas/exportar_revision_cuzcano.py
python -m unittest discover -s herramientas -p 'test_*.py'
```

## Piloto de mejora local por lotes

En Windows, `OCR-local-5-paginas.cmd` ejecuta un lote de cinco páginas de química y abre un comparador local. No usa servicios externos ni modelos de OpenAI. Requiere los PDF, el OCR previo, `.ocr-deps` y `.tessdata` locales: el repositorio por sí solo no contiene esos archivos. Busca Python en `.venv` o en el runtime instalado de Codex.

El piloto conserva tres alternativas: resolución de 300 dpi (limitada a 4200 píxeles de lado), contraste y columnas de anchura fija. No modifica originales, correcciones ni la cola, y no declara ninguna alternativa validada. Las páginas giradas requieren indicar `--giro` tras confirmar su orientación visualmente. No se aplican reglas químicas o matemáticas para adivinar símbolos.

```sh
python herramientas/mejorar_ocr_local.py --libro 1EN0I_nCIO_ELsQ2nY_CKaKYCTbGDCRpl --limite 5 --abrir
# Para elegir otro lote explícito, sustituir los números por páginas pendientes:
python herramientas/mejorar_ocr_local.py --libro IDENTIFICADOR --limite 5 --paginas 1 2 3 4 5
```

Sin `--paginas` se eligen hasta cinco páginas de menor confianza sin cotejo previo del libro. El límite máximo es veinte por ejecución. Repetir el mismo lote reutiliza sus resultados cuando coinciden PDF, OCR original, modelo y configuración; no avanza silenciosamente a otras páginas. El informe y el lector están en `fuentes/ocr-local/cuzcano/<id>/lotes-locales/`; las alternativas, en `candidatos-locales/`.

El primer piloto procesó las páginas PDF 13, 14, 22, 12 y 9. Sólo una de cinco tuvo una alternativa con mayor confianza media por palabra; las otras cuatro no mejoraron esa métrica. El cotejo de un fragmento de la página 13 confirmó que siguen fallando cargas y subíndices. Esto no mide la exactitud real de las cinco páginas ni justifica reprocesar toda la colección con estos ajustes. `piloto-ocr-local.json` conserva las métricas, sin texto de los libros.

## Formatos para consulta y producto

### Ensayo de interpretación a partir del OCR

Se leyeron las páginas PDF 9, 12, 13, 14 y 22 del material de química y se seleccionó un ejercicio representativo por página. Los datos críticos se cotejaron en cinco recortes. El resultado son cinco fichas locales estructuradas con datos, fórmulas LaTeX, resultado, supuestos, referencia al recorte y pendientes. No se marcaron como completas las cinco páginas ni se alteró el texto crudo.

Las verificaciones abarcaron comparación de Qc con Kc mediante fracciones, transferencia de protón y carga, raíz analítica frente a bisección, constante a partir de la fracción disociada y balances de una mezcla. Son comprobaciones de esos casos bajo sus supuestos, no motores generales implementados ni validación de todos los ejercicios del libro.

El lector está en `fuentes/ocr-local/cuzcano/piloto-interpretacion-5/index.html`; `fichas.json` contiene los registros y `interpretar.py` reproduce las comprobaciones sin servicios externos. `piloto-interpretacion.json` guarda sólo el resumen versionado. El método produjo cinco fichas utilizables para orientar diseño, pero las cinco necesitaron visión: no hay medición comparable de tokens para afirmar un porcentaje de ahorro.

La entrega local está en `fuentes/ocr-local/cuzcano/entrega/`: `index.html` permite leer y comparar, `paginas-corregidas.jsonl` guarda un registro por página y `revision-cuzcano.zip` reúne ambos con un manifiesto de hashes. El paquete es un avance, no toda la colección corregida. No contiene los PDF. Cada registro incluye referencia al libro y página, OCR original, texto corregido, estado del cotejo, pendientes y validación matemática pendiente. `formulas_latex` contiene únicamente las expresiones ya normalizadas; no se promete cobertura total.

Para el producto se propone JSON por ejercicio propio, con datos tipados, unidades, dominio, fórmulas LaTeX, figura paramétrica, referencia al motor y casos de prueba independientes. El OCR es material de consulta; no se conecta directamente como banco de ejercicios del alumno. Las fuentes sirven para detectar familias y dificultades, de las que se crearán enunciados y figuras propios.

`motores-candidatos.json` registra seis familias observadas y sus comprobaciones necesarias. Es una lista para diseño posterior, no motores implementados ni una nueva prioridad de la hoja de ruta. Respeta el patrón existente `motor.js` + `casos.json` + `motor.test.js`: el código calcula; el modelo ayuda a interpretar. Para pH, consultar primero el pendiente qu3; para nuevas áreas, investigar ideas erróneas antes de construir la escena.

Los cotejos detectaron posibles errores de la fuente y convenciones particulares. Se anotan sin alterar silenciosamente el libro: dominios de radicales, redondeos de ángulos y reglas lógicas que no deben generalizarse como probabilidades.

Cuando el cotejo confirme columnas de igual anchura, `python herramientas/reordenar_columnas_ocr.py <pagina.json> --columnas 2` genera una lectura alternativa sin repetir el OCR. El número indicado corresponde a cada región reconocida: dos columnas por cada mitad de una doble página producen cuatro columnas. Conserva palabras y coordenadas; no corrige fórmulas ni garantiza el orden de títulos que ocupan varias columnas.

La prueba inicial con el Solucionario 1 de Química CEPREUNI 2015-2 mostró mezcla de columnas y confusiones en letras de alternativas y fórmulas. Motivó la lectura separada de páginas enfrentadas. Una segunda muestra (Ondas electromagnéticas, página PDF 10) omitió un recuadro sombreado y rótulos de una figura aunque tenía confianza 95. La colección no debe considerarse un corpus validado mientras quede revisión pendiente.

### Piloto de razonamiento matemático y polinomios

`piloto-rm-polinomios.json` registra dos ejercicios y tres páginas parcialmente cotejadas. Se reconstruyó un gráfico de conteo conservando qué rayos llegan a cada base; un enumerador geométrico independiente confirmó la resolución editorial. El lector local permite resaltar cada triángulo. En álgebra se recuperaron exponentes fraccionarios y se elaboró una solución propia, diferenciada de la fuente y comprobada con fracciones exactas.

La entrega local está en `fuentes/ocr-local/cuzcano/piloto-rm-polinomios/index.html`, con JSON, SVG, recortes y ZIP. Se comprobaron los enlaces locales, las 31 selecciones y el reinicio del selector, y el comprobador Python desde una copia aislada del ZIP. Se inspeccionaron visualmente los recortes y el SVG; no se obtuvo captura del lector HTML completo. Ninguna página sale de la cola.

### Piloto de gráficos complejos y geometría espacial

`piloto-complejos.json` registra dos ejercicios y tres páginas parcialmente revisadas. El conteo plano reconstruye los cruces de doce segmentos y documenta una discrepancia con la clave editorial: dos triángulos compuestos adicionales se muestran explícitamente. Dos enumeraciones exactas coinciden. En geometría espacial se conservan las letras de la fuente y sus proyecciones; se comprueban diagonal, ángulos con planos y volumen.

La entrega está en `fuentes/ocr-local/cuzcano/piloto-complejos/index.html`. Incluye selección individual de triángulos planos y espaciales, resolución editorial separada del cotejo independiente, fichas JSON, dibujos SVG, evidencia y un ZIP de doce archivos. Se inspeccionaron los recortes y figuras rasterizadas, se comprobaron controles y enlaces, y se ejecutó el comprobador desde una copia aislada. No se retiró ninguna página de la cola.

### Archivo reutilizable y lote de cuatro polinomios

`archivo-ejercicios.json` registra 774 fichas localizables por libro, tipo y número: incluye los 500 problemas de Física y conserva los avances anteriores. El índice local está en `fuentes/ocr-local/cuzcano/archivo-ejercicios/index.html`. Sus 2357 archivos de consulta tienen un manifiesto de integridad. El ZIP conjunto conserva lectores, fichas, recortes, dibujos y comprobadores. Es un respaldo local, no una copia remota en GitHub; su prueba de restauración queda registrada aparte. La construcción del ZIP sustituye el respaldo anterior sólo después de verificar el paquete nuevo.

Antes de seleccionar un ejercicio, buscar su libro, tipo y número en el índice: reutilizar la ficha si ya existe; volver a la fuente sólo para resolver una duda o corregirla. Para comprobar lo guardado sin modificar el registro: `python herramientas/indexar_ejercicios_locales.py`. Después de incorporar o corregir fichas deliberadamente: `python herramientas/indexar_ejercicios_locales.py --actualizar --zip`. La actualización informa archivos nuevos, modificados y retirados. El ZIP contiene `archivo-ejercicios/comprobar_archivo.py` para comprobar una restauración. Los hashes detectan cambios, no certifican las matemáticas.

`polinomios-lote-4.json` describe cuatro ejercicios nuevos de homogeneidad, grados relativos, completitud y grado mínimo. Se cotejaron dos páginas parcialmente; una ya tenía revisión. Las fichas incluyen datos estructurados y soluciones propias, diferenciadas de una solución editorial no cotejada. El lector está en `fuentes/ocr-local/cuzcano/polinomios-lote-4/index.html`. Los cálculos exactos se repitieron desde el respaldo aislado. Cinco pruebas del indexador pasan; no se vuelve a procesar la colección ni se retiran páginas de la cola.


### Geometría: continuación consecutiva

Se cotejaron los problemas 8–17 de Prisma y cilindro, PDF 28–33. Las diez fichas locales conservan enunciado normalizado, recortes originales con letras, relaciones geométricas y resolución explicada. Todos los resultados coinciden con la edición; el problema 17 incorpora además el dominio no degenerado, comprobado con doce configuraciones tridimensionales. Python comprueba el lote y el lector funciona sin conexión. Son seis páginas parcialmente cotejadas; ninguna se retira de la cola. El siguiente ejercicio es el 18. El respaldo conjunto contiene 25 fichas y 100 archivos verificados, y fue restaurado sin PDF ni OCR.

Los diez ejercicios de este lote tienen ahora dibujos SVG reconstruidos, con letras y cotas, visibles directamente en el lector. Las secciones auxiliares aclaran la geometría usada en la resolución. Los originales quedan disponibles para contraste. Los redibujos permanecen en el archivo local y su respaldo.


### Geometría: problemas 18–27

Diez ejercicios adicionales cotejados en las páginas PDF 33–39, con diez SVG reconstruidos y soluciones por pasos. Ocho resultados coinciden exactamente bajo los supuestos de las figuras; en los problemas 21 y 26 se conserva la aproximación editorial de 37 grados y también el resultado literal. Las comprobaciones independientes usan coordenadas, productos escalares, determinantes y tetraedros. El archivo acumulado contiene 35 fichas y 141 archivos; se restauró y comprobó sin PDF ni OCR. El lector pasó las comprobaciones de imágenes y ancho móvil. Siguiente problema: 28. No se certificaron páginas completas ni se repitió OCR.


### Geometría: problemas 28–57

Treinta ejercicios cotejados en tres grupos, con treinta redibujos SVG y resolución por pasos. Veintiuno no presentan observaciones; nueve documentan correcciones, condiciones, discrepancias o aproximaciones. Seis requieren aclarar el enunciado antes de convertirlos en actividades del producto. Los tres lectores fueron comprobados en móvil. El respaldo acumulado de 65 fichas y 262 archivos se restauró sin PDF ni OCR; las treinta comprobaciones matemáticas pasaron desde esa copia. Hay 82 páginas con algún cotejo, sin nuevas páginas completas certificadas. No se repitió OCR. Siguiente problema: 58.


### Geometría: problemas 58–87

Treinta ejercicios adicionales en tres grupos, con treinta redibujos SVG, resoluciones por pasos y datos geométricos reutilizables. Dieciséis fichas sin observaciones y catorce con correcciones, condiciones, discrepancias o aproximaciones documentadas. Ocho requieren aclaración antes de derivar actividades del producto. Los controles incluyen contraejemplos para condiciones no especificadas y una incompatibilidad de datos: no certifican los enunciados originales.

Tres lectores comprobados en móvil. El respaldo acumulado de 95 fichas y 387 archivos se restauró sin PDF ni OCR; las treinta comprobaciones del lote pasaron desde esa copia. Hay 99 páginas con algún cotejo, 87 parciales; ninguna nueva página completa certificada. No se repitió OCR ni se retiraron páginas de la cola. Siguiente problema: 88.


### Cierre de problemas resueltos de geometría

Se incorporaron 19 fichas: 1–6 y 88–100, con redibujos SVG, evidencia local y comprobaciones independientes. Catorce están verificadas y cinco conservan correcciones, condiciones o aproximaciones editoriales. El índice cubre los 100 problemas resueltos, sin certificar el libro completo: quedan teoría y propuestos. La siguiente sección empieza con el propuesto 1 en la página PDF 83 y debe registrarse con tipo separado.

El respaldo acumulado contiene 114 fichas y 469 archivos; se restauró y las 19 comprobaciones nuevas pasaron sin los PDF ni el OCR originales. Los dos lectores se comprobaron en móvil. Se mantienen 13 722 páginas en la cola; 110 tienen algún cotejo (98 parciales, seis completas y seis sin texto principal).


### Propuestos de geometría 1–8

Se guardaron ocho fichas con soluciones propias por pasos, construcciones SVG y evidencia del enunciado original. Cinco coinciden con las claves, una corrige un factor omitido y dos documentan condiciones ausentes, con contraejemplos que demuestran la falta de unicidad. Se registran con tipo `propuesto` para no confundirse con los resueltos.

Las ocho comprobaciones geométricas y el lector móvil pasaron. El respaldo acumulado de 122 fichas y 499 archivos fue restaurado y verificado; los ocho controles se ejecutaron desde esa copia sin PDF ni OCR originales. Hay 111 páginas con algún cotejo, 99 parciales; la cola conserva 13 722 páginas. Siguiente: propuesto 9, páginas PDF 83–84. Ningún libro completo certificado.


### Propuestos de geometría 9–13

Cinco nuevas fichas guardadas con soluciones propias por pasos, SVG ampliables y evidencia original. Cuatro resultados coinciden con sus claves. El propuesto 12 tiene datos incompatibles bajo proyección ortogonal: se conserva la clave formal, se demuestra el fallo y se separa una variante reparada.

Las cinco comprobaciones geométricas pasaron, incluidos los controles de incompatibilidad. Gráficos inspeccionados visualmente y lector móvil comprobado. El respaldo de 127 fichas y 522 archivos fue restaurado; los cinco controles se ejecutaron desde él sin PDF ni OCR originales. Hay 112 páginas con algún cotejo, 100 parciales; la cola conserva 13 722 páginas. Siguiente: propuesto 14, página PDF 84. Ningún libro completo certificado.


### Propuestos de geometría 14–43: tanda de treinta

Treinta fichas nuevas con soluciones propias por pasos, SVG ampliables y evidencia original. Veintiuna verificadas sin discrepancias; nueve con observaciones: tres condicionadas (16, 18, 38), dos incompatibles (25, 26), dos claves corregidas (29, 30) y dos aproximaciones angulares (28, 42). Las variantes ilustrativas y contraejemplos se identifican expresamente.

Las treinta comprobaciones matemáticas pasaron; incluyen áreas y volúmenes por coordenadas y descomposición en tetraedros, coplanaridad, perpendicularidad y contraejemplos. Treinta gráficos inspeccionados visualmente y lector completo comprobado en móvil. El respaldo acumulado contiene 157 fichas y 626 archivos; fue restaurado y los treinta controles se ejecutaron desde esa copia sin PDF ni OCR originales. Hay 116 páginas con algún cotejo, 104 parciales; la cola conserva 13 722 páginas. Siguiente: propuesto 44, página PDF 88. Ningún libro completo certificado.


### Propuestos de geometría 44–73: segunda tanda de treinta

Treinta fichas nuevas con soluciones propias, SVG ampliables y evidencia original. Veinte verificadas; diez con observaciones: cuatro condicionadas (61, 67, 72, 73), cuatro claves corregidas (52, 53, 69, 70), una unidad corregida (58) y una aproximación angular (62). Los casos 69 y 70 también separan el modelo notable del valor literal.

Se recuperaron datos esenciales de los dibujos y se comprobaron tangencias, pies de perpendicular, áreas y volúmenes. El área curva del caso 53 se contrastó mediante integral convergente y malla independiente. Las treinta comprobaciones pasaron; los treinta gráficos fueron inspeccionados visualmente y el lector se comprobó en móvil. El respaldo de 187 fichas y 732 archivos fue restaurado y los treinta controles se ejecutaron sin PDF ni OCR originales. Hay 121 páginas con algún cotejo, 109 parciales; la cola conserva 13 722 páginas. Siguiente: propuesto 74, página PDF 93. Ningún libro completo certificado.


### Propuestos de geometría 74–100: cierre de la sección

La sección termina en el propuesto 100: se incorporaron los 27 restantes, con soluciones propias por pasos, gráficos SVG ampliables y recortes de evidencia. Trece fichas quedan sin discrepancias; catorce conservan observaciones: ocho condiciones pendientes (79, 80, 81, 82, 90, 94, 96, 99), cuatro claves corregidas (74, 76, 84, 87) y dos aproximaciones (77, 78). El 74 también distingue el modelo angular notable y el 76 requiere unificar unidades.

Las 27 comprobaciones matemáticas pasaron, incluidos controles por coordenadas, áreas, volúmenes, integración y contraejemplos. Se inspeccionaron los 27 dibujos y el lector móvil. El respaldo de 214 fichas y 827 archivos fue restaurado; los 27 controles se ejecutaron desde esa copia sin PDF ni OCR originales. El OCR original permanece intacto.

Este cuaderno tiene ahora fichas para sus 100 resueltos y 100 propuestos, manteniendo ambos tipos separados. Esto acredita cobertura de ejercicios, no corrección incondicional de todos ellos ni revisión integral de teoría y páginas. Hay 125 páginas con algún cotejo, 113 parciales; la cola conserva 13 722 páginas. Antes de certificar el cuaderno deben resolverse las observaciones y revisarse el contenido restante.


### Cierre de contenido: Prisma y cilindro

`cierre-prisma-cilindro.json` registra el cierre de la revisión de contenido matemático. Se cotejaron las 16 páginas de teoría (PDF 8–23) y el índice (PDF 7); una guía propia reúne 14 unidades, ocho gráficos y doce correcciones o precisiones. Entre ellas están el área lateral de prismas oblicuos, un factor omitido en volumen triangular, el dominio de la fórmula de tres áreas de un tetraedro, el perímetro elíptico y la forma curva de los desarrollos de cortes cilíndricos.

Las 67 observaciones históricas tienen dictamen individual, conservando sus claves y estados originales: cinco enunciados rechazados por incompatibilidad; catorce con valores exactos y aproximados separados; diecinueve correcciones documentadas; veintiséis con condiciones explícitas; una unidad reparada en una variante; una interpretación aclarada por la teoría y una corrección con unificación de unidades. Los cinco rechazos son resueltos 2 y 71, y propuestos 12, 25 y 26. Cerrar su revisión no significa fabricar una solución para datos imposibles.

La cobertura del cuaderno es de 100 resueltos y 100 propuestos. Se ejecutaron los 16 comprobadores de sus grupos y 15 controles nuevos de teoría, también desde el respaldo restaurado. El archivo acumulado conserva 214 fichas y 873 archivos. La herramienta de respaldo incluye ahora guías con inventario explícito sin contarlas como ejercicios; ocho pruebas comprueban inclusión, faltantes y límites de rutas.

La guía local está en `fuentes/ocr-local/cuzcano/cierre-prisma-cilindro/index.html`, enlazada desde el archivo y los lectores anteriores. El OCR original permanece intacto. El cierre es de contenido matemático con erratas y variantes documentadas: no es una transcripción literal certificada de todas las páginas ni habilita los originales automáticamente para producto. Hay 142 páginas con algún cotejo, 130 parciales, y la cola general conserva 13 722 páginas.


### Pirámide y cono: primer bloque

Se eligió este cuaderno como continuación de Prisma y cilindro. `piramide-cono-primer-tercio.json` delimita el bloque inicial: teoría PDF 8–23 y resueltos 1–20 hasta la página PDF 35. Es aproximadamente un tercio por páginas, no por cantidad de ejercicios: se revisaron 20 de los 200 ejercicios del cuaderno. Las páginas preliminares no se contabilizan como contenido matemático revisado.

El lector local `fuentes/ocr-local/cuzcano/piloto-piramide-cono-1-20/index.html` reúne 20 soluciones propias por pasos, 20 SVG y fichas JSON con evidencias. Catorce ejercicios quedan sin observaciones; los casos 5 y 18 explicitan condiciones del dibujo, 13 y 17 separan ángulos literales del modelo notable, 14 corrige una fórmula intermedia y 16 corrige una alternativa. La guía enlazada reúne 15 unidades, 8 esquemas y 9 correcciones o precisiones de teoría.

Pasaron 20 controles de ejercicios y 15 de teoría; se inspeccionaron los 28 gráficos y dos lectores móviles. El archivo acumulado contiene 234 fichas, dos guías y 970 archivos controlados. Se restauró el ZIP y se repitieron los controles nuevos sin PDF ni OCR originales. El OCR de origen está intacto. Hay 170 páginas con algún cotejo, 158 parciales; la cola general conserva 13 722 páginas. Siguiente: resuelto 21, que empieza en PDF 35.


### Pirámide y cono: resueltos 21–30

Diez fichas nuevas con gráficos redibujados y soluciones por pasos, cotejadas en PDF 35–41. Se corrigen la perpendicularidad falsa del 22, la altura del tronco del 23 y el factor V omitido en el 24; el 29 explicita que se pide el diedro menor. Los otros seis no presentan discrepancias. Diez controles geométricos aprobados, diez gráficos inspeccionados y lector móvil comprobado.

El proyecto está físicamente en D:\ChatGPT\Fanservice Historica Económica; el acceso anterior de C es un enlace. El archivo acumula 244 fichas y 1010 archivos controlados. El ZIP se restauró y los controles nuevos pasaron sin PDF ni OCR originales; la extracción temporal se retiró después de comprobarla. Hay 176 páginas con algún cotejo (164 parciales); la cola mantiene 13 722. Siguiente: resuelto 31, PDF 41.


### Pirámide y cono: resueltos 31–60

Treinta fichas nuevas, treinta SVG y soluciones por pasos, cotejadas en PDF 41–58. Veintiuna verificadas; nueve conservan observaciones: condiciones en 33,38,39,55; corrección de unidad en 40 y de región en 42; valores angulares literales separados en 50,54,58. El 38 también documenta un factor π omitido. Treinta controles matemáticos aprobados, treinta gráficos inspeccionados y lector móvil comprobado.

El archivo acumula 274 fichas y 1101 archivos controlados. El ZIP se restauró y los treinta controles pasaron sin PDF ni OCR originales; después se retiró la extracción temporal. Hay 193 páginas con algún cotejo (181 parciales); la cola conserva 13 722. Siguiente: resuelto 61, PDF 58.


### Física: tanda adicional de 300 ejercicios

Se conservaron seis bloques nuevos: PREUNI 501–527 (27), Análisis dimensional propuestos 1–50 (50), Cinemática I propuestos 1–60 (60), Dinámica propuestos 1–60 (60), Cinemática II propuestos 1–60 (60) y Análisis vectorial propuestos 1–43 (43). Se completa exactamente la tanda de 300 sin repetir ejercicios. PREUNI termina sus enunciados en el 527; las páginas siguientes de soluciones no se cuentan como ejercicios nuevos. Dinámica 45 identifica el segundo rótulo 44 del original, con ambos datos conservados en su ficha.

El lector conjunto está en `fuentes/ocr-local/cuzcano/coleccion-fisica-tanda-300-extra/index.html`, con búsqueda por libro y número, soluciones propias por pasos, redibujos SVG editables, JSON y evidencias locales. Los ejercicios conceptuales o sin dibujo usan tarjetas de relaciones. Las 65 fichas condicionadas están reunidas en `condiciones.json`: cinco PREUNI, seis dimensionales, diecisiete de Cinemática I, dieciséis de Dinámica, quince de Cinemática II y seis vectoriales. Conservan datos ausentes, ambigüedades, aproximaciones o discrepancias con claves; no se presentan como contenido listo para la app.

Pasaron los 300 controles nuevos y la revisión manual de todas las figuras y tarjetas; los seis lectores y la consulta conjunta se comprobaron en móvil. El respaldo acumulado conserva 1074 fichas, 3063 archivos controlados y cinco guías, con 800 fichas de Física. Se restauró el ZIP de 474210568 bytes y desde esa copia pasaron los 800 controles de Física en 23 bloques, sin PDF ni OCR originales. La extracción temporal se retiró. También pasaron las ocho pruebas del indexador; éste ahora reutiliza la lectura de registros por libro para evitar releerlos por cada ficha.

La prueba y el hash del ZIP están en `fuentes/ocr-local/cuzcano/archivo-ejercicios/prueba-restauracion-extra-300.json`. Los originales se mantienen intactos y no se repitió OCR. Hay 356 páginas con algún cotejo: 344 parciales, seis completas y seis sin texto principal; la cola conserva 13722 páginas. No se certifican libros completos.

Siguiente: Análisis vectorial, propuesto 44, página PDF 126. Se debe continuar desde esa posición y consultar los índices para no repetir lo guardado. La documentación y los materiales permanecen en D; GitHub recibe dos resúmenes de avance y restauración en esta tanda.


### Física: tanda de1000 completada (10 de noviembre de2026)

Se añadieron1000 fichas originales identificadas por libro,tipo y número,distribuidas en40 bloques de15 cuadernos. El archivo acumulado contiene2074 fichas,de las cuales1800 son de Física. La tanda incluye mecánica,gravitación,calor,ondas,termodinámica,fluidos,electrostática y electrodinámica. En electrostática se cubrieron los88 propuestos y los resueltos1–2; en electrodinámica los107 propuestos y los resueltos1–3. Los últimos resueltos conservan su tipo para no confundirse con la numeración repetida de propuestos.

El lector conjunto está en `fuentes/ocr-local/cuzcano/coleccion-fisica-1000/index.html`. Cada ficha tiene solución propia por pasos,JSON,SVG editable o tarjeta de relaciones y evidencia de origen. Las206 fichas con condiciones o ambigüedades se filtran en el lector y se reúnen en `condiciones.json`; las794 restantes no tienen condiciones pendientes registradas,pero no se declaran automáticamente listas para producto. Se corrigieron claves,signos,unidades,modelos físicos y conexiones; también se conservaron datos incompatibles como observaciones en vez de forzar respuestas.

Pasaron los1000 controles nuevos,la inspección de sus1000 gráficos o tarjetas y la comprobación móvil de los40 lectores. El lector conjunto verificó1000 enlaces,el filtro de206 observaciones y la búsqueda de110 fichas de electrodinámica. Se cotejaron fragmentos en215 páginas de origen de esta tanda; eso no certifica páginas ni libros completos. No se repitió OCR. Ocho incidencias de enunciados incompletos o ausentes de trabajo y energía se documentan y no se cuentan entre los1000.

El ZIP acumulado tiene1159913045 bytes y SHA256 `4e9620ec17724edab1683f488d51df6c0ff3eadbd1504615d893e72022d71c1d`. Se restauraron y verificaron5580 archivos; desde la copia pasaron1800 controles de Física en63 bloques,sin PDF ni OCR originales. La extracción temporal fue retirada. Prueba: `fuentes/ocr-local/cuzcano/archivo-ejercicios/prueba-restauracion-fisica-1000.json`; resumen público: `fuentes/cuzcano/respaldo-fisica-1000.json`. Materiales y respaldo permanecen físicamente en D.

Siguiente sugerido: Electromagnetismo,propuesto1,PDF240. Su enunciado fue visto para inventario,pero aún no se convirtió en ficha. Consultar el índice de identidades antes de continuar; aún no hay un conteo validado de ejercicios de toda la colección.


### Álgebra: primer punto de control de la tanda de 1000 (10 de noviembre de 2026)

Se añadieron 100 fichas nuevas de los propuestos 207–306 de Álgebra PREUNI, cotejando fragmentos en las páginas PDF 269–290. Son 100 de los 1000 nuevos solicitados: quedan 900 y el estado continúa `en_curso`. No se presenta la tanda como completada. El acumulado de Álgebra pasa de 5 a 105 fichas; el archivo general tiene 2174.

Las fichas conservan soluciones propias por pasos, JSON, evidencias y controles simbólicos locales. Se inspeccionaron 4 gráficas, 3 tablas y 93 tarjetas de relaciones; los dos gráficos originales de funciones se reconstruyeron. La curva del propuesto 304 declara su transformación vertical para conservar ceros y signos. Hay 84 fichas sin condiciones señaladas y 16 con observaciones para producto. Se documentan parámetros no restringidos, dominios, dos términos centrales, datos incompatibles en R y etiquetas MCD/MCM intercambiadas; no se fuerzan respuestas sin aclararlas.

Lector: `fuentes/ocr-local/cuzcano/coleccion-algebra-1000/index.html`. El objetivo y los pendientes están en `qa-algebra-1000/avance-1000.json`; el plan de volumen por curso está en `fuentes/cuzcano/plan-cobertura-cursos.json`. El conteo por curso sigue la clasificación del catálogo: Física incluye una ficha piloto adicional a los 1800 controles de los lotes de Física. Mil fichas por curso es una meta de volumen y no una certificación de cobertura temática ni de funcionamiento de la app.

Pasaron los 100 controles nuevos y la consulta móvil de los cinco bloques y el lector conjunto. Se restauraron y verificaron 5850 archivos; aprobaron 1800 controles previos de Física y 100 nuevos de Álgebra en 68 bloques, sin PDF ni OCR originales. Las dependencias simbólicas y sus licencias viajan en el respaldo. Se retiró la extracción temporal. No se repitió OCR ni se alteraron las 2074 fichas anteriores.

El ZIP tiene 1171902727 bytes y SHA256 `20770fa5b8d4f14e8aeb8e82369f3e2ac2d61f67f92c5929f078ca59e70cd17c`. Prueba: `fuentes/ocr-local/cuzcano/archivo-ejercicios/prueba-restauracion-algebra-1000.json`; resumen público: `fuentes/cuzcano/respaldo-algebra-1000.json`. Materiales en D; GitHub recibe metadatos de avance, cobertura y restauración.

Siguiente fuente en orden: propuesto 307, PDF 290–291. No está contabilizado. Para ampliar la cobertura posterior se inventariaron los 18 documentos de Álgebra disponibles, con 1554 páginas reales; ese inventario no cuenta ejercicios ni valida los libros.


### Criterio vigente: al menos 100 por tema (10 de noviembre de 2026)

Se sustituyó la prioridad de volumen por curso por un mínimo de 100 ejercicios revisados por tema. El mapa inicial inventaría 123 temas y asigna 1742 de las 2274 fichas a un único tema principal; 532 fichas de cuadernos mixtos siguen pendientes de clasificación individual. El mapa aún necesita desglosar los volúmenes generales, por lo que no se publica un porcentaje global de toda la colección. Cinco temas alcanzan el mínimo de revisión: Logaritmos (100), Calor (139), Electrodinámica (110), Hidrostática (100) y Prisma y cilindro (200). La clasificación de fichas anteriores reutiliza su revisión existente; no declara un nuevo cotejo visual de todo el archivo.

Se añadieron 100 fichas de Logaritmos: 75 problemas de la sección de resueltos y 25 ejemplos trabajados, con numeración independiente. La selección combina propiedades, ecuaciones, sistemas, dominio, inecuaciones y logaritmos decimales. Se cotejaron fragmentos en 33 páginas PDF; no se declara cerrado el cuaderno. No se inventó el ejemplo 33, ausente en la numeración impresa, y los siete resueltos omitidos en la selección siguen pendientes.

Cada ficha conserva solución propia por pasos, dominio real, JSON, evidencia y un SVG editable. Se inspeccionaron 80 tarjetas de relaciones, 12 rectas de intervalos y 8 gráficas o tablas. Hay 89 fichas sin observaciones registradas y 11 con aclaraciones para producto: raíces omitidas, parámetros, agrupaciones distintas y una premisa incompatible. El ejemplo 45 corrige el extremo editorial 2/5 por 5/2. Los controles y lectores móviles pasaron; los casos observados no se presentan como aprobados para la app.

Lector nuevo: `fuentes/ocr-local/cuzcano/cobertura-temas/logaritmos.html`. Mapa: `fuentes/ocr-local/cuzcano/cobertura-temas/index.html`. Las 105 fichas anteriores de Álgebra se distribuyeron entre temas, sin contarlas cien veces en cada uno ni alterar sus archivos. Álgebra acumula 205 fichas.

El respaldo acumula 2274 fichas y 6123 archivos controlados. La restauración ejecutó 2000 controles en 72 bloques, sin los PDF ni el OCR originales, y comprobó que las 2174 fichas previas conservaran sus hashes. La extracción temporal se retiró. El ZIP tiene 1284944950 bytes y SHA256 `fd7c0fdf34b9d95f3096e0494f569cd5d8c75238fda54928c4e53435c6afe18a`. Prueba: `fuentes/ocr-local/cuzcano/archivo-ejercicios/prueba-restauracion-100-por-tema.json`. El nombre anterior de la prueba y el lector de Álgebra se conservan por compatibilidad.

No se repitió OCR ni se usaron servicios externos de cálculo. GitHub recibe resúmenes de avance, cobertura y respaldo; libros, enunciados, imágenes, soluciones y ZIP permanecen en D. Siguiente prioridad: completar los diez que faltan para el mínimo de Electrostática; después, los quince de Termodinámica, consultando primero las identidades existentes.


### Electrostática y Termodinámica: mínimo de 100 por tema (10 de noviembre de 2026)

Se añadieron exactamente 25 fichas nuevas sin repetir identidades: los resueltos 3–12 de Electrostática (10, PDF 124–131) y 1–15 de Termodinámica (15, PDF 15–23). Con las 90 y 85 anteriores, ambos temas alcanzan 100 ejercicios revisados. Se conservan 25 gráficos o esquemas SVG redibujados, soluciones propias de tres pasos, JSON, modelos físicos cuando corresponde, evidencias y controles locales. El cotejo abarca fragmentos en 17 páginas, sin certificar páginas ni cuadernos completos.

Veinte nuevos no tienen observaciones registradas y cinco conservan aclaraciones para producto. Electrostática 10 requiere declarar la neutralidad inicial de la pelotita; Termodinámica 1 tiene opciones duplicadas, 2 produce un exponente adiabático formal superior a 5/3, 7 explicita la aproximación editorial de atmósfera y 15 conserva la aproximación de R implícita en su solución. También se documentan el orden de desconexión a tierra del resuelto 9, el signo del flujo de electrones, las cargas interior y exterior del conductor hueco y la diferencia entre la carga positiva total del agua y su carga neta. No se fuerzan respuestas fuera de las condiciones del modelo.

El lector conjunto está en `fuentes/ocr-local/cuzcano/cierre-fisica-temas-100/index.html`. Los lectores `electrostatica.html` y `termodinamica.html` reúnen cien fichas cada uno y permiten filtrar las nuevas y las observaciones. En el acumulado del tema hay ocho fichas de Electrostática y 28 de Termodinámica con observaciones registradas; se incluyen las heredadas. Las 2274 fichas anteriores mantienen sus archivos. El mapa inicial conserva 123 temas, de los que siete alcanzan el mínimo; 1767 fichas tienen asignación principal y 532 de cuadernos mixtos siguen pendientes de clasificación individual.

El archivo general contiene 2299 fichas, con 1826 de Física (1825 controles de los lotes y una ficha piloto independiente), 205 de Álgebra y diez guías o paquetes auxiliares. Pasaron los 25 controles nuevos, la inspección de los 25 dibujos, los dos lectores de bloques y las consultas conjuntas en móvil. También pasaron los filtros, los enlaces y las ocho pruebas del indexador. Desde una copia restaurada se verificaron 6214 archivos y 2025 controles en 74 bloques sin PDF ni OCR originales, y se comprobó que las 2274 fichas anteriores conservaran sus hashes. La extracción temporal se retiró.

El ZIP tiene 1329127436 bytes y SHA256 `b05c1958866aa6e0a7e0a21a259bd1c930dc1c0dd3c89eaf7614c6bcfaf22f4b`. Prueba: `fuentes/ocr-local/cuzcano/archivo-ejercicios/prueba-restauracion-100-por-tema.json`. No se repitió OCR ni se usaron servicios externos de cálculo. Los materiales completos permanecen en D y GitHub recibe los resúmenes.

Siguiente prioridad temática: Cantidad de movimiento, impulso y choques, con 66 fichas asignadas y 34 pendientes para el mínimo. Para continuar estos cuadernos completos, las posiciones siguientes son Electrostática resuelto 13, PDF 131, y Termodinámica resuelto 16, PDF 23. Esas posiciones aún no se cuentan como fichas nuevas.


### Nueva tanda de100 de Física y tabla acumulada (10 de noviembre de2026)

Se guardaron34 aplicaciones de cantidad de movimiento e impulso (1–6 y9–36),40 de Cinemática I (1–40) y26 de Cinemática II (1–26). Los ejercicios7 y8 de impulso permanecen pendientes: el escaneo compuesto cubre sus enunciados. Los dos primeros temas alcanzan100 revisados; Cinemática II queda en86. Hay84 nuevos sin condiciones registradas y16 con aclaraciones para producto. Se corrigieron unidades, ángulos, rapidez frente a velocidad y resultados editoriales incompatibles con los datos, incluida una posición final energéticamente inaccesible.

Lector y tabla por curso: `fuentes/ocr-local/cuzcano/cierre-fisica-bulk-100/index.html`. El mapa de123 temas está en `fuentes/ocr-local/cuzcano/cobertura-temas/index.html`. Acumulado:2399 fichas (Física1926, Álgebra205, Geometría261, Química5 y RM2); Aritmética y Trigonometría aún no tienen fichas revisadas.1867 están asignadas a tema principal y532 fichas mixtas esperan clasificación. Nueve temas alcanzan el mínimo; no se certifican cuadernos completos ni la app.

La copia restaurada verificó6512 archivos y2125 controles en77 bloques sin PDF ni OCR originales. Las2299 fichas anteriores conservaron sus hashes; se retiró la extracción temporal. El ZIP tiene1496803425 bytes y SHA256 `a1a9f555971aca2580b71e62fc305ba1519812e6dca5a0de62fd40250b252fe9`. Prueba: `fuentes/ocr-local/cuzcano/archivo-ejercicios/prueba-restauracion-100-por-tema.json`. No se repitió OCR. Material completo en D; los resúmenes se publican en GitHub.

Siguiente prioridad:14 aplicaciones de Cinemática II desde la27, PDF30. No están contabilizadas aún.


### Tanda multicurso: 814 nuevos y 3213 acumulados (10 de noviembre de 2026)

Se completó la tanda de 814 ejercicios nuevos: 14 aplicaciones de Cinemática II (27–40) y 100 en cada uno de los dos primeros temas monográficos de Aritmética, Química, Razonamiento matemático y Trigonometría. Los temas son conjuntos, numeración, unidades químicas de masa, gases, razonamiento lógico, inductivo y deductivo, medición angular y arcos, y razones trigonométricas agudas. Cada uno reúne 100 revisados; Cinemática II pasó de 86 a 100.

El archivo local acumula 3213 fichas: Física 1940, Álgebra 205, Geometría 261, Aritmética 200, Química 205, RM 202 y Trigonometría 200. Hay 18 temas con mínimo de revisión en un mapa inicial de 123; 532 fichas de cuadernos mixtos siguen pendientes de clasificación temática individual. Las 2399 fichas anteriores conservaron sus archivos.

Las 814 nuevas incluyen soluciones propias por pasos, controles locales, redibujos SVG y referencias a las páginas originales. 679 no tienen condiciones registradas; 135 conservan condiciones, aproximaciones o datos incompatibles. Se distinguen aproximaciones escolares de identidades exactas y se documentan errores de claves y soluciones editoriales. El mínimo de revisión no certifica cuadernos completos ni la app. No se repitió OCR ni se usó un servicio externo para el cálculo.

Lector privado: `fuentes/ocr-local/cuzcano/cierre-multicurso-814/index.html`; contiene tabla por curso, nueve consultas por tema, búsqueda, filtros y JSON de las 814. Formatos: JSON, HTML y SVG editable. El material completo sigue en D. Los metadatos vigentes están en [avance-multicurso-814.json](avance-multicurso-814.json), [cobertura-100-por-tema.json](cobertura-100-por-tema.json), [plan-cobertura-cursos.json](plan-cobertura-cursos.json) y [respaldo-100-por-tema.json](respaldo-100-por-tema.json). Las secciones anteriores de este documento son hitos históricos.

GitHub recibe herramientas generales y estos resúmenes. El índice público detallado `archivo-ejercicios.json` corresponde a una publicación anterior; el índice completo actualizado de 3213 fichas está en el respaldo local.

Restauración de la tanda multicurso: 8455 archivos íntegros y 2939 controles en 92 bloques, ejecutados desde la copia extraída sin PDF ni OCR originales. Las 2399 fichas anteriores conservaron sus hashes. La extracción temporal se retiró. ZIP: 2150318114 bytes; SHA256 `9e28c96184870f68c4b6817d77a93df2c52eebd998a90431687707ceada5e022`. Las ocho pruebas del indexador y los lectores móviles pasaron. Prueba local: `fuentes/ocr-local/cuzcano/archivo-ejercicios/prueba-restauracion-multicurso-814.json`.
