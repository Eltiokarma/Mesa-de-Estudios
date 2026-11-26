# Informe de etapa 9 — Física: Impulso y choques

Fecha: 22 de noviembre de 2026.
Unidad: fisica.impulso-y-choques.
Rama exclusiva: codex/etapa9-fisica-impulso-y-choques.
Base de main: 94f40db7ee81125c144f8bbbe2eca328d757f8ea.
Último commit de contenido, pruebas y propuesta anterior a este informe: f1633a4273dae4ddfd8d4e364c1fe1cdf99cbb9d.
[Historial de la rama, incluido el commit de este informe](https://github.com/Eltiokarma/Mesa-de-Estudios/commits/codex/etapa9-fisica-impulso-y-choques).

**Fases 1 a 5 completadas en la rama. Lista para auditoría y lectura en frío. Listo para integrar: no; faltan esa revisión, las capturas y repetir las pruebas de conexión en un entorno que las permita.** No se añadió calidad: 2. Gerson autorizó continuar después de la primera idea y pospuso sus notas; este informe reemplaza la entrega parcial.

## Qué quedó hecho

Se rehízo la unidad completa, versión 0.4.0: seis ideas, siete momentos por idea, 90 ejemplos propios (15 por idea, cinco por nivel), 16 términos de glosario, seis misiones con testigos y generadores determinísticos para Así se resuelve y Ahora tú.

| Idea | Objeto y misión | Predicción reservada |
| --- | --- | --- |
| Cantidad de movimiento | Dos carritos en pistas paralelas; igualar la cantidad de movimiento de A usando otra masa. | Doble masa, mitad de rapidez y sentido opuesto: distinguir módulo y componente. |
| Impulso | Pelota y dispositivo horizontal; terminar en reposo con un pulso de duración fija. | Comparar fuerzas medias cuando cambia la duración y se mantienen los estados inicial y final. |
| Sistema y conservación | Dos carritos con resorte de masa despreciable; ambos salen a 2 m/s. | Separar masas diferentes desde el reposo y comparar sus velocidades. |
| Choques y energía cinética | Carritos con acople; conseguir 3 m/s después de unirse. | Llegadas en sentidos contrarios; balance con signos y energía transformada. |
| Restitución | Pelota y piso fijo; alcanzar 2,25 m desde una caída de 4 m. | Sustituir el piso fijo por un segundo cuerpo que se mueve: usar velocidades relativas. |
| Centro de masa | Carritos sobre una pista graduada; ubicar el centro en 4 m. | Separación interna de cuerpos que ya avanzaban: el centro sigue moviéndose. |

Se conservan los cinco ids anteriores y se añade cantidad-movimiento al inicio. Una migración propia conserva «Ya la estudié» a quien completó las cinco ideas antiguas, deja pendiente la nueva y renueva una sola vez las predicciones antiguas sin huella.

Se reusan fis-estatica y ejes sin cambiar sus archivos. Los dibujos y sus textos alternativos distinguen objetos, flechas de velocidad, impulso y fuerza. Las flechas comparables comparten escala; la incógnita no aparece dibujada con su respuesta. Los tres laboratorios propios usan ids nuevos: impulso-paleta, choques-acoplados y centro-posiciones.

La notación diferencia vector, módulo y componente. Se usa I para impulso y J solo como unidad de energía; E_C y E_PG siguen la decisión de etapa 8. La compresión del resorte se llama c, separada de la posición x. Masa violeta, velocidad naranja, impulso/cantidad de movimiento turquesa, fuerza carmín y tiempo verde; energía, posición y restitución usan tinta con rótulos propios.

Se corrigieron condiciones físicas concretas: fuerza media frente a máxima; impulso externo nulo entre extremos frente a fuerza neta externa nula durante todo el intervalo; resorte de masa despreciable; choques pasivos unidimensionales para 0≤e≤1; rebote contra piso fijo y alturas medidas desde el mismo nivel del centro; ruedas bloqueadas y deslizamiento para aplicar rozamiento cinético.

## Práctica y prueba del curso

Nueva plantilla fis-impulso-choques, en estado probada, con TIPOS_POR_IDEA, tres tipos por idea y niveles 1–3:

| Idea | Tipos |
| --- | --- |
| cantidad-movimiento | componente; conversiones; despeje-carga |
| impulso | fuerza-constante; rebote-media; tramos-velocidad |
| conservacion | adhesion; retroceso; balance-externo |
| elastico-inelastico | elastico-frontal; energia-transformada; adhesion-rampa |
| restitucion | rapidez-relativa; alturas; rebote-tiempo |
| centro-masa | dos-cuerpos; tres-cuerpos; evolucion |

Hay 18 casos archivados con esperados calculados por otra vía y ocho problemas de papel con Datos, fórmulas y constantes visibles. Cubren las seis ideas y dos problemas avanzados por intervalos. El generador usa el motor de choques existente sin modificarlo. Sus 76 códigos de distractores se documentan como hipótesis de diseño propio, sin afirmar frecuencia ni diagnóstico del alumno.

Las plantillas anteriores choques e impulso-grafica pasan a «Más mesas del tema» con rehacer. Velocidad-relativa recibe la marca únicamente para esta unidad: sus vínculos con MRU y Vectores conservan su situación.

Se añaden dos pares A/B a la reserva de la prueba del curso, fis-33 y fis-34, sobre fuerza media con rebote y posición futura del centro de masa. Las diez parejas activas se conservan. Las cuatro formas tienen fórmulas previas en el enunciado visible y cinco alternativas distintas. Sus ocho hipótesis IC9-* se documentan aparte.

## Archivos exactos publicados

| Archivo | Alcance |
| --- | --- |
| contenido/teoria/fisica/impulso-y-choques.js | Teoría completa, glosario, ejemplos y tres laboratorios propios. |
| contenido/teoria/fisica/impulso-y-choques.test.js | Oráculo de cantidad de movimiento. |
| contenido/teoria/fisica/impulso-y-choques-figuras.test.js | Geometría de la primera idea. |
| contenido/teoria/fisica/impulso-y-choques-impulso-sistema.test.js | Oráculos de impulso y conservación. |
| contenido/teoria/fisica/impulso-y-choques-choques.test.js | Oráculos de choques y restitución. |
| contenido/teoria/fisica/impulso-y-choques-centro.test.js | Oráculo de centro de masa. |
| contenido/teoria/fisica/impulso-y-choques-unidad.test.js | Contrato completo, calidad 2 simulada, papel y geometría. |
| contenido/teoria/fisica/impulso-y-choques-avance.test.js | Migración y preservación de progreso. |
| contenido/teoria/fisica/impulso-y-choques-curso.test.js | Cuatro formas de reserva y 400 variantes por verificador. |
| plantillas/fis-impulso-choques/generador.js | Dieciocho familias y selección por idea. |
| plantillas/fis-impulso-choques/generador.test.js | Contrato, fuentes, escala, distribución y papel. |
| plantillas/fis-impulso-choques/oraculo.test.js | Cálculos independientes de respuestas y errores. |
| plantillas/fis-impulso-choques/casos.json | Dieciocho casos independientes. |
| plantillas/fis-impulso-choques/papel.json | Ocho problemas reproducibles con Datos. |
| plantillas/fis-impulso-choques/plantilla.json | Registro de la nueva plantilla. |
| docs/etapa9/propuesta-fisica.md | Propuesta y decisiones finales. |
| docs/etapa9/errores-fisica.md | Operaciones de los 76 códigos de práctica y ocho del curso. |
| docs/etapa9/informe-fisica.md | Este informe final. |
| catalogo/cursos/fisica.json | Solo la ficha de esta unidad: añade la nueva plantilla. |
| catalogo/pruebas/fisica.json | Dos pares en reserva y sus ocho errores propios. |
| catalogo/pruebas/verificar.js — compartido | Una inserción propia de 1265 caracteres para fis-33 y fis-34. |
| nucleo/avance.js — compartido | Una inserción propia de 660 caracteres para esta migración. |
| plantillas/choques/plantilla.json | Solo rehacer: true. |
| plantillas/impulso-grafica/plantilla.json | Solo rehacer: true. |
| plantillas/velocidad-relativa/plantilla.json — compartido | Solo rehacer: [fisica.impulso-y-choques]. |

La comparación con el commit base confirma que el texto anterior de avance.js y verificar.js permanece idéntico; son inserciones únicas. En los JSON compartidos, retirar los bloques propios devuelve los mismos datos originales. No se cambian otras unidades, piezas comunes, motor de choques, nucleo/repaso-tipos.js ni archivos prohibidos.

Se ejecutó npm run -s catalogo. Los resultados de app/datos/ se regeneran al integrar, como indica el encargo delegado; no se publican para evitar arrastrar salidas compartidas. Tampoco se publican scripts temporales, binarios ni capturas. No se hizo merge, rebase, force-push ni pull request.

## Comprobaciones

| Comprobación | Resultado |
| --- | --- |
| Teoría y ejemplos | Oráculos separados comprueban los 90 ejemplos y 400 semillas por generador en cada idea: 4800 casos de Así se resuelve/Ahora tú. Incluyen respuestas, distractores, siFuera, igualdades visibles y afirmaciones numéricas del caso. |
| Predicciones y misiones | Opciones recorridas por fuerza bruta; una sola correcta. Se evalúan las combinaciones de controles y testigos, separando el reloj de las variables que deciden la misión. Se revisó que Lee, glosario, misión y Datos no anticipen el caso reservado. |
| Geometría | Más de 4800 figuras de toda la unidad, además de ejemplos y momentos: coordenadas finitas, margen de 4 px y rótulos sin cruces con guías/flechas. La primera idea conserva su comprobación específica de 887 figuras. No equivale a una revisión visual de navegador. |
| Práctica independiente | 22 pruebas del oráculo: 400 semillas × 18 tipos = 7200 casos. Recalcula resultados y errores sin llamar al motor, comprueba los números de enunciados/soluciones, igualdades, invariantes físicos y unicidad. Los 18 casos JSON y los ocho de papel pasan. |
| Contrato de práctica y comunes | 131 pasan, 0 fallan, en 12,917 s: 63 propias y 68 de catálogo y papel. Incluye reparto de ideas/letras y detección de fugas por tamaño o posición de respuesta. |
| Prueba del curso | Cuatro formas y 400 variantes de cada uno de los dos verificadores, con un segundo cálculo independiente y una sola opción correcta. |
| Migración | 36 pasan, 0 fallan: pruebas comunes de avance y dos pruebas propias de esta unidad. |
| Calidad 2 simulada | Unidad completa con los temas del catálogo y 400 semillas: 0 problemas. Papel de las cuatro plantillas de la ficha: 0 problemas, sin excepciones particulares. No se guarda la marca. |
| Catálogo | Construcción correcta: 8 cursos, 158 unidades, 252 plantillas. |
| Suite completa final | 12 617 pruebas: **12 600 pasan, 10 fallan, 7 se omiten y 0 se cancelan**, en 747,400 s. Los diez fallos corresponden exclusivamente a nucleo/sesion.test.js. |
| Coincidencia publicada | Los 24 archivos de código, contenido, propuesta y errores coinciden por SHA de blob entre la copia probada y la rama; el informe se comprueba después de publicarlo. |

Comando de comprobación de práctica y comunes:

    npm run -s test:corto -- plantillas/fis-impulso-choques/generador.test.js plantillas/fis-impulso-choques/oraculo.test.js catalogo/catalogo.test.js herramientas/papel-generador.test.js herramientas/papel-lectura.test.js herramientas/papel-opciones.test.js herramientas/papel-reglas.test.js

La suite final se ejecutó una vez después de cerrar código, catálogo y ajustes de revisión:

    npm run test:corto

### Fallos de la suite completa

Los diez fallos están en nucleo/sesion.test.js (líneas 79, 109, 143, 179, 219, 246, 280, 306, 349 y 368): login, renovación de token, sincronización, arranque, cierre de sesión y administración. Todos informan «No hay conexión con el servidor» al usar su servidor falso local. Coinciden con los fallos observados en la primera entrega, antes de ampliar las otras cinco ideas y la práctica. No hubo fallos de esta unidad ni se modificó el módulo de sesión.

La suite completa **no queda en verde**; estos casos deben repetirse donde estén permitidas las conexiones locales. No se ejecutó otra vez la suite completa para ocultarlos. El reportero corto cuenta los siete omitidos dentro de su primera cifra de 12 607; el resumen del motor distingue los 12 600 que realmente pasan y los siete omitidos.

La primera entrega había encontrado archivos ausentes en la copia de trabajo. Se recuperaron los bytes del commit base y se comprobaron sus SHA, sin publicar modificaciones en esos archivos. El glosario generado quedó actualizado al construir el catálogo final.

## Investigación utilizada y decisiones

Se tomó de docs/investigacion/etapa9/fisica.impulso-y-choques.md y su LEEME el alcance: cantidad de movimiento antes de impulso, signos, sistema, conservación, restitución y problemas por etapas. Se rehízo cada cálculo y se adaptó la secuencia al contrato real del repositorio y al tono de Trabajo y energía, la unidad modelo anterior de Mecánica con calidad 2.

La física se contrastó con [OpenStax 9.1](https://openstax.org/books/university-physics-volume-1/pages/9-1-linear-momentum), [9.2](https://openstax.org/books/university-physics-volume-1/pages/9-2-impulse-and-collisions), [9.3](https://openstax.org/books/university-physics-volume-1/pages/9-3-conservation-of-linear-momentum), [9.4](https://openstax.org/books/university-physics-volume-1/pages/9-4-types-of-collisions), [9.6](https://openstax.org/books/university-physics-volume-1/pages/9-6-center-of-mass) y [MIT OCW, clase 6](https://ocw.mit.edu/courses/2-003j-dynamics-and-control-i-spring-2007/e12ed118aeb1eb716db972ab23f4b982_lec06.pdf). [Singh y Rosengrant (2003)](https://arxiv.org/pdf/1602.06497) orienta las dificultades vectoriales y de selección del sistema; no valida estos distractores concretos ni aporta prevalencias peruanas. La viñeta conceptual remite a OpenStax 9.2, sin una anécdota histórica no comprobada.

Se descartaron recuentos de separatas como frecuencia de admisión, material de academias o Scribd, y datos del mundo sin fuente. Los números de carritos, pelotas y dispositivos son parámetros explícitos de modelos escolares. No se incorporó como dato real el intervalo opcional de masa del balón de fútbol.

Decisiones para la revisión posterior de Gerson, sin conflicto crítico detectado:

1. Mantener seis ideas: añadir Cantidad de movimiento y conservar Centro de masa. Los problemas por etapas quedan en ejemplos y práctica, sin una séptima idea.
2. Explorar duración fija y masas iguales en los juegos de impulso y resorte; reservar el cambio de duración y masas distintas para Predice.
3. Distinguir módulo/vector/componente y mantener I, E_C, E_PG y c como notación coherente con las unidades vecinas.
4. Limitar las afirmaciones físicas a sus condiciones: fuerza media, impulso externo, choque pasivo, piso fijo y fricción por deslizamiento.
5. Usar una plantilla propia por ideas y dejar las anteriores como mesas adicionales; los dos pares nuevos van a reserva para mantener diez pares activos.
6. Revisar después el tono, la carga de texto, la progresión y los dibujos de prueba. Gerson pospuso sus notas; el trabajo autorizado se completó.

## Lo que no se pudo comprobar y capturas

No hay capturas ni rutas de imágenes para las seis ideas. El comando de capturas del repositorio falla con MODULE_NOT_FOUND porque Playwright no está disponible y su respaldo /opt/node22/lib/node_modules/playwright no existe en este entorno Windows.

La alternativa de control de navegador se detuvo porque no pudo verificar con suficiente certeza la URL de la ventana de Chrome. No se insistió por otra ruta. El servidor propio del puerto 4189 se cerró de forma individual; no quedan procesos de captura propios abiertos.

Pendiente para la sesión auditora: abrir las seis ideas en celular y escritorio, claro y oscuro; recorrer los siete momentos y ejemplos de los tres niveles; comprobar ancho de ecuaciones, desplazamientos, interacción y legibilidad a 390 px. También debe ejecutar la lectura en frío independiente y repetir los casos de conexión de la suite. No se afirma que la interfaz haya sido inspeccionada visualmente.

La unidad queda completa en la rama indicada para esa revisión, sin integración a main y sin calidad: 2.
