# Informe de Oscilaciones — etapa 11

**Listo para integrar: sí, para la revisión de cierre.** La implementación y sus pruebas están terminadas al 26 de noviembre de 2026. Quedan la auditoría, lectura en frío y capturas de otra sesión. La suite completa no quedó verde por diez pruebas de conexión local bloqueadas por este entorno; no se modificaron sus archivos.

Unidad: `fisica.oscilaciones`. Rama: `codex/etapa11-fisica-oscilaciones`.
Base: `main` en `94f40db7ee81125c144f8bbbe2eca328d757f8ea`.
Último commit de implementación registrado al redactar: `3320fa2685d5a35971998f1d254e7dd4253621cd`.

## Qué se hizo

Se rehízo la unidad en seis ideas, conservando los cinco identificadores anteriores y añadiendo `ciclo-y-amplitud`. Cada idea tiene Lee, Juega, Predice, Mira, La regla, Así se resuelve, Ahora tú y quince ejemplos: **90 ejemplos**, cinco por nivel en cada idea. El glosario propio contiene **15 términos**, con una explicación sencilla y tres ejemplos por término; período y frecuencia se heredan del curso para no duplicarlos.

| Idea | Objeto | Misión | Predicción reservada |
| --- | --- | --- | --- |
| Medir un vaivén (`ciclo-y-amplitud`) | Bloque unido a un resorte horizontal, con equilibrio y extremos. | Lograr la primera llegada al extremo izquierdo a los 3 s. Se cumple con período de 6 s y reloj en 3 s. | Ocho ciclos en 4 s: cada ciclo dura 0,5 s. |
| El empuje del resorte (`aceleracion-al-centro`) | Bloque separado del equilibrio y fuerza del resorte al soltarlo. | Conseguir aceleración inicial de −2,4 m/s²; corresponde a +6 cm con los parámetros del juego. | Si la aceleración es −3 m/s² en +2 cm, en −6 cm es +9 m/s². |
| Un reloj para el movimiento (`graficas-mas`) | Bloque y gráfica de su posición, con tiempo y sentido visibles. | Encontrar el primer cruce del equilibrio hacia la izquierda. | Desde el extremo izquierdo y con período de 8 s, a los 2 s cruza el centro hacia la derecha. |
| El ritmo del bloque (`periodo-resorte`) | Bloque guiado y resorte; después se introducen el montaje vertical y dos resortes. | Conseguir un período que redondee a 0,63 s; el testigo usa rigidez de 50 N/m. | Cuadruplicar la masa en el mismo resorte cambia un período de 0,6 s a 1,2 s. |
| El péndulo simple (`pendulo`) | Pesa colgada, apoyo, vertical y longitud hasta el centro de masa. | Comparar masas de 40 y 80 g con la misma longitud de 25 cm y el mismo período aproximado. | Longitud de 40 a 90 cm y masa de 30 a 120 g: razón de períodos nuevo/inicial ≈ 1,5. |
| Energía durante el vaivén (`energia-mas`) | Bloque y resorte horizontal con barras de energía. | Conseguir energía mecánica de 0,9 J; corresponde a amplitud de 15 cm. | Con rigidez de 200 N/m y amplitud de 20 cm, la energía cinética en +10 cm es 3 J. |

Los dibujos se componen con `fis-estatica` y `ejes`, sin modificar sus renderizadores. Las comparaciones usan escalas comunes. El péndulo conserva la longitud entre apoyo y centro de la pesa; las barras de cada comparación usan la misma escala de energía. Los controles animados se redondean a la precisión visible antes de calcular dibujo, lectura y misión. Los estados iniciales de las figuras corresponden al enunciado, también cuando el dibujo se declara sin escala.

La unidad incluye **cuatro mesas de laboratorio**: «El resorte que oscila», «Al soltar el bloque», «Longitud y gravedad» y «La curva de la posición». Las escenas anteriores `mas` y `mas-horaria` quedan accesibles como mesas adicionales con `rehacer: true`.

## Práctica y prueba del curso

La plantilla nueva `fis-oscilaciones` tiene **18 tipos**, tres por idea, con `TIPOS_POR_IDEA`, filtros de idea y tipo, **20 referencias calculadas aparte** y **ocho problemas de papel**. El papel conserva los Datos del caso, sin fórmulas de resolución.

| Idea | Tipos de práctica |
| --- | --- |
| Ciclo y amplitud | `extremos-amplitud`, `conteo-periodo`, `recorrido-mixto`. |
| Fuerza y aceleración | `fuerza-posicion`, `aceleracion-masa`, `masa-dos-estados`. |
| Gráficas | `estado-cuartos`, `velocidad-fase`, `primer-paso`. |
| Período del resorte | `resorte-periodo`, `resorte-vertical`, `resortes-conectados`. |
| Péndulo | `pendulo-periodo`, `pendulo-razon`, `pendulo-longitud`. |
| Energía | `energia-total`, `rapidez-posicion`, `amplitud-desde-estado`. |

