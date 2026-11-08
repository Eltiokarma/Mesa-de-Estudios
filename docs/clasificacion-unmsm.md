# Qué pregunta San Marcos en física y química: clasificación de simulacros

4 de noviembre de 2026 · Tarea 3 de `CLAUDE.md`, primera medición de cobertura

> La medición con los exámenes de admisión reales (2019-I a 2027-I, los ocho cursos) está en `docs/clasificacion-unmsm-admision.md`.

**Datos:** 39 exámenes de simulacro de San Marcos (`fuentes/examenes/unmsm-simulacros/`), pasados por OCR y clasificados pregunta por pregunta según `herramientas/esquema-clasificacion.md`. La tabla completa está en `docs/datos/clasificacion-unmsm.csv`, con descripciones propias y sin copiar enunciados (regla 5 de `CLAUDE.md`).

## Resumen en seis líneas

1. Hay **417 preguntas** de física y química en los 39 exámenes, pero solo **134 distintas**: dentro de cada periodo, las cinco áreas sacan sus preguntas de un mismo banco.
2. Los simulacros de **2022-II no son oficiales**: son de la academia "La Biología te hará libre". Las cifras de abajo usan solo los **7 periodos oficiales** (2023-II a 2027-I): **120 preguntas distintas**, 57 de física y 63 de química.
3. San Marcos **reparte** sus preguntas: en física toca 15 de los 18 temas del temario, casi siempre con una pregunta por tema. Ningún tema domina.
4. Las plantillas de la **fase 1** (lente delgada, espejos esféricos, MRUV, tiro parabólico) cubren **3 de las 57** preguntas de física oficiales (5 %). La lente delgada, ya construida, no aparece **ni una vez**.
5. Física es **cálculo** (46 de 57, 81 %); química es **conceptual** (39 de 63, 62 %). Una de cada cuatro preguntas de química es de **química orgánica** (16 de 63), el bloque con menos potencial visual.
6. La investigación de errores típicos ya cubre el **91 %** de las preguntas de física y el **59 %** de las de química.

## Cómo es cada examen

| Área | Física | Química |
| --- | --- | --- |
| A (Ciencias de la Salud) | 5 | 7 |
| B (Ciencias Básicas) | 7 | 7 |
| C (Ingenierías) | 7 | 6 |
| D (Económico-Empresariales) | 4 | 4 |
| E (Humanidades) | 4 | 4 |

Son las preguntas 79 a 96 de un examen de 100. Las áreas con menos preguntas toman un subconjunto de las de B y C. Cada periodo oficial tiene unas 14 preguntas distintas de física y química (24 a 26 en 2025-I y 2026-I, que traen dos bancos parcialmente distintos).

## Física: qué temas salen y cuánto

Ordenadas por **en cuántos de los 7 periodos oficiales aparecen**, que es la mejor señal de que el tema "siempre viene":

| Plantilla | Preguntas | Periodos (de 7) | Investigación |
| --- | --- | --- | --- |
| Calorimetría y dilatación | 5 | 5 | [Sí](investigacion/fluidos-calor-termodinamica-ideas-erroneas.md) |
| Trabajo, energía y potencia | 6 | 4 | [Sí](investigacion/estatica-energia-ideas-erroneas.md) |
| Fuerza magnética | 5 | 4 | [Sí](investigacion/electromagnetismo-moderna-ideas-erroneas.md) |
| Circuitos de corriente continua | 5 | 4 | [Sí](investigacion/electromagnetismo-moderna-ideas-erroneas.md) |
| Física moderna (fotoeléctrico, relatividad) | 4 | 4 | Sí, sin relatividad |
| Ondas y sonido | 4 | 4 | [Sí](investigacion/momento-gravitacion-ondas-ideas-erroneas.md) |
| Hidrostática y flotación | 3 | 3 | Sí |
| Vectores | 2 | 2 | No |
| Choques e impulso | 2 | 2 | Sí |
| Campo y potencial eléctrico | 2 | 2 | Sí |
| Bernoulli y caudal | 2 | 2 | No |
| Inducción | 2 | 2 | Sí |
| Espejos esféricos | 2 | 2 | [Sí](investigacion/optica-espejos-esfericos.md) |
| Reflexión y refracción | 2 | 2 | Sí |
| Equilibrio y torque | 2 | 2 | Sí |
| Movimiento circular | 2 | 1 | Sí |
| Tiro parabólico | 1 | 1 | [Sí](investigacion/cinematica-ideas-erroneas.md) |
| Análisis dimensional, dinámica circular, poleas, gravitación, plano inclinado, MAS | 1 cada una | 1 | Sí, salvo análisis dimensional |
| MRUV y gráficas | 0 | 0 | Sí |
| Lente delgada | 0 | 0 | Sí |

- **53 %** de las preguntas de física tienen potencial visual alto y **33 %** dependen de una figura.
- Cinemática casi no sale en los simulacros oficiales: una pregunta de tiro parabólico y dos de movimiento circular en 7 periodos. En la UNI, en cambio, ocupa las semanas 1 a 3 del CEPRE.

