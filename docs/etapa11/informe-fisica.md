# Informe de Oscilaciones — etapa 11

**Listo para integrar: sí, para la auditoría y lectura en frío de otra sesión.** La unidad conserva su calidad sin marcar 2. Las pruebas propias y la revisión visual están cerradas; quedan diez fallos de conexión de las pruebas de sesión, ajenos a esta unidad.

Unidad: `fisica.oscilaciones`. Rama: `codex/etapa11-fisica-oscilaciones`.
Base actualizada: `main` en `1da59851801fd377337c8be1e984850545ad71bb`.
La práctica revisada se publicó en `0bd76c1015b1e1802fc7ab4c07f789025a2eeda5`.
Último commit de implementación: `456c67932adcd1d187f15d788722e42538876d2d`; este informe se publica en un commit posterior.

Esta entrega retoma la unidad construida anteriormente y aplica la actualización del encargo del 27 nov. Se revisó la redacción con `docs/metodo/unidad/redaccion-delegada.md`, punto 4, y con `fisica.movimiento-parabolico-y-circular` de la base actual como modelo. La unidad no tiene `calidad: 2`; la revisión de cierre y la concesión de esa marca corresponden a otra sesión.

## Qué se hizo

La unidad tiene **seis ideas y 90 ejemplos**, quince por idea y cinco por nivel. Conserva los cinco identificadores originales y añade `ciclo-y-amplitud`. Cada idea contiene Lee, Juega, Predice, Mira, La regla, Así se resuelve y Ahora tú.

| Idea | Objeto | Misión | Predicción reservada |
| --- | --- | --- | --- |
| Medir un vaivén (`ciclo-y-amplitud`) | Bloque unido a un resorte horizontal, con equilibrio y extremos. | Lograr la primera llegada al extremo izquierdo a los 3 s; corresponde a un período de 6 s. | Ocho ciclos en 4 s: cada ciclo dura 0,5 s. |
| El empuje del resorte (`aceleracion-al-centro`) | Bloque separado del equilibrio y fuerza del resorte al soltarlo. | Conseguir una aceleración inicial de −2,4 m/s²; corresponde a una elongación de +6 cm con los parámetros del juego. | Si la aceleración es −3 m/s² en +2 cm, en −6 cm es +9 m/s². |
| Un reloj para el movimiento (`graficas-mas`) | Bloque y gráfica de posición, con tiempo y sentido visibles. | Encontrar el primer cruce del equilibrio hacia la izquierda. | Desde el extremo izquierdo y con período de 8 s, a los 2 s cruza el centro hacia la derecha. |
| El ritmo del bloque (`periodo-resorte`) | Bloque guiado y resorte; después se presentan el montaje vertical y dos resortes. | Conseguir un período que redondee a 0,63 s; el testigo usa una rigidez de 50 N/m. | Cuadruplicar la masa en el mismo resorte cambia un período de 0,6 s a 1,2 s. |
| El péndulo simple (`pendulo`) | Pesa colgada, apoyo, vertical y longitud hasta el centro de masa. | Comparar masas de 40 y 80 g con la misma longitud de 25 cm y el mismo período aproximado. | Al cambiar la longitud de 40 a 90 cm y la masa de 30 a 120 g, la razón de períodos nuevo/inicial es aproximadamente 1,5. |
| Energía durante el vaivén (`energia-mas`) | Bloque y resorte horizontal con barras de energía. | Conseguir una energía mecánica de 0,9 J; corresponde a una amplitud de 15 cm. | Con rigidez de 200 N/m y amplitud de 20 cm, la energía cinética en +10 cm es 3 J. |

La redacción explica el significado de los términos, el motivo de las relaciones y cómo interpretar el resultado. Las reglas y las condiciones desarrollan sus supuestos; los pasos explican las operaciones, y las alternativas identifican el razonamiento equivocado. La fase acumulada se obtiene multiplicando frecuencia angular por tiempo antes de sumarla a la fase inicial. Los ejemplos difíciles explican sus despejes y el motivo de sus errores.

