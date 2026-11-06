# Rutina de razonamiento verbal: reporte

Cada ejecución hace la primera pieza que falte:

1. [x] Informe `docs/investigacion/razonamiento-verbal-ideas-erroneas.md`
2. [ ] Diseño del formato lectura, `docs/formato-lectura.md`
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