Se añadieron **dos pares A/B a la reserva del curso**: `osc-01`, sobre equilibrio vertical y cambio de masa, y `osc-02`, sobre conteo de oscilaciones y cambios de longitud y gravedad. Se conservan los diez pares activos y el par anterior `fis-19`. Los seis errores de los pares nuevos se documentan como hipótesis, junto con los errores de teoría y práctica, en `errores-fisica.md`.

## Qué se comprobó

Los oráculos recalculan desde las entradas, sin tomar la respuesta ni las alternativas como resultado esperado. Usan conteos de intervalos, balances de fuerza, integración RK4 con detección de cruces, trabajo obtenido del área de la fuerza y bisección de balances energéticos. Los análisis de ecuaciones evalúan también sustituciones y pasos con letras, y comprueban la precisión que efectivamente ve el alumno. Los redondeos se distinguen de las igualdades exactas.

En teoría se recorrieron **400 semillas de Resuelve y 400 de Ahora tú por idea**, además de los 90 ejemplos, predicciones, misiones y estados animados. Se verificaron alternativas únicas antes y después del formato, operaciones de distractores, explicaciones `siFuera`, condiciones físicas y separación de bancos. La revisión corrigió longitudes que una figura añadía sin estar dadas, redondeos escritos como igualdades, estados iniciales mal situados y cruces entre rótulos y trazos.

La práctica se comprobó en **7200 casos**, correspondientes a 400 semillas por cada uno de los 18 tipos, con **28 800 alternativas y 38 400 igualdades o relaciones visibles**. Sus veinte referencias se reconstruyeron desde las entradas; los ocho papeles tienen además 32 opciones y 46 igualdades contrastadas. La prueba comprueba que el archivo de papel coincide con el armado por el generador.

| Comprobación | Resultado registrado |
| --- | --- |
| Agregado de pruebas propias de teoría y laboratorio | **27/27 verdes**. |
| Contratos y oráculo independiente de `fis-oscilaciones` | **64/64 verdes**; incluye el barrido de 7200 casos. |
| Integración de catálogo, avance, práctica y pares nuevos | **8/8 verdes**. |
| Pruebas comunes de avance y repaso | **52/52 verdes**. |
| Validador de la unidad completa con calidad 2 simulada | **Cero problemas en 400 semillas**; no se asignó esa marca. |
| Laboratorios: figuras, dinámica y misiones | 9612 figuras, 400 estados contrastados con RK4 y 12 misiones, sin errores en el oráculo. |
| Péndulo: contraste independiente y geometría final | 15 ejemplos, 800 casos, 2402 ecuaciones, 2025 opciones y 1544 escenas; cero fallos. |
| Suite completa, `npm run test:corto`, ejecutada una vez | **12 606 pasan, 7 omitidas, 11 fallan; 12 624 pruebas, 681,7 s.** Una falla propia detectó que 18 s aparecía en el enunciado de `osc-02B`: se corrigió a 24 s y pasaron el oráculo independiente de cuatro formas y 16 opciones, la prueba de fuga y los verificadores de ambos pares. Las otras diez fallas son de conexión local en `nucleo/sesion.test.js`, fuera del alcance de la unidad. |
| Capturas y revisión visual a 390 px | **Pendientes**; no se obtuvieron ni se miraron capturas. |

Las pruebas portables están junto a la teoría y en la plantilla. Los scripts y resultados auxiliares de los oráculos quedan fuera del repositorio. La revisión de geometría comprueba rótulos contra rótulos, objetos, cuerdas, guías y cotas; no equivale a inspeccionar el producto en un navegador.

La tanda de siete archivos de integración y pruebas comunes terminó con 135 pruebas verdes y la misma falla de `osc-02B`; esa única prueba se repitió tras la corrección y quedó verde. El catálogo se regeneró después. Los diez fallos restantes de la suite completa están en `nucleo/sesion.test.js`, líneas 79, 109, 143, 179, 219, 246, 280, 306, 349 y 368: inicio de sesión, renovación, sincronización, cierre y funciones de profesor. Todos usan el servidor falso local y recibieron «No hay conexión con el servidor». La comprobación independiente de localhost devolvió `EACCES`; no se alteró la suite para ocultarlos ni se repitió completa.

## Investigación tomada y descartada

Se usaron la investigación breve de etapa 11, su LEEME y las pautas de las etapas 9–12; la investigación larga de Física no estaba en la base consultada. Se conservó el objeto físico antes de la fórmula, la distinción entre fuerza y velocidad, la comparación de sistemas y las advertencias sobre el equilibrio vertical y el péndulo pequeño. Se reorganizó el contenido en seis ideas para enseñar ciclo y amplitud antes de fase y ecuaciones horarias.

OpenStax 15.1–15.4 sustenta los modelos de fuerza, energía, proyección circular y péndulo. UCSB y MIT se usaron para contrastar las condiciones de las conexiones de resortes; no se trasladó la errata numérica de la demostración de UCSB. El trabajo de Tumanggor y colaboradores se usa como contexto sobre dificultades conceptuales, sin convertir sus resultados en frecuencias de error de postulantes peruanos ni presentar nuestros distractores como preguntas validadas. El reglamento UNMSM 2023-I aporta evidencia curricular histórica, sin afirmarlo vigente en 2026. Las referencias están en `propuesta-fisica.md`.