La revisión cruzada corrigió precisiones del texto: el distractor de rigidez nombra la operación que realmente calcula; un resorte comprimido ejerce una fuerza hacia el equilibrio sin describirse siempre como si tirara; y una rapidez positiva no permite afirmar que el bloque se esté alejando. Las tarjetas de nivel 3 añaden una explicación de su caso al resumen de alternativas, sin introducir un paso adicional.

El glosario propio conserva **15 términos**. Período, frecuencia y punto de retorno se aprovechan del glosario del curso; este último ya está definido en Gravitación. Se incorpora **amortiguamiento** como disminución del vaivén real que el modelo ideal desprecia, con un ejemplo de columpio y sin añadir ecuaciones de amortiguamiento. Las entradas respetan los límites propios del glosario: 14 palabras en la explicación simple, 20 en la definición y 20 en cada ejemplo.

Los dibujos se componen con `fis-estatica` y `ejes`, sin crear una pieza nueva ni modificar sus renderizadores. Las comparaciones conservan escalas comunes; la longitud del péndulo llega al centro de la pesa. Lectura, dibujo y misión parten de la misma precisión visible de los controles.

La unidad incluye **cuatro mesas de laboratorio**: «El resorte que oscila», «Al soltar el bloque», «Longitud y gravedad» y «La curva de la posición». Las escenas anteriores `mas` y `mas-horaria` se conservan como mesas adicionales con `rehacer: true`.

## Práctica y prueba del curso

La plantilla propia `fis-oscilaciones` contiene **18 familias**, tres por idea, con `TIPOS_POR_IDEA`, filtros de idea y tipo, **20 referencias calculadas aparte** y **ocho problemas de papel**. Los pasos y las explicaciones de error de la práctica se desarrollaron también. Datos mantiene valores, condiciones y equivalencias; no se añadieron fórmulas para resolver el ejercicio.

| Idea | Familias de práctica |
| --- | --- |
| Ciclo y amplitud | `extremos-amplitud`, `conteo-periodo`, `recorrido-mixto`. |
| Fuerza y aceleración | `fuerza-posicion`, `aceleracion-masa`, `masa-dos-estados`. |
| Gráficas | `estado-cuartos`, `velocidad-fase`, `primer-paso`. |
| Período del resorte | `resorte-periodo`, `resorte-vertical`, `resortes-conectados`. |
| Péndulo | `pendulo-periodo`, `pendulo-razon`, `pendulo-longitud`. |
| Energía | `energia-total`, `rapidez-posicion`, `amplitud-desde-estado`. |

Los dos pares A/B propios permanecen en la reserva del curso: `osc-01`, sobre equilibrio vertical y cambio de masa, y `osc-02`, sobre conteo de oscilaciones y cambios de longitud y gravedad. No sustituyen los diez pares activos ni el par anterior `fis-19`. Sus seis errores, junto con los de teoría y práctica, se documentan como hipótesis en `docs/etapa11/errores-fisica.md`.

## Qué se comprobó en esta revisión

Se distingue la conservación de los casos de la verificación independiente de la física: comparar contra una entrega anterior comprueba qué cambió, pero no demuestra por sí solo que una afirmación nueva sea correcta. Las comparaciones de igualdad indicadas a continuación corresponden a fases concretas de la revisión. Los ajustes visuales posteriores cambian intencionalmente rótulos, colores, conversiones necesarias de Datos y referencias de estado; no se afirma que las figuras o Datos definitivos sean idénticos a la primera entrega. Se conservan los valores físicos de los casos.

