# Rutina cierre-100: reporte

La rama `rutina/cierre-100` sale de `claude/awesome-wozniak-5etl1n`. Trabajo del 12 nov 2026. El objetivo era cerrar las 35 preguntas de `docs/datos/admision-unmsm.csv` que no estaban en «si» (sin contar las repetidas).

Se usó la regla 5 nueva. Se bajaron los 25 PDF de esas preguntas (`fuentes/descargar.sh`; no se versionan) y cada constructor trabajó con la página oficial a la vista. Donde la pregunta oficial sirve tal cual, hay una semilla que la reproduce, con la cita de universidad y periodo; la solución y la figura se rehicieron siempre.

Método, el de rm-procesos: un constructor por grupo de generadores y después un verificador ciego por pieza. El verificador resuelve con su propio script, solo con el enunciado y la figura (en PNG cuando la figura era difícil de leer en SVG). Las discrepancias las revisó a mano la sesión.

## Resultado

**35 de 35 filas quedan en «si»** (cobertura y módulo actualizados en el CSV; la nota de cada fila dice `cierre-100: <módulo>`).

| Pieza | Commit | Filas | Generador o módulo | Verificación ciega |
| --- | --- | --- | --- | --- |
| Física: masa efectiva del resorte | e2a8c89 | 1 | `energia-potencia` 0.2.0 (subtipo `resorte/masa-efectiva`) | 3/3 |
| RM: fichas de 5, conteo con giros y región de arcos | 958635e | 3 | `rm-fichas` 0.2.0 | 7/7 |
| RM: latas, fichas de dos caras, cometa y vasos | e4478d6 | 5 | `rm-planteo` 0.2.0 | 14/14 (1 error del verificador, revisado) |
| Verbal: figura «imagen» y texto t134 | f295db1 | 1 | `textos-discontinuos` (núcleo de lectura y app) | revisor: aprobado, 5/5 |
| RM: retraso, jornada, tramos, dirección, impresos y bucles | 58831d6 | 6 | `rm-relojes`, `rm-rumbos`, `rm-diagramas-flujo` 0.2.0 | 25/25 (4 errores del verificador, revisados) |
| Química: las 8 preguntas | 9e2738f | 8 | `quimica-conceptos` 0.2.0, `molecula-grande` 0.2.0 | 90 proposiciones, 18 problemas y 52 cálculos; coinciden todos (1 error del verificador) |
| RM: color con suma, palomar con «ya», cajas, peso combinado y dados | 5356d17 | 5 | `rm-certezas`, `rm-balanzas`, `rm-deduccion` 0.2.0 | 14/14 |
| RM: tubo con bocas y lecturas doble y en malla | 0aa406f | 4 | `rm-movimientos`, `rm-lectura-palabras` 0.2.0 | 8/8 |
| RM: tablero de triángulos y alambre soldado | último commit | 2 | `rm-cortes` 0.2.0 | tablero 2/2; alambre 3/3 en la segunda vuelta |

«Error del verificador» quiere decir que el verificador se equivocó y el generador tenía razón; se comprobó a mano en cada caso:
- **Vasos 171 (24 × 11, d = 4):** caben 3 filas intercaladas, 4 + 2·2√3 = 10,93 ≤ 11.
- **Jornada en relojes:** el verificador respondió lo que falta del día y no lo que falta de la jornada, que es justo la trampa RMP104. El solucionario oficial de 2024-II #18 da lo mismo que el generador.
- **Suma de cifras de 9990:** son 27, no 36.
- **fen9:** la proposición «el O del ·OH completa el octeto» es falsa.

## Decisiones que conviene saber

- **No se movieron semillas verificadas.** Cada generador elige sus tipos nuevos con un azar aparte, así que los casos viejos siguen dando lo mismo. Hay dos excepciones:
  - **rm-relojes, rm-rumbos y rm-diagramas-flujo:** algunas semillas con caso cambiaron de tipo (relojes 14 y 42; rumbos 0, 5, 9, 11, 27 y 48; diagramas 2 y 9). Se regeneraron y se verificaron a ciegas de nuevo.
  - **quimica-conceptos:** pasó lo mismo con entrada-1, entrada-2, salida-3, 4, 6 y 22, que también se verificaron otra vez.
