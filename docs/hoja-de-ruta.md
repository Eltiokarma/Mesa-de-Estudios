# Hoja de ruta y pendientes

4 de noviembre de 2026 · Propuesta para que Gerson la ajuste. Las fechas son tentativas: el fundacional dice que las fases tienen fecha recién al cerrar la fase 0, y esta es la propuesta para cerrarla.

## La idea en una línea

Primero se demuestra que **una plantilla hace aprender** (pase 2). Después se construye la app alrededor. Una app bonita con planner, racha y temporizador se puede copiar en semanas; lo que no se puede copiar es la escena que hace entender y la evidencia de que funciona.

## Orden propuesto

1. **Cerrar la fase 0 (noviembre).** Decidir la plataforma, armar un sistema de diseño mínimo y un esqueleto de app que funcione sin conexión y que ya incluya el Banco Óptico.
2. **Pase 2 piloto, con lo que ya existe (noviembre a diciembre).** Probar el Banco Óptico con 3 a 5 postulantes, en papel antes y después. No hace falta construir nada nuevo: se prueba el *formato*, no la cobertura. Si falla, se corrige antes de hacer diez plantillas iguales.
3. **Plantillas de alto rendimiento para la UNI y San Marcos (fines de noviembre a enero).** Primero circuitos, calorimetría y trabajo y energía, que cubren el 28 % de la física de San Marcos y también están en la UNI. Después espejos, MRUV y tiro parabólico, que pesan más en la UNI.
4. **La app alrededor (diciembre a enero, en paralelo).** Inicio, planificador por semana del CEPRE, progreso por tema del temario y modo "lápiz y papel" con temporizador. Ver la [referencia de interfaz](referencias/ui-study-planner-pinterest.jpg).
5. **Escala (desde enero).** Destilar el método de construcción de plantillas (tarea 6), química con predicciones rápidas, más universidades.
6. **Visión a futuro, después del piloto pagado.** Todos los grados, seguimiento adaptativo, curaduría de videos, historia ([`vision-futura.md`](vision-futura.md)).

## Cómo verla y actualizarla

```bash
npm run dev
```

Abre <http://localhost:4173/gestion/>. Ahí se navega por días, semanas o meses, se edita una tarea con un clic, se arrastra una barra para moverla (o su borde para alargarla) y se guarda con el botón o con Ctrl+S. Al guardar se actualizan `docs/hoja-de-ruta.json` (la única fuente) y el Gantt de abajo, que GitHub dibuja solo. La app está en <http://localhost:4173/app/>.

## Gantt

Con este calendario, las primeras plantillas estarían listas antes de que arranquen los ciclos CEPRE de marzo de 2027.

```mermaid
gantt
    title Laboratorio de Admisión: hoja de ruta tentativa
    dateFormat  YYYY-MM-DD
    axisFormat  %d %b

    section Fase 0: base
    Fundacional, investigación, temarios UNI y San Marcos :done, f0a, 2026-11-04, 2026-11-05
    Motor del Banco Óptico + pruebas :done, f0b, 2026-11-04, 2026-11-05
    Clasificación de simulacros de San Marcos :done, f0c, 2026-11-04, 2026-11-05
    Arquitectura por módulos y catálogo de 8 cursos :done, f0g, 2026-11-04, 2026-11-05
    Decidir plataforma (PWA) :done, f0d, 2026-11-04, 2026-11-05
    Sistema de diseño mínimo (colores por variable, tipografía) :active, f0e, 2026-11-04, 2026-11-14
    Esqueleto PWA sin conexión con el Banco Óptico :active, f0f, 2026-11-04, 2026-11-21

    section Pase 2 piloto
    Problemas de papel antes y después (lentes) :p2a, 2026-11-16, 2026-11-21
    Prueba con 3 a 5 postulantes :crit, p2b, 2026-11-23, 2026-12-04
    Ajustar el formato según resultados :p2c, 2026-12-04, 2026-12-11

    section Fase 1: plantillas
    Circuitos de corriente continua :f1a, 2026-11-21, 2026-12-05
    Calorimetría y cambios de fase :f1b, 2026-12-05, 2026-12-17
    Trabajo, energía y potencia :f1c, 2026-12-17, 2026-12-29
    Espejos esféricos (reusa el motor de lentes) :f1d, 2026-12-29, 2027-01-05
    MRUV y gráficas :f1e, 2027-01-05, 2027-01-15
    Tiro parabólico :f1f, 2027-01-15, 2027-01-25

    section App alrededor
    Inicio, planificador y progreso por tema :apa, 2026-12-11, 2027-01-01
    Modo lápiz y papel con temporizador :apb, 2027-01-01, 2027-01-08

    section Fase 2: escala
    Método de construcción de plantillas (skill) :f2a, 2026-12-29, 2027-01-05
    Química y matemática con predicciones generadas :f2b, 2027-01-05, 2027-01-26
    Material de la UNA Puno (cuando llegue) :f2c, 2027-01-05, 2027-01-19
```

