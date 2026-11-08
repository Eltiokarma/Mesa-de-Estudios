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
- Cero libros con fallo de procesamiento. La auditoría de integridad pasó y las seis pruebas de herramientas están aprobadas.
- 12 páginas con algún cotejo visual, sin certificar libros completos; siete correcciones puntuales aplicadas en la muestra de química.
- 13 732 páginas siguen en la cola de baja confianza, después de apartar dos páginas identificadas visualmente sin texto principal.

`auditoria.json` conserva las comprobaciones y recuentos; `entorno-ocr.json`, las versiones de Python, bibliotecas y motor, y el hash del modelo de español. La integridad del lote no equivale a exactitud del OCR: la revisión visual del resto está pendiente.

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

Las páginas clasificadas visualmente como `sin_texto_principal` salen de esa cola. En páginas dobles se registra la menor confianza de las dos mitades; una mitad en blanco puede producir cero aunque la otra tenga texto legible.

Conservar el OCR crudo. Guardar correcciones en un archivo local separado, con identificador de libro, página PDF, fragmento original, corrección y motivo. No completar texto ilegible por conjetura. Registrar explícitamente si una revisión fue parcial; no contarla como revisión integral.

`python herramientas/aplicar_correcciones_ocr.py <registro-local.json>` aplica correcciones con campos `original` y `correccion` únicamente si cada fragmento aparece una sola vez. Produce un archivo `.corregido.json` separado, ligado al SHA-256 del OCR original. Si se vuelve a reconocer la página, verificar ese SHA y volver a cotejar las correcciones; no reutilizarlas ciegamente.

Cuando el cotejo confirme columnas de igual anchura, `python herramientas/reordenar_columnas_ocr.py <pagina.json> --columnas 2` genera una lectura alternativa sin repetir el OCR. El número indicado corresponde a cada región reconocida: dos columnas por cada mitad de una doble página producen cuatro columnas. Conserva palabras y coordenadas; no corrige fórmulas ni garantiza el orden de títulos que ocupan varias columnas.

La prueba inicial con el Solucionario 1 de Química CEPREUNI 2015-2 mostró mezcla de columnas y confusiones en letras de alternativas y fórmulas. Motivó la lectura separada de páginas enfrentadas. Una segunda muestra (Ondas electromagnéticas, página PDF 10) omitió un recuadro sombreado y rótulos de una figura aunque tenía confianza 95. La colección no debe considerarse un corpus validado mientras quede revisión pendiente.
