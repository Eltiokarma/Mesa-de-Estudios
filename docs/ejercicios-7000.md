# La tanda de 7000 ejercicios

13 de noviembre de 2026. Plan de la rutina «ejercicios-7000». Lo complementan:
- [`docs/escena-viva.md`](escena-viva.md): el formato al que llega cada ejercicio (secciones 3, 4 y 7);
- [`contenido/ejercicios/LEEME.md`](../contenido/ejercicios/LEEME.md): el esquema de un ejercicio entrante;
- `herramientas/validar-ejercicios.js`: valida, cuenta y audita.

Mandan dos reglas de `CLAUDE.md`:
- **Regla 1.** El cálculo lo hace código. Un modelo de lenguaje solo lee, clasifica y redacta.
- **Regla 5** (cambiada por Gerson el 13 nov 2026). Los problemas de examen y de los libros que los recopilan entran al repo y a la app **con su cita**: libro, autor, editorial, problema y página, y universidad y periodo si se saben. Alimentan el motor de ejercicios, se presentan como exámenes pasados y sirven para medir nivel, profundidad y progresión. Lo que no se puede citar se queda en `fuentes/ejercicios/`. El banco Cuzcano entra por `herramientas/importar-cuzcano.js` (`contenido/ejercicios/LEEME.md`).

La tanda anterior costó cerca de 1000 USD contra 300 estimados. Este plan está hecho para no repetirlo: **se cuenta antes de construir, se construye por Pareto y cada rutina tiene tope.**

## Decisiones de Gerson (13 nov 2026)

1. **Formato:** llegan en PDF o en HTML, con clave y **resueltos**. El cortador (`herramientas/cortar-ejercicios.js`) acepta los dos, además de texto. Las resoluciones de la fuente se guardan aparte (`soluciones.ndjson`, en `fuentes/`, que no se versiona) y solo sirven para contrastar la clave y el valor recalculado. No se publican: la solución se rehace (regla 5).
2. **Ritmo: bloques de 100 ejercicios de un tema de un curso.** Cada bloque recorre todo el camino antes de abrir el siguiente: cortar, clasificar, contar, mapear, migrar o construir, verificar y publicar. Así cada bloque deja algo publicado y medible, y el costo se controla bloque a bloque.
3. **Alcance:** todo lo que se pueda, priorizando 3.º, 4.º y 5.º de secundaria. Los bloques se ordenan por el grado de la unidad en el catálogo (primero 3.º, luego 4.º, luego 5.º) y, dentro de cada grado, por cantidad de ejercicios.
4. **Tope total y vía de clasificación: se deciden cuando llegue la tanda** (Gerson, 13 nov: «cuando llegue ese toro, lo toreamos»). Hasta entonces no se pregunta. Cuando llegue, cada bloque lleva su tope (sección 5) y se informa el gasto al cerrarlo.

**Cómo se corre un bloque:**
```sh
node herramientas/cortar-ejercicios.js fuentes/ejercicios/entrada/<archivo>.pdf     # o .html; crudo.jsonl + soluciones + no cortados
node herramientas/validar-ejercicios.js --contar fuentes/ejercicios/<lote>         # tabla de conteo
```
- **PDF:** el cortador prueba tres lecturas (`layout`, por columnas con coordenadas y orden de lectura) y se queda con la que deja más enunciados limpios. Con un PDF de prueba a dos columnas, el modo por columnas cortó 24 de 24 con su clave; `layout` pegaba las columnas.
- **Escaneados:** las páginas sin texto se avisan, para pasarlas por `herramientas/ocr_pdf.sh`.
- **Nombres de archivo:** `unmsm-2025-I-area-A.pdf` se reconoce como oficial; cualquier otro nombre, como academia.

## 0. Antes de recibir nada

1. ~~Agregar `fuentes/ejercicios/` a `.gitignore`.~~ Hecho el 13 nov.
2. ~~Que Gerson conteste las tres preguntas del final (sección 9).~~ Contestadas, salvo el tope total (ver «Decisiones de Gerson»).

## 1. Entrada: qué pedirle a Gerson

Del más barato al más caro de procesar:

| Formato | Cómo se procesa | Costo de tokens |
| --- | --- | --- |
| **Texto o Word, un ejercicio por bloque numerado, con la clave al final** | Script que corta por numeración (`1.`, `Problema 12`) y alternativas (`A)` … `E)`) | Casi cero |
| PDF con capa de texto (exportado, no escaneado) | `pdftotext -layout` y el mismo script | Casi cero |
| PDF escaneado | `herramientas/ocr_pdf.sh` (tesseract en español, en paralelo con `xargs -P4`), luego el script | Cero en tokens. El OCR destroza fórmulas y figuras: esos ejercicios se marcan `figura_fuente: true` y se revisan a mano o con un LLM solo cuando el script no los pudo cortar |
| Fotos de celular | OCR, pero con mucho descarte | Caro: pedirlas solo si no hay otra cosa |

