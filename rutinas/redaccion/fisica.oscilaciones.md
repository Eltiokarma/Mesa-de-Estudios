# Redacción de Oscilaciones: significado, motivo y caso

Se aplica la actualización del encargo del 27 nov y el punto 4 de `docs/metodo/unidad/redaccion-delegada.md`. Modelo leído: `fisica.movimiento-parabolico-y-circular`, especialmente la primera idea, en `main` `1da59851801fd377337c8be1e984850545ad71bb`.

**Estado: revisión terminada. Listo para integrar tras la auditoría de otra sesión.** Esta pasada no concede `calidad: 2` ni sustituye al auditor o al lector en frío.

## Qué se cambió

- Las seis reglas explican las magnitudes, por qué se aplica la relación y un caso: contar un vaivén, volver al equilibrio, situarse dentro del ciclo, comparar masa y rigidez, medir un péndulo y repartir la energía.
- Las condiciones continúan la frase «Vale si» y dicen qué deja de valer al aparecer rozamiento, variar la amplitud, usar un ángulo grande o medir desde una referencia distinta.
- Lee y Mira preparan el vocabulario y explican las operaciones. La fase acumulada se obtiene multiplicando frecuencia angular por tiempo antes de sumar la fase inicial; no se suman magnitudes con unidades diferentes.
- Los 90 ejemplos y los generadores de Resuelve y Ahora tú explican el motivo de las operaciones y qué significa el resultado. Los errores nombran el razonamiento equivocado; se retiraron las aperturas mecánicas con «Bien» o «Identificaste».
- La práctica conserva sus 18 familias y ocho problemas de papel, con pasos y explicaciones de error desarrollados. Datos conserva valores, condiciones y equivalencias, sin fórmulas del procedimiento.
- El glosario respeta sus límites propios, que no aumentaron: simple 14 palabras, definición 20 y cada ejemplo 20. «Punto de retorno» se hereda de Gravitación; aquí se introduce «amortiguamiento» como disminución del vaivén que el modelo ideal desprecia, sin añadir ecuaciones.
- La lectura cruzada corrigió tres precisiones: el distractor de rigidez multiplica por el factor de cambio; el resorte comprimido empuja; una rapidez positiva no permite afirmar que el bloque se está alejando del equilibrio.

## Seis muestras de antes y después

### 1. Regla del ciclo

**Antes:** «La amplitud mide del equilibrio a un extremo. El período es tiempo por ciclo; la frecuencia, ciclos por tiempo. Un ciclo recorre cuatro amplitudes».

**Después:** «La amplitud mide del equilibrio a un extremo. El período es el tiempo de un ciclo: repartir cuatro segundos entre ocho ciclos da medio segundo. La frecuencia cuenta ciclos por segundo. El recorrido suma cuatro amplitudes por ciclo, porque el bloque va al otro extremo y regresa, recorriendo dos amplitudes en cada tramo».

### 2. Regla de fuerza y aceleración

**Antes:** «En el MAS, la fuerza neta es proporcional al desplazamiento y apunta al equilibrio. La aceleración sigue la fuerza; la velocidad puede apuntar en otro sentido».

**Después:** «La elongación indica cuánto se separa el bloque del equilibrio, con signo. La constante elástica expresa la rigidez: cuanto más se deforma el resorte, mayor fuerza ejerce. El signo menos indica que intenta devolverlo al equilibrio. Dividimos esa fuerza entre la masa para obtener la aceleración: si está a la izquierda, acelera hacia la derecha».

### 3. Error al invertir ciclos y tiempo

**Antes:** «Invierte ciclos y tiempo».

**Después:** «Has dividido los ciclos entre los segundos. Eso calcula la frecuencia; para saber cuánto dura un ciclo, reparte el tiempo entre los ciclos».

### 4. Error al conservar el signo

**Antes:** «Bien: triplicas el módulo. Mantener el signo anterior daría −9 m/s²».

**Después:** «Has triplicado la aceleración, pero conservaste el sentido anterior: así sale −9 m/s². El bloque ahora está al otro lado; para apuntar al equilibrio, la aceleración también debe cambiar de sentido».

### 5. Condición de la fuerza del resorte

**Antes:** «Resorte ideal horizontal, masa constante y sin rozamiento. La elongación se mide desde el equilibrio».

**Después:** «el resorte es horizontal e ideal, el bloque mantiene su masa y no hay rozamiento. La elongación se mide desde el equilibrio. Si aparece roce, hay que incluir su fuerza: el resorte ya no aporta toda la fuerza neta».

### 6. Despeje de la rigidez

**Antes:** «Despejamos la constante elástica conservando el signo del desplazamiento».

**Después:** «Dividimos la fuerza por la elongación y conservamos el signo menos de la ley del resorte. La rigidez resulta positiva: indica cuánta fuerza corresponde a cada metro de deformación».

## Comprobaciones de esta pasada

Los tres bloques de teoría compararon 400 semillas por momento e idea contra la entrega anterior: 4800 generaciones y 90 ejemplos. En esa fase se conservaron casos, datos, respuestas, alternativas y figuras. La inspección posterior corrigió etiquetas, colores y equivalencias de Datos; conservó los valores físicos. Las ecuaciones finales volvieron a contrastarse con los oráculos independientes.

La práctica comparó 7208 casos y 28 832 opciones, incluidos los ocho papeles: ningún cambio de datos, respuestas, valores, colores ni ecuaciones. Sus 64 pruebas propias pasaron con el texto revisado.

Otros lectores revisaron los textos nuevos, incluidos los ejemplos difíciles y al menos 20 semillas por familia, buscando afirmaciones falsas y respuestas adelantadas. Sus hallazgos concretos se incorporaron; la igualdad numérica por sí sola no se tomó como prueba de una buena explicación.

Las pruebas propias que exigían aperturas literales o topes antiguos se adaptaron al contrato actual. Se mantienen el cálculo independiente de cada error, la lectura del valor escrito, la respuesta única y las condiciones físicas; no se eliminaron esos controles para acomodar la redacción.

La revisión visual abrió las 264 capturas de momentos y ejemplos, en claro y oscuro, y volvió a mirar las imágenes afectadas después de corregirlas. Se retiraron rótulos booleanos, se conservó el color de las incógnitas, se ajustaron las equivalencias a cada procedimiento y se distinguió el estado inicial del que muestra Mira de Energía. La medición ampliada cubrió 196 pantallas y 1351 renglones sin hallazgos; el último enunciado se midió aparte en cuatro páginas y 274 renglones, también sin hallazgos.

## Alcance visual

Chrome y Playwright ejecutan los archivos reales de la app mediante respuestas desde el checkout: no hay servidor HTTP ni solicitudes externas. Se usan las herramientas originales con un preload temporal, sin modificar el código del producto. Esto permite revisar DOM, SVG, CSS y ecuaciones. No verifica despliegue, red, autenticación, sincronización ni service workers.

Las capturas, los datos de lectura y los registros de comparación permanecen en `work/cola-fisica/`, fuera del repositorio. Los archivos finales de teoría, práctica, pruebas y documentación se detallan en `docs/etapa11/informe-fisica.md`.

Las 100 pruebas propias pasaron después de los ajustes visuales; tras la última frase se repitieron Gráficas y el validador completo: 9/9. Las 223 pruebas comunes pasaron. La suite completa registró 13 219 aprobadas, 7 omitidas y 11 fallos; el documento ausente se restauró de main y sus 9 pruebas pasaron. Quedan diez fallos ajenos de conexión de sesión. El alcance, los comandos y las rutas están en `docs/etapa11/informe-fisica.md`.
