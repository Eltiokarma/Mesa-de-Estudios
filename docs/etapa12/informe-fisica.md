# Informe provisional de Fluidos — etapa 12

26 de noviembre de 2026.

**Listo para integrar: no.** La implementación se interrumpió al desconectarse el entorno de ejecución. Este documento conserva el punto de reanudación; no presenta el diseño como una unidad terminada.

Unidad: `fisica.fluidos`.
Rama: `codex/etapa12-fisica-fluidos`.
Base de main: `94f40db7ee81125c144f8bbbe2eca328d757f8ea`.
Propuesta publicada: `c1c6e3376b6616150c560838f1357d47d513a9a5`.

## Trabajo confirmado

- Fase 1 completa: propuesta de seis ideas, conservando los identificadores anteriores y cubriendo todos los temas del catálogo, incluida tensión superficial.
- Investigación breve y LEEME contrastados con fuentes primarias. Se diferenciaron las operaciones de distractores, que siguen siendo hipótesis, de las categorías documentadas en investigaciones originales.
- Checkout de la base comprobado por hashes Git: 2457 archivos exactos. No se arrastraron cambios de Oscilaciones.
- Planes y cálculos preliminares de columnas, prensa, empuje, superficie y flujo preparados. No equivalen a oráculos ejecutados sobre el contenido final.
- La propuesta está en GitHub; no se modificó main, no se abrió PR y no se asignó calidad 2.

## Interrupción de la fase 2

Se preparaban la primera idea, sus quince ejemplos y una pieza propia `fis-fluidos-e12`. Las escrituras de ambos parches quedaron sin confirmación cuando el entorno pasó a `unavailable`; la ejecución devolvió `exec-server transport disconnected`.

Al recuperar el entorno hay que comprobar qué archivos existen antes de volver a aplicar parches. La primera idea todavía requiere revisión de su API de figuras, equivalencias, prueba independiente de 400 semillas y simulación de calidad 2. No está lista para publicar como teoría terminada.

## Decisiones para retomar

1. Presión: juego con área fija y fuerza variable. Predice conserva 90 N, cambia 30 a 15 cm² y aporta una lectura inicial medida de 30 kPa; la fórmula se enseña después. El sensor muestra presión añadida respecto del aire exterior.
2. Pieza propia con rótulos del Kit, escalas fijas y sin geometría que revele incógnitas. Secciones prismáticas explícitas; los círculos usan diámetro proporcional a la raíz del área.
3. Prensa horizontal a igual altura para comparar desplazamientos y trabajos. Los ejercicios con desnivel son estáticos e incorporan la diferencia hidrostática.
4. El juego del bloque conserva el volumen del líquido de la tina. No se muestra la lectura del dinamómetro antes de Predice.
5. L identifica longitud de contacto y ℓ recorrido del pistón; P es peso y p presión. Si se usa W para trabajo en la prensa, incorporarlo a la tabla y la paleta antes de escribirlo para el alumno.
6. La superficie incluye película de dos caras y capilaridad ideal con ángulo de contacto cero. Continuidad se distingue de Bernoulli; Torricelli requiere las condiciones del depósito grande y el instante considerado.

## Pendientes

Completar y comprobar la idea 1; avisar su cierre; implementar las otras cinco ideas y sus quince ejemplos cada una; práctica por idea, papel, casos independientes y laboratorio; ficha y avance mediante bloques propios; hasta dos pares de reserva; catálogo; validador simulado; pruebas comunes y suite completa; informe final con resultados y lista exacta de archivos.

No se ejecutaron las pruebas finales de Fluidos ni se obtuvieron capturas. Durante Oscilaciones se comprobó que Playwright no estaba instalado y localhost devolvía EACCES; ahora el entorno completo está desconectado. La auditoría y la inspección visual siguen pendientes.

Oscilaciones sí quedó terminada en su propia rama, commit `5a9c2cd06d9a6a6323c0b8e270227fc499877885`, con su informe y las limitaciones del entorno documentadas.
