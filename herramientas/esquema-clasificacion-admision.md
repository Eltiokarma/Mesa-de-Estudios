# Esquema de clasificación: exámenes de admisión (los ocho cursos)

Es el brief que recibieron los subagentes que clasificaron los exámenes de admisión de San Marcos 2019-I a 2027-I (`docs/clasificacion-unmsm-admision.md`). `<trabajo>` es una carpeta temporal fuera del repo: ahí van el texto por página (`pdftotext -f N -l N`), el OCR (`herramientas/ocr_pdf.sh`), los rangos de páginas por curso, un resumen del catálogo (`modulos.md`, sacado de `app/datos/catalogo.json`) y la salida JSONL. Después se junta con `python3 -I herramientas/agregar_admision.py <trabajo>/clasif docs/datos/<salida>.csv docs/datos/<salida>-tablas.md`.

Para los simulacros se usó otro esquema, solo de física y química: `herramientas/esquema-clasificacion.md`.

Contexto: Mesa de Estudios es una app de simuladores visuales para postulantes. Queremos medir qué pregunta de verdad el examen de admisión de San Marcos y cuánto de eso cubre hoy la app. Tú clasificas UNO o DOS cursos, pregunta por pregunta.

## Material (solo lectura)
- Texto por página de los solucionarios de Saco Oliveros (traen el examen completo + resolución + un titular del tema en mayúsculas sobre cada resolución): `<trabajo>/txt/<periodo>/<archivo>/p-NN.txt`. El texto sale de pdftotext y viene en dos columnas mezcladas; reordénalo mentalmente.
- Los PDF originales: `/home/user/Mesa-de-Estudios/fuentes/examenes/unmsm-admision/<periodo>/<archivo>.pdf`. Míralos como imagen con la herramienta Read (parámetro pages, p. ej. "37-38") SOLO cuando el texto no alcance (figuras, fórmulas rotas). No abras más de lo necesario.
- 2021 tiene además 3 exámenes escaneados SIN solucionario, con OCR de tesseract: `<trabajo>/ocr/2021/unmsm-2021-examen-2021-09-0{4,5}-escaneado/p-NN.txt` y `.../unmsm-2021-examen-2021-09-11-escaneado/`. Ahí no hay clave ni titular: clasifica igual, `clave: ""`.
- Rango aproximado de páginas y números de pregunta de cada curso por archivo: `<trabajo>/rangos-<curso>.txt` (calculado con los titulares; puede correrse ±1 página o ±2 preguntas: verifica con el texto). Algunos solucionarios traen al final unas páginas extra con preguntas de otra área del mismo día: inclúyelas.
- 2019-I a 2020-I tienen exámenes de 125 preguntas (formato antiguo). En 2019-II/03-09 puede faltar el bloque de razonamiento matemático en el índice: búscalo.
- Catálogo de la app (unidades por curso y módulos existentes, con su formato: escena o predicciones): `<trabajo>/modulos.md`. Si dudas de qué cubre un módulo, mira `/home/user/Mesa-de-Estudios/plantillas/<id>/plantilla.json` o su index.html por encima.

## REGLA QUE NO SE ROMPE (regla 5 del proyecto)
Los PDF son solo un mapa. NO copies enunciados, números, figuras ni soluciones a la salida, salvo el campo `inicio` (que se usa solo para detectar repetidas y NUNCA se publica). `resumen` y `trampa` van en palabras tuyas, abstractas, sin los datos del problema.

## Salida
Agrega (append) UNA línea JSON por pregunta a `<trabajo>/clasif/<tu-archivo>.jsonl` (te lo indican), y escribe al terminar CADA archivo PDF, para no perder avance si tu contexto se compacta. Antes de empezar, si el archivo ya existe, léelo y continúa donde quedó.

Campos:
| campo | valor |
|---|---|
| periodo | "2019-I" ... "2027-I", "2021", "2022" (la carpeta) |
| archivo | nombre de la carpeta de texto (sin .pdf) |
| numero | número de la pregunta en ese examen (entero) |
| pagina | página del PDF |
| curso | fisica, quimica, aritmetica, algebra, geometria, trigonometria, razonamiento-matematico, razonamiento-verbal |
| unidad | id de unidad del catálogo (`modulos.md`), p. ej. "fisica.fluidos"; si no hay ninguna que calce, "fuera-del-catalogo:<nombre corto>" |
| tema | etiqueta corta y ESTABLE (reusa la misma cadena para el mismo tema en todos los periodos), p. ej. "Calorimetría con cambio de fase", "Ángulo inscrito", "Inferencia", "Sucesiones alfanuméricas" |
| titular | el titular en mayúsculas que pone el solucionario sobre la resolución (si hay), tal cual (es un nombre de tema, no texto del problema) |
| tipo | "calculo", "conceptual", "grafica", "mixta". En razonamiento verbal usa el tipo de pregunta: "tema_central", "idea_principal", "sentido_contextual", "antonimia", "inferencia", "compatibilidad", "incompatibilidad", "extrapolacion", "jerarquia", "titulo", "intencion", "oraciones_incompletas", "eliminacion", "series_verbales", "conectores", "plan_redaccion", "ingles_<subtipo>", u otro corto |
| figura | true/false (depende de una figura, tabla o gráfico) |
| visual | "alto", "medio", "bajo" (cuánto ayudaría una escena animada) |
| modulo | id del módulo de la app que mejor la cubre (de `modulos.md`), o "" |
| cobertura | "si" (el módulo enseña ese tipo de problema), "medio" (la unidad tiene módulo pero no este tipo, o lo toca de pasada), "no" (no hay módulo para eso) |
| falta | si cobertura es medio/no: qué le faltaría a la app, en 5-12 palabras tuyas; si no, "" |
| resumen | descripción PROPIA, máx. 18 palabras, sin datos numéricos del problema |
| clave | letra de la clave según el solucionario ("" si no hay) |
| trampa | si el solucionario o las alternativas muestran un error típico (un distractor que sale de un error reconocible), descríbelo en abstracto en ≤15 palabras; si no, "" |
| inicio | primeras 8 palabras del enunciado tal como salen (solo para deduplicar; no se publica) |
| ocr | "ok", "imagen" (tuviste que mirar el PDF), "ilegible" |
| nota | observación breve o "" (p. ej. "repetida de 2024-I/...#35", "pregunta anulada", "clave dudosa") |

Clasifica TODAS las preguntas de tu curso en TODOS los archivos que te tocan, aunque se repitan entre días o áreas (la deduplicación la hago yo con `inicio`, pero si notas una repetida, dilo en nota).

## Al terminar
1. Lee el informe de ideas erróneas de tu curso en `/home/user/Mesa-de-Estudios/docs/investigacion/` (te lo indican) y escribe `<trabajo>/clasif/<tu-archivo>-trampas.md`: las trampas que se repiten en los solucionarios (en abstracto), cuántas veces, y qué código de error del informe coincide (o "nueva").
2. Responde con un resumen corto (≤250 palabras): cuántas preguntas por archivo, temas más frecuentes, huecos de cobertura más claros, dudas. No pegues la tabla.