**Qué se le pide, en concreto:**
- un archivo por libro o por examen;
- en el nombre del archivo, el origen: `unmsm-2025-I-area-A.pdf` o `academia-<libro>.pdf`;
- con la clave de respuestas;
- ~~sin resoluciones, si se puede~~: vienen resueltos (decisión del 13 nov). El cortador separa la resolución del enunciado y la guarda aparte para verificar.

El script de corte (`herramientas/cortar-ejercicios.js`, 13 nov) deja cada ejercicio como JSON `crudo` en una línea de `fuentes/ejercicios/<lote>/crudo.jsonl`, con:
- `id` estable: `<lote>-<número de 4 cifras>`;
- `origen`;
- `enunciado`, `alternativas_fuente` y `clave_fuente`.

Los oficiales van a `contenido/ejercicios/<lote>/`, que sí se versiona. Lo que el script no puede cortar va a una lista aparte y lo corta un LLM por páginas. Se estima menos del 10 % si el formato es texto.

## 2. Clasificar y contar, antes de construir

**La primera entrega a Gerson es la tabla de conteo, no un generador.**

1. **Clasificación.** Un LLM lee cada ejercicio y le pone `curso`, `unidad` (de `catalogo/cursos/`) y `tipo` (`<unidad>/<tipo>`, con nombres nuestros). Detalles:
   - va en tandas de 50 ejercicios por llamada;
   - el prompt fijo lleva la lista de unidades y de tipos ya registrados (`contenido/ejercicios/tipos.json`), en caché;
   - la salida es JSON con esquema. El LLM no resuelve nada: solo etiqueta.
2. **Duplicados.** Mismo tipo y misma estructura con otros números: `duplicado_de`. Se cuentan, pero no pesan en el Pareto, porque un generador cubre a todos a la vez.
3. **Validar y contar:**
   ```sh
   node herramientas/validar-ejercicios.js --validar fuentes/ejercicios/lote-01
   node herramientas/validar-ejercicios.js --contar  fuentes/ejercicios/lote-01          # tabla
   node herramientas/validar-ejercicios.js --contar  fuentes/ejercicios/lote-01 --json   # para el doc o una hoja
   ```
   La tabla da totales por curso, origen, estado, vía, pieza, unidad y tipo, cada uno con su porcentaje acumulado (Pareto). Da también los huérfanos: tipos sin generador ni pieza.
4. **Revisión de Gerson.** Gerson ve la tabla y decide el alcance: qué cursos y qué tipos para el piloto. Recién ahí se gasta en construir.

Una muestra de 100 ejercicios clasificada a mano por Gerson, o revisada por él, sirve de control: si el LLM coincide en menos del 90 % de los tipos, se corrige el prompt antes de seguir.

## 3. Mapeo: cada tipo, una vez

El mapeo se hace por tipo en `contenido/ejercicios/tipos.json`, no por ejercicio. Si un tipo tiene 300 ejercicios, se decide una vez. Cada tipo cae en una de cuatro vías, de la más barata a la más cara:

| Vía | Cuándo | Qué se hace | Quién lo publica |
| --- | --- | --- | --- |
| `generador` | Ya existe un generador que lo cubre (90 hoy), con su `subtipo` (`_datos.tipo`) | Nada nuevo. Si su forma no está, se agrega un `subtipo` al generador | El generador, con números nuestros |
| `pieza` | Hay una pieza del kit que lo dibuja (`barra-porcentaje`, `recta`, `balanza`, `flechas`, `triangulo`, `ejes`), pero no hay generador | Generador nuevo sobre esa pieza | El generador nuevo |
| `instancia` | Pregunta oficial que no vale la pena generalizar | Ejercicio fijo con `escena`, `pasos`, `alternativas` y `fantasmas` escritos en su JSON. **Solo oficiales o propios** | El propio ejercicio, con su cita |
| `nuevo` | No hay nada (huérfano) | Se decide por cantidad: si junta muchos ejercicios, se hace pieza y generador; si son pocos, espera | — |

**Orden por Pareto.** Se ordenan los tipos por cantidad de ejercicios, sin duplicados, y se atiende primero el grupo que cubre el 80 %. En la tanda anterior, 90 generadores cubrían 662 preguntas de admisión de San Marcos. Lo esperable es que pocos tipos junten la mayoría y que la cola larga sean huérfanos de 1 a 5 ejercicios cada uno, que esperan.

