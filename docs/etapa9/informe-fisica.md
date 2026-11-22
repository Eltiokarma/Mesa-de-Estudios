# Informe de etapa 9 — Física: Impulso y choques

Fecha: 22 de noviembre de 2026.
Unidad: `fisica.impulso-y-choques`.
Rama: `codex/etapa9-fisica-impulso-y-choques`.
Base de main: `94f40db7ee81125c144f8bbbe2eca328d757f8ea`.
Último commit de implementación, pruebas y propuesta comprobado antes de publicar este informe: `6b00435f05a143be9ffbf7c263db42042e53d470`.
[Historial de la rama, incluido el commit de este informe](https://github.com/Eltiokarma/Mesa-de-Estudios/commits/codex/etapa9-fisica-impulso-y-choques).

**Entrega parcial solicitada: fases 1 y 2. Me detengo tras la primera idea para recibir las notas de Gerson. No está lista para integrar la unidad completa.**

## Qué quedó hecho

- Propuesta completa de seis ideas en `docs/etapa9/propuesta-fisica.md`: frase de aprendizaje, primera pantalla, misión, predicción y errores, letras, colores, práctica prevista, fuentes y dependencias.
- Nueva primera idea `cantidad-movimiento`, con los siete momentos: Lee, Juega, Predice, Mira, Regla, Así se resuelve y Ahora tú.
- Primera escena con dos carritos reconocibles en pistas paralelas. Masa y rapidez de B son ajustables; un reloj anima el ensayo. La misión exige igualar la cantidad de movimiento con masas diferentes. Hay una sola combinación de controles que cumple el objetivo.
- Predicción sobre módulo y sentido: B tiene doble masa, mitad de rapidez y sentido opuesto. La pantalla anterior permite explorar masa y rapidez, sin mostrar el caso de sentido contrario ni su resultado.
- Quince ejemplos propios: cinco de nivel 1, cinco de nivel 2 y cinco de nivel 3. Incluyen signos, reposo, despejes, gramos, km/h, masa del carrito más carga y comparación entre cuerpos. En los cinco ejemplos de examen, A–E son correctas una vez cada una.
- Generadores determinísticos para Así se resuelve y Ahora tú. Usan casos distintos entre sí y no repiten los ejemplos en Ahora tú. Los datos de entrada quedan disponibles en `verificacion` para comprobarlos por un camino independiente.
- Glosario de cantidad de movimiento y kilogramo metro por segundo, con tres ejemplos por término y sin la respuesta de la predicción.
- Notación diferenciada: vector p⃗, módulo p y componente pₓ; igual criterio para la velocidad. Masa violeta, velocidad naranja y cantidad de movimiento turquesa.
- Reutilización de `fis-estatica` sin modificar la pieza compartida. La figura oculta la magnitud buscada cuando corresponde. No se crearon plantillas de práctica todavía.
- La unidad pasa a versión 0.3.0. No se añadió `calidad: 2`.

Los otros cinco objetos de idea permanecen como estaban: `impulso`, `conservacion`, `elastico-inelastico`, `restitucion` y `centro-masa`. Su presencia no significa que ya estén rehechos.

## Archivos publicados

| Archivo | Cambio |
| --- | --- |
| contenido/teoria/fisica/impulso-y-choques.js | Primera idea, sus generadores y ejemplos, helpers propios, glosario y metadatos de la unidad. |
| contenido/teoria/fisica/impulso-y-choques.test.js | Oráculo numérico independiente, igualdades, opciones y misión. |
| contenido/teoria/fisica/impulso-y-choques-figuras.test.js | Comprobación geométrica de 887 figuras. |
| docs/etapa9/propuesta-fisica.md | Propuesta de la unidad completa y decisiones. |
| docs/etapa9/informe-fisica.md | Este informe de entrega parcial. |

**Archivos compartidos modificados: ninguno.** No se publicaron cambios al catálogo, núcleo, app, herramientas, otras unidades, CSV, archivos generados ni capturas. La rama se creó desde el main leído al iniciar; no se hizo merge, rebase, force-push ni pull request.

## Comprobaciones y resultados

| Comprobación | Alcance y resultado |
| --- | --- |
| Pruebas propias | `npm run -s test:corto -- contenido/teoria/fisica/impulso-y-choques.test.js contenido/teoria/fisica/impulso-y-choques-figuras.test.js`: **6 pasan, 0 fallan**. |
| Cuenta independiente | Se recalculan los 15 ejemplos y 400 semillas de cada generador (800 casos). El oráculo usa operaciones racionales y conversiones 5/18 y 18/5, sin llamar al cálculo de respuestas del generador. |
| Igualdades y distractores | Se revisan las expresiones numéricas escritas en soluciones, pasos y explicaciones. Cada distractor se recalcula por su error; se comprueba su valor en el texto y en siFuera. |
| Unicidad | Se recorren todas las opciones numéricas de cada Ahora tú y de los ejemplos de examen: una sola coincide con la respuesta; no hay opciones numéricas repetidas. Predice comprueba módulo y sentido. |
| Misión | Fuerza bruta de los 16 pares masa–rapidez, con cuatro valores de reloj. Solo B de 3 kg a 2 m/s cumple la misión; el tiempo no cambia su verdad. |
| Variedad | Al menos tres casos distintos por generador; sin coincidencias entre Resuelve y Ahora tú, ni entre Ahora tú y los ejemplos. |
| Figuras | **887 figuras**: márgenes mínimos de 4 px, coordenadas finitas y ausencia de colisiones entre rótulos externos, guías y flechas, incluida la punta. Es una comprobación geométrica, no una revisión visual del navegador. |
| Contrato común de teoría | `npm run -s test:corto -- contenido/teoria/teoria.test.js`: **164 pasan, 0 fallan**. |
| Validador simulado | Proyección temporal de la primera idea con `calidad: 2`, glosario de esa idea y 400 semillas: **0 problemas**. No se guardó la marca. Se excluyó la práctica de laboratorio pendiente. No es una certificación de la unidad completa. |
| Construcción de catálogo | `npm run -s catalogo`: termina correctamente; 8 cursos, 158 unidades y 251 plantillas. Los datos generados no se publicaron. |
| Suite completa | Se ejecutó `npm run test:corto` una vez. Resultado del motor: **12 528 pruebas; 12 494 pasan, 27 fallan y 7 se omiten**, en 583,4 s. La suite completa no quedó en verde; el detalle y la repetición acotada están abajo. |
| Coincidencia local/remota | Los SHA de los cuatro archivos de contenido, pruebas y propuesta coinciden entre lo probado localmente y la rama publicada. |

### Fallos de la suite completa

Diecisiete fallos procedían de una copia local incompleta de archivos del commit base: informes de investigación, referencias de ejercicios y geometría, el CSV de admisión y tres archivos Rive. Se restauraron los bytes originales comprobando sus SHA; **no se cambió ninguno de esos archivos en la rama**. En particular, el CSV había quedado vacío por el límite de la API de contenidos para archivos grandes, y se recuperó mediante su blob original.

Tras restaurarlos se repitieron los diez archivos de pruebas afectados: catálogo, pruebas del curso, cuatro operaciones, MRU, MRUV, triángulos, estructura atómica, generador geo-triangulos, auditoría de ejercicios y Rive. Resultado: **255 pasan, 0 fallan, 0 omitidas**, en 32,3 s.

Quedan documentados diez fallos de `nucleo/sesion.test.js`, en las pruebas que necesitan conectarse al servidor falso local: login, renovación, sincronización, arranque, cierre de sesión y administración. El mensaje es «No hay conexión con el servidor». El entorno también rechazó conexiones locales de navegador con EACCES. No se modificó el código de sesión ni se atribuyen estos fallos a la primera idea. Deben repetirse en un entorno que permita esas conexiones; no se declara verde la suite completa.

## Capturas y revisión visual pendiente

No se obtuvieron capturas. El comando del repositorio `node herramientas/capturas-teoria.js fisica.impulso-y-choques <carpeta-temporal> --oscuro` termina con `MODULE_NOT_FOUND`: no está disponible Playwright y la ruta de respaldo `/opt/node22/lib/node_modules/playwright` no existe en este entorno Windows. La alternativa de navegador controlable tampoco estuvo disponible.

Se intentó un servidor propio en el puerto 4189 y un Chrome de prueba; sus PID se registraron para el cierre individual, sin usar pkill. No se subió ninguna captura ni se presenta como revisado el aspecto de la interfaz.

**Pendiente para la revisión:** capturas reales en celular y escritorio, temas claro y oscuro, los siete momentos y ejemplos de los tres niveles; comprobar especialmente el ancho de ecuaciones de conversión, el movimiento de los carritos y la legibilidad. La prueba geométrica de SVG no sustituye esa revisión.

## Investigación utilizada y descartada

Se tomó como punto de partida el alcance de `docs/investigacion/etapa9/fisica.impulso-y-choques.md` y su LEEME: necesidad de construir cantidad de movimiento antes de impulso, signos, elección de sistema, conservación, choques y problemas por etapas. La secuencia y las cuentas se rehacen para el contrato real del repositorio.

Se contrastó la física con [OpenStax 9.1](https://openstax.org/books/university-physics-volume-1/pages/9-1-linear-momentum), [9.2](https://openstax.org/books/university-physics-volume-1/pages/9-2-impulse-and-collisions), las secciones posteriores del capítulo 9 y [MIT OCW, clase 6](https://ocw.mit.edu/courses/2-003j-dynamics-and-control-i-spring-2007/e12ed118aeb1eb716db972ab23f4b982_lec06.pdf). [Singh y Rosengrant](https://arxiv.org/pdf/1602.06497) respalda dificultades sobre vectores y elección de principios; no valida estos distractores concretos ni da una prevalencia peruana.

Se descartó usar recuentos de separatas como frecuencia de admisión, reproducir material de academias o Scribd, y presentar masas o velocidades de los carritos como mediciones reales. Son datos didácticos explícitos. No hay datos del mundo inventados.

Los errores CM-MASA y CM-RAPIDEZ son hipótesis didácticas propias. CM-VECTOR se inspira en dificultades documentadas, pero su formulación concreta sigue pendiente de validación con alumnos.

Se detectó un problema en la idea antigua de impulso: con igual cambio de cantidad de movimiento y distinta duración solo se deduce la fuerza media, no la fuerza máxima. Está identificado para corregirlo al rehacer esa idea en fase 3.

## Decisiones y preguntas para Gerson

1. Se proponen seis ideas: añadir Cantidad de movimiento al inicio y conservar Centro de masa como idea independiente. Los problemas por etapas se incluyen después, sin crear una séptima idea.
2. La primera escena usa carritos y una misión de igualdad con masas diferentes. Se evita introducir choques o restitución antes de tener cantidad de movimiento.
3. Se distingue vector, módulo y componente desde el principio. El juego explora masa y rapidez; la predicción introduce el cambio de sentido.
4. Se reemplazó el distractor «desaparece la fuerza y se anula p» por errores sobre masa y rapidez: el primero introducía otro concepto y podía quedar resuelto por el glosario.
5. Se preserva el contenido antiguo de las otras ideas hasta recibir las notas sobre la primera. No se oculta que todavía necesita rehacerse.
6. La aprobación pendiente es de contenido y experiencia de la idea 1: escena, misión, tono, carga de texto, progresión de ejemplos y seis ideas propuestas. No se detectó un conflicto crítico que requiriera decidir contra una instrucción escrita de Gerson.

## Lo que queda para después de «sigue»

- Rehacer las otras cinco ideas, con quince ejemplos cada una y las mismas comprobaciones.
- Completar la práctica por idea mediante generadores con TIPOS_POR_IDEA, casos independientes y papel con Datos.
- Pasar las escenas antiguas a «Más mesas del tema» con `rehacer`; actualizar ficha y hasta dos ítems de la prueba del curso.
- Resolver la migración de avance correspondiente a la nueva idea, sin perder el progreso previo.
- Ejecutar la simulación de calidad 2 sobre la **unidad completa**, incluida la práctica, sin marcar la unidad.
- Completar capturas, lectura en frío, auditoría e integración en otra sesión.

Esta entrega cierra únicamente la propuesta y la idea 1. La continuación depende de las notas de Gerson.