## Química: qué temas salen y cuánto

| Plantilla | Preguntas | Periodos (de 7) | Investigación |
| --- | --- | --- | --- |
| Reacciones, balance y redox | 9 | 6 | [Sí](investigacion/estequiometria-ideas-erroneas.md) |
| Química orgánica | 16 | 5 | No |
| Electroquímica | 6 | 4 | [Sí](investigacion/equilibrio-acidos-electroquimica-ideas-erroneas.md) |
| Cinética química | 4 | 4 | No |
| Soluciones y concentración | 4 | 3 | [Sí](investigacion/gases-soluciones-ideas-erroneas.md) |
| Átomo y configuración | 3 | 3 | [Sí](investigacion/atomo-enlace-ideas-erroneas.md) |
| Nomenclatura | 3 | 3 | No |
| Ácidos, bases y pH | 4 | 2 | Sí |
| Materia y mezclas | 3 | 2 | Sí |
| Tabla periódica, recursos y metalurgia, mol y fórmula | 2 cada una | 2 | Sí, salvo metalurgia |
| Estequiometría con limitante, gases, enlace, otras | 1 cada una | 1 | Sí, salvo "otras" |

- Solo el **10 %** de las preguntas de química tiene potencial visual alto; el **35 %** es bajo (orgánica, nomenclatura, definiciones).
- Redox aparece en 6 de 7 periodos, a veces con contexto peruano (drenaje ácido de mina, metalurgia).

## Qué significa para el laboratorio

Esto es una recomendación para discutir, no una decisión: la hoja de ruta la fija Gerson.

1. **La fase 1 está pensada para la UNI, no para San Marcos.** Lentes, espejos, MRUV y tiro parabólico son temas visuales y fundacionales, pero en San Marcos suman el 5 % de la física. Si el primer público es de San Marcos, una plantilla de **calorimetría**, una de **trabajo y energía** y una de **circuitos** cubrirían por sí solas el 28 % de su física (16 de 57), y las tres tienen investigación con datos fuertes.
2. **La UNA Puno decide.** El plan original pone a la UNA Puno primero. Antes de cambiar el orden de la fase 1, conviene clasificar sus exámenes con el mismo método: las herramientas ya están en `herramientas/`.
3. **San Marcos premia la amplitud.** Como cada tema sale una vez por examen, una plantilla aislada mueve poco el puntaje. Lo que más rinde es tener una plantilla corta por tema, más que una plantilla muy completa de un solo tema. Eso refuerza la idea de destilar pronto el patrón de construcción (tarea 6).
4. **Química necesita otro formato.** Con 62 % de preguntas conceptuales y 25 % de orgánica, una escena animada por pregunta no es lo que más ayuda. Para química de San Marcos funcionan mejor las predicciones rápidas con errores típicos, sin escena, y un explorador de estructuras para orgánica.

## Calidad de los datos

- **Verificación.** Revisé contra el original las 7 preguntas de física de 2026-II área B (el único PDF con texto propio) y dos preguntas más mirando la página como imagen. Las 9 estaban bien clasificadas, con los datos correctos.
- **Duplicados.** Se detectan por el comienzo del enunciado. Dos repeticiones de 2025-I no se detectaron por diferencias del OCR y se corrigieron a mano en el script.
- **OCR.** Todas las preguntas se pudieron clasificar, ninguna quedó "ilegible". Contando las 134 preguntas distintas, incluida 2022-II, el 47 % de las de física y el 29 % de las de química necesitaron mirar la página como imagen, sobre todo por las figuras.
- **Clasificación dudosa.** Hay casos que podrían ir en dos plantillas, por ejemplo un plano inclinado resuelto por energía o una neutralización que es a la vez de soluciones y de ácidos. Están marcados en la columna `nota` del CSV. Cambian los conteos en una o dos preguntas, no las conclusiones.
- **Problemas en los propios simulacros**, anotados para no usarlos como modelo:
  - Al PDF de 2025-I área A le faltan las páginas impresas 10 a 13; por eso no tiene física.
  - En 2025-I (esferas cargadas en un líquido), el enunciado pide la "constante dieléctrica", pero las alternativas son constantes de Coulomb.
  - En 2024-II (carga en un campo magnético), los datos no dan ninguna de las alternativas.
  - Las copias de 2023-II y algunas de 2026-I traen marcas a mano de alumnos.

## Cómo repetirlo con otra universidad

1. Bajar los PDF (`fuentes/descargar.sh` o a mano a `fuentes/examenes/`).
2. Pasar el OCR: `herramientas/ocr_pdf.sh <pdf> <salida>`, en paralelo con `xargs -P4`.
3. Clasificar cada pregunta según `herramientas/esquema-clasificacion.md`. Conviene ajustar la lista de temas al temario de esa universidad.
4. Juntar y medir: `python3 -I herramientas/agregar_clasificacion.py <carpeta_jsonl> <salida.csv>`.
