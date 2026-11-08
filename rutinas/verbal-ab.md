# Rutina de razonamiento verbal A/B: reporte

8 de noviembre de 2026 · Rama `rutina/verbal-ab`, creada desde `claude/awesome-wozniak-5etl1n`. No subí `VERSION` de `app/sw.js` ni corrí `npm run catalogo` sobre `app/datos/`. Las dos cosas quedan para la integración.

**Encargo:** que todas las preguntas de razonamiento verbal de `docs/datos/admision-unmsm.csv` que estaban a medias queden cubiertas. Eran 323: 240 de pares A/B, 80 de inglés y 3 de textos mixtos.

**Resultado:** quedan cubiertas 322 de las 323.

## Cobertura del curso, contada en el CSV

| | Sí | A medias | No |
| --- | --- | --- | --- |
| Antes | 367 | 323 | 0 |
| Después | **689** | **1** | 0 |

- Las 240 filas de «Textos A/B (dos autores)» pasan a `si`, con módulo `textos-dialecticos`.
- Las 80 de «Lectura en inglés» pasan a `si`, con módulo `lectura-ingles`.
- 2 de las 3 de textos mixtos pasan a `si`, con módulo `textos-discontinuos`.
- **Queda a medias** una: `unmsm-2024-I-solucionario-2023-12-09-area-a#5`, una pregunta que cruza una imagen histórica con el texto. El formato no tiene figuras de imagen, y una descripción en recuadros no mide lo mismo. Para cubrirla haría falta un tipo de figura `imagen`, que es un cambio de núcleo mayor.

Solo cambié filas de razonamiento verbal. No regeneré `docs/datos/admision-unmsm-tablas.md` (lo hace `herramientas/agregar_admision.py`) para no chocar con las otras rutinas; conviene correrlo al integrar.

## Qué construí

| Commit | Qué |
| --- | --- |
| 7379f41 | Formato lectura: pares A/B, previo `atribuir`, preguntas en inglés, RV59 a RV63 |
| e5cc7c2 | Módulo nuevo `textos-dialecticos` con 21 pares (t101 a t121) |
| 983f9ea | `lectura-ingles` 0.2.0: 10 textos nuevos (t122 a t131) |
| c108775 | `textos-discontinuos` 0.2.0: t132 y t133 |
| ab863b7 | Rótulo de autor en el celular; pruebas con Playwright |
| 3837f4f | CSV de admisión |

Los commits de en medio (borradores y avances de la revisión) quedaron en la rama. Uno de ellos (5c6e55d) se subió con t102, t105 y t106 en rojo, porque un revisor los estaba editando en ese momento. Se arreglaron en los commits que siguen.

### 1. Pares de textos A/B: módulo `textos-dialecticos` (21 pares, 105 preguntas)

Son textos propios de dificultad 1 a 3 sobre temas peruanos de educación, ambiente, ciencia y sociedad.
- **Dificultad 1:** lengua materna en la primaria, totorales del Titicaca, queñua, libros de papel o digitales.
- **Dificultad 2:** tareas, celular en el aula, IA en las tareas, aforo de Machu Picchu, octógonos, examen de admisión, combis, qochas, notas con letras.
- **Dificultad 3:** minería informal, jornada escolar completa, moratoria a los transgénicos, cuota de anchoveta, clases virtuales, huacas, litio de Puno, ciencia y saber tradicional.

Unos pares debaten y otros se complementan. Los tipos de pregunta y cuántas hay de cada uno:

| Tipo | Preguntas |
| --- | --- |
| Sentido contextual | 20 |
| Coincidencia | 17 |
| Postura | 16 |
| Controversia | 14 |
| Diálogo («qué objetaría A a B») | 13 |
| Discrepancia | 9 |
| Inferencia | 8 |
| Extrapolación | 3 |
| Síntesis | 2 |
| Incompatibilidad | 2 |
| Compatibilidad | 1 |

Cada par lleva dos o tres previos `atribuir`, y t109 también uno `clasificar`. Todas las preguntas van en la unidad `textos-argumentativos-y-dialecticos`, que ahora nombra los dos módulos (`lectura-verbal` y `textos-dialecticos`).

