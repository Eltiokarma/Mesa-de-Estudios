# Errores de diseño: Movimiento armónico simple

26 de noviembre de 2026. Unidad fisica.oscilaciones; plantilla fis-oscilaciones.

Los códigos siguientes son **hipótesis didácticas** de operaciones equivocadas. No son frecuencias observadas ni diagnósticos de postulantes peruanos. No se atribuyen a una investigación empírica. Cada alternativa se calcula a partir de los datos del caso y explica la operación que produjo su propio valor.

El documento es la procedencia local de esos códigos, no una fuente de los principios físicos. La teoría de la unidad presenta sus condiciones y relaciones; la comprobación de respuestas, operaciones, unidades e igualdades está en plantillas/fis-oscilaciones/oraculo.test.js, por un camino independiente del generador.

Las 18 familias abarcan las seis ideas, con tres niveles por idea. Cada caso aporta tres distractores pertinentes, sin números de relleno. Se rechaza cualquier coincidencia con la respuesta o entre opciones, también después del formato visible. Las variantes de conteo y conexión de resortes conservan el sentido específico de su operación.

En primer-paso, usar la siguiente llegada compatible contradice «primer instante»; usar 4π/T duplica la frecuencia angular; cambiar el extremo de partida cambia el estado inicial. Estas operaciones evitan que la respuesta correcta sea siempre un extremo numérico.

| Código | Operación hipotética |
| --- | --- |
| OSP-ACELERACION-MASA-MASA_DOS_VECES | Dividiste dos veces entre la masa. |
| OSP-ACELERACION-MASA-SIGNO | Cambiaste el sentido de la fuerza neta. |
| OSP-ACELERACION-MASA-SIN_MASA | Diste la fuerza como si fuera aceleración. |
| OSP-AMPLITUD-DESDE-ESTADO-POSICION | Tomaste la distancia actual como amplitud. |
| OSP-AMPLITUD-DESDE-ESTADO-SOLO_CINETICA | Omitiste la energía elástica del estado conocido. |
| OSP-AMPLITUD-DESDE-ESTADO-SUMA_DISTANCIAS | Sumaste la distancia actual y la amplitud calculada solo con energía cinética. |
| OSP-CONTEO-PERIODO-CUENTA_LLEGADAS | Contaste llegadas en vez de intervalos. |
| OSP-CONTEO-PERIODO-INVIERTE | Invertiste tiempo y cantidad de ciclos. |
| OSP-CONTEO-PERIODO-NO_RESTA_INICIO | Omitiste restar el instante inicial. |
| OSP-ENERGIA-TOTAL-MEDIO_DOS_VECES | Dividiste dos veces entre dos. |
| OSP-ENERGIA-TOTAL-SIN_CUADRADO | No elevaste la amplitud al cuadrado. |
| OSP-ENERGIA-TOTAL-SIN_MEDIO | Omitiste dividir entre dos. |
| OSP-ESTADO-CUARTOS-CUARTO_EXTRA | Sumaste un cuarto de período que no transcurrió. |
| OSP-ESTADO-CUARTOS-CUENTA_INICIO | Incluiste el estado inicial en el conteo y avanzaste un cuarto menos. |
| OSP-ESTADO-CUARTOS-EXTREMO_OPUESTO | Empezaste en el extremo opuesto. |
| OSP-EXTREMOS-AMPLITUD-ENTRE_EXTREMOS | Mediste entre los extremos. |
| OSP-EXTREMOS-AMPLITUD-POSICION_IZQUIERDA | Diste la posición negativa del extremo. |
| OSP-EXTREMOS-AMPLITUD-RECORRIDO | Diste el recorrido de un ciclo completo. |
| OSP-FUERZA-POSICION-DOBLE_FUERZA | Contaste dos veces la fuerza del único resorte. |
| OSP-FUERZA-POSICION-PROMEDIO | Promediaste con cero en vez de evaluar este instante. |
| OSP-FUERZA-POSICION-SIGNO | Omitiste el signo restaurador. |
| OSP-MASA-DOS-ESTADOS-INVIERTE_MASA | Dividiste aceleración entre fuerza. |
| OSP-MASA-DOS-ESTADOS-MANTIENE_FUERZA | Conservaste la fuerza del primer estado. |
| OSP-MASA-DOS-ESTADOS-POSICIONES_INVERTIDAS | Invertiste las posiciones al trasladar la fuerza. |
| OSP-PENDULO-LONGITUD-MEDIO_CICLO | Usaste medio período antes de elevarlo al cuadrado. |
| OSP-PENDULO-LONGITUD-SIN_CUADRADO | No elevaste el período al cuadrado. |
| OSP-PENDULO-LONGITUD-SIN_DOS | Omitiste el dos del factor 2π. |
| OSP-PENDULO-PERIODO-DOS_CICLOS | Contaste dos ciclos completos. |
| OSP-PENDULO-PERIODO-MEDIO_CICLO | Contaste solo medio ciclo. |
| OSP-PENDULO-PERIODO-SIN_RAIZ | Omitiste extraer la raíz. |
| OSP-PENDULO-RAZON-IGNORA_GRAVEDAD | Omitiste el cambio de gravedad. |
| OSP-PENDULO-RAZON-INVIERTE | Invertiste el orden de los períodos. |
| OSP-PENDULO-RAZON-SIN_RAIZ | Omitiste extraer la raíz. |
| OSP-PRIMER-PASO-FRECUENCIA_DOBLE | Usaste 4π/T en vez de 2π/T. |
| OSP-PRIMER-PASO-OTRO_EXTREMO | Partiste del extremo opuesto. |
| OSP-PRIMER-PASO-VUELTA_EXTRA | Elegiste la llegada siguiente a ese mismo estado. |
| OSP-RAPIDEZ-POSICION-ELASTICA | Usaste la energía del resorte como cinética. |
| OSP-RAPIDEZ-POSICION-SIN_DOS | Omitiste el dos al despejar desde la energía cinética. |
| OSP-RAPIDEZ-POSICION-TOTAL | Usaste toda la energía mecánica como cinética. |
| OSP-RECORRIDO-MIXTO-DESPLAZAMIENTO | Diste el desplazamiento entre los extremos, no la distancia recorrida. |
| OSP-RECORRIDO-MIXTO-MEDIO_EXTRA | Contaste otro medio ciclo que no transcurrió. |
| OSP-RECORRIDO-MIXTO-OMITE_MEDIO | Omitiste el medio ciclo final. |
| OSP-RESORTE-PERIODO-DOS_CICLOS | Sumaste el tiempo de dos ciclos. |
| OSP-RESORTE-PERIODO-SIN_2PI | Omitiste el factor 2π. |
| OSP-RESORTE-PERIODO-SIN_RAIZ | Omitiste extraer la raíz. |
| OSP-RESORTE-VERTICAL-LONGITUD_TOTAL | Tomaste la longitud total como alargamiento. |
| OSP-RESORTE-VERTICAL-MEDIO_CICLO | Contaste solo medio ciclo. |
| OSP-RESORTE-VERTICAL-SIN_RAIZ | Omitiste extraer la raíz al calcular el período. |
| OSP-RESORTES-CONECTADOS-CONEXION_OPUESTA | Usaste la otra conexión. |
| OSP-RESORTES-CONECTADOS-DOS_CICLOS | Contaste dos ciclos completos. |
| OSP-RESORTES-CONECTADOS-MEDIO_CICLO | Contaste solo medio ciclo. |
| OSP-RESORTES-CONECTADOS-SOLO_PRIMERO | Conservaste únicamente el primer resorte. |
| OSP-VELOCIDAD-FASE-COSENO | Usaste coseno en lugar de seno. |
| OSP-VELOCIDAD-FASE-SIGNO | Omitiste el signo menos de la velocidad. |
| OSP-VELOCIDAD-FASE-SIN_OMEGA | Omitiste multiplicar por la frecuencia angular. |

