# Fase 4: ejemplos resueltos (pestaña «Ejemplos»)

> Las unidades de teoría no se abren enteras: `node herramientas/mapa-unidad.js <UNIDAD>` da el mapa y cada tramo
> (docs/metodo/unidad/LEEME.md, «Leer sin gastar contexto»).
>
> Trabajas en /home/user/mesa-de-estudios. Lee CLAUDE.md, docs/plan-calidad.md §3, docs/teoria.md 4h y
> docs/molde-unidad.md (§3 ejemplos, §4 datos, §5 notación, §5b colores, §6 dibujos). Mira cómo están hechos los
> ejemplos de `contenido/teoria/fisica/magnitudes-y-vectores.js` (constantes `EJEMPLOS_*`, ayudantes de color) y de
> `contenido/teoria/fisica/vectores.js`: son el modelo. Carga los skills `arte-generativo-svg` y `arte-vectorial`.
> Español neutro para alumnos. NO hagas commits.
>
> **Encargo**: 15 ejemplos resueltos por idea para `<IDEAS>` de `<ARCHIVO>` (5 de nivel 1, un paso; 5 de nivel 2,
> dos pasos o unidades compuestas; 5 de nivel 3, tipo examen). Cada uno: `{ nivel, titulo, enunciado, datos, figura,
> solucion: [{ texto, ecuacion? }] (1–4), respuesta, fuente? }`.
>
> Reglas (todas salieron de un lector o un auditor):
> - **Figura con el planteamiento, no la respuesta**: lo que se pide va con «?» o no va.
> - El dibujo es el objeto que nombra el texto y no trae cosas que el resuelto no usa.
> - **`datos`**: equivalencias, valores, constantes, definiciones y la fórmula; herramientas, no el paso hecho (el
>   ángulo de referencia y la regla de signos, no el valor con signo; la equivalencia sin elevar si se practica elevar);
>   sin atajos ni consejos. Si el resuelto usa algo (un símbolo, un factor, una notación), está en datos o en el glosario.
> - **Niveles que suben de verdad**: el nivel 2 no repite la cuenta del 1; el 3 es de examen (varios pasos, el error
>   típico, unidades mezcladas).
> - **Datos del mundo**: reales con `fuente` comprobable, o valores de libro con «unos», o «valor aproximado». Nada
>   imposible. Situaciones del Perú y de Puno cuando se pueda.
> - Colores por papel (§5b): primer dato naranja, segundo dato o factor turquesa, lo que se pide y la respuesta violeta,
>   ángulos carmín, tercer dato verde. La respuesta lleva color.
> - Lo que el resuelto dice que hace, se ve hecho (si dice «se tachan», se tachan con `{ tacha }`).
> - Objetos nuevos en una pieza del kit (p. ej. `fis-objeto`, `fis-fuerzas`): puros, `currentColor` y `var(--c-*)`,
>   ancho 320, alto fijo, y una prueba que comprueba con números que todo cabe con 4 de margen y que ningún rótulo pisa a
>   otro.
> - **Cuentas**: rehaz cada respuesta con un script aparte que no use el código de la unidad; el comentario de la
>   constante dice qué se revisó.
>
> Al terminar: `node --test contenido/teoria/teoria.test.js nucleo/kit/piezas/*.test.js`, `npm run catalogo`,
> `npm test`, y `node herramientas/capturas-teoria.js <UNIDAD> <SCRATCH>/ejemplos ejemplos --oscuro`. Mira las
> tarjetas a 390 px y corrige lo que se pise. Mensaje final: lista título → respuesta por idea, objetos nuevos, pruebas,
> capturas y dudas de contenido para Gerson.
