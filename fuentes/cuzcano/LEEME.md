# Cuzcano: fuentes de consulta

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

## Resultado de la ejecución del 8 de noviembre de 2026

- 198 entradas descargadas y procesadas; 197 contenidos PDF distintos.
- 21 522 páginas: 21 462 con OCR nuevo en español y 60 con capa textual previa aprovechable.
- Cero libros con fallo de procesamiento. La auditoría de integridad pasó y las trece pruebas de herramientas están aprobadas.
- 64 páginas con algún cotejo visual: seis con texto completo cotejado, seis sin texto principal y 52 parcialmente revisadas. Ningún libro completo certificado.
- 19 copias corregidas locales: 17 reconstrucciones visuales y dos páginas con nueve reemplazos puntuales en total.
- 13 722 páginas siguen en la cola de baja confianza. El nuevo lote examinó 24 páginas de confianza cero y resolvió diez entradas de la cola: seis transcripciones completas y cuatro páginas sin texto principal.

`auditoria.json` conserva las comprobaciones y recuentos de su ejecución histórica; no se ha repetido para los pilotos puntuales posteriores. `revision-muestras.json` contiene los recuentos actuales de revisión. `entorno-ocr.json` registra las versiones de Python, bibliotecas y motor, y el hash del modelo de español. La integridad del lote no equivale a exactitud del OCR: la revisión visual del resto está pendiente.

### Piloto de ejercicios con figuras

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

`archivo-ejercicios.json` registra treinta y cinco fichas localizables por libro, tipo y número. El índice local está en `fuentes/ocr-local/cuzcano/archivo-ejercicios/index.html`. Sus ciento cuarenta y un archivos de consulta tienen un manifiesto de integridad. El ZIP conjunto conserva lectores, fichas, recortes, dibujos y comprobadores; se probó su extracción sin los PDF ni el OCR originales. Es un respaldo local, no una copia remota en GitHub.

Antes de seleccionar un ejercicio, buscar su libro, tipo y número en el índice: reutilizar la ficha si ya existe; volver a la fuente sólo para resolver una duda o corregirla. Para comprobar lo guardado sin modificar el registro: `python herramientas/indexar_ejercicios_locales.py`. Después de incorporar o corregir fichas deliberadamente: `python herramientas/indexar_ejercicios_locales.py --actualizar --zip`. La actualización informa archivos nuevos, modificados y retirados. El ZIP contiene `archivo-ejercicios/comprobar_archivo.py` para comprobar una restauración. Los hashes detectan cambios, no certifican las matemáticas.

`polinomios-lote-4.json` describe cuatro ejercicios nuevos de homogeneidad, grados relativos, completitud y grado mínimo. Se cotejaron dos páginas parcialmente; una ya tenía revisión. Las fichas incluyen datos estructurados y soluciones propias, diferenciadas de una solución editorial no cotejada. El lector está en `fuentes/ocr-local/cuzcano/polinomios-lote-4/index.html`. Los cálculos exactos se repitieron desde el respaldo aislado. Cinco pruebas del indexador pasan; no se vuelve a procesar la colección ni se retiran páginas de la cola.


### Geometría: continuación consecutiva

Se cotejaron los problemas 8–17 de Prisma y cilindro, PDF 28–33. Las diez fichas locales conservan enunciado normalizado, recortes originales con letras, relaciones geométricas y resolución explicada. Todos los resultados coinciden con la edición; el problema 17 incorpora además el dominio no degenerado, comprobado con doce configuraciones tridimensionales. Python comprueba el lote y el lector funciona sin conexión. Son seis páginas parcialmente cotejadas; ninguna se retira de la cola. El siguiente ejercicio es el 18. El respaldo conjunto contiene 25 fichas y 100 archivos verificados, y fue restaurado sin PDF ni OCR.

Los diez ejercicios de este lote tienen ahora dibujos SVG reconstruidos, con letras y cotas, visibles directamente en el lector. Las secciones auxiliares aclaran la geometría usada en la resolución. Los originales quedan disponibles para contraste. Los redibujos permanecen en el archivo local y su respaldo.


### Geometría: problemas 18–27

Diez ejercicios adicionales cotejados en las páginas PDF 33–39, con diez SVG reconstruidos y soluciones por pasos. Ocho resultados coinciden exactamente bajo los supuestos de las figuras; en los problemas 21 y 26 se conserva la aproximación editorial de 37 grados y también el resultado literal. Las comprobaciones independientes usan coordenadas, productos escalares, determinantes y tetraedros. El archivo acumulado contiene 35 fichas y 141 archivos; se restauró y comprobó sin PDF ni OCR. El lector pasó las comprobaciones de imágenes y ancho móvil. Siguiente problema: 28. No se certificaron páginas completas ni se repitió OCR.
