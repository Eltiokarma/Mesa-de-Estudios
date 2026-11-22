# Informe de Gravitación universal — etapa 10

Unidad: `fisica.gravitacion`. Rama: `codex/etapa10-fisica-gravitacion`.
Base: `main` en `94f40db7ee81125c144f8bbbe2eca328d757f8ea`.
Fecha: 22 de noviembre de 2026.

**Estado:** implementación publicada para revisión. Las comprobaciones específicas están en verde; el cierre de la suite general y la inspección visual siguen pendientes por las limitaciones del entorno descritas abajo. No se asignó `calidad: 2`.

## Entrega

Se rehízo la unidad siguiente a Impulso y choques en el orden del catálogo. Gerson autorizó continuar sin la pausa para notas y publicar en una rama propia. No se integró a `main`, no se abrió un PR y no se modificaron ramas ajenas.

La unidad tiene seis ideas: ley universal, campo y altura, energía gravitatoria, órbitas circulares, leyes de Kepler y escape. Cada una contiene los ocho momentos y 15 ejemplos: 90 en total, repartidos en cinco por nivel. Se conservaron los cuatro identificadores anteriores y se agregaron energía y escape. Hay 20 entradas de glosario; dos aclaraciones locales distinguen la energía gravitatoria general del modelo cercano a la superficie sin cambiar el glosario de Trabajo y energía.

Se creó la pieza propia `fis-gravitacion` para comparaciones de distancias, fuerzas, campos y órbitas. Las flechas comparables usan la misma escala; las elipses muestran su foco y los sectores siguen el tiempo orbital. La mesa 3D reutiliza `fis-espacio-3d`, con cálculos propios de posición, velocidad y período. Las escenas heredadas permanecen accesibles en «Más mesas del tema» y llevan `rehacer`.

La práctica propia `fis-gravitacion` contiene 18 tipos, tres por idea, con `TIPOS_POR_IDEA`, filtros de idea y tipo y niveles que aumentan operaciones o decisiones. Incluye 20 casos calculados por separado y ocho problemas de papel con sus Datos. Se añadieron dos pares A/B a la reserva de la prueba del curso: comparación de períodos y rapidez residual de escape. No se cambió la selección activa de la prueba.

## Comprobación

Las pruebas de teoría recalculan los ejemplos, las respuestas, las alternativas, los `siFuera` y las afirmaciones numéricas visibles desde entradas independientes. Recorren 400 semillas de cada momento generado y comprueban que existe una sola respuesta correcta, tanto numérica como después del formato. Emplean fracciones con enteros, balances de fuerzas y energía, bisección e integración de la fuerza. Las pruebas de órbitas verifican tangencia y aceleración; las de Kepler contrastan la evolución temporal con integración RK4 y las áreas con polígonos. Estas comprobaciones geométricas no sustituyen una inspección visual del navegador.

La práctica se contrasta en 400 semillas por cada uno de sus 18 tipos: 7200 casos, además de sus casos fijos y las semillas de papel. El oráculo no toma `respuesta` ni las alternativas como valor esperado. Los dos pares del curso tienen cuatro formas y 16 opciones verificadas aparte; sus verificadores se contrastan en 400 casos por par. Todos los errores nuevos se presentan como hipótesis.

| Comprobación final | Resultado |
| --- | --- |
| Teoría propia, figuras y pieza, incluida calidad 2 simulada en 400 semillas | 54/54; cero problemas del validador. |
| Teoría común: `contenido/teoria/teoria.test.js` | 164/164. |
| Práctica: contratos y oráculo independiente | 30/30; 7200 generaciones, 20 referencias y ocho papeles. |
| Integración propia y seis archivos comunes de catálogo/papel | 139/139: ocho propias y 131 comunes. |
| Avance y clasificación del repaso | 42/42. |
| `npm run -s catalogo` | Verde: 8 cursos, 158 unidades, 252 plantillas; prueba de 7 cursos con 70 ítems por forma. |
| `npm run test:corto`, una sola ejecución final | La sesión devolvió código 1. El entorno se desconectó antes de recuperar el registro final; no hay un total verificable ni una lista comprobada de fallas. No se da por aprobada. |
| Alcance, temas y marca de calidad | Siete temas cubiertos; `calidad` ausente. Los cambios se limitan a los archivos propios y los seis bloques compartidos enumerados abajo. |

Los comandos de integración fueron `npm run -s test:corto -- contenido/teoria/fisica/gravitacion-integracion.test.js catalogo/catalogo.test.js catalogo/pruebas/pruebas.test.js herramientas/papel-generador.test.js herramientas/papel-lectura.test.js herramientas/papel-opciones.test.js herramientas/papel-reglas.test.js` y `npm run -s test:corto -- nucleo/avance.test.js nucleo/repaso-tipos.test.js`. La práctica se comprobó con sus dos archivos `generador.test.js` y `oraculo.test.js`. Las pruebas propias de teoría abarcan los nueve archivos `gravitacion*.test.js` distintos del de integración y la prueba de la pieza.

Los controles comunes detectaron y se corrigieron una similitud de redacción con la práctica y una pista numérica por el coeficiente de una distancia. El par de escape ahora expresa 8000 km y 4000 km; su oráculo confirma que sigue usando las mismas distancias físicas y las mismas respuestas. No se modificaron los validadores para aceptar los casos. La revisión editorial también corrigió una explicación de error que confundía duplicar rapidez con duplicar energía, precisó campo frente a módulo y conservó los colores en las sustituciones.

## Investigación contrastada