Todos estos códigos tienen respaldo: hipotesis. El generador publica la ruta de este archivo en cada alternativa incorrecta. Su valor y su explicación se comprueban en 400 semillas por tipo; los números de la explicación corresponden a la alternativa de ese caso.

## Hipótesis de los pares de reserva del curso

Estos seis códigos describen operaciones inventadas para las opciones de `osc-01` y `osc-02`.
Son hipótesis didácticas, no evidencia de frecuencia ni diagnóstico de postulantes peruanos.
Las cuatro formas y cada operación se comprueban por un cálculo independiente en
`contenido/teoria/fisica/oscilaciones-integracion.test.js` (400 casos por verificador).

| Código | Operación del distractor |
| --- | --- |
| OS11-R-SIN-MASA | Conserva el período inicial T₁ pese al cambio de masa. |
| OS11-R-LINEAL | Usa T₁·m₂/m₁ en vez de la raíz de la razón de masas. |
| OS11-R-INVERSA | Usa T₁·m₁/m₂. |
| OS11-P-SIN-RAIZ | Multiplica N₂·T₁ por kL/kG sin sacar la raíz. |
| OS11-P-INVIERTE-G | Usa N₂·T₁·√(kL·kG), con la gravedad invertida. |
| OS11-P-SIN-LONGITUD | Usa N₂·T₁/√kG, omitiendo el cambio de longitud. |

Aquí kL y kG son los factores de cambio de longitud y gravedad. Los datos de los pares
no incluyen ninguna fórmula de solución. En el resorte se conserva π exacta en las opciones;
en el péndulo se dan solo razones, sin imponer longitudes o gravedades absolutas incompatibles con el período medido.
