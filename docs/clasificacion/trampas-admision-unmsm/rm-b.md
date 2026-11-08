# Trampas en razonamiento matemático (UNMSM 2024-I a 2027-I)

Fuente: `clasif/rm-b.jsonl` (320 preguntas, 27 solucionarios). 229 preguntas tienen una trampa anotada.

Aviso: los solucionarios casi nunca nombran el error del distractor. Las trampas salen de la forma del problema, de las alternativas y del paso clave de la resolución; son hipótesis para las predicciones, no datos medidos. Códigos según `docs/investigacion/aritmetica-razonamiento-ideas-erroneas.md` (AR1–AR22, RM1–RM6).

| Trampa (en abstracto) | Veces | Código | Temas donde aparece |
|---|---|---|---|
| Certezas: calcular el caso favorable y no el peor caso | 12 | RM6 | Certezas con suma (4), Certezas por colores (2), Certezas: llaves y candados (1) |
| Verdades y mentiras: no partir de las afirmaciones contradictorias | 11 | nueva | Verdades y mentiras (5), Veraces y mentirosos (cuántos mienten) (2), Verdades y mentiras con tabla de respuestas (2) |
| Rotaciones y rodamientos: radio o ángulo equivocado, o no reducir giros a menos de una vuelta | 11 | nueva | Región generada por rotación (3), Rodamiento: recorrido del centro (2), Giro y superposición de láminas (2) |
| Calendario: bisiestos mal contados (29 de febrero, años seculares) o día de partida | 11 | sin código (tabla «sin respaldo»: calendarios) | Día de la semana de una fecha (8), Días de la semana en un mes (2), Certezas: palomar (cumpleaños) (1) |
| Recorrido euleriano: repetir tramos que no son los más cortos entre vértices impares | 9 | nueva | Recorrido euleriano mínimo (8), Calles a repetir (Euler) (1) |
| Conteo de figuras: contar solo las simples, olvidar invertidas, giradas o zonas comunes | 10 | AR18 (parcial) | Conteo de cuadrados (3), Conteo de triángulos (3), Conteo de cuadriláteros (3) |
| Reloj: ignorar que el horario avanza con el minutero | 9 | AR7 (tabla «sin respaldo»: ángulo entre agujas) | Hora que marca el reloj (7), Ángulo entre agujas (2) |
| Simetría: eje equivocado, central tomada como axial o distancia al eje mal medida | 9 | nueva | Simetría respecto a una recta (5), Simetría central y axial (2), Recorrido mínimo con reflexiones (1) |
| Arreglos numéricos: no contar dos veces los vértices o casillas compartidas | 8 | nueva | Arreglo en polígono (suma por lado) (4), Arreglo con sumas en línea (4) |
| Cortes: cortar pieza por pieza sin apilar ni superponer | 8 | nueva (pariente de «cortes contra piezas», sin código) | Cortes con apilado (6), Cortes con guillotina y capas (1), Cortes en estructura de alambre (1) |
| Diagrama de flujo: salir del bucle un paso antes o después | 7 | nueva | Diagrama de flujo (7) |
| Dados: olvidar que las caras opuestas suman siete o que la cara de abajo no se ve | 7 | nueva | Dado que rueda (4), Dados apilados (2), Caras no visibles de dados (1) |
| Cubos: contar dos veces los cruces de túneles o caras pegadas como visibles | 7 | nueva | Cubo agujereado (3), Caras pintadas de cubos (1), Cubos para completar una caja (1) |
| Frecuencia de sucesos: no contar la toma inicial (n tomas = n − 1 intervalos) | 6 | nueva (pariente de «cortes contra piezas», sin código) | Pastillas cada cierto tiempo (6) |
| Pesadas: pesar lo pedido directamente sin usar el complemento ni lo ya pesado | 6 | nueva (tabla «sin respaldo»: pesadas) | Mínimo de pesadas con pesas (5), Pesas en una sola pesada (1) |
| Gráficos y porcentajes: base equivocada o ángulo leído como porcentaje | 6 | AR3 | Gráfico de sectores (4), Gráfico de barras (1), Lectura de tablas con porcentaje (1) |
| Orden circular: confundir derecha e izquierda | 5 | nueva | Ordenamiento circular (5) |
| Conteo de rutas: sumar en vez de multiplicar por tramos | 5 | nueva (ligada a AR18) | Conteo de rutas sin repetir punto (3), Conteo de rutas con paso obligado (2) |
| Inducción: suponer crecimiento lineal | 4 | RM2 (y AR7) | Inducción con figuras (áreas) (1), Inducción con figuras (1), Inducción con figuras (ángulos) (1) |
| Planteo: traducir mal el enunciado (edades en el futuro, fracciones del resto, penalidad) | 5 | RM1 (y AR3) | Edades (1), Planteo con progresión aritmética (1), Sistema de ecuaciones con figura (diana) (1) |
| Adelantos y atrasos: sumar/restar mal el error o medirlo con el tiempo marcado | 4 | nueva | Adelantos y atrasos (3), Adelantos y atrasos con calendario (1) |
| Conteo: enumerar sin sistema y olvidar casos | 4 | AR18 | Conteo de rutas sin repetir punto (3), Conteo de cuadriláteros (1) |
| Papel doblado: no multiplicar el corte por las capas | 4 | nueva | Papel doblado y cortado (4) |
| Camino mínimo sobre una superficie: no desarrollarla o desarrollar mal | 4 | nueva | Camino mínimo sobre superficie (4) |
| Rumbos: medir desde el eje equivocado o invertir el sentido de la dirección | 4 | nueva | Rumbos y direcciones (4) |
| Semejanza con fichas: usar todas las fichas sin ver que el número debe ser un cuadrado (k²) | 3 | AR7 | Semejanza con fichas (3) |
| Engranajes y poleas: proporción directa donde es inversa o desplazamientos iguales | 3 | RM5 | Ruedas en contacto: coincidencias (1), Sistema de poleas (1), Engranajes y poleas (1) |
| Parentesco: responder un eslabón intermedio | 2 | nueva | Parentesco (2) |
| Situaciones deportivas: aceptar un marcador que contradice la tabla | 1 | nueva | Situaciones deportivas (1) |