**Los de libro** (citados, en `contenido/ejercicios/<lote>/`) sirven de tres formas:
- dicen qué subtipos faltan en un generador;
- dan una prueba barata: el `calc` del generador, corrido con los datos del ejercicio, debe dar su clave. Si no la da, o el generador tiene un hueco o la clave del libro está mal. Desde el 13 nov esa prueba sí se versiona, con la cita del ejercicio;
- se muestran tal cual, con su cita, como banco o examen pasado.

## 4. Verificación (lección de costo)

- **Todo se recalcula por código** (regla 1): `verificacion.por` es `generador`, `motor` o `calculo-independiente`, y `coincide` debe ser `true`. El validador rechaza un `verificado` sin eso y avisa si `resultado` no es `respuesta.valor`.
- **Un tipo que va por un generador existente no se verifica a ciegas otra vez.** Basta con que pase sus pruebas de siempre (`probarGenerador`, 400 semillas, recálculo independiente).
- **La verificación a ciegas completa va solo en fórmulas nuevas:** un generador nuevo o un `calc` nuevo. Es la regla de `docs/pendientes.md` («Lecciones de costo»).
- **Las instancias oficiales** se verifican con el motor de su tema, o con un cálculo independiente de 5 a 20 líneas en su prueba. La clave oficial debe coincidir con el cálculo. Si no coincide, se anota y no se publica hasta revisarla.
- Desde `verificado`, el presupuesto de texto (enunciado ≤ 40, paso ≤ 14, explicación ≤ 20 palabras) es error. Antes es aviso.

## 5. Tandas, topes y costo estimado

Reglas:
- **máximo 3 rutinas en paralelo;**
- **cada una con tope en USD**, y cierra con lo que tenga al llegar;
- revisión del gasto con `send_later` a mitad de camino;
- sin subagentes de verificación salvo en fórmulas nuevas.

**Supuestos.** Precios de la API por millón de tokens, consultados el 13 nov:
- Opus 5.5: 4 USD de entrada, 20 de salida, 0,20 por lectura de caché;
- Sonnet 5.5: 2 y 10;
- Haiku 5.5: 0,10 y 0,50;
- la Batch API cobra la mitad.

Un ejercicio pesa unos 300 tokens con sus alternativas, y su etiqueta, unos 60 tokens de salida (el doble, contando razonamiento). Las rutinas de Claude Code gastan de 3 a 5 veces lo que una llamada directa, porque releen contexto en cada paso. Las últimas cinco rutinas costaron entre 4 y 28 USD cada una.

| Tanda | Qué | Cómo | Estimado | Tope |
| --- | --- | --- | --- | --- |
| 0. Entrada | Corte por script; OCR si hace falta; LLM solo para lo que el script no corta | Script, más una rutina chica | 5–10 USD | 15 USD |
| 1. Clasificación y conteo | 7000 × 300 tokens = 2,1 M de entrada y unos 0,8 M de salida. Más los duplicados y la tabla para Gerson | Con API directa y Opus 5.5: unos 25 USD (unos 13 USD con Batch). Con una rutina de Claude Code: 3 a 5 veces más | 15–100 USD, según la vía | 100 USD |
| 2. Mapeo | Unos 300 a 600 tipos contra 90 generadores y 6 piezas; subtipos que faltan | Una rutina sobre `tipos.json` y la tabla, sin releer los 7000 | 10–20 USD | 25 USD |
| 3. Migración al formato vivo | Los generadores que cubren el 80 % de la tanda: `escena`, `pasos`, `fantasmas` y textos cortos. Supone que el kit (`nucleo/kit/`) ya tiene sus piezas | Hasta 3 rutinas en paralelo, unos 15 a 30 generadores, a 2–4 USD cada uno | 60–120 USD | 40 USD por rutina |
| 4. Huérfanos con volumen | Generadores nuevos para los tipos huérfanos más grandes, con verificación a ciegas (fórmula nueva) | 10 a 20 generadores, a 4–8 USD cada uno | 60–120 USD | 40 USD por rutina |
| 5. Instancias oficiales | Las preguntas oficiales que no cubre ningún generador | Unos 0,05–0,15 USD por ejercicio | Depende del conteo: 300 instancias, 15–45 USD | 50 USD |
| **Total** | | | **unos 170–420 USD** | **unos 450 USD** |

