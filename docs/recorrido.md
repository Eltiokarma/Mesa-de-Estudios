# Recorrido satisfactorio: que todos los alumnos se vayan contentos

15 de noviembre de 2026. Sale de la revisión que pidió Gerson a ChatGPT. Le pidió evaluar la app como lo harían ocho alumnos ficticios con preferencias distintas, sobre el commit `04c37278`. Si algo de aquí choca con `CLAUDE.md`, manda `CLAUDE.md`.

**Pedido de Gerson:**
- No basta con dejar contento a Renzo: hay que dejar contentos a todos los alumnos.
- La app tiene que adecuarse a chicos que se estimulan con cosas distintas.
- La misión de preparar para la admisión no cambia.

Los ocho alumnos son ficción para ensayar recorridos. No son un diagnóstico: la app no le asigna un tipo a nadie. Cada alumno elige qué hacer cada día y puede cambiar de idea.

## Decisiones de Gerson (15 nov)

1. **La prueba de entrada:**
   - es **opcional antes del laboratorio**;
   - es **opcional para todo el curso**;
   - es **obligatoria para cada tema**;
   - el tema se **calibra** con esa prueba.
2. **Diseñar para los ocho alumnos**, no solo para Renzo.
3. Los **P0 y P1 van ahora**.
4. **Rive espera** la prueba de estrés en el celular.
5. **El backend espera:** la colección se guarda en el celular. Con cuenta viaja con el estado, sin reglas de unión propias todavía.

## Qué recibe cada alumno

| Alumno (ficción) | Lo que pide | Lo que ya hace la app | Lo que falta |
| --- | --- | --- | --- |
| **Lucía**, organizada | Saber qué puede terminar, progreso con evidencia y dónde sigue | <ul><li>Cuatro niveles por unidad con lo que falta para el siguiente</li><li>«Lo último que hiciste» y «Tu próximo paso» en el inicio</li><li>El simulacro y las minipruebas se retoman</li></ul> | La duración aproximada de cada actividad, antes de abrirla |
| **Diego**, investigador | Cambiar hasta que pase algo raro, comparar, repetir | <ul><li>El laboratorio en las 152 unidades, con arrastre en 502 ideas</li><li>«Volver al inicio»</li><li>Casos guardados lado a lado, que se reabren con sus valores exactos</li></ul> | El caso extremo que el motor reconoce y señala (sorpresa causada por la acción) |
| **Valeria**, exploradora | Abrir y encontrar algo que dé curiosidad, sin trámites | <ul><li>«Probar una mesa sin registrarme» desde la bienvenida, con 3 muestras y «Otra muestra»</li><li>Invitaciones con «Otra idea»</li></ul> | Las invitaciones: solo las tiene física (pista con acelerador). Hay que escribirlas mesa por mesa |
| **Mateo**, práctico | Mover algo ya, reinicio rápido y un reto con final | <ul><li>La muestra sin registro</li><li>El gesto directo</li><li>«Volver al inicio»</li><li>Las invitaciones como retos de final visible</li></ul> | Un reto opcional con «¡lo lograste!» que el motor compruebe |
| **Camila**, energía variable | Ayuda si falla dos veces, compañía discreta, cierre amable | <ul><li>Dos errores seguidos en «Ahora tú» abren la ayuda: volver a la explicación o jugar en el laboratorio</li><li>Compañero «discreto»</li><li>«Terminar» resume solo lo hecho y no dice «0 bien»</li><li>Las líneas de error no culpan</li></ul> | La ayuda graduada también en la práctica de generadores |
| **Renzo**, creador | Ponerle nombre a su creación, conservarla y volver a ella | <ul><li>Colección propia: «Guardar este caso» con nombre editable</li><li>Hasta 6 casos por mesa y 40 en total, que se reconstruyen con el motor</li><li>Abrir, quitar con «Deshacer» y reemplazar a elección cuando se llena</li><li>«Tu colección» en el perfil</li></ul> | Sincronizar con la cuenta, con borrados que no resuciten (espera el backend) |
| **Andrea**, relacional | Un compañero que recuerde lo que hicieron y no repita el saludo | <ul><li>El compañero del curso saluda una vez al día</li><li>Al volver, nombra la última actividad real</li><li>Se despide en el cierre con su voz de la guía</li></ul> | Turnarse dos en el mismo celular (ampliación) |
| **Bruno**, retador | Elegir reto, compararse consigo mismo, sin festejos triviales | <ul><li>El simulacro muestra «la vez anterior» y tu mejor nota</li><li>Preferencia «sin festejos»</li><li>Niveles «sin ayuda» y «la recuerdo»</li></ul> | Elegir la dificultad del simulacro |

## Las piezas

**Avance honesto** (`nucleo/avance.js`, pruebas en `avance.test.js`).
- Abrir una unidad cuenta como visita (`est.vistas`), nunca como unidad estudiada.
- Los niveles se ganan con evidencia:

  | Nivel | Qué lo acredita |
  | --- | --- |
  | Visitada | Abrió la unidad |
  | La estudié | Terminó toda la teoría o la marcó él mismo |
  | Con ayuda | 3 aciertos o más con retroalimentación |
  | Sin ayuda | 4 de 5 o más en un simulacro |
  | La recuerdo | Acertó el repaso otro día |