| Comprobación actual | Evidencia de la revisión |
| --- | --- |
| Conservación durante la primera pasada de redacción | **4800 generaciones y 90 ejemplos**, comparados con la entrega anterior: casos, datos, respuestas, alternativas y figuras conservados en esa fase, antes de los ajustes visuales posteriores. |
| Lectura cruzada del texto añadido | Se revisaron ejemplos difíciles y al menos 20 semillas por familia. En Péndulo y Energía se contrastaron además **406 afirmaciones de signo, sentido y comparación**, sobre 30 ejemplos y 400 casos, sin fallos; las precisiones textuales encontradas se corrigieron. |
| Conservación de la práctica y el papel | **7208 casos y 28 832 opciones**: Datos, preguntas, entradas, respuestas, valores, colores y ecuaciones iguales a los originales. |
| Pruebas de la práctica revisada | **64 pasan, 0 fallan**. Incluyen el cálculo independiente en 400 semillas por familia, la evaluación de igualdades, alternativas únicas y coincidencia del papel generado. |
| Primera corrección de ancho de Gráficas y Período del resorte | **1630 casos y 5190 ecuaciones** contrastados después de separar relaciones completas; se conservaron los datos y elementos del caso comparados en esa edición. La lectura visual posterior sigue generando ajustes de presentación. |
| Ajustes de ancho de Péndulo y Energía | **7370 invariantes** conservados en 30 ejemplos y 400 semillas por momento e idea; **14 pruebas propias pasan** con sus oráculos independientes. |
| Glosario y topes de texto | Se usó el contador del núcleo; las entradas revisadas no presentan problemas en `G.revisar`. Los topes ampliados de teoría no se trasladaron a las definiciones del glosario. |
| Pruebas propias del ensamblado anterior a los últimos ajustes visuales | **100 pasan, 0 fallan**. Este resultado no certifica cambios aplicados después de esa ejecución. |
| Pruebas comunes ejecutadas | **223 pasan, 0 fallan**, en **502 032,5767 ms**. |
| Catálogo | Generación completada correctamente; su comprobación definitiva se registra con las pruebas focalizadas del cierre. |

Las ecuaciones largas se distribuyeron entre relaciones completas, conservando la magnitud y su valor en cada igualdad. En los radicales de rapidez entre dos estados se muestran por separado la relación, la sustitución y la raíz final. Los enunciados que cortaban después de un igual ahora presentan los datos en prosa, manteniendo sus nodos y colores.

Las pruebas propias que fijaban aperturas literales o topes antiguos se adaptaron al contrato vigente. Se conservaron la comprobación de respuestas y errores, la unicidad de alternativas y la evaluación numérica de las ecuaciones. Los evaluadores incorporan los nombres abreviados usados en las fórmulas y las magnitudes intermedias calculadas por el propio oráculo; no se omiten igualdades para hacer pasar la revisión.

La suite completa se ejecutó **una sola vez** en esta revisión, antes de los últimos ajustes visuales. El resumen canónico de Node registra **13 237 pruebas: 13 219 pasan, 11 fallan y 7 se omiten**, en **889 133,3145 ms**. El encabezado del reporter que muestra 13 226 incluye las siete omitidas; no representa 13 226 pruebas aprobadas.

Diez fallos corresponden al servidor local bloqueado de `nucleo/sesion.test.js`, en las líneas 79, 109, 143, 179, 219, 246, 280, 306, 349 y 368. No se modificaron esas pruebas ni el código de sesión.

El otro fallo fue una copia local incompleta: faltaba `docs/investigacion/etapa9/quimica.reacciones-y-balance.md`, requerido como fuente por la práctica de Reacciones. Se restauraron sus **80 741 bytes exactos** desde la base `main`, con blob SHA `4cdd561a57b917893163062bb02a94e512846ea9`; no se editó el contenido de Química. La repetición acotada de `plantillas/reacciones-practica/generador.test.js` terminó con **9 pasan, 0 fallan**, en **1882,5067 ms**.

No se repite la suite completa por los cambios de presentación posteriores. El cierre requiere pruebas focalizadas de los archivos propios afectados, además del catálogo y la simulación del validador sobre el ensamblado definitivo.

Después de corregir las capturas, `npm run -s test:corto -- 'contenido/teoria/fisica/oscilaciones*.test.js' 'plantillas/fis-oscilaciones/*.test.js'` terminó con **100 aprobadas y cero fallos** (6314,3218 ms). Incluye los oráculos independientes, los 400 casos por banco y la simulación del validador con calidad 2 en 400 semillas, sin asignar esa marca.

El último ajuste de una frase para mantener la unidad junto a la fase se comprobó de nuevo con `oscilaciones-graficas.test.js` y `oscilaciones.test.js`: **9 aprobadas, cero fallos** (2899,1808 ms), incluido el validador de la unidad completa. `npm run -s catalogo` finalizó correctamente: 8 cursos, 158 unidades y 261 plantillas; el banco conserva 7 cursos y 70 ítems por forma.

