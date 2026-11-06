# Rutina de razonamiento verbal: reporte

Cada ejecución hace la primera pieza que falte:

1. [x] Informe `docs/investigacion/razonamiento-verbal-ideas-erroneas.md`
2. [x] Diseño del formato lectura, `docs/formato-lectura.md`
3. [ ] Banco de textos propios en `contenido/razonamiento-verbal/` (0 de 30)
4. [ ] Guía para profesores, `docs/guia-profesores.md`

---

## 6 nov 2026 · Pieza 1: el informe

**Qué hice.** Escribí el informe de ideas erróneas de razonamiento verbal con la misma estructura de los otros de `docs/investigacion/` (resumen, de dónde salen los datos, catálogo con respaldo, lo que no tiene respaldo, propuesta, huecos y fuentes). Son 32 errores, de RV1 a RV32:

- Idea principal (RV1 a RV4), inferencia, compatibilidad y extrapolación (RV5 a RV12), intención del autor (RV13 y RV14).
- Analogías (RV15 a RV17), sinónimos y antónimos en contexto (RV18 a RV21), término excluido (RV22), oraciones incompletas (RV23).
- Conectores y referentes (RV24 a RV27), plan de redacción y eliminación de oraciones (RV28 a RV32).

Trae además una sección de contexto peruano (PISA 2018 y 2022, evaluación muestral de 2.º de secundaria, ingresantes de la UNA Puno) que va a servir para la guía de profesores, y una tabla de qué distractores usar por tipo de pregunta, que es la base de la pieza 2.

**Lo más importante, de frente:** ningún error llegó a "documentado". Lo mejor respaldado (detalle y "demasiado general" en idea principal, eco literal, asociación en analogías, contracausal leído como causal, último sustantivo como referente) es "parcial": hay estudios, pero de otra población (japoneses leyendo en inglés, niños) o sin el porcentaje a la vista. Plan de redacción, eliminación de oraciones, extrapolación, negación y términos absolutos son hipótesis. No apareció ningún estudio de distractores con postulantes peruanos. Eso lo tiene que medir la app en el colegio.

**Archivos:** `docs/investigacion/razonamiento-verbal-ideas-erroneas.md` (nuevo) y este reporte.

**Pruebas:** `npm test`, 535 en verde (no toqué código).

**Subagentes:**
- Tres investigadores en paralelo (comprensión lectora y datos peruanos; léxico y analogías; conectores, cohesión y ordenamiento). Ninguno pudo abrir originales: la red de la sesión no resuelve umc.minedu.gob.pe, scielo, redalyc, ncbi, eprints.whiterose, boris.unibe ni nite.org.il. Todo sale de resúmenes del buscador.
- Un revisor aparte, que verificó 12 citas por su cuenta y revisó etiquetas, ejemplos y lenguaje. Apliqué lo que encontró: el 50,4 % de PISA 2022 no se confirmó (quedó "cerca del 50 %"); Ehrlich y otros estaba mal puesto en RV9 (pasó a RV27); RV6 bajó a hipótesis; la cifra 10 % y 28 % de Yuill y Oakhill no tenía fuente identificable y la saqué; "el último personaje mencionado" no está en el resumen de Borzone y quedó marcado así; corregí autora y revista de Valero-Ancco, volumen de Ludewig, número de informe de McClure y Steffensen; y rehíce siete ejemplos ambiguos o con errores (quinua en suelo salino, totora y turismo, la papa "europea", alpaca y fibra, helada y escarcha, instrumentos andinos, "levantar la huelga").

**Pendiente:**
- Confirmar cifras con los originales cuando la red lo permita (lista en "Huecos" del informe). Si Gerson quiere que se haga, hay que permitir en la red del entorno: umc.minedu.gob.pe, scielo.org.ar, scielo.org.mx, redalyc.org, eldorado.tu-dortmund.de, journals.sagepub.com, core.ac.uk y nite.org.il.
- Siguiente ejecución: pieza 2, `docs/formato-lectura.md`.

**Pedidos para la integración** (no los toqué, son de la conversación principal):
- `catalogo/cursos/razonamiento-verbal.json`: llenar `"investigacion"` de las unidades con `docs/investigacion/razonamiento-verbal-ideas-erroneas.md` (todas menos `textos-discontinuos`, `lectura-en-ingles`, `definiciones`, `tipologia-textual`, `resumen-y-sintesis` y `textos-filosoficos-y-cientificos`, que el informe no cubre o cubre solo de paso).
- `docs/pendientes.md`, fila "ra2 y pl4": cambiar "Sin informe" por el nombre del informe.
- `CLAUDE.md`, sección Historia: agregar el informe de razonamiento verbal a la lista de informes.
- `fuentes/por-conseguir.md`: agregar Terao e Ishii (2020), Ludewig y otros (2023), Zunino (2016), Borzone (2005), Cain y Nash (2011), NITE e239 y los informes de la UMC para el docente de secundaria.

