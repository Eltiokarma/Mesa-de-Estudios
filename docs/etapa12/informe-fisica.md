# Física — Fluidos, etapa 12

26 de noviembre de 2026. Unidad: fisica.fluidos. **Listo para integrar**, sujeto a la revisión de cierre y las capturas indicadas abajo. No se ha marcado calidad 2, abierto PR ni hecho merge.

## Qué quedó hecho

Se rehízo la unidad con seis ideas y los seis identificadores anteriores, siete momentos por idea y **90 ejemplos: 15 por idea, cinco por nivel**. Se cubren los siete temas publicados, incluida tensión superficial, y se incorpora Torricelli como aplicación de continuidad y energía.

Hay **18 términos propios de glosario**. Peso aparente se hereda de Dinámica; en esta unidad se aclara su interpretación para una suspensión. Volumen desplazado se presenta por primera vez en Empuje. Se conservan las mesas presion-total, bloque-libre y prensa, con nueve invitaciones en total y modelos rehechos. No se usa un reloj ficticio para representar un estado inicial.

La pieza nueva fis-fluidos-e12 representa vasos, pistones, tubo en U, barómetro y conducto. Emplea los rótulos del kit, escalas explícitas y esquemas independientes de las respuestas desconocidas. Las piezas existentes fis-estatica y ejes se reutilizan sin modificarlas. Los subíndices se escriben con nodos de ecuación; los rótulos SVG usan nombres y cantidades simples.

La práctica fis-fluidos aporta **18 familias**, TIPOS_POR_IDEA, 20 referencias verificadas aparte y ocho problemas de papel. Incluye variantes de suspensión, anclaje, flotación, diámetros, trabajo y salida de depósito. Las plantillas heredadas fluidos y fluidos-hidrodinamica llevan rehacer y conservan sus rutas. Se agregan únicamente dos pares A/B de reserva al banco de Física; sus diez pares activos permanecen intactos.

## Archivos compartidos y alcance

| Archivo | Cambio propio |
| --- | --- |
| catalogo/cursos/fisica.json | Solo ficha de Fluidos: añade Trabajo y energía como requisito y antepone fis-fluidos. Conserva los siete temas. |
| catalogo/pruebas/fisica.json | Añade errores hipotéticos propios y dos pares reservados flu-01/flu-02. |
| catalogo/pruebas/verificar.js | Añade dos verificadores al final de la sección Física. |
| nucleo/avance.js | Añade un bloque de Fluidos: reinicia predicciones antiguas sin huella, conservando estudio, cartas, respuestas y repaso. |

Las dos fichas de plantillas heredadas solo reciben rehacer. Se regeneran app/datos/catalogo.json, app/datos/glosario/fisica.json y app/datos/pruebas.json mediante la herramienta del proyecto. No se modifica ningún otro curso, pieza compartida existente, service worker, archivo del método ni lista de pendientes. No hace falta cambiar repaso-tipos.

## Qué se comprobó

Cada idea contrasta 15 ejemplos y 400 semillas de cada generador: **4890 casos de teoría**, además de las misiones, predicciones, cortes de Mira y reglas. Se verifican entradas visibles, unidades, colores, igualdades con letras y números, redondeo con ≈, distractores, siFuera y unicidad después del formato. Los bancos de Resuelve y Ahora tú permanecen separados.

Los cálculos independientes usan recorridos de presión, balances de volumen, fuerzas sobre caras del cuerpo, trabajo virtual de la película y balance de energía de una porción de líquido. En los problemas inversos se usan balances y bisección, sin importar el solucionador productivo como respuesta esperada. Las pruebas incluyen alteraciones deliberadas de datos, respuesta, errores y ecuaciones para comprobar que el oráculo detecta fallos.

La práctica recorre **400 semillas por cada una de las 18 familias: 7200 casos**, con cobertura de sus variantes. Las 20 referencias conservan entradas completas, respuesta exacta y 60 distractores. El papel se contrasta con ocho cálculos independientes y con la reproducción de sus semillas. Los pares del curso se verifican en sus cuatro formas, más 400 variantes por par; las opciones se comprueban por fuerza bruta.

La geometría se prueba sobre SVG y las coordenadas reales del kit: márgenes, rótulos, cuerpos, cotas, puntas de flechas, alturas, áreas y fracciones dadas. Se corrigieron caras iguales para áreas distintas, una cota sobre el conducto, cruces de rótulos y proporciones de bloques en dos líquidos. Las tinas tienen holgura en ambas direcciones horizontales y conservan volumen: no basta que el bloque quepa en la proyección.

Las mesas recorren toda su grilla: presión 45 estados, prensa 48 y bloque libre nueve. También se verifican 400 balances de presión para el bloque libre. Las invitaciones se comprueban por fuerza bruta; ninguna está resuelta en el estado inicial.

