# Propuesta de ideas: Impulso, cantidad de movimiento y choques

Unidad: `fisica.impulso-y-choques`. Curso: Física. Etapa 9. Fecha: 22 de noviembre de 2026.
Rama exclusiva: `codex/etapa9-fisica-impulso-y-choques`, creada desde main `94f40db7ee81125c144f8bbbe2eca328d757f8ea`.
Alcance de esta entrega: propuesta de la unidad y primera idea completa. La instrucción de Gerson exige detenerse después de la idea 1; prevalece sobre el «sigue sin esperar» del encargo interno.

No se detectó un conflicto crítico con una decisión escrita. Las diferencias con la investigación son decisiones de implementación explicadas al final. Esta propuesta no declara terminadas las fases 3 a 5.

## Qué se pregunta y qué respalda el alcance

El catálogo incluye cantidad de movimiento, impulso, conservación, centro de masa, choques y restitución. La investigación de etapa 9 identifica cálculo directo y con signos, fuerza media, áreas F–t, retroceso, adhesión, energía perdida y problemas por etapas. No uso sus recuentos de una separata como frecuencia en admisión ni reproduzco material alojado en Scribd.

La física se contrasta con OpenStax, capítulo 9, y MIT OCW, clase 6. Singh y Rosengrant documentan dificultades con el carácter vectorial y con la elección del sistema y del principio de conservación; eso no valida nuestros distractores ni estima prevalencias peruanas. Todos los ejercicios nuevos son propios. Los números de las escenas son datos de modelos escolares, no mediciones de una ferretería ni de una recepción deportiva.

## 0. Diagnóstico de lo publicado

La versión actual tiene cinco ideas: impulso, conservación, elástico/inelástico, restitución y centro de masa. No tiene una idea inicial que construya cantidad de movimiento; la define al mismo tiempo que impulso. Sus primeras pantallas usan una gráfica F–t o una recta sin un objeto reconocible. Faltan Lee, misiones, ejemplos y Datos en muchos ejercicios. Los nombres son frases y no temas.

Hay un error físico concreto: la predicción de impulso atribuye menor fuerza máxima a un frenado más largo con el mismo cambio de velocidad. De esos datos solo se deduce una menor magnitud de la fuerza media; la máxima necesita la forma temporal. En fase 3 se reemplazará esa predicción. El estado antiguo permanece identificable mientras se revisa esta entrega parcial.

También se mezclan p como vector, módulo y número con signo; J como impulso y unidad de energía; K para energía pese a la decisión de etapa 8 de usar E_C. El juego de choques emplea e antes de enseñarlo. La declaración «e nunca pasa de 1» necesita delimitar choques pasivos del modelo.

La unidad modelo es Trabajo y energía, inmediatamente anterior en Mecánica y con calidad 2. Sus auditorías aconsejan comprobar los números que realmente se muestran, dar cada constante, justificar los distractores y no dibujar a escala la incógnita. El validador no reemplaza esos controles.

## 1. Las ideas, en orden

| # | id | Título | Aprendizaje |
| --- | --- | --- | --- |
| 1 | cantidad-movimiento (nueva) | Cantidad de movimiento | La cantidad de movimiento combina masa y velocidad; igual módulo no significa igual vector si cambia el sentido. |
| 2 | impulso | Impulso y fuerza media | El impulso neto es el cambio de cantidad de movimiento; el área con signo de F–t permite calcularlo. |
| 3 | conservacion | Sistema y conservación | El total del sistema se conserva cuando el impulso externo es nulo o despreciable; cada cuerpo puede cambiar. |
| 4 | elastico-inelastico | Choques y energía cinética | En un choque aislado se conserva la cantidad de movimiento total; la energía cinética depende del tipo de choque. |
| 5 | restitucion | Coeficiente de restitución | La restitución compara velocidades relativas de separación y acercamiento en la línea del impacto. |
| 6 | centro-masa | Centro de masa | El centro de masa pondera las posiciones por sus masas; su velocidad se relaciona con la cantidad de movimiento total. |

Se conservan los cinco ids publicados. La idea 1 se antepone. La migración del avance se hará con el bloque mínimo de esta unidad antes de cerrar las fases 3 a 5: conservar «Ya la estudié» y renovar predicciones antiguas sin huella. En esta entrega parcial no se publica a main ni se declara calidad 2.

Los problemas por etapas no desaparecen: adhesión y subida, vuelo posterior y frenado se distribuyen entre los ejercicios de examen de las ideas 4 y 5, con los intervalos separados. Centro de masa conserva una idea propia porque el catálogo lo exige y reducirlo a una definición dejaría sin práctica su posición y su velocidad.