**El paso previo propio de los pares es `atribuir`.** El alumno lee una paráfrasis y dice quién la sostiene: el autor A, el autor B, los dos o ninguno. Lo responde antes de ver las alternativas, que quedan bloqueadas mientras tanto.

### 2. Inglés más allá de la idea principal (`lectura-ingles` 0.2.0, 10 textos)

En t122 a t131, **los enunciados y las alternativas van en inglés, como en San Marcos**; las explicaciones siguen en español. Los temas son la papa nativa, la corriente de Humboldt, el sueño adolescente, los glaciares de la Cordillera Blanca, un aviso de biblioteca en Arequipa, las alpacas, Nazca con drones, una carta sobre el plástico en Iquitos, las noticias falsas y una científica de la quinua (inventada y declarada como tal).

Las 50 preguntas se reparten así:

| Tipo | Preguntas |
| --- | --- |
| Sentido contextual | 7 |
| Extrapolación con condicional contrario | 7 |
| Título | 6 |
| Dato | 6 |
| Antónimo | 6 |
| Propósito | 6 |
| Incompatibilidad | 6 |
| Dónde se publicaría o a quién va dirigido | 5 |
| Inferencia | 1 |

Hay distractores de falso amigo (RV54) y de tiempo verbal (RV55). En los antónimos, el sinónimo lleva RV19 y el contrario de otro rasgo, RV21.

### 3. Textos discontinuos (2)

- **t132:** infografía del agua segura en casa. Pide completar una comparación entre dos grupos de métodos, con una pareja que tiene una mitad exagerada (RV62).
- **t133:** esquema de las tres formas de conocer. El distractor clave confunde una distinción con una oposición (RV44).

### Revisión a ciegas

Siete constructores y siete revisores, todos subagentes. El revisor resolvió cada texto sin claves: un script quitaba las claves y barajaba las alternativas. Después comparé sus respuestas con la clave.

**Coincidió en el 100 %** de las preguntas y de los pasos previos de los 33 textos. Aun así, cada vez que dejó una duda fuerte (en t107 p5 y t108 p5) la conté como fallo y el ítem se reescribió.

En la fase 2, con las claves a la vista, los revisores:
- reforzaron los distractores que caían por absurdos;
- corrigieron códigos;
- verificaron hechos, en parte con búsquedas en la web.

Cambios en los hechos:
- t121: la cita de Claverías (2000) no se pudo confirmar. Se cambió por Orlove, Chiang y Cane (2000, *Nature*) y el hecho quedó más general.
- t125: la fuente de las amunas se concretó (Ochoa-Tocachi y otros, 2019).
- t128: la cita de Nazca quedó completa (Sakai y otros, 2024, PNAS).
- t132: la dosis de lejía y la regla del día nublado se ajustaron a lo que dicen Minsa, Digesa y SODIS.

Algunos revisores confirmaron hechos de memoria, sin abrir la fuente: las leyes de los transgénicos (29811 y 31111), el aforo de Machu Picchu, Falchani y la bahía interior de Puno. Están anotados en sus `revision.notas`.

**Ojo con la dificultad:** que el revisor acierte todo dice que la clave es única, no que los ítems sean difíciles. Los distractores de dificultad 3 se reforzaron, pero hay que mirar los datos del piloto.

## Cambios en núcleos compartidos (mínimos y compatibles)

- **`nucleo/lectura.js`:**
  - Agrega el campo opcional `autores` (`[{id:'A', desde:0}, {id:'B', desde:N, firma?}]`), con las funciones `autores()` y `autorDe()`. Si el texto tiene autores, `oraciones()` le pone a cada una su `autor`.
  - Agrega el previo `atribuir` (opciones `A`, `B`, `ambos`, `ninguno`), que se califica con su tabla como `clasificar`.
  - La constante nueva es `ATRIBUCIONES`, y `validar()` revisa los autores y el uso de `atribuir`.
  - Un texto sin `autores` no cambia en nada.
  - Tiene 3 pruebas nuevas en `nucleo/lectura.test.js`.
- **`app/lectura.js`:**
  - Pone un rótulo («Texto A», con la firma) antes del primer párrafo de cada autor.
  - Muestra las opciones del previo `atribuir`.
  - Pone `lang` en el enunciado y las alternativas de una pregunta con `"idioma"`.