| Comprobación | Resultado final |
| --- | --- |
| Calidad 2 simulada de teoría, 400 semillas, sin marcarla | 0 hallazgos. |
| Pruebas propias de teoría, laboratorios y pieza | 78 pruebas propias: teoría, laboratorios y pieza; verdes tras los ajustes. |
| Práctica, referencias y papel | 65/65 verdes: 43 de contrato, presentación y exclusiones; 22 de cálculo independiente. |
| Integración, catálogo, migración y repaso | 136/136 verdes en la tanda compartida, incluidas las ocho propias de integración. |
| Papel de todas las plantillas de la ficha bajo C2 simulada | 0 hallazgos en las tres plantillas; ocho ejercicios nuevos contrastados. |
| Suite completa, una ejecución con resultado de npm run test:corto | 12 659 aprobadas, 7 omitidas y 10 fallidas; 12 676 en total, 660,2 s. Las diez fallas corresponden a conexión local en nucleo/sesion.test.js, no a Fluidos. |

Las diez fallas están en nucleo/sesion.test.js, líneas 79, 109, 143, 179, 219, 246, 280, 306, 349 y 368. Los casos usan un servidor falso local y devolvieron «No hay conexión con el servidor». Coinciden con las limitaciones de conexión observadas al comprobar Oscilaciones. No se alteraron esos archivos ni se ocultaron resultados; no se repitió la suite completa después de este resultado. Un primer intento con bitácora terminó sin resultado porque su ruta de salida no existía; la ejecución informada utilizó directamente npm run test:corto.

Las 151 pruebas propias de Fluidos quedaron verdes: 78 de teoría, laboratorios y pieza; 65 de práctica; ocho de integración.

Durante la escritura se corrigieron también la etiqueta de tema para coincidir con el catálogo, un glosario duplicado, una voz demasiado larga y una entrada de área con precisión oculta. No se presentan esas tandas iniciales como verdes; se informa el estado posterior a las correcciones.

## Investigación: qué se tomó y qué se descartó

La versión disponible era docs/investigacion/etapa12/breve/fisica.fluidos.md y su LEEME; la investigación larga figuraba pendiente. Se tomaron sus condiciones de aplicación, separación entre presión absoluta y manométrica, volumen desplazado y necesidad de conservar altura en Bernoulli. Se contrastaron con las fuentes primarias enlazadas en la propuesta: OpenStax, trabajos originales de Goszewski y de Wagner, entre otras.

Se descartó organizar la unidad en cuatro ideas porque habría reducido el tratamiento cuantitativo de tensión superficial ya publicado. No se trasladaron frecuencias de errores a estudiantes peruanos ni se convirtieron las operaciones de los distractores en resultados empíricos: se registran como hipótesis. La fuente de Loverude no se pudo validar mediante su acceso disponible y no sostiene una afirmación final. Las referencias históricas de admisión muestran presencia de temas, no su frecuencia actual; ningún ejercicio se copió de academias o solucionarios.

Los ejemplos son modelos numéricos propios. La historia usa la carta de Torricelli del 11 de junio de 1644, respaldada por Museo Galileo, sin resolver arbitrariamente las fechas discordantes del experimento. Los datos opcionales de pelota, ciudades o coeficientes de agua no se convierten en constantes universales de los casos.

## Decisiones y revisión de Gerson

Se conservaron los seis IDs y siete temas, se añadió Trabajo y energía como requisito y se mantuvo tensión superficial con una extensión de capilaridad limitada al contacto de 0°. Datos contiene entradas, condiciones y equivalencias necesarias; las fórmulas aparecen al enseñarlas o resolver. Las prensas distinguen igual altura y desnivel; los balances de trabajo solo se aplican con sus condiciones. Las flechas cualitativas declaran que muestran sentido, no magnitud.

No se identificó un conflicto crítico con una decisión escrita. Gerson puede revisar la extensión de capilaridad y los dos pares de reserva; no bloquean la revisión técnica. La sesión auditora decidirá calidad 2 y la integración.

## Límites reales

**No se generaron capturas ni se revisó el resultado en un navegador de 390 px.** Playwright, @playwright/test y Puppeteer no están instalados; el servidor local había sido bloqueado con EACCES en esta sesión. Las comprobaciones de HTML/SVG y geometría no sustituyen esa lectura visual. Claude debe sacar y mirar momentos y ejemplos, también en oscuro, antes del cierre visual.

No se completó la investigación larga que no estaba publicada. Los límites de la suite completa se detallan en su fila y no se ocultan como una aprobación total.

## Rama y commits

- Base consultada de main: 94f40db7ee81125c144f8bbbe2eca328d757f8ea.
- Rama: codex/etapa12-fisica-fluidos.
- Teoría completa publicada: a27ebca8b8da586f5541e02dd3ce0b8a412cdf9f.
- Último commit de implementación verificado: c1df1d2ef55ab52c9d5e776c8f2b1b47693a87ef.
- El commit que contiene este informe queda como punta de la [rama de entrega](https://github.com/Eltiokarma/Mesa-de-Estudios/tree/codex/etapa12-fisica-fluidos); su SHA exacto se comunica en la entrega.

Los cambios se publican sobre el árbol remoto existente, conservando todos los archivos ajenos. Se cotejaron los 34 blobs modificados o nuevos con los archivos revisados: cero diferencias, cero archivos adicionales fuera del alcance y cero eliminaciones. El informe final se vuelve a cotejar después de publicarlo.