- **Dónde salen los tipos nuevos** (es distinto en cada grupo):
  - En rm-certezas, rm-balanzas y rm-deduccion solo salen en práctica (semillas de texto que no son `entrada-`/`salida-`) y en las numéricas desde 400.
  - En rm-movimientos, rm-lectura-palabras y rm-cortes solo salen en semillas de texto.
  - En los demás generadores, en una fracción de todas las semillas.
  - Si se quieren en las pruebas de entrada y salida, hay que decidirlo, porque eso mueve semillas fijadas.
- **Física, masa efectiva:** el generador la había dejado fuera a propósito («un supuesto que el enunciado no da»). El enunciado oficial sí la da (3m), así que se incluyó. La clave de la academia (A) ignora ese dato; con él sale B, v·√(4/5). El papel p10 trae la pregunta oficial.
- **rm-planteo, vasos:** el enunciado limita la comparación a dos disposiciones (filas alineadas contra intercaladas). No se garantiza el empaquetamiento óptimo general, y así lo dice.
- **rm-planteo, latas:** las tres semillas de `latas` dan 2 golpes, así que hay poca variedad de respuestas. No hay semilla oficial de latas, porque la figura no se pudo transcribir con certeza.
- **Cumpleaños con «ya»:** cuenta 366 fechas. La alternativa con 365 es a propósito: es la trampa del 29 de febrero de la pregunta oficial.
- **Química:**
  - **Pourbaix:** los diagramas (aluminio y un metal inventado X) son simplificados y están rotulados así.
  - **Moléculas:** la cuenta de metilos toma «metilo» como CH₃ unido a carbono (sin el del metoxilo). La bilirrubina usa la convención de academia de un par libre por N.
  - **Fenton:** fen6 y fen12 se reformularon para hablar de cómo se escribe la reacción (flecha simple) y no de si es reversible.
  - **Cita visible:** la cita de las preguntas oficiales de química va en comentarios del código, no en el texto que ve el alumno.
- **Verbal:** el tipo de figura nuevo es `imagen`: un SVG propio validado (sin script, `on…=`, `foreignObject` ni colores fijos) con `partes` que se pueden citar como recuadros. t174 (antes t134; el Corpus del Cusco) es un texto y un dibujo propios, no los del examen. Por el revisor, «estandarte» pasó a «emblema». Queda opcional acercar el tambor al número 4 del dibujo.
- **Alambre (rm-cortes):** el primer verificador leyó cada corte como una recta infinita. Así, dos estructuras de triángulos no tenían solución y la rejilla daba 2. El generador modela un tramo de sierra (un segmento) que no va a lo largo de un alambre, con el que la oficial da 4, igual que la clave. Se corrigió el enunciado para que diga ese modelo, y la segunda verificación ciega dio 3/3 (rejilla 3, triángulos 4, oficial 4), con cota inferior.

## Lo que toca a la integración

- `npm run catalogo` y subir `VERSION` en `app/sw.js`: cambió la cáscara (`app/lectura.js`, `app/app.js`, `app/estilos.css`) y subieron las versiones de 15 módulos. Sin eso, `npm test` da 7833 de 7834, y la única falla es «catalogo.json está al día».
- Los códigos nuevos están en `docs/investigacion/codigos-rm-procesos.md` (RMP90 a RMP139). Los AQ- de química están en el `ERRORES` de `quimica-conceptos`, todos «hipótesis».
- En el CSV quedan 10 filas de diagramas de flujo con `unidad = fuera-del-catalogo:diagramas de flujo`, de la rutina anterior. Solo se corrigieron las dos de esta rutina a `razonamiento-matematico.diagramas-de-flujo`.
- `docs/datos/admision-unmsm-tablas.md` no se regeneró.

## Para decidir (Gerson)

- ¿Se muestra al alumno la cita «UNMSM <periodo>» en los problemas que reproducen una pregunta oficial? En RM va en `datos` del problema; en química, solo en el código.
- La lupa de metilos existe en el motor de `molecula-grande`, pero no en la escena. Ponerla pide un color nuevo (`--c-met`) en `docs/diseno.md`.
- En `rm-fichas`, para meter los problemas nuevos de papel (el máximo es 10) se quitaron p2, p7 y p10, y la malla se quedó sin problema de papel.

## Pendientes

- El generar de `combinado` (rm-balanzas) tarda de 50 a 400 ms, y el de `puntajes` (rm-deduccion) de 150 a 300 ms: conviene mirarlos en gama baja.
- Los SVG nuevos de rm-cortes, rm-lectura-palabras y rm-movimientos se miraron en PNG, no en la app; falta pasarlos por Playwright a 390×844 en oscuro.