- **`app/estilos.css`:** agrega `.lec-autor`.
- **`app/app.js`:** en `vPapel`, el rótulo de cada texto del par.
- **`herramientas/papel-lectura.js`:** los autores van en `texto.autores` y se agrega la consigna del previo `atribuir`.
- **`contenido/razonamiento-verbal/banco.test.js`:**
  - Tipos de pregunta nuevos: `antonimo`, `controversia`, `postura`, `coincidencia`, `discrepancia`, `dialogo` y `sintesis`. Los de pares solo valen en un par.
  - Un par es argumentativo y lleva al menos un `atribuir`.
  - Los códigos fijos de `atribuir`: el otro autor es RV59, `ambos` ante uno solo es RV60, y uno solo ante `ambos` es RV61.
  - `idioma` en una pregunta solo vale dentro de un texto en ese idioma.
- **Informe** (`docs/investigacion/razonamiento-verbal-ideas-erroneas.md`): cinco códigos nuevos, todos hipótesis salidas de las trampas de `docs/clasificacion/trampas-admision-unmsm/`:
  - **RV59:** atribuir a un autor la postura del otro.
  - **RV60:** la tesis de uno como tema o como coincidencia.
  - **RV61:** ver desacuerdo donde coinciden.
  - **RV62:** pareja con una sola mitad correcta.
  - **RV63:** el condicional contrario que vuelve a confirmar lo negado.

  `codigos.json` está regenerado y `frases.json` tiene las cinco frases nuevas.
- **`docs/formato-lectura.md`:** sección 5.8 nueva.
- **`catalogo/cursos/razonamiento-verbal.json`:** `textos-dialecticos` en las plantillas de `textos-argumentativos-y-dialecticos`.

## Pruebas

- **`npm test`:** 4801 en verde y **1 en rojo esperado**: `app/datos/catalogo.json está al día`. Pasa en cuanto la integración corra `npm run catalogo`. Lo comprobé armándolo en local y devolviendo `app/datos/` a como estaba.
- **Playwright**, con `npm run dev` y el catálogo armado. Los scripts están en `rutinas/verbal-ab/`.
  - `pw.js` recorre un par entero a 390 y 1366 px. Comprueba:
    - los dos rótulos;
    - que el previo bloquea las alternativas;
    - que la cabecera no muestra ninguna alternativa;
    - que no hay desborde horizontal ni errores de JS.
  - `pw-en.js` comprueba `lang="en"` en las cinco preguntas de un texto en inglés nuevo.
  - Todo en verde.
- **Pegatina:** no aplica. Los módulos de lectura no tienen `index.html` propio; viven dentro de la app.

## Para la integración

1. `npm run catalogo` y subir `VERSION` en `app/sw.js`: cambian `app/lectura.js`, `app/app.js` y `app/estilos.css`, y hay un módulo nuevo.
2. `python3 herramientas/agregar_admision.py` (o el comando que regenere `docs/datos/admision-unmsm-tablas.md`), para que el resumen muestre 689 de 690 en verbal.
3. En `CLAUDE.md` y `docs/pendientes.md`: el módulo `textos-dialecticos` y el estado de verbal.

## Lo que queda

- **1 pregunta**, la de la imagen histórica con el texto (2024-I, área A, n.º 5). Hace falta un tipo de figura `imagen` en `nucleo/lectura.js`: un SVG o una foto propia con zonas citables.
- **Pocas en algunos tipos de pares:** extrapolación (3), síntesis (2), incompatibilidad (2) y compatibilidad (1). Las filas del CSV de esos tipos quedan cubiertas, pero conviene sumar unos 5 pares con esas preguntas.
- **Entrada y salida:** la prueba de entrada y salida del curso (t000a/t000b) no tiene un par A/B. Si se quiere medir la ganancia en pares, hace falta una pareja de pares A/B paralelos, sin paso previo, como las demás pruebas.
- **Hechos confirmados de memoria** en algunos textos (ver «Revisión a ciegas»): conviene una pasada con las fuentes abiertas antes del piloto.