No se repitió la suite completa. Los cambios posteriores fueron propios de la presentación de Oscilaciones y se verificaron con sus pruebas correspondientes. No se modificaron las pruebas de sesión ni de Química.

## Capturas reales y ancho de ecuaciones

Ahora sí se ejecuta la app real en **Chrome mediante Playwright**. Un transporte temporal responde con los bytes del checkout a las solicitudes de la app, sin servidor HTTP ni solicitudes externas. Se revisan el DOM, el SVG, el CSS y las ecuaciones del producto. El modo `--entera` aplica únicamente para la captura un ajuste de CSS que deja la figura y la barra en posición estática; así pueden fotografiarse en la página completa. Ese ajuste temporal no se escribe en los estilos de producción.

La primera medición recorrió **122 pantallas y 1028 renglones a 390 px**. Detectó tres desbordes de radicales y 48 cortes de línea. Se abrieron sus 51 capturas y se ajustaron los seis fragmentos de teoría. Esa medición describe el estado anterior a las correcciones; no es el resultado final de ancho.

Durante la instrumentación se localizó un error en el estado artificial sembrado por las herramientas: faltaba el diccionario `ideas`. La corrección se aplica únicamente al compilar las herramientas de captura en el preload temporal, exigiendo una coincidencia exacta. No se modificaron la app, Storage, las migraciones ni los archivos compartidos de herramientas. La reproducción con el estado corregido abrió la teoría sin ese error; las tandas finales también terminaron sin errores de página.

La medición con `ecuaciones-ancho.js fisica.oscilaciones --ancho=390 --casos=12 --momentos=lee,juega,predice,mira,regla,resuelve,ahora-tu,ejemplos` cubrió **196 pantallas y 1351 renglones: cero desbordes, cortes detectados o avisos**. Resultado: `work/cola-fisica/ancho-oscilaciones-390-entrega.json`.

Después del último ajuste del enunciado de Gráficas, se repitió la función original `medirPagina` en las cuatro páginas afectadas, en claro y oscuro: **274 renglones y cero hallazgos**. Resultado: `work/cola-fisica/medicion-recapturas-final.json`. La inspección de imágenes corrigió también detalles que este medidor no detectaba, como una unidad separada de su fracción.

Se tomaron **264 capturas en claro y oscuro**. El registro `work/cola-fisica/transporte-local-14084.json` termina con salida 0 y registra **cero errores JavaScript, recursos ausentes o solicitudes bloqueadas**. Estos resultados describen la toma de imágenes, no la aprobación final de todas sus pantallas.

Se cerró la lectura de las 264 imágenes. Se corrigieron rótulos que mostraban `true`, el color de la aceleración desconocida, cortes de ecuaciones y unidades, equivalencias de Datos y la referencia temporal de Mira de Energía. Se regeneraron las 60 imágenes afectadas y se volvieron a mirar; las cuatro del último enunciado se revisaron también tras su ajuste final. No quedan hallazgos visuales conocidos en las seis ideas.

Comando utilizado: `node -r ./work/cola-fisica/preload-app-local.cjs ./work/Mesa-Fisica-Cola/herramientas/capturas-teoria.js fisica.oscilaciones ./work/cola-fisica/capturas-oscilaciones momentos,ejemplos --oscuro --entera --lector`. La repetición selectiva usa esa misma herramienta desde un wrapper temporal, sin modificar archivos del proyecto.

Carpeta temporal: `C:/Users/Gerson/Documents/Codex/2026-11-22/new-chat-13/work/cola-fisica/capturas-oscilaciones/`. Son **264 imágenes distintas: 7 momentos y 15 ejemplos por cada una de las 6 ideas, en ambos temas**. Las 18 copias de tarjetas para el lector están sincronizadas en `lector/`. Cada imagen fue abierta por un revisor del equipo; el responsable también inspeccionó muestras y correcciones concretas.

| Idea | Captura representativa dentro de la carpeta |
| --- | --- |
| Ciclo y amplitud | `claro-cel-ciclo-y-amplitud-5-regla.png` |
| Fuerza y aceleración | `claro-cel-aceleracion-al-centro-6-resuelve.png` |
| Gráficas | `claro-cel-ej-graficas-mas-06.png` |
| Período del resorte | `oscuro-cel-ej-periodo-resorte-14.png` |
| Péndulo | `claro-cel-ej-pendulo-08.png` |
| Energía | `oscuro-cel-energia-mas-4-mira.png` |