La investigación disponible en esta base era la versión breve de etapa 10 y su LEEME. Se conservó su progresión desde la distancia central hasta los satélites y la comparación de períodos. Se amplió a seis ideas para separar campo, energía y escape y evitar que una actividad requiriera contenido todavía no enseñado.

Se contrastaron los modelos con OpenStax, la referencia del campo terrestre con NASA y las constantes con NIST. JPL respalda la unidad astronómica y la relación entre anomalía y posición orbital; la implementación trabaja en radianes y comprueba su movimiento por otra vía. El NGCI fundamenta dificultades conceptuales generales, sin atribuir a estudiantes peruanos frecuencias que el estudio no mide. Las referencias están en la propuesta.

Se descartó presentar una altura única de PerúSAT como dato actual: las referencias encontradas daban cifras distintas y contextos diferentes. Las alturas de las escenas son modelos declarados. También se corrigió la afirmación heredada de que todo lanzamiento no circular produce una elipse cerrada. Las cuentas se rehacen con constantes coherentes: no se combinan rapidez y período derivados de redondeos distintos. La referencia histórica de NASA se usa solo para Tycho y las fechas de Kepler; sus simplificaciones geométricas no se adoptan como explicación física.

## Decisiones y dudas para Gerson

1. Separar las seis ideas y conservar los cuatro identificadores anteriores. Facilita la progresión y conserva el avance de quien ya estudió.
2. Usar un cuerpo central esférico, dominante y fijo, y trayectorias exteriores. Quedan fuera sistemas de masas comparables, relatividad, transferencias e interiores planetarios.
3. Estudiar escape radial hacia afuera, sin aire ni empuje posterior. La energía cero describe el umbral; no implica alcanzar el infinito en tiempo finito.
4. Mantener `GM` visible, `a` para semieje mayor y `S` para áreas. Los colores conservan las magnitudes de la unidad; campo y energías se escriben en tinta.
5. Formular la predicción de Kepler con dos órbitas circulares, deducibles desde la idea anterior; después se generaliza la relación al semieje de la elipse.
6. Añadir definiciones locales de energía y referencia para no cambiar el significado del glosario de otra unidad.

No se detectó un conflicto crítico con una decisión escrita de Gerson. Quedan para sus notas el ritmo de las seis ideas y la comodidad de lectura móvil. La revisión interna no reemplaza la auditoría ni la lectura en frío de otra sesión.

## Archivos compartidos y alcance

Además de la teoría, sus pruebas, la pieza, la plantilla y los tres documentos propios de etapa 10, se tocaron únicamente estos bloques compartidos:

- `catalogo/cursos/fisica.json`: ficha de Gravitación, temas, prerrequisitos y práctica.
- `plantillas/gravitacion/plantilla.json`: `rehacer: true` para la escena anterior.
- `plantillas/dinamica-fuerzas/plantilla.json`: Gravitación añadida al arreglo existente de `rehacer`, conservando Estática y Dinámica.
- `nucleo/avance.js`: migración propia `GV`. Conserva la fecha y el estudio de las cuatro ideas anteriores, elimina una sola vez predicciones antiguas sin huella y no completa las dos ideas nuevas.
- `catalogo/pruebas/fisica.json`: dos pares propios de reserva y seis errores asociados.
- `catalogo/pruebas/verificar.js`: dos verificadores propios, sin modificar los anteriores.

No se editó `nucleo/repaso-tipos.js`: la plantilla nueva pertenece a una sola unidad y usa la clasificación existente. No se publican los archivos generados de `app/datos`; el catálogo se reconstruyó para verificar y la integración debe regenerarlo. No se tocaron los archivos prohibidos ni se publicaron capturas, registros temporales o binarios pesados.

La comparación con la base confirmó que las demás fichas, pares y errores se conservaron, y que los cambios de JavaScript compartido fueron inserciones propias. Antes de desconectarse el entorno, las huellas de los 26 archivos preparados distintos de propuesta e informe coincidían con sus versiones comprobadas. Los dos documentos finales se actualizan directamente en la rama. La publicación usa el árbol remoto como base y no elimina archivos ajenos.

## Lo que no se pudo cerrar

No hay capturas. Chrome está instalado, pero Playwright no estaba disponible y la única comprobación del servidor propio falló con `connect EACCES 127.0.0.1:4198`. Se cerró ese servidor por su PID. Quedan pendientes la inspección real a 390 px, el modo oscuro, la navegación táctil y el ancho de las ecuaciones.

La suite completa se inició una vez después de congelar el código. Su sesión devolvió código 1; inmediatamente después, el acceso al entorno falló con `exec-server transport disconnected` y el intento de recuperación agotó su tiempo. No fue posible leer `suite-completa.log`. Por tanto, no se atribuyen las fallas a otra unidad ni se afirma que sean únicamente de permisos. Hace falta recuperar ese registro o repetir la suite en un entorno operativo antes de integrar.

La escena heredada `dinamica-fuerzas` mantiene un generador que no filtra por unidad; se conserva como mesa adicional para rehacer. La nueva práctica sí filtra y tiene pruebas. No se cambió el generador compartido.

El entorno reconstruyó los archivos de ejecución desde el árbol exacto de `main`; el binario `rive.wasm` no pudo descargarse por la vía disponible. No se elimina del repositorio: las publicaciones se construyen sobre el árbol remoto y conservan todos los archivos ajenos.

Último commit de implementación: `79203f44805c1105d41e7965fe2be0cc9f05c261`. El commit que incorpora este informe queda identificado en el historial de la rama.
