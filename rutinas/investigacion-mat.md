# Rutina de investigación de matemática: reporte

Sesión paralela de la rama `rutina/investigacion-mat` (creada desde `claude/awesome-wozniak-5etl1n`). La conversación principal integra. Tarea: buscar en la literatura qué errores de alumnos están documentados en siete temas cuyas escenas marcan todas sus opciones como «hipótesis nuestras», y proponer cambios de respaldo. **Esta rama no toca ningún `index.html` ni `motor.js`**: la principal aplica la tabla de abajo.

## 7 nov 2026 · Cónicas, polares, matrices, binomio, complejos, espacio y conteo de figuras

**Qué hice.** Siete subagentes de búsqueda, uno por tema, y un revisor que contrastó a ciegas cada cita y cada cifra con lo que el buscador muestra de su fuente. Las 17 correcciones del revisor se aplicaron a los borradores antes de juntarlos. Informe nuevo: [`docs/investigacion/matematica-avanzada-ideas-erroneas.md`](../docs/investigacion/matematica-avanzada-ideas-erroneas.md). Fuentes que no se pudieron leer completas: sección 5 de [`fuentes/por-conseguir.md`](../fuentes/por-conseguir.md).

**Límite que manda sobre todo lo demás.** La red de la sesión solo deja usar el buscador: ningún texto completo abrió (dergipark, funes.uniandes, Springer, ERIC, SciELO, arXiv, doi.org y los repositorios de tesis dieron «host no permitido», con WebFetch y con curl). Por la regla del encargo, **ningún código llega a «documentado»**: lo mejor que hay es «parcial», con cifra de resumen o sin cifra.

**Resultado.** De unos 220 errores revisados, 8 suben de hipótesis a parcial. Ninguno sube a documentado. Los demás siguen como hipótesis, muchos con un estudio «vecino» anotado en el informe que no alcanza para cambiar el respaldo.

| Tema | Códigos | Parcial | Hipótesis | Lo más cercano a un dato |
| --- | --- | --- | --- | --- |
| Cónicas | CO1–CO37 (sin CO36) | 0 | 36 | Sudihartinih y Purniati (2020): lado recto, asíntotas y focos de la hipérbola, sin cifras |
| Coordenadas polares | CP1–CP27 | 1 | 26 | Habre (2017): el sentido de cambio cuesta más con r negativo |
| Matrices | MT1–MT34 | 1 | 33 | Aygör y Özdağ (2012): «si A = kB, det A = k det B» |
| Binomio de Newton | BN1–BN27 | 2 | 25 | Batanero, Navarro-Pelayo y Godino (1997): error de orden; Begué y otros (2020): equiprobabilidad |
| Números complejos | CX1–CX7, CX10–CX35 | 2 | 31 | Smith, Zwolak y Manogue (2019): triángulo de referencia en vez de circunferencia |
| Geometría del espacio | 37 claves del motor | 1 | 36 | Kondo y otros (PME 2013, 2014): el ángulo BGD del cubo se responde 90° |
| Conteo de figuras | 33 claves del motor | 4 (3 ya lo estaban) | 29 | Ben-Chaim y otros (1985); Battista y Clements (1996) |

## Tabla de cambios de respaldo propuestos

Solo las filas que cambian. Todo lo que no está aquí se queda como está. Las líneas son de `index.html` en la rama base.