Sueltas (sin familia): 44. Ejemplos: Olvidar que el ciclo empieza en un elemento intermedio; Ignorar la condición de desigualdad y de pesos enteros; Dividir volúmenes sin ver que las piezas no encajan exactas; Confundir tiempo transcurrido con el que falta; Olvidar restar la lectura común contada dos veces; Contar el punto de partida como encuentro; Contar cubos atravesados en vez de caras; Equivocar el residuo y tomar el bloque completo; Olvidar contar los tramos rectos o un arco compartido; Responder la hora y no lo que falta del turno; Tratarlo como aditivo (cuadrado mágico multiplicativo, 2); repetir fichas únicas del dominó (2); olvidar que dos vecinos por vértice también cuentan al colorear.

## Lectura rápida

- Con código del informe: RM6 (certezas, peor caso) es la más repetida con respaldo; RM5 (engranajes) aparece poco; RM2/AR7 en inducción y semejanza; AR18 en conteo de rutas y figuras; AR3 en gráficos.
- Nuevas que vale la pena volver hipótesis con código: horario que avanza (ya en la tabla «sin respaldo»), caras opuestas del dado, derecha/izquierda en la mesa circular, partir de la contradicción en verdades y mentiras, vértices contados dos veces en arreglos por lado, toma inicial en frecuencia de sucesos, apilar en cortes, multiplicar por tramos en rutas y radio equivocado en rodamientos.
- Calendarios: el error de bisiestos (incluidos los años seculares como 1900 o 2100) aparece en casi todas las preguntas de calendario; el informe lo tiene en la tabla «sin respaldo» sin código.
