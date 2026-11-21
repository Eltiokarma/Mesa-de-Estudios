# Fase 1 y 2: las ideas de la unidad

## A. Propuesta para Gerson (la sesión, antes de escribir)

Entrega en un mensaje, sin código:
1. **Las ideas en orden**, cada una con su título (≤ 6 palabras) y su `aprendizaje`: una frase con lo que el alumno debe
   poder decir al terminar. Ninguna usa algo que llega después; lo que se da por sabido va en `requiere`.
2. **El objeto de la primera pantalla** de cada idea (un poste, una caja con dos cuerdas, una combi): algo que se
   reconoce, no un diagrama.
3. **La misión de «Juega»** de cada idea: una meta que el motor comprueba («Haz que R mida 10 N»).
4. **Tabla de letras**: cada letra con un solo significado en la unidad; si la notación del libro choca con otra cosa,
   se usa la del libro y se avisa.
5. **Mapa de colores** por papel (`docs/molde-unidad.md` §5b): qué variable es primer dato, segundo dato o factor, lo que
   se pide, ángulo, tercer dato.
6. **Qué práctica existe** y qué falta (`plantillas/` de la unidad), y qué datos del mundo se van a usar.

Gerson aprueba o corrige. Nada se escribe hasta ese visto bueno.

## B. Encargo para escribir una idea

> Las unidades de teoría no se abren enteras: `node herramientas/mapa-unidad.js <UNIDAD>` da el mapa y cada tramo
> (docs/metodo/unidad/LEEME.md, «Leer sin gastar contexto»).
>
> Trabajas en /home/user/mesa-de-estudios. Lee CLAUDE.md, docs/plan-calidad.md §3 (contrato de 13 puntos),
> docs/teoria.md (formato de los momentos: 4e, 4f, 4h y §5 de topes) y docs/molde-unidad.md entero. Carga los skills
> `multimedia-learning`, `diseno-y-animacion`, `arte-generativo-svg` y `arte-vectorial`. Español neutro para alumnos. NO
> hagas commits.
>
> Escribe la idea `<ID>` («<TÍTULO>») de `<ARCHIVO>` con los momentos Lee, Juega (con misión), Predice, Mira, La regla,
> Así se resuelve y Ahora tú, su `aprendizaje`, `actividad`, leyenda, y de 2 a 4 términos de glosario con `simple` y 3
> ejemplos o más. Aprobado por Gerson: <PEGA AQUÍ LA PROPUESTA DE LA IDEA>.
>
> Reglas que más se olvidan (de la auditoría del 17 nov):
> - Primera pantalla con un objeto reconocible de una pieza del kit (si falta, dibújalo como objeto de prueba
>   `data-prueba`, con su prueba numérica de encuadre y rótulos; `docs/molde-unidad.md` §6).
> - Predice: `datos` solo con equivalencias y valores, nunca la fórmula. Sus opciones las baraja la app.
> - Lectura en vivo que enuncia una relación, no un número suelto.
> - La regla dice todo lo que «Ahora tú» va a pedir; «Ahora tú» practica cada parte de la regla, llega a nivel de
>   examen, y cada caso trae `datos` (herramientas, no el paso hecho; sin atajos ni consejos). «Así se resuelve» no repite
>   la pregunta de «Ahora tú».
> - Un `simple` del glosario nunca afirma lo que un distractor de la idea afirma.
> - Colores por papel (§5b); notación (§5): flechas, subíndices de verdad, «°».
>
> Al terminar: `node --test contenido/teoria/teoria.test.js`, `npm run catalogo`, `npm test`, y capturas con
> `node herramientas/capturas-teoria.js <UNIDAD> <SCRATCH>/idea-<ID> momentos --oscuro --ancha`. Mírate cada
> captura y corrige lo que se pise o se salga. Mensaje final: qué hiciste por momento, pruebas y rutas de las capturas.
