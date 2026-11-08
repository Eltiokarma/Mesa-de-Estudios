# Trampas que se repiten en razonamiento matemático (habilidad lógico-matemática), San Marcos 2019-I a 2023-II

Fuente: `rm-a.jsonl` (330 preguntas en 22 exámenes: 19 solucionarios y 3 exámenes escaneados de 2021). Los conteos agrupan el campo `trampa` por familia. Los códigos son los de `docs/investigacion/aritmetica-razonamiento-ideas-erroneas.md` (AR1 a AR22 y RM1 a RM6).

Advertencia: los solucionarios casi nunca dicen cuál es el error típico. Muchas trampas salen de leer las alternativas (un distractor que coincide con un error reconocible) o de cómo se resuelve el problema. Son hipótesis razonables, no datos de alumnos.

| # | Trampa (en abstracto) | Veces | Código del informe |
|---|---|---|---|
| 1 | En certezas, calcular el caso favorable o el mejor caso, y no el peor (también: olvidar los elementos sin pareja o tomar los números grandes en vez de los chicos) | 14 | RM6 |
| 2 | En calendarios, olvidar los años bisiestos, contar como bisiesto un año secular (1900) o creer que el mismo día de la semana vuelve cada 4 años | 15 | nueva |
| 3 | Confundir puntos con intervalos (el error de la cerca): olvidar la toma inicial en pastillas, dividir entre campanadas y no entre intervalos, sumar 1 en un perímetro cerrado, confundir cortes con tramos, contar dos veces las estacas compartidas | 10 | nueva |
| 4 | En simetrías y reflexiones, cambiar el signo de la coordenada equivocada, reflejar respecto al origen y no al punto dado, o confundir la simetría central con la reflexión en un eje | 10 | nueva |
| 5 | En relojes y horas, confundir el tiempo transcurrido con el que falta, la hora marcada con la real, o calcular el adelanto sobre el tiempo marcado | 9 | nueva |
| 6 | En cortes mínimos, no superponer ni apilar las piezas entre corte y corte (o ignorar el límite de capas) | 8 | nueva |
| 7 | Contar dos veces las casillas, esquinas o cubitos que son comunes a dos filas o caras (y al revés: olvidar que se cuentan dos veces) | 6 | nueva |
| 8 | En dados, olvidar que las caras opuestas suman 7 | 5 | nueva |
| 9 | En ruedas y engranajes, tomar las vueltas como directamente proporcionales al radio o a los dientes | 5 | RM5 (y AR8) |
| 10 | Confundir izquierda y derecha (en la mesa circular o desde el punto de vista del que habla) | 5 | nueva |
| 11 | Aplicar un porcentaje a la base equivocada, no revertir una variación o sumar porcentajes de grupos de distinto tamaño | 5 | AR3 (y AR15) |
| 12 | En suficiencia de datos, creer que hacen falta todos los datos cuando basta uno | 5 | nueva |
| 13 | En pesadas, usar un solo platillo, sin restar pesas ni usar el producto como contrapeso | 4 | nueva |
| 14 | En rodamientos, tomar la longitud de la pista como recorrido del centro, o usar el radio o lado equivocado como radio de giro | 4 | nueva |
| 15 | En recorridos eulerianos, repetir líneas sin tener en cuenta el punto de inicio y el final fijados | 4 | nueva |
| 16 | Elegir una afirmación posible y no la que es necesariamente verdadera | 3 | nueva |
| 17 | Suponer que el horario no avanza mientras avanza el minutero | 3 | nueva |
| 18 | Responder un dato intermedio y no lo que se pide (el aumento y no el precio, x y no el año, el día del encuentro y no el siguiente) | 3 | AR5 (por analogía) |
| 19 | En cruces de río, olvidar los viajes de regreso o que alguien que no rema no puede volver solo | 3 | nueva |
| 20 | Ilusión de linealidad con escalas y semejanza: aplicar la escala al área, duplicar las fichas al duplicar el lado, dividir el perímetro a la mitad en cada paso | 3 | AR7 |
| 21 | Al contar rutas o lecturas, listar sin orden y perder caminos, o sumar las rutas de dos tramos en vez de multiplicarlas | 3 | AR18 |
| 22 | Con personajes que siempre mienten, negar mal una desigualdad («más de» pasa a «menos de» y no a «a lo más») | 2 | nueva |
| 23 | Olvidar convertir la escala del dibujo a la longitud real | 2 | nueva |
| 24 | En edades, creer que la diferencia cambia con el tiempo o que la razón se mantiene | 2 | RM3 |
| 25 | En lógica de clases y condicionales, concluir «algunos» en vez de «ninguno», o tomar el condicional como bicondicional | 2 | nueva |
| 26 | Usar el MCD donde va el MCM (relojes que vuelven a coincidir) | 1 | AR13 |
| 27 | Tratar como directa una relación inversa (gráfica de magnitudes) | 1 | AR8 |
| 28 | Plantear la razón al revés al traducir el enunciado | 1 | RM1 |
| 29 | Tomar la segunda fracción sobre el total y no sobre el resto | 1 | nueva (cercana a AR3) |

Otras que aparecen una sola vez (cubitos ocultos, faja cruzada que invierte el sentido, redondear hacia abajo un cociente de lotes, el líder que también recibe votos, primera solución diofántica sin minimizar, entre otras) quedan en el JSONL.

## Lo que esto dice del informe

- Del informe se usan sobre todo **RM6** (certezas), **RM5** (engranajes), **AR3** (base del porcentaje) y **AR7** (linealidad). RM1, RM2, RM4 y AR1, AR2 casi no aparecen porque San Marcos pone poco planteo puro y pocos porcentajes en este bloque.
- Las familias más frecuentes no están en el informe: **bisiestos** (2), **puntos contra intervalos** (3), **signos en simetrías** (4), **hora marcada contra hora real** (5), **cortes sin apilar** (6), **casillas comunes contadas dos veces** (7) y **caras opuestas de los dados** (8). Convendría agregarlas como hipótesis (RM7 en adelante).
