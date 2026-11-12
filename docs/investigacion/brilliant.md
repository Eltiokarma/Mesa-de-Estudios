# Brilliant: qué hace bien, qué evidencia hay y qué copiamos

5 de noviembre de 2026 · Búsqueda web. Casi todo viene de reseñas de terceros, varias escritas por apps que compiten con Brilliant; no se pudo entrar a la app ni a su blog. Lo marcado "por verificar" se confirma antes de usarlo. Visión: `docs/vision-pisa-agilidad-interaccion.md`, sección 3.

## 1. Qué es Brilliant

- App y web de aprendizaje interactivo de matemática, ciencia, programación y datos. Más de 70 cursos; en física: mecánica clásica, electricidad y magnetismo, ondas y luz, física de lo cotidiano; en química: *The Chemical Reaction*; y un curso de pensamiento científico.
- Lema: *learn by doing* (aprender haciendo). Prometen intuición y momentos de "¡ajá!", no memorizar.
- Tiene una versión para profesores (Brilliant for Educators).
- Precio: alrededor de USD 150 al año o USD 25 al mes, según la región. La versión gratis da más o menos una lección al día. *Por verificar en su web.*
- Está en inglés.

## 2. Cómo arma una lección

Según las reseñas y un artículo de alguien que trabajó en su diseño ([uxdesign.cc](https://uxdesign.cc/the-key-to-learning-math-and-science-online-is-interactive-play-6ea68ce167fe)):

1. **La interacción es la lección, no un adorno.** No se lee y luego se juega: se aprende jugando.
2. **Primero el problema, después la explicación.** Muchas lecciones arrancan con un acertijo antes de explicar nada.
3. **Pasos chiquitos.** Cada pantalla tiene 2 a 4 oraciones y un dibujo o animación, y pide hacer algo.
4. **El error abre una explicación interactiva**, no un texto que dice "incorrecto".
5. **Piezas reutilizables ("blueprints").** Tienen una biblioteca de módulos interactivos, cada uno con una forma de explorar un diagrama, que se reusan entre cursos. Es lo mismo que proponemos para `nucleo/`.
6. **Interacciones:** arrastrar y soltar, deslizadores, simulaciones, elegir, ordenar.
7. **Motivación:** racha diaria, puntos de experiencia, ligas semanales contra otros alumnos y un tutor con IA (Koji).

## 3. La evidencia detrás de "primero el problema"

- Sinha y Kapur (2021), *Review of Educational Research*, doi 10.3102/00346543211019105: metaanálisis de 53 estudios y 166 comparaciones. **Resolver un problema antes de que te lo expliquen le gana a explicar primero y practicar después**, con un efecto moderado (g = 0,36; IC 95 %: 0,20 a 0,51). El efecto es mayor (g de 0,37 a 0,58) cuando se hace bien: problemas que el alumno puede intentar con lo que ya sabe, varias formas de atacarlos, y una explicación después que compara las ideas del alumno con la correcta ("fracaso productivo").
- **El matiz:** con niños de 2.º a 5.º de primaria pasó lo contrario; ahí conviene explicar primero. Para nuestro público (3.º a 5.º de secundaria y postulantes) la evidencia está a favor. Para la idea de bajar a primaria (`docs/vision-futura.md`, sección 1), no.
- Encaja con nuestra regla 3 ("predecir antes de ver"): la predicción es un problema antes de la explicación.
- Citar en `docs/fundacional.md` cuando se pase a la hoja de ruta.

## 4. Lo que se le critica

- **El precio.** Es la queja principal en todas las reseñas. Para un alumno de Juliaca, USD 150 al año es imposible.
- **Interactividad que a veces es solo un deslizador** que se mueve arriba y abajo sin pensar.
- **No está amarrado a ningún examen ni currículo.** Enseña intuición general; no prepara para la UNI ni para San Marcos ni sigue el programa del Minedu.
- Las ligas pueden desanimar al que va más lento (por verificar: es una opinión de reseñas).

## 5. Qué copiamos y qué no

| De Brilliant | ¿Lo copiamos? | Cómo |
| --- | --- | --- |
| La interacción es la lección | Sí, ya es nuestra idea | Las escenas ya lo hacen; llevarlo a todos los módulos |
| Primero el problema | Sí, con evidencia | Ya está en la regla 3; extenderlo: cada unidad arranca con un reto antes de la teoría |
| Pasos chiquitos | Sí | Pantallas de 2 a 4 oraciones con una acción cada una |
| El error abre una explicación | Sí | Cada opción incorrecta (que ya sale de un error real) lleva a su propia explicación, con la escena mostrando por qué falla |
| Piezas reutilizables | Sí | Componentes del núcleo: arrastrar, completar con fichas, ordenar, emparejar, clasificar, marcar en el dibujo |
| Racha y puntos | Sí, con cuidado | Racha y récord personal; nada que castigue un día perdido |
| Ligas contra otros | No por ahora | En un salón todos se conocen; un ranking público humilla al de abajo. Quizás retos por salón, no por persona |
| Tutor con IA | No por ahora | Regla 1: la física vive en el motor. Un LLM podría explicar, nunca calcular; queda para después |
| Contenido en inglés y genérico | No | Español, temario de la UNI y San Marcos, currículo del Minedu, contexto de Puno |
| Precio alto | No | Bajo costo y sin conexión, que es nuestra ventaja |

## 6. En qué le ganamos (y en qué no todavía)

Ganamos en:
- Precio, idioma y funcionar sin conexión en celulares baratos.
- Amarrado al examen de admisión y al currículo peruano.
- Opciones incorrectas sacadas de errores reales de postulantes, y medición pensada para el colegio.
- Lo acogedor (`docs/diseno.md`).

No todavía:
- Cantidad de contenido: ellos tienen más de 70 cursos y nosotros 5 módulos.
- Variedad de interacciones: hoy tenemos escenas con deslizadores y arrastre, y alternativas.
- Pulido de las animaciones.

## 7. Pendientes

- [ ] Probar la versión gratis de Brilliant unos días: anotar 5 lecciones de física o química, pantalla por pantalla (qué interacción usan y qué pasa al fallar).
- [ ] Decidir el primer componente de interacción del núcleo. Propuesta: **completar con fichas**, que sirve para ecuaciones (física, química, álgebra) y para razonamiento verbal.
- [ ] Citar Sinha y Kapur (2021) en `docs/fundacional.md`.

## Fuentes

- Sinha, T. y Kapur, M. (2021). When problem solving followed by instruction works: evidence for productive failure. *Review of Educational Research*. [doi 10.3102/00346543211019105](https://doi.org/10.3102/00346543211019105)
- [The key to learning math and science online is interactive play](https://uxdesign.cc/the-key-to-learning-math-and-science-online-is-interactive-play-6ea68ce167fe) (uxdesign.cc)
- Brilliant: [Learn science by doing](https://brilliant.org/science/), [qué materias enseña](https://brilliant.org/help/using-brilliant/what-subjects-does-brilliant-teach), [Brilliant for Educators](https://help.brilliant.org/en/articles/7474847-what-is-brilliant-for-educators)
- Reseñas: [Screens Design, desglose de la interfaz](https://screensdesign.com/showcase/brilliant-learn-by-doing), [Tech & Learning](https://www.techlearning.com/learning/stem/what-is-brilliant-and-how-can-teachers-use-it), [G2](https://www.g2.com/products/brilliant-worldwide-brilliant/reviews), [Brighterly](https://brighterly.com/blog/is-brilliant-org-worth-it), [Nibble](https://nibble-app.com/blog/is-brilliant-worth-it) (compite con Brilliant), [Vantaige](https://vantaige.io/ai-tool/brilliant), [SkillScouter](https://skillscouter.com/brilliant-review-math-science-coding/)