El rango es ancho a propósito: **la cifra se rehace con la tabla de conteo** (sección 2), antes de lanzar las tandas 3 a 5. Si el conteo muestra que el 80 % cae en tipos con generador, las tandas 4 y 5 se achican. El modelo de cada tanda lo decide Gerson. Sonnet 5.5 cuesta la mitad que Opus 5.5 y puede bastar para etiquetar, pero conviene medirlo con la muestra de control de 100.

## 6. Qué se publica y cómo se mide

**Se publica:**
- los generadores, existentes o nuevos, con números nuestros, en formato vivo cuando estén migrados. Sin migrar siguen saliendo en el formato de hoy, y la app lee primero los campos nuevos (contrato, sección 4);
- las instancias oficiales, con cita «UNMSM 2025-I» y solución y figura propias. Si la cita se muestra al alumno es una decisión pendiente de Gerson (`docs/pendientes.md`, D).

- los ejercicios de libro, tal cual y con su `origen.cita` (regla 5, 13 nov 2026).

**Nunca se publica** un ejercicio sin cita (`origen.tipo: "academia"`), su enunciado ni sus números.

**Medición.** Sin cambios en el núcleo: cada respuesta de práctica es un evento `prediccion` de `nucleo/medicion.js`, con el `error` (código de la alternativa) que eligió el alumno, o `nose`. `herramientas/analizar-medicion.js` resume por módulo y por código de error. Así se ve:
- qué errores se eligen de verdad (las hipótesis que se confirman o caen);
- qué tipos se fallan más.

Si los fantasmas usan los mismos ids de error que las alternativas, como pide el contrato, la medición no cambia. Para medir **por tipo** y no solo por módulo, haría falta que el evento lleve el `subtipo` (ver la sección 8).

## 7. La auditoría de los generadores de hoy

`node herramientas/validar-ejercicios.js --auditar`: 90 generadores, 20 semillas cada uno, en unos 5 segundos. Este es el backlog de migración medido.

Cómo se mide:
- **palabra:** un trozo entre espacios con al menos una letra. Los números, los signos y los datos con color no cuentan;
- **enunciado:** `enunciado` + `pregunta`;
- **paso:** cada elemento de `solucion`;
- **carga:** la peor razón de un problema contra el presupuesto, en promedio. 1 está justo en el límite; 2 es el doble;
- **adm:** preguntas de admisión de San Marcos que cubre el módulo, según `docs/datos/admision-unmsm.csv`.

**Resumen:**

| Medida | Resultado |
| --- | --- |
| Pasan el presupuesto en todas las semillas | **0 de 90** |
| Cumplen el enunciado (≤ 40) en todas las semillas | 19 |
| Cumplen los pasos (≤ 14) en todas las semillas | 5 |
| Cumplen las explicaciones (≤ 20) en todas las semillas | 0 |
| Problemas que cumplen todo (media por generador) | 10 % |
| Traen `escena`, `pasos` o `fantasmas` | 0 |
| Traen figura SVG propia, hecha a mano | 13 |
| Palabras promedio: enunciado, paso más largo y explicación | 37,3, 18,9 y 20,5 |
| Carga ≤ 1,2 (cerca), 1,2 a 1,6, más de 1,6 y más de 2 | 12, 38, 40 y 15 |

Lo que más falla son las explicaciones y los pasos, no el enunciado. En promedio, las explicaciones están casi en el límite (54 de 90 tienen media ≤ 20), pero todas tienen alguna que se pasa. Los pasos más largos promedian 19 palabras, contra 14. Por curso:

| Curso | Generadores | adm | Carga media | Problemas que cumplen |
| --- | --- | --- | --- | --- |
| Razonamiento matemático | 20 | 199 | 2,09 | 2 % |
| Química | 8 | 85 | 1,56 | 13 % |
| Geometría | 10 | 92 | 1,55 | 7 % |
| Aritmética | 6 | 55 | 1,52 | 21 % |
| Física | 34 | 118 | 1,45 | 13 % |
| Álgebra | 5 | 60 | 1,44 | 14 % |
| Trigonometría | 7 | 53 | 1,41 | 16 % |

**Los 10 peores (por carga):**

