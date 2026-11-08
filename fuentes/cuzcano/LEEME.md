# Cuzcano: fuentes de consulta

Inventario de los 198 documentos publicados en [UNIverse to Study](https://universetostudy.com/biblioteca/cuzcano/), consultado el 8 de noviembre de 2026. Alcance solicitado: toda la colección.

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
```

Ejecutar OCR después de terminar la descarga: el procesador toma la lista de PDF disponible al arrancar. Si empezó antes, repetir el comando cuando acaben las descargas. Los resultados completos por página se reutilizan.

Para actualizar el inventario, descargar `https://universetostudy.com/universe-ui/data/platform.json` y ejecutar `python herramientas/cuzcano.py --inventariar platform.json`. Revisar el cambio de inventario antes de volver a descargar.

## Qué produce

- `inventario.json`: título, colección, sección, autor y enlace original; la clave es el identificador completo de Drive.
- `descargas.json`: resultado por archivo, tamaño y SHA-256. Descargas incompletas terminan en `.part`; no se consideran PDF terminados.
- `fuentes/libros/cuzcano/<id>.pdf`: originales locales.
- `fuentes/ocr-local/cuzcano/<id>/p-NNNN.json`: texto por página de PDF, método, confianza cuando existe y coordenadas de reconocimiento. Es material local, no versionado.
- `procesamiento.json`: resumen de libros procesados hasta el final. Se reconstruye cuando termina cada ejecución del lote.
- `estado.json`: avance que se puede regenerar mientras corre el OCR; diferencia páginas procesadas y revisión visual.

El OCR usa Tesseract 5 en español y renderiza a 200 dpi. Una capa textual previa se reutiliza si supera comprobaciones básicas de longitud, caracteres legibles y caracteres de reemplazo; esas comprobaciones **no certifican su exactitud**. `--forzar-ocr` permite reconocer un archivo íntegramente, pero requiere una salida sin resultados de otra configuración.

En escaneados apaisados con relación de aspecto mayor que 1,2, se reconocen las mitades izquierda y derecha en ese orden. Es una heurística: revisar las páginas apaisadas que no sean dobles. Se conservan las regiones y sus coordenadas para cotejarlas con el original. El texto no representa fielmente figuras, fracciones, matrices ni otras expresiones bidimensionales.

## Revisión visual

Todas las páginas parten de `revision_visual: pendiente`. La confianza de Tesseract no mide corrección matemática ni garantiza el orden de columnas. Las páginas cortas o con confianza menor de 80 reciben prioridad alta; también hay que cotejar fórmulas, figuras, alternativas e índices de las demás páginas.

Conservar el OCR crudo. Guardar correcciones en un archivo local separado, con identificador de libro, página PDF, fragmento original, corrección y motivo. No completar texto ilegible por conjetura. Registrar explícitamente si una revisión fue parcial; no contarla como revisión integral.

La prueba inicial con el Solucionario 1 de Química CEPREUNI 2015-2 mostró mezcla de columnas y confusiones en letras de alternativas y fórmulas. Motivó la lectura separada de páginas enfrentadas. La colección no debe considerarse un corpus validado mientras quede revisión pendiente.
