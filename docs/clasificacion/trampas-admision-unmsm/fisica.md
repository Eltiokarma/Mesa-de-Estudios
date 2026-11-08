# Física: trampas que se repiten (UNMSM 2019-I a 2027-I)

Base: 277 preguntas de física en `fisica.jsonl` (47 solucionarios y 3 exámenes escaneados de 2021). 255 llevan una trampa anotada. Casi ninguna sale escrita en el solucionario: Saco Oliveros resuelve sin comentar los distractores. Las deduje del distractor que da el número de un error reconocible. Los conteos son aproximados porque una pregunta puede caer en dos familias.

Códigos de `docs/investigacion/`: K, G (gráficas), C, P (cinemática); D (dinámica); E, W (estática y energía); M, G (gravitación), O, ON (momento, gravitación y ondas); F, Q, T (fluidos, calor y termodinámica); EL, C, MG, FM, R (electromagnetismo, moderna y refracción); OE (ondas electromagnéticas); S, E (óptica). «nueva» quiere decir que el informe no tiene un código que calce.

| # | Trampa (en abstracto) | Veces | Código del informe |
|---|---|---|---|
| 1 | Unidades sin convertir: km/h, ms, g↔kg, cm², MHz, prefijo kilo, rpm, mT, mA, kJ, cal↔J, L/min | ~17 | OE20 en las de ondas EM; nueva en el resto (no hay código general de unidades) |
| 2 | Proporcionalidad mal escalada: falta el cuadrado, la raíz o el ½ (periodo con g o L, intensidad o peso con la distancia, energía elástica o cinética sin ½, n frente a n² en asociaciones, distancia de frenado proporcional a v, potencial como 1/r²) | ~16 | G3 (gravedad); el resto nueva |
| 3 | Fotoeléctrico: la energía del fotón se toma como energía cinética, sin restar la función trabajo, o se resta al revés | 7 | nueva (cercana a FM2 y FM3) |
| 4 | Decibeles que se suman como números, o la intensidad repartida sobre un círculo en vez de una esfera | 6 | nueva |
| 5 | Confusiones entre periodo, frecuencia y ω: medio periodo leído como periodo entero, hertz usados como rad/s | 6 | nueva |
| 6 | Diámetro usado como radio (caudal, resistividad) | 5 | nueva |
| 7 | Normal igual al peso aunque haya una fuerza oblicua (rozamiento, trabajo, aceleración) | 5 | nueva (cercana a E11 por el diagrama de cuerpo libre incompleto) |
| 8 | Presión absoluta, manométrica y atmósfera confundidas (se da la absoluta en vez de la manométrica, no se resta la atmósfera, se asume la del nivel del mar) | 4 | nueva (F2 y F4 tratan otra cosa) |
| 9 | Condensadores asociados con las reglas de las resistencias | 4 | nueva |
| 10 | Rapidez media sacada como promedio de rapideces; temperatura de equilibrio como promedio sin ponderar | 4 | nueva (K4 es parecida) |
| 11 | Calor latente omitido o algún tramo de la curva de calentamiento olvidado | 4 | Q7 |
| 12 | Velocidad relativa: sumar o restar en el sentido equivocado, apuntar el bote directo al destino | 4 | nueva (K1 es lo más cercano) |
| 13 | Eficiencia que multiplica cuando debería dividir; uso de rapidez media o final en P = Fv | 4 | W15 (potencia mal entendida) |
| 14 | Tensión igual al peso del bloque colgante; g como aceleración del sistema | 3 | nueva (cercana a D3) |
| 15 | Al cambiar de medio cambia la frecuencia; o se supone λ fija | 3 | OE12; ON2 |
| 16 | Signos en mallas de Kirchhoff con dos fuentes | 3 | nueva (C10 es parecida: pilas opuestas) |
| 17 | Ley de Snell: ángulos medidos desde la superficie, índices invertidos, n tomado como v/c | 4 | R3 (desviación al revés); nueva para el ángulo desde la superficie |
| 18 | Escalas de temperatura: restar 32 en una variación, sumar 273 en vez de restar, confundir coincidencias entre escalas | 3 | nueva |
| 19 | Campo de hilos: suma escalar de campos perpendiculares u opuestos, punto nulo junto al hilo de más corriente, fórmula de la espira usada para el hilo | 5 | MG5; el resto nueva |
| 20 | Inducción: corriente sin circuito cerrado, campo inducido en el mismo sentido que el del imán, sentido de la corriente | 4 | MG8, MG9 |
| 21 | Espejos: imagen real en el convexo, objeto entre foco y espejo con imagen real, R usado como f | 4 | S4, S5 |
| 22 | Más masa, cae antes; la masa cambia la energía del MAS; la amplitud cambia el periodo | 3 | C2, D5, O1 |
| 23 | La misma masa acelera distinto con la misma fuerza en otro astro (masa y peso mezclados) | 2 | G4 |
| 24 | Ascensor: se resta la aceleración o la normal se iguala al peso | 2 | G8 (versión del ascensor) |
| 25 | Empuje que depende del peso del cuerpo o que desaparece en el fondo | 2 | F10, F14, F15 |
| 26 | Coeficiente de restitución aplicado a la altura en vez de a la velocidad | 2 | nueva (familia M) |
| 27 | Momento sumado sin signo en choques de frente | 2 | M2 |
| 28 | La forma o la inclinación del camino cambian la rapidez final sin roce | 2 | W1, W9, W10 |
| 29 | A velocidad constante, la fuerza aplicada «es la resultante»; el roce siempre se opone al movimiento del vehículo | 2 | D1, D3, W5 |
| 30 | En el MCU la velocidad es constante (vector frente a rapidez) | 1 | nueva |
| 31 | La rapidez horizontal cambia el tiempo de caída | 1 | P2 |
| 32 | Gráficas: el área de a-t se lee como distancia, y-t se confunde con y-x, error de pendiente o de signo | 4 | G4, G1, G2 |
| 33 | Relatividad: γ invertido, energía cinética clásica o energía total usadas en lugar de la cinética relativista | 4 | nueva (el informe no cubre relatividad) |

## Lo que más pesa para la app

- Las familias 1, 2, 5 y 6 (unidades, escalas de proporcionalidad, periodo y frecuencia, diámetro y radio) son errores de cálculo transversales a varios módulos y ningún informe los codifica. Son candidatas a códigos nuevos comunes a toda la física (por ejemplo, un «U» para unidades y un «PR» para proporcionalidades).
- Varias trampas tienen código en el informe pero ninguna escena las trabaja, porque su tema no tiene módulo: presión absoluta y manométrica (8), ley de Snell (17) y relatividad (33).
- Casos donde la clave del solucionario es dudosa (anotados en `nota`): 2023-II/04-02 #82 (ignora la masa efectiva del resorte), 2023-II/03-25 #89 (P = Fv con rapidez media), 2019-I/09-16 #106 (la resolución usa otra distancia) y 2021/09-04 escaneado #84 (el coeficiente de dilatación solo da una alternativa si se triplica).
