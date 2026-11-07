# Rutina de razonamiento verbal B: reporte

7 de noviembre de 2026 · Rama `rutina/verbal-b`, creada desde `claude/awesome-wozniak-5etl1n`.

**Encargo:** dar módulo a las 6 unidades de razonamiento verbal que no lo tenían, en este orden: tipología textual, resumen y síntesis, textos discontinuos, texto y contexto, textos filosóficos y científicos y lectura en inglés.

**Resultado:** las 6 tienen módulo. Ahora las 18 unidades del curso tienen módulo. Son 24 textos nuevos (t031 a t054), 4 por unidad, con 91 preguntas y 33 pasos previos. Todos se revisaron a ciegas.

`npm test` da **4152 en verde** (antes eran 4126).

## Commits

| Commit | Qué |
| --- | --- |
| d795fa9 | Infraestructura del formato lectura: un índice por módulo, figuras para los discontinuos, idioma y tipos de pregunta nuevos; `sw.js` en v116 |
| 44356fc | Códigos RV41 a RV56 en el informe, con sus frases |
| ec784a2 | RV57 y RV50 ampliado (propuestos por los revisores) |
| 9e7feb7 | Tipología textual |
| b1f35fb | Resumen y síntesis |
| efa80fd | Textos discontinuos |
| de9564f | Texto y contexto |
| 2122042 | Textos filosóficos y científicos |
| 66e7abf | Lectura en inglés |
| (último) | Documentación (`docs/formato-lectura.md` 5.7, LEEME) y este reporte |

## Cómo quedó armado

**Un módulo por unidad**, como pedía el encargo. Cada uno tiene su ficha en `plantillas/<id>/plantilla.json`, con formato `lectura`, estado `borrador` y `papel: null`. Su banco es `contenido/razonamiento-verbal/indice-<id>.json`. Los módulos son:

- `tipologia-textual`, «¿Qué clase de texto es?»
- `resumen-sintesis`, «Resumir y sintetizar»
- `textos-discontinuos`, «Tablas, gráficos e infografías»
- `texto-contexto`, «Quién habla, a quién y para qué»
- `textos-filosoficos-cientificos`
- `lectura-ingles`, «Reading in English»

No hizo falta tocar `construir-catalogo.js`: ya armaba la lista de archivos desde el índice al que apunta cada ficha. Los índices nuevos no llevan entrada ni salida; la prueba de entrada y salida del curso sigue siendo t000a y t000b de `lectura-verbal`. Todas las preguntas de un módulo llevan la unidad del módulo. Así se cumple la prueba «un módulo de lectura cubre justo las unidades de su banco».

### Cambios de código (mínimos y con pruebas)

**`nucleo/lectura.js`** suma las figuras de los textos discontinuos:
- Admite tres tipos de figura: `tabla`, `barras` y `recuadros`.
- Cada parte de una figura (fila, barra o recuadro) tiene su id, y la evidencia y el origen pueden apuntar a ella.
- Funciones nuevas: `figuras`, `elementos`, `referencias`, `etiquetaRef` y `citas`.
- `validar` revisa la forma de cada figura y que los ids no se repitan con los de las oraciones.
- Hay dos pruebas nuevas en `nucleo/lectura.test.js`.

**`app/lectura.js` y `app/estilos.css`:**
- dibujan la tabla, las barras horizontales desde 0 y los recuadros;
- pintan sus partes con los colores de evidencia, distractor e idea, con borde y fondo en vez de subrayado;
- las citan debajo de la explicación;
- ponen `lang="en"` en los textos en inglés.

Lo probé con Playwright a 390 × 844 en claro y a 1366 × 768 en oscuro: sin errores de consola ni desbordes, la evidencia se pinta en la tabla y en las barras, y los 6 botones aparecen en la página del curso.

**`banco.test.js`:**
- valida todos los `indice*.json`, y un texto va en un solo índice;
- acepta los tipos de pregunta nuevos (`tipo-de-texto`, `estructura`, `resumen`, `titulo`, `dato` y `contexto`) y el previo `marcar-oracion` en resumen y título;
- cuenta las palabras de las figuras, con un mínimo de 120 para un discontinuo y de 100 para un texto en inglés;
- exige que lleven figuras los discontinuos y solo ellos;
- corre `validar` también sobre los textos.

**`app/sw.js`:** VERSION pasó de v115 a v116, porque cambió la cáscara.