## 2. Objeto de la primera pantalla

| Idea | Objeto reconocible | Comparación visible y límite |
| --- | --- | --- |
| 1 | Dos carritos de laboratorio con carga, en pistas paralelas. | Ambos se ven juntos; masa total incluye carrito y carga. Son dos ensayos independientes, no un choque. |
| 2 | Una pelota en una guía horizontal y una paleta que la frena. | Objeto junto al registro F–t; identificar la componente neta horizontal. |
| 3 | Dos carritos con un resorte entre ellos. | Borde que define el sistema y fotogramas antes/después; fuerza interna sobre cada cuerpo. |
| 4 | Carritos con acople idealizado. | Antes/después y energía cinética total; se compara unión con separación sin usar e todavía. |
| 5 | Pelota y piso horizontal fijo. | Alturas del centro referidas al mismo nivel de contacto; llegada y salida inmediatas. |
| 6 | Dos carritos ubicados sobre una pista graduada. | Posiciones medidas desde un origen común, con masa y centro calculado; luego movimiento del conjunto. |

Se reusa `fis-estatica` para la primera idea, con carritos y rótulos propios. Su descripción alternativa se reemplaza en cada figura: el texto por defecto llama fuerzas a las flechas, y aquí representan velocidad o cantidad de movimiento. Los objetos de esa pieza ya están marcados como dibujos de prueba.

## 3. Misión de Juega

| Idea | Misión prevista | Qué cambia | Qué queda fijo y testigo |
| --- | --- | --- | --- |
| 1 | Iguala la cantidad de movimiento de A usando una masa distinta. | Masa B: 1–4 kg; rapidez B: 1–4 m/s, pasos enteros. Reloj animado. | A: 2 kg a 3 m/s hacia la derecha. Testigo B: 3 kg a 2 m/s. Ambos en el mismo sentido. |
| 2 | Detén la pelota con el pulso disponible. | Duración y fuerza del pulso; se ven área y movimiento. | Masa, llegada e intervalo positivo. Meta determinada por I_x=−m·v_x inicial. |
| 3 | Haz que el carrito B salga a la rapidez indicada. | Masas y energía inicial del resorte, con casos discretos. | Total inicial cero, impulso externo horizontal despreciable. El motor determina ambas salidas. |
| 4 | Consigue que los carritos unidos avancen a la velocidad indicada. | Masa del receptor o velocidad de llegada. | Acople, mismo eje y ausencia de impulso externo horizontal apreciable. |
| 5 | Haz que el rebote alcance la marca. | e en un intervalo entre 0 y 1. | Altura de caída, piso fijo y aire despreciable; h=e²H. |
| 6 | Coloca el centro de masa en la marca. | Masa o posición del segundo carrito. | Primera posición, masa positiva y origen común. Testigo recalculado al implementar. |

Las misiones de 2–6 son diseño de fase 1; sus valores finales se elegirán y verificarán al programarlas. No se presentan todavía como motores terminados. La animación mueve el objeto; no cambia sola la masa que el alumno necesita elegir.

## 4. Predicciones y errores

| Idea | Situación nueva frente a Juega | Respuesta y errores que se contrastarán |
| --- | --- | --- |
| 1 | Frente a A (2 kg, 3 m/s derecha), B lleva 4 kg a 1,5 m/s izquierda. | B tiene módulo 6 kg·m/s y sentido izquierdo. E-VEC: derecha con módulo 6. H-MASA: módulo 12 al cambiar solo masa. H-RAPIDEZ: módulo 3 al cambiar solo rapidez. |
| 2 | Mismos estados de llegada y reposo, duraciones diferentes. | Mismo impulso neto; menor magnitud de fuerza media en mayor tiempo. Distinguirlo de fuerza máxima y de menor impulso. |
| 3 | Resorte separa masas diferentes desde reposo. | Cantidades de movimiento opuestas; velocidades distintas. Errores: conservar cada cuerpo, igualar velocidades o dar mayor impulso al pesado. |
| 4 | Dos carritos llegan en sentidos contrarios y quedan unidos. | Calcular la velocidad con el total con signo y después la energía; no conservar energía cinética automáticamente. |
| 5 | Cambiar el piso fijo por otro cuerpo que ya se mueve. | e usa velocidades relativas, no la velocidad aislada de una pelota; sentidos y orden de resta importan. |
| 6 | Ambos carritos ya tienen el mismo movimiento antes de separarse. | El centro de masa sigue avanzando con velocidad constante, no necesariamente permanece quieto. |