---

## 6 nov 2026 · Pieza 2: el diseño del formato lectura

**Qué hice.** Escribí `docs/formato-lectura.md`:
- la pantalla (celular primero, con el texto plegado arriba y una hoja que sube para releer; dos columnas en el laboratorio);
- el **paso previo** antes de las alternativas, de seis tipos: marcar oración, clasificar una afirmación, elegir la relación de un conector, la relación de una analogía con su sentido, el propósito del autor y ordenar tarjetas en el plan de redacción. Cada uno trae en el JSON la respuesta aceptada y un código RV por respuesta incorrecta, así que calificar es buscar en una tabla;
- la explicación pintada en el texto con tres colores de la familia de variables;
- el **formato JSON del banco**, con un texto de ejemplo completo (t001, "El frío que conserva", 173 palabras, 3 preguntas);
- los eventos de medición y cómo lo cargaría un módulo, paso por paso.

También agregué **RV33** al informe ("se le atribuye al autor una postura que no toma", hipótesis), porque el ejemplo la necesitaba y no existía.

**Lo que decidí, de frente:**
- El paso previo se registra como evento propio (`tipo: 'previo'`), **no como predicción**: si no, se sumaba al acierto y contaba dos veces el mismo error.
- En `opcion` va la posición de la alternativa en el banco, no la letra, porque las letras se barajan para cada alumno.
- Las pruebas de entrada y salida van sin paso previo y con semilla fija.

**Pruebas:** `npm test`, 762 en verde (no toqué código). Validé el JSON del ejemplo con un guion: es válido, los códigos existen, las referencias apuntan a oraciones reales, no hay códigos repetidos y la correcta nunca es la más larga.

**Subagentes:**
- Un revisor del diseño contra el código real. Encontró cuatro problemas graves, todos corregidos:
  - el banco en `/contenido/` no se serviría sin conexión, porque `sw.js` solo atiende `app`, `plantillas` y `nucleo`;
  - el paso previo contaminaba el acierto;
  - la letra registrada no se puede comparar entre alumnos;
  - el esquema del paso previo estaba incompleto.
- Un revisor que resolvió el ejemplo a ciegas. Acertó todo, pero vio que la correcta era la más larga (agregué la regla 10 del banco) y que la idea principal admitía dos oraciones (ahora se aceptan las dos). Corregí los datos del chuño (secado al sol, chuño negro) y cambié "malograrse" por "echarse a perder".
- Una segunda revisión del documento corregido. Confirmó que lo grave quedó resuelto y encontró huecos menores, también corregidos:
  - faltaban las explicaciones del paso previo (ahora están, más `frases.json` por código);
  - los roles de "marcar oración" no cerraban;
  - las analogías no tenían relaciones inversas;
  - tres códigos del ejemplo estaban mal puestos;
  - la vista de papel necesita un ajuste.

**Pendiente:**
- La pieza 3, el banco de textos. La primera ejecución arranca con t001 (revisión incluida), más 5 textos nuevos, el `indice.json`, `frases.json` y `banco.test.js` con las 12 reglas de la sección 5.5.
- `codigos.json` lo genera un guion en `herramientas/`, que está fuera de mi alcance. Mientras no exista, `banco.test.js` puede leer los códigos directo del informe.

**Pedidos para la integración:** los de la sección 8 de `docs/formato-lectura.md`. Los más importantes:
- `contenido` en la expresión del `fetch` de `app/sw.js`;
- `REQUERIDOS.lectura` en `catalogo.test.js`;
- la rama de lectura en `construir-catalogo.js` (antes de crear la ficha);
- `nucleo/lectura.js` y `app/lectura.js`;
- aceptar el respaldo `parcial`;
- unidades para término excluido y oraciones incompletas;
- ampliar el alcance de la rutina a `herramientas/codigos-verbal.js`, si se quiere que lo escriba ella.

**Red:** Gerson no pudo agregar los dominios de revistas al entorno. Probé Google Drive como alternativa (lo usa `fuentes/descargar.sh`), pero también está bloqueado en este entorno. Las cifras del informe siguen "por verificar".