**Documentación:** `docs/formato-lectura.md` tiene una sección nueva, la 5.7, y lo mismo, en corto, `contenido/razonamiento-verbal/LEEME.md`.

## Los textos

| Unidad | Textos | Preguntas / previos | Códigos nuevos que usa |
| --- | --- | --- | --- |
| Tipología textual | t031 El manantial de don Teodoro (argumentativo que empieza con un caso), t032 La reina de los Andes (descriptivo), t033 Del sismo al aluvión: por qué cayó Yungay (expositivo de causa y efecto), t034 Arreglar antes que botar (argumentativo con objeción) | 13 / 8 | RV41, RV42, RV57 |
| Resumen y síntesis | t035 La fibra que salvó a la vicuña, t036 La canoa de Rolando (relato), t037 Los que separan lo que botamos, t038 El agua que sobra | 14 / 4 | RV43, RV44 |
| Textos discontinuos | t039 Los préstamos de la biblioteca (tabla de doble entrada), t040 ¿Crecieron todos los talleres? (barras), t041 Si la tierra tiembla (infografía), t042 Más luz en los parques (texto mixto, dificultad 3) | 13 / 5 | RV45, RV46, RV47, RV48 |
| Texto y contexto | t043 El sábado, el mercado se pone guapo (comunicado), t044 Un mensaje para el tío Julián, t045 El plástico del fitotoldo (discurso), t046 Lo que queda en el puesto (nota de relevo) | 17 / 4 | RV49, RV50, RV51 |
| Filosóficos y científicos | t047 ¿Qué es un amigo?, t048 ¿Justa porque la votamos? (dificultad 3), t049 El reloj que se apaga al morir (carbono 14), t050 Un centímetro de arcilla (dificultad 3) | 19 / 8 | RV52, RV53, RV56 |
| Lectura en inglés | t051 Rosa and the Clay, t052 The Train to Machu Picchu, t053 A Morning at Belén Market, t054 The Sun in Arequipa | 15 / 4 | RV54, RV55 |

### Códigos nuevos

Agregué 17 códigos al informe, de RV41 a RV57. **Los 17 son hipótesis**, cada uno ligado al error con algún dato del que sale:

- RV41: tipo de texto por un rasgo de superficie
- RV42: función de una parte confundida
- RV43: resumen como lista
- RV44: síntesis que cambia la relación entre las ideas
- RV45: dato de otra fila o barra
- RV46: diferencia absoluta tomada por relativa
- RV47: lo que va junto leído como causa
- RV48: título de la figura y no sus datos
- RV49: mensaje al pie de la letra
- RV50: emisor o destinatario confundido con quien se cita
- RV51: destinatario por el tema
- RV52: hipótesis tomada por hecho
- RV53: objeción tomada por tesis
- RV54: falso amigo en inglés
- RV55: tiempo o modo del verbo inglés
- RV56: concepto respondido con un ejemplo
- RV57: tipo o estructura por un pasaje que no organiza el texto

RV57 lo propuso el revisor de tipología, y RV50 se amplió al destinatario por pedido del revisor de contexto. `codigos.json` se regeneró y `frases.json` tiene una frase por cada código.

## Subagentes (método de cuatro manos)