Las ejecuciones completas y las recapturas terminaron sin errores JavaScript, recursos ausentes ni solicitudes bloqueadas; el registro de la última es `work/cola-fisica/transporte-local-16112.json`. Los navegadores se cerraron. Las capturas de Mira y Así se resuelve muestran su primer paso; el medidor recorrió sus pasos restantes y los oráculos verificaron sus cuentas, pero no se afirma haber fotografiado todas las combinaciones de controles o animaciones. Los laboratorios no están incluidos en esta tanda de imágenes.

Las capturas y registros permanecen en `work/cola-fisica/`, fuera del repositorio. El uso de este transporte **no prueba despliegue, red, autenticación, sincronización, service workers ni funcionamiento sin conexión de la PWA**. Tampoco sustituye una lectura en frío por alumnos. La antigua afirmación de que este entorno no podía obtener capturas ha quedado superada por esta vía de revisión visual; el alcance de las pruebas de red sigue siendo distinto.

## Evidencia de la entrega anterior

La primera implementación partió de `94f40db7ee81125c144f8bbbe2eca328d757f8ea` y se entregó en la rama hasta `5a9c2cd06d9a6a6323c0b8e270227fc499877885`. Sus oráculos independientes usan conteos de intervalos, balances de fuerza, integración RK4 con detección de cruces, trabajo obtenido del área de la fuerza y bisección de balances energéticos. Las pruebas portables siguen junto a la teoría y a la plantilla.

En aquella entrega se registraron 400 semillas de Resuelve y 400 de Ahora tú por idea, los 90 ejemplos y las misiones. La práctica recorrió 7200 casos, 28 800 alternativas y 38 400 igualdades o relaciones visibles; el papel añadió 32 alternativas y 46 igualdades. También se documentaron 9612 figuras de laboratorio y 400 estados contrastados con RK4.

La suite completa de esa base anterior registró **12 606 pasan, 7 omitidas y 11 fallan**, de 12 624 pruebas, en 681,7 s. Una falla propia detectó 18 s en el enunciado de `osc-02B`; se corrigió a 24 s y se repitieron sus verificaciones acotadas. Las otras diez fallas correspondían a pruebas de conexión local de `nucleo/sesion.test.js`, cuyo servidor falso no era accesible en ese entorno.

Estos resultados históricos no certifican el texto nuevo ni la base actual. El estado de la entrega revisada es el de las comprobaciones finales consignadas arriba; no se presume que los fallos de conexión anteriores sigan existiendo ni que hayan quedado resueltos.

## Investigación tomada y descartada

Se utilizaron la investigación breve de etapa 11, su LEEME y las pautas de las etapas 9–12. En la base actual tampoco existe una investigación larga de Oscilaciones; la breve es idéntica a la utilizada en la primera entrega. No se incorporaron nuevas fuentes en esta revisión editorial.

Se conservaron el objeto físico antes de la fórmula, la distinción entre fuerza y velocidad, la comparación de sistemas y las advertencias sobre el equilibrio vertical y el péndulo pequeño. El contenido se organiza en seis ideas para enseñar ciclo y amplitud antes de fase y ecuaciones horarias.

Las fuentes ya registradas en `propuesta-fisica.md` mantienen sus límites: OpenStax 15.1–15.4 sustenta los modelos de fuerza, energía, proyección circular y péndulo; UCSB y MIT se usaron para contrastar las conexiones de resortes, sin trasladar la errata numérica detectada en la demostración de UCSB. Tumanggor y colaboradores aporta contexto sobre dificultades conceptuales fuera del Perú; no valida estos distractores ni estima su frecuencia entre postulantes peruanos. El reglamento UNMSM 2023-I es evidencia curricular histórica, no una afirmación sobre el temario vigente.