La primera predicción se recalcula en código; las otras quedan sujetas al motor en fase 3. En ningún caso Lee, glosario, leyenda o Datos anticiparán el caso reservado. En la idea 1 no se ofrece el sentido contrario en el juego. Los Datos de Predice solo especifican masas, rapideces y sentidos, sin p=m·v.

E-VEC se inspira en la dificultad vectorial documentada por Singh y Rosengrant. Los códigos H-MASA, H-RAPIDEZ y los errores aritméticos que se creen son hipótesis de diseño. Cada explicación incorrecta debe describir exactamente la operación que produce su número.

## 5. Tabla de letras

| Símbolo | Significado único | Uso |
| --- | --- | --- |
| m, m_A, m_B | Masa del cuerpo o conjunto señalado. | Kilogramos; siempre positiva. |
| v⃗ | Velocidad vectorial. | Flecha sobre la letra. |
| v, v_x | Rapidez y componente horizontal de velocidad, respectivamente. | v≥0; v_x lleva signo con derecha positiva. |
| p⃗ | Cantidad de movimiento de un cuerpo. | Vector; no se confunde con fuerza. |
| p, p_x | Módulo y componente horizontal de cantidad de movimiento. | p≥0; p_x puede ser negativo. |
| P⃗_total | Cantidad de movimiento del sistema. | Se presenta en idea 3; no es la potencia de la unidad anterior. |
| I⃗, I_x | Impulso y su componente horizontal. | Se presenta en idea 2; J se reserva para joule. |
| F⃗_neta, F_x, F_media,x | Fuerza neta y componente instantánea o media. | No sustituir media por máxima. |
| t, Δt | Instante y duración. | Segundos; t del juego es el reloj del ensayo. |
| E_C, E_PG, E_M | Energías cinética, potencial gravitatoria y mecánica. | Notación acordada en etapa 8. |
| e | Coeficiente de restitución. | Modelo de impacto frontal pasivo: 0≤e≤1. |
| x_A, x_B, x_CM | Posiciones del cuerpo o centro de masa. | Un mismo origen. |
| v_CM,x | Componente de velocidad del centro de masa. | Total horizontal dividido por masa total. |
| h, H, g | Altura, altura inicial y magnitud de gravedad. | Mismo nivel de referencia; g como aproximación dada. |
| m_c, m_L | Masa del carrito vacío y de su carga. | m=m_c+m_L en los ejemplos que preguntan masa total. |
| r_m, r_v | Factores de cambio de masa y rapidez. | Solo en ejercicios de comparación que los definen. |

Los subíndices se renderizan con el formato de ecuación del proyecto. En la primera idea se implementa únicamente la parte de esta tabla que utiliza.

## 6. Mapa de colores

| Magnitud | Token | Criterio |
| --- | --- | --- |
| Velocidad, rapidez y sus componentes | naranja c-o | Mantiene el naranja del movimiento y distingue sus rótulos mediante flecha/subíndice. |
| Cantidad de movimiento y sus componentes | turquesa c-i | Mantiene la identificación de p de la unidad existente. |
| Masa del carrito y de la carga | violeta c-f | La masa deja de perderse en el dibujo; m_A y m_B usan rótulos y trazos, además del color. |
| Fuerza | carmín c-h | Reservada para idea 2. |
| Tiempo | verde c-d | Reservado a reloj/duración, sin usarlo junto al naranja como única distinción. |
| Energía, posición, e y referencias | tinta | Letras, unidades y paneles identifican cada magnitud; no se confunden como una sola variable. |

En la idea 1, m, v y p tienen colores distintos y constantes en enunciado, figura, fórmula y respuesta. La incógnita del dibujo va en tinta con «?» hasta resolver. Las flechas de dos velocidades comparten escala; las de dos cantidades de movimiento comparten otra. No se comparan largos entre magnitudes con unidades distintas.

## 7. Práctica y ejemplos

Situación actual: `choques` es una escena; `velocidad-relativa` es compartida y requiere filtrar sus tipos; `impulso-grafica` es un generador de áreas/impulso. Ninguna cubre por sí sola el recorrido propuesto.

| Idea | Familias de práctica previstas |
| --- | --- |
| 1 | p_x directo, módulo, despeje de masa o velocidad, conversiones, masa total y comparación de estados. |
| 2 | Pulsos rectangulares/triangulares por tramos, cambio con rebote, fuerza media y duración. |
| 3 | Retroceso, suma con signos/componentes, elección de sistema y comprobación de condición externa. |
| 4 | Adhesión, choque elástico frontal, energía transformada y choque seguido de subida/frenado. |
| 5 | Restitución con velocidades relativas, pared fija y rebote por alturas; combinación con cinemática. |
| 6 | Posición de dos/tres cuerpos, velocidad del centro y evolución con total no nulo. |