| Plantilla | Línea | Id en la escena | Ahora | Propuesto | Por qué (detalle en el informe) |
| --- | --- | --- | --- | --- | --- |
| coordenadas-polares | 534 | `CP3-ignora-el-signo-de-r` | hipotesis | **parcial** | Habre (2017), IJMEST 48(1): coordinar el sentido de cambio cuesta más «sobre todo cuando r es negativo». Solo resumen, sin cifra, y no describe la forma concreta (\|r\|; θ). |
| matrices | 885 | `MT4-det-kA-lineal` | hipotesis | **parcial** | Aygör y Özdağ (2012), 60 universitarios turcos: «si A = kB, entonces det A = k det B», como ejemplo de confundir la matriz con su determinante. Cita de terceros, sin porcentaje. |
| binomio-newton | 531 | `BN12-variacion-ordena-las-b` | hipotesis | **parcial** | Es el error de orden de Batanero, Navarro-Pelayo y Godino (1997), 720 alumnos de 14 y 15 años, el mismo que AR17. Solo resumen. |
| binomio-newton | 964 | `BN21-casilleros-iguales` | hipotesis | **parcial** | Es el sesgo de equiprobabilidad (Lecoutre, 1992; Begué y otros, 2020; AR20 del informe de aritmética). No hay estudio con el tablero de Galton: la correspondencia es por analogía. |
| numeros-complejos | 537 | `CX17-arctan-sin-cuadrante` | hipotesis | **parcial** | Smith, Zwolak y Manogue (2019), Phys. Rev. PER 15: fallan los que usan la trigonometría del triángulo donde va la de la circunferencia. Solo resumen; la forma del error es inferida. |
| numeros-complejos | 539 | `CX18-angulo-de-referencia` | hipotesis | **parcial** | La misma fuente y el mismo mecanismo que CX17. |
| geometria-espacio | 1004 | `ESP-caras-perpendiculares` (solo en la pregunta del ángulo AFH) | hipotesis | **parcial** | Kondo y otros (PME 2013, 2014): en la tarea del ángulo BGD del cubo (el mismo caso, 60°), los alumnos de nivel bajo dibujan la red y dicen 90°. En un fragmento de tabla, 8 respuestas son 90° (total no confirmado). |
| razonamiento-figuras | — | (`rectangulosCuadricula.sinCuadrados`) | — | sin cambio | El motor tiene el error, pero la escena no lo ofrece como opción. Si se agrega, va como parcial (Fujita y Jones, 2007: 158 futuros profesores de Escocia, 13 % acepta que el cuadrado es rectángulo, cita de terceros). |

**Textos de fuente que conviene actualizar** (los `<p class="fuente">` que dicen «no hay informe»): `conicas/index.html:534` (`FUENTE`), `coordenadas-polares/index.html:521` (`hipT`), `matrices/index.html:563` (`fuenteHip`), `binomio-newton/index.html:506` (`HIP`), `numeros-complejos/index.html:481` (`hip`) y `geometria-espacio/index.html:296` (`fuenteHip`). Ya existe un informe, pero las opciones **siguen siendo hipótesis**; solo cambia el motivo: «se buscó y no hay estudios con datos sobre este error». Para las 7 filas que pasan a parcial hace falta un texto de fuente propio, con la cita de la tabla.

**Comentarios de motor desactualizados** (los arregla la principal):

- `matrices/motor.js:14` dice «MT1…MT32 (hipótesis…)», pero el motor ya usa MT33 y MT34; después del cambio, MT4 es parcial.
- `numeros-complejos/motor.js:20` dice «CX1…CX34», pero existe CX35; CX8 y CX9 no existen.
- `conicas/motor.js:96`, `coordenadas-polares/motor.js:34`, `binomio-newton/motor.js:23` y `geometria-espacio/motor.js:20` dicen que no hay informe: ahora apuntan a `docs/investigacion/matematica-avanzada-ideas-erroneas.md`.

## Avisos

- **GE13 en el informe de geometría.** `docs/investigacion/geometria-ideas-erroneas.md` da GE13 (Ben-Chaim y otros, contar caras o solo los cubos visibles) como «documentado», por la regla de dos fuentes que coinciden. Con la regla de este encargo (documentado solo con texto completo leído), bajaría a parcial, que es como ya lo usa `razonamiento-figuras`. No lo cambié: es decisión de la principal.
- **Errores de la literatura que el motor no tiene.** En las pilas de cubos: «cubos visibles × 2», «caras visibles × 2» y contar dos veces los cubos de aristas y esquinas (Ben-Chaim y otros; Battista y Clements). Podrían ser opciones nuevas de `razonamiento-figuras`.
- **Ningún dato peruano.** No apareció ningún estudio peruano con cifras en estos siete temas, ni ítems liberados de PISA, TIMSS o ECE que los toquen.
- **Lo que movería más respaldos:** abrir en la red de la sesión dergipark.org.tr, funes.uniandes.edu.co, link.springer.com, files.eric.ed.gov, eprints.soton.ac.uk y doi.org, o que Gerson pase los PDF de prioridad A de `fuentes/por-conseguir.md`.

**Pruebas.** `npm test`: 4395 en verde antes del push. Esta rama solo agrega documentos.
