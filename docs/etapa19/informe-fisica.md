# Ondas mecánicas — informe de avance de Física, Etapa 19

**Estado: fase 2, revisión visual pendiente.** La unidad todavía no está lista para integrar.

La ejecución se interrumpió por una configuración del entorno: `invalid sandbox permission path: 'file:///workspace' is invalid on 'windows'`. El editor también dejó de poder escribir. Este informe conserva el punto exacto de reanudación; no atribuye a la rama código que solo está en el espacio de trabajo.

## Qué está publicado

Rama: `codex/etapa19-fisica-ondas-mecanicas`, creada desde main `1da59851801fd377337c8be1e984850545ad71bb`.

- Propuesta de seis ideas y bancos por idea: commit `56049f78b500c1e5292a9bd048a0962a2576768d`.
- Pieza propia `nucleo/kit/piezas/fis-ondas-e19.js` y sus pruebas: commit `6868f5d97b951423537fff770b6017441d4a09cf`, último commit de implementación publicado antes de este informe.
- No se modificó main, no se abrió PR y no se puso calidad 2.

Oscilaciones, unidad anterior de la cola, está terminada en `codex/etapa11-fisica-oscilaciones`, commit `f9608fe54b2c74b752a96b4815966b08caee30e2`, con su informe «Listo para integrar».

## Trabajo local aún sin publicar

La primera idea, `la-cresta-avanza`, tiene siete momentos, quince ejemplos —cinco de cada nivel— y cuatro entradas de glosario. Distingue el avance del máximo del pulso del movimiento de una marca material; incluye pulsos transversales y longitudinales, recorridos locales y tiempos de llegada.

El archivo ensamblado local es `contenido/teoria/fisica/ondas-mecanicas.js`, 124 053 bytes, blob Git `aec478fd79d353a93e55c7bd9206cf897bbe98f8`. Conserva temporalmente las otras cuatro ideas antiguas. Sus dos pruebas locales son `ondas-mecanicas.test.js` y `ondas-propagacion.test.js`.

El fragmento fuente está en `work/cola-fisica/ondas-idea1.jsfrag`: 65 406 bytes; SHA256 `4373809def7914a1e6f475501407df47a351afaae20f6206b064de33a179afeb`. Ese es el último fragmento guardado y comprobado. Las correcciones visuales descritas abajo **todavía no se aplicaron**.

Se regeneraron localmente el catálogo de la app y el glosario de Física. No se tocaron archivos compartidos de lógica; la pieza es nueva y exclusiva de esta unidad. La comprobación de alcance no encontró cambios fuera de los archivos autorizados.

## Qué se comprobó

| Comprobación | Resultado antes del bloqueo |
|---|---|
| Pruebas propias de idea 1, oráculo y pieza | 18 pasan, 0 fallan |
| Prueba común `contenido/teoria/teoria.test.js` | 164 pasan, 0 fallan; 235,8 s |
| Simulación de calidad 2 para la primera idea y su glosario | Sin problemas, con 400 semillas; no modifica la marca de calidad |
| Cálculo independiente | 400 casos de Resuelve y 400 de Ahora tú, ejemplos, Predice, Mira, Regla y juego |
| Alternativas | Una correcta; errores calculados y valores distintos por fuerza bruta |
| Fórmulas | Igualdades numéricas y simbólicas evaluadas por un camino independiente, con controles negativos |
| Diversidad de los bancos de primera idea | 21 casos físicos de Resuelve y 99 de Ahora tú entre las 400 semillas de cada banco; bancos separados |
| Cinco familias avanzadas | 2000 variantes independientes sin coincidencias entre alternativas |
| Pieza visual | Incluida en las 18 pruebas: 400 estados transversales y 400 longitudinales |
| Catálogo | 8 cursos, 158 unidades, 260 plantillas; 70 ítems por forma |
| Capturas reales | 44 imágenes de momentos y ejemplos en claro y oscuro, abiertas individualmente |
| Medición de ecuaciones a 390 px | 48 pantallas y 446 renglones: 0 desbordes y 27 cortes en lugares inadecuados |