- **6 constructores**, uno por unidad, con un brief común. El brief no está en el repo: estaba en el scratchpad de la sesión y no sobrevive al contenedor. Cada constructor escribió los 4 textos con `revision: null` y después aplicó las correcciones.
- **6 verificadores a ciegas que también revisaron el contenido.** Primero resolvieron una versión sin claves, con las alternativas barajadas, y guardaron sus respuestas. Después compararon con las claves y revisaron códigos, hechos, lenguaje y la regla 5.
  - **Tipología:** coincidió en todo. Hallazgos:
    - RV1 estaba mal usado en cinco distractores de tipo y estructura; de ahí salió RV57.
    - En t033, «narrativo» era casi defendible: cambié el título y la alternativa.
    - Algunos datos no tenían fuente firme (la puya, los eucaliptos): se suavizaron o se quitaron.
  - **Resumen:** coincidió en todo. En t038, la oración 5 hacía incoherente la clave y el previo aceptaba una oración parcial: se corrigieron las dos cosas.
  - **Discontinuos:** 17 de 18.
    - **Falló el previo de t040 p1, y tenía razón:** comparar dos barras es «se deduce», no «lo dice». La sonda se reescribió.
    - Había nombres ficticios que existen como lugares reales (Puerto Alegre, Villa Rica, El Olivar): se quitaron.
    - La frase «ni bajes corriendo por las escaleras» no se pudo confirmar en Indeci y se cambió por lo confirmado.
  - **Contexto:** 20 de 20.
    - «Ponerse guapo» quedó a propósito: en el Perú se entiende como «enojarse», y ese es el distractor más útil.
    - Se aclaró un referente en t046 y t046 bajó a dificultad 2.
  - **Filosóficos y científicos:** coincidió en todas las preguntas y dudó en el previo de t048.
    - La oración 11 de t048 se rehízo para que junte la tesis.
    - La sonda de t048 p2 regalaba la respuesta y se cambió.
    - En t050, p4 repetía p1 y p5 y se cambió.
    - En t047, la definición chocaba con la oración 9.
    - La correcta era la segunda más larga en 17 de 19 preguntas; ahora lo es en 8.
  - **Inglés:** coincidió en todo. Se ajustó la duración del tren, la ubicación de Bajo Belén, el uso de «kiln» y un previo.
- **Yo:** armé la infraestructura, decidí qué correcciones aplicar y cómo, revisé de nuevo los ítems que cambiaron de fondo (t048 p2 y t050 p4), hice las pruebas con Playwright e hice la integración por unidad.

Un tropiezo: el constructor de filosóficos regeneró sus JSON mientras yo los tenía apartados, y se colaron en el commit de los códigos. Lo corregí con un amend antes de empujar.

## Dudas y pendientes para Gerson

1. **Ningún error nuevo tiene dato.** RV41 a RV57 son hipótesis y se confirman con los datos del colegio.
2. **Dificultad 3.** Tipología, resumen y contexto quedaron sin textos de dificultad 3: los revisores bajaron cuatro textos a 2 porque se resolvían rápido. Si se quieren textos tipo UNI en esas unidades, hay que escribir uno por unidad.
3. **Hechos por confirmar:**
   - t041: la fuente del IGP, Tavera y Buforn, quedó «por confirmar las páginas» (puede ser el artículo de 2001 y no el de 1998).
   - t053: la fuente de Belén (Britannica, «Iquitos») no está confirmada.
   - t035: la cifra del censo de vicuñas de 2012 se vio en fuentes secundarias.
   - t037: lo que pasa por los recicladores quedó dicho de forma general, sin cifra.
4. **RV6 en «lo dice» de un previo clasificar.** El revisor de tipología notó que 6 textos viejos del banco usan RV6 cuando el alumno responde «lo dice» ante algo que se deduce. La frase de RV6 («Eso está dicho en el texto tal cual…») describe lo contrario de lo que pensó el alumno. La app ya lo neutraliza (`FRASE_NO_APLICA` en `clasificar` / `lo-dice`), pero el código registrado no es el error. Propongo revisarlo en la rutina verbal original. No lo toqué, porque está fuera de mi encargo.
5. **Unidad de algunas preguntas.** Algunas son de inferencia o de idea principal pero van con la unidad del módulo (por ejemplo, la inferencia de t032 está en tipología). Así lo pide la prueba de cobertura. Si la medición necesita separar por habilidad, se puede leer el campo `tipo` de la pregunta.
6. **Lápiz y papel.** Como `lectura-verbal`, los seis módulos quedan en `borrador` con `papel: null`, hasta que exista `herramientas/papel-lectura.js` (pendiente de antes).
7. **`sw.js`.** Lo subí a v116. Si otra rama también lo subió, en la integración hay que dejar el número mayor más uno.

## Pedidos para la integración

- Integrar `rutina/verbal-b`. Ya corrí `npm run catalogo`, así que `app/datos/catalogo.json` está al día.
- `CLAUDE.md` y `docs/pendientes.md`:
  - el curso tiene módulo en sus 18 unidades;
  - hay seis módulos de lectura nuevos;
  - los códigos van hasta RV57;
  - hay que sumar la línea de esta rutina a la Historia.
- En el catálogo, `investigacion` de las 6 unidades puede apuntar ahora al informe de razonamiento verbal (hoy cuatro están en `null`).
- La hoja de ruta (`docs/hoja-de-ruta.json`), si tiene una tarea para estas unidades.