- El porcentaje del temario, el reto de hoy y el «Estudiaste todas las unidades» usan «La estudié» o más.
- **Migración:** los datos viejos de `vistas` se quedan como visitas y se crea `est.marcadas`. Ninguna respuesta ni evento cambia.

**Prueba de entrada.**
- **La del curso** ya no se impone. Se ofrece en la página del curso como «Prueba de entrada del curso (opcional)».
- **La del tema** (`Teoria.entrada`, ruta `#/unidad/<id>/entrada`) va antes de la teoría, los ejercicios y el simulacro. El laboratorio queda libre.
  - Trae una pregunta por idea, sacada de su «Ahora tú» con una semilla propia (500 + k).
  - No da retroalimentación y tiene «No sé».
  - Se retoma donde quedó.
- **Calibración:** las ideas acertadas empiezan por la regla (con «Jugar desde el inicio») y las demás, jugando.
- **Eventos:**
  - `tema-item`;
  - `tema`, con `expuesto` si exploró la unidad antes de la prueba.

  Primero se guarda el resultado y después se registra: no se duplica.
- **Choque con la regla 3:** la prueba del tema es una pregunta antes de jugar. Es un diagnóstico decidido por Gerson, como lo eran las pruebas de entrada por curso. Las predicciones de la teoría siguen después del juego.

**Retomar y cerrar.**
- **El simulacro** guarda dónde iba y qué marcó (`est.examenes[u].enCurso`). Sus preguntas salen de semillas fijas por intento. Al terminar, se cierra el intento y recién se registran sus eventos, una sola vez.
- **Las minipruebas de la práctica** guardan lo respondido (`st.enCurso`, que el servidor ya une). Los problemas de práctica ya se retomaban solos: su semilla no cambia hasta que se responden.
- **«Terminar»** (quinto botón de la barra, `#/cierre`):
  - resume solo lo de hoy, con los eventos del alumno;
  - dice qué quedó guardado;
  - ofrece dejar un próximo paso opcional: «Seguir con…», «Empezar…» o «Lo decido después»;
  - si el día está vacío, solo se despide.
- **Al volver,** el inicio muestra «Tu próximo paso» o «Lo último que hiciste», hasta 21 días después.

**Compañeros.**
- `Teoria.PERSONAJES[curso].voces` suma `llegada`, `regreso`, `despedida` y `ayuda2`, con la voz de la guía. Ninguna afirma algo que no pasó.
- La llegada se dice una vez por día.
- Preferencias en el perfil:
  - **discreto:** habla solo para ayudar;
  - **sin festejos:** la pose «celebra» pasa a reposo.
- Funciona con el respaldo SVG y con movimiento reducido. El `.riv` espera la prueba de estrés.

**Muestra jugable** (`#/muestra/<k>`).
- Se juega una mesa sin universidad ni grado.
- Hay tres muestras distintas: el carrito con acelerador, el triángulo que se deforma y los conectores.
- Lo que se guarda ahí queda en la colección.

**La promesa de la portada** ahora dice: «Mueve las ideas. Entiende el examen.»

## Verificado y no verificado

**Verificado en código y en el navegador** (Playwright, 360 × 780; recorridos en el scratchpad de la sesión):
- Un estado viejo migra: dos unidades «vistas» pasan a visitadas y el progreso baja a 0 %. Marcarla sube a «La estudié».
- La prueba del tema: el laboratorio está libre; la teoría redirige a la prueba; se sale en la pregunta 3 y se retoma; el resultado calibra; quedan 6 eventos, sin duplicados.
- El simulacro: se sale en la pregunta 3 y vuelve con las 2 respuestas; se termina y queda 1 solo evento `examen`; «la vez anterior» y «tu mejor» se muestran.
- El cierre vacío y con actividad, el próximo paso y el inicio que lo ofrece.
- La muestra sin registro: guardar 2 casos, renombrar, cambiar de mesa, recargar y recuperar ambos con sus valores; reiniciar; quitar con deshacer; «Tu colección» en el perfil.
- La ayuda tras dos errores, «sin festejos» y el cierre que dice «guardaste 2 casos en 1 laboratorio».
- `npm test` en verde.

**No verificado:**
- el celular físico;
- un lector de pantalla real;
- el teclado completo en la muestra;
- la sincronización de la colección con una cuenta en dos equipos;
- alumnos reales.

Las preferencias de los ocho alumnos son hipótesis hasta probarlas con alumnos.

## Pendiente

1. **Invitaciones** para las 434 mesas. Cada una tiene que ser realizable con los controles reales de su mesa: es una ronda por curso, como la teoría.
2. **Sorpresas del motor:** el caso extremo o la simetría que la pieza confirma y el compañero señala.
3. **Reto con final comprobado** en el laboratorio (Mateo y Bruno).
4. **La ayuda tras dos errores** también en la práctica de generadores y en las escenas.
5. **Colección con cuenta** (espera el backend): reglas de unión por id, renombres y borrados con lápida para que no resuciten al reconectar, y propietario en un celular compartido.
6. **Turnarse en el mismo celular** (Andrea): primero el diseño local.
7. **Prueba con 5 alumnos**, con los nueve recorridos de la revisión. Al final se preguntan, opcionales: «¿Qué te gustó?», «¿Qué te fastidió?» y «¿Qué volverías a hacer?».