En fase 4 se construirá un generador propio con `TIPOS_POR_IDEA`, casos calculados aparte y papel con Datos; se revisarán las plantillas de toda la ficha y se marcarán las escenas antiguas con `rehacer`. Se agregará hasta dos ítems a la reserva del curso si sus formas ya tienen diez pares.

Primera idea: 15 ejemplos (5 por nivel). Nivel 1: producto y despejes directos con sentido explícito. Nivel 2: conversiones y lectura de componente frente a módulo. Nivel 3: masa de carrito más carga, comparación simultánea de masa y velocidad, conversión doble y despejes con un requisito de comparación. Los últimos no serán solo productos con números grandes. Las cinco letras A–E se repartirán entre los cinco ejemplos de examen. Cada figura presenta datos y oculta p si se pregunta por p.

«Así se resuelve» y «Ahora tú» tendrán familias comparables con listas de casos distintas, al menos tres enunciados resueltos y 400 semillas de verificación. No se reutilizan misión, predicción ni ejemplos como Ahora tú.

## 8. Datos del mundo y fuentes

Para la primera entrega se usan únicamente datos didácticos explícitos de carritos de laboratorio. No hace falta añadir una cifra comercial para justificar masas plausibles. Una variante posterior puede usar el intervalo de 410–450 g del balón de fútbol (IFAB, regla 2.1); la velocidad seguirá siendo un dato del ejercicio. No se usarán tiempos de contacto, fuerzas máximas ni coeficientes supuestamente medidos sin fuente.

Fuentes físicas y de errores consultadas el 22-11-2026:

- OpenStax, University Physics 1: [9.1](https://openstax.org/books/university-physics-volume-1/pages/9-1-linear-momentum), [9.2](https://openstax.org/books/university-physics-volume-1/pages/9-2-impulse-and-collisions), [9.3](https://openstax.org/books/university-physics-volume-1/pages/9-3-conservation-of-linear-momentum), [9.4](https://openstax.org/books/university-physics-volume-1/pages/9-4-types-of-collisions), [9.6](https://openstax.org/books/university-physics-volume-1/pages/9-6-center-of-mass).
- MIT OCW, [Dynamics and Control I, Lecture 6](https://ocw.mit.edu/courses/2-003j-dynamics-and-control-i-spring-2007/e12ed118aeb1eb716db972ab23f4b982_lec06.pdf), pp. 3–4: restitución y condiciones.
- Singh y Rosengrant (2003), [versión de autor](https://arxiv.org/pdf/1602.06497), especialmente discusión del carácter vectorial y selección de sistema. El año 2016 es del depósito, no del estudio.
- [IFAB, regla 2](https://theifab.com/es/laws/latest/the-ball/), solo como dato opcional para fases siguientes.

## 8b. Orden con otras unidades

Se conserva `requiere: fisica.trabajo-y-energia`. Su cadena incluye Dinámica, Estática, Vectores, MRU/MRUV y movimiento circular; las conversiones y sumas de masas vienen de Magnitudes. Las fórmulas previas necesarias se vuelven a dar como Datos. No se adelantan órbitas, oscilaciones ni cálculo integral. El ascenso posterior a un choque se resuelve por energía y altura, sin periodo de péndulo.

## 9. Decisiones tomadas (Gerson revisa después)

| Duda | Elegida y motivo | Descartada |
| --- | --- | --- |
| ¿Cuántas ideas? | Seis: añadir cantidad de movimiento y conservar centro de masa con su id y práctica propia. | Absorber centro de masa en conservación y crear una idea separada de etapas: concentra demasiadas reglas en conservación. |
| ¿Primera escena? | Dos carritos de laboratorio, juntos en pantalla; cambiar masa y rapidez hacia la derecha. | Solo variar rapidez de un coche grande: no permite explorar el papel de la masa. |
| ¿Notación con signo? | p⃗ vector, p módulo, p_x componente; lo mismo para v. | p negativo sin aclaración: mezcla módulo y componente. |
| ¿Distractor sobre fuerza? | Cambiarlo por H-RAPIDEZ, calculable y sin anticipación del glosario. | «La fuerza desaparece y p se anula»: introduce un concepto distinto y puede delatarse con el glosario. |
| ¿Afirmar fuerza máxima? | Fuerza media con igual Δp y distinta duración; máxima solo con forma conocida. | Deducir máxima de duración: no se sigue de esos datos. |
| ¿Terminar toda la unidad ahora? | Detenerse tras la idea 1 y sus comprobaciones; Gerson revisa antes de seguir. | Aplicar la continuación automática del documento interno contra la instrucción explícita de esta sesión. |