Se descartaron las fórmulas dentro de Datos por la instrucción actual de Gerson; también la energía del resorte vertical dentro de la idea 6, las redes mixtas de resortes, la masa efectiva del resorte, el péndulo físico o cónico y las ecuaciones de amortiguamiento. Los valores son modelos didácticos declarados. La moneda del BCRP quedó como alternativa documentada en la propuesta y no se incorporó a los ejercicios finales. No se inventaron mediciones locales.

## Decisiones tomadas y dudas para Gerson

1. Añadir la entrada de ciclo y amplitud, conservando los cinco identificadores anteriores. La migración mantiene el estudio anterior y deja pendiente la idea nueva.
2. Dar en Datos entradas, condiciones, unidades y equivalencias; las relaciones y despejes se enseñan en Mira, La regla y las soluciones. La instrucción actual prevalece sobre los documentos antiguos que pedían fórmulas en ese recuadro.
3. Reutilizar las piezas existentes con composiciones propias, escalas comunes y precisión compartida entre controles, lecturas y dibujos. Las incógnitas no se dibujan a escala junto a medidas conocidas.
4. Mantener el resorte vertical y dos resortes ideales en la idea 4, distinguiendo deformación y desplazamiento desde el equilibrio; estudiar la energía solo en horizontal en la idea 6.
5. Tratar el péndulo como aproximación de ángulo pequeño, con longitud hasta el centro de masa. Comparar masa y longitud por separado antes de combinarlas en Predice, y distinguir aceleración tangencial de aceleración total.
6. Conservar la notación de energías del curso y la paleta declarada para esta unidad. La energía mecánica pertenece al sistema bloque-resorte; obtener una rapidez no determina el sentido del movimiento.

No se identificó un conflicto crítico con una decisión escrita de Gerson. Quedan para sus notas el ritmo de las seis ideas y la comodidad de lectura en el celular. La revisión visual de Claude y la auditoría y lectura en frío de otra sesión siguen pendientes; este informe no las sustituye.

## Archivos y bloques compartidos

La teoría vive en `contenido/teoria/fisica/oscilaciones.js`. Sus nueve archivos de pruebas son `oscilaciones.test.js`, `oscilaciones-ciclo.test.js`, `oscilaciones-aceleracion.test.js`, `oscilaciones-graficas.test.js`, `oscilaciones-resorte.test.js`, `oscilaciones-pendulo.test.js`, `oscilaciones-energia.test.js`, `oscilaciones-laboratorio.test.js` y `oscilaciones-integracion.test.js`.

La plantilla propia añade `plantillas/fis-oscilaciones/plantilla.json`, `generador.js`, `generador.test.js`, `oraculo.test.js`, `casos.json` y `papel.json`. Los documentos propios de etapa 11 son `propuesta-fisica.md`, `errores-fisica.md` y este `informe-fisica.md`.

La lista de archivos compartidos modificados es:

| Archivo | Bloque propio modificado |
| --- | --- |
| `catalogo/cursos/fisica.json` | Ficha de Oscilaciones: práctica nueva primero y escenas antiguas después; se conservan temas y requisitos. |
| `catalogo/pruebas/fisica.json` | Pares de reserva `osc-01` y `osc-02`, con sus errores. |
| `catalogo/pruebas/verificar.js` | Dos verificadores propios para esos pares. |
| `nucleo/avance.js` | Bloque de Oscilaciones con marcas `prediccionOSC` y `estudiadaOSC`: renueva predicciones antiguas sin huella, conserva el estudio y no completa la idea nueva. |
| `plantillas/mas/plantilla.json` | Marca `rehacer: true`. |
| `plantillas/mas-horaria/plantilla.json` | Marca `rehacer: true`. |

Se regeneraron para comprobar el catálogo `app/datos/catalogo.json`, `app/datos/glosario/fisica.json` y `app/datos/pruebas.json`; son salidas generadas incluidas en la rama para que el sitio publique los datos actualizados. No se modificaron las piezas compartidas, `nucleo/repaso-tipos.js` ni los archivos prohibidos; tampoco se alteraron las reglas generales de validación. No se asignó `calidad: 2`, no se integró a `main` y no se abrió un PR.

## Límites del entorno y cierre

Playwright no está instalado y la comprobación del servidor propio devolvió `connect EACCES 127.0.0.1:4199`. El servidor se cerró por su PID. Por ello faltan capturas reales, modo oscuro, interacción táctil, lectura a 390 px y medición visual de los renglones de ecuaciones. No se afirma que esas pantallas se hayan visto bien.

La rama de trabajo es `codex/etapa11-fisica-oscilaciones`. El commit de implementación y catálogo es `3320fa2685d5a35971998f1d254e7dd4253621cd`; este informe se entrega en un commit posterior. No hay pendientes numéricos conocidos de la unidad. La sesión de cierre debe ejecutar las pruebas con conexión local disponible y revisar las capturas antes de conceder calidad 2. **Listo para integrar.**