## Estado de los pendientes

| Tarea (`CLAUDE.md`) | Estado | Siguiente paso |
| --- | --- | --- |
| 1. Motor del Banco Óptico con pruebas | Hecho | Es el molde para las demás plantillas |
| 2. Temarios | UNI y San Marcos hechos | UNA Puno, UNSA y UNSAAC cuando haya material |
| 3. Clasificar problemas reales | San Marcos hecho (120 preguntas) | UNI, si se consiguen exámenes; UNA Puno |
| 4. Investigación de errores típicos | Física y química hechas | Confirmar hipótesis en el pase 2 |
| 5. Construir plantillas | 1 de 4 (Banco Óptico) | Circuitos |
| 6. Método de construcción | Pendiente | Después de 4 plantillas probadas |
| 7. Visión a futuro | Anotada | No se toca hasta el piloto pagado |

## Plataforma: web app instalable (PWA)

Propuesta: una **PWA**, es decir, una página web que se instala en el celular como app y funciona sin internet.

| Criterio | PWA | App nativa (Play Store) |
| --- | --- | --- |
| Funciona sin conexión | Sí (con *service worker*) | Sí |
| Costo de publicar y actualizar | Casi cero; se actualiza sola | Cuenta de desarrollador y revisión de cada versión |
| Celulares Android de gama baja | Liviana, sin instalar nada pesado | Ocupa más espacio |
| Lo que ya tenemos | El Banco Óptico ya es HTML y JavaScript: entra tal cual | Habría que rehacerlo o envolverlo |
| Cobro de S/ 10 al mes | Pagos web (Yape, tarjeta); sin comisión de tienda | La tienda cobra comisión |
| Notificaciones de repaso | Sí en Android; limitadas en iPhone | Completas |

La PWA gana en casi todo para este público. Si más adelante hace falta estar en la Play Store, una PWA se puede empaquetar como app sin rehacerla.

## Referencia de interfaz

Hay dos referencias: un [*study planner* de Pinterest](referencias/ui-study-planner-pinterest.jpg), del que sale la estructura de cuatro pantallas, y una [app de ejercicio](referencias/ui-fitness-dribbble.webp), de la que salen el estilo (tarjetas redondeadas, morado con acento lima, "reto del día", estadísticas de hoy, progreso en anillo) y la bienvenida. Así se traducen al laboratorio:

| Pantalla de la referencia | En el laboratorio |
| --- | --- |
| Inicio: meta del día y agenda | Las plantillas y repasos del día, según la semana del ciclo CEPRE de su universidad |
| Planificador: semana y tareas | El cronograma del CEPRE-UNI o del CEPRE-UNMSM, tema por tema, con los repasos que tocan (recordar en vez de releer) |
| Temporizador de enfoque | El modo **lápiz y papel**: problemas sin la escena, con tiempo de examen (unos 2 minutos por pregunta) |
| Progreso por materia | Avance por **tema del temario** y aciertos en las predicciones; la racha de días va aquí |

El morado y el lima de la marca se usan solo en la cáscara de la app (inicio, cursos, progreso, perfil). Dentro de una escena no aparecen, porque ahí el morado es la distancia focal y el verde, la separación entre lentes (regla 4). La primera versión está en `app/`.