| Generador | Carga | Enunciado (media/máx.) | Paso más largo (media/máx.) | Explicación (media/máx.) |
| --- | --- | --- | --- | --- |
| `rm-deduccion` | 3,3 | 64,5 / 96 | 33,8 / 102 | 42,6 / 93 |
| `rm-lectura-palabras` | 3,1 | 60,9 / 65 | 43,1 / 47 | 22,7 / 31 |
| `quimica-conceptos` | 2,5 | 60,0 / 88 | 32,8 / 44 | 35,2 / 56 |
| `rm-trasvases` | 2,4 | 66,7 / 90 | 33,0 / 38 | 28,2 / 35 |
| `rm-cortes` | 2,4 | 77,2 / 132 | 31,9 / 44 | 23,4 / 37 |
| `circuitos-mallas` | 2,3 | 53,5 / 72 | 30,6 / 45 | 29,5 / 69 |
| `poleas-giros` | 2,3 | 66,8 / 91 | 28,6 / 38 | 27,7 / 45 |
| `rm-movimientos` | 2,2 | 81,5 / 115 | 24,1 / 26 | 23,3 / 36 |
| `dados-caras` | 2,1 | 30,9 / 70 | 29,4 / 37 | 24,6 / 41 |
| `rm-rumbos` | 2,1 | 61,4 / 88 | 29,4 / 46 | 23,8 / 37 |

Los más cercanos al presupuesto, buenos para el módulo prototipo, tienen carga de 1,0 a 1,1:
- `vectores-unitario`, `vectores-productos` y `vectores-combinacion`;
- `conversiones-quimica`, `porcentajes-sucesivos` y `division-polinomios`.

**Orden de migración sugerido.** Primero lo que más preguntas reales cubre; a igualdad, lo que más se pasa. Se rehace con el conteo de los 7000:
1. `quimica-conceptos` (40 preguntas de admisión);
2. `rm-certezas` (21);
3. `geo-revolucion` (18);
4. `rm-planteo` (18);
5. `rm-fichas` (16);
6. `inecuaciones-planteo` (16);
7. `rm-lectura-palabras` (14);
8. `rm-rumbos` (14);
9. `rm-trasvases` (13);
10. `rm-diagramas-flujo` (13);
11. `trig-angulos-verticales` (13);
12. `ecuaciones-polinomiales` (13);
13. `fracciones-problemas` (13);
14. `rm-ciclos` (12);
15. `rm-relojes` (12).

Para el **prototipo** (un módulo completo con el look nuevo, `docs/pendientes.md`, B) conviene `porcentajes-sucesivos` con la pieza `barra-porcentaje`. Ya está casi en presupuesto (carga 1,1), el contrato lo usa de ejemplo y su error principal (sumar descuentos) se dibuja bien como fantasma.

## 8. Cambios que sugiero al contrato (`docs/escena-viva.md`)

1. **`respuesta` ya existe en los generadores** (`{ valor, unidad }`, y `probarGenerador` lo exige). Conviene decir que `tipo`, `control` y `tolerancia` se agregan a ese mismo objeto y que `valor` se queda. Así lo hace el esquema de `contenido/ejercicios/`.
2. **Definir qué cuenta como palabra y qué entra en el enunciado.** El validador cuenta `enunciado` + `pregunta`, y como palabra, un trozo con al menos una letra. Las ecuaciones y los números sueltos no cuentan.
3. **Catálogo de piezas legible por máquina.** Por ejemplo, `nucleo/kit/piezas/<id>.js` que exporte `{ id, datos }`, con el esquema de `escena.datos`. Así el validador comprueba los datos de la escena, no solo que la pieza exista. Hasta entonces acepta las seis piezas previstas, con aviso.
4. **Un error puede no tener fantasma.** Cuando la pieza no lo puede dibujar se muestra solo la línea de texto, pero se cuenta. El validador ya exige que toda clave de `fantasmas` sea un id de error, no lo contrario.
5. **Medición por tipo.** Que el evento `prediccion` lleve el `subtipo` (`_datos.tipo`) del problema. Con eso, la tabla de conteo de los 7000 y los datos del piloto se cruzan por tipo. Es un cambio de `nucleo/` y `app/`, fuera de esta rutina.

## 9. Lo que Gerson tiene que contestar antes de mandar los 7000

1. **¿En qué formato llegan y cuántos son de examen oficial?** Texto, PDF con texto o escaneado. ¿Cada archivo dice su origen (universidad y periodo, o libro)? ¿Traen la clave de respuestas? Sin clave, la verificación de los oficiales se vuelve cálculo propio sin control.
2. **¿Cuál es el tope total de gasto y por qué vía se clasifica?** ¿Hay clave de la API para la Batch API (unos 13 a 25 USD la clasificación) o todo va por rutinas de Claude Code (unos 60 a 100 USD)? ¿Con qué modelo?
3. **¿Qué entra al piloto de diciembre?** ¿Todos los cursos o los que más ejercicios tengan? ¿Se muestra al alumno la cita «UNMSM <periodo>» en las oficiales (decisión D pendiente)? Con eso se corta el Pareto y se decide si la tanda 3 espera al kit.