La suite completa de Ondas todavía no se ejecutó: corresponde al cierre de la unidad, después de las ideas restantes y la práctica.

Las capturas usaron Chrome y Playwright sobre los archivos de la app mediante interceptación local, porque el entorno bloquea el servidor HTTP. No se modificó el producto para capturarlo. Esto no verifica autenticación, sincronización, despliegue ni service worker. Las capturas normales enseñan la primera tarjeta de Lee y el primer paso de Mira y Resuelve; la medición de anchura sí recorre los demás pasos.

## Qué corrigió y qué encontró la revisión visual

Ya se corrigieron y recapturaron el párrafo de Regla que mostraba `[object Object]`, el color del reloj, la distinción entre marca material y círculo de arrastre, los rótulos de posiciones conocidas y las explicaciones de los distractores avanzados.

Quedaron pendientes estos cambios, detectados al abrir la última ronda:

1. Acortar etiquetas largas de las ecuaciones de los ejemplos 11–15 y separar despeje, sustitución y resultado en relaciones completas.
2. Evitar que el subíndice «viaje 2», los paréntesis o las unidades se partan entre renglones.
3. Compactar las sumas de recorrido de los ejemplos 7–8 y del banco generado.
4. Sustituir sucesiones con flechas por frases que describan el orden de las alturas.
5. Representar ambos lóbulos del pulso cuando la marca pasa por alturas positivas y negativas; el ejemplo 8 mostraba solo el positivo.
6. Mantener juntas las cifras y unidades del caso escrito en el párrafo de Regla.

Los cambios fueron asignados, pero el bloqueo impidió guardarlos. No se presentan como corregidos.

Capturas y mediciones locales: `work/cola-fisica/capturas-ondas-idea1/`, `ancho-ondas-idea1.json` y `ancho-ondas-idea1/`. Informes de lectura y contratos se conservan en la misma carpeta de trabajo.

## Investigación y decisiones

Se contrastó la investigación con el temario CEPRE-UNI y con OpenStax. La propuesta conserva potencia y energía de ondas viajeras, superposición, fronteras, estacionarias e intensidad sonora. La relación de energía media se limita a sus condiciones; no se aplica potencia viajera a una estacionaria ideal.

Se descartó enseñar coeficientes de reflexión/transmisión y reparto de potencia como ejercicios de esta unidad. El modelo interno sí deberá respetar continuidad y balance de potencia. Doppler, tubos y batidos quedan como ampliaciones. Las reservas antiguas de Predice 2 y 3 en un documento de planificación no sustituyen los casos de la propuesta final.

Se prepararon instrumentos independientes para energía y fronteras: el primero pasó 15 calibraciones y 400 variantes; el segundo, 400 semillas y 299 256 comprobaciones. **Son preparación matemática: aún no comprueban las ideas 3 y 4 de producción, que no se han escrito.**

No hay un conflicto crítico pendiente de decisión de Gerson. Su autorización de continuar sin esperar notas se mantiene.

## Reanudación y cola

1. Recuperar el entorno y leer el fragmento actual antes de editar.
2. Aplicar las seis correcciones visuales; actualizar el reconocimiento de símbolos del oráculo sin quitar comprobaciones y añadir la comprobación del perfil bipolar.
3. Ensamblar; ejecutar las pruebas propias; recapturar los afectados y repetir la medición de anchura.
4. Publicar la idea 1 y sus pruebas en esta rama, informar brevemente y seguir sin esperar notas.
5. Completar las otras cinco ideas, quince ejemplos por idea, práctica, ficha, prueba propia, reserva de curso y comprobación final.
6. Ejecutar la suite completa una vez, revisar el alcance, actualizar este informe y solo entonces declarar «Listo para integrar».

Después de Ondas: Fluidos → Temperatura y calor → Termodinámica → Electrostática → Corriente y circuitos → Magnetismo → Inducción electromagnética → Ondas electromagnéticas → Óptica geométrica → Física moderna. Cada unidad tendrá su rama propia desde main actualizado.