Se descartaron las fórmulas dentro de Datos, la energía del resorte vertical en la idea 6, las redes mixtas de resortes, la masa efectiva del resorte y los péndulos físico o cónico. El amortiguamiento se menciona para explicar el límite del modelo ideal, sin desarrollar sus ecuaciones. Los valores son supuestos didácticos declarados. La moneda del BCRP quedó como alternativa documentada en la propuesta y no se incorporó a los ejercicios finales; no se inventaron mediciones locales.

## Decisiones tomadas y dudas para Gerson

1. Mantener seis ideas y los identificadores anteriores, con una entrada nueva para ciclo y amplitud. La migración conserva el estudio previo y no completa automáticamente la idea añadida.
2. Aplicar el modelo de redacción de Movimiento parabólico y circular: significado, razón y caso. La ampliación de los topes se usa para explicar las operaciones y sus límites, sin agregar fórmulas a Datos.
3. Recuperar los cambios propios sobre el main actualizado, con sus subíndices y reglas vigentes. El glosario hereda punto de retorno de Gravitación e incorpora amortiguamiento sin duplicar términos.
4. Conservar el resorte vertical y dos resortes ideales en la idea 4, distinguiendo longitud natural, equilibrio y desplazamiento. La energía de la idea 6 permanece limitada al sistema horizontal.
5. Mantener el péndulo como aproximación de ángulo pequeño, con longitud hasta el centro de la pesa, y distinguir aceleración tangencial de aceleración total.
6. Continuar después con **Ondas mecánicas, etapa 19**, antes de retomar Fluidos. La cola pedagógica indicada no sigue el orden numérico de las etapas.

No se identificó un conflicto crítico con una decisión escrita de Gerson. La auditoría y la lectura en frío de otra sesión siguen pendientes. Sus observaciones deberán considerar el texto y las capturas finales, no las versiones anteriores.

## Archivos y bloques compartidos

La teoría vive en `contenido/teoria/fisica/oscilaciones.js`. Sus pruebas propias son:

- `contenido/teoria/fisica/oscilaciones.test.js`
- `contenido/teoria/fisica/oscilaciones-ciclo.test.js`
- `contenido/teoria/fisica/oscilaciones-aceleracion.test.js`
- `contenido/teoria/fisica/oscilaciones-graficas.test.js`
- `contenido/teoria/fisica/oscilaciones-resorte.test.js`
- `contenido/teoria/fisica/oscilaciones-pendulo.test.js`
- `contenido/teoria/fisica/oscilaciones-energia.test.js`
- `contenido/teoria/fisica/oscilaciones-laboratorio.test.js`
- `contenido/teoria/fisica/oscilaciones-integracion.test.js`

La plantilla propia comprende `plantillas/fis-oscilaciones/plantilla.json`, `generador.js`, `generador.test.js`, `oraculo.test.js`, `casos.json` y `papel.json`. La documentación propia comprende `docs/etapa11/propuesta-fisica.md`, `errores-fisica.md`, este `informe-fisica.md` y `rutinas/redaccion/fisica.oscilaciones.md`.

| Archivo compartido | Bloque propio de Oscilaciones |
| --- | --- |
| `catalogo/cursos/fisica.json` | Ficha de la unidad: práctica nueva primero y escenas antiguas después; se conservan temas y requisitos. |
| `catalogo/pruebas/fisica.json` | Pares de reserva `osc-01` y `osc-02`, con sus errores. |
| `catalogo/pruebas/verificar.js` | Dos verificadores propios para esos pares. |
| `nucleo/avance.js` | Marcas `prediccionOSC` y `estudiadaOSC`: renueva predicciones antiguas sin huella, conserva el estudio y no completa la idea nueva. |
| `plantillas/mas/plantilla.json` | Marca `rehacer: true`. |
| `plantillas/mas-horaria/plantilla.json` | Marca `rehacer: true`. |

Las salidas del catálogo correspondientes son `app/datos/catalogo.json`, `app/datos/glosario/fisica.json` y `app/datos/pruebas.json`. No se modificaron las piezas compartidas, `nucleo/repaso-tipos.js`, las reglas generales del validador ni los archivos prohibidos. El preload y los ajustes del estado artificial de capturas son instrumentación temporal fuera del repositorio.

La entrega se publica en la rama propia para su revisión. No se concede `calidad: 2`, no se integra a `main` y no se abre un pull request.


**Listo para integrar.**
